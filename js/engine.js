/* ==========================================================================
   Learning engine — Review (SRS) · Mastery · Recommend · Continue
   --------------------------------------------------------------------------
   AI yo'q. Hammasi deterministik qoidalar va saqlangan progressdan hisob.

   REVIEW  — takrorlash navbati. Element turlari:
               vocab    → daftar so'zi (so'z → tarjima/sinonim)
               mistake  → xato banki yozuvi (savol → to'g'ri javob)
               py       → Python darsi konspekti (dars yopilganda qo'shiladi)
               eng      → ingliz tili kuni konspekti (kun yopilganda)
               grammar  → grammatika mavzusi (qoida → cheatsheet)
             Oraliqlar: 1 → 3 → 7 → 14 → 30 → 60 kun. "again" — boshiga.
   MASTERY — tugatish ≠ mahorat. Har soha uchun bir nechta o'lchov, 0–100.
   RECOMMEND — bugun nima qilish kerak: muddati o'tgan takror → zaif mavzu
             → joriy dars → mashq → loyiha.
   ========================================================================== */
(function () {
  'use strict';

  var IVL = [1, 3, 7, 14, 30, 60];

  /* ====================== REVIEW (SRS) ================================= */
  function today() { return Store.dateKey(); }

  var Review = {
    add: function (kind, ref, meta) {
      var id = kind + ':' + ref;
      if (Store.reviewAll()[id]) return id;
      Store.reviewSet(id, { kind: kind, ref: String(ref), due: today(), ivl: 0, reps: 0, lapses: 0, last: 0, at: Date.now(), meta: meta || {} });
      return id;
    },
    has: function (kind, ref) { return !!Store.reviewAll()[kind + ':' + ref]; },
    remove: function (kind, ref) { Store.reviewDel(kind + ':' + ref); },
    /* grade: 0 again · 1 good · 2 easy */
    rate: function (id, grade) {
      var it = Store.reviewAll()[id]; if (!it) return;
      if (grade === 0) { it.ivl = 0; it.lapses = (it.lapses || 0) + 1; }
      else it.ivl = Math.min(IVL.length - 1, (it.ivl || 0) + (grade === 2 ? 2 : 1));
      it.reps = (it.reps || 0) + 1; it.last = Date.now(); it.at = Date.now();
      it.due = Store.shiftDays(today(), IVL[it.ivl]);
      Store.reviewSet(id, it);
      if (Store.logEvent) Store.logEvent('review', id, (it.kind || '') + ' · ' + (grade === 0 ? 'again' : grade === 2 ? 'easy' : 'good'));
    },
    list: function () { var m = Store.reviewAll(); return Object.keys(m).map(function (k) { var it = m[k]; it.id = k; return it; }); },
    due: function () { var t = today(); return Review.list().filter(function (it) { return it.due <= t; }).sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : (a.lapses || 0) > (b.lapses || 0) ? -1 : 1; }); },
    dueCount: function () { return Review.due().length; },
    upcoming: function (days) { var t = today(), u = Store.shiftDays(t, days || 7); return Review.list().filter(function (it) { return it.due > t && it.due <= u; }).length; },
    /* So'z holati: reps/ivl bo'yicha — new · learning · familiar · mastered,
       muddati o'tgan bo'lsa (bir marta bo'lsa ham ko'rilgan) — due ("takror kerak") */
    status: function (it) {
      if (!it || !it.reps) return 'new';
      if (it.due && it.due <= today()) return 'due';
      if (it.ivl >= 4) return 'mastered';
      if (it.ivl >= 2) return 'familiar';
      return 'learning';
    },
    /* Elementning ko'rsatiladigan tomonlari: {front, back, route, title} */
    card: function (it) {
      var k = it.kind, r = it.ref, m = it.meta || {};
      if (k === 'vocab') {
        var e = Store.copyGet('vocab', r);
        if (!e) return null;
        return { front: e.word || '?', sub: e.ipa || '', back: [e.tr, e.syn ? '≈ ' + e.syn : '', e.ex].filter(Boolean).join('\n'), route: 'copy/vocab', title: e.word };
      }
      if (k === 'mistake') {
        var mk = null; Store.mistakes().forEach(function (x) { if (x.id === r) mk = x; });
        if (!mk) return null;
        return { front: mk.q, sub: mk.topic || (mk.cat || 'python'), back: '✓ ' + mk.correct + (mk.why ? '\n' + mk.why : ''), route: mk.route || (mk.day ? 'lesson/' + mk.day : 'mistakes'), title: mk.q };
      }
      if (k === 'py') {
        var d = window.dayOf ? dayOf(Number(r)) : null;
        if (!d) return null;
        var kon = L(d.konspekt) || [];
        return { front: L(d.title), sub: 'Python · ' + tr('day') + ' ' + r, back: kon.slice(0, 6).join('\n'), route: 'lesson/' + r, title: L(d.title) };
      }
      if (k === 'eng') {
        var ed = window.Eng ? Eng.dayOf(/^i/.test(r) ? r : Number(r)) : null;
        if (!ed) return null;
        var ek = L(ed.konspekt) || [];
        return { front: L(ed.title), sub: tr('english') + ' · ' + tr('day') + ' ' + r, back: ek.slice(0, 6).join('\n'), route: 'english/' + r, title: L(ed.title) };
      }
      if (k === 'grammar') {
        var g = window.ENG_GRAMMAR && ENG_GRAMMAR[r];
        if (!g) return null;
        return { front: L(g.name), sub: L(g.short), back: L(g.rule), route: 'eng-grammar', title: L(g.name) };
      }
      /* Kitob uniti / mavzu so'zi (flashcard'dan): ref = "u<unit>:<word>" yoki "t<topic>:<word>" */
      if (k === 'bw') {
        var w = window.Flash ? Flash.lookup(r) : null;
        if (!w) return null;
        return { front: w.w, sub: w.pos || '', back: [w.uz, w.syn && w.syn.length ? '≈ ' + w.syn.join(', ') : '', w.col && w.col.length ? w.col.join(' · ') : '', w.ex].filter(Boolean).join('\n'), route: w.route, title: w.w };
      }
      return null;
    }
  };

  /* ====================== MASTERY ====================================== */
  function pct(a, b) { return b ? Math.round(Math.min(1, a / b) * 100) : 0; }
  function avg(arr) { if (!arr.length) return 0; return Math.round(arr.reduce(function (s, x) { return s + x; }, 0) / arr.length); }

  /* Mahorat holati — reyting emas, o'quv bosqichi: foiz → 5 holat.
     NOVICE < 20 · LEARNING < 45 · DEVELOPING < 70 · STRONG < 90 · MASTERED  */
  function masteryLevel(p) { p = Number(p) || 0; return p < 20 ? 'novice' : p < 45 ? 'learning' : p < 70 ? 'developing' : p < 90 ? 'strong' : 'mastered'; }
  var Mastery = {
    level: masteryLevel,
    levelLabel: function (p) { return tr('ml_' + masteryLevel(p)); },
    /* Dalil asosida: bajarish · test · mashq · xato · takror · takroriy muvaffaqiyat */
    evidence: function () {
      var py = Mastery.python(), en = Mastery.english();
      var rv = window.Review ? Review.list() : [];
      var mastered = rv.filter(function (it) { return Review.status(it) === 'mastered'; }).length;
      return {
        completion: Math.round((Store.doneCount() / COURSE.length + Store.engDoneCount() / ENGLISH.meta.days) / 2 * 100),
        quiz: Math.round((py.knowledge + en.grammar) / 2),
        practice: py.practice,
        mistakes: Store.openMistakes().length,
        review: rv.length ? Math.round(mastered / rv.length * 100) : 0,
        repeat: Math.round((py.retention + (en.vocab || 0)) / 2)
      };
    },
    python: function () {
      var best = Store.all().best, days = Object.keys(best);
      var knowledge = pct(Store.doneCount(), COURSE.length);
      var practice = days.length ? Math.round(days.reduce(function (s, d) { return s + best[d]; }, 0) / days.length * 10) : 0;
      var rv = Review.list().filter(function (it) { return it.kind === 'py' || (it.kind === 'mistake' && (it.meta.cat || 'python') === 'python'); });
      var retention = rv.length ? Math.round(rv.reduce(function (s, it) { return s + Math.min(1, (it.ivl || 0) / 4); }, 0) / rv.length * 100) : 0;
      var pj = window.PROJECTS ? PROJECTS.list : [];
      var application = pj.length ? pct(pj.filter(function (p) { return Store.flag('proj:' + p.id + ':done'); }).length, pj.length) : 0;
      var overall = Math.round(knowledge * .35 + practice * .3 + retention * .2 + application * .15);
      return { knowledge: knowledge, practice: practice, retention: retention, application: application, overall: overall };
    },
    english: function () {
      var st = Store.all();
      /* Vocabulary: daftar so'zlari + ularning SRS holati */
      var words = Store.copyList('vocab');
      var wm = words.length ? Math.round(words.reduce(function (s, w) { var it = st.review['vocab:' + w.id]; return s + (it ? Math.min(1, (it.ivl || 0) / 4) : 0); }, 0) / words.length * 100) : 0;
      var vocab = Math.round(pct(words.length, 600) * .5 + wm * .5);
      /* Grammar: mashqi ochilgan/bajarilgan mavzular + quizlar */
      var gk = window.ENG_GRAMMAR ? Object.keys(ENG_GRAMMAR) : [];
      var gdone = gk.filter(function (k) { return Store.flag('gr:' + k); }).length;
      var gq = st.quiz['pr:grammar']; var gqp = gq ? Math.round(gq.best / (gq.bestTotal || 1) * 100) : 0;
      var grammar = Math.round(pct(gdone, gk.length) * .6 + gqp * .4);
      /* Reading: bajarilgan matnlar va ulardagi ball */
      var reads = Object.keys(st.read).filter(function (k) { return /^[rdt]\d/.test(k); }).map(function (k) { return st.read[k]; }).filter(function (r) { return r.score != null && r.total; });
      var reading = Math.round(pct(reads.length, 48) * .5 + (reads.length ? avg(reads.map(function (r) { return r.score / r.total * 100; })) : 0) * .5);
      /* Listening: BBC epizodlari + tinglash rejasi bloklari */
      var lsDays = Object.keys(st.done).filter(function (k) { return /^ls:/.test(k); }).length;
      var listening = Math.round(pct(Store.bbcDoneCount(), 60) * .5 + pct(lsDays, 140) * .5);
      /* Speaking: 30 kunlik trek + o'lchovlar + checklist */
      var spk = Store.speakDoneCount();
      var met = [1, 2, 3, 4].map(function (w) { var m = Store.readGet('spkw' + w); return m && m.wpm ? Math.min(1, m.wpm / 120) : 0; });
      var speaking = Math.round(pct(spk, 30) * .6 + avg(met.map(function (x) { return x * 100; })) * .4);
      /* Writing: haftalar + saqlangan versiyalar */
      var wr = window.WRITING ? WRITING.weeks.length : 19;
      var wdone = Object.keys(st.plan).filter(function (k) { return /^wr\d+$/.test(k) && st.plan[k]; }).length;
      var writing = pct(wdone, wr);
      /* Kunlar: kurs progressi */
      var course = pct(Store.engDoneCount(), ENGLISH.meta.days);
      var overall = Math.round((vocab + grammar + reading + listening + speaking + writing) / 6 * .7 + course * .3);
      return { vocab: vocab, grammar: grammar, reading: reading, listening: listening, speaking: speaking, writing: writing, course: course, overall: overall };
    },
    /* Zaif sohalar — 60% dan past bo'lganlar, eng pastdan boshlab */
    weak: function () {
      var e = Mastery.english(), p = Mastery.python();
      var rows = [
        { key: 'vocab', label: tr('engSkillVocab'), v: e.vocab, route: 'copy/vocab' },
        { key: 'grammar', label: tr('engSkillGrammar'), v: e.grammar, route: 'eng-grammar' },
        { key: 'reading', label: tr('engSkillReading'), v: e.reading, route: 'books/reading' },
        { key: 'listening', label: tr('engSkillListening'), v: e.listening, route: 'bbc/6min' },
        { key: 'speaking', label: tr('engSkillSpeaking'), v: e.speaking, route: 'speaking' },
        { key: 'writing', label: tr('engSkillWriting'), v: e.writing, route: 'writing' },
        { key: 'python', label: 'Python', v: p.practice, route: 'practice' }
      ];
      return rows.sort(function (a, b) { return a.v - b.v; });
    },
    /* Bitta Python darsining mahorati: bilim (yopilgan) · test (eng yaxshi ball) ·
       xotira (konspekt SRS oralig'i + shu dars xatolarining tuzatilgani).
       Tugatish ≠ mahorat: 10/10 lekin takrorsiz — 70% atrofida qoladi. */
    lesson: function (day) {
      var best = Store.bestScore(day), done = Store.isDone(day);
      var knowledge = done ? 100 : best !== undefined ? 50 : 0;
      var quiz = best !== undefined ? best * 10 : 0;
      var rv = Store.reviewAll()['py:' + day];
      var mis = Store.mistakes().filter(function (m) { return m.day === day; });
      var fixedP = mis.length ? mis.filter(function (m) { return m.fixed; }).length / mis.length : (best !== undefined ? 1 : 0);
      var retention = Math.round(((rv ? Math.min(1, (rv.ivl || 0) / 4) : 0) * .6 + fixedP * .4) * 100);
      var overall = best === undefined && !done ? 0 : Math.round(knowledge * .35 + quiz * .35 + retention * .3);
      return { knowledge: knowledge, quiz: quiz, retention: retention, overall: overall, open: mis.filter(function (m) { return !m.fixed; }).length, started: best !== undefined || done };
    },
    /* Mavzular (unit) bo'yicha: darslar mahoratining o'rtachasi */
    topics: function () {
      var map = {}, order = [];
      COURSE.forEach(function (d) {
        var u = d.unit || '—';
        if (!map[u]) { map[u] = { unit: u, days: [], v: 0, started: 0 }; order.push(u); }
        var m = Mastery.lesson(d.day);
        map[u].days.push({ day: d.day, v: m.overall, started: m.started });
        if (m.started) map[u].started++;
      });
      return order.map(function (u) { var t = map[u]; t.v = avg(t.days.map(function (x) { return x.v; })); return t; });
    },
    /* Python mavzulari bo'yicha zaiflik: eng past ball olgan darslar */
    weakLessons: function () {
      var best = Store.all().best;
      return Object.keys(best).map(function (d) { return { day: Number(d), score: best[d] }; })
        .filter(function (x) { return x.score < 8; }).sort(function (a, b) { return a.score - b.score; }).slice(0, 5);
    }
  };

  /* ====================== STUDY TIME =================================== */
  var Time = {
    minutesOn: function (key) {
      /* Jadval bloklari (+ qo'lda soatlar) yoki Today belgilari — ikkalasining kattasi,
         bir ish ikki joyda belgilansa ikki marta sanalmasin */
      var m = window.Goal ? Goal.doneMinutes(key) : { eng: 0, code: 0 };
      return Math.max((m.eng || 0) + (m.code || 0), Store.sessionOf(key));
    },
    week: function (endKey) {
      var end = endKey || today(), out = { min: 0, days: [] };
      for (var i = 6; i >= 0; i--) { var k = Store.shiftDays(end, -i); var m = Time.minutesOn(k); out.min += m; out.days.push({ key: k, min: m }); }
      return out;
    },
    total: function () {
      var t = 0, from = HABIT.meta.from, k = from, tk = today();
      if (tk < from) return 0;
      while (k <= tk) { t += Time.minutesOn(k); k = Store.shiftDays(k, 1); }
      return t;
    }
  };

  /* ====================== RECOMMEND ==================================== */
  var Recommend = {
    /* Tartib: muddati o'tgan takror → zaif soha → joriy dars → mashq → loyiha */
    list: function () {
      var out = [], key = today();
      var due = Review.dueCount();
      if (due) out.push({ kind: 'review', route: 'review', title: tr('recReview', { n: due }), why: tr('recReviewWhy'), min: Math.min(30, 2 * due) });
      /* Takrorlanuvchi xato (2+ marta) — bittasi bo'lsa ham ustuvor; aks holda 3+ ochiq xato */
      var openAll = Store.openMistakes(), rep = openAll.filter(function (m) { return (m.times || 1) >= 2; }).length, openM = openAll.length;
      if (rep) out.push({ kind: 'mistakes', route: 'mistakes', title: tr('recRepeat', { n: rep }), why: tr('recRepeatWhy'), min: 15 });
      else if (openM >= 3) out.push({ kind: 'mistakes', route: 'mistakes', title: tr('recMistakes', { n: openM }), why: tr('recMistakesWhy'), min: 15 });
      var weak = Mastery.weak()[0];
      if (weak && weak.v < 60) out.push({ kind: 'weak', route: weak.route, title: tr('recWeak', { s: weak.label, p: weak.v }), why: tr('recWeakWhy'), min: 20 });
      var wl = Mastery.weakLessons()[0];
      if (wl) out.push({ kind: 'retry', route: 'lesson/' + wl.day, title: tr('recRetry', { d: wl.day, s: wl.score }), why: tr('recRetryWhy'), min: 15 });
      var pyDay = window.HabitPlan && HabitPlan.inRange(key) ? HabitPlan.pyDayOf(key) : 0;
      if (pyDay && !Store.isDone(pyDay)) out.push({ kind: 'lesson', route: 'lesson/' + pyDay, title: tr('recPy', { d: pyDay }), why: tr('recPyWhy'), min: 120 });
      var engDay = window.EngCal ? EngCal.dayOfKey(key) : 0;
      if (engDay && !Store.engDayDone(engDay)) out.push({ kind: 'lesson', route: 'english/' + engDay, title: tr('recEng', { d: engDay }), why: tr('recEngWhy'), min: 240 });
      out.push({ kind: 'practice', route: 'practice', title: tr('recPractice'), why: tr('recPracticeWhy'), min: 20 });
      var pj = (window.PROJECTS ? PROJECTS.list : []).filter(function (p) { return !Store.flag('proj:' + p.id + ':done') && Store.doneCount() >= p.after; })[0];
      if (pj) out.push({ kind: 'project', route: 'projects', title: tr('recProject', { t: L(pj.title) }), why: tr('recProjectWhy'), min: 60 });
      return out;
    }
  };

  /* ====================== CONTINUE ===================================== */
  var Continue = {
    /* Marshrut ochilganda chaqiriladi — oxirgi joyni eslab qoladi */
    touch: function (route, title) {
      var track = /^lesson\//.test(route) ? 'python'
        : /^english\/\d/.test(route) ? 'english'
        : /^books\/[rdt]\d/.test(route) ? 'reading'
        : /^speaking|^habit/.test(route) ? 'speaking'
        : /^books\/l\d|^bbc/.test(route) ? 'listening'
        : /^writing\/\d/.test(route) ? 'writing'
        : /^copy\//.test(route) ? 'copybook'
        : /^books\/v\d/.test(route) ? 'vocab' : null;
      if (!track) return;
      var cur = Store.lastGet(track);
      if (cur && cur.route === route) return;
      Store.lastSet(track, route, title || route);
    },
    list: function () {
      var m = Store.lastAll();
      return Object.keys(m).map(function (k) { var x = m[k]; return { track: k, route: x.route, title: x.title, at: x.at }; }).sort(function (a, b) { return b.at - a.at; });
    }
  };

  window.Review = Review; window.Mastery = Mastery; window.Recommend = Recommend; window.Continue = Continue; window.StudyTime = Time;
})();
