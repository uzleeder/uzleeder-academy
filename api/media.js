/* ==========================================================================
   /api/media — kino/video fayllari uchun bulut ombori (Vercel Blob)
   --------------------------------------------------------------------------
   Nega: video fayl holat (state) ichiga sig'maydi (1 MB chegara), IndexedDB
   esa faqat shu qurilmada. "Qaysi qurilmadan kirsam ham turishi kerak" →
   fayl Vercel Blob'ga yuklanadi, metadata (url) bulutdagi holatga yoziladi.

   Fayl BRAUZERDAN TO'G'RIDAN-TO'G'RI Blob'ga ketadi (serverless funksiya
   4.5 MB dan katta so'rovni qabul qilmaydi). Buning uchun server qisqa
   muddatli MIJOZ TOKENINI beradi (HMAC — @vercel/blob SDK bilan bir xil
   sxema, npm paketsiz). Katta fayl bo'laklab (multipart) yuboriladi.

   GET                 → { ok, configured }             (sozlanganmi)
   POST { op:'token', pathname, size, type }
                       → { token, pathname }            (30 daqiqa amal qiladi)
   POST { op:'delete', url }
                       → { ok }                          (faylni o'chirish)

   Env: BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob → Connect).
   Faqat o'quvchi sessiyasi (uzla_session).
   ========================================================================== */
'use strict';
const crypto = require('crypto');
const L = require('./_lib');

const MAX_BYTES = 6 * 1024 * 1024 * 1024;   // 6 GB — bitta film uchun yetarli
const API = 'https://blob.vercel-storage.com';

function rwToken() { return process.env.BLOB_READ_WRITE_TOKEN || ''; }

/* @vercel/blob: generateClientTokenFromReadWriteToken bilan bir xil */
function clientToken(pathname, opts) {
  const tok = rwToken();
  const storeId = tok.split('_')[3] || '';
  const payload = Buffer.from(JSON.stringify(Object.assign({ pathname }, opts))).toString('base64');
  const sig = crypto.createHmac('sha256', tok).update(payload).digest('hex');
  return 'vercel_blob_client_' + storeId + '_' + Buffer.from(sig + '.' + payload).toString('base64');
}

module.exports = async function (req, res) {
  if (req.method === 'GET') return L.json(res, 200, { ok: true, configured: !!rwToken() });
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  if (!L.sessionOf(req)) return L.json(res, 401, { error: 'auth' });
  if (!rwToken()) return L.json(res, 501, { error: 'blob', missing: ['BLOB_READ_WRITE_TOKEN'] });

  let body;
  try { body = await L.readJSON(req, 8 * 1024); } catch (e) { return L.json(res, 400, { error: 'body' }); }
  const op = body && body.op;

  if (op === 'token') {
    const size = Number(body.size) || 0;
    if (size > MAX_BYTES) return L.json(res, 413, { error: 'size', max: MAX_BYTES });
    const safe = String(body.pathname || 'file').replace(/[^\w.\-]+/g, '_').slice(0, 120);
    const folder = /^voice-/.test(safe) ? 'voice/' : /^thumb-/.test(safe) ? 'thumbs/' : /^(image|video)\//.test(String(body.type || '')) && !/^(mp4|webm|mkv|mov)$/.test(safe.split('.').pop()) ? 'media/' : 'movies/';
    const pathname = folder + Date.now().toString(36) + '-' + safe;
    const token = clientToken(pathname, {
      validUntil: Date.now() + 30 * 60 * 1000,      // 30 daqiqa — katta fayl ham ulguradi
      maximumSizeInBytes: MAX_BYTES,
      allowedContentTypes: ['video/*', 'image/*', 'audio/*', 'application/octet-stream'],
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000
    });
    return L.json(res, 200, { token, pathname, api: API });
  }

  if (op === 'delete') {
    const url = String(body.url || '');
    if (!/^https:\/\/[\w.-]+\.public\.blob\.vercel-storage\.com\//.test(url)) return L.json(res, 400, { error: 'url' });
    const r = await fetch(API + '/delete', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + rwToken(), 'x-api-version': '11', 'content-type': 'application/json' },
      body: JSON.stringify({ urls: [url] })
    });
    return L.json(res, r.ok ? 200 : 502, { ok: r.ok, status: r.status });
  }

  return L.json(res, 400, { error: 'op' });
};
