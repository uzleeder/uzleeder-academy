/* ==========================================================================
   DEMO HISOB: "leejon" — rejaning ~50% i bajarilgan holat (localhost uchun)
   --------------------------------------------------------------------------
   MUHIM: bu SINOV ma'lumoti, haqiqiy progress emas. Faqat mahalliy
   localStorage ga yoziladi. Store ning o'z API si orqali yoziladi — shuning
   uchun activity, events, streak, mastery hammasi ilova o'zi hisoblagandek
   chiqadi (qo'lda yasalgan JSON emas).
   ========================================================================== */
(function () {
  'use strict';
  var log = [];

  /* --- 0. toza boshlanish + ism --- */
  Store.resetAll();
  Store.set('name', 'leejon');
  Store.set('lang', 'uz');
  Store.set('theme', 'dark');
  Store.profileSet({ title: "O'quvchi · AI Engineering Path", bio: "Noldan AI muhandisligigacha. Python + IELTS 8.0." });

  /* --- 1. Python: 30 kundan 15 tasi yopilgan (7–10 ball) --- */
  var pyScores = [8, 9, 7, 10, 8, 7, 9, 8, 10, 7, 9, 8, 7, 9, 10];
  pyScores.forEach(function (s, i) { Store.recordScore(i + 1, s); });
  log.push('Python: ' + Store.doneCount() + '/30');

  /* --- 2. Ingliz tili: 140 kundan 70 tasi yopilgan + vazifalar --- */
  for (var d = 1; d <= 70; d++) {
    Store.engSetDayDone(d, true);
    for (var t = 0; t < 6; t++) Store.engSetTask(d, t, true);
  }
  /* Mock kunlari — band ballari (IELTS qoidasi bo'yicha yaxlitlanadi) */
  Store.engSetScore(4,  { l: 6.0, r: 6.0, w: 5.5, s: 6.0 });
  Store.engSetScore(32, { l: 6.5, r: 6.5, w: 6.0, s: 6.5 });
  Store.engSetScore(60, { l: 7.0, r: 7.0, w: 6.5, s: 6.5 });
  /* Haftalik testlar (yakshanba) — 10 hafta */
  for (var w = 1; w <= 10; w++) Store.quizSet('eng:' + (w * 7), 8 + (w % 3), 10);
  log.push('English: ' + Store.engDoneCount() + '/140');

  /* --- 3. DataCamp: 14 bobdan 7 tasi --- */
  DataCamp.items().slice(0, 7).forEach(function (it) {
    Store.setFlag('dc:' + it.id, true);
    Store.quizSet('dc:' + it.id, 5, 5);
  });
  log.push('DataCamp: ' + DataCamp.doneCount() + '/' + DataCamp.total());

  /* --- 4. Speaking 30: 15 kun yozuv --- */
  for (var s2 = 1; s2 <= 15; s2++) {
    Store.setSpeakNote(s2, 'Kun ' + s2 + ': 3 yozuv bajarildi. WPM ' + (92 + s2) + ', 2 s pauza ' + Math.max(1, 8 - Math.floor(s2 / 3)) + ' ta.');
    Store.setFlag('spk-ck:' + s2 + ':1', true);
    Store.setFlag('spk-ck:' + s2 + ':2', true);
    Store.setFlag('spk-ck:' + s2 + ':3', true);
  }
  log.push('Speaking: ' + Store.speakDoneCount() + '/30');

  /* --- 5. Quick Repeat: 10 kundan 5 tasi --- */
  for (var q = 1; q <= 5; q++) {
    Store.setFlag('q10:' + q, true);
    Store.quizSet('q10:' + q, 4, 5);
  }

  /* --- 6. Kitoblar: har trekdan yarmi (12/24), lug'at 15/30 --- */
  [['r', 12], ['d', 12], ['t', 12]].forEach(function (x) {
    for (var n = 1; n <= x[1]; n++) {
      Store.readSet(x[0] + n, { wpm: 210 + (n % 40), score: 10 + (n % 3), total: 13, best: 10 + (n % 3), attempts: 1 });
    }
  });
  for (var v = 1; v <= 15; v++) Store.setFlag('bv:' + v, true);

  /* --- 7. Kunlik intizom: o'tgan kunlarning yarmi to'liq --- */
  var habitDays = ['2026-09-20', '2026-09-21', '2026-09-23', '2026-09-25'];
  habitDays.forEach(function (k) {
    var day = HabitPlan.forDate(k);
    var ids = (day.blocks || []).map(function (b) { return b.id; });
    if (ids.length) Store.habitSetDay(k, ids, true);
  });
  log.push('Intizom: ' + Store.habitDayCount() + ' kun');

  /* --- 8. Xato banki: 8 ta, 3 tasi tuzatilgan --- */
  var mistakes = [
    ['python',  'py:3:2',  { q: 'int("12abc") nima qaytaradi?', chosen: '12', correct: 'ValueError', topic: 'Python · turlar', route: 'lesson/3', why: 'int() faqat toza raqamli satrni o\'giradi.' }],
    ['python',  'py:7:5',  { q: 'list.append() nima qaytaradi?', chosen: 'yangi ro\'yxat', correct: 'None', topic: 'Python · ro\'yxatlar', route: 'lesson/7', why: 'append joyida o\'zgartiradi, None qaytaradi.' }],
    ['grammar', 'eng:12:1', { q: 'She ___ here since 2019.', chosen: 'is working', correct: 'has been working', topic: 'Present Perfect Continuous', route: 'english/12', why: '"since" + davom etayotgan ish → PPC.' }],
    ['vocab',   'eng:20:3', { q: 'sinonim: "mitigate"', chosen: 'increase', correct: 'alleviate', topic: 'Academic vocab', route: 'english/20', why: 'mitigate = yumshatmoq, kamaytirmoq.' }],
    ['reading', 'r5:4',    { q: 'Koala 2022-yilda qanday maqom oldi?', chosen: 'vulnerable', correct: 'endangered', topic: 'Racing to Rescue Koalas', route: 'books/r5', why: 'Matnda "reclassified as endangered".' }],
    ['listening', 'l3:2',  { q: 'Section 1: telefon raqami', chosen: '0207 1123', correct: '0207 1132', topic: 'Listening S1', route: 'books/l3', why: 'Raqamlar juftlab aytiladi.' }],
    ['writing', 'wr:6:1',  { q: 'Task 2 kirish: fikr bildirildimi?', chosen: 'yo\'q', correct: 'ha — aniq pozitsiya', topic: 'Writing Task 2', route: 'writing/6', why: 'Opinion essayda kirishda pozitsiya bo\'lishi shart.' }],
    ['speaking', 'sp:9:1', { q: 'Part 2: 2 daqiqa to\'ldirildimi?', chosen: '1:10', correct: '1:50+', topic: 'Speaking Part 2', route: 'speaking', why: 'Vaqtni to\'ldirmaslik — fluency ballini tushiradi.' }]
  ];
  mistakes.forEach(function (m) { Store.addMistake2(m[0], m[1], m[2]); });
  Store.mistakes().slice(0, 3).forEach(function (m) { Store.toggleMistake(m.id); });
  log.push('Xatolar: ' + Store.mistakes().length + ' (ochiq ' + Store.openMistakes().length + ')');

  /* --- 9. Takror navbati (SRS) --- */
  if (window.Review && Review.add) {
    for (var rv = 1; rv <= 12; rv++) Review.add('vocab', 'seed-v' + rv, { cat: 'vocab' });
    for (var rp = 1; rp <= 6; rp++)  Review.add('python', 'seed-p' + rp, { cat: 'python' });
  }

  /* --- 10. Daftar yozuvlari --- */
  var words = [['resilient', 'tough, hardy', 'A resilient economy recovers quickly.'],
               ['mitigate', 'alleviate, ease', 'Planting trees mitigates flooding.'],
               ['scarce', 'rare, limited', 'Water is scarce in the region.'],
               ['thrive', 'flourish, prosper', 'The koala cannot thrive without eucalyptus.'],
               ['deteriorate', 'worsen, decline', 'Air quality deteriorated after 2015.']];
  words.forEach(function (x) { Store.copySet('vocab', { word: x[0], syn: x[1], ex: x[2], pos: 'adj' }); });
  Store.copySet('coding', { title: 'List comprehension', text: '[x*x for x in range(10) if x % 2 == 0]' });

  /* --- 11. Kun duosi: oxirgi 5 kun --- */
  ['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26'].forEach(function (k) { Store.setFlag('dua:' + k, true); });

  /* --- 12. O'quv vaqti: oxirgi 45 kun --- */
  var t0 = new Date(Store.dateKey() + 'T12:00:00');
  for (var i = 44; i >= 0; i--) {
    var dt = new Date(t0); dt.setDate(dt.getDate() - i);
    var k2 = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
    if (dt.getDay() === 0) continue;                       // yakshanba — yengilroq
    Store.addMinutes(k2, 'eng', 180 + (i % 5) * 20);
    Store.addMinutes(k2, 'code', 90 + (i % 4) * 15);
    Store.sessionAdd(k2, 120 + (i % 6) * 15);
  }

  /* --- 13. Faollik va hodisalarni orqaga taqsimlash ---------------------
     Store hamma narsani BUGUNGI sanaga yozdi (chunki hozir yozildi).
     Issiqlik xaritasi va vaqt chizig'i tabiiy ko'rinishi uchun ularni
     oxirgi 45 kunga tarqatamiz.                                          */
  var st = Store.all();
  var days = [];
  for (var j = 44; j >= 0; j--) {
    var d2 = new Date(t0); d2.setDate(d2.getDate() - j);
    days.push({ key: d2.getFullYear() + '-' + String(d2.getMonth() + 1).padStart(2, '0') + '-' + String(d2.getDate()).padStart(2, '0'), ms: d2.getTime() });
  }
  /* activity: bugungi katta son o'rniga kunlarga bo'lib chiqamiz */
  var totalActs = 0;
  Object.keys(st.activity).forEach(function (k) { totalActs += st.activity[k]; });
  st.activity = {};
  var idx = 0;
  while (totalActs > 0) {
    var day = days[idx % days.length];
    var take = Math.min(totalActs, 1 + (idx % 3));
    st.activity[day.key] = (st.activity[day.key] || 0) + take;
    totalActs -= take; idx++;
  }
  /* events: vaqt bo'yicha teng tarqatiladi (tartibi saqlanadi) */
  var evs = st.events || [];
  evs.forEach(function (e, i2) {
    var day2 = days[Math.floor(i2 * days.length / Math.max(1, evs.length))];
    e.at = day2.ms + (i2 % 12) * 600000;
  });
  evs.sort(function (a, b) { return a.at - b.at; });
  st.events = evs.slice(-400);
  Store.replace(st);

  log.push('Faollik: ' + Object.keys(Store.activityMap()).length + ' kun · hodisa: ' + Store.events().length);
  log.push('Streak: ' + Store.streak() + ' kun');
  return log.join('\n');
})();
