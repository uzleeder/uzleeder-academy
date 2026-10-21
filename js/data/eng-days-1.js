/* ==========================================================================
   ENG_DAYS — 1-qism: kirish (1–4) va 1-bosqich "Poydevor" (5–32)
   --------------------------------------------------------------------------
   Kalendar:
     1–4-kun     16–19-sen 2026  — kirish bloki (chorshanbadan shanbagacha; 20-sen bo'sh)
     5–140-kun   21-sen 2026 → 7-fev 2027 — 20 hafta, dushanbadan yakshanbagacha

   Shu hisobda HAR haftaning 3-kuni aynan yakshanbaga tushadi (test kuni),
   2-, 4-, 2-kunlari esa Se/Pa/Sha — Everest LC kunlari. Ya'ni jadval
   taqvim bilan o'z-o'zidan mos keladi, hech qayerda qattiq yozilmagan.

   Kun obyekti:
     d        — umumiy kun raqami (1–140)
     w        — hafta (0 = kirish, 1–20)
     i        — hafta ichidagi kun (1–7)
     title    — kun sarlavhasi
     intro    — kun nima haqida (2–3 gap)
     gram     — ENG_GRAMMAR kaliti → shu kunning cheatsheet'i sahifaga chiziladi
     vocab    — ENG_VOCAB kaliti → lug'at to'plami
     focus    — qaysi ko'nikmalarga tegadi
     sections — [{h, p, ex[]}] to'liq tushuntirish (course.js dagi sections kabi)
     practice — bajariladigan mashqlar
     konspekt — daftarga ko'chiriladigan qatorlar
     quiz     — faqat yakshanba kunlari (i === 7): haftalik nazorat
   ========================================================================== */
window.ENG_DAYS_1 = [

/* ====================== KIRISH BLOKI (1–4) ============================== */
{
  d: 1, w: 0, i: 1, focus: ['reading', 'listening'],
  title: { uz: 'IELTS nima va u nimani o\'lchaydi', en: 'What IELTS is and what it measures' },
  intro: {
    uz: "Birinchi kun grammatikadan boshlanmaydi. Avval nishonni ko'rish kerak: imtihon nechta qismdan iborat, har qaysisi qancha davom etadi va ball qanday qo'yiladi. Buni bilmasdan tayyorlanish — xaritasiz yurish.",
    en: "Day one does not start with grammar. First you need to see the target: how many parts the exam has, how long each lasts and how the score is produced. Preparing without this is walking without a map."
  },
  sections: [
    {
      h: { uz: "To'rt bo'lim, bitta kun", en: 'Four sections, one day' },
      p: {
        uz: "Listening (30 daq, 40 savol), Reading (60 daq, 40 savol), Writing (60 daq, 2 vazifa) ketma-ket, tanaffussiz o'tadi. Speaking (11–14 daq) alohida — o'sha kuni yoki bir hafta ichida. Listening va Readingda 40 ta xom ball band ballga aylanadi; Writing va Speaking esa mezon bo'yicha inson tomonidan baholanadi.",
        en: 'Listening (30 min, 40 questions), Reading (60 min, 40 questions) and Writing (60 min, 2 tasks) run back to back with no break. Speaking (11–14 min) is separate, on the same day or within a week. Listening and Reading convert 40 raw marks into a band; Writing and Speaking are marked by a human against criteria.'
      },
      ex: ['Listening 30 + Reading 60 + Writing 60 = 2 soat 30 daqiqa uzluksiz.']
    },
    {
      h: { uz: 'Band shkalasi va umumiy ball', en: 'The band scale and the overall score' },
      p: {
        uz: "Har bo'lim 0 dan 9 gacha, 0.5 qadam bilan baholanadi. Umumiy ball — to'rttasining o'rtachasi, eng yaqin yarim balga yaxlitlangan holda. Muhimi shu: bitta zaif bo'lim hammasini pastga tortadi. 8+8+6.5+7 = 7.375 → 7.5. Ya'ni 8.0 uchun barcha bo'limlarda barqaror bo'lish kerak, bittasida zo'r bo'lish yetmaydi.",
        en: 'Each section is scored 0–9 in half-band steps. The overall score is the average of the four, rounded to the nearest half band. What matters: one weak section drags everything down. 8+8+6.5+7 = 7.375 → 7.5. For an 8.0 you need consistency across all four, not brilliance in one.'
      },
      ex: ['L 8.0 · R 8.0 · W 7.0 · S 7.5 → 7.625 → Overall 7.5', 'L 8.5 · R 8.5 · W 7.5 · S 7.5 → 8.0']
    },
    {
      h: { uz: 'Writing va Speaking qanday baholanadi', en: 'How Writing and Speaking are marked' },
      p: {
        uz: "Ikkalasida ham to'rtta teng mezon bor. Writing: Task Response (savolga to'liq javob berdingmi), Coherence & Cohesion (fikr oqadimi), Lexical Resource (lug'at), Grammatical Range & Accuracy. Speaking: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation. Har biri 25% — ya'ni chiroyli lug'at bilan zaif tuzilmani qoplab bo'lmaydi.",
        en: 'Both use four equally weighted criteria. Writing: Task Response (did you fully answer), Coherence & Cohesion (does it flow), Lexical Resource, Grammatical Range & Accuracy. Speaking: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation. Each is 25%, so rich vocabulary cannot compensate for weak structure.'
      },
      ex: ['4 mezon × 25% = 100%. Bittasi 6.0 bo\'lsa, qolgani 8.0 bo\'lsa ham natija 7.5.']
    }
  ],
  practice: [
    { uz: "Rasmiy IELTS band descriptors (Writing va Speaking) ni topib, 7 va 8 ustunlarini yonma-yon o'qib chiq.", en: 'Find the official IELTS band descriptors for Writing and Speaking and read the 7 and 8 columns side by side.' },
    { uz: "Bitta to'liq Listening testini shunchaki TINGLA — javob berma, formatni his qil.", en: 'Just LISTEN to one full Listening test — do not answer, simply feel the format.' },
    { uz: "Bitta Reading matnini vaqtsiz o'qib chiq: nechta savol turi borligini sana.", en: 'Read one Reading passage without timing and count how many question types appear.' },
    { uz: "Xatolar daftari uchun alohida daftar yoki fayl och — 20 hafta shu bilan yuradi.", en: 'Open a dedicated notebook or file for your error log — it will run for all 20 weeks.' }
  ],
  konspekt: {
    uz: ['L 30daq/40 · R 60daq/40 · W 60daq/2 vazifa · S 11–14daq', "Umumiy ball = 4 bo'lim o'rtachasi, .25 → yuqoriga", "Writing/Speaking: 4 mezon, har biri 25%", 'Bitta zaif bo\'lim umumiy ballni pastga tortadi'],
    en: ['L 30min/40 · R 60min/40 · W 60min/2 tasks · S 11–14min', 'Overall = average of four, .25 rounds up', 'Writing/Speaking: 4 criteria, 25% each', 'One weak section drags the overall down']
  }
},

{
  d: 2, w: 0, i: 2, focus: ['grammar', 'vocab'],
  title: { uz: 'Boshlang\'ich daraja va xatolar daftari', en: 'Baseline level and the error log' },
  intro: {
    uz: "Bugun o'zingni o'lchaysan. Ball past chiqishi mumkin va bu normal — biz boshlang'ich nuqtani qidiryapmiz, natijani emas. Shu bilan birga 20 hafta davomida ishlatiladigan eng muhim vositani — xatolar daftarini — ochamiz.",
    en: 'Today you measure yourself. The score may be low and that is fine — we are looking for a starting point, not a result. At the same time you open the single most important tool of the next 20 weeks: the error log.'
  },
  sections: [
    {
      h: { uz: 'Nega xatolar daftari ishlaydi', en: 'Why an error log works' },
      p: {
        uz: "Odam bir xil xatoni qayta-qayta qiladi — lekin qaysi xatoni ekanini bilmaydi. Yozib borsang, ikki haftadan keyin ro'yxatda 40 ta emas, 8–10 ta TAKRORLANUVCHI xato borligi ma'lum bo'ladi. Shu 10 tasini yopish — 50 ta yangi qoida o'rganishdan foydali.",
        en: 'People repeat the same mistakes without knowing which ones. Once you write them down, after two weeks the list shows not 40 errors but 8–10 RECURRING ones. Closing those ten is worth more than learning fifty new rules.'
      },
      ex: ['Xato → To\'g\'risi → Nega', 'he go → he goes → 3-shaxs birlikda -s', 'informations → information → sanalmaydi']
    },
    {
      h: { uz: 'Daftar shakli', en: 'The log format' },
      p: {
        uz: "Uch ustun yetadi: NIMA yozdim, QANDAY bo'lishi kerak edi, NEGA. Uchinchi ustun eng muhimi — sababni yozmasang, xato qaytadi. Har xatoga sana qo'y: agar bir xato uch hafta ketma-ket chiqsa, u shu haftaning asosiy vazifasiga aylanadi.",
        en: 'Three columns are enough: what I wrote, what it should be, and why. The third column matters most — without the reason the error returns. Date every entry: if one error appears three weeks running, it becomes that week\'s main task.'
      },
      ex: ['09-sen | I am agree | I agree | agree — fe\'l, am kerak emas']
    }
  ],
  practice: [
    { uz: "To'liq Reading testini vaqt bilan bajar (60 daqiqa, 40 savol).", en: 'Do a full Reading test under timing (60 minutes, 40 questions).' },
    { uz: "To'liq Listening testini bajar (30 daqiqa + 10 daqiqa ko'chirish).", en: 'Do a full Listening test (30 minutes + 10 to transfer answers).' },
    { uz: "Har noto'g'ri javob uchun matndan DALILNI topib, daftarga yoz.", en: 'For every wrong answer, find the evidence in the text and log it.' },
    { uz: "Xatolar daftarining birinchi 10 qatorini to'ldir.", en: 'Fill in the first ten rows of your error log.' }
  ],
  konspekt: {
    uz: ['Xato → To\'g\'risi → Nega (uch ustun)', 'Har xatoga sana qo\'y', '3 hafta takrorlangan xato — o\'sha haftaning vazifasi', 'Sababsiz yozilgan xato qaytadi'],
    en: ['Mistake → Correction → Why (three columns)', 'Date every entry', 'An error repeating for 3 weeks becomes that week\'s task', 'An entry without a reason will come back']
  }
},

{
  d: 3, w: 0, i: 3, focus: ['grammar', 'vocab', 'speaking'],
  title: { uz: "O'quv tizimi: olti ko'nikma bir zanjirda", en: 'The study system: six skills in one chain' },
  intro: {
    uz: "Ko'pchilik grammatikani alohida, lug'atni alohida, Speakingni alohida o'rganadi — va hech biri ikkinchisiga ulanmaydi. Natija: qoidani biladi, lekin gapirolmaydi. Bugun shu muammoning yechimini o'rnatamiz.",
    en: 'Most learners study grammar separately, vocabulary separately and speaking separately — and none of it connects. The result: they know the rule but cannot speak. Today we install the fix for that.'
  },
  sections: [
    {
      h: { uz: 'Zanjir: o\'qish → lug\'at → grammatika → gapirish → yozish', en: 'The chain: reading → vocabulary → grammar → speaking → writing' },
      p: {
        uz: "Bitta material beshta bosqichdan o'tadi. Matnni o'qiysan → undan 10 ta so'z olasan → shu so'zlarni bugungi grammatik qurilmada gapga solasan → shu gaplarni ovoz chiqarib aytasan → inshoga yozasan. Bir soatlik ish, lekin so'z passivdan aktivga o'tadi.",
        en: 'One piece of material passes through five stages. You read a text → take ten words from it → put those words into today\'s grammar structure → say those sentences aloud → write them into an essay. It takes an hour, but the words move from passive to active.'
      },
      ex: ['Matn: "urban congestion"', 'So\'z: congestion + traffic congestion, reduce congestion', 'Grammatika (Present Perfect): Traffic congestion has become far worse.', 'Gapirish: yozib ol va tinglab chiq', 'Yozish: insho abzatsiga qo\'y']
    },
    {
      h: { uz: 'Grammatikaning 7 qadami', en: 'The seven steps for grammar' },
      p: {
        uz: "O'rgan → mashq qil → 5–10 ta O'Z gapingni yoz → shu grammatika bilan gapir → inshoda ishlat → xatoni top → takrorla. Uchinchi qadam eng ko'p tashlab ketiladi va aynan u passiv bilimni aktivga aylantiradi. Mashq kitobidagi bo'shliqni to'ldirish — o'rganish emas, tanish.",
        en: 'Learn → practise → write 5–10 of YOUR OWN sentences → speak using it → use it in writing → find the error → repeat. Step three is the one most often skipped, and it is exactly the step that converts passive knowledge into active. Filling gaps in a workbook is recognition, not learning.'
      },
      ex: ['Qoidani o\'qidim ≠ bilaman', 'Mashqni to\'g\'ri yechdim ≠ ishlata olaman', 'O\'z gapimni yozdim va aytdim = ishlata olaman']
    },
    {
      h: { uz: 'Lug\'atning 5 qadami', en: 'The five steps for vocabulary' },
      p: {
        uz: "So'z → kollokatsiya → gap → gapirish → yozish. Tarjima yozib qo'yish eng zaif usul. \"significant\" ni bilish yetarli emas; \"a significant impact\", \"significantly higher\" — mana shu Band 8. Kuniga 10–15 ta yetadi, lekin har biri ISHLATILISHI shart.",
        en: 'Word → collocation → sentence → speaking → writing. Writing down a translation is the weakest method. Knowing "significant" is not enough; "a significant impact", "significantly higher" — that is Band 8. Ten to fifteen a day is plenty, but every one must be USED.'
      },
      ex: ['significant → a significant impact / significantly higher', 'Technology has had a significant impact on education.']
    }
  ],
  practice: [
    { uz: "Bitta qisqa maqola o'qib, 10 ta so'zni kollokatsiyasi bilan yozib ol.", en: 'Read one short article and record ten words with their collocations.' },
    { uz: "O'sha 10 ta so'zdan 10 ta o'z gapingni yoz.", en: 'Write ten of your own sentences using those ten words.' },
    { uz: "Gaplarni ovoz chiqarib ayt va telefonga yozib ol.", en: 'Say the sentences aloud and record them on your phone.' },
    { uz: "Yozuvni tinglab, uchta narsani belgila: grammatik xato, talaffuz, pauza.", en: 'Listen back and mark three things: grammar errors, pronunciation, pauses.' }
  ],
  konspekt: {
    uz: ["Zanjir: o'qish → lug'at → grammatika → gapirish → yozish", 'Grammatika 7 qadam: eng muhimi — O\'Z gapingni yozish', "Lug'at 5 qadam: so'z yolg'iz emas, kollokatsiya bilan", 'Ishlatilmagan so\'z — o\'rganilmagan so\'z'],
    en: ['Chain: reading → vocabulary → grammar → speaking → writing', 'Grammar in 7 steps: the key one is writing YOUR OWN sentences', 'Vocabulary in 5 steps: never the word alone, always with collocations', 'A word you never use is a word you never learned']
  }
},

{
  d: 4, w: 0, i: 4, focus: ['listening', 'reading', 'writing', 'speaking'],
  title: { uz: "BOSHLANG'ICH MOCK — to'liq o'lchov", en: 'BASELINE MOCK — the full measurement' },
  intro: {
    uz: "Bugun to'rtala bo'limni ham real vaqtda bajarasan. Bu ball 20 hafta davomida taqqoslanadigan nuqta bo'ladi — shuning uchun halol bajar: pauza yo'q, lug'at yo'q, telefon yo'q.",
    en: 'Today you do all four sections under real timing. This score becomes the reference point for the next 20 weeks, so do it honestly: no pauses, no dictionary, no phone.'
  },
  sections: [
    {
      h: { uz: 'Tartib va vaqt', en: 'Order and timing' },
      p: {
        uz: "Listening 30 daqiqa (+10 daqiqa javobni ko'chirish), keyin darhol Reading 60 daqiqa, keyin darhol Writing 60 daqiqa. Tanaffus qilma — imtihonda ham yo'q. Speaking'ni alohida bajar: kartochkalarni tanlab, o'zingni yozib ol.",
        en: 'Listening 30 minutes (+10 to transfer answers), then Reading 60 minutes immediately, then Writing 60 minutes immediately. Take no break — there is none in the exam. Do Speaking separately: pick cue cards and record yourself.'
      },
      ex: ['Writing: Task 1 ga 20 daqiqa, Task 2 ga 40 daqiqa. Task 2 ikki barobar ko\'p ball beradi.']
    },
    {
      h: { uz: 'Natijadan keyin nima qilinadi', en: 'What to do with the result' },
      p: {
        uz: "Ballni yozib qo'yish — ishning eng kichik qismi. Asosiysi: har noto'g'ri javob uchun \"NEGA xato qildim?\" degan savolga bir jumlada javob yozish. Sabablar odatda to'rt xil: (1) so'zni bilmadim, (2) paraphrase'ni ko'rmadim, (3) vaqt yetmadi, (4) e'tiborsizlik. To'rttasining yechimi butunlay boshqa.",
        en: 'Recording the score is the smallest part of the job. What matters is answering "why did I get this wrong?" in one sentence for every wrong answer. The reasons are usually four: (1) I did not know the word, (2) I did not see the paraphrase, (3) I ran out of time, (4) carelessness. Each has a completely different fix.'
      },
      ex: ['Sabab: so\'z → lug\'at ustida ish', 'Sabab: paraphrase → o\'qish texnikasi', 'Sabab: vaqt → strategiya', 'Sabab: e\'tiborsizlik → tekshirish odati']
    }
  ],
  practice: [
    { uz: "To'liq Listening testi — real vaqt, bir marta tinglash.", en: 'Full Listening test — real timing, single play.' },
    { uz: "To'liq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Writing Task 1 (20 daq) + Task 2 (40 daq).", en: 'Writing Task 1 (20 min) + Task 2 (40 min).' },
    { uz: "Speaking Part 1+2+3 — yozib ol.", en: 'Speaking Parts 1+2+3 — record it.' },
    { uz: "Har noto'g'ri javobga bir jumlalik sabab yoz va platformadagi mock jadvaliga ballni kirit.", en: 'Write a one-sentence reason for every wrong answer and enter the bands in the platform scoreboard.' }
  ],
  konspekt: {
    uz: ['Real vaqt, pauzasiz, lug\'atsiz', 'Writing: T1 20 daq, T2 40 daq', 'Har xatoga sabab yoz: so\'z / paraphrase / vaqt / e\'tiborsizlik', 'Ball emas, SABAB muhim'],
    en: ['Real timing, no pauses, no dictionary', 'Writing: T1 20 min, T2 40 min', 'Log a reason for each error: word / paraphrase / time / carelessness', 'The reason matters more than the score']
  },
  mock: true
},

/* ====================== 1-HAFTA: ZAMONLAR ============================== */
{
  d: 5, w: 1, i: 1, gram: 'present-simple', vocab: 'education', focus: ['grammar', 'vocab'],
  title: { uz: 'Present Simple — doimiy haqiqat', en: 'Present Simple — permanent truth' },
  intro: {
    uz: "Birinchi grammatik kun. Present Simple oson ko'rinadi, lekin IELTS inshosining yarmi shu zamonda yoziladi — va aynan shu yerda \"he go\" tipidagi xato ball yo'qotadi. Bugun qoidani emas, ODATNI o'rnatamiz.",
    en: 'The first grammar day. Present Simple looks easy, yet half of an IELTS essay is written in it — and it is exactly where "he go" type errors cost marks. Today we install the habit, not the rule.'
  },
  sections: [
    {
      h: { uz: 'Zamon emas, holat', en: 'Not a time, a state' },
      p: {
        uz: "Nomi \"hozirgi\" bo'lsa ham, bu zamon \"shu daqiqada\" degani emas. U doimiy holatni bildiradi: doim shunday, odatda shunday, jadval bo'yicha shunday. Shuning uchun \"I am writing now\" to'g'ri, \"I write now\" g'alati eshitiladi.",
        en: 'Despite the name, this tense does not mean "at this moment". It states a permanent condition: always true, usually true, true by timetable. That is why "I am writing now" is right and "I write now" sounds odd.'
      },
      ex: ['Water boils at 100°C.', 'I study every evening.', 'The exam starts at nine.', 'Technology plays a central role in modern education.']
    },
    {
      h: { uz: "-s qayerga ketadi", en: 'Where the -s goes' },
      p: {
        uz: "Tasdiq gapda he/she/it bilan fe'lga -s qo'shiladi. Inkor va so'roqda esa shu -s DOES ga ko'chib o'tadi va fe'l asl shaklga qaytadi. Bu bitta harakat: -s bir joyda bo'ladi, ikki joyda emas.",
        en: 'In a positive statement he/she/it adds -s to the verb. In negatives and questions that -s MOVES onto does and the verb returns to base form. It is one movement: the -s lives in one place, never two.'
      },
      ex: ['She works. → She does not work. → Does she work?', 'He goes. → He does not go. → Does he go?', "XATO: She doesn't works."]
    },
    {
      h: { uz: "Ta'lim mavzusi bilan birga", en: 'Combined with the education topic' },
      p: {
        uz: "Grammatikani bo'sh gaplarda mashq qilma. Bugungi lug'at to'plami — ta'lim. Har bir yangi so'zni Present Simple da, ta'lim haqidagi FIKR sifatida yoz. Shunda grammatika ham, lug'at ham, Task 2 uchun tayyor material ham bir vaqtda hosil bo'ladi.",
        en: 'Do not practise grammar in empty sentences. Today\'s vocabulary set is education. Write every new word in Present Simple as an OPINION about education. That way you build grammar, vocabulary and ready Task 2 material at once.'
      },
      ex: ['The national curriculum rarely includes financial literacy.', 'Rising tuition fees prevent talented students from applying.', 'Schools that rely on rote learning discourage independent thought.']
    }
  ],
  practice: [
    { uz: "Present Simple da 10 ta gap yoz — hammasi ta'lim haqida fikr bo'lsin.", en: 'Write 10 Present Simple sentences, all opinions about education.' },
    { uz: "Har birini inkor va so'roq shakliga o'tkaz (does bilan).", en: 'Convert each into a negative and a question (with does).' },
    { uz: "Lug'at to'plamidan 10 ta so'zni kollokatsiyasi bilan daftarga yoz.", en: 'Record 10 words from the vocabulary set with their collocations.' },
    { uz: "Gaplaringni ovoz chiqarib ayt, yozib ol, -s tushib qolganini tekshir.", en: 'Say your sentences aloud, record them, and check for dropped -s.' },
    { uz: "Listening: 1 ta Section 1 mashqi (raqam va ism).", en: 'Listening: one Section 1 exercise (numbers and names).' }
  ],
  konspekt: {
    uz: ["Present Simple = doimiy holat, \"hozir\" emas", "he/she/it → fe'lga -s", "does bor bo'lsa fe'l asl shaklda: doesn't work", "Grammatikani BO'SH gapda emas, mavzu bilan mashq qil"],
    en: ['Present Simple = permanent state, not "right now"', 'he/she/it → verb takes -s', 'When does appears the verb is bare: doesn\'t work', 'Practise grammar inside a topic, never in empty sentences']
  }
},

{
  d: 6, w: 1, i: 2, gram: 'present-continuous', vocab: 'education', focus: ['grammar', 'listening'],
  title: { uz: 'Present Continuous — hozir va o\'zgarish', en: 'Present Continuous — now and change' },
  intro: {
    uz: "Bugun LC kuni, shuning uchun mustaqil yuk yengilroq. Present Continuous ning uchinchi ma'nosi — O'ZGARISH — IELTS uchun eng qimmatlisi: Task 1 dagi har bir grafik shu zamonda tasvirlanadi.",
    en: 'Today is an LC day, so the self-study load is lighter. The third meaning of Present Continuous — CHANGE — is the most valuable for IELTS: every trend in Task 1 is described in it.'
  },
  sections: [
    {
      h: { uz: 'Uch ma\'no', en: 'Three meanings' },
      p: {
        uz: "(1) Aynan hozir: I am writing an essay. (2) Vaqtinchalik holat: I'm living with my cousin this year — doimiy emas. (3) O'zgarish tendensiyasi: Cities are becoming more crowded. Uchinchisi \"nowadays\", \"these days\", \"increasingly\" bilan yuradi.",
        en: '(1) Right now: I am writing an essay. (2) A temporary situation: I\'m living with my cousin this year — not permanent. (3) A changing trend: Cities are becoming more crowded. The third goes with "nowadays", "these days", "increasingly".'
      },
      ex: ['More and more people are working from home.', 'The cost of living is rising in almost every major city.', 'Attitudes towards online education are changing quickly.']
    },
    {
      h: { uz: "Holat fe'llari -ing olmaydi", en: 'State verbs take no -ing' },
      p: {
        uz: "know, want, like, believe, understand, belong, need, prefer — bular harakat emas, HOLAT. Ularning Continuous shakli yo'q. \"I am knowing\" — Band 6 belgisi. Ro'yxatni bir marta yodla, keyin shu xato butunlay yo'qoladi.",
        en: 'know, want, like, believe, understand, belong, need, prefer are not actions but STATES. They have no continuous form. "I am knowing" is a Band 6 marker. Memorise the list once and this error disappears for good.'
      },
      ex: ['XATO: I am knowing the answer. → I know the answer.', 'XATO: I am wanting to study. → I want to study.']
    }
  ],
  practice: [
    { uz: "O'zgarish ma'nosida 8 ta gap yoz (ta'lim va texnologiya haqida).", en: 'Write 8 sentences in the "change" meaning (about education and technology).' },
    { uz: "Present Simple va Continuous ni farqlaydigan 10 ta juft gap tuz.", en: 'Build 10 pairs of sentences contrasting Present Simple and Continuous.' },
    { uz: "Holat fe'llari ro'yxatini daftarga ko'chir.", en: 'Copy the state-verb list into your notebook.' },
    { uz: "LC darsida o'rganilgan narsani 20 daqiqada takrorla.", en: 'Spend 20 minutes reviewing what you covered at LC.' },
    { uz: 'Listening: 30 daqiqa Section 1–2 mashqi.', en: 'Listening: 30 minutes of Section 1–2 practice.' }
  ],
  konspekt: {
    uz: ["am/is/are + fe'l-ing", "Uch ma'no: hozir · vaqtinchalik · O'ZGARISH", "O'zgarish ma'nosi Task 1 uchun asosiy", 'know/want/like/believe — -ing olmaydi'],
    en: ['am/is/are + verb-ing', 'Three meanings: now · temporary · CHANGE', 'The change meaning is core to Task 1', 'know/want/like/believe take no -ing']
  }
},

{
  d: 7, w: 1, i: 3, gram: 'past-simple', vocab: 'daily-life', focus: ['grammar', 'reading'],
  title: { uz: 'Past Simple — tugagan va vaqti aniq', en: 'Past Simple — finished, at a known time' },
  intro: {
    uz: "Past Simple ning o'zi qiyin emas; qiyini — inkor va so'roqda did paydo bo'lganda fe'lni asl shaklga qaytarish. \"I didn't went\" — o'zbek o'quvchilarida eng ko'p uchraydigan uchta xatodan biri.",
    en: 'Past Simple itself is not hard; the difficulty is returning the verb to base form once did appears in negatives and questions. "I didn\'t went" is one of the three most common errors among Uzbek learners.'
  },
  sections: [
    {
      h: { uz: 'Vaqt aytilgan bo\'lsa — Past Simple', en: 'If the time is stated, use Past Simple' },
      p: {
        uz: "Bu zamonning belgisi — vaqt. yesterday, last year, in 2020, two days ago, when I was young. Shu so'zlardan biri bo'lsa, Present Perfect ishlatib bo'lmaydi. Vaqt aytilmasa ham, kontekstdan tushunarli bo'lsa yetadi.",
        en: 'The signal for this tense is a time expression: yesterday, last year, in 2020, two days ago, when I was young. If one of these is present, Present Perfect is impossible. An implied but clear time is enough too.'
      },
      ex: ['I finished school in 2023.', 'The figure rose sharply between 2010 and 2015.', 'The government introduced the policy in 2019.']
    },
    {
      h: { uz: 'did paydo bo\'lsa fe\'l asl shaklda', en: 'When did appears the verb goes bare' },
      p: {
        uz: "did allaqachon o'tgan zamonni ko'rsatib turibdi — fe'l ikkinchi marta o'tgan zamonga o'tishi shart emas. Bu Present Simple dagi does bilan bir xil mantiq: belgi bir joyda bo'ladi.",
        en: 'did already marks the past — the verb does not need to mark it a second time. This is the same logic as does in Present Simple: the marker lives in one place.'
      },
      ex: ['I went. → I did not go. → Did you go?', 'XATO: I didn\'t went. / When you did arrive?', "TO'G'RI: When did you arrive?"]
    },
    {
      h: { uz: 'Noto\'g\'ri fe\'llarni qanday yodlash', en: 'How to learn irregular verbs' },
      p: {
        uz: "Alifbo tartibida yodlash ishlamaydi. Ularni SHAKL bo'yicha guruhla: o'zgarmaydiganlar (cut-cut-cut), ikkitasi bir xil (buy-bought-bought), uchtasi boshqa (go-went-gone). Kuniga 10 tadan, lekin har birini gapda ishlat.",
        en: 'Alphabetical memorisation does not work. Group them by PATTERN: unchanging (cut-cut-cut), two forms alike (buy-bought-bought), three different (go-went-gone). Ten a day, but use each in a sentence.'
      },
      ex: ['cut · put · let · set — o\'zgarmaydi', 'buy → bought → bought', 'go → went → gone / write → wrote → written']
    }
  ],
  practice: [
    { uz: "Kechagi kuningni Past Simple da 10 gapda yoz.", en: 'Describe yesterday in 10 Past Simple sentences.' },
    { uz: "10 ta noto'g'ri fe'lni shakl bo'yicha guruhlab yodla va har biriga gap tuz.", en: 'Group and learn 10 irregular verbs by pattern, writing a sentence for each.' },
    { uz: "Past Simple da 5 ta inkor va 5 ta so'roq gap tuz (did bilan).", en: 'Build 5 negatives and 5 questions in Past Simple (with did).' },
    { uz: 'Reading: 45 daqiqa vaqt bilan bitta matn.', en: 'Reading: one passage, 45 minutes, timed.' },
    { uz: 'Writing: 1 ta Task 2 abzatsi.', en: 'Writing: one Task 2 body paragraph.' }
  ],
  konspekt: {
    uz: ["Vaqt aytilgan → Past Simple", "did bor → fe'l asl shaklda: didn't go", "So'roqda did egadan oldin: Did you go?", "Noto'g'ri fe'llarni SHAKL bo'yicha guruhla"],
    en: ['Stated time → Past Simple', 'did present → bare verb: didn\'t go', 'In questions did precedes the subject: Did you go?', 'Group irregular verbs by PATTERN']
  }
},

{
  d: 8, w: 1, i: 4, gram: 'past-continuous', vocab: 'daily-life', focus: ['grammar', 'speaking'],
  title: { uz: 'Past Continuous — o\'tmishning foni', en: 'Past Continuous — the background of the past' },
  intro: {
    uz: "Bu zamon yolg'iz kam ishlatiladi. Uning kuchi — Past Simple bilan JUFTLIKDA: uzun ish fon bo'ladi, qisqasi uni bo'ladi. Speaking Part 2 hikoyasining tabiiy shakli aynan shu.",
    en: 'This tense is rarely used alone. Its power is in PAIRING with Past Simple: the long action sets the background and the short one interrupts it. That is the natural shape of a Speaking Part 2 story.'
  },
  sections: [
    {
      h: { uz: 'Fon va hodisa', en: 'Background and event' },
      p: {
        uz: "\"I was studying when the phone rang.\" — o'qish davom etardi (fon, Continuous), telefon jiringladi (hodisa, Simple). Qaysi biri uzun bo'lsa, o'sha Continuous. Bu qoidani bilsang, ikkalasi orasida hech qachon adashmaysan.",
        en: '"I was studying when the phone rang." — the studying was in progress (background, Continuous), the phone rang (event, Simple). Whichever action is longer takes the Continuous. Know this and you will never confuse the two.'
      },
      ex: ['While I was walking home, I saw an old friend.', 'She was preparing dinner when the power went out.', 'They were living in Tashkent at the time.']
    },
    {
      h: { uz: 'Hikoyani boshlash uchun', en: 'For opening a story' },
      p: {
        uz: "Speaking Part 2 da javobni darhol faktdan boshlama — bir gap bilan manzara chiz. \"It was a cold evening and I was waiting for a bus…\" Bu grammatik xilma-xillik ham beradi, ravonlik ham: birinchi 10 soniyada nima deyishni bilib turasan.",
        en: 'In Speaking Part 2 do not open with a bare fact — paint the scene in one sentence. "It was a cold evening and I was waiting for a bus…" This shows grammatical range and helps fluency: you know what to say in the first ten seconds.'
      },
      ex: ['It was late and everyone was getting ready to leave when…', 'I was studying abroad at the time, so…']
    }
  ],
  practice: [
    { uz: "5 ta \"was/were + -ing … when + Past Simple\" gapini yoz.", en: 'Write 5 sentences of the form "was/were + -ing … when + Past Simple".' },
    { uz: "Speaking Part 2: bitta kartochkaga javob ber, boshini Past Continuous bilan boshla.", en: 'Speaking Part 2: answer one cue card, opening with Past Continuous.' },
    { uz: "Javobingni yozib ol va zamon almashuvini tekshir.", en: 'Record your answer and check the tense switching.' },
    { uz: "LC darsi materialini 20 daqiqa takrorla.", en: 'Review the LC lesson material for 20 minutes.' },
    { uz: 'Speaking: 30 daqiqa mashq.', en: 'Speaking: 30 minutes of practice.' }
  ],
  konspekt: {
    uz: ["was/were + fe'l-ing", 'Uzun ish = Continuous (fon), qisqa ish = Simple (hodisa)', 'when + Past Simple / while + Past Continuous', 'Part 2 hikoyasini manzara bilan boshla'],
    en: ['was/were + verb-ing', 'Long action = Continuous (background), short = Simple (event)', 'when + Past Simple / while + Past Continuous', 'Open a Part 2 story with a scene']
  }
},

{
  d: 9, w: 1, i: 5, gram: 'present-perfect', vocab: 'technology', focus: ['grammar', 'writing'],
  title: { uz: 'Present Perfect — o\'tmish hozirga ulangan', en: 'Present Perfect — the past connected to now' },
  intro: {
    uz: "Bu — kursning eng muhim grammatik kuni. O'zbek tilida bu farq YO'Q, shuning uchun bu xato deyarli hammada bor va u Band 7 dan yuqoriga chiqishga to'sqinlik qiladi. Bugun uni tugatamiz.",
    en: 'This is the most important grammar day of the course. Uzbek does not draw this distinction, so almost every learner makes the error, and it blocks the move above Band 7. Today we end it.'
  },
  sections: [
    {
      h: { uz: 'Bu o\'tgan zamon EMAS', en: 'This is NOT a past tense' },
      p: {
        uz: "Present Perfect — hozirgi zamon oilasidan. U o'tmishdagi ishni HOZIRGI holat uchun aytadi. \"I have lost my key\" — gap kalitni yo'qotgan payt haqida emas, hozir kalitsiz turganim haqida. Shuning uchun aniq o'tgan vaqt bilan kelmaydi: vaqt aytilsa, diqqat o'tmishga ko'chadi va Past Simple kerak bo'ladi.",
        en: 'Present Perfect belongs to the present family. It reports a past action because of its PRESENT relevance. "I have lost my key" is not about the moment of losing but about being without a key now. That is why it cannot take a finished time expression: naming the time shifts focus to the past and forces Past Simple.'
      },
      ex: ['I have lost my key. (hozir kalitsizman)', 'I lost my key yesterday. (vaqt aytildi)', "XATO: I have lost my key yesterday."]
    },
    {
      h: { uz: 'Uchta ishlatilish', en: 'Three uses' },
      p: {
        uz: "(1) Natijasi hozir ko'rinadi. (2) Davom etayotgan davr: for/since bilan — I have lived here for ten years (hali yashayman). (3) Hayotiy tajriba, vaqti muhim emas: I have been to Dubai. Uchinchisida ever/never juda ko'p ishlatiladi.",
        en: '(1) The result is visible now. (2) An ongoing period, with for/since — I have lived here for ten years (still living). (3) Life experience where time is irrelevant: I have been to Dubai. The third often uses ever/never.'
      },
      ex: ['Online learning has become far more common over the last decade.', 'I have been studying English since I was twelve.', 'She has never taken an international exam before.']
    },
    {
      h: { uz: 'Task 2 da nega kerak', en: 'Why it matters in Task 2' },
      p: {
        uz: "Insho ko'pincha \"so'nggi o'n yilda nima o'zgardi\" degan fikrdan boshlanadi — bu aynan Present Perfect. Kirish abzatsida bitta to'g'ri Present Perfect gapi butun inshoning ohangini akademik qilib qo'yadi.",
        en: 'An essay often opens with what has changed over the last decade — precisely Present Perfect territory. One correct Present Perfect sentence in the introduction sets an academic tone for the whole essay.'
      },
      ex: ['Technology has transformed the way people communicate.', 'Governments have introduced a number of measures to address this issue.']
    }
  ],
  practice: [
    { uz: "for va since bilan 10 ta gap yoz (texnologiya mavzusida).", en: 'Write 10 sentences with for and since (technology topic).' },
    { uz: "10 ta juft gap: bittasi Past Simple, ikkinchisi Present Perfect — farqni izohla.", en: 'Write 10 pairs, one Past Simple and one Present Perfect, and explain the difference.' },
    { uz: "Xatolar daftaringni ochib, Present Perfect xatolarini alohida belgila.", en: 'Open your error log and mark Present Perfect errors separately.' },
    { uz: 'Writing: 1 ta to\'liq Task 2 insho (40 daqiqa).', en: 'Writing: one full Task 2 essay (40 minutes).' },
    { uz: "Inshoda kamida 2 ta Present Perfect gapi bo'lsin.", en: 'Include at least two Present Perfect sentences in the essay.' }
  ],
  konspekt: {
    uz: ['have/has + III shakl', "Bu HOZIRGI zamon: o'tmish hozirga ta'sir qiladi", 'Aniq o\'tgan vaqt bilan KELMAYDI (yesterday, in 2020)', 'for / since / just / already / yet / ever / never', 'has gone (III), has went EMAS'],
    en: ['have/has + past participle', 'A PRESENT tense: the past matters now', 'Never with a finished time (yesterday, in 2020)', 'for / since / just / already / yet / ever / never', 'has gone (third form), never has went']
  }
},

{
  d: 10, w: 1, i: 6, gram: 'past-perfect', vocab: 'technology', focus: ['grammar'],
  title: { uz: 'Past Perfect va zamonlarni farqlash', en: 'Past Perfect and choosing between tenses' },
  intro: {
    uz: "Past Perfect ning bitta vazifasi bor: o'tmishdagi ikki ishning tartibini ko'rsatish. Uni ko'p ishlatish shart emas. Bugun shu bilan birga haftaning asosiy ko'nikmasini o'rnatamiz — zamonni QANDAY tanlash.",
    en: 'Past Perfect has exactly one job: showing the order of two past events. It does not need to appear often. Today we also install the week\'s core skill — HOW to choose a tense.'
  },
  sections: [
    {
      h: { uz: 'Ikki ish, aniq tartib', en: 'Two events, clear order' },
      p: {
        uz: "had + III shakl faqat AVVAL bo'lgan ishga qo'yiladi. \"The train had left before I arrived\" — poyezd birinchi ketdi. Agar before yoki after allaqachon tartibni aytib turgan bo'lsa, had shart emas — lekin xato ham emas.",
        en: 'had + past participle marks only the EARLIER event. "The train had left before I arrived" — the train went first. If before or after already makes the order clear, had is optional — but not wrong.'
      },
      ex: ['By the time the policy was introduced, the situation had already worsened.', 'I had never spoken to a native speaker before I joined the course.', 'She realised that she had made a serious mistake.']
    },
    {
      h: { uz: 'Zamon tanlashning uch savoli', en: 'Three questions for choosing a tense' },
      p: {
        uz: "Qoidalarni eslashga urinma — savol ber. (1) Ish tugaganmi? (2) Tugagan bo'lsa, QACHON tugagani aytilganmi? (3) Hozirga bog'liqmi? Vaqt aytilgan → Past Simple. Aytilmagan va natija hozir muhim → Present Perfect. Hozir davom etyapti yoki o'zgaryapti → Present Continuous.",
        en: 'Do not try to recall rules — ask questions. (1) Is it finished? (2) If so, is the time stated? (3) Does it matter now? Stated time → Past Simple. No stated time and the result matters → Present Perfect. Happening or changing now → Present Continuous.'
      },
      ex: ['I studied there for three years. (tugagan)', 'I have studied there for three years. (hali o\'qiyman)', 'The figure rose in 2015. (aniq yil)', 'The figure has risen since 2015. (hozirgacha)']
    }
  ],
  practice: [
    { uz: "Past Perfect bilan 8 ta gap yoz — har birida ikki o'tgan ish bo'lsin.", en: 'Write 8 Past Perfect sentences, each containing two past events.' },
    { uz: "Zamon tanlash jadvalini daftarga ko'chirib yoz.", en: 'Copy the tense-choice table into your notebook.' },
    { uz: "Oldingi kunlarda yozgan gaplaringni qayta o'qib, zamon xatolarini top.", en: 'Reread your sentences from earlier days and find tense errors.' },
    { uz: 'LC darsini takrorla (20 daqiqa).', en: 'Review the LC lesson (20 minutes).' },
    { uz: 'Listening: 30 daqiqa.', en: 'Listening: 30 minutes.' }
  ],
  konspekt: {
    uz: ['had + III shakl — faqat AVVAL bo\'lgan ish', 'Tartib aniq bo\'lsa had shart emas', 'Uch savol: tugadimi? vaqti aytilganmi? hozirga bog\'liqmi?', 'since/for → Perfect · ago/last/in 2020 → Past Simple'],
    en: ['had + past participle — only the earlier event', 'If the order is already clear, had is optional', 'Three questions: finished? time stated? relevant now?', 'since/for → Perfect · ago/last/in 2020 → Past Simple']
  }
},

{
  d: 11, w: 1, i: 7, focus: ['grammar', 'listening', 'reading'], review: true,
  title: { uz: 'TAKROR + NAZORAT — zamonlar', en: 'REVIEW + TEST — tenses' },
  intro: {
    uz: "Yakshanba — test va tahlil kuni. Bugun yangi narsa o'rganmaysan: haftaning oltita zamonini nazoratdan o'tkazasan va bir Listening, bir Reading testi bajarasan. Kunning eng muhim qismi — testdan keyingi XATO TAHLILI.",
    en: 'Sunday is the test-and-review day. You learn nothing new today: you test the week\'s six tenses and do one Listening and one Reading test. The most important part of the day is the error analysis afterwards.'
  },
  sections: [
    {
      h: { uz: 'Haftaning xulosasi', en: 'The week in summary' },
      p: {
        uz: "Present Simple — doimiy holat. Present Continuous — hozir va o'zgarish. Past Simple — tugagan, vaqti aniq. Past Continuous — o'tmish foni. Present Perfect — o'tmish hozirga ulangan. Past Perfect — o'tmishdan oldingi o'tmish. Oltalasining farqi vaqtda emas, MUNOSABATDA.",
        en: 'Present Simple — permanent state. Present Continuous — now and change. Past Simple — finished at a known time. Past Continuous — past background. Present Perfect — past connected to now. Past Perfect — the past before the past. The six differ not in time but in RELATIONSHIP.'
      },
      ex: ['Vaqt aytilganmi? → Past Simple', 'Natija hozirmi? → Present Perfect', 'Davom etyaptimi? → Continuous']
    },
    {
      h: { uz: 'Xato tahlili qanday qilinadi', en: 'How to run an error analysis' },
      p: {
        uz: "Ballni yozib qo'yish yetarli emas. Har noto'g'ri javob uchun to'rt sababdan birini belgila: so'zni bilmadim / paraphrase'ni ko'rmadim / vaqt yetmadi / e'tiborsizlik. Hafta oxirida qaysi sabab ko'p bo'lsa, keyingi haftaning e'tibori o'sha yerga qaratiladi.",
        en: 'Recording the score is not enough. For every wrong answer tag one of four reasons: did not know the word / missed the paraphrase / ran out of time / carelessness. Whichever reason dominates decides where next week\'s attention goes.'
      },
      ex: ['So\'z → lug\'at ishi', 'Paraphrase → o\'qish texnikasi', 'Vaqt → strategiya', 'E\'tiborsizlik → tekshirish odati']
    }
  ],
  practice: [
    { uz: 'Quyidagi testni ishla (10 savol).', en: 'Take the test below (10 questions).' },
    { uz: "To'liq Listening testi — real vaqt bilan.", en: 'Full Listening test under real timing.' },
    { uz: "To'liq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Har noto'g'ri javobga sabab yorlig'ini qo'y.", en: 'Tag every wrong answer with a reason.' },
    { uz: "Haftalik jadvalga natijani kirit.", en: 'Enter the result in the weekly scoreboard.' }
  ],
  konspekt: {
    uz: ['6 ta zamon: farq vaqtda emas, munosabatda', 'Yakshanba = test + XATO TAHLILI', 'Har xatoga sabab yorlig\'i', 'Ko\'p uchragan sabab — keyingi haftaning vazifasi'],
    en: ['Six tenses: they differ in relationship, not time', 'Sunday = test + ERROR ANALYSIS', 'Tag every error with a reason', 'The dominant reason sets next week\'s focus']
  },
  quiz: [
    { q: 'She ___ to university every day.', opts: ['go', 'goes', 'going', 'is go'], correct: 1 },
    { q: "Which is correct?", opts: ["She doesn't goes.", "She don't go.", "She doesn't go.", "She not go."], correct: 2 },
    { q: 'I ___ here since 2020.', opts: ['am', 'was', 'have been', 'had been'], correct: 2 },
    { q: 'Which sentence is WRONG?', opts: ['I saw him yesterday.', 'I have seen him yesterday.', 'I have seen him.', 'I had seen him before.'], correct: 1 },
    { q: 'I was studying when the phone ___.', opts: ['was ringing', 'rang', 'has rung', 'rings'], correct: 1 },
    { q: 'By the time I arrived, the train ___.', opts: ['left', 'has left', 'had left', 'was leaving'], correct: 2 },
    { q: 'Which verb cannot take -ing?', opts: ['work', 'study', 'know', 'write'], correct: 2 },
    { q: 'Cities ___ more crowded every year.', opts: ['become', 'are becoming', 'have become', 'became'], correct: 1 },
    { q: 'Correct question form?', opts: ['When you did arrive?', 'When did you arrive?', 'When you arrived?', 'When did you arrived?'], correct: 1 },
    { q: 'She has ___ home already.', opts: ['went', 'gone', 'go', 'going'], correct: 1 }
  ]
},

/* ====================== 2-HAFTA: SAVOL, MOSLIK, KELAJAK ================ */
{
  d: 12, w: 2, i: 1, gram: 'future-forms', vocab: 'work', focus: ['grammar', 'writing'],
  title: { uz: 'Kelasi zamon shakllari', en: 'Future forms' },
  intro: {
    uz: "Ingliz tilida yagona kelasi zamon yo'q. Qaysi shaklni tanlashing NIYAT haqida ma'lumot beradi — va IELTS'da bashorat qilish uchun will va be likely to eng ko'p kerak bo'ladi.",
    en: 'English has no single future tense. The form you choose signals INTENTION — and for IELTS predictions, will and be likely to do most of the work.'
  },
  sections: [
    {
      h: { uz: 'Uch asosiy shakl', en: 'The three main forms' },
      p: {
        uz: "will — shu daqiqada qaror qilingan yoki taxmin. be going to — oldindan qaror qilingan reja yoki hozirgi dalilga asoslangan bashorat. Present Continuous — kelishib qo'yilgan uchrashuv. Uchalasini bir-birining o'rniga ishlatib bo'lmaydi.",
        en: 'will — decided at the moment of speaking, or a prediction. be going to — a plan already made, or a prediction based on present evidence. Present Continuous — a fixed arrangement. The three are not interchangeable.'
      },
      ex: ['It will probably rain. (taxmin)', "I'm going to take IELTS in February. (reja)", "I'm meeting my tutor at five. (kelishilgan)"]
    },
    {
      h: { uz: 'Akademik bashorat tili', en: 'The language of academic prediction' },
      p: {
        uz: "Inshoda \"will definitely\" deb yozish zaiflik — buni isbotlab bo'lmaydi. O'rniga ehtimol darajasini ko'rsat: is likely to, is expected to, may well, could. Bu \"ishonchsizlik\" emas, ilmiy aniqlik va Band 7+ belgisi.",
        en: 'Writing "will definitely" in an essay reads as weak — it cannot be defended. Instead mark the degree of probability: is likely to, is expected to, may well, could. This is not vagueness but precision, and a Band 7+ marker.'
      },
      ex: ['Automation is likely to replace many routine jobs within a decade.', 'Costs are expected to rise significantly.', 'If this trend continues, the problem will become far more serious.']
    },
    {
      h: { uz: 'when va if dan keyin kelasi zamon yo\'q', en: 'No future after when and if' },
      p: {
        uz: "\"When I will finish\" — xato. when, if, as soon as, until, before, after dan keyin hozirgi zamon ishlatiladi, garchi ma'no kelajak bo'lsa ham. Bu qoida shart gaplarga ham tegishli va juda ko'p xato qilinadi.",
        en: '"When I will finish" is wrong. After when, if, as soon as, until, before and after, the present is used even though the meaning is future. The same rule governs conditionals and it is broken constantly.'
      },
      ex: ['When I finish, I will call you.', 'If it rains, we will stay at home.', "XATO: When I will finish, I will call you."]
    }
  ],
  practice: [
    { uz: "Kelajak haqida 10 ta gap yoz: 3 ta will, 3 ta going to, 2 ta Present Continuous, 2 ta be likely to.", en: 'Write 10 future sentences: 3 will, 3 going to, 2 Present Continuous, 2 be likely to.' },
    { uz: "Ish va bandlik mavzusida 5 ta bashorat gapi yoz (akademik uslubda).", en: 'Write 5 predictions on work and employment in an academic register.' },
    { uz: "when/if bilan 5 ta gap yoz va kelasi zamon ishlatmaganingni tekshir.", en: 'Write 5 sentences with when/if and check you used no future tense.' },
    { uz: 'Writing: Task 2 xulosa abzatsini yoz.', en: 'Writing: write a Task 2 conclusion paragraph.' },
    { uz: 'Reading: 45 daqiqa.', en: 'Reading: 45 minutes.' }
  ],
  konspekt: {
    uz: ['will (taxmin) · going to (reja) · Present Continuous (kelishilgan)', 'Akademik: is likely to / is expected to / may well', 'will dan keyin to YO\'Q', 'when/if dan keyin kelasi zamon YO\'Q'],
    en: ['will (prediction) · going to (plan) · Present Continuous (arrangement)', 'Academic: is likely to / is expected to / may well', 'No to after will', 'No future tense after when/if']
  }
},

{
  d: 13, w: 2, i: 2, gram: 'questions', vocab: 'work', focus: ['grammar', 'speaking'],
  title: { uz: "So'roq gap qurilishi", en: 'Question formation' },
  intro: {
    uz: "Speaking'da savolni noto'g'ri tushunish — ball yo'qotishning eng tez yo'li. Savol qurilishini bilish faqat savol berish uchun emas, savolni ESHITISH uchun ham kerak.",
    en: 'Misreading a question is the fastest way to lose marks in Speaking. Knowing question structure is not only for asking — it is for HEARING the question correctly.'
  },
  sections: [
    {
      h: { uz: 'Yordamchi fe\'l egadan oldinga', en: 'The auxiliary moves before the subject' },
      p: {
        uz: "So'roq gapda yordamchi fe'l (do/does/did, am/is/are, have/has, will, can) egadan OLDIN keladi. Yordamchi bo'lmasa — do/does/did qo'shiladi va asosiy fe'l asl shaklga qaytadi. So'roq so'zi eng oldinga.",
        en: 'In a question the auxiliary (do/does/did, am/is/are, have/has, will, can) comes BEFORE the subject. If there is none, do/does/did is inserted and the main verb returns to base form. The question word goes first.'
      },
      ex: ['Do you agree? · Why do you think so?', 'Have you been there? · How long have you been studying?', "XATO: Why you are late? → Why are you late?"]
    },
    {
      h: { uz: 'Bilvosita savol — tartib o\'zgarmaydi', en: 'Indirect questions keep statement order' },
      p: {
        uz: "\"Could you tell me where the office is?\" — bu savolning ICHIDA oddiy gap tartibi qoladi. \"where is the office\" deb yozish xato. Bu qoida noun clause bilan bir xil va Writing'da ham kerak.",
        en: '"Could you tell me where the office is?" — INSIDE the question, statement order remains. Writing "where is the office" is wrong. The rule is the same as for noun clauses and it matters in Writing too.'
      },
      ex: ['I wonder why people prefer city life.', 'It is unclear what the main cause is.', "XATO: I don't know what is the answer."]
    }
  ],
  practice: [
    { uz: "10 ta Speaking Part 1 savolini yozib, har biriga to'liq javob ber.", en: 'Write 10 Speaking Part 1 questions and answer each fully.' },
    { uz: "5 ta bilvosita savol tuz (I wonder…, Could you tell me…).", en: 'Build 5 indirect questions (I wonder…, Could you tell me…).' },
    { uz: "Speaking Part 1 javoblaringni yozib ol va savolga to'g'ri javob berganingni tekshir.", en: 'Record your Part 1 answers and check you actually answered the question.' },
    { uz: 'LC darsini takrorla.', en: 'Review the LC lesson.' },
    { uz: 'Speaking: 30 daqiqa.', en: 'Speaking: 30 minutes.' }
  ],
  konspekt: {
    uz: ['Aux + ega + fe\'l: Do you agree?', 'Wh + aux + ega + fe\'l: Why do you think so?', 'Ega so\'roq so\'zi bo\'lsa tartib o\'zgarmaydi: Who called?', 'Bilvosita savolda tartib oddiy gapdek'],
    en: ['Aux + subject + verb: Do you agree?', 'Wh + aux + subject + verb: Why do you think so?', 'If the wh-word is the subject, order stays: Who called?', 'Indirect questions keep statement order']
  }
},

{
  d: 14, w: 2, i: 3, gram: 'subject-verb-agreement', vocab: 'society', focus: ['grammar', 'writing'],
  title: { uz: 'Ega va kesim mosligi', en: 'Subject–verb agreement' },
  intro: {
    uz: "Bu xato Band 7 dan yuqoriga chiqishga to'sqinlik qiladigan eng ko'p uchraydigan xato. U ma'noni buzmaydi — shuning uchun ko'z ilg'amaydi, lekin baholovchi ilg'aydi.",
    en: 'This is the most common error blocking a move above Band 7. It does not break meaning, so your eye slides past it — but the examiner\'s does not.'
  },
  sections: [
    {
      h: { uz: "Fe'l EGAGA moslashadi", en: 'The verb agrees with the SUBJECT' },
      p: {
        uz: "Xato ko'pincha ega bilan fe'l orasiga uzun bo'lak tushganda bo'ladi. \"The number of students who study abroad IS rising\" — ega \"the number\", \"students\" emas. Insho tekshirayotganda oradagi hamma so'zni yopib, egani fe'l bilan yonma-yon qo'yib ko'r.",
        en: 'The error appears when a long phrase sits between subject and verb. "The number of students who study abroad IS rising" — the subject is "the number", not "students". When proofreading, cover the words in between and place subject and verb side by side.'
      },
      ex: ['The impact of social media on young people is widely debated.', 'The list of items is long.', "XATO: The list of items are long."]
    },
    {
      h: { uz: 'Yodlanadigan olti holat', en: 'Six cases to memorise' },
      p: {
        uz: "the number of → birlik. a number of → ko'plik. information / advice / research / knowledge → doim birlik. people → ko'plik. each / every / one of → birlik. both / several / many → ko'plik. Shu oltitasi xatolarning aksariyatini yopadi.",
        en: 'the number of → singular. a number of → plural. information / advice / research / knowledge → always singular. people → plural. each / every / one of → singular. both / several / many → plural. These six cover most of the errors.'
      },
      ex: ['The number of cars is rising.', 'A number of studies suggest that…', 'Research into this area has increased.', 'People are becoming healthier.']
    }
  ],
  practice: [
    { uz: "Olti holatning har biriga 2 tadan gap yoz (jami 12 ta).", en: 'Write two sentences for each of the six cases (12 in total).' },
    { uz: "Oldingi inshongni ochib, har gapning egasini belgilab chiq.", en: 'Open a previous essay and mark the subject of every sentence.' },
    { uz: "Xatolar daftaringda \"moslik\" bo'limini och.", en: 'Open an "agreement" section in your error log.' },
    { uz: 'Writing: 1 ta Task 2 insho (40 daqiqa).', en: 'Writing: one Task 2 essay (40 minutes).' },
    { uz: "Inshoni topshirishdan oldin faqat moslik uchun bir marta o'qib chiq.", en: 'Before finishing, reread the essay once checking only agreement.' }
  ],
  konspekt: {
    uz: ["Fe'l EGAGA moslashadi, eng yaqin so'zga emas", 'the number of → birlik · a number of → ko\'plik', 'information / advice / research → birlik', 'people → ko\'plik', 'Tekshirishda oradagi so\'zlarni yop'],
    en: ['The verb agrees with the SUBJECT, not the nearest word', 'the number of → singular · a number of → plural', 'information / advice / research → singular', 'people → plural', 'When checking, cover the words in between']
  }
},

{
  d: 15, w: 2, i: 4, vocab: 'listening-traps', focus: ['listening'],
  title: { uz: 'Listening Section 1 — raqam, ism, sana', en: 'Listening Section 1 — numbers, names, dates' },
  intro: {
    uz: "Section 1 eng oson bo'lim — va aynan shuning uchun bu yerdagi xato eng achinarli. Ball yo'qotish sababi deyarli har doim bitta: tinglash emas, IMLO va format.",
    en: 'Section 1 is the easiest part — which makes an error here the most painful. The cause of lost marks is almost always the same: not listening, but SPELLING and format.'
  },
  sections: [
    {
      h: { uz: 'Javobni oldindan bashorat qil', en: 'Predict the answer first' },
      p: {
        uz: "Tinglashdan oldin har bo'shliqqa qarab, u yerga QANDAY TURDAGI javob kelishini yoz: raqammi, ismmi, sanami, pulmi. Bu miyani tayyorlaydi — kerakli ma'lumot eshitilganda u \"yonib\" ketadi. Bashorat qilmasdan tinglash — hamma so'zni bir xil e'tibor bilan eshitish demak, bu esa imkonsiz.",
        en: 'Before listening, look at each gap and write what KIND of answer belongs there: a number, a name, a date, an amount. This primes your brain so the relevant information lights up. Listening without predicting means attending to every word equally, which is impossible.'
      },
      ex: ['Name: ______ → ism, katta harf bilan', 'Date: ______ → sana formati', 'Cost: £______ → raqam']
    },
    {
      h: { uz: 'Imlo — eng ko\'p yo\'qotiladigan ball', en: 'Spelling — where marks are lost most' },
      p: {
        uz: "Harflab aytilgan ism xato yozilsa, javob noto'g'ri hisoblanadi — hatto to'g'ri eshitgan bo'lsang ham. Xavfli juftliklar: a/e/i, m/n, b/p/v, g/j. Sana va raqam formatiga ham e'tibor ber: 15th May yoki 15 May — ikkalasi ham to'g'ri, lekin \"15 of May\" xato.",
        en: 'A misspelled name is marked wrong even if you heard it correctly. Dangerous pairs: a/e/i, m/n, b/p/v, g/j. Watch date and number formats too: 15th May or 15 May are both fine, but "15 of May" is wrong.'
      },
      ex: ['double L = ll · "S for Sugar"', '15/05 · 15 May · 15th May ✓', '15 of May ✗']
    },
    {
      h: { uz: "So'z chegarasiga rioya qil", en: 'Respect the word limit' },
      p: {
        uz: "\"NO MORE THAN TWO WORDS\" degan ko'rsatma — qat'iy qoida. Uch so'z yozsang, javob to'g'ri bo'lsa ham nol ball. Raqam bitta so'z hisoblanadi; \"a\" va \"the\" ham so'z sanaladi.",
        en: '"NO MORE THAN TWO WORDS" is a hard rule. Write three and you score zero even if the content is right. A number counts as one word, and "a" and "the" count too.'
      },
      ex: ['TWO WORDS: "swimming pool" ✓ · "the swimming pool" ✗']
    }
  ],
  practice: [
    { uz: '3 ta Section 1 mashqini bajar.', en: 'Do three Section 1 exercises.' },
    { uz: "Har mashqdan oldin bo'shliqlarga javob turini yozib chiq.", en: 'Before each exercise, write the expected answer type in every gap.' },
    { uz: "Noto'g'ri javoblarni transkriptdan topib, sababini yoz.", en: 'Find every wrong answer in the transcript and log the reason.' },
    { uz: "Imlo xatolari uchun daftarda alohida ro'yxat och.", en: 'Open a separate spelling list in your notebook.' },
    { uz: 'LC darsini takrorla.', en: 'Review the LC lesson.' }
  ],
  konspekt: {
    uz: ["Tinglashdan oldin javob TURINI bashorat qil", 'Imlo xato = javob xato', 'a/e/i · m/n · b/p/v — xavfli juftliklar', "So'z chegarasi qat'iy: ortiqcha so'z = 0 ball", '"the" ham so\'z sanaladi'],
    en: ['Predict the answer TYPE before listening', 'A spelling error = a wrong answer', 'a/e/i · m/n · b/p/v are the dangerous pairs', 'The word limit is absolute: an extra word = 0', '"the" counts as a word']
  }
},

{
  d: 16, w: 2, i: 5, gram: 'paraphrasing', vocab: 'society', focus: ['reading'],
  title: { uz: 'Reading — skimming, scanning va paraphrase', en: 'Reading — skimming, scanning and paraphrase' },
  intro: {
    uz: "Reading testida matnni to'liq o'qishga vaqt yo'q: 60 daqiqada uchta uzun matn va 40 savol. Yechim — matnni o'qish emas, KERAKLI JOYNI topish. Buning uchun uchta ko'nikma kerak.",
    en: 'There is no time to read the passages fully: three long texts and 40 questions in 60 minutes. The answer is not to read the text but to LOCATE the place. That takes three skills.'
  },
  sections: [
    {
      h: { uz: 'Skimming — 2 daqiqada manzara', en: 'Skimming — the picture in two minutes' },
      p: {
        uz: "Sarlavha, birinchi abzats, har abzatsning birinchi va oxirgi gapi, oxirgi abzats. Shu bilan matn nima haqida ekanini va qaysi fikr qayerda turganini bilib olasan. Maqsad — tushunish emas, XARITA tuzish.",
        en: 'Title, first paragraph, the first and last sentence of each paragraph, final paragraph. That tells you what the text is about and where each idea sits. The goal is not comprehension but building a MAP.'
      },
      ex: ['Har abzats yoniga 2–3 so\'zli belgi yoz: "sabab", "misol", "qarshi fikr"']
    },
    {
      h: { uz: 'Scanning — kalit so\'zni topish', en: 'Scanning — locating the keyword' },
      p: {
        uz: "Savoldagi O'ZGARMAYDIGAN so'zni tanla: ism, sana, raqam, atama. Bular matnda paraphrase qilinmaydi — shuning uchun ular xarita bo'ladi. Keyin matnni ko'z bilan supurib, o'sha so'zni top va faqat atrofidagi 3–4 gapni o'qi.",
        en: 'Pick the UNCHANGEABLE word in the question: a name, date, number or technical term. These are not paraphrased in the text, so they act as landmarks. Then sweep the page for that word and read only the three or four sentences around it.'
      },
      ex: ['Savolda "1987" bo\'lsa — matnda ham "1987"', 'Savolda "important" bo\'lsa — matnda "crucial", "vital" bo\'lishi mumkin']
    },
    {
      h: { uz: 'Paraphrase — asosiy to\'siq', en: 'Paraphrase — the main obstacle' },
      p: {
        uz: "IELTS savoli matndagi so'zni AYNAN takrorlamaydi. Javobni topish demak — paraphrase'ni tanish demak. Paraphrase to'rt yo'l bilan qilinadi: sinonim, so'z shakli, aktiv↔passiv, tuzilma o'zgarishi. Shu to'rttasini bilsang, savol bilan matnni ulash osonlashadi.",
        en: 'An IELTS question never repeats the passage word for word. Finding the answer means recognising the paraphrase. Paraphrasing works four ways: synonyms, word-form change, active↔passive, and restructuring. Knowing all four makes matching question to text far easier.'
      },
      ex: ['Text: "The number of cars increased." → Q: "There was a rise in car ownership."', 'Text: "Many people believe…" → Q: "It is widely held that…"']
    }
  ],
  practice: [
    { uz: "Bitta matnni 2 daqiqada skim qilib, har abzatsga belgi yoz.", en: 'Skim one passage in 2 minutes and label every paragraph.' },
    { uz: "10 ta savoldan o'zgarmaydigan kalit so'zni ajratib chiq.", en: 'Extract the unchangeable keyword from 10 questions.' },
    { uz: "Har to'g'ri javob uchun matndagi paraphrase'ni topib yoz.", en: 'For every correct answer, find and write the paraphrase in the text.' },
    { uz: 'Reading: 45 daqiqa vaqt bilan.', en: 'Reading: 45 minutes, timed.' },
    { uz: "Writing: 1 ta Task 2 abzatsi.", en: 'Writing: one Task 2 paragraph.' }
  ],
  konspekt: {
    uz: ['Skimming — xarita tuzish (2 daqiqa)', 'Scanning — o\'zgarmaydigan so\'zni topish', 'Savol matndagi so\'zni AYNAN takrorlamaydi', 'Paraphrase 4 yo\'l: sinonim · so\'z shakli · passiv · tuzilma'],
    en: ['Skimming — build a map (2 minutes)', 'Scanning — find the unchangeable word', 'The question never repeats the passage exactly', 'Paraphrase 4 ways: synonym · word form · passive · restructure']
  }
},

{
  d: 17, w: 2, i: 6, gram: 'complex-sentences', vocab: 'task2-opinion', focus: ['writing'],
  title: { uz: 'Writing Task 2 — tuzilma', en: 'Writing Task 2 — structure' },
  intro: {
    uz: "Task 2 umumiy Writing ballining uchdan ikki qismini beradi. Bugun ideal insho yozishga urinmaymiz — SKELETINI o'rnatamiz. Tuzilma o'tirsa, keyingi haftalarda ustiga lug'at va grammatika qo'yiladi.",
    en: 'Task 2 carries two thirds of the Writing score. Today we are not trying to write a perfect essay — we install the SKELETON. Once the structure is in place, later weeks add vocabulary and grammar on top.'
  },
  sections: [
    {
      h: { uz: "To'rt abzats", en: 'Four paragraphs' },
      p: {
        uz: "Kirish (2–3 gap): savolni paraphrase qil + pozitsiyangni ayt. Body 1 (5–6 gap): birinchi fikr. Body 2 (5–6 gap): ikkinchi fikr. Xulosa (2 gap): pozitsiyani takrorla, yangi fikr qo'shma. Jami 250–280 so'z. Ko'proq yozish ball qo'shmaydi, xato ehtimolini oshiradi.",
        en: 'Introduction (2–3 sentences): paraphrase the question and state your position. Body 1 (5–6 sentences): the first idea. Body 2 (5–6 sentences): the second. Conclusion (2 sentences): restate the position, add nothing new. Total 250–280 words. Writing more adds no marks, only errors.'
      },
      ex: ['Kirish: paraphrase + pozitsiya', 'Body: topic sentence → tushuntirish → misol → natija', 'Xulosa: pozitsiya + umumiy fikr']
    },
    {
      h: { uz: 'Abzats ichidagi to\'rt qadam', en: 'Four steps inside a paragraph' },
      p: {
        uz: "Topic sentence (asosiy fikr bitta gapda) → tushuntirish (nega shunday) → misol (aniq, hayotiy) → natija (bu nimaga olib keladi). Bu to'rt qadam har abzatsda takrorlanadi. Misol o'ylab topilgan bo'lsa ham bo'ladi — muhimi aniq bo'lsin.",
        en: 'Topic sentence (the main idea in one sentence) → explanation (why) → example (specific, concrete) → result (what it leads to). These four steps repeat in every paragraph. An invented example is acceptable as long as it is specific.'
      },
      ex: ['One major benefit of remote work is improved flexibility. (topic)', 'This is because employees can organise their day around… (tushuntirish)', 'In Uzbekistan, for instance, many IT companies now… (misol)', 'As a result, staff retention has improved. (natija)']
    },
    {
      h: { uz: 'Savol matnini ko\'chirma', en: 'Never copy the prompt' },
      p: {
        uz: "Savoldan ko'chirilgan so'zlar so'z sanog'iga KIRMAYDI va Lexical Resource ballini tushiradi. Kirish abzatsining birinchi gapi — savolning paraphrase'i bo'lishi shart. Bu bitta gap butun inshoning birinchi taassurotini belgilaydi.",
        en: 'Words copied from the prompt do NOT count towards the word total and lower Lexical Resource. The first sentence of your introduction must be a paraphrase of the question. That single sentence sets the first impression of the whole essay.'
      },
      ex: ['Prompt: Some people think examinations are the best way to assess students.', '→ It is sometimes argued that formal testing provides the most reliable measure of student ability.']
    }
  ],
  practice: [
    { uz: "3 ta Task 2 savolini olib, faqat KIRISH abzatsini yoz (paraphrase + pozitsiya).", en: 'Take 3 Task 2 questions and write only the introduction (paraphrase + position).' },
    { uz: "Bitta body abzatsini to'rt qadam bo'yicha yoz.", en: 'Write one body paragraph following the four steps.' },
    { uz: "To'liq insho yoz (40 daqiqa, 250+ so'z).", en: 'Write a full essay (40 minutes, 250+ words).' },
    { uz: "Yozgandan keyin so'zlarni sanab, 250 dan oshganini tekshir.", en: 'Count the words afterwards and confirm you passed 250.' },
    { uz: 'LC darsini takrorla.', en: 'Review the LC lesson.' }
  ],
  konspekt: {
    uz: ['Kirish · Body 1 · Body 2 · Xulosa = 250–280 so\'z', 'Abzats: topic → tushuntirish → misol → natija', 'Savol matnini KO\'CHIRMA — paraphrase qil', 'Ko\'p yozish ball qo\'shmaydi'],
    en: ['Intro · Body 1 · Body 2 · Conclusion = 250–280 words', 'Paragraph: topic → explanation → example → result', 'Never copy the prompt — paraphrase it', 'Writing more adds no marks']
  }
},

{
  d: 18, w: 2, i: 7, focus: ['grammar', 'listening', 'reading'], review: true,
  title: { uz: 'TAKROR + NAZORAT — savol, moslik, tuzilma', en: 'REVIEW + TEST — questions, agreement, structure' },
  intro: {
    uz: "Ikkinchi hafta yakuni. Bugun kelasi zamon, so'roq gap, ega–kesim mosligi va Task 2 tuzilmasi nazoratdan o'tadi. Keyin to'liq Listening va Reading testi.",
    en: 'End of week two. Today tests future forms, question structure, subject–verb agreement and Task 2 structure, followed by a full Listening and Reading test.'
  },
  sections: [
    {
      h: { uz: 'Haftaning xulosasi', en: 'The week in summary' },
      p: {
        uz: "Kelasi zamon — shakl niyatni bildiradi. So'roq — yordamchi egadan oldin, bilvosita savolda esa oddiy tartib. Moslik — fe'l egaga, eng yaqin so'zga emas. Task 2 — to'rt abzats, har abzats to'rt qadam.",
        en: 'Future — the form signals intention. Questions — auxiliary before subject, but statement order in indirect questions. Agreement — the verb follows the subject, not the nearest word. Task 2 — four paragraphs, each with four steps.'
      },
      ex: ['when/if dan keyin kelasi zamon yo\'q', 'the number of → is · a number of → are', 'Kirish = paraphrase + pozitsiya']
    },
    {
      h: { uz: 'Ikki haftalik xatolar tahlili', en: 'Two weeks of errors' },
      p: {
        uz: "Xatolar daftaringni ochib, 14 kunlik yozuvlarni guruhla. Qaysi xato uch martadan ko'p takrorlangan? Shu ro'yxat — sening shaxsiy zaifliging, va u 10-haftadagi \"Band 7+ grammatikasi\" blokining asosi bo'ladi.",
        en: 'Open your error log and group the entries from these 14 days. Which errors appear more than three times? That list is your personal weakness, and it becomes the basis of the Band 7+ grammar block in week 10.'
      },
      ex: ['3+ marta takrorlangan xato = shaxsiy zaiflik', 'Ro\'yxatni saqlab qo\'y — 10-haftada kerak bo\'ladi']
    }
  ],
  practice: [
    { uz: 'Quyidagi testni ishla.', en: 'Take the test below.' },
    { uz: "To'liq Listening testi.", en: 'Full Listening test.' },
    { uz: "To'liq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Xatolar daftarini guruhlab, takrorlanuvchi 5 ta xatoni ajrat.", en: 'Group your error log and isolate the five recurring errors.' },
    { uz: 'Natijani haftalik jadvalga kirit.', en: 'Enter the result in the weekly scoreboard.' }
  ],
  konspekt: {
    uz: ['Kelasi zamon: shakl niyatni bildiradi', 'Bilvosita savolda tartib oddiy gapdek', 'Moslik: egani top, oradagi so\'zlarni yop', 'Task 2: 4 abzats × 4 qadam', 'Takrorlanuvchi xato = shaxsiy zaiflik'],
    en: ['Future: the form signals intention', 'Indirect questions keep statement order', 'Agreement: find the subject, cover what is in between', 'Task 2: 4 paragraphs × 4 steps', 'A recurring error is a personal weakness']
  },
  quiz: [
    { q: 'When I ___ the report, I will send it to you.', opts: ['will finish', 'finish', 'am finishing', 'finished'], correct: 1 },
    { q: 'Which is correct?', opts: ['Why you are late?', 'Why are you late?', 'Why late you are?', 'Why is you late?'], correct: 1 },
    { q: 'Could you tell me where ___?', opts: ['is the office', 'the office is', 'does the office', 'the office does be'], correct: 1 },
    { q: 'The number of applicants ___ risen sharply.', opts: ['have', 'has', 'are', 'were'], correct: 1 },
    { q: 'A number of students ___ absent today.', opts: ['is', 'was', 'are', 'has'], correct: 2 },
    { q: 'Which is correct?', opts: ['These informations are useful.', 'This information is useful.', 'This informations is useful.', 'These information are useful.'], correct: 1 },
    { q: 'Most academic prediction uses:', opts: ['will definitely', 'is likely to', 'is going to surely', 'must be'], correct: 1 },
    { q: 'A Task 2 essay should be about:', opts: ['150 words', '250–280 words', '400 words', 'as long as possible'], correct: 1 },
    { q: 'The first sentence of a Task 2 introduction should:', opts: ['copy the prompt', 'paraphrase the prompt', 'give an example', 'ask a question'], correct: 1 },
    { q: 'People ___ becoming more health-conscious.', opts: ['is', 'are', 'has', 'was'], correct: 1 }
  ]
}

];
