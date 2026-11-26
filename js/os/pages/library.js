/* ==========================================================================
   Knowledge Library — kitob, matn, audio, eslatma va saqlanganlar
   --------------------------------------------------------------------------
   Brief 4E. Fayl yoki dars mazmuni TAKRORLANMAYDI: bu yerda faqat
   havolalar va o'quvchining o'z yozuvlari.

   Mualliflik huquqi: kitob matnlari saqlanmaydi va ko'chirilmaydi —
   faqat manba havolasi va o'quvchining o'z nusxasiga ishora.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  function tile(route, title, sub, ic) {
    return '<button class="os-card" data-go="' + route + '">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">' +
        '<span style="width:28px;height:28px;border-radius:var(--r-sm);background:var(--surface-3);display:grid;place-items:center">' + sh().icon(ic) + '</span>' +
        '<b style="font-size:14.5px">' + esc(L(title)) + '</b></div>' +
      '<span style="font-size:12.5px;color:var(--muted)">' + esc(L(sub)) + '</span>' +
      '</button>';
  }

  /* ---------- 1. KITOBLAR ---------------------------------------------- */
  function viewBooks() {
    var src = (window.ENG_BOOK && ENG_BOOK.sources) || null;
    var list = [];
    if (src) {
      try {
        list = (Array.isArray(src) ? src : Object.keys(src).map(function (k) { return src[k]; }))
          .filter(function (b) { return b && (b.title || b.name); });
      } catch (e) { list = []; }
    }

    return '<div class="os-grid c3">' +
      tile('books/vocab', { uz: 'Destination B2', en: 'Destination B2' }, { uz: 'Luğat va grammatika unitlari', en: 'Vocabulary and grammar units' }, 'book') +
      tile('books/reading', { uz: 'Öqiş markazi', en: 'Reading centre' }, { uz: 'Uç yönaliş: ebook, diniy, tarixiy', en: 'Three tracks: ebook, religious, history' }, 'doc') +
      tile('books/listen', { uz: 'Tinglaş bölimlari', en: 'Listening sections' }, { uz: 'Kitob audio bölimlari', en: 'Book audio sections' }, 'headphones') +
      tile('books/ess4', { uz: 'Essential 4', en: 'Essential 4' }, { uz: 'Ixtiyoriy luğat röyxati', en: 'Optional vocabulary list' }, 'notebook') +
      tile('books/ra', { uz: 'Reading Accelerator', en: 'Reading Accelerator' }, { uz: 'Şaxsiy PDF nusxa', en: 'Your own PDF copy' }, 'doc') +
      tile('books/s1', { uz: 'Listening Section 1', en: 'Listening Section 1' }, { uz: 'Şaxsiy PDF nusxa', en: 'Your own PDF copy' }, 'headphones') +
      '</div>' +
      (list.length ? '<section class="os-card" style="margin-top:var(--sp-4)">' +
        '<h2>' + esc(L({ uz: 'Manbalar', en: 'Sources' })) + '</h2>' +
        list.slice(0, 12).map(function (b) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(b.title || b.name) + '</b>' +
            (b.author ? '<span>' + esc(b.author) + '</span>' : '') + '</span></div>';
        }).join('') +
        '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'Kitob matni saytga köçirilmaydi — öz nusxangizdan işlaysiz.',
                en: 'Book text is not copied into the site — you work from your own copy.' })) + '</p>' +
        '</section>' : '');
  }

  /* ---------- 2. O'QISH ------------------------------------------------ */
  function viewReading() {
    var st = window.Store;
    var read = st && st.readList ? st.readList() : {};
    var keys = Object.keys(read);
    return '<div class="os-grid c3" style="margin-bottom:var(--sp-4)">' +
      tile('books/reading', { uz: 'Ebook', en: 'Ebook' }, { uz: 'Asosiy öqiş matnlari', en: 'Main reading passages' }, 'doc') +
      tile('books/religious', { uz: 'Diniy', en: 'Religious' }, { uz: 'Diniy matnlar', en: 'Religious texts' }, 'book') +
      tile('books/history', { uz: 'Tarixiy', en: 'History' }, { uz: 'Tarixiy matnlar', en: 'Historical texts' }, 'layers') +
      '</div>' +
      '<section class="os-card"><h2>' + esc(L({ uz: 'Öqiş natijalari', en: 'Reading results' })) + '</h2>' +
      (keys.length ? '<div class="os-table-wrap"><table class="os-table"><thead><tr>' +
        '<th>' + esc(L({ uz: 'Matn', en: 'Passage' })) + '</th><th>WPM</th>' +
        '<th>' + esc(L({ uz: 'Ball', en: 'Score' })) + '</th><th>' + esc(L({ uz: 'Sana', en: 'Date' })) + '</th>' +
        '</tr></thead><tbody>' + keys.slice(0, 25).map(function (k) {
          var r = read[k];
          return '<tr><td data-l="' + esc(L({ uz: 'Matn', en: 'Passage' })) + '">' + esc(k) + '</td>' +
            '<td data-l="WPM">' + (r.wpm || '—') + '</td>' +
            '<td data-l="' + esc(L({ uz: 'Ball', en: 'Score' })) + '">' + (r.score != null ? r.score : '—') + '</td>' +
            '<td data-l="' + esc(L({ uz: 'Sana', en: 'Date' })) + '">' + (r.at ? new Date(r.at).toISOString().slice(0, 10) : '—') + '</td></tr>';
        }).join('') + '</tbody></table></div>'
        : sh().empty(L({ uz: 'Natija yöq', en: 'No results' }),
            L({ uz: 'Matn öqilib natija yozilganda şu yerda körinadi.', en: 'Results appear here once a passage is read and recorded.' }))) +
      '</section>';
  }

  /* ---------- 3. TINGLASH ----------------------------------------------- */
  function viewListening() {
    var st = window.Store;
    var done = st && st.bbcDoneCount ? st.bbcDoneCount() : 0;
    return '<div class="os-grid c3" style="margin-bottom:var(--sp-4)">' +
      tile('bbc/6min', { uz: 'BBC 6 Minute English', en: 'BBC 6 Minute English' }, { uz: 'Epizodlar va transkript', en: 'Episodes and transcript' }, 'headphones') +
      tile('books/listen', { uz: 'Kitob tinglaş', en: 'Book listening' }, { uz: 'Section maşqlari', en: 'Section exercises' }, 'headphones') +
      tile('books/dict/1/1', { uz: 'Diktant', en: 'Dictation' }, { uz: 'Yozib oliş maşqlari', en: 'Transcription exercises' }, 'pen') +
      '</div>' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Tinglaş yozuvi', en: 'Listening record' })) + '</h2>' +
        sh().chip(done + ' ' + L({ uz: 'epizod bajarildi', en: 'episodes done' }), done ? 'on' : 'off') + '</div>' +
        (done ? '' : '<p style="margin:0;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Hali epizod belgilanmagan.', en: 'No episode marked yet.' })) + '</p>') +
      '</section>';
  }

  /* ---------- 4. MEDIA -------------------------------------------------- */
  function viewMedia() {
    var st = window.Store;
    var movies = st && st.movieList ? st.movieList() : [];
    return '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Ingliz tili media', en: 'English media' })) + '</h2>' +
      sh().chip(L({ uz: 'ixtiyoriy', en: 'optional' }), 'off') + '</div>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
        esc(L({ uz: 'Kino va video — qöşimça manba. Fayllar şu qurilmada (IndexedDB) saqlanadi.',
                en: 'Films and video are a supplementary source. Files stay on this device (IndexedDB).' })) + '</p>' +
      (movies.length ? movies.slice(0, 20).map(function (m) {
        return '<button class="os-row" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line-soft);text-align:left;cursor:pointer;font:inherit;color:inherit" data-go="movies/' + esc(m.id) + '">' +
          '<span class="os-row-main"><b>' + esc(m.title || m.id) + '</b>' +
          '<span>' + (m.dur ? esc(String(m.dur)) + ' · ' : '') + esc(m.src || '') + '</span></span>' +
          (m.done ? sh().chip(L({ uz: 'körilgan', en: 'watched' }), 'on') : '') + '</button>';
      }).join('') : sh().empty(L({ uz: 'Media yöq', en: 'No media' }),
          L({ uz: 'Kino qöşilganda şu yerda körinadi.', en: 'Films appear here once added.' }))) +
      '<div style="margin-top:14px"><button class="os-btn ghost" data-go="classic/movies">' +
        esc(L({ uz: 'Media sahifasi', en: 'Media page' })) + '</button></div>' +
      '</section>';
  }

  /* ---------- 5. ESLATMALAR VA DAFTARLAR -------------------------------- */

  /* To'rtta daftar: lug'at · ingliz tili · coding · erkin.
     Eski #/copy/<kind> sahifalari o'z joyida ishlaydi — bu yerda ular
     ko'rinadi va haqiqiy yozuvlar soni bilan ochiladi.                  */
  var COPYBOOKS = [
    ['vocab',   'mic',      { uz: 'Luğat daftari', en: 'Vocabulary notebook' },
                            { uz: 'söz · transkripsiya · tarjima · misol', en: 'word · transcription · translation · example' }],
    ['english', 'pen',      { uz: 'Ingliz tili daftari', en: 'English notebook' },
                            { uz: 'grammatika · ibora · xato · fikr', en: 'grammar · phrase · mistake · note' }],
    ['coding',  'code',     { uz: 'Coding daftari', en: 'Coding notebook' },
                            { uz: 'sarlavha · til · kod · izoh', en: 'title · language · code · comment' }],
    ['free',    'notebook', { uz: 'Erkin daftar', en: 'Free notebook' },
                            { uz: 'bölinmagan katta varaq — nomini özing qöyasan', en: 'one large sheet — you name it yourself' }]
  ];

  function copybookCards() {
    var st = window.Store;
    return '<section class="os-card" style="margin-bottom:var(--sp-4)">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Daftarlar', en: 'Notebooks' })) + '</h2>' +
      '<button class="os-btn ghost" style="padding:4px 10px;font-size:12px" data-go="classic/notes">' +
        esc(L({ uz: 'Eski daftar sahifasi', en: 'Classic notebook page' })) + '</button></div>' +
      '<div class="os-grid c4">' + COPYBOOKS.map(function (c) {
        var n = st && st.copyList ? st.copyList(c[0]).length : 0;
        var route = c[0] === 'free' ? 'copy/free' : 'copy/' + c[0];
        return '<button class="os-card pad-sm" data-go="' + route + '">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px">' +
            '<span style="width:26px;height:26px;border-radius:var(--r-sm);background:var(--surface-3);display:grid;place-items:center">' +
            sh().icon(c[1]) + '</span>' +
            (n ? '<span class="os-chip">' + n + '</span>' : '') +
          '</div>' +
          '<b style="font-size:13.5px;display:block">' + esc(L(c[2])) + '</b>' +
          '<span style="font-size:11.5px;color:var(--muted)">' + esc(L(c[3])) + '</span>' +
          '</button>';
      }).join('') + '</div></section>';
  }

  function viewNotes() {
    var st = window.Store;
    var notes = st && st.notesList ? st.notesList() : [];
    var free = st && st.copyList ? st.copyList('free') : [];
    return copybookCards() +
      '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Dars eslatmalari', en: 'Lesson notes' })) + '</h2>' +
        sh().chip(notes.length) + '</div>' +
        (notes.length ? notes.slice(0, 12).map(function (n) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(L({ uz: 'Kun', en: 'Day' })) + ' ' + esc(n.day) + '</b>' +
            '<span>' + esc(String(n.text || '').slice(0, 90)) + '</span></span></div>';
        }).join('') : sh().empty(L({ uz: 'Eslatma yöq', en: 'No notes' }), '')) +
      '</section>' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Erkin daftar', en: 'Free notebook' })) + '</h2>' +
        sh().chip(free.length) + '</div>' +
        (free.length ? free.slice(0, 12).map(function (n) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(n.title || '') + '</b>' +
            '<span>' + (n.at ? new Date(n.at).toISOString().slice(0, 10) : '') + '</span></span></div>';
        }).join('') : sh().empty(L({ uz: 'Yozuv yöq', en: 'Nothing written' }),
            L({ uz: 'Boşqaruv markazidagi "tez yozib qöy" şu yerga tuşadi.', en: 'Quick capture from the Command Center lands here.' }))) +
        '<div style="margin-top:14px"><button class="os-btn ghost" data-go="copy/free">' +
          esc(L({ uz: 'Daftarni oçiş', en: 'Open the notebook' })) + '</button></div>' +
      '</section>' +
      '</div>';
  }

  /* ---------- 6. SAQLANGANLAR ------------------------------------------- */
  function viewSaved() {
    var st = window.Store;
    var bm = st && st.bookmarksList ? st.bookmarksList() : [];
    return '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Saqlanganlar', en: 'Bookmarks' })) + '</h2>' +
      sh().chip(bm.length) + '</div>' +
      (bm.length ? bm.slice(0, 40).map(function (b) {
        return '<button class="os-row" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line-soft);text-align:left;cursor:pointer;font:inherit;color:inherit" data-go="' + esc(b.route || '') + '">' +
          '<span class="os-row-main"><b>' + esc(b.title || b.id) + '</b>' +
          '<span>' + esc(b.kind || '') + '</span></span>' +
          '<time>' + (b.at ? new Date(b.at).toISOString().slice(0, 10) : '') + '</time></button>';
      }).join('') : sh().empty(L({ uz: 'Saqlangan yöq', en: 'Nothing saved' }),
          L({ uz: 'Sahifadagi saqlaş belgisi bilan qöşiladi.', en: 'Added with the bookmark icon on a page.' }))) +
      '</section>';
  }

  function render(tab) {
    tab = tab || 'books';
    var dest = OS.NAV.destOf('library');
    var body =
        tab === 'reading'   ? viewReading()
      : tab === 'listening' ? viewListening()
      : tab === 'media'     ? viewMedia()
      : tab === 'notes'     ? viewNotes()
      : tab === 'saved'     ? viewSaved()
      : viewBooks();
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('library', dest.tabs, tab) +
      body + '</div>';
  }

  OS.pages.library = { render: render };
})();
