/* ==========================================================================
   tools/pyai-engine-test.cjs — Python & AI yo'li dvigateli (progress qoidalari)
   node tools/pyai-engine-test.cjs
   Tekshiradi: completion ≠ mastery, eski kurs migratsiyasi (faqat completion),
   hint → hint → yechim tartibi, qayta urinish tarixni o'chirmaydi, takror
   navbati natijaga qarab, diagnostika boshlash nuqtasi, modul testi, loyiha
   holatlari, capstone qoidasi, reset faqat PyAI, sinxron birlashtirish.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
const mem = {}; global.localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
let TODAY = '2026-11-01';
const state = { best: {}, mission: { v: 1, keep: true } };
global.Store = { all: () => state, set: (k, v) => { state[k] = v; }, dateKey: () => TODAY, bestScore: d => state.best[d], logEvent: () => {} };
['js/data/course.js', 'js/data/pyai-1.js', 'js/data/pyai-m1.js', 'js/data/pyai-2.js', 'js/data/pyai-3.js', 'js/data/pyai-4.js', 'js/srs2.js', 'js/pyai.js'].forEach(f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))());
const A = global.PyAI, P = global.PYAI;
let fails = 0, n = 0;
function ok(name, cond, info) { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (cond ? '' : '  ' + JSON.stringify(info))); }
const PASS = { ok: true, tests: [{ name: 'a', pass: true }, { name: 'b', pass: true }] };
const FAIL = { ok: true, tests: [{ name: 'a', pass: true }, { name: 'b', pass: false, msg: 'x' }] };
function viewAll(lid) { P.config.requiredSections.forEach(s => A.markViewed(lid, s)); }
function answerAll(lid, right) { const L = P.lessons[lid]; (L.check || []).forEach((q, i) => A.answerMcq(lid + ':check:' + i, right)); (L.exit || []).forEach((q, i) => A.answerMcq(lid + ':exit:' + i, right)); }

/* ---------- completion ≠ mastery ---------- */
const lid = 'm1-strings', L = P.lessons[lid];
ok('fresh lesson: nothing', !A.lessonStatus(lid).completed && !A.lessonStatus(lid).mastered && A.lessonStatus(lid).viewed === 0);
viewAll(lid);
ok('viewing only is not completion', !A.lessonStatus(lid).completed, A.lessonStatus(lid));
A.recordAttempt(L.guided.id, FAIL); A.recordAttempt(L.independent.id, FAIL);
ok('submitted (even failed) → completed, not mastered', A.lessonStatus(lid).completed && !A.lessonStatus(lid).mastered);
answerAll(lid, true);
ok('100% checks but practical not passed → not mastered', !A.lessonStatus(lid).mastered && A.lessonStatus(lid).knowledge.score === 1);
A.recordAttempt(L.independent.id, PASS);
ok('independent passed + checks ≥ 80% → mastered', A.lessonStatus(lid).mastered);
ok('attempt history kept (fail then pass)', A.attempts(L.independent.id).length === 2 && A.attempts(L.independent.id)[0].pass === false);
answerAll(lid, false);
ok('re-answering wrong lowers mastery (latest answers count)', !A.lessonStatus(lid).mastered && A.lessonStatus(lid).completed);
answerAll(lid, true);

/* ---------- hint → hint → solution ---------- */
const ex = P.lessons['m1-lists'].independent.id;
ok('cannot open hint 2 before hint 1', !A.openHint(ex, 2));
ok('cannot open solution before trying', !A.canSolution(ex));
ok('hint 1 ok', A.openHint(ex, 1) && A.reveal(ex).hints === 1);
ok('hint 2 ok', A.openHint(ex, 2) && A.reveal(ex).hints === 2);
ok('solution still locked without an attempt', !A.openSolution(ex));
A.recordAttempt(ex, FAIL);
ok('solution after both hints + one attempt', A.openSolution(ex) && A.reveal(ex).sol);
A.recordAttempt(ex, PASS);
ok('pass after seeing solution ≠ independent', A.passed(ex) && !A.passedIndependent(ex));
viewAll('m1-lists'); A.recordAttempt(P.lessons['m1-lists'].guided.id, PASS); answerAll('m1-lists', true);
ok('lesson with solution-assisted pass is completed but not mastered', A.lessonStatus('m1-lists').completed && !A.lessonStatus('m1-lists').mastered);

/* ---------- timeout / bo'sh natija hech qachon "o'tdi" emas ---------- */
const ex2 = P.lessons['m1-loops'].guided.id;
ok('timeout is not a pass', !A.recordAttempt(ex2, { ok: false, timeout: true, tests: [] }).pass);
ok('zero tests is not a pass', !A.recordAttempt(ex2, { ok: true, tests: [] }).pass);

/* ---------- takror navbati ---------- */
const exR = P.lessons['m1-functions'].guided.id;
A.recordAttempt(exR, FAIL);
ok('failed exercise scheduled for tomorrow', A.S().review['ex:' + exR].due === '2026-11-02');
A.answerMcq('m1-functions:check:0', false, { lesson: 'm1-functions' });
TODAY = '2026-11-02';
ok('due items appear the next day', A.reviewDue().some(r => r.key === 'ex:' + exR) && A.reviewDue().some(r => r.key === 'mcq:m1-functions:check:0'));
A.reviewRate('mcq:m1-functions:check:0', 'independent');
ok('rating moves the due date', A.S().review['mcq:m1-functions:check:0'].due > TODAY);
A.recordAttempt(exR, PASS);
ok('independent pass reschedules further out', A.S().review['ex:' + exR].due > TODAY);

/* ---------- eski kurs migratsiyasi ---------- */
const basics = 'm1-basics';
ok('legacy not passed → not completed', !A.lessonStatus(basics).completed && A.lessonStatus(basics).legacy.any === false);
state.best = { 1: 9, 2: 8, 3: 7 };
ok('3 of 4 legacy days passed → still not completed', !A.lessonStatus(basics).completed);
state.best[4] = 6;
ok('legacy day below 7 → not completed', !A.lessonStatus(basics).completed);
state.best[4] = 10;
const bs = A.lessonStatus(basics);
ok('all legacy days ≥ 7 → completed (legacy)', bs.completed && bs.completedBy === 'legacy');
ok('legacy completion is NOT mastery', !bs.mastered);
ok('new lessons have no legacy mapping', A.lessonStatus('m1-mutability').legacy === null);
ok('original COURSE untouched (30 lessons)', global.COURSE.length === 30 && global.COURSE[0].day === 1);

/* ---------- diagnostika ---------- */
const items = P.diagnostic.items, allRight = {}; items.forEach((q, i) => { allRight[i] = q.a; });
ok('perfect diagnostic → start at module 2', A.scoreDiagnostic(allRight, true).start === P.modules.find(m => m.id === 'm2').lessons[0]);
const wrongStrings = Object.assign({}, allRight); wrongStrings[items.findIndex(q => q.topic === 'strings')] = (items.find(q => q.topic === 'strings').a + 1) % 4;
const r1 = A.scoreDiagnostic(wrongStrings, true);
ok('weak strings → start at m1-strings', r1.start === 'm1-strings' && r1.weak.includes('strings'), r1);
ok('code failure marks functions weak', A.scoreDiagnostic(allRight, false).weak.includes('functions'));
A.saveDiagnostic(wrongStrings, true);
ok('diagnostic saved; next lesson follows it (never locks earlier ones)', A.S().diag.start === 'm1-strings' && A.nextLesson().id !== undefined);

/* ---------- modul testi ---------- */
ok('module test needs score ≥ 80% AND task', !A.moduleTestPassed('m1'));
A.recordModuleTest('m1', 9, 10, false);
ok('9/10 without task → not passed', !A.moduleTestPassed('m1'));
A.recordModuleTest('m1', 7, 10, true);
ok('70% with task → not passed', !A.moduleTestPassed('m1'));
A.recordModuleTest('m1', 8, 10, true);
ok('80% + task → passed; retries kept', A.moduleTestPassed('m1') && A.S().modtest.m1.length === 3);
ok('module not complete until all lessons completed', !A.moduleStatus('m1').complete);

/* ---------- loyihalar ---------- */
const p1 = A.projectStatus('p1');
ok('project starts unchecked', !p1.autoChecked && !p1.selfAssessed);
A.recordAttempt(P.projects[0].milestones[0].ex.id, PASS);
ok('core milestone auto-checked after passing tests', A.projectStatus('p1').autoChecked);
P.projects[0].milestones[1].checks.forEach((c, i) => A.setProjectCheck('p1', 'repo', i, true));
ok('self checks → self-assessed (labelled, not verified)', A.projectStatus('p1').selfAssessed);
let threw = false; try { A.setProjectRepo('p1', 'javascript:alert(1)'); } catch (e) { threw = true; }
ok('repo URL validated', threw);
A.setProjectRepo('p1', 'https://github.com/uzleeder/task-manager');
ok('repo saved', A.projectStatus('p1').repo.includes('github.com'));

/* ---------- capstone ---------- */
P.capstone.rubric.forEach(r => A.setCapstone(r.k, 2));
ok('all 2s = 16/24 → pass', A.capstoneStatus().passed && A.capstoneStatus().total === 16);
A.setCapstone(P.capstone.rubric[0].k, 1); A.setCapstone(P.capstone.rubric[1].k, 3);
ok('any criterion at 1 → not passed even with 16', !A.capstoneStatus().passed);
ok('course not complete while modules/projects missing', !A.courseStatus().complete && A.courseStatus().missing.length > 0);

/* ---------- tavsiyalar ---------- */
const dexs = A.exercises('m1-collections');
A.recordAttempt(dexs[0].id, FAIL); A.recordAttempt(dexs[1].id, FAIL);
const recs = A.recommend();
ok('repeated dict mistakes → recommend m1-collections with reason', recs.some(r => r.route === 'pyai/l/m1-collections' && /dictionary/.test(r.why.en)), recs.map(r => r.route));
ok('recommendations explain themselves', recs.every(r => r.why && r.why.en && r.why.uz));

/* ---------- qoralama faqat mahalliy ---------- */
A.draft('x1', 'print(1)');
ok('code drafts stay in localStorage (not synced state)', mem['uzla.pyai.code.x1'] === 'print(1)' && !JSON.stringify(state.pyai).includes('print(1)'));

/* ---------- sinxron ---------- */
const Lc = JSON.parse(JSON.stringify(A.S())), Rc = JSON.parse(JSON.stringify(A.S()));
Rc.attempts['remote-ex'] = [{ at: '2026-11-02', ts: 99, pass: true, passed: 1, total: 1 }];
Rc.view['m2-testing'] = { sec: { concept: 1 } };
Lc.reveal['zz'] = { hints: 1, sol: false }; Rc.reveal['zz'] = { hints: 2, sol: true };
const mg = A.merge(Lc, Rc);
ok('merge keeps remote attempts and views', !!mg.attempts['remote-ex'] && !!mg.view['m2-testing']);
ok('merge never forgets revealed help (solution shown stays shown)', mg.reveal.zz.hints === 2 && mg.reveal.zz.sol === true);

/* ---------- o'xshash savol ---------- */
TODAY = '2026-11-05';
A.answerMcq('m1-loops:check:0', false);
const sim = A.similarQuestion('m1-loops:check:0');
ok('similar question is a different question from the same lesson', sim && sim.key !== 'm1-loops:check:0' && sim.key.indexOf('m1-loops:') === 0, sim && sim.key);
A.lessonQuestions('m1-loops').forEach(x => { if (x.key !== 'm1-loops:check:0') A.answerMcq(x.key, true); });
const sim2 = A.similarQuestion('m1-loops:check:0');
ok('when all are answered, falls back to a prerequisite lesson', sim2 && sim2.key.indexOf('m1-loops:') !== 0, sim2 && sim2.key);

/* ---------- aralash mashq ---------- */
const mx = A.mixedSet(8, '2026-11-05');
ok('mixed set uses only touched lessons', mx.items.every(it => { const st = A.lessonStatus(it.key.split(':')[0]); return st.viewed || st.attempted || st.completed; }) && mx.items.length > 0);
ok('mixed set interleaves (no two adjacent from the same lesson when avoidable)', mx.items.every((it, i) => i === 0 || it.key.split(':')[0] !== mx.items[i - 1].key.split(':')[0] || mx.lessons < 2), mx.items.map(x => x.key));
ok('mixed set is stable for a day and changes across days', JSON.stringify(A.mixedSet(8, '2026-11-05')) === JSON.stringify(mx) && JSON.stringify(A.mixedSet(8, '2026-11-06').items.map(x => x.key)) !== JSON.stringify(mx.items.map(x => x.key)));

/* ---------- o'quv vaqti va sozlamalar ---------- */
A.addMinute('2026-11-05'); A.addMinute('2026-11-05'); A.addMinute('2026-11-04');
const wt = A.weekTime('2026-11-05');
ok('study time is recorded per day (real minutes only)', wt[6].min === 2 && wt[5].min === 1 && wt[0].min === 0, wt);
A.setSettings({ ivls: [2, 5, 10], dailyMin: 90 });
ok('custom review intervals are used by scheduling', A.ivls().join() === '2,5,10');
const exI = P.lessons['m1-strings'].debug.id; A.recordAttempt(exI, FAIL);
ok('failed item still due tomorrow (wrong resets)', A.S().review['ex:' + exI].due === '2026-11-06');
let bad = 0; try { A.setSettings({ ivls: [5, 3] }); } catch (e) { bad++; } try { A.setSettings({ dailyMin: 2 }); } catch (e) { bad++; }
ok('invalid settings rejected', bad === 2 && A.ivls().join() === '2,5,10');
A.setSettings({ ivls: null });
ok('intervals reset to course default', A.ivls().join() === P.config.ivls.join());

/* ---------- workshop: refactor + yozma ---------- */
const m1w = P.modules.find(m => m.id === 'm1').workshop;
const rf = m1w.find(w => w.type === 'refactor'), ex1 = m1w.find(w => w.type === 'explain');
ok('workshop items are found by id', A.findEx(rf.id).slot === 'refactor' && A.findEx(ex1.id).slot === 'explain');
let short = false; try { A.saveWritten(ex1.id, 'too short'); } catch (e) { short = e.message === 'short'; }
ok('written answer below the word minimum is rejected', short);
const longText = Array(50).fill('word').join(' ');
A.saveWritten(ex1.id, longText); A.setWrittenChecks(ex1.id, { 0: true, 2: true });
ok('written answer saved as self-check, not auto-graded', A.writtenStatus(ex1.id).submitted && A.writtenStatus(ex1.id).self === 2 && !A.passed(ex1.id));
A.saveWritten(ex1.id, longText + ' more');
ok('revisions kept as versions', A.writtenStatus(ex1.id).versions === 2);

/* ---------- kontent migratsiyasi ---------- */
const S0 = A.S();
S0.cv = 1; S0.attempts['old-ex-id'] = [{ at: '2026-11-01', ts: 1, pass: true, passed: 1, total: 1 }]; S0.review['ex:old-ex-id'] = SRS2.fresh('2026-11-01', 1); S0.mcq['old-lesson:check:0'] = [{ at: '2026-11-01', ok: true }];
P.idMap = { 'old-ex-id': 'new-ex-id', 'old-lesson': 'new-lesson' };
const mg2 = A.migrate();
ok('migration moves progress to renamed ids (no silent reset)', mg2.migrated >= 3 && S0.attempts['new-ex-id'] && !S0.attempts['old-ex-id'] && S0.review['ex:new-ex-id'] && S0.mcq['new-lesson:check:0']);
ok('migration runs once per content version', A.migrate().migrated === 0 && S0.cv === P.version);
P.idMap = {};

/* ---------- reset faqat PyAI ---------- */
A.reset();
ok('reset clears only pyai (mission and legacy best untouched)', Object.keys(A.S().attempts).length === 0 && state.mission.keep === true && state.best[1] === 9);
ok('reset leaves a local backup', Object.keys(mem).some(k => k.indexOf('uzla.pyai.backup.') === 0));

console.log('\n' + (fails ? fails + ' FAILED of ' + n : 'ALL OK — ' + n + ' checks'));
process.exit(fails ? 1 : 0);
