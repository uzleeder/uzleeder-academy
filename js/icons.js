/* ==========================================================================
   Ikonlar — inline SVG to'plami
   --------------------------------------------------------------------------
   Nega inline? Tashqi ikon kutubxonasi yuklanmaguncha sahifa "yalang'och"
   ko'rinadi va file:// rejimida umuman ishlamasligi mumkin. Inline SVG
   darhol chiziladi va currentColor orqali mavzuga moslashadi.

   Ishlatish:  IC.rocket           -> to'liq <svg> matni
               IC.rocket           CSS orqali o'lchanadi (svg{width:...})
   ========================================================================== */
(function () {
  'use strict';

  // Barcha ikonlar bir xil qolipda: 24x24 viewBox, chiziqli (stroke) uslub.
  /* Har ikonka `ic` klassini oladi: CSS'da standart o'lcham 1.1em. Shunda
     o'lchami yozilmagan joyda ikonka ekranni to'ldirib yubormaydi (ilgari
     <h1> ichida shunday bo'lgan). Konteyner qoidasi (.x svg {width:…})
     bu standartdan ustun turadi.                                         */
  function line(path, extra) {
    return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + path + '</svg>';
  }
  function solid(path) {
    return '<svg class="ic" viewBox="0 0 24 24" fill="currentColor">' + path + '</svg>';
  }

  window.IC = {
    /* --- mavzu / tizim --- */
    sun:      line('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon:     line('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'),
    menu:     line('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    close:    line('<path d="M18 6L6 18M6 6l12 12"/>'),
    settings: line('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    search:   line('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    user:     line('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>'),

    /* --- navigatsiya --- */
    home:     line('<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>'),
    book:     line('<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M18 3v18"/>'),
    map:      line('<path d="M9 6l-6 3v11l6-3 6 3 6-3V6l-6 3-6-3z"/><path d="M9 6v11M15 9v11"/>'),
    checklist:line('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
    grid:     line('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    star:     solid('<path d="M12 2l2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7-5-4.6 6.8-.7z"/>'),
    notebook: line('<path d="M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7z"/><path d="M5 7h2M5 12h2M5 17h2"/><path d="M11 8h5M11 12h5"/>'),
    alert:    line('<path d="M12 3l9.5 16.5H2.5z"/><path d="M12 9.5v4.5M12 17.2v.1"/>'),

    /* --- holat / harakat --- */
    check:    line('<path d="M4 12l6 6L20 5"/>', ' stroke-width="3"'),
    lock:     line('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    play:     solid('<path d="M7 4.5v15l13-7.5z"/>'),
    copy:     line('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
    download: line('<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>'),
    trash:    line('<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>'),
    refresh:  line('<path d="M20 11a8 8 0 1 0-1.5 5.5"/><path d="M20 5v6h-6"/>'),
    cloud:    line('<path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9H7z"/>'),
    arrowR:   line('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    chevron:  line('<path d="M6 9l6 6 6-6"/>'),
    upload:   line('<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>'),
    image:    line('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>'),
    plus:     line('<path d="M12 5v14M5 12h14"/>'),
    bookmark: line('<path d="M6 3h12v18l-6-4-6 4z"/>'),
    eye:      line('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    today:    line('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="1.6" fill="currentColor" stroke="none"/>'),
    building: line('<path d="M6 21V5l6-2 6 2v16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1M3 21h18"/>'),
    arrowL:   line('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
    external: line('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),

    /* --- mazmun --- */
    spark:    solid('<path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>'),
    rocket:   line('<path d="M5 13c0-4 3-9 7-11 4 2 7 7 7 11l-3 3H8l-3-3z"/><circle cx="12" cy="9" r="1.5"/><path d="M8 16l-2 4M16 16l2 4"/>'),
    flame:    line('<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 2.5 1.5 0 1-4 1-7z"/>'),
    bulb:     line('<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 1 3.5 10.9c-.3.3-.5.7-.5 1.1v1h-6v-1c0-.4-.2-.8-.5-1.1A6 6 0 0 1 12 3z"/>'),
    target:   line('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>'),
    trend:    line('<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>'),
    medal:    line('<circle cx="12" cy="15" r="6"/><path d="M12 12v6M9.5 14.5l2.5 1.5 2.5-1.5"/><path d="M8 3l2 6M16 3l-2 6"/>'),
    globe:    line('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>'),
    pen:      line('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    doc:      line('<path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M9 13h6M9 17h6"/>'),
    layers:   line('<path d="M12 2l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/>'),
    calendar: line('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    clock:    line('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    code:     line('<path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/>'),
    film:     line('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>'),
    stone:    line('<path d="M6 20h12l2-6-3-9H7L4 14z"/><path d="M9 10h6M9 14h6"/>'),
    cards:    line('<rect x="3" y="6" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/>'),

    /* --- ingliz tili kursi --- */
    brain:    line('<path d="M12 4.5a3 3 0 0 0-5.6-1.4A2.8 2.8 0 0 0 4 7.7a3 3 0 0 0-.4 4.8A3 3 0 0 0 5 18a3 3 0 0 0 4.4 2.5A2.6 2.6 0 0 0 12 19z"/><path d="M12 4.5a3 3 0 0 1 5.6-1.4A2.8 2.8 0 0 1 20 7.7a3 3 0 0 1 .4 4.8A3 3 0 0 1 19 18a3 3 0 0 1-4.4 2.5A2.6 2.6 0 0 1 12 19z"/><path d="M12 4.5V19"/>'),
    headphones: line('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 15a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2z"/><path d="M20 15a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z"/>'),
    mic:      line('<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3M9 21h6"/>'),

    /* --- kunlik intizom / namoz --- */
    mosque:   line('<path d="M12 2c2 2 3 3.5 3 5a3 3 0 0 1-6 0c0-1.5 1-3 3-5z"/><path d="M4 21V12a8 8 0 0 1 16 0v9"/><path d="M2 21h20"/><path d="M9 21v-4a3 3 0 0 1 6 0v4"/>'),
    sunrise:  line('<path d="M12 3v5M5.6 9.6l1.4 1.4M2 17h2M20 17h2M17 11l1.4-1.4"/><path d="M8 17a4 4 0 0 1 8 0"/><path d="M2 21h20"/>'),
    film:     line('<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M7 5v14M17 5v14"/><path d="M2.5 12h19"/><path d="M2.5 8.5h4.5M2.5 15.5h4.5M17 8.5h4.5M17 15.5h4.5"/>')
  };
})();
