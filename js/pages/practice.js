/* ==========================================================================
   Practice Center (#/practice) — mavjud kontentdan mashq sessiyalari
   --------------------------------------------------------------------------
   Manbalar (yangi kontent yozilmaydi — bor narsa qayta ishlatiladi):
     python   — COURSE kunlaridagi test savollari (variantli)
     english  — ingliz tili kunlaridagi testlar (variantli)
     grammar  — ENG_GRAMMAR_EX mashqlari (javob yopiq → o'zini baholash)
     vocab    — kitob lug'ati: so'z → sinonimni tanlash (variantlar boshqa
                so'zlarning sinonimlaridan)
     mistakes — ochiq xatolar qayta (variantli, Python/ingliz)
   Sozlash: manba · qiyinlik (kun oralig'i) · savollar soni.
   Natija: ball, zaif mavzular, xatolar → Xato banki, natija → Store.quiz.
   ========================================================================== */
(function () {
  'use strict';

  var S = { src: 'python', lvl: 'all', n: 10, qs: [], i: 0, picked: null, right: 0, wrong: [] };
  var SOURCES = ['coding', 'python', 'datacamp', 'english', 'grammar', 'vocab', 'speaking', 'mistakes'];

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---- savol manbalari: har biri {q, opts, correct, topic, route, ref, self?} ---- */
  function fromPython(lvl) {
    var out = [];
    COURSE.forEach(function (d) {
      if (lvl === 'easy' && d.day > 10) return; if (lvl === 'mid' && (d.day <= 10 || d.day > 20)) return; if (lvl === 'hard' && d.day <= 20) return;
      (d.quiz || []).forEach(function (q, qi) {
        var loc = window.localizedQuiz ? localizedQuiz(d.day, qi, q) : { q: q.q, opts: q.opts };
        out.push({ q: loc.q, opts: loc.opts, correct: q.correct, topic: L(d.title), route: 'lesson/' + d.day, ref: 'py:' + d.day + ':' + qi, cat: 'python' });
      });
    });
    return out;
  }
  function fromEnglish(lvl) {
    var out = [];
    (window.ENG_DAYS || []).forEach(function (d) {
      if (lvl === 'easy' && d.d > 40) return; if (lvl === 'mid' && (d.d <= 40 || d.d > 100)) return; if (lvl === 'hard' && d.d <= 100) return;
      (d.quiz || []).forEach(function (q, qi) { out.push({ q: q.q, opts: q.opts, correct: q.correct, topic: L(d.title), route: 'english/' + d.d, ref: 'eng:' + d.d + ':' + qi, cat: 'english' }); });
    });
    return out;
  }
  function fromGrammar(lvl) {
    var out = [], EX = window.ENG_GRAMMAR_EX || {};
    Object.keys(EX).forEach(function (k) {
      var g = ENG_GRAMMAR[k]; if (!g) return;
      if (lvl === 'easy' && g.group !== 'tenses') return; if (lvl === 'hard' && g.group === 'tenses') return;
      EX[k].forEach(function (e, i) { out.push({ q: e.q, answer: e.a, self: true, topic: L(g.name), route: 'eng-grammar', ref: 'gr:' + k + ':' + i, cat: 'grammar' }); });
    });
    return out;
  }
  function fromVocab(lvl) {
    var out = [], units = window.ENG_BOOK_VOCAB || [];
    var pool = []; units.forEach(function (u) { u.words.forEach(function (w) { if (w.syn && w.syn.length) pool.push({ u: u.n, w: w }); }); });
    pool.forEach(function (p) {
      if (lvl === 'easy' && p.u > 10) return; if (lvl === 'mid' && (p.u <= 10 || p.u > 20)) return; if (lvl === 'hard' && p.u <= 20) return;
      var others = shuffle(pool.filter(function (o) { return o.w.w !== p.w.w; })).slice(0, 3).map(function (o) { return o.w.syn[0]; });
      var opts = shuffle([p.w.syn[0]].concat(others));
      out.push({ q: p.w.w + (p.w.pos ? ' (' + p.w.pos + ')' : '') + ' — ' + tr('prSynQ'), opts: opts, correct: opts.indexOf(p.w.syn[0]), topic: tr('booksUnitN', { n: p.u }), route: 'books/v' + p.u, ref: 'vc:' + p.w.w, cat: 'vocab', why: p.w.ex || '' });
    });
    return out;
  }
  /* DataCamp boblari (sanasi kelganlari) — 5 savol/bob */
  function fromDataCamp() { if (!window.DataCamp) return []; var k = Store.dateKey(); return DataCamp.quizPool(k < DCTRACK.meta.start ? '2099-12-31' : k); }
  /* KATTA CODING TESTI (yakshanba): shu kungacha o'tilgan Python darslari + DataCamp boblari.
     Python darsi "o'tilgan" = sanasi kelgan (HabitPlan.pyDayOf) yoki yopilgan. */
  function fromCoding() {
    var key = Store.dateKey(), upto = window.HabitPlan ? Math.max(HabitPlan.pyDayOf(key), (key > HabitPlan.pyDeadline() ? COURSE.length : 0)) : COURSE.length;
    /* Kurs hali boshlanmagan (kickoffgacha) — butun kurs + butun trek (isitish testi) */
    var all = upto === 0 && !Store.doneCount();
    var out = [];
    COURSE.forEach(function (d) {
      if (!all && d.day > upto && !Store.isDone(d.day)) return;
      (d.quiz || []).forEach(function (q, qi) {
        var loc = window.localizedQuiz ? localizedQuiz(d.day, qi, q) : { q: q.q, opts: q.opts };
        out.push({ q: loc.q, opts: loc.opts, correct: q.correct, topic: 'Python · ' + L(d.title), route: 'lesson/' + d.day, ref: 'py:' + d.day + ':' + qi, cat: 'python' });
      });
    });
    return out.concat(all && window.DataCamp ? DataCamp.quizPool('2099-12-31') : fromDataCamp());
  }
  function fromMistakes() {
    var out = [];
    Store.openMistakes().forEach(function (m) {
      /* Faqat variantli manbadan kelgan xatolar qayta so'raladi */
      var d = m.day ? dayOf(m.day) : null;
      if (d && d.quiz && d.quiz[m.qi]) { var q = d.quiz[m.qi]; var loc = window.localizedQuiz ? localizedQuiz(d.day, m.qi, q) : { q: q.q, opts: q.opts }; out.push({ q: loc.q, opts: loc.opts, correct: q.correct, topic: L(d.title), route: 'lesson/' + d.day, ref: 'py:' + d.day + ':' + m.qi, cat: 'python', mid: m.id }); return; }
      if (m.correct && m.chosen) out.push({ q: m.q, opts: shuffle([m.correct, m.chosen]), correct: -1, answer: m.correct, topic: m.topic || m.cat, route: m.route || 'mistakes', ref: m.ref || m.id, cat: m.cat || 'python', mid: m.id });
    });
    out.forEach(function (o) { if (o.correct === -1) o.correct = o.opts.indexOf(o.answer); });
    return out;
  }
  /* Qo'lda yozilgan savollar + generator (QGen): yarmi tayyor, yarmi hosil qilingan.
     Speaking — faqat generator (mavzu tanlanadi yoki tasodifiy). */
  function fixedPool() {
    return S.src === 'python' ? fromPython(S.lvl) : S.src === 'coding' ? fromCoding() : S.src === 'datacamp' ? fromDataCamp() : S.src === 'english' ? fromEnglish(S.lvl) : S.src === 'grammar' ? fromGrammar(S.lvl) : S.src === 'vocab' ? fromVocab(S.lvl) : S.src === 'mistakes' ? fromMistakes() : [];
  }
  /* Har manba generator bilan quvvatlanadi — tayyor savollar tugasa ham sessiya to'lib keladi (≥ 3 000 noyob savol) */
  function genPool(n) {
    if (!window.QGen) return [];
    if (S.src === 'python') return QGen.python(n, S.lvl);
    if (S.src === 'coding') return QGen.python(Math.ceil(n / 3), 'all');   // katta testda: 2/3 tayyor savol, 1/3 generator
    if (S.src === 'datacamp') return QGen.python(n, S.lvl).map(function (q) { q.topic = 'DataCamp · ' + (q.topic || 'Python'); q.cat = 'python'; return q; });
    if (S.src === 'english') return shuffle(QGen.grammar(Math.ceil(n / 2), S.lvl).concat(QGen.vocab(Math.ceil(n / 2), S.lvl))).map(function (q) { q.cat = q.cat || 'english'; return q; });
    if (S.src === 'grammar') return QGen.grammar(n, S.lvl);
    if (S.src === 'vocab') return QGen.vocab(n, S.lvl);
    if (S.src === 'speaking') return QGen.speaking(n, S.topic || 'random');
    if (S.src === 'mistakes') {
      /* Xatolar kam bo'lsa — xato qilingan sohalar bo'yicha generator (Python / grammatika) */
      var cats = {}; Store.openMistakes().forEach(function (m) { cats[m.cat || 'python'] = 1; });
      var py = cats.python || !Object.keys(cats).length, en = cats.english || cats.grammar || cats.vocab;
      var out = [];
      if (py) out = out.concat(QGen.python(en ? Math.ceil(n / 2) : n, 'all'));
      if (en) out = out.concat(QGen.grammar(py ? Math.ceil(n / 2) : n, 'all'));
      return shuffle(out);
    }
    return [];
  }
  function build() {
    var fixed = shuffle(fixedPool()), gen = genPool(S.n);
    var qs;
    if (S.src === 'speaking') qs = gen;
    else if (!gen.length) qs = fixed.slice(0, S.n);
    else { var g = gen.slice(0, Math.min(gen.length, Math.floor(S.n / 2))); qs = shuffle(fixed.slice(0, S.n - g.length).concat(g)); if (qs.length < S.n) qs = qs.concat(gen.slice(g.length, g.length + S.n - qs.length)); }
    S.qs = qs.slice(0, S.n); S.i = 0; S.picked = null; S.right = 0; S.wrong = [];
  }
  function availText() {
    var fixed = fixedPool().length, g = window.QGen ? QGen.size(S.src) : 0;
    if (S.src === 'speaking') return tr('prAvailGen', { n: g });
    if (S.src === 'coding') return tr('prAvail', { n: fixed }) + ' · ' + tr('prBigPick', { n: S.n });
    return g ? tr('prAvailBoth', { f: fixed, g: g }) : tr('prAvail', { n: fixed });
  }

  /* ---- sahifa ---- */
  window.PagePractice = function (src) {
    if (src && SOURCES.indexOf(src) >= 0) { S.src = src; if (src === 'coding') { S.n = 30; S.lvl = 'all'; } }
    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('prKick')) + '</div><h1>' + esc(tr('practiceCenter')) + '</h1><p class="lede">' + esc(tr('prLede')) + '</p></header>';
    var hist = Store.all().quiz;
    h += '<div class="pr-setup card" id="prSetup">' +
      '<div class="pr-row"><label>' + esc(tr('prSource')) + '</label><div class="pr-opts">' + SOURCES.map(function (s) {
        var q = hist['pr:' + s]; return '<button class="pr-opt' + (S.src === s ? ' on' : '') + (s === 'coding' ? ' big' : '') + '" data-src="' + s + '">' + (s === 'coding' ? IC.target : '') + esc(tr('prSrc_' + s)) + (q ? '<small>' + Math.round(q.best / (q.bestTotal || 1) * 100) + '%</small>' : '') + '</button>';
      }).join('') + '</div></div>' +
      (S.src === 'coding' ? '<div class="callout why pr-big"><span class="co-ic">' + IC.target + '</span><div><h4>' + esc(tr('prBigT')) + '</h4>' + esc(tr('prBigS')) + codingHistory() + '</div></div>' : '') +
      '<div class="pr-row" id="prLvlRow"' + (/^(speaking|coding|datacamp)$/.test(S.src) ? ' hidden' : '') + '><label>' + esc(tr('prLevel')) + '</label><div class="pr-opts">' + ['all', 'easy', 'mid', 'hard'].map(function (l) { return '<button class="pr-opt' + (S.lvl === l ? ' on' : '') + '" data-lvl="' + l + '">' + esc(tr('prLvl_' + l)) + '</button>'; }).join('') + '</div></div>' +
      '<div class="pr-row" id="prTopicRow"' + (S.src === 'speaking' ? '' : ' hidden') + '><label>' + esc(tr('prTopic')) + '</label><select class="input sm" id="prTopic"><option value="random">' + esc(tr('prTopicRandom')) + '</option>' + (window.QGen ? QGen.topics().map(function (t) { return '<option value="' + esc(t.t) + '"' + (S.topic === t.t ? ' selected' : '') + '>' + esc(t.t) + ' · ' + esc(t.k) + '</option>'; }).join('') : '') + '</select></div>' +
      '<div class="pr-row"><label>' + esc(tr('prCount')) + '</label><div class="pr-opts">' + [5, 10, 20, 30].map(function (n) { return '<button class="pr-opt' + (S.n === n ? ' on' : '') + '" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div></div>' +
      '<div class="sync-actions"><button class="btn btn-primary" id="prStart">' + IC.target + esc(tr('prStart')) + '</button><span class="hint" id="prAvail"></span></div></div>';
    h += '<div id="prStage"></div>';
    return h + '</div>';
  };

  function stage() {
    var st = $('#prStage'); if (!st) return;
    if (!S.qs.length) { st.innerHTML = '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(tr('prEmpty')) + '</div></div>'; return; }
    if (S.i >= S.qs.length) { result(st); return; }
    var q = S.qs[S.i];
    /* Python/coding savoli kod bo'lsa — kod ramkasida (questionHTML), aks holda oddiy matn */
    var isPy = /^(python|coding|datacamp)$/.test(S.src) || q.cat === 'python';
    var h = '<div class="card pr-card' + (isPy ? ' pr-py' : '') + '"><div class="pr-top"><span class="chip">' + esc(q.topic) + '</span><span class="rv-prog">' + (S.i + 1) + ' / ' + S.qs.length + '</span><span class="chip ok">' + S.right + ' ✓</span></div>' +
      '<div class="q-text">' + (isPy && window.questionHTML ? questionHTML(q.q) : inlineCode(q.q)) + '</div>';
    if (q.spk) {
      /* Speaking: 1 daqiqa tayyorgarlik → gapirish (ovoz chiqarib, taymer bilan) → halol baho */
      h += '<div class="pr-self pr-spk"><p class="hint">' + esc(tr('prSpkHow', { s: q.part === 2 ? '2' : '1' })) + '</p>' +
        '<textarea class="textarea" id="prAns" rows="2" placeholder="' + esc(tr('prSpkNotes')) + '"></textarea>' +
        '<div class="pr-spk-timer"><button class="btn btn-ghost btn-sm" id="prTimer" data-sec="' + (q.part === 2 ? 120 : 60) + '">' + IC.clock + '<span>' + (q.part === 2 ? '2:00' : '1:00') + '</span></button><span class="hint" id="prTimerHint">' + esc(tr('prSpkTimer')) + '</span></div>' +
        '<div id="prReveal" hidden><div class="gx-a" style="display:block;margin:10px 0;white-space:pre-wrap">' + esc(q.answer) + '</div><div class="rv-grade"><button class="btn btn-ghost" data-self="0">' + esc(tr('prSpkBad')) + '</button><button class="btn btn-primary" data-self="1">' + esc(tr('prSpkGood')) + '</button></div></div>' +
        '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="prShow">' + IC.eye + esc(tr('prSpkDone')) + '</button></div></div>';
    } else if (q.self) {
      h += '<div class="pr-self"><textarea class="textarea" id="prAns" rows="2" placeholder="' + esc(tr('prYourAnswer')) + '"></textarea>' +
        '<div id="prReveal" hidden><div class="gx-a" style="display:block;margin:10px 0">' + esc(q.answer) + '</div><div class="rv-grade"><button class="btn btn-ghost" data-self="0">' + esc(tr('prWrong')) + '</button><button class="btn btn-primary" data-self="1">' + esc(tr('prRight')) + '</button></div></div>' +
        '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="prShow">' + IC.eye + esc(tr('rvShow')) + '</button></div></div>';
    } else {
      h += '<div class="pr-opts-q">' + q.opts.map(function (o, i) { return '<button class="opt' + (isPy ? ' mono' : '') + '" data-pick="' + i + '"><span class="mk">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
    }
    st.innerHTML = h + '</div>';
    $$('[data-pick]', st).forEach(function (b) { b.addEventListener('click', function () { answer(Number(b.dataset.pick)); }); });
    var sh = $('#prShow'); if (sh) sh.addEventListener('click', function () { $('#prReveal').hidden = false; sh.hidden = true; });
    var tm = $('#prTimer'); if (tm) tm.addEventListener('click', function () {
      if (tm.dataset.on) return; tm.dataset.on = '1';
      var left = Number(tm.dataset.sec), sp = tm.querySelector('span');
      var iv = setInterval(function () { left--; sp.textContent = Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2); if (left <= 0) { clearInterval(iv); tm.classList.add('btn-primary'); sp.textContent = tr('prSpkTimeUp'); } }, 1000);
    });
    $$('[data-self]', st).forEach(function (b) { b.addEventListener('click', function () { selfGrade(b.dataset.self === '1', ($('#prAns') || {}).value || ''); }); });
  }
  function answer(pick) {
    var q = S.qs[S.i]; var ok = pick === q.correct;
    $$('#prStage .opt').forEach(function (b) { b.classList.add('locked'); var i = Number(b.dataset.pick); if (i === q.correct) b.classList.add('correct'); else if (i === pick) b.classList.add('wrong'); });
    if (ok) S.right++; else { record(q, q.opts[pick]); if (q.why) { var st = $('#prStage .pr-card'); if (st) st.insertAdjacentHTML('beforeend', '<div class="q-why">' + esc(q.why) + '</div>'); } }
    setTimeout(function () { S.i++; stage(); }, ok ? 500 : (q.why ? 2200 : 1300));
  }
  function selfGrade(ok, mine) { var q = S.qs[S.i]; if (ok) S.right++; else record(q, mine || '—'); S.i++; stage(); }
  function record(q, chosen) {
    S.wrong.push(q);
    Store.addMistake2(q.cat, q.ref, { q: q.q, chosen: chosen, correct: q.self ? q.answer : q.opts[q.correct], topic: q.topic, route: q.route, why: q.why || '' });
    Review.add('mistake', q.cat + ':' + q.ref, { cat: q.cat });
  }
  function result(st) {
    var total = S.qs.length, pctv = Math.round(S.right / total * 100);
    Store.quizSet('pr:' + S.src, S.right, total);
    /* Katta coding testi — haftalik jadvalga (sana bilan) */
    if (S.src === 'coding') Store.readSet('codetest-' + Store.dateKey(), { score: S.right, total: total });
    /* Xatolar to'g'ri javob berilgan bo'lsa — ochiq xato yopiladi */
    if (S.src === 'mistakes') S.qs.forEach(function (q) { if (q.mid && S.wrong.indexOf(q) < 0) { var m = Store.mistakes().filter(function (x) { return x.id === q.mid; })[0]; if (m && !m.fixed) Store.toggleMistake(q.mid); } });
    var topics = {}; S.wrong.forEach(function (q) { topics[q.topic] = (topics[q.topic] || 0) + 1; });
    var weak = Object.keys(topics).sort(function (a, b) { return topics[b] - topics[a]; }).slice(0, 4);
    var strong = {}; S.qs.forEach(function (q) { if (S.wrong.indexOf(q) < 0) strong[q.topic] = 1; }); weak.forEach(function (t) { delete strong[t]; });
    st.innerHTML = '<div class="card pr-result ' + (pctv >= 70 ? 'pass' : 'fail') + '"><div class="pr-score">' + pctv + '<small>%</small></div>' +
      '<div><h3>' + esc(pctv >= 70 ? tr('passT') : tr('failT')) + '</h3><p>' + esc(tr('prResult', { r: S.right, t: total })) + '</p>' +
      (Object.keys(strong).length ? '<div class="pr-tags"><span class="gc-l">' + esc(tr('prStrong')) + '</span>' + Object.keys(strong).slice(0, 4).map(function (t) { return '<span class="chip ok">' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      (weak.length ? '<div class="pr-tags"><span class="gc-l red">' + esc(tr('prWeak')) + '</span>' + weak.map(function (t) { return '<span class="chip hot">' + esc(t) + ' ×' + topics[t] + '</span>'; }).join('') + '</div>' : '') +
      '<div class="sync-actions"><button class="btn btn-primary" id="prAgain">' + IC.refresh + esc(tr('prAgain')) + '</button>' + (S.wrong.length ? '<button class="btn btn-ghost" data-go="mistakes">' + IC.alert + esc(tr('prToMistakes', { n: S.wrong.length })) + '</button>' : '') + '</div></div></div>';
    var ag = $('#prAgain'); if (ag) ag.addEventListener('click', function () { build(); stage(); });
    App.refreshChrome();
  }

  /* Katta coding testlari tarixi (oxirgi 6 ta) */
  function codingHistory() {
    var rd = Store.readList(), keys = Object.keys(rd).filter(function (k) { return k.indexOf('codetest-') === 0; }).sort().reverse().slice(0, 6);
    if (!keys.length) return '';
    return '<div class="pr-hist">' + keys.map(function (k) { var r = rd[k]; return '<span class="chip ' + (r.score / r.total >= .7 ? 'ok' : 'hot') + '">' + esc(EngCal.fmt(k.slice(9))) + ' · ' + r.score + '/' + r.total + '</span>'; }).join('') + '</div>';
  }

  window.PagePractice.mount = function (src) {
    var avail = function () { var a = $('#prAvail'); if (a) a.textContent = availText(); var lr = $('#prLvlRow'), tr2 = $('#prTopicRow'); if (lr) lr.hidden = /^(speaking|coding|datacamp)$/.test(S.src); if (tr2) tr2.hidden = S.src !== 'speaking'; };
    $$('[data-src]').forEach(function (b) { b.addEventListener('click', function () { S.src = b.dataset.src; if (S.src === 'coding' && S.n < 20) { S.n = 30; $$('[data-n]').forEach(function (x) { x.classList.toggle('on', Number(x.dataset.n) === 30); }); } $$('[data-src]').forEach(function (x) { x.classList.toggle('on', x === b); }); var big = $('.pr-big'); if (big) big.hidden = S.src !== 'coding'; avail(); }); });
    var tp = $('#prTopic'); if (tp) tp.addEventListener('change', function () { S.topic = tp.value; });
    $$('[data-lvl]').forEach(function (b) { b.addEventListener('click', function () { S.lvl = b.dataset.lvl; $$('[data-lvl]').forEach(function (x) { x.classList.toggle('on', x === b); }); avail(); }); });
    $$('[data-n]').forEach(function (b) { b.addEventListener('click', function () { S.n = Number(b.dataset.n); $$('[data-n]').forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
    $('#prStart').addEventListener('click', function () { build(); stage(); var st = $('#prStage'); if (st) st.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    avail();
  };
})();
