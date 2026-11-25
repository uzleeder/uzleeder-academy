/* ==========================================================================
   UzLeeder Academy — o'z serveringizdagi resurs ombori
   Self-hosted shared-resource server (videos, PDFs, audio)
   --------------------------------------------------------------------------
   Brief 8-bo'lim: "Use an owner-controlled self-hosted media server for
   shared course videos, PDFs and learning resources."

   Nima uchun alohida server: ULASHILADIGAN material (kurs videolari,
   kitob PDF'lari) hamma qurilmada kerak, lekin u SHAXSIY PROGRESS EMAS.
   Shuning uchun ular egasi boshqaradigan serverda turadi, shaxsiy
   o'quv yozuvlari esa o'quvchining qurilmasida qoladi.

   QAT'IY CHEGARA: bu serverda o'quv progressini qabul qiladigan BIRORTA
   endpoint yo'q. U fayl beradi va oladi — holat emas. (tools/media-server-test.mjs
   shuni tekshiradi.)

   Bog'liqlik YO'Q: faqat Node standart kutubxonasi.
     node server/media-server.mjs

   Muhit o'zgaruvchilari:
     MEDIA_ROOT     fayllar papkasi (standart: ./media-data)
     MEDIA_PORT     port (standart 8787)
     MEDIA_OWNER    egasi kaliti  — yuklash, o'chirish, zaxira
     MEDIA_READER   o'quvchi kaliti — faqat o'qish
     MEDIA_QUOTA    bayt chegarasi (standart 50 GB)
     MEDIA_ORIGIN   CORS uchun ruxsat etilgan sayt manzili

   Kalitlar yo'q bo'lsa server ISHGA TUSHMAYDI — ochiq qolgandan ko'ra
   to'xtagani ma'qul.
   ========================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pipeline } from 'node:stream/promises';

const ROOT = path.resolve(process.env.MEDIA_ROOT || './media-data');
const PORT = Number(process.env.MEDIA_PORT || 8787);
const QUOTA = Number(process.env.MEDIA_QUOTA || 50 * 1024 ** 3);
const ORIGIN = process.env.MEDIA_ORIGIN || '';

const FILES = path.join(ROOT, 'files');
const META = path.join(ROOT, 'meta');

/* ---------- ruxsatlar: egasi yozadi, o'quvchi o'qiydi ----------------- */
const KEYS = {
  owner: process.env.MEDIA_OWNER || '',
  reader: process.env.MEDIA_READER || ''
};

const ALLOWED_TYPES = [
  'video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime',
  'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm',
  'application/pdf',
  'image/png', 'image/jpeg', 'image/webp', 'image/avif',
  'text/plain'
];

const FOLDERS = ['video', 'audio', 'pdf', 'image', 'other'];

/* Vaqt bo'yicha xavfsiz taqqoslash — kalit uzunligini vaqt orqali aytib
   qo'ymaslik uchun.                                                     */
function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

function roleOf(req) {
  const h = req.headers.authorization || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  const key = m ? m[1].trim() : '';
  if (!key) return null;
  if (KEYS.owner && safeEqual(key, KEYS.owner)) return 'owner';
  if (KEYS.reader && safeEqual(key, KEYS.reader)) return 'reader';
  return null;
}

/* ---------- yordamchilar ---------------------------------------------- */

function json(res, status, body, extra) {
  const data = JSON.stringify(body);
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }, cors(), extra || {}));
  res.end(data);
}

function cors() {
  if (!ORIGIN) return {};
  return {
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-File-Name, X-File-Type, X-Folder',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, DELETE, OPTIONS',
    'Vary': 'Origin'
  };
}

const ID_RE = /^[0-9a-f]{32}$/;
function newId() { return crypto.randomBytes(16).toString('hex'); }

function safeName(s) {
  return String(s || 'file').replace(/[^\w.\- ]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 140) || 'file';
}

function folderFor(type, asked) {
  if (asked && FOLDERS.includes(asked)) return asked;
  if (/^video\//.test(type)) return 'video';
  if (/^audio\//.test(type)) return 'audio';
  if (type === 'application/pdf') return 'pdf';
  if (/^image\//.test(type)) return 'image';
  return 'other';
}

async function readMeta(id) {
  try { return JSON.parse(await fsp.readFile(path.join(META, id + '.json'), 'utf8')); }
  catch { return null; }
}

async function listMeta() {
  let names = [];
  try { names = await fsp.readdir(META); } catch { return []; }
  const out = [];
  for (const n of names) {
    if (!n.endsWith('.json')) continue;
    const m = await readMeta(n.slice(0, -5));
    if (m) out.push(m);
  }
  return out.sort((a, b) => (b.at || 0) - (a.at || 0));
}

async function usage() {
  const items = await listMeta();
  const bytes = items.reduce((a, m) => a + (m.size || 0), 0);
  const byFolder = {};
  items.forEach(m => { byFolder[m.folder] = (byFolder[m.folder] || 0) + (m.size || 0); });
  return { files: items.length, bytes, quota: QUOTA, free: Math.max(0, QUOTA - bytes), byFolder };
}

/* ---------- so'rovlar -------------------------------------------------- */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const route = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'OPTIONS') { res.writeHead(204, cors()); return res.end(); }

  /* /health — kalitsiz: faqat "tirikman" deydi, hech qanday ma'lumot bermaydi */
  if (route === '/health') {
    return json(res, 200, { ok: true, service: 'uzleeder-media', time: Date.now() });
  }

  const role = roleOf(req);
  if (!role) return json(res, 401, { error: 'auth' }, { 'WWW-Authenticate': 'Bearer' });

  /* --- ro'yxat --- */
  if (route === '/list' && req.method === 'GET') {
    const folder = url.searchParams.get('folder');
    let items = await listMeta();
    if (folder) items = items.filter(m => m.folder === folder);
    /* O'quvchi faqat ulashilgan faylni ko'radi */
    if (role !== 'owner') items = items.filter(m => m.shared !== false);
    return json(res, 200, { items: items.map(publicMeta), folders: FOLDERS });
  }

  /* --- hajm va holat --- */
  if (route === '/usage' && req.method === 'GET') {
    return json(res, 200, await usage());
  }

  /* --- yuklash: faqat egasi --- */
  if (route === '/upload' && req.method === 'POST') {
    if (role !== 'owner') return json(res, 403, { error: 'forbidden' });

    const type = String(req.headers['x-file-type'] || req.headers['content-type'] || '').split(';')[0].trim();
    if (!ALLOWED_TYPES.includes(type)) {
      return json(res, 415, { error: 'type', allowed: ALLOWED_TYPES });
    }
    const name = safeName(req.headers['x-file-name']);
    const folder = folderFor(type, String(req.headers['x-folder'] || ''));

    const u = await usage();
    const declared = Number(req.headers['content-length'] || 0);
    if (declared && u.bytes + declared > QUOTA) {
      return json(res, 507, { error: 'quota', free: u.free });
    }

    const id = newId();
    const dest = path.join(FILES, folder, id);
    await fsp.mkdir(path.dirname(dest), { recursive: true });

    const hash = crypto.createHash('sha256');
    let size = 0;
    let aborted = false;

    req.on('data', chunk => {
      size += chunk.length;
      hash.update(chunk);
      if (u.bytes + size > QUOTA) { aborted = true; req.destroy(); }
    });

    try {
      await pipeline(req, fs.createWriteStream(dest));
    } catch (e) {
      await fsp.rm(dest, { force: true });
      return json(res, aborted ? 507 : 400, { error: aborted ? 'quota' : 'upload' });
    }

    const meta = {
      id, name, type, folder, size,
      sha256: hash.digest('hex'),
      shared: req.headers['x-shared'] !== 'false',
      at: Date.now()
    };
    await fsp.mkdir(META, { recursive: true });
    await fsp.writeFile(path.join(META, id + '.json'), JSON.stringify(meta, null, 2));
    return json(res, 201, publicMeta(meta));
  }

  /* --- o'chirish: faqat egasi --- */
  if (route.startsWith('/file/') && req.method === 'DELETE') {
    if (role !== 'owner') return json(res, 403, { error: 'forbidden' });
    const id = route.slice(6);
    if (!ID_RE.test(id)) return json(res, 400, { error: 'id' });
    const meta = await readMeta(id);
    if (!meta) return json(res, 404, { error: 'not_found' });
    await fsp.rm(path.join(FILES, meta.folder, id), { force: true });
    await fsp.rm(path.join(META, id + '.json'), { force: true });
    return json(res, 200, { ok: true, id });
  }

  /* --- oqim: Range qo'llab-quvvatlanadi --- */
  if (route.startsWith('/file/') && (req.method === 'GET' || req.method === 'HEAD')) {
    const id = route.slice(6);
    if (!ID_RE.test(id)) return json(res, 400, { error: 'id' });
    const meta = await readMeta(id);
    if (!meta) return json(res, 404, { error: 'not_found' });
    if (role !== 'owner' && meta.shared === false) return json(res, 403, { error: 'forbidden' });

    const file = path.join(FILES, meta.folder, id);
    let stat;
    try { stat = await fsp.stat(file); } catch { return json(res, 404, { error: 'missing_file' }); }

    const headers = Object.assign({
      'Content-Type': meta.type,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline; filename="' + meta.name.replace(/"/g, '') + '"',
      'ETag': '"' + meta.sha256.slice(0, 16) + '"'
    }, cors());

    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(String(range).trim());
      if (!m || (!m[1] && !m[2])) {
        res.writeHead(416, Object.assign({ 'Content-Range': 'bytes */' + stat.size }, cors()));
        return res.end();
      }
      let start, end;
      if (m[1]) {
        start = Number(m[1]);
        end = m[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      } else {
        /* suffix: oxirgi N bayt */
        const n = Number(m[2]);
        start = Math.max(0, stat.size - n);
        end = stat.size - 1;
      }
      if (start > end || start >= stat.size) {
        res.writeHead(416, Object.assign({ 'Content-Range': 'bytes */' + stat.size }, cors()));
        return res.end();
      }
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
      headers['Content-Length'] = String(end - start + 1);
      res.writeHead(206, headers);
      if (req.method === 'HEAD') return res.end();
      return pipeline(fs.createReadStream(file, { start, end }), res).catch(() => {});
    }

    headers['Content-Length'] = String(stat.size);
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    return pipeline(fs.createReadStream(file), res).catch(() => {});
  }

  /* --- zaxira manifesti: faqat egasi --- */
  if (route === '/backup/manifest' && req.method === 'GET') {
    if (role !== 'owner') return json(res, 403, { error: 'forbidden' });
    const items = await listMeta();
    return json(res, 200, {
      createdAt: new Date().toISOString(),
      root: ROOT,
      files: items.map(m => ({ id: m.id, name: m.name, folder: m.folder, size: m.size, sha256: m.sha256 })),
      total: items.reduce((a, m) => a + (m.size || 0), 0),
      restore: 'Copy the whole MEDIA_ROOT directory back and restart the server.'
    });
  }

  /* --- butunlikni tekshirish: fayllar manifestga mos keladimi --- */
  if (route === '/backup/verify' && req.method === 'GET') {
    if (role !== 'owner') return json(res, 403, { error: 'forbidden' });
    const items = await listMeta();
    const bad = [];
    for (const m of items) {
      const f = path.join(FILES, m.folder, m.id);
      try {
        const buf = await fsp.readFile(f);
        const sum = crypto.createHash('sha256').update(buf).digest('hex');
        if (sum !== m.sha256) bad.push({ id: m.id, reason: 'checksum' });
        else if (buf.length !== m.size) bad.push({ id: m.id, reason: 'size' });
      } catch { bad.push({ id: m.id, reason: 'missing' }); }
    }
    return json(res, 200, { ok: bad.length === 0, checked: items.length, problems: bad });
  }

  return json(res, 404, { error: 'route' });
}

function publicMeta(m) {
  return { id: m.id, name: m.name, type: m.type, folder: m.folder, size: m.size, sha256: m.sha256, shared: m.shared !== false, at: m.at };
}

/* ---------- ishga tushirish -------------------------------------------- */

export function createServer() {
  return http.createServer((req, res) => {
    handle(req, res).catch(err => {
      try { json(res, 500, { error: 'server' }); } catch {}
      console.error('[media]', err && err.message);
    });
  });
}

export async function start() {
  if (!KEYS.owner || !KEYS.reader) {
    console.error('[media] MEDIA_OWNER va MEDIA_READER kalitlari kerak. Server ishga tushmadi.');
    console.error('[media] Misol: MEDIA_OWNER=$(openssl rand -hex 24) MEDIA_READER=$(openssl rand -hex 24) node server/media-server.mjs');
    process.exit(1);
  }
  if (safeEqual(KEYS.owner, KEYS.reader)) {
    console.error('[media] MEDIA_OWNER va MEDIA_READER bir xil bo\'lmasligi kerak.');
    process.exit(1);
  }
  await fsp.mkdir(FILES, { recursive: true });
  await fsp.mkdir(META, { recursive: true });
  const srv = createServer();
  srv.listen(PORT, () => {
    console.log('[media] UzLeeder resurs serveri: http://127.0.0.1:' + PORT);
    console.log('[media] papka: ' + ROOT + ' · chegara: ' + Math.round(QUOTA / 1024 ** 3) + ' GB');
    console.log('[media] shaxsiy progress uchun endpoint YO\'Q — bu server faqat fayl beradi.');
  });
  return srv;
}

/* To'g'ridan-to'g'ri ishga tushirilsa (import qilinganda emas) */
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
if (isMain) start();

export const _internal = { roleOf, folderFor, safeName, ALLOWED_TYPES, FOLDERS, publicMeta, usage, ROOT, PORT };
