/* ==========================================================================
   Kunlik intizom sahifasi
   --------------------------------------------------------------------------
   #/habit          — bugungi kun + 164 kunlik zanjir
   #/habit/2026-09-10 — aniq bir kun

   Sahifaning maqsadi bitta savolga javob berish: "HOZIR nima qilishim kerak?"
   Shuning uchun eng tepada namoz vaqtlari va joriy blok turadi, kalendar esa
   pastda.

   Har blok belgilanadi. "core" bloklar kunni yopadi; namoz bloklari alohida
   sanaladi — ular o'quv rejasining sharti emas, lekin intizomning bir qismi.
   ========================================================================== */
(function () {
  'use strict';

  function nowDec() {
    var d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  }
  function isToday(key) { return key === Store.dateKey(); }

  var DOW = {
    uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };
  function dowName(n) { return DOW[Store.get('lang') === 'en' ? 'en' : 'uz'][n]; }

  /* ====================== NAMOZ TASMASI =============================== */

  function prayerStrip(plan, live) {
    var cur = live ? Prayer.current(plan.prayer, nowDec()) : { prev: null, next: null };
    var h = '<div class="pray-strip">';
    Prayer.ORDER.forEach(function (name) {
      var p = plan.prayer[name];
      if (!p) return;
      var isNext = live && cur.next === name;
      var isNow = live && cur.prev === name;
      h += '<div class="ps-cell' + (isNext ? ' next' : '') + (isNow ? ' now' : '') + (name === 'sunrise' ? ' sun' : '') + '">' +
        '<span class="ps-n">' + esc(L(Prayer.NAMES[name])) + (p.manual ? ' <i class="ps-fix" title="' + esc(tr('setFixed')) + '">•</i>' : '') + '</span>' +
        '<span class="ps-t">' + esc(p.str) + '</span>' +
        (isNext ? '<span class="ps-tag">' + esc(tr('habNext')) + '</span>' : '') +
        '</div>';
    });
    return h + '</div>';
  }

  /* ====================== BLOK QATORI ================================= */

  function blockRow(plan, b, live) {
    var on = Store.habitBlock(plan.key, b.id);
    var kind = HABIT.kinds[b.kind] || { icon: 'spark' };
    var active = live && nowDec() >= b.from && nowDec() < b.to;

    var h = '<div class="hb-row' + (on ? ' done' : '') + (active ? ' active' : '') +
      (b.inside ? ' inside' : '') + ' k-' + b.kind + '">' +
      '<button class="hb-check" data-habit="' + esc(plan.key) + '|' + esc(b.id) + '" ' +
        'role="checkbox" aria-checked="' + on + '" aria-label="' + esc(L(b.t)) + '">' +
        (on ? IC.check : '') + '</button>' +
      '<div class="hb-time"><b>' + esc(b.fromStr) + '</b><span>' + esc(b.toStr) + '</span></div>' +
      '<div class="hb-body">' +
        '<div class="hb-t"><span class="hb-ic">' + (IC[kind.icon] || IC.spark) + '</span>' +
          esc(L(b.t)) +
          (b.inside ? ' <span class="hb-opt warn">' + esc(tr(b.insideFixed ? 'habInClass' : 'habDuring')) + '</span>' : '') +
          (b.core ? '' : ' <span class="hb-opt">' + esc(tr('habExtra')) + '</span>') +
        '</div>' +
        (b.book ? '<div class="hb-book">' + IC.book + esc(b.book) + '</div>' : '') +
        (b.note ? '<div class="hb-note">' + esc(L(b.note)) + '</div>'
          : b.inside ? '<div class="hb-note">' + esc(tr('habInsideOf', { b: L(b.insideOf) })) + '</div>' : '') +
      '</div>' +
      '<div class="hb-right">' +
        '<span class="hb-min">' + b.min + ' ' + esc(tr('engMin')) + '</span>' +
        (b.link ? '<button class="hb-go" data-go="' + esc(b.link) + '">' + IC.arrowR + '</button>' : '') +
      '</div></div>';
    return h;
  }

  /* ====================== BUGUNGI SPEAKING SAVOLI ===================== */

  function speakCard(plan) {
    if (!plan.speakDay) return '';
    var d = SPEAK30.days[plan.speakDay - 1];
    if (!d) return '';
    var wk = SPEAK30.weeks[d.w];
    var saved = Store.speakNote(d.n);

    var day = (SPEAK30.daily && SPEAK30.daily[d.n]) || null;

    var h = '<div class="card speak-card" id="speak-today">' +
      '<div class="sc-head"><span class="sc-ic">' + IC.mic + '</span>' +
        '<div><h3>' + esc(tr('habSpeakT', { n: d.n })) + '</h3>' +
        '<span>' + esc(d.part) + ' · ' + esc(d.min) + ' · ' + esc(L(wk.title)) + '</span></div>' +
        '<button class="sc-tag" data-go="eng-skill/speaking">' + esc(tr('habSpeakTrack')) + IC.arrowR + '</button></div>' +
      '<div class="sc-goal">' + esc(L(wk.goal)) + '</div>';

    /* Bugungi texnika — kunning yagona diqqat nuqtasi */
    if (day && day.tech) {
      h += '<div class="sc-tech"><span class="sc-tech-l">' + IC.target + esc(tr('habTechToday')) + '</span>' +
        '<div>' + esc(L(day.tech)) + '</div></div>';
    }

    /* Isitish mashqi — savoldan oldin */
    if (day && day.drill) {
      h += '<div class="sc-drill"><span class="gc-l">' + esc(tr('habDrill')) + '</span>' + esc(L(day.drill)) + '</div>';
    }

    h += '<div class="sc-q">' + esc(L(d.q)) + '</div>' +
      (d.p3 ? '<div class="sc-p3"><b>' + esc(tr('habThenP3')) + '</b> ' + esc(L(d.p3)) + '</div>' : '');
    h += speakQuestions(d.n);

    /* Bugungi savolga mos tayyor iboralar */
    if (day && day.chunks) {
      h += '<div class="sc-chunks"><div class="gc-l">' + esc(tr('habChunks')) + '</div>';
      day.chunks.forEach(function (c) {
        h += '<div class="sc-chunk"><b>' + esc(c.en) + '</b><i>' + esc(c.uz) + '</i></div>';
      });
      h += '</div>';
    }

    /* Bugun diqqat qilinadigan 2 filler + 3 bog'lovchi (hammasi emas) */
    var fIdx = day && day.f ? day.f : SPEAK30.fillers.map(function (_, i) { return i; });
    var tIdx = day && day.t ? day.t : SPEAK30.transitions.map(function (_, i) { return i; });
    h += '<div class="sc-chips"><div class="gc-l">' + esc(tr('habFillersToday')) + '</div>';
    fIdx.forEach(function (i) { var f = SPEAK30.fillers[i]; if (f) h += '<span class="sc-chip"><b>' + esc(f.en) + '</b><i>' + esc(f.uz) + '</i></span>'; });
    h += '</div><div class="sc-chips"><div class="gc-l">' + esc(tr('habTransitionsToday')) + '</div>';
    tIdx.forEach(function (i) { var t = SPEAK30.transitions[i]; if (t) h += '<span class="sc-chip t"><b>' + esc(t.en) + '</b><i>' + esc(t.uz) + '</i></span>'; });
    h += '</div>';

    /* Usul har kuni bir xil — shuning uchun yig'iq turadi */
    h += '<details class="sc-method"><summary class="gc-l">' + esc(tr('habMethod')) + '</summary><ol>';
    SPEAK30.method.forEach(function (m) { h += '<li>' + esc(L(m)) + '</li>'; });
    h += '</ol></details>';

    h += '<div class="field" style="margin-top:16px">' +
      '<label for="speakBox">' + esc(tr('habSecondTake')) + '</label>' +
      '<textarea class="textarea" id="speakBox" data-speak="' + d.n + '" ' +
        'placeholder="' + esc(tr('habSecondTakePh')) + '">' + esc(saved ? saved.text : '') + '</textarea>' +
      '<div class="hint" id="speakStatus">' + (saved ? esc(tr('saved') + ' · ' + fmtDate(saved.at)) : '') + '</div></div>';

    /* O'z-o'zini baholash — halol checklist (brauzer talaffuzni baholamaydi) */
    h += '<div class="spk-ck"><div class="gc-l">' + esc(tr('spkCheckT')) + '</div>';
    for (var ci = 1; ci <= 5; ci++) {
      var on = Store.flag('spk-ck:' + d.n + ':' + ci);
      h += '<label class="ck-row' + (on ? ' on' : '') + '"><input type="checkbox" data-spkck="' + d.n + ':' + ci + '"' + (on ? ' checked' : '') + '><span>' + esc(tr('spkCk' + ci)) + '</span></label>';
    }
    h += '</div>';

    return h + '</div>';
  }

  /* Kunning savollari: 3 ta mavzuga tegishli + 2 ta tasodifiy (SPEAK30.qs/pool).
     Har biriga 40–60 soniya, to'xtamasdan. Umumiy funksiya — speaking sahifasi ham ishlatadi. */
  window.speakQuestions = function (n) {
    var S = window.SPEAK30; if (!S || !S.qs) return '';
    var topic = S.qs[n] || [], rnd = S.randomFor ? S.randomFor(n) : [];
    var h = '<div class="sc-qs"><div class="gc-l">' + esc(tr('habQsT')) + '</div><p class="sc-qs-note">' + esc(tr('habQsS')) + '</p><ol>';
    topic.forEach(function (q) { h += '<li><span class="sq-tag">' + esc(tr('habQsTopic')) + '</span>' + esc(q) + '</li>'; });
    rnd.forEach(function (q) { h += '<li><span class="sq-tag rnd">' + esc(tr('habQsRandom')) + '</span>' + esc(q) + '</li>'; });
    return h + '</ol></div>';
  };

  /* ====================== BIR KUN SAHIFASI =========================== */

  function dayView(key, live) {
    var plan = HabitPlan.forDate(key);
    var done = HabitPlan.doneCount(plan);
    var pr = HabitPlan.prayerDone(plan);
    var dayDone = HabitPlan.isDayDone(plan);
    var d = new Date(key.split('-')[0], Number(key.split('-')[1]) - 1, key.split('-')[2]);

    var h = '';

    /* --- sarlavha --- */
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(HabitPlan.index(key) + ' / ' + HabitPlan.total()) + ' · ' + esc(dowName(d.getDay())) + '</div>' +
      '<h1>' + esc(fmtDateKey(key)) + '</h1>' +
      '<div class="lesson-meta">' +
        '<span class="chip ' + (plan.type === 'rest' ? 'review' : plan.type === 'class' ? 'lc' : 'topic') + '">' +
          esc(L(plan.tpl.name)) + '</span>' +
        '<span>' + esc(L(plan.tpl.sub)) + '</span>' +
        '<span>·</span><span>' + esc(tr('habWake')) + ' ' + esc(HABIT.meta.dayStart) +
          ' · ' + esc(tr('habBed')) + ' ' + esc(HABIT.meta.dayEnd) + '</span>' +
        '<span class="chip">' + esc(L(plan.tpl.load)) + '</span>' +
        (isToday(key) ? '<span class="chip done">' + esc(tr('habToday')) + '</span>' : '') +
        (dayDone ? '<span class="chip done">✓</span>' : '') +
      '</div></header>';

    /* --- namoz tasmasi --- */
    h += '<div class="pray-wrap"><div class="pray-head">' +
      '<span>' + IC.mosque + esc(tr('habPrayerTimes')) + ' · ' + esc(plan.prayer.city) + '</span>' +
      '<span class="pray-count">' + pr.done + '/' + pr.total + '</span></div>' +
      prayerStrip(plan, live) + '</div>';

    /* --- ogohlantirishlar --- */
    plan.warnings.forEach(function (w) {
      h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(L(w.text)) + '</div></div>';
    });

    if (plan.type === 'rest') {
      h += '<div class="callout tip"><span class="co-ic">' + IC.flame + '</span><div>' + esc(L(HABIT.meta.restNote)) + '</div></div>';
    }

    /* Uyqu — jadvalning asosi, shuning uchun alohida ta'kidlanadi */
    h += '<div class="callout good"><span class="co-ic">' + IC.moon + '</span>' +
      '<div><h4>' + esc(tr('habSleepT', { h: HABIT.meta.sleepHours })) + '</h4>' +
      esc(L(HABIT.meta.sleepNote)) + '</div></div>';

    /* --- progress --- */
    h += '<div class="hb-progress">' +
      '<div class="hp-l">' + esc(tr('habCoreBlocks')) + '</div>' +
      '<div class="bar"><i style="width:' + (plan.coreCount ? done / plan.coreCount * 100 : 0) + '%"></i></div>' +
      '<div class="hp-n">' + done + ' / ' + plan.coreCount + '</div>' +
      '<button class="btn btn-ghost btn-sm" data-habitall="' + esc(key) + '|' + (dayDone ? '0' : '1') + '">' +
        esc(dayDone ? tr('habUncheckAll') : tr('habCheckAll')) + '</button>' +
      '</div>';

    /* --- soat me'yori: talab vs bajarilgan (bloklar + qo'lda qo'shilgan) --- */
    if (window.Goal) {
      var req = Goal.required(key), dm = Goal.doneMinutes(key), man = Store.hoursOf(key);
      h += '<div class="hb-hours">' + hourMeter('eng', IC.globe, tr('goalEngToday'), dm.eng, req.eng, man.eng, key) +
        hourMeter('code', IC.code, tr('goalCodeToday'), dm.code, req.code, man.code, key) + '</div>';
    }

    /* --- bugungi ish nima: kurslarga havola --- */
    h += '<div class="hb-links">';
    if (plan.engDay) {
      var ed = window.Eng && Eng.dayOf(plan.engDay);
      h += '<button class="hb-link eng" data-go="english/' + plan.engDay + '">' + IC.globe +
        '<span><b>' + esc(tr('english')) + ' · ' + esc(tr('day')) + ' ' + plan.engDay + '</b>' +
        '<span>' + esc(ed ? L(ed.title) : tr('engSoon')) + '</span></span>' + IC.arrowR + '</button>';
    }
    if (plan.pyDay) {
      var pd = dayOf(plan.pyDay);
      h += '<button class="hb-link py" data-go="lesson/' + plan.pyDay + '">' + IC.code +
        '<span><b>Python · ' + esc(tr('day')) + ' ' + plan.pyDay + '</b>' +
        '<span>' + esc(pd ? L(pd.title) : '') + '</span></span>' + IC.arrowR + '</button>';
    }
    h += '</div>';

    /* --- jadval --- */
    h += '<div class="hb-list">';
    plan.blocks.forEach(function (b) { h += blockRow(plan, b, live); });
    h += '</div>';

    /* --- Speaking 30 --- */
    h += speakCard(plan);

    /* --- navigatsiya --- */
    var prev = Store.shiftDays(key, -1), next = Store.shiftDays(key, 1);
    h += '<div class="lesson-nav no-print">';
    h += HabitPlan.inRange(prev)
      ? '<button class="btn btn-ghost" data-go="habit/' + prev + '">' + IC.arrowL + esc(fmtDateKey(prev)) + '</button>'
      : '<span></span>';
    h += HabitPlan.inRange(next)
      ? '<button class="btn btn-ghost" data-go="habit/' + next + '">' + esc(fmtDateKey(next)) + IC.arrowR + '</button>'
      : '<span></span>';
    h += '</div>';

    return h;
  }

  /* Soat o'lchagichi: talab (daqiqa) vs bajarilgan; +15/+30/+60 qo'lda qo'shish
     (jadvaldan tashqari ish uchun — masalan, qo'shimcha yozuv yoki LeetCode) */
  function hourMeter(kind, ic, label, done, req, manual, key) {
    var pct = req ? Math.min(100, Math.round(done / req * 100)) : 100;
    var ok = done >= req;
    var fmt = function (m) { return (m / 60).toFixed(m % 60 ? 1 : 0) + ' ' + tr('hoursShort'); };
    return '<div class="hh ' + kind + (ok ? ' ok' : '') + '">' +
      '<div class="hh-top"><span class="hh-l">' + ic + esc(label) + '</span>' +
        '<span class="hh-v">' + esc(fmt(done)) + ' <small>/ ' + esc(fmt(req)) + '</small></span></div>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="hh-add"><span class="hint">' + esc(tr('habManual')) + (manual ? ' · +' + manual + ' ' + tr('engMin') : '') + '</span>' +
        [15, 30, 60].map(function (m) { return '<button class="chip-btn" data-addmin="' + esc(key) + '|' + kind + '|' + m + '">+' + m + '</button>'; }).join('') +
        (manual ? '<button class="chip-btn" data-addmin="' + esc(key) + '|' + kind + '|reset">×</button>' : '') +
      '</div></div>';
  }

  /* ====================== ASOSIY SAHIFA =============================== */

  window.PageHabit = function (dateKey) {
    var today = Store.dateKey();
    var key = dateKey || (HabitPlan.inRange(today) ? today : HABIT.meta.from);
    if (!HabitPlan.inRange(key)) key = HABIT.meta.from;

    var st = HabitPlan.stats();
    var h = '<div class="page stagger">';

    /* Faqat #/habit (sanasiz) da umumiy manzara ko'rsatiladi */
    if (!dateKey) {
      h += '<header class="page-head">' +
        '<div class="eyebrow">' + esc(tr('habKick')) + '</div>' +
        '<h1>' + esc(L(HABIT.meta.title)) + '</h1>' +
        '<p class="lede">' + esc(L(HABIT.meta.lede)) + '</p></header>';

      h += '<div class="stat-grid" style="margin-bottom:20px">' +
        '<div class="stat-tile accent"><div class="st-l">' + IC.flame + esc(tr('habStreak')) + '</div>' +
          '<div class="st-v">' + st.streak + '<small> ' + esc(tr('days')) + '</small></div>' +
          '<div class="st-note">' + esc(st.streak ? tr('habStreakOn') : tr('habStreakOff')) + '</div></div>' +
        '<div class="stat-tile"><div class="st-l">' + IC.check + esc(tr('habDone')) + '</div>' +
          '<div class="st-v">' + st.done + '<small> / ' + st.total + '</small></div>' +
          '<div class="bar" style="margin-top:9px"><i style="width:' + (st.done / st.total * 100) + '%"></i></div></div>' +
        '<div class="stat-tile ' + (st.prayers ? 'gold' : '') + '"><div class="st-l">' + IC.mosque + esc(tr('habPrayers')) + '</div>' +
          '<div class="st-v">' + st.prayers + '</div>' +
          '<div class="st-note">' + esc(tr('habPrayersNote')) + '</div></div>' +
        '<div class="stat-tile"><div class="st-l">' + IC.mic + esc(tr('habSpeak30')) + '</div>' +
          '<div class="st-v">' + Store.speakDoneCount() + '<small> / 30</small></div>' +
          '<div class="st-note">' + esc(tr('habSpeak30Note')) + '</div></div>' +
        weekMonthTiles() +
        '</div>';

      h += '<div class="callout tip"><span class="co-ic">' + IC.mosque + '</span>' +
        '<div><h4>' + esc(tr('habPrayerTimes')) + '</h4>' + esc(L(HABIT.meta.note)) +
        '<div style="margin-top:10px"><button class="btn btn-ghost btn-sm" data-go="settings">' +
          esc(tr('habPrayerSettings')) + '</button></div></div></div>';
    }

    /* Kun ko'rinishi */
    h += dayView(key, isToday(key));

    /* Kalendar — faqat umumiy sahifada */
    if (!dateKey) h += calendar();

    return h + '</div>';
  };

  /* Hafta / oy izchilligi: rejadagi o'tgan kunlardan nechtasi to'liq yopilgan */
  function weekMonthTiles() {
    var today = Store.dateKey();
    var d = new Date(today + 'T00:00:00');
    var mon = Store.shiftDays(today, -((d.getDay() + 6) % 7));
    var m1 = today.slice(0, 8) + '01';
    var count = function (from) { var n = 0, t = 0, k = from; while (k <= today) { if (HabitPlan.inRange(k)) { t++; if (HabitPlan.isDayDone(HabitPlan.forDate(k))) n++; } k = Store.shiftDays(k, 1); } return { n: n, t: t }; };
    var w = count(mon), m = count(m1);
    return '<div class="stat-tile ' + (w.t && w.n === w.t ? 'gold' : '') + '"><div class="st-l">' + IC.calendar + esc(tr('habWeekT')) + '</div>' +
        '<div class="st-v">' + w.n + '<small> / ' + w.t + '</small></div><div class="bar" style="margin-top:9px"><i style="width:' + (w.t ? w.n / w.t * 100 : 0) + '%"></i></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.trend + esc(tr('habMonthT')) + '</div>' +
        '<div class="st-v">' + m.n + '<small> / ' + m.t + '</small></div><div class="bar" style="margin-top:9px"><i style="width:' + (m.t ? m.n / m.t * 100 : 0) + '%"></i></div></div>';
  }

  /* 164 kunlik zanjir — oylar bo'yicha */
  function calendar() {
    var total = HabitPlan.total();
    var months = [];
    var cur = null;
    for (var i = 1; i <= total; i++) {
      var key = HabitPlan.keyOf(i);
      var d = new Date(key.split('-')[0], Number(key.split('-')[1]) - 1, key.split('-')[2]);
      var mk = key.slice(0, 7);
      if (!cur || cur.mk !== mk) { cur = { mk: mk, date: d, days: [] }; months.push(cur); }
      cur.days.push({ i: i, key: key, d: d });
    }

    var h = '<div class="section-head"><div class="sh-n">' + IC.calendar + '</div><div>' +
      '<h2>' + esc(tr('habChain')) + '</h2>' +
      '<div class="sh-sub">' + esc(fmtDateKey(HABIT.meta.from) + ' – ' + fmtDateKey(HABIT.meta.to) + ' · ' + total + ' ' + tr('days')) + '</div>' +
      '</div></div>';

    var today = Store.dateKey();
    h += '<div class="hab-cal">';
    months.forEach(function (m) {
      h += '<div class="hc-month"><div class="hc-m-name">' +
        esc(fmtDateKey(m.days[0].key).replace(/^\d+-/, '').replace(/\s\d{4}$/, '')) + '</div><div class="hc-grid">';
      // Oyning birinchi kuni haftaning qaysi kuniga to'g'ri kelishi (Du = 0)
      var lead = (m.days[0].d.getDay() + 6) % 7;
      for (var k = 0; k < lead; k++) h += '<span class="hc-pad"></span>';
      m.days.forEach(function (x) {
        var done = HabitPlan.isDayDone(HabitPlan.forDate(x.key));
        var any = Store.habitDayCount(x.key) > 0;
        var type = HabitPlan.typeOf(x.key);
        h += '<button class="hc-day' + (done ? ' done' : any ? ' part' : '') +
          (x.key === today ? ' today' : '') + ' t-' + type + '" data-go="habit/' + x.key + '" ' +
          'title="' + esc(fmtDateKey(x.key)) + '">' + x.d.getDate() + '</button>';
      });
      h += '</div></div>';
    });
    h += '</div>';

    h += '<div class="hc-legend">' +
      '<span><i class="lg done"></i>' + esc(tr('habLegDone')) + '</span>' +
      '<span><i class="lg part"></i>' + esc(tr('habLegPart')) + '</span>' +
      '<span><i class="lg t-rest"></i>' + esc(tr('habLegRest')) + '</span>' +
      '<span><i class="lg t-class"></i>' + esc(tr('habLegClass')) + '</span>' +
      '</div>';
    return h;
  }

  /* Sahifa qo'yilgandan keyin: Speaking javobini avtomatik saqlash */
  window.PageHabit.mount = function () {
    $$('[data-spkck]').forEach(function (cb) {
      cb.addEventListener('change', function () { Store.setFlag('spk-ck:' + cb.dataset.spkck, cb.checked); cb.closest('.ck-row').classList.toggle('on', cb.checked); });
    });
    var box = $('#speakBox');
    if (!box) return;
    var timer = null;
    box.addEventListener('input', function () {
      clearTimeout(timer);
      var st = $('#speakStatus');
      if (st) st.textContent = '…';
      timer = setTimeout(function () {
        Store.setSpeakNote(Number(box.dataset.speak), box.value);
        if (st) st.textContent = box.value.trim() ? tr('saved') : '';
      }, 600);
    });
  };
})();
