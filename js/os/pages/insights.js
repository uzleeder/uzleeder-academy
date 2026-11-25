/* ==========================================================================
   Insights — yagona tahlil manzili
   --------------------------------------------------------------------------
   Brief 4F. Filtrlar: Bugun · 7 kun · 30 kun · Maxsus sana · IELTS ·
   Coding · Lug'at · Umumiy.

   QAT'IY QOIDALAR (brief):
     • Rejalashtirilgan daqiqadan ko'rsatkich YASALMAYDI — faqat o'lchangan
       yoki qo'lda yozilgan vaqt.
     • Seriya (streak) va ball O'YLAB TOPILMAYDI.
     • Ma'lumot bo'lmasa "ma'lumot yo'q" deb yoziladi, nol emas.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  var RANGES = [
    ['today', { uz: 'Bugun', en: 'Today' }, 0],
    ['7',     { uz: '7 kun', en: '7 days' }, 6],
    ['30',    { uz: '30 kun', en: '30 days' }, 29],
    ['all',   { uz: 'Butun missiya', en: 'Whole mission' }, -1]
  ];
  var SCOPES = [
    ['all',    { uz: 'Umumiy', en: 'Overall' }],
    ['ielts',  { uz: 'IELTS', en: 'IELTS' }],
    ['coding', { uz: 'Coding', en: 'Coding' }],
    ['vocab',  { uz: 'Lugʻat', en: 'Vocabulary' }]
  ];

  var scope = 'all';

  function rangeKeys(rangeId) {
    var k = OS.cal, today = k.today();
    var def = RANGES.filter(function (r) { return r[0] === rangeId; })[0] || RANGES[1];
    if (def[2] === -1) return { from: OS.CFG.mission.start, to: today, label: def[1] };
    return { from: k.addDays(today, -def[2]), to: today, label: def[1] };
  }

  /* ---------- umumiy o'lchovlar ---------------------------------------- */

  function timeCard(r) {
    var m = OS.data.minutesRange(r.from, r.to);
    if (!m.total) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">' + esc(L({ uz: 'Oʻquv vaqti', en: 'Study time' })) + '</div>' +
        sh().empty(L({ uz: 'Vaqt yozilmagan', en: 'No time recorded' }),
          L({ uz: 'Bu yerda faqat oʻlchangan yoki qoʻlda yozilgan vaqt koʻrsatiladi — rejadagi daqiqalar emas.',
              en: 'Only measured or hand-entered time is shown here — never planned minutes.' })) +
        '</section>';
    }
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Oʻquv vaqti', en: 'Study time' })) + '</div>' +
      '<div class="os-grid c3">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Jami', en: 'Total' })) + '</div><div class="v">' +
          (Math.round(m.total / 60 * 10) / 10) + '<small> ' + esc(L({ uz: 'soat', en: 'h' })) + '</small></div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Oʻlchangan', en: 'Timed' })) + '</div><div class="v">' +
          (Math.round(m.measured / 60 * 10) / 10) + '<small> ' + esc(L({ uz: 'soat', en: 'h' })) + '</small></div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Faol kunlar', en: 'Active days' })) + '</div><div class="v">' +
          m.activeDays + '<small>/ ' + m.days + '</small></div></div>' +
      '</div>' +
      '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
      esc(L({ uz: 'Faol kun — vaqt YOZILGAN kun. Reja bajarilganini anglatmaydi.',
              en: 'An active day is a day with recorded time. It does not mean the plan was completed.' })) + '</p>' +
      '</section>';
  }

  function tasksCard(r) {
    var k = OS.cal, n = k.diffDays(r.from, r.to);
    var done = 0, partial = 0, skipped = 0, total = 0, blocksDone = 0, blocksTotal = 0;
    for (var i = 0; i <= n; i++) {
      var key = k.addDays(r.from, i);
      var c = OS.tasks.countsOn(key);
      total += c.total; done += c.done; partial += c.partial; skipped += c.skipped;
      var p = OS.data.dayProgress(key);
      blocksTotal += p.total; blocksDone += p.done;
    }
    if (!total && !blocksTotal) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">' + esc(L({ uz: 'Bajarilgan ish', en: 'Completed work' })) + '</div>' +
        sh().empty(L({ uz: 'Yozuv yoʻq', en: 'No records' }), '') + '</section>';
    }
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Bajarilgan ish', en: 'Completed work' })) + '</div>' +
      '<div class="os-grid c4">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Vazifa', en: 'Tasks' })) + '</div><div class="v">' + done + '<small>/ ' + total + '</small></div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Qisman', en: 'Partial' })) + '</div><div class="v">' + partial + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Oʻtkazilgan', en: 'Skipped' })) + '</div><div class="v">' + skipped + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Yadro bloklar', en: 'Core blocks' })) + '</div><div class="v">' + blocksDone + '<small>/ ' + blocksTotal + '</small></div></div>' +
      '</div></section>';
  }

  function consistencyCard(r) {
    var k = OS.cal, n = k.diffDays(r.from, r.to);
    if (n > 60) n = 60;
    var days = [];
    for (var i = 0; i <= n; i++) {
      var key = k.addDays(r.to, -(n - i));
      var m = OS.data.minutesOn(key);
      days.push({ key: key, min: m.total });
    }
    var max = days.reduce(function (a, d) { return Math.max(a, d.min); }, 0);
    if (!max) return '';
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Barqarorlik', en: 'Consistency' })) + '</div>' +
      '<div style="display:flex;gap:2px;align-items:flex-end;height:70px">' +
      days.map(function (d) {
        var h = max ? Math.max(2, Math.round(d.min / max * 100)) : 2;
        return '<div title="' + esc(d.key) + ' · ' + d.min + ' min" style="flex:1;min-width:3px;height:' + h + '%;border-radius:2px;background:' +
          (d.min ? 'var(--brand)' : 'var(--surface-3)') + '"></div>';
      }).join('') + '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:6px;font-family:var(--font-mono);font-size:10.5px;color:var(--faint)">' +
        '<span>' + esc(days[0].key) + '</span><span>' + esc(days[days.length - 1].key) + '</span></div>' +
      '</section>';
  }

  /* ---------- IELTS --------------------------------------------------- */

  function ieltsCard() {
    var ie = OS.data.ielts();
    var st = window.Store;
    var scores = st && st.engScoreList ? st.engScoreList() : [];
    if (!scores.length) {
      return '<section class="os-card">' +
        '<div class="os-eyebrow">IELTS</div>' +
        sh().empty(L({ uz: 'Mock natijasi yoʻq', en: 'No mock results' }),
          L({ uz: 'Birinchi mock pre-launch bosqichida (26–30 noyabr 2026).',
              en: 'The first mock is in the pre-launch phase (26–30 November 2026).' })) +
        '</section>';
    }
    var sorted = scores.slice().sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
    return '<section class="os-card">' +
      '<div class="os-eyebrow">IELTS</div>' +
      '<div class="os-table-wrap"><table class="os-table"><thead><tr>' +
        '<th>' + esc(L({ uz: 'Sana', en: 'Date' })) + '</th><th>L</th><th>R</th><th>W</th><th>S</th>' +
        '<th>' + esc(L({ uz: 'Umumiy', en: 'Overall' })) + '</th></tr></thead><tbody>' +
      sorted.map(function (s) {
        var b = [s.l, s.r, s.w, s.s].filter(function (x) { return typeof x === 'number'; });
        var ov = b.length === 4 ? (Math.round(b.reduce(function (a, c) { return a + c; }, 0) / 4 * 2) / 2).toFixed(1) : '—';
        return '<tr><td data-l="' + esc(L({ uz: 'Sana', en: 'Date' })) + '">' + (s.at ? new Date(s.at).toISOString().slice(0, 10) : '—') + '</td>' +
          '<td data-l="L">' + (s.l != null ? s.l : '—') + '</td>' +
          '<td data-l="R">' + (s.r != null ? s.r : '—') + '</td>' +
          '<td data-l="W">' + (s.w != null ? s.w : '—') + '</td>' +
          '<td data-l="S">' + (s.s != null ? s.s : '—') + '</td>' +
          '<td data-l="' + esc(L({ uz: 'Umumiy', en: 'Overall' })) + '"><b>' + ov + '</b></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'Maqsad', en: 'Target' })) + ': ' + OS.CFG.target.overall + ' · ' +
        esc(L({ uz: 'yozilgan mock', en: 'mocks recorded' })) + ': ' + ie.mockCount + '</p>' +
      '</section>';
  }

  /* ---------- Coding --------------------------------------------------- */

  function codingCard() {
    var co = OS.data.coding();
    if (!co || (!co.pythonDone && !co.quizAttempts)) {
      return '<section class="os-card"><div class="os-eyebrow">Coding</div>' +
        sh().empty(L({ uz: 'Coding yozuvi yoʻq', en: 'No coding records' }), '') + '</section>';
    }
    return '<section class="os-card">' +
      '<div class="os-eyebrow">Coding</div>' +
      '<div class="os-grid c3">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Python kunlari', en: 'Python days' })) + '</div>' +
          '<div class="v">' + co.pythonDone + '<small>/ ' + co.pythonTotal + '</small></div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Test aniqligi', en: 'Quiz accuracy' })) + '</div>' +
          '<div class="v">' + (co.quizAccuracy != null ? co.quizAccuracy + '%' : '—') + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Oʻrtacha ball', en: 'Average score' })) + '</div>' +
          '<div class="v">' + (co.avgScore || '—') + '</div></div>' +
      '</div></section>';
  }

  /* ---------- Lug'at va xatolar ---------------------------------------- */

  function vocabCard() {
    var items = [];
    try { items = Review.list().filter(function (it) { return it.kind === 'vocab' || it.kind === 'bw'; }); } catch (e) {}
    if (!items.length) {
      return '<section class="os-card"><div class="os-eyebrow">' + esc(L({ uz: 'Lugʻat', en: 'Vocabulary' })) + '</div>' +
        sh().empty(L({ uz: 'Lugʻat yozuvi yoʻq', en: 'No vocabulary records' }), '') + '</section>';
    }
    var reps = items.reduce(function (a, it) { return a + (it.reps || 0); }, 0);
    var lapses = items.reduce(function (a, it) { return a + (it.lapses || 0); }, 0);
    var acc = reps ? Math.round((reps - lapses) / reps * 100) : null;
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Lugʻat', en: 'Vocabulary' })) + '</div>' +
      '<div class="os-grid c3">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Soʻzlar', en: 'Words' })) + '</div><div class="v">' + items.length + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Takror aniqligi', en: 'Review accuracy' })) + '</div><div class="v">' + (acc != null ? acc + '%' : '—') + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Unutilgan', en: 'Lapses' })) + '</div><div class="v">' + lapses + '</div></div>' +
      '</div>' +
      '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
      esc(L({ uz: 'Aniqlik = (takror − unutilgan) / takror. Haqiqiy baholashlardan.',
              en: 'Accuracy = (reps − lapses) / reps, from real ratings.' })) + '</p>' +
      '</section>';
  }

  function mistakesCard() {
    var rv = OS.data.review();
    if (!rv.allMistakes) return '';
    var resolved = rv.allMistakes - rv.openMistakes;
    return '<section class="os-card">' +
      '<div class="os-eyebrow">' + esc(L({ uz: 'Xatolarni tuzatish', en: 'Mistake resolution' })) + '</div>' +
      '<div class="os-grid c3">' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Hal boʻlgan', en: 'Resolved' })) + '</div><div class="v">' + resolved + '<small>/ ' + rv.allMistakes + '</small></div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Ochiq', en: 'Open' })) + '</div><div class="v">' + rv.openMistakes + '</div></div>' +
        '<div class="os-stat"><div class="k">' + esc(L({ uz: 'Takror navbatida', en: 'Due' })) + '</div><div class="v">' + rv.due + '</div></div>' +
      '</div>' +
      sh().meter(rv.allMistakes ? resolved / rv.allMistakes * 100 : 0, 'green') +
      '</section>';
  }

  /* ---------- sahifa --------------------------------------------------- */

  function render(tab) {
    var rangeId = tab && RANGES.some(function (r) { return r[0] === tab; }) ? tab : '7';
    var r = rangeKeys(rangeId);
    var dest = OS.NAV.destOf('insights');

    var body = '';
    body += '<div class="os-tabs" role="tablist">' + RANGES.map(function (x) {
      return '<button role="tab" class="' + (x[0] === rangeId ? 'on' : '') + '" data-go="insights/' + x[0] + '">' + esc(L(x[1])) + '</button>';
    }).join('') + '</div>';

    body += '<div class="os-tabs" style="margin-top:-8px" role="tablist">' + SCOPES.map(function (x) {
      return '<button role="tab" class="' + (x[0] === scope ? 'on' : '') + '" data-scope="' + x[0] + '">' + esc(L(x[1])) + '</button>';
    }).join('') + '</div>';

    body += '<div style="font-family:var(--font-mono);font-size:11.5px;color:var(--faint);margin-bottom:var(--sp-4)">' +
      esc(r.from) + ' → ' + esc(r.to) + '</div>';

    var cards = [];
    if (scope === 'all' || scope === 'ielts') cards.push(ieltsCard());
    if (scope === 'all' || scope === 'coding') cards.push(codingCard());
    if (scope === 'all' || scope === 'vocab') cards.push(vocabCard());
    if (scope === 'all') { cards.push(timeCard(r)); cards.push(tasksCard(r)); cards.push(mistakesCard()); }
    else { cards.push(timeCard(r)); }

    body += '<div class="os-grid c2">' + cards.filter(Boolean).join('') + '</div>';
    var cons = consistencyCard(r);
    if (cons) body += '<div style="margin-top:var(--sp-4)">' + cons + '</div>';

    body += '<div class="os-note info" style="margin-top:var(--sp-4)">' + sh().icon('bulb') + '<div>' +
      esc(L({ uz: 'Bu sahifadagi hech bir raqam rejadan hisoblanmaydi. Yozuv boʻlmasa — "maʼlumot yoʻq" deb turadi.',
              en: 'No number on this page is derived from the plan. With no records it says so, rather than showing zero as an achievement.' })) +
      '</div></div>';

    body += '<div style="margin-top:var(--sp-4)"><button class="os-btn ghost" data-go="classic/analytics">' +
      esc(L({ uz: 'Eski tahlil sahifasi', en: 'Classic analytics page' })) + '</button></div>';

    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) + body + '</div>';
  }

  function mount() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-scope]'), function (b) {
      b.addEventListener('click', function () { scope = b.dataset.scope; App.render(); });
    });
  }

  OS.pages.insights = { render: render, mount: mount };
})();
