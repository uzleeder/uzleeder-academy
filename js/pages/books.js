/* ==========================================================================
   Kitoblar moduli sahifalari
   --------------------------------------------------------------------------
     #/books        — uch kitob, bugungi vazifa, barcha unitlar ro'yxati
     #/books/v12    — lug'at uniti (20 so'z, faqat sinonim)
     #/books/r3     — o'qish matni + IELTS savollari
     #/books/l2     — tinglash bo'limi + 10 savol

   Savollar "javobni ko'rsatish" tugmasi bilan ishlaydi: avval o'zing yoz,
   keyin och. Javob bilan birga NEGA shundayligi ham chiqadi — IELTS'da
   javobning o'zidan ko'ra sababi muhimroq.
   ========================================================================== */
(function () {
  'use strict';

  /* Kun ma'lumotlarini bitta ro'yxatga yig'amiz */
  window.ENG_BOOK_VOCAB = [].concat(
    window.ENG_BOOK_VOCAB_1 || [], window.ENG_BOOK_VOCAB_2 || [], window.ENG_BOOK_VOCAB_3 || []
  );
  window.ENG_READING = [].concat(window.ENG_READING_1 || [], window.ENG_READING_2 || [], window.ENG_READING_3 || [], window.ENG_READING_4 || []);
  window.ENG_LISTENING = [].concat(window.ENG_LISTENING_1 || [], window.ENG_LISTENING_2 || [], window.ENG_LISTENING_3 || []);
  /* Qo'shimcha o'qish: diniy (payg'ambarlar, sahobalar, xalifalar) va
     tarixiy. Ular sikl emas — ketma-ket seriya: d-kun → d-matn.        */
  window.ENG_READ_REL = [].concat(window.ENG_READ_REL_1 || [], window.ENG_READ_REL_2 || []);
  window.ENG_READ_HIST = [].concat(window.ENG_READ_HIST_1 || [], window.ENG_READ_HIST_2 || []);

  var TRACKS = {
    ebook:     { list: function () { return ENG_READING; },   prefix: 'r', icon: 'doc',    key: 'ebook' },
    religious: { list: function () { return ENG_READ_REL; },  prefix: 'd', icon: 'mosque', key: 'religious' },
    history:   { list: function () { return ENG_READ_HIST; }, prefix: 't', icon: 'clock',  key: 'history' }
  };

  function vocabUnit(n) {
    for (var i = 0; i < ENG_BOOK_VOCAB.length; i++) if (ENG_BOOK_VOCAB[i].n === n) return ENG_BOOK_VOCAB[i];
    return null;
  }
  function readingOf(n, track) {
    var list = (TRACKS[track || 'ebook'] || TRACKS.ebook).list();
    for (var i = 0; i < list.length; i++) if (list[i].n === n) return list[i];
    return null;
  }

  /* ---------- kitobdagi joy (anchor) ------------------------------------
     Foydalanuvchi kitobni platformadan tezroq o'qishi mumkin. "Bugun
     kitobda 7B daman" desa — shu kundan boshlab sikl o'sha joydan davom
     etadi. Anchor = {day, no}: D-kunda N-matn. Keyingi kunlar: N+1, N+2 …
     24 dan keyin yana 1. Standart: 1-kun → 1-matn.                       */
  function cfg() { return Store.setting('books') || {}; }
  function cycleNo(day, anchor, len) {
    var a = anchor && anchor.day && anchor.no ? anchor : { day: 1, no: 1 };
    var i = (a.no - 1) + (day - a.day);
    i = ((i % len) + len) % len;
    return i + 1;
  }
  function readingNo(day) { return cycleNo(day, cfg().readingAnchor, ENG_BOOK.cycle.readingSets); }
  /* Diniy va tarixiy: 24 matn, 1-kundan boshlab, 25-kundan qaytadan */
  function extraNo(day) { return cycleNo(day, { day: 1, no: 1 }, 24); }
  function listeningNo(day) { return cycleNo(day, cfg().listeningAnchor, ENG_BOOK.cycle.listeningSets); }
  /* Kitobdagi mos matn — sikl raqamidan (1..24 → 1A..12B) */
  function readingRef(day) {
    var n = readingNo(day);
    var unit = Math.floor((n - 1) / 2) + 1, part = (n % 2 === 1) ? 'A' : 'B';
    var u = null;
    ENG_BOOK.readingUnits.forEach(function (x) { if (x.n === unit) u = x; });
    if (!u) return null;
    /* B matnining aniq sahifasi platformadagi matnda bo'lsa — o'shani olamiz */
    var r = readingOf(n);
    var page = (r && r.ref && r.ref.page) ? r.ref.page : u.page;
    return { unit: unit, part: part, page: page, theme: u.theme, title: part === 'A' ? u.a : u.b, no: n };
  }
  /* Matn uzunligini abzatslardan hisoblaymiz — qo'lda yozilgan son
     matn tahrirlanganda eskirib qoladi, hisoblangani esa hech qachon.  */
  function wordCount(r) {
    if (!r || !r.paras) return 0;
    var n = 0;
    r.paras.forEach(function (p) {
      n += (p.t || '').split(/\s+/).filter(function (w) { return w; }).length;
    });
    return n;
  }
  /* ---------- Matn rasmlari: har matnga 2 joy, o'zing yuklaysan ----------
     Tayyor rasm yo'q — har matn oldida ikkita bo'sh joy (slot 0/1). Rasm
     tanlansa brauzerda kichraytiriladi (eng uzun tomoni ≤ 1400px, JPEG) va:
       · bulut (Vercel Blob) sozlangan bo'lsa → Blob'ga, holatga faqat URL
         (Store.rdimg) → istalgan qurilmada ko'rinadi;
       · aks holda → shu qurilmadagi IndexedDB (MediaDB 'thumbs',
         kalit 'rd:<track>:<n>:<slot>'), holatga { local: true } belgisi —
         boshqa qurilmada "faqat yuklangan qurilmada" deb ko'rsatiladi.
     Izoh (cap) matn ostida tahrirlanadi, holatga sinxron. Movies/Profil
     bilan bir xil qolip — halol: soxta "bulut" yo'q.                    */
  var RD_SLOTS = 2;
  function rdimgKey(track, n, slot) { return 'rd:' + track + ':' + n + ':' + slot; }
  var rdimgUrlCache = {};   // local blob → objectURL (sahifa ichida qayta ishlatiladi)

  function readingFigures(track, n) {
    var h = '<div class="rd-figs" data-track="' + esc(track) + '" data-n="' + n + '">';
    for (var s = 0; s < RD_SLOTS; s++) {
      var rec = Store.rdimgGet(track, n, s);
      var id = 'rdImg_' + track + '_' + n + '_' + s;
      if (!rec) {
        h += '<label class="rd-fig empty" for="' + id + '"><input type="file" id="' + id + '" accept="image/*" hidden data-rdslot="' + s + '">' +
          '<span class="rd-fig-add">' + IC.image + '<b>' + esc(tr('rdImgAdd')) + '</b><small>' + esc(tr('rdImgAddS', { n: s + 1 })) + '</small></span></label>';
        continue;
      }
      h += '<figure class="rd-fig" data-rdslot="' + s + '">' +
        '<div class="rd-fig-img">' +
          (rec.url ? '<img src="' + esc(rec.url) + '" alt="' + esc(rec.cap || '') + '" loading="lazy" decoding="async">'
                   : '<img data-rdlocal="' + esc(rdimgKey(track, n, s)) + '" alt="' + esc(rec.cap || '') + '"><span class="rd-fig-miss" hidden>' + IC.image + esc(tr('rdImgLocalOnly')) + '</span>') +
          '<span class="rd-fig-tools no-print">' +
            '<label class="rd-fig-btn" title="' + esc(tr('rdImgReplace')) + '"><input type="file" accept="image/*" hidden data-rdslot="' + s + '">' + IC.refresh + '</label>' +
            '<button type="button" class="rd-fig-btn danger" data-rddel="' + s + '" title="' + esc(tr('delete')) + '">' + IC.trash + '</button>' +
          '</span>' +
        '</div>' +
        '<figcaption><input class="rd-fig-cap" data-rdcap="' + s + '" placeholder="' + esc(tr('rdImgCapPh')) + '" value="' + esc(rec.cap || '') + '" maxlength="120"></figcaption>' +
        '</figure>';
    }
    return h + '</div>';
  }

  /* Rasmni kichraytirib JPEG Blob qaytaradi (profil/loyiha bilan bir xil yondashuv) */
  function rdimgShrink(file, maxSide, q) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var k = Math.min(1, maxSide / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('blob')); }, 'image/jpeg', q);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    });
  }

  function readingFiguresMount() {
    var wrap = $('.rd-figs'); if (!wrap) return;
    var track = wrap.dataset.track, n = Number(wrap.dataset.n);

    /* Qurilmadagi (IndexedDB) rasmlarni ko'rsatish */
    $$('img[data-rdlocal]', wrap).forEach(function (img) {
      var key = img.dataset.rdlocal;
      var show = function (u) { img.src = u; };
      if (rdimgUrlCache[key]) { show(rdimgUrlCache[key]); return; }
      if (!window.MediaDB) { img.hidden = true; img.nextElementSibling.hidden = false; return; }
      MediaDB.get('thumbs', key).then(function (b) {
        if (!b) { img.hidden = true; img.nextElementSibling.hidden = false; return; }
        rdimgUrlCache[key] = URL.createObjectURL(b); show(rdimgUrlCache[key]);
      }).catch(function () { img.hidden = true; img.nextElementSibling.hidden = false; });
    });

    /* Yuklash / almashtirish */
    $$('input[type=file][data-rdslot]', wrap).forEach(function (inp) {
      inp.addEventListener('change', function () {
        var f = inp.files[0]; if (!f) return;
        var slot = Number(inp.dataset.rdslot);
        var fig = inp.closest('.rd-fig'); if (fig) fig.classList.add('busy');
        var prev = Store.rdimgGet(track, n, slot) || {};
        var key = rdimgKey(track, n, slot);
        rdimgShrink(f, 1400, 0.82).then(function (blob) {
          var useCloud = window.MediaCloud ? MediaCloud.check() : Promise.resolve(false);
          return useCloud.then(function (cloud) {
            if (cloud) {
              return MediaCloud.upload(new File([blob], key.replace(/:/g, '-') + '.jpg', { type: 'image/jpeg' })).then(function (b) {
                if (prev.url && prev.url !== b.url) MediaCloud.del(prev.url);
                Store.rdimgSet(track, n, slot, { url: b.url, cap: prev.cap || '' });
              });
            }
            if (!window.MediaDB) throw new Error('nodb');
            return MediaDB.set('thumbs', key, blob).then(function () {
              if (rdimgUrlCache[key]) { URL.revokeObjectURL(rdimgUrlCache[key]); delete rdimgUrlCache[key]; }
              Store.rdimgSet(track, n, slot, { local: true, cap: prev.cap || '' });
            });
          });
        }).then(function () { toast(tr('rdImgSaved'), 'ok'); App.render(); })
          .catch(function () { if (fig) fig.classList.remove('busy'); toast(tr('profImgErr'), 'warn'); });
      });
    });

    /* O'chirish */
    $$('[data-rddel]', wrap).forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm(tr('rdImgDelQ'))) return;
        var slot = Number(b.dataset.rddel), rec = Store.rdimgGet(track, n, slot), key = rdimgKey(track, n, slot);
        if (rec && rec.url && window.MediaCloud) MediaCloud.del(rec.url);
        if (window.MediaDB) MediaDB.del('thumbs', key).catch(function () {});
        if (rdimgUrlCache[key]) { URL.revokeObjectURL(rdimgUrlCache[key]); delete rdimgUrlCache[key]; }
        Store.rdimgDel(track, n, slot); App.render();
      });
    });

    /* Izoh — yozib bo'lgach 600 ms da saqlanadi */
    $$('[data-rdcap]', wrap).forEach(function (inp) {
      var t = null;
      inp.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          var slot = Number(inp.dataset.rdcap), rec = Store.rdimgGet(track, n, slot); if (!rec) return;
          rec.cap = inp.value.trim(); Store.rdimgSet(track, n, slot, rec);
        }, 600);
      });
    });
  }
  function listeningOf(n) {
    for (var i = 0; i < ENG_LISTENING.length; i++) if (ENG_LISTENING[i].n === n) return ENG_LISTENING[i];
    return null;
  }

  /* ---------- tinglash KITOBI 2 — Target Listening with Dictation ---------
     ENG_DICT: 12 test × (15 diktant + 30 savol). KUNLIK ME'YOR: 6 diktant +
     15 test savoli — ikki mustaqil, uzluksiz oqim (test chegarasi kunni
     bo'lmaydi; bir kun ikki testga tegishi mumkin).
       diktant: 180 ta → 30 kun · savol: 360 ta → 24 kun · keyin qaytadan.
     Anchor: {day, d, q} — d/q: shu kunning boshidagi GLOBAL indeks (0-based).
     Standart — foydalanuvchining REAL holati: 19-sen da 1-test 6-diktant /
     15-savolgacha → 1-kun (20-sen) d=6 (7–12), q=15 (16–30).
     Eski kitob (7 unit × 20 mashq) — 19-sen da TUGALLANGAN (listenBook().done). */
  function listenBook() {
    var c = cfg().listenBook || {};
    return { units: c.units || 7, anchor: c.anchor || { day: 1, unit: 1, half: 1 }, done: c.done !== false };
  }
  function dictAnchor() {
    var a = cfg().dictAnchor;
    /* Eski format {test, slot} (3 kunlik slotlar) → global indeks */
    if (a && a.test && a.d == null) { var per = 5; return { day: a.day, d: (a.test - 1) * 15 + (a.slot || 0) * per, q: (a.test - 1) * 30 + (a.slot || 0) * 10 }; }
    return a || { day: 1, d: 6, q: 15 };
  }
  /* Global indeksdan [{test, from, to}] bo'laklar (bir kun ikki testga tegsa ikkita) */
  function ranges(start, n, per) {
    var out = [], i = start;
    while (n > 0) {
      var t = Math.floor(i / per), off = i % per, take = Math.min(n, per - off);
      out.push({ test: t + 1, from: off + 1, to: off + take });
      i += take; n -= take;
    }
    return out;
  }
  function dictPlan(day) {
    var D = window.ENG_DICT;
    if (!D) return null;
    var a = dictAnchor(), T = D.meta.tests, dTot = T * D.meta.perTest, qTot = T * D.meta.qsPerTest;
    var pd = D.meta.perDayDict || 6, pq = D.meta.perDayQ || 15;
    var di = a.d + (day - a.day) * pd, qi = a.q + (day - a.day) * pq;
    var dPass = Math.max(1, Math.floor(di / dTot) + 1), qPass = Math.max(1, Math.floor(qi / qTot) + 1);
    di = ((di % dTot) + dTot) % dTot; qi = ((qi % qTot) + qTot) % qTot;
    /* Aylanish oxirida qoldiq: oxiriga yetgan bo'lak + boshidan davomi */
    var dR = ranges(di, pd, D.meta.perTest).map(function (r) { return r.test > T ? Object.assign(r, { test: r.test - T }) : r; });
    var qR = ranges(qi, pq, D.meta.qsPerTest).map(function (r) { return r.test > T ? Object.assign(r, { test: r.test - T }) : r; });
    var f = dR[0], l = dR[dR.length - 1];
    return { d: dR, q: qR, dIdx: di, qIdx: qi, pass: Math.max(dPass, qPass), dPass: dPass, qPass: qPass,
      /* eski maydonlar (books2.js, jadval): birinchi bo'lak */
      test: f.test, dFrom: f.from, dTo: l.test === f.test ? l.to : D.meta.perTest, qFrom: qR[0].from, qTo: qR[qR.length - 1].test === qR[0].test ? qR[qR.length - 1].to : D.meta.qsPerTest };
  }
  function listenPlan(day) { return dictPlan(day); }
  function rangeLabel(rs, pre) { return rs.map(function (r) { return 'T' + r.test + ' ' + pre + r.from + '–' + r.to; }).join(' + '); }
  function listenLabel(day) {
    var p = dictPlan(day);
    if (!p) return '';
    return rangeLabel(p.d, 'D') + ' · ' + rangeLabel(p.q, 'Q') + (p.pass > 1 ? ' · ' + tr('booksPassN', { n: p.pass }) : '');
  }
  /* Kun ichida diktant bormi (books2.js "bugun" belgisi uchun) */
  function dictInDay(p, t, e) { return !!p && p.d.some(function (r) { return r.test === t && e >= r.from && e <= r.to; }); }
  /* Diktant holati: platformada tekshirilgan yozuv ('dic:T:E') yoki kitobda
     (platformadan oldin) qilingan — startState. */
  function dictRec(t, e) { return Store.readGet('dic:' + t + ':' + e) || null; }
  function dictDone(t, e) {
    var r = dictRec(t, e);
    if (r && r.score != null) return true;
    var ss = window.ENG_DICT && ENG_DICT.meta.startState;
    return !!(ss && (t < ss.test || (t === ss.test && e <= ss.dictDone)));
  }
  /* Test savollari — 15 talik yarimlar: 'dq:T:0' (1–15), 'dq:T:1' (16–30); startState ham hisobga */
  function dictQDone(t, half) {
    if (Store.flag('dq:' + t + ':' + half)) return true;
    var ss = window.ENG_DICT && ENG_DICT.meta.startState;
    return !!(ss && (t < ss.test || (t === ss.test && (half + 1) * 15 <= ss.testDone)));
  }
  function halfOf(r) { return r.from <= 15 ? 0 : 1; }
  function dictEx(t, e) {
    var D = window.ENG_DICT; if (!D) return null;
    var T = D.tests[t - 1]; if (!T) return null;
    return T.ex[e - 1] || null;
  }
  function dictDoneCount() {
    var n = 0, D = window.ENG_DICT; if (!D) return 0;
    D.tests.forEach(function (T) { T.ex.forEach(function (e) { if (dictDone(T.n, e.n)) n++; }); });
    return n;
  }
  function readingLabel(day) {
    var ref = readingRef(day);
    if (!ref) return '';
    var r = readingOf(ref.no);
    return ref.unit + ref.part + ' · ' + (r ? r.title : ref.title);
  }

  window.Books = {
    vocabUnit: vocabUnit, readingOf: readingOf, listeningOf: listeningOf,
    readingNo: readingNo, listeningNo: listeningNo, readingRef: readingRef, tracks: TRACKS, vocabTodayLabel: vocabTodayLabel, wordsAddedOn: wordsAddedOn,
    listenPlan: listenPlan, listenLabel: listenLabel, readingLabel: readingLabel, listenBook: listenBook,
    dictPlan: dictPlan, dictEx: dictEx, dictDone: dictDone, dictQDone: dictQDone, dictRec: dictRec, dictDoneCount: dictDoneCount, dictAnchor: dictAnchor, dictInDay: dictInDay,
    setListenBook: function (units, unit, half) {
      var c = cfg();
      c.listenBook = { units: units, anchor: { day: Books.today(), unit: unit, half: half }, done: (c.listenBook || {}).done !== false };
      Store.setSetting('books', c);
    },
    /* Diktant kitobida joyim: bugungi kun shu diktant (test, mashq) va shu savol (test, savol) dan boshlanadi */
    setDictAnchor: function (dTest, dEx, qTest, qN) {
      var D = window.ENG_DICT, c = cfg();
      c.dictAnchor = { day: Books.today(), d: (dTest - 1) * D.meta.perTest + (dEx - 1), q: (qTest - 1) * D.meta.qsPerTest + (qN - 1) };
      Store.setSetting('books', c);
    },
    setOldListenDone: function (on) { var c = cfg(); c.listenBook = Object.assign({}, c.listenBook || {}, { done: !!on }); Store.setSetting('books', c); },
    /* Bugungi kunga anchor qo'yish: "kitobda hozir N-matndaman" */
    setReadingAnchor: function (no) {
      var c = cfg(); c.readingAnchor = { day: Books.today(), no: no }; Store.setSetting('books', c);
    },
    setListeningAnchor: function (no) {
      var c = cfg(); c.listeningAnchor = { day: Books.today(), no: no }; Store.setSetting('books', c);
    },
    setListeningNote: function (text) {
      var c = cfg(); c.listeningNote = (text || '').trim(); Store.setSetting('books', c);
    },
    listeningNote: function () { return cfg().listeningNote || ''; },
    /* Bugungi kun — KALENDAR kuni (kurs boshlanishidan uzluksiz). Kurs
       kuni emas: kitob rejasi bo'sh kunlarda ham to'xtamaydi.            */
    today: function () {
      var d = window.EngCal ? EngCal.calDay() : 0;
      if (!d || d < 1) d = 1;
      return d;
    }
  };

  /* ====================== KITOBLAR MARKAZI (tanlov) ===================
     #/books — beshta kitob/yo'nalish, har biri o'z sahifasiga kiradi:
       ebook      — Reading Explorer mavzularidagi IELTS matnlari
       religious  — diniy o'qish
       history    — tarixiy o'qish
       listen     — tinglash KITOBI rejasi (unit · mashq · kun)
       vocab      — 4000 Essential English Words 4 (sinonimli)
     Kurslar markazi bilan bir xil qolip: katta karta → kirish.           */

  window.PageBooks = function () {
    var day = Books.today();
    var rn = readingNo(day), rref = readingRef(day), xn = extraNo(day);
    var r = readingOf(rn), rel = readingOf(xn, 'religious'), hist = readingOf(xn, 'history');
    var lp = listenPlan(day), lb = listenBook();

    var h = '<div class="page stagger">';
    h += '<header class="page-head">' +
      '<div class="eyebrow">' + esc(tr('booksKick')) + '</div>' +
      '<h1>' + esc(L(ENG_BOOK.meta.title)) + '</h1>' +
      '<p class="lede">' + esc(tr('booksChooseLede')) + '</p></header>';

    h += '<div class="course-pick books">';
    h += bookCard('ebook', IC.doc, tr('booksTrack_ebook'), ENG_BOOK.sources[1].title,
      tr('booksTrackS_ebook'), ENG_READING.length + ' / 24',
      r ? (rref.unit + rref.part + ' · ' + r.title) : '—', 'books/ebook');
    h += bookCard('religious', IC.mosque, tr('booksTrack_religious'), tr('booksTierT'),
      tr('booksTrackS_religious'), ENG_READ_REL.length + ' / 24',
      rel ? (tr('day') + ' ' + xn + ' · ' + rel.title) : '—', 'books/religious');
    h += bookCard('history', IC.clock, tr('booksTrack_history'), tr('booksTierT'),
      tr('booksTrackS_history'), ENG_READ_HIST.length + ' / 24',
      hist ? (tr('day') + ' ' + xn + ' · ' + hist.title) : '—', 'books/history');
    var DD = window.ENG_DICT, DB = window.ENG_DEST_B2;
    h += bookCard('listen', IC.headphones, tr('engSkillListening'), DD ? DD.meta.short : ENG_BOOK.sources[2].title,
      tr('booksDictS'), dictDoneCount() + ' / ' + (DD ? DD.meta.tests * DD.meta.perTest : 0) + ' ' + tr('booksDictN'),
      listenLabel(day), 'books/listen');
    h += bookCard('vocab', IC.book, tr('engSkillVocab'), DB ? DB.meta.short : '',
      tr('booksDestS'), (DB ? DB.units.length : 0) + ' unit · ' + (DB ? DB.meta.secs.length : 5) + ' ' + tr('booksDestSecs'),
      vocabTodayLabel(day), 'books/vocab');
    h += bookCard('ess4', IC.book, ENG_BOOK.sources[0].title, tr('booksOptional'),
      tr('booksSynOnly') + ' · ' + tr('booksEss4Opt'), (ENG_BOOK_VOCAB.length * 20) + ' ' + tr('engWords'),
      tr('booksOptional'), 'books/ess4');
    h += '</div>';

    /* Daftarlar (copybook) — o'z qo'lim bilan yoziladigan uchta daftar */
    h += '<div class="section-head"><div class="sh-n">' + IC.pen + '</div><div><h2>' + esc(tr('copyT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('copyS')) + '</div></div></div>';
    var cnt = window.Copybook ? Copybook.counts() : { vocab: 0, english: 0, coding: 0 };
    h += '<div class="course-pick books copy-pick">';
    h += bookCard('cvocab', IC.mic, tr('copyVocab'), tr('copyTag'), tr('copyVocabD'), cnt.vocab + ' ' + tr('engWords'), vocabTodayLabel(day), 'copy/vocab');
    h += bookCard('cenglish', IC.pen, tr('copyEnglish'), tr('copyTag'), tr('copyEnglishD'), cnt.english + ' ' + tr('copyEntries'), tr('copyEnglishToday'), 'copy/english');
    h += bookCard('ccoding', IC.code, tr('copyCoding'), tr('copyTag'), tr('copyCodingD'), cnt.coding + ' ' + tr('copyEntries'), tr('copyCodingToday'), 'copy/coding');
    /* Erkin daftar — bo'linmagan, o'zing nomlaydigan katta varaq (matematika va h.k.) */
    h += bookCard('cfree', IC.notebook, tr('copyFree'), tr('copyTag'), tr('copyFreeD'), (cnt.free || 0) + ' ' + tr('copyFreeN'), tr('copyFreeToday'), 'copy/free');
    h += '</div>';

    /* Kitobdagi joyim — platforma foydalanuvchining REAL joyiga ergashadi */
    h += anchorForm(day, rref, listeningNo(day));

    /* Halol izoh — mualliflik huquqi (qisqa) */
    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span>' +
      '<div><h4>' + esc(tr('booksCopyT')) + '</h4>' + esc(L(ENG_BOOK.meta.copyright)) + '</div></div>';

    return h + '</div>';
  };

  /* Bugungi ikki lug'at uniti: "1–2-unit · Ta'm … / Sayohat …" */
  /* Bugun daftarga yozilgan so'zlar soni (C-book bosqichi uchun) */
  function wordsAddedOn(key) {
    var from = new Date(key + 'T00:00:00').getTime(), to = from + 86400000, n = 0;
    Store.copyList('vocab').forEach(function (e) { var t = e.created || e.at || 0; if (t >= from && t < to && (e.word || '').trim()) n++; });
    return n;
  }
  function vocabTodayLabel(day) {
    var d = ENG_BOOK.destFor(day);
    if (!d) return '—';
    return 'Unit ' + d.unit + ' · ' + d.secName + ' (' + d.items.length + ')' + (d.pass > 1 ? ' · ' + tr('booksPassN', { n: d.pass }) : '');
  }

  function bookCard(kind, icon, title, tag, desc, stat, today, route) {
    return '<button class="cp-card bk ' + kind + '" data-go="' + route + '">' +
      '<div class="cp-top"><span class="cp-ic">' + icon + '</span><span class="cp-tag">' + esc(tag) + '</span></div>' +
      '<h2>' + esc(title) + '</h2><p>' + esc(desc) + '</p>' +
      '<div class="cp-stats"><span><b>' + esc(stat) + '</b></span></div>' +
      '<div class="cp-next"><span>' + esc(tr('coursesToday')) + '</span><b>' + esc(today) + '</b></div>' +
      '<div class="cp-go">' + esc(tr('coursesEnter')) + IC.arrowR + '</div></button>';
  }

  /* ====================== BITTA O'QISH YO'NALISHI ===================== */

  window.PageBookTrack = function (track) {
    var T = TRACKS[track] || TRACKS.ebook;
    var day = Books.today();
    var no = track === 'ebook' ? readingNo(day) : extraNo(day);
    var r = readingOf(no, track);
    var rref = track === 'ebook' ? readingRef(day) : null;
    var list = T.list();

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(L(ENG_BOOK.meta.title)) + '</div>' +
      '<h1>' + esc(tr('booksTrack_' + track)) + '</h1>' +
      '<p class="lede">' + esc(tr('booksTrackS_' + track)) + '</p></header>';

    if (track !== 'ebook') {
      h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span><div><h4>' + esc(tr('booksTierT')) + '</h4>' + esc(tr('booksTierS')) + '</div></div>';
    }

    /* Bugungi matn */
    h += sectionHead(1, tr('booksTodayT', { n: day }), r ? r.title : tr('engSoon'));
    h += '<div class="bk-today">' + taskCard(track, IC[T.icon], tr('engSkillReading'),
      r ? r.title : '', r ? (r.tier === 'easy' ? tr('booksTierEasy') + ' · ' : '') + tr('booksQs', { n: r.qs.length }) : tr('engSoon'),
      r ? 'books/' + T.prefix + no : null,
      rref ? tr('booksBookRef', { u: rref.unit + rref.part, p: rref.page }) : (ENG_BOOK.passOf(day) > 1 ? tr('booksPassN', { n: ENG_BOOK.passOf(day) }) : '')) + '</div>';

    /* Holat bo'yicha: davom etish · saqlangan · tugallangan (real natijalardan) */
    var stOf = function (x) { return Store.readGet(T.prefix + x.n) || null; };
    var lastR = Store.lastGet('reading');
    var completed = list.filter(function (x) { var s = stOf(x); return s && s.score != null; });
    var savedL = list.filter(function (x) { return !!Store.bookmark('read:' + track + ':' + x.n); });
    var statusRow = function (x, extra) { var s = stOf(x) || {}; return '<button class="rv-soon-row" data-go="books/' + T.prefix + x.n + '"><span class="chip">' + (track === 'ebook' ? esc(tr('booksTextN', { n: x.n })) : esc(tr('day')) + ' ' + x.n) + '</span><b>' + esc(x.title) + '</b><span class="rv-date">' + (s.score != null ? s.score + '/' + s.total + (s.wpm ? ' · ' + s.wpm + ' wpm' : '') : (extra || '')) + '</span></button>'; };
    h += '<div class="an-two">' +
      '<div class="card"><h3 class="card-title"><span class="num">' + IC.arrowR + '</span>' + esc(tr('rsContinue')) + '</h3>' +
        (lastR ? '<button class="cont-chip" data-go="' + esc(lastR.route) + '" style="width:100%"><span class="cc-k">' + esc(tr('continueLabel')) + '</span><b>' + esc(lastR.title) + '</b><i>' + esc(fmtDate(lastR.at)) + '</i></button>' : '<p class="hint">' + esc(tr('rsContinueNone')) + '</p>') +
        (savedL.length ? '<div class="gc-l" style="margin-top:12px">' + esc(tr('rsSaved')) + ' · ' + savedL.length + '</div><div class="rv-soon">' + savedL.map(function (x) { return statusRow(x); }).join('') + '</div>' : '') + '</div>' +
      '<div class="card"><h3 class="card-title"><span class="num">' + IC.check + '</span>' + esc(tr('rsCompleted')) + ' · ' + completed.length + ' / ' + list.length + '</h3>' +
        (completed.length ? '<div class="rv-soon">' + completed.slice(-6).reverse().map(function (x) { return statusRow(x); }).join('') + '</div>' : '<p class="hint">' + esc(tr('rsCompletedNone')) + '</p>') + '</div>' +
      '</div>';

    /* Barcha matnlar */
    h += sectionHead(2, tr('booksAllTexts'), list.length + ' · ' + tr('booksCycle24'));
    h += '<div class="bk-grid">';
    list.forEach(function (x) {
      var s = stOf(x);
      h += '<button class="bk-unit ' + T.prefix + (x.n === no ? ' today' : '') + (s && s.score != null ? ' done' : '') + '" data-go="books/' + T.prefix + x.n + '">' +
        '<span class="bu-n">' + IC[T.icon] + ' ' + (track === 'ebook' ? esc(tr('booksTextN', { n: x.n })) : esc(tr('day')) + ' ' + x.n) +
        (x.tier === 'easy' ? ' · ' + esc(tr('booksTierEasy')) : '') + (s && s.score != null ? ' · ' + s.score + '/' + s.total : '') + '</span>' +
        '<span class="bu-t">' + esc(x.title) + '</span>' +
        '<span class="bu-w">' + wordCount(x) + ' words · ' + x.qs.length + ' Q</span></button>';
    });
    h += '</div>';

    /* Reading Explorer xaritasi — faqat ebook */
    if (track === 'ebook') {
      h += sectionHead(3, tr('booksReadingMap'), ENG_BOOK.sources[1].title);
      h += '<div class="bk-grid wide">';
      ENG_BOOK.readingUnits.forEach(function (x) {
        h += '<div class="bk-unit static"><span class="bu-n">' + tr('booksUnitN', { n: x.n }) + ' · p.' + x.page + '</span>' +
          '<span class="bu-t">' + esc(L(x.theme)) + '</span>' +
          '<span class="bu-w">A: ' + esc(x.a) + '<br>B: ' + esc(x.b) + '</span></div>';
      });
      h += '</div>';
    }

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button><span></span></div>';
    return h + '</div>';
  };

  /* ====================== TINGLASH KITOBI REJASI ====================== */

  window.PageBookListen = function () {
    var day = Books.today();
    var D = window.ENG_DICT, lb = listenBook(), lp = dictPlan(day);
    var l = listeningOf(listeningNo(day));

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(L(ENG_BOOK.meta.title)) + '</div>' +
      '<h1>' + esc(tr('engSkillListening')) + ' — ' + esc(D ? D.meta.short : '') + '</h1>' +
      '<p class="lede">' + esc(tr('booksDictLede')) + '</p></header>';
    if (!D || !lp) return h + '</div>';

    /* Bugun: 6 diktant (platformada, tekshiriladi) + 15 test savoli (kitobda, kalit shu yerda).
       Bo'laklar: kun ikki testga tegsa, ikkalasi ham ko'rsatiladi. */
    h += sectionHead(1, tr('booksTodayT', { n: day }), listenLabel(day));
    h += '<div class="dict-today">';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.pen + '</span>' + esc(tr('booksDictT')) + ' · ' + rangeLabel(lp.d, '') + '</h3>' +
      '<p class="hint">' + esc(tr('booksDictHow')) + '</p><div class="dict-list">';
    lp.d.forEach(function (r) {
      var T = D.tests[r.test - 1];
      for (var e = r.from; e <= r.to; e++) {
        var ex = T.ex[e - 1], rec = dictRec(r.test, e), dn = dictDone(r.test, e);
        h += '<button class="dict-row' + (dn ? ' done' : '') + '" data-go="books/dict/' + r.test + '/' + e + '">' +
          '<span class="dr-n">' + e + '</span><span class="dr-t">Test ' + r.test + ' · Track ' + ex.track + ' <i>' + esc(ex.dur) + '</i></span>' +
          '<span class="dr-s">' + (rec && rec.score != null ? rec.score + '/' + rec.total : (dn ? esc(tr('booksDictInBook')) : esc(tr('booksDictOpen')))) + '</span>' + (dn ? IC.check : IC.arrowR) + '</button>';
      }
    });
    h += '</div></div>';
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('booksDictQT')) + ' · ' + rangeLabel(lp.q, '') + '</h3>' +
      '<p class="hint">' + esc(tr('booksDictQHow')) + '</p>';
    lp.q.forEach(function (r) {
      var keyStr = (D.keys[r.test] || '').slice(r.from - 1, r.to), hf = halfOf(r), qd = dictQDone(r.test, hf);
      h += '<div class="gc-l" style="margin-top:8px">Test ' + r.test + ' · ' + r.from + '–' + r.to + '</div>' +
        '<details class="dict-key"><summary>' + IC.eye + esc(tr('booksDictKey')) + '</summary><div class="dk-grid">' +
        keyStr.split('').map(function (k, i) { return '<span><b>' + (r.from + i) + '</b>' + k + '</span>'; }).join('') + '</div></details>' +
        '<label class="bq-mark dict-qdone"><input type="checkbox" class="dqDone" data-t="' + r.test + '" data-s="' + hf + '"' + (qd ? ' checked' : '') + '> ' + esc(tr('booksDictQDone')) + ' (' + (hf ? '16–30' : '1–15') + ')</label>';
    });
    h += '</div>';
    h += '</div>';

    /* Platformadagi qo'shimcha IELTS bo'limi (ixtiyoriy) */
    if (l) h += '<div class="bk-today">' + taskCard('listening', IC.headphones, tr('booksExtraT'), L(l.title), 'Section ' + l.section + ' · ' + tr('booksQs', { n: l.qs.length }), 'books/l' + listeningNo(day), tr('booksOptional')) + '</div>';

    h += anchorForm(day, readingRef(day), listeningNo(day));

    /* 12 test — xarita: har test 3 slot, holat */
    h += sectionHead(2, tr('booksDictMap'), tr('booksDictMapS'));
    h += '<div class="dict-map">';
    D.tests.forEach(function (Tt) {
      var doneN = Tt.ex.filter(function (x) { return dictDone(Tt.n, x.n); }).length;
      h += '<div class="dm-test' + (Tt.n === lp.test ? ' today' : '') + (doneN === Tt.ex.length ? ' done' : '') + '"><div class="dm-h"><b>Test ' + Tt.n + '</b><span>' + doneN + '/' + Tt.ex.length + ' · Track ' + ((Tt.n - 1) * 30 + 1) + '–' + (Tt.n * 30) + '</span></div><div class="dm-ex">';
      Tt.ex.forEach(function (x) {
        var r = dictRec(Tt.n, x.n), dn = dictDone(Tt.n, x.n);
        h += '<button class="dm-e' + (dn ? ' done' : '') + (dictInDay(lp, Tt.n, x.n) ? ' cur' : '') + '" data-go="books/dict/' + Tt.n + '/' + x.n + '" title="Track ' + x.track + (r && r.score != null ? ' · ' + r.score + '/' + r.total : '') + '">' + x.n + '</button>';
      });
      h += '</div><div class="dm-q">' + [0, 1].map(function (hf) { return '<span class="' + (dictQDone(Tt.n, hf) ? 'on' : '') + '">Q ' + (hf * 15 + 1) + '–' + (hf * 15 + 15) + '</span>'; }).join('') + '</div></div>';
    });
    h += '</div>';

    /* 140 kunlik jadval — kun, sana, test · diktant · savollar */
    h += sectionHead(3, tr('booksListenSched'), tr('booksDictSchedS'));
    h += '<div class="sk-table"><div class="sk-row head"><span>#</span><span>' + esc(tr('date')) + '</span><span>' + esc(tr('engMin')) + '</span><span>' + esc(tr('booksInBook')) + '</span><span></span></div>';
    var S = window.ENG_SKILLS;
    for (var d = 1; d <= ENGLISH.meta.days; d++) {
      var typeMap = { study: 'heavy', class: 'class', test: 'rest' };
      var type = typeMap[EngCal.dayType(d)] || 'heavy';
      var mins = S ? (S.minutes[type] || S.minutes.heavy).listening : 45;
      var cd = EngCal.calOf(d);
      var p = dictPlan(cd);
      var lsOn = Store.flag('ls:' + cd);
      h += '<div class="sk-row' + (cd === day ? ' today' : '') + (lsOn ? ' done' : '') + ' ty-' + EngCal.dayType(d) + '">' +
        '<span class="sk-n">' + d + '</span><span class="sk-d">' + esc(EngCal.fmt(EngCal.dayKey(d))) + '</span>' +
        '<span class="sk-m">' + mins + '</span>' +
        '<span class="sk-t">' + esc(rangeLabel(p.d, 'D') + ' · ' + rangeLabel(p.q, 'Q')) + (p.pass > 1 ? ' <i>' + esc(tr('booksPassN', { n: p.pass })) + '</i>' : '') + '</span>' +
        '<span class="sk-x"><button class="hb-check" data-lsdone="' + cd + '" role="checkbox" aria-checked="' + lsOn + '" title="' + esc(tr('lsDone')) + '">' + (lsOn ? IC.check : '') + '</button></span></div>';
    }
    h += '</div>';

    /* Eski kitob — tugallangan */
    h += sectionHead(4, tr('booksOldListenT'), ENG_BOOK.sources[2].title);
    h += '<div class="callout ' + (lb.done ? 'good' : 'tip') + '"><span class="co-ic">' + (lb.done ? IC.check : IC.headphones) + '</span><div><h4>' + esc(lb.done ? tr('booksOldListenDone') : tr('booksOldListenOpen')) + '</h4>' +
      esc(tr('booksOldListenS', { u: lb.units })) + ' <button class="btn btn-ghost btn-sm" id="oldLsToggle">' + esc(lb.done ? tr('booksOldListenReopen') : tr('booksOldListenMark')) + '</button></div></div>';

    /* Platformadagi qo'shimcha bo'limlar */
    if (ENG_LISTENING.length) {
      h += sectionHead(5, tr('booksExtraT'), tr('booksExtraS'));
      h += '<div class="bk-grid">';
      ENG_LISTENING.forEach(function (x) {
        h += '<button class="bk-unit l" data-go="books/l' + x.n + '">' +
          '<span class="bu-n">' + IC.headphones + ' Section ' + x.section + '</span>' +
          '<span class="bu-t">' + esc(L(x.title)) + '</span>' +
          '<span class="bu-w">' + x.qs.length + ' Q</span></button>';
      });
      h += '</div>';
    }

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button><span></span></div>';
    return h + '</div>';
  };

  /* ====================== LUG'AT KITOBI =============================== */

  window.PageBookVocabList = function () {
    var day = Books.today();
    /* 2026-09-20 dan bu kitob IXTIYORIY: kunlik reja Destination B2 da.
       Unitlar saqlanadi — sinonimli lug'at va daftarga qo'shish ishlaydi. */
    var vus = [], pass = 1;

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(L(ENG_BOOK.meta.title)) + '</div>' +
      '<h1>' + esc(ENG_BOOK.sources[0].title) + '</h1>' +
      '<p class="lede">' + esc(tr('booksEss4Lede')) + '</p></header>';
    h += '<div class="callout tip"><span class="co-ic">' + IC.bulb + '</span><div><h4>' + esc(tr('booksOptional')) + '</h4>' + esc(tr('booksEss4Opt')) + ' <button class="btn btn-ghost btn-sm" data-go="books/vocab">' + IC.arrowR + 'Destination B2</button></div></div>';

    h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span>' +
      '<div><h4>' + esc(tr('booksVocabRuleT')) + '</h4>' + esc(L(ENG_BOOK.meta.vocabRule)) + '</div></div>';

    h += sectionHead(1, tr('booksAllUnits'), tr('booksAllUnitsS', { n: ENG_BOOK_VOCAB.length * 20 }));
    h += '<div class="bk-grid">';
    ENG_BOOK_VOCAB.forEach(function (x) {
      h += '<button class="bk-unit' + (vus.indexOf(x.n) >= 0 ? ' today' : '') + '" data-go="books/v' + x.n + '">' +
        '<span class="bu-n">' + tr('booksUnitN', { n: x.n }) + '</span>' +
        '<span class="bu-t">' + esc(L(x.theme)) + '</span>' +
        '<span class="bu-w">' + x.words.length + ' ' + esc(tr('engWords')) + '</span></button>';
    });
    h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button><span></span></div>';
    return h + '</div>';
  };
  /* "Kitobda qayerdaman" — o'qish uchun 1A…12B tanlovi, tinglash uchun
     bo'lim raqami + erkin izoh ("Unit 5 · 11–20"). Saqlanganda bugungi
     kun anchor bo'ladi: ertaga avtomatik keyingisi.                     */
  function anchorForm(day, rref, ln) {
    var h = '<details class="bk-anchor"><summary>' + IC.book + esc(tr('booksWhereAmI')) +
      '<span class="ba-cur">' + (rref ? rref.unit + rref.part : '—') + ' · ' + esc(listenLabel(day)) + '</span></summary>' +
      '<div class="ba-body"><p class="hint">' + esc(tr('booksWhereAmIS')) + '</p>' +
      '<div class="ba-row"><label>' + esc(tr('engSkillReading')) + '</label><select class="input" id="baReading">';
    ENG_BOOK.readingUnits.forEach(function (u) {
      ['A', 'B'].forEach(function (p) {
        var no = (u.n - 1) * 2 + (p === 'A' ? 1 : 2);
        h += '<option value="' + no + '"' + (rref && rref.no === no ? ' selected' : '') + '>' + u.n + p + ' — ' + esc(p === 'A' ? u.a : u.b) + '</option>';
      });
    });
    h += '</select></div>';

    /* Diktant kitobi: bugun qaysi diktant (test · mashq) va qaysi savol (test · №) dan boshlanadi */
    var lp = dictPlan(day) || { d: [{ test: 1, from: 1 }], q: [{ test: 1, from: 1 }] };
    h += '<div class="ba-row"><label>' + esc(tr('engSkillListening')) + '</label>' +
      '<div class="ba-inline">' +
        '<span>' + esc(tr('booksDictT')) + ' · Test</span><input class="input" type="number" min="1" max="12" id="baDTest" value="' + lp.d[0].test + '">' +
        '<span>№</span><input class="input" type="number" min="1" max="15" id="baDEx" value="' + lp.d[0].from + '">' +
      '</div>' +
      '<div class="ba-inline">' +
        '<span>' + esc(tr('booksDictQT')) + ' · Test</span><input class="input" type="number" min="1" max="12" id="baQTest" value="' + lp.q[0].test + '">' +
        '<span>№</span><input class="input" type="number" min="1" max="30" id="baQN" value="' + lp.q[0].from + '">' +
      '</div></div>' +
      '<div class="ba-row"><span></span><button class="btn btn-primary btn-sm" id="baSave">' + esc(tr('save')) + '</button></div>' +
      '</div></details>';
    return h;
  }

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div>' +
      '<h2>' + esc(title) + '</h2>' +
      (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }

  function taskCard(kind, icon, label, title, meta, route, note) {
    var inner = '<span class="bt-top">' + icon + esc(label) + '</span>' +
      '<span class="bt-t">' + esc(title || '—') + '</span>' +
      '<span class="bt-m">' + esc(meta) + '</span>' +
      (note ? '<span class="bt-n">' + esc(note) + '</span>' : '');
    return route
      ? '<button class="bk-task ' + kind + '" data-go="' + route + '">' + inner + IC.arrowR + '</button>'
      : '<div class="bk-task ' + kind + ' off">' + inner + '</div>';
  }

  /* ====================== LUG'AT UNITI ================================ */

  window.PageBookVocab = function (n) {
    var u = vocabUnit(n);
    if (!u) return notFound(tr('booksUnitN', { n: n }));

    var h = '<div class="page stagger">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(ENG_BOOK.sources[0].title) + '</div>' +
      '<h1>' + esc(tr('booksUnitN', { n: u.n })) + ' — ' + esc(L(u.theme)) + '</h1>' +
      '<div class="lesson-meta">' +
        (window.bookmarkBtn ? bookmarkBtn('vocab:' + u.n, 'books/v' + u.n, tr('booksUnitN', { n: u.n }) + ' — ' + L(u.theme), 'vocab') : '') +
        '<span class="chip topic">' + u.words.length + ' ' + esc(tr('engWords')) + '</span>' +
        '<span>' + esc(tr('booksSynOnly')) + '</span>' +
      '</div></header>';

    h += '<div class="callout tip"><span class="co-ic">' + IC.bulb + '</span><div>' +
      esc(tr('booksVocabHow')) + '</div></div>';

    /* So'z holati daftar + SRS dan: yangi · o'rganilmoqda · tanish · mahorat.
       "Daftarga qo'shish" — unit so'zlarini bo'sh varaq qilib qo'shadi (sinonim tayyor). */
    var byWord = {}; Store.copyList('vocab').forEach(function (e) { byWord[(e.word || '').toLowerCase()] = e; });
    var inBook = u.words.filter(function (w) { return byWord[w.w.toLowerCase()]; }).length;
    h += '<div class="sync-actions" style="margin:-6px 0 14px"><button class="btn ' + (inBook === u.words.length ? 'btn-ghost' : 'btn-primary') + ' btn-sm" id="vuAdd" data-unit="' + u.n + '"' + (inBook === u.words.length ? ' disabled' : '') + '>' + IC.mic + esc(inBook === u.words.length ? tr('vuAllIn') : tr('vuAdd', { n: u.words.length - inBook })) + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-go="copy/vocab">' + IC.notebook + esc(tr('copyVocab')) + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-go="practice">' + IC.target + esc(tr('practiceCenter')) + '</button></div>';

    h += '<div class="voc-book">';
    u.words.forEach(function (w, i) {
      var e = byWord[w.w.toLowerCase()], rv = e && window.Review ? Store.reviewAll()['vocab:' + e.id] : null;
      var st = e ? Review.status(rv) : null;
      h += '<div class="vb-row">' +
        '<div class="vb-head"><span class="vb-n">' + (i + 1) + '</span>' +
          '<b>' + esc(w.w) + '</b><span class="vb-pos">' + esc(w.pos) + '</span>' +
          (st ? '<span class="rv-st st-' + st + '">' + esc(tr('rvSt_' + st)) + '</span>' : '') + '</div>' +
        '<div class="vb-syn">' + w.syn.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>' +
        '<div class="vb-ex">' + esc(w.ex) + '</div>' +
        '</div>';
    });
    h += '</div>';

    /* Navigatsiya */
    h += '<div class="lesson-nav no-print">';
    h += vocabUnit(n - 1)
      ? '<button class="btn btn-ghost" data-go="books/v' + (n - 1) + '">' + IC.arrowL + esc(tr('booksUnitN', { n: n - 1 })) + '</button>'
      : '<button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button>';
    h += vocabUnit(n + 1)
      ? '<button class="btn btn-ghost" data-go="books/v' + (n + 1) + '">' + esc(tr('booksUnitN', { n: n + 1 })) + IC.arrowR + '</button>'
      : '<button class="btn btn-primary" data-go="books">' + esc(L(ENG_BOOK.meta.title)) + IC.arrowR + '</button>';
    h += '</div>';

    return h + '</div>';
  };

  /* ====================== O'QISH MATNI ================================ */

  /* Eski #/books/reading havolasi — endi kitob (ebook) yo'nalishi sahifasi */
  window.PageBookReadingHub = function () { return PageBookTrack('ebook'); };
  window.PageBookReadingHub.mount = function () {};

  window.PageBookReading = function (n, track) {
    track = track || 'ebook';
    var T = TRACKS[track] || TRACKS.ebook;
    var r = readingOf(n, track);
    if (!r) return notFound(tr('booksTrack_' + track) + ' · ' + n);

    var h = '<div class="page stagger">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(tr('engSkillReading')) + ' · ' + esc(tr('booksTrack_' + track)) + (r.ref && r.ref.theme ? ' · ' + esc(r.ref.theme) : '') + '</div>' +
      '<h1>' + esc(r.title) + '</h1>' +
      '<div class="lesson-meta">' +
        (window.bookmarkBtn ? bookmarkBtn('read:' + track + ':' + n, 'books/' + (T.prefix || 'r') + n, r.title, 'reading') : '') +
        (window.Copybook && Copybook.fromBtn ? Copybook.fromBtn('vocab', 'books/' + (T.prefix || 'r') + n, r.title, {}) : '') +
        '<span class="chip topic">' + esc(r.level) + '</span>' +
        (r.tier === 'easy' ? '<span class="chip">' + esc(tr('booksTierEasy')) + '</span>' : '') +
        '<span>' + wordCount(r) + ' words</span><span>·</span>' +
        '<span>' + r.qs.length + ' ' + esc(tr('questions')) + '</span>' +
        (r.ref && r.ref.unit ? '<span class="chip lc">' + esc(tr('booksBookRef', { u: r.ref.unit + r.ref.part, p: r.ref.page })) + '</span>' : '') +
      '</div></header>';

    if (r.note) h += '<div class="intro-block">' + esc(L(r.note)) + '</div>';
    h += '<div class="callout tip"><span class="co-ic">' + IC.clock + '</span><div>' +
      esc(r.tier === 'easy' ? tr('booksReadHowEasy') : tr('booksReadHow')) + '</div></div>';

    /* Mavzu rasmlari — har matnga 2 joy, o'zing yuklaysan (matndan oldin, skimming uchun) */
    h += readingFigures(track, n);

    /* Matn */
    var rid = T.prefix + n;
    var saved = Store.readGet(rid);

    /* Vaqt bilan o'qish — WPM */
    h += '<div class="rd-timer" id="rdTimer" data-words="' + wordCount(r) + '" data-rid="' + esc(rid) + '">' +
      '<div><b>' + esc(tr('rdTimerT')) + '</b><span>' + esc(tr('rdTimerS')) + '</span></div>' +
      '<div class="rd-clock" id="rdClock">00:00</div>' +
      '<button class="btn btn-primary btn-sm" id="rdStart">' + IC.play + esc(tr('rdStart')) + '</button>' +
      '<button class="btn btn-ghost btn-sm" id="rdStop" hidden>' + esc(tr('rdStop')) + '</button>' +
      '<span class="rd-res" id="rdRes">' + (saved && saved.wpm ? esc(tr('rdLast', { w: saved.wpm, s: saved.score, t: saved.total })) : '') + '</span>' +
      '</div>';

    /* Tahrir paneli: so'z belgilash → daftar, varaq rangi, shrift, kenglik, fokus */
    h += window.ReadTools ? ReadTools.panel(rid) : '';
    var marks = (saved && saved.marks) || [];
    h += '<article class="bk-passage' + (window.ReadTools ? ReadTools.sheetClass() : '') + '" id="bkPassage" data-rid="' + esc(rid) + '">';
    r.paras.forEach(function (p) {
      h += '<div class="bp-para"><span class="bp-id">' + esc(p.id) + '</span>' +
        '<p>' + (window.ReadTools ? ReadTools.highlight(p.t, marks) : esc(p.t)) + '</p></div>';
    });
    h += '</article>';
    h += window.ReadTools ? ReadTools.marksList(rid, marks, r) : '';

    /* Matching headings variantlari */
    if (r.headings && r.headings.length) {
      h += '<div class="bk-headings"><div class="gc-l">' + esc(tr('booksHeadingsList')) + '</div><ul>';
      r.headings.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }

    /* Manbalar — diniy va tarixiy matnlar uchun */
    var src = window.ENG_READ_SOURCES && ENG_READ_SOURCES[track] && ENG_READ_SOURCES[track][n];
    if (src) {
      h += '<div class="rd-src"><div class="gc-l">' + esc(tr('rdSourcesT')) + '</div><p class="hint">' + esc(tr('rdSourcesS')) + '</p><ul>';
      src.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
      h += '</ul></div>';
    }

    /* ====== MASHQ BO'LIMLARI ======
       1 skimming · 2 scanning · 3 lug'at kontekstda · 4 IELTS savollar (ball) ·
       5 paraphrase · 6 xulosa · 7 og'zaki qayta aytish                     */
    h += exSkim(r);
    h += exScan(r);
    h += exVocab(r);
    h += '<div class="rd-sec"><div class="rd-sec-h"><span class="sh-n">4</span><h3>' + esc(tr('rdQsT')) + '</h3><span class="rd-sec-s">' + esc(tr('rdQsS')) + '</span></div>';
    window.__rdQs = r.qs; window.__rdQs.title = r.title;
    window.__rdParas = r.paras;   // belgilash rejimida abzatsni qayta chizish uchun   // ball saqlashda xato savollarni aniqlash uchun
    h += questionBlock(r.qs, rid);
    h += '<div class="rd-score" id="rdScore"><span>' + esc(tr('rdScoreLabel')) + '</span><b id="rdScoreN">0</b> / ' + r.qs.length +
      ' <button class="btn btn-primary btn-sm" id="rdSave">' + IC.check + esc(tr('rdSaveScore')) + '</button></div></div>';
    h += exParaphrase(r);
    h += exSummary(r, rid, saved);
    h += exRetell(r);

    h += '<div class="lesson-nav no-print">' +
      '<button class="btn btn-ghost" data-go="books/reading">' + IC.arrowL + esc(tr('booksReadingHub')) + '</button>' +
      (readingOf(n + 1, track) ? '<button class="btn btn-ghost" data-go="books/' + T.prefix + (n + 1) + '">' + esc(track === 'ebook' ? tr('booksTextN', { n: n + 1 }) : tr('day') + ' ' + (n + 1)) + IC.arrowR + '</button>' : '<span></span>') +
      '</div>';

    return h + '</div>';
  };

  /* ====================== TINGLASH BO'LIMI ============================ */

  window.PageBookListening = function (n) {
    var l = listeningOf(n);
    if (!l) return notFound('Section ' + n);

    var h = '<div class="page stagger">';
    h += '<header class="lesson-head">' +
      '<div class="crumb">' + esc(tr('engSkillListening')) + ' · Section ' + l.section + '</div>' +
      '<h1>' + esc(L(l.title)) + '</h1>' +
      '<div class="lesson-meta">' +
        '<span class="chip topic">' + esc(ENG_BOOK.qTypes[l.type] ? L(ENG_BOOK.qTypes[l.type]) : l.type) + '</span>' +
        '<span>' + l.qs.length + ' ' + esc(tr('questions')) + '</span>' +
        '<span>·</span><span>' + esc(l.speakers.join(', ')) + '</span>' +
      '</div></header>';

    h += '<div class="intro-block">' + esc(L(l.context)) + '</div>';

    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' +
      '<h4>' + esc(tr('booksListenHowT')) + '</h4>' + esc(tr('booksListenHow')) + '</div></div>';

    h += '<div class="bk-instr">' + IC.checklist + esc(L(l.instruction)) + '</div>';

    h += questionBlock(l.qs, 'l' + n);

    /* Tinglash halqasi: Tingla → tushun → tekshir → lug'at → savollar → qayta.
       Ball saqlanadi (urinishlar, eng yaxshisi), xato belgilanmagan savol Xato bankiga. */
    var lrec = Store.readGet('l' + n) || {};
    h += '<div class="rd-score card"><h3 class="card-title"><span class="num">' + IC.headphones + '</span>' + esc(tr('lsScoreT')) + '</h3>' +
      '<p class="hint">' + esc(tr('lsScoreS')) + (lrec.total ? ' · ' + esc(tr('lsBest', { s: lrec.best != null ? lrec.best : lrec.score, t: lrec.total, n: lrec.attempts || 1 })) : '') + '</p>' +
      '<div class="sync-actions"><span class="rd-sc"><b id="rdScoreN">0</b> / ' + l.qs.length + '</span><button class="btn btn-primary btn-sm" id="lsSave" data-ls="' + n + '">' + IC.check + esc(tr('rdSaveScore')) + '</button></div></div>';

    /* Transkript — yopiq holda */
    h += '<div class="bk-script" id="bkScript">' +
      '<button class="bs-toggle" data-scripttoggle="1">' + IC.doc + esc(tr('booksShowScript')) + '</button>' +
      '<div class="bs-body" hidden>';
    l.script.forEach(function (x) {
      h += '<div class="bs-line"><b>' + esc(x.s) + '</b><span>' + esc(x.t) + '</span></div>';
    });
    h += '</div></div>';

    h += '<div class="lesson-nav no-print">' +
      '<button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(L(ENG_BOOK.meta.title)) + '</button>' +
      (listeningOf(n + 1) ? '<button class="btn btn-ghost" data-go="books/l' + (n + 1) + '">Section ' + (n + 1) + IC.arrowR + '</button>' : '<span></span>') +
      '</div>';

    return h + '</div>';
  };

  /* ====================== SAVOLLAR BLOKI ==============================
     Javob yopiq turadi. Avval o'zing yoz, keyin och — va javob bilan
     birga NEGA shundayligini o'qi. IELTS'da sabab javobdan muhimroq.  */

  function questionBlock(qs, key) {
    var h = '<div class="bk-qs"><div class="bq-head">' +
      '<h3>' + IC.checklist + esc(tr('booksQuestions')) + '</h3>' +
      '<button class="btn btn-ghost btn-sm" data-revealall="' + esc(key) + '">' + esc(tr('booksRevealAll')) + '</button>' +
      '</div>';

    qs.forEach(function (q, i) {
      var t = ENG_BOOK.qTypes[q.type];
      h += '<div class="bq-row" id="bq-' + esc(key) + '-' + i + '">' +
        '<div class="bq-q"><span class="bq-n">' + (i + 1) + '</span>' +
          '<div><span class="bq-t">' + inlineCode(q.q) + '</span>' +
          (t ? '<span class="bq-type">' + esc(L(t)) + '</span>' : '') + '</div></div>';

      if (q.opts && q.opts.length) {
        h += '<div class="bq-opts">' + q.opts.map(function (o) {
          return '<span>' + esc(o) + '</span>';
        }).join('') + '</div>';
      }

      h += '<div class="bq-ans" hidden>' +
        '<div class="ba-a">' + IC.check + '<b>' + esc(String(q.a)) + '</b></div>' +
        (q.why ? '<div class="ba-w">' + esc(q.why) + '</div>' : '') +
        '<label class="bq-mark"><input type="checkbox" data-correct="' + esc(key) + '"> ' + esc(tr('rdIGotIt')) + '</label>' +
        '</div>' +
        '<button class="bq-show" data-reveal="' + esc(key) + '-' + i + '">' + esc(tr('booksShowAnswer')) + '</button>' +
        '</div>';
    });

    return h + '</div>';
  }

  /* ====================== AVTOMATIK MASHQ BO'LIMLARI ==================
     Har matn uchun matnning o'zidan hosil qilinadi — yozilgan savollarga
     qo'shimcha. IELTS Reading uchta ko'nikma: skimming (asosiy fikr),
     scanning (raqam/nom topish), lug'atni kontekstdan chiqarish. Har biri
     alohida bo'lim, javobi yopiq.                                         */

  var STOP = ' the a an and or but of to in on at for with from by as is are was were be been being that this these those it its their there they them which who whom whose what when where why how not no nor so than then too very can could may might must shall should will would do does did done have has had having into over under between through during before after above below up down out off again further once here all any both each few more most other some such only own same about against because while until although though whether however therefore thus also just now new one two three four five six seven eight nine ten first second third per cent percent people years year time way world many much most less least large small long short great high low good bad well still even ever never often always sometimes usually rarely almost quite rather really since already yet within without among along across around toward towards upon onto near far part parts thing things kind kinds fact facts ';
  function candidates(r) {
    var freq = {};
    r.paras.forEach(function (p) {
      p.t.split(/[^A-Za-z'-]+/).forEach(function (w) {
        var lw = w.toLowerCase().replace(/^'+|'+$/g, '');
        if (lw.length < 9 || /[A-Z]/.test(w.charAt(0)) || /['-]/.test(lw) || STOP.indexOf(' ' + lw + ' ') >= 0) return;
        if (!freq[lw]) freq[lw] = { w: lw, p: p.id, n: 0 };
        freq[lw].n++;
      });
    });
    /* Bir o'zakli so'zlar (transmitter / transmitters) — bittasi qoladi */
    var out = [], stems = {};
    Object.keys(freq).map(function (k) { return freq[k]; })
      .sort(function (a, b) { return b.w.length - a.w.length; })
      .forEach(function (x) { var st = x.w.slice(0, 7); if (stems[st]) return; stems[st] = 1; out.push(x); });
    return out.slice(0, 10);
  }
  function sentenceWith(r, word) {
    for (var i = 0; i < r.paras.length; i++) {
      var sents = r.paras[i].t.split(/(?<=[.!?])\s+/);
      for (var j = 0; j < sents.length; j++) if (sents[j].toLowerCase().indexOf(word) >= 0) return { id: r.paras[i].id, s: sents[j] };
    }
    return null;
  }
  function scanItems(r) {
    var items = [];
    r.paras.forEach(function (p) {
      var nums = p.t.match(/\b(?:1[0-9]{3}|20[0-9]{2}|\d+(?:\.\d+)?\s?(?:per cent|%|million|thousand|kilometres|metres|hours|minutes|years|days))\b/g) || [];
      nums.forEach(function (x) { if (items.length < 8 && !items.some(function (i) { return i.q === x; })) items.push({ q: x, a: p.id }); });
      var names = p.t.match(/\b[A-Z][a-z]{3,}(?:\s[A-Z][a-z]{2,})?\b/g) || [];
      names.forEach(function (x) {
        if (items.length < 10 && !/^(The|This|That|These|Those|When|What|Where|Why|How|In|On|At|For|From|By|As|It|Its|But|And|Or|If|Then|There|Some|Most|Many|Yet|None|Nobody|Almost|Since|After|Before|Because|Although|While|Every|Each|Even|Over|Under|Both|Such|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|First|Second|Third|Around|About|Between|Within|Without|Against|Beyond|Above|Below|Perhaps|Today|Yesterday|Tomorrow|Whether|Whatever|Whoever|Meanwhile|Instead|Rather|Still|Only|Just|Very|Much|More|Less|Nothing|Anyone|Someone|Everyone|Anything|Something|Everything|Estimates|Researchers|Scientists|Historians|Critics|Supporters|Governments|Manchester|Europe|European|Europeans)$/.test(x) && x.split(' ')[0] !== 'The' && !items.some(function (i) { return i.q === x; })) items.push({ q: x, a: p.id });
      });
    });
    return items.slice(0, 8);
  }

  function secHead(n, title, sub) {
    return '<div class="rd-sec-h"><span class="sh-n">' + n + '</span><h3>' + esc(title) + '</h3><span class="rd-sec-s">' + esc(sub) + '</span></div>';
  }
  function exSkim(r) {
    var h = '<div class="rd-sec">' + secHead(1, tr('rdSkimT'), tr('rdSkimS')) + '<div class="rd-list">';
    r.paras.forEach(function (p) {
      var first = p.t.split(/(?<=[.!?])\s+/)[0];
      h += '<div class="rd-item"><span class="bq-n">' + esc(p.id) + '</span><input class="input" placeholder="' + esc(tr('rdSkimPh')) + '">' +
        '<button class="bq-show" data-open="1">' + esc(tr('booksShowAnswer')) + '</button>' +
        '<div class="rd-ans" hidden><b>' + esc(tr('rdFirstSentence')) + ':</b> ' + esc(first) + '</div></div>';
    });
    return h + '</div></div>';
  }
  function exScan(r) {
    var items = scanItems(r);
    if (!items.length) return '';
    var h = '<div class="rd-sec">' + secHead(2, tr('rdScanT'), tr('rdScanS')) + '<div class="rd-grid">';
    items.forEach(function (it) {
      h += '<div class="rd-item"><b>' + esc(it.q) + '</b><span class="rd-q">' + esc(tr('rdWhichPara')) + '</span>' +
        '<button class="bq-show" data-open="1">' + esc(tr('booksShowAnswer')) + '</button>' +
        '<div class="rd-ans" hidden>' + esc(tr('rdPara')) + ' <b>' + esc(it.a) + '</b></div></div>';
    });
    return h + '</div></div>';
  }
  function exVocab(r) {
    var c = candidates(r);
    if (!c.length) return '';
    var h = '<div class="rd-sec">' + secHead(3, tr('rdVocT'), tr('rdVocS')) + '<div class="rd-list">';
    c.forEach(function (x) {
      var s = sentenceWith(r, x.w);
      h += '<div class="rd-item"><b class="rd-w">' + esc(x.w) + '</b><input class="input" placeholder="' + esc(tr('rdVocPh')) + '">' +
        '<button class="bq-show" data-open="1">' + esc(tr('rdContext')) + '</button>' +
        '<div class="rd-ans" hidden>' + (s ? '<span class="bq-n">' + esc(s.id) + '</span> ' + esc(s.s) : '') + '</div></div>';
    });
    return h + '</div></div>';
  }
  function exParaphrase(r) {
    var pick = r.paras.slice(1, 5);
    var h = '<div class="rd-sec">' + secHead(5, tr('rdParaT'), tr('rdParaS')) + '<div class="rd-list">';
    pick.forEach(function (p) {
      var first = p.t.split(/(?<=[.!?])\s+/)[0];
      h += '<div class="rd-item col"><div class="rd-orig"><span class="bq-n">' + esc(p.id) + '</span>' + esc(first) + '</div>' +
        '<textarea class="textarea" rows="2" placeholder="' + esc(tr('rdParaPh')) + '"></textarea>' +
        '<div class="hint">' + esc(tr('rdParaHint')) + '</div></div>';
    });
    return h + '</div></div>';
  }
  function exSummary(r, rid, saved) {
    return '<div class="rd-sec">' + secHead(6, tr('rdSumT'), tr('rdSumS')) +
      '<textarea class="textarea" id="rdSummary" rows="4" placeholder="' + esc(tr('rdSumPh')) + '">' + esc(saved && saved.summary ? saved.summary : '') + '</textarea>' +
      '<div class="sync-actions"><span class="hint" id="rdSumCount">0 ' + esc(tr('engWords')) + '</span><button class="btn btn-ghost btn-sm" id="rdSumSave">' + esc(tr('save')) + '</button></div></div>';
  }
  function exRetell(r) {
    return '<div class="rd-sec">' + secHead(7, tr('rdRetellT'), tr('rdRetellS')) +
      '<div class="rd-item col"><div class="hint">' + esc(tr('rdRetellHow')) + '</div></div></div>';
  }

  function notFound(what) {
    return '<div class="page empty"><h3>404</h3><p>' + esc(what) + '</p>' +
      '<button class="btn btn-primary" style="margin-top:18px" data-go="books">' +
      esc(L(ENG_BOOK.meta.title)) + '</button></div>';
  }

  /* Javoblarni ochish — sahifa qayta chizilmaydi, faqat hidden olib tashlanadi */
  window.PageBooks.mount = function () {
    $$('[data-reveal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var row = b.closest('.bq-row');
        if (!row) return;
        row.querySelector('.bq-ans').hidden = false;
        row.classList.add('shown');
        b.hidden = true;
      });
    });
    var all = $('[data-revealall]');
    if (all) all.addEventListener('click', function () {
      $$('.bq-row').forEach(function (row) {
        row.querySelector('.bq-ans').hidden = false;
        row.classList.add('shown');
        var b = row.querySelector('.bq-show');
        if (b) b.hidden = true;
      });
    });
    var st = $('[data-scripttoggle]');
    if (st) st.addEventListener('click', function () {
      var body = $('#bkScript .bs-body');
      body.hidden = !body.hidden;
      st.innerHTML = IC.doc + esc(tr(body.hidden ? 'booksShowScript' : 'booksHideScript'));
    });
    /* Mashq bo'limlari: ochish tugmalari */
    $$('[data-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ans = b.parentNode.querySelector('.rd-ans');
        if (ans) ans.hidden = !ans.hidden;
      });
    });
    /* O'qish taymeri → WPM */
    var timer = $('#rdTimer');
    if (timer) {
      var t0 = null, iv = null, words = Number(timer.dataset.words) || 0, rid = timer.dataset.rid;
      var clock = $('#rdClock'), start = $('#rdStart'), stop = $('#rdStop'), res = $('#rdRes');
      function tick() { var s = Math.floor((Date.now() - t0) / 1000); clock.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
      start.addEventListener('click', function () {
        t0 = Date.now(); iv = setInterval(tick, 500); start.hidden = true; stop.hidden = false;
        var p = $('#bkPassage'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      stop.addEventListener('click', function () {
        clearInterval(iv); var min = (Date.now() - t0) / 60000; var wpm = Math.round(words / Math.max(min, 0.1));
        Store.readSet(rid, { wpm: wpm });
        res.textContent = tr('rdWpm', { w: wpm }) + (wpm < 150 ? ' · ' + tr('rdWpmSlow') : wpm > 300 ? ' · ' + tr('rdWpmFast') : ' · ' + tr('rdWpmOk'));
        stop.hidden = true; start.hidden = false;
        var q = $('.bk-qs'); if (q) q.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      /* Ball: belgilangan checkbox'lar */
      function count() { var n = $$('[data-correct]:checked').length; var el = $('#rdScoreN'); if (el) el.textContent = n; return n; }
      $$('[data-correct]').forEach(function (c) { c.addEventListener('change', count); });
      var sv = $('#rdSave');
      if (sv) sv.addEventListener('click', function () {
        var n = count(), total = $$('[data-correct]').length;
        var prev = Store.readGet(rid) || {};
        Store.readSet(rid, { score: n, total: total, best: Math.max(n, prev.best || 0), attempts: (prev.attempts || 0) + 1 });
        /* Belgilanmagan (xato) savollar → Xato banki + takror navbati */
        var rq = (window.__rdQs || []);
        $$('[data-correct]').forEach(function (c, i) {
          if (c.checked || !rq[i]) return;
          Store.addMistake2('reading', rid + ':' + i, { q: rq[i].q, chosen: '—', correct: String(rq[i].a), topic: rq.title || '', route: 'books/' + rid, why: rq[i].why || '' });
          if (window.Review) Review.add('mistake', 'reading:' + rid + ':' + i, { cat: 'reading' });
        });
        toast(tr('rdSaved', { s: n, t: total }), n / total >= 0.85 ? 'ok' : 'warn');
        App.refreshChrome();
      });
      /* Xulosa */
      var sum = $('#rdSummary'), cnt = $('#rdSumCount');
      if (sum) {
        var upd = function () { cnt.textContent = sum.value.split(/\s+/).filter(Boolean).length + ' ' + tr('engWords'); };
        sum.addEventListener('input', upd); upd();
        var ss = $('#rdSumSave'); if (ss) ss.addEventListener('click', function () { Store.readSet(rid, { summary: sum.value }); toast(tr('saved'), 'ok'); });
      }
    }
    /* Kitobdagi joyim */
    var save = $('#baSave');
    if (save) save.addEventListener('click', function () {
      Books.setReadingAnchor(Number($('#baReading').value) || 1);
      var cl = function (id, mx) { return Math.min(mx, Math.max(1, Number($(id).value) || 1)); };
      Books.setDictAnchor(cl('#baDTest', 12), cl('#baDEx', 15), cl('#baQTest', 12), cl('#baQN', 30));
      toast(tr('booksAnchorSaved'), 'ok');
      App.render();
    });
  };
  window.PageBookVocab.mount = function () {
    window.PageBooks.mount();
    var b = $('#vuAdd');
    if (b) b.addEventListener('click', function () {
      var u = vocabUnit(Number(b.dataset.unit)); if (!u) return;
      var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
      var n = 0;
      u.words.forEach(function (w) { if (!have[w.w.toLowerCase()]) { var id = Store.copySet('vocab', { word: w.w, syn: (w.syn || []).join(', '), ex: w.ex || '' }); if (window.Review) Review.add('vocab', id); n++; } });
      toast(tr('copyAdded', { n: n }), 'ok'); App.render();
    });
  };
  window.PageBookReading.mount = function () { window.PageBooks.mount(); if (window.ReadTools) ReadTools.mount(); readingFiguresMount(); };
  window.PageBookReadingHub.mount = window.PageBooks.mount;
  window.PageBookTrack.mount = window.PageBooks.mount;
  window.PageBookListen.mount = function () {
    window.PageBooks.mount();
    $$('[data-lsdone]').forEach(function (b) { b.addEventListener('click', function () { Store.setFlag('ls:' + b.dataset.lsdone); App.render(); }); });
    $$('.dqDone').forEach(function (dq) { dq.addEventListener('change', function () { Store.setFlag('dq:' + dq.dataset.t + ':' + dq.dataset.s, dq.checked); toast(tr('saved'), 'ok'); App.refreshChrome(); }); });
    var ot = $('#oldLsToggle');
    if (ot) ot.addEventListener('click', function () { Books.setOldListenDone(!listenBook().done); App.render(); });
  };
  window.PageBookVocabList.mount = window.PageBooks.mount;
  window.PageBookListening.mount = function () {
    window.PageBooks.mount();
    var cnt = function () { var k = $$('[data-correct]:checked').length; var el = $('#rdScoreN'); if (el) el.textContent = k; return k; };
    $$('[data-correct]').forEach(function (c) { c.addEventListener('change', cnt); });
    var sv = $('#lsSave');
    if (sv) sv.addEventListener('click', function () {
      var n = Number(sv.dataset.ls), l = listeningOf(n), score = cnt(), total = $$('[data-correct]').length;
      var rec = Store.readGet('l' + n) || {};
      Store.readSet('l' + n, { score: score, total: total, best: Math.max(score, rec.best || 0), attempts: (rec.attempts || 0) + 1 });
      Store.quizSet('ls:' + n, score, total);
      /* Belgilanmagan savollar — xato banki + takror */
      $$('[data-correct]').forEach(function (c, i) {
        if (c.checked || !l.qs[i]) return;
        Store.addMistake2('reading', 'l' + n + ':' + i, { q: l.qs[i].q, chosen: '—', correct: String(l.qs[i].a), topic: L(l.title), route: 'books/l' + n, why: l.qs[i].why || '' });
        if (window.Review) Review.add('mistake', 'reading:l' + n + ':' + i, { cat: 'reading' });
      });
      toast(tr('rdSaved', { s: score, t: total }), score / total >= 0.85 ? 'ok' : 'warn');
      App.refreshChrome();
    });
  };
})();
