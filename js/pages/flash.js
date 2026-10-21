/* ==========================================================================
   Flashcards (#/flash) — lug'atni eslab qolish uchun ag'dariladigan kartalar
   --------------------------------------------------------------------------
   Manbalar (deck):
     copy   — mening daftarim (so'z → tarjima/sinonim/misol/izoh)
     due    — SRS bo'yicha muddati kelganlar (daftar + kitob so'zlari)
     unit   — kitob uniti 1–30 (faqat sinonim + misol — kitob qoidasi)
     topic  — mavzuli to'plam (ENG_VOCAB: o'zbekcha + kollokatsiya + misol)
   Yo'nalish: EN → ma'no (standart) yoki ma'no → EN (retrieval qiyinroq).
   Har karta: ochish (Space) → baholash Again/Good/Easy (1/2/3) → SRS.
   Daftar so'zi — review 'vocab:<id>'; kitob/mavzu so'zi — 'bw:u<n>:<w>'.
   Sessiya oxirida: nechta, qanchasi oson, xatolar ro'yxati.
   ========================================================================== */
(function () {
  'use strict';

  var sess = null;   // { deck:[...], i, shown, res:{again,good,easy}, dir, wrong:[] }

  function unitWords(n) {
    var u = window.Books ? Books.vocabUnit(n) : null; if (!u) return [];
    return u.words.map(function (w) { return { key: 'u' + n + ':' + w.w, w: w.w, pos: w.pos, syn: w.syn, ex: w.ex, route: 'books/v' + n, src: tr('booksUnitN', { n: n }) }; });
  }
  function topicWords(k) {
    var t = window.ENG_VOCAB && ENG_VOCAB[k]; if (!t) return [];
    return t.words.map(function (w) { return { key: 't' + k + ':' + w.w, w: w.w, uz: w.uz, col: w.col, ex: w.ex, route: 'eng-vocab', src: L(t.name) }; });
  }
  function copyWords() {
    return Store.copyList('vocab').filter(function (e) { return (e.word || '').trim(); }).map(function (e) {
      return { key: 'c:' + e.id, rid: 'vocab:' + e.id, w: e.word, ipa: e.ipa, uz: e.tr, syn: e.syn ? e.syn.split(/,\s*/) : [], ex: e.ex, note: e.note, route: 'copy/vocab', src: tr('copyVocab') };
    });
  }
  function reviewId(c) { return c.rid || ('bw:' + c.key); }

  window.Flash = {
    /* Review.card uchun: "u3:aroma" / "teducation:literacy" → so'z obyekti */
    lookup: function (ref) {
      var m = String(ref).match(/^([ut])([^:]+):(.+)$/); if (!m) return null;
      var list = m[1] === 'u' ? unitWords(Number(m[2])) : topicWords(m[2]);
      return list.filter(function (w) { return w.w === m[3]; })[0] || null;
    }
  };

  function deckFor(src, opt) {
    if (src === 'copy') return copyWords();
    if (src === 'unit') return unitWords(Number(opt) || 1);
    if (src === 'topic') return topicWords(opt || Object.keys(ENG_VOCAB)[0]);
    if (src === 'due') {
      var t = Store.dateKey(), out = [];
      Review.list().forEach(function (it) {
        if (it.due > t) return;
        if (it.kind === 'vocab') { var e = Store.copyGet('vocab', it.ref); if (e && e.word) out.push({ key: 'c:' + e.id, rid: it.id, w: e.word, ipa: e.ipa, uz: e.tr, syn: e.syn ? e.syn.split(/,\s*/) : [], ex: e.ex, note: e.note, route: 'copy/vocab', src: tr('copyVocab') }); }
        else if (it.kind === 'bw') { var w = Flash.lookup(it.ref); if (w) { w.rid = it.id; out.push(w); } }
      });
      return out;
    }
    return [];
  }

  window.PageFlash = function () {
    var s = Store.setting('flash') || { src: 'copy', unit: 1, topic: Object.keys(window.ENG_VOCAB || {})[0], dir: 'en', n: 20 };
    var h = '<div class="page stagger fl-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('flKick')) + '</div><h1>' + esc(tr('flashPage')) + '</h1><p class="lede">' + esc(tr('flLede')) + '</p></header>';

    if (sess) { h += sessionHTML(); return h + '</div>'; }

    /* Deck tanlash */
    var counts = { copy: copyWords().length, due: deckFor('due').length };
    var units = []; for (var i = 1; i <= 30; i++) units.push(i);
    var topics = Object.keys(window.ENG_VOCAB || {});
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.cards + '</span>' + esc(tr('flDeck')) + '</h3><div class="fl-src">' +
      [['copy', tr('flSrcCopy'), counts.copy], ['due', tr('flSrcDue'), counts.due], ['unit', tr('flSrcUnit'), 20], ['topic', tr('flSrcTopic'), '']].map(function (x) {
        return '<button class="fl-src-b' + (s.src === x[0] ? ' on' : '') + '" data-flsrc="' + x[0] + '"><b>' + esc(x[1]) + '</b>' + (x[2] !== '' ? '<span>' + x[2] + ' ' + esc(tr('engWords')) + '</span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="fl-opts">' +
        (s.src === 'unit' ? '<label>' + esc(tr('booksUnit')) + ' <select class="input sm" data-flopt="unit">' + units.map(function (n) { return '<option value="' + n + '"' + (Number(s.unit) === n ? ' selected' : '') + '>' + n + ' — ' + esc(L((Books.vocabUnit(n) || {}).theme || '')) + '</option>'; }).join('') + '</select></label>' : '') +
        (s.src === 'topic' ? '<label>' + esc(tr('flTopic')) + ' <select class="input sm" data-flopt="topic">' + topics.map(function (k) { return '<option value="' + k + '"' + (s.topic === k ? ' selected' : '') + '>' + esc(L(ENG_VOCAB[k].name)) + '</option>'; }).join('') + '</select></label>' : '') +
        '<label>' + esc(tr('flDir')) + ' <select class="input sm" data-flopt="dir"><option value="en"' + (s.dir === 'en' ? ' selected' : '') + '>' + esc(tr('flDirEn')) + '</option><option value="uz"' + (s.dir === 'uz' ? ' selected' : '') + '>' + esc(tr('flDirUz')) + '</option></select></label>' +
        '<label>' + esc(tr('flCount')) + ' <select class="input sm" data-flopt="n">' + [10, 20, 40, 100].map(function (n) { return '<option value="' + n + '"' + (Number(s.n) === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '<div class="sync-actions"><button class="btn btn-primary" id="flStart">' + IC.play + esc(tr('flStart')) + '</button><span class="hint">' + esc(tr('flKeys')) + '</span></div></div>';

    /* Holat */
    var all = Review.list().filter(function (it) { return it.kind === 'vocab' || it.kind === 'bw'; });
    var st = { new: 0, learning: 0, familiar: 0, mastered: 0, due: 0 }; all.forEach(function (it) { st[Review.status(it)]++; });
    h += '<div class="stat-grid"><div class="stat-tile"><div class="st-l">' + esc(tr('rvSt_due')) + '</div><div class="st-v">' + st.due + '</div></div><div class="stat-tile"><div class="st-l">' + esc(tr('rvSt_learning')) + '</div><div class="st-v">' + st.learning + '</div></div><div class="stat-tile"><div class="st-l">' + esc(tr('rvSt_familiar')) + '</div><div class="st-v">' + st.familiar + '</div></div><div class="stat-tile gold"><div class="st-l">' + esc(tr('rvSt_mastered')) + '</div><div class="st-v">' + st.mastered + '</div></div></div>';
    h += '<p class="hint">' + esc(tr('flHow')) + '</p>';
    return h + '</div>';
  };

  function sessionHTML() {
    var c = sess.deck[sess.i], n = sess.deck.length;
    if (!c) {
      var r = sess.res, tot = r.again + r.good + r.easy;
      var h = '<div class="card fl-end"><h2>' + esc(tr('flDone')) + '</h2><div class="fl-end-grid"><div><b>' + tot + '</b><span>' + esc(tr('flCards')) + '</span></div><div class="ok"><b>' + r.easy + '</b><span>' + esc(tr('rvEasy')) + '</span></div><div><b>' + r.good + '</b><span>' + esc(tr('rvGood')) + '</span></div><div class="bad"><b>' + r.again + '</b><span>' + esc(tr('rvAgain')) + '</span></div></div>';
      if (sess.wrong.length) h += '<div class="gc-l" style="margin-top:14px">' + esc(tr('flWrong')) + '</div><div class="fl-wrong">' + sess.wrong.map(function (w) { return '<span>' + esc(w.w) + (w.uz ? ' — ' + esc(w.uz) : w.syn && w.syn.length ? ' ≈ ' + esc(w.syn[0]) : '') + '</span>'; }).join('') + '</div>';
      h += '<div class="sync-actions" style="margin-top:14px"><button class="btn btn-primary" id="flAgain">' + IC.refresh + esc(tr('flRepeatWrong')) + '</button><button class="btn btn-ghost" id="flExit">' + esc(tr('flBack')) + '</button></div></div>';
      return h;
    }
    var front = sess.dir === 'en' ? '<div class="fl-w">' + esc(c.w) + '</div>' + (c.ipa ? '<div class="fl-ipa">' + esc(c.ipa) + '</div>' : c.pos ? '<div class="fl-ipa">' + esc(c.pos) + '</div>' : '')
      : '<div class="fl-w small">' + esc(c.uz || (c.syn && c.syn.length ? '≈ ' + c.syn.slice(0, 2).join(', ') : '?')) + '</div>' + (c.ex ? '<div class="fl-ex">' + esc(c.ex.replace(new RegExp(c.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), '_____')) + '</div>' : '');
    var back = '<div class="fl-w">' + esc(c.w) + '</div>' + (c.ipa ? '<div class="fl-ipa">' + esc(c.ipa) + '</div>' : '') +
      (c.uz ? '<div class="fl-tr">' + esc(c.uz) + '</div>' : '') +
      (c.syn && c.syn.length ? '<div class="fl-syn">≈ ' + esc(c.syn.join(', ')) + '</div>' : '') +
      (c.col && c.col.length ? '<div class="fl-col">' + c.col.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') +
      (c.ex ? '<div class="fl-ex">' + esc(c.ex) + '</div>' : '') + (c.note ? '<div class="fl-note">' + esc(c.note) + '</div>' : '');
    return '<div class="fl-top"><span class="fl-prog"><i style="width:' + Math.round(sess.i / n * 100) + '%"></i></span><span class="fl-n">' + (sess.i + 1) + ' / ' + n + '</span><span class="fl-srcT">' + esc(c.src || '') + '</span><button class="btn btn-quiet btn-sm" id="flExit">' + IC.close + esc(tr('flExit')) + '</button></div>' +
      '<div class="fl-card' + (sess.shown ? ' flipped' : '') + '" id="flCard" tabindex="0" role="button" aria-pressed="' + sess.shown + '"><div class="fl-in"><div class="fl-face fl-front">' + front + '<div class="fl-tap">' + esc(tr('flTap')) + '</div></div><div class="fl-face fl-back">' + back + '</div></div></div>' +
      '<div class="fl-grade' + (sess.shown ? '' : ' hidden') + '"><button class="btn btn-ghost" data-flg="0"><b>1</b>' + esc(tr('rvAgain')) + '</button><button class="btn btn-primary" data-flg="1"><b>2</b>' + esc(tr('rvGood')) + '</button><button class="btn btn-ghost" data-flg="2"><b>3</b>' + esc(tr('rvEasy')) + '</button></div>';
  }

  function start(deck, dir) {
    sess = { deck: deck, i: 0, shown: false, res: { again: 0, good: 0, easy: 0 }, dir: dir, wrong: [] };
    App.render();
  }
  function grade(g) {
    var c = sess.deck[sess.i]; if (!c) return;
    var id = reviewId(c);
    if (!Store.reviewAll()[id]) { if (c.rid) Review.add('vocab', c.rid.split(':')[1]); else Review.add('bw', c.key); }
    Review.rate(id, g);
    sess.res[g === 0 ? 'again' : g === 1 ? 'good' : 'easy']++;
    if (g === 0) sess.wrong.push(c);
    sess.i++; sess.shown = false; App.render();
  }

  window.PageFlash.mount = function () {
    var s = Store.setting('flash') || { src: 'copy', unit: 1, topic: Object.keys(window.ENG_VOCAB || {})[0], dir: 'en', n: 20 };
    $$('[data-flsrc]').forEach(function (b) { b.addEventListener('click', function () { s.src = b.dataset.flsrc; Store.setSetting('flash', s); App.render(); }); });
    $$('[data-flopt]').forEach(function (sel) { sel.addEventListener('change', function () { s[sel.dataset.flopt] = sel.value; Store.setSetting('flash', s); if (sel.dataset.flopt !== 'dir' && sel.dataset.flopt !== 'n') App.render(); }); });
    var st = $('#flStart'); if (st) st.addEventListener('click', function () {
      var deck = deckFor(s.src, s.src === 'unit' ? s.unit : s.topic);
      if (!deck.length) { toast(tr('flEmpty'), 'warn'); return; }
      deck = deck.slice().sort(function () { return Math.random() - .5; }).slice(0, Number(s.n) || 20);
      start(deck, s.dir);
    });
    var card = $('#flCard'); if (card) { card.addEventListener('click', function () { sess.shown = true; App.render(); }); card.focus(); }
    $$('[data-flg]').forEach(function (b) { b.addEventListener('click', function () { grade(Number(b.dataset.flg)); }); });
    var ex = $('#flExit'); if (ex) ex.addEventListener('click', function () { sess = null; App.render(); });
    var ag = $('#flAgain'); if (ag) ag.addEventListener('click', function () { var w = sess.wrong.slice(), d = sess.dir; if (!w.length) { sess = null; App.render(); return; } start(w, d); });
  };
  document.addEventListener('keydown', function (e) {
    if (!sess || !/^#\/flash/.test(location.hash)) return;
    var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === ' ' || e.key === 'Enter') { if (!sess.shown && sess.deck[sess.i]) { e.preventDefault(); sess.shown = true; App.render(); } }
    else if (sess.shown && /^[123]$/.test(e.key)) { e.preventDefault(); grade(Number(e.key) - 1); }
  });
})();
