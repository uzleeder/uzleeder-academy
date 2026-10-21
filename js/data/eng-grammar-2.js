/* ==========================================================================
   ENG_GRAMMAR (2-qism) — qo'shimcha cheatsheet'lar va HAR mavzuga mashqlar
   --------------------------------------------------------------------------
   1) Yangi mavzular ENG_GRAMMAR ga qo'shiladi (eng-grammar.js dan keyin
      yuklanadi): to'liq zamonlar tizimi — Future Continuous, Future
      Perfect, Future Perfect Continuous, Past Perfect Continuous, Present
      Simple vs Continuous, used to / would, wish / if only, causative,
      question tags, so / such / too / enough.
   2) ENG_GRAMMAR_EX — har mavzuga 5 mashq { q, a, note? }. "___" bo'shliq
      yoki "→" o'zgartirish. Javob yopiq turadi (cheatsheet kartasida).
   ========================================================================== */
(function () {
  var G = window.ENG_GRAMMAR;
  if (!G) return;

  G['future-continuous'] = {
    group: 'tenses',
    name: { uz: 'Future Continuous', en: 'Future Continuous' },
    short: { uz: "will be + -ing — kelajakdagi aniq paytda davom etayotgan ish", en: 'will be + -ing — an action in progress at a point in the future' },
    rule: {
      uz: "Kelajakdagi aniq bir vaqtda ish o'z jarayonida bo'ladi: 'This time tomorrow I will be sitting the exam.' Ikkinchi ma'no — 'odatdagidek, rejaning bir qismi': 'I'll be seeing him on Monday anyway.' IELTS Speaking Part 3 da kelajak haqida ('In ten years people will be working from home') tabiiy eshitiladi.",
      en: "An action will be in progress at a specific future time: 'This time tomorrow I will be sitting the exam.' Second meaning — 'as a matter of course': 'I'll be seeing him on Monday anyway.' Natural in IELTS Part 3 about the future ('In ten years people will be working from home')."
    },
    forms: { head: ['Shakl', 'Qurilma', 'Misol'], rows: [
      ['Tasdiq', 'will be + V-ing', 'She will be studying at 8.'],
      ['Inkor', "won't be + V-ing", "They won't be using cash."],
      ['Savol', 'Will + ega + be + V-ing?', 'Will you be working late?'],
      ['Vaqt belgisi', 'this time tomorrow / at 8 / in ten years', 'At this time next week I\'ll be flying.']
    ] },
    use: [
      { uz: "Kelajakdagi aniq payt: At 9 tomorrow I'll be taking the test.", en: "A specific future point: At 9 tomorrow I'll be taking the test." },
      { uz: "Rejaning tabiiy qismi: I'll be going to the shop anyway — need anything?", en: "As a matter of course: I'll be going to the shop anyway — need anything?" },
      { uz: "Muloyim savol: Will you be using the car tonight?", en: "Polite enquiry: Will you be using the car tonight?" }
    ],
    examples: ['By 2040, most cities will be running on renewable power.', 'Don\'t call at 7 — I\'ll be recording my speaking practice.', 'In twenty years, people will be commuting far less.'],
    mistakes: [
      { bad: 'I will studying tomorrow.', good: 'I will be studying tomorrow.', why: { uz: "'be' tushib qolgan.", en: "'be' is missing." } },
      { bad: 'Tomorrow at 9 I will take the exam (jarayon).', good: 'Tomorrow at 9 I will be taking the exam.', why: { uz: "Aniq paytdagi jarayon — Continuous.", en: 'In progress at a point — Continuous.' } }
    ],
    ielts: { uz: "Part 3 kelajak savollarida ('How will cities change?') will + be + -ing bilan bir-ikki gap — 'range' uchun.", en: "In Part 3 future questions, one or two sentences with will be + -ing — for range." }
  };

  G['future-perfect'] = {
    group: 'tenses',
    name: { uz: 'Future Perfect', en: 'Future Perfect' },
    short: { uz: 'will have + V3 — kelajakdagi muddatgacha TUGAGAN ish', en: 'will have + V3 — an action COMPLETED before a future point' },
    rule: {
      uz: "Kelajakdagi bir nuqtaga kelib ish tugagan bo'ladi: 'By February I will have finished the course.' Kalit so'z — 'by' (…gacha). Task 1 kelajak prognozlarida: 'By 2050 the population will have doubled.' Bu Band 8 grammatik belgisi — kam odam ishlatadi.",
      en: "By a future point the action will be complete: 'By February I will have finished the course.' Key word — 'by'. In Task 1 projections: 'By 2050 the population will have doubled.' A Band 8 marker — few candidates use it."
    },
    forms: { head: ['Shakl', 'Qurilma', 'Misol'], rows: [
      ['Tasdiq', 'will have + V3', 'I will have finished by 6.'],
      ['Inkor', "won't have + V3", "They won't have arrived by then."],
      ['Savol', 'Will + ega + have + V3?', 'Will you have read it by Monday?'],
      ['Vaqt belgisi', 'by + vaqt / by the time / in X years', 'By the time you arrive, …']
    ] },
    use: [
      { uz: "Muddatgacha tugash: By 2030 the project will have been completed.", en: 'Completion by a deadline: By 2030 the project will have been completed.' },
      { uz: "Task 1 prognoz: By 2040 the figure will have reached 60%.", en: 'Task 1 projection: By 2040 the figure will have reached 60%.' }
    ],
    examples: ['By the end of this course I will have written more than a hundred essays.', 'By 2035 electric cars will have replaced most petrol vehicles in the city.', 'She will have been teaching for twenty years by then.'],
    mistakes: [
      { bad: 'By 2030 the population will double.', good: 'By 2030 the population will have doubled.', why: { uz: "'by' + tugash → Perfect.", en: "'by' + completion → Perfect." } },
      { bad: 'I will have finish.', good: 'I will have finished.', why: { uz: "have dan keyin V3.", en: 'V3 after have.' } }
    ],
    ielts: { uz: "Task 1 da kelajak yillari bo'lsa: 'is projected to' bilan birga 'will have + V3' — ikkalasi.", en: 'In Task 1 with future years: alongside "is projected to", use "will have + V3" — both.' }
  };

  G['future-perfect-continuous'] = {
    group: 'tenses',
    name: { uz: 'Future Perfect Continuous', en: 'Future Perfect Continuous' },
    short: { uz: 'will have been + -ing — kelajakdagi nuqtagacha DAVOM ETGAN muddat', en: 'will have been + -ing — DURATION up to a future point' },
    rule: {
      uz: "Kelajakdagi nuqtaga kelib ish qancha vaqtdan beri davom etayotganini aytadi: 'By February I will have been studying English for five months.' 'for + muddat' deyarli har doim birga. Kam ishlatiladi, lekin bir marta to'g'ri ishlatilsa — GRA 8 belgisi.",
      en: "How long an action will have been going on at a future point: 'By February I will have been studying English for five months.' Almost always with 'for + duration'. Rare, but one correct use is a GRA 8 marker."
    },
    forms: { head: ['Shakl', 'Qurilma', 'Misol'], rows: [
      ['Tasdiq', 'will have been + V-ing', 'I will have been working for 10 years.'],
      ['Inkor', "won't have been + V-ing", "He won't have been waiting long."],
      ['Savol', 'Will + ega + have been + V-ing?', 'How long will you have been living here?'],
      ['Vaqt belgisi', 'by + vaqt + for + muddat', 'By June, for six months']
    ] },
    use: [
      { uz: "Muddat + nuqta: By 20 February I will have been preparing for 158 days.", en: 'Duration + point: By 20 February I will have been preparing for 158 days.' }
    ],
    examples: ['By the time the exam starts, I will have been practising speaking every day for five months.', 'Next year the company will have been operating for a decade.'],
    mistakes: [
      { bad: 'By June I will have been study for a year.', good: 'By June I will have been studying for a year.', why: { uz: "been dan keyin -ing.", en: '-ing after been.' } }
    ],
    ielts: { uz: "Speaking Part 1 ('How long…?') va Part 3 da bitta ishonchli gap tayyorlab qo'y.", en: "Prepare one reliable sentence for Part 1 ('How long…?') and Part 3." }
  };

  G['past-perfect-continuous'] = {
    group: 'tenses',
    name: { uz: 'Past Perfect Continuous', en: 'Past Perfect Continuous' },
    short: { uz: "had been + -ing — o'tmishdagi nuqtagacha davom etgan jarayon", en: 'had been + -ing — a process continuing up to a past point' },
    rule: {
      uz: "O'tmishdagi bir voqeadan OLDIN qancha vaqt davom etgan ish: 'I had been waiting for an hour when the bus finally came.' Ko'pincha sabab bildiradi: 'She was tired because she had been running.' Hikoyada (Part 2) fon uchun kuchli vosita.",
      en: "How long something had been going on BEFORE a past event: 'I had been waiting for an hour when the bus finally came.' Often gives a cause: 'She was tired because she had been running.' A strong background tool in a Part 2 story."
    },
    forms: { head: ['Shakl', 'Qurilma', 'Misol'], rows: [
      ['Tasdiq', 'had been + V-ing', 'We had been driving for hours.'],
      ['Inkor', "hadn't been + V-ing", "I hadn't been sleeping well."],
      ['Savol', 'Had + ega + been + V-ing?', 'Had you been waiting long?'],
      ['Vaqt belgisi', 'for / since + when / before / by the time', 'for two years before…']
    ] },
    use: [
      { uz: "Voqeadan oldingi muddat: They had been living there for a decade before they moved.", en: 'Duration before an event: They had been living there for a decade before they moved.' },
      { uz: "Sabab: The ground was wet because it had been raining.", en: 'Cause: The ground was wet because it had been raining.' }
    ],
    examples: ['By the time I took my first mock, I had been studying for only four days.', 'He had been working on the project for months when the funding was cut.'],
    mistakes: [
      { bad: 'I was waiting for an hour when he came.', good: 'I had been waiting for an hour when he came.', why: { uz: "Voqeadan oldingi muddat — Past Perfect Continuous.", en: 'Duration before the event — Past Perfect Continuous.' } }
    ],
    ielts: { uz: "Part 2 hikoyasida bitta 'had been -ing' gap — fon va sabab uchun.", en: "One 'had been -ing' sentence in a Part 2 story — for background and cause." }
  };

  G['present-simple-vs-continuous'] = {
    group: 'tenses',
    name: { uz: 'Present Simple va Continuous — farq', en: 'Present Simple vs Continuous' },
    short: { uz: "odat / haqiqat ↔ hozir / vaqtinchalik / o'zgarish", en: 'habit / fact ↔ now / temporary / changing' },
    rule: {
      uz: "Simple: doimiy haqiqat, odat, jadval, fikr fe'llari (think, believe, know, want, like). Continuous: shu paytda, vaqtinchalik holat, o'zgarayotgan tendensiya ('Cities are growing'), bezovtalik ('always complaining'). Task 1 da 'the number is increasing' (tendensiya) va 'accounts for' (fakt) — ikkalasi o'z o'rnida.",
      en: "Simple: permanent truth, habit, timetable, state verbs (think, believe, know, want, like). Continuous: right now, temporary, a changing trend ('Cities are growing'), annoyance ('always complaining'). In Task 1, 'the number is increasing' (trend) and 'accounts for' (fact) — each in its place."
    },
    forms: { head: ['Holat', 'Simple', 'Continuous'], rows: [
      ['Odat / haqiqat', 'I study every day.', '—'],
      ['Hozir', '—', "I'm studying now."],
      ['Vaqtinchalik', 'He lives in Tashkent.', "He's living with friends this month."],
      ['Tendensiya', 'Prices rise in winter (har yili).', 'Prices are rising (hozir).'],
      ["Holat fe'llari", 'I know / want / believe.', '✗ I am knowing']
    ] },
    use: [
      { uz: "Umumiy haqiqat (Task 2): Governments invest in education.", en: 'General truth (Task 2): Governments invest in education.' },
      { uz: "O'zgarish (Task 2 kirish): More people are working remotely than ever before.", en: 'Change (Task 2 intro): More people are working remotely than ever before.' }
    ],
    examples: ['I usually study in the morning, but this week I am studying in the evening.', 'The climate is changing faster than scientists predicted.', 'She always leaves early — she\'s always leaving early! (odat vs bezovtalik)'],
    mistakes: [
      { bad: 'I am knowing the answer.', good: 'I know the answer.', why: { uz: "Holat fe'li Continuous bo'lmaydi.", en: 'State verbs take no Continuous.' } },
      { bad: 'Nowadays people are believe that…', good: 'Nowadays people believe that…', why: { uz: "'are' + oddiy fe'l — aralash.", en: "'are' + base verb — mixed forms." } }
    ],
    ielts: { uz: "Part 1: 'What do you do?' → Simple; 'What are you studying at the moment?' → Continuous. Savol zamoni = javob zamoni.", en: "Part 1: 'What do you do?' → Simple; 'What are you studying at the moment?' → Continuous. Question tense = answer tense." }
  };

  G['used-to-would'] = {
    group: 'verbs',
    name: { uz: 'used to / would / be used to', en: 'used to / would / be used to' },
    short: { uz: "o'tmishdagi odat ↔ o'rganib qolgan", en: 'past habit ↔ accustomed to' },
    rule: {
      uz: "used to + fe'l: o'tmishda bo'lgan, hozir yo'q (odat yoki holat): 'I used to live in Andijan.' would + fe'l: o'tmishdagi takrorlanuvchi HARAKAT (holat emas): 'We would play football every evening.' be/get used to + -ing/ot: o'rganib qolmoq (hozir): 'I'm used to waking up at 5.' Part 2 o'tmish hikoyasida used to — kuchli.",
      en: "used to + verb: true in the past, not now (habit or state): 'I used to live in Andijan.' would + verb: repeated past ACTIONS (not states): 'We would play football every evening.' be/get used to + -ing/noun: accustomed (now): 'I'm used to waking up at 5.' Strong in Part 2 past stories."
    },
    forms: { head: ['Shakl', "Ma'no", 'Misol'], rows: [
      ['used to + V', "o'tmishda edi, hozir yo'q", 'I used to hate grammar.'],
      ['would + V', "o'tmish odati (harakat)", 'My father would read to us.'],
      ['be used to + -ing', "o'rganib qolganman", "I'm used to studying early."],
      ['get used to + -ing', "o'rganib boryapman", "I'm getting used to the pace."]
    ] },
    use: [
      { uz: "O'tmish vs hozir taqqoslash (Part 3): People used to write letters; now they message.", en: 'Past vs present contrast (Part 3): People used to write letters; now they message.' }
    ],
    examples: ['I used to be terrified of speaking English; now I record myself every day.', 'On Sundays we would visit my grandmother.', 'It took a month, but I got used to sleeping at 21:20.'],
    mistakes: [
      { bad: 'I am used to wake up early.', good: 'I am used to waking up early.', why: { uz: "be used to + -ing.", en: 'be used to + -ing.' } },
      { bad: 'I would live in Andijan.', good: 'I used to live in Andijan.', why: { uz: "Holat (live) uchun would emas, used to.", en: 'For a state (live) use used to, not would.' } }
    ],
    ielts: { uz: "'How has X changed?' savoliga: 'People used to…, whereas now…' — tayyor qolip.", en: "For 'How has X changed?': 'People used to…, whereas now…' — a ready frame." }
  };

  G['wish-if-only'] = {
    group: 'verbs',
    name: { uz: 'wish / if only / would rather', en: 'wish / if only / would rather' },
    short: { uz: "afsus va istak — zamon bir qadam orqaga", en: 'regret and wish — tense one step back' },
    rule: {
      uz: "wish + Past Simple: hozirgi holatdan afsus ('I wish I had more time'). wish + Past Perfect: o'tmishdan afsus ('I wish I had started earlier'). wish + would: boshqaning xatti-harakati bezovta qilganda ('I wish he would stop'). would rather + V: afzal ko'raman ('I'd rather stay in'). If only = wish, kuchliroq.",
      en: "wish + Past Simple: regret about now ('I wish I had more time'). wish + Past Perfect: regret about the past ('I wish I had started earlier'). wish + would: someone's behaviour annoys ('I wish he would stop'). would rather + verb: preference ('I'd rather stay in'). If only = wish, stronger."
    },
    forms: { head: ['Qurilma', "Ma'no", 'Misol'], rows: [
      ['wish + Past Simple', 'hozir boshqacha bo\'lsa edi', 'I wish I spoke faster.'],
      ['wish + Past Perfect', "o'tmishda boshqacha bo'lsa edi", 'I wish I had practised more.'],
      ['wish + would', 'bezovtalik', 'I wish it would stop raining.'],
      ["would rather + V", 'afzal', "I'd rather work at home."],
      ["would rather + ega + Past", 'boshqa odam haqida', "I'd rather you didn't call late."]
    ] },
    use: [
      { uz: "Part 2 'something you regret': I wish I had taken it more seriously.", en: "Part 2 'something you regret': I wish I had taken it more seriously." }
    ],
    examples: ['I wish I were more confident in Part 3.', 'If only I had recorded myself from day one.', "I'd rather take the exam in the morning than in the afternoon."],
    mistakes: [
      { bad: 'I wish I have more time.', good: 'I wish I had more time.', why: { uz: "wish dan keyin bir qadam orqaga — Past.", en: 'One step back after wish — Past.' } },
      { bad: 'I would rather to stay.', good: 'I would rather stay.', why: { uz: "would rather + to yo'q.", en: 'No to after would rather.' } }
    ],
    ielts: { uz: "'I wish I were' (I was ham bo'ladi, were rasmiyroq). Part 2 afsus savollarida 1 marta.", en: "'I wish I were' (I was is also accepted; were is more formal). Once in Part 2 regret questions." }
  };

  G['causative'] = {
    group: 'verbs',
    name: { uz: 'Causative: have / get something done', en: 'Causative: have / get something done' },
    short: { uz: "o'zim emas — boshqa qildirdim", en: 'not me — I had it done' },
    rule: {
      uz: "have + ot + V3: ishni boshqa odam qilgan: 'I had my essay checked by a teacher' (o'zim tekshirmadim). get + ot + V3 — so'zlashuv varianti. have/get + odam + V/to V: kimnidir qildirmoq: 'I had my brother record me.' / 'I got my friend to listen.' Passiv bilan chalkashtirma: 'My essay was checked' (kim — muhim emas) vs 'I had my essay checked' (men uyushtirdim).",
      en: "have + object + V3: someone else did it for you: 'I had my essay checked by a teacher.' get + object + V3 — the spoken variant. have/get + person + V/to V: make someone do it: 'I had my brother record me.' / 'I got my friend to listen.' Not the passive: 'My essay was checked' (agent unimportant) vs 'I had my essay checked' (I arranged it)."
    },
    forms: { head: ['Qurilma', "Ma'no", 'Misol'], rows: [
      ['have + ot + V3', 'xizmat', 'I had my phone repaired.'],
      ['get + ot + V3', 'xizmat (og\'zaki)', 'I got my hair cut.'],
      ['have + odam + V', 'qildirmoq', 'I had the students write an essay.'],
      ['get + odam + to V', 'ko\'ndirmoq', 'I got him to help me.']
    ] },
    use: [
      { uz: "Task 2: Governments should have public buildings inspected regularly.", en: 'Task 2: Governments should have public buildings inspected regularly.' }
    ],
    examples: ['Every Sunday I have my recordings assessed by my LC teacher.', 'Companies increasingly get their content written by AI tools.'],
    mistakes: [
      { bad: 'I had checked my essay by a teacher.', good: 'I had my essay checked by a teacher.', why: { uz: "Ot V3 dan OLDIN.", en: 'The object comes BEFORE V3.' } }
    ],
    ielts: { uz: "Speaking'da 'I had my … done' — bitta gap, tabiiy va Band 8 belgisi.", en: "In Speaking, one 'I had my … done' sentence — natural and a Band 8 marker." }
  };

  G['question-tags'] = {
    group: 'structure',
    name: { uz: 'Question tags va qisqa javoblar', en: 'Question tags and short answers' },
    short: { uz: "…, isn't it? / Yes, I do.", en: "…, isn't it? / Yes, I do." },
    rule: {
      uz: "Tasdiq gap + inkor tag; inkor gap + tasdiq tag. Yordamchi fe'l gapdagi bilan bir xil: 'You speak English, don't you?' 'She's here, isn't she?' 'I am' → 'aren't I?'. Qisqa javob: 'Do you…?' → 'Yes, I do.' (to'liq gap emas). Speaking'da tag savol — tabiiylik belgisi, lekin Part 3 da kam.",
      en: "Positive statement + negative tag; negative + positive. The auxiliary matches: 'You speak English, don't you?' 'She's here, isn't she?' 'I am' → 'aren't I?'. Short answer: 'Do you…?' → 'Yes, I do.' Tags sound natural in Speaking, but rarely in Part 3."
    },
    forms: { head: ['Gap', 'Tag', 'Qisqa javob'], rows: [
      ['You like it,', "don't you?", 'Yes, I do. / No, I don\'t.'],
      ["He can't swim,", 'can he?', "No, he can't."],
      ["They've left,", "haven't they?", "Yes, they have."],
      ['I am late,', "aren't I?", '—'],
      ["Let's go,", 'shall we?', '—']
    ] },
    use: [ { uz: "Part 1 tabiiylik: It's a lovely city, isn't it?", en: "Naturalness in Part 1: It's a lovely city, isn't it?" } ],
    examples: ["English isn't easy, is it?", "You've been to Samarkand, haven't you?"],
    mistakes: [
      { bad: 'You like it, no?', good: "You like it, don't you?", why: { uz: "'no?' — o'zbekcha/ruscha ta'sir.", en: "'no?' is L1 interference." } },
      { bad: 'Do you like it? — Yes, I like.', good: 'Yes, I do.', why: { uz: "Qisqa javob yordamchi fe'l bilan.", en: 'Short answer with the auxiliary.' } }
    ],
    ielts: { uz: "Part 1 da 1–2 marta; Writing'da hech qachon.", en: 'Once or twice in Part 1; never in Writing.' }
  };

  G['so-such-too-enough'] = {
    group: 'style',
    name: { uz: 'so / such / too / enough', en: 'so / such / too / enough' },
    short: { uz: 'daraja va natija', en: 'degree and result' },
    rule: {
      uz: "so + sifat/ravish ('so expensive'); such + (a) + sifat + ot ('such an expensive car'). Ikkalasi + that: natija ('so expensive that nobody bought it'). too + sifat + to V: haddan tashqari, salbiy ('too expensive to buy'). sifat + enough + to V: yetarli ('cheap enough to buy'). enough OTDAN OLDIN, SIFATDAN KEYIN: 'enough money' / 'good enough'.",
      en: "so + adjective/adverb ('so expensive'); such + (a) + adjective + noun ('such an expensive car'). Both + that: result. too + adjective + to V: excessive, negative ('too expensive to buy'). adjective + enough + to V: sufficient. enough BEFORE a noun, AFTER an adjective."
    },
    forms: { head: ['Qurilma', 'Misol', 'Izoh'], rows: [
      ['so + sifat + that', 'It was so cold that we stayed in.', 'natija'],
      ['such + (a) + sifat + ot + that', 'It was such a cold day that…', 'ot bilan'],
      ['too + sifat + to V', 'too tired to study', 'salbiy, ortiqcha'],
      ['sifat + enough + to V', 'fit enough to run', 'yetarli'],
      ['enough + ot', 'enough time', 'otdan oldin']
    ] },
    use: [ { uz: "Task 2 natija: The cost was so high that the project was abandoned.", en: 'Task 2 result: The cost was so high that the project was abandoned.' } ],
    examples: ['The traffic is so heavy that many people have stopped driving.', 'Cities have grown too fast for their transport systems to cope.', 'Few students get enough sleep to concentrate.'],
    mistakes: [
      { bad: 'It was so expensive car.', good: 'It was such an expensive car. / The car was so expensive.', why: { uz: "Ot bor — such.", en: 'With a noun — such.' } },
      { bad: 'enough good', good: 'good enough', why: { uz: "Sifatdan keyin.", en: 'After the adjective.' } }
    ],
    ielts: { uz: "'so … that' natija gapi — Task 2 tana abzatsida 1 marta.", en: "'so … that' result — once in a Task 2 body paragraph." }
  };

  /* ====================== MASHQLAR (har mavzuga 5 ta) ================== */
  window.ENG_GRAMMAR_EX = {
    'present-simple': [
      { q: 'She ___ (work) in a bank.', a: 'works' }, { q: 'Water ___ (boil) at 100°C.', a: 'boils' },
      { q: 'The train ___ (leave) at 9 tomorrow. (jadval)', a: 'leaves' }, { q: '___ he ___ (speak) English? — Yes, he ___.', a: 'Does … speak / does' },
      { q: 'Most people ___ (not / read) newspapers any more.', a: 'do not read' }
    ],
    'present-continuous': [
      { q: 'Quiet — I ___ (record) my speaking.', a: 'am recording' }, { q: 'The climate ___ (change) rapidly.', a: 'is changing' },
      { q: 'I ___ (know) the answer. ✗/✓?', a: '✗ → I know the answer (holat fe\'li)' }, { q: 'She ___ (always / complain) about the traffic!', a: 'is always complaining' },
      { q: 'This week I ___ (study) in the evenings.', a: 'am studying' }
    ],
    'past-simple': [
      { q: 'I ___ (start) the course in September.', a: 'started' }, { q: 'They ___ (not / go) to the LC yesterday.', a: 'did not go' },
      { q: '___ you ___ (finish) the mock?', a: 'Did … finish' }, { q: 'The population ___ (rise) sharply between 1990 and 2000.', a: 'rose' },
      { q: 'He ___ (teach) there for ten years before he left.', a: 'taught / had taught' }
    ],
    'past-continuous': [
      { q: 'I ___ (walk) home when it ___ (start) to rain.', a: 'was walking / started' }, { q: 'At 8 last night we ___ (watch) a film.', a: 'were watching' },
      { q: 'While she ___ (study), the phone ___ (ring).', a: 'was studying / rang' }, { q: 'They ___ (not / listen) when the teacher explained it.', a: 'were not listening' },
      { q: 'What ___ you ___ (do) at 5 yesterday?', a: 'were … doing' }
    ],
    'present-perfect': [
      { q: 'I ___ (study) English since September.', a: 'have studied / have been studying' }, { q: 'She ___ just ___ (finish) her essay.', a: 'has … finished' },
      { q: '___ you ever ___ (be) to Samarkand?', a: 'Have … been' }, { q: 'Over the past decade, cities ___ (grow) rapidly.', a: 'have grown' },
      { q: 'I went to London in 2019. ✗ → I ___ to London in 2019? (to\'g\'rimi?)', a: '✓ Past Simple to\'g\'ri — aniq sana bor; Present Perfect emas' }
    ],
    'present-perfect-continuous': [
      { q: 'I ___ (prepare) for IELTS for five months.', a: 'have been preparing' }, { q: 'How long ___ you ___ (live) here?', a: 'have … been living' },
      { q: "You're out of breath — ___ you ___ (run)?", a: 'have … been running' }, { q: 'Governments ___ (try) to solve this for decades.', a: 'have been trying' },
      { q: 'She ___ (write) three essays today. (natija)', a: 'has written' }
    ],
    'past-perfect': [
      { q: 'By the time I arrived, the class ___ (start).', a: 'had started' }, { q: 'I ___ never ___ (see) snow before I moved north.', a: 'had … seen' },
      { q: 'She was tired because she ___ (not / sleep).', a: 'had not slept' }, { q: 'After he ___ (finish), he went home.', a: 'had finished' },
      { q: 'The canal ___ (carry) grain for twelve centuries when the river moved.', a: 'had carried / had been carrying' }
    ],
    'future-forms': [
      { q: "I think it ___ (rain) tomorrow. (taxmin)", a: 'will rain' }, { q: "I ___ (take) IELTS in February. (reja)", a: 'am going to take / am taking' },
      { q: 'The exam ___ (start) at 9. (jadval)', a: 'starts' }, { q: "Look at those clouds — it ___ (rain).", a: 'is going to rain' },
      { q: 'When I ___ (finish), I ___ (call) you.', a: 'finish / will call' }
    ],
    'future-continuous': [
      { q: 'This time tomorrow I ___ (sit) the exam.', a: 'will be sitting' }, { q: "Don't call at 7 — I ___ (record).", a: 'will be recording' },
      { q: 'In ten years, people ___ (work) mostly from home.', a: 'will be working' }, { q: '___ you ___ (use) the car tonight?', a: 'Will … be using' },
      { q: 'By 2040 most buses ___ (run) on electricity.', a: 'will be running' }
    ],
    'future-perfect': [
      { q: 'By February I ___ (finish) the course.', a: 'will have finished' }, { q: 'By 2050 the population ___ (double).', a: 'will have doubled' },
      { q: 'By the time you arrive, we ___ (eat).', a: 'will have eaten' }, { q: 'She ___ (write) 100 essays by the exam.', a: 'will have written' },
      { q: '"By 2030 the figure will reach 60%." — Perfect bilan qayta yoz.', a: 'By 2030 the figure will have reached 60%.' }
    ],
    'future-perfect-continuous': [
      { q: 'By June I ___ (study) English for a year.', a: 'will have been studying' }, { q: 'By 20 February I ___ (prepare) for 158 days.', a: 'will have been preparing' },
      { q: 'Next year the company ___ (operate) for a decade.', a: 'will have been operating' }, { q: 'How long ___ you ___ (live) here by then?', a: 'will … have been living' },
      { q: 'By 9 he ___ (wait) for two hours.', a: 'will have been waiting' }
    ],
    'past-perfect-continuous': [
      { q: 'I ___ (wait) for an hour when the bus came.', a: 'had been waiting' }, { q: 'She was tired because she ___ (run).', a: 'had been running' },
      { q: 'They ___ (live) there for a decade before they moved.', a: 'had been living' }, { q: 'The ground was wet — it ___ (rain).', a: 'had been raining' },
      { q: 'He ___ (work) on it for months when the funding was cut.', a: 'had been working' }
    ],
    'present-simple-vs-continuous': [
      { q: 'I usually ___ (study) in the morning, but this week I ___ (study) at night.', a: 'study / am studying' }, { q: 'I ___ (not / understand) this rule.', a: 'do not understand' },
      { q: 'More people ___ (work) remotely than ever before. (o\'zgarish)', a: 'are working' }, { q: 'Governments ___ (invest) in education. (umumiy)', a: 'invest' },
      { q: 'Prices ___ (rise) every winter. / Prices ___ (rise) at the moment.', a: 'rise / are rising' }
    ],
    'tense-contrast': [
      { q: 'Last year I ___ (go) to Samarkand and I ___ (see) the Registan.', a: 'went / saw' }, { q: 'I ___ (live) here since 2020.', a: 'have lived' },
      { q: 'When I arrived, the lesson ___ (already / begin).', a: 'had already begun' }, { q: 'Task 1: "The figure rose in 2010 and reaches 40% in 2015." — tuzat.', a: 'reached (bitta zamon)' },
      { q: 'I ___ (study) English for 5 months by the exam.', a: 'will have been studying' }
    ],
    'questions': [
      { q: '___ do you usually study? — In the morning.', a: 'When' }, { q: 'Where ___ she ___ (live)?', a: 'does … live' },
      { q: 'Bilvosita: "Where is the station?" → Could you tell me where ___?', a: 'the station is' }, { q: 'Who ___ (write) this essay? (ega savoli)', a: 'wrote' },
      { q: 'How long ___ you ___ (be) here?', a: 'have … been' }
    ],
    'subject-verb-agreement': [
      { q: 'The number of students ___ (be) rising.', a: 'is' }, { q: 'A number of students ___ (be) absent.', a: 'are' },
      { q: 'Each of the countries ___ (have) its own policy.', a: 'has' }, { q: 'The data ___ (show) a clear trend.', a: 'show (akademik) / shows (og\'zaki)' },
      { q: 'One of the main reasons ___ (be) cost.', a: 'is' }
    ],
    'complex-sentences': [
      { q: 'Birlashtir: It is cheap. It is slow. (although)', a: 'Although it is cheap, it is slow.' }, { q: 'Birlashtir: Cities grew. Transport suffered. (as / because)', a: 'As cities grew, transport suffered.' },
      { q: '"Coal, ___ was the main fuel, is now declining." (which/that)', a: 'which' }, { q: 'Skelet: "The estimate, which had been quoted for decades, was never robust." → ega + fe\'l', a: 'The estimate was never robust' },
      { q: 'Birlashtir: You finish. Then call me. (when)', a: 'When you finish, call me.' }
    ],
    'noun-clauses': [
      { q: 'I believe ___ the policy will work.', a: 'that' }, { q: '___ matters is consistency. (What/That)', a: 'What' },
      { q: 'The fact ___ prices rose surprised nobody.', a: 'that' }, { q: 'Nobody knows ___ the plan will succeed. (whether/that)', a: 'whether' },
      { q: 'It is clear ___ more funding is needed.', a: 'that' }
    ],
    'adjective-clauses': [
      { q: 'The man ___ lives next door is a doctor.', a: 'who / that' }, { q: 'The book ___ I read was excellent. (yoki bo\'sh)', a: 'which / that / —' },
      { q: 'Tashkent, ___ is the capital, has 3 million people.', a: 'which' }, { q: 'The city ___ I was born is small.', a: 'where / in which' },
      { q: 'People ___ cars are old pay more tax.', a: 'whose' }
    ],
    'adverb-clauses': [
      { q: '___ it was raining, we went out. (qarama-qarshilik)', a: 'Although / Even though' }, { q: 'Call me ___ you arrive. (vaqt)', a: 'when / as soon as' },
      { q: '___ governments act, the problem will get worse. (shart, salbiy)', a: 'Unless' }, { q: 'He studies ___ he wants a scholarship. (sabab)', a: 'because / since / as' },
      { q: 'I stayed at home ___ I could study. (maqsad)', a: 'so that' }
    ],
    'participle-clauses': [
      { q: 'The government introduced a tax, and this reduced emissions. → -ing bilan', a: 'The government introduced a tax, reducing emissions.' }, { q: '___ (face) with rising costs, families cut spending.', a: 'Faced' },
      { q: '___ (fail) twice, he changed his approach.', a: 'Having failed' }, { q: 'Tuzat: Walking to work, the rain started.', a: 'Walking to work, I got wet. (ega bir xil bo\'lishi kerak)' },
      { q: 'Cities expanded rapidly, ___ (put) pressure on transport.', a: 'putting' }
    ],
    'conjunctions-punctuation': [
      { q: 'Tuzat: It is cheap, however it is slow.', a: 'It is cheap. However, it is slow. / It is cheap; however, it is slow.' }, { q: 'Vergul: Although it is cheap it is slow.', a: 'Although it is cheap, it is slow.' },
      { q: 'Vergul kerakmi? I studied hard and passed.', a: 'Yo\'q — ikkinchi qism to\'liq gap emas' }, { q: 'Vergul kerakmi? I studied hard and my sister passed.', a: 'Ha — ikki to\'liq gap: …hard, and my sister…' },
      { q: 'Nuqtali vergul: The plan is good ___ the timing is wrong.', a: 'The plan is good; the timing is wrong.' }
    ],
    'modals': [
      { q: 'Governments ___ invest more in transport. (tavsiya)', a: 'should' }, { q: 'It ___ rain later. (ehtimol)', a: 'might / may / could' },
      { q: 'You ___ have told me! (o\'tmish, tanqid)', a: 'should have' }, { q: 'There ___ be a reason. (mantiqiy xulosa)', a: 'must' },
      { q: 'Students ___ (not) use phones in the exam. (taqiq)', a: 'must not / cannot' }
    ],
    'conditionals': [
      { q: 'If governments ___ (invest) in rail, congestion ___ (fall). (2-tur)', a: 'invested / would fall' }, { q: 'Unless action ___ (take), the problem ___ (worsen). (1-tur)', a: 'is taken / will worsen' },
      { q: 'If I ___ (start) earlier, I ___ (pass). (3-tur)', a: 'had started / would have passed' }, { q: 'Inversiya: If the policy had been introduced earlier… → ___', a: 'Had the policy been introduced earlier, …' },
      { q: 'If water ___ (reach) 100°C, it ___ (boil). (0-tur)', a: 'reaches / boils' }
    ],
    'passive': [
      { q: 'People believe that… → It ___ that…', a: 'is believed' }, { q: 'The beans ___ (harvest) and then ___ (dry).', a: 'are harvested / dried' },
      { q: 'The law ___ (introduce) in 2010.', a: 'was introduced' }, { q: 'Measures ___ (take) to reduce pollution. (Present Perfect)', a: 'have been taken' },
      { q: 'Faol → majhul: They will build a new road.', a: 'A new road will be built.' }
    ],
    'gerund-infinitive': [
      { q: 'I enjoy ___ (read).', a: 'reading' }, { q: 'I want ___ (pass).', a: 'to pass' },
      { q: 'She stopped ___ (smoke). (tashladi)', a: 'smoking' }, { q: 'She stopped ___ (buy) water. (to\'xtab, sotib oldi)', a: 'to buy' },
      { q: '___ (learn) a language takes time. (ega)', a: 'Learning' }
    ],
    'reported-speech': [
      { q: '"I am tired," she said. → She said ___.', a: 'she was tired' }, { q: '"Do you live here?" he asked. → He asked ___.', a: 'whether I lived there' },
      { q: 'Critics claim ___ the policy has failed. (Task 2)', a: 'that' }, { q: '"Water boils at 100°C," he said. → He said water ___ at 100°C.', a: 'boils (umumiy haqiqat — zamon o\'zgarmaydi)' },
      { q: '"I will help," he said. → He said he ___ help.', a: 'would' }
    ],
    'articles': [
      { q: '___ education is important. (umumiy)', a: '— (artiklsiz)' }, { q: '___ education system of Japan is strict.', a: 'The' },
      { q: 'I bought ___ car. ___ car is red.', a: 'a / The' }, { q: '___ sun rises in ___ east.', a: 'The / the' },
      { q: 'Tuzat: The people in the society want the peace.', a: 'People in society want peace.' }
    ],
    'countable-uncountable': [
      { q: 'much / many research?', a: 'much research' }, { q: 'Tuzat: Many researches show…', a: 'Much research shows… / Many studies show…' },
      { q: 'a piece of ___ (advice / advices)', a: 'advice' }, { q: 'She has ten years\' ___ (experience). / It was ___ strange experience.', a: 'experience / a' },
      { q: 'The news ___ (be) good.', a: 'is' }
    ],
    'quantifiers': [
      { q: '___ people think… (most / most of)', a: 'Most people' }, { q: 'There are ___ solutions. (kam, salbiy)', a: 'few' },
      { q: 'There are ___ solutions. (bir nechta)', a: 'a few' }, { q: '___ of the students passed. (the majority)', a: 'The majority' },
      { q: 'a great deal of ___ (money / coins)', a: 'money' }
    ],
    'prepositions': [
      { q: 'It depends ___ the weather.', a: 'on' }, { q: 'I am interested ___ science.', a: 'in' },
      { q: 'We discussed ___ the problem. (tuzat)', a: '— (discussed the problem)' }, { q: '___ the weekend / ___ night / ___ the morning', a: 'at / at / in' },
      { q: 'Explain ___ me. (tuzat)', a: 'Explain it to me.' }
    ],
    'word-forms': [
      { q: 'analysis → fe\'l / sifat', a: 'analyse / analytical' }, { q: 'The economical growth. (tuzat)', a: 'The economic growth.' },
      { q: 'increased dramatic (tuzat)', a: 'increased dramatically' }, { q: 'a significant / significantly increase?', a: 'a significant increase' },
      { q: 'succeed → ot / sifat', a: 'success / successful' }
    ],
    'comparatives': [
      { q: 'more higher (tuzat)', a: 'higher' }, { q: 'X is twice ___ Y. (as … as)', a: 'as high as' },
      { q: 'compared ___ last year (farq)', a: 'with' }, { q: 'the second ___ (popular)', a: 'most popular' },
      { q: 'The gap ___ (widen) from 5% to 20%.', a: 'widened' }
    ],
    'cohesion': [
      { q: 'Cities expanded. ___ expansion strained transport. (this + ot)', a: 'This' }, { q: 'Moreover, Furthermore — abzatsga nechta?', a: 'Kamdan kam; bog\'lovchi ≤2, "this + ot" afzal' },
      { q: 'The government introduced a tax. The tax… → ___ measure…', a: 'This' }, { q: 'the former / the latter — qaysi qaysi?', a: 'the former = birinchi, the latter = ikkinchi' },
      { q: 'Qarama-qarshilik bog\'lovchisi abzats boshida (2 ta yoz)', a: 'However, / By contrast,' }
    ],
    'nominalisation': [
      { q: 'Cities grew rapidly, and this caused problems. → ot bilan', a: 'The rapid growth of cities caused problems.' }, { q: 'people rely on cars → ot', a: 'reliance on cars' },
      { q: 'the law was introduced → ot', a: 'the introduction of the law' }, { q: 'fail → ot; develop → ot', a: 'failure / development' },
      { q: 'Abzatsga nechta nominalizatsiya?', a: '1–2 ta — ko\'p bo\'lsa o\'qib bo\'lmaydi' }
    ],
    'hedging': [
      { q: 'This will solve the problem. → yumshat', a: 'This is likely to reduce the problem.' }, { q: 'always → hedging', a: 'in most cases / tends to' },
      { q: 'Shkala: is / almost certainly / probably / may / unclear — 60% qaysi?', a: 'probably / appears to / is likely to' }, { q: 'Ma\'ruzachi: "the evidence broadly supports it" → ishonch?', a: '60–80% — likely' },
      { q: 'Part 3: "I think it will…" → Band 8', a: '"I\'d imagine it might…" / "It\'s probably fair to say…"' }
    ],
    'formality': [
      { q: "don't → rasmiy", a: 'do not' }, { q: 'a lot of → rasmiy', a: 'a great deal of / numerous' },
      { q: 'kids / get / buy → rasmiy', a: 'children / obtain / purchase' }, { q: 'Task 2 da ritorik savol bo\'ladimi?', a: 'Yo\'q' },
      { q: 'Speaking\'da "detrimental" desam?', a: 'Sun\'iy — "harmful / bad for" tabiiyroq' }
    ],
    'paraphrasing': [
      { q: 'Some people think that children should learn a foreign language at primary school. → paraphrase', a: 'It is often argued that young learners should begin a second language in primary school.' }, { q: 'important → 3 sinonim', a: 'crucial / vital / plays a key role' },
      { q: 'technology makes people less social → tuzilma o\'zgartir', a: 'Digital devices have reduced face-to-face interaction.' }, { q: 'learn a language → ot ibora', a: 'language learning' },
      { q: 'Kirishda savoldan nechta so\'z ko\'chishi mumkin?', a: 'Iloji boricha 0 — kalit atamalar (IELTS, Internet) bundan mustasno' }
    ],
    'inversion-emphasis': [
      { q: 'It is expensive and slow. → Not only…', a: 'Not only is it expensive, but it is also slow.' }, { q: 'I realised only when I moved abroad. → Only when…', a: 'Only when I moved abroad did I realise.' },
      { q: 'I have never seen such a thing. → Never…', a: 'Never have I seen such a thing.' }, { q: 'Cost matters most. → It is … that', a: 'It is cost that matters most.' },
      { q: 'Speaking javobida nechta inversiya?', a: '1 ta — ko\'p bo\'lsa yod olingandek' }
    ],
    'used-to-would': [
      { q: 'I ___ (live) in Andijan. (o\'tmishda, hozir yo\'q)', a: 'used to live' }, { q: 'Every evening we ___ (play) football. (odat harakati)', a: 'would play / used to play' },
      { q: "I'm used to ___ (wake) up at 5.", a: 'waking' }, { q: 'Tuzat: I would live in a village.', a: 'I used to live in a village. (holat)' },
      { q: 'People ___ write letters; now they message. (Part 3)', a: 'used to' }
    ],
    'wish-if-only': [
      { q: 'I wish I ___ (have) more time. (hozir)', a: 'had' }, { q: 'I wish I ___ (start) earlier. (o\'tmish)', a: 'had started' },
      { q: 'I wish it ___ (stop) raining. (bezovtalik)', a: 'would stop' }, { q: "I'd rather ___ (stay) in.", a: 'stay' },
      { q: 'Tuzat: I wish I have a car.', a: 'I wish I had a car.' }
    ],
    'causative': [
      { q: 'I ___ my essay ___ (check) by a teacher.', a: 'had … checked' }, { q: 'I ___ my hair ___ (cut) yesterday. (og\'zaki)', a: 'got … cut' },
      { q: 'I got my friend ___ (listen) to my recording.', a: 'to listen' }, { q: 'Tuzat: I had checked my essay by a teacher.', a: 'I had my essay checked by a teacher.' },
      { q: 'Governments should ___ public buildings ___ (inspect).', a: 'have … inspected' }
    ],
    'question-tags': [
      { q: "You speak English, ___?", a: "don't you" }, { q: "She isn't here, ___?", a: 'is she' },
      { q: 'I am late, ___?', a: "aren't I" }, { q: "Let's go, ___?", a: 'shall we' },
      { q: 'Do you like it? — Yes, ___.', a: 'I do' }
    ],
    'so-such-too-enough': [
      { q: 'It was ___ cold that we stayed in.', a: 'so' }, { q: 'It was ___ a cold day that…', a: 'such' },
      { q: 'He is ___ tired to study.', a: 'too' }, { q: 'She is fit ___ to run a marathon.', a: 'enough' },
      { q: 'Tuzat: enough good', a: 'good enough' }
    ]
  };
})();
