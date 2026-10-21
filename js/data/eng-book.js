/* ==========================================================================
   ENG_BOOK — kitoblar moduli: xarita va kunlik taqsimot
   --------------------------------------------------------------------------
   Uchta manba kitob:
     1. 4000 Essential English Words, Book 4 — 30 unit × 20 so'z = 600 so'z
     2. Reading Explorer 3 (3rd ed.) — 12 mavzu × 2 matn = 24 matn
     3. IELTS Listening amaliyot kitobi

   MUHIM — nima ko'chirilgan, nima yo'q:
     Kitoblarning MATNI bu yerda YO'Q va bo'lmaydi ham: ikkalasi ham
     mualliflik huquqi bilan himoyalangan (4000 EEW: "All rights reserved.
     No part of this book may be reproduced…").

     Bu modulda:
       • so'z RO'YXATI  — fakt, ko'chirilgan
       • sinonim, misol — shu platforma uchun qaytadan yozilgan
       • reading matnlari — kitobning matni EMAS, o'sha mavzularda
         maxsus yozilgan IELTS darajasidagi matnlar
       • savollar — IELTS formatida, shu platforma uchun tuzilgan

     Ya'ni kitoblar SIZDA qoladi va siz ulardan o'qiysiz; platforma esa
     ularning yonida IELTS formatidagi mashqni beradi. Reading Explorer'ning
     o'z savollari IELTS formatida emas — shuning uchun bu takrorlash emas,
     to'ldirish.

   Kunlik taqsimot (foydalanuvchi so'ragan tartib):
     har kuni  1 ta reading matni + IELTS savollari
     har kuni  1 ta listening bo'limi (10 savol — IELTS section qolipi)
     lug'at:   1–15-kun C-book (kuniga 40 so'z, daftar), 16-kundan Essential 4 (2 unit)
   ========================================================================== */
window.ENG_BOOK = {

  meta: {
    title: { uz: 'Kitoblar moduli', en: 'Books module' },
    lede: {
      uz: "Uch manba kitob asosidagi kunlik mashq: 1 ta o'qish matni + IELTS savollari, 1 ta tinglash bo'limi (10 savol), 1 ta lug'at uniti (20 so'z).",
      en: 'Daily practice built on three source books: one reading passage with IELTS questions, one listening section (10 questions), and one vocabulary unit (20 words).'
    },
    copyright: {
      uz: "Kitoblarning matni bu yerda ko'chirilmagan — ular mualliflik huquqi bilan himoyalangan. Platformada so'z ro'yxati (fakt), qaytadan yozilgan sinonimlar va shu mavzularda maxsus yozilgan IELTS matnlari bor. Kitoblardan o'zingiz o'qiysiz, platforma esa ularning yonida IELTS formatidagi mashqni beradi.",
      en: 'The books\' text is not reproduced here — both are copyrighted. The platform holds the word list (a fact), rewritten synonyms, and IELTS-level passages written specially on the same themes. You read from your own copies; the platform supplies the IELTS-format practice alongside.'
    },
    vocabRule: {
      uz: "Lug'atda FAQAT sinonim beriladi, o'zbekcha tarjima yo'q. Sabab: tarjima orqali o'rganilgan so'z ikki bosqichda eslanadi (inglizcha → o'zbekcha → ma'no) va gapirishda sekinlashtiradi. Sinonim orqali o'rganilgan so'z to'g'ridan-to'g'ri inglizcha tarmoqqa ulanadi — bu IELTS paraphrase uchun ham aynan kerak narsa.",
      en: 'The vocabulary gives ONLY synonyms, no Uzbek translation. A word learned through translation is recalled in two steps (English → Uzbek → meaning), which slows speech. A word learned through synonyms connects straight into the English network — which is exactly what IELTS paraphrasing needs.'
    }
  },

  /* ====================== MANBA KITOBLAR ============================== */
  sources: [
    {
      key: 'vocab',
      title: '4000 Essential English Words, Book 4',
      author: 'Paul Nation',
      publisher: 'Compass Publishing',
      units: 30, perUnit: 20, total: 600,
      role: { uz: "Lug'at — kuniga 1 unit (20 so'z)", en: 'Vocabulary — one unit (20 words) a day' },
      icon: 'book'
    },
    {
      key: 'reading',
      title: 'Reading Explorer 3 (Third Edition)',
      author: 'Nancy Douglas, David Bohlke',
      publisher: 'National Geographic Learning',
      units: 12, perUnit: 2, total: 24,
      role: { uz: "O'qish — har mavzuga 2 matn, ustiga IELTS savollari", en: 'Reading — two passages per theme, with IELTS questions on top' },
      icon: 'doc'
    },
    {
      key: 'listening',
      title: 'IELTS Listening practice',
      role: { uz: 'Tinglash — kuniga 1 bo\'lim, 10 savol', en: 'Listening — one section a day, 10 questions' },
      icon: 'headphones'
    },
    /* 2026-09-20 dan ASOSIY lug'at kitobi — Destination B2 (ENG_DEST_B2).
       Essential 4 saqlanadi: ixtiyoriy qo'shimcha, #/books/ess4.          */
    {
      key: 'dest',
      title: 'Destination B2 — Grammar & Vocabulary',
      author: 'Malcolm Mann, Steve Taylore-Knowles',
      publisher: 'Macmillan',
      units: 14, perUnit: 5, total: 2570,
      role: { uz: "Lug'at — kuniga 1 bo'lim (unit 5 kunda), tarjima bilan", en: 'Vocabulary — one section a day (a unit in 5 days), with translation' },
      icon: 'book'
    },
    /* Tinglash kitobi 2 — Target Listening with Dictation (ENG_DICT).
       1-kitob (7 unit × 20 mashq) 2026-09-19 da tugallangan.               */
    {
      key: 'dict',
      title: 'Target Listening with Dictation — Practice Tests Book 1',
      units: 12, perUnit: 45, total: 540,
      role: { uz: 'Tinglash — kuniga 6 diktant + 15 test savoli', en: 'Listening — 6 dictations + 15 test questions a day' },
      icon: 'headphones'
    }
  ],

  /* ====================== READING EXPLORER 3 — 12 MAVZU ===============
     Har mavzuda A va B matni. Kitobdagi sahifalar ham berilgan, shunda
     platformadagi kun to'g'ridan-to'g'ri kitobning kerakli joyiga
     yo'naltiradi.                                                        */
  readingUnits: [
    { n: 1,  page: 7,   theme: { uz: 'Sport va jismoniy tayyorgarlik', en: 'Sports and Fitness' },
      a: 'The World\'s Game', b: 'What Makes an Olympic Champion?' },
    { n: 2,  page: 23,  theme: { uz: "Teri va go'zallik", en: 'Skin Deep' },
      a: 'What Is Beauty?', b: 'Skin: The Body\'s Canvas' },
    { n: 3,  page: 39,  theme: { uz: 'Xavf ostidagi hayvonlar', en: 'Animals in Danger' },
      a: 'Racing to Rescue Koalas', b: 'Tracking the Snow Leopard' },
    { n: 4,  page: 57,  theme: { uz: "Zilzila va vulqonlar", en: 'Violent Earth' },
      a: 'Sacred Summits', b: 'Is Prediction Possible?' },
    { n: 5,  page: 73,  theme: { uz: 'Orollar va sohillar', en: 'Islands and Beaches' },
      a: 'Land of Fire and Ice', b: 'The Perfect Beach' },
    { n: 6,  page: 89,  theme: { uz: 'Global odatlar', en: 'Global Addictions' },
      a: 'The World\'s Favorite Drug', b: 'Addicted to Distraction' },
    { n: 7,  page: 105, theme: { uz: 'Energiya yechimlari', en: 'Energy Solutions' },
      a: 'Powering the Planet', b: 'City of the Future?' },
    { n: 8,  page: 121, theme: { uz: 'Ulkan muhandislik', en: 'Epic Engineering' },
      a: 'China\'s Grand Canal', b: 'Highway of Dreams' },
    { n: 9,  page: 137, theme: { uz: 'Yuqori texnologiya', en: 'High-Tech Solutions' },
      a: 'The Power of Virtual Reality', b: 'High-Flying Helpers' },
    { n: 10, page: 153, theme: { uz: 'Ong va tafakkur', en: 'All in the Mind' },
      a: 'What\'s on Your Mind?', b: 'Inside Animal Minds' },
    { n: 11, page: 169, theme: { uz: 'Tasviriy san\'at kashshoflari', en: 'Visual Pioneers' },
      a: 'Van Gogh\'s World', b: 'Seeing the Light' },
    { n: 12, page: 187, theme: { uz: 'Koinot', en: 'Far Out' },
      a: 'Defying Gravity', b: 'The Ultimate Trip' }
  ],

  /* ====================== IELTS SAVOL TURLARI ========================= */
  qTypes: {
    tfng:       { uz: 'True / False / Not Given',  en: 'True / False / Not Given' },
    ynng:       { uz: 'Yes / No / Not Given',      en: 'Yes / No / Not Given' },
    mcq:        { uz: 'Ko\'p variantli',           en: 'Multiple choice' },
    headings:   { uz: 'Sarlavha moslashtirish',    en: 'Matching headings' },
    completion: { uz: 'Gap to\'ldirish',           en: 'Sentence completion' },
    summary:    { uz: 'Xulosa to\'ldirish',        en: 'Summary completion' },
    matching:   { uz: 'Ma\'lumot moslashtirish',   en: 'Matching information' },
    short:      { uz: 'Qisqa javob',               en: 'Short answer' },
    form:       { uz: 'Forma to\'ldirish',         en: 'Form completion' },
    map:        { uz: 'Xarita / sxema',            en: 'Map / plan labelling' },
    table:      { uz: 'Jadval to\'ldirish',        en: 'Table completion' }
  },

  /* LUG'AT REJASI — ikki bosqich (kalendar kuni bo'yicha, 1-kun = 20-sen):
       1–15-kun   C-BOOK: kuniga 40 yangi so'z — foydalanuvchi o'zi daftarga
                  yozadi (so'z turi, tarjima, sinonim, misol, talaffuz).
                  15 × 40 = 600 so'z. Platforma sanaydi: bugun nechta yozildi.
       16-kundan  4000 ESSENTIAL WORDS 4: kuniga 2 unit (40 so'z), 15 kunda
                  30 unit; 31-kundan (kalendar 46) takror sikli — har unit
                  15 kunda bir qaytadi. Bir marta ko'rilgan so'z yodda
                  qolmaydi — takrorlangani qoladi.                          */
  cycle: {
    cbookDays: 15,
    cbookPerDay: 40,
    vocabUnits: 30,
    readingSets: 24,
    listeningSets: 24,
    cbookNote: {
      uz: "Birinchi 15 kun (20-sen → 4-okt): C-book. Kuniga 40 yangi so'z — o'zing daftarga yozasan: so'z turi (noun/verb/adj/adv), tarjima, sinonim, misol, talaffuz yozuvi. Kechqurun 5 soniya testi. 15 kunda 600 so'z.",
      en: 'First 15 days (20 Sep → 4 Oct): the C-book. Forty new words a day — you write them into the copybook yourself: part of speech (noun/verb/adj/adv), translation, synonym, example, pronunciation recording. The 5-second test in the evening. 600 words in 15 days.'
    },
    reviewNote: {
      uz: "16-kundan (5-okt): 4000 Essential Words 4 — kuniga 2 unit (40 so'z). 15 kunda 30 unit tugaydi, keyin takror sikli: har unit 15 kunda bir qaytadi. Bir marta ko'rilgan so'z yodda qolmaydi — takrorlangani qoladi.",
      en: 'From day 16 (5 Oct): 4000 Essential Words 4 — two units a day (40 words). Thirty units finish in 15 days, then the review cycle: every unit returns every 15 days. A word seen once is not retained; a word revisited is.'
    }
  },

  /* ====================== LUG'AT — DESTINATION B2 (2026-09-20 dan) =====
     Eski ikki bosqich (C-book 15 kun → Essential 4) BEKOR: 1-kundan
     Destination B2, kuniga bir bo'lim. Unit = 5 bo'lim = 5 kun; 14 unit =
     70 kun; 71-kundan 2-aylanish (tarjima yopiq — o'zini tekshirish).
     C-book (daftar) endi kvota emas: o'qishda belgilangan yangi so'zlar
     va bo'limdan tanlab qo'shilgan so'zlar tushadi.                        */
  vocabBook: 'dest',
  /* Bosqich: 'dest' (1+) · '' (boshlanmagan). 'cbook' endi hech qachon. */
  vocabPhase: function (day) { return day < 1 ? '' : 'dest'; },
  /* Kun → { unit, sec, secIdx, pass, unitIdx, items } — Destination B2 bo'limi */
  destFor: function (day) {
    var D = window.ENG_DEST_B2;
    if (!D || day < 1) return null;
    var per = D.meta.daysPerUnit || 5, n = D.units.length, total = n * per;
    var i = (day - 1) % total, pass = Math.floor((day - 1) / total) + 1;
    var u = D.units[Math.floor(i / per)], sec = D.meta.secs[i % per];
    return { unit: u.n, theme: u.theme, sec: sec.k, secName: sec.name, secIdx: i % per, pass: pass, unitIdx: Math.floor(i / per), day: day,
      items: (u.secs.filter(function (x) { return x.k === sec.k; })[0] || { items: [] }).items };
  },
  /* Unit indeksi + bo'lim indeksi → kalendar kuni (1-aylanish) */
  destDayOf: function (unitIdx, secIdx) { var D = window.ENG_DEST_B2; return unitIdx * ((D && D.meta.daysPerUnit) || 5) + secIdx + 1; },
  /* Kitob kuni: Essential 4 ning nechanchi kuni (1 = kalendar 16-kun) */
  bookDay: function (day) { return Math.max(0, day - ENG_BOOK.cycle.cbookDays); },

  /* Kuniga IKKI unit — faqat kitob bosqichida: 16-kun 1–2, 17-kun 3–4 …
     30-kun 29–30. Keyin takror sikli: yana 1–2 dan. C-book kunlarida [] . */
  vocabUnitsFor: function (day) {
    var bd = ENG_BOOK.bookDay(day);
    if (bd < 1) return [];
    var i = (bd - 1) % 15;
    return [i * 2 + 1, i * 2 + 2];
  },
  /* Eski chaqiruvlar uchun: kunning birinchi uniti */
  vocabUnitFor: function (day) {
    var u = ENG_BOOK.vocabUnitsFor(day);
    return u.length ? u[0] : 0;
  },
  vocabPassOf: function (day) { var bd = ENG_BOOK.bookDay(day); return bd < 1 ? 0 : Math.floor((bd - 1) / 15) + 1; },

  /* n-kunga qaysi Reading Explorer matni to'g'ri keladi.
     24 matn: 1A, 1B, 2A, 2B … 12B. Keyin qaytadan (chuqurroq o'qish). */
  readingRefFor: function (day) {
    if (day < 1) return null;
    var i = (day - 1) % 24;
    var unit = Math.floor(i / 2) + 1;
    var part = (i % 2 === 0) ? 'A' : 'B';
    var u = null;
    ENG_BOOK.readingUnits.forEach(function (x) { if (x.n === unit) u = x; });
    if (!u) return null;
    return { unit: unit, part: part, page: u.page, theme: u.theme, title: part === 'A' ? u.a : u.b, pass: Math.floor((day - 1) / 24) + 1 };
  },

  /* Kun → platformadagi matn raqami (1–24). readingRefFor bilan bir xil
     sikl: 25-kun yana 1-matnga qaytadi, lekin bu safar savollarni eslab
     emas, tezlik uchun ishlaydi (`pass` 2). Shuning uchun 24 ta matn
     144 kunning hammasini yopadi.                                       */
  readingNoFor: function (day) {
    if (day < 1) return 0;
    return ((day - 1) % 24) + 1;
  },

  /* Kun → tinglash bo'limi (1–24 = to'liq 6 ta IELTS testi, har birida
     Section 1–4). Sikl reading bilan bir xil uzunlikda.                 */
  listeningNoFor: function (day) {
    if (day < 1) return 0;
    return ((day - 1) % 24) + 1;
  },

  /* Nechanchi aylanish — 1-marta yangi, 2-marta tezlik, 3-marta nazorat */
  passOf: function (day) { return Math.floor((day - 1) / 24) + 1; }
};
