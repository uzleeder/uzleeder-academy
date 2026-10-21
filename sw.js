/* ==========================================================================
   sw.js — oflayn qobiq (service worker)
   --------------------------------------------------------------------------
   Halol oflayn: bir marta ochilgan fayllar keshlanadi, keyin internetsiz ham
   ochiladi. Hech narsa "taxminan" ishlamaydi:
     • /api/*            — faqat tarmoq (progress sinxroni keshlanmaydi)
     • sahifa (HTML)     — avval tarmoq, bo'lmasa keshdagi index.html
     • ?v= li js/css, img/, shriftlar — avval kesh, fonda yangilanadi
   Kesh nomi versiyaga bog'liq (sw.js?v=…): yangi deploy → eski kesh o'chadi.
   Progress localStorage'da — SW unga tegmaydi; internet qaytganda Sync
   o'zi yuboradi.
   ========================================================================== */
var VER = (self.location.search.match(/v=([\w.-]+)/) || [])[1] || 'dev';
var CACHE = 'uzla-' + VER;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['./index.html']).catch(function () {}); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('uzla-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function cacheable(req, res) {
  return res && res.status === 200 && (res.type === 'basic' || res.type === 'cors') && req.method === 'GET';
}

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.pathname.indexOf('/api/') === 0) return;                       // faqat tarmoq
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !isFont) return;

  /* Xodimlar paneli va login — SW aralashmaydi (o'z cookie'si, oflayn qobiq kerak emas) */
  if (/^\/(controller|staff|teacher|english|login|error|404)(\.html)?$/.test(url.pathname)) return;

  /* Sahifa: tarmoq → kesh (index.html). Faqat ILOVA sahifasi keshlanadi — boshqa
     navigatsiya javobi (masalan /controller) index.html o'rniga yozilmaydi. */
  if (req.mode === 'navigate') {
    var isApp = url.pathname === '/' || url.pathname === '/index.html';
    e.respondWith(fetch(req).then(function (res) {
      if (isApp && cacheable(req, res) && !res.redirected) caches.open(CACHE).then(function (c) { c.put('./index.html', res.clone()); });
      return res;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }

  /* Versiyali resurslar va shriftlar: kesh → tarmoq (fonda yangilash) */
  var versioned = url.search.indexOf('v=') >= 0 || url.pathname.indexOf('/img/') === 0 || isFont;
  if (!versioned) return;
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (cacheable(req, res)) caches.open(CACHE).then(function (c) { c.put(req, res.clone()); });
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
