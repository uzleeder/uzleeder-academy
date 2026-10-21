/* POST /api/logout — YAGONA chiqish: o'quvchi va xodim cookie'lari o'chiriladi.
   Serverda sessiya saqlanmagani uchun boshqa hech narsa qilinmaydi; mijoz
   /login sahifasiga qaytadi.                                                */
'use strict';
const L = require('./_lib');

module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  L.clearSessionCookie(res);
  return L.json(res, 200, { ok: true });
};
