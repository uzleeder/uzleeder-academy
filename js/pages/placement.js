/* ==========================================================================
   DARAJA TESTI — "Men buni allaqachon bilaman"
   --------------------------------------------------------------------------
   Python kursi 30 kun, 4 hafta. Pythonni allaqachon biladigan odam uchun
   1-kundan boshlash vaqtni behuda sarflash. Shu test bilimni TEKSHIRADI va
   o'tilgan haftalarni o'tkazib yuborish imkonini beradi.

   SAVOLLAR O'YLAB TOPILMAYDI. Har bir savol kursning o'z kunlik testidan
   olinadi (COURSE[n].quiz) — ya'ni test aynan shu kursda o'rgatiladigan
   narsani so'raydi. Har haftadan 5 ta savol, turli kunlardan, tasodifiy.

   HALOL CHEGARA. Test o'tilgan hafta "bajarilgan" deb BELGILANMAYDI:
     - `Store.isDone(day)` kunlik testdan 7+ ball olganda rost bo'ladi;
       daraja testi bunga tegmaydi, ya'ni progress foizi va sertifikat
       o'zgarmaydi — ularni haqiqatan dars qilgan odam oladi.
     - Daraja testi faqat "bu haftani o'tkazib yuborsa bo'ladi" deydi:
       kunlar `read['py-placement'].skip` ro'yxatiga tushadi va keyingi
       dars shulardan keyin boshlanadi.
   Shuning uchun natijada ikki narsa alohida ko'rsatiladi: nimani ISBOTLADI
   va nima hali BAJARILMAGAN.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'py-placement';
  var PER_UNIT = 5;        // har haftadan nechta savol
  var PASS = 4;            // o'tish uchun nechta to'g'ri (5 tadan)

  function t(uz, en) { return L({ uz: uz, en: en }); }

  /* Haftalar: COURSE dagi `unit` maydoni bo'yicha, kun tartibida */
  function units() {
    var order = [], map = {};
    COURSE.forEach(function (c) {
      if (!map[c.unit]) { map[c.unit] = { name: c.unit, days: [], topics: [] }; order.push(map[c.unit]); }
      map[c.unit].days.push(c.day);
      if (c.type === 'topic' && c.quiz && c.quiz.length) map[c.unit].topics.push(c);
    });
    return order;
  }

  /* Tasodifiy tanlov — takrorlanmaydigan indekslar */
  function pick(n, max) {
    var all = [], out = [];
    for (var i = 0; i < max; i++) all.push(i);
    while (out.length < n && all.length) out.push(all.splice(Math.floor(Math.random() * all.length), 1)[0]);
    return out;
  }

  /* Test to'plami: har haftadan PER_UNIT ta savol, imkon qadar turli kunlardan */
  function build() {
    var qs = [];
    units().forEach(function (u, ui) {
      var pool = [];
      u.topics.forEach(function (c) {
        c.quiz.forEach(function (q, qi) { pool.push({ day: c.day, qi: qi, q: q }); });
      });
      /* avval har kundan bittadan, keyin qolganini to'ldiramiz —
         shunda savollar bitta kunga to'planib qolmaydi */
      var byDay = {}, spread = [];
      pool.forEach(function (p) { (byDay[p.day] = byDay[p.day] || []).push(p); });
      var days = Object.keys(byDay);
      pick(days.length, days.length).forEach(function (di) {
        var list = byDay[days[di]];
        spread.push(list[Math.floor(Math.random() * list.length)]);
      });
      var extra = pool.filter(function (p) { return spread.indexOf(p) < 0; });
      while (spread.length < PER_UNIT && extra.length) {
        spread.push(extra.splice(Math.floor(Math.random() * extra.length), 1)[0]);
      }
      spread.slice(0, PER_UNIT).forEach(function (p) {
        qs.push({ unit: ui, unitName: u.name, day: p.day, q: p.q.q, opts: p.q.opts, correct: p.q.correct });
      });
    });
    return qs;
  }

  window.Placement = {
    PASS: PASS, PER_UNIT: PER_UNIT,
    units: units,
    build: build,
    saved: function () { return Store.readGet(KEY); },
    /* O'tkazib yuborilgan kunlar — jadval va "keyingi dars" shuni hisobga oladi */
    skipDays: function () {
      var r = Store.readGet(KEY);
      return (r && r.applied && r.skip) || [];
    },
    isSkipped: function (day) { return Placement.skipDays().indexOf(day) >= 0; },
    save: function (rec) { Store.readSet(KEY, rec); },
    /* Store.readSet faqat PATCH qabul qiladi (readDel yo'q), shuning uchun
       yozuv o'chirilmaydi — `applied` o'chiriladi. Test tarixi saqlanib
       qoladi, o'tkazib yuborish esa bekor bo'ladi.                      */
    clear: function () { Store.readSet(KEY, { applied: false, skip: [] }); }
  };

  /* ====================== SAHIFA ======================================= */
  var state = null;    /* { qs, answers, done, result } */

  function head() {
    return '<header class="lesson-head">' +
      '<div class="crumb">' + esc(t('PYTHON KURSI', 'PYTHON COURSE')) + ' · ' + esc(t('DARAJA TESTI', 'PLACEMENT TEST')) + '</div>' +
      '<h1>' + esc(t('Men buni bilaman', 'I already know this')) + '</h1>' +
      '<p class="lede">' + esc(t(
        'Savollar kursning o\'z kunlik testlaridan olingan — har haftadan 5 ta, turli kunlardan. ' + (PER_UNIT * 4) + ' ta savol, taxminan 10 daqiqa.',
        'The questions come from the course\'s own daily quizzes — five per week, from different days. ' + (PER_UNIT * 4) + ' questions, about ten minutes.')) + '</p>' +
      '</header>';
  }

  function intro() {
    var prev = Placement.saved();
    if (prev && !prev.of) prev = null;        /* bo'sh yozuv - test topshirilmagan */
    var h = head();
    h += '<div class="card pl-intro">' +
      '<h3>' + esc(t('Bu test nima qiladi va nima qilmaydi', 'What this test does and does not do')) + '</h3>' +
      '<ul class="pl-rules">' +
        '<li><b>' + esc(t('Qiladi:', 'It does:')) + '</b> ' + esc(t(
          'bilgan haftalaringizni o\'tkazib yuboradi — keyingi dars siz bilmagan joydan boshlanadi.',
          'it lets you skip the weeks you know — your next lesson starts where your knowledge ends.')) + '</li>' +
        '<li><b>' + esc(t('Qilmaydi:', 'It does not:')) + '</b> ' + esc(t(
          'kunlarni "bajarilgan" deb belgilamaydi. Progress foizi va sertifikat o\'zgarmaydi — ular haqiqatan dars qilganda beriladi.',
          'it does not mark days as completed. Your progress percentage and certificate stay as they are — those are earned by doing the work.')) + '</li>' +
        '<li>' + esc(t(
          'Har hafta alohida baholanadi: 5 tadan ' + PASS + ' ta to\'g\'ri bo\'lsa — o\'sha hafta o\'tkazib yuboriladi.',
          'Each week is scored separately: ' + PASS + ' correct out of 5 passes that week.')) + '</li>' +
        '<li>' + esc(t(
          'Istalgan vaqtda qayta topshirish yoki bekor qilish mumkin.',
          'You can retake it or undo it at any time.')) + '</li>' +
      '</ul>' +
      (prev && prev.applied ? '<div class="callout tip"><span class="co-ic">' + IC.check + '</span><div>' +
        esc(t('Hozir o\'tkazib yuborilgan: ', 'Currently skipped: ')) + '<b>' + prev.skip.length + ' ' + esc(t('kun', 'days')) + '</b> · ' +
        esc(t('test sanasi', 'tested')) + ' ' + esc(prev.on || '') +
        '</div></div>' : '') +
      '<div class="row-btns">' +
        '<button class="btn primary" id="plStart">' + esc(prev ? t('Qayta topshirish', 'Retake the test') : t('Testni boshlash', 'Start the test')) + '</button>' +
        (prev && prev.applied ? '<button class="btn" id="plUndo">' + esc(t('Bekor qilish', 'Undo the skip')) + '</button>' : '') +
        '<button class="btn" data-go="python">' + esc(t('1-kundan boshlayman', 'I will start from day 1')) + '</button>' +
      '</div></div>';
    return h;
  }

  function quiz() {
    var h = head();
    h += '<div class="card pl-quiz"><div class="pl-count" id="plCount"></div><div id="plQs">';
    state.qs.forEach(function (q, i) {
      h += '<div class="pl-q" data-q="' + i + '">' +
        '<div class="pl-qh"><span class="pl-n">' + (i + 1) + '</span>' +
          '<span class="pl-unit">' + esc(q.unitName) + '</span></div>' +
        '<p class="pl-qt">' + esc(q.q) + '</p>' +
        '<div class="pl-opts">' +
          q.opts.map(function (o, oi) {
            return '<button class="pl-opt" data-q="' + i + '" data-o="' + oi + '">' + esc(o) + '</button>';
          }).join('') +
        '</div></div>';
    });
    h += '</div><div class="row-btns"><button class="btn primary" id="plSubmit">' +
      esc(t('Tekshirish', 'Check answers')) + '</button>' +
      '<button class="btn" id="plCancel">' + esc(t('Bekor qilish', 'Cancel')) + '</button></div></div>';
    return h;
  }

  function score() {
    var us = units(), per = us.map(function (u, i) {
      var qs = state.qs.filter(function (q) { return q.unit === i; });
      var got = qs.filter(function (q, j) {
        var idx = state.qs.indexOf(q);
        return state.answers[idx] === q.correct;
      }).length;
      return { name: u.name, days: u.days, got: got, of: qs.length, pass: got >= PASS };
    });
    var skip = [];
    /* Faqat BOSHIDAN ketma-ket o'tilgan haftalar o'tkaziladi: 3-haftani
       bilib, 1-haftani bilmaslik — kursni o'rtasidan boshlash degani emas. */
    for (var i = 0; i < per.length; i++) {
      if (!per[i].pass) break;
      skip = skip.concat(per[i].days);
    }
    return { per: per, skip: skip, total: state.answers.filter(function (a, i) { return a === state.qs[i].correct; }).length, of: state.qs.length };
  }

  function result() {
    var r = state.result, h = head();
    h += '<div class="card pl-res">' +
      '<div class="pl-big"><b>' + r.total + '</b> / ' + r.of + '</div>' +
      '<div class="pl-units">' +
        r.per.map(function (u) {
          return '<div class="pl-u' + (u.pass ? ' ok' : '') + '">' +
            '<span class="pl-ub">' + esc(u.name) + '</span>' +
            '<span class="pl-us">' + u.got + '/' + u.of + '</span>' +
            '<span class="pl-ut">' + esc(u.pass ? t('bilasiz', 'known') : t('o\'rganasiz', 'to learn')) + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
    if (r.skip.length) {
      h += '<div class="callout tip"><span class="co-ic">' + IC.check + '</span><div>' +
        esc(t('Birinchi ' + r.skip.length + ' kunni o\'tkazib yuborish mumkin. Keyingi dars — ' + (r.skip.length + 1) + '-kun.',
              'You can skip the first ' + r.skip.length + ' days. Your next lesson would be day ' + (r.skip.length + 1) + '.')) +
        '</div></div>' +
        '<div class="callout"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t(
          'Bu kunlar "bajarilgan" deb belgilanmaydi: progress foizi va sertifikat o\'zgarmaydi. Istasangiz ularni baribir o\'qishingiz mumkin.',
          'These days are not marked as completed: your progress percentage and certificate do not change. You can still read them if you want.')) + '</div></div>';
    } else {
      h += '<div class="callout warn"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t(
        '1-hafta ' + PASS + ' ball to\'plamadi, shuning uchun o\'tkazib yuborish yo\'q — kurs 1-kundan boshlanadi. Bu yomon natija emas: asoslarni mustahkamlash keyinroq tezlik beradi.',
        'Week 1 did not reach ' + PASS + ' correct, so nothing is skipped — the course starts at day 1. That is not a bad outcome: a solid base pays off later.')) + '</div></div>';
    }
    h += '<div class="row-btns">' +
      (r.skip.length ? '<button class="btn primary" id="plApply">' + esc(t('Shu kunlarni o\'tkazib yuborish', 'Skip those days')) + '</button>' : '') +
      '<button class="btn" id="plAgain">' + esc(t('Qayta topshirish', 'Retake')) + '</button>' +
      '<button class="btn" id="plClose">' + esc(t('Yopish', 'Close')) + '</button>' +
      '<button class="btn" data-go="python">' + esc(t('Kursga o\'tish', 'Go to the course')) + '</button>' +
      '</div></div>';
    return h;
  }

  window.PagePlacement = function () {
    if (!window.COURSE || !COURSE.length) return '<div class="card">' + esc(t('Kurs topilmadi', 'Course not found')) + '</div>';
    if (!state) return intro();
    return state.result ? result() : quiz();
  };

  window.PagePlacement.mount = function () {
    var st = $('#plStart');
    if (st) st.addEventListener('click', function () {
      state = { qs: build(), answers: [], result: null };
      App.render();
    });
    var un = $('#plUndo');
    if (un) un.addEventListener('click', function () {
      App.confirm({ text: t('O\'tkazib yuborish bekor qilinsinmi? Kurs yana 1-kundan ochiladi.',
                            'Undo the skip? The course opens from day 1 again.') }, function () {
        Placement.clear(); state = null; App.render();
        toast(t('Bekor qilindi', 'Undone'), 'ok');
      });
    });

    var cnt = $('#plCount');
    function refresh() {
      if (!cnt) return;
      var n = state.answers.filter(function (a) { return a !== undefined && a !== null; }).length;
      cnt.textContent = t('Javob berildi: ', 'Answered: ') + n + ' / ' + state.qs.length;
    }
    $$('.pl-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var qi = Number(b.dataset.q), oi = Number(b.dataset.o);
        state.answers[qi] = oi;
        $$('.pl-opt[data-q="' + qi + '"]').forEach(function (x) { x.classList.toggle('on', x === b); });
        refresh();
      });
    });
    if (state && !state.result) refresh();

    var sub = $('#plSubmit');
    if (sub) sub.addEventListener('click', function () {
      var missing = state.qs.length - state.answers.filter(function (a) { return a !== undefined && a !== null; }).length;
      var go = function () { state.result = score(); App.render(); };
      if (missing) {
        App.confirm({ text: t(missing + ' ta savol javobsiz — ular noto\'g\'ri hisoblanadi. Davom etasizmi?',
                              missing + ' question(s) unanswered — they count as wrong. Continue?') }, go);
      } else go();
    });
    var can = $('#plCancel');
    if (can) can.addEventListener('click', function () { state = null; App.render(); });

    var ap = $('#plApply');
    if (ap) ap.addEventListener('click', function () {
      var r = state.result;
      Placement.save({
        on: new Date().toISOString().slice(0, 10), applied: true, skip: r.skip,
        total: r.total, of: r.of,
        per: r.per.map(function (u) { return { name: u.name, got: u.got, of: u.of, pass: u.pass }; })
      });
      state = null;
      toast(t(r.skip.length + ' kun o\'tkazib yuborildi', r.skip.length + ' days skipped'), 'ok');
      App.go('python');
    });
    var cl = $('#plClose');
    if (cl) cl.addEventListener('click', function () { state = null; App.render(); });
    var ag = $('#plAgain');
    if (ag) ag.addEventListener('click', function () { state = { qs: build(), answers: [], result: null }; App.render(); });
  };
})();
