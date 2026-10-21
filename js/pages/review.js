/* ==========================================================================
   Review (#/review) — yagona takrorlash navbati (SRS)
   --------------------------------------------------------------------------
   Navbat: muddati kelgan elementlar (so'z · xato · Python konspekti · ingliz
   kuni · grammatika). Sessiya: old tomon → "Ko'rsat" → o'zini baholash:
   Yana (1 kun) · Yaxshi (keyingi oraliq) · Oson (ikki qadam). Baho saqlanadi,
   element keyingi sanaga suriladi. Hech qanday avtomatik "to'g'ri/xato" yo'q —
   halol o'z-o'zini baholash.
   ========================================================================== */
(function () {
  'use strict';

  var queue = [], idx = 0, shown = false, done = 0;

  window.PageReview = function () {
    var all = Review.list(), due = Review.due();
    var byKind = {};
    all.forEach(function (it) { byKind[it.kind] = (byKind[it.kind] || 0) + 1; });
    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('rvKick')) + '</div><h1>' + esc(tr('reviewPage')) + '</h1><p class="lede">' + esc(tr('rvLede')) + '</p></header>';

    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      tile(IC.refresh, tr('rvDue'), due.length, 'accent') +
      tile(IC.calendar, tr('rvUpcoming'), Review.upcoming(7), '') +
      tile(IC.layers, tr('rvTotal'), all.length, '') +
      tile(IC.check, tr('rvMastered'), all.filter(function (it) { return Review.status(it) === 'mastered'; }).length, 'gold') + '</div>';

    h += '<div class="rv-kinds">' + ['vocab', 'mistake', 'py', 'eng', 'grammar'].map(function (k) {
      return '<span class="chip">' + esc(tr('rvKind_' + k)) + ' <b>' + (byKind[k] || 0) + '</b></span>';
    }).join('') + '</div>';

    if (!due.length) {
      h += '<div class="rv-empty">' + IC.check + '<h3>' + esc(tr('rvNone')) + '</h3><p>' + esc(tr('rvNoneS')) + '</p>' +
        '<div class="sync-actions"><button class="btn btn-ghost btn-sm" data-go="copy/vocab">' + IC.mic + esc(tr('copyVocab')) + '</button><button class="btn btn-ghost btn-sm" data-go="practice">' + IC.target + esc(tr('practiceCenter')) + '</button></div></div>';
    } else {
      h += '<div class="rv-stage" id="rvStage"></div>';
    }

    /* Yaqin 7 kun */
    var soon = all.filter(function (it) { return it.due > Store.dateKey(); }).sort(function (a, b) { return a.due < b.due ? -1 : 1; }).slice(0, 8);
    if (soon.length) {
      h += '<div class="section-head"><div class="sh-n">' + IC.calendar + '</div><div><h2>' + esc(tr('rvSoon')) + '</h2></div></div><div class="rv-soon">';
      soon.forEach(function (it) { var c = Review.card(it); if (!c) return; h += '<div class="rv-soon-row"><span class="chip">' + esc(tr('rvKind_' + it.kind)) + '</span><b>' + esc(c.front) + '</b><span class="rv-date">' + esc(EngCal.fmt(it.due)) + '</span><span class="rv-st st-' + Review.status(it) + '">' + esc(tr('rvSt_' + Review.status(it))) + '</span></div>'; });
      h += '</div>';
    }
    return h + '</div>';
  };

  function tile(ic, l, v, cls) { return '<div class="stat-tile ' + cls + '"><div class="st-l">' + ic + esc(l) + '</div><div class="st-v">' + v + '</div></div>'; }

  function renderCard() {
    var st = $('#rvStage'); if (!st) return;
    if (idx >= queue.length) {
      st.innerHTML = '<div class="rv-done">' + IC.check + '<h3>' + esc(tr('rvSessionDone', { n: done })) + '</h3><p>' + esc(tr('rvSessionDoneS')) + '</p><button class="btn btn-primary" data-go="today">' + esc(tr('todayPage')) + IC.arrowR + '</button></div>';
      return;
    }
    var it = queue[idx], c = Review.card(it);
    if (!c) { Review.remove(it.kind, it.ref); idx++; renderCard(); return; }
    st.innerHTML = '<div class="rv-card' + (shown ? ' show' : '') + '">' +
      '<div class="rv-top"><span class="chip">' + esc(tr('rvKind_' + it.kind)) + '</span><span class="rv-prog">' + (idx + 1) + ' / ' + queue.length + '</span>' + (it.lapses ? '<span class="chip hot">' + esc(tr('rvLapses', { n: it.lapses })) + '</span>' : '') + '</div>' +
      '<div class="rv-front"><b>' + esc(c.front) + '</b>' + (c.sub ? '<span>' + esc(c.sub) + '</span>' : '') + '</div>' +
      '<div class="rv-back">' + esc(c.back).replace(/\n/g, '<br>') + (c.route ? '<div class="sync-actions" style="margin-top:10px"><button class="btn btn-ghost btn-sm" data-go="' + esc(c.route) + '">' + IC.arrowR + esc(tr('rvOpenSource')) + '</button></div>' : '') + '</div>' +
      (shown
        ? '<div class="rv-grade"><button class="btn btn-ghost" data-grade="0">' + esc(tr('rvAgain')) + '<small>1 ' + esc(tr('days')) + '</small></button><button class="btn btn-primary" data-grade="1">' + esc(tr('rvGood')) + '<small>' + nextIvl(it, 1) + ' ' + esc(tr('days')) + '</small></button><button class="btn btn-ghost" data-grade="2">' + esc(tr('rvEasy')) + '<small>' + nextIvl(it, 2) + ' ' + esc(tr('days')) + '</small></button></div>'
        : '<div class="rv-grade"><button class="btn btn-primary btn-lg" id="rvShow">' + IC.eye + esc(tr('rvShow')) + '</button></div>') +
      '</div>';
    var sb = $('#rvShow'); if (sb) sb.addEventListener('click', function () { shown = true; renderCard(); });
    $$('[data-grade]', st).forEach(function (b) {
      b.addEventListener('click', function () { Review.rate(it.id, Number(b.dataset.grade)); done++; idx++; shown = false; renderCard(); });
    });
  }
  function nextIvl(it, g) { var IV = [1, 3, 7, 14, 30, 60]; return IV[Math.min(IV.length - 1, (it.ivl || 0) + (g === 2 ? 2 : 1))]; }

  window.PageReview.mount = function () {
    queue = Review.due().slice(0, 40); idx = 0; shown = false; done = 0;
    renderCard();
    document.addEventListener('keydown', onKey);
  };
  function onKey(e) {
    if (!$('#rvStage')) { document.removeEventListener('keydown', onKey); return; }
    if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === ' ' && !shown) { e.preventDefault(); shown = true; renderCard(); }
    else if (shown && /^[123]$/.test(e.key)) { var b = $('[data-grade="' + (Number(e.key) - 1) + '"]'); if (b) b.click(); }
  }
})();
