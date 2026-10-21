/* ==========================================================================
   HABIT — kunlik intizom jadvali
   --------------------------------------------------------------------------
   Kun QAT'IY vaqtlar ustiga qurilgan: 05:20 da uyg'onish, 21:20 da yotish.
   Har blokning boshlanish soati aniq yozilgan.

   UYQU — 8 SOAT, himoyalangan blok.
     21:20 → 05:20 = aniq 8 soat. Uyqu jadvalning qoldig'i emas, ASOSI:
     qolgan hamma narsa shundan keyin joylashadi. Kam uxlagan miya yangi
     material yodda saqlamaydi — ya'ni uyquni qisqartirish o'qishni
     tezlashtirmaydi, sekinlashtiradi.

   YADRO YUKLAMA ~6 SOAT/KUN — ataylab. 9–10 soatlik kunlar 3–6-haftada
     charchashga olib keladi; band 8 ko'proq soatdan emas, sekin va
     TUZATILGAN ishdan keladi. Og'ir kun 360 daq, LC kuni 375 daq (LC bilan),
     yakshanba 130 daq (bitta test bloki). Har shablon aynan 1440 daqiqa,
     bloklar ustma-ust tushmaydi (yt ham alohida slot).

   CODING — HAR KUNI: Python 30 kun (20-sen → 19-okt, kuniga 1 dars) +
     DataCamp treki (20-sen dan, kuniga 1 bob). Og'ir kun 100 daq
     (Python 60 + DataCamp 40), LC kuni 90 daq, yakshanba: Python oyida
     45 daq dars, keyin shu slot SRS takrori. Coding takrori — ixtiyoriy.

   QARZ — ko'pi bilan meta.debtCap (3) kun: undan ortiq to'planmaydi,
     bosqichlar 3 kundan ko'p surilmaydi, roast darajasi o'smaydi.

   WORK — loyiha ustida ish: KETMA-KET 3 SOAT, bitta blok. Og'ir kun va
     yakshanba: 16:00–19:00. LC kuni: LC dan keyin (18:50–21:10 = 2s 20d —
     21:20 uyqu himoyalangan, 3 soat sig'maydi; farq halol ko'rsatiladi).
     Ish davri Sozlamalarda (work: on/from/to). Ish kunida kechqurungi
     bloklar HABIT.work[type] bo'yicha qayta joylanadi: kino tushga ko'chadi,
     speaking/lug'at testi/kitob/yakun ishdan keyin. Har kun baribir 1440.
     Writing bloki 1-oktabrgacha jadvalda YO'Q (Writing kursi shu kundan).

   KINO — har kuni, 35–45 daqiqa (yakshanba 45).
     Nega har kuni: (1) chegarasi bor dam chegarasizidan yaxshi — aks holda
     kechqurun uyqu vaqtiga o'tib ketadi; (2) inglizcha ko'rilsa, bu dam
     bo'lgani holda Listening mashqi ham bo'ladi. Uyqudan oldin oxirgi blok
     emas — orasida qisqa yakun bloki turadi.

   Uch xil kun:
     heavy  Du · Ch · Ju   ingliz tili to'liq + PYTHON
     class  Se · Pa · Sha  Everest LC 16:30–18:30 + ingliz tili
     rest   Yakshanba      dam + takror/test kuni

   Blok: { id, kind, at, min, t, note?, core?, link? }
     at    — boshlanish vaqti "HH:MM"
     firstOnly — faqat rasmiy start kuni (notFirst juftligi)
     noDc  — o'sha kuni DataCamp bobi rejalashtirilgan bo'lsa blok tashlanadi
             (dcOnly juftligi: ikkalasi bir slot, faqat bittasi chiqadi)
     prayer— 'fajr' | 'dhuhr' — vaqti sozlamadan olinadi
     kind  pray | quran | eng | py | lc | hw | speak | review | meal | rest | movie | sleep
   ========================================================================== */
window.HABIT = {

  meta: {
    from: '2026-09-20',          // jadval boshlanishi = RASMIY start (sinov kunlari 17–19-sen BEKOR qilingan)
    official: '2026-09-20',      // RASMIY start (kickoff, yakshanba) — Python 1-kun, DataCamp 1-kun, yangi davr
    to: '2027-02-20',
    dayStart: '05:20',
    dayEnd: '21:20',
    sleepFrom: '21:20',
    sleepHours: 8,
    debtCap: 3,                  // qarz ko'pi bilan 3 kun hisoblanadi — "roast" spiralga tushmasin
    title: { uz: 'Kunlik intizom', en: 'Daily discipline' },
    lede: {
      uz: "20-sentabrdan 20-fevralgacha — har bir kun, soatma-soat. Uyg'onish 05:20, yotish 21:20 — aniq 8 soat uyqu.",
      en: 'From 20 September to 20 February — every day, hour by hour. Wake at 05:20, sleep at 21:20 — exactly eight hours.'
    },
    note: {
      uz: "Bomdod va Peshin jadval ustuni — standart 05:20 va 13:00, Sozlamalardan o'zgartiriladi. Asr, Shom va Xufton hisoblanadi, chunki ular mavsum bilan 2 soatgacha suriladi. Hisob taxminiy — mahalliy taqvim bilan solishtir.",
      en: 'Fajr and Dhuhr are the pillars of the schedule — 05:20 and 13:00 by default, changeable in Settings. Asr, Maghrib and Isha are calculated, because they shift by up to two hours across the season. The calculation is approximate — check it against your local calendar.'
    },
    sleepNote: {
      uz: "8 soat uyqu — himoyalangan blok, jadvalning qoldig'i emas. Kam uxlagan miya yangi materialni yodda saqlamaydi: uyquni qisqartirish o'qishni tezlashtirmaydi, sekinlashtiradi. Agar kun ulgurmasa — dars qisqarsin, uyqu emas.",
      en: 'Eight hours of sleep is a protected block, not what is left over. A short-slept brain does not retain new material: cutting sleep does not speed learning up, it slows it down. If a day overruns, shorten a lesson — never the sleep.'
    },
    restNote: {
      uz: "Yakshanba — dam kuni. Yangi mavzu yo'q, LC yo'q, uy vazifasi yo'q. Majburiy ish bittasi: haftalik test (Listening + Reading, 100 daqiqa). Python oyida (19-oktabrgacha) 45 daqiqalik dars ham bor — 30/30 sig'ishi uchun. Qolgani — sayr, oila, kino. Dam olish \"hech narsa qilmaslik\" emas, \"yangi narsa boshlamaslik\" degani.",
      en: 'Sunday is the rest day. No new material, no LC, no homework. One compulsory task: the weekly test (Listening + Reading, 100 minutes). During Python month (until 19 October) there is also a 45-minute lesson, so that 30 lessons fit in 30 days. The rest is walks, family, a film. Resting means not starting something new, not doing nothing.'
    },
    loadNote: {
      uz: "Kun to'liq ochiq yozilgan: dars, uy vazifasi, namoz, ovqat, kino, erkin vaqt va uyqu — hammasi blok. Erkin vaqt ham rejaning bir qismi, uni to'ldirishga urinma.",
      en: 'The day is written out in full: lessons, homework, prayers, meals, the film block, free time and sleep are all blocks. Free time is part of the plan too — do not try to fill it.'
    },
    movieNote: {
      uz: "Kino bloki inglizcha ko'rilsa, u dam bo'lgani holda Listening mashqi ham bo'ladi. Subtitr bilan boshla, keyin subtitrsizga o't. Bu blok chegarali — aks holda kechqurun uyqu vaqtiga o'tib ketadi.",
      en: 'If the film block is watched in English it is rest that doubles as listening practice. Start with subtitles, then drop them. The block is bounded on purpose — otherwise the evening eats into sleep.'
    }
  },

  /* Sinov kunlari (17–19-sen) shabloni OLIB TASHLANGAN — 20-sen dan rasmiy jadval. */

  heavy: {
    key: 'heavy',
    name: { uz: "Og'ir kun", en: 'Heavy day' },
    sub: { uz: "Ingliz tili 3s 15d + Coding 1s 40d · LC yo'q", en: 'English 3h15 + Coding 1h40 · no LC' },
    load: { uz: 'Yadro 6s · Ingliz 3s 15d · Coding 1s 40d · Kino 45d · Dam 4s 30d', en: 'Core 6h · English 3h15 · Coding 1h40 · Film 45m · Rest 4h30' },
    blocks: [
      { id: 'h-fajr',  kind: 'pray',  prayer: 'fajr', min: 25, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'h-quran', kind: 'quran', at: '05:45', min: 20, t: { uz: "Qur'on tilovati", en: "Qur'an recitation" },
        note: { uz: "Kunning eng tinch vaqti — miya toza.", en: 'The calmest part of the day; the mind is clear.' } },

      /* 1-YADRO · Ingliz tili (ertalab) — grammatika + lug'at bitta blokda.
         Ilgari ikki blok edi (45 + 35, orada nonushta). Birlashtirildi:
         qoidani o'rganib, o'sha zahoti yangi so'zlar bilan ishlatasan.      */
      { id: 'h-eng-am', kind: 'eng', at: '06:05', min: 75, core: true, w: 'hard', link: 'english/{engDay}',
        t: { uz: 'YADRO 1 · Ingliz tili — grammatika va lug\'at', en: 'CORE 1 · English — grammar and vocabulary' },
        note: { uz: "45 daq grammatika (cheatsheet + mashqlar, qoidani O'Z gaplaringda ishlat), 30 daq lug'at (Destination B2 bo'limi + 10 savollik test). Xato gapni daftarga to'g'rilab yoz. 5 soniya testi kechqurun.", en: '45 min grammar (cheatsheet + exercises — use the rule in YOUR sentences), 30 min vocabulary (the Destination B2 section + the 10-question quiz). Rewrite every wrong sentence in the copybook. The 5-second test is in the evening.' } },
      { id: 'h-meal1', kind: 'meal', at: '07:20', min: 25, t: { uz: 'Nonushta', en: 'Breakfast' } },

      /* 2-YADRO · Coding — Python va DataCamp ketma-ket, bitta o'tirishda.
         Ilgari ular orasida ingliz tili bloki bor edi (kontekst almashuvi).  */
      { id: 'h-code', kind: 'py', at: '07:45', min: 100, core: true, w: 'hard', link: 'lesson/{pyDay}',
        t: { uz: 'YADRO 2 · Coding — Python va DataCamp', en: 'CORE 2 · Coding — Python and DataCamp' },
        note: { uz: "60 daq Python darsi (nazariya + kod maydonida har misolni ishga tushir + test), keyin 40 daq DataCamp bobi (mashqlar DataCamp'da, bob testi shu yerda). Bitta o'tirish — muharrirdan chiqmaysan.", en: '60 min Python lesson (theory + run every example + quiz), then the 40-minute DataCamp chapter (exercises on DataCamp, the chapter quiz here). One sitting — you stay in the editor.' },
        after: { kind: 'py', link: 'plan',
          t: { uz: 'YADRO 2 · DataCamp (Python tugadi)', en: 'CORE 2 · DataCamp (Python done)' },
          note: { uz: "Python 30 kuni tugadi — butun blok DataCamp trekiga o'tadi.", en: 'The 30 Python days are done — the whole block moves to the DataCamp track.' } } },
      { id: 'h-br1', kind: 'meal', at: '09:25', min: 15, t: { uz: 'Tanaffus', en: 'Break' } },

      /* 3-YADRO · Ingliz tili (qabul) — tinglash + o'qish, ikkalasi ham
         "kirish" ko'nikmasi: bir xil rejimda ishlaydi, almashuv arzon.      */
      { id: 'h-eng-mid', kind: 'eng', at: '09:40', min: 75, core: true, w: 'med', link: 'books/listen',
        t: { uz: 'YADRO 3 · Ingliz tili — tinglash va o\'qish', en: 'CORE 3 · English — listening and reading' },
        note: { uz: "35 daq Target Listening (6 diktant + 15 test savoli), 40 daq o'qish: bitta matn vaqt bilan (20 daq) + har xato javobning SABABI (20 daq).", en: '35 min Target Listening (6 dictations + 15 test questions), 40 min reading: one passage timed (20 min) + the REASON behind every wrong answer (20 min).' } },

      { id: 'h-walk', kind: 'rest', at: '10:55', min: 65, t: { uz: 'SAYR / DAM — ekransiz', en: 'WALK / REST — no screens' },
        note: { uz: "Tiklanish ham reja. Ertalabki uch yadro blokidan keyin miya bu tanaffusni talab qiladi — uni o'qish bilan to'ldirma.", en: 'Recovery is part of the plan. After three core blocks the brain needs this break — do not fill it with study.' } },
      { id: 'h-yt', kind: 'yt', at: '12:00', min: 25,
        t: { uz: 'YOUTUBE · inglizcha kanal', en: 'YOUTUBE · English channel' },
        note: { uz: "Har kuni 25 daqiqa. Subtitrsiz, 1.25× tezlikda. Kanal yuqorida.", en: 'Every day, 25 minutes. No subtitles, at 1.25× speed. The channel is shown above.' } },
      { id: 'h-free1', kind: 'rest', at: '12:25', min: 35, t: { uz: 'Erkin vaqt', en: 'Free time' } },

      { id: 'h-dhuhr', kind: 'pray', prayer: 'dhuhr', min: 20, t: { uz: 'Peshin namozi', en: 'Dhuhr prayer' } },
      { id: 'h-meal2', kind: 'meal', at: '13:20', min: 60, t: { uz: 'Tushlik va dam', en: 'Lunch and rest' },
        note: { uz: "Ekransiz dam ol — kunning ikkinchi yarmi shunga bog'liq.", en: 'Rest without a screen; the second half depends on it.' } },

      /* 4-YADRO · Ingliz tili (ishlab chiqarish) — yozish + gapirish.
         Kunning yagona tushdan keyingi OG'IR bloki (validator qoidasi).     */
      { id: 'h-eng-pm', kind: 'eng', at: '14:20', min: 65, core: true, w: 'hard', link: 'writing', writing: true,
        t: { uz: 'YADRO 4 · Ingliz tili — yozish va gapirish', en: 'CORE 4 · English — writing and speaking' },
        note: { uz: "40 daq writing (kam yoz, ko'p tuzat: 1 abzats → tekshir → qayta yoz), 25 daq speaking treki (2 yozuv: sovuq → tuzatilgan, WPM va pauza hisobi). Writing kursi 1-oktabrdan.", en: '40 min writing (write less, correct more: one paragraph → check → rewrite), 25 min of the speaking track (2 recordings: cold → corrected, WPM and pause count). The Writing course starts 1 Oct.' } },

      { id: 'h-free2', kind: 'rest', at: '15:25', min: 105, t: { uz: 'Erkin vaqt / oila', en: 'Free time / family' },
        note: { uz: "Asr namozi shu oraliqda.", en: 'Asr falls in here.' } },
      { id: 'h-meal3', kind: 'meal', at: '17:10', min: 40, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
      { id: 'h-free3', kind: 'rest', at: '17:50', min: 70, t: { uz: 'Erkin vaqt', en: 'Free time' } },
      { id: 'h-movie', kind: 'movie', at: '19:00', min: 45, movie: true,
        t: { uz: 'KINO', en: 'FILM' },
        note: { uz: "Inglizcha, inglizcha subtitr bilan. Kunning filmi yuqorida.", en: 'In English with English subtitles. The day\'s film is shown above.' } },

      /* 5-YADRO · Kun yakuni — lug'at testi, kitob, xatolar daftari.
         Uchta qisqa blok bitta yengil blokka yig'ildi.                      */
      { id: 'h-close', kind: 'review', at: '19:45', min: 45, core: true, w: 'light', link: 'books/vocab',
        t: { uz: 'YADRO 5 · Kun yakuni', en: 'CORE 5 · Day close' },
        note: { uz: "15 daq lug'at 5 soniya testi (ko'r → 5 soniyada gap; ikkilangani daftarga), 15 daq MUCIZATI AHMADIY 3–4 sahifa, 15 daq xatolar daftari + ertangi kunni ochish.", en: '15 min vocabulary 5-second test (see → sentence in 5 s; hesitations go to the copybook), 15 min MUCIZATI AHMADIY 3–4 pages, 15 min error log + open tomorrow\'s lesson.' } },
      { id: 'h-wind', kind: 'rest', at: '20:30', min: 50, t: { uz: 'Tayyorgarlik / dam — ekransiz', en: 'Wind down — no screens' },
        note: { uz: "21:20 da yotasan. Uyqudan oldingi soat telefonsiz — ertangi dars shunga bog'liq.", en: 'Lights out at 21:20. The hour before sleep is phone-free — tomorrow\'s lesson depends on it.' } },

      { id: 'h-sleep', kind: 'sleep', at: '21:20', min: 480,
        t: { uz: 'UYQU · 8 soat', en: 'SLEEP · 8 hours' },
        note: { uz: "21:20 → 05:20. Himoyalangan blok: kun ulgurmasa dars qisqarsin, uyqu emas.", en: '21:20 → 05:20. Protected: if the day overruns, shorten a lesson, never the sleep.' } }
    ]
  },

  /* ====================== LC KUNI (Se · Pa · Sha) =======================
     Everest LC 16:30–18:30 qat'iy. Yadro yuklama LC bilan 6s 15d (375 daq):
     LC 120 · Ingliz 130 (grammatika 40, lug'at 30, writing 30, listening 30)
     · Coding 90 (Python 60 + DataCamp 30) · lug'at testi 15 · kitob 10 ·
     yakun 10. Kechki speaking yo'q — LC o'zi gapirish darsi.               */
  class: {
    key: 'class',
    name: { uz: 'LC kuni', en: 'LC day' },
    sub: { uz: "Everest LC 16:30–18:30 · Coding 1s 30d (Python + DataCamp)", en: 'Everest LC 16:30–18:30 · Coding 1h30 (Python + DataCamp)' },
    load: { uz: 'Yadro 6s 15d (LC bilan) · Ingliz 2s 10d + LC 2s · Coding 1s 30d · Kino 40d', en: 'Core 6h15 (incl. LC) · English 2h10 + LC 2h · Coding 1h30 · Film 40m' },
    blocks: [
      { id: 'c-fajr',  kind: 'pray',  prayer: 'fajr', min: 25, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'c-quran', kind: 'quran', at: '05:45', min: 20, t: { uz: "Qur'on tilovati", en: "Qur'an recitation" } },

      /* 1-YADRO · Ingliz tili — grammatika + lug'at (og'ir kundagi kabi,
         lekin qisqaroq: kechqurun LC bor).                                  */
      { id: 'c-eng', kind: 'eng', at: '06:05', min: 70, core: true, w: 'hard', link: 'english/{engDay}',
        t: { uz: 'YADRO 1 · Ingliz tili — grammatika va lug\'at', en: 'CORE 1 · English — grammar and vocabulary' },
        note: { uz: "40 daq grammatika (cheatsheet + mashqlar), 30 daq lug'at bo'limi + test. LC kuni tinglash bloki YO'Q — LC ning o'zi ikki soatlik tinglash va gapirish.", en: '40 min grammar (cheatsheet + exercises), 30 min vocabulary section + quiz. No listening block on an LC day — LC itself is two hours of listening and speaking.' } },
      { id: 'c-meal1', kind: 'meal', at: '07:15', min: 25, t: { uz: 'Nonushta', en: 'Breakfast' } },

      /* 2-YADRO · Coding — Python + DataCamp bitta o'tirishda. */
      { id: 'c-code', kind: 'py', at: '07:40', min: 90, core: true, w: 'hard', link: 'lesson/{pyDay}',
        t: { uz: 'YADRO 2 · Coding — Python va DataCamp', en: 'CORE 2 · Coding — Python and DataCamp' },
        note: { uz: "60 daq Python darsi + test, keyin 30 daq DataCamp bobi. Bitta o'tirish.", en: '60 min Python lesson + quiz, then the 30-minute DataCamp chapter. One sitting.' },
        after: { kind: 'py', link: 'plan',
          t: { uz: 'YADRO 2 · DataCamp (Python tugadi)', en: 'CORE 2 · DataCamp (Python done)' },
          note: { uz: "Python 30 kuni tugadi — butun blok DataCamp trekiga o'tadi.", en: 'The 30 Python days are done — the whole block moves to the DataCamp track.' } } },
      { id: 'c-br1', kind: 'meal', at: '09:10', min: 15, t: { uz: 'Tanaffus', en: 'Break' } },

      /* 3-YADRO · Writing — LC kunida yagona ishlab chiqarish bloki.
         Ilgari tinglashga ketgan 30 daqiqa shu yerga qo'shildi (LC takrori). */
      { id: 'c-write', kind: 'eng', at: '09:25', min: 50, core: true, w: 'hard', link: 'writing', writing: true,
        t: { uz: 'YADRO 3 · Writing', en: 'CORE 3 · Writing' },
        note: { uz: "Kam yoz, ko'p tuzat: 1 abzats → tekshir → qayta yoz. Ilgari bu yerda tinglash ham bor edi — LC bilan takrorlanmasin deb olib tashlandi. Writing kursi 1-oktabrdan.", en: 'Write less, correct more: one paragraph → check → rewrite. There used to be a listening slot here — removed so it does not duplicate LC. The Writing course starts 1 Oct.' } },

      { id: 'c-walk', kind: 'rest', at: '10:15', min: 75, t: { uz: 'SAYR / DAM — ekransiz', en: 'WALK / REST — no screens' } },
      { id: 'c-yt', kind: 'yt', at: '11:30', min: 25,
        t: { uz: 'YOUTUBE · inglizcha kanal', en: 'YOUTUBE · English channel' } },
      { id: 'c-free1', kind: 'rest', at: '11:55', min: 65, t: { uz: 'Erkin vaqt', en: 'Free time' } },

      { id: 'c-dhuhr', kind: 'pray', prayer: 'dhuhr', min: 20, t: { uz: 'Peshin namozi', en: 'Dhuhr prayer' } },
      { id: 'c-meal2', kind: 'meal', at: '13:20', min: 70, t: { uz: 'Tushlik va dam', en: 'Lunch and rest' } },
      { id: 'c-free2', kind: 'rest', at: '14:30', min: 75, t: { uz: 'Erkin vaqt / tayyorgarlik', en: 'Free time / preparation' },
        note: { uz: "Asr namozi shu oraliqda. LC ga borishdan oldin dam ol.", en: 'Asr falls in here. Rest before heading to LC.' } },
      { id: 'c-road', kind: 'meal', at: '15:45', min: 45, t: { uz: "Yo'l va tayyorgarlik", en: 'Travel and preparation' } },

      /* 4-YADRO · Everest LC — tashqi dars, vaqti qat'iy (16:30–18:30).
         `fixed: true` — validator uni yakka ish yukiga qo'shmaydi.          */
      { id: 'c-lc', kind: 'lc', at: '16:30', min: 120, core: true, w: 'med', fixed: true,
        t: { uz: 'YADRO 4 · Everest LC', en: 'CORE 4 · Everest LC' },
        note: { uz: "Tashqi dars, 16:30–18:30 qat'iy. Ikki soatlik tinglash va gapirish — shuning uchun bugun alohida listening va speaking bloklari yo'q.", en: 'External class, 16:30–18:30 fixed. Two hours of listening and speaking — which is why there are no separate listening or speaking blocks today.' } },

      { id: 'c-meal3', kind: 'meal', at: '18:30', min: 35, t: { uz: 'Kechki ovqat', en: 'Dinner' } },
      { id: 'c-free3', kind: 'rest', at: '19:05', min: 15, t: { uz: 'Tanaffus', en: 'Break' } },
      { id: 'c-movie', kind: 'movie', at: '19:20', min: 40, movie: true,
        t: { uz: 'KINO', en: 'FILM' },
        note: { uz: "Inglizcha, inglizcha subtitr bilan.", en: 'In English with English subtitles.' } },

      /* 5-YADRO · Kun yakuni — lug'at testi, kitob, LC xulosasi. */
      { id: 'c-close', kind: 'review', at: '20:00', min: 45, core: true, w: 'light', link: 'books/vocab',
        t: { uz: 'YADRO 5 · Kun yakuni', en: 'CORE 5 · Day close' },
        note: { uz: "15 daq lug'at 5 soniya testi, 15 daq MUCIZATI AHMADIY, 15 daq LC xulosasi (3 qator) + xatolar daftari + ertangi kun.", en: '15 min vocabulary 5-second test, 15 min MUCIZATI AHMADIY, 15 min LC summary (three lines) + error log + tomorrow.' } },
      { id: 'c-wind', kind: 'rest', at: '20:45', min: 35, t: { uz: 'Tayyorgarlik / dam — ekransiz', en: 'Wind down — no screens' } },

      { id: 'c-sleep', kind: 'sleep', at: '21:20', min: 480,
        t: { uz: 'UYQU · 8 soat', en: 'SLEEP · 8 hours' },
        note: { uz: '21:20 → 05:20.', en: '21:20 → 05:20.' } }
    ]
  },

  /* ====================== DAM KUNI (Yakshanba) ==========================
     HAQIQIY dam: yangi mavzu yo'q, LC yo'q, BITTA test bloki (Listening +
     Reading, 100 daq) — hafta shu bilan yakunlanadi. Python oyida (20-sen →
     19-okt) 45 daqiqalik Python darsi — 30/30 muddatga sig'ishi uchun;
     undan keyin o'sha slot SRS takroriga aylanadi. Kickoff yakshanbasida
     (20-sen) DataCamp 1-bob; boshqa yakshanbalarda shu slot — sayr.
     Coding takrori (30 savol) ixtiyoriy — yadroga kirmaydi.
     Yadro: test 100 · kitob 15 · hafta yakuni 15 (+ Python oyida 45).      */
  rest: {
    key: 'rest',
    name: { uz: 'Dam kuni', en: 'Rest day' },
    sub: { uz: "Yangi mavzu yo'q · bitta haftalik test · dam", en: 'No new material · one weekly test · rest' },
    load: { uz: 'Yadro 2s 10d · Test 1s 40d · Kino 45d · Dam 6s+', en: 'Core 2h10 · Test 1h40 · Film 45m · Rest 6h+' },
    blocks: [
      { id: 'r-fajr',  kind: 'pray',  prayer: 'fajr', min: 25, t: { uz: 'Bomdod namozi', en: 'Fajr prayer' } },
      { id: 'r-quran', kind: 'quran', at: '05:45', min: 30, t: { uz: "Qur'on tilovati", en: "Qur'an recitation" },
        note: { uz: 'Yakshanba — uzunroq tilovat uchun qulay kun', en: 'Sunday leaves room for a longer session' } },
      { id: 'r-rest1', kind: 'rest', at: '06:15', min: 105, t: { uz: 'DAM — ekransiz', en: 'REST — no screens' },
        note: { uz: "Uxlash, sayr, oila. Haftada bir marta miya to'liq to'xtashi kerak.", en: 'Sleep, a walk, family. Once a week the brain needs a full stop.' } },
      { id: 'r-meal1', kind: 'meal', at: '08:00', min: 40, t: { uz: 'Nonushta', en: 'Breakfast' } },

      /* 1-YADRO · Haftalik test — haftaning yagona majburiy ishi. */
      { id: 'r-test', kind: 'eng', at: '08:40', min: 100, core: true, w: 'hard', link: 'books',
        t: { uz: 'YADRO 1 · HAFTALIK TEST — Listening 40 + Reading 60', en: 'CORE 1 · WEEKLY TEST — Listening 40 + Reading 60' },
        note: { uz: "Bitta blok, real vaqt, soat qo'yib: avval Listening (bir marta tinglash), keyin Reading (3 matn, 40 savol). Natija jadvalga.", en: 'One block, real timing: Listening first (single play), then Reading (3 passages, 40 questions). The result goes on the board.' } },
      { id: 'r-br1', kind: 'meal', at: '10:20', min: 10, t: { uz: 'Tanaffus', en: 'Break' } },

      /* 2-YADRO · Bitta slot, IKKI shartli variant (bir-birini istisno qiladi):
           r-focus-dc  dcOnly  — o'sha yakshanba DataCamp bobi rejalashtirilgan
           r-focus     noDc    — aks holda Python darsi / SRS takrori
         Validator bularni to'qnashuv deb HISOBLAMAYDI (§6, §10).            */
      { id: 'r-focus-dc', kind: 'dc', at: '10:30', min: 60, core: true, w: 'med', link: 'datacamp', dcOnly: true,
        t: { uz: 'YADRO 2 · DataCamp bobi', en: 'CORE 2 · DataCamp chapter' },
        note: { uz: "Bugun DataCamp bobi rejalashtirilgan: nazariya + mashqlar DataCamp'da, keyin platformada bob testi.", en: 'A DataCamp chapter is scheduled today: theory + exercises on DataCamp, then the chapter quiz here.' } },
      { id: 'r-focus', kind: 'py', at: '10:30', min: 60, core: true, w: 'med', link: 'lesson/{pyDay}', noDc: true,
        t: { uz: 'YADRO 2 · Python darsi', en: 'CORE 2 · Python lesson' },
        note: { uz: "Faqat Python oyida (20-sen → 19-okt): 30 dars 30 kunga sig'ishi uchun. Keyin bu slot — haftalik takror.", en: 'Only in Python month (20 Sep → 19 Oct): so 30 lessons fit in 30 days. Afterwards this slot becomes the weekly review.' },
        after: { kind: 'review', link: 'review',
          t: { uz: 'YADRO 2 · TAKROR — SRS navbati', en: 'CORE 2 · REVIEW — SRS queue' },
          note: { uz: "Python tugadi — bu slot haftalik takror: navbatdagi konspekt va so'zlar.", en: 'Python is done — this slot is the weekly review: due summaries and words.' } } },

      { id: 'r-walk', kind: 'rest', at: '11:30', min: 45, t: { uz: 'SAYR — ekransiz', en: 'WALK — no screens' } },
      { id: 'r-rest2', kind: 'rest', at: '12:15', min: 45, t: { uz: 'DAM / oila', en: 'REST / family' } },

      { id: 'r-dhuhr', kind: 'pray', prayer: 'dhuhr', min: 20, t: { uz: 'Peshin namozi', en: 'Dhuhr prayer' } },
      { id: 'r-meal2', kind: 'meal', at: '13:20', min: 100, t: { uz: 'Tushlik va uzoq dam', en: 'Lunch and a long rest' } },
      { id: 'r-rest3', kind: 'rest', at: '15:00', min: 60, t: { uz: 'Oila / sayr', en: 'Family / walk' } },
      { id: 'r-yt', kind: 'yt', at: '16:00', min: 25,
        t: { uz: 'YOUTUBE · inglizcha kanal', en: 'YOUTUBE · English channel' },
        note: { uz: 'Dam kunida ham — 25 daqiqa, subtitrsiz.', en: 'Even on the rest day — 25 minutes, no subtitles.' } },
      { id: 'r-rest4', kind: 'rest', at: '16:25', min: 85, t: { uz: 'Erkin vaqt', en: 'Free time' },
        note: { uz: "Asr namozi shu oraliqda.", en: 'Asr falls in here.' } },
      { id: 'r-meal3', kind: 'meal', at: '17:50', min: 45, t: { uz: 'Kechki ovqat', en: 'Dinner' } },

      /* Ikkinchi shartli juftlik (18:35) — ixtiyoriy, yadroga kirmaydi:
           r-code  notFirst  — coding takrori
           r-kick  firstOnly — kickoff kuni takror qiladigan narsa yo'q       */
      { id: 'r-code', kind: 'dc', at: '18:35', min: 30, link: 'practice/coding', notFirst: true,
        t: { uz: 'IXTIYORIY · Coding takrori (30 savol)', en: 'OPTIONAL · Coding review (30 questions)' },
        note: { uz: "Xohlasang: shu haftagacha o'tilgan Python + DataCamp bo'yicha savollar. Yadroga kirmaydi — qilmasang qarz yo'q.", en: 'If you like: questions on every Python lesson and DataCamp chapter so far. Not core — skipping it is not debt.' } },
      { id: 'r-kick', kind: 'rest', at: '18:35', min: 30, firstOnly: true,
        t: { uz: 'DAM — birinchi kun yakuni', en: 'REST — end of the first day' },
        note: { uz: "Rasmiy startning birinchi kuni: hali takror qiladigan narsa yo'q. Ertaga og'ir kun — dam ol.", en: 'First day of the official start: nothing to review yet. Tomorrow is a heavy day — rest.' } },

      { id: 'r-movie', kind: 'movie', at: '19:05', min: 45, movie: true,
        t: { uz: 'KINO', en: 'FILM' },
        note: { uz: "Yakshanba — uzunroq. Kunning filmi yuqorida.", en: 'Longer on Sunday. The day\'s film is shown above.' } },

      /* 3-YADRO · Hafta yakuni — kitob + maqsad doskasi + haftalik xulosa. */
      { id: 'r-close', kind: 'review', at: '19:50', min: 45, core: true, w: 'light', link: 'goal',
        t: { uz: 'YADRO 3 · Hafta yakuni', en: 'CORE 3 · Week close' },
        note: { uz: "15 daq MUCIZATI AHMADIY 3–4 sahifa, 30 daq hafta yakuni: test natijasi, haftaning 3 xatosi, keyingi haftaning bitta maqsadi.", en: '15 min MUCIZATI AHMADIY 3–4 pages, 30 min week close: the test result, the week\'s three mistakes, one goal for next week.' } },
      { id: 'r-wind', kind: 'rest', at: '20:35', min: 45, t: { uz: 'Tayyorgarlik / dam — ekransiz', en: 'Wind down — no screens' },
        note: { uz: "Dushanba og'ir kun — 21:20 da yot.", en: 'Monday is a heavy day — lights out at 21:20.' } },

      { id: 'r-sleep', kind: 'sleep', at: '21:20', min: 480,
        t: { uz: 'UYQU · 8 soat', en: 'SLEEP · 8 hours' },
        note: { uz: '21:20 → 05:20.', en: '21:20 → 05:20.' } }
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
    movie:  { icon: 'film',      name: { uz: 'Kino', en: 'Film' } },
    yt:     { icon: 'play',      name: { uz: 'YouTube', en: 'YouTube' } },
    book:   { icon: 'book',      name: { uz: 'Kitob', en: 'Book' } },
    sleep:  { icon: 'moon',      name: { uz: 'Uyqu', en: 'Sleep' } }
  }
};
