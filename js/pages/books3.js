/* ==========================================================================
   #/books/ra · #/books/s1 — o'quvchining o'z PDF kitoblari
   --------------------------------------------------------------------------
   Ma'lumot: js/data/eng-book-extra.js (mundarija + jadval, matn YO'Q).
   Holat:    read["bx-<id>-<n>"] = { score, total, at }  (bulut bilan sinxron)
   PDF:      IndexedDB "uzla-bookpdf" — faqat shu brauzerda, serverga chiqmaydi.
   Natija IELTS Mission "kitob ishi"ga ham yoziladi (Mission.books.add).
   ========================================================================== */
(function () {
  'use strict';
  var t = function (uz, en) { return L({ uz: uz, en: en }); };
  function B(id) { return window.ENG_BOOKS_EXTRA && ENG_BOOKS_EXTRA[id]; }
  function diff(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
  function key(id, n) { return 'bx-' + id + '-' + n; }

  /* ---------- jadval va holat ---------- */
  function unitFor(id, d) {                     // shu sanaga rejalangan qism (bo'lmasa 0)
    var b = B(id); if (!b) return 0;
    var k = diff(b.start, d); if (k < 0 || k % b.every) return 0;
    var n = k / b.every + 1; return n <= b.units.length ? n : 0;
  }
  function dateOf(id, n) { var b = B(id); return Store.shiftDays(b.start, (n - 1) * b.every); }
  function result(id, n) { return Store.readGet(key(id, n)) || null; }
  function isDone(id, n) { var r = result(id, n); return !!(r && r.at); }
  function doneCount(id) { var b = B(id); return b ? b.units.filter(function (u) { return isDone(id, u.n); }).length : 0; }
  function next(id) { var b = B(id); return b ? b.units.filter(function (u) { return !isDone(id, u.n); })[0] || null : null; }
  function behind(id) {                         // rejadan orqada qolgan qismlar soni
    var b = B(id), td = Store.dateKey(); if (!b) return 0;
    return b.units.filter(function (u) { return dateOf(id, u.n) < td && !isDone(id, u.n); }).length;
  }
  function save(id, n, score, total) {
    var b = B(id), u = b.units[n - 1];
    Store.readSet(key(id, n), { score: score, total: total, at: Date.now() });
    if (window.Mission && Mission.books) {
      try { Mission.books.add({ book: id, skill: b.skill, title: b.title + ' — ' + u.title, unit: L(b.unitName) + ' ' + n, pages: String(u.page), score: score, total: total, min: b.min }); } catch (e) {}
    }
  }

  /* ---------- PDF: IndexedDB (faqat shu qurilma) ---------- */
  var DBN = 'uzla-bookpdf';
  function db() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('no-idb'));
      var r = indexedDB.open(DBN, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('pdf'); };
      r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
    });
  }
  function pdfPut(id, file) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction('pdf', 'readwrite'); tx.objectStore('pdf').put({ blob: file, name: file.name, size: file.size, at: Date.now() }, id); tx.oncomplete = res; tx.onerror = function () { rej(tx.error); }; }); }); }
  function pdfGet(id) { return db().then(function (d) { return new Promise(function (res) { var q = d.transaction('pdf').objectStore('pdf').get(id); q.onsuccess = function () { res(q.result || null); }; q.onerror = function () { res(null); }; }); }).catch(function () { return null; }); }
  function pdfDel(id) { return db().then(function (d) { return new Promise(function (res) { var tx = d.transaction('pdf', 'readwrite'); tx.objectStore('pdf').delete(id); tx.oncomplete = res; tx.onerror = res; }); }); }
  function openPdf(id, page) {
    pdfGet(id).then(function (rec) {
      if (!rec) { toast(t("Avval PDF'ni biriktiring", 'Attach the PDF first'), 'warn'); return; }
      var url = URL.createObjectURL(rec.blob);
      window.open(url + '#page=' + Math.max(1, page), '_blank', 'noopener');
      setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
    });
  }

  /* PDF beti qaysi qismga tegishli (matn boshlanish betidan) */
  function unitOfPage(id, pg) { var b = B(id), u = null; b.units.forEach(function (x) { if (x.page + b.pdfOffset <= pg) u = x; }); return u; }
  function readerRoute(id, n) { var b = B(id), u = b.units[n - 1]; return 'books/' + id + '/read/' + (u.page + b.pdfOffset); }
  function lastPage(id) { var r = Store.readGet(key(id, 'pos')); return r && r.page ? r.page : 0; }

  window.BookExtra = { unitFor: unitFor, dateOf: dateOf, result: result, isDone: isDone, doneCount: doneCount, next: next, behind: behind, save: save, openPdf: openPdf, unitOfPage: unitOfPage, readerRoute: readerRoute, lastPage: lastPage };

  /* ====================== EBOOK O'QUVCHI ==================================
     #/books/<id>/read/<bet> — biriktirilgan PDF platforma ichida, bet-bet.
     PDF.js (jsdelivr) faqat shu sahifa ochilganda yuklanadi. Fayl hamon faqat
     shu brauzerda (IndexedDB); oxirgi bet read["bx-<id>-pos"] da (sinxron).   */
  var PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/';
  var libP = null, DOCS = {};
  function pdfLib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (libP) return libP;
    libP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js';
      s.onload = function () {
        /* worker boshqa domenda — blob orqali (Pyodide runner bilan bir xil usul) */
        pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob(["importScripts('" + PDFJS + "pdf.worker.min.js');"], { type: 'text/javascript' }));
        res(window.pdfjsLib);
      };
      s.onerror = function () { libP = null; rej(new Error('pdfjs')); };
      document.head.appendChild(s);
    });
    return libP;
  }
  function loadDoc(id) {
    return pdfGet(id).then(function (rec) {
      if (!rec) return null;
      var c = DOCS[id];
      if (c && c.at === rec.at) return c.doc;
      return pdfLib().then(function (lib) { return rec.blob.arrayBuffer().then(function (buf) { return lib.getDocument({ data: buf }).promise; }); })
        .then(function (doc) { DOCS[id] = { at: rec.at, doc: doc }; return doc; });
    });
  }

  window.PageBookReader = function (id, page) {
    var b = B(id); if (!b) return window.PageBookExtra(id);
    var pg = page || lastPage(id) || (b.units[0].page + b.pdfOffset);
    var h = '<div class="page bx-reader" data-bxr="' + esc(id) + '" data-pg="' + pg + '">';
    h += '<div class="bxr-bar">' +
      '<button class="btn btn-quiet btn-sm" data-go="books/' + esc(id) + '">←</button>' +
      '<div class="bxr-t"><b>' + esc(b.title) + '</b><small data-bxr-unit></small></div>' +
      '<div class="bxr-nav"><button class="btn btn-ghost btn-sm" data-bxr="prev" aria-label="prev">‹</button>' +
        '<input class="input sm" data-bxr-pg type="number" min="1" value="' + pg + '" aria-label="page"><span data-bxr-of>/ …</span>' +
        '<button class="btn btn-ghost btn-sm" data-bxr="next" aria-label="next">›</button></div>' +
      '<div class="bxr-tools"><button class="btn btn-quiet btn-sm" data-bxr="zout" aria-label="zoom out">−</button><button class="btn btn-quiet btn-sm" data-bxr="zin" aria-label="zoom in">+</button>' +
        '<button class="btn btn-quiet btn-sm" data-bxr="night" title="' + esc(t('Tungi rejim', 'Night mode')) + '">☾</button></div></div>';
    h += '<div class="bxr-stage" data-bxr-stage><div class="bxr-msg" data-bxr-msg>' + esc(t('Kitob yuklanmoqda…', 'Loading the book…')) + '</div><canvas data-bxr-canvas></canvas></div>';
    h += '<div class="bxr-foot" data-bxr-foot></div>';
    return h + '</div>';
  };
  PageBookReader.mount = function (id) {
    var root = document.querySelector('.bx-reader'); if (!root) return;
    var b = B(id), cv = root.querySelector('[data-bxr-canvas]'), stage = root.querySelector('[data-bxr-stage]'), msg = root.querySelector('[data-bxr-msg]');
    var pgIn = root.querySelector('[data-bxr-pg]'), of = root.querySelector('[data-bxr-of]'), unitEl = root.querySelector('[data-bxr-unit]'), foot = root.querySelector('[data-bxr-foot]');
    var doc = null, pg = Number(root.dataset.pg) || 1, zoom = 1, task = null, saveT = null;
    var night = !!(Store.readGet(key(id, 'pos')) || {}).night;
    root.classList.toggle('night', night);

    function footer() {
      var u = unitOfPage(id, pg); if (!u) { foot.innerHTML = ''; unitEl.textContent = ''; return; }
      var r = result(id, u.n), un = L(b.unitName);
      unitEl.textContent = un + ' ' + u.n + ' · ' + u.title;
      foot.innerHTML = '<span>' + esc(un + ' ' + u.n + ' — ' + t('natija', 'result')) + (r ? ' · <b>' + r.score + '/' + r.total + '</b>' : '') + '</span>' +
        '<form class="bx-score" data-bxr-score><input class="input sm" type="number" min="0" max="40" name="s" value="' + (r ? r.score : '') + '" placeholder="' + esc(t('ball', 'score')) + '"><span>/</span>' +
        '<input class="input sm" type="number" min="1" max="40" name="t" value="' + (r ? r.total : b.defTotal) + '"><button class="btn btn-ghost btn-sm" type="submit">' + esc(r ? t('Yangilash', 'Update') : t('Saqlash', 'Save')) + '</button></form>';
      foot.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); var f = e.target, s = Number(f.s.value), tt = Number(f.t.value);
        if (f.s.value === '' || isNaN(s) || isNaN(tt) || tt < 1 || s < 0 || s > tt) { toast(t("Ball 0 dan jamigacha bo'lsin", 'Score must be between 0 and the total'), 'warn'); return; }
        save(id, u.n, s, tt); toast(t('Saqlandi — Mission profiliga ham yozildi', 'Saved — also logged to your Mission profile'), 'ok'); footer();
      });
    }
    function remember() { clearTimeout(saveT); saveT = setTimeout(function () { Store.readSet(key(id, 'pos'), { page: pg, night: night }); }, 600); }
    function render() {
      if (!doc) return;
      pg = Math.max(1, Math.min(doc.numPages, pg)); pgIn.value = pg; of.textContent = '/ ' + doc.numPages;
      if (history.replaceState) history.replaceState(null, '', '#/books/' + id + '/read/' + pg);
      footer(); remember();
      doc.getPage(pg).then(function (p) {
        var w = Math.max(280, stage.clientWidth - 2), base = p.getViewport({ scale: 1 }), scale = w / base.width * zoom, dpr = window.devicePixelRatio || 1;
        var vp = p.getViewport({ scale: scale * dpr });
        cv.width = vp.width; cv.height = vp.height; cv.style.width = Math.round(vp.width / dpr) + 'px'; cv.style.height = Math.round(vp.height / dpr) + 'px';
        if (task) { try { task.cancel(); } catch (e) {} }
        task = p.render({ canvasContext: cv.getContext('2d'), viewport: vp });
        return task.promise;
      }).then(function () { msg.hidden = true; }).catch(function (e) { if (e && e.name === 'RenderingCancelledException') return; msg.hidden = false; msg.textContent = t("Betni ko'rsatib bo'lmadi", 'Could not render the page'); });
    }
    function go(n) { pg = n; render(); stage.scrollTop = 0; window.scrollTo(0, 0); }
    root.addEventListener('click', function (e) {
      var a = e.target.closest('[data-bxr]'); if (!a || a === root) return;
      var k = a.dataset.bxr;
      if (k === 'prev') go(pg - 1); else if (k === 'next') go(pg + 1);
      else if (k === 'zin') { zoom = Math.min(3, zoom + 0.25); render(); } else if (k === 'zout') { zoom = Math.max(0.5, zoom - 0.25); render(); }
      else if (k === 'night') { night = !night; root.classList.toggle('night', night); remember(); }
    });
    pgIn.addEventListener('change', function () { go(Number(pgIn.value) || 1); });
    /* klaviatura va surish — sahifadan chiqqach o'zini o'chiradi */
    if (window.__bxrKey) document.removeEventListener('keydown', window.__bxrKey);
    window.__bxrKey = function (e) {
      if (!document.body.contains(root)) { document.removeEventListener('keydown', window.__bxrKey); return; }
      if (/INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(pg + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(pg - 1); }
    };
    document.addEventListener('keydown', window.__bxrKey);
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (sx == null || zoom > 1) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(pg + (dx < 0 ? 1 : -1)); sx = null; });
    var rz; window.addEventListener('resize', function () { if (!document.body.contains(root)) return; clearTimeout(rz); rz = setTimeout(render, 200); });

    loadDoc(id).then(function (d) {
      if (!d) {
        msg.innerHTML = esc(t("PDF hali biriktirilmagan. Kitob sahifasida bir marta biriktiring — keyin shu yerda ebook bo'lib ochiladi.", 'No PDF attached yet. Attach it once on the book page — then it opens here as an ebook.')) +
          ' <button class="btn btn-primary btn-sm" data-go="books/' + esc(id) + '">' + esc(t("PDF'ni biriktirish", 'Attach PDF')) + '</button>';
        return;
      }
      doc = d; render();
    }).catch(function () { msg.textContent = t("Kitobni ochib bo'lmadi (internet yoki fayl muammosi).", 'Could not open the book (network or file problem).'); });
  };

  /* ---------- sahifa ---------- */
  window.PageBookExtra = function (id) {
    var b = B(id); if (!b) return '<div class="page empty"><h3>404</h3><button class="btn btn-primary" data-go="books">' + esc(tr('books')) + '</button></div>';
    var td = Store.dateKey(), tn = unitFor(id, td), nx = next(id), dn = doneCount(id), bh = behind(id), un = L(b.unitName);
    var h = '<div class="page stagger bx-page">';
    h += '<button class="link-btn jr-crumb" data-go="books">← ' + esc(tr('books')) + '</button>';
    h += '<header class="page-head"><div class="eyebrow">' + esc(t('Kitoblar · o\'z PDF\'ingiz', 'Books · your own PDF')) + '</div><h1>' + esc(b.title) + '</h1><p class="lede">' + esc(L(b.desc)) + '</p></header>';
    h += '<div class="jr-sum">' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Bajarilgan', 'Done')) + '</div><div class="st-v">' + dn + '<small> / ' + b.units.length + '</small></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Bugun', 'Today')) + '</div><div class="st-v sm">' + esc(tn ? un + ' ' + tn : t('rejada yo\'q', 'not scheduled')) + '</div><div class="st-note">' + esc(t('har ' + b.every + ' kunda 1 ' + un, 'one ' + un + ' every ' + b.every + ' days')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + esc(t('Rejadan orqada', 'Behind plan')) + '</div><div class="st-v">' + bh + '</div><div class="st-note">' + esc(EngCal.fmt(b.start) + ' → ' + EngCal.fmt(dateOf(id, b.units.length))) + '</div></div></div>';
    /* Ebook: oxirgi joydan davom etish */
    var lp = lastPage(id), cu = lp ? unitOfPage(id, lp) : null;
    h += '<div class="bx-cta"><button class="btn btn-primary" data-go="books/' + id + '/read' + (lp ? '/' + lp : '') + '">' + IC.book + esc(lp ? t('Davom ettirish — ' + lp + '-bet', 'Continue — page ' + lp) : t("Ebook'ni ochish", 'Open the ebook')) + '</button>' +
      (cu ? '<span>' + esc(L(b.unitName) + ' ' + cu.n + ' · ' + cu.title) + '</span>' : '') + '</div>';
    /* PDF biriktirish */
    h += '<section class="card bx-pdf"><h3 class="card-title"><span class="num">' + IC.doc + '</span>PDF</h3><p class="bx-pdfs" data-bxpdfs>' + esc(t('Tekshirilmoqda…', 'Checking…')) + '</p>' +
      '<label class="btn btn-ghost btn-sm">' + IC.upload + esc(t("PDF'ni biriktirish", 'Attach PDF')) + '<input type="file" accept="application/pdf" data-bxfile hidden></label> ' +
      '<button class="btn btn-quiet btn-sm" data-bxdel hidden>' + esc(t("Olib tashlash", 'Remove')) + '</button>' +
      '<p class="bx-note">' + esc(t("Bir marta biriktiring — kitob platforma ichida ebook bo'lib ochiladi (bet-bet, kattalashtirish, tungi rejim, oxirgi bet eslab qolinadi). Fayl faqat shu brauzerda saqlanadi (IndexedDB) — serverga yuklanmaydi va boshqa qurilmada ko'rinmaydi.", 'Attach it once — the book opens inside the platform as an ebook (page by page, zoom, night mode, last page remembered). The file stays only in this browser (IndexedDB) — it is not uploaded and will not appear on other devices.')) + '</p></section>';
    /* ro'yxat */
    h += '<h2 class="jr-h2">' + esc(t('Reja', 'Plan')) + '</h2><div class="bx-list">';
    b.units.forEach(function (u) {
      var r = result(id, u.n), dk = dateOf(id, u.n), cls = r ? ' done' : (dk === td ? ' today' : (dk < td ? ' late' : ''));
      h += '<div class="bx-row' + cls + '"><div class="bx-main"><b>' + esc(un + ' ' + u.n + ' · ' + u.title) + '</b><small>' + esc(EngCal.fmt(dk) + ' · ' + t('bet ', 'page ') + u.page + (nx && nx.n === u.n ? ' · ' + t('navbatdagi', 'next up') : '')) + '</small></div>' +
        '<button class="btn btn-ghost btn-sm" data-go="books/' + id + '/read/' + (u.page + b.pdfOffset) + '">' + IC.book + esc(t("O'qish", 'Read')) + '</button>' +
        '<form class="bx-score" data-bxn="' + u.n + '"><input class="input sm" type="number" min="0" max="40" name="s" value="' + (r ? r.score : '') + '" placeholder="' + esc(t('ball', 'score')) + '" aria-label="score"><span>/</span>' +
        '<input class="input sm" type="number" min="1" max="40" name="t" value="' + (r ? r.total : b.defTotal) + '" aria-label="total"><button class="btn btn-ghost btn-sm" type="submit">' + (r ? IC.check : '') + esc(r ? t('Yangilash', 'Update') : t('Saqlash', 'Save')) + '</button></form></div>';
    });
    h += '</div>';
    h += '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t("Kitob matni va savollari platformaga ko'chirilmagan (mualliflik huquqi). Ball — amaliy natija, IELTS band emas.", 'The book text and questions are not copied into the platform (copyright). The score is a practice result, not an IELTS band.')) + '</div></div>';
    return h + '</div>';
  };
  PageBookExtra.mount = function (id) {
    var b = B(id); if (!b) return;
    var st = document.querySelector('[data-bxpdfs]'), del = document.querySelector('[data-bxdel]');
    function refresh() { pdfGet(id).then(function (rec) { if (st) st.textContent = rec ? t('Biriktirilgan: ', 'Attached: ') + rec.name + ' (' + Math.round(rec.size / 1024) + ' KB)' : t("PDF biriktirilmagan — betni ochish uchun bir marta biriktiring.", 'No PDF attached — attach it once to open pages.'); if (del) del.hidden = !rec; }); }
    refresh();
    var f = document.querySelector('[data-bxfile]');
    if (f) f.addEventListener('change', function () { var file = f.files && f.files[0]; if (!file) return; if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) { toast(t('Faqat PDF', 'PDF only'), 'warn'); return; } pdfPut(id, file).then(function () { toast(t('PDF biriktirildi', 'PDF attached'), 'ok'); refresh(); }).catch(function () { toast(t('Saqlab bo\'lmadi', 'Could not save'), 'warn'); }); });
    if (del) del.addEventListener('click', function () { pdfDel(id).then(refresh); });
    $$('[data-bxn]').forEach(function (fm) {
      fm.addEventListener('submit', function (e) {
        e.preventDefault();
        var s = Number(fm.s.value), tt = Number(fm.t.value);
        if (fm.s.value === '' || isNaN(s) || isNaN(tt) || tt < 1 || s < 0 || s > tt) { toast(t("Ball 0 dan jamigacha bo'lsin", 'Score must be between 0 and the total'), 'warn'); return; }
        save(id, Number(fm.dataset.bxn), s, tt); toast(t('Saqlandi — Mission profiliga ham yozildi', 'Saved — also logged to your Mission profile'), 'ok'); App.render();
      });
    });
  };
})();
