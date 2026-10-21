/* ==========================================================================
   Dars sahifasi
   --------------------------------------------------------------------------
   Bitta kunning to'liq ko'rinishi. Tartib ataylab shunday:
     kirish → nazariya (+ chuqur izohlar) → loyiha → mashq → cheatsheet →
     konspekt → shaxsiy eslatma → test → navigatsiya

   "Chuqur izohlar" (why / pitfall / analogy) js/data/deep.js dan keladi.
   Agar u fayl bo'lmasa ham sahifa ishlaydi — shunchaki izohsiz chiqadi.
   ========================================================================== */
(function () {
  'use strict';

  /* Bir bo'limga tegishli qo'shimcha izohlarni chiqaradi.
     kind: why | pitfall | analogy | tip | good ("good" — darsning yakuniy fikri) */
  function calloutBlock(kind, body) {
    if (!body) return '';
    var icons = { why: IC.bulb, pitfall: IC.alert, analogy: IC.layers, tip: IC.spark, good: IC.check };
    var titles = { why: tr('why'), pitfall: tr('pitfall'), analogy: tr('analogy'), tip: tr('tip'), good: tr('closing') };
    return '<div class="callout ' + kind + '">' +
      '<span class="co-ic">' + icons[kind] + '</span>' +
      '<div><h4>' + esc(titles[kind]) + '</h4>' + inlineCode(L(body)) + '</div></div>';
  }

  function deepFor(day) {
    return (window.DEEP && window.DEEP[day]) || {};
  }

  /* Bir nazariy bo'lim: sarlavha + matn + kod + qo'shimcha izohlar */
  function sectionCard(sec, idx, extras) {
    var h = '<div class="card">' +
      '<h3 class="card-title"><span class="num">' + (idx + 1) + '</span>' + esc(L(sec.h)) + '</h3>' +
      '<p>' + inlineCode(L(sec.p)) + '</p>';
    if (sec.code) h += codeBlock(sec.code, 'Python');
    h += '</div>';
    if (extras) {
      h += calloutBlock('why', extras.why);
      h += calloutBlock('analogy', extras.analogy);
      h += calloutBlock('pitfall', extras.pitfall);
    }
    return h;
  }

  /* Dars ichidagi tez o'tish paneli */
  function toc(d) {
    var links = [['#l-intro', tr('tocIntro')], ['#l-lesson', tr('tocLesson')]];
    if (d.practice && d.practice.length) links.push(['#l-practice', tr('tocPractice')]);
    links.push(['#l-note', tr('tocNote')]);
    links.push(['#l-quiz', tr('tocQuiz')]);
    return '<nav class="lesson-toc no-print">' + links.map(function (l) {
      return '<a href="' + l[0] + '">' + esc(l[1]) + '</a>';
    }).join('') + '</nav>';
  }

  /* Dars oxiridagi qisqa cheatsheet — bo'limlardagi kodlar yig'indisi */
  function miniCheat(d) {
    var lines = cheatLinesFor(d);
    if (!lines.length) return '';
    var body = lines.map(function (l) {
      return '<span class="cc"># ' + esc(l.title) + '</span>\n' + highlightCompact(l.code);
    }).join('\n\n');
    return '<div class="mini-cheat"><div class="mc-label">' + IC.spark + esc(tr('quickRef')) + '</div>' +
      '<pre>' + body + '</pre></div>';
  }

  // Boshqa sahifalar ham ishlatadi (master cheatsheet, qidiruv)
  window.cheatLinesFor = function (d) {
    var out = [];
    (d.sections || []).forEach(function (s) {
      if (s.code) out.push({ title: L(s.h), code: s.code.trim() });
    });
    var extra = deepFor(d.day).extraSections || [];
    extra.forEach(function (s) {
      if (s.code) out.push({ title: L(s.h), code: s.code.trim() });
    });
    return out;
  };

  /* Shaxsiy eslatma maydoni */
  function noteEditor(d) {
    var n = Store.note(d.day);
    return '<div class="card note-editor no-print" id="l-note">' +
      '<div class="ne-head">' +
        '<h3 class="card-title" style="margin:0"><span class="num gold">' + IC.pen + '</span>' + esc(tr('lessonNote')) + '</h3>' +
        '<span class="ne-status" id="noteStatus">' + (n ? esc(tr('saved') + ' · ' + fmtDate(n.at)) : '') + '</span>' +
      '</div>' +
      '<textarea class="textarea" id="noteBox" placeholder="' + esc(tr('lessonNotePh')) + '">' +
        esc(n ? n.text : '') + '</textarea>' +
      '</div>';
  }

  /* Oldingi / keyingi kun tugmalari */
  function lessonNav(d) {
    var prev = dayOf(d.day - 1), next = dayOf(d.day + 1);
    var h = '<div class="lesson-nav no-print">';
    h += prev
      ? '<button class="btn btn-ghost" data-go="lesson/' + prev.day + '">' + IC.arrowL +
          esc(tr('day') + ' ' + prev.day + ' · ' + L(prev.title)) + '</button>'
      : '<span></span>';
    h += next
      ? '<button class="btn btn-ghost" data-go="lesson/' + next.day + '">' +
          esc(tr('day') + ' ' + next.day + ' · ' + L(next.title)) + IC.arrowR + '</button>'
      : '<span></span>';
    return h + '</div>';
  }

  /* Ketma-ket rejim yoqilgan va kun hali ochilmagan bo'lsa */
  function lockedScreen(day) {
    return '<div class="page empty">' +
      '<div class="em-ic">' + IC.lock + '</div>' +
      '<h3>' + esc(tr('lockedT')) + '</h3><p>' + esc(tr('lockedP')) + '</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" data-go="lesson/' + App.firstOpenDay() + '">' + esc(tr('goCurrent')) + IC.arrowR + '</button>' +
      '<button class="btn btn-ghost" data-go="settings">' + esc(tr('goSettings')) + '</button>' +
      '</div></div>';
  }

  window.PageLesson = function (dayNum) {
    var d = dayOf(dayNum);
    if (!d) return '<div class="page empty"><h3>404</h3><p>' + esc(tr('day') + ' ' + dayNum) + '</p></div>';
    if (!App.isDayOpen(dayNum)) return lockedScreen(dayNum);

    var deep = deepFor(d.day);
    var isReview = d.type === 'review';
    var best = Store.bestScore(d.day);

    var h = '<div class="page stagger">';

    /* --- sarlavha --- */
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(d.unit) + '</div>' +
      '<h1>' + esc(L(d.title)) + '</h1>' +
      '<div class="lesson-meta">' +
        (window.bookmarkBtn ? bookmarkBtn('lesson:' + d.day, 'lesson/' + d.day, tr('day') + ' ' + d.day + ' · ' + L(d.title), 'lesson') : '') +
        (window.Copybook && Copybook.fromBtn ? Copybook.fromBtn('coding', 'lesson/' + d.day, tr('day') + ' ' + d.day + ' · ' + L(d.title), { title: L(d.title) }) : '') +
        '<span class="chip ' + (isReview ? 'review' : 'topic') + '">' + esc(isReview ? tr('reviewTag') : tr('topicTag')) + '</span>' +
        '<span>' + esc(tr('day') + ' ' + d.day + ' / ' + COURSE.length) + '</span>' +
        '<span>·</span><span>' + IC.clock.replace('<svg', '<svg style="width:13px;height:13px;display:inline;vertical-align:-2px"') +
          ' ' + estimateMinutes(d) + ' ' + esc(tr('minutes')) + '</span>' +
        (best ? '<span class="chip done">' + best + '/10</span>' : '') +
      '</div></header>';

    h += toc(d);

    /* --- kirish --- */
    h += '<div class="intro-block" id="l-intro">' + inlineCode(L(d.intro)) + '</div>';
    if (deep.intro) h += calloutBlock('tip', deep.intro);

    /* --- nazariy qism: takror eslatmasi + bo'limlar + qo'shimcha bo'limlar
       Hammasi bitta #l-lesson konteynerida — tez o'tish paneli shunga sakraydi. */
    h += '<div id="l-lesson">';

    if (d.recap) {
      h += '<div class="card"><h3 class="card-title"><span class="num gold">↺</span>' +
        esc(tr('recap')) + '</h3><p>' + inlineCode(L(d.recap)) + '</p></div>';
    }

    var notes = deep.notes || [];
    var n = 0;
    (d.sections || []).forEach(function (sec, i) { h += sectionCard(sec, n++, notes[i]); });

    // Qo'shimcha bo'limlar — asosan takrorlash kunlarini to'ldirish uchun
    (deep.extraSections || []).forEach(function (sec) { h += sectionCard(sec, n++, sec.notes); });

    h += '</div>';

    /* --- loyiha --- */
    if (d.project) {
      h += '<div class="project-block">' +
        '<div class="p-label">' + IC.rocket + esc(tr('project')) + '</div>' +
        '<h3>' + esc(L(d.project.title)) + '</h3>' +
        '<p>' + inlineCode(L(d.project.desc)) + '</p>' +
        (d.project.starter ? codeBlock(d.project.starter, tr('starter')) : '') +
        '</div>';
    }

    /* --- amaliy mashqlar --- */
    if (d.practice && d.practice.length) {
      h += '<div class="card" id="l-practice"><h3 class="card-title"><span class="num gold">' + IC.target + '</span>' +
        esc(tr('practice')) + '</h3>';
      d.practice.forEach(function (t, i) {
        h += '<div class="task-row"><div class="t-n">' + (i + 1) + '</div>' +
          '<div class="t-x">' + inlineCode(L(t)) + '</div></div>';
      });
      h += '</div>';
    }

    /* --- cheatsheet + konspekt --- */
    h += miniCheat(d);

    if (d.konspekt) {
      var items = L(d.konspekt) || [];
      h += '<div class="konspekt"><div class="k-label">' + IC.pen + esc(tr('konspekt')) + '</div><ul>';
      items.forEach(function (item) {
        // funksiya(...) ko'rinishidagi bo'laklarni monospace qilamiz
        var s = esc(item).replace(/([A-Za-z_]+\([^)]*\))/g, '<span class="k-mono">$1</span>');
        h += '<li>' + s + '</li>';
      });
      h += '</ul></div>';
    }

    /* --- yakuniy fikr (agar deep.js da bo'lsa) --- */
    if (deep.close) h += calloutBlock('good', deep.close);

    /* --- eslatma + test + o'rganish halqasi + navigatsiya --- */
    h += noteEditor(d);
    h += Quiz.render(d);
    h += window.learnLoop ? learnLoop('py', d.day, L(d.title)) : '';
    h += lessonNav(d);

    return h + '</div>';
  };

  /* O'rganish halqasi — dars ostida: O'Z SO'ZIM bilan tushuntirish (chuqur
     o'rganish), keyin mashq → xatolar → takror → loyiha. Umumiy — ingliz kuni
     ham ishlatadi. Tushuntirish Store.read('exp-<kind>-<id>') da saqlanadi. */
  window.learnLoop = function (kind, id, title) {
    var rid = 'exp-' + kind + '-' + id, rec = Store.readGet(rid) || {};
    var rv = window.Review ? Store.reviewAll()[kind + ':' + id] : null;
    var mis = Store.mistakes().filter(function (m) { return !m.fixed && (kind === 'py' ? m.day === id : (m.cat === 'english' && String(m.ref || '').indexOf(id + ':') === 0)); }).length;
    var q = Store.quizGet((kind === 'py' ? 'py:' : 'eng:') + id);
    var steps = [
      { ic: IC.check, t: tr('llLearn'), s: kind === 'py' ? (Store.isDone(id) ? tr('llDoneS') : tr('llTodoS')) : (Store.engDayDone(id) ? tr('llDoneS') : tr('llTodoS')), on: kind === 'py' ? Store.isDone(id) : Store.engDayDone(id) },
      { ic: IC.spark, t: tr('llQuiz'), s: q ? q.score + '/' + q.total + (q.n > 1 ? ' · ×' + q.n : '') : tr('llTodoS'), on: !!q, route: null },
      { ic: IC.alert, t: tr('llMistakes'), s: mis ? tr('llMisN', { n: mis }) : tr('llMisNone'), on: !mis, route: 'mistakes' },
      { ic: IC.refresh, t: tr('llReview'), s: rv ? tr('rvSt_' + Review.status(rv)) + ' · ' + EngCal.fmt(rv.due) : tr('llReviewNone'), on: !!rv, route: 'review' },
      { ic: IC.target, t: tr('llPractice'), s: tr('llPracticeS'), on: false, route: 'practice' }
    ];
    if (kind === 'py' && window.PROJECTS) { var pj = PROJECTS.list.filter(function (p) { return p.after <= id + 3 && !Store.flag('proj:' + p.id + ':done'); })[0]; if (pj) steps.push({ ic: IC.rocket, t: tr('llProject'), s: L(pj.title), on: false, route: 'projects' }); }
    /* Dars mahorati (faqat Python): bilim · test · xotira — tugatish ≠ mahorat */
    var lm = kind === 'py' && window.Mastery && Mastery.lesson ? Mastery.lesson(id) : null;
    var h = '<section class="card ll" id="l-loop"><h3 class="card-title"><span class="num">' + IC.layers + '</span>' + esc(tr('llT')) +
      (lm && lm.started ? ' <span class="ll-m ' + (lm.overall >= 80 ? 'ok' : lm.overall >= 60 ? 'mid' : 'low') + '" title="' + esc(tr('pmMasteryTip', { k: lm.knowledge, q: lm.quiz, r: lm.retention })) + '">' + esc(tr('pmMastery')) + ' ' + lm.overall + '%</span>' : '') +
      '</h3><p class="hint" style="margin-top:-4px">' + esc(tr('llS')) + '</p>' +
      '<div class="ll-steps">' + steps.map(function (s, i) {
        var inner = '<span class="ll-ic">' + s.ic + '</span><span class="ll-b"><b>' + esc(s.t) + '</b><span>' + esc(s.s) + '</span></span>';
        return s.route ? '<button class="ll-step' + (s.on ? ' on' : '') + '" data-go="' + s.route + '">' + inner + '</button>' : '<div class="ll-step' + (s.on ? ' on' : '') + '">' + inner + '</div>';
      }).join('') + '</div>' +
      '<div class="field" style="margin-top:14px"><label for="expBox">' + esc(tr('llExplain')) + '</label>' +
      '<textarea class="textarea" id="expBox" data-exp="' + esc(rid) + '" rows="3" placeholder="' + esc(tr('llExplainPh', { t: title })) + '">' + esc(rec.text || '') + '</textarea>' +
      '<div class="hint" id="expStatus">' + (rec.at && rec.text ? esc(tr('saved') + ' · ' + fmtDate(rec.at)) : esc(tr('llExplainWhy'))) + '</div></div></section>';
    return h;
  };
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t || !t.dataset || !t.dataset.exp) return;
    clearTimeout(t.__tm); t.__tm = setTimeout(function () { Store.readSet(t.dataset.exp, { text: t.value }); var s = $('#expStatus'); if (s) s.textContent = tr('saved'); }, 600);
  });

  /* Sahifa DOM'ga qo'yilgandan keyin chaqiriladi (hodisalarni ulash) */
  window.PageLesson.mount = function (dayNum) {
    var d = dayOf(dayNum);
    if (!d || !App.isDayOpen(dayNum)) return;

    Quiz.mount(d);

    // Eslatmani avtomatik saqlash (yozishdan 600ms keyin)
    var box = $('#noteBox');
    if (box) {
      var timer = null;
      box.addEventListener('input', function () {
        clearTimeout(timer);
        var status = $('#noteStatus');
        if (status) status.textContent = '…';
        timer = setTimeout(function () {
          Store.setNote(d.day, box.value);
          if (status) status.textContent = box.value.trim() ? tr('saved') : '';
        }, 600);
      });
    }
  };
})();
