/* ==========================================================================
   tools/jobready-test.cjs — Job Ready dasturi (birlashtiruvchi tizim)
   node tools/jobready-test.cjs
   Tekshiradi: 5 bosqich, komponentlar real manbadan o'qiladi (eski kurs,
   DataCamp, PyAI), bo'sh holatda hech qanday mezon bajarilmagan, mezonlar
   faqat dalil paydo bo'lganda yonadi, keyingi qadamlar marshrutlari to'g'ri.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
const mem = {}; global.localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
const state = { best: {}, done: {}, mission: { v: 1, keep: true } };
global.Store = { all: () => state, set: (k, v) => { state[k] = v; }, dateKey: () => '2026-11-01', bestScore: d => state.best[d], logEvent: () => {},
  doneCount: () => Object.keys(state.done).length, isDone: d => !!state.done[d] };
let dcDone = 0;
global.DataCamp = { total: () => 6, doneCount: () => dcDone, current: () => ({ n: dcDone + 1, title: 'Ch' }) };
global.App = { firstOpenDay: () => { for (let d = 1; d <= 30; d++) if (!state.done[d]) return d; return 30; } };
['js/data/course.js', 'js/data/pyai-1.js', 'js/data/pyai-m1.js', 'js/data/pyai-2.js', 'js/data/pyai-3.js', 'js/data/pyai-4.js', 'js/srs2.js', 'js/pyai.js', 'js/jobready.js'].forEach(f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))());
const J = global.JobReady, A = global.PyAI, P = global.PYAI;
let fails = 0, n = 0;
function ok(name, cond, info) { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (cond ? '' : '  ' + JSON.stringify(info))); }

let s = J.status();
ok('5 stages', s.stages.length === 5, s.stages.map(x => x.id));
ok('stage 1 includes legacy course, DataCamp and PyAI m0–m1', ['python', 'datacamp', 'pyai/m/m0'].every(r => s.stages[0].parts.some(p => p.route === r)));
ok('legacy total = 30 lessons', s.stages[0].parts[0].total === global.COURSE.length && global.COURSE.length === 30);
ok('every PyAI module appears exactly once across stages', (() => { const ids = []; s.stages.forEach(st => st.parts.forEach(p => (p.modules || []).forEach(m => ids.push(m)))); return ids.sort().join() === P.modules.map(m => m.id).sort().join(); })());
ok('every project appears once', (() => { const t = s.stages.reduce((a, st) => a + st.parts.filter(p => p.kind === 'projects').reduce((b, p) => b + p.total, 0), 0); return t === P.projects.length; })());
ok('fresh: 0 criteria met, not ready', s.met === 0 && !s.ready, s.criteria.filter(c => c.met).map(c => c.id));
ok('fresh: current stage is stage 1', s.current === 's1');
ok('fresh: overall progress 0', s.stages.every(x => x.done === 0));
ok('every criterion has rule, evidence and a route', s.criteria.every(c => c.rule && c.evidence && c.route));

for (let d = 1; d <= 24; d++) state.done[d] = true;
s = J.status();
ok('24 legacy lessons → Python fundamentals criterion met', s.criteria.find(c => c.id === 'py').met);
ok('legacy progress reflected in stage 1', s.stages[0].parts[0].done === 24);
dcDone = 6;
ok('DataCamp all lessons → criterion met', J.status().criteria.find(c => c.id === 'dc').met);
ok('DataCamp finished → no DataCamp next step', !J.nextSteps().some(x => /^datacamp\//.test(x.route)));
dcDone = 2;
ok('DataCamp in progress → next step links to lesson 3', J.nextSteps().some(x => x.route === 'datacamp/3'));
ok('legacy next step links to day 25', J.nextSteps().some(x => x.route === 'lesson/25'));
ok('next steps ≤ 5 and all have routes', (() => { const ns = J.nextSteps(); return ns.length <= 5 && ns.every(x => x.route && x.title && x.why); })());

/* projects: auto-check alone is not enough, repo required */
const p1 = P.projects[0];
p1.milestones.filter(m => m.ex).forEach(m => A.recordAttempt(m.ex.id, { ok: true, tests: [{ name: 'a', pass: true }] }));
ok('project auto-checked → counted in stage progress', J.status().stages.some(st => st.parts.some(p => p.kind === 'projects' && p.done === 1)));
ok('project criterion not met with 1 project', !J.status().criteria.find(c => c.id === 'proj').met);

/* capstone: self rubric */
P.capstone.rubric.forEach(r => A.setCapstone(r.k, 1));
ok('capstone below threshold → not met', !J.status().criteria.find(c => c.id === 'cap').met);
P.capstone.rubric.forEach(r => A.setCapstone(r.k, 3));
ok('capstone passes rubric → met', J.status().criteria.find(c => c.id === 'cap').met);
ok('evidence says self-assessed', /self-assessed/.test(J.status().criteria.find(c => c.id === 'cap').evidence.en));

/* page renders */
global.L = o => o.en; global.esc = x => String(x).replace(/</g, '&lt;'); global.IC = new Proxy({}, { get: () => '<i></i>' });
new Function(fs.readFileSync(path.join(root, 'js/pages/jobready.js'), 'utf8'))();
const html = global.PageJobReady();
ok('page renders stages, criteria and honest note', /Job Ready/.test(html) && /Job-ready criteria/.test(html) && /does not guarantee a job/.test(html));
ok('page links to legacy course and DataCamp', /data-go="python"/.test(html) && /data-go="datacamp"/.test(html));

console.log('\n' + (fails ? fails + ' FAILED' : 'ALL OK') + ' (' + n + ' checks)');
process.exit(fails ? 1 : 0);
