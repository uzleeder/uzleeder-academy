/* ==========================================================================
   DUAS — kunni boshlash duolari (tong), ilm oldidan, kech va uxlash oldidan
   --------------------------------------------------------------------------
   Manbalar (ishonchli, o'zbek tilida):
     [T] tazkiya.uz — «Rasululloh sollallohu alayhi vasallamning tongda va
         tunda o'qigan duolari» (Shayx Muhammad Sodiq Muhammad Yusuf jamoasi;
         islom.uz «Zikr ahlidan so'rang» hay'ati aynan shu sahifaga yo'naltiradi):
         https://tazkiya.uz/virdlar/item/453-rasululloh-sollallohu-alayhi-vasallamning-tongda-va-tunda-o-qigan-duolari.html
     [I] islom.uz — «Imtihon oldidan o'qish foydali bo'lgan duolar» (2023):
         https://islom.uz/maqola/20963
     [S] islom.uz — «O'ringa yotishdan avvalgi duolar» (Mulk surasi):
         https://islom.uz/maqola/10107
     [B] Sahih al-Buxoriy / Sahih Muslim — umum ma'lum hadislar (raqami ko'rsatilgan).
     [Q] Qur'oni karim (sura:oyat).

   Arabcha matn [T] sahifasidan aynan ko'chirilgan; o'qilishi (Kirill) lotinga
   o'girilgan; ma'nosi o'sha sahifadagidek. Har duoda `src` — rivoyat manbasi,
   `ref` — havola kaliti. Takror soni (`n`) hadisda aytilganidek; aytilmagan
   bo'lsa 1. Hech bir duo "o'ylab topilgan" emas.

   Sxema: { id, ar, tr, uz, n, src, ref, core }
     core — kunni boshlash oqimiga kiradi (Today → "Kun duosi"); qolganlari
            faqat Duolar sahifasida.
   ========================================================================== */
window.DUAS = {
  sources: {
    T: { name: 'tazkiya.uz — Tong va tun duolari (islom.uz tavsiyasi)', url: 'https://tazkiya.uz/virdlar/item/453-rasululloh-sollallohu-alayhi-vasallamning-tongda-va-tunda-o-qigan-duolari.html' },
    I: { name: 'islom.uz — Imtihon oldidan o\'qish foydali bo\'lgan duolar', url: 'https://islom.uz/maqola/20963' },
    S: { name: 'islom.uz — O\'ringa yotishdan avvalgi duolar', url: 'https://islom.uz/maqola/10107' },
    B: { name: 'Sahih al-Buxoriy / Sahih Muslim', url: 'https://sunnah.com' },
    Q: { name: 'Qur\'oni karim', url: 'https://quran.com' }
  },

  sets: [
    /* ==================== 1. TONG — KUNNI BOSHLASH ==================== */
    { key: 'morning', title: { uz: 'Tong duolari — kunni boshlash', en: 'Morning adhkar — start the day' },
      lede: { uz: "Bomdoddan keyin, kun ishlariga kirishdan oldin. Rasululloh ﷺ tongda o'qigan duolar — tartibda, takror soni bilan.", en: 'After Fajr, before the day\'s work. The supplications the Prophet ﷺ said in the morning, in order, with repetition counts.' },
      items: [
        { id: 'wake', core: false, n: 1, src: 'Buxoriy 6312, Muslim 2711', ref: 'B',
          ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
          tr: 'Alhamdu lillaahillazii ahyaanaa ba\'da maa amaatanaa va ilayhin nushuur',
          uz: "Uyg'onganda. Bizni o'ldirganidan (uxlatganidan) keyin qayta tiriltirgan Allohga hamd bo'lsin. Qaytish ham Uning huzurigadir." },

        { id: 'bika-asbahna', core: true, n: 1, src: 'Abu Dovud, Termiziy, Ibn Moja (Abu Hurayra r.a.)', ref: 'T',
          ar: 'اللهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
          tr: 'Allohumma bika asbahnaa va bika amsaynaa va bika nahyaa va bika namuutu va ilaykan nushuur',
          uz: "Allohim, Sening noming ila tong ottirdik, Sening noming ila kech kirgizdik. Sening noming ila tirilamiz va Sening noming ila o'lamiz. Va Senga qaytajakmiz." },

        { id: 'asbahna-mulk', core: false, n: 1, src: 'Abu Dovud (Abu Molik Ash\'ariy r.a.)', ref: 'T',
          ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ للهِ رَبِّ العَالَمِينَ. اللهُمَّ أَسْأَلُكَ خَيْرَ هَذَا اليَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ',
          tr: 'Asbahnaa va asbahal mulku lillaahi robbil \'aalamiin. Allohumma as\'aluka xoyro haazal yavmi fathahu va nasrohu va nuurohu va barokatahu va hudaahu va a\'uuzu bika min sharri maa fiihi va sharri maa ba\'dah',
          uz: "Biz ham, mulk ham olamlar Parvardigori Allohniki bo'lgan holda tong ottirdik. Ey Rabbim, bu kunning yaxshisini, fath bo'lishini, g'alabasini, nurini, barakasini, hidoyatini so'rayman. Va Sendan bu kunning va bu kundan keyingisining yomonligidan panoh tilayman." },

        { id: 'sayyid-istighfar', core: true, n: 1, src: 'Buxoriy 6306 (Shaddod ibn Avs r.a.) — Sayyidul istig\'for', ref: 'T',
          ar: 'اللهُمَّ أَنْتَ رَبِّي، لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي، وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
          tr: 'Allohumma anta robbii laa ilaaha illaa anta xolaqtanii va anaa \'abduka va anaa \'alaa \'ahdika va va\'dika mastato\'tu, a\'uuzu bika min sharri maa sona\'tu, abuu\'u laka bini\'matika \'alayya va abuu\'u bizambii fag\'firlii fainnahuu laa yag\'firuz zunuuba illaa anta',
          uz: "Allohim, Sen Parvardigorimsan, Sendan boshqa iloh yo'q. Meni xalq qilding va men Sening qulingman. Men Senga bergan va'damda va ahdimda qodir bo'lganimcha turibman. Qilgan narsalarimning yomonidan Sening noming bilan panoh tilayman. Menga ato qilgan ne'matlaringga iqror bo'ldim va gunohlarimga ham iqror bo'ldim. Gunohlarimni kechir — chunki Sendan boshqasi gunohlarni kechira olmaydi. (Tongda aytib shu kuni vafot etsa — jannatga kiradi.)" },

        { id: 'nimat', core: false, n: 1, src: 'Abu Dovud (Abdulloh ibn G\'annom r.a.)', ref: 'T',
          ar: 'اللهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ، فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
          tr: 'Allohumma maa asbaha bii min ni\'matin faminka vahdaka laa shariika lak, falakal hamdu va lakash shukr',
          uz: "Allohim, men bilan tong ottirgan ne'matlar Sen tomondandir. Sen yakkayu yolg'izdirsan, Sening sheriging yo'q. Senga hamd va shukrlar bo'lsin. (Kim tongda aytsa — kunduzning shukrini ado qilibdi.)" },

        { id: 'bismillah-la-yadurr', core: true, n: 3, src: 'Abu Dovud, Termiziy (Usmon ibn Affon r.a.)', ref: 'T',
          ar: 'بِاسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاء وَهُوَ السَّمِيعُ العَلِيمُ',
          tr: 'Bismillaahillazii laa yadurru ma\'asmihii shay\'un fil ardi va laa fis samaa\'i va huvas samii\'ul \'aliim',
          uz: "Shunday Allohning ismi bilan boshlaymanki, Uning ismi tufayli yeru osmonda biror narsa zarar bera olmaydi. U eshituvchi va biluvchi Zotdir. (Uch marta aytsa — unga biror narsa zarar bermaydi.)" },

        { id: 'raditu', core: false, n: 3, src: 'Abu Dovud (Abu Said Xudriy r.a.)', ref: 'T',
          ar: 'رَضِيتُ بِاللهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ صلى الله عليه وسلم رَسُولاً',
          tr: 'Rodiitu billaahi robban va bil islaami diinan va bimuhammadin sollallohu alayhi vasallama rosuulaa',
          uz: "Allohni Rabbim deb, Islomni dinim deb, Muhammad alayhissalomni rasul deb rozi bo'ldim. (Kim aytsa — unga jannat vojib bo'ladi.)" },

        { id: 'afini', core: false, n: 3, src: 'Abu Dovud (Abu Bakra r.a.)', ref: 'T',
          ar: 'اللهُمَّ عَافِنِي فِي بَدَنِي، اللهُمَّ عَافِنِي فِي سَمْعِي، اللهُمَّ عَافِنِي فِي بَصَرِي، لا إلَهَ إلاَّ أنْتَ. اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الكُفْرِ وَالفَقْرِ، اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ القَبْرِ لاَ إِلَهَ إِلاَّ أَنْتَ',
          tr: 'Allohumma \'aafinii fii badanii, Allohumma \'aafinii fii sam\'ii, Allohumma \'aafinii fii basorii, laa ilaaha illaa anta. Allohumma innii a\'uuzu bika minal kufri val faqri, Allohumma innii a\'uuzu bika min \'azaabil qobr, laa ilaaha illaa anta',
          uz: "Allohim, badanimni, qulog'imni va ko'zimni ofiyatda qil. Ey Rabbim, Sening noming ila kufrdan, kambag'allikdan va qabr azobidan panoh tilayman. Sendan boshqa iloh yo'q." },

        { id: 'three-qul', core: false, n: 3, src: 'Abu Dovud, Termiziy, Nasoiy (Abdulloh ibn Hubayb r.a.)', ref: 'T',
          ar: 'قُلْ هُوَ اللهُ أحَدٌ… ﴿الإخلاص﴾ · قُلْ أعُوذُ بِرَبِّ الفَلَقِ… ﴿الفلق﴾ · قُلْ أعُوذُ بِرَبِّ النَّاسِ… ﴿الناس﴾',
          tr: 'Qul huvallohu ahad (Ixlos) · Qul a\'uuzu birobbil falaq (Falaq) · Qul a\'uuzu birobbin naas (Nos)',
          uz: "Ixlos, Falaq va Nos suralari — har birini uch martadan. «Kechki payt va ertalab uch martadan aytsang, senga har bir narsada kifoya qiladi.»" },

        { id: 'ushhiduka', core: false, n: 4, src: 'Abu Dovud (Anas r.a.)', ref: 'T',
          ar: 'اللهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أنْتَ اللهُ لاَ إلَهَ إلاَّ أنْتَ، وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
          tr: 'Allohumma innii asbahtu ush-hiduka va ush-hidu hamalata \'arshika va malaa\'ikatika va jamii\'a xolqik, annaka antallohu laa ilaaha illaa anta vahdaka laa shariika laka va anna Muhammadan \'abduka va rosuuluk',
          uz: "Allohim, albatta, men tong ottirdim. Seni hamda arshingni ko'taruvchi farishtalaringni va hamma xalq qilgan narsalaringni guvoh qilib aytamanki, Sendan boshqa iloh yo'q, Muhammad ﷺ Sening bandang va rasulingdir. (To'rt marta aytsa — Alloh uni butunlay do'zaxdan xalos qiladi.)" },

        { id: 'fatir', core: false, n: 1, src: 'Abu Dovud, Termiziy (Abu Bakr Siddiq r.a.ga o\'rgatilgan)', ref: 'T',
          ar: 'اللهُمَّ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ عَالِمَ الغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَشَرِّ الشَّيْطَانِ وَشِرْكِهِ',
          tr: 'Allohumma faatiros samaavaati val ardi \'aalimal g\'oybi vash shahaadati robba kulli shay\'in va maliikah, ash-hadu allaa ilaaha illaa anta, a\'uuzu bika min sharri nafsii va sharrish shaytooni va shirkih',
          uz: "Ey yeru osmonni bor qilgan Rabbim, ey g'oybni va shohidni biluvchi Rabbim, Sen har bir narsaning Parvardigori va podshohidirsan. Guvohlik beramanki, Sendan boshqa iloh yo'q. Nafsimning yomonligidan, shaytonning yomonligiyu shirkidan Sening noming ila panoh tilayman." },

        { id: 'hasbiyallah', core: false, n: 7, src: 'Ibn Sunniy (Abu Dardo r.a.)', ref: 'T',
          ar: 'حَسْبِيَ اللهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ العَرْشِ العَظِيمِ',
          tr: 'Hasbiyallohu laa ilaaha illaa huva \'alayhi tavakkaltu va huva robbul \'arshil \'aziim',
          uz: "Alloh menga kifoya qiladi. Undan boshqa iloh yo'q. Unga tavakkal qildim. U ulug' arshning Rabbidir. (Yetti marta — dunyo va oxiratdagi muhim ishlarida Allohning O'zi kifoya qiladi.)" },

        { id: 'ya-hayyu', core: false, n: 1, src: 'Ibn Sunniy (Anas r.a. — Fotima r.a.ga vasiyat)', ref: 'T',
          ar: 'يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
          tr: 'Yaa Hayyu yaa Qoyyuumu birohmatika astag\'iisu aslih lii sha\'nii kullahu va laa takilnii ilaa nafsii torfata \'ayn',
          uz: "Ey Hay (tirik) va Qayyum sifatiga ega bo'lgan Zot, Sendan yordam so'rayman. Sha'nimni har bir narsada isloh et va ko'z yumib ochguncha muddat ham o'z holimga tashlab qo'yma." },

        { id: 'afiyah', core: false, n: 1, src: 'Abu Dovud, Nasoiy, Ibn Moja (Ibn Umar r.a.) — Rasululloh ﷺ hech tark qilmas edilar', ref: 'T',
          ar: 'اللَّهُمَّ إنِّي اسْألُكَ العَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إنِّي اسْألُكَ العَفْوَ وَالعَافِيَةَ فِي دِيْنِي وَدُنْيَايَ وَأهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَورَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوقِي وَأعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
          tr: 'Allohumma innii as\'alukal \'aafiyata fid dunyaa val aaxiroh. Allohumma innii as\'alukal \'afva val \'aafiyata fii diinii va dunyaaya va ahlii va maalii. Allohummastur \'avrootii va aamin rov\'aatii. Allohummahfaznii min bayni yadayya va min xolfii va \'an yamiinii va \'an shimaalii va min favqii va a\'uuzu bi\'azomatika an ug\'taala min tahtii',
          uz: "Allohim, men Sendan dunyo va oxiratda ofiyat so'rayman. Ey Rabbim, dinimda va dunyoimda, ahlimda va molimda avf va ofiyat so'rayman. Ey Rabbim, avratimni bekit, xavflarimni omonlikka aylantir. Ey Allohim, meni oldimdan, orqamdan, o'ng tomonimdan, chap tomonimdan, ustimdan saqlagin. Ey Rabbim, ostimdan halok qilishingdan Sening azamating ila panoh tilayman." },

        { id: 'ilm-nafi', core: true, n: 1, src: 'Ibn Moja, Ibn Sunniy (Ummu Salama r.a.) — bomdoddan keyin', ref: 'T',
          ar: 'اللَّهُمَّ إنِّي اسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً',
          tr: 'Allohumma innii as\'aluka \'ilman naafi\'an va rizqon toyyiban va \'amalan mutaqobbalaa',
          uz: "Allohim, Sendan foydali ilm, pokiza rizq, qabul bo'ladigan amal so'rayman. (O'quvchi uchun kunning eng muhim duosi.)" },

        { id: 'ayat-kursi', core: true, n: 1, src: 'Buxoriy 2311 (Abu Hurayra r.a.); Nasoiy, Hokim — tong va kech', ref: 'B',
          ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
          tr: 'Allohu laa ilaaha illaa huval hayyul qoyyuum. Laa ta\'xuzuhuu sinatuv va laa navm. Lahuu maa fis samaavaati va maa fil ard. Man zallazii yashfa\'u \'indahuu illaa bi iznih. Ya\'lamu maa bayna aydiihim va maa xolfahum va laa yuhiituuna bishay\'im min \'ilmihii illaa bimaa shaa\'. Vasi\'a kursiyyuhus samaavaati val ard, va laa ya\'uuduhuu hifzuhumaa va huval \'aliyyul \'aziim',
          uz: "Oyatul Kursiy (Baqara, 255). Alloh — Undan o'zga iloh yo'q, U tirik va (barchani) qoim tutuvchidir. Uni mudroq ham, uyqu ham olmas. Osmonlaru yerdagi narsalar Unikidir. Uning huzurida Uning iznisiz kim shafoat qila olur? U ularning oldilaridagi va ortlaridagini bilur; ular Uning ilmidan U xohlagan narsadan boshqasini qamrab ololmaslar. Kursiysi osmonlaru yerdan kengdir, ularni saqlab turish Unga og'ir emas. U Oliy va Ulug'dir. (Kim tongda o'qisa — kechgacha, kechda o'qisa — tonggacha himoyada bo'ladi.)" },

        { id: 'subhan-100', core: false, n: 100, src: 'Muslim 2691 (Abu Hurayra r.a.)', ref: 'T',
          ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
          tr: 'Subhaanallohi va bihamdihi',
          uz: "Allohga hamd aytish bilan Uni aybu nuqsonlardan poklab yod etaman. (Ertalab yoki kechqurun yuz marta aytsa — qiyomat kuni biror kishi undan afzal bo'lmaydi, faqat shuncha yoki undan ko'p aytgan bo'lsagina.)" },

        { id: 'tahlil-10', core: false, n: 10, src: 'Buxoriy, Muslim (Abu Ayyub Ansoriy r.a.)', ref: 'T',
          ar: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
          tr: 'Laa ilaaha illallohu vahdahu laa shariika lahu, lahul mulku va lahul hamdu va huva \'alaa kulli shay\'in qodiir',
          uz: "Allohdan boshqa iloh yo'q, U yolg'iz, Uning sherigi ham yo'q, butun mulk Uniki, hamd ham Unga xos va U har bir narsaga qodirdir. (O'n marta aytsa — Ismoil zurriyotidan to'rt kishini ozod qilgandek bo'ladi.)" },

        { id: 'subhan-adad', core: false, n: 3, src: 'Muslim (Juvayriya r.a.)', ref: 'T',
          ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَى نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
          tr: 'Subhaanallohi va bihamdihi \'adada xolqihi va ridoo nafsihi va zinata \'arshihi va midaada kalimaatihi',
          uz: "Yaratganlarining adadicha, nafsi rozi bo'lgunicha, arshning vaznicha, kalimalarining uzunligicha Allohga hamd aytaman va Uni poklayman. (Uch marta — tarozida tongdan tushgacha aytilgan zikrdan og'ir keladi.)" },

        { id: 'salawat', core: false, n: 10, src: 'Buxoriy 3370 (Ka\'b ibn Ujra r.a.) — salavot matni', ref: 'T',
          ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إبْرَاهِيمَ وَعَلَى آلِ إبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى ابْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
          tr: 'Allohumma solli \'alaa Muhammadin va \'alaa aali Muhammad, kamaa sollayta \'alaa Ibroohiima va \'alaa aali Ibroohiim, innaka hamiidum majiid. Allohumma baarik \'alaa Muhammadin va \'alaa aali Muhammad, kamaa baarokta \'alaa Ibroohiima va \'alaa aali Ibroohiim, innaka hamiidum majiid',
          uz: "Allohim, Ibrohim alayhissalomni va u zotning oilalarini yaxshilik va rahmatda qilganing kabi, Muhammad alayhissalomni va u zotning oilalarini ham yaxshilik va rahmatda qil. Albatta, Sen maqtovli ulug' Zotsan. Allohim, Ibrohim alayhissalomni va oilalarini barakotli qilganingdek, Muhammad alayhissalomni va oilalarini ham barakotli qil. Albatta, Sen maqtovli ulug' Zotsan." }
      ]
    },

    /* ==================== 2. ILM — DARS OLDIDAN VA KEYIN ==================== */
    { key: 'study', title: { uz: 'Ilm duolari — dars oldidan va keyin', en: 'Study duas — before and after a lesson' },
      lede: { uz: "Har dars/mashq boshida bittasi, tugatgach ikkinchisi. Qiyin savolda — «laa sahla».", en: 'One before each lesson, one after; for a hard question — "la sahla".' },
      items: [
        { id: 'rabbi-zidni', core: false, n: 1, src: 'Qur\'on, Toha 20:114', ref: 'Q',
          ar: 'رَّبِّ زِدْنِي عِلْمًا',
          tr: 'Robbi zidnii \'ilmaa',
          uz: "Rabbim, ilmimni ziyoda qil. (Har darsdan oldin — Payg'ambar ﷺga buyurilgan yagona «ko'paytir» duosi ilm haqida.)" },

        { id: 'ishrah-sadri', core: false, n: 1, src: 'Qur\'on, Toha 20:25–28 (Muso a.s. duosi); islom.uz — imtihonda', ref: 'I',
          ar: 'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي',
          tr: 'Robbishroh lii sodrii, va yassir lii amrii, vahlul \'uqdatan min lisaanii, yafqohuu qovlii',
          uz: "Rabbim, qalbimni keng qil, ishimni oson qil, tilimdan tugunni yechib yuborginki, so'zimni anglashsin. (Speaking va imtihon oldidan.)" },

        { id: 'fahm', core: false, n: 1, src: 'islom.uz — «Imtihon oldidan o\'qish foydali bo\'lgan duolar» (ahli ilm tajribasi; sahifada faqat o\'qilishi — arabchasi o\'qilishidan tiklangan)', ref: 'I',
          ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فَهْمَ النَّبِيِّينَ وَحِفْظَ الْمُرْسَلِينَ الْمُقَرَّبِينَ. اللَّهُمَّ اجْعَلْ أَلْسِنَتَنَا عَامِرَةً بِذِكْرِكَ وَقُلُوبَنَا بِخَشْيَتِكَ وَأَسْرَارَنَا بِطَاعَتِكَ إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَحَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
          tr: 'Allohumma innii as\'aluka fahman nabiyyiin, va hifzal mursaliinal muqorrobiin. Allohummaj\'al alsinatanaa \'aamirotan bizikrik, va quluubanaa bixoshyatik, va asroronaa bitoo\'atik, innaka \'alaa kulli shay\'in qodiir, va hasbunallohu va ni\'mal vakiil',
          uz: "Allohim! Men Sendan payg'ambarlarning fahmini, muqarrab rasullarning xotirasini so'rayman. Allohim! Tilimizni O'zingning zikring bilan, qalbimizni Sendan qo'rqish bilan, sirimizni O'zingning toating bilan obod qil. Sen barcha narsaga qodirsan. Allohning O'zi bizga kifoya, U naqadar yaxshi vakil. (Mavzuni takrorlashdan oldin.)" },

        { id: 'la-sahla', core: false, n: 1, src: 'Ibn Sunniy; Ibn Hibbon (Anas r.a.)', ref: 'I',
          ar: 'اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً',
          tr: 'Allohumma laa sahla illaa maa ja\'altahu sahlaa, va anta taj\'alul hazna izaa shi\'ta sahlaa',
          uz: "Allohim, Sen oson qilgan narsagina osondir. Xohlasang, qiyinni oson qilursan. (Qiyin savol, qiyin mavzu — o'sha payt.)" },

        { id: 'astawdiuka', core: false, n: 1, src: 'islom.uz — «Imtihon oldidan…» (ahli ilm tajribasi; arabchasi o\'qilishidan tiklangan)', ref: 'I',
          ar: 'اللَّهُمَّ إِنِّي أَسْتَوْدِعُكَ مَا قَرَأْتُ وَمَا حَفِظْتُ، فَزِدْهُ عَلَيَّ عِنْدَ حَاجَتِي إِلَيْهِ، وَحَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
          tr: 'Allohumma innii astavdi\'uka maa qoro\'tu va maa hafiztu, fa zidhu \'alayya \'inda haajatii ilayhi, va hasbunallohu va ni\'mal vakiil',
          uz: "Allohim! O'qigan va yod olgan narsalarimni O'zingga topshirdim, ehtiyojim tushganda ularni ziyoda qil. Allohning O'zi bizga kifoya, U naqadar yaxshi vakil. (Dars/takrorni tugatgach.)" },

        { id: 'hamd-hidayah', core: false, n: 1, src: 'Qur\'on, A\'rof 7:43', ref: 'Q',
          ar: 'الْحَمْدُ لِلَّهِ الَّذِي هَدَانَا لِهَٰذَا وَمَا كُنَّا لِنَهْتَدِيَ لَوْلَا أَنْ هَدَانَا اللَّهُ',
          tr: 'Alhamdu lillaahillazii hadaanaa lihaazaa, va maa kunnaa linahtadiya lav laa an hadaanalloh',
          uz: "Bizni bunga hidoyat qilgan Allohga hamdlar bo'lsin. Agar Alloh bizni hidoyat qilmasa, o'zimiz hidoyat topa olmas edik. (Ish, test yoki kun yakunida — shukr.)" }
      ]
    },

    /* ==================== 3. KECH ==================== */
    { key: 'evening', title: { uz: 'Kech duolari', en: 'Evening adhkar' },
      lede: { uz: "Asrdan keyin — shomgacha yoki shomdan keyin. Tong duolarining kechki shakli.", en: 'After Asr until Maghrib (or after Maghrib). Evening forms of the morning adhkar.' },
      items: [
        { id: 'bika-amsayna', core: false, n: 1, src: 'Abu Dovud, Termiziy, Ibn Moja (Abu Hurayra r.a.)', ref: 'T',
          ar: 'اللهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِير',
          tr: 'Allohumma bika amsaynaa va bika asbahnaa va bika nahyaa va bika namuutu va ilaykal masiir',
          uz: "Allohim, Sening noming ila kech kirgizdik, Sening noming ila tong ottirdik. Sening noming ila tirilamiz va Sening noming ila vafot etamiz. Va Senga qaytajakmiz." },
        { id: 'amsayna-mulk', core: false, n: 1, src: 'Abu Dovud (Abu Molik Ash\'ariy r.a.)', ref: 'T',
          ar: 'أمْسَينَا وَأَمْسَى الْمُلْكُ للهِ رَبِّ العَالَمِينَ. اللهُمَّ أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيلَةِ، فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا، وَشَرِّ مَا بَعْدَهَا',
          tr: 'Amsaynaa va amsal mulku lillaahi robbil \'aalamiin. Allohumma as\'aluka xoyro haazihil laylati fathahu va nasrohu va nuurohu va barokatahu va hudaahu va a\'uuzu bika min sharri maa fiihaa va sharri maa ba\'dahaa',
          uz: "Biz ham, mulk ham olamlar Parvardigori Allohniki bo'lgan holda kech kirgizdik. Ey Rabbim, bu kechaning yaxshisini, fathini, g'alabasini, nurini, barakasini, hidoyatini so'rayman va undagi hamda undan keyingi yomonlikdan panoh tilayman." },
        { id: 'nimat-e', core: false, n: 1, src: 'Abu Dovud (Abdulloh ibn G\'annom r.a.)', ref: 'T',
          ar: 'اللهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ، لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
          tr: 'Allohumma maa amsaa bii min ni\'matin faminka vahdaka laa shariika lak, falakal hamdu va lakash shukr',
          uz: "Allohim, men bilan kech kirgizgan ne'matlar Sen tomondandir. Sen yakkayu yolg'izdirsan, Sening sheriging yo'q. Senga hamd va shukrlar bo'lsin. (Kechaning shukri.)" },
        { id: 'kalimat', core: false, n: 3, src: 'Muslim (Abu Hurayra r.a.)', ref: 'T',
          ar: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
          tr: 'A\'uuzu bikalimaatillaahit taammaati min sharri maa xolaq',
          uz: "Allohning hamma kalimalari bilan U yaratgan narsalarning yomonligidan panoh tilayman. (Kech kirganida — «senga hech narsa zarar bermaydi».)" },
        { id: 'ushhiduka-e', core: false, n: 4, src: 'Abu Dovud (Anas r.a.)', ref: 'T',
          ar: 'اللهُمَّ إنِّي أمْسَيتُ أُشْهِدُكَ، وَأشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ وَجَمِيعَ خَلْقِكَ، أنَّكَ أنْتَ اللهُ لاَ إلَهَ إلاَّ أنْتَ، وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
          tr: 'Allohumma innii amsaytu ush-hiduka va ush-hidu hamalata \'arshika va malaa\'ikatika va jamii\'a xolqik, annaka antallohu laa ilaaha illaa anta vahdaka laa shariika laka va anna Muhammadan \'abduka va rosuuluk',
          uz: "Allohim, men kech kirgizdim. Seni, arshingni ko'taruvchi farishtalaringni va butun xalqingni guvoh qilib aytamanki, Sendan boshqa iloh yo'q, Muhammad ﷺ Sening bandang va rasulingdir." },
        { id: 'e-shared', core: false, n: 1, src: 'Tong bilan bir xil (yuqoridagi manbalar)', ref: 'T',
          ar: '—',
          tr: 'Kechda ham o\'qiladi: Sayyidul istig\'for · Bismillaahillazii laa yadurru (3×) · Rodiitu billaahi (3×) · Allohumma \'aafinii (3×) · Ixlos, Falaq, Nos (3×) · Allohumma faatiros samaavaati · Hasbiyalloh (7×) · Yaa Hayyu yaa Qoyyuum · Allohumma innii as\'alukal \'aafiyata · Oyatul Kursiy · Subhaanallohi va bihamdihi (100×) · Salavot',
          uz: "Bu duolar hadislarda «tongda va kechda» deb kelgan — kechqurun ham o'sha matn bilan takrorlanadi." }
      ]
    },

    /* ==================== 4. UXLASH OLDIDAN ==================== */
    { key: 'sleep', title: { uz: "Uxlash oldidan", en: 'Before sleep' },
      lede: { uz: "Kun yakuni: 21:20 — jadvaldagi uyqu bloki oldidan.", en: 'End of the day, before the 21:20 sleep block.' },
      items: [
        { id: 'mulk', core: false, n: 1, src: 'Termiziy, Hokim (Ibn Abbos r.a.); islom.uz — «O\'ringa yotishdan avvalgi duolar»', ref: 'S',
          ar: 'سُورَةُ الْمُلْك ﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ…﴾',
          tr: 'Mulk (Taborak) surasi — to\'liq',
          uz: "Payg'ambarimiz ﷺ shu surani o'qimasdan o'rinlariga kirib uxlamasdilar. Qabr azobidan himoya qiluvchi sura." },
        { id: 'qul-blow', core: false, n: 3, src: 'Buxoriy 5017 (Oisha r.a.)', ref: 'B',
          ar: 'قُلْ هُوَ اللهُ أحَدٌ · قُلْ أعُوذُ بِرَبِّ الفَلَقِ · قُلْ أعُوذُ بِرَبِّ النَّاسِ',
          tr: 'Ixlos · Falaq · Nos — kaftga puflab butun badanga surtiladi (boshdan boshlab), uch marta',
          uz: "Rasululloh ﷺ har kecha yotganda ikki kaftlarini juftlab, Ixlos, Falaq va Nos suralarini o'qib puflar, so'ng badanlarining yetgan joyiga surtar edilar — boshdan, yuzdan boshlab. Uch marta." },
        { id: 'kursi-sleep', core: false, n: 1, src: 'Buxoriy 2311 (Abu Hurayra r.a.)', ref: 'B',
          ar: 'آيَةُ الْكُرْسِيّ ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ…﴾',
          tr: 'Oyatul Kursiy (Baqara, 255)',
          uz: "«Yotganingda Oyatul Kursiyni o'qi — tonggacha Alloh tomonidan qo'riqchi bo'ladi va shayton yaqinlasha olmaydi.»" },
        { id: 'bismika', core: false, n: 1, src: 'Buxoriy 6324 (Huzayfa r.a.)', ref: 'B',
          ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          tr: 'Bismikallohumma amuutu va ahyaa',
          uz: "Allohim, Sening noming bilan o'laman (uxlayman) va tirilaman (uyg'onaman). (Yotayotganda — oxirgi so'z.)" }
      ]
    },

    /* ==================== 5. UYDAN CHIQISH ==================== */
    { key: 'home', title: { uz: "Uydan chiqish (LC, darsga)", en: 'Leaving home' },
      lede: { uz: "Everest LC yoki ko'chaga chiqishdan oldin — ostonada.", en: 'At the door, before heading out.' },
      items: [
        { id: 'tawakkaltu', core: false, n: 1, src: 'Abu Dovud 5095, Termiziy 3426 (Anas r.a.)', ref: 'B',
          ar: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ',
          tr: 'Bismillaahi tavakkaltu \'alalloh, va laa havla va laa quvvata illaa billaah',
          uz: "Allohning nomi bilan, Allohga tavakkal qildim. Kuch-quvvat faqat Alloh bilandir. (Kim aytsa: «hidoyat qilinding, kifoya qilinding, saqlanding» deyiladi va shayton undan uzoqlashadi.)" },
        { id: 'adilla', core: false, n: 1, src: 'Abu Dovud 5094, Termiziy 3427 (Ummu Salama r.a.)', ref: 'B',
          ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ',
          tr: 'Allohumma innii a\'uuzu bika an adilla av udolla, av azilla av uzalla, av azlima av uzlama, av ajhala av yujhala \'alayya',
          uz: "Allohim, adashishimdan yoki adashtirilishimdan, toyilishimdan yoki toydirilishimdan, zulm qilishimdan yoki zulm qilinishimdan, johillik qilishimdan yoki menga johillik qilinishidan Senga sig'inaman." }
      ]
    }
  ],

  /* Kunni boshlash oqimi — Today sahifasidagi "Kun duosi": core:true bo'lganlar, tong + ilm */
  dayStart: function () {
    var out = [];
    DUAS.sets.forEach(function (s) { if (s.key === 'morning' || s.key === 'study') s.items.forEach(function (d) { if (d.core) out.push(Object.assign({ set: s.key }, d)); }); });
    return out;
  },
  byId: function (id) {
    for (var i = 0; i < DUAS.sets.length; i++) for (var j = 0; j < DUAS.sets[i].items.length; j++) if (DUAS.sets[i].items[j].id === id) return DUAS.sets[i].items[j];
    return null;
  }
};
