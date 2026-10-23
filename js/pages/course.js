/* ==========================================================================
   Kurs indeksi — 30 kunning to'liq ro'yxati, hafta bo'yicha guruhlangan
   --------------------------------------------------------------------------
   Yon paneldagi ro'yxat tor va qisqa. Bu sahifa esa kengroq: har kunning
   turi, davomiyligi, bali va qisqacha mazmuni bilan.
   ========================================================================== */
(function () {
  'use strict';

  /* ====================== KURSLAR MARKAZI =============================
     #/course — ikkala kurs bitta joyda: Coding (Python) va English (IELTS).
     Bittasini tanlasang — o'sha kursga kirasan. Har kartada bugungi kun,
     progress va "kirish" tugmasi. Python kursining o'zi #/python da.     */
  /* Karta yasovchi (Kurslar va Job Ready sahifalari uchun umumiy) */
  function progCard(cls, go, ic, tag, title, desc, stats, p, next) {
    return '<button class="cp-card ' + cls + '" data-go="' + go + '"><div class="cp-top"><span class="cp-ic">' + ic + '</span><span class="cp-tag">' + esc(tag) + '</span></div>' +
      '<h2>' + esc(title) + '</h2><p>' + esc(desc) + '</p><div class="cp-stats">' + stats + '</div>' +
      '<div class="bar"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div>' +
      (next ? '<div class="cp-next"><span>' + esc(tr('coursesNext')) + '</span><b>' + esc(next) + '</b></div>' : '') +
      '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div></button>';
  }

  /* Job Ready ichidagi kurslar kartalari: Coding — Python · DataCamp · Python & AI */
  window.CourseCards = {
    python: function () {
      var pyTotal = COURSE.length, pyDone = Store.doneCount(), pyNext = App.firstOpenDay(), pyLesson = null;
      COURSE.forEach(function (c) { if (c.day === pyNext) pyLesson = c; });
      var h = '';
      h += '<button class="cp-card py" data-go="python">' +
        '<div class="cp-top"><span class="cp-ic">' + IC.code + '</span>' +
          '<span class="cp-tag">' + esc(tr('coursesCodingTag')) + '</span></div>' +
        '<h2>' + esc(tr('coursesCoding')) + '</h2>' +
        '<p>' + esc(tr('coursesCodingD')) + '</p>' +
        '<div class="cp-stats">' +
          '<span><b>' + pyDone + '</b>/' + pyTotal + ' ' + esc(tr('days')) + '</span>' +
          '<span><b>' + Math.round(pyDone / pyTotal * 100) + '%</b></span>' +
          '<span>' + esc(tr('coursesSched')) + ': ' + esc(tr('coursesDaily')) + ' · 20-sen → 19-okt</span></div>' +
        '<div class="bar"><i style="width:' + (pyDone / pyTotal * 100) + '%"></i></div>' +
        (pyLesson ? '<div class="cp-next"><span>' + esc(tr('coursesNext')) + '</span><b>' + esc(tr('day')) + ' ' + pyNext + ' · ' + esc(L(pyLesson.title)) + '</b></div>' : '') +
        '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div>' +
        '</button>';
      return h;
    },
    datacamp: function () {
      var h = '';
      if (window.DataCamp) {
        var dcCur = DataCamp.current(), dcDone = DataCamp.doneCount(), dcTot = DataCamp.total(), dcOver = DataCamp.overdue().length;
        h += '<button class="cp-card dc" data-go="datacamp">' +
          '<div class="cp-top"><span class="cp-ic">' + IC.layers + '</span><span class="cp-tag">' + esc(tr('coursesDCTag')) + '</span></div>' +
          '<h2>' + esc(tr('coursesDC')) + '</h2><p>' + esc(tr('coursesDCD')) + '</p>' +
          '<div class="cp-stats"><span><b>' + dcDone + '</b>/' + dcTot + ' ' + esc(tr('dcProgress')).toLowerCase() + '</span><span><b>' + DataCamp.pct() + '%</b></span>' + (dcOver ? '<span class="red">' + esc(tr('dcOverdue', { n: dcOver })) + '</span>' : '<span>' + esc(tr('dcOnePerDay')) + '</span>') + '</div>' +
          '<div class="bar"><i style="width:' + DataCamp.pct() + '%"></i></div>' +
          (dcCur ? '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('dcChapN', { n: dcCur.n })) + ' · ' + esc(dcCur.title) + '</b></div>' : '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('dcAllDone')) + '</b></div>') +
          '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div></button>';
      }
      return h;
    },
    pyai: function () {
      if (!window.PyAI) return '';
      var lt = function (uz, en) { return L({ uz: uz, en: en }); };
      var pc = PyAI.courseStatus(), pDone = 0, pTot = 0; pc.modules.forEach(function (x) { pDone += x.s.completed; pTot += x.s.lessons; });
      var nx = PyAI.nextLesson();
      return progCard('pa', 'pyai', IC.code, lt('Karyera yo\'li · 10 modul', 'Career path · 10 modules'), 'Python & AI Engineering',
        lt("Modul 0–9, mashqlar, mahorat tekshiruvi, P1–P5 loyihalar, capstone, portfolio.", 'Modules 0–9, exercises, mastery checks, projects P1–P5, capstone, portfolio.'),
        '<span><b>' + pDone + '</b>/' + pTot + ' ' + esc(lt('dars', 'lessons')) + '</span><span>' + esc(lt('takror', 'reviews')) + ': <b>' + PyAI.reviewDue().length + '</b></span>',
        pTot ? pDone / pTot * 100 : 0, nx ? L(nx.lesson.title) : '');
    },
    english: function () {
      var enTotal = ENGLISH.meta.days, enDone = Store.engDoneCount();
      var enCur = window.EngCal ? EngCal.currentDay() : 0;
      var enDay = (enCur > 0 && enCur <= enTotal && window.Eng) ? Eng.dayOf(enCur) : null;
      var enLast = Store.engLastScore();
      var enOverall = enLast ? Store.engOverall(enLast) : null;
      var h = '';
      h += '<button class="cp-card en" data-go="english">' +
        '<div class="cp-top"><span class="cp-ic">' + IC.globe + '</span>' +
          '<span class="cp-tag">' + esc(tr('coursesEnglishTag')) + '</span></div>' +
        '<h2>' + esc(tr('coursesEnglish')) + '</h2>' +
        '<p>' + esc(tr('coursesEnglishD')) + '</p>' +
        '<div class="cp-stats">' +
          '<span><b>' + enDone + '</b>/' + enTotal + ' ' + esc(tr('days')) + '</span>' +
          '<span><b>' + Math.round(enDone / enTotal * 100) + '%</b></span>' +
          '<span>' + esc(tr('engOverall')) + ': <b>' + (enOverall !== null ? enOverall.toFixed(1) : '—') + '</b></span></div>' +
        '<div class="bar"><i style="width:' + (enDone / enTotal * 100) + '%"></i></div>' +
        (enDay ? '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('day')) + ' ' + enCur + ' · ' + esc(L(enDay.title)) + '</b></div>'
               : '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(enCur === 0 ? tr('engDaysToStart', { n: EngCal.daysToStart() }) : tr('engExamMode')) + '</b></div>') +
        '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div>' +
        '</button>';
      return h;
    },
    speaking: function () {
      var h = '';
      if (window.SPEAK30) {
        var spDone = Store.speakDoneCount(), spTotal = SPEAK30.meta.days;
        var todayKey = Store.dateKey();
        var spCur = (window.HabitPlan && HabitPlan.inRange(todayKey)) ? (HabitPlan.speakDayOf(todayKey) || 0) : 0;
        var spDay = spCur ? SPEAK30.days[spCur - 1] : null;
        h += '<button class="cp-card sp" data-go="speaking">' +
          '<div class="cp-top"><span class="cp-ic">' + IC.mic + '</span>' +
            '<span class="cp-tag">' + esc(tr('coursesSpeakingTag')) + '</span></div>' +
          '<h2>' + esc(tr('coursesSpeaking')) + '</h2>' +
          '<p>' + esc(tr('coursesSpeakingD')) + '</p>' +
          '<div class="cp-stats">' +
            '<span><b>' + spDone + '</b>/' + spTotal + ' ' + esc(tr('days')) + '</span>' +
            '<span><b>' + Math.round(spDone / spTotal * 100) + '%</b></span>' +
            '<span>20–30 ' + esc(tr('engMin')) + ' · ' + esc(tr('coursesDaily')) + '</span></div>' +
          '<div class="bar"><i style="width:' + (spDone / spTotal * 100) + '%"></i></div>' +
          (spDay ? '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('day')) + ' ' + spCur + ' · ' + esc(L(spDay.q)).slice(0, 70) + '</b></div>'
                 : '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(spDone >= spTotal ? tr('spkOver') : tr('spkNotStarted')) + '</b></div>') +
          '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div>' +
          '</button>';
      }
      return h;
    },
    bbc: function () {
      var h = '';
      h += '<button class="cp-card bbc" data-go="bbc">' +
        '<div class="cp-top"><span class="cp-ic">' + IC.headphones + '</span>' +
          '<span class="cp-tag">BBC Learning English</span></div>' +
        '<h2>' + esc(tr('coursesBBC')) + '</h2>' +
        '<p>' + esc(tr('coursesBBCD')) + '</p>' +
        '<div class="cp-stats"><span><b>' + Store.bbcDoneCount() + '</b> ' + esc(tr('bbcDoneS')) + '</span><span>6 ' + esc(tr('engMin')) + ' · ' + esc(tr('coursesDaily')) + '</span></div>' +
        '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('bbcTodayHint')) + '</b></div>' +
        '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div>' +
        '</button>';
      return h;
    },
    writing: function () {
      var h = '';
      if (window.WRITING) {
        var wCur = Writing.currentWeek();
        var wDone = Writing.doneCount();
        h += '<button class="cp-card wr" data-go="writing">' +
          '<div class="cp-top"><span class="cp-ic">' + IC.pen + '</span>' +
            '<span class="cp-tag">' + esc(tr('coursesWritingTag')) + '</span></div>' +
          '<h2>' + esc(tr('coursesWriting')) + '</h2>' +
          '<p>' + esc(tr('coursesWritingD')) + '</p>' +
          '<div class="cp-stats"><span><b>' + wDone + '</b>/' + WRITING.weeks.length + ' ' + esc(tr('engWeek')).toLowerCase() + '</span></div>' +
          '<div class="bar"><i style="width:' + (wDone / WRITING.weeks.length * 100) + '%"></i></div>' +
          '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(wCur ? tr('engWeek') + ' ' + wCur.n + ' · ' + L(wCur.title) : tr('engDaysToStart', { n: Writing.daysToStart() })) + '</b></div>' +
          '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div>' +
          '</button>';
      }
      return h;
    },
    quick: function () {
      var h = '';
      if (window.Quick) {
        var qCur = Quick.current(), qDone = Quick.doneCount(), qTot = Quick.total();
        h += '<button class="cp-card qk" data-go="quick">' +
          '<div class="cp-top"><span class="cp-ic">' + IC.refresh + '</span><span class="cp-tag">' + esc(tr('coursesQuickTag')) + '</span></div>' +
          '<h2>' + esc(tr('coursesQuick')) + '</h2><p>' + esc(tr('coursesQuickD')) + '</p>' +
          '<div class="cp-stats"><span><b>' + qDone + '</b>/' + qTot + ' ' + esc(tr('days')) + '</span><span><b>' + Math.round(qDone / qTot * 100) + '%</b></span><span>' + esc(Quick.certOk() ? tr('q10CertReady') : tr('coursesDaily')) + '</span></div>' +
          '<div class="bar"><i style="width:' + Math.round(qDone / qTot * 100) + '%"></i></div>' +
          '<div class="cp-next"><span>' + esc(qCur ? tr('q10Next') : tr('q10FinalT')) + '</span><b>' + esc(qCur ? tr('day') + ' ' + qCur.n + ' · ' + L(qCur.title) : (Quick.certOk() ? tr('q10CertReady') : tr('q10AllDone'))) + '</b></div>' +
          '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div></button>';
      }
      return h;
    },
    englishAll: function () { var C = window.CourseCards; return C.english() + C.speaking() + C.bbc() + C.writing() + C.quick(); }
  };

  window.PageCourses = function () {
    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('coursesKick')) + '</div>' +
      '<h1>' + esc(tr('courses')) + '</h1>' +
      '<p class="lede">' + esc(tr('coursesLede')) + '</p></header>';

    h += '<div class="course-pick">';

    /* --- Job Ready (Coding — Python + DataCamp + Python & AI) va IELTS Mission (barcha ingliz tili kurslari) --- */
    if (window.JobReady) {
      try {
        var lt = function (uz, en) { return L({ uz: uz, en: en }); };
        var jr = JobReady.status(), jd = 0, jt = 0; jr.stages.forEach(function (s) { jd += s.done; jt += s.total; });
        var jNext = JobReady.nextSteps()[0];
        h += progCard('jr', 'jobready', IC.rocket, lt('Dastur · 3 kurs + loyihalar', 'Program · 3 courses + projects'), 'Job Ready: Python & AI Engineer',
          lt("Ichida: Coding — Python (30 kun), DataCamp — Python Programming Fundamentals, Python & AI Engineering (modul 0–9), loyihalar, capstone, portfolio va ish qidirish.",
            'Inside: Coding — Python (30 days), DataCamp — Python Programming Fundamentals, Python & AI Engineering (modules 0–9), projects, capstone, portfolio and job search.'),
          '<span><b>' + (jt ? Math.round(jd / jt * 100) : 0) + '%</b></span><span>' + esc(lt('Mezonlar', 'Criteria')) + ': <b>' + jr.met + '</b>/' + jr.of + '</span><span>5 ' + esc(lt('bosqich', 'stages')) + '</span>',
          jt ? jd / jt * 100 : 0, jNext ? L(jNext.title) : '');
      } catch (e) { if (window.console) console.error(e); }
    }
    if (window.Mission) {
      try {
        var lm = function (uz, en) { return L({ uz: uz, en: en }); };
        var mIdx = Mission.dayIndex(), mDays = Mission.C().days, mDue = Mission.errors.due().length, mIn = Math.max(0, Math.min(mIdx, mDays));
        h += progCard('ms', 'mission', IC.target, lm('IELTS · 5 kurs + 16 hafta', 'IELTS · 5 courses + 16 weeks'), 'IELTS Mission',
          lm("25-okt 2026 → 14-fev 2027. Ichida: English (IELTS kursi), Speaking 30, BBC Listening, Writing, Quick Repeat, studiyalar, xato banki va mock testlar.", '25 Oct 2026 → 14 Feb 2027. Inside: English (IELTS course), Speaking 30, BBC Listening, Writing, Quick Repeat, studios, error bank and mock tests.'),
          '<span><b>' + mIn + '</b>/' + mDays + ' ' + esc(tr('days')) + '</span>' + (mDue ? '<span>' + esc(lm(mDue + ' xato takrori', mDue + ' error reviews')) + '</span>' : ''),
          mIn / mDays * 100, mIdx < 1 ? lm('Boshlanishiga ' + (1 - mIdx) + ' kun · diagnostika', 'Starts in ' + (1 - mIdx) + ' day(s) · diagnostics') : '');
      } catch (e) { if (window.console) console.error(e); }
    }

    /* Maqsad (Goal) kurs emas — u chap menyuda alohida turadi (#/goal) */
    h += '</div>';

    /* Ikkala kurs bir vaqtda — qisqa eslatma va intizomga havola */
    h += '<div class="callout why"><span class="co-ic">' + IC.layers + '</span><div>' +
      '<h4>' + esc(tr('coursesParallelT')) + '</h4>' + esc(tr('coursesParallel')) +
      ' <button class="link-btn" data-go="habit">' + esc(tr('habit')) + ' →</button></div></div>';

    /* Tez havolalar: kitoblar, cheatsheet'lar */
    h += '<div class="eng-quick">' +
      '<button class="btn btn-ghost" data-go="books">' + IC.book + esc(tr('books')) + '</button>' +
      '<button class="btn btn-ghost" data-go="cheatsheet">' + IC.grid + esc(tr('cheatsheet')) + '</button>' +
      '<button class="btn btn-ghost" data-go="eng-grammar">' + IC.brain + esc(tr('engGrammarSheet')) + '</button>' +
      '<button class="btn btn-ghost" data-go="roadmap">' + IC.map + esc(tr('roadmap')) + '</button>' +
      '</div>';

    return h + '</div>';
  };

  function avgOf(arr) { if (!arr.length) return 0; return Math.round(arr.reduce(function (s, x) { return s + x; }, 0) / arr.length); }

  window.PageCourse = function () {
    var total = COURSE.length;
    var done = Store.doneCount();

    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('course')) + '</div>' +
      '<h1>30 Days to <span class="grad">AI Engineering</span></h1>' +
      '<p class="lede">' + esc(tr('rmLede')) + '</p>' +
      '<div class="bar" style="max-width:420px;margin-top:16px"><i style="width:' + (done / total * 100) + '%"></i></div>' +
      '<p style="font-size:13px;color:var(--muted);margin-top:8px">' +
        esc(tr('dashProgressNote', { done: done, left: total - done })) + '</p>' +
      '</header>';

    /* Mavzular bo'yicha mahorat (Mastery.topics) — tugatish emas: bilim + test + xotira */
    if (window.Mastery && Mastery.topics) {
      var tps = Mastery.topics().filter(function (t) { return t.started; });
      if (tps.length) {
        h += '<div class="card pm-card"><h3 class="card-title"><span class="num">' + IC.trend + '</span>' + esc(tr('pmTopicsT')) + '</h3><p class="hint">' + esc(tr('pmTopicsS')) + '</p><div class="pm-grid">';
        tps.forEach(function (t) {
          var parts = splitUnit(t.unit);
          h += '<div class="pm-row"><span class="pm-n">' + esc(parts.name) + '</span><div class="bar ' + (t.v >= 80 ? 'green' : t.v >= 60 ? '' : 'red') + '"><i style="width:' + t.v + '%"></i></div><b>' + t.v + '%</b></div>';
        });
        h += '</div></div>';
      }
    }

    groupUnits().forEach(function (u) {
      var parts = splitUnit(u.name);
      var doneN = u.days.filter(function (d) { return Store.isDone(d.day); }).length;
      var tv = window.Mastery && Mastery.lesson ? avgOf(u.days.map(function (d) { return Mastery.lesson(d.day).overall; })) : null;

      h += '<div class="section-head"><div class="sh-n">' + esc(parts.wk.replace(/\D/g, '') || '·') + '</div>' +
        '<div><h2>' + esc(parts.name) + '</h2>' +
        '<div class="sh-sub">' + esc(parts.wk) + ' · ' + doneN + '/' + u.days.length + ' ' + esc(tr('days')) + (tv ? ' · ' + esc(tr('pmMastery')) + ' ' + tv + '%' : '') + '</div></div></div>';

      h += '<div class="week-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">';
      u.days.forEach(function (d) {
        var isDone = Store.isDone(d.day);
        var open = App.isDayOpen(d.day);
        var best = Store.bestScore(d.day);
        var lm = window.Mastery && Mastery.lesson ? Mastery.lesson(d.day) : null;
        h += '<button class="week-card' + (isDone ? ' done' : '') + '" ' +
          (open ? 'data-go="lesson/' + d.day + '"' : 'disabled') +
          ' style="text-align:left;cursor:' + (open ? 'pointer' : 'not-allowed') + ';opacity:' + (open ? 1 : .55) + '">' +
          '<span class="wc-top"><span class="wc-wk">' + esc(tr('day')) + ' ' + d.day + '</span>' +
            (isDone
              ? '<span class="wc-badge done">' + best + '/10' + (lm ? ' · ' + lm.overall + '%' : '') + '</span>'
              : '<span class="tag ' + (d.type === 'topic' ? 'topic' : 'review') + '">' +
                esc(d.type === 'topic' ? tr('topicTag') : tr('reviewTag')) + '</span>') +
          '</span>' +
          '<span class="wc-name" style="display:block">' + esc(L(d.title)) + '</span>' +
          '<span class="wc-days" style="display:block;margin-top:0">' +
            (open ? IC.clock.replace('<svg', '<svg style="width:12px;height:12px;display:inline;vertical-align:-2px"') +
              ' ' + estimateMinutes(d) + ' ' + esc(tr('minutes')) : IC.lock) +
          '</span></button>';
      });
      h += '</div>';
    });

    return h + '</div>';
  };
})();
