/* ==========================================================================
   Boshqaruv paneli (Dashboard)
   --------------------------------------------------------------------------
   Bitta savolga javob beradi: "bugun nima qilishim kerak?"
   Shuning uchun eng tepada — bitta katta "bugungi vazifa" kartasi, keyin
   o'lchovlar, faollik xaritasi va mustahkamlash kerak bo'lgan mavzular.
   ========================================================================== */
(function () {
  'use strict';

  /* Kun vaqtiga qarab salomlashish — kichik narsa, lekin "tirik" his beradi */
  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return tr('greetMorning');
    if (h < 18) return tr('greetDay');
    return tr('greetEve');
  }

  /* Keyingi o'qiladigan kun: birinchi tugallanmagan kun (yoki oxirgisi) */
  function nextLesson() {
    for (var i = 0; i < COURSE.length; i++) {
      if (!Store.isDone(COURSE[i].day)) return COURSE[i];
    }
    return COURSE[COURSE.length - 1];
  }

  /* Faollik xaritasi: oxirgi 8 hafta (56 kun) */
  function heatmap() {
    var act = Store.activityMap();
    var today = Store.dateKey();
    var cells = '';
    for (var i = 55; i >= 0; i--) {
      var key = Store.shiftDays(today, -i);
      var n = act[key] || 0;
      var lvl = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3;
      cells += '<div class="cell' + (key === today ? ' today' : '') + '" data-lvl="' + lvl + '" title="' +
        esc(key + ' · ' + n) + '"></div>';
    }
    return '<div class="heat">' + cells + '</div>' +
      '<div class="heat-legend"><span>' + esc(tr('heatLess')) + '</span>' +
      '<span class="cell"></span>' +
      '<span class="cell" style="background:color-mix(in srgb,var(--brand) 28%,transparent)"></span>' +
      '<span class="cell" style="background:color-mix(in srgb,var(--brand) 55%,transparent)"></span>' +
      '<span class="cell" style="background:var(--brand)"></span>' +
      '<span>' + esc(tr('heatMore')) + '</span></div>';
  }

  /* Zaif mavzular: eng yaxshi bali 9 dan past bo'lgan darslar */
  function weakList() {
    var rows = COURSE
      .filter(function (d) { var b = Store.bestScore(d.day); return b !== undefined && b < 9; })
      .sort(function (a, b) { return Store.bestScore(a.day) - Store.bestScore(b.day); })
      .slice(0, 6);

    if (!rows.length) return '<p style="color:var(--muted);font-size:14px">' + esc(tr('weakEmpty')) + '</p>';

    return '<div class="weak-list">' + rows.map(function (d) {
      var s = Store.bestScore(d.day);
      return '<button class="weak-row" data-go="lesson/' + d.day + '">' +
        '<span class="wr-d">' + esc(tr('day')) + ' ' + d.day + '</span>' +
        '<span class="wr-t">' + esc(L(d.title)) + '</span>' +
        '<span class="wr-s ' + (s < 7 ? 'low' : 'mid') + '">' + s + '/10</span></button>';
    }).join('') + '</div>';
  }

  window.PageDashboard = function () {
    var total = COURSE.length;
    var done = Store.doneCount();
    var pct = Math.round(done / total * 100);
    var streak = Store.streak();
    var avg = Store.avgScore();
    var openMis = Store.openMistakes().length;
    var notes = Store.notesList().length;
    var next = nextLesson();
    var name = Store.get('name');
    var started = done > 0;

    var h = '<div class="page stagger dash">';

    /* --- Boshqaruv markazi: qayerdaman · bugun nima · davom etish -------- */
    var key = Store.dateKey();
    var recs = window.Recommend ? Recommend.list() : [];
    var mission = recs[0] || null;
    var cont = window.Continue ? Continue.list().slice(0, 4) : [];
    var pyDay = window.HabitPlan && HabitPlan.inRange(key) ? HabitPlan.pyDayOf(key) : 0;
    var engDay = window.EngCal ? EngCal.dayOfKey(key) : 0;
    var dcIt = window.DataCamp ? (DataCamp.forDate(key) || DataCamp.overdue()[0] || null) : null;
    var orient = window.EngCal && EngCal.isOrientation(key);
    var kick = window.EngCal && EngCal.isKickoff(key);
    var debt0 = window.Goal ? Goal.debt().days : 0;
    h += '<section class="dash-hero pro">' +
      '<div class="dh-top"><div class="greet">' + esc(greeting()) + (name ? ', ' + esc(name) : '') + ' 👋</div>' +
        '<div class="dh-date">' + esc(fmtDateKey(key)) + (window.HabitPlan && HabitPlan.inRange(key) ? ' · ' + esc(tr('habType_' + HabitPlan.typeOf(key))) : '') + '</div></div>' +
      (orient ? '<div class="dh-phase">' + IC.spark + esc(tr('dashOrientation', { d: EngCal.fmt(ENGLISH.meta.start) })) + '</div>' : kick ? '<div class="dh-phase">' + IC.rocket + esc(tr('dashKickoff')) + '</div>' : '') +
      '<div class="dh-mission"><span class="dh-ml">' + esc(tr('dashMission')) + '</span>' +
        '<h1>' + esc(mission ? mission.title : (started ? tr('continueLabel') : tr('startCourse'))) + '</h1>' +
        (mission ? '<p class="dh-sub">' + esc(mission.why) + ' · ' + mission.min + ' ' + esc(tr('engMin')) + '</p>' : '<p class="dh-sub">' + esc(tr('dashLede')) + '</p>') + '</div>' +
      '<div class="dh-actions">' +
        '<button class="btn btn-primary btn-lg" data-go="' + esc(mission ? mission.route : 'lesson/' + next.day) + '">' + IC.rocket + esc(tr('dashStartMission')) + '</button>' +
        '<button class="btn btn-ghost btn-lg" data-go="today">' + IC.today + esc(tr('todayPage')) + '</button>' +
        '<button class="btn btn-ghost btn-lg" data-go="course">' + IC.book + esc(tr('courses')) + '</button>' +
      '</div>' +
      '<div class="dh-kpis">' +
        kpi(IC.code, 'Python', done + ' / ' + total, pyDay ? tr('day') + ' ' + pyDay : '', done / total * 100, 'python') +
        kpi(IC.globe, tr('english'), Store.engDoneCount() + ' / ' + ENGLISH.meta.days, engDay ? tr('day') + ' ' + engDay : (orient ? tr('engIntroBlock') : ''), Store.engDoneCount() / ENGLISH.meta.days * 100, 'english') +
        (window.DataCamp ? kpi(IC.layers, 'DataCamp', DataCamp.doneCount() + ' / ' + DataCamp.total(), dcIt ? tr('dcChapN', { n: dcIt.n }) : '', DataCamp.pct(), 'datacamp') : '') +
        kpi(IC.flame, tr('statStreak'), streak + ' ' + tr('days'), debt0 ? tr('goalDebtDays') + ': ' + debt0 : tr('rgDaysDone', { d: HabitPlan.stats().done, t: HabitPlan.stats().done + debt0 }), Math.min(100, streak * 10), 'habit', debt0 ? 'warn' : '') +
        kpi(IC.refresh, tr('reviewPage'), String(window.Review ? Review.dueCount() : 0), tr('tdReviewDue', { n: window.Review ? Review.dueCount() : 0 }), window.Review && Review.list().length ? Math.round(Review.list().filter(function (it) { return it.reps > 0; }).length / Review.list().length * 100) : 0, 'review') +
      '</div></section>';

    /* §37 — JORIY FOKUS: "hozir nima qilay?" savoliga jadvaldan javob.
       Today sahifasidagi bilan bir xil komponent — ikkinchi tizim emas.   */
    if (window.Focus) {
      var fcNow = Focus.nowCard(key);
      if (fcNow) h += fcNow;
      if (window.HabitPlan && HabitPlan.inRange(key)) {
        var dLoad = HabitPlan.loadOf(HabitPlan.forDate(key));
        if (dLoad.core) h += '<div class="td-load">' + Focus.loadBar(dLoad) + '</div>';
      }
    }

    /* Ikki ustun: asosiy oqim + o'ng panel (halqalar, qarz, davom etish) */
    h += '<div class="dash-layout"><div class="dash-main">';

    /* --- Birinchi qadamlar: holatdan hisoblanadi, hammasi bajarilsa (yoki yopilsa) yo'qoladi --- */
    if (!Store.flag('onb:hide')) {
      var steps = [
        { id: 'name', ok: !!name, route: 'settings', t: tr('onbName') },
        { id: 'road', ok: Store.flag('seen:roadmap') || Store.flag('seen:goal'), route: 'roadmap', t: tr('onbRoad') },
        { id: 'habit', ok: Store.flag('seen:habit'), route: 'habit', t: tr('onbHabit') },
        { id: 'py', ok: Store.bestScore(1) !== undefined || done > 0, route: 'lesson/1', t: tr('onbPy') },
        { id: 'eng', ok: Store.flag('seen:englishday') || Store.engDoneCount() > 0, route: 'english/1', t: tr('onbEng') },
        { id: 'word', ok: Store.copyList('vocab').length > 0, route: 'copy/vocab', t: tr('onbWord') }
      ];
      var okN = steps.filter(function (s) { return s.ok; }).length;
      if (okN < steps.length) {
        h += '<div class="card onb"><div class="onb-head"><h3 class="card-title"><span class="num">' + IC.rocket + '</span>' + esc(tr('onbT')) + ' <small>' + okN + '/' + steps.length + '</small></h3>' +
          '<button class="btn btn-quiet btn-sm" data-onbhide>' + esc(tr('onbHide')) + '</button></div>' +
          '<div class="onb-grid">' + steps.map(function (s) {
            return '<button class="onb-i' + (s.ok ? ' ok' : '') + '" data-go="' + esc(s.route) + '"><span class="onb-ck">' + (s.ok ? IC.check : '') + '</span><span>' + esc(s.t) + '</span></button>';
          }).join('') + '</div></div>';
      }
    }


    /* --- Bugungi ustuvorlik: Today sahifasidagi ro'yxatning o'zi (TodayPlan), birinchi 4 ta ochiq band --- */
    if (window.TodayPlan) {
      var tdAll = TodayPlan.items(key), tdOpen = tdAll.filter(function (it) { return !it.done; });
      var tdDone = tdAll.length - tdOpen.length;
      h += '<div class="card dash-td"><div class="dash-td-head"><h3 class="card-title"><span class="num">' + IC.today + '</span>' + esc(tr('dashTodayT')) + ' <small>' + tdDone + '/' + tdAll.length + '</small></h3>' +
        '<button class="btn btn-quiet btn-sm" data-go="today">' + esc(tr('todayPage')) + IC.arrowR + '</button></div>';
      if (!tdOpen.length) h += '<p class="hint">' + esc(tr('dashTodayAll')) + '</p>';
      else h += '<ol class="dash-td-list">' + tdOpen.slice(0, 4).map(function (it) {
        return '<li><button class="dash-td-i" data-go="' + esc(it.route) + '"><span class="dti-ic">' + it.ic + '</span><span class="dti-t"><b>' + esc(it.t) + '</b><span>' + esc(it.why) + '</span></span><span class="dti-min">' + it.min + ' ' + esc(tr('engMin')) + '</span></button></li>';
      }).join('') + '</ol>' + (tdOpen.length > 4 ? '<p class="hint">' + esc(tr('dashTodayMore', { n: tdOpen.length - 4 })) + '</p>' : '');
      h += '</div>';
    }

    /* --- Topshiriqlar va feedback (xodimlardan, real server ma'lumoti) --- */
    h += assignCard();

    /* qarz kartasi o'ng panelga ko'chdi (rail) */
    var railDebt = '';
    if (window.Goal) {
      var debt = Goal.debt(), lvl = Goal.debtLevel(debt.days);
      var req = Goal.required(), dm = Goal.doneMinutes();
      var hh = function (d, r) { return (d / 60).toFixed(d % 60 ? 1 : 0) + '/' + (r / 60) + ' ' + tr('hoursShort'); };
      railDebt = '<button class="goal-debt dash lvl-' + lvl + '" data-go="goal">' +
        '<div class="gd-n"><b>' + debt.days + '</b><span>' + esc(tr('goalDebtDays')) + '</span></div>' +
        '<div class="gd-body"><h4>' + esc(tr('goalDebtT' + lvl)) + '</h4><p>' + esc(Goal.roast(lvl)) + '</p>' +
          '<p class="gd-req">' + IC.globe + esc(tr('english')) + ' ' + esc(hh(dm.eng, req.eng)) + ' · ' + IC.code + 'Coding ' + esc(hh(dm.code, req.code)) +
          (Goal.nextLabel() ? ' · ' + IC.target + esc(Goal.nextLabel()) : '') + '</p></div>' +
        '<span class="gd-go">' + IC.arrowR + '</span></button>';
    }

    /* --- bugun: intizom + kitoblar + speaking (bir qatorda) --- */
    h += todayStrip();

    /* --- bugungi vazifa (Python) ---
       Python faqat dushanba/chorshanba/juma. Boshqa kunlarda karta
       "bugun Python kuni emas" deydi va keyingi kunni ko'rsatadi —
       foydalanuvchi bugun kod yozishi kerakmi-yo'qmi darrov biladi.      */
    var todayKey = Store.dateKey();
    var pyToday = window.HabitPlan && HabitPlan.inRange(todayKey) ? HabitPlan.pyDayOf(todayKey) : next.day;
    var pyIsToday = !window.HabitPlan || !HabitPlan.inRange(todayKey) || !!pyToday;
    h += '<button class="today-card' + (pyIsToday ? '' : ' off') + '" data-go="lesson/' + next.day + '" style="width:100%;text-align:left;cursor:pointer">' +
      '<span class="tc-day"><span><span class="n">' + next.day + '</span><br>' +
        '<span class="l">' + esc(tr('day')) + '</span></span></span>' +
      '<span class="tc-body">' +
        '<span class="tc-eyebrow">' + esc(pyIsToday ? tr('todayLabel') : tr('dashPyNotToday', { d: nextPyDayName() })) + ' · ' + esc(next.unit) + '</span>' +
        '<span class="tc-title" style="display:block">' + esc(L(next.title)) + '</span>' +
        '<span class="tc-note">' + esc(clip(L(next.intro), 130)) + '</span>' +
      '</span>' +
      '<span class="btn ' + (pyIsToday ? 'btn-primary' : 'btn-ghost') + '">' + esc(tr('open')) + IC.arrowR + '</span>' +
      '</button>';

    /* --- ingliz tili: bugungi hafta -----------------------------------
       Python bilan parallel yuradigan ikkinchi kurs. Sana bo'yicha joriy
       hafta ko'rsatiladi — foydalanuvchi "bugun nima?" degan savolga
       ikkala kurs uchun ham javob oladi.                                 */
    h += englishBand();

    /* --- o'lchovlar --- */
    h += '<div class="stat-grid" style="margin-bottom:20px">';
    h += '<div class="stat-tile accent"><div class="st-l">' + IC.trend + esc(tr('statProgress')) + '</div>' +
      '<div class="st-v">' + pct + '<small>%</small></div>' +
      '<div class="bar" style="margin-top:9px"><i style="width:' + pct + '%"></i></div>' +
      '<div class="st-note">' + esc(tr('dashProgressNote', { done: done, left: total - done })) + '</div></div>';

    h += '<div class="stat-tile ' + (streak ? 'gold' : '') + '"><div class="st-l">' + IC.flame + esc(tr('statStreak')) + '</div>' +
      '<div class="st-v">' + streak + '<small> ' + esc(tr('days')) + '</small></div>' +
      '<div class="st-note">' + esc(streak ? tr('streakDays') : tr('streakNone')) + '</div></div>';

    h += '<div class="stat-tile"><div class="st-l">' + IC.target + esc(tr('statAvg')) + '</div>' +
      '<div class="st-v">' + (avg ? avg.toFixed(1) : '—') + '<small>' + (avg ? ' / 10' : '') + '</small></div>' +
      '<div class="st-note">' + done + ' ' + esc(tr('days')) + '</div></div>';

    h += '<div class="stat-tile"><div class="st-l">' + IC.alert + esc(tr('statMistakes')) + '</div>' +
      '<div class="st-v">' + openMis + '</div>' +
      '<div class="st-note">' + notes + ' ' + esc(tr('notes')).toLowerCase() + '</div></div>';
    h += '</div>';

    /* --- Soha bo'yicha progress + o'quv salomatligi (Mastery/StudyTime) --- */
    if (window.Mastery) {
      var pm = Mastery.python(), em = Mastery.english();
      var wk = StudyTime.week(), wkDays = wk.days.filter(function (d) { return d.min > 0; }).length;
      var consistency = Math.round(wkDays / 7 * 100);
      var rvAll = Review.list(), rvDone = rvAll.filter(function (it) { return it.reps > 0; }).length;
      var reviewHealth = rvAll.length ? Math.round(rvDone / rvAll.length * 100) : 0;
      var practiceHealth = Math.round((pm.practice + em.grammar) / 2);
      var row = function (l, v, r) { return '<button class="ms-row" data-go="' + r + '"><span>' + esc(l) + '</span><div class="bar"><i style="width:' + v + '%"></i></div><b>' + v + '%</b></button>'; };
      h += '<div class="dash-grid">' +
        '<div class="card"><h3 class="card-title"><span class="num">' + IC.trend + '</span>' + esc(tr('dashProgressAreas')) + '</h3>' +
          row('Python', pm.overall, 'python') + row(tr('english'), em.overall, 'english') + row(tr('engSkillReading'), em.reading, 'books/reading') + row(tr('engSkillSpeaking'), em.speaking, 'speaking') + row(tr('projectsPage'), pm.application, 'projects') + '</div>' +
        '<div class="card"><h3 class="card-title"><span class="num gold">' + IC.flame + '</span>' + esc(tr('dashHealth')) + '</h3>' +
          row(tr('dashConsistency'), consistency, 'habit') + row(tr('anMastery'), Math.round((pm.overall + em.overall) / 2), 'analytics') + row(tr('msPractice'), practiceHealth, 'practice') + row(tr('reviewPage'), reviewHealth, 'review') +
          '<div class="hint" style="margin-top:8px">' + esc(tr('dashWeekTime', { h: (wk.min / 60).toFixed(1) })) + '</div></div>' +
        '</div>';
      /* Zaif sohalar — deterministik tavsiya */
      var weak = Mastery.weak().filter(function (w) { return w.v < 60; }).slice(0, 3);
      if (weak.length) h += '<div class="callout why"><span class="co-ic">' + IC.target + '</span><div><h4>' + esc(tr('dashWeakT')) + '</h4>' + weak.map(function (w) { return '<button class="an-tag hot" data-go="' + esc(w.route) + '">' + esc(w.label) + ' <b>' + w.v + '%</b>' + IC.arrowR + '</button>'; }).join('') + '</div></div>';
    }

    /* --- faollik + zaif mavzular --- */
    h += '<div class="dash-grid">';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.calendar + '</span>' +
      esc(tr('activityTitle')) + '</h3>' +
      '<p style="font-size:13.5px;color:var(--muted)">' + esc(tr('activitySub')) + '</p>' +
      heatmap() + '</div>';

    h += '<div class="card"><h3 class="card-title"><span class="num gold">' + IC.target + '</span>' +
      esc(tr('weakTitle')) + '</h3>' +
      '<p style="font-size:13.5px;color:var(--muted);margin-bottom:14px">' + esc(tr('weakSub')) + '</p>' +
      weakList() + '</div>';
    h += '</div>';
    /* --- so'nggi faollik (real jurnal) + loyihalar --- */
    h += '<div class="dash-grid">' + recentCard() + projectsCard() + '</div>';

    /* --- keyingi qadamlar --- */
    h += '<div class="dash-grid">' +
      quickCard(IC.grid, tr('cheatsheet'), tr('csLede'), 'cheatsheet') +
      quickCard(IC.notebook, tr('notes'), tr('notesLede'), 'notes') +
      quickCard(IC.checklist, tr('plan'), L(DCPLAN.intro), 'plan') +
      quickCard(IC.star, tr('career'), tr('rmCareerCTA'), 'career') +
      '</div>';

    h += '</div>';   // .dash-main
    /* --- o'ng panel --- */
    h += '<aside class="dash-rail">' +
      (window.Rings ? Rings.panel({ compact: true }) : '') +
      railDebt +
      (window.Goal && Goal.next() ? '<button class="card rail-next" data-go="goal"><span class="dh-ml">' + esc(tr('goalNextT')) + '</span><b>' + esc(L(Goal.next().t)) + '</b><span class="hint">' + esc(EngCal.fmt(Goal.next().date)) + ' · ' + esc(Goal.nextLabel().split(' · ').pop()) + '</span></button>' : '') +
      (cont.length ? '<div class="card rail-cont"><h3 class="card-title"><span class="num">' + IC.arrowR + '</span>' + esc(tr('continueLabel')) + '</h3>' + cont.map(function (c) { return '<button class="cont-chip" data-go="' + esc(c.route) + '"><span class="cc-k">' + esc(tr('track_' + c.track)) + '</span><b>' + esc(c.title) + '</b></button>'; }).join('') + '</div>' : '') +
      '</aside></div>';

    return h + '</div>';
  };

  /* Hero KPI plitasi: ikonka · nom · qiymat · izoh · progress chizig'i */
  function kpi(ic, label, value, note, pct, route, cls) {
    return '<button class="dh-kpi' + (cls ? ' ' + cls : '') + '" data-go="' + esc(route) + '"><span class="dk-ic">' + ic + '</span><span class="dk-b"><span class="dk-l">' + esc(label) + '</span><b>' + esc(value) + '</b>' + (note ? '<span class="dk-n">' + esc(note) + '</span>' : '') + '</span><i class="dk-bar"><em style="width:' + Math.max(0, Math.min(100, pct || 0)) + '%"></em></i></button>';
  }

  /* Ingliz tili bandi: bugungi kun + progress + imtihongacha qolgan kun.
     Python "bugungi vazifa" kartasi bilan yonma-yon turadi — foydalanuvchi
     ikkala kursning bugungi ishini bir joyda ko'radi.                      */
  function englishBand() {
    var m = ENGLISH.meta;
    var cur = EngCal.currentDay();
    var done = Store.engDoneCount();
    var toExam = EngCal.daysToExam();
    var toStart = EngCal.daysToStart();

    var line, route;
    if (cur === 0) {
      line = tr('engDaysToStart', { n: toStart }) + ' · ' + EngCal.fmt(m.start);
      route = 'english';
    } else if (cur > m.days) {
      line = tr('engExamMode') + ' · ' + EngCal.fmt(m.exam);
      route = 'english';
    } else {
      var day = Eng.dayOf(cur);
      line = day
        ? tr('day') + ' ' + cur + ' · ' + L(day.title)
        : tr('day') + ' ' + cur + ' · ' + tr('engSoon');
      route = day ? 'english/' + cur : 'english';
    }

    return '<button class="english-band" data-go="' + route + '" style="width:100%;text-align:left;cursor:pointer;margin-bottom:20px">' +
      '<div class="eb-ic">' + IC.globe + '</div>' +
      '<div style="flex:1;min-width:0">' +
        '<h4>' + esc(tr('english')) + ' — IELTS ' + m.target.toFixed(1) + '</h4>' +
        '<p>' + esc(line) + '</p>' +
        '<p style="font-family:var(--font-mono);font-size:12px;margin-top:5px">' +
          done + '/' + m.days + ' ' + esc(tr('days')) +
          (toExam > 0 ? ' · ' + esc(tr('engDaysLeft', { n: toExam })) : '') + '</p>' +
      '</div>' +
      '<span style="flex-shrink:0">' + IC.arrowR + '</span></button>';
  }

  /* Keyingi Python kunining nomi (Du/Chor/Ju) — bugun Python bo'lmasa */
  function nextPyDayName() {
    var key = Store.dateKey();
    for (var i = 1; i <= 7; i++) {
      var k = Store.shiftDays(key, i);
      if (HabitPlan.inRange(k) && HabitPlan.pyDayOf(k)) return fmtDateKey(k);
    }
    return '';
  }

  /* Bugun bir qatorda: intizom (kun turi, bajarilgan bloklar) · kitoblar
     (o'qish, tinglash, lug'at) · speaking treki. Har biri o'z sahifasiga
     olib boradi. Kurs boshlanmagan / tugagan bo'lsa — chiqmaydi.          */
  function todayStrip() {
    var key = Store.dateKey();
    if (!window.HabitPlan || !HabitPlan.inRange(key)) return '';
    var plan = HabitPlan.forDate(key);
    var done = HabitPlan.doneCount(plan);
    var typeName = tr(plan.type === 'rest' ? 'engRestDay' : plan.type === 'class' ? 'engClassDay' : 'engHeavyDay');
    var next = HabitPlan.nextBlock ? HabitPlan.nextBlock(plan) : null;

    var h = '<div class="today-strip">';

    h += '<button class="ts-item" data-go="habit">' +
      '<span class="ts-ic">' + IC.mosque + '</span><span class="ts-body">' +
      '<span class="ts-l">' + esc(tr('habit')) + ' · ' + esc(typeName) + '</span>' +
      '<span class="ts-v">' + done + '/' + plan.coreCount + ' ' + esc(tr('dashBlocks')) + '</span>' +
      (next ? '<span class="ts-s">' + esc(next.fromStr + ' ' + L(next.t)) + '</span>' : '') +
      '</span></button>';

    var calDay = HabitPlan.calDayOf(key);
    if (window.Books && calDay) {
      var d = calDay;
      h += '<button class="ts-item" data-go="books">' +
        '<span class="ts-ic">' + IC.doc + '</span><span class="ts-body">' +
        '<span class="ts-l">' + esc(tr('engSkillReading')) + '</span>' +
        '<span class="ts-v">' + esc(Books.readingLabel(d)) + '</span>' +
        '<span class="ts-s">' + esc(tr('booksThreeReads')) + '</span></span></button>';
      h += '<button class="ts-item" data-go="books">' +
        '<span class="ts-ic">' + IC.headphones + '</span><span class="ts-body">' +
        '<span class="ts-l">' + esc(tr('engSkillListening')) + '</span>' +
        '<span class="ts-v">' + esc(Books.listenLabel(d)) + '</span>' +
        '<span class="ts-s">' + esc(tr('engSkillVocab')) + ': ' + esc(Books.vocabTodayLabel(d)) + '</span>' +
        '</span></button>';
    }

    if (plan.speakDay && window.SPEAK30) {
      var sd = SPEAK30.days[plan.speakDay - 1];
      if (sd) h += '<button class="ts-item" data-go="speaking">' +
        '<span class="ts-ic">' + IC.mic + '</span><span class="ts-body">' +
        '<span class="ts-l">' + esc(tr('habSpeakTrack')) + ' · ' + esc(tr('day')) + ' ' + sd.n + '</span>' +
        '<span class="ts-v">' + esc(clip(L(sd.q), 60)) + '</span>' +
        '<span class="ts-s">' + esc(sd.part + ' · ' + sd.min) + '</span></span></button>';
    }

    return h + '</div>';
  }

  /* Topshiriqlar/feedback kartasi — faqat server bo'lsa; mahalliyda halol izoh */
  function assignCard() {
    if (!window.Ctrl) return '';
    var h = '<div class="card dash-as"><div class="dash-td-head"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('commAssign')) + '</h3><button class="btn btn-quiet btn-sm" data-go="comm/assignments">' + esc(tr('commHub')) + IC.arrowR + '</button></div>';
    if (!Ctrl.available()) return h + '<p class="hint">' + esc(tr('chOffS')) + '</p></div>';
    if (!Ctrl.feed()) return h + '<p class="hint">' + esc(tr(Ctrl.status() === 'auth' ? 'commAuth' : Ctrl.status() === 'env' ? 'chEnv' : 'commLoading')) + '</p></div>';
    var open = Ctrl.openAssignments(), fb = Ctrl.feedback().slice(0, 2), rv = Ctrl.reviews().filter(function (r) { return r.stage === 'reviewed'; });
    var ord = { overdue: 0, in_progress: 1, assigned: 2 }; open.sort(function (a, b) { return ord[a.st] - ord[b.st] || (a.due || '9').localeCompare(b.due || '9'); });
    if (!open.length && !fb.length && !rv.length) return h + '<p class="hint">' + esc(tr('asNone')) + '</p></div>';
    h += '<div class="dash-as-list">' + open.slice(0, 4).map(function (a) {
      return '<button class="dash-td-i" data-go="' + esc(a.route || 'comm/assignments') + '"><span class="dti-ic">' + IC.checklist + '</span><span class="dti-t"><b>' + esc(a.title) + '</b><span>' + esc(tr('role_' + a.by)) + (a.due ? ' · ' + esc(EngCal.fmt(a.due)) : '') + '</span></span><span class="as-st st-' + a.st + '">' + esc(tr('asSt_' + a.st)) + '</span></button>';
    }).join('') + rv.map(function (r) {
      return '<button class="dash-td-i" data-go="comm/feedback"><span class="dti-ic">' + IC.pen + '</span><span class="dti-t"><b>' + esc(r.title) + '</b><span>' + esc(tr('rvStage_reviewed')) + ' · ' + esc(tr('rvReviseT')) + '</span></span></button>';
    }).join('') + fb.map(function (f) {
      return '<button class="dash-td-i" data-go="comm/feedback"><span class="dti-ic">' + IC.star + '</span><span class="dti-t"><b>' + esc((f.activity || {}).title || tr('commFb')) + '</b><span>' + esc(tr('role_' + f.role)) + ' · ' + esc(String(f.text || (f.fb || {}).strengths || '').slice(0, 70)) + '</span></span></button>';
    }).join('') + '</div></div>';
    return h;
  }
  /* So'nggi faollik — Store.events (real hodisalar) */
  function recentCard() {
    var ev = (Store.events ? Store.events(8) : []).slice().reverse();
    var lbl = function (e) { return tr('ev_' + e.type) === 'ev_' + e.type ? e.type : tr('ev_' + e.type); };
    return '<div class="card"><h3 class="card-title"><span class="num">' + IC.clock + '</span>' + esc(tr('dashRecent')) + '</h3>' +
      (ev.length ? '<div class="ev-list">' + ev.map(function (e) { return '<div class="ev-row"><time>' + esc(fmtDate(e.at)) + '</time><span class="chip">' + esc(lbl(e)) + '</span><b>' + esc(e.title) + '</b></div>'; }).join('') + '</div>' : '<p class="hint">' + esc(tr('dashRecentNone')) + '</p>') + '</div>';
  }
  /* Loyihalar — holat va davomiylik */
  function projectsCard() {
    if (!window.PROJECTS) return '';
    var list = PROJECTS.list, rows = list.filter(function (p) { return Store.doneCount() >= p.after && !Store.flag('proj:' + p.id + ':done'); }).slice(0, 3);
    var doneN = list.filter(function (p) { return Store.flag('proj:' + p.id + ':done'); }).length;
    return '<div class="card"><div class="dash-td-head"><h3 class="card-title"><span class="num">' + IC.rocket + '</span>' + esc(tr('projectsPage')) + ' <small>' + doneN + '/' + list.length + '</small></h3><button class="btn btn-quiet btn-sm" data-go="projects">' + esc(tr('open')) + IC.arrowR + '</button></div>' +
      (rows.length ? rows.map(function (p) { var n = p.steps.filter(function (_, i) { return Store.flag('proj:' + p.id + ':' + i); }).length; return '<button class="dash-td-i" data-go="projects"><span class="dti-ic">' + IC.code + '</span><span class="dti-t"><b>' + esc(L(p.title)) + '</b><span>L' + p.level + ' · ' + n + '/' + p.steps.length + '</span></span><i class="dk-bar" style="width:70px"><em style="width:' + Math.round(n / p.steps.length * 100) + '%"></em></i></button>'; }).join('') : '<p class="hint">' + esc(tr('prjUnlockNote', { n: Store.doneCount() })) + '</p>') + '</div>';
  }
  function quickCard(icon, title, text, route) {
    return '<button class="card" data-go="' + route + '" style="text-align:left;cursor:pointer;width:100%">' +
      '<h3 class="card-title"><span class="num">' + icon + '</span>' + esc(title) + '</h3>' +
      '<p style="font-size:14px;color:var(--muted)">' + esc(clip(text, 150)) + '</p></button>';
  }
})();
