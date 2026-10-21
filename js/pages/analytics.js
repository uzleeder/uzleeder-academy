/* ==========================================================================
   Analytics (#/analytics) · Weekly (#/weekly) · Monthly (#/monthly) · Saved (#/saved)
   --------------------------------------------------------------------------
   Faqat ma'noli raqamlar: o'quv vaqti (jadval bloklari / Today belgilari),
   yopilgan darslar, mashqlar, xatolar, takrorlar, mahorat. Grafik — bitta:
   oxirgi 7/30 kunning ustunlari (SVG emas, oddiy div ustunlar).
   ========================================================================== */
(function () {
  'use strict';

  function fmtH(min) { return (min / 60).toFixed(min % 60 ? 1 : 0) + ' ' + tr('hoursShort'); }
  function bars(days, max) {
    var today = Store.dateKey();
    return '<div class="an-bars' + (days.length > 14 ? ' dense' : '') + '">' + days.map(function (d) {
      var h = max ? Math.round(d.min / max * 100) : 0;
      return '<div class="an-bar' + (d.future ? ' future' : '') + (d.key === today ? ' today' : '') + '" title="' + esc(d.key + ' · ' + d.min + ' min') + '"><i style="height:' + h + '%"></i><span>' + d.key.slice(8) + '</span></div>';
    }).join('') + '</div>';
  }
  function mastRow(label, v, route) { return '<button class="ms-row" data-go="' + esc(route) + '"><span>' + esc(label) + '</span><div class="bar"><i style="width:' + v + '%"></i></div><b>' + v + '%</b></button>'; }

  /* Hisob 17-sen 2026 dan boshlanadi: davrlar (7 / 30 kun) shu sanadan ketma-ket
     "oynalar" — 17–23-sen, 24–30-sen … Joriy oyna bugunni o'z ichiga oladi; kelgusi
     kunlar bo'sh ustun bo'lib turadi. Undan oldingi kunlar hech qayerda ko'rinmaydi. */
  var TRACK_FROM = '2026-09-17';
  function windowStart(days, back) {
    var t = Store.dateKey();
    if (t < TRACK_FROM) return TRACK_FROM;
    var n = Math.floor(Math.round((new Date(t + 'T00:00:00') - new Date(TRACK_FROM + 'T00:00:00')) / 86400000) / days) - (back ? 1 : 0);
    return Store.shiftDays(TRACK_FROM, Math.max(0, n) * days);
  }
  /* days: nechta kun; back: 1 — oldingi oyna (solishtirish uchun) */
  function period(days, back) {
    back = back || 0;
    var start = windowStart(days, back), today = Store.dateKey();
    var out = { min: 0, days: [], py: 0, eng: 0, quiz: 0, mistakesFixed: 0, reviews: 0, reads: 0, words: 0, from: start, to: Store.shiftDays(start, days - 1) };
    var st = Store.all();
    for (var i = 0; i < days; i++) { var k = Store.shiftDays(start, i); var m = k <= today ? StudyTime.minutesOn(k) : 0; out.min += m; out.days.push({ key: k, min: m, future: k > today }); }
    var t = out.to < today ? out.to : today;
    var from = new Date(start + 'T00:00:00').getTime(), to = new Date(out.to + 'T00:00:00').getTime() + 86400000;
    Object.keys(st.quiz).forEach(function (k) { if (st.quiz[k].at >= from && st.quiz[k].at < to) out.quiz += st.quiz[k].n || 1; });
    st.mistakes.forEach(function (m) { if (m.fixed && m.at >= from && m.at < to) out.mistakesFixed++; });
    Object.keys(st.review).forEach(function (k) { var l = st.review[k].last || 0; if (l >= from && l < to) out.reviews++; });
    Object.keys(st.read).forEach(function (k) { if (/^[rdt]\d/.test(k) && st.read[k].at >= from && st.read[k].at < to) out.reads++; });
    Store.copyList('vocab').forEach(function (w) { var c = w.created || w.at || 0; if (c >= from && c < to) out.words++; });
    /* Darslar: activity xaritasi (kuniga yopilgan darslar) */
    out.days.forEach(function (d) { out.py += st.activity[d.key] || 0; });
    Object.keys(st.eng.done).forEach(function (dn) { if (!/^\d+$/.test(dn)) return; var k = EngCal.dayKey(Number(dn)); if (k >= start && k <= t) out.eng++; });
    return out;
  }

  /* ====================== HALQALAR (rings) ==============================
     ringSVG(pct, size, stroke, color) — bitta SVG halqa.
     Rings.summary() — barcha sohalarning foizi (Dashboard va Tahlil uchun).
     Rings.panel(opts) — o'ng ustundagi aylanalar paneli: katta umumiy halqa +
     kichik halqalar; bosilganda tagida to'liq tafsilot ochiladi.           */
  window.ringSVG = function (pct, size, stroke, color) {
    size = size || 64; stroke = stroke || 6; pct = Math.max(0, Math.min(100, Math.round(pct || 0)));
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return '<svg class="ring" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (color || 'var(--brand)') + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
  };
  window.Rings = {
    summary: function () {
      var py = Mastery.python(), en = Mastery.english();
      var key = Store.dateKey(), hs = HabitPlan.stats();
      var passed = 0, doneD = 0, k = HABIT.meta.from;
      while (k <= key && HabitPlan.inRange(k)) { passed++; if (HabitPlan.isDayDone(HabitPlan.forDate(k))) doneD++; k = Store.shiftDays(k, 1); }
      var disc = passed ? Math.round(doneD / passed * 100) : 0;
      var rvAll = Review.list(), rvDone = rvAll.filter(function (it) { return it.reps > 0; }).length;
      var review = rvAll.length ? Math.round(rvDone / rvAll.length * 100) : 0;
      var dc = window.DataCamp ? DataCamp.pct() : 0;
      var words = Store.copyList('vocab').length, vocab = Math.min(100, Math.round(words / 600 * 100));
      var mis = Store.mistakes(), fixed = mis.length ? Math.round(mis.filter(function (m) { return m.fixed; }).length / mis.length * 100) : 100;
      var pyC = Math.round(Store.doneCount() / COURSE.length * 100), enC = Math.round(Store.engDoneCount() / ENGLISH.meta.days * 100);
      var overall = Math.round((py.overall + en.overall + disc + dc) / 4);
      return {
        overall: overall,
        items: [
          { k: 'python', label: 'Python', v: py.overall, color: 'var(--brand)', route: 'python', detail: [[tr('msKnowledge'), py.knowledge], [tr('msPractice'), py.practice], [tr('msRetention'), py.retention], [tr('msApplication'), py.application], [tr('anLessons'), pyC]] },
          { k: 'english', label: tr('english'), v: en.overall, color: 'var(--gold)', route: 'english', detail: [[tr('engSkillVocab'), en.vocab], [tr('engSkillGrammar'), en.grammar], [tr('engSkillReading'), en.reading], [tr('engSkillListening'), en.listening], [tr('engSkillSpeaking'), en.speaking], [tr('engSkillWriting'), en.writing], [tr('anEngDays'), enC], [tr('wrTeacherT') + (window.Writing && Writing.teacherAvg() !== null ? ' \u00b7 ' + Writing.teacherAvg().toFixed(1) : '') + ' (' + (window.Writing ? Writing.teacherMarks().length : 0) + '/5)', window.Writing ? Math.min(100, Math.round(Writing.teacherMarks().length / 5 * 100)) : 0]] },
          { k: 'datacamp', label: 'DataCamp', v: dc, color: 'var(--code-fn)', route: 'datacamp', detail: window.DataCamp ? [[tr('dcProgress'), dc], [tr('dcOverdue', { n: DataCamp.overdue().length }), DataCamp.overdue().length ? 0 : 100]] : [] },
          { k: 'discipline', label: tr('habit'), v: disc, color: 'var(--green)', route: 'habit', detail: [[tr('rgDaysDone', { d: doneD, t: passed }), disc], [tr('statStreak') + ' · ' + hs.streak, Math.min(100, hs.streak * 10)], [tr('rgPrayers'), hs.prayersTotal ? Math.round(hs.prayers / hs.prayersTotal * 100) : 0]] },
          { k: 'review', label: tr('reviewPage'), v: review, color: 'var(--code-op)', route: 'review', detail: [[tr('rgReviewed'), review], [tr('tdReviewDue', { n: Review.dueCount() }), Review.dueCount() ? Math.max(0, 100 - Review.dueCount() * 5) : 100], [tr('anMistakesFixed'), fixed]] },
          { k: 'vocab', label: tr('engSkillVocab'), v: vocab, color: 'var(--code-num)', route: 'copy/vocab', detail: [[words + ' / 600 ' + tr('engWords'), vocab], [tr('anWords') + ' · ' + tr('coursesToday'), Math.min(100, Math.round((window.Books ? Books.wordsAddedOn(key) : 0) / 40 * 100))]] }
        ]
      };
    },
    panel: function (opts) {
      opts = opts || {};
      var S = Rings.summary(), open = Store.setting('ringOpen') || '';
      var h = '<aside class="rings' + (opts.compact ? ' compact' : '') + '">' +
        '<button class="rg-main' + (open === 'all' ? ' open' : '') + '" data-ring="all"><span class="rg-big">' + ringSVG(S.overall, 132, 10, 'var(--brand)') + '<b>' + S.overall + '<small>%</small></b></span>' +
          '<span class="rg-t"><b>' + esc(tr('rgOverall')) + '</b><span>' + esc(tr('rgOverallS')) + '</span></span></button>' +
        '<div class="rg-grid">' + S.items.map(function (it) {
          return '<button class="rg-item' + (open === it.k ? ' open' : '') + '" data-ring="' + it.k + '" style="--rc:' + it.color + '">' + ringSVG(it.v, 58, 6, it.color) + '<b>' + it.v + '%</b><span>' + esc(it.label) + '</span></button>';
        }).join('') + '</div>';
      var cur = S.items.filter(function (it) { return it.k === open; })[0];
      if (open === 'all' || cur) {
        var rows = cur ? cur.detail : S.items.map(function (it) { return [it.label, it.v]; });
        h += '<div class="rg-detail"><div class="rg-dh"><b>' + esc(cur ? cur.label : tr('rgOverall')) + '</b>' + (cur ? '<button class="btn btn-quiet btn-sm" data-go="' + esc(cur.route) + '">' + esc(tr('open')) + IC.arrowR + '</button>' : '') + '</div>' +
          rows.map(function (r) { return '<div class="rg-row"><span>' + esc(r[0]) + '</span><div class="bar"><i style="width:' + Math.max(0, Math.min(100, r[1])) + '%"></i></div><b>' + Math.round(r[1]) + '%</b></div>'; }).join('') + '</div>';
      }
      return h + '</aside>';
    }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ring]'); if (!b) return;
    var cur = Store.setting('ringOpen') || '';
    Store.setSetting('ringOpen', cur === b.dataset.ring ? '' : b.dataset.ring);
    App.render();
  });

  window.PageAnalytics = function (mode) {
    mode = mode || 'all';
    var py = Mastery.python(), en = Mastery.english();
    var days = mode === 'monthly' ? 30 : 7;
    var p = period(days);
    var max = Math.max.apply(null, p.days.map(function (d) { return d.min; }).concat([1]));
    var weak = Mastery.weak();
    var title = mode === 'weekly' ? tr('anWeekly') : mode === 'monthly' ? tr('anMonthly') : tr('analyticsPage');

    var h = '<div class="page stagger an-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('anKick')) + '</div><h1>' + esc(title) + '</h1><p class="lede">' + esc(mode === 'all' ? tr('anLede') : tr('anPeriodLede', { n: days })) + '</p>' +
      '<div class="segmented" style="margin-top:12px;display:inline-flex"><button data-go="analytics"' + (mode === 'all' ? ' class="on"' : '') + '>' + esc(tr('anAll')) + '</button><button data-go="weekly"' + (mode === 'weekly' ? ' class="on"' : '') + '>' + esc(tr('anWeek')) + '</button><button data-go="monthly"' + (mode === 'monthly' ? ' class="on"' : '') + '>' + esc(tr('anMonth')) + '</button></div></header>';
    /* Ikki ustun: chapda hisobotlar (avvalgidek), o'ngda aylanalar paneli */
    h += '<div class="an-layout"><div class="an-main">';

    /* Umumiy */
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.clock + esc(mode === 'all' ? tr('anTotalTime') : tr('anTime')) + '</div><div class="st-v">' + esc(fmtH(mode === 'all' ? StudyTime.total() : p.min)) + '</div></div>' +
      '<div class="stat-tile ' + (HabitPlan.streak() ? 'gold' : '') + '"><div class="st-l">' + IC.flame + esc(tr('statStreak')) + '</div><div class="st-v">' + HabitPlan.streak() + '<small> ' + esc(tr('days')) + '</small></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.code + esc(tr('anLessons')) + '</div><div class="st-v">' + (mode === 'all' ? Store.doneCount() + '<small> / 30</small>' : p.py) + '</div><div class="st-note">Python</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.globe + esc(tr('anEngDays')) + '</div><div class="st-v">' + (mode === 'all' ? Store.engDoneCount() + '<small> / ' + ENGLISH.meta.days + '</small>' : p.eng) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.target + esc(tr('anPractice')) + '</div><div class="st-v">' + (mode === 'all' ? Object.keys(Store.all().quiz).reduce(function (s, k) { return s + (Store.all().quiz[k].n || 0); }, 0) : p.quiz) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.refresh + esc(tr('anReviews')) + '</div><div class="st-v">' + (mode === 'all' ? Review.list().reduce(function (s, it) { return s + (it.reps || 0); }, 0) : p.reviews) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.alert + esc(tr('anMistakesFixed')) + '</div><div class="st-v">' + (mode === 'all' ? Store.mistakes().filter(function (m) { return m.fixed; }).length + '<small> / ' + Store.mistakes().length + '</small>' : p.mistakesFixed) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.mic + esc(tr('anWords')) + '</div><div class="st-v">' + (mode === 'all' ? Store.copyList('vocab').length : p.words) + '</div></div>' +
      '</div>';

    /* Bugun · hafta · oy — bir qatorda (maqsadli: vaqt, dars, takror) + topshiriq + mahorat holati */
    var tk = Store.dateKey(), w7 = period(7), m30 = period(30), tdMin = StudyTime.minutesOn(tk);
    var asg = window.Ctrl && Ctrl.feed && Ctrl.feed() ? Ctrl.assignments() : null;
    var ev = Mastery.evidence ? Mastery.evidence() : null;
    h += '<div class="an-tri">' +
      '<div class="an-tri-c"><span class="gc-l">' + esc(tr('coursesToday')) + '</span><b>' + esc(fmtH(tdMin)) + '</b><span>' + esc(tr('tdReviewDue', { n: Review.dueCount() })) + '</span></div>' +
      '<div class="an-tri-c"><span class="gc-l">' + esc(tr('anWeekly')) + '</span><b>' + esc(fmtH(w7.min)) + '</b><span>Python ' + w7.py + ' · EN ' + w7.eng + ' · ' + esc(tr('anReviews')) + ' ' + w7.reviews + '</span></div>' +
      '<div class="an-tri-c"><span class="gc-l">' + esc(tr('anMonthly')) + '</span><b>' + esc(fmtH(m30.min)) + '</b><span>Python ' + m30.py + ' · EN ' + m30.eng + ' · ' + esc(tr('anPractice')) + ' ' + m30.quiz + '</span></div>' +
      '<div class="an-tri-c"><span class="gc-l">' + esc(tr('commAssign')) + '</span><b>' + (asg ? asg.filter(function (a) { return a.st === 'completed'; }).length + ' / ' + asg.length : '—') + '</b><span>' + (asg ? esc(tr('asSt_overdue')) + ' ' + asg.filter(function (a) { return a.st === 'overdue'; }).length : esc(tr('chOffS')).slice(0, 60)) + '</span></div>' +
      '</div>';
    if (ev) h += '<div class="card an-ev"><h3 class="card-title"><span class="num gold">' + IC.medal + '</span>' + esc(tr('anMastery')) + ' — ' + esc(tr('anEvidence')) + '</h3><div class="an-ev-grid">' +
      [['completion', tr('anEvCompletion'), ev.completion], ['quiz', tr('anEvQuiz'), ev.quiz], ['practice', tr('anPractice'), ev.practice], ['review', tr('anEvReview'), ev.review], ['repeat', tr('anEvRepeat'), ev.repeat]].map(function (x) { return '<div><span>' + esc(x[1]) + '</span><b>' + x[2] + '%</b><i class="ml-tag ml-' + Mastery.level(x[2]) + '">' + esc(Mastery.levelLabel(x[2])) + '</i></div>'; }).join('') +
      '<div><span>' + esc(tr('anMistakesOpen')) + '</span><b>' + ev.mistakes + '</b></div></div>' +
      '<p class="hint">Python: <i class="ml-tag ml-' + Mastery.level(py.overall) + '">' + esc(Mastery.levelLabel(py.overall)) + '</i> · English: <i class="ml-tag ml-' + Mastery.level(en.overall) + '">' + esc(Mastery.levelLabel(en.overall)) + '</i> — ' + esc(tr('anEvNote')) + '</p></div>';

    /* Oldingi davr bilan solishtirish — faqat haftalik/oylik rejimda */
    if (mode !== 'all') {
      var pp = period(days, 1);
      var delta = function (a, b, unit) { var d = a - b; return '<span class="an-delta ' + (d > 0 ? 'up' : d < 0 ? 'down' : '') + '">' + (d > 0 ? '+' : '') + d + unit + '</span>'; };
      h += '<div class="an-cmp">' + esc(tr('anVsPrev', { n: days })) + ' ' +
        '<b>' + esc(tr('anTime')) + '</b> ' + delta(p.min, pp.min, ' min') + ' · ' +
        '<b>Python</b> ' + delta(p.py, pp.py, '') + ' · ' +
        '<b>EN</b> ' + delta(p.eng, pp.eng, '') + ' · ' +
        '<b>' + esc(tr('anPractice')) + '</b> ' + delta(p.quiz, pp.quiz, '') + ' · ' +
        '<b>' + esc(tr('anReviews')) + '</b> ' + delta(p.reviews, pp.reviews, '') + '</div>';
    }

    /* Vaqt ustunlari */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.clock + '</span>' + esc(tr('anTimeChart', { n: days })) + ' <small class="an-range">' + esc(EngCal.fmt(p.from) + ' – ' + EngCal.fmt(p.to)) + '</small></h3>' + bars(p.days, max) + '<div class="hint">' + esc(tr('anTimeNote')) + '</div></div>';

    /* ---- Jadval signallari (§26 + §19): yuk taqsimoti va blok yakuni ----
       Soat emas, SIFAT ko'rsatkichi: blok oxirigacha bajarildimi va yuk
       qanday taqsimlangan. Ma'lumot jadval dvigatelidan (HabitPlan).     */
    if (window.HabitPlan && window.Focus && HabitPlan.weekLoad) {
      var wFrom = Store.shiftDays(Store.dateKey(), -(days - 1));
      var lo = { hard: 0, med: 0, light: 0, core: 0, done: 0 };
      var bPlanned = 0, bClosed = 0, bPartial = 0;
      for (var di = 0; di < days; di++) {
        var dk = Store.shiftDays(wFrom, di);
        if (!HabitPlan.inRange(dk)) continue;
        var dp = HabitPlan.forDate(dk), dl = HabitPlan.loadOf(dp);
        lo.hard += dl.hard; lo.med += dl.med; lo.light += dl.light;
        lo.core += dl.core; lo.done += dl.done;
        dp.blocks.forEach(function (b) {
          if (!b.core) return;
          bPlanned++;
          if (Store.habitBlock(dk, b.id)) {
            bClosed++;
            var r = Store.blockResult(dk, b.id);
            if (r && r.st === 'partial') bPartial++;
          }
        });
      }
      if (lo.core) {
        var bPct = bPlanned ? Math.round(bClosed / bPlanned * 100) : 0;
        h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.target + '</span>' + esc(tr('anLoadT')) + '</h3>' +
          '<p class="hint">' + esc(tr('anLoadS')) + '</p>' +
          '<div class="fc-week-grid">' +
            '<div class="fc-st"><b>' + bClosed + ' / ' + bPlanned + '</b><span>' + esc(tr('anBlocksDone')) + '</span></div>' +
            '<div class="fc-st' + (bPct >= 80 ? '' : ' red') + '"><b>' + bPct + '%</b><span>' + esc(tr('anBlocksPct')) + '</span></div>' +
            (bPartial ? '<div class="fc-st"><b>' + bPartial + '</b><span>' + esc(tr('fcStPartial')) + '</span></div>' : '') +
            '<div class="fc-st"><b>' + Math.round(lo.hard / 60 * 10) / 10 + ' ' + esc(tr('hoursShort')) + '</b><span>' + esc(tr('loadW_hard')) + '</span></div>' +
          '</div>' +
          Focus.loadBar(lo) +
          '<p class="hint" style="margin-top:10px">' + esc(tr('anLoadNote')) + ' <button class="btn btn-quiet btn-sm" data-go="week">' + esc(tr('wkTitle')) + IC.arrowR + '</button></p>' +
          '</div>';
      }
    }

    /* Haftalik / oylik mulohaza — 3 savol, avtomatik saqlanadi (read['rf-w-<dushanba>'] / ['rf-m-<yil-oy>']) */
    if (mode !== 'all') {
      var rfKey = reflectKey(mode), rf = Store.readGet(rfKey) || {};
      var prevList = Object.keys(Store.all().read).filter(function (k) { return k.indexOf('rf-' + mode[0] + '-') === 0 && k !== rfKey; }).sort().reverse().slice(0, 3);
      h += '<div class="card an-reflect"><h3 class="card-title"><span class="num">' + IC.pen + '</span>' + esc(mode === 'weekly' ? tr('rfWeekT') : tr('rfMonthT')) + '</h3><p class="hint">' + esc(tr('rfS')) + '</p>' +
        ['worked', 'blocked', 'focus'].map(function (q) {
          return '<label class="field"><span>' + esc(tr('rf_' + q)) + '</span><textarea class="input" rows="2" data-rf="' + q + '" placeholder="' + esc(tr('rf_' + q + 'Ph')) + '">' + esc(rf[q] || '') + '</textarea></label>';
        }).join('') +
        (rf.at ? '<div class="hint">' + esc(tr('savedAt', { t: fmtDate(rf.at) })) + '</div>' : '');
      if (prevList.length) {
        h += '<details class="an-prev"><summary>' + esc(tr('rfPrev', { n: prevList.length })) + '</summary>';
        prevList.forEach(function (k) { var r = Store.readGet(k) || {}; h += '<div class="an-prev-i"><b>' + esc(k.slice(5)) + '</b>' + (r.focus ? '<span>' + esc(tr('rf_focus')) + ': ' + esc(r.focus) + '</span>' : '') + (r.worked ? '<span>' + esc(tr('rf_worked')) + ': ' + esc(r.worked) + '</span>' : '') + '</div>'; });
        h += '</details>';
      }
      h += '</div>';
    }

    /* Mahorat */
    h += '<div class="an-two">';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.code + '</span>Python · ' + esc(tr('anMastery')) + ' ' + py.overall + '%</h3>' +
      mastRow(tr('msKnowledge'), py.knowledge, 'python') + mastRow(tr('msPractice'), py.practice, 'practice') + mastRow(tr('msRetention'), py.retention, 'review') + mastRow(tr('msApplication'), py.application, 'projects') + '</div>';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.globe + '</span>' + esc(tr('english')) + ' · ' + esc(tr('anMastery')) + ' ' + en.overall + '%</h3>' +
      mastRow(tr('engSkillVocab'), en.vocab, 'copy/vocab') + mastRow(tr('engSkillGrammar'), en.grammar, 'eng-grammar') + mastRow(tr('engSkillReading'), en.reading, 'books/reading') + mastRow(tr('engSkillListening'), en.listening, 'bbc/6min') + mastRow(tr('engSkillSpeaking'), en.speaking, 'speaking') + mastRow(tr('engSkillWriting'), en.writing, 'writing') + '</div>';
    h += '</div>';

    /* Kuchli / zaif */
    var strong = weak.slice().reverse().filter(function (w) { return w.v >= 60; }).slice(0, 3);
    var wk = weak.filter(function (w) { return w.v < 60; }).slice(0, 3);
    h += '<div class="an-two"><div class="card"><h3 class="card-title"><span class="num">' + IC.check + '</span>' + esc(tr('anStrong')) + '</h3>' + (strong.length ? strong.map(function (w) { return '<div class="an-tag ok">' + esc(w.label) + ' <b>' + w.v + '%</b></div>'; }).join('') : '<p class="hint">' + esc(tr('anStrongNone')) + '</p>') + '</div>' +
      '<div class="card"><h3 class="card-title"><span class="num">' + IC.alert + '</span>' + esc(tr('anWeakT')) + '</h3>' + wk.map(function (w) { return '<button class="an-tag hot" data-go="' + esc(w.route) + '">' + esc(w.label) + ' <b>' + w.v + '%</b>' + IC.arrowR + '</button>'; }).join('') + '</div></div>';

    /* Keyingi ustuvorlik */
    if (wk.length) h += '<div class="callout why"><span class="co-ic">' + IC.target + '</span><div><h4>' + esc(mode === 'monthly' ? tr('anNextMonth') : tr('anNextWeek')) + '</h4>' + esc(wk.map(function (w) { return w.label; }).join(' + ')) + ' — ' + esc(tr('anNextWhy')) + '</div></div>';

    /* Python mavzulari bo'yicha mahorat — boshlanganlari (qaror uchun: qaysi mavzuga qaytish) */
    if (Mastery.topics) {
      var tps = Mastery.topics().filter(function (t) { return t.started; });
      if (tps.length) {
        h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.code + '</span>' + esc(tr('pmTopicsT')) + '</h3><div class="pm-grid">' + tps.map(function (t) {
          var parts = splitUnit(t.unit), weakest = t.days.filter(function (d) { return d.started; }).sort(function (a, b) { return a.v - b.v; })[0];
          return '<button class="pm-row as-btn" data-go="' + (weakest ? 'lesson/' + weakest.day : 'python') + '"><span class="pm-n">' + esc(parts.name) + '</span><div class="bar ' + (t.v >= 80 ? 'green' : t.v >= 60 ? '' : 'red') + '"><i style="width:' + t.v + '%"></i></div><b>' + t.v + '%</b></button>';
        }).join('') + '</div><div class="hint">' + esc(tr('anTopicsHint')) + '</div></div>';
      }
    }

    /* Keyingi bosqichlar (oylik) — Maqsad xaritasidan, qarz bilan surilgan sanalar */
    if (mode === 'monthly' && window.Goal) {
      var ms = Goal.milestones().filter(function (m) { return m.status !== 'done' && m.date >= Store.dateKey(); }).slice(0, 4);
      if (ms.length) h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.target + '</span>' + esc(tr('anMilestones')) + '</h3><div class="an-ms">' + ms.map(function (m) {
        return '<button class="an-ms-i" data-go="goal"><span class="an-ms-d">' + esc(EngCal.fmt(m.date)) + (m.shift ? ' <i>+' + m.shift + '</i>' : '') + '</span><b>' + esc(L(m.t)) + '</b></button>';
      }).join('') + '</div></div>';
    }

    /* Loyihalar va bosqichlar */
    if (window.PROJECTS) {
      var pd = PROJECTS.list.filter(function (x) { return Store.flag('proj:' + x.id + ':done'); });
      h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.star + '</span>' + esc(tr('projectsPage')) + '</h3><p class="hint">' + esc(tr('anProjects', { d: pd.length, t: PROJECTS.list.length })) + (pd.length ? ' — ' + esc(pd.map(function (x) { return L(x.title); }).join(', ')) : '') + '</p></div>';
    }
    h += '</div>' + Rings.panel() + '</div>';
    return h + '</div>';
  };

  function reflectKey(mode) {
    var t = Store.dateKey();
    if (mode === 'monthly') return 'rf-m-' + t.slice(0, 7);
    var d = new Date(t + 'T00:00:00');
    return 'rf-w-' + Store.shiftDays(t, -((d.getDay() + 6) % 7));
  }
  window.PageAnalytics.mount = function () {
    var tas = $$('[data-rf]'); if (!tas.length) return;
    var mode = /weekly/.test(location.hash) ? 'weekly' : 'monthly', key = reflectKey(mode), tm;
    tas.forEach(function (ta) {
      ta.addEventListener('input', function () {
        clearTimeout(tm);
        tm = setTimeout(function () {
          var o = Store.readGet(key) || {};
          tas.forEach(function (x) { o[x.dataset.rf] = x.value; });
          Store.readSet(key, o);
        }, 500);
      });
    });
  };

  /* ====================== SAQLANGANLAR (xatcho'plar) =================== */
  window.PageSaved = function () {
    var list = Store.bookmarksList();
    var h = '<div class="page stagger"><header class="page-head"><div class="eyebrow">' + esc(tr('svKick')) + '</div><h1>' + esc(tr('savedPage')) + '</h1><p class="lede">' + esc(tr('svLede')) + '</p></header>';
    if (!list.length) {
      h += '<div class="rv-empty">' + IC.bookmark + '<h3>' + esc(tr('svNone')) + '</h3><p>' + esc(tr('svNoneS')) + '</p></div>';
    } else {
      var groups = {};
      list.forEach(function (b) { (groups[b.kind] = groups[b.kind] || []).push(b); });
      Object.keys(groups).forEach(function (k) {
        h += '<div class="section-head"><div class="sh-n">' + IC.bookmark + '</div><div><h2>' + esc(tr('bmKind_' + k)) + ' · ' + groups[k].length + '</h2></div></div><div class="sv-list">';
        groups[k].forEach(function (b) { h += '<div class="sv-row"><button class="sv-open" data-go="' + esc(b.route) + '"><b>' + esc(b.title) + '</b><span>' + esc(fmtDate(b.at)) + '</span></button><button class="cb-x" data-bmdel="' + esc(b.id) + '" title="' + esc(tr('delete')) + '">' + IC.close + '</button></div>'; });
        h += '</div>';
      });
    }
    return h + '</div>';
  };
  window.PageSaved.mount = function () {
    $$('[data-bmdel]').forEach(function (b) { b.addEventListener('click', function () { Store.bookmarkToggle(b.dataset.bmdel); App.render(); }); });
  };

  /* Xatcho'p tugmasi — istalgan sahifada: bookmarkBtn(id, route, title, kind) */
  window.bookmarkBtn = function (id, route, title, kind) {
    var on = !!Store.bookmark(id);
    return '<button class="bm-btn' + (on ? ' on' : '') + '" data-bm="' + esc(id) + '" data-route="' + esc(route) + '" data-title="' + esc(title) + '" data-kind="' + esc(kind) + '" title="' + esc(on ? tr('bmRemove') : tr('bmAdd')) + '" aria-pressed="' + on + '">' + IC.bookmark + '<span>' + esc(on ? tr('bmSaved') : tr('bmSave')) + '</span></button>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-bm]');
    if (!b) return;
    var on = Store.bookmarkToggle(b.dataset.bm, b.dataset.route, b.dataset.title, b.dataset.kind);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    var sp = b.querySelector('span'); if (sp) sp.textContent = on ? tr('bmSaved') : tr('bmSave');
    toast(on ? tr('bmAdded') : tr('bmRemoved'), on ? 'ok' : '');
  });
})();
