/* ==========================================================================
   HABIT - kunlik intizom jadvali (Uzlat & Ribat, namozga anchor qilingan)
   --------------------------------------------------------------------------
   Kun QAT'IY SOATGA emas, NAMOZ VAQTLARIGA qurilgan. Toshkentda 26-okt ->
   10-fev oynasida Bomdod 55, Asr 65, Shom 67 daqiqa suriladi - shuning
   uchun blok vaqtlarini qotirib qo'yish 108 kundan 65 kuni namozni o'z
   vaqtidan oldin o'qishga olib keladi. Jadval har kuni qayta hisoblanadi
   (js/habit.js -> buildChain, js/prayer.js -> Prayer.times).

   CHORCHO'BA (16 hafta o'zgarmaydi):
     Tahajjud 02:00 - 60 daq namoz, keyin 1-pora.
     Har kuni 3 pora Qur'on x 90 daqiqa: Tahajjudda, Bomdoddan keyin va
     Peshindan oldin (Gibrid kunida 3-pora mavsumga qarab Shomdan keyin).
     Yakshanba ham to'xtamaydi: haftada 21 pora, butun Qur'on 10 kunda.

   UYQU - 390 DAQIQA (6 soat 30 daqiqa), IKKI BO'LAKDA, KAFOLATLANGAN:
     asosiy uyqu + "qayta uyqu" (04:30 -> Bomdod). Bomdod surilganda qayta
     uyqu 44-100 daqiqa orasida o'zgaradi, asosiy uyqu esa shunga qarab
     moslashadi - jami har kuni aniq 390 daqiqa. Shuning uchun yotish vaqti
     20:15 (oktabr) dan 21:10 (yanvar) gacha suriladi. Agar 21:00 qotirib
     qo'yilsa, 108 kundan 15 kuni 6 soatdan kam uxlanadi - shuning uchun
     qotirilmaydi. Kun ulgurmasa dars qisqaradi, uyqu emas.

   TO'RT SHABLON:
     gibrid     Du . Ch        oshxona va ro'zg'or + podkast, Tech 2 qismda
     lc         Se . Pa . Sha  Everest LC 16:30-18:30 + 45 daq yo'l
     oddiy      Ju             Uzlat master plan + juma namozi
     tiklanish  Yak            yangi mavzu yo'q, haftalik hisobot, oila

   QARZ - shanba oqshomida yopiladi (lc shablonidagi `c-debt` bloki).
     Haftalik nol: qarz keyingi haftaga o'tmaydi.

   Blok: { id, kind, min?, anchor?, flex?, until?, flexTo?, when?, core?, w?, t, note?, link? }
     Semantikasi shablonlar ustidagi izohda.
     kind  pray | quran | eng | py | kitchen | lc | speak | review | meal | rest | sleep
   ========================================================================== */
window.HABIT = {

  meta: {
    from: '2026-10-25',          // jadval boshlanishi = RASMIY start
    official: '2026-10-25',      // RASMIY start (kickoff, yakshanba)
    to: '2027-02-10',            // marafon oxiri; 11-20 fev - imtihon sprinti
    tahajjud: '02:00',           // Tahajjud bloki boshlanishi (chorcho'ba)
    juz: 90,                     // bir pora qiroati, daqiqa
    juzPerDay: 3,                // Tahajjud . Bomdod . Peshindan oldin
    dayStart: '02:00',           // uyg'onish (Tahajjud)
    dayEnd: '20:15-21:10',       // yotish - mavsum bilan suriladi
    sleepMin: 390,               // JAMI uyqu (asosiy + qayta), qat'iy
    sleepHours: 6.5,
    reSleepFrom: '04:30',        // qayta uyqu boshlanishi (Tahajjud + 150)
    debtCap: 3,
    debtWeekly: true,            // qarz shanba oqshomida nolga tushadi
    title: { uz: 'Kunlik intizom', en: 'Daily discipline' },
    lede: {
      uz: "25-oktabrdan 10-fevralgacha - har kuni Tahajjud 02:00, 3 pora Qur'on, uyqu 6 soat 30 daqiqa ikki bo'lakda. Bloklar namoz vaqtlariga bog'langan va har kuni qayta hisoblanadi.",
      en: 'From 25 October to 10 February - Tahajjud at 02:00 every day, three juz of recitation, six and a half hours of sleep in two parts. Blocks are anchored to the prayer times and recomputed daily.'
    },
    note: {
      uz: "Barcha besh namoz hisoblanadi (Hanafiy asr, 18 daraja bomdod/xufton) va Sozlamalarda qo'lda tuzatiladi. Hisob taxminiy - mahalliy taqvim bilan solishtir. Tahajjud - nafl, majburiy namozlardan alohida ko'rsatiladi.",
      en: 'All five prayers are calculated (Hanafi asr, 18 degree fajr/isha) and can be corrected by hand in Settings. The calculation is approximate - check it against your local calendar. Tahajjud is voluntary and shown separately from the obligatory prayers.'
    },
    sleepNote: {
      uz: "Uyqu 390 daqiqa - himoyalangan, jadvalning qoldig'i emas. Ikki bo'lakda: asosiy uyqu va qayta uyqu (04:30 -> Bomdod). Bomdod surilsa bo'laklar nisbati o'zgaradi, jami o'zgarmaydi. Kam uxlagan miya yangi materialni yodda saqlamaydi: agar kun ulgurmasa - dars qisqarsin, uyqu emas.",
      en: 'Sleep is 390 minutes - protected, not what is left over. In two parts: the main sleep and the second sleep (04:30 until Fajr). When Fajr shifts, the split changes but the total does not. A short-slept brain does not retain new material: if a day overruns, shorten a lesson, never the sleep.'
    },
    quranNote: {
      uz: "Kuniga 3 pora x 90 daqiqa = 4 soat 30 daqiqa. Haftada 21 pora, butun Qur'on 10 kunda. Bu uyqudan keyingi eng katta blok - Tech'dan ham ko'proq. Yakshanba ham to'xtamaydi.",
      en: 'Three juz a day times 90 minutes = four and a half hours. Twenty-one juz a week; the whole book in ten days. After sleep this is the largest block of the day, larger than Tech. It does not stop on Sunday either.'
    },
    restNote: {
      uz: "Yakshanba - tiklanish kuni. Yangi mavzu yo'q, LC yo'q, kod yo'q. Yagona majburiy ish - haftalik hisobot (45 daqiqa, Bomdoddan keyin). Qolgani: sayr, oila, uy ishlari, uzun qaylula. Tahajjud va 3 pora qiroat yakshanbada ham davom etadi.",
      en: 'Sunday is the recovery day. No new material, no LC, no code. The only compulsory task is the weekly report (45 minutes, after Fajr). The rest is walking, family, chores and a longer qaylula. Tahajjud and the three juz continue on Sunday too.'
    },
    loadNote: {
      uz: "Kun to'liq ochiq yozilgan: namoz, qiroat, dars, ovqat, yo'l, erkin vaqt va uyqu - hammasi blok. Erkin vaqt ham rejaning bir qismi, uni to'ldirishga urinma.",
      en: 'The day is written out in full: prayers, recitation, lessons, meals, travel, free time and sleep are all blocks. Free time is part of the plan too - do not try to fill it.'
    },
    debtNote: {
      uz: "Yopilmagan ish shanba oqshomida yopiladi - qarz keyingi haftaga o'tmaydi. Shuning uchun haftalik hisobot yakshanba ertalab, toza varaqdan boshlanadi.",
      en: 'Unfinished work is cleared on Saturday evening - debt does not roll into the next week. That is why the weekly report on Sunday morning starts from a clean sheet.'
    }
  },

  /* ====================== TO'RT SHABLON (zanjir) =======================
     Blok vaqti QAT'IY emas — zanjir bo'ylab hisoblanadi:
       anchor: '<namoz>'  blok shu namoz vaqtida boshlanadi (soat shunga
                          ko'chadi; oldidagi `flex` blok farqni yutadi).
                          `soft: true` — namoz vaqti o'tib ketgan bo'lsa
                          blok joyida qoladi (orqaga sakramaydi).
       flex: true         davomiyligi hisoblanadi: keyingi anchor vaqtidan
       until: '<namoz>'   oradagi qat'iy bloklar ayirilib chiqadi.
       flexTo: 'bed'      yotish vaqtigacha (uyqu 390 daq kafolatlangan).
       when: 'juzEvening' | 'juzMorning' — Gibrid kunida 3-pora joyi
                          mavsumga qarab tanlanadi (js/habit.js).
     Yadro (core) bloklari: w = hard | med | light — validator shuni sanaydi.
     `fixed: true` — tashqi dars (Everest LC): yakka ish yukiga kirmaydi.  */

  /* --- GIBRID: dushanba va chorshanba — oshxona va ro'zg'or kuni ------ */
  gibrid: {
    key: 'gibrid',
    /* Oshxona bloki ertalabni egallaydi, shuning uchun Tech tushdan keyin
       IKKI qismda bajariladi (Uzlat gibrid kun mantigi). Validatorning
       "tushdan keyin <= 1 OG'IR blok" qoidasi shu shablon uchun 2.      */
    limits: { pmHardMax: 2 },
    name: { uz: 'Gibrid kun', en: 'Hybrid day' },
    sub: { uz: "Oshxona va ro'zg'or + podkast · Tech ikki qismda", en: 'Kitchen and chores + podcast · Tech in two parts' },
    load: { uz: "3 pora Qur'on · Oshxona ~3s (podkast 1.5x) · Tech ~3.5s · Kechqurun IELTS", en: "3 juz · Kitchen ~3h (podcast 1.5x) · Tech ~3.5h · Evening IELTS" },
    chain: true,
    blocks: [
      { id: 'g-tahajjud', kind: 'pray', anchor: 'tahajjud', min: 60, t: { uz: 'Tahajjud namozi', en: 'Tahajjud prayer' },
        note: { uz: "Kechaning oxirgi uchdan birida. Kunlik niyat shu yerda yangilanadi.", en: 'In the last third of the night. The daily intention is renewed here.' } },
      { id: 'g-juz1', kind: 'quran', min: 90, t: { uz: "1-pora — Qur'on qiroati", en: "Juz 1 — Qur'an recitation" } },
      { id: 'g-resleep', kind: 'sleep', flex: true, until: 'fajr', t: { uz: 'Qayta uyqu', en: 'Second sleep' },
        note: { uz: 'Bomdodgacha. Asosiy uyqu bilan jami 6 soat 30 daqiqa.', en: 'Until Fajr. Together with the main sleep, six and a half hours.' } },
      { id: 'g-fajr', kind: 'pray', anchor: 'fajr', min: 15, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'g-juz2', kind: 'quran', min: 90, t: { uz: "2-pora — Qur'on qiroati", en: "Juz 2 — Qur'an recitation" } },
      { id: 'g-meal1', kind: 'meal', min: 45, t: { uz: "Nonushta va yangi lug'at", en: 'Breakfast and new vocabulary' }, link: 'books/vocab' },
      { id: 'g-kitchen', kind: 'kitchen', flex: true, until: 'dhuhr', core: true, w: 'med', longOk: true,
        t: { uz: "OSHXONA va ro'zg'or + inglizcha podkast 1.5x", en: 'KITCHEN and chores + English podcast at 1.5x' },
        note: { uz: 'Qo\'l ishda, quloq darsda: faqat tinglash mashqi hisoblanadi, yangi mavzu emas.', en: 'Hands busy, ears learning: this counts as listening practice, not new material.' } },
      { id: 'g-juz3am', kind: 'quran', min: 90, when: 'juzMorning', t: { uz: "3-pora — Qur'on qiroati", en: "Juz 3 — Qur'an recitation" } },
      { id: 'g-dhuhr', kind: 'pray', anchor: 'dhuhr', min: 90, t: { uz: 'Peshin, tushlik va qaylula', en: 'Dhuhr, lunch and qaylula' },
        note: { uz: '20–30 daqiqalik qaylula — kunning ikkinchi yarmi uchun.', en: 'A 20–30 minute qaylula — for the second half of the day.' } },
      { id: 'g-tech1', kind: 'py', flex: true, until: 'asr', core: true, w: 'hard', link: 'jobready',
        t: { uz: 'Deep Work Tech — 1-qism', en: 'Deep Work Tech — part 1' } },
      { id: 'g-asr', kind: 'pray', anchor: 'asr', min: 15, t: { uz: 'Asr namozi va tez takror', en: 'Asr prayer and quick recall' } },
      { id: 'g-tech2', kind: 'py', flex: true, until: 'maghrib', core: true, w: 'hard', link: 'jobready',
        t: { uz: 'Deep Work Tech — 2-qism', en: 'Deep Work Tech — part 2' } },
      { id: 'g-maghrib', kind: 'pray', anchor: 'maghrib', min: 15, t: { uz: 'Shom namozi', en: 'Maghrib prayer' } },
      { id: 'g-juz3pm', kind: 'quran', min: 90, when: 'juzEvening', t: { uz: "3-pora — Qur'on qiroati", en: "Juz 3 — Qur'an recitation" } },
      { id: 'g-free', kind: 'rest', flex: true, until: 'isha', when: 'juzMorning',
        t: { uz: 'Oila va dam - ekransiz', en: 'Family and rest - no screens' } },
      { id: 'g-isha', kind: 'pray', anchor: 'isha', soft: true, min: 20, t: { uz: 'Xufton namozi', en: 'Isha prayer' } },
      { id: 'g-meal3', kind: 'meal', min: 35, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
      { id: 'g-eve', kind: 'eng', flexTo: 'bed', core: true, w: 'med', shortOk: true, link: 'mission',
        t: { uz: 'IELTS, lug\'at testi va muhosaba', en: 'IELTS, vocabulary test and muhasabah' } },
      { id: 'g-sleep', kind: 'sleep', flexTo: 'tahajjud', t: { uz: 'Asosiy uyqu', en: 'Main sleep' } }
    ]
  },

  /* --- LC: seshanba, payshanba, shanba — Everest LC darsi kuni -------- */
  lc: {
    key: 'lc',
    name: { uz: 'LC kuni', en: 'LC day' },
    sub: { uz: "Everest LC 16:30–18:30 + yo'l · Tech ertalab", en: 'Everest LC 16:30–18:30 + travel · Tech in the morning' },
    load: { uz: "3 pora Qur'on · Tech ~2.5s · IELTS Input ~2s · LC 2s", en: '3 juz · Tech ~2.5h · IELTS Input ~2h · LC 2h' },
    chain: true,
    blocks: [
      { id: 'c-tahajjud', kind: 'pray', anchor: 'tahajjud', min: 60, t: { uz: 'Tahajjud namozi', en: 'Tahajjud prayer' } },
      { id: 'c-juz1', kind: 'quran', min: 90, t: { uz: "1-pora — Qur'on qiroati", en: "Juz 1 — Qur'an recitation" } },
      { id: 'c-resleep', kind: 'sleep', flex: true, until: 'fajr', t: { uz: 'Qayta uyqu', en: 'Second sleep' } },
      { id: 'c-fajr', kind: 'pray', anchor: 'fajr', min: 15, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'c-juz2', kind: 'quran', min: 90, t: { uz: "2-pora — Qur'on qiroati", en: "Juz 2 — Qur'an recitation" } },
      { id: 'c-meal1', kind: 'meal', min: 45, t: { uz: "Nonushta va yangi lug'at", en: 'Breakfast and new vocabulary' }, link: 'books/vocab' },
      { id: 'c-tech', kind: 'py', flex: true, until: 'dhuhr', core: true, w: 'hard', link: 'jobready',
        t: { uz: 'Deep Work: Tech va AI', en: 'Deep Work: Tech and AI' } },
      { id: 'c-juz3', kind: 'quran', min: 90, t: { uz: "3-pora — Qur'on qiroati", en: "Juz 3 — Qur'an recitation" } },
      { id: 'c-dhuhr', kind: 'pray', anchor: 'dhuhr', min: 60, t: { uz: 'Peshin va qaylula', en: 'Dhuhr and qaylula' } },
      { id: 'c-input', kind: 'eng', flex: true, untilBlock: 'c-lc', core: true, w: 'med', link: 'mission',
        t: { uz: 'IELTS Input — Reading va Listening', en: 'IELTS Input — Reading and Listening' } },
      { id: 'c-meal3', kind: 'meal', min: 35, t: { uz: "Kechki ovqat — jo'nashdan oldin", en: 'Dinner — before leaving' },
        note: { uz: "LC dan 19:15 da qaytiladi; ovqat shu yerda, aks holda kechqurun sig'maydi.", en: 'You return from LC at 19:15; dinner goes here, otherwise the evening does not fit.' } },
      { id: 'c-road1', kind: 'rest', min: 45, t: { uz: "Yo'l — Everest LC", en: 'Travel — Everest LC' } },
      { id: 'c-lc', kind: 'lc', min: 120, core: true, w: 'med', fixed: true, at: '16:30',
        t: { uz: 'EVEREST LC darsi', en: 'Everest LC class' },
        note: { uz: 'Shom namozi dars vaqtiga tushadi — tanaffusda yoki darsdan oldin.', en: 'Maghrib falls during the class — pray in the break or before it.' } },
      { id: 'c-road2', kind: 'rest', min: 45, t: { uz: "Yo'l — uyga", en: 'Travel — home' } },
      { id: 'c-isha', kind: 'pray', anchor: 'isha', soft: true, min: 20, t: { uz: 'Xufton namozi', en: 'Isha prayer' } },
      { id: 'c-close', kind: 'review', min: 20, core: true, w: 'light', shortOk: true, link: 'mission',
        t: { uz: 'Muhosaba va ertangi reja', en: 'Muhasabah and tomorrow plan' } },
      { id: 'c-debt', kind: 'review', min: 20, satOnly: true, core: true, w: 'light', shortOk: true,
        t: { uz: 'QARZNI YOPISH — haftalik yakun', en: 'CLEAR THE DEBT — weekly close' },
        note: { uz: "Yopilmagan ish shanba oqshomida tugaydi. To'liq hisobot — yakshanba ertalab.", en: 'Unfinished work ends on Saturday evening. The full report is on Sunday morning.' } },
      { id: 'c-wind', kind: 'rest', flexTo: 'bed', t: { uz: 'Dam — ekransiz', en: 'Wind down — no screens' } },
      { id: 'c-sleep', kind: 'sleep', flexTo: 'tahajjud', t: { uz: 'Asosiy uyqu', en: 'Main sleep' } }
    ]
  },

  /* --- ODDIY: juma — Uzlat master plan + juma namozi ------------------ */
  oddiy: {
    key: 'oddiy',
    name: { uz: 'Oddiy kun', en: 'Standard day' },
    sub: { uz: 'Uzlat master plan + juma namozi', en: 'Uzlat master plan + Jumuah' },
    load: { uz: "3 pora Qur'on · Tech ~2.8s · IELTS Input ~2s · Output ~1s", en: '3 juz · Tech ~2.8h · IELTS Input ~2h · Output ~1h' },
    chain: true,
    blocks: [
      { id: 'h-tahajjud', kind: 'pray', anchor: 'tahajjud', min: 60, t: { uz: 'Tahajjud namozi', en: 'Tahajjud prayer' } },
      { id: 'h-juz1', kind: 'quran', min: 90, t: { uz: "1-pora — Qur'on qiroati", en: "Juz 1 — Qur'an recitation" } },
      { id: 'h-resleep', kind: 'sleep', flex: true, until: 'fajr', t: { uz: 'Qayta uyqu', en: 'Second sleep' } },
      { id: 'h-fajr', kind: 'pray', anchor: 'fajr', min: 15, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'h-juz2', kind: 'quran', min: 90, t: { uz: "2-pora — Qur'on qiroati", en: "Juz 2 — Qur'an recitation" } },
      { id: 'h-meal1', kind: 'meal', min: 45, t: { uz: "Nonushta va yangi lug'at", en: 'Breakfast and new vocabulary' }, link: 'books/vocab' },
      { id: 'h-tech', kind: 'py', flex: true, until: 'dhuhr', core: true, w: 'hard', link: 'jobready',
        t: { uz: 'Deep Work: Tech va AI', en: 'Deep Work: Tech and AI' } },
      { id: 'h-juz3', kind: 'quran', min: 90, t: { uz: "3-pora — Qur'on qiroati", en: "Juz 3 — Qur'an recitation" } },
      { id: 'h-juma', kind: 'pray', anchor: 'dhuhr', min: 90, t: { uz: "JUMA NAMOZI va masjid yo'li", en: 'JUMUAH PRAYER and travel to the mosque' } },
      { id: 'h-input', kind: 'eng', flex: true, until: 'asr', core: true, w: 'med', link: 'mission',
        t: { uz: 'IELTS Input — Reading va Listening', en: 'IELTS Input — Reading and Listening' } },
      { id: 'h-asr', kind: 'pray', anchor: 'asr', min: 45, t: { uz: 'Asr namozi, sayr va takror', en: 'Asr prayer, a walk and recall' } },
      { id: 'h-output', kind: 'speak', flex: true, until: 'maghrib', core: true, w: 'hard', link: 'speaking',
        t: { uz: 'IELTS Output — Speaking va Writing', en: 'IELTS Output — Speaking and Writing' } },
      { id: 'h-maghrib', kind: 'pray', anchor: 'maghrib', min: 50, t: { uz: 'Shom namozi va kechki ovqat', en: 'Maghrib prayer and dinner' } },
      { id: 'h-free', kind: 'rest', flex: true, until: 'isha', t: { uz: 'Dam — ekransiz', en: 'Rest — no screens' } },
      { id: 'h-isha', kind: 'pray', anchor: 'isha', soft: true, min: 20, t: { uz: 'Xufton namozi', en: 'Isha prayer' } },
      { id: 'h-close', kind: 'review', flexTo: 'bed', core: true, w: 'light', link: 'mission',
        t: { uz: "Lug'at testi, muhosaba va ertangi reja", en: 'Vocabulary test, muhasabah and tomorrow plan' } },
      { id: 'h-sleep', kind: 'sleep', flexTo: 'tahajjud', t: { uz: 'Asosiy uyqu', en: 'Main sleep' } }
    ]
  },

  /* --- TIKLANISH: yakshanba — Strategic Recovery ----------------------
     Miyani zo'riqtirish yo'q: yangi mavzu, kod va dars YO'Q. Tahajjud va
     3 pora qiroat esa to'xtamaydi. Haftalik hisobot shu kun ertalab —
     shanba oqshomida faqat qarz yopiladi (c-debt).                      */
  tiklanish: {
    key: 'tiklanish',
    name: { uz: 'Tiklanish kuni', en: 'Recovery day' },
    sub: { uz: "Yangi mavzu yo'q · haftalik hisobot · oila va sayr", en: 'No new material · weekly report · family and walks' },
    load: { uz: "3 pora Qur'on · Hisobot 45d · Ekransiz dam ~6.5s", en: '3 juz · Report 45m · Screen-free rest ~6.5h' },
    chain: true,
    blocks: [
      { id: 'r-tahajjud', kind: 'pray', anchor: 'tahajjud', min: 60, t: { uz: 'Tahajjud namozi', en: 'Tahajjud prayer' } },
      { id: 'r-juz1', kind: 'quran', min: 90, t: { uz: "1-pora — Qur'on qiroati", en: "Juz 1 — Qur'an recitation" } },
      { id: 'r-resleep', kind: 'sleep', flex: true, until: 'fajr', t: { uz: 'Qayta uyqu', en: 'Second sleep' } },
      { id: 'r-fajr', kind: 'pray', anchor: 'fajr', min: 15, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'r-juz2', kind: 'quran', min: 90, t: { uz: "2-pora — Qur'on qiroati", en: "Juz 2 — Qur'an recitation" } },
      { id: 'r-week', kind: 'review', min: 45, core: true, w: 'light', link: 'week',
        t: { uz: 'HAFTALIK HISOBOT va keyingi hafta rejasi', en: 'WEEKLY REPORT and next week plan' },
        note: { uz: 'Haftaning yagona majburiy ishi. Qolgani — dam.', en: 'The only compulsory task of the day. The rest is rest.' } },
      { id: 'r-meal1', kind: 'meal', min: 45, t: { uz: 'Nonushta', en: 'Breakfast' } },
      { id: 'r-out1', kind: 'rest', flex: true, until: 'dhuhr', t: { uz: "Sayr, oila va uy ishlari — ekransiz", en: 'Walk, family and chores — no screens' } },
      { id: 'r-juz3', kind: 'quran', min: 90, t: { uz: "3-pora — Qur'on qiroati", en: "Juz 3 — Qur'an recitation" } },
      { id: 'r-dhuhr', kind: 'pray', anchor: 'dhuhr', min: 20, t: { uz: 'Peshin namozi', en: 'Dhuhr prayer' } },
      { id: 'r-meal2', kind: 'meal', min: 60, t: { uz: 'Tushlik', en: 'Lunch' } },
      { id: 'r-qaylula', kind: 'sleep', min: 45, t: { uz: 'Uzun qaylula', en: 'Long qaylula' },
        note: { uz: 'Yakshanba qaylulasi uzunroq — haftalik tiklanish.', en: 'The Sunday qaylula is longer — weekly recovery.' } },
      { id: 'r-fam1', kind: 'rest', flex: true, until: 'asr', t: { uz: 'Oila va dam', en: 'Family and rest' } },
      { id: 'r-asr', kind: 'pray', anchor: 'asr', min: 15, t: { uz: 'Asr namozi', en: 'Asr prayer' } },
      { id: 'r-out2', kind: 'rest', flex: true, until: 'maghrib', t: { uz: 'Sayr — tabiat, ekransiz', en: 'Walk — outdoors, no screens' } },
      { id: 'r-maghrib', kind: 'pray', anchor: 'maghrib', min: 15, t: { uz: 'Shom namozi', en: 'Maghrib prayer' } },
      { id: 'r-meal3', kind: 'meal', min: 45, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
      { id: 'r-fam2', kind: 'rest', flex: true, until: 'isha', t: { uz: 'Oila', en: 'Family' } },
      { id: 'r-isha', kind: 'pray', anchor: 'isha', soft: true, min: 20, t: { uz: 'Xufton namozi', en: 'Isha prayer' } },
      { id: 'r-prep', kind: 'rest', flexTo: 'bed', t: { uz: 'Ertangi Gibrid kunga tayyorgarlik', en: 'Preparing for tomorrow hybrid day' } },
      { id: 'r-sleep', kind: 'sleep', flexTo: 'tahajjud', t: { uz: 'Asosiy uyqu', en: 'Main sleep' } }
    ]
  },

  /* ====================== ISH (LOYIHA) KUNI — QAYTA JOYLASH ============
     Ish davri yoqilgan kunlarda (HabitPlan.workOn) shu jadval ishlaydi:
     `drop` — o'sha kun uchun olib tashlanadigan shablon bloklari,
     `add`  — ularning o'rniga qo'yiladigan bloklar (bir xil sxema).
     Qoida: ISH bitta uzluksiz blok. Og'ir kun / yakshanba 16:00–19:00
     (180 daq). LC kuni LC dan keyin: 18:50–21:10 (140 daq) — 21:20 uyqu
     himoyalangan, 3 soat sig'maydi; kamomad ogohlantirishda ko'rsatiladi.
     Kino tushga ko'chadi; speaking, lug'at testi, kitob, yakun ishdan keyin.
     Har shablon ish kunida ham aynan 1440 daqiqa.                          */
  work: {
    min: 180,
    heavy: {
      drop: ['h-yt', 'h-free1', 'h-free2', 'h-meal3', 'h-free3', 'h-movie', 'h-close', 'h-wind'],
      add: [
        { id: 'h-movie', kind: 'movie', at: '12:00', min: 45, movie: true,
          t: { uz: 'KINO (ish kuni — tushda)', en: 'FILM (work day — at midday)' },
          note: { uz: "Ish kunida kino tushga ko'chadi — kechqurun ish bloki. Inglizcha subtitr bilan.", en: 'On a work day the film moves to midday — the evening is the work block. English subtitles.' } },
        { id: 'h-free1', kind: 'rest', at: '12:45', min: 15, t: { uz: 'Erkin vaqt', en: 'Free time' } },
        { id: 'h-free2', kind: 'rest', at: '15:25', min: 35, t: { uz: 'Tanaffus', en: 'Break' },
          note: { uz: "Asr namozi ish bloki ichida — o'z vaqtida o'qib, davom et.", en: 'Asr falls inside the work block — pray on time and continue.' } },
        { id: 'h-work', kind: 'work', at: '16:00', min: 180, core: true, w: 'hard', fixed: true,
          t: { uz: 'ISH · loyiha — 3 soat', en: 'WORK · project — 3 hours' },
          note: { uz: "Bitta uzluksiz blok. Telefon boshqa xonada; 50/10 ritm (50 daq ish, 10 daq tanaffus). Ish davri Sozlamalarda (sana oralig'i).", en: 'One unbroken block. Phone in another room; 50/10 rhythm (50 min work, 10 min break). The work period is set in Settings (date range).' } },
        { id: 'h-meal3', kind: 'meal', at: '19:00', min: 30, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
        { id: 'h-close', kind: 'review', at: '19:30', min: 45, core: true, w: 'light', link: 'books/vocab',
          t: { uz: 'YADRO 5 · Kun yakuni', en: 'CORE 5 · Day close' },
          note: { uz: "Lug'at 5 soniya testi, kitob, xatolar daftari + ertangi kun.", en: 'Vocabulary 5-second test, the book, the error log + tomorrow.' } },
        { id: 'h-wind', kind: 'rest', at: '20:15', min: 65, t: { uz: 'Tayyorgarlik / dam — ekransiz', en: 'Wind down — no screens' },
          note: { uz: '21:20 da yotasan.', en: 'Lights out at 21:20.' } }
      ]
    },
    class: {
      drop: ['c-free1', 'c-meal3', 'c-free3', 'c-movie', 'c-close', 'c-wind'],
      add: [
        { id: 'c-movie', kind: 'movie', at: '11:55', min: 40, movie: true,
          t: { uz: 'KINO (ish kuni — tushda)', en: 'FILM (work day — at midday)' },
          note: { uz: "LC kunida kino tushga ko'chadi — kechqurun LC + ish.", en: 'On an LC day the film moves to midday — the evening is LC + work.' } },
        { id: 'c-free1', kind: 'rest', at: '12:35', min: 25, t: { uz: 'Erkin vaqt', en: 'Free time' } },
        { id: 'c-meal3', kind: 'meal', at: '18:30', min: 20, t: { uz: 'Kechki ovqat (tez)', en: 'Dinner (quick)' } },
        { id: 'c-work', kind: 'work', at: '18:50', min: 140, core: true, w: 'hard', fixed: true, short: 40,
          t: { uz: 'ISH · loyiha — LC dan keyin (2s 20d)', en: 'WORK · project — after LC (2h20)' },
          note: { uz: "LC dan keyin uzluksiz. 3 soat sig'maydi: 21:20 uyqu himoyalangan — 40 daqiqa kamomad, uni ish kunlari (og'ir kun/yakshanba) qoplaydi. Telefon boshqa xonada.", en: 'Unbroken after LC. Three hours do not fit: sleep at 21:20 is protected — a 40-minute shortfall, covered on heavy days/Sunday. Phone in another room.' } },
        { id: 'c-close', kind: 'review', at: '21:10', min: 10, core: true, w: 'light', shortOk: true,
          t: { uz: 'Yakun: 3 qator LC xulosasi + ertangi kun', en: 'Close: three lines of LC summary + tomorrow' },
          note: { uz: "Ish kunida qisqartirilgan yakun — 10 daqiqa (validator uchun ataylab ruxsat etilgan istisno).", en: 'A shortened close on a work day — 10 minutes (an explicitly allowed validator exception).' } }
      ]
    },
    rest: {
      drop: ['r-yt', 'r-rest3', 'r-rest4', 'r-meal3', 'r-code', 'r-kick', 'r-movie', 'r-close', 'r-wind'],
      add: [
        { id: 'r-yt', kind: 'yt', at: '15:00', min: 25, t: { uz: 'YOUTUBE · inglizcha kanal', en: 'YOUTUBE · English channel' } },
        { id: 'r-rest3', kind: 'rest', at: '15:25', min: 35, t: { uz: 'Dam / oila', en: 'Rest / family' } },
        { id: 'r-work', kind: 'work', at: '16:00', min: 180, core: true, w: 'hard', fixed: true,
          t: { uz: 'ISH · loyiha — 3 soat', en: 'WORK · project — 3 hours' },
          note: { uz: "Yakshanbada ham ish davrida 16:00–19:00. Bitta uzluksiz blok, 50/10 ritm. Ish davri Sozlamalarda.", en: 'On Sunday too, during the work period: 16:00–19:00. One unbroken block, 50/10 rhythm. The work period is set in Settings.' } },
        { id: 'r-meal3', kind: 'meal', at: '19:00', min: 35, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
        { id: 'r-movie', kind: 'movie', at: '19:35', min: 40, movie: true, t: { uz: 'KINO', en: 'FILM' },
          note: { uz: "Kunning filmi yuqorida.", en: 'The day\'s film is shown above.' } },
        { id: 'r-close', kind: 'review', at: '20:15', min: 45, core: true, w: 'light', link: 'goal',
          t: { uz: 'YADRO 3 · Hafta yakuni', en: 'CORE 3 · Week close' },
          note: { uz: "Kitob, test natijasi, haftaning 3 xatosi, keyingi haftaning bitta maqsadi.", en: 'The book, the test result, the week\'s three mistakes, one goal for next week.' } },
        { id: 'r-wind', kind: 'rest', at: '21:00', min: 20, t: { uz: 'Tayyorgarlik — ekransiz', en: 'Wind down — no screens' },
          note: { uz: "Dushanba og'ir kun — 21:20 da yot.", en: 'Monday is a heavy day — lights out at 21:20.' } }
      ]
    }
  },

  /* ====================== KUNNING FILMI ================================
     Inglizcha, inglizcha subtitr bilan. Ro'yxat 60 ta — kalendar kuni
     bo'yicha aylanadi (calDay % 60). Tanlov: zamonaviy action + zamonaviy
     animation (foydalanuvchining didi), tushunarli dialog, turli aksent.  */
  movies: [
    /* Zamonaviy ACTION + zamonaviy ANIMATION — inglizcha, inglizcha subtitr bilan.
       Aniq dialog, turli aksent. Kalendar kuni bo'yicha navbat (calDay % 60). */
    'Spider-Man: Into the Spider-Verse (2018)', 'Top Gun: Maverick (2022)', 'Inside Out 2 (2024)', 'Mission: Impossible — Fallout (2018)',
    'Puss in Boots: The Last Wish (2022)', 'Dune (2021)', 'The Super Mario Bros. Movie (2023)', 'John Wick (2014)',
    'Spider-Man: Across the Spider-Verse (2023)', 'Mad Max: Fury Road (2015)', 'Coco (2017)', 'Bullet Train (2022)',
    'Encanto (2021)', 'Edge of Tomorrow (2014)', 'Soul (2020)', 'Baby Driver (2017)',
    'The Mitchells vs. the Machines (2021)', 'Guardians of the Galaxy (2014)', 'Zootopia (2016)', 'Mission: Impossible — Dead Reckoning (2023)',
    'Kung Fu Panda 4 (2024)', 'Avengers: Endgame (2019)', 'Big Hero 6 (2014)', 'Dune: Part Two (2024)',
    'Elemental (2023)', 'Black Panther (2018)', 'How to Train Your Dragon: The Hidden World (2019)', 'Ford v Ferrari (2019)',
    'Luca (2021)', 'Extraction (2020)', 'Moana (2016)', 'Nobody (2021)',
    'The Bad Guys (2022)', 'Gladiator II (2024)', 'Turning Red (2022)', 'Godzilla Minus One (2023)',
    'Frozen II (2019)', 'The Batman (2022)', 'Wish (2023)', 'Everything Everywhere All at Once (2022)',
    'Sing 2 (2021)', 'Spider-Man: No Way Home (2021)', 'Toy Story 4 (2019)', 'Wonder Woman (2017)',
    'Nimona (2023)', 'Deadpool & Wolverine (2024)', 'Raya and the Last Dragon (2021)', 'Free Guy (2021)',
    'Onward (2020)', 'Tenet (2020)', 'Migration (2023)', 'The Fall Guy (2024)',
    'Klaus (2019)', 'Ready Player One (2018)', 'Lightyear (2022)', 'Ambulance (2022)',
    'Orion and the Dark (2024)', 'Bumblebee (2018)', 'Spies in Disguise (2019)', 'Twisters (2024)'
  ],


  /* YouTube kanallari — har ikki kunda bir, navbat bilan (calDay/2 % n) */
  youtube: [
    'BBC Learning English', 'TED (2 ta 10 daqiqalik nutq)', 'Kurzgesagt – In a Nutshell', 'English with Lucy',
    'Veritasium', 'CrashCourse', 'Fireship (coding, 100 seconds)', 'freeCodeCamp (bir dars)',
    'TED-Ed', 'Easy English (ko\'cha intervyulari)', 'Vox', 'Corey Schafer (Python)'
  ],
  /* Blok turlari — rang va ikonka uchun */
  kinds: {
    pray:   { icon: 'mosque',    name: { uz: 'Namoz', en: 'Prayer' } },
    quran:  { icon: 'book',      name: { uz: "Qur'on", en: "Qur'an" } },
    eng:    { icon: 'globe',     name: { uz: 'Ingliz tili', en: 'English' } },
    py:     { icon: 'code',      name: { uz: 'Python', en: 'Python' } },
    dc:     { icon: 'layers',    name: { uz: 'DataCamp', en: 'DataCamp' } },
    work:   { icon: 'rocket',    name: { uz: 'Ish (loyiha)', en: 'Work (project)' } },
    lc:     { icon: 'user',      name: { uz: 'LC darsi', en: 'LC class' } },
    hw:     { icon: 'pen',       name: { uz: 'Uy vazifasi', en: 'Homework' } },
    speak:  { icon: 'mic',       name: { uz: 'Speaking', en: 'Speaking' } },
    review: { icon: 'checklist', name: { uz: 'Takror', en: 'Review' } },
    meal:   { icon: 'clock',     name: { uz: 'Tanaffus', en: 'Break' } },
    rest:   { icon: 'flame',     name: { uz: 'Dam', en: 'Rest' } },
    kitchen:{ icon: 'clock',     name: { uz: 'Oshxona', en: 'Kitchen' } },
    proj:   { icon: 'rocket',    name: { uz: 'Loyiha', en: 'Project' } },
    movie:  { icon: 'film',      name: { uz: 'Kino', en: 'Film' } },
    yt:     { icon: 'play',      name: { uz: 'YouTube', en: 'YouTube' } },
    book:   { icon: 'book',      name: { uz: 'Kitob', en: 'Book' } },
    sleep:  { icon: 'moon',      name: { uz: 'Uyqu', en: 'Sleep' } }
  }
};
