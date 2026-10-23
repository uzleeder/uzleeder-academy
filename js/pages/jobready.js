/* ==========================================================================
   #/jobready — "Job Ready: Python & AI Engineer" dasturi sahifasi
   Bosqichlar → komponentlar (har biri o'z kursiga olib boradi), ishga tayyorlik
   mezonlari (dalil bilan) va keyingi qadamlar. Ma'lumot: js/jobready.js
   ========================================================================== */
(function () {
  'use strict';
  var t = function (uz, en) { return L({ uz: uz, en: en }); };
  function bar(p) { return '<div class="bar"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div>'; }

  function part(p) {
    var prog = p.total ? '<b>' + Math.min(p.done, p.total) + '</b>/' + p.total + ' ' + esc(L(p.unit)) : '';
    var extra = p.kind === 'pyai' && p.total ? ' · ' + esc(t('mahorat: ', 'mastered: ')) + p.mastered : '';
    return '<button class="jr-part" data-go="' + esc(p.route) + '">' +
      '<span class="jr-pt"><b>' + esc(L(p.title)) + '</b>' + (p.note ? '<small>' + esc(L(p.note)) + '</small>' : '') + '</span>' +
      '<span class="jr-pp">' + (prog ? prog + extra : esc(t('Ochish', 'Open'))) + '</span>' +
      (p.total ? bar(p.done / p.total * 100) : '') + '</button>';
  }

  window.PageJobReady = function () {
    var J = window.JobReady.status(), steps = window.JobReady.nextSteps();
    var h = '<div class="page stagger jr-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(t('Kurslar · Dastur', 'Courses · Program')) + '</div>' +
      '<h1>Job Ready: Python & AI Engineer</h1>' +
      '<p class="lede">' + esc(t("Bitta yo'l: 30 kunlik Coding — Python, DataCamp, Python & AI modullari, loyihalar, capstone, portfolio va ish qidirish. Progress faqat haqiqiy bajarilgan ishdan hisoblanadi.",
        'One path: the 30-day Coding — Python course, DataCamp, Python & AI modules, projects, a capstone, a portfolio and the job search. Progress counts only real completed work.')) + '</p></header>';

    /* umumiy holat */
    var totD = 0, totT = 0; J.stages.forEach(function (s) { totD += s.done; totT += s.total; });
    h += '<div class="jr-sum">' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Umumiy progress', 'Overall progress')) + '</div><div class="st-v">' + (totT ? Math.round(totD / totT * 100) : 0) + '%</div><div class="st-note">' + totD + '/' + totT + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Ishga tayyorlik mezonlari', 'Job-ready criteria')) + '</div><div class="st-v">' + J.met + '/' + J.of + '</div><div class="st-note">' + esc(J.ready ? t('Hammasi bajarildi', 'All met') : t('dalil bilan', 'evidence-based')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Hozirgi bosqich', 'Current stage')) + '</div><div class="st-v sm">' + esc(L(J.stages.filter(function (s) { return s.id === J.current; })[0].title)) + '</div></div>' +
      '</div>';

    /* dastur ichidagi kurslar (Kurslar sahifasidan shu yerga ko'chirilgan) */
    if (window.CourseCards) {
      h += '<h2 class="jr-h2">' + esc(t('Dastur ichidagi kurslar', 'Courses in this program')) + '</h2>' +
        '<div class="course-pick programs">' + CourseCards.python() + CourseCards.datacamp() + CourseCards.pyai() + '</div>';
    }

    /* keyingi qadamlar */
    if (steps.length) {
      h += '<section class="card jr-next"><h3 class="card-title">' + esc(t('Keyingi qadamlar', 'Next steps')) + '</h3>';
      steps.forEach(function (s, i) {
        h += '<button class="jr-step' + (i === 0 ? ' first' : '') + '" data-go="' + esc(s.route) + '"><span class="jr-n">' + (i + 1) + '</span><span><b>' + esc(L(s.title)) + '</b><small>' + esc(L(s.why)) + '</small></span>' + IC.arrowR + '</button>';
      });
      h += '</section>';
    }

    /* bosqichlar */
    h += '<h2 class="jr-h2">' + esc(t('Bosqichlar', 'Stages')) + '</h2><div class="mp-grid">';
    J.stages.forEach(function (s, i) {
      h += '<section class="mp-phase' + (s.id === J.current ? ' now' : '') + '">' +
        '<div class="mp-h"><span class="mp-n">' + (i + 1) + '</span><div><b>' + esc(L(s.title).replace(/^\d+\.\s*/, '')) + '</b><span>' + esc(t('Haftalar ', 'Weeks ')) + s.weeks + ' · ' + esc(L(s.goal)) + '</span></div>' +
        (s.total ? '<span class="chip">' + s.pct + '%</span>' : '') + '</div>' +
        '<div class="jr-parts">' + s.parts.map(part).join('') + '</div></section>';
    });
    h += '</div>';

    /* mezonlar */
    h += '<h2 class="jr-h2">' + esc(t("Ishga tayyorlik mezonlari", 'Job-ready criteria')) + '</h2><div class="jr-crit">';
    J.criteria.forEach(function (c) {
      h += '<button class="jr-c' + (c.met ? ' ok' : '') + '" data-go="' + esc(c.route) + '">' +
        '<span class="jr-ck">' + (c.met ? '✓' : '·') + '</span>' +
        '<span><b>' + esc(L(c.title)) + '</b><small>' + esc(t('Qoida: ', 'Rule: ')) + esc(L(c.rule)) + '</small><small class="jr-ev">' + esc(t('Dalil: ', 'Evidence: ')) + esc(L(c.evidence)) + '</small></span></button>';
    });
    h += '</div>';

    h += '<p class="jr-honest">' + esc(t("Eslatma: bu dastur ish yoki rasmiy sertifikat kafolatlamaydi. Mezonlar — o'quv dalillari (testlar, avto-tekshiruvlar, repo havolalari, o'z bahosi). Capstone va portfolio o'z bahosi sifatida belgilangan; ularni haqiqiy mentor yoki intervyuda tekshirtiring.",
      'Note: this program does not guarantee a job or an official certificate. The criteria are learning evidence (tests, auto-checks, repository links, self-assessment). The capstone and portfolio are marked self-assessed; have them checked by a real mentor or in interviews.')) + '</p>';
    return h + '</div>';
  };
})();
