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
     Har sertifikatning pastki qismida: chapda asoschining HAQIQIY imzosi
     (img/sign-akbar.png, shaffof PNG), o'ngda UzLeeder rasmiy muhri.
     Muhr har doim brend qizilida (#f0384e) — qo'llanma 07-bo'limi uni bir
     siyoh rangida belgilaydi, shuning uchun sertifikat turiga qarab
     bo'yalmaydi.

     Joylashuv (900×620): imzo x 58–240 y 470–596, muhr markazi (786,516).
     Ikkalasi ham ma'lumot qatoriga (y 392–448) tegmaydi.                 */
  /* Asoschining imzosi — shaffof PNG (img/sign-akbar.png).
     Ekranda shu manzil ishlaydi; PNG'ga yuklashda esa <img> orqali
     chizilayotgan SVG tashqi fayllarni KO'RMAYDI, shuning uchun
     rasterizatsiyadan oldin base64 data URI bilan almashtiriladi
     (shrift bilan bir xil yo'l).                                     */
  var SIG_SRC = 'img/sign-akbar.png';
  var sigDataCache = null;
  function signatureData() {
    if (sigDataCache !== null) return Promise.resolve(sigDataCache);
    return fetch(SIG_SRC)
      .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
      .then(function (buf) {
        var b = new Uint8Array(buf), bin = '';
        for (var i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]);
        sigDataCache = 'data:image/png;base64,' + btoa(bin);
        return sigDataCache;
      })
      .catch(function () { sigDataCache = ''; return ''; });   /* topilmasa imzosiz chiqadi */
  }

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



  function weekComplete(unit) {
    return unit.days.every(function (d) { return Store.isDone(d.day); });
  }

  /* ====================== HUJJAT MAKETI (umumiy) ======================
     To'rtala sertifikat (hafta bloki, IELTS, intizom haftasi, umumiy) bir
     maketdan chiziladi — avval har biri o'z nusxasini chizar edi va ular
     asta-sekin bir-biridan uzoqlashib ketgandi.

     Maket: chapga tekislangan tahririy kompozitsiya. Qalin ikki ramka
     o'rniga chap qirrada brend ustuni va ichkarida soch tolasidek chiziqlar;
     ism — sahifaning tayanchi; pastda uchta-to'rtta ma'lumot katagi.

     BREND AKTIVLARI ASL HOLIDA:
       belgi  — brand/logo-mark.svg (navy plita + qizil o'sish chizig'i)
       muhr   — uzStamp(), "Official Design v2026.09" 07-bo'lim
       ranglar — aksent #f0384e, Ink Navy #1c2233 (brand/brand.css)      */
  var BRAND = { red: '#f0384e', red2: '#ff5468', ink: '#1c2233', soft: '#8A8F98',
                faint: '#B6BAC1', line: '#E2E3E0', body: '#6B7079' };
  var DOC_FONT = "Outfit, Manrope, 'Segoe UI', system-ui, sans-serif";
  var MONO_FONT = "'Cascadia Mono', Consolas, ui-monospace, monospace";

  /* Rasmiy belgi — brand/logo-mark.svg dagi yo'l aynan, 256 tarmoqdan
     kerakli o'lchamga keltiriladi. Belgi qayta chizilmaydi.            */
  function markLogo(x, y, size) {
    var k = (size / 256).toFixed(5);
    return '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')">' +
        '<rect width="256" height="256" rx="64" fill="url(#clMark)"/>' +
        '<rect x="1" y="1" width="254" height="254" rx="63" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="2"/>' +
        '<g transform="translate(48 48) scale(6.6667)" fill="none" stroke="' + BRAND.red + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M4 18 L9 8 L13 14 L20 5"/>' +
          '<circle cx="20" cy="5" r="2.3" fill="' + BRAND.red + '" stroke="none"/>' +
        '</g></g>';
  }

  /* o = { kicker, id, name, lead, course, sub, rows[], note }
     rows — 2..4 ta katak: { l: yorliq, v: qiymat, s: kichik qo'shimcha } */
  function sheet(o) {
    var rows = o.rows || [], n = rows.length;
    var step = n ? Math.floor(772 / n) : 0;
    var vSize = n >= 5 ? 19 : n >= 4 ? 21 : 25;
    var lSize = n >= 5 ? 8.2 : n >= 4 ? 9 : 9.5;
    var cells = '';
    rows.forEach(function (r, i) {
      var x = 64 + i * step;
      if (i) cells += '<rect x="' + (x - 32) + '" y="402" width="1" height="46" fill="' + BRAND.line + '"/>';
      cells += '<text x="' + x + '" y="416" font-size="' + lSize + '" font-weight="700" letter-spacing="2.2" fill="#A2A7AE">' + esc(r.l) + '</text>' +
        '<text x="' + x + '" y="444" font-size="' + vSize + '" font-weight="800" letter-spacing="-0.4" fill="' + BRAND.ink + '">' + esc(r.v) +
          (r.s ? '<tspan font-size="14" font-weight="600" fill="#A2A7AE"> ' + esc(r.s) + '</tspan>' : '') + '</text>';
    });

    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 900 620" font-family="' + DOC_FONT + '">' +
      '<defs>' +
        '<linearGradient id="clSpine" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + BRAND.red2 + '"/><stop offset="0.5" stop-color="' + BRAND.red + '"/><stop offset="1" stop-color="' + BRAND.ink + '"/></linearGradient>' +
        '<linearGradient id="clPaper" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#FCFCFA"/><stop offset="1" stop-color="#F2F3F1"/></linearGradient>' +
        '<linearGradient id="clMark" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#1c2233"/><stop offset="1" stop-color="#141a29"/></linearGradient>' +
        '<clipPath id="clSheet"><rect x="0" y="0" width="900" height="620"/></clipPath>' +
      '</defs>' +
      '<g clip-path="url(#clSheet)">' +
        '<rect width="900" height="620" fill="url(#clPaper)"/>' +
        /* qog'oz hissi — deyarli ko'rinmas diagonal to'r */
        '<g stroke="' + BRAND.ink + '" stroke-width="0.4" opacity="0.03">' +
          '<path d="M-120 720 L680 -80"/><path d="M-50 720 L750 -80"/><path d="M20 720 L820 -80"/>' +
          '<path d="M90 720 L890 -80"/><path d="M160 720 L960 -80"/><path d="M230 720 L1030 -80"/>' +
          '<path d="M300 720 L1100 -80"/></g>' +
        '<rect x="0" y="0" width="10" height="620" fill="url(#clSpine)"/>' +

        markLogo(64, 50, 38) +
        '<text x="114" y="68" font-size="13" font-weight="800" letter-spacing="2.4" fill="' + BRAND.ink + '">UzLeeder</text>' +
        '<text x="114" y="82" font-size="8.6" font-weight="700" letter-spacing="3.4" fill="' + BRAND.soft + '">ACADEMY</text>' +

        '<text x="836" y="64" text-anchor="end" font-size="10" font-weight="700" letter-spacing="3.6" fill="' + BRAND.soft + '">' + esc(o.cert || 'SERTIFIKAT') + '</text>' +
        (o.id ? '<text x="836" y="82" text-anchor="end" font-size="9.5" font-weight="600" letter-spacing="1.3" fill="' + BRAND.faint + '" font-family="' + MONO_FONT + '">' + esc(o.id) + '</text>' : '') +

        '<rect x="64" y="110" width="772" height="1" fill="' + BRAND.line + '"/>' +

        '<text x="64" y="164" font-size="10.5" font-weight="700" letter-spacing="2.8" fill="' + BRAND.soft + '">' + esc(o.kicker) + '</text>' +
        '<text x="64" y="232" font-size="' + (String(o.name).length > 18 ? 46 : 62) + '" font-weight="800" letter-spacing="-1.8" fill="' + BRAND.ink + '">' + esc(o.name) + '</text>' +
        '<rect x="64" y="258" width="58" height="3" rx="1.5" fill="' + BRAND.red + '"/>' +
        '<text x="64" y="302" font-size="12" font-weight="600" fill="' + BRAND.body + '">' + esc(o.lead) + '</text>' +
        '<text x="64" y="342" font-size="' + (String(o.course).length > 34 ? 24 : 30) + '" font-weight="700" letter-spacing="-0.4" fill="' + BRAND.ink + '">' + esc(o.course) + '</text>' +
        (o.sub ? '<text x="64" y="368" font-size="12.5" font-weight="500" fill="' + BRAND.soft + '">' + esc(o.sub) + '</text>' : '') +

        (n ? '<rect x="64" y="392" width="772" height="1" fill="' + BRAND.line + '"/>' + cells : '') +

        /* imzo — quti nisbati imzo nisbatiga yaqin (600×416), aks holda
           preserveAspectRatio="meet" imzoni kichraytirib yuboradi */
        '<image href="' + SIG_SRC + '" xlink:href="' + SIG_SRC + '" x="58" y="470" width="182" height="126" preserveAspectRatio="xMinYMid meet"/>' +
        '<text x="64" y="606" font-size="8.5" font-weight="700" letter-spacing="1.8" fill="' + BRAND.soft + '">' +
          esc(o.founder || 'ASOSCHI · UZLEEDER ACADEMY') + '</text>' +

        /* rasmiy muhr — qo'llanmadagi geometriya, doim brend qizilida */
        uzStamp(786, 516, 104, BRAND.red, BRAND.ink) +

        '<text x="836" y="606" text-anchor="end" font-size="8.6" font-weight="500" fill="' + BRAND.faint + '">' + esc(o.note) + '</text>' +
      '</g></svg>';
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

    return sheet({
      cert: t.cert, kicker: t.certifies, name: name,
      lead: t.completing, course: parts.wk + ' — ' + L(unit.name).replace(parts.wk, '').replace(/^[\s—·-]+/, ''),
      sub: topics ? t.topics + ' ' + topics : t.path,
      rows: [
        { l: t.avg, v: avg, s: '/ 10' },
        { l: t.date, v: dateStr }
      ],
      note: uz ? 'Platforma sertifikati — rasmiy imtihon natijasi emas.'
               : 'A platform certificate — not an official result.'
    });
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

    var bandRows = [];
    if (last) {
      bandRows = [
        { l: t.overall, v: overall == null ? '—' : overall.toFixed(1) },
        { l: 'LISTENING', v: typeof last.l === 'number' ? last.l.toFixed(1) : '—' },
        { l: 'READING', v: typeof last.r === 'number' ? last.r.toFixed(1) : '—' },
        { l: 'WRITING', v: typeof last.w === 'number' ? last.w.toFixed(1) : '—' },
        { l: 'SPEAKING', v: typeof last.s === 'number' ? last.s.toFixed(1) : '—' }
      ];
    } else {
      bandRows = [{ l: t.date, v: dateStr }];
    }
    return sheet({
      cert: t.cert, kicker: t.certifies, name: name,
      lead: t.completing, course: t.course,
      sub: t.period + ': ' + EngCal.fmt(m.start) + ' – ' + EngCal.fmt(m.bufferTo) + ' · ' + t.date + ': ' + dateStr,
      rows: bandRows, note: t.note
    });
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
    return sheet({
      cert: t.cert, kicker: t.kicker, name: name,
      lead: t.completing, course: t.what, sub: t.note,
      rows: [
        { l: t.period, v: EngCal.fmt(w.mon) + ' – ' + EngCal.fmt(w.sun) },
        { l: t.no, v: String(n) }
      ],
      note: uz ? 'Platforma sertifikati — rasmiy imtihon natijasi emas.'
               : 'A platform certificate — not an official result.'
    });
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
    var gRows = [];
    if (o.score) gRows.push({ l: t.score, v: String(o.score) });
    gRows.push({ l: t.date, v: dateStr });
    return sheet({
      cert: t.cert, kicker: t.certifies, name: name,
      lead: t.completing, course: o.course || '', sub: o.sub || '',
      rows: gRows, note: t.note
    });
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
      signatureData().then(function (sigData) {
      // Imzo tasviri SVG ICHIDA bo'lsin — <img> orqali chizilayotgan SVG
      // sahifadagi fayllarni ko'rmaydi. Matn endi tizim shriftlarida, ya'ni
      // yuklab olish uchun tashqi shrift so'ralmaydi.
      var svg = active.build();
      if (sigData) svg = svg.split(SIG_SRC).join(sigData);
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
