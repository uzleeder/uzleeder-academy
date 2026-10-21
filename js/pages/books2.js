/* ==========================================================================
   Kitoblar moduli — 2-qism (2026-09-20 dan qo'shilgan sahifalar)
   --------------------------------------------------------------------------
     #/books/dict/3/7      — diktant mashqi (Target Listening 1, 3-test, 7-mashq)
     #/books/vocab         — Destination B2 markazi (kunlik bo'lim, 14 unit)
     #/books/dest/4/phrasal — Destination B2 uniti, bo'lim (ro'yxat, test, daftar)
     ReadTools             — o'qish varag'ining tahrir paneli: so'z belgilash →
                             daftar, varaq rangi, shrift, kenglik, fokus
     #/copy/free           — erkin daftar (bo'linmagan katta varaq, o'z nomi)
     #/copy/free/<id>      — erkin daftar muharriri

   Nega alohida fayl: books.js 900+ qator; bu yerdagilar mustaqil — faqat
   Books.* (reja) va Store ga tayanadi.
   ========================================================================== */
(function () {
  'use strict';

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div>' +
      '<h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }
  /* Deterministik tasodif — bir kunda bir xil test */
  function rng(seed) { var x = seed % 2147483647; if (x <= 0) x += 2147483646; return function () { x = x * 16807 % 2147483647; return (x - 1) / 2147483646; }; }
  function shuffle(arr, r) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* Javobni taqqoslash uchun: kichik harf, apostrof bir xil, tinish yo'q */
  function normWord(w) { return String(w || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9'\-]/g, ''); }

  /* ====================== DIKTANT MASHQI ============================== */

  /* "[so'z]" → input; qolgani matn. Har qator: "M: …" */
  function dictParse(t) {
    var lines = t.split('\n'), out = [], k = 0;
    lines.forEach(function (line) {
      var parts = [], re = /\[([^\]]+)\]/g, last = 0, m;
      while ((m = re.exec(line))) {
        if (m.index > last) parts.push({ t: line.slice(last, m.index) });
        parts.push({ b: m[1], i: k++ });
        last = m.index + m[0].length;
      }
      if (last < line.length) parts.push({ t: line.slice(last) });
      out.push(parts);
    });
    return { lines: out, blanks: k };
  }

  window.PageBookDict = function (t, e) {
    var D = window.ENG_DICT;
    var ex = window.Books ? Books.dictEx(t, e) : null;
    if (!D || !ex) return '<div class="page empty"><h3>404</h3><p>Test ' + t + ' · ' + e + '</p><button class="btn btn-primary" style="margin-top:18px" data-go="books/listen">' + esc(tr('engSkillListening')) + '</button></div>';
    var P = dictParse(ex.t), rec = Books.dictRec(t, e), rid = 'dic:' + t + ':' + e;
    var lp = Books.dictPlan(Books.today());
    var isToday = Books.dictInDay(lp, t, e);

    var h = '<div class="page stagger dict-page">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(tr('engSkillListening')) + ' · ' + esc(D.meta.short) + ' · Test ' + t + '</div>' +
      '<h1>' + esc(tr('booksDictN1', { n: e })) + ' — Track ' + ex.track + '</h1>' +
      '<div class="lesson-meta">' +
        '<span class="chip topic">' + esc(ex.dur) + '</span>' +
        '<span>' + P.blanks + ' ' + esc(tr('booksDictBlanks')) + '</span>' +
        (isToday ? '<span class="chip lc">' + esc(tr('coursesToday')) + '</span>' : '') +
        (rec && rec.score != null ? '<span class="chip">' + esc(tr('rdLastScore', { s: rec.best != null ? rec.best : rec.score, t: rec.total })) + ' · ' + (rec.attempts || 1) + '×</span>' : '') +
      '</div></header>';

    h += '<div class="callout tip"><span class="co-ic">' + IC.headphones + '</span><div><h4>' + esc(tr('booksDictHowT')) + '</h4>' + esc(tr('booksDictHow2', { n: ex.track })) + '</div></div>';

    /* Matn — bo'sh joylar input */
    h += '<div class="dict-sheet" id="dictSheet" data-rid="' + esc(rid) + '" data-t="' + t + '" data-e="' + e + '">';
    P.lines.forEach(function (parts) {
      h += '<p class="dict-line">';
      parts.forEach(function (x) {
        if (x.t !== undefined) {
          var sp = /^(M|W|[a-e]\.|\([A-E]\)):?\s/.test(x.t) ? x.t.replace(/^((?:M|W|[a-e]\.|\([A-E]\)):?)(\s)/, '<b class="dl-s">$1</b>$2') : esc(x.t);
          h += sp === x.t ? esc(x.t) : sp;
        } else {
          var w = x.b.replace(/[.,!?;:"]+$/, ''), tail = x.b.slice(w.length);
          h += '<span class="dl-b"><input class="dl-in" data-i="' + x.i + '" data-a="' + esc(w) + '" style="width:' + Math.max(4, w.length + 1.5) + 'ch" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="' + (x.i + 1) + '"><i class="dl-ans" hidden>' + esc(w) + '</i></span>' + esc(tail);
        }
      });
      h += '</p>';
    });
    h += '</div>';

    h += '<div class="dict-actions no-print">' +
      '<button class="btn btn-primary" id="dcCheck">' + IC.check + esc(tr('booksDictCheck')) + '</button>' +
      '<button class="btn btn-ghost" id="dcReveal">' + IC.eye + esc(tr('booksShowAnswer')) + '</button>' +
      '<button class="btn btn-ghost" id="dcClear">' + IC.refresh + esc(tr('booksDictClear')) + '</button>' +
      '<span class="dict-score" id="dcScore"></span></div>';

    /* Xato so'zlar → daftar */
    h += '<div class="dict-wrong card" id="dcWrong" hidden><h3 class="card-title"><span class="num">' + IC.alert + '</span>' + esc(tr('booksDictWrongT')) + '</h3><div class="dw-list" id="dcWrongList"></div>' +
      '<div class="sync-actions"><button class="btn btn-ghost btn-sm" id="dcWrongAdd">' + IC.notebook + esc(tr('booksDictWrongAdd')) + '</button></div></div>';

    /* To'liq transkript — yopiq */
    h += '<div class="bk-script"><button class="bs-toggle" data-scripttoggle="1">' + IC.doc + esc(tr('booksShowScript')) + '</button><div class="bs-body" hidden>';
    ex.t.split('\n').forEach(function (line) {
      var m = line.match(/^((?:M|W|[a-e]\.|\([A-E]\)):?)\s(.*)$/);
      h += '<div class="bs-line"><b>' + esc(m ? m[1] : '') + '</b><span>' + esc((m ? m[2] : line).replace(/[\[\]]/g, '')) + '</span></div>';
    });
    h += '</div></div>';

    /* Navigatsiya: oldingi / keyingi mashq (testlar orasida ham) */
    var prev = e > 1 ? [t, e - 1] : (t > 1 ? [t - 1, D.meta.perTest] : null);
    var next = e < D.meta.perTest ? [t, e + 1] : (t < D.meta.tests ? [t + 1, 1] : null);
    h += '<div class="lesson-nav no-print">' +
      (prev ? '<button class="btn btn-ghost" data-go="books/dict/' + prev[0] + '/' + prev[1] + '">' + IC.arrowL + 'Test ' + prev[0] + ' · ' + prev[1] + '</button>' : '<button class="btn btn-ghost" data-go="books/listen">' + IC.arrowL + esc(tr('engSkillListening')) + '</button>') +
      '<button class="btn btn-ghost" data-go="books/listen">' + esc(tr('booksDictPlan')) + '</button>' +
      (next ? '<button class="btn btn-ghost" data-go="books/dict/' + next[0] + '/' + next[1] + '">Test ' + next[0] + ' · ' + next[1] + IC.arrowR + '</button>' : '<span></span>') +
      '</div>';
    return h + '</div>';
  };

  window.PageBookDict.mount = function () {
    var sheet = $('#dictSheet'); if (!sheet) return;
    var ins = $$('.dl-in'), rid = sheet.dataset.rid, t = Number(sheet.dataset.t), e = Number(sheet.dataset.e);
    var wrong = [];
    /* Enter → keyingi bo'sh joy; oxirgisida → tekshir */
    ins.forEach(function (inp, i) {
      inp.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); if (ins[i + 1]) ins[i + 1].focus(); else check(); }
      });
      inp.addEventListener('input', function () { inp.classList.remove('ok', 'bad'); });
    });
    if (ins[0]) ins[0].focus();

    function check() {
      var ok = 0; wrong = [];
      ins.forEach(function (inp) {
        var a = normWord(inp.dataset.a), v = normWord(inp.value);
        /* Qisqartma/to'liq shakl: "I'm" ↔ "I am" kabi farqni kechirmaymiz — audio aynan aytadi */
        var good = v && (v === a || v.replace(/'/g, '') === a.replace(/'/g, ''));
        inp.classList.toggle('ok', good); inp.classList.toggle('bad', !good);
        var ans = inp.parentNode.querySelector('.dl-ans'); if (ans) ans.hidden = good;
        if (good) ok++; else wrong.push({ a: inp.dataset.a, v: inp.value });
      });
      var total = ins.length;
      var prev = Store.readGet(rid) || {};
      Store.readSet(rid, { score: ok, total: total, best: Math.max(ok, prev.best || 0), attempts: (prev.attempts || 0) + 1 });
      $('#dcScore').innerHTML = '<b>' + ok + '</b> / ' + total + ' · ' + Math.round(ok / total * 100) + '%';
      var wl = $('#dcWrongList'), wc = $('#dcWrong');
      if (wrong.length) {
        wl.innerHTML = wrong.map(function (w) { return '<span class="dw-item"><b>' + esc(w.a) + '</b>' + (w.v ? '<s>' + esc(w.v) + '</s>' : '<i>—</i>') + '</span>'; }).join('');
        wc.hidden = false;
      } else wc.hidden = true;
      toast(tr('rdSaved', { s: ok, t: total }), ok / total >= 0.85 ? 'ok' : 'warn');
      if (window.App) App.refreshChrome();
    }
    $('#dcCheck').addEventListener('click', check);
    $('#dcReveal').addEventListener('click', function () {
      ins.forEach(function (inp) { inp.value = inp.dataset.a; inp.classList.remove('bad'); inp.classList.add('ok'); var ans = inp.parentNode.querySelector('.dl-ans'); if (ans) ans.hidden = true; });
      $('#dcScore').textContent = tr('booksDictRevealed');
    });
    $('#dcClear').addEventListener('click', function () {
      ins.forEach(function (inp) { inp.value = ''; inp.classList.remove('ok', 'bad'); var ans = inp.parentNode.querySelector('.dl-ans'); if (ans) ans.hidden = true; });
      $('#dcScore').textContent = ''; $('#dcWrong').hidden = true; if (ins[0]) ins[0].focus();
    });
    $('#dcWrongAdd').addEventListener('click', function () {
      var have = {}; Store.copyList('vocab').forEach(function (x) { have[(x.word || '').toLowerCase()] = 1; });
      var n = 0, seen = {};
      wrong.forEach(function (w) {
        var k = w.a.toLowerCase(); if (have[k] || seen[k] || k.length < 2) return; seen[k] = 1;
        var id = Store.copySet('vocab', { word: w.a, note: tr('booksDictFromNote', { t: t, e: e }), src: 'books/dict/' + t + '/' + e, srcT: 'Test ' + t + ' · ' + tr('booksDictN1', { n: e }) });
        if (window.Review) Review.add('vocab', id); n++;
      });
      toast(tr('copyAdded', { n: n }), 'ok');
    });
    var st = $('[data-scripttoggle]');
    if (st) st.addEventListener('click', function () { var b = st.parentNode.querySelector('.bs-body'); b.hidden = !b.hidden; st.innerHTML = IC.doc + esc(tr(b.hidden ? 'booksShowScript' : 'booksHideScript')); });
  };

  /* ====================== DESTINATION B2 — MARKAZ ===================== */

  function secDone(u, k) { return Store.flag('db2:' + u + ':' + k); }
  function secOf(unit, k) { return (unit.secs.filter(function (x) { return x.k === k; })[0] || { items: [] }); }
  function secName(k) { var D = window.ENG_DEST_B2; var s = D.meta.secs.filter(function (x) { return x.k === k; })[0]; return s ? s.name : k; }

  window.PageBookDest = function () {
    var D = window.ENG_DEST_B2;
    var day = Books.today(), td = ENG_BOOK.destFor(day);
    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(L(ENG_BOOK.meta.title)) + '</div>' +
      '<h1>' + esc(D ? D.meta.title : 'Destination B2') + '</h1>' +
      '<p class="lede">' + esc(tr('booksDestLede')) + '</p></header>';
    if (!D || !td) return h + '</div>';

    var doneSecs = 0, totalSecs = D.units.length * D.meta.secs.length;
    D.units.forEach(function (u) { D.meta.secs.forEach(function (s) { if (secDone(u.n, s.k)) doneSecs++; }); });

    /* Bugungi bo'lim */
    h += sectionHead(1, tr('booksTodayT', { n: day }), 'Unit ' + td.unit + ' · ' + td.secName + (td.pass > 1 ? ' · ' + tr('booksPassN', { n: td.pass }) : ''));
    h += '<div class="bk-today">' +
      '<button class="bk-task vocab" data-go="books/dest/' + td.unit + '/' + td.sec + '"><span class="bt-top">' + IC.book + esc(tr('engSkillVocab')) + '</span>' +
        '<span class="bt-t">Unit ' + td.unit + ' — ' + esc(td.theme) + '</span>' +
        '<span class="bt-m">' + esc(td.secName) + ' · ' + td.items.length + ' ' + esc(tr('booksDestItems')) + (secDone(td.unit, td.sec) ? ' · ' + esc(tr('lsDone')) : '') + '</span>' +
        '<span class="bt-n">' + esc(td.pass > 1 ? tr('booksDestPass2') : tr('booksDestPass1')) + '</span>' + IC.arrowR + '</button>' +
      '<button class="bk-task vocab" data-go="copy/vocab"><span class="bt-top">' + IC.mic + esc(tr('copyVocab')) + '</span>' +
        '<span class="bt-t">' + esc(tr('booksDestCopyT')) + '</span><span class="bt-m">' + esc(tr('booksDestCopyS')) + '</span>' + IC.arrowR + '</button>' +
      '</div>';

    h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span><div><h4>' + esc(tr('booksDestPlanT')) + '</h4>' + esc(tr('booksDestPlanS', { d: EngCal.fmt(Store.shiftDays(ENGLISH.meta.start, D.units.length * D.meta.daysPerUnit - 1)) })) + '</div></div>';
    h += '<div class="callout tip"><span class="co-ic">' + IC.notebook + '</span><div>' + esc(tr('booksDestCredit', { t: D.meta.translation })) + '</div></div>';

    /* 14 unit × 5 bo'lim */
    h += sectionHead(2, tr('booksAllUnits'), doneSecs + ' / ' + totalSecs + ' ' + tr('booksDestSecs'));
    h += '<div class="dest-grid">';
    D.units.forEach(function (u, ui) {
      var isCur = u.n === td.unit;
      h += '<div class="dest-unit' + (isCur ? ' today' : '') + '"><div class="du-h"><b>Unit ' + u.n + '</b><span>' + esc(u.theme) + '</span>' +
        '<i>' + esc(tr('day')) + ' ' + ENG_BOOK.destDayOf(ui, 0) + '–' + ENG_BOOK.destDayOf(ui, D.meta.secs.length - 1) + '</i></div><div class="du-secs">';
      D.meta.secs.forEach(function (s, si) {
        var items = secOf(u, s.k).items.length, dn = secDone(u.n, s.k), cur = isCur && s.k === td.sec;
        h += '<button class="du-sec' + (dn ? ' done' : '') + (cur ? ' cur' : '') + '" data-go="books/dest/' + u.n + '/' + s.k + '" title="' + esc(tr('day')) + ' ' + ENG_BOOK.destDayOf(ui, si) + '">' + (dn ? IC.check : '') + '<span>' + esc(s.name) + '</span><em>' + items + '</em></button>';
      });
      h += '</div></div>';
    });
    h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button><button class="btn btn-ghost" data-go="books/ess4">' + esc(ENG_BOOK.sources[0].title) + IC.arrowR + '</button></div>';
    return h + '</div>';
  };
  window.PageBookDest.mount = function () {};

  /* ====================== DESTINATION B2 — UNIT / BO'LIM ============== */

  window.PageBookDestUnit = function (n, k) {
    var D = window.ENG_DEST_B2;
    var u = D ? D.units.filter(function (x) { return x.n === n; })[0] : null;
    if (!u) return '<div class="page empty"><h3>404</h3><p>Unit ' + n + '</p><button class="btn btn-primary" style="margin-top:18px" data-go="books/vocab">Destination B2</button></div>';
    if (!D.meta.secs.some(function (s) { return s.k === k; })) k = D.meta.secs[0].k;
    var sec = secOf(u, k), ui = D.units.indexOf(u), si = D.meta.secs.map(function (s) { return s.k; }).indexOf(k);
    var day = Books.today(), td = ENG_BOOK.destFor(day), isToday = td && td.unit === n && td.sec === k;
    var hide = !!(Store.setting('destHide')) || (td && td.pass > 1 && isToday);
    var inBook = {}; Store.copyList('vocab').forEach(function (e) { inBook[(e.word || '').toLowerCase()] = 1; });
    var have = sec.items.filter(function (it) { return inBook[it[0].toLowerCase()]; }).length;
    var qz = Store.quizGet('db2:' + n + ':' + k);

    var h = '<div class="page stagger dest-page">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(D.meta.short) + ' · ' + esc(tr('day')) + ' ' + ENG_BOOK.destDayOf(ui, si) + (isToday ? ' · ' + esc(tr('coursesToday')) : '') + '</div>' +
      '<h1>Unit ' + u.n + ' — ' + esc(u.theme) + '</h1>' +
      '<div class="lesson-meta">' +
        (window.bookmarkBtn ? bookmarkBtn('dest:' + n + ':' + k, 'books/dest/' + n + '/' + k, 'Unit ' + n + ' · ' + secName(k), 'vocab') : '') +
        '<span class="chip topic">' + esc(secName(k)) + '</span><span>' + sec.items.length + ' ' + esc(tr('booksDestItems')) + '</span>' +
        (qz ? '<span class="chip">' + esc(tr('booksDestQuiz')) + ' ' + qz.score + '/' + qz.total + '</span>' : '') +
      '</div></header>';

    /* Bo'lim tablari */
    h += '<div class="hub-tabs no-print">' + D.meta.secs.map(function (s) {
      var dn = secDone(n, s.k);
      return '<button class="hub-tab' + (s.k === k ? ' on' : '') + (dn ? ' done' : '') + '" data-go="books/dest/' + n + '/' + s.k + '">' + (dn ? IC.check : IC.book) + '<span>' + esc(s.name) + '</span></button>';
    }).join('') + '</div>';

    h += '<div class="callout tip"><span class="co-ic">' + IC.bulb + '</span><div>' + esc(tr('booksDestHow')) + '</div></div>';

    /* Asboblar */
    h += '<div class="dest-tools no-print">' +
      '<button class="btn btn-ghost btn-sm' + (hide ? ' on' : '') + '" id="dsHide" aria-pressed="' + hide + '">' + IC.eye + esc(hide ? tr('booksDestShowTr') : tr('booksDestHideTr')) + '</button>' +
      '<button class="btn btn-ghost btn-sm" id="dsQuiz">' + IC.target + esc(tr('booksDestQuiz')) + '</button>' +
      '<button class="btn btn-ghost btn-sm" id="dsAddSel" disabled>' + IC.notebook + esc(tr('booksDestAddSel', { n: 0 })) + '</button>' +
      '<button class="btn btn-ghost btn-sm" id="dsAddAll"' + (have === sec.items.length ? ' disabled' : '') + '>' + IC.plus + esc(tr('booksDestAddAll', { n: sec.items.length - have })) + '</button>' +
      '<label class="bq-mark ds-done"><input type="checkbox" id="dsDone"' + (secDone(n, k) ? ' checked' : '') + '> ' + esc(tr('booksDestDone')) + '</label>' +
      '</div>';

    /* Test — yashirin, tugma bilan ochiladi */
    h += '<div class="dest-quiz card" id="dsQuizBox" hidden></div>';

    /* Ro'yxat */
    h += '<div class="dest-list' + (hide ? ' hide-tr' : '') + '" id="dsList">';
    sec.items.forEach(function (it, i) {
      var inB = inBook[it[0].toLowerCase()];
      h += '<label class="dl-row' + (inB ? ' inbook' : '') + '"><input type="checkbox" class="dl-ck" data-i="' + i + '"' + (inB ? ' disabled' : '') + '>' +
        '<span class="dl-n">' + (i + 1) + '</span><b class="dl-w">' + esc(it[0]) + '</b>' +
        '<span class="dl-tr"><span>' + esc(it[1]) + '</span></span>' + (inB ? '<i class="dl-ic">' + IC.notebook + '</i>' : '') + '</label>';
    });
    h += '</div>';

    /* Navigatsiya: oldingi/keyingi bo'lim (unitlar orasida ham) */
    var flat = []; D.units.forEach(function (x) { D.meta.secs.forEach(function (s) { flat.push([x.n, s.k]); }); });
    var idx = ui * D.meta.secs.length + si, prev = flat[idx - 1], next = flat[idx + 1];
    h += '<div class="lesson-nav no-print">' +
      (prev ? '<button class="btn btn-ghost" data-go="books/dest/' + prev[0] + '/' + prev[1] + '">' + IC.arrowL + 'Unit ' + prev[0] + ' · ' + esc(secName(prev[1])) + '</button>' : '<button class="btn btn-ghost" data-go="books/vocab">' + IC.arrowL + 'Destination B2</button>') +
      '<button class="btn btn-ghost" data-go="books/vocab">' + esc(tr('booksAllUnits')) + '</button>' +
      (next ? '<button class="btn btn-ghost" data-go="books/dest/' + next[0] + '/' + next[1] + '">Unit ' + next[0] + ' · ' + esc(secName(next[1])) + IC.arrowR + '</button>' : '<span></span>') +
      '</div>';
    return h + '</div>';
  };

  window.PageBookDestUnit.mount = function (n, k) {
    var D = window.ENG_DEST_B2, u = D.units.filter(function (x) { return x.n === n; })[0]; if (!u) return;
    var sec = secOf(u, k), list = $('#dsList');
    function addItems(items) {
      var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
      var c = 0;
      items.forEach(function (it) {
        if (have[it[0].toLowerCase()]) return;
        var id = Store.copySet('vocab', { word: it[0], tr: it[1], src: 'books/dest/' + n + '/' + k, srcT: 'Unit ' + n + ' · ' + secName(k) });
        if (window.Review) Review.add('vocab', id); c++;
      });
      toast(tr('copyAdded', { n: c }), 'ok'); App.render();
    }
    /* Tarjimani yashirish — o'zini tekshirish; bosilsa bitta qator ochiladi */
    $('#dsHide').addEventListener('click', function () {
      var on = !list.classList.contains('hide-tr');
      list.classList.toggle('hide-tr', on); Store.setSetting('destHide', on);
      this.innerHTML = IC.eye + esc(on ? tr('booksDestShowTr') : tr('booksDestHideTr')); this.classList.toggle('on', on); this.setAttribute('aria-pressed', on);
    });
    $$('.dl-tr').forEach(function (el) { el.addEventListener('click', function (ev) { if (list.classList.contains('hide-tr')) { ev.preventDefault(); el.classList.toggle('peek'); } }); });
    /* Tanlanganlar → daftar */
    var selBtn = $('#dsAddSel');
    function selCount() { var n2 = $$('.dl-ck:checked').length; selBtn.disabled = !n2; selBtn.innerHTML = IC.notebook + esc(tr('booksDestAddSel', { n: n2 })); }
    $$('.dl-ck').forEach(function (c) { c.addEventListener('change', selCount); });
    selBtn.addEventListener('click', function () { addItems($$('.dl-ck:checked').map(function (c) { return sec.items[Number(c.dataset.i)]; })); });
    $('#dsAddAll').addEventListener('click', function () { addItems(sec.items); });
    $('#dsDone').addEventListener('change', function () { Store.setFlag('db2:' + n + ':' + k, this.checked); toast(tr('saved'), 'ok'); App.refreshChrome(); });

    /* Mini test: 10 ta so'z → 4 tarjimadan birini tanla (kunga bog'liq urug') */
    $('#dsQuiz').addEventListener('click', function () {
      var box = $('#dsQuizBox'); if (!box.hidden) { box.hidden = true; return; }
      var r = rng(Books.today() * 131 + n * 17 + (D.meta.secs.map(function (s) { return s.k; }).indexOf(k) + 1) * 7);
      var pool = sec.items.filter(function (it) { return it[1].length < 60; });
      var qs = shuffle(pool, r).slice(0, Math.min(10, pool.length));
      var h = '<h3 class="card-title"><span class="num gold">' + IC.target + '</span>' + esc(tr('booksDestQuiz')) + ' · ' + qs.length + '</h3><p class="hint">' + esc(tr('booksDestQuizS')) + '</p>';
      qs.forEach(function (q, qi) {
        var opts = shuffle(pool.filter(function (x) { return x !== q; }), r).slice(0, 3).concat([q]);
        opts = shuffle(opts, r);
        h += '<div class="dq-row" data-a="' + esc(q[1]) + '"><div class="dq-q"><span class="bq-n">' + (qi + 1) + '</span><b>' + esc(q[0]) + '</b></div><div class="dq-opts">' +
          opts.map(function (o) { return '<button class="dq-opt" data-v="' + esc(o[1]) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
      });
      h += '<div class="sync-actions"><span class="rd-sc"><b id="dqScore">0</b> / ' + qs.length + '</span><button class="btn btn-primary btn-sm" id="dqSave">' + IC.check + esc(tr('rdSaveScore')) + '</button></div>';
      box.innerHTML = h; box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var score = 0, answered = 0, wrongItems = [];
      $$('.dq-opt', box).forEach(function (b) {
        b.addEventListener('click', function () {
          var row = b.closest('.dq-row'); if (row.dataset.done) return; row.dataset.done = '1';
          var good = b.dataset.v === row.dataset.a; answered++;
          b.classList.add(good ? 'ok' : 'bad');
          if (!good) { $$('.dq-opt', row).forEach(function (x) { if (x.dataset.v === row.dataset.a) x.classList.add('ok'); }); wrongItems.push(row.querySelector('b').textContent); }
          else score++;
          $('#dqScore').textContent = score;
        });
      });
      $('#dqSave').addEventListener('click', function () {
        Store.quizSet('db2:' + n + ':' + k, score, qs.length);
        wrongItems.forEach(function (w) {
          var it = sec.items.filter(function (x) { return x[0] === w; })[0]; if (!it) return;
          Store.addMistake2('vocab', 'db2:' + n + ':' + k + ':' + w, { q: it[0], chosen: '—', correct: it[1], topic: 'Unit ' + n + ' · ' + secName(k), route: 'books/dest/' + n + '/' + k, why: '' });
        });
        toast(tr('rdSaved', { s: score, t: qs.length }), score / qs.length >= 0.85 ? 'ok' : 'warn'); App.refreshChrome();
      });
    });
  };

  /* ====================== O'QISH VARAG'I — TAHRIR PANELI ===============
     Har o'qish sahifasining tepasida: (1) belgilash rejimi — matndan so'z
     tanlansa daftarga (C-book) qo'shiladi va varaqda sariq bo'lib qoladi;
     (2) varaq rangi — faqat matn uchun (ko'zga qulay qog'oz ranglari);
     (3) shrift o'lchami, serif, kenglik, fokus. Sozlama hamma matnga
     umumiy (Store.setting 'readSheet'); belgilar matnga xos (read[rid].marks). */
  var THEMES = ['white', 'sepia', 'green', 'gray', 'night'];
  function rsCfg() { return Object.assign({ theme: 'white', size: 17, serif: true, wide: false, focus: false, lh: 1.7 }, Store.setting('readSheet') || {}); }
  function rsSave(patch) { Store.setSetting('readSheet', Object.assign(rsCfg(), patch)); }
  function sheetClass(c) { c = c || rsCfg(); return ' paper-' + c.theme + (c.serif ? ' serif' : ' sans') + (c.wide ? ' wide' : '') + (c.focus ? ' focus' : ''); }
  function applySheet() {
    var a = $('#bkPassage'); if (!a) return;
    var c = rsCfg();
    a.className = 'bk-passage' + sheetClass(c);
    a.style.setProperty('--rd-size', c.size + 'px'); a.style.setProperty('--rd-lh', c.lh);
    $$('[data-rtheme]').forEach(function (b) { b.classList.toggle('on', b.dataset.rtheme === c.theme); });
    var sz = $('#rtSize'); if (sz) sz.textContent = c.size;
    $$('[data-rtog]').forEach(function (b) { b.classList.toggle('on', !!c[b.dataset.rtog]); b.setAttribute('aria-pressed', !!c[b.dataset.rtog]); });
  }
  function highlight(text, marks) {
    var out = esc(text);
    if (!marks || !marks.length) return out;
    var words = marks.map(function (m) { return (m.w || m).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).filter(Boolean);
    if (!words.length) return out;
    var re = new RegExp('(^|[^A-Za-z’\'-])(' + words.join('|') + ')(?![A-Za-z’\'-])', 'gi');
    return out.replace(re, function (_, pre, w) { return pre + '<mark class="rd-mk">' + w + '</mark>'; });
  }
  window.ReadTools = {
    sheetClass: function () { var c = rsCfg(); return sheetClass(c) + '" style="--rd-size:' + c.size + 'px;--rd-lh:' + c.lh; },
    highlight: highlight,
    panel: function (rid) {
      var c = rsCfg();
      return '<div class="rd-tools no-print" id="rdTools" data-rid="' + esc(rid) + '">' +
        '<div class="rt-g"><button class="btn btn-sm rt-mark" id="rtMark" aria-pressed="false">' + IC.pen + esc(tr('rtMark')) + '</button><span class="rt-hint" id="rtHint">' + esc(tr('rtMarkHint')) + '</span></div>' +
        '<div class="rt-g"><span class="rt-l">' + esc(tr('rtTheme')) + '</span><div class="rt-themes">' + THEMES.map(function (t) { return '<button class="rt-th th-' + t + (c.theme === t ? ' on' : '') + '" data-rtheme="' + t + '" title="' + esc(tr('rtTh_' + t)) + '" aria-label="' + esc(tr('rtTh_' + t)) + '"></button>'; }).join('') + '</div></div>' +
        '<div class="rt-g"><span class="rt-l">' + esc(tr('rtFont')) + '</span><button class="btn btn-quiet btn-sm" data-rsize="-1">A−</button><b class="rt-size" id="rtSize">' + c.size + '</b><button class="btn btn-quiet btn-sm" data-rsize="1">A+</button>' +
          '<button class="btn btn-quiet btn-sm' + (c.serif ? ' on' : '') + '" data-rtog="serif" aria-pressed="' + c.serif + '">Serif</button>' +
          '<button class="btn btn-quiet btn-sm' + (c.wide ? ' on' : '') + '" data-rtog="wide" aria-pressed="' + c.wide + '">' + esc(tr('rtWide')) + '</button>' +
          '<button class="btn btn-quiet btn-sm' + (c.focus ? ' on' : '') + '" data-rtog="focus" aria-pressed="' + c.focus + '">' + esc(tr('rtFocus')) + '</button></div>' +
        '</div>';
    },
    marksList: function (rid, marks, r) {
      var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
      return '<div class="rd-marks" id="rdMarks"><div class="gc-l">' + IC.pen + ' ' + esc(tr('rtMarksT')) + ' · <b id="rdMarksN">' + marks.length + '</b></div>' +
        '<div class="rm-list" id="rdMarksList">' + marks.map(function (m) { return '<span class="rm-chip' + (have[(m.w || '').toLowerCase()] ? ' inbook' : '') + '" data-w="' + esc(m.w) + '"><b>' + esc(m.w) + '</b><button data-rmdel="' + esc(m.w) + '" title="' + esc(tr('delete')) + '">' + IC.close + '</button></span>'; }).join('') + '</div>' +
        '<p class="hint" id="rdMarksHint"' + (marks.length ? ' hidden' : '') + '>' + esc(tr('rtMarksEmpty')) + '</p></div>';
    },
    mount: function () {
      var tools = $('#rdTools'), art = $('#bkPassage'); if (!tools || !art) return;
      var rid = tools.dataset.rid;
      applySheet();
      $$('[data-rtheme]').forEach(function (b) { b.addEventListener('click', function () { rsSave({ theme: b.dataset.rtheme }); applySheet(); }); });
      $$('[data-rsize]').forEach(function (b) { b.addEventListener('click', function () { var c = rsCfg(); rsSave({ size: Math.min(24, Math.max(14, c.size + Number(b.dataset.rsize))) }); applySheet(); }); });
      $$('[data-rtog]').forEach(function (b) { b.addEventListener('click', function () { var c = rsCfg(), p = {}; p[b.dataset.rtog] = !c[b.dataset.rtog]; rsSave(p); applySheet(); }); });

      /* --- Belgilash rejimi --- */
      var markBtn = $('#rtMark'), on = false, pop = null;
      var title = (document.querySelector('.lesson-head h1') || {}).textContent || '';
      function marksOf() { var s = Store.readGet(rid) || {}; return s.marks || []; }
      function rerender() {
        var marks = marksOf();
        var paras = window.__rdParas || [];
        $$('.bp-para p', art).forEach(function (p, i) { if (paras[i]) p.innerHTML = highlight(paras[i].t, marks); });
        var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
        var list = $('#rdMarksList'); if (list) list.innerHTML = marks.map(function (m) { return '<span class="rm-chip' + (have[(m.w || '').toLowerCase()] ? ' inbook' : '') + '" data-w="' + esc(m.w) + '"><b>' + esc(m.w) + '</b><button data-rmdel="' + esc(m.w) + '">' + IC.close + '</button></span>'; }).join('');
        var n = $('#rdMarksN'); if (n) n.textContent = marks.length;
        var hint = $('#rdMarksHint'); if (hint) hint.hidden = !!marks.length;
      }
      function closePop() { if (pop) { pop.remove(); pop = null; } }
      function addMark(word, sentence, toBook) {
        var marks = marksOf();
        if (!marks.some(function (m) { return m.w.toLowerCase() === word.toLowerCase(); })) marks.push({ w: word, at: Date.now() });
        Store.readSet(rid, { marks: marks });
        if (toBook) {
          var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
          if (!have[word.toLowerCase()]) {
            var id = Store.copySet('vocab', { word: word, ex: sentence, src: 'books/' + rid, srcT: title });
            if (window.Review) Review.add('vocab', id);
            toast(tr('rtAdded', { w: word }), 'ok');
          } else toast(tr('rtInBook', { w: word }), 'warn');
        }
        rerender(); closePop();
      }
      markBtn.addEventListener('click', function () {
        on = !on; markBtn.classList.toggle('on', on); markBtn.setAttribute('aria-pressed', on); art.classList.toggle('marking', on);
        $('#rtHint').textContent = on ? tr('rtMarkOn') : tr('rtMarkHint');
        if (!on) closePop();
      });
      function onSelect() {
        if (!on) return;
        var sel = window.getSelection(); if (!sel || sel.isCollapsed) return;
        var txt = sel.toString().trim().replace(/[.,;:!?"()]+$/g, '').replace(/^[("]+/, '');
        if (!txt || txt.split(/\s+/).length > 3 || !/^[A-Za-z][A-Za-z’'\- ]*$/.test(txt)) return;
        var node = sel.anchorNode; var p = node && (node.nodeType === 3 ? node.parentNode : node); p = p && p.closest ? p.closest('.bp-para p') : null;
        if (!p || !art.contains(p)) return;
        var full = p.textContent, i = full.toLowerCase().indexOf(txt.toLowerCase());
        var sentence = '';
        if (i >= 0) { var s0 = full.lastIndexOf('. ', i) + 1, s1 = full.indexOf('. ', i); sentence = full.slice(s0 < 0 ? 0 : s0, s1 < 0 ? full.length : s1 + 1).trim(); }
        var rect = sel.getRangeAt(0).getBoundingClientRect(), arect = art.getBoundingClientRect();
        closePop();
        pop = document.createElement('div'); pop.className = 'rt-pop';
        pop.innerHTML = '<b>' + esc(txt) + '</b><div class="rt-pop-s">' + esc(sentence.slice(0, 140)) + (sentence.length > 140 ? '…' : '') + '</div>' +
          '<div class="rt-pop-a"><button class="btn btn-primary btn-sm" data-act="book">' + IC.notebook + esc(tr('rtToBook')) + '</button><button class="btn btn-ghost btn-sm" data-act="mark">' + IC.pen + esc(tr('rtOnlyMark')) + '</button><button class="btn btn-quiet btn-sm" data-act="x">' + IC.close + '</button></div>';
        pop.style.left = Math.max(0, Math.min(rect.left - arect.left, art.clientWidth - 300)) + 'px';
        pop.style.top = (rect.bottom - arect.top + 8) + 'px';
        art.appendChild(pop);
        pop.addEventListener('mousedown', function (ev) { ev.stopPropagation(); });
        pop.addEventListener('click', function (ev) {
          var b = ev.target.closest('[data-act]'); if (!b) return;
          if (b.dataset.act === 'book') addMark(txt, sentence, true);
          else if (b.dataset.act === 'mark') addMark(txt, sentence, false);
          else closePop();
        });
      }
      art.addEventListener('mouseup', function () { setTimeout(onSelect, 10); });
      art.addEventListener('touchend', function () { setTimeout(onSelect, 300); });
      document.addEventListener('mousedown', function (ev) { if (pop && !pop.contains(ev.target)) closePop(); });
      /* Belgini olib tashlash */
      var ml = $('#rdMarks');
      if (ml) ml.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-rmdel]'); if (!b) return;
        Store.readSet(rid, { marks: marksOf().filter(function (m) { return m.w !== b.dataset.rmdel; }) }); rerender();
      });
    }
  };

  /* ====================== ERKIN DAFTAR ================================ */

  function freeList() { return Store.copyList('free'); }
  function wc(t) { return (t || '').split(/\s+/).filter(Boolean).length; }

  window.PageCopyFree = function () {
    var list = freeList();
    var h = '<div class="page stagger free-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('copyT')) + '</div>' +
      '<h1>' + esc(tr('copyFree')) + '</h1><p class="lede">' + esc(tr('copyFreeLede')) + '</p>' +
      '<div class="cb-tools"><input class="input" id="fnTitle" placeholder="' + esc(tr('copyFreeTitlePh')) + '" maxlength="80">' +
      '<button class="btn btn-primary btn-sm" id="fnNew">' + IC.plus + esc(tr('copyFreeNew')) + '</button></div></header>';
    h += '<div class="free-grid">';
    if (!list.length) h += '<div class="cb-empty">' + IC.notebook + '<p>' + esc(tr('copyFreeEmpty')) + '</p></div>';
    list.forEach(function (e) {
      h += '<button class="free-card" data-go="copy/free/' + esc(e.id) + '"><b>' + esc(e.title || tr('copyFreeUntitled')) + '</b>' +
        '<span class="fc-m">' + esc(fmtDate(e.at)) + ' · ' + wc(e.text) + ' ' + esc(tr('engWords')) + '</span>' +
        '<span class="fc-p">' + esc((e.text || '').slice(0, 220)) + '</span></button>';
    });
    h += '</div>';
    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(tr('books')) + '</button><span></span></div>';
    return h + '</div>';
  };
  window.PageCopyFree.mount = function () {
    var inp = $('#fnTitle'), btn = $('#fnNew'); if (!btn) return;
    function make() {
      var t = (inp.value || '').trim() || tr('copyFreeUntitled');
      var id = Store.copySet('free', { title: t, text: '', created: Date.now() });
      location.hash = '#/copy/free/' + id;
    }
    btn.addEventListener('click', make);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') make(); });
  };

  window.PageFreeNote = function (id) {
    var e = Store.copyGet('free', id);
    if (!e) return '<div class="page empty"><h3>404</h3><p>' + esc(id) + '</p><button class="btn btn-primary" style="margin-top:18px" data-go="copy/free">' + esc(tr('copyFree')) + '</button></div>';
    var mono = !!(Store.setting('freeMono'));
    var h = '<div class="page free-edit" id="freeEdit" data-id="' + esc(id) + '">';
    h += '<div class="fe-bar no-print">' +
      '<button class="btn btn-ghost btn-sm" data-go="copy/free">' + IC.arrowL + esc(tr('copyFree')) + '</button>' +
      '<input class="fe-title" id="feTitle" value="' + esc(e.title || '') + '" placeholder="' + esc(tr('copyFreeTitlePh')) + '" maxlength="80">' +
      '<span class="fe-st" id="feSt">' + esc(fmtDate(e.at)) + '</span>' +
      '<button class="btn btn-quiet btn-sm' + (mono ? ' on' : '') + '" id="feMono" aria-pressed="' + mono + '" title="monospace">{ }</button>' +
      '<button class="btn btn-quiet btn-sm" id="feDl" title="' + esc(tr('download')) + '">' + IC.download + '</button>' +
      '<button class="btn btn-quiet btn-sm" id="fePrint" title="' + esc(tr('print')) + '">' + IC.doc + '</button>' +
      '<button class="btn btn-quiet btn-sm danger" id="feDel" title="' + esc(tr('delete')) + '">' + IC.trash + '</button>' +
      '</div>';
    h += '<textarea class="fe-text' + (mono ? ' mono' : '') + '" id="feText" spellcheck="false" placeholder="' + esc(tr('copyFreePh')) + '">' + esc(e.text || '') + '</textarea>';
    h += '<div class="fe-foot no-print"><span id="feCount">' + wc(e.text) + ' ' + esc(tr('engWords')) + ' · ' + (e.text || '').length + ' ' + esc(tr('copyFreeChars')) + '</span><span class="hint">' + esc(tr('copyFreeAutosave')) + '</span></div>';
    return h + '</div>';
  };
  window.PageFreeNote.mount = function () {
    var root = $('#freeEdit'); if (!root) return;
    var id = root.dataset.id, ta = $('#feText'), tt = $('#feTitle'), st = $('#feSt'), cnt = $('#feCount'), tm = null;
    function fit() { ta.style.height = 'auto'; ta.style.height = Math.max(ta.scrollHeight + 4, window.innerHeight * 0.6) + 'px'; }
    function save() {
      var e = Store.copyGet('free', id); if (!e) return;
      Store.copySet('free', Object.assign(e, { title: tt.value.trim(), text: ta.value }));
      st.textContent = tr('saved') + ' · ' + fmtDate(Date.now());
      cnt.textContent = wc(ta.value) + ' ' + tr('engWords') + ' · ' + ta.value.length + ' ' + tr('copyFreeChars');
    }
    function queue() { clearTimeout(tm); tm = setTimeout(save, 500); st.textContent = '…'; }
    ta.addEventListener('input', function () { queue(); fit(); });
    tt.addEventListener('input', queue);
    /* Tab → 2 bo'sh joy (matematik formulalar, jadvallar uchun) */
    ta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Tab') { ev.preventDefault(); var s = ta.selectionStart, e2 = ta.selectionEnd; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(e2); ta.selectionStart = ta.selectionEnd = s + 2; queue(); }
    });
    fit(); ta.focus();
    $('#feMono').addEventListener('click', function () { var on = !ta.classList.contains('mono'); ta.classList.toggle('mono', on); this.classList.toggle('on', on); Store.setSetting('freeMono', on); });
    $('#feDl').addEventListener('click', function () {
      save();
      var blob = new Blob([ta.value], { type: 'text/plain;charset=utf-8' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = (tt.value.trim() || 'daftar') + '.txt'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    $('#fePrint').addEventListener('click', function () { save(); window.print(); });
    $('#feDel').addEventListener('click', function () {
      if (!confirm(tr('copyFreeDelQ'))) return;
      Store.copyDel('free', id); location.hash = '#/copy/free';
    });
    window.addEventListener('hashchange', function once() { clearTimeout(tm); save(); window.removeEventListener('hashchange', once); });
  };
})();
