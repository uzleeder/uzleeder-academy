/* ==========================================================================
   Learning Studios — IELTS Studio va Coding Studio
   --------------------------------------------------------------------------
   Brief 4C. Bitta o'quv manzili, ikkita ish maydoni.

   MUHIM: bu sahifa dars MAZMUNINI TAKRORLAMAYDI. Mavjud sahifalar
   (english/:day, lesson/:day, pyai/*, datacamp/:n …) o'z joyida ishlaydi;
   studiya ularga yo'l ko'rsatadi va HAQIQIY dalilni ko'rsatadi.

   Mahorat bosqichi (brief): not-started · in-progress · completed ·
   practiced · mastered. "Dars ochildi" = "o'rganildi" EMAS.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  /* ---------- mahorat bosqichi ----------------------------------------- */
  /* Dalil: ochilgan (viewed) · bajarilgan (done) · mashq (attempts) ·
     test aniqligi · takrorda saqlanib qolgani. Hech biri taxmin emas.   */
  function masteryOf(ev) {
    if (!ev || !ev.opened) return 'not-started';
    if (!ev.done) return 'in-progress';
    if (!ev.practiced) return 'completed';
    if (!ev.retained) return 'practiced';
    return 'mastered';
  }
  var MASTERY_T = {
    'not-started': { uz: 'boshlanmagan', en: 'not started' },
    'in-progress': { uz: 'jarayonda', en: 'in progress' },
    'completed':   { uz: 'bajarilgan', en: 'completed' },
    'practiced':   { uz: 'mashq qilingan', en: 'practiced' },
    'mastered':    { uz: 'oʻzlashtirilgan', en: 'mastered' }
  };
  function masteryChip(level) {
    var cls = level === 'mastered' ? 'on' : level === 'practiced' ? 'on'
      : level === 'completed' ? 'now' : level === 'in-progress' ? 'warn' : 'off';
    return sh().chip(L(MASTERY_T[level] || MASTERY_T['not-started']), cls);
  }

  /* ====================== IELTS STUDIO ================================= */

  /* Ko'nikma kartasi: material, mashq, urinishlar, xatolar, o'lchov, keyingi qadam */
  var IELTS_SKILLS = [
    { k: 'listening', route: 'eng-skill/listening', mats: ['books/listen', 'bbc/6min'] },
    { k: 'reading',   route: 'eng-skill/reading',   mats: ['books/reading', 'books/vocab'] },
    { k: 'writing',   route: 'classic/writing',     mats: ['writing/1'] },
    { k: 'speaking',  route: 'classic/speaking',    mats: ['classic/speaking'] },
    { k: 'grammar',   route: 'eng-skill/grammar',   mats: ['cheatsheet/grammar'] },
    { k: 'vocab',     route: 'eng-skill/vocab',     mats: ['books/vocab', 'cheatsheet/vocab'] }
  ];

  function skillEvidence(sk) {
    var st = window.Store, ev = { opened: false, done: 0, practiced: 0, retained: 0, attempts: 0, acc: null, mistakes: 0 };
    if (!st) return ev;
    try {
      var q = (st.all().quiz) || {};
      var n = 0, got = 0, max = 0;
      Object.keys(q).forEach(function (key) {
        if (key.indexOf('eng:') !== 0 && key.indexOf('pr:' + sk) !== 0) return;
        var r = q[key]; if (!r || !r.total) return;
        n++; got += (r.best != null ? r.best : r.score) || 0; max += r.total;
      });
      ev.attempts = n;
      ev.acc = max ? Math.round(got / max * 100) : null;
      ev.opened = n > 0 || (st.flag && st.flag('seen:englishday'));
      ev.done = n;
      ev.practiced = n >= 3 ? 1 : 0;
      if (window.Review) {
        var rv = Review.list().filter(function (it) { return (it.meta && it.meta.cat) === sk || it.kind === sk; });
        ev.retained = rv.filter(function (it) { return Review.status(it) === 'mastered'; }).length;
      }
      ev.mistakes = st.openMistakes ? st.openMistakes().filter(function (m) { return (m.cat || '') === sk; }).length : 0;
    } catch (e) {}
    return ev;
  }

  function ieltsSkillCard(def) {
    var meta = OS.CFG.skills[def.k] || { t: { uz: def.k, en: def.k } };
    var ev = skillEvidence(def.k);
    var level = masteryOf(ev);
    var target = OS.CFG.target.skills[def.k];

    return '<section class="os-card">' +
      '<div class="os-card-head">' +
        '<h3 style="margin:0;display:flex;align-items:center;gap:8px">' + sh().icon(meta.icon || 'grid') + esc(L(meta.t)) + '</h3>' +
        masteryChip(level) +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Urinish', en: 'Attempts' })) + '</div><div class="v" style="font-size:19px">' + (ev.attempts || '—') + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Aniqlik', en: 'Accuracy' })) + '</div><div class="v" style="font-size:19px">' + (ev.acc != null ? ev.acc + '%' : '—') + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Xato', en: 'Mistakes' })) + '</div><div class="v" style="font-size:19px">' + (ev.mistakes || '—') + '</div></div>' +
      '</div>' +
      (target ? '<div style="font-size:12px;color:var(--faint);margin-bottom:10px">' +
        esc(L({ uz: 'Maqsad', en: 'Target' })) + ': ' + target + '</div>' : '') +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button class="os-btn primary" style="padding:6px 12px;font-size:12.5px" data-go="' + def.route + '">' +
          esc(L({ uz: 'Davom etish', en: 'Continue' })) + '</button>' +
        def.mats.map(function (m) {
          return '<button class="os-btn ghost" style="padding:6px 11px;font-size:12px" data-go="' + m + '">' +
            esc(L({ uz: 'Material', en: 'Material' })) + '</button>';
        }).join('') +
        '<button class="os-btn ghost" style="padding:6px 11px;font-size:12px" data-go="lab/mistakes">' +
          esc(L({ uz: 'Xatolar', en: 'Mistakes' })) + '</button>' +
      '</div>' +
      '</section>';
  }

  function viewIelts() {
    var ie = OS.data.ielts();
    var c = OS.CFG;

    var html = '';

    /* Missiya bog'lanishi — to'rt ko'nikma bitta missiyada */
    html += '<div class="os-grid c4" style="margin-bottom:var(--sp-4)">' +
      sh().stat(L({ uz: 'Maqsad', en: 'Target' }), c.target.overall + ' <small>overall</small>', L({ uz: 'kafolat emas', en: 'not a guarantee' }), 'gold') +
      sh().stat(L({ uz: 'Imtihon', en: 'Exam' }), c.mission.exam, OS.data.missionNow().daysToExam + ' ' + L({ uz: 'kun qoldi', en: 'days left' })) +
      sh().stat(L({ uz: 'Yozilgan mock', en: 'Mocks recorded' }), ie && ie.mockCount ? ie.mockCount : 0, null) +
      sh().stat(L({ uz: 'Kun yozuvi', en: 'Day records' }), ie && ie.daysTotal ? ie.daysDone + '<small>/ ' + ie.daysTotal + '</small>' : '—', null) +
      '</div>';

    html += '<div class="os-grid c2">' + IELTS_SKILLS.map(ieltsSkillCard).join('') + '</div>';

    /* Mock va baholash */
    html += '<div class="os-grid c2" style="margin-top:var(--sp-4)">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Mock imtihonlar', en: 'Mock examinations' })) + '</h2>' +
        (ie && ie.lastMock
          ? '<div class="os-row"><span class="os-row-main"><b>' + esc(L({ uz: 'Oxirgi natija', en: 'Last result' })) + '</b>' +
            '<span>L ' + (ie.lastMock.l != null ? ie.lastMock.l : '–') + ' · R ' + (ie.lastMock.r != null ? ie.lastMock.r : '–') +
            ' · W ' + (ie.lastMock.w != null ? ie.lastMock.w : '–') + ' · S ' + (ie.lastMock.s != null ? ie.lastMock.s : '–') + '</span></span>' +
            '<time>' + (ie.lastMock.at ? new Date(ie.lastMock.at).toISOString().slice(0, 10) : '') + '</time></div>'
          : sh().empty(L({ uz: 'Mock yozilmagan', en: 'No mock recorded' }),
              L({ uz: 'Natija yozilgandan keyin shu yerda va Insights da koʻrinadi.',
                  en: 'Once a result is recorded it appears here and in Insights.' }))) +
        '<div style="margin-top:12px"><button class="os-btn ghost" data-go="mission">' +
          esc(L({ uz: 'Mission dvigateli', en: 'Mission engine' })) + '</button></div>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Tavsiya', en: 'Recommendation' })) + '</h2>' +
        recommendation(ie) +
      '</section>' +
      '</div>';

    return html;
  }

  /* Tavsiya — HAQIQIY zaif joydan. Dalil bo'lmasa, halol aytamiz. */
  function recommendation(ie) {
    if (!ie || !ie.lastMock) {
      return '<p style="margin:0;color:var(--muted);font-size:13.5px">' +
        esc(L({ uz: 'Tavsiya berish uchun dalil yetarli emas. Birinchi diagnostika va mockdan keyin bu yerda aniq zaif koʻnikma koʻrsatiladi.',
                en: 'There is not enough evidence to recommend anything yet. After the first diagnostic and mock, the weakest skill will be named here.' })) +
        '</p>';
    }
    var m = ie.lastMock, c = OS.CFG.target.skills;
    var gaps = [
      { k: 'listening', g: (m.l != null ? m.l : 9) - c.listening },
      { k: 'reading',   g: (m.r != null ? m.r : 9) - c.reading },
      { k: 'writing',   g: (m.w != null ? m.w : 9) - c.writing },
      { k: 'speaking',  g: (m.s != null ? m.s : 9) - c.speaking }
    ].sort(function (a, b) { return a.g - b.g; });
    var worst = gaps[0];
    var sk = OS.CFG.skills[worst.k];
    return '<p style="margin:0 0 12px;font-size:13.5px">' +
      esc(L({ uz: 'Maqsaddan eng uzoq koʻnikma', en: 'Furthest from target' })) + ': <b>' + esc(L(sk.t)) + '</b> (' +
      (worst.g >= 0 ? '+' : '') + (Math.round(worst.g * 10) / 10) + ')</p>' +
      '<button class="os-btn primary" data-go="eng-skill/' + worst.k + '">' +
      esc(L({ uz: 'Shu koʻnikma ustida ishlash', en: 'Work on this skill' })) + '</button>';
  }

  /* ====================== CODING STUDIO =============================== */

  function viewCoding() {
    var co = OS.data.coding();
    var st = window.Store;

    /* PyAI — mavjud dvigateldan, bo'lmasa jimgina o'tkazib yuboriladi */
    var pyai = null;
    try { if (window.PyAI && PyAI.courseStatus) pyai = PyAI.courseStatus(); } catch (e) { pyai = null; }

    var jr = null;
    try { if (window.JobReady && JobReady.status) jr = JobReady.status(); } catch (e) { jr = null; }

    var html = '';

    html += '<div class="os-grid c4" style="margin-bottom:var(--sp-4)">' +
      sh().stat(L({ uz: 'Python kunlari', en: 'Python days' }),
        co && co.pythonTotal ? co.pythonDone + '<small>/ ' + co.pythonTotal + '</small>' : '—',
        co && co.avgScore ? L({ uz: 'oʻrtacha ball', en: 'average score' }) + ' ' + co.avgScore : null) +
      sh().stat(L({ uz: 'Test aniqligi', en: 'Quiz accuracy' }),
        co && co.quizAccuracy != null ? co.quizAccuracy + '%' : '—',
        co && co.quizAttempts ? co.quizAttempts + ' ' + L({ uz: 'urinish', en: 'attempts' }) : null) +
      sh().stat(L({ uz: 'PyAI darslari', en: 'PyAI lessons' }),
        pyai && pyai.lessons != null ? pyai.lessons : (window.PYAI && PYAI.lessons ? '0<small>/ ' + Object.keys(PYAI.lessons).length + '</small>' : '—'), null) +
      sh().stat(L({ uz: 'Job Ready', en: 'Job Ready' }),
        jr && jr.pct != null ? jr.pct + '%' : '—',
        L({ uz: 'dalil asosida', en: 'evidence-based' })) +
      '</div>';

    /* Yagona yo'l — takrorlanmaydigan tartib */
    var path = [
      { route: 'classic/python', icon: 'code', t: { uz: 'Python asoslari', en: 'Python foundations' },
        d: { uz: '30 kunlik kurs · 300 ta test savoli', en: '30-day course · 300 quiz questions' },
        done: co ? co.pythonDone : 0, total: co ? co.pythonTotal : 0 },
      { route: 'classic/datacamp', icon: 'book', t: { uz: 'DataCamp — Python Fundamentals', en: 'DataCamp — Python Fundamentals' },
        d: { uz: '4 kurs · 13 bob', en: '4 courses · 13 chapters' } },
      { route: 'pyai', icon: 'spark', t: { uz: 'Python & AI Engineering', en: 'Python & AI Engineering' },
        d: { uz: '10 modul · 46 dars', en: '10 modules · 46 lessons' } },
      { route: 'portfolio/projects', icon: 'rocket', t: { uz: 'Amaliy loyihalar', en: 'Practical projects' },
        d: { uz: 'Dalil bilan yoziladi', en: 'Recorded with evidence' } },
      { route: 'classic/jobready', icon: 'target', t: { uz: 'Job Ready dasturi', en: 'Job Ready programme' },
        d: { uz: 'Tayyorlik dalili', en: 'Readiness evidence' } }
    ];

    html += '<section class="os-card"><h2>' + esc(L({ uz: 'Yagona oʻquv yoʻli', en: 'One learning pathway' })) + '</h2>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
      esc(L({ uz: 'Python, DataCamp va AI Engineering endi raqobatlashmaydi — bitta tartib.',
              en: 'Python, DataCamp and AI Engineering no longer compete — one order.' })) + '</p>' +
      path.map(function (p, i) {
        return '<button class="os-row" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line-soft);text-align:left;cursor:pointer;font:inherit;color:inherit" data-go="' + p.route + '">' +
          '<span style="width:26px;height:26px;border-radius:var(--r-sm);background:var(--surface-3);display:grid;place-items:center;flex-shrink:0">' + sh().icon(p.icon) + '</span>' +
          '<span class="os-row-main"><b>' + esc(L(p.t)) + '</b><span>' + esc(L(p.d)) + '</span></span>' +
          (p.total ? '<span class="os-chip">' + p.done + '/' + p.total + '</span>' : '') +
          '</button>';
      }).join('') + '</section>';

    html += '<div class="os-note info" style="margin-top:var(--sp-4)">' + sh().icon('bulb') + '<div>' +
      esc(L({ uz: 'Darsning ochilishi oʻzlashtirish degani emas. Holat faqat dalil bilan koʻtariladi: bajarildi → mashq qilindi → oʻzlashtirildi.',
              en: 'Opening a lesson is not mastery. Status rises only with evidence: completed → practiced → mastered.' })) +
      '</div></div>';

    return html;
  }

  /* ---------- sahifa --------------------------------------------------- */

  function render(tab) {
    tab = tab === 'coding' ? 'coding' : 'ielts';
    var dest = OS.NAV.destOf('studio');
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('studio', dest.tabs, tab) +
      (tab === 'coding' ? viewCoding() : viewIelts()) +
      '</div>';
  }

  OS.pages.studio = { render: render, masteryOf: masteryOf };
})();
