/* ==========================================================================
   ENG_VOCAB — mavzuli lug'at to'plamlari
   --------------------------------------------------------------------------
   Rejadagi qoida: so'z → kollokatsiya → gap → nutq. Shuning uchun bu yerda
   so'z YOLG'IZ turmaydi — har biri o'zi bilan yuradigan so'zlar va tayyor
   gap bilan birga keladi.

   Nega kollokatsiya: "beneficial" ni bilish yetarli emas. Band 8 "highly
   beneficial", "financially beneficial", "beneficial to society" deb yozadi.
   Lexical Resource mezoni aynan shuni o'lchaydi.

   To'plam obyekti:
     name  — mavzu nomi {uz,en}
     note  — mavzuni qayerda ishlatish
     words — [{ w, uz, col:[…], ex }]
             w   — so'z yoki ibora
             uz  — o'zbekcha ma'no
             col — kollokatsiyalar (u bilan yuradigan so'zlar)
             ex  — tayyor gap (Writing/Speaking'ga ko'chirsa bo'ladigan)
   ========================================================================== */
window.ENG_VOCAB = {

  education: {
    name: { uz: "Ta'lim", en: 'Education' },
    note: { uz: "Task 2 da eng ko'p chiqadigan mavzu. Speaking Part 1 da ham doim bor.",
            en: 'The most frequent Task 2 topic, and always present in Speaking Part 1.' },
    words: [
      { w: 'curriculum', uz: "o'quv dasturi", col: ['the national curriculum', 'a broad curriculum', 'curriculum design'], ex: 'The national curriculum should include basic financial literacy.' },
      { w: 'literacy', uz: 'savodxonlik', col: ['literacy rates', 'digital literacy', 'financial literacy'], ex: 'Literacy rates have improved dramatically over the past fifty years.' },
      { w: 'tuition fees', uz: "o'qish to'lovi", col: ['rising tuition fees', 'abolish tuition fees', 'afford tuition fees'], ex: 'Rising tuition fees prevent many talented students from attending university.' },
      { w: 'vocational training', uz: 'kasb-hunar ta\'limi', col: ['practical vocational training', 'invest in vocational training'], ex: 'Vocational training offers a realistic alternative to an academic degree.' },
      { w: 'rote learning', uz: 'yodlab o\'rganish', col: ['rely on rote learning', 'move away from rote learning'], ex: 'Education systems that rely on rote learning discourage independent thought.' },
      { w: 'critical thinking', uz: 'tanqidiy fikrlash', col: ['develop critical thinking', 'critical thinking skills'], ex: 'Schools should place greater emphasis on developing critical thinking skills.' },
      { w: 'academic performance', uz: "o'quv natijasi", col: ['improve academic performance', 'poor academic performance'], ex: 'Regular sleep has a measurable effect on academic performance.' },
      { w: 'lifelong learning', uz: 'umrbod o\'rganish', col: ['promote lifelong learning', 'a culture of lifelong learning'], ex: 'Rapid technological change makes lifelong learning essential.' },
      { w: 'drop out', uz: "o'qishni tashlab ketmoq", col: ['drop out of school', 'a high drop-out rate'], ex: 'Financial pressure is the main reason students drop out of university.' },
      { w: 'access to education', uz: "ta'limga imkoniyat", col: ['equal access to education', 'widen access to education'], ex: 'Equal access to education remains a distant goal in many regions.' }
    ]
  },

  technology: {
    name: { uz: 'Texnologiya', en: 'Technology' },
    note: { uz: "AI, avtomatlashtirish, ijtimoiy tarmoq — hozirgi eng ko'p uchraydigan mavzular.",
            en: 'AI, automation and social media are currently the most frequent angles.' },
    words: [
      { w: 'automation', uz: 'avtomatlashtirish', col: ['increasing automation', 'automation of routine tasks'], ex: 'Automation is likely to replace many routine jobs within a decade.' },
      { w: 'artificial intelligence', uz: 'sun\'iy intellekt', col: ['advances in artificial intelligence', 'AI-driven systems'], ex: 'Advances in artificial intelligence raise serious ethical questions.' },
      { w: 'digital divide', uz: 'raqamli tafovut', col: ['bridge the digital divide', 'a widening digital divide'], ex: 'The digital divide leaves rural communities at a clear disadvantage.' },
      { w: 'privacy', uz: 'shaxsiy daxlsizlik', col: ['invade privacy', 'privacy concerns', 'protect user privacy'], ex: 'Growing privacy concerns have forced companies to change their policies.' },
      { w: 'screen time', uz: 'ekran vaqti', col: ['excessive screen time', 'limit screen time'], ex: 'Excessive screen time may contribute to poor concentration in children.' },
      { w: 'innovation', uz: 'innovatsiya', col: ['technological innovation', 'drive innovation', 'foster innovation'], ex: 'Government funding plays a key role in driving technological innovation.' },
      { w: 'obsolete', uz: 'eskirgan', col: ['become obsolete', 'render something obsolete'], ex: 'Many traditional skills have become obsolete in the digital economy.' },
      { w: 'reliance on', uz: 'bog\'liqlik', col: ['heavy reliance on', 'reduce reliance on'], ex: 'Our heavy reliance on smartphones has weakened face-to-face interaction.' },
      { w: 'surveillance', uz: 'kuzatuv', col: ['mass surveillance', 'surveillance technology'], ex: 'The spread of surveillance technology has sparked a heated public debate.' },
      { w: 'user-friendly', uz: 'qulay, tushunarli', col: ['a user-friendly interface', 'make it more user-friendly'], ex: 'A user-friendly interface makes technology accessible to older users.' }
    ]
  },

  environment: {
    name: { uz: 'Atrof-muhit', en: 'Environment' },
    note: { uz: "Task 2 da klassik mavzu. Task 1 da ham grafik ko'p chiqadi.",
            en: 'A classic Task 2 topic, and a frequent source of Task 1 charts.' },
    words: [
      { w: 'carbon emissions', uz: 'uglerod chiqindilari', col: ['reduce carbon emissions', 'cut emissions drastically'], ex: 'A significant reduction in carbon emissions requires coordinated global action.' },
      { w: 'renewable energy', uz: 'qayta tiklanuvchi energiya', col: ['invest in renewable energy', 'renewable energy sources'], ex: 'Governments should invest far more heavily in renewable energy.' },
      { w: 'sustainable', uz: 'barqaror', col: ['sustainable development', 'environmentally sustainable', 'sustainable practices'], ex: 'Sustainable development balances economic growth with environmental protection.' },
      { w: 'deforestation', uz: 'o\'rmonlarning kesilishi', col: ['large-scale deforestation', 'combat deforestation'], ex: 'Large-scale deforestation has accelerated the loss of biodiversity.' },
      { w: 'pollution', uz: 'ifloslanish', col: ['air pollution', 'tackle pollution', 'pollution levels'], ex: 'Air pollution in major cities has reached dangerous levels.' },
      { w: 'conservation', uz: 'muhofaza qilish', col: ['wildlife conservation', 'conservation efforts'], ex: 'Conservation efforts have brought several species back from the brink.' },
      { w: 'ecosystem', uz: 'ekotizim', col: ['a fragile ecosystem', 'disrupt the ecosystem'], ex: 'Industrial farming continues to disrupt fragile ecosystems.' },
      { w: 'depletion', uz: 'tugash, kamayish', col: ['resource depletion', 'the depletion of natural resources'], ex: 'The depletion of natural resources is accelerating worldwide.' },
      { w: 'landfill', uz: 'chiqindixona', col: ['end up in landfill', 'landfill sites'], ex: 'Around a third of all food produced ends up in landfill.' },
      { w: 'carbon footprint', uz: 'uglerod izi', col: ['reduce your carbon footprint', 'a large carbon footprint'], ex: 'Individuals can reduce their carbon footprint through simple daily choices.' }
    ]
  },

  health: {
    name: { uz: "Sog'liq", en: 'Health' },
    note: { uz: "Speaking Part 1 va Task 2 da bir xil chastotada uchraydi.",
            en: 'Appears equally often in Speaking Part 1 and in Task 2.' },
    words: [
      { w: 'sedentary lifestyle', uz: 'harakatsiz turmush', col: ['lead a sedentary lifestyle', 'an increasingly sedentary lifestyle'], ex: 'An increasingly sedentary lifestyle has driven a rise in obesity.' },
      { w: 'preventive healthcare', uz: 'profilaktik tibbiyot', col: ['invest in preventive healthcare', 'preventive measures'], ex: 'Investment in preventive healthcare reduces long-term costs.' },
      { w: 'life expectancy', uz: 'o\'rtacha umr', col: ['rising life expectancy', 'life expectancy at birth'], ex: 'Rising life expectancy places growing pressure on pension systems.' },
      { w: 'mental health', uz: 'ruhiy salomatlik', col: ['mental health issues', 'mental health support', 'poor mental health'], ex: 'Universities should provide better mental health support for students.' },
      { w: 'obesity', uz: 'semizlik', col: ['childhood obesity', 'rising obesity rates', 'tackle obesity'], ex: 'Childhood obesity rates have tripled over the last thirty years.' },
      { w: 'chronic illness', uz: 'surunkali kasallik', col: ['suffer from a chronic illness', 'manage chronic illness'], ex: 'Chronic illness accounts for the majority of healthcare spending.' },
      { w: 'well-being', uz: 'farovonlik, holat', col: ['physical and mental well-being', 'improve well-being'], ex: 'Regular exercise improves both physical and mental well-being.' },
      { w: 'balanced diet', uz: 'muvozanatli ovqatlanish', col: ['maintain a balanced diet', 'a healthy balanced diet'], ex: 'Maintaining a balanced diet is easier said than done for busy families.' },
      { w: 'healthcare system', uz: 'sog\'liqni saqlash tizimi', col: ['a strained healthcare system', 'reform the healthcare system'], ex: 'The healthcare system is under considerable strain.' },
      { w: 'immune system', uz: 'immunitet', col: ['strengthen the immune system', 'a weakened immune system'], ex: 'Adequate sleep helps to strengthen the immune system.' }
    ]
  },

  work: {
    name: { uz: 'Ish va bandlik', en: 'Work & employment' },
    note: { uz: "Speaking Part 1 ning eng ko'p savoli. Task 2 da ham tez-tez.",
            en: 'The most frequent Speaking Part 1 topic and a regular Task 2 subject.' },
    words: [
      { w: 'work–life balance', uz: 'ish va hayot muvozanati', col: ['maintain a good work–life balance', 'a poor work–life balance'], ex: 'Remote work has made it harder to maintain a healthy work–life balance.' },
      { w: 'job satisfaction', uz: 'ishdan qoniqish', col: ['high job satisfaction', 'increase job satisfaction'], ex: 'Job satisfaction depends far more on autonomy than on salary.' },
      { w: 'unemployment rate', uz: 'ishsizlik darajasi', col: ['a rising unemployment rate', 'youth unemployment'], ex: 'Youth unemployment remains stubbornly high in several regions.' },
      { w: 'workforce', uz: 'ishchi kuchi', col: ['enter the workforce', 'a skilled workforce', 'the ageing workforce'], ex: 'A skilled workforce is essential for long-term economic growth.' },
      { w: 'remote work', uz: 'masofaviy ish', col: ['shift to remote work', 'remote working arrangements'], ex: 'The shift to remote work has permanently changed the labour market.' },
      { w: 'burnout', uz: 'charchash, tugab qolish', col: ['suffer from burnout', 'lead to burnout'], ex: 'Long hours and constant availability often lead to burnout.' },
      { w: 'promotion prospects', uz: "lavozim ko'tarilishi imkoni", col: ['limited promotion prospects', 'good promotion prospects'], ex: 'Limited promotion prospects push talented staff to leave.' },
      { w: 'freelance', uz: 'erkin ish', col: ['work on a freelance basis', 'the freelance economy'], ex: 'A growing number of graduates now work on a freelance basis.' },
      { w: 'productivity', uz: 'unumdorlik', col: ['boost productivity', 'a decline in productivity'], ex: 'Shorter working weeks have been shown to boost productivity.' },
      { w: 'redundant', uz: 'ishdan qisqartirilgan', col: ['be made redundant', 'large-scale redundancies'], ex: 'Thousands of workers were made redundant when the plant closed.' }
    ]
  },

  society: {
    name: { uz: 'Jamiyat', en: 'Society' },
    note: { uz: "Task 2 ning eng keng toifasi: tenglik, oila, jamoa, an'ana.",
            en: 'The broadest Task 2 category: equality, family, community, tradition.' },
    words: [
      { w: 'inequality', uz: 'tengsizlik', col: ['social inequality', 'widening inequality', 'address inequality'], ex: 'Widening inequality threatens social cohesion in many countries.' },
      { w: 'social cohesion', uz: 'ijtimoiy hamjihatlik', col: ['strengthen social cohesion', 'undermine social cohesion'], ex: 'Shared public spaces help to strengthen social cohesion.' },
      { w: 'ageing population', uz: 'aholi qarishi', col: ['a rapidly ageing population', 'cope with an ageing population'], ex: 'A rapidly ageing population will strain public finances.' },
      { w: 'urbanisation', uz: 'shaharlashuv', col: ['rapid urbanisation', 'the pace of urbanisation'], ex: 'Rapid urbanisation has outpaced the development of infrastructure.' },
      { w: 'community', uz: 'jamoa', col: ['a close-knit community', 'a sense of community', 'community projects'], ex: 'Volunteering builds a genuine sense of community.' },
      { w: 'living standards', uz: 'turmush darajasi', col: ['raise living standards', 'falling living standards'], ex: 'Economic growth has raised living standards across the region.' },
      { w: 'social mobility', uz: 'ijtimoiy harakatchanlik', col: ['limited social mobility', 'improve social mobility'], ex: 'Education is the most powerful driver of social mobility.' },
      { w: 'welfare', uz: 'ijtimoiy ta\'minot', col: ['the welfare system', 'welfare benefits'], ex: 'The welfare system provides a safety net for the most vulnerable.' },
      { w: 'norm', uz: 'me\'yor, odat', col: ['social norms', 'become the norm', 'challenge existing norms'], ex: 'Working from home has become the norm in many industries.' },
      { w: 'marginalised', uz: 'chetlashtirilgan', col: ['marginalised groups', 'socially marginalised'], ex: 'Public policy often overlooks the needs of marginalised groups.' }
    ]
  },

  crime: {
    name: { uz: 'Jinoyat va qonun', en: 'Crime & law' },
    note: { uz: "Task 2 da jazo, oldini olish va sabab mavzulari bilan chiqadi.",
            en: 'Appears in Task 2 around punishment, prevention and causes.' },
    words: [
      { w: 'deterrent', uz: 'to\'sqinlik qiluvchi chora', col: ['act as a deterrent', 'an effective deterrent'], ex: 'Longer sentences do not necessarily act as an effective deterrent.' },
      { w: 'rehabilitation', uz: 'qayta tarbiyalash', col: ['focus on rehabilitation', 'rehabilitation programmes'], ex: 'Prisons should focus on rehabilitation rather than punishment alone.' },
      { w: 'reoffend', uz: 'qayta jinoyat qilmoq', col: ['reoffend after release', 'high reoffending rates'], ex: 'A large proportion of released prisoners reoffend within two years.' },
      { w: 'crime rate', uz: 'jinoyatchilik darajasi', col: ['a falling crime rate', 'reduce the crime rate'], ex: 'The crime rate has fallen steadily over the past decade.' },
      { w: 'law enforcement', uz: 'huquq-tartibot', col: ['law enforcement agencies', 'strengthen law enforcement'], ex: 'Law enforcement agencies increasingly rely on data analysis.' },
      { w: 'root cause', uz: 'asosiy sabab', col: ['tackle the root causes', 'the root cause of crime'], ex: 'Tackling the root causes of crime is more effective than harsher penalties.' },
      { w: 'cybercrime', uz: 'kiberjinoyat', col: ['combat cybercrime', 'a surge in cybercrime'], ex: 'The surge in cybercrime has outpaced existing legislation.' },
      { w: 'legislation', uz: 'qonunchilik', col: ['introduce legislation', 'tighten legislation'], ex: 'The government introduced legislation to regulate online content.' },
      { w: 'juvenile', uz: 'voyaga yetmagan', col: ['juvenile crime', 'juvenile offenders'], ex: 'Juvenile offenders benefit most from educational intervention.' },
      { w: 'surveillance cameras', uz: 'kuzatuv kameralari', col: ['install surveillance cameras', 'CCTV surveillance'], ex: 'Installing surveillance cameras has had a mixed effect on street crime.' }
    ]
  },

  government: {
    name: { uz: 'Hukumat va siyosat', en: 'Government & policy' },
    note: { uz: "Task 2 ning \"kim javobgar?\" turidagi savollarida asosiy lug'at.",
            en: 'The core vocabulary for "who is responsible?" style Task 2 questions.' },
    words: [
      { w: 'policy', uz: 'siyosat, chora', col: ['implement a policy', 'a controversial policy', 'policy makers'], ex: 'The policy was implemented in response to growing public pressure.' },
      { w: 'subsidise', uz: 'subsidiya bermoq', col: ['subsidise public transport', 'heavily subsidised'], ex: 'Many countries heavily subsidise public transport to reduce car use.' },
      { w: 'taxpayer', uz: 'soliq to\'lovchi', col: ['taxpayers\' money', 'funded by taxpayers'], ex: 'Such projects are ultimately funded by taxpayers.' },
      { w: 'regulation', uz: 'tartibga solish', col: ['tighter regulation', 'deregulate the market'], ex: 'Tighter regulation of the technology sector is long overdue.' },
      { w: 'infrastructure', uz: 'infratuzilma', col: ['invest in infrastructure', 'ageing infrastructure'], ex: 'Government investment in infrastructure remains insufficient.' },
      { w: 'public spending', uz: 'davlat xarajatlari', col: ['cut public spending', 'increase public spending'], ex: 'Cuts to public spending have hit the poorest households hardest.' },
      { w: 'incentive', uz: 'rag\'bat', col: ['financial incentives', 'provide an incentive'], ex: 'Financial incentives encourage companies to reduce their emissions.' },
      { w: 'accountability', uz: 'javobgarlik', col: ['greater accountability', 'hold someone accountable'], ex: 'Greater accountability is needed in the way public funds are spent.' },
      { w: 'impose', uz: 'joriy etmoq (majburan)', col: ['impose a ban', 'impose restrictions', 'impose a tax'], ex: 'Several cities have imposed restrictions on private car use.' },
      { w: 'long-term', uz: 'uzoq muddatli', col: ['a long-term solution', 'long-term consequences'], ex: 'This measure offers no long-term solution to the underlying problem.' }
    ]
  },

  economy: {
    name: { uz: 'Iqtisod', en: 'Economy' },
    note: { uz: "Task 1 grafiklarida va Task 2 ning iqtisodiy tomonida.",
            en: 'For Task 1 charts and the economic angle of Task 2.' },
    words: [
      { w: 'economic growth', uz: 'iqtisodiy o\'sish', col: ['sustained economic growth', 'stimulate growth'], ex: 'Sustained economic growth depends on a well-educated workforce.' },
      { w: 'cost of living', uz: 'turmush qiymati', col: ['the rising cost of living', 'a cost-of-living crisis'], ex: 'The rising cost of living has forced many families to cut back.' },
      { w: 'disposable income', uz: 'sarflanadigan daromad', col: ['higher disposable income', 'a fall in disposable income'], ex: 'Households with higher disposable income spend more on leisure.' },
      { w: 'inflation', uz: 'inflyatsiya', col: ['rising inflation', 'curb inflation'], ex: 'Central banks raised interest rates in an attempt to curb inflation.' },
      { w: 'consumer spending', uz: 'iste\'mol xarajati', col: ['a decline in consumer spending', 'boost consumer spending'], ex: 'A sharp decline in consumer spending signalled the coming recession.' },
      { w: 'investment', uz: 'sarmoya', col: ['foreign investment', 'attract investment', 'return on investment'], ex: 'The region has struggled to attract foreign investment.' },
      { w: 'globalisation', uz: 'globallashuv', col: ['the effects of globalisation', 'economic globalisation'], ex: 'Globalisation has widened the gap between skilled and unskilled workers.' },
      { w: 'recession', uz: 'inqiroz', col: ['enter a recession', 'recover from a recession'], ex: 'It took nearly a decade for the country to recover from the recession.' },
      { w: 'small businesses', uz: 'kichik biznes', col: ['support small businesses', 'small and medium-sized enterprises'], ex: 'Small businesses were hit hardest by the downturn.' },
      { w: 'purchasing power', uz: 'xarid qobiliyati', col: ['declining purchasing power', 'increase purchasing power'], ex: 'Wage growth has failed to keep pace with declining purchasing power.' }
    ]
  },

  media: {
    name: { uz: 'Media va madaniyat', en: 'Media & culture' },
    note: { uz: "Ijtimoiy tarmoq, reklama, an'ana va globallashuv mavzulari.",
            en: 'Social media, advertising, tradition and globalisation.' },
    words: [
      { w: 'misinformation', uz: 'yolg\'on ma\'lumot', col: ['spread misinformation', 'combat misinformation'], ex: 'Social media platforms have allowed misinformation to spread rapidly.' },
      { w: 'cultural identity', uz: 'madaniy o\'ziga xoslik', col: ['preserve cultural identity', 'a loss of cultural identity'], ex: 'Globalisation threatens to erode local cultural identity.' },
      { w: 'heritage', uz: 'meros', col: ['cultural heritage', 'preserve our heritage', 'heritage sites'], ex: 'Preserving cultural heritage requires sustained public funding.' },
      { w: 'advertising', uz: 'reklama', col: ['targeted advertising', 'ban advertising', 'advertising campaigns'], ex: 'Targeted advertising aimed at children should be tightly regulated.' },
      { w: 'influence', uz: 'ta\'sir', col: ['a powerful influence on', 'exert influence over'], ex: 'The media exerts a powerful influence over public opinion.' },
      { w: 'censorship', uz: 'senzura', col: ['state censorship', 'impose censorship'], ex: 'Censorship of online content remains a deeply divisive issue.' },
      { w: 'stereotype', uz: 'qolip, stereotip', col: ['reinforce stereotypes', 'challenge stereotypes'], ex: 'Advertising often reinforces outdated gender stereotypes.' },
      { w: 'mainstream', uz: 'ommaviy, asosiy', col: ['mainstream media', 'enter the mainstream'], ex: 'Ideas that were once marginal have entered the mainstream.' },
      { w: 'entertainment', uz: 'ko\'ngilochar', col: ['the entertainment industry', 'a form of entertainment'], ex: 'Streaming services have transformed the entertainment industry.' },
      { w: 'authentic', uz: 'haqiqiy, asl', col: ['an authentic experience', 'authentic culture'], ex: 'Mass tourism makes an authentic local experience harder to find.' }
    ]
  },

  'task1-data': {
    name: { uz: 'Task 1 — raqam tili', en: 'Task 1 — data language' },
    note: { uz: "Grafik tasvirlashning barcha lug'ati. Bu to'plamni YODLASH shart.",
            en: 'The complete language of chart description. This set must be memorised.' },
    words: [
      { w: 'increase / rise / grow', uz: 'ortmoq', col: ['increase sharply', 'rise steadily', 'grow rapidly'], ex: 'The figure rose steadily between 2010 and 2015.' },
      { w: 'decrease / fall / decline', uz: 'kamaymoq', col: ['fall sharply', 'decline gradually', 'drop significantly'], ex: 'Sales declined gradually over the following three years.' },
      { w: 'peak', uz: 'eng yuqori nuqta', col: ['reach a peak', 'peak at 40%', 'a peak of 3 million'], ex: 'Consumption reached a peak of just over four million units in 2018.' },
      { w: 'plateau / level off', uz: 'barqarorlashmoq', col: ['level off at', 'remain stable', 'plateau after 2015'], ex: 'After 2015 the figure levelled off at around 30 per cent.' },
      { w: 'fluctuate', uz: 'o\'zgarib turmoq', col: ['fluctuate wildly', 'fluctuate between X and Y'], ex: 'Prices fluctuated between 40 and 60 dollars throughout the period.' },
      { w: 'sharply / dramatically', uz: 'keskin', col: ['rise sharply', 'fall dramatically'], ex: 'Unemployment rose sharply in the first quarter.' },
      { w: 'gradually / steadily', uz: 'asta-sekin', col: ['increase gradually', 'decline steadily'], ex: 'Attendance increased steadily over the whole period.' },
      { w: 'approximately / roughly', uz: 'taxminan', col: ['approximately 40%', 'just over a third', 'slightly under half'], ex: 'Approximately two thirds of respondents supported the proposal.' },
      { w: 'account for', uz: 'ulushini tashkil qilmoq', col: ['account for 25% of', 'account for the majority'], ex: 'Transport accounted for almost a quarter of total emissions.' },
      { w: 'the highest / lowest', uz: 'eng yuqori / past', col: ['the highest figure', 'the lowest proportion'], ex: 'Germany recorded the highest figure, at just under 50 per cent.' },
      { w: 'compared with', uz: 'bilan solishtirganda', col: ['compared with 2010', 'in comparison with'], ex: 'Spending doubled compared with the previous decade.' },
      { w: 'overall', uz: 'umuman', col: ['overall, the trend was upward'], ex: 'Overall, the data show a clear shift towards renewable sources.' }
    ]
  },

  'task2-opinion': {
    name: { uz: 'Task 2 — fikr bildirish', en: 'Task 2 — opinion language' },
    note: { uz: "Insho tuzilmasi uchun tayyor iboralar. Yodlash emas — MOSLASHTIRISH uchun.",
            en: 'Ready phrases for essay structure — to adapt, not to memorise blindly.' },
    words: [
      { w: 'It is often argued that', uz: "ko'pincha shunday deyiladi", col: ['It is often argued that…', 'It is widely believed that…'], ex: 'It is often argued that technology has weakened social bonds.' },
      { w: 'I would argue that', uz: 'menimcha', col: ['I would argue that…', 'In my view…'], ex: 'I would argue that the disadvantages clearly outweigh the benefits.' },
      { w: 'proponents / critics', uz: 'tarafdorlar / tanqidchilar', col: ['proponents of this view', 'critics point out that'], ex: 'Critics point out that such measures rarely address the root cause.' },
      { w: 'outweigh', uz: 'ustun kelmoq', col: ['the benefits outweigh the drawbacks'], ex: 'On balance, the benefits of remote work outweigh its drawbacks.' },
      { w: 'a compelling argument', uz: 'ishonarli dalil', col: ['a compelling argument for', 'make a compelling case'], ex: 'There is a compelling argument for raising the school leaving age.' },
      { w: 'on the one hand … on the other', uz: 'bir tomondan … boshqa tomondan', col: ['On the one hand… On the other hand…'], ex: 'On the one hand, fees fund research; on the other, they deter applicants.' },
      { w: 'address / tackle', uz: 'hal qilmoq', col: ['address the issue', 'tackle the problem effectively'], ex: 'No single policy can tackle this problem effectively.' },
      { w: 'undeniably', uz: 'shubhasiz', col: ['undeniably important', 'it is undeniable that'], ex: 'It is undeniable that access to information has improved.' },
      { w: 'a viable solution', uz: 'amalga oshsa bo\'ladigan yechim', col: ['a viable long-term solution'], ex: 'Investment in public transport is the only viable long-term solution.' },
      { w: 'in conclusion', uz: 'xulosa qilib', col: ['In conclusion,', 'To conclude,'], ex: 'In conclusion, the responsibility lies with both individuals and government.' }
    ]
  },

  'speaking-fluency': {
    name: { uz: 'Speaking — ravonlik iboralari', en: 'Speaking — fluency phrases' },
    note: { uz: "Javobni cho'zish va o'ylash uchun vaqt olish. Speaking'da rasmiy bo'lish shart emas.",
            en: 'For extending an answer and buying thinking time. Speaking need not be formal.' },
    words: [
      { w: "That's an interesting question", uz: 'qiziq savol', col: ["That's an interesting question, actually…"], ex: "That's an interesting question — I've never really thought about it." },
      { w: 'I suppose / I guess', uz: 'menimcha, shekilli', col: ['I suppose it depends on…'], ex: 'I suppose it depends on how much free time you have.' },
      { w: 'particularly / especially', uz: 'ayniqsa', col: ['I particularly enjoy…', 'especially when…'], ex: 'I particularly enjoy reading, especially when I have a quiet evening.' },
      { w: 'to be honest', uz: 'rostini aytsam', col: ['To be honest, I…'], ex: "To be honest, I've never been very interested in team sports." },
      { w: 'the thing is', uz: 'gap shundaki', col: ['The thing is,…'], ex: 'The thing is, most people simply do not have the time.' },
      { w: 'as far as I know', uz: 'bilishimcha', col: ['As far as I know,…'], ex: 'As far as I know, the situation has improved considerably.' },
      { w: 'it varies', uz: "har xil bo'ladi", col: ['It varies quite a lot', 'it really varies'], ex: 'It varies quite a lot depending on the season.' },
      { w: 'having said that', uz: 'shunday bo\'lsa-da', col: ['Having said that,…'], ex: 'Having said that, there are some clear advantages.' },
      { w: 'off the top of my head', uz: 'shu zahoti aytsam', col: ['Off the top of my head,…'], ex: "Off the top of my head, I'd say around thirty per cent." },
      { w: 'I tend to', uz: 'odatda', col: ['I tend to prefer…', 'I tend to avoid…'], ex: 'I tend to prefer studying early in the morning.' }
    ]
  },

  'daily-life': {
    name: { uz: 'Kundalik hayot', en: 'Daily life' },
    note: { uz: "Speaking Part 1 uchun. Oddiy mavzu — lekin lug'at boy bo'lishi kerak.",
            en: 'For Speaking Part 1. Simple topics, but the vocabulary must still be rich.' },
    words: [
      { w: 'routine', uz: 'kundalik tartib', col: ['a daily routine', 'stick to a routine', 'break the routine'], ex: 'I try to stick to a fairly strict morning routine.' },
      { w: 'commute', uz: 'ishga qatnov', col: ['a long commute', 'commute to work'], ex: 'My commute takes about forty minutes each way.' },
      { w: 'chores', uz: 'uy yumushlari', col: ['household chores', 'do the chores'], ex: 'We share the household chores fairly evenly.' },
      { w: 'unwind', uz: 'dam olmoq', col: ['unwind after work', 'a good way to unwind'], ex: 'Reading is my favourite way to unwind after a long day.' },
      { w: 'get into the habit of', uz: 'odat qilmoq', col: ['get into the habit of studying'], ex: "I've got into the habit of reviewing vocabulary before bed." },
      { w: 'run errands', uz: 'yumush bajarmoq', col: ['run errands at the weekend'], ex: 'I usually run errands on Saturday mornings.' },
      { w: 'catch up with', uz: 'ko\'rishmoq, xabar olmoq', col: ['catch up with friends', 'catch up on work'], ex: 'I like to catch up with friends at least once a week.' },
      { w: 'hectic', uz: 'shoshqaloq, band', col: ['a hectic schedule', 'a hectic week'], ex: 'Last week was absolutely hectic — I barely had time to eat.' },
      { w: 'set aside', uz: 'ajratmoq (vaqt)', col: ['set aside time for', 'set aside an hour'], ex: 'I set aside an hour every evening for speaking practice.' },
      { w: 'make the most of', uz: 'imkoniyatdan foydalanmoq', col: ['make the most of your free time'], ex: 'I try to make the most of my weekends.' }
    ]
  },

  people: {
    name: { uz: 'Odamlar va tavsif', en: 'People & description' },
    note: { uz: "Speaking Part 2 da odam tasvirlash kartochkalari doim chiqadi.",
            en: 'Speaking Part 2 regularly asks you to describe a person.' },
    words: [
      { w: 'down to earth', uz: 'oddiy, kamtar', col: ['a down-to-earth person'], ex: 'Despite his success, he has remained completely down to earth.' },
      { w: 'supportive', uz: 'qo\'llab-quvvatlovchi', col: ['a supportive family', 'incredibly supportive'], ex: 'My parents have been incredibly supportive throughout my studies.' },
      { w: 'determined', uz: 'qat\'iyatli', col: ['fiercely determined', 'a determined character'], ex: 'She is fiercely determined and rarely gives up on anything.' },
      { w: 'easy-going', uz: 'bosiq, yengil', col: ['an easy-going personality'], ex: 'He has a very easy-going personality, which makes him easy to work with.' },
      { w: 'role model', uz: 'ibrat', col: ['a positive role model', 'look up to as a role model'], ex: 'My older brother has always been a positive role model for me.' },
      { w: 'get on well with', uz: 'chiqishib ketmoq', col: ['get on well with colleagues'], ex: 'I get on well with almost everyone in my class.' },
      { w: 'have a lot in common', uz: 'umumiy tomoni ko\'p', col: ['we have a lot in common'], ex: 'We have a lot in common, which is probably why we became friends.' },
      { w: 'look up to', uz: 'hurmat qilmoq', col: ['look up to someone'], ex: 'I have always looked up to my first English teacher.' },
      { w: 'influential', uz: 'ta\'sirchan', col: ['a highly influential figure'], ex: 'She was the most influential figure in my early education.' },
      { w: 'thoughtful', uz: 'e\'tiborli, o\'ychan', col: ['a thoughtful gesture', 'thoughtful and considerate'], ex: 'He is thoughtful and considerate towards everyone around him.' }
    ]
  },

  places: {
    name: { uz: 'Joylar va shahar', en: 'Places & cities' },
    note: { uz: "Speaking Part 1/2 va Task 2 ning shahar mavzulari.",
            en: 'Speaking Parts 1 and 2, and urban topics in Task 2.' },
    words: [
      { w: 'bustling', uz: 'gavjum, jonli', col: ['a bustling city centre', 'bustling markets'], ex: 'The old town has a bustling market every Sunday morning.' },
      { w: 'congestion', uz: 'tirbandlik', col: ['traffic congestion', 'reduce congestion'], ex: 'Traffic congestion has become almost unbearable during rush hour.' },
      { w: 'green space', uz: 'yashil hudud', col: ['public green space', 'a lack of green space'], ex: 'A lack of public green space affects residents\' mental health.' },
      { w: 'residential area', uz: 'turar joy hududi', col: ['a quiet residential area'], ex: 'I grew up in a quiet residential area on the edge of the city.' },
      { w: 'amenities', uz: 'qulayliklar', col: ['local amenities', 'good transport amenities'], ex: 'The neighbourhood has excellent local amenities.' },
      { w: 'overcrowded', uz: 'haddan tashqari gavjum', col: ['overcrowded cities', 'become overcrowded'], ex: 'Public transport becomes badly overcrowded at peak times.' },
      { w: 'scenic', uz: 'manzarali', col: ['a scenic route', 'scenic views'], ex: 'The road offers spectacular scenic views of the mountains.' },
      { w: 'run-down', uz: 'eskirgan, tashlandiq', col: ['a run-down neighbourhood'], ex: 'The area was run-down until the council invested in regeneration.' },
      { w: 'vibrant', uz: 'jonli, rang-barang', col: ['a vibrant atmosphere', 'a vibrant cultural scene'], ex: 'The city has a genuinely vibrant cultural scene.' },
      { w: 'urban sprawl', uz: 'shaharning tarqalishi', col: ['uncontrolled urban sprawl'], ex: 'Uncontrolled urban sprawl has swallowed up valuable farmland.' }
    ]
  },

  science: {
    name: { uz: 'Fan va tadqiqot', en: 'Science & research' },
    note: { uz: "Reading matnlarida eng ko'p uchraydigan akademik lug'at.",
            en: 'The academic vocabulary that appears most often in Reading passages.' },
    words: [
      { w: 'hypothesis', uz: 'faraz', col: ['test a hypothesis', 'support the hypothesis'], ex: 'The experiment was designed to test a specific hypothesis.' },
      { w: 'evidence', uz: 'dalil', col: ['compelling evidence', 'a lack of evidence', 'evidence suggests'], ex: 'There is compelling evidence that sleep affects long-term memory.' },
      { w: 'findings', uz: 'natijalar', col: ['research findings', 'the findings suggest'], ex: 'The findings suggest a much stronger link than previously assumed.' },
      { w: 'correlation', uz: 'bog\'liqlik', col: ['a strong correlation between', 'correlation does not imply causation'], ex: 'There is a strong correlation between income and life expectancy.' },
      { w: 'conduct research', uz: 'tadqiqot olib bormoq', col: ['conduct extensive research'], ex: 'The team conducted extensive research over a five-year period.' },
      { w: 'significant', uz: 'sezilarli, muhim', col: ['statistically significant', 'a significant impact'], ex: 'The difference between the two groups was statistically significant.' },
      { w: 'breakthrough', uz: 'yutuq, kashfiyot', col: ['a major breakthrough', 'a scientific breakthrough'], ex: 'The discovery represented a major breakthrough in cancer treatment.' },
      { w: 'phenomenon', uz: 'hodisa', col: ['a widespread phenomenon', 'explain the phenomenon'], ex: 'Scientists have struggled to explain this unusual phenomenon.' },
      { w: 'data', uz: 'ma\'lumot', col: ['analyse data', 'the data indicate'], ex: 'The data indicate a steady improvement over the last decade.' },
      { w: 'implications', uz: 'oqibatlar', col: ['far-reaching implications', 'the implications of'], ex: 'The results have far-reaching implications for public policy.' }
    ]
  },

  'listening-traps': {
    name: { uz: 'Listening — tuzoq signallari', en: 'Listening — trap signals' },
    note: { uz: "Bu so'zlar eshitilsa, javob HOZIRGINA o'zgardi. Ularni tanish — ball demak.",
            en: 'When you hear these, the answer has just changed. Recognising them earns marks.' },
    words: [
      { w: 'actually / in fact', uz: 'aslida', col: ['Actually, it\'s…', 'In fact, we changed it to…'], ex: 'Actually, the meeting has been moved to Thursday.' },
      { w: 'sorry, I mean', uz: 'kechirasiz, aytmoqchimanki', col: ['Sorry, I mean…'], ex: "It's on Tuesday — sorry, I mean Wednesday." },
      { w: 'but then again', uz: 'lekin boshqa tomondan', col: ['But then again,…'], ex: 'We could book the hall, but then again it might be too expensive.' },
      { w: 'rather than', uz: 'o\'rniga', col: ['X rather than Y'], ex: 'We decided on the smaller room rather than the main hall.' },
      { w: 'originally … now', uz: 'avval … hozir', col: ['Originally it was…, but now…'], ex: 'Originally it cost forty pounds, but now it is sixty.' },
      { w: 'instead of', uz: 'o\'rniga', col: ['instead of the usual'], ex: 'We will meet in the library instead of the usual classroom.' },
      { w: 'apart from', uz: 'dan tashqari', col: ['apart from Monday'], ex: 'The centre is open every day apart from Monday.' },
      { w: 'used to', uz: 'ilgari (endi emas)', col: ['It used to be…'], ex: 'It used to be free, but there is now a small charge.' },
      { w: 'not … but', uz: 'emas … balki', col: ['not the blue one but the green one'], ex: 'You need not the blue form but the green one.' },
      { w: 'whereas / while', uz: 'holbuki', col: ['whereas the second group…'], ex: 'The first group finished early, whereas the second needed extra time.' }
    ]
  }
};
