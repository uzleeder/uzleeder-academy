/* ==========================================================================
   Focus — joriy blok, fokus rejimi, blok yakuni, yuk paneli
   --------------------------------------------------------------------------
   Spec §13 (Today buyruq markazi) · §14 (fokus rejimi) · §15 (blok yakuni)
   · §18 (haftalik yuk paneli) · §19 (yuk taqsimoti).

   Manba — JADVAL, ikkinchi tizim emas: `HabitPlan.forDate(kun)` bloklari va
   `HabitPlan.loadOf/weekLoad`. Bu yerda yangi "reja" yaratilmaydi.

   Vaqt SHAHAR vaqti bo'yicha (kompyuter mintaqasiga bog'liq emas) —
   `Focus.now()`, today.js dagi `cityNow()` bilan bir xil mantiq.

   Blok holati (§15): done · partial · skipped.
     done    — bajarildi          → blok yopiladi
     partial — qisman bajarildi   → blok yopiladi + takror bayrog'i
     skipped — o'tkazib yuborildi → blok yopilmaydi
   Jazolash yo'q: natija rejalashtirish uchun o'lchov.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- shahar vaqti (o'nlik soat) ---------- */
  function now() {
    var tz = 5;
    try { tz = Number(HabitPlan.cfg().tz); if (isNaN(tz)) tz = 5; } catch (e) {}
    var c = new Date(Date.now() + tz * 3600000);
    return c.getUTCHours() + c.getUTCMinutes() / 60;
  }
  function dayKey() {
    var tz = 5;
    try { tz = Number(HabitPlan.cfg().tz); if (isNaN(tz)) tz = 5; } catch (e) {}
    var c = new Date(Date.now() + tz * 3600000);
    return c.getUTCFullYear() + '-' + String(c.getUTCMonth() + 1).padStart(2, '0') + '-' + String(c.getUTCDate()).padStart(2, '0');
  }
  function fmtMin(m) {
    var h = Math.floor(m / 60), r = Math.round(m % 60);
    return (h ? h + ' ' + tr('hoursShort') + ' ' : '') + (r ? r + ' ' + tr('engMin') : (h ? '' : '0 ' + tr('engMin')));
  }

  /* ---------- joriy va keyingi blok ---------- */
  function plan(key) {
    if (!window.HabitPlan || !HabitPlan.inRange(key)) return null;
    return HabitPlan.forDate(key);
  }
  /* Hozir davom etayotgan YADRO bloki (jadval vaqti bo'yicha) */
  function current(key) {
    var p = plan(key); if (!p) return null;
    var t = now();
    var hit = null;
    p.blocks.forEach(function (b) { if (b.core && b.from <= t && t < b.to) hit = b; });
    return hit;
  }
  /* Keyingi bajarilmagan yadro bloki (hozirgidan keyin; bo'lmasa bugungi
     birinchi ochiq blok — kun boshida ham foydali bo'lsin) */
  function next(key) {
    var p = plan(key); if (!p) return null;
    var t = now(), open = p.blocks.filter(function (b) {
      return b.core && !Store.habitBlock(key, b.id);
    });
    var after = open.filter(function (b) { return b.from > t; });
    return after[0] || open[0] || null;
  }

  /* ---------- §19 yuk taqsimoti (chiziq) ---------- */
  function loadBar(load, opts) {
    opts = opts || {};
    var total = load.hard + load.med + load.light;
    if (!total) return '';
    var seg = function (k, v) {
      return v ? '<i class="lb-' + k + '" style="flex:' + v + '" title="' + esc(tr('loadW_' + k) + ': ' + fmtMin(v)) + '"></i>' : '';
    };
    var h = '<div class="load-bar' + (opts.sm ? ' sm' : '') + '">' +
      '<div class="lb-track">' + seg('hard', load.hard) + seg('med', load.med) + seg('light', load.light) + '</div>';
    if (!opts.bare) {
      h += '<div class="lb-keys">' +
        (load.hard ? '<span class="lb-k hard"><i></i>' + esc(tr('loadW_hard')) + ' ' + fmtMin(load.hard) + '</span>' : '') +
        (load.med ? '<span class="lb-k med"><i></i>' + esc(tr('loadW_med')) + ' ' + fmtMin(load.med) + '</span>' : '') +
        (load.light ? '<span class="lb-k light"><i></i>' + esc(tr('loadW_light')) + ' ' + fmtMin(load.light) + '</span>' : '') +
        '</div>';
    }
    return h + '</div>';
  }

  /* ---------- §13 Today: JORIY SESSIYA / KEYINGI AMAL ---------- */
  function nowCard(key) {
    var p = plan(key); if (!p) return '';
    var cur = current(key), nx = next(key);
    var b = cur || nx;
    if (!b) return '';
    var isNow = !!cur;
    var done = Store.habitBlock(key, b.id);
    var t = now();
    var left = isNow ? Math.max(1, Math.round((b.to - t) * 60)) : 0;
    var untilMin = !isNow ? Math.max(0, Math.round((b.from - t) * 60)) : 0;

    var h = '<section class="fc-now' + (isNow ? ' live' : '') + '">' +
      '<div class="fc-head">' +
        '<span class="fc-tag">' + (isNow ? '<i class="fc-dot"></i>' + esc(tr('fcNow')) : IC.arrowR + esc(tr('fcNext'))) + '</span>' +
        '<span class="fc-time">' + esc(b.fromStr) + '–' + esc(b.toStr) + '</span>' +
        (b.w ? '<span class="fc-w ' + esc(b.w) + '">' + esc(tr('loadW_' + b.w)) + '</span>' : '') +
      '</div>' +
      '<h2 class="fc-t">' + esc(L(b.t)) + '</h2>' +
      (b.note ? '<p class="fc-note">' + esc(L(b.note)) + '</p>' : '') +
      '<div class="fc-meta">' +
        '<span>' + esc(fmtMin(b.min)) + '</span>' +
        (isNow ? '<span class="fc-left">' + esc(tr('fcLeft', { n: left })) + '</span>'
               : (untilMin ? '<span>' + esc(tr('fcIn', { n: untilMin })) + '</span>' : '')) +
        (done ? '<span class="fc-done">' + IC.check + esc(tr('fcDone')) + '</span>' : '') +
      '</div>' +
      '<div class="fc-acts">' +
        '<button class="btn btn-primary" data-focus="' + esc(b.id) + '">' + IC.play + esc(tr('fcStart')) + '</button>' +
        (b.link ? '<button class="btn btn-ghost" data-go="' + esc(b.link) + '">' + esc(tr('fcOpen')) + IC.arrowR + '</button>' : '') +
        '<button class="btn btn-quiet btn-sm" data-go="habit">' + esc(tr('fcSchedule')) + '</button>' +
      '</div></section>';
    return h;
  }

  /* ---------- §18 haftalik yuk paneli ---------- */
  function weekPanel(key) {
    if (!window.HabitPlan || !HabitPlan.weekLoad) return '';
    var monday = key;
    /* haftaning dushanbasidan boshlaymiz */
    var d = new Date(key + 'T12:00:00'), dow = (d.getDay() + 6) % 7;   // 0 = dushanba
    monday = Store.shiftDays(key, -dow);
    var w = HabitPlan.weekLoad(monday);
    if (!w.days) return '';
    var pct = w.core ? Math.round(w.done / w.core * 100) : 0;
    var debt = window.Goal ? Goal.debt().days : 0;

    return '<section class="fc-week">' +
      '<div class="fc-week-h"><b>' + esc(tr('fcWeekT')) + '</b><span>' + esc(tr('fcWeekS', { n: w.days })) + '</span>' +
        '<span class="fc-week-pct">' + pct + '%</span></div>' +
      '<div class="fc-week-grid">' +
        stat(fmtMin(w.core), tr('fcWkPlanned')) +
        stat(fmtMin(w.done), tr('fcWkDone')) +
        stat(fmtMin(w.hard), tr('loadW_hard')) +
        stat(fmtMin(w.med), tr('loadW_med')) +
        stat(fmtMin(w.light), tr('loadW_light')) +
        stat(debt ? String(debt) : '0', tr('fcWkDebt'), debt ? 'red' : '') +
      '</div>' +
      loadBar(w) +
      '<p class="fc-week-note">' + esc(tr('fcWeekNote')) + '</p>' +
      '</section>';
  }
  function stat(v, l, cls) {
    return '<div class="fc-st' + (cls ? ' ' + cls : '') + '"><b>' + esc(v) + '</b><span>' + esc(l) + '</span></div>';
  }

  /* ---------- §14 FOKUS REJIMI ---------- */
  var openId = null;
  function open(id) {
    var key = dayKey(), p = plan(key); if (!p) return;
    var b = null; p.blocks.forEach(function (x) { if (x.id === id) b = x; });
    if (!b) return;
    openId = id;
    var done = Store.habitBlock(key, b.id);
    var res = Store.blockResult(key, b.id);

    var h = '<div class="fm-wrap" id="focusMode" role="dialog" aria-modal="true" aria-label="' + esc(L(b.t)) + '">' +
      '<div class="fm-card">' +
        '<div class="fm-top">' +
          '<span class="fm-time">' + esc(b.fromStr) + '–' + esc(b.toStr) + '</span>' +
          (b.w ? '<span class="fc-w ' + esc(b.w) + '">' + esc(tr('loadW_' + b.w)) + '</span>' : '') +
          '<button class="icon-btn fm-x" id="fmClose" aria-label="' + esc(tr('close')) + '">' + IC.close + '</button>' +
        '</div>' +
        '<h1 class="fm-t">' + esc(L(b.t)) + '</h1>' +
        (b.note ? '<p class="fm-goal">' + esc(L(b.note)) + '</p>' : '') +
        '<div class="fm-clock" id="fmClock">--:--</div>' +
        '<div class="fm-sub" id="fmSub"></div>' +
        (b.link ? '<button class="btn btn-primary btn-lg fm-open" data-go="' + esc(b.link) + '">' + esc(tr('fcOpen')) + IC.arrowR + '</button>' : '') +
        '<textarea class="fm-note" id="fmNote" rows="2" placeholder="' + esc(tr('fcNotePh')) + '">' + esc(res && res.note ? res.note : '') + '</textarea>' +
        '<div class="fm-end"><div class="fm-end-q">' + esc(tr('fcEndQ')) + '</div>' +
          '<div class="fm-end-b">' +
            '<button class="btn btn-primary" data-fmdone="done">' + IC.check + esc(tr('fcStDone')) + '</button>' +
            '<button class="btn btn-ghost" data-fmdone="partial">' + esc(tr('fcStPartial')) + '</button>' +
            '<button class="btn btn-quiet" data-fmdone="skipped">' + esc(tr('fcStSkipped')) + '</button>' +
          '</div>' +
          '<p class="fm-end-n">' + esc(tr('fcEndNote')) + '</p>' +
        '</div>' +
      '</div></div>';

    var host = document.createElement('div');
    host.innerHTML = h;
    document.body.appendChild(host.firstChild);
    document.documentElement.classList.add('fm-on');

    var el = document.getElementById('focusMode');
    var tick = function () {
      var t = now(), c = document.getElementById('fmClock'), s = document.getElementById('fmSub');
      if (!c) return;
      if (t < b.from) { c.textContent = fmtMin(Math.round((b.from - t) * 60)); s.textContent = tr('fcTillStart'); }
      else if (t < b.to) { c.textContent = fmtMin(Math.max(1, Math.round((b.to - t) * 60))); s.textContent = tr('fcTillEnd'); }
      else { c.textContent = '00:00'; s.textContent = tr('fcOver'); }
    };
    tick();
    var iv = setInterval(function () { if (!document.getElementById('focusMode')) { clearInterval(iv); return; } tick(); }, 20000);

    var close = function () {
      var n = document.getElementById('focusMode');
      if (n) n.remove();
      document.documentElement.classList.remove('fm-on');
      clearInterval(iv); openId = null;
    };
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    document.getElementById('fmClose').addEventListener('click', close);

    /* Klaviatura (§42): Escape yopadi, Tab modal ICHIDA aylanadi (fokus
       tuzog'i) — orqadagi sahifaga tushib ketmaydi.                     */
    var SEL = 'button, textarea, input, select, a[href], [tabindex]:not([tabindex="-1"])';
    document.addEventListener('keydown', function onKey(e) {
      if (!document.getElementById('focusMode')) { document.removeEventListener('keydown', onKey); return; }
      if (e.key === 'Escape') { e.preventDefault(); close(); document.removeEventListener('keydown', onKey); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(el.querySelectorAll(SEL), function (n) {
        return !n.disabled && n.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    });
    el.querySelectorAll('[data-fmdone]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var st = btn.dataset.fmdone;
        var note = (document.getElementById('fmNote') || {}).value || '';
        Store.setBlockResult(key, b.id, st, note);
        /* qisman bajarilgan blok — takror navbatiga (ikkinchi SRS emas, o'shanisi) */
        if (st === 'partial' && window.Review && Review.add) Review.add('block', key + ':' + b.id, { cat: 'habit' });
        toast(tr('fcSaved_' + st), st === 'skipped' ? 'warn' : 'ok');
        close();
        App.render();
      });
    });
    /* fokus: birinchi amal tugmasiga */
    var f = el.querySelector('.fm-open') || document.getElementById('fmClose');
    if (f) f.focus();
  }

  /* ---------- §52 kun yakuni ---------- */
  function endOfDay(key) {
    var p = plan(key); if (!p) return '';
    var t = now();
    var core = p.blocks.filter(function (b) { return b.core; });
    var last = core.length ? core[core.length - 1] : null;
    if (!last || t < last.to) return '';                 // kun tugamagan — ko'rsatmaymiz
    var st = Store.blockStats(key);
    var done = core.filter(function (b) { return Store.habitBlock(key, b.id); }).length;
    var missed = core.length - done;
    return '<section class="fc-eod">' +
      '<div class="fc-eod-h">' + IC.moon + '<b>' + esc(tr('fcEodT')) + '</b></div>' +
      '<div class="fc-week-grid">' +
        stat(done + '/' + core.length, tr('fcEodDone')) +
        stat(String(st.partial), tr('fcStPartial')) +
        stat(String(missed), tr('fcEodMissed'), missed ? 'red' : '') +
      '</div>' +
      '<p class="fc-week-note">' + esc(missed ? tr('fcEodNoteMiss') : tr('fcEodNoteOk')) + '</p>' +
      '</section>';
  }

  /* ---------- mount ---------- */
  function mount() {
    document.querySelectorAll('[data-focus]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(b.dataset.focus); });
    });
  }

  window.Focus = {
    now: now, dayKey: dayKey, current: current, next: next,
    nowCard: nowCard, weekPanel: weekPanel, endOfDay: endOfDay,
    loadBar: loadBar, open: open, mount: mount, fmtMin: fmtMin
  };
})();
