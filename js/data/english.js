/* ==========================================================================
   ENGLISH — 20 haftalik IELTS 8.0 tayyorgarlik rejasi
   --------------------------------------------------------------------------
   Kurs kalendari (RASMIY: 20-sentabr 2026 → 10-fevral 2027):
     introduction 16–19-sen 2026 — kirish darslari, KURS KUNI EMAS (0-hafta)
     rasmiy start 20-sen 2026 (yakshanba) — kickoff: Python 1-kun, DataCamp 1-kun
     1-kun        21-sen 2026 (dushanba) — 20 hafta = 140 kun
     140-kun      7-fev 2027 (yakshanba)
     zaxira       8–10-fev 2027  (kurs rasmiy tugashi 10-fev)
     imtihon      20-fevral 2027

   Tuzilishi (course.js dagi bilan bir xil qoida: {uz, en}):
     meta       — sanalar, daraja, LC jadvali, halol ogohlantirish
     skills     — 6 ta ko'nikma ustuni
     phases     — 5 bosqich (har biri 4 hafta)
     weeks      — 20 hafta: goal, blocks[], example, tasks[]
     daily      — kunlik tartib (3 xil kun)
     systems    — har ko'nikma uchun metod (grammar 7 qadam, vocab 5 qadam…)
     scoreboard — har yakshanba yoziladigan ko'rsatkichlar
     rules      — 10 ta buzilmas qoida
     target     — 20 hafta oxiridagi ideal profil

   Hafta obyekti:
     { n, phase, title, goal, mock:bool,
       blocks: [ {skill:'grammar', items:[{uz,en}, …]} ],
       example: { bad:'…', good:'…', note:{uz,en} },   // ixtiyoriy
       tasks: [ {uz,en} ] }                            // belgilanadigan ishlar
   ========================================================================== */
window.ENGLISH = {

  /* ====================== META =========================================
     Kalendar (20-sen 2026 → 10-fev 2027):
       16–19-sen   introduction — 4 kirish darsi (ENG_INTRO), kurs kuni EMAS,
                   progressga kirmaydi; #/english/i1 … i4
       20-sen      RASMIY START (yakshanba): kickoff kuni — Python 1-kun,
                   DataCamp 1-kun, diagnostik mock; intizom jadvali shu kundan
       1–140-kun   21-sen 2026 → 7-fev 2027 — 20 hafta, dushanba → yakshanba
       8–10-fev    zaxira, 20-fev imtihon

     Nega 1-kun dushanba: 20 haftani dushanbadan boshlasak, HAR haftaning
     7-kuni yakshanbaga (test kuni), 2/4/6-kunlari Se/Pa/Sha — Everest LC
     kunlariga tushadi. dayKey() shu qoidani biladi — sanani qo'lda hisoblama. */
  meta: {
    start: '2026-09-20',        // RASMIY boshlanish (kickoff, yakshanba)
    week1: '2026-09-21',        // 1-kun — 1-haftaning dushanbasi
    intro: 0,                   // kurs kunlari ichida kirish kuni yo'q (introduction alohida)
    orientation: { from: '2026-09-16', to: '2026-09-19', done: true },   // introduction darslari — 19-sen da RASMIY TUGALLANGAN (ertalabki darsda chiqmaydi)
    days: 140,                  // jami kun (20 × 7)
    weeks: 20,
    bufferTo: '2027-02-10',     // kursning rasmiy tugash sanasi
    exam: '2027-02-20',         // IELTS imtihoni
    from: 'B1+',
    to: 'C1 / IELTS 7.5–8',
    target: 8.0,
    classPlace: 'Everest LC',
    classTime: '16:30–18:30',
    classDays: [2, 4, 6],       // Se, Pa, Sha (0 = yakshanba)
    selfStudy: { uz: '3–4 soat/kun', en: '3–4 hours/day' },

    title: { uz: 'IELTS 8.0 — 20 haftalik reja', en: 'IELTS 8.0 — 20-week plan' },
    lede: {
      uz: "B1+ dan boshlab 20 hafta ichida IELTS 8.0 hududiga chiqish tizimi. Olti ko'nikma alohida emas — bir-birini quvvatlab o'rganiladi.",
      en: 'A system to move from B1+ into IELTS 8.0 territory in 20 weeks. Six skills, not studied separately but feeding each other.'
    },

    /* Halol ogohlantirish — reja bilan birga turishi shart */
    disclaimer: {
      uz: "Muhim: B1+ dan besh oydan kamroq vaqtda 8.0 olish — juda katta maqsad. Bu reja 8.0 ni va'da qilmaydi. Bu — progressni maksimal tezlashtirish uchun tuzilgan intensiv tizim.",
      en: 'One important point: Band 8 in under five months from B1+ is extremely ambitious, so this plan is not a promise of 8.0. It is an intensive system designed to maximize your progress.'
    },

    /* Ko'nikmalar birga o'rganiladi degan asosiy fikr */
    chain: {
      uz: "O'qish → lug'at → grammatika → gapirish → yozish. Shu zanjir passiv bilimni AKTIV ingliz tiliga aylantiradi.",
      en: 'Reading → vocabulary → grammar → speaking → writing. This chain creates active English rather than passive knowledge.'
    },

    mindset: {
      uz: "Maqsading \"ingliz tilini o'rganish\" emas. Keyingi besh oy uchun fikr: \"Har kuni passiv inglizchani aktiv inglizchaga aylantiraman.\"",
      en: 'Your goal shouldn\'t simply be "I need to learn English." Your mindset for the next five months: "Every day I will turn passive English into active English."'
    }
  },

  /* ====================== 6 KO'NIKMA ==================================== */
  skills: [
    { key: 'grammar',   icon: 'brain',      name: { uz: 'Grammatika', en: 'Grammar' },
      goal: { uz: "Aniqlik + avtomatik ishlatish", en: 'Accuracy + automatic use' } },
    { key: 'vocab',     icon: 'book',       name: { uz: "Lug'at", en: 'Vocabulary' },
      goal: { uz: "Yuqori daraja so'zlar + kollokatsiyalar", en: 'High-level vocabulary + collocations' } },
    { key: 'listening', icon: 'headphones', name: { uz: 'Tinglash', en: 'Listening' },
      goal: { uz: "Tabiiy tushunish + IELTS aniqligi", en: 'Understand naturally + IELTS accuracy' } },
    { key: 'reading',   icon: 'doc',        name: { uz: "O'qish", en: 'Reading' },
      goal: { uz: "Tezlik + tushunish + savol strategiyasi", en: 'Speed + comprehension + question strategy' } },
    { key: 'writing',   icon: 'pen',        name: { uz: 'Yozish', en: 'Writing' },
      goal: { uz: "Band 8 tuzilma, grammatika va lug'at", en: 'Band 8 organization, grammar & vocabulary' } },
    { key: 'speaking',  icon: 'mic',        name: { uz: 'Gapirish', en: 'Speaking' },
      goal: { uz: "Ravonlik, aniqlik, talaffuz va fikr", en: 'Fluency, accuracy, pronunciation & ideas' } }
  ],

  /* ====================== 5 BOSQICH ===================================== */
  phases: [
    { n: 1, from: 1,  to: 4,
      title: { uz: 'Poydevor', en: 'Foundation' },
      goal:  { uz: "Mustahkam B2 poydevor", en: 'Strong B2 foundation' },
      note:  { uz: "Birinchi oy — IELTS hiylalarini quvishdan oldin zaifliklarni yopish.",
               en: 'Your first month is about fixing weaknesses before aggressively chasing IELTS tricks.' } },
    { n: 2, from: 5,  to: 8,
      title: { uz: 'B2 → B2+', en: 'B2 → B2+' },
      goal:  { uz: "IELTS tayyorgarlikning markaziga chiqadi", en: 'IELTS becomes the center of your preparation' },
      note:  { uz: "Endi mashqlar IELTS formatida bo'ladi: savol turlari, vaqt, strategiya.",
               en: 'From here on the practice follows the IELTS format: question types, timing, strategy.' } },
    { n: 3, from: 9,  to: 12,
      title: { uz: 'IELTS 7 → 7.5', en: 'IELTS 7 → 7.5' },
      goal:  { uz: "Akademik lug'at va shaxsiy xatolar ustida ish", en: 'Academic vocabulary and personal error work' },
      note:  { uz: "Tayyorgarlik ancha talabchan bo'ladi. Yangi qoida emas — o'z xatolaring ustida ishlash.",
               en: 'The preparation becomes much more demanding. Not new rules — work on your own mistakes.' } },
    { n: 4, from: 13, to: 16,
      title: { uz: 'Band 7.5 → 8', en: 'Band 7.5 → 8' },
      goal:  { uz: "Aniqlik bosqichi", en: 'The precision phase' },
      note:  { uz: "Endi asosan ingliz tilini emas, IELTS Band 8 darajasida ISHLASHNI o'rganasan.",
               en: "You're no longer mainly learning English. You're learning to perform at IELTS Band 8 level." } },
    { n: 5, from: 17, to: 20,
      title: { uz: 'Yakuniy hujum', en: 'Final attack' },
      goal:  { uz: "Yangi material emas — natijani optimallashtirish", en: 'Not new material — optimizing performance' },
      note:  { uz: "Katta hajmda yangi narsa o'rganishni to'xtatamiz. Bor bilimni imtihon natijasiga aylantiramiz.",
               en: 'We stop learning huge amounts of new material. We optimize performance.' } }
  ],

  /* ====================== HAFTALAR ======================================
     Bu ro'yxat endi YENGIL indeks: sarlavha, maqsad va mock bayrog'i.
     Haftaning to'liq mazmuni kunlarda (eng-days-*.js) yotadi.            */
  weeks: [

    /* --------- KIRISH BLOKI (0-hafta, 1–4-kun) --------- */
    {
      n: 0, phase: 0,
      title: { uz: 'Kirish — format, o\'lchov, tizim', en: 'Orientation — format, baseline, system' },
      goal: { uz: "Imtihonni ko'rish, o'zingni o'lchash va o'quv tizimini o'rnatish.",
              en: 'See the exam, measure yourself, and install the study system.' }
    },

    /* --------- BOSQICH 1 — POYDEVOR --------- */
    {
      n: 1, phase: 1,
      title: { uz: 'Grammatikani uyg\'otish + IELTS bilan tanishuv', en: 'Grammar Activation + IELTS Introduction' },
      goal: { uz: "Bilgan grammatikangni ishga solish va IELTS formatini ko'rish.",
              en: 'Activate the grammar you already know and see the IELTS format.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Present Simple', en: 'Present Simple' },
          { uz: 'Present Continuous', en: 'Present Continuous' },
          { uz: 'Past Simple', en: 'Past Simple' },
          { uz: 'Past Continuous', en: 'Past Continuous' },
          { uz: 'Present Perfect', en: 'Present Perfect' },
          { uz: 'Past Perfect', en: 'Past Perfect' },
          { uz: 'Kelasi zamon shakllari', en: 'Future forms' },
          { uz: "So'roq gap qurilishi", en: 'Question formation' },
          { uz: 'Ega va kesim mosligi', en: 'Subject/verb agreement' }
        ] },
        { skill: 'vocab', items: [
          { uz: "Mavzular: ta'lim, kundalik hayot, texnologiya, odamlar, joylar",
            en: 'Topics: education, daily life, technology, people, places' },
          { uz: "Yo'nalish: so'z → kollokatsiya → gap → nutq",
            en: 'Focus: word → collocation → sentence → speaking' }
        ] },
        { skill: 'listening', items: [
          { uz: 'IELTS Listening bilan tanishuv', en: 'IELTS Listening introduction' },
          { uz: '1-bo\'lim (Section 1)', en: 'Section 1' },
          { uz: 'Raqamlar, ismlar, sanalar', en: 'Numbers, names, dates' },
          { uz: 'Harflab aytish (spelling), formalar', en: 'Spelling, forms' }
        ] },
        { skill: 'reading', items: [
          { uz: 'Skimming — umumiy mazmunni ilg\'ash', en: 'Skimming' },
          { uz: 'Scanning — aniq ma\'lumotni topish', en: 'Scanning' },
          { uz: 'Kalit so\'zni joylashtirish', en: 'Locating keywords' },
          { uz: 'Paraphrase — boshqa so\'z bilan aytilgan joyni tanish', en: 'Paraphrasing' }
        ] },
        { skill: 'writing', items: [
          { uz: 'IELTS yozish tuzilmasi bilan tanishish', en: 'Learn the IELTS structure' },
          { uz: 'Task 2: Introduction → Body 1 → Body 2 → Conclusion', en: 'Task 2: Introduction → Body 1 → Body 2 → Conclusion' },
          { uz: "Hozircha Band 8 yozishga urinma — tuzilmani o'zlashtir.", en: "Don't worry about producing Band 8 yet." }
        ] },
        { skill: 'speaking', items: [
          { uz: "Part 1 mavzulari: tug'ilgan shahar, o'qish, oila, qiziqish, texnologiya, do'stlar",
            en: 'Part 1: hometown, studies, family, hobbies, technology, friends' },
          { uz: "O'zingni yozib ol. Keyin grammatik xato, talaffuz muammosi va pauzalarni belgila.",
            en: 'Record yourself. Then identify grammar errors, pronunciation problems and pauses.' }
        ] }
      ],
      example: {
        bad: 'beneficial',
        good: 'highly beneficial · financially beneficial · beneficial to society',
        note: { uz: "So'zni yolg'iz yodlama — u bilan yuradigan so'zlar bilan birga yodla.",
                en: "Don't just memorize the word — learn the words that travel with it." }
      },
      tasks: [
        { uz: "9 ta zamon/qurilishni takrorlab, har biriga 5 ta o'z gapingni yoz", en: 'Review the 9 structures and write 5 original sentences for each' },
        { uz: "5 mavzu bo'yicha 50 ta kollokatsiya daftarga yozildi", en: 'Collect 50 collocations across the 5 topics' },
        { uz: "IELTS Listening Section 1 — 3 ta mashq", en: 'IELTS Listening Section 1 — 3 practice sets' },
        { uz: "Skimming/scanning bilan 3 ta matn o'qildi", en: 'Read 3 passages using skimming/scanning' },
        { uz: "Birinchi Task 2 insho yozildi (baho muhim emas)", en: 'Write your first Task 2 essay (score does not matter yet)' },
        { uz: "Part 1 javoblari yozib olindi va tahlil qilindi", en: 'Record and analyse your Part 1 answers' }
      ]
    },

    {
      n: 2, phase: 1,
      title: { uz: 'Murakkab grammatika', en: 'Complex Grammar' },
      goal: { uz: "Oddiy gapni aniq va murakkab gapga ko'tarish.", en: 'Upgrade simple sentences into accurate complex ones.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Modallar (modals)', en: 'Modals' },
          { uz: 'Qiyoslash (comparatives)', en: 'Comparatives' },
          { uz: 'Shart gaplar (conditionals)', en: 'Conditionals' },
          { uz: 'Majhul nisbat (passive voice)', en: 'Passive voice' },
          { uz: 'Relative clauses', en: 'Relative clauses' },
          { uz: 'Gerund va infinitiv', en: 'Gerunds/infinitives' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Topic sentence — abzatsning asosiy gapi', en: 'Topic sentences' },
          { uz: "Qo'llab-quvvatlovchi fikrlar", en: 'Supporting ideas' },
          { uz: 'Misollar', en: 'Examples' },
          { uz: 'Tushuntirish', en: 'Explanations' },
          { uz: "Fikrlarni bog'lash", en: 'Linking ideas' }
        ] },
        { skill: 'speaking', items: [
          { uz: 'Part 2 — kartochka javoblari', en: 'Part 2 — cue card answers' },
          { uz: '1 daqiqa tayyorgarlik + 2 daqiqa javob tizimi', en: 'The 1-minute preparation + 2-minute response system' }
        ] }
      ],
      example: {
        bad: 'People should protect the environment.',
        good: 'Governments should implement stricter environmental policies in order to reduce long-term ecological damage.',
        note: { uz: "Lekin esda tut: murakkab ≠ chalkash. IELTS ANIQ murakkablikni xohlaydi.",
                en: 'But remember: complex does not mean complicated. IELTS wants accurate complexity.' }
      },
      tasks: [
        { uz: "6 ta grammatik mavzu bo'yicha mashqlar bajarildi", en: 'Complete exercises for all 6 grammar areas' },
        { uz: "10 ta oddiy gap murakkab gapga ko'tarildi", en: 'Upgrade 10 simple sentences into complex ones' },
        { uz: "1 ta Task 2 insho — topic sentence tuzilmasi bilan", en: 'One Task 2 essay built on topic sentences' },
        { uz: "Part 2 — 5 ta kartochka, har biri yozib olindi", en: 'Part 2 — 5 cue cards, each recorded' }
      ]
    },

    {
      n: 3, phase: 1,
      title: { uz: 'Gap qurilishini chuqurlashtirish', en: 'Advanced Sentence Building' },
      goal: { uz: "Uzun gapni boshqarish va o'z inshongni o'zing tahrirlash.",
              en: 'Control long sentences and learn to edit your own essays.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Qo\'shma gaplar', en: 'Complex sentences' },
          { uz: 'Noun clauses', en: 'Noun clauses' },
          { uz: 'Adjective clauses', en: 'Adjective clauses' },
          { uz: 'Adverb clauses', en: 'Adverb clauses' },
          { uz: 'Participle clauses', en: 'Participle clauses' },
          { uz: 'Bog\'lovchilar', en: 'Conjunctions' },
          { uz: 'Tinish belgilari', en: 'Punctuation' }
        ] },
        { skill: 'vocab', items: [
          { uz: 'Atrof-muhit', en: 'Environment' },
          { uz: "Sog'liq", en: 'Health' },
          { uz: 'Jinoyat', en: 'Crime' },
          { uz: 'Hukumat', en: 'Government' },
          { uz: 'Jamiyat', en: 'Society' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Bu hafta 2 ta Task 2 insho yoz', en: 'Write 2 Task 2 essays this week' },
          { uz: '1. Grammatik xatolarni top', en: '1. Find grammar mistakes' },
          { uz: "2. Takrorlangan so'zlarni top", en: '2. Find repeated vocabulary' },
          { uz: '3. Zaif gaplarni top', en: '3. Find weak sentences' },
          { uz: '4. Ularni qayta yoz', en: '4. Rewrite them' },
          { uz: '5. Yaxshilangan variantni yoz', en: '5. Write the improved version' }
        ] }
      ],
      tasks: [
        { uz: "7 xil clause turiga misol yozildi", en: 'Write examples for all 7 clause types' },
        { uz: "5 mavzu bo'yicha 60–75 ta so'z/kollokatsiya", en: '60–75 words/collocations across the 5 topics' },
        { uz: "2 ta Task 2 insho yozildi", en: 'Write 2 Task 2 essays' },
        { uz: "Har ikkala insho 5 qadamli tahrirdan o'tkazildi", en: 'Run both essays through the 5-step rewrite' }
      ]
    },

    {
      n: 4, phase: 1, mock: true,
      title: { uz: 'BIRINCHI NAZORAT — to\'liq mock', en: 'FIRST CHECKPOINT — full mock' },
      goal: { uz: "Boshlang'ich nuqtani aniq o'lchash.", en: 'Measure your starting point precisely.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "To'liq Listening testi (vaqt bilan)", en: 'Full Listening test, timed' }] },
        { skill: 'reading',   items: [{ uz: "To'liq Reading testi — 60 daqiqa", en: 'Full Reading test — 60 minutes' }] },
        { skill: 'writing',   items: [{ uz: 'Task 1 + Task 2 — 60 daqiqa', en: 'Task 1 + Task 2 — 60 minutes' }] },
        { skill: 'speaking',  items: [{ uz: "Part 1 + 2 + 3 — yozib olingan holda", en: 'Part 1 + 2 + 3, recorded' }] }
      ],
      example: {
        note: { uz: "Ball past chiqsa xafa bo'lma — bu boshlang'ich o'lchov. Ideal: 6.0–6.5+. Pastroq bo'lsa, NEGA past ekanini aniq topamiz.",
                en: "Don't worry if your score is low — we're measuring your starting point. Ideally 6.0–6.5+. If you're below that, we identify exactly why." }
      },
      tasks: [
        { uz: "To'liq mock bajarildi (L + R + W + S)", en: 'Complete the full mock (L + R + W + S)' },
        { uz: "Har bo'lim bo'yicha xato tahlili yozildi", en: 'Write an error analysis for each section' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 2 — B2 → B2+ --------- */
    {
      n: 5, phase: 2,
      title: { uz: 'Listening + Reading aniqligi', en: 'Listening + Reading Accuracy' },
      goal: { uz: "Savol turlarini tanish va tuzoqlarni ko'rish.", en: 'Recognise question types and spot the traps.' },
      blocks: [
        { skill: 'listening', items: [
          { uz: "1–2-bo'limlar", en: 'Sections 1–2' },
          { uz: 'Prediction — javobni oldindan taxmin qilish', en: 'Prediction' },
          { uz: "Kalit so'zlar", en: 'Keywords' },
          { uz: 'Paraphrase', en: 'Paraphrases' },
          { uz: 'Distractor — chalg\'ituvchi javoblar', en: 'Distractors' }
        ] },
        { skill: 'reading', items: [
          { uz: 'True / False / Not Given', en: 'True/False/Not Given' },
          { uz: 'Matching headings', en: 'Matching headings' },
          { uz: 'Multiple choice', en: 'Multiple choice' },
          { uz: 'Sentence completion', en: 'Sentence completion' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Task 1: kirish', en: 'Task 1: introduction' },
          { uz: 'Overview — umumiy manzara', en: 'Overview' },
          { uz: 'Taqqoslash', en: 'Comparisons' },
          { uz: 'Tendensiyalar (trends)', en: 'Trends' },
          { uz: 'Raqam tili (data language)', en: 'Data language' }
        ] }
      ],
      example: {
        good: 'increased significantly · declined gradually · remained stable · reached a peak',
        note: { uz: "Task 1 da raqamni takrorlash emas — harakatni tasvirlash kerak.",
                en: "Task 1 isn't about repeating numbers — it's about describing movement." }
      },
      tasks: [
        { uz: "Listening Section 1–2 — 5 ta mashq", en: 'Listening Sections 1–2 — 5 practice sets' },
        { uz: "4 xil savol turidan har biriga 3 tadan mashq", en: '3 practice sets for each of the 4 question types' },
        { uz: "2 ta Task 1 yozildi", en: 'Write 2 Task 1 reports' },
        { uz: "Data language ro'yxati tuzildi va ishlatildi", en: 'Build and use a data-language list' }
      ]
    },

    {
      n: 6, phase: 2,
      title: { uz: 'Gapirishda ravonlik', en: 'Speaking Fluency' },
      goal: { uz: "Qisqa javobdan tabiiy, kengaytirilgan javobga o'tish.", en: 'Move from short answers to natural, extended ones.' },
      blocks: [
        { skill: 'speaking', items: [
          { uz: 'Part 1 — tabiiy javob ber, quruq javobdan qoch', en: 'Part 1 — answer naturally, avoid flat answers' },
          { uz: 'Part 2 — Introduction → Background → Main details → Personal reaction', en: 'Part 2 — Introduction → Background → Main details → Personal reaction' },
          { uz: 'Part 3 — tushuntirish, qiyoslash, taxmin, asoslash, misol', en: 'Part 3 — explain, compare, speculate, justify, give examples' },
          { uz: 'Part 3 qolipi: Opinion → Reason → Explanation → Example → Result', en: 'Part 3 structure: Opinion → Reason → Explanation → Example → Result' }
        ] }
      ],
      example: {
        bad: "Yes, I do. Because it's good.",
        good: 'Yes, definitely. I particularly enjoy it because…',
        note: { uz: "Bu hafta og'irlik gapirishda. Har kuni yozib ol va tinglab chiq.",
                en: 'This week has a heavy speaking focus. Record and listen back every day.' }
      },
      tasks: [
        { uz: "Part 1 — 20 ta savolga kengaytirilgan javob", en: 'Part 1 — extended answers to 20 questions' },
        { uz: "Part 2 — 7 ta kartochka, 2 daqiqadan", en: 'Part 2 — 7 cue cards, 2 minutes each' },
        { uz: "Part 3 — 10 ta savol ORPER qolipida", en: 'Part 3 — 10 questions using the Opinion→Result structure' },
        { uz: "Har kuni kamida 30 daqiqa gapirildi", en: 'Speak at least 30 minutes every day' }
      ]
    },

    {
      n: 7, phase: 2,
      title: { uz: 'Task 2 ustasi', en: 'Task 2 Mastery' },
      goal: { uz: "Beshta insho turini ham ishonch bilan yozish.", en: 'Write all five essay types with confidence.' },
      blocks: [
        { skill: 'writing', items: [
          { uz: '1. Opinion (fikr)', en: '1. Opinion' },
          { uz: '2. Discussion (muhokama)', en: '2. Discussion' },
          { uz: '3. Advantages / disadvantages', en: '3. Advantages/disadvantages' },
          { uz: '4. Problem / solution', en: '4. Problem/solution' },
          { uz: '5. Two-part question', en: '5. Two-part questions' },
          { uz: "Jarayon: savolni tushun → fikr yig' → tartibla → yoz → tekshir",
            en: 'Process: understand the question → generate ideas → organize → write → check' }
        ] }
      ],
      tasks: [
        { uz: "5 ta insho turining tuzilmasi yozib olindi", en: 'Write out the structure of all 5 essay types' },
        { uz: "3 ta Task 2 insho yozildi", en: 'Write 3 Task 2 essays' },
        { uz: "Har insho PLAN→WRITE→CHECK→ANALYZE→REWRITE siklidan o'tdi", en: 'Run each essay through PLAN→WRITE→CHECK→ANALYZE→REWRITE' }
      ]
    },

    {
      n: 8, phase: 2, mock: true,
      title: { uz: 'IKKINCHI MOCK', en: 'SECOND MOCK' },
      goal: { uz: "Har bo'limda ballni QAYERDA yo'qotayotganingni aniqlash.", en: 'Find exactly where you lose marks in each section.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Qaysi bo'limda ball yo'qotding?", en: 'Where did you lose marks?' }] },
        { skill: 'reading',   items: [{ uz: 'Qaysi savol turida?', en: 'Which question types?' }] },
        { skill: 'writing',   items: [
          { uz: 'Task Response', en: 'Task Response' },
          { uz: 'Coherence & Cohesion', en: 'Coherence & Cohesion' },
          { uz: 'Lexical Resource', en: 'Lexical Resource' },
          { uz: 'Grammatical Range & Accuracy', en: 'Grammatical Range & Accuracy' }
        ] },
        { skill: 'speaking',  items: [
          { uz: 'Ravonlik', en: 'Fluency' },
          { uz: "Lug'at", en: 'Vocabulary' },
          { uz: 'Grammatika', en: 'Grammar' },
          { uz: 'Talaffuz', en: 'Pronunciation' }
        ] }
      ],
      tasks: [
        { uz: "To'liq IELTS simulyatsiyasi bajarildi", en: 'Complete a full IELTS simulation' },
        { uz: "Har bo'lim uchun eng zaif nuqta yozildi", en: 'Write down the weakest point for each section' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 3 — IELTS 7 → 7.5 --------- */
    {
      n: 9, phase: 3,
      title: { uz: "Akademik lug'at", en: 'Academic Vocabulary' },
      goal: { uz: "Kuniga 10–15 ta foydali so'z — va ularni ISHLATISH.", en: '10–15 useful words a day — and actually using them.' },
      blocks: [
        { skill: 'vocab', items: [
          { uz: 'Iqtisod', en: 'Economy' },
          { uz: 'Fan', en: 'Science' },
          { uz: 'Texnologiya', en: 'Technology' },
          { uz: "Ta'lim", en: 'Education' },
          { uz: 'Atrof-muhit', en: 'Environment' },
          { uz: 'Globallashuv', en: 'Globalization' },
          { uz: 'Madaniyat', en: 'Culture' },
          { uz: 'Media', en: 'Media' },
          { uz: 'Bandlik', en: 'Employment' }
        ] }
      ],
      example: {
        bad: "Kuniga 100 ta so'z yodlash",
        good: "Kuniga 10–15 ta so'z/kollokatsiya — keyin ularni gapirishda va yozishda ishlatish",
        note: { uz: "Ishlatilmagan so'z — o'rganilmagan so'z.", en: 'A word you never use is a word you never learned.' }
      },
      tasks: [
        { uz: "9 mavzu bo'yicha 70–105 ta so'z/kollokatsiya", en: '70–105 words/collocations across the 9 topics' },
        { uz: "Har bir so'z gapda ishlatildi", en: 'Use every word in a sentence' },
        { uz: "Yangi so'zlar gapirishda ishlatildi", en: 'Use the new words while speaking' },
        { uz: "Yangi so'zlar 2 ta inshoda ishlatildi", en: 'Use the new words in 2 essays' }
      ]
    },

    {
      n: 10, phase: 3,
      title: { uz: 'Band 7+ uchun grammatika', en: 'Grammar for Band 7+' },
      goal: { uz: "Yangi qoida emas — SHAXSIY xatolar ro'yxati va ularni yopish.",
              en: 'Not new rules — your personal error log, and closing those errors.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: "50 ta yangi qoida o'rniga — o'z xatolaringni aniqla", en: 'Instead of 50 new rules, identify your personal mistakes' },
          { uz: "XATOLAR DAFTARI tuz: xato → to'g'risi", en: 'Create an ERROR LOG: mistake → correction' },
          { uz: 'people is → people are', en: 'people is → people are' },
          { uz: 'he go → he goes', en: 'he go → he goes' },
          { uz: 'informations → information', en: 'informations → information' },
          { uz: 'more easier → easier', en: 'more easier → easier' },
          { uz: "Har hafta: ko'rib chiq → test qil → ishlat", en: 'Every week: review → test → use' }
        ] }
      ],
      tasks: [
        { uz: "Shaxsiy xatolar daftari tuzildi", en: 'Build your personal error log' },
        { uz: "Eng ko'p takrorlanadigan 10 ta xato ajratildi", en: 'Isolate your 10 most frequent mistakes' },
        { uz: "Har bir xatoga qarshi 10 tadan gap yozildi", en: 'Write 10 sentences against each mistake' },
        { uz: "Hafta oxirida o'z-o'zini test qildi", en: 'Self-test at the end of the week' }
      ]
    },

    {
      n: 11, phase: 3,
      title: { uz: "O'qish tezligi", en: 'Reading Speed' },
      goal: { uz: "60 daqiqa / 40 savol — bitta savolga tiqilib qolmaslik.",
              en: '60 minutes / 40 questions — never get stuck on one question.' },
      blocks: [
        { skill: 'reading', items: [
          { uz: 'Paraphrase-ni tanish', en: 'Paraphrase recognition' },
          { uz: 'Inference — bevosita aytilmagan xulosa', en: 'Inference' },
          { uz: 'Muallif fikri', en: "Author's opinion" },
          { uz: "Kontekstdan qiyin so'z ma'nosini chiqarish", en: 'Difficult vocabulary from context' },
          { uz: 'Dalilni matndan topish', en: 'Locating evidence' }
        ] }
      ],
      tasks: [
        { uz: "3 ta to'liq Reading testi — vaqt bilan", en: '3 full Reading tests, timed' },
        { uz: "Har testda 1 ta savolga sarflangan maksimal vaqt belgilandi", en: 'Set a maximum time per question and hold to it' },
        { uz: "Noto'g'ri javoblar uchun matndagi dalil topildi", en: 'Find the passage evidence for every wrong answer' }
      ]
    },

    {
      n: 12, phase: 3, mock: true,
      title: { uz: 'UCHINCHI MOCK', en: 'THIRD MOCK' },
      goal: { uz: "Maqsad — 7.0–7.5 atrofi.", en: 'Target around 7.0–7.5.' },
      blocks: [
        { skill: 'reading', items: [{ uz: "To'liq test, real vaqt", en: 'Full test, real timing' }] },
        { skill: 'listening', items: [{ uz: "To'liq test, real vaqt", en: 'Full test, real timing' }] },
        { skill: 'writing', items: [{ uz: 'Task 1 + Task 2 — 60 daqiqa', en: 'Task 1 + Task 2 — 60 minutes' }] },
        { skill: 'speaking', items: [{ uz: "To'liq Speaking, yozib olingan", en: 'Full Speaking, recorded' }] }
      ],
      example: {
        note: { uz: "Agar hali 6.0 atrofida bo'lsang — ko'proq test ishlash yechim emas. Eng zaif ko'nikmaga qaytib, uni tuzat.",
                en: "If you're still around 6.0, don't simply do more tests. Return to the weakest skill." }
      },
      tasks: [
        { uz: "To'liq mock bajarildi", en: 'Complete the full mock' },
        { uz: "4-hafta natijasi bilan taqqoslandi", en: 'Compare against the week-4 result' },
        { uz: "Eng zaif ko'nikma uchun reja tuzildi", en: 'Make a plan for the weakest skill' }
      ]
    },

    /* --------- BOSQICH 4 — BAND 7.5 → 8 --------- */
    {
      n: 13, phase: 4,
      title: { uz: 'Band 8 darajasida yozish', en: 'Band 8 Writing' },
      goal: { uz: "To'rt mezonning har birini ongli boshqarish.", en: 'Consciously control all four criteria.' },
      blocks: [
        { skill: 'writing', items: [
          { uz: 'Task Response — savolning HAR qismiga javob ber', en: 'Task Response — answer every part of the question' },
          { uz: 'Coherence — fikrlar mantiqiy oqsin', en: 'Coherence — ideas must flow logically' },
          { uz: "Vocabulary — aniq so'zni tabiiy ishlat", en: 'Vocabulary — use precise vocabulary naturally' },
          { uz: 'Grammar — turli qurilma, kam xato', en: 'Grammar — variety of structures with few errors' }
        ] }
      ],
      example: {
        bad: 'Iloji boricha eng qiyin so\'zlarni ishlatish',
        good: "Aytmoqchi bo'lgan fikringni aniq va tabiiy ifodalash",
        note: { uz: "Maqsad — chiroyli ko'rinish emas, aniq ma'no.", en: "The goal isn't to look impressive — it's to mean exactly what you say." }
      },
      tasks: [
        { uz: "4 ta Task 2 insho — har biri mezon bo'yicha baholandi", en: '4 Task 2 essays, each scored against the criteria' },
        { uz: "2 ta Task 1 yozildi", en: 'Write 2 Task 1 reports' },
        { uz: "Har insho uchun 4 mezon bo'yicha o'z-o'zini baholash", en: 'Self-assess every essay on all 4 criteria' }
      ]
    },

    {
      n: 14, phase: 4,
      title: { uz: 'Band 8 darajasida gapirish', en: 'Band 8 Speaking' },
      goal: { uz: "Mazmunli javob + talaffuz nazorati.", en: 'Sophisticated answers plus pronunciation control.' },
      blocks: [
        { skill: 'speaking', items: [
          { uz: 'Part 1 — tabiiy, kengaytirilgan javob', en: 'Part 1 — natural, extended answers' },
          { uz: "Part 2 — 2 daqiqa uzluksiz gapirish", en: 'Part 2 — speak continuously for around 2 minutes' },
          { uz: 'Part 3 — Claim → Explanation → Example → Contrast/Result', en: 'Part 3 — Claim → Explanation → Example → Contrast/Result' },
          { uz: 'Talaffuz', en: 'Pronunciation' },
          { uz: "Urg'u (stress)", en: 'Stress' },
          { uz: 'Intonatsiya', en: 'Intonation' },
          { uz: "Bog'langan nutq (connected speech)", en: 'Connected speech' },
          { uz: 'Ikkilanishni nazorat qilish', en: 'Hesitation control' }
        ] }
      ],
      tasks: [
        { uz: "Part 2 — 10 ta kartochka, hech to'xtamasdan 2 daqiqa", en: 'Part 2 — 10 cue cards, a full 2 minutes without stopping' },
        { uz: "Part 3 — 15 ta savol CEEC qolipida", en: 'Part 3 — 15 questions using the Claim→Result structure' },
        { uz: "Talaffuz: har kuni 10 daqiqa shadowing", en: 'Pronunciation: 10 minutes of shadowing daily' },
        { uz: "Har kuni 30 daqiqa gapirildi", en: 'Speak 30 minutes every day' }
      ]
    },

    {
      n: 15, phase: 4,
      title: { uz: "To'liq IELTS mashg'uloti", en: 'Full IELTS Training' },
      goal: { uz: "Vaqt bilan muntazam to'liq testlar.", en: 'Regular timed full tests.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Haftasiga 2–3 ta to'liq test", en: '2–3 full tests per week' }] },
        { skill: 'reading',   items: [{ uz: "Haftasiga 2–3 ta to'liq test", en: '2–3 full tests per week' }] },
        { skill: 'writing',   items: [{ uz: 'Haftasiga 3 ta yozish sessiyasi', en: '3 writing sessions per week' }] },
        { skill: 'speaking',  items: [{ uz: 'Kuniga 30 daqiqa', en: '30 minutes per day' }] }
      ],
      tasks: [
        { uz: "2–3 ta to'liq Listening testi", en: '2–3 full Listening tests' },
        { uz: "2–3 ta to'liq Reading testi", en: '2–3 full Reading tests' },
        { uz: "3 ta yozish sessiyasi", en: '3 writing sessions' },
        { uz: "Har kuni 30 daqiqa gapirish", en: '30 minutes of speaking every day' }
      ]
    },

    {
      n: 16, phase: 4, mock: true,
      title: { uz: "TO'RTINCHI MOCK — eng katta nazorat", en: 'FOURTH MOCK — the biggest checkpoint' },
      goal: { uz: "Ideal: L 8+ · R 8+ · W 7–8 · S 7.5–8", en: 'Ideal: L 8+ · R 8+ · W 7–8 · S 7.5–8' },
      blocks: [
        { skill: 'listening', items: [{ uz: 'Maqsad: 8.0+', en: 'Target: 8.0+' }] },
        { skill: 'reading',   items: [{ uz: 'Maqsad: 8.0+', en: 'Target: 8.0+' }] },
        { skill: 'writing',   items: [{ uz: 'Maqsad: 7.0–8.0', en: 'Target: 7.0–8.0' }] },
        { skill: 'speaking',  items: [{ uz: 'Maqsad: 7.5–8.0', en: 'Target: 7.5–8.0' }] }
      ],
      example: {
        note: { uz: "Umumiy ball to'rtala bo'lim o'rtachasidan chiqadi — bitta zaif bo'lim hammasini pastga tortadi.",
                en: 'Your overall score is calculated from all four sections — one weak section pulls everything down.' }
      },
      tasks: [
        { uz: "To'liq mock bajarildi", en: 'Complete the full mock' },
        { uz: "Umumiy ball hisoblandi", en: 'Calculate the overall band' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 5 — YAKUNIY HUJUM --------- */
    {
      n: 17, phase: 5,
      title: { uz: 'Zaifliklarni yo\'q qilish', en: 'Weakness Elimination' },
      goal: { uz: "Oldingi testlardan eng ko'p takrorlangan 10 ta xatoni topib, aynan ularga hujum qilish.",
              en: 'Find your top 10 recurring mistakes from previous tests and attack exactly those.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: '1. Artikllar (a / an / the)', en: '1. Articles' },
          { uz: '2. Predloglar', en: '2. Prepositions' },
          { uz: '3. Ega–kesim mosligi', en: '3. Verb agreement' },
          { uz: '4. Zamonlar', en: '4. Tenses' }
        ] },
        { skill: 'writing', items: [
          { uz: "5. So'z takrori", en: '5. Word repetition' },
          { uz: '6. Zaif kirish qismi', en: '6. Weak introductions' },
          { uz: '7. Yomon misollar', en: '7. Poor examples' }
        ] },
        { skill: 'listening', items: [{ uz: '8. Listening — imlo xatolari', en: '8. Listening spelling' }] },
        { skill: 'reading',   items: [{ uz: '9. Reading — vaqt taqsimoti', en: '9. Reading timing' }] },
        { skill: 'speaking',  items: [{ uz: '10. Speaking — ikkilanish', en: '10. Speaking hesitation' }] }
      ],
      tasks: [
        { uz: "Oldingi 4 ta mock qayta ko'rib chiqildi", en: 'Review all 4 previous mocks' },
        { uz: "Top 10 takrorlanuvchi xato ro'yxati tuzildi", en: 'Build the top-10 recurring mistake list' },
        { uz: "Har bir xatoga qarshi maqsadli mashq bajarildi", en: 'Do targeted practice against each mistake' }
      ]
    },

    {
      n: 18, phase: 5, mock: true,
      title: { uz: "To'liq imtihon simulyatsiyasi", en: 'Full Exam Simulation' },
      goal: { uz: "2 ta to'liq simulyatsiya — real imtihon sharoitida.", en: 'Two complete simulations under real exam conditions.' },
      blocks: [
        { skill: 'listening', items: [
          { uz: 'Real vaqt bilan', en: 'Real timing' },
          { uz: 'Telefon yo\'q', en: 'No phone' },
          { uz: "Lug'at yo'q", en: 'No dictionary' },
          { uz: 'Pauza yo\'q', en: 'No pauses' }
        ] },
        { skill: 'reading', items: [{ uz: "Haqiqiy imtihondek munosabatda bo'l", en: 'Treat it like the real examination' }] }
      ],
      tasks: [
        { uz: "1-simulyatsiya bajarildi", en: 'Complete simulation 1' },
        { uz: "2-simulyatsiya bajarildi", en: 'Complete simulation 2' },
        { uz: "Ikkalasi ham xato tahlilidan o'tkazildi", en: 'Run an error analysis on both' }
      ]
    },

    {
      n: 19, phase: 5,
      title: { uz: 'Yakuniy sozlash', en: 'Final Optimization' },
      goal: { uz: "Yangi material emas — aniqlikni oshirish.", en: 'No new material — sharpening accuracy.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Takrorlanuvchi xatolaringga e'tibor ber", en: 'Focus on your recurring mistakes' }] },
        { skill: 'reading',   items: [{ uz: 'Vaqtni mukammal boshqar', en: 'Perfect your timing' }] },
        { skill: 'writing',   items: [
          { uz: 'Fikrlar', en: 'Ideas' },
          { uz: 'Tuzilma', en: 'Structure' },
          { uz: 'Grammatika', en: 'Grammar' },
          { uz: "Lug'at", en: 'Vocabulary' },
          { uz: 'Qayta o\'qib tekshirish (proofreading)', en: 'Proofreading' }
        ] },
        { skill: 'speaking',  items: [{ uz: "Har kuni gapir. O'zingni yozib ol.", en: 'Daily speaking. Record yourself.' }] }
      ],
      tasks: [
        { uz: "Xatolar daftari to'liq ko'rib chiqildi", en: 'Review the full error log' },
        { uz: "2 ta vaqt bilan Writing testi", en: '2 timed Writing tests' },
        { uz: "Har kuni Speaking + yozib olish", en: 'Daily speaking with recording' }
      ]
    },

    {
      n: 20, phase: 5,
      title: { uz: 'IMTIHON REJIMI', en: 'EXAM MODE' },
      goal: { uz: "Miyani charchatma — o'tkir tut.", en: "Don't overload yourself — keep your brain sharp." },
      blocks: [
        { skill: 'grammar', items: [{ uz: "Yengil takror", en: 'Light review' }] },
        { skill: 'reading', items: [{ uz: "To'liq simulyatsiyalar", en: 'Full simulations' }] },
        { skill: 'writing', items: [{ uz: 'Xato ustida ish', en: 'Error correction' }] },
        { skill: 'speaking', items: [{ uz: 'Har kuni gapirish', en: 'Daily speaking' }] }
      ],
      example: {
        bad: "Oxirgi kunlarda 500 ta yangi so'z yodlash",
        good: "Yengil takror + simulyatsiya + xato ustida ish + gapirish",
        note: { uz: "Oxirgi kunlar — miyani o'tkir saqlash uchun, tiqishtirish uchun emas.",
                en: 'The final days are about keeping your brain sharp. Not cramming 500 new words.' }
      },
      tasks: [
        { uz: "Yengil takror rejimiga o'tildi", en: 'Switch into light-review mode' },
        { uz: "1–2 ta to'liq simulyatsiya", en: '1–2 full simulations' },
        { uz: "Uyqu tartibi imtihon vaqtiga moslandi", en: 'Align your sleep with the exam schedule' },
        { uz: "Imtihon hujjatlari va joyi tekshirildi", en: 'Check exam documents and venue' }
      ]
    }
  ],

  /* ====================== KUNLIK TARTIB ================================= */
  daily: [
    {
      key: 'heavy',
      days: { uz: 'Dushanba / Chorshanba / Juma', en: 'Monday / Wednesday / Friday' },
      note: { uz: "Og'ir mustaqil ish kunlari — LC yo'q.", en: 'Heavy self-study days — no class.' },
      total: '4h 20m',
      rows: [
        { when: { uz: 'Ertalab', en: 'Morning' },     skill: 'grammar',   min: 40, what: { uz: "Qoida + mashq + o'z gaplaring", en: 'Study + exercises + active sentences' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'vocab',     min: 40, what: { uz: "10–15 ta so'z/kollokatsiya", en: '10–15 words/collocations' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'listening', min: 45, what: { uz: 'IELTS + transkript tahlili', en: 'IELTS + transcript analysis' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'reading',   min: 45, what: { uz: 'Vaqt bilan o\'qish', en: 'Timed reading' } },
        { when: { uz: 'Kechqurun', en: 'Evening' },   skill: 'writing',   min: 60, what: { uz: 'Task 1 yoki Task 2', en: 'Task 1 or Task 2' } },
        { when: { uz: 'Uyqudan oldin', en: 'Before bed' }, skill: 'speaking', min: 30, what: { uz: "O'zingni yozib ol", en: 'Record yourself' } }
      ]
    },
    {
      key: 'class',
      days: { uz: 'Seshanba / Payshanba / Shanba', en: 'Tuesday / Thursday / Saturday' },
      note: { uz: "Everest LC 16:30–18:30 — shuning uchun mustaqil yuk yengilroq.", en: 'Everest LC 16:30–18:30 — so the self-study load is lighter.' },
      total: '2h 05m',
      rows: [
        { when: { uz: 'Darsdan oldin', en: 'Before class' }, skill: 'grammar',   min: 45, what: { uz: "Grammatika / lug'at", en: 'Grammar / vocabulary' } },
        { when: { uz: 'Darsdan keyin', en: 'After class' },  skill: 'listening', min: 30, what: { uz: 'IELTS listening', en: 'IELTS listening' } },
        { when: { uz: 'Keyinroq', en: 'Later' },             skill: 'speaking',  min: 30, what: { uz: 'Gapirish + yozib olish', en: 'Speaking + recording' } },
        { when: { uz: 'Qisqa takror', en: 'Quick review' },  skill: 'vocab',     min: 20, what: { uz: "LC da o'rganganingni takrorla", en: 'Review what you learned at LC' } }
      ]
    },
    {
      key: 'sunday',
      days: { uz: 'Yakshanba', en: 'Sunday' },
      note: { uz: "Test + tahlil kuni. Bu kun juda muhim.", en: 'Test + review day. Extremely important.' },
      total: '3h+',
      rows: [
        { when: { uz: 'Ertalab', en: 'Morning' },   skill: 'listening', min: 40, what: { uz: 'Listening testi', en: 'Listening test' } },
        { when: { uz: 'Tushdan keyin', en: 'Afternoon' }, skill: 'reading', min: 60, what: { uz: 'Reading testi', en: 'Reading test' } },
        { when: { uz: 'Kechqurun', en: 'Evening' }, skill: 'writing',   min: 60, what: { uz: 'Yozish', en: 'Writing' } },
        { when: { uz: 'Yakunda', en: 'Then' },      skill: 'grammar',   min: 40, what: { uz: 'XATO TAHLILI — "nega xato qildim?"', en: 'ERROR ANALYSIS — "why did I get this wrong?"' } }
      ]
    }
  ],

  /* ====================== METODLAR ====================================== */
  systems: [
    {
      skill: 'grammar',
      title: { uz: 'Grammatika dasturi', en: 'Grammar program' },
      intro: { uz: "Grammatikani bilasan, lekin ishlata olmayapsan — muammo shu. Bu tizim passiv grammatikani aktiv grammatikaga aylantiradi.",
               en: 'You know grammar but struggle to activate it. This system turns passive grammar into active grammar.' },
      steps: [
        { t: { uz: "O'rgan", en: 'Learn' },      d: { uz: 'Qoidani tushun.', en: 'Understand the rule.' } },
        { t: { uz: 'Mashq qil', en: 'Practice' }, d: { uz: 'Mashqlarni bajar.', en: 'Complete exercises.' } },
        { t: { uz: 'Yarat', en: 'Create' },      d: { uz: "5–10 ta o'z gapingni yoz.", en: 'Write 5–10 original sentences.' } },
        { t: { uz: 'Gapir', en: 'Speak' },       d: { uz: 'Javob berayotganda shu grammatikani ishlat.', en: 'Use that grammar while answering questions.' } },
        { t: { uz: 'Yoz', en: 'Write' },         d: { uz: 'IELTS inshoda ishlat.', en: 'Use it in IELTS writing.' } },
        { t: { uz: 'Tuzat', en: 'Correct' },     d: { uz: 'Xatolaringni top.', en: 'Find your mistakes.' } },
        { t: { uz: 'Takrorla', en: 'Repeat' },   d: { uz: 'Sikl yopiladi — grammatika aktivlashadi.', en: 'The loop closes — the grammar becomes active.' } }
      ]
    },
    {
      skill: 'vocab',
      title: { uz: "Lug'at tizimi", en: 'Vocabulary system' },
      intro: { uz: "Hech qachon shunday qilma: so'z → tarjima → yodla → unut.",
               en: 'Never do this: word → translation → memorize → forget.' },
      steps: [
        { t: { uz: "SO'Z", en: 'WORD' },                d: { uz: 'significant', en: 'significant' } },
        { t: { uz: 'KOLLOKATSIYA', en: 'COLLOCATIONS' }, d: { uz: 'significant increase · significant impact · significant difference · highly significant', en: 'significant increase · significant impact · significant difference · highly significant' } },
        { t: { uz: 'GAP', en: 'SENTENCE' },             d: { uz: 'Technology has had a significant impact on the way people communicate.', en: 'Technology has had a significant impact on the way people communicate.' } },
        { t: { uz: 'GAPIRISH', en: 'SPEAKING' },        d: { uz: 'Tabiiy ishlat.', en: 'Use it naturally.' } },
        { t: { uz: 'YOZISH', en: 'WRITING' },           d: { uz: "O'rni kelganda ishlat.", en: 'Use it when appropriate.' } }
      ]
    },
    {
      skill: 'listening',
      title: { uz: 'Tinglash tizimi', en: 'Listening system' },
      intro: { uz: "Faqat test ishlash yetarli emas — har yozuvni oltita qadamdan o'tkaz.",
               en: "Don't only take tests — run every recording through six steps." },
      steps: [
        { t: { uz: 'Tingla', en: 'Listen' },        d: { uz: 'Oddiy tushunish uchun.', en: 'Understand normally.' } },
        { t: { uz: 'Test', en: 'Test' },            d: { uz: 'Savollarga javob ber.', en: 'Answer questions.' } },
        { t: { uz: 'Tekshir', en: 'Check' },        d: { uz: 'Xatolarni top.', en: 'Find mistakes.' } },
        { t: { uz: 'Transkript', en: 'Transcript' }, d: { uz: "Aynan nimani eshitmaganingni top.", en: 'Find exactly what you missed.' } },
        { t: { uz: 'Shadowing', en: 'Shadow' },     d: { uz: 'Notiq ortidan takrorla.', en: 'Repeat after the speaker.' } },
        { t: { uz: 'Qayta tingla', en: 'Listen again' }, d: { uz: 'Ikkinchi marta ancha ko\'p tushunasan.', en: 'You should understand much more the second time.' } }
      ]
    },
    {
      skill: 'reading',
      title: { uz: "O'qish tizimi", en: 'Reading system' },
      intro: { uz: "IELTS savoli ko'pincha matndagi so'zni AYNAN ishlatmaydi — shuning uchun paraphrase eng muhim qadam.",
               en: "The question often doesn't use the exact words from the passage — that's why paraphrase is the key step." },
      steps: [
        { t: { uz: 'Birinchi', en: 'First' },   d: { uz: 'Umumiy ma\'noni tushun.', en: 'Understand the overall meaning.' } },
        { t: { uz: 'Ikkinchi', en: 'Second' },  d: { uz: 'Har abzatsning vazifasini aniqla.', en: 'Identify paragraph purposes.' } },
        { t: { uz: 'Uchinchi', en: 'Third' },   d: { uz: 'Dalilni top.', en: 'Find evidence.' } },
        { t: { uz: "To'rtinchi", en: 'Fourth' }, d: { uz: "Lug'atni tahlil qil.", en: 'Analyze vocabulary.' } },
        { t: { uz: 'Beshinchi', en: 'Fifth' },  d: { uz: "Paraphrase'larni o'rgan.", en: 'Study paraphrases.' } }
      ]
    },
    {
      skill: 'writing',
      title: { uz: 'Yozish tizimi', en: 'Writing system' },
      intro: { uz: "Insho tugagach darhol keyingisiga o'tma. Eng katta o'sish REWRITE bosqichida bo'ladi.",
               en: 'Never finish an essay and immediately move on. The rewrite is where a lot of improvement happens.' },
      steps: [
        { t: { uz: 'PLAN', en: 'PLAN' },       d: { uz: 'Fikr yig\'ib, tartibla.', en: 'Generate and organize ideas.' } },
        { t: { uz: 'WRITE', en: 'WRITE' },     d: { uz: 'Vaqt bilan yoz.', en: 'Write, timed.' } },
        { t: { uz: 'CHECK', en: 'CHECK' },     d: { uz: 'Grammatika va lug\'atni tekshir.', en: 'Check grammar and vocabulary.' } },
        { t: { uz: 'ANALYZE', en: 'ANALYZE' }, d: { uz: 'Zaif joylarni belgila.', en: 'Mark the weak parts.' } },
        { t: { uz: 'REWRITE', en: 'REWRITE' }, d: { uz: 'Yaxshilangan variantni yoz.', en: 'Write the improved version.' } }
      ],
      quota: [
        { t: { uz: 'Boshlang\'ich (1–8 hafta)', en: 'Early stage (weeks 1–8)' }, d: { uz: '2 × Task 2 + 1 × Task 1 / hafta', en: '2 Task 2 + 1 Task 1 per week' } },
        { t: { uz: 'Keyinroq (9–16 hafta)', en: 'Later (weeks 9–16)' },          d: { uz: '3 × Task 2 + 2 × Task 1 / hafta', en: '3 Task 2 + 2 Task 1 per week' } },
        { t: { uz: 'Yakuniy (17–20 hafta)', en: 'Final phase (weeks 17–20)' },   d: { uz: "Vaqt bilan to'liq Writing testlari", en: 'Timed full Writing tests' } }
      ]
    },
    {
      skill: 'speaking',
      title: { uz: 'Gapirish tizimi', en: 'Speaking system' },
      intro: { uz: "Har kuni 30 daqiqa: 10 + 10 + 10. Keyin yozuvni tinglab, to'rt narsani tekshir.",
               en: 'Every day 30 minutes: 10 + 10 + 10. Then listen back and check four things.' },
      steps: [
        { t: { uz: 'Part 1 — 10 daqiqa', en: 'Part 1 — 10 min' }, d: { uz: 'Kundalik mavzular.', en: 'Everyday topics.' } },
        { t: { uz: 'Part 2 — 10 daqiqa', en: 'Part 2 — 10 min' }, d: { uz: 'Kartochka + 2 daqiqa javob.', en: 'Cue card + 2-minute answer.' } },
        { t: { uz: 'Part 3 — 10 daqiqa', en: 'Part 3 — 10 min' }, d: { uz: 'Abstrakt muhokama.', en: 'Abstract discussion.' } },
        { t: { uz: 'Tinglab chiq', en: 'Listen back' },           d: { uz: 'Grammatika · Lug\'at · Talaffuz · Ravonlik', en: 'Grammar · Vocabulary · Pronunciation · Fluency' } },
        { t: { uz: 'Qayta gapir', en: 'Speak again' },            d: { uz: 'Xatolarni tuzatib, javobni takrorla.', en: 'Correct the mistakes and repeat the answer.' } }
      ]
    }
  ],

  /* ====================== HAFTALIK JADVAL =============================== */
  scoreboard: {
    title: { uz: 'Haftalik natija jadvali', en: 'Weekly scoreboard' },
    note: { uz: "Har yakshanba to'ldiriladi. Faqat ballni emas — NEGA shunday bo'lganini ham yoz.",
            en: 'Fill this in every Sunday. Record not just the score, but why.' },
    bands: [
      { key: 'l', name: { uz: 'Listening', en: 'Listening' }, max: 9 },
      { key: 'r', name: { uz: 'Reading', en: 'Reading' },     max: 9 },
      { key: 'w', name: { uz: 'Writing', en: 'Writing' },     max: 9 },
      { key: 's', name: { uz: 'Speaking', en: 'Speaking' },   max: 9 }
    ],
    extra: [
      { uz: "O'qilgan soatlar", en: 'Hours studied' },
      { uz: 'Asosiy xatolar', en: 'Major mistakes' },
      { uz: "Aktivlashtirilgan yangi so'zlar", en: 'New vocabulary activated' },
      { uz: 'Gapirilgan daqiqalar', en: 'Speaking minutes' },
      { uz: 'Yozilgan insholar', en: 'Essays completed' }
    ]
  },

  /* ====================== 10 QOIDA ====================================== */
  rules: [
    { uz: "Har kuni ingliz tili. Yomon kunda ham — kamida 30 daqiqa.", en: 'English every day. Even on a bad day: minimum 30 minutes.' },
    { uz: "Faqat iste'mol qilma — ISHLAB CHIQAR. Gapirish va yozish shart.", en: "Don't just consume English. Produce English. Speaking + writing are essential." },
    { uz: 'Har bir xato tahlil qilinadi.', en: 'Every mistake gets analyzed.' },
    { uz: 'Insho yodlama.', en: "Don't memorize essays." },
    { uz: "Ulkan so'z ro'yxatlarini yodlama.", en: "Don't memorize huge vocabulary lists." },
    { uz: "\"Chiroyli\" inglizcha quvma. Aniqlik > murakkablik.", en: "Don't chase \"fancy\" English. Accuracy > complexity." },
    { uz: "Har 4 haftada — to'liq mock.", en: 'Every 4 weeks → full mock.' },
    { uz: "Telefon o'qish sessiyangni boshqarmasin.", en: 'Your phone should not control your study sessions.' },
    { uz: "Yaxshi uxla. Miya tiklanmasa o'rganmaydi.", en: 'Sleep properly. Your brain needs recovery to learn.' },
    { uz: 'Muntazamlik motivatsiyadan kuchli.', en: 'Consistency beats motivation.' }
  ],

  /* ====================== YAKUNIY MAQSAD ================================ */
  target: [
    { skill: 'grammar',   band: '',        d: { uz: "Kuchli B2/C1 nazorat, takrorlanuvchi xato deyarli yo'q", en: 'Strong B2/C1 control with very few recurring errors' } },
    { skill: 'vocab',     band: '',        d: { uz: "Katta aktiv lug'at, tabiiy kollokatsiyalar", en: 'Large active vocabulary with natural collocations' } },
    { skill: 'listening', band: '8.0+',    d: { uz: 'Tabiiy tezlikda ishonchli tushunish', en: 'Confident understanding at natural speed' } },
    { skill: 'reading',   band: '8.0+',    d: { uz: '60 daqiqa / 40 savol, barqaror aniqlik', en: '60 minutes / 40 questions, stable accuracy' } },
    { skill: 'writing',   band: '7.0–8.0', d: { uz: "To'rt mezon bo'yicha nazorat", en: 'Control across all four criteria' } },
    { skill: 'speaking',  band: '7.5–8.0', d: { uz: 'Ravon, aniq, tabiiy talaffuz', en: 'Fluent, accurate, natural pronunciation' } }
  ]
};
