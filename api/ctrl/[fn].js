/* ==========================================================================
   /api/ctrl/[fn] — nazorat paneli funksiyalarining YAGONA kirish nuqtasi
   --------------------------------------------------------------------------
   Nega bitta fayl: Vercel Hobby rejasi bir deploy'da 12 tadan ortiq
   serverless funksiyaga ruxsat bermaydi. Avval ctrl/ da 4 ta alohida fayl
   bor edi (io, login, password, state) — jami 12/12, ya'ni chegarada.
   Endi shu bitta fayl 4 ta o'rniga hisoblanadi: jami 9 ta.

   Qanday ishlaydi: `[fn]` — Vercel'ning dinamik segmenti. /api/ctrl/io,
   /api/ctrl/login, /api/ctrl/password, /api/ctrl/state — hammasi shu
   faylga tushadi, `fn` esa req.query.fn da keladi. Biz shunchaki kerakli
   handler'ni chaqiramiz.

   Handler'larning o'zi hech o'zgarmagan — ular api/_ctrl-*.js fayllarida
   turibdi (`_` bilan boshlangan fayllarni Vercel funksiya deb olmaydi).
   URL'lar, cookie'lar, javoblar — hammasi avvalgidek. controller.html,
   login.html, js/ctrl.js va middleware.js ga tegilmagan.
   ========================================================================== */
'use strict';
const L = require('../_lib');

const HANDLERS = {
  io:       require('../_ctrl-io'),
  login:    require('../_ctrl-login'),
  password: require('../_ctrl-password'),
  state:    require('../_ctrl-state')
};

/* Qaysi funksiya so'ralgani. Avval Vercel bergan query (asosiy yo'l),
   bo'lmasa URL'dan o'qiymiz (mahalliy sinov yoki g'ayrioddiy proksi uchun). */
function fnOf(req) {
  const q = req.query && req.query.fn;
  if (q) return String(q);
  const m = /\/api\/ctrl\/([A-Za-z]+)/.exec(req.url || '');
  return m ? m[1] : '';
}

module.exports = async function (req, res) {
  const handler = HANDLERS[fnOf(req)];
  if (!handler) return L.json(res, 404, { error: 'not_found' });
  return handler(req, res);
};
