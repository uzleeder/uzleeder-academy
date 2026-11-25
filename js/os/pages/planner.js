/* ==========================================================================
   Mission Planner — rejalashtirishning YAGONA manzili
   --------------------------------------------------------------------------
   Brief 4B. Bo'limlar: Bugun · Kalendar · Kunlik jadval · Hafta ·
   Bosqichlar · Maqsadlar · Odatlar · Tarix.

   Ikki qatlam birga ko'rinadi:
     1) GENERATSIYA QILINGAN jadval — HabitPlan (namozga bog'langan bloklar,
        4 shablon, validator bilan tekshirilgan). O'quvchi uni tahrirlamaydi,
        natijasini belgilaydi (done/partial/skipped).
     2) SHAXSIY VAZIFALAR — OS.tasks: qo'shiladi, ko'chiriladi, o'chiriladi.

   Raqobatchi ikkinchi kalendar YO'Q: Bugun/Hafta/Odat — shu bitta sahifaning
   ko'rinishlari.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }
  function T() { return OS.tasks; }

  var TABS = null;
  function tabsOf() {
    if (!TABS) TABS = OS.NAV.DEST.filter(function (d) { return d.key === 'planner'; })[0].tabs;
    return TABS;
  }

  /* Ko'rilayotgan sana — sahifa holati (saqlanmaydi, bu ko'rinish) */
  var viewDate = null;
  function vd() { return viewDate || OS.cal.today(); }

  /* ---------- umumiy bo'laklar ----------------------------------------- */

  function statusChip(st) {
    var map = {
      done:    ['on',   { uz: 'bajarildi', en: 'done' }],
      partial: ['warn', { uz: 'qisman', en: 'partial' }],
      skipped: ['off',  { uz: 'oʻtkazildi', en: 'skipped' }],
      active:  ['now',  { uz: 'jarayonda', en: 'in progress' }],
      pending: ['',     { uz: 'kutilmoqda', en: 'pending' }]
    };
    var m = map[st] || map.pending;
    return sh().chip(L(m[1]), m[0]);
  }

  /* Vazifa qatori — holat tugmalari bilan */
  function taskRow(t) {
    var cat = T().CATS[t.cat] || T().CATS.other;
    return '<div class="os-row" data-task="' + esc(t.id) + '">' +
      '<span class="os-row-main">' +
        '<b>' + esc(t.title) + (t.status === 'done' ? ' ✓' : '') + '</b>' +
        '<span>' + (t.time ? esc(t.time) + ' · ' : '') +
          (t.min ? t.min + ' ' + esc(L({ uz: 'daq', en: 'min' })) + ' · ' : '') +
          esc(L(cat.t)) +
          (t.moved ? ' · ' + esc(L({ uz: 'koʻchirilgan', en: 'moved' })) : '') +
        '</span>' +
      '</span>' +
      statusChip(t.status) +
      '<span style="display:flex;gap:4px">' +
        '<button class="os-btn ghost" style="padding:4px 8px;font-size:11px" data-task-st="done" data-id="' + esc(t.id) + '" title="' + esc(L({ uz: 'Bajarildi', en: 'Done' })) + '">✓</button>' +
        '<button class="os-btn ghost" style="padding:4px 8px;font-size:11px" data-task-st="partial" data-id="' + esc(t.id) + '" title="' + esc(L({ uz: 'Qisman', en: 'Partial' })) + '">½</button>' +
        '<button class="os-btn ghost" style="padding:4px 8px;font-size:11px" data-task-st="skipped" data-id="' + esc(t.id) + '" title="' + esc(L({ uz: 'Oʻtkazildi', en: 'Skipped' })) + '">–</button>' +
        '<button class="os-btn ghost" style="padding:4px 8px;font-size:11px" data-task-move="' + esc(t.id) + '" title="' + esc(L({ uz: 'Ertaga koʻchirish', en: 'Move to tomorrow' })) + '">→</button>' +
        '<button class="os-btn ghost" style="padding:4px 8px;font-size:11px" data-task-del="' + esc(t.id) + '" title="' + esc(L({ uz: 'Oʻchirish', en: 'Delete' })) + '">×</button>' +
      '</span>' +
      '</div>';
  }

  function addForm(dateKey) {
    var cats = Object.keys(T().CATS).map(function (k) {
      return '<option value="' + k + '">' + esc(L(T().CATS[k].t)) + '</option>';
    }).join('');
    return '<form class="os-card pad-sm" id="osTaskForm" style="display:grid;gap:8px">' +
      '<div class="os-eyebrow" style="margin:0">' + esc(L({ uz: 'Vazifa qoʻshish', en: 'Add a task' })) + '</div>' +
      '<input name="title" type="text" required placeholder="' + esc(L({ uz: 'Nima qilinadi', en: 'What will be done' })) + '" ' +
        'style="padding:9px 12px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13.5px">' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px">' +
        '<input name="date" type="date" value="' + esc(dateKey) + '" style="padding:8px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13px">' +
        '<input name="time" type="time" style="padding:8px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13px">' +
        '<input name="min" type="number" min="0" max="600" step="5" placeholder="' + esc(L({ uz: 'daqiqa', en: 'minutes' })) + '" style="padding:8px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13px">' +
        '<select name="cat" style="padding:8px 10px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13px">' + cats + '</select>' +
      '</div>' +
      '<button class="os-btn primary" type="submit" style="justify-self:start">' + esc(L({ uz: 'Qoʻshish', en: 'Add' })) + '</button>' +
      '</form>';
  }

  /* ---------- 1. BUGUN -------------------------------------------------- */

  function viewToday(key) {
    var d = OS.data;
    var blocks = d.dayBlocks(key);
    var prog = d.dayProgress(key);
    var tasks = T().onDay(key);
    var nn = d.nowNext(key);
    var now = nn.now;
    var m = d.missionNow(key);

    var html = '';

    /* Kun sarlavhasi: sana ko'chirish tugmalari bilan */
    html += '<div class="os-card pad-sm" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:var(--sp-4)">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<button class="os-btn ghost" data-day="-1" aria-label="' + esc(L({ uz: 'Oldingi kun', en: 'Previous day' })) + '">←</button>' +
        '<b style="font-family:var(--font-mono);font-size:14px">' + esc(key) + '</b>' +
        '<button class="os-btn ghost" data-day="1" aria-label="' + esc(L({ uz: 'Keyingi kun', en: 'Next day' })) + '">→</button>' +
        (key !== OS.cal.today() ? '<button class="os-btn ghost" data-day="0">' + esc(L({ uz: 'Bugun', en: 'Today' })) + '</button>' : '') +
      '</div>' +
      '<div style="display:flex;gap:8px;align-items:center">' +
        (m.phase ? sh().chip(L(m.phase.title), 'now') : '') +
        (prog.total ? sh().chip(prog.done + '/' + prog.total + ' ' + L({ uz: 'yadro blok', en: 'core blocks' })) : '') +
      '</div>' +
      '</div>';

    html += '<div class="os-grid c2">';

    /* Kunlik jadval (generatsiya) */
    html += '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Kunlik jadval', en: 'Daily schedule' })) + '</h2>' +
      '<button class="os-btn ghost" data-go="planner/schedule" style="padding:4px 10px;font-size:12px">' +
        esc(L({ uz: 'Tahrirlash', en: 'Edit' })) + '</button></div>';
    if (!blocks.length) {
      html += sh().empty(L({ uz: 'Bu kunga jadval yoʻq', en: 'No schedule for this day' }),
        L({ uz: 'Jadval missiya oynasi ichidagi kunlarga tuziladi.', en: 'Schedules are generated for days inside the mission window.' }));
    } else {
      html += '<div class="os-timeline">' + blocks.map(function (b) {
        var cls = b.status === 'done' ? 'done' : b.status === 'partial' ? 'partial'
          : b.status === 'skipped' ? 'skipped' : (now && now.id === b.id ? 'now' : '');
        return '<div class="os-block ' + cls + '">' +
          '<time>' + esc(b.fromStr) + '</time>' +
          '<span class="bar"></span>' +
          '<span class="bd"><b>' + esc(L(b.t)) + '</b>' +
            '<span>' + b.min + ' ' + esc(L({ uz: 'daqiqa', en: 'min' })) +
            (b.core ? ' · ' + esc(L({ uz: 'yadro', en: 'core' })) : '') + '</span></span>' +
          '<span style="display:flex;gap:3px">' +
            '<button class="os-btn ghost" style="padding:3px 7px;font-size:11px" data-blk="done" data-key="' + esc(key) + '" data-id="' + esc(b.id) + '">✓</button>' +
            '<button class="os-btn ghost" style="padding:3px 7px;font-size:11px" data-blk="partial" data-key="' + esc(key) + '" data-id="' + esc(b.id) + '">½</button>' +
            '<button class="os-btn ghost" style="padding:3px 7px;font-size:11px" data-blk="skipped" data-key="' + esc(key) + '" data-id="' + esc(b.id) + '">–</button>' +
          '</span>' +
          '</div>';
      }).join('') + '</div>';
      html += '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'Oʻtkazib yuborilgan blok qarz boʻlib yigʻilmaydi — bu oʻlchov, jazo emas.',
                en: 'A skipped block does not accumulate as debt — this is measurement, not punishment.' })) + '</p>';
    }
    html += '</section>';

    /* Shaxsiy vazifalar */
    html += '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Vazifalar', en: 'Tasks' })) + '</h2>' +
      (tasks.length ? sh().chip(tasks.filter(function (t) { return t.status === 'done'; }).length + '/' + tasks.length) : '') +
      '</div>';
    html += tasks.length
      ? tasks.map(taskRow).join('')
      : sh().empty(L({ uz: 'Vazifa yoʻq', en: 'No tasks' }),
          L({ uz: 'Pastdagi shakl bilan qoʻshing.', en: 'Add one with the form below.' }));
    html += '<div style="margin-top:var(--sp-4)">' + addForm(key) + '</div>';
    html += '</section>';

    html += '</div>';
    html += '<div style="margin-top:var(--sp-4)"><button class="os-btn ghost" data-go="classic/today">' + esc(L({ uz: 'Eski “Bugun” sahifasi', en: 'Classic Today page' })) + '</button></div>';
    return html;
  }

  /* ---------- 2. KALENDAR ---------------------------------------------- */

  function viewCalendar(key) {
    var k = OS.cal, c = OS.CFG;
    var p = key.split('-');
    var year = +p[0], month = +p[1];
    var first = year + '-' + String(month).padStart(2, '0') + '-01';
    var firstDow = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;   // dushanba = 0
    var daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    var lang = (window.Store && Store.get('lang')) || 'uz';
    var dows = lang === 'en' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

    var cells = '';
    for (var i = 0; i < firstDow; i++) cells += '<div class="os-day off" aria-hidden="true"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dk = year + '-' + String(month).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var ph = k.phaseOf(dk);
      var cnt = T().countsOn(dk);
      var cls = ['os-day'];
      if (ph) cls.push('p-' + ph.key);
      if (dk === OS.cal.today()) cls.push('today');
      if (dk === c.mission.exam) cls.push('exam');
      cells += '<button class="' + cls.join(' ') + '" data-cal-day="' + dk + '" title="' + esc(dk) + '">' +
        d + (cnt.total ? '<i></i>' : '') + '</button>';
    }

    var prevM = month === 1 ? (year - 1) + '-12-01' : year + '-' + String(month - 1).padStart(2, '0') + '-01';
    var nextM = month === 12 ? (year + 1) + '-01-01' : year + '-' + String(month + 1).padStart(2, '0') + '-01';

    return '<section class="os-card">' +
      '<div class="os-card-head">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<button class="os-btn ghost" data-cal-to="' + prevM + '">←</button>' +
          '<h2 style="margin:0">' + esc(first.slice(0, 7)) + '</h2>' +
          '<button class="os-btn ghost" data-cal-to="' + nextM + '">→</button>' +
        '</div>' +
        '<button class="os-btn ghost" data-cal-to="' + OS.cal.today() + '">' + esc(L({ uz: 'Bugun', en: 'Today' })) + '</button>' +
      '</div>' +
      '<div class="os-cal">' + dows.map(function (x) { return '<div class="dow">' + x + '</div>'; }).join('') + cells + '</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:var(--sp-4);font-size:12px;color:var(--muted)">' +
        c.mission.phases.map(function (ph) {
          return '<span style="display:inline-flex;align-items:center;gap:6px">' +
            '<i style="width:10px;height:10px;border-radius:3px;display:inline-block;background:color-mix(in srgb,var(--' +
            (ph.key === 'prelaunch' ? 'gold' : ph.key === 'main' ? 'brand' : 'green') + ') 45%, transparent)"></i>' +
            esc(L(ph.title)) + ' · ' + esc(ph.from) + ' → ' + esc(ph.to) + '</span>';
        }).join('') +
        '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--gold)">◆ ' +
          esc(L({ uz: 'Imtihon', en: 'Exam' })) + ' ' + esc(c.mission.exam) + '</span>' +
      '</div>' +
      '</section>';
  }

  /* ---------- 3. KUNLIK JADVAL (shablonlar) ---------------------------- */

  function viewSchedule(key) {
    var blocks = OS.data.dayBlocks(key);
    var type = window.HabitPlan && HabitPlan.typeOf ? HabitPlan.typeOf(key) : '';
    var sleep = null;
    try { sleep = HabitPlan.forDate(key).sleep; } catch (e) {}

    var html = '<div class="os-grid c2">';

    html += '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Kun shabloni', en: 'Day template' })) + '</h2>' +
      sh().chip(type || '—', 'now') + '</div>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
      esc(L({ uz: 'Shablon hafta kunidan kelib chiqadi: yakshanba tiklanish, dushanba va chorshanba gibrid, seshanba/payshanba/shanba LC, juma oddiy.',
              en: 'The template follows the weekday: Sunday recovery, Monday and Wednesday hybrid, Tuesday/Thursday/Saturday LC, Friday standard.' })) +
      '</p>' +
      (sleep ? '<div class="os-note ok">' + sh().icon('check') + '<div>' +
        esc(L({ uz: 'Uyqu himoyalangan', en: 'Sleep is protected' })) + ': <b>' +
        Math.round(sleep.total / 60 * 10) / 10 + ' ' + esc(L({ uz: 'soat', en: 'hours' })) + '</b> · ' +
        esc(L({ uz: 'asosiy', en: 'main' })) + ' ' + Math.round(sleep.main) + ' ' + esc(L({ uz: 'daq', en: 'min' })) +
        (sleep.re ? ' + ' + Math.round(sleep.re) + ' ' + esc(L({ uz: 'qayta uyqu', en: 'back to sleep' })) : '') +
        '</div></div>' : '') +
      '</section>';

    html += '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Bloklar', en: 'Blocks' })) + '</h2>' +
      (blocks.length ? '<div class="os-timeline">' + blocks.map(function (b) {
        return '<div class="os-block ' + (b.status === 'done' ? 'done' : b.status === 'partial' ? 'partial' : b.status === 'skipped' ? 'skipped' : '') + '">' +
          '<time>' + esc(b.fromStr) + '</time><span class="bar"></span>' +
          '<span class="bd"><b>' + esc(L(b.t)) + '</b><span>' + esc(b.fromStr + '–' + b.toStr) + ' · ' + b.min + ' ' + esc(L({ uz: 'daq', en: 'min' })) + '</span></span>' +
          '<span>' + statusChip(b.status) + '</span></div>';
      }).join('') + '</div>'
        : sh().empty(L({ uz: 'Blok yoʻq', en: 'No blocks' }), '')) +
      '</section>';

    html += '</div>';

    html += '<div class="os-note info" style="margin-top:var(--sp-4)">' + sh().icon('bulb') + '<div>' +
      esc(L({ uz: 'Jadval 16 ta qoida boʻyicha tekshiriladi (tools/validate-schedule.cjs): kun 1440 daqiqa, uyqu normada, yadro bloklar oʻlchamda, namoz vaqtlariga bogʻlangan.',
              en: 'The schedule is validated against 16 rules (tools/validate-schedule.cjs): a 1440-minute day, sleep within norms, core blocks within limits, prayer anchors respected.' })) +
      '</div></div>';

    html += '<div style="margin-top:var(--sp-4)"><button class="os-btn ghost" data-go="classic/habit">' +
      esc(L({ uz: 'Eski jadval sahifasi', en: 'Classic schedule page' })) + '</button></div>';

    return html;
  }

  /* ---------- 4. HAFTA -------------------------------------------------- */

  function viewWeek(key) {
    var wk = OS.data.weekOverview(key);
    var k = OS.cal;
    return '<section class="os-card">' +
      '<div class="os-card-head"><h2>' + esc(L({ uz: 'Hafta', en: 'Week' })) + '</h2>' +
        '<span style="display:flex;gap:6px">' +
        '<button class="os-btn ghost" data-week="-7">←</button>' +
        '<button class="os-btn ghost" data-week="0">' + esc(L({ uz: 'Shu hafta', en: 'This week' })) + '</button>' +
        '<button class="os-btn ghost" data-week="7">→</button></span>' +
      '</div>' +
      '<div class="os-table-wrap"><table class="os-table">' +
      '<thead><tr><th>' + esc(L({ uz: 'Kun', en: 'Day' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Yadro bloklar', en: 'Core blocks' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Vazifalar', en: 'Tasks' })) + '</th>' +
        '<th>' + esc(L({ uz: 'Oʻlchangan vaqt', en: 'Measured time' })) + '</th></tr></thead><tbody>' +
      wk.map(function (d) {
        var c = T().countsOn(d.date);
        return '<tr' + (d.isToday ? ' style="outline:1px solid var(--brand)"' : '') + '>' +
          '<td data-l="' + esc(L({ uz: 'Kun', en: 'Day' })) + '"><button class="link-btn" data-cal-day="' + d.date + '">' + esc(d.date) + '</button></td>' +
          '<td data-l="' + esc(L({ uz: 'Bloklar', en: 'Blocks' })) + '">' + (d.total ? d.done + ' / ' + d.total : '—') + '</td>' +
          '<td data-l="' + esc(L({ uz: 'Vazifalar', en: 'Tasks' })) + '">' + (c.total ? c.done + ' / ' + c.total : '—') + '</td>' +
          '<td data-l="' + esc(L({ uz: 'Vaqt', en: 'Time' })) + '">' + (d.minutes ? Math.round(d.minutes / 60 * 10) / 10 + ' ' + esc(L({ uz: 'soat', en: 'h' })) : '—') + '</td>' +
          '</tr>';
      }).join('') + '</tbody></table></div>' +
      '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
      esc(L({ uz: 'Oʻlchangan vaqt — rejalashtirilgan daqiqa emas, haqiqatan yozilgan vaqt.',
              en: 'Measured time is time actually recorded, not planned minutes.' })) + '</p>' +
      '<div style="margin-top:var(--sp-4)"><button class="os-btn ghost" data-go="classic/week">' +
      esc(L({ uz: 'Eski hafta sahifasi', en: 'Classic week page' })) + '</button></div>' +
      '</section>';
  }

  /* ---------- 5. BOSQICHLAR -------------------------------------------- */

  function viewPhases(key) {
    var c = OS.CFG, k = OS.cal;
    var today = OS.cal.today();
    return '<div class="os-grid c3">' +
      c.mission.phases.map(function (p) {
        var total = k.diffDays(p.from, p.to) + 1;
        var done = today > p.to ? total : today < p.from ? 0 : k.diffDays(p.from, today) + 1;
        var state = today > p.to ? 'on' : today < p.from ? 'off' : 'now';
        return '<section class="os-card">' +
          '<div class="os-card-head"><h3 style="margin:0">' + esc(L(p.title)) + '</h3>' + statusChipPhase(state) + '</div>' +
          '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' + esc(L(p.focus)) + '</p>' +
          '<div style="font-family:var(--font-mono);font-size:12px;color:var(--faint);margin-bottom:8px">' +
            esc(p.from) + ' → ' + esc(p.to) + ' · ' + total + ' ' + esc(L({ uz: 'kun', en: 'days' })) + '</div>' +
          sh().meter(total ? done / total * 100 : 0, p.key === 'final' ? 'green' : p.key === 'prelaunch' ? 'gold' : '') +
          '</section>';
      }).join('') +
      '<section class="os-card">' +
        '<div class="os-card-head"><h3 style="margin:0">' + esc(L({ uz: 'IELTS Academic', en: 'IELTS Academic' })) + '</h3>' +
        sh().chip(c.mission.exam, 'warn') + '</div>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Imtihon sanasi oʻzgarmaydi. Maqsad: overall ' + c.target.overall + '.',
                  en: 'The exam date does not move. Target: overall ' + c.target.overall + '.' })) + '</p>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Qolgan kun', en: 'Days left' })) + '</div>' +
        '<div class="v">' + k.diffDays(today, c.mission.exam) + '</div></div>' +
      '</section>' +
      '</div>' +
      '<div class="os-note warn" style="margin-top:var(--sp-4)">' + sh().icon('alert') + '<div>' +
        esc(L({ uz: 'Ball kafolatlanmaydi. Bu reja — ishning tartibi, vaʻda emas.',
                en: 'No score is guaranteed. This plan is an order of work, not a promise.' })) +
      '</div></div>' +
      '<div class="os-card" style="margin-top:var(--sp-4)">' +
        '<h2>' + esc(L({ uz: 'Yakuniy 19 kun', en: 'The final 19 days' })) + '</h2>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Yangi material emas — zaif joyni tuzatish va tayyorgarlik.',
                  en: 'No new material — weak-skill repair and preparation.' })) + '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          c.finalFocus.map(function (f) { return sh().chip(L(f.t)); }).join('') +
        '</div>' +
        '<div style="margin-top:var(--sp-4);display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="os-btn ghost" data-go="classic/roadmap">' + esc(L({ uz: 'Eski yoʻl xaritasi', en: 'Classic roadmap' })) + '</button>' +
          '<button class="os-btn ghost" data-go="classic/goal">' + esc(L({ uz: 'Eski maqsad sahifasi', en: 'Classic goal page' })) + '</button>' +
        '</div>' +
      '</div>';
  }

  function statusChipPhase(state) {
    return sh().chip(L(state === 'on' ? { uz: 'tugadi', en: 'finished' }
      : state === 'now' ? { uz: 'hozir', en: 'current' } : { uz: 'keyin', en: 'upcoming' }), state);
  }

  /* ---------- 6. MAQSADLAR --------------------------------------------- */

  function viewGoals() {
    var c = OS.CFG, ie = OS.data.ielts();
    var rows = Object.keys(c.target.skills).map(function (sk) {
      var cur = null;
      if (ie && ie.lastMock) {
        var map = { listening: 'l', reading: 'r', writing: 'w', speaking: 's' };
        cur = ie.lastMock[map[sk]];
      }
      var def = c.skills[sk] || { t: { uz: sk, en: sk } };
      return '<tr>' +
        '<td data-l="' + esc(L({ uz: 'Koʻnikma', en: 'Skill' })) + '"><b>' + esc(L(def.t)) + '</b></td>' +
        '<td data-l="' + esc(L({ uz: 'Maqsad', en: 'Target' })) + '">' +
          '<input type="number" step="0.5" min="4" max="9" value="' + c.target.skills[sk] + '" data-goal="' + sk + '" ' +
          'style="width:72px;padding:5px 8px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--ink);font:inherit;font-size:13px"></td>' +
        '<td data-l="' + esc(L({ uz: 'Oxirgi mock', en: 'Last mock' })) + '">' + (cur != null ? cur : '—') + '</td>' +
        '<td data-l="' + esc(L({ uz: 'Farq', en: 'Gap' })) + '">' +
          (cur != null ? (cur - c.target.skills[sk] >= 0 ? '+' : '') + (Math.round((cur - c.target.skills[sk]) * 10) / 10) : '—') + '</td>' +
        '</tr>';
    }).join('');

    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'IELTS maqsadlari', en: 'IELTS targets' })) + '</h2>' +
        '<div class="os-table-wrap"><table class="os-table"><thead><tr>' +
          '<th>' + esc(L({ uz: 'Koʻnikma', en: 'Skill' })) + '</th>' +
          '<th>' + esc(L({ uz: 'Maqsad', en: 'Target' })) + '</th>' +
          '<th>' + esc(L({ uz: 'Oxirgi mock', en: 'Last mock' })) + '</th>' +
          '<th>' + esc(L({ uz: 'Farq', en: 'Gap' })) + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
          esc(L({ uz: 'Umumiy maqsad ' + c.target.overall + ' — Vault > Missiya dan oʻzgartiriladi.',
                  en: 'Overall target ' + c.target.overall + ' — change it in Vault > Mission.' })) + '</p>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Dalil', en: 'Evidence' })) + '</h2>' +
        (ie && ie.mockCount
          ? '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Yozilgan mock', en: 'Mocks recorded' })) + '</div>' +
            '<div class="v">' + ie.mockCount + '</div>' +
            '<div class="s">' + esc(L({ uz: 'natijalar Insights da', en: 'results in Insights' })) + '</div></div>'
          : sh().empty(L({ uz: 'Hali mock yozilmagan', en: 'No mock recorded yet' }),
              L({ uz: 'Birinchi mock pre-launch bosqichida.', en: 'The first mock is in the pre-launch phase.' }))) +
      '</section>' +
      '</div>';
  }

  /* ---------- 7. ODATLAR (ixtiyoriy) ----------------------------------- */

  function viewRoutines(key) {
    var blocks = OS.data.dayBlocks(key).filter(function (b) { return b.kind === 'pray' || b.kind === 'quran' || !b.core; });
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<div class="os-card-head"><h2>' + esc(L({ uz: 'Kunlik odatlar', en: 'Daily routines' })) + '</h2>' +
        sh().chip(L({ uz: 'ixtiyoriy', en: 'optional' }), 'off') + '</div>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Namoz va duo boʻlimlari asosiy menyudan olib tashlandi — ular shu yerda, ixtiyoriy odat sifatida.',
                  en: 'Prayer and dua were removed from the primary navigation — they live here as optional routines.' })) + '</p>' +
        (blocks.length ? '<div class="os-timeline">' + blocks.map(function (b) {
          return '<div class="os-block ' + (b.status === 'done' ? 'done' : '') + '">' +
            '<time>' + esc(b.fromStr) + '</time><span class="bar"></span>' +
            '<span class="bd"><b>' + esc(L(b.t)) + '</b><span>' + b.min + ' ' + esc(L({ uz: 'daq', en: 'min' })) + '</span></span>' +
            '<span>' + statusChip(b.status) + '</span></div>';
        }).join('') + '</div>' : sh().empty(L({ uz: 'Odat bloki yoʻq', en: 'No routine blocks' }), '')) +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Duolar', en: 'Duas' })) + '</h2>' +
        '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Toʻplamlar saqlanib qoldi.', en: 'The collections are preserved.' })) + '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          ['morning', 'study', 'evening', 'sleep'].map(function (s) {
            return '<button class="os-btn ghost" data-go="dua/' + s + '">' + esc(s) + '</button>';
          }).join('') + '</div>' +
      '</section>' +
      '</div>';
  }

  /* ---------- 8. TARIX -------------------------------------------------- */

  function viewHistory() {
    var st = window.Store;
    var ev = st && st.events ? st.events(60).slice().reverse() : [];
    var moved = T().list({}).filter(function (t) { return t.moved; });
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Vazifa tarixi', en: 'Task history' })) + '</h2>' +
        (ev.length ? ev.slice(0, 25).map(function (e) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(e.title || e.ref) + '</b>' +
            '<span>' + esc(e.type) + '</span></span>' +
            '<time>' + new Date(e.at).toISOString().slice(0, 10) + '</time></div>';
        }).join('') : sh().empty(L({ uz: 'Hali yozuv yoʻq', en: 'No records yet' }), '')) +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Koʻchirilgan vazifalar', en: 'Rescheduled tasks' })) + '</h2>' +
        (moved.length ? moved.map(function (t) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(t.title) + '</b>' +
            '<span>' + esc(L({ uz: 'koʻchirilgan', en: 'moved' })) + ' ×' + t.moved + '</span></span>' +
            '<time>' + esc(t.date) + '</time></div>';
        }).join('') : sh().empty(L({ uz: 'Koʻchirilgan vazifa yoʻq', en: 'Nothing rescheduled' }), '')) +
      '</section>' +
      '</div>';
  }

  /* ---------- sahifa --------------------------------------------------- */

  function render(tab) {
    tab = tab || 'today';
    var key = vd();
    var body =
        tab === 'calendar' ? viewCalendar(key)
      : tab === 'schedule' ? viewSchedule(key)
      : tab === 'week'     ? viewWeek(key)
      : tab === 'phases'   ? viewPhases(key)
      : tab === 'goals'    ? viewGoals()
      : tab === 'routines' ? viewRoutines(key)
      : tab === 'history'  ? viewHistory()
      : viewToday(key);

    var dest = OS.NAV.destOf('planner');
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('planner', tabsOf(), tab) +
      body + '</div>';
  }

  function mount(tab) {
    var content = document.getElementById('content');
    if (!content) return;

    /* Kun almashtirish */
    content.addEventListener('click', function (e) {
      var d = e.target.closest('[data-day]');
      if (d) {
        var n = Number(d.dataset.day);
        viewDate = n === 0 ? OS.cal.today() : OS.cal.addDays(vd(), n);
        App.render();
        return;
      }
      var w = e.target.closest('[data-week]');
      if (w) {
        var wn = Number(w.dataset.week);
        viewDate = wn === 0 ? OS.cal.today() : OS.cal.addDays(vd(), wn);
        App.render();
        return;
      }
      var ct = e.target.closest('[data-cal-to]');
      if (ct) { viewDate = ct.dataset.calTo; App.render(); return; }
      var cd = e.target.closest('[data-cal-day]');
      if (cd) { viewDate = cd.dataset.calDay; location.hash = '#/planner/today'; return; }

      /* Blok natijasi */
      var blk = e.target.closest('[data-blk]');
      if (blk && window.Store && Store.setBlockResult) {
        Store.setBlockResult(blk.dataset.key, blk.dataset.id, blk.dataset.blk, '');
        App.render();
        return;
      }

      /* Vazifa holati */
      var ts = e.target.closest('[data-task-st]');
      if (ts) { T().setStatus(ts.dataset.id, ts.dataset.taskSt); App.render(); return; }
      var tm = e.target.closest('[data-task-move]');
      if (tm) {
        var t = T().get(tm.dataset.taskMove);
        if (t) T().reschedule(t.id, OS.cal.addDays(t.date, 1));
        App.render();
        return;
      }
      var td = e.target.closest('[data-task-del]');
      if (td) { T().remove(td.dataset.taskDel); App.render(); return; }
    });

    /* Vazifa qo'shish */
    var form = document.getElementById('osTaskForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target;
        var title = f.title.value.trim();
        if (!title) return;
        T().add({
          title: title, date: f.date.value || vd(), time: f.time.value,
          min: f.min.value, cat: f.cat.value
        });
        App.render();
      });
    }

    /* Maqsad o'zgarishi — OS.CFG ichida (sessiya), Vault saqlaydi */
    Array.prototype.forEach.call(document.querySelectorAll('[data-goal]'), function (inp) {
      inp.addEventListener('change', function () {
        var v = parseFloat(inp.value);
        if (isNaN(v)) return;
        OS.CFG.target.skills[inp.dataset.goal] = v;
        if (window.Store && Store.setSetting) {
          var cur = Store.setting('osTarget') || {};
          cur[inp.dataset.goal] = v;
          Store.setSetting('osTarget', cur);
        }
        if (window.toast) toast(L({ uz: 'Maqsad yangilandi', en: 'Target updated' }), 'ok');
      });
    });
  }

  OS.pages.planner = { render: render, mount: mount, _setDate: function (d) { viewDate = d; } };
})();
