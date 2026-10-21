/* ==========================================================================
   ENG_LISTENING — IELTS tinglash bo'limlari (1-qism)
   --------------------------------------------------------------------------
   Har kuni bitta bo'lim = 10 savol, aynan IELTS qolipida:
     Section 1  kundalik suhbat, 2 kishi  — forma/eslatma to'ldirish
     Section 2  kundalik monolog, 1 kishi — xarita, moslashtirish
     Section 3  akademik suhbat, 2–4 kishi — ko'p variantli, moslashtirish
     Section 4  akademik ma'ruza, 1 kishi — eslatma to'ldirish

   Transkript berilgan — audio yo'q. Uch xil ishlatish mumkin:
     1) Telefondagi text-to-speech'ga o'qitib, TINGLAB ishlash (eng yaxshisi)
     2) Kimdir o'qib bersin — sen faqat tinglaysan
     3) Avval savollarga qara, keyin transkriptni o'qi — bu Reading mashqi
        bo'lib qoladi, lekin tuzoq signallarini ko'rishga yordam beradi

   Eng muhimi: TRANSKRIPTNI OLDIN O'QIMA. Javob berib bo'lgach o'qi va har
   xatoning aynan qaysi so'zdan kelib chiqqanini top.

   Bo'lim obyekti:
     n, section, type, context, speakers
     script  — [{ s:'Woman', t:'…' }]
     qs      — [{ q, a, why, opts? }]  (10 ta)
   ========================================================================== */
window.ENG_LISTENING_1 = [

{
  n: 1, section: 1, type: 'form',
  title: { uz: 'Til kursiga yozilish', en: 'Enrolling on a language course' },
  context: { uz: "Talaba til markaziga qo'ng'iroq qilib, kurs haqida so'raydi.",
             en: 'A student phones a language centre to ask about a course.' },
  speakers: ['Receptionist', 'Daniel'],
  instruction: { uz: "Har bo'shliqqa BIR SO'Z VA/YOKI RAQAM yozing.", en: 'Write ONE WORD AND/OR A NUMBER for each answer.' },
  script: [
    { s: 'Receptionist', t: "Good morning, Northbridge Language Centre. How can I help?" },
    { s: 'Daniel', t: "Hello. I'd like to ask about your evening English courses." },
    { s: 'Receptionist', t: "Certainly. Can I take your name first?" },
    { s: 'Daniel', t: "It's Daniel Okonkwo. That's O-K-O-N-K-W-O." },
    { s: 'Receptionist', t: "Thank you. And are you looking at general English or exam preparation?" },
    { s: 'Daniel', t: "Exam preparation — I'm taking IELTS in February." },
    { s: 'Receptionist', t: "Right. We run two exam courses. The intensive one meets four evenings a week, and the standard one meets twice a week, on Tuesdays and Thursdays." },
    { s: 'Daniel', t: "The standard one, I think. I work during the day. What time does it start?" },
    { s: 'Receptionist', t: "It used to start at six, but from this term we've moved it to six thirty, because so many people were arriving late." },
    { s: 'Daniel', t: "Six thirty is much better. How long is each session?" },
    { s: 'Receptionist', t: "Two hours. And the course runs for twelve weeks." },
    { s: 'Daniel', t: "And the fee?" },
    { s: 'Receptionist', t: "It's four hundred and eighty pounds for the twelve weeks. Sorry — that's the intensive. The standard course is three hundred and sixty." },
    { s: 'Daniel', t: "Three sixty. Is there anything included in that?" },
    { s: 'Receptionist', t: "Yes, the coursebook is included, but you'll need to buy your own practice tests. Most students spend around twenty pounds on those." },
    { s: 'Daniel', t: "Fine. Do I need to take a test before I join?" },
    { s: 'Receptionist', t: "There's a short placement test, yes. It's online, and it takes about forty minutes. Once you've done it we'll email you a level." },
    { s: 'Daniel', t: "How soon should I do it?" },
    { s: 'Receptionist', t: "Before the fifteenth of January, ideally. Classes begin on the twenty-second." },
    { s: 'Daniel', t: "And where exactly is the centre?" },
    { s: 'Receptionist', t: "We're at forty-one Preston Road. The nearest station is Hartley — not Northbridge, which confuses a lot of people." },
    { s: 'Daniel', t: "Hartley. Got it. Is there parking?" },
    { s: 'Receptionist', t: "There's a car park behind the building, but it's free only after six o'clock. Before that you'd need a permit." }
  ],
  qs: [
    { q: 'Family name: ______', a: 'Okonkwo', why: 'Harflab aytilgan: O-K-O-N-K-W-O. Imlo xato bo\'lsa javob noto\'g\'ri hisoblanadi.' },
    { q: 'Course type: ______ (not intensive)', a: 'standard', why: '"The standard one, I think. I work during the day."' },
    { q: 'Classes on Tuesdays and ______', a: 'Thursdays', why: '"meets twice a week, on Tuesdays and Thursdays".' },
    { q: 'Start time: ______', a: '6.30', why: 'TUZOQ: "It used to start at six, but … we\'ve moved it to six thirty." Birinchi eshitilgan vaqt noto\'g\'ri.' },
    { q: 'Length of course: ______ weeks', a: '12', why: '"the course runs for twelve weeks".' },
    { q: 'Fee: £______', a: '360', why: "TUZOQ: 480 aytilib, keyin \"Sorry — that's the intensive. The standard course is three hundred and sixty.\"" },
    { q: 'Included in the fee: the ______', a: 'coursebook', why: '"the coursebook is included, but you\'ll need to buy your own practice tests".' },
    { q: 'Placement test takes about ______ minutes', a: '40', why: '"it takes about forty minutes".' },
    { q: 'Nearest station: ______', a: 'Hartley', why: 'TUZOQ: "not Northbridge, which confuses a lot of people". Markaz nomi bilan stansiya nomi boshqa.' },
    { q: 'Parking is free after ______ o\'clock', a: '6', why: '"it\'s free only after six o\'clock".' }
  ]
},

{
  n: 2, section: 2, type: 'matching',
  title: { uz: 'Shahar velosiped tarmog\'i', en: 'The city cycle network' },
  context: { uz: "Shahar hokimiyati vakili yangi velosiped yo'llari haqida gapiradi.",
             en: 'A council officer describes a new network of cycle routes.' },
  speakers: ['Officer'],
  instruction: { uz: "1–6: har yo'lga to'g'ri xususiyatni tanlang. 7–10: BIR SO'Z yoki RAQAM.",
                 en: 'Q1–6: choose the correct feature for each route. Q7–10: ONE WORD OR A NUMBER.' },
  script: [
    { s: 'Officer', t: "Thank you all for coming. I want to take you through the six new cycle routes that open next month, because each one has been designed for a rather different kind of rider." },
    { s: 'Officer', t: "The Riverside Route is the flattest of the six and runs entirely away from traffic. It's the one we recommend to families with young children — there is not a single road crossing along its whole length." },
    { s: 'Officer', t: "The Hill Loop, as the name suggests, is the opposite. It climbs almost three hundred metres and is intended for riders who want a serious workout. We do not recommend it for beginners." },
    { s: 'Officer', t: "The Market Line is the shortest, but it's the busiest, because it links the two main shopping streets. It's really designed for quick journeys rather than for pleasure." },
    { s: 'Officer', t: "The Canal Path is unusual in that it is shared with walkers. Cyclists are asked to keep below ten kilometres an hour along it, and there are signs reminding people of that." },
    { s: 'Officer', t: "The Airport Link is the longest at nineteen kilometres, and it's the only one that is lit throughout, so it can be used safely in winter evenings." },
    { s: 'Officer', t: "And finally the Old Railway is the newest surface — it was resurfaced only in September — which makes it the smoothest, though it's currently closed at weekends for the final works." },
    { s: 'Officer', t: "A few practical points. Bicycle hire is available at three locations, and the daily rate is eight pounds, or five for students. Hire bikes must be returned by nine in the evening." },
    { s: 'Officer', t: "There's a free repair station at the Riverside entrance — that's tools only, no parts. And if you want a printed map, they're available from the library rather than from the council offices, which is a change from last year." }
  ],
  qs: [
    { q: 'Riverside Route — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'A',
      why: '"we recommend to families with young children — there is not a single road crossing".' },
    { q: 'Hill Loop — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'B',
      why: '"It climbs almost three hundred metres … a serious workout".' },
    { q: 'Market Line — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'F',
      why: '"it\'s the busiest, because it links the two main shopping streets".' },
    { q: 'Canal Path — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'C',
      why: '"it is shared with walkers".' },
    { q: 'Airport Link — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'D',
      why: '"the only one that is lit throughout".' },
    { q: 'Old Railway — main feature?', opts: ['A. best for families', 'B. steepest climb', 'C. shared with walkers', 'D. lit at night', 'E. newest surface', 'F. busiest route'], a: 'E',
      why: '"resurfaced only in September — which makes it the smoothest".' },
    { q: 'Length of the Airport Link: ______ km', a: '19', why: '"the longest at nineteen kilometres".' },
    { q: 'Student bike hire rate: £______ per day', a: '5', why: 'TUZOQ: "eight pounds, or five for students". Savol TALABA narxini so\'rayapti.' },
    { q: 'Hire bikes must be returned by ______ pm', a: '9', why: '"must be returned by nine in the evening".' },
    { q: 'Printed maps are available from the ______', a: 'library', why: 'TUZOQ: "from the library rather than from the council offices".' }
  ]
},

{
  n: 3, section: 3, type: 'mcq',
  title: { uz: 'Kurs loyihasi muhokamasi', en: 'Discussing a course project' },
  context: { uz: "Ikki talaba va o'qituvchi loyiha rejasini muhokama qiladi.",
             en: 'Two students and a tutor discuss a project plan.' },
  speakers: ['Tutor', 'Maya', 'Tom'],
  instruction: { uz: "To'g'ri javobni tanlang.", en: 'Choose the correct answer.' },
  script: [
    { s: 'Tutor', t: "So, you two are looking at food waste in university canteens. How far have you got?" },
    { s: 'Maya', t: "We've collected two weeks of data from the main canteen. Originally we planned four weeks, but the kitchen staff couldn't keep weighing everything, so we cut it." },
    { s: 'Tutor', t: "Two weeks is short. Does that worry you?" },
    { s: 'Tom', t: "It worried me at first, but actually the pattern was very consistent across both weeks, so I think it's defensible." },
    { s: 'Maya', t: "I'm less sure. Two weeks in November might not represent the whole year." },
    { s: 'Tutor', t: "Maya's caution is right, but Tom's point stands too. What you should do is state the limitation openly rather than hide it. Examiners are far more critical of a limitation that isn't acknowledged than of one that is." },
    { s: 'Tom', t: "That's fair. Should we still try to add a third week?" },
    { s: 'Tutor', t: "I'd rather you spent that time on the analysis. You have enough data; what you don't yet have is an explanation." },
    { s: 'Maya', t: "On that — we found that waste was much higher at lunch than at dinner. About three times higher." },
    { s: 'Tom', t: "My assumption was that it's because lunch is busier." },
    { s: 'Tutor', t: "Possibly, but be careful. Higher volume would produce more total waste, but you're reporting waste per meal served, aren't you?" },
    { s: 'Maya', t: "We are, yes. So volume alone wouldn't explain it." },
    { s: 'Tutor', t: "Exactly. Look at portion size and at how long students have. A student with twenty minutes behaves differently from one with an hour." },
    { s: 'Tom', t: "We could survey students about time pressure." },
    { s: 'Tutor', t: "You could, though surveys about past behaviour are unreliable. Observation would be stronger, if you have time for it." },
    { s: 'Maya', t: "What about the presentation? Fifteen minutes each, or fifteen together?" },
    { s: 'Tutor', t: "Fifteen together, with five minutes of questions afterwards. And please don't put your raw tables on the slides — put them in the appendix and show one clear chart instead." }
  ],
  qs: [
    { q: 'Why was the data collection period shortened?', opts: ['A. The students ran out of time', 'B. Kitchen staff could not continue weighing', 'C. The tutor advised it', 'D. The canteen closed'], a: 'B',
      why: '"the kitchen staff couldn\'t keep weighing everything, so we cut it".' },
    { q: 'What is the tutor\'s advice about the short data period?', opts: ['A. Collect one more week', 'B. Change the research question', 'C. State the limitation openly', 'D. Ignore it in the report'], a: 'C',
      why: '"state the limitation openly rather than hide it".' },
    { q: 'How does Maya feel about the two-week sample?', opts: ['A. Confident it is enough', 'B. Doubtful about how representative it is', 'C. Angry with the kitchen staff', 'D. Unconcerned'], a: 'B',
      why: '"Two weeks in November might not represent the whole year."' },
    { q: 'What does the tutor want them to prioritise now?', opts: ['A. More data collection', 'B. The analysis', 'C. The presentation slides', 'D. A student survey'], a: 'B',
      why: '"I\'d rather you spent that time on the analysis."' },
    { q: 'Lunchtime waste was found to be', opts: ['A. slightly higher than dinner', 'B. about three times higher than dinner', 'C. equal to dinner', 'D. lower than dinner'], a: 'B',
      why: '"About three times higher."' },
    { q: 'Why does the tutor reject Tom\'s explanation?', opts: ['A. Lunch is not busier', 'B. The data is measured per meal served', 'C. The sample is too small', 'D. Dinner is busier'], a: 'B',
      why: '"you\'re reporting waste per meal served … So volume alone wouldn\'t explain it."' },
    { q: 'What two factors does the tutor suggest examining?', opts: ['A. Price and menu', 'B. Portion size and available time', 'C. Staff numbers and opening hours', 'D. Weather and season'], a: 'B',
      why: '"Look at portion size and at how long students have."' },
    { q: 'What is the tutor\'s view of surveying students?', opts: ['A. It is the best method', 'B. It is unreliable for past behaviour', 'C. It is too expensive', 'D. It is not allowed'], a: 'B',
      why: '"surveys about past behaviour are unreliable. Observation would be stronger".' },
    { q: 'How long is the presentation?', opts: ['A. 15 minutes each', 'B. 15 minutes together', 'C. 20 minutes each', 'D. 5 minutes together'], a: 'B',
      why: 'TUZOQ: savol ikki variant bilan berildi, javob "Fifteen together".' },
    { q: 'What should go on the slides?', opts: ['A. All the raw tables', 'B. One clear chart', 'C. The full appendix', 'D. No visuals at all'], a: 'B',
      why: '"put them in the appendix and show one clear chart instead".' }
  ]
},

{
  n: 4, section: 4, type: 'notes',
  title: { uz: "Ma'ruza: shahar daraxtlari", en: 'Lecture: urban trees' },
  context: { uz: "Ekologiya bo'yicha ma'ruza — shahardagi daraxtlarning roli.",
             en: 'An ecology lecture on the role of trees in cities.' },
  speakers: ['Lecturer'],
  instruction: { uz: "Har bo'shliqqa BIR SO'Z yozing.", en: 'Write ONE WORD for each answer.' },
  script: [
    { s: 'Lecturer', t: "Good afternoon. Today I want to look at urban trees — not as decoration, but as infrastructure, because that is increasingly how planners treat them." },
    { s: 'Lecturer', t: "Let me start with temperature. A city centre is typically several degrees warmer than the countryside around it, an effect known as the urban heat island. Trees reduce this in two ways. The obvious one is shade. The less obvious one, and the more powerful, is transpiration — water evaporating from the leaves, which cools the surrounding air much as sweating cools the body." },
    { s: 'Lecturer', t: "Measurements in Melbourne found that a well-shaded street could be up to eleven degrees cooler at street level than an unshaded one nearby. That is not a marginal difference; in a heatwave it is the difference between discomfort and danger." },
    { s: 'Lecturer', t: "Second, water. Hard surfaces send rainfall straight into drains, and during heavy storms the drains overflow. A mature tree intercepts a surprising volume — the canopy holds water, and the root zone absorbs more. Studies in several cities suggest a single mature street tree can reduce runoff by several thousand litres a year." },
    { s: 'Lecturer', t: "Third, air quality. Here I want to be careful, because the popular claim is overstated. Leaves do trap particulate matter, but the effect on overall air quality is modest, and in narrow streets a dense canopy can actually trap pollution at street level by reducing air movement. Species choice and street geometry matter more than simply planting more." },
    { s: 'Lecturer', t: "Fourth, and this is the finding that surprises most people, property. Repeated studies across different countries find that houses on tree-lined streets sell for measurably more than comparable houses without trees. The estimates cluster around a premium of seven per cent." },
    { s: 'Lecturer', t: "Now, the difficulty. Urban trees die young. The average street tree in a city centre survives perhaps nineteen years, against well over a century for the same species in a park. The main killer is not disease or vandalism, as people often assume — it is compaction. Soil under pavements is pressed so hard that roots cannot penetrate it and water cannot reach them." },
    { s: 'Lecturer', t: "Which leads to the practical conclusion. The most effective intervention is not planting more trees; it is giving the trees we plant enough soil. Cities that have invested in engineered soil beneath pavements report survival rates roughly double those of conventional planting. Planting is cheap and visible; soil is expensive and invisible — which is exactly why it is neglected." }
  ],
  qs: [
    { q: 'The temperature effect in cities is called the urban ______ island.', a: 'heat', why: '"an effect known as the urban heat island".' },
    { q: 'The more powerful cooling mechanism is ______.', a: 'transpiration', why: 'TUZOQ: soya "obvious" deyilgan, lekin KUCHLIROG\'I — transpiration.' },
    { q: 'A shaded street in Melbourne was up to ______ degrees cooler.', a: 'eleven', why: '"up to eleven degrees cooler at street level".' },
    { q: 'Hard surfaces send rainfall directly into ______.', a: 'drains', why: '"Hard surfaces send rainfall straight into drains".' },
    { q: 'The lecturer says the air-quality claim is ______.', a: 'overstated', why: '"the popular claim is overstated".' },
    { q: 'In narrow streets a dense canopy may ______ pollution at street level.', a: 'trap', why: '"a dense canopy can actually trap pollution at street level".' },
    { q: 'Houses on tree-lined streets sell for about ______ per cent more.', a: 'seven', why: '"a premium of seven per cent".' },
    { q: 'The average city-centre street tree survives about ______ years.', a: 'nineteen', why: '"survives perhaps nineteen years".' },
    { q: 'The main cause of early death is soil ______.', a: 'compaction', why: 'TUZOQ: kasallik va vandalizm ochiq RAD ETILDI — sabab compaction.' },
    { q: 'Engineered soil roughly ______ the survival rate.', a: 'doubles', why: '"report survival rates roughly double those of conventional planting".' }
  ]
}

];
