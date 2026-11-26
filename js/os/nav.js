/* ==========================================================================
   OS.NAV — Personal OS axborot arxitekturasi (8 manzil)
   Personal OS information architecture (8 destinations)
   --------------------------------------------------------------------------
   Eski 16 ta yon menyu yozuvi 8 ta manzilga yig'ildi (brief 4 va 5-bo'lim).
   Eski marshrutlar O'CHIRILMAYDI: ular ishlashda davom etadi va kerak
   bo'lsa yangi manzilga yo'naltiriladi (LEGACY). Hech qaysi havola 404
   bermaydi — audit §10.5.

   Ikki xil moslik bor:
     REDIRECT — eski YUQORI darajadagi manzil yangisiga ko'chiriladi
                (#/dashboard → #/center). Hash almashadi.
     KEEP     — chuqur sahifa (dars, kitob, mission ichi) O'Z JOYIDA
                qoladi va eski kod uni chizadi; faqat tepasiga yangi
                studiyaga qaytish havolasi qo'shiladi.
   ========================================================================== */
(function () {
  'use strict';

  /* [kalit, marshrut, belgi, UZ, EN, bo'limlar] */
  var DEST = [
    {
      key: 'center', route: 'center', icon: 'home',
      t: { uz: 'Boshqaruv markazi', en: 'Command Center' },
      d: { uz: 'Bugun nima muhim', en: 'What matters today' },
      tabs: []
    },
    {
      key: 'planner', route: 'planner', icon: 'calendar',
      t: { uz: 'Missiya rejasi', en: 'Mission Planner' },
      d: { uz: 'Yagona kalendar va kunlik jadval', en: 'One calendar and daily schedule' },
      tabs: [
        ['today',     { uz: 'Bugun', en: 'Today' }],
        ['calendar',  { uz: 'Kalendar', en: 'Calendar' }],
        ['schedule',  { uz: 'Kunlik jadval', en: 'Daily schedule' }],
        ['week',      { uz: 'Hafta', en: 'Week' }],
        ['phases',    { uz: 'Bosqichlar', en: 'Phases' }],
        ['goals',     { uz: 'Maqsadlar', en: 'Goals' }],
        ['routines',  { uz: 'Odatlar', en: 'Routines' }],
        ['history',   { uz: 'Tarix', en: 'History' }]
      ]
    },
    {
      key: 'studio', route: 'studio', icon: 'book',
      t: { uz: 'Oʻquv studiyalari', en: 'Learning Studios' },
      d: { uz: 'IELTS va Coding — bitta joyda', en: 'IELTS and Coding in one place' },
      tabs: [
        ['ielts',  { uz: 'IELTS Studio', en: 'IELTS Studio' }],
        ['coding', { uz: 'Coding Studio', en: 'Coding Studio' }]
      ]
    },
    {
      key: 'lab', route: 'lab', icon: 'refresh',
      t: { uz: 'Takror laboratoriyasi', en: 'Review Lab' },
      d: { uz: 'Xatolar, kartalar, intervalli takror', en: 'Mistakes, cards, spaced repetition' },
      tabs: [
        ['due',       { uz: 'Navbat', en: 'Due' }],
        ['mistakes',  { uz: 'Xatolar daftari', en: 'Error Log' }],
        ['vocab',     { uz: 'Lugʻat', en: 'Vocabulary' }],
        ['grammar',   { uz: 'Grammatika', en: 'Grammar' }],
        ['cards',     { uz: 'Kartalar', en: 'Flashcards' }],
        ['sheets',    { uz: 'Cheatsheet', en: 'Cheatsheets' }],
        ['history',   { uz: 'Takror tarixi', en: 'Review history' }]
      ]
    },
    {
      key: 'library', route: 'library', icon: 'doc',
      t: { uz: 'Bilim kutubxonasi', en: 'Knowledge Library' },
      d: { uz: 'Kitob, matn, audio, eslatma', en: 'Books, texts, audio, notes' },
      tabs: [
        ['books',     { uz: 'Kitoblar', en: 'Books' }],
        ['reading',   { uz: 'Oʻqish', en: 'Reading' }],
        ['listening', { uz: 'Tinglash', en: 'Listening' }],
        ['media',     { uz: 'Media', en: 'Media' }],
        ['notes',     { uz: 'Daftar va eslatma', en: 'Notebooks & notes' }],
        ['saved',     { uz: 'Saqlanganlar', en: 'Bookmarks' }]
      ]
    },
    {
      key: 'insights', route: 'insights', icon: 'trend',
      t: { uz: 'Koʻrsatkichlar', en: 'Insights' },
      d: { uz: 'Haqiqiy oʻlchov, oʻylab topilgan ball emas', en: 'Real measurement, not invented scores' },
      tabs: []
    },
    {
      key: 'portfolio', route: 'portfolio', icon: 'rocket',
      t: { uz: 'Loyihalar va portfel', en: 'Projects & Portfolio' },
      d: { uz: 'Bajarilgan ish — dalil bilan', en: 'Work done, with evidence' },
      tabs: [
        ['projects',  { uz: 'Loyihalar', en: 'Projects' }],
        ['capstone',  { uz: 'Capstone', en: 'Capstone' }],
        ['evidence',  { uz: 'Dalillar', en: 'Evidence' }],
        ['career',    { uz: 'Karyera', en: 'Career' }]
      ]
    },
    {
      key: 'vault', route: 'vault', icon: 'lock',
      t: { uz: 'Sozlamalar va maʼlumot xazinasi', en: 'Settings & Data Vault' },
      d: { uz: 'Profil, zaxira, xavfsizlik', en: 'Profile, backup, security' },
      tabs: [
        ['profile',  { uz: 'Profil', en: 'Profile' }],
        ['look',     { uz: 'Koʻrinish', en: 'Appearance' }],
        ['mission',  { uz: 'Missiya', en: 'Mission' }],
        ['data',     { uz: 'Maʼlumot', en: 'Data' }],
        ['backup',   { uz: 'Zaxira', en: 'Backup' }],
        ['security', { uz: 'Xavfsizlik', en: 'Security' }]
      ]
    }
  ];

  /* ---- Eski manzil → yangi manzil (hash almashadi) ---------------------
     Faqat YUQORI darajadagi hublar. Chuqur sahifalar KEEP ro'yxatida.   */
  var REDIRECT = {
    'dashboard': 'center',

    'today':     'planner/today',
    'week':      'planner/week',
    'habit':     'planner/schedule',
    'roadmap':   'planner/phases',
    'goal':      'planner/goals',
    'plan':      'planner/phases',
    'dua':       'planner/routines',

    'course':    'studio',
    'english':   'studio/ielts',
    'speaking':  'studio/ielts/speaking',
    'writing':   'studio/ielts/writing',
    'python':    'studio/coding/python',
    'datacamp':  'studio/coding/datacamp',
    'jobready':  'studio/coding/jobready',
    'placement': 'studio/coding/placement',
    'quick':     'studio/ielts/quick',

    'practice':  'lab/due',
    'review':    'lab/due',
    'mistakes':  'lab/mistakes',
    'flash':     'lab/cards',
    'etch':      'lab/cards',
    'cheatsheet': 'lab/sheets',
    'eng-grammar': 'lab/grammar',
    'eng-vocab':   'lab/vocab',

    'books':     'library/books',
    'movies':    'library/media',
    'notes':     'library/notes',
    'saved':     'library/saved',

    'analytics': 'insights',
    'weekly':    'insights/7',
    'monthly':   'insights/30',

    'projects':  'portfolio/projects',
    'career':    'portfolio/career',

    'settings':  'vault',
    'profile':   'vault/profile'
  };

  /* ---- O'z joyida qoladigan chuqur marshrutlar (eski kod chizadi) -----
     Regexp — birinchi segment bo'yicha. Bular yo'naltirilmaydi, chunki
     ularning ichida haqiqiy dars/mashq bor.                             */
  var KEEP = [
    /^lesson\//, /^english\//, /^eng-skill\//, /^writing\//, /^bbc(\/|$)/,
    /^quick\//, /^datacamp\//, /^habit\//, /^week\//, /^dua\//,
    /^books\//, /^copy(\/|$)/, /^movies\//, /^practice\//, /^review\//,
    /^notes\//, /^flash\//, /^roadmap\//, /^cheatsheet\//,
    /^mission(\/|$)/, /^pyai(\/|$)/, /^comm(\/|$)/, /^chat(\/|$)/,
    /^assignments(\/|$)/, /^notifications(\/|$)/
  ];

  /* Chuqur sahifa qaysi studiyaga tegishli — tepadagi "qaytish" havolasi */
  /* Chuqur yoki `classic/` sahifa tepasidagi qaytish havolasi.
     Naqsh bare nom ham, ichki yo'l ham mos kelsin: `english` va
     `english/12` ikkalasi ham IELTS Studio ga qaytaradi.            */
  var CRUMB = [
    [/^(english|eng-skill|writing|bbc|quick|speaking|placement)(\/|$)/, 'studio/ielts', { uz: 'IELTS Studio', en: 'IELTS Studio' }],
    [/^mission(\/|$)/,                                        'studio/ielts',  { uz: 'IELTS Studio', en: 'IELTS Studio' }],
    [/^(lesson|python|datacamp|pyai|jobready|course)(\/|$)/,   'studio/coding', { uz: 'Coding Studio', en: 'Coding Studio' }],
    [/^(books|copy)(\/|$)/,                                   'library/books', { uz: 'Kutubxona', en: 'Library' }],
    [/^movies(\/|$)/,                                         'library/media', { uz: 'Kutubxona', en: 'Library' }],
    [/^(notes|saved)(\/|$)/,                                  'library/notes', { uz: 'Kutubxona', en: 'Library' }],
    [/^(review|practice|flash|etch|cheatsheet|mistakes|eng-grammar|eng-vocab)(\/|$)/, 'lab/due', { uz: 'Takror laboratoriyasi', en: 'Review Lab' }],
    [/^(habit|week|dua|roadmap|goal|plan|today)(\/|$)/,        'planner/today', { uz: 'Missiya rejasi', en: 'Mission Planner' }],
    [/^(projects|career)(\/|$)/,                              'portfolio/projects', { uz: 'Loyihalar', en: 'Projects' }],
    [/^(profile|settings)(\/|$)/,                             'vault',         { uz: 'Sozlamalar', en: 'Settings' }],
    [/^(analytics|weekly|monthly)(\/|$)/,                     'insights',      { uz: 'Koʻrsatkichlar', en: 'Insights' }]
  ];

  /* Yangi manzil marshrutlari (App ularni taniydi) */
  var ROUTE_KEYS = DEST.map(function (d) { return d.route; });

  function destOf(route) {
    var head = String(route || '').split('/')[0];
    for (var i = 0; i < DEST.length; i++) if (DEST[i].route === head) return DEST[i];
    return null;
  }

  /* Eski marshrut uchun yangi manzil (bo'lmasa null) */
  function redirectFor(route) {
    route = String(route || '').replace(/^#\/?/, '');
    if (!route) return null;
    for (var i = 0; i < KEEP.length; i++) if (KEEP[i].test(route)) return null;
    return REDIRECT[route] || null;
  }

  function crumbFor(route) {
    route = String(route || '');
    for (var i = 0; i < CRUMB.length; i++) {
      if (CRUMB[i][0].test(route)) return { route: CRUMB[i][1], t: CRUMB[i][2] };
    }
    return null;
  }

  /* Yon menyu uchun: faol manzil kaliti */
  function activeKey(route) {
    route = String(route || '');
    var d = destOf(route);
    if (d) return d.key;
    var c = crumbFor(route);
    if (c) return String(c.route).split('/')[0];
    return 'center';
  }

  window.OS = window.OS || {};
  window.OS.NAV = {
    DEST: DEST, REDIRECT: REDIRECT, KEEP: KEEP, CRUMB: CRUMB, ROUTE_KEYS: ROUTE_KEYS,
    destOf: destOf, redirectFor: redirectFor, crumbFor: crumbFor, activeKey: activeKey
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.OS.NAV;
  }
})();
