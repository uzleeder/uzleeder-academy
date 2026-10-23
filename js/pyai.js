/* ==========================================================================
   PyAI — Python & AI Engineering Career Path dvigateli (progress va qoidalar)
   --------------------------------------------------------------------------
   Holat: Store.all().pyai (bulut bilan sinxron → PyAI.merge). Kod qoralamalari
   bulutga emas, faqat shu brauzerga (localStorage 'uzla.pyai.code.<id>').
     view      { lessonId: { sec: { concept: ts, … } } }       — ko'rilgan bo'limlar
     attempts  { exId: [ { at, ts, pass, passed, total, hints, sol } ] }  (≤ 12)
     reveal    { exId: { hints: 0..2, sol: bool } }            — yordam ochilgani
     mcq       { key: [ { at, ok } ] }                         (≤ 6) key = lessonId:check:i | lessonId:exit:i | lessonId:predict | diag:i
     modtest   { moduleId: [ { at, ts, score, total, task } ] }
     diag      { at, answers:{i: opt}, code: bool, start }
     projects  { pid: { ms: { msId: { checks:{i:true}, at } }, repo, at } }
     capstone  { rubric:{k: 1..3}, links, notes, at }
     portfolio { i: true }
     review    { key: srs }                                     — SRS2 elementlari
     last      { route, title, at }
   Qoidalar PYAI.config da (mastery 0.8, requiredSections, …). Metrikalar
   ALOHIDA: ko'rilgan ≠ urinilgan ≠ o'tgan ≠ mahorat ≠ loyiha tekshirilgan.
   Eski Python kursi: dars legacy kunlarining hammasi ≥ 7/10 bo'lsa —
   "tugallangan (eski kurs)"; MAHORAT emas (amaliy mashq talab qilinadi).
   ========================================================================== */
(function () {
  'use strict';
  var P = function () { return window.PYAI; };
  function today() { return Store.dateKey(); }
  function blank() { return { v: 1, cv: (window.PYAI && PYAI.version) || 1, view: {}, attempts: {}, reveal: {}, mcq: {}, modtest: {}, diag: null, projects: {}, capstone: { rubric: {}, links: '', notes: '' }, portfolio: {}, review: {}, last: null, time: {}, written: {}, settings: { ivls: null, dailyMin: 60 } }; }
  function S() {
    var st = Store.all();
    if (!st.pyai || !st.pyai.v) st.pyai = blank();
    var d = blank(); Object.keys(d).forEach(function (k) { if (st.pyai[k] === undefined) st.pyai[k] = d[k]; });
    return st.pyai;
  }
  function save() { Store.set('pyai', S()); }
  function ivls() { var s = S().settings || {}; return (s.ivls && s.ivls.length >= 2) ? s.ivls : ((P().config && P().config.ivls) || [1, 3, 7, 14]); }

  /* ---------- kurs tuzilmasi ---------- */
  function modules() { return P().modules.slice().sort(function (a, b) { return a.n - b.n; }); }
  function lesson(id) { return P().lessons[id] || null; }
  function module(id) { return P().modules.filter(function (m) { return m.id === id; })[0] || null; }
  function lessonOrder() { var out = []; modules().forEach(function (m) { m.lessons.forEach(function (l) { out.push(l); }); }); return out; }
  function exercises(lid) { var L = lesson(lid); return L ? ['guided', 'independent', 'debug'].map(function (k) { return L[k] ? Object.assign({ slot: k }, L[k]) : null; }).filter(Boolean) : []; }
  function findEx(exId) {
    var ids = Object.keys(P().lessons);
    for (var i = 0; i < ids.length; i++) { var L = P().lessons[ids[i]]; for (var k of ['guided', 'independent', 'debug']) if (L[k] && L[k].id === exId) return { ex: L[k], lesson: ids[i], slot: k }; }
    for (var m of P().modules) {
      if (m.test && m.test.task && m.test.task.id === exId) return { ex: m.test.task, module: m.id, slot: 'task' };
      for (var w of (m.workshop || [])) if (w.id === exId) return { ex: w, module: m.id, slot: w.type };
    }
    for (var p of P().projects) for (var ms of p.milestones) if (ms.ex && ms.ex.id === exId) return { ex: ms.ex, project: p.id, milestone: ms.id, slot: 'project' };
    if (P().diagnostic && P().diagnostic.code && P().diagnostic.code.id === exId) return { ex: P().diagnostic.code, slot: 'diag' };
    return null;
  }

  /* ---------- ko'rish (content viewed) ---------- */
  function markViewed(lid, sec) {
    var v = S().view[lid] = S().view[lid] || { sec: {} };
    if (v.sec[sec]) return false;
    v.sec[sec] = Date.now(); save(); return true;
  }
  function viewedCount(lid) { var req = P().config.requiredSections, v = (S().view[lid] || { sec: {} }).sec; return req.filter(function (s) { return v[s]; }).length; }

  /* ---------- yordam tartibi: 1-hint → 2-hint → yechim ----------
     Yechim faqat: kamida 1 urinish VA ikkala hint ochilgan bo'lsa. */
  function reveal(exId) { return S().reveal[exId] || { hints: 0, sol: false }; }
  function canHint(exId, n) { var r = reveal(exId); return n === r.hints + 1 && n <= 2; }
  function canSolution(exId) { var r = reveal(exId); return r.hints >= 2 && (S().attempts[exId] || []).length >= 1; }
  function openHint(exId, n) {
    if (!canHint(exId, n)) return false;
    var r = S().reveal[exId] = reveal(exId); r.hints = n; save(); return true;
  }
  function openSolution(exId) {
    if (!canSolution(exId)) return false;
    var r = S().reveal[exId] = reveal(exId); r.sol = true; save(); return true;
  }

  /* ---------- urinishlar ---------- */
  function recordAttempt(exId, result) {
    var tests = (result && result.tests) || [], passed = tests.filter(function (t) { return t.pass; }).length, total = tests.length;
    var ok = !!(result && result.ok && total > 0 && passed === total && !result.timeout);
    var r = reveal(exId);
    var a = { at: today(), ts: Date.now(), pass: ok, passed: passed, total: total, hints: r.hints, sol: !!r.sol };
    var list = S().attempts[exId] = (S().attempts[exId] || []).concat([a]).slice(-12);
    /* takror navbati: yiqilgan mashq ertaga; mustaqil o'tgan — oraliqni uzaytiradi */
    var key = 'ex:' + exId, it = S().review[key];
    if (!ok) S().review[key] = SRS2.apply(it || SRS2.fresh(today(), 0), 'wrong', today(), ivls());
    else if (it) S().review[key] = SRS2.apply(it, a.sol ? 'partial' : r.hints ? 'hint' : 'independent', today(), ivls());
    if (Store.logEvent) Store.logEvent(ok ? 'pyai-pass' : 'pyai-try', exId, exId + ' ' + passed + '/' + total);
    save(); void list;
    return a;
  }
  function attempts(exId) { return S().attempts[exId] || []; }
  function attempted(exId) { return attempts(exId).length > 0; }
  function passed(exId) { return attempts(exId).some(function (a) { return a.pass; }); }
  /* Mustaqil o'tish: yechim ochilMAgan urinishda o'tgan */
  function passedIndependent(exId) { return attempts(exId).some(function (a) { return a.pass && !a.sol; }); }

  /* ---------- MCQ (tekshiruv, exit, predict, diagnostika) ---------- */
  function answerMcq(key, ok, meta) {
    var list = S().mcq[key] = (S().mcq[key] || []).concat([{ at: today(), ok: !!ok }]).slice(-6);
    var rk = 'mcq:' + key, it = S().review[rk];
    if (!ok) S().review[rk] = SRS2.apply(it || SRS2.fresh(today(), 0), 'wrong', today(), ivls());
    else if (it) S().review[rk] = SRS2.apply(it, 'independent', today(), ivls());
    if (meta && S().review[rk]) S().review[rk].meta = meta;
    save(); return list;
  }
  function mcqLast(key) { var l = S().mcq[key]; return l && l.length ? l[l.length - 1] : null; }
  /* Dars bilim bahosi: check + exit savollarining OXIRGI javoblari */
  function knowledge(lid) {
    var L = lesson(lid); if (!L) return { answered: 0, total: 0, score: null };
    var keys = (L.check || []).map(function (q, i) { return lid + ':check:' + i; }).concat((L.exit || []).map(function (q, i) { return lid + ':exit:' + i; }));
    var ans = keys.map(mcqLast).filter(Boolean);
    return { answered: ans.length, total: keys.length, score: ans.length === keys.length && keys.length ? ans.filter(function (a) { return a.ok; }).length / keys.length : null };
  }

  /* ---------- eski kurs migratsiyasi (o'zgarmagan Store.best dan o'qiladi) ---------- */
  function legacyStatus(lid) {
    var L = lesson(lid); if (!L || !L.legacy || !L.legacy.length) return null;
    var need = P().config.legacyPass || 7;
    var days = L.legacy.map(function (d) { var b = Store.bestScore ? Store.bestScore(d) : (Store.all().best || {})[d]; return { day: d, best: b == null ? null : b, ok: b != null && b >= need }; });
    return { days: days, all: days.every(function (x) { return x.ok; }), any: days.some(function (x) { return x.best != null; }) };
  }

  /* ---------- dars holati: completion ≠ mastery ---------- */
  function lessonStatus(lid) {
    var L = lesson(lid), cfg = P().config;
    var exs = {}; ['guided', 'independent', 'debug'].forEach(function (k) { if (L[k]) exs[k] = { attempted: attempted(L[k].id), passed: passed(L[k].id), independent: passedIndependent(L[k].id) }; });
    var viewed = viewedCount(lid), reqS = cfg.requiredSections.length;
    var submitted = cfg.requiredExercises.every(function (k) { return !exs[k] || exs[k].attempted; });
    var completedNew = viewed >= reqS && submitted;
    var leg = legacyStatus(lid);
    var kn = knowledge(lid);
    var practical = cfg.masteryExercises.every(function (k) { return !exs[k] || exs[k].independent; });
    var mastered = completedNew && kn.score != null && kn.score >= cfg.mastery && practical;
    return {
      viewed: viewed, viewedOf: reqS, exercises: exs,
      attempted: Object.keys(exs).filter(function (k) { return exs[k].attempted; }).length,
      passed: Object.keys(exs).filter(function (k) { return exs[k].passed; }).length,
      exTotal: Object.keys(exs).length,
      completed: completedNew || !!(leg && leg.all),
      completedBy: completedNew ? 'course' : (leg && leg.all ? 'legacy' : null),
      knowledge: kn, practical: practical, mastered: mastered, legacy: leg
    };
  }

  /* ---------- modul va kurs ---------- */
  function recordModuleTest(mid, score, total, taskPassed) {
    var l = S().modtest[mid] = (S().modtest[mid] || []).concat([{ at: today(), ts: Date.now(), score: score, total: total, task: !!taskPassed }]).slice(-10);
    save(); return l[l.length - 1];
  }
  function moduleTestPassed(mid) {
    var cfg = P().config;
    return (S().modtest[mid] || []).some(function (t) { return t.total && t.score / t.total >= cfg.moduleTestPass && t.task; });
  }
  function moduleStatus(mid) {
    var m = module(mid), st = m.lessons.map(lessonStatus);
    var hasTest = !!(m.test && m.test.task);
    return {
      lessons: m.lessons.length, completed: st.filter(function (s) { return s.completed; }).length, mastered: st.filter(function (s) { return s.mastered; }).length,
      viewed: st.reduce(function (a, s) { return a + s.viewed; }, 0), viewedOf: st.reduce(function (a, s) { return a + s.viewedOf; }, 0),
      attempted: st.reduce(function (a, s) { return a + s.attempted; }, 0), passed: st.reduce(function (a, s) { return a + s.passed; }, 0), exTotal: st.reduce(function (a, s) { return a + s.exTotal; }, 0),
      testPassed: hasTest ? moduleTestPassed(mid) : null, tests: S().modtest[mid] || [],
      complete: st.every(function (s) { return s.completed; }) && (!hasTest || moduleTestPassed(mid))
    };
  }
  function projectStatus(pid) {
    var p = P().projects.filter(function (x) { return x.id === pid; })[0], ps = S().projects[pid] || { ms: {} };
    var ms = p.milestones.map(function (m) {
      if (m.ex) return { id: m.id, kind: 'auto', autoChecked: passed(m.ex.id), attempted: attempted(m.ex.id) };
      var c = (ps.ms[m.id] || {}).checks || {}, n = m.checks.length, done = Object.keys(c).filter(function (k) { return c[k]; }).length;
      return { id: m.id, kind: 'self', done: done, of: n, selfAssessed: done === n };
    });
    return { milestones: ms, repo: ps.repo || '', submitted: !!ps.repo && ms.some(function (x) { return x.kind === 'self' && x.done > 0; }),
      autoChecked: ms.filter(function (x) { return x.kind === 'auto'; }).every(function (x) { return x.autoChecked; }),
      selfAssessed: ms.filter(function (x) { return x.kind === 'self'; }).every(function (x) { return x.selfAssessed; }) };
  }
  function setProjectCheck(pid, msId, i, val) { var ps = S().projects[pid] = S().projects[pid] || { ms: {} }; var m = ps.ms[msId] = ps.ms[msId] || { checks: {} }; m.checks[i] = !!val; m.at = Date.now(); ps.at = Date.now(); save(); }
  function setProjectRepo(pid, url) {
    url = String(url || '').trim();
    if (url && !/^https:\/\/(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+\/[\w.-]+/.test(url)) throw new Error('url');
    var ps = S().projects[pid] = S().projects[pid] || { ms: {} }; ps.repo = url; ps.at = Date.now(); save();
  }
  function capstoneStatus() {
    var c = S().capstone || { rubric: {} }, rub = P().capstone.rubric, vals = rub.map(function (r) { return Number(c.rubric[r.k]) || 0; });
    var total = vals.reduce(function (a, b) { return a + b; }, 0), all = vals.every(function (v) { return v > 0; });
    return { total: total, max: rub.length * 3, complete: all, passed: all && vals.every(function (v) { return v >= 2; }) && total >= 16, selfAssessed: true };
  }
  function setCapstone(k, level) { var c = S().capstone = S().capstone || { rubric: {} }; c.rubric[k] = Math.max(0, Math.min(3, Number(level) || 0)); c.at = Date.now(); save(); }
  function courseStatus() {
    var ms = modules().map(function (m) { return { id: m.id, s: moduleStatus(m.id) }; });
    var projs = P().projects.map(function (p) { return { id: p.id, s: projectStatus(p.id) }; });
    var cap = capstoneStatus();
    var missing = [];
    ms.forEach(function (x) { if (!x.s.complete) missing.push({ kind: 'module', id: x.id }); });
    projs.forEach(function (x) { if (!x.s.autoChecked) missing.push({ kind: 'project', id: x.id }); });
    if (!cap.passed) missing.push({ kind: 'capstone' });
    return { modules: ms, projects: projs, capstone: cap, missing: missing, complete: missing.length === 0 };
  }

  /* ---------- diagnostika ---------- */
  function scoreDiagnostic(answers, codePassed) {
    var items = P().diagnostic.items, topics = {};
    items.forEach(function (q, i) { var t = q.topic; topics[t] = topics[t] || { c: 0, t: 0, lesson: q.lesson }; topics[t].t++; if (Number(answers[i]) === q.a) topics[t].c++; });
    var fn = topics.functions = topics.functions || { c: 0, t: 0, lesson: 'm1-functions' }; fn.t++; if (codePassed) fn.c++;
    var weak = Object.keys(topics).filter(function (k) { return topics[k].c < topics[k].t; });
    var strong = Object.keys(topics).filter(function (k) { return topics[k].c === topics[k].t; });
    /* boshlash: Modul 1 tartibida birinchi zaif mavzu darsi; hammasi to'g'ri bo'lsa — Modul 2 */
    var order = module('m1').lessons, start = null;
    for (var i = 0; i < order.length; i++) { if (weak.some(function (k) { return topics[k].lesson === order[i]; })) { start = order[i]; break; } }
    var total = Object.keys(topics).reduce(function (a, k) { return a + topics[k].t; }, 0), correct = Object.keys(topics).reduce(function (a, k) { return a + topics[k].c; }, 0);
    return { topics: topics, weak: weak, strong: strong, start: start || (module('m2') ? module('m2').lessons[0] : order[0]), correct: correct, total: total };
  }
  function saveDiagnostic(answers, codePassed) {
    var r = scoreDiagnostic(answers, codePassed);
    S().diag = { at: today(), answers: answers, code: !!codePassed, start: r.start };
    P().diagnostic.items.forEach(function (q, i) { answerMcq('diag:' + i, Number(answers[i]) === q.a, { lesson: q.lesson }); });
    save(); return r;
  }

  /* ---------- takror navbati ---------- */
  function reviewDue(d) { d = d || today(); var r = S().review; return Object.keys(r).filter(function (k) { return r[k] && r[k].due <= d; }).map(function (k) { return Object.assign({ key: k }, r[k]); }).sort(function (a, b) { return (b.lapses || 0) - (a.lapses || 0) || (a.due < b.due ? -1 : 1); }); }
  function reviewRate(key, outcome) { var it = S().review[key]; if (!it) return null; S().review[key] = SRS2.apply(it, outcome, today(), ivls()); save(); return S().review[key]; }
  /* Mahoratga erishilgan dars — kechiktirilgan eslash uchun navbatga (1 marta) */
  function scheduleLessonRecall(lid) { var k = 'lesson:' + lid; if (!S().review[k]) { S().review[k] = SRS2.fresh(today(), ivls()[0]); save(); } }

  /* ---------- tavsiyalar (shaffof qoidalar) ---------- */
  var RULES = [
    { lesson: 'm1-collections', why: { uz: "Lug'at (dict) mashqlari va savollarida takroriy xato", en: 'Repeated mistakes in dictionary exercises and questions' } },
    { lesson: 'm1-functions', why: { uz: "Funksiya va return xatti-harakatida xatolar", en: 'Mistakes in function return behaviour' } },
    { lesson: 'm1-errors', why: { uz: "Istisnolarni boshqarish mashqlarida xatolar", en: 'Mistakes in exception-handling exercises' } },
    { lesson: 'm2-testing', why: { uz: "Testlash mashqlari yoki loyihada testlar belgilanmagan", en: 'Testing exercises failing, or project tests not done' } },
    { lesson: 'm6-retrieve', why: { uz: "Retrieval/RAG mashqlarida xatolar — RAG debugging", en: 'Retrieval/RAG exercises failing — RAG debugging' } }
  ];
  function lessonFailures(lid, days) {
    var since = SRS2.addDays(today(), -(days || 21)), n = 0;
    exercises(lid).forEach(function (e) { attempts(e.id).forEach(function (a) { if (!a.pass && a.at >= since) n++; }); });
    Object.keys(S().mcq).forEach(function (k) { if (k.indexOf(lid + ':') === 0) S().mcq[k].forEach(function (a) { if (!a.ok && a.at >= since) n++; }); });
    var d = S().diag; if (d) P().diagnostic.items.forEach(function (q, i) { if (q.lesson === lid && Number(d.answers[i]) !== q.a && d.at >= since) n++; });
    return n;
  }
  function recommend() {
    var out = [];
    var due = reviewDue().length;
    if (due) out.push({ route: 'pyai/review', title: { uz: due + ' ta takror kutmoqda', en: due + ' reviews due' }, why: { uz: "Takror muddati keldi — kechiktirilsa unutiladi", en: 'Review date reached — delaying leads to forgetting' } });
    RULES.forEach(function (r) {
      var f = lessonFailures(r.lesson); if (r.lesson === 'm2-testing') { var p1 = projectStatus('p1'); if (p1.repo && !p1.selfAssessed) f += 2; }
      if (f >= 2) out.push({ route: 'pyai/l/' + r.lesson, title: { uz: 'Qayta ko\'rish: ' + lesson(r.lesson).title.uz, en: 'Revisit: ' + lesson(r.lesson).title.en }, why: { uz: r.why.uz + ' (' + f + ' ta, 21 kun)', en: r.why.en + ' (' + f + ' in 21 days)' } });
    });
    Object.keys(P().lessons).forEach(function (lid) {
      if (RULES.some(function (r) { return r.lesson === lid; })) return;
      var f = lessonFailures(lid); if (f >= 3) out.push({ route: 'pyai/l/' + lid, title: { uz: 'Qayta ko\'rish: ' + lesson(lid).title.uz, en: 'Revisit: ' + lesson(lid).title.en }, why: { uz: f + ' ta xato (21 kun)', en: f + ' mistakes (21 days)' } });
    });
    var nx = nextLesson(); if (nx) out.push({ route: 'pyai/l/' + nx.id, title: { uz: 'Keyingi dars: ' + nx.lesson.title.uz, en: 'Next lesson: ' + nx.lesson.title.en }, why: nx.why });
    return out.slice(0, 6);
  }
  function nextLesson() {
    var d = S().diag, order = lessonOrder();
    var startIdx = d && d.start ? Math.max(0, order.indexOf(d.start)) : 0;
    for (var i = startIdx; i < order.length; i++) { var s = lessonStatus(order[i]); if (!s.completed) return { id: order[i], lesson: lesson(order[i]), why: d && i === startIdx ? { uz: 'Diagnostika natijasi bo\'yicha boshlash nuqtasi', en: 'Your start point from the diagnostic' } : { uz: 'Tartibdagi birinchi tugallanmagan dars', en: 'First unfinished lesson in order' } }; }
    for (i = 0; i < startIdx; i++) { s = lessonStatus(order[i]); if (!s.completed) return { id: order[i], lesson: lesson(order[i]), why: { uz: 'Diagnostikadan oldingi, hali tugallanmagan dars', en: 'An earlier lesson not finished yet' } }; }
    return null;
  }

  /* ---------- qoralama (faqat shu brauzer) ---------- */
  function draft(exId, code) {
    var k = 'uzla.pyai.code.' + exId;
    try { if (code === undefined) return localStorage.getItem(k); if (code === null) localStorage.removeItem(k); else localStorage.setItem(k, String(code).slice(0, 20000)); } catch (e) {}
    return null;
  }
  function touch(route, title) { S().last = { route: route, title: String(title || '').slice(0, 80), at: Date.now() }; save(); }

  /* ---------- o'quv vaqti (real: sahifa ochiq va ko'rinib turgan daqiqalar) ---------- */
  function addMinute(d) { d = d || today(); var t = S().time = S().time || {}; t[d] = Math.min(600, (t[d] || 0) + 1); save(); return t[d]; }
  function weekTime(end) { end = end || today(); var out = []; for (var i = 6; i >= 0; i--) { var k = SRS2.addDays(end, -i); out.push({ date: k, min: (S().time || {})[k] || 0 }); } return out; }
  function setSettings(o) {
    var s = S().settings = S().settings || { ivls: null, dailyMin: 60 };
    if (o.ivls !== undefined) {
      if (o.ivls === null) s.ivls = null;
      else { var v = o.ivls.map(function (x) { return Math.round(Number(x)); }); if (v.length < 2 || v.some(function (x, i) { return !(x >= 1 && x <= 90) || (i && x <= v[i - 1]); })) throw new Error('ivls'); s.ivls = v; }
    }
    if (o.dailyMin !== undefined) { var m = Math.round(Number(o.dailyMin)); if (!(m >= 10 && m <= 480)) throw new Error('dailyMin'); s.dailyMin = m; }
    save(); return s;
  }

  /* ---------- o'xshash savol: xato javobdan keyin boshqa savol (aynan o'sha emas) ---------- */
  function lessonQuestions(lid) {
    var L = lesson(lid); if (!L) return [];
    var out = [{ key: lid + ':predict', q: { q: { uz: 'Natija nima?', en: 'What happens?' }, opts: L.predict.opts, a: L.predict.a, why: L.predict.why }, code: L.predict.code }];
    (L.check || []).forEach(function (q, i) { out.push({ key: lid + ':check:' + i, q: q }); });
    (L.exit || []).forEach(function (q, i) { out.push({ key: lid + ':exit:' + i, q: q }); });
    return out;
  }
  function similarQuestion(key) {
    var lid = String(key).split(':')[0], pool = lessonQuestions(lid).filter(function (x) { return x.key !== key; });
    var notOk = pool.filter(function (x) { var l = mcqLast(x.key); return !l || !l.ok; });
    if (notOk.length) return notOk[0];
    /* Shu darsdagilar hammasi to'g'ri — prerekvizit darsdan (avval xato/javobsizlari), bo'lmasa shu darsdan */
    var L = lesson(lid), pre = [];
    (L && L.prereq || []).forEach(function (p) { pre = pre.concat(lessonQuestions(p)); });
    var preNotOk = pre.filter(function (x) { var l = mcqLast(x.key); return !l || !l.ok; });
    return preNotOk[0] || pre[0] || pool[0] || null;
  }

  /* ---------- aralash (interleaved) mashq: oldingi darslardan, kunga barqaror tartib ---------- */
  function mixedSet(n, d) {
    d = d || today(); n = n || 8;
    var touched = lessonOrder().filter(function (lid) { var st = lessonStatus(lid); return st.viewed > 0 || st.attempted > 0 || st.completed; });
    var pool = []; touched.forEach(function (lid) { pool = pool.concat(lessonQuestions(lid)); });
    var seed = 0; for (var i = 0; i < d.length; i++) seed = (seed * 31 + d.charCodeAt(i)) >>> 0;
    var rnd = function () { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
    for (var j = pool.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)); var t0 = pool[j]; pool[j] = pool[k]; pool[k] = t0; }
    /* bir darsdan ketma-ket ikkitasi tushmasin (interleaving) */
    var out = [], last = null, rest = pool.slice();
    while (out.length < n && rest.length) { var idx = rest.findIndex(function (x) { return x.key.split(':')[0] !== last; }); if (idx < 0) idx = 0; var it = rest.splice(idx, 1)[0]; out.push(it); last = it.key.split(':')[0]; }
    return { items: out, lessons: touched.length };
  }

  /* ---------- explain / design: yozma javob (o'z-o'zini tekshirish, avtomatik baho EMAS) ---------- */
  function words(s) { return (String(s || '').match(/[\wʻ'’-]+/g) || []).length; }
  function saveWritten(id, text, checks) {
    var f = findEx(id); if (!f || (f.ex.type !== 'explain' && f.ex.type !== 'design')) throw new Error('not a written task');
    var need = f.ex.minWords || 40;
    if (words(text) < need) throw new Error('short');
    var rec = S().written[id] = S().written[id] || { versions: [] };
    rec.versions = rec.versions.concat([{ at: today(), ts: Date.now(), text: String(text).slice(0, 6000) }]).slice(-5);
    if (checks) rec.checks = checks;
    rec.at = Date.now(); save(); return rec;
  }
  function setWrittenChecks(id, checks) { var rec = S().written[id]; if (!rec) return null; rec.checks = checks; rec.at = Date.now(); save(); return rec; }
  function writtenStatus(id) { var rec = (S().written || {})[id], f = findEx(id); if (!rec) return { submitted: false }; var n = f ? f.ex.rubric.length : 0, c = rec.checks || {}; return { submitted: true, versions: rec.versions.length, self: Object.keys(c).filter(function (k) { return c[k]; }).length, of: n }; }

  /* ---------- kontent versiyasi migratsiyasi (ID o'zgarsa progress yo'qolmaydi) ---------- */
  function migrate() {
    var s = S(), ver = P().version || 1, map = P().idMap || {};
    if (s.cv === ver) return { migrated: 0 };
    var n = 0;
    Object.keys(map).forEach(function (oldId) {
      var nu = map[oldId];
      ['attempts', 'reveal', 'written'].forEach(function (f) { if (s[f] && s[f][oldId] && !s[f][nu]) { s[f][nu] = s[f][oldId]; delete s[f][oldId]; n++; } });
      if (s.review['ex:' + oldId] && !s.review['ex:' + nu]) { s.review['ex:' + nu] = s.review['ex:' + oldId]; delete s.review['ex:' + oldId]; n++; }
      Object.keys(s.mcq).forEach(function (k) { if (k.split(':')[0] === oldId) { var nk = nu + k.slice(oldId.length); if (!s.mcq[nk]) { s.mcq[nk] = s.mcq[k]; delete s.mcq[k]; n++; } } });
      Object.keys(s.view).forEach(function (k) { if (k === oldId && !s.view[nu]) { s.view[nu] = s.view[k]; delete s.view[k]; n++; } });
    });
    s.cv = ver; save(); return { migrated: n };
  }

  /* ---------- tozalash: faqat PyAI ---------- */
  function reset() {
    try { localStorage.setItem('uzla.pyai.backup.' + Date.now(), JSON.stringify(S())); } catch (e) {}
    Store.all().pyai = blank(); save();
  }

  /* ---------- sinxron birlashtirish ---------- */
  function unionTs(a, b, max) { var m = {}; (a || []).concat(b || []).forEach(function (x) { m[(x.ts || x.at) + ':' + (x.pass != null ? x.pass : x.ok) + ':' + (x.passed != null ? x.passed : '')] = x; }); var arr = Object.keys(m).map(function (k) { return m[k]; }); arr.sort(function (x, y) { return (x.ts || 0) - (y.ts || 0) || (x.at < y.at ? -1 : 1); }); return max ? arr.slice(-max) : arr; }
  function merge(L, R) {
    if (!L || !L.v) return R || L; if (!R || !R.v) return L;
    var out = JSON.parse(JSON.stringify(L));
    out.view = {}; Object.keys(L.view || {}).concat(Object.keys(R.view || {})).forEach(function (k) { out.view[k] = { sec: Object.assign({}, ((R.view || {})[k] || {}).sec, ((L.view || {})[k] || {}).sec) }; });
    out.attempts = {}; Object.keys(L.attempts || {}).concat(Object.keys(R.attempts || {})).forEach(function (k) { out.attempts[k] = unionTs((L.attempts || {})[k], (R.attempts || {})[k], 12); });
    out.mcq = {}; Object.keys(L.mcq || {}).concat(Object.keys(R.mcq || {})).forEach(function (k) { var a = (L.mcq || {})[k] || [], b = (R.mcq || {})[k] || []; out.mcq[k] = (a.length >= b.length ? a : b).slice(-6); });
    out.modtest = {}; Object.keys(L.modtest || {}).concat(Object.keys(R.modtest || {})).forEach(function (k) { out.modtest[k] = unionTs((L.modtest || {})[k], (R.modtest || {})[k], 10); });
    out.reveal = {}; Object.keys(L.reveal || {}).concat(Object.keys(R.reveal || {})).forEach(function (k) { var a = (L.reveal || {})[k] || { hints: 0 }, b = (R.reveal || {})[k] || { hints: 0 }; out.reveal[k] = { hints: Math.max(a.hints || 0, b.hints || 0), sol: !!(a.sol || b.sol) }; });
    out.review = Object.assign({}, R.review || {}); Object.keys(L.review || {}).forEach(function (k) { var a = L.review[k], b = out.review[k]; if (!b || (a.n || 0) >= (b.n || 0)) out.review[k] = a; });
    out.projects = Object.assign({}, R.projects || {}); Object.keys(L.projects || {}).forEach(function (k) { if (!out.projects[k] || (L.projects[k].at || 0) >= (out.projects[k].at || 0)) out.projects[k] = L.projects[k]; });
    out.capstone = (L.capstone && (L.capstone.at || 0) >= ((R.capstone || {}).at || 0)) ? L.capstone : R.capstone;
    out.portfolio = Object.assign({}, R.portfolio || {}, L.portfolio || {});
    out.diag = (L.diag && (!R.diag || L.diag.at >= R.diag.at)) ? L.diag : R.diag;
    out.time = {}; Object.keys(L.time || {}).concat(Object.keys(R.time || {})).forEach(function (k) { out.time[k] = Math.max((L.time || {})[k] || 0, (R.time || {})[k] || 0); });
    out.written = Object.assign({}, R.written || {}); Object.keys(L.written || {}).forEach(function (k) { if (!out.written[k] || (L.written[k].at || 0) >= (out.written[k].at || 0)) out.written[k] = L.written[k]; });
    out.settings = L.settings || R.settings;
    return out;
  }

  window.PyAI = {
    S: S, save: save, modules: modules, module: module, lesson: lesson, lessonOrder: lessonOrder, exercises: exercises, findEx: findEx,
    markViewed: markViewed, viewedCount: viewedCount, reveal: reveal, canHint: canHint, canSolution: canSolution, openHint: openHint, openSolution: openSolution,
    recordAttempt: recordAttempt, attempts: attempts, attempted: attempted, passed: passed, passedIndependent: passedIndependent,
    answerMcq: answerMcq, mcqLast: mcqLast, knowledge: knowledge, legacyStatus: legacyStatus, lessonStatus: lessonStatus,
    recordModuleTest: recordModuleTest, moduleTestPassed: moduleTestPassed, moduleStatus: moduleStatus,
    projectStatus: projectStatus, setProjectCheck: setProjectCheck, setProjectRepo: setProjectRepo, capstoneStatus: capstoneStatus, setCapstone: setCapstone, courseStatus: courseStatus,
    scoreDiagnostic: scoreDiagnostic, saveDiagnostic: saveDiagnostic, reviewDue: reviewDue, reviewRate: reviewRate, scheduleLessonRecall: scheduleLessonRecall,
    recommend: recommend, nextLesson: nextLesson, lessonFailures: lessonFailures, draft: draft, touch: touch, reset: reset, merge: merge,
    addMinute: addMinute, weekTime: weekTime, setSettings: setSettings, ivls: ivls, similarQuestion: similarQuestion, lessonQuestions: lessonQuestions, mixedSet: mixedSet,
    saveWritten: saveWritten, setWrittenChecks: setWrittenChecks, writtenStatus: writtenStatus, words: words, migrate: migrate
  };
})();
