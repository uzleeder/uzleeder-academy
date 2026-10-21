/* ==========================================================================
   Clock — tepadagi soat + flip clock vidjeti (kichik / to'liq ekran)
   --------------------------------------------------------------------------
   Tepada: HH:MM (bosilsa vidjet ochiladi/yopiladi).
   Vidjet (o'ng pastda): uch rejim —
     clock      — HH MM SS (flip raqamlar)
     timer      — orqaga sanash (25 / 50 / 90 daq yoki +5), tugaganda signal;
                  tugagan daqiqani bir bosishda ingliz / coding soatiga qo'shish
     stopwatch  — oldinga sanash
   To'liq ekran: butun ekranni qoplaydi (dars vaqti uchun), Esc / tugma yopadi.
   Holat Store.settings.flip da ({open, mode, full}); taymer qoldig'i ham,
   tab yopilib ochilsa davom etadi (endAt saqlanadi).
   ========================================================================== */
(function () {
  'use strict';

  var el = null, tick = null, S = { mode: 'clock', endAt: 0, left: 25 * 60, run: false, sw: 0, swAt: 0, full: false, done: false };
  var PRESETS = [25, 50, 90];

  function cfg() { return Store.setting('flip') || {}; }
  function save(p) { var c = cfg(); Object.keys(p).forEach(function (k) { c[k] = p[k]; }); Store.setSetting('flip', c); }
  function pad(n) { return ('0' + n).slice(-2); }

  /* --- flip raqam --- */
  function tileHTML(id) { return '<span class="fc-tile" data-fc="' + id + '"><span class="fc-top">0</span><span class="fc-bot">0</span><span class="fc-ft">0</span><span class="fc-fb">0</span></span>'; }
  function setTile(id, v) {
    var t = el.querySelector('[data-fc="' + id + '"]'); if (!t) return;
    if (t.dataset.v === v) return;
    var old = t.dataset.v == null ? v : t.dataset.v;
    t.dataset.v = v;
    var top = t.querySelector('.fc-top'), bot = t.querySelector('.fc-bot'), ft = t.querySelector('.fc-ft'), fb = t.querySelector('.fc-fb');
    if (old === v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { top.textContent = bot.textContent = v; return; }
    ft.textContent = old; fb.textContent = v; top.textContent = v;   // yuqori yarim yangi qiymatni oldindan ko'rsatadi
    t.classList.remove('go'); void t.offsetWidth; t.classList.add('go');
    setTimeout(function () { bot.textContent = v; t.classList.remove('go'); }, 620);
  }

  function values() {
    var a, b, c, now = new Date();
    if (S.mode === 'clock') { a = now.getHours(); b = now.getMinutes(); c = now.getSeconds(); }
    else if (S.mode === 'timer') { var left = S.run ? Math.max(0, Math.round((S.endAt - Date.now()) / 1000)) : S.left; a = Math.floor(left / 3600); b = Math.floor(left % 3600 / 60); c = left % 60; }
    else { var t = S.sw + (S.run ? Date.now() - S.swAt : 0); var s = Math.floor(t / 1000); a = Math.floor(s / 3600); b = Math.floor(s % 3600 / 60); c = s % 60; }
    return [pad(a), pad(b), pad(c)];
  }

  function render() {
    var top = document.getElementById('topClock'); if (top) top.textContent = pad(new Date().getHours()) + ':' + pad(new Date().getMinutes());
    if (!el) return;
    var v = values();
    setTile('h1', v[0][0]); setTile('h2', v[0][1]); setTile('m1', v[1][0]); setTile('m2', v[1][1]); setTile('s1', v[2][0]); setTile('s2', v[2][1]);
    el.querySelector('.fc-mode').textContent = tr('fc_' + S.mode);
    var run = el.querySelector('[data-fca="run"]'); if (run) run.innerHTML = (S.run ? IC.close : IC.play) + '<span>' + esc(S.run ? tr('fcPause') : tr('fcStart')) + '</span>';
    el.querySelector('.fc-ctl').hidden = S.mode === 'clock';
    el.querySelector('.fc-presets').hidden = S.mode !== 'timer';
    el.querySelector('.fc-done').hidden = !(S.mode === 'timer' && S.done);
    /* taymer tugadi */
    if (S.mode === 'timer' && S.run && Date.now() >= S.endAt) { S.run = false; S.left = 0; S.done = true; save({ endAt: 0, run: false, left: 0 }); beep(); if (window.toast) toast(tr('fcDone'), 'ok'); render(); }
  }

  function beep() {
    try {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      [0, .25, .5].forEach(function (d) { var o = ac.createOscillator(), g = ac.createGain(); o.connect(g); g.connect(ac.destination); o.frequency.value = 880; g.gain.setValueAtTime(.001, ac.currentTime + d); g.gain.exponentialRampToValueAtTime(.3, ac.currentTime + d + .02); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + d + .2); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + .22); });
    } catch (e) {}
  }

  function build() {
    el = document.createElement('div'); el.className = 'flip'; el.id = 'flipClock';
    el.innerHTML =
      '<div class="fc-head"><span class="fc-mode"></span><span class="fc-sp"></span>' +
        '<button class="fc-ib" data-fca="mode" title="' + esc(tr('fcMode')) + '">' + IC.refresh + '</button>' +
        '<button class="fc-ib" data-fca="full" title="' + esc(tr('fcFull')) + '">' + IC.eye + '</button>' +
        '<button class="fc-ib" data-fca="close" title="' + esc(tr('close')) + '">' + IC.close + '</button></div>' +
      '<div class="fc-digits">' +
        '<span class="fc-grp">' + tileHTML('h1') + tileHTML('h2') + '</span><i>:</i>' +
        '<span class="fc-grp">' + tileHTML('m1') + tileHTML('m2') + '</span><i>:</i>' +
        '<span class="fc-grp sec">' + tileHTML('s1') + tileHTML('s2') + '</span></div>' +
      '<div class="fc-presets" hidden>' + PRESETS.map(function (m) { return '<button data-fcp="' + m + '">' + m + '</button>'; }).join('') + '<button data-fcp="+5">+5</button></div>' +
      '<div class="fc-ctl" hidden><button class="btn btn-primary btn-sm" data-fca="run"></button><button class="btn btn-quiet btn-sm" data-fca="reset">' + esc(tr('fcReset')) + '</button></div>' +
      '<div class="fc-done" hidden><span>' + esc(tr('fcAddQ')) + '</span><button class="btn btn-ghost btn-sm" data-fcadd="eng">' + IC.globe + esc(tr('english')) + '</button><button class="btn btn-ghost btn-sm" data-fcadd="code">' + IC.code + 'Coding</button></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var a = e.target.closest('[data-fca]'), p = e.target.closest('[data-fcp]'), ad = e.target.closest('[data-fcadd]');
      if (a) {
        var k = a.dataset.fca;
        if (k === 'close') Clock.toggle(false);
        else if (k === 'full') Clock.full(!S.full);
        else if (k === 'mode') { S.mode = S.mode === 'clock' ? 'timer' : S.mode === 'timer' ? 'stopwatch' : 'clock'; S.run = false; S.done = false; save({ mode: S.mode, run: false }); render(); }
        else if (k === 'run') {
          if (S.mode === 'timer') { if (S.run) { S.left = Math.max(0, Math.round((S.endAt - Date.now()) / 1000)); S.run = false; } else { if (S.left <= 0) S.left = 25 * 60; S.endAt = Date.now() + S.left * 1000; S.run = true; S.done = false; } save({ endAt: S.endAt, left: S.left, run: S.run }); }
          else { if (S.run) { S.sw += Date.now() - S.swAt; S.run = false; } else { S.swAt = Date.now(); S.run = true; } }
          render();
        }
        else if (k === 'reset') { S.run = false; S.done = false; if (S.mode === 'timer') { S.left = S.lastPreset || 25 * 60; save({ run: false, left: S.left, endAt: 0 }); } else S.sw = 0; render(); }
      } else if (p) {
        var m = p.dataset.fcp; S.run = false; S.done = false;
        if (m === '+5') S.left += 300; else { S.left = Number(m) * 60; S.lastPreset = S.left; }
        save({ left: S.left, run: false, endAt: 0 }); render();
      } else if (ad) {
        var min = Math.round((S.lastPreset || 25 * 60) / 60);
        Store.addMinutes(Store.dateKey(), ad.dataset.fcadd, min); S.done = false; render();
        if (window.toast) toast(tr('fcAdded', { n: min, t: ad.dataset.fcadd === 'eng' ? tr('english') : 'Coding' }), 'ok');
        if (window.App) App.refreshChrome();
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.full) Clock.full(false); });
  }

  var Clock = {
    init: function () {
      var c = cfg();
      S.mode = c.mode || 'clock'; S.left = c.left != null ? c.left : 25 * 60; S.endAt = c.endAt || 0; S.run = !!c.run && S.endAt > Date.now(); S.lastPreset = c.lastPreset || 25 * 60;
      if (c.run && !S.run && S.mode === 'timer') { S.left = 0; S.done = true; }
      tick = setInterval(render, 1000);
      var top = document.getElementById('topClock'); if (top) top.addEventListener('click', function () { Clock.toggle(); });
      if (c.open) Clock.toggle(true);
      render();
    },
    toggle: function (open) {
      if (!el) build();
      var o = open === undefined ? !el.classList.contains('show') : open;
      el.classList.toggle('show', o); save({ open: o });
      if (!o) Clock.full(false);
      render();
    },
    full: function (f) {
      if (!el) build();
      S.full = !!f; el.classList.toggle('full', S.full); document.body.classList.toggle('flip-full', S.full);
      if (S.full && !el.classList.contains('show')) el.classList.add('show');
      var b = el.querySelector('[data-fca="full"]'); if (b) b.title = S.full ? tr('fcExit') : tr('fcFull');
    }
  };
  window.Clock = Clock;
})();
