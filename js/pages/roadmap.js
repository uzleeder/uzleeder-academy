/* ==========================================================================
   Yo'l xaritasi (Roadmap)
   --------------------------------------------------------------------------
   Ikki qatlam: (1) 30 kunlik kursning hafta-hafta manzarasi + sertifikatlar,
   (2) kursdan keyingi karyera darajalari (qisqacha) va to'liq sahifaga havola.
   ========================================================================== */
(function () {
  'use strict';

  window.PageRoadmap = function () {
    var h = '<div class="page stagger">';

    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('rmKick')) + '</div>' +
      '<h1>AI Engineering <span class="grad">Roadmap</span></h1>' +
      '<p class="lede">' + esc(tr('rmLede')) + '</p></header>';

    /* Butun yo'lning zanjiri — har halqa real holat bilan (Mastery/Store) */
    if (window.Mastery && window.PROJECTS) {
      var pm = Mastery.python(), em = Mastery.english();
      var pj = PROJECTS.list.filter(function (p) { return Store.flag('proj:' + p.id + ':done'); }).length;
      var nx = window.Goal ? Goal.next() : null;
      var chain = [
        ['goal', IC.target, tr('rmChGoal'), nx ? L(nx.t) : '—'],
        ['course', IC.book, tr('rmChCourses'), 'Python ' + Store.doneCount() + '/30 · EN ' + Store.engDoneCount() + '/' + ENGLISH.meta.days],
        ['analytics', IC.trend, tr('rmChSkills'), 'Py ' + pm.overall + '% · EN ' + em.overall + '%'],
        ['practice', IC.spark, tr('rmChPractice'), (Object.keys(Store.all().quiz).length) + ' ' + tr('anPractice').toLowerCase()],
        ['projects', IC.rocket, tr('projectsPage'), pj + '/' + PROJECTS.list.length],
        ['review', IC.refresh, tr('rmChMastery'), Review.list().filter(function (it) { return Review.status(it) === 'mastered'; }).length + ' ' + tr('rvMastered').toLowerCase()],
        ['career', IC.star, tr('career'), '']
      ];
      h += '<div class="rm-chain">' + chain.map(function (c) { return '<button class="rm-ch" data-go="' + c[0] + '"><span class="rm-ci">' + c[1] + '</span><b>' + esc(c[2]) + '</b><span>' + esc(c[3]) + '</span></button>'; }).join('<i>→</i>') + '</div>';
    }

    /* --- 1-qism: kurs haftalari --- */
    h += '<div class="section-head"><div class="sh-n">1</div><div>' +
      '<h2>' + esc(tr('rmCourseT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('rmCourseS')) + '</div></div></div>';

    var units = groupUnits();
    h += '<div class="week-grid">';
    units.forEach(function (u, idx) {
      var doneN = u.days.filter(function (d) { return Store.isDone(d.day); }).length;
      var total = u.days.length;
      var allDone = doneN === total;
      var started = doneN > 0;
      var parts = splitUnit(u.name);
      var badge = allDone
        ? '<span class="wc-badge done">' + esc(tr('rmDone')) + '</span>'
        : started
          ? '<span class="wc-badge cur">' + esc(tr('rmCur')) + '</span>'
          : '<span class="wc-badge lock">' + esc(tr('rmLock')) + '</span>';

      h += '<div class="week-card' + (allDone ? ' done' : started ? ' current' : '') + '">' +
        '<div class="wc-top"><span class="wc-wk">' + esc(parts.wk) + '</span>' + badge + '</div>' +
        '<div class="wc-name">' + esc(parts.name) + '</div>' +
        '<div class="bar"><i style="width:' + (doneN / total * 100) + '%"></i></div>' +
        '<div class="wc-days">' + esc(tr('day')) + ' ' + u.days[0].day + '–' + u.days[total - 1].day +
          ' · ' + doneN + '/' + total + '</div>' +
        (allDone
          ? '<button class="wc-cert" data-cert="' + idx + '">' + IC.medal +
            '<span>' + esc(tr('certReady')) + '</span></button>'
          : '') +
        '</div>';
    });
    h += '</div>';

    /* --- 1b-qism: ingliz tili treki — Python kursi bilan bir xil qolipda */
    h += '<div class="section-head"><div class="sh-n">1b</div><div>' +
      '<h2>' + esc(tr('rmEngT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('rmEngS', { n: ENGLISH.meta.days, exam: EngCal.fmt(ENGLISH.meta.exam) })) + '</div></div></div>';

    var engDone = Store.engDoneCount();
    h += '<div class="week-grid">';
    /* Kirish bloki + 5 bosqich */
    var engGroups = [{ n: 0, from: 1, to: (window.ENG_INTRO || []).length || 4, intro: true, title: { uz: 'Introduction (kurs kuni emas)', en: 'Introduction (not counted)' } }].concat(
      ENGLISH.phases.map(function (p) {
        return { n: p.n, from: ENGLISH.meta.intro + (p.from - 1) * 7 + 1, to: ENGLISH.meta.intro + p.to * 7, title: p.title };
      })
    );
    engGroups.forEach(function (g) {
      var total = g.to - g.from + 1;
      var dn = 0;
      for (var d = g.from; d <= g.to; d++) if (Store.engDayDone(g.intro ? 'i' + d : d)) dn++;
      var allDone = dn === total, started = dn > 0;
      h += '<div class="week-card' + (allDone ? ' done' : started ? ' current' : '') + '">' +
        '<div class="wc-top"><span class="wc-wk">' +
          esc(g.n === 0 ? tr('engIntroBlock') : tr('engPhase') + ' ' + g.n) + '</span>' +
          (allDone ? '<span class="wc-badge done">' + esc(tr('rmDone')) + '</span>'
           : started ? '<span class="wc-badge cur">' + esc(tr('rmCur')) + '</span>'
           : '<span class="wc-badge lock">' + esc(tr('rmLock')) + '</span>') + '</div>' +
        '<div class="wc-name">' + esc(L(g.title)) + '</div>' +
        '<div class="bar"><i style="width:' + (dn / total * 100) + '%"></i></div>' +
        '<div class="wc-days">' + esc(g.intro ? tr('engIntroBlock') : tr('day') + ' ' + g.from + '–' + g.to) + ' · ' + dn + '/' + total + '</div>' +
        '</div>';
    });
    h += '</div>';

    h += '<div class="eng-quick" style="margin-top:14px">' +
      '<button class="btn btn-primary" data-go="english">' + IC.globe + esc(tr('english')) + IC.arrowR + '</button>' +
      '<button class="btn btn-ghost" data-go="eng-grammar">' + IC.brain + esc(tr('engGrammarSheet')) + '</button>' +
      '<button class="btn btn-ghost" data-go="habit">' + IC.mosque + esc(tr('habit')) + '</button>' +
      '</div>';

    /* --- 2-qism: ikki kursni parallel olib borish --------------------
       Foydalanuvchi Python va ingliz tilini bir vaqtda o'qiydi, shuning
       uchun roadmap ikkalasini bitta vaqt o'qida ko'rsatishi kerak.    */
    h += '<div class="section-head"><div class="sh-n">2</div><div>' +
      '<h2>' + esc(tr('dualT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('dualS')) + '</div></div></div>';

    h += '<div class="callout why"><span class="co-ic">' + IC.layers + '</span><div>' + esc(L(DUAL.intro)) + '</div></div>';

    /* Haftalik jadval: qaysi kun qaysi kursniki */
    h += '<div class="dual-week">';
    DUAL.week.forEach(function (row) {
      var total = (row.engMin || 0) + (row.pyMin || 0);
      h += '<div class="dw-row' + (row.dow === 0 ? ' sun' : '') + '">' +
        '<div class="dw-day">' + esc(L(row.day)) + '</div>' +
        '<div class="dw-bars">' +
          '<div class="dw-bar eng" style="flex:' + (row.engMin || 0) + '" title="' + esc(L(row.eng)) + '">' +
            '<span>' + IC.globe + esc(L(row.eng)) + '</span></div>' +
          (row.py ? '<div class="dw-bar py" style="flex:' + row.pyMin + '" title="' + esc(L(row.py)) + '">' +
            '<span>' + IC.code + esc(L(row.py)) + '</span></div>' : '') +
        '</div>' +
        '<div class="dw-min">' + Math.floor(total / 60) + 's ' + (total % 60 ? (total % 60) + 'd' : '') + '</div>' +
        '<div class="dw-note">' + esc(L(row.note)) + '</div>' +
      '</div>';
    });
    h += '</div>';

    /* Umumiy vaqt o'qi */
    h += '<div class="dual-time">';
    DUAL.timeline.forEach(function (t) {
      h += '<div class="dt-row"><div class="dt-w">' + esc(L(t.title)) + '</div>' +
        '<div class="dt-cols">' +
          '<div class="dt-c py"><span class="dt-l">' + IC.code + 'Python</span>' + esc(L(t.py)) + '</div>' +
          '<div class="dt-c eng"><span class="dt-l">' + IC.globe + esc(tr('english')) + '</span>' + esc(L(t.eng)) + '</div>' +
        '</div>' +
        '<div class="dt-note">' + esc(L(t.note)) + '</div></div>';
    });
    h += '</div>';

    /* Konflikt qoidalari */
    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span>' +
      '<div><h4>' + esc(tr('dualWarn')) + '</h4>' + esc(L(DUAL.warning)) + '</div></div>';

    h += '<div class="eng-rules" style="margin-top:14px">';
    DUAL.rules.forEach(function (r, i) {
      h += '<div class="er-row"><span class="er-n">' + (i + 1) + '</span><span>' + esc(L(r)) + '</span></div>';
    });
    h += '</div>';

    /* --- 3-qism: karyera darajalari (qisqacha) --- */
    h += '<div class="section-head"><div class="sh-n">3</div><div>' +
      '<h2>' + esc(tr('rmNextT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('rmNextS')) + '</div></div></div>';

    CAREER.levels.forEach(function (l) {
      h += '<div class="level-row">' +
        '<div class="lv-badge" style="background:linear-gradient(135deg,' + l.color + ',' + l.color + 'cc)">' + esc(l.k) + '</div>' +
        '<div class="lv-body"><div class="lv-t">' + esc(L(l.t)) + '</div>' +
        '<div class="lv-s">' + esc(L(l.s)) + '</div></div>' +
        '<div class="lv-time" style="color:' + l.color + '">' + esc(L(l.time)) + '</div></div>';
    });

    h += '<div class="callout why" style="text-align:center;flex-direction:column;align-items:center;margin-top:18px">' +
      '<div>' + esc(tr('rmCareerCTA')) + '</div>' +
      '<button class="btn btn-primary" data-go="career" style="margin-top:12px">' + IC.star + esc(tr('career')) + IC.arrowR + '</button>' +
      '</div>';

    /* --- ingliz tili bandi: endi alohida kursga olib boradi --- */
    if (window.ROADMAP && ROADMAP.english) {
      var engDone = Store.engDoneCount();
      h += '<button class="english-band" data-go="english" style="width:100%;text-align:left;cursor:pointer">' +
        '<div class="eb-ic">' + IC.globe + '</div>' +
        '<div><h4>' + esc(L(ROADMAP.english.title)) + '</h4>' +
        '<p>' + esc(L(ROADMAP.english.goal)) + '</p>' +
        '<p style="font-family:var(--font-mono);font-size:12px;margin-top:6px;opacity:.85">' +
          esc(tr('engProgress')) + ': ' + engDone + '/' + ENGLISH.meta.days + ' ' + esc(tr('days')) + ' · ' +
          esc(tr('engExam')) + ' ' + esc(EngCal.fmt(ENGLISH.meta.exam)) + '</p></div>' +
        '<span style="margin-left:auto;flex-shrink:0">' + IC.arrowR + '</span>' +
        '</button>';

      /* IELTS sertifikati — Python haftalik sertifikatlari bilan yonma-yon */
      if (Eng.certReady()) {
        h += '<div class="week-grid" style="margin-top:14px">' +
          '<div class="week-card done"><div class="wc-top">' +
            '<span class="wc-wk">IELTS</span>' +
            '<span class="wc-badge done">' + esc(tr('rmDone')) + '</span></div>' +
          '<div class="wc-name">' + esc(tr('engCertT')) + '</div>' +
          '<button class="wc-cert" data-engcert="1">' + IC.medal +
            '<span>' + esc(tr('certReady')) + '</span></button></div></div>';
      }
    }

    h += '<div class="note-band">' + esc(tr('rmNote')) + '</div>';
    return h + '</div>';
  };
})();
