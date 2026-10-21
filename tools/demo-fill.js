/* ==========================================================================
   tools/demo-fill.js — LOKAL hisobni "hammasi tugatilgan" holatga to'ldiradi
   --------------------------------------------------------------------------
   Nima uchun: sertifikatlar, tahlil, profil, streak — hammasini haqiqiy
   ma'lumot bilan ko'rish uchun. Faqat brauzer localStorage'iga yozadi
   (Store API orqali — tuzilma buzilmaydi). Bulutga faqat login qilingan
   bo'lsa sync bo'ladi; lokal serverda API yo'q, demak faqat shu brauzerda.

   Ishlatish (ilova ochiq turganda, brauzer konsolida):
     var s=document.createElement('script'); s.src='/tools/demo-fill.js'; document.head.appendChild(s);

   Bekor qilish: Sozlamalar → "Hamma progressni o'chirish".
   tools/ papkasi .vercelignore'da — deploy'ga chiqmaydi.
   ========================================================================== */
(function () {
  'use strict';
  var today = Store.dateKey();
  var out = {};
  function step(name, fn) { try { out[name] = fn() || 'ok'; } catch (e) { out[name] = 'XATO: ' + e.message; } }

  /* --- Profil --- */
  step('profile', function () {
    if (!Store.get('name')) Store.set('name', 'Muhammadakbar');
    Store.profileSet({
      title: 'AI Engineer · UzLeeder Academy',
      bio: "30 kunlik Python va 140 kunlik IELTS 8.0 dasturini tugatdim. Endi — DataCamp AI Engineer treki va portfolio loyihalari."
    });
    return Store.get('name');
  });

  /* --- Python: 30 kun, ballar 8–10 --- */
  step('python', function () {
    var sc = [9, 10, 8, 9, 10, 9, 8, 10, 9, 9, 10, 9, 8, 9, 10, 10, 9, 9, 8, 10, 9, 10, 9, 9, 8, 10, 9, 10, 9, 10];
    COURSE.forEach(function (d, i) { Store.recordScore(d.day, sc[i % sc.length]); });
    var notes = {
      1: "O'zgaruvchi = nomlangan quti. = tenglik emas, \"sol\" degani. type() bilan tekshirish odat.",
      5: "elif zanjirida tartib muhim: tor shart yuqorida. = va == farqi — eng ko'p xato.",
      12: "dict.get(key, default) — foydalanuvchi ma'lumoti bilan ishlaganda doim shu.",
      16: "Mutable default (lst=[]) tuzog'i — None ishlat. *args tuple, **kwargs dict.",
      21: "Comprehension: NIMA → QAYERDAN → QAYSI SHARTDA. if-else boshda = o'zgartirish, oxirida = filtr.",
      24: "'w' faylni tozalaydi! Shubhalansam 'a'. with — o'zi yopadi.",
      27: "Klass = qolip, obyekt = pechene. self — shu obyektning o'zi."
    };
    Object.keys(notes).forEach(function (d) { Store.setNote(Number(d), notes[d]); });
    // Bir nechta xato — yarmi hal qilingan (Xatolar daftari bo'sh ko'rinmasin)
    [[2, 2], [6, 3], [9, 1], [15, 8], [23, 3]].forEach(function (p) {
      var q = dayOf(p[0]).quiz[p[1]];
      Store.addMistake(p[0], p[1], q.opts[(q.correct + 1) % 4], q.opts[q.correct], q.q);
    });
    Store.mistakes().slice(0, 3).forEach(function (m) { Store.toggleMistake(m.id); });
    if (window.DCPLAN) DCPLAN.phases.forEach(function (p) { if (!Store.planDone('phase' + p.n)) Store.togglePlan('phase' + p.n); });
    return Store.doneCount() + '/' + COURSE.length + ', o\'rtacha ' + Store.avgScore().toFixed(1);
  });

  /* --- Ingliz tili: 140 kun + mock natijalar (6.0 → 8.0) + kunlik testlar --- */
  step('english', function () {
    var days = ENGLISH.meta.days;
    for (var d = 1; d <= days; d++) {
      Store.engSetDayDone(d, true);
      Store.quizSet('eng:' + d, 8 + (d % 3 ? 1 : 0), 10);          // 80–90 %
    }
    var mocks = { 10: [5.5, 6, 5.5, 5.5], 30: [6, 6.5, 6, 6], 50: [6.5, 7, 6.5, 6.5], 70: [7, 7, 6.5, 7],
      90: [7.5, 7.5, 7, 7], 110: [7.5, 8, 7.5, 7.5], 130: [8, 8, 7.5, 8], 140: [8, 8.5, 8, 8] };
    Object.keys(mocks).forEach(function (d) { var b = mocks[d]; Store.engSetScore(d, { l: b[0], r: b[1], w: b[2], s: b[3] }); });
    ['pr:grammar', 'pr:vocab', 'pr:reading', 'pr:listening', 'pr:writing'].forEach(function (k) { Store.quizSet(k, 17, 20); });
    var last = Store.engLastScore();
    return Store.engDoneCount() + '/' + days + ', oxirgi mock overall ' + Store.engOverall(last);
  });

  /* --- DataCamp: barcha boblar --- */
  step('datacamp', function () {
    if (!window.DataCamp) return 'modul yo\'q';
    var n = DataCamp.total();
    for (var i = 1; i <= n; i++) { var it = DataCamp.byN(i); if (!it) continue; Store.setFlag('dc:' + it.id, true); Store.quizSet('dc:' + it.id, 9, 10); }
    return DataCamp.doneCount() + '/' + n;
  });

  /* --- Kunlik intizom: rejaning boshidan bugungacha har blok --- */
  step('habit', function () {
    if (!window.HabitPlan) return 'modul yo\'q';
    var k = HABIT.meta.from, n = 0;
    while (k <= today) {
      if (HabitPlan.inRange(k)) {
        var plan = HabitPlan.forDate(k);
        Store.habitSetDay(k, plan.blocks.map(function (b) { return b.id; }), true);
        n++;
      }
      k = Store.shiftDays(k, 1);
    }
    return n + ' kun to\'liq';
  });

  /* --- Faollik xaritasi, soatlar, sessiyalar: oxirgi 60 kun --- */
  step('activity', function () {
    var act = {};
    for (var i = 59; i >= 0; i--) {
      var k = Store.shiftDays(today, -i);
      act[k] = 1 + (i % 3);
      Store.addMinutes(k, 'eng', 150 + (i * 7) % 90);
      Store.addMinutes(k, 'code', 45 + (i * 11) % 75);
      Store.sessionAdd(k, 180 + (i * 13) % 120);
    }
    Store.all().activity = act;
    Store.set('lang', Store.get('lang'));             // saqlash
    return 'streak ' + Store.streak();
  });

  /* --- Speaking 30, SRS takror, tashqi sertifikatlar --- */
  step('speaking', function () {
    for (var n = 1; n <= 30; n++) Store.setSpeakNote(n, 'Day ' + n + ' — 2 min talk recorded. Key phrases: on the one hand / that said / in my experience.');
    return Store.speakDoneCount() + '/30';
  });
  step('review', function () {
    if (!window.Review) return 'modul yo\'q';
    COURSE.forEach(function (d) { Review.add('py', d.day); });
    var all = Store.reviewAll(), n = 0;
    Object.keys(all).forEach(function (id, i) {
      var it = all[id]; it.reps = 3 + (i % 3); it.ivl = 14; it.due = Store.shiftDays(today, 3 + (i % 10)); it.last = today;
      Store.reviewSet(id, it); n++;
    });
    return n + ' ta element, hammasi takrorlangan';
  });
  step('certs', function () {
    // bir xil id — qayta ishga tushirilsa ustidan yozadi, ko'paymaydi
    Store.certAdd({ id: 'demo-dc-py', name: 'Associate Python Developer', issuer: 'DataCamp', date: '2026-11-02' });
    Store.certAdd({ id: 'demo-dc-ai', name: 'AI Engineer for Developers — Associate', issuer: 'DataCamp', date: '2027-01-15' });
    Store.certAdd({ id: 'demo-ielts', name: 'IELTS Academic — Overall Band 8.0', issuer: 'British Council', date: '2027-02-20' });
    return Store.certList().length + ' ta';
  });

  /* --- Mahorat ko'rsatkichlari uchun (Mastery.english / Mastery.python) ---
     Har ko'nikma o'z manbasidan hisoblanadi — shuning uchun har birini
     alohida to'ldiramiz. Manbalar: js/engine.js → Mastery.               */
  step('vocab', function () {
    // 600 ta so'z: ENG_VOCAB mavzularidan olamiz, yetmasa takror (id har xil)
    var pool = [];
    if (window.ENG_VOCAB) Object.keys(ENG_VOCAB).forEach(function (t) { (ENG_VOCAB[t].words || []).forEach(function (w) { pool.push({ w: w.w, uz: w.uz || '', topic: t }); }); });
    if (!pool.length) pool = [{ w: 'curriculum', uz: "o'quv dasturi", topic: 'education' }];
    var have = Store.copyList('vocab').length, n = 0;
    for (var i = have; i < 600; i++) {
      var s = pool[i % pool.length];
      var id = 'demo-v' + i;
      Store.copySet('vocab', { id: id, word: s.w, tr: s.uz, note: s.topic, created: Date.now() - (600 - i) * 3600e3 });
      Store.reviewSet('vocab:' + id, { kind: 'vocab', ref: id, due: Store.shiftDays(today, 5 + (i % 20)), ivl: 8 + (i % 6), reps: 3, lapses: 0, last: today, at: Date.now(), meta: {} });
      n++;
    }
    return Store.copyList('vocab').length + ' so\'z (+' + n + ')';
  });
  step('grammar', function () {
    if (!window.ENG_GRAMMAR) return 'ma\'lumot yo\'q';
    Object.keys(ENG_GRAMMAR).forEach(function (k) { Store.setFlag('gr:' + k, true); });
    return Object.keys(ENG_GRAMMAR).length + ' mavzu';
  });
  step('reading', function () {
    // 48 matn: r1–16 (reading), d1–16 (dual), t1–16 (tarix) — ball 8–10/10, tezlik 180–230 wpm
    var n = 0;
    ['r', 'd', 't'].forEach(function (p) {
      for (var i = 1; i <= 16; i++) { Store.readSet(p + i, { score: 8 + (i % 3), total: 10, wpm: 180 + (i * 7) % 50, at: Date.now() }); n++; }
    });
    [1, 2, 3, 4].forEach(function (w) { Store.readSet('spkw' + w, { wpm: 110 + w * 5, at: Date.now() }); });   // speaking o'lchovlari
    return n + ' matn';
  });
  step('listening', function () {
    for (var i = 1; i <= 60; i++) Store.bbcSet('demo-ep-' + i, { done: true, at: Date.now() - i * 86400e3 });
    for (var d = 1; d <= ENGLISH.meta.days; d++) Store.setFlag('ls:' + d, true);
    return Store.bbcDoneCount() + ' epizod';
  });
  step('writing', function () {
    var n = window.WRITING ? WRITING.weeks.length : 19;
    for (var w = 1; w <= n; w++) if (!Store.planDone('wr' + w)) Store.togglePlan('wr' + w);
    return n + ' hafta';
  });
  step('projects', function () {
    if (!window.PROJECTS) return 'ma\'lumot yo\'q';
    PROJECTS.list.forEach(function (p) { Store.setFlag('proj:' + p.id + ':done', true); });
    return PROJECTS.list.length + ' loyiha';
  });

  /* --- Birinchi qadamlar ro'yxatini yopish --- */
  step('flags', function () {
    ['seen:roadmap', 'seen:goal', 'seen:habit', 'seen:englishday', 'onb:hide'].forEach(function (f) { Store.setFlag(f, true); });
    return 'ok';
  });

  if (window.App) { App.refreshChrome(); App.render(); }
  window.__demoFill = out;
  console.table(out);
})();
