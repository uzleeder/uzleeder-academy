/* ==========================================================================
   HabitPlan — bir kunning aniq jadvalini yig'adi
   --------------------------------------------------------------------------
   Kirish:  sana ("YYYY-MM-DD")
   Chiqish: { type, prayer, blocks[], engDay, pyDay, speakDay, warnings[] }

   Bloklarning vaqti shablondagi anchordan (namoz vaqtidan) hisoblanadi va
   ketma-ket suriladi. Ikki segment ustma-ust tushib qolsa, keyingisi
   oldingisining oxiridan boshlanadi — jadvalda "18:00 dan 17:40 gacha"
   degan bema'nilik chiqmasligi uchun.

   Alohida holat: Everest LC 16:30–18:30 qat'iy. Sentabr-oktabrda Asr,
   oktabrdan fevralgacha Shom aynan shu oraliqqa tushadi. Bu vaziyat
   yashirilmaydi — ogohlantirish sifatida chiqariladi.
   ========================================================================== */
(function () {
  'use strict';

  function toDate(key) {
    var p = String(key).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function daysBetween(a, b) { return Math.round((toDate(b) - toDate(a)) / 86400000); }
  function hm(dec) {
    dec = ((dec % 24) + 24) % 24;
    var h = Math.floor(dec), m = Math.round((dec - h) * 60);
    if (m === 60) { m = 0; h = (h + 1) % 24; }
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  /* "HH:MM" → o'nlik soat, va aksincha */
  function parseHM(s) {
    var p = String(s).split(':');
    return Number(p[0]) + Number(p[1] || 0) / 60;
  }

  /* Foydalanuvchining namoz sozlamasi (shahar, mazhab, burchaklar) */
  function prayerCfg() {
    var s = (Store.setting('prayer') || {});
    var city = null;
    Prayer.CITIES.forEach(function (c) { if (c.key === s.city) city = c; });
    return {
      city: city ? city.name : Prayer.DEFAULTS.city,
      lat: city ? city.lat : Prayer.DEFAULTS.lat,
      lon: city ? city.lon : Prayer.DEFAULTS.lon,
      tz: city ? city.tz : Prayer.DEFAULTS.tz,
      fajr: s.fajr || Prayer.DEFAULTS.fajr,
      isha: s.isha || Prayer.DEFAULTS.isha,
      asr: s.asr || Prayer.DEFAULTS.asr
    };
  }

  /* Hisoblangan vaqtlar ustiga QO'LDA kiritilganlarini qo'yadi.
     Standart: Bomdod 05:20, Peshin 13:00 — jadvalning ikki ustuni.
     Qolgan uchtasi hisobda qoladi, chunki ular mavsum bilan 2 soatgacha
     suriladi va qotirib qo'yish yolg'on bo'lardi.                        */
  function resolveTimes(key) {
    var t = Prayer.times(key, prayerCfg());
    var manual = (Store.setting('prayer') || {}).manual || {};
    Prayer.ORDER.forEach(function (name) {
      var v = manual[name];
      if (!v) return;
      var dec = parseHM(v);
      var h = Math.floor(dec), m = Math.round((dec - h) * 60);
      t[name] = { h: h, m: m, dec: dec, str: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'), manual: true };
    });
    return t;
  }

  window.HabitPlan = {
    from: function () { return HABIT.meta.from; },
    to: function () { return HABIT.meta.to; },
    total: function () { return daysBetween(HABIT.meta.from, HABIT.meta.to) + 1; },
    daysBetween: daysBetween,
    hm: hm, parseHM: parseHM,
    cfg: prayerCfg,
    times: resolveTimes,

    /* Sana kurs oralig'idami */
    inRange: function (key) {
      var n = daysBetween(HABIT.meta.from, key);
      return n >= 0 && n < HabitPlan.total();
    },
    index: function (key) { return daysBetween(HABIT.meta.from, key) + 1; },
    keyOf: function (index) { return Store.shiftDays(HABIT.meta.from, index - 1); },

    /* Kun turi taqvimdan: yakshanba — dam, Se/Pa/Sha — LC, qolgani og'ir.
       (Sinov kunlari 17–19-sen bekor qilingan — jadval 20-sen dan.) */
    typeOf: function (key) {
      var dow = toDate(key).getDay();
      if (dow === 0) return 'rest';
      if (dow === 2 || dow === 4 || dow === 6) return 'class';
      return 'heavy';
    },

    /* Shu sanaga to'g'ri keladigan Python darsi raqami.
       Python HAR KUNI: 20-sen → 19-okt, 30 kun = 30 dars. Muddat qat'iy.
       Hammasi bir kunda — rasmiy start 20-sentabrda boshlanadi. */
    pyDayOf: function (key) {
      var start = HABIT.meta.official;
      var n = daysBetween(start, key) + 1;
      return (n >= 1 && n <= COURSE.length) ? n : 0;
    },
    pyDeadline: function () { return Store.shiftDays(HABIT.meta.official, COURSE.length - 1); },
    isTrial: function () { return false; },   // sinov kunlari yo'q
    /* Kirish darsi raqami (16-sen → i1 … 19-sen → i4) */
    introDayOf: function (key) { var n = daysBetween(ENGLISH.meta.orientation.from, key) + 1; return n >= 1 && n <= 4 ? n : 0; },

    /* Ingliz tili kuni — kurs boshlanishidan sanaladi */
    engDayOf: function (key) {
      /* Kalendar EngCal'da (kirish bloki + dushanbadan boshlanuvchi 20 hafta,
         orada bo'sh kunlar bo'lishi mumkin) — shu yerda takrorlamaymiz */
      if (window.EngCal) return EngCal.dayOfKey(key);
      var n = daysBetween(ENGLISH.meta.start, key) + 1;
      return (n >= 1 && n <= ENGLISH.meta.days) ? n : 0;
    },
    /* Kalendar kuni — kitob rejalari uchun (bo'sh kunlarda ham davom etadi) */
    calDayOf: function (key) {
      var n = daysBetween(ENGLISH.meta.start, key) + 1;
      return n >= 1 ? n : 0;
    },

    /* Speaking 30 kunlik trek — ingliz tili kursining birinchi 30 kuni (1-kun = 21-sen) */
    speakDayOf: function (key) {
      var n = HabitPlan.engDayOf(key);
      return (n >= 1 && n <= SPEAK30.meta.days) ? n : 0;
    },
    /* Ish (loyiha) davri: Sozlamalar → work {on, from, to}. Standart: 20-sen → 1-okt.
       Daqiqa endi sozlanmaydi — qat'iy 3 soat, bitta blok (HABIT.work).   */
    workCfg: function () {
      var w = Store.setting('work') || {};
      return { on: w.on !== false, from: w.from || '2026-09-20', to: w.to || '2026-10-01', min: (HABIT.work && HABIT.work.min) || 180 };
    },
    workOn: function (key) { var w = HabitPlan.workCfg(); return w.on && key >= w.from && key <= w.to; },

    /* ================= ASOSIY: bir kunning jadvali ==================== */
    forDate: function (key) {
      var type = HabitPlan.typeOf(key);
      var tpl = HABIT[type];
      var pr = resolveTimes(key);
      var engDay = HabitPlan.engDayOf(key);
      var pyDay = HabitPlan.pyDayOf(key);
      var speakDay = HabitPlan.speakDayOf(key);
      var warnings = [];

      /* --- 1) Jadval skeleti: qat'iy vaqtli bloklar --------------------
         Har blokning boshlanish soati shablonda yozilgan. Hech narsa
         surilmaydi — kun har doim 05:20 da boshlanib 21:45 da tugaydi.  */
      var blocks = [];
      var placed = {};        // shablon bloklarining oralig'i (namozni belgilash uchun)

      var calDay = HabitPlan.calDayOf(key);
      var writingOpen = !window.WRITING || key >= WRITING.meta.start;
      /* Ish kuni: kechqurungi bloklar HABIT.work[type] bo'yicha almashtiriladi —
         ISH bitta uzluksiz blok (og'ir/yakshanba 16:00–19:00, LC kuni LC dan keyin). */
      var work = HabitPlan.workOn(key) && HABIT.work && HABIT.work[type];
      var srcBlocks = work
        ? tpl.blocks.filter(function (b) { return work.drop.indexOf(b.id) < 0; }).concat(work.add)
        : tpl.blocks;
      srcBlocks.forEach(function (b) {
        /* Python kursi tugagan bo'lsa blokni tashlab ketmaymiz — kunda
           teshik qoladi. Shablondagi "after" varianti bilan almashtiramiz. */
        if ((b.kind === 'py' || b.kind === 'hw') && b.after === undefined && b.pyOnly && !pyDay) return;
        if (b.kind === 'py' && !pyDay && !b.after) return;
        /* Yakshanba: katta test birinchi (kickoff) yakshanbada yo'q; DataCamp bloki faqat bob rejalashtirilgan kunda */
        if (b.notFirst && key === HABIT.meta.official) return;
        if (b.firstOnly && key !== HABIT.meta.official) return;
        if (b.dcOnly && !(window.DataCamp && DataCamp.forDate(key))) return;
        /* noDc — dcOnly blokning juftligi: bob bor kuni tashlanadi, shunda slot bo'sh qolmaydi */
        if (b.noDc && window.DataCamp && DataCamp.forDate(key)) return;
        /* Writing kursi 1-oktabrdan — ungacha jadvalda Writing bloki YO'Q (o'rni erkin vaqt) */
        if (b.writing && !writingOpen) {
          b = { id: b.id, kind: 'rest', at: b.at, min: b.min, t: { uz: 'Erkin vaqt (Writing 1-okt dan)', en: 'Free time (Writing from 1 Oct)' } };
        }
        /* YouTube — har ikki kunda bir (juft kalendar kunlari) */
        if (b.everyOther && calDay % 2 !== 0) return;
        var alt = ((b.kind === 'py' || b.kind === 'hw') && !pyDay && b.after) ? b.after : null;

        var start = b.prayer ? (pr[b.prayer] ? pr[b.prayer].dec : null) : parseHM(b.at);
        if (start === null) return;
        var end = start + b.min / 60;
        var srcLink = alt ? alt.link : b.link;
        var introN = HabitPlan.introDayOf(key) || 4;
        var link = srcLink
          ? srcLink.replace('{engDay}', engDay || 1).replace('{pyDay}', pyDay || 1).replace('{introDay}', 'i' + introN)
          : null;
        if (srcLink && srcLink.indexOf('{engDay}') >= 0 && !engDay) link = null;

        var row = {
          id: b.id, kind: (alt ? alt.kind : b.kind), core: !!b.core, fixed: !!b.fixed,
          w: b.w || null,                      // yuk darajasi: hard | med | light (§8, §19)
          prayer: b.prayer || null,
          from: start, to: end, fromStr: hm(start), toStr: hm(end),
          min: b.min, t: (alt ? alt.t : b.t), note: (alt ? alt.note : b.note) || null, link: link,
          manual: b.prayer && pr[b.prayer] && pr[b.prayer].manual
        };
        /* Kitobdagi aniq joy — Listening va Reading bloklariga
           (foydalanuvchining anchor'idan davom etadi)                    */
        if (calDay && window.Books) {
          var title = (row.t && row.t.en) || '';
          if (/Listening/.test(title)) row.book = Books.listenLabel(calDay);
          else if (/Reading/.test(title)) row.book = Books.readingLabel(calDay);
          else if (/Vocabulary|lug'at/i.test(title) && Books.vocabTodayLabel) row.book = Books.vocabTodayLabel(calDay);
        }
        /* DataCamp: bugungi bob (trek jadvalidan) */
        if (b.kind === 'dc' && b.link === 'datacamp' && window.DataCamp) {
          var dcs = DataCamp.forDate(key);
          if (dcs) { row.book = dcs.label; row.link = 'datacamp/' + dcs.n; }
          else if (DataCamp.finished(key)) { row.book = L(DCPLAN.phases[1].title); row.link = 'plan'; }
        }
        /* Kunning filmi va YouTube kanali — ro'yxatdan navbat bilan */
        if (b.movie && HABIT.movies && HABIT.movies.length) row.book = HABIT.movies[(Math.max(1, calDay) - 1) % HABIT.movies.length];
        if (b.kind === 'yt' && HABIT.youtube && HABIT.youtube.length) row.book = HABIT.youtube[Math.floor(calDay / 2) % HABIT.youtube.length];
        blocks.push(row);
        placed[b.id] = row;
      });

      /* --- 1b) Ish kuni ogohlantirishi: LC kunida 3 soat sig'maydi ------ */
      if (work) {
        var wb = blocks.filter(function (b) { return b.kind === 'work'; })[0];
        if (wb && wb.min < HABIT.work.min) warnings.push({ work: true, text: {
          uz: 'Ish bloki ' + wb.fromStr + '–' + wb.toStr + ' (' + wb.min + ' daq): LC kunida 3 soat sig\'maydi — 21:20 uyqu himoyalangan. Kamomad ' + (HABIT.work.min - wb.min) + ' daq.',
          en: 'Work block ' + wb.fromStr + '–' + wb.toStr + ' (' + wb.min + ' min): three hours do not fit on an LC day — sleep at 21:20 is protected. Shortfall ' + (HABIT.work.min - wb.min) + ' min.'
        } });
      }

      /* --- 2) Qolgan namozlar: Asr, Shom, Xufton ------------------------
         Bular shablonda yo'q, chunki 164 kun ichida 2 soatgacha suriladi.
         O'z vaqtida qo'shiladi va qaysi blok ichiga tushgani belgilanadi. */
      ['asr', 'maghrib', 'isha'].forEach(function (name) {
        var p = pr[name];
        if (!p) return;
        blocks.push({
          id: 'p-' + name, kind: 'pray', core: false, prayer: name, injected: true,
          from: p.dec, to: p.dec + 20 / 60,
          fromStr: p.str, toStr: hm(p.dec + 20 / 60),
          min: 20, t: { uz: L(Prayer.NAMES[name]) + ' namozi', en: L(Prayer.NAMES[name]) + ' prayer' },
          note: null, link: null, manual: !!p.manual
        });
      });

      /* --- 3) Namoz qaysi blok ichiga tushdi ---------------------------
         Shom qishda dars vaqtida, sentabrda kechki ovqat vaqtida kiradi.
         Uni surib yozish yolg'on bo'lardi — o'z vaqtida qoldiramiz va
         ustidagi blokni ko'rsatamiz.                                     */
      var skeleton = blocks.filter(function (b) { return !b.injected; });
      blocks.forEach(function (b) {
        if (!b.injected) return;
        skeleton.forEach(function (s) {
          if (b.from >= s.from && b.from < s.to) {
            b.inside = true;
            b.insideOf = s.t;
            if (s.fixed) b.insideFixed = true;
          }
        });
      });

      blocks.sort(function (a, b) { return a.from - b.from || (a.injected ? 1 : -1); });

      /* LC darsi vaqtiga tushadigan namozlar — alohida ogohlantirish */
      if (type === 'class') {
        Prayer.inRange(pr, 16.5, 18.5).forEach(function (name) {
          warnings.push({
            prayer: name,
            time: pr[name].str,
            text: {
              uz: L(Prayer.NAMES[name]) + ' namozi (' + pr[name].str + ') Everest LC darsi vaqtiga tushadi. Darsdan oldin yoki tanaffusda o\'qib ol.',
              en: L(Prayer.NAMES[name]) + ' (' + pr[name].str + ') falls during the Everest LC class. Pray before class or in the break.'
            }
          });
        });
      }

      return {
        key: key, index: HabitPlan.index(key), type: type, tpl: tpl,
        dow: toDate(key).getDay(), prayer: pr,
        engDay: engDay, pyDay: pyDay, speakDay: speakDay,
        blocks: blocks, warnings: warnings,
        coreCount: blocks.filter(function (b) { return b.core; }).length
      };
    },

    /* ================= JADVAL VALIDATORI (dev) ==========================
       Har shablon (oddiy + ish kuni varianti) uchun: jami 1440 daqiqa,
       ustma-ust tushmaydi, dublikat yadro bloki yo'q, vaqt mumkin (0–24),
       yashirin to'qnashuv (blok ichida boshqa blok), haftalik ziddiyat
       (LC kuni LC bloksiz, yakshanbada LC). Console: HabitPlan.validate()  */
    /* ====================== JADVAL VALIDATORI ==========================
       15 qoida. Har variant (oddiy/ish kuni × birinchi/oddiy kun ×
       DataCamp bor/yo'q) alohida tekshiriladi.

       SHARTLI BLOKLAR: `firstOnly/notFirst` va `dcOnly/noDc` juftliklari
       bir-birini ISTISNO qiladi — ular bitta slotda tursa ham to'qnashuv
       EMAS. Validator variantni avval filtrlaydi, keyin vaqtni solishtiradi
       (spec §6, §10). Faqat bir variantda BIRGA chiqadigan bloklar
       to'qnashuv hisoblanadi.

       Chegaralar (LIMITS): og'ir kunda yakka ish OG'IR yuki ≤ 240 daq;
       bloklar ≤ 6; yadro bloki ≥ 45 daq; tushdan keyin ≤ 1 OG'IR blok.
       `fixed: true` — tashqi dars (LC): yakka ish yukiga kirmaydi.
       `shortOk: true` — ataylab qisqa blokka ruxsat (§9, 6-qoida istisnosi).

       Qaytaradi: { ok, errors[], findings[], report{} } — findings har biri
       { rule, day, actual, limit, msg }.                                 */
    LIMITS: { hardMax: 240, maxBlocks: 6, minCore: 45, pmHardMax: 1, dayMin: 1440 },

    validate: function () {
      var L = HabitPlan.LIMITS;
      var errors = [], findings = [], report = { variants: [], week: 0 };
      var hmToMin = function (str) { var p = String(str).split(':'); return Number(p[0]) * 60 + Number(p[1] || 0); };
      var FIXED = { fajr: hmToMin(HABIT.meta.dayStart || '05:20'), dhuhr: 13 * 60 };
      var KINDS = HABIT.kinds || {};
      var add = function (rule, day, msg, actual, limit) {
        findings.push({ rule: rule, day: day, msg: msg, actual: actual, limit: limit });
        errors.push(day + ' · ' + rule + ': ' + msg);
      };

      ['heavy', 'class', 'rest'].forEach(function (type) {
        [false, true].forEach(function (work) {
          var tpl = HABIT[type]; if (!tpl) { add('shablon', type, "shablon yo'q"); return; }
          var blocks = tpl.blocks;
          if (work) { var w = HABIT.work && HABIT.work[type]; if (!w) return; blocks = blocks.filter(function (b) { return w.drop.indexOf(b.id) < 0; }).concat(w.add); }
          var name = type + (work ? '+work' : '');

          /* 12-qoida: shartli bayroqlar mantiqan to'g'rimi */
          blocks.forEach(function (b) {
            if (b.firstOnly && b.notFirst) add('shartli', name, b.id + ': firstOnly va notFirst birga');
            if (b.dcOnly && b.noDc) add('shartli', name, b.id + ': dcOnly va noDc birga');
            /* 13/15-qoida: id va kind */
            if (!b.id) add('id', name, "blok id siz");
            if (b.kind && KINDS && Object.keys(KINDS).length && !KINDS[b.kind]) add('kind', name, b.id + ": noma'lum kind '" + b.kind + "'");
          });

          /* variantlar: birinchi kun / oddiy kun, DataCamp bor / yo'q */
          [{ first: true, dc: true }, { first: false, dc: false }, { first: false, dc: true }].forEach(function (v) {
            var vName = name + ' [' + (v.first ? 'first' : 'notFirst') + '/' + (v.dc ? 'dc' : 'noDc') + ']';
            var rows = blocks.filter(function (b) {
              if (b.firstOnly && !v.first) return false; if (b.notFirst && v.first) return false;
              if (b.dcOnly && !v.dc) return false; if (b.noDc && v.dc) return false; return true;
            }).map(function (b) {
              return { id: b.id, core: !!b.core, w: b.w, fixed: !!b.fixed, shortOk: !!b.shortOk,
                       at: b.prayer ? FIXED[b.prayer] : hmToMin(b.at), min: b.min };
            });

            /* 1-qoida: imkonsiz vaqt oralig'i */
            rows.forEach(function (r) {
              if (!(r.at >= 0 && r.at < 1440) || !(r.min > 0)) add('vaqt', vName, r.id + ": vaqt/davomiylik noto'g'ri", r.at + '/' + r.min);
            });

            /* 9-qoida: kun 1440 daqiqa */
            var sum = rows.reduce(function (a, r) { return a + r.min; }, 0);
            if (sum !== L.dayMin) add('kun uzunligi', vName, 'jami ' + sum + ' daq', sum, L.dayMin);

            rows.sort(function (a, b) { return a.at - b.at; });

            /* 10/14-qoida: dublikat id · 2/11-qoida: to'qnashuv va ichma-ich */
            var ids = {};
            rows.forEach(function (r, i) {
              if (ids[r.id]) add('dublikat id', vName, 'ikki marta: ' + r.id);
              ids[r.id] = 1;
              var n = rows[i + 1]; if (!n) return;
              var end = r.at + r.min;
              if (end > n.at) {
                var nested = end >= n.at + n.min;
                add(nested ? 'ichma-ich blok' : "to'qnashuv", vName,
                  r.id + ' (tugash ' + end + ') ' + n.id + ' (boshlanish ' + n.at + ')' + (r.core && n.core ? ' — IKKI YADRO' : ''),
                  end - n.at);
              }
              if (end < n.at) add('teshik', vName, r.id + ' va ' + n.id + ' orasida ' + (n.at - end) + ' daq', n.at - end);
            });

            var core = rows.filter(function (r) { return r.core; });
            var solo = core.filter(function (r) { return !r.fixed; });   // yakka ish (tashqi darssiz)

            /* 8-qoida: har yadro blokida `w` majburiy */
            core.forEach(function (r) {
              if (!r.w) add('w yo\'q', vName, r.id + ": yadro blokida yuk darajasi (w) ko'rsatilmagan");
              else if (['hard', 'med', 'light'].indexOf(r.w) < 0) add('w noto\'g\'ri', vName, r.id + ": w = '" + r.w + "'");
            });

            /* 6-qoida: yadro bloki ≥ 45 daq (shortOk istisno) */
            core.forEach(function (r) {
              if (r.min < L.minCore && !r.shortOk) add('qisqa blok', vName, r.id + ': ' + r.min + ' daq', r.min, L.minCore);
            });

            /* 5-qoida: yadro bloklari soni ≤ 6 */
            if (core.length > L.maxBlocks) add('blok soni', vName, core.length + ' ta yadro bloki', core.length, L.maxBlocks);

            /* 4-qoida: OG'IR yuk ≤ 240 daq (yakka ish; tashqi dars hisobga kirmaydi) */
            var hard = solo.filter(function (r) { return r.w === 'hard'; }).reduce(function (a, r) { return a + r.min; }, 0);
            if (hard > L.hardMax) add('OG\'IR yuk chegarasi', vName, hard + ' daq', hard, L.hardMax);

            /* 7-qoida: tushdan keyin ≤ 1 OG'IR blok (tashqi darssiz) */
            var pmHard = solo.filter(function (r) { return r.w === 'hard' && r.at >= 13 * 60; }).length;
            if (pmHard > L.pmHardMax) add('tushdan keyingi OG\'IR', vName, pmHard + ' ta blok', pmHard, L.pmHardMax);

            /* LC bloki faqat LC kunida */
            var hasLc = rows.some(function (r) { return r.id.indexOf('-lc') > 0; });
            if (type === 'class' && !hasLc) add('LC', vName, 'LC kuni LC bloksiz');
            if (type !== 'class' && hasLc) add('LC', vName, "LC bloki LC bo'lmagan kunda");

            var byW = function (k) { return core.filter(function (r) { return r.w === k; }).reduce(function (a, r) { return a + r.min; }, 0); };
            report.variants.push({
              name: vName, type: type, work: work, blocks: core.length, day: sum,
              core: core.reduce(function (a, r) { return a + r.min; }, 0),
              hard: byW('hard'), med: byW('med'), light: byW('light'),
              soloHard: hard, pmHard: pmHard,
              /* eng qisqa yadro bloki — ataylab qisqa (shortOk) bloklar hisobga kirmaydi */
              minBlock: (function () {
                var m = core.filter(function (r) { return !r.shortOk; }).map(function (r) { return r.min; });
                return m.length ? Math.min.apply(null, m) : 0;
              })()
            });
          });
        });
      });

      /* Haftalik yadro: 3 og'ir + 3 LC + 1 yakshanba (oddiy variant) */
      var plain = function (t) {
        var v = null;
        report.variants.forEach(function (x) { if (x.type === t && !x.work && /notFirst\/noDc/.test(x.name)) v = x; });
        return v ? v.core : 0;
      };
      report.week = plain('heavy') * 3 + plain('class') * 3 + plain('rest');
      report.weekParts = { heavy: plain('heavy'), class: plain('class'), rest: plain('rest') };

      /* Namoz bloklari (asr/shom/xufton) alohida qo'shiladi va blok ichiga tushadi — bu ustma-ust emas, belgilangan holat */
      return { ok: !errors.length, errors: errors, findings: findings, report: report };
    },

    /* Kunning yuk taqsimoti (§19): { hard, med, light, core, done } daqiqalarda.
       Talabaga ko'rsatiladi — "bugun qancha og'ir ish bor" degan savolga javob. */
    loadOf: function (plan) {
      var out = { hard: 0, med: 0, light: 0, core: 0, done: 0, fixed: 0 };
      (plan.blocks || []).forEach(function (b) {
        if (!b.core) return;
        out.core += b.min;
        if (b.fixed) out.fixed += b.min;
        if (b.w === 'hard') out.hard += b.min;
        else if (b.w === 'med') out.med += b.min;
        else if (b.w === 'light') out.light += b.min;
        if (Store.habitBlock(plan.key, b.id)) out.done += b.min;
      });
      return out;
    },

    /* Haftalik yuk (§18): sanadan boshlangan 7 kun. Ortiqcha yuklamani
       ko'rish uchun — ko'proq o'qishga undash uchun emas.                 */
    weekLoad: function (fromKey) {
      var sum = { hard: 0, med: 0, light: 0, core: 0, done: 0, fixed: 0, days: 0 };
      for (var i = 0; i < 7; i++) {
        var k = Store.shiftDays(fromKey, i);
        if (!HabitPlan.inRange(k)) continue;
        var l = HabitPlan.loadOf(HabitPlan.forDate(k));
        sum.hard += l.hard; sum.med += l.med; sum.light += l.light;
        sum.core += l.core; sum.done += l.done; sum.fixed += l.fixed; sum.days++;
      }
      return sum;
    },

    /* Kunning bajarilgan core bloklari soni */
    doneCount: function (plan) {
      var n = 0;
      plan.blocks.forEach(function (b) { if (b.core && Store.habitBlock(plan.key, b.id)) n++; });
      return n;
    },
    isDayDone: function (plan) {
      return plan.coreCount > 0 && HabitPlan.doneCount(plan) >= plan.coreCount;
    },
    /* Hozir yoki keyingi blok (dashboard uchun): joriy vaqt ichidagi blok,
       bo'lmasa undan keyingi birinchi; kun tugagan bo'lsa null.            */
    nextBlock: function (plan) {
      var d = new Date(), now = d.getHours() + d.getMinutes() / 60;
      var found = null;
      plan.blocks.forEach(function (b) {
        if (found || b.injected) return;
        if (b.to > now) found = b;
      });
      return found;
    },

    /* Namoz bloklari alohida sanaladi — intizomning ikkinchi o'lchovi */
    prayerDone: function (plan) {
      var n = 0, total = 0;
      plan.blocks.forEach(function (b) {
        if (b.kind !== 'pray') return;
        total++;
        if (Store.habitBlock(plan.key, b.id)) n++;
      });
      return { done: n, total: total };
    },

    /* Zanjir: bugundan (yoki kechadan) orqaga qarab uzluksiz bajarilgan kunlar */
    streak: function () {
      var today = Store.dateKey();
      if (!HabitPlan.inRange(today)) {
        // Kurs boshlanmagan yoki tugagan — oxirgi kundan sanaymiz
        var last = HABIT.meta.to;
        today = daysBetween(HABIT.meta.from, today) < 0 ? null : last;
        if (!today) return 0;
      }
      var cursor = HabitPlan.isDayDone(HabitPlan.forDate(today)) ? today : Store.shiftDays(today, -1);
      var n = 0;
      while (HabitPlan.inRange(cursor) && HabitPlan.isDayDone(HabitPlan.forDate(cursor))) {
        n++;
        cursor = Store.shiftDays(cursor, -1);
      }
      return n;
    },

    /* Umumiy statistika (progress halqasi va sahifa uchun) */
    stats: function () {
      var total = HabitPlan.total(), done = 0, prayers = 0, prayersTotal = 0;
      var map = Store.habitAll();
      Object.keys(map).forEach(function (key) {
        if (!HabitPlan.inRange(key)) return;
        var plan = HabitPlan.forDate(key);
        if (HabitPlan.isDayDone(plan)) done++;
        var p = HabitPlan.prayerDone(plan);
        prayers += p.done; prayersTotal += p.total;
      });
      return { total: total, done: done, prayers: prayers, prayersTotal: prayersTotal, streak: HabitPlan.streak() };
    }
  };
})();
