/* ==========================================================================
   ENG_READING — IELTS o'qish matnlari va savollari (2-qism)
   --------------------------------------------------------------------------
   5–10-matnlar: Reading Explorer 3 ning 3, 4 va 5-unitlari mavzularida.
   Kitob matni ko'chirilmagan — mavzu bir xil, matn shu platforma uchun
   IELTS Academic darajasida yozilgan.
   ========================================================================== */
window.ENG_READING_2 = [

{
  n: 5,
  ref: { unit: 3, part: 'A', page: 39, theme: 'Animals in Danger' },
  title: 'Racing to Rescue Koalas',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "In February 2022 the Australian government reclassified the koala as endangered across Queensland, New South Wales and the Australian Capital Territory. The decision surprised almost nobody who had followed the previous decade, but it did expose an uncomfortable fact: after thirty years of public affection, expensive rescue centres and near-universal agreement that the animal should be saved, the population had continued to fall. Concern, it turns out, is not the same thing as a workable plan." },
    { id: 'B', t: "Part of the difficulty lies in the animal itself. The koala is an extreme specialist. It feeds almost entirely on eucalyptus leaves, which are tough, low in nutrients and mildly toxic to most other mammals. Digesting them takes an enormous gut and a great deal of rest — a koala may sleep for twenty hours a day simply to balance its energy budget. This diet has one further consequence that conservationists find maddening: koalas are fussy. Of the hundreds of eucalyptus species in Australia, a local population will accept only a handful, and individual animals often refuse trees that appear identical to those they were taken from." },
    { id: 'C', t: "That fussiness undermines the most obvious response to habitat loss, which is to move animals somewhere safer. Translocation works reasonably well for generalist species that will eat what they find. With koalas, relocated animals frequently lose weight, wander in search of familiar trees and die within months. Conservation biologists now generally treat translocation as a last resort rather than a solution, which leaves the far harder task of protecting the forest where the animals already are." },
    { id: 'D', t: "Disease compounds the problem. Chlamydia is widespread in wild koala populations and causes blindness, urinary tract damage and, most seriously, infertility. A forest may look healthy and still contain a population that is quietly failing to reproduce. Antibiotics can treat an individual animal but also disrupt the gut microbes it needs to process eucalyptus, so treatment carries its own risk. A vaccine has been trialled with encouraging results, though vaccinating enough wild animals to change a population's trajectory remains a formidable logistical problem." },
    { id: 'E', t: "The bushfires of 2019 and 2020 turned a slow decline into a visible emergency. Estimates of koala deaths ran into the tens of thousands, and images of burnt animals being carried from the smoke reached audiences who had never thought about Australian forestry policy. Donations arrived in unprecedented volumes. Yet fire, however dramatic, is not the principal long-term threat. Land clearing for housing and agriculture removes habitat permanently, and the roads and fences that follow leave surviving animals stranded in fragments too small to sustain them. Vehicle strikes and dog attacks then finish what clearing began." },
    { id: 'F', t: "Complicating the picture further, not every koala population is in trouble. On Kangaroo Island and in parts of Victoria, animals introduced in the last century have multiplied in the absence of predators and disease to the point where they strip their food trees bare and starve. Managers there face the politically impossible task of explaining that a beloved endangered species may, in a particular place, need to be reduced in number. It is a useful reminder that conservation is rarely a matter of simply having more of something." }
  ],
  headings: [
    'i. A diet that limits every solution',
    'ii. An illness that hides inside healthy forest',
    'iii. Too many animals in the wrong place',
    'iv. Why moving animals rarely works',
    'v. The official change in status',
    'vi. Fire, attention and the slower danger behind it',
    'vii. How eucalyptus trees reproduce',
    'viii. Breeding koalas in captivity'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'v', why: "A abzatsi 2022-yildagi rasmiy holat o'zgarishi haqida — 'endangered' deb tan olinishi." },
    { type: 'headings', q: 'Paragraph B', a: 'i', why: "B abzatsi evkalipt bilan ovqatlanish va 'fussy' bo'lishni tushuntiradi — bu keyingi barcha yechimni cheklaydi." },
    { type: 'headings', q: 'Paragraph C', a: 'iv', why: "C abzatsining butun mavzusi — translocation nega ishlamasligi." },
    { type: 'headings', q: 'Paragraph D', a: 'ii', why: "Chlamydia: o'rmon sog'lom ko'rinadi, lekin populyatsiya ko'paymayapti — 'hides inside healthy forest'." },
    { type: 'headings', q: 'Paragraph E', a: 'vi', why: "Yong'in + e'tibor, keyin asosiy uzoq muddatli xavf (yer tozalash) — sarlavha ikkalasini ham qamraydi." },
    { type: 'headings', q: 'Paragraph F', a: 'iii', why: "Kangaroo Island'da koalalar juda ko'payib ketgan — 'too many in the wrong place'." },

    { type: 'tfng', q: 'Koalas sleep for long periods because eucalyptus leaves provide little energy.', a: 'TRUE',
      why: "B abzatsi: barglar 'low in nutrients' va koala 'may sleep for twenty hours a day simply to balance its energy budget'." },
    { type: 'tfng', q: 'Koalas will eat any eucalyptus species found in their area.', a: 'FALSE',
      why: "Matn teskarisini aytadi: yuzlab turdan faqat bir nechtasini qabul qiladi, hatto bir xil ko'ringan daraxtdan ham voz kechadi." },
    { type: 'tfng', q: 'The chlamydia vaccine has now been given to most wild koalas.', a: 'FALSE',
      why: "D abzatsi: vaktsina sinovdan o'tgan, lekin yetarlicha yovvoyi hayvonni emlash hali 'formidable logistical problem'. Ya'ni qilingan emas." },
    { type: 'tfng', q: 'More koalas die each year from bushfires than from land clearing.', a: 'NOT GIVEN',
      why: "E abzatsi yong'in asosiy UZOQ MUDDATLI xavf emasligini aytadi, lekin yillik o'lim sonini taqqoslamaydi. Taqqoslash yo'q — NOT GIVEN." },

    { type: 'mcq', q: 'Why is treating koalas with antibiotics risky?',
      opts: ['The drugs are too expensive for wild populations', 'They damage the gut microbes needed to digest eucalyptus', 'They cause blindness in some animals', 'They make the animals refuse familiar trees'],
      a: 1, why: "D abzatsi: antibiotiklar 'disrupt the gut microbes it needs to process eucalyptus'." },
    { type: 'mcq', q: 'What point does the writer make in paragraph F?',
      opts: ['Kangaroo Island should receive more funding', 'Predators should be reintroduced immediately', 'Conservation is not simply about increasing numbers', 'Introduced populations are always healthier'],
      a: 2, why: "Oxirgi gap aynan shu: 'conservation is rarely a matter of simply having more of something'." },
    { type: 'mcq', q: 'The writer\'s attitude to public concern about koalas is best described as',
      opts: ['dismissive of it as sentimental', 'confident it has solved the problem', 'aware that it has not translated into results', 'critical of donors who gave money'],
      a: 2, why: "A abzatsi: 'Concern, it turns out, is not the same thing as a workable plan.' Bu e'tiborni masxara qilish emas — natijaga aylanmaganini aytish." },

    { type: 'completion', q: 'Relocated koalas often die because they cannot find ______ trees.', a: 'familiar',
      why: "C abzatsi: 'wander in search of familiar trees and die within months'." },
    { type: 'summary', q: 'After clearing, surviving koalas are left in ______ that are too small to support them.', a: 'fragments',
      why: "E abzatsi: 'leave surviving animals stranded in fragments too small to sustain them'." }
  ]
},

{
  n: 6,
  ref: { unit: 3, part: 'B', page: 47, theme: 'Animals in Danger' },
  title: 'Tracking the Snow Leopard',
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "For most of the twentieth century, the snow leopard was less a subject of study than a rumour. It lives above the treeline in the mountains of twelve Asian countries, on terrain that defeats vehicles and exhausts researchers, and its grey coat dissolves against rock so completely that experienced trackers have walked past resting animals. Local names for it translate roughly as ghost. Scientists who spent whole careers in its range often reported no direct sightings at all." },
    { id: 'B', t: "This created an awkward situation. Conservation money follows numbers, and numbers were exactly what nobody had. The figures quoted for decades — somewhere between four and seven thousand animals — were built from a small number of surveys in accessible valleys, extrapolated across an area of roughly two million square kilometres. In effect, a handful of measurements were being stretched over a region the size of western Europe. The estimate was not dishonest, but it was never robust enough to detect the very changes it was supposed to monitor." },
    { id: 'C', t: "Two technologies changed the picture. The first was the camera trap, triggered by movement and left in place for months. Crucially, each snow leopard carries a unique pattern of rosettes on its flanks, so photographs allow individual animals to be told apart, and statistical methods developed for other species can convert repeated captures of known individuals into a population estimate. The second was genetic analysis of scat. A single dropping, correctly collected and preserved, yields the species, the sex and an individual identity, and it can be gathered by trained local herders rather than visiting scientists." },
    { id: 'D', t: "The results have been humbling. In some surveyed areas, densities turned out to be higher than expected; in others, animals that were assumed to be present could not be confirmed at all. In 2017, the species was moved from Endangered to Vulnerable on the international conservation list. Headlines reported a recovery. The assessors had said something different: that the earlier classification had rested on evidence too thin to support it, and that better data now suggested the situation, while still serious, had probably been mis-stated rather than improved." },
    { id: 'E', t: "The reaction of some conservation groups to that change was revealing. Several objected publicly, arguing that a lower category would reduce funding and political urgency. The scientific question — what does the evidence actually show — had collided with a practical one — what will keep the work paid for. Researchers involved in the reassessment acknowledged the tension but argued that a conservation movement which adjusts its findings to protect its budgets eventually loses the authority that makes its findings worth funding." },
    { id: 'F', t: "A coordinated survey programme now aims to produce the first defensible global figure, and its most striking feature is how much of the fieldwork is done by people who live in the mountains. Herders check cameras, collect samples and record livestock losses, and are paid for the work. The arrangement is efficient, but its deeper value is different: the herders are also the people who kill snow leopards, usually in retaliation for attacks on their animals. A programme that gives the same household a reason to want the cat alive addresses the threat more directly than any amount of counting." }
  ],
  headings: [
    'i. Two methods that made counting possible',
    'ii. Why the old numbers could not be trusted',
    'iii. An animal that is almost never seen',
    'iv. When science and funding pull in opposite directions',
    'v. Involving the people who share the mountains',
    'vi. A change in status that was widely misread',
    'vii. The snow leopard\'s hunting technique',
    'viii. Zoos and captive breeding programmes'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iii', why: "A abzatsi hayvonning ko'rinmasligi haqida — 'ghost', tadqiqotchilar umuman ko'rmagan." },
    { type: 'headings', q: 'Paragraph B', a: 'ii', why: "B abzatsi eski raqamlar qanday chiqarilganini va nega ishonchsizligini tushuntiradi." },
    { type: 'headings', q: 'Paragraph C', a: 'i', why: "Ikki texnologiya: kamera-tuzoq va genetik tahlil." },
    { type: 'headings', q: 'Paragraph D', a: 'vi', why: "Status o'zgardi, sarlavhalar 'tiklanish' deb yozdi — lekin bu noto'g'ri o'qish edi." },
    { type: 'headings', q: 'Paragraph E', a: 'iv', why: "Ilmiy xulosa va moliyalash manfaati to'qnashgani haqida." },
    { type: 'headings', q: 'Paragraph F', a: 'v', why: "Tog'da yashovchi cho'ponlarni ishga jalb qilish." },

    { type: 'ynng', q: 'The writer thinks the old population estimate was deliberately misleading.', a: 'NO',
      why: "B abzatsi ochiq aytadi: 'The estimate was not dishonest' — ya'ni ataylab aldash emas, shunchaki zaif." },
    { type: 'ynng', q: 'The writer agrees with groups that opposed the 2017 reclassification.', a: 'NO',
      why: "E abzatsi oxiri muallif fikrini beradi: dalilni byudjet uchun moslashtirgan harakat oxiri obro'sini yo'qotadi." },
    { type: 'ynng', q: 'The writer believes involving herders helps for reasons beyond data collection.', a: 'YES',
      why: "F abzatsi: 'its deeper value is different' — cho'ponlarga qoplonni tirik ko'rishga sabab beradi." },
    { type: 'ynng', q: 'The writer thinks camera traps are more reliable than genetic analysis.', a: 'NOT GIVEN',
      why: "Ikkala usul ham tasvirlangan, lekin bir-biri bilan taqqoslanmagan va ustunlik berilmagan." },

    { type: 'mcq', q: 'Why can individual snow leopards be identified in photographs?',
      opts: ['They are fitted with numbered collars', 'Each has a unique pattern of rosettes', 'Their size varies greatly between valleys', 'They return to the same camera repeatedly'],
      a: 1, why: "C abzatsi: 'each snow leopard carries a unique pattern of rosettes on its flanks'." },
    { type: 'mcq', q: 'What did the 2017 assessors actually conclude?',
      opts: ['The population had grown substantially', 'The earlier category rested on weak evidence', 'Snow leopards no longer needed protection', 'Camera traps had over-counted animals'],
      a: 1, why: "D abzatsi: 'the earlier classification had rested on evidence too thin to support it' — vaziyat yaxshilanmagan, noto'g'ri aytilgan edi." },

    { type: 'short', q: 'What single item, when collected properly, reveals species, sex and individual identity?', a: 'scat (a dropping)',
      why: "C abzatsi: 'A single dropping … yields the species, the sex and an individual identity'." },
    { type: 'completion', q: 'Herders usually kill snow leopards in ______ for attacks on livestock.', a: 'retaliation',
      why: "F abzatsi: 'usually in retaliation for attacks on their animals'." }
  ]
},

{
  n: 7,
  ref: { unit: 4, part: 'A', page: 57, theme: 'Violent Earth' },
  title: 'Sacred Summits',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "Around eight hundred million people live within a hundred kilometres of a volcano capable of erupting. To an outsider this looks like a failure of judgement on a spectacular scale, and it is usually explained as one: people are poor, or badly informed, or unable to move. Each of these is sometimes true. None of them explains why volcanic districts are frequently the most densely settled land in their region, more crowded than the safer ground a short distance away." },
    { id: 'B', t: "The first part of the answer is in the soil. Fresh volcanic rock is rich in potassium, phosphorus and magnesium, and as it weathers it releases them in forms that plants can use. The process is slow in dry climates but rapid in wet tropical ones, which is why the island of Java, sitting on a chain of more than a hundred volcanoes, supports one of the densest rural populations on earth. Farmers there can take two or three rice harvests a year from ground that is renewed, at intervals, by the same mountains that threaten them." },
    { id: 'C', t: "That word 'intervals' carries most of the weight. A productive volcanic soil delivers its benefit every season, without fail, to every household. A major eruption may come once in eighty years and will not affect every village equally. Set against each other, a certain annual gain and an uncertain lifetime risk produce exactly the behaviour observed: people stay. Economists describe this as rational discounting of low-probability events; farmers describe it as feeding their children this year." },
    { id: 'D', t: "Heat provides a second return. Where magma sits close to the surface, water circulating through hot rock can be tapped for electricity and for direct heating of homes and greenhouses. Iceland, New Zealand, Kenya, the Philippines and Indonesia all draw significant power from this source. The infrastructure is expensive to build, cheap to run and, unlike most renewable sources, indifferent to weather and time of day — a combination that is becoming steadily more valuable as electricity grids fill up with wind and solar." },
    { id: 'E', t: "Alongside these material returns runs something less easily measured. Many volcanoes are sacred. Fuji, Agung, Popocatépetl and dozens of others carry religious significance for the communities beneath them, and the relationship is not simply one of fear. Ceremonies mark the mountain's moods; families hold land that has been theirs for centuries; leaving means abandoning ancestors as well as fields. Evacuation officials who present the choice as a purely technical calculation are often puzzled by the resistance they meet, and sometimes conclude that the residents are being irrational, when the residents are in fact weighing something the official has left out of the equation." },
    { id: 'F', t: "The practical consequence is that volcanic risk management has moved away from the goal of relocating populations and towards keeping them alive where they are. That means dense monitoring networks, clear alert levels, evacuation routes planned with community leaders rather than announced to them, and — the hardest part — enough trust that a warning is acted on before the mountain provides its own confirmation. Where that trust exists, casualty figures in recent eruptions have been a small fraction of what similar events produced a century ago." }
  ],
  headings: [
    'i. Energy that works day and night',
    'ii. Comparing a yearly benefit with a rare danger',
    'iii. What makes volcanic land so fertile',
    'iv. Ties that officials tend to overlook',
    'v. A puzzle that poverty does not explain',
    'vi. Protecting people without moving them',
    'vii. How lava flows are diverted',
    'viii. The history of volcano photography'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'v', why: "A abzatsi savol qo'yadi: qashshoqlik yoki bilimsizlik bu zichlikni tushuntirmaydi." },
    { type: 'headings', q: 'Paragraph B', a: 'iii', why: "Tuproqning kimyoviy boyligi va Java misoli." },
    { type: 'headings', q: 'Paragraph C', a: 'ii', why: "Har yilgi aniq foyda va bir umrda bir marta bo'ladigan noaniq xavfni taqqoslash." },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: "Geotermal energiya — ob-havoga va vaqtga bog'liq emas." },
    { type: 'headings', q: 'Paragraph E', a: 'iv', why: "Muqaddaslik va ajdodlar — rasmiy hisob-kitobga kirmaydigan bog'liqlik." },
    { type: 'headings', q: 'Paragraph F', a: 'vi', why: "Ko'chirish emas — joyida tirik saqlash strategiyasi." },

    { type: 'tfng', q: 'Volcanic soil forms usable nutrients more quickly in wet tropical climates.', a: 'TRUE',
      why: "B abzatsi: 'The process is slow in dry climates but rapid in wet tropical ones'." },
    { type: 'tfng', q: 'Java has more volcanoes than any other island.', a: 'NOT GIVEN',
      why: "Yuzdan ortiq vulqoni borligi aytilgan, lekin BOSHQA orollar bilan taqqoslanmagan." },
    { type: 'tfng', q: 'Geothermal plants are cheap to construct.', a: 'FALSE',
      why: "D abzatsi teskarisini aytadi: 'expensive to build, cheap to run'. Bu klassik tuzoq — gapning ikkinchi yarmi." },
    { type: 'tfng', q: 'Deaths in recent eruptions have been lower than in comparable eruptions long ago.', a: 'TRUE',
      why: "F abzatsi oxiri: 'casualty figures … a small fraction of what similar events produced a century ago'." },

    { type: 'mcq', q: 'What does the writer suggest about residents who refuse to evacuate?',
      opts: ['They do not understand the danger', 'They are weighing factors officials ignore', 'They trust scientists more than officials', 'They have no legal right to move'],
      a: 1, why: "E abzatsi: aholi 'weighing something the official has left out of the equation' — mantiqsiz emas, boshqa narsani hisoblayapti." },
    { type: 'mcq', q: 'According to paragraph F, the hardest element of modern risk management is',
      opts: ['building monitoring networks', 'planning evacuation routes', 'establishing enough trust', 'defining alert levels'],
      a: 2, why: "'and — the hardest part — enough trust that a warning is acted on'." },

    { type: 'completion', q: 'Volcanic rock releases potassium, phosphorus and ______ as it weathers.', a: 'magnesium',
      why: "B abzatsidagi uchinchi element." },
    { type: 'summary', q: 'Evacuation routes now work best when planned with community ______ rather than announced to them.', a: 'leaders',
      why: "F abzatsi: 'planned with community leaders rather than announced to them'." }
  ]
},

{
  n: 8,
  ref: { unit: 4, part: 'B', page: 65, theme: 'Violent Earth' },
  title: 'Is Prediction Possible?',
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "A useful distinction sits at the centre of this subject, and most public confusion comes from ignoring it. To predict an earthquake is to state that a shock of a given size will strike a given place within a narrow window of time — next Tuesday, near this city, around magnitude seven. To forecast one is to state a probability over years or decades: this fault has perhaps a thirty per cent chance of rupturing before 2050. Forecasting is routine, imperfect and genuinely useful. Prediction, in the strict sense, has never been achieved reliably by anyone." },
    { id: 'B', t: "It has, however, appeared to work. In February 1975, Chinese authorities evacuated the city of Haicheng hours before a magnitude 7.3 earthquake, after a swarm of small foreshocks and reports of unusual well-water levels. Thousands of lives were saved and the result was hailed internationally as proof that prediction was possible. Eighteen months later the city of Tangshan was destroyed without any warning at all, killing at least a quarter of a million people. The two events, taken together, describe the real situation: some earthquakes announce themselves, most do not, and there is no way to know in advance which kind is coming." },
    { id: 'C', t: "The most instructive failure was a deliberate experiment. The Parkfield section of the San Andreas Fault in California had produced moderate earthquakes at strikingly regular intervals — roughly every twenty-two years — and in the mid-1980s scientists predicted the next one before 1993 and instrumented the site heavily to capture it. The earthquake arrived in 2004, eleven years late. The instruments recorded a great deal of valuable data and, in doing so, recorded no clear precursor signal whatsoever. The most closely watched fault on earth gave no warning that it was about to move." },
    { id: 'D', t: "Claims about animal behaviour recur in every generation. Dogs are said to howl, fish to surface, snakes to leave their holes. The difficulty is not that the reports are necessarily false but that they are almost impossible to test: nobody records animal behaviour systematically in a place where nothing subsequently happens, so there is no baseline against which to judge the days before a shock. When researchers have attempted controlled studies, the signal has not survived. This does not prove that animals sense nothing; it means that no one has yet turned the idea into something a warning system could use." },
    { id: 'E', t: "What has succeeded is something quite different, often mistaken for prediction. Earthquake early warning systems in Japan, Mexico and parts of the United States detect the fast, weak initial wave of a rupture that has already begun and transmit an alert ahead of the slower, destructive waves. The warning may be five seconds or ninety, depending on distance. That is enough to stop a train, halt a lift at the nearest floor, close a gas valve or make a surgeon lift a scalpel. It predicts nothing; it simply outruns the shaking." },
    { id: 'F', t: "The stakes of getting the language wrong became clear in Italy, where officials and scientists faced criminal proceedings after a 2009 earthquake in L'Aquila killed more than three hundred people. The central issue was not a failed prediction but reassurance: the public had been told, in effect, that there was nothing to worry about. The scientists' convictions were later overturned on appeal, and the case is now taught as a lesson in risk communication. Saying that a large earthquake is unlikely is not the same as saying it will not happen, and an audience under stress will hear the second sentence when only the first was spoken." }
  ],
  headings: [
    'i. Two terms that are constantly confused',
    'ii. A success and a disaster in the same country',
    'iii. Reports that cannot be properly tested',
    'iv. Beating the waves rather than foreseeing them',
    'v. When reassurance becomes the danger',
    'vi. An experiment that found nothing',
    'vii. Building codes in earthquake zones',
    'viii. Measuring the depth of a rupture'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'i', why: "A abzatsi 'predict' va 'forecast' farqini belgilaydi." },
    { type: 'headings', q: 'Paragraph B', a: 'ii', why: "Haicheng (muvaffaqiyat) va Tangshan (falokat) — ikkalasi ham Xitoyda." },
    { type: 'headings', q: 'Paragraph C', a: 'vi', why: "Parkfield tajribasi hech qanday oldindan signal topmadi." },
    { type: 'headings', q: 'Paragraph D', a: 'iii', why: "Hayvonlar haqidagi xabarlarni sinab bo'lmasligi — baza yo'q." },
    { type: 'headings', q: 'Paragraph E', a: 'iv', why: "Early warning: bashorat emas, to'lqindan tezroq yetib borish." },
    { type: 'headings', q: 'Paragraph F', a: 'v', why: "L'Aquila — muammo bashorat emas, 'tinchlantirish' edi." },

    { type: 'tfng', q: 'Forecasting the probability of an earthquake over decades is common practice.', a: 'TRUE',
      why: "A abzatsi: 'Forecasting is routine, imperfect and genuinely useful'." },
    { type: 'tfng', q: 'The Parkfield earthquake happened earlier than scientists expected.', a: 'FALSE',
      why: "1993 dan oldin kutilgan edi, 2004-yilda keldi — o'n bir yil KECH." },
    { type: 'tfng', q: 'Controlled studies have confirmed that animals detect coming earthquakes.', a: 'FALSE',
      why: "D abzatsi: 'the signal has not survived' — tasdiqlanmagan." },
    { type: 'tfng', q: 'Early warning systems give at least one minute of notice everywhere.', a: 'FALSE',
      why: "E abzatsi: 'five seconds or ninety, depending on distance' — beshda sekund ham bo'lishi mumkin." },

    { type: 'mcq', q: 'What do the Haicheng and Tangshan events together show?',
      opts: ['Chinese methods were superior in 1975', 'Foreshocks always precede large earthquakes', 'Some earthquakes give warning signs and some give none', 'Evacuation is usually unnecessary'],
      a: 2, why: "B abzatsi: 'some earthquakes announce themselves, most do not'." },
    { type: 'mcq', q: 'Why does the writer say early warning systems are misunderstood?',
      opts: ['They are less accurate than forecasting', 'They react to a rupture that has already started', 'They only work for small earthquakes', 'They rely on animal behaviour data'],
      a: 1, why: "E abzatsi: 'a rupture that has already begun' — shuning uchun bu bashorat emas." },
    { type: 'mcq', q: 'The main lesson drawn from the L\'Aquila case is that',
      opts: ['scientists should not speak publicly', 'unlikely and impossible are heard as the same thing', 'convictions should not be overturned', 'prediction should be made illegal'],
      a: 1, why: "Oxirgi gap: 'an audience under stress will hear the second sentence when only the first was spoken'." },

    { type: 'completion', q: 'Early warning gives enough time to stop a train or close a ______ valve.', a: 'gas',
      why: "E abzatsidagi ro'yxat." }
  ]
},

{
  n: 9,
  ref: { unit: 5, part: 'A', page: 73, theme: 'Islands and Beaches' },
  title: 'Land of Fire and Ice',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "Iceland sits directly on the Mid-Atlantic Ridge, the seam where the North American and Eurasian plates pull apart at roughly two centimetres a year. Almost everywhere else on earth this boundary lies under several kilometres of ocean. In Iceland it runs across dry land, which is why a country of fewer than four hundred thousand people contains active volcanoes, lava fields, geysers and hot springs in a concentration found nowhere else outside the sea floor." },
    { id: 'B', t: "For most of its history this was a liability. The island has almost no trees, no coal and no oil, and until the middle of the twentieth century Icelandic homes were heated by imported fuel that arrived by ship and consumed a painful share of the national income. Reykjavík was known to visitors for the coal smoke that hung over it in winter — an unlikely detail in a city now used as an illustration of clean energy." },
    { id: 'C', t: "The transformation began with a municipal decision to pipe naturally hot water from nearby springs directly into buildings. Direct-use geothermal heating requires no generator and no combustion; the water arrives hot, gives up its heat to radiators, and is discharged. Today roughly nine out of ten Icelandic homes are heated this way, and the smoke is gone. Electricity comes almost entirely from hydropower and geothermal generation combined, which gives the country something very few others possess: a grid whose fuel cannot be embargoed, cannot rise in price and does not depend on the weather in the way wind and solar do." },
    { id: 'D', t: "Abundant cheap electricity attracted an industry that most people would not associate with a remote North Atlantic island. Smelting aluminium consumes enormous quantities of power, and the raw material — alumina refined from bauxite — is light enough relative to its value to be shipped long distances. Iceland therefore imports a material it does not have, applies energy it has in surplus, and exports the metal. Aluminium became one of its largest exports. Critics point out that the arrangement locks up much of the country's generating capacity in a handful of foreign-owned plants and that the smelters, not households, are the real reason new dams get built." },
    { id: 'E', t: "Geothermal development also produced an accident that turned into an emblem. Wastewater from a power station on the Reykjanes peninsula, rich in silica and unusually blue, collected in a lava field where people began bathing in it. The resulting lagoon is now among the most visited places in the country. Tourism itself grew explosively after a 2010 eruption disrupted European air traffic for weeks and put the island's name in front of an enormous audience — an eruption that damaged the economy of half a continent while advertising Iceland to it." },
    { id: 'F', t: "The limits of the model are geological rather than technical. A country without a plate boundary running through it cannot copy Iceland directly, and even Iceland's own resource is not infinite: some fields have shown declining pressure where extraction outpaced natural recharge, and drilling deeper to reach hotter rock has proved difficult and occasionally spectacular, on one occasion striking magma at a little over two kilometres. What Iceland demonstrates is narrower than it is often made to sound, but it is not trivial: a country that once burned imported coal for warmth now heats itself with the ground it stands on." }
  ],
  headings: [
    'i. A geological position without parallel',
    'ii. Turning surplus power into an export',
    'iii. Why the model cannot simply be copied',
    'iv. Heat piped straight into homes',
    'v. When the island had to buy its warmth',
    'vi. A by-product that became an attraction',
    'vii. Fishing rights and territorial waters',
    'viii. Volcanic ash and aviation safety rules'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'i', why: "Mid-Atlantic Ridge quruqlikdan o'tishi — boshqa hech qayerda yo'q holat." },
    { type: 'headings', q: 'Paragraph B', a: 'v', why: "Tarixda yoqilg'i import qilingan va milliy daromadning katta qismini yegan." },
    { type: 'headings', q: 'Paragraph C', a: 'iv', why: "Issiq suvni to'g'ridan-to'g'ri binolarga quvurlash." },
    { type: 'headings', q: 'Paragraph D', a: 'ii', why: "Ortiqcha elektrni alyuminiyga aylantirib eksport qilish." },
    { type: 'headings', q: 'Paragraph E', a: 'vi', why: "Elektr stansiyasining chiqindi suvi — Moviy lagunaga aylangan." },
    { type: 'headings', q: 'Paragraph F', a: 'iii', why: "Cheklovlar: plita chegarasi bo'lmagan davlat buni takrorlay olmaydi." },

    { type: 'tfng', q: 'Iceland has significant reserves of coal and oil.', a: 'FALSE',
      why: "B abzatsi: 'no coal and no oil'." },
    { type: 'tfng', q: 'Direct-use geothermal heating requires no burning of fuel.', a: 'TRUE',
      why: "C abzatsi: 'requires no generator and no combustion'." },
    { type: 'tfng', q: 'Aluminium smelters are owned mainly by Icelandic companies.', a: 'FALSE',
      why: "D abzatsi: 'a handful of foreign-owned plants'." },
    { type: 'tfng', q: 'Tourist numbers fell after the 2010 eruption.', a: 'FALSE',
      why: "E abzatsi: turizm portlashdan KEYIN keskin o'sgan." },

    { type: 'mcq', q: 'Why is alumina shipped to Iceland rather than smelted near the mines?',
      opts: ['Icelandic law requires local processing', 'It is light relative to its value, so transport is worthwhile', 'Bauxite cannot be refined in tropical countries', 'Iceland produces its own bauxite'],
      a: 1, why: "D abzatsi: 'light enough relative to its value to be shipped long distances'." },
    { type: 'mcq', q: 'What criticism of the aluminium industry is mentioned?',
      opts: ['It pollutes the hot springs', 'It employs too few Icelanders', 'It ties up generating capacity and drives dam building', 'It makes electricity more expensive for homes'],
      a: 2, why: "D abzatsi oxiri: 'locks up much of the country's generating capacity' va yangi to'g'onlar aynan zavodlar uchun quriladi." },

    { type: 'completion', q: 'The plates beneath Iceland separate at about ______ centimetres a year.', a: 'two',
      why: "A abzatsi: 'roughly two centimetres a year'." },
    { type: 'summary', q: 'Some geothermal fields show falling pressure where extraction exceeded natural ______.', a: 'recharge',
      why: "F abzatsi: 'extraction outpaced natural recharge'." }
  ]
},

{
  n: 10,
  ref: { unit: 5, part: 'B', page: 81, theme: 'Islands and Beaches' },
  title: 'The Perfect Beach',
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "A beach looks like a permanent feature of the coast and is better understood as a river running sideways. The sand on it is in constant transit: waves arriving at an angle push each grain up the shore and gravity pulls it back down at a right angle, producing a slow zigzag migration along the coastline. A grain that lies at one end of a bay in spring may be a kilometre away by autumn. What appears stable is a balance between sand arriving and sand leaving, and that balance is easily broken." },
    { id: 'B', t: "Most of the sand on temperate coasts began as rock in mountains far inland. Rain and frost break granite apart; the softer minerals decompose into clay and are carried out to sea, while quartz, which is hard and chemically stubborn, survives the journey as grains. Rivers deliver these to the coast. This is why a beach in a country with no rivers reaching the sea will often have very little sand, regardless of how much rock the country contains." },
    { id: 'C', t: "Tropical white sand has an entirely different origin: much of it was once alive. Coral, shell and the skeletons of marine organisms are broken down by waves and, remarkably, by fish. Parrotfish scrape algae from coral, grinding up the limestone with it, and excrete the indigestible remainder as fine white sediment; a single large individual may produce hundreds of kilograms a year. Black beaches in volcanic regions have a third origin again, being eroded basalt. The colour of a beach is therefore a reasonably good guide to the geology behind it." },
    { id: 'D', t: "Human interference usually begins upstream. A dam built for water supply or power traps sediment behind it, and the river below carries a fraction of its former load. The coast does not notice immediately, because sand already in the system continues to move, but over decades beaches downstream shrink because nothing is replacing what the waves remove. Coastal engineering does the same thing at a smaller scale: a groyne or a marina wall that stops sand travelling along the shore builds up the beach on one side and starves the beach on the other. The complaint of the neighbouring town is entirely justified and rarely resolved." },
    { id: 'E', t: "Meanwhile demand for sand has risen to a level few people outside the construction industry appreciate. Sand and gravel are, after water, the most heavily extracted materials on the planet, because concrete is roughly two-thirds aggregate by volume and the world builds relentlessly. The obvious alternative fails for an unobvious reason: desert sand, of which there is no shortage, has been polished round and smooth by wind, and rounded grains do not interlock well enough to make strong concrete. Angular river and marine sand is what the industry needs, and extraction from riverbeds and coastal waters has become both large-scale and, in several countries, violently contested." },
    { id: 'F', t: "The standard remedy is beach nourishment: dredging sand from offshore and pumping it onto the shore. It works, in the sense that the beach reappears and the tourist season is saved. It also treats the symptom. The dredged material is often finer than the original and washes away faster, the operation must be repeated every few years at rising cost, and the offshore area from which the sand is taken is itself an ecosystem. Some coastal authorities have begun asking a harder question — whether every beach can be kept where it currently is — and have started buying and removing the buildings nearest the water instead. It is unpopular, expensive and, on a coast where the sand supply has been cut off upstream, the only measure that does not have to be repeated forever." }
  ],
  headings: [
    'i. Sand that was once a living organism',
    'ii. A beach is always moving',
    'iii. Why deserts cannot supply the building trade',
    'iv. From inland mountains to the shore',
    'v. Refilling beaches, and what it does not fix',
    'vi. Dams, walls and their downstream victims',
    'vii. How waves are measured at sea',
    'viii. Sunbathing and public health advice'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'ii', why: "A abzatsi qumning doimiy harakati — 'a river running sideways'." },
    { type: 'headings', q: 'Paragraph B', a: 'iv', why: "Tog'dagi qoyadan daryo orqali sohilgacha." },
    { type: 'headings', q: 'Paragraph C', a: 'i', why: "Tropik oq qum — korall, chig'anoq va baliq chiqindisi." },
    { type: 'headings', q: 'Paragraph D', a: 'vi', why: "To'g'on va to'siqlar quyi oqimdagi sohillarni ochlikka qo'yadi." },
    { type: 'headings', q: 'Paragraph E', a: 'iii', why: "Cho'l qumi nega beton uchun yaramaydi." },
    { type: 'headings', q: 'Paragraph F', a: 'v', why: "Beach nourishment ishlaydi, lekin sababni emas, alomatni davolaydi." },

    { type: 'tfng', q: 'Quartz survives the journey to the sea because it resists chemical breakdown.', a: 'TRUE',
      why: "B abzatsi: 'quartz, which is hard and chemically stubborn, survives the journey'." },
    { type: 'tfng', q: 'Parrotfish deliberately eat coral in order to produce sand.', a: 'FALSE',
      why: "Ular korallni EMAS, undagi suvo'tni yeyishadi; ohaktosh tasodifan birga maydalanadi. 'deliberately … in order to' — matnga zid." },
    { type: 'tfng', q: 'Sand is the most extracted material on earth.', a: 'FALSE',
      why: "E abzatsi: 'after water' — ya'ni birinchi emas, ikkinchi." },
    { type: 'tfng', q: 'Dredged sand used for nourishment is usually coarser than the original.', a: 'FALSE',
      why: "F abzatsi: 'often finer than the original and washes away faster'." },

    { type: 'mcq', q: 'Why does building a groyne cause disputes between towns?',
      opts: ['It blocks access to the water', 'It holds sand on one side and starves the other', 'It increases the height of waves', 'It changes the colour of the sand'],
      a: 1, why: "D abzatsi: 'builds up the beach on one side and starves the beach on the other'." },
    { type: 'mcq', q: 'Desert sand is unsuitable for concrete because its grains are',
      opts: ['too fine to be transported', 'chemically unstable', 'too rounded to interlock', 'contaminated with salt'],
      a: 2, why: "E abzatsi: 'polished round and smooth by wind, and rounded grains do not interlock well'." },
    { type: 'mcq', q: 'What is the writer\'s view of removing buildings near the shore?',
      opts: ['It is cheaper than nourishment in the short term', 'It is popular with coastal residents', 'It is the only solution that need not be repeated', 'It should be avoided where dams exist upstream'],
      a: 2, why: "Oxirgi gap: 'the only measure that does not have to be repeated forever'." },

    { type: 'completion', q: 'Concrete is about ______ aggregate by volume.', a: 'two-thirds',
      why: "E abzatsi: 'roughly two-thirds aggregate by volume'." }
  ]
}

];
