/* ==========================================================================
   GET /api/ctrl/state — o'quvchining bulutdagi holati (xodimlar, FAQAT o'qish)
   --------------------------------------------------------------------------
   controller, teacher — to'liq holat (maqsad doskasi panelda chizilmaydi).
   english            — FILTRLANGAN holat: Python/DataCamp/coding qismlari
                        serverda olib tashlanadi (L.filterStateForRole).
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
  doc.state = L.filterStateForRole(doc.state, role);
  doc.role = role;
  res.setHeader('Cache-Control', 'no-store');
  return L.json(res, 200, doc);
};
