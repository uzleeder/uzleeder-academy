/* ==========================================================================
   DataCamp treki (#/datacamp · #/datacamp/<n>) — Python Programming Fundamentals
   --------------------------------------------------------------------------
   Jadval DCTRACK.meta.start dan: kuniga bitta bob, yakshanbalar (kickoff
   yakshanbasidan tashqari) bo'sh — katta coding testi kuni. 12 bob + loyiha
   = 14 element, n = 1…14.

   Holat: Store.done["dc:<id>"] — bob bajarildi (DataCamp'da 100% + shu yerda
   test 4/5). Test natijasi Store.quiz["dc:<id>"]. Xatolar → Xato banki
   ("python" kategoriyasi, ref "dc:<id>:<i>") va Takror navbati.

   Modul: DataCamp.items() · forDate(key) · current() · isDone(n) · total() ·
   doneCount() · finished(key) · quizPool(untilKey) — yakshanba testi uchun.
   ========================================================================== */
(function () {
  'use strict';

  var cache = null;

  function items() {
    if (cache) return cache;
    var list = [];
    DCTRACK.courses.forEach(function (c) {
      c.chapters.forEach(function (ch, i) { list.push({ id: ch.id, course: c, chapter: ch, ci: i + 1, title: ch.title, min: ch.min, py: ch.py || [], quiz: ch.quiz || [], goals: ch.goals, lessons: ch.lessons, url: c.url }); });
    });
    var p = DCTRACK.project;
    list.push({ id: p.id, course: null, chapter: p, ci: 0, title: p.title, min: p.min, py: p.py || [], quiz: p.quiz || [], goals: p.goals, lessons: p.lessons, url: p.url, project: true });
    /* Sanalar: start dan; yakshanba (start kunidan tashqari) tashlab ketiladi */
    var key = DCTRACK.meta.start, n = 0;
    list.forEach(function (it) {
      while (key !== DCTRACK.meta.start && new Date(key + 'T00:00:00').getDay() === 0) key = Store.shiftDays(key, 1);
      it.n = ++n; it.date = key; key = Store.shiftDays(key, 1);
    });
    cache = list;
    return list;
  }

  function flagKey(it) { return 'dc:' + it.id; }

  window.DataCamp = {
    items: items,
    byN: function (n) { return items().filter(function (x) { return x.n === Number(n); })[0] || null; },
    total: function () { return items().length; },
    isDone: function (n) { var it = typeof n === 'object' ? n : DataCamp.byN(n); return !!it && Store.flag(flagKey(it)); },
    doneCount: function () { return items().filter(function (it) { return Store.flag(flagKey(it)); }).length; },
    /* Sanaga rejalashtirilgan bob (yakshanba — null) */
    forDate: function (key) {
      var it = items().filter(function (x) { return x.date === key; })[0];
      if (!it) return null;
      return Object.assign({ label: it.title + (it.course ? ' · ' + it.course.title : '') + ' · ' + (Store.get('lang') === 'en' ? 'ch.' : 'bob') + ' ' + it.n + '/' + items().length }, it);
    },
    endDate: function () { var l = items(); return l[l.length - 1].date; },
    finished: function (key) { return (key || Store.dateKey()) > DataCamp.endDate(); },
    /* Bugungi bob yoki birinchi bajarilmagani (kechikkan bo'lsa) */
    current: function () {
      var key = Store.dateKey(), today = DataCamp.forDate(key);
      var first = items().filter(function (it) { return !Store.flag(flagKey(it)); })[0];
      if (first && today && first.n < today.n) return first;   // qarz bor — avval eskisi
      return today || first || null;
    },
    /* Qarz: sanasi o'tgan, lekin bajarilmagan boblar */
    overdue: function () { var t = Store.dateKey(); return items().filter(function (it) { return it.date < t && !Store.flag(flagKey(it)); }); },
    hoursTotal: function () { return Math.round(items().reduce(function (s, it) { return s + it.min; }, 0) / 60 * 10) / 10; },
    /* Yakshanba katta testi uchun savollar: sanasi kelgan boblarning hammasi */
    quizPool: function (untilKey) {
      var t = untilKey || Store.dateKey(), out = [];
      items().forEach(function (it) {
        if (it.date > t) return;
        it.quiz.forEach(function (q, i) {
          out.push({ q: q.q, opts: q.opts, correct: q.correct, why: q.why || '', topic: 'DataCamp · ' + it.title, route: 'datacamp/' + it.n, ref: 'dc:' + it.id + ':' + i, cat: 'python', code: true });
        });
      });
      return out;
    },
    pct: function () { return Math.round(DataCamp.doneCount() / DataCamp.total() * 100); }
  };

  /* ====================== TREK SAHIFASI ================================ */
  window.PageDataCamp = function () {
    var M = DCTRACK.meta, list = items(), cur = DataCamp.current(), today = Store.dateKey();
    var done = DataCamp.doneCount(), over = DataCamp.overdue();
    var h = '<div class="page stagger dc-page">';
    h += '<header class="page-head"><div class="eyebrow">DataCamp × UzLeeder · ' + esc(tr('dcKick')) + '</div>' +
      '<h1>' + esc(M.title) + '</h1><p class="lede">' + esc(L(M.lede)) + '</p></header>';

    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.layers + esc(tr('dcProgress')) + '</div><div class="st-v">' + done + '<small> / ' + list.length + '</small></div><div class="bar" style="margin-top:9px"><i style="width:' + DataCamp.pct() + '%"></i></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('dcHours')) + '</div><div class="st-v">' + M.hours + '<small>h</small></div><div class="st-note">' + esc(tr('dcHoursNote', { n: DataCamp.hoursTotal() })) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.calendar + esc(tr('dcDates')) + '</div><div class="st-v" style="font-size:20px">' + esc(EngCal.fmt(M.start)) + ' → ' + esc(EngCal.fmt(DataCamp.endDate())) + '</div><div class="st-note">' + esc(tr('dcOnePerDay')) + '</div></div>' +
      '<div class="stat-tile ' + (over.length ? 'red' : cur ? '' : 'gold') + '"><div class="st-l">' + IC.target + esc(tr('coursesToday')) + '</div><div class="st-v" style="font-size:18px">' + esc(over.length ? tr('dcOverdue', { n: over.length }) : cur ? tr('dcChapN', { n: cur.n }) + ' · ' + cur.title : tr('dcAllDone')) + '</div></div>' +
      '</div>';

    if (cur) h += '<button class="today-card" data-go="datacamp/' + cur.n + '" style="width:100%;text-align:left;cursor:pointer">' +
      '<span class="tc-day"><span><span class="n">' + cur.n + '</span><br><span class="l">' + esc(tr('dcChap')) + '</span></span></span>' +
      '<span class="tc-body"><span class="tc-eyebrow">' + esc(cur.date === today ? tr('todayLabel') : cur.date < today ? tr('dcLate') : EngCal.fmt(cur.date)) + ' · ' + esc(cur.course ? cur.course.title : tr('dcProject')) + '</span>' +
      '<span class="tc-title" style="display:block">' + esc(cur.title) + '</span><span class="tc-note">' + esc((L(cur.goals) || []).slice(0, 2).join(' · ')) + '</span></span>' +
      '<span class="btn btn-primary">' + esc(tr('open')) + IC.arrowR + '</span></button>';

    h += '<div class="callout why"><span class="co-ic">' + IC.alert + '</span><div><h4>' + esc(tr('dcRuleT')) + '</h4>' + esc(L(M.rule)) + '</div></div>';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('dcHowT')) + '</h3><ol class="dc-how">' + (L(M.how) || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<div class="sync-actions"><a class="btn btn-primary btn-sm" href="' + esc(M.url) + '" target="_blank" rel="noopener">' + IC.external + 'DataCamp</a><button class="btn btn-ghost btn-sm" data-go="practice/coding">' + IC.target + esc(tr('dcBigTest')) + '</button></div></div>';

    /* Jadval — kurs bo'yicha */
    var lastCourse = null;
    list.forEach(function (it) {
      var cid = it.course ? it.course.id : 'proj';
      if (cid !== lastCourse) {
        if (lastCourse) h += '</div>';
        var c = it.course;
        h += '<div class="section-head"><div class="sh-n">' + (c ? c.n : IC.rocket) + '</div><div><h2>' + esc(c ? c.title : tr('dcProject')) + '</h2>' +
          '<div class="sh-sub">' + esc(c ? c.hours + 'h · ' + c.videos + ' video · ' + c.exercises + ' ' + tr('dcExercises') + ' — ' + L(c.desc) : L(DCTRACK.project.desc)) + '</div></div></div><div class="dc-list">';
        lastCourse = cid;
      }
      var dn = DataCamp.isDone(it), q = Store.quizGet('dc:' + it.id);
      var late = it.date < today && !dn;
      h += '<button class="dc-row' + (dn ? ' done' : '') + (it.date === today ? ' today' : '') + (late ? ' late' : '') + '" data-go="datacamp/' + it.n + '">' +
        '<span class="dc-n">' + (dn ? IC.check : it.n) + '</span>' +
        '<span class="dc-b"><b>' + esc(it.title) + '</b><span>' + esc(EngCal.fmt(it.date)) + ' · ' + it.min + ' ' + esc(tr('engMin')) + ' · ' + it.lessons.length + ' ' + esc(tr('dcLessons')) + (it.py.length ? ' · Python ' + esc(tr('day')).toLowerCase() + ' ' + it.py.join(', ') : '') + '</span></span>' +
        '<span class="dc-q">' + (q ? q.best + '/' + q.bestTotal : '—') + '</span>' + IC.arrowR + '</button>';
    });
    if (lastCourse) h += '</div>';

    h += '<div class="callout tip"><span class="co-ic">' + IC.map + '</span><div>' + esc(tr('dcAfter')) + ' <button class="link-btn" data-go="plan">' + esc(tr('plan')) + ' →</button></div></div>';
    return h + '</div>';
  };

  /* ====================== BOB SAHIFASI ================================= */
  window.PageDCChapter = function (n) {
    var it = DataCamp.byN(n);
    if (!it) return '<div class="page empty"><h3>404</h3><button class="btn btn-primary" data-go="datacamp">DataCamp</button></div>';
    var dn = DataCamp.isDone(it), q = Store.quizGet('dc:' + it.id), today = Store.dateKey();
    var h = '<div class="page stagger dc-page">';
    h += '<header class="lesson-head"><div class="crumb">DataCamp · ' + esc(it.course ? it.course.title : tr('dcProject')) + '</div>' +
      '<h1>' + esc(it.title) + '</h1><div class="lesson-meta">' +
      '<span class="chip ' + (dn ? 'done' : it.date < today ? 'review' : 'topic') + '">' + esc(dn ? tr('llDoneS') : it.date < today ? tr('dcLate') : tr('dcChapN', { n: it.n })) + '</span>' +
      '<span>' + esc(EngCal.fmt(it.date)) + '</span><span>·</span><span>' + it.min + ' ' + esc(tr('engMin')) + '</span>' +
      (q ? '<span>·</span><span>' + esc(tr('dcBest')) + ' ' + q.best + '/' + q.bestTotal + '</span>' : '') +
      '</div></header>';

    h += '<div class="dc-actions"><a class="btn btn-primary" href="' + esc(it.url) + '" target="_blank" rel="noopener">' + IC.external + esc(tr('dcOpenOn')) + '</a>' +
      (it.py.length ? it.py.map(function (d) { return '<button class="btn btn-ghost btn-sm" data-go="lesson/' + d + '">' + IC.code + 'Python · ' + esc(tr('day')) + ' ' + d + '</button>'; }).join('') : '') + '</div>';

    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.target + '</span>' + esc(tr('dcGoalsT')) + '</h3><p class="hint">' + esc(tr('dcGoalsS')) + '</p><ul class="dc-goals">' +
      (L(it.goals) || []).map(function (g) { return '<li>' + inlineCode(g) + '</li>'; }).join('') + '</ul></div>';

    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('dcLessonsT')) + ' <small>' + it.lessons.length + '</small></h3><ol class="dc-lessons">' +
      it.lessons.map(function (l, i) { var k = 'dcl:' + it.id + ':' + i, on = Store.flag(k); return '<li class="' + (on ? 'on' : '') + '"><button class="hb-check" data-dcl="' + esc(k) + '" role="checkbox" aria-checked="' + on + '">' + (on ? IC.check : '') + '</button><span>' + esc(l) + '</span></li>'; }).join('') + '</ol>' +
      '<div class="hint">' + esc(tr('dcLessonsHint')) + '</div></div>';

    /* Bob testi */
    if (it.quiz.length) h += MiniQuiz.render('dc:' + it.id, it.quiz, { title: tr('dcQuizT'), sub: tr('dcQuizS'), pass: 0.8 });

    var canDone = q && q.best / (q.bestTotal || 1) >= 0.8;
    h += '<div class="card dc-done"><div><b>' + esc(tr('dcMarkT')) + '</b><span class="hint">' + esc(canDone ? tr('dcMarkOk') : tr('dcMarkNeed')) + '</span></div>' +
      '<button class="btn ' + (dn ? 'btn-ghost' : 'btn-primary') + '" data-dcdone="' + esc(it.id) + '"' + (!dn && !canDone ? ' disabled' : '') + '>' + (dn ? esc(tr('engDayReopen')) : IC.check + esc(tr('dcMarkDone'))) + '</button></div>';

    var prev = DataCamp.byN(it.n - 1), next = DataCamp.byN(it.n + 1);
    h += '<div class="lesson-nav no-print">' +
      (prev ? '<button class="btn btn-ghost" data-go="datacamp/' + prev.n + '">' + IC.arrowL + esc(prev.n + ' · ' + prev.title) + '</button>' : '<button class="btn btn-ghost" data-go="datacamp">' + IC.arrowL + 'DataCamp</button>') +
      (next ? '<button class="btn btn-ghost" data-go="datacamp/' + next.n + '">' + esc(next.n + ' · ' + next.title) + IC.arrowR + '</button>' : '<button class="btn btn-primary" data-go="datacamp">DataCamp' + IC.arrowR + '</button>') + '</div>';
    return h + '</div>';
  };

  window.PageDCChapter.mount = function (n) {
    var it = DataCamp.byN(n); if (!it) return;
    if (it.quiz.length) MiniQuiz.mount('dc:' + it.id, it.quiz, function (score, total) {
      /* Xatolar → xato banki + takror; natija → quiz */
      Store.quizSet('dc:' + it.id, score, total);
    }, function (qi, chosen) {
      var qq = it.quiz[qi];
      Store.addMistake2('python', 'dc:' + it.id + ':' + qi, { q: qq.q, chosen: chosen, correct: qq.opts[qq.correct], topic: 'DataCamp · ' + it.title, route: 'datacamp/' + it.n, why: qq.why || '' });
      if (window.Review) Review.add('mistake', 'python:dc:' + it.id + ':' + qi, { cat: 'python' });
    });
    $$('[data-dcl]').forEach(function (b) { b.addEventListener('click', function () { Store.setFlag(b.dataset.dcl); App.render(); }); });
    $$('[data-dcdone]').forEach(function (b) { b.addEventListener('click', function () {
      var k = 'dc:' + b.dataset.dcdone; Store.setFlag(k);
      if (Store.flag(k)) { toast(tr('dcCongrats'), 'ok'); var key = Store.dateKey(); Store.all().activity[key] = (Store.all().activity[key] || 0) + 1; Store.set('activity', Store.all().activity); }
      App.render(); App.refreshChrome();
    }); });
  };

  /* ====================== KICHIK TEST (umumiy) ==========================
     MiniQuiz.render(key, qs, opts) → HTML; MiniQuiz.mount(key, qs, onDone, onWrong)
     Kod savollari (\\n bor) — kod ramkasida, Python bo'yalgan.            */
  var MQ = {};
  window.MiniQuiz = {
    render: function (key, qs, o) {
      o = o || {};
      MQ[key] = { picked: {}, locked: false, qs: qs };
      var h = '<section class="quiz mq" id="mq-' + esc(key) + '"><div class="quiz-head"><h3><span class="q-ic">' + IC.spark + '</span>' + esc(o.title || tr('quiz')) + '</h3><span class="q-count">' + qs.length + ' ' + esc(tr('questions')) + '</span></div>' +
        (o.sub ? '<p class="quiz-sub">' + esc(o.sub) + '</p>' : '');
      qs.forEach(function (q, qi) {
        var order = Store.setting('shuffle') ? shuffledIndexes(q.opts.length) : q.opts.map(function (_, i) { return i; });
        h += '<div class="q-block" data-qi="' + qi + '"><div class="q-text"><span class="q-n">' + (qi + 1) + '</span>' + questionHTML(q.q) + '</div>';
        order.forEach(function (orig, disp) {
          h += '<button type="button" class="opt" data-mqo="' + orig + '"><span class="mk">' + String.fromCharCode(65 + disp) + '</span><span>' + esc(q.opts[orig]) + '</span></button>';
        });
        h += '</div>';
      });
      h += '<div class="quiz-actions"><button class="btn btn-primary" data-mqcheck disabled>' + IC.check + esc(tr('check')) + '</button><span class="counter" data-mqcount>0 / ' + qs.length + '</span></div>' +
        '<div class="result" data-mqres><div class="score" data-mqscore></div><div><h4 data-mqt></h4><p data-mqm></p></div></div></section>';
      return h;
    },
    mount: function (key, qs, onDone, onWrong) {
      var box = document.getElementById('mq-' + key); if (!box) return;
      var st = MQ[key]; if (!st) return;
      qs = qs || st.qs;
      box.addEventListener('click', function (e) {
        var opt = e.target.closest ? e.target.closest('.opt') : null;
        if (opt && !st.locked) {
          var blk = opt.closest('.q-block'), qi = Number(blk.dataset.qi);
          st.picked[qi] = Number(opt.dataset.mqo); blk.classList.add('answered');
          $$('.opt', blk).forEach(function (el) { el.classList.toggle('sel', el === opt); });
          var n = Object.keys(st.picked).length;
          $('[data-mqcount]', box).textContent = n + ' / ' + qs.length;
          $('[data-mqcheck]', box).disabled = n < qs.length;
          return;
        }
        var b = e.target.closest ? e.target.closest('[data-mqcheck]') : null;
        if (!b || b.disabled) return;
        st.locked = true;
        var correct = 0;
        qs.forEach(function (q, qi) {
          var blk = $('.q-block[data-qi="' + qi + '"]', box);
          $$('.opt', blk).forEach(function (el) { el.classList.add('locked'); });
          var ch = st.picked[qi], chEl = $('.opt[data-mqo="' + ch + '"]', blk), rEl = $('.opt[data-mqo="' + q.correct + '"]', blk);
          if (ch === q.correct) { correct++; if (chEl) chEl.classList.add('correct'); }
          else { if (chEl) chEl.classList.add('wrong'); if (rEl) rEl.classList.add('correct'); blk.classList.add('was-wrong'); if (q.why) blk.insertAdjacentHTML('beforeend', '<div class="q-why">' + esc(q.why) + '</div>'); if (onWrong) onWrong(qi, q.opts[ch]); }
        });
        b.style.display = 'none';
        var pass = correct / qs.length >= 0.8;
        var res = $('[data-mqres]', box); res.className = 'result show ' + (pass ? 'pass' : 'fail');
        $('[data-mqscore]', box).textContent = correct + '/' + qs.length;
        $('[data-mqt]', box).textContent = pass ? tr('passT') : tr('failT');
        $('[data-mqm]', box).textContent = pass ? tr('dcQuizPass') : tr('dcQuizFail');
        if (onDone) onDone(correct, qs.length);
        App.refreshChrome();
        setTimeout(function () { App.render(); }, 1800);
      });
    }
  };

  /* Savol matni: kod bo'lsa (yangi qator yoki print/def/= bor) — kod ramkasi */
  window.questionHTML = function (q) {
    q = String(q || '');
    var isCode = /\n/.test(q) || /^(print|def |for |while |if |import |from |[a-z_]+\s*=\s*)/.test(q.trim());
    if (!isCode) return inlineCode(q);
    var hl = window.highlightPython ? highlightPython(q) : esc(q);
    return '<div class="q-frame"><div class="qf-head"><span class="qf-dots"><i></i><i></i><i></i></span><span>python</span><span class="qf-ask">' + esc(tr('qfOutput')) + '</span></div><pre class="qf-code">' + hl + '</pre></div>';
  };
})();
