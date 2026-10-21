/* ==========================================================================
   api/_lib.js — serverless funksiyalar uchun umumiy yordamchilar
   --------------------------------------------------------------------------
   Vercel `api/` ichidagi `_` bilan boshlangan fayllarni marshrut qilmaydi —
   shuning uchun bu fayl faqat boshqa funksiyalar tomonidan import qilinadi.

   Uch narsa shu yerda:
     1) parol tekshiruvi  — PBKDF2-SHA256 (hash env'da, parol hech qayerda yo'q)
     2) sessiya           — HMAC bilan imzolangan cookie, serverda hech narsa
                            saqlanmaydi (bitta foydalanuvchi uchun yetarli)
     3) store             — kalit-qiymat ombori. Ikki backend, ikkalasi ham
                            faqat fetch bilan (npm paketsiz):
                              • Neon Postgres  — HTTP SQL endpoint (/sql)
                              • Upstash Redis  — REST
                            Qaysi biri borligi muhit o'zgaruvchisidan aniqlanadi.

   Sirlar FAQAT muhit o'zgaruvchilaridan o'qiladi:
     AUTH_USER            — login
     AUTH_PASSWORD_HASH   — "pbkdf2$<iter>$<saltB64>$<hashB64>"
     SESSION_SECRET       — 32+ bayt, base64
     Baza (bittasi yetarli):
       Postgres: qiymati postgres:// bilan boshlangan istalgan *_URL
                 (DATABASE_URL, STORAGE_URL, POSTGRES_URL — Vercel prefiksi
                 qanday bo'lsa ham topiladi)
       Redis:    KV_REST_API_URL + KV_REST_API_TOKEN
                 (yoki UPSTASH_REDIS_REST_URL/TOKEN)
   ========================================================================== */
'use strict';

const crypto = require('crypto');

const COOKIE = 'uzla_session';
/* Sessiya muddati SOZLANADI: SESSION_DAYS (kun, standart 90). Ilgari 10 yil
   edi — ko'p rolli tizimda bu haddan ortiq: cookie o'g'irlansa yillar davomida
   ishlaydi. Parol yoki SESSION_SECRET yangilansa sessiya darhol bekor bo'ladi.
   Xodimlar (controller/teacher/english): STAFF_SESSION_DAYS, standart 30.  */
function daysEnv(name, def) { const n = parseInt(process.env[name], 10); return n > 0 && n <= 3650 ? n : def; }
const SESSION_DAYS = daysEnv('SESSION_DAYS', 90);

/* ---------- muhit ---------------------------------------------------------- */
function env(name, alt) {
  return process.env[name] || (alt ? process.env[alt] : undefined) || '';
}

/* Postgres ulanish qatori: ma'lum nomlar birinchi, keyin istalgan
   postgres:// qiymatli o'zgaruvchi. *_UNPOOLED va *_PRISMA_URL emas —
   HTTP endpoint uchun oddiy (pooled) URL kerak.                            */
function pgUrl() {
  const known = ['DATABASE_URL', 'STORAGE_URL', 'POSTGRES_URL', 'NEON_DATABASE_URL'];
  for (const k of known) if (/^postgres(ql)?:\/\//.test(env(k))) return env(k);
  for (const k of Object.keys(process.env)) {
    if (/_URL$/.test(k) && !/UNPOOLED|PRISMA|NO_SSL|NON_POOLING/.test(k) &&
        /^postgres(ql)?:\/\//.test(process.env[k])) return process.env[k];
  }
  return '';
}
function redisCfg() {
  const url = env('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL');
  const token = env('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN');
  return url && token ? { url, token } : null;
}

function missingEnv() {
  const out = [];
  ['AUTH_USER', 'AUTH_PASSWORD_HASH', 'SESSION_SECRET'].forEach(k => { if (!env(k)) out.push(k); });
  if (!pgUrl() && !redisCfg()) out.push('DATABASE_URL (Postgres) yoki KV_REST_API_URL+TOKEN (Redis)');
  return out;
}

/* ---------- parol ----------------------------------------------------------
   Format: pbkdf2$210000$<salt b64>$<hash b64>. Taqqoslash timingSafeEqual
   bilan — oddiy === parolning necha harfi to'g'riligini vaqt orqali
   "aytib qo'yishi" mumkin.                                                 */
function verifyPassword(password, stored) {
  try {
    const p = String(stored).split('$');
    if (p.length !== 4 || p[0] !== 'pbkdf2') return false;
    const iter = parseInt(p[1], 10);
    const salt = Buffer.from(p[2], 'base64');
    const want = Buffer.from(p[3], 'base64');
    const got = crypto.pbkdf2Sync(String(password), salt, iter, want.length, 'sha256');
    return got.length === want.length && crypto.timingSafeEqual(got, want);
  } catch (e) { return false; }
}

/* Yangi hash yaratish — parol almashtirilganda (api/password.js). Format
   make-credentials.ps1 bilan bir xil, shuning uchun verifyPassword o'qiydi. */
function hashPassword(password) {
  const iter = 210000, salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(String(password), salt, iter, 32, 'sha256');
  return 'pbkdf2$' + iter + '$' + salt.toString('base64') + '$' + hash.toString('base64');
}

/* Amaldagi hash: bazadagi (saytdan almashtirilgan) birinchi, bo'lmasa
   env'dagi. Parolni saytdan o'zgartirish uchun env'ni qo'l bilan yangilash
   shart emas — hash `uzla:auth:hash` kalitida turadi.                     */
const HASH_KEY = 'uzla:auth:hash';
const USER_KEY = 'uzla:auth:user';
async function currentHash() {
  try { const h = await store.get(HASH_KEY); if (h && /^pbkdf2\$/.test(h)) return h; } catch (e) {}
  return env('AUTH_PASSWORD_HASH');
}

/* Login nomi ham profil ichidan almashtirilishi mumkin. Baza qiymati
   birinchi o'rinda, AUTH_USER esa birinchi deploy uchun zaxira nom. */
async function currentUser() {
  try {
    const u = await store.get(USER_KEY);
    if (u && /^[A-Za-z0-9_.-]{3,32}$/.test(u)) return u;
  } catch (e) {}
  return env('AUTH_USER');
}

/* ---------- sessiya --------------------------------------------------------
   Token = base64url(payload) + "." + base64url(HMAC-SHA256(payload)).
   Payload: {u, exp}. Serverda sessiya jadvali yo'q — imzo yetarli.        */
function b64u(buf) { return Buffer.from(buf).toString('base64url'); }

function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', env('SESSION_SECRET')).update(body).digest();
  return body + '.' + b64u(mac);
}

function verifyToken(token) {
  try {
    const i = String(token || '').lastIndexOf('.');
    if (i < 0) return null;
    const body = token.slice(0, i), sig = Buffer.from(token.slice(i + 1), 'base64url');
    const want = crypto.createHmac('sha256', env('SESSION_SECRET')).update(body).digest();
    if (sig.length !== want.length || !crypto.timingSafeEqual(sig, want)) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.exp < Date.now()) return null;
    return payload;
  } catch (e) { return null; }
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

/* O'quvchi sessiyasi: tokenda `role` BO'LMASLIGI shart — xodim tokenini
   o'quvchi cookie'siga ko'chirib o'quvchi bo'lib bo'lmaydi (rol almashtirish). */
function sessionOf(req) {
  const p = verifyToken(parseCookies(req)[COOKIE]);
  return p && !p.role ? p : null;
}

/* remember=false → "shu qurilmani eslab qolma": cookie brauzer yopilguncha
   (Max-Age yo'q), token 1 kun. remember=true (standart) → SESSION_DAYS.     */
function setSessionCookie(res, user, remember) {
  const days = remember === false ? 1 : SESSION_DAYS;
  const exp = Date.now() + days * 86400 * 1000;
  const token = sign({ u: user, exp: exp });
  res.setHeader('Set-Cookie',
    COOKIE + '=' + encodeURIComponent(token) +
    '; Path=/; HttpOnly; Secure; SameSite=Strict' + (remember === false ? '' : '; Max-Age=' + (days * 86400)));
}

/* YAGONA chiqish: ikkala cookie ham (o'quvchi va xodim) tozalanadi */
function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', [
    COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    'uzla_ctrl=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  ]);
}

/* ---------- xodimlar: controller · teacher · english ------------------------
   Uchta xodim roli, har birining O'Z logini va paroli (env yoki bazadagi
   hash). Bitta cookie (uzla_ctrl — nomi tarixiy, tarkibida role bor).
   Xodim o'quvchi ilovasiga kira olmaydi (middleware faqat uzla_session ni
   kiritadi) — u faqat /controller (staff paneli) va /api/ctrl/* ni ko'radi.

     controller — MONITORING: sessiya, faollik, chat, shaxsiy eslatma
     teacher    — O'QITISH: progress, topshiriq, feedback, writing/speaking
                  tekshiruvi, loyiha, chat
     english    — FAQAT INGLIZ TILI: teacher bilan bir xil, lekin Python
                  ma'lumotlari serverda filtrlanadi (filterStateForRole)

   Env: CTRL_USER/CTRL_PASSWORD_HASH · TEACHER_USER/TEACHER_PASSWORD_HASH ·
        ENG_USER/ENG_PASSWORD_HASH. Bazadagi hash env'dan ustun (panelda
        parol almashtirilganda). Rol yo'q bo'lsa (hash berilmagan) — u rol
        oddiygina mavjud emas; login 401 qaytaradi.                          */
const CTRL_COOKIE = 'uzla_ctrl';
const CTRL_DAYS = daysEnv('STAFF_SESSION_DAYS', 30);
const CTRL_HASH_KEY = 'uzla:ctrl:hash';
const STAFF = {
  controller: { userEnv: 'CTRL_USER',    defUser: 'controller', hashEnv: 'CTRL_PASSWORD_HASH',    hashKey: CTRL_HASH_KEY },
  teacher:    { userEnv: 'TEACHER_USER', defUser: 'teacher',    hashEnv: 'TEACHER_PASSWORD_HASH', hashKey: 'uzla:staff:teacher:hash' },
  english:    { userEnv: 'ENG_USER',     defUser: 'english',    hashEnv: 'ENG_PASSWORD_HASH',     hashKey: 'uzla:staff:english:hash' }
};
const STAFF_ROLES = Object.keys(STAFF);
function isStaffRole(r) { return STAFF_ROLES.indexOf(r) >= 0; }
async function staffHash(role) {
  const d = STAFF[role]; if (!d) return '';
  try { const h = await store.get(d.hashKey); if (h && /^pbkdf2\$/.test(h)) return h; } catch (e) {}
  return env(d.hashEnv);
}
function staffUser(role) { const d = STAFF[role]; return d ? (env(d.userEnv) || d.defUser) : ''; }
/* Qaysi rollar sozlangan (hash bor) — login sahifasi va hujjat uchun */
async function staffRolesAvailable() {
  const out = [];
  for (const r of STAFF_ROLES) if (await staffHash(r)) out.push(r);
  return out;
}
async function ctrlHash() { return staffHash('controller'); }
function ctrlUser() { return staffUser('controller'); }
function staffSessionOf(req) {
  const p = verifyToken(parseCookies(req)[CTRL_COOKIE]);
  return p && isStaffRole(p.role) ? p : null;
}
function ctrlSessionOf(req) { const p = staffSessionOf(req); return p && p.role === 'controller' ? p : null; }
function setStaffCookie(res, user, role, remember) {
  const days = remember === false ? 1 : CTRL_DAYS;
  const exp = Date.now() + days * 86400 * 1000;
  res.setHeader('Set-Cookie', CTRL_COOKIE + '=' + encodeURIComponent(sign({ u: user, role: role, exp: exp })) +
    '; Path=/; HttpOnly; Secure; SameSite=Strict' + (remember === false ? '' : '; Max-Age=' + (days * 86400)));
}
function setCtrlCookie(res, user) { return setStaffCookie(res, user, 'controller'); }
function clearCtrlCookie(res) { clearSessionCookie(res); }   // yagona chiqish — ikkalasi ham
/* Kim so'rayapti: 'learner' (uzla_session) | 'controller' | 'teacher' | 'english' | null.
   O'quvchi cookie'si ustun: ikkalasi bir brauzerda bo'lsa ham rol aralashmaydi. */
function roleOf(req) {
  if (sessionOf(req)) return 'learner';
  const p = staffSessionOf(req);
  return p ? p.role : null;
}

/* ---------- RUXSATLAR MATRITSASI ----------------------------------------------
   Har /api/ctrl/io amali uchun qaysi rol ruxsatli. Yashirin tugma emas —
   server tekshiradi. English roli faqat ingliz tili refs bilan ishlaydi
   (io ichida qo'shimcha tekshiruv: englishOnly).                              */
const PERMS = {
  heartbeat: ['learner'],
  session:   ['learner', 'controller'],
  message:   ['learner', 'controller', 'teacher', 'english'],
  read:      ['learner', 'controller', 'teacher', 'english'],
  notes:     ['controller', 'teacher', 'english'],
  assignment:['teacher', 'english'],
  astatus:   ['learner', 'teacher', 'english'],       // topshiriq holati (o'quvchi: in_progress/completed)
  feedback:  ['teacher', 'english', 'controller'],    // controller: faqat private note (visibility=private)
  review:    ['learner', 'teacher', 'english'],       // writing/speaking tekshiruv bosqichlari
  notif:     ['learner', 'controller', 'teacher', 'english'],
  state:     ['controller', 'teacher', 'english']
};
function can(role, op) { return !!(PERMS[op] && PERMS[op].indexOf(role) >= 0); }

/* English roli uchun o'quvchi holatini FILTRLASH: Python/DataCamp/coding
   ma'lumotlari chiqarib tashlanadi. Ro'yxat — store.js DEFAULTS bo'yicha.   */
const ENGLISH_STRIP = ['scores', 'best', 'notes', 'activity'];
function filterStateForRole(state, role) {
  if (!state || role !== 'english') return state;
  const out = Object.assign({}, state);
  ENGLISH_STRIP.forEach(k => { delete out[k]; });
  out.mistakes = (state.mistakes || []).filter(m => m.cat && m.cat !== 'python' && m.cat !== 'coding' && m.cat !== 'datacamp');
  out.quiz = {}; Object.keys(state.quiz || {}).forEach(k => { if (!/^(py|dc|code|q10|lesson)/.test(k)) out.quiz[k] = state.quiz[k]; });
  out.review = {}; Object.keys(state.review || {}).forEach(k => { if (!/^(py|dc|code|lesson)/.test(k)) out.review[k] = state.review[k]; });
  out.copy = Object.assign({}, state.copy || {}); delete out.copy.coding;
  out.read = {}; Object.keys(state.read || {}).forEach(k => { if (!/^(codetest|dc)/.test(k)) out.read[k] = state.read[k]; });
  out.done = {}; Object.keys(state.done || {}).forEach(k => { if (!/^(dc|q10|py)/.test(k)) out.done[k] = state.done[k]; });
  out.plan = {}; Object.keys(state.plan || {}).forEach(k => { if (/^wr/.test(k)) out.plan[k] = state.plan[k]; });
  out.events = (state.events || []).filter(e => !/^(py|dc|code)/.test(e.type || ''));
  out._filtered = 'english';
  return out;
}
/* JSON kalitni o'qish/yozish — nazorat ma'lumotlari uchun qisqa yordamchilar */
async function getJSON(key, fallback) {
  try { const raw = await store.get(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
}
async function setJSON(key, val) { await store.set(key, JSON.stringify(val)); }

/* ---------- ombor: bitta interfeys, ikki backend ---------------------------
     get(k)              → string | null
     set(k, v)           → saqlash (muddatsiz)
     incrTTL(k, sec)     → sanagichni oshirish; birinchi marta yoki muddati
                           o'tgan bo'lsa 1 dan boshlanadi. Login urinishlari uchun.
     del(k)
   ------------------------------------------------------------------------- */

/* --- Upstash Redis REST --- */
async function redis(cmd) {
  const c = redisCfg();
  const r = await fetch(c.url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + c.token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (j.error) throw new Error('Redis: ' + j.error);
  return j.result;
}
const redisStore = {
  get: k => redis(['GET', k]),
  set: (k, v) => redis(['SET', k, v]),
  del: k => redis(['DEL', k]),
  incrTTL: async (k, sec) => {
    const n = await redis(['INCR', k]);
    if (n === 1) await redis(['EXPIRE', k, sec]);
    return n;
  }
};

/* --- Neon Postgres — HTTP SQL endpoint ---------------------------------------
   Neon har ulanish qatori uchun https://<host>/sql manzilini beradi;
   so'rov JSON bilan yuboriladi, driver kerak emas. Bitta jadval:
     uzla_kv (k text PK, v text, exp bigint NULL)   exp — ms, faqat sanagich uchun */
let pgReady = null;
async function pg(query, params) {
  const url = pgUrl();
  const host = new URL(url).hostname;
  const r = await fetch('https://' + host + '/sql', {
    method: 'POST',
    headers: {
      'Neon-Connection-String': url,
      'Neon-Raw-Text-Output': 'true',
      'Neon-Array-Mode': 'false',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: query, params: params || [] })
  });
  const j = await r.json();
  if (!r.ok || j.message) throw new Error('Postgres: ' + (j.message || r.status));
  return j.rows || [];
}
function pgInit() {
  if (!pgReady) pgReady = pg('CREATE TABLE IF NOT EXISTS uzla_kv (k text PRIMARY KEY, v text NOT NULL, exp bigint)')
    .catch(e => { pgReady = null; throw e; });
  return pgReady;
}
const pgStore = {
  get: async k => {
    await pgInit();
    const rows = await pg('SELECT v FROM uzla_kv WHERE k = $1 AND (exp IS NULL OR exp > $2)', [k, String(Date.now())]);
    return rows.length ? rows[0].v : null;
  },
  set: async (k, v) => {
    await pgInit();
    await pg('INSERT INTO uzla_kv (k, v, exp) VALUES ($1, $2, NULL) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v, exp = NULL', [k, v]);
  },
  del: async k => { await pgInit(); await pg('DELETE FROM uzla_kv WHERE k = $1', [k]); },
  incrTTL: async (k, sec) => {
    await pgInit();
    const now = Date.now(), exp = now + sec * 1000;
    const rows = await pg(
      'INSERT INTO uzla_kv (k, v, exp) VALUES ($1, \'1\', $2) ' +
      'ON CONFLICT (k) DO UPDATE SET ' +
      '  v = CASE WHEN uzla_kv.exp IS NOT NULL AND uzla_kv.exp < $3 THEN \'1\' ELSE (uzla_kv.v::bigint + 1)::text END, ' +
      '  exp = CASE WHEN uzla_kv.exp IS NOT NULL AND uzla_kv.exp < $3 THEN $2 ELSE uzla_kv.exp END ' +
      'RETURNING v',
      [k, String(exp), String(now)]);
    return parseInt(rows[0] && rows[0].v, 10) || 1;
  }
};

const store = pgUrl() ? pgStore : redisStore;

/* ---------- so'rov tanasi ----------------------------------------------- */
function readJSON(req, limitBytes) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      // Vercel ko'pincha tanani o'zi parse qilib beradi
      if (typeof req.body === 'string') { try { resolve(JSON.parse(req.body)); } catch (e) { reject(e); } }
      else resolve(req.body);
      return;
    }
    let size = 0, chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limitBytes) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null')); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

module.exports = {
  env, missingEnv, verifyPassword, hashPassword, currentHash, HASH_KEY, currentUser, USER_KEY, sessionOf, setSessionCookie, clearSessionCookie,
  ctrlHash, ctrlUser, CTRL_HASH_KEY, ctrlSessionOf, setCtrlCookie, clearCtrlCookie, roleOf, getJSON, setJSON,
  STAFF, STAFF_ROLES, isStaffRole, staffHash, staffUser, staffRolesAvailable, staffSessionOf, setStaffCookie, PERMS, can, filterStateForRole, SESSION_DAYS, CTRL_DAYS,
  store, backend: pgUrl() ? 'postgres' : 'redis', readJSON, json, clientIp
};
