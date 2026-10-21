/* ==========================================================================
   ENG_READING — IELTS o'qish matnlari va savollari (3-qism)
   --------------------------------------------------------------------------
   11–16-matnlar: Reading Explorer 3 ning 6, 7 va 8-unitlari. Sarlavha va
   mavzu kitobniki, matn shu platforma uchun IELTS Academic darajasida
   yozilgan (kitob matni ko'chirilmagan). Uzunlik kitobga yaqinlashtirildi.
   ========================================================================== */
window.ENG_READING_3 = [

{
  n: 11,
  ref: { unit: 6, part: 'A', page: 89, theme: 'Global Addictions' },
  title: "The World's Favorite Drug",
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "Every morning, roughly two billion people begin their day with the same chemical. It arrives as coffee in Italy, as tea in China and Britain, as maté in Argentina, as cola or an energy drink almost everywhere else. Caffeine is the most widely consumed psychoactive substance on earth, and it is unusual among such substances in being legal, unregulated and, for the most part, socially encouraged. Nobody is arrested for it, few people apologise for it, and most consumers do not think of themselves as taking a drug at all. Yet in pharmacological terms that is exactly what they are doing, and the effects are real enough to have shaped trade, religion and the working day." },
    { id: 'B', t: "The molecule works by imitation. Over the course of a day, a compound called adenosine accumulates in the brain and binds to receptors that gradually produce the feeling of tiredness. Caffeine is shaped closely enough to fit those same receptors without activating them, so it sits in the way and prevents adenosine from delivering its message. The result is not extra energy so much as delayed fatigue: the tiredness is still building, but the brain is not being told about it. This is why the eventual crash is so abrupt. When the caffeine is cleared, the accumulated adenosine arrives all at once." },
    { id: 'C', t: "Clearance takes longer than most people assume. The half-life of caffeine in a healthy adult is around five to six hours, meaning that half of a mid-afternoon coffee is still circulating at bedtime. Individuals vary considerably: a single gene largely determines how fast the liver breaks the compound down, and fast metabolisers can drink an espresso after dinner and sleep soundly while slow metabolisers lie awake after a cup at lunch. Pregnancy, certain medications and smoking all shift the rate. Much of the folk wisdom about who can and cannot 'handle' coffee is, in fact, genetics." },
    { id: 'D', t: "The plant did not evolve caffeine for human benefit. It is a pesticide: in the concentrations found in leaves and seeds, it paralyses and kills many insects. More subtly, some plants secrete small amounts of it in their nectar, where it appears to improve the memory of visiting bees, who then return more faithfully to the same flowers. The compound, in other words, was manipulating animal behaviour long before people discovered it, and around sixty plant species have arrived independently at the same chemical solution." },
    { id: 'E', t: "Human use began in Ethiopia, where the coffee plant grows wild, and spread through Yemen, where Sufi communities used it to stay awake during night devotions. By the sixteenth century coffeehouses had appeared in Cairo and Istanbul, and by the seventeenth in London, where they became such centres of political conversation that the king briefly tried to close them. Tea travelled a parallel route from China. Historians have argued, only half jokingly, that the arrival of caffeinated drinks in Europe — replacing beer as the safe alternative to contaminated water — produced a population that was, for the first time, alert in the afternoon, and that this had something to do with what followed." },
    { id: 'F', t: "Is it harmful? For most healthy adults, moderate intake — generally defined as up to about four hundred milligrams a day, or three to four cups of coffee — is not associated with serious problems, and some studies find modest benefits. The picture is less reassuring at the edges. Energy drinks combine large doses with sugar and are marketed to the young; withdrawal produces headaches and low mood for several days, which is why many people believe coffee 'cures' a headache that its absence caused; and because caffeine suppresses the signal of tiredness rather than the tiredness itself, it is easy to use it to conceal chronic sleep loss. The drug is not dangerous. The habit of using it to avoid sleeping can be." }
  ],
  headings: [
    'i. A defence mechanism that became a human habit',
    'ii. Why the effect ends so suddenly',
    'iii. Where the risk actually lies',
    'iv. How quickly the body removes it',
    'v. The most widely used substance on earth',
    'vi. From Ethiopian forests to European cities',
    'vii. Health benefits of drinking tea',
    'viii. How coffee is roasted and brewed'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'v', why: "Ikki milliard odam, 'most widely consumed psychoactive substance' — miqyos." },
    { type: 'headings', q: 'Paragraph B', a: 'ii', why: "Adenozin to'planib turadi, kofein ketganda birdan keladi — 'crash is so abrupt'." },
    { type: 'headings', q: 'Paragraph C', a: 'iv', why: "Yarim yemirilish davri 5–6 soat, genetika — chiqarish tezligi." },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: "Kofein o'simlik uchun pestitsid — himoya vositasi, keyin inson odati." },
    { type: 'headings', q: 'Paragraph E', a: 'vi', why: "Efiopiya → Yaman → Qohira, Istanbul, London." },
    { type: 'headings', q: 'Paragraph F', a: 'iii', why: "Xavf moddaning o'zida emas — uyqusizlikni yashirish odatida." },

    { type: 'tfng', q: 'Caffeine gives the brain additional energy.', a: 'FALSE',
      why: "B abzatsi: 'not extra energy so much as delayed fatigue' — charchoq kechiktiriladi, energiya qo'shilmaydi." },
    { type: 'tfng', q: 'The speed at which people break down caffeine is mainly determined by a single gene.', a: 'TRUE',
      why: "C abzatsi: 'a single gene largely determines how fast the liver breaks the compound down'." },
    { type: 'tfng', q: 'Bees that consume caffeine in nectar produce more honey.', a: 'NOT GIVEN',
      why: "Asal haqida hech narsa yo'q — faqat xotira va gulga qaytish aytilgan." },
    { type: 'tfng', q: 'Coffeehouses in London were at one point threatened with closure by the monarch.', a: 'TRUE',
      why: "E abzatsi: 'the king briefly tried to close them'." },

    { type: 'mcq', q: 'According to paragraph D, why do some plants put caffeine in their nectar?',
      opts: ['To kill insects that eat the flowers', 'To make pollinators remember and return to them', 'To attract a wider range of animals', 'To protect the nectar from bacteria'],
      a: 1, why: "'improve the memory of visiting bees, who then return more faithfully'." },
    { type: 'mcq', q: 'The writer suggests that caffeinated drinks in Europe',
      opts: ['replaced water as the main drink', 'were initially banned by religious leaders', 'may have contributed to greater afternoon alertness', 'were more popular than in Asia'],
      a: 2, why: "E abzatsi: 'a population that was, for the first time, alert in the afternoon'." },
    { type: 'mcq', q: 'What does the writer conclude about caffeine?',
      opts: ['It is dangerous in any quantity', 'The substance is safe but a certain habit is not', 'Energy drinks are safer than coffee', 'Withdrawal has no real symptoms'],
      a: 1, why: "Oxirgi ikki gap: 'The drug is not dangerous. The habit of using it to avoid sleeping can be.'" },

    { type: 'completion', q: 'Moderate intake is usually defined as up to about ______ milligrams a day.', a: '400 / four hundred',
      why: "F abzatsi." },
    { type: 'summary', q: 'Caffeine originally evolved as a ______ that harms insects.', a: 'pesticide',
      why: "D abzatsi: 'It is a pesticide'." }
  ]
},

{
  n: 12,
  ref: { unit: 6, part: 'B', page: 97, theme: 'Global Addictions' },
  title: 'Addicted to Distraction',
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "The average smartphone owner touches the device somewhere between two and three thousand times a day and checks it, by most estimates, well over a hundred. Almost nobody chose this. Asked to describe their ideal relationship with the phone, most people describe something far more restrained than the one they have, and the gap between the two is not a failure of willpower. It is the intended output of an industry whose revenue depends on attention and which has, over fifteen years, become extremely good at obtaining it." },
    { id: 'B', t: "The mechanism borrowed from gambling is the variable reward. A slot machine pays out unpredictably, and unpredictability is far more compelling to the brain than a reliable schedule. A feed that is refreshed with a downward pull of the thumb works in precisely the same way: sometimes there is something new, sometimes not, and the not-knowing is what keeps the thumb moving. Notifications add a second layer. Each one is a small promise of social reward — someone has replied, liked, mentioned you — and the promise is delivered at random intervals throughout the day, which is the schedule most resistant to extinction." },
    { id: 'C', t: "The cost is easy to underestimate because it is paid in fragments. A check that takes ten seconds does not end when the phone is put down. Researchers describe 'attention residue': part of the mind remains on the interrupted task and takes, in careful studies, up to twenty minutes to fully return. Someone who checks a phone every fifteen minutes therefore never works at full capacity at all. What feels like light multitasking is, measured properly, a long series of expensive switches." },
    { id: 'D', t: "More striking is what happens when the phone is merely present. In one widely repeated experiment, participants completed tests of working memory and attention with their phone either on the desk face down, in a bag, or in another room. Nobody touched the phone. Those whose phone was in another room performed best, and those with it on the desk performed worst, by margins large enough to matter. Simply resisting the urge to check appears to consume some of the capacity that the task required. The phone does not need to ring to cost you something; it only needs to be within reach." },
    { id: 'E', t: "The effects on the young are the subject of a fierce and unresolved debate. Rates of anxiety and reported loneliness among teenagers rose sharply in many countries in the decade after smartphones became universal, and the timing is suggestive. But timing is not proof, and careful studies find effects that are real but smaller than headlines imply, varying greatly with what the phone is used for. An hour of video calls with a distant friend and an hour of scrolling through strangers' photographs are both 'screen time', and treating them as the same thing has confused the argument for years." },
    { id: 'F', t: "What works is less dramatic than a digital detox. The most effective strategies remove decision points rather than demanding better decisions: notifications turned off by default and enabled only for named people; the phone charged overnight outside the bedroom; the screen set to greyscale, which drains the colour that the apps rely on to attract the eye; work sessions in which the device is physically elsewhere. None of this requires discipline in the moment, which is the point. Willpower is a limited resource, and a design that has been optimised by thousands of engineers to defeat it will usually win. The alternative is not to fight, but to arrange one's day so that the fight does not occur." }
  ],
  headings: [
    'i. A device that costs attention even when untouched',
    'ii. Why unpredictability holds us',
    'iii. Arranging life so that the struggle never starts',
    'iv. Behaviour nobody consciously chose',
    'v. Small interruptions with a long tail',
    'vi. An argument confused by a single word',
    'vii. How notifications are designed by engineers',
    'viii. The history of the mobile phone'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iv', why: "'Almost nobody chose this' — xatti-harakat tanlangan emas, sanoat natijasi." },
    { type: 'headings', q: 'Paragraph B', a: 'ii', why: "O'yin avtomati va o'zgaruvchan mukofot — oldindan bilib bo'lmaslik ushlab turadi." },
    { type: 'headings', q: 'Paragraph C', a: 'v', why: "10 soniyalik tekshiruv, 20 daqiqalik 'attention residue' — uzun dum." },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: "Telefon stolda turganining o'zi natijani tushiradi." },
    { type: 'headings', q: 'Paragraph E', a: 'vi', why: "'screen time' so'zi ikki xil narsani bir qilib yuborgan." },
    { type: 'headings', q: 'Paragraph F', a: 'iii', why: "Kurashmaslik — kunni kurash bo'lmaydigan qilib qurish." },

    { type: 'ynng', q: 'The writer believes the gap between how people use phones and how they would like to is mainly a lack of self-control.', a: 'NO',
      why: "A abzatsi: 'not a failure of willpower. It is the intended output of an industry'." },
    { type: 'ynng', q: 'The writer thinks a fixed, predictable notification schedule would be harder to resist.', a: 'NO',
      why: "B abzatsi: tasodifiy jadval 'most resistant to extinction' — ya'ni oldindan ma'lum jadval kuchsizroq." },
    { type: 'ynng', q: 'The writer accepts that smartphones are the proven cause of rising teenage anxiety.', a: 'NO',
      why: "E abzatsi: 'timing is not proof' — isbot emas." },
    { type: 'ynng', q: 'The writer considers greyscale screens more effective than turning off notifications.', a: 'NOT GIVEN',
      why: "Ikkalasi ham ro'yxatda, lekin taqqoslanmagan." },

    { type: 'mcq', q: 'In the experiment described in paragraph D, the best results came from participants whose phone was',
      opts: ['face down on the desk', 'in a bag', 'in another room', 'switched off'], a: 2,
      why: "'Those whose phone was in another room performed best'." },
    { type: 'mcq', q: 'Why does the writer say the cost of phone-checking is easy to underestimate?',
      opts: ['Because it is paid in many small pieces', 'Because phones are cheap', 'Because researchers disagree', 'Because most checks are useful'], a: 0,
      why: "C abzatsi: 'paid in fragments'." },
    { type: 'mcq', q: 'The writer\'s main advice is to',
      opts: ['practise stronger willpower', 'remove the need to make decisions', 'give up the phone entirely', 'use the phone only for calls'], a: 1,
      why: "F abzatsi: 'remove decision points rather than demanding better decisions'." },

    { type: 'completion', q: 'After an interruption, full attention can take up to ______ minutes to return.', a: '20 / twenty', why: "C abzatsi." },
    { type: 'summary', q: 'Notifications are described as a small promise of ______ reward.', a: 'social', why: "B abzatsi." }
  ]
},

{
  n: 13,
  ref: { unit: 7, part: 'A', page: 105, theme: 'Energy Solutions' },
  title: 'Powering the Planet',
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "Humanity uses about six hundred exajoules of energy a year, a number too large to picture and easier to state as a proportion: around four fifths of it still comes from burning coal, oil and gas. That share has barely moved in thirty years. This is the central and uncomfortable fact of the energy transition. Renewable capacity has grown at rates that would have seemed fantastic in 2000, and yet fossil fuel consumption has grown too, because total demand has risen faster than clean supply has been built. The world has not been replacing fossil fuels so much as adding to them." },
    { id: 'B', t: "The economics, however, have shifted decisively, and more quickly than almost anyone predicted. Between 2010 and 2020 the cost of electricity from solar panels fell by roughly ninety per cent, and from onshore wind by around seventy. In most of the world, building a new solar or wind farm is now cheaper than building a new coal or gas plant, and in a growing number of places it is cheaper than continuing to run an existing one. Fifteen years ago the case for renewables rested on the climate. Today it rests, in many markets, on price — a far more persuasive argument to a finance minister." },
    { id: 'C', t: "The difficulty is that cheap electricity is not the same as reliable electricity. The sun sets and the wind drops, and on a winter evening in northern Europe both may do so at the moment of highest demand. A grid built around fossil plants could be told what to produce; a grid built around weather must be told what to do when the weather does not cooperate. The answers exist — batteries for hours, pumped water storage for days, long transmission lines that move power from where it is windy to where it is not, and flexible demand that shifts consumption to when supply is abundant — but each is expensive, and the last of the four requires a kind of cooperation that electricity users have never before been asked for." },
    { id: 'D', t: "Nuclear power sits awkwardly in this picture. It produces very large amounts of electricity without carbon and regardless of weather, which is exactly what a renewable grid lacks. Against this, new plants in Europe and North America have taken fifteen years to build and cost several times their original estimate, while public trust has never fully recovered from a handful of accidents. Several countries have closed working reactors and replaced their output, in practice, with gas. Whether that was a sensible decision or a costly one depends almost entirely on which risk the person answering is most afraid of." },
    { id: 'E', t: "Any honest account must also include the people for whom the transition is not the main problem. Around seven hundred million people have no electricity at all, and more than two billion cook on wood, charcoal or dung, with smoke that kills more people annually than malaria. For them the pressing question is not whether power is clean but whether it exists. Off-grid solar has done remarkable things here — a panel, a battery and a few lights transform a household — but it does not run a factory, and no country has become prosperous on lighting alone." },
    { id: 'F', t: "The most underrated solution is the least visible one. A unit of energy that is not needed does not have to be generated, stored or transmitted, and improvements in efficiency — better insulation, LED lighting, heat pumps that deliver three units of heat for one of electricity, industrial motors that no longer run at full speed all day — have quietly done more to restrain demand in rich countries than any single source of supply. Efficiency has no ribbon-cutting ceremony and wins no elections. It is also the only part of the transition that pays for itself." }
  ],
  headings: [
    'i. A source that divides opinion',
    'ii. Cheap is not the same as dependable',
    'iii. The invisible measure that pays for itself',
    'iv. Adding to fossil fuels rather than replacing them',
    'v. Where the question is access, not cleanliness',
    'vi. A price collapse that changed the argument',
    'vii. The history of coal mining',
    'viii. How solar panels are manufactured'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iv', why: "Oxirgi gap: 'not been replacing fossil fuels so much as adding to them'." },
    { type: 'headings', q: 'Paragraph B', a: 'vi', why: "Narx 90% tushdi — dalil iqlimdan narxga ko'chdi." },
    { type: 'headings', q: 'Paragraph C', a: 'ii', why: "'cheap electricity is not the same as reliable electricity'." },
    { type: 'headings', q: 'Paragraph D', a: 'i', why: "Yadro energiyasi — kimning qaysi xavfdan qo'rqishiga bog'liq." },
    { type: 'headings', q: 'Paragraph E', a: 'v', why: "700 million elektrsiz — 'not whether power is clean but whether it exists'." },
    { type: 'headings', q: 'Paragraph F', a: 'iii', why: "Samaradorlik — ko'rinmas, lekin o'zini oqlaydigan yagona qism." },

    { type: 'tfng', q: 'The share of energy from fossil fuels has fallen sharply since the 1990s.', a: 'FALSE',
      why: "A abzatsi: 'That share has barely moved in thirty years'." },
    { type: 'tfng', q: 'In some places, new solar or wind is cheaper than running an existing fossil plant.', a: 'TRUE',
      why: "B abzatsi: 'cheaper than continuing to run an existing one'." },
    { type: 'tfng', q: 'Pumped water storage can supply power for longer than batteries.', a: 'TRUE',
      why: "C abzatsi: 'batteries for hours, pumped water storage for days'." },
    { type: 'tfng', q: 'Most countries that closed reactors replaced them with renewables.', a: 'FALSE',
      why: "D abzatsi: 'replaced their output, in practice, with gas'." },

    { type: 'mcq', q: 'Which measure in paragraph C requires new behaviour from consumers?',
      opts: ['batteries', 'pumped storage', 'transmission lines', 'flexible demand'], a: 3,
      why: "'the last of the four requires a kind of cooperation that electricity users have never before been asked for'." },
    { type: 'mcq', q: 'What limitation of off-grid solar does the writer mention?',
      opts: ['It is too expensive for households', 'It cannot power industry', 'It does not work in Africa', 'It requires a national grid'], a: 1,
      why: "E abzatsi: 'it does not run a factory'." },
    { type: 'mcq', q: 'Why does the writer call efficiency \'underrated\'?',
      opts: ['It has done little to reduce demand', 'It attracts no public attention despite its effect', 'It is more expensive than solar', 'It only works in poor countries'], a: 1,
      why: "F abzatsi: 'no ribbon-cutting ceremony and wins no elections'." },

    { type: 'completion', q: 'A heat pump can deliver ______ units of heat for one unit of electricity.', a: 'three / 3', why: "F abzatsi." },
    { type: 'summary', q: 'Smoke from cooking fuels kills more people each year than ______.', a: 'malaria', why: "E abzatsi." }
  ]
},

{
  n: 14,
  ref: { unit: 7, part: 'B', page: 113, theme: 'Energy Solutions' },
  title: 'City of the Future?',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "In 2008, in the desert outside Abu Dhabi, work began on a city that was to have no cars, no waste and no carbon emissions. Masdar City was announced with the confidence of a place that had never lacked money: a walled settlement for fifty thousand people, powered entirely by the sun, cooled without air conditioning, its residents carried between buildings by driverless electric pods. It was to be finished by 2016. It was, in the words of one of its own planners, 'a city built from scratch to answer the question of how we should live'." },
    { id: 'B', t: "Some of the answers proved remarkably good. The designers looked back before they looked forward, borrowing from the old cities of the Gulf and North Africa rather than from science fiction. Streets were made deliberately narrow, so that buildings shade one another and the sun rarely reaches the ground. The whole site was raised on a platform and oriented to catch the prevailing breeze. A forty-five-metre wind tower — a modern version of a device used in the region for centuries — funnels air from above down into a public square, where the measured temperature is often ten degrees lower than in the surrounding desert. None of this needs electricity. It needs only geometry, and the willingness to learn from people who lived without power for a thousand years." },
    { id: 'C', t: "The technology fared less well. The driverless pod system, the project's most photographed feature, was built for a single short route and then quietly abandoned as too expensive to extend; visitors now ride the pods as a curiosity between the car park and the first building. The target of zero carbon was revised to 'low carbon'. The fifty thousand residents became, a decade on, a few thousand, most of them students and employees of the companies that had moved in. The 2016 completion date came and went, then 2020, then 2030." },
    { id: 'D', t: "It is easy, and common, to describe Masdar as a failure, and by its own original measures it is one. But the description misses what the project has become. It is, in practice, a laboratory: a place where building materials, cooling systems, solar arrays and water recycling can be tested at the scale of a neighbourhood rather than a research paper, in one of the harshest climates on earth. Techniques that worked have appeared in ordinary buildings across the region. The city that was supposed to be the answer turned out to be more useful as a set of experiments." },
    { id: 'E', t: "The deeper lesson is about where the problem lies. By 2050 the world's urban population is expected to grow by more than two billion, and almost all of those people will live in cities that already exist. A perfect new city for fifty thousand does not help the fifty million in Lagos or Dhaka. Retrofitting old buildings, improving buses that are already running, planting trees on streets that are already paved — these are slow, unglamorous and politically difficult, and they are where nearly all the carbon is. The temptation of the blank site is that it lets planners avoid every existing complication, including the people." },
    { id: 'F', t: "Other experiments have reached similar conclusions by different routes. Songdo, built on reclaimed land near Seoul with sensors in every building and pneumatic tubes that carry rubbish underground, is technically impressive and, residents say, oddly lifeless — a city with everything except the accidents of history that make a place feel inhabited. The question the Masdar planner posed was a good one. The evidence so far suggests that it will be answered not by any single city built from nothing, but by thousands of old ones changed a little at a time." }
  ],
  headings: [
    'i. Old wisdom that needed no power',
    'ii. A different measure of success',
    'iii. The real task is the cities that already exist',
    'iv. An ambitious announcement',
    'v. Where the promises fell short',
    'vi. A second experiment, a similar verdict',
    'vii. How driverless vehicles navigate',
    'viii. Housing costs in the Gulf states'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iv', why: "2008 e'lon: mashinasiz, chiqindisiz, uglerodsiz shahar." },
    { type: 'headings', q: 'Paragraph B', a: 'i', why: "Tor ko'chalar, shamol minorasi — 'needs only geometry'." },
    { type: 'headings', q: 'Paragraph C', a: 'v', why: "Podlar tashlandi, 'zero' → 'low', 50 000 → bir necha ming." },
    { type: 'headings', q: 'Paragraph D', a: 'ii', why: "Muvaffaqiyatsizlik emas — laboratoriya." },
    { type: 'headings', q: 'Paragraph E', a: 'iii', why: "2 milliard odam mavjud shaharlarda yashaydi." },
    { type: 'headings', q: 'Paragraph F', a: 'vi', why: "Songdo — boshqa yo'l, o'xshash xulosa." },

    { type: 'tfng', q: 'Masdar\'s designers drew on traditional architecture of the region.', a: 'TRUE',
      why: "B abzatsi: 'borrowing from the old cities of the Gulf and North Africa'." },
    { type: 'tfng', q: 'The wind tower relies on electric fans to move air.', a: 'FALSE',
      why: "'None of this needs electricity.'" },
    { type: 'tfng', q: 'The pod system was extended across the whole city.', a: 'FALSE',
      why: "C abzatsi: 'built for a single short route and then quietly abandoned'." },
    { type: 'tfng', q: 'Songdo has a larger population than Masdar.', a: 'NOT GIVEN',
      why: "Songdo aholisi soni berilmagan." },

    { type: 'mcq', q: 'In paragraph D, the writer argues that Masdar',
      opts: ['succeeded by its original measures', 'has value as a testing ground', 'should be abandoned', 'was never intended to be finished'], a: 1,
      why: "'It is, in practice, a laboratory'." },
    { type: 'mcq', q: 'Why does the writer say a new city does not solve the main problem?',
      opts: ['New cities are too expensive', 'Most future urban growth will be in existing cities', 'Deserts are unsuitable for building', 'People prefer old cities'], a: 1,
      why: "E abzatsi: 'almost all of those people will live in cities that already exist'." },
    { type: 'mcq', q: 'What do residents reportedly say about Songdo?',
      opts: ['It is too crowded', 'It feels lifeless', 'It is badly designed', 'It is too expensive'], a: 1,
      why: "F abzatsi: 'oddly lifeless'." },

    { type: 'completion', q: 'The public square beneath the wind tower is often ______ degrees cooler than the desert.', a: 'ten / 10', why: "B abzatsi." },
    { type: 'summary', q: 'The writer calls the blank site a ______ because it lets planners avoid existing complications.', a: 'temptation', why: "E abzatsi: 'The temptation of the blank site'." }
  ]
},

{
  n: 15,
  ref: { unit: 8, part: 'A', page: 121, theme: 'Epic Engineering' },
  title: "China's Grand Canal",
  level: 'IELTS 7–8',
  paras: [
    { id: 'A', t: "The longest artificial waterway on earth is not a modern project. The Grand Canal of China runs some eighteen hundred kilometres from Beijing in the north to Hangzhou in the south, and the oldest sections were dug in the fifth century BC. It joins the five great river systems of eastern China, all of which flow from west to east, with a single north–south artery, and in doing so it solved the problem that shaped Chinese history for two thousand years: the grain was grown in the south, and the capital, the army and the frontier were in the north." },
    { id: 'B', t: "The decisive phase came under the Sui dynasty at the beginning of the seventh century. Emperor Yang connected the existing regional canals into one continuous system in a programme lasting roughly six years and employing, according to contemporary records, several million conscripted labourers, a large proportion of whom did not survive it. The dynasty itself fell within a decade, exhausted by the canal, by wars in Korea and by the resentment both had produced. The next dynasty, the Tang, inherited the finished waterway and used it to become one of the richest states in the world. This pattern — one regime pays, the next collects — recurs in the history of great infrastructure." },
    { id: 'C', t: "What moved along it was, above all, grain. The imperial tax was collected largely in rice, and the annual transport of that rice to the capital, known as the caoyun, was a state operation of enormous scale: fleets of barges, a permanent bureaucracy of officials, granaries at intervals along the route and soldiers to guard them. A capital that could be fed regardless of local harvests was a capital that could be defended, and successive dynasties located their seat of government with the canal in mind. When the Ming moved the capital to Beijing in the early fifteenth century, the canal was rebuilt northwards to reach it." },
    { id: 'D', t: "The engineering problems were formidable and the solutions often ahead of their time. The route crosses ground that rises and falls by more than forty metres, and water does not flow uphill. The earliest answer was the flash lock — a single gate that, when opened, released a surge on which boats were carried through — but it wasted water and wrecked vessels. In the tenth century an engineer named Qiao Weiyue built two gates a short distance apart, so that a boat could enter, have the water level adjusted, and leave: the pound lock, the device on which every modern canal depends, and one that Europe would not reproduce for nearly four hundred years." },
    { id: 'E', t: "Decline, when it came, was sudden and had two causes. In 1855 the Yellow River, which the canal had to cross, shifted its entire lower course several hundred kilometres to the north, as it has done periodically throughout history, and cut the canal in two. Almost simultaneously, coastal steamships and then railways offered faster transport that did not silt up or freeze. Within a few decades the northern sections were dry and the grain fleets had gone. A waterway that had carried the tax of an empire for twelve centuries became, over much of its length, a ditch." },
    { id: 'F', t: "It has not stayed one. The southern half never stopped working and today carries more freight than many rivers, mainly coal and construction materials on barges far larger than any imperial vessel. In 2014 the canal was inscribed as a World Heritage Site, and parts of its bed have been incorporated into the South–North Water Transfer Project, a scheme to move water from the wet south to the dry north that is, in ambition and in controversy, the direct descendant of the Sui emperor's programme. The problem the canal was built to solve — that China's water and China's people are in different places — has not gone away. It has simply changed from grain to water itself." }
  ],
  headings: [
    'i. A collapse with two causes',
    'ii. A problem that changed form but not substance',
    'iii. The waterway as the empire\'s food supply',
    'iv. Making water climb',
    'v. Built by one dynasty, enjoyed by the next',
    'vi. Joining rivers that all flow the same way',
    'vii. Boat design on the ancient canal',
    'viii. Tourism along the modern canal'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'vi', why: "Daryolar g'arbdan sharqqa oqadi, kanal shimol–janub." },
    { type: 'headings', q: 'Paragraph B', a: 'v', why: "Sui to'ladi, Tang yig'di — 'one regime pays, the next collects'." },
    { type: 'headings', q: 'Paragraph C', a: 'iii', why: "Don, caoyun, omborlar — poytaxtni boqish." },
    { type: 'headings', q: 'Paragraph D', a: 'iv', why: "Shlyuz — suvni 'tepaga chiqarish'." },
    { type: 'headings', q: 'Paragraph E', a: 'i', why: "Sariq daryo va temir yo'l — ikki sabab." },
    { type: 'headings', q: 'Paragraph F', a: 'ii', why: "Muammo dondan suvga o'zgardi, mohiyat bir." },

    { type: 'tfng', q: 'The Grand Canal was begun in the seventh century AD.', a: 'FALSE',
      why: "Eng qadimgi qismlar miloddan avvalgi V asr; VII asr — birlashtirish bosqichi." },
    { type: 'tfng', q: 'The Sui dynasty benefited most from the completed canal.', a: 'FALSE',
      why: "Sui o'n yil ichida qulagan; foyda Tang'ga tegdi." },
    { type: 'tfng', q: 'The Ming dynasty extended the canal to reach Beijing.', a: 'TRUE',
      why: "C abzatsi: 'rebuilt northwards to reach it'." },
    { type: 'tfng', q: 'The pound lock was invented in Europe and copied in China.', a: 'FALSE',
      why: "D abzatsi: Xitoyda X asr, Yevropa ~400 yil keyin." },

    { type: 'mcq', q: 'What was the main disadvantage of the flash lock?',
      opts: ['It was too slow', 'It wasted water and damaged boats', 'It could not be built in the north', 'It required many workers'], a: 1,
      why: "'it wasted water and wrecked vessels'." },
    { type: 'mcq', q: 'What happened in 1855?',
      opts: ['The canal was completed', 'Railways reached Beijing', 'The Yellow River changed course and broke the canal', 'The capital moved to Hangzhou'], a: 2,
      why: "E abzatsi." },
    { type: 'mcq', q: 'The writer describes the South–North Water Transfer Project as',
      opts: ['a replacement for the canal', 'a tourist attraction', 'the modern successor to the Sui programme', 'a failed scheme'], a: 2,
      why: "'the direct descendant of the Sui emperor's programme'." },

    { type: 'completion', q: 'The ground along the route rises and falls by more than ______ metres.', a: 'forty / 40', why: "D abzatsi." },
    { type: 'short', q: 'What cargo mainly travels on the southern canal today?', a: 'coal and construction materials', why: "F abzatsi." }
  ]
},

{
  n: 16,
  ref: { unit: 8, part: 'B', page: 129, theme: 'Epic Engineering' },
  title: 'Highway of Dreams',
  level: 'IELTS 6.5–7.5',
  paras: [
    { id: 'A', t: "It is possible to drive from the northern coast of Alaska to the southern tip of Argentina — almost. The Pan-American Highway is a network of roads roughly thirty thousand kilometres long, passing through fourteen countries and every climate from Arctic tundra to tropical rainforest to high desert, and it has been called the longest motorable road in the world. The idea was proposed at a conference of American states in 1923 as a symbol of a connected hemisphere, and over the following decades national governments built their sections one by one. The symbol, however, has a gap in it, and the gap has proved more durable than the dream." },
    { id: 'B', t: "The Darién Gap is a stretch of about one hundred kilometres between the end of the road in Panama and its resumption in Colombia. It is not a desert or a mountain range but a lowland of dense rainforest, rivers and swamp, with some of the highest rainfall in the Americas. No road crosses it. Travellers who insist on completing the journey ship their vehicles around it by sea, or, in a small number of well-publicised cases, spend weeks hauling them through on foot. The engineering is not impossible. Roads have been built through worse. The reasons the gap remains are of a different kind." },
    { id: 'C', t: "The first is disease. For most of the twentieth century, South America carried foot-and-mouth disease in its cattle and Central and North America did not, and the forest functioned as a barrier that no quarantine post could have matched. Livestock interests in the north opposed any road that would breach it, and the United States, a major funder of the highway elsewhere, declined to fund this section. The disease has since been largely controlled, but the argument set a pattern: the gap was defended by people far from it, for reasons that had nothing to do with the forest itself." },
    { id: 'D', t: "The second reason is the forest. The Darién is one of the most biologically rich areas on the continent and includes a national park recognised by UNESCO. It is also home to Indigenous peoples, principally the Emberá and the Guna, whose territories a road would divide and whose experience elsewhere in Latin America suggested what would follow: loggers, ranchers and settlers arriving along the new route, and the forest retreating from the roadside outward. Environmental objections to the highway were among the first of their kind to succeed, and they succeeded partly because they coincided with the cattle argument. Two interests that agreed on nothing else agreed on the gap." },
    { id: 'E', t: "The third reason emerged later and is the least discussed. The absence of a road did not make the region empty. It made it unpoliced. Armed groups from the Colombian conflict operated across the border for decades, and the forest became a corridor for narcotics moving north. More recently it has become a corridor for people: hundreds of thousands of migrants a year now walk through the Darién towards the United States, and the crossing, undertaken by families with children, is among the most dangerous in the world. A road, its advocates argue, would at least bring the state. Its opponents reply that it would bring everything else as well." },
    { id: 'F', t: "So the highway remains a line with a break in it, and the break has become a kind of monument. It marks the point at which a twentieth-century idea — that connection is always progress, and that a road is always better than no road — met three objections it could not answer at once. There are proposals, as there have been for ninety years, and there is no construction. The most complete road on earth may be more instructive for the hundred kilometres it lacks than for the thirty thousand it has." }
  ],
  headings: [
    'i. A barrier defended from a distance',
    'ii. A gap that has become a lesson',
    'iii. Nature and the people who live in it',
    'iv. A journey that is almost continuous',
    'v. What fills the space a road would occupy',
    'vi. Terrain that could be crossed but has not been',
    'vii. The cost of building in rainforest',
    'viii. Vehicles suitable for the highway'
  ],
  qs: [
    { type: 'headings', q: 'Paragraph A', a: 'iv', why: "Alyaskadan Argentinagacha — 'almost'." },
    { type: 'headings', q: 'Paragraph B', a: 'vi', why: "'The engineering is not impossible… The reasons the gap remains are of a different kind.'" },
    { type: 'headings', q: 'Paragraph C', a: 'i', why: "Kasallik: 'defended by people far from it'." },
    { type: 'headings', q: 'Paragraph D', a: 'iii', why: "O'rmon va Emberá, Guna xalqlari." },
    { type: 'headings', q: 'Paragraph E', a: 'v', why: "Yo'l yo'qligi joyni bo'sh emas, nazoratsiz qildi — giyohvand, migrantlar." },
    { type: 'headings', q: 'Paragraph F', a: 'ii', why: "Uzilish — yodgorlik, saboq." },

    { type: 'tfng', q: 'The Pan-American Highway was planned as a single project by one government.', a: 'FALSE',
      why: "A abzatsi: 'national governments built their sections one by one'." },
    { type: 'tfng', q: 'The Darién Gap is mountainous.', a: 'FALSE',
      why: "B abzatsi: 'not a desert or a mountain range but a lowland'." },
    { type: 'tfng', q: 'Foot-and-mouth disease has now been completely eliminated in South America.', a: 'FALSE',
      why: "'largely controlled' — to'liq yo'qotilgan emas. Tuzoq: 'completely'." },
    { type: 'tfng', q: 'The Emberá and Guna peoples have formally requested that the road be built.', a: 'NOT GIVEN',
      why: "Ularning pozitsiyasi haqida aniq gap yo'q — faqat hududlari bo'linishi aytilgan." },

    { type: 'mcq', q: 'Why did the United States refuse to fund the Darién section?',
      opts: ['It was too expensive', 'To protect North American cattle from disease', 'Because of the rainforest', 'Because Colombia objected'], a: 1,
      why: "C abzatsi: 'Livestock interests in the north opposed any road that would breach it'." },
    { type: 'mcq', q: 'According to paragraph D, environmental objections succeeded partly because',
      opts: ['UNESCO paid for the campaign', 'they coincided with the cattle industry\'s interests', 'the forest was already protected', 'Indigenous groups had political power'], a: 1,
      why: "'Two interests that agreed on nothing else agreed on the gap.'" },
    { type: 'mcq', q: 'What do advocates of building the road argue in paragraph E?',
      opts: ['It would stop migration', 'It would bring government control to the area', 'It would be cheap', 'It would protect the forest'], a: 1,
      why: "'A road… would at least bring the state.'" },

    { type: 'completion', q: 'The highway passes through ______ countries.', a: 'fourteen / 14', why: "A abzatsi." },
    { type: 'summary', q: 'The writer says the break in the road has become a kind of ______.', a: 'monument', why: "F abzatsi." }
  ]
}

];
