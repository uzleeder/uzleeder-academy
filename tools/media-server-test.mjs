/* ==========================================================================
   tools/media-server-test.mjs — o'z resurs serverini tekshirish
   --------------------------------------------------------------------------
   Haqiqiy server ishga tushadi, haqiqiy HTTP so'rovlari yuboriladi.
   Tekshiriladi: autentifikatsiya, ruxsatlar, yuklash, metadata, oqim,
   HTTP Range, zaxira manifesti, butunlik, hajm nazorati — va eng muhimi:
   serverda SHAXSIY PROGRESSNI qabul qiladigan endpoint YO'QLIGI.
   ========================================================================== */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('ok   ' + n); } else { fail++; console.log('FAIL ' + n); } };
const head = t => { console.log(''); console.log(t); console.log('-'.repeat(t.length)); };

const ROOT = await fs.mkdtemp(path.join(os.tmpdir(), 'uzmedia-'));
const OWNER = crypto.randomBytes(16).toString('hex');
const READER = crypto.randomBytes(16).toString('hex');
const PORT = 8900 + Math.floor(Math.random() * 90);

process.env.MEDIA_ROOT = ROOT;
process.env.MEDIA_OWNER = OWNER;
process.env.MEDIA_READER = READER;
process.env.MEDIA_PORT = String(PORT);
process.env.MEDIA_QUOTA = String(1024 * 1024);          // 1 MB — chegara sinovi uchun

const mod = await import('../server/media-server.mjs');
const srv = await mod.start();
const BASE = 'http://127.0.0.1:' + PORT;

const call = (p, opts = {}) => fetch(BASE + p, opts);
const asOwner = (p, opts = {}) => call(p, { ...opts, headers: { ...(opts.headers || {}), Authorization: 'Bearer ' + OWNER } });
const asReader = (p, opts = {}) => call(p, { ...opts, headers: { ...(opts.headers || {}), Authorization: 'Bearer ' + READER } });

/* ====================== 1. AUTENTIFIKATSIYA =========================== */
head('Autentifikatsiya va ruxsatlar');

ok((await call('/health')).status === 200, '/health kalitsiz ochiq (faqat "tirikman")');
ok((await call('/list')).status === 401, 'kalitsiz /list → 401');
ok((await call('/list', { headers: { Authorization: 'Bearer wrong' } })).status === 401, 'noto\'g\'ri kalit → 401');
ok((await asReader('/list')).status === 200, 'o\'quvchi kaliti ro\'yxatni ko\'radi');
ok((await asOwner('/usage')).status === 200, 'egasi hajmni ko\'radi');

const content = Buffer.from('%PDF-1.4 test resource for the academy'.repeat(40));
const upHeaders = { 'X-File-Name': 'Reading Explorer 4.pdf', 'X-File-Type': 'application/pdf', 'Content-Type': 'application/pdf' };

ok((await asReader('/upload', { method: 'POST', headers: upHeaders, body: content })).status === 403,
  'o\'quvchi YUKLAY OLMAYDI → 403');

/* ====================== 2. YUKLASH VA METADATA ======================== */
head('Yuklash, metadata va tashkil etish');

const upRes = await asOwner('/upload', { method: 'POST', headers: upHeaders, body: content });
ok(upRes.status === 201, 'egasi yuklaydi → 201');
const meta = await upRes.json();
ok(/^[0-9a-f]{32}$/.test(meta.id), 'id berildi');
ok(meta.name === 'Reading Explorer 4.pdf', 'fayl nomi saqlandi');
ok(meta.folder === 'pdf', 'turi bo\'yicha papkaga joylashdi (pdf)');
ok(meta.size === content.length, 'hajm to\'g\'ri yozildi');
ok(meta.sha256 === crypto.createHash('sha256').update(content).digest('hex'), 'SHA-256 nazorat yig\'indisi to\'g\'ri');

const badType = await asOwner('/upload', {
  method: 'POST', headers: { 'X-File-Name': 'x.exe', 'X-File-Type': 'application/x-msdownload' }, body: Buffer.from('MZ')
});
ok(badType.status === 415, 'ruxsat etilmagan tur → 415');

const list = await (await asOwner('/list')).json();
ok(list.items.length === 1, 'ro\'yxatda bitta fayl');
ok(Array.isArray(list.folders) && list.folders.includes('video'), 'papkalar ro\'yxati qaytadi');

const byFolder = await (await asOwner('/list?folder=video')).json();
ok(byFolder.items.length === 0, 'papka bo\'yicha filtr ishlaydi');

/* ====================== 3. OQIM VA RANGE ============================== */
head('Xavfsiz oqim va HTTP Range');

const full = await asReader('/file/' + meta.id);
ok(full.status === 200, 'to\'liq fayl → 200');
ok(full.headers.get('accept-ranges') === 'bytes', 'Accept-Ranges: bytes');
ok(full.headers.get('content-type') === 'application/pdf', 'Content-Type saqlandi');
ok(full.headers.get('cache-control').includes('private'), 'Cache-Control: private');
ok(full.headers.get('x-content-type-options') === 'nosniff', 'nosniff sarlavhasi bor');
const fullBody = Buffer.from(await full.arrayBuffer());
ok(fullBody.equals(content), 'mazmun bir xil (bayt-ba-bayt)');

const part = await asReader('/file/' + meta.id, { headers: { Range: 'bytes=10-19' } });
ok(part.status === 206, 'Range so\'rovi → 206');
ok(part.headers.get('content-range') === 'bytes 10-19/' + content.length, 'Content-Range to\'g\'ri');
const partBody = Buffer.from(await part.arrayBuffer());
ok(partBody.length === 10 && partBody.equals(content.subarray(10, 20)), 'aynan so\'ralgan bo\'lak qaytdi');

const openEnd = await asReader('/file/' + meta.id, { headers: { Range: 'bytes=' + (content.length - 5) + '-' } });
ok(openEnd.status === 206 && (await openEnd.arrayBuffer()).byteLength === 5, 'ochiq oxirli Range ishlaydi');

const suffix = await asReader('/file/' + meta.id, { headers: { Range: 'bytes=-7' } });
ok(suffix.status === 206 && (await suffix.arrayBuffer()).byteLength === 7, 'oxirgi N bayt (suffix Range) ishlaydi');

const bad = await asReader('/file/' + meta.id, { headers: { Range: 'bytes=999999-1000000' } });
ok(bad.status === 416, 'chegaradan tashqari Range → 416');
ok((bad.headers.get('content-range') || '').startsWith('bytes */'), '416 javobida Content-Range bor');

const headReq = await asReader('/file/' + meta.id, { method: 'HEAD' });
ok(headReq.status === 200 && headReq.headers.get('content-length') === String(content.length), 'HEAD hajmni beradi');

ok((await call('/file/' + meta.id)).status === 401, 'kalitsiz fayl berilmaydi → 401');
ok((await asReader('/file/not-an-id')).status === 400, 'yaroqsiz id → 400');
ok((await asReader('/file/' + '0'.repeat(32))).status === 404, 'mavjud bo\'lmagan id → 404');

/* ====================== 4. YOPIQ FAYL ================================= */
head('Ulashilmagan fayl faqat egasiga ko\'rinadi');

const priv = await (await asOwner('/upload', {
  method: 'POST',
  headers: { ...upHeaders, 'X-File-Name': 'owner-only.pdf', 'X-Shared': 'false' },
  body: Buffer.from('private')
})).json();
ok((await asReader('/file/' + priv.id)).status === 403, 'o\'quvchi yopiq faylni OLMAYDI → 403');
ok((await asOwner('/file/' + priv.id)).status === 200, 'egasi yopiq faylni oladi');
const readerList = await (await asReader('/list')).json();
ok(!readerList.items.some(i => i.id === priv.id), 'yopiq fayl o\'quvchi ro\'yxatida ko\'rinmaydi');

/* ====================== 5. HAJM NAZORATI ============================== */
head('Hajm nazorati va chegarasi');

const u = await (await asOwner('/usage')).json();
ok(u.files === 2, 'hajm hisobotida fayllar soni');
ok(u.bytes === content.length + 7, 'hajm hisobotida baytlar');
ok(u.quota === 1024 * 1024 && u.free === u.quota - u.bytes, 'chegara va bo\'sh joy hisoblanadi');
ok(u.byFolder.pdf > 0, 'papka bo\'yicha taqsimot bor');

const tooBig = await asOwner('/upload', {
  method: 'POST', headers: { ...upHeaders, 'X-File-Name': 'big.pdf' },
  body: Buffer.alloc(2 * 1024 * 1024)
});
ok(tooBig.status === 507, 'chegaradan oshgan yuklash → 507');
ok((await (await asOwner('/usage')).json()).files === 2, 'rad etilgan fayl omborda qolmaydi');

/* ====================== 6. ZAXIRA VA BUTUNLIK ========================= */
head('Zaxira manifesti va butunlik tekshiruvi');

ok((await asReader('/backup/manifest')).status === 403, 'o\'quvchi zaxira manifestini OLMAYDI');
const man = await (await asOwner('/backup/manifest')).json();
ok(man.files.length === 2, 'manifestda ikkala fayl bor');
ok(man.files.every(f => f.sha256 && f.size >= 0), 'manifestda nazorat yig\'indisi va hajm bor');
ok(typeof man.restore === 'string', 'manifestda tiklash yo\'riqnomasi bor');

const v1 = await (await asOwner('/backup/verify')).json();
ok(v1.ok === true && v1.checked === 2, 'butunlik tekshiruvi toza o\'tdi');

/* Faylni ataylab buzamiz — tekshiruv buni TOPISHI shart */
await fs.writeFile(path.join(ROOT, 'files', 'pdf', meta.id), Buffer.from('corrupted'));
const v2 = await (await asOwner('/backup/verify')).json();
ok(v2.ok === false && v2.problems.some(p => p.id === meta.id), 'buzilgan fayl TOPILADI (tekshiruv jim o\'tmaydi)');

/* ====================== 7. O'CHIRISH ================================== */
head('O\'chirish');

ok((await asReader('/file/' + meta.id, { method: 'DELETE' })).status === 403, 'o\'quvchi o\'chira olmaydi');
ok((await asOwner('/file/' + meta.id, { method: 'DELETE' })).status === 200, 'egasi o\'chiradi');
ok((await asReader('/file/' + meta.id)).status === 404, 'o\'chirilgandan keyin topilmaydi');

/* ====================== 8. SHAXSIY PROGRESS UCHUN JOY YO'Q ============ */
head('Shaxsiy progress uchun endpoint YO\'Q (brief 8-bo\'lim)');

for (const p of ['/state', '/api/state', '/progress', '/sync', '/learner', '/records']) {
  const r = await asOwner(p, { method: 'POST', body: JSON.stringify({ best: { 1: 9 }, mistakes: [] }) });
  ok(r.status === 404, 'POST ' + p + ' → 404 (progress qabul qilinmaydi)');
}
const src = await fs.readFile(new URL('../server/media-server.mjs', import.meta.url), 'utf8');
ok(!/\bstate\b\s*[:=]/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')),
  'server kodida o\'quv holati (state) bilan ishlash yo\'q');

/* ====================== XULOSA ======================================== */
srv.close();
await fs.rm(ROOT, { recursive: true, force: true });

console.log('');
console.log(fail ? 'FAIL — ' + fail + ' ta xato, ' + pass + ' ta ok' : 'ALL OK — ' + pass + ' ta tekshiruv');
process.exit(fail ? 1 : 0);
