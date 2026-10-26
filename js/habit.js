/* ==========================================================================
   HabitPlan - bir kunning aniq jadvalini yig'adi
   --------------------------------------------------------------------------
   Kirish:  sana ("YYYY-MM-DD")
   Chiqish: { type, prayer, blocks[], bed, sleep, engDay, pyDay, warnings[] }

   Jadval QAT'IY SOATGA emas, NAMOZ VAQTLARIGA qurilgan (HABIT.meta izohi).
   Zanjir: har blok oldingisidan davom etadi; `anchor` namoz vaqtiga
   ko'chiradi, `flex` oradagi bo'shliqni yutadi, `flexTo: 'bed'` yotish
   vaqtigacha cho'ziladi. Uyqu 390 daqiqa - qayta uyqu va asosiy uyqu
   nisbati Bomdodga qarab o'zgaradi, jami o'zgarmaydi.

   Blok sig'masa YASHIRILMAYDI: ogohlantirish sifatida chiqariladi
   (warnings[].chain). Everest LC 16:30-18:30 qat'iy - Shom namozi dars
   vaqtiga tushadi va bu ham ogohlantirishda ko'rsatiladi.
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

    /* Kun turi taqvimdan (Uzlat & Ribat, 4 shablon):
         Yak            tiklanish  — yangi mavzu yo'q, haftalik hisobot
         Du, Ch         gibrid     — oshxona va ro'zg'or + podkast
         Se, Pa, Sha    lc         — Everest LC 16:30-18:30 + yo'l
         Ju             oddiy      — Uzlat master plan + juma namozi      */
    typeOf: function (key) {
      var dow = toDate(key).getDay();
      if (dow === 0) return 'tiklanish';
      if (dow === 1 || dow === 3) return 'gibrid';
      if (dow === 5) return 'oddiy';
      return 'lc';
    },
    /* Eski nomlar (heavy/class/rest) hali ham tushuniladi — tashqi
       sahifalar o'z kun turlarini shunday ataydi (books, english).      */
    LEGACY_TYPE: { heavy: 'oddiy', class: 'lc', rest: 'tiklanish', study: 'oddiy', test: 'tiklanish' },
    tplOf: function (type) { return HABIT[type] || HABIT[HabitPlan.LEGACY_TYPE[type]] || HABIT.oddiy; },

    /* Shu sanaga to'g'ri keladigan Python darsi raqami.
       Python HAR KUNI: 25-okt → 23-noy, 30 kun = 30 dars. Muddat qat'iy.
       Hammasi bir kunda — rasmiy start 25-oktabrda boshlanadi. */
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
      /* Kalendar EngCal'da (kirish bloki + dushanbadan boshlanuvchi 16 hafta,
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

    /* Speaking 30 kunlik trek — ingliz tili kursining birinchi 30 kuni (1-kun = 26-okt) */
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

    /* ================= ASOSIY: bir kunning jadvali ====================
       Zanjirli shablon (tpl.chain): blok vaqti hisoblanadi, qotirilmaydi.
         anchor  — blok shu namoz vaqtida boshlanadi (soft: vaqt o'tgan
                   bo'lsa joyida qoladi, orqaga sakramaydi)
         at      — qat'iy soat (faqat tashqi dars: Everest LC)
         flex    — davomiyligi keyingi anchorgacha bo'lgan bo'shliq,
                   oradagi qat'iy bloklar ayirilib
         flexTo  — 'bed' (yotish) yoki 'tahajjud' (kun yopilishi)
       Uyqu 390 daqiqa kafolatlangan: qayta uyqu Bomdodga qarab o'zgaradi,
       asosiy uyqu shunga qarab moslashadi, yotish vaqti suriladi.      */
    forDate: function (key) {
      var type = HabitPlan.typeOf(key);
      var tpl = HabitPlan.tplOf(type);
      var pr = resolveTimes(key);
      var engDay = HabitPlan.engDayOf(key);
      var pyDay = HabitPlan.pyDayOf(key);
      var speakDay = HabitPlan.speakDayOf(key);
      var calDay = HabitPlan.calDayOf(key);
      var dow = toDate(key).getDay();
      var warnings = [];

      var M = HABIT.meta;
      var TAH = parseHM(M.tahajjud || '02:00') * 60;        // daqiqa, kun boshi
      var JUZ = M.juz || 90;
      var SLEEP = M.sleepMin || 390;
      var DAY = 1440;
      var mins = function (name) { return pr[name] ? pr[name].dec * 60 : null; };

      /* --- Uyqu hisobi: qayta uyqu + asosiy uyqu = SLEEP (qat'iy) ----- */
      var tahEnd = TAH + 60 + JUZ;                          // Tahajjud bloki + 1-pora
      var reSleep = Math.max(0, (mins('fajr') || tahEnd) - tahEnd);
      var mainSleep = Math.max(0, SLEEP - reSleep);
      var bed = TAH + DAY - mainSleep;                       // yotish vaqti (daqiqa)

      /* --- Gibrid: 3-pora joyi mavsumga qarab ------------------------
         Shomdan keyin faqat kechqurun yetarli bo'lsa: 3-pora 90 +
         Xufton 20 + ovqat 35 + yadro 45 = 190 daqiqa.                  */
      var eveRoom = bed - ((mins('maghrib') || bed) + 15);
      var juzEvening = eveRoom >= JUZ + 20 + 35 + 45;

      /* --- Shablon bloklarini filtrlash ------------------------------ */
      var src = (tpl.blocks || []).filter(function (b) {
        if (b.when === 'juzEvening' && !juzEvening) return false;
        if (b.when === 'juzMorning' && juzEvening) return false;
        if (b.satOnly && dow !== 6) return false;
        if (b.sunOnly && dow !== 0) return false;
        return true;
      });

      /* --- Anchor vaqti: namoz, qat'iy soat yoki yotish --------------- */
      function anchorAt(b) {
        if (b.at) return parseHM(b.at) * 60;
        if (!b.anchor) return null;
        if (b.anchor === 'tahajjud') return TAH;
        return mins(b.anchor);
      }
      /* flex blokdan keyin, maqsad anchorgacha turgan qat'iy daqiqalar */
      function fixedAfter(i, stop) {
        var sum = 0;
        for (var j = i + 1; j < src.length; j++) {
          if (j === stop) break;
          var b = src[j];
          if (b.flex || b.flexTo) continue;
          sum += b.min || 0;
        }
        return sum;
      }
      function targetOf(i) {
        var b = src[i], j;
        if (b.untilBlock) {
          for (j = i + 1; j < src.length; j++) if (src[j].id === b.untilBlock) return { at: anchorAt(src[j]), stop: j };
          return null;
        }
        if (b.until) {
          for (j = i + 1; j < src.length; j++) if (src[j].anchor === b.until) return { at: anchorAt(src[j]), stop: j };
          var t = b.until === 'tahajjud' ? TAH + DAY : mins(b.until);
          return t === null ? null : { at: t, stop: src.length };
        }
        if (b.flexTo === 'bed') return { at: bed, stop: src.length };
        if (b.flexTo === 'tahajjud') return { at: TAH + DAY, stop: src.length };
        return null;
      }

      /* --- Zanjirni yurib chiqish ------------------------------------- */
      var chain = [], cur = TAH, introN = HabitPlan.introDayOf(key) || 4;
      /* Anchor oldinga sakrasa oradagi bo'shliq yashirilmaydi — ochiq
         "Dam" bloki qo'yiladi, shunda kun baribir aniq 1440 daqiqa. */
      function fill(upto, afterId) {
        var gap = Math.round(upto - cur);
        if (gap <= 0) return;
        chain.push({
          id: afterId + '-gap', kind: 'rest', core: false, fixed: false, w: null,
          prayer: null, from: cur / 60, to: upto / 60,
          fromStr: hm(cur / 60), toStr: hm(upto / 60), min: gap,
          t: { uz: 'Dam - ekransiz', en: 'Rest - no screens' }, note: null, link: null, gap: true
        });
        cur = upto;
      }
      src.forEach(function (b, i) {
        var min = b.min || 0, start = cur;
        var a = anchorAt(b);
        if (a !== null) {
          if (a >= cur) { fill(a, b.id); start = a; }
          else if (b.soft || b.at) start = cur;              // vaqt o'tgan — joyida qoladi
          else { start = cur; warnings.push({ chain: true, text: {
            uz: L(b.t) + ' bloki ' + hm(a / 60) + ' ga ulgurmadi — jadval ' + hm(cur / 60) + ' dan davom etadi.',
            en: L(b.t) + ' could not start at ' + hm(a / 60) + ' — the schedule continues from ' + hm(cur / 60) + '.'
          } }); }
        }
        if (b.flex || b.flexTo) {
          var t = targetOf(i);
          if (t && t.at !== null) {
            min = Math.round(t.at - start - fixedAfter(i, t.stop));
            if (min < 0) {
              warnings.push({ chain: true, tight: true, text: {
                uz: L(b.t) + ' bloki ' + (-min) + ' daqiqa sig\'madi — keyingi bloklar surildi.',
                en: L(b.t) + ' overflowed by ' + (-min) + ' minutes — the later blocks were pushed.'
              } });
              min = 0;
            }
          } else min = b.min || 0;
        }

        var link = b.link
          ? String(b.link).replace('{engDay}', engDay || 1).replace('{pyDay}', pyDay || 1).replace('{introDay}', 'i' + introN)
          : null;
        if (b.link && String(b.link).indexOf('{engDay}') >= 0 && !engDay) link = null;

        var row = {
          id: b.id, kind: b.kind, core: !!b.core, fixed: !!b.fixed,
          w: b.w || null, prayer: b.anchor && b.anchor !== 'tahajjud' ? b.anchor : null,
          tahajjud: b.anchor === 'tahajjud' || null,
          from: start / 60, to: (start + min) / 60,
          fromStr: hm(start / 60), toStr: hm((start + min) / 60),
          min: Math.round(min), shortOk: !!b.shortOk, longOk: !!b.longOk, t: b.t, note: b.note || null, link: link,
          manual: !!(b.anchor && pr[b.anchor] && pr[b.anchor].manual)
        };
        /* Kitobdagi aniq joy — Listening/Reading/lug'at bloklariga */
        if (calDay && window.Books) {
          var title = (b.t && b.t.en) || '';
          if (/Listening|Input/.test(title)) row.book = Books.listenLabel(calDay);
          else if (/Reading/.test(title)) row.book = Books.readingLabel(calDay);
          else if (/vocab/i.test(title) && Books.vocabTodayLabel) row.book = Books.vocabTodayLabel(calDay);
        }
        /* Qur'on: bugungi pora raqami (3 pora/kun, 1-kun = rasmiy start) */
        if (b.kind === 'quran') {
          var dayN = Math.max(1, daysBetween(M.official, key) + 1);
          var nth = b.id.indexOf('juz1') >= 0 ? 1 : b.id.indexOf('juz2') >= 0 ? 2 : 3;
          var juzNo = ((dayN - 1) * (M.juzPerDay || 3) + nth - 1) % 30 + 1;
          row.juz = juzNo;
          row.book = L({ uz: juzNo + '-pora', en: 'Juz ' + juzNo });
        }
        /* Tech bloki: bugungi dars yoki DataCamp bobi */
        if (b.kind === 'py' && window.DataCamp) {
          var dcs = DataCamp.forDate(key);
          if (dcs) row.book = dcs.label;
        }
        chain.push(row);
        cur = start + min;
      });

      /* --- Shablonda yo'q majburiy namozlar: o'z vaqtida qo'shiladi ---
         Asr/Shom/Xufton ba'zi shablonlarda alohida blok emas (LC kunida
         dars vaqtiga tushadi). Ularni surib yozish yolg'on bo'lardi.   */
      var anchored = {};
      chain.forEach(function (r) { if (r.prayer) anchored[r.prayer] = true; });
      var blocks = chain.slice();
      ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function (name) {
        if (anchored[name] || !pr[name]) return;
        blocks.push({
          id: 'p-' + name, kind: 'pray', core: false, prayer: name, injected: true,
          from: pr[name].dec, to: pr[name].dec + 20 / 60,
          fromStr: pr[name].str, toStr: hm(pr[name].dec + 20 / 60),
          min: 20, t: { uz: L(Prayer.NAMES[name]) + ' namozi', en: L(Prayer.NAMES[name]) + ' prayer' },
          note: null, link: null, manual: !!pr[name].manual
        });
      });

      /* --- Namoz qaysi blok ichiga tushdi ---------------------------- */
      blocks.forEach(function (b) {
        if (!b.injected) return;
        chain.forEach(function (s) {
          if (b.from >= s.from && b.from < s.to) {
            b.inside = true; b.insideOf = s.t;
            if (s.fixed) b.insideFixed = true;
          }
        });
      });
      blocks.sort(function (a, b) { return a.from - b.from || (a.injected ? 1 : -1); });

      /* --- Tashqi dars vaqtiga tushadigan namozlar ------------------- */
      if (type === 'lc') {
        Prayer.inRange(pr, 16.5, 18.5).forEach(function (name) {
          warnings.push({ prayer: name, time: pr[name].str, text: {
            uz: L(Prayer.NAMES[name]) + ' namozi (' + pr[name].str + ') Everest LC darsi vaqtiga tushadi. Darsdan oldin yoki tanaffusda o\'qib ol.',
            en: L(Prayer.NAMES[name]) + ' (' + pr[name].str + ') falls during the Everest LC class. Pray before the class or in the break.'
          } });
        });
      }

      return {
        key: key, index: HabitPlan.index(key), type: type, tpl: tpl,
        dow: dow, prayer: pr,
        engDay: engDay, pyDay: pyDay, speakDay: speakDay,
        bed: bed / 60, bedStr: hm(bed / 60),
        sleep: { total: SLEEP, main: mainSleep, re: reSleep },
        juzEvening: juzEvening,
        blocks: blocks, warnings: warnings,
        coreCount: blocks.filter(function (b) { return b.core; }).length
      };
    },

    /* ====================== JADVAL VALIDATORI ==========================
       Jadval endi QAT'IY emas — har kuni namoz vaqtlaridan hisoblanadi.
       Shuning uchun validator variantlarni emas, MARAFONNING HAR KUNINI
       tekshiradi (26-okt → 10-fev, 108 kun × 4 shablon). Bir kun uchun
       to'g'ri bo'lgan jadval boshqa mavsumda buzilishi mumkin — eski
       "bitta namunali kun" tekshiruvi aynan shuni ko'rmagan.

       16 qoida:
         1  kun aniq 1440 daqiqa
         2  manfiy davomiylikli blok yo'q
         3  bloklar ustma-ust tushmaydi va bo'shliq qoldirmaydi
         3b avtomatik yopilgan bo'shliq 30 daqiqadan oshmaydi
         4  uyqu = meta.sleepMin (qaylula hisobga kirmaydi)
         5  kuniga meta.juzPerDay pora × meta.juz daqiqa
         6  yadro bloklari ≤ maxBlocks
         7  yadro bloki ≥ minCore  (shortOk — ataylab istisno)
         8  yadro bloki ≤ maxCore  (bir o'tirishda 4 soatdan ko'p emas;
            `longOk` — uy ishi + passiv tinglash bloki uchun istisno)
         9  OG'IR yuk ≤ hardMax (tashqi dars kirmaydi)
         10 tushdan keyin OG'IR bloklar ≤ pmHardMax (shablon o'zgartirishi mumkin)
         11 har yadro blokida `w` bor (hard | med | light)
         12 dublikat blok id yo'q
         13 noma'lum `kind` yo'q
         14 `anchor` haqiqiy namoz nomi
         15 hech bir flex blok sig'may qolmadi (warnings.tight)
         16 Tahajjud kecha ichida va oxirgi uchdan birida

       Qaytaradi: { ok, errors[], findings[], report{} } — findings har biri
       { rule, day, actual, limit, msg }.                                 */
    LIMITS: { hardMax: 240, maxBlocks: 6, minCore: 45, maxCore: 240, pmHardMax: 1, dayMin: 1440 },

    validate: function (opts) {
      var LIM = HabitPlan.LIMITS, M = HABIT.meta;
      var o = opts || {};
      var from = o.from || M.from, to = o.to || M.to;
      var errors = [], findings = [], report = { days: 0, byType: {}, week: 0, weekParts: {}, tight: [] };
      var KINDS = HABIT.kinds || {};
      var PRAYERS = { fajr: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1, tahajjud: 1 };
      var add = function (rule, day, msg, actual, limit) {
        findings.push({ rule: rule, day: day, msg: msg, actual: actual, limit: limit });
        errors.push(day + ' · ' + rule + ': ' + msg);
      };

      /* --- 12/13/14: shablonning o'zi (sanadan qat'i nazar) ----------- */
      Object.keys(HABIT).forEach(function (k) {
        var tpl = HABIT[k];
        if (!tpl || !tpl.chain) return;
        var seen = {};
        tpl.blocks.forEach(function (b) {
          if (!b.id) add('id siz blok', k, 'blokda id yo\'q: ' + L(b.t || {}));
          else if (seen[b.id]) add('dublikat id', k, 'id ikki marta: ' + b.id);
          seen[b.id] = true;
          if (!KINDS[b.kind]) add('noma\'lum kind', k, b.id + ' → kind "' + b.kind + '" HABIT.kinds da yo\'q');
          if (b.anchor && !PRAYERS[b.anchor]) add('noto\'g\'ri anchor', k, b.id + ' → anchor "' + b.anchor + '"');
          if (b.until && !PRAYERS[b.until]) add('noto\'g\'ri until', k, b.id + ' → until "' + b.until + '"');
          if (b.core && !b.w) add('w yo\'q', k, b.id + ' yadro bloki, lekin yuk darajasi (w) berilmagan');
        });
      });

      /* --- 1..11, 15, 16: marafonning har kuni ----------------------- */
      var key = from, guard = 0;
      while (key <= to && guard++ < 400) {
        var p = HabitPlan.forDate(key);
        var tpl = p.tpl, tLim = (tpl && tpl.limits) || {};
        var own = p.blocks.filter(function (b) { return !b.injected; });
        var core = own.filter(function (b) { return b.core; });
        var day = own.reduce(function (s, b) { return s + b.min; }, 0);
        var st = report.byType[p.type] || (report.byType[p.type] = { n: 0, core: 0, hard: 0, min: 1e9, max: 0 });

        if (Math.round(day) !== LIM.dayMin) add('kun 1440 daqiqa', key, p.type + ': kun ' + Math.round(day) + ' daqiqa', Math.round(day), LIM.dayMin);
        own.forEach(function (b) {
          if (b.min < 0) add('manfiy blok', key, b.id + ' → ' + b.min + ' daqiqa', b.min, 0);
        });
        /* 3: zanjir uzluksizmi */
        for (var i = 1; i < own.length; i++) {
          var gap = Math.round((own[i].from - own[i - 1].to) * 60);
          if (gap !== 0) add('zanjir uzilgan', key, own[i - 1].id + ' → ' + own[i].id + ': ' + gap + ' daqiqa', gap, 0);
        }
        /* 3b: dvigatel bo'shliqni avtomatik yopadi (fill). Kichik bo'shliq
           normal (namoz vaqti suriladi), lekin KATTA bo'shliq shablonda
           blok yo'qolganini bildiradi — shuni ochiq aytamiz. */
        own.forEach(function (b) {
          if (b.gap && b.min > 30) add('avtomatik bo\'shliq', key,
            b.id + ' → ' + b.min + ' daqiqa avtomatik "Dam" bilan yopildi', b.min, 30);
        });
        var sleep = own.filter(function (b) { return b.kind === 'sleep' && !/qaylula/.test(b.id); })
          .reduce(function (s, b) { return s + b.min; }, 0);
        if (sleep !== (M.sleepMin || 390)) add('uyqu', key, p.type + ': uyqu ' + sleep + ' daqiqa', sleep, M.sleepMin || 390);

        var juz = own.filter(function (b) { return b.kind === 'quran'; });
        if (juz.length !== (M.juzPerDay || 3)) add('pora soni', key, p.type + ': ' + juz.length + ' pora', juz.length, M.juzPerDay || 3);
        juz.forEach(function (b) {
          if (b.min !== (M.juz || 90)) add('pora davomiyligi', key, b.id + ' → ' + b.min + ' daqiqa', b.min, M.juz || 90);
        });

        if (core.length > LIM.maxBlocks) add('yadro bloklari soni', key, p.type + ': ' + core.length + ' yadro bloki', core.length, LIM.maxBlocks);
        core.forEach(function (b) {
          if (b.min < LIM.minCore && !b.shortOk) add('qisqa yadro bloki', key, b.id + ' → ' + b.min + ' daqiqa', b.min, LIM.minCore);
          if (b.min > (tLim.maxCore || LIM.maxCore) && !b.longOk) add('uzun yadro bloki', key, b.id + ' → ' + b.min + ' daqiqa', b.min, tLim.maxCore || LIM.maxCore);
        });

        var hard = core.filter(function (b) { return b.w === 'hard' && !b.fixed; });
        var hardMin = hard.reduce(function (s, b) { return s + b.min; }, 0);
        if (hardMin > (tLim.hardMax || LIM.hardMax)) add('OG\'IR yuk', key, p.type + ': ' + hardMin + ' daqiqa', hardMin, tLim.hardMax || LIM.hardMax);
        var noon = p.prayer.dhuhr ? p.prayer.dhuhr.dec : 12;
        var pm = hard.filter(function (b) { return b.from >= noon; }).length;
        if (pm > (tLim.pmHardMax || LIM.pmHardMax)) add('tushdan keyingi OG\'IR bloklar', key, p.type + ': ' + pm + ' blok', pm, tLim.pmHardMax || LIM.pmHardMax);

        p.warnings.forEach(function (w) { if (w.tight) { report.tight.push(key); add('blok sig\'madi', key, L(w.text)); } });

        /* 16: Tahajjud kechaning oxirgi uchdan birida */
        var prev = Store.shiftDays(key, -1);
        var pm2 = Prayer.times(prev, null), tm = p.prayer;
        var th = own.filter(function (b) { return b.tahajjud; })[0];
        if (pm2 && pm2.maghrib && tm.fajr && th) {
          /* Kecha = kechagi Shom → bugungi Bomdod. Ikki vaqtni ham
             Shomdan boshlab SILJISH sifatida solishtiramiz, aks holda
             yarim kechadan o'tganda taqqoslash buziladi. */
          var mg = pm2.maghrib.dec;
          var nightLen = (tm.fajr.dec + 24) - mg;
          var off = function (t) { return ((t - mg) % 24 + 24) % 24; };
          var tahOff = off(th.from), thirdOff = nightLen * 2 / 3;
          if (tahOff > nightLen) {
            add('Tahajjud kecha tashqarisida', key,
              'Tahajjud ' + th.fromStr + ' — Shom (' + pm2.maghrib.str + ') va Bomdod (' +
              tm.fajr.str + ') oraligidan tashqarida', th.fromStr, tm.fajr.str);
          } else if (tahOff < thirdOff - 1e-9) {
            add('Tahajjud oxirgi uchdan bir', key,
              'Tahajjud ' + th.fromStr + ', oxirgi uchdan bir ' + hm(((mg + thirdOff) % 24)) + ' da boshlanadi',
              th.fromStr, hm((mg + thirdOff) % 24));
          }
        }

        var cm = core.reduce(function (s, b) { return s + b.min; }, 0);
        st.n++; st.core += cm; st.hard += hardMin;
        if (cm < st.min) st.min = cm;
        if (cm > st.max) st.max = cm;
        report.days++;
        key = Store.shiftDays(key, 1);
      }

      Object.keys(report.byType).forEach(function (k) {
        var a = report.byType[k];
        a.avg = Math.round(a.core / a.n);
        a.avgHard = Math.round(a.hard / a.n);
        report.weekParts[k] = a.avg;
      });
      /* Haftalik yadro: 2 gibrid + 3 lc + 1 oddiy + 1 tiklanish */
      var W = { gibrid: 2, lc: 3, oddiy: 1, tiklanish: 1 };
      report.week = Object.keys(W).reduce(function (s, k) {
        return s + (report.weekParts[k] || 0) * W[k];
      }, 0);

      return { ok: !errors.length, errors: errors, findings: findings, report: report };
    },

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
