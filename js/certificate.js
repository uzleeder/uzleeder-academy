/* ==========================================================================
   Sertifikatlar
   --------------------------------------------------------------------------
   Ikki xil sertifikat, bitta oyna va bitta yuklab olish mexanizmi:

     1) Haftalik Python sertifikati — hafta (unit) ning barcha kunlari
        7/10 dan yuqori tugatilganda ochiladi.
     2) IELTS sertifikati — ingliz tili kursining 20 haftasi yopilganda.
        Oxirgi mock natijasi bo'lsa, band ballari ham chiziladi.

   Ikkalasi SVG sifatida chiziladi, PNG bo'lib yuklab olinadi (canvas orqali).

   Nega SVG? Matn har qanday o'lchamda tiniq chiqadi va shrift o'rnatish
   talab qilinmaydi — Georgia/Arial hamma tizimda bor.

   "active" — hozir ochiq sertifikat: {file, build}. Yuklab olish shu
   obyektdan foydalanadi, shuning uchun yangi tur qo'shish = yangi build().
   ========================================================================== */
(function () {
  'use strict';

  var active = null;

  /* ====================== MUHR + ASOSCHI IMZOSI ==========================
     Har sertifikatning pastki qismida: chapda asoschi imzosi ("Max",
     Caveat qo'lyozma shrifti), o'ngda UzLeeder rasmiy muhri (aylana, halqa
     bo'ylab matn, markazda logotip). Rang — sertifikatning o'z brend rangi,
     shunda Python (terrakota), IELTS (ko'k-yashil), intizom (yashil)
     sertifikatlarida muhr o'z ohangida chiqadi.

     Joylashuv (900×620 viewBox): imzo x≈140, muhr markazi (770,515) r=48.
     Ikkalasi ham o'rtadagi ball/sana bloklariga (x 250–650) tegmaydi.     */
  var SIG_FONT = "Caveat, 'Segoe Script', 'Brush Script MT', cursive";

  /* UzLeeder RASMIY MUHRI — "UzLeeder Official Design v2026.09", 07-bo'lim
     (emblem-stamp): disksiz emblema, bir siyoh rangida (Qizil · yorug'),
     ichki Λ — Ink Navy, shaffof fon. Geometriya qo'llanmadagidek 200×200
     tarmoqda: halqalar r=97/91/72, nuqtalar (28,100) va (172,100), halqa
     matni r=77 yoyda, markazda Λ belgisi, pastda EST. 2026.

     Qo'llanma qoidalari: hujjatning pastki o'ng burchagida, imzo yonida,
     −8° burilgan, "multiply" aralashuvi bilan. Halqa matni va "EST. 2026"
     o'zgartirilmaydi va kesilmaydi.

     HALOLLIK QOIDASI: muhr hujjat UzLeeder TOMONIDAN berilganini bildiradi —
     bu uchinchi tomon sertifikatlashtiruvi emas va shunday taqdim etilmaydi. */
  var STAMP_FONT = "'Segoe UI','Helvetica Neue',Arial,sans-serif";

  function uzStamp(cx, cy, size, red, ink) {
    var k = size / 200;   // 200×200 tarmoq → kerakli o'lcham
    return (
      '<g transform="translate(' + cx + ' ' + cy + ') rotate(-8) scale(' + k.toFixed(4) + ') translate(-100 -100)"' +
         ' style="mix-blend-mode:multiply">' +
        '<defs>' +
          '<path id="stTop" d="M 23,100 A 77,77 0 0 1 177,100" fill="none"/>' +
          '<path id="stBot" d="M 177,100 A 77,77 0 0 1 23,100" fill="none"/>' +
        '</defs>' +
        '<g fill="none" stroke="' + red + '">' +
          '<circle cx="100" cy="100" r="97" stroke-width="3"/>' +
          '<circle cx="100" cy="100" r="91" stroke-width="1.4"/>' +
          '<circle cx="100" cy="100" r="72" stroke-width="1.3" stroke-dasharray="0 4.6" stroke-linecap="round"/>' +
        '</g>' +
        '<g fill="' + red + '">' +
          '<circle cx="28" cy="100" r="2.3"/><circle cx="172" cy="100" r="2.3"/>' +
        '</g>' +
        '<g font-family="' + STAMP_FONT + '" font-weight="800" fill="' + red + '">' +
          '<text font-size="12.5" letter-spacing="4.6">' +
            '<textPath href="#stTop" startOffset="50%" text-anchor="middle">UZLEEDER</textPath></text>' +
          '<text font-size="9" letter-spacing="3.2">' +
            '<textPath href="#stBot" startOffset="50%" text-anchor="middle">·FOR·LEADERS·</textPath></text>' +
          '<text x="100" y="137" text-anchor="middle" font-size="9.5" letter-spacing="2">EST. 2026</text>' +
        '</g>' +
        '<path d="M74 116 100 66l26 50" fill="none" stroke="' + red + '" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M85 116 100 84l15 32" fill="none" stroke="' + ink + '" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="100" cy="61" r="4.8" fill="' + red + '"/>' +
      '</g>'
    );
  }

  function sealSig(color, soft, uz, ink) {
    var founder = uz ? 'ASOSCHI · UZLEEDER ACADEMY' : 'FOUNDER · UZLEEDER ACADEMY';
    return (
      /* --- imzo (chap) --- */
      '<g font-family="Arial">' +
        '<text x="140" y="536" text-anchor="middle" font-family="' + SIG_FONT + '" font-size="44" font-weight="700" fill="' + color + '" ' +
          'transform="rotate(-4 140 536)">Max</text>' +
        '<path d="M70 548 Q140 542 210 548" fill="none" stroke="' + color + '" stroke-width="1.3" opacity=".8"/>' +
        '<text x="140" y="566" text-anchor="middle" font-size="7.5" font-weight="bold" letter-spacing="1.6" fill="' + soft + '">' + founder + '</text>' +
      '</g>' +
      /* --- rasmiy muhr (o'ng, imzo yonida) --- */
      uzStamp(770, 512, 108, color, ink || '#1c2233')
    );
  }

  /* PNG'ga yuklashda imzo shrifti SVG ichida bo'lishi shart: <img> orqali
     chizilayotgan SVG sahifadagi shriftlarni ko'rmaydi. Shuning uchun Caveat
     woff2 faylini bir marta olib, base64 @font-face sifatida joylaymiz.
     Internet bo'lmasa — jimgina zaxira shriftga tushadi (Georgia italic).   */
  var fontFaceCache = null;
  function caveatFontFace() {
    if (fontFaceCache !== null) return Promise.resolve(fontFaceCache);
    return fetch('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap')
      .then(function (r) { return r.text(); })
      .then(function (css) {
        // Google bir necha @font-face beradi (cyrillic, latin-ext, latin) — latin kerak
        var blocks = css.split('@font-face').filter(function (b) { return /\/\* latin \*\//.test(b); });
        var m = /url\((https:[^)]+)\)/.exec(blocks[0] || css);
        if (!m) throw new Error('no url');
        return fetch(m[1]).then(function (r) { return r.arrayBuffer(); });
      })
      .then(function (buf) {
        var bytes = new Uint8Array(buf), bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        fontFaceCache = "@font-face{font-family:'Caveat';font-weight:700;src:url(data:font/woff2;base64," +
          btoa(bin) + ") format('woff2')}";
        return fontFaceCache;
      })
      .catch(function () { fontFaceCache = ''; return ''; });
  }

  function weekComplete(unit) {
    return unit.days.every(function (d) { return Store.isDone(d.day); });
  }

  function buildSVG(unit) {
    var parts = splitUnit(unit.name);
    var totalScore = 0;
    unit.days.forEach(function (d) { totalScore += (Store.bestScore(d.day) || 0); });
    var avg = (totalScore / unit.days.length).toFixed(1);

    var topics = unit.days
      .filter(function (d) { return d.type === 'topic'; })
      .map(function (d) { return L(d.title); })
      .slice(0, 4).join('   ·   ');

    var name = Store.get('name') || (Store.get('lang') === 'en' ? 'Student' : "O'quvchi");
    var dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var uz = Store.get('lang') !== 'en';

    var t = {
      cert: uz ? 'SERTIFIKAT' : 'CERTIFICATE',
      certifies: uz ? 'Ushbu sertifikat quyidagini tasdiqlaydi:' : 'This certifies that',
      completing: uz ? 'muvaffaqiyatli tugatgani uchun' : 'for successfully completing',
      topics: uz ? 'Mavzular:' : 'Topics:',
      avg: uz ? "O'RTACHA BALL" : 'AVERAGE SCORE',
      date: uz ? 'SANA' : 'DATE',
      path: uz ? "AI Muhandisligi Yo'li" : 'AI Engineering Path'
    };

    /* Hujjatlar HAR DOIM Bold Red identitetida — brend qo'llanmasi, 13-bo'lim:
       sayt shablonlari hujjatlarga tegmaydi. Qizil · yorug' #E01E37, Ink Navy
       matn, Paper fon.                                                       */
    var C = { brand: '#e01e37', brand2: '#e5243b', gold: '#c9a227', ink: '#1c2233', soft: '#5e6b7d', line: '#e4e6eb' };

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" font-family="Georgia, serif">' +
      '<defs>' +
        '<linearGradient id="certBg" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f6f7f9"/></linearGradient>' +
        '<linearGradient id="certBrand" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="' + C.brand + '"/><stop offset="1" stop-color="' + C.brand2 + '"/></linearGradient>' +
      '</defs>' +
      '<rect width="900" height="620" fill="url(#certBg)"/>' +
      '<rect x="24" y="24" width="852" height="572" rx="14" fill="none" stroke="' + C.brand + '" stroke-width="2.5"/>' +
      '<rect x="34" y="34" width="832" height="552" rx="10" fill="none" stroke="' + C.line + '" stroke-width="1.5"/>' +
      // burchak bezaklari
      '<path d="M24 60 L24 38 L46 38" fill="none" stroke="' + C.brand2 + '" stroke-width="4"/>' +
      '<path d="M876 60 L876 38 L854 38" fill="none" stroke="' + C.brand2 + '" stroke-width="4"/>' +
      '<path d="M24 560 L24 582 L46 582" fill="none" stroke="' + C.brand2 + '" stroke-width="4"/>' +
      '<path d="M876 560 L876 582 L854 582" fill="none" stroke="' + C.brand2 + '" stroke-width="4"/>' +
      // logotip
      '<g transform="translate(450,92)">' +
        /* Brend "app icon": yumaloq Ink Navy plita + akademiya belgisi qizilda */
        '<rect x="-26" y="-26" width="52" height="52" rx="12" fill="' + C.ink + '"/>' +
        '<path d="M-13 12 L-4 -6 L3 5 L14 -12" fill="none" stroke="' + C.brand2 + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="14" cy="-12" r="3.6" fill="' + C.brand2 + '"/></g>' +
      '<text x="450" y="150" text-anchor="middle" font-size="15" letter-spacing="4" fill="' + C.soft + '" font-family="Arial">' +
        'UZLEEDER · ' + esc(t.path.toUpperCase()) + '</text>' +
      '<text x="450" y="205" text-anchor="middle" font-size="46" font-weight="bold" letter-spacing="8" fill="' + C.ink + '">' + t.cert + '</text>' +
      '<rect x="380" y="222" width="140" height="3" rx="1.5" fill="url(#certBrand)"/>' +
      '<text x="450" y="270" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.certifies) + '</text>' +
      '<text x="450" y="312" text-anchor="middle" font-size="34" font-weight="bold" fill="' + C.brand + '">' + esc(name) + '</text>' +
      '<text x="450" y="348" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.completing) + '</text>' +
      '<text x="450" y="392" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.ink + '">' +
        esc(parts.wk) + ' — ' + esc(parts.name) + '</text>' +
      '<text x="450" y="428" text-anchor="middle" font-size="13" fill="' + C.soft + '" font-family="Arial">' +
        esc(t.topics) + ' ' + esc(topics) + '</text>' +
      '<g font-family="Arial">' +
        '<text x="300" y="498" text-anchor="middle" font-size="12" letter-spacing="1" fill="' + C.soft + '">' + esc(t.avg) + '</text>' +
        '<text x="300" y="524" text-anchor="middle" font-size="24" font-weight="bold" fill="' + C.gold + '">' + avg + ' / 10</text>' +
        '<text x="600" y="498" text-anchor="middle" font-size="12" letter-spacing="1" fill="' + C.soft + '">' + esc(t.date) + '</text>' +
        '<text x="600" y="524" text-anchor="middle" font-size="20" font-weight="bold" fill="' + C.ink + '">' + esc(dateStr) + '</text></g>' +
      '<rect x="250" y="552" width="400" height="1.5" fill="' + C.line + '"/>' +
      '<text x="450" y="576" text-anchor="middle" font-size="13" font-style="italic" fill="' + C.soft + '" font-family="Georgia">' +
        'UzLeeder Academy — ' + esc(t.path) + '</text>' +
      sealSig(C.brand, C.soft, uz, C.ink) +
      '</svg>';
  }

  /* ====================== IELTS SERTIFIKATI ============================
     Rangi ataylab boshqacha (ko'k-yashil) — bir qarashda Python
     sertifikatidan farq qilib tursin.                                    */
  function buildIELTS() {
    var m = ENGLISH.meta;
    var uz = Store.get('lang') !== 'en';
    var name = Store.get('name') || (uz ? "O'quvchi" : 'Student');
    var dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    var last = Store.engLastScore();
    var overall = last ? Store.engOverall(last) : null;

    var t = {
      cert: uz ? 'SERTIFIKAT' : 'CERTIFICATE',
      certifies: uz ? 'Ushbu sertifikat quyidagini tasdiqlaydi:' : 'This certifies that',
      completing: uz ? 'quyidagi dasturni tugatgani uchun' : 'for completing',
      course: uz ? ('IELTS 8.0 — ' + ENGLISH.meta.days + ' kunlik tayyorgarlik')
                 : ('IELTS 8.0 — ' + ENGLISH.meta.days + '-day preparation'),
      period: uz ? 'DAVR' : 'PERIOD',
      exam: uz ? 'IMTIHON' : 'EXAM',
      date: uz ? 'SANA' : 'DATE',
      overall: uz ? 'UMUMIY BALL' : 'OVERALL BAND',
      note: uz
        ? 'Platforma sertifikati — rasmiy IELTS natijasi emas.'
        : 'A platform certificate — not an official IELTS result.'
    };

    var C = { deep: '#e01e37', mid: '#e5243b', gold: '#c9a227', ink: '#1c2233', soft: '#5e6b7d', line: '#e4e6eb' };   /* hujjat = Bold Red */

    var bands = '';
    if (last) {
      var cells = [
        [uz ? 'Listening' : 'Listening', last.l],
        [uz ? 'Reading' : 'Reading', last.r],
        [uz ? 'Writing' : 'Writing', last.w],
        [uz ? 'Speaking' : 'Speaking', last.s]
      ];
      cells.forEach(function (c, i) {
        var x = 250 + i * 133;   // 250..649 — chapdagi imzo va o'ngdagi muhrga tegmaydi
        bands += '<text x="' + x + '" y="474" text-anchor="middle" font-size="11.5" letter-spacing="1.2" fill="' + C.soft + '">' +
            esc(String(c[0]).toUpperCase()) + '</text>' +
          '<text x="' + x + '" y="502" text-anchor="middle" font-size="23" font-weight="bold" fill="' + C.deep + '">' +
            (typeof c[1] === 'number' ? c[1].toFixed(1) : '—') + '</text>';
      });
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" font-family="Georgia, serif">' +
      '<defs>' +
        '<linearGradient id="ieBg" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f6f7f9"/></linearGradient>' +
        '<linearGradient id="ieBrand" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="' + C.deep + '"/><stop offset="1" stop-color="' + C.mid + '"/></linearGradient>' +
      '</defs>' +
      '<rect width="900" height="620" fill="url(#ieBg)"/>' +
      '<rect x="24" y="24" width="852" height="572" rx="14" fill="none" stroke="' + C.deep + '" stroke-width="2.5"/>' +
      '<rect x="34" y="34" width="832" height="552" rx="10" fill="none" stroke="' + C.line + '" stroke-width="1.5"/>' +
      '<path d="M24 60 L24 38 L46 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<path d="M876 60 L876 38 L854 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<path d="M24 560 L24 582 L46 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<path d="M876 560 L876 582 L854 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      // logotip — globus
      '<g transform="translate(450,88)">' +
        '<rect x="-26" y="-26" width="52" height="52" rx="14" fill="url(#ieBrand)"/>' +
        '<circle cx="0" cy="0" r="13" fill="none" stroke="#fbfefe" stroke-width="2.4"/>' +
        '<path d="M-13 0h26M0 -13a19 19 0 0 1 0 26M0 -13a19 19 0 0 0 0 26" fill="none" stroke="#fbfefe" stroke-width="2.4"/></g>' +
      '<text x="450" y="144" text-anchor="middle" font-size="15" letter-spacing="4" fill="' + C.soft + '" font-family="Arial">' +
        'UZLEEDER · ENGLISH TRACK</text>' +
      '<text x="450" y="199" text-anchor="middle" font-size="46" font-weight="bold" letter-spacing="8" fill="' + C.ink + '">' + t.cert + '</text>' +
      '<rect x="380" y="216" width="140" height="3" rx="1.5" fill="url(#ieBrand)"/>' +
      '<text x="450" y="262" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.certifies) + '</text>' +
      '<text x="450" y="304" text-anchor="middle" font-size="34" font-weight="bold" fill="' + C.deep + '">' + esc(name) + '</text>' +
      '<text x="450" y="340" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.completing) + '</text>' +
      '<text x="450" y="382" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.ink + '">' + esc(t.course) + '</text>' +
      '<g font-family="Arial">' +
        '<text x="450" y="416" text-anchor="middle" font-size="13" fill="' + C.soft + '">' +
          esc(t.period) + ': ' + esc(EngCal.fmt(m.start)) + ' – ' + esc(EngCal.fmt(m.bufferTo)) +
          '   ·   ' + esc(t.exam) + ': ' + esc(EngCal.fmt(m.exam)) + '</text>' +
        bands +
      '</g>' +
      // Pastki blok ramka ichida qolishi kerak: tashqi ramka y=596 da tugaydi
      (overall !== null
        ? '<g font-family="Arial">' +
            '<text x="450" y="530" text-anchor="middle" font-size="12" letter-spacing="1.4" fill="' + C.soft + '">' + esc(t.overall) + '</text>' +
            '<text x="450" y="556" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.gold + '">' + overall.toFixed(1) + ' / 9.0</text>' +
          '</g>'
        : '<g font-family="Arial">' +
            '<text x="450" y="530" text-anchor="middle" font-size="12" letter-spacing="1.4" fill="' + C.soft + '">' + esc(t.date) + '</text>' +
            '<text x="450" y="556" text-anchor="middle" font-size="22" font-weight="bold" fill="' + C.deep + '">' + esc(dateStr) + '</text>' +
          '</g>') +
      '<rect x="250" y="566" width="400" height="1.5" fill="' + C.line + '"/>' +
      '<text x="450" y="584" text-anchor="middle" font-size="11.5" font-style="italic" fill="' + C.soft + '" font-family="Georgia">' +
        esc(t.note) + '</text>' +
      sealSig(C.deep, C.soft, uz, C.ink) +
      '</svg>';
  }

  /* ====================== HAFTALIK INTIZOM SERTIFIKATI ===================
     Dushanba–yakshanba: har kuni intizom kuni to'liq yopilgan bo'lsa
     (HabitPlan.isDayDone) — bitta kun ham tashlab yuborilmagan.
     Rangi yashil-tilla — boshqa ikkitasidan farq qilsin.                  */
  function weekDays(monKey) {
    var out = [];
    for (var i = 0; i < 7; i++) out.push(Store.shiftDays(monKey, i));
    return out;
  }
  function weekDoneCount(monKey) {
    return weekDays(monKey).filter(function (k) {
      return HabitPlan.inRange(k) && HabitPlan.isDayDone(HabitPlan.forDate(k));
    }).length;
  }
  /* Rejadagi haftalar: birinchi dushanba (from dan oldingi yoki o'sha) → bugungi hafta */
  function weeks() {
    var from = HABIT.meta.from, today = Store.dateKey();
    var d = new Date(from + 'T00:00:00');
    var mon = Store.shiftDays(from, -((d.getDay() + 6) % 7));
    var out = [];
    while (mon <= today) {
      var days = weekDays(mon).filter(function (k) { return HabitPlan.inRange(k); });
      if (days.length) {
        var done = weekDoneCount(mon);
        var over = Store.shiftDays(mon, 6) < today;
        /* Sertifikat faqat hafta tugagach (yakshanba o'tgach) — oldindan belgilab olib bo'lmaydi */
        var sun = Store.shiftDays(mon, 6);
        out.push({ mon: mon, sun: sun, days: days.length, done: done,
          earned: done === days.length && days.length >= 5 && sun <= today, over: over });
      }
      mon = Store.shiftDays(mon, 7);
    }
    return out;
  }

  function buildWeek(w) {
    var uz = Store.get('lang') !== 'en';
    var name = Store.get('name') || (uz ? "O'quvchi" : 'Student');
    var n = weeks().filter(function (x) { return x.earned && x.mon <= w.mon; }).length;
    var t = {
      cert: uz ? 'SERTIFIKAT' : 'CERTIFICATE',
      kicker: uz ? 'UZLEEDER · HAFTALIK INTIZOM' : 'UZLEEDER · WEEKLY DISCIPLINE',
      certifies: uz ? 'Ushbu sertifikat quyidagini tasdiqlaydi:' : 'This certifies that',
      completing: uz ? 'bir hafta davomida bironta kunni tashlab yubormasdan' : 'completed every single day of the week',
      what: uz ? 'Kunlik intizomni 7/7 bajargani uchun' : 'Daily discipline — 7 of 7 days',
      period: uz ? 'HAFTA' : 'WEEK', no: uz ? 'INTIZOM HAFTASI №' : 'DISCIPLINE WEEK #',
      note: uz ? 'Namoz, ingliz tili, coding, kitob, uyqu — hammasi rejadagidek.' : 'Prayer, English, coding, reading, sleep — all as planned.'
    };
    var C = { deep: '#e01e37', mid: '#e5243b', gold: '#c9a227', ink: '#1c2233', soft: '#5e6b7d', line: '#e4e6eb' };   /* hujjat = Bold Red */
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" font-family="Georgia, serif">' +
      '<defs><linearGradient id="wkBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f6f7f9"/></linearGradient>' +
      '<linearGradient id="wkBrand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + C.deep + '"/><stop offset="1" stop-color="' + C.mid + '"/></linearGradient></defs>' +
      '<rect width="900" height="620" fill="url(#wkBg)"/>' +
      '<rect x="24" y="24" width="852" height="572" rx="14" fill="none" stroke="' + C.deep + '" stroke-width="2.5"/>' +
      '<rect x="34" y="34" width="832" height="552" rx="10" fill="none" stroke="' + C.line + '" stroke-width="1.5"/>' +
      '<path d="M24 60 L24 38 L46 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/><path d="M876 60 L876 38 L854 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<path d="M24 560 L24 582 L46 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/><path d="M876 560 L876 582 L854 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      // logotip — olov (streak)
      '<g transform="translate(450,88)"><rect x="-26" y="-26" width="52" height="52" rx="14" fill="url(#wkBrand)"/>' +
      '<path d="M0 -14c6 7 10 12 10 18a10 10 0 0 1-20 0c0-3 1-5 3-8 0 4 2 6 4 6 0-6-1-10 3-16z" fill="#fbfefb"/></g>' +
      '<text x="450" y="144" text-anchor="middle" font-size="15" letter-spacing="4" fill="' + C.soft + '" font-family="Arial">' + esc(t.kicker) + '</text>' +
      '<text x="450" y="199" text-anchor="middle" font-size="46" font-weight="bold" letter-spacing="8" fill="' + C.ink + '">' + t.cert + '</text>' +
      '<rect x="380" y="216" width="140" height="3" rx="1.5" fill="url(#wkBrand)"/>' +
      '<text x="450" y="262" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.certifies) + '</text>' +
      '<text x="450" y="304" text-anchor="middle" font-size="34" font-weight="bold" fill="' + C.deep + '">' + esc(name) + '</text>' +
      '<text x="450" y="340" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.completing) + '</text>' +
      '<text x="450" y="382" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.ink + '">' + esc(t.what) + '</text>' +
      '<g font-family="Arial">' +
        '<text x="300" y="470" text-anchor="middle" font-size="12" letter-spacing="1" fill="' + C.soft + '">' + esc(t.period) + '</text>' +
        '<text x="300" y="498" text-anchor="middle" font-size="20" font-weight="bold" fill="' + C.ink + '">' + esc(EngCal.fmt(w.mon) + ' – ' + EngCal.fmt(w.sun)) + '</text>' +
        '<text x="600" y="470" text-anchor="middle" font-size="12" letter-spacing="1" fill="' + C.soft + '">' + esc(t.no) + '</text>' +
        '<text x="600" y="498" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.gold + '">' + n + '</text></g>' +
      '<rect x="250" y="552" width="400" height="1.5" fill="' + C.line + '"/>' +
      '<text x="450" y="576" text-anchor="middle" font-size="13" font-style="italic" fill="' + C.soft + '" font-family="Georgia">' + esc(t.note) + '</text>' +
      sealSig(C.deep, C.soft, uz, C.ink) +
      '</svg>';
  }

  /* Oynani ochish (ikkala tur uchun umumiy) */
  function show(title, svg) {
    $('#certTitle').textContent = title;
    $('#certFrame').innerHTML = svg;
    $('#certDownload').innerHTML = IC.download + esc(tr('certDownload'));
    $('#certClose').textContent = tr('close');
    $('#certOverlay').classList.add('show');
  }

  /* ====================== UMUMIY SERTIFIKAT ==============================
     Quick Repeat, DataCamp treki va boshqa kurslar uchun: buildGeneric({
       track, course, sub, score, color:{deep,mid,gold} }).                   */
  function buildGeneric(o) {
    var uz = Store.get('lang') !== 'en';
    var name = Store.get('name') || (uz ? "O'quvchi" : 'Student');
    var dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    var C = Object.assign({ deep: '#e01e37', mid: '#e5243b', gold: '#c9a227', ink: '#1c2233', soft: '#5e6b7d', line: '#e4e6eb', bg1: '#ffffff', bg2: '#f6f7f9' }, o.color || {});
    var t = { cert: uz ? 'SERTIFIKAT' : 'CERTIFICATE', certifies: uz ? 'Ushbu sertifikat quyidagini tasdiqlaydi:' : 'This certifies that', completing: uz ? 'quyidagi dasturni muvaffaqiyatli tugatgani uchun' : 'for successfully completing', date: uz ? 'SANA' : 'DATE', score: uz ? 'YAKUNIY TEST' : 'FINAL TEST', note: uz ? 'Platforma sertifikati — rasmiy natija emas.' : 'A platform certificate — not an official result.' };
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" font-family="Georgia, serif">' +
      '<defs><linearGradient id="gnBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + C.bg1 + '"/><stop offset="1" stop-color="' + C.bg2 + '"/></linearGradient>' +
      '<linearGradient id="gnBrand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + C.deep + '"/><stop offset="1" stop-color="' + C.mid + '"/></linearGradient></defs>' +
      '<rect width="900" height="620" fill="url(#gnBg)"/>' +
      '<rect x="24" y="24" width="852" height="572" rx="14" fill="none" stroke="' + C.deep + '" stroke-width="2.5"/>' +
      '<rect x="34" y="34" width="832" height="552" rx="10" fill="none" stroke="' + C.line + '" stroke-width="1.5"/>' +
      '<path d="M24 60 L24 38 L46 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/><path d="M876 60 L876 38 L854 38" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<path d="M24 560 L24 582 L46 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/><path d="M876 560 L876 582 L854 582" fill="none" stroke="' + C.mid + '" stroke-width="4"/>' +
      '<g transform="translate(450,88)"><rect x="-26" y="-26" width="52" height="52" rx="14" fill="url(#gnBrand)"/>' +
        '<path d="M-14 12 L-5 -6 L3 6 L15 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="-12" r="3" fill="#fff"/></g>' +
      '<text x="450" y="144" text-anchor="middle" font-size="15" letter-spacing="4" fill="' + C.soft + '" font-family="Arial">' + esc(String(o.track || 'UZLEEDER ACADEMY').toUpperCase()) + '</text>' +
      '<text x="450" y="199" text-anchor="middle" font-size="46" font-weight="bold" letter-spacing="8" fill="' + C.ink + '">' + t.cert + '</text>' +
      '<rect x="380" y="216" width="140" height="3" rx="1.5" fill="url(#gnBrand)"/>' +
      '<text x="450" y="262" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.certifies) + '</text>' +
      '<text x="450" y="304" text-anchor="middle" font-size="34" font-weight="bold" fill="' + C.deep + '">' + esc(name) + '</text>' +
      '<text x="450" y="340" text-anchor="middle" font-size="16" fill="' + C.soft + '" font-family="Arial">' + esc(t.completing) + '</text>' +
      '<text x="450" y="382" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.ink + '">' + esc(o.course) + '</text>' +
      (o.sub ? '<text x="450" y="416" text-anchor="middle" font-size="13" fill="' + C.soft + '" font-family="Arial">' + esc(o.sub) + '</text>' : '') +
      '<g font-family="Arial">' +
        (o.score ? '<text x="330" y="500" text-anchor="middle" font-size="12" letter-spacing="1.4" fill="' + C.soft + '">' + esc(t.score) + '</text><text x="330" y="530" text-anchor="middle" font-size="26" font-weight="bold" fill="' + C.gold + '">' + esc(o.score) + '</text>' : '') +
        '<text x="' + (o.score ? 570 : 450) + '" y="500" text-anchor="middle" font-size="12" letter-spacing="1.4" fill="' + C.soft + '">' + esc(t.date) + '</text>' +
        '<text x="' + (o.score ? 570 : 450) + '" y="530" text-anchor="middle" font-size="22" font-weight="bold" fill="' + C.deep + '">' + esc(dateStr) + '</text></g>' +
      '<rect x="250" y="566" width="400" height="1.5" fill="' + C.line + '"/>' +
      '<text x="450" y="584" text-anchor="middle" font-size="11.5" font-style="italic" fill="' + C.soft + '" font-family="Georgia">' + esc(t.note) + '</text>' +
      sealSig(C.deep, C.soft, uz, C.ink) +
      '</svg>';
  }

  window.Certificate = {
    /* Umumiy sertifikat: openGeneric({ file, title, track, course, sub, score, color }) */
    openGeneric: function (o) {
      active = { file: o.file || 'Certificate', build: function () { return buildGeneric(o); } };
      show(o.title || tr('certTitle'), active.build());
    },
    open: function (unitIndex) {
      var unit = groupUnits()[unitIndex];
      if (!unit) return;
      if (!weekComplete(unit)) { toast(tr('certLocked'), 'warn'); return; }

      active = {
        file: splitUnit(unit.name).wk.replace(/\s+/g, '_'),
        build: function () { return buildSVG(unit); }
      };
      show(tr('certTitle'), active.build());
    },

    /* IELTS sertifikati — kurs kunlarining hammasi yopilgach */
    openIELTS: function () {
      if (!Eng.certReady()) { toast(tr('engCertLocked'), 'warn'); return; }
      active = { file: 'IELTS', build: buildIELTS };
      show(tr('engCertT'), active.build());
    },

    /* Haftalik intizom — faqat 7/7 bajarilgan hafta uchun */
    weeks: weeks,
    unitReady: function (unitIndex) { var u = groupUnits()[unitIndex]; return !!u && weekComplete(u); },
    openWeek: function (monKey) {
      var w = weeks().filter(function (x) { return x.mon === monKey; })[0];
      if (!w || !w.earned) { toast(tr('certWeekLocked'), 'warn'); return; }
      active = { file: 'Week_' + monKey, build: function () { return buildWeek(w); } };
      show(tr('certWeekT'), active.build());
    },
    /* Tashqi (yuklangan) sertifikat — rasmni oynada ko'rsatish */
    openImage: function (c) {
      active = null;
      $('#certTitle').textContent = c.name || '';
      $('#certFrame').innerHTML = '<img src="' + esc(c.img) + '" alt="" style="width:100%;height:auto;display:block;border-radius:8px">';
      $('#certDownload').innerHTML = IC.download + esc(tr('certDownload'));
      $('#certClose').textContent = tr('close');
      $('#certOverlay').classList.add('show');
      active = { file: (c.name || 'cert').replace(/[^\w-]+/g, '_'), img: c.img };
    },

    close: function () { $('#certOverlay').classList.remove('show'); },

    download: function () {
      if (!active) return;
      if (active.img) {   // yuklangan rasm — o'zini yuklab beramiz
        var a0 = document.createElement('a');
        a0.href = active.img; a0.download = 'Certificate_' + active.file + '.jpg'; a0.click();
        return;
      }
      var file = active.file;
      caveatFontFace().then(function (fontCss) {
      // Imzo shrifti SVG ichida bo'lsin — <img> sahifadagi shriftni ko'rmaydi
      var svg = active.build();
      if (fontCss) svg = svg.replace(/<svg([^>]*)>/, '<svg$1><style>' + fontCss + '</style>');
      var blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var img = new Image();

      img.onload = function () {
        // 2x o'lchamda chizamiz — chop etganda ham tiniq bo'lsin
        var canvas = document.createElement('canvas');
        canvas.width = 1800; canvas.height = 1240;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';   /* brend: hujjat foni Paper/oq */
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (png) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(png);
          a.download = 'UzLeeder_Certificate_' + file + '.png';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        }, 'image/png');
      };
      img.onerror = function () { URL.revokeObjectURL(url); toast('SVG → PNG', 'warn'); };
      img.src = url;
      });
    }
  };
})();
