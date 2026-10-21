/* ==========================================================================
   Haftalik yakun (#/week) — spec §53
   --------------------------------------------------------------------------
   Asosiy savol: JADVAL TO'G'RIMI? Soat noto'g'ri ko'rsatkich, shuning uchun
   uchta signal o'lchanadi (foydalanuvchi qo'ygan mezon):

     1  BLOK YAKUNI      — 5 tadan nechtasi oxirigacha bajarildi
                           (doim 3 chiqsa — jadval hali og'ir)
     2  7 KUNLIK ESLAB QOLISH — bir hafta oldingi materialdan aniqlik
                           (haqiqiy o'lchov: material qoldimi yoki chiqib ketdimi)
     3  ERTALABKI UYG'ONISH — bomdod bloki belgilanganmi
                           (05:20 qiyinlashsa — yuklama oshgan)

   Xulosa qoidasi:
     uchalasi yaxshi  → yadroni 6 s dan 6.5 s ga ko'tarish mumkin
     birortasi yomon  → SOAT QO'SHMA, kamaytir

   Hech narsa o'ylab topilmaydi: har raqam Store dagi haqiqiy yozuvdan.
   Ma'lumot yetarli bo'lmasa — "yetarli ma'lumot yo'q" deb aytiladi.
   ========================================================================== */
(function () {
  'use strict';

  var GOOD = { blocks: 0.8, recall: 0.75, wake: 0.7 };   // "yaxshi" chegarasi

  function mondayOf(key) {
    var d = new Date(key + 'T12:00:00'), dow = (d.getDay() + 6) % 7;
    return Store.shiftDays(key, -dow);
  }
  function days(from) {
    var out = [];
    for (var i = 0; i < 7; i++) out.push(Store.shiftDays(from, i));
    return out;
  }
  function fmtMin(m) {
    var h = Math.floor(m / 60), r = Math.round(m % 60);
    return (h ? h + ' ' + tr('hoursShort') + ' ' : '') + (r ? r + ' ' + tr('engMin') : (h ? '' : '0 ' + tr('engMin')));
  }

  /* ---------- 1-signal: bloklarni oxirigacha bajarish ---------- */
  function sigBlocks(list) {
    var planned = 0, closed = 0, full = 0, partial = 0, perDay = [];
    list.forEach(function (k) {
      if (!window.HabitPlan || !HabitPlan.inRange(k)) { perDay.push(null); return; }
      var p = HabitPlan.forDate(k), core = p.blocks.filter(function (b) { return b.core; });
      if (!core.length) { perDay.push(null); return; }
      var dn = 0, pt = 0;
      core.forEach(function (b) {
        if (!Store.habitBlock(k, b.id)) return;
        dn++;
        var r = Store.blockResult(k, b.id);
        if (r && r.st === 'partial') pt++;
      });
      planned += core.length; closed += dn; full += (dn - pt); partial += pt;
      perDay.push({ key: k, n: core.length, done: dn, partial: pt });
    });
    return { planned: planned, closed: closed, full: full, partial: partial, perDay: perDay,
             ratio: planned ? closed / planned : null };
  }

  /* ---------- 2-signal: 7 kunlik eslab qolish ----------
     Bir hafta (yoki undan avval) BIRINCHI marta ko'rilgan, shu hafta takror
     qilingan bandlar: nechtasi "yaxshi" baholandi. Manba — SRS yozuvlari
     (Store.review: reps, lapses, last). Yangi tizim yaratilmaydi.        */
  function sigRecall(from) {
    var all = Store.reviewAll(), fromMs = new Date(from + 'T00:00:00').getTime();
    var seen = 0, kept = 0;
    Object.keys(all).forEach(function (id) {
      var it = all[id];
      if (!it || !it.last) return;
      var lastMs = typeof it.last === 'number' ? it.last : new Date(it.last).getTime();
      if (isNaN(lastMs) || lastMs < fromMs) return;          // shu haftada takrorlanmagan
      if ((it.reps || 0) < 2) return;                        // hali bir hafta o'tmagan
      seen++;
      /* "eslab qolgan" = oxirgi takrorda tushib ketmagan (ivl o'sgan) */
      if ((it.ivl || 0) >= 7) kept++;
    });
    return { seen: seen, kept: kept, ratio: seen >= 5 ? kept / seen : null };
  }

  /* ---------- 3-signal: ertalabki uyg'onish ---------- */
  function sigWake(list) {
    var n = 0, up = 0;
    list.forEach(function (k) {
      if (!window.HabitPlan || !HabitPlan.inRange(k)) return;
      var p = HabitPlan.forDate(k);
      var fajr = null;
      p.blocks.forEach(function (b) { if (b.prayer === 'fajr') fajr = b; });
      if (!fajr) return;
      n++;
      if (Store.habitBlock(k, fajr.id)) up++;
    });
    return { n: n, up: up, ratio: n ? up / n : null };
  }

  /* ---------- xulosa ---------- */
  function verdict(s) {
    var known = [s.blocks.ratio, s.recall.ratio, s.wake.ratio].filter(function (x) { return x !== null; });
    if (known.length < 2) return { k: 'unknown', t: tr('wkVerdictUnknown') };
    var bad = (s.blocks.ratio !== null && s.blocks.ratio < GOOD.blocks) ||
              (s.recall.ratio !== null && s.recall.ratio < GOOD.recall) ||
              (s.wake.ratio !== null && s.wake.ratio < GOOD.wake);
    if (bad) return { k: 'reduce', t: tr('wkVerdictReduce') };
    return { k: 'raise', t: tr('wkVerdictRaise') };
  }

  function signalCard(n, label, value, hint, ratio, good) {
    var pct = ratio === null ? null : Math.round(ratio * 100);
    var cls = ratio === null ? 'none' : (ratio >= good ? 'ok' : 'low');
    return '<div class="wk-sig ' + cls + '">' +
      '<div class="wk-sig-n">' + n + '</div>' +
      '<div class="wk-sig-b">' +
        '<div class="wk-sig-l">' + esc(label) + '</div>' +
        '<div class="wk-sig-v">' + esc(value) + (pct === null ? '' : ' <small>' + pct + '%</small>') + '</div>' +
        '<div class="wk-sig-h">' + esc(hint) + '</div>' +
      '</div></div>';
  }

  window.PageWeek = function (fromKey) {
    var today = Store.dateKey();
    var from = mondayOf(fromKey || today);
    var list = days(from);
    var s = {
      blocks: sigBlocks(list),
      recall: sigRecall(from),
      wake: sigWake(list)
    };
    var v = verdict(s);
    var load = window.HabitPlan && HabitPlan.weekLoad ? HabitPlan.weekLoad(from) : null;
    var mins = 0; list.forEach(function (k) { var h = Store.hoursOf ? Store.hoursOf(k) : null; if (h) mins += (h.eng || 0) + (h.code || 0); });

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('wkEyebrow')) + '</div>' +
      '<h1>' + esc(tr('wkTitle')) + '</h1><p class="lede">' + esc(tr('wkLede')) + '</p></header>';

    /* Hafta tanlash */
    h += '<div class="wk-nav">' +
      '<button class="btn btn-ghost btn-sm" data-go="week/' + Store.shiftDays(from, -7) + '">' + IC.arrowL + esc(tr('wkPrev')) + '</button>' +
      '<b>' + esc(fmtDate(from)) + ' — ' + esc(fmtDate(Store.shiftDays(from, 6))) + '</b>' +
      (Store.shiftDays(from, 7) <= today
        ? '<button class="btn btn-ghost btn-sm" data-go="week/' + Store.shiftDays(from, 7) + '">' + esc(tr('wkNext')) + IC.arrowR + '</button>'
        : '<span></span>') +
      '</div>';

    /* --- UCH SIGNAL --- */
    h += '<div class="section-head"><div class="sh-n">01</div><div><h2>' + esc(tr('wkSignalsT')) + '</h2>' +
      '<div class="sh-sub">' + esc(tr('wkSignalsS')) + '</div></div></div>';
    h += '<div class="wk-sigs">';
    h += signalCard(1, tr('wkSig1'),
      s.blocks.planned ? (s.blocks.closed + ' / ' + s.blocks.planned) : tr('wkNoData'),
      s.blocks.partial ? tr('wkSig1Partial', { n: s.blocks.partial }) : tr('wkSig1H'),
      s.blocks.ratio, GOOD.blocks);
    h += signalCard(2, tr('wkSig2'),
      s.recall.ratio === null ? tr('wkNoData') : (s.recall.kept + ' / ' + s.recall.seen),
      s.recall.ratio === null ? tr('wkSig2None') : tr('wkSig2H'),
      s.recall.ratio, GOOD.recall);
    h += signalCard(3, tr('wkSig3'),
      s.wake.n ? (s.wake.up + ' / ' + s.wake.n) : tr('wkNoData'),
      tr('wkSig3H'), s.wake.ratio, GOOD.wake);
    h += '</div>';

    h += '<div class="wk-verdict ' + v.k + '">' + (v.k === 'raise' ? IC.check : v.k === 'reduce' ? IC.flame : IC.clock) +
      '<div><b>' + esc(tr('wkVerdictT')) + '</b><p>' + esc(v.t) + '</p></div></div>';

    /* --- YUK --- */
    if (load && load.core) {
      h += '<div class="section-head"><div class="sh-n">02</div><div><h2>' + esc(tr('wkLoadT')) + '</h2>' +
        '<div class="sh-sub">' + esc(tr('fcWeekNote')) + '</div></div></div>';
      h += '<div class="card"><div class="fc-week-grid">' +
        '<div class="fc-st"><b>' + esc(fmtMin(load.core)) + '</b><span>' + esc(tr('fcWkPlanned')) + '</span></div>' +
        '<div class="fc-st"><b>' + esc(fmtMin(load.done)) + '</b><span>' + esc(tr('fcWkDone')) + '</span></div>' +
        '<div class="fc-st"><b>' + esc(fmtMin(load.hard)) + '</b><span>' + esc(tr('loadW_hard')) + '</span></div>' +
        '<div class="fc-st"><b>' + esc(fmtMin(load.med)) + '</b><span>' + esc(tr('loadW_med')) + '</span></div>' +
        '<div class="fc-st"><b>' + esc(fmtMin(load.light)) + '</b><span>' + esc(tr('loadW_light')) + '</span></div>' +
        (mins ? '<div class="fc-st"><b>' + esc(fmtMin(mins)) + '</b><span>' + esc(tr('wkLogged')) + '</span></div>' : '') +
        '</div>' + (window.Focus ? Focus.loadBar(load) : '') + '</div>';
    }

    /* --- KUNMA-KUN --- */
    h += '<div class="section-head"><div class="sh-n">03</div><div><h2>' + esc(tr('wkDaysT')) + '</h2></div></div>';
    h += '<div class="wk-days">';
    s.blocks.perDay.forEach(function (d, i) {
      var k = list[i];
      var dw = new Date(k + 'T12:00:00').getDay();
      var nm = tr('dow' + ((dw + 6) % 7));
      if (!d) { h += '<div class="wk-day off"><b>' + esc(nm) + '</b><span>—</span></div>'; return; }
      var full = d.n && d.done >= d.n;
      h += '<div class="wk-day' + (full ? ' full' : d.done ? ' part' : '') + (k === today ? ' today' : '') + '">' +
        '<b>' + esc(nm) + '</b><span>' + d.done + '/' + d.n + '</span>' +
        (d.partial ? '<i title="' + esc(tr('fcStPartial')) + '">' + d.partial + '</i>' : '') + '</div>';
    });
    h += '</div>';

    /* --- PROGRESS --- */
    h += '<div class="section-head"><div class="sh-n">04</div><div><h2>' + esc(tr('wkProgT')) + '</h2></div></div>';
    h += '<div class="fc-week-grid">' +
      '<div class="fc-st"><b>' + Store.doneCount() + ' / ' + (window.COURSE ? COURSE.length : 30) + '</b><span>Python</span></div>' +
      '<div class="fc-st"><b>' + Store.engDoneCount() + ' / ' + (window.ENG_DAYS ? ENG_DAYS.length : 140) + '</b><span>' + esc(tr('english')) + '</span></div>' +
      '<div class="fc-st"><b>' + (window.Review ? Review.dueCount() : 0) + '</b><span>' + esc(tr('reviewPage')) + '</span></div>' +
      '<div class="fc-st"><b>' + Store.openMistakes().length + '</b><span>' + esc(tr('mistakesOpen')) + '</span></div>' +
      '</div>';

    h += '<div class="lesson-nav no-print" style="margin-top:22px">' +
      '<button class="btn btn-ghost" data-go="today">' + IC.arrowL + esc(tr('todayPage')) + '</button>' +
      '<button class="btn btn-ghost" data-go="analytics">' + esc(tr('analyticsPage')) + IC.arrowR + '</button></div>';

    return h + '</div>';
  };
  window.PageWeek.mount = function () {};
})();
