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
  title: { uz: 'IELTS nima va u nimani ölçaydi', en: 'What IELTS is and what it measures' },
  intro: {
    uz: "Birinçi kun grammatikadan boşlanmaydi. Avval nişonni köriş kerak: imtihon neçta qismdan iborat, har qaysisi qança davom etadi va ball qanday qöyiladi. Buni bilmasdan tayyorlaniş — xaritasiz yuriş.",
    en: "Day one does not start with grammar. First you need to see the target: how many parts the exam has, how long each lasts and how the score is produced. Preparing without this is walking without a map."
  },
  sections: [
    {
      h: { uz: "Tört bölim, bitta kun", en: 'Four sections, one day' },
      p: {
        uz: "Listening (30 daq, 40 savol), Reading (60 daq, 40 savol), Writing (60 daq, 2 vazifa) ketma-ket, tanaffussiz ötadi. Speaking (11–14 daq) alohida — öşa kuni yoki bir hafta içida. Listening va Readingda 40 ta xom ball band ballga aylanadi; Writing va Speaking esa mezon böyiça inson tomonidan baholanadi.",
        en: 'Listening (30 min, 40 questions), Reading (60 min, 40 questions) and Writing (60 min, 2 tasks) run back to back with no break. Speaking (11–14 min) is separate, on the same day or within a week. Listening and Reading convert 40 raw marks into a band; Writing and Speaking are marked by a human against criteria.'
      },
      ex: ['Listening 30 + Reading 60 + Writing 60 = 2 soat 30 daqiqa uzluksiz.']
    },
    {
      h: { uz: 'Band şkalasi va umumiy ball', en: 'The band scale and the overall score' },
      p: {
        uz: "Har bölim 0 dan 9 gaça, 0.5 qadam bilan baholanadi. Umumiy ball — törttasining örtaçasi, eng yaqin yarim balga yaxlitlangan holda. Muhimi şu: bitta zaif bölim hammasini pastga tortadi. 8+8+6.5+7 = 7.375 → 7.5. Yaʼni 8.0 uçun barça bölimlarda barqaror böliş kerak, bittasida zör böliş yetmaydi.",
        en: 'Each section is scored 0–9 in half-band steps. The overall score is the average of the four, rounded to the nearest half band. What matters: one weak section drags everything down. 8+8+6.5+7 = 7.375 → 7.5. For an 8.0 you need consistency across all four, not brilliance in one.'
      },
      ex: ['L 8.0 · R 8.0 · W 7.0 · S 7.5 → 7.625 → Overall 7.5', 'L 8.5 · R 8.5 · W 7.5 · S 7.5 → 8.0']
    },
    {
      h: { uz: 'Writing va Speaking qanday baholanadi', en: 'How Writing and Speaking are marked' },
      p: {
        uz: "Ikkalasida ham törtta teng mezon bor. Writing: Task Response (savolga töliq javob berdingmi), Coherence & Cohesion (fikr oqadimi), Lexical Resource (luğat), Grammatical Range & Accuracy. Speaking: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation. Har biri 25% — yaʼni çiroyli luğat bilan zaif tuzilmani qoplab bölmaydi.",
        en: 'Both use four equally weighted criteria. Writing: Task Response (did you fully answer), Coherence & Cohesion (does it flow), Lexical Resource, Grammatical Range & Accuracy. Speaking: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation. Each is 25%, so rich vocabulary cannot compensate for weak structure.'
      },
      ex: ['4 mezon × 25% = 100%. Bittasi 6.0 bo\'lsa, qolgani 8.0 bo\'lsa ham natija 7.5.']
    }
  ],
  practice: [
    { uz: "Rasmiy IELTS band descriptors (Writing va Speaking) ni topib, 7 va 8 ustunlarini yonma-yon öqib çiq.", en: 'Find the official IELTS band descriptors for Writing and Speaking and read the 7 and 8 columns side by side.' },
    { uz: "Bitta töliq Listening testini şunçaki TINGLA — javob berma, formatni his qil.", en: 'Just LISTEN to one full Listening test — do not answer, simply feel the format.' },
    { uz: "Bitta Reading matnini vaqtsiz öqib çiq: neçta savol turi borligini sana.", en: 'Read one Reading passage without timing and count how many question types appear.' },
    { uz: "Xatolar daftari uçun alohida daftar yoki fayl oç — 20 hafta şu bilan yuradi.", en: 'Open a dedicated notebook or file for your error log — it will run for all 20 weeks.' }
  ],
  konspekt: {
    uz: ['L 30daq/40 · R 60daq/40 · W 60daq/2 vazifa · S 11–14daq', "Umumiy ball = 4 bo'lim o'rtachasi, .25 → yuqoriga", "Writing/Speaking: 4 mezon, har biri 25%", 'Bitta zaif bo\'lim umumiy ballni pastga tortadi'],
    en: ['L 30min/40 · R 60min/40 · W 60min/2 tasks · S 11–14min', 'Overall = average of four, .25 rounds up', 'Writing/Speaking: 4 criteria, 25% each', 'One weak section drags the overall down']
  }
},

{
  d: 2, w: 0, i: 2, focus: ['grammar', 'vocab'],
  title: { uz: 'Boşlanğiç daraja va xatolar daftari', en: 'Baseline level and the error log' },
  intro: {
    uz: "Bugun özingni ölçaysan. Ball past çiqişi mumkin va bu normal — biz boşlanğiç nuqtani qidiryapmiz, natijani emas. Şu bilan birga 20 hafta davomida işlatiladigan eng muhim vositani — xatolar daftarini — oçamiz.",
    en: 'Today you measure yourself. The score may be low and that is fine — we are looking for a starting point, not a result. At the same time you open the single most important tool of the next 20 weeks: the error log.'
  },
  sections: [
    {
      h: { uz: 'Nega xatolar daftari işlaydi', en: 'Why an error log works' },
      p: {
        uz: "Odam bir xil xatoni qayta-qayta qiladi — lekin qaysi xatoni ekanini bilmaydi. Yozib borsang, ikki haftadan keyin röyxatda 40 ta emas, 8–10 ta TAKRORLANUVÇI xato borligi maʼlum böladi. Şu 10 tasini yopiş — 50 ta yangi qoida örganişdan foydali.",
        en: 'People repeat the same mistakes without knowing which ones. Once you write them down, after two weeks the list shows not 40 errors but 8–10 RECURRING ones. Closing those ten is worth more than learning fifty new rules.'
      },
      ex: ['Xato → To\'g\'risi → Nega', 'he go → he goes → 3-shaxs birlikda -s', 'informations → information → sanalmaydi']
    },
    {
      h: { uz: 'Daftar şakli', en: 'The log format' },
      p: {
        uz: "Uç ustun yetadi: NIMA yozdim, QANDAY bölişi kerak edi, NEGA. Uçinçi ustun eng muhimi — sababni yozmasang, xato qaytadi. Har xatoga sana qöy: agar bir xato uç hafta ketma-ket çiqsa, u şu haftaning asosiy vazifasiga aylanadi.",
        en: 'Three columns are enough: what I wrote, what it should be, and why. The third column matters most — without the reason the error returns. Date every entry: if one error appears three weeks running, it becomes that week\'s main task.'
      },
      ex: ['09-sen | I am agree | I agree | agree — fe\'l, am kerak emas']
    }
  ],
  practice: [
    { uz: "Töliq Reading testini vaqt bilan bajar (60 daqiqa, 40 savol).", en: 'Do a full Reading test under timing (60 minutes, 40 questions).' },
    { uz: "Töliq Listening testini bajar (30 daqiqa + 10 daqiqa köçiriş).", en: 'Do a full Listening test (30 minutes + 10 to transfer answers).' },
    { uz: "Har notöğri javob uçun matndan DALILNI topib, daftarga yoz.", en: 'For every wrong answer, find the evidence in the text and log it.' },
    { uz: "Xatolar daftarining birinçi 10 qatorini töldir.", en: 'Fill in the first ten rows of your error log.' }
  ],
  konspekt: {
    uz: ['Xato → To\'g\'risi → Nega (uch ustun)', 'Har xatoga sana qo\'y', '3 hafta takrorlangan xato — o\'sha haftaning vazifasi', 'Sababsiz yozilgan xato qaytadi'],
    en: ['Mistake → Correction → Why (three columns)', 'Date every entry', 'An error repeating for 3 weeks becomes that week\'s task', 'An entry without a reason will come back']
  }
},

{
  d: 3, w: 0, i: 3, focus: ['grammar', 'vocab', 'speaking'],
  title: { uz: "Öquv tizimi: olti könikma bir zanjirda", en: 'The study system: six skills in one chain' },
  intro: {
    uz: "Köpçilik grammatikani alohida, luğatni alohida, Speakingni alohida örganadi — va heç biri ikkinçisiga ulanmaydi. Natija: qoidani biladi, lekin gapirolmaydi. Bugun şu muammoning yeçimini örnatamiz.",
    en: 'Most learners study grammar separately, vocabulary separately and speaking separately — and none of it connects. The result: they know the rule but cannot speak. Today we install the fix for that.'
  },
  sections: [
    {
      h: { uz: 'Zanjir: öqiş → luğat → grammatika → gapiriş → yoziş', en: 'The chain: reading → vocabulary → grammar → speaking → writing' },
      p: {
        uz: "Bitta material beşta bosqiçdan ötadi. Matnni öqiysan → undan 10 ta söz olasan → şu sözlarni bugungi grammatik qurilmada gapga solasan → şu gaplarni ovoz çiqarib aytasan → inşoga yozasan. Bir soatlik iş, lekin söz passivdan aktivga ötadi.",
        en: 'One piece of material passes through five stages. You read a text → take ten words from it → put those words into today\'s grammar structure → say those sentences aloud → write them into an essay. It takes an hour, but the words move from passive to active.'
      },
      ex: ['Matn: "urban congestion"', 'So\'z: congestion + traffic congestion, reduce congestion', 'Grammatika (Present Perfect): Traffic congestion has become far worse.', 'Gapirish: yozib ol va tinglab chiq', 'Yozish: insho abzatsiga qo\'y']
    },
    {
      h: { uz: 'Grammatikaning 7 qadami', en: 'The seven steps for grammar' },
      p: {
        uz: "Örgan → maşq qil → 5–10 ta ÖZ gapingni yoz → şu grammatika bilan gapir → inşoda işlat → xatoni top → takrorla. Uçinçi qadam eng köp taşlab ketiladi va aynan u passiv bilimni aktivga aylantiradi. Maşq kitobidagi böşliqni töldiriş — örganiş emas, taniş.",
        en: 'Learn → practise → write 5–10 of YOUR OWN sentences → speak using it → use it in writing → find the error → repeat. Step three is the one most often skipped, and it is exactly the step that converts passive knowledge into active. Filling gaps in a workbook is recognition, not learning.'
      },
      ex: ['Qoidani o\'qidim ≠ bilaman', 'Mashqni to\'g\'ri yechdim ≠ ishlata olaman', 'O\'z gapimni yozdim va aytdim = ishlata olaman']
    },
    {
      h: { uz: 'Luğatning 5 qadami', en: 'The five steps for vocabulary' },
      p: {
        uz: "Söz → kollokatsiya → gap → gapiriş → yoziş. Tarjima yozib qöyiş eng zaif usul. \"significant\" ni biliş yetarli emas; \"a significant impact\", \"significantly higher\" — mana şu Band 8. Kuniga 10–15 ta yetadi, lekin har biri IŞLATILIŞI şart.",
        en: 'Word → collocation → sentence → speaking → writing. Writing down a translation is the weakest method. Knowing "significant" is not enough; "a significant impact", "significantly higher" — that is Band 8. Ten to fifteen a day is plenty, but every one must be USED.'
      },
      ex: ['significant → a significant impact / significantly higher', 'Technology has had a significant impact on education.']
    }
  ],
  practice: [
    { uz: "Bitta qisqa maqola öqib, 10 ta sözni kollokatsiyasi bilan yozib ol.", en: 'Read one short article and record ten words with their collocations.' },
    { uz: "Öşa 10 ta sözdan 10 ta öz gapingni yoz.", en: 'Write ten of your own sentences using those ten words.' },
    { uz: "Gaplarni ovoz çiqarib ayt va telefonga yozib ol.", en: 'Say the sentences aloud and record them on your phone.' },
    { uz: "Yozuvni tinglab, uçta narsani belgila: grammatik xato, talaffuz, pauza.", en: 'Listen back and mark three things: grammar errors, pronunciation, pauses.' }
  ],
  konspekt: {
    uz: ["Zanjir: o'qish → lug'at → grammatika → gapirish → yozish", 'Grammatika 7 qadam: eng muhimi — O\'Z gapingni yozish', "Lug'at 5 qadam: so'z yolg'iz emas, kollokatsiya bilan", 'Ishlatilmagan so\'z — o\'rganilmagan so\'z'],
    en: ['Chain: reading → vocabulary → grammar → speaking → writing', 'Grammar in 7 steps: the key one is writing YOUR OWN sentences', 'Vocabulary in 5 steps: never the word alone, always with collocations', 'A word you never use is a word you never learned']
  }
},

{
  d: 4, w: 0, i: 4, focus: ['listening', 'reading', 'writing', 'speaking'],
  title: { uz: "BOŞLANĞIÇ MOCK — töliq ölçov", en: 'BASELINE MOCK — the full measurement' },
  intro: {
    uz: "Bugun törtala bölimni ham real vaqtda bajarasan. Bu ball 20 hafta davomida taqqoslanadigan nuqta böladi — şuning uçun halol bajar: pauza yöq, luğat yöq, telefon yöq.",
    en: 'Today you do all four sections under real timing. This score becomes the reference point for the next 20 weeks, so do it honestly: no pauses, no dictionary, no phone.'
  },
  sections: [
    {
      h: { uz: 'Tartib va vaqt', en: 'Order and timing' },
      p: {
        uz: "Listening 30 daqiqa (+10 daqiqa javobni köçiriş), keyin darhol Reading 60 daqiqa, keyin darhol Writing 60 daqiqa. Tanaffus qilma — imtihonda ham yöq. Speaking'ni alohida bajar: kartoçkalarni tanlab, özingni yozib ol.",
        en: 'Listening 30 minutes (+10 to transfer answers), then Reading 60 minutes immediately, then Writing 60 minutes immediately. Take no break — there is none in the exam. Do Speaking separately: pick cue cards and record yourself.'
      },
      ex: ['Writing: Task 1 ga 20 daqiqa, Task 2 ga 40 daqiqa. Task 2 ikki barobar ko\'p ball beradi.']
    },
    {
      h: { uz: 'Natijadan keyin nima qilinadi', en: 'What to do with the result' },
      p: {
        uz: "Ballni yozib qöyiş — işning eng kiçik qismi. Asosiysi: har notöğri javob uçun \"NEGA xato qildim?\" degan savolga bir jumlada javob yoziş. Sabablar odatda tört xil: (1) sözni bilmadim, (2) paraphraseʼni körmadim, (3) vaqt yetmadi, (4) eʼtiborsizlik. Törttasining yeçimi butunlay boşqa.",
        en: 'Recording the score is the smallest part of the job. What matters is answering "why did I get this wrong?" in one sentence for every wrong answer. The reasons are usually four: (1) I did not know the word, (2) I did not see the paraphrase, (3) I ran out of time, (4) carelessness. Each has a completely different fix.'
      },
      ex: ['Sabab: so\'z → lug\'at ustida ish', 'Sabab: paraphrase → o\'qish texnikasi', 'Sabab: vaqt → strategiya', 'Sabab: e\'tiborsizlik → tekshirish odati']
    }
  ],
  practice: [
    { uz: "Töliq Listening testi — real vaqt, bir marta tinglaş.", en: 'Full Listening test — real timing, single play.' },
    { uz: "Töliq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Writing Task 1 (20 daq) + Task 2 (40 daq).", en: 'Writing Task 1 (20 min) + Task 2 (40 min).' },
    { uz: "Speaking Part 1+2+3 — yozib ol.", en: 'Speaking Parts 1+2+3 — record it.' },
    { uz: "Har notöğri javobga bir jumlalik sabab yoz va platformadagi mock jadvaliga ballni kirit.", en: 'Write a one-sentence reason for every wrong answer and enter the bands in the platform scoreboard.' }
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
    uz: "Birinçi grammatik kun. Present Simple oson körinadi, lekin IELTS inşosining yarmi şu zamonda yoziladi — va aynan şu yerda \"he go\" tipidagi xato ball yöqotadi. Bugun qoidani emas, ODATNI örnatamiz.",
    en: 'The first grammar day. Present Simple looks easy, yet half of an IELTS essay is written in it — and it is exactly where "he go" type errors cost marks. Today we install the habit, not the rule.'
  },
  sections: [
    {
      h: { uz: 'Zamon emas, holat', en: 'Not a time, a state' },
      p: {
        uz: "Nomi \"hozirgi\" bölsa ham, bu zamon \"şu daqiqada\" degani emas. U doimiy holatni bildiradi: doim şunday, odatda şunday, jadval böyiça şunday. Şuning uçun \"I am writing now\" töğri, \"I write now\" ğalati eşitiladi.",
        en: 'Despite the name, this tense does not mean "at this moment". It states a permanent condition: always true, usually true, true by timetable. That is why "I am writing now" is right and "I write now" sounds odd.'
      },
      ex: ['Water boils at 100°C.', 'I study every evening.', 'The exam starts at nine.', 'Technology plays a central role in modern education.']
    },
    {
      h: { uz: "-s qayerga ketadi", en: 'Where the -s goes' },
      p: {
        uz: "Tasdiq gapda he/şe/it bilan feʼlga -s qöşiladi. Inkor va söroqda esa şu -s DOES ga köçib ötadi va feʼl asl şaklga qaytadi. Bu bitta harakat: -s bir joyda böladi, ikki joyda emas.",
        en: 'In a positive statement he/she/it adds -s to the verb. In negatives and questions that -s MOVES onto does and the verb returns to base form. It is one movement: the -s lives in one place, never two.'
      },
      ex: ['She works. → She does not work. → Does she work?', 'He goes. → He does not go. → Does he go?', "XATO: She doesn't works."]
    },
    {
      h: { uz: "Taʼlim mavzusi bilan birga", en: 'Combined with the education topic' },
      p: {
        uz: "Grammatikani böş gaplarda maşq qilma. Bugungi luğat töplami — taʼlim. Har bir yangi sözni Present Simple da, taʼlim haqidagi FIKR sifatida yoz. Şunda grammatika ham, luğat ham, Task 2 uçun tayyor material ham bir vaqtda hosil böladi.",
        en: 'Do not practise grammar in empty sentences. Today\'s vocabulary set is education. Write every new word in Present Simple as an OPINION about education. That way you build grammar, vocabulary and ready Task 2 material at once.'
      },
      ex: ['The national curriculum rarely includes financial literacy.', 'Rising tuition fees prevent talented students from applying.', 'Schools that rely on rote learning discourage independent thought.']
    }
  ],
  practice: [
    { uz: "Present Simple da 10 ta gap yoz — hammasi taʼlim haqida fikr bölsin.", en: 'Write 10 Present Simple sentences, all opinions about education.' },
    { uz: "Har birini inkor va söroq şakliga ötkaz (does bilan).", en: 'Convert each into a negative and a question (with does).' },
    { uz: "Luğat töplamidan 10 ta sözni kollokatsiyasi bilan daftarga yoz.", en: 'Record 10 words from the vocabulary set with their collocations.' },
    { uz: "Gaplaringni ovoz çiqarib ayt, yozib ol, -s tuşib qolganini tekşir.", en: 'Say your sentences aloud, record them, and check for dropped -s.' },
    { uz: "Listening: 1 ta Section 1 maşqi (raqam va ism).", en: 'Listening: one Section 1 exercise (numbers and names).' }
  ],
  konspekt: {
    uz: ["Present Simple = doimiy holat, \"hozir\" emas", "he/she/it → fe'lga -s", "does bor bo'lsa fe'l asl shaklda: doesn't work", "Grammatikani BO'SH gapda emas, mavzu bilan mashq qil"],
    en: ['Present Simple = permanent state, not "right now"', 'he/she/it → verb takes -s', 'When does appears the verb is bare: doesn\'t work', 'Practise grammar inside a topic, never in empty sentences']
  }
},

{
  d: 6, w: 1, i: 2, gram: 'present-continuous', vocab: 'education', focus: ['grammar', 'listening'],
  title: { uz: 'Present Continuous — hozir va özgariş', en: 'Present Continuous — now and change' },
  intro: {
    uz: "Bugun LC kuni, şuning uçun mustaqil yuk yengilroq. Present Continuous ning uçinçi maʼnosi — ÖZGARIŞ — IELTS uçun eng qimmatlisi: Task 1 dagi har bir grafik şu zamonda tasvirlanadi.",
    en: 'Today is an LC day, so the self-study load is lighter. The third meaning of Present Continuous — CHANGE — is the most valuable for IELTS: every trend in Task 1 is described in it.'
  },
  sections: [
    {
      h: { uz: 'Uç maʼno', en: 'Three meanings' },
      p: {
        uz: "(1) Aynan hozir: I am writing an essay. (2) Vaqtinçalik holat: Iʼm living with my cousin this year — doimiy emas. (3) Özgariş tendensiyasi: Cities are becoming more crowded. Uçinçisi \"nowadays\", \"these days\", \"increasingly\" bilan yuradi.",
        en: '(1) Right now: I am writing an essay. (2) A temporary situation: I\'m living with my cousin this year — not permanent. (3) A changing trend: Cities are becoming more crowded. The third goes with "nowadays", "these days", "increasingly".'
      },
      ex: ['More and more people are working from home.', 'The cost of living is rising in almost every major city.', 'Attitudes towards online education are changing quickly.']
    },
    {
      h: { uz: "Holat feʼllari -ing olmaydi", en: 'State verbs take no -ing' },
      p: {
        uz: "know, want, like, believe, understand, belong, need, prefer — bular harakat emas, HOLAT. Ularning Continuous şakli yöq. \"I am knowing\" — Band 6 belgisi. Röyxatni bir marta yodla, keyin şu xato butunlay yöqoladi.",
        en: 'know, want, like, believe, understand, belong, need, prefer are not actions but STATES. They have no continuous form. "I am knowing" is a Band 6 marker. Memorise the list once and this error disappears for good.'
      },
      ex: ['XATO: I am knowing the answer. → I know the answer.', 'XATO: I am wanting to study. → I want to study.']
    }
  ],
  practice: [
    { uz: "Özgariş maʼnosida 8 ta gap yoz (taʼlim va texnologiya haqida).", en: 'Write 8 sentences in the "change" meaning (about education and technology).' },
    { uz: "Present Simple va Continuous ni farqlaydigan 10 ta juft gap tuz.", en: 'Build 10 pairs of sentences contrasting Present Simple and Continuous.' },
    { uz: "Holat feʼllari röyxatini daftarga köçir.", en: 'Copy the state-verb list into your notebook.' },
    { uz: "LC darsida örganilgan narsani 20 daqiqada takrorla.", en: 'Spend 20 minutes reviewing what you covered at LC.' },
    { uz: 'Listening: 30 daqiqa Section 1–2 maşqi.', en: 'Listening: 30 minutes of Section 1–2 practice.' }
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
    uz: "Past Simple ning özi qiyin emas; qiyini — inkor va söroqda did paydo bölganda feʼlni asl şaklga qaytariş. \"I didnʼt went\" — özbek öquvçilarida eng köp uçraydigan uçta xatodan biri.",
    en: 'Past Simple itself is not hard; the difficulty is returning the verb to base form once did appears in negatives and questions. "I didn\'t went" is one of the three most common errors among Uzbek learners.'
  },
  sections: [
    {
      h: { uz: 'Vaqt aytilgan bölsa — Past Simple', en: 'If the time is stated, use Past Simple' },
      p: {
        uz: "Bu zamonning belgisi — vaqt. yesterday, last year, in 2020, two days ago, when I was young. Şu sözlardan biri bölsa, Present Perfect işlatib bölmaydi. Vaqt aytilmasa ham, kontekstdan tuşunarli bölsa yetadi.",
        en: 'The signal for this tense is a time expression: yesterday, last year, in 2020, two days ago, when I was young. If one of these is present, Present Perfect is impossible. An implied but clear time is enough too.'
      },
      ex: ['I finished school in 2023.', 'The figure rose sharply between 2010 and 2015.', 'The government introduced the policy in 2019.']
    },
    {
      h: { uz: 'did paydo bölsa feʼl asl şaklda', en: 'When did appears the verb goes bare' },
      p: {
        uz: "did allaqaçon ötgan zamonni körsatib turibdi — feʼl ikkinçi marta ötgan zamonga ötişi şart emas. Bu Present Simple dagi does bilan bir xil mantiq: belgi bir joyda böladi.",
        en: 'did already marks the past — the verb does not need to mark it a second time. This is the same logic as does in Present Simple: the marker lives in one place.'
      },
      ex: ['I went. → I did not go. → Did you go?', 'XATO: I didn\'t went. / When you did arrive?', "TO'G'RI: When did you arrive?"]
    },
    {
      h: { uz: 'Notöğri feʼllarni qanday yodlaş', en: 'How to learn irregular verbs' },
      p: {
        uz: "Alifbo tartibida yodlaş işlamaydi. Ularni ŞAKL böyiça guruhla: özgarmaydiganlar (cut-cut-cut), ikkitasi bir xil (buy-bought-bought), uçtasi boşqa (go-went-gone). Kuniga 10 tadan, lekin har birini gapda işlat.",
        en: 'Alphabetical memorisation does not work. Group them by PATTERN: unchanging (cut-cut-cut), two forms alike (buy-bought-bought), three different (go-went-gone). Ten a day, but use each in a sentence.'
      },
      ex: ['cut · put · let · set — o\'zgarmaydi', 'buy → bought → bought', 'go → went → gone / write → wrote → written']
    }
  ],
  practice: [
    { uz: "Keçagi kuningni Past Simple da 10 gapda yoz.", en: 'Describe yesterday in 10 Past Simple sentences.' },
    { uz: "10 ta notöğri feʼlni şakl böyiça guruhlab yodla va har biriga gap tuz.", en: 'Group and learn 10 irregular verbs by pattern, writing a sentence for each.' },
    { uz: "Past Simple da 5 ta inkor va 5 ta söroq gap tuz (did bilan).", en: 'Build 5 negatives and 5 questions in Past Simple (with did).' },
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
  title: { uz: 'Past Continuous — ötmişning foni', en: 'Past Continuous — the background of the past' },
  intro: {
    uz: "Bu zamon yolğiz kam işlatiladi. Uning kuçi — Past Simple bilan JUFTLIKDA: uzun iş fon böladi, qisqasi uni böladi. Speaking Part 2 hikoyasining tabiiy şakli aynan şu.",
    en: 'This tense is rarely used alone. Its power is in PAIRING with Past Simple: the long action sets the background and the short one interrupts it. That is the natural shape of a Speaking Part 2 story.'
  },
  sections: [
    {
      h: { uz: 'Fon va hodisa', en: 'Background and event' },
      p: {
        uz: "\"I was studying when the phone rang.\" — öqiş davom etardi (fon, Continuous), telefon jiringladi (hodisa, Simple). Qaysi biri uzun bölsa, öşa Continuous. Bu qoidani bilsang, ikkalasi orasida heç qaçon adaşmaysan.",
        en: '"I was studying when the phone rang." — the studying was in progress (background, Continuous), the phone rang (event, Simple). Whichever action is longer takes the Continuous. Know this and you will never confuse the two.'
      },
      ex: ['While I was walking home, I saw an old friend.', 'She was preparing dinner when the power went out.', 'They were living in Tashkent at the time.']
    },
    {
      h: { uz: 'Hikoyani boşlaş uçun', en: 'For opening a story' },
      p: {
        uz: "Speaking Part 2 da javobni darhol faktdan boşlama — bir gap bilan manzara çiz. \"It was a cold evening and I was waiting for a bus…\" Bu grammatik xilma-xillik ham beradi, ravonlik ham: birinçi 10 soniyada nima deyişni bilib turasan.",
        en: 'In Speaking Part 2 do not open with a bare fact — paint the scene in one sentence. "It was a cold evening and I was waiting for a bus…" This shows grammatical range and helps fluency: you know what to say in the first ten seconds.'
      },
      ex: ['It was late and everyone was getting ready to leave when…', 'I was studying abroad at the time, so…']
    }
  ],
  practice: [
    { uz: "5 ta \"was/were + -ing … when + Past Simple\" gapini yoz.", en: 'Write 5 sentences of the form "was/were + -ing … when + Past Simple".' },
    { uz: "Speaking Part 2: bitta kartoçkaga javob ber, boşini Past Continuous bilan boşla.", en: 'Speaking Part 2: answer one cue card, opening with Past Continuous.' },
    { uz: "Javobingni yozib ol va zamon almaşuvini tekşir.", en: 'Record your answer and check the tense switching.' },
    { uz: "LC darsi materialini 20 daqiqa takrorla.", en: 'Review the LC lesson material for 20 minutes.' },
    { uz: 'Speaking: 30 daqiqa maşq.', en: 'Speaking: 30 minutes of practice.' }
  ],
  konspekt: {
    uz: ["was/were + fe'l-ing", 'Uzun ish = Continuous (fon), qisqa ish = Simple (hodisa)', 'when + Past Simple / while + Past Continuous', 'Part 2 hikoyasini manzara bilan boshla'],
    en: ['was/were + verb-ing', 'Long action = Continuous (background), short = Simple (event)', 'when + Past Simple / while + Past Continuous', 'Open a Part 2 story with a scene']
  }
},

{
  d: 9, w: 1, i: 5, gram: 'present-perfect', vocab: 'technology', focus: ['grammar', 'writing'],
  title: { uz: 'Present Perfect — ötmiş hozirga ulangan', en: 'Present Perfect — the past connected to now' },
  intro: {
    uz: "Bu — kursning eng muhim grammatik kuni. Özbek tilida bu farq YÖQ, şuning uçun bu xato deyarli hammada bor va u Band 7 dan yuqoriga çiqişga tösqinlik qiladi. Bugun uni tugatamiz.",
    en: 'This is the most important grammar day of the course. Uzbek does not draw this distinction, so almost every learner makes the error, and it blocks the move above Band 7. Today we end it.'
  },
  sections: [
    {
      h: { uz: 'Bu ötgan zamon EMAS', en: 'This is NOT a past tense' },
      p: {
        uz: "Present Perfect — hozirgi zamon oilasidan. U ötmişdagi işni HOZIRGI holat uçun aytadi. \"I have lost my key\" — gap kalitni yöqotgan payt haqida emas, hozir kalitsiz turganim haqida. Şuning uçun aniq ötgan vaqt bilan kelmaydi: vaqt aytilsa, diqqat ötmişga köçadi va Past Simple kerak böladi.",
        en: 'Present Perfect belongs to the present family. It reports a past action because of its PRESENT relevance. "I have lost my key" is not about the moment of losing but about being without a key now. That is why it cannot take a finished time expression: naming the time shifts focus to the past and forces Past Simple.'
      },
      ex: ['I have lost my key. (hozir kalitsizman)', 'I lost my key yesterday. (vaqt aytildi)', "XATO: I have lost my key yesterday."]
    },
    {
      h: { uz: 'Uçta işlatiliş', en: 'Three uses' },
      p: {
        uz: "(1) Natijasi hozir körinadi. (2) Davom etayotgan davr: for/since bilan — I have lived here for ten years (hali yaşayman). (3) Hayotiy tajriba, vaqti muhim emas: I have been to Dubai. Uçinçisida ever/never juda köp işlatiladi.",
        en: '(1) The result is visible now. (2) An ongoing period, with for/since — I have lived here for ten years (still living). (3) Life experience where time is irrelevant: I have been to Dubai. The third often uses ever/never.'
      },
      ex: ['Online learning has become far more common over the last decade.', 'I have been studying English since I was twelve.', 'She has never taken an international exam before.']
    },
    {
      h: { uz: 'Task 2 da nega kerak', en: 'Why it matters in Task 2' },
      p: {
        uz: "Inşo köpinça \"sönggi ön yilda nima özgardi\" degan fikrdan boşlanadi — bu aynan Present Perfect. Kiriş abzatsida bitta töğri Present Perfect gapi butun inşoning ohangini akademik qilib qöyadi.",
        en: 'An essay often opens with what has changed over the last decade — precisely Present Perfect territory. One correct Present Perfect sentence in the introduction sets an academic tone for the whole essay.'
      },
      ex: ['Technology has transformed the way people communicate.', 'Governments have introduced a number of measures to address this issue.']
    }
  ],
  practice: [
    { uz: "for va since bilan 10 ta gap yoz (texnologiya mavzusida).", en: 'Write 10 sentences with for and since (technology topic).' },
    { uz: "10 ta juft gap: bittasi Past Simple, ikkinçisi Present Perfect — farqni izohla.", en: 'Write 10 pairs, one Past Simple and one Present Perfect, and explain the difference.' },
    { uz: "Xatolar daftaringni oçib, Present Perfect xatolarini alohida belgila.", en: 'Open your error log and mark Present Perfect errors separately.' },
    { uz: 'Writing: 1 ta töliq Task 2 inşo (40 daqiqa).', en: 'Writing: one full Task 2 essay (40 minutes).' },
    { uz: "Inşoda kamida 2 ta Present Perfect gapi bölsin.", en: 'Include at least two Present Perfect sentences in the essay.' }
  ],
  konspekt: {
    uz: ['have/has + III shakl', "Bu HOZIRGI zamon: o'tmish hozirga ta'sir qiladi", 'Aniq o\'tgan vaqt bilan KELMAYDI (yesterday, in 2020)', 'for / since / just / already / yet / ever / never', 'has gone (III), has went EMAS'],
    en: ['have/has + past participle', 'A PRESENT tense: the past matters now', 'Never with a finished time (yesterday, in 2020)', 'for / since / just / already / yet / ever / never', 'has gone (third form), never has went']
  }
},

{
  d: 10, w: 1, i: 6, gram: 'past-perfect', vocab: 'technology', focus: ['grammar'],
  title: { uz: 'Past Perfect va zamonlarni farqlaş', en: 'Past Perfect and choosing between tenses' },
  intro: {
    uz: "Past Perfect ning bitta vazifasi bor: ötmişdagi ikki işning tartibini körsatiş. Uni köp işlatiş şart emas. Bugun şu bilan birga haftaning asosiy könikmasini örnatamiz — zamonni QANDAY tanlaş.",
    en: 'Past Perfect has exactly one job: showing the order of two past events. It does not need to appear often. Today we also install the week\'s core skill — HOW to choose a tense.'
  },
  sections: [
    {
      h: { uz: 'Ikki iş, aniq tartib', en: 'Two events, clear order' },
      p: {
        uz: "had + III şakl faqat AVVAL bölgan işga qöyiladi. \"The train had left before I arrived\" — poyezd birinçi ketdi. Agar before yoki after allaqaçon tartibni aytib turgan bölsa, had şart emas — lekin xato ham emas.",
        en: 'had + past participle marks only the EARLIER event. "The train had left before I arrived" — the train went first. If before or after already makes the order clear, had is optional — but not wrong.'
      },
      ex: ['By the time the policy was introduced, the situation had already worsened.', 'I had never spoken to a native speaker before I joined the course.', 'She realised that she had made a serious mistake.']
    },
    {
      h: { uz: 'Zamon tanlaşning uç savoli', en: 'Three questions for choosing a tense' },
      p: {
        uz: "Qoidalarni eslaşga urinma — savol ber. (1) Iş tugaganmi? (2) Tugagan bölsa, QAÇON tugagani aytilganmi? (3) Hozirga boğliqmi? Vaqt aytilgan → Past Simple. Aytilmagan va natija hozir muhim → Present Perfect. Hozir davom etyapti yoki özgaryapti → Present Continuous.",
        en: 'Do not try to recall rules — ask questions. (1) Is it finished? (2) If so, is the time stated? (3) Does it matter now? Stated time → Past Simple. No stated time and the result matters → Present Perfect. Happening or changing now → Present Continuous.'
      },
      ex: ['I studied there for three years. (tugagan)', 'I have studied there for three years. (hali o\'qiyman)', 'The figure rose in 2015. (aniq yil)', 'The figure has risen since 2015. (hozirgacha)']
    }
  ],
  practice: [
    { uz: "Past Perfect bilan 8 ta gap yoz — har birida ikki ötgan iş bölsin.", en: 'Write 8 Past Perfect sentences, each containing two past events.' },
    { uz: "Zamon tanlaş jadvalini daftarga köçirib yoz.", en: 'Copy the tense-choice table into your notebook.' },
    { uz: "Oldingi kunlarda yozgan gaplaringni qayta öqib, zamon xatolarini top.", en: 'Reread your sentences from earlier days and find tense errors.' },
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
    uz: "Yakşanba — test va tahlil kuni. Bugun yangi narsa örganmaysan: haftaning oltita zamonini nazoratdan ötkazasan va bir Listening, bir Reading testi bajarasan. Kunning eng muhim qismi — testdan keyingi XATO TAHLILI.",
    en: 'Sunday is the test-and-review day. You learn nothing new today: you test the week\'s six tenses and do one Listening and one Reading test. The most important part of the day is the error analysis afterwards.'
  },
  sections: [
    {
      h: { uz: 'Haftaning xulosasi', en: 'The week in summary' },
      p: {
        uz: "Present Simple — doimiy holat. Present Continuous — hozir va özgariş. Past Simple — tugagan, vaqti aniq. Past Continuous — ötmiş foni. Present Perfect — ötmiş hozirga ulangan. Past Perfect — ötmişdan oldingi ötmiş. Oltalasining farqi vaqtda emas, MUNOSABATDA.",
        en: 'Present Simple — permanent state. Present Continuous — now and change. Past Simple — finished at a known time. Past Continuous — past background. Present Perfect — past connected to now. Past Perfect — the past before the past. The six differ not in time but in RELATIONSHIP.'
      },
      ex: ['Vaqt aytilganmi? → Past Simple', 'Natija hozirmi? → Present Perfect', 'Davom etyaptimi? → Continuous']
    },
    {
      h: { uz: 'Xato tahlili qanday qilinadi', en: 'How to run an error analysis' },
      p: {
        uz: "Ballni yozib qöyiş yetarli emas. Har notöğri javob uçun tört sababdan birini belgila: sözni bilmadim / paraphraseʼni körmadim / vaqt yetmadi / eʼtiborsizlik. Hafta oxirida qaysi sabab köp bölsa, keyingi haftaning eʼtibori öşa yerga qaratiladi.",
        en: 'Recording the score is not enough. For every wrong answer tag one of four reasons: did not know the word / missed the paraphrase / ran out of time / carelessness. Whichever reason dominates decides where next week\'s attention goes.'
      },
      ex: ['So\'z → lug\'at ishi', 'Paraphrase → o\'qish texnikasi', 'Vaqt → strategiya', 'E\'tiborsizlik → tekshirish odati']
    }
  ],
  practice: [
    { uz: 'Quyidagi testni işla (10 savol).', en: 'Take the test below (10 questions).' },
    { uz: "Töliq Listening testi — real vaqt bilan.", en: 'Full Listening test under real timing.' },
    { uz: "Töliq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Har notöğri javobga sabab yorliğini qöy.", en: 'Tag every wrong answer with a reason.' },
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
  title: { uz: 'Kelasi zamon şakllari', en: 'Future forms' },
  intro: {
    uz: "Ingliz tilida yagona kelasi zamon yöq. Qaysi şaklni tanlaşing NIYAT haqida maʼlumot beradi — va IELTS'da başorat qiliş uçun will va be likely to eng köp kerak böladi.",
    en: 'English has no single future tense. The form you choose signals INTENTION — and for IELTS predictions, will and be likely to do most of the work.'
  },
  sections: [
    {
      h: { uz: 'Uç asosiy şakl', en: 'The three main forms' },
      p: {
        uz: "will — şu daqiqada qaror qilingan yoki taxmin. be going to — oldindan qaror qilingan reja yoki hozirgi dalilga asoslangan başorat. Present Continuous — kelişib qöyilgan uçraşuv. Uçalasini bir-birining örniga işlatib bölmaydi.",
        en: 'will — decided at the moment of speaking, or a prediction. be going to — a plan already made, or a prediction based on present evidence. Present Continuous — a fixed arrangement. The three are not interchangeable.'
      },
      ex: ['It will probably rain. (taxmin)', "I'm going to take IELTS in February. (reja)", "I'm meeting my tutor at five. (kelishilgan)"]
    },
    {
      h: { uz: 'Akademik başorat tili', en: 'The language of academic prediction' },
      p: {
        uz: "Inşoda \"will definitely\" deb yoziş zaiflik — buni isbotlab bölmaydi. Örniga ehtimol darajasini körsat: is likely to, is expected to, may well, could. Bu \"işonçsizlik\" emas, ilmiy aniqlik va Band 7+ belgisi.",
        en: 'Writing "will definitely" in an essay reads as weak — it cannot be defended. Instead mark the degree of probability: is likely to, is expected to, may well, could. This is not vagueness but precision, and a Band 7+ marker.'
      },
      ex: ['Automation is likely to replace many routine jobs within a decade.', 'Costs are expected to rise significantly.', 'If this trend continues, the problem will become far more serious.']
    },
    {
      h: { uz: 'when va if dan keyin kelasi zamon yöq', en: 'No future after when and if' },
      p: {
        uz: "\"When I will finiş\" — xato. when, if, as soon as, until, before, after dan keyin hozirgi zamon işlatiladi, garçi maʼno kelajak bölsa ham. Bu qoida şart gaplarga ham tegişli va juda köp xato qilinadi.",
        en: '"When I will finish" is wrong. After when, if, as soon as, until, before and after, the present is used even though the meaning is future. The same rule governs conditionals and it is broken constantly.'
      },
      ex: ['When I finish, I will call you.', 'If it rains, we will stay at home.', "XATO: When I will finish, I will call you."]
    }
  ],
  practice: [
    { uz: "Kelajak haqida 10 ta gap yoz: 3 ta will, 3 ta going to, 2 ta Present Continuous, 2 ta be likely to.", en: 'Write 10 future sentences: 3 will, 3 going to, 2 Present Continuous, 2 be likely to.' },
    { uz: "Iş va bandlik mavzusida 5 ta başorat gapi yoz (akademik uslubda).", en: 'Write 5 predictions on work and employment in an academic register.' },
    { uz: "when/if bilan 5 ta gap yoz va kelasi zamon işlatmaganingni tekşir.", en: 'Write 5 sentences with when/if and check you used no future tense.' },
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
  title: { uz: "Söroq gap qurilişi", en: 'Question formation' },
  intro: {
    uz: "Speaking'da savolni notöğri tuşuniş — ball yöqotişning eng tez yöli. Savol qurilişini biliş faqat savol beriş uçun emas, savolni EŞITIŞ uçun ham kerak.",
    en: 'Misreading a question is the fastest way to lose marks in Speaking. Knowing question structure is not only for asking — it is for HEARING the question correctly.'
  },
  sections: [
    {
      h: { uz: 'Yordamçi feʼl egadan oldinga', en: 'The auxiliary moves before the subject' },
      p: {
        uz: "Söroq gapda yordamçi feʼl (do/does/did, am/is/are, have/has, will, can) egadan OLDIN keladi. Yordamçi bölmasa — do/does/did qöşiladi va asosiy feʼl asl şaklga qaytadi. Söroq sözi eng oldinga.",
        en: 'In a question the auxiliary (do/does/did, am/is/are, have/has, will, can) comes BEFORE the subject. If there is none, do/does/did is inserted and the main verb returns to base form. The question word goes first.'
      },
      ex: ['Do you agree? · Why do you think so?', 'Have you been there? · How long have you been studying?', "XATO: Why you are late? → Why are you late?"]
    },
    {
      h: { uz: 'Bilvosita savol — tartib özgarmaydi', en: 'Indirect questions keep statement order' },
      p: {
        uz: "\"Could you tell me where the office is?\" — bu savolning IÇIDA oddiy gap tartibi qoladi. \"where is the office\" deb yoziş xato. Bu qoida noun clause bilan bir xil va Writing'da ham kerak.",
        en: '"Could you tell me where the office is?" — INSIDE the question, statement order remains. Writing "where is the office" is wrong. The rule is the same as for noun clauses and it matters in Writing too.'
      },
      ex: ['I wonder why people prefer city life.', 'It is unclear what the main cause is.', "XATO: I don't know what is the answer."]
    }
  ],
  practice: [
    { uz: "10 ta Speaking Part 1 savolini yozib, har biriga töliq javob ber.", en: 'Write 10 Speaking Part 1 questions and answer each fully.' },
    { uz: "5 ta bilvosita savol tuz (I wonder…, Could you tell me…).", en: 'Build 5 indirect questions (I wonder…, Could you tell me…).' },
    { uz: "Speaking Part 1 javoblaringni yozib ol va savolga töğri javob berganingni tekşir.", en: 'Record your Part 1 answers and check you actually answered the question.' },
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
    uz: "Bu xato Band 7 dan yuqoriga çiqişga tösqinlik qiladigan eng köp uçraydigan xato. U maʼnoni buzmaydi — şuning uçun köz ilğamaydi, lekin baholovçi ilğaydi.",
    en: 'This is the most common error blocking a move above Band 7. It does not break meaning, so your eye slides past it — but the examiner\'s does not.'
  },
  sections: [
    {
      h: { uz: "Feʼl EGAGA moslaşadi", en: 'The verb agrees with the SUBJECT' },
      p: {
        uz: "Xato köpinça ega bilan feʼl orasiga uzun bölak tuşganda böladi. \"The number of students who study abroad IS rising\" — ega \"the number\", \"students\" emas. Inşo tekşirayotganda oradagi hamma sözni yopib, egani feʼl bilan yonma-yon qöyib kör.",
        en: 'The error appears when a long phrase sits between subject and verb. "The number of students who study abroad IS rising" — the subject is "the number", not "students". When proofreading, cover the words in between and place subject and verb side by side.'
      },
      ex: ['The impact of social media on young people is widely debated.', 'The list of items is long.', "XATO: The list of items are long."]
    },
    {
      h: { uz: 'Yodlanadigan olti holat', en: 'Six cases to memorise' },
      p: {
        uz: "the number of → birlik. a number of → köplik. information / advice / researç / knowledge → doim birlik. people → köplik. eaç / every / one of → birlik. both / several / many → köplik. Şu oltitasi xatolarning aksariyatini yopadi.",
        en: 'the number of → singular. a number of → plural. information / advice / research / knowledge → always singular. people → plural. each / every / one of → singular. both / several / many → plural. These six cover most of the errors.'
      },
      ex: ['The number of cars is rising.', 'A number of studies suggest that…', 'Research into this area has increased.', 'People are becoming healthier.']
    }
  ],
  practice: [
    { uz: "Olti holatning har biriga 2 tadan gap yoz (jami 12 ta).", en: 'Write two sentences for each of the six cases (12 in total).' },
    { uz: "Oldingi inşongni oçib, har gapning egasini belgilab çiq.", en: 'Open a previous essay and mark the subject of every sentence.' },
    { uz: "Xatolar daftaringda \"moslik\" bölimini oç.", en: 'Open an "agreement" section in your error log.' },
    { uz: 'Writing: 1 ta Task 2 inşo (40 daqiqa).', en: 'Writing: one Task 2 essay (40 minutes).' },
    { uz: "Inşoni topşirişdan oldin faqat moslik uçun bir marta öqib çiq.", en: 'Before finishing, reread the essay once checking only agreement.' }
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
    uz: "Section 1 eng oson bölim — va aynan şuning uçun bu yerdagi xato eng açinarli. Ball yöqotiş sababi deyarli har doim bitta: tinglaş emas, IMLO va format.",
    en: 'Section 1 is the easiest part — which makes an error here the most painful. The cause of lost marks is almost always the same: not listening, but SPELLING and format.'
  },
  sections: [
    {
      h: { uz: 'Javobni oldindan başorat qil', en: 'Predict the answer first' },
      p: {
        uz: "Tinglaşdan oldin har böşliqqa qarab, u yerga QANDAY TURDAGI javob kelişini yoz: raqammi, ismmi, sanami, pulmi. Bu miyani tayyorlaydi — kerakli maʼlumot eşitilganda u \"yonib\" ketadi. Başorat qilmasdan tinglaş — hamma sözni bir xil eʼtibor bilan eşitiş demak, bu esa imkonsiz.",
        en: 'Before listening, look at each gap and write what KIND of answer belongs there: a number, a name, a date, an amount. This primes your brain so the relevant information lights up. Listening without predicting means attending to every word equally, which is impossible.'
      },
      ex: ['Name: ______ → ism, katta harf bilan', 'Date: ______ → sana formati', 'Cost: £______ → raqam']
    },
    {
      h: { uz: 'Imlo — eng köp yöqotiladigan ball', en: 'Spelling — where marks are lost most' },
      p: {
        uz: "Harflab aytilgan ism xato yozilsa, javob notöğri hisoblanadi — hatto töğri eşitgan bölsang ham. Xavfli juftliklar: a/e/i, m/n, b/p/v, g/j. Sana va raqam formatiga ham eʼtibor ber: 15th May yoki 15 May — ikkalasi ham töğri, lekin \"15 of May\" xato.",
        en: 'A misspelled name is marked wrong even if you heard it correctly. Dangerous pairs: a/e/i, m/n, b/p/v, g/j. Watch date and number formats too: 15th May or 15 May are both fine, but "15 of May" is wrong.'
      },
      ex: ['double L = ll · "S for Sugar"', '15/05 · 15 May · 15th May ✓', '15 of May ✗']
    },
    {
      h: { uz: "Söz çegarasiga rioya qil", en: 'Respect the word limit' },
      p: {
        uz: "\"NO MORE THAN TWO WORDS\" degan körsatma — qatʼiy qoida. Uç söz yozsang, javob töğri bölsa ham nol ball. Raqam bitta söz hisoblanadi; \"a\" va \"the\" ham söz sanaladi.",
        en: '"NO MORE THAN TWO WORDS" is a hard rule. Write three and you score zero even if the content is right. A number counts as one word, and "a" and "the" count too.'
      },
      ex: ['TWO WORDS: "swimming pool" ✓ · "the swimming pool" ✗']
    }
  ],
  practice: [
    { uz: '3 ta Section 1 maşqini bajar.', en: 'Do three Section 1 exercises.' },
    { uz: "Har maşqdan oldin böşliqlarga javob turini yozib çiq.", en: 'Before each exercise, write the expected answer type in every gap.' },
    { uz: "Notöğri javoblarni transkriptdan topib, sababini yoz.", en: 'Find every wrong answer in the transcript and log the reason.' },
    { uz: "Imlo xatolari uçun daftarda alohida röyxat oç.", en: 'Open a separate spelling list in your notebook.' },
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
    uz: "Reading testida matnni töliq öqişga vaqt yöq: 60 daqiqada uçta uzun matn va 40 savol. Yeçim — matnni öqiş emas, KERAKLI JOYNI topiş. Buning uçun uçta könikma kerak.",
    en: 'There is no time to read the passages fully: three long texts and 40 questions in 60 minutes. The answer is not to read the text but to LOCATE the place. That takes three skills.'
  },
  sections: [
    {
      h: { uz: 'Skimming — 2 daqiqada manzara', en: 'Skimming — the picture in two minutes' },
      p: {
        uz: "Sarlavha, birinçi abzats, har abzatsning birinçi va oxirgi gapi, oxirgi abzats. Şu bilan matn nima haqida ekanini va qaysi fikr qayerda turganini bilib olasan. Maqsad — tuşuniş emas, XARITA tuziş.",
        en: 'Title, first paragraph, the first and last sentence of each paragraph, final paragraph. That tells you what the text is about and where each idea sits. The goal is not comprehension but building a MAP.'
      },
      ex: ['Har abzats yoniga 2–3 so\'zli belgi yoz: "sabab", "misol", "qarshi fikr"']
    },
    {
      h: { uz: 'Scanning — kalit sözni topiş', en: 'Scanning — locating the keyword' },
      p: {
        uz: "Savoldagi ÖZGARMAYDIGAN sözni tanla: ism, sana, raqam, atama. Bular matnda paraphrase qilinmaydi — şuning uçun ular xarita böladi. Keyin matnni köz bilan supurib, öşa sözni top va faqat atrofidagi 3–4 gapni öqi.",
        en: 'Pick the UNCHANGEABLE word in the question: a name, date, number or technical term. These are not paraphrased in the text, so they act as landmarks. Then sweep the page for that word and read only the three or four sentences around it.'
      },
      ex: ['Savolda "1987" bo\'lsa — matnda ham "1987"', 'Savolda "important" bo\'lsa — matnda "crucial", "vital" bo\'lishi mumkin']
    },
    {
      h: { uz: 'Paraphrase — asosiy tösiq', en: 'Paraphrase — the main obstacle' },
      p: {
        uz: "IELTS savoli matndagi sözni AYNAN takrorlamaydi. Javobni topiş demak — paraphraseʼni taniş demak. Paraphrase tört yöl bilan qilinadi: sinonim, söz şakli, aktiv↔passiv, tuzilma özgarişi. Şu törttasini bilsang, savol bilan matnni ulaş osonlaşadi.",
        en: 'An IELTS question never repeats the passage word for word. Finding the answer means recognising the paraphrase. Paraphrasing works four ways: synonyms, word-form change, active↔passive, and restructuring. Knowing all four makes matching question to text far easier.'
      },
      ex: ['Text: "The number of cars increased." → Q: "There was a rise in car ownership."', 'Text: "Many people believe…" → Q: "It is widely held that…"']
    }
  ],
  practice: [
    { uz: "Bitta matnni 2 daqiqada skim qilib, har abzatsga belgi yoz.", en: 'Skim one passage in 2 minutes and label every paragraph.' },
    { uz: "10 ta savoldan özgarmaydigan kalit sözni ajratib çiq.", en: 'Extract the unchangeable keyword from 10 questions.' },
    { uz: "Har töğri javob uçun matndagi paraphraseʼni topib yoz.", en: 'For every correct answer, find and write the paraphrase in the text.' },
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
    uz: "Task 2 umumiy Writing ballining uçdan ikki qismini beradi. Bugun ideal inşo yozişga urinmaymiz — SKELETINI örnatamiz. Tuzilma ötirsa, keyingi haftalarda ustiga luğat va grammatika qöyiladi.",
    en: 'Task 2 carries two thirds of the Writing score. Today we are not trying to write a perfect essay — we install the SKELETON. Once the structure is in place, later weeks add vocabulary and grammar on top.'
  },
  sections: [
    {
      h: { uz: "Tört abzats", en: 'Four paragraphs' },
      p: {
        uz: "Kiriş (2–3 gap): savolni paraphrase qil + pozitsiyangni ayt. Body 1 (5–6 gap): birinçi fikr. Body 2 (5–6 gap): ikkinçi fikr. Xulosa (2 gap): pozitsiyani takrorla, yangi fikr qöşma. Jami 250–280 söz. Köproq yoziş ball qöşmaydi, xato ehtimolini oşiradi.",
        en: 'Introduction (2–3 sentences): paraphrase the question and state your position. Body 1 (5–6 sentences): the first idea. Body 2 (5–6 sentences): the second. Conclusion (2 sentences): restate the position, add nothing new. Total 250–280 words. Writing more adds no marks, only errors.'
      },
      ex: ['Kirish: paraphrase + pozitsiya', 'Body: topic sentence → tushuntirish → misol → natija', 'Xulosa: pozitsiya + umumiy fikr']
    },
    {
      h: { uz: 'Abzats içidagi tört qadam', en: 'Four steps inside a paragraph' },
      p: {
        uz: "Topic sentence (asosiy fikr bitta gapda) → tuşuntiriş (nega şunday) → misol (aniq, hayotiy) → natija (bu nimaga olib keladi). Bu tört qadam har abzatsda takrorlanadi. Misol öylab topilgan bölsa ham böladi — muhimi aniq bölsin.",
        en: 'Topic sentence (the main idea in one sentence) → explanation (why) → example (specific, concrete) → result (what it leads to). These four steps repeat in every paragraph. An invented example is acceptable as long as it is specific.'
      },
      ex: ['One major benefit of remote work is improved flexibility. (topic)', 'This is because employees can organise their day around… (tushuntirish)', 'In Uzbekistan, for instance, many IT companies now… (misol)', 'As a result, staff retention has improved. (natija)']
    },
    {
      h: { uz: 'Savol matnini köçirma', en: 'Never copy the prompt' },
      p: {
        uz: "Savoldan köçirilgan sözlar söz sanoğiga KIRMAYDI va Lexical Resource ballini tuşiradi. Kiriş abzatsining birinçi gapi — savolning paraphraseʼi bölişi şart. Bu bitta gap butun inşoning birinçi taassurotini belgilaydi.",
        en: 'Words copied from the prompt do NOT count towards the word total and lower Lexical Resource. The first sentence of your introduction must be a paraphrase of the question. That single sentence sets the first impression of the whole essay.'
      },
      ex: ['Prompt: Some people think examinations are the best way to assess students.', '→ It is sometimes argued that formal testing provides the most reliable measure of student ability.']
    }
  ],
  practice: [
    { uz: "3 ta Task 2 savolini olib, faqat KIRIŞ abzatsini yoz (paraphrase + pozitsiya).", en: 'Take 3 Task 2 questions and write only the introduction (paraphrase + position).' },
    { uz: "Bitta body abzatsini tört qadam böyiça yoz.", en: 'Write one body paragraph following the four steps.' },
    { uz: "Töliq inşo yoz (40 daqiqa, 250+ söz).", en: 'Write a full essay (40 minutes, 250+ words).' },
    { uz: "Yozgandan keyin sözlarni sanab, 250 dan oşganini tekşir.", en: 'Count the words afterwards and confirm you passed 250.' },
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
    uz: "Ikkinçi hafta yakuni. Bugun kelasi zamon, söroq gap, ega–kesim mosligi va Task 2 tuzilmasi nazoratdan ötadi. Keyin töliq Listening va Reading testi.",
    en: 'End of week two. Today tests future forms, question structure, subject–verb agreement and Task 2 structure, followed by a full Listening and Reading test.'
  },
  sections: [
    {
      h: { uz: 'Haftaning xulosasi', en: 'The week in summary' },
      p: {
        uz: "Kelasi zamon — şakl niyatni bildiradi. Söroq — yordamçi egadan oldin, bilvosita savolda esa oddiy tartib. Moslik — feʼl egaga, eng yaqin sözga emas. Task 2 — tört abzats, har abzats tört qadam.",
        en: 'Future — the form signals intention. Questions — auxiliary before subject, but statement order in indirect questions. Agreement — the verb follows the subject, not the nearest word. Task 2 — four paragraphs, each with four steps.'
      },
      ex: ['when/if dan keyin kelasi zamon yo\'q', 'the number of → is · a number of → are', 'Kirish = paraphrase + pozitsiya']
    },
    {
      h: { uz: 'Ikki haftalik xatolar tahlili', en: 'Two weeks of errors' },
      p: {
        uz: "Xatolar daftaringni oçib, 14 kunlik yozuvlarni guruhla. Qaysi xato uç martadan köp takrorlangan? Şu röyxat — sening şaxsiy zaifliging, va u 10-haftadagi \"Band 7+ grammatikasi\" blokining asosi böladi.",
        en: 'Open your error log and group the entries from these 14 days. Which errors appear more than three times? That list is your personal weakness, and it becomes the basis of the Band 7+ grammar block in week 10.'
      },
      ex: ['3+ marta takrorlangan xato = shaxsiy zaiflik', 'Ro\'yxatni saqlab qo\'y — 10-haftada kerak bo\'ladi']
    }
  ],
  practice: [
    { uz: 'Quyidagi testni işla.', en: 'Take the test below.' },
    { uz: "Töliq Listening testi.", en: 'Full Listening test.' },
    { uz: "Töliq Reading testi — 60 daqiqa.", en: 'Full Reading test — 60 minutes.' },
    { uz: "Xatolar daftarini guruhlab, takrorlanuvçi 5 ta xatoni ajrat.", en: 'Group your error log and isolate the five recurring errors.' },
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
