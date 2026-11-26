/* ==========================================================================
   ENGLISH — 16 haftalik IELTS 8.0 tayyorgarlik rejasi
   --------------------------------------------------------------------------
   Kurs kalendari (RASMIY: 25-oktabr 2026 → 10-fevral 2027):
     introduction 16–19-sen 2026 — kirish darslari, KURS KUNI EMAS (0-hafta)
     rasmiy start 25-okt 2026 (yakshanba) — kickoff: Python 1-kun, DataCamp 1-kun
     1-kun        26-okt 2026 (dushanba) — 15 hafta + 3 kun = 108 kun
     108-kun      10-fev 2027 (chorshanba)
     zaxira       8–10-fev 2027  (kurs rasmiy tugashi 10-fev)
     imtihon      20-fevral 2027

   Tuzilishi (course.js dagi bilan bir xil qoida: {uz, en}):
     meta       — sanalar, daraja, LC jadvali, halol ogohlantirish
     skills     — 6 ta ko'nikma ustuni
     phases     — 5 bosqich (har biri 4 hafta)
     weeks      — 16 hafta: goal, blocks[], example, tasks[]
     daily      — kunlik tartib (3 xil kun)
     systems    — har ko'nikma uchun metod (grammar 7 qadam, vocab 5 qadam…)
     scoreboard — har yakshanba yoziladigan ko'rsatkichlar
     rules      — 10 ta buzilmas qoida
     target     — 16 hafta oxiridagi ideal profil

   Hafta obyekti:
     { n, phase, title, goal, mock:bool,
       blocks: [ {skill:'grammar', items:[{uz,en}, …]} ],
       example: { bad:'…', good:'…', note:{uz,en} },   // ixtiyoriy
       tasks: [ {uz,en} ] }                            // belgilanadigan ishlar
   ========================================================================== */
window.ENGLISH = {

  /* ====================== META =========================================
     Kalendar (25-okt 2026 → 10-fev 2027):
       16–19-sen   introduction — 4 kirish darsi (ENG_INTRO), kurs kuni EMAS,
                   progressga kirmaydi; #/english/i1 … i4
       25-okt      RASMIY START (yakshanba): kickoff kuni — Python 1-kun,
                   DataCamp 1-kun, diagnostik mock; intizom jadvali shu kundan
       1–108-kun   26-okt 2026 → 10-fev 2027 — 16 hafta, dushanba → yakshanba
       8–10-fev    zaxira, 20-fev imtihon

     Nega 1-kun dushanba: 16 haftani dushanbadan boshlasak, HAR haftaning
     7-kuni yakshanbaga (test kuni), 2/4/6-kunlari Se/Pa/Sha — Everest LC
     kunlariga tushadi. dayKey() shu qoidani biladi — sanani qo'lda hisoblama. */
  meta: {
    start: '2026-10-25',        // RASMIY boshlanish (kickoff, yakshanba) — 2026-10 kalendar reseti
    week1: '2026-10-26',        // 1-kun — 1-haftaning dushanbasi
    intro: 0,                   // kurs kunlari ichida kirish kuni yo'q (introduction alohida)
    orientation: { from: '2026-10-21', to: '2026-10-24', done: true },   // introduction darslari — 19-sen da RASMIY TUGALLANGAN (ertalabki darsda chiqmaydi)
    days: 108,                  // jami kun: 26-okt → 10-fev (15 hafta + 3 kun); 109–140-kunlar jadvaldan olib tashlangan
    weeks: 16,
    bufferTo: '2027-02-10',     // kursning rasmiy tugash sanasi
    exam: '2027-02-20',         // IELTS imtihoni
    from: 'B1+',
    to: 'C1 / IELTS 7.5–8',
    target: 8.0,
    classPlace: 'Everest LC',
    classTime: '16:30–18:30',
    classDays: [2, 4, 6],       // Se, Pa, Sha (0 = yakshanba)
    selfStudy: { uz: '3–4 soat/kun', en: '3–4 hours/day' },

    title: { uz: 'IELTS 8.0 — 16 haftalik reja', en: 'IELTS 8.0 — 16-week plan' },
    lede: {
      uz: "B1+ dan boşlab 16 hafta içida IELTS 8.0 hududiga çiqiş tizimi. Olti könikma alohida emas — bir-birini quvvatlab örganiladi.",
      en: 'A system to move from B1+ into IELTS 8.0 territory in 16 weeks. Six skills, not studied separately but feeding each other.'
    },

    /* Halol ogohlantirish — reja bilan birga turishi shart */
    disclaimer: {
      uz: "Muhim: B1+ dan beş oydan kamroq vaqtda 8.0 oliş — juda katta maqsad. Bu reja 8.0 ni vaʼda qilmaydi. Bu — progressni maksimal tezlaştiriş uçun tuzilgan intensiv tizim.",
      en: 'One important point: Band 8 in under five months from B1+ is extremely ambitious, so this plan is not a promise of 8.0. It is an intensive system designed to maximize your progress.'
    },

    /* Ko'nikmalar birga o'rganiladi degan asosiy fikr */
    chain: {
      uz: "Öqiş → luğat → grammatika → gapiriş → yoziş. Şu zanjir passiv bilimni AKTIV ingliz tiliga aylantiradi.",
      en: 'Reading → vocabulary → grammar → speaking → writing. This chain creates active English rather than passive knowledge.'
    },

    mindset: {
      uz: "Maqsading \"ingliz tilini örganiş\" emas. Keyingi beş oy uçun fikr: \"Har kuni passiv inglizçani aktiv inglizçaga aylantiraman.\"",
      en: 'Your goal shouldn\'t simply be "I need to learn English." Your mindset for the next five months: "Every day I will turn passive English into active English."'
    }
  },

  /* ====================== 6 KO'NIKMA ==================================== */
  skills: [
    { key: 'grammar',   icon: 'brain',      name: { uz: 'Grammatika', en: 'Grammar' },
      goal: { uz: "Aniqlik + avtomatik işlatiş", en: 'Accuracy + automatic use' } },
    { key: 'vocab',     icon: 'book',       name: { uz: "Luğat", en: 'Vocabulary' },
      goal: { uz: "Yuqori daraja sözlar + kollokatsiyalar", en: 'High-level vocabulary + collocations' } },
    { key: 'listening', icon: 'headphones', name: { uz: 'Tinglaş', en: 'Listening' },
      goal: { uz: "Tabiiy tuşuniş + IELTS aniqligi", en: 'Understand naturally + IELTS accuracy' } },
    { key: 'reading',   icon: 'doc',        name: { uz: "Öqiş", en: 'Reading' },
      goal: { uz: "Tezlik + tuşuniş + savol strategiyasi", en: 'Speed + comprehension + question strategy' } },
    { key: 'writing',   icon: 'pen',        name: { uz: 'Yoziş', en: 'Writing' },
      goal: { uz: "Band 8 tuzilma, grammatika va luğat", en: 'Band 8 organization, grammar & vocabulary' } },
    { key: 'speaking',  icon: 'mic',        name: { uz: 'Gapiriş', en: 'Speaking' },
      goal: { uz: "Ravonlik, aniqlik, talaffuz va fikr", en: 'Fluency, accuracy, pronunciation & ideas' } }
  ],

  /* ====================== 5 BOSQICH ===================================== */
  phases: [
    { n: 1, from: 1,  to: 4,
      title: { uz: 'Poydevor', en: 'Foundation' },
      goal:  { uz: "Mustahkam B2 poydevor", en: 'Strong B2 foundation' },
      note:  { uz: "Birinçi oy — IELTS hiylalarini quvişdan oldin zaifliklarni yopiş.",
               en: 'Your first month is about fixing weaknesses before aggressively chasing IELTS tricks.' } },
    { n: 2, from: 5,  to: 8,
      title: { uz: 'B2 → B2+', en: 'B2 → B2+' },
      goal:  { uz: "IELTS tayyorgarlikning markaziga çiqadi", en: 'IELTS becomes the center of your preparation' },
      note:  { uz: "Endi maşqlar IELTS formatida böladi: savol turlari, vaqt, strategiya.",
               en: 'From here on the practice follows the IELTS format: question types, timing, strategy.' } },
    { n: 3, from: 9,  to: 12,
      title: { uz: 'IELTS 7 → 7.5', en: 'IELTS 7 → 7.5' },
      goal:  { uz: "Akademik luğat va şaxsiy xatolar ustida iş", en: 'Academic vocabulary and personal error work' },
      note:  { uz: "Tayyorgarlik ança talabçan böladi. Yangi qoida emas — öz xatolaring ustida işlaş.",
               en: 'The preparation becomes much more demanding. Not new rules — work on your own mistakes.' } },
    { n: 4, from: 13, to: 16,
      title: { uz: 'Band 7.5 → 8', en: 'Band 7.5 → 8' },
      goal:  { uz: "Aniqlik bosqiçi", en: 'The precision phase' },
      note:  { uz: "Endi asosan ingliz tilini emas, IELTS Band 8 darajasida IŞLAŞNI örganasan.",
               en: "You're no longer mainly learning English. You're learning to perform at IELTS Band 8 level." } },
    { n: 5, from: 17, to: 20,
      title: { uz: 'Yakuniy hujum', en: 'Final attack' },
      goal:  { uz: "Yangi material emas — natijani optimallaştiriş", en: 'Not new material — optimizing performance' },
      note:  { uz: "Katta hajmda yangi narsa örganişni töxtatamiz. Bor bilimni imtihon natijasiga aylantiramiz.",
               en: 'We stop learning huge amounts of new material. We optimize performance.' } }
  ],

  /* ====================== HAFTALAR ======================================
     Bu ro'yxat endi YENGIL indeks: sarlavha, maqsad va mock bayrog'i.
     Haftaning to'liq mazmuni kunlarda (eng-days-*.js) yotadi.            */
  weeks: [

    /* --------- KIRISH BLOKI (0-hafta, 1–4-kun) --------- */
    {
      n: 0, phase: 0,
      title: { uz: 'Kiriş — format, ölçov, tizim', en: 'Orientation — format, baseline, system' },
      goal: { uz: "Imtihonni köriş, özingni ölçaş va öquv tizimini örnatiş.",
              en: 'See the exam, measure yourself, and install the study system.' }
    },

    /* --------- BOSQICH 1 — POYDEVOR --------- */
    {
      n: 1, phase: 1,
      title: { uz: 'Grammatikani uyğotiş + IELTS bilan tanişuv', en: 'Grammar Activation + IELTS Introduction' },
      goal: { uz: "Bilgan grammatikangni işga soliş va IELTS formatini köriş.",
              en: 'Activate the grammar you already know and see the IELTS format.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Present Simple', en: 'Present Simple' },
          { uz: 'Present Continuous', en: 'Present Continuous' },
          { uz: 'Past Simple', en: 'Past Simple' },
          { uz: 'Past Continuous', en: 'Past Continuous' },
          { uz: 'Present Perfect', en: 'Present Perfect' },
          { uz: 'Past Perfect', en: 'Past Perfect' },
          { uz: 'Kelasi zamon şakllari', en: 'Future forms' },
          { uz: "Söroq gap qurilişi", en: 'Question formation' },
          { uz: 'Ega va kesim mosligi', en: 'Subject/verb agreement' }
        ] },
        { skill: 'vocab', items: [
          { uz: "Mavzular: taʼlim, kundalik hayot, texnologiya, odamlar, joylar",
            en: 'Topics: education, daily life, technology, people, places' },
          { uz: "Yönaliş: söz → kollokatsiya → gap → nutq",
            en: 'Focus: word → collocation → sentence → speaking' }
        ] },
        { skill: 'listening', items: [
          { uz: 'IELTS Listening bilan tanişuv', en: 'IELTS Listening introduction' },
          { uz: '1-bölim (Section 1)', en: 'Section 1' },
          { uz: 'Raqamlar, ismlar, sanalar', en: 'Numbers, names, dates' },
          { uz: 'Harflab aytiş (spelling), formalar', en: 'Spelling, forms' }
        ] },
        { skill: 'reading', items: [
          { uz: 'Skimming — umumiy mazmunni ilğaş', en: 'Skimming' },
          { uz: 'Scanning — aniq maʼlumotni topiş', en: 'Scanning' },
          { uz: 'Kalit sözni joylaştiriş', en: 'Locating keywords' },
          { uz: 'Paraphrase — boşqa söz bilan aytilgan joyni taniş', en: 'Paraphrasing' }
        ] },
        { skill: 'writing', items: [
          { uz: 'IELTS yoziş tuzilmasi bilan tanişiş', en: 'Learn the IELTS structure' },
          { uz: 'Task 2: Introduction → Body 1 → Body 2 → Conclusion', en: 'Task 2: Introduction → Body 1 → Body 2 → Conclusion' },
          { uz: "Hozirça Band 8 yozişga urinma — tuzilmani özlaştir.", en: "Don't worry about producing Band 8 yet." }
        ] },
        { skill: 'speaking', items: [
          { uz: "Part 1 mavzulari: tuğilgan şahar, öqiş, oila, qiziqiş, texnologiya, döstlar",
            en: 'Part 1: hometown, studies, family, hobbies, technology, friends' },
          { uz: "Özingni yozib ol. Keyin grammatik xato, talaffuz muammosi va pauzalarni belgila.",
            en: 'Record yourself. Then identify grammar errors, pronunciation problems and pauses.' }
        ] }
      ],
      example: {
        bad: 'beneficial',
        good: 'highly beneficial · financially beneficial · beneficial to society',
        note: { uz: "Sözni yolğiz yodlama — u bilan yuradigan sözlar bilan birga yodla.",
                en: "Don't just memorize the word — learn the words that travel with it." }
      },
      tasks: [
        { uz: "9 ta zamon/qurilişni takrorlab, har biriga 5 ta öz gapingni yoz", en: 'Review the 9 structures and write 5 original sentences for each' },
        { uz: "5 mavzu böyiça 50 ta kollokatsiya daftarga yozildi", en: 'Collect 50 collocations across the 5 topics' },
        { uz: "IELTS Listening Section 1 — 3 ta maşq", en: 'IELTS Listening Section 1 — 3 practice sets' },
        { uz: "Skimming/scanning bilan 3 ta matn öqildi", en: 'Read 3 passages using skimming/scanning' },
        { uz: "Birinçi Task 2 inşo yozildi (baho muhim emas)", en: 'Write your first Task 2 essay (score does not matter yet)' },
        { uz: "Part 1 javoblari yozib olindi va tahlil qilindi", en: 'Record and analyse your Part 1 answers' }
      ]
    },

    {
      n: 2, phase: 1,
      title: { uz: 'Murakkab grammatika', en: 'Complex Grammar' },
      goal: { uz: "Oddiy gapni aniq va murakkab gapga kötariş.", en: 'Upgrade simple sentences into accurate complex ones.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Modallar (modals)', en: 'Modals' },
          { uz: 'Qiyoslaş (comparatives)', en: 'Comparatives' },
          { uz: 'Şart gaplar (conditionals)', en: 'Conditionals' },
          { uz: 'Majhul nisbat (passive voice)', en: 'Passive voice' },
          { uz: 'Relative clauses', en: 'Relative clauses' },
          { uz: 'Gerund va infinitiv', en: 'Gerunds/infinitives' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Topic sentence — abzatsning asosiy gapi', en: 'Topic sentences' },
          { uz: "Qöllab-quvvatlovçi fikrlar", en: 'Supporting ideas' },
          { uz: 'Misollar', en: 'Examples' },
          { uz: 'Tuşuntiriş', en: 'Explanations' },
          { uz: "Fikrlarni boğlaş", en: 'Linking ideas' }
        ] },
        { skill: 'speaking', items: [
          { uz: 'Part 2 — kartoçka javoblari', en: 'Part 2 — cue card answers' },
          { uz: '1 daqiqa tayyorgarlik + 2 daqiqa javob tizimi', en: 'The 1-minute preparation + 2-minute response system' }
        ] }
      ],
      example: {
        bad: 'People should protect the environment.',
        good: 'Governments should implement stricter environmental policies in order to reduce long-term ecological damage.',
        note: { uz: "Lekin esda tut: murakkab ≠ çalkaş. IELTS ANIQ murakkablikni xohlaydi.",
                en: 'But remember: complex does not mean complicated. IELTS wants accurate complexity.' }
      },
      tasks: [
        { uz: "6 ta grammatik mavzu böyiça maşqlar bajarildi", en: 'Complete exercises for all 6 grammar areas' },
        { uz: "10 ta oddiy gap murakkab gapga kötarildi", en: 'Upgrade 10 simple sentences into complex ones' },
        { uz: "1 ta Task 2 inşo — topic sentence tuzilmasi bilan", en: 'One Task 2 essay built on topic sentences' },
        { uz: "Part 2 — 5 ta kartoçka, har biri yozib olindi", en: 'Part 2 — 5 cue cards, each recorded' }
      ]
    },

    {
      n: 3, phase: 1,
      title: { uz: 'Gap qurilişini çuqurlaştiriş', en: 'Advanced Sentence Building' },
      goal: { uz: "Uzun gapni boşqariş va öz inşongni özing tahrirlaş.",
              en: 'Control long sentences and learn to edit your own essays.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: 'Qöşma gaplar', en: 'Complex sentences' },
          { uz: 'Noun clauses', en: 'Noun clauses' },
          { uz: 'Adjective clauses', en: 'Adjective clauses' },
          { uz: 'Adverb clauses', en: 'Adverb clauses' },
          { uz: 'Participle clauses', en: 'Participle clauses' },
          { uz: 'Boğlovçilar', en: 'Conjunctions' },
          { uz: 'Tiniş belgilari', en: 'Punctuation' }
        ] },
        { skill: 'vocab', items: [
          { uz: 'Atrof-muhit', en: 'Environment' },
          { uz: "Soğliq", en: 'Health' },
          { uz: 'Jinoyat', en: 'Crime' },
          { uz: 'Hukumat', en: 'Government' },
          { uz: 'Jamiyat', en: 'Society' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Bu hafta 2 ta Task 2 inşo yoz', en: 'Write 2 Task 2 essays this week' },
          { uz: '1. Grammatik xatolarni top', en: '1. Find grammar mistakes' },
          { uz: "2. Takrorlangan sözlarni top", en: '2. Find repeated vocabulary' },
          { uz: '3. Zaif gaplarni top', en: '3. Find weak sentences' },
          { uz: '4. Ularni qayta yoz', en: '4. Rewrite them' },
          { uz: '5. Yaxşilangan variantni yoz', en: '5. Write the improved version' }
        ] }
      ],
      tasks: [
        { uz: "7 xil clause turiga misol yozildi", en: 'Write examples for all 7 clause types' },
        { uz: "5 mavzu böyiça 60–75 ta söz/kollokatsiya", en: '60–75 words/collocations across the 5 topics' },
        { uz: "2 ta Task 2 inşo yozildi", en: 'Write 2 Task 2 essays' },
        { uz: "Har ikkala inşo 5 qadamli tahrirdan ötkazildi", en: 'Run both essays through the 5-step rewrite' }
      ]
    },

    {
      n: 4, phase: 1, mock: true,
      title: { uz: 'BIRINÇI NAZORAT — töliq mock', en: 'FIRST CHECKPOINT — full mock' },
      goal: { uz: "Boşlanğiç nuqtani aniq ölçaş.", en: 'Measure your starting point precisely.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Töliq Listening testi (vaqt bilan)", en: 'Full Listening test, timed' }] },
        { skill: 'reading',   items: [{ uz: "Töliq Reading testi — 60 daqiqa", en: 'Full Reading test — 60 minutes' }] },
        { skill: 'writing',   items: [{ uz: 'Task 1 + Task 2 — 60 daqiqa', en: 'Task 1 + Task 2 — 60 minutes' }] },
        { skill: 'speaking',  items: [{ uz: "Part 1 + 2 + 3 — yozib olingan holda", en: 'Part 1 + 2 + 3, recorded' }] }
      ],
      example: {
        note: { uz: "Ball past çiqsa xafa bölma — bu boşlanğiç ölçov. Ideal: 6.0–6.5+. Pastroq bölsa, NEGA past ekanini aniq topamiz.",
                en: "Don't worry if your score is low — we're measuring your starting point. Ideally 6.0–6.5+. If you're below that, we identify exactly why." }
      },
      tasks: [
        { uz: "Töliq mock bajarildi (L + R + W + S)", en: 'Complete the full mock (L + R + W + S)' },
        { uz: "Har bölim böyiça xato tahlili yozildi", en: 'Write an error analysis for each section' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 2 — B2 → B2+ --------- */
    {
      n: 5, phase: 2,
      title: { uz: 'Listening + Reading aniqligi', en: 'Listening + Reading Accuracy' },
      goal: { uz: "Savol turlarini taniş va tuzoqlarni köriş.", en: 'Recognise question types and spot the traps.' },
      blocks: [
        { skill: 'listening', items: [
          { uz: "1–2-bölimlar", en: 'Sections 1–2' },
          { uz: 'Prediction — javobni oldindan taxmin qiliş', en: 'Prediction' },
          { uz: "Kalit sözlar", en: 'Keywords' },
          { uz: 'Paraphrase', en: 'Paraphrases' },
          { uz: 'Distractor — çalğituvçi javoblar', en: 'Distractors' }
        ] },
        { skill: 'reading', items: [
          { uz: 'True / False / Not Given', en: 'True/False/Not Given' },
          { uz: 'Matçing headings', en: 'Matching headings' },
          { uz: 'Multiple çoice', en: 'Multiple choice' },
          { uz: 'Sentence completion', en: 'Sentence completion' }
        ] },
        { skill: 'writing', items: [
          { uz: 'Task 1: kiriş', en: 'Task 1: introduction' },
          { uz: 'Overview — umumiy manzara', en: 'Overview' },
          { uz: 'Taqqoslaş', en: 'Comparisons' },
          { uz: 'Tendensiyalar (trends)', en: 'Trends' },
          { uz: 'Raqam tili (data language)', en: 'Data language' }
        ] }
      ],
      example: {
        good: 'increased significantly · declined gradually · remained stable · reached a peak',
        note: { uz: "Task 1 da raqamni takrorlaş emas — harakatni tasvirlaş kerak.",
                en: "Task 1 isn't about repeating numbers — it's about describing movement." }
      },
      tasks: [
        { uz: "Listening Section 1–2 — 5 ta maşq", en: 'Listening Sections 1–2 — 5 practice sets' },
        { uz: "4 xil savol turidan har biriga 3 tadan maşq", en: '3 practice sets for each of the 4 question types' },
        { uz: "2 ta Task 1 yozildi", en: 'Write 2 Task 1 reports' },
        { uz: "Data language röyxati tuzildi va işlatildi", en: 'Build and use a data-language list' }
      ]
    },

    {
      n: 6, phase: 2,
      title: { uz: 'Gapirişda ravonlik', en: 'Speaking Fluency' },
      goal: { uz: "Qisqa javobdan tabiiy, kengaytirilgan javobga ötiş.", en: 'Move from short answers to natural, extended ones.' },
      blocks: [
        { skill: 'speaking', items: [
          { uz: 'Part 1 — tabiiy javob ber, quruq javobdan qoç', en: 'Part 1 — answer naturally, avoid flat answers' },
          { uz: 'Part 2 — Introduction → Background → Main details → Personal reaction', en: 'Part 2 — Introduction → Background → Main details → Personal reaction' },
          { uz: 'Part 3 — tuşuntiriş, qiyoslaş, taxmin, asoslaş, misol', en: 'Part 3 — explain, compare, speculate, justify, give examples' },
          { uz: 'Part 3 qolipi: Opinion → Reason → Explanation → Example → Result', en: 'Part 3 structure: Opinion → Reason → Explanation → Example → Result' }
        ] }
      ],
      example: {
        bad: "Yes, I do. Because it's good.",
        good: 'Yes, definitely. I particularly enjoy it because…',
        note: { uz: "Bu hafta oğirlik gapirişda. Har kuni yozib ol va tinglab çiq.",
                en: 'This week has a heavy speaking focus. Record and listen back every day.' }
      },
      tasks: [
        { uz: "Part 1 — 20 ta savolga kengaytirilgan javob", en: 'Part 1 — extended answers to 20 questions' },
        { uz: "Part 2 — 7 ta kartoçka, 2 daqiqadan", en: 'Part 2 — 7 cue cards, 2 minutes each' },
        { uz: "Part 3 — 10 ta savol ORPER qolipida", en: 'Part 3 — 10 questions using the Opinion→Result structure' },
        { uz: "Har kuni kamida 30 daqiqa gapirildi", en: 'Speak at least 30 minutes every day' }
      ]
    },

    {
      n: 7, phase: 2,
      title: { uz: 'Task 2 ustasi', en: 'Task 2 Mastery' },
      goal: { uz: "Beşta inşo turini ham işonç bilan yoziş.", en: 'Write all five essay types with confidence.' },
      blocks: [
        { skill: 'writing', items: [
          { uz: '1. Opinion (fikr)', en: '1. Opinion' },
          { uz: '2. Discussion (muhokama)', en: '2. Discussion' },
          { uz: '3. Advantages / disadvantages', en: '3. Advantages/disadvantages' },
          { uz: '4. Problem / solution', en: '4. Problem/solution' },
          { uz: '5. Two-part question', en: '5. Two-part questions' },
          { uz: "Jarayon: savolni tuşun → fikr yiğ → tartibla → yoz → tekşir",
            en: 'Process: understand the question → generate ideas → organize → write → check' }
        ] }
      ],
      tasks: [
        { uz: "5 ta inşo turining tuzilmasi yozib olindi", en: 'Write out the structure of all 5 essay types' },
        { uz: "3 ta Task 2 inşo yozildi", en: 'Write 3 Task 2 essays' },
        { uz: "Har inşo PLAN→WRITE→ÇECK→ANALYZE→REWRITE siklidan ötdi", en: 'Run each essay through PLAN→WRITE→CHECK→ANALYZE→REWRITE' }
      ]
    },

    {
      n: 8, phase: 2, mock: true,
      title: { uz: 'IKKINÇI MOCK', en: 'SECOND MOCK' },
      goal: { uz: "Har bölimda ballni QAYERDA yöqotayotganingni aniqlaş.", en: 'Find exactly where you lose marks in each section.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Qaysi bölimda ball yöqotding?", en: 'Where did you lose marks?' }] },
        { skill: 'reading',   items: [{ uz: 'Qaysi savol turida?', en: 'Which question types?' }] },
        { skill: 'writing',   items: [
          { uz: 'Task Response', en: 'Task Response' },
          { uz: 'Coherence & Cohesion', en: 'Coherence & Cohesion' },
          { uz: 'Lexical Resource', en: 'Lexical Resource' },
          { uz: 'Grammatical Range & Accuracy', en: 'Grammatical Range & Accuracy' }
        ] },
        { skill: 'speaking',  items: [
          { uz: 'Ravonlik', en: 'Fluency' },
          { uz: "Luğat", en: 'Vocabulary' },
          { uz: 'Grammatika', en: 'Grammar' },
          { uz: 'Talaffuz', en: 'Pronunciation' }
        ] }
      ],
      tasks: [
        { uz: "Töliq IELTS simulyatsiyasi bajarildi", en: 'Complete a full IELTS simulation' },
        { uz: "Har bölim uçun eng zaif nuqta yozildi", en: 'Write down the weakest point for each section' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 3 — IELTS 7 → 7.5 --------- */
    {
      n: 9, phase: 3,
      title: { uz: "Akademik luğat", en: 'Academic Vocabulary' },
      goal: { uz: "Kuniga 10–15 ta foydali söz — va ularni IŞLATIŞ.", en: '10–15 useful words a day — and actually using them.' },
      blocks: [
        { skill: 'vocab', items: [
          { uz: 'Iqtisod', en: 'Economy' },
          { uz: 'Fan', en: 'Science' },
          { uz: 'Texnologiya', en: 'Technology' },
          { uz: "Taʼlim", en: 'Education' },
          { uz: 'Atrof-muhit', en: 'Environment' },
          { uz: 'Globallaşuv', en: 'Globalization' },
          { uz: 'Madaniyat', en: 'Culture' },
          { uz: 'Media', en: 'Media' },
          { uz: 'Bandlik', en: 'Employment' }
        ] }
      ],
      example: {
        bad: "Kuniga 100 ta so'z yodlash",
        good: "Kuniga 10–15 ta so'z/kollokatsiya — keyin ularni gapirishda va yozishda ishlatish",
        note: { uz: "Işlatilmagan söz — örganilmagan söz.", en: 'A word you never use is a word you never learned.' }
      },
      tasks: [
        { uz: "9 mavzu böyiça 70–105 ta söz/kollokatsiya", en: '70–105 words/collocations across the 9 topics' },
        { uz: "Har bir söz gapda işlatildi", en: 'Use every word in a sentence' },
        { uz: "Yangi sözlar gapirişda işlatildi", en: 'Use the new words while speaking' },
        { uz: "Yangi sözlar 2 ta inşoda işlatildi", en: 'Use the new words in 2 essays' }
      ]
    },

    {
      n: 10, phase: 3,
      title: { uz: 'Band 7+ uçun grammatika', en: 'Grammar for Band 7+' },
      goal: { uz: "Yangi qoida emas — ŞAXSIY xatolar röyxati va ularni yopiş.",
              en: 'Not new rules — your personal error log, and closing those errors.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: "50 ta yangi qoida örniga — öz xatolaringni aniqla", en: 'Instead of 50 new rules, identify your personal mistakes' },
          { uz: "XATOLAR DAFTARI tuz: xato → töğrisi", en: 'Create an ERROR LOG: mistake → correction' },
          { uz: 'people is → people are', en: 'people is → people are' },
          { uz: 'he go → he goes', en: 'he go → he goes' },
          { uz: 'informations → information', en: 'informations → information' },
          { uz: 'more easier → easier', en: 'more easier → easier' },
          { uz: "Har hafta: körib çiq → test qil → işlat", en: 'Every week: review → test → use' }
        ] }
      ],
      tasks: [
        { uz: "Şaxsiy xatolar daftari tuzildi", en: 'Build your personal error log' },
        { uz: "Eng köp takrorlanadigan 10 ta xato ajratildi", en: 'Isolate your 10 most frequent mistakes' },
        { uz: "Har bir xatoga qarşi 10 tadan gap yozildi", en: 'Write 10 sentences against each mistake' },
        { uz: "Hafta oxirida öz-özini test qildi", en: 'Self-test at the end of the week' }
      ]
    },

    {
      n: 11, phase: 3,
      title: { uz: "Öqiş tezligi", en: 'Reading Speed' },
      goal: { uz: "60 daqiqa / 40 savol — bitta savolga tiqilib qolmaslik.",
              en: '60 minutes / 40 questions — never get stuck on one question.' },
      blocks: [
        { skill: 'reading', items: [
          { uz: 'Paraphrase-ni taniş', en: 'Paraphrase recognition' },
          { uz: 'Inference — bevosita aytilmagan xulosa', en: 'Inference' },
          { uz: 'Muallif fikri', en: "Author's opinion" },
          { uz: "Kontekstdan qiyin söz maʼnosini çiqariş", en: 'Difficult vocabulary from context' },
          { uz: 'Dalilni matndan topiş', en: 'Locating evidence' }
        ] }
      ],
      tasks: [
        { uz: "3 ta töliq Reading testi — vaqt bilan", en: '3 full Reading tests, timed' },
        { uz: "Har testda 1 ta savolga sarflangan maksimal vaqt belgilandi", en: 'Set a maximum time per question and hold to it' },
        { uz: "Notöğri javoblar uçun matndagi dalil topildi", en: 'Find the passage evidence for every wrong answer' }
      ]
    },

    {
      n: 12, phase: 3, mock: true,
      title: { uz: 'UÇINÇI MOCK', en: 'THIRD MOCK' },
      goal: { uz: "Maqsad — 7.0–7.5 atrofi.", en: 'Target around 7.0–7.5.' },
      blocks: [
        { skill: 'reading', items: [{ uz: "Töliq test, real vaqt", en: 'Full test, real timing' }] },
        { skill: 'listening', items: [{ uz: "Töliq test, real vaqt", en: 'Full test, real timing' }] },
        { skill: 'writing', items: [{ uz: 'Task 1 + Task 2 — 60 daqiqa', en: 'Task 1 + Task 2 — 60 minutes' }] },
        { skill: 'speaking', items: [{ uz: "Töliq Speaking, yozib olingan", en: 'Full Speaking, recorded' }] }
      ],
      example: {
        note: { uz: "Agar hali 6.0 atrofida bölsang — köproq test işlaş yeçim emas. Eng zaif könikmaga qaytib, uni tuzat.",
                en: "If you're still around 6.0, don't simply do more tests. Return to the weakest skill." }
      },
      tasks: [
        { uz: "Töliq mock bajarildi", en: 'Complete the full mock' },
        { uz: "4-hafta natijasi bilan taqqoslandi", en: 'Compare against the week-4 result' },
        { uz: "Eng zaif könikma uçun reja tuzildi", en: 'Make a plan for the weakest skill' }
      ]
    },

    /* --------- BOSQICH 4 — BAND 7.5 → 8 --------- */
    {
      n: 13, phase: 4,
      title: { uz: 'Band 8 darajasida yoziş', en: 'Band 8 Writing' },
      goal: { uz: "Tört mezonning har birini ongli boşqariş.", en: 'Consciously control all four criteria.' },
      blocks: [
        { skill: 'writing', items: [
          { uz: 'Task Response — savolning HAR qismiga javob ber', en: 'Task Response — answer every part of the question' },
          { uz: 'Coherence — fikrlar mantiqiy oqsin', en: 'Coherence — ideas must flow logically' },
          { uz: "Vocabulary — aniq sözni tabiiy işlat", en: 'Vocabulary — use precise vocabulary naturally' },
          { uz: 'Grammar — turli qurilma, kam xato', en: 'Grammar — variety of structures with few errors' }
        ] }
      ],
      example: {
        bad: 'Iloji boricha eng qiyin so\'zlarni ishlatish',
        good: "Aytmoqchi bo'lgan fikringni aniq va tabiiy ifodalash",
        note: { uz: "Maqsad — çiroyli köriniş emas, aniq maʼno.", en: "The goal isn't to look impressive — it's to mean exactly what you say." }
      },
      tasks: [
        { uz: "4 ta Task 2 inşo — har biri mezon böyiça baholandi", en: '4 Task 2 essays, each scored against the criteria' },
        { uz: "2 ta Task 1 yozildi", en: 'Write 2 Task 1 reports' },
        { uz: "Har inşo uçun 4 mezon böyiça öz-özini baholaş", en: 'Self-assess every essay on all 4 criteria' }
      ]
    },

    {
      n: 14, phase: 4,
      title: { uz: 'Band 8 darajasida gapiriş', en: 'Band 8 Speaking' },
      goal: { uz: "Mazmunli javob + talaffuz nazorati.", en: 'Sophisticated answers plus pronunciation control.' },
      blocks: [
        { skill: 'speaking', items: [
          { uz: 'Part 1 — tabiiy, kengaytirilgan javob', en: 'Part 1 — natural, extended answers' },
          { uz: "Part 2 — 2 daqiqa uzluksiz gapiriş", en: 'Part 2 — speak continuously for around 2 minutes' },
          { uz: 'Part 3 — Claim → Explanation → Example → Contrast/Result', en: 'Part 3 — Claim → Explanation → Example → Contrast/Result' },
          { uz: 'Talaffuz', en: 'Pronunciation' },
          { uz: "Urğu (stress)", en: 'Stress' },
          { uz: 'Intonatsiya', en: 'Intonation' },
          { uz: "Boğlangan nutq (connected speeç)", en: 'Connected speech' },
          { uz: 'Ikkilanişni nazorat qiliş', en: 'Hesitation control' }
        ] }
      ],
      tasks: [
        { uz: "Part 2 — 10 ta kartoçka, heç töxtamasdan 2 daqiqa", en: 'Part 2 — 10 cue cards, a full 2 minutes without stopping' },
        { uz: "Part 3 — 15 ta savol CEEC qolipida", en: 'Part 3 — 15 questions using the Claim→Result structure' },
        { uz: "Talaffuz: har kuni 10 daqiqa shadowing", en: 'Pronunciation: 10 minutes of shadowing daily' },
        { uz: "Har kuni 30 daqiqa gapirildi", en: 'Speak 30 minutes every day' }
      ]
    },

    {
      n: 15, phase: 4,
      title: { uz: "Töliq IELTS maşğuloti", en: 'Full IELTS Training' },
      goal: { uz: "Vaqt bilan muntazam töliq testlar.", en: 'Regular timed full tests.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Haftasiga 2–3 ta töliq test", en: '2–3 full tests per week' }] },
        { skill: 'reading',   items: [{ uz: "Haftasiga 2–3 ta töliq test", en: '2–3 full tests per week' }] },
        { skill: 'writing',   items: [{ uz: 'Haftasiga 3 ta yoziş sessiyasi', en: '3 writing sessions per week' }] },
        { skill: 'speaking',  items: [{ uz: 'Kuniga 30 daqiqa', en: '30 minutes per day' }] }
      ],
      tasks: [
        { uz: "2–3 ta töliq Listening testi", en: '2–3 full Listening tests' },
        { uz: "2–3 ta töliq Reading testi", en: '2–3 full Reading tests' },
        { uz: "3 ta yoziş sessiyasi", en: '3 writing sessions' },
        { uz: "Har kuni 30 daqiqa gapiriş", en: '30 minutes of speaking every day' }
      ]
    },

    {
      n: 16, phase: 4, mock: true,
      title: { uz: "TÖRTINÇI MOCK — eng katta nazorat", en: 'FOURTH MOCK — the biggest checkpoint' },
      goal: { uz: "Ideal: L 8+ · R 8+ · W 7–8 · S 7.5–8", en: 'Ideal: L 8+ · R 8+ · W 7–8 · S 7.5–8' },
      blocks: [
        { skill: 'listening', items: [{ uz: 'Maqsad: 8.0+', en: 'Target: 8.0+' }] },
        { skill: 'reading',   items: [{ uz: 'Maqsad: 8.0+', en: 'Target: 8.0+' }] },
        { skill: 'writing',   items: [{ uz: 'Maqsad: 7.0–8.0', en: 'Target: 7.0–8.0' }] },
        { skill: 'speaking',  items: [{ uz: 'Maqsad: 7.5–8.0', en: 'Target: 7.5–8.0' }] }
      ],
      example: {
        note: { uz: "Umumiy ball törtala bölim örtaçasidan çiqadi — bitta zaif bölim hammasini pastga tortadi.",
                en: 'Your overall score is calculated from all four sections — one weak section pulls everything down.' }
      },
      tasks: [
        { uz: "Töliq mock bajarildi", en: 'Complete the full mock' },
        { uz: "Umumiy ball hisoblandi", en: 'Calculate the overall band' },
        { uz: "Natija jadvalga kiritildi", en: 'Record the result in the scoreboard' }
      ]
    },

    /* --------- BOSQICH 5 — YAKUNIY HUJUM --------- */
    {
      n: 17, phase: 5,
      title: { uz: 'Zaifliklarni yöq qiliş', en: 'Weakness Elimination' },
      goal: { uz: "Oldingi testlardan eng köp takrorlangan 10 ta xatoni topib, aynan ularga hujum qiliş.",
              en: 'Find your top 10 recurring mistakes from previous tests and attack exactly those.' },
      blocks: [
        { skill: 'grammar', items: [
          { uz: '1. Artikllar (a / an / the)', en: '1. Articles' },
          { uz: '2. Predloglar', en: '2. Prepositions' },
          { uz: '3. Ega–kesim mosligi', en: '3. Verb agreement' },
          { uz: '4. Zamonlar', en: '4. Tenses' }
        ] },
        { skill: 'writing', items: [
          { uz: "5. Söz takrori", en: '5. Word repetition' },
          { uz: '6. Zaif kiriş qismi', en: '6. Weak introductions' },
          { uz: '7. Yomon misollar', en: '7. Poor examples' }
        ] },
        { skill: 'listening', items: [{ uz: '8. Listening — imlo xatolari', en: '8. Listening spelling' }] },
        { skill: 'reading',   items: [{ uz: '9. Reading — vaqt taqsimoti', en: '9. Reading timing' }] },
        { skill: 'speaking',  items: [{ uz: '10. Speaking — ikkilaniş', en: '10. Speaking hesitation' }] }
      ],
      tasks: [
        { uz: "Oldingi 4 ta mock qayta körib çiqildi", en: 'Review all 4 previous mocks' },
        { uz: "Top 10 takrorlanuvçi xato röyxati tuzildi", en: 'Build the top-10 recurring mistake list' },
        { uz: "Har bir xatoga qarşi maqsadli maşq bajarildi", en: 'Do targeted practice against each mistake' }
      ]
    },

    {
      n: 18, phase: 5, mock: true,
      title: { uz: "Töliq imtihon simulyatsiyasi", en: 'Full Exam Simulation' },
      goal: { uz: "2 ta töliq simulyatsiya — real imtihon şaroitida.", en: 'Two complete simulations under real exam conditions.' },
      blocks: [
        { skill: 'listening', items: [
          { uz: 'Real vaqt bilan', en: 'Real timing' },
          { uz: 'Telefon yöq', en: 'No phone' },
          { uz: "Luğat yöq", en: 'No dictionary' },
          { uz: 'Pauza yöq', en: 'No pauses' }
        ] },
        { skill: 'reading', items: [{ uz: "Haqiqiy imtihondek munosabatda böl", en: 'Treat it like the real examination' }] }
      ],
      tasks: [
        { uz: "1-simulyatsiya bajarildi", en: 'Complete simulation 1' },
        { uz: "2-simulyatsiya bajarildi", en: 'Complete simulation 2' },
        { uz: "Ikkalasi ham xato tahlilidan ötkazildi", en: 'Run an error analysis on both' }
      ]
    },

    {
      n: 19, phase: 5,
      title: { uz: 'Yakuniy sozlaş', en: 'Final Optimization' },
      goal: { uz: "Yangi material emas — aniqlikni oşiriş.", en: 'No new material — sharpening accuracy.' },
      blocks: [
        { skill: 'listening', items: [{ uz: "Takrorlanuvçi xatolaringga eʼtibor ber", en: 'Focus on your recurring mistakes' }] },
        { skill: 'reading',   items: [{ uz: 'Vaqtni mukammal boşqar', en: 'Perfect your timing' }] },
        { skill: 'writing',   items: [
          { uz: 'Fikrlar', en: 'Ideas' },
          { uz: 'Tuzilma', en: 'Structure' },
          { uz: 'Grammatika', en: 'Grammar' },
          { uz: "Luğat", en: 'Vocabulary' },
          { uz: 'Qayta öqib tekşiriş (proofreading)', en: 'Proofreading' }
        ] },
        { skill: 'speaking',  items: [{ uz: "Har kuni gapir. Özingni yozib ol.", en: 'Daily speaking. Record yourself.' }] }
      ],
      tasks: [
        { uz: "Xatolar daftari töliq körib çiqildi", en: 'Review the full error log' },
        { uz: "2 ta vaqt bilan Writing testi", en: '2 timed Writing tests' },
        { uz: "Har kuni Speaking + yozib oliş", en: 'Daily speaking with recording' }
      ]
    },

    {
      n: 20, phase: 5,
      title: { uz: 'IMTIHON REJIMI', en: 'EXAM MODE' },
      goal: { uz: "Miyani çarçatma — ötkir tut.", en: "Don't overload yourself — keep your brain sharp." },
      blocks: [
        { skill: 'grammar', items: [{ uz: "Yengil takror", en: 'Light review' }] },
        { skill: 'reading', items: [{ uz: "Töliq simulyatsiyalar", en: 'Full simulations' }] },
        { skill: 'writing', items: [{ uz: 'Xato ustida iş', en: 'Error correction' }] },
        { skill: 'speaking', items: [{ uz: 'Har kuni gapiriş', en: 'Daily speaking' }] }
      ],
      example: {
        bad: "Oxirgi kunlarda 500 ta yangi so'z yodlash",
        good: "Yengil takror + simulyatsiya + xato ustida ish + gapirish",
        note: { uz: "Oxirgi kunlar — miyani ötkir saqlaş uçun, tiqiştiriş uçun emas.",
                en: 'The final days are about keeping your brain sharp. Not cramming 500 new words.' }
      },
      tasks: [
        { uz: "Yengil takror rejimiga ötildi", en: 'Switch into light-review mode' },
        { uz: "1–2 ta töliq simulyatsiya", en: '1–2 full simulations' },
        { uz: "Uyqu tartibi imtihon vaqtiga moslandi", en: 'Align your sleep with the exam schedule' },
        { uz: "Imtihon hujjatlari va joyi tekşirildi", en: 'Check exam documents and venue' }
      ]
    }
  ],

  /* ====================== KUNLIK TARTIB ================================= */
  daily: [
    {
      key: 'heavy',
      days: { uz: 'Duşanba / Çorşanba / Juma', en: 'Monday / Wednesday / Friday' },
      note: { uz: "Oğir mustaqil iş kunlari — LC yöq.", en: 'Heavy self-study days — no class.' },
      total: '4h 20m',
      rows: [
        { when: { uz: 'Ertalab', en: 'Morning' },     skill: 'grammar',   min: 40, what: { uz: "Qoida + maşq + öz gaplaring", en: 'Study + exercises + active sentences' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'vocab',     min: 40, what: { uz: "10–15 ta söz/kollokatsiya", en: '10–15 words/collocations' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'listening', min: 45, what: { uz: 'IELTS + transkript tahlili', en: 'IELTS + transcript analysis' } },
        { when: { uz: 'Keyin', en: 'Next' },          skill: 'reading',   min: 45, what: { uz: 'Vaqt bilan öqiş', en: 'Timed reading' } },
        { when: { uz: 'Keçqurun', en: 'Evening' },   skill: 'writing',   min: 60, what: { uz: 'Task 1 yoki Task 2', en: 'Task 1 or Task 2' } },
        { when: { uz: 'Uyqudan oldin', en: 'Before bed' }, skill: 'speaking', min: 30, what: { uz: "Özingni yozib ol", en: 'Record yourself' } }
      ]
    },
    {
      key: 'class',
      days: { uz: 'Seşanba / Payşanba / Şanba', en: 'Tuesday / Thursday / Saturday' },
      note: { uz: "Everest LC 16:30–18:30 — şuning uçun mustaqil yuk yengilroq.", en: 'Everest LC 16:30–18:30 — so the self-study load is lighter.' },
      total: '2h 05m',
      rows: [
        { when: { uz: 'Darsdan oldin', en: 'Before class' }, skill: 'grammar',   min: 45, what: { uz: "Grammatika / luğat", en: 'Grammar / vocabulary' } },
        { when: { uz: 'Darsdan keyin', en: 'After class' },  skill: 'listening', min: 30, what: { uz: 'IELTS listening', en: 'IELTS listening' } },
        { when: { uz: 'Keyinroq', en: 'Later' },             skill: 'speaking',  min: 30, what: { uz: 'Gapiriş + yozib oliş', en: 'Speaking + recording' } },
        { when: { uz: 'Qisqa takror', en: 'Quick review' },  skill: 'vocab',     min: 20, what: { uz: "LC da örganganingni takrorla", en: 'Review what you learned at LC' } }
      ]
    },
    {
      key: 'sunday',
      days: { uz: 'Yakşanba', en: 'Sunday' },
      note: { uz: "Test + tahlil kuni. Bu kun juda muhim.", en: 'Test + review day. Extremely important.' },
      total: '3h+',
      rows: [
        { when: { uz: 'Ertalab', en: 'Morning' },   skill: 'listening', min: 40, what: { uz: 'Listening testi', en: 'Listening test' } },
        { when: { uz: 'Tuşdan keyin', en: 'Afternoon' }, skill: 'reading', min: 60, what: { uz: 'Reading testi', en: 'Reading test' } },
        { when: { uz: 'Keçqurun', en: 'Evening' }, skill: 'writing',   min: 60, what: { uz: 'Yoziş', en: 'Writing' } },
        { when: { uz: 'Yakunda', en: 'Then' },      skill: 'grammar',   min: 40, what: { uz: 'XATO TAHLILI — "nega xato qildim?"', en: 'ERROR ANALYSIS — "why did I get this wrong?"' } }
      ]
    }
  ],

  /* ====================== METODLAR ====================================== */
  systems: [
    {
      skill: 'grammar',
      title: { uz: 'Grammatika dasturi', en: 'Grammar program' },
      intro: { uz: "Grammatikani bilasan, lekin işlata olmayapsan — muammo şu. Bu tizim passiv grammatikani aktiv grammatikaga aylantiradi.",
               en: 'You know grammar but struggle to activate it. This system turns passive grammar into active grammar.' },
      steps: [
        { t: { uz: "Örgan", en: 'Learn' },      d: { uz: 'Qoidani tuşun.', en: 'Understand the rule.' } },
        { t: { uz: 'Maşq qil', en: 'Practice' }, d: { uz: 'Maşqlarni bajar.', en: 'Complete exercises.' } },
        { t: { uz: 'Yarat', en: 'Create' },      d: { uz: "5–10 ta öz gapingni yoz.", en: 'Write 5–10 original sentences.' } },
        { t: { uz: 'Gapir', en: 'Speak' },       d: { uz: 'Javob berayotganda şu grammatikani işlat.', en: 'Use that grammar while answering questions.' } },
        { t: { uz: 'Yoz', en: 'Write' },         d: { uz: 'IELTS inşoda işlat.', en: 'Use it in IELTS writing.' } },
        { t: { uz: 'Tuzat', en: 'Correct' },     d: { uz: 'Xatolaringni top.', en: 'Find your mistakes.' } },
        { t: { uz: 'Takrorla', en: 'Repeat' },   d: { uz: 'Sikl yopiladi — grammatika aktivlaşadi.', en: 'The loop closes — the grammar becomes active.' } }
      ]
    },
    {
      skill: 'vocab',
      title: { uz: "Luğat tizimi", en: 'Vocabulary system' },
      intro: { uz: "Heç qaçon şunday qilma: söz → tarjima → yodla → unut.",
               en: 'Never do this: word → translation → memorize → forget.' },
      steps: [
        { t: { uz: "SÖZ", en: 'WORD' },                d: { uz: 'significant', en: 'significant' } },
        { t: { uz: 'KOLLOKATSIYA', en: 'COLLOCATIONS' }, d: { uz: 'significant increase · significant impact · significant difference · highly significant', en: 'significant increase · significant impact · significant difference · highly significant' } },
        { t: { uz: 'GAP', en: 'SENTENCE' },             d: { uz: 'Teçnology has had a significant impact on the way people communicate.', en: 'Technology has had a significant impact on the way people communicate.' } },
        { t: { uz: 'GAPIRIŞ', en: 'SPEAKING' },        d: { uz: 'Tabiiy işlat.', en: 'Use it naturally.' } },
        { t: { uz: 'YOZIŞ', en: 'WRITING' },           d: { uz: "Örni kelganda işlat.", en: 'Use it when appropriate.' } }
      ]
    },
    {
      skill: 'listening',
      title: { uz: 'Tinglaş tizimi', en: 'Listening system' },
      intro: { uz: "Faqat test işlaş yetarli emas — har yozuvni oltita qadamdan ötkaz.",
               en: "Don't only take tests — run every recording through six steps." },
      steps: [
        { t: { uz: 'Tingla', en: 'Listen' },        d: { uz: 'Oddiy tuşuniş uçun.', en: 'Understand normally.' } },
        { t: { uz: 'Test', en: 'Test' },            d: { uz: 'Savollarga javob ber.', en: 'Answer questions.' } },
        { t: { uz: 'Tekşir', en: 'Check' },        d: { uz: 'Xatolarni top.', en: 'Find mistakes.' } },
        { t: { uz: 'Transkript', en: 'Transcript' }, d: { uz: "Aynan nimani eşitmaganingni top.", en: 'Find exactly what you missed.' } },
        { t: { uz: 'Shadowing', en: 'Shadow' },     d: { uz: 'Notiq ortidan takrorla.', en: 'Repeat after the speaker.' } },
        { t: { uz: 'Qayta tingla', en: 'Listen again' }, d: { uz: 'Ikkinçi marta ança köp tuşunasan.', en: 'You should understand much more the second time.' } }
      ]
    },
    {
      skill: 'reading',
      title: { uz: "Öqiş tizimi", en: 'Reading system' },
      intro: { uz: "IELTS savoli köpinça matndagi sözni AYNAN işlatmaydi — şuning uçun paraphrase eng muhim qadam.",
               en: "The question often doesn't use the exact words from the passage — that's why paraphrase is the key step." },
      steps: [
        { t: { uz: 'Birinçi', en: 'First' },   d: { uz: 'Umumiy maʼnoni tuşun.', en: 'Understand the overall meaning.' } },
        { t: { uz: 'Ikkinçi', en: 'Second' },  d: { uz: 'Har abzatsning vazifasini aniqla.', en: 'Identify paragraph purposes.' } },
        { t: { uz: 'Uçinçi', en: 'Third' },   d: { uz: 'Dalilni top.', en: 'Find evidence.' } },
        { t: { uz: "Törtinçi", en: 'Fourth' }, d: { uz: "Luğatni tahlil qil.", en: 'Analyze vocabulary.' } },
        { t: { uz: 'Beşinçi', en: 'Fifth' },  d: { uz: "Paraphraseʼlarni örgan.", en: 'Study paraphrases.' } }
      ]
    },
    {
      skill: 'writing',
      title: { uz: 'Yoziş tizimi', en: 'Writing system' },
      intro: { uz: "Inşo tugagaç darhol keyingisiga ötma. Eng katta ösiş REWRITE bosqiçida böladi.",
               en: 'Never finish an essay and immediately move on. The rewrite is where a lot of improvement happens.' },
      steps: [
        { t: { uz: 'PLAN', en: 'PLAN' },       d: { uz: 'Fikr yiğib, tartibla.', en: 'Generate and organize ideas.' } },
        { t: { uz: 'WRITE', en: 'WRITE' },     d: { uz: 'Vaqt bilan yoz.', en: 'Write, timed.' } },
        { t: { uz: 'ÇECK', en: 'CHECK' },     d: { uz: 'Grammatika va luğatni tekşir.', en: 'Check grammar and vocabulary.' } },
        { t: { uz: 'ANALYZE', en: 'ANALYZE' }, d: { uz: 'Zaif joylarni belgila.', en: 'Mark the weak parts.' } },
        { t: { uz: 'REWRITE', en: 'REWRITE' }, d: { uz: 'Yaxşilangan variantni yoz.', en: 'Write the improved version.' } }
      ],
      quota: [
        { t: { uz: 'Boşlanğiç (1–8 hafta)', en: 'Early stage (weeks 1–8)' }, d: { uz: '2 × Task 2 + 1 × Task 1 / hafta', en: '2 Task 2 + 1 Task 1 per week' } },
        { t: { uz: 'Keyinroq (9–13 hafta)', en: 'Later (weeks 9–13)' },          d: { uz: '3 × Task 2 + 2 × Task 1 / hafta', en: '3 Task 2 + 2 Task 1 per week' } },
        { t: { uz: 'Yakuniy (14–16 hafta)', en: 'Final phase (weeks 14–16)' },   d: { uz: "Vaqt bilan töliq Writing testlari", en: 'Timed full Writing tests' } }
      ]
    },
    {
      skill: 'speaking',
      title: { uz: 'Gapiriş tizimi', en: 'Speaking system' },
      intro: { uz: "Har kuni 30 daqiqa: 10 + 10 + 10. Keyin yozuvni tinglab, tört narsani tekşir.",
               en: 'Every day 30 minutes: 10 + 10 + 10. Then listen back and check four things.' },
      steps: [
        { t: { uz: 'Part 1 — 10 daqiqa', en: 'Part 1 — 10 min' }, d: { uz: 'Kundalik mavzular.', en: 'Everyday topics.' } },
        { t: { uz: 'Part 2 — 10 daqiqa', en: 'Part 2 — 10 min' }, d: { uz: 'Kartoçka + 2 daqiqa javob.', en: 'Cue card + 2-minute answer.' } },
        { t: { uz: 'Part 3 — 10 daqiqa', en: 'Part 3 — 10 min' }, d: { uz: 'Abstrakt muhokama.', en: 'Abstract discussion.' } },
        { t: { uz: 'Tinglab çiq', en: 'Listen back' },           d: { uz: 'Grammatika · Luğat · Talaffuz · Ravonlik', en: 'Grammar · Vocabulary · Pronunciation · Fluency' } },
        { t: { uz: 'Qayta gapir', en: 'Speak again' },            d: { uz: 'Xatolarni tuzatib, javobni takrorla.', en: 'Correct the mistakes and repeat the answer.' } }
      ]
    }
  ],

  /* ====================== HAFTALIK JADVAL =============================== */
  scoreboard: {
    title: { uz: 'Haftalik natija jadvali', en: 'Weekly scoreboard' },
    note: { uz: "Har yakşanba töldiriladi. Faqat ballni emas — NEGA şunday bölganini ham yoz.",
            en: 'Fill this in every Sunday. Record not just the score, but why.' },
    bands: [
      { key: 'l', name: { uz: 'Listening', en: 'Listening' }, max: 9 },
      { key: 'r', name: { uz: 'Reading', en: 'Reading' },     max: 9 },
      { key: 'w', name: { uz: 'Writing', en: 'Writing' },     max: 9 },
      { key: 's', name: { uz: 'Speaking', en: 'Speaking' },   max: 9 }
    ],
    extra: [
      { uz: "Öqilgan soatlar", en: 'Hours studied' },
      { uz: 'Asosiy xatolar', en: 'Major mistakes' },
      { uz: "Aktivlaştirilgan yangi sözlar", en: 'New vocabulary activated' },
      { uz: 'Gapirilgan daqiqalar', en: 'Speaking minutes' },
      { uz: 'Yozilgan inşolar', en: 'Essays completed' }
    ]
  },

  /* ====================== 10 QOIDA ====================================== */
  rules: [
    { uz: "Har kuni ingliz tili. Yomon kunda ham — kamida 30 daqiqa.", en: 'English every day. Even on a bad day: minimum 30 minutes.' },
    { uz: "Faqat isteʼmol qilma — IŞLAB ÇIQAR. Gapiriş va yoziş şart.", en: "Don't just consume English. Produce English. Speaking + writing are essential." },
    { uz: 'Har bir xato tahlil qilinadi.', en: 'Every mistake gets analyzed.' },
    { uz: 'Inşo yodlama.', en: "Don't memorize essays." },
    { uz: "Ulkan söz röyxatlarini yodlama.", en: "Don't memorize huge vocabulary lists." },
    { uz: "\"Çiroyli\" inglizça quvma. Aniqlik > murakkablik.", en: "Don't chase \"fancy\" English. Accuracy > complexity." },
    { uz: "Har 4 haftada — töliq mock.", en: 'Every 4 weeks → full mock.' },
    { uz: "Telefon öqiş sessiyangni boşqarmasin.", en: 'Your phone should not control your study sessions.' },
    { uz: "Yaxşi uxla. Miya tiklanmasa örganmaydi.", en: 'Sleep properly. Your brain needs recovery to learn.' },
    { uz: 'Muntazamlik motivatsiyadan kuçli.', en: 'Consistency beats motivation.' }
  ],

  /* ====================== YAKUNIY MAQSAD ================================ */
  target: [
    { skill: 'grammar',   band: '',        d: { uz: "Kuçli B2/C1 nazorat, takrorlanuvçi xato deyarli yöq", en: 'Strong B2/C1 control with very few recurring errors' } },
    { skill: 'vocab',     band: '',        d: { uz: "Katta aktiv luğat, tabiiy kollokatsiyalar", en: 'Large active vocabulary with natural collocations' } },
    { skill: 'listening', band: '8.0+',    d: { uz: 'Tabiiy tezlikda işonçli tuşuniş', en: 'Confident understanding at natural speed' } },
    { skill: 'reading',   band: '8.0+',    d: { uz: '60 daqiqa / 40 savol, barqaror aniqlik', en: '60 minutes / 40 questions, stable accuracy' } },
    { skill: 'writing',   band: '7.0–8.0', d: { uz: "Tört mezon böyiça nazorat", en: 'Control across all four criteria' } },
    { skill: 'speaking',  band: '7.5–8.0', d: { uz: 'Ravon, aniq, tabiiy talaffuz', en: 'Fluent, accurate, natural pronunciation' } }
  ]
};
