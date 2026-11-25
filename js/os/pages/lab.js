/* ==========================================================================
   Review Lab — barcha takror ishlari bitta manzilda
   --------------------------------------------------------------------------
   Brief 4D. Navbat · Xatolar daftari · Lug'at · Grammatika · Kartalar ·
   Cheatsheet · Takror tarixi.

   XATOLAR DAFTARI — to'rt ustun saqlanib qoldi (mavjud Store.mistakes):
     1. Modul va test     (day/qi → qaysi dars, qaysi savol)
     2. Mening javobim    (chosen)
     3. To'g'ri javob     (correct)
     4. Nega xato qildim  (why — qo'shimcha, o'quvchi yozadi)

   Qo'shimcha metadata ixtiyoriy: toifa, sana, qiyinlik, takror soni,
   holat, izoh, tuzatish dalili.

   HAL BO'LGAN deb belgilash: faqat KEYINGI takrorda to'g'ri javob
   berilganda. Qo'lda "fixed" qilish ham mumkin, lekin u dalil sifatida
   boshqacha belgilanadi (manual).
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  /* ---------- 1. NAVBAT ------------------------------------------------ */

  function viewDue() {
    var rv = OS.data.review();
    var due = [];
    try { if (window.Review) due = Review.due(); } catch (e) {}

    var html = '<div class="os-grid c4" style="margin-bottom:var(--sp-4)">' +
      sh().stat(L({ uz: 'Muddati keldi', en: 'Due now' }), rv.due, null, rv.due ? 'accent' : '') +
      sh().stat(L({ uz: '7 kun ichida', en: 'Next 7 days' }), rv.upcoming, null) +
      sh().stat(L({ uz: 'Jami yozuv', en: 'Total items' }), rv.total, null) +
      sh().stat(L({ uz: 'Ochiq xatolar', en: 'Open mistakes' }), rv.openMistakes, L({ uz: 'jami', en: 'of' }) + ' ' + rv.allMistakes) +
      '</div>';

    html += '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Takror navbati', en: 'Review queue' })) + '</h2>' +
      (due.length ? '<button class="os-btn primary" data-go="classic/review">' + esc(L({ uz: 'Takrorni boshlash', en: 'Start review' })) + '</button>' : '') +
      '</div>';

    if (!due.length) {
      html += sh().empty(L({ uz: 'Navbat boʻsh', en: 'The queue is empty' }),
        L({ uz: 'Muddati kelgan yozuv yoʻq. Yangi xato yoki soʻz qoʻshilganda bu yerda paydo boʻladi.',
            en: 'Nothing is due. New mistakes or words will appear here when they are added.' }));
    } else {
      html += due.slice(0, 20).map(function (it) {
        var card = null;
        try { card = Review.card(it); } catch (e) {}
        var st = Review.status(it);
        return '<div class="os-row">' +
          '<span class="os-row-main"><b>' + esc(card ? String(card.front).slice(0, 90) : it.id) + '</b>' +
          '<span>' + esc(it.kind) + (card && card.sub ? ' · ' + esc(card.sub) : '') +
          ' · ' + esc(L({ uz: 'takror', en: 'reps' })) + ' ' + (it.reps || 0) + '</span></span>' +
          sh().chip(st, st === 'due' ? 'warn' : st === 'mastered' ? 'on' : '') +
          '<time>' + esc(it.due || '') + '</time>' +
          '</div>';
      }).join('');
      if (due.length > 20) {
        html += '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">+' + (due.length - 20) + ' ' +
          esc(L({ uz: 'yana', en: 'more' })) + '</p>';
      }
    }
    html += '</section>';

    /* Modul bo'yicha taqsimot — faqat haqiqiy yozuvlardan */
    var byKind = {};
    try {
      Review.list().forEach(function (it) { byKind[it.kind] = (byKind[it.kind] || 0) + 1; });
    } catch (e) {}
    var kinds = Object.keys(byKind);
    if (kinds.length) {
      html += '<section class="os-card" style="margin-top:var(--sp-4)">' +
        '<h2>' + esc(L({ uz: 'Modullar boʻyicha', en: 'By module' })) + '</h2>' +
        kinds.sort(function (a, b) { return byKind[b] - byKind[a]; }).map(function (k) {
          var max = byKind[kinds[0]] || 1;
          return '<div style="margin-bottom:10px">' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">' +
            '<b>' + esc(k) + '</b><span style="color:var(--muted)">' + byKind[k] + '</span></div>' +
            sh().meter(byKind[k] / max * 100) + '</div>';
        }).join('') + '</section>';
    }

    return html;
  }

  /* ---------- 2. XATOLAR DAFTARI --------------------------------------- */

  function mistakeRow(m) {
    var meta = (window.Store && Store.all().osMistakeMeta) || {};
    var x = meta[m.id] || {};
    var resolved = m.fixed;
    return '<tr data-mid="' + esc(m.id) + '">' +
      '<td data-l="' + esc(L({ uz: 'Modul va test', en: 'Module and test' })) + '">' +
        '<b>' + esc(x.cat || (m.day ? 'day ' + m.day : '—')) + '</b>' +
        '<div style="font-size:12px;color:var(--muted);margin-top:3px">' + esc(String(m.q || '').slice(0, 120)) + '</div>' +
      '</td>' +
      '<td data-l="' + esc(L({ uz: 'Mening javobim', en: 'My answer' })) + '" style="color:var(--red)">' + esc(m.chosen || '—') + '</td>' +
      '<td data-l="' + esc(L({ uz: 'Toʻgʻri javob', en: 'Correct answer' })) + '" style="color:var(--green)">' + esc(m.correct || '—') + '</td>' +
      '<td data-l="' + esc(L({ uz: 'Nega xato qildim', en: 'Why I made the mistake' })) + '">' +
        '<input type="text" value="' + esc(x.why || '') + '" data-why="' + esc(m.id) + '" placeholder="' +
          esc(L({ uz: 'sababini yoz…', en: 'write the reason…' })) + '" ' +
          'style="width:100%;min-width:140px;padding:6px 9px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--ink);font:inherit;font-size:12.5px">' +
      '</td>' +
      '<td data-l="' + esc(L({ uz: 'Holat', en: 'Status' })) + '">' +
        sh().chip(resolved
          ? L({ uz: 'hal boʻldi', en: 'resolved' })
          : L({ uz: 'ochiq', en: 'open' }), resolved ? 'on' : 'warn') +
        '<div style="font-size:11px;color:var(--faint);margin-top:4px">' +
          esc(L({ uz: 'takror', en: 'reps' })) + ' ' + (m.times || 1) +
          (x.resolvedBy ? ' · ' + esc(x.resolvedBy) : '') + '</div>' +
      '</td>' +
      '</tr>';
  }

  function viewMistakes() {
    var st = window.Store;
    var all = st && st.mistakes ? st.mistakes() : [];
    var open = all.filter(function (m) { return !m.fixed; });

    var html = '<div class="os-grid c4" style="margin-bottom:var(--sp-4)">' +
      sh().stat(L({ uz: 'Ochiq', en: 'Open' }), open.length, null, open.length ? 'accent' : '') +
      sh().stat(L({ uz: 'Hal boʻlgan', en: 'Resolved' }), all.length - open.length, null) +
      sh().stat(L({ uz: 'Jami', en: 'Total' }), all.length, null) +
      sh().stat(L({ uz: 'Takrorda', en: 'In review' }), (function () {
        try { return Review.list().filter(function (it) { return it.kind === 'mistake'; }).length; } catch (e) { return 0; }
      })(), null) +
      '</div>';

    html += '<div class="os-note info" style="margin-bottom:var(--sp-4)">' + sh().icon('bulb') + '<div>' +
      esc(L({ uz: 'Xato faqat KEYINGI takrorda toʻgʻri javob berilganda hal boʻlgan deb belgilanadi. Qoʻlda belgilash ham mumkin, lekin u boshqacha yoziladi.',
              en: 'A mistake is marked resolved only when a later review is answered correctly. Marking it by hand is possible, but recorded differently.' })) +
      '</div></div>';

    html += '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Xatolar daftari', en: 'Error Log' })) + '</h2>' +
      '<button class="os-btn ghost" data-go="review/mistakes">' + esc(L({ uz: 'Eski koʻrinish', en: 'Classic view' })) + '</button></div>';

    if (!all.length) {
      html += sh().empty(L({ uz: 'Xato yozilmagan', en: 'No mistakes recorded' }),
        L({ uz: 'Testda xato qilinganda yozuv avtomatik shu yerga tushadi.',
            en: 'When a quiz answer is wrong, the record lands here automatically.' }));
    } else {
      html += '<div class="os-table-wrap"><table class="os-table"><thead><tr>' +
        '<th>' + esc(L({ uz: 'Modul va test', en: 'Module and test' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Mening javobim', en: 'My answer' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Toʻgʻri javob', en: 'Correct answer' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Nega xato qildim', en: 'Why I made the mistake' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Holat', en: 'Status' })) + '</th>' +
        '</tr></thead><tbody>' + all.slice(0, 60).map(mistakeRow).join('') + '</tbody></table></div>';
    }
    html += '</section>';
    return html;
  }

  /* ---------- 3/4. LUG'AT VA GRAMMATIKA -------------------------------- */

  function viewVocab() {
    var items = [];
    try { items = Review.list().filter(function (it) { return it.kind === 'vocab' || it.kind === 'bw'; }); } catch (e) {}
    var red = items.filter(function (it) { return (it.lapses || 0) >= 2; });

    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Faol eslash', en: 'Active recall' })) + '</h2>' +
        '<button class="os-btn primary" data-go="classic/flash">' + esc(L({ uz: 'Kartalar', en: 'Cards' })) + '</button></div>' +
        (items.length
          ? '<div class="os-grid c3">' +
            sh().stat(L({ uz: 'Jami soʻz', en: 'Words' }), items.length) +
            sh().stat(L({ uz: 'Muddati kelgan', en: 'Due' }), items.filter(function (it) { try { return Review.status(it) === 'due'; } catch (e) { return false; } }).length) +
            sh().stat(L({ uz: 'Oʻzlashtirilgan', en: 'Mastered' }), items.filter(function (it) { try { return Review.status(it) === 'mastered'; } catch (e) { return false; } }).length) +
            '</div>'
          : sh().empty(L({ uz: 'Lugʻat yozuvi yoʻq', en: 'No vocabulary items' }),
              L({ uz: 'Kitob yoki daftardan soʻz qoʻshilganda shu yerga tushadi.', en: 'Words added from a book or notebook land here.' }))) +
      '</section>' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Qizil roʻyxat', en: 'Red List' })) + '</h2>' +
        sh().chip(red.length + ' ' + L({ uz: 'qiyin', en: 'difficult' }), red.length ? 'warn' : 'off') + '</div>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Ikki va undan koʻp marta unutilgan soʻzlar.', en: 'Words forgotten two or more times.' })) + '</p>' +
        (red.length ? red.slice(0, 15).map(function (it) {
          var c = null; try { c = Review.card(it); } catch (e) {}
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(c ? c.front : it.ref) + '</b>' +
            '<span>' + esc(L({ uz: 'unutilgan', en: 'lapses' })) + ' ' + (it.lapses || 0) + '</span></span></div>';
        }).join('') : sh().empty(L({ uz: 'Qiyin soʻz yoʻq', en: 'No difficult words' }), '')) +
      '</section>' +
      '</div>';
  }

  function viewGrammar() {
    var topics = (window.ENG_GRAMMAR && Object.keys(ENG_GRAMMAR)) || [];
    var mistakes = [];
    try {
      mistakes = Review.list().filter(function (it) { return it.kind === 'grammar'; });
    } catch (e) {}
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Grammatika takrori', en: 'Grammar review' })) + '</h2>' +
        sh().chip(topics.length + ' ' + L({ uz: 'mavzu', en: 'topics' })) + '</div>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Mavzular toʻliq saqlanib qoldi — cheatsheet ichida.', en: 'All topics are preserved — inside the cheatsheet.' })) + '</p>' +
        '<button class="os-btn primary" data-go="cheatsheet/grammar">' + esc(L({ uz: 'Grammatika cheatsheet', en: 'Grammar cheatsheet' })) + '</button>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Takrordagi mavzular', en: 'Topics in review' })) + '</h2>' +
        (mistakes.length ? mistakes.slice(0, 15).map(function (it) {
          var c = null; try { c = Review.card(it); } catch (e) {}
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(c ? c.front : it.ref) + '</b>' +
            '<span>' + esc(L({ uz: 'takror', en: 'reps' })) + ' ' + (it.reps || 0) + '</span></span>' +
            '<time>' + esc(it.due || '') + '</time></div>';
        }).join('') : sh().empty(L({ uz: 'Takrorda mavzu yoʻq', en: 'No topics in review' }), '')) +
      '</section>' +
      '</div>';
  }

  /* ---------- 5/6. KARTALAR VA CHEATSHEET ------------------------------ */

  function viewCards() {
    var etch = 0;
    try { if (window.Etch && Etch.dueCount) etch = Etch.dueCount(); } catch (e) {}
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Kartalar', en: 'Flashcards' })) + '</h2>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Ikki tomonli kartalar — soʻz, taʼrif, misol.', en: 'Two-sided cards — word, definition, example.' })) + '</p>' +
        '<button class="os-btn primary" data-go="classic/flash">' + esc(L({ uz: 'Ochish', en: 'Open' })) + '</button>' +
      '</section>' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Toshbitik', en: 'Etch' })) + '</h2>' +
        (etch ? sh().chip(etch + ' ' + L({ uz: 'muddati keldi', en: 'due' }), 'warn') : '') + '</div>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Qatʼiy rejim: yodlangani tasdiqlanmaguncha oʻchmaydi.', en: 'Strict mode: an item stays until recall is confirmed.' })) + '</p>' +
        '<button class="os-btn ghost" data-go="flash/etch">' + esc(L({ uz: 'Ochish', en: 'Open' })) + '</button>' +
      '</section>' +
      '</div>';
  }

  function viewSheets() {
    var sheets = [
      ['cheatsheet', { uz: 'Python', en: 'Python' }, 'code'],
      ['cheatsheet/grammar', { uz: 'Grammatika', en: 'Grammar' }, 'pen'],
      ['cheatsheet/vocab', { uz: 'Lugʻat', en: 'Vocabulary' }, 'notebook']
    ];
    return '<div class="os-grid c3">' + sheets.map(function (s) {
      return '<button class="os-card" data-go="' + s[0] + '">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' + sh().icon(s[2]) +
        '<b style="font-size:15px">' + esc(L(s[1])) + '</b></div>' +
        '<span style="font-size:12.5px;color:var(--muted)">' + esc(L({ uz: 'Ochish', en: 'Open' })) + ' →</span>' +
        '</button>';
    }).join('') + '</div>';
  }

  /* ---------- 7. TAKROR TARIXI ----------------------------------------- */

  function viewHistory() {
    var st = window.Store;
    var ev = st && st.events ? st.events(200).filter(function (e) { return e.type === 'review'; }).reverse() : [];
    return '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Takror tarixi', en: 'Review history' })) + '</h2>' +
      (ev.length ? ev.slice(0, 40).map(function (e) {
        return '<div class="os-row"><span class="os-row-main"><b>' + esc(e.title || e.ref) + '</b></span>' +
          '<time>' + new Date(e.at).toISOString().slice(0, 16).replace('T', ' ') + '</time></div>';
      }).join('') : sh().empty(L({ uz: 'Takror yozuvi yoʻq', en: 'No review records' }),
        L({ uz: 'Har baholash shu yerda qoladi.', en: 'Every rating is recorded here.' }))) +
      '</section>';
  }

  /* ---------- sahifa --------------------------------------------------- */

  function render(tab) {
    tab = tab || 'due';
    var dest = OS.NAV.destOf('lab');
    var body =
        tab === 'mistakes' ? viewMistakes()
      : tab === 'vocab'    ? viewVocab()
      : tab === 'grammar'  ? viewGrammar()
      : tab === 'cards'    ? viewCards()
      : tab === 'sheets'   ? viewSheets()
      : tab === 'history'  ? viewHistory()
      : viewDue();
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('lab', dest.tabs, tab) +
      body + '</div>';
  }

  function mount(tab) {
    if (tab !== 'mistakes') return;
    /* "Nega xato qildim" — qo'shimcha metadata, asl yozuvga tegmaydi */
    Array.prototype.forEach.call(document.querySelectorAll('[data-why]'), function (inp) {
      inp.addEventListener('change', function () {
        var st = window.Store;
        if (!st || !st.all) return;
        var s = st.all();
        if (!s.osMistakeMeta) s.osMistakeMeta = {};
        var id = inp.dataset.why;
        s.osMistakeMeta[id] = Object.assign({}, s.osMistakeMeta[id], { why: inp.value, at: Date.now() });
        st.set('osMistakeMeta', s.osMistakeMeta);
        if (window.toast) toast(L({ uz: 'Yozildi', en: 'Saved' }), 'ok');
      });
    });
  }

  OS.pages.lab = { render: render, mount: mount };
})();
