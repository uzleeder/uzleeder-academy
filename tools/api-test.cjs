/* ==========================================================================
   tools/api-test.js — API rol/ruxsat smoke-testi (deployga kirmaydi)
   --------------------------------------------------------------------------
   Xotiradagi ombor bilan real handler'lar chaqiriladi: login (3 rol), ruxsat
   matritsasi, topshiriq/feedback/tekshiruv oqimi, chat, sessiya, english
   filtri, muddati o'tgan sessiya, cookie almashtirish.
   Ishga tushirish:  node tools/api-test.cjs
   ========================================================================== */
'use strict';
process.env.SESSION_SECRET = 's3cret'; process.env.AUTH_USER = 'max';
process.env.KV_REST_API_URL = 'http://x'; process.env.KV_REST_API_TOKEN = 't';
const crypto = require('crypto');
const path = require('path');
function hp(p) { const iter = 1000, salt = crypto.randomBytes(8); return 'pbkdf2$' + iter + '$' + salt.toString('base64') + '$' + crypto.pbkdf2Sync(p, salt, iter, 32, 'sha256').toString('base64'); }
process.env.AUTH_PASSWORD_HASH = hp('pw-learner'); process.env.CTRL_PASSWORD_HASH = hp('pw-ctrl');
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
const stateH = require(path.join(API, '_ctrl-state.js'));

function req(method, body, cookie) { return { method: method, body: body, headers: { cookie: cookie || '' }, socket: { remoteAddress: '1.1.1.1' }, url: '/api/ctrl/io' }; }
function res() { const r = { h: {}, setHeader(k, v) { r.h[k] = v; }, end(b) { r.body = JSON.parse(b); } }; return r; }
async function call(h, method, body, cookie) { const r = res(); await h(req(method, body, cookie), r); return { s: r.statusCode, j: r.body, h: r.h }; }
function cookieFrom(h) { return (h['Set-Cookie'] || '').split(';')[0]; }

let fails = 0;
function expect(name, got, want) { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ' → ' + JSON.stringify(got) + (ok ? '' : '  (want ' + JSON.stringify(want) + ')')); }

(async () => {
  const lr = await call(login, 'POST', { user: 'teacher', password: 'pw-teach' }); expect('teacher login', [lr.s, lr.j.role], [200, 'teacher']);
  const teach = cookieFrom(lr.h);
  const er = await call(login, 'POST', { user: 'english', password: 'pw-eng' }); const eng = cookieFrom(er.h); expect('english login', [er.s, er.j.role], [200, 'english']);
  const cr = await call(login, 'POST', { user: 'controller', password: 'pw-ctrl' }); const ctrl = cookieFrom(cr.h); expect('controller login', [cr.s, cr.j.role], [200, 'controller']);
  expect('cross password rejected', (await call(login, 'POST', { user: 'teacher', password: 'pw-eng' })).s, 401);
  /* YAGONA kirish nuqtasi: /api/login barcha rollar uchun */
  const ulogin = require(path.join(API, 'login.js')), logout = require(path.join(API, 'logout.js'));
  const l1 = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner' }); expect('unified login: learner', [l1.s, l1.j.role, l1.j.workspace, /uzla_session=/.test(l1.h['Set-Cookie'])], [200, 'learner', '/', true]);
  const l2 = await call(ulogin, 'POST', { user: 'english', password: 'pw-eng' }); expect('unified login: english → staff cookie', [l2.s, l2.j.role, l2.j.workspace, /uzla_ctrl=/.test(l2.h['Set-Cookie'])], [200, 'english', '/controller', true]);
  expect('unified login: wrong password', (await call(ulogin, 'POST', { user: 'english', password: 'nope' })).s, 401);
  expect('unified login: client-chosen role not on account → 403', (await call(ulogin, 'POST', { user: 'english', password: 'pw-eng', role: 'controller' })).s, 403);
  const l3 = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner', remember: false }); expect('remember=false → session cookie (no Max-Age)', /Max-Age/.test(l3.h['Set-Cookie']), false);
  /* bir hisob, ikki rol: teacher ham "max" + o'sha parol → tanlash ekrani, cookie yo'q */
  process.env.TEACHER_USER = 'max'; process.env.TEACHER_PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH;
  const ch = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner' }); expect('multi-role → choose (no cookie)', [ch.s, ch.j.ok, ch.j.choose, ch.h['Set-Cookie'] || null], [200, false, ['learner', 'teacher'], null]);
  const ch2 = await call(ulogin, 'POST', { user: 'max', password: 'pw-learner', role: 'teacher' }); expect('multi-role → choose teacher', [ch2.s, ch2.j.role, /uzla_ctrl=/.test(ch2.h['Set-Cookie'])], [200, 'teacher', true]);
  expect('multi-role → choose english (not assigned) → 403', (await call(ulogin, 'POST', { user: 'max', password: 'pw-learner', role: 'english' })).s, 403);
  process.env.TEACHER_USER = 'teacher'; process.env.TEACHER_PASSWORD_HASH = hp('pw-teach');
  const lo = await call(logout, 'POST', null, ''); expect('unified logout clears both cookies', [lo.s, lo.h['Set-Cookie'].length, lo.h['Set-Cookie'].every(c => /Max-Age=0/.test(c))], [200, 2, true]);
  const r0 = res(); L.setSessionCookie(r0, 'max'); const learner = cookieFrom(r0.h);

  /* rol almashtirish: xodim tokeni o'quvchi cookie'sida */
  const forged = 'uzla_session=' + encodeURIComponent(teach.split('=')[1]);
  expect('forged learner cookie (staff token) → no role', L.roleOf(req('GET', null, forged)), null);
  expect('forged learner cookie → io 401', (await call(io, 'GET', null, forged)).s, 401);
  expect('sessionOf(staff token in learner cookie) → null', L.sessionOf(req('GET', null, forged)), null);

  /* o'quvchi xodim amallarini bajara olmaydi */
  expect('learner: assignment create', (await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'x' } }, learner)).s, 403);
  expect('learner: feedback create', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'x' } }, learner)).s, 403);
  expect('learner: notes', (await call(io, 'POST', { op: 'notes', text: 'x' }, learner)).s, 403);
  expect('learner: state', (await call(stateH, 'GET', null, learner)).s, 403);
  expect('no cookie: io', (await call(io, 'GET', null, '')).s, 401);
  expect('controller: assignment create', (await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'x' } }, ctrl)).s, 403);
  expect('controller: heartbeat', (await call(io, 'POST', { op: 'heartbeat' }, ctrl)).s, 403);

  /* topshiriqlar */
  const a1 = await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'Python 12', type: 'lesson', course: 'python', route: '#/lesson/12', priority: 'high', due: '2026-09-25' } }, teach);
  expect('teacher assigns python', [a1.s, a1.j.assignment.status, a1.j.assignment.route], [200, 'assigned', 'lesson/12']);
  expect('english assigns python → 403', (await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'x', course: 'python' } }, eng)).s, 403);
  const a2 = await call(io, 'POST', { op: 'assignment', action: 'create', a: { title: 'Essay 3', type: 'writing', course: 'english', route: 'writing/3' } }, eng);
  expect('english assigns english', a2.s, 200);
  expect('english edits teacher assignment → 403', (await call(io, 'POST', { op: 'assignment', action: 'update', a: { id: a1.j.assignment.id, title: 'hack', course: 'english' } }, eng)).s, 403);
  const g = await call(io, 'GET', null, learner);
  expect('learner GET assignments/notif/convs', [g.s, g.j.assignments.length, g.j.notif.map(n => n.type), Object.keys(g.j.convs)], [200, 2, ['assignment', 'assignment'], ['controller', 'teacher', 'english']]);
  expect('english GET sees only english', (await call(io, 'GET', null, eng)).j.assignments.map(a => a.course), ['english']);
  expect('learner completes', (await call(io, 'POST', { op: 'astatus', id: a1.j.assignment.id, status: 'completed' }, learner)).s, 200);
  expect('learner bad status', (await call(io, 'POST', { op: 'astatus', id: a1.j.assignment.id, status: 'hacked' }, learner)).s, 400);

  /* feedback */
  expect('controller private note', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'note', visibility: 'private', activity: { kind: 'lesson' } } }, ctrl)).s, 200);
  expect('controller student-visible → 403', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'note', visibility: 'student', activity: { kind: 'lesson' } } }, ctrl)).s, 403);
  expect('english feedback on python → 403', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'x', activity: { kind: 'python' } } }, eng)).s, 403);
  expect('teacher feedback', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'good', visibility: 'student', activity: { kind: 'writing', ref: 'wr3', route: 'writing/3', title: 'Essay 3' }, fb: { strengths: 'a', next: 'b' } } }, teach)).s, 200);
  expect('teacher private note', (await call(io, 'POST', { op: 'feedback', action: 'create', f: { text: 'secret', visibility: 'private', activity: { kind: 'lesson' } } }, teach)).s, 200);
  const lf = (await call(io, 'GET', null, learner)).j.feedback;
  expect('learner sees only student-visible', [lf.length, lf.every(f => f.visibility === 'student')], [1, true]);
  expect('teacher sees own private + visible', (await call(io, 'GET', null, teach)).j.feedback.length, 2);
  expect('controller sees own private + student-visible', (await call(io, 'GET', null, ctrl)).j.feedback.map(f => f.role).sort(), ['controller', 'teacher']);

  /* tekshiruv oqimi */
  const sub = await call(io, 'POST', { op: 'review', action: 'submit', r: { kind: 'writing', ref: 'wr3', title: 'Essay 3', route: 'writing/3', text: 'My essay' } }, learner);
  expect('submit', [sub.s, sub.j.review.stage], [200, 'submitted']);
  const rid = sub.j.review.id;
  expect('revise before review → 409', (await call(io, 'POST', { op: 'review', action: 'revise', r: { id: rid, text: 'v2' } }, learner)).s, 409);
  const fb1 = await call(io, 'POST', { op: 'review', action: 'feedback', r: { id: rid, fb: { strengths: 's', weaknesses: 'w', corrections: 'c', recommendations: 'r', next: 'n' } } }, eng);
  expect('english first review', [fb1.s, fb1.j.review.stage], [200, 'reviewed']);
  const rv = await call(io, 'POST', { op: 'review', action: 'revise', r: { id: rid, text: 'v2' } }, learner);
  expect('revise', [rv.s, rv.j.review.stage], [200, 'revised']);
  const fb2 = await call(io, 'POST', { op: 'review', action: 'feedback', r: { id: rid, fb: { strengths: 'ok' } } }, teach);
  expect('second review → completed', [fb2.s, fb2.j.review.stage, fb2.j.review.history.map(h => h.stage)], [200, 'completed', ['submitted', 'reviewed', 'revised', 'reviewed2', 'completed']]);
  expect('controller review → 403', (await call(io, 'POST', { op: 'review', action: 'complete', r: { id: rid } }, ctrl)).s, 403);
  const sp = await call(io, 'POST', { op: 'review', action: 'submit', r: { kind: 'speaking', ref: 'spk12', title: 'Speaking 12', route: 'speaking', text: 'notes' } }, learner);
  const spf = await call(io, 'POST', { op: 'review', action: 'feedback', r: { id: sp.j.review.id, result: 'completed', fb: { next: 'Part 2' } } }, teach);
  expect('speaking result closes', spf.j.review.stage, 'completed');

  /* chat */
  expect('learner → teacher', (await call(io, 'POST', { op: 'message', to: 'teacher', text: 'hi' }, learner)).s, 200);
  expect('learner → bad role', (await call(io, 'POST', { op: 'message', to: 'admin', text: 'hi' }, learner)).s, 400);
  expect('teacher → learner', (await call(io, 'POST', { op: 'message', text: 'hello' }, teach)).s, 200);
  const g3 = await call(io, 'GET', null, learner);
  expect('learner unread per conv', Object.keys(g3.j.convs).map(k => k + ':' + g3.j.convs[k].unread), ['controller:0', 'teacher:1', 'english:0']);
  const gt = await call(io, 'GET', null, teach);
  expect('teacher convs + unread', [Object.keys(gt.j.convs), gt.j.convs.teacher.unread], [['teacher'], 1]);
  expect('teacher read', (await call(io, 'POST', { op: 'read' }, teach)).s, 200);
  expect('teacher unread after read', (await call(io, 'GET', null, teach)).j.convs.teacher.unread, 0);

  /* sessiya */
  expect('teacher session → 403', (await call(io, 'POST', { op: 'session', action: 'start' }, teach)).s, 403);
  expect('controller session start', (await call(io, 'POST', { op: 'session', action: 'start' }, ctrl)).s, 200);
  expect('learner pause', (await call(io, 'POST', { op: 'session', action: 'pause' }, learner)).j.state, 'paused');
  expect('learner heartbeat with events', (await call(io, 'POST', { op: 'heartbeat', route: 'lesson/3', title: 'L3', events: [{ id: 'e1', at: 1, type: 'py-done', ref: '3', title: 'Lesson 3' }] }, learner)).s, 200);
  expect('controller sees events', (await call(io, 'GET', null, ctrl)).j.status.events.length, 1);

  /* english filtri */
  mem['uzla:state'] = JSON.stringify({ rev: 1, savedAt: 1, state: { scores: { 1: 9 }, best: { 1: 9 }, eng: { done: { 1: true } }, mistakes: [{ cat: 'python' }, { cat: 'grammar' }, { day: 3 }], quiz: { 'py:1': {}, 'eng:1': {} }, copy: { vocab: {}, coding: { a: 1 } }, plan: { wr1: true, dc1: true }, done: { 'dc:1': true, 'gr:x': true } } });
  const se = await call(stateH, 'GET', null, eng);
  expect('english state: no python', [!!se.j.state.scores, se.j.state.mistakes.length, Object.keys(se.j.state.quiz), Object.keys(se.j.state.plan), Object.keys(se.j.state.copy), Object.keys(se.j.state.done)], [false, 1, ['eng:1'], ['wr1'], ['vocab'], ['gr:x']]);
  expect('teacher state full', !!(await call(stateH, 'GET', null, teach)).j.state.scores, true);

  /* muddati o'tgan token */
  const body = Buffer.from(JSON.stringify({ u: 'max', exp: Date.now() - 1000 })).toString('base64url');
  const mac = crypto.createHmac('sha256', 's3cret').update(body).digest('base64url');
  expect('expired session', L.sessionOf({ headers: { cookie: 'uzla_session=' + body + '.' + mac } }), null);
  const bad = body + '.' + crypto.createHmac('sha256', 'other').update(body).digest('base64url');
  expect('bad signature', L.sessionOf({ headers: { cookie: 'uzla_session=' + bad } }), null);

  /* bildirishnoma */
  const nl = (await call(io, 'GET', null, learner)).j.notif;
  expect('learner notif types', nl.map(n => n.type).sort(), ['assignment', 'assignment', 'feedback', 'message', 'review', 'review', 'review', 'session'].sort());
  expect('notif read all', (await call(io, 'POST', { op: 'notif', action: 'read', all: true }, learner)).s, 200);
  expect('notif unread after', (await call(io, 'GET', null, learner)).j.notif.filter(n => !n.read).length, 0);

  /* Har hisob o'z parolini o'zi almashtiradi — bitta endpoint, rol cookie'dan */
  const pwH = require(path.join(API, 'password.js'));
  expect('teacher changes own password', (await call(pwH, 'POST', { current: 'pw-teach', next: 'pw-teach2' }, teach)).j.role, 'teacher');
  expect('teacher: old password rejected now', (await call(ulogin, 'POST', { user: 'teacher', password: 'pw-teach' })).s, 401);
  expect('teacher: new password works', (await call(ulogin, 'POST', { user: 'teacher', password: 'pw-teach2' })).j.role, 'teacher');
  expect('teacher change did not touch english', (await call(ulogin, 'POST', { user: 'english', password: 'pw-eng' })).j.role, 'english');
  expect('learner changes own password', (await call(pwH, 'POST', { current: 'pw-learner', next: 'pw-learner2' }, learner)).j.role, 'learner');
  expect('learner wrong current → 401', (await call(pwH, 'POST', { current: 'nope', next: 'x12345678' }, learner)).s, 401);
  expect('no cookie → 401', (await call(pwH, 'POST', { current: 'a', next: 'b1234567' }, '')).s, 401);
  console.log(fails ? ('\n' + fails + ' FAILED') : '\nALL OK');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
