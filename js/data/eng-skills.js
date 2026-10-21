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
    heavy: { uz: "Og'ir kun — oltala ko'nikma to'liq, ustiga Python darsi.", en: 'Heavy day — all six skills at full length, plus the Python lesson.' },
    class: { uz: "LC kuni — Python yo'q, shuning uchun ingliz tiliga ko'proq vaqt.", en: 'LC day — no Python, so more time for English.' },
    rest:  { uz: "Test kuni — Listening, Reading va Writing to'liq test formatida.", en: 'Test day — Listening, Reading and Writing in full test format.' }
  },

  weeks: {

    /* ---------- 0-hafta · Kirish (1–4-kun) ---------- */
    0: {
      grammar:   { f: { uz: 'Format bilan tanishuv', en: 'Getting to know the format' },
                   t: { uz: "Grammatika cheatsheet sahifasini ochib, mavzular ro'yxatini ko'rib chiq — nimalar borligini bil.", en: 'Open the grammar cheatsheet and scan the topic list — see what is ahead.' } },
      vocab:     { f: { uz: "Lug'at tizimini o'rnatish", en: 'Installing the vocabulary system' },
                   t: { uz: "Daftar och: so'z → kollokatsiya → gap. Bugun 10 ta so'z shu shaklda yozilsin.", en: 'Open a notebook: word → collocation → sentence. Ten words in that shape today.' } },
      listening: { f: { uz: 'IELTS Listening formati', en: 'The IELTS Listening format' },
                   t: { uz: "Bitta to'liq testni javob bermasdan tingla — 4 bo'lim qanday farq qilishini his qil.", en: 'Listen to one full test without answering — feel how the four sections differ.' },
                   r: { uz: "To'liq Listening testi — real vaqt, bir marta tinglash.", en: 'Full Listening test — real timing, single play.' } },
      reading:   { f: { uz: 'Matn turlari va savol turlari', en: 'Passage types and question types' },
                   t: { uz: "Bitta matnni vaqtsiz o'qi va nechta savol turi borligini sanab chiq.", en: 'Read one passage untimed and count how many question types appear.' },
                   r: { uz: "To'liq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' } },
      writing:   { f: { uz: 'Baholash mezonlari', en: 'The marking criteria' },
                   t: { uz: "Band descriptors'ni ochib, 7 va 8 ustunlarini yonma-yon o'qi.", en: 'Open the band descriptors and read the 7 and 8 columns side by side.' },
                   r: { uz: 'Task 1 (20 daq) + Task 2 (40 daq) — boshlang\'ich o\'lchov.', en: 'Task 1 (20 min) + Task 2 (40 min) — the baseline.' } },
      speaking:  { f: { uz: "O'zingni birinchi marta eshitish", en: 'Hearing yourself for the first time' },
                   t: { uz: "3 ta Part 1 savoliga javob ber va YOZIB OL. Tinglab, uchta muammoni belgila.", en: 'Answer 3 Part 1 questions and RECORD. Listen back and mark three problems.' } }
    },

    /* ---------- 1-hafta · Zamonlar ---------- */
    1: {
      grammar:   { f: { uz: 'Olti asosiy zamon', en: 'The six core tenses' },
                   t: { uz: "Bugungi zamonda 10 ta O'Z gapingni yoz, keyin inkor va so'roqqa aylantir.", en: 'Write 10 of your own sentences in today\'s tense, then make them negative and interrogative.' } },
      vocab:     { f: { uz: "Ta'lim va texnologiya", en: 'Education and technology' },
                   t: { uz: "10–15 ta so'z: har biri kollokatsiyasi bilan, keyin bugungi zamonda gapga sol.", en: '10–15 words with collocations, then put each into today\'s tense.' } },
      listening: { f: { uz: "Section 1 — raqam, ism, sana, imlo", en: 'Section 1 — numbers, names, dates, spelling' },
                   t: { uz: "1 ta Section 1 mashqi. Tinglashdan OLDIN har bo'shliqqa javob turini yozib chiq.", en: 'One Section 1 exercise. Before listening, write the expected answer type in every gap.' },
                   r: { uz: "To'liq test + transkriptdan har xatoni topish.", en: 'Full test, then find every error in the transcript.' } },
      reading:   { f: { uz: 'Skimming va scanning', en: 'Skimming and scanning' },
                   t: { uz: "Matnni 2 daqiqada skim qilib, har abzatsga 2–3 so'zli belgi yoz.", en: 'Skim a passage in 2 minutes and label each paragraph in two or three words.' },
                   r: { uz: "To'liq Reading testi — 60 daqiqa, keyin har xatoning matndagi dalilini top.", en: 'Full Reading test — 60 minutes, then find the passage evidence for every error.' } },
      writing:   { f: { uz: 'Task 2 tuzilmasi', en: 'Task 2 structure' },
                   t: { uz: "Bitta abzats yoz: topic sentence → tushuntirish → misol → natija.", en: 'Write one paragraph: topic sentence → explanation → example → result.' },
                   r: { uz: "To'liq Task 2 insho — 40 daqiqa, 250+ so'z.", en: 'Full Task 2 essay — 40 minutes, 250+ words.' } },
      speaking:  { f: { uz: "Part 1 — to'xtamaslik", en: 'Part 1 — do not stop' },
                   t: { uz: "5 ta Part 1 savoliga uch qadamli javob: javob → sabab → detal. Yozib ol.", en: 'Five Part 1 questions with the three-step answer: answer → reason → detail. Record it.' } }
    },

    /* ---------- 2-hafta · Savol, moslik, kelajak ---------- */
    2: {
      grammar:   { f: { uz: "So'roq, moslik, kelasi zamon", en: 'Questions, agreement, future' },
                   t: { uz: "10 ta gap yoz, har birida bugungi qurilma bo'lsin. Keyin egani belgilab chiq.", en: 'Write 10 sentences using today\'s structure, then underline the subject in each.' } },
      vocab:     { f: { uz: 'Ish, bandlik, jamiyat', en: 'Work, employment, society' },
                   t: { uz: "10–15 ta so'z. Har biriga predlogini ham yoz (depend ON, reason FOR).", en: '10–15 words. Record the preposition with each (depend ON, reason FOR).' } },
      listening: { f: { uz: 'Section 1 aniqligi', en: 'Section 1 accuracy' },
                   t: { uz: "1 ta mashq + imlo ro'yxati: harflab aytilgan har so'zni alohida yozib bor.", en: 'One exercise plus a spelling list: record every word that was spelled out.' },
                   r: { uz: "To'liq test. Imlo xatolarini alohida sanab chiq.", en: 'Full test. Count spelling errors separately.' } },
      reading:   { f: { uz: 'Paraphrase-ni tanish', en: 'Recognising paraphrase' },
                   t: { uz: "10 ta savoldan o'zgarmaydigan kalit so'zni ajratib, matndan sinonimini top.", en: 'Extract the unchangeable keyword from 10 questions and find its synonym in the text.' },
                   r: { uz: "To'liq test. Har to'g'ri javob uchun paraphrase'ni yozib chiq.", en: 'Full test. Write out the paraphrase behind every correct answer.' } },
      writing:   { f: { uz: 'Kirish abzatsi', en: 'The introduction' },
                   t: { uz: "3 ta savolning kirish abzatsini yoz: paraphrase + pozitsiya. Ko'chirma.", en: 'Write introductions for 3 prompts: paraphrase + position. Never copy.' },
                   r: { uz: "To'liq insho + so'z sanog'ini tekshirish.", en: 'Full essay, then check the word count.' } },
      speaking:  { f: { uz: 'Part 1 — kengaytirilgan javob', en: 'Part 1 — extended answers' },
                   t: { uz: "5 ta savol. Har javobda kamida bitta to'ldiruvchi ibora ishlat.", en: 'Five questions. Use at least one filler phrase in each answer.' } }
    },

    /* ---------- 3-hafta · Murakkab grammatika ---------- */
    3: {
      grammar:   { f: { uz: 'Modal, qiyoslash, shart, majhul, relative', en: 'Modals, comparatives, conditionals, passive, relative clauses' },
                   t: { uz: "Bugungi qurilmada 8 ta gap. Yarmi ta'lim, yarmi atrof-muhit mavzusida.", en: 'Eight sentences in today\'s structure: half on education, half on the environment.' } },
      vocab:     { f: { uz: "Atrof-muhit, sog'liq, hukumat", en: 'Environment, health, government' },
                   t: { uz: "10–15 ta so'z. Har birini bugungi grammatik qurilmada ishlat.", en: '10–15 words, each used inside today\'s grammar structure.' } },
      listening: { f: { uz: 'Section 1–2, chalg\'ituvchi javoblar', en: 'Sections 1–2, distractors' },
                   t: { uz: "1 ta mashq. \"actually\", \"sorry, I mean\", \"rather than\" eshitilgan joylarni belgila.", en: 'One exercise. Mark every "actually", "sorry, I mean", "rather than" you hear.' },
                   r: { uz: "To'liq test + tuzoq signallari ro'yxati.", en: 'Full test plus a list of trap signals.' } },
      reading:   { f: { uz: 'True / False / Not Given', en: 'True / False / Not Given' },
                   t: { uz: "10 ta T/F/NG savoli. Har javobga matndagi qatorni ko'rsat.", en: 'Ten T/F/NG questions. Point to the line in the text for each answer.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Body abzatsi va tahrir', en: 'Body paragraphs and editing' },
                   t: { uz: "1 ta abzats yoz, keyin 4 o'tishli tekshiruv: moslik · artikl · zamon · takror.", en: 'Write one paragraph, then run the four passes: agreement · articles · tenses · repetition.' },
                   r: { uz: "To'liq insho + REWRITE (yaxshilangan variant).", en: 'Full essay plus the REWRITE.' } },
      speaking:  { f: { uz: 'Part 2 — kartochka', en: 'Part 2 — cue cards' },
                   t: { uz: "1 ta kartochka: 1 daqiqa tayyorgarlik + 2 daqiqa javob. Yozib ol.", en: 'One cue card: 1 minute prep + 2 minute answer. Record it.' } }
    },

    /* ---------- 4-hafta · Gap qurilishi + 1-mock ---------- */
    4: {
      grammar:   { f: { uz: 'Gerund/infinitiv va clause turlari', en: 'Gerunds/infinitives and clause types' },
                   t: { uz: "10 ta juft qisqa gapni bitta murakkab gapga birlashtir.", en: 'Merge 10 pairs of short sentences into single complex ones.' } },
      vocab:     { f: { uz: 'Jamiyat va fikr bildirish iboralari', en: 'Society and opinion phrases' },
                   t: { uz: "10 ta so'z + 5 ta tayyor insho iborasi (It is often argued that…).", en: '10 words plus 5 ready essay phrases (It is often argued that…).' } },
      listening: { f: { uz: "Section 1–2 to'liq", en: 'Sections 1–2 complete' },
                   t: { uz: "2 ta mashq. Xatolarni to'rt sababdan biriga yorliqla.", en: 'Two exercises. Tag each error with one of the four reasons.' },
                   r: { uz: "MOCK: to'liq Listening — real vaqt.", en: 'MOCK: full Listening under real timing.' } },
      reading:   { f: { uz: 'Savol turlarini aralashtirish', en: 'Mixed question types' },
                   t: { uz: "1 ta matn, hamma savol turi bilan. Vaqt: 20 daqiqa.", en: 'One passage with all question types. Time: 20 minutes.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: "To'liq insho va 5 qadamli tahrir", en: 'Full essays and the five-step edit' },
                   t: { uz: "PLAN → WRITE → CHECK → ANALYZE → REWRITE. Bugun kamida uch qadam.", en: 'PLAN → WRITE → CHECK → ANALYZE → REWRITE. At least three steps today.' },
                   r: { uz: 'MOCK: Task 1 (20 daq) + Task 2 (40 daq).', en: 'MOCK: Task 1 (20 min) + Task 2 (40 min).' } },
      speaking:  { f: { uz: 'Part 1 tizimi', en: 'The Part 1 system' },
                   t: { uz: "10 ta savol. Har javob kamida 3 gap bo'lsin, qisqasi qayta yozilsin.", en: 'Ten questions. Every answer at least three sentences; redo the short ones.' },
                   r: { uz: 'MOCK: Part 1 + 2 + 3, yozib olingan holda.', en: 'MOCK: Parts 1 + 2 + 3, recorded.' } }
    },

    /* ---------- 5-hafta · Listening + Reading aniqligi ---------- */
    5: {
      grammar:   { f: { uz: 'Participle clause va tinish belgilari', en: 'Participle clauses and punctuation' },
                   t: { uz: "5 ta uzun gapni participle clause bilan qisqartir.", en: 'Shorten five long sentences using participle clauses.' } },
      vocab:     { f: { uz: 'Task 1 raqam tili', en: 'Task 1 data language' },
                   t: { uz: "Trend so'zlari: rise/fall + sharply/gradually. Har biriga gap tuz.", en: 'Trend words: rise/fall + sharply/gradually. Build a sentence for each.' } },
      listening: { f: { uz: 'Prediction va distractor', en: 'Prediction and distractors' },
                   t: { uz: "Tinglashdan oldin javobni BASHORAT qil, keyin taqqosla.", en: 'PREDICT the answer before listening, then compare.' },
                   r: { uz: "To'liq test + transkript tahlili.", en: 'Full test plus transcript analysis.' } },
      reading:   { f: { uz: 'Matching headings', en: 'Matching headings' },
                   t: { uz: "1 ta matn: har abzatsning ASOSIY fikrini bitta gapda yoz.", en: 'One passage: write the MAIN idea of each paragraph in one sentence.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Task 1 — tuzilma va overview', en: 'Task 1 — structure and overview' },
                   t: { uz: "1 ta grafik: kirish + overview yoz (raqamsiz, umumiy manzara).", en: 'One chart: write the introduction and overview (no figures, the big picture).' },
                   r: { uz: 'Task 1 to\'liq (20 daq) + Task 2 (40 daq).', en: 'Full Task 1 (20 min) + Task 2 (40 min).' } },
      speaking:  { f: { uz: 'Part 1 chuqurroq', en: 'Deeper Part 1' },
                   t: { uz: "5 ta savol. Har javobda bitta yangi lug'at so'zi ishlatilsin.", en: 'Five questions, each answer using one new vocabulary item.' } }
    },

    /* ---------- 6-hafta · Speaking ravonlik ---------- */
    6: {
      grammar:   { f: { uz: "Og'zaki nutq grammatikasi", en: 'Grammar for speech' },
                   t: { uz: "Gapirganda ishlatiladigan 5 ta qurilmani mashq qil (I tend to, I would say).", en: 'Practise five spoken structures (I tend to, I would say).' } },
      vocab:     { f: { uz: 'Ravonlik iboralari', en: 'Fluency phrases' },
                   t: { uz: "5 ta to'ldiruvchi + 5 ta bog'lovchi iborani yodla va gapirishda ishlat.", en: 'Learn five fillers and five transitions, then use them while speaking.' } },
      listening: { f: { uz: 'Section 2 — monolog', en: 'Section 2 — monologue' },
                   t: { uz: "1 ta Section 2 mashqi + shadowing: notiq ortidan 2 daqiqa takrorla.", en: 'One Section 2 exercise plus shadowing: repeat after the speaker for 2 minutes.' },
                   r: { uz: "To'liq test + shadowing.", en: 'Full test plus shadowing.' } },
      reading:   { f: { uz: 'Multiple choice', en: 'Multiple choice' },
                   t: { uz: "10 ta MCQ. Har noto'g'ri variantning NEGA noto'g'riligini yoz.", en: 'Ten MCQs. Write WHY each wrong option is wrong.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Task 1 — taqqoslash', en: 'Task 1 — comparison' },
                   t: { uz: "1 ta grafik: 8 ta qiyoslash gapi, har birida farq o'lchovi bo'lsin.", en: 'One chart: eight comparison sentences, each with a measure of the gap.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Part 2 qolipi va Part 3 ORPER', en: 'The Part 2 shape and Part 3 ORPER' },
                   t: { uz: "1 ta kartochka (2 daq) + 2 ta Part 3 savoli: Opinion→Reason→Explanation→Example→Result.", en: 'One cue card (2 min) plus two Part 3 questions: Opinion→Reason→Explanation→Example→Result.' } }
    },

    /* ---------- 7-hafta · Task 2 ustasi ---------- */
    7: {
      grammar:   { f: { uz: 'Insho uchun qurilmalar', en: 'Structures for essays' },
                   t: { uz: "Har insho turiga mos qurilma: shart gap, qarama-qarshilik, majhul.", en: 'Match a structure to each essay type: conditional, contrast, passive.' } },
      vocab:     { f: { uz: 'Fikr bildirish va bog\'lash', en: 'Opinion and cohesion' },
                   t: { uz: "10 ta akademik ibora. So'zlashuv variantini ham yoz (a lot of → a significant number of).", en: 'Ten academic phrases with their colloquial counterparts (a lot of → a significant number of).' } },
      listening: { f: { uz: 'Section 3 — suhbat', en: 'Section 3 — discussion' },
                   t: { uz: "1 ta Section 3 mashqi. Kim nima dedi — ismlarni belgilab bor.", en: 'One Section 3 exercise. Track who said what by name.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Sentence completion', en: 'Sentence completion' },
                   t: { uz: "10 ta savol. So'z chegarasiga qat'iy rioya qil.", en: 'Ten questions. Respect the word limit strictly.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Beshta insho turi', en: 'The five essay types' },
                   t: { uz: "Bugungi tur bo'yicha to'liq insho (40 daq), keyin REWRITE.", en: 'A full essay in today\'s type (40 min), then the REWRITE.' },
                   r: { uz: "Ikkita turdagi inshoni taqqoslab tahlil qil.", en: 'Compare and analyse essays of two different types.' } },
      speaking:  { f: { uz: 'Part 3 — chuqur javob', en: 'Part 3 — developed answers' },
                   t: { uz: "3 ta Part 3 savoli. Har javob kamida 4 gap va bitta misol bilan.", en: 'Three Part 3 questions, each answered in at least four sentences with an example.' } }
    },

    /* ---------- 8-hafta · Ot guruhi + 2-mock ---------- */
    8: {
      grammar:   { f: { uz: 'Artikl, sanaladigan, miqdor, predlog', en: 'Articles, countability, quantifiers, prepositions' },
                   t: { uz: "Oldingi inshongni ochib, faqat artikllarni tekshir. Nechta xato?", en: 'Open a previous essay and check only the articles. How many errors?' } },
      vocab:     { f: { uz: 'Akademik ot birikmalari', en: 'Academic noun phrases' },
                   t: { uz: "10 ta sanalmaydigan otni miqdor so'zi bilan yoz (a piece of advice).", en: 'Ten uncountable nouns with their unit words (a piece of advice).' } },
      listening: { f: { uz: "Section 3–4 — ma'ruza", en: 'Sections 3–4 — lecture' },
                   t: { uz: "1 ta Section 4 mashqi. Bu eng qiyini — transkriptni albatta o'qi.", en: 'One Section 4 exercise. This is the hardest — always read the transcript.' },
                   r: { uz: 'MOCK: to\'liq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Savol turlari aralash', en: 'Mixed question types' },
                   t: { uz: "1 ta matn 20 daqiqada. Vaqtni belgilab bor.", en: 'One passage in 20 minutes. Track the time.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: 'Vaqt bilan yozish', en: 'Writing under time' },
                   t: { uz: "40 daqiqada to'liq insho — to'xtamasdan, lug'atsiz.", en: 'A full essay in 40 minutes — no stopping, no dictionary.' },
                   r: { uz: 'MOCK: Task 1 + Task 2, 60 daqiqa.', en: 'MOCK: Task 1 + Task 2, 60 minutes.' } },
      speaking:  { f: { uz: 'Uchala qism birga', en: 'All three parts together' },
                   t: { uz: "Part 1 (4 savol) → Part 2 (1 kartochka) → Part 3 (2 savol), to'xtamasdan.", en: 'Part 1 (4 questions) → Part 2 (1 card) → Part 3 (2 questions), without stopping.' },
                   r: { uz: 'MOCK: to\'liq Speaking, yozib olingan.', en: 'MOCK: full Speaking, recorded.' } }
    },

    /* ---------- 9-hafta · Akademik lug'at ---------- */
    9: {
      grammar:   { f: { uz: "So'z shakllari", en: 'Word forms' },
                   t: { uz: "10 ta o'zakning to'rt shaklini yoz: ot · sifat · fe'l · ravish.", en: 'Write all four forms of ten roots: noun · adjective · verb · adverb.' } },
      vocab:     { f: { uz: "9 ta akademik mavzu", en: 'Nine academic topics' },
                   t: { uz: "10–15 ta so'z. Har birini gapirishda VA yozishda ishlat — ikkalasida ham.", en: '10–15 words, each used in speaking AND in writing.' } },
      listening: { f: { uz: 'Section 4 — akademik ma\'ruza', en: 'Section 4 — academic lecture' },
                   t: { uz: "1 ta mashq. Notanish so'zlarni yozib bor — ular Reading'da ham chiqadi.", en: 'One exercise. Note unfamiliar words — they reappear in Reading.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Kontekstdan so\'z ma\'nosi', en: 'Vocabulary from context' },
                   t: { uz: "Matndan 10 ta notanish so'zni kontekst bo'yicha taxmin qil, keyin tekshir.", en: 'Guess ten unfamiliar words from context, then check them.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Lexical Resource mezoni', en: 'The Lexical Resource criterion' },
                   t: { uz: "Insho yoz, keyin takrorlangan so'zlarni sanab, sinonim bilan almashtir.", en: 'Write an essay, count repeated words, then replace them with synonyms.' },
                   r: { uz: "To'liq Writing testi + lug'at tahlili.", en: 'Full Writing test plus a vocabulary review.' } },
      speaking:  { f: { uz: 'Mavzu lug\'ati nutqda', en: 'Topic vocabulary in speech' },
                   t: { uz: "3 ta savol. Bugungi 5 ta yangi so'zni javoblarga kiritishga urin.", en: 'Three questions. Try to work five of today\'s new words into your answers.' } }
    },

    /* ---------- 10-hafta · Band 7+ grammatikasi ---------- */
    10: {
      grammar:   { f: { uz: 'Shaxsiy xatolar ustida ish', en: 'Working on your own errors' },
                   t: { uz: "Xatolar daftaridan bugungi xatoga qarshi 10 ta to'g'ri gap yoz.", en: 'Write ten correct sentences against today\'s error from your log.' } },
      vocab:     { f: { uz: "Noto'g'ri ishlatilgan so'zlar", en: 'Misused words' },
                   t: { uz: "Inshongdagi noto'g'ri shakldagi so'zlarni topib, to'g'ri shaklda qayta yoz.", en: 'Find wrongly formed words in your essays and rewrite them correctly.' } },
      listening: { f: { uz: 'Imlo va format xatolari', en: 'Spelling and format errors' },
                   t: { uz: "1 ta mashq. Faqat imlo va so'z chegarasi xatolarini sanab chiq.", en: 'One exercise. Count only spelling and word-limit errors.' },
                   r: { uz: "To'liq test + imlo ro'yxati.", en: 'Full test plus a spelling list.' } },
      reading:   { f: { uz: 'Paraphrase-ni tanish (chuqur)', en: 'Paraphrase recognition (deep)' },
                   t: { uz: "10 ta savol–matn juftligini yonma-yon yozib, to'rt paraphrase usulini belgila.", en: 'Write ten question–text pairs side by side and label the four paraphrase tools.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Aniqlik (Grammatical Accuracy)', en: 'Grammatical accuracy' },
                   t: { uz: "Insho yoz, keyin 4 o'tishli tekshiruv. Har o'tishda nechta xato topganingni yoz.", en: 'Write an essay, then run the four passes. Record how many errors each pass finds.' },
                   r: { uz: "To'liq test + xato statistikasi.", en: 'Full test plus error statistics.' } },
      speaking:  { f: { uz: "O'zini tuzatish", en: 'Self-correction' },
                   t: { uz: "Javobingni tinglab, xatoni topganingda TO'XTAMASDAN tuzatishni mashq qil.", en: 'Listen back and practise correcting an error WITHOUT stopping.' } }
    },

    /* ---------- 11-hafta · Reading tezligi ---------- */
    11: {
      grammar:   { f: { uz: 'Uzun gapni tushunish', en: 'Parsing long sentences' },
                   t: { uz: "Matndan 5 ta uzun gapni olib, bosh gapini ajratib chiq.", en: 'Take five long sentences from a passage and isolate the main clause.' } },
      vocab:     { f: { uz: 'Sinonim juftliklari', en: 'Synonym pairs' },
                   t: { uz: "15 ta sinonim juftligi: matndagi so'z ↔ savoldagi so'z.", en: 'Fifteen synonym pairs: the word in the text ↔ the word in the question.' } },
      listening: { f: { uz: 'Section 4 tezligi', en: 'Section 4 speed' },
                   t: { uz: "1 ta mashq 1.25× tezlikda. Keyin normal tezlikda tekshir.", en: 'One exercise at 1.25× speed, then check at normal speed.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: '60 daqiqa / 40 savol strategiyasi', en: 'The 60-minute / 40-question strategy' },
                   t: { uz: "1 ta matn 18 daqiqada. Bitta savolga 1.5 daqiqadan ortiq sarflama.", en: 'One passage in 18 minutes. Never spend more than 90 seconds on a question.' },
                   r: { uz: "To'liq test — vaqtni har matn bo'yicha alohida o'lchab.", en: 'Full test, timing each passage separately.' } },
      writing:   { f: { uz: 'Cohesion — bog\'lash', en: 'Cohesion' },
                   t: { uz: "Inshodagi bog'lovchi so'zlarni sanab chiq. Abzatsda 2 tadan ko'p bo'lsa — kamaytir.", en: 'Count the connectors in your essay. More than two per paragraph — cut them.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Ravonlik — pauzasiz', en: 'Fluency — no pauses' },
                   t: { uz: "2 daqiqa to'xtamasdan gapir. Pauzalarni sana, ertaga kamaytir.", en: 'Speak for two minutes without stopping. Count the pauses and reduce them tomorrow.' } }
    },

    /* ---------- 12-hafta · 3-mock ---------- */
    12: {
      grammar:   { f: { uz: 'Mustahkamlash', en: 'Consolidation' },
                   t: { uz: "Eng ko'p xato qilgan 3 ta mavzuning cheatsheet'ini qayta o'qi.", en: 'Reread the cheatsheets for your three weakest topics.' } },
      vocab:     { f: { uz: 'Aktiv lug\'at tekshiruvi', en: 'Active vocabulary check' },
                   t: { uz: "Daftardagi 30 ta so'zni yopib, ma'nosini va kollokatsiyasini eslashga urin.", en: 'Cover 30 words in your notebook and try to recall meanings and collocations.' } },
      listening: { f: { uz: 'Barcha bo\'limlar', en: 'All sections' },
                   t: { uz: "1 ta mashq — eng zaif bo'limingdan.", en: 'One exercise from your weakest section.' },
                   r: { uz: 'MOCK: to\'liq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Barcha savol turlari', en: 'All question types' },
                   t: { uz: "Eng zaif savol turingdan 10 ta savol.", en: 'Ten questions of your weakest type.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: 'Ikkala vazifa birga', en: 'Both tasks together' },
                   t: { uz: "Task 1 (20 daq) — vaqtga qat'iy rioya qil.", en: 'Task 1 (20 min) — hold to the time strictly.' },
                   r: { uz: 'MOCK: Task 1 + Task 2, 60 daqiqa.', en: 'MOCK: Task 1 + Task 2, 60 minutes.' } },
      speaking:  { f: { uz: "To'liq format", en: 'Full format' },
                   t: { uz: "Part 2 + Part 3, uzoq pauzasiz o'tish.", en: 'Part 2 into Part 3 with no long pause.' },
                   r: { uz: 'MOCK: to\'liq Speaking.', en: 'MOCK: full Speaking.' } }
    },

    /* ---------- 13-hafta · Band 8 yozish ---------- */
    13: {
      grammar:   { f: { uz: 'Nominalizatsiya va hedging', en: 'Nominalisation and hedging' },
                   t: { uz: "5 ta fe'lli gapni ot shakliga o'tkaz, 5 ta qat'iy gapni yumshat.", en: 'Turn five verb sentences into noun phrases; soften five absolute claims.' } },
      vocab:     { f: { uz: 'Aniq so\'z tanlash', en: 'Precise word choice' },
                   t: { uz: "10 ta umumiy so'zni aniqroq varianti bilan almashtir (big → substantial).", en: 'Replace ten general words with more precise ones (big → substantial).' } },
      listening: { f: { uz: "Zaif bo'lim ustida ish", en: 'Work on the weak section' },
                   t: { uz: "1 ta mashq + transkript. Har xatoni sababi bilan yoz.", en: 'One exercise plus transcript. Log every error with its reason.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Inference va muallif fikri', en: 'Inference and author\'s opinion' },
                   t: { uz: "10 ta savol: muallif nimani AYTMAGAN, lekin nazarda tutgan?", en: 'Ten questions: what did the author imply without stating?' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: "To'rt mezon bo'yicha Band 8", en: 'Band 8 across four criteria' },
                   t: { uz: "Insho yoz, keyin 4 mezon bo'yicha o'zingni 0–9 da bahola va sababini yoz.", en: 'Write an essay, then score yourself 0–9 on each criterion with a reason.' },
                   r: { uz: "To'liq test + mezon bo'yicha tahlil.", en: 'Full test plus criterion-by-criterion analysis.' } },
      speaking:  { f: { uz: 'Mazmunli javob', en: 'Substantial answers' },
                   t: { uz: "3 ta Part 3 savoli: Claim → Explanation → Example → Contrast.", en: 'Three Part 3 questions: Claim → Explanation → Example → Contrast.' } }
    },

    /* ---------- 14-hafta · Band 8 gapirish ---------- */
    14: {
      grammar:   { f: { uz: "Og'zaki nutqda aniqlik", en: 'Accuracy in speech' },
                   t: { uz: "Yozuvingni tinglab, grammatik xatolarni sanab chiq. Ertaga shu xatoga e'tibor.", en: 'Listen back and count grammar errors. Target that error tomorrow.' } },
      vocab:     { f: { uz: 'Gapirish uchun lug\'at', en: 'Vocabulary for speaking' },
                   t: { uz: "10 ta so'z: yozuvda emas, GAPDA ishlatiladiganlaridan.", en: 'Ten words — the kind used in speech, not in writing.' } },
      listening: { f: { uz: "Bog'langan nutq", en: 'Connected speech' },
                   t: { uz: "2 daqiqalik parchani shadowing qil: urg'u va intonatsiyani takrorla.", en: 'Shadow a two-minute passage: copy the stress and intonation.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Tezlik saqlash', en: 'Maintaining speed' },
                   t: { uz: "1 ta matn 18 daqiqada.", en: 'One passage in 18 minutes.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Tez yozish', en: 'Writing fast' },
                   t: { uz: "35 daqiqada to'liq insho — vaqtni qisqartirib mashq qil.", en: 'A full essay in 35 minutes — practise with less time than you have.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Talaffuz va ikkilanish nazorati', en: 'Pronunciation and hesitation control' },
                   t: { uz: "Part 2 (2 daq) + Part 3 (3 savol). Ikkilanish o'rniga to'ldiruvchi ishlat.", en: 'Part 2 (2 min) + Part 3 (3 questions). Use a filler instead of hesitating.' } }
    },

    /* ---------- 15-hafta · To'liq mashg'ulot ---------- */
    15: {
      grammar:   { f: { uz: 'Cheatsheet takrori', en: 'Cheatsheet review' },
                   t: { uz: "Bir guruh mavzuni (masalan zamonlar) to'liq qayta ko'rib chiq.", en: 'Review one whole group of topics (for example the tenses).' } },
      vocab:     { f: { uz: 'Barcha to\'plamlar takrori', en: 'Reviewing all sets' },
                   t: { uz: "2 ta to'plamni qayta ko'rib chiq, unutilganlarini belgila.", en: 'Review two sets and mark what you have forgotten.' } },
      listening: { f: { uz: "Haftasiga 2–3 to'liq test", en: '2–3 full tests a week' },
                   t: { uz: "To'liq test — real vaqt, keyin transkript.", en: 'Full test under real timing, then the transcript.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: "Haftasiga 2–3 to'liq test", en: '2–3 full tests a week' },
                   t: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Haftasiga 3 sessiya', en: 'Three sessions a week' },
                   t: { uz: "Task 1 yoki Task 2 — vaqt bilan, keyin REWRITE.", en: 'Task 1 or Task 2, timed, then the REWRITE.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Kuniga 30 daqiqa', en: '30 minutes a day' },
                   t: { uz: "Part 1 (10 daq) + Part 2 (10 daq) + Part 3 (10 daq).", en: 'Part 1 (10 min) + Part 2 (10 min) + Part 3 (10 min).' } }
    },

    /* ---------- 16-hafta · 4-mock ---------- */
    16: {
      grammar:   { f: { uz: 'Rasmiy uslub va inversiya', en: 'Register and inversion' },
                   t: { uz: "5 ta so'zlashuv iborasini akademik variant bilan almashtir.", en: 'Replace five colloquial phrases with academic equivalents.' } },
      vocab:     { f: { uz: 'Takrordan qochish', en: 'Avoiding repetition' },
                   t: { uz: "Bitta tushunchani 4 xil aytishni yoz (policy → measure → initiative → scheme).", en: 'Write four ways to say one concept (policy → measure → initiative → scheme).' } },
      listening: { f: { uz: 'Eng qiyin savol turlari', en: 'The hardest question types' },
                   t: { uz: "Xarita/diagramma yoki matching savollaridan 1 ta mashq.", en: 'One exercise on maps/diagrams or matching questions.' },
                   r: { uz: 'MOCK: to\'liq Listening.', en: 'MOCK: full Listening.' } },
      reading:   { f: { uz: 'Eng qiyin savol turlari', en: 'The hardest question types' },
                   t: { uz: "Matching features yoki summary completion — 10 ta savol.", en: 'Matching features or summary completion — ten questions.' },
                   r: { uz: 'MOCK: 3 ta matn, 60 daqiqa.', en: 'MOCK: three passages, 60 minutes.' } },
      writing:   { f: { uz: '40 daqiqada Band 8', en: 'Band 8 in 40 minutes' },
                   t: { uz: "To'liq insho 40 daqiqada — mezonlarni yodda tutib.", en: 'A full essay in 40 minutes with the criteria in mind.' },
                   r: { uz: 'MOCK: Task 1 + Task 2.', en: 'MOCK: Task 1 + Task 2.' } },
      speaking:  { f: { uz: "To'liq format, bosim ostida", en: 'Full format under pressure' },
                   t: { uz: "Uchala qism ketma-ket, to'xtamasdan.", en: 'All three parts back to back, without stopping.' },
                   r: { uz: 'MOCK: to\'liq Speaking.', en: 'MOCK: full Speaking.' } }
    },

    /* ---------- 17-hafta · Zaifliklarni yo'q qilish ---------- */
    17: {
      grammar:   { f: { uz: 'Top 10 xato', en: 'The top ten errors' },
                   t: { uz: "Bugungi xatoga qarshi 15 ta gap. Ertaga qayta tekshir.", en: 'Fifteen sentences against today\'s error. Retest tomorrow.' } },
      vocab:     { f: { uz: "So'z takrori va zaif so'zlar", en: 'Repetition and weak words' },
                   t: { uz: "Oxirgi 3 ta inshongdan takrorlangan so'zlarni topib almashtir.", en: 'Find repeated words in your last three essays and replace them.' } },
      listening: { f: { uz: 'Takrorlanuvchi xatolar', en: 'Recurring errors' },
                   t: { uz: "Faqat o'zing ko'p xato qiladigan savol turidan mashq qil.", en: 'Practise only the question type you keep getting wrong.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Vaqt taqsimoti', en: 'Time allocation' },
                   t: { uz: "1 ta matn, har savolga sarflangan vaqtni yozib bor.", en: 'One passage, recording the time spent on every question.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Zaif kirish va misollar', en: 'Weak introductions and examples' },
                   t: { uz: "Eski inshoning kirish qismini va misollarini qayta yoz.", en: 'Rewrite the introduction and examples of an old essay.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Ikkilanishni kamaytirish', en: 'Reducing hesitation' },
                   t: { uz: "Javobni yozib ol, pauzalarni sana, ikkinchi urinishda kamaytir.", en: 'Record an answer, count the pauses, reduce them on the retake.' } }
    },

    /* ---------- 18-hafta · To'liq simulyatsiya ---------- */
    18: {
      grammar:   { f: { uz: 'Yengil takror', en: 'Light review' },
                   t: { uz: "Xatolar daftarini 15 daqiqa ko'rib chiq — yangi qoida o'rganma.", en: 'Skim the error log for 15 minutes — learn no new rules.' } },
      vocab:     { f: { uz: 'Aktiv so\'zlarni saqlash', en: 'Keeping words active' },
                   t: { uz: "20 ta so'zni gapda ishlat — yangi so'z qo'shma.", en: 'Use 20 known words in sentences — add no new ones.' } },
      listening: { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Simulyatsiyaning Listening qismi — telefon yo'q, pauza yo'q.", en: 'The Listening part of the simulation — no phone, no pauses.' },
                   r: { uz: "Natijalarni taqqoslash.", en: 'Compare the results.' } },
      reading:   { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Simulyatsiyaning Reading qismi — 60 daqiqa qat'iy.", en: 'The Reading part — a strict 60 minutes.' },
                   r: { uz: "Natijalarni taqqoslash.", en: 'Compare the results.' } },
      writing:   { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "Task 1 + Task 2, 60 daqiqa, uzluksiz.", en: 'Task 1 + Task 2, 60 minutes, uninterrupted.' },
                   r: { uz: "Ikki simulyatsiyani taqqoslab tahlil qil.", en: 'Compare and analyse both simulations.' } },
      speaking:  { f: { uz: 'Simulyatsiya', en: 'Simulation' },
                   t: { uz: "To'liq Speaking — yozib olingan, tayyorgarliksiz.", en: 'Full Speaking — recorded, unprepared.' } }
    },

    /* ---------- 19-hafta · Yakuniy sozlash ---------- */
    19: {
      grammar:   { f: { uz: 'Faqat xatolar', en: 'Errors only' },
                   t: { uz: "Xatolar daftarining eng tepasidagi 3 ta xatoni mashq qil.", en: 'Drill the top three errors in your log.' } },
      vocab:     { f: { uz: 'Ishonchli so\'zlar', en: 'Words you trust' },
                   t: { uz: "Imtihonda ishlatadigan 30 ta so'zni tanlab, ro'yxat qil.", en: 'Pick 30 words you will actually use in the exam and list them.' } },
      listening: { f: { uz: 'Takrorlanuvchi xatolar', en: 'Recurring errors' },
                   t: { uz: "1 ta mashq. Faqat o'z xatolaringga e'tibor.", en: 'One exercise, focusing only on your own errors.' },
                   r: { uz: "To'liq test.", en: 'Full test.' } },
      reading:   { f: { uz: 'Vaqtni mukammal boshqarish', en: 'Perfect timing' },
                   t: { uz: "3 ta matn: 17 + 20 + 23 daqiqa taqsimoti bilan.", en: 'Three passages split 17 + 20 + 23 minutes.' },
                   r: { uz: "To'liq test — 60 daqiqa.", en: 'Full test — 60 minutes.' } },
      writing:   { f: { uz: 'Proofreading tizimi', en: 'The proofreading system' },
                   t: { uz: "Insho yoz, oxirgi 5 daqiqada 4 o'tishli tekshiruvni bajar.", en: 'Write an essay and run the four passes in the last five minutes.' },
                   r: { uz: "To'liq Writing testi.", en: 'Full Writing test.' } },
      speaking:  { f: { uz: 'Har kuni gapirish', en: 'Daily speaking' },
                   t: { uz: "30 daqiqa. Yangi mavzu emas — ishonchli javoblarni sayqalla.", en: '30 minutes. No new topics — polish the answers you trust.' } }
    },

    /* ---------- 20-hafta · Imtihon rejimi ---------- */
    20: {
      grammar:   { f: { uz: 'Yengil takror', en: 'Light review' },
                   t: { uz: "Cheatsheet'ni ko'z bilan ko'rib chiq — mashq qilma, tanish.", en: 'Skim the cheatsheet — recognise, do not drill.' } },
      vocab:     { f: { uz: 'Yangi so\'z YO\'Q', en: 'NO new words' },
                   t: { uz: "Faqat 30 ta tanlangan so'zni takrorla. 500 ta yangi so'z yodlama.", en: 'Review only your 30 chosen words. Do not cram 500 new ones.' } },
      listening: { f: { uz: 'Quloqni ochiq tutish', en: 'Keeping the ear warm' },
                   t: { uz: "20 daqiqa yengil tinglash — test emas, podkast ham bo'ladi.", en: '20 minutes of light listening — a podcast is fine, not a test.' },
                   r: { uz: "1 ta to'liq test — oxirgisi.", en: 'One full test — the last one.' } },
      reading:   { f: { uz: 'Vaqt hissi', en: 'Sense of timing' },
                   t: { uz: "1 ta matn 18 daqiqada — tezlikni yo'qotmaslik uchun.", en: 'One passage in 18 minutes — just to keep the pace.' },
                   r: { uz: "1 ta to'liq test.", en: 'One full test.' } },
      writing:   { f: { uz: 'Ishonchli qolip', en: 'The structure you trust' },
                   t: { uz: "1 ta insho — yangi qurilma sinamang, ishonchli qolipda yoz.", en: 'One essay — no new structures, use the shape you trust.' },
                   r: { uz: "Oxirgi to'liq Writing testi.", en: 'The final full Writing test.' } },
      speaking:  { f: { uz: 'Ovozni ochiq tutish', en: 'Keeping the voice warm' },
                   t: { uz: "15–20 daqiqa gapir. Imtihon kuni ovoz \"sovuq\" bo'lmasin.", en: 'Speak for 15–20 minutes so your voice is not cold on exam day.' } }
    }
  },

  /* Kunga xos vazifalar — haftalik dasturni bosadi.
     Faqat kun HAQIQATAN boshqacha bo'lganda yoziladi (mock, kirish testi). */
  days: {
    2: { listening: { t: { uz: "BOSHLANG'ICH O'LCHOV: to'liq Listening testi.", en: 'BASELINE: full Listening test.' } },
         reading:   { t: { uz: "BOSHLANG'ICH O'LCHOV: to'liq Reading testi, 60 daqiqa.", en: 'BASELINE: full Reading test, 60 minutes.' } } },
    4: { grammar:   { t: { uz: "Mock oldidan grammatika takrori — 15 daqiqa, ko'proq emas.", en: 'A 15-minute grammar review before the mock — no more.' } } },
    32: { grammar:  { t: { uz: "Mock kuni yangi qoida o'rganma. Faqat xatolar daftarini ko'r.", en: 'Learn no new rules on mock day. Just look at the error log.' } },
          vocab:    { t: { uz: "Yangi so'z yo'q — bilganlaringni ishlat.", en: 'No new words — use what you know.' } } }
  }
};
