/* ==========================================================================
   Duolar (#/dua · #/dua/<set>) + "Kun duosi" darvozasi (Today)
   --------------------------------------------------------------------------
   Ma'lumot: js/data/duas.js (DUAS) — tong, ilm, kech, uxlash, uydan chiqish.
   Har kun boshlanishida Today sahifasida KUN DUOSI oqimi chiqadi: tongning
   asosiy duolari (core) + ilm duosi, birma-bir — arabcha, o'qilishi, ma'nosi,
   manbasi, takror hisoblagichi. Oxirida "O'qidim" → Store.done['dua:<sana>'].
   Shu belgi qo'yilmaguncha Today ro'yxati yopiq ("Avval kun duosi"); o'quvchi
   xohlasa "keyinroq" deb ochadi — bu yolg'on belgi qo'ymaydi, faqat shu
   sessiyada ro'yxatni ko'rsatadi. Duo o'qilgan kunlar ketma-ketligi (streak)
   Duolar sahifasida ko'rinadi. Soxta hech narsa yo'q: belgi faqat qo'lda.
   ========================================================================== */
(function () {
  'use strict';

  var FLAG = function (key) { return 'dua:' + key; };
  function isRead(key) { return Store.flag(FLAG(key)); }
  function streak() {
    var n = 0, d = new Date();
    for (var i = 0; i < 400; i++) {
      var k = Store.dateKey(d);
      if (Store.flag(FLAG(k))) n++; else if (i > 0) break;   // bugun hali o'qilmagan bo'lsa ham kechagi zanjir sanaladi
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  function readDays() { var n = 0, all = Store.all().done || {}; Object.keys(all).forEach(function (k) { if (k.indexOf('dua:') === 0) n++; }); return n; }

  /* ---------- bitta duo kartasi ---------- */
  function card(d, opts) {
    opts = opts || {};
    var src = DUAS.sources[d.ref];
    var h = '<article class="dua-card' + (opts.cls ? ' ' + opts.cls : '') + '" data-dua="' + esc(d.id) + '">';
    if (opts.head) h += opts.head;
    if (d.ar && d.ar !== '—') h += '<div class="dua-ar" dir="rtl" lang="ar">' + esc(d.ar) + '</div>';
    h += '<div class="dua-tr">' + esc(d.tr) + '</div>';
    h += '<div class="dua-uz">' + esc(d.uz) + '</div>';
    h += '<div class="dua-foot">' +
      (d.n > 1 ? '<button type="button" class="dua-count" data-duacount="' + d.n + '" aria-label="' + esc(tr('duaCountA')) + '"><b>0</b><span>/ ' + d.n + '</span>' + IC.plus + '</button>' : '<span class="dua-once">' + esc(tr('duaOnce')) + '</span>') +
      '<span class="dua-src" title="' + esc(src ? src.name : '') + '">' + IC.doc + esc(d.src) + (src ? ' <a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + IC.external + '</a>' : '') + '</span>' +
      '</div>';
    return h + '</article>';
  }

  /* ---------- KUN DUOSI darvozasi (Today) ---------- */
  var stepKey = 'uzla.duaStep';
  function stepGet(key) { try { var s = JSON.parse(sessionStorage.getItem(stepKey) || 'null'); return s && s.key === key ? s.i : 0; } catch (e) { return 0; } }
  function stepSet(key, i) { try { sessionStorage.setItem(stepKey, JSON.stringify({ key: key, i: i })); } catch (e) {} }
  function skipped(key) { try { return sessionStorage.getItem('uzla.duaSkip') === key; } catch (e) { return false; } }

  window.DuaGate = {
    isRead: isRead,
    skipped: skipped,
    /* Today sahifasining tepasi: o'qilgan → bir qator; o'qilmagan → oqim */
    render: function (key) {
      if (!window.DUAS) return '';
      if (isRead(key)) {
        return '<div class="dua-done"><span class="dd-ic">' + IC.check + '</span><div><b>' + esc(tr('duaDoneT')) + '</b><span>' + esc(tr('duaDoneS', { n: streak() })) + '</span></div>' +
          '<button class="btn btn-ghost btn-sm" data-go="dua">' + IC.mosque + esc(tr('duaPage')) + '</button></div>';
      }
      var list = DUAS.dayStart(), i = Math.min(stepGet(key), list.length - 1), d = list[i];
      var h = '<section class="dua-gate" id="duaGate" data-key="' + esc(key) + '" data-i="' + i + '" data-n="' + list.length + '">' +
        '<div class="dua-gate-head"><span class="dg-ic">' + IC.mosque + '</span><div><div class="eyebrow">' + esc(tr('duaGateEyebrow')) + '</div><h2>' + esc(tr('duaGateT')) + '</h2><p>' + esc(tr('duaGateS')) + '</p></div>' +
          '<div class="dua-prog"><b>' + (i + 1) + '</b><span>/ ' + list.length + '</span></div></div>' +
        '<div class="dua-dots">' + list.map(function (x, j) { return '<i class="' + (j < i ? 'past' : j === i ? 'now' : '') + '" data-duajump="' + j + '" title="' + esc(x.tr.slice(0, 40)) + '"></i>'; }).join('') + '</div>' +
        card(d, { cls: 'in-gate', head: '<div class="dua-step-t">' + esc(tr('duaStepN', { i: i + 1, n: list.length })) + (d.n > 1 ? ' · <b>' + d.n + '×</b>' : '') + '</div>' }) +
        '<div class="dua-nav">' +
          '<button class="btn btn-ghost" id="duaPrev"' + (i === 0 ? ' disabled' : '') + '>' + IC.arrowL + esc(tr('prev')) + '</button>' +
          '<span class="dua-nav-sp"></span>' +
          '<button class="btn btn-quiet btn-sm" data-go="dua">' + esc(tr('duaAll')) + '</button>' +
          (i < list.length - 1
            ? '<button class="btn btn-primary" id="duaNext">' + esc(tr('next')) + IC.arrowR + '</button>'
            : '<button class="btn btn-primary" id="duaFinish">' + IC.check + esc(tr('duaFinish')) + '</button>') +
        '</div></section>';
      return h;
    },
    /* Ro'yxat ustidagi parda — o'qilmagan bo'lsa */
    gateNote: function (key) {
      if (isRead(key) || skipped(key)) return '';
      return '<div class="dua-veil" id="duaVeil"><span class="dg-ic">' + IC.mosque + '</span><div><b>' + esc(tr('duaVeilT')) + '</b><span>' + esc(tr('duaVeilS')) + '</span></div>' +
        '<button class="btn btn-primary btn-sm" id="duaVeilGo">' + IC.arrowR + esc(tr('duaVeilGo')) + '</button>' +
        '<button class="btn btn-quiet btn-sm" id="duaVeilSkip">' + esc(tr('duaVeilSkip')) + '</button></div>';
    },
    mount: function () {
      var g = $('#duaGate');
      if (g) {
        var key = g.dataset.key, i = Number(g.dataset.i), n = Number(g.dataset.n);
        var go = function (j) { stepSet(key, Math.max(0, Math.min(n - 1, j))); App.render(); var el = $('#duaGate'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        var p = $('#duaPrev'), nx = $('#duaNext'), f = $('#duaFinish');
        if (p) p.addEventListener('click', function () { go(i - 1); });
        if (nx) nx.addEventListener('click', function () { go(i + 1); });
        if (f) f.addEventListener('click', function () {
          Store.setFlag(FLAG(key), true);
          if (Store.logEvent) Store.logEvent('flag', FLAG(key), 'dua');
          stepSet(key, 0);
          toast(tr('duaSavedToast'), 'ok'); App.render();
        });
        $$('[data-duajump]', g).forEach(function (dot) { dot.addEventListener('click', function () { go(Number(dot.dataset.duajump)); }); });
      }
      var v = $('#duaVeil');
      if (v) {
        var vg = $('#duaVeilGo'), vs = $('#duaVeilSkip');
        if (vg) vg.addEventListener('click', function () { var el = $('#duaGate'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        if (vs) vs.addEventListener('click', function () { try { sessionStorage.setItem('uzla.duaSkip', v.closest('.page').querySelector('#duaGate').dataset.key); } catch (e) {} App.render(); });
      }
      DuaGate.mountCounters();
    },
    /* Takror hisoblagichi: bosilganda +1, n ga yetsa yashil; yana bossa 0 */
    mountCounters: function () {
      $$('[data-duacount]').forEach(function (b) {
        b.addEventListener('click', function () {
          var n = Number(b.dataset.duacount), v = Number(b.querySelector('b').textContent) || 0;
          v = v >= n ? 0 : v + 1;
          b.querySelector('b').textContent = v;
          b.classList.toggle('full', v >= n);
        });
      });
    }
  };

  /* ---------- DUOLAR sahifasi ---------- */
  window.PageDua = function (set) {
    if (!window.DUAS) return '<div class="page"><p class="hint">DUAS yo\'q</p></div>';
    var cur = null; DUAS.sets.forEach(function (s) { if (s.key === set) cur = s; });
    if (!cur) cur = DUAS.sets[0];
    var key = Store.dateKey(), read = isRead(key);

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('duaEyebrow')) + '</div><h1>' + esc(tr('duaPage')) + '</h1><p class="lede">' + esc(tr('duaLede')) + '</p></header>';

    h += '<div class="dua-stats">' +
      '<div class="ds"><b>' + (read ? IC.check : IC.clock) + '</b><span>' + esc(read ? tr('duaDoneT') : tr('duaNotYet')) + '</span></div>' +
      '<div class="ds"><b>' + streak() + '</b><span>' + esc(tr('duaStreak')) + '</span></div>' +
      '<div class="ds"><b>' + readDays() + '</b><span>' + esc(tr('duaDays')) + '</span></div>' +
      (read ? '' : '<button class="btn btn-primary btn-sm" data-go="today">' + IC.mosque + esc(tr('duaGoToday')) + '</button>') +
      '</div>';

    h += '<div class="hub-tabs">' + DUAS.sets.map(function (s) {
      return '<button class="hub-tab' + (s.key === cur.key ? ' on' : '') + '" data-go="dua/' + s.key + '"><span>' + esc(L(s.title)) + '</span><small>' + s.items.length + '</small></button>';
    }).join('') + '</div>';

    h += '<div class="intro-block">' + esc(L(cur.lede)) + '</div>';
    h += '<div class="dua-list">' + cur.items.map(function (d, i) {
      return card(d, { head: '<div class="dua-step-t"><span class="dua-n">' + (i + 1) + '</span>' + (d.core ? '<span class="chip topic">' + esc(tr('duaCore')) + '</span>' : '') + (d.n > 1 ? '<b>' + d.n + '×</b>' : '') + '</div>' });
    }).join('') + '</div>';

    /* Manbalar */
    h += '<div class="rd-src"><div class="gc-l">' + esc(tr('rdSourcesT')) + '</div><p class="hint">' + esc(tr('duaSrcS')) + '</p><ul>' +
      Object.keys(DUAS.sources).map(function (k) { var s = DUAS.sources[k]; return '<li><b>[' + k + ']</b> <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a></li>'; }).join('') +
      '</ul></div>';
    return h + '</div>';
  };
  window.PageDua.mount = function () { DuaGate.mountCounters(); };
})();
