/* ==========================================================================
   Projects & Portfolio — amaliy ish va uning dalili
   --------------------------------------------------------------------------
   Brief 4G. Loyihalar · Capstone · Dalillar · Karyera.
   Karyera rejasi IKKILAMCHI: avval bajarilgan ish, keyin reja.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  /* ---------- 1. LOYIHALAR --------------------------------------------- */
  function viewProjects() {
    var list = (window.PROJECTS && PROJECTS.list) || [];
    var st = window.Store;

    return '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Amaliy loyihalar', en: 'Practical projects' })) + '</h2>' +
      sh().chip(list.length + ' ' + L({ uz: 'loyiha', en: 'projects' })) + '</div>' +
      (list.length ? list.map(function (p, i) {
        var id = p.id || ('p' + (i + 1));
        var doneSteps = 0, steps = (p.steps || p.tasks || []).length;
        if (st && st.flag) {
          for (var s = 1; s <= steps; s++) if (st.flag('proj:' + id + ':' + s)) doneSteps++;
        }
        return '<button class="os-row" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line-soft);text-align:left;cursor:pointer;font:inherit;color:inherit" data-go="classic/projects">' +
          '<span class="os-row-main"><b>' + esc(L(p.title) || p.name || id) + '</b>' +
          '<span>' + esc(L(p.desc) || '') + '</span></span>' +
          (steps ? sh().chip(doneSteps + '/' + steps, doneSteps === steps ? 'on' : '') : '') +
          '</button>';
      }).join('') : sh().empty(L({ uz: 'Loyiha yoʻq', en: 'No projects' }), '')) +
      '<div style="margin-top:14px"><button class="os-btn ghost" data-go="classic/projects">' +
        esc(L({ uz: 'Loyihalar sahifasi', en: 'Projects page' })) + '</button></div>' +
      '</section>';
  }

  /* ---------- 2. CAPSTONE ---------------------------------------------- */
  function viewCapstone() {
    var cap = null;
    try { if (window.PyAI && PyAI.capstoneStatus) cap = PyAI.capstoneStatus(); } catch (e) {}
    return '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Capstone', en: 'Capstone' })) + '</h2>' +
      (cap
        ? '<div class="os-grid c3">' +
          sh().stat(L({ uz: 'Holat', en: 'Status' }), cap.state || cap.status || '—') +
          sh().stat(L({ uz: 'Bajarilgan', en: 'Completed' }), cap.done != null ? cap.done : '—') +
          sh().stat(L({ uz: 'Jami', en: 'Total' }), cap.total != null ? cap.total : '—') +
          '</div>'
        : sh().empty(L({ uz: 'Capstone boshlanmagan', en: 'Capstone not started' }),
            L({ uz: 'Python & AI yoʻlining yakuniy ishi.', en: 'The final piece of the Python & AI pathway.' }))) +
      '<div style="margin-top:14px"><button class="os-btn ghost" data-go="pyai">' +
        esc(L({ uz: 'Python & AI yoʻli', en: 'Python & AI pathway' })) + '</button></div>' +
      '</section>';
  }

  /* ---------- 3. DALILLAR ---------------------------------------------- */
  function viewEvidence() {
    var st = window.Store;
    var certs = st && st.certList ? st.certList() : [];
    var pprojs = st && st.pprojList ? st.pprojList() : [];
    var jr = null;
    try { if (window.JobReady && JobReady.status) jr = JobReady.status(); } catch (e) {}

    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Portfel ishlari', en: 'Portfolio work' })) + '</h2>' +
        sh().chip(pprojs.length) + '</div>' +
        (pprojs.length ? pprojs.map(function (p) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(p.name || '') + '</b>' +
            '<span>' + esc(String(p.desc || '').slice(0, 80)) + '</span></span></div>';
        }).join('') : sh().empty(L({ uz: 'Ish qoʻshilmagan', en: 'Nothing added' }),
            L({ uz: 'Profil sahifasidan qoʻshiladi.', en: 'Added from the profile page.' }))) +
      '</section>' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Sertifikatlar', en: 'Certificates' })) + '</h2>' +
        sh().chip(certs.length) + '</div>' +
        (certs.length ? certs.map(function (c) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(c.name || '') + '</b>' +
            '<span>' + esc(c.issuer || '') + '</span></span>' +
            '<time>' + esc(c.date || '') + '</time></div>';
        }).join('') : sh().empty(L({ uz: 'Sertifikat yoʻq', en: 'No certificates' }),
            L({ uz: 'Faqat haqiqiy sertifikatlar qoʻshiladi.', en: 'Only real certificates are added.' }))) +
      '</section>' +
      (jr ? '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Job Ready dalili', en: 'Job Ready evidence' })) + '</h2>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Tayyorlik', en: 'Readiness' })) + '</div>' +
        '<div class="v">' + (jr.pct != null ? jr.pct + '%' : '—') + '</div>' +
        '<div class="s">' + esc(L({ uz: 'dalil asosida hisoblanadi', en: 'computed from evidence' })) + '</div></div>' +
        (jr.pct != null ? sh().meter(jr.pct) : '') +
        '<div style="margin-top:14px"><button class="os-btn ghost" data-go="classic/jobready">' +
          esc(L({ uz: 'Dasturni ochish', en: 'Open the programme' })) + '</button></div>' +
        '</section>' : '') +
      '</div>';
  }

  /* ---------- 4. KARYERA (ikkilamchi) ---------------------------------- */
  function viewCareer() {
    return '<div class="os-note info" style="margin-bottom:var(--sp-4)">' + sh().icon('bulb') + '<div>' +
      esc(L({ uz: 'Karyera rejasi bajarilgan ishdan keyin keladi. Avval loyiha — keyin reja.',
              en: 'Career planning comes after the work. Projects first, plan second.' })) +
      '</div></div>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Karyera yoʻli', en: 'Career path' })) + '</h2>' +
        '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Mavjud karyera sahifasi saqlanib qoldi — endi shu boʻlim ichida.',
                  en: 'The existing career page is preserved — now inside this section.' })) + '</p>' +
        '<button class="os-btn ghost" data-go="classic/career">' + esc(L({ uz: 'Ochish', en: 'Open' })) + '</button>' +
      '</section>';
  }

  function render(tab) {
    tab = tab || 'projects';
    var dest = OS.NAV.destOf('portfolio');
    var body =
        tab === 'capstone' ? viewCapstone()
      : tab === 'evidence' ? viewEvidence()
      : tab === 'career'   ? viewCareer()
      : viewProjects();
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('portfolio', dest.tabs, tab) +
      body + '</div>';
  }

  OS.pages.portfolio = { render: render };
})();
