/* ==========================================================================
   Quick Repeat (#/quick · #/quick/<n> · #/quick/test) — 10 kunlik General
   English takror kursi (B1+ / pre-IELTS)
   --------------------------------------------------------------------------
   O'z-o'zidan (self-paced): 1-kun doim ochiq; N-kun (N−1)-kun yopilganda.
   Kun = 5 blok (grammar · vocab · reading · listening · speaking) — har biri
   platformadagi mavjud sahifaga olib boradi va shu yerda belgilanadi.
   Yakuniy test — 40 savol (QGen grammar 16 · QGen vocab 12 · ingliz tili
   kunlari testlaridan 12), 70% — sertifikat (Certificate.openGeneric).

   Holat: done["q10:<n>:<skill>"] · done["q10:<n>:done"] · quiz["q10:final"]
          done["q10:cert"] · read["q10-start"] = { at } (boshlangan sana)
   ========================================================================== */
(function () {
  'use strict';

  var Q = window.QUICK10;
  var SK = { grammar: { ic: 'brain', route: 'eng-grammar' }, vocab: { ic: 'book', route: 'eng-vocab' }, reading: { ic: 'doc', route: null }, listening: { ic: 'headphones', route: null }, speaking: { ic: 'mic', route: 'speaking' } };

  function dayDone(n) { return Store.flag('q10:' + n + ':done'); }
  function blockDone(n, k) { return Store.flag('q10:' + n + ':' + k); }
  function blocksDone(n) { return Q.meta.skills.filter(function (k) { return blockDone(n, k); }).length; }
  function isOpen(n) { return n === 1 || dayDone(n - 1); }
  function doneCount() { return Q.days.filter(function (d) { return dayDone(d.n); }).length; }
  function allDone() { return doneCount() >= Q.days.length; }
  function current() { for (var i = 0; i < Q.days.length; i++) if (!dayDone(Q.days[i].n)) return Q.days[i]; return null; }
  function certOk() { var q = Store.quizGet('q10:final'); return !!q && q.best / (q.bestTotal || 1) >= Q.meta.finalTest.pass; }

  window.Quick = { doneCount: doneCount, total: function () { return Q.days.length; }, current: current, allDone: allDone, certOk: certOk, isOpen: isOpen };

  /* ====================== KURS SAHIFASI ================================ */
  window.PageQuick = function () {
    var cur = current(), dn = doneCount(), q = Store.quizGet('q10:final');
    var h = '<div class="page stagger q10-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('coursesKick')) + ' · ' + esc(L(Q.meta.tag)) + '</div>' +
      '<h1>' + esc(L(Q.meta.title)) + '</h1><p class="lede">' + esc(L(Q.meta.lede)) + '</p></header>';

    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.trend + esc(tr('engProgress')) + '</div><div class="st-v">' + dn + '<small> / ' + Q.days.length + '</small></div><div class="bar" style="margin-top:9px"><i style="width:' + Math.round(dn / Q.days.length * 100) + '%"></i></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('spkDaily')) + '</div><div class="st-v" style="font-size:20px">' + esc(L(Q.meta.daily)) + '</div></div>' +
      '<div class="stat-tile ' + (certOk() ? 'gold' : '') + '"><div class="st-l">' + IC.medal + esc(tr('q10FinalT')) + '</div><div class="st-v">' + (q ? q.best + '<small> / ' + q.bestTotal + '</small>' : '—') + '</div><div class="st-note">' + esc(certOk() ? tr('q10CertReady') : tr('q10Pass', { p: Math.round(Q.meta.finalTest.pass * 100) })) + '</div></div>' +
      '</div>';

    if (cur) h += '<button class="today-card" data-go="quick/' + cur.n + '" style="width:100%;text-align:left;cursor:pointer"><span class="tc-day"><span><span class="n">' + cur.n + '</span><br><span class="l">' + esc(tr('day')) + '</span></span></span>' +
      '<span class="tc-body"><span class="tc-eyebrow">' + esc(tr('q10Next')) + ' · ' + blocksDone(cur.n) + '/5</span><span class="tc-title" style="display:block">' + esc(L(cur.title)) + '</span><span class="tc-note">' + esc(clip(L(cur.focus), 140)) + '</span></span><span class="btn btn-primary">' + esc(tr('open')) + IC.arrowR + '</span></button>';
    else h += '<div class="eng-cert' + (certOk() ? ' ready' : '') + '"><div class="ez-ic">' + IC.medal + '</div><div class="ez-b"><h3>' + esc(tr('q10FinalT')) + '</h3><p>' + esc(certOk() ? tr('q10CertReady') : tr('q10AllDone')) + '</p></div>' +
      (certOk() ? '<button class="btn btn-primary" data-q10cert>' + IC.medal + esc(tr('profOpen')) + '</button>' : '<button class="btn btn-primary" data-go="quick/test">' + IC.target + esc(tr('q10TakeTest')) + '</button>') + '</div>';

    h += '<div class="callout why"><span class="co-ic">' + IC.alert + '</span><div><h4>' + esc(tr('q10RuleT')) + '</h4>' + esc(L(Q.meta.rule)) + '</div></div>';

    h += '<div class="q10-days">';
    Q.days.forEach(function (d) {
      var open = isOpen(d.n), done = dayDone(d.n), bd = blocksDone(d.n);
      h += '<button class="q10-day' + (done ? ' done' : open ? ' open' : ' locked') + '" ' + (open ? 'data-go="quick/' + d.n + '"' : 'disabled') + '>' +
        '<span class="qd-n">' + (done ? IC.check : open ? d.n : IC.lock) + '</span>' +
        '<span class="qd-b"><b>' + esc(L(d.title)) + '</b><span>' + d.grammar.map(function (g) { return ENG_GRAMMAR[g] ? L(ENG_GRAMMAR[g].name) : g; }).join(' · ') + '</span></span>' +
        '<span class="qd-p">' + bd + '/5</span></button>';
    });
    h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="course">' + IC.arrowL + esc(tr('courses')) + '</button><span></span></div>';
    return h + '</div>';
  };
  window.PageQuick.mount = function () {
    $$('[data-q10cert]').forEach(function (b) { b.addEventListener('click', openCert); });
  };

  function openCert() {
    var q = Store.quizGet('q10:final');
    Store.setFlag('q10:cert', true);
    Certificate.openGeneric({ file: 'Quick_Repeat', title: tr('q10FinalT'), track: 'UzLeeder · General English', course: L(Q.meta.title), sub: L(Q.meta.tag), score: q ? q.best + ' / ' + q.bestTotal : '', color: { deep: '#1f4e79', mid: '#3a7cc1', gold: '#bd7c1a', ink: '#1e3143', soft: '#5c6f83', line: '#d6e2ee', bg1: '#fbfdff', bg2: '#eaf2fa' } });
  }

  /* ====================== KUN SAHIFASI ================================= */
  window.PageQuickDay = function (n) {
    var d = Q.days.filter(function (x) { return x.n === Number(n); })[0];
    if (!d) return '<div class="page empty"><h3>404</h3><button class="btn btn-primary" data-go="quick">Quick Repeat</button></div>';
    if (!isOpen(d.n)) return '<div class="page empty"><div class="em-ic">' + IC.lock + '</div><h3>' + esc(tr('q10Locked', { n: d.n - 1 })) + '</h3><button class="btn btn-primary" style="margin-top:16px" data-go="quick/' + (d.n - 1) + '">' + esc(tr('day')) + ' ' + (d.n - 1) + IC.arrowR + '</button></div>';
    var done = dayDone(d.n), bd = blocksDone(d.n);
    var h = '<div class="page stagger q10-page">';
    h += '<header class="lesson-head"><div class="crumb">' + esc(L(Q.meta.title)) + '</div><h1>' + esc(L(d.title)) + '</h1>' +
      '<div class="lesson-meta"><span class="chip ' + (done ? 'done' : 'topic') + '">' + esc(tr('day')) + ' ' + d.n + ' / ' + Q.days.length + '</span><span>' + bd + '/5 ' + esc(tr('dashBlocks')) + '</span>' + (done ? '<span class="chip done">✓</span>' : '') + '</div></header>';
    h += '<div class="intro-block">' + esc(L(d.focus)) + '</div>';

    h += '<div class="q10-blocks">';
    Q.meta.skills.forEach(function (k, i) {
      var on = blockDone(d.n, k), s = Eng.skill(k), min = Q.meta.minutes[k];
      var body = '', links = '';
      if (k === 'grammar') {
        body = d.grammar.map(function (g) { var G = ENG_GRAMMAR[g]; return G ? '<a class="q10-link" href="#/eng-grammar" data-anchor="gram-' + esc(g) + '">' + IC.brain + esc(L(G.name)) + '<small>' + esc(L(G.short)) + '</small></a>' : ''; }).join('');
      } else if (k === 'vocab') {
        body = d.vocab.map(function (v) { var V = ENG_VOCAB[v]; return V ? '<a class="q10-link" href="#/eng-vocab" data-anchor="voc-' + esc(v) + '">' + IC.book + esc(L(V.name)) + '<small>' + V.words.length + ' ' + esc(tr('engWords')) + '</small></a>' : ''; }).join('');
        links = '<button class="btn btn-ghost btn-sm" data-go="copy/vocab">' + IC.notebook + esc(tr('copyVocab')) + '</button>';
      } else if (k === 'reading') {
        var r = window.Books ? Books.readingOf(d.reading) : null;
        body = '<button class="q10-link" data-go="books/r' + d.reading + '">' + IC.doc + esc(r ? r.title : tr('booksTextN', { n: d.reading })) + '<small>' + esc(r && r.level ? r.level : 'IELTS') + ' · ' + esc(tr('q10Timed')) + '</small></button>';
      } else if (k === 'listening') {
        var l = window.Books ? Books.listeningOf(d.listening) : null;
        body = '<button class="q10-link" data-go="books/l' + d.listening + '">' + IC.headphones + esc(l ? L(l.title) : tr('day') + ' ' + d.listening) + '<small>' + esc(l ? 'Section ' + l.section : '') + '</small></button>' +
          '<button class="q10-link" data-go="bbc/6min">' + IC.play + 'BBC 6 Minute English<small>' + esc(tr('coursesBBCD')).slice(0, 60) + '</small></button>';
      } else if (k === 'speaking') {
        body = d.speaking.map(function (sn) { var sd = SPEAK30.days[sn - 1]; return sd ? '<div class="q10-q"><b>' + esc(sd.part) + '</b> ' + esc(L(sd.q)) + '</div>' : ''; }).join('');
        links = '<button class="btn btn-ghost btn-sm" data-go="practice/speaking">' + IC.mic + esc(tr('prSrc_speaking')) + '</button>';
      }
      h += '<div class="q10-block k-' + k + (on ? ' on' : '') + '"><div class="qb-head"><span class="qb-ic">' + IC[s.icon] + '</span><div><b>' + (i + 1) + ' · ' + esc(L(s.name)) + '</b><span>' + min + ' ' + esc(tr('engMin')) + ' — ' + esc(L(Q.tasks[k])) + '</span></div>' +
        '<button class="hb-check" data-q10b="' + d.n + ':' + k + '" role="checkbox" aria-checked="' + on + '">' + (on ? IC.check : '') + '</button></div>' +
        '<div class="qb-body">' + body + '</div>' + (links ? '<div class="qb-links">' + links + '</div>' : '') + '</div>';
    });
    h += '</div>';

    /* Kunlik mini-test: bugungi grammatika mavzularidan generator (8 savol) */
    var pool = window.QGen ? QGen.grammar(8, 'all') : [];
    if (pool.length) h += MiniQuiz.render('q10:' + d.n, pool, { title: tr('q10MiniT'), sub: tr('q10MiniS') });

    h += '<div class="card dc-done"><div><b>' + esc(tr('q10CloseT')) + '</b><span class="hint">' + esc(bd >= 5 ? tr('q10CloseOk') : tr('q10CloseNeed', { n: 5 - bd })) + '</span></div>' +
      '<button class="btn ' + (done ? 'btn-ghost' : 'btn-primary') + '" data-q10done="' + d.n + '"' + (!done && bd < 5 ? ' disabled' : '') + '>' + (done ? esc(tr('engDayReopen')) : IC.check + esc(tr('engMarkDone'))) + '</button></div>';

    h += '<div class="lesson-nav no-print">' +
      (d.n > 1 ? '<button class="btn btn-ghost" data-go="quick/' + (d.n - 1) + '">' + IC.arrowL + esc(tr('day') + ' ' + (d.n - 1)) + '</button>' : '<button class="btn btn-ghost" data-go="quick">' + IC.arrowL + 'Quick Repeat</button>') +
      (d.n < Q.days.length ? '<button class="btn btn-ghost" data-go="quick/' + (d.n + 1) + '">' + esc(tr('day') + ' ' + (d.n + 1)) + IC.arrowR + '</button>' : '<button class="btn btn-primary" data-go="quick/test">' + IC.target + esc(tr('q10TakeTest')) + '</button>') + '</div>';
    return h + '</div>';
  };
  window.PageQuickDay.mount = function (n) {
    var d = Q.days.filter(function (x) { return x.n === Number(n); })[0]; if (!d) return;
    $$('[data-q10b]').forEach(function (b) { b.addEventListener('click', function () { Store.setFlag('q10:' + b.dataset.q10b); App.render(); }); });
    $$('[data-q10done]').forEach(function (b) { b.addEventListener('click', function () {
      var k = 'q10:' + b.dataset.q10done + ':done'; Store.setFlag(k);
      if (Store.flag(k)) { toast(tr('engDayDone'), 'ok'); if (!Store.readGet('q10-start')) Store.readSet('q10-start', { at: Date.now() }); }
      App.render(); App.refreshChrome();
    }); });
    /* Cheatsheet ichidagi aniq mavzuga o'tish */
    $$('[data-anchor]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); location.hash = a.getAttribute('href'); setTimeout(function () { var el = document.getElementById(a.dataset.anchor); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120); }); });
    /* MiniQuiz savollari render vaqtida hosil qilingan — MiniQuiz ularni o'zi eslab qoladi */
    MiniQuiz.mount('q10:' + d.n, null, function (score, total) { Store.quizSet('q10:' + d.n, score, total); });
  };

  /* ====================== YAKUNIY TEST ================================= */
  var FT = { qs: [], i: 0, right: 0, wrong: [], bySec: {} };
  function buildFinal() {
    var m = Q.meta.finalTest.mix, qs = [];
    (window.QGen ? QGen.grammar(m.grammar, 'all') : []).forEach(function (q) { q.sec = 'grammar'; qs.push(q); });
    (window.QGen ? QGen.vocab(m.vocab, 'all') : []).forEach(function (q) { q.sec = 'vocab'; qs.push(q); });
    /* O'qish + tinglash o'rniga: ingliz tili kunlarining (1–28) testlaridan umumiy savollar */
    var pool = [];
    (window.ENG_DAYS || []).forEach(function (d) { if (d.d <= 28) (d.quiz || []).forEach(function (q) { pool.push({ q: q.q, opts: q.opts, correct: q.correct, topic: L(d.title), sec: 'general' }); }); });
    pool.sort(function () { return Math.random() - .5; });
    qs = qs.concat(pool.slice(0, m.reading + m.listening));
    qs.sort(function () { return Math.random() - .5; });
    FT.qs = qs.slice(0, Q.meta.finalTest.total); FT.i = 0; FT.right = 0; FT.wrong = []; FT.bySec = {};
  }
  window.PageQuickTest = function () {
    var h = '<div class="page stagger q10-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(L(Q.meta.title)) + '</div><h1>' + esc(tr('q10FinalT')) + '</h1><p class="lede">' + esc(tr('q10FinalS', { n: Q.meta.finalTest.total, p: Math.round(Q.meta.finalTest.pass * 100) })) + '</p></header>';
    if (!allDone()) return h + '<div class="callout pitfall"><span class="co-ic">' + IC.lock + '</span><div>' + esc(tr('q10TestLocked', { n: doneCount(), t: Q.days.length })) + '</div></div><div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="quick">' + IC.arrowL + 'Quick Repeat</button><span></span></div></div>';
    var last = Store.quizGet('q10:final');
    if (last && last.at && Date.now() - last.at < 24 * 3600 * 1000 && !certOk()) h += '<div class="callout tip"><span class="co-ic">' + IC.clock + '</span><div>' + esc(tr('q10Retry', { s: last.score, t: last.total })) + '</div></div>';
    h += '<div id="q10Stage"><div class="card" style="text-align:center"><p class="hint">' + esc(tr('q10FinalMix')) + '</p><button class="btn btn-primary btn-lg" id="q10Start">' + IC.target + esc(tr('prStart')) + '</button></div></div>';
    return h + '</div>';
  };
  function stage() {
    var st = $('#q10Stage'); if (!st) return;
    if (FT.i >= FT.qs.length) { result(st); return; }
    var q = FT.qs[FT.i];
    st.innerHTML = '<div class="card pr-card"><div class="pr-top"><span class="chip">' + esc(tr('q10Sec_' + q.sec)) + (q.topic ? ' · ' + esc(q.topic) : '') + '</span><span class="rv-prog">' + (FT.i + 1) + ' / ' + FT.qs.length + '</span><span class="chip ok">' + FT.right + ' ✓</span></div>' +
      '<div class="q-text">' + inlineCode(q.q) + '</div><div class="pr-opts-q">' + q.opts.map(function (o, i) { return '<button class="opt" data-pick="' + i + '"><span class="mk">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div></div>';
    $$('[data-pick]', st).forEach(function (b) { b.addEventListener('click', function () {
      var pick = Number(b.dataset.pick), ok = pick === q.correct;
      $$('.opt', st).forEach(function (x) { x.classList.add('locked'); var i = Number(x.dataset.pick); if (i === q.correct) x.classList.add('correct'); else if (i === pick) x.classList.add('wrong'); });
      FT.bySec[q.sec] = FT.bySec[q.sec] || { r: 0, t: 0 }; FT.bySec[q.sec].t++;
      if (ok) { FT.right++; FT.bySec[q.sec].r++; } else { FT.wrong.push(q); Store.addMistake2('english', 'q10:' + FT.i + ':' + Date.now().toString(36), { q: q.q, chosen: q.opts[pick], correct: q.opts[q.correct], topic: q.topic || tr('q10Sec_' + q.sec), route: 'quick' }); }
      setTimeout(function () { FT.i++; stage(); }, ok ? 450 : 1200);
    }); });
  }
  function result(st) {
    var total = FT.qs.length, pct = Math.round(FT.right / total * 100), pass = FT.right / total >= Q.meta.finalTest.pass;
    Store.quizSet('q10:final', FT.right, total);
    st.innerHTML = '<div class="card pr-result ' + (pass ? 'pass' : 'fail') + '"><div class="pr-score">' + pct + '<small>%</small></div><div><h3>' + esc(pass ? tr('passT') : tr('failT')) + '</h3><p>' + esc(tr('prResult', { r: FT.right, t: total })) + '</p>' +
      '<div class="pr-tags">' + Object.keys(FT.bySec).map(function (k) { var s = FT.bySec[k]; return '<span class="chip ' + (s.r / s.t >= .7 ? 'ok' : 'hot') + '">' + esc(tr('q10Sec_' + k)) + ' ' + s.r + '/' + s.t + '</span>'; }).join('') + '</div>' +
      '<div class="sync-actions">' + (pass ? '<button class="btn btn-primary" data-q10cert>' + IC.medal + esc(tr('q10CertReady')) + '</button>' : '<button class="btn btn-ghost" data-go="quick">' + IC.arrowL + esc(tr('q10Weak')) + '</button>') + (FT.wrong.length ? '<button class="btn btn-ghost" data-go="mistakes">' + IC.alert + esc(tr('prToMistakes', { n: FT.wrong.length })) + '</button>' : '') + '</div></div></div>';
    $$('[data-q10cert]', st).forEach(function (b) { b.addEventListener('click', openCert); });
    App.refreshChrome();
  }
  window.PageQuickTest.mount = function () {
    var b = $('#q10Start'); if (!b) return;
    b.addEventListener('click', function () { buildFinal(); stage(); });
  };
})();
