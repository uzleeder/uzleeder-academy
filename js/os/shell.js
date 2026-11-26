/* ==========================================================================
   OS.shell — Personal OS qobig'i: yon panel, mobil panel, sahifa yordamchilari
   Personal OS shell: sidebar, mobile tab bar, page helpers
   --------------------------------------------------------------------------
   App (js/app.js) shu modul bor-yo'qligini tekshiradi va bo'lsa menyuni
   SHU chizadi. Eski renderNav() kodi o'chirilmadi — OS o'chirilsa qaytadi.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};

  function L(o) {
    if (!o) return '';
    var lang = (window.Store && Store.get && Store.get('lang')) || 'uz';
    return o[lang] || o.uz || o.en || '';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function icon(name) {
    return (window.IC && IC[name]) || (window.IC && IC.grid) || '';
  }

  /* ---- Manzil nishonlari: FAQAT haqiqiy yozuvdan ----------------------
     Soxta raqam yo'q. Ma'lumot bo'lmasa nishon ham ko'rinmaydi.        */
  function badges() {
    var b = {};
    try {
      var due = window.Review && Review.dueCount ? Review.dueCount() : 0;
      var open = window.Store && Store.openMistakes ? Store.openMistakes().length : 0;
      if (due) b.lab = { n: due, hot: true };
      else if (open) b.lab = { n: open, hot: false };
    } catch (e) {}
    return b;
  }

  /* ====================== YON PANEL =================================== */
  function renderNav(route) {
    var host = document.getElementById('navGroups');
    if (!host || !OS.NAV) return false;

    var active = OS.NAV.activeKey(route || '');
    var bg = badges();
    var html = '<nav class="os-nav" aria-label="Personal OS">';

    html += '<div class="os-nav-sec">' + esc(L({ uz: 'Tizim', en: 'System' })) + '</div>';

    OS.NAV.DEST.forEach(function (d, i) {
      /* Ikkinchi bo'lim sarlavhasi: o'rganish manzillaridan oldin */
      if (d.key === 'studio') html += '<div class="os-nav-sec">' + esc(L({ uz: 'Oʻrganish', en: 'Learning' })) + '</div>';
      if (d.key === 'insights') html += '<div class="os-nav-sec">' + esc(L({ uz: 'Natija', en: 'Outcome' })) + '</div>';

      var badge = bg[d.key];
      html += '<button class="os-nav-item' + (active === d.key ? ' on' : '') + '"' +
        ' data-go="' + d.route + '" title="' + esc(L(d.t)) + '"' +
        (active === d.key ? ' aria-current="page"' : '') + '>' +
        icon(d.icon) +
        '<span>' + esc(L(d.t)) + '</span>' +
        (badge ? '<span class="os-nav-badge' + (badge.hot ? ' hot' : '') + '">' + badge.n + '</span>' : '') +
        '</button>';
    });

    html += '</nav>';
    host.innerHTML = html;
    renderTabbar(active);
    return true;
  }

  /* ====================== MOBIL PASTKI PANEL ========================== */
  /* Beshta eng ko'p ishlatiladigan manzil (brief: compact bottom navigation) */
  var TAB_KEYS = ['center', 'planner', 'studio', 'lab', 'insights'];

  function renderTabbar(active) {
    var el = document.getElementById('osTabbar');
    if (!el) {
      el = document.createElement('nav');
      el.id = 'osTabbar';
      el.className = 'os-tabbar';
      el.setAttribute('aria-label', 'Personal OS');
      document.body.appendChild(el);
    }
    el.innerHTML = TAB_KEYS.map(function (k) {
      var d = OS.NAV.DEST.filter(function (x) { return x.key === k; })[0];
      if (!d) return '';
      var short = { center: { uz: 'Markaz', en: 'Center' }, planner: { uz: 'Reja', en: 'Plan' },
        studio: { uz: 'Studiya', en: 'Studio' }, lab: { uz: 'Takror', en: 'Review' },
        insights: { uz: 'Natija', en: 'Insights' } }[k];
      return '<button class="os-tab' + (active === k ? ' on' : '') + '" data-go="' + d.route + '"' +
        (active === k ? ' aria-current="page"' : '') + '>' +
        icon(d.icon) + '<span>' + esc(L(short)) + '</span></button>';
    }).join('');
  }

  /* ====================== SAHIFA YORDAMCHILARI ======================== */

  /* Sahifa sarlavhasi */
  function head(title, sub, actions) {
    return '<header class="os-head"><div><h1>' + esc(title) + '</h1>' +
      (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' +
      (actions ? '<div class="os-head-actions">' + actions + '</div>' : '') + '</header>';
  }

  /* Bo'lim tablari: tabs = [[key, label]], base = 'planner' */
  function tabs(base, list, activeTab) {
    if (!list || !list.length) return '';
    return '<div class="os-tabs" role="tablist">' + list.map(function (t) {
      var on = t[0] === activeTab;
      return '<button role="tab" class="' + (on ? 'on' : '') + '" data-go="' + base + '/' + t[0] + '"' +
        (on ? ' aria-selected="true"' : ' aria-selected="false"') + '>' + esc(L(t[1])) + '</button>';
    }).join('') + '</div>';
  }

  /* Ko'rsatkich plitasi — qiymat BO'LMASA ham halol ko'rsatiladi ("—") */
  function stat(k, v, s, cls) {
    return '<div class="os-card pad-sm"><div class="os-stat' + (cls ? ' ' + cls : '') + '">' +
      '<div class="k">' + esc(k) + '</div>' +
      '<div class="v">' + (v == null || v === '' ? '&mdash;' : v) + '</div>' +
      (s ? '<div class="s">' + esc(s) + '</div>' : '') + '</div></div>';
  }

  function meter(pct, cls) {
    var p = Math.max(0, Math.min(100, Math.round(pct || 0)));
    return '<div class="os-meter' + (cls ? ' ' + cls : '') + '" role="progressbar" aria-valuenow="' + p +
      '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + p + '%"></i></div>';
  }

  function empty(title, text) {
    return '<div class="os-empty">' + icon('bulb') +
      '<b>' + esc(title) + '</b>' + (text ? '<p>' + esc(text) + '</p>' : '') + '</div>';
  }

  function note(kind, text) {
    var ic = kind === 'warn' ? 'alert' : kind === 'ok' ? 'check' : kind === 'err' ? 'alert' : 'bulb';
    return '<div class="os-note ' + kind + '">' + icon(ic) + '<div>' + text + '</div></div>';
  }

  function chip(text, cls) {
    return '<span class="os-chip' + (cls ? ' ' + cls : '') + '">' + esc(text) + '</span>';
  }

  /* Chuqur sahifa tepasidagi "qaytish" havolasi */
  function crumb(route) {
    if (!OS.NAV) return '';
    var c = OS.NAV.crumbFor(route);
    if (!c) return '';
    return '<button class="link-btn jr-crumb" data-go="' + c.route + '">← ' + esc(L(c.t)) + '</button>';
  }

  OS.shell = {
    renderNav: renderNav, renderTabbar: renderTabbar,
    head: head, tabs: tabs, stat: stat, meter: meter,
    empty: empty, note: note, chip: chip, crumb: crumb,
    L: L, esc: esc, icon: icon, badges: badges
  };
})();
