/* ==========================================================================
   MISSION_CFG — IELTS Mission (16 hafta) sozlamalari va o'z materiallari
   --------------------------------------------------------------------------
   Kalendar: 2026-10-25 (yakshanba) → 2027-02-14 (yakshanba): 16 hafta + yakuniy kun = 113 kun.
   Bu fayl FAQAT sozlama va platforma uchun yozilgan original materiallar:
     • workload rejimlari, standart taqsimot (195 daqiqa)
     • xato toifalari (grammatika 10 ta, tinglash sabablari, o'qish turlari)
     • Writing Task 1 / Task 2 topshiriqlari — ORIGINAL (rasmiy IELTS emas)
     • Speaking Part 2 kartalari + Part 3 savollari — ORIGINAL
     • boshlang'ich profil — o'quvchi bergan dastlabki ko'rsatkichlar
   Kitob matnlari (Reading Explorer 4, Reading Accelerator va h.k.) bu
   yerda YO'Q — o'quvchi o'z kitobidan ishlaydi va natijani "kitob ishi"
   sifatida yozadi. Hech qanday rasmiy band jadvali o'ylab topilmagan.
   ========================================================================== */
window.MISSION_CFG = {
  start: '2026-10-25',
  finalReview: '2027-02-14',
  days: 113,                     // 16 hafta (112 kun) + 14-fevral yakuniy takror kuni
  weeks: 16,
  exam: '2027-02-20',            // ENGLISH.meta.exam bilan bir xil (ma'lumot uchun)
  target: 8.0,

  phases: [
    { from: 1,  to: 1,  key: 'diag',   title: { uz: 'Diagnostika va boshlang\'ich nuqta', en: 'Diagnostics & baseline' },
      focus: { uz: "Har ko'nikma bo'yicha qisqa diagnostika. Ball emas — dalil yig'ish.", en: 'A short diagnostic per skill. Not a score — evidence.' } },
    { from: 2,  to: 5,  key: 'found',  title: { uz: 'Poydevor: aniqlik', en: 'Foundation: accuracy' },
      focus: { uz: "Eng ko'p takrorlanadigan grammatika xatolari, savol turlari, Section 1–2.", en: 'Most frequent grammar errors, question types, Sections 1–2.' } },
    { from: 6,  to: 10, key: 'build',  title: { uz: 'Qurish: to\'liq vazifalar', en: 'Build: full tasks' },
      focus: { uz: "To'liq matnlar vaqt bilan, Section 3–4, Task 1 va Task 2 to'liq.", en: 'Full passages under time, Sections 3–4, full Task 1 and Task 2.' } },
    { from: 11, to: 14, key: 'exam',   title: { uz: 'Imtihon ko\'nikmasi', en: 'Exam skills' },
      focus: { uz: "Aralash, vaqtli to'plamlar, tezlik va chidamlilik.", en: 'Mixed timed sets, speed and stamina.' } },
    { from: 15, to: 16, key: 'final',  title: { uz: 'Mock va yakuniy takror', en: 'Mocks & final review' },
      focus: { uz: "Amaliy mock, xatolar banki, yakuniy profil.", en: 'Practice mocks, error bank, final profile.' } }
  ],
  /* Amaliy mock kunlari (shanba): 4-, 8-, 12-, 15-hafta. "Practice" — rasmiy emas. */
  mockDays: ['2026-11-21', '2026-12-19', '2027-01-16', '2027-02-06'],

  /* Workload: daqiqalar. Davomiylik o'rganish dalili EMAS — faqat reja. */
  modes: [
    { key: '60',  min: 60,  label: { uz: '60 daqiqa', en: '60 minutes' } },
    { key: '90',  min: 90,  label: { uz: '90 daqiqa', en: '90 minutes' } },
    { key: '120', min: 120, label: { uz: '120 daqiqa', en: '120 minutes' } },
    { key: '195', min: 195, label: { uz: '195 daqiqa (intensiv)', en: '195 minutes (intensive)' } },
    { key: 'custom', min: 0, label: { uz: 'Boshqa', en: 'Custom' } }
  ],
  defaultMode: '195',
  /* Standart intensiv taqsimot (jami 195) */
  split: { reading: 45, listening: 45, vocab: 30, grammar: 30, speaking: 30, review: 15 },

  skills: {
    reading:   { icon: 'doc',        title: { uz: "O'qish (Reading)", en: 'Reading' } },
    listening: { icon: 'headphones', title: { uz: 'Tinglash (Listening)', en: 'Listening' } },
    vocab:     { icon: 'notebook',   title: { uz: "Lug'at", en: 'Vocabulary' } },
    grammar:   { icon: 'pen',        title: { uz: 'Grammatika va Writing', en: 'Grammar & Writing' } },
    speaking:  { icon: 'mic',        title: { uz: 'Speaking', en: 'Speaking' } },
    review:    { icon: 'refresh',    title: { uz: 'Xatolar takrori', en: 'Error review' } }
  },

  /* Takror oraliqlari (kun) — sozlanadi; natijaga qarab moslashadi (SRS2) */
  intervals: [1, 3, 7, 14],

  /* Grammatika: brief'dagi 10 toifa + ENG_GRAMMAR_EX kalitlari */
  grammarCats: {
    verbforms:    { title: { uz: "Fe'l shakllari", en: 'Verb forms' }, keys: ['passive', 'reported-speech', 'modals', 'future-forms', 'future-continuous', 'future-perfect', 'future-perfect-continuous', 'used-to-would', 'causative'] },
    tenses:       { title: { uz: 'Present Perfect va zamon tanlash', en: 'Present perfect & tense choice' }, keys: ['present-perfect', 'present-perfect-continuous', 'present-simple', 'present-continuous', 'past-simple', 'past-continuous', 'past-perfect', 'past-perfect-continuous', 'present-simple-vs-continuous', 'tense-contrast'] },
    conditionals: { title: { uz: 'Shart gaplar', en: 'Conditionals' }, keys: ['conditionals', 'wish-if-only'] },
    articles:     { title: { uz: 'Artikl va determinantlar', en: 'Articles & determiners' }, keys: ['articles', 'countable-uncountable', 'quantifiers'] },
    sva:          { title: { uz: "Ega–kesim moslashuvi", en: 'Subject–verb agreement' }, keys: ['subject-verb-agreement'] },
    prepositions: { title: { uz: 'Predloglar', en: 'Prepositions' }, keys: ['prepositions'] },
    verbpatterns: { title: { uz: "Fe'l qoliplari", en: 'Verb patterns' }, keys: ['gerund-infinitive'] },
    structure:    { title: { uz: 'Gap tuzilishi', en: 'Sentence structure' }, keys: ['questions', 'question-tags', 'inversion-emphasis', 'word-forms', 'comparatives', 'so-such-too-enough'] },
    complex:      { title: { uz: "Qo'shma gaplar", en: 'Complex sentences' }, keys: ['complex-sentences', 'noun-clauses', 'adjective-clauses', 'adverb-clauses', 'participle-clauses', 'nominalisation'] },
    punctuation:  { title: { uz: 'Tinish belgilari va bog\'lanish', en: 'Punctuation & linking' }, keys: ['conjunctions-punctuation', 'cohesion', 'hedging', 'formality', 'paraphrasing'] }
  },

  /* Tinglashda xato sababi — o'quvchi har xato uchun tanlaydi */
  listenReasons: {
    distractor: { uz: "Chalg'ituvchi javob (avval aytilib, keyin tuzatilgan)", en: 'Distractor (said first, then corrected)' },
    paraphrase: { uz: 'Parafrazni tanimadim', en: 'Did not recognise the paraphrase' },
    numbers:    { uz: 'Raqam / ism / sana', en: 'Number / name / date' },
    spelling:   { uz: 'Imlo xatosi', en: 'Spelling' },
    plural:     { uz: 'Birlik / ko\'plik', en: 'Singular / plural' },
    connected:  { uz: "Tez nutq (so'zlar qo'shilib ketdi)", en: 'Connected speech (words ran together)' },
    lost:       { uz: "Joyni yo'qotdim (keyingi savolga o'tib ketdi)", en: 'Lost my place' },
    unknown:    { uz: "Tushunmadim / so'zni bilmayman", en: 'Did not understand / unknown word' }
  },
  /* O'qishda xato sababi */
  readReasons: {
    locate:     { uz: "Javob joyini topa olmadim", en: 'Could not locate the answer' },
    paraphrase: { uz: 'Parafrazni tanimadim', en: 'Did not recognise the paraphrase' },
    ngfalse:    { uz: 'NOT GIVEN va FALSE ni aralashtirdim', en: 'Confused NOT GIVEN and FALSE' },
    vocab:      { uz: "So'z ma'nosini bilmadim", en: 'Did not know a word' },
    inference:  { uz: 'Xulosa (inference) noto\'g\'ri', en: 'Wrong inference' },
    time:       { uz: 'Vaqt yetmadi', en: 'Ran out of time' },
    careless:   { uz: "E'tiborsizlik / ko'chirishda xato", en: 'Careless / copying error' }
  },
  /* Writing annotatsiya toifalari (grammatika toifalari + mezonlar) */
  writeCats: {
    task:      { uz: 'Vazifaga javob (TA/TR)', en: 'Task response / achievement' },
    coherence: { uz: 'Izchillik va bog\'lanish (CC)', en: 'Coherence & cohesion (CC)' },
    lexical:   { uz: "Lug'at (LR)", en: 'Lexical resource (LR)' },
    length:    { uz: "So'z soni / tuzilma", en: 'Length / structure' }
  },

  /* Writing mezonlari — IELTS'ga mos (o'z-o'zini baholash savollari platforma uchun yozilgan) */
  criteria: {
    1: [
      { k: 'ta',  name: 'Task Achievement', qs: [
        { uz: "Umumiy ko'rinish (overview) bormi — eng asosiy tendensiya 1–2 gapda?", en: 'Is there an overview — the main trend(s) in 1–2 sentences?' },
        { uz: "Asosiy xususiyatlar raqamlar bilan tanlab berilganmi (hammasi emas)?", en: 'Are key features selected and supported with figures (not every number)?' },
        { uz: "Shaxsiy fikr yoki sabab qo'shilmaganmi?", en: 'No personal opinion or invented reasons?' } ] },
      { k: 'cc',  name: 'Coherence and Cohesion', qs: [
        { uz: "Ma'lumot mantiqiy guruhlanganmi (har abzats bitta guruh)?", en: 'Is information grouped logically (one group per paragraph)?' },
        { uz: "Bog'lovchilar xilma-xil va ortiqcha emasmi?", en: 'Are linking devices varied and not overused?' } ] },
      { k: 'lr',  name: 'Lexical Resource', qs: [
        { uz: "O'zgarish va taqqoslash so'zlari xilma-xilmi (rise, decline, fluctuate…)?", en: 'Varied language of change and comparison (rise, decline, fluctuate…)?' },
        { uz: "Imlo xatolari yo'qmi?", en: 'No spelling errors?' } ] },
      { k: 'gra', name: 'Grammatical Range and Accuracy', qs: [
        { uz: "Murakkab gaplar (while, whereas, which…) to'g'ri ishlatilganmi?", en: 'Complex sentences (while, whereas, which…) used correctly?' },
        { uz: "Zamon va artikl xatolari yo'qmi?", en: 'No tense or article errors?' } ] }
    ],
    2: [
      { k: 'tr',  name: 'Task Response', qs: [
        { uz: "Savolning HAR qismiga javob berilganmi?", en: 'Is EVERY part of the question answered?' },
        { uz: "Pozitsiya aniq va boshidan oxirigacha bir xilmi?", en: 'Is the position clear and consistent throughout?' },
        { uz: "Har asosiy fikr tushuntirilgan va misol bilan kengaytirilganmi?", en: 'Is each main idea explained and extended with an example?' } ] },
      { k: 'cc',  name: 'Coherence and Cohesion', qs: [
        { uz: "Har abzatsda bitta markaziy fikr va topic sentence bormi?", en: 'Does each paragraph have one central idea and a topic sentence?' },
        { uz: "Bog'lanish tabiiymi (this + ot, which…), faqat 'Firstly/Moreover' emasmi?", en: 'Is cohesion natural (this + noun, which…), not just "Firstly/Moreover"?' } ] },
      { k: 'lr',  name: 'Lexical Resource', qs: [
        { uz: "Mavzuga oid aniq so'zlar va to'g'ri kollokatsiyalar bormi?", en: 'Precise topic vocabulary and correct collocations?' },
        { uz: "Savoldagi so'zlar parafraz qilinganmi (ko'chirilmagan)?", en: 'Are the question words paraphrased (not copied)?' } ] },
      { k: 'gra', name: 'Grammatical Range and Accuracy', qs: [
        { uz: "Murakkab tuzilmalar xilma-xilmi (shart, nisbiy, passiv)?", en: 'A range of complex structures (conditional, relative, passive)?' },
        { uz: "Ko'p gaplar xatosizmi? (o'z xatolar bankingizdagi toifalarni tekshiring)", en: 'Are most sentences error-free? (check the categories in your error bank)' } ] }
    ]
  },

  /* ====================== WRITING — ORIGINAL TOPSHIRIQLAR ===============
     Platforma uchun yozilgan; rasmiy IELTS savollari EMAS.                */
  prompts: {
    2: [
      { id: 't2-01', type: 'opinion',    q: 'Some people believe that artificial intelligence will soon replace most teachers. To what extent do you agree or disagree?' },
      { id: 't2-02', type: 'discussion', q: 'Some people think universities should focus on practical skills for employment, while others believe they should provide broad academic knowledge. Discuss both views and give your own opinion.' },
      { id: 't2-03', type: 'problem',    q: 'Many young people spend several hours a day on social media. What problems does this cause, and what solutions can you suggest?' },
      { id: 't2-04', type: 'advantages', q: 'More and more companies allow employees to work from home. Do the advantages of this trend outweigh the disadvantages?' },
      { id: 't2-05', type: 'opinion',    q: 'Governments should invest more money in public transport than in building new roads. To what extent do you agree or disagree?' },
      { id: 't2-06', type: 'twopart',    q: 'In many countries, people are living longer than ever before. Why is this happening? What effects does it have on society?' },
      { id: 't2-07', type: 'discussion', q: 'Some people argue that children should learn computer programming at primary school, while others think basic subjects are more important at that age. Discuss both views and give your opinion.' },
      { id: 't2-08', type: 'opinion',    q: 'The best way to protect the environment is to increase the price of fuel. To what extent do you agree or disagree?' },
      { id: 't2-09', type: 'advantages', q: 'Online courses are replacing traditional classroom learning for many adults. Is this a positive or negative development?' },
      { id: 't2-10', type: 'problem',    q: 'In many cities, housing has become too expensive for young people. What are the causes of this, and what can be done about it?' },
      { id: 't2-11', type: 'opinion',    q: 'Technology companies should be legally responsible for the information that is shared on their platforms. To what extent do you agree or disagree?' },
      { id: 't2-12', type: 'discussion', q: 'Some believe that success depends mainly on hard work, while others think it depends on luck and family background. Discuss both views and give your opinion.' },
      { id: 't2-13', type: 'twopart',    q: 'Fewer people read books for pleasure than in the past. Why is this the case? Is it a problem?' },
      { id: 't2-14', type: 'opinion',    q: 'Every student should spend a year working or volunteering before starting university. To what extent do you agree or disagree?' }
    ],
    /* Task 1: grafik o'rniga jadval (matn) — ma'lumotlar o'ylab topilgan, mashq uchun */
    1: [
      { id: 't1-01', type: 'table', q: 'The table shows the percentage of households with internet access in three countries in 2005, 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Country', '2005', '2015', '2025'], ['Country A', '35%', '72%', '94%'], ['Country B', '12%', '48%', '81%'], ['Country C', '58%', '85%', '97%']] },
      { id: 't1-02', type: 'line', q: 'The data below shows the number of visitors (in thousands) to a city museum each month in one year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Month', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'], ['Visitors (000s)', '18', '22', '35', '61', '40', '20']] },
      { id: 't1-03', type: 'bar', q: 'The data shows how students at one university travelled to campus in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Mode', '2015', '2025'], ['Car', '41%', '22%'], ['Bus', '30%', '28%'], ['Bicycle', '9%', '25%'], ['Walking', '20%', '25%']] },
      { id: 't1-04', type: 'process', q: 'The steps below describe how recycled paper is produced. Summarise the information by selecting and reporting the main features.',
        data: [['Step', 'Description'], ['1', 'Used paper is collected and sorted'], ['2', 'Paper is mixed with water to form pulp'], ['3', 'Ink is removed with detergent'], ['4', 'Pulp is pressed and dried on rollers'], ['5', 'New paper is cut and packed']] },
      { id: 't1-05', type: 'pie', q: 'The data shows how an average household in one country spent its income in 2000 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Category', '2000', '2025'], ['Housing', '24%', '33%'], ['Food', '31%', '19%'], ['Transport', '15%', '14%'], ['Technology', '3%', '11%'], ['Other', '27%', '23%']] },
      { id: 't1-06', type: 'table', q: 'The table shows the average hours per week that people in four age groups spent on three activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Age group', 'Reading', 'Video streaming', 'Exercise'], ['16–24', '2', '19', '5'], ['25–39', '3', '14', '4'], ['40–59', '5', '10', '3'], ['60+', '8', '9', '4']] },
      { id: 't1-07', type: 'map', q: 'The description below shows how a town centre changed between 2010 and 2025. Summarise the information by selecting and reporting the main features.',
        data: [['Area', '2010', '2025'], ['North', 'Car park', 'Library and café'], ['Centre', 'Market square', 'Pedestrian square with fountain'], ['East', 'Factory', 'Apartments'], ['South', 'Bus station', 'Bus and tram station']] },
      { id: 't1-08', type: 'line', q: 'The data shows the share of electricity produced from renewable sources in two countries from 2000 to 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        data: [['Year', '2000', '2005', '2010', '2015', '2020', '2025'], ['Country X', '8%', '10%', '15%', '24%', '37%', '52%'], ['Country Y', '20%', '19%', '21%', '22%', '26%', '30%']] }
    ]
  },

  /* ====================== SPEAKING — ORIGINAL KARTALAR =================
     SPEAK30 (mavjud kurs) dagi Part 1 savollari va kartalari ham ishlatiladi. */
  cards: [
    { id: 'c01', q: 'Describe a piece of technology that changed how you study.', cue: ['what it is', 'when you started using it', 'how you use it', 'and explain how it changed your studying'],
      p3: ['Has technology made students more independent or more distracted?', 'Should schools limit the use of phones in class?', 'Will AI tools change what students need to memorise?'] },
    { id: 'c02', q: 'Describe a time you solved a difficult problem.', cue: ['what the problem was', 'when it happened', 'how you solved it', 'and explain what you learned from it'],
      p3: ['Do schools teach problem-solving well?', 'Is it better to solve problems alone or in a team?', 'Why do some people avoid difficult problems?'] },
    { id: 'c03', q: 'Describe a website or app you use often.', cue: ['what it is', 'what you use it for', 'how often you use it', 'and explain why you find it useful'],
      p3: ['How do apps make money if they are free?', 'Should children be allowed to use social media?', 'How might apps change in the next ten years?'] },
    { id: 'c04', q: 'Describe a teacher or mentor who influenced you.', cue: ['who this person is', 'how you met', 'what they taught you', 'and explain why they influenced you'],
      p3: ['What makes a good teacher?', 'Can online courses replace teachers?', 'Should teachers be paid more?'] },
    { id: 'c05', q: 'Describe a project you worked on that you are proud of.', cue: ['what the project was', 'who you worked with', 'what you did', 'and explain why you are proud of it'],
      p3: ['Why do some projects fail?', 'Are group projects useful at school?', 'What skills do employers value most today?'] },
    { id: 'c06', q: 'Describe a news story about science or technology that interested you.', cue: ['what the story was', 'where you saw it', 'what happened', 'and explain why it interested you'],
      p3: ['Do people trust news about science?', 'How can people tell if a news story is reliable?', 'Should governments fund more scientific research?'] },
    { id: 'c07', q: 'Describe a skill you learned online.', cue: ['what the skill is', 'how you learned it', 'how long it took', 'and explain how you use it now'],
      p3: ['What are the limits of learning online?', 'Which skills are hard to learn without a teacher?', 'Will universities still be important in the future?'] },
    { id: 'c08', q: 'Describe a decision you made about your education or career.', cue: ['what the decision was', 'when you made it', 'who you talked to', 'and explain why you made it'],
      p3: ['Should young people follow their parents\' advice about careers?', 'Is it better to choose a career for money or interest?', 'How has the job market changed in your country?'] },
    { id: 'c09', q: 'Describe a place where you like to study or work.', cue: ['where it is', 'what it looks like', 'when you go there', 'and explain why it helps you concentrate'],
      p3: ['Do open-plan offices help people work better?', 'Is it important for cities to have public libraries?', 'How will workplaces change in the future?'] },
    { id: 'c10', q: 'Describe an invention you think is very important.', cue: ['what the invention is', 'who uses it', 'how it works (briefly)', 'and explain why it is important'],
      p3: ['Which invention has done the most harm?', 'Do all countries benefit equally from new inventions?', 'Should inventors keep the rights to their ideas forever?'] }
  ],

  /* Boshlang'ich profil — brief'da o'quvchi bergan DASTLABKI ko'rsatkichlar.
     Rasmiy emas; ishonch past; yangi dalil kelganda ularning o'rnini egallaydi. */
  prelim: [
    { skill: 'reading',  kind: 'quiz', score: 5, total: 5, note: { uz: "Qisqa o'qish testi (dastlabki)", en: 'Short reading check (preliminary)' } },
    { skill: 'grammar',  kind: 'quiz', score: 2, total: 5, note: { uz: 'Qisqa grammatika testi (dastlabki)', en: 'Short grammar check (preliminary)' } },
    { skill: 'writing',  kind: 'note', note: { uz: "Qisqa javob: tuzilma aniq, lekin Task 2 bahosi uchun juda qisqa", en: 'Short response: clear organisation, too short to represent a Task 2 assessment' } },
    { skill: 'grammar',  kind: 'note', note: { uz: "Oldingi feedback: grammatik aniqlik va gap tuzish — yaxshilash kerak", en: 'Earlier feedback: grammar accuracy and sentence construction need work' } },
    { skill: 'speaking', kind: 'note', note: { uz: "Fikr bildirish va argument tuzish yaxshi; to'liq baholanmagan", en: 'Expresses opinions and organises arguments; not fully assessed' } },
    { skill: 'listening', kind: 'note', note: { uz: "To'liq baholanmagan", en: 'Not fully assessed' } }
  ],
  interests: ['technology', 'AI', 'coding', 'education']
};
