/* ==========================================================================
   middleware.js — Vercel Edge Middleware: BUTUN saytni login bilan yopadi
   --------------------------------------------------------------------------
   Har bir so'rov (HTML, CSS, JS, API) shu yerdan o'tadi. `uzla_session`
   cookie'si to'g'ri imzolangan va muddati o'tmagan bo'lsagina ichkariga
   kiritiladi. Aks holda:
     • sahifa so'rovi  → /login.html ga yo'naltiriladi
     • boshqa (js/css/api) → 401 (kontent umuman berilmaydi)

   Ochiq qoladigan yo'llar: /login (login.html), /api/login, /api/health.
   Imzo — api/_lib.js dagi bilan bir xil (HMAC-SHA256, SESSION_SECRET),
   faqat bu yerda Node crypto emas, WebCrypto (Edge muhiti).

   Sirlar: faqat process.env (Vercel muhit o'zgaruvchilari).
   Mahalliy ishga tushirishda (file:// yoki oddiy static server) bu fayl
   ishlamaydi — ya'ni faqat Vercel'da himoya bor. Mahalliy nusxa esa
   faqat sizning kompyuteringizda.
   ========================================================================== */
export const config = {
  // _vercel ichki yo'llari va favicon'dan tashqari hammasi
  matcher: ['/((?!_vercel).*)']
};

const COOKIE = 'uzla_session';
// cleanUrls: true — Vercel /login.html ni /login ga yo'naltiradi, ikkalasi ochiq
const OPEN = new Set(['/login', '/login.html', '/api/login', '/api/health', '/manifest.json', '/sw.js',
  // Xodimlar paneli (controller · teacher · english) — o'z logini bor (uzla_ctrl cookie, role bilan).
  // /staff, /teacher, /english — vercel.json rewrite → controller.html (bitta panel, rolga qarab tablar)
  '/controller', '/controller.html', '/staff', '/teacher', '/english', '/api/ctrl/login',
  // Login sahifasidagi tanishtiruv videosi va uning muqovasi — kirmagan odam ham ko'ra olsin.
  // Faqat shu ikki fayl; brand/out ichidagi qolgan narsa (log, kadrlar) yopiq qoladi.
  '/brand/out/site-tour-1920x1080.mp4', '/brand/out/cover-1920x1080.png',
  // Xatolik sahifalari — 404 Vercel tomonidan avtomatik beriladi, cookie'siz ham ochilishi kerak
  '/404', '/404.html', '/error', '/error.html']);
// PWA ikonkalari — o'rnatishda OS cookie'siz so'raydi; ularda sir yo'q.
// /api/ctrl/* — funksiyalar o'zlari tekshiradi (o'quvchi YOKI nazoratchi cookie'si)
const OPEN_PREFIX = ['/img/icon-', '/img/apple-touch-icon', '/api/ctrl/'];

function b64uToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function cookieOf(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch (e) { return ''; }
    }
  }
  return '';
}

async function verify(token, secret) {
  try {
    const i = token.lastIndexOf('.');
    if (i < 0) return false;
    const body = token.slice(0, i);
    const sig = b64uToBytes(token.slice(i + 1));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(body));
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64uToBytes(body)));
    if (!payload || !(payload.exp > Date.now()) || typeof payload.u !== 'string') return false;
    return payload;
  } catch (e) { return false; }
}
const STAFF_ROLES = ['controller', 'teacher', 'english'];

export default async function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  const pass = new Response(null, { headers: { 'x-middleware-next': '1' } });
  if (OPEN.has(path) || OPEN_PREFIX.some(p => path.startsWith(p))) return pass;

  const secret = process.env.SESSION_SECRET || '';
  // Server sozlanmagan bo'lsa — hech kimni kiritmaymiz, lekin login sahifasi
  // (ochiq) muammoni ko'rsatadi.
  const token = cookieOf(req, COOKIE);
  const learner = secret && token ? await verify(token, secret) : false;
  /* O'quvchi cookie'sida rol bo'lmaydi; rol'li token (xodim) bu cookie'da
     bo'lsa — qabul qilinmaydi (cookie almashtirib rol o'zgartirib bo'lmaydi). */
  if (learner && !learner.role) return pass;

  /* Xodim (uzla_ctrl, role: controller|teacher|english): faqat panel uchun
     kerak bo'lgan statik fayllar (/js, /css, /img). Ilova sahifasining o'zi (/)
     va o'quvchi API'si (/api/state …) unga baribir yopiq — HTML so'rovi
     panelga qaytariladi.                                                     */
  const ctrl = cookieOf(req, 'uzla_ctrl');
  const staff = secret && ctrl ? await verify(ctrl, secret) : false;
  if (staff && STAFF_ROLES.includes(staff.role)) {
    if (/^\/(js|css|img)\//.test(path)) return pass;
    if (req.method === 'GET' && (req.headers.get('accept') || '').includes('text/html')) return Response.redirect(new URL('/controller', url).toString(), 302);
  }

  const wantsHtml = req.method === 'GET' &&
    (req.headers.get('accept') || '').includes('text/html');
  if (wantsHtml) {
    const to = new URL('/login', url);
    if (path !== '/' && path !== '/index.html') to.searchParams.set('next', path + url.search + url.hash);
    return Response.redirect(to.toString(), 302);
  }
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
