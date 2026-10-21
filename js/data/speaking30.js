/* ==========================================================================
   SPEAK30 — Speaking Fluency, 30 kunlik trek
   --------------------------------------------------------------------------
   Kursning BIRINCHI OYIDA (1–30-kun: 21-sen → 20-okt 2026) kunlik Speaking
   bloki shu trekning savoli bilan almashtiriladi. Qolgan hamma narsa 20 haftalik
   rejaga tegmaydi.

   Maqsad — ravonlik ODATI, band ball emas: qotib qolmaslik, kam pauza,
   2–3 daqiqalik javobni bemalol bera olish.

   Har kuni 20–30 daqiqa, usul o'zgarmaydi:
     1) tayyorgarliksiz yozib ol
     2) qayta eshit — qayerda to'xtading, qotding, tarjima qilding
     3) ravonroq qayta yoz — qotish o'rniga to'ldiruvchi ibora ishlat
     4) ikkinchi variantni yozib qo'y

   Yozib olish — butun tizimning dvigateli. Uni tashlab ketsang trek ishlamaydi.
   ========================================================================== */
window.SPEAK30 = {

  meta: {
    days: 30,
    title: { uz: 'Speaking ravonligi — 30 kun', en: 'Speaking Fluency — 30 days' },
    lede: {
      uz: "Qotib qolmaslik, kam pauza va 2–3 daqiqalik javob. Bu ravonlik ODATI uchun maqsad, band ball uchun emas.",
      en: "Don't freeze, pause less, give comfortable 2–3 minute answers. A fluency-habit goal, not a band-score goal."
    },
    engine: {
      uz: "Har kuni 45 daqiqa, 3 yozuv (protokolga qara): har savolni kamida IKKI marta ayt — tayyorgarliksiz urinish → qayta eshitish → ravonroq takror. Doim yozib ol; bu butun tizimning dvigateli.",
      en: 'Every day 45 min, 3 recordings (see the protocol): say each question at least twice — a cold attempt → listen back → smoother retake. Always record yourself; that is the engine of the whole thing.'
    },
    honest: {
      uz: "30 kundan keyin kutiladigan natija: ravonroq 2–3 daqiqalik javob, kamroq qotish, avtomatik bog'lovchi iboralar — ravonlik bo'yicha \"ikkilanuvchi 6.0\" dan \"barqaror 6.5\" ga. Kutilmaydi: toza grammatika yoki umumiy Band 8 Speaking — ular ko'proq vaqt oladi.",
      en: 'Expected after 30 days: smoother 2–3 minute answers, fewer freezes, automatic transition phrases — roughly "hesitant 6.0" to "steady 6.5" in fluency specifically. Not expected: clean grammar or overall Band 8 speaking; those take longer.'
    },
    connect: {
      uz: "Birinchi oy davomida platformadagi odatiy kuningni bajar, lekin SPEAKING blokini shu trekning savoli bilan almashtir. Shunda birinchi 30 kun gapirishga qo'shimcha turtki beradi, qolgan hammasi 20 haftalik reja bo'yicha ketaveradi.",
      en: 'During the first month do your normal day on the platform, but replace the SPEAKING block with this track\'s question. That way the first 30 days give speaking extra push while everything else runs on the 20-week plan.'
    }
  },

  weeks: {
    1: {
      title: { uz: "To'xtamaslik", en: "Don't stop" },
      goal: { uz: "Bir daqiqalik Part 1 javoblari. Bu haftaning yagona maqsadi: to'xtamaslik.",
              en: "One-minute Part 1 answers. The only goal this week: don't stop." }
    },
    2: {
      title: { uz: "To'ldiruvchi iboralar", en: 'Filler phrases' },
      goal: { uz: "1.5–2 daqiqalik javoblar. Qotib qolmaslik uchun to'ldiruvchi va bog'lovchi iboralarni qo'shing.",
              en: 'Answers of 1.5–2 minutes. Build in filler and transition phrases so you never freeze.' }
    },
    3: {
      title: { uz: 'Tuzilma', en: 'Structure' },
      goal: { uz: "Ikki daqiqalik Part 2 javoblari. Tuzilma qo'shing: o'tmish, hozir, kelajak.",
              en: 'Two-minute Part 2 answers. Add structure: past, present, future.' }
    },
    4: {
      title: { uz: 'Bosim ostida ravonlik', en: 'Fluency under pressure' },
      goal: { uz: "2–3 daqiqalik Part 2 dan Part 3 ga. Bosim ostida ravonlik.",
              en: '2–3 minute Part 2 into Part 3. Smoothness under pressure.' }
    }
  },

  /* To'ldiruvchi iboralar — o'ylash uchun bir soniya beradi, qotishning oldini oladi */
  fillers: [
    { en: "That's an interesting question, let me think…", uz: "Qiziq savol, o'ylab ko'ray…" },
    { en: 'Well, it depends…', uz: "Xo'sh, bu holatga bog'liq…" },
    { en: 'To be honest…', uz: 'Rostini aytsam…' },
    { en: "I'd say that…", uz: 'Menimcha…' },
    { en: 'Let me put it this way…', uz: 'Shunday deb aytay…' }
  ],

  /* Bog'lovchilar — javobni oldinga suradi, to'xtab qolishning oldini oladi */
  transitions: [
    { en: 'On top of that…', uz: 'Bundan tashqari…' },
    { en: 'The main reason is…', uz: 'Asosiy sabab shuki…' },
    { en: 'For instance…', uz: 'Masalan…' },
    { en: 'What I mean is…', uz: 'Aytmoqchimanki…' },
    { en: 'To put it another way…', uz: 'Boshqacha aytganda…' },
    { en: 'Having said that…', uz: 'Shunga qaramay…' },
    { en: 'More importantly…', uz: 'Eng muhimi…' },
    { en: 'As a result…', uz: 'Natijada…' }
  ],

  /* Usul — har kuni bir xil */
  method: [
    { en: "Record a cold take. Just answer, don't prepare much.", uz: 'Tayyorgarliksiz yozib ol. Shunchaki javob ber.' },
    { en: 'Listen back. Mark where you paused, froze, or translated from Uzbek.', uz: "Qayta eshit. Qayerda to'xtading, qotding yoki o'zbekchadan tarjima qilding — belgila." },
    { en: 'Record again, smoother — use a filler instead of freezing.', uz: "Qayta yoz, ravonroq — qotib qolish o'rniga to'ldiruvchi ishlat." },
    { en: 'Write down your second version and keep it.', uz: 'Ikkinchi variantni yozib qo\'y va saqla.' }
  ],

  /* 30 kun */
  days: [
    { n: 1, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: "Where are you from, and what's it like there?", uz: 'Qayerdansiz va u yer qanday?' } },
    { n: 2, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: 'Do you work or study? Tell me about it.', uz: "Ishlaysizmi yoki o'qiysizmi? Bu haqda gapiring." } },
    { n: 3, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: 'What do you do in your free time?', uz: "Bo'sh vaqtingizda nima qilasiz?" } },
    { n: 4, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: 'Do you like animation movies? Why?', uz: 'Animatsion filmlarni yoqtirasizmi? Nega?' } },
    { n: 5, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: "What's your favourite food?", uz: 'Sevimli taomingiz nima?' } },
    { n: 6, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: 'Do you prefer mornings or evenings? Why?', uz: 'Ertalabni yoqtirasizmi yoki kechqurunni? Nega?' } },
    { n: 7, w: 1, part: 'Part 1', min: '~1 daq',
      q: { en: 'How often do you use your phone?', uz: 'Telefoningizni qanchalik tez-tez ishlatasiz?' } },

    { n: 8, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: 'Describe a film you watched recently. Say what it was, what it was about, who you watched it with, and how it made you feel.',
           uz: "Yaqinda ko'rgan filmingizni ta'riflang. Qaysi film edi, nima haqida edi, kim bilan ko'rdingiz va u sizni qanday his qildirdi." } },
    { n: 9, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: 'Do you like travelling? Where would you go?', uz: 'Sayohatni yoqtirasizmi? Qayerga borardingiz?' } },
    { n: 10, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: "Describe a person you admire. Say who they are, how you know them, what they're like, and why you admire them.",
           uz: "Hurmat qiladigan insoningizni ta'riflang. U kim, uni qanday tanaysiz, u qanday inson va nega uni hurmat qilasiz." } },
    { n: 11, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: "Do you have any hobbies you'd like to start?", uz: "Boshlamoqchi bo'lgan biror mashg'ulotingiz bormi?" } },
    { n: 12, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: 'Describe a memorable day. Say when it was, what happened, who you were with, and why you remember it.',
           uz: "Esda qolgan kuningizni ta'riflang. Qachon edi, nima bo'ldi, kim bilan edingiz va nega uni eslaysiz." } },
    { n: 13, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: 'Do you prefer reading or watching films?', uz: "Kitob o'qishni yoqtirasizmi yoki film ko'rishni?" } },
    { n: 14, w: 2, part: 'Part 1 → Part 2', min: '1.5–2 daq',
      q: { en: "Describe a goal you have. Say what it is, why it matters to you, what you're doing to reach it, and when you hope to achieve it.",
           uz: "Maqsadingizni ta'riflang. U nima, nega siz uchun muhim, unga erishish uchun nima qilyapsiz va qachon erishmoqchisiz." } },

    { n: 15, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: 'Describe a film you watched recently. Say what it was, what it was about, who you watched it with, and how it made you feel.',
           uz: "Yaqinda ko'rgan filmingizni ta'riflang. Qaysi film edi, nima haqida edi, kim bilan ko'rdingiz va u sizni qanday his qildirdi." } },
    { n: 16, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: "Describe a skill you want to learn. Say what it is, why you want to learn it, how you'll learn it, and how it will help you.",
           uz: "O'rganmoqchi bo'lgan ko'nikmangizni ta'riflang. U nima, nega o'rganmoqchisiz, qanday o'rganasiz va u sizga qanday yordam beradi." } },
    { n: 17, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: "Describe a person you admire. Say who they are, how you know them, what they're like, and why you admire them.",
           uz: "Hurmat qiladigan insoningizni ta'riflang. U kim, uni qanday tanaysiz, u qanday inson va nega uni hurmat qilasiz." } },
    { n: 18, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: "Describe a place you'd like to visit. Say where it is, how you know about it, what you'd do there, and why you want to go.",
           uz: "Bormoqchi bo'lgan joyingizni ta'riflang. U qayerda, u haqda qanday bilasiz, u yerda nima qilardingiz va nega bormoqchisiz." } },
    { n: 19, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: 'Describe a memorable day. Say when it was, what happened, who you were with, and why you remember it.',
           uz: "Esda qolgan kuningizni ta'riflang. Qachon edi, nima bo'ldi, kim bilan edingiz va nega uni eslaysiz." } },
    { n: 20, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: "Describe something you're good at. Say what it is, how you learned it, how often you do it, and how it makes you feel.",
           uz: "Yaxshi eplaydigan ishingizni ta'riflang. U nima, qanday o'rgandingiz, qanchalik tez-tez qilasiz va u sizni qanday his qildiradi." } },
    { n: 21, w: 3, part: 'Part 2', min: '2 daq',
      q: { en: "Describe a goal you have. Say what it is, why it matters to you, what you're doing to reach it, and when you hope to achieve it.",
           uz: "Maqsadingizni ta'riflang. U nima, nega siz uchun muhim, unga erishish uchun nima qilyapsiz va qachon erishmoqchisiz." } },

    { n: 22, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: 'Describe a film you watched recently. Say what it was, what it was about, who you watched it with, and how it made you feel.',
           uz: "Yaqinda ko'rgan filmingizni ta'riflang. Qaysi film edi, nima haqida edi, kim bilan ko'rdingiz va u sizni qanday his qildirdi." },
      p3: { en: 'Do you think films can teach people important lessons? Why?', uz: "Filmlar insonlarga muhim saboqlar bera oladi deb o'ylaysizmi? Nega?" } },
    { n: 23, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe a skill you want to learn. Say what it is, why you want to learn it, how you'll learn it, and how it will help you.",
           uz: "O'rganmoqchi bo'lgan ko'nikmangizni ta'riflang. U nima, nega o'rganmoqchisiz, qanday o'rganasiz va u sizga qanday yordam beradi." },
      p3: { en: 'Should schools focus more on practical skills or academic knowledge?', uz: "Maktablar amaliy ko'nikmalargami yoki akademik bilimgami ko'proq e'tibor berishi kerak?" } },
    { n: 24, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe a person you admire. Say who they are, how you know them, what they're like, and why you admire them.",
           uz: "Hurmat qiladigan insoningizni ta'riflang. U kim, uni qanday tanaysiz, u qanday inson va nega uni hurmat qilasiz." },
      p3: { en: 'Why do some people become role models for others?', uz: "Nega ba'zi odamlar boshqalar uchun namuna bo'lib qoladi?" } },
    { n: 25, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe a place you'd like to visit. Say where it is, how you know about it, what you'd do there, and why you want to go.",
           uz: "Bormoqchi bo'lgan joyingizni ta'riflang. U qayerda, u haqda qanday bilasiz, u yerda nima qilardingiz va nega bormoqchisiz." },
      p3: { en: 'How has travel changed compared to the past?', uz: "Sayohat o'tmishga nisbatan qanday o'zgardi?" } },
    { n: 26, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: 'Describe a memorable day. Say when it was, what happened, who you were with, and why you remember it.',
           uz: "Esda qolgan kuningizni ta'riflang. Qachon edi, nima bo'ldi, kim bilan edingiz va nega uni eslaysiz." },
      p3: { en: 'Do people remember happy events or difficult events more clearly? Why?', uz: "Odamlar quvonchli voqealarni ko'proq eslaydimi yoki og'ir voqealarnimi? Nega?" } },
    { n: 27, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe something you're good at. Say what it is, how you learned it, how often you do it, and how it makes you feel.",
           uz: "Yaxshi eplaydigan ishingizni ta'riflang. U nima, qanday o'rgandingiz, qanchalik tez-tez qilasiz va u sizni qanday his qildiradi." },
      p3: { en: 'Is natural talent or hard work more important for success?', uz: "Muvaffaqiyat uchun tug'ma iste'dodmi yoki mehnatmi muhimroq?" } },
    { n: 28, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe a goal you have. Say what it is, why it matters to you, what you're doing to reach it, and when you hope to achieve it.",
           uz: "Maqsadingizni ta'riflang. U nima, nega siz uchun muhim, unga erishish uchun nima qilyapsiz va qachon erishmoqchisiz." },
      p3: { en: 'Why do some people achieve their goals and others give up?', uz: "Nega ba'zilar maqsadiga erishadi, boshqalari esa taslim bo'ladi?" } },
    { n: 29, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: "Describe your favourite piece of technology. Say what it is, what you use it for, how often, and why it's important to you.",
           uz: "Sevimli texnologik qurilmangizni ta'riflang. U nima, nima uchun ishlatasiz, qanchalik tez-tez va nega u siz uchun muhim." },
      p3: { en: 'How has technology changed the way people communicate?', uz: "Texnologiya odamlarning muloqot qilish usulini qanday o'zgartirdi?" } },
    { n: 30, w: 4, part: 'Part 2 + Part 3', min: '2–3 daq',
      q: { en: 'Describe a book or article you found interesting. Say what it was, what it was about, why you read it, and what you learned.',
           uz: "Qiziqarli topgan kitob yoki maqolangizni ta'riflang. U nima edi, nima haqida edi, nega o'qidingiz va nimani o'rgandingiz." },
      p3: { en: 'Do people read less now than in the past? Why?', uz: "Odamlar hozir o'tmishdagiga qaraganda kamroq o'qishadimi? Nega?" } }
  ],

  /* ======================================================================
     KUNLIK FARQ — har kun o'ziga xos
     ----------------------------------------------------------------------
     Savol takrorlanadi (film: 8, 15, 22-kun) — bu ataylab, spiral. Lekin
     kunning ISHI takrorlanmaydi:
       tech    — bugungi bitta texnika (faqat shu bilan ishlanadi)
       chunks  — bugungi savolga mos 5 tayyor ibora (o'zbekcha izoh bilan)
       drill   — 3 daqiqalik isitish mashqi, savoldan oldin
       f / t   — bugun DIQQAT qilinadigan to'ldiruvchi va bog'lovchilar
                 (indekslar: fillers[] va transitions[] dan). Hammasini
                 ko'rsatish emas — kuniga 2 ta filler, 3 ta bog'lovchi
                 yodda qoladi, 13 tasi qolmaydi.
     ====================================================================== */
  daily: {
    1:  { f: [0, 3], t: [2, 0, 1],
          tech:  { en: 'Answer + one reason. Every sentence you say gets a "because".', uz: 'Javob + bitta sabab. Har gapingga "because" qo\'sh.' },
          drill: { en: 'Say 10 sentences about your city, each starting "In my city…". No stopping between them.', uz: 'Shahring haqida 10 ta gap, har biri "In my city…" bilan. Orada to\'xtama.' },
          chunks: [
            { en: "I was born and raised in…", uz: "…da tug'ilib o'sganman" },
            { en: "It's a fairly large / small city with…", uz: "Bu ancha katta / kichik shahar, …" },
            { en: "What I love about it is…", uz: "Unda menga yoqadigani —" },
            { en: "The downside is that…", uz: "Kamchiligi shundaki, …" },
            { en: "It's known for its…", uz: "U … bilan mashhur" } ] },
    2:  { f: [1, 2], t: [1, 2, 3],
          tech:  { en: 'Past → present: one sentence about how it started, then what you do now.', uz: "O'tmish → hozir: qanday boshlangani haqida bir gap, keyin hozir nima qilayotganing." },
          drill: { en: '60-second shadowing: play any English clip, repeat half a second behind the speaker.', uz: "60 soniya shadowing: istalgan inglizcha klipni qo'y, notiqdan yarim soniya orqada takrorla." },
          chunks: [
            { en: "I'm currently studying / working as…", uz: "Hozir … o'qiyapman / … bo'lib ishlayapman" },
            { en: "I got into it because…", uz: "Bunga … sababli kirib qolganman" },
            { en: "A typical day involves…", uz: "Oddiy kunim … dan iborat" },
            { en: "The most challenging part is…", uz: "Eng qiyin tomoni —" },
            { en: "In the long run, I'm hoping to…", uz: "Uzoq muddatda … ni umid qilaman" } ] },
    3:  { f: [3, 4], t: [2, 0, 6],
          tech:  { en: 'Three things, not one. List three activities and say one sentence about each.', uz: "Bitta emas, uchta. Uchta mashg'ulotni ayt va har biri haqida bir gap." },
          drill: { en: 'Name 15 hobbies out loud in 30 seconds. Then pick three and add "which I do on…".', uz: "30 soniyada ovoz chiqarib 15 ta hobbi ayt. Keyin uchtasini tanlab \"which I do on…\" qo'sh." },
          chunks: [
            { en: "I'm really into…", uz: "… ga juda qiziqaman" },
            { en: "Whenever I get the chance, I…", uz: "Imkon bo'lsa darrov …" },
            { en: "It helps me switch off after…", uz: "…dan keyin u meni dam oldiradi" },
            { en: "I've been doing it since…", uz: "Buni … dan beri qilaman" },
            { en: "Lately I've been trying to…", uz: "So'nggi paytlarda … ga harakat qilyapman" } ] },
    4:  { f: [1, 0], t: [3, 4, 5],
          tech:  { en: 'Opinion + contrast: "I like X, although…". One "although" makes you sound natural.', uz: "Fikr + qarama-qarshilik: \"I like X, although…\". Bitta \"although\" tabiiy qiladi." },
          drill: { en: 'Say 8 opinions in a row using "I\'d say… although…". Topic: films, food, weather, phones.', uz: "Ketma-ket 8 ta fikr: \"I'd say… although…\". Mavzu: film, taom, ob-havo, telefon." },
          chunks: [
            { en: "I'm a big fan of…", uz: "… ning katta muxlisiman" },
            { en: "They tend to be…", uz: "Ular odatda … bo'ladi" },
            { en: "What appeals to me is…", uz: "Menga jozibali tomoni —" },
            { en: "Although some people find them…", uz: "Garchi ba'zilar ularni … deb topsa ham" },
            { en: "One that really stuck with me was…", uz: "Yodimda qolgani —" } ] },
    5:  { f: [2, 3], t: [2, 6, 7],
          tech:  { en: 'Senses. Describe taste, smell and texture — three adjectives per dish.', uz: "Sezgilar. Ta'mi, hidi, yumshoq-qattiqligi — har taomga uchta sifat." },
          drill: { en: 'Describe what you ate today in 45 seconds without saying "delicious" or "good".', uz: "Bugun yeganingni 45 soniyada ta'rifla — \"delicious\" va \"good\" so'zlarisiz." },
          chunks: [
            { en: "Hands down, my favourite is…", uz: "Shubhasiz, eng sevimlim —" },
            { en: "It's a traditional dish made with…", uz: "Bu … dan tayyorlanadigan an'anaviy taom" },
            { en: "It's rich / light / spicy / savoury…", uz: "U to'yimli / yengil / achchiq / sho'r…" },
            { en: "My mum makes the best version of it.", uz: "Eng zo'rini onam tayyorlaydi." },
            { en: "I could eat it every single day.", uz: "Har kuni yesam ham zerikmayman." } ] },
    6:  { f: [1, 4], t: [1, 5, 7],
          tech:  { en: 'Compare, then decide. Say one thing for each side before choosing.', uz: "Taqqosla, keyin qaror qil. Tanlashdan oldin har tomon uchun bir gap." },
          drill: { en: 'Compare 6 pairs in 60 seconds: tea/coffee, summer/winter, city/village… "X is…, whereas Y is…".', uz: "60 soniyada 6 juftni taqqosla: choy/qahva, yoz/qish, shahar/qishloq… \"X is…, whereas Y is…\"." },
          chunks: [
            { en: "I'm definitely more of a morning person.", uz: "Men aniq ertalabchiman." },
            { en: "Mornings are when I'm most productive.", uz: "Ertalab eng samarali vaqtim." },
            { en: "Evenings, on the other hand, are for…", uz: "Kechqurun esa … uchun" },
            { en: "It probably comes down to…", uz: "Bu, ehtimol, … ga borib taqaladi" },
            { en: "That said, it depends on the day.", uz: "Shunga qaramay, kunga bog'liq." } ] },
    7:  { f: [0, 2], t: [0, 2, 7],
          tech:  { en: 'Honest + specific. Numbers and names: "about four hours", "mostly Telegram".', uz: "Halol + aniq. Raqam va nom: \"about four hours\", \"mostly Telegram\"." },
          drill: { en: 'Week 1 review: re-record day 1\'s question. Compare with the first take. Count the pauses.', uz: "1-hafta yakuni: 1-kun savolini qayta yoz. Birinchi urinish bilan solishtir. Pauzalarni sana." },
          chunks: [
            { en: "Probably more than I should, to be honest.", uz: "Rostini aytsam, kerakidan ko'proq." },
            { en: "I'd estimate around … hours a day.", uz: "Taxminan kuniga … soat." },
            { en: "Mostly for…, but also…", uz: "Asosan … uchun, lekin … uchun ham" },
            { en: "I've been trying to cut down by…", uz: "… orqali kamaytirishga harakat qilyapman" },
            { en: "It's become second nature.", uz: "U odatga aylanib ketgan." } ] },

    8:  { f: [0, 3], t: [2, 3, 0],
          tech:  { en: 'The 4-point skeleton. Cover all four bullets in order — 20 seconds each. Do not skip one.', uz: "4 nuqtali skelet. To'rtala bandni tartib bilan — har biriga 20 soniya. Birortasini tashlab ketma." },
          drill: { en: 'Pick any object in the room. Talk about it for 90 seconds: what, where from, how used, why it matters.', uz: "Xonadagi istalgan narsani ol. 90 soniya gapir: nima, qayerdan, qanday ishlatiladi, nega muhim." },
          chunks: [
            { en: "The film I'd like to talk about is…", uz: "Gapirmoqchi bo'lgan filmim —" },
            { en: "It's basically about…", uz: "Asosan u … haqida" },
            { en: "I ended up watching it with…", uz: "Uni … bilan ko'rib qoldim" },
            { en: "What struck me most was…", uz: "Meni eng hayratga solgani —" },
            { en: "By the end I felt…", uz: "Oxirida o'zimni … his qildim" } ] },
    9:  { f: [1, 4], t: [1, 2, 6],
          tech:  { en: 'Hypothetical: "If I could, I\'d…". Practise would/could until it comes without thinking.', uz: "Faraz: \"If I could, I'd…\". would/could o'ylamasdan chiqguncha mashq qil." },
          drill: { en: '"If I had a free week, I\'d…" — 10 different endings, no repeats, 60 seconds.', uz: "\"If I had a free week, I'd…\" — 10 xil davom, takrorsiz, 60 soniya." },
          chunks: [
            { en: "I'm a keen traveller, though I don't get to go as often as I'd like.", uz: "Sayohatni yaxshi ko'raman, lekin xohlagancha bora olmayman." },
            { en: "Top of my list would be…", uz: "Ro'yxatimning boshida … turadi" },
            { en: "Partly because of…, and partly because…", uz: "Qisman … uchun, qisman … uchun" },
            { en: "I'd spend most of the time…", uz: "Vaqtning ko'pini … bilan o'tkazardim" },
            { en: "It's been on my bucket list for years.", uz: "Bu yillar davomida orzuim." } ] },
    10: { f: [2, 3], t: [1, 3, 6],
          tech:  { en: 'Show, don\'t tell. Instead of "she is kind", give one 10-second story that proves it.', uz: "Ayt emas, ko'rsat. \"She is kind\" o'rniga buni isbotlovchi 10 soniyalik bitta voqea." },
          drill: { en: 'Describe 3 family members with one mini-story each. 30 seconds per person.', uz: "3 ta oila a'zosini har biriga bitta mini-voqea bilan ta'rifla. Har kishiga 30 soniya." },
          chunks: [
            { en: "Someone I really look up to is…", uz: "Men chin dildan hurmat qiladigan inson —" },
            { en: "We first met when…", uz: "Birinchi marta … da tanishganmiz" },
            { en: "What sets them apart is…", uz: "Uni boshqalardan ajratib turadigani —" },
            { en: "I remember once, they…", uz: "Bir safar u … qilgani esimda" },
            { en: "That's the kind of person I want to be.", uz: "Men shunday inson bo'lishni xohlayman." } ] },
    11: { f: [0, 1], t: [0, 2, 5],
          tech:  { en: 'Buy time without silence. Use a filler, then ANSWER — the filler is a bridge, not a hiding place.', uz: "Jimliksiz vaqt yut. Filler ayt, keyin JAVOB BER — filler ko'prik, yashirinish joyi emas." },
          drill: { en: 'Ask yourself 6 random questions (write them first). Answer each starting with a different filler.', uz: "O'zingga 6 ta tasodifiy savol ber (oldin yozib ol). Har biriga boshqa filler bilan boshlab javob ber." },
          chunks: [
            { en: "There's one thing I've been meaning to try…", uz: "Bir narsani sinab ko'rmoqchi bo'lib yuribman…" },
            { en: "I've never got round to it because…", uz: "Unga hech navbat kelmadi, chunki…" },
            { en: "What puts me off is…", uz: "Meni to'xtatib turgan narsa —" },
            { en: "I think it would suit me because…", uz: "Menimcha bu menga mos, chunki…" },
            { en: "Ideally, I'd start by…", uz: "Ideal holda … dan boshlardim" } ] },
    12: { f: [3, 4], t: [4, 7, 2],
          tech:  { en: 'Narrative tenses. Past simple for events, past continuous for the background: "I was walking when…".', uz: "Hikoya zamonlari. Voqea — past simple, fon — past continuous: \"I was walking when…\"." },
          drill: { en: 'Tell yesterday in 60 seconds. Every third sentence must use "was/were …ing".', uz: "Kechani 60 soniyada aytib ber. Har uchinchi gapda \"was/were …ing\" bo'lsin." },
          chunks: [
            { en: "It was a couple of years ago, when…", uz: "Bu bir necha yil oldin, … paytda edi" },
            { en: "We were just about to … when…", uz: "Endi … qilmoqchi edik, shunda…" },
            { en: "Out of nowhere,…", uz: "Kutilmaganda…" },
            { en: "Looking back, what made it special was…", uz: "Orqaga qarasam, uni o'zgacha qilgan narsa —" },
            { en: "I still think about it now and then.", uz: "Hozir ham gohida eslayman." } ] },
    13: { f: [1, 2], t: [5, 1, 6],
          tech:  { en: 'Concede then counter: "Films are more relaxing, but reading…". Two sides = longer, richer answer.', uz: "Tan ol, keyin qarshi chiq: \"Films are more relaxing, but reading…\". Ikki tomon = uzunroq, boyroq javob." },
          drill: { en: '"Some people say…, but I think…" — 8 topics, 90 seconds.', uz: "\"Some people say…, but I think…\" — 8 ta mavzu, 90 soniya." },
          chunks: [
            { en: "It's a tough call, but…", uz: "Qiyin tanlov, lekin…" },
            { en: "Reading lets you…, whereas films…", uz: "O'qish … imkonini beradi, filmlar esa…" },
            { en: "I'll admit that…", uz: "Tan olaman, …" },
            { en: "At the end of the day, I lean towards…", uz: "Oxir-oqibat … tomonga og'aman" },
            { en: "It depends on my mood, really.", uz: "Aslida kayfiyatimga bog'liq." } ] },
    14: { f: [0, 4], t: [1, 7, 6],
          tech:  { en: 'Future forms. "I\'m planning to…", "I\'m going to…", "By next year I will have…". Mix all three.', uz: "Kelasi zamon shakllari. \"I'm planning to…\", \"I'm going to…\", \"By next year I will have…\". Uchalasini aralashtir." },
          drill: { en: 'Week 2 review: re-record day 8. Time it — is it over 90 seconds now?', uz: "2-hafta yakuni: 8-kunni qayta yoz. Vaqtni o'lcha — endi 90 soniyadan oshdimi?" },
          chunks: [
            { en: "My main goal at the moment is…", uz: "Hozirgi asosiy maqsadim —" },
            { en: "It matters to me because…", uz: "Bu men uchun muhim, chunki…" },
            { en: "I've already started by…", uz: "… bilan allaqachon boshlaganman" },
            { en: "The plan is to … by…", uz: "Reja — … gacha …" },
            { en: "If everything goes to plan, I'll have… by…", uz: "Hammasi reja bo'yicha ketsa, … gacha … bo'laman" } ] },

    15: { f: [2, 3], t: [0, 1, 2],
          tech:  { en: 'Past / present / future in ONE answer. Even a film: when you watched it, what you think now, whether you\'d rewatch.', uz: "Bitta javobda o'tmish / hozir / kelajak. Hatto film ham: qachon ko'rding, hozir nima deb o'ylaysan, qayta ko'rarmiding." },
          drill: { en: 'Any topic, 3 sentences: one past, one present, one future. Do 5 topics without stopping.', uz: "Istalgan mavzu, 3 gap: o'tmish, hozir, kelajak. 5 mavzuni to'xtamasdan." },
          chunks: [
            { en: "I first came across it when…", uz: "Unga birinchi marta … da duch kelganman" },
            { en: "Thinking about it now,…", uz: "Hozir o'ylab qarasam,…" },
            { en: "I'd happily watch it again because…", uz: "Bemalol qayta ko'rardim, chunki…" },
            { en: "It changed the way I…", uz: "U mening … qilishimni o'zgartirdi" },
            { en: "I'd recommend it to anyone who…", uz: "… bo'lganlarga tavsiya qilardim" } ] },
    16: { f: [1, 4], t: [1, 2, 3],
          tech:  { en: 'Explain the "how" in steps: first, then, after that. Sequencing words stop you rambling.', uz: "\"Qanday\"ni bosqichlab tushuntir: first, then, after that. Tartib so'zlari chalkashishdan saqlaydi." },
          drill: { en: 'Explain how to make tea in 5 steps, then how to get to your LC in 5 steps. Use "first / then / finally".', uz: "Choy damlashni 5 bosqichda, keyin LC ga borishni 5 bosqichda tushuntir. \"first / then / finally\" bilan." },
          chunks: [
            { en: "A skill I've always wanted to pick up is…", uz: "Doim o'rganmoqchi bo'lgan ko'nikmam —" },
            { en: "I'd start with the basics, like…", uz: "Asoslardan boshlardim, masalan…" },
            { en: "After that, I'd move on to…", uz: "Shundan keyin … ga o'tardim" },
            { en: "The biggest hurdle would probably be…", uz: "Eng katta to'siq, ehtimol, …" },
            { en: "It would open doors to…", uz: "U … uchun eshik ochardi" } ] },
    17: { f: [0, 2], t: [6, 3, 7],
          tech:  { en: 'Adjective upgrade. Ban "good / nice / kind". Use: generous, determined, down-to-earth, easy-going, sharp.', uz: "Sifatni yuksaltir. \"good / nice / kind\" taqiq. Ishlat: generous, determined, down-to-earth, easy-going, sharp." },
          drill: { en: 'Describe 5 people you know with 2 strong adjectives each + one reason. No banned words.', uz: "5 ta tanishingni har biriga 2 kuchli sifat + bir sabab bilan ta'rifla. Taqiqlangan so'zlarsiz." },
          chunks: [
            { en: "They're incredibly down-to-earth, despite…", uz: "U … ga qaramay juda oddiy inson" },
            { en: "What I admire is their determination to…", uz: "Uning … ga bo'lgan qat'iyati meni hayratga soladi" },
            { en: "They've had a huge influence on…", uz: "U … ga ulkan ta'sir ko'rsatgan" },
            { en: "Unlike most people, they…", uz: "Ko'pchilikdan farqli, u…" },
            { en: "I owe a lot to them.", uz: "Undan ko'p narsa uchun qarzdorman." } ] },
    18: { f: [3, 4], t: [2, 0, 4],
          tech:  { en: 'Paint the place. Where it is, what you see, what you hear, what you\'d do — 2 sentences per sense.', uz: "Joyni chiz. Qayerda, nima ko'rinadi, nima eshitiladi, nima qilarding — har sezgiga 2 gap." },
          drill: { en: 'Describe the view from your window for 60 seconds. Then the same view at night.', uz: "Derazangdan ko'rinishni 60 soniya ta'rifla. Keyin o'sha ko'rinish tunda." },
          chunks: [
            { en: "It's located in…, right by…", uz: "U … da, … yonida joylashgan" },
            { en: "I came across it through…", uz: "Unga … orqali duch kelganman" },
            { en: "I picture myself…", uz: "O'zimni … deb tasavvur qilaman" },
            { en: "What draws me there is…", uz: "Meni u yerga tortadigani —" },
            { en: "It's the kind of place where…", uz: "Bu shunday joyki, u yerda…" } ] },
    19: { f: [1, 2], t: [4, 5, 7],
          tech:  { en: 'Emotion words at three levels: mild / strong / extreme. "pleased → thrilled → over the moon".', uz: "Hissiyot so'zlari uch darajada: yengil / kuchli / o'ta. \"pleased → thrilled → over the moon\"." },
          drill: { en: 'Tell the same 30-second story three times: first calm, then excited, then as if to a child.', uz: "Bitta 30 soniyalik voqeani uch marta ayt: xotirjam, keyin hayajonli, keyin bolaga aytgandek." },
          chunks: [
            { en: "One day that stands out is…", uz: "Ajralib turadigan bir kun —" },
            { en: "I was over the moon when…", uz: "… paytda quvonchdan boshim osmonga yetdi" },
            { en: "There was this moment where…", uz: "Shunday bir lahza bo'ldiki,…" },
            { en: "It meant a lot because…", uz: "Bu ko'p narsani anglatardi, chunki…" },
            { en: "Even now, it brings a smile to my face.", uz: "Hozir ham eslasam kulib qo'yaman." } ] },
    20: { f: [0, 4], t: [1, 3, 6],
          tech:  { en: 'Modesty + evidence. "I wouldn\'t call myself an expert, but…" then one concrete proof.', uz: "Kamtarlik + dalil. \"I wouldn't call myself an expert, but…\" keyin bitta aniq isbot." },
          drill: { en: 'List 5 things you\'re decent at. For each: how you learned it in one sentence.', uz: "Yaxshi eplaydigan 5 narsani sana. Har biriga bir gapda qanday o'rganganingni ayt." },
          chunks: [
            { en: "I wouldn't call myself an expert, but I'm fairly good at…", uz: "O'zimni mutaxassis demayman, lekin … ni yaxshi eplayman" },
            { en: "I picked it up by…", uz: "Buni … orqali o'rganganman" },
            { en: "It took me a good … to get comfortable.", uz: "O'rganib ketishim … vaqt oldi" },
            { en: "These days I do it…", uz: "Hozir buni … qilaman" },
            { en: "It gives me a real sense of…", uz: "U menga haqiqiy … hissini beradi" } ] },
    21: { f: [2, 3], t: [0, 2, 7],
          tech:  { en: 'Signpost the end: "So, to sum up…". A closing sentence makes 2 minutes sound finished, not cut off.', uz: "Oxirini belgila: \"So, to sum up…\". Yakunlovchi gap 2 daqiqani uzilgan emas, tugallangan qiladi." },
          drill: { en: 'Week 3 review: re-record day 15 with a proper opening AND closing sentence. Time it: 2 minutes?', uz: "3-hafta yakuni: 15-kunni to'g'ri ochilish VA yopilish gapi bilan qayta yoz. Vaqt: 2 daqiqami?" },
          chunks: [
            { en: "The goal I'm working towards is…", uz: "Intilayotgan maqsadim —" },
            { en: "It's not just about…, it's about…", uz: "Gap faqat … da emas, … da" },
            { en: "So far, I've managed to…", uz: "Hozirgacha … ga erishdim" },
            { en: "There's still a long way to go, but…", uz: "Hali yo'l uzoq, lekin…" },
            { en: "So, to sum up,…", uz: "Xullas, xulosa qilib aytganda,…" } ] },

    22: { f: [0, 1], t: [1, 2, 5],
          tech:  { en: 'Part 3 = opinion + reason + example, in 3 sentences. Then one more sentence: the other side.', uz: "Part 3 = fikr + sabab + misol, 3 gapda. Keyin yana bir gap: boshqa tomon." },
          drill: { en: 'Answer 5 "Do you think…?" questions in exactly 4 sentences each. Count on your fingers.', uz: "5 ta \"Do you think…?\" savoliga aynan 4 gapdan javob ber. Barmoqda sana." },
          chunks: [
            { en: "Absolutely, I think they can, because…", uz: "Albatta, menimcha bera oladi, chunki…" },
            { en: "A good example would be…", uz: "Yaxshi misol —" },
            { en: "Having said that, not every film…", uz: "Shunga qaramay, har film ham…" },
            { en: "It really depends on how…", uz: "Bu haqiqatan … ga bog'liq" },
            { en: "Overall, I'd say the impact is…", uz: "Umuman, ta'siri … deb aytardim" } ] },
    23: { f: [3, 4], t: [3, 4, 6],
          tech:  { en: 'Generalise: "Most people…", "Generally speaking…", "In many countries…". Part 3 is about society, not you.', uz: "Umumlashtir: \"Most people…\", \"Generally speaking…\", \"In many countries…\". Part 3 — jamiyat haqida, sen haqingda emas." },
          drill: { en: 'Turn 6 personal statements into general ones: "I like tea" → "Tea is popular among…". 60 seconds.', uz: "6 ta shaxsiy gapni umumiyga aylantir: \"I like tea\" → \"Tea is popular among…\". 60 soniya." },
          chunks: [
            { en: "Generally speaking, schools tend to…", uz: "Umuman olganda, maktablar odatda…" },
            { en: "There's a strong argument for…", uz: "… uchun kuchli dalil bor" },
            { en: "In practice, though,…", uz: "Amalda esa…" },
            { en: "A balance between the two would…", uz: "Ikkalasi o'rtasidagi muvozanat…" },
            { en: "Ultimately, it comes down to…", uz: "Oxir-oqibat, bu … ga borib taqaladi" } ] },
    24: { f: [1, 2], t: [1, 6, 7],
          tech:  { en: 'Cause and effect chains: "Because X, Y happens, which leads to Z." Three links, one breath.', uz: "Sabab-oqibat zanjiri: \"Because X, Y happens, which leads to Z.\" Uch bo'g'in, bir nafas." },
          drill: { en: 'Build 5 three-link chains: social media → less sleep → …; cheap flights → …', uz: "5 ta uch bo'g'inli zanjir tuz: social media → less sleep → …; cheap flights → …" },
          chunks: [
            { en: "People become role models when…", uz: "Odamlar … paytda namunaga aylanadi" },
            { en: "This is largely because…", uz: "Bu asosan … sababli" },
            { en: "…which in turn leads to…", uz: "…bu esa o'z navbatida … ga olib keladi" },
            { en: "The flip side is that…", uz: "Boshqa tomoni shundaki…" },
            { en: "As a result, many young people…", uz: "Natijada ko'p yoshlar…" } ] },
    25: { f: [0, 3], t: [5, 4, 2],
          tech:  { en: 'Then vs now. "In the past, … whereas nowadays …". One sentence each, then the reason for the change.', uz: "O'shanda va hozir. \"In the past, … whereas nowadays …\". Har biriga bir gap, keyin o'zgarish sababi." },
          drill: { en: 'Compare 6 things then/now in 90 seconds: shopping, music, news, travel, school, phones.', uz: "6 narsani o'shanda/hozir taqqosla, 90 soniya: xarid, musiqa, yangilik, sayohat, maktab, telefon." },
          chunks: [
            { en: "Travel used to be…, whereas nowadays…", uz: "Ilgari sayohat … edi, hozir esa…" },
            { en: "The biggest shift has been…", uz: "Eng katta o'zgarish —" },
            { en: "Thanks to…, people can now…", uz: "… tufayli odamlar endi … qila oladi" },
            { en: "On the downside,…", uz: "Salbiy tomoni,…" },
            { en: "I suspect in the future…", uz: "Kelajakda … deb taxmin qilaman" } ] },
    26: { f: [2, 4], t: [0, 3, 7],
          tech:  { en: 'Answer the question you were asked, not the one you prepared. Repeat a key word from the question in your first sentence.', uz: "Tayyorlagan emas, so'ralgan savolga javob ber. Birinchi gapingda savoldan bitta kalit so'zni takrorla." },
          drill: { en: 'Have someone (or a voice app) ask you 6 unexpected questions. First sentence must echo the question.', uz: "Kimdir (yoki ovoz ilovasi) 6 ta kutilmagan savol bersin. Birinchi gap savolni aks ettirsin." },
          chunks: [
            { en: "Whether people remember happy or difficult events more — I'd say…", uz: "Quvonchli yoki og'ir voqeani ko'proq eslaydimi — menimcha…" },
            { en: "From my own experience,…", uz: "O'z tajribamdan,…" },
            { en: "Psychologically, I think…", uz: "Psixologik jihatdan, menimcha…" },
            { en: "What tends to stick is…", uz: "Odatda yodda qoladigani —" },
            { en: "So it's not either-or, really.", uz: "Ya'ni bu \"yoki-yoki\" emas." } ] },
    27: { f: [1, 3], t: [1, 5, 6],
          tech:  { en: 'Under pressure: if you lose the thread, say "Where was I… right," and continue. Recovering is a skill.', uz: "Bosim ostida: fikr uzilsa \"Where was I… right,\" deb davom et. Tiklanish — ko'nikma." },
          drill: { en: 'Record a 2-minute answer while a timer beeps every 20 seconds. Do not stop at the beeps.', uz: "Taymer har 20 soniyada chalinib tursin, 2 daqiqa javob yoz. Chalinganda to'xtama." },
          chunks: [
            { en: "Talent gets you started, but…", uz: "Iste'dod boshlab beradi, lekin…" },
            { en: "Take … for example —", uz: "Masalan, … ni oling —" },
            { en: "Without consistent effort,…", uz: "Doimiy mehnatsiz…" },
            { en: "Where was I… right, so…", uz: "Qayerda edim… ha, demak…" },
            { en: "If I had to choose, I'd put my money on…", uz: "Tanlashim kerak bo'lsa, … ga tikardim" } ] },
    28: { f: [0, 4], t: [2, 4, 7],
          tech:  { en: 'Precision: replace "things / stuff / people" with the exact word. "obstacles", "distractions", "beginners".', uz: "Aniqlik: \"things / stuff / people\" o'rniga aniq so'z. \"obstacles\", \"distractions\", \"beginners\"." },
          drill: { en: 'Week 4 review: re-record day 22 and hunt for "thing" — replace every one. Then record again.', uz: "4-hafta yakuni: 22-kunni qayta yoz va \"thing\" so'zini ov qil — har birini almashtir. Yana yoz." },
          chunks: [
            { en: "The ones who succeed tend to…", uz: "Erishadiganlar odatda…" },
            { en: "Setbacks are inevitable, but…", uz: "Muvaffaqiyatsizliklar muqarrar, lekin…" },
            { en: "Those who give up often lack…", uz: "Taslim bo'ladiganlarda ko'pincha … yetishmaydi" },
            { en: "Breaking a goal into milestones…", uz: "Maqsadni bosqichlarga bo'lish…" },
            { en: "In my case, what keeps me going is…", uz: "Mening holatimda meni yurgizadigan —" } ] },
    29: { f: [2, 3], t: [3, 6, 7],
          tech:  { en: 'Speed control. Slow down on the important sentence, speed up on the example. Monotone = boring.', uz: "Tezlikni boshqar. Muhim gapda sekinlash, misolda tezlash. Bir ohang = zerikarli." },
          drill: { en: 'Read any paragraph aloud twice: once flat, once with a deliberately slow key sentence.', uz: "Istalgan abzatsni ikki marta ovoz chiqarib o'qi: bir marta tekis, bir marta ataylab sekin kalit gap bilan." },
          chunks: [
            { en: "The device I couldn't live without is…", uz: "Usiz yashay olmaydigan qurilmam —" },
            { en: "I rely on it for everything from … to …", uz: "… dan … gacha hamma narsada unga tayanaman" },
            { en: "It's transformed how we…", uz: "U bizning … qilishimizni butunlay o'zgartirdi" },
            { en: "We're more connected, yet…", uz: "Biz ko'proq bog'langanmiz, lekin…" },
            { en: "Face-to-face conversation has become…", uz: "Yuzma-yuz suhbat … bo'lib qoldi" } ] },
    30: { f: [0, 1], t: [0, 1, 6],
          tech:  { en: 'Final: full mock. Part 1 (3 questions) + Part 2 (2 min) + Part 3 (2 questions). Record all 8 minutes. Listen to day 1 afterwards.', uz: "Yakun: to'liq mock. Part 1 (3 savol) + Part 2 (2 daq) + Part 3 (2 savol). Barcha 8 daqiqani yoz. Keyin 1-kunni eshit." },
          drill: { en: 'No warm-up today — walk in cold, like the real exam.', uz: "Bugun isitish yo'q — haqiqiy imtihondagidek sovuq kir." },
          chunks: [
            { en: "Something I read recently that stuck with me was…", uz: "Yaqinda o'qigan va yodimda qolgan narsa —" },
            { en: "It explores the idea that…", uz: "U … degan g'oyani ochib beradi" },
            { en: "I picked it up because…", uz: "Uni … sababli o'qidim" },
            { en: "The main takeaway for me was…", uz: "Men uchun asosiy xulosa —" },
            { en: "There's some truth to that, but…", uz: "Bunda haqiqat bor, lekin…" } ] }
  }
};

/* ==========================================================================
   FLUENCY PROTOKOLI — o'lchanadigan ravonlik (100% kafolat yo'q, lekin
   o'lchov bor: nima o'lchansa, o'sha o'sadi)
   --------------------------------------------------------------------------
   Har kuni 3 ta yozuv (45 daqiqa) + har yakshanba 3 daqiqalik o'lchov testi.
   Haftalik maqsadlar WPM (so'z/daqiqa) va 2 soniyadan uzun pauzalar soni.
   Tabiiy ingliz nutqi — 120–150 WPM; IELTS 7+ fluency uchun 110–130 yetadi.
   ========================================================================== */
(function () {
  var S = window.SPEAK30;
  if (!S) return;

  S.protocol = {
    minutes: 45,
    rounds: [
      { n: 1, min: 10, t: { uz: 'Sovuq urinish', en: 'Cold take' },
        d: { uz: "Savolni o'qi, 10 soniya o'yla, 2 daqiqa TO'XTAMASDAN gapir va yozib ol. Qotsang — to'ldiruvchi ibora, keyin davom et. Bu yozuv 'haqiqiy' darajang.", en: 'Read the question, think 10 seconds, speak for 2 minutes WITHOUT stopping and record. If you freeze — filler phrase, then continue. This take is your real level.' } },
      { n: 2, min: 15, t: { uz: 'Tahlil + qayta yozuv', en: 'Analyse + retake' },
        d: { uz: "Qayta eshit: 2 soniyadan uzun pauzalarni sana, tarjima qilgan joylarni belgila, so'zlarni sana (WPM = so'z ÷ daqiqa). Kunning texnikasi va iboralarini qo'shib QAYTA yoz. Ikkinchi variant matnini intizom sahifasiga saqla.", en: 'Listen back: count pauses over 2 seconds, mark where you translated, count words (WPM = words ÷ minutes). Retake with the day\'s technique and chunks. Save the second take on the habit page.' } },
      { n: 3, min: 20, t: { uz: 'Shadowing + Part 3', en: 'Shadowing + Part 3' },
        d: { uz: "10 daqiqa shadowing: BBC 6 Minute English (Kurslar → BBC) bo'lagini 0.5 soniya orqasidan bir vaqtda takrorla — ritm va intonatsiya. Keyin 10 daqiqa: kunning Part 3 savoliga 3 ta 1-daqiqalik javob, yozib ol, faqat pauzalarni sana.", en: '10 min shadowing: repeat a BBC 6 Minute English clip half a second behind the speaker — rhythm and intonation. Then 10 min: three one-minute answers to the day\'s Part 3 question, recorded, count only the pauses.' } }
    ],
    /* Haftalik o'lchanadigan maqsadlar (Part 2, 2 daqiqa) */
    targets: [
      { w: 1, wpm: 90,  pauses: 8, note: { uz: "Faqat to'xtama. Sekin bo'lsa ham.", en: "Just don't stop. Slow is fine." } },
      { w: 2, wpm: 100, pauses: 5, note: { uz: 'Har qotishga tayyor ibora.', en: 'A ready phrase for every freeze.' } },
      { w: 3, wpm: 110, pauses: 3, note: { uz: "Tuzilma bilan — o'tmish/hozir/kelajak.", en: 'With structure — past / present / future.' } },
      { w: 4, wpm: 120, pauses: 1, note: { uz: 'Part 3 bosimida ham 120.', en: '120 even under Part 3 pressure.' } }
    ],
    /* Yakshanba o'lchov testi */
    test: {
      uz: "Har yakshanba (7, 14, 21, 28-kunlar): 3 ta TASODIFIY Part 2 kartasi (kurs ichidan emas — ieltsliz.com yoki cambridge kitobidan), har biriga 1 daqiqa tayyorgarlik + 2 daqiqa javob, yozib ol. O'rtacha WPM va 2 soniyalik pauzalar sonini quyidagi jadvalga kirit. Maqsadga yetmasang — keyingi hafta o'sha haftaning texnikasi takrorlanadi (trek cho'ziladi, bu qarz kuni sifatida hisoblanadi).",
      en: 'Every Sunday (days 7, 14, 21, 28): three RANDOM Part 2 cards (not from this course — ieltsliz.com or a Cambridge book), 1 minute prep + 2 minute answer each, recorded. Enter your average WPM and count of 2-second pauses in the table below. Miss the target — next week repeats that week\'s technique (the track extends; it counts as a debt day).'
    },
    honest: {
      uz: "Kafolat haqida to'g'risi: hech qanday kurs 30 kunda '100% ravonlik' bera olmaydi — ravonlik yozib olingan soatlar bilan o'sadi. Bu protokol boshqacha narsani kafolatlaydi: 30 kun × 3 yozuv = 90 yozuv, 22 soat faol gapirish, 4 o'lchov. Shuncha qilgan odamning 2 daqiqalik javobda qotib qolishi — deyarli imkonsiz. O'lchov jadvalidagi raqamlar buni ko'rsatadi, his-tuyg'u emas.",
      en: "Honestly about guarantees: no course gives '100% fluency' in 30 days — fluency grows with recorded hours. This protocol guarantees something different: 30 days × 3 takes = 90 recordings, 22 hours of active speaking, 4 measurements. Someone who has done that almost cannot freeze in a 2-minute answer. The numbers in the table show it, not feelings."
    }
  };
})();
/* ==========================================================================
   HAR KUNGA SAVOLLAR — asosiy savoldan keyin javob berish uchun.
   S.qs[n]: 3 ta mavzuga tegishli savol (imtihonchi qo'shimcha savoli kabi).
   S.pool: umumiy Part 1/3 savollari — har kuni 2 tasi tasodifiy (kun raqami
   bo'yicha aniq: bir kun — bir xil ikkita savol, ertaga boshqasi).
   Qoida: har savolga 40–60 soniya, to'xtamasdan, yozib olib.
   ========================================================================== */
(function () {
  var S = window.SPEAK30;
  if (!S) return;
  S.qs = {
    1: ["What do you like most about your hometown?", "Has your hometown changed much since you were a child?", "Would you like to live somewhere else in the future? Why?"],
    2: ["What is the most difficult part of your work or studies?", "Why did you choose this subject or job?", "What would you like to do in the future?"],
    3: ["Do you prefer spending free time alone or with others?", "Has the way you spend free time changed over the years?", "Is free time important for people? Why?"],
    4: ["What was the last film you watched?", "Do adults and children enjoy the same kinds of films?", "Do you prefer watching films at home or in the cinema?"],
    5: ["Who usually cooks in your family?", "Is there any food you disliked as a child but like now?", "Are eating habits in your country changing?"],
    6: ["What time do you usually get up?", "Is it hard for you to wake up early?", "Do you think people are more productive in the morning?"],
    7: ["What do you mainly use your phone for?", "Do you think people depend on phones too much?", "Could you live a week without your phone?"],
    8: ["Do you usually watch films alone or with friends?", "What kind of films were popular when your parents were young?", "Do you think a film can change a person's opinion?"],
    9: ["What is the best trip you have ever taken?", "Do you prefer travelling alone or in a group?", "What do people learn from travelling?"],
    10: ["Do you think people are influenced by celebrities?", "What qualities make a person a good leader?", "Is it important to have a role model?"],
    11: ["Why do people take up new hobbies as adults?", "Are hobbies a waste of money?", "Should children be encouraged to have hobbies?"],
    12: ["Do you keep photos of special days?", "Why do some days stay in our memory longer?", "Is it better to plan a special day or let it happen?"],
    13: ["Are people reading less than before?", "Should children read paper books or e-books?", "Is a film ever better than the book it is based on?"],
    14: ["Have you ever failed to reach a goal? What happened?", "Do you set daily or long-term goals?", "Should parents set goals for their children?"],
    15: ["What makes a film memorable?", "Do you think violent films affect young people?", "Would you like to work in the film industry?"],
    16: ["Which skills are the most useful in modern life?", "Is it harder to learn a skill as an adult?", "Do you learn better from a teacher or on your own?"],
    17: ["Do young people today have different heroes than in the past?", "Can a person be admired for their failures?", "Is it good to admire someone you have never met?"],
    18: ["Is it better to visit famous places or unknown ones?", "Does tourism damage the places people visit?", "Would you prefer a holiday in the city or in nature?"],
    19: ["Are birthdays important in your culture?", "Do people celebrate differently now than 20 years ago?", "Why do people like to share memories with others?"],
    20: ["Is it better to be good at one thing or average at many?", "How do you react when you cannot do something well?", "Do schools reward the right skills?"],
    21: ["How do you keep yourself motivated?", "Is money a good motivation?", "Do people give up on goals too easily today?"],
    22: ["Should films be used in school lessons?", "Are documentaries more useful than fiction films?", "Why do some films become classics?"],
    23: ["What skills will people need in 20 years?", "Should governments pay for adult education?", "Is online learning as good as classroom learning?"],
    24: ["Do you think famous people have a responsibility to behave well?", "Are teachers still role models today?", "What is the difference between respect and admiration?"],
    25: ["Will space travel become common in your lifetime?", "How can cities attract more visitors?", "Is it important to learn the language of a country before visiting it?"],
    26: ["Do people today have fewer memorable experiences because of technology?", "Why do we forget most days but remember a few?", "Is it healthy to live in the past?"],
    27: ["Can anyone become an expert with enough practice?", "Do people underestimate their own abilities?", "Should we focus on strengths or fix weaknesses?"],
    28: ["Should goals be shared with others or kept private?", "Is it better to have one big goal or many small ones?", "What role do failures play in success?"],
    29: ["Has technology made people more or less productive?", "What technology do you think will disappear soon?", "Should there be limits on children's screen time?"],
    30: ["What is the most important lesson you learned this month?", "How do you know when you have improved at something?", "What advice would you give someone starting this 30-day track?"]
  };
  S.pool = [
    "Do you prefer studying in the morning or at night?", "What kind of weather do you like best?", "Is it important to keep old friends?",
    "Do you think people should learn to cook?", "How do you usually get around your city?", "Are museums interesting for young people?",
    "Do you prefer to give or receive gifts?", "Should everyone learn a musical instrument?", "Is public transport in your city good?",
    "Do you like to plan your day or be spontaneous?", "What do people in your country do at weekends?", "Is it important to be on time?",
    "Do you think it is good to work from home?", "Are advertisements useful or annoying?", "Should children do household chores?",
    "How important is sleep for you?", "Do you prefer big cities or small towns?", "What makes a good teacher?",
    "Is it better to rent or buy a home?", "Do you think people should retire early?", "What kind of noise annoys you most?",
    "Should people spend more time outdoors?", "Is learning history important?", "What do you usually do to relax after a hard day?",
    "Are people in your country patient?", "Do you like to try new food?", "Is it a good idea to keep a diary?",
    "Should young people move away from their parents' home?", "Do you think robots will replace teachers?", "What is the best way to learn a language?",
    "Is it important to save money?", "Do you think people are happier now than 50 years ago?", "What skills should schools teach but do not?",
    "Do you prefer to shop online or in stores?", "Should the internet be free for everyone?", "What is one thing you would change about your city?",
    "Do you think success comes from luck or effort?", "Are competitions good for children?", "How do you deal with stress?",
    "Is it better to work for a big company or a small one?"
  ];
  /* Kunning 2 ta tasodifiy savoli — kun raqamiga bog'liq, o'zgarmas */
  S.randomFor = function (n) {
    var a = (n * 7 + 3) % S.pool.length, b = (n * 11 + 5) % S.pool.length;
    if (b === a) b = (b + 1) % S.pool.length;
    return [S.pool[a], S.pool[b]];
  };
})();