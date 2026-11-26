/* ==========================================================================
   OS.data — markaziy o'qish modeli (read model)
   Central read model: one place that answers "what is actually true"
   --------------------------------------------------------------------------
   Brief 2-bo'lim: har bir modul BITTA markaziy ma'lumot tizimi bilan
   gaplashadi. Sahifalar hisob-kitobni o'zi qilmaydi — SHU YERDAN so'raydi.

   QAT'IY QOIDA: faqat HAQIQATAN saqlangan yozuv qaytariladi.
   Ma'lumot bo'lmasa — null yoki 0, "chiroyli" to'ldirma emas.
   Soxta seriya, soxta ball, soxta soat yo'q (brief 2 va 6-bo'lim).
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};

  function S() { return window.Store; }
  function cal() { return OS.cal; }
  function cfg() { return OS.CFG; }

  function todayKey() { return OS.cal.today(); }

  /* ====================== PROFIL VA KUN =============================== */

  function profile() {
    var st = S();
    return {
      name: (st && st.get('name')) || '',
      title: (st && st.profile && st.profile().title) || '',
      photo: (st && st.profile && st.profile().photo) || ''
    };
  }

  /* Hozirgi bosqich va missiya kuni — OS.CFG dan (yagona manba) */
  function missionNow(key) {
    key = key || todayKey();
    var c = cfg(), k = cal();
    var ph = k.phaseDay(key);
    return {
      date: key,
      inMission: k.inMission(key),
      dayNumber: k.dayNumber(key),
      totalDays: k.totalDays(),
      phase: ph ? ph.phase : null,
      phaseDay: ph ? ph.n : 0,
      phaseOf: ph ? ph.of : 0,
      daysToExam: k.daysToExam(key),
      daysToEnd: k.daysToEnd(key),
      exam: c.mission.exam,
      target: c.target.overall
    };
  }

  /* ====================== KUNLIK JADVAL =============================== */

  /* Bugungi bloklar — HabitPlan dan (mavjud jadval dvigateli).
     Har blokka saqlangan natija (blockLog) qo'shiladi: done/partial/skipped. */
  function dayBlocks(key) {
    key = key || todayKey();
    if (!window.HabitPlan || !HabitPlan.forDate) return [];
    var day;
    try { day = HabitPlan.forDate(key); } catch (e) { return []; }
    if (!day || !day.blocks) return [];
    var st = S();
    return day.blocks.map(function (b) {
      var res = st && st.blockResult ? st.blockResult(key, b.id) : null;
      var marked = st && st.habitBlock ? st.habitBlock(key, b.id) : false;
      return {
        id: b.id, kind: b.kind, core: !!b.core,
        from: b.from, to: b.to, fromStr: b.fromStr, toStr: b.toStr, min: b.min,
        t: b.t, note: b.note, link: b.link,
        status: res ? res.st : (marked ? 'done' : 'pending'),
        resultNote: res ? res.note : ''
      };
    });
  }

  /* Hozirgi vaqtdagi blok va keyingisi. Vaqt — MAHALLIY soat. */
  function nowNext(key) {
    key = key || todayKey();
    var blocks = dayBlocks(key);
    if (!blocks.length) return { now: null, next: null, blocks: blocks };
    var d = new Date();
    var h = d.getHours() + d.getMinutes() / 60;
    var now = null, next = null;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (h >= b.from && h < b.to) { now = b; }
      else if (b.from > h && !next) { next = b; }
    }
    return { now: now, next: next, blocks: blocks };
  }

  /* Bugungi jadval bajarilishi: faqat YOZILGAN natijalar hisobga olinadi */
  function dayProgress(key) {
    var blocks = dayBlocks(key || todayKey());
    var core = blocks.filter(function (b) { return b.core; });
    var done = core.filter(function (b) { return b.status === 'done'; }).length;
    var partial = core.filter(function (b) { return b.status === 'partial'; }).length;
    var skipped = core.filter(function (b) { return b.status === 'skipped'; }).length;
    return {
      total: core.length, done: done, partial: partial, skipped: skipped,
      pending: core.length - done - partial - skipped,
      pct: core.length ? Math.round(done / core.length * 100) : 0
    };
  }

  /* ====================== O'QISH NATIJALARI =========================== */

  /* IELTS: faqat haqiqiy yozuv. Mock ballari — Store.engScoreList(). */
  function ielts() {
    var st = S();
    if (!st) return null;
    var scores = st.engScoreList ? st.engScoreList() : [];
    var last = null;
    if (scores.length) {
      last = scores.slice().sort(function (a, b) { return (b.at || 0) - (a.at || 0); })[0];
    }
    var days = 0, total = 0;
    try {
      days = st.engDoneCount ? st.engDoneCount() : 0;
      total = (window.ENGLISH && ENGLISH.meta && ENGLISH.meta.days) || 0;
    } catch (e) {}
    var quiz = quizStats('eng:');
    return {
      daysDone: days, daysTotal: total,
      lastMock: last,               // {l, r, w, s, at} yoki null
      mockCount: scores.length,
      quizAttempts: quiz.n, quizAccuracy: quiz.acc,
      target: cfg().target.overall,
      skillTargets: cfg().target.skills
    };
  }

  /* Coding: Python 30 kun + PyAI + DataCamp — faqat yozilgani */
  function coding() {
    var st = S();
    if (!st) return null;
    var pyDone = st.doneCount ? st.doneCount() : 0;
    var pyTotal = (window.COURSE && COURSE.length) || 0;
    var quiz = quizStats('py:');
    var pyai = null;
    try {
      if (window.PyAI && PyAI.progress) pyai = PyAI.progress();
    } catch (e) { pyai = null; }
    return {
      pythonDone: pyDone, pythonTotal: pyTotal,
      avgScore: st.avgScore ? st.avgScore() : 0,
      quizAttempts: quiz.n, quizAccuracy: quiz.acc,
      pyai: pyai
    };
  }

  /* Test natijalari: prefiksga mos yozuvlar bo'yicha haqiqiy aniqlik */
  function quizStats(prefix) {
    var st = S();
    if (!st || !st.all) return { n: 0, acc: null };
    var q = (st.all().quiz) || {};
    var n = 0, got = 0, max = 0;
    Object.keys(q).forEach(function (k) {
      if (prefix && k.indexOf(prefix) !== 0) return;
      var r = q[k];
      if (!r || !r.total) return;
      n++; got += (r.best != null ? r.best : r.score) || 0; max += r.total;
    });
    return { n: n, acc: max ? Math.round(got / max * 100) : null };
  }

  /* ====================== TAKROR VA XATOLAR =========================== */

  function review() {
    var due = 0, upcoming = 0, total = 0;
    try {
      if (window.Review) {
        due = Review.dueCount();
        upcoming = Review.upcoming ? Review.upcoming(7) : 0;
        total = Review.list().length;
      }
    } catch (e) {}
    var st = S();
    var open = st && st.openMistakes ? st.openMistakes().length : 0;
    var all = st && st.mistakes ? st.mistakes().length : 0;
    return { due: due, upcoming: upcoming, total: total, openMistakes: open, allMistakes: all };
  }

  /* ====================== O'LCHANGAN VAQT ============================= */

  /* Haqiqiy o'quv daqiqalari — REJA EMAS (brief 4F: planned minutes ≠ study time).
     Ikki manba: Focus o'lchagan sessiyalar va qo'lda yozilgan soatlar.     */
  function minutesOn(key) {
    var st = S();
    if (!st) return { measured: 0, manual: 0, total: 0 };
    var measured = st.sessionOf ? st.sessionOf(key) : 0;
    var h = st.hoursOf ? st.hoursOf(key) : { eng: 0, code: 0 };
    var manual = (h.eng || 0) + (h.code || 0);
    return { measured: measured, manual: manual, total: measured + manual };
  }

  function minutesRange(fromKey, toKey) {
    var k = cal(), out = { measured: 0, manual: 0, total: 0, days: 0, activeDays: 0 };
    var n = k.diffDays(fromKey, toKey);
    if (n < 0) return out;
    for (var i = 0; i <= n; i++) {
      var key = k.addDays(fromKey, i);
      var m = minutesOn(key);
      out.measured += m.measured; out.manual += m.manual; out.total += m.total;
      out.days++;
      if (m.total > 0) out.activeDays++;
    }
    return out;
  }

  /* ====================== USTUVORLIKLAR =============================== */

  /* Eng muhim uchta ish — faqat HAQIQIY yozuvdan kelib chiqadi.
     Hech narsa bo'lmasa bo'sh ro'yxat qaytadi: "ish yo'q" ham javob.    */
  function priorities(key) {
    key = key || todayKey();
    var out = [];
    var rv = review();
    var nn = nowNext(key);
    var m = missionNow(key);

    /* 1. Hozir boshlanadigan yoki davom etayotgan blok */
    if (nn.now && nn.now.status === 'pending') {
      out.push({
        kind: 'block', weight: 100,
        t: nn.now.t, meta: nn.now.fromStr + '–' + nn.now.toStr,
        route: 'planner/today'
      });
    } else if (nn.next) {
      out.push({
        kind: 'next', weight: 70,
        t: nn.next.t, meta: nn.next.fromStr,
        route: 'planner/today'
      });
    }

    /* 2. Muddati kelgan takror */
    if (rv.due > 0) {
      out.push({
        kind: 'review', weight: 90,
        t: { uz: rv.due + ' ta takror muddati keldi', en: rv.due + ' reviews are due' },
        meta: null, route: 'lab/due'
      });
    }

    /* 3. Ochiq xatolar */
    if (rv.openMistakes > 0) {
      out.push({
        kind: 'mistake', weight: 60,
        t: { uz: rv.openMistakes + ' ta xato hali tuzatilmagan', en: rv.openMistakes + ' mistakes are still open' },
        meta: null, route: 'lab/mistakes'
      });
    }

    /* 4. Imtihon yaqinlashgani — faqat 30 kundan kam qolganda */
    if (m.daysToExam >= 0 && m.daysToExam <= 30) {
      out.push({
        kind: 'exam', weight: 80,
        t: { uz: 'IELTS imtihoniga ' + m.daysToExam + ' kun', en: m.daysToExam + ' days to the IELTS exam' },
        meta: cfg().mission.exam, route: 'planner/phases'
      });
    }

    return out.sort(function (a, b) { return b.weight - a.weight; }).slice(0, 3);
  }

  /* ====================== MUDDATLAR =================================== */

  function deadlines(key) {
    key = key || todayKey();
    var c = cfg(), k = cal(), out = [];
    c.mission.phases.forEach(function (p) {
      if (p.to >= key) out.push({ kind: 'phase', date: p.to, t: p.title, days: k.diffDays(key, p.to) });
    });
    out.push({ kind: 'exam', date: c.mission.exam, t: { uz: 'IELTS Academic', en: 'IELTS Academic' }, days: k.diffDays(key, c.mission.exam) });
    return out.filter(function (d) { return d.days >= 0; })
      .sort(function (a, b) { return a.days - b.days; }).slice(0, 4);
  }

  /* ====================== HAFTALIK KO'RINISH ========================== */

  function weekOverview(key) {
    key = key || todayKey();
    var k = cal();
    return k.weekDays(key).map(function (d) {
      var p = dayProgress(d);
      var m = minutesOn(d);
      return { date: d, done: p.done, total: p.total, pct: p.pct, minutes: m.total, isToday: d === todayKey() };
    });
  }

  /* ====================== TEZ YOZIB QO'YISH =========================== */

  /* Quick capture — erkin daftarga yozuv. Haqiqiy saqlash, soxta emas. */
  function capture(text) {
    var st = S();
    if (!st || !st.copySet) return false;
    text = String(text || '').trim();
    if (!text) return false;
    st.copySet('free', {
      id: 'q' + Date.now().toString(36),
      title: text.slice(0, 60),
      body: text,
      at: Date.now()
    });
    if (st.logEvent) st.logEvent('capture', 'quick', text.slice(0, 60));
    return true;
  }

  function captureList(n) {
    var st = S();
    if (!st || !st.copyList) return [];
    return st.copyList('free').slice(0, n || 5);
  }

  OS.data = {
    todayKey: todayKey,
    profile: profile, missionNow: missionNow,
    dayBlocks: dayBlocks, nowNext: nowNext, dayProgress: dayProgress,
    ielts: ielts, coding: coding, quizStats: quizStats,
    review: review,
    minutesOn: minutesOn, minutesRange: minutesRange,
    priorities: priorities, deadlines: deadlines, weekOverview: weekOverview,
    capture: capture, captureList: captureList
  };
})();
