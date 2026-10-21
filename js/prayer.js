/* ==========================================================================
   Namoz vaqtlari — astronomik hisob
   --------------------------------------------------------------------------
   Vaqtlar jadvaldan olinmaydi, HISOBLANADI. Sabab: kurs 10-sentabrdan
   20-fevralgacha davom etadi va bu oraliqda vaqtlar 1.5 soatgacha suriladi.
   Qo'lda yozilgan jadval bir hafta ichida eskirardi.

   Algoritm — standart (PrayTimes.org bilan bir xil):
     1) Kunning Julian sanasi
     2) Quyoshning og'ishi (declination) va vaqt tenglamasi (equation of time)
     3) Peshin = 12 + timezone − uzunlik/15 − eqt
     4) Qolganlari peshindan burchak orqali hisoblanadi

   MUHIM: bu hisob TAXMINIY. Mahalliy masjid yoki O'zbekiston musulmonlari
   idorasining rasmiy taqvimi bilan solishtirib ko'r — bir-ikki daqiqalik
   farq bo'lishi normal, lekin katta farq bo'lsa sozlamalardagi konvensiyani
   o'zgartirish kerak.

   Standart sozlama — O'zbekiston uchun:
     shahar   Toshkent (41.2995°N, 69.2401°E, UTC+5)
     Bomdod   18°
     Xufton   18°
     Asr      Hanafiy (soya = 2×)   ← O'zbekistonda shu ishlatiladi
   ========================================================================== */
(function () {
  'use strict';

  var DEG = Math.PI / 180;
  function sin(d) { return Math.sin(d * DEG); }
  function cos(d) { return Math.cos(d * DEG); }
  function tan(d) { return Math.tan(d * DEG); }
  function asin(x) { return Math.asin(x) / DEG; }
  function acos(x) { return Math.acos(x) / DEG; }
  function atan2(y, x) { return Math.atan2(y, x) / DEG; }
  function acot(x) { return Math.atan(1 / x) / DEG; }
  function fix(a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; }

  /* Julian sana (tush uchun) */
  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  /* Quyoshning og'ishi (deklinatsiya) va vaqt tenglamasi */
  function sunPosition(jd) {
    var D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360);          // o'rtacha anomaliya
    var q = fix(280.459 + 0.98564736 * D, 360);          // o'rtacha uzunlik
    var L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360); // ekliptik uzunlik
    var e = 23.439 - 0.00000036 * D;                     // ekliptika qiyaligi
    var RA = fix(atan2(cos(e) * sin(L), cos(L)) / 15, 24);
    return {
      decl: asin(sin(e) * sin(L)),                       // og'ish
      eqt: q / 15 - RA                                   // vaqt tenglamasi (soat)
    };
  }

  /* Quyosh ufqdan `angle` gradus pastda bo'lgan paytgacha bo'lgan burchak vaqti */
  function hourAngle(angle, lat, decl) {
    var x = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
    if (x > 1 || x < -1) return NaN;   // qutbga yaqin joylarda vaqt yo'q
    return acos(x) / 15;
  }

  /* Asr: soya uzunligi predmetning `factor` barobariga yetgan payt */
  function asrAngle(factor, lat, decl) {
    return -acot(factor + tan(Math.abs(lat - decl)));
  }

  function toHM(t) {
    if (isNaN(t) || t === null) return null;
    t = fix(t, 24);
    var h = Math.floor(t);
    var m = Math.round((t - h) * 60);
    if (m === 60) { m = 0; h = fix(h + 1, 24); }
    return { h: h, m: m, str: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'), dec: h + m / 60 };
  }

  window.Prayer = {
    /* O'zbekiston uchun standart sozlama */
    DEFAULTS: {
      city: 'Toshkent',
      lat: 41.2995,
      lon: 69.2401,
      tz: 5,
      fajr: 18,        // Bomdod burchagi
      isha: 18,        // Xufton burchagi
      asr: 2           // 1 = Shofe'iy, 2 = Hanafiy (O'zbekistonda 2)
    },

    /* Tanlash mumkin bo'lgan shaharlar (kengaytirish oson) */
    CITIES: [
      { key: 'tashkent',  name: 'Toshkent',   lat: 41.2995, lon: 69.2401, tz: 5 },
      { key: 'samarkand', name: 'Samarqand',  lat: 39.6270, lon: 66.9750, tz: 5 },
      { key: 'bukhara',   name: 'Buxoro',     lat: 39.7747, lon: 64.4286, tz: 5 },
      { key: 'namangan',  name: 'Namangan',   lat: 40.9983, lon: 71.6726, tz: 5 },
      { key: 'andijan',   name: 'Andijon',    lat: 40.7821, lon: 72.3442, tz: 5 },
      { key: 'fergana',   name: "Farg'ona",   lat: 40.3864, lon: 71.7864, tz: 5 },
      { key: 'nukus',     name: 'Nukus',      lat: 42.4531, lon: 59.6103, tz: 5 },
      { key: 'urgench',   name: 'Urganch',    lat: 41.5500, lon: 60.6333, tz: 5 },
      { key: 'qarshi',    name: 'Qarshi',     lat: 38.8600, lon: 65.7900, tz: 5 },
      { key: 'termez',    name: 'Termiz',     lat: 37.2242, lon: 67.2783, tz: 5 }
    ],

    /* Namoz nomlari — o'zbekcha (mahalliy) va arabcha */
    NAMES: {
      fajr:    { uz: 'Bomdod',  en: 'Fajr',    ar: 'الفجر' },
      sunrise: { uz: 'Quyosh',  en: 'Sunrise', ar: 'الشروق' },
      dhuhr:   { uz: 'Peshin',  en: 'Dhuhr',   ar: 'الظهر' },
      asr:     { uz: 'Asr',     en: 'Asr',     ar: 'العصر' },
      maghrib: { uz: 'Shom',    en: 'Maghrib', ar: 'المغرب' },
      isha:    { uz: 'Xufton',  en: 'Isha',    ar: 'العشاء' }
    },
    ORDER: ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'],

    /* Bir kunning vaqtlari.
       dateKey — "YYYY-MM-DD", cfg — DEFAULTS ustiga qo'yiladigan sozlama */
    times: function (dateKey, cfg) {
      var c = {}, k;
      for (k in Prayer.DEFAULTS) c[k] = Prayer.DEFAULTS[k];
      for (k in (cfg || {})) if (cfg[k] !== undefined && cfg[k] !== null) c[k] = cfg[k];

      var p = String(dateKey).split('-');
      var jd = julian(Number(p[0]), Number(p[1]), Number(p[2]));
      // Mahalliy tushga to'g'irlash — aks holda uzun sanalarda daqiqa siljiydi
      jd = jd - c.lon / (15 * 24);

      var s = sunPosition(jd);
      var dhuhr = 12 + c.tz - c.lon / 15 - s.eqt;

      var t = {
        fajr:    dhuhr - hourAngle(c.fajr, c.lat, s.decl),
        sunrise: dhuhr - hourAngle(0.833, c.lat, s.decl),
        dhuhr:   dhuhr + 1 / 60,     // zavolldan keyin ~1 daqiqa
        asr:     dhuhr + hourAngle(asrAngle(c.asr, c.lat, s.decl), c.lat, s.decl),
        maghrib: dhuhr + hourAngle(0.833, c.lat, s.decl),
        isha:    dhuhr + hourAngle(c.isha, c.lat, s.decl)
      };

      var out = { key: dateKey, city: c.city };
      Prayer.ORDER.forEach(function (name) { out[name] = toHM(t[name]); });
      return out;
    },

    /* Berilgan daqiqada qaysi namoz oralig'idamiz */
    current: function (times, decimalHour) {
      var prev = null, next = null;
      Prayer.ORDER.forEach(function (name) {
        if (name === 'sunrise') return;
        var v = times[name];
        if (!v) return;
        if (v.dec <= decimalHour) prev = name;
        else if (!next) next = name;
      });
      return { prev: prev, next: next };
    },

    /* Blok (boshlanish–tugash) ichiga qaysi namoz tushadi.
       Everest LC darsi 16:30–18:30 — qishda Shom aynan shu oraliqqa tushadi,
       shuning uchun bu ma'lumot jadvalda ko'rsatiladi.                     */
    inRange: function (times, fromDec, toDec) {
      var hits = [];
      Prayer.ORDER.forEach(function (name) {
        if (name === 'sunrise') return;
        var v = times[name];
        if (v && v.dec >= fromDec && v.dec < toDec) hits.push(name);
      });
      return hits;
    }
  };
})();
