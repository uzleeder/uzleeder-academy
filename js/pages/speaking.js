/* ==========================================================================
   Speaking Fluency — 30 kunlik trek sahifasi (#/speaking)
   --------------------------------------------------------------------------
   Kurslar markazidagi uchinchi karta. Ma'lumot SPEAK30 dan (speaking30.js):
   meta, 4 hafta, usul, fillers/transitions va 30 kun + har kunning o'z
   texnikasi/mashqi/iboralari (SPEAK30.daily). Kunning yozuv maydoni
   (ikkinchi variant) intizom sahifasida — bu yerdan o'sha kunga havola.
   ========================================================================== */
(function () {
  'use strict';

  /* Trek kuni = ingliz tili kursining kuni (1-kun = 21-sen) */
  function dayDate(n) { return EngCal.dayKey(n); }

  function todayN() {
    var key = Store.dateKey();
    if (!window.HabitPlan || !HabitPlan.inRange(key)) return 0;
    return HabitPlan.speakDayOf(key) || 0;
  }

  window.PageSpeaking = function () {
    var S = window.SPEAK30;
    if (!S) return '<div class="page empty"><h3>404</h3></div>';
    var cur = todayN();
    var done = Store.speakDoneCount();
    var pct = Math.round(done / S.meta.days * 100);
    var today = Store.dateKey();
    var passed = 0;
    for (var i = 1; i <= S.meta.days; i++) if (dayDate(i) < today) passed++;

    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('courses')) + ' · ' + esc(tr('habSpeakTrack')) + '</div>' +
      '<h1>' + esc(L(S.meta.title)) + '</h1>' +
      '<p class="lede">' + esc(L(S.meta.lede)) + '</p></header>';

    /* O'lchovlar */
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.trend + esc(tr('engProgress')) + '</div>' +
        '<div class="st-v">' + pct + '<small>%</small></div>' +
        '<div class="bar" style="margin-top:9px"><i style="width:' + pct + '%"></i></div>' +
        '<div class="st-note">' + done + ' / ' + S.meta.days + ' ' + esc(tr('spkRecorded')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.calendar + esc(tr('engToday')) + '</div>' +
        '<div class="st-v">' + (cur ? cur : '—') + '</div>' +
        '<div class="st-note">' + esc(cur ? L(S.weeks[S.days[cur - 1].w].title) : (passed >= S.meta.days ? tr('spkOver') : tr('spkNotStarted'))) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('spkDaily')) + '</div>' +
        '<div class="st-v" style="font-size:26px">' + (S.protocol ? S.protocol.minutes : 30) + '<small>' + esc(tr('engMin')) + '</small></div>' +
        '<div class="st-note">' + esc(EngCal.fmt(dayDate(1))) + ' → ' + esc(EngCal.fmt(dayDate(S.meta.days))) + '</div></div>' +
      '<div class="stat-tile gold"><div class="st-l">' + IC.target + esc(tr('spkGoal')) + '</div>' +
        '<div class="st-v" style="font-size:22px">120 <small>WPM</small></div>' +
        '<div class="st-note">' + esc(tr('spkGoalNote')) + '</div></div>' +
      '</div>';

    /* Fluency protokoli — 3 yozuv + haftalik o'lchov */
    if (S.protocol) {
      var P = S.protocol;
      h += sectionHead(1, tr('spkProtoT'), tr('spkProtoS', { m: P.minutes }));
      h += '<div class="bbc-steps">';
      P.rounds.forEach(function (r) {
        h += '<div class="bbc-step"><span class="n">' + r.n + '</span><div><b>' + esc(L(r.t)) + ' · ' + r.min + ' ' + esc(tr('engMin')) + '</b><span>' + esc(L(r.d)) + '</span></div></div>';
      });
      h += '</div>';
      h += '<div class="callout why"><span class="co-ic">' + IC.trend + '</span><div><h4>' + esc(tr('spkTestT')) + '</h4>' + esc(L(P.test)) + '</div></div>';
      h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.target + '</span>' + esc(tr('spkTargetsT')) + '</h3>' +
        '<div class="gc-table-wrap"><table class="gc-table spk-metrics"><thead><tr><th>' + esc(tr('engWeek')) + '</th><th>' + esc(tr('spkTgtWpm')) + '</th><th>' + esc(tr('spkTgtPause')) + '</th><th>' + esc(tr('spkMyWpm')) + '</th><th>' + esc(tr('spkMyPause')) + '</th><th></th></tr></thead><tbody>';
      P.targets.forEach(function (t) {
        var m = Store.readGet('spkw' + t.w) || {};
        var ok = m.wpm != null && m.wpm >= t.wpm && m.pauses != null && m.pauses <= t.pauses;
        var bad = m.wpm != null && !ok;
        h += '<tr class="' + (ok ? 'ok' : bad ? 'bad' : '') + '"><td class="k">' + t.w + ' <small>' + esc(L(t.note)) + '</small></td><td>≥ ' + t.wpm + '</td><td>≤ ' + t.pauses + '</td>' +
          '<td><input class="input sm" type="number" min="0" max="250" data-spkm="wpm" data-w="' + t.w + '" value="' + (m.wpm != null ? m.wpm : '') + '"></td>' +
          '<td><input class="input sm" type="number" min="0" max="60" data-spkm="pauses" data-w="' + t.w + '" value="' + (m.pauses != null ? m.pauses : '') + '"></td>' +
          '<td class="spk-res">' + (ok ? IC.check + esc(tr('spkHit')) : bad ? esc(tr('spkMiss')) : '—') + '</td></tr>';
      });
      h += '</tbody></table></div><div class="hint">' + esc(tr('spkMetricHint')) + '</div></div>';
      h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div><h4>' + esc(tr('spkHonestT')) + '</h4>' + esc(L(P.honest)) + '</div></div>';
    }

    h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span><div><h4>' + esc(tr('spkEngineT')) + '</h4>' + esc(L(S.meta.engine)) + '</div></div>';
    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div><h4>' + esc(tr('engImportant')) + '</h4>' + esc(L(S.meta.honest)) + '</div></div>';

    if (cur) {
      h += '<div class="eng-quick"><button class="btn btn-primary" data-go="habit">' + IC.mic + esc(tr('spkOpenToday', { n: cur })) + '</button>' +
        '<button class="btn btn-ghost" data-go="eng-skill/speaking">' + IC.layers + esc(tr('engAfter30')) + '</button></div>';
    }

    /* 4 hafta */
    h += sectionHead(2, tr('spkWeeks'), L(S.meta.connect));
    h += '<div class="eng-skill-grid">';
    Object.keys(S.weeks).forEach(function (w) {
      var wk = S.weeks[w];
      h += '<div class="eng-skill"><div class="es-ic">' + w + '</div><div><div class="es-n">' + esc(tr('engWeek')) + ' ' + w + ' — ' + esc(L(wk.title)) + '</div>' +
        '<div class="es-g">' + esc(L(wk.goal)) + '</div></div></div>';
    });
    h += '</div>';

    /* Usul */
    h += sectionHead(3, tr('habMethod'), tr('spkMethodS'));
    h += '<div class="card"><ol class="sc-method-list">';
    S.method.forEach(function (m) { h += '<li>' + esc(L(m)) + '</li>'; });
    h += '</ol></div>';

    /* 30 kun */
    h += sectionHead(4, tr('spkAllDays'), tr('spkAllDaysS'));
    var lastW = 0;
    S.days.forEach(function (d) {
      if (d.w !== lastW) {
        lastW = d.w;
        h += '<div class="eng-phase-head small"><span class="ep-n">' + d.w + '</span><span class="ep-t"><b>' + esc(L(S.weeks[d.w].title)) + '</b><span>' + esc(L(S.weeks[d.w].goal)) + '</span></span></div>';
      }
      var dl = S.daily && S.daily[d.n];
      var saved = Store.speakNote(d.n);
      var key = dayDate(d.n);
      var state = saved ? 'done' : (key < today ? 'missed' : key === today ? 'today' : '');
      h += '<details class="spk-day ' + state + '"' + (d.n === cur ? ' open' : '') + '>' +
        '<summary><span class="sd-n">' + d.n + '</span><span class="sd-body"><b>' + esc(L(d.q)) + '</b>' +
          '<span>' + esc(EngCal.fmt(key)) + ' · ' + esc(d.part) + ' · ' + esc(d.min) + (dl ? ' · ' + esc(L(dl.tech)).slice(0, 60) + '…' : '') + '</span></span>' +
          '<span class="sd-st">' + (saved ? IC.check : state === 'missed' ? '·' : state === 'today' ? '●' : '') + '</span></summary>' +
        '<div class="sd-in">';
      if (d.p3) h += '<div class="sc-p3"><b>' + esc(tr('habThenP3')) + '</b> ' + esc(L(d.p3)) + '</div>';
      if (window.speakQuestions) h += speakQuestions(d.n);
      if (dl) {
        h += '<div class="sc-tech"><span class="sc-tech-l">' + IC.target + esc(tr('habTechToday')) + '</span><div>' + esc(L(dl.tech)) + '</div></div>';
        h += '<div class="sc-drill"><span class="gc-l">' + esc(tr('habDrill')) + '</span>' + esc(L(dl.drill)) + '</div>';
        h += '<div class="sc-chunks"><div class="gc-l">' + esc(tr('habChunks')) + '</div>';
        dl.chunks.forEach(function (c) { h += '<div class="sc-chunk"><b>' + esc(c.en) + '</b><i>' + esc(c.uz) + '</i></div>'; });
        h += '</div>';
        h += '<div class="sc-chips"><div class="gc-l">' + esc(tr('habFillersToday')) + '</div>';
        (dl.f || []).forEach(function (i) { var f = S.fillers[i]; if (f) h += '<span class="sc-chip"><b>' + esc(f.en) + '</b><i>' + esc(f.uz) + '</i></span>'; });
        h += '</div><div class="sc-chips"><div class="gc-l">' + esc(tr('habTransitionsToday')) + '</div>';
        (dl.t || []).forEach(function (i) { var t = S.transitions[i]; if (t) h += '<span class="sc-chip t"><b>' + esc(t.en) + '</b><i>' + esc(t.uz) + '</i></span>'; });
        h += '</div>';
      }
      if (saved) h += '<div class="sd-note"><div class="gc-l">' + esc(tr('habSecondTake')) + '</div><p>' + esc(saved.text) + '</p><span class="hint">' + esc(fmtDate(saved.at)) + '</span></div>';
      /* Ustozga: bugungi/ochiq kun uchun matnli ikkinchi variant (ovoz yozuvi qurilmada — yuborilmaydi, halol) */
      if (saved && d.n === cur && window.ReviewBlock) h += ReviewBlock('speaking', 'spk' + d.n, 'Speaking ' + d.n + ' — ' + L(d.q).slice(0, 60), 'speaking', saved.text);
      h += '<div class="sync-actions"><button class="btn btn-ghost btn-sm" data-go="habit/' + esc(key) + '">' + IC.mic + esc(tr('spkGoDay')) + '</button></div>';
      h += '</div></details>';
    });

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="course">' + IC.arrowL + esc(tr('courses')) + '</button><span></span></div>';
    return h + '</div>';
  };

  /* O'lchov jadvali: qiymat o'zgarsa saqlanadi va qator rangi yangilanadi */
  window.PageSpeaking.mount = function () {
    if (window.ReviewBlock) ReviewBlock.mount(function () { var b = $('#rvSubmit'); var n = Number(String(b.dataset.ref).replace('spk', '')); var s = Store.speakNote(n); return s ? s.text : ''; });
    $$('[data-spkm]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var w = inp.getAttribute('data-w'), k = inp.getAttribute('data-spkm');
        var patch = {}; patch[k] = inp.value === '' ? null : Number(inp.value); patch.at = Date.now();
        Store.readSet('spkw' + w, patch);
        App.render();
      });
    });
  };

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div>' +
      '<h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }
})();
