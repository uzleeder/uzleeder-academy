/* ==========================================================================
   JobReady — "Job Ready: Python & AI Engineer" dasturi (birlashtiruvchi tizim)
   --------------------------------------------------------------------------
   Yangi kontent YO'Q — mavjud kurslarni bitta yo'lga bog'laydi va ularning
   HAQIQIY progressini o'qiydi:
     • Coding — Python (eski 30 kunlik kurs, #/python)       Store.doneCount()
     • DataCamp — Python Programming Fundamentals (#/datacamp) DataCamp.doneCount()
     • Python & AI Engineering Career Path (#/pyai)           PyAI.*
     • Loyihalar P1–P5, capstone, portfolio                   PyAI.projectStatus/capstoneStatus
     • Karyera (#/career), IELTS Mission (intervyu ingliz tili)
   "Ishga tayyor" mezonlari — har biri dalil bilan (bajarildi / yo'q).
   Hech qanday ish kafolati yoki rasmiy sertifikat va'da qilinmaydi.
   ========================================================================== */
(function () {
  'use strict';
  var T = function (uz, en) { return { uz: uz, en: en }; };
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function A() { return window.PyAI; }
  function modProg(ids) {
    var done = 0, total = 0, mastered = 0;
    ids.forEach(function (id) { if (!A() || !A().module(id)) return; var s = A().moduleStatus(id); done += s.completed; total += s.lessons; mastered += s.mastered; });
    return { done: done, total: total, mastered: mastered };
  }

  /* ---------- komponentlar: har biri real manbadan o'lchanadi ---------- */
  var C = {
    legacy: function () { var t = window.COURSE ? COURSE.length : 30, d = Store.doneCount ? Store.doneCount() : 0; return { kind: 'course', title: T('Coding — Python (30 kun)', 'Coding — Python (30 days)'), route: 'python', done: d, total: t, unit: T('dars', 'lessons'), note: T("Eng yaxshi test ≥ 7/10 — dars yopiladi", 'Best quiz ≥ 7/10 closes a lesson') }; },
    datacamp: function () { var D = window.DataCamp; return { kind: 'course', title: T('DataCamp — Python Programming Fundamentals', 'DataCamp — Python Programming Fundamentals'), route: 'datacamp', done: D ? D.doneCount() : 0, total: D ? D.total() : 0, unit: T('dars', 'lessons'), note: T("DataCamp'da dars + shu yerda test", 'A DataCamp lesson + the quiz here') }; },
    pyai: function (ids, title) { var p = modProg(ids); return { kind: 'pyai', title: title, route: 'pyai/m/' + ids[0], done: p.done, total: p.total, mastered: p.mastered, unit: T('dars', 'lessons'), modules: ids }; },
    projects: function (ids) { var ok = 0; ids.forEach(function (id) { if (A() && A().projectStatus(id).autoChecked) ok++; }); return { kind: 'projects', title: T('Loyihalar ' + ids.map(function (x) { return x.toUpperCase(); }).join(', '), 'Projects ' + ids.map(function (x) { return x.toUpperCase(); }).join(', ')), route: 'pyai/projects', done: ok, total: ids.length, unit: T('yadro avto-tekshirilgan', 'cores auto-checked') }; },
    capstone: function () { var c = A() ? A().capstoneStatus() : { total: 0, max: 24, passed: false }; return { kind: 'capstone', title: T('Capstone (rubrika)', 'Capstone (rubric)'), route: 'pyai/capstone', done: c.total, total: c.max, unit: T("ball (o'z bahosi)", 'points (self-assessed)'), passed: c.passed }; },
    portfolio: function () { var n = window.PYAI ? PYAI.portfolio.length : 11, pf = A() ? A().S().portfolio : {}; return { kind: 'portfolio', title: T("Portfolio ro'yxati", 'Portfolio checklist'), route: 'pyai/portfolio', done: Object.keys(pf).filter(function (k) { return pf[k]; }).length, total: n, unit: T('band', 'items') }; },
    career: function () { return { kind: 'link', title: T('Karyera rejasi (darajalar, kompaniyalar)', 'Career plan (levels, companies)'), route: 'career', done: null, total: null }; },
    english: function () { var p = window.Mission ? Mission.profile() : null; return { kind: 'link', title: T("Intervyu uchun ingliz tili — IELTS Mission", 'English for interviews — IELTS Mission'), route: 'mission', done: null, total: null, note: p ? T('Speaking sessiyalari: ' + p.speaking.sessions, 'Speaking sessions: ' + p.speaking.sessions) : null }; }
  };

  /* ---------- bosqichlar ---------- */
  function stages() {
    return [
      { id: 's1', title: T('1. Python poydevori', '1. Python foundations'), goal: T("Sintaksis, tuzilmalar, funksiyalar, OOP — kod yozib isbotlangan", 'Syntax, data structures, functions, OOP — proven by writing code'),
        weeks: '1–6', parts: [C.legacy(), C.datacamp(), C.pyai(['m0', 'm1'], T("Python & AI: Diagnostika + Python Core (yaxshilangan)", 'Python & AI: Diagnostic + Python Core (improved)'))] },
      { id: 's2', title: T("2. Dasturchi va ma'lumot", '2. Developer & data'), goal: T("Git, testlar, SQL, HTTP/API, pandas — real ilova asoslari", 'Git, tests, SQL, HTTP/APIs, pandas — real application foundations'),
        weeks: '7–12', parts: [C.pyai(['m2', 'm3', 'm4'], T('Python & AI: Modul 2–4', 'Python & AI: Modules 2–4')), C.projects(['p1', 'p2', 'p3'])] },
      { id: 's3', title: T('3. AI muhandislik', '3. AI engineering'), goal: T("Model API, strukturali chiqish, RAG, tool calling — ishonchli va o'lchanadigan", 'Model APIs, structured output, RAG, tool calling — reliable and measured'),
        weeks: '13–18', parts: [C.pyai(['m5', 'm6', 'm7'], T('Python & AI: Modul 5–7', 'Python & AI: Modules 5–7')), C.projects(['p4', 'p5'])] },
      { id: 's4', title: T('4. Production va portfolio', '4. Production & portfolio'), goal: T("Xavfsizlik, monitoring, capstone, toza repolar", 'Security, monitoring, a capstone, clean repositories'),
        weeks: '19–22', parts: [C.pyai(['m8', 'm9'], T('Python & AI: Modul 8–9', 'Python & AI: Modules 8–9')), C.capstone(), C.portfolio()] },
      { id: 's5', title: T('5. Ish qidirish', '5. Job search'), goal: T("Rezyume, bo'shliq rejasi, intervyu mashqi, ingliz tili", 'Resume, gap plan, interview practice, English'),
        weeks: '23+', parts: [C.career(), C.english()] }
    ].map(function (s) {
      var tot = 0, dn = 0; s.parts.forEach(function (p) { if (p.total) { tot += p.total; dn += Math.min(p.done, p.total); } });
      s.done = dn; s.total = tot; s.pct = pct(dn, tot); return s;
    });
  }

  /* ---------- "ishga tayyor" mezonlari: har biri dalil bilan ---------- */
  function criteria() {
    var out = [], a = A(), lg = C.legacy(), dc = C.datacamp();
    var m1 = a ? a.moduleStatus('m1') : { testPassed: false };
    out.push({ id: 'py', title: T("Python asoslari isbotlangan", 'Python fundamentals proven'),
      met: (lg.done >= 24) || !!m1.testPassed,
      evidence: T('Eski kurs: ' + lg.done + '/' + lg.total + ' dars · Modul 1 testi: ' + (m1.testPassed ? "o'tgan" : "o'tmagan"), 'Legacy course: ' + lg.done + '/' + lg.total + ' lessons · Module 1 test: ' + (m1.testPassed ? 'passed' : 'not passed')),
      rule: T("Eski kursning ≥ 24 darsi yoki Modul 1 testi", '≥ 24 legacy lessons or the Module 1 test'), route: 'pyai/m/m1/test' });
    out.push({ id: 'dc', title: T('DataCamp treki tugagan', 'DataCamp track finished'), met: dc.total > 0 && dc.done >= dc.total,
      evidence: T(dc.done + '/' + dc.total + ' dars', dc.done + '/' + dc.total + ' lessons'), rule: T('Hamma darslar', 'All lessons'), route: 'datacamp' });
    var mods = ['m2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
    var mdone = a ? mods.filter(function (m) { return a.moduleStatus(m).complete; }).length : 0;
    out.push({ id: 'mods', title: T("Muhandislik modullari (2–8) tugallangan", 'Engineering modules (2–8) completed'), met: mdone === mods.length,
      evidence: T(mdone + '/' + mods.length + ' modul (darslar + modul testi)', mdone + '/' + mods.length + ' modules (lessons + module test)'), rule: T('Har modul: darslar tugallangan va test ≥ 80% + vazifa', 'Each module: lessons completed and test ≥ 80% + task'), route: 'pyai/progress' });
    var pj = a ? PYAI.projects.filter(function (p) { var s = a.projectStatus(p.id); return s.autoChecked && s.repo; }).length : 0;
    out.push({ id: 'proj', title: T("Kamida 3 loyiha: yadro tekshirilgan + repo havolasi", 'At least 3 projects: core auto-checked + repo link'), met: pj >= 3,
      evidence: T(pj + ' ta loyiha', pj + ' projects'), rule: T('Avto-tekshiruv o\'tgan va GitHub havolasi berilgan', 'Auto-check passed and a GitHub link given'), route: 'pyai/projects' });
    var cap = a ? a.capstoneStatus() : { passed: false, total: 0, max: 24 };
    out.push({ id: 'cap', title: T("Capstone rubrika bo'yicha o'tgan", 'Capstone passes the rubric'), met: !!cap.passed,
      evidence: T(cap.total + '/' + cap.max + " (o'z bahosi)", cap.total + '/' + cap.max + ' (self-assessed)'), rule: T("Har mezonda ≥ 2 va jami ≥ 16", 'Every criterion ≥ 2 and total ≥ 16'), route: 'pyai/capstone' });
    var pf = C.portfolio();
    out.push({ id: 'pf', title: T("Portfolio tayyor", 'Portfolio ready'), met: pf.done >= Math.max(1, pf.total - 2),
      evidence: T(pf.done + '/' + pf.total + ' band', pf.done + '/' + pf.total + ' items'), rule: T('Kamida ' + Math.max(1, pf.total - 2) + ' band', 'At least ' + Math.max(1, pf.total - 2) + ' items'), route: 'pyai/portfolio' });
    var iv = a ? a.lessonStatus('m9-interview') : { mastered: false }, cr = a ? a.lessonStatus('m9-career') : { mastered: false };
    out.push({ id: 'iv', title: T("Intervyu va bo'shliq rejasi mashq qilingan", 'Interview and gap plan practised'), met: !!(iv.mastered && cr.mastered),
      evidence: T('Intervyu darsi: ' + (iv.mastered ? 'mahorat' : 'yo\'q') + ' · Karyera darsi: ' + (cr.mastered ? 'mahorat' : 'yo\'q'), 'Interview lesson: ' + (iv.mastered ? 'mastered' : 'not yet') + ' · Career lesson: ' + (cr.mastered ? 'mastered' : 'not yet')), rule: T('Ikkala darsda mahorat', 'Mastery in both lessons'), route: 'pyai/l/m9-interview' });
    return out;
  }

  /* ---------- keyingi qadamlar (real manbalardan) ---------- */
  function nextSteps() {
    var out = [], a = A();
    if (a) { var due = a.reviewDue().length; if (due) out.push({ route: 'pyai/review', title: T(due + ' ta takror', due + ' reviews due'), why: T("Unutishdan oldin eslash", 'Recall before forgetting') }); }
    if (window.COURSE && Store.doneCount() < COURSE.length && window.App && App.firstOpenDay) { var d = App.firstOpenDay(), l = COURSE.filter(function (x) { return x.day === d; })[0]; out.push({ route: 'lesson/' + d, title: T('Coding — ' + d + '-dars: ' + (l ? l.title.uz || l.title.en : ''), 'Coding — Day ' + d + ': ' + (l ? l.title.en || l.title.uz : '')), why: T("Eski 30 kunlik kurs — Python poydevori", 'The original 30-day course — Python foundations') }); }
    if (window.DataCamp) { var c = DataCamp.current(); if (c && DataCamp.doneCount() < DataCamp.total()) out.push({ route: 'datacamp/' + c.n, title: T('DataCamp — ' + c.n + '-dars: ' + c.title, 'DataCamp — Lesson ' + c.n + ': ' + c.title), why: T("DataCamp treki", 'DataCamp track') }); }
    if (a) { var nx = a.nextLesson(); if (nx) out.push({ route: 'pyai/l/' + nx.id, title: T('Python & AI: ' + nx.lesson.title.uz, 'Python & AI: ' + nx.lesson.title.en), why: nx.why }); }
    var first = criteria().filter(function (c) { return !c.met; })[0];
    if (first) out.push({ route: first.route, title: T("Keyingi mezon: " + first.title.uz, 'Next criterion: ' + first.title.en), why: first.rule });
    return out.slice(0, 5);
  }

  function status() {
    var st = stages(), cr = criteria(), met = cr.filter(function (c) { return c.met; }).length;
    var cur = st.filter(function (s) { return s.total && s.done < s.total; })[0] || st[st.length - 1];
    return { stages: st, criteria: cr, met: met, of: cr.length, ready: met === cr.length, current: cur.id };
  }

  window.JobReady = { stages: stages, criteria: criteria, nextSteps: nextSteps, status: status };
})();
