/* ==========================================================================
   POST /api/login  { user, password, role?, remember? }
     → 200 { ok: true, role, workspace }          sessiya cookie o'rnatildi
     → 200 { ok: false, choose: [roles…] }        bir nechta ish maydoni — tanlash kerak
     → 401 { error: 'auth' } | 429 | 500 env
   --------------------------------------------------------------------------
   YAGONA KIRISH NUQTASI — barcha rollar shu yerdan: student · controller ·
   teacher · english. Foydalanuvchi rol tanlamaydi: rol autentifikatsiya
   qilingan hisobdan aniqlanadi (login nomi qaysi rolning hisobiga to'g'ri
   kelsa va parol AYNAN o'sha rolning hash'iga mos kelsa). Hamma rollar
   hisoblanadi — javob vaqti "qaysi login mavjud"ni aytib qo'ymasin.

   Bir hisob bir nechta rolga ega bo'lishi mumkin (bir xil login+parol bir
   nechta rolda sozlangan): unda cookie berilmaydi, `choose` ro'yxati
   qaytadi; mijoz "Ish maydonini tanlash" ekranini ko'rsatadi va `role`
   bilan qayta so'raydi — server parolni QAYTA tekshiradi (mijoz aytgan
   rolga ishonilmaydi: faqat mos kelganlar ichidan).

   remember=false → cookie brauzer sessiyasigacha (Max-Age yo'q), 1 kun.
   Xato urinishlar IP bo'yicha: 15 daqiqada 10 tadan keyin 429.
   ========================================================================== */
'use strict';
const L = require('./_lib');

const MAX_FAILS = 10;
const WINDOW_SEC = 15 * 60;
const WORKSPACE = { learner: '/', controller: '/controller', teacher: '/controller', english: '/controller' };

module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });

  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });

  let body;
  try { body = await L.readJSON(req, 4 * 1024); } catch (e) { return L.json(res, 400, { error: 'body' }); }
  const user = String((body && body.user) || '').trim();
  const password = String((body && body.password) || '');
  const want = body && body.role ? String(body.role) : '';
  const remember = !(body && body.remember === false);
  if (!user || !password) return L.json(res, 400, { error: 'fields' });

  const failKey = 'uzla:fail:' + L.clientIp(req);
  try {
    const fails = parseInt(await L.store.get(failKey), 10) || 0;
    if (fails >= MAX_FAILS) return L.json(res, 429, { error: 'locked', retryMin: Math.ceil(WINDOW_SEC / 60) });
  } catch (e) { /* baza yiqilsa — login baribir tekshiriladi */ }

  /* Barcha rollar bo'yicha moslik — hammasi hisoblanadi */
  const matched = [];
  const okLearner = user === (await L.currentUser()) && L.verifyPassword(password, await L.currentHash());
  if (okLearner) matched.push('learner');
  for (const role of L.STAFF_ROLES) {
    const hash = await L.staffHash(role);
    const okUser = !!hash && user === L.staffUser(role);
    const okPass = hash ? L.verifyPassword(password, hash) : false;
    if (okUser && okPass) matched.push(role);
  }

  if (!matched.length) {
    try { await L.store.incrTTL(failKey, WINDOW_SEC); } catch (e) {}
    return L.json(res, 401, { error: 'auth' });
  }
  try { await L.store.del(failKey); } catch (e) {}

  let role = matched[0];
  if (matched.length > 1) {
    if (!want) return L.json(res, 200, { ok: false, choose: matched, user: user });
    if (matched.indexOf(want) < 0) return L.json(res, 403, { error: 'workspace' });   // so'ralgan rol bu hisobda yo'q
    role = want;
  } else if (want && want !== role) {
    return L.json(res, 403, { error: 'workspace' });
  }

  if (role === 'learner') L.setSessionCookie(res, user, remember);
  else L.setStaffCookie(res, user, role, remember);
  return L.json(res, 200, { ok: true, user: user, role: role, workspace: WORKSPACE[role] });
};
