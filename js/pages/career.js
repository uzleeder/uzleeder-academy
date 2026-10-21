/* ==========================================================================
   Karyera sahifasi — 4 daraja, sertifikatlar, kompaniyalar, yillik jadval
   --------------------------------------------------------------------------
   Butun mazmun js/data/plan.js dagi CAREER obyektidan keladi.
   ========================================================================== */
(function () {
  'use strict';

  /* Sertifikat muhri (dekorativ SVG) — uch xil ko'rinishda */
  var SEALS = {
    star: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="20" r="14" stroke="var(--cc)" stroke-width="2"/><path d="M24 13l2 4 4.5.6-3.3 3.2.8 4.5-4-2.1-4 2.1.8-4.5-3.3-3.2 4.5-.6z" fill="var(--cc)"/><path d="M18 32l-2 10 8-4 8 4-2-10" stroke="var(--cc)" stroke-width="2" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="20" r="14" stroke="var(--cc)" stroke-width="2.4"/><path d="M19 20l4 4 7-7" stroke="var(--cc)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 32l-2 10 8-4 8 4-2-10" stroke="var(--cc)" stroke-width="2" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="20" r="14" stroke="var(--cc)" stroke-width="2"/><path d="M24 14v12M18 20h12" stroke="var(--cc)" stroke-width="2.4" stroke-linecap="round"/><path d="M18 32l-2 10 8-4 8 4-2-10" stroke="var(--cc)" stroke-width="2" stroke-linejoin="round"/></svg>'
  };

  /* Kompaniya logotipi — HAQIQIY logotip, o'ylab topilgani emas.
     Uch bosqichli zanjir:
       1) simpleicons CDN — brend rasmiy SVG'si (aniq, monoxrom)
       2) kompaniyaning O'Z saytidan favicon — O'zbekiston kompaniyalari
          simpleicons'da yo'q, lekin har birining o'z sayti bor
       3) harfli variant — internet bo'lmasa yoki ikkalasi ham yuklanmasa

     Nega chizib yasamadim: logotip — brend mulki. O'xshatib chizilgani
     haqiqiysi emas va noto'g'ri bo'ladi. Shuning uchun har biri o'z
     manbasidan olinadi.                                                  */
  function logo(l, name) {
    var fallback = '<span class="logo-fb" style="background:' + esc(l.bg || '#333') + ';color:' + esc(l.fg || '#fff') + '">' +
      esc(l.text || name.charAt(0)) + '</span>';
    var fbAttr = fallback.replace(/"/g, '&quot;');

    // 2-bosqich: sayt favicon'i (haqiqiy, kompaniyaning o'zinikidan)
    var favicon = l.domain
      ? 'https://www.google.com/s2/favicons?domain=' + esc(l.domain) + '&sz=128'
      : null;

    if (l.slug) {
      var onErr = favicon
        ? "this.onerror=null;this.src='" + favicon + "'"
        : "this.parentNode.innerHTML='" + fbAttr + "'";
      return '<span class="logo"><img src="https://cdn.simpleicons.org/' + esc(l.slug) + '/' + esc(l.color) + '" ' +
        'alt="' + esc(name) + '" loading="lazy" onerror="' + onErr + '"></span>';
    }
    if (favicon) {
      return '<span class="logo"><img src="' + favicon + '" alt="' + esc(name) + '" loading="lazy" ' +
        'onerror="this.parentNode.innerHTML=\'' + fbAttr + '\'"></span>';
    }
    return '<span class="logo">' + fallback + '</span>';
  }

  window.PageCareer = function () {
    var uz = Store.get('lang') !== 'en';
    var h = '<div class="page stagger">';

    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(uz ? 'Noldan ekspertgacha' : 'Zero to expert') + '</div>' +
      '<h1>' + esc(uz ? "Sun'iy Intellekt " : 'Artificial Intelligence ') +
        '<span class="grad">' + esc(uz ? 'Karyera Rejasi' : 'Career Plan') + '</span></h1>' +
      '<p class="lede" style="font-style:italic;color:var(--brand-hi)">AI Engineer → Data Scientist / ML Engineer</p></header>';

    /* --- uchta halol haqiqat --- */
    h += '<div class="callout why"><span class="co-ic">' + IC.alert + '</span><div>' +
      '<h4>' + esc(L(CAREER.truths.title)) + '</h4>';
    CAREER.truths.items.forEach(function (t, i) {
      h += '<p style="margin-top:' + (i ? '8px' : '0') + '"><b>' + (i + 1) + '. ' + esc(L(t.h)) + '</b> ' + esc(L(t.p)) + '</p>';
    });
    h += '</div></div>';

    /* --- 4 daraja --- */
    h += '<div class="section-head"><div class="sh-n">A</div><div><h2>' +
      esc(uz ? 'Umumiy manzara — 4 daraja' : 'Overview — 4 levels') + '</h2></div></div>';
    CAREER.levels.forEach(function (l) {
      h += '<div class="level-row">' +
        '<div class="lv-badge" style="background:linear-gradient(135deg,' + l.color + ',' + l.color + 'cc)">' + esc(l.k) + '</div>' +
        '<div class="lv-body"><div class="lv-t">' + esc(L(l.t)) + '</div><div class="lv-s">' + esc(L(l.s)) + '</div></div>' +
        '<div class="lv-time" style="color:' + l.color + '">' + esc(L(l.time)) + '</div></div>';
    });
    h += '<div class="callout plain" style="margin-top:14px"><span class="co-ic">' + IC.clock + '</span><div>' +
      '<b>' + esc(uz ? 'Jami:' : 'Total:') + '</b> ' + esc(L(CAREER.totalNote)) +
      '<p style="margin-top:6px;color:var(--muted);font-style:italic;font-size:13px">' + esc(L(CAREER.totalCaveat)) + '</p>' +
      '</div></div>';

    /* --- sertifikatlar --- */
    h += '<div class="section-head"><div class="sh-n">B</div><div><h2>' +
      esc(uz ? 'Sertifikatlar' : 'Certificates') + '</h2>' +
      '<div class="sh-sub">' + esc(L(CAREER.certNote)) + '</div></div></div>';
    h += '<div class="cert-grid">';
    CAREER.certs.forEach(function (c) {
      h += '<div class="cert-card' + (c.featured ? ' featured' : '') + '" style="--cc:' + c.color + '">' +
        '<div class="seal">' + SEALS[c.seal] + '</div>' +
        '<div class="top"><span class="lv">' + esc(c.lv) + '</span><span class="ty">' + esc(c.type) + '</span></div>' +
        '<div class="nm">' + esc(L(c.name)) + '</div>' +
        '<div class="ds">' + esc(L(c.desc)) + '</div>' +
        (c.stamp ? '<div class="st">' + esc(L(c.stamp)) + '</div>' : '') +
        '</div>';
    });
    h += '</div>';

    /* --- kompaniyalar --- */
    h += '<div class="section-head"><div class="sh-n">C</div><div><h2>' +
      esc(uz ? 'Kompaniyalar' : 'Companies') + '</h2>' +
      '<div class="sh-sub">' + esc(L(CAREER.companiesNote)) + '</div></div></div>';
    CAREER.companyGroups.forEach(function (g) {
      h += '<div class="sub-head">' + esc(L(g.title)) + '</div><div class="co-grid">';
      g.items.forEach(function (c) {
        var inner = logo(c.logo, c.name) +
          '<div class="cn">' + esc(c.name) + '</div>' +
          '<div class="cd">' + esc(L(c.d)) + '</div>' +
          '<span class="cg' + (g.target ? ' target' : '') + '">' +
            esc(c.tag ? L(c.tag) : (uz ? 'Maqsad' : 'Target')) + '</span>';
        // Sayti bo'lsa — kartaning o'zi havola bo'ladi
        h += c.site
          ? '<a class="co-card' + (g.target ? ' target' : '') + '" href="' + esc(c.site) + '" ' +
            'target="_blank" rel="noopener noreferrer">' + inner +
            '<span class="co-ext">' + IC.external + '</span></a>'
          : '<div class="co-card' + (g.target ? ' target' : '') + '">' + inner + '</div>';
      });
      h += '</div>';
    });

    /* --- yillik jadval --- */
    h += '<div class="section-head"><div class="sh-n">D</div><div><h2>' +
      esc(uz ? 'Yillik jadval — 2026 dan' : 'Year timeline — from 2026') + '</h2>' +
      '<div class="sh-sub">' + esc(L(CAREER.yearsNote)) + '</div></div></div>';
    h += '<div class="year-track">';
    CAREER.years.forEach(function (y) {
      h += '<div class="year-item" style="--cc:' + y.color + '">' +
        '<div class="y-badge" style="background:linear-gradient(135deg,' + y.color + ',' + y.color + 'cc)">' +
          '<span class="yn">' + esc(y.y) + '</span><span class="yl">' + esc(L(y.label)) + '</span></div>' +
        '<div class="y-card"><div class="ys">' + esc(L(y.label)) + '</div>' +
        '<div class="yt">' + esc(L(y.t)) + '</div>' +
        '<div class="yd">' + esc(L(y.d)) + '</div></div></div>';
    });
    h += '</div>';

    h += '<div class="callout tip"><span class="co-ic">' + IC.bulb + '</span><div>' +
      '<h4>' + esc(L(CAREER.closing.title)) + '</h4>' + esc(L(CAREER.closing.p)) + '</div></div>';

    /* Karyera tayyorgarligi: ko'nikmalar (mahorat) → loyihalar → portfolio → CV → suhbat.
       Hammasi real progressdan; checklist bandlari Store.done "cr:<i>".            */
    if (window.Mastery && window.PROJECTS) {
      var pm = Mastery.python(), em = Mastery.english();
      var done = PROJECTS.list.filter(function (p) { return Store.flag('proj:' + p.id + ':done'); });
      var ck = [tr('crCk1'), tr('crCk2'), tr('crCk3'), tr('crCk4'), tr('crCk5'), tr('crCk6'), tr('crCk7'), tr('crCk8')];
      var ckDone = ck.filter(function (_, i) { return Store.flag('cr:' + i); }).length;
      var ready = Math.round((pm.overall * .35 + em.overall * .25 + (done.length / PROJECTS.list.length) * 100 * .2 + (ckDone / ck.length) * 100 * .2));
      h += '<div class="section-head"><div class="sh-n">' + IC.star + '</div><div><h2>' + esc(tr('crReadyT')) + ' · ' + ready + '%</h2><div class="sh-sub">' + esc(tr('crReadyS')) + '</div></div></div>';
      h += '<div class="an-two">' +
        '<div class="card"><h3 class="card-title"><span class="num">' + IC.code + '</span>' + esc(tr('crSkills')) + '</h3>' +
          '<button class="ms-row" data-go="analytics"><span>Python</span><div class="bar"><i style="width:' + pm.overall + '%"></i></div><b>' + pm.overall + '%</b></button>' +
          '<button class="ms-row" data-go="english"><span>' + esc(tr('english')) + '</span><div class="bar"><i style="width:' + em.overall + '%"></i></div><b>' + em.overall + '%</b></button>' +
          '<button class="ms-row" data-go="projects"><span>' + esc(tr('projectsPage')) + '</span><div class="bar"><i style="width:' + Math.round(done.length / PROJECTS.list.length * 100) + '%"></i></div><b>' + done.length + '/' + PROJECTS.list.length + '</b></button>' +
          '<div class="hint" style="margin-top:8px">' + esc(tr('crPortfolio')) + ': ' + (done.length ? esc(done.map(function (p) { return L(p.title); }).join(' · ')) : esc(tr('crPortfolioNone'))) + '</div></div>' +
        '<div class="card"><h3 class="card-title"><span class="num gold">' + IC.checklist + '</span>' + esc(tr('crCkT')) + ' · ' + ckDone + '/' + ck.length + '</h3><div class="wr-ck" style="margin-top:0">' +
          ck.map(function (c, i) { var on = Store.flag('cr:' + i); return '<label class="ck-row' + (on ? ' on' : '') + '"><input type="checkbox" data-crck="' + i + '"' + (on ? ' checked' : '') + '><span>' + esc(c) + '</span></label>'; }).join('') +
        '</div></div></div>';

      /* Portfolio: tugallangan loyihalar — ko'nikmalar, mulohaza, sana; + CV matni (real holatdan) */
      h += '<div class="section-head"><div class="sh-n">' + IC.rocket + '</div><div><h2>' + esc(tr('crPfT')) + ' · ' + done.length + '</h2><div class="sh-sub">' + esc(tr('crPfS')) + '</div></div></div>';
      if (!done.length) {
        var nxt = PROJECTS.list.filter(function (p) { return !Store.flag('proj:' + p.id + ':done'); })[0];
        h += '<div class="rv-empty">' + IC.rocket + '<h3>' + esc(tr('crPfNone')) + '</h3><p>' + esc(tr('crPfNoneS', { n: nxt ? nxt.after : 4 })) + '</p><button class="btn btn-primary btn-sm" data-go="projects">' + esc(tr('projectsPage')) + IC.arrowR + '</button></div>';
      } else {
        h += '<div class="pf-grid">' + done.map(function (p) {
          var r = Store.readGet('proj-' + p.id) || {};
          return '<button class="pf-card" data-go="projects"><span class="prj-lv">L' + p.level + '</span><b>' + esc(L(p.title)) + '</b><span class="pf-skills">' + esc(p.skills.join(' · ')) + '</span>' +
            (r.reflection ? '<span class="pf-ref">“' + esc(r.reflection.slice(0, 140)) + (r.reflection.length > 140 ? '…' : '') + '”</span>' : '<span class="pf-ref muted">' + esc(tr('crPfNoRef')) + '</span>') + '</button>';
        }).join('') + '</div>';
      }
      h += '<div class="card cv-card"><h3 class="card-title"><span class="num">' + IC.doc + '</span>' + esc(tr('crCvT')) + '</h3><p class="hint">' + esc(tr('crCvS')) + '</p>' +
        '<pre class="cv-pre" id="cvText">' + esc(cvText(pm, em, done)) + '</pre>' +
        '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="cvCopy">' + IC.copy + esc(tr('copy')) + '</button></div></div>';
    }

    return h + '</div>';
  };

  /* CV matni — faqat haqiqiy raqamlar: yopilgan darslar, mahorat, loyihalar, IELTS holati */
  function cvText(pm, em, done) {
    var en = Store.get('lang') === 'en', name = Store.get('name') || (en ? 'Your name' : 'Ismingiz');
    var lines = [name.toUpperCase(), (Store.get('profile') || {}).title || (en ? 'Junior Python developer (in training) · AI engineering path' : 'Junior Python dasturchi (o\'qimoqda) · AI muhandisligi yo\'li'), ''];
    lines.push(en ? 'SKILLS' : 'KO\'NIKMALAR');
    lines.push('- Python: ' + Store.doneCount() + '/30 ' + (en ? 'lessons closed' : 'dars yopilgan') + ', ' + (en ? 'mastery' : 'mahorat') + ' ' + pm.overall + '%' + (Store.avgScore() ? ', ' + (en ? 'avg quiz' : 'o\'rtacha test') + ' ' + Store.avgScore() + '/10' : ''));
    var skills = {}; done.forEach(function (p) { p.skills.forEach(function (s) { skills[s] = 1; }); });
    if (Object.keys(skills).length) lines.push('- ' + (en ? 'Used in projects' : 'Loyihalarda ishlatilgan') + ': ' + Object.keys(skills).join(', '));
    lines.push('- English: ' + (en ? 'IELTS preparation' : 'IELTS tayyorgarlik') + ', ' + (en ? 'course day' : 'kurs kuni') + ' ' + Store.engDoneCount() + '/144, ' + (en ? 'mastery' : 'mahorat') + ' ' + em.overall + '%' + (Store.copyList('vocab').length ? ', ' + Store.copyList('vocab').length + ' ' + (en ? 'words in copybook' : 'so\'z daftarda') : ''));
    lines.push('');
    lines.push(en ? 'PROJECTS' : 'LOYIHALAR');
    if (!done.length) lines.push('- ' + (en ? '(none completed yet)' : '(hali tugallanmagan)'));
    done.forEach(function (p) { lines.push('- ' + L(p.title) + ' — ' + p.skills.join(', ') + ' (L' + p.level + ', ~' + p.hours + 'h)'); });
    lines.push('');
    lines.push(en ? 'DISCIPLINE' : 'INTIZOM');
    lines.push('- ' + (en ? 'Study streak' : 'Ketma-ket kunlar') + ': ' + HabitPlan.streak() + ' · ' + (en ? 'total study time' : 'umumiy o\'quv vaqti') + ': ' + Math.round(StudyTime.total() / 60) + ' h');
    return lines.join('\n');
  }
  window.PageCareer.mount = function () {
    var b = $('#cvCopy'); if (!b) return;
    b.addEventListener('click', function () {
      var t = $('#cvText').textContent;
      var ok = function () { toast(tr('copied'), 'ok'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok).catch(function () { toast(tr('copyFail'), 'warn'); });
      else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast(tr('copyFail'), 'warn'); } ta.remove(); }
    });
  };
  document.addEventListener('change', function (e) {
    var cb = e.target; if (!cb || cb.dataset.crck === undefined) return;
    Store.setFlag('cr:' + cb.dataset.crck, cb.checked); cb.closest('.ck-row').classList.toggle('on', cb.checked);
  });
})();
