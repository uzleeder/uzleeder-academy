/* ==========================================================================
   GET /api/ctrl/state — o'quvchining bulutdagi holati (controller, FAQAT o'qish)
   --------------------------------------------------------------------------
   Faqat controller (monitoring). teacher / english rollari va ular uchun
   filtrlangan ko'rinish 2026-10 da olib tashlangan.
   Yozish yo'q: xodim o'quvchi progressini o'zgartira olmaydi.
   ========================================================================== */
'use strict';
const L = require('./_lib');

module.exports = async function (req, res) {
  if (req.method !== 'GET') return L.json(res, 405, { error: 'method' });
  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });
  const role = L.roleOf(req);
  if (!L.can(role, 'state')) return L.json(res, role ? 403 : 401, { error: role ? 'role' : 'auth' });
  const raw = await L.store.get('uzla:state');
  const doc = raw ? JSON.parse(raw) : { rev: 0, savedAt: 0, state: null };
  doc.role = role;
  res.setHeader('Cache-Control', 'no-store');
  return L.json(res, 200, doc);
};
