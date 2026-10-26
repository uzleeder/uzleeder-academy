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
   Kalendar: 2026-10-25 → 2027-02-10 (hamma kurslar bilan bir xil).
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
        dates: T('25-okt – 23-noy', '25 Oct – 23 Nov'), parts: [C.legacy(), C.datacamp(), C.pyai(['m0', 'm1'], T("Python & AI: Diagnostika + Python Core (yaxshilangan)", 'Python & AI: Diagnostic + Python Core (improved)'))] },
      { id: 's2', title: T("2. Dasturchi va ma'lumot", '2. Developer & data'), goal: T("Git, testlar, SQL, HTTP/API, pandas — real ilova asoslari", 'Git, tests, SQL, HTTP/APIs, pandas — real application foundations'),
        dates: T('24-noy – 21-dek', '24 Nov – 21 Dec'), parts: [C.pyai(['m2', 'm3', 'm4'], T('Python & AI: Modul 2–4', 'Python & AI: Modules 2–4')), C.projects(['p1', 'p2', 'p3'])] },
      { id: 's3', title: T('3. AI muhandislik', '3. AI engineering'), goal: T("Model API, strukturali chiqish, RAG, tool calling — ishonchli va o'lchanadigan", 'Model APIs, structured output, RAG, tool calling — reliable and measured'),
        dates: T('22-dek – 18-yan', '22 Dec – 18 Jan'), parts: [C.pyai(['m5', 'm6', 'm7'], T('Python & AI: Modul 5–7', 'Python & AI: Modules 5–7')), C.projects(['p4', 'p5'])] },
      { id: 's4', title: T('4. Production va portfolio', '4. Production & portfolio'), goal: T("Xavfsizlik, monitoring, capstone, toza repolar", 'Security, monitoring, a capstone, clean repositories'),
        dates: T('19-yan – 3-fev', '19 Jan – 3 Feb'), parts: [C.pyai(['m8', 'm9'], T('Python & AI: Modul 8–9', 'Python & AI: Modules 8–9')), C.capstone(), C.portfolio()] },
      { id: 's5', title: T('5. Ish qidirish', '5. Job search'), goal: T("Rezyume, bo'shliq rejasi, intervyu mashqi, ingliz tili", 'Resume, gap plan, interview practice, English'),
        dates: T('4-fev – 10-fev', '4 Feb – 10 Feb'), parts: [C.career(), C.english()] }
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

  /* ====================== DAILY DISCIPLINE — 3 soatlik kunlik reja ======
     5 blok × qat'iy daqiqa (30 + 30 + 75 + 30 + 15 = 180). Har blok HAQIQIY
     darsga bog'lanadi: 25-okt → 23-noy Coding — Python (har kuni 1 dars) +
     DataCamp; undan keyin Python & AI yo'li. Blok belgisi:
     done["jr:<sana>:<blok>"]; Review & Plan yozuvi: read["jr-note-<sana>"].  */
  var BLOCKS = [
    { k: 'recall', min: 30, icon: 'brain', title: T('Knowledge & Recall', 'Knowledge & Recall'), d: T("Kechagi mavzuni eslash — notes'ga qaramasdan tushuntirish", "Recall yesterday's topic — explain it without looking at notes") },
    { k: 'learn', min: 30, icon: 'book', title: T('Learn', 'Learn'), d: T('Yangi Python yoki Job Ready mavzusi', 'A new Python or Job Ready topic') },
    { k: 'code', min: 75, icon: 'code', title: T('Deep Coding', 'Deep Coding'), d: T("Kodni o'zing yozish, debugging va mustaqil masalalar", 'Write the code yourself, debugging and independent problems') },
    { k: 'build', min: 30, icon: 'layers', title: T('Build & Apply', 'Build & Apply'), d: T("Loyiha, mini-feature yoki real vazifaga qo'llash", 'A project, a mini-feature or applying it to a real task') },
    { k: 'review', min: 15, icon: 'checklist', title: T('Review & Plan', 'Review & Plan'), d: T('Xatolar jurnali, bugungi natija va ertangi vazifa', "Error log, today's result and tomorrow's task") }
  ];
  function shift(k, n) { var d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function pyDay(d) { return window.HabitPlan && HabitPlan.pyDayOf ? HabitPlan.pyDayOf(d) : 0; }
  function courseDay(n) { return window.COURSE ? COURSE.filter(function (c) { return c.day === n; })[0] : null; }
  function cl(o) { return o && typeof o === 'object' ? o : T(String(o || ''), String(o || '')); }
  function lt(o) { return window.L ? L(o) : (o.en || o.uz); }
  function it(title, route, note) { return { title: title, route: route, note: note || null }; }

  function dayPlan(d) {
    var a = A(), n = pyDay(d), yn = pyDay(shift(d, -1)), out = {};
    var nx = a ? a.nextLesson() : null, nxL = nx ? nx.lesson : null;
    /* 1. Recall */
    var rc = [];
    if (yn) { var yc = courseDay(yn); if (yc) rc.push(it(T('Kechagi dars: ' + yn + '-kun — ' + lt(yc.title), "Yesterday's lesson: day " + yn + ' — ' + lt(yc.title)), 'lesson/' + yn, T("Daftarni yopib 5 daqiqa tushuntiring, keyin konspekt bilan solishtiring", 'Explain it for 5 minutes with notes closed, then compare with the summary'))); }
    else if (a) { var last = a.lessonOrder().filter(function (id) { return a.lessonStatus(id).completed; }).pop(); if (last) rc.push(it(T('Oxirgi tugallangan dars: ' + a.lesson(last).title.uz, 'Last completed lesson: ' + a.lesson(last).title.en), 'pyai/l/' + last, T('Exit savollarini notes\'siz qayta yeching', 'Redo the exit questions without notes'))); }
    var due = a ? a.reviewDue(d).length : 0;
    if (due) rc.push(it(T(due + ' ta takror (oraliqli takrorlash)', due + ' reviews due (spaced repetition)'), 'pyai/review'));
    if (!rc.length) rc.push(it(T('Aralash mashq: avvalgi mavzulardan 5 savol', 'Mixed practice: 5 questions from earlier topics'), 'pyai/mixed'));
    out.recall = rc;
    /* 2. Learn */
    var ln = [], c = n ? courseDay(n) : null;
    if (c) ln.push(it(T('Coding — Python ' + n + '-kun: ' + lt(c.title), 'Coding — Python day ' + n + ': ' + lt(c.title)), 'lesson/' + n));
    var dc = window.DataCamp && DataCamp.forDate ? DataCamp.forDate(d) : null;
    if (dc) ln.push(it(T('DataCamp: ' + dc.label, 'DataCamp: ' + dc.label), 'datacamp/' + dc.n));
    if (!ln.length && nxL) ln.push(it(T('Python & AI: ' + nxL.title.uz, 'Python & AI: ' + nxL.title.en), 'pyai/l/' + nx.id, nx.why));
    out.learn = ln;
    /* 3. Deep Coding */
    var cd = [];
    if (c) cd.push(it(T(n + '-kun amaliy mashqlari (' + (c.practice || []).length + ' ta) — o\'zingiz yozing', 'Day ' + n + ' practice tasks (' + (c.practice || []).length + ') — write them yourself'), 'lesson/' + n, T('Playground\'da yozing, xatoni o\'qib tuzating', 'Write in the playground; read the error and fix it')));
    if (nxL && nxL.independent) cd.push(it(T('Mustaqil masala: ' + nxL.title.uz, 'Independent problem: ' + nxL.title.en), 'pyai/l/' + nx.id, T('Hint\'siz urinib ko\'ring — mahorat shu bilan o\'lchanadi', 'Try without hints — that is how mastery is measured')));
    if (nxL && nxL.debug) cd.push(it(T('Debugging: buzilgan kodni tuzatish', 'Debugging: fix the broken code'), 'pyai/l/' + nx.id));
    if (a && nxL) { var wm = a.module(nxL.module); if (wm && wm.workshop && wm.workshop.length && a.moduleStatus(wm.id).completed >= Math.ceil(wm.lessons.length / 2)) { var ws = wm.workshop.filter(function (w) { return !a.passed(w.id); })[0]; if (ws) cd.push(it(T('Workshop: ' + cl(ws.title).uz, 'Workshop: ' + cl(ws.title).en), 'pyai/w/' + ws.id)); } }
    out.code = cd;
    /* 4. Build & Apply */
    var bd = [], done = window.Store ? Store.doneCount() : 0;
    var lp = window.PROJECTS ? PROJECTS.list.filter(function (p) { return done >= p.after && !Store.flag('proj:' + p.id + ':done'); })[0] : null;
    if (lp) bd.push(it(T('Mini-loyiha: ' + lp.title.uz, 'Mini-project: ' + lp.title.en), 'projects', T('~' + lp.hours + ' soat — bugun bitta qismini yozing', '~' + lp.hours + ' h — build one part today')));
    if (a) { var pj = PYAI.projects.filter(function (p) { var m = a.module(p.after); return m && a.moduleStatus(p.after).completed > 0 && !a.projectStatus(p.id).autoChecked; })[0]; if (pj) bd.push(it(T('Loyiha ' + pj.id.toUpperCase() + ': ' + pj.title.uz, 'Project ' + pj.id.toUpperCase() + ': ' + pj.title.en), 'pyai/p/' + pj.id)); }
    if (!bd.length) bd.push(it(T("Bugungi mavzuni kichik skriptga qo'llang (masalan, o'z kunlik xarajatlaringiz, ro'yxatlar) va GitHub'ga commit qiling", "Apply today's topic in a small script (e.g. your daily expenses, lists) and commit it to GitHub"), c ? 'lesson/' + n : (nx ? 'pyai/l/' + nx.id : 'pyai')));
    out.build = bd;
    /* 5. Review & Plan */
    var mis = window.Store ? (Store.all().mistakes || []).filter(function (m) { return !m.fixed; }).length : 0;
    var tn = pyDay(shift(d, 1)), tc = tn ? courseDay(tn) : null;
    out.review = [it(T('Xatolar jurnali' + (mis ? ': ' + mis + ' ta ochiq' : ''), 'Error log' + (mis ? ': ' + mis + ' open' : '')), 'review/mistakes'),
      it(tc ? T('Ertaga: ' + tn + '-kun — ' + lt(tc.title), 'Tomorrow: day ' + tn + ' — ' + lt(tc.title)) : T("Ertangi vazifani pastda yozing", "Write tomorrow's task below"), tc ? 'lesson/' + tn : 'jobready')];
    return BLOCKS.map(function (b) { return Object.assign({}, b, { items: out[b.k] || [], done: !!(window.Store && Store.flag('jr:' + d + ':' + b.k)) }); });
  }
  function dayDone(d) { return BLOCKS.filter(function (b) { return window.Store && Store.flag('jr:' + d + ':' + b.k); }); }

  window.JobReady = { stages: stages, criteria: criteria, nextSteps: nextSteps, status: status, BLOCKS: BLOCKS, dayPlan: dayPlan, dayDone: dayDone };
})();
