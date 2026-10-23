/* ==========================================================================
   Python & AI Engineering Career Path — sahifalar (#/pyai/...)
   --------------------------------------------------------------------------
     #/pyai                 kurs sahifasi: natijalar, modul xaritasi, davom etish
     #/pyai/diagnostic      boshlang'ich diagnostika (hech narsa qulflanmaydi)
     #/pyai/m/<id>          modul · /m/<id>/test — modul testi
     #/pyai/l/<id>          dars (14 bosqich)
     #/pyai/review          takror navbati
     #/pyai/progress        progress paneli (alohida metrikalar)
     #/pyai/projects · /p/<id> · /capstone · /portfolio · /legacy
   Kod mashqlari: PyRunner (Pyodide, Web Worker, vaqt chegarasi). Testlar
   ishonchli kurs ma'lumotidan; serverda hech narsa bajarilmaydi.
   ========================================================================== */
(function () {
  'use strict';
  var A = function () { return window.PyAI; }, P = function () { return window.PYAI; };
  var t = function (uz, en) { return L({ uz: uz, en: en }); };
  var MOUNT = null, VIEWS = {}, RES = {}, QZ = {};

  function head(eyebrow, title, lede) { return '<header class="page-head"><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' + (lede ? '<p class="lede">' + esc(lede) + '</p>' : '') + '</header>'; }
  function tabs(on) {
    var x = [['pyai', 'home', t('Kurs', 'Course'), IC.home], ['pyai/progress', 'progress', t('Progress', 'Progress'), IC.trend], ['pyai/review', 'review', t('Takror', 'Review'), IC.refresh], ['pyai/projects', 'projects', t('Loyihalar', 'Projects'), IC.rocket], ['pyai/capstone', 'capstone', 'Capstone', IC.medal], ['pyai/portfolio', 'portfolio', 'Portfolio', IC.checklist]];
    var due = A().reviewDue().length;
    return '<nav class="hub-tabs ms-tabs no-print">' + x.map(function (i) { return '<button class="hub-tab' + (i[1] === on ? ' on' : '') + '" data-go="' + i[0] + '">' + i[3] + '<span>' + esc(i[2]) + (i[1] === 'review' && due ? ' · ' + due : '') + '</span></button>'; }).join('') + '</nav>';
  }
  function card(title, body, ic, cls) { return '<section class="card ms-card ' + (cls || '') + '"><h3 class="card-title">' + (ic ? '<span class="num">' + ic + '</span>' : '') + esc(title) + '</h3>' + body + '</section>'; }
  function tile(l, v, note, cls) { return '<div class="stat-tile ' + (cls || '') + '"><div class="st-l">' + esc(l) + '</div><div class="st-v">' + v + '</div>' + (note ? '<div class="st-note">' + esc(note) + '</div>' : '') + '</div>'; }
  function page(title, lede, tab) { return '<div class="page stagger ms-page py-page">' + head('Python & AI Engineering', title, lede) + tabs(tab); }
  function md(s) { return inlineCode(L(s)); }
  function chip(txt, cls) { return '<span class="py-chip ' + (cls || '') + '">' + esc(txt) + '</span>'; }
  function lessonChips(st) {
    var out = '';
    if (st.mastered) out += chip(t('mahorat', 'mastered'), 'ok');
    else if (st.completed) out += chip(st.completedBy === 'legacy' ? t('tugallangan (eski kurs)', 'completed (legacy)') : t('tugallangan', 'completed'), 'done');
    else if (st.viewed || st.attempted) out += chip(t('jarayonda', 'in progress'), 'mid');
    else out += chip(t('boshlanmagan', 'not started'), '');
    return out;
  }
  function levelName(l) { return { beginner: t("boshlang'ich", 'beginner'), intermediate: t("o'rta", 'intermediate'), challenge: t('murakkab', 'challenge') }[l] || l; }

  /* ====================== KOD MASHQI (umumiy vidjet) =================== */
  function exBlock(ex, label) {
    var r = A().reveal(ex.id), at = A().attempts(ex.id), last = at[at.length - 1], code = A().draft(ex.id);
    if (code == null) code = ex.starter || '';
    var stat = A().passedIndependent(ex.id) ? chip(t("o'tdi (mustaqil)", 'passed (independent)'), 'ok') : A().passed(ex.id) ? chip(t("o'tdi (yechim ko'rilgan)", 'passed (with solution)'), 'done') : at.length ? chip(t('urinishlar: ', 'attempts: ') + at.length, 'mid') : '';
    var h = '<div class="py-ex" data-ex="' + esc(ex.id) + '">';
    h += '<div class="py-ex-h"><b>' + esc(label) + '</b> ' + chip(levelName(ex.level), 'lvl') + stat + '</div><p class="py-prompt">' + md(ex.prompt) + '</p>';
    if (ex.pkgs && ex.pkgs.length) h += '<p class="hint">' + IC.cloud + t(' Bu mashq ' + ex.pkgs.join(', ') + ' paketini yuklaydi (birinchi marta ~20–40 s).', ' This exercise loads ' + ex.pkgs.join(', ') + ' (first time ~20–40 s).') + '</p>';
    h += '<textarea class="py-code" spellcheck="false" autocapitalize="off" autocomplete="off" data-code="' + esc(ex.id) + '" rows="' + Math.min(22, Math.max(6, code.split('\n').length + 2)) + '" aria-label="code">' + esc(code) + '</textarea>';
    h += '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-pyrun="' + esc(ex.id) + '">' + IC.play + t('Testlarni ishga tushirish', 'Run tests') + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-hint="' + esc(ex.id) + ':1"' + (A().canHint(ex.id, 1) ? '' : ' disabled') + '>' + IC.bulb + t('1-yordam', 'Hint 1') + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-hint="' + esc(ex.id) + ':2"' + (A().canHint(ex.id, 2) ? '' : ' disabled') + '>' + IC.bulb + t('2-yordam (aniqroq)', 'Hint 2 (more specific)') + '</button>' +
      '<button class="btn btn-quiet btn-sm" data-sol="' + esc(ex.id) + '"' + (A().canSolution(ex.id) && !r.sol ? '' : ' disabled') + '>' + t("Yechimni ko'rsatish", 'Show solution') + '</button>' +
      '<button class="btn btn-quiet btn-sm" data-reset="' + esc(ex.id) + '">' + t('Boshlanishga qaytarish', 'Reset code') + '</button></div>';
    if (!r.sol && !A().canSolution(ex.id)) h += '<p class="hint">' + t("Yechim: avval kamida 1 urinish va ikkala yordamdan keyin ochiladi.", 'The solution unlocks after at least one attempt and both hints.') + '</p>';
    if (r.hints >= 1) h += '<div class="callout tip py-hint"><span class="co-ic">' + IC.bulb + '</span><div>' + md(ex.hints[0]) + '</div></div>';
    if (r.hints >= 2) h += '<div class="callout tip py-hint"><span class="co-ic">' + IC.bulb + '</span><div>' + md(ex.hints[1]) + '</div></div>';
    if (r.sol) h += '<div class="py-sol"><div class="gc-l">' + t("Yechim (o'qib tushuning, ko'chirmang — keyingi takrorda o'zingiz yozasiz)", 'Solution (read and understand, do not copy — you will write it yourself on review)') + '</div>' + codeBlock(ex.solution, t('Yechim', 'Solution'), { runnable: false }) + '</div>';
    h += '<div class="py-res" data-res="' + esc(ex.id) + '">' + resHtml(RES[ex.id] || (last ? { saved: last } : null)) + '</div>';
    return h + '</div>';
  }
  function resHtml(r) {
    if (!r) return '';
    if (r.saved) return '<p class="hint">' + t('Oxirgi urinish: ', 'Last attempt: ') + r.saved.passed + '/' + r.saved.total + ' · ' + esc(r.saved.at) + '</p>';
    if (r.loading) return '<p class="hint py-loading">' + IC.refresh + esc(r.loading) + '</p>';
    if (r.fatal) return '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t("Tekshiruvchi ishga tushmadi (internet yoki brauzer): ", 'The checker could not start (network or browser): ') + r.fatal) + '</div></div>';
    var tests = r.tests || [], ok = r.ok && tests.length && tests.every(function (x) { return x.pass; });
    var h = '<div class="py-out ' + (ok ? 'pass' : 'fail') + '"><b>' + (ok ? IC.check + t("Hamma testlar o'tdi", 'All tests passed') : t('Hali emas', 'Not yet')) + '</b>';
    if (r.error) h += '<pre class="py-err">' + esc(r.error) + '</pre>';
    if (tests.length) h += '<ul class="py-tests">' + tests.map(function (x) { return '<li class="' + (x.pass ? 'p' : 'f') + '">' + (x.pass ? '✓' : '✗') + ' ' + esc(x.name) + (x.msg ? ' — <code>' + esc(x.msg) + '</code>' : '') + '</li>'; }).join('') + '</ul>';
    if (r.stdout) h += '<div class="gc-l">stdout</div><pre class="py-err">' + esc(r.stdout) + '</pre>';
    if (!ok) h += '<p class="hint">' + t("Xato xabarini o'qing: qaysi test, qaysi qiymat. Keyin kichik o'zgartirib qayta urinib ko'ring.", 'Read the message: which test, which value. Make a small change and try again.') + '</p>';
    return h + '<p class="hint">' + t("Kod brauzeringizda (Pyodide, alohida Worker, vaqt chegarasi bilan) bajarildi — bu xavfsizlik sandbox'i emas; serverga hech narsa yuborilmaydi.", 'Your code ran in your browser (Pyodide, separate worker, time limit) — not a security sandbox; nothing is sent to a server.') + '</p></div>';
  }
  function runEx(exId, onDone) {
    var f = A().findEx(exId); if (!f) return;
    var ta = document.querySelector('[data-code="' + exId + '"]'), code = ta ? ta.value : '';
    A().draft(exId, code);
    var box = document.querySelector('[data-res="' + exId + '"]');
    var first = !(window.PyRunner && PyRunner.isWarm());
    RES[exId] = { loading: first ? t("Python yuklanmoqda (birinchi marta ~10 MB, 10–30 s)…", 'Loading Python (first time ~10 MB, 10–30 s)…') : t('Tekshirilmoqda…', 'Checking…') };
    if (box) box.innerHTML = resHtml(RES[exId]);
    if (!window.PyRunner || !PyRunner.available()) { RES[exId] = { fatal: 'Web Worker' }; if (box) box.innerHTML = resHtml(RES[exId]); return; }
    PyRunner.run({ code: code, tests: f.ex.tests.map(function (x) { return { name: x[0], code: x[1] }; }), pkgs: f.ex.pkgs || [], timeout: P().config.timeoutMs }).then(function (res) {
      RES[exId] = res;
      var a = A().recordAttempt(exId, res);
      if (onDone) onDone(a, res);
      App.render();
    }, function (e) { RES[exId] = { fatal: String(e && e.message || e) }; if (box) box.innerHTML = resHtml(RES[exId]); });
  }
  function mountEx(onDone) {
    $$('.py-code').forEach(function (ta) {
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); var s = ta.selectionStart, en = ta.selectionEnd; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + 4; }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runEx(ta.dataset.code, onDone); }
      });
      var tm = null; ta.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { A().draft(ta.dataset.code, ta.value); }, 500); });
    });
    $$('[data-pyrun]').forEach(function (b) { b.addEventListener('click', function () { runEx(b.dataset.pyrun, onDone); }); });
    $$('[data-hint]').forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.hint.split(':'); var ta = document.querySelector('[data-code="' + p[0] + '"]'); if (ta) A().draft(p[0], ta.value); if (A().openHint(p[0], Number(p[1]))) App.render(); }); });
    $$('[data-sol]').forEach(function (b) { b.addEventListener('click', function () { if (!confirm(t("Yechim ochilsa, bu mashqdagi keyingi o'tish 'mustaqil' hisoblanmaydi (mahorat uchun). Ochasizmi?", 'Once shown, passing this exercise no longer counts as independent (for mastery). Show it?'))) return; var ta = document.querySelector('[data-code="' + b.dataset.sol + '"]'); if (ta) A().draft(b.dataset.sol, ta.value); if (A().openSolution(b.dataset.sol)) App.render(); }); });
    $$('[data-reset]').forEach(function (b) { b.addEventListener('click', function () { if (!confirm(t("Kodingiz boshlang'ich holatga qaytadi. Davom etasizmi?", 'Your code will be reset to the starter. Continue?'))) return; A().draft(b.dataset.reset, null); delete RES[b.dataset.reset]; App.render(); }); });
  }

  /* ====================== MCQ (umumiy) ================================= */
  function mcqBlock(key, q, opts) {
    opts = opts || {};
    var st = QZ[key], last = A().mcqLast(key);
    var h = '<div class="py-mcq" data-mcq="' + esc(key) + '"><p class="py-q">' + (opts.code ? '' : md(q.q)) + '</p>' + (opts.code ? codeBlock(opts.code, t('Kod', 'Code'), { runnable: false }) + (q.q && typeof q.q === 'object' ? '<p class="py-q">' + md(q.q) + '</p>' : '') : '');
    h += '<div class="py-opts">' + q.opts.map(function (o, i) {
      var cls = st != null ? (i === q.a ? ' right' : i === st ? ' wrong' : '') : '';
      return '<button class="py-opt' + cls + '" data-opt="' + esc(key) + ':' + i + '"' + (st != null ? ' disabled' : '') + '>' + String.fromCharCode(65 + i) + ') ' + md(o) + '</button>';
    }).join('') + '</div>';
    var simHtml = '';
    if (st != null && st !== q.a && opts.similar !== false) {
      var sim = A().similarQuestion(key);
      if (sim) simHtml = '<div class="py-similar"><div class="gc-l">' + t("O'xshash savol — tushunchani boshqa misolda tekshiring", 'A similar question — check the concept on another example') + '</div>' + mcqBlock(sim.key, sim.q, { code: sim.code, similar: false }) + '</div>';
    }
    if (st != null) h += '<p class="' + (st === q.a ? 'ok-line' : 'hint bad-line') + '">' + (st === q.a ? IC.check + t("To'g'ri. ", 'Correct. ') : t("Noto'g'ri. ", 'Not quite. ')) + md(q.why) + '</p>' + (st !== q.a ? '<p class="hint">' + t('Bu savol takror navbatiga qo\'shildi (ertaga).', 'Added to your review queue (tomorrow).') + '</p>' : '') + '<button class="btn btn-quiet btn-sm" data-again="' + esc(key) + '">' + t('Qayta urinish', 'Try again') + '</button>' + simHtml;
    else if (last) h += '<p class="hint">' + t('Oxirgi javob: ', 'Last answer: ') + (last.ok ? t("to'g'ri", 'correct') : t("noto'g'ri", 'wrong')) + ' · ' + esc(last.at) + '</p>';
    return h + '</div>';
  }
  function mountMcq(qmap, after) {
    $$('[data-opt]').forEach(function (b) { b.addEventListener('click', function () {
      var p = b.dataset.opt.split(':'), i = Number(p.pop()), key = p.join(':'), q = qmap[key];
      if (!q) { var lq = A().lessonQuestions(key.split(':')[0]).filter(function (x) { return x.key === key; })[0]; q = lq ? Object.assign({ meta: { lesson: key.split(':')[0] } }, lq.q) : null; }
      if (!q) return;
      QZ[key] = i; A().answerMcq(key, i === q.a, q.meta);
      if (after) after(key, i === q.a); App.render();
    }); });
    $$('[data-again]').forEach(function (b) { b.addEventListener('click', function () { delete QZ[b.dataset.again]; App.render(); }); });
  }

  /* ====================== KURS SAHIFASI ================================ */
  VIEWS.home = function () {
    var M = P().meta, cs = A().courseStatus(), nx = A().nextLesson(), last = A().S().last, d = A().S().diag;
    var h = page(L(M.title), L(M.subtitle), 'home');
    h += '<div class="ms-grid"><div class="ms-main">';
    h += card(t('Kurs haqida', 'About the course'), '<p>' + esc(L(M.lede)) + '</p><div class="callout tip"><span class="co-ic">' + IC.alert + '</span><div>' + esc(L(M.honest)) + '</div></div><div class="gc-l">' + t("O'quv natijalari", 'Learning outcomes') + '</div><ul class="ms-ul">' + M.outcomes.map(function (o) { return '<li>' + esc(L(o)) + '</li>'; }).join('') + '</ul>', IC.book);
    h += card(t('Modullar xaritasi', 'Module map'), '<div class="py-mods">' + A().modules().map(function (m) {
      var s = A().moduleStatus(m.id);
      return '<button class="py-mod' + (s.complete ? ' done' : '') + '" data-go="pyai/m/' + m.id + '"><span class="py-mn">' + m.n + '</span><span class="py-mt"><b>' + esc(L(m.title)) + '</b><small>' + esc(L(m.goal)) + '</small></span>' +
        '<span class="py-mstats"><i>' + t('tugallangan ', 'completed ') + s.completed + '/' + s.lessons + '</i><i>' + t('mahorat ', 'mastered ') + s.mastered + '/' + s.lessons + '</i>' + (s.testPassed === null ? '' : '<i>' + t('test: ', 'test: ') + (s.testPassed ? '✓' : '—') + '</i>') + '</span></button>';
    }).join('') + '</div>', IC.map);
    h += '</div><aside class="ms-side">';
    h += card(t('Davom etish', 'Continue'), (last && last.route ? '<button class="btn btn-primary" data-go="' + esc(last.route) + '">' + IC.arrowR + esc(last.title || last.route) + '</button>' : '') +
      (nx ? '<p class="hint" style="margin-top:10px">' + t('Tavsiya etilgan keyingi dars: ', 'Recommended next lesson: ') + '<a href="#/pyai/l/' + esc(nx.id) + '">' + esc(L(nx.lesson.title)) + '</a> — ' + esc(L(nx.why)) + '</p>' : '<p class="ok-line">' + IC.check + t('Hamma darslar tugallangan', 'All lessons completed') + '</p>'), IC.play);
    h += card(t('Diagnostika', 'Diagnostic'), d ? '<p>' + t('Bajarilgan: ', 'Done: ') + esc(d.at) + '. ' + t('Boshlash nuqtasi: ', 'Start point: ') + '<a href="#/pyai/l/' + esc(d.start) + '">' + esc(L(A().lesson(d.start).title)) + '</a></p><button class="btn btn-quiet btn-sm" data-go="pyai/diagnostic">' + t('Qayta topshirish', 'Retake') + '</button>' : '<p>' + esc(L(P().diagnostic.intro)) + '</p><button class="btn btn-primary btn-sm" data-go="pyai/diagnostic">' + IC.target + t('Diagnostikani boshlash', 'Start the diagnostic') + '</button>', IC.target);
    var recs = A().recommend();
    h += card(t('Tavsiyalar', 'Recommendations'), recs.length ? '<div class="ms-recs">' + recs.map(function (r) { return '<button class="ms-rec" data-go="' + esc(r.route) + '"><b>' + esc(L(r.title)) + '</b><small>' + IC.bulb + esc(L(r.why)) + '</small></button>'; }).join('') + '</div>' : '<p class="hint">—</p>', IC.bulb);
    var mx = A().mixedSet(8);
    h += card(t('Aralash mashq', 'Mixed practice'), mx.items.length ? '<p class="hint">' + t("Oldingi " + mx.lessons + " ta darsdan aralash savollar — eslash mavzular almashganda kuchliroq bo'ladi.", 'Mixed questions from your ' + mx.lessons + ' earlier lessons — recall is stronger when topics alternate.') + '</p><button class="btn btn-primary btn-sm" data-go="pyai/mixed">' + IC.layers + t('Boshlash', 'Start') + ' (' + mx.items.length + ')</button>' : '<p class="hint">' + t("Bir nechta darsni ochgandan keyin paydo bo'ladi.", 'Appears after you have opened a few lessons.') + '</p>', IC.layers);
    h += card(t('Holat', 'Status'), '<div class="stat-grid">' + tile(t('Modullar', 'Modules'), cs.modules.filter(function (x) { return x.s.complete; }).length + '<small> / ' + cs.modules.length + '</small>') + tile(t('Loyihalar (avto-tekshiruv)', 'Projects (auto-checked)'), cs.projects.filter(function (x) { return x.s.autoChecked; }).length + '<small> / ' + cs.projects.length + '</small>') + tile(t('Takror', 'Reviews due'), A().reviewDue().length) + '</div><button class="btn btn-quiet btn-sm" data-go="pyai/progress">' + IC.trend + t('Batafsil progress', 'Full progress') + '</button> <button class="btn btn-quiet btn-sm" data-go="pyai/legacy">' + t('Eski kurs xaritasi', 'Legacy course map') + '</button>', IC.trend);
    h += '</aside></div>';
    MOUNT = null;
    return h + '</div>';
  };

  /* ====================== DIAGNOSTIKA ================================== */
  var DG = null;
  VIEWS.diagnostic = function () {
    var D = P().diagnostic;
    if (!DG) DG = { answers: {}, done: null };
    var h = page(t('Diagnostika', 'Diagnostic'), L(D.intro), 'home');
    if (DG.done) {
      var r = DG.done, nm = function (k) { var l = A().lesson(r.topics[k].lesson); return l ? L(l.title) : k; };
      h += card(t('Natija', 'Result'), '<div class="stat-grid">' + tile(t("To'g'ri", 'Correct'), r.correct + '<small> / ' + r.total + '</small>') + tile(t('Kuchli mavzular', 'Strong topics'), r.strong.length) + tile(t('Zaif mavzular', 'Weak topics'), r.weak.length, null, r.weak.length ? 'red' : '') + '</div>' +
        (r.weak.length ? '<p><b>' + t('Takrorlash kerak: ', 'Needs work: ') + '</b>' + r.weak.map(function (k) { return '<a href="#/pyai/l/' + esc(r.topics[k].lesson) + '">' + esc(nm(k)) + '</a>'; }).join(', ') + '</p>' : '') +
        (r.strong.length ? '<p><b>' + t('Kuchli: ', 'Strong: ') + '</b>' + r.strong.map(nm).map(esc).join(', ') + '</p>' : '') +
        '<div class="callout tip"><span class="co-ic">' + IC.target + '</span><div>' + t('Tavsiya etilgan boshlash: ', 'Recommended start: ') + '<a href="#/pyai/l/' + esc(r.start) + '">' + esc(L(A().lesson(r.start).title)) + '</a>. ' + t("Bu faqat tavsiya — istalgan darsni ochib, takrorlashingiz mumkin.", 'This is only a suggestion — every lesson stays open for review.') + '</div></div>' +
        '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-go="pyai/l/' + esc(r.start) + '">' + IC.arrowR + t('Boshlash', 'Start') + '</button><button class="btn btn-quiet btn-sm" id="dgAgain">' + t('Qayta', 'Retake') + '</button></div>', IC.check);
      MOUNT = function () { var b = $('#dgAgain'); if (b) b.addEventListener('click', function () { DG = null; App.render(); }); };
      return h + '</div>';
    }
    h += card(t('Savollar', 'Questions') + ' · ' + D.items.length, D.items.map(function (q, i) {
      return '<div class="py-mcq"><p class="py-q"><b>' + (i + 1) + '.</b> ' + t('Natija nima?', 'What is the result?') + '</p>' + codeBlock(q.q, 'Python', { runnable: false }) + '<div class="py-opts">' + q.opts.map(function (o, j) { return '<button class="py-opt' + (DG.answers[i] === j ? ' sel' : '') + '" data-dg="' + i + ':' + j + '">' + String.fromCharCode(65 + j) + ') ' + esc(o) + '</button>'; }).join('') + '</div></div>';
    }).join(''), IC.target);
    h += card(t("Qisqa funksiya", 'Short function'), exBlock(D.code, t('Kod vazifasi', 'Coding task')), IC.code);
    var n = Object.keys(DG.answers).length;
    h += '<div class="ms-acts"><span class="hint">' + n + ' / ' + D.items.length + '</span><button class="btn btn-primary" id="dgFinish">' + IC.check + t('Natijani hisoblash', 'Score it') + '</button></div>';
    MOUNT = function () {
      $$('[data-dg]').forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.dg.split(':'); DG.answers[p[0]] = Number(p[1]); App.render(); }); });
      mountEx();
      $('#dgFinish').addEventListener('click', function () {
        if (Object.keys(DG.answers).length < D.items.length && !confirm(t("Javobsiz savollar noto'g'ri hisoblanadi. Davom etasizmi?", 'Unanswered questions count as wrong. Continue?'))) return;
        DG.done = A().saveDiagnostic(DG.answers, A().passed(D.code.id)); App.render(); window.scrollTo(0, 0);
      });
    };
    return h + '</div>';
  };

  /* ====================== MODUL ======================================== */
  VIEWS.m = function (parts) {
    var m = A().module(parts[1]); if (!m) return page(t('Topilmadi', 'Not found'), '', 'home') + '</div>';
    if (parts[2] === 'test') return moduleTest(m);
    var s = A().moduleStatus(m.id);
    var h = page(t('Modul ', 'Module ') + m.n + ': ' + L(m.title), L(m.goal), 'home');
    h += '<div class="stat-grid ms-stats">' + tile(t("Ko'rilgan bo'limlar", 'Sections viewed'), s.viewed + '<small> / ' + s.viewedOf + '</small>') + tile(t('Urinilgan mashqlar', 'Exercises attempted'), s.attempted + '<small> / ' + s.exTotal + '</small>') + tile(t("O'tgan mashqlar", 'Exercises passed'), s.passed + '<small> / ' + s.exTotal + '</small>') + tile(t('Tugallangan', 'Completed'), s.completed + '<small> / ' + s.lessons + '</small>') + tile(t('Mahorat', 'Mastered'), s.mastered + '<small> / ' + s.lessons + '</small>', null, 'gold') + '</div>';
    h += card(t('Darslar', 'Lessons'), '<div class="py-lessons">' + m.lessons.map(function (id, i) {
      var Ls = A().lesson(id), st = A().lessonStatus(id);
      return '<button class="py-les" data-go="pyai/l/' + id + '"><span class="py-ln">' + (i + 1) + '</span><span class="py-lt"><b>' + esc(L(Ls.title)) + '</b><small>' + esc(L(Ls.goal)) + (Ls.legacy && Ls.legacy.length ? ' · ' + t('eski darslar: ', 'legacy days: ') + Ls.legacy.join(', ') : Ls.isNew ? ' · ' + t('yangi mavzu', 'new topic') : '') + '</small></span>' + lessonChips(st) + '</button>';
    }).join('') + '</div>', IC.book);
    if (m.workshop && m.workshop.length) h += card(t('Workshop: refactor · tushuntirish · loyihalash', 'Workshop: refactor · explain · design'), '<div class="py-lessons">' + m.workshop.map(function (w) {
      var stt = w.type === 'refactor' ? (A().passedIndependent(w.id) ? chip(t("o'tdi", 'passed'), 'ok') : A().attempted(w.id) ? chip(t('urinilgan', 'attempted'), 'mid') : '') : (function () { var ws = A().writtenStatus(w.id); return ws.submitted ? chip(t("yozilgan · o'z bahosi ", 'written · self-check ') + ws.self + '/' + ws.of, 'done') : ''; })();
      var tl = { refactor: 'Refactor', explain: t('Kodni tushuntirish', 'Explain the code'), design: t('Yechimni loyihalash', 'Design a solution') }[w.type];
      return '<button class="py-les" data-go="pyai/w/' + w.id + '"><span class="py-ln">' + (w.type === 'refactor' ? IC.code : IC.pen) + '</span><span class="py-lt"><b>' + esc(tl) + '</b><small>' + esc(L(w.prompt).slice(0, 140)) + '…</small></span>' + stt + '</button>';
    }).join('') + '</div>', IC.layers);
    if (m.test) h += card(t('Modul testi', 'Module test'), '<p>' + t(m.test.items.length + ' ta savol + amaliy kod vazifasi. O\'tish: ≥ ' + Math.round(P().config.moduleTestPass * 100) + '% va vazifa testlardan o\'tgan.', m.test.items.length + ' questions + a practical coding task. Pass: ≥ ' + Math.round(P().config.moduleTestPass * 100) + '% and the task passing its tests.') + '</p>' +
      (s.tests.length ? '<div class="ms-att">' + s.tests.slice().reverse().map(function (x) { return '<div><span>' + esc(x.at) + '</span><b>' + x.score + '/' + x.total + '</b><small>' + t('vazifa: ', 'task: ') + (x.task ? '✓' : '✗') + '</small></div>'; }).join('') + '</div>' : '') +
      '<button class="btn ' + (s.testPassed ? 'btn-quiet' : 'btn-primary') + ' btn-sm" data-go="pyai/m/' + m.id + '/test">' + (s.testPassed ? t("Qayta topshirish", 'Retake') : t('Testni boshlash', 'Start the test')) + '</button>' + (s.testPassed ? ' ' + chip(t("o'tgan", 'passed'), 'ok') : ''), IC.target);
    MOUNT = null;
    return h + '</div>';
  };
  var MT = {};
  function moduleTest(m) {
    var T0 = MT[m.id] = MT[m.id] || { ans: {}, done: null };
    var h = page(t('Modul ', 'Module ') + m.n + ' — ' + t('test', 'test'), L(m.title), 'home');
    if (T0.done) {
      var d = T0.done;
      h += card(t('Natija', 'Result'), '<div class="stat-grid">' + tile(t('Savollar', 'Questions'), d.score + '<small> / ' + d.total + '</small>') + tile(t('Amaliy vazifa', 'Coding task'), d.task ? '✓' : '✗', null, d.task ? '' : 'red') + tile(t('Holat', 'Status'), d.passed ? t("O'tdi", 'Passed') : t("O'tmadi", 'Not passed'), null, d.passed ? 'gold' : 'red') + '</div>' +
        m.test.items.map(function (q, i) { var a = T0.ans[i]; return '<div class="py-mcq"><p class="py-q">' + (i + 1) + '. ' + (a === q.a ? '✓' : '✗') + '</p>' + codeBlock(L(q.q), 'Python', { runnable: false }) + '<p class="hint">' + t("To'g'ri: ", 'Answer: ') + esc(q.opts[q.a]) + ' — ' + md(q.why) + '</p></div>'; }).join('') +
        '<div class="ms-acts"><button class="btn btn-quiet btn-sm" id="mtAgain">' + t('Qayta topshirish (oldingi natijalar saqlanadi)', 'Retake (earlier results are kept)') + '</button><button class="btn btn-ghost btn-sm" data-go="pyai/m/' + m.id + '">' + t('Modulga', 'Back to module') + '</button></div>', IC.check);
      MOUNT = function () { $('#mtAgain').addEventListener('click', function () { MT[m.id] = null; App.render(); }); };
      return h + '</div>';
    }
    h += card(t('Savollar', 'Questions'), m.test.items.map(function (q, i) {
      return '<div class="py-mcq"><p class="py-q"><b>' + (i + 1) + '.</b></p>' + (typeof q.q === 'string' ? codeBlock(q.q, 'Python', { runnable: false }) : '<p class="py-q">' + md(q.q) + '</p>') + '<div class="py-opts">' + q.opts.map(function (o, j) { return '<button class="py-opt' + (T0.ans[i] === j ? ' sel' : '') + '" data-mt="' + i + ':' + j + '">' + String.fromCharCode(65 + j) + ') ' + md(o) + '</button>'; }).join('') + '</div></div>';
    }).join(''), IC.target);
    h += card(t('Amaliy vazifa', 'Coding task'), exBlock(m.test.task, t('Vazifa', 'Task')), IC.code);
    h += '<div class="ms-acts"><button class="btn btn-primary" id="mtFinish">' + IC.check + t('Yakunlash', 'Finish') + '</button></div>';
    MOUNT = function () {
      $$('[data-mt]').forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.mt.split(':'); T0.ans[p[0]] = Number(p[1]); App.render(); }); });
      mountEx();
      $('#mtFinish').addEventListener('click', function () {
        var score = m.test.items.filter(function (q, i) { return T0.ans[i] === q.a; }).length, task = A().passed(m.test.task.id);
        if (!task && !confirm(t("Amaliy vazifa hali testlardan o'tmagan — test o'tmagan deb hisoblanadi. Yakunlaysizmi?", 'The coding task has not passed its tests yet — the test will count as not passed. Finish anyway?'))) return;
        m.test.items.forEach(function (q, i) { A().answerMcq(m.id + ':test:' + i, T0.ans[i] === q.a); });
        A().recordModuleTest(m.id, score, m.test.items.length, task);
        T0.done = { score: score, total: m.test.items.length, task: task, passed: A().moduleTestPassed(m.id) && score / m.test.items.length >= P().config.moduleTestPass && task };
        App.render(); window.scrollTo(0, 0);
      });
    };
    return h + '</div>';
  }

  /* ====================== DARS ========================================= */
  VIEWS.l = function (parts) {
    var id = parts[1], Ls = A().lesson(id);
    if (!Ls) return page(t('Dars topilmadi', 'Lesson not found'), '', 'home') + '</div>';
    var m = A().module(Ls.module), st = A().lessonStatus(id), order = m.lessons, idx = order.indexOf(id);
    var h = page(L(Ls.title), t('Modul ', 'Module ') + m.n + ' · ' + L(m.title), 'home');
    h += '<div class="py-lhead">' + lessonChips(st) + chip(t("ko'rilgan ", 'viewed ') + st.viewed + '/' + st.viewedOf) + chip(t("mashqlar o'tgan ", 'exercises passed ') + st.passed + '/' + st.exTotal) + (st.knowledge.score != null ? chip(t('tekshiruv ', 'checks ') + Math.round(st.knowledge.score * 100) + '%') : '') + '</div>';
    if (Ls.legacy && Ls.legacy.length) {
      var lg = st.legacy;
      h += '<div class="callout tip"><span class="co-ic">' + IC.book + '</span><div>' + t("Bu dars eski 30 kunlik kursdagi darslarni yaxshilaydi. Asl darslar o'zgarmagan: ", 'This lesson improves lessons from the original 30-day course. The originals are unchanged: ') + lg.days.map(function (x) { return '<a href="#/lesson/' + x.day + '">' + t(x.day + '-dars', 'Day ' + x.day) + '</a>' + (x.best != null ? ' (' + x.best + '/10)' : ''); }).join(' · ') + (lg.all ? '. ' + t("Eski kursdagi natijangiz bu darsni 'tugallangan (eski kurs)' qiladi; mahorat uchun amaliy mashq kerak.", "Your legacy results mark this lesson 'completed (legacy)'; mastery still needs the practical exercise.") : '') + '</div></div>';
    }
    /* 1–2. Maqsad va prerekvizitlar */
    h += card(t('1. Maqsad', '1. Goal'), '<p>' + esc(L(Ls.goal)) + '</p>' + ((Ls.prereq || []).length ? '<p class="hint">' + t('2. Oldin: ', '2. Prerequisites: ') + Ls.prereq.map(function (p) { var pl = A().lesson(p), ps = A().lessonStatus(p); return '<a href="#/pyai/l/' + p + '">' + esc(L(pl.title)) + '</a>' + (ps.completed ? ' ✓' : ''); }).join(', ') + ' — ' + t('tavsiya, majburiy emas', 'recommended, not required') + '</p>' : ''), IC.target);
    /* 3. Tushuncha */
    h += sec('concept', t('3. Tushuncha', '3. Concept'), '<p class="py-concept">' + md(Ls.concept) + '</p>' + (Ls.analogy ? '<div class="callout tip"><span class="co-ic">' + IC.bulb + '</span><div>' + md(Ls.analogy) + '</div></div>' : '') +
      '<div class="py-terms">' + Ls.terms.map(function (x) { return '<span><b>' + esc(x[0]) + '</b> — ' + esc(x[1]) + '</span>'; }).join('') + '</div>', IC.book);
    /* 4–5. Misol va izoh */
    h += sec('example', t('4. Ishlaydigan misol va 5. izoh', '4. Worked example and 5. walkthrough'), codeBlock(Ls.example.code, 'Python') + '<ol class="py-walk">' + Ls.example.walk.map(function (w) { return '<li><b>' + t(w[0] + '-qator', 'line ' + w[0]) + ':</b> ' + md(w[1]) + '</li>'; }).join('') + '</ol>', IC.code);
    /* 6. Taxmin */
    var pk = id + ':predict';
    h += sec('predict', t('6. Ishga tushirishdan oldin taxmin qiling', '6. Predict before running'), mcqBlock(pk, { q: { uz: 'Natija qanday bo\'ladi?', en: 'What happens?' }, opts: Ls.predict.opts, a: Ls.predict.a, why: Ls.predict.why }, { code: Ls.predict.code }), IC.brain);
    /* Keng tarqalgan xato */
    h += card(t('Keng tarqalgan xato', 'Common mistake'), '<div class="py-two">' + codeBlock(Ls.mistake.bad, t("Noto'g'ri", 'Wrong'), { runnable: false }) + codeBlock(Ls.mistake.good, t("To'g'ri", 'Right'), { runnable: false }) + '</div><p>' + md(Ls.mistake.why) + '</p>', IC.alert);
    /* 7–9. Mashqlar */
    h += sec('guided', t("7. Yo'naltirilgan mashq", '7. Guided practice'), exBlock(Ls.guided, t("Yo'naltirilgan", 'Guided')), IC.pen);
    h += sec('independent', t('8. Mustaqil mashq', '8. Independent practice'), exBlock(Ls.independent, t('Mustaqil', 'Independent')), IC.pen);
    h += sec('debug', t('9. Xatoni toping va tuzating', '9. Debugging challenge'), exBlock(Ls.debug, 'Debug'), IC.alert);
    /* 10. Bilim tekshiruvi */
    var qmap = {}; qmap[pk] = { q: '', opts: Ls.predict.opts, a: Ls.predict.a, why: Ls.predict.why, meta: { lesson: id } };
    h += sec('check', t('10. Bilim tekshiruvi', '10. Knowledge check'), Ls.check.map(function (q, i) { var k = id + ':check:' + i; qmap[k] = Object.assign({ meta: { lesson: id } }, q); return mcqBlock(k, q); }).join(''), IC.checklist);
    /* 11–12 */
    h += card(t('11. Amalda qayerda kerak', '11. Real-world use'), '<p>' + md(Ls.real) + '</p>', IC.rocket);
    if (Ls.setup) h += card(t('Sozlash qadamlari', 'Setup steps'), '<ol class="ms-ol">' + Ls.setup.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ol><div class="gc-l">' + t('Muammo bo\'lsa', 'Troubleshooting') + '</div><ul class="ms-ul">' + Ls.trouble.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ul>', IC.settings);
    h += card(t('12. Xulosa', '12. Summary'), '<ul class="ms-ul">' + Ls.summary.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ul>', IC.notebook);
    /* 13. Exit */
    h += card(t('13. Yakuniy tekshiruv', '13. Exit assessment'), Ls.exit.map(function (q, i) { var k = id + ':exit:' + i; qmap[k] = Object.assign({ meta: { lesson: id } }, q); return mcqBlock(k, q); }).join(''), IC.target);
    /* 14. Takror */
    var cfg = P().config, req = st.mastered ? t("Mahoratga erishildi. Bu dars 1–3–7–14 kun oralig'ida eslash uchun takror navbatiga qo'shiladi.", 'Mastered. This lesson joins the review queue for recall at 1–3–7–14 day intervals.')
      : t('Mahorat uchun: barcha talab qilingan bo\'limlar ko\'rilgan, tekshiruv + yakuniy savollarda ≥ ' + Math.round(cfg.mastery * 100) + '%, mustaqil mashq yechim ochilmasdan o\'tgan. Xato javoblar avtomatik takror navbatiga tushadi.', 'For mastery: all required sections viewed, ≥ ' + Math.round(cfg.mastery * 100) + '% on checks + exit questions, and the independent exercise passed without opening the solution. Wrong answers join the review queue automatically.');
    h += card(t('14. Takror rejasi', '14. Review scheduling'), '<p>' + esc(req) + '</p>', IC.refresh);
    h += '<div class="lesson-nav no-print">' + (idx > 0 ? '<button class="btn btn-ghost" data-go="pyai/l/' + order[idx - 1] + '">' + IC.arrowL + esc(L(A().lesson(order[idx - 1]).title)) + '</button>' : '<button class="btn btn-ghost" data-go="pyai/m/' + m.id + '">' + IC.arrowL + t('Modul', 'Module') + '</button>') +
      (idx < order.length - 1 ? '<button class="btn btn-primary" data-go="pyai/l/' + order[idx + 1] + '">' + esc(L(A().lesson(order[idx + 1]).title)) + IC.arrowR + '</button>' : (m.test ? '<button class="btn btn-primary" data-go="pyai/m/' + m.id + '/test">' + t('Modul testi', 'Module test') + IC.arrowR + '</button>' : '')) + '</div>';
    MOUNT = function () {
      A().touch('pyai/l/' + id, L(Ls.title));
      if (st.mastered) A().scheduleLessonRecall(id);
      mountEx(); mountMcq(qmap);
      /* bo'lim ko'rinsa (≥ 40% ekranda, 1.2 s) — "ko'rilgan" */
      if ('IntersectionObserver' in window) {
        var timers = {};
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) {
            var s = e.target.dataset.sec;
            if (e.isIntersecting) timers[s] = setTimeout(function () { if (A().markViewed(id, s)) { var c = e.target.querySelector('.py-seen'); if (c) c.hidden = false; } io.unobserve(e.target); }, 1200);
            else clearTimeout(timers[s]);
          });
        }, { threshold: 0.4 });
        $$('[data-sec]').forEach(function (el) { if (!(A().S().view[id] || { sec: {} }).sec[el.dataset.sec]) io.observe(el); });
      } else $$('[data-sec]').forEach(function (el) { A().markViewed(id, el.dataset.sec); });
    };
    return h + '</div>';
    function sec(key, title, body, ic) {
      var seen = !!(A().S().view[id] || { sec: {} }).sec[key];
      return '<section class="card ms-card py-sec" data-sec="' + key + '"><h3 class="card-title">' + (ic ? '<span class="num">' + ic + '</span>' : '') + esc(title) + '<span class="py-seen"' + (seen ? '' : ' hidden') + '>' + IC.check + '</span></h3>' + body + '</section>';
    }
  };

  /* ====================== WORKSHOP VAZIFASI =========================== */
  VIEWS.w = function (parts) {
    var f = A().findEx(parts[1]); if (!f || !f.module) return page(t('Topilmadi', 'Not found'), '', 'home') + '</div>';
    var w = f.ex, m = A().module(f.module);
    var title = { refactor: 'Refactor', explain: t('Kodni tushuntirish', 'Explain the code'), design: t('Yechimni loyihalash', 'Design a solution') }[w.type];
    var h = page(title, t('Modul ', 'Module ') + m.n + ' · ' + L(m.title), 'home');
    if (w.type === 'refactor') {
      h += card(title, '<p class="hint">' + t("Refactor — xatti-harakat o'zgarmaydi, kod tozalanadi. Testlar ikkalasini ham tekshiradi.", 'Refactoring keeps behaviour and cleans the code. The tests check both.') + '</p>' + exBlock(w, 'Refactor'), IC.code);
      MOUNT = function () { mountEx(); };
      return h + '</div>';
    }
    var rec = (A().S().written || {})[w.id], last = rec ? rec.versions[rec.versions.length - 1] : null;
    var body = '<p class="py-prompt">' + md(w.prompt) + '</p>' + (w.code ? codeBlock(w.code, 'Python', { runnable: false }) : '') +
      '<label class="field"><span>' + t('Javobingiz (kamida ' + (w.minWords || 40) + " so'z)", 'Your answer (at least ' + (w.minWords || 40) + ' words)') + ' · <b id="wkWc">' + A().words(last ? last.text : '') + '</b></span><textarea class="textarea" id="wkText" rows="9">' + esc(last ? last.text : (A().draft(w.id) || '')) + '</textarea></label>' +
      '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="wkSave">' + IC.check + (last ? t('Yangi versiyani saqlash', 'Save a new version') : t('Topshirish', 'Submit')) + '</button></div>' +
      '<p class="hint">' + t("Bu javob avtomatik baholanmaydi. Topshirgandan keyin namunaviy javob va mezonlar ochiladi — o'zingizni halol belgilang.", 'This answer is not auto-graded. After submitting, a model answer and criteria appear — mark yourself honestly.') + '</p>';
    h += card(title, body, IC.pen);
    if (last) {
      var c = rec.checks || {};
      h += card(t('Namunaviy javob (ko\'chirmang — solishtiring)', 'Model answer (compare, do not copy)'), '<p>' + md(w.model) + '</p>', IC.bulb);
      h += card(t("Mezonlar (o'z-o'zini tekshirish)", 'Criteria (self-check)'), w.rubric.map(function (r, i) { return '<label class="ms-ckl"><input type="checkbox" data-wr="' + i + '"' + (c[i] ? ' checked' : '') + '> ' + esc(L(r)) + '</label>'; }).join('') + '<p class="hint">' + t('Versiyalar: ', 'Versions: ') + rec.versions.length + ' · ' + esc(last.at) + '</p>', IC.checklist);
    }
    MOUNT = function () {
      var ta = $('#wkText'), wc = $('#wkWc');
      ta.addEventListener('input', function () { wc.textContent = A().words(ta.value); A().draft(w.id, ta.value); });
      $('#wkSave').addEventListener('click', function () {
        try { A().saveWritten(w.id, ta.value); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); }
        catch (e) { toast(e.message === 'short' ? t("Javob juda qisqa — kamida " + (w.minWords || 40) + " so'z", 'Too short — at least ' + (w.minWords || 40) + ' words') : e.message, 'warn'); }
      });
      $$('[data-wr]').forEach(function (cb) { cb.addEventListener('change', function () { var cc = {}; $$('[data-wr]').forEach(function (x) { cc[x.dataset.wr] = x.checked; }); A().setWrittenChecks(w.id, cc); }); });
    };
    return h + '</div>';
  };

  /* ====================== ARALASH MASHQ =============================== */
  VIEWS.mixed = function () {
    var mx = A().mixedSet(8);
    var h = page(t('Aralash mashq', 'Mixed practice'), t("Turli darslardan savollar navbatma-navbat (interleaving). Xato javoblar takror navbatiga tushadi.", 'Questions from different lessons in alternation (interleaving). Wrong answers join the review queue.'), 'review');
    if (!mx.items.length) { h += card(t("Hali yo'q", 'Not yet'), '<p class="hint">' + t("Avval bir nechta darsni oching.", 'Open a few lessons first.') + '</p>', IC.layers); MOUNT = null; return h + '</div>'; }
    var qmap = {};
    h += card(t('Savollar', 'Questions') + ' · ' + mx.items.length, mx.items.map(function (it) { qmap[it.key] = Object.assign({ meta: { lesson: it.key.split(':')[0] } }, it.q); var lt = A().lesson(it.key.split(':')[0]); return '<div class="gc-l">' + esc(L(lt.title)) + '</div>' + mcqBlock(it.key, it.q, { code: it.code, similar: false }); }).join(''), IC.layers);
    MOUNT = function () { mountMcq(qmap); };
    return h + '</div>';
  };

  /* ====================== TAKROR NAVBATI =============================== */
  var RV = null;
  VIEWS.review = function () {
    var h = page(t('Takror navbati', 'Review queue'), t("Natijaga qarab: xato — ertaga, mustaqil to'g'ri — oraliq uzayadi (1 · 3 · 7 · 14 …). Javobni ko'rishdan OLDIN eslang.", 'Driven by results: wrong → tomorrow, independent correct → longer interval (1 · 3 · 7 · 14 …). Recall BEFORE looking.'), 'review');
    if (!RV) RV = { list: A().reviewDue().slice(0, 25).map(function (x) { return x.key; }), i: 0, shown: false };
    var key = RV.list[RV.i];
    if (!key) { h += card(t('Navbat bo\'sh', 'Queue empty'), '<p>' + t("Hozircha takror kutayotgan narsa yo'q.", 'Nothing is due right now.') + '</p><button class="btn btn-quiet btn-sm" id="rvR">' + t('Yangilash', 'Refresh') + '</button>', IC.check); MOUNT = function () { $('#rvR').addEventListener('click', function () { RV = null; App.render(); }); }; return h + '</div>'; }
    var body = '<p class="ms-count">' + (RV.i + 1) + ' / ' + RV.list.length + '</p>', kind = key.split(':')[0];
    if (kind === 'mcq') {
      var k = key.slice(4), parts = k.split(':'), q = null, code = null;
      if (parts[0] === 'diag') { var dq = P().diagnostic.items[Number(parts[1])]; q = { q: { uz: 'Natija nima?', en: 'What is the result?' }, opts: dq.opts, a: dq.a, why: dq.why }; code = dq.q; }
      else { var Ls = A().lesson(parts[0]), mm = A().module(parts[0]); if (Ls && parts[1] === 'predict') { q = { q: { uz: 'Natija nima?', en: 'What happens?' }, opts: Ls.predict.opts, a: Ls.predict.a, why: Ls.predict.why }; code = Ls.predict.code; } else if (Ls) q = Ls[parts[1]][Number(parts[2])]; else if (mm && mm.test) { q = mm.test.items[Number(parts[2])]; if (typeof q.q === 'string') { code = q.q; q = Object.assign({}, q, { q: { uz: 'Natija nima?', en: 'What is the result?' } }); } } }
      if (!q) { RV.i++; return VIEWS.review(); }
      var qmap = {}; qmap[k] = q;
      body += mcqBlock(k, q, { code: code }) + (QZ[k] != null ? '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="rvNext">' + t('Keyingi', 'Next') + IC.arrowR + '</button></div>' : '');
      h += card(t('Savol', 'Question'), body, IC.refresh);
      MOUNT = function () { mountMcq(qmap, function (kk, right) { A().reviewRate('mcq:' + kk, right ? 'independent' : 'wrong'); }); var n = $('#rvNext'); if (n) n.addEventListener('click', function () { delete QZ[k]; RV.i++; App.render(); }); };
    } else if (kind === 'ex') {
      var exId = key.slice(3), f = A().findEx(exId);
      if (!f) { RV.i++; return VIEWS.review(); }
      body += '<p>' + t("Bu mashqni qaytadan, yordam va yechimsiz yechib ko'ring. Kodingiz tozalangan.", 'Solve this exercise again, without hints or the solution. Your code was cleared.') + '</p>' + exBlock(Object.assign({}, f.ex), t('Takror', 'Review'));
      body += '<div class="ms-acts"><button class="btn btn-quiet btn-sm" id="rvSkip">' + t("Keyinroq (ertaga)", 'Later (tomorrow)') + '</button>' + (f.lesson ? '<button class="btn btn-quiet btn-sm" data-go="pyai/l/' + f.lesson + '">' + t('Darsni ochish', 'Open the lesson') + '</button>' : '') + '</div>';
      h += card(t('Mashq', 'Exercise'), body, IC.code);
      MOUNT = function () {
        if (!RV.cleared) { RV.cleared = {}; } if (!RV.cleared[exId]) { RV.cleared[exId] = 1; A().draft(exId, null); delete RES[exId]; }
        mountEx(function (a) { if (a.pass) { toast(t("O'tdi — keyingi takror uzoqroq", 'Passed — next review further out'), 'ok'); RV.i++; } });
        $('#rvSkip').addEventListener('click', function () { A().reviewRate(key, 'wrong'); RV.i++; App.render(); });
      };
    } else {
      var lid = key.slice(7), Lr = A().lesson(lid);
      if (!Lr) { RV.i++; return VIEWS.review(); }
      body += '<p class="py-q big">' + esc(L(Lr.title)) + '</p><p>' + t("Asosiy g'oyalarni eslang (yozib ko'ring), keyin xulosa bilan solishtiring.", 'Recall the key ideas (write them down), then compare with the summary.') + '</p>';
      if (!RV.shown) body += '<button class="btn btn-primary btn-sm" id="rvShow">' + t("Xulosani ko'rsatish", 'Show the summary') + '</button>';
      else body += '<ul class="ms-ul">' + Lr.summary.map(function (s) { return '<li>' + md(s) + '</li>'; }).join('') + '</ul><div class="ms-acts"><button class="btn btn-primary btn-sm" data-rr="independent">' + t('Hammasini esladim', 'Recalled it all') + '</button><button class="btn btn-ghost btn-sm" data-rr="partial">' + t('Qisman', 'Partly') + '</button><button class="btn btn-quiet btn-sm" data-rr="wrong">' + t('Eslay olmadim', 'Could not recall') + '</button></div>';
      h += card(t('Darsni eslash', 'Lesson recall'), body, IC.brain);
      MOUNT = function () { var s = $('#rvShow'); if (s) s.addEventListener('click', function () { RV.shown = true; App.render(); }); $$('[data-rr]').forEach(function (b) { b.addEventListener('click', function () { A().reviewRate(key, b.dataset.rr); RV.shown = false; RV.i++; App.render(); }); }); };
    }
    return h + '</div>';
  };

  /* ====================== PROGRESS ===================================== */
  VIEWS.progress = function () {
    var cs = A().courseStatus(), S0 = A().S();
    var viewed = 0, viewedOf = 0, att = 0, pass = 0, exT = 0, mast = 0, comp = 0, nL = 0;
    Object.keys(P().lessons).forEach(function (id) { var s = A().lessonStatus(id); viewed += s.viewed; viewedOf += s.viewedOf; att += s.attempted; pass += s.passed; exT += s.exTotal; if (s.mastered) mast++; if (s.completed) comp++; nL++; });
    var projSub = cs.projects.filter(function (x) { return x.s.submitted; }).length, projAuto = cs.projects.filter(function (x) { return x.s.autoChecked; }).length;
    var h = page(t('Progress', 'Progress'), t("Har metrika alohida — ko'rish, urinish, o'tish, mahorat va loyiha tekshiruvi bir-biriga aralashtirilmaydi. O'quv vaqti bu kursda o'lchanmaydi (yozilmagan ma'lumot to'qilmaydi).", 'Each metric is separate — viewing, attempting, passing, mastery and project checks are never mixed. Study time is not tracked in this course (no invented data).'), 'progress');
    h += '<div class="stat-grid ms-stats">' + tile(t("Ko'rilgan bo'limlar", 'Content viewed'), viewed + '<small> / ' + viewedOf + '</small>') + tile(t('Urinilgan mashqlar', 'Exercises attempted'), att + '<small> / ' + exT + '</small>') + tile(t("O'tgan mashqlar", 'Exercises passed'), pass + '<small> / ' + exT + '</small>') + tile(t('Tugallangan darslar', 'Lessons completed'), comp + '<small> / ' + nL + '</small>') + tile(t('Mahorat', 'Mastery achieved'), mast + '<small> / ' + nL + '</small>', null, 'gold') + tile(t('Loyiha topshirilgan', 'Projects submitted'), projSub + '<small> / 5</small>') + tile(t('Loyiha avto-tekshirilgan', 'Projects auto-checked'), projAuto + '<small> / 5</small>') + tile(t('Takror kutmoqda', 'Review items due'), A().reviewDue().length) + '</div>';
    var wt = A().weekTime(), goal = (S0.settings || {}).dailyMin || 60, wmax = Math.max(goal, Math.max.apply(null, wt.map(function (x) { return x.min; })));
    h += card(t("O'quv vaqti (shu kurs sahifalari ochiq va ko'rinib turgan daqiqalar)", 'Study time (minutes this course was open and visible)'), '<div class="ms-week">' + wt.map(function (x) { return '<div class="ms-wd" title="' + esc(x.date) + '"><div class="ms-wbar"><i class="pl" style="height:' + (goal / wmax * 100) + '%"></i><i class="dn" style="height:' + (x.min / wmax * 100) + '%"></i></div><span>' + esc(x.date.slice(8)) + '</span><b>' + x.min + '</b></div>'; }).join('') + '</div>' +
      '<p class="hint">' + t("Kulrang — kunlik maqsad (" + goal + " daq). Vaqt o'rganish dalili emas; o'tkazib yuborilgan kun jarima emas — keyingi tavsiya qilingan darsdan davom eting.", 'Grey — daily goal (' + goal + ' min). Time is not proof of learning; a missed day is not penalised — continue from the next recommended lesson.') + '</p>' +
      '<form id="pySet" class="ms-frow"><label class="field"><span>' + t('Kunlik maqsad (daqiqa)', 'Daily goal (minutes)') + '</span><input class="input" name="goal" inputmode="numeric" value="' + goal + '"></label><label class="field"><span>' + t('Takror oraliqlari (kun, vergul bilan)', 'Review intervals (days, comma-separated)') + '</span><input class="input" name="iv" value="' + esc(A().ivls().join(', ')) + '"></label><button class="btn btn-ghost btn-sm">' + t('Saqlash', 'Save') + '</button></form>', IC.clock);
    h += card(t('Modullar', 'Modules'), '<div class="ms-att">' + cs.modules.map(function (x) { var m = A().module(x.id); return '<div><span>' + m.n + '</span><b>' + esc(L(m.title)) + '</b><small>' + t('tugallangan ', 'completed ') + x.s.completed + '/' + x.s.lessons + ' · ' + t('mahorat ', 'mastered ') + x.s.mastered + ' · ' + t('test ', 'test ') + (x.s.testPassed == null ? '—' : x.s.testPassed ? '✓' : '✗') + '</small><b>' + (x.s.complete ? '✓' : '') + '</b></div>'; }).join('') + '</div>', IC.map);
    /* urinishlar tarixi */
    var hist = [];
    Object.keys(S0.attempts).forEach(function (k) { S0.attempts[k].forEach(function (a) { hist.push({ id: k, a: a }); }); });
    hist.sort(function (x, y) { return (y.a.ts || 0) - (x.a.ts || 0); });
    h += card(t('Urinishlar tarixi (oxirgi 25)', 'Attempt history (latest 25)'), hist.length ? '<div class="ms-att">' + hist.slice(0, 25).map(function (x) { var f = A().findEx(x.id); var where = f && f.lesson ? L(A().lesson(f.lesson).title) : f && f.project ? 'Project ' + f.project : f && f.module ? 'Module test ' + f.module : x.id; return '<div><span>' + esc(x.a.at) + '</span><b>' + esc(where) + '</b><small>' + esc(x.id) + (x.a.hints ? ' · ' + t('yordam ', 'hints ') + x.a.hints : '') + (x.a.sol ? ' · ' + t('yechim ochilgan', 'solution shown') : '') + '</small><b class="' + (x.a.pass ? 'good' : 'bad-l') + '">' + x.a.passed + '/' + x.a.total + '</b></div>'; }).join('') + '</div>' : '<p class="hint">—</p>', IC.clock);
    var skills = Object.keys(P().lessons).filter(function (id) { return A().lessonStatus(id).mastered; });
    h += card(t("Namoyish etilgan ko'nikmalar (mahorat)", 'Skills demonstrated (mastered)'), skills.length ? '<div class="py-skills">' + skills.map(function (id) { return chip(L(A().lesson(id).title), 'ok'); }).join('') + '</div>' : '<p class="hint">' + t("Hali yo'q. Mahorat — mustaqil mashq + ≥ 80% tekshiruv.", 'None yet. Mastery = independent exercise + ≥ 80% on checks.') + '</p>', IC.medal);
    h += card(t('Kursni tugatish uchun qolganlar', 'Outstanding requirements'), cs.missing.length ? '<ul class="ms-ul">' + cs.missing.slice(0, 20).map(function (x) { return '<li>' + (x.kind === 'module' ? '<a href="#/pyai/m/' + x.id + '">' + esc(t('Modul ', 'Module ') + A().module(x.id).n + ': ' + L(A().module(x.id).title)) + '</a>' : x.kind === 'project' ? '<a href="#/pyai/p/' + x.id + '">' + esc(L(P().projects.filter(function (p) { return p.id === x.id; })[0].title)) + '</a> — ' + t('yadro bosqichi testlari', 'core milestone tests') : '<a href="#/pyai/capstone">Capstone</a> — ' + t('rubrika bo\'yicha o\'tish', 'pass on the rubric')) + '</li>'; }).join('') + '</ul>' + (cs.missing.length > 20 ? '<p class="hint">+' + (cs.missing.length - 20) + '</p>' : '') : '<p class="ok-line">' + IC.check + t('Hamma talablar bajarilgan (o\'z bahongiz bilan).', 'All requirements met (self-assessed parts included).') + '</p>', IC.checklist);
    h += card(t('Tozalash', 'Reset'), '<p class="hint">' + t("Faqat Python & AI yo'li progressi o'chadi (mahalliy zaxira saqlanadi). Eski Python kursi, ingliz tili va Mission ma'lumotlariga tegilmaydi.", 'Only the Python & AI path progress is cleared (a local backup is kept). The original Python course, English and Mission data are untouched.') + '</p><button class="btn btn-quiet btn-sm" id="pyReset">' + IC.trash + t('Progressni tozalash…', 'Reset progress…') + '</button>', IC.lock);
    MOUNT = function () {
      $('#pySet').addEventListener('submit', function (e) { e.preventDefault(); try { A().setSettings({ dailyMin: e.target.goal.value, ivls: e.target.iv.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean) }); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); } catch (er) { toast(er.message === 'ivls' ? t("Oraliqlar: kamida 2 ta o'sib boruvchi son (1–90)", 'Intervals: at least 2 increasing numbers (1–90)') : t('Maqsad 10–480 daqiqa', 'Goal must be 10–480 minutes'), 'warn'); } });
      $('#pyReset').addEventListener('click', function () { if (!confirm(t("Python & AI yo'li progressi o'chadi. Davom etasizmi?", 'The Python & AI path progress will be cleared. Continue?'))) return; if ((prompt(t('Tasdiqlash uchun PYAI deb yozing', 'Type PYAI to confirm')) || '').trim().toUpperCase() !== 'PYAI') return; A().reset(); toast(t('Tozalandi (zaxira saqlandi)', 'Reset (backup kept)'), 'ok'); App.go('pyai'); }); };
    return h + '</div>';
  };

  /* ====================== LOYIHALAR ==================================== */
  VIEWS.projects = function () {
    var h = page(t('Loyihalar', 'Projects'), t("5 ta loyiha: har birida avtomatik tekshiriladigan yadro (brauzerda testlar) va o'z-o'zini tekshirish ro'yxati (repo, testlar, README). 'Tekshirilgan' — faqat avtomatik testlar o'tgan qism; qolgani 'o'z bahosi' deb belgilanadi.", '5 projects: each has an auto-checked core (tests in the browser) and a self-check list (repo, tests, README). "Checked" means only the parts whose automated tests passed; the rest is labelled self-assessed.'), 'projects');
    h += P().projects.map(function (p) {
      var s = A().projectStatus(p.id);
      return '<button class="py-proj" data-go="pyai/p/' + p.id + '"><span class="py-mn">P' + p.n + '</span><span class="py-mt"><b>' + esc(L(p.title)) + '</b><small>' + esc(L(p.summary)) + '</small></span><span class="py-mstats">' + (s.autoChecked ? chip(t('yadro tekshirilgan', 'core auto-checked'), 'ok') : chip(t('yadro: hali', 'core: not yet'), '')) + (s.selfAssessed ? chip(t("o'z bahosi: to'liq", 'self-check: complete'), 'done') : '') + (s.repo ? chip('repo', 'mid') : '') + '</span></button>';
    }).join('');
    h += '<div class="ms-acts"><button class="btn btn-ghost" data-go="pyai/capstone">' + IC.medal + 'Capstone</button></div>';
    MOUNT = null;
    return h + '</div>';
  };
  VIEWS.p = function (parts) {
    var p = P().projects.filter(function (x) { return x.id === parts[1]; })[0]; if (!p) return page(t('Topilmadi', 'Not found'), '', 'projects') + '</div>';
    var s = A().projectStatus(p.id), ps = A().S().projects[p.id] || { ms: {} };
    var h = page('P' + p.n + ': ' + L(p.title), L(p.summary), 'projects');
    p.milestones.forEach(function (m) {
      if (m.ex) h += card(L(m.title), exBlock(m.ex, t('Yadro', 'Core')) + '<p class="hint">' + t("Bu yadro mantiq. To'liq loyiha kompyuteringizda: modullar, CLI/UI, testlar, README.", 'This is the core logic. The full project lives on your computer: modules, CLI/UI, tests, README.') + '</p>', IC.code);
      else h += card(L(m.title), '<div class="py-checks">' + m.checks.map(function (c, i) { var on = ((ps.ms[m.id] || {}).checks || {})[i]; return '<label class="ms-ckl"><input type="checkbox" data-pc="' + m.id + ':' + i + '"' + (on ? ' checked' : '') + '> ' + esc(L(c)) + '</label>'; }).join('') + '</div><p class="hint">' + t("O'z-o'zini tekshirish — platforma repo'ingizni tekshira olmaydi.", 'Self-check — the platform cannot inspect your repository.') + '</p>', IC.checklist);
    });
    h += card(t('Repo havolasi', 'Repository link'), '<form id="pjRepo" class="ms-frow"><label class="field"><span>GitHub / GitLab URL</span><input class="input" name="url" value="' + esc(s.repo) + '" placeholder="https://github.com/user/project"></label><button class="btn btn-ghost btn-sm">' + t('Saqlash', 'Save') + '</button></form>', IC.external);
    MOUNT = function () {
      mountEx();
      $$('[data-pc]').forEach(function (cb) { cb.addEventListener('change', function () { var x = cb.dataset.pc.split(':'); A().setProjectCheck(p.id, x[0], Number(x[1]), cb.checked); }); });
      $('#pjRepo').addEventListener('submit', function (e) { e.preventDefault(); try { A().setProjectRepo(p.id, e.target.url.value); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); } catch (er) { toast(t("Faqat https://github.com/… (yoki gitlab/bitbucket) havolasi", 'Only an https://github.com/… (or gitlab/bitbucket) link'), 'warn'); } });
    };
    return h + '</div>';
  };
  VIEWS.capstone = function () {
    var C = P().capstone, c = A().S().capstone || { rubric: {} }, st = A().capstoneStatus();
    var h = page(L(C.title), L(C.brief), 'capstone');
    h += card(t('Rubrika (o\'z bahosi)', 'Rubric (self-assessment)'), '<div class="py-rubric">' + C.rubric.map(function (r) {
      var v = Number(c.rubric[r.k]) || 0;
      return '<div class="py-rrow"><b>' + esc(L(r.name)) + '</b><div class="py-levels">' + r.levels.map(function (lv, i) { return '<button class="py-lv' + (v === i + 1 ? ' on' : '') + '" data-rb="' + r.k + ':' + (i + 1) + '"><i>' + (i + 1) + '</i>' + esc(L(lv)) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div><div class="stat-grid">' + tile(t('Jami', 'Total'), st.total + '<small> / ' + st.max + '</small>') + tile(t('Holat', 'Status'), st.passed ? t("O'tish mezoniga mos (o'z bahosi)", 'Meets the pass rule (self-assessed)') : st.complete ? t('Mezonga yetmagan', 'Below the pass rule') : t("To'liq baholanmagan", 'Not fully rated'), null, st.passed ? 'gold' : '') + '</div><p class="hint">' + esc(L(C.pass)) + '</p>', IC.medal);
    h += card(t('Dalillar', 'Evidence'), '<form id="cpForm" class="ms-form"><label class="field"><span>' + t("Havolalar (repo, demo, eval natijasi) — har biri yangi qatordan", 'Links (repo, demo, eval results) — one per line') + '</span><textarea class="textarea" name="links" rows="3">' + esc(c.links || '') + '</textarea></label><label class="field"><span>' + t("Izoh (tashqi ko'rib chiquvchi bo'lsa, ismi va xulosasi)", 'Notes (external reviewer name and verdict, if any)') + '</span><textarea class="textarea" name="notes" rows="3">' + esc(c.notes || '') + '</textarea></label><button class="btn btn-ghost btn-sm">' + t('Saqlash', 'Save') + '</button></form>', IC.external);
    MOUNT = function () {
      $$('[data-rb]').forEach(function (b) { b.addEventListener('click', function () { var x = b.dataset.rb.split(':'); A().setCapstone(x[0], Number(x[1])); App.render(); }); });
      $('#cpForm').addEventListener('submit', function (e) { e.preventDefault(); var cc = A().S().capstone; cc.links = e.target.links.value.slice(0, 2000); cc.notes = e.target.notes.value.slice(0, 2000); cc.at = Date.now(); A().save(); toast(t('Saqlandi', 'Saved'), 'ok'); });
    };
    return h + '</div>';
  };
  VIEWS.portfolio = function () {
    var pf = A().S().portfolio;
    var h = page('Portfolio', t("Ish beruvchiga ko'rsatishdan oldingi ro'yxat. Bu — o'z-o'zini tekshirish.", 'A checklist before showing your work to employers. Self-check.'), 'portfolio');
    h += card(t("Ro'yxat", 'Checklist'), P().portfolio.map(function (c, i) { return '<label class="ms-ckl"><input type="checkbox" data-pf="' + i + '"' + (pf[i] ? ' checked' : '') + '> ' + esc(L(c)) + '</label>'; }).join('') + '<p class="hint">' + t(Object.keys(pf).filter(function (k) { return pf[k]; }).length + ' / ' + P().portfolio.length + ' belgilangan', Object.keys(pf).filter(function (k) { return pf[k]; }).length + ' / ' + P().portfolio.length + ' ticked') + '</p>', IC.checklist);
    MOUNT = function () { $$('[data-pf]').forEach(function (cb) { cb.addEventListener('change', function () { A().S().portfolio[cb.dataset.pf] = cb.checked; A().save(); }); }); };
    return h + '</div>';
  };
  VIEWS.legacy = function () {
    var h = page(t('Eski Python kursi xaritasi', 'Legacy Python course map'), t("Eski dars → muammo → yaxshilanish → yangi joy. Eski 30 dars o'zgarmagan va #/python dan ochiladi; eski natijalaringiz yangi darslarda 'tugallangan (eski kurs)' sifatida hisoblanadi.", 'Legacy lesson → issue → improvement → new location. The original 30 lessons are unchanged at #/python; your legacy results count as "completed (legacy)" in the new lessons.'), 'home');
    h += card(t('Xarita', 'Map'), '<div class="py-table"><table><tr><th>' + t('Eski', 'Legacy') + '</th><th>' + t('Muammo', 'Issue') + '</th><th>' + t('Yaxshilanish', 'Improvement') + '</th><th>' + t('Yangi joy', 'New location') + '</th><th>' + t('Natijangiz', 'Your result') + '</th></tr>' +
      P().legacyMap.map(function (x) { var c = (window.COURSE || []).filter(function (d) { return d.day === x.day; })[0], b = Store.bestScore ? Store.bestScore(x.day) : null, to = A().lesson(x.to); return '<tr><td><a href="#/lesson/' + x.day + '">' + x.day + '. ' + esc(c ? L(c.title) : '') + '</a></td><td>' + esc(L(x.issue)) + '</td><td>' + esc(L(x.fix)) + '</td><td>' + (to ? '<a href="#/pyai/l/' + x.to + '">' + esc(L(to.title)) + '</a>' : '<a href="#/pyai/m/m1/test">' + t('Modul 1 testi', 'Module 1 test') + '</a>') + '</td><td>' + (b != null ? b + '/10' : '—') + '</td></tr>'; }).join('') + '</table></div><p class="hint">' + t('Yangi mavzular (eski kursda yo\'q): ', 'New topics (not in the legacy course): ') + P().newLessons.map(function (id) { return '<a href="#/pyai/l/' + id + '">' + esc(L(A().lesson(id).title)) + '</a>'; }).join(', ') + '</p>', IC.map);
    MOUNT = null;
    return h + '</div>';
  };

  /* ====================== DISPATCH ===================================== */
  var MIGRATED = false, TICK = null;
  function startTimer() {
    if (TICK) return;
    /* Real vaqt: har daqiqada, faqat sahifa ko'rinib turganda va #/pyai ochiq bo'lsa */
    TICK = setInterval(function () {
      if (document.visibilityState === 'visible' && /^#\/pyai/.test(location.hash)) A().addMinute();
    }, 60000);
  }
  window.PagePyAI = function (path) {
    if (!window.PyAI || !window.PYAI) return '<div class="page"><p>Course not loaded.</p></div>';
    if (!MIGRATED) { MIGRATED = true; try { A().migrate(); } catch (e) {} }
    startTimer();
    var raw = String(path || ''), qi = raw.indexOf('?'), base = qi < 0 ? raw : raw.slice(0, qi);
    var parts = base.split('/').filter(Boolean), v = VIEWS[parts[0] || 'home'] || VIEWS.home;
    if (parts[0] !== 'review') RV = null;
    MOUNT = null;
    try { return v(parts); }
    catch (e) { if (window.console) console.error(e); MOUNT = null; return '<div class="page"><div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t('Sahifani ochishda xato: ', 'Could not open this page: ') + e.message) + '</div></div></div>'; }
  };
  window.PagePyAI.mount = function () { if (MOUNT) { try { MOUNT(); } catch (e) { if (window.console) console.error(e); } } };
})();
