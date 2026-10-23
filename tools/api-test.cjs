/* ==========================================================================
   tools/api-test.cjs — API rol/ruxsat smoke-testi (deployga kirmaydi)
   --------------------------------------------------------------------------
   Xotiradagi ombor bilan real handler'lar chaqiriladi.
   2026-10 rol modeli: faol rollar learner + controller. teacher / english
   olib tashlangan — ularning logini, eski cookie'si va amallari rad etiladi,
   eski yozuvlar (topshiriq, feedback, tekshiruv, chat) o'quvchiga arxiv
   sifatida qaytadi va hech narsa buzilmaydi.
   Ishga tushirish:  node tools/api-test.cjs
   ========================================================================== */
'use strict';
process.env.SESSION_SECRET = 's3cret'; process.env.AUTH_USER = 'max';
process.env.KV_REST_API_URL = 'http://x'; process.env.KV_REST_API_TOKEN = 't';
const crypto = require('crypto');
const path = require('path');
function hp(p) { const iter = 1000, salt = crypto.randomBytes(8); return 'pbkdf2$' + iter + '$' + salt.toString('base64') + '$' + crypto.pbkdf2Sync(p, salt, iter, 32, 'sha256').toString('base64'); }
process.env.AUTH_PASSWORD_HASH = hp('pw-learner'); process.env.CTRL_PASSWORD_HASH = hp('pw-ctrl');
/* Olib tashlangan rollarning env'i hali turibdi (eski deploy) — kirish baribir yo'q bo'lishi kerak */
process.env.TEACHER_PASSWORD_HASH = hp('pw-teach'); process.env.ENG_PASSWORD_HASH = hp('pw-eng');
const API = path.join(__dirname, '..', 'api');
const L = require(path.join(API, '_lib.js'));
const mem = {};
L.store.get = async k => (mem[k] == null ? null : mem[k]);
L.store.set = async (k, v) => { mem[k] = v; };
L.store.del = async k => { delete mem[k]; };
L.store.incrTTL = async k => { mem[k] = String((+mem[k] || 0) + 1); return +mem[k]; };
const io = require(path.join(API, '_ctrl-io.js'));
const login = require(path.join(API, '_ctrl-login.js'));
const ulogin = require(path.join(API, 'login.js'));
const stateH = require(path.join(API, '_ctrl-state.js'));
const pwH = require(path.join(API, 'password.js'));

function req(method, body, cookie) { return { method: method, body: body, headers: { cookie: cookie || '' }, socket: { remoteAddress: '1.1.1.1' }, url: '/api/ctrl/io' }; }
function res() { const r = { h: {}, setHeader(k, v) { r.h[k] = v; }, end(b) { r.body = JSON.parse(b); } }; return r; }
async function call(h, method, body, cookie) { const r = res(); await h(req(method, body, cookie), r); return { s: r.statusCode, j: r.body, h: r.h }; }
function cookieFrom(h) { return (h['Set-Cookie'] || '').split(';')[0]; }
function staffToken(role, user) { const r = res(); L.setStaffCookie(r, user || role, role); return cookieFrom(r.h); }

let fails = 0;
function expect(name, got, want) { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ' → ' + JSON.stringify(got) + (ok ? '' : '  (want ' + JSON.stringify(want) + ')')); }

(async () => {
  const r0 = res(); L.setSessionCookie(r0, 'max'); const learner = cookieFrom(r0.h);

  /* ---------------- rol modeli ---------------- */
  expect('active staff roles', L.STAFF_ROLES, ['controller']);
  expect('retired roles listed (not active)', Object.keys(L.RETIRED_ROLES), ['teacher', 'english']);
  expect('isStaffRole(teacher) false', [L.isStaffRole('teacher'), L.isStaffRole('english'), L.isStaffRole('controller')], [false, false, true]);
  expect('no perm mentions retired roles', Object.keys(L.PERMS).some(k => L.PERMS[k].some(r => r === 'teacher' || r === 'english')), false);
  expect('assignment/review ops removed from PERMS', [!!L.PERMS.assignment, !!L.PERMS.review], [false, false]);

  /* ---------------- login ---------------- */
  const cr = await call(login, 'POST', { user: 'controller', password: 'pw-ctrl' }); const ctrl = cookieFrom(cr.h);
  expect('controller login', [cr.s, cr.j.role, cr.j.workspace], [200, 'controller', '/controller']);
  expect('retired teacher credentials → 401', (await call(ulogin, 'POST', { user: 'teacher', password: 'pw-teach' })).s, 401);
  expect('retired english credentials → 401', (await call(ulogin, 'POST', { user: 'english', password: 'pw-eng' })).s, 401);
  expect('asking for retired role → 401/403 (not granted)', [401, 403].indexOf((await call(ulogin, 'POST', { user: 'max', password: 'pw-learner', role: 'teacher' })).s) >= 0, true);
  const lr = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner' });
  expect('learner login', [lr.s, lr.j.role, lr.j.workspace, /uzla_session=/.test(lr.h['Set-Cookie'] || '')], [200, 'learner', '/', true]);
  expect('wrong password → 401', (await call(ulogin, 'POST', { user: 'max', password: 'nope' })).s, 401);
  /* bir hisob, ikki rol (learner + controller bir xil login/parol) → tanlash */
  process.env.CTRL_USER = 'max'; process.env.CTRL_PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH;
  const ch = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner' });
  expect('multi-role → choose (no cookie)', [ch.s, ch.j.ok, ch.j.choose, ch.h['Set-Cookie'] || null], [200, false, ['learner', 'controller'], null]);
  const ch2 = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner', role: 'controller' });
  expect('multi-role → choose controller', [ch2.s, ch2.j.role, /uzla_ctrl=/.test(ch2.h['Set-Cookie'] || '')], [200, 'controller', true]);
  delete process.env.CTRL_USER; process.env.CTRL_PASSWORD_HASH = hp('pw-ctrl');

  /* ---------------- eski (olib tashlangan rol) cookie'lari ---------------- */
  const oldTeach = staffToken('teacher'), oldEng = staffToken('english');
  expect('old teacher cookie → no role', L.roleOf(req('GET', null, oldTeach)), null);
  expect('old teacher cookie → io 401', (await call(io, 'GET', null, oldTeach)).s, 401);
  expect('old english cookie → state 401', (await call(stateH, 'GET', null, oldEng)).s, 401);
  expect('old teacher cookie → password 401', (await call(pwH, 'POST', { current: 'pw-teach', next: 'pw-teach2' }, oldTeach)).s, 401);
  expect('old teacher cookie → message 401', (await call(io, 'POST', { op: 'message', text: 'x' }, oldTeach)).s, 401);

  /* rol almashtirish: xodim tokeni o'quvchi cookie'sida */
  const forged = 'uzla_session=' + encodeURIComponent(ctrl.split('=')[1]);
  expect('forged learner cookie (staff token) → no role', L.roleOf(req('GET', null, forged)), null);
  expect('forged learner cookie → io 401', (await call(io, 'GET', null, forged)).s, 401);

  /* ---------------- o'quvchi / controller ruxsatlari ---------------- */
  expect('learner: assignment create → 403', (await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'x' } }, learner)).s, 403);
  expect('controller: assignment create → 403', (await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'x' } }, ctrl)).s, 403);
  expect('learner: review submit → 403 (flow removed)', (await call(io, 'POST', { op: 'review', action: 'submit', r: { kind: 'writing', text: 'x' } }, learner)).s, 403);
  expect('learner: feedback create → 403', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'x' } }, learner)).s, 403);
  expect('learner: notes → 403', (await call(io, 'POST', { op: 'notes', text: 'x' }, learner)).s, 403);
  expect('learner: state → 403', (await call(stateH, 'GET', null, learner)).s, 403);
  expect('no cookie: io → 401', (await call(io, 'GET', null, '')).s, 401);
  expect('controller: heartbeat → 403', (await call(io, 'POST', { op: 'heartbeat' }, ctrl)).s, 403);
  expect('controller: student-visible feedback → 403', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'x', visibility: 'student' } }, ctrl)).s, 403);
  const pn = await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'private note', visibility: 'private', activity: { kind: 'lesson' } } }, ctrl);
  expect('controller: private note', [pn.s, pn.j.feedback.visibility], [200, 'private']);

  /* ---------------- tarixiy yozuvlar (eski teacher/english davridan) ---------------- */
  mem['uzla:staff:assignments'] = JSON.stringify([{ id: 'a1', by: 'teacher', to: 'learner', status: 'assigned', title: 'Essay 3', type: 'writing', course: 'english', route: 'writing/3', priority: 'high', due: '', createdAt: 1, completedAt: null }]);
  mem['uzla:staff:feedback'] = JSON.stringify(JSON.parse(mem['uzla:staff:feedback'] || '[]').concat([{ id: 'f1', by: 'english', role: 'english', at: 2, visibility: 'student', text: 'Good structure', activity: { kind: 'writing', ref: 'wr3' } }, { id: 'f2', by: 'teacher', role: 'teacher', at: 3, visibility: 'private', text: 'secret', activity: { kind: 'lesson' } }]));
  mem['uzla:staff:reviews'] = JSON.stringify([{ id: 'r1', kind: 'writing', ref: 'wr3', title: 'Week 3', stage: 'reviewed', createdAt: 1, updatedAt: 2, text: 'essay', history: [{ stage: 'submitted', at: 1, by: 'learner' }, { stage: 'reviewed', at: 2, by: 'english', fb: { strengths: 'clear' } }] }]);
  mem['uzla:chat:teacher'] = JSON.stringify([{ id: 'm1', from: 'teacher', text: 'Hello from the old teacher', at: 5 }]);
  const g = await call(io, 'GET', null, learner);
  expect('learner GET ok with legacy records', g.s, 200);
  expect('learner convs = controller only', Object.keys(g.j.convs), ['controller']);
  expect('legacy chat in read-only archive', [Object.keys(g.j.archive), g.j.archive.teacher.retired, g.j.archive.teacher.msgs.length], [['teacher'], true, 1]);
  expect('legacy assignment visible to learner', g.j.assignments.map(a => a.by + ':' + a.title), ['teacher:Essay 3']);
  expect('legacy student feedback visible, private hidden', g.j.feedback.map(f => f.id), ['f1']);
  expect('legacy review visible (read-only)', g.j.reviews.map(r => r.id + ':' + r.stage), ['r1:reviewed']);
  expect('learner closes legacy assignment', (await call(io, 'POST', { op: 'astatus', id: 'a1', status: 'completed' }, learner)).j.assignment.status, 'completed');
  expect('no notification written to retired role', JSON.parse(mem['uzla:staff:notif'] || '[]').filter(n => n.to === 'teacher' || n.to === 'english').length, 0);
  expect('learner revise legacy review → 403', (await call(io, 'POST', { op: 'review', action: 'revise', r: { id: 'r1', text: 'v2' } }, learner)).s, 403);
  expect('message to retired role → 400', (await call(io, 'POST', { op: 'message', to: 'teacher', text: 'hi' }, learner)).s, 400);
  const gc = await call(io, 'GET', null, ctrl);
  expect('controller sees own private + student-visible (no retired private)', gc.j.feedback.map(f => f.id).sort(), ['f1', pn.j.feedback.id].sort());
  expect('controller: no assignment/review data', [gc.j.assignments.length, gc.j.reviews.length], [0, 0]);
  expect('controller: retired accounts reported (env still set)', gc.j.retired.map(r => r.role + ':' + r.access + ':' + r.decision), ['teacher:revoked:pending-owner', 'english:revoked:pending-owner']);
  mem['uzla:staff:teacher:hash'] = hp('db-teach');
  expect('retired hash in DB is NOT deleted or used', [!!mem['uzla:staff:teacher:hash'], (await call(ulogin, 'POST', { user: 'teacher', password: 'db-teach' })).s], [true, 401]);
  delete process.env.TEACHER_PASSWORD_HASH; delete process.env.ENG_PASSWORD_HASH; delete mem['uzla:staff:teacher:hash'];
  expect('no retired accounts once env/db clean', (await call(io, 'GET', null, ctrl)).j.retired, []);

  /* ---------------- chat va sessiya ---------------- */
  expect('learner → controller', (await call(io, 'POST', { op: 'message', text: 'hi' }, learner)).s, 200);
  expect('controller → learner', (await call(io, 'POST', { op: 'message', text: 'hello' }, ctrl)).s, 200);
  const g3 = await call(io, 'GET', null, learner);
  expect('learner unread', g3.j.convs.controller.unread, 1);
  expect('learner read', (await call(io, 'POST', { op: 'read' }, learner)).s, 200);
  expect('controller session start', (await call(io, 'POST', { op: 'session', action: 'start' }, ctrl)).s, 200);
  expect('learner pause', (await call(io, 'POST', { op: 'session', action: 'pause' }, learner)).j.state, 'paused');
  expect('learner heartbeat with events', (await call(io, 'POST', { op: 'heartbeat', route: 'lesson/3', title: 'L3', events: [{ id: 'e1', at: 1, type: 'py-done', ref: '3', title: 'Lesson 3' }] }, learner)).s, 200);
  expect('controller sees events', (await call(io, 'GET', null, ctrl)).j.status.events.length, 1);

  /* ---------------- holat (faqat controller, to'liq, filtrsiz) ---------------- */
  mem['uzla:state'] = JSON.stringify({ rev: 1, savedAt: 1, state: { scores: { 1: 9 }, mission: { v: 1 } } });
  const sc = await call(stateH, 'GET', null, ctrl);
  expect('controller state full', [sc.s, !!sc.j.state.scores, !!sc.j.state.mission, sc.j.state._filtered || null], [200, true, true, null]);

  /* muddati o'tgan / soxta token */
  const body = Buffer.from(JSON.stringify({ u: 'max', exp: Date.now() - 1000 })).toString('base64url');
  const mac = crypto.createHmac('sha256', 's3cret').update(body).digest('base64url');
  expect('expired session', L.sessionOf({ headers: { cookie: 'uzla_session=' + body + '.' + mac } }), null);
  const bad = body + '.' + crypto.createHmac('sha256', 'other').update(body).digest('base64url');
  expect('bad signature', L.sessionOf({ headers: { cookie: 'uzla_session=' + bad } }), null);

  /* bildirishnoma */
  expect('notif read all', (await call(io, 'POST', { op: 'notif', action: 'read', all: true }, learner)).s, 200);
  expect('notif unread after', (await call(io, 'GET', null, learner)).j.notif.filter(n => !n.read).length, 0);

  /* parol: har hisob o'zinikini */
  expect('controller changes own password', (await call(pwH, 'POST', { current: 'pw-ctrl', next: 'pw-ctrl2' }, ctrl)).j.role, 'controller');
  expect('controller: old password rejected', (await call(ulogin, 'POST', { user: 'controller', password: 'pw-ctrl' })).s, 401);
  expect('controller: new password works', (await call(ulogin, 'POST', { user: 'controller', password: 'pw-ctrl2' })).j.role, 'controller');
  expect('learner changes own password', (await call(pwH, 'POST', { current: 'pw-learner', next: 'pw-learner2' }, learner)).j.role, 'learner');
  expect('learner wrong current → 401', (await call(pwH, 'POST', { current: 'nope', next: 'x12345678' }, learner)).s, 401);
  expect('no cookie → 401', (await call(pwH, 'POST', { current: 'a', next: 'b1234567' }, '')).s, 401);
  console.log(fails ? ('\n' + fails + ' FAILED') : '\nALL OK');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
