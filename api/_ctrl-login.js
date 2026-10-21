/* ==========================================================================
   POST /api/ctrl/login  → /api/login ga topshiriladi (yagona kirish nuqtasi)
   DELETE /api/ctrl/login                    → chiqish (xodim cookie'si)
   GET    /api/ctrl/login                    → { roles: [...] } sozlangan xodim rollari
   --------------------------------------------------------------------------
   XODIM kirishi: controller · teacher · english. Har rolning o'z logini va
   paroli (env yoki bazadagi hash). Rol login nomidan aniqlanadi; parol
   FAQAT o'sha rolning hash'i bilan tekshiriladi. Hamma rol hash'lari
   hisoblanadi (vaqt bo'yicha "qaysi login mavjud" bilinmasin).
   O'quvchi paroli bu yerda ishlamaydi va aksincha. Urinishlar IP bo'yicha.
   ========================================================================== */
'use strict';
const L = require('./_lib');

const MAX_FAILS = 10, WINDOW_SEC = 15 * 60;

module.exports = async function (req, res) {
  if (req.method === 'DELETE') { L.clearCtrlCookie(res); return L.json(res, 200, { ok: true }); }
  if (req.method === 'GET') return L.json(res, 200, { roles: await L.staffRolesAvailable() });
  /* POST — yagona kirish nuqtasi /api/login ga topshiriladi (eski mijozlar uchun mos) */
  if (req.method === 'POST') return require('./login')(req, res);
  return L.json(res, 405, { error: 'method' });
};
