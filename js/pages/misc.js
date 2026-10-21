/* ==========================================================================
   Qolgan sahifalar: Cheatsheet · Eslatmalar · Xatolar daftari · Sozlamalar
   ========================================================================== */
(function () {
  'use strict';

  /* ====================== CHEATSHEET ==================================== */
  window.PageCheatsheet = function () {
    var h = '<div class="page">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('csKick')) + '</div>' +
      '<h1>Python <span class="grad">Cheatsheet</span></h1>' +
      '<p class="lede">' + esc(tr('csLede')) + '</p>' +
      '<button class="btn btn-primary no-print" style="margin-top:16px" id="printBtn">' +
        IC.download + esc(tr('print')) + '</button></header>';

    var lastUnit = '';
    COURSE.forEach(function (d) {
      var lines = cheatLinesFor(d);
      if (!lines.length) return;                 // kod yo'q kunlarni o'tkazamiz
      if (d.unit !== lastUnit) { h += '<div class="cs-unit">' + esc(d.unit) + '</div>'; lastUnit = d.unit; }
      h += '<div class="cs-card"><div class="cs-h"><div class="cs-n">' + d.day + '</div>' +
        '<div class="cs-t">' + esc(L(d.title)) + '</div></div><pre>' +
        lines.map(function (l) {
          return '<span class="cc"># ' + esc(l.title) + '</span>\n' + highlightCompact(l.code);
        }).join('\n\n') + '</pre></div>';
    });

    return h + '</div>';
  };

  window.PageCheatsheet.mount = function () {
    var b = $('#printBtn');
    if (b) b.addEventListener('click', function () { window.print(); });
  };

  /* ====================== ESLATMALAR ==================================== */
  /* Yagona eslatmalar: Python darslari + ingliz kunlari + daftarlar (havola bilan) */
  var notesTab = 'all', notesQ = '';
  window.PageNotes = function () {
    var py = Store.notesList().map(function (n) { var d = dayOf(n.day); return { kind: 'py', key: String(n.day), title: 'Python · ' + tr('day') + ' ' + n.day + (d ? ' — ' + L(d.title) : ''), text: n.text, at: n.at, route: 'lesson/' + n.day }; });
    var en = (Store.engNotesList ? Store.engNotesList() : []).map(function (n) { var d = window.Eng ? Eng.dayOf(n.day) : null; return { kind: 'eng', key: String(n.day), title: tr('english') + ' · ' + tr('day') + ' ' + n.day + (d ? ' — ' + L(d.title) : ''), text: n.text, at: n.at, route: 'english/' + n.day }; });
    var cp = [];
    ['english', 'coding'].forEach(function (k) { Store.copyList(k).forEach(function (e) { cp.push({ kind: 'copy', key: e.id, title: (k === 'english' ? tr('copyEnglish') : tr('copyCoding')) + ' · ' + (e.title || '—'), text: [e.text, e.code, e.ex].filter(Boolean).join('\n'), at: e.at, route: 'copy/' + k }); }); });
    var all = py.concat(en, cp).sort(function (a, b) { return b.at - a.at; });
    var shown = all.filter(function (n) { return (notesTab === 'all' || n.kind === notesTab) && (!notesQ || (n.title + ' ' + n.text).toLowerCase().indexOf(notesQ.toLowerCase()) >= 0); });

    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('notesKick')) + '</div>' +
      '<h1>' + esc(tr('notes')) + '</h1>' +
      '<p class="lede">' + esc(tr('notesLede')) + '</p></header>';

    h += '<div class="cb-tools" style="margin-bottom:16px"><input class="input" id="notesQ" placeholder="' + esc(tr('notesSearchPh')) + '" value="' + esc(notesQ) + '" style="max-width:260px">' +
      '<div class="pr-opts">' + [['all', tr('notesAll'), all.length], ['py', tr('notesPy'), py.length], ['eng', tr('notesEng'), en.length], ['copy', tr('notesCopy'), cp.length]].map(function (t) { return '<button class="pr-opt' + (notesTab === t[0] ? ' on' : '') + '" data-notestab="' + t[0] + '">' + esc(t[1]) + '<small>' + t[2] + '</small></button>'; }).join('') + '</div></div>';

    if (!shown.length) {
      return h + '<div class="empty"><div class="em-ic">' + IC.notebook + '</div>' +
        '<h3>' + esc(tr('notesEmpty')) + '</h3><p>' + esc(tr('notesEmptyP')) + '</p>' +
        '<button class="btn btn-primary" style="margin-top:20px" data-go="course">' +
          esc(tr('course')) + IC.arrowR + '</button></div></div>';
    }

    shown.forEach(function (n) {
      h += '<article class="note-card">' +
        '<div class="nc-head"><span class="nc-day"><span class="chip">' + esc(tr(n.kind === 'py' ? 'notesPy' : n.kind === 'eng' ? 'notesEng' : 'notesCopy')) + '</span></span>' +
        '<span class="nc-t">' + esc(n.title) + '</span>' +
        '<span class="nc-date">' + esc(fmtDate(n.at)) + '</span></div>' +
        '<div class="nc-body">' + esc(n.text) + '</div>' +
        '<div class="nc-actions">' +
          '<button class="btn btn-ghost btn-sm" data-go="' + esc(n.route) + '">' + esc(tr('notesOpen')) + '</button>' +
          (n.kind === 'py' ? '<button class="btn btn-quiet btn-sm" data-delnote="' + n.key + '">' + IC.trash + esc(tr('delete')) + '</button>' : '') +
        '</div></article>';
    });
    return h + '</div>';
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-notestab]');
    if (t) { notesTab = t.dataset.notestab; App.render(); }
  });
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'notesQ') { notesQ = e.target.value; clearTimeout(window.__nq); window.__nq = setTimeout(function () { App.render(); var q = $('#notesQ'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }, 400); }
  });

  /* ====================== XATOLAR DAFTARI =============================== */
  var mistakeFilter = 'open';

  window.PageMistakes = function () {
    var all = Store.mistakes();
    var catOf = function (m) { return m.cat || 'python'; };
    var shown = all.filter(function (m) {
      var okF = mistakeFilter === 'all' || (mistakeFilter === 'open' ? !m.fixed : m.fixed);
      return okF && (mistakeCat === 'all' || catOf(m) === mistakeCat);
    });

    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('misKick')) + '</div>' +
      '<h1>' + esc(tr('mistakes')) + '</h1>' +
      '<p class="lede">' + esc(tr('misLede')) + '</p></header>';

    if (!all.length) {
      return h + '<div class="empty"><div class="em-ic">' + IC.check + '</div>' +
        '<h3>' + esc(tr('misEmpty')) + '</h3><p>' + esc(tr('misEmptyP')) + '</p></div></div>';
    }

    /* Filtr tugmalari */
    var counts = {
      open: all.filter(function (m) { return !m.fixed; }).length,
      fixed: all.filter(function (m) { return m.fixed; }).length,
      all: all.length
    };
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">';
    [['open', tr('misOpen')], ['fixed', tr('misFixed')], ['all', tr('misAll')]].forEach(function (f) {
      h += '<button class="btn ' + (mistakeFilter === f[0] ? 'btn-primary' : 'btn-ghost') + ' btn-sm" ' +
        'data-misfilter="' + f[0] + '">' + esc(f[1]) + ' (' + counts[f[0]] + ')</button>';
    });
    if (counts.fixed) {
      h += '<button class="btn btn-quiet btn-sm" id="clearFixed" style="margin-left:auto">' +
        IC.trash + esc(tr('misClear')) + '</button>';
    }
    h += '</div>';

    /* Kategoriya filtri — yagona xato banki: Python · ingliz · grammatika · lug'at · mashq */
    var cats = {}; all.forEach(function (m) { cats[catOf(m)] = (cats[catOf(m)] || 0) + 1; });
    h += '<div class="pr-opts" style="margin:-8px 0 18px"><button class="pr-opt' + (mistakeCat === 'all' ? ' on' : '') + '" data-miscat="all">' + esc(tr('misAll')) + '</button>' +
      ['python', 'english', 'grammar', 'vocab', 'reading', 'listening', 'writing', 'speaking', 'practice'].concat(Object.keys(cats).filter(function (c) { return ['python', 'english', 'grammar', 'vocab', 'reading', 'listening', 'writing', 'speaking', 'practice'].indexOf(c) < 0; })).filter(function (c) { return cats[c]; }).map(function (c) { return '<button class="pr-opt' + (mistakeCat === c ? ' on' : '') + '" data-miscat="' + c + '">' + esc(tr('misCat_' + c)) + '<small>' + cats[c] + '</small></button>'; }).join('') + '</div>';

    if (!shown.length) {
      h += '<div class="empty"><div class="em-ic">' + IC.check + '</div><h3>' + esc(tr('misEmpty')) + '</h3></div>';
      return h + '</div>';
    }

    shown.forEach(function (m) {
      var d = dayOf(m.day);
      // Matnni joriy tilda qayta hosil qilamiz: til almashsa xatolar ham tarjima bo'lsin.
      // Savol topilmasa (kurs o'zgargan bo'lsa) — saqlangan nusxa ishlatiladi.
      var live = (d && d.quiz && d.quiz[m.qi]) ? localizedQuiz(m.day, m.qi, d.quiz[m.qi]) : null;
      var qText = live ? live.q : m.q;
      var right = live ? live.opts[d.quiz[m.qi].correct] : m.correct;
      var rvIt = window.Review ? Store.reviewAll()['mistake:' + m.id] : null;
      h += '<article class="mistake-card' + (m.fixed ? ' fixed' : '') + '">' +
        '<div class="mc-head">' +
          '<span class="mc-day"><span class="chip">' + esc(tr('misCat_' + catOf(m))) + '</span> ' + esc(m.day ? tr('day') + ' ' + m.day + ' · ' + (d ? L(d.title) : '') : (m.topic || '')) + '</span>' +
          (rvIt ? '<span class="rv-st st-' + Review.status(rvIt) + '">' + esc(tr('rvSt_' + Review.status(rvIt))) + ' · ' + esc(EngCal.fmt(rvIt.due)) + '</span>' : '') +
          '<span class="mc-times">' + esc(tr('misTimes', { n: m.times })) + '</span></div>' +
        '<div class="mc-q">' + inlineCode(qText) + '</div>' +
        '<div class="mc-ans bad"><span class="lbl">' + esc(tr('misYourAns')) + '</span><span>' + esc(m.chosen) + '</span></div>' +
        '<div class="mc-ans good"><span class="lbl">' + esc(tr('misRight')) + '</span><span>' + esc(right) + '</span></div>';

      // "Nega shunday" izohi bo'lsa — shu yerda ham ko'rsatamiz
      var why = window.EXPLAIN && EXPLAIN[m.day] && EXPLAIN[m.day][m.qi];
      if (why) {
        h += '<div class="q-why show" style="margin-top:12px"><span class="w-ic">' + IC.bulb + '</span>' +
          '<div>' + inlineCode(L(why)) + '</div></div>';
      }

      h += '<div class="nc-actions" style="margin-top:14px">' +
        '<button class="btn ' + (m.fixed ? 'btn-quiet' : 'btn-ghost') + ' btn-sm" data-fixmis="' + esc(m.id) + '">' +
          (m.fixed ? esc(tr('misUnfix')) : IC.check + esc(tr('misMarkFixed'))) + '</button>' +
        '<button class="btn btn-quiet btn-sm" data-go="' + esc(m.route || (m.day ? 'lesson/' + m.day : 'practice')) + '">' + esc(tr('openLesson')) + '</button>' +
        (!rvIt && window.Review ? '<button class="btn btn-quiet btn-sm" data-misrv="' + esc(m.id) + '">' + IC.refresh + esc(tr('grToReview')) + '</button>' : '') +
        '</div></article>';
    });

    return h + '</div>';
  };

  /* O'quv me'yorlari — o'zgarganda saqlanadi */
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t || !t.dataset || !t.dataset.target) return;
    var v = Math.max(0, Math.min(600, Number(t.value) || 0)); t.value = v;
    Store.setSetting({ eng: 'targetEng', codeHeavy: 'targetCodeHeavy', codeClass: 'targetCodeClass' }[t.dataset.target], v);
    toast(tr('saved'), 'ok'); App.refreshChrome();
  });

  window.PageMistakes.setFilter = function (f) { mistakeFilter = f; };
  var mistakeCat = 'all';
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-miscat]');
    if (c) { mistakeCat = c.dataset.miscat; App.render(); return; }
    var r = e.target.closest && e.target.closest('[data-misrv]');
    if (r && window.Review) { var mm = Store.mistakes().filter(function (x) { return x.id === r.dataset.misrv; })[0]; Review.add('mistake', r.dataset.misrv, { cat: mm ? (mm.cat || 'python') : 'python' }); toast(tr('grAddedReview'), 'ok'); App.render(); }
  });

  /* ====================== SOZLAMALAR ==================================== */
  window.PageSettings = function () {
    var s = Store.all().settings;
    var h = '<div class="page stagger" style="max-width:760px">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('setKick')) + '</div>' +
      '<h1>' + esc(tr('settings')) + '</h1>' +
      '<p class="lede">' + esc(tr('setLede')) + '</p></header>';

    /* Profil */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.user + '</span>' + esc(tr('setProfile')) + '</h3>' +
      '<div class="field"><label for="nameInput">' + esc(tr('setName')) + '</label>' +
      '<input class="input" id="nameInput" value="' + esc(Store.get('name')) + '" placeholder="' + esc(tr('setNamePh')) + '">' +
      '<div class="hint">' + esc(tr('setNameHint')) + '</div></div></div>';

    /* Bulut sinxron — akkaunt */
    h += syncCard();

    /* O'qish rejimi */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.book + '</span>' + esc(tr('setLearning')) + '</h3>' +
      switchRow('gate', tr('setGate'), tr('setGateD'), s.gate) +
      switchRow('shuffle', tr('setShuffle'), tr('setShuffleD'), s.shuffle) +
      switchRow('playground', tr('setPlayground'), tr('setPlaygroundD'), s.playground) +
      /* O'quv me'yorlari — Maqsad/Bugun/qarz hisobida ishlatiladi (Goal.required) */
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setTargets')) + '</div><div class="sw-d">' + esc(tr('setTargetsD')) + '</div></div></div>' +
      '<div class="set-targets">' +
        '<label><span>' + esc(tr('english')) + '</span><input class="input sm" type="number" min="30" max="600" step="15" data-target="eng" value="' + (s.targetEng || 240) + '"><i>' + esc(tr('engMin')) + '</i></label>' +
        '<label><span>Coding · ' + esc(tr('habType_heavy')) + '</span><input class="input sm" type="number" min="0" max="600" step="15" data-target="codeHeavy" value="' + (s.targetCodeHeavy || 240) + '"><i>' + esc(tr('engMin')) + '</i></label>' +
        '<label><span>Coding · ' + esc(tr('habType_class')) + '</span><input class="input sm" type="number" min="0" max="600" step="15" data-target="codeClass" value="' + (s.targetCodeClass || 120) + '"><i>' + esc(tr('engMin')) + '</i></label>' +
      '</div>' +
      /* Klaviatura qisqartmalari — "?" oynasini shu yerdan ham ochish mumkin */
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setKbd')) + '</div><div class="sw-d">' + esc(tr('setKbdD')) + '</div></div>' +
        '<button class="btn btn-quiet btn-sm" id="setKbdBtn"><span class="kbd">?</span> ' + esc(tr('kbTitle')) + '</button></div>' +
      '</div>';

    /* Ish davri (loyiha) — jadvaldagi erkin vaqt ISH blokiga aylanadi (HabitPlan.workCfg) */
    var wc = HabitPlan.workCfg();
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.rocket + '</span>' + esc(tr('setWork')) + '</h3>' +
      '<p style="font-size:13.5px;color:var(--muted);margin-bottom:12px">' + esc(tr('setWorkD')) + '</p>' +
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setWorkOn')) + '</div><div class="sw-d">' + esc(tr('setWorkOnD')) + '</div></div>' +
        '<button class="switch' + (wc.on ? ' on' : '') + '" data-workset="on" role="switch" aria-checked="' + wc.on + '"></button></div>' +
      '<div class="set-targets">' +
        '<label><span>' + esc(tr('setWorkFrom')) + '</span><input class="input sm" type="date" data-work="from" value="' + esc(wc.from) + '"></label>' +
        '<label><span>' + esc(tr('setWorkTo')) + '</span><input class="input sm" type="date" data-work="to" value="' + esc(wc.to) + '"></label>' +
        '<label><span>' + esc(tr('setWorkMin')) + '</span><b class="set-fixed">' + wc.min + ' ' + esc(tr('engMin')) + '</b><i>' + esc(tr('setWorkFixed')) + '</i></label>' +
      '</div></div>';

    /* Namoz vaqtlari — kunlik intizom jadvali shunga bog'langan */
    var pc = Store.setting('prayer') || {};
    var todayTimes = Prayer.times(Store.dateKey(), HabitPlan.cfg());
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.mosque + '</span>' + esc(tr('setPrayer')) + '</h3>' +
      '<p style="font-size:13.5px;color:var(--muted);margin-bottom:14px">' + esc(tr('setPrayerD')) + '</p>';

    h += '<div class="field"><label>' + esc(tr('setCity')) + '</label><div class="seg-wrap">';
    Prayer.CITIES.forEach(function (c) {
      h += '<button class="seg-opt' + ((pc.city || 'tashkent') === c.key ? ' on' : '') + '" ' +
        'data-prayerset="city|' + c.key + '">' + esc(c.name) + '</button>';
    });
    h += '</div></div>';

    h += '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setAsr')) + '</div>' +
      '<div class="sw-d">' + esc(tr('setAsrD')) + '</div></div>' +
      '<div class="segmented">' +
      '<button data-prayerset="asr|2"' + ((pc.asr || 2) === 2 ? ' class="on"' : '') + '>' + esc(tr('setAsrHanafi')) + '</button>' +
      '<button data-prayerset="asr|1"' + ((pc.asr || 2) === 1 ? ' class="on"' : '') + '>' + esc(tr('setAsrShafi')) + '</button>' +
      '</div></div>';

    h += '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setAngles')) + '</div>' +
      '<div class="sw-d">' + esc(tr('setAnglesD')) + '</div></div>' +
      '<div class="segmented">' +
      '<button data-prayerset="fajr|18"' + ((pc.fajr || 18) === 18 ? ' class="on"' : '') + '>18°</button>' +
      '<button data-prayerset="fajr|17"' + ((pc.fajr || 18) === 17 ? ' class="on"' : '') + '>17°</button>' +
      '<button data-prayerset="fajr|19"' + ((pc.fajr || 18) === 19 ? ' class="on"' : '') + '>19°</button>' +
      '</div></div>';

    /* Qo'lda kiritish: har namoz uchun avtomatik yoki aniq soat.
       Bomdod va Peshin standart bo'yicha qo'lda (05:20 / 13:00) — ular
       kunlik jadvalning ustuni va har kuni bir xil bo'lgani qulayroq. */
    var manual = pc.manual || {};
    var resolved = HabitPlan.times(Store.dateKey());
    h += '<div class="pray-manual"><div class="gc-l">' + esc(tr('setManual')) + '</div>' +
      '<div class="hint" style="margin-bottom:10px">' + esc(tr('setManualD')) + '</div>';
    ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function (n) {
      var isManual = !!manual[n];
      h += '<div class="pm-row"><span class="pm-n">' + esc(L(Prayer.NAMES[n])) + '</span>' +
        '<input class="input pm-i" type="time" data-manualtime="' + n + '" ' +
          'value="' + esc(isManual ? manual[n] : todayTimes[n].str) + '"' + (isManual ? '' : ' disabled') + '>' +
        '<button class="seg-opt' + (isManual ? '' : ' on') + '" data-manualmode="' + n + '|auto">' + esc(tr('setAuto')) + '</button>' +
        '<button class="seg-opt' + (isManual ? ' on' : '') + '" data-manualmode="' + n + '|manual">' + esc(tr('setFixed')) + '</button>' +
        '</div>';
    });
    h += '</div>';

    h += '<div class="pray-preview"><div class="gc-l">' + esc(tr('setPrayerToday')) + '</div><div class="pp-row">';
    Prayer.ORDER.forEach(function (n) {
      var p = resolved[n] || todayTimes[n];
      if (!p) return;
      h += '<span><b>' + esc(L(Prayer.NAMES[n])) + (p.manual ? ' ·' : '') + '</b>' + esc(p.str) + '</span>';
    });
    h += '</div><div class="hint">' + esc(tr('setPrayerWarn')) + '</div></div></div>';

    /* Ko'rinish */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.sun + '</span>' + esc(tr('setAppearance')) + '</h3>' +
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setTheme')) + '</div><div class="sw-d">' + esc(tr('setThemeD')) + '</div></div></div>' +
      '<div class="theme-grid">' + App.THEMES.map(function (t) {
        return '<button class="theme-sw' + (Store.get('theme') === t.id ? ' on' : '') + '" data-theme-set="' + t.id + '" style="--sw-bg:' + t.sw[0] + ';--sw-ac:' + t.sw[1] + '">' +
          '<span class="ts-chip"><i></i><i></i><i></i></span><span class="ts-n">' + esc(tr('theme_' + t.id)) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setLang')) + '</div></div>' +
      '<div class="segmented"><button data-lang-set="uz"' + (Store.get('lang') === 'uz' ? ' class="on"' : '') + '>UZ</button>' +
      '<button data-lang-set="en"' + (Store.get('lang') === 'en' ? ' class="on"' : '') + '>EN</button></div></div>' +
      '</div>';

    /* Ma'lumotlar */
    var kb = 0; try { kb = Math.round(JSON.stringify(Store.all()).length / 1024); } catch (e) {}
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.layers + '</span>' + esc(tr('setData')) + '</h3>' +
      '<p class="sync-note">' + esc(tr('setDataS')) + ' ' + esc(tr('setDataSize', { kb: kb })) + '</p>' +
      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setExport')) + '</div>' +
      '<div class="sw-d">' + esc(tr('setExportD')) + '</div></div>' +
      '<button class="btn btn-ghost btn-sm" id="exportBtn">' + IC.download + esc(tr('setExport')) + '</button></div>' +

      '<div class="switch-row"><div><div class="sw-t">' + esc(tr('setImport')) + '</div></div>' +
      '<label class="btn btn-ghost btn-sm" for="importFile" style="cursor:pointer">' + esc(tr('setImport')) + '</label>' +
      '<input type="file" id="importFile" accept="application/json,.json" class="sr-only"></div>' +

      '<div class="switch-row"><div><div class="sw-t" style="color:var(--red)">' + esc(tr('setReset')) + '</div>' +
      '<div class="sw-d">' + esc(tr('setResetD')) + '</div></div>' +
      '<button class="btn btn-ghost btn-sm" id="resetBtn" style="border-color:var(--red);color:var(--red)">' +
        IC.trash + esc(tr('delete')) + '</button></div>' +
      '<p class="hint" style="margin-top:12px">' + esc(tr('setPrivacy')) + '</p>' +
      '<p class="hint">' + esc(tr('pwaOffline')) + (window.__swReady ? ' ✓' : '') + '</p>' +
      '</div>';

    return h + '</div>';
  };

  /* Akkaunt kartasi. To'rt holat:
       off   — file:// dan ochilgan, bulut yo'q (izoh ko'rsatiladi)
       out   — login formasi
       in    — kim, oxirgi sinxron, chiqish tugmasi
       error — server javob bermadi                                        */
  function syncCard() {
    var st = window.Sync ? Sync.status() : 'off';
    var h = '<div class="card" id="syncCard"><h3 class="card-title"><span class="num">' + IC.cloud + '</span>' + esc(tr('setSync')) + '</h3>';

    if (st === 'off') {
      h += '<p class="sync-note">' + esc(tr('setSyncOff')) + '</p>';
      return h + '</div>';
    }

    /* Deploy bo'lgan, lekin Vercel'da o'zgaruvchilar qo'yilmagan —
       login formasining foydasi yo'q, nima qilish kerakligini aytamiz.  */
    if (st === 'env') {
      h += '<p class="sync-note warn" style="margin-top:0">' + esc(tr('setSyncEnv')) + '</p>' +
        '<ul class="sync-missing">';
      (Sync.envMissing() || []).forEach(function (k) { h += '<li><code>' + esc(k) + '</code></li>'; });
      h += '</ul><p class="sync-note">' + esc(tr('setSyncEnvHow')) + '</p>';
      return h + '</div>';
    }

    if (st === 'in' || (st === 'busy' && Sync.user())) {
      var at = Sync.lastAt();
      h += '<div class="switch-row"><div><div class="sw-t">' + esc(Sync.user() || '—') + '</div>' +
        '<div class="sw-d">' + esc(tr('setSyncOn')) + (at ? ' · ' + esc(tr('setSyncAt', { t: new Date(at).toLocaleString() })) : '') + '</div></div>' +
        '<span class="sync-dot ' + st + '" id="syncDot"></span></div>' +
        '<div class="sync-actions">' +
        '<button class="btn btn-ghost btn-sm" id="syncNow">' + IC.refresh + esc(tr('setSyncNow')) + '</button>' +
        '<button class="btn btn-ghost btn-sm" id="syncOut">' + esc(tr('setSyncOut')) + '</button></div>' +
        '<details class="sync-pw"><summary>' + esc(tr('setSyncChangeUser')) + '</summary>' +
        '<p class="sync-note">' + esc(tr('setSyncChangeUserD')) + '</p>' +
        '<form id="syncUserForm" class="sync-form" autocomplete="on">' +
        '<div class="field"><label for="syncUserNext">' + esc(tr('setSyncNewUser')) + '</label>' +
        '<input class="input" id="syncUserNext" type="text" minlength="3" maxlength="32" autocomplete="username" autocapitalize="off" spellcheck="false" required></div>' +
        '<div class="field"><label for="syncUserCurrentPass">' + esc(tr('setSyncCurrentPass')) + '</label>' +
        '<input class="input" id="syncUserCurrentPass" type="password" autocomplete="current-password" required></div>' +
        '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="syncUserSave" type="submit">' + esc(tr('setSyncSaveUser')) + '</button>' +
        '<span class="sync-err" id="syncUserErr" hidden></span></div></form></details>' +
        '<details class="sync-pw"><summary>' + esc(tr('setSyncChangePass')) + '</summary>' +
        '<p class="sync-note">' + esc(tr('setSyncChangePassD')) + '</p>' +
        '<form id="syncPwForm" class="sync-form" autocomplete="on">' +
        '<div class="field"><label for="syncPwCurrent">' + esc(tr('setSyncCurrentPass')) + '</label>' +
        '<input class="input" id="syncPwCurrent" type="password" autocomplete="current-password" required></div>' +
        '<div class="field"><label for="syncPwNext">' + esc(tr('setSyncNewPass')) + '</label>' +
        '<input class="input" id="syncPwNext" type="password" minlength="6" autocomplete="new-password" required></div>' +
        '<div class="field"><label for="syncPwAgain">' + esc(tr('setSyncNewPassAgain')) + '</label>' +
        '<input class="input" id="syncPwAgain" type="password" minlength="6" autocomplete="new-password" required></div>' +
        '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="syncPwSave" type="submit">' + esc(tr('setSyncSavePass')) + '</button>' +
        '<span class="sync-err" id="syncPwErr" hidden></span></div></form></details>';
      return h + '</div>';
    }

    h += '<p class="sync-note">' + esc(tr('setSyncD')) + '</p>' +
      '<form id="syncForm" class="sync-form" autocomplete="on">' +
      '<div class="field"><label for="syncUser">' + esc(tr('setSyncUser')) + '</label>' +
      '<input class="input" id="syncUser" name="username" autocomplete="username" autocapitalize="off" spellcheck="false"></div>' +
      '<div class="field"><label for="syncPass">' + esc(tr('setSyncPass')) + '</label>' +
      '<input class="input" id="syncPass" name="password" type="password" autocomplete="current-password"></div>' +
      '<div class="sync-actions"><button class="btn btn-primary btn-sm" type="submit" id="syncIn">' + esc(tr('setSyncIn')) + '</button>' +
      '<span class="sync-err" id="syncErr" hidden></span></div></form>';
    if (st === 'error') h += '<p class="sync-note warn">' + esc(tr('setSyncErr')) + '</p>';
    return h + '</div>';
  }

  function switchRow(key, title, desc, on) {
    return '<div class="switch-row"><div><div class="sw-t">' + esc(title) + '</div>' +
      '<div class="sw-d">' + esc(desc) + '</div></div>' +
      '<button class="switch' + (on ? ' on' : '') + '" data-setting="' + key + '" ' +
      'role="switch" aria-checked="' + (!!on) + '" aria-label="' + esc(title) + '"></button></div>';
  }

  /* Sync holati o'zgarganda faqat akkaunt kartasini yangilaymiz — butun
     sahifani emas: foydalanuvchi parol yozayotgan bo'lsa forma o'chib
     ketmasin. `busy` ham e'tiborga olinmaydi (faqat nuqta rangi).        */
  var lastSyncKind = null;
  function syncKind(s) { return s === 'busy' ? lastSyncKind : s; }
  function refreshSyncCard() {
    var card = $('#syncCard');
    if (!card) return;
    var kind = syncKind(Sync.status());
    if (kind === lastSyncKind) {
      var dot = $('#syncDot');
      if (dot) dot.className = 'sync-dot ' + Sync.status();
      return;
    }
    if (card.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return;
    lastSyncKind = kind;
    var tmp = document.createElement('div');
    tmp.innerHTML = syncCard();
    card.replaceWith(tmp.firstChild);
    bindSync();
  }
  if (window.Sync) Sync.onStatus(function () { if ($('#syncCard')) refreshSyncCard(); });

  function bindSync() {
    var form = $('#syncForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('#syncIn'), err = $('#syncErr');
      var u = $('#syncUser').value.trim(), p = $('#syncPass').value;
      if (!u || !p) return;
      btn.disabled = true; err.hidden = true;
      Sync.login(u, p).then(function (r) {
        btn.disabled = false;
        if (r.ok) { toast(tr('setSyncWelcome', { u: u }), 'ok'); App.render(); return; }
        var msg = r.reason === 'locked' ? tr('setSyncLocked', { m: r.retryMin || 15 })
          : r.reason === 'env' ? tr('setSyncEnv') + ' ' + (r.missing || []).join(', ')
          : r.reason === 'network' ? tr('setSyncErr')
          : tr('setSyncBad');
        err.textContent = msg; err.hidden = false;
      });
    });
    var out = $('#syncOut');
    if (out) out.addEventListener('click', function () {
      Sync.logout().then(function () { toast(tr('setSyncBye'), 'ok'); App.render(); });
    });
    var now = $('#syncNow');
    if (now) now.addEventListener('click', function () {
      now.disabled = true;
      Sync.pull().then(function () { return Sync.push(); }).then(function () {
        now.disabled = false;
        toast(Sync.status() === 'in' ? tr('setSyncDone') : tr('setSyncErr'), Sync.status() === 'in' ? 'ok' : 'warn');
        App.render();
      });
    });
    var pwForm = $('#syncPwForm');
    if (pwForm) pwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var current = $('#syncPwCurrent').value;
      var next = $('#syncPwNext').value;
      var again = $('#syncPwAgain').value;
      var btn = $('#syncPwSave'), err = $('#syncPwErr');
      err.hidden = true;
      if (next.length < 6) { err.textContent = tr('setSyncPassShort'); err.hidden = false; return; }
      if (next !== again) { err.textContent = tr('setSyncPassMatch'); err.hidden = false; return; }
      if (next === current) { err.textContent = tr('setSyncPassSame'); err.hidden = false; return; }
      btn.disabled = true;
      Sync.changePassword(current, next).then(function (r) {
        btn.disabled = false;
        if (r.ok) {
          pwForm.reset();
          toast(tr('setSyncPassDone'), 'ok');
          return;
        }
        err.textContent = r.reason === 'locked' ? tr('setSyncLocked', { m: r.retryMin || 15 })
          : r.reason === 'wrong' ? tr('setSyncCurrentWrong')
          : r.reason === 'short' ? tr('setSyncPassShort')
          : r.reason === 'same' ? tr('setSyncPassSame')
          : tr('setSyncErr');
        err.hidden = false;
      });
    });
    var userForm = $('#syncUserForm');
    if (userForm) userForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var next = $('#syncUserNext').value.trim();
      var current = $('#syncUserCurrentPass').value;
      var btn = $('#syncUserSave'), err = $('#syncUserErr');
      err.hidden = true;
      if (!/^[A-Za-z0-9_.-]{3,32}$/.test(next)) { err.textContent = tr('setSyncUserFormat'); err.hidden = false; return; }
      btn.disabled = true;
      Sync.changeUsername(current, next).then(function (r) {
        btn.disabled = false;
        if (r.ok) { userForm.reset(); toast(tr('setSyncUserDone', { u: r.user }), 'ok'); App.render(); return; }
        err.textContent = r.reason === 'wrong' ? tr('setSyncCurrentWrong')
          : r.reason === 'same' ? tr('setSyncUserSame')
          : r.reason === 'format' ? tr('setSyncUserFormat') : tr('setSyncErr');
        err.hidden = false;
      });
    });
  }

  window.PageSettings.mount = function () {
    lastSyncKind = window.Sync ? syncKind(Sync.status()) : 'off';
    bindSync();
    var kb = $('#setKbdBtn'); if (kb) kb.addEventListener('click', function () { App.kbdHelp(true); });

    /* Ish davri */
    $$('[data-workset]').forEach(function (b) { b.addEventListener('click', function () { var w = Object.assign({}, Store.setting('work') || {}); w.on = !(w.on !== false); Store.setSetting('work', w); App.render(); }); });
    $$('[data-work]').forEach(function (el) { el.addEventListener('change', function () { var w = Object.assign({}, HabitPlan.workCfg(), Store.setting('work') || {}); w[el.dataset.work] = el.dataset.work === 'min' ? Number(el.value) || 150 : el.value; Store.setSetting('work', w); toast(tr('saved'), 'ok'); }); });

    /* Qo'lda kiritilgan namoz vaqtlari */
    $$('[data-manualtime]').forEach(function (el) {
      el.addEventListener('change', function () {
        if (!el.value) return;
        var cfg = Store.setting('prayer') || {};
        cfg.manual = cfg.manual || {};
        cfg.manual[el.dataset.manualtime] = el.value;
        Store.setSetting('prayer', cfg);
        toast(tr('saved'), 'ok');
        App.render();
      });
    });

    var nameInput = $('#nameInput');
    if (nameInput) {
      var t = null;
      nameInput.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { Store.set('name', nameInput.value.trim()); }, 400);
      });
    }

    var exportBtn = $('#exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'uzleeder-academy-progress-' + Store.dateKey() + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      toast(tr('exportOk'), 'ok');
    });

    var file = $('#importFile');
    if (file) file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          Store.importJSON(String(reader.result));
          toast(tr('importOk'), 'ok');
          App.applyTheme(); App.render();
        } catch (e) { toast(tr('importFail'), 'warn'); }
      };
      reader.readAsText(f);
    });

    var reset = $('#resetBtn');
    if (reset) reset.addEventListener('click', function () { App.resetProgress(); });
  };
})();
