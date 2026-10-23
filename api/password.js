/* ==========================================================================
   POST /api/password   { current, next }  →  200 {ok, role}  |  400  |  401  |  429
   --------------------------------------------------------------------------
   HAR BIR HISOB O'Z PAROLINI O'ZI ALMASHTIRADI — o'quvchi ham, xodim
   (controller) ham shu bitta endpoint orqali. Kim ekani
   cookie'dagi imzolangan tokendan (rol) olinadi: o'quvchi → uzla:auth:hash,
   xodim → o'z rolining hash kaliti. Boshqa hisobning parolini o'zgartirib
   bo'lmaydi. Talablar:
     • kirilgan sessiya (cookie) — begona odam so'ray olmaydi
     • joriy parol to'g'ri — o'g'irlangan cookie bilan ham almashtirib bo'lmaydi
     • yangi parol kamida 6 belgi, joriydan farqli
   Yangi hash bazaga (`uzla:auth:hash`) yoziladi va shu ondan boshlab
   login shu hash bilan tekshiriladi — Vercel env'ga tegish shart emas.
   Sessiya cookie'si SESSION_SECRET bilan imzolangan, parolga bog'liq emas —
   boshqa qurilmalarda chiqib ketmaydi.
   Xato urinishlar login bilan bir xil IP sanagichiga yoziladi (10/15 daq).
   ========================================================================== */
'use strict';
const L = require('./_lib');

const MAX_FAILS = 10;
const WINDOW_SEC = 15 * 60;
const MIN_LEN = 6;

module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });

  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });

  const role = L.roleOf(req);
  if (!role) return L.json(res, 401, { error: 'auth' });
  const staff = role !== 'learner';

  let body;
  try { body = await L.readJSON(req, 4 * 1024); } catch (e) { return L.json(res, 400, { error: 'body' }); }
  const current = String((body && body.current) || '');
  const next = String((body && body.next) || '');
  if (!current || !next) return L.json(res, 400, { error: 'fields' });
  if (next.length < MIN_LEN) return L.json(res, 400, { error: 'short', min: MIN_LEN });
  if (next.length > 128) return L.json(res, 400, { error: 'long' });
  if (next === current) return L.json(res, 400, { error: 'same' });

  const failKey = 'uzla:fail:' + L.clientIp(req);
  try {
    const fails = parseInt(await L.store.get(failKey), 10) || 0;
    if (fails >= MAX_FAILS) return L.json(res, 429, { error: 'locked', retryMin: Math.ceil(WINDOW_SEC / 60) });
  } catch (e) {}

  const curHash = staff ? await L.staffHash(role) : await L.currentHash();
  if (!L.verifyPassword(current, curHash)) {
    try { await L.store.incrTTL(failKey, WINDOW_SEC); } catch (e) {}
    return L.json(res, 401, { error: 'wrong' });
  }

  try {
    await L.store.set(staff ? L.STAFF[role].hashKey : L.HASH_KEY, L.hashPassword(next));
  } catch (e) {
    return L.json(res, 502, { error: 'store', detail: String(e.message || e) });
  }
  try { await L.store.del(failKey); } catch (e) {}
  return L.json(res, 200, { ok: true, role: role });
};
