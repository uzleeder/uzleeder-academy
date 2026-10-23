/* ==========================================================================
   tools/pyai-test.cjs — Python & AI kursi: tuzilma va yechimlar testi
   node tools/pyai-test.cjs [--no-python]
   1) Tuzilma: modul→dars havolalari, prerekvizitlar (sikl yo'q), takroriy
      ID yo'q, MCQ javob indeksi to'g'ri va izohli, har mashqda test bor,
      legacyMap 30 kunni qamraydi va mavjud darsga ishora qiladi.
   2) Yechimlar: har kod mashqining reference yechimi o'z testlaridan
      HAQIQIY CPython bilan o'tadi; starter/buggy kod esa kamida bitta testda
      yiqiladi (testlar ma'noli ekanini tekshiradi). pandas kerak bo'lgan
      mashqlar (pkgs) bu yerda o'tkazib yuboriladi — ular brauzerda
      Pyodide bilan tekshiriladi (tools/pyai-browser-check.md).
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const root = path.join(__dirname, '..');
global.window = global;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let files = [...html.matchAll(/<script src="(js\/data\/pyai[^"?]*)/g)].map(m => m[1]);
if (!files.length) files = fs.readdirSync(path.join(root, 'js/data')).filter(f => /^pyai/.test(f)).sort((a, b) => (a === 'pyai-1.js' ? -1 : b === 'pyai-1.js' ? 1 : a.localeCompare(b))).map(f => 'js/data/' + f);
files.forEach(f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))());
global.COURSE = (function () { new Function(fs.readFileSync(path.join(root, 'js/data/course.js'), 'utf8'))(); return global.COURSE; })();
const P = global.PYAI;
let fails = 0, n = 0;
function ok(name, cond, info) { n++; if (!cond) { fails++; console.log('FAIL ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 400) : '')); } }

/* ---------- 1. tuzilma ---------- */
const ids = Object.keys(P.lessons);
ok('modules exist', P.modules.length >= 10, P.modules.map(m => m.id));
ok('module numbers 0..9 unique', JSON.stringify(P.modules.map(m => m.n).sort((a, b) => a - b)) === JSON.stringify([...Array(P.modules.length).keys()]), P.modules.map(m => m.n));
const inMods = [];
P.modules.forEach(m => m.lessons.forEach(l => { inMods.push(l); ok('module ' + m.id + ' → lesson ' + l + ' exists', !!P.lessons[l]); ok('lesson ' + l + ' module field = ' + m.id, P.lessons[l] && P.lessons[l].module === m.id); }));
ok('no lesson in two modules', new Set(inMods).size === inMods.length);
ok('no orphan lessons', ids.every(id => inMods.includes(id)), ids.filter(id => !inMods.includes(id)));
const exIds = [];
function checkMcq(where, q) {
  ok(where + ': mcq shape', q && q.q && Array.isArray(q.opts) && q.opts.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length, q);
  ok(where + ': mcq has explanation', !!(q && q.why && (q.why.uz || q.why.en || typeof q.why === 'string')));
}
const EXS = [];
function checkEx(where, ex, kind) {
  ok(where + ': exercise id', !!ex.id); exIds.push(ex.id);
  ok(where + ': prompt uz+en', !!(ex.prompt && ex.prompt.uz && ex.prompt.en));
  ok(where + ': tests present', Array.isArray(ex.tests) && ex.tests.length >= 1 && ex.tests.every(t => Array.isArray(t) && t[0] && t[1]));
  ok(where + ': solution present', typeof ex.solution === 'string' && ex.solution.trim().length > 0);
  ok(where + ': 2 hints (graded)', Array.isArray(ex.hints) && ex.hints.length >= 2);
  ok(where + ': level valid', ['beginner', 'intermediate', 'challenge'].includes(ex.level), ex.level);
  EXS.push({ where, ex, kind });
}
ids.forEach(id => {
  const L = P.lessons[id], w = 'lesson ' + id;
  ['title', 'goal', 'concept', 'real'].forEach(k => ok(w + ': ' + k + ' uz+en', !!(L[k] && L[k].uz && L[k].en)));
  ok(w + ': terms', Array.isArray(L.terms) && L.terms.length >= 2);
  ok(w + ': example code', L.example && typeof L.example.code === 'string' && L.example.code.length > 10);
  ok(w + ': predict', L.predict && L.predict.code && Number.isInteger(L.predict.a) && L.predict.a < L.predict.opts.length && L.predict.why);
  ok(w + ': common mistake', L.mistake && L.mistake.bad && L.mistake.good && L.mistake.why);
  ['guided', 'independent', 'debug'].forEach(k => { ok(w + ': ' + k + ' exercise', !!L[k]); if (L[k]) checkEx(w + '.' + k, L[k], k); });
  ok(w + ': ≥2 knowledge checks', Array.isArray(L.check) && L.check.length >= 2); (L.check || []).forEach((q, i) => checkMcq(w + '.check' + i, q));
  ok(w + ': exit assessment', Array.isArray(L.exit) && L.exit.length >= 1); (L.exit || []).forEach((q, i) => checkMcq(w + '.exit' + i, q));
  ok(w + ': summary', Array.isArray(L.summary) && L.summary.length >= 2);
  (L.prereq || []).forEach(p => ok(w + ': prereq ' + p + ' exists', !!P.lessons[p]));
});
P.modules.forEach(m => { if (m.test) { (m.test.items || []).forEach((q, i) => checkMcq('module ' + m.id + '.test' + i, q)); if (m.test.task) checkEx('module ' + m.id + '.task', m.test.task, 'task'); } });
/* workshop: refactor (kod, testlar) · explain/design (namuna + mezon) */
P.modules.filter(m => m.n > 0).forEach(m => {
  const ws = m.workshop || [];
  ok('module ' + m.id + ' has a refactor and an explain/design task', ws.some(w => w.type === 'refactor') && ws.some(w => w.type === 'explain' || w.type === 'design'), ws.map(w => w.type));
  ws.forEach(w => {
    if (w.type === 'refactor') checkEx('workshop ' + w.id, w, 'refactor');
    else { exIds.push(w.id); ok('workshop ' + w.id + ': prompt uz+en', !!(w.prompt && w.prompt.uz && w.prompt.en)); ok('workshop ' + w.id + ': model answer uz+en', !!(w.model && w.model.uz && w.model.en)); ok('workshop ' + w.id + ': rubric ≥ 3', Array.isArray(w.rubric) && w.rubric.length >= 3); ok('workshop ' + w.id + ': min words', w.minWords >= 40); }
  });
});
const types = new Set(); Object.keys(P.lessons).forEach(id => { types.add('mcq'); types.add('predict'); ['guided', 'independent', 'debug'].forEach(k => P.lessons[id][k] && types.add(k)); }); P.modules.forEach(m => (m.workshop || []).forEach(w => types.add(w.type))); P.projects.forEach(p => p.milestones.forEach(ms => types.add(ms.ex ? 'milestone-code' : 'milestone-checklist')));
ok('all exercise types from the brief exist', ['mcq', 'predict', 'debug', 'guided', 'independent', 'refactor', 'explain', 'design', 'milestone-code', 'milestone-checklist'].every(x => types.has(x)), [...types]);
ok('content version ≥ 2 with an id map', P.version >= 2 && typeof P.idMap === 'object');
ok('every module except m0/m9 has a module test', P.modules.filter(m => m.n > 0).every(m => m.test && m.test.items && m.test.items.length >= 5 && m.test.task), P.modules.filter(m => !(m.test && m.test.task)).map(m => m.id));
/* prerekvizit sikli */
const state = {}; let cycle = null;
function visit(id, stack) { if (state[id] === 2) return; if (state[id] === 1) { cycle = stack.concat(id); return; } state[id] = 1; (P.lessons[id].prereq || []).forEach(p => P.lessons[p] && visit(p, stack.concat(id))); state[id] = 2; }
ids.forEach(id => visit(id, []));
ok('no prerequisite cycles', !cycle, cycle);
/* diagnostika */
ok('diagnostic ≥ 12 items + code', P.diagnostic && P.diagnostic.items.length >= 12 && P.diagnostic.code);
(P.diagnostic.items || []).forEach((q, i) => { checkMcq('diag' + i, Object.assign({}, q, { q: q.q })); ok('diag' + i + ' → lesson exists', !!P.lessons[q.lesson], q.lesson); });
checkEx('diag.code', P.diagnostic.code, 'diag');
/* legacy map */
const days = P.legacyMap.map(x => x.day).sort((a, b) => a - b);
ok('legacyMap covers all 30 legacy days once', JSON.stringify(days) === JSON.stringify([...Array(30).keys()].map(i => i + 1)), days);
P.legacyMap.forEach(x => ok('legacy ' + x.day + ' → ' + x.to + ' exists', !!P.lessons[x.to] || x.to === 'm1-test'));
ok('legacy days exist in COURSE', P.legacyMap.every(x => global.COURSE.some(d => d.day === x.day)));
ids.forEach(id => (P.lessons[id].legacy || []).forEach(d => ok(id + ' legacy day ' + d + ' mapped back', P.legacyMap.some(x => x.day === d && x.to === id))));
/* loyihalar va capstone */
ok('5 projects', P.projects.length === 5, P.projects.map(p => p.id));
P.projects.forEach(p => { ok('project ' + p.id + ' milestones', Array.isArray(p.milestones) && p.milestones.length >= 2); (p.milestones || []).forEach(ms => { if (ms.ex) checkEx('project ' + p.id + '.' + ms.id, ms.ex, 'project'); ok('project ' + p.id + '.' + ms.id + ' has check list or ex', !!ms.ex || (Array.isArray(ms.checks) && ms.checks.length)); }); });
ok('capstone rubric', P.capstone && Array.isArray(P.capstone.rubric) && P.capstone.rubric.length >= 5 && P.capstone.rubric.every(r => Array.isArray(r.levels) && r.levels.length >= 3));
ok('portfolio checklist', P.portfolio.length >= 8);
ok('config has mastery rules', P.config && P.config.mastery === 0.8 && P.config.requiredExercises && P.config.ivls);
ok('no duplicate exercise ids', new Set(exIds).size === exIds.length, exIds.filter((x, i) => exIds.indexOf(x) !== i));

/* ---------- 2. yechimlarni CPython bilan sinash ---------- */
if (process.argv.includes('--no-python')) { finish(); } else {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pyai-'));
  const harness = [
    'import sys, json, io, os, traceback',
    'jobs = json.load(open(sys.argv[1], encoding="utf-8"))',
    'out = []',
    'for j in jobs:',
    '    wd = os.path.join(sys.argv[2], j["id"].replace("/", "_").replace(":", "_"))',
    '    os.makedirs(wd, exist_ok=True); os.chdir(wd)',
    '    ns = {"__name__": "__main__"}; res = {"id": j["id"], "role": j["role"], "error": None, "fail": []}',
    '    old = sys.stdout; sys.stdout = io.StringIO()',
    '    try:',
    '        exec(compile(j["code"], "solution.py", "exec"), ns)',
    '    except BaseException as e:',
    '        res["error"] = type(e).__name__ + ": " + str(e)',
    '    if not res["error"]:',
    '        for name, code in j["tests"]:',
    '            try:',
    '                exec(compile(code, "test", "exec"), ns)',
    '            except BaseException as e:',
    '                res["fail"].append(name + " -> " + type(e).__name__ + ": " + str(e)[:200])',
    '    sys.stdout = old',
    '    out.append(res)',
    'print(json.dumps(out))'
  ].join('\n');
  fs.writeFileSync(path.join(tmp, 'h.py'), harness);
  const jobs = [], skipped = [];
  EXS.forEach(({ where, ex, kind }) => {
    /* sqlite3 — CPython'da o'rnatilgan (Pyodide'da alohida paket); pandas/numpy — faqat brauzerda */
    if (ex.pkgs && ex.pkgs.some(function (k) { return k !== 'sqlite3'; })) { skipped.push(ex.id); return; }
    jobs.push({ id: ex.id + ':sol', role: 'solution', where, code: ex.solution, tests: ex.tests });
    if (ex.starter && ex.starter.trim() && !ex.noStarterFail) jobs.push({ id: ex.id + ':start', role: 'starter', where, code: ex.starter, tests: ex.tests });
  });
  /* Har mashq — alohida jarayon, 15 s chegara (cheksiz sikl butun testni osib qo'ymasin) */
  const res = [];
  jobs.forEach((j, i) => {
    const jf = path.join(tmp, 'job' + i + '.json');
    fs.writeFileSync(jf, JSON.stringify([j]));
    const r = cp.spawnSync('python', [path.join(tmp, 'h.py'), jf, tmp], { encoding: 'utf8', timeout: 15000, maxBuffer: 16 * 1024 * 1024 });
    if (r.status === 0) { try { res.push(JSON.parse(r.stdout.trim().split('\n').pop())[0]); return; } catch (e) {} }
    res.push({ id: j.id, role: j.role, error: r.error && r.error.code === 'ETIMEDOUT' ? 'Timeout (infinite loop?)' : 'harness: ' + String(r.stderr || '').slice(-300), fail: [] });
  });
  {
    let solOk = 0, stFail = 0;
    res.forEach(x => {
      const j = jobs.find(y => y.id === x.id);
      if (x.role === 'solution') { const good = !x.error && !x.fail.length; ok('solution passes: ' + j.where + ' (' + x.id + ')', good, x.error || x.fail); if (good) solOk++; }
      else { const failsSome = !!x.error || x.fail.length > 0; ok('starter/buggy fails ≥1 test: ' + j.where + ' (' + x.id + ')', failsSome); if (failsSome) stFail++; }
    });
    console.log('\nCPython: ' + solOk + ' solutions passed · ' + stFail + ' starters correctly fail · skipped (need pandas → browser check): ' + (skipped.join(', ') || 'none'));
    finish();
  }
}
function finish() {
  console.log((fails ? fails + ' FAILED of ' + n : 'ALL OK — ' + n + ' checks') + ' · lessons ' + ids.length + ' · exercises ' + EXS.length);
  process.exit(fails ? 1 : 0);
}
