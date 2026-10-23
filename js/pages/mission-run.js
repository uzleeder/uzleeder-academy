/* ==========================================================================
   IELTS Mission sahifalari (2-qism) — mashq oynalari va Studio'lar
   --------------------------------------------------------------------------
     #/mission/run/reading/<n>[?mode=diagnostic|mock&set=a,b,c]
     #/mission/run/listen/<n>[?mode=diagnostic&then=m]   brauzer ovozi (TTS)
     #/mission/run/tl/<test>/<1|2|all>                    Target Listening 1 (kitob audiosi)
     #/mission/run/custom/<id>                            o'z testingiz (kalit + mahalliy audio)
     #/mission/run/grammar/<toifa|diag>
     #/mission/vocab[?mode=diagnostic]
     #/mission/practice/reading?type=tfng
     #/mission/writing · /writing/new?… · /writing/<id>
     #/mission/speaking · /speaking/new?… · /speaking/<id>
   Qoida: avval javob, keyin kalit. Avtomatik tekshirib bo'lmaydigan joy
   "o'z-o'zini tekshirish" deb belgilanadi. Ball — dalil, band emas.
   ========================================================================== */
(function () {
  'use strict';
  var U = window.MissionUI, M = function () { return window.Mission; }, t = U.t, V = U.VIEWS;
  var RUN = {}, TIMER = null;

  /* ---------- mahalliy media (IndexedDB) — audio faqat shu brauzerda ---------- */
  var MissionMedia = (function () {
    var dbp = null;
    function db() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('idb'));
        var r = indexedDB.open('uzla-mission', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('blobs'); };
        r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
      });
      return dbp;
    }
    function tx(mode, fn) { return db().then(function (d) { return new Promise(function (res, rej) { var x = d.transaction('blobs', mode), st = x.objectStore('blobs'), out = fn(st); x.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); }; x.onerror = function () { rej(x.error); }; }); }); }
    return {
      put: function (k, blob) { return tx('readwrite', function (s) { s.put(blob, k); }); },
      get: function (k) { return db().then(function (d) { return new Promise(function (res, rej) { var r = d.transaction('blobs').objectStore('blobs').get(k); r.onsuccess = function () { res(r.result || null); }; r.onerror = function () { rej(r.error); }; }); }); },
      del: function (k) { return tx('readwrite', function (s) { s.delete(k); }).catch(function () {}); }
    };
  })();
  window.MissionMedia = MissionMedia;
  function attachAudio(el, key) {
    if (!el) return;
    MissionMedia.get(key).then(function (b) { if (b) { el.src = URL.createObjectURL(b); el.hidden = false; } }).catch(function () {});
  }

  /* ---------- umumiy yordamchilar ---------- */
  function clockTxt(ms) { var s = Math.max(0, Math.round(Math.abs(ms) / 1000)); return (ms < 0 ? '+' : '') + Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function startTimer(getStart, limitMin) {
    clearInterval(TIMER);
    var el = $('#msClock'); if (!el) return;
    var paint = function () {
      if (!document.body.contains(el)) { clearInterval(TIMER); return; }
      var gone = Date.now() - getStart();
      if (limitMin) { var left = limitMin * 60000 - gone; el.textContent = clockTxt(left); el.classList.toggle('over', left < 0); }
      else el.textContent = clockTxt(gone);
    };
    paint(); TIMER = setInterval(paint, 1000);
  }
  function mins(start) { return Math.max(1, Math.round((Date.now() - start) / 60000)); }
  function page(title, lede, tab) { return '<div class="page stagger ms-page">' + U.head('IELTS Mission', title, lede) + U.subnav(tab || 'home'); }
  function textAccept(key) {
    var k = String(key || ''), out = [k];
    var noPar = k.replace(/\s*\([^)]*\)\s*/g, ' ').trim(); if (noPar !== k) out.push(noPar);
    k.split(/\s+\/\s+|\s+or\s+/i).forEach(function (x) { out.push(x); });
    (k.match(/\(([^)]+)\)/) || []).slice(1).forEach(function (x) { out.push(x.replace(/^(a|an)\s+/i, '')); });
    var art = function (s) { return M().norm(s).replace(/^(a|an|the)\s+/, '').replace(/[£$€,]/g, ''); };
    return out.map(art).filter(Boolean);
  }
  function textMatch(ans, key) { var a = M().norm(ans).replace(/^(a|an|the)\s+/, '').replace(/[£$€,]/g, ''); return !!a && textAccept(key).indexOf(a) >= 0; }
  function suggestReason(ans, key) {
    var a = M().norm(ans), k = M().norm(key);
    if (!a) return 'lost';
    if (/\d/.test(k)) return 'numbers';
    if (a.replace(/(es|s)$/, '') === k.replace(/(es|s)$/, '')) return 'plural';
    if (M().lev(a, k) <= 2) return 'spelling';
    return 'paraphrase';
  }
  function reasonSel(name, map, val) {
    return '<select class="input ms-reason" data-reason="' + esc(name) + '"><option value="">' + esc(t('— sababni tanlang —', '— choose the reason —')) + '</option>' + Object.keys(map).map(function (k) { return '<option value="' + k + '"' + (k === val ? ' selected' : '') + '>' + esc(L(map[k])) + '</option>'; }).join('') + '</select>';
  }
  function doneBox(msg, next) {
    return '<div class="callout tip ms-done"><span class="co-ic">' + IC.check + '</span><div>' + esc(msg) + (next || '') + ' <button class="btn btn-quiet btn-sm" data-go="mission">' + t('Missiyaga', 'Back to mission') + '</button> <button class="btn btn-quiet btn-sm" data-go="mission/errors">' + t('Xatolar banki', 'Error bank') + '</button></div></div>';
  }

  /* ====================== O'QISH (READING) ============================= */
  var OPT = { tfng: ['TRUE', 'FALSE', 'NOT GIVEN'], ynng: ['YES', 'NO', 'NOT GIVEN'] };
  function rCorrect(q, a) {
    if (a == null || a === '') return false;
    if (q.type === 'mcq') return Number(a) === Number(q.a);
    if (q.type === 'tfng' || q.type === 'ynng') return a === q.a;
    if (q.type === 'headings') return M().norm(a) === M().norm(q.a);
    return textMatch(a, q.a);
  }
  function rShow(q, a) {
    if (a == null || a === '') return '—';
    if (q.type === 'mcq') return String.fromCharCode(65 + Number(a)) + ') ' + (q.opts[a] || '');
    return String(a);
  }
  function rKeyShow(q) { return q.type === 'mcq' ? String.fromCharCode(65 + Number(q.a)) + ') ' + q.opts[q.a] : String(q.a); }
  V.run = function (parts, q) {
    var kind = parts[1];
    if (kind === 'reading') return runReading(Number(parts[2]) || 1, q);
    if (kind === 'listen') return runListen(Number(parts[2]) || 1, q);
    if (kind === 'tl') return runTL(Number(parts[2]) || 1, parts[3] || '1', q);
    if (kind === 'custom') return runCustom(parts[2], q);
    if (kind === 'grammar') return runGrammar(parts[2] || 'tenses', q);
    return page(t('Topilmadi', 'Not found'), '') + '</div>';
  };
  function runReading(n, q) {
    var P = M().Cat.reading(n); if (!P) return page(t('Matn topilmadi', 'Passage not found'), '', 'home') + '</div>';
    var mode = q.mode || 'practice', set = q.set ? q.set.split(',').map(Number) : null, key = 'r:' + n + ':' + mode + (set ? ':' + q.set : '');
    var R = RUN[key] = RUN[key] || { start: Date.now(), ans: {}, ev: {}, why: {}, checked: false, saved: false };
    if (set) { var sk = 'set:' + q.set; RUN[sk] = RUN[sk] || { start: R.start }; R.setStart = RUN[sk].start; }
    var ph = M().phaseOf(M().today()), limit = mode === 'diagnostic' ? 20 : mode === 'mock' ? 60 : (ph && ph.key !== 'diag' && ph.key !== 'found' ? 20 : 0);
    var h = page(t("O'qish: ", 'Reading: ') + L(P.title), (mode === 'diagnostic' ? t('Diagnostika · ', 'Diagnostic · ') : mode === 'mock' ? t('Amaliy mock · ', 'Practice mock · ') : '') + t("Platforma uchun yozilgan matn (Reading Explorer 3 mavzusida) — rasmiy IELTS matni emas. Avval hamma savolga javob bering, keyin tekshiring.", 'A passage written for the platform (on a Reading Explorer 3 theme) — not an official IELTS text. Answer every question first, then check.'), 'home');
    h += '<div class="ms-runbar"><span class="ms-clock" id="msClock">0:00</span><span>' + (limit ? t(limit + ' daqiqa', limit + ' minutes') + (set ? ' · ' + t('to\'plam: ', 'set: ') + set.join(', ') : '') : t('vaqtsiz (vaqt yoziladi)', 'untimed (time is recorded)')) + '</span>' + (P.ref ? '<span class="hint">' + esc(typeof P.ref === 'string' ? P.ref : L(P.ref)) + '</span>' : '') + '</div>';
    h += '<div class="ms-read"><article class="card ms-passage">' + P.paras.map(function (p) { return '<p><b class="ms-pid">' + esc(p.id) + '</b> ' + esc(p.t) + '</p>'; }).join('') + '</article><section class="card ms-qs">';
    var qTypes = window.ENG_BOOK ? ENG_BOOK.qTypes : {}, lastType = '';
    P.qs.forEach(function (x, i) {
      if (x.type !== lastType) { h += '<div class="gc-l">' + esc(qTypes[x.type] ? L(qTypes[x.type]) : x.type) + '</div>'; lastType = x.type; if (x.type === 'headings' && P.headings) h += '<ol class="ms-heads">' + P.headings.map(function (hd) { return '<li>' + esc(hd) + '</li>'; }).join('') + '</ol>'; }
      var a = R.ans[i], ok = R.checked ? rCorrect(x, a) : null;
      h += '<div class="ms-q' + (R.checked ? (ok ? ' right' : ' wrong') : '') + '"><div class="ms-qt"><b>' + (i + 1) + '.</b> ' + esc(x.q) + '</div>';
      var dis = R.checked ? ' disabled' : '';
      if (x.type === 'mcq') h += '<div class="ms-opts">' + x.opts.map(function (o, oi) { return '<label><input type="radio" name="q' + i + '" value="' + oi + '"' + (String(a) === String(oi) ? ' checked' : '') + dis + '> ' + String.fromCharCode(65 + oi) + ') ' + esc(o) + '</label>'; }).join('') + '</div>';
      else if (OPT[x.type]) h += '<div class="ms-opts row">' + OPT[x.type].map(function (o) { return '<label><input type="radio" name="q' + i + '" value="' + o + '"' + (a === o ? ' checked' : '') + dis + '> ' + o + '</label>'; }).join('') + '</div>';
      else if (x.type === 'headings' && P.headings) h += '<select class="input" name="q' + i + '"' + dis + '><option value="">—</option>' + P.headings.map(function (hd) { var v = hd.split('.')[0].trim(); return '<option value="' + esc(v) + '"' + (a === v ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>';
      else h += '<input class="input" name="q' + i + '" value="' + esc(a || '') + '" autocomplete="off"' + dis + '>';
      if (R.checked) {
        h += '<div class="ms-fb">' + (ok ? '<span class="good">' + IC.check + t("To'g'ri", 'Correct') + '</span>' : '<span class="bad">' + t('Sizniki: ', 'Yours: ') + esc(rShow(x, a)) + '</span><span class="good">' + t("To'g'ri: ", 'Answer: ') + esc(rKeyShow(x)) + '</span>') + '</div>';
        if (x.why) h += '<p class="hint">' + esc(L(x.why)) + '</p>';
        if (!ok || /tfng|ynng|headings|matching/.test(x.type)) h += '<div class="ms-evid"><label>' + t('Dalil qaysi abzatsda?', 'Evidence paragraph?') + ' <select class="input" data-ev="' + i + '"' + (R.saved ? ' disabled' : '') + '><option value="">—</option>' + P.paras.map(function (p) { return '<option' + (R.ev[i] === p.id ? ' selected' : '') + '>' + esc(p.id) + '</option>'; }).join('') + '</select></label>' + (!ok ? reasonSel(String(i), M().C().readReasons, R.why[i]) : '') + '</div>';
      }
      h += '</div>';
    });
    var answered = P.qs.filter(function (x, i) { return R.ans[i] != null && R.ans[i] !== ''; }).length;
    if (!R.checked) h += '<div class="ms-acts"><span class="hint">' + answered + ' / ' + P.qs.length + ' ' + t('javob', 'answered') + '</span><button class="btn btn-primary" id="rCheck">' + IC.check + t('Tekshirish', 'Check answers') + '</button></div>';
    else {
      var right = P.qs.filter(function (x, i) { return rCorrect(x, R.ans[i]); }).length, wrongN = P.qs.length - right, need = P.qs.filter(function (x, i) { return !rCorrect(x, R.ans[i]) && !R.why[i]; }).length;
      h += '<div class="ms-score"><b>' + right + ' / ' + P.qs.length + '</b> <span class="hint">' + t('amaliy ball (band emas)', 'practice score (not a band)') + '</span></div>';
      if (!R.saved) h += '<div class="ms-acts"><span class="hint">' + (need ? t(need + ' ta xato uchun sabab tanlang', 'Choose a reason for ' + need + ' miss(es)') : t('Tayyor', 'Ready')) + '</span><button class="btn btn-primary" id="rSave"' + (need ? ' disabled' : '') + '>' + t('Saqlash va xatolarni bankka qo\'shish', 'Save & add misses to the error bank') + '</button></div>';
      else {
        var nextN = set ? set[set.indexOf(n) + 1] : null;
        h += doneBox(t('Saqlandi: ' + right + '/' + P.qs.length + '. ' + wrongN + ' ta xato 1 kundan keyin takrorga tushadi.', 'Saved: ' + right + '/' + P.qs.length + '. ' + wrongN + ' miss(es) return for review in 1 day.'),
          nextN ? ' <button class="btn btn-primary btn-sm" data-go="mission/run/reading/' + nextN + '?mode=' + mode + '&set=' + q.set + '">' + t('Keyingi matn', 'Next passage') + ' (' + nextN + ')</button>' : '');
      }
    }
    h += '</section></div>';
    U.setMount(function () {
      startTimer(function () { return R.setStart || R.start; }, limit);
      $$('.ms-qs [name^="q"]').forEach(function (el) { var ev = el.tagName === 'SELECT' || el.type === 'radio' ? 'change' : 'input'; el.addEventListener(ev, function () { R.ans[Number(el.name.slice(1))] = el.value; }); });
      $$('[data-ev]').forEach(function (el) { el.addEventListener('change', function () { R.ev[el.dataset.ev] = el.value; }); });
      $$('[data-reason]').forEach(function (el) { el.addEventListener('change', function () { R.why[el.dataset.reason] = el.value; App.render(); }); });
      var c = $('#rCheck'); if (c) c.addEventListener('click', function () {
        var miss = P.qs.length - P.qs.filter(function (x, i) { return R.ans[i] != null && R.ans[i] !== ''; }).length;
        if (miss && !confirm(t(miss + ' ta savol javobsiz. Baribir tekshirasizmi?', miss + ' question(s) unanswered. Check anyway?'))) return;
        R.checked = true; R.min = mins(R.start); App.render();
      });
      var s = $('#rSave'); if (s) s.addEventListener('click', function () {
        var items = P.qs.map(function (x, i) { return ['q' + (i + 1), rCorrect(x, R.ans[i]) ? 2 : 0, x.type]; });
        M().record({ kind: 'reading', skill: 'reading', ref: 'r:' + n, mode: mode, min: R.min, items: items });
        P.qs.forEach(function (x, i) {
          if (rCorrect(x, R.ans[i])) return;
          M().errors.add({ skill: 'reading', src: 'r:' + n, key: 'q' + (i + 1), q: L(P.title) + ' · ' + (i + 1) + '. ' + x.q, resp: rShow(x, R.ans[i]), correct: rKeyShow(x), cat: x.type,
            expl: (x.why ? L(x.why) + ' · ' : '') + L(M().C().readReasons[R.why[i]] || '') + (R.ev[i] ? ' · ' + t('dalil: ', 'evidence: ') + R.ev[i] : ''), follow: 'mission/run/reading/' + n });
        });
        M().save(); R.saved = true; App.render(); U.markTask('reading');
      });
      if (R.saved) U.markTask('reading');
    });
    return h + '</div>';
  }
  V.practice = function (parts, q) {
    var type = q.type || 'tfng', rs = M().Cat.readings().filter(function (r) { return r.qs.some(function (x) { return x.type === type; }); });
    var qn = window.ENG_BOOK && ENG_BOOK.qTypes[type] ? L(ENG_BOOK.qTypes[type]) : type;
    var h = page(t("Maqsadli mashq: ", 'Targeted practice: ') + qn, t("Shu savol turi bor matnlar. Ishlanmaganlari birinchi.", 'Passages containing this question type. Unattempted first.'), 'profile');
    rs.sort(function (a, b) { return (M().attempted('r:' + a.n) ? 1 : 0) - (M().attempted('r:' + b.n) ? 1 : 0); });
    h += U.card(qn, '<div class="ms-diag">' + rs.map(function (r) { var c = r.qs.filter(function (x) { return x.type === type; }).length; return '<div class="ms-drow"><span class="ms-ic">' + IC.doc + '</span><div><b>' + r.n + '. ' + esc(L(r.title)) + '</b><small>' + c + ' × ' + esc(qn) + (M().attempted('r:' + r.n) ? ' · ' + t('ishlangan', 'done before') : '') + '</small></div><button class="btn btn-primary btn-sm" data-go="mission/run/reading/' + r.n + '">' + t('Ochish', 'Open') + '</button></div>'; }).join('') + '</div>', IC.target);
    U.setMount(null);
    return h + '</div>';
  };

  /* ====================== TINGLASH: platforma bo'limi + brauzer ovozi === */
  var TTS = { on: false, line: -1 };
  function voices() { var vs = window.speechSynthesis ? speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)/i.test(v.lang); }) : []; vs.sort(function (a, b) { return (/GB/i.test(b.lang) ? 1 : 0) - (/GB/i.test(a.lang) ? 1 : 0); }); return vs; }
  function speak(script, from, onlyOne, rate) {
    if (!window.speechSynthesis) { toast(t("Brauzeringizda ovozli o'qish yo'q", 'Speech synthesis is not available in this browser'), 'warn'); return; }
    speechSynthesis.cancel();
    var vs = voices(), names = [], i = from || 0;
    script.forEach(function (l) { if (names.indexOf(l.s) < 0) names.push(l.s); });
    TTS.on = true;
    var next = function () {
      if (!TTS.on || i >= script.length || (onlyOne && i > from)) { TTS.on = false; TTS.line = -1; paintLine(); return; }
      var l = script[i], u = new SpeechSynthesisUtterance(l.t), si = names.indexOf(l.s);
      if (vs.length) u.voice = vs[si % vs.length];
      u.pitch = si % 2 ? 0.85 : 1.1; u.rate = rate || 0.95; u.lang = u.voice ? u.voice.lang : 'en-GB';
      TTS.line = i; paintLine();
      u.onend = function () { i++; setTimeout(next, 250); };
      u.onerror = function () { TTS.on = false; };
      speechSynthesis.speak(u);
    };
    next();
  }
  function paintLine() { $$('[data-line]').forEach(function (el) { el.classList.toggle('speaking', Number(el.dataset.line) === TTS.line); }); var st = $('#ttsState'); if (st) st.textContent = TTS.on ? t('o\'qilmoqda…', 'playing…') : ''; }
  function optLetter(o, i) { var m = String(o).match(/^([A-H])[.)]\s*/); return m ? m[1] : String.fromCharCode(65 + i); }
  function lCorrect(x, a) { if (a == null || a === '') return false; if (x.opts) return String(a).toUpperCase() === String(x.a).toUpperCase(); return textMatch(a, x.a); }
  function runListen(n, q) {
    var S = M().Cat.section(n); if (!S) return page(t('Bo\'lim topilmadi', 'Section not found'), '') + '</div>';
    var mode = q.mode || 'practice', key = 'ls:' + n + ':' + mode, R = RUN[key] = RUN[key] || { start: Date.now(), ans: {}, why: {}, checked: false, saved: false };
    var h = page(t('Tinglash: ', 'Listening: ') + L(S.title), t("Section " + S.section + ". Platforma uchun yozilgan bo'lim — audio yo'q, brauzer ovozi (speech synthesis) o'qib beradi. Bu imtihon audiosi emas: urg'u va tezlik boshqacha. Transkript javoblar tekshirilgandan keyin ochiladi.", 'Section ' + S.section + '. A section written for the platform — no recording; the browser\'s speech synthesis reads it. This is not exam audio: accents and pace differ. The transcript unlocks after you check your answers.'), 'home');
    h += '<div class="ms-runbar"><span class="ms-clock" id="msClock">0:00</span><button class="btn btn-primary btn-sm" id="ttsPlay">' + IC.play + t('Tinglash', 'Play') + '</button><button class="btn btn-ghost btn-sm" id="ttsStop">' + t("To'xtatish", 'Stop') + '</button><label class="hint">' + t('Tezlik', 'Rate') + ' <select class="input" id="ttsRate"><option value="0.85">0.85</option><option value="0.95" selected>0.95</option><option value="1.05">1.05</option></select></label><span class="hint" id="ttsState"></span></div>';
    if (S.context) h += '<p class="hint">' + esc(L(S.context)) + (S.instruction ? ' ' + esc(L(S.instruction)) : '') + '</p>';
    h += '<section class="card ms-qs">';
    S.qs.forEach(function (x, i) {
      var a = R.ans[i], ok = R.checked ? lCorrect(x, a) : null, dis = R.checked ? ' disabled' : '';
      h += '<div class="ms-q' + (R.checked ? (ok ? ' right' : ' wrong') : '') + '"><div class="ms-qt"><b>' + (i + 1) + '.</b> ' + esc(x.q) + '</div>';
      if (x.opts) h += '<div class="ms-opts">' + x.opts.map(function (o, oi) { var v = optLetter(o, oi); return '<label><input type="radio" name="q' + i + '" value="' + v + '"' + (a === v ? ' checked' : '') + dis + '> ' + esc(o) + '</label>'; }).join('') + '</div>';
      else h += '<input class="input" name="q' + i + '" value="' + esc(a || '') + '" autocomplete="off" spellcheck="false"' + dis + '>';
      if (R.checked) {
        h += '<div class="ms-fb">' + (ok ? '<span class="good">' + IC.check + t("To'g'ri", 'Correct') + '</span>' : '<span class="bad">' + t('Sizniki: ', 'Yours: ') + esc(a || '—') + '</span><span class="good">' + t("To'g'ri: ", 'Answer: ') + esc(x.a) + '</span>') + '</div>' + (x.why ? '<p class="hint">' + esc(L(x.why)) + '</p>' : '');
        if (!ok) h += reasonSel(String(i), M().C().listenReasons, R.why[i] != null ? R.why[i] : (x.opts ? '' : suggestReason(a, x.a)));
      }
      h += '</div>';
    });
    if (!R.checked) h += '<div class="ms-acts"><button class="btn btn-primary" id="lCheck">' + IC.check + t('Tekshirish', 'Check answers') + '</button></div>';
    else {
      var right = S.qs.filter(function (x, i) { return lCorrect(x, R.ans[i]); }).length;
      h += '<div class="ms-score"><b>' + right + ' / ' + S.qs.length + '</b> <span class="hint">' + t('amaliy ball', 'practice score') + '</span></div>';
      h += '<details class="ms-trans" open><summary>' + t('Transkript — qiyin joyni qayta tinglang', 'Transcript — replay the hard parts') + '</summary>' + S.script.map(function (l, li) { return '<p data-line="' + li + '"><button class="btn btn-quiet btn-sm" data-replay="' + li + '" aria-label="replay">' + IC.play + '</button><b>' + esc(l.s) + ':</b> ' + esc(l.t) + '</p>'; }).join('') + '</details>';
      if (!R.saved) h += '<div class="ms-acts"><button class="btn btn-primary" id="lSave">' + t('Saqlash', 'Save') + '</button></div>';
      else h += doneBox(t('Saqlandi.', 'Saved.'), q.then ? ' <button class="btn btn-primary btn-sm" data-go="mission/run/listen/' + esc(q.then) + '?mode=' + mode + '">' + t('Keyingi bo\'lim', 'Next section') + ' (' + esc(q.then) + ')</button>' : '');
    }
    h += '</section>';
    U.setMount(function () {
      startTimer(function () { return R.start; }, 0);
      var rate = function () { return Number(($('#ttsRate') || {}).value || 0.95); };
      var pl = $('#ttsPlay'); if (pl) pl.addEventListener('click', function () { speak(S.script, 0, false, rate()); });
      var sp = $('#ttsStop'); if (sp) sp.addEventListener('click', function () { TTS.on = false; if (window.speechSynthesis) speechSynthesis.cancel(); paintLine(); });
      $$('[data-replay]').forEach(function (b) { b.addEventListener('click', function () { speak(S.script, Number(b.dataset.replay), true, rate()); }); });
      $$('.ms-qs [name^="q"]').forEach(function (el) { el.addEventListener(el.type === 'radio' ? 'change' : 'input', function () { R.ans[Number(el.name.slice(1))] = el.value; }); });
      $$('[data-reason]').forEach(function (el) { el.addEventListener('change', function () { R.why[el.dataset.reason] = el.value; }); });
      var c = $('#lCheck'); if (c) c.addEventListener('click', function () { TTS.on = false; if (window.speechSynthesis) speechSynthesis.cancel(); R.checked = true; R.min = mins(R.start); App.render(); });
      var s = $('#lSave'); if (s) s.addEventListener('click', function () {
        S.qs.forEach(function (x, i) { if (!lCorrect(x, R.ans[i]) && R.why[i] == null) R.why[i] = x.opts ? 'paraphrase' : suggestReason(R.ans[i], x.a); });
        M().record({ kind: 'listening', skill: 'listening', ref: 'ls:' + n, mode: mode, min: R.min, items: S.qs.map(function (x, i) { return ['q' + (i + 1), lCorrect(x, R.ans[i]) ? 2 : 0, 'sec-' + S.type]; }) });
        S.qs.forEach(function (x, i) { if (lCorrect(x, R.ans[i])) return; M().errors.add({ skill: 'listening', src: 'ls:' + n, key: 'q' + (i + 1), q: L(S.title) + ' · ' + x.q, resp: R.ans[i] || '', correct: x.a, cat: R.why[i], expl: (x.why ? L(x.why) + ' · ' : '') + L(M().C().listenReasons[R.why[i]] || ''), follow: 'mission/run/listen/' + n }); });
        M().save(); R.saved = true; App.render(); U.markTask('listening');
      });
      paintLine();
    });
    return h + '</div>';
  }

  /* ====================== TARGET LISTENING 1 (kitob audiosi) =========== */
  function runTL(test, half, q) {
    var keyStr = M().Cat.tlKey(test); if (!keyStr) return page(t('Test topilmadi', 'Test not found'), '') + '</div>';
    var from = half === '2' ? 16 : 1, to = half === '1' ? 15 : 30, mode = q.mode || 'practice', key = 'tl:' + test + ':' + half + ':' + mode;
    var R = RUN[key] = RUN[key] || { start: Date.now(), ans: {}, why: {}, checked: false, saved: false };
    var D = M().Cat.tl();
    var h = page('Target Listening 1 — ' + t(test + '-test', 'Test ' + test), t("Savollar va audio — o'zingizning kitobingizda (" + D.meta.title + "). Platformada faqat kitobning javob kaliti bor. Audioni to'xtatmasdan tinglang, javobni shu yerga belgilang.", 'Questions and audio are in your own book (' + D.meta.title + '). The platform holds only the book\'s answer key. Listen without pausing and mark your answers here.'), 'home');
    h += '<div class="ms-runbar"><span class="ms-clock" id="msClock">0:00</span><span>' + t('Savollar ', 'Questions ') + from + '–' + to + '</span><audio id="tlAudio" controls hidden></audio>' + filePick('tlFile', 'audio/*', t("Kitob audiosini biriktirish (ixtiyoriy)", 'Attach the book audio (optional)'), { cls: 'compact' }) + '</div>';
    h += '<section class="card ms-qs"><div class="ms-sheet">';
    for (var i = from; i <= to; i++) {
      var a = R.ans[i], k = keyStr[i - 1], ok = R.checked ? a === k : null;
      h += '<div class="ms-sq' + (R.checked ? (ok ? ' right' : ' wrong') : '') + '"><b>' + i + '</b>' + ['A', 'B', 'C', 'D', 'E'].map(function (L2) { return '<button class="ms-let' + (a === L2 ? ' on' : '') + (R.checked && L2 === k ? ' key' : '') + '" data-tla="' + i + ':' + L2 + '"' + (R.checked ? ' disabled' : '') + '>' + L2 + '</button>'; }).join('') +
        (R.checked && !ok ? reasonSel(String(i), M().C().listenReasons, R.why[i]) : '') + '</div>';
    }
    h += '</div>';
    if (!R.checked) h += '<div class="ms-acts"><button class="btn btn-primary" id="tlCheck">' + IC.check + t('Kalit bilan tekshirish', 'Check against the key') + '</button></div>';
    else {
      var right = 0; for (var j = from; j <= to; j++) if (R.ans[j] === keyStr[j - 1]) right++;
      var need = 0; for (j = from; j <= to; j++) if (R.ans[j] !== keyStr[j - 1] && !R.why[j]) need++;
      h += '<div class="ms-score"><b>' + right + ' / ' + (to - from + 1) + '</b> <span class="hint">' + t('amaliy ball (kitob kaliti)', 'practice score (book key)') + '</span></div>';
      if (!R.saved) h += '<div class="ms-acts"><span class="hint">' + (need ? t(need + ' ta xato uchun sabab tanlang (kitob transkriptini ko\'ring)', 'Choose a reason for ' + need + ' miss(es) (check the transcript in your book)') : '') + '</span><button class="btn btn-primary" id="tlSave"' + (need ? ' disabled' : '') + '>' + t('Saqlash', 'Save') + '</button></div>';
      else h += doneBox(t('Saqlandi.', 'Saved.'));
    }
    h += '</section>';
    U.setMount(function () {
      startTimer(function () { return R.start; }, 0);
      attachAudio($('#tlAudio'), 'tl:' + test);
      var f = $('#tlFile'); if (f) f.addEventListener('change', function () { var file = f.files[0]; if (!file) return; MissionMedia.put('tl:' + test, file).then(function () { attachAudio($('#tlAudio'), 'tl:' + test); toast(t('Audio shu brauzerda saqlandi', 'Audio saved in this browser'), 'ok'); }, function () { toast(t('Saqlanmadi', 'Not saved'), 'warn'); }); });
      $$('[data-tla]').forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.tla.split(':'); R.ans[p[0]] = R.ans[p[0]] === p[1] ? null : p[1]; App.render(); }); });
      $$('[data-reason]').forEach(function (el) { el.addEventListener('change', function () { R.why[el.dataset.reason] = el.value; App.render(); }); });
      var c = $('#tlCheck'); if (c) c.addEventListener('click', function () { R.checked = true; R.min = mins(R.start); App.render(); });
      var s = $('#tlSave'); if (s) s.addEventListener('click', function () {
        var halves = half === 'all' ? [['1', 1, 15], ['2', 16, 30]] : [[half, from, to]];
        halves.forEach(function (hv) {
          var items = []; for (var x = hv[1]; x <= hv[2]; x++) items.push(['q' + x, R.ans[x] === keyStr[x - 1] ? 2 : 0, 'tl-test']);
          M().record({ kind: 'listening', skill: 'listening', ref: 'tl:' + test + ':' + hv[0], mode: mode, min: Math.round(R.min / halves.length), items: items });
        });
        for (var x = from; x <= to; x++) if (R.ans[x] !== keyStr[x - 1]) M().errors.add({ skill: 'listening', src: 'tl:' + test, key: 'q' + x, q: 'Target Listening 1 · ' + t('Test ', 'Test ') + test + ' · Q' + x, resp: R.ans[x] || '—', correct: keyStr[x - 1], cat: R.why[x], expl: L(M().C().listenReasons[R.why[x]] || ''), follow: 'mission/run/tl/' + test + '/' + (x <= 15 ? '1' : '2') });
        M().save(); R.saved = true; App.render(); U.markTask('listening');
      });
    });
    return h + '</div>';
  }

  /* ====================== O'Z TESTINGIZ ================================ */
  function runCustom(id, q) {
    var c = M().M().custom[id]; if (!c) return page(t('Test topilmadi', 'Test not found'), '') + '<p><button class="btn btn-ghost btn-sm" data-go="mission/import">' + t('Testlar', 'Tests') + '</button></p></div>';
    var key = 'cu:' + id, R = RUN[key] = RUN[key] || { start: Date.now(), ans: {}, why: {}, checked: false, saved: false };
    var h = page(c.title, t("Siz kiritgan test. Kalit — sizniki; audio (bo'lsa) faqat shu brauzerda.", 'Your imported test. The key is yours; the audio (if any) is only in this browser.'), 'tests');
    h += '<div class="ms-runbar"><span class="ms-clock" id="msClock">0:00</span><audio id="cuAudioEl" controls hidden></audio>' + (c.audio ? '' : '<span class="hint">' + t('Audio biriktirilmagan — kitob/qurilmangizdan tinglang', 'No audio attached — play it from your book/device') + '</span>') + '</div><section class="card ms-qs">';
    c.key.forEach(function (k, i) {
      var a = R.ans[i], ok = R.checked ? textMatch(a, k.split(/\s*\/\s*/).join(' / ')) || k.split(/\s*\/\s*/).some(function (alt) { return textMatch(a, alt); }) : null;
      h += '<div class="ms-q' + (R.checked ? (ok ? ' right' : ' wrong') : '') + '"><div class="ms-qt"><b>' + (i + 1) + '.</b></div><input class="input" name="q' + i + '" value="' + esc(a || '') + '" autocomplete="off" spellcheck="false"' + (R.checked ? ' disabled' : '') + '>';
      if (R.checked && !ok) h += '<div class="ms-fb"><span class="good">' + esc(k) + '</span></div>' + reasonSel(String(i), M().C().listenReasons, R.why[i] != null ? R.why[i] : suggestReason(a, k.split('/')[0]));
      h += '</div>';
    });
    var okOf = function (i) { var k = c.key[i]; return k.split(/\s*\/\s*/).some(function (alt) { return textMatch(R.ans[i], alt); }); };
    if (!R.checked) h += '<div class="ms-acts"><button class="btn btn-primary" id="cuCheck">' + IC.check + t('Tekshirish', 'Check') + '</button></div>';
    else if (!R.saved) h += '<div class="ms-score"><b>' + c.key.filter(function (k, i) { return okOf(i); }).length + ' / ' + c.key.length + '</b></div><div class="ms-acts"><button class="btn btn-primary" id="cuSave">' + t('Saqlash', 'Save') + '</button></div>';
    else h += doneBox(t('Saqlandi.', 'Saved.'));
    h += '</section>';
    U.setMount(function () {
      startTimer(function () { return R.start; }, 0);
      if (c.audio) attachAudio($('#cuAudioEl'), 'cu:' + id);
      $$('.ms-qs [name^="q"]').forEach(function (el) { el.addEventListener('input', function () { R.ans[Number(el.name.slice(1))] = el.value; }); });
      $$('[data-reason]').forEach(function (el) { el.addEventListener('change', function () { R.why[el.dataset.reason] = el.value; }); });
      var ck = $('#cuCheck'); if (ck) ck.addEventListener('click', function () { R.checked = true; R.min = mins(R.start); App.render(); });
      var sv = $('#cuSave'); if (sv) sv.addEventListener('click', function () {
        c.key.forEach(function (k, i) { if (!okOf(i) && R.why[i] == null) R.why[i] = suggestReason(R.ans[i], k.split('/')[0]); });
        M().record({ kind: 'listening', skill: 'listening', ref: 'cu:' + id, mode: 'practice', min: R.min, items: c.key.map(function (k, i) { return ['q' + (i + 1), okOf(i) ? 2 : 0, 'own-test']; }) });
        c.key.forEach(function (k, i) { if (!okOf(i)) M().errors.add({ skill: 'listening', src: 'cu:' + id, key: 'q' + (i + 1), q: c.title + ' · Q' + (i + 1), resp: R.ans[i] || '—', correct: k, cat: R.why[i], expl: L(M().C().listenReasons[R.why[i]] || ''), follow: 'mission/run/custom/' + id }); });
        M().save(); R.saved = true; App.render(); U.markTask('listening');
      });
    });
    return h + '</div>';
  }

  /* ====================== GRAMMATIKA =================================== */
  function grammarSet(cat) {
    var C = M().C();
    if (cat === 'diag') {
      var out = [];
      Object.keys(C.grammarCats).forEach(function (c) { out = out.concat(M().Cat.grammarItems(c).filter(function (it) { return M().Cat.autoAnswers(it.a); }).slice(0, 2)); });
      return out;
    }
    var all = M().Cat.grammarItems(cat), good = {};
    M().attemptsOf('grammar').forEach(function (a) { a.items.forEach(function (x) { if (x[1] === 2) good[x[0]] = (good[x[0]] || 0) + 1; }); });
    return all.slice().sort(function (a, b) { return (good[a.id] || 0) - (good[b.id] || 0) || (M().Cat.autoAnswers(b.a) ? 1 : 0) - (M().Cat.autoAnswers(a.a) ? 1 : 0); }).slice(0, 8);
  }
  function ruleOf(topic) { var G = window.ENG_GRAMMAR && ENG_GRAMMAR[topic]; return G ? { name: L(G.name), short: L(G.short), rule: L(G.rule) } : null; }
  function runGrammar(cat, q) {
    var C = M().C(), mode = q.mode || (cat === 'diag' ? 'diagnostic' : 'practice'), key = 'g:' + cat + ':' + mode + ':' + M().today();
    if (cat !== 'diag' && !C.grammarCats[cat]) cat = 'tenses';
    var R = RUN[key] = RUN[key] || { start: Date.now(), items: grammarSet(cat), ans: {}, hint: {}, res: {}, checked: false, saved: false };
    var title = cat === 'diag' ? t('Grammatika diagnostikasi', 'Grammar diagnostic') : L(C.grammarCats[cat].title);
    var h = page(title, t("Bo'sh joyni to'ldiring. Qoida — faqat yordam tugmasi orqali (u natijani \"yordam bilan\" qiladi). Aniq kalitli savollar avtomatik, qolganlari o'z-o'zini tekshirish.", 'Fill the gap. The rule is behind the hint button (it marks the item "with help"). Clean-key items are auto-checked; the rest are self-checked.'), 'home');
    /* Takrorlanuvchi xato → qisqa tushuntirish */
    if (cat !== 'diag') {
      var gf = M().errors.list().filter(function (e) { return e.skill === 'grammar' && e.cat === cat && e.status !== 'fixed'; });
      if (gf.length >= 2) {
        var topics = {}; gf.forEach(function (e) { var tp = String(e.src).split(':')[1]; if (tp) topics[tp] = (topics[tp] || 0) + 1; });
        var top = Object.keys(topics).sort(function (a, b) { return topics[b] - topics[a]; })[0] || C.grammarCats[cat].keys[0], rl = ruleOf(top);
        if (rl) h += '<details class="callout tip ms-rule" open><summary>' + IC.bulb + t('Takrorlanuvchi xato — qisqa tushuntirish: ', 'Recurring error — short explanation: ') + esc(rl.name) + ' (' + gf.length + ')</summary><p><b>' + esc(rl.short) + '</b></p><p>' + esc(rl.rule) + '</p></details>';
      }
    }
    h += '<div class="ms-runbar"><span class="ms-clock" id="msClock">0:00</span><span>' + R.items.length + t(' mashq', ' exercises') + '</span></div><section class="card ms-qs">';
    R.items.forEach(function (it, i) {
      var auto = M().Cat.autoAnswers(it.a), a = R.ans[i] || '', res = R.res[i];
      h += '<div class="ms-q' + (R.checked ? (res === 2 ? ' right' : res === 1 ? ' part' : res === 0 ? ' wrong' : '') : '') + '"><div class="ms-qt"><b>' + (i + 1) + '.</b> ' + esc(it.q) + ' <span class="chip">' + esc(L(C.grammarCats[it.cat].title)) + '</span></div>' +
        '<input class="input" name="q' + i + '" value="' + esc(a) + '" autocomplete="off" spellcheck="false"' + (R.checked ? ' disabled' : '') + '>';
      if (!R.checked) h += (R.hint[i] ? '<p class="hint">' + esc((ruleOf(it.topic) || {}).short || '') + '</p>' : '<button class="btn btn-quiet btn-sm" data-ghint="' + i + '">' + IC.bulb + t('Qoida (yordam)', 'Rule (hint)') + '</button>');
      else {
        h += '<div class="ms-fb"><span class="good">' + t('Kalit: ', 'Key: ') + esc(it.a) + '</span>' + (auto ? '<span class="tag">' + t('avtomatik', 'auto-checked') + '</span>' : '<span class="tag">' + t("o'z-o'zini tekshirish", 'self-check') + '</span>') + '</div>';
        if (res == null || (!auto && !R.saved) || (auto && res === 0 && !R.saved)) h += '<div class="ms-acts sm">' + (auto && res === 0 ? '<span class="hint">' + t("Javobingiz ham to'g'ri deb hisoblasangiz:", 'If you believe your answer is also correct:') + '</span>' : '') +
          '<button class="btn btn-ghost btn-sm' + (res === 2 ? ' on' : '') + '" data-gres="' + i + ':2">' + t("To'g'ri", 'Correct') + '</button><button class="btn btn-ghost btn-sm' + (res === 1 ? ' on' : '') + '" data-gres="' + i + ':1">' + t('Qisman', 'Partly') + '</button><button class="btn btn-ghost btn-sm' + (res === 0 ? ' on' : '') + '" data-gres="' + i + ':0">' + t('Xato', 'Wrong') + '</button></div>';
        var rl2 = ruleOf(it.topic); if (res !== 2 && rl2) h += '<p class="hint">' + esc(rl2.short) + '</p>';
      }
      h += '</div>';
    });
    if (!R.checked) h += '<div class="ms-acts"><button class="btn btn-primary" id="gCheck">' + IC.check + t('Tekshirish', 'Check') + '</button></div>';
    else {
      var pending = R.items.filter(function (it, i) { return R.res[i] == null; }).length;
      var sc = R.items.reduce(function (s, it, i) { return s + (R.res[i] === 2 ? 1 : R.res[i] === 1 ? 0.5 : 0); }, 0);
      h += '<div class="ms-score"><b>' + sc + ' / ' + R.items.length + '</b></div>';
      if (!R.saved) h += '<div class="ms-acts"><span class="hint">' + (pending ? t(pending + " ta savolni o'zingiz belgilang", 'Mark ' + pending + ' item(s) yourself') : '') + '</span><button class="btn btn-primary" id="gSave"' + (pending ? ' disabled' : '') + '>' + t('Saqlash', 'Save') + '</button></div>';
      else h += doneBox(t('Saqlandi. Xatolar toifasi bo\'yicha takrorga tushdi.', 'Saved. Errors joined the review queue by category.'), cat !== 'diag' ? ' <button class="btn btn-primary btn-sm" data-go="mission/writing/new?task=2&focus=' + cat + '">' + IC.pen + t("Endi yozuvda 3 marta ishlating", 'Now use it 3 times in writing') + '</button>' : ' <button class="btn btn-primary btn-sm" data-go="mission/writing/new?task=2&prompt=t2-01&mode=diagnostic&timed=40">' + IC.pen + t('Writing diagnostikasi', 'Writing diagnostic') + '</button>');
    }
    h += '</section>';
    U.setMount(function () {
      startTimer(function () { return R.start; }, 0);
      $$('.ms-qs [name^="q"]').forEach(function (el) { el.addEventListener('input', function () { R.ans[Number(el.name.slice(1))] = el.value; }); });
      $$('[data-ghint]').forEach(function (b) { b.addEventListener('click', function () { R.hint[b.dataset.ghint] = true; App.render(); }); });
      var c = $('#gCheck'); if (c) c.addEventListener('click', function () {
        R.items.forEach(function (it, i) {
          var auto = M().Cat.autoAnswers(it.a); if (!auto) return;
          var a = M().norm(R.ans[i] || '');
          R.res[i] = a && auto.indexOf(a) >= 0 ? (R.hint[i] ? 1 : 2) : 0;
        });
        R.checked = true; R.min = mins(R.start); App.render();
      });
      $$('[data-gres]').forEach(function (b) { b.addEventListener('click', function () { var p = b.dataset.gres.split(':'); var v = Number(p[1]); if (v === 2 && R.hint[p[0]]) v = 1; R.res[p[0]] = v; App.render(); }); });
      var s = $('#gSave'); if (s) s.addEventListener('click', function () {
        M().record({ kind: 'grammar', skill: 'grammar', ref: 'g:' + cat, mode: mode, min: R.min, items: R.items.map(function (it, i) { return [it.id, R.res[i], it.cat]; }) });
        R.items.forEach(function (it, i) { if (R.res[i] === 2) return; var rl = ruleOf(it.topic); M().errors.add({ skill: 'grammar', src: 'g:' + it.topic, key: String(it.id.split(':')[2]), q: it.q, resp: R.ans[i] || '', correct: it.a, cat: it.cat, expl: rl ? rl.short : '', follow: 'mission/run/grammar/' + it.cat }); });
        M().save(); R.saved = true; App.render(); U.markTask('grammar');
      });
    });
    return h + '</div>';
  }

  /* ====================== LUG'AT ======================================= */
  function vocabDiagItems() {
    var D = M().Cat.dest(); if (!D) return [];
    var out = [];
    D.units.slice(0, 6).forEach(function (u) { var sec = u.secs.filter(function (s) { return s.k === 'topic'; })[0] || u.secs[0]; for (var i = 0; i < sec.items.length && out.length < (u.n === D.units[5].n ? 30 : out.length + 5); i += Math.max(1, Math.floor(sec.items.length / 5))) { var it = sec.items[i]; if (it && it[0] && it[1]) out.push({ id: 'd:' + u.n + ':' + sec.k + ':' + i, w: it[0], m: it[1], u: u.n, s: sec.k, theme: u.theme }); } });
    return out.slice(0, 30);
  }
  V.vocab = function (parts, q) {
    var mode = q.mode || 'session', td = M().today();
    var h = page(t("Lug'at — faol eslash", 'Vocabulary — active recall'), t("Ma'nosi ko'rsatiladi → inglizcha so'zni yozasiz. Yordam (birinchi harf) natijani \"yordam bilan\" qiladi. Har yangi so'zga o'z gapingiz. Manba: Destination B2 (o'zbekcha tarjima — kitob bilan birga kelgan) va o'z so'zlaringiz.", 'You see the meaning → type the English word. A hint (first letter) marks it "with help". A personal sentence for every new word. Source: Destination B2 (Uzbek translation bundled with the book) and your own words.'), 'vocab');
    var vs = M().vocab.stats();
    h += '<div class="stat-grid ms-stats">' + U.tile(t("Jami so'z", 'Words'), vs.total) + U.tile(t('Bugun takror', 'Due today'), vs.due, null, vs.due ? 'gold' : '') + U.tile(t("O'rganilmoqda", 'Learning'), vs.learning) + U.tile(t('Tanish', 'Familiar'), vs.familiar) + U.tile(t('Mustahkam', 'Secure'), vs.secure, t('2+ marta ketma-ket mustaqil', '2+ independent in a row')) + U.tile(t("O'z gapi bilan", 'With own sentence'), vs.withExample) + '</div>';
    var key = 'v:' + mode + ':' + td, R = RUN[key];
    if (!R) {
      if (mode === 'diagnostic') R = RUN[key] = { list: vocabDiagItems(), i: 0, typed: '', res: null, items: [], diag: true, start: Date.now() };
      else R = RUN[key] = { list: M().vocab.due(td).map(function (x) { return x.id; }).sort(function () { return 0; }), i: 0, typed: '', res: null, hint: false, phase: 'review', start: Date.now(), nNew: 15, seen: 0 };
    }
    if (R.diag) h += vocabCard(R, true);
    else if (R.phase === 'review' && R.i < R.list.length) h += vocabCard(R, false);
    else h += newWords(R);
    h += U.card(t("O'z so'zingizni qo'shish", 'Add your own word'), '<form class="ms-form" id="ownForm"><div class="ms-frow"><label class="field"><span>' + t("So'z / ibora", 'Word / phrase') + '</span><input class="input" name="w" maxlength="60" required></label><label class="field"><span>' + t("Ma'nosi (o'zbekcha yoki inglizcha)", 'Meaning (Uzbek or English)') + '</span><input class="input" name="m" maxlength="120" required></label></div><label class="field"><span>' + t('Shaxsiy misol', 'Personal example') + '</span><input class="input" name="ex" maxlength="300"></label><div class="ms-acts"><button class="btn btn-ghost btn-sm">' + IC.plus + t("Qo'shish", 'Add') + '</button></div></form>', IC.plus);
    U.setMount(function () {
      var inp = $('#vIn');
      if (inp) { inp.focus(); inp.addEventListener('input', function () { R.typed = inp.value; }); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var b = $('#vCheck'); if (b) b.click(); else { var nx = $('#vNext'); if (nx) nx.click(); } } }); }
      var hb = $('#vHint'); if (hb) hb.addEventListener('click', function () { R.hint = true; App.render(); });
      var cb = $('#vCheck'); if (cb) cb.addEventListener('click', function () {
        var cur = R.list[R.i];
        if (R.diag) {
          var want = M().norm(cur.w), got = M().norm(R.typed), ok = want.split(/\s*[\/,]\s*/).indexOf(got) >= 0 || got === want;
          R.res = { ok: ok, word: cur.w }; R.items.push([cur.id, ok ? 2 : 0, cur.s]);
          if (!ok) M().vocab.learn(cur);
        } else R.res = M().vocab.check(cur, R.typed, R.hint);
        App.render();
      });
      var nb = $('#vNext'); if (nb) nb.addEventListener('click', function () {
        var ex = $('#vEx'); if (ex && ex.value.trim() && !R.diag) M().vocab.setExample(R.list[R.i], ex.value.trim());
        R.i++; R.typed = ''; R.res = null; R.hint = false;
        if (R.diag && R.i >= R.list.length) { M().record({ kind: 'vocab', skill: 'vocab', ref: 'v:diag', mode: 'diagnostic', min: mins(R.start), items: R.items }); R.done = true; }
        App.render();
      });
      $$('[data-learn]').forEach(function (b) { b.addEventListener('click', function () {
        var it = JSON.parse(b.dataset.learn), ex = $('[data-lex="' + it.id + '"]'), col = $('[data-lcol="' + it.id + '"]');
        if (!ex || ex.value.trim().split(/\s+/).length < 4) { toast(t("Kamida 4 so'zli o'z gapingizni yozing", 'Write your own sentence (4+ words)'), 'warn'); return; }
        if (ex.value.toLowerCase().indexOf(String(it.w).toLowerCase().split(/[\s\/]/)[0].slice(0, 4)) < 0) { if (!confirm(t("Gapda so'z ko'rinmayapti. Baribir saqlansinmi?", "The word doesn't seem to appear in your sentence. Save anyway?"))) return; }
        M().vocab.learn(it); M().vocab.setExample(it.id, ex.value.trim(), col ? col.value.trim() : ''); R.seen++; App.render();
      }); });
      var sk = $('#vSkipNew'); if (sk) sk.addEventListener('click', function () { R.nNew = 0; App.render(); });
      var mo = $('#vMore'); if (mo) mo.addEventListener('click', function () { R.nNew += 5; App.render(); });
      var ow = $('#ownForm'); if (ow) ow.addEventListener('submit', function (e) { e.preventDefault(); if (M().vocab.addOwn(ow.w.value, ow.m.value, ow.ex.value)) { toast(t("Qo'shildi — ertaga takror", 'Added — review tomorrow'), 'ok'); App.render(); } });
      if ((R.phase === 'review' && R.i >= R.list.length && R.seen >= Math.min(5, R.nNew)) || R.done) U.markTask('vocab');
    });
    return h + '</div>';
  };
  function vocabCard(R, diag) {
    if (diag && (R.done || R.i >= R.list.length)) {
      var ok = R.items.filter(function (x) { return x[1] === 2; }).length;
      return U.card(t('Diagnostika tugadi', 'Diagnostic finished'), '<p><b>' + ok + ' / ' + R.items.length + '</b> ' + t("so'z mustaqil eslab yozildi. Eslanmaganlari kartochkalarga qo'shildi (ertaga takror).", 'words recalled independently. The ones you missed were added to your deck (review tomorrow).') + '</p>' + doneBox(''), IC.check);
    }
    var cur = R.list[R.i], it = diag ? cur : M().vocab.item(cur); if (!it) { R.i++; return ''; }
    var b = '<p class="ms-count">' + (R.i + 1) + ' / ' + R.list.length + (it.theme ? ' · ' + esc(it.theme) : '') + (it.s ? ' · ' + esc(it.s) : '') + '</p><p class="ms-q big">' + esc(it.m) + '</p>';
    if (!R.res) {
      b += '<label class="field"><span>' + t("Inglizcha so'z", 'English word') + (R.hint ? ' · ' + t('birinchi harf: ', 'first letter: ') + '<b>' + esc(String(it.w).charAt(0)) + '</b>' : '') + '</span><input class="input" id="vIn" value="' + esc(R.typed) + '" autocomplete="off" spellcheck="false"></label>';
      b += '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="vCheck">' + t('Tekshirish', 'Check') + '</button>' + (diag || R.hint ? '' : '<button class="btn btn-quiet btn-sm" id="vHint">' + IC.bulb + t('Yordam', 'Hint') + '</button>') + '</div>';
    } else {
      b += '<div class="ms-ans">' + (R.res.ok ? '<span class="good">' + IC.check + esc(R.res.word) + '</span>' : '<span class="bad">' + esc(R.typed || '—') + '</span><span class="good">' + esc(R.res.word) + '</span>' + (R.res.close ? '<span class="tag">' + t('imlo yaqin', 'spelling close') + '</span>' : '') + '</span>') + '</div>';
      if (!diag) b += '<label class="field"><span>' + t('O\'z gapingiz (ixtiyoriy, eslab qolishga yordam beradi)', 'Your own sentence (optional, helps retention)') + '</span><input class="input" id="vEx" value="' + esc(it.pex || '') + '"></label>';
      b += '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="vNext">' + t('Keyingi', 'Next') + IC.arrowR + '</button></div>';
    }
    return U.card(diag ? t('Diagnostika', 'Diagnostic') : t('Takror', 'Review'), b, IC.refresh);
  }
  function newWords(R) {
    var nw = M().vocab.peekNew(R.nNew);
    var b = R.list.length ? '<p class="ok-line">' + IC.check + t('Takrorlar tugadi.', 'Reviews finished.') + '</p>' : '<p class="hint">' + t("Bugun takror yo'q.", 'No reviews due today.') + '</p>';
    if (!nw.length) b += '<p class="hint">' + t("Yangi so'z qolmadi yoki to'xtatildi.", 'No new words left (or skipped).') + '</p>';
    else b += '<p class="hint">' + t("Har so'zga o'z hayotingizdan (texnologiya, ta'lim, kod…) gap yozing — ko'chirmang.", 'Write a sentence from your own life (technology, education, code…) — do not copy.') + '</p>' + nw.map(function (it) {
      return '<div class="ms-new"><div><b>' + esc(it.w) + '</b> — ' + esc(it.m) + ' <small>' + esc(it.theme || '') + ' · ' + esc(it.s) + '</small></div><input class="input" data-lex="' + esc(it.id) + '" placeholder="' + esc(t("O'z gapingiz…", 'Your sentence…')) + '"><input class="input sm" data-lcol="' + esc(it.id) + '" placeholder="' + esc(t('Kollokatsiya (ixtiyoriy)', 'Collocation (optional)')) + '"><button class="btn btn-ghost btn-sm" data-learn="' + esc(JSON.stringify(it)) + '">' + IC.plus + t("O'rganish", 'Learn') + '</button></div>';
    }).join('') + '<div class="ms-acts"><button class="btn btn-quiet btn-sm" id="vSkipNew">' + t("Bugun yangi so'z yetarli", 'Enough new words today') + '</button><button class="btn btn-quiet btn-sm" id="vMore">+5</button></div>';
    return U.card(t("Yangi so'zlar", 'New words') + (R.seen ? ' · ' + R.seen + ' ' + t("o'rganildi", 'learned') : ''), b, IC.notebook);
  }

  /* ====================== WRITING STUDIO =============================== */
  var BANDS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
  var GUIDE = {
    1: { uz: "Tuzilma: 1) kirish — savolni parafraz; 2) overview — 1–2 asosiy tendensiya (raqamsiz); 3–4) tafsilotlar — guruhlab, raqamlar bilan taqqoslash. 150+ so'z, ~20 daqiqa. Fikr bildirmang.", en: 'Structure: 1) introduction — paraphrase the question; 2) overview — 1–2 main trends (no figures); 3–4) details — grouped, compared with figures. 150+ words, ~20 minutes. No opinions.' },
    2: { uz: "Tuzilma: 1) kirish — parafraz + aniq pozitsiya; 2–3) har abzats: topic sentence → tushuntirish → misol → bog'lash; 4) xulosa — pozitsiyani qayta aytish. 250+ so'z, ~40 daqiqa. Savolning HAR qismiga javob.", en: 'Structure: 1) introduction — paraphrase + clear position; 2–3) each paragraph: topic sentence → explanation → example → link back; 4) conclusion — restate the position. 250+ words, ~40 minutes. Answer EVERY part of the question.' }
  };
  function pickPrompt(task) {
    var used = {}; M().studio.list().forEach(function (p) { if (p.promptId) used[p.promptId] = 1; });
    var ps = M().C().prompts[task] || []; return (ps.filter(function (p) { return !used[p.id]; })[0] || ps[0] || {}).id;
  }
  V.writing = function (parts, q) {
    if (parts[1] === 'new') {
      var task = q.task === '1' ? 1 : 2, pid = q.prompt || pickPrompt(task), mode = q.mode || 'practice';
      var recent = M().studio.list().filter(function (p) { return p.promptId === pid && p.mode === mode && !p.drafts.length && Date.now() - p.created < 3600000; })[0];
      var id = recent ? recent.id : M().studio.create({ task: task, promptId: pid, mode: mode, timed: Number(q.timed) || 0 });
      if (q.focus) { M().studio.get(id).focus = q.focus; M().save(); }
      if (q.timed) { M().studio.get(id).timed = Number(q.timed); M().save(); }
      location.replace('#/mission/writing/' + id);
      return page('Writing Studio', '…', 'writing') + '</div>';
    }
    if (parts[1]) return writingEditor(parts[1]);
    var list = M().studio.list(), C = M().C();
    var h = page('Writing Studio', t("Mustaqil yozish: taymer, so'z soni, qoralamalar va versiyalar, xatolarni belgilash, 4 mezon bo'yicha o'z bahosi va versiyalarni solishtirish. Topshiriqlar platforma uchun yozilgan (rasmiy emas). Ball — o'z taxminingiz, imtihonchi bahosi EMAS.", 'Independent writing: timer, word count, drafts and versions, error marking, self-assessment on the 4 criteria and version comparison. Prompts are written for the platform (not official). Scores are your own estimate, NOT an examiner score.'), 'writing');
    var sel = function (task) { return '<select class="input" id="np' + task + '">' + C.prompts[task].map(function (p) { var u = list.some(function (x) { return x.promptId === p.id; }); return '<option value="' + p.id + '">' + esc(p.id + ' · ' + p.type + (u ? ' ✓' : '') + ' — ' + p.q.slice(0, 70)) + '…</option>'; }).join('') + '</select>'; };
    h += '<div class="ms-two">' + U.card('Task 1', sel(1) + '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-wnew="1">' + IC.plus + t('Boshlash (20 daq)', 'Start (20 min)') + '</button></div>', IC.pen) + U.card('Task 2', sel(2) + '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-wnew="2">' + IC.plus + t('Boshlash (40 daq)', 'Start (40 min)') + '</button></div>', IC.pen) + '</div>';
    h += U.card(t('Mening ishlarim', 'My pieces') + ' · ' + list.length, list.length ? '<div class="ms-att">' + list.map(function (p) {
      var last = p.drafts[p.drafts.length - 1], wc = last ? M().studio.stats(last.text).words : 0, sa = M().lastSelfAvg(p);
      return '<div><span>' + esc(U.fmtD(Store.dateKey(new Date(p.created)))) + '</span><b>Task ' + p.task + ' · ' + esc(p.promptId || p.title) + '</b><small>' + p.drafts.length + t(' versiya · ', ' version(s) · ') + wc + t(" so'z", ' words') + (p.mode !== 'practice' ? ' · ' + esc(p.mode) : '') + '</small><b>' + (sa != null ? sa.toFixed(1) + ' <small>' + t('taxmin', 'est.') + '</small>' : '—') + '</b><button class="btn btn-quiet btn-sm" data-go="mission/writing/' + p.id + '">' + t('Ochish', 'Open') + '</button></div>';
    }).join('') + '</div>' : '<p class="hint">' + t("Hali ish yo'q.", 'No pieces yet.') + '</p>', IC.doc);
    U.setMount(function () { $$('[data-wnew]').forEach(function (b) { b.addEventListener('click', function () { var tk = b.dataset.wnew; App.go('mission/writing/new?task=' + tk + '&prompt=' + $('#np' + tk).value + '&timed=' + (tk === '1' ? 20 : 40)); }); }); });
    return h + '</div>';
  };
  function dataTable(p) {
    var pr = p.promptId ? M().Cat.prompt(p.task, p.promptId) : null;
    if (!pr || !pr.data) return '';
    return '<table class="ms-table">' + pr.data.map(function (r, i) { return '<tr>' + r.map(function (c) { return i ? '<td>' + esc(c) + '</td>' : '<th>' + esc(c) + '</th>'; }).join('') + '</tr>'; }).join('') + '</table><p class="hint">' + t("Ma'lumotlar mashq uchun o'ylab topilgan.", 'Data invented for practice.') + '</p>';
  }
  function writingEditor(id) {
    var p = M().studio.get(id), C = M().C();
    if (!p) return page('Writing Studio', t('Ish topilmadi', 'Piece not found'), 'writing') + '</div>';
    var R = RUN['w:' + id] = RUN['w:' + id] || { start: null, cmpA: 0, sel: '', tab: 'write' };
    var d = Math.max(0, p.drafts.length - 1), cur = p.drafts[d] ? p.drafts[d].text : '', st = M().studio.stats(cur), min = p.task === 1 ? 150 : 250;
    var h = page('Writing Studio · Task ' + p.task, p.mode === 'diagnostic' ? t('Diagnostika — 40 daqiqa, keyin o\'z bahosi', 'Diagnostic — 40 minutes, then self-assessment') : p.mode === 'mock' ? t('Amaliy mock — vaqt bilan', 'Practice mock — timed') : '', 'writing');
    h += '<div class="ms-wgrid"><div class="ms-wmain">';
    h += '<section class="card ms-card"><h3 class="card-title"><span class="num">' + IC.doc + '</span>' + t('Topshiriq', 'Task') + (p.promptId ? ' · ' + esc(p.promptId) : '') + '</h3><p class="ms-prompt">' + esc(p.prompt || t('(o\'z mavzuingiz)', '(your own topic)')) + '</p>' + dataTable(p) +
      (p.focus && C.grammarCats[p.focus] ? '<div class="callout tip"><span class="co-ic">' + IC.target + '</span><div>' + esc(t('Bugungi grammatika maqsadi: ', "Today's grammar target: ") + L(C.grammarCats[p.focus].title) + t(' — kamida 3 marta ishlating va keyin belgilab tekshiring.', ' — use it at least 3 times, then mark and check it.')) + '</div></div>' : '') +
      '<details class="ms-guide"><summary>' + IC.bulb + t("Tuzilma qo'llanmasi (namuna matn emas — ko'chirish uchun emas)", 'Structure guide (not a model text — not for copying)') + '</summary><p>' + esc(L(GUIDE[p.task])) + '</p></details></section>';
    h += '<section class="card ms-card"><div class="ms-runbar"><span class="ms-clock" id="msClock">' + (p.timed ? p.timed + ':00' : '0:00') + '</span>' + (R.start ? '' : '<button class="btn btn-primary btn-sm" id="wStart">' + IC.play + t('Taymerni boshlash', 'Start timer') + '</button>') + '<span class="hint">' + (p.timed ? t(p.timed + ' daqiqa', p.timed + ' minutes') : t('vaqtsiz', 'untimed')) + '</span><span class="ms-wc' + (st.words >= min ? ' ok' : '') + '" id="wWc">' + st.words + ' / ' + min + '</span><span class="hint" id="wSaved"></span></div>' +
      '<label class="field"><span>' + t('Reja (abzatslar, asosiy fikrlar)', 'Plan (paragraphs, main ideas)') + '</span><textarea class="textarea" id="wPlan" rows="3">' + esc(p.plan || '') + '</textarea></label>' +
      '<label class="field"><span>' + t('Matn — versiya ', 'Text — version ') + (d + 1) + '</span><textarea class="textarea ms-editor" id="wText" rows="16" spellcheck="false">' + esc(cur) + '</textarea></label>' +
      '<div class="ms-acts"><button class="btn btn-ghost btn-sm" id="wMark">' + IC.alert + t('Belgilangan joyni xato deb belgilash', 'Mark selected text as an error') + '</button><button class="btn btn-ghost btn-sm" id="wVer"' + (cur.trim() ? '' : ' disabled') + '>' + IC.copy + t("Qayta yozishni boshlash (yangi versiya)", 'Start a revision (new version)') + '</button></div>' +
      '<div id="wMarkForm" hidden class="ms-markf"><p class="hint" id="wSelTxt"></p><div class="ms-frow"><label class="field"><span>' + t('Toifa', 'Category') + '</span><select class="input" id="wCat">' + Object.keys(C.grammarCats).map(function (k) { return '<option value="' + k + '">' + esc(L(C.grammarCats[k].title)) + '</option>'; }).join('') + Object.keys(C.writeCats).map(function (k) { return '<option value="' + k + '">' + esc(L(C.writeCats[k])) + '</option>'; }).join('') + '</select></label><label class="field"><span>' + t("To'g'ri varianti", 'Correction') + '</span><input class="input" id="wFix"></label></div><label class="field"><span>' + t('Nega xato?', 'Why is it wrong?') + '</span><input class="input" id="wNote"></label><div class="ms-acts"><button class="btn btn-primary btn-sm" id="wMarkSave">' + t('Saqlash (xatolar bankiga ham)', 'Save (also to the error bank)') + '</button></div></div></section>';
    /* statistikalar */
    h += U.card(t("Matn o'lchovlari (baho emas)", 'Text measures (not a grade)'), '<div class="stat-grid">' + U.tile(t("So'z", 'Words'), st.words, st.words < min ? t((min - st.words) + ' ta kam', (min - st.words) + ' short') : t('yetarli', 'enough'), st.words < min ? 'red' : '') + U.tile(t('Abzats', 'Paragraphs'), st.paras, p.task === 2 ? t('odatda 4–5', 'usually 4–5') : t('odatda 3–4', 'usually 3–4')) + U.tile(t('Gap', 'Sentences'), st.sents, t("o'rtacha ", 'avg ') + st.avg + t(" so'z", ' words')) + U.tile(t("Bog'lovchilar", 'Linkers'), st.linkers.length, st.linkers.slice(0, 5).join(', ')) + '</div>' + (st.repeated.length ? '<p class="hint">' + t("Ko'p takrorlangan so'zlar (sinonim o'ylang): ", 'Most repeated words (consider synonyms): ') + st.repeated.map(function (r) { return esc(r[0]) + ' ×' + r[1]; }).join(', ') + '</p>' : ''), IC.trend);
    h += '</div><aside class="ms-wside">';
    /* annotatsiyalar */
    var notes = p.notes || [];
    h += U.card(t('Belgilangan xatolar', 'Marked errors') + ' · ' + notes.length, notes.length ? notes.map(function (n) { return '<div class="ms-note1"><span class="chip">v' + (n.d + 1) + ' · ' + esc(C.grammarCats[n.cat] ? L(C.grammarCats[n.cat].title) : C.writeCats[n.cat] ? L(C.writeCats[n.cat]) : n.cat) + '</span><p><s>' + esc(n.quote) + '</s>' + (n.fix ? ' → <b>' + esc(n.fix) + '</b>' : '') + '</p>' + (n.note ? '<small>' + esc(n.note) + '</small>' : '') + '<button class="btn btn-quiet btn-sm" data-wun="' + esc(n.id) + '">' + IC.trash + '</button></div>'; }).join('') : '<p class="hint">' + t("Matndan bo'lakni belgilab, \"xato deb belgilash\" ni bosing. Belgilar xatolar bankiga tushadi va takrorlanadi.", 'Select part of the text and press "mark as an error". Marks go to the error bank and come back for review.') + '</p>', IC.alert);
    /* o'z bahosi */
    var sa = (p.self || []).filter(function (s) { return s.d === d; })[0] || { scores: {}, checks: {} };
    var crit = C.criteria[p.task];
    h += U.card(t("O'z-o'zini baholash — versiya ", 'Self-assessment — version ') + (d + 1), '<form id="wSelf" class="ms-form">' + crit.map(function (c) {
      return '<fieldset class="ms-crit"><legend>' + esc(c.name) + '</legend>' + c.qs.map(function (qq, qi) { var k = c.k + qi, v = sa.checks[k]; return '<div class="ms-ck"><span>' + esc(L(qq)) + '</span><span class="ms-yn">' + [['y', t('ha', 'yes')], ['p', t('qisman', 'partly')], ['n', t("yo'q", 'no')]].map(function (o) { return '<label><input type="radio" name="' + k + '" value="' + o[0] + '"' + (v === o[0] ? ' checked' : '') + '>' + esc(o[1]) + '</label>'; }).join('') + '</span></div>'; }).join('') +
        '<label class="ms-band">' + t('Taxminiy band', 'Estimated band') + ' <select class="input" name="b_' + c.k + '"><option value="">—</option>' + BANDS.map(function (b) { return '<option' + (Number(sa.scores[c.k]) === b ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></label></fieldset>';
    }).join('') + '<label class="field"><span>' + t('Kuchli tomonlar / keyingi qadam', 'Strengths / next step') + '</span><textarea class="textarea" name="note" rows="2">' + esc(sa.note || '') + '</textarea></label><p class="hint">' + t("Bu — O'Z TAXMININGIZ. Rasmiy imtihonchi bahosi emas. \"Yo'q\" javoblari keyingi versiyada nimani o'zgartirishni ko'rsatadi.", 'This is YOUR ESTIMATE, not an official examiner score. The "no" answers show what to change in the next version.') + '</p><div class="ms-acts"><button class="btn btn-primary btn-sm">' + IC.check + t('Bahoni saqlash', 'Save assessment') + '</button></div></form>', IC.star);
    /* versiyalar va solishtirish */
    if (p.drafts.length > 1) {
      var a = Math.min(R.cmpA, p.drafts.length - 2), df = M().studio.diff(p.drafts[a].text, cur);
      h += U.card(t('Versiyalarni solishtirish', 'Compare versions'), '<label class="hint">' + t('Asl: ', 'From: ') + '<select class="input" id="wCmp">' + p.drafts.slice(0, -1).map(function (x, i) { return '<option value="' + i + '"' + (i === a ? ' selected' : '') + '>v' + (i + 1) + ' · ' + M().studio.stats(x.text).words + t(" so'z", ' w') + '</option>'; }).join('') + '</select> → v' + (d + 1) + '</label><div class="ms-diff">' + df.map(function (x) { return x[0] === '=' ? esc(x[1]) + ' ' : '<' + (x[0] === '+' ? 'ins' : 'del') + '>' + esc(x[1]) + '</' + (x[0] === '+' ? 'ins' : 'del') + '> '; }).join('') + '</div>' +
        '<div class="ms-vers">' + p.drafts.map(function (x, i) { var s2 = (p.self || []).filter(function (s) { return s.d === i; })[0]; var av = s2 ? Object.keys(s2.scores).map(function (k) { return Number(s2.scores[k]); }).filter(function (v) { return v; }) : []; return '<span>v' + (i + 1) + ': ' + M().studio.stats(x.text).words + t(" so'z", ' w') + (av.length ? ' · ' + (Math.round(av.reduce(function (s, v) { return s + v; }, 0) / av.length * 2) / 2) + ' ' + t('taxmin', 'est.') : '') + '</span>'; }).join('') + '</div>', IC.layers);
    }
    h += U.card(t('Tashqi baho (ixtiyoriy)', 'External mark (optional)'), '<form id="wExt" class="ms-frow"><label class="field"><span>' + t('Sertifikatli baholovchi bandi', 'Band from a certified examiner') + '</span><select class="input" name="band"><option value="">—</option>' + BANDS.map(function (b) { return '<option' + (p.external && p.external.band === b ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></label><label class="field"><span>' + t('Izoh', 'Comment') + '</span><input class="input" name="note" value="' + esc(p.external ? p.external.note : '') + '"></label><button class="btn btn-ghost btn-sm">' + t('Saqlash', 'Save') + '</button></form><p class="hint">' + t("Faqat platformadan TASHQARIDAGI baho uchun. O'zingizni bu yerda baholamang.", 'Only for a mark given OUTSIDE the platform. Do not grade yourself here.') + '</p>', IC.medal);
    h += '<div class="ms-acts"><button class="btn btn-quiet btn-sm" id="wDel">' + IC.trash + t("Ishni o'chirish", 'Delete piece') + '</button></div></aside></div>';
    U.setMount(function () {
      var ta = $('#wText'), tm = null, wc = $('#wWc');
      if (R.start) startTimer(function () { return R.start; }, p.timed || 0);
      var sb = $('#wStart'); if (sb) sb.addEventListener('click', function () { R.start = Date.now(); App.render(); });
      ta.addEventListener('input', function () {
        if (!R.start) { R.start = Date.now(); var b = $('#wStart'); if (b) b.remove(); startTimer(function () { return R.start; }, p.timed || 0); }
        var s2 = M().studio.stats(ta.value); wc.textContent = s2.words + ' / ' + min; wc.classList.toggle('ok', s2.words >= min);
        clearTimeout(tm); tm = setTimeout(function () { M().studio.saveDraft(id, ta.value, false); var sv = $('#wSaved'); if (sv) sv.textContent = t('saqlandi ', 'saved ') + new Date().toTimeString().slice(0, 5); }, 700);
      });
      var pl = $('#wPlan'), pt = null; pl.addEventListener('input', function () { clearTimeout(pt); pt = setTimeout(function () { M().studio.setPlan(id, pl.value); }, 700); });
      $('#wVer').addEventListener('click', function () {
        M().studio.saveDraft(id, ta.value, false);
        if (!confirm(t("Joriy matn v" + (d + 1) + " sifatida saqlanadi va uning nusxasi v" + (d + 2) + " bo'lib ochiladi. Davom etasizmi?", 'The current text is kept as v' + (d + 1) + ' and a copy opens as v' + (d + 2) + '. Continue?'))) return;
        M().studio.saveDraft(id, ta.value, true, R.start ? mins(R.start) : 0); R.start = null; App.render();
      });
      $('#wMark').addEventListener('click', function () {
        var s = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
        if (!s) { toast(t('Avval matndan bo\'lakni belgilang', 'Select part of the text first'), 'warn'); return; }
        R.sel = s.slice(0, 300); $('#wSelTxt').textContent = '«' + R.sel + '»'; $('#wMarkForm').hidden = false; $('#wFix').value = R.sel; $('#wNote').focus();
      });
      $('#wMarkSave').addEventListener('click', function () {
        if (!R.sel) return;
        M().studio.saveDraft(id, ta.value, false);
        M().studio.annotate(id, d, { quote: R.sel, cat: $('#wCat').value, note: $('#wNote').value, fix: $('#wFix').value });
        R.sel = ''; toast(t('Belgilandi va bankka qo\'shildi', 'Marked and added to the error bank'), 'ok'); App.render();
      });
      $$('[data-wun]').forEach(function (b) { b.addEventListener('click', function () { M().studio.unannotate(id, b.dataset.wun); App.render(); }); });
      $('#wSelf').addEventListener('submit', function (e) {
        e.preventDefault(); var f = e.target, checks = {}, scores = {};
        crit.forEach(function (c) { c.qs.forEach(function (qq, qi) { var r = f.querySelector('input[name="' + c.k + qi + '"]:checked'); if (r) checks[c.k + qi] = r.value; }); var b = f['b_' + c.k].value; if (b) scores[c.k] = Number(b); });
        if (!Object.keys(checks).length) { toast(t('Kamida savollarga javob bering', 'Answer the checklist questions first'), 'warn'); return; }
        M().studio.saveDraft(id, ta.value, false); M().studio.assess(id, d, scores, checks, f.note.value);
        toast(t("O'z bahosi saqlandi (taxmin)", 'Self-assessment saved (estimate)'), 'ok'); App.render(); U.markTask('grammar');
      });
      var cm = $('#wCmp'); if (cm) cm.addEventListener('change', function () { R.cmpA = Number(cm.value); App.render(); });
      $('#wExt').addEventListener('submit', function (e) { e.preventDefault(); if (!e.target.band.value) return; M().studio.external(id, e.target.band.value, e.target.note.value); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); });
      $('#wDel').addEventListener('click', function () { if (confirm(t("Bu ishni o'chirasizmi? Xatolar bankidagi belgilar qoladi.", 'Delete this piece? Its marks in the error bank are kept.'))) { M().studio.del(id); App.go('mission/writing'); } });
      if ((p.self || []).length) U.markTask('grammar');
    });
    return h + '</div>';
  }

  /* ====================== SPEAKING STUDIO ============================== */
  var REC = { mr: null, chunks: [], t0: 0, stream: null };
  function hashN(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function buildQs(part, card, seed) {
    var p1 = M().Cat.part1(), qs = [], n = hashN(seed);
    if (/1/.test(part) || part === 'full') for (var i = 0; i < 4 && p1.length; i++) qs.push({ p: 1, q: p1[(n + i * 7) % p1.length] });
    if (/2/.test(part) || part === 'full') qs.push({ p: 2, q: card.q, cue: card.cue });
    if (/3/.test(part) || part === 'full') (card.p3 || []).slice(0, 3).forEach(function (x) { qs.push({ p: 3, q: x }); });
    return qs;
  }
  function vocabFor(card) {
    var V2 = window.ENG_VOCAB || {}, q = (card.q || '').toLowerCase();
    var k = /technolog|app|website|invention|ai\b/.test(q) ? 'technology' : /teacher|skill|study|learn|educat|mentor/.test(q) ? 'education' : /work|career|project|decision/.test(q) ? 'work' : 'speaking-fluency';
    return ((V2[k] || {}).words || []).slice(0, 10);
  }
  V.speaking = function (parts, q) {
    if (parts[1] === 'new') {
      var cards = M().Cat.cards(), card = cards.filter(function (c) { return c.id === q.card; })[0] || cards[(M().speaking.list().length) % cards.length];
      var sid = M().speaking.create({ part: q.part || 'full', cardId: card.id, mode: q.mode || 'practice' });
      M().speaking.update(sid, { qs: buildQs(q.part || 'full', card, sid) });
      location.replace('#/mission/speaking/' + sid);
      return page('Speaking Studio', '…', 'speaking') + '</div>';
    }
    if (parts[1]) return speakingSession(parts[1]);
    var list = M().speaking.list(), cards = M().Cat.cards();
    var h = page('Speaking Studio', t("Part 1, 2, 3 — tayyorgarlik taymeri, eslatma, yozib olish va qayta tinglash (audio faqat shu brauzerda), refleksiya va o'z bahosi. O'qituvchi kerak emas.", 'Parts 1, 2, 3 — prep timer, notes, recording and playback (audio stays in this browser), reflection and self-assessment. No teacher needed.'), 'speaking');
    h += U.card(t('Yangi sessiya', 'New session'), '<div class="ms-frow"><label class="field"><span>' + t('Qism', 'Part') + '</span><select class="input" id="spPart"><option value="full">Part 1–3</option><option value="1+2">Part 1 + 2</option><option value="2+3">Part 2 + 3</option><option value="1+3">Part 1 + 3</option><option value="2">Part 2</option></select></label><label class="field"><span>' + t('Mavzu kartasi', 'Cue card') + '</span><select class="input" id="spCard">' + cards.map(function (c) { return '<option value="' + c.id + '">' + esc(c.q) + (c.src === 'mission' ? '' : ' (Speaking 30)') + '</option>'; }).join('') + '</select></label></div><div class="ms-acts"><button class="btn btn-primary btn-sm" id="spNew">' + IC.mic + t('Boshlash', 'Start') + '</button></div>', IC.mic);
    h += U.card(t('Mashq tarixi', 'Practice history') + ' · ' + list.length, list.length ? '<div class="ms-att">' + list.map(function (s) {
      var c = cards.filter(function (x) { return x.id === s.cardId; })[0], sc = s.self ? ['fc', 'lr', 'gra', 'pron'].filter(function (k) { return s.self[k]; }).map(function (k) { return k.toUpperCase() + ' ' + s.self[k]; }).join(' · ') : t('baholanmagan', 'not assessed');
      return '<div><span>' + esc(U.fmtD(s.at)) + '</span><b>Part ' + esc(s.part) + '</b><small>' + esc(c ? c.q : '') + (s.rec ? ' · ' + t('yozuv bor', 'recorded') : '') + '</small><b>' + esc(sc) + '</b><button class="btn btn-quiet btn-sm" data-go="mission/speaking/' + s.id + '">' + t('Ochish', 'Open') + '</button></div>';
    }).join('') + '</div>' : '<p class="hint">—</p>', IC.clock);
    U.setMount(function () { $('#spNew').addEventListener('click', function () { App.go('mission/speaking/new?part=' + encodeURIComponent($('#spPart').value) + '&card=' + $('#spCard').value); }); });
    return h + '</div>';
  };
  function speakingSession(id) {
    var s = M().speaking.get(id); if (!s) return page('Speaking Studio', t('Sessiya topilmadi', 'Session not found'), 'speaking') + '</div>';
    var card = M().Cat.cards().filter(function (c) { return c.id === s.cardId; })[0] || { q: '', cue: [], p3: [] };
    var h = page('Speaking Studio · Part ' + s.part, s.mode === 'diagnostic' ? t('Diagnostika', 'Diagnostic') : s.mode === 'mock' ? t('Amaliy mock', 'Practice mock') : '', 'speaking');
    h += '<div class="ms-wgrid"><div class="ms-wmain">';
    var byP = { 1: [], 2: [], 3: [] }; (s.qs || []).forEach(function (x) { byP[x.p].push(x); });
    if (byP[1].length) h += U.card('Part 1 · ' + t('har javob ~20–30 soniya', '~20–30 seconds each'), '<ol class="ms-ol">' + byP[1].map(function (x) { return '<li>' + esc(x.q) + '</li>'; }).join('') + '</ol>', IC.mic);
    if (byP[2].length) h += U.card('Part 2', '<p class="ms-prompt">' + esc(byP[2][0].q) + '</p><p class="hint">' + t('Aytib bering:', 'You should say:') + '</p><ul class="ms-ul">' + (byP[2][0].cue || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul><div class="ms-runbar"><span class="ms-clock" id="msClock">1:00</span><button class="btn btn-ghost btn-sm" data-sptimer="60">' + t('Tayyorgarlik 1:00', 'Prep 1:00') + '</button><button class="btn btn-ghost btn-sm" data-sptimer="120">' + t('Gapirish 2:00', 'Talk 2:00') + '</button></div>', IC.clock);
    if (byP[3].length) h += U.card('Part 3 · ' + t('sabab + misol + boshqa tomon', 'reason + example + other side'), '<ol class="ms-ol">' + byP[3].map(function (x) { return '<li>' + esc(x.q) + '</li>'; }).join('') + '</ol>', IC.brain);
    h += U.card(t('Eslatmalar', 'Notes'), '<textarea class="textarea" id="spNotes" rows="4" placeholder="' + esc(t('Kalit so\'zlar, misollar…', 'Key words, examples…')) + '">' + esc(s.notes || '') + '</textarea>', IC.doc);
    h += U.card(t('Yozib olish', 'Recording'), '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="spRec">' + IC.mic + t('Yozishni boshlash', 'Start recording') + '</button><button class="btn btn-ghost btn-sm" id="spStop" disabled>' + t("To'xtatish", 'Stop') + '</button><span class="ms-clock" id="spDur">' + (s.dur ? Math.round(s.dur) + ' s' : '') + '</span></div><audio id="spAudio" controls hidden></audio><label class="ms-ckl"><input type="checkbox" id="spNoRec"' + (s.spoke ? ' checked' : '') + '> ' + t('Yozuvsiz gapirdim (talaffuz baholanmaydi)', 'I spoke without recording (pronunciation will not be rated)') + '</label><p class="hint">' + t("Audio faqat shu brauzerda (IndexedDB) saqlanadi — serverga yuborilmaydi va boshqa qurilmada ko'rinmaydi.", 'Audio is stored only in this browser (IndexedDB) — never uploaded, not visible on other devices.') + '</p>', IC.mic);
    h += '</div><aside class="ms-wside">';
    var rf = s.reflection || {}, se = s.self || {};
    var RQ = [['direct', t("Savolga to'g'ridan-to'g'ri javob berdim", 'I answered the question directly')], ['reasons', t('Sabab keltirdim', 'I gave reasons')], ['examples', t('Aniq misol keltirdim', 'I gave a specific example')], ['connected', t("Fikrlar bog'langan edi", 'My ideas were connected')], ['norep', t("So'z/fikr takrorlanmadi", 'I avoided repetition')], ['vocab', t("Mavzu lug'atini tabiiy ishlatdim", 'I used topic vocabulary naturally')]];
    h += U.card(t('Refleksiya va o\'z bahosi', 'Reflection & self-assessment'), '<form id="spSelf" class="ms-form">' + RQ.map(function (r) { return '<label class="ms-ckl"><input type="checkbox" name="' + r[0] + '"' + (rf[r[0]] ? ' checked' : '') + '> ' + esc(r[1]) + '</label>'; }).join('') +
      '<label class="field"><span>' + t('Eshitgan grammatika xatolarim (har biri yangi qatordan → xatolar banki)', 'Grammar errors I heard (one per line → error bank)') + '</span><textarea class="textarea" name="errors" rows="3">' + esc(rf.errors || '') + '</textarea></label>' +
      '<div class="ms-frow">' + [['fc', 'Fluency & Coherence'], ['lr', 'Lexical Resource'], ['gra', 'Grammar Range & Accuracy'], ['pron', 'Pronunciation']].map(function (c) { var dis = c[0] === 'pron' && !s.rec; return '<label class="field"><span>' + esc(c[1]) + (dis ? ' · ' + t('yozuv kerak', 'needs a recording') : '') + '</span><select class="input" name="' + c[0] + '"' + (dis ? ' disabled' : '') + '><option value="">—</option>' + BANDS.map(function (b) { return '<option' + (Number(se[c[0]]) === b ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></label>'; }).join('') + '</div>' +
      '<p class="hint">' + t("O'z taxminingiz — rasmiy emas. " + (s.rec ? '' : 'Yozuv yo\'q: baho faqat til (ravonlik, lug\'at, grammatika) bo\'yicha o\'z kuzatuvingiz.'), 'Your own estimate — not official. ' + (s.rec ? '' : 'No recording: the rating is limited to your observation of language (fluency, vocabulary, grammar).')) + '</p><div class="ms-acts"><button class="btn btn-primary btn-sm">' + IC.check + t('Saqlash', 'Save') + '</button></div></form>', IC.star);
    var vw = vocabFor(card);
    if (vw.length) h += U.card(t("Lug'at takliflari", 'Vocabulary suggestions'), '<div class="ms-vsug">' + vw.map(function (w) { return '<div><b>' + esc(w.w) + '</b>' + (w.col && w.col.length ? ' <small>' + esc(w.col.slice(0, 2).join(' · ')) + '</small>' : '') + '</div>'; }).join('') + '</div><p class="hint">' + t("Platforma lug'atidan (mavzu bo'yicha). Javobda 2–3 tasini tabiiy ishlating.", 'From the platform topic vocabulary. Use 2–3 naturally in your answer.') + '</p>', IC.notebook);
    var hist = M().speaking.list().filter(function (x) { return x.self && x.id !== id; }).slice(0, 5);
    if (hist.length) h += U.card(t('Oldingi baholar', 'Earlier ratings'), '<div class="ms-att">' + hist.map(function (x) { return '<div><span>' + esc(U.fmtD(x.at)) + '</span><small>Part ' + esc(x.part) + '</small><b>' + ['fc', 'lr', 'gra', 'pron'].filter(function (k) { return x.self[k]; }).map(function (k) { return k.toUpperCase() + ' ' + x.self[k]; }).join(' · ') + '</b></div>'; }).join('') + '</div>', IC.trend);
    h += '<div class="ms-acts"><button class="btn btn-quiet btn-sm" id="spDel">' + IC.trash + t("Sessiyani o'chirish", 'Delete session') + '</button></div></aside></div>';
    U.setMount(function () {
      attachAudio($('#spAudio'), 'spk:' + id);
      var nt = null, na = $('#spNotes'); na.addEventListener('input', function () { clearTimeout(nt); nt = setTimeout(function () { M().speaking.update(id, { notes: na.value.slice(0, 3000) }); }, 700); });
      $$('[data-sptimer]').forEach(function (b) { b.addEventListener('click', function () { var t0 = Date.now(), lim = Number(b.dataset.sptimer) / 60; startTimer(function () { return t0; }, lim); }); });
      var rb = $('#spRec'), sb = $('#spStop');
      rb.addEventListener('click', function () {
        if (!navigator.mediaDevices || !window.MediaRecorder) { toast(t("Brauzerda yozib olish yo'q — \"yozuvsiz gapirdim\" ni belgilang", 'Recording not supported — tick "spoke without recording"'), 'warn'); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          REC.stream = stream; REC.chunks = []; REC.t0 = Date.now();
          REC.mr = new MediaRecorder(stream);
          REC.mr.ondataavailable = function (e) { if (e.data.size) REC.chunks.push(e.data); };
          REC.mr.onstop = function () {
            var blob = new Blob(REC.chunks, { type: REC.mr.mimeType || 'audio/webm' }), dur = (Date.now() - REC.t0) / 1000;
            stream.getTracks().forEach(function (tr2) { tr2.stop(); });
            MissionMedia.put('spk:' + id, blob).then(function () { M().speaking.update(id, { rec: true, dur: dur }); App.render(); }, function () { toast(t('Yozuv saqlanmadi', 'Recording not saved'), 'warn'); });
          };
          REC.mr.start(); rb.disabled = true; sb.disabled = false; toast(t('Yozilmoqda…', 'Recording…'), 'ok');
        }, function () { toast(t('Mikrofonga ruxsat berilmadi', 'Microphone permission denied'), 'warn'); });
      });
      sb.addEventListener('click', function () { if (REC.mr && REC.mr.state !== 'inactive') REC.mr.stop(); sb.disabled = true; });
      $('#spNoRec').addEventListener('change', function (e) { M().speaking.update(id, { spoke: e.target.checked }); });
      $('#spSelf').addEventListener('submit', function (e) {
        e.preventDefault(); var f = e.target;
        if (!s.rec && !s.spoke && !$('#spNoRec').checked) { toast(t('Avval yozib oling yoki "yozuvsiz gapirdim" ni belgilang', 'Record first, or tick "spoke without recording"'), 'warn'); return; }
        var refl = { errors: f.errors.value.slice(0, 1500) }; RQ.forEach(function (r) { refl[r[0]] = f[r[0]].checked; });
        var self = {}; ['fc', 'lr', 'gra', 'pron'].forEach(function (k) { if (f[k] && !f[k].disabled && f[k].value) self[k] = Number(f[k].value); });
        if (!Object.keys(self).length) { toast(t('Kamida bitta mezonni baholang', 'Rate at least one criterion'), 'warn'); return; }
        M().speaking.assess(id, self, refl); toast(t('Saqlandi (o\'z bahosi)', 'Saved (self-assessment)'), 'ok'); App.render(); U.markTask('speaking');
      });
      $('#spDel').addEventListener('click', function () { if (confirm(t("Sessiyani o'chirasizmi?", 'Delete this session?'))) { MissionMedia.del('spk:' + id); M().speaking.del(id); App.go('mission/speaking'); } });
      if (s.self) U.markTask('speaking');
    });
    return h + '</div>';
  }
})();
