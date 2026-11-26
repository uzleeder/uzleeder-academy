/* ==========================================================================
   Command Center — Personal OS bosh sahifasi
   --------------------------------------------------------------------------
   Brief 4A. Faqat HAQIQIY yozuvga tayanadigan ma'lumot ko'rsatiladi.
   Ma'lumot bo'lmasa karta ham chiqmaydi — joy to'ldirish uchun karta yo'q.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  /* Salomlashish — mahalliy soatga qarab, soxta quvonchsiz */
  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return { uz: 'Tunggi iş', en: 'Late night' };
    if (h < 12) return { uz: 'Xayrli tong', en: 'Good morning' };
    if (h < 17) return { uz: 'Xayrli kun', en: 'Good afternoon' };
    if (h < 22) return { uz: 'Xayrli keç', en: 'Good evening' };
    return { uz: 'Keç böldi', en: 'Late evening' };
  }

  var MON = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  var DOW = {
    uz: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  function longDate(key) {
    var lang = (window.Store && Store.get('lang')) || 'uz';
    var p = String(key).split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    var dow = DOW[lang] ? DOW[lang][d.getDay()] : DOW.uz[d.getDay()];
    var mon = MON[lang] ? MON[lang][d.getMonth()] : MON.uz[d.getMonth()];
    return lang === 'en'
      ? dow + ', ' + d.getDate() + ' ' + mon + ' ' + p[0]
      : p[0] + '-yil ' + d.getDate() + '-' + mon + ', ' + dow;
  }

  function clockStr() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  /* ---------- kartalar ------------------------------------------------- */

  /* 1. Bugun: sana, soat, bosqich, missiya kuni */
  function cardToday(m) {
    var c = OS.CFG;
    var phase = m.phase
      ? esc(L(m.phase.title))
      : esc(L({ uz: 'Missiya muddatidan taşqarida', en: 'Outside the mission window' }));
    var line = m.inMission
      ? esc(L({ uz: 'Missiya kuni', en: 'Mission day' })) + ' ' + m.dayNumber + ' / ' + m.totalDays
      : esc(L({ uz: 'Missiya ' + c.mission.start + ' da boshlanadi', en: 'The mission starts on ' + c.mission.start }));

    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(longDate(m.date)) + ' · <span id="osClock">' + clockStr() + '</span></div>' +
      '<h2 style="font-size:20px;margin-bottom:6px">' + phase + '</h2>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13.5px">' +
        (m.phase ? esc(L(m.phase.focus)) : '') + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
        sh().chip(line, m.inMission ? 'now' : 'off') +
        sh().chip(esc(L({ uz: 'Imtihonga', en: 'To the exam' })) + ' ' + m.daysToExam + ' ' +
          esc(L({ uz: 'kun', en: 'days' })), m.daysToExam <= 30 ? 'warn' : '') +
        sh().chip(esc(L({ uz: 'Maqsad', en: 'Target' })) + ' ' + m.target + ' overall') +
      '</div>' +
      (m.inMission ? '<div style="margin-top:14px">' + sh().meter(m.dayNumber / m.totalDays * 100) +
        '<div class="s" style="margin-top:6px;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'Bu vaqt ölçovi — natija emas', en: 'This measures time, not results' })) +
        '</div></div>' : '') +
      '</section>';
  }

  /* 2. Hozir / keyingi blok */
  function cardNow(nn) {
    if (!nn.blocks.length) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">' + esc(L({ uz: 'Keyingi iş', en: 'Next activity' })) + '</div>' +
        sh().empty(L({ uz: 'Bugunga jadval yöq', en: 'No schedule for today' }),
          L({ uz: 'Missiya rejasida kunlik jadvalni sozlang.', en: 'Set up the daily schedule in Mission Planner.' })) +
        '</section>';
    }
    var b = nn.now || nn.next;
    var isNow = !!nn.now;
    if (!b) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">' + esc(L({ uz: 'Keyingi iş', en: 'Next activity' })) + '</div>' +
        '<p style="margin:0;color:var(--muted);font-size:13.5px">' +
        esc(L({ uz: 'Bugungi bloklar tugadi.', en: 'Todayʼs blocks are finished.' })) + '</p></section>';
    }
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' +
        esc(L(isNow ? { uz: 'Hozir', en: 'Now' } : { uz: 'Keyingi iş', en: 'Next activity' })) + '</div>' +
      '<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">' +
        '<b style="font-family:var(--font-mono);font-size:17px;color:var(--brand)">' + esc(b.fromStr) + '</b>' +
        '<b style="font-size:16px">' + esc(L(b.t)) + '</b>' +
      '</div>' +
      '<p style="margin:6px 0 14px;color:var(--muted);font-size:13px">' +
        esc(b.fromStr + '–' + b.toStr) + ' · ' + b.min + ' ' + esc(L({ uz: 'daqiqa', en: 'min' })) +
        (b.note ? ' · ' + esc(L(b.note)) : '') + '</p>' +
      '<button class="os-btn primary" data-go="planner/today">' +
        esc(L({ uz: 'Kunlik jadvalni oçiş', en: 'Open the daily schedule' })) + '</button>' +
      '</section>';
  }

  /* 3. Uchta ustuvorlik */
  function cardPriorities(pr) {
    if (!pr.length) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">' + esc(L({ uz: 'Ustuvorliklar', en: 'Priorities' })) + '</div>' +
        '<p style="margin:0;color:var(--muted);font-size:13.5px">' +
        esc(L({ uz: 'Oçiq iş yöq. Bu ham javob.', en: 'Nothing outstanding. That is an answer too.' })) +
        '</p></section>';
    }
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Ustuvorliklar', en: 'Priorities' })) + '</div>' +
      pr.map(function (p, i) {
        return '<button class="os-row" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line-soft);text-align:left;cursor:pointer;font:inherit;color:inherit" data-go="' + p.route + '">' +
          '<b style="font-family:var(--font-mono);font-size:12px;color:var(--faint);width:16px;flex-shrink:0">' + (i + 1) + '</b>' +
          '<span class="os-row-main"><b>' + esc(L(p.t)) + '</b>' +
          (p.meta ? '<span>' + esc(p.meta) + '</span>' : '') + '</span>' +
          '</button>';
      }).join('') +
      '</section>';
  }

  /* 4. O'lchovlar — faqat yozuv bor bo'lsa */
  function cardMetrics(ie, co, rv, min) {
    var tiles = [];

    if (ie && ie.daysTotal) {
      tiles.push(sh().stat(
        L({ uz: 'IELTS kunlari', en: 'IELTS days' }),
        ie.daysDone + '<small>/ ' + ie.daysTotal + '</small>',
        ie.daysDone ? null : L({ uz: 'hali yozuv yöq', en: 'no records yet' })
      ));
    }
    if (ie && ie.lastMock) {
      var mk = ie.lastMock;
      var band = [mk.l, mk.r, mk.w, mk.s].filter(function (x) { return typeof x === 'number'; });
      var overall = band.length === 4
        ? (Math.round(band.reduce(function (a, b) { return a + b; }, 0) / 4 * 2) / 2).toFixed(1)
        : null;
      tiles.push(sh().stat(
        L({ uz: 'Oxirgi mock', en: 'Last mock' }),
        overall != null ? overall : '—',
        'L ' + (mk.l != null ? mk.l : '–') + ' · R ' + (mk.r != null ? mk.r : '–') +
        ' · W ' + (mk.w != null ? mk.w : '–') + ' · S ' + (mk.s != null ? mk.s : '–'),
        'gold'
      ));
    }
    if (co && co.pythonTotal) {
      tiles.push(sh().stat(
        L({ uz: 'Python', en: 'Python' }),
        co.pythonDone + '<small>/ ' + co.pythonTotal + '</small>',
        co.quizAccuracy != null ? L({ uz: 'test aniqligi', en: 'quiz accuracy' }) + ' ' + co.quizAccuracy + '%' : null
      ));
    }
    if (rv.due || rv.total) {
      tiles.push(sh().stat(
        L({ uz: 'Takror navbati', en: 'Reviews due' }),
        rv.due,
        rv.upcoming ? '+' + rv.upcoming + ' ' + L({ uz: '7 kunda', en: 'in 7 days' }) : null,
        rv.due ? 'accent' : ''
      ));
    }
    if (rv.allMistakes) {
      tiles.push(sh().stat(
        L({ uz: 'Oçiq xatolar', en: 'Open mistakes' }),
        rv.openMistakes,
        L({ uz: 'jami', en: 'of' }) + ' ' + rv.allMistakes
      ));
    }
    if (min.total) {
      tiles.push(sh().stat(
        L({ uz: 'Bugun ölçangan', en: 'Measured today' }),
        Math.round(min.total / 60 * 10) / 10 + '<small>' + L({ uz: ' soat', en: ' h' }) + '</small>',
        min.measured ? L({ uz: 'ölçangan', en: 'timed' }) + ' ' + min.measured + ' ' +
          L({ uz: 'daq', en: 'min' }) : L({ uz: 'qölda yozilgan', en: 'entered by hand' })
      ));
    }

    if (!tiles.length) return '';
    return '<div class="os-grid c4">' + tiles.join('') + '</div>';
  }

  /* 5. Muddatlar */
  function cardDeadlines(dl) {
    if (!dl.length) return '';
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Yaqin muddatlar', en: 'Upcoming deadlines' })) + '</div>' +
      dl.map(function (d) {
        return '<div class="os-row"><span class="os-row-main"><b>' + esc(L(d.t)) + '</b>' +
          '<span>' + esc(d.date) + '</span></span>' +
          '<time>' + d.days + ' ' + esc(L({ uz: 'kun', en: 'd' })) + '</time></div>';
      }).join('') + '</section>';
  }

  /* 6. Haftalik ko'rinish — kichik, bezaksiz */
  function cardWeek(wk) {
    var any = wk.some(function (d) { return d.total || d.minutes; });
    if (!any) return '';
    var lang = (window.Store && Store.get('lang')) || 'uz';
    var short = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    return '<section class="os-card">' +
      '<div class="os-card-head"><div class="os-eyebrow" style="margin:0">' +
        esc(L({ uz: 'Şu hafta', en: 'This week' })) + '</div>' +
        '<button class="os-btn ghost" data-go="planner/week" style="padding:4px 10px;font-size:12px">' +
        esc(L({ uz: 'Hafta', en: 'Week' })) + '</button></div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">' +
      wk.map(function (d, i) {
        var h = d.total ? Math.round(d.done / d.total * 100) : 0;
        return '<div style="display:grid;gap:5px;justify-items:center">' +
          '<span style="font-family:var(--font-mono);font-size:10px;color:var(--faint)">' + short[i] + '</span>' +
          '<div style="width:100%;height:46px;border-radius:var(--r-sm);background:var(--surface-3);position:relative;overflow:hidden' +
            (d.isToday ? ';outline:1px solid var(--brand)' : '') + '">' +
            (h ? '<i style="position:absolute;left:0;right:0;bottom:0;height:' + h + '%;background:var(--brand);display:block"></i>' : '') +
          '</div>' +
          '<span style="font-family:var(--font-mono);font-size:10px;color:var(--faint)">' +
            (d.minutes ? Math.round(d.minutes / 60 * 10) / 10 + 'h' : '–') + '</span>' +
          '</div>';
      }).join('') + '</div></section>';
  }

  /* 7. Tez yozib qo'yish */
  function cardCapture() {
    var recent = OS.data.captureList(3);
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Tez yozib qöy', en: 'Quick capture' })) + '</div>' +
      '<div class="os-capture">' +
        '<input id="osCapture" type="text" autocomplete="off" placeholder="' +
          esc(L({ uz: 'Esda qolsin…', en: 'Note it down…' })) + '" aria-label="' +
          esc(L({ uz: 'Tez yozib qöy', en: 'Quick capture' })) + '">' +
        '<button class="os-btn primary" id="osCaptureBtn">' + esc(L({ uz: 'Saqlaş', en: 'Save' })) + '</button>' +
      '</div>' +
      (recent.length ? '<div style="margin-top:12px">' + recent.map(function (r) {
        return '<div class="os-row"><span class="os-row-main"><b>' + esc(r.title || '') + '</b></span></div>';
      }).join('') + '</div>' : '') +
      '</section>';
  }

  /* ---------- sahifa --------------------------------------------------- */

  function render() {
    var d = OS.data;
    var m = d.missionNow();
    var nn = d.nowNext();
    var pr = d.priorities();
    var ie = d.ielts();
    var co = d.coding();
    var rv = d.review();
    var min = d.minutesOn(d.todayKey());
    var dl = d.deadlines();
    var wk = d.weekOverview();
    var p = d.profile();

    var hi = L(greeting()) + (p.name ? ', ' + p.name : '');

    return '<div class="page os-page">' +
      sh().head(hi, L({ uz: 'Bugun nimaga eʼtibor qaratiş kerak', en: 'What deserves attention today' }),
        '<button class="os-btn ghost" data-go="planner/today">' + esc(L({ uz: 'Bugun', en: 'Today' })) + '</button>' +
        '<button class="os-btn ghost" data-go="insights">' + esc(L({ uz: 'Körsatkiçlar', en: 'Insights' })) + '</button>') +
      cardMetrics(ie, co, rv, min) +
      '<div class="os-grid c2" style="margin-top:var(--sp-4)">' +
        cardToday(m) + cardNow(nn) +
      '</div>' +
      '<div class="os-grid c2" style="margin-top:var(--sp-4)">' +
        cardPriorities(pr) + cardDeadlines(dl) +
      '</div>' +
      '<div class="os-grid c2" style="margin-top:var(--sp-4)">' +
        cardWeek(wk) + cardCapture() +
      '</div>' +
      '</div>';
  }

  function mount() {
    var input = document.getElementById('osCapture');
    var btn = document.getElementById('osCaptureBtn');
    function save() {
      if (!input) return;
      if (OS.data.capture(input.value)) {
        input.value = '';
        if (window.toast) toast(L({ uz: 'Saqlandi', en: 'Saved' }), 'ok');
        if (window.App) App.render();
      }
    }
    if (btn) btn.addEventListener('click', save);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') save(); });

    /* Soat — har 30 soniyada. Sahifa almashsa interval o'chadi. */
    var el = document.getElementById('osClock');
    if (el) {
      clearInterval(OS.pages.center._iv);
      OS.pages.center._iv = setInterval(function () {
        var now = document.getElementById('osClock');
        if (!now) { clearInterval(OS.pages.center._iv); return; }
        now.textContent = clockStr();
      }, 30000);
    }
  }

  OS.pages.center = { render: render, mount: mount };
})();
