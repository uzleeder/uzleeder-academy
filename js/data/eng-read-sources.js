/* ==========================================================================
   ENG_READ_SOURCES — diniy va tarixiy matnlarning manbalari
   --------------------------------------------------------------------------
   Matnlar shu platforma uchun yozilgan, lekin har voqea quyidagi ishonchli
   manbalarda bor. Diniy matnlar: Qur'on suralari, Sahih hadis to'plamlari va
   klassik siyrat/tarix asarlari (bahsli rivoyatlar kiritilmagan). Tarixiy
   matnlar: akademik monografiyalar va ma'lumotnomalar. Sahifada "Manbalar"
   bo'limida ko'rsatiladi — o'quvchi xohlasa asl manbaga boradi.
   ========================================================================== */
window.ENG_READ_SOURCES = {
  religious: {
    1:  ['Ibn Hisham, As-Sirah an-Nabawiyyah', "Sahih al-Bukhari (Fada'il as-Sahaba)", "Qur'on 9:40 (g'or oyati)", 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    2:  ['Ibn Hisham, As-Sirah an-Nabawiyyah (Umarning Islomga kirishi)', 'Sahih al-Bukhari, Sahih Muslim', 'At-Tabari, Tarikh ar-Rusul wa\'l-Muluk (Quddus 637)', 'Ibn Sa\'d, At-Tabaqat al-Kubra'],
    3:  ['Sahih al-Bukhari (Fada\'il Uthman, Jam\' al-Qur\'an)', 'At-Tirmidhi (Ruma qudug\'i)', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah', 'Adh-Dhahabi, Siyar A\'lam an-Nubala'],
    4:  ['Ibn Hisham, As-Sirah an-Nabawiyyah (hijrat kechasi)', 'Sahih al-Bukhari (Xaybar bayrog\'i)', 'Sahih Muslim (Fada\'il Ali)', 'At-Tabari, Tarikh'],
    5:  ['Ibn Hisham, As-Sirah an-Nabawiyyah (Bilolning azoblanishi)', 'Sahih al-Bukhari (azon boshlanishi)', 'Ibn Sa\'d, At-Tabaqat al-Kubra', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    6:  ["Qur'on, 12-sura (Yusuf) — to'liq qissa", 'Ibn Kathir, Qisas al-Anbiya', 'At-Tabari, Tafsir'],
    7:  ['Sahih al-Bukhari (birinchi vahiy, Xadicha)', 'Ibn Hisham, As-Sirah an-Nabawiyyah', 'Sahih Muslim (Fada\'il Khadijah)', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    8:  ["Qur'on 6:74–83, 21:51–70, 37:99–113, 2:124–129", 'Sahih al-Bukhari (Zamzam, Hojar)', 'Ibn Kathir, Qisas al-Anbiya'],
    9:  ["Qur'on 20 (Ta-Ha), 26 (ash-Shu'ara), 28 (al-Qasas)", 'Ibn Kathir, Qisas al-Anbiya', 'At-Tabari, Tafsir'],
    10: ['Ibn Hisham, As-Sirah an-Nabawiyyah (Madina ahdnomasi)', 'Sahih al-Bukhari (masjid qurilishi, birodarlik)', "Qur'on 3:103", 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    11: ['Ibn Hisham, As-Sirah an-Nabawiyyah (Salmonning hikoyasi, Xandaq)', 'Ibn Sa\'d, At-Tabaqat al-Kubra', 'At-Tabari, Tarikh', 'Al-Hakim, Al-Mustadrak'],
    12: ['Ibn Hisham, As-Sirah an-Nabawiyyah (Uhud, Mu\'ta)', 'Sahih al-Bukhari (Mu\'ta, "Sayfullah")', 'At-Tabari, Tarikh (Yarmuk 636)', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    13: ['Sahih al-Bukhari, Sahih Muslim (Oisha rivoyatlari)', 'Ibn Sa\'d, At-Tabaqat al-Kubra', 'Adh-Dhahabi, Siyar A\'lam an-Nubala', 'Ibn Hajar, Al-Isabah'],
    14: ['Ibn al-Jawzi, Sirat Umar ibn Abd al-Aziz', 'At-Tabari, Tarikh', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah', 'Adh-Dhahabi, Siyar A\'lam an-Nubala'],
    15: ["Qur'on 3:35–59, 19 (Maryam), 4:157–158, 5:110–118", 'Sahih al-Bukhari (Iso haqidagi hadislar)', 'Ibn Kathir, Qisas al-Anbiya'],
    16: ['Dimitri Gutas, Greek Thought, Arabic Culture (1998)', 'Jim Al-Khalili, The House of Wisdom (2011)', 'Jonathan Lyons, The House of Wisdom (2009)', 'Encyclopaedia of Islam — "Bayt al-Hikma"'],
    17: ['Ibn Hajar, Hady as-Sari (Sahih al-Bukhari muqaddimasi)', 'Adh-Dhahabi, Siyar A\'lam an-Nubala', 'Al-Khatib al-Baghdadi, Tarikh Baghdad', 'Jonathan Brown, The Canonization of al-Bukhari and Muslim (2007)'],
    18: ['Sahih al-Bukhari, Sahih Muslim (Abu Hurayra rivoyatlari)', 'Ibn Sa\'d, At-Tabaqat al-Kubra', 'Adh-Dhahabi, Siyar A\'lam an-Nubala', 'Ibn Hajar, Al-Isabah'],
    19: ['Sahih al-Bukhari, Sahih Muslim (Fada\'il Fatimah)', 'Ibn Sa\'d, At-Tabaqat al-Kubra', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah'],
    20: ['Ibn Hisham, As-Sirah an-Nabawiyyah (Mus\'abning Yasribga yuborilishi, Uhud)', 'Sahih al-Bukhari (Mus\'abning kafani)', 'Ibn Sa\'d, At-Tabaqat al-Kubra'],
    21: ['Sahih al-Bukhari (Amin al-Umma)', 'At-Tabari, Tarikh (Shom fathi, Amvos vabosi)', 'Ibn Kathir, Al-Bidayah wa\'n-Nihayah', 'Adh-Dhahabi, Siyar A\'lam an-Nubala'],
    22: ['Ibn Hisham, As-Sirah an-Nabawiyyah (Yosir oilasi)', "Qur'on 16:106", 'Sahih Muslim (Ammor haqida)', 'At-Tabari, Tarikh (Siffin 657)'],
    23: ["Qur'on 71 (Nuh), 11:25–49, 29:14", 'Ibn Kathir, Qisas al-Anbiya', 'At-Tabari, Tafsir'],
    24: ["Qur'on 27 (an-Naml) 15–44, 34:12–14, 38:30–40", 'Ibn Kathir, Qisas al-Anbiya', 'At-Tabari, Tafsir']
  },
  history: {
    1:  ['Peter Frankopan, The Silk Roads (2015)', 'Valerie Hansen, The Silk Road: A New History (2012)', 'Britannica — "Silk Road"'],
    2:  ['Justin Marozzi, Tamerlane: Sword of Islam (2004)', 'Ruy González de Clavijo, Embassy to Tamerlane (1406)', 'Beatrice Forbes Manz, The Rise and Rule of Tamerlane (1989)'],
    3:  ['Kevin Krisciunas, "The Legacy of Ulugh Beg" (1992)', 'MacTutor History of Mathematics — Ulugh Beg', 'V. L. Vyatkin, rasadxona qazishmalari hisoboti (1908–09)'],
    4:  ['Ibn Sina, avtobiografiya (W. Gohlman nashri, 1974)', 'Britannica — "Avicenna"', 'Stanford Encyclopedia of Philosophy — "Ibn Sina"'],
    5:  ['Elizabeth Eisenstein, The Printing Press as an Agent of Change (1979)', 'Tsien Tsuen-hsuin, Paper and Printing (Science and Civilisation in China, 1985)', 'British Library — Diamond Sutra'],
    6:  ['Ole Benedictow, The Black Death 1346–1353 (2004)', 'John Kelly, The Great Mortality (2005)', 'Britannica — "Black Death"'],
    7:  ['Richard Frye, Bukhara: The Medieval Achievement (1965)', 'UNESCO — Historic Centre of Bukhara', 'Britannica — "Bukhara"'],
    8:  ['Ata-Malik Juvayni, History of the World Conqueror (J. A. Boyle tr.)', 'Jack Weatherford, Genghis Khan and the Making of the Modern World (2004)', 'Peter Jackson, The Mongols and the Islamic World (2017)'],
    9:  ['Arthur Waldron, The Great Wall of China: From History to Myth (1990)', 'Britannica — "Great Wall of China"', 'NASA — "China\'s Wall Less Great in View from Space" (2005)'],
    10: ['Babur, Baburnama (W. Thackston tr., 1996)', 'Stephen Dale, The Garden of the Eight Paradises (2004)', 'Britannica — "Babur"'],
    11: ['Peter Hopkirk, The Great Game (1990)', 'Adeeb Khalid, Central Asia: A New History (2021)', 'Britannica — "Turkestan"'],
    12: ['Philip Micklin, "The Aral Sea Disaster" (Annual Review of Earth and Planetary Sciences, 2007)', 'World Bank — Syr Darya Control and Northern Aral Sea Project (2005)', 'UNEP — The Aral Sea: Past, Present, Future'],
    13: ['MacTutor History of Mathematics — al-Khwarizmi', 'Britannica — "al-Khwarizmi"', 'Jim Al-Khalili, The House of Wisdom (2011)'],
    14: ['Roger Crowley, Constantinople: The Last Great Siege 1453 (2005)', 'Steven Runciman, The Fall of Constantinople 1453 (1965)', 'Britannica — "Fall of Constantinople"'],
    15: ['MacTutor History of Mathematics — al-Biruni', 'Britannica — "al-Biruni"', 'Edward Sachau (tr.), Alberuni\'s India (1888)'],
    16: ['Thomas Lentz & Glenn Lowry, Timur and the Princely Vision (1989)', 'Britannica — "Ali Shir Navai"', 'Maria Subtelny, Timurids in Transition (2007)'],
    17: ['Jack Weatherford, Genghis Khan and the Making of the Modern World (2004)', 'Marco Polo, The Travels (Yule–Cordier ed.)', 'Peter Jackson, The Mongols and the West (2005)'],
    18: ['Valerie Hansen, The Silk Road: A New History (2012)', 'Jonathan Bloom, Paper Before Print (2001)', 'Britannica — "Battle of Talas"'],
    19: ['Adeeb Khalid, The Politics of Muslim Cultural Reform: Jadidism in Central Asia (1998)', 'Adeeb Khalid, Central Asia: A New History (2021)', 'Britannica — "Jadidism"'],
    20: ['Robert Allen, The British Industrial Revolution in Global Perspective (2009)', 'Joel Mokyr, The Enlightened Economy (2009)', 'Britannica — "Industrial Revolution"'],
    21: ['Edward Dreyer, Zheng He: China and the Oceans in the Early Ming Dynasty (2007)', 'Louise Levathes, When China Ruled the Seas (1994)', 'Britannica — "Zheng He"'],
    22: ['Caroline Finkel, Osman\'s Dream: The Story of the Ottoman Empire (2005)', 'Halil İnalcık, The Ottoman Empire: The Classical Age (1973)', 'Britannica — "Ottoman Empire"'],
    23: ['NASA History Office — Project Apollo', 'Asif Siddiqi, Challenge to Apollo (2000)', 'Britannica — "Space Race"'],
    24: ['Britannica — "Tashkent"', 'Paul Stronski, Tashkent: Forging a Soviet City 1930–1966 (2010)', 'UNESCO Memory of the World — Samarkand Kufic Qur\'an (Uthman Qur\'an)']
  }
};
