/* GET /api/health — sozlash tekshiruvi. Hech qanday sir qaytarmaydi:
   qaysi baza tanlangani, qaysi o'zgaruvchi yetishmayotgani va bazaga
   ulanish ishlayaptimi. Brauzerda ochib ko'rsa bo'ladi.                  */
'use strict';
const L = require('./_lib');

module.exports = async function (req, res) {
  const missing = L.missingEnv();
  const out = { ok: missing.length === 0, backend: L.backend, missing: missing, db: 'skipped',
    /* Bulut fayl ombori (kino, ovoz, rasm): token bo'lmasa fayllar faqat qurilmada qoladi */
    blob: process.env.ACADEMY_MEDIA === 'netlify' ? 'netlify-blobs' : process.env.BLOB_READ_WRITE_TOKEN ? 'ok' : 'missing BLOB_READ_WRITE_TOKEN' };
  if (!missing.length) {
    try {
      await L.store.set('uzla:health', String(Date.now()));
      out.db = (await L.store.get('uzla:health')) ? 'ok' : 'read-failed';
    } catch (e) { out.ok = false; out.db = 'error'; }
  }
  return L.json(res, out.ok ? 200 : 500, out);
};
