/* ==========================================================================
   QUICK10 — "Quick Repeat" 10 kunlik General English takror kursi
   --------------------------------------------------------------------------
   Daraja: B1+ / pre-IELTS. Maqsad: asosiy ko'nikmalarni (grammar essentials,
   vocab, reading, listening, speaking) 10 kunda BUTUNLAY qayta ko'rib chiqib,
   asosiy kursning imtihon formatiga tayyor bo'lish. O'z-o'zidan boshlanadi:
   1-kun ochilganda start; keyingi kun avvalgisi yopilganda ochiladi.

   Har kun: 5 blok (grammar · vocab · reading · listening · speaking) +
   kunlik mini-test (grammatika mashqlari + lug'at). Oxirida YAKUNIY KATTA
   TEST — 40 savol (grammar 16 · vocab 12 · reading 6 · listening 6);
   70% dan o'tsa — sertifikat.

   Kontent platformadagi mavjud manbalardan yig'iladi (qayta yozilmaydi):
     grammar   → ENG_GRAMMAR kalitlari (cheatsheet + ENG_GRAMMAR_EX mashqlari)
     vocab     → ENG_VOCAB mavzulari (18 to'plam)
     reading   → ENG_READING (r1…) — IELTS matni + savollar
     listening → ENG_LISTENING (l1…) — bo'lim + transkript
     speaking  → SPEAK30 savollari (Part 1/2/3)
   Holat: Store.done["q10:<kun>:<blok>"] · kun yopiq "q10:<kun>:done" ·
   test Store.quiz["q10:final"] · sertifikat "q10:cert".
   ========================================================================== */
window.QUICK10 = {
  meta: {
    title: { uz: 'Quick Repeat — 10 kunlik General English', en: 'Quick Repeat — 10-day General English' },
    tag: { uz: 'B1+ / pre-IELTS · 10 kun · yakuniy test + sertifikat', en: 'B1+ / pre-IELTS · 10 days · final test + certificate' },
    lede: {
      uz: "Asosiy kursdan oldin (yoki uning yonida) B1+ darajadagi HAMMA asosiy narsani 10 kunda qayta ko'rib chiqish: zamonlar, gap qurilishi, artikl va predloglar, kundalik va akademik lug'at, IELTS o'qish va tinglash formati, Part 1–3 speaking. Oxirida 40 savollik katta test — 70% dan o'tsang sertifikat.",
      en: 'Before (or alongside) the main course, review EVERY B1+ essential in 10 days: tenses, sentence structure, articles and prepositions, everyday and academic vocabulary, IELTS reading and listening formats, Part 1–3 speaking. A 40-question final test at the end — pass 70% for the certificate.'
    },
    daily: { uz: 'Kuniga ~90 daqiqa: 5 blok × 15–20 daq + mini-test', en: '~90 minutes a day: 5 blocks × 15–20 min + a mini-test' },
    rule: {
      uz: "Kun 5 blokning hammasi belgilanganda yopiladi; keyingi kun shundan keyin ochiladi. Yakuniy test faqat 10/10 kun yopilgach. Test 70% dan past bo'lsa — zaif bo'limlar ko'rsatiladi, 24 soatdan keyin qayta topshiriladi.",
      en: 'A day closes when all 5 blocks are ticked; the next day opens after that. The final test unlocks only at 10/10. Below 70% — weak sections are shown and you retake after 24 hours.'
    },
    skills: ['grammar', 'vocab', 'reading', 'listening', 'speaking'],
    minutes: { grammar: 20, vocab: 15, reading: 20, listening: 20, speaking: 15 },
    finalTest: { total: 40, pass: 0.7, mix: { grammar: 16, vocab: 12, reading: 6, listening: 6 } }
  },

  days: [
    { n: 1, title: { uz: 'Hozirgi zamon va o\'zim haqimda', en: 'Present tenses & talking about yourself' },
      grammar: ['present-simple', 'present-continuous', 'present-simple-vs-continuous'], vocab: ['daily-life'], reading: 1, listening: 1, speaking: [1, 2],
      focus: { uz: "Doimiy haqiqat vs hozir bo'layotgan ish. Stative fe'llar (know, like, want) continuous bo'lmaydi.", en: 'Permanent fact vs happening now. Stative verbs (know, like, want) take no continuous.' } },
    { n: 2, title: { uz: 'O\'tgan zamon va hikoya qilish', en: 'Past tenses & telling a story' },
      grammar: ['past-simple', 'past-continuous', 'past-perfect'], vocab: ['people'], reading: 2, listening: 2, speaking: [3, 4],
      focus: { uz: "Ketma-ket voqealar — past simple; fon — past continuous; undan oldingisi — past perfect.", en: 'Sequence — past simple; background — past continuous; earlier than that — past perfect.' } },
    { n: 3, title: { uz: 'Present Perfect va tajriba', en: 'Present Perfect & experience' },
      grammar: ['present-perfect', 'present-perfect-continuous', 'tense-contrast'], vocab: ['places'], reading: 3, listening: 3, speaking: [5, 6],
      focus: { uz: "Natija hozir muhim → present perfect; aniq vaqt bor → past simple. for/since/already/yet/just.", en: 'Result matters now → present perfect; a stated time → past simple. for/since/already/yet/just.' } },
    { n: 4, title: { uz: 'Kelajak va rejalar', en: 'Future forms & plans' },
      grammar: ['future-forms', 'future-continuous', 'conditionals'], vocab: ['work'], reading: 4, listening: 4, speaking: [7, 8],
      focus: { uz: "will (qaror/bashorat) · going to (niyat/dalil) · present continuous (kelishilgan reja). 0/1/2-shart gaplar.", en: 'will (decision/prediction) · going to (intention/evidence) · present continuous (arranged plan). Conditionals 0/1/2.' } },
    { n: 5, title: { uz: 'Savol, inkor va gap qurilishi', en: 'Questions, negatives & sentence structure' },
      grammar: ['questions', 'question-tags', 'subject-verb-agreement', 'complex-sentences'], vocab: ['education'], reading: 5, listening: 5, speaking: [9, 10],
      focus: { uz: "Yordamchi fe'l tartibi (Do you…? / Where did she…?), tag savollar, ega-kesim mosligi, murakkab gap bog'lovchilari.", en: 'Auxiliary order (Do you…? / Where did she…?), question tags, subject–verb agreement, complex-sentence linkers.' } },
    { n: 6, title: { uz: 'Ot guruhi: artikl, sanaladigan, miqdor', en: 'The noun group: articles, countability, quantity' },
      grammar: ['articles', 'countable-uncountable', 'quantifiers', 'prepositions'], vocab: ['health'], reading: 6, listening: 6, speaking: [11, 12],
      focus: { uz: "a/an · the · artiklsiz; much/many/a lot of/few/little; in/on/at (vaqt va joy).", en: 'a/an · the · zero article; much/many/a lot of/few/little; in/on/at (time and place).' } },
    { n: 7, title: { uz: 'Modal fe\'llar va maslahat', en: 'Modals & advice' },
      grammar: ['modals', 'used-to-would', 'gerund-infinitive'], vocab: ['society'], reading: 7, listening: 7, speaking: [13, 14],
      focus: { uz: "can/could/may/might/must/should/have to; used to (o'tgan odat); fe'ldan keyin -ing yoki to.", en: 'can/could/may/might/must/should/have to; used to (past habit); -ing or to after verbs.' } },
    { n: 8, title: { uz: 'Majhul nisbat va ko\'chirma gap', en: 'Passive & reported speech' },
      grammar: ['passive', 'reported-speech', 'causative'], vocab: ['technology'], reading: 8, listening: 8, speaking: [15, 16],
      focus: { uz: "be + V3 (zamon be'da); reported: zamon bir qadam orqaga, so'z o'zgarishi (today → that day); have something done.", en: 'be + V3 (tense on be); reported: one tense back, word shifts (today → that day); have something done.' } },
    { n: 9, title: { uz: 'Qiyoslash, sifat va so\'z yasalishi', en: 'Comparison, adjectives & word forms' },
      grammar: ['comparatives', 'word-forms', 'so-such-too-enough', 'adjective-clauses'], vocab: ['environment', 'media'], reading: 9, listening: 9, speaking: [17, 18],
      focus: { uz: "-er/more, as…as, the -est; ot/fe'l/sifat/ravish shakllari; so/such/too/enough; who/which/that gaplari.", en: '-er/more, as…as, the -est; noun/verb/adjective/adverb forms; so/such/too/enough; who/which/that clauses.' } },
    { n: 10, title: { uz: 'Bog\'lanish, ravonlik va yakuniy takror', en: 'Cohesion, fluency & final review' },
      grammar: ['cohesion', 'conjunctions-punctuation', 'adverb-clauses', 'paraphrasing'], vocab: ['speaking-fluency', 'listening-traps'], reading: 10, listening: 10, speaking: [19, 20],
      focus: { uz: "Bog'lovchi so'zlar (however, although, therefore), to'ldiruvchi iboralar, paraphrase — IELTS'ning asosiy quroli. Ertaga: yakuniy test.", en: 'Linkers (however, although, therefore), fillers, paraphrasing — the core IELTS tool. Tomorrow: the final test.' } }
  ],

  /* Har kunning 5 blogi uchun aniq vazifa matni */
  tasks: {
    grammar:   { uz: "Cheatsheet'ni o'qi, jadvalni yopib 3 ta o'z gapingni yoz, 5 ta mashqni javobga qaramay bajar.", en: 'Read the cheatsheet, cover the table and write 3 sentences of your own, do the 5 exercises without peeking.' },
    vocab:     { uz: "To'plamdagi so'zlarni ko'r: bilmaganlarini daftarga yoz (so'z turi + sinonim + misol). 5 soniya testi.", en: 'Go through the set: write the unknown ones into the copybook (part of speech + synonym + example). The 5-second test.' },
    reading:   { uz: "Matnni vaqt bilan o'qi (15 daq), savollarga javob ber, natijani saqla.", en: 'Read the passage against the clock (15 min), answer the questions, save the result.' },
    listening: { uz: "Bo'limni bir marta tingla → savollar → transkript bilan tekshir. Xato so'zlarni yoz.", en: 'Listen once → questions → check with the transcript. Note the words you missed.' },
    speaking:  { uz: "Ikki savolga 1–2 daqiqadan ovoz chiqarib javob ber, yozib ol, qayta eshit, ravonroq takrorla.", en: 'Answer both questions aloud for 1–2 minutes each, record, listen back, retake more smoothly.' }
  }
};
