/* ==========================================================================
   ENG_SKILLS — har kunning OLTI KO'NIKMA dasturi
   --------------------------------------------------------------------------
   Muammo: kun sahifasi faqat o'sha kunning ASOSIY mavzusini ko'rsatardi
   (masalan Present Perfect). Lekin rejaning asosiy qoidasi — olti ko'nikma
   HAR KUNI birga ishlaydi, alohida emas.

   Shuning uchun bu qatlam qo'shildi: u ENG_DAYS ustiga qo'yiladi va har kunga
   oltala ko'nikma uchun aniq vazifa beradi. course.js + deep.js + explain.js
   qatlamlari bilan bir xil mantiq — asosiy ma'lumot buzilmaydi, ustiga
   qo'shiladi.

   Tuzilishi:
     minutes[kunTuri][ko'nikma]  — necha daqiqa (kunlik intizom jadvali bilan mos)
     weeks[hafta][ko'nikma]      — { f: shu hafta nimaga qaratilgan, t: kunlik vazifa,
                                      r: dam kunidagi boshqacha vazifa (ixtiyoriy) }
     days[kun][ko'nikma]         — shu kunga xos vazifa (haftalik dasturni bosadi)

   Sahifa uchtasini birlashtiradi: kun → hafta → standart. Shu sababli
   yozilmagan kun ham oltala ko'nikma bilan to'liq chiqadi.
   ========================================================================== */
window.ENG_SKILLS = {

  order: ['grammar', 'vocab', 'listening', 'reading', 'writing', 'speaking'],

  /* Daqiqalar — js/data/habit.js dagi kunlik jadval bilan mos.
     Og'ir kunda (Du/Ch/Ju) Python ham bor, lekin ingliz tili to'liq
     qoladi — Python ertalabki bo'sh joyga qo'yilgan.
     LC kunida Python yo'q, shuning uchun ingliz tiliga ko'proq vaqt bor. */
  minutes: {
    heavy: { grammar: 45, vocab: 40, listening: 45, reading: 45, writing: 60, speaking: 40 },
    class: { grammar: 25, vocab: 20, listening: 45, reading: 45, writing: 45, speaking: 40 },
    rest:  { grammar: 20, vocab: 20, listening: 40, reading: 60, writing: 60, speaking: 20 }
  },

  /* Kun turiga qarab izoh */
  typeNote: {
    heavy: { uz: "Oğir kun — oltala könikma töliq, ustiga Python darsi.", en: 'Heavy day — all six skills at full length, plus the Python lesson.' },
    class: { uz: "LC kuni — Python yöq, şuning uçun ingliz tiliga köproq vaqt.", en: 'LC day — no Python, so more time for English.' },
    rest:  { uz: "Test kuni — Listening, Reading va Writing töliq test formatida.", en: 'Test day — Listening, Reading and Writing in full test format.' }
  },

  weeks: {

    /* ---------- 0-hafta · Kirish (1–4-kun) ---------- */
    0: {
      grammar:   { f: { uz: 'Format bilan tanişuv', en: 'Getting to know the format' },
                   t: { uz: "Grammatika cheatsheet sahifasini oçib, mavzular röyxatini körib çiq — nimalar borligini bil.", en: 'Open the grammar cheatsheet and scan the topic list — see what is ahead.' } },
      vocab:     { f: { uz: "Luğat tizimini örnatiş", en: 'Installing the vocabulary system' },
                   t: { uz: "Daftar oç: söz → kollokatsiya → gap. Bugun 10 ta söz şu şaklda yozilsin.", en: 'Open a notebook: word → collocation → sentence. Ten words in that shape today.' } },
      listening: { f: { uz: 'IELTS Listening formati', en: 'The IELTS Listening format' },
                   t: { uz: "Bitta töliq testni javob bermasdan tingla — 4 bölim qanday farq qilişini his qil.", en: 'Listen to one full test without answering — feel how the four sections differ.' },
                   r: { uz: "Töliq Listening testi — real vaqt, bir marta tinglaş.", en: 'Full Listening test — real timing, single play.' } },
      reading:   { f: { uz: 'Matn turlari va savol turlari', en: 'Passage types and question types' },
                   t: { uz: "Bitta matnni vaqtsiz öqi va neçta savol turi borligini sanab çiq.", en: 'Read one passage untimed and count how many question types appear.' },
                   r: { uz: "Töliq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' } },
      writing:   { f: { uz: 'Baholaş mezonlari', en: 'The marking criteria' },
                   t: { uz: "Band descriptorsʼni oçib, 7 va 8 ustunlarini yonma-yon öqi.", en: 'Open the band descriptors and read the 7 and 8 columns side by side.' },
                   r: { uz: 'Task 1 (20 daq) + Task 2 (40 daq) — boşlanğiç ölçov.', en: 'Task 1 (20 min) + Task 2 (40 min) — the baseline.' } },
      speaking:  { f: { uz: "Özingni birinçi marta eşitiş", en: 'Hearing yourself for the first time' },
                   t: { uz: "3 ta Part 1 savoliga javob ber va YOZIB OL. Tinglab, uçta muammoni belgila.", en: 'Answer 3 Part 1 questions and RECORD. Listen back and mark three problems.' } }
    },

    /* ---------- 1-hafta · Zamonlar ---------- */
    1: {
      grammar:   { f: { uz: 'Olti asosiy zamon', en: 'The six core tenses' },
                   t: { uz: "Bugungi zamonda 10 ta ÖZ gapingni yoz, keyin inkor va söroqqa aylantir.", en: 'Write 10 of your own sentences in today\'s tense, then make them negative and interrogative.' } },
      vocab:     { f: { uz: "Taʼlim va texnologiya", en: 'Education and technology' },
                   t: { uz: "10–15 ta söz: har biri kollokatsiyasi bilan, keyin bugungi zamonda gapga sol.", en: '10–15 words with collocations, then put each into today\'s tense.' } },
      listening: { f: { uz: "Section 1 — raqam, ism, sana, imlo", en: 'Section 1 — numbers, names, dates, spelling' },
                   t: { uz: "1 ta Section 1 maşqi. Tinglaşdan OLDIN har böşliqqa javob turini yozib çiq.", en: 'One Section 1 exercise. Before listening, write the expected answer type in every gap.' },
                   r: { uz: "Töliq test + transkriptdan har xatoni topiş.", en: 'Full test, then find every error in the transcript.' } },
      reading:   { f: { uz: 'Skimming va scanning', en: 'Skimming and scanning' },
                   t: { uz: "Matnni 2 daqiqada skim qilib, har abzatsga 2–3 sözli belgi yoz.", en: 'Skim a passage in 2 minutes and label each paragraph in two or three words.' },
                   r: { uz: "Töliq Reading testi — 60 daqiqa, keyin har xatoning matndagi dalilini top.", en: 'Full Reading test — 60 minutes, then find the passage evidence for every error.' } },
      writing:   { f: { uz: 'Task 2 tuzilmasi', en: 'Task 2 structure' },
                   t: { uz: "Bitta abzats yoz: topic sentence → tuşuntiriş → misol → natija.", en: 'Write one paragraph: topic sentence → explanation → example → result.' },
                   r: { uz: "Töliq Task 2 inşo — 40 daqiqa, 250+ söz.", en: 'Full Task 2 essay — 40 minutes, 250+ words.' } },
      speaking:  { f: { uz: "Part 1 — töxtamaslik", en: 'Part 1 — do not stop' },
                   t: { uz: "5 ta Part 1 savoliga uç qadamli javob: javob → sabab → detal. Yozib ol.", en: 'Five Part 1 questions with the three-step answer: answer → reason → detail. Record it.' } }
    },

    /* ---------- 2-hafta · Savol, moslik, kelajak ---------- */
    2: {
      grammar:   { f: { uz: "Söroq, moslik, kelasi zamon", en: 'Questions, agreement, future' },
                   t: { uz: "10 ta gap yoz, har birida bugungi qurilma bölsin. Keyin egani belgilab çiq.", en: 'Write 10 sentences using today\'s structure, then underline the subject in each.' } },
      vocab:     { f: { uz: 'Iş, bandlik, jamiyat', en: 'Work, employment, society' },
                   t: { uz: "10–15 ta söz. Har biriga predlogini ham yoz (depend ON, reason FOR).", en: '10–15 words. Record the preposition with each (depend ON, reason FOR).' } },
      listening: { f: { uz: 'Section 1 aniqligi', en: 'Section 1 accuracy' },
                   t: { uz: "1 ta maşq + imlo röyxati: harflab aytilgan har sözni alohida yozib bor.", en: 'One exercise plus a spelling list: record every word that was spelled out.' },
                   r: { uz: "Töliq test. Imlo xatolarini alohida sanab çiq.", en: 'Full test. Count spelling errors separately.' } },
      reading:   { f: { uz: 'Paraphrase-ni taniş', en: 'Recognising paraphrase' },
                   t: { uz: "10 ta savoldan özgarmaydigan kalit sözni ajratib, matndan sinonimini top.", en: 'Extract the unchangeable keyword from 10 questions and find its synonym in the text.' },
                   r: { uz: "Töliq test. Har töğri javob uçun paraphraseʼni yozib çiq.", en: 'Full test. Write out the paraphrase behind every correct answer.' } },
      writing:   { f: { uz: 'Kiriş abzatsi', en: 'The introduction' },
                   t: { uz: "3 ta savolning kiriş abzatsini yoz: paraphrase + pozitsiya. Köçirma.", en: 'Write introductions for 3 prompts: paraphrase + position. Never copy.' },
                   r: { uz: "Töliq inşo + söz sanoğini tekşiriş.", en: 'Full essay, then check the word count.' } },
      speaking:  { f: { uz: 'Part 1 — kengaytirilgan javob', en: 'Part 1 — extended answers' },
                   t: { uz: "5 ta savol. Har javobda kamida bitta töldiruvçi ibora işlat.", en: 'Five questions. Use at least one filler phrase in each answer.' } }
    },

    /* ---------- 3-hafta · Murakkab grammatika ---------- */
    3: {
      grammar:   { f: { uz: 'Modal, qiyoslaş, şart, majhul, relative', en: 'Modals, comparatives, conditionals, passive, relative clauses' },
                   t: { uz: "Bugungi qurilmada 8 ta gap. Yarmi taʼlim, yarmi atrof-muhit mavzusida.", en: 'Eight sentences in today\'s structure: half on education, half on the environment.' } },
      vocab:     { f: { uz: "Atrof-muhit, soğliq, hukumat", en: 'Environment, health, government' },
                   t: { uz: "10–15 ta söz. Har birini bugungi grammatik qurilmada işlat.", en: '10–15 words, each used inside today\'s grammar structure.' } },
      listening: { f: { uz: 'Section 1–2, çalğituvçi javoblar', en: 'Sections 1–2, distractors' },
                   t: { uz: "1 ta maşq. \"actually\", \"sorry, I mean\", \"rather than\" eşitilgan joylarni belgila.", en: 'One exercise. Mark every "actually", "sorry, I mean", "rather than" you hear.' },
                   r: { uz: "Töliq test + tuzoq signallari röyxati.", en: 'Full test plus a list of trap signals.' } },
      reading:   { f: { uz: 'True / False / Not Given', en: 'True / False / Not Given' },
                   t: { uz: "10 ta T/F/NG savoli. Har javobga matndagi qatorni körsat.", en: 'Ten T/F/NG questions. Point to the line in the text for each answer.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Body abzatsi va tahrir', en: 'Body paragraphs and editing' },
                   t: { uz: "1 ta abzats yoz, keyin 4 ötişli tekşiruv: moslik · artikl · zamon · takror.", en: 'Write one paragraph, then run the four passes: agreement · articles · tenses · repetition.' },
                   r: { uz: "Töliq inşo + REWRITE (yaxşilangan variant).", en: 'Full essay plus the REWRITE.' } },
      speaking:  { f: { uz: 'Part 2 — kartoçka', en: 'Part 2 — cue cards' },
                   t: { uz: "1 ta kartoçka: 1 daqiqa tayyorgarlik + 2 daqiqa javob. Yozib ol.", en: 'One cue card: 1 minute prep + 2 minute answer. Record it.' } }
    },

    /* ---------- 4-hafta · Gap qurilishi + 1-mock ---------- */
    4: {
      grammar:   { f: { uz: 'Gerund/infinitiv va clause turlari', en: 'Gerunds/infinitives and clause types' },
                   t: { uz: "10 ta juft qisqa gapni bitta murakkab gapga birlaştir.", en: 'Merge 10 pairs of short sentences into single complex ones.' } },
      vocab:     { f: { uz: 'Jamiyat va fikr bildiriş iboralari', en: 'Society and opinion phrases' },
                   t: { uz: "10 ta söz + 5 ta tayyor inşo iborasi (It is often argued that…).", en: '10 words plus 5 ready essay phrases (It is often argued that…).' } },
      listening: { f: { uz: "Section 1–2 töliq", en: 'Sections 1–2 complete' },
                   t: { uz: "2 ta maşq. Xatolarni tört sababdan biriga yorliqla.", en: 'Two exercises. Tag each error with one of the four reasons.' },
                   r: { uz: "MOCK: töliq Listening — real vaqt.", en: 'MOCK: full Listening under real timing.' } },
      reading:   { f: { uz: 'Savol turlarini aralaştiriş', en: 'Mixed question types' },
                   t: { uz: "1 ta matn, hamma savol turi bilan. Vaqt: 20 daqiqa.", en: 'One passage with all question types. Time: 20 minutes.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: "Töliq inşo va 5 qadamli tahrir", en: 'Full essays and the five-step edit' },
                   t: { uz: "PLAN → WRITE → ÇECK → ANALYZE → REWRITE. Bugun kamida uç qadam.", en: 'PLAN → WRITE → CHECK → ANALYZE → REWRITE. At least three steps today.' },
                   r: { uz: 'MOCK: Task 1 (20 daq) + Task 2 (40 daq).', en: 'MOCK: Task 1 (20 min) + Task 2 (40 min).' } },
      speaking:  { f: { uz: 'Part 1 tizimi', en: 'The Part 1 system' },
                   t: { uz: "10 ta savol. Har javob kamida 3 gap bölsin, qisqasi qayta yozilsin.", en: 'Ten questions. Every answer at least three sentences; redo the short ones.' },
                   r: { uz: 'MOCK: Part 1 + 2 + 3, yozib olingan holda.', en: 'MOCK: Parts 1 + 2 + 3, recorded.' } }
    },

    /* ---------- 5-hafta · Listening + Reading aniqligi ---------- */
    5: {
      grammar:   { f: { uz: 'Participle clause va tiniş belgilari', en: 'Participle clauses and punctuation' },
                   t: { uz: "5 ta uzun gapni participle clause bilan qisqartir.", en: 'Shorten five long sentences using participle clauses.' } },
      vocab:     { f: { uz: 'Task 1 raqam tili', en: 'Task 1 data language' },
                   t: { uz: "Trend sözlari: rise/fall + şarply/gradually. Har biriga gap tuz.", en: 'Trend words: rise/fall + sharply/gradually. Build a sentence for each.' } },
      listening: { f: { uz: 'Prediction va distractor', en: 'Prediction and distractors' },
                   t: { uz: "Tinglaşdan oldin javobni BAŞORAT qil, keyin taqqosla.", en: 'PREDICT the answer before listening, then compare.' },
                   r: { uz: "Töliq test + transkript tahlili.", en: 'Full test plus transcript analysis.' } },
      reading:   { f: { uz: 'Matçing headings', en: 'Matching headings' },
                   t: { uz: "1 ta matn: har abzatsning ASOSIY fikrini bitta gapda yoz.", en: 'One passage: write the MAIN idea of each paragraph in one sentence.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Task 1 — tuzilma va overview', en: 'Task 1 — structure and overview' },
                   t: { uz: "1 ta grafik: kiriş + overview yoz (raqamsiz, umumiy manzara).", en: 'One chart: write the introduction and overview (no figures, the big picture).' },
                   r: { uz: 'Task 1 töliq (20 daq) + Task 2 (40 daq).', en: 'Full Task 1 (20 min) + Task 2 (40 min).' } },
      speaking:  { f: { uz: 'Part 1 çuqurroq', en: 'Deeper Part 1' },
                   t: { uz: "5 ta savol. Har javobda bitta yangi luğat sözi işlatilsin.", en: 'Five questions, each answer using one new vocabulary item.' } }
    },

    /* ---------- 6-hafta · Speaking ravonlik ---------- */
    6: {
      grammar:   { f: { uz: "Oğzaki nutq grammatikasi", en: 'Grammar for speech' },
                   t: { uz: "Gapirganda işlatiladigan 5 ta qurilmani maşq qil (I tend to, I would say).", en: 'Practise five spoken structures (I tend to, I would say).' } },
      vocab:     { f: { uz: 'Ravonlik iboralari', en: 'Fluency phrases' },
                   t: { uz: "5 ta töldiruvçi + 5 ta boğlovçi iborani yodla va gapirişda işlat.", en: 'Learn five fillers and five transitions, then use them while speaking.' } },
      listening: { f: { uz: 'Section 2 — monolog', en: 'Section 2 — monologue' },
                   t: { uz: "1 ta Section 2 maşqi + shadowing: notiq ortidan 2 daqiqa takrorla.", en: 'One Section 2 exercise plus shadowing: repeat after the speaker for 2 minutes.' },
                   r: { uz: "Töliq test + shadowing.", en: 'Full test plus shadowing.' } },
      reading:   { f: { uz: 'Multiple çoice', en: 'Multiple choice' },
                   t: { uz: "10 ta MCQ. Har notöğri variantning NEGA notöğriligini yoz.", en: 'Ten MCQs. Write WHY each wrong option is wrong.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Task 1 — taqqoslaş', en: 'Task 1 — comparison' },
                   t: { uz: "1 ta grafik: 8 ta qiyoslaş gapi, har birida farq ölçovi bölsin.", en: 'One chart: eight comparison sentences, each with a measure of the gap.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Part 2 qolipi va Part 3 ORPER', en: 'The Part 2 shape and Part 3 ORPER' },
                   t: { uz: "1 ta kartoçka (2 daq) + 2 ta Part 3 savoli: Opinion→Reason→Explanation→Example→Result.", en: 'One cue card (2 min) plus two Part 3 questions: Opinion→Reason→Explanation→Example→Result.' } }
    },

    /* ---------- 7-hafta · Task 2 ustasi ---------- */
    7: {
      grammar:   { f: { uz: 'Inşo uçun qurilmalar', en: 'Structures for essays' },
                   t: { uz: "Har inşo turiga mos qurilma: şart gap, qarama-qarşilik, majhul.", en: 'Match a structure to each essay type: conditional, contrast, passive.' } },
      vocab:     { f: { uz: 'Fikr bildiriş va boğlaş', en: 'Opinion and cohesion' },
                   t: { uz: "10 ta akademik ibora. Sözlaşuv variantini ham yoz (a lot of → a significant number of).", en: 'Ten academic phrases with their colloquial counterparts (a lot of → a significant number of).' } },
      listening: { f: { uz: 'Section 3 — suhbat', en: 'Section 3 — discussion' },
                   t: { uz: "1 ta Section 3 maşqi. Kim nima dedi — ismlarni belgilab bor.", en: 'One Section 3 exercise. Track who said what by name.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Sentence completion', en: 'Sentence completion' },
                   t: { uz: "10 ta savol. Söz çegarasiga qatʼiy rioya qil.", en: 'Ten questions. Respect the word limit strictly.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Beşta inşo turi', en: 'The five essay types' },
                   t: { uz: "Bugungi tur böyiça töliq inşo (40 daq), keyin REWRITE.", en: 'A full essay in today\'s type (40 min), then the REWRITE.' },
                   r: { uz: "Ikkita turdagi inşoni taqqoslab tahlil qil.", en: 'Compare and analyse essays of two different types.' } },
      speaking:  { f: { uz: 'Part 3 — çuqur javob', en: 'Part 3 — developed answers' },
                   t: { uz: "3 ta Part 3 savoli. Har javob kamida 4 gap va bitta misol bilan.", en: 'Three Part 3 questions, each answered in at least four sentences with an example.' } }
    },

    /* ---------- 8-hafta · Ot guruhi + 2-mock ---------- */
    8: {
      grammar:   { f: { uz: 'Artikl, sanaladigan, miqdor, predlog', en: 'Articles, countability, quantifiers, prepositions' },
                   t: { uz: "Oldingi inşongni oçib, faqat artikllarni tekşir. Neçta xato?", en: 'Open a previous essay and check only the articles. How many errors?' } },
      vocab:     { f: { uz: 'Akademik ot birikmalari', en: 'Academic noun phrases' },
                   t: { uz: "10 ta sanalmaydigan otni miqdor sözi bilan yoz (a piece of advice).", en: 'Ten uncountable nouns with their unit words (a piece of advice).' } },
      listening: { f: { uz: "Section 3–4 — maʼruza", en: 'Sections 3–4 — lecture' },
                   t: { uz: "1 ta Section 4 maşqi. Bu eng qiyini — transkriptni albatta öqi.", en: 'One Section 4 exercise. This is the hardest — always read the transcript.' },
                   r: { uz: 'MOCK: töliq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Savol turlari aralaş', en: 'Mixed question types' },
                   t: { uz: "1 ta matn 20 daqiqada. Vaqtni belgilab bor.", en: 'One passage in 20 minutes. Track the time.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: 'Vaqt bilan yoziş', en: 'Writing under time' },
                   t: { uz: "40 daqiqada töliq inşo — töxtamasdan, luğatsiz.", en: 'A full essay in 40 minutes — no stopping, no dictionary.' },
                   r: { uz: 'MOCK: Task 1 + Task 2, 60 daqiqa.', en: 'MOCK: Task 1 + Task 2, 60 minutes.' } },
      speaking:  { f: { uz: 'Uçala qism birga', en: 'All three parts together' },
                   t: { uz: "Part 1 (4 savol) → Part 2 (1 kartoçka) → Part 3 (2 savol), töxtamasdan.", en: 'Part 1 (4 questions) → Part 2 (1 card) → Part 3 (2 questions), without stopping.' },
                   r: { uz: 'MOCK: töliq Speaking, yozib olingan.', en: 'MOCK: full Speaking, recorded.' } }
    },

    /* ---------- 9-hafta · Akademik lug'at ---------- */
    9: {
      grammar:   { f: { uz: "Söz şakllari", en: 'Word forms' },
                   t: { uz: "10 ta özakning tört şaklini yoz: ot · sifat · feʼl · raviş.", en: 'Write all four forms of ten roots: noun · adjective · verb · adverb.' } },
      vocab:     { f: { uz: "9 ta akademik mavzu", en: 'Nine academic topics' },
                   t: { uz: "10–15 ta söz. Har birini gapirişda VA yozişda işlat — ikkalasida ham.", en: '10–15 words, each used in speaking AND in writing.' } },
      listening: { f: { uz: 'Section 4 — akademik maʼruza', en: 'Section 4 — academic lecture' },
                   t: { uz: "1 ta maşq. Notaniş sözlarni yozib bor — ular Reading'da ham çiqadi.", en: 'One exercise. Note unfamiliar words — they reappear in Reading.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Kontekstdan söz maʼnosi', en: 'Vocabulary from context' },
                   t: { uz: "Matndan 10 ta notaniş sözni kontekst böyiça taxmin qil, keyin tekşir.", en: 'Guess ten unfamiliar words from context, then check them.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Lexical Resource mezoni', en: 'The Lexical Resource criterion' },
                   t: { uz: "Inşo yoz, keyin takrorlangan sözlarni sanab, sinonim bilan almaştir.", en: 'Write an essay, count repeated words, then replace them with synonyms.' },
                   r: { uz: "Töliq Writing testi + luğat tahlili.", en: 'Full Writing test plus a vocabulary review.' } },
      speaking:  { f: { uz: 'Mavzu luğati nutqda', en: 'Topic vocabulary in speech' },
                   t: { uz: "3 ta savol. Bugungi 5 ta yangi sözni javoblarga kiritişga urin.", en: 'Three questions. Try to work five of today\'s new words into your answers.' } }
    },

    /* ---------- 10-hafta · Band 7+ grammatikasi ---------- */
    10: {
      grammar:   { f: { uz: 'Şaxsiy xatolar ustida iş', en: 'Working on your own errors' },
                   t: { uz: "Xatolar daftaridan bugungi xatoga qarşi 10 ta töğri gap yoz.", en: 'Write ten correct sentences against today\'s error from your log.' } },
      vocab:     { f: { uz: "Notöğri işlatilgan sözlar", en: 'Misused words' },
                   t: { uz: "Inşongdagi notöğri şakldagi sözlarni topib, töğri şaklda qayta yoz.", en: 'Find wrongly formed words in your essays and rewrite them correctly.' } },
      listening: { f: { uz: 'Imlo va format xatolari', en: 'Spelling and format errors' },
                   t: { uz: "1 ta maşq. Faqat imlo va söz çegarasi xatolarini sanab çiq.", en: 'One exercise. Count only spelling and word-limit errors.' },
                   r: { uz: "Töliq test + imlo röyxati.", en: 'Full test plus a spelling list.' } },
      reading:   { f: { uz: 'Paraphrase-ni taniş (çuqur)', en: 'Paraphrase recognition (deep)' },
                   t: { uz: "10 ta savol–matn juftligini yonma-yon yozib, tört paraphrase usulini belgila.", en: 'Write ten question–text pairs side by side and label the four paraphrase tools.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Aniqlik (Grammatical Accuracy)', en: 'Grammatical accuracy' },
                   t: { uz: "Inşo yoz, keyin 4 ötişli tekşiruv. Har ötişda neçta xato topganingni yoz.", en: 'Write an essay, then run the four passes. Record how many errors each pass finds.' },
                   r: { uz: "Töliq test + xato statistikasi.", en: 'Full test plus error statistics.' } },
      speaking:  { f: { uz: "Özini tuzatiş", en: 'Self-correction' },
                   t: { uz: "Javobingni tinglab, xatoni topganingda TÖXTAMASDAN tuzatişni maşq qil.", en: 'Listen back and practise correcting an error WITHOUT stopping.' } }
    },

    /* ---------- 11-hafta · Reading tezligi ---------- */
    11: {
      grammar:   { f: { uz: 'Uzun gapni tuşuniş', en: 'Parsing long sentences' },
                   t: { uz: "Matndan 5 ta uzun gapni olib, boş gapini ajratib çiq.", en: 'Take five long sentences from a passage and isolate the main clause.' } },
      vocab:     { f: { uz: 'Sinonim juftliklari', en: 'Synonym pairs' },
                   t: { uz: "15 ta sinonim juftligi: matndagi söz ↔ savoldagi söz.", en: 'Fifteen synonym pairs: the word in the text ↔ the word in the question.' } },
      listening: { f: { uz: 'Section 4 tezligi', en: 'Section 4 speed' },
                   t: { uz: "1 ta maşq 1.25× tezlikda. Keyin normal tezlikda tekşir.", en: 'One exercise at 1.25× speed, then check at normal speed.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: '60 daqiqa / 40 savol strategiyasi', en: 'The 60-minute / 40-question strategy' },
                   t: { uz: "1 ta matn 18 daqiqada. Bitta savolga 1.5 daqiqadan ortiq sarflama.", en: 'One passage in 18 minutes. Never spend more than 90 seconds on a question.' },
                   r: { uz: "Töliq test — vaqtni har matn böyiça alohida ölçab.", en: 'Full test, timing each passage separately.' } },
      writing:   { f: { uz: 'Cohesion — boğlaş', en: 'Cohesion' },
                   t: { uz: "Inşodagi boğlovçi sözlarni sanab çiq. Abzatsda 2 tadan köp bölsa — kamaytir.", en: 'Count the connectors in your essay. More than two per paragraph — cut them.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Ravonlik — pauzasiz', en: 'Fluency — no pauses' },
                   t: { uz: "2 daqiqa töxtamasdan gapir. Pauzalarni sana, ertaga kamaytir.", en: 'Speak for two minutes without stopping. Count the pauses and reduce them tomorrow.' } }
    },

    /* ---------- 12-hafta · 3-mock ---------- */
    12: {
      grammar:   { f: { uz: 'Mustahkamlaş', en: 'Consolidation' },
                   t: { uz: "Eng köp xato qilgan 3 ta mavzuning cheatsheet'ini qayta öqi.", en: 'Reread the cheatsheets for your three weakest topics.' } },
      vocab:     { f: { uz: 'Aktiv luğat tekşiruvi', en: 'Active vocabulary check' },
                   t: { uz: "Daftardagi 30 ta sözni yopib, maʼnosini va kollokatsiyasini eslaşga urin.", en: 'Cover 30 words in your notebook and try to recall meanings and collocations.' } },
      listening: { f: { uz: 'Barça bölimlar', en: 'All sections' },
                   t: { uz: "1 ta maşq — eng zaif bölimingdan.", en: 'One exercise from your weakest section.' },
                   r: { uz: 'MOCK: töliq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Barça savol turlari', en: 'All question types' },
                   t: { uz: "Eng zaif savol turingdan 10 ta savol.", en: 'Ten questions of your weakest type.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: 'Ikkala vazifa birga', en: 'Both tasks together' },
                   t: { uz: "Task 1 (20 daq) — vaqtga qatʼiy rioya qil.", en: 'Task 1 (20 min) — hold to the time strictly.' },
                   r: { uz: 'MOCK: Task 1 + Task 2, 60 daqiqa.', en: 'MOCK: Task 1 + Task 2, 60 minutes.' } },
      speaking:  { f: { uz: "Töliq format", en: 'Full format' },
                   t: { uz: "Part 2 + Part 3, uzoq pauzasiz ötiş.", en: 'Part 2 into Part 3 with no long pause.' },
                   r: { uz: 'MOCK: töliq Speaking.', en: 'MOCK: full Speaking.' } }
    },

    /* ---------- 13-hafta · Band 8 yozish ---------- */
    13: {
      grammar:   { f: { uz: 'Nominalizatsiya va hedging', en: 'Nominalisation and hedging' },
                   t: { uz: "5 ta feʼlli gapni ot şakliga ötkaz, 5 ta qatʼiy gapni yumşat.", en: 'Turn five verb sentences into noun phrases; soften five absolute claims.' } },
      vocab:     { f: { uz: 'Aniq söz tanlaş', en: 'Precise word choice' },
                   t: { uz: "10 ta umumiy sözni aniqroq varianti bilan almaştir (big → substantial).", en: 'Replace ten general words with more precise ones (big → substantial).' } },
      listening: { f: { uz: "Zaif bölim ustida iş", en: 'Work on the weak section' },
                   t: { uz: "1 ta maşq + transkript. Har xatoni sababi bilan yoz.", en: 'One exercise plus transcript. Log every error with its reason.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Inference va muallif fikri', en: 'Inference and author\'s opinion' },
                   t: { uz: "10 ta savol: muallif nimani AYTMAGAN, lekin nazarda tutgan?", en: 'Ten questions: what did the author imply without stating?' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: "Tört mezon böyiça Band 8", en: 'Band 8 across four criteria' },
                   t: { uz: "Inşo yoz, keyin 4 mezon böyiça özingni 0–9 da bahola va sababini yoz.", en: 'Write an essay, then score yourself 0–9 on each criterion with a reason.' },
                   r: { uz: "Töliq test + mezon böyiça tahlil.", en: 'Full test plus criterion-by-criterion analysis.' } },
      speaking:  { f: { uz: 'Mazmunli javob', en: 'Substantial answers' },
                   t: { uz: "3 ta Part 3 savoli: Claim → Explanation → Example → Contrast.", en: 'Three Part 3 questions: Claim → Explanation → Example → Contrast.' } }
    },

    /* ---------- 14-hafta · Band 8 gapirish ---------- */
    14: {
      grammar:   { f: { uz: "Oğzaki nutqda aniqlik", en: 'Accuracy in speech' },
                   t: { uz: "Yozuvingni tinglab, grammatik xatolarni sanab çiq. Ertaga şu xatoga eʼtibor.", en: 'Listen back and count grammar errors. Target that error tomorrow.' } },
      vocab:     { f: { uz: 'Gapiriş uçun luğat', en: 'Vocabulary for speaking' },
                   t: { uz: "10 ta söz: yozuvda emas, GAPDA işlatiladiganlaridan.", en: 'Ten words — the kind used in speech, not in writing.' } },
      listening: { f: { uz: "Boğlangan nutq", en: 'Connected speech' },
                   t: { uz: "2 daqiqalik parçani shadowing qil: urğu va intonatsiyani takrorla.", en: 'Shadow a two-minute passage: copy the stress and intonation.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Tezlik saqlaş', en: 'Maintaining speed' },
                   t: { uz: "1 ta matn 18 daqiqada.", en: 'One passage in 18 minutes.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Tez yoziş', en: 'Writing fast' },
                   t: { uz: "35 daqiqada töliq inşo — vaqtni qisqartirib maşq qil.", en: 'A full essay in 35 minutes — practise with less time than you have.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Talaffuz va ikkilaniş nazorati', en: 'Pronunciation and hesitation control' },
                   t: { uz: "Part 2 (2 daq) + Part 3 (3 savol). Ikkilaniş örniga töldiruvçi işlat.", en: 'Part 2 (2 min) + Part 3 (3 questions). Use a filler instead of hesitating.' } }
    },

    /* ---------- 15-hafta · To'liq mashg'ulot ---------- */
    15: {
      grammar:   { f: { uz: 'Cheatsheet takrori', en: 'Cheatsheet review' },
                   t: { uz: "Bir guruh mavzuni (masalan zamonlar) töliq qayta körib çiq.", en: 'Review one whole group of topics (for example the tenses).' } },
      vocab:     { f: { uz: 'Barça töplamlar takrori', en: 'Reviewing all sets' },
                   t: { uz: "2 ta töplamni qayta körib çiq, unutilganlarini belgila.", en: 'Review two sets and mark what you have forgotten.' } },
      listening: { f: { uz: "Haftasiga 2–3 töliq test", en: '2–3 full tests a week' },
                   t: { uz: "Töliq test — real vaqt, keyin transkript.", en: 'Full test under real timing, then the transcript.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: "Haftasiga 2–3 töliq test", en: '2–3 full tests a week' },
                   t: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Haftasiga 3 sessiya', en: 'Three sessions a week' },
                   t: { uz: "Task 1 yoki Task 2 — vaqt bilan, keyin REWRITE.", en: 'Task 1 or Task 2, timed, then the REWRITE.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Kuniga 30 daqiqa', en: '30 minutes a day' },
                   t: { uz: "Part 1 (10 daq) + Part 2 (10 daq) + Part 3 (10 daq).", en: 'Part 1 (10 min) + Part 2 (10 min) + Part 3 (10 min).' } }
    },

    /* ---------- 16-hafta · 4-mock ---------- */
    16: {
      grammar:   { f: { uz: 'Rasmiy uslub va inversiya', en: 'Register and inversion' },
                   t: { uz: "5 ta sözlaşuv iborasini akademik variant bilan almaştir.", en: 'Replace five colloquial phrases with academic equivalents.' } },
      vocab:     { f: { uz: 'Takrordan qoçiş', en: 'Avoiding repetition' },
                   t: { uz: "Bitta tuşunçani 4 xil aytişni yoz (policy → measure → initiative → sçeme).", en: 'Write four ways to say one concept (policy → measure → initiative → scheme).' } },
      listening: { f: { uz: 'Eng qiyin savol turlari', en: 'The hardest question types' },
                   t: { uz: "Xarita/diagramma yoki matçing savollaridan 1 ta maşq.", en: 'One exercise on maps/diagrams or matching questions.' },
                   r: { uz: 'MOCK: töliq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Eng qiyin savol turlari', en: 'The hardest question types' },
                   t: { uz: "Matçing features yoki summary completion — 10 ta savol.", en: 'Matching features or summary completion — ten questions.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: '40 daqiqada Band 8', en: 'Band 8 in 40 minutes' },
                   t: { uz: "Töliq inşo 40 daqiqada — mezonlarni yodda tutib.", en: 'A full essay in 40 minutes with the criteria in mind.' },
                   r: { uz: 'MOCK: Task 1 + Task 2.', en: 'MOCK: Task 1 + Task 2.' } },
      speaking:  { f: { uz: "Töliq format, bosim ostida", en: 'Full format under pressure' },
                   t: { uz: "Uçala qism ketma-ket, töxtamasdan.", en: 'All three parts back to back, without stopping.' },
                   r: { uz: 'MOCK: töliq Speaking.', en: 'MOCK: full Speaking.' } }
    },

    /* ---------- 17-hafta · Zaifliklarni yo'q qilish ---------- */
    17: {
      grammar:   { f: { uz: 'Top 10 xato', en: 'The top ten errors' },
                   t: { uz: "Bugungi xatoga qarşi 15 ta gap. Ertaga qayta tekşir.", en: 'Fifteen sentences against today\'s error. Retest tomorrow.' } },
      vocab:     { f: { uz: "Söz takrori va zaif sözlar", en: 'Repetition and weak words' },
                   t: { uz: "Oxirgi 3 ta inşongdan takrorlangan sözlarni topib almaştir.", en: 'Find repeated words in your last three essays and replace them.' } },
      listening: { f: { uz: 'Takrorlanuvçi xatolar', en: 'Recurring errors' },
                   t: { uz: "Faqat özing köp xato qiladigan savol turidan maşq qil.", en: 'Practise only the question type you keep getting wrong.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Vaqt taqsimoti', en: 'Time allocation' },
                   t: { uz: "1 ta matn, har savolga sarflangan vaqtni yozib bor.", en: 'One passage, recording the time spent on every question.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Zaif kiriş va misollar', en: 'Weak introductions and examples' },
                   t: { uz: "Eski inşoning kiriş qismini va misollarini qayta yoz.", en: 'Rewrite the introduction and examples of an old essay.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Ikkilanişni kamaytiriş', en: 'Reducing hesitation' },
                   t: { uz: "Javobni yozib ol, pauzalarni sana, ikkinçi urinişda kamaytir.", en: 'Record an answer, count the pauses, reduce them on the retake.' } }
    },

    /* ---------- 18-hafta · To'liq simulyatsiya ---------- */
    18: {
      grammar:   { f: { uz: 'Yengil takror', en: 'Light review' },
                   t: { uz: "Xatolar daftarini 15 daqiqa körib çiq — yangi qoida örganma.", en: 'Skim the error log for 15 minutes — learn no new rules.' } },
      vocab:     { f: { uz: 'Aktiv sözlarni saqlaş', en: 'Keeping words active' },
                   t: { uz: "20 ta sözni gapda işlat — yangi söz qöşma.", en: 'Use 20 known words in sentences — add no new ones.' } },
      listening: { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Simulyatsiyaning Listening qismi — telefon yöq, pauza yöq.", en: 'The Listening part of the simulation — no phone, no pauses.' },
                   r: { uz: "Natijalarni taqqoslaş.", en: 'Compare the results.' } },
      reading:   { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Simulyatsiyaning Reading qismi — 60 daqiqa qatʼiy.", en: 'The Reading part — a strict 60 minutes.' },
                   r: { uz: "Natijalarni taqqoslaş.", en: 'Compare the results.' } },
      writing:   { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Task 1 + Task 2, 60 daqiqa, uzluksiz.", en: 'Task 1 + Task 2, 60 minutes, uninterrupted.' },
                   r: { uz: "Ikki simulyatsiyani taqqoslab tahlil qil.", en: 'Compare and analyse both simulations.' } },
      speaking:  { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Töliq Speaking — yozib olingan, tayyorgarliksiz.", en: 'Full Speaking — recorded, unprepared.' } }
    },

    /* ---------- 19-hafta · Yakuniy sozlash ---------- */
    19: {
      grammar:   { f: { uz: 'Faqat xatolar', en: 'Errors only' },
                   t: { uz: "Xatolar daftarining eng tepasidagi 3 ta xatoni maşq qil.", en: 'Drill the top three errors in your log.' } },
      vocab:     { f: { uz: 'Işonçli sözlar', en: 'Words you trust' },
                   t: { uz: "Imtihonda işlatadigan 30 ta sözni tanlab, röyxat qil.", en: 'Pick 30 words you will actually use in the exam and list them.' } },
      listening: { f: { uz: 'Takrorlanuvçi xatolar', en: 'Recurring errors' },
                   t: { uz: "1 ta maşq. Faqat öz xatolaringga eʼtibor.", en: 'One exercise, focusing only on your own errors.' },
                   r: { uz: "Töliq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Vaqtni mukammal boşqariş', en: 'Perfect timing' },
                   t: { uz: "3 ta matn: 17 + 20 + 23 daqiqa taqsimoti bilan.", en: 'Three passages split 17 + 20 + 23 minutes.' },
                   r: { uz: "Töliq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Proofreading tizimi', en: 'The proofreading system' },
                   t: { uz: "Inşo yoz, oxirgi 5 daqiqada 4 ötişli tekşiruvni bajar.", en: 'Write an essay and run the four passes in the last five minutes.' },
                   r: { uz: "Töliq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Har kuni gapiriş', en: 'Daily speaking' },
                   t: { uz: "30 daqiqa. Yangi mavzu emas — işonçli javoblarni sayqalla.", en: '30 minutes. No new topics — polish the answers you trust.' } }
    },

    /* ---------- 20-hafta · Imtihon rejimi ---------- */
    20: {
      grammar:   { f: { uz: 'Yengil takror', en: 'Light review' },
                   t: { uz: "Cheatsheet'ni köz bilan körib çiq — maşq qilma, taniş.", en: 'Skim the cheatsheet — recognise, do not drill.' } },
      vocab:     { f: { uz: 'Yangi söz YÖQ', en: 'NO new words' },
                   t: { uz: "Faqat 30 ta tanlangan sözni takrorla. 500 ta yangi söz yodlama.", en: 'Review only your 30 chosen words. Do not cram 500 new ones.' } },
      listening: { f: { uz: 'Quloqni oçiq tutiş', en: 'Keeping the ear warm' },
                   t: { uz: "20 daqiqa yengil tinglaş — test emas, podkast ham böladi.", en: '20 minutes of light listening — a podcast is fine, not a test.' },
                   r: { uz: "1 ta töliq test — oxirgisi.", en: 'One full test — the last one.' } },
      reading:   { f: { uz: 'Vaqt hissi', en: 'Sense of timing' },
                   t: { uz: "1 ta matn 18 daqiqada — tezlikni yöqotmaslik uçun.", en: 'One passage in 18 minutes — just to keep the pace.' },
                   r: { uz: "1 ta töliq test.", en: 'One full test.' } },
      writing:   { f: { uz: 'Işonçli qolip', en: 'The structure you trust' },
                   t: { uz: "1 ta inşo — yangi qurilma sinamang, işonçli qolipda yoz.", en: 'One essay — no new structures, use the shape you trust.' },
                   r: { uz: "Oxirgi töliq Writing testi.", en: 'The final full Writing test.' } },
      speaking:  { f: { uz: 'Ovozni oçiq tutiş', en: 'Keeping the voice warm' },
                   t: { uz: "15–20 daqiqa gapir. Imtihon kuni ovoz \"sovuq\" bölmasin.", en: 'Speak for 15–20 minutes so your voice is not cold on exam day.' } }
    }
  },

  /* Kunga xos vazifalar — haftalik dasturni bosadi.
     Faqat kun HAQIQATAN boshqacha bo'lganda yoziladi (mock, kirish testi). */
  days: {
    2: { listening: { t: { uz: "BOŞLANĞIÇ ÖLÇOV: töliq Listening testi.", en: 'BASELINE: full Listening test.' } },
         reading:   { t: { uz: "BOŞLANĞIÇ ÖLÇOV: töliq Reading testi, 60 daqiqa.", en: 'BASELINE: full Reading test, 60 minutes.' } } },
    4: { grammar:   { t: { uz: "Mock oldidan grammatika takrori — 15 daqiqa, köproq emas.", en: 'A 15-minute grammar review before the mock — no more.' } } },
    32: { grammar:  { t: { uz: "Mock kuni yangi qoida örganma. Faqat xatolar daftarini kör.", en: 'Learn no new rules on mock day. Just look at the error log.' } },
          vocab:    { t: { uz: "Yangi söz yöq — bilganlaringni işlat.", en: 'No new words — use what you know.' } } }
  }
};
