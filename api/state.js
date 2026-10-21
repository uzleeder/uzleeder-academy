/* ==========================================================================
   /api/state — progressning bulutdagi nusxasi
   --------------------------------------------------------------------------
   GET            → 200 { rev, savedAt, state }     (state null bo'lishi mumkin)
   PUT {baseRev, state}
                  → 200 { rev, savedAt }            saqlandi
                  → 409 { rev, savedAt, state }     boshqa qurilma oldinroq yozgan

   Optimistik nazorat: mijoz oxirgi ko'rgan `rev` ni yuboradi. Serverdagi rev
   boshqa bo'lsa — kimdir (boshqa kompyuter) orada yozgan. Ustidan yozmaymiz,
   409 bilan hozirgi holatni qaytaramiz; mijoz birlashtirib qayta yuboradi.
   Bu eskirgan tab'dan kelgan yozuv bugungi ishni o'chirib yuborishining
   oldini oladi.

   GET→SET orasida atomarlik yo'q — bitta foydalanuvchi ikkita kompyuterda
   AYNI sekundda yozmaydi, shuning uchun Lua skript ortiqcha.
   ========================================================================== */
'use strict';
const L = require('./_lib');

const KEY = 'uzla:state';
const MAX_BYTES = 1024 * 1024;   // 1 MB — real holat ~50 KB

module.exports = async function (req, res) {
  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });

  const session = L.sessionOf(req);
  if (!session) return L.json(res, 401, { error: 'auth' });

  if (req.method === 'GET') {
    const raw = await L.store.get(KEY);
    const doc = raw ? JSON.parse(raw) : { rev: 0, savedAt: 0, state: null };
    return L.json(res, 200, doc);
  }

  if (req.method === 'PUT') {
    let body;
    try { body = await L.readJSON(req, MAX_BYTES); } catch (e) { return L.json(res, 413, { error: 'size' }); }
    if (!body || typeof body.state !== 'object' || body.state === null) return L.json(res, 400, { error: 'shape' });
    const baseRev = Number(body.baseRev) || 0;

    const raw = await L.store.get(KEY);
    const cur = raw ? JSON.parse(raw) : { rev: 0, savedAt: 0, state: null };
    if (cur.rev !== baseRev) return L.json(res, 409, cur);

    const next = { rev: cur.rev + 1, savedAt: Date.now(), state: body.state };
    await L.store.set(KEY, JSON.stringify(next));
    return L.json(res, 200, { rev: next.rev, savedAt: next.savedAt });
  }

  return L.json(res, 405, { error: 'method' });
};
