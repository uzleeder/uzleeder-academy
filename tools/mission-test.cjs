/* ==========================================================================
   tools/mission-test.cjs — IELTS Mission dvigateli testlari (Node, brauzersiz)
   node tools/mission-test.cjs
   Haqiqiy ma'lumot fayllari (index.html tartibida) + js/srs2.js + js/mission.js
   soxta Store bilan yuklanadi. Hech narsa yozilmaydi.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
const mem = {}; global.localStorage = { getItem: k => mem[k] || null, setItem: (k, v) => { mem[k] = String(v); } };
let TODAY = '2026-10-25';
const state = { lang: 'en', mission: null };
global.Store = {
  all: () => state, get: k => state[k], set: (k, v) => { state[k] = v; }, dateKey: () => TODAY, logEvent: () => {},
  shiftDays: (k, n) => global.SRS2.addDays(k, n)
};
global.L = o => (o && typeof o === 'object') ? (o.en || o.uz) : o;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/data\/[^"?]+)/g)].map(m => m[1]);
if (files.indexOf('js/data/mission.js') < 0) files.push('js/data/mission.js');
files.forEach(f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))());
global.ENG_READING = [].concat(global.ENG_READING_1, global.ENG_READING_2, global.ENG_READING_3, global.ENG_READING_4);
['js/srs2.js', 'js/mission.js'].forEach(f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))());
const M = global.Mission, S = global.SRS2;

let fails = 0, n = 0;
function ok(name, cond, info) { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (cond ? '' : '  ' + JSON.stringify(info))); }
const sum = ts => ts.reduce((s, t) => s + t.min, 0);

/* ---------- kalendar ---------- */
ok('day 1 = 25 Oct 2026', M.dayIndex('2026-10-25') === 1);
ok('day 113 = 14 Feb 2027 (final review, counted in week 16)', M.dayIndex('2027-02-14') === 113 && M.C().finalReview === '2027-02-14');
ok('16 weeks', M.weekOf('2027-02-14') === 16 && M.weekOf('2026-10-31') === 1 && M.weekOf('2026-11-01') === 2);
ok('phases cover weeks 1–16', [1, 2, 5, 6, 10, 11, 14, 15, 16].every(w => M.C().phases.some(p => w >= p.from && w <= p.to)));
ok('mock days are inside the mission and Saturdays', M.C().mockDays.every(d => M.inMission(d) && new Date(d + 'T00:00:00').getDay() === 6));

/* ---------- byudjet: har rejimda reja yig'indisi = byudjet ---------- */
['60', '90', '120', '195'].forEach(md => {
  const b = M.build('2026-11-03', md);
  ok('mode ' + md + ': planned minutes = budget', sum(b.tasks) === Number(md), { got: sum(b.tasks), tasks: b.tasks.map(t => t.skill + ':' + t.min) });
});
state.mission.settings.custom = 150;
ok('custom 150: planned = 150', sum(M.build('2026-11-03', 'custom').tasks) === 150);
state.mission.settings.custom = 45;
ok('custom 45: planned = 45', sum(M.build('2026-11-03', 'custom').tasks) === 45, M.build('2026-11-03', 'custom').tasks.map(t => t.skill + ':' + t.min));
const b195 = M.build('2026-11-03', '195');
ok('195: all five skills + error review 15', ['reading', 'listening', 'vocab', 'grammar', 'speaking'].every(s => b195.tasks.some(t => t.skill === s)) && b195.tasks.some(t => t.skill === 'review' && t.min === 15));
const b60 = M.build('2026-11-03', '60');
ok('60: at most 3 skills + review, others noted', b60.tasks.filter(t => t.skill !== 'review').length <= 3 && b60.notes.length >= 1);
ok('every task has objective/activity/material/criteria/assess/next/why', b195.tasks.every(t => t.objective && t.activity && t.material && t.material.route && t.criteria && t.assess && t.next && Array.isArray(t.why) && t.min > 0), b195.tasks.map(t => t.id));
ok('task titles bilingual objects', b195.tasks.every(t => t.title && t.title.uz && t.title.en));

/* ---------- 1-hafta: diagnostika ---------- */
const w1 = M.build('2026-10-26', '195');
ok('week 1 tasks are diagnostics', w1.tasks.filter(t => t.skill !== 'review').every(t => t.kind === 'diag'), w1.tasks.map(t => t.kind));
const pre = M.build('2026-10-22', '195');
ok('before start: notes + diagnostics offered', pre.before && pre.notes.some(x => /starts on 2026-10-25/.test(x.en)) && pre.tasks.some(t => t.kind === 'diag'));

/* ---------- ustuvorlik dalilga qarab o'zgaradi ---------- */
const p0 = M.priorities('2026-11-03');
ok('unassessed listening explained', p0.listening.why.some(w => /Not assessed/.test(w.en)));
ok('reading prelim 5/5 shown as low confidence', p0.reading.why.some(w => /5\/5.*low confidence/.test(w.en)));
ok('grammar prelim 2/5 ranks above reading', p0.grammar.score > p0.reading.score, p0);
M.record({ kind: 'reading', ref: 'r:2', mode: 'practice', items: Array.from({ length: 14 }, (_, i) => ['q' + i, i < 6 ? 2 : 0, i < 7 ? 'tfng' : 'headings']) });
const p1 = M.priorities('2026-11-03');
ok('low reading accuracy raises reading priority', p1.reading.score > p0.reading.score && p1.reading.why.some(w => /below 60%/.test(w.en)), p1.reading);
ok('reading task targets weakest type', /headings|tfng/.test(JSON.stringify(M.build('2026-11-03', '195').tasks.find(t => t.skill === 'reading').why)));
ok('attempted passage not picked again', M.build('2026-11-03', '195').tasks.find(t => t.skill === 'reading').ref !== 'r:2');

/* ---------- reja muzlatiladi, o'tkazilgan kun uyulmaydi ---------- */
TODAY = '2026-11-03';
const d1 = M.day('2026-11-03');
ok('plan frozen on first view', !!state.mission.days['2026-11-03'].plan && d1.tasks.length > 0);
const firstId = d1.tasks[0].id;
M.tasks.start('2026-11-03', firstId); M.tasks.pause('2026-11-03', firstId); M.tasks.start('2026-11-03', firstId);
ok('start/pause/start keeps state', state.mission.days['2026-11-03'].tasks[firstId].st === 'active');
M.tasks.done('2026-11-03', firstId);
ok('done', M.day('2026-11-03').tasks[0].state.st === 'done');
ok('frozen plan unchanged on re-view', JSON.stringify(M.day('2026-11-03').tasks.map(t => t.id)) === JSON.stringify(d1.tasks.map(t => t.id)));
TODAY = '2026-11-04';
const d2 = M.day('2026-11-04');
ok('next day: one unfinished noted, rest not carried', d2.notes.some(x => /Unfinished yesterday/.test(x.en)) && d2.notes.some(x => /Not carried over/.test(x.en)), d2.notes);
ok('no backlog: planned minutes still = budget', d2.planned === 195, d2.planned);
TODAY = '2026-11-08';
const d3 = M.day('2026-11-08');
ok('missed days → note, normal day', d3.notes.some(x => /day\(s\) missed/.test(x.en)) && d3.planned === 195, d3.notes);
ok('move task to another day', M.tasks.move('2026-11-08', d3.tasks[1].id, '2026-11-09') && M.day('2026-11-09').tasks.some(t => t.movedFrom === '2026-11-08'));
ok('moved task not counted in source day', M.day('2026-11-08').planned === 195 - d3.tasks[1].min);
const dm = M.tasks.setMode('2026-11-10', '90');
ok('mode change → 90 min plan', dm.planned === 90 && state.mission.settings.mode === '90');
state.mission.settings.mode = '195';

/* ---------- mock va yakuniy kun ---------- */
const mk = M.build('2026-11-21');
ok('mock day plan: practice mock tasks', mk.mock && mk.tasks.filter(t => t.kind === 'mock').length === 4 && mk.tasks.every(t => /NOT a band|—/.test(t.assess.en) || t.kind !== 'mock'));
const fin = M.build('2027-02-14');
ok('final review day', fin.final && fin.tasks.some(t => t.kind === 'profile'));

/* ---------- SRS2 ---------- */
let it = S.fresh('2026-11-01', 0);
it = S.apply(it, 'independent', '2026-11-01'); ok('1st correct → +1 day', it.due === '2026-11-02');
it = S.apply(it, 'independent', '2026-11-02'); ok('2nd correct → +3 days', it.due === '2026-11-05');
it = S.apply(it, 'independent', '2026-11-05'); ok('3rd in a row skips a step → +14', it.due === '2026-11-19', it);
it = S.apply(it, 'wrong', '2026-11-19'); ok('wrong → tomorrow, step 0', it.due === '2026-11-20' && it.step === 0 && it.lapses === 1);
it = S.apply(it, 'wrong', '2026-11-20'); it = S.apply(it, 'independent', '2026-11-21');
ok('repeated error (2 lapses) stays at 1 day until 2 independent', it.due === '2026-11-22', it);
it = S.apply(it, 'partial', '2026-11-22'); ok('partial keeps short interval', it.due === '2026-11-23');
ok('custom intervals respected', S.apply(S.fresh('2026-11-01', 0), 'independent', '2026-11-01', [2, 5]).due === '2026-11-03');
ok('interval grows ×2 after last, cap 90', S.ivlFor(4, [1, 3, 7, 14]) === 28 && S.ivlFor(20, [1, 3, 7, 14]) === 90);

/* ---------- xatolar banki ---------- */
TODAY = '2026-11-10';
const e = M.errors.add({ skill: 'grammar', src: 'g:articles', key: '1', q: 'I bought ___ apple.', resp: 'a', correct: 'an', cat: 'articles', expl: 'vowel sound' });
ok('error added, due tomorrow', e.status === 'open' && e.srs.due === '2026-11-11');
M.errors.add({ skill: 'grammar', src: 'g:articles', key: '1', resp: 'a' });
ok('same item again → count 2, repeated', state.mission.errors[e.id].n === 2 && M.errors.stats().repeated.length >= 1);
TODAY = '2026-11-11'; M.errors.review(e.id, 'independent');
TODAY = '2026-11-12'; M.errors.review(e.id, 'independent');
ok('two independent in a row → fixed', state.mission.errors[e.id].status === 'fixed', state.mission.errors[e.id]);
M.errors.review(e.id, 'wrong');
ok('wrong after fixed → returned', state.mission.errors[e.id].status === 'returned');
ok('grammar focus from errors', M.errors.grammarFocus().cat === 'articles');

/* ---------- lug'at ---------- */
const nw = M.vocab.peekNew(3);
ok('Destination B2 new words from pointer', nw.length === 3 && nw[0].id.indexOf('d:') === 0 && nw[0].w && nw[0].m);
nw.forEach(x => M.vocab.learn(x));
ok('pointer advanced', M.vocab.peekNew(1)[0].id !== nw[0].id);
const w0 = state.mission.vocab.items[nw[0].id];
ok('production check: exact → independent', M.vocab.check(nw[0].id, w0.w).outcome === 'independent');
ok('with hint → hint', M.vocab.check(nw[1].id, state.mission.vocab.items[nw[1].id].w, true).outcome === 'hint');
const longW = Object.values(state.mission.vocab.items).find(x => x.w.length > 6) || state.mission.vocab.items[nw[2].id];
const typo = longW.w.slice(0, -1) + (longW.w.slice(-1) === 'x' ? 'y' : 'x');
const ck = M.vocab.check(Object.keys(state.mission.vocab.items).find(k => state.mission.vocab.items[k] === longW), typo);
ok('close spelling → wrong + spelling error', !ck.ok && ck.close && M.errors.list().some(x => x.skill === 'vocab' && x.cat === 'spelling'), ck);
ok('own word added', !!M.vocab.addOwn('scalable', 'kengaytiriladigan', 'Our app must be scalable.'));

/* ---------- writing studio ---------- */
const wid = M.studio.create({ task: 2, promptId: 't2-01' });
M.studio.saveDraft(wid, 'Some people think AI will replace teachers. However, I disagree.\n\nTeachers motivate students.');
const stt = M.studio.stats(M.studio.get(wid).drafts[0].text);
ok('text stats: words, paragraphs, linkers', stt.words === 13 && stt.paras === 2 && stt.linkers.indexOf('however') >= 0, stt);
M.studio.saveDraft(wid, 'Some people believe AI will replace teachers. However, I strongly disagree.\n\nTeachers motivate students.', true);
ok('new version kept', M.studio.get(wid).drafts.length === 2);
const df = M.studio.diff(M.studio.get(wid).drafts[0].text, M.studio.get(wid).drafts[1].text);
ok('word diff marks changes', df.some(x => x[0] === '+' && x[1] === 'strongly') && df.some(x => x[0] === '-' && x[1] === 'think'));
M.studio.annotate(wid, 1, { quote: 'replace teachers', cat: 'articles', note: 'check articles', fix: 'replace the teachers' });
ok('grammar annotation → grammar error in bank', M.errors.list().some(x => x.src === 'wr:' + wid && x.skill === 'grammar'));
M.studio.assess(wid, 1, { tr: 6, cc: 6.5, lr: 6, gra: 5.5 }, {});
ok('self-assessment recorded as writing evidence (estimate)', M.profile().writing.n === 1 && M.profile().writing.self === true && M.lastSelfAvg(M.studio.get(wid)) === 6);
for (let i = 0; i < 7; i++) M.studio.saveDraft(wid, 'v' + i, true);
ok('drafts capped at 6, first kept', M.studio.get(wid).drafts.length === 6 && /Some people think/.test(M.studio.get(wid).drafts[0].text));

/* ---------- speaking ---------- */
const sid = M.speaking.create({ part: 'full', cardId: 'c01' });
M.speaking.assess(sid, { fc: 6, lr: 6, gra: 5, pron: 6 }, { errors: 'I am agree\nmore better' });
ok('pronunciation dropped without recording', M.speaking.get(sid).self.pron === undefined);
ok('reflection errors → speaking errors', M.errors.list().filter(x => x.skill === 'speaking').length === 2);

/* ---------- natijalar: to'rt xil ---------- */
ok('practice result keeps raw only', M.results.add({ kind: 'practice', raw: { reading: '28/40' } }).L === undefined);
ok('estimate with bands', M.results.add({ kind: 'estimate', W: 6.5, S: 6 }).W === 6.5);
let threw = 0; try { M.results.add({ kind: 'official', L: 7.3 }); } catch (x) { threw++; } try { M.results.add({ kind: 'estimate' }); } catch (x) { threw++; } try { M.results.add({ kind: 'band' }); } catch (x) { threw++; }
ok('invalid band / empty / unknown kind rejected', threw === 3);

/* ---------- kitob ishi ---------- */
M.books.add({ book: 're4', title: 'Reading Explorer 4', unit: '3A', score: 7, total: 9, types: ['main idea'] });
ok('book work logged as reading evidence', M.profile().reading.books === 1 && M.attemptsOf('reading').some(a => a.kind === 'book'));

/* ---------- grammatika kaliti ---------- */
ok('auto answers parsed', JSON.stringify(M.Cat.autoAnswers('have studied / have been studying')) === '["have studied","have been studying"]');
ok('ambiguous key → self-check', M.Cat.autoAnswers('has … finished') === null && M.Cat.autoAnswers('✓ Past Simple to\'g\'ri') === null);
ok('every grammar category has exercises', Object.keys(M.C().grammarCats).every(c => M.Cat.grammarItems(c).length >= 5), Object.keys(M.C().grammarCats).map(c => c + ':' + M.Cat.grammarItems(c).length));
ok('Target Listening keys: 12 tests × 30', M.Cat.tlSessions().length === 24 && [1, 12].every(t => M.Cat.tlKey(t).length === 30));
ok('speaking cards include platform + Speaking 30', M.Cat.cards().length >= 15 && M.Cat.cards().every(c => c.q && Array.isArray(c.p3)));

/* ---------- profil ---------- */
const pr = M.profile();
ok('unassessed listening = none', pr.listening.conf === 'none' && pr.listening.n === 0);
ok('reading confidence from evidence count', pr.reading.conf === 'medium' && pr.reading.n === 14, pr.reading);

/* ---------- sinxron birlashtirish ---------- */
const A = JSON.parse(JSON.stringify(state.mission)), B = JSON.parse(JSON.stringify(state.mission));
B.attempts.push({ id: 'remote1', at: '2026-11-12', ts: Date.now() + 5, kind: 'listening', ref: 'tl:2:1', items: [['1', 2, '']] });
A.days['2026-11-08'].tasks['x'] = { st: 'done', at: 5 }; B.days['2026-11-08'].tasks['x'] = { st: 'todo', at: 1 };
B.writing['wremote'] = { id: 'wremote', at: Date.now() + 9, drafts: [] };
const mg = M.merge(A, B);
ok('merge: union attempts', mg.attempts.some(a => a.id === 'remote1') && mg.attempts.length === A.attempts.length + 1);
ok('merge: newer task state wins', mg.days['2026-11-08'].tasks.x.st === 'done');
ok('merge: remote writing kept', !!mg.writing.wremote);

/* ---------- zaxira ---------- */
ok('one-time local backup written before first mission write', !!mem['uzla.state.backup.mission-v1']);

console.log('\n' + (fails ? fails + ' FAILED of ' + n : 'ALL OK — ' + n + ' checks'));
process.exit(fails ? 1 : 0);
