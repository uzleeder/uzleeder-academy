/* ==========================================================================
   GoalMap — Maqsad sahifasi tepasidagi xarita (2026 → 2083)
   --------------------------------------------------------------------------
   Yo'l: 4 bosqich (qalin), har birida katta maqsadlar nuqta bo'lib turadi.
   "SEN" nuqtasi — real progressdan: 1-bosqich maqsadlarining o'rtachasi
   (IELTS → ingliz progress/mahorat, Tech → Python progress/mahorat,
   Product → loyihalar, Work → karyera tayyorligi; Finance — qo'lda,
   profilga yoziladi). Qarz kunlari nuqtani ORQAGA suradi (kuniga 0.4%).
   "TAQVIM" belgisi — bugungi sana bo'yicha qayerda bo'lishing kerak edi.
   Ikkalasi orasidagi farq — ortda qolish yoki oldinda yurish.
   ========================================================================== */
(function () {
  'use strict';

  /* Yo'l: 5 anchor orqali silliq egri (Catmull-Rom → 40 nuqta/segment).
     Nuqta (SEN, TAQVIM, maqsadlar) o'sha egri bo'ylab joylashadi — yo'ldan chiqmaydi. */
  var ANCH = [[50, 300], [270, 120], [500, 250], [740, 100], [950, 230]];
  var SEG = (function () {
    var out = [];
    for (var i = 0; i < 4; i++) {
      var p0 = ANCH[Math.max(0, i - 1)], p1 = ANCH[i], p2 = ANCH[i + 1], p3 = ANCH[Math.min(4, i + 2)], pts = [];
      for (var k = 0; k <= 40; k++) {
        var t = k / 40, t2 = t * t, t3 = t2 * t;
        pts.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                  0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
      out.push(pts);
    }
    return out;
  })();
  function at(pos) { var i = Math.min(3, Math.max(0, Math.floor(pos))), t = Math.min(1, Math.max(0, pos - i)); return SEG[i][Math.round(t * 40)]; }
  function pathOf(from, to) { var d = '', pos = from; while (pos < to - 1e-9) { var i = Math.floor(pos), end = Math.min(to, i + 1); var k0 = Math.round((pos - i) * 40), k1 = Math.round((end - i) * 40); for (var k = k0; k <= k1; k++) d += (d ? ' L' : 'M') + SEG[i][k][0].toFixed(1) + ',' + SEG[i][k][1].toFixed(1); pos = end; } return d; }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  /* 1-bosqich o'lchovlari — real ma'lumot */
  function measures() {
    var py = Mastery.python(), en = Mastery.english();
    var ielts = clamp01((Store.engDoneCount() / ENGLISH.meta.days) * .6 + en.overall / 100 * .4);
    var tech = clamp01((Store.doneCount() / 30) * .5 + py.overall / 100 * .5);
    var pj = window.PROJECTS ? PROJECTS.list : [];
    var product = pj.length ? clamp01(pj.filter(function (p) { return Store.flag('proj:' + p.id + ':done'); }).length / pj.length) : 0;
    var ck = 0; for (var i = 0; i < 8; i++) if (Store.flag('cr:' + i)) ck++;
    var work = clamp01(ck / 8 * .5 + (py.overall + en.overall) / 200 * .5);
    var fin = clamp01((Number((Store.profile() || {}).savings) || 0) / 50000);
    return { ielts: ielts, tech: tech, product: product, work: work, finance: fin };
  }
  function progress() {
    var m = measures();
    var real = (m.ielts + m.tech + m.product + m.work + m.finance) / 5;   // 1-bosqich ulushi
    var debt = window.Goal ? Goal.debt().days : 0;
    var pos = Math.max(0, real - debt * 0.004);                              // har qarz kuni −0.4%
    var t = Store.dateKey(), P = MASTERPLAN.phases;
    var cal = 0;
    for (var i = 0; i < P.length; i++) {
      if (t >= P[i].to) cal = i + 1;
      else if (t >= P[i].from) { cal = i + (new Date(t) - new Date(P[i].from)) / (new Date(P[i].to) - new Date(P[i].from)); break; }
    }
    return { m: m, real: real, pos: pos, cal: cal, debt: debt };
  }

  window.GoalMap = {
    progress: progress,
    svg: function () {
      var P = MASTERPLAN.phases, pr = progress(), you = at(pr.pos), cal = at(pr.cal);
      var h = '<svg class="gm-svg" viewBox="0 0 1000 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Goal map">' +
        '<defs><linearGradient id="gmRoad" x1="0" x2="1"><stop offset="0" stop-color="var(--brand)"/><stop offset="1" stop-color="var(--gold)"/></linearGradient>' +
        '<filter id="gmGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
      /* yil o'qi */
      [['2026', 50], ['2029', 270], ['2034', 500], ['2039', 740], ['2083', 950]].forEach(function (y) { h += '<line x1="' + y[1] + '" y1="20" x2="' + y[1] + '" y2="350" class="gm-guide"/><text x="' + y[1] + '" y="368" class="gm-tick">' + y[0] + '</text>'; });
      h += '<path d="' + pathOf(0, 4) + '" class="gm-road-bg"/><path d="' + pathOf(0, 4) + '" class="gm-road-dash"/>';
      if (pr.pos > 0) h += '<path d="' + pathOf(0, pr.pos) + '" class="gm-road-done"/>';
      /* maqsad nuqtalari — raqam bilan, matn yo'q (matn pastdagi indeksda) */
      P.forEach(function (ph, i) {
        ph.goals.forEach(function (g, j) {
          var q = at(i + (j + 1) / (ph.goals.length + 1)), done = i === 0 && g.m && pr.m[g.m] >= .95;
          h += '<g class="gm-goal' + (done ? ' done' : '') + '"><title>' + esc(L(g.t)) + ' · ' + esc(g.when) + '</title><circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="9"/><text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 3.5).toFixed(1) + '" class="gm-gn">' + (i + 1) + '.' + (j + 1) + '</text></g>';
        });
      });
      /* bosqich stansiyalari: tugun + yorliq qutisi (yuqori/past navbat bilan) */
      P.forEach(function (ph, i) {
        var pt = ANCH[i + 1], up = pt[1] < 180, reached = pr.pos >= i + 1, name = L(ph.t), w = Math.min(300, name.length * 7.2 + 28);
        var bx = Math.max(10, Math.min(990 - w, pt[0] - w / 2)), by = up ? pt[1] - 84 : pt[1] + 34;
        h += '<g class="gm-node' + (reached ? ' on' : '') + '">' +
          '<line x1="' + pt[0] + '" y1="' + pt[1] + '" x2="' + pt[0] + '" y2="' + (up ? by + 46 : by) + '" class="gm-stem"/>' +
          '<rect x="' + bx + '" y="' + by + '" width="' + w + '" height="46" rx="10" class="gm-box"/>' +
          '<text x="' + (bx + w / 2) + '" y="' + (by + 19) + '" class="gm-ph">' + esc(name) + '</text>' +
          '<text x="' + (bx + w / 2) + '" y="' + (by + 36) + '" class="gm-y">' + esc(ph.y) + ' · ' + esc(tr('gmAge')) + ' ' + esc(ph.age) + '</text>' +
          '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="15"/><text x="' + pt[0] + '" y="' + (pt[1] + 5) + '" class="gm-nn">' + (i + 1) + '</text></g>';
      });
      h += '<g class="gm-start"><circle cx="50" cy="300" r="7"/><text x="50" y="326" class="gm-y">' + esc(tr('gmStart')) + '</text></g>';
      /* TAQVIM bayrog'i */
      h += '<g class="gm-cal" transform="translate(' + cal[0].toFixed(1) + ',' + cal[1].toFixed(1) + ')"><line x1="0" y1="0" x2="0" y2="-44"/><path d="M0,-44 h44 l-8,9 8,9 h-44z"/><text x="6" y="-31" class="gm-cl">' + esc(tr('gmCal')) + '</text></g>';
      /* SEN */
      h += '<g class="gm-you' + (pr.pos + 0.02 < pr.cal ? ' behind' : ' ahead') + '" transform="translate(' + you[0].toFixed(1) + ',' + you[1].toFixed(1) + ')"><circle r="18" class="gm-halo"/><circle r="9" filter="url(#gmGlow)"/><rect x="-22" y="16" width="44" height="18" rx="9" class="gm-ybox"/><text y="29" class="gm-yl">' + esc(tr('gmYou')) + '</text></g>';
      return h + '</svg>';
    },
    /* Maqsadlar indeksi — xaritadagi raqamlar shu yerda ochiladi */
    index: function () {
      var pr = progress();
      return '<div class="gm-index">' + MASTERPLAN.phases.map(function (ph, i) {
        return '<div class="gm-ix"><b>' + (i + 1) + ' · ' + esc(L(ph.t)) + '</b>' + ph.goals.map(function (g, j) {
          var v = i === 0 && g.m ? Math.round(pr.m[g.m] * 100) : null;
          return '<span><i>' + (i + 1) + '.' + (j + 1) + '</i>' + esc(L(g.t)) + ' <em>' + esc(g.when) + '</em>' + (v !== null ? '<u class="' + (v >= 80 ? 'ok' : v >= 40 ? 'mid' : '') + '">' + v + '%</u>' : '') + '</span>';
        }).join('') + '</div>';
      }).join('') + '</div>';
    },
    legend: function () {
      var pr = progress(), m = pr.m, gap = Math.round((pr.pos - pr.cal) * 100);
      var row = function (k, label) { return '<div class="gm-m"><span>' + esc(label) + '</span><div class="bar"><i style="width:' + Math.round(m[k] * 100) + '%"></i></div><b>' + Math.round(m[k] * 100) + '%</b></div>'; };
      return '<div class="gm-legend"><div class="gm-sum"><b class="' + (gap < -2 ? 'red' : 'green') + '">' + (gap >= 0 ? '+' : '') + gap + '%</b><span>' + esc(gap < -2 ? tr('gmBehind') : tr('gmOnTrack')) + '</span>' + (pr.debt ? '<span class="red">' + esc(tr('gmDebt', { n: pr.debt })) + '</span>' : '') + '</div>' +
        '<div class="gm-ms">' + row('ielts', 'IELTS 7.5+') + row('tech', 'Tech Mastery') + row('product', 'Academy V2 / ' + tr('projectsPage')) + row('work', tr('career')) + row('finance', '$50K') + '</div>' +
        '<p class="hint">' + esc(tr('gmHow')) + '</p></div>';
    },
    plan: function () {
      var pr = progress();
      return '<div class="mp-grid">' + MASTERPLAN.phases.map(function (ph, i) {
        var cur = pr.cal >= i && pr.cal < i + 1;
        return '<section class="mp-phase' + (cur ? ' now' : '') + '"><div class="mp-h"><span class="mp-n">' + (i + 1) + '</span><div><b>' + esc(L(ph.t)) + '</b><span>' + esc(ph.y) + ' · ' + esc(tr('gmAge')) + ' ' + esc(ph.age) + '</span></div>' + (cur ? '<span class="chip topic">' + esc(tr('gmNow')) + '</span>' : '') + '</div>' +
          '<div class="mp-goals">' + ph.goals.map(function (g) {
            var v = i === 0 && g.m ? Math.round(pr.m[g.m] * 100) : null;
            return '<div class="mp-goal"><div class="mp-gt"><b>' + esc(L(g.t)) + '</b><span class="mp-when">' + esc(g.when) + '</span>' + (v !== null ? '<span class="mp-v ' + (v >= 80 ? 'ok' : v >= 40 ? 'mid' : '') + '">' + v + '%</span>' : '') + '</div><p>' + esc(L(g.d)) + '</p></div>';
          }).join('') + '</div></section>';
      }).join('') + '</div>';
    }
  };
})();
