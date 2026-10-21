/* POST /api/username  { current, next } - login nomini profil ichidan yangilaydi. */
'use strict';
const L = require('./_lib');
const USER_RE = /^[A-Za-z0-9_.-]{3,32}$/;

module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });
  if (!L.sessionOf(req)) return L.json(res, 401, { error: 'auth' });
  let body;
  try { body = await L.readJSON(req, 4 * 1024); } catch (e) { return L.json(res, 400, { error: 'body' }); }
  const current = String((body && body.current) || '');
  const next = String((body && body.next) || '').trim();
  if (!L.verifyPassword(current, await L.currentHash())) return L.json(res, 401, { error: 'wrong' });
  if (!USER_RE.test(next)) return L.json(res, 400, { error: 'format' });
  if (next === await L.currentUser()) return L.json(res, 400, { error: 'same' });
  try { await L.store.set(L.USER_KEY, next); } catch (e) { return L.json(res, 502, { error: 'store' }); }
  L.setSessionCookie(res, next);
  return L.json(res, 200, { ok: true, user: next });
};
