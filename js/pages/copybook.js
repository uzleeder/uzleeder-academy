/* ==========================================================================
   Daftarlar (copybook) — #/copy/vocab · #/copy/english · #/copy/coding
   --------------------------------------------------------------------------
   Uchta qo'lda yoziladigan daftar. Matn bulutga sinxronlanadi (Store.copy),
   ovoz yozuvlari IndexedDB'da — faqat shu qurilmada (hajmi katta, bulut
   chegarasi 1 MB).

     vocab    — so'z · transkripsiya · tarjima · sinonimlar · misol · IZOH
                + har so'zga o'z talaffuzimni yozib olish (MediaRecorder)
     english  — grammatika / ibora / xato / fikr — sarlavha, matn, misol
     coding   — sarlavha · til · kod · izoh · teglar

   Dizayn: tech HUD — qora shisha panellar, grid fon, neon aksent, burchak
   qavslari, #01 indeks, skan chizig'i (fokusda), yozib olishda to'lqin.
   Aksent: amber (lug'at) · terrakota (ingliz) · yashil (coding).
   ========================================================================== */
(function () {
  'use strict';

  var POS = ['noun', 'verb', 'adj', 'adv', 'phrase', 'prep', 'conj', 'other'];
  var KINDS = {
    vocab:   { color: 'amber', icon: 'mic',  fields: ['word', 'pos', 'ipa', 'tr', 'syn', 'ex', 'note'] },
    english: { color: 'clay',  icon: 'pen',  fields: ['title', 'type', 'text', 'ex'] },
    coding:  { color: 'sage',  icon: 'code', fields: ['title', 'lang', 'code', 'text', 'tags'] }
  };

  /* ====================== OVOZ OMBORI (IndexedDB) ===================== */
  var AudioDB = (function () {
    var dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) { rej(new Error('nodb')); return; }
        var r = indexedDB.open('uzla-audio', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('clips'); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      });
      return dbp;
    }
    function tx(mode, fn) {
      return open().then(function (db) {
        return new Promise(function (res, rej) {
          var t = db.transaction('clips', mode), st = t.objectStore('clips');
          var req = fn(st);
          t.oncomplete = function () { res(req && req.result); };
          t.onerror = function () { rej(t.error); };
        });
      });
    }
    return {
      get: function (id) { return tx('readonly', function (st) { return st.get(id); }); },
      set: function (id, blob) { return tx('readwrite', function (st) { return st.put(blob, id); }); },
      del: function (id) { return tx('readwrite', function (st) { return st.delete(id); }); },
      keys: function () { return tx('readonly', function (st) { return st.getAllKeys(); }); }
    };
  })();

  /* ====================== YOZIB OLISH ================================== */
  var rec = { mr: null, chunks: [], id: null, timer: null, t0: 0 };
  function startRec(id, btn) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { toast(tr('copyNoMic'), 'warn'); return; }
    if (!window.isSecureContext) { toast(tr('copyNeedHttps'), 'warn'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      rec.chunks = []; rec.id = id; rec.t0 = Date.now();
      /* Format: brauzer qo'llaganini tanlaymiz — Safari/iOS: audio/mp4, Chrome/Android: audio/webm */
      var mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].filter(function (m) { return window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
      var mr; try { mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); } catch (e) { mr = new MediaRecorder(stream); }
      rec.mr = mr;
      var chunks = [];
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      /* onstop stopRec() dan KEYIN keladi (rec.mr allaqachon null) — shuning uchun
         yozuvchi va bo'laklar mahalliy o'zgaruvchida (ilgari bu yerda TypeError bo'lib, yozuv saqlanmasdi) */
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        var blob = new Blob(chunks, { type: mr.mimeType || mime || 'audio/webm' });
        AudioDB.set(id, blob).then(function () {
          var e = Store.copyGet('vocab', id); if (e) { e.audio = true; e.audioAt = Date.now(); Store.copySet('vocab', e); }
          toast(tr('copyRecSaved'), 'ok'); refreshEntry(id);
          /* Bulut ombori (Vercel Blob) sozlangan bo'lsa — yozuv u yerga ham: boshqa qurilmada ham eshitiladi */
          if (window.MediaCloud) MediaCloud.check().then(function (ok) {
            if (!ok) return;
            var ext = /mp4/.test(blob.type) ? 'm4a' : /ogg/.test(blob.type) ? 'ogg' : 'webm';
            return MediaCloud.upload(new File([blob], 'voice-' + id + '.' + ext, { type: blob.type })).then(function (b) {
              var e2 = Store.copyGet('vocab', id); if (e2) { if (e2.audioUrl) MediaCloud.del(e2.audioUrl); e2.audioUrl = b.url; Store.copySet('vocab', e2); }
            });
          }).catch(function () {});
        }).catch(function () { toast(tr('copyRecErr'), 'warn'); });
      };
      mr.start(250);
      btn.classList.add('rec'); btn.innerHTML = IC.close + '<span>0:00</span>';
      var au = btn.closest('.cb-audio'); if (au) au.classList.add('live');
      rec.timer = setInterval(function () {
        var s = Math.round((Date.now() - rec.t0) / 1000);
        var sp = btn.querySelector('span'); if (sp) sp.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2);
        if (s >= 30) stopRec();   // 30 soniya yetarli — bitta so'z / gap
      }, 250);
    }).catch(function () { toast(tr('copyNoMic'), 'warn'); });
  }
  function stopRec() {
    var mr = rec.mr;
    clearInterval(rec.timer); rec.timer = null; rec.mr = null;
    if (mr && mr.state !== 'inactive') { try { mr.stop(); } catch (e) {} }
  }
  function playRec(id, btn) {
    AudioDB.get(id).catch(function () { return null; }).then(function (blob) {
      var e = Store.copyGet('vocab', id);
      /* Shu qurilmada yo'q bo'lsa — bulutdagi nusxa (boshqa qurilmada yozilgan) */
      if (!blob && !(e && e.audioUrl)) { toast(tr('copyRecNone'), 'warn'); return; }
      var url = blob ? URL.createObjectURL(blob) : e.audioUrl, a = new Audio(url);
      btn.classList.add('playing'); var au = btn.closest('.cb-audio'); if (au) au.classList.add('live');
      var done = function () { btn.classList.remove('playing'); if (au) au.classList.remove('live'); if (blob) URL.revokeObjectURL(url); };
      a.onended = done; a.onerror = function () { done(); toast(tr('copyRecErr'), 'warn'); };
      var p = a.play(); if (p && p.catch) p.catch(function () { done(); toast(tr('copyRecErr'), 'warn'); });
    }).catch(function () { toast(tr('copyRecNone'), 'warn'); });
  }

  /* ====================== SAHIFA ======================================= */
  window.Copybook = {
    counts: function () { return { vocab: Store.copyList('vocab').length, english: Store.copyList('english').length, coding: Store.copyList('coding').length, free: Store.copyList('free').length }; },
    /* Darsdan daftarga yozish tugmasi: copyFromBtn(kind, route, title, prefill) —
       bosilsa manba (src/srcT) bilan yangi varaq ochiladi va daftarga o'tiladi */
    fromBtn: function (kind, route, title, prefill) {
      var n = Store.copyList(kind).filter(function (e) { return e.src === route; }).length;
      return '<button class="btn btn-quiet btn-sm" data-copyfrom="' + esc(kind) + '" data-src="' + esc(route) + '" data-srct="' + esc(title) + '" data-prefill="' + esc(JSON.stringify(prefill || {})) + '">' +
        IC.notebook + esc(tr('copyFrom_' + kind)) + (n ? ' <b>' + n + '</b>' : '') + '</button>';
    }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copyfrom]'); if (!b) return;
    var pre = {}; try { pre = JSON.parse(b.dataset.prefill || '{}'); } catch (x) {}
    pre.src = b.dataset.src; pre.srcT = b.dataset.srct;
    if (b.dataset.copyfrom === 'english' && !pre.type) pre.type = 'grammar';
    if (b.dataset.copyfrom === 'coding' && !pre.lang) pre.lang = 'python';
    var id = Store.copySet(b.dataset.copyfrom, pre);
    var m = Store.setting('copyQ') || {}; m[b.dataset.copyfrom] = ''; Store.setSetting('copyQ', m);
    var f = Store.setting('copyF') || {}; f[b.dataset.copyfrom] = 'all'; Store.setSetting('copyF', f);
    App.go('copy/' + b.dataset.copyfrom);
    setTimeout(function () { var el = document.querySelector('.cb-sheet[data-id="' + id + '"] .cb-word'); if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); } }, 80);
  });

  window.PageCopybook = function (kind) {
    var K = KINDS[kind] || KINDS.vocab; kind = KINDS[kind] ? kind : 'vocab';
    var list = Store.copyList(kind);
    var q = (Store.setting('copyQ') || {})[kind] || '';
    var filter = (Store.setting('copyF') || {})[kind] || 'all';

    var h = '<div class="page cb-page cb-' + K.color + '">';
    /* Daftarlar orasida yurish — muqovadagi teglar */
    h += '<div class="cb-tabs">' + ['vocab', 'english', 'coding'].map(function (k) {
      return '<button class="cb-tab' + (k === kind ? ' on' : '') + ' c-' + KINDS[k].color + '" data-go="copy/' + k + '">' + (IC[KINDS[k].icon] || '') + esc(tr('copy' + cap(k))) + '<b>' + Store.copyList(k).length + '</b></button>';
    }).join('') + '</div>';

    /* Muqova */
    h += '<header class="cb-cover"><div class="cb-spine"></div><div class="cb-cover-in">' +
      '<div class="eyebrow">' + esc(tr('copyTag')) + ' · ' + esc(Store.get('name') || tr('profNamePh')) + '</div>' +
      '<h1 class="cb-title">' + esc(tr('copy' + cap(kind))) + '</h1>' +
      '<p class="lede">' + esc(tr('copy' + cap(kind) + 'D')) + '</p>' +
      (kind === 'vocab' && window.Books ? cbookLine() : '') +
      '<div class="cb-tools">' +
        '<input class="input cb-search" id="cbQ" placeholder="' + esc(tr('copySearch')) + '" value="' + esc(q) + '">' +
        '<div class="segmented"><button data-cbf="all"' + (filter === 'all' ? ' class="on"' : '') + '>' + esc(tr('copyAll')) + '</button>' +
          '<button data-cbf="fav"' + (filter === 'fav' ? ' class="on"' : '') + '>' + IC.star + esc(tr('copyFavs')) + '</button>' +
          (kind === 'vocab'
            ? '<button data-cbf="noaudio"' + (filter === 'noaudio' ? ' class="on"' : '') + '>' + esc(tr('copyNoAudio')) + '</button>' +
              '<button data-cbf="due"' + (filter === 'due' ? ' class="on"' : '') + '>' + esc(tr('rvSt_due')) + '</button>' +
              '<button data-cbf="today"' + (filter === 'today' ? ' class="on"' : '') + '>' + esc(tr('coursesToday')) + '</button>'
            : '') + '</div>' +
        (kind === 'vocab' && window.Books && ENG_BOOK.vocabPhase(Books.today()) !== 'cbook' ? '<button class="btn btn-ghost btn-sm" id="cbToday">' + IC.calendar + esc(tr('copyAddToday')) + '</button>' : '') +
        '<button class="btn btn-primary btn-sm" id="cbNew">' + IC.plus + esc(tr('copyNew')) + '</button>' +
      '</div>' +
      (kind === 'vocab' ? '<div class="hint">' + esc(tr('copyAudioNote')) + '</div>' : '') +
      '</div></header>';

    /* Varaqlar */
    var todayWords = kind === 'vocab' ? todayWordSet() : null;
    var shown = list.filter(function (e) {
      if (q && JSON.stringify(e).toLowerCase().indexOf(q.toLowerCase()) < 0) return false;
      if (filter === 'noaudio' && e.audio) return false;
      if (filter === 'fav' && !e.fav) return false;
      if (filter === 'due' && !(window.Review && Review.status(Store.reviewAll()['vocab:' + e.id]) === 'due')) return false;
      if (filter === 'today' && !(todayWords && todayWords[(e.word || '').toLowerCase()])) return false;
      return true;
    });
    /* Sevimlilar tepada, qolgani yangidan eskiga */
    shown.sort(function (a, b) { return (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || (b.at || 0) - (a.at || 0); });
    h += '<div class="cb-sheets" id="cbSheets">';
    if (!shown.length) h += '<div class="cb-empty">' + IC.pen + '<p>' + esc(tr('copyEmpty' + cap(kind))) + '</p></div>';
    shown.forEach(function (e) { h += sheet(kind, e); });
    h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="books">' + IC.arrowL + esc(tr('books')) + '</button><span></span></div>';
    return h + '</div>';
  };

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* C-book bosqichi: bugun 40 so'zdan nechtasi yozildi (kalendar kuni bo'yicha) */
  function cbookLine() {
    var day = Books.today(), cb = ENG_BOOK.cycle;
    if (ENG_BOOK.vocabPhase(day) !== 'cbook') return '';
    var n = Books.wordsAddedOn(Store.dateKey()), pct = Math.min(100, Math.round(n / cb.cbookPerDay * 100));
    return '<div class="cb-quota' + (n >= cb.cbookPerDay ? ' ok' : '') + '"><span class="cq-l">' + IC.target + esc(tr('booksCbookT')) + ' · ' + esc(tr('day')) + ' ' + day + '/' + cb.cbookDays + '</span>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div><b>' + n + ' / ' + cb.cbookPerDay + '</b>' +
      '<span class="cq-s">' + esc(n >= cb.cbookPerDay ? tr('booksCbookDone') : tr('booksCbookLeft', { n: cb.cbookPerDay - n })) + '</span></div>';
  }

  /* Bugungi Destination B2 bo'limining so'zlari — tez qo'shish uchun
     ({w, tr} — tarjima bilan; sinonim kitobda yo'q) */
  function todayWordSet() {
    var out = {};
    if (!window.ENG_BOOK || !window.Books || !ENG_BOOK.destFor) return out;
    var d = ENG_BOOK.destFor(Books.today()); if (!d) return out;
    d.items.forEach(function (it) { out[it[0].toLowerCase()] = { w: it[0], tr: it[1], src: 'books/dest/' + d.unit + '/' + d.sec, srcT: 'Unit ' + d.unit + ' · ' + d.secName }; });
    return out;
  }

  /* Bitta varaq (yozuv). Barcha maydonlar joyida tahrirlanadi, 600 ms da saqlanadi */
  function sheet(kind, e) {
    /* data-l — lug'at kartasida burchakdagi harf (A–Z tab), ingliz daftarida tur belgisi */
    var tab = kind === 'vocab' ? ((e.word || '').trim().charAt(0).toUpperCase() || '·') : kind === 'english' ? (e.type || 'grammar').charAt(0).toUpperCase() : '';
    var h = '<article class="cb-sheet' + (e.fav ? ' fav' : '') + '" data-id="' + esc(e.id) + '" data-l="' + esc(tab) + '"><span class="cb-scan"></span>' +
      '<div class="cb-sheet-head"><span class="cb-date">' + esc(fmtDate(e.at)) + '</span>' +
      (kind === 'vocab' && window.Review ? '<span class="cb-st st-' + Review.status(Store.reviewAll()['vocab:' + e.id]) + '">' + esc(tr('rvSt_' + Review.status(Store.reviewAll()['vocab:' + e.id]))) + '</span>' : '') +
      /* Manba: qaysi dars/mavzudan yozilgani — bosilsa o'sha joyga qaytadi */
      (e.src ? '<button class="cb-src" data-go="' + esc(e.src) + '" title="' + esc(tr('copySrcGo')) + '">' + IC.arrowR + esc(e.srcT || e.src) + '</button>' : '') +
      '<button class="cb-fav' + (e.fav ? ' on' : '') + '" data-cbfav="' + esc(e.id) + '" title="' + esc(e.fav ? tr('copyUnfav') : tr('copyFav')) + '" aria-pressed="' + !!e.fav + '">' + IC.star + '</button>' +
      '<button class="cb-x" data-cbdel="' + esc(e.id) + '" title="' + esc(tr('delete')) + '">' + IC.close + '</button></div>';
    if (kind === 'vocab') {
      h += '<div class="cb-row main"><input class="cb-in cb-word" data-f="word" value="' + esc(e.word || '') + '" placeholder="word">' +
        /* So'z turi — noun / verb / adj / adv … (tanlov; so'zni to'g'ri ishlatish uchun) */
        '<select class="cb-in cb-pos" data-f="pos" title="' + esc(tr('copyPos')) + '"><option value="">' + esc(tr('copyPos')) + '</option>' + POS.map(function (t) { return '<option value="' + t + '"' + (e.pos === t ? ' selected' : '') + '>' + esc(tr('pos_' + t)) + '</option>'; }).join('') + '</select>' +
        '<input class="cb-in cb-ipa" data-f="ipa" value="' + esc(e.ipa || '') + '" placeholder="/ˈtrænskrɪpʃn/">' +
        '<span class="cb-audio">' +
          '<button class="cb-mic' + (e.audio || e.audioUrl ? ' has' : '') + '" data-rec="' + esc(e.id) + '" title="' + esc(tr('copyRec')) + '">' + IC.mic + '<span>' + esc(e.audio || e.audioUrl ? tr('copyReRec') : tr('copyRec')) + '</span></button>' +
          (e.audio || e.audioUrl ? '<button class="cb-play' + (e.audioUrl ? ' cloud' : '') + '" data-play="' + esc(e.id) + '" title="' + esc(tr('copyPlay')) + '">' + IC.play + '</button>' : '') +
          '<span class="cb-wave"><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
        '</span></div>' +
        line('tr', tr('copyTr'), e.tr) + line('syn', tr('copySyn'), e.syn) + area('ex', tr('copyEx'), e.ex, 2) + area('note', tr('copyNote'), e.note, 1);
    } else if (kind === 'english') {
      h += '<div class="cb-row main"><input class="cb-in cb-word" data-f="title" value="' + esc(e.title || '') + '" placeholder="' + esc(tr('copyTitlePh')) + '">' +
        '<select class="cb-in cb-type" data-f="type">' + ['grammar', 'phrase', 'mistake', 'idea'].map(function (t) { return '<option value="' + t + '"' + (e.type === t ? ' selected' : '') + '>' + esc(tr('copyType_' + t)) + '</option>'; }).join('') + '</select></div>' +
        area('text', tr('copyText'), e.text, 4) + area('ex', tr('copyEx'), e.ex, 2);
    } else {
      h += '<div class="cb-row main"><input class="cb-in cb-word" data-f="title" value="' + esc(e.title || '') + '" placeholder="' + esc(tr('copyTitlePh')) + '">' +
        '<select class="cb-in cb-type" data-f="lang">' + ['python', 'sql', 'bash', 'js', 'other'].map(function (t) { return '<option value="' + t + '"' + ((e.lang || 'python') === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div>' +
        '<div class="cb-code"><textarea class="cb-in cb-code-in" data-f="code" rows="6" spellcheck="false" placeholder="# code">' + esc(e.code || '') + '</textarea></div>' +
        area('text', tr('copyExplain'), e.text, 3) + line('tags', tr('copyTags'), e.tags);
    }
    return h + '</article>';
  }
  function line(f, label, v) { return '<div class="cb-row"><label>' + esc(label) + '</label><input class="cb-in" data-f="' + f + '" value="' + esc(v || '') + '"></div>'; }
  function area(f, label, v, rows) { return '<div class="cb-row"><label>' + esc(label) + '</label><textarea class="cb-in" data-f="' + f + '" rows="' + rows + '">' + esc(v || '') + '</textarea></div>'; }

  function refreshEntry(id) {
    var el = document.querySelector('.cb-sheet[data-id="' + id + '"]'); if (!el) return;
    var kind = currentKind(); var e = Store.copyGet(kind, id); if (!e) return;
    var tmp = document.createElement('div'); tmp.innerHTML = sheet(kind, e);
    el.replaceWith(tmp.firstChild); bindSheets();
  }
  function currentKind() { var m = (location.hash || '').match(/copy\/(\w+)/); return m ? m[1] : 'vocab'; }

  /* ====================== HODISALAR ==================================== */
  window.PageCopybook.mount = function () {
    var kind = currentKind();
    bindSheets();
    var qEl = $('#cbQ'), qt = null;
    if (qEl) qEl.addEventListener('input', function () {
      clearTimeout(qt);
      qt = setTimeout(function () { var m = Store.setting('copyQ') || {}; m[kind] = qEl.value; Store.setSetting('copyQ', m); App.render(); var q2 = $('#cbQ'); if (q2) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); } }, 400);
    });
    $$('[data-cbf]').forEach(function (b) { b.addEventListener('click', function () { var m = Store.setting('copyF') || {}; m[kind] = b.dataset.cbf; Store.setSetting('copyF', m); App.render(); }); });
    var nb = $('#cbNew');
    if (nb) nb.addEventListener('click', function () {
      var e = kind === 'vocab' ? { word: '' } : kind === 'english' ? { title: '', type: 'grammar' } : { title: '', lang: 'python' };
      Store.copySet(kind, e); App.render();
      var first = document.querySelector('.cb-sheet .cb-word'); if (first) first.focus();
    });
    var tb = $('#cbToday');
    if (tb) tb.addEventListener('click', function () {
      var have = {}; Store.copyList('vocab').forEach(function (e) { have[(e.word || '').toLowerCase()] = 1; });
      var set = todayWordSet(), n = 0;
      Object.keys(set).forEach(function (w) { if (!have[w]) { var id = Store.copySet('vocab', { word: set[w].w, tr: set[w].tr || '', syn: (set[w].syn || []).join(', '), src: set[w].src, srcT: set[w].srcT }); if (window.Review) Review.add('vocab', id); n++; } });
      toast(tr('copyAdded', { n: n }), n ? 'ok' : 'warn'); App.render();
    });
  };

  function bindSheets() {
    var kind = currentKind();
    $$('.cb-sheet').forEach(function (sh) {
      if (sh.dataset.bound) return; sh.dataset.bound = '1';
      var id = sh.dataset.id, timer = null;
      sh.addEventListener('input', function (ev) {
        var f = ev.target.dataset.f; if (!f) return;
        clearTimeout(timer);
        timer = setTimeout(function () {
          var e = Store.copyGet(kind, id); if (!e) return;
          $$('[data-f]', sh).forEach(function (inp) { e[inp.dataset.f] = inp.value; });
          Store.copySet(kind, e);
          if (kind === 'vocab' && e.word && e.word.trim() && window.Review) Review.add('vocab', e.id);   // takror navbatiga
          sh.classList.add('saved'); setTimeout(function () { sh.classList.remove('saved'); }, 900);
        }, 600);
      });
      sh.addEventListener('change', function (ev) { if (ev.target.tagName === 'SELECT') sh.dispatchEvent(new Event('input')); });
    });
    $$('[data-cbfav]').forEach(function (b) {
      if (b.dataset.bound) return; b.dataset.bound = '1';
      b.addEventListener('click', function () {
        var e = Store.copyGet(kind, b.dataset.cbfav); if (!e) return;
        e.fav = !e.fav; Store.copySet(kind, e); refreshEntry(e.id);
      });
    });
    $$('[data-cbdel]').forEach(function (b) {
      if (b.dataset.bound) return; b.dataset.bound = '1';
      b.addEventListener('click', function () {
        if (!confirm(tr('copyDelQ'))) return;
        var ent = Store.copyGet(kind, b.dataset.cbdel); if (ent && ent.audioUrl && window.MediaCloud) MediaCloud.del(ent.audioUrl);
        Store.copyDel(kind, b.dataset.cbdel); AudioDB.del(b.dataset.cbdel).catch(function () {}); App.render();
      });
    });
    $$('[data-rec]').forEach(function (b) {
      if (b.dataset.bound) return; b.dataset.bound = '1';
      b.addEventListener('click', function () { if (rec.mr) stopRec(); else startRec(b.dataset.rec, b); });
    });
    $$('[data-play]').forEach(function (b) {
      if (b.dataset.bound) return; b.dataset.bound = '1';
      b.addEventListener('click', function () { playRec(b.dataset.play, b); });
    });
  }
})();
