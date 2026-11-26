/* ==========================================================================
   ENG_GRAMMAR — grammatika ma'lumotnomasi va cheatsheet'lar
   --------------------------------------------------------------------------
   Python kursida har kun kod misoli bor. Ingliz tilida shu rolni SHU fayl
   o'ynaydi: har bir grammatik mavzu bir marta, to'liq va bir joyda
   tushuntiriladi — kunlar esa unga havola qiladi.

   Nega alohida fayl: bitta mavzu (masalan Present Perfect) kursning 5–6
   kunida qaytadi. Agar tushuntirish kunlar ichida yozilsa, u 6 marta
   ko'chirilardi va bittasini tuzatganda qolgani eskirib qolardi.

   Mavzu obyekti:
     group     — tenses | structure | verbs | noun | style
     name      — mavzu nomi {uz,en}
     short     — bir qatorli ta'rif (ro'yxatda ko'rinadi)
     rule      — asosiy qoida, to'liq tushuntirish
     forms     — CHEATSHEET jadvali {head:[], rows:[[]]}
     use       — qachon ishlatiladi [{uz,en}]
     examples  — tayyor misol gaplar (inglizcha, tarjimasiz — o'qib tushunish
                 ham mashqning bir qismi)
     mistakes  — {bad, good, why:{uz,en}} — o'zbek o'quvchisiga xos xatolar
     ielts     — IELTS'ning qaysi qismida kerak
   ========================================================================== */
window.ENG_GRAMMAR = {

  /* ====================== A. ZAMONLAR ================================== */

  'present-simple': {
    group: 'tenses',
    name: { uz: 'Present Simple', en: 'Present Simple' },
    short: { uz: 'Doimiy haqiqat, odat, jadval', en: 'Permanent truth, habit, schedule' },
    rule: {
      uz: "Hozirgi oddiy zamon vaqtni emas, HOLATNI bildiradi: doim şunday, odatda şunday, jadval böyiça şunday. Şuning uçun \"hozir şu daqiqada\" maʼnosi yöq — u Present Continuous işi. Asosiy qiyinçilik bitta: uçinçi şaxs birlikda (he/şe/it) feʼlga -s qöşiladi va şu -s inkor/söroqda does ga \"köçib ötadi\".",
      en: "Present Simple describes a state rather than a moment: always true, usually true, true by timetable. It does not mean \"right now\" — that is Present Continuous. The one real difficulty: third person singular (he/she/it) adds -s, and that -s moves onto does in negatives and questions."
    },
    forms: {
      head: ['', 'I / you / we / they', 'he / she / it'],
      rows: [
        ['+', 'I work', 'she works'],
        ['−', "I don't work", "she doesn't work"],
        ['?', 'Do you work?', 'Does she work?']
      ]
    },
    use: [
      { uz: "Doimiy haqiqat: Water boils at 100°C.", en: 'Permanent truth: Water boils at 100°C.' },
      { uz: "Odat va takror: I study every evening.", en: 'Habit and repetition: I study every evening.' },
      { uz: "Jadval böyiça kelasi zamon: The exam starts at 9.", en: 'Timetabled future: The exam starts at 9.' },
      { uz: "Fikr va his feʼllari: I think, I believe, I prefer.", en: 'State verbs: I think, I believe, I prefer.' }
    ],
    examples: [
      'Technology plays a central role in modern education.',
      'Most students in my country learn English from primary school.',
      'The government provides free healthcare to all citizens.',
      'She does not agree with that approach.'
    ],
    mistakes: [
      { bad: 'He go to work by bus.', good: 'He goes to work by bus.', why: { uz: "he/şe/it — feʼlga -s.", en: 'he/she/it takes -s.' } },
      { bad: "She doesn't goes.", good: "She doesn't go.", why: { uz: "does allaqaçon -s ni olgan — feʼl asl şaklda qoladi.", en: 'does already carries the -s, so the verb stays bare.' } },
      { bad: 'I am agree with you.', good: 'I agree with you.', why: { uz: "agree — feʼl, uning oldiga am kerak emas.", en: 'agree is a verb; it needs no am.' } }
    ],
    ielts: {
      uz: "Writing Task 2 da fikr bildiriş va umumiy haqiqatni aytiş şu zamonda. Speaking Part 1 javoblarining köpi ham şunda.",
      en: 'Task 2 opinions and general truths live in this tense, as do most Speaking Part 1 answers.'
    }
  },

  'present-continuous': {
    group: 'tenses',
    name: { uz: 'Present Continuous', en: 'Present Continuous' },
    short: { uz: 'Hozir davom etayotgan, vaqtinçalik, özgarayotgan', en: 'Happening now, temporary, changing' },
    rule: {
      uz: "am/is/are + feʼl-ing. Uç xil maʼno: (1) aynan hozir bölayotgan iş, (2) vaqtinçalik holat — doimiy emas, (3) özgariş tendensiyasi. Uçinçisi IELTS uçun eng qimmatlisi: \"The population is growing rapidly\" — Task 1 da grafik tasvirlaşda kerak. State verbs (know, want, like, believe, belong) bu zamonda işlatilmaydi.",
      en: "am/is/are + verb-ing. Three meanings: (1) happening at this moment, (2) a temporary situation, not permanent, (3) a changing trend. The third is the most valuable for IELTS: \"The population is growing rapidly\" is exactly the language of Task 1. State verbs (know, want, like, believe, belong) are not used in this tense."
    },
    forms: {
      head: ['', 'I', 'he / she / it', 'you / we / they'],
      rows: [
        ['+', 'I am working', 'she is working', 'they are working'],
        ['−', "I'm not working", "she isn't working", "they aren't working"],
        ['?', 'Am I working?', 'Is she working?', 'Are they working?']
      ]
    },
    use: [
      { uz: 'Aynan hozir: I am writing an essay.', en: 'Right now: I am writing an essay.' },
      { uz: "Vaqtinçalik: Iʼm living with my cousin this year.", en: "Temporary: I'm living with my cousin this year." },
      { uz: "Özgariş: Cities are becoming more crowded.", en: 'Change: Cities are becoming more crowded.' },
      { uz: "Kelişilgan reja: Iʼm meeting my teaçer tomorrow.", en: "Arranged plan: I'm meeting my teacher tomorrow." }
    ],
    examples: [
      'The cost of living is rising in almost every major city.',
      'More and more people are working from home.',
      'I am currently preparing for the IELTS examination.',
      'Attitudes towards online education are changing quickly.'
    ],
    mistakes: [
      { bad: 'I am knowing the answer.', good: 'I know the answer.', why: { uz: "know — holat feʼli, -ing olmaydi.", en: 'know is a state verb; it takes no -ing.' } },
      { bad: 'She working now.', good: 'She is working now.', why: { uz: 'am/is/are tuşib qolmasin.', en: 'Do not drop am/is/are.' } },
      { bad: 'I am go to school every day.', good: 'I go to school every day.', why: { uz: 'Har kuni — odat, Present Simple.', en: 'Every day is habit → Present Simple.' } }
    ],
    ielts: {
      uz: "Writing Task 1 da tendensiya tasvirlaş uçun asosiy zamon. Speaking'da \"nowadays\", \"these days\" bilan birga keladi.",
      en: 'The core tense for describing trends in Task 1, and it pairs with "nowadays" / "these days" in Speaking.'
    }
  },

  'past-simple': {
    group: 'tenses',
    name: { uz: 'Past Simple', en: 'Past Simple' },
    short: { uz: "Ötgan, tugagan, vaqti aniq iş", en: 'Finished action at a known time' },
    rule: {
      uz: "Iş ötmişda boşlanib, ötmişda tugagan va QAÇON bölgani maʼlum (yoki kontekstdan tuşunarli). Töğri feʼlga -ed, notöğri feʼlning ikkinçi şakli (go → went). Inkor va söroqda did paydo böladi va feʼl ASL şaklga qaytadi — bu eng köp xato qilinadigan joy.",
      en: "The action started and finished in the past, and WHEN is known or clear from context. Regular verbs add -ed; irregular verbs use their second form (go → went). In negatives and questions did appears and the verb returns to its base form — the most common error point."
    },
    forms: {
      head: ['', "To'g'ri fe'l (work)", "Noto'g'ri fe'l (go)"],
      rows: [
        ['+', 'I worked', 'I went'],
        ['−', "I didn't work", "I didn't go"],
        ['?', 'Did you work?', 'Did you go?']
      ]
    },
    use: [
      { uz: 'Aniq vaqt bilan: I finişed sçool in 2023.', en: 'With a definite time: I finished school in 2023.' },
      { uz: "Ötmişdagi ketma-ket işlar: I woke up, had breakfast and left.", en: 'A sequence of past events: I woke up, had breakfast and left.' },
      { uz: 'Tugagan davr: I lived there for five years (endi yaşamayman).', en: 'A finished period: I lived there for five years (not any more).' }
    ],
    examples: [
      'The figure rose sharply between 2010 and 2015.',
      'I first became interested in programming when I was fifteen.',
      'The government introduced the policy in 2019.',
      'We did not expect such a dramatic change.'
    ],
    mistakes: [
      { bad: 'I didn\'t went there.', good: "I didn't go there.", why: { uz: "did ötgan zamonni körsatdi — feʼl asl şaklda.", en: 'did already marks the past; the verb stays base.' } },
      { bad: 'When you did arrive?', good: 'When did you arrive?', why: { uz: "Söroqda did egadan OLDIN keladi.", en: 'In questions did comes before the subject.' } },
      { bad: 'I have finished school in 2023.', good: 'I finished school in 2023.', why: { uz: 'Aniq vaqt bor — Present Perfect emas.', en: 'A definite past time blocks Present Perfect.' } }
    ],
    ielts: {
      uz: "Writing Task 1 da ötgan yillar maʼlumoti şu zamonda. Speaking Part 2 hikoyasining asosiy zamoni.",
      en: 'Past data in Task 1 uses it, and it is the backbone tense of a Speaking Part 2 story.'
    }
  },

  'past-continuous': {
    group: 'tenses',
    name: { uz: 'Past Continuous', en: 'Past Continuous' },
    short: { uz: "Ötmişning bir nuqtasida davom etayotgan iş", en: 'In progress at a point in the past' },
    rule: {
      uz: "was/were + feʼl-ing. Köpinça yolğiz kelmaydi: u FON yaratadi, Past Simple esa şu fonda sodir bölgan hodisani beradi. \"I was studying when the phone rang\" — uzun iş davom etardi, qisqasi uni böldi. Hikoyani boşlaşda ham manzara çiziş uçun qulay.",
      en: "was/were + verb-ing. It rarely stands alone: it sets the BACKGROUND while Past Simple supplies the event inside it. \"I was studying when the phone rang\" — the long action was running, the short one interrupted it. It is also useful for painting the scene at the start of a story."
    },
    forms: {
      head: ['', 'I / he / she / it', 'you / we / they'],
      rows: [
        ['+', 'I was working', 'they were working'],
        ['−', "I wasn't working", "they weren't working"],
        ['?', 'Was I working?', 'Were they working?']
      ]
    },
    use: [
      { uz: 'Uzilgan iş: I was reading when şe called.', en: 'Interrupted action: I was reading when she called.' },
      { uz: "Bir vaqtdagi ikki iş: While I was cooking, he was studying.", en: 'Two parallel actions: While I was cooking, he was studying.' },
      { uz: 'Hikoya foni: It was raining and the streets were empty.', en: 'Story background: It was raining and the streets were empty.' }
    ],
    examples: [
      'I was preparing for my exams when I first heard about this opportunity.',
      'While the economy was growing, unemployment continued to fall.',
      'They were living in Tashkent at the time.'
    ],
    mistakes: [
      { bad: 'I was knowing him.', good: 'I knew him.', why: { uz: "Holat feʼllari -ing olmaydi.", en: 'State verbs take no -ing.' } },
      { bad: 'When I was arriving, she left.', good: 'When I arrived, she left.', why: { uz: 'Qisqa, tugagan iş — Past Simple.', en: 'A short completed action needs Past Simple.' } }
    ],
    ielts: {
      uz: "Speaking Part 2 da voqea foni uçun. Bu zamonni töğri işlatiş grammatik xilma-xillikni körsatadi.",
      en: 'Used for scene-setting in Speaking Part 2; handling it well shows grammatical range.'
    }
  },

  'present-perfect': {
    group: 'tenses',
    name: { uz: 'Present Perfect', en: 'Present Perfect' },
    short: { uz: "Ötmiş HOZIRGA boğlangan", en: 'Past connected to now' },
    rule: {
      uz: "have/has + III şakl. Bu \"ötgan zamon\"ning boşqa turi emas — bu HOZIRGI zamon: ötmişdagi iş hozirgi holatga taʼsir qilgani uçun aytilyapti. Şuning uçun aniq ötgan vaqt (yesterday, in 2020, last year) bilan KELMAYDI. Özbek tilida bu farq yöq, şuning uçun eng köp xato şu yerda.",
      en: "have/has + past participle. This is not another past tense — it is a PRESENT tense: the past action is mentioned because it matters now. That is why it never combines with a finished time expression (yesterday, in 2020, last year). Uzbek does not draw this line, which is why it is the biggest error source."
    },
    forms: {
      head: ['', 'I / you / we / they', 'he / she / it'],
      rows: [
        ['+', 'I have finished', 'she has finished'],
        ['−', "I haven't finished", "she hasn't finished"],
        ['?', 'Have you finished?', 'Has she finished?']
      ]
    },
    use: [
      { uz: "Natijasi hozir körinadi: I have lost my key (hozir kalitsizman).", en: 'Result visible now: I have lost my key (I have no key now).' },
      { uz: "Hali davom etayotgan davr: I have lived here for ten years.", en: 'Period still going: I have lived here for ten years.' },
      { uz: "Hayotiy tajriba, vaqti muhim emas: I have been to Dubai.", en: 'Life experience, time irrelevant: I have been to Dubai.' },
      { uz: "just / already / yet / ever / never / since / for bilan.", en: 'With just / already / yet / ever / never / since / for.' }
    ],
    examples: [
      'Online learning has become far more common over the last decade.',
      'I have been studying English since I was twelve.',
      'Governments have introduced a number of measures to address this issue.',
      'She has never taken an international exam before.'
    ],
    mistakes: [
      { bad: 'I have seen him yesterday.', good: 'I saw him yesterday.', why: { uz: 'yesterday — tugagan vaqt, Present Perfect bilan yurmaydi.', en: 'yesterday is finished time; it blocks Present Perfect.' } },
      { bad: 'I am here since 2020.', good: 'I have been here since 2020.', why: { uz: 'since bilan Present Perfect kerak.', en: 'since requires Present Perfect.' } },
      { bad: 'She has went home.', good: 'She has gone home.', why: { uz: 'have/has bilan III şakl (gone), II şakl (went) emas.', en: 'have/has takes the third form (gone), not the second (went).' } }
    ],
    ielts: {
      uz: "Task 2 da \"sönggi ön yilda özgargan\" degan fikrni aytişning eng tabiiy yöli. Speaking'da tajriba haqida gapirganda kerak.",
      en: 'The natural way to say "has changed over the last decade" in Task 2, and essential when describing experience in Speaking.'
    }
  },

  'present-perfect-continuous': {
    group: 'tenses',
    name: { uz: 'Present Perfect Continuous', en: 'Present Perfect Continuous' },
    short: { uz: 'Davom etib kelayotgan, davomiyligi muhim', en: 'Ongoing, with the duration emphasised' },
    rule: {
      uz: "have/has been + feʼl-ing. Present Perfect natijaga, bu esa JARAYONGA va uning uzunligiga urğu beradi. \"I have written three essays\" — natija muhim. \"I have been writing all evening\" — qança vaqt sarflangani muhim. Köp hollarda ikkalasi ham töğri, farq — urğuda.",
      en: "have/has been + verb-ing. Present Perfect stresses the result; this one stresses the PROCESS and how long it has run. \"I have written three essays\" foregrounds the result. \"I have been writing all evening\" foregrounds the time spent. Often both are correct — the difference is emphasis."
    },
    forms: {
      head: ['', 'I / you / we / they', 'he / she / it'],
      rows: [
        ['+', 'I have been working', 'she has been working'],
        ['−', "I haven't been working", "she hasn't been working"],
        ['?', 'Have you been working?', 'Has she been working?']
      ]
    },
    use: [
      { uz: "Hozirgaça davom etayotgan jarayon: I have been preparing for six months.", en: 'Process running up to now: I have been preparing for six months.' },
      { uz: "Yaqinda tugagan, izi qolgan: You look tired — have you been studying?", en: 'Just finished, traces visible: You look tired — have you been studying?' }
    ],
    examples: [
      'Researchers have been investigating this problem for over twenty years.',
      'I have been working on my writing skills since the beginning of the course.',
      'The number of applicants has been rising steadily.'
    ],
    mistakes: [
      { bad: 'I have been knowing her for years.', good: 'I have known her for years.', why: { uz: "Holat feʼli — Continuous şakli yöq.", en: 'A state verb has no continuous form.' } },
      { bad: 'I have been finished.', good: 'I have finished.', why: { uz: "been + III şakl emas, been + -ing.", en: 'It is been + -ing, not been + past participle.' } }
    ],
    ielts: {
      uz: "Speaking Part 1/3 da \"qança vaqtdan beri\" savollariga eng tabiiy javob şakli.",
      en: 'The most natural answer shape for "how long have you…" questions in Speaking Parts 1 and 3.'
    }
  },

  'past-perfect': {
    group: 'tenses',
    name: { uz: 'Past Perfect', en: 'Past Perfect' },
    short: { uz: "Ötmişdan ham oldingi ötmiş", en: 'The past before the past' },
    rule: {
      uz: "had + III şakl. Faqat bitta vazifasi bor: ötmişda ikkita iş bölsa va TARTIBNI aniqlaş kerak bölsa, avval bölganini had bilan belgilaymiz. Agar tartib before/after bilan allaqaçon aniq bölsa, u şart emas. Köp işlatiş şart emas — bir inşoda bir-ikki marta yetadi.",
      en: "had + past participle. It has exactly one job: when two past events need their ORDER made clear, the earlier one takes had. If before/after already makes the order obvious, it is optional. It does not need to appear often — once or twice in an essay is plenty."
    },
    forms: {
      head: ['', 'Hamma shaxs uchun bir xil'],
      rows: [
        ['+', 'I had finished'],
        ['−', "I hadn't finished"],
        ['?', 'Had you finished?']
      ]
    },
    use: [
      { uz: 'Oldinroq bölgan iş: The train had left before I arrived.', en: 'The earlier event: The train had left before I arrived.' },
      { uz: "Sabab tuşuntiriş: I was tired because I hadnʼt slept.", en: "Explaining a cause: I was tired because I hadn't slept." },
      { uz: '3-şart gapda: If I had studied, I would have passed.', en: 'In the third conditional: If I had studied, I would have passed.' }
    ],
    examples: [
      'By the time the policy was introduced, the situation had already worsened.',
      'I had never spoken to a native speaker before I joined the course.',
      'She realised that she had made a serious mistake.'
    ],
    mistakes: [
      { bad: 'I had went home.', good: 'I had gone home.', why: { uz: 'had bilan III şakl.', en: 'had takes the third form.' } },
      { bad: 'Yesterday I had eaten lunch at 1.', good: 'Yesterday I ate lunch at 1.', why: { uz: "Ikkinçi ötgan iş yöq — Past Simple yetadi.", en: 'There is no second past event, so Past Simple is enough.' } }
    ],
    ielts: {
      uz: "Speaking Part 2 hikoyasida tartibni aniq körsatiş uçun. Grammatik xilma-xillikka qöşiladi.",
      en: 'Clarifies sequence in a Speaking Part 2 narrative and adds to your grammatical range.'
    }
  },

  'future-forms': {
    group: 'tenses',
    name: { uz: 'Kelasi zamon şakllari', en: 'Future forms' },
    short: { uz: "will, be going to, Present Continuous — uçtasi uç xil", en: 'will, be going to, Present Continuous — three different meanings' },
    rule: {
      uz: "Ingliz tilida yagona \"kelasi zamon\" yöq; qaysi şaklni tanlaş NIYAT haqida maʼlumot beradi. will — şu daqiqada qaror qilingan yoki taxmin. be going to — oldindan qaror qilingan reja yoki hozirgi dalilga asoslangan başorat. Present Continuous — kelişib qöyilgan uçraşuv. IELTS'da başorat qilişda will va be likely to eng köp kerak.",
      en: "English has no single future tense; the form you choose signals INTENTION. will — decided at the moment of speaking, or a prediction. be going to — a plan already made, or a prediction based on present evidence. Present Continuous — a fixed arrangement. For IELTS predictions, will and be likely to carry most of the load."
    },
    forms: {
      head: ['Shakl', "Ma'no", 'Misol'],
      rows: [
        ['will + fe\'l', 'taxmin / shu payt qaror', 'It will probably rain.'],
        ['be going to + fe\'l', 'reja / dalilga asoslangan', "I'm going to take IELTS in February."],
        ['Present Continuous', 'kelishilgan uchrashuv', "I'm meeting my tutor at 5."],
        ['Present Simple', 'jadval', 'The exam starts at 9.'],
        ['be likely to + fe\'l', 'ehtimol (akademik)', 'Costs are likely to increase.']
      ]
    },
    use: [
      { uz: 'Başorat: Cities will continue to grow.', en: 'Prediction: Cities will continue to grow.' },
      { uz: "Reja: Iʼm going to apply next year.", en: "Plan: I'm going to apply next year." },
      { uz: "Vaʼda / taklif: Iʼll help you.", en: "Promise / offer: I'll help you." }
    ],
    examples: [
      'Automation is likely to replace many routine jobs within a decade.',
      'I am going to sit the exam on the twentieth of February.',
      'If this trend continues, the problem will become far more serious.'
    ],
    mistakes: [
      { bad: 'I will to go.', good: 'I will go.', why: { uz: 'will dan keyin to yöq.', en: 'No to after will.' } },
      { bad: 'When I will finish, I will call you.', good: 'When I finish, I will call you.', why: { uz: 'when/if dan keyin kelasi zamon işlatilmaydi.', en: 'No future tense after when/if.' } },
      { bad: 'I will meet my teacher tomorrow at 5 (kelishilgan).', good: "I'm meeting my teacher tomorrow at 5.", why: { uz: 'Kelişilgan uçraşuv — Present Continuous.', en: 'A fixed arrangement takes Present Continuous.' } }
    ],
    ielts: {
      uz: "Task 2 ning xulosa qismida (\"bu tendensiya davom etadi\") va Speaking Part 3 dagi taxmin savollarida.",
      en: 'Used in Task 2 conclusions ("this trend will continue") and in Speaking Part 3 speculation questions.'
    }
  },

  'tense-contrast': {
    group: 'tenses',
    name: { uz: 'Zamonlarni farqlaş', en: 'Choosing between tenses' },
    short: { uz: "Qaysi zamon — qanday savol berib tanlanadi", en: 'Which tense — decided by asking the right question' },
    rule: {
      uz: "Zamon tanlaşda qoidalarni eslaşga urinma — uçta savol ber. (1) Iş tugaganmi? (2) Tugagan bölsa, QAÇON tugagani aytilganmi? (3) Hozirga boğliqmi? Aniq vaqt aytilgan bölsa — Past Simple. Vaqt aytilmagan va natija hozir muhim bölsa — Present Perfect. Hozir davom etayotgan yoki özgarayotgan bölsa — Present Continuous.",
      en: "Do not try to recall rules when choosing a tense — ask three questions. (1) Is the action finished? (2) If so, is the time stated? (3) Does it matter now? A stated finished time → Past Simple. No stated time and the result matters now → Present Perfect. Happening or changing now → Present Continuous."
    },
    forms: {
      head: ['Savol', 'Zamon', 'Misol'],
      rows: [
        ['Doim shundaymi?', 'Present Simple', 'Water boils at 100°C.'],
        ['Hozir bo\'layaptimi?', 'Present Continuous', 'Prices are rising.'],
        ['Tugagan, vaqti aniqmi?', 'Past Simple', 'I graduated in 2024.'],
        ['Tugagan, natijasi hozirmi?', 'Present Perfect', 'I have graduated.'],
        ['O\'tmishning fonimi?', 'Past Continuous', 'I was studying when…'],
        ['O\'tmishdan oldinmi?', 'Past Perfect', 'I had studied before…']
      ]
    },
    use: [
      { uz: "Yozişdan oldin: har gapda \"vaqt aytilganmi?\" deb tekşir.", en: 'Before writing: check every sentence for a stated time.' },
      { uz: "Tekşirişda: since/for → Perfect, ago/last/in 2020 → Past Simple.", en: 'When checking: since/for → Perfect; ago/last/in 2020 → Past Simple.' }
    ],
    examples: [
      'I studied at that school for three years. (tugagan)',
      'I have studied there for three years. (hali o\'qiyman)',
      'The figure rose in 2015. (aniq yil)',
      'The figure has risen since 2015. (hozirgacha)'
    ],
    mistakes: [
      { bad: 'I am living here since 2020.', good: 'I have been living here since 2020.', why: { uz: 'since → Perfect oilasi.', en: 'since → the perfect family.' } },
      { bad: 'I have visited London last summer.', good: 'I visited London last summer.', why: { uz: 'last summer — aniq tugagan vaqt.', en: 'last summer is a stated finished time.' } }
    ],
    ielts: {
      uz: "Grammatical Range & Accuracy mezonining yarmi — zamon tanlovi. Bu jadvalni yoziş oldidan bir körib çiqiş odat qilinsin.",
      en: 'Half of the Grammatical Range & Accuracy criterion is tense choice; glance at this table before you write.'
    }
  },

  /* ====================== B. GAP QURILISHI ============================== */

  'questions': {
    group: 'structure',
    name: { uz: "Söroq gap qurilişi", en: 'Question formation' },
    short: { uz: 'Yordamçi feʼl egadan oldinga çiqadi', en: 'The auxiliary moves in front of the subject' },
    rule: {
      uz: "Ingliz söroq gapida yordamçi feʼl (do/does/did, am/is/are, have/has, will, can…) egadan OLDIN keladi. Agar jumlada yordamçi bölmasa, do/does/did qöşiladi va asosiy feʼl asl şaklga qaytadi. Söroq sözi (what, where, why…) eng oldinga qöyiladi. Faqat bitta holat boşqaça: söroq sözining özi ega bölsa — tartib özgarmaydi (Who called you?).",
      en: "In an English question the auxiliary (do/does/did, am/is/are, have/has, will, can…) comes BEFORE the subject. If there is no auxiliary, do/does/did is inserted and the main verb returns to base form. The question word (what, where, why…) goes first. One exception: when the question word is itself the subject, the order does not change (Who called you?)."
    },
    forms: {
      head: ['Tur', 'Qolip', 'Misol'],
      rows: [
        ['Ha/yo\'q', 'Aux + ega + fe\'l', 'Do you agree?'],
        ['So\'roq so\'zli', 'Wh + aux + ega + fe\'l', 'Why do you think so?'],
        ['Ega so\'roq so\'zi', 'Wh + fe\'l', 'Who wrote this?'],
        ['Bilvosita', 'Wh + ega + fe\'l', 'I wonder why you think so.']
      ]
    },
    use: [
      { uz: "Speaking'da savolni tuşuniş — javob berişning yarmi.", en: 'Understanding the question is half the answer in Speaking.' },
      { uz: 'Bilvosita savol muloyimroq: Could you tell me where it is?', en: 'Indirect questions are politer: Could you tell me where it is?' }
    ],
    examples: [
      'What kind of music do you usually listen to?',
      'How long have you been learning English?',
      'Who influenced your decision the most?',
      'Could you explain what the main advantage is?'
    ],
    mistakes: [
      { bad: 'Why you are late?', good: 'Why are you late?', why: { uz: 'are egadan oldinga çiqadi.', en: 'are must come before the subject.' } },
      { bad: 'What means this word?', good: 'What does this word mean?', why: { uz: 'does kerak, feʼl asl şaklda.', en: 'does is needed and the verb stays base.' } },
      { bad: 'Can you tell me where is the office?', good: 'Can you tell me where the office is?', why: { uz: 'Bilvosita savolda tartib oddiy gapdek.', en: 'Indirect questions keep statement order.' } }
    ],
    ielts: {
      uz: "Speaking'ning uçala qismida ham savolni notöğri tuşuniş — ballni yöqotişning eng tez yöli.",
      en: 'Misreading the question is the fastest way to lose marks in all three Speaking parts.'
    }
  },

  'subject-verb-agreement': {
    group: 'structure',
    name: { uz: 'Ega va kesim mosligi', en: 'Subject–verb agreement' },
    short: { uz: "Feʼl egaga moslaşadi — eng yaqin sözga emas", en: 'The verb agrees with the subject, not the nearest word' },
    rule: {
      uz: "Feʼl EGAGA moslaşadi. Xato köpinça ega bilan feʼl orasiga uzun bölak tuşganda böladi: \"The number of students who study abroad IS rising\" — ega \"the number\", \"students\" emas. Yodda tut: the number of → birlik, a number of → köplik. information, advice, researç, knowledge — sanalmaydi, doim birlik. people — köplik.",
      en: "The verb agrees with the SUBJECT. Errors happen when a long phrase sits between them: \"The number of students who study abroad IS rising\" — the subject is \"the number\", not \"students\". Remember: the number of → singular, a number of → plural. information, advice, research, knowledge are uncountable and always singular. people is plural."
    },
    forms: {
      head: ['Ega', "Fe'l", 'Misol'],
      rows: [
        ['the number of …', 'birlik', 'The number of cars is rising.'],
        ['a number of …', 'ko\'plik', 'A number of cars are parked here.'],
        ['information / advice / research', 'birlik', 'This information is useful.'],
        ['people', 'ko\'plik', 'People are becoming healthier.'],
        ['each / every / one of …', 'birlik', 'Each of the students has a laptop.'],
        ['both / several / many', 'ko\'plik', 'Many of them were absent.']
      ]
    },
    use: [
      { uz: "Inşo tekşirayotganda har gapning egasini barmoq bilan körsatib çiq.", en: 'When proofreading, physically point to the subject of every sentence.' }
    ],
    examples: [
      'The impact of social media on young people is widely debated.',
      'A number of studies suggest that the effect is limited.',
      'Research into this area has increased significantly.'
    ],
    mistakes: [
      { bad: 'People is friendly.', good: 'People are friendly.', why: { uz: 'people — köplik.', en: 'people is plural.' } },
      { bad: 'The informations are useful.', good: 'The information is useful.', why: { uz: 'information sanalmaydi — -s olmaydi.', en: 'information is uncountable; no -s.' } },
      { bad: 'The list of items are long.', good: 'The list of items is long.', why: { uz: 'Ega — list.', en: 'The subject is list.' } }
    ],
    ielts: {
      uz: "Bu xato Band 7 dan yuqoriga çiqişga tösqinlik qiladigan eng köp uçraydigan xato. Xatolar daftaringda alohida bölim oçilsin.",
      en: 'This is the single most common error blocking a move above Band 7; give it its own section in your error log.'
    }
  },

  'complex-sentences': {
    group: 'structure',
    name: { uz: "Qöşma gap", en: 'Complex sentences' },
    short: { uz: 'Boş gap + ergaş gap', en: 'Main clause + subordinate clause' },
    rule: {
      uz: "Har gapda kamida bitta EGA + KESIM bor. Ikki mustaqil gapni and/but/so bilan qöşsang — compound. Bittasini ikkinçisiga böysundirsang (because, although, when, whiç…) — complex. IELTS Band 7+ uçun ikkalasi ham kerak, lekin ASOSIYSI aniqlik: xato bilan yozilgan uzun gap, töğri yozilgan qisqa gapdan past baholanadi.",
      en: "Every sentence has at least one SUBJECT + VERB. Join two independent clauses with and/but/so and you get a compound sentence; subordinate one to the other (because, although, when, which…) and you get a complex one. Band 7+ needs both, but accuracy comes first: a long sentence with errors scores below a short correct one."
    },
    forms: {
      head: ['Tur', 'Qolip', 'Misol'],
      rows: [
        ['Simple', 'S + V', 'Technology has changed education.'],
        ['Compound', 'S+V , and/but/so S+V', 'It saves time, but it can distract students.'],
        ['Complex', 'Although S+V, S+V', 'Although it saves time, it can distract students.'],
        ['Complex', 'S+V because S+V', 'It works because students stay engaged.']
      ]
    },
    use: [
      { uz: "Qarama-qarşilik: although, while, whereas, even though.", en: 'Contrast: although, while, whereas, even though.' },
      { uz: 'Sabab: because, since, as.', en: 'Reason: because, since, as.' },
      { uz: 'Natija: so, therefore, as a result, consequently.', en: 'Result: so, therefore, as a result, consequently.' },
      { uz: 'Şart: if, unless, provided that.', en: 'Condition: if, unless, provided that.' }
    ],
    examples: [
      'Although online courses are convenient, they cannot fully replace classroom interaction.',
      'Because the population is ageing, healthcare costs are rising sharply.',
      'While some argue that examinations are essential, others believe continuous assessment is fairer.'
    ],
    mistakes: [
      { bad: 'Although it is expensive, but it is worth it.', good: 'Although it is expensive, it is worth it.', why: { uz: 'although va but birga kelmaydi — bittasi yetadi.', en: 'although and but cannot both appear; one is enough.' } },
      { bad: 'Because of he was late.', good: 'Because he was late.', why: { uz: 'because of dan keyin ot, because dan keyin gap.', en: 'because of takes a noun; because takes a clause.' } },
      { bad: 'I like English. Because it is useful.', good: 'I like English because it is useful.', why: { uz: 'Ergaş gap yolğiz gap böla olmaydi.', en: 'A subordinate clause cannot stand alone.' } }
    ],
    ielts: {
      uz: "Coherence & Cohesion va Grammatical Range mezonlarining ikkalasiga ham taʼsir qiladi.",
      en: 'Affects both Coherence & Cohesion and Grammatical Range.'
    }
  },

  'noun-clauses': {
    group: 'structure',
    name: { uz: 'Noun clause', en: 'Noun clauses' },
    short: { uz: "Ot vazifasini bajaruvçi gap bölagi", en: 'A clause doing the job of a noun' },
    rule: {
      uz: "Butun bir gap ot örnida turişi mumkin: ega, töldiruvçi yoki predlogdan keyin. Odatda that, whether, if yoki söroq sözi bilan boşlanadi. Muhim: içida SÖROQ TARTIBI işlatilmaydi — oddiy gap tartibi qoladi. \"What the government şould do is invest in education\" — bu qurilma inşoga jiddiy ohang beradi.",
      en: "A whole clause can stand where a noun would: as subject, as object, or after a preposition. It usually starts with that, whether, if, or a question word. Crucially, it does NOT use question word order — statement order stays. \"What the government should do is invest in education\" gives an essay a serious register."
    },
    forms: {
      head: ['Vazifa', 'Misol'],
      rows: [
        ['Ega', 'What matters most is consistency.'],
        ['To\'ldiruvchi', 'I believe that education should be free.'],
        ['Predlogdan keyin', 'It depends on how much time you have.'],
        ['Ta\'rifdan keyin', 'The fact that costs are rising worries many families.']
      ]
    },
    use: [
      { uz: "Fikrni yumşatiş: It seems that…, It is clear that…", en: 'Softening a claim: It seems that…, It is clear that…' },
      { uz: "Urğu beriş: What is needed is…", en: 'Adding emphasis: What is needed is…' }
    ],
    examples: [
      'What many people fail to realise is that the problem is largely economic.',
      'Whether this policy succeeds depends on how it is implemented.',
      'The fact that so many graduates remain unemployed suggests a deeper issue.'
    ],
    mistakes: [
      { bad: 'I don\'t know what is the answer.', good: "I don't know what the answer is.", why: { uz: 'Noun clause içida söroq tartibi yöq.', en: 'No question order inside a noun clause.' } },
      { bad: 'I think that is important education.', good: 'I think that education is important.', why: { uz: 'that dan keyin töliq gap: ega + kesim.', en: 'A full clause follows that: subject + verb.' } }
    ],
    ielts: {
      uz: "Writing Task 2 da fikrni kiritişning eng işonçli usuli. Speaking Part 3 da ham juda tabiiy eşitiladi.",
      en: 'The most reliable way to introduce an idea in Task 2, and it sounds natural in Speaking Part 3 too.'
    }
  },

  'adjective-clauses': {
    group: 'structure',
    name: { uz: 'Relative (adjective) clause', en: 'Relative (adjective) clauses' },
    short: { uz: 'Otni izohlovçi gap: who, whiç, that, where', en: 'A clause describing a noun: who, which, that, where' },
    rule: {
      uz: "Otdan keyin kelib uni izohlaydi. who — odam, whiç — narsa, that — ikkalasi ham (faqat defininğda), where — joy, whose — egalik. Ikki tur bor: DEFINING (qaysi ekanini aniqlaydi, vergul YÖQ) va NON-DEFINING (qöşimça maʼlumot, vergul BOR va that işlatilmaydi). Vergul maʼnoni özgartiradi, şuning uçun u bezak emas.",
      en: "It follows a noun and describes it. who — people, which — things, that — both (defining only), where — place, whose — possession. Two types: DEFINING (identifies which one, NO commas) and NON-DEFINING (extra information, WITH commas, and that is not allowed). The comma changes the meaning, so it is not decoration."
    },
    forms: {
      head: ['Tur', 'Vergul', 'Misol'],
      rows: [
        ['Defining', 'yo\'q', 'Students who work hard usually succeed.'],
        ['Non-defining', 'bor', 'My teacher, who is from Bristol, is very strict.'],
        ['Narsa', '—', 'The policy which was introduced in 2019…'],
        ['Joy', '—', 'The city where I grew up has changed.'],
        ['Egalik', '—', 'Families whose income is low need support.']
      ]
    },
    use: [
      { uz: "Ikki qisqa gapni bitta silliq gapga birlaştiriş uçun.", en: 'To merge two short sentences into one smooth one.' },
      { uz: "Taʼrif beriş: A person who…, A system whiç…", en: 'To define: A person who…, A system which…' }
    ],
    examples: [
      'Countries which invest heavily in education tend to have stronger economies.',
      'The report, which was published last year, highlights several concerns.',
      'People whose jobs are repetitive are most at risk from automation.'
    ],
    mistakes: [
      { bad: 'The book what I read…', good: 'The book that I read…', why: { uz: 'what bu yerda işlatilmaydi.', en: 'what cannot be used here.' } },
      { bad: 'The man which helped me…', good: 'The man who helped me…', why: { uz: 'Odam uçun who.', en: 'Use who for people.' } },
      { bad: 'My mother, that is a doctor, …', good: 'My mother, who is a doctor, …', why: { uz: 'Vergulli (non-defining) turda that yöq.', en: 'that is not allowed in non-defining clauses.' } },
      { bad: 'The city where I live in…', good: 'The city where I live…', why: { uz: 'where allaqaçon "in" maʼnosini beradi.', en: 'where already contains "in".' } }
    ],
    ielts: {
      uz: "Grammatik xilma-xillikni körsatişning eng oson va xavfsiz yöli — deyarli har inşoda 2–3 marta işlatiş mumkin.",
      en: 'The easiest safe way to show range — two or three per essay is realistic.'
    }
  },

  'adverb-clauses': {
    group: 'structure',
    name: { uz: 'Adverb clause', en: 'Adverb clauses' },
    short: { uz: 'Vaqt, sabab, şart, qarama-qarşilik', en: 'Time, reason, condition, contrast' },
    rule: {
      uz: "Boş gapga vaqt, sabab, şart yoki qarama-qarşilik maʼnosini qöşadigan ergaş gap. Boğlovçi bilan boşlanadi. Muhim tiniş qoidasi: ergaş gap OLDIN kelsa, undan keyin vergul qöyiladi; keyin kelsa — vergul kerak emas. Bu qoida Band 7+ da tez-tez tekşiriladi.",
      en: "A subordinate clause adding time, reason, condition or contrast to the main clause. It begins with a subordinator. Key punctuation rule: if the clause comes FIRST, put a comma after it; if it comes second, no comma. This is checked often at Band 7+."
    },
    forms: {
      head: ["Ma'no", "Bog'lovchi", 'Misol'],
      rows: [
        ['Vaqt', 'when, while, before, after, as soon as, until', 'When I finish, I will call you.'],
        ['Sabab', 'because, since, as', 'Since demand is rising, prices will follow.'],
        ['Shart', 'if, unless, provided that', 'Unless action is taken, the problem will worsen.'],
        ['Qarama-qarshilik', 'although, though, even though, whereas, while', 'Although it is costly, it is necessary.'],
        ['Maqsad', 'so that, in order that', 'They lowered fees so that more students could enrol.']
      ]
    },
    use: [
      { uz: "Inşoda abzats boşida qarama-qarşilik körsatiş uçun juda qulay.", en: 'Very useful at the start of a body paragraph to signal contrast.' }
    ],
    examples: [
      'Although the benefits are considerable, the risks should not be ignored.',
      'Unless governments intervene, inequality will continue to grow.',
      'While urban areas have improved, rural regions remain underdeveloped.'
    ],
    mistakes: [
      { bad: 'Although it is expensive. It is worth it.', good: 'Although it is expensive, it is worth it.', why: { uz: 'Ergaş gap yolğiz turolmaydi.', en: 'A subordinate clause cannot stand alone.' } },
      { bad: 'If it will rain, we will stay.', good: 'If it rains, we will stay.', why: { uz: 'if dan keyin kelasi zamon yöq.', en: 'No future tense after if.' } }
    ],
    ielts: {
      uz: "Writing'da har abzatsda kamida bittasi bölsa, gap tuzilişi xilma-xilligi körinadi.",
      en: 'One per paragraph in Writing is enough to demonstrate sentence variety.'
    }
  },

  'participle-clauses': {
    group: 'structure',
    name: { uz: 'Participle clause', en: 'Participle clauses' },
    short: { uz: "Qisqartirilgan ergaş gap: -ing / -ed", en: 'A shortened clause: -ing / -ed' },
    rule: {
      uz: "Ergaş gapdagi ega va yordamçi feʼl tuşiriladi, feʼl -ing (aktiv) yoki III şakl (passiv) bölib qoladi. \"Because it was written quickly, the essay had errors\" → \"Written quickly, the essay had errors\". Bitta qattiq şart bor: qisqartirilgan qismning EGASI boş gapning egasi bilan bir xil bölişi kerak. Aks holda \"dangling participle\" xatosi çiqadi.",
      en: "The subject and auxiliary of the subordinate clause are dropped, leaving -ing (active) or a past participle (passive). \"Because it was written quickly, the essay had errors\" → \"Written quickly, the essay had errors\". One hard condition: the implied subject must be the same as the main clause subject, otherwise you produce a dangling participle."
    },
    forms: {
      head: ['Manba', 'Qisqargani'],
      rows: [
        ['Because he felt tired, he stopped.', 'Feeling tired, he stopped.'],
        ['After he had finished, he left.', 'Having finished, he left.'],
        ['Which was built in 1990, it is old.', 'Built in 1990, it is old.'],
        ['While she was walking home, she saw…', 'Walking home, she saw…']
      ]
    },
    use: [
      { uz: "Gapni ixçamlaştiriş va ohangni akademik qiliş uçun.", en: 'To make a sentence compact and academic in tone.' },
      { uz: "Task 1 da: \"Having peaked in 2010, the figure then fell.\"", en: 'In Task 1: "Having peaked in 2010, the figure then fell."' }
    ],
    examples: [
      'Faced with rising costs, many families reduced their spending.',
      'Having analysed the data, the researchers reached a clear conclusion.',
      'Introduced in 2019, the policy has already had a measurable effect.'
    ],
    mistakes: [
      { bad: 'Walking home, the rain started.', good: 'Walking home, I got caught in the rain.', why: { uz: "Yomğir uyga ketmaydi — ega mos emas (dangling).", en: 'The rain was not walking home — the subject does not match.' } },
      { bad: 'Being tired, the work was postponed.', good: 'Being tired, I postponed the work.', why: { uz: 'Çarçagan — iş emas, odam.', en: 'The work was not tired; the person was.' } }
    ],
    ielts: {
      uz: "Band 7.5+ uçun kuçli qurilma — lekin xato qilinsa darhol közga taşlanadi. Avval işonç hosil qil, keyin işlat.",
      en: 'A strong Band 7.5+ structure, but errors are instantly visible. Be confident before you use it.'
    }
  },

  'conjunctions-punctuation': {
    group: 'structure',
    name: { uz: "Boğlovçi va tiniş belgilari", en: 'Conjunctions & punctuation' },
    short: { uz: 'Vergul, nuqtali vergul, boğlovçi turlari', en: 'Comma, semicolon, and types of connector' },
    rule: {
      uz: "Uç xil boğlovçi va uç xil tiniş qoidasi bor. and/but/so — teng boğlovçi, oldiga vergul. although/because/when — ergaştiruvçi, gap boşida bölsa oxiriga vergul. however/therefore/moreover — kiriş söz, ular gap BOĞLAMAYDI: oldidan nuqta yoki nuqtali vergul, keyin vergul. Eng köp uçraydigan xato — however ni and örnida işlatiş.",
      en: "There are three connector types and three punctuation rules. and/but/so are coordinators — comma before. although/because/when are subordinators — comma after the clause if it comes first. however/therefore/moreover are linking adverbs and do NOT join clauses: full stop or semicolon before, comma after. The most common error is using however like and."
    },
    forms: {
      head: ['Tur', 'Tinish', 'Misol'],
      rows: [
        ['and, but, so, or', ', oldidan', 'It is cheap, but it is unreliable.'],
        ['although, because, if, when', 'oldin kelsa , keyin', 'Although it is cheap, it is unreliable.'],
        ['however, therefore, moreover', '. yoki ; oldidan, , keyin', 'It is cheap. However, it is unreliable.'],
        ['nuqtali vergul (;)', 'ikki mustaqil gap', 'It is cheap; it is also unreliable.']
      ]
    },
    use: [
      { uz: "Bir abzatsda 2–3 tadan ortiq kiriş söz işlatma — sunʼiy eşitiladi.", en: 'Do not use more than two or three linking adverbs per paragraph; it sounds artificial.' }
    ],
    examples: [
      'The scheme reduced traffic. However, it proved expensive to maintain.',
      'Public transport is limited; as a result, car use remains high.',
      'Although funding increased, outcomes did not improve significantly.'
    ],
    mistakes: [
      { bad: 'It is cheap, however it is unreliable.', good: 'It is cheap; however, it is unreliable.', why: { uz: 'however gap boğlay olmaydi — vergul yetarli emas.', en: 'however cannot join clauses; a comma is not enough.' } },
      { bad: 'Beacuse of the rain, so we stayed.', good: 'Because of the rain, we stayed.', why: { uz: 'because va so birga kelmaydi.', en: 'because and so cannot both appear.' } }
    ],
    ielts: {
      uz: "Coherence & Cohesion mezoni töğridan-töğri şu bilan baholanadi. Ortiqça boğlovçi ham ballni tuşiradi.",
      en: 'Coherence & Cohesion is judged directly on this — and overusing connectors also lowers the score.'
    }
  },

  /* ====================== C. FE'L QURILMALARI =========================== */

  'modals': {
    group: 'verbs',
    name: { uz: 'Modal feʼllar', en: 'Modals' },
    short: { uz: 'Imkoniyat, majburiyat, ehtimol, maslahat', en: 'Ability, obligation, probability, advice' },
    rule: {
      uz: "Modal feʼllar (can, could, may, might, must, şould, would) maʼnoga MUNOSABAT qöşadi: şartmi, mumkinmi, ehtimolmi. Ular heç qaçon özgarmaydi (-s olmaydi) va ulardan keyin feʼl ASL şaklda, to siz keladi. IELTS uçun eng qimmatlisi — ehtimol darajasini boşqariş: will (100%) → is likely to → may/might (50%) → is unlikely to.",
      en: "Modals (can, could, may, might, must, should, would) add an ATTITUDE: necessity, possibility, probability. They never change form (no -s) and are followed by the bare infinitive, with no to. For IELTS the most valuable use is controlling the degree of certainty: will (100%) → is likely to → may/might (50%) → is unlikely to."
    },
    forms: {
      head: ['Modal', "Ma'no", 'Misol'],
      rows: [
        ['can / could', 'imkoniyat, qobiliyat', 'This can lead to serious problems.'],
        ['may / might', 'ehtimol (50%)', 'This may result in higher costs.'],
        ['must', 'kuchli majburiyat / ishonch', 'Governments must act now.'],
        ['should', 'maslahat, tavsiya', 'Schools should teach financial literacy.'],
        ['would', 'faraziy holat', 'That would create new opportunities.'],
        ['have to', 'tashqi majburiyat', 'Students have to pay tuition fees.']
      ]
    },
    use: [
      { uz: "Task 2 tavsiya qismida şould va ought to.", en: 'should and ought to in the recommendation part of Task 2.' },
      { uz: "Fikrni yumşatiş: This may suggest that…", en: 'Softening a claim: This may suggest that…' }
    ],
    examples: [
      'Governments should invest more heavily in renewable energy.',
      'Excessive screen time may contribute to poor concentration.',
      'Such a policy could significantly reduce urban congestion.'
    ],
    mistakes: [
      { bad: 'He can to swim.', good: 'He can swim.', why: { uz: 'Modaldan keyin to yöq.', en: 'No to after a modal.' } },
      { bad: 'She cans drive.', good: 'She can drive.', why: { uz: 'Modal -s olmaydi.', en: 'Modals never take -s.' } },
      { bad: 'We must to go.', good: 'We must go.', why: { uz: 'must dan keyin ham to yöq.', en: 'No to after must either.' } }
    ],
    ielts: {
      uz: "Hedging (ehtiyotkor fikr) — Band 7+ yozişning belgisi. \"This is\" örniga \"This may be\" köpinça kuçliroq.",
      en: 'Hedging is a marker of Band 7+ writing; "This may be" is often stronger than "This is".'
    }
  },

  'conditionals': {
    group: 'verbs',
    name: { uz: 'Şart gaplar', en: 'Conditionals' },
    short: { uz: '0, 1, 2, 3 va aralaş turlari', en: 'Types 0, 1, 2, 3 and mixed' },
    rule: {
      uz: "Şart gap ikki qismdan: if-qismi va natija qismi. Tur real yoki farazi ekaniga qarab tanlanadi. Bitta qattiq qoida: if-qismida KELASI ZAMON işlatilmaydi — örniga hozirgi zamon keladi. Ikkinçi qoida: if-qismi oldin kelsa vergul qöyiladi, keyin kelsa qöyilmaydi.",
      en: "A conditional has an if-clause and a result clause. The type depends on how real or hypothetical the situation is. One hard rule: no FUTURE tense in the if-clause — present is used instead. Second rule: comma if the if-clause comes first, no comma if it comes second."
    },
    forms: {
      head: ['Tur', 'if-qismi', 'Natija', 'Qachon'],
      rows: [
        ['0', 'Present Simple', 'Present Simple', 'doimiy haqiqat'],
        ['1', 'Present Simple', 'will + fe\'l', 'real kelajak'],
        ['2', 'Past Simple', 'would + fe\'l', 'hozirgi faraz'],
        ['3', 'Past Perfect', 'would have + III', 'o\'tmish afsusi'],
        ['Aralash', 'Past Perfect', 'would + fe\'l', 'o\'tmish → hozirgi natija']
      ]
    },
    use: [
      { uz: "Task 2 da: If governments invested more, outcomes would improve.", en: 'In Task 2: If governments invested more, outcomes would improve.' },
      { uz: "unless = if not: Unless we act, the problem will worsen.", en: 'unless = if not: Unless we act, the problem will worsen.' }
    ],
    examples: [
      'If water reaches 100°C, it boils.',
      'If this trend continues, the situation will become critical.',
      'If I had more time, I would read far more widely.',
      'If I had started earlier, I would have achieved a higher score.'
    ],
    mistakes: [
      { bad: 'If I will have time, I will call.', good: 'If I have time, I will call.', why: { uz: 'if dan keyin kelasi zamon yöq.', en: 'No future after if.' } },
      { bad: 'If I would be rich…', good: 'If I were rich…', why: { uz: 'if-qismida would işlatilmaydi.', en: 'would does not go in the if-clause.' } },
      { bad: 'If I would have known…', good: 'If I had known…', why: { uz: '3-turda if-qismi Past Perfect.', en: 'Type 3 takes Past Perfect in the if-clause.' } }
    ],
    ielts: {
      uz: "2-tur şart gap Task 2 da yeçim taklif qilişning eng kuçli qurilmasi. Speaking Part 3 da ham juda foydali.",
      en: 'The second conditional is the strongest structure for proposing solutions in Task 2, and it is very useful in Speaking Part 3.'
    }
  },

  'passive': {
    group: 'verbs',
    name: { uz: 'Majhul nisbat', en: 'Passive voice' },
    short: { uz: "Kim qilgani emas, NIMA qilingani muhim", en: 'What was done matters more than who did it' },
    rule: {
      uz: "be + III şakl. Majhul nisbat bajaruvçini yaşiriş uçun emas, DIQQATNI köçiriş uçun işlatiladi: gapning boşiga qaysi söz çiqişi kerak bölsa, öşa ega böladi. Akademik yozuvda juda tabiiy, çunki jarayon bajaruvçidan muhimroq. Lekin haddan oşirma: butun inşo majhul nisbatda bölsa, öqiş oğirlaşadi.",
      en: "be + past participle. The passive is not for hiding the doer but for shifting FOCUS: whatever should open the sentence becomes the subject. It is natural in academic writing because the process matters more than the agent. Do not overuse it, though — a whole essay in the passive becomes heavy."
    },
    forms: {
      head: ['Zamon', 'Aktiv', 'Passiv'],
      rows: [
        ['Present Simple', 'They build houses.', 'Houses are built.'],
        ['Past Simple', 'They built houses.', 'Houses were built.'],
        ['Present Perfect', 'They have built…', 'Houses have been built.'],
        ['Modal', 'They should build…', 'Houses should be built.'],
        ['Future', 'They will build…', 'Houses will be built.']
      ]
    },
    use: [
      { uz: "Bajaruvçi nomaʼlum yoki muhim emas: The law was passed in 2019.", en: 'The doer is unknown or unimportant: The law was passed in 2019.' },
      { uz: "Jarayon tasviri (Task 1 process): The mixture is then heated.", en: 'Describing a process (Task 1): The mixture is then heated.' },
      { uz: "Ohangni xolis qiliş: It is widely believed that…", en: 'Making the tone impersonal: It is widely believed that…' }
    ],
    examples: [
      'The policy was introduced in response to growing public pressure.',
      'More attention should be paid to preventive healthcare.',
      'It is often argued that technology has weakened social bonds.'
    ],
    mistakes: [
      { bad: 'The book was wrote by him.', good: 'The book was written by him.', why: { uz: 'III şakl kerak (written), II emas.', en: 'The third form (written) is needed, not the second.' } },
      { bad: 'The problem is discuss in the article.', good: 'The problem is discussed in the article.', why: { uz: 'be + III şakl.', en: 'be + past participle.' } },
      { bad: 'It was happened yesterday.', good: 'It happened yesterday.', why: { uz: "happen ötimsiz feʼl — passiv şakli yöq.", en: 'happen is intransitive; it has no passive.' } }
    ],
    ielts: {
      uz: "Task 1 process diagrammalarida deyarli har gap majhul nisbatda böladi. Task 2 da esa xolis ohang uçun.",
      en: 'Nearly every sentence of a Task 1 process description is passive; in Task 2 it provides an impersonal tone.'
    }
  },

  'gerund-infinitive': {
    group: 'verbs',
    name: { uz: 'Gerund va infinitiv', en: 'Gerunds & infinitives' },
    short: { uz: "-ing yoki to + feʼl — qaysi biri?", en: '-ing or to + verb — which one?' },
    rule: {
      uz: "Feʼldan keyin yana feʼl kelsa, birinçi feʼl qaysi şaklni talab qilişini BILIŞ kerak — mantiqiy qoida yöq, yodlanadi. Ikki aniq qoida bor: predlogdan keyin DOIM -ing (good at learning, interested in studying), va ega örnida ham -ing (Learning English takes time). Baʼzi feʼllarda ikkalasi ham mumkin, lekin maʼno özgaradi: stop smoking ≠ stop to smoke.",
      en: "When a verb follows a verb, you must KNOW which form the first one takes — there is no logical rule, it is learned. Two rules are reliable: after a preposition always -ing (good at learning, interested in studying), and as a subject always -ing (Learning English takes time). Some verbs allow both with a change in meaning: stop smoking ≠ stop to smoke."
    },
    forms: {
      head: ['Keyin -ing', 'Keyin to + fe\'l', 'Ikkalasi ham'],
      rows: [
        ['enjoy, avoid, suggest', 'want, decide, hope', 'start, begin, continue'],
        ['finish, mind, consider', 'plan, agree, refuse', 'like, love, hate'],
        ['practise, imagine, deny', 'manage, afford, promise', 'remember, forget, stop*']
      ]
    },
    use: [
      { uz: "* Maʼno farqi: remember to lock (eslab qiliş) ≠ remember locking (qilganini eslaş).", en: '* Meaning changes: remember to lock (do it) ≠ remember locking (recall doing it).' },
      { uz: "Predlogdan keyin: by improving, without knowing, instead of waiting.", en: 'After a preposition: by improving, without knowing, instead of waiting.' }
    ],
    examples: [
      'Many students avoid speaking in class because they fear making mistakes.',
      'The government has decided to increase funding for public transport.',
      'Improving your writing requires consistent daily practice.'
    ],
    mistakes: [
      { bad: 'I enjoy to read.', good: 'I enjoy reading.', why: { uz: 'enjoy dan keyin -ing.', en: 'enjoy takes -ing.' } },
      { bad: 'I am interested in learn English.', good: 'I am interested in learning English.', why: { uz: 'Predlogdan keyin -ing.', en: 'After a preposition, use -ing.' } },
      { bad: 'I want going home.', good: 'I want to go home.', why: { uz: 'want dan keyin to + feʼl.', en: 'want takes to + verb.' } },
      { bad: 'To learn languages is useful.', good: 'Learning languages is useful.', why: { uz: 'Ega örnida -ing tabiiyroq.', en: '-ing is more natural as a subject.' } }
    ],
    ielts: {
      uz: "Bu xato juda köp uçraydi va Lexical Resource emas, Grammar ballini tuşiradi. Röyxatni cheatsheet qilib yoningda saqla.",
      en: 'A very frequent error that damages the Grammar score, not Lexical Resource. Keep this list as a cheatsheet.'
    }
  },

  'reported-speech': {
    group: 'verbs',
    name: { uz: "Özga gap", en: 'Reported speech' },
    short: { uz: "Boşqaning gapini öz gapingda aytiş", en: "Reporting what someone else said" },
    rule: {
      uz: "Boş feʼl ötgan zamonda bölsa (said, told, explained), ergaş gapdagi zamon bir poğona orqaga suriladi va şaxs/vaqt sözlari özgaradi. Agar aytilgan narsa hozir ham haqiqat bölsa, zamonni suriş şart emas. Söroq gap köçirilganda söroq TARTIBI yöqoladi — bu eng köp unutiladigan qoida.",
      en: "If the reporting verb is past (said, told, explained), the tense in the reported clause shifts back one step and pronouns/time words change. If the statement is still true now, the shift is optional. When reporting a question, question WORD ORDER disappears — the rule most often forgotten."
    },
    forms: {
      head: ["To'g'ri gap", "O'zga gap"],
      rows: [
        ['"I work here."', 'He said he worked there.'],
        ['"I am working."', 'He said he was working.'],
        ['"I worked."', 'He said he had worked.'],
        ['"I will work."', 'He said he would work.'],
        ['"Where do you live?"', 'She asked where I lived.'],
        ['"Do you agree?"', 'She asked whether I agreed.']
      ]
    },
    use: [
      { uz: "Speaking Part 2 da suhbatni qayta hikoya qilişda.", en: 'Retelling a conversation in Speaking Part 2.' },
      { uz: "Writing'da manbaga havola: The report states that…", en: 'Referring to a source in Writing: The report states that…' }
    ],
    examples: [
      'My teacher explained that consistent practice mattered more than talent.',
      'The article argues that remote work has permanently changed the labour market.',
      'She asked me why I had chosen that particular field.'
    ],
    mistakes: [
      { bad: 'He said me that…', good: 'He told me that… / He said that…', why: { uz: 'say + to me, tell + me.', en: 'say to me, but tell me.' } },
      { bad: 'She asked where do I live.', good: 'She asked where I lived.', why: { uz: "Özga gapda söroq tartibi yöq.", en: 'No question order in reported speech.' } }
    ],
    ielts: {
      uz: "Speaking Part 2 da hikoyani jonlantiradi va grammatik xilma-xillik beradi.",
      en: 'Brings a Speaking Part 2 narrative to life and adds grammatical range.'
    }
  },

  /* ====================== D. OT GURUHI ================================= */

  'articles': {
    group: 'noun',
    name: { uz: 'Artikllar: a / an / the / —', en: 'Articles: a / an / the / zero' },
    short: { uz: "Özbek tilida yöq — şuning uçun eng köp xato", en: 'Absent from Uzbek — hence the most frequent error' },
    rule: {
      uz: "Uç savolga ketma-ket javob ber. (1) Ot sanaladimi va birlikdami? Ha bölsa — artikl ŞART. (2) Öquvçi qaysi biri ekanini biladimi? Bilsa — the, bilmasa — a/an. (3) Umuman, turkum sifatida gapiryapmanmi? Unda köplik + artiklsiz (Books are useful) yoki the + birlik (The computer çanged society). Sanalmaydigan otlar (information, advice, water) a/an OLMAYDI.",
      en: "Answer three questions in order. (1) Is the noun countable and singular? If yes, an article is COMPULSORY. (2) Does the reader know which one? If yes → the; if not → a/an. (3) Am I generalising about a whole class? Then plural with no article (Books are useful) or the + singular (The computer changed society). Uncountable nouns (information, advice, water) never take a/an."
    },
    forms: {
      head: ['Holat', 'Artikl', 'Misol'],
      rows: [
        ['Birinchi marta eslatilyapti', 'a / an', 'I read a book yesterday.'],
        ['Ikkalamiz ham bilamiz', 'the', 'The book was excellent.'],
        ['Yagona narsa', 'the', 'the sun, the government, the environment'],
        ['Umumiy, ko\'plik', '— (yo\'q)', 'Books are expensive.'],
        ['Sanalmaydigan, umumiy', '— (yo\'q)', 'Information is valuable.'],
        ['Ustunlik darajasi', 'the', 'the most important factor'],
        ['Kasb, birlik', 'a / an', 'She is an engineer.']
      ]
    },
    use: [
      { uz: "Inşo tekşirayotganda har birlik sanaladigan otni aylantirib çiq: oldida biror aniqlovçi bormi?", en: 'When proofreading, circle every singular countable noun: does it have a determiner?' }
    ],
    examples: [
      'The government should introduce a new policy on public transport.',
      'Education is the most powerful tool for reducing inequality.',
      'A growing number of people work remotely.'
    ],
    mistakes: [
      { bad: 'I am student.', good: 'I am a student.', why: { uz: 'Birlik sanaladigan ot — artikl şart.', en: 'A singular countable noun needs an article.' } },
      { bad: 'The life is hard.', good: 'Life is hard.', why: { uz: 'Umumiy tuşunça — artiklsiz.', en: 'A general concept takes no article.' } },
      { bad: 'He gave me an advice.', good: 'He gave me some advice.', why: { uz: 'advice sanalmaydi.', en: 'advice is uncountable.' } },
      { bad: 'I go to the school every day.', good: 'I go to school every day.', why: { uz: "Muassasa vazifasi maʼnosida artiklsiz.", en: 'No article when referring to the institution\'s purpose.' } }
    ],
    ielts: {
      uz: "Artikl xatosi heç qaçon maʼnoni buzmaydi — lekin ANIQLIK ballini tuşiradi. Band 8 da bu xato deyarli bölmaydi.",
      en: 'Article errors rarely break meaning but they lower the accuracy score; at Band 8 they are almost absent.'
    }
  },

  'countable-uncountable': {
    group: 'noun',
    name: { uz: 'Sanaladigan va sanalmaydigan otlar', en: 'Countable & uncountable nouns' },
    short: { uz: "-s oladimi, yöqmi", en: 'Does it take -s or not' },
    rule: {
      uz: "Sanalmaydigan otlar köplik şakliga EGA EMAS va a/an olmaydi. Ular köpinça modda, tuşunça yoki umumiy toifa: information, advice, researç, knowledge, equipment, furniture, traffic, money, work, homework, progress, evidence. Miqdorini aytiş uçun \"birlik söz\" qöşiladi: a piece of advice, an item of equipment, a great deal of researç.",
      en: "Uncountable nouns have NO plural form and take no a/an. They are typically substances, concepts or general categories: information, advice, research, knowledge, equipment, furniture, traffic, money, work, homework, progress, evidence. To quantify them, add a unit word: a piece of advice, an item of equipment, a great deal of research."
    },
    forms: {
      head: ['Sanalmaydigan', "To'g'ri miqdor so'zi", "Noto'g'ri"],
      rows: [
        ['information', 'much / a lot of information', 'informations, many information'],
        ['advice', 'a piece of advice', 'an advice, advices'],
        ['research', 'a great deal of research', 'researches, a research'],
        ['knowledge', 'a good deal of knowledge', 'knowledges'],
        ['equipment', 'a piece of equipment', 'equipments'],
        ['money', 'much money', 'many moneys']
      ]
    },
    use: [
      { uz: "muç / little — sanalmaydigan; many / few — sanaladigan; a lot of — ikkalasi ham.", en: 'much / little — uncountable; many / few — countable; a lot of — both.' }
    ],
    examples: [
      'Recent research suggests that sleep has a significant impact on memory.',
      'Students need access to reliable information and up-to-date equipment.',
      'A great deal of evidence supports this conclusion.'
    ],
    mistakes: [
      { bad: 'many informations', good: 'much information', why: { uz: 'Sanalmaydi — many ham, -s ham yöq.', en: 'Uncountable: neither many nor -s.' } },
      { bad: 'I have many homeworks.', good: 'I have a lot of homework.', why: { uz: 'homework sanalmaydi.', en: 'homework is uncountable.' } },
      { bad: 'She gave me some advices.', good: 'She gave me some advice.', why: { uz: 'advice — doim birlik.', en: 'advice is always singular.' } }
    ],
    ielts: {
      uz: "Bu otlar akademik matnda juda köp uçraydi — şuning uçun xato ham köp böladi. Röyxatni yodda saqla.",
      en: 'These nouns appear constantly in academic writing, so the errors are frequent. Memorise the list.'
    }
  },

  'quantifiers': {
    group: 'noun',
    name: { uz: 'Miqdor sözlari', en: 'Quantifiers & determiners' },
    short: { uz: 'muç, many, few, little, most, several', en: 'much, many, few, little, most, several' },
    rule: {
      uz: "Miqdor sözi otning sanaladigan yoki sanalmaydiganiga qarab tanlanadi. Ikki nozik juftlik bor: a few (ozgina, lekin bor — ijobiy) va few (deyarli yöq — salbiy); a little va little ham xuddi şunday. Most of the students — aniq guruh; Most students — umuman. Bu \"of the\" farqi Task 2 da köp kerak.",
      en: "The quantifier depends on whether the noun is countable or uncountable. Two subtle pairs: a few (a small number, but some — positive) versus few (hardly any — negative); the same applies to a little and little. Most of the students refers to a defined group; Most students is a generalisation. This of the distinction matters a lot in Task 2."
    },
    forms: {
      head: ['Sanaladigan', 'Sanalmaydigan', 'Ikkalasi'],
      rows: [
        ['many', 'much', 'a lot of / lots of'],
        ['a few / few', 'a little / little', 'some / any'],
        ['several', 'a great deal of', 'plenty of'],
        ['a number of', 'an amount of', 'most / all']
      ]
    },
    use: [
      { uz: "Akademik yozuvda a lot of örniga a significant number of / a considerable amount of.", en: 'In academic writing prefer a significant number of / a considerable amount of to a lot of.' }
    ],
    examples: [
      'A significant proportion of young people now study abroad.',
      'Few countries have managed to solve this problem entirely.',
      'Most of the participants reported a noticeable improvement.'
    ],
    mistakes: [
      { bad: 'much people', good: 'many people', why: { uz: 'people sanaladi.', en: 'people is countable.' } },
      { bad: 'Most of people think…', good: 'Most people think…', why: { uz: "Umumiy maʼnoda of işlatilmaydi.", en: 'No of when generalising.' } },
      { bad: 'There are less students.', good: 'There are fewer students.', why: { uz: 'Sanaladiganda fewer.', en: 'Use fewer with countables.' } }
    ],
    ielts: {
      uz: "Task 1 da uluşni tasvirlaşda va Task 2 da umumlaştirişda doim kerak.",
      en: 'Needed constantly for describing proportions in Task 1 and generalising in Task 2.'
    }
  },

  'prepositions': {
    group: 'noun',
    name: { uz: 'Predloglar', en: 'Prepositions' },
    short: { uz: "Yodlanadi — qoida bilan çiqarilmaydi", en: 'Learned, not derived from rules' },
    rule: {
      uz: "Predlog köpinça mantiqan emas, ODAT böyiça tanlanadi — şuning uçun uni yolğiz emas, söz bilan BIRGA yodlaş kerak: \"depend ON\", \"interested IN\", \"an increase IN\", \"reason FOR\". Vaqt uçun uçta asosiy qoida bor: in (uzun davr — in 2026, in Març), on (kun — on Monday), at (aniq payt — at 5 pm).",
      en: "Prepositions are usually a matter of HABIT rather than logic, so learn them attached to their word: \"depend ON\", \"interested IN\", \"an increase IN\", \"reason FOR\". For time there are three reliable rules: in (long periods — in 2026, in March), on (days — on Monday), at (exact times — at 5 pm)."
    },
    forms: {
      head: ['Qolip', 'Predlog', 'Misol'],
      rows: [
        ['an increase / decrease', 'in', 'an increase in demand'],
        ['the reason', 'for', 'the reason for the decline'],
        ['depend / rely', 'on', 'It depends on the context.'],
        ['interested / involved', 'in', 'interested in learning'],
        ['responsible', 'for', 'responsible for the outcome'],
        ['impact / effect', 'on', 'a major impact on society'],
        ['access / solution', 'to', 'access to education'],
        ['aware / capable', 'of', 'aware of the risks']
      ]
    },
    use: [
      { uz: "Yangi söz yozganda predlogi bilan yoz: \"depend on\" — \"depend\" emas.", en: 'When you record a new word, record its preposition: "depend on", not "depend".' }
    ],
    examples: [
      'There has been a sharp increase in the number of remote workers.',
      'The main reason for this shift is the rising cost of urban housing.',
      'Access to quality education remains unequal in many regions.'
    ],
    mistakes: [
      { bad: 'depend of', good: 'depend on', why: { uz: "Barqaror birikma.", en: 'Fixed collocation.' } },
      { bad: 'an increase of unemployment', good: 'an increase in unemployment', why: { uz: 'increase IN (nimada), OF (qança).', en: 'increase IN (what), OF (how much).' } },
      { bad: 'discuss about the problem', good: 'discuss the problem', why: { uz: 'discuss predlog olmaydi.', en: 'discuss takes no preposition.' } },
      { bad: 'in Monday', good: 'on Monday', why: { uz: 'Kunlar uçun on.', en: 'Use on for days.' } }
    ],
    ielts: {
      uz: "Task 1 da \"an increase in\" qolipini xato yoziş — juda köp uçraydigan va oson tuzatiladigan xato.",
      en: 'Getting "an increase in" wrong in Task 1 is both very common and very easy to fix.'
    }
  },

  'word-forms': {
    group: 'noun',
    name: { uz: "Söz şakllari", en: 'Word forms' },
    short: { uz: "Bir özakdan ot, sifat, feʼl, raviş", en: 'Noun, adjective, verb, adverb from one root' },
    rule: {
      uz: "Bitta özakdan tört xil söz yasaladi va gapdagi ÖRNI qaysi şakl kerakligini belgilaydi. Egada — ot, kesimda — feʼl, otdan oldin — sifat, feʼldan keyin — raviş. Bir sözni örganganda törttalasini birga yozib qöy — bu Lexical Resource ballini eng tez kötaradigan odat.",
      en: "One root produces four different words, and the POSITION in the sentence decides which is needed: noun in subject position, verb as predicate, adjective before a noun, adverb after a verb. When you learn a word, record all four together — the fastest habit for raising Lexical Resource."
    },
    forms: {
      head: ['Ot', 'Sifat', "Fe'l", 'Ravish'],
      rows: [
        ['success', 'successful', 'succeed', 'successfully'],
        ['difference', 'different', 'differ', 'differently'],
        ['importance', 'important', '—', 'importantly'],
        ['analysis', 'analytical', 'analyse', 'analytically'],
        ['economy', 'economic / economical', '—', 'economically'],
        ['significance', 'significant', 'signify', 'significantly'],
        ['benefit', 'beneficial', 'benefit', 'beneficially']
      ]
    },
    use: [
      { uz: "Inşo tekşirişda: har sözning gapdagi vazifasi şakliga mos keladimi?", en: 'When proofreading: does each word\'s form match its job in the sentence?' }
    ],
    examples: [
      'The economic impact of the policy was significant.',
      'The number of applicants increased significantly last year.',
      'Regular exercise is highly beneficial to mental health.'
    ],
    mistakes: [
      { bad: 'This is very benefit.', good: 'This is very beneficial.', why: { uz: 'Sifat kerak, ot emas.', en: 'An adjective is needed, not a noun.' } },
      { bad: 'It increased significant.', good: 'It increased significantly.', why: { uz: "Feʼldan keyin raviş.", en: 'An adverb follows the verb.' } },
      { bad: 'The different is clear.', good: 'The difference is clear.', why: { uz: 'Egada ot böladi.', en: 'A noun is needed in subject position.' } }
    ],
    ielts: {
      uz: "Sözni bilib turib notöğri şaklda işlatiş — Lexical Resource ballini tuşiruvçi asosiy sabab.",
      en: 'Knowing a word but using the wrong form is the main drag on Lexical Resource.'
    }
  },

  'comparatives': {
    group: 'noun',
    name: { uz: 'Qiyoslaş darajalari', en: 'Comparatives & superlatives' },
    short: { uz: '-er / more, the -est / the most', en: '-er / more, the -est / the most' },
    rule: {
      uz: "Bir böğinli sifatga -er/-est, uç va undan köp böğinliga more/most. Ikki böğinlilar bölinadi: -y ga tugasa -ier (happy → happier), aks holda more. Qiyoslaşda than, ustunlikda the şart. Farqni kuçaytiriş yoki yumşatiş uçun: far/significantly/slightly + comparative — Task 1 da juda kerak.",
      en: "One-syllable adjectives take -er/-est; three or more syllables take more/most. Two-syllable adjectives split: those ending in -y take -ier (happy → happier), otherwise more. Comparatives need than; superlatives need the. To strengthen or soften the gap: far/significantly/slightly + comparative — essential in Task 1."
    },
    forms: {
      head: ['Sifat', 'Qiyosiy', 'Ustunlik'],
      rows: [
        ['cheap', 'cheaper', 'the cheapest'],
        ['easy', 'easier', 'the easiest'],
        ['expensive', 'more expensive', 'the most expensive'],
        ['good', 'better', 'the best'],
        ['bad', 'worse', 'the worst'],
        ['far', 'further', 'the furthest']
      ]
    },
    use: [
      { uz: "Kuçaytiriş: far higher, significantly lower, considerably more.", en: 'Strengthening: far higher, significantly lower, considerably more.' },
      { uz: "Yumşatiş: slightly higher, marginally lower.", en: 'Softening: slightly higher, marginally lower.' },
      { uz: "Teng qiyoslaş: as high as, twice as many as.", en: 'Equal comparison: as high as, twice as many as.' }
    ],
    examples: [
      'Spending on healthcare was significantly higher than spending on education.',
      'The figure for 2020 was almost twice as high as that for 2010.',
      'This is by far the most effective solution available.'
    ],
    mistakes: [
      { bad: 'more easier', good: 'easier', why: { uz: 'Ikki marta qiyoslama bölmaydi.', en: 'Do not double the comparative.' } },
      { bad: 'more better', good: 'better', why: { uz: 'better allaqaçon qiyosiy şakl.', en: 'better is already comparative.' } },
      { bad: 'higher then', good: 'higher than', why: { uz: 'than — qiyoslaş, then — keyin.', en: 'than compares; then means next.' } },
      { bad: 'It is the most cheapest.', good: 'It is the cheapest.', why: { uz: 'the most va -est birga kelmaydi.', en: 'the most and -est cannot combine.' } }
    ],
    ielts: {
      uz: "Writing Task 1 ning YURAGI — grafikdagi maʼlumot qiyoslanmasa, Task Açievement ballini olmaysan.",
      en: 'The HEART of Task 1 — without comparison you cannot score on Task Achievement.'
    }
  },

  /* ====================== E. AKADEMIK USLUB ============================ */

  'cohesion': {
    group: 'style',
    name: { uz: "Matnni boğlaş", en: 'Cohesion' },
    short: { uz: "Fikrlarni bir-biriga ulaş vositalari", en: 'Devices that link ideas together' },
    rule: {
      uz: "Cohesion faqat \"Firstly, Secondly, In conclusion\" degani emas — bu eng zaif turi. Kuçli boğlaş uç usulda böladi: (1) olmoş va körsatuvçi sözlar (this, these, suç), (2) sinonim bilan takrorlaş (the policy → the measure → this initiative), (3) boğlovçi sözlar. Uçtasini aralaştirsang matn tabiiy oqadi; faqat uçinçisini işlatsang — mexanik eşitiladi.",
      en: "Cohesion is not just \"Firstly, Secondly, In conclusion\" — that is its weakest form. Strong linking works three ways: (1) pronouns and demonstratives (this, these, such), (2) synonym repetition (the policy → the measure → this initiative), (3) linking words. Mixing all three makes the text flow; relying only on the third sounds mechanical."
    },
    forms: {
      head: ['Vazifa', 'Vositalar'],
      rows: [
        ["Qo'shish", 'moreover, furthermore, in addition, also'],
        ['Qarama-qarshilik', 'however, nevertheless, on the other hand, whereas'],
        ['Sabab-natija', 'therefore, consequently, as a result, thus'],
        ['Misol', 'for instance, for example, such as, namely'],
        ['Xulosa', 'overall, in short, to sum up'],
        ["Ortga havola", 'this, these, such, the former, the latter']
      ]
    },
    use: [
      { uz: "Bir abzatsda 2 tadan ortiq boğlovçi söz işlatma.", en: 'No more than two linking words per paragraph.' },
      { uz: "\"This problem\", \"suç measures\" — boğlovçi sözdan tabiiyroq.", en: '"This problem", "such measures" sound more natural than connectors.' }
    ],
    examples: [
      'Air quality has deteriorated sharply. This decline is largely due to traffic emissions.',
      'Some argue that fees should rise; others reject such a measure entirely.',
      'The policy reduced congestion. It did not, however, improve air quality.'
    ],
    mistakes: [
      { bad: 'Firstly… Secondly… Thirdly… Finally… (har abzatsda)', good: 'Aralash: one reason…, a further factor…, this in turn…', why: { uz: "Faqat röyxat boğlovçilari mexanik eşitiladi.", en: 'List connectors alone sound mechanical.' } },
      { bad: 'In conclusion, in summary, to sum up…', good: 'In conclusion, …', why: { uz: 'Bittasi yetadi.', en: 'One is enough.' } }
    ],
    ielts: {
      uz: "Coherence & Cohesion — Writing bahosining çorak qismi. Band 7 dan yuqorisi boğlovçi söz SONI bilan emas, TABIIYLIGI bilan olinadi.",
      en: 'Coherence & Cohesion is a quarter of the Writing score, and above Band 7 it is judged on naturalness, not on the number of connectors.'
    }
  },

  'nominalisation': {
    group: 'style',
    name: { uz: 'Nominalizatsiya', en: 'Nominalisation' },
    short: { uz: "Feʼlni otga aylantirib akademik ohang beriş", en: 'Turning verbs into nouns for an academic tone' },
    rule: {
      uz: "Akademik ingliz tili feʼlga emas, OTGA suyanadi. \"The government decided to invest\" → \"The governmentʼs decision to invest\". \"Prices increased rapidly\" → \"The rapid increase in prices\". Bu gapni ziçlaştiradi va xolis ohang beradi. Lekin haddan oşirma: butun inşo otlardan iborat bölsa, öqiş qiyinlaşadi va Coherence tuşadi.",
      en: "Academic English leans on NOUNS rather than verbs. \"The government decided to invest\" → \"The government's decision to invest\". \"Prices increased rapidly\" → \"The rapid increase in prices\". This condenses the sentence and creates an impersonal tone. Do not overdo it: an essay made entirely of nouns becomes hard to read and hurts Coherence."
    },
    forms: {
      head: ["Fe'l shakli", 'Ot shakli'],
      rows: [
        ['Prices increased.', 'the increase in prices'],
        ['They decided to act.', 'their decision to act'],
        ['The economy grew.', 'the growth of the economy'],
        ['People consume more.', 'higher consumption'],
        ['Companies must comply.', 'compliance is required'],
        ['Students improved quickly.', 'rapid improvement among students']
      ]
    },
    use: [
      { uz: "Abzats boşida mavzuni kiritiş uçun juda qulay.", en: 'Very useful for introducing a topic at the start of a paragraph.' },
      { uz: "Task 1 da: \"a steady rise in unemployment\".", en: 'In Task 1: "a steady rise in unemployment".' }
    ],
    examples: [
      'The rapid expansion of online education has transformed access to learning.',
      'A significant reduction in carbon emissions requires coordinated action.',
      'Government investment in infrastructure remains insufficient.'
    ],
    mistakes: [
      { bad: 'The increase of prices is because the demand increased.', good: 'The increase in prices reflects rising demand.', why: { uz: 'increase IN, va takror feʼldan qoçing.', en: 'increase IN, and avoid repeating the verb.' } }
    ],
    ielts: {
      uz: "Band 7 va Band 8 yozuvi orasidagi eng közga körinadigan farqlardan biri.",
      en: 'One of the most visible differences between Band 7 and Band 8 writing.'
    }
  },

  'hedging': {
    group: 'style',
    name: { uz: 'Ehtiyotkor fikr (hedging)', en: 'Hedging' },
    short: { uz: "Fikrni qatʼiy emas, ölçovli aytiş", en: 'Stating a claim with measured caution' },
    rule: {
      uz: "Akademik yozuvda qatʼiy daʼvo (\"This is always true\", \"Everyone knows\") zaiflik belgisi — çunki uni isbotlab bölmaydi. Örniga ehtimol darajasini körsatuvçi til işlatiladi: may, tend to, is likely to, in most cases, arguably. Bu \"işonçsizlik\" emas — bu ILMIY aniqlik. Aksinça, öz fikringni bildirişda esa aniq böl: \"I would argue that…\"",
      en: "In academic writing an absolute claim (\"This is always true\", \"Everyone knows\") reads as weak, because it cannot be defended. Instead use language that marks degree of probability: may, tend to, is likely to, in most cases, arguably. This is not vagueness — it is scientific precision. When stating your own position, however, be clear: \"I would argue that…\""
    },
    forms: {
      head: ['Kuchli (xavfli)', 'Ehtiyotkor (yaxshi)'],
      rows: [
        ['This is always the case.', 'This is often the case.'],
        ['It will definitely happen.', 'It is likely to happen.'],
        ['Everyone agrees that…', 'It is widely accepted that…'],
        ['This proves that…', 'This suggests that…'],
        ['All students are lazy.', 'Some students may lack motivation.'],
        ['It is the only reason.', 'It is arguably the main reason.']
      ]
    },
    use: [
      { uz: "Umumlaştirganda: tend to, in general, in most cases.", en: 'When generalising: tend to, in general, in most cases.' },
      { uz: "Dalilga tayanganda: researç suggests, evidence indicates.", en: 'When citing evidence: research suggests, evidence indicates.' }
    ],
    examples: [
      'Excessive use of social media may contribute to increased anxiety among teenagers.',
      'Countries with higher education spending tend to report stronger economic growth.',
      'It is widely accepted that early intervention produces better outcomes.'
    ],
    mistakes: [
      { bad: 'All people think that…', good: 'Many people believe that…', why: { uz: '"Hamma" — isbotlab bölmaydigan daʼvo.', en: '"Everyone" is an indefensible claim.' } },
      { bad: 'It is 100% correct.', good: 'The evidence strongly supports this view.', why: { uz: 'Akademik ohang uçun.', en: 'For an academic register.' } }
    ],
    ielts: {
      uz: "Task Response mezonida \"öz pozitsiyasini aniq va ölçovli ifodalaş\" talab qilinadi — hedging aynan şu.",
      en: 'Task Response asks for a clear but measured position — hedging is exactly that.'
    }
  },

  'formality': {
    group: 'style',
    name: { uz: 'Rasmiy uslub', en: 'Formality & register' },
    short: { uz: "Yozma ingliz tili oğzakidan boşqaça", en: 'Written English differs from spoken English' },
    rule: {
      uz: "IELTS Writing yarim-rasmiy akademik uslubni talab qiladi. Qisqartma (donʼt, isnʼt), sözlaşuv iborasi (a lot of, kids, stuff), söroq gap va undov belgisi işlatilmaydi. Phrasal verb örniga bir sözli akademik feʼl qöyiladi: find out → discover, put off → postpone. Speaking'da esa aksinça — juda rasmiy gapiriş ğayritabiiy eşitiladi.",
      en: "IELTS Writing requires a semi-formal academic register. Avoid contractions (don't, isn't), colloquialisms (a lot of, kids, stuff), rhetorical questions and exclamation marks. Replace phrasal verbs with single academic verbs: find out → discover, put off → postpone. In Speaking the opposite holds — sounding too formal is unnatural."
    },
    forms: {
      head: ['So\'zlashuv', 'Akademik'],
      rows: [
        ['a lot of / lots of', 'a significant number of'],
        ['kids', 'children / young people'],
        ['get better', 'improve'],
        ['find out', 'discover / establish'],
        ['put off', 'postpone'],
        ['big problem', 'serious issue'],
        ['I think', 'I would argue / In my view'],
        ["don't, can't, isn't", 'do not, cannot, is not']
      ]
    },
    use: [
      { uz: "Writing: rasmiy. Speaking: tabiiy, hatto sözlaşuv iborasi ham yaxşi.", en: 'Writing: formal. Speaking: natural, where colloquial language is fine.' }
    ],
    examples: [
      'A significant number of young people postpone entering the labour market.',
      'I would argue that the disadvantages outweigh the benefits.',
      'This issue cannot be resolved without international cooperation.'
    ],
    mistakes: [
      { bad: "Kids don't like it, do they?", good: 'Children tend to dislike this approach.', why: { uz: "Sözlaşuv + qisqartma + söroq — uçalasi ham Writing'da yaramaydi.", en: 'Colloquial + contraction + question tag — none belong in Writing.' } },
      { bad: 'And also, secondly…', good: 'In addition,', why: { uz: "Ikki boğlovçi birga kelmaydi.", en: 'Do not stack two connectors.' } }
    ],
    ielts: {
      uz: "Lexical Resource mezonida \"uslubni töğri tanlaş\" alohida baholanadi.",
      en: 'Choosing the right register is judged directly under Lexical Resource.'
    }
  },

  'paraphrasing': {
    group: 'style',
    name: { uz: 'Paraphrase — qayta ifodalaş', en: 'Paraphrasing' },
    short: { uz: "Bir fikrni boşqa sözlar bilan aytiş", en: 'Saying the same idea in different words' },
    rule: {
      uz: "Paraphrase faqat sinonim almaştiriş emas — bu tört vositani birga işlatiş: (1) sinonim, (2) söz şaklini özgartiriş (increase → an increase), (3) aktiv ↔ passiv, (4) gap tuzilişini özgartiriş. Bitta vosita bilan qilingan paraphrase sunʼiy çiqadi. Reading'da savol matndagi sözni AYNAN takrorlamaydi — javobni topiş demak, paraphraseʼni taniş demak.",
      en: "Paraphrasing is not just swapping synonyms — it combines four tools: (1) synonyms, (2) word-form change (increase → an increase), (3) active ↔ passive, (4) restructuring the sentence. Using only one tool produces an artificial result. In Reading the question never repeats the passage word for word, so finding the answer means recognising the paraphrase."
    },
    forms: {
      head: ['Asl', 'Paraphrase'],
      rows: [
        ['Many people believe…', 'It is widely held that…'],
        ['The number of cars increased.', 'There was a rise in car ownership.'],
        ['Governments should ban it.', 'A ban should be imposed by the authorities.'],
        ['Children spend a lot of time online.', 'Young people devote considerable time to the internet.']
      ]
    },
    use: [
      { uz: "Writing'da: savol matnini AYNAN köçirma — kiriş qismini paraphrase qil.", en: 'In Writing: never copy the prompt — paraphrase it in your introduction.' },
      { uz: "Reading'da: savoldagi kalit sözning sinonimini matndan qidir.", en: 'In Reading: look for a synonym of the question keyword in the passage.' }
    ],
    examples: [
      'Prompt: Some people think examinations are the best way to assess students.',
      '→ It is sometimes argued that formal testing provides the most reliable measure of student ability.'
    ],
    mistakes: [
      { bad: 'Savol matnini so\'zma-so\'z ko\'chirish', good: 'Sinonim + tuzilma o\'zgarishi', why: { uz: 'Köçirilgan sözlar söz sanoğiga kirmaydi.', en: 'Copied words are not counted towards the word count.' } },
      { bad: 'Lug\'atdan tasodifiy sinonim olish', good: 'Kontekstga mos sinonim', why: { uz: 'big house ≠ enormous house — sinonim har doim almaştirib bölmaydi.', en: 'Synonyms are not always interchangeable.' } }
    ],
    ielts: {
      uz: "Törtala bölimda ham kerak: Reading javob topiş, Listening tuzoqni köriş, Writing kiriş qismi, Speaking takrordan qoçiş.",
      en: 'Needed in all four sections: finding Reading answers, spotting Listening distractors, opening a Writing task, and avoiding repetition in Speaking.'
    }
  },

  'inversion-emphasis': {
    group: 'style',
    name: { uz: 'Inversiya va urğu qurilmalari', en: 'Inversion & emphasis' },
    short: { uz: "Band 8 uçun ilğor qurilmalar", en: 'Advanced structures for Band 8' },
    rule: {
      uz: "Baʼzi salbiy yoki çeklovçi sözlar gap boşiga çiqsa, undan keyin SÖROQ TARTIBI keladi: \"Not only does it save money, but it also reduces waste\". Şuningdek cleft gaplar urğu beradi: \"It is education that determines…\", \"What is needed is…\". Bular kuçli, lekin xavfli: bir inşoda bittadan ortiq işlatma va faqat işonçing komil bölsa yoz.",
      en: "When certain negative or limiting expressions open a sentence, QUESTION word order follows: \"Not only does it save money, but it also reduces waste\". Cleft sentences also add emphasis: \"It is education that determines…\", \"What is needed is…\". These are powerful but risky: use no more than one per essay, and only when you are sure of the form."
    },
    forms: {
      head: ['Qurilma', 'Misol'],
      rows: [
        ['Not only … but also', 'Not only does it reduce costs, but it also saves time.'],
        ['Never / Rarely / Seldom', 'Rarely has the issue been so urgent.'],
        ['Only if / Only when', 'Only when governments act will the problem be solved.'],
        ['No sooner … than', 'No sooner had it opened than demand surged.'],
        ['Cleft: It is … that', 'It is poverty that drives migration.'],
        ['Cleft: What … is', 'What is required is sustained investment.']
      ]
    },
    use: [
      { uz: "Task 2 xulosasida bitta kuçli gap sifatida.", en: 'As a single strong sentence in a Task 2 conclusion.' }
    ],
    examples: [
      'Not only does public transport reduce congestion, but it also improves air quality.',
      'Only by investing in education can a country secure long-term growth.',
      'What many governments overlook is the importance of preventive healthcare.'
    ],
    mistakes: [
      { bad: 'Not only it saves money…', good: 'Not only does it save money…', why: { uz: "Inversiyada söroq tartibi şart.", en: 'Inversion requires question word order.' } },
      { bad: 'Never I have seen…', good: 'Never have I seen…', why: { uz: 'Never gap boşida — inversiya.', en: 'Never at the front triggers inversion.' } }
    ],
    ielts: {
      uz: "Band 8 uçun bitta töğri inversiya, Band 6 uçun beşta xato inversiyadan qimmatroq.",
      en: 'One correct inversion is worth more than five broken ones.'
    }
  }
};
