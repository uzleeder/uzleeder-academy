/* ==========================================================================
   Ingliz tili (IELTS) kursi — kurs sahifasi, kun sahifasi, cheatsheet'lar
   --------------------------------------------------------------------------
   Python kursi bilan bir xil qolip: kun → to'liq tushuntirish → mashq →
   konspekt → eslatma → (yakshanba) test. Farqi shundaki, ingliz tilida
   "kod bloki" o'rnida GRAMMATIKA CHEATSHEET'i va LUG'AT to'plami turadi —
   ular js/data/eng-grammar.js va eng-vocab.js dan keladi.

   Marshrutlar:
     #/english            — kurs manzarasi: kalendar, bosqichlar, 144 kun
     #/english/12         — 12-kun
     #/eng-grammar        — barcha grammatik mavzular (cheatsheet)
     #/eng-vocab          — barcha lug'at to'plamlari

   Kalendar (ENGLISH.meta dan hisoblanadi, hech qayerda qattiq yozilmagan):
     16–19-sen  introduction (ENG_INTRO, i1…i4) — kurs kuni EMAS
     20-sen     rasmiy start (kickoff)
     1–140-kun  20 hafta   21-sen 2026 → 7-fev 2027
   ========================================================================== */
(function () {
  'use strict';

  /* Kun ma'lumotlari bir nechta faylga bo'lingan (eng-days-1.js, -2.js …).
     Shu yerda bittaga yig'iladi — yangi qism qo'shilsa, faqat shu ro'yxatga
     nom qo'shiladi va boshqa hech narsa o'zgarmaydi.                       */
  var RAW_DAYS = [].concat(
    window.ENG_DAYS_1 || [], window.ENG_DAYS_2 || [], window.ENG_DAYS_3 || [],
    window.ENG_DAYS_4 || [], window.ENG_DAYS_5 || [], window.ENG_DAYS_6 || []
  );
  /* Ma'lumot fayllari eski raqamlashda yozilgan (1–4 kirish, 5–144 kurs).
     Rasmiy kalendar: kirish darslari kurs kuni EMAS, 1-kun = eski 5-kun.
     Shu yerda bir marta o'giriladi: kirish → ENG_INTRO (d: 'i1'…'i4'),
     qolgani → ENG_DAYS (d = eski d − 4). Boshqa hech qayerda eski raqam yo'q. */
  var LEGACY_INTRO = 4;
  window.ENG_INTRO = RAW_DAYS.filter(function (x) { return x.w === 0; }).map(function (x) {
    x.legacy = x.d; x.i = x.d; x.d = 'i' + x.d; x.isIntro = true; return x;
  });
  window.ENG_DAYS = RAW_DAYS.filter(function (x) { return x.w > 0; }).map(function (x) {
    x.legacy = x.d; x.d = x.d - LEGACY_INTRO; return x;
  });
  /* ENG_SKILLS.days ham eski kun raqami bilan — shuni ham o'giramiz */
  if (window.ENG_SKILLS && ENG_SKILLS.days) {
    var sd = {};
    Object.keys(ENG_SKILLS.days).forEach(function (k) { var n = Number(k); sd[n <= LEGACY_INTRO ? 'i' + n : n - LEGACY_INTRO] = ENG_SKILLS.days[k]; });
    ENG_SKILLS.days = sd;
  }

  /* ====================== KALENDAR ===================================== */

  function toDate(key) {
    var p = String(key).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function daysBetween(a, b) { return Math.round((toDate(b) - toDate(a)) / 86400000); }
  function fmt(key) { return fmtDateKey(key); }

  /* d-kunning sanasi. Ikki bo'lak: kirish bloki start'dan, 20 hafta esa
     week1 (dushanba) dan sanaladi. Orada bo'sh kunlar bo'lishi mumkin
     (2026: 20-sen) — ular kurs kuni emas.                            */
  function dayKey(d) {
    var m = ENGLISH.meta;
    /* Kirish darsi ('i2') — introduction sanalari */
    if (typeof d === 'string' && d.charAt(0) === 'i') return Store.shiftDays(m.orientation.from, (Number(d.slice(1)) || 1) - 1);
    if (d <= m.intro) return Store.shiftDays(m.start, d - 1);
    return Store.shiftDays(m.week1, d - m.intro - 1);
  }
  function isIntroKey(d) { return typeof d === 'string' && d.charAt(0) === 'i'; }
  /* Sana → kurs kuni (0 — kurs kuni emas: boshlanmagan, bo'sh kun yoki tugagan) */
  function dayOfKey(key) {
    var m = ENGLISH.meta;
    if (key < m.start) return 0;
    if (key < m.week1) {
      var i = daysBetween(m.start, key) + 1;
      return i <= m.intro ? i : 0;
    }
    var n = m.intro + daysBetween(m.week1, key) + 1;
    return n <= m.days ? n : 0;
  }
  /* Kalendar kuni: start'dan boshlab uzluksiz (kitob rejalari shu bilan
     yuradi — bo'sh kunlarda ham o'qish/tinglash to'xtamaydi)           */
  function calDay(key) { return daysBetween(ENGLISH.meta.start, key || Store.dateKey()) + 1; }
  function calOf(d) { return calDay(dayKey(d)); }

  /* Hafta va hafta ichidagi kun.
     1–4 — kirish bloki (w = 0). 5-kundan boshlab 7 kunlik haftalar. */
  function weekOfDay(d) { return d <= ENGLISH.meta.intro ? 0 : Math.ceil((d - ENGLISH.meta.intro) / 7); }
  function indexInWeek(d) {
    return d <= ENGLISH.meta.intro ? d : ((d - ENGLISH.meta.intro - 1) % 7) + 1;
  }

  /* Kun turi taqvimdan chiqadi — jadval qo'lda yozilmagan:
       yakshanba          → test kuni
       seshanba/payshanba/shanba → Everest LC kuni
       qolgani            → og'ir mustaqil ish kuni                         */
  function dayType(d) {
    var dow = toDate(dayKey(d)).getDay();
    if (dow === 0) return 'test';
    if (ENGLISH.meta.classDays.indexOf(dow) >= 0) return 'class';
    return 'study';
  }

  /* Bugun nechanchi kun? 0 — hali boshlanmagan (introduction / kickoff), >140 — zaxira/imtihon davri */
  function currentDay() {
    var m = ENGLISH.meta, today = Store.dateKey();
    if (today < m.week1) return 0;
    if (today > dayKey(m.days)) return m.days + 1;
    var n = dayOfKey(today);
    /* Kirish bloki bilan 1-hafta orasidagi bo'sh kun: oxirgi kirish kuni */
    return n || m.intro;
  }

  window.EngCal = {
    dayKey: dayKey, dayOfKey: dayOfKey, calDay: calDay, calOf: calOf,
    weekOfDay: weekOfDay, indexInWeek: indexInWeek,
    dayType: dayType, currentDay: currentDay, fmt: fmt, daysBetween: daysBetween,
    daysToExam: function () { return daysBetween(Store.dateKey(), ENGLISH.meta.exam); },
    daysToStart: function () { return daysBetween(Store.dateKey(), ENGLISH.meta.week1); },
    isIntro: isIntroKey,
    /* Introduction davri (16–19-sen) yoki kickoff kuni (20-sen)? */
    isOrientation: function (key) { key = key || Store.dateKey(); return key >= ENGLISH.meta.orientation.from && key <= ENGLISH.meta.orientation.to; },
    isKickoff: function (key) { return (key || Store.dateKey()) === ENGLISH.meta.start; },
    /* Bo'sh kun (kirish bloki va 1-hafta orasi) — kurs kuni emas */
    isGapDay: function (key) { key = key || Store.dateKey(); return key >= ENGLISH.meta.start && key < ENGLISH.meta.week1 && !dayOfKey(key); },
    weekRange: function (w) {
      if (w === 0) return { from: ENGLISH.meta.orientation.from, to: ENGLISH.meta.orientation.to };
      return { from: dayKey(ENGLISH.meta.intro + (w - 1) * 7 + 1), to: dayKey(ENGLISH.meta.intro + w * 7) };
    },
    buffer: function () {
      return { from: Store.shiftDays(dayKey(ENGLISH.meta.days), 1), to: ENGLISH.meta.bufferTo };
    }
  };

  /* ====================== MA'LUMOTGA KIRISH ============================ */

  function dayOf(d) {
    if (isIntroKey(d)) { for (var j = 0; j < ENG_INTRO.length; j++) if (ENG_INTRO[j].d === d) return ENG_INTRO[j]; return null; }
    for (var i = 0; i < ENG_DAYS.length; i++) if (ENG_DAYS[i].d === d) return ensureWeeklyQuiz(ENG_DAYS[i]);
    return null;
  }
  /* ====================== HAFTALIK TEST — GENERATOR YO'LI =================
     1, 2, 3, 5, 6, 7-haftalarning 7-kunida qo'lda yozilgan 10 ta savol bor.
     Qolgan haftalarda (4, 8–20) savol yozilmagan — avval bu kunlar shunchaki
     testsiz o'tardi. Endi ular ANIQ generatorga yo'naltiriladi: QGen'dan
     grammatika 5 + lug'at 5, daraja hafta bo'yicha (1–7 easy, 8–14 mid,
     15+ hard), seed = 1000 + hafta — ya'ni bir hafta har safar bir xil test.
     Natija xuddi qo'lda yozilgan test kabi Store.quizSet('eng:'+d) ga yoziladi
     va xato banki + SRS ga tushadi. Kun obyektiga bir marta biriktiriladi.  */
  function ensureWeeklyQuiz(day) {
    if (!day || day.quiz || day.i !== 7 || !window.QGen) return day;
    var w = day.w || 1;
    var lvl = w <= 7 ? 'easy' : w <= 14 ? 'mid' : 'hard';
    var seed = 1000 + w;
    var qs = [];
    try { qs = QGen.grammar(5, lvl, seed).concat(QGen.vocab(5, lvl, seed + 500)); } catch (e) { qs = []; }
    qs = qs.filter(function (q) { return q && q.q && q.opts && q.opts.length >= 2 && typeof q.correct === 'number'; });
    if (qs.length) { day.quiz = qs; day.quizGenerated = true; day.quizLevel = lvl; }
    return day;
  }

  function daysOfWeek(w) {
    if (w === 0) return ENG_INTRO;
    return ENG_DAYS.filter(function (x) { return x.w === w; });
  }
  function taskCount(day) { return (day.practice || []).length; }

  window.Eng = {
    dayOf: dayOf, daysOfWeek: daysOfWeek, intro: function () { return ENG_INTRO; },
    /* Kontent hali yozilmagan kunlar bo'lishi mumkin — necha kun tayyor */
    ready: function () { return ENG_DAYS.length; },
    lastReadyDay: function () { return ENG_DAYS.length ? ENG_DAYS[ENG_DAYS.length - 1].d : 0; },

    weekMeta: function (w) {
      for (var i = 0; i < ENGLISH.weeks.length; i++) if (ENGLISH.weeks[i].n === w) return ENGLISH.weeks[i];
      return null;
    },
    skill: function (key) {
      for (var i = 0; i < ENGLISH.skills.length; i++) if (ENGLISH.skills[i].key === key) return ENGLISH.skills[i];
      return { key: key, icon: 'spark', name: { uz: key, en: key } };
    },
    grammar: function (key) { return (window.ENG_GRAMMAR && ENG_GRAMMAR[key]) || null; },
    vocab: function (key) { return (window.ENG_VOCAB && ENG_VOCAB[key]) || null; },

    /* Kun zanjiri: i1 → i2 → i3 → i4 → 1 → 2 … 140 */
    prevKey: function (d) {
      if (isIntroKey(d)) { var n = Number(d.slice(1)); return n > 1 ? 'i' + (n - 1) : null; }
      if (d === 1) return ENG_INTRO.length ? 'i' + ENG_INTRO.length : null;
      return d - 1;
    },
    nextKey: function (d) {
      if (isIntroKey(d)) { var n2 = Number(d.slice(1)); return n2 < ENG_INTRO.length ? 'i' + (n2 + 1) : 1; }
      return d + 1;
    },
    doneCount: function () { return Store.engDoneCount(); },
    pct: function () { return Store.engDoneCount() / ENGLISH.meta.days; },
    certReady: function () {
      // Sertifikat uchun YOZILGAN kunlarning hammasi yopilishi kerak
      var need = ENG_DAYS.length || ENGLISH.meta.days;
      return Store.engDoneCount() >= need;
    },
    weekDone: function (w) {
      var list = daysOfWeek(w);
      if (!list.length) return false;
      return list.every(function (x) { return Store.engDayDone(x.d); });
    },

    /* Vazifa belgilanganda kun avtomatik yopiladi (va aksincha) — shunda
       "yopilgan" holat har doim haqiqatni ko'rsatadi.                     */
    toggleTask: function (d, i) {
      var day = dayOf(d);
      if (!day) return;
      Store.engSetTask(d, i, !Store.engTask(d, i));
      var all = Store.engTasksDone(d) >= taskCount(day);
      if (all !== Store.engDayDone(d)) {
        Store.engSetDayDone(d, all);
      if (all && window.Review) Review.add('eng', d);
        if (all) toast(tr('engAllTasks'), 'ok');
      }
    },
    toggleDay: function (d) {
      var day = dayOf(d);
      if (!day) return;
      var on = !Store.engDayDone(d);
      for (var i = 0; i < taskCount(day); i++) Store.engSetTask(d, i, on);
      Store.engSetDayDone(d, on);
      if (on && window.Review) Review.add('eng', d);
      toast(tr(on ? 'engDayDone' : 'engDayReopened'), on ? 'ok' : '');
    }
  };

  /* ====================== OLTI KO'NIKMA ================================
     Har kunning oltala ko'nikma bo'yicha aniq vazifasi. Uch qatlam
     birlashtiriladi: kunga xos → haftalik dastur → standart. Shu sababli
     kontenti hali yozilmagan kun ham to'liq chiqadi.                     */

  /* Kun sahifasi kun turini 'study' / 'class' / 'test' deb ataydi,
     kunlik intizom tizimi esa 'heavy' / 'class' / 'rest'. Ikkalasi bir
     narsani bildiradi — shu yerda moslashtiriladi. (Ilgari nomlar mos
     kelmagani uchun yakshanba kuni test rejimiga o'tmasdi.)             */
  var TYPE_MAP = { study: 'heavy', class: 'class', test: 'rest' };

  function skillPlan(day) {
    var S = window.ENG_SKILLS;
    if (!S) return null;
    var type = TYPE_MAP[dayType(day.d)] || 'heavy';
    var wk = S.weeks[day.w] || {};
    var dd = (S.days && S.days[day.d]) || {};
    var mins = S.minutes[type] || S.minutes.heavy;

    return S.order.map(function (key) {
      var w = wk[key] || {};
      var d = dd[key] || {};
      /* Dam kunida ko'p ko'nikmaning vazifasi boshqacha (test formati) */
      var task = d.t || (type === 'rest' && w.r ? w.r : w.t) || null;
      return {
        key: key,
        skill: Eng.skill(key),
        focus: d.f || w.f || null,
        task: task,
        min: mins[key] || 0,
        /* Grammatika va lug'at kunning o'z mavzusiga bog'lanadi */
        topic: key === 'grammar' && day.gram ? Eng.grammar(day.gram)
             : key === 'vocab' && day.vocab ? Eng.vocab(day.vocab) : null,
        anchor: key === 'grammar' && day.gram ? '#l-gram'
              : key === 'vocab' && day.vocab ? '#l-vocab' : null
      };
    });
  }

  function skillsBlock(day) {
    var plan = skillPlan(day);
    if (!plan) return '';
    var type = TYPE_MAP[dayType(day.d)] || 'heavy';
    var total = plan.reduce(function (n, s) { return n + s.min; }, 0);

    var h = '<div class="skills-block" id="l-skills">' +
      '<div class="sb-head"><span class="sb-ic">' + IC.layers + '</span>' +
        '<div><h3>' + esc(tr('engSixT')) + '</h3>' +
        '<span>' + esc(L(ENG_SKILLS.typeNote[type])) + '</span></div>' +
        '<span class="sb-total">' + Math.floor(total / 60) + 's ' + (total % 60 ? (total % 60) + 'd' : '') + '</span></div>' +
      '<div class="sb-grid">';

    plan.forEach(function (s, i) {
      h += '<div class="sb-item k-' + s.key + '">' +
        '<div class="sb-top">' +
          '<span class="sb-n">' + esc(tr('engLessonN', { n: i + 1 })) + '</span>' +
          '<span class="sb-m">' + s.min + ' ' + esc(tr('engMin')) + '</span>' +
        '</div>' +
        '<div class="sb-name">' + IC[s.skill.icon] + esc(L(s.skill.name)) + '</div>' +
        (s.topic ? '<a class="sb-topic" href="' + s.anchor + '">' + esc(L(s.topic.name)) + '</a>' : '') +
        (s.focus ? '<div class="sb-focus">' + esc(L(s.focus)) + '</div>' : '') +
        (s.task ? '<div class="sb-task">' + inlineCode(L(s.task)) + '</div>'
                : '<div class="sb-task muted">' + esc(tr('engSoon')) + '</div>') +
        '</div>';
    });

    return h + '</div></div>';
  }

  /* ====================== BITTA KO'NIKMANING 144 KUNI ==================
     "Speaking'ni bossam — hamma mavzusi, qaysi kun, necha soat" — shu
     sahifa. Ma'lumot yangi yozilmaydi: skillPlan() ni 144 kunga aylantirib
     chiqadi. Kontenti hali yozilmagan kun uchun ham (61+) haftalik
     dastur bor, shuning uchun jadval hech qachon bo'sh qolmaydi.        */

  function dayStub(d) {
    return dayOf(d) || { d: d, w: weekOfDay(d), title: null };
  }

  /* Ko'nikmaning 144 kunlik umumiy soati — kun turi bo'yicha daqiqalar */
  function skillHours(key) {
    var S = window.ENG_SKILLS;
    if (!S) return 0;
    var total = 0;
    for (var d = 1; d <= ENGLISH.meta.days; d++) {
      var type = TYPE_MAP[dayType(d)] || 'heavy';
      total += (S.minutes[type] || S.minutes.heavy)[key] || 0;
    }
    return Math.round(total / 60);
  }

  /* Kunning shu ko'nikma bo'yicha mavzusi — jadval ustuni uchun */
  function skillTopicOf(key, d) {
    var day = dayStub(d);
    var plan = skillPlan(day);
    if (!plan) return { topic: '', task: '', min: 0 };
    var s = null;
    plan.forEach(function (x) { if (x.key === key) s = x; });
    if (!s) return { topic: '', task: '', min: 0 };
    var topic = s.topic ? L(s.topic.name) : (s.focus ? L(s.focus) : '');

    /* Manba kitoblar bilan bog'lash — kitob rejalari KALENDAR kuni bilan
       yuradi (bo'sh kunlarda ham), shuning uchun kurs kunini o'giramiz */
    var cd = calOf(d);
    if (key === 'reading' && window.Books) {
      var ref = Books.readingRef(cd);
      var r = Books.readingOf(Books.readingNo(cd));
      if (ref) topic = (r ? r.title : ref.title) + ' · ' + ref.unit + ref.part;
    }
    if (key === 'listening' && window.Books) {
      /* Kitob rejasi asosiy: unit va mashqlar; platformadagi bo'lim — qo'shimcha */
      topic = Books.listenLabel(cd);
      var l = Books.listeningOf(Books.listeningNo(cd));
      if (l) topic += ' · +S' + l.section;
    }
    if (key === 'vocab' && window.ENG_BOOK && window.Books) {
      /* Destination B2: kunning bo'limi */
      topic = (topic ? topic + ' · ' : '') + Books.vocabTodayLabel(cd);
    }
    /* Speaking: birinchi 30 kun trek savoli */
    if (key === 'speaking' && window.SPEAK30 && d <= SPEAK30.meta.days) {
      var sd = SPEAK30.days[d - 1];
      var dl = SPEAK30.daily && SPEAK30.daily[d];
      if (sd) topic = sd.part + ' — ' + L(sd.q).slice(0, 70) + (L(sd.q).length > 70 ? '…' : '');
      if (dl && dl.tech) s.task = dl.tech;
    }
    return { topic: topic, task: s.task ? L(s.task) : '', min: s.min };
  }

  window.PageEngSkill = function (key) {
    var s = Eng.skill(key);
    if (!s || !window.ENG_SKILLS) return '<div class="page empty"><h3>404</h3></div>';
    var m = ENGLISH.meta, cur = currentDay();
    var hrs = skillHours(key);
    var sys = null;
    ENGLISH.systems.forEach(function (x) { if (x.skill === key) sys = x; });

    var h = '<div class="page stagger">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(tr('english')) + ' · ' + esc(tr('engSkills')) + '</div>' +
      '<h1 class="h-ic"><span class="h-ic-box">' + IC[s.icon] + '</span>' + esc(L(s.name)) + '</h1>' +
      '<div class="lesson-meta">' +
        '<span class="chip topic">' + hrs + ' ' + esc(tr('engHoursTotal')) + '</span>' +
        '<span>' + m.days + ' ' + esc(tr('days')) + '</span><span>·</span>' +
        '<span>' + esc(L(s.goal)) + '</span></div></header>';

    /* Kun turiga qarab daqiqalar */
    var mins = ENG_SKILLS.minutes;
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile"><div class="st-l">' + esc(tr('engHeavyDay')) + '</div><div class="st-v">' + (mins.heavy[key] || 0) + '<small>' + esc(tr('engMin')) + '</small></div><div class="st-note">' + esc(tr('engMonWedFri')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(tr('engClassDay')) + '</div><div class="st-v">' + (mins['class'][key] || 0) + '<small>' + esc(tr('engMin')) + '</small></div><div class="st-note">' + esc(tr('engTueThuSat')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(tr('engRestDay')) + '</div><div class="st-v">' + (mins.rest[key] || 0) + '<small>' + esc(tr('engMin')) + '</small></div><div class="st-note">' + esc(tr('engSunday')) + '</div></div>' +
      '<div class="stat-tile accent"><div class="st-l">' + esc(tr('engHoursTotal')) + '</div><div class="st-v">' + hrs + '<small>h</small></div><div class="st-note">' + esc(tr('engOver144')) + '</div></div>' +
      '</div>';

    /* Metod (bor bo'lsa) */
    if (sys) {
      h += '<div class="card eng-sys"><h3 class="card-title"><span class="num">' + IC[s.icon] + '</span>' + esc(L(sys.title)) + '</h3>' +
        '<p>' + esc(L(sys.intro)) + '</p><div class="es-steps">';
      sys.steps.forEach(function (st, i) {
        h += '<div class="es-step"><span class="n">' + (i + 1) + '</span><span><b>' + esc(L(st.t)) + '</b><span>' + esc(L(st.d)) + '</span></span></div>';
      });
      h += '</div></div>';
    }

    /* Speaking: 30 kunlik trekning to'liq rejasi */
    if (key === 'speaking' && window.SPEAK30) {
      h += sectionHead(1, L(SPEAK30.meta.title), L(SPEAK30.meta.lede));
      h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span><div>' + esc(L(SPEAK30.meta.honest)) + '</div></div>';
      Object.keys(SPEAK30.weeks).forEach(function (w) {
        var wk = SPEAK30.weeks[w];
        h += '<div class="eng-phase-head"><span class="ep-n">' + w + '</span><span class="ep-t"><b>' + esc(L(wk.title)) + '</b><span>' + esc(L(wk.goal)) + '</span></span></div>';
        h += '<div class="sk-table"><div class="sk-row head"><span>#</span><span>' + esc(tr('date')) + '</span><span>' + esc(tr('engMin')) + '</span><span>' + esc(tr('engTopic')) + '</span><span>' + esc(tr('habTechToday')) + '</span></div>';
        SPEAK30.days.filter(function (x) { return x.w === Number(w); }).forEach(function (x) {
          var dl = SPEAK30.daily && SPEAK30.daily[x.n];
          var key2 = dayKey(x.n);
          h += '<div class="sk-row' + (x.n === cur ? ' today' : '') + (Store.speakNote(x.n) ? ' done' : '') + '">' +
            '<span class="sk-n">' + x.n + '</span><span class="sk-d">' + esc(fmt(key2)) + '</span>' +
            '<span class="sk-m">' + esc(x.min) + '</span>' +
            '<span class="sk-t"><b>' + esc(x.part) + '</b> ' + esc(L(x.q)) + (x.p3 ? '<i>+ ' + esc(L(x.p3)) + '</i>' : '') + '</span>' +
            '<span class="sk-x">' + (dl ? esc(L(dl.tech)) : '') + '</span></div>';
        });
        h += '</div>';
      });
      h += sectionHead(2, tr('engAfter30'), tr('engAfter30S'));
    } else {
      h += sectionHead(1, tr('engAllDays'), tr('engAllDaysS', { n: m.days }));
    }

    /* 144 kun — hafta bo'yicha */
    var from = (key === 'speaking' && window.SPEAK30) ? SPEAK30.meta.days + 1 : 1;
    var lastW = -1;
    for (var d = from; d <= m.days; d++) {
      var w = weekOfDay(d);
      if (w !== lastW) {
        if (lastW >= 0) h += '</div>';
        var wm = Eng.weekMeta(w);
        var rng = EngCal.weekRange(w);
        h += '<div class="eng-phase-head small"><span class="ep-n">' + (w === 0 ? '0' : w) + '</span><span class="ep-t"><b>' +
          esc(w === 0 ? tr('engIntroBlock') : tr('engWeek') + ' ' + w) + (wm ? ' — ' + esc(L(wm.title)) : '') + '</b>' +
          '<span>' + esc(fmt(rng.from)) + ' – ' + esc(fmt(rng.to)) + '</span></span></div>';
        h += '<div class="sk-table"><div class="sk-row head"><span>#</span><span>' + esc(tr('date')) + '</span><span>' + esc(tr('engMin')) + '</span><span>' + esc(tr('engTopic')) + '</span><span>' + esc(tr('engTask')) + '</span></div>';
        lastW = w;
      }
      var t = skillTopicOf(key, d);
      var type = dayType(d);
      h += '<button class="sk-row' + (d === cur ? ' today' : '') + (Store.engDayDone(d) ? ' done' : '') + ' ty-' + type + '" data-go="english/' + d + '">' +
        '<span class="sk-n">' + d + '</span><span class="sk-d">' + esc(fmt(dayKey(d))) + '</span>' +
        '<span class="sk-m">' + t.min + '</span>' +
        '<span class="sk-t">' + esc(t.topic || '—') + '</span>' +
        '<span class="sk-x">' + esc(t.task) + '</span></button>';
    }
    if (lastW >= 0) h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="english">' + IC.arrowL + esc(tr('english')) + '</button><span></span></div>';
    return h + '</div>';
  };

  /* ====================== GRAMMATIKA CHEATSHEET ======================== */

  /* Bitta grammatik mavzuning to'liq kartasi.
     compact = true bo'lsa faqat qoida va jadval (kun sahifasida joy tejash) */
  window.engGrammarCard = function (key, compact) {
    var g = Eng.grammar(key);
    if (!g) return '';
    var h = '<div class="gram-card" id="gram-' + esc(key) + '">' +
      '<div class="gc-head"><span class="gc-ic">' + IC.brain + '</span>' +
        '<div><h3>' + esc(L(g.name)) + '</h3>' +
        '<span class="gc-short">' + esc(L(g.short)) + '</span></div>' +
        '<span class="gc-tag">' + esc(tr('engCheat')) + '</span></div>';

    h += '<p class="gc-rule">' + inlineCode(L(g.rule)) + '</p>';

    /* Cheatsheet jadvali */
    if (g.forms) {
      h += '<div class="gc-table-wrap"><table class="gc-table">';
      if (g.forms.head && g.forms.head.length) {
        h += '<thead><tr>';
        g.forms.head.forEach(function (c) { h += '<th>' + esc(c) + '</th>'; });
        h += '</tr></thead>';
      }
      h += '<tbody>';
      g.forms.rows.forEach(function (r) {
        h += '<tr>';
        r.forEach(function (c, i) { h += '<td' + (i === 0 ? ' class="k"' : '') + '>' + esc(c) + '</td>'; });
        h += '</tr>';
      });
      h += '</tbody></table></div>';
    }

    if (!compact && g.use && g.use.length) {
      h += '<div class="gc-block"><div class="gc-l">' + esc(tr('engWhenUsed')) + '</div><ul>';
      g.use.forEach(function (u) { h += '<li>' + inlineCode(L(u)) + '</li>'; });
      h += '</ul></div>';
    }

    if (g.examples && g.examples.length) {
      h += '<div class="gc-block"><div class="gc-l">' + esc(tr('engExamples')) + '</div><div class="gc-ex">';
      g.examples.forEach(function (e) { h += '<div>' + esc(e) + '</div>'; });
      h += '</div></div>';
    }

    if (g.mistakes && g.mistakes.length) {
      h += '<div class="gc-block"><div class="gc-l red">' + esc(tr('engCommonMistakes')) + '</div><div class="gc-mis">';
      g.mistakes.forEach(function (m) {
        h += '<div class="gm-row">' +
          '<span class="gm-bad">' + esc(m.bad) + '</span>' +
          '<span class="gm-arrow">→</span>' +
          '<span class="gm-good">' + esc(m.good) + '</span>' +
          (m.why ? '<span class="gm-why">' + esc(L(m.why)) + '</span>' : '') +
          '</div>';
      });
      h += '</div></div>';
    }

    if (!compact && g.ielts) {
      h += '<div class="gc-ielts">' + IC.target + '<span>' + esc(L(g.ielts)) + '</span></div>';
    }
    /* O'rganish halqasi: O'rgandim (mahoratga kiradi) · Takror navbatiga · Xatcho'p */
    if (!compact) {
      var gdone = Store.flag('gr:' + key), inRv = window.Review && Review.has('grammar', key);
      h += '<div class="gc-loop">' +
        '<button class="btn btn-sm ' + (gdone ? 'btn-primary' : 'btn-ghost') + '" data-grdone="' + esc(key) + '">' + IC.check + esc(gdone ? tr('grLearned') : tr('grMarkLearned')) + '</button>' +
        '<button class="btn btn-ghost btn-sm" data-grrv="' + esc(key) + '"' + (inRv ? ' disabled' : '') + '>' + IC.refresh + esc(inRv ? tr('grInReview') : tr('grToReview')) + '</button>' +
        (window.bookmarkBtn ? bookmarkBtn('gr:' + key, 'eng-grammar', L(g.name), 'grammar') : '') +
        (window.Copybook && Copybook.fromBtn ? Copybook.fromBtn('english', 'eng-grammar', L(g.name), { title: L(g.name), type: 'grammar' }) : '') + '</div>';
    }

    /* Mashqlar — javob yopiq, bosilganda ochiladi (ENG_GRAMMAR_EX) */
    var ex = (window.ENG_GRAMMAR_EX || {})[key];
    if (!compact && ex && ex.length) {
      h += '<div class="gc-block gc-exs"><div class="gc-l">' + esc(tr('engGramEx')) + ' · ' + ex.length + '</div>';
      ex.forEach(function (e, i) {
        h += '<div class="gx-row">' +
          '<span class="gx-n">' + (i + 1) + '</span>' +
          '<span class="gx-q">' + esc(e.q) + '</span>' +
          '<button class="gx-btn" type="button" data-gx="' + esc(key) + '-' + i + '">' + esc(tr('engGramShow')) + '</button>' +
          '<span class="gx-a" id="gx-' + esc(key) + '-' + i + '" hidden>' + esc(e.a) + '</span>' +
          '</div>';
      });
      h += '</div>';
    }

    return h + '</div>';
  };

  /* Grammatika halqasi tugmalari — delegat */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-grdone]');
    if (b) { Store.setFlag('gr:' + b.dataset.grdone); if (Store.flag('gr:' + b.dataset.grdone) && window.Review) Review.add('grammar', b.dataset.grdone); App.render(); return; }
    var r = e.target.closest && e.target.closest('[data-grrv]');
    if (r && window.Review) { Review.add('grammar', r.dataset.grrv); toast(tr('grAddedReview'), 'ok'); App.render(); }
  });

  /* Mashq javobini ochish — sahifa bo'ylab bitta delegat */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-gx]');
    if (!b) return;
    var a = document.getElementById('gx-' + b.getAttribute('data-gx'));
    if (!a) return;
    a.hidden = !a.hidden;
    b.textContent = a.hidden ? tr('engGramShow') : tr('engGramHide');
  });

  /* ====================== LUG'AT TO'PLAMI ============================== */

  window.engVocabCard = function (key) {
    var v = Eng.vocab(key);
    if (!v) return '';
    var h = '<div class="vocab-card" id="voc-' + esc(key) + '">' +
      '<div class="gc-head"><span class="gc-ic gold">' + IC.book + '</span>' +
        '<div><h3>' + esc(L(v.name)) + '</h3>' +
        '<span class="gc-short">' + esc(L(v.note)) + '</span></div>' +
        '<span class="gc-tag">' + v.words.length + ' ' + esc(tr('engWords')) + '</span></div>' +
      '<div class="voc-list">';
    v.words.forEach(function (w) {
      h += '<div class="voc-row">' +
        '<div class="vr-top"><b>' + esc(w.w) + '</b><span class="vr-uz">' + esc(w.uz) + '</span></div>' +
        '<div class="vr-col">' + w.col.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' +
        '<div class="vr-ex">' + esc(w.ex) + '</div>' +
        '</div>';
    });
    return h + '</div></div>';
  };

  /* ====================== KURS SAHIFASI ================================ */

  window.PageEnglish = function () {
    var m = ENGLISH.meta;
    var cur = currentDay();
    var done = Store.engDoneCount();
    var written = ENG_DAYS.length;
    var pct = Math.round(done / m.days * 100);
    var toExam = EngCal.daysToExam();
    var toStart = EngCal.daysToStart();
    var buf = EngCal.buffer();

    var h = '<div class="page stagger">';

    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('engKick')) + '</div>' +
      '<h1>IELTS <span class="grad">8.0</span> — ' + m.days + ' ' + esc(tr('days')) + '</h1>' +
      '<p class="lede">' + esc(L(m.lede)) + '</p></header>';

    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span>' +
      '<div><h4>' + esc(tr('engImportant')) + '</h4>' + esc(L(m.disclaimer)) + '</div></div>';

    /* --- kalendar --- */
    h += '<div class="eng-cal">' +
      calCell(IC.spark, tr('engIntroBlock'), fmt(m.orientation.from) + ' – ' + fmt(m.orientation.to), esc(tr('engIntroNotCounted')) + (m.orientation.done ? ' · ' + esc(tr('rsCompleted')) : '')) +
      calCell(IC.calendar, tr('engStart'), fmt(m.start), esc(tr('engKickoffNote'))) +
      calCell(IC.book, tr('day') + ' 1', fmt(m.week1), esc(tr('engMonSun'))) +
      calCell(IC.calendar, tr('engFinish'), fmt(m.bufferTo), '') +
      calCell(IC.target, tr('engExam'), fmt(m.exam),
        toStart > 0 ? tr('engDaysToStart', { n: toStart })
        : toExam > 0 ? tr('engDaysLeft', { n: toExam }) : tr('engOver')) +
      '</div>';

    /* --- o'lchovlar --- */
    h += '<div class="stat-grid" style="margin-bottom:20px">';
    h += '<div class="stat-tile accent"><div class="st-l">' + IC.trend + esc(tr('engProgress')) + '</div>' +
      '<div class="st-v">' + pct + '<small>%</small></div>' +
      '<div class="bar" style="margin-top:9px"><i style="width:' + pct + '%"></i></div>' +
      '<div class="st-note">' + done + ' / ' + m.days + ' ' + esc(tr('days')) + '</div></div>';

    h += '<div class="stat-tile"><div class="st-l">' + IC.calendar + esc(tr('engToday')) + '</div>' +
      '<div class="st-v">' + (cur === 0 ? '—' : cur > m.days ? esc(tr('engExamMode')) : cur) + '</div>' +
      '<div class="st-note">' + esc(
        cur === 0 ? tr('engDaysToStart', { n: toStart })
        : cur > m.days ? fmt(buf.from) + ' – ' + fmt(buf.to)
        : (dayOf(cur) ? L(dayOf(cur).title) : tr('engWeek') + ' ' + weekOfDay(cur))) + '</div></div>';

    h += '<div class="stat-tile"><div class="st-l">' + IC.book + esc(tr('engFrom')) + '</div>' +
      '<div class="st-v" style="font-size:26px">' + esc(m.from) + '</div>' +
      '<div class="st-note">→ ' + esc(m.to) + '</div></div>';

    var last = Store.engLastScore();
    var lastOverall = last ? Store.engOverall(last) : null;
    h += '<div class="stat-tile ' + (lastOverall ? 'gold' : '') + '"><div class="st-l">' + IC.medal + esc(tr('engOverall')) + '</div>' +
      '<div class="st-v">' + (lastOverall !== null ? lastOverall.toFixed(1) : '—') + '</div>' +
      '<div class="st-note">' + esc(last ? tr('day') + ' ' + last.day + ' · ' + tr('engMockTag') : tr('engNoScores')) + '</div></div>';
    h += '</div>';

    /* --- LC jadvali + cheatsheet havolalari --- */
    h += '<div class="callout tip"><span class="co-ic">' + IC.clock + '</span>' +
      '<div><h4>' + esc(m.classPlace) + '</h4>' +
      esc(tr('engClassDays')) + ' · ' + esc(m.classTime) + ' — ' + esc(tr('engSelfStudy')) + ': ' + esc(L(m.selfStudy)) +
      '</div></div>';

    h += '<div class="eng-quick">' +
      '<button class="btn btn-ghost" data-go="eng-grammar">' + IC.brain + esc(tr('engGrammarSheet')) + '</button>' +
      '<button class="btn btn-ghost" data-go="eng-vocab">' + IC.book + esc(tr('engVocabSheet')) + '</button>' +
      (cur > 0 && cur <= m.days && dayOf(cur)
        ? '<button class="btn btn-primary" data-go="english/' + cur + '">' + IC.rocket + esc(tr('engGoToday')) + '</button>'
        : '<button class="btn btn-primary" data-go="english/1">' + IC.rocket + esc(tr('engStartCourse')) + '</button>') +
      '</div>';

    /* --- 6 ko'nikma — mahorat foizi bilan (Mastery.english: real progressdan) --- */
    var em = window.Mastery ? Mastery.english() : null;

    /* Bugungi ingliz tili vazifalari — kun, takror, zaif ko'nikma, daftar */
    if (em && window.Review) {
      var tk = Store.dateKey(), ed = EngCal.dayOfKey(tk);
      var rvEng = Review.due().filter(function (it) { return it.kind !== 'py' && !(it.kind === 'mistake' && (it.meta.cat || 'python') === 'python'); }).length;
      var wk = Mastery.weak().filter(function (w) { return w.key !== 'python' && w.v < 60; })[0];
      h += '<div class="eng-today">' +
        (ed ? '<button class="cont-chip" data-go="english/' + ed + '"><span class="cc-k">' + esc(tr('coursesToday')) + '</span><b>' + esc(tr('day')) + ' ' + ed + ' · ' + esc(Store.engDayDone(ed) ? tr('llDoneS') : tr('llTodoS')) + '</b></button>' : '') +
        '<button class="cont-chip" data-go="review"><span class="cc-k">' + esc(tr('reviewPage')) + '</span><b>' + esc(tr('tdReviewDue', { n: rvEng })) + '</b></button>' +
        (wk ? '<button class="cont-chip" data-go="' + esc(wk.route) + '"><span class="cc-k">' + esc(tr('anWeakT')) + '</span><b>' + esc(wk.label) + ' · ' + wk.v + '%</b></button>' : '') +
        '<button class="cont-chip" data-go="copy/vocab"><span class="cc-k">' + esc(tr('copyVocab')) + '</span><b>' + Store.copyList('vocab').length + ' ' + esc(tr('engWords')) + '</b></button>' +
        '</div>';
    }
    var mapKey = { vocab: 'vocab', vocabulary: 'vocab', grammar: 'grammar', reading: 'reading', listening: 'listening', speaking: 'speaking', writing: 'writing' };
    h += sectionHead(1, tr('engSkills'), tr('engSkillsNote'));
    if (em) {
      h += '<div class="eng-mastery">' + ['vocab', 'grammar', 'reading', 'listening', 'speaking', 'writing'].map(function (k) {
        var lbl = { vocab: tr('engSkillVocab'), grammar: tr('engSkillGrammar'), reading: tr('engSkillReading'), listening: tr('engSkillListening'), speaking: tr('engSkillSpeaking'), writing: tr('engSkillWriting') }[k];
        return '<div class="em-row' + (em[k] < 60 ? ' weak' : '') + '"><span>' + esc(lbl) + '</span><div class="bar"><i style="width:' + em[k] + '%"></i></div><b>' + em[k] + '%</b></div>';
      }).join('') + '<div class="hint">' + esc(tr('engMasteryNote')) + '</div></div>';
    }
    h += '<div class="eng-skill-grid">';
    ENGLISH.skills.forEach(function (s) {
      var hrs = skillHours(s.key);
      var mv = em && mapKey[s.key] != null ? em[mapKey[s.key]] : null;
      h += '<button class="eng-skill" data-go="eng-skill/' + esc(s.key) + '"><div class="es-ic">' + IC[s.icon] + '</div>' +
        '<div><div class="es-n">' + esc(L(s.name)) + (mv != null ? ' <em class="es-m">' + mv + '%</em>' : '') + '</div>' +
        '<div class="es-g">' + esc(L(s.goal)) + '</div>' +
        '<div class="es-h">' + hrs + ' ' + esc(tr('engHoursTotal')) + ' · ' + esc(tr('engOpenPlan')) + '</div></div>' + IC.arrowR + '</button>';
    });
    h += '</div>';
    h += '<div class="callout why"><span class="co-ic">' + IC.layers + '</span><div>' + esc(L(m.chain)) + '</div></div>';

    /* --- kirish bloki + bosqichlar + haftalar --- */
    h += sectionHead(2, tr('engDayList'), tr('engPhases'));

    h += weekBlock(0, cur);
    ENGLISH.phases.forEach(function (ph) {
      h += '<div class="eng-phase-head"><span class="ep-n">' + ph.n + '</span>' +
        '<span class="ep-t"><b>' + esc(L(ph.title)) + '</b>' +
        '<span>' + esc(tr('engWeek')) + ' ' + ph.from + '–' + ph.to + ' · ' + esc(L(ph.goal)) + '</span></span></div>' +
        '<div class="ep-note">' + esc(L(ph.note)) + '</div>';
      for (var w = ph.from; w <= ph.to; w++) h += weekBlock(w, cur);
    });

    if (written < m.days) {
      h += '<div class="callout tip"><span class="co-ic">' + IC.clock + '</span><div>' +
        esc(tr('engMoreComing', { n: written, total: m.days })) + '</div></div>';
    }

    /* --- zaxira + imtihon --- */
    h += '<div class="eng-buffer">' +
      '<div class="eb-row"><span class="eb-ic">' + IC.clock + '</span>' +
        '<div><b>' + esc(tr('engBuffer')) + '</b> · ' + esc(fmt(buf.from)) + ' – ' + esc(fmt(buf.to)) + '</div></div>' +
      '<p>' + esc(tr('engBufferNote')) + '</p>' +
      '<div class="eb-row exam"><span class="eb-ic">' + IC.target + '</span>' +
        '<div><b>' + esc(tr('engExam')) + '</b> · ' + esc(fmt(m.exam)) + '</div></div>' +
      '</div>';

    h += certCard();

    /* --- kunlik tartib --- */
    h += sectionHead(3, tr('engDaily'), L(m.selfStudy));
    h += '<div class="eng-daily">';
    ENGLISH.daily.forEach(function (dd) {
      h += '<div class="ed-col"><div class="ed-head"><b>' + esc(L(dd.days)) + '</b><span>' + esc(dd.total) + '</span></div>' +
        '<div class="ed-note">' + esc(L(dd.note)) + '</div>';
      dd.rows.forEach(function (r) {
        var s = Eng.skill(r.skill);
        h += '<div class="ed-row"><span class="ed-w">' + esc(L(r.when)) + '</span>' +
          '<span class="ed-s">' + IC[s.icon] + esc(L(s.name)) + '</span>' +
          '<span class="ed-m">' + r.min + ' ' + esc(tr('engMin')) + '</span>' +
          '<span class="ed-x">' + esc(L(r.what)) + '</span></div>';
      });
      h += '</div>';
    });
    h += '</div>';

    /* --- metodlar --- */
    h += sectionHead(4, tr('engSystems'), tr('engSkillsNote'));
    ENGLISH.systems.forEach(function (sy) {
      var s = Eng.skill(sy.skill);
      h += '<div class="card eng-sys"><h3 class="card-title"><span class="num">' + IC[s.icon] + '</span>' + esc(L(sy.title)) + '</h3>' +
        '<p>' + esc(L(sy.intro)) + '</p><div class="es-steps">';
      sy.steps.forEach(function (st, i) {
        h += '<div class="es-step"><span class="n">' + (i + 1) + '</span>' +
          '<span><b>' + esc(L(st.t)) + '</b><span>' + esc(L(st.d)) + '</span></span></div>';
      });
      h += '</div>';
      if (sy.quota) {
        h += '<div class="es-quota"><div class="eq-l">' + esc(tr('engQuota')) + '</div>';
        sy.quota.forEach(function (q) {
          h += '<div class="eq-row"><span>' + esc(L(q.t)) + '</span><b>' + esc(L(q.d)) + '</b></div>';
        });
        h += '</div>';
      }
      h += '</div>';
    });

    /* --- natija jadvali --- */
    h += sectionHead(5, tr('engScoreboard'), L(ENGLISH.scoreboard.note));
    h += scoreTable();

    /* --- qoidalar --- */
    h += sectionHead(6, tr('engRules'), '');
    h += '<div class="eng-rules">';
    ENGLISH.rules.forEach(function (r, i) {
      h += '<div class="er-row"><span class="er-n">' + (i + 1) + '</span><span>' + esc(L(r)) + '</span></div>';
    });
    h += '</div>';

    /* --- yakuniy maqsad --- */
    h += sectionHead(7, tr('engTargetT'), '');
    h += '<div class="eng-target">';
    ENGLISH.target.forEach(function (t) {
      var s = Eng.skill(t.skill);
      h += '<div class="et-row"><span class="et-ic">' + IC[s.icon] + '</span>' +
        '<span class="et-n">' + esc(L(s.name)) + '</span>' +
        '<span class="et-d">' + esc(L(t.d)) + '</span>' +
        '<span class="et-b' + (t.band ? '' : ' muted') + '">' + esc(t.band || '—') + '</span></div>';
    });
    h += '</div>';

    h += '<div class="callout good"><span class="co-ic">' + IC.spark + '</span>' +
      '<div><h4>' + esc(tr('engTargetT')) + '</h4>' + esc(L(m.mindset)) + '</div></div>';

    return h + '</div>';
  };

  /* Bitta haftaning kunlar ro'yxati */
  function weekBlock(w, cur) {
    var days = daysOfWeek(w);
    var meta = Eng.weekMeta(w);
    var r = EngCal.weekRange(w);
    var doneN = days.filter(function (x) { return Store.engDayDone(x.d); }).length;
    var total = w === 0 ? days.length : 7;

    var h = '<div class="eng-week' + (doneN === total && total ? ' done' : '') + '">' +
      '<div class="ew-head">' +
        '<span class="ew-n">' + (w === 0 ? IC.spark : w) + '</span>' +
        '<span class="ew-t"><b>' + esc(meta ? L(meta.title) : tr('engWeek') + ' ' + w) + '</b>' +
        '<span>' + esc(fmt(r.from) + ' – ' + fmt(r.to)) + '</span></span>' +
        '<span class="ew-c">' + doneN + '/' + total + '</span>' +
      '</div>';

    if (!days.length) {
      h += '<div class="ew-soon">' + esc(tr('engSoon')) + '</div></div>';
      return h;
    }

    /* Python kursidagi kabi kun kartochkalari to'ri */
    h += '<div class="day-grid">';
    days.forEach(function (day) { h += engDayCard(day, cur); });
    h += '</div></div>';
    return h;
  }

  /* Bitta kun kartochkasi — Python kursidagi kun kartasi bilan bir xil qolip:
     KUN N · yorliq · sarlavha · davomiylik. Ikkala kurs bir xil ko'rinsin. */
  function engDayCard(day, cur) {
    var done = Store.engDayDone(day.d);
    var isCur = cur === day.d;
    var type = dayType(day.d);
    var td = Store.engTasksDone(day.d), tt = (day.practice || []).length;
    var g = day.gram ? Eng.grammar(day.gram) : null;
    var mins = engMinutes(day);

    var tag = day.mock ? '<span class="tag review">' + esc(tr('engMockTag')) + '</span>'
      : day.review ? '<span class="tag review">' + esc(tr('engReviewTag')) + '</span>'
      : '<span class="tag topic">' + esc(tr('topicTag')) + '</span>';

    return '<button class="day-card' + (done ? ' done' : '') + (isCur ? ' on' : '') + '" ' +
      'data-go="english/' + day.d + '">' +
      '<span class="dc-top"><span class="dc-n">' + esc(day.isIntro ? tr('engIntroN', { n: day.i }) : tr('day') + ' ' + day.d) + '</span>' +
        (done ? '<span class="wc-badge done">' + td + '/' + tt + '</span>' : tag) + '</span>' +
      '<span class="dc-t">' + esc(L(day.title)) + '</span>' +
      '<span class="dc-meta">' +
        IC.clock.replace('<svg', '<svg style="width:12px;height:12px;display:inline;vertical-align:-2px"') +
        ' ' + mins + ' ' + esc(tr('minutes')) +
        ' · <span class="ed-type ' + type + '">' + esc(tr('engType_' + type)) + '</span>' +
      '</span>' +
      (g ? '<span class="dc-sub">' + esc(L(g.name)) + '</span>' : '') +
      /* Oltala ko'nikma har kunda bor — kartochkada nuqta bilan ko'rsatiladi */
      '<span class="dc-skills">' + ENG_SKILLS.order.map(function (k) {
        var s = Eng.skill(k);
        return '<i class="ds k-' + k + '" title="' + esc(L(s.name)) + '">' + IC[s.icon] + '</i>';
      }).join('') + '</span>' +
      '<span class="dc-bar"><i style="width:' + (tt ? td / tt * 100 : 0) + '%"></i></span>' +
      '</button>';
  }

  /* Kunning taxminiy davomiyligi — bo'lim, vazifa va cheatsheet hajmidan */
  function engMinutes(day) {
    var m = 10;
    m += (day.sections || []).length * 8;
    m += (day.practice || []).length * 6;
    if (day.gram) m += 10;
    if (day.vocab) m += 10;
    if (day.quiz) m += 12;
    if (day.mock) m += 60;
    return Math.round(m / 5) * 5;
  }

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div>' +
      '<h2>' + esc(title) + '</h2>' +
      (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }

  function calCell(icon, label, value, note) {
    return '<div class="ec-cell"><span class="ec-i">' + icon + '</span>' +
      '<span class="ec-l">' + esc(label) + '</span>' +
      '<span class="ec-v">' + esc(value) + '</span>' +
      (note ? '<span class="ec-n">' + esc(note) + '</span>' : '') + '</div>';
  }

  function certCard() {
    var ready = Eng.certReady();
    var left = (ENG_DAYS.length || ENGLISH.meta.days) - Store.engDoneCount();
    return '<div class="eng-cert' + (ready ? ' ready' : '') + '">' +
      '<div class="ez-ic">' + IC.medal + '</div>' +
      '<div class="ez-b"><h3>' + esc(tr('engCertT')) + '</h3>' +
        '<p>' + esc(ready ? tr('engCertReady') : tr('engCertLeft', { n: left })) + '</p>' +
        '<p class="ez-note">' + esc(tr('engCertNote')) + '</p></div>' +
      (ready ? '<button class="btn btn-primary" data-engcert="1">' + IC.medal + esc(tr('engCertReady')) + '</button>'
             : '<span class="ez-lock">' + IC.lock + '</span>') +
      '</div>';
  }

  function scoreTable() {
    var list = Store.engScoreList();
    var h = '<div class="card"><div class="eng-score-head">';
    ENGLISH.scoreboard.bands.forEach(function (b) { h += '<span>' + esc(L(b.name)) + '</span>'; });
    h += '<span>' + esc(tr('engOverall')) + '</span></div>';
    if (!list.length) {
      h += '<div style="padding:18px 0;color:var(--muted);font-size:14px">' + esc(tr('engNoScores')) + '</div>';
    } else {
      list.forEach(function (r) {
        var ov = Store.engOverall(r);
        h += '<div class="eng-score-row"><span class="esr-w">' + esc(tr('day')) + ' ' + r.day + '</span>' +
          '<span>' + fmtBand(r.l) + '</span><span>' + fmtBand(r.r) + '</span>' +
          '<span>' + fmtBand(r.w) + '</span><span>' + fmtBand(r.s) + '</span>' +
          '<b>' + (ov !== null ? ov.toFixed(1) : '—') + '</b></div>';
      });
    }
    h += '<div class="es-extra"><div class="eq-l">' + esc(tr('engScoreboard')) + '</div>';
    ENGLISH.scoreboard.extra.forEach(function (e) { h += '<span class="es-tag">' + esc(L(e)) + '</span>'; });
    return h + '</div></div>';
  }
  function fmtBand(v) { return (typeof v === 'number' && !isNaN(v)) ? v.toFixed(1) : '—'; }

  /* ====================== KUN SAHIFASI ================================= */

  window.PageEnglishDay = function (d) {
    var day = dayOf(d);
    if (!day) return notReady(d);

    var w = day.w;
    var meta = Eng.weekMeta(w);
    var type = dayType(d);
    var key = dayKey(d);
    var done = Store.engDayDone(d);
    var td = Store.engTasksDone(d), tt = (day.practice || []).length;
    var isCur = currentDay() === d || (day.isIntro && key === Store.dateKey());
    var label = day.isIntro ? tr('engIntroN', { n: day.i }) : tr('day') + ' ' + d;

    var h = '<div class="page stagger">';

    /* --- sarlavha --- */
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(w === 0 ? tr('engIntroBlock') + ' · ' + tr('engIntroNotCounted') : (tr('engWeek') + ' ' + w + ' — ' + (meta ? L(meta.title) : ''))) + '</div>' +
      '<h1>' + esc(L(day.title)) + '</h1>' +
      '<div class="lesson-meta">' +
        (window.bookmarkBtn ? bookmarkBtn('eng:' + day.d, 'english/' + day.d, label + ' · ' + L(day.title), 'english') : '') +
        (window.Copybook && Copybook.fromBtn ? Copybook.fromBtn('english', 'english/' + day.d, label + ' · ' + L(day.title), { title: L(day.title), type: 'idea' }) : '') +
        '<span class="chip ' + (day.mock ? 'review' : day.review ? 'review' : 'topic') + '">' +
          esc(day.mock ? tr('engMockTag') : day.review ? tr('engReviewTag') : tr('engType_' + type)) + '</span>' +
        '<span>' + esc(day.isIntro ? label + ' / ' + ENG_INTRO.length : tr('day') + ' ' + d + ' / ' + ENGLISH.meta.days) + '</span>' +
        '<span>·</span><span>' + esc(fmt(key)) + '</span>' +
        (type === 'class' ? '<span class="chip lc">' + esc(ENGLISH.meta.classPlace) + ' ' + esc(ENGLISH.meta.classTime) + '</span>' : '') +
        (isCur ? '<span class="chip done">' + esc(tr('engNow')) + '</span>' : '') +
        (done ? '<span class="chip done">✓</span>' : '') +
      '</div></header>';

    /* --- tez o'tish --- */
    var links = [['#l-intro', tr('tocIntro')], ['#l-skills', tr('engSixT')], ['#l-lesson', tr('tocLesson')]];
    if (day.gram) links.push(['#l-gram', tr('engGrammarSheet')]);
    if (day.vocab) links.push(['#l-vocab', tr('engVocabSheet')]);
    links.push(['#l-practice', tr('engTasksLabel')]);
    links.push(['#l-note', tr('tocNote')]);
    if (day.quiz) links.push(['#l-quiz', tr('tocQuiz')]);
    h += '<nav class="lesson-toc no-print">' + links.map(function (l) {
      return '<a href="' + l[0] + '">' + esc(l[1]) + '</a>';
    }).join('') + '</nav>';

    /* --- kirish --- */
    h += '<div class="intro-block" id="l-intro">' + inlineCode(L(day.intro)) + '</div>';

    /* --- olti ko'nikma: bugungi ish --- */
    h += skillsBlock(day);

    /* --- nazariy bo'limlar --- */
    h += '<div id="l-lesson">';
    (day.sections || []).forEach(function (sec, i) {
      h += '<div class="card"><h3 class="card-title"><span class="num">' + (i + 1) + '</span>' + esc(L(sec.h)) + '</h3>' +
        '<p>' + inlineCode(L(sec.p)) + '</p>';
      if (sec.ex && sec.ex.length) {
        h += '<div class="eng-ex-block">';
        sec.ex.forEach(function (e) { h += '<div class="ex-line">' + inlineCode(e) + '</div>'; });
        h += '</div>';
      }
      h += '</div>';
    });
    h += '</div>';

    /* --- grammatika cheatsheet'i --- */
    if (day.gram) {
      h += '<div id="l-gram">' + engGrammarCard(day.gram) + '</div>';
    }

    /* --- lug'at to'plami --- */
    if (day.vocab) {
      h += '<div id="l-vocab">' + engVocabCard(day.vocab) + '</div>';
    }

    /* --- konspekt --- */
    if (day.konspekt) {
      h += '<div class="konspekt"><div class="k-label">' + IC.pen + esc(tr('konspekt')) + '</div><ul>';
      (L(day.konspekt) || []).forEach(function (item) { h += '<li>' + inlineCode(item) + '</li>'; });
      h += '</ul></div>';
    }

    /* --- vazifalar --- */
    h += '<div class="card eng-tasks" id="l-practice"><div class="et-head">' +
      '<h3 class="card-title" style="margin:0"><span class="num gold">' + IC.checklist + '</span>' + esc(tr('engTasksLabel')) + '</h3>' +
      '<span class="et-c">' + td + ' / ' + tt + '</span></div>' +
      '<div class="bar" style="margin:10px 0 16px"><i style="width:' + (tt ? td / tt * 100 : 0) + '%"></i></div>';
    (day.practice || []).forEach(function (t, i) {
      var on = Store.engTask(d, i);
      h += '<button class="eng-task' + (on ? ' on' : '') + '" data-engtask="' + d + ':' + i + '" ' +
        'role="checkbox" aria-checked="' + on + '">' +
        '<span class="tk-box">' + (on ? IC.check : '') + '</span>' +
        '<span class="tk-t">' + inlineCode(L(t)) + '</span></button>';
    });
    h += '<div style="margin-top:16px">' +
      '<button class="btn ' + (done ? 'btn-quiet' : 'btn-primary') + ' btn-sm" data-engday="' + d + '">' +
      (done ? esc(tr('engMarkUndone')) : IC.check + esc(tr('engMarkDone'))) + '</button></div></div>';

    /* --- mock ballari --- */
    if (day.mock) h += scoreForm(d);

    /* --- eslatma --- */
    var n = Store.engNote(d);
    h += '<div class="card note-editor no-print" id="l-note">' +
      '<div class="ne-head"><h3 class="card-title" style="margin:0"><span class="num gold">' + IC.pen + '</span>' +
        esc(tr('lessonNote')) + '</h3>' +
        '<span class="ne-status" id="engNoteStatus">' + (n ? esc(tr('saved') + ' · ' + fmtDate(n.at)) : '') + '</span></div>' +
      '<textarea class="textarea" id="engNoteBox" placeholder="' + esc(tr('lessonNotePh')) + '">' +
        esc(n ? n.text : '') + '</textarea></div>';

    /* --- haftalik test --- */
    if (day.quiz && day.quiz.length) {
      if (day.quizGenerated) {
        h += '<div class="callout tip" style="margin-top:16px"><span class="co-ic">' + IC.spark + '</span><div><h4>' + esc(tr('engQuizGenT')) + '</h4>' +
          esc(tr('engQuizGenD', { w: day.w, lvl: tr('engLvl_' + day.quizLevel) })) + '</div></div>';
      }
      h += EngQuiz.render(day);
    }
    if (window.learnLoop) h += learnLoop('eng', day.d, L(day.title));

    /* --- navigatsiya (kirish darslari → 1-kun zanjiri) --- */
    var prevK = Eng.prevKey(d), nextK = Eng.nextKey(d);
    var lbl = function (k) { var x = dayOf(k); return (x.isIntro ? tr('engIntroN', { n: x.i }) : tr('day') + ' ' + k) + ' · ' + L(x.title); };
    h += '<div class="lesson-nav no-print">';
    h += prevK !== null && dayOf(prevK)
      ? '<button class="btn btn-ghost" data-go="english/' + prevK + '">' + IC.arrowL + esc(lbl(prevK)) + '</button>'
      : '<button class="btn btn-ghost" data-go="english">' + IC.arrowL + esc(tr('english')) + '</button>';
    h += nextK !== null && dayOf(nextK)
      ? '<button class="btn btn-ghost" data-go="english/' + nextK + '">' + esc(lbl(nextK)) + IC.arrowR + '</button>'
      : '<button class="btn btn-primary" data-go="english">' + esc(tr('english')) + IC.arrowR + '</button>';
    h += '</div>';

    return h + '</div>';
  };

  /* Kontent hali yozilmagan kun */
  function notReady(d) {
    var m = ENGLISH.meta;
    if (isIntroKey(d) || d < 1 || d > m.days) {
      return '<div class="page empty"><h3>404</h3><p>' + esc(tr('day') + ' ' + d) + '</p>' +
        '<button class="btn btn-primary" style="margin-top:18px" data-go="english">' + esc(tr('english')) + '</button></div>';
    }
    return '<div class="page empty"><div class="em-ic">' + IC.clock + '</div>' +
      '<h3>' + esc(tr('engSoonT')) + '</h3>' +
      '<p>' + esc(tr('engSoonP', { n: d, ready: ENG_DAYS.length })) + '</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" data-go="english/' + Eng.lastReadyDay() + '">' + esc(tr('engGoLastReady')) + IC.arrowR + '</button>' +
      '<button class="btn btn-ghost" data-go="eng-grammar">' + esc(tr('engGrammarSheet')) + '</button>' +
      '</div></div>';
  }

  function scoreForm(d) {
    var cur = Store.engScore(d) || {};
    var h = '<div class="card eng-scoreform"><h3 class="card-title"><span class="num gold">' + IC.medal + '</span>' +
      esc(tr('engBands')) + '</h3>' +
      '<p style="font-size:13.5px;color:var(--muted)">' + esc(tr('engScoreHint')) + '</p><div class="esf-grid">';
    ENGLISH.scoreboard.bands.forEach(function (b) {
      var v = cur[b.key];
      h += '<div class="field"><label for="band_' + b.key + '">' + esc(L(b.name)) + '</label>' +
        '<input class="input" id="band_' + b.key + '" type="number" min="0" max="9" step="0.5" ' +
        'inputmode="decimal" value="' + (typeof v === 'number' ? v : '') + '"></div>';
    });
    h += '</div><div class="esf-foot">' +
      '<button class="btn btn-primary btn-sm" id="saveBands" data-day="' + d + '">' + IC.check + esc(tr('engSaveScore')) + '</button>' +
      '<span class="esf-ov" id="bandOverall">' + esc(tr('engOverall')) + ': <b>' +
        (Store.engOverall(cur) !== null ? Store.engOverall(cur).toFixed(1) : '—') + '</b></span>' +
      '</div></div>';
    return h;
  }

  window.PageEnglishDay.mount = function (d) {
    var day = dayOf(d);
    if (!day) return;

    if (day.quiz && day.quiz.length) EngQuiz.mount(day);

    /* Eslatmani avtomatik saqlash */
    var box = $('#engNoteBox');
    if (box) {
      var timer = null;
      box.addEventListener('input', function () {
        clearTimeout(timer);
        var st = $('#engNoteStatus');
        if (st) st.textContent = '…';
        timer = setTimeout(function () {
          Store.engSetNote(d, box.value);
          if (st) st.textContent = box.value.trim() ? tr('saved') : '';
        }, 600);
      });
    }

    /* Mock ball formasi */
    var btn = $('#saveBands');
    if (!btn) return;
    function read() {
      var o = {};
      ENGLISH.scoreboard.bands.forEach(function (b) {
        var el = $('#band_' + b.key);
        var v = el && el.value !== '' ? Number(el.value) : NaN;
        o[b.key] = (isNaN(v) || v < 0 || v > 9) ? NaN : v;
      });
      return o;
    }
    ENGLISH.scoreboard.bands.forEach(function (b) {
      var el = $('#band_' + b.key);
      if (!el) return;
      el.addEventListener('input', function () {
        var ov = Store.engOverall(read());
        $('#bandOverall').innerHTML = esc(tr('engOverall')) + ': <b>' + (ov !== null ? ov.toFixed(1) : '—') + '</b>';
      });
    });
    btn.addEventListener('click', function () {
      var o = read(), ov = Store.engOverall(o);
      if (ov === null) { toast(tr('engScoreHint'), 'warn'); return; }
      Store.engSetScore(Number(btn.dataset.day), o);
      toast(tr('engScoreSaved') + ' · ' + tr('engOverall') + ' ' + ov.toFixed(1), 'ok');
      App.refreshChrome();
    });
  };

  /* ====================== HAFTALIK TEST ================================
     Python kursidagi Quiz moduli Store.recordScore va addMistake ga yozadi —
     ular Python kunlariga tegishli. Shuning uchun ingliz tili uchun alohida,
     yengil test: variantlar aralashtiriladi, natija ko'rsatiladi, lekin
     Python progressiga tegmaydi.                                          */
  var EngQuiz = {
    picked: {}, locked: false,

    render: function (day) {
      EngQuiz.picked = {}; EngQuiz.locked = false;
      var total = day.quiz.length;
      var h = '<section class="quiz" id="l-quiz">' +
        '<div class="quiz-head"><h3><span class="q-ic">' + IC.spark + '</span>' + esc(tr('quiz')) + '</h3>' +
        '<span class="q-count">' + total + ' ' + esc(tr('questions')) + '</span></div>' +
        '<p class="quiz-sub">' + esc(tr('engQuizSub')) + '</p>';

      day.quiz.forEach(function (q, qi) {
        var order = Store.setting('shuffle') ? shuffledIndexes(q.opts.length) : q.opts.map(function (_, i) { return i; });
        h += '<div class="q-block" id="eqb' + qi + '">' +
          '<div class="q-text"><span class="q-n">' + (qi + 1) + '</span>' + inlineCode(q.q) + '</div>';
        order.forEach(function (orig, disp) {
          h += '<button type="button" class="opt" id="eo' + qi + '_' + orig + '" data-eq="' + qi + '" data-eo="' + orig + '">' +
            '<span class="mk">' + String.fromCharCode(65 + disp) + '</span>' +
            '<span>' + esc(q.opts[orig]) + '</span></button>';
        });
        // "Nega shunday" — javob tekshirilgandan keyin ochiladi (generator savollarida ham bor)
        if (q.why) h += '<div class="q-why" id="ewhy' + qi + '"><span class="w-ic">' + IC.bulb + '</span><div>' + inlineCode(L(q.why)) + '</div></div>';
        h += '</div>';
      });

      h += '<div class="quiz-actions">' +
        '<button class="btn btn-primary" id="engCheck" disabled>' + IC.check + esc(tr('check')) + '</button>' +
        '<span class="counter" id="engCounter">0 / ' + total + '</span></div>' +
        '<div class="result" id="engResult"><div class="score" id="engScore"></div>' +
        '<div><h4 id="engResT"></h4><p id="engResM"></p></div></div><div id="engSummary"></div></section>';
      return h;
    },

    mount: function (day) {
      var box = $('#l-quiz');
      if (!box) return;
      box.addEventListener('click', function (e) {
        var opt = e.target.closest ? e.target.closest('.opt') : null;
        if (opt && !EngQuiz.locked) { EngQuiz.pick(day, Number(opt.dataset.eq), Number(opt.dataset.eo)); return; }
        var b = e.target.closest ? e.target.closest('#engCheck') : null;
        if (b && !b.disabled) EngQuiz.check(day);
      });
    },

    pick: function (day, qi, oi) {
      EngQuiz.picked[qi] = oi;
      $('#eqb' + qi).classList.add('answered');
      $$('#eqb' + qi + ' .opt').forEach(function (el) {
        el.classList.toggle('sel', Number(el.dataset.eo) === oi);
      });
      var n = Object.keys(EngQuiz.picked).length;
      $('#engCounter').textContent = n + ' / ' + day.quiz.length;
      $('#engCheck').disabled = n < day.quiz.length;
    },

    check: function (day) {
      EngQuiz.locked = true;
      var correct = 0;
      day.quiz.forEach(function (q, qi) {
        $$('#eqb' + qi + ' .opt').forEach(function (el) { el.classList.add('locked'); });
        var chosen = EngQuiz.picked[qi];
        var chosenEl = $('#eo' + qi + '_' + chosen), rightEl = $('#eo' + qi + '_' + q.correct);
        if (chosen === q.correct) { correct++; if (chosenEl) chosenEl.classList.add('correct'); }
        else {
          if (chosenEl) chosenEl.classList.add('wrong');
          if (rightEl) rightEl.classList.add('correct');
          $('#eqb' + qi).classList.add('was-wrong');
          /* Xato banki + takror navbati */
          Store.addMistake2('english', day.d + ':' + qi, { q: q.q, chosen: q.opts[chosen], correct: q.opts[q.correct], topic: L(day.title), route: 'english/' + day.d });
          if (window.Review) Review.add('mistake', 'english:' + day.d + ':' + qi, { cat: 'english' });
        }
      });
      $$('.q-why[id^="ewhy"]').forEach(function (el) { el.classList.add('show'); });
      $('#engCheck').style.display = 'none';
      var pass = correct >= Math.ceil(day.quiz.length * 0.7);
      Store.quizSet('eng:' + day.d, correct, day.quiz.length);
      App.refreshChrome();
      var res = $('#engResult');
      res.className = 'result show ' + (pass ? 'pass' : 'fail');
      $('#engScore').textContent = correct + '/' + day.quiz.length;
      $('#engResT').textContent = pass ? tr('passT') : tr('failT');
      $('#engResM').textContent = pass ? tr('engQuizPass') : tr('engQuizFail');
      if (window.quizBreakdown) $('#engSummary').innerHTML = quizBreakdown(day.quiz.map(function (q, qi) { return { q: q.q, ok: EngQuiz.picked[qi] === q.correct }; }));
      res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  /* ====================== CHEATSHEET SAHIFALARI ======================== */

  window.PageEngGrammar = function () {
    var groups = [
      ['tenses', tr('engGrpTenses')],
      ['structure', tr('engGrpStructure')],
      ['verbs', tr('engGrpVerbs')],
      ['noun', tr('engGrpNoun')],
      ['style', tr('engGrpStyle')]
    ];
    var h = '<div class="page">' +
      '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('engKick')) + '</div>' +
      '<h1>' + esc(tr('engGrammarSheet')) + '</h1>' +
      '<p class="lede">' + esc(tr('engGrammarLede')) + '</p>' +
      '<button class="btn btn-primary no-print" style="margin-top:16px" id="printEng">' +
        IC.download + esc(tr('print')) + '</button></header>';

    groups.forEach(function (g) {
      var keys = Object.keys(ENG_GRAMMAR).filter(function (k) { return ENG_GRAMMAR[k].group === g[0]; });
      if (!keys.length) return;
      h += '<div class="cs-unit">' + esc(g[1]) + ' · ' + keys.length + '</div>';
      keys.forEach(function (k) { h += engGrammarCard(k); });
    });
    return h + '</div>';
  };
  window.PageEngGrammar.mount = function () {
    var b = $('#printEng');
    if (b) b.addEventListener('click', function () { window.print(); });
  };

  window.PageEngVocab = function () {
    var h = '<div class="page">' +
      '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('engKick')) + '</div>' +
      '<h1>' + esc(tr('engVocabSheet')) + '</h1>' +
      '<p class="lede">' + esc(tr('engVocabLede')) + '</p>' +
      '<button class="btn btn-primary no-print" style="margin-top:16px" id="printEng">' +
        IC.download + esc(tr('print')) + '</button></header>';
    Object.keys(ENG_VOCAB).forEach(function (k) { h += engVocabCard(k); });
    return h + '</div>';
  };
  window.PageEngVocab.mount = window.PageEngGrammar.mount;
})();
