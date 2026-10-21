/* ==========================================================================
   Toshbitik (#/etch) — "toshga o'yilgan" xotira: qat'iy takror rejimi
   --------------------------------------------------------------------------
   Oddiy takror (Review) — ochib ko'rish + o'ziga baho. Bu yerda qat'iyroq:
     • FAOL ESLASH majburiy: so'zni yozish (aniq mos kelishi kerak, 6+ harfda
       bitta xatoga ruxsat), tushunchani ≥ 25 belgida o'z so'zi bilan yozish
     • Baho ikkitagina: Bildim / Bilmadim. "Oson" yo'q.
     • Har muvaffaqiyat — bitta chizik (streak +1). 5 ta KETMA-KET chizik →
       tosh O'YILDI (carved): oraliq 30 kun.
     • Bilmadim — streak 0, darz (crack); muddati 1+ kun o'tkazilgan element
       sessiya boshida o'zi darz oladi (streak −1). Tanlov yo'q.
   Ma'lumot Review elementining o'zida: it.streak, it.carved, it.cracks.
   Toshlar: Python konspekt (py), grammatika (grammar), ingliz kuni (eng),
   daftar so'zlari (vocab) va kitob so'zlari (bw).
   ========================================================================== */
(function () {
  'use strict';

  var KINDS = ['py', 'eng', 'grammar', 'vocab', 'bw'];
  var NEED = 5;
  var sess = null;   // { items:[], i, typed, revealed, ok:0, bad:0, cracked:[] }

  function items() { return Review.list().filter(function (it) { return KINDS.indexOf(it.kind) >= 0; }); }
  function isWord(it) { return it.kind === 'vocab' || it.kind === 'bw'; }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9' -]/g, '').replace(/\s+/g, ' ').trim(); }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; } for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function wordOk(typed, answer) { var a = norm(typed), b = norm(answer); if (!a) return false; if (a === b) return true; return b.length >= 6 && lev(a, b) <= 1; }

  /* Muddati o'tganlarga darz — deterministik jazo (kuniga bir marta) */
  function applyCracks() {
    var t = Store.dateKey(), n = 0;
    items().forEach(function (it) {
      if (!it.reps || !it.due || it.due >= t) return;
      var days = Math.round((new Date(t + 'T00:00:00') - new Date(it.due + 'T00:00:00')) / 86400000);
      if (days < 1 || it.crackAt === t) return;
      if ((it.streak || 0) > 0) { it.streak = (it.streak || 0) - 1; it.carved = false; it.cracks = (it.cracks || 0) + 1; n++; }
      it.crackAt = t; it.at = Date.now(); Store.reviewSet(it.id, it);
    });
    return n;
  }

  function dueItems() { var t = Store.dateKey(); return items().filter(function (it) { return it.due <= t && Review.card(it); }); }

  window.Etch = {
    dueCount: function () { return dueItems().length; },
    carvedCount: function () { return items().filter(function (it) { return it.carved; }).length; }
  };

  window.PageEtch = function () {
    var cracked = applyCracks();
    var all = items(), carved = all.filter(function (it) { return it.carved; }), due = dueItems();
    var h = '<div class="page stagger et-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('etKick')) + '</div><h1>' + esc(tr('etchPage')) + '</h1><p class="lede">' + esc(tr('etLede')) + '</p></header>';
    if (cracked) h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(tr('etCrackedN', { n: cracked })) + '</div></div>';

    if (sess && sess.day !== Store.dateKey()) sess = null;   // kechagi sessiya qolib ketmasin
    if (sess) { h += sessionHTML(); return h + '</div>'; }

    h += '<div class="stat-grid" style="margin-bottom:16px">' +
      '<div class="stat-tile gold"><div class="st-l">' + IC.stone + esc(tr('etCarved')) + '</div><div class="st-v">' + carved.length + '<small> / ' + all.length + '</small></div></div>' +
      '<div class="stat-tile ' + (due.length ? 'accent' : '') + '"><div class="st-l">' + IC.refresh + esc(tr('etDueT')) + '</div><div class="st-v">' + due.length + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.alert + esc(tr('etCracks')) + '</div><div class="st-v">' + all.reduce(function (s, it) { return s + (it.cracks || 0); }, 0) + '</div></div></div>';
    h += '<div class="sync-actions" style="margin-bottom:18px"><button class="btn btn-primary" id="etStart"' + (due.length ? '' : ' disabled') + '>' + IC.stone + esc(due.length ? tr('etStart', { n: due.length }) : tr('etNothing')) + '</button><span class="hint">' + esc(tr('etRules')) + '</span></div>';

    /* Tosh devori */
    if (!all.length) h += '<div class="rv-empty">' + IC.stone + '<h3>' + esc(tr('etNone')) + '</h3><p>' + esc(tr('etNoneS')) + '</p></div>';
    else {
      var groups = {}; all.forEach(function (it) { (groups[it.kind] = groups[it.kind] || []).push(it); });
      KINDS.forEach(function (k) {
        if (!groups[k]) return;
        h += '<div class="section-head"><div class="sh-n">' + IC.stone + '</div><div><h2>' + esc(tr('rvKind_' + (k === 'bw' ? 'vocab' : k))) + (k === 'bw' ? ' · ' + esc(tr('flSrcUnit')) : '') + ' · ' + groups[k].length + '</h2></div></div><div class="et-wall">';
        groups[k].sort(function (a, b) { return (b.streak || 0) - (a.streak || 0); }).forEach(function (it) {
          var c = Review.card(it); if (!c) return;
          var s = Math.min(NEED, it.streak || 0), t = Store.dateKey();
          h += '<button class="et-stone' + (it.carved ? ' carved' : '') + (it.crackAt === t && !it.carved ? ' cracked' : '') + (it.due <= t && !it.carved ? ' due' : '') + '" data-go="' + esc(c.route) + '" title="' + esc(c.title) + '">' +
            '<span class="et-t">' + esc(c.front.slice(0, 40)) + '</span><span class="et-marks">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= s ? 'on' : '') + '"></i>'; }).join('') + '</span>' +
            (it.carved ? '<span class="et-badge">' + esc(tr('etCarvedTag')) + '</span>' : '<span class="et-due">' + esc(it.due <= t ? tr('etToday') : EngCal.fmt(it.due)) + '</span>') + '</button>';
        });
        h += '</div>';
      });
    }
    return h + '</div>';
  };

  function sessionHTML() {
    var it = sess.items[sess.i];
    if (!it) {
      return '<div class="card fl-end"><h2>' + esc(tr('etDone')) + '</h2><div class="fl-end-grid" style="grid-template-columns:repeat(3,1fr)"><div><b>' + (sess.ok + sess.bad) + '</b><span>' + esc(tr('flCards')) + '</span></div><div class="ok"><b>' + sess.ok + '</b><span>' + esc(tr('etKnew')) + '</span></div><div class="bad"><b>' + sess.bad + '</b><span>' + esc(tr('etMissed')) + '</span></div></div>' +
        (sess.newCarved.length ? '<div class="callout good" style="margin-top:14px"><span class="co-ic">' + IC.stone + '</span><div>' + esc(tr('etNewCarved', { n: sess.newCarved.length })) + ' ' + esc(sess.newCarved.join(', ')) + '</div></div>' : '') +
        '<div class="sync-actions" style="margin-top:14px"><button class="btn btn-primary" id="etExit">' + esc(tr('flBack')) + '</button></div></div>';
    }
    var c = Review.card(it), word = isWord(it), s = Math.min(NEED, it.streak || 0);
    var h = '<div class="fl-top"><span class="fl-prog"><i style="width:' + Math.round(sess.i / sess.items.length * 100) + '%"></i></span><span class="fl-n">' + (sess.i + 1) + ' / ' + sess.items.length + '</span><span class="et-marks">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= s ? 'on' : '') + '"></i>'; }).join('') + '</span><button class="btn btn-quiet btn-sm" id="etExit">' + IC.close + esc(tr('flExit')) + '</button></div>';
    h += '<div class="card et-card"><div class="et-kind">' + esc(tr('rvKind_' + (it.kind === 'bw' ? 'vocab' : it.kind))) + (c.sub ? ' · ' + esc(c.sub) : '') + '</div>';
    if (word) {
      /* ma'no → so'z: yozish shart */
      h += '<div class="et-q">' + esc(c.back.split('\n').filter(function (l) { return l.trim(); }).slice(0, 3).map(function (l) { return l.replace(new RegExp(c.front.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '_____'); }).join('\n')) + '</div>' +
        '<div class="et-hint">' + esc(tr('etTypeWord', { n: c.front.length, f: c.front.charAt(0) })) + '</div>';
      if (!sess.revealed) h += '<div class="et-in"><input class="input" id="etIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(tr('etWordPh')) + '"><button class="btn btn-primary" id="etCheck">' + IC.check + esc(tr('check')) + '</button></div>';
      else h += '<div class="et-res ' + (sess.lastOk ? 'ok' : 'bad') + '"><b>' + esc(sess.lastOk ? tr('etCorrect') : tr('etWrong')) + '</b><span class="et-ans">' + esc(c.front) + '</span>' + (sess.typed ? '<span class="et-typed">' + esc(tr('etYouTyped')) + ': ' + esc(sess.typed) + '</span>' : '') + '</div><div class="sync-actions"><button class="btn btn-primary" id="etNext">' + esc(tr('next')) + IC.arrowR + '</button></div>';
    } else {
      /* tushuncha: ≥25 belgi yozish, keyin ochish, keyin halol baho */
      h += '<div class="et-q big">' + esc(c.front) + '</div><div class="et-hint">' + esc(tr('etExplain')) + '</div>';
      if (!sess.revealed) h += '<textarea class="textarea" id="etTa" rows="4" placeholder="' + esc(tr('etExplainPh')) + '"></textarea><div class="sync-actions"><button class="btn btn-primary" id="etReveal" disabled>' + IC.eye + esc(tr('etReveal')) + '</button><span class="hint" id="etCnt">0 / 25</span></div>';
      else h += '<div class="et-mine">' + esc(sess.typed) + '</div><div class="et-answer"><div class="gc-l">' + esc(tr('etAnswer')) + '</div>' + esc(c.back).replace(/\n/g, '<br>') + '</div>' +
        '<div class="fl-grade"><button class="btn btn-ghost" data-etg="0"><b>1</b>' + esc(tr('etMissedBtn')) + '</button><button class="btn btn-primary" data-etg="1"><b>2</b>' + esc(tr('etKnewBtn')) + '</button></div>';
    }
    h += '</div>';
    return h;
  }

  function result(ok) {
    var it = sess.items[sess.i];
    var was = it.carved;
    if (ok) { it.streak = (it.streak || 0) + 1; sess.ok++; Review.rate(it.id, 1); }
    else { it.streak = 0; it.cracks = (it.cracks || 0) + 1; it.crackAt = Store.dateKey(); sess.bad++; Review.rate(it.id, 0); }
    var cur = Store.reviewAll()[it.id];
    cur.streak = it.streak; cur.cracks = it.cracks; cur.crackAt = it.crackAt;
    if (it.streak >= NEED) { cur.carved = true; cur.ivl = 4; cur.due = Store.shiftDays(Store.dateKey(), 30); if (!was) sess.newCarved.push((Review.card(it) || {}).front || it.ref); }
    else cur.carved = false;
    Store.reviewSet(it.id, cur);
  }

  window.PageEtch.mount = function () {
    var st = $('#etStart'); if (st) st.addEventListener('click', function () {
      var d = dueItems().sort(function (a, b) { return (a.streak || 0) - (b.streak || 0); });
      sess = { items: d, i: 0, typed: '', revealed: false, ok: 0, bad: 0, newCarved: [], day: Store.dateKey() }; App.render();
    });
    var ex = $('#etExit'); if (ex) ex.addEventListener('click', function () { sess = null; App.render(); });
    var inp = $('#etIn'); if (inp) {
      inp.focus();
      var check = function () { var it = sess.items[sess.i], c = Review.card(it); sess.typed = inp.value; sess.lastOk = wordOk(inp.value, c.front); sess.revealed = true; result(sess.lastOk); App.render(); };
      $('#etCheck').addEventListener('click', check); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    }
    var nx = $('#etNext'); if (nx) { nx.focus(); nx.addEventListener('click', function () { sess.i++; sess.revealed = false; sess.typed = ''; App.render(); }); }
    var ta = $('#etTa'); if (ta) {
      ta.focus();
      ta.addEventListener('input', function () { var n = ta.value.trim().length; $('#etCnt').textContent = n + ' / 25'; $('#etReveal').disabled = n < 25; });
      $('#etReveal').addEventListener('click', function () { sess.typed = ta.value.trim(); sess.revealed = true; App.render(); });
    }
    $$('[data-etg]').forEach(function (b) { b.addEventListener('click', function () { result(b.dataset.etg === '1'); sess.i++; sess.revealed = false; sess.typed = ''; App.render(); }); });
  };
  document.addEventListener('keydown', function (e) {
    if (!sess || !/^#\/etch/.test(location.hash) || !sess.revealed) return;
    var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') return;
    if (/^[12]$/.test(e.key) && $('[data-etg]')) { e.preventDefault(); result(e.key === '2'); sess.i++; sess.revealed = false; sess.typed = ''; App.render(); }
    else if (e.key === 'Enter' && $('#etNext')) { e.preventDefault(); sess.i++; sess.revealed = false; sess.typed = ''; App.render(); }
  });
})();
