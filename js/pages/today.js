/* ==========================================================================
   Today (#/today) — bugun aniq nima qilish kerak
   --------------------------------------------------------------------------
   Deterministik reja. Manbalar, ustuvorlik tartibida (prio):
     0) MUDDATI O'TGAN muhim topshiriqlar (o'qituvchi/english, high yoki overdue)
     1) o'qituvchi bergan topshiriqlar (ochiq)
     1.5) nazorat sessiyasi (faol/pauza — hozirgi blok)
     2) majburiy takrorlar (toshbitik, SRS), ochiq xatolar
     3) zaif soha (Mastery < 60), retry
     4) bugungi dars (Python kuni, ingliz kuni) — jadvalning o'zi
     5) kitob rejasi (o'qish / tinglash / lug'at)
     6–7) speaking / writing / daftar — ixtiyoriy
   Ortiqcha yuk yo'q: 12 tadan ko'p band bo'lsa, past ustuvorlikdagilar
   "ixtiyoriy" bo'limiga yig'iladi. Topshiriqlar Ctrl (server) dan — mahalliy
   nusxada yo'q, soxtasi ham yo'q.
   Har band belgilanadi (Store.done "td:<sana>:<id>") va daqiqasi bilan
   o'quv vaqtiga qo'shiladi (Store.sessions) — jadval bloklariga tegmaydi.
   ========================================================================== */
(function () {
  'use strict';

  function items(key) {
    var out = [];
    var rec = Recommend.list();
    /* Toshbitik — qat'iy: bugungi toshlar birinchi (kechiksa darz) */
    /* Topshiriqlar (o'qituvchi / english / nazorat) — real server ma'lumoti */
    if (window.Ctrl && Ctrl.openAssignments) {
      Ctrl.openAssignments().forEach(function (a) {
        var urgent = a.st === 'overdue' || a.priority === 'high';
        out.push({ id: 'as:' + a.id, route: a.route || 'comm/assignments', ic: IC.checklist, t: tr('tdAssign', { t: a.title }), why: tr('role_' + a.by) + (a.due ? ' · ' + tr('asDue') + ' ' + EngCal.fmt(a.due) : '') + (a.st === 'overdue' ? ' · ' + tr('asSt_overdue') : ''), min: 30, prio: urgent ? 0 : 1, auto: false, assignment: a });
      });
      if (/^(active|paused)$/.test(Ctrl.state())) out.push({ id: 'sess', route: 'comm/sessions', ic: IC.eye, t: tr('tdSess'), why: tr('tdSessWhy'), min: 0, prio: 1.5 });
    }
    var et = window.Etch ? Etch.dueCount() : 0;
    if (et) out.push({ id: 'etch', route: 'etch', ic: IC.stone, t: tr('tdEtch', { n: et }), why: tr('tdEtchWhy'), min: Math.min(30, 2 * et), prio: 2 });
    rec.forEach(function (r) {
      if (r.kind === 'review') out.push({ id: 'review', route: 'review', ic: IC.refresh, t: r.title, why: r.why, min: r.min, prio: 2 });
      if (r.kind === 'mistakes') out.push({ id: 'mistakes', route: 'mistakes', ic: IC.alert, t: r.title, why: r.why, min: r.min, prio: 2 });
      if (r.kind === 'weak') out.push({ id: 'weak', route: r.route, ic: IC.target, t: r.title, why: r.why, min: r.min, prio: 3 });
      if (r.kind === 'retry') out.push({ id: 'retry', route: r.route, ic: IC.code, t: r.title, why: r.why, min: r.min, prio: 3 });
    });
    var pyDay = window.HabitPlan && HabitPlan.inRange(key) ? HabitPlan.pyDayOf(key) : 0;
    if (pyDay) {
      var pd = dayOf(pyDay);
      out.push({ id: 'py', route: 'lesson/' + pyDay, ic: IC.code, t: 'Python · ' + tr('day') + ' ' + pyDay + ' — ' + (pd ? L(pd.title) : ''), why: tr('tdPyWhy'), min: HabitPlan.typeOf(key) === 'class' ? 90 : 120, prio: 4, auto: Store.isDone(pyDay) });
      if (!Store.isDone(pyDay)) out.push({ id: 'pyq', route: 'lesson/' + pyDay, ic: IC.spark, t: tr('tdPyQuiz'), why: tr('tdPyQuizWhy'), min: 15, prio: 4 });
    }
    /* DataCamp: bugungi bob (yoki kechikkan birinchisi); yakshanba — katta coding testi */
    if (window.DataCamp && window.HabitPlan && HabitPlan.inRange(key)) {
      var dcIt = DataCamp.forDate(key) || (DataCamp.overdue()[0] || null);
      if (dcIt) out.push({ id: 'dc', route: 'datacamp/' + dcIt.n, ic: IC.layers, t: tr('tdDC', { n: dcIt.n, t: dcIt.title }), why: tr('tdDCWhy'), min: HabitPlan.typeOf(key) === 'class' ? 45 : 60, prio: 4, auto: DataCamp.isDone(dcIt) });
      if (HabitPlan.typeOf(key) === 'rest' && key > HABIT.meta.official) out.push({ id: 'codetest', route: 'practice/coding', ic: IC.target, t: tr('tdCodeTest'), why: tr('tdCodeTestWhy'), min: 45, prio: 4, auto: !!Store.readGet('codetest-' + key) });
      if (HabitPlan.workOn(key)) out.push({ id: 'work', route: 'habit', ic: IC.rocket, t: tr('tdWork', { m: HabitPlan.workCfg().min }), why: tr('tdWorkWhy'), min: HabitPlan.workCfg().min, prio: 6 });
    }
    var engDay = window.EngCal ? EngCal.dayOfKey(key) : 0;
    if (engDay) {
      var ed = Eng.dayOf(engDay);
      out.push({ id: 'eng', route: 'english/' + engDay, ic: IC.globe, t: tr('english') + ' · ' + tr('day') + ' ' + engDay + (ed ? ' — ' + L(ed.title) : ''), why: tr('tdEngWhy'), min: 90, prio: 4, auto: Store.engDayDone(engDay) });
    }
    if (window.Books) {
      var cd = Books.today();
      out.push({ id: 'vocab', route: 'books/vocab', ic: IC.book, t: tr('tdVocab') + ' — ' + Books.vocabTodayLabel(cd), why: tr('tdVocabWhy'), min: 45, prio: 5 });
      out.push({ id: 'read', route: 'books/reading', ic: IC.doc, t: tr('tdRead') + ' — ' + Books.readingLabel(cd), why: tr('tdReadWhy'), min: 45, prio: 5 });
      out.push({ id: 'listen', route: 'books/listen', ic: IC.headphones, t: tr('tdListen') + ' — ' + Books.listenLabel(cd), why: tr('tdListenWhy'), min: 50, prio: 5 });
    }
    var sd = window.HabitPlan ? HabitPlan.speakDayOf(key) : 0;
    if (sd) out.push({ id: 'speak', route: 'habit', ic: IC.mic, t: tr('tdSpeak', { n: sd }), why: tr('tdSpeakWhy'), min: 45, prio: 6, auto: !!Store.speakNote(sd) });
    else out.push({ id: 'speak', route: 'eng-skill/speaking', ic: IC.mic, t: tr('tdSpeakFree'), why: tr('tdSpeakWhy'), min: 30, prio: 6 });
    if (window.Writing && Writing.currentWeek && Writing.currentWeek() > 0) out.push({ id: 'write', route: 'writing', ic: IC.pen, t: tr('tdWrite', { n: Writing.currentWeek() }), why: tr('tdWriteWhy'), min: 40, prio: 6 });
    out.push({ id: 'copy', route: 'copy/english', ic: IC.notebook, t: tr('tdCopy'), why: tr('tdCopyWhy'), min: 10, prio: 7 });
    out.sort(function (a, b) { return a.prio - b.prio; });
    out.forEach(function (it) { it.done = it.auto || Store.flag('td:' + key + ':' + it.id) || (it.assignment && it.assignment.st === 'completed'); });
    /* Yuk chegarasi: 12 tadan ortiq bo'lsa, past ustuvorlikdagi ochiq bandlar ixtiyoriy */
    var open = 0; out.forEach(function (it) { if (!it.done) open++; });
    if (open > 12) { var n = 0; out.forEach(function (it) { if (it.done) return; n++; if (n > 12 && it.prio >= 5) it.optional = true; }); }
    return out;
  }
  /* Boshqa sahifalar (dashboard) uchun — bir xil ro'yxat, ikkinchi "Bugun" tizimi emas */
  window.TodayPlan = { items: items };

  window.PageToday = function () {
    var key = Store.dateKey();
    var list = items(key);
    var doneN = 0, total = 0, doneMin = 0;
    list.forEach(function (it) { total += it.min; if (it.done) { doneN++; doneMin += it.min; } });
    var type = window.HabitPlan && HabitPlan.inRange(key) ? HabitPlan.typeOf(key) : 'heavy';
    var debt = window.Goal ? Goal.debt().days : 0;

    var h = '<div class="page stagger">';
    h += skyHero(key, type);
    /* Kun duosi — ishlardan oldin (js/pages/dua.js). O'qilgach bir qatorga yig'iladi. */
    h += window.DuaGate ? DuaGate.render(key) : '';
    var gated = window.DuaGate && !DuaGate.isRead(key) && !DuaGate.skipped(key);
    if (gated) h += DuaGate.gateNote(key) + '<div class="td-gated">';

    /* §13 — JORIY SESSIYA / KEYINGI AMAL: sahifaning eng muhim javobi
       ("hozir nima qilay?"). Manba — jadval, ikkinchi reja emas.          */
    h += window.Focus ? Focus.nowCard(key) : '';

    h += '<div class="td-sum"><div class="td-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--brand)" stroke-width="5" stroke-linecap="round" stroke-dasharray="113" stroke-dashoffset="' + (113 - 113 * (list.length ? doneN / list.length : 0)) + '" transform="rotate(-90 22 22)"/></svg><b>' + doneN + '/' + list.length + '</b></div>' +
      '<div><div class="td-big">' + esc(fmtMin(total)) + ' <small>' + esc(tr('tdPlanned')) + '</small></div><div class="td-sub">' + esc(fmtMin(doneMin)) + ' ' + esc(tr('tdDone')) + ' · ' + esc(tr('tdReviewDue', { n: Review.dueCount() })) + (debt ? ' · <span class="red">' + esc(tr('goalDebtDays')) + ': ' + debt + '</span>' : '') + '</div></div>' +
      '<div class="td-actions"><button class="btn btn-ghost btn-sm" data-go="habit">' + IC.clock + esc(tr('habit')) + '</button><button class="btn btn-ghost btn-sm" data-go="review">' + IC.refresh + esc(tr('reviewPage')) + '</button></div></div>';

    /* §19 — bugungi yuk taqsimoti (og'ir / o'rta / yengil) */
    if (window.Focus && window.HabitPlan && HabitPlan.inRange(key)) {
      var dayLoad = HabitPlan.loadOf(HabitPlan.forDate(key));
      if (dayLoad.core) h += '<div class="td-load">' + Focus.loadBar(dayLoad) + '</div>';
    }

    /* Qarz — tiklanish rejasi (spiral emas): faqat kerak bo'lganda */
    if (window.Goal && Goal.recovery) {
      var rc = Goal.recovery();
      if (rc) h += '<div class="callout why td-recover"><span class="co-ic">' + IC.flame + '</span><div><h4>' + esc(rc.title) + '</h4><p>' + esc(rc.lede) + '</p><ol>' + rc.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div></div>';
    }
    var main = list.filter(function (it) { return !it.optional; }), opt = list.filter(function (it) { return it.optional; });
    h += '<ol class="td-list">';
    main.forEach(function (it, i) {
      h += '<li class="td-item' + (it.done ? ' done' : '') + ' p' + it.prio + '">' +
        '<button class="td-check" data-tdtoggle="' + esc(it.id) + '" data-min="' + it.min + '"' + (it.auto ? ' disabled title="' + esc(tr('tdAuto')) + '"' : '') + ' aria-checked="' + it.done + '" role="checkbox">' + (it.done ? IC.check : '') + '</button>' +
        '<span class="td-n">' + (i + 1) + '</span>' +
        '<button class="td-body" data-go="' + esc(it.route) + '"><span class="td-ic">' + it.ic + '</span><span class="td-t"><b>' + esc(it.t) + '</b><span>' + esc(it.why) + '</span></span></button>' +
        '<span class="td-min">' + it.min + ' ' + esc(tr('engMin')) + '</span></li>';
    });
    h += '</ol>';
    if (opt.length) {
      h += '<details class="td-opt"><summary>' + IC.spark + esc(tr('tdOptional', { n: opt.length })) + '</summary><ol class="td-list">' + opt.map(function (it, i) {
        return '<li class="td-item p' + it.prio + '"><button class="td-check" data-tdtoggle="' + esc(it.id) + '" data-min="' + it.min + '" aria-checked="' + it.done + '" role="checkbox">' + (it.done ? IC.check : '') + '</button><span class="td-n">' + (main.length + i + 1) + '</span>' +
          '<button class="td-body" data-go="' + esc(it.route) + '"><span class="td-ic">' + it.ic + '</span><span class="td-t"><b>' + esc(it.t) + '</b><span>' + esc(it.why) + '</span></span></button><span class="td-min">' + it.min + ' ' + esc(tr('engMin')) + '</span></li>';
      }).join('') + '</ol></details>';
    }

    /* Davom etish */
    var cont = Continue.list().slice(0, 4);
    if (cont.length) {
      h += '<div class="section-head"><div class="sh-n">' + IC.arrowR + '</div><div><h2>' + esc(tr('continueLabel')) + '</h2><div class="sh-sub">' + esc(tr('contS')) + '</div></div></div><div class="cont-row">';
      cont.forEach(function (c) { h += '<button class="cont-chip" data-go="' + esc(c.route) + '"><span class="cc-k">' + esc(tr('track_' + c.track)) + '</span><b>' + esc(c.title) + '</b><i>' + esc(fmtDate(c.at)) + '</i></button>'; });
      h += '</div>';
    }
    /* §18 haftalik yuk paneli · §52 kun yakuni (kun tugagandagina) */
    if (window.Focus) { h += Focus.endOfDay(key); h += Focus.weekPanel(key); }

    if (gated) h += '</div>';
    return h + '</div>';
  };

  function fmtMin(m) { var h = Math.floor(m / 60), r = m % 60; return (h ? h + ' ' + tr('hoursShort') + ' ' : '') + (r ? r + ' ' + tr('engMin') : (h ? '' : '0 ' + tr('engMin'))); }

  /* ====================== JONLI OSMON (sarlavha) ======================
     Bugungi REAL quyosh chiqishi/botishi — namoz hisobidan (HabitPlan.times:
     sunrise / maghrib, tanlangan shahar). Soat o'tgan sari osmon rangi
     tun → tong → kun → shom → tun bo'ylab silliq o'tadi, quyosh yoy bo'ylab
     yuradi (chiqish = chap ufq, botish = o'ng ufq), tunda oy va yulduzlar.
     Har 20 s da yangilanadi; sahifa almashsa taymer o'zi to'xtaydi.
     Soxta narsa yo'q: rang va joy faqat vaqt + shahar koordinatasidan.    */
  var SKY = {
    /* kalit nuqtalar: quyosh chiqish/botishga nisbatan soat (rel) → 3 rangli gradient (yuqori → ufq) + matn rangi qoramtir? */
    keys: function (rise, set) {
      return [
        { t: rise - 2.2, c: ['#070b1d', '#111a3a', '#1c2a52'], dark: false },   // chuqur tun
        { t: rise - 0.9, c: ['#141b3f', '#3b3f74', '#a3607a'], dark: false },   // tong oldi
        { t: rise - 0.2, c: ['#2f4a86', '#d98a6a', '#ffcf94'], dark: false },   // shafaq
        { t: rise + 0.6, c: ['#4d8fd6', '#9cc4ec', '#ffe2b0'], dark: true  },   // quyosh chiqdi
        { t: (rise + set) / 2, c: ['#3f8be0', '#8ec5f2', '#d6ecff'], dark: true }, // peshin
        { t: set - 0.9, c: ['#4f7fc4', '#e9a86a', '#ffd79a'], dark: true  },   // oltin soat
        { t: set - 0.1, c: ['#3a3d7a', '#c86b6e', '#f4a266'], dark: false },   // botish
        { t: set + 0.7, c: ['#171c44', '#3a3566', '#6b4a6e'], dark: false },   // g'ira-shira
        { t: set + 1.8, c: ['#070b1d', '#111a3a', '#1c2a52'], dark: false }    // tun
      ];
    },
    hex: function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; },
    mix: function (a, b, k) { var A = SKY.hex(a), B = SKY.hex(b); return 'rgb(' + A.map(function (x, i) { return Math.round(x + (B[i] - x) * k); }).join(',') + ')'; },
    /* now (soat, o'nlik) → { colors[3], dark, sunT (0..1 kun yoyi | null), moonT, night (0..1) } */
    state: function (now, rise, set) {
      var K = SKY.keys(rise, set), t = now;
      if (t < K[0].t) t += 24;                       // yarim tundan keyin — kechagi "tun" davomi
      if (t > K[K.length - 1].t + 24) t -= 24;
      var i = 0; while (i < K.length - 1 && t > K[i + 1].t) i++;
      var a = K[i], b = K[Math.min(i + 1, K.length - 1)];
      var k = b.t === a.t ? 0 : Math.max(0, Math.min(1, (t - a.t) / (b.t - a.t)));
      /* tundan keyingi tong: oxirgi kalit (set+1.8) → ertangi rise-2.2 oralig'i — tun rangida qoladi */
      var colors = a.c.map(function (c, j) { return SKY.mix(c, b.c[j], k); });
      var dark = k < 0.5 ? a.dark : b.dark;
      var sunT = (now >= rise && now <= set) ? (now - rise) / (set - rise) : null;
      var moonT = null, nightLen = 24 - (set - rise);
      if (now > set) moonT = (now - set) / nightLen; else if (now < rise) moonT = (now + 24 - set) / nightLen;
      /* tun darajasi: yulduz/oy uchun (botishdan 1.2 s keyin to'liq, chiqishdan 1.2 s oldin so'na boshlaydi) */
      var night = 0;
      if (now > set) night = Math.min(1, (now - set) / 1.2); else if (now < rise) night = Math.min(1, (rise - now) / 1.2);
      return { colors: colors, dark: dark, sunT: sunT, moonT: moonT, night: night };
    },
    times: function (key) {
      try {
        var t = HabitPlan.times(key);
        if (t && t.sunrise && t.maghrib) return { rise: t.sunrise.dec, set: t.maghrib.dec, riseS: t.sunrise.str, setS: t.maghrib.str };
      } catch (e) {}
      return { rise: 6.5, set: 18.5, riseS: '06:30', setS: '18:30' };
    },
    /* sahifa ochilgan kun uchun bir xil yulduz xaritasi (seed = sana) */
    stars: function (key, n) {
      var s = 0; for (var i = 0; i < key.length; i++) s = (s * 31 + key.charCodeAt(i)) >>> 0;
      var rnd = function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      var out = [];
      for (var j = 0; j < n; j++) out.push({ x: rnd() * 100, y: rnd() * 62, r: 0.6 + rnd() * 1.4, d: rnd() * 4 });
      return out;
    },
    hm: function (dec) { var h = Math.floor(dec), m = Math.round((dec - h) * 60); if (m === 60) { h++; m = 0; } return String(h % 24).padStart(2, '0') + ':' + String(m).padStart(2, '0'); },
    dur: function (hours) { var m = Math.round(hours * 60), h = Math.floor(m / 60); return (h ? h + ' ' + tr('hoursShort') + ' ' : '') + (m % 60) + ' ' + tr('engMin'); }
  };

  function skyHero(appKey, type) {
    var key = cityNow().key;   // osmon, hijriy sana va vaqtlar — shahar sanasi bo'yicha (PC mintaqasi emas)
    var T = SKY.times(key);
    var h = '<header class="page-head td-sky" id="tdSky" data-rise="' + T.rise + '" data-set="' + T.set + '">' +
      '<div class="sky-bg" id="skyBg"></div>' +
      '<div class="sky-stars" id="skyStars">' + SKY.stars(key, 46).map(function (s) {
        return '<i style="left:' + s.x.toFixed(1) + '%;top:' + s.y.toFixed(1) + '%;width:' + s.r.toFixed(1) + 'px;height:' + s.r.toFixed(1) + 'px;animation-delay:-' + s.d.toFixed(1) + 's"></i>';
      }).join('') + '</div>' +
      '<div class="sky-cloud c1"></div><div class="sky-cloud c2"></div>' +
      '<div class="sky-sun" id="skySun"></div>' +
      '<div class="sky-moon" id="skyMoon"></div>' +
      /* Islomiy geometrik naqsh (8 qirrali yulduz) — juda yengil, osmon ustida */
      '<svg class="sky-pattern" aria-hidden="true"><defs><pattern id="skyGirih" width="56" height="56" patternUnits="userSpaceOnUse">' +
        '<path d="M28 4l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<path d="M28 12l3.6 12.4L44 28l-12.4 3.6L28 44l-3.6-12.4L12 28l12.4-3.6z" fill="none" stroke="currentColor" stroke-width=".7" opacity=".6"/>' +
        '<circle cx="0" cy="0" r="1.6" fill="currentColor"/><circle cx="56" cy="0" r="1.6" fill="currentColor"/><circle cx="0" cy="56" r="1.6" fill="currentColor"/><circle cx="56" cy="56" r="1.6" fill="currentColor"/>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#skyGirih)"/></svg>' +
      skyMosque() +
      '<div class="sky-in">' +
        '<div class="eyebrow">' + esc(fmtDateKey(key)) + ' · ' + esc(tr('habType_' + type)) + (hijri(key) ? ' <span class="sky-hijri">· ' + esc(hijri(key)) + '</span>' : '') + '</div>' +
        '<h1>' + esc(tr('todayPage')) + '</h1><p class="lede">' + esc(tr('todayLede')) + '</p>' +
        '<div class="sky-meta">' +
          '<span class="sky-clock" id="skyClock">--:--</span>' +
          '<span class="sky-chip">' + IC.sunrise + esc(T.riseS) + '</span>' +
          '<span class="sky-chip">' + IC.moon + esc(T.setS) + '</span>' +
          '<span class="sky-chip sky-next" id="skyNext"></span>' +
          '<span class="sky-chip sky-prayer" id="skyPrayer" data-go="habit" role="button" tabindex="0"></span>' +
          '<span class="sky-chip sky-tz" id="skyTz" hidden></span>' +
        '</div>' +
      '</div></header>';
    return h;
  }

  /* Masjid silueti — ikki qatlam (uzoq: xira, yaqin: to'q). viewBox 1200×160, pastdan tekislanadi. */
  function skyMosque() {
    var minaret = function (x, top, w) {   // ingichka minora: tana + 2 balkon + gumbazcha + hilol
      return '<rect x="' + (x - w / 2) + '" y="' + top + '" width="' + w + '" height="' + (160 - top) + '"/>' +
        '<rect x="' + (x - w) + '" y="' + (top + 26) + '" width="' + (w * 2) + '" height="4" rx="1"/>' +
        '<rect x="' + (x - w) + '" y="' + (top + 62) + '" width="' + (w * 2) + '" height="4" rx="1"/>' +
        '<path d="M' + (x - w * 1.1) + ' ' + top + ' Q' + x + ' ' + (top - w * 2.6) + ' ' + (x + w * 1.1) + ' ' + top + 'z"/>' +
        '<rect x="' + (x - 0.8) + '" y="' + (top - w * 2.6 - 7) + '" width="1.6" height="8"/>';
    };
    var dome = function (cx, base, r) {    // piyozsimon gumbaz + uchi
      return '<path d="M' + (cx - r) + ' ' + base + ' C' + (cx - r) + ' ' + (base - r * 1.1) + ' ' + (cx - r * .35) + ' ' + (base - r * 1.25) + ' ' + cx + ' ' + (base - r * 1.75) +
        ' C' + (cx + r * .35) + ' ' + (base - r * 1.25) + ' ' + (cx + r) + ' ' + (base - r * 1.1) + ' ' + (cx + r) + ' ' + base + 'z"/>' +
        '<rect x="' + (cx - 1) + '" y="' + (base - r * 1.75 - 10) + '" width="2" height="11"/>';
    };
    var arches = function (x0, x1, y, n) {  // ravoqli devor: teshiklar "osmon" rangida ko'rinadi (fill-rule)
      var w = (x1 - x0) / n, s = '';
      for (var i = 0; i < n; i++) { var cx = x0 + w * (i + .5), aw = w * .42; s += 'M' + (cx - aw / 2) + ' 160 V' + (y + 14) + ' A' + (aw / 2) + ' ' + (aw / 2) + ' 0 0 1 ' + (cx + aw / 2) + ' ' + (y + 14) + ' V160z '; }
      return '<path fill-rule="evenodd" d="M' + x0 + ' ' + y + ' H' + x1 + ' V160 H' + x0 + 'z ' + s + '"/>';
    };
    return '<svg class="sky-mosque" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      '<g class="far">' +
        '<rect x="0" y="136" width="1200" height="24"/>' +
        minaret(60, 70, 6) + dome(150, 138, 26) + '<rect x="110" y="136" width="80" height="24"/>' +
        dome(1040, 138, 30) + '<rect x="990" y="136" width="100" height="24"/>' + minaret(1150, 62, 6) +
        minaret(330, 84, 5) + dome(380, 140, 16) + dome(830, 140, 18) + minaret(880, 84, 5) +
      '</g>' +
      '<g class="near">' +
        '<rect x="0" y="146" width="1200" height="14"/>' +
        minaret(432, 34, 9) + minaret(768, 34, 9) +
        arches(440, 760, 112, 6) +
        '<rect x="520" y="96" width="160" height="20"/>' + dome(600, 98, 58) +
        dome(490, 114, 22) + dome(710, 114, 22) +
        arches(200, 440, 126, 5) + arches(760, 1000, 126, 5) +
        minaret(200, 96, 7) + minaret(1000, 96, 7) +
      '</g></svg>';
  }

  /* Hijriy sana (Umm al-Qura) — brauzerning o'zi hisoblaydi; bo'lmasa bo'sh */
  function hijri(key) {
    try {
      var p = key.split('-'), d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]), 12);
      return new Intl.DateTimeFormat('en-GB-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d).replace(/\s*AH$/, '');
    } catch (e) { return ''; }
  }

  /* Keyingi namoz: bugungi ro'yxatdan hozirdan keyingisi, bo'lmasa ertangi Bomdod */
  function nextPrayer(key, now) {
    try {
      var t = HabitPlan.times(key), order = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      for (var i = 0; i < order.length; i++) if (t[order[i]] && t[order[i]].dec > now) return { name: order[i], dec: t[order[i]].dec, str: t[order[i]].str };
      var d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + 1);
      var k2 = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var t2 = HabitPlan.times(k2);
      return { name: 'fajr', dec: t2.fajr.dec + 24, str: t2.fajr.str };
    } catch (e) { return null; }
  }

  var skyTimer = null;
  /* Shahar vaqti — kompyuter soat mintaqasiga bog'liq EMAS: UTC + shaharning tz (Sozlamalar → shahar).
     Namoz hisobi ham shu tz bilan, shuning uchun osmon va vaqtlar bir xil soatda. Qaytaradi:
     { h (o'nlik soat), key (shahar bo'yicha sana), hh:mm, pcOff (PC mintaqasi shahardan necha soat farq) } */
  function cityNow() {
    var tz = 5; try { tz = Number(HabitPlan.cfg().tz); if (isNaN(tz)) tz = 5; } catch (e) {}
    var d = new Date(), c = new Date(d.getTime() + tz * 3600000);   // UTC getter'lar bilan o'qiladi
    var h = c.getUTCHours() + c.getUTCMinutes() / 60 + c.getUTCSeconds() / 3600;
    var key = c.getUTCFullYear() + '-' + String(c.getUTCMonth() + 1).padStart(2, '0') + '-' + String(c.getUTCDate()).padStart(2, '0');
    return { h: h, key: key, hm: String(c.getUTCHours()).padStart(2, '0') + ':' + String(c.getUTCMinutes()).padStart(2, '0'), pcOff: Math.round((-d.getTimezoneOffset() / 60 - tz) * 10) / 10 };
  }

  function skyTick(fakeNow) {   // fakeNow (soat, o'nlik) — faqat konsolda sinash uchun: SkyHero.tick(19.2)
    var root = $('#tdSky');
    if (!root || !document.body.contains(root)) { clearInterval(skyTimer); skyTimer = null; return; }
    var rise = Number(root.dataset.rise), set = Number(root.dataset.set);
    var cn = cityNow(), now = typeof fakeNow === 'number' ? fakeNow : cn.h;
    var hm = typeof fakeNow === 'number' ? SKY.hm(fakeNow) : cn.hm;
    var s = SKY.state(now, rise, set);
    $('#skyBg').style.background = 'linear-gradient(180deg, ' + s.colors[0] + ' 0%, ' + s.colors[1] + ' 62%, ' + s.colors[2] + ' 100%)';
    root.classList.toggle('dark-ink', s.dark);
    root.style.setProperty('--night', s.night.toFixed(2));
    /* yoy: x = t (0 → 1), y = ufqdan balandlik — sin(πt). Yoy yuqori yarmida
       yuradi (ufq 62% → cho'qqi 12%), matn pastda — ustma-ust tushmaydi. */
    var place = function (el, t) {
      if (t == null) { el.style.opacity = 0; return; }
      var y = Math.sin(Math.PI * t);
      el.style.left = (5 + t * 90) + '%';
      el.style.top = (62 - y * 50) + '%';
      el.style.opacity = 1;
    };
    place($('#skySun'), s.sunT);
    place($('#skyMoon'), s.moonT);
    $('#skyClock').textContent = hm;
    var nx = $('#skyNext');
    if (now < rise) nx.textContent = tr('skyToRise', { t: SKY.dur(rise - now) });
    else if (now < set) nx.textContent = tr('skyToSet', { t: SKY.dur(set - now) });
    else nx.textContent = tr('skyToRise', { t: SKY.dur(rise + 24 - now) });
    /* Keyingi namoz — shahar sanasi bo'yicha */
    var pr = $('#skyPrayer'), np = nextPrayer(cn.key, now);
    if (pr) {
      if (np) pr.innerHTML = IC.mosque + '<b>' + esc(L(Prayer.NAMES[np.name])) + '</b> ' + esc(np.str) + ' · ' + esc(SKY.dur(np.dec - now));
      pr.hidden = !np;
    }
    /* Kompyuter soat mintaqasi shahardan farq qilsa — ochiq aytiladi (yashirilmaydi) */
    var tzw = $('#skyTz');
    if (tzw) { tzw.hidden = Math.abs(cn.pcOff) < 0.5; if (!tzw.hidden) tzw.textContent = tr('skyTzWarn', { h: (cn.pcOff > 0 ? '+' : '') + cn.pcOff }); }
  }
  window.SkyHero = { render: skyHero, tick: skyTick };

  window.PageToday.mount = function () {
    var key = Store.dateKey();
    /* Jonli osmon: darhol chizib, keyin har 20 s */
    skyTick();
    if (skyTimer) clearInterval(skyTimer);
    skyTimer = setInterval(skyTick, 20000);
    if (window.DuaGate) DuaGate.mount();
    if (window.Focus) Focus.mount();
    $$('[data-tdtoggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.tdtoggle, k = 'td:' + key + ':' + id, on = !Store.flag(k);
        /* Topshiriq bandi: serverda ham "bajarildi" */
        if (id.indexOf('as:') === 0 && window.Ctrl) { Ctrl.setAssignment(id.slice(3), on ? 'completed' : 'in_progress').then(function () { App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); }); }
        Store.setFlag(k, on);
        Store.sessionAdd(key, (on ? 1 : -1) * Number(b.dataset.min));
        App.render();
      });
    });
  };
})();
