/* ==========================================================================
   DUAL — Python va ingliz tilini PARALLEL olib borish rejasi
   --------------------------------------------------------------------------
   Ikki kurs bir vaqtda yuradi:
     Python  — 30 kun, haftasiga 3 kun (Du / Ch / Ju) → ~10 hafta
     Ingliz  — 108 kun, har kuni → 16 hafta

   Nega Python dushanba/chorshanba/jumaga qo'yildi: seshanba, payshanba va
   shanbada Everest LC darsi bor (16:30–18:30). Python ham o'sha kunlarga
   qo'shilsa, kun 8 soatdan oshib ketardi va 8 soatlik uyquga joy qolmasdi.
   Endi ular ajratilgan: Python — LC yo'q kunlarda, ertalabki bo'sh joyda.

   Yakshanba — ingliz tili test kuni. Python o'sha kuni umuman yo'q: haftada
   bir kun kod yozmaslik ham rejaning bir qismi.

   Muhim: bu jadval TAKLIF, qonun emas. Agar Python tezroq ketsa, uni
   tugatib, o'rniga DataCamp rejasining 1-bosqichiga o'tish mumkin —
   ingliz tili jadvali o'zgarmaydi.
   ========================================================================== */
window.DUAL = {

  intro: {
    uz: "Ikki kurs HAR KUNI birga: ingliz tili kuniga 4 soat (yakşanba ham), coding oğir kunlarda 4 soat, LC kunlarida 2 soat. Python 30 dars — 25-oktabrdan 23-noyabrgaça, har kuni bitta, muddat qatʼiy. Keyin öşa soatlar DataCamp'ga ötadi. 8 soat uyqu himoyalangan.",
    en: 'Both courses every day: English four hours a day (Sunday too), coding four hours on heavy days and two on LC days. Python — 30 lessons from 25 October to 23 November, one a day, hard deadline. Then those hours go to DataCamp. Eight hours of sleep protected.'
  },

  warning: {
    uz: "Halol ogohlantiriş: bu kuniga 6–8 soat öquv. Uddalay olmagan kun 'qarz kuni' böladi va maqsad sanalarini suradi — Maqsad sahifasida körinadi. Uyquni heç qaçon qisqartirma: u jadvalning asosi.",
    en: 'An honest warning: this is six to eight hours of study a day. A day not done becomes a debt day and shifts the goal dates — visible on the Goal page. Never cut the sleep: it is the foundation.'
  },

  /* Haftalik jadval: har kun uchun ikkala kursning yuki (daqiqa — me'yor) */
  week: [
    { day: { uz: 'Duşanba', en: 'Monday' }, dow: 1,
      eng: { uz: 'Ingliz tili — 6 könikma', en: 'English — six skills' }, engMin: 240,
      py: { uz: 'Coding 4 soat — Python darsi + maşq + DataCamp', en: 'Coding 4h — Python lesson + exercises + DataCamp' }, pyMin: 240,
      note: { uz: "Python 08:00 (2s), maşq 10:15, DataCamp 16:05. Kino 45 daq, YouTube juft kunlarda.", en: 'Python 08:00 (2h), exercises 10:15, DataCamp 16:05. Film 45 min, YouTube on even days.' } },
    { day: { uz: 'Seşanba', en: 'Tuesday' }, dow: 2,
      eng: { uz: 'Ingliz tili + Everest LC', en: 'English + Everest LC' }, engMin: 240,
      py: { uz: 'Coding 2 soat — Python darsi + maşq', en: 'Coding 2h — Python lesson + exercises' }, pyMin: 120,
      note: { uz: "Python 07:30 (1.5s) + maşq 30 daq. LC 16:30–18:30.", en: 'Python 07:30 (1.5h) + 30 min exercises. LC 16:30–18:30.' } },
    { day: { uz: 'Çorşanba', en: 'Wednesday' }, dow: 3,
      eng: { uz: 'Ingliz tili — 6 könikma', en: 'English — six skills' }, engMin: 240,
      py: { uz: 'Coding 4 soat', en: 'Coding 4h' }, pyMin: 240,
      note: { uz: 'Duşanba bilan bir xil.', en: 'Same as Monday.' } },
    { day: { uz: 'Payşanba', en: 'Thursday' }, dow: 4,
      eng: { uz: 'Ingliz tili + Everest LC', en: 'English + Everest LC' }, engMin: 240,
      py: { uz: 'Coding 2 soat', en: 'Coding 2h' }, pyMin: 120,
      note: { uz: 'LC 16:30–18:30. Keçqurun LC takrori.', en: 'LC 16:30–18:30. Review the class in the evening.' } },
    { day: { uz: 'Juma', en: 'Friday' }, dow: 5,
      eng: { uz: 'Ingliz tili — 6 könikma', en: 'English — six skills' }, engMin: 240,
      py: { uz: 'Coding 4 soat', en: 'Coding 4h' }, pyMin: 240,
      note: { uz: "Haftaning oxirgi oğir kuni — loyihaga vaqt ajrat.", en: 'The last heavy day of the week — give the project some time.' } },
    { day: { uz: 'Şanba', en: 'Saturday' }, dow: 6,
      eng: { uz: 'Ingliz tili + Everest LC', en: 'English + Everest LC' }, engMin: 240,
      py: { uz: 'Coding 2 soat', en: 'Coding 2h' }, pyMin: 120,
      note: { uz: 'LC 16:30–18:30.', en: 'LC 16:30–18:30.' } },
    { day: { uz: 'Yakşanba', en: 'Sunday' }, dow: 0,
      eng: { uz: 'TEST kuni + takror', en: 'TEST day + review' }, engMin: 240,
      py: { uz: 'Python oyida 1 soat dars; keyin dam', en: '1h Python lesson in Python month; then rest' }, pyMin: 60,
      note: { uz: "Töliq testlar + xato tahlili + haftalik speaking ölçovi. Film keçasi.", en: 'Full tests + error analysis + the weekly speaking measurement. Film night.' } }
  ],

  /* Ikki kursning umumiy vaqt o'qi */
  timeline: [
    { from: 1, to: 5,
      title: { uz: '1–5-hafta · Python oyi', en: 'Weeks 1–5 · Python month' },
      py: { uz: 'Python 30 kunlik kurs — HAR KUNI, 25-okt → 23-noy', en: 'The 30-day Python course — EVERY day, 25 Oct → 23 Nov' },
      eng: { uz: 'Ingliz tili: poydevor → B2+', en: 'English: foundation → B2+' },
      note: { uz: "30 dars 30 kunga: yakşanba ham. 23-noyabr — qatʼiy muddat. Parallel: DataCamp 1-bosqiç (kuniga 1 soat, oğir kunlarda).",
              en: '30 lessons in 30 days, Sundays included. 23 November is a hard deadline. In parallel: DataCamp phase 1 (1h a day on heavy days).' } },
    { from: 6, to: 12,
      title: { uz: '6–12-hafta · DataCamp', en: 'Weeks 6–12 · DataCamp' },
      py: { uz: 'DataCamp 1–3-bosqiç: Python qölda → pandas/OOP → AI nazariyasi', en: 'DataCamp phases 1–3: Python by hand → pandas/OOP → AI theory' },
      eng: { uz: 'Ingliz tili: 7.0 → 7.5', en: 'English: 7.0 → 7.5' },
      note: { uz: "Coding soatlari özgarmaydi (4/2). Muddatlar: 1-bosqiç 15-noy, 2-bosqiç 30-noy, 3-bosqiç 7-dek.",
              en: 'Coding hours unchanged (4/2). Deadlines: phase 1 by 15 Nov, phase 2 by 30 Nov, phase 3 by 7 Dec.' } },
    { from: 13, to: 18,
      title: { uz: '13–18-hafta · AI muhandisligi', en: 'Weeks 13–18 · AI engineering' },
      py: { uz: 'DataCamp 4-bosqiç: OpenAI API, LangChain, agentlar — 20-yan', en: 'DataCamp phase 4: OpenAI API, LangChain, agents — by 20 Jan' },
      eng: { uz: 'Ingliz tili: 7.5 → 8.0, mock 4 va 5', en: 'English: 7.5 → 8.0, mocks 4 and 5' },
      note: { uz: "Eng oğir oraliq: ikkala kurs ham çuqur. Qarz kunlariga yöl qöyma — har qarz kuni iş sanasini suradi.",
              en: 'The heaviest stretch: both courses deep. No debt days — every one shifts the job date.' } },
    { from: 19, to: 20,
      title: { uz: '19–20-hafta · Imtihon rejimi', en: 'Weeks 19–20 · Exam mode' },
      py: { uz: 'DataCamp sertifikat (5-fev) + 1-loyiha GitHub\'da; coding 2 soatga tuşadi', en: 'DataCamp certificate (5 Feb) + project 1 on GitHub; coding drops to 2h' },
      eng: { uz: 'Ingliz tili: yakuniy hujum, 6-mock, 20-fev imtihon', en: 'English: final attack, mock 6, exam on 20 Feb' },
      note: { uz: "Imtihon oldi haftalarda coding 2 soat — IELTS ustuvor. 20-fevraldan keyin coding yana 4 soat.",
              en: 'In the pre-exam weeks coding drops to 2h — IELTS takes priority. After 20 Feb coding returns to 4h.' } },
    { from: 21, to: 40,
      title: { uz: 'Imtihondan keyin · işgaça', en: 'After the exam · to the job' },
      py: { uz: 'Portfolio 3 loyiha (15-apr) → arizalar (1-apr) → BIRINÇI IŞ (1-iyun)', en: 'Portfolio of 3 projects (15 Apr) → applications (1 Apr) → FIRST JOB (1 Jun)' },
      eng: { uz: 'Ingliz tili: saqlaş 30–60 daq/kun + magistratura arizalari', en: 'English: maintenance 30–60 min/day + master\'s applications' },
      note: { uz: "Maqsad sahifasida sanalar bilan. Har qarz kuni bu sanalarni suradi.",
              en: 'Dated on the Goal page. Every debt day shifts these dates.' } }
  ],

  /* Konflikt bo'lganda nima qilinadi */
  rules: [
    { uz: "Ingliz tili 4 soat — har kuni, muzokarasiz. Yomon kunda ham.",
      en: 'English four hours — every day, non-negotiable. Even on a bad day.' },
    { uz: "Coding: oğir kun 4 soat, LC kuni 2 soat. Python 30/30 — 23-noyabr, muddat surilmaydi.",
      en: 'Coding: heavy day 4h, LC day 2h. Python 30/30 by 23 November — the deadline does not move.' },
    { uz: "8 soat uyquni heç qaçon qisqartirma. Kun ulgurmasa — erkin vaqt qisqarsin, uyqu emas.",
      en: 'Never cut the eight hours of sleep. If a day overruns, shorten free time, not the sleep.' },
    { uz: "Bajarilmagan kun = qarz kuni = maqsad sanasi +1. Bu jazo emas, hisob.",
      en: 'A day not done = a debt day = goal date +1. Not a punishment — arithmetic.' },
    { uz: "Python materiali inglizça — bu bonus: kod öqiş ham Reading maşqi.",
      en: 'Python material is in English — a bonus: reading code is reading practice.' },
    { uz: "Imtihon oldi 2 haftada coding 2 soatga tuşadi — IELTS ustuvor. Undan oldin — heç qaçon.",
      en: 'In the two pre-exam weeks coding drops to 2h — IELTS takes priority. Never before that.' },
    { uz: "Har 4 haftada ikkala kursda nazorat: IELTS mock va coding loyiha tekşiruvi.",
      en: 'Every four weeks, checkpoint both: an IELTS mock and a coding project review.' }
  ]};
