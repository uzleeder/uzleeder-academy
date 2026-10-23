/* ==========================================================================
   IELTS Mission sahifalari (1-qism) — #/mission/...
   --------------------------------------------------------------------------
     #/mission                 bugungi missiya + umumiy holat (dashboard)
     #/mission/plan            16 haftalik kalendar
     #/mission/day/<sana>      bitta kun rejasi
     #/mission/tests           diagnostika, mock jadvali, natijalar jurnali
     #/mission/profile         dalil asosidagi profil
     #/mission/errors          xatolar banki · /errors/review — takror sessiyasi
     #/mission/books           kitob ishi jurnali (RE4, Reading Accelerator …)
     #/mission/import          o'z tinglash testini kiritish (kalit + audio)
     #/mission/settings        workload va takror oraliqlari
   Mashq oynalari (runner), Writing va Speaking Studio — js/pages/mission-run.js.
   Hamma raqam saqlangan dalildan; dalil yo'q joyda "baholanmagan" deb yoziladi.
   ========================================================================== */
(function () {
  'use strict';
  var M = function () { return window.Mission; };
  var t = function (uz, en) { return L({ uz: uz, en: en }); };
  var VIEWS = {}, MOUNT = null, TICK = null;

  function qs(s) { var o = {}; String(s || '').split('&').forEach(function (p) { if (!p) return; var i = p.indexOf('='); o[decodeURIComponent(i < 0 ? p : p.slice(0, i))] = i < 0 ? '' : decodeURIComponent(p.slice(i + 1)); }); return o; }
  function pc(v) { return v == null ? '—' : Math.round(v * 100) + '%'; }
  function fmtD(k) { return window.EngCal && EngCal.fmt ? EngCal.fmt(k) : k; }
  function skillName(sk) {
    var C = M().C(); if (C.skills[sk]) return L(C.skills[sk].title);
    return { writing: 'Writing', speaking: 'Speaking', grammar: t('Grammatika', 'Grammar') }[sk] || sk;
  }
  function confChip(c) {
    var lab = { none: t('baholanmagan', 'not assessed'), low: t('ishonch past', 'low confidence'), medium: t('ishonch o\'rta', 'medium confidence'), high: t('ishonch yuqori', 'high confidence') }[c] || c;
    return '<span class="ms-conf c-' + esc(c) + '">' + esc(lab) + '</span>';
  }
  function icon(sk) { var C = M().C(); var k = (C.skills[sk] || {}).icon || (sk === 'writing' ? 'pen' : 'mic'); return IC[k] || IC.spark; }
  function head(eyebrow, title, lede) {
    return '<header class="page-head"><div class="eyebrow">' + esc(eyebrow) + '</div><h1>' + esc(title) + '</h1>' + (lede ? '<p class="lede">' + esc(lede) + '</p>' : '') + '</header>';
  }
  function subnav(on) {
    var tabs = [['mission', 'home', t('Bugun', 'Today'), IC.today], ['mission/plan', 'plan', t('Reja', 'Plan'), IC.calendar], ['mission/errors', 'errors', t('Xatolar', 'Errors'), IC.alert],
      ['mission/vocab', 'vocab', t("Lug'at", 'Vocabulary'), IC.notebook], ['mission/writing', 'writing', 'Writing', IC.pen], ['mission/speaking', 'speaking', 'Speaking', IC.mic],
      ['mission/tests', 'tests', t('Testlar', 'Tests'), IC.target], ['mission/profile', 'profile', t('Profil', 'Profile'), IC.trend], ['mission/books', 'books', t('Kitoblar', 'Books'), IC.book]];
    return '<nav class="hub-tabs ms-tabs no-print" aria-label="Mission">' + tabs.map(function (x) {
      return '<button class="hub-tab' + (x[1] === on ? ' on' : '') + '" data-go="' + x[0] + '"' + (x[1] === on ? ' aria-current="page"' : '') + '>' + x[3] + '<span>' + esc(x[2]) + '</span></button>';
    }).join('') + '</nav>';
  }
  function card(title, body, ic, extra) { return '<section class="card ms-card"' + (extra || '') + '><h3 class="card-title">' + (ic ? '<span class="num">' + ic + '</span>' : '') + esc(title) + '</h3>' + body + '</section>'; }
  function tile(l, v, note, cls) { return '<div class="stat-tile ' + (cls || '') + '"><div class="st-l">' + esc(l) + '</div><div class="st-v">' + v + '</div>' + (note ? '<div class="st-note">' + esc(note) + '</div>' : '') + '</div>'; }

  /* ====================== DASHBOARD + BUGUNGI MISSIYA ================== */
  function stateLabel(s) {
    return { todo: t('kutmoqda', 'to do'), active: t('jarayonda', 'in progress'), paused: t('pauza', 'paused'), done: t('bajarildi', 'done'), skipped: t("o'tkazildi", 'skipped'), moved: t("ko'chirildi", 'moved') }[s] || s;
  }
  function elapsed(s) { return (s.min || 0) + (s.st === 'active' && s.startedAt ? Math.max(0, Math.round((Date.now() - s.startedAt) / 60000)) : 0); }
  function taskCard(d, tk, canAct) {
    var s = tk.state || { st: 'todo' }, st = s.st;
    var h = '<article class="ms-task st-' + esc(st) + (tk.carried ? ' carried' : '') + '" id="mt-' + esc(tk.id.replace(/[^\w-]/g, '_')) + '">';
    h += '<div class="ms-task-h"><span class="ms-ic">' + icon(tk.skill) + '</span><div class="ms-task-t"><span class="ms-sk">' + esc(skillName(tk.skill)) + ' · ' + tk.min + ' ' + t('daq', 'min') +
      (tk.kind === 'diag' ? ' · <b>' + t('diagnostika', 'diagnostic') + '</b>' : tk.kind === 'mock' ? ' · <b>' + t('amaliy mock', 'practice mock') + '</b>' : '') +
      (tk.movedFrom ? ' · ' + t('ko\'chirilgan: ', 'moved from ') + esc(fmtD(tk.movedFrom)) : '') + '</span><h4>' + esc(L(tk.title)) + '</h4></div>' +
      '<span class="ms-st st-' + esc(st) + '">' + esc(stateLabel(st)) + (s.min || st === 'active' ? ' · <span data-elapsed="' + esc(tk.id) + '">' + elapsed(s) + '</span> ' + t('daq', 'min') : '') + '</span></div>';
    h += '<dl class="ms-dl"><dt>' + t('Maqsad', 'Objective') + '</dt><dd>' + esc(L(tk.objective)) + '</dd><dt>' + t('Faoliyat', 'Activity') + '</dt><dd>' + esc(L(tk.activity)) + '</dd>' +
      '<dt>' + t('Bajarildi mezoni', 'Done when') + '</dt><dd>' + esc(L(tk.criteria)) + '</dd><dt>' + t('Baholash', 'Assessment') + '</dt><dd>' + esc(L(tk.assess)) + '</dd><dt>' + t('Keyin', 'Next') + '</dt><dd>' + esc(L(tk.next)) + '</dd></dl>';
    if (tk.why && tk.why.length) h += '<details class="ms-why"><summary>' + IC.bulb + t('Nega bu vazifa?', 'Why this task?') + '</summary><ul>' + tk.why.map(function (w) { return '<li>' + esc(L(w)) + '</li>'; }).join('') + '</ul></details>';
    var parts = tk.parts && tk.parts.length ? tk.parts : [{ min: tk.min, label: tk.material.label, route: tk.material.route }];
    h += '<div class="ms-parts">' + parts.map(function (p) {
      return '<button class="btn btn-ghost btn-sm ms-open" data-mopen="' + esc(p.route) + '" data-mid="' + esc(tk.id) + '" data-md="' + esc(d) + '">' + IC.arrowR + esc(L(p.label)) + (parts.length > 1 ? ' · ' + p.min + ' ' + t('daq', 'min') : '') + '</button>';
    }).join('') + '</div>';
    if (canAct) {
      h += '<div class="ms-acts">';
      if (st === 'todo' || st === 'paused') h += '<button class="btn btn-primary btn-sm" data-mt="start" data-id="' + esc(tk.id) + '">' + IC.play + (st === 'paused' ? t('Davom etish', 'Resume') : t('Boshlash', 'Start')) + '</button>';
      if (st === 'active') h += '<button class="btn btn-ghost btn-sm" data-mt="pause" data-id="' + esc(tk.id) + '">' + t('Pauza', 'Pause') + '</button>';
      if (st !== 'done' && st !== 'moved') h += '<button class="btn btn-ghost btn-sm" data-mt="done" data-id="' + esc(tk.id) + '">' + IC.check + t('Bajarildi', 'Mark done') + '</button>';
      if (st === 'todo' || st === 'paused') h += '<button class="btn btn-quiet btn-sm" data-mt="move" data-id="' + esc(tk.id) + '">' + t('Ertaga', 'Tomorrow') + '</button><button class="btn btn-quiet btn-sm" data-mt="skip" data-id="' + esc(tk.id) + '">' + t("O'tkazish", 'Skip') + '</button>';
      if (st === 'done' || st === 'skipped') h += '<button class="btn btn-quiet btn-sm" data-mt="reopen" data-id="' + esc(tk.id) + '">' + t('Qayta ochish', 'Reopen') + '</button>';
      h += '</div>';
    }
    return h + '</article>';
  }
  function modeBar(dv) {
    var C = M().C(), cur = M().M().settings.mode;
    return '<div class="ms-modes" role="group" aria-label="' + esc(t('Kunlik hajm', 'Daily workload')) + '">' + C.modes.map(function (m) {
      return '<button class="seg' + (m.key === cur ? ' on' : '') + '" data-mmode="' + m.key + '">' + esc(m.key === 'custom' ? t('Boshqa', 'Custom') + (cur === 'custom' ? ' · ' + M().M().settings.custom : '') : m.key) + '</button>';
    }).join('') + '<span class="hint">' + esc(t('daqiqa — reja, o\'rganish dalili emas', 'minutes — a plan, not proof of learning')) + '</span></div>';
  }
  function dayPanel(dv, canAct) {
    var h = '';
    dv.notes.forEach(function (n) { h += '<div class="callout tip ms-note"><span class="co-ic">' + IC.alert + '</span><div>' + esc(L(n)) + '</div></div>'; });
    h += '<div class="ms-dayhead"><div><b>' + esc(fmtD(dv.date)) + '</b> · ' + (dv.idx >= 1 && dv.idx <= M().C().days ? t(dv.idx + '-kun', 'Day ' + dv.idx) + ' / ' + M().C().days + ' · ' + t(dv.week + '-hafta', 'Week ' + dv.week) + (dv.phase ? ' · ' + esc(L(dv.phase.title)) : '') : (dv.before ? t('Missiyadan oldin', 'Before the mission') : t('Missiyadan keyin', 'After the mission'))) +
      '</div><div class="ms-prog"><span>' + t('Reja', 'Planned') + ': <b>' + dv.planned + '</b> ' + t('daq', 'min') + '</span><span>' + t('Yozilgan vaqt', 'Recorded time') + ': <b data-dayspent>' + dv.spent + '</b> ' + t('daq', 'min') + '</span><span>' + t('Bajarilgan', 'Done') + ': <b>' + dv.done + '/' + dv.tasks.length + '</b></span></div></div>';
    h += dv.tasks.map(function (tk) { return taskCard(dv.date, tk, canAct); }).join('');
    return h;
  }
  function weekBars() {
    var w = M().weekMinutes(), max = Math.max(60, Math.max.apply(null, w.map(function (x) { return Math.max(x.min, x.planned); })));
    return '<div class="ms-week">' + w.map(function (x) {
      return '<div class="ms-wd" title="' + esc(x.date + ': ' + x.min + ' / ' + x.planned) + '"><div class="ms-wbar"><i class="pl" style="height:' + (x.planned / max * 100) + '%"></i><i class="dn" style="height:' + (x.min / max * 100) + '%"></i></div><span>' + esc(x.date.slice(8)) + '</span><b>' + x.min + '</b></div>';
    }).join('') + '</div><p class="hint">' + esc(t("Kulrang — reja, rangli — yozilgan vaqt (taymer). Vaqt o'rganish dalili emas.", 'Grey — planned, colour — recorded time (timer). Time is not proof of learning.')) + '</p>';
  }
  function skillsPanel() {
    var pr = M().profile(), rows = ['reading', 'listening', 'vocab', 'grammar', 'writing', 'speaking'].map(function (sk) {
      var p = pr[sk], val, note;
      if (sk === 'writing' || sk === 'speaking') {
        val = p.n ? (sk === 'writing' && p.lastSelf != null ? p.lastSelf.toFixed(1) + ' <small>' + t("o'z bahosi", 'self-estimate') + '</small>' : p.n + ' <small>' + t('baholangan', 'assessed') + '</small>') : '—';
        note = sk === 'writing' ? t(p.pieces + ' ta ish', p.pieces + ' pieces') : t(p.sessions + ' sessiya, ' + p.recorded + ' yozuv', p.sessions + ' sessions, ' + p.recorded + ' recorded');
      } else if (sk === 'vocab') { var vs = M().vocab.stats(); val = p.n ? pc(p.recentAcc != null ? p.recentAcc : p.acc) : '—'; note = t(vs.total + " so'z · " + vs.secure + ' mustahkam · ' + vs.due + ' takror', vs.total + ' words · ' + vs.secure + ' secure · ' + vs.due + ' due'); }
      else { val = p.n ? pc(p.recentAcc != null ? p.recentAcc : p.acc) : '—'; note = t(p.n + ' ta javob', p.n + ' answers') + (p.earlyAcc != null && p.recentAcc != null ? ' · ' + t('boshida ', 'early ') + pc(p.earlyAcc) : ''); }
      return '<button class="ms-skill" data-go="mission/profile"><span class="ms-ic">' + icon(sk) + '</span><span class="ms-sn">' + esc(skillName(sk)) + '</span><b>' + val + '</b>' + confChip(p.conf) + '<small>' + esc(note) + '</small></button>';
    });
    return '<div class="ms-skills">' + rows.join('') + '</div><p class="hint">' + esc(t("Foiz — so'nggi 40 ta javobdagi aniqlik. Writing/Speaking — o'z bahosi, rasmiy band emas.", 'Percent = accuracy over the last 40 answers. Writing/Speaking = self-estimates, not official bands.')) + '</p>';
  }
  function reviewsPanel() {
    var E = M().errors, td = M().today(), due = E.due(td).length, wk = E.list().filter(function (e) { return e.status !== 'fixed' && e.srs && e.srs.due > td && e.srs.due <= SRS2.addDays(td, 7); }).length;
    var vs = M().vocab.stats(), up7 = M().vocab.list().filter(function (it) { return it.srs.due > td && it.srs.due <= SRS2.addDays(td, 7); }).length;
    return '<div class="stat-grid">' + tile(t('Xato takrori — bugun', 'Error reviews — today'), due, t('7 kunda yana ', 'next 7 days: ') + wk, due ? 'red' : '') + tile(t("So'z takrori — bugun", 'Word reviews — today'), vs.due, t('7 kunda yana ', 'next 7 days: ') + up7, vs.due ? 'gold' : '') + '</div>' +
      '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-go="mission/errors/review"' + (due ? '' : ' disabled') + '>' + IC.refresh + t('Xatolarni takrorlash', 'Review errors') + '</button><button class="btn btn-ghost btn-sm" data-go="mission/vocab">' + IC.notebook + t("So'zlar", 'Words') + '</button></div>';
  }
  function grammarTrend() {
    var C = M().C(), st = M().errors.stats(), rows = st.top.filter(function (x) { return x.skill === 'grammar' || (x.skill === 'writing' && C.grammarCats[x.cat]); }).slice(0, 6);
    if (!rows.length) return '<p class="hint">' + esc(t("Grammatika xatosi hali yozilmagan. Grammatika diagnostikasi va Writing Studio'dagi belgilar shu yerda ko'rinadi.", 'No grammar errors recorded yet. The grammar diagnostic and Writing Studio marks appear here.')) + '</p>';
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }));
    return '<div class="ms-hbars">' + rows.map(function (r) { return '<div><span>' + esc(C.grammarCats[r.cat] ? L(C.grammarCats[r.cat].title) : r.cat) + '</span><div class="bar"><i style="width:' + (r.n / max * 100) + '%"></i></div><b>' + r.open + ' / ' + r.n + '</b></div>'; }).join('') + '</div><p class="hint">' + esc(t('ochiq / jami uchrash', 'open / total occurrences')) + '</p>';
  }
  function resultsMini() {
    var rs = M().results.list().slice(0, 4);
    if (!rs.length) return '<p class="hint">' + esc(t("Hali natija yo'q. Mock kunlari: ", 'No results yet. Mock days: ') + M().C().mockDays.map(fmtD).join(', ')) + '</p>';
    return '<div class="ms-res">' + rs.map(resRow).join('') + '</div>';
  }
  var KINDL = function (k) { return { practice: t('Amaliy ball', 'Practice score'), estimate: t('Taxmin (o\'z bahosi)', 'Estimate (self)'), verified: t('Tasdiqlangan konversiya', 'Verified conversion'), official: t('RASMIY natija', 'OFFICIAL result') }[k] || k; };
  function resRow(r) {
    var v = r.kind === 'practice' ? Object.keys(r.raw || {}).map(function (k) { return esc(k) + ' ' + esc(r.raw[k]); }).join(' · ') : ['L', 'R', 'W', 'S'].filter(function (k) { return r[k] != null; }).map(function (k) { return k + ' ' + r[k]; }).join(' · ');
    return '<div class="ms-rrow k-' + esc(r.kind) + '"><span class="ms-kind">' + esc(KINDL(r.kind)) + '</span><b>' + v + '</b><small>' + esc(fmtD(r.date)) + (r.source ? ' · ' + esc(r.source) : '') + '</small></div>';
  }
  function recsPanel() {
    var rs = M().recommend();
    if (!rs.length) return '<p class="hint">' + esc(t("Hozircha qo'shimcha tavsiya yo'q — bugungi reja yetarli.", 'No extra recommendations — today\'s plan covers it.')) + '</p>';
    return '<div class="ms-recs">' + rs.map(function (r) { return '<button class="ms-rec" data-go="' + esc(r.route) + '"><b>' + esc(L(r.title)) + '</b><small>' + IC.bulb + esc(L(r.why)) + '</small></button>'; }).join('') + '</div>';
  }
  VIEWS.home = function () {
    var C = M().C(), td = M().today(), dv = M().day(td), idx = M().dayIndex(td);
    RV.list = null;
    var lede = idx < 1 ? t('Missiya ' + fmtD(C.start) + ' kuni boshlanadi — ' + (1 - idx) + ' kun qoldi. Diagnostikalarni hozir boshlash mumkin.', 'The mission starts on ' + fmtD(C.start) + ' — in ' + (1 - idx) + ' day(s). You can start the diagnostics now.')
      : idx > C.days ? t('Missiya tugagan. Imtihon: ' + fmtD(C.exam), 'The mission has ended. Exam: ' + fmtD(C.exam))
      : t('16 hafta: ' + fmtD(C.start) + ' → ' + fmtD(C.finalReview) + ' (yakuniy takror). Maqsad: IELTS Academic 8.0+.', '16 weeks: ' + fmtD(C.start) + ' → ' + fmtD(C.finalReview) + ' (final review). Target: IELTS Academic 8.0+.');
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Bugungi missiya', "Today's mission"), lede) + subnav('home');
    h += '<div class="ms-grid"><div class="ms-main">' + card(t('Kunlik reja', 'Daily plan'), modeBar(dv) + dayPanel(dv, true), IC.today) + '</div>';
    h += '<aside class="ms-side">' + card(t('Tavsiya etilgan keyingi qadamlar', 'Recommended next actions'), recsPanel(), IC.bulb) +
      card(t('Takrorlar', 'Upcoming reviews'), reviewsPanel(), IC.refresh) +
      card(t('Hafta: o\'quv vaqti', 'This week: study time'), weekBars(), IC.clock) + '</aside></div>';
    /* Missiya ichidagi ingliz tili kurslari (Kurslar sahifasidan shu yerga ko'chirilgan) */
    if (window.CourseCards && CourseCards.englishAll) {
      try { h += '<h2 class="jr-h2">' + esc(t('Missiya ichidagi kurslar', 'Courses in this mission')) + '</h2><div class="course-pick programs">' + CourseCards.englishAll() + '</div>'; }
      catch (e) { if (window.console) console.error(e); }
    }
    h += card(t("Ko'nikmalar (dalil asosida)", 'Skills (evidence-based)'), skillsPanel(), IC.trend);
    h += '<div class="ms-two">' + card(t('Grammatika xatolari tendensiyasi', 'Grammar error trend'), grammarTrend(), IC.pen) + card(t('Test natijalari', 'Test results'), resultsMini() + '<button class="btn btn-quiet btn-sm" data-go="mission/tests">' + IC.arrowR + t('Hammasi', 'All') + '</button>', IC.target) + '</div>';
    MOUNT = function () { mountDay(dv.date); };
    return h + '</div>';
  };
  function mountDay(d) {
    $$('[data-mt]').forEach(function (b) { b.addEventListener('click', function () {
      var a = b.dataset.mt, id = b.dataset.id, T2 = M().tasks;
      if (a === 'move') { T2.move(d, id, SRS2.addDays(d, 1)); toast(t("Ertaga ko'chirildi", 'Moved to tomorrow'), 'ok'); }
      else T2[a](d, id);
      App.render();
    }); });
    $$('[data-mopen]').forEach(function (b) { b.addEventListener('click', function () {
      var st = M().M().days[b.dataset.md] && M().M().days[b.dataset.md].tasks[b.dataset.mid];
      if (!st || st.st === 'todo' || st.st === 'paused') M().tasks.start(b.dataset.md, b.dataset.mid);
      try { sessionStorage.setItem('uzla.msnTask', JSON.stringify({ d: b.dataset.md, id: b.dataset.mid })); } catch (e) {}
      App.go(b.dataset.mopen);
    }); });
    $$('[data-mmode]').forEach(function (b) { b.addEventListener('click', function () {
      var md = b.dataset.mmode, cu = null;
      if (md === 'custom') { cu = prompt(t('Bugun necha daqiqa? (30–360)', 'How many minutes today? (30–360)'), String(M().M().settings.custom || 150)); if (cu === null) return; }
      M().tasks.setMode(d, md, cu); App.render();
    }); });
    clearInterval(TICK);
    TICK = setInterval(function () {
      if (!document.querySelector('[data-elapsed]')) { clearInterval(TICK); return; }
      var rec = M().M().days[d]; if (!rec) return;
      $$('[data-elapsed]').forEach(function (el) { var s = rec.tasks[el.dataset.elapsed]; if (s) el.textContent = elapsed(s); });
    }, 20000);
  }

  /* ====================== 16 HAFTALIK REJA ============================= */
  VIEWS.plan = function () {
    var C = M().C(), m = M().M(), td = M().today();
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('16 haftalik reja', '16-week plan'), t('Har katak — bir kun. Rang: bajarilgan vazifalar ulushi (faqat yozilgan holat). M — amaliy mock, F — yakuniy takror.', 'Each cell is one day. Colour: share of tasks done (recorded state only). M — practice mock, F — final review.')) + subnav('plan');
    C.phases.forEach(function (ph) {
      h += '<section class="card ms-card"><h3 class="card-title"><span class="num">' + ph.from + (ph.to !== ph.from ? '–' + ph.to : '') + '</span>' + esc(L(ph.title)) + '</h3><p class="hint">' + esc(L(ph.focus)) + '</p><div class="ms-cal">';
      for (var w = ph.from; w <= ph.to; w++) {
        h += '<div class="ms-wk"><span class="ms-wn">' + t(w + '-h', 'W' + w) + '</span>';
        for (var i = 0; i < 7; i++) {
          var k = SRS2.addDays(C.start, (w - 1) * 7 + i), rec = m.days[k], cls = '', tot = 0, dn = 0;
          if (rec && rec.plan) { rec.plan.forEach(function (x) { var s = rec.tasks[x.id]; if (s && s.st === 'moved') return; tot++; if (s && s.st === 'done') dn++; }); cls = tot ? (dn === tot ? 'full' : dn ? 'part' : (k < td ? 'miss' : 'open')) : ''; }
          else if (k < td) cls = 'none';
          var mk = C.mockDays.indexOf(k) >= 0 ? '<i>M</i>' : '';
          h += '<button class="ms-cell ' + cls + (k === td ? ' today' : '') + '" data-go="mission/day/' + k + '" title="' + esc(k + (tot ? ': ' + dn + '/' + tot : '')) + '"><span>' + esc(k.slice(8)) + '</span>' + mk + '</button>';
        }
        h += '</div>';
      }
      if (ph.key === 'final') h += '<div class="ms-wk"><span class="ms-wn">' + t('Yakun', 'Final') + '</span><button class="ms-cell' + (C.finalReview === td ? ' today' : '') + '" data-go="mission/day/' + C.finalReview + '"><span>14</span><i>F</i></button></div>';
      h += '</div></section>';
    });
    MOUNT = null;
    return h + '</div>';
  };

  VIEWS.day = function (parts) {
    var d = parts[1] || M().today(), td = M().today();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) d = td;
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', fmtD(d), '') + subnav('plan');
    var rec = M().M().days[d];
    if (d === td) { location.hash = '#/mission'; return h + '</div>'; }
    if (rec && rec.plan) { var dv = M().day(d); h += card(t('Kun rejasi', 'Day plan'), dayPanel(dv, d < td), IC.calendar); MOUNT = function () { mountDay(d); }; }
    else if (d < td) { h += '<div class="callout tip"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t("Bu kun uchun reja yozilmagan (ilova ochilmagan). Hech narsa uyulmaydi — o'tgan kunlar qarzga aylanmaydi.", 'No plan was recorded for this day (the app was not opened). Nothing piles up — past days do not become debt.')) + '</div></div>'; MOUNT = null; }
    else {
      var b = M().build(d);
      h += '<div class="callout tip"><span class="co-ic">' + IC.calendar + '</span><div>' + esc(t("Oldindan ko'rinish. Reja o'sha kuni yangi dalil bilan yakunlanadi.", 'Preview. The plan is finalised on the day with the latest evidence.')) + '</div></div>';
      h += card(t('Taxminiy reja', 'Provisional plan'), b.tasks.map(function (tk) { return taskCard(d, Object.assign({}, tk, { state: { st: 'todo' } }), false); }).join(''), IC.calendar);
      MOUNT = null;
    }
    return h + '</div>';
  };

  /* ====================== TESTLAR: diagnostika + natijalar ============= */
  VIEWS.tests = function () {
    var C = M().C(), m = M().M(), td = M().today();
    var diag = [
      ['reading', 'mission/run/reading/1?mode=diagnostic', t("1-matn, aralash savol turlari, 20 daq", 'Passage 1, mixed question types, 20 min')],
      ['listening', 'mission/run/listen/1?mode=diagnostic&then=3', t("2 bo'lim, brauzer ovozi — taxminiy", '2 sections, browser voice — indicative')],
      ['grammar', 'mission/run/grammar/diag?mode=diagnostic', t('20 mashq, 10 toifa', '20 exercises, 10 categories')],
      ['vocab', 'mission/vocab?mode=diagnostic', t("30 so'z, yozib eslash", '30 words, typed recall')],
      ['writing', 'mission/writing/new?task=2&prompt=t2-01&mode=diagnostic&timed=40', t('Task 2, 40 daq + o\'z bahosi', 'Task 2, 40 min + self-assessment')],
      ['speaking', 'mission/speaking/new?part=full&card=c01&mode=diagnostic', t('Part 1–3, yozib olinadi', 'Parts 1–3, recorded')]
    ];
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Diagnostika va testlar', 'Diagnostics & tests'), t("To'rt xil natija farqlanadi: amaliy ball · o'z taxmini · tasdiqlangan konversiya · rasmiy natija. Qisqa test bo'yicha umumiy band qo'yilmaydi.", 'Four kinds of result are kept apart: practice score · self-estimate · verified conversion · official result. No overall band is ever derived from a short quiz.')) + subnav('tests');
    h += card(t('Diagnostikalar', 'Diagnostics'), '<div class="ms-diag">' + diag.map(function (x) {
      var dd = m.diag[x[0]];
      return '<div class="ms-drow"><span class="ms-ic">' + icon(x[0]) + '</span><div><b>' + esc(skillName(x[0])) + '</b><small>' + esc(x[2]) + '</small></div>' +
        (dd ? '<span class="ms-st st-done">' + t('bajarilgan ', 'done ') + esc(fmtD(dd.at)) + '</span>' : '<span class="ms-st st-todo">' + t('bajarilmagan', 'not done') + '</span>') +
        '<button class="btn ' + (dd ? 'btn-quiet' : 'btn-primary') + ' btn-sm" data-go="' + esc(x[1]) + '">' + (dd ? t('Qayta', 'Retake') : t('Boshlash', 'Start')) + '</button></div>';
    }).join('') + '</div>', IC.target);
    h += card(t('Amaliy mock kunlari', 'Practice mock days'), '<div class="ms-mocks">' + C.mockDays.map(function (d, i) { return '<button class="ms-mock' + (d < td ? ' past' : '') + '" data-go="mission/day/' + d + '"><b>' + t('Mock ' + (i + 1), 'Mock ' + (i + 1)) + '</b><span>' + esc(fmtD(d)) + '</span></button>'; }).join('') + '</div>' +
      '<p class="hint">' + esc(t("Mock platforma materiallaridan yig'iladi (3 ta platforma matni, Target Listening 1 testi, Writing T1+T2, Speaking). Bu — amaliy natija; rasmiy IELTS formatidagi 40 savollik testni (masalan, rasmiy kitobdan) ishlasangiz, kitobning o'z jadvali bo'yicha bandni \"tasdiqlangan konversiya\" sifatida yozing.", 'Mocks are built from platform material (3 platform passages, a Target Listening 1 test, Writing T1+T2, Speaking). That is a practice result; if you take an official-format 40-question test (e.g. from an official book), log the band from that book\'s own table as a "verified conversion".')) + '</p>', IC.calendar);
    /* natija qo'shish */
    var f = '<form class="ms-form" id="resForm"><div class="ms-frow"><label class="field"><span>' + t('Turi', 'Kind') + '</span><select class="input" name="kind"><option value="practice">' + esc(KINDL('practice')) + '</option><option value="estimate">' + esc(KINDL('estimate')) + '</option><option value="verified">' + esc(KINDL('verified')) + '</option><option value="official">' + esc(KINDL('official')) + '</option></select></label>' +
      '<label class="field"><span>' + t('Sana', 'Date') + '</span><input class="input" type="date" name="date" value="' + td + '"></label><label class="field"><span>' + t('Manba', 'Source') + '</span><input class="input" name="source" maxlength="160" placeholder="' + esc(t('masalan: Mock 1 · Reading 3 matn', 'e.g. Mock 1 · Reading 3 passages')) + '"></label></div>' +
      '<div class="ms-frow" data-kind="practice"><label class="field"><span>Reading</span><input class="input" name="rR" placeholder="28/40"></label><label class="field"><span>Listening</span><input class="input" name="rL" placeholder="31/40"></label><label class="field"><span>Writing</span><input class="input" name="rW" placeholder="' + esc(t('o\'z bahosi', 'self')) + '"></label><label class="field"><span>Speaking</span><input class="input" name="rS"></label></div>' +
      '<div class="ms-frow" data-kind="band" hidden>' + ['L', 'R', 'W', 'S'].map(function (k) { return '<label class="field"><span>' + k + ' (0–9, 0.5)</span><input class="input" name="' + k + '" inputmode="decimal" placeholder="—"></label>'; }).join('') + '</div>' +
      '<label class="field"><span>' + t('Izoh', 'Notes') + '</span><input class="input" name="notes" maxlength="600"></label><p class="hint" id="resHint"></p><div class="ms-acts"><button class="btn btn-primary btn-sm" type="submit">' + IC.check + t('Saqlash', 'Save') + '</button></div></form>';
    h += card(t("Natija qo'shish", 'Log a result'), f, IC.plus);
    var rs = M().results.list();
    h += card(t('Natijalar tarixi', 'Result history'), rs.length ? '<div class="ms-res">' + rs.map(function (r) { return resRow(r).replace('</div>', '') + '<button class="btn btn-quiet btn-sm" data-resdel="' + esc(r.id) + '">' + IC.trash + '</button></div>'; }).join('') + '</div>' + compare(rs) : '<p class="hint">' + esc(t("Hali natija yo'q.", 'No results yet.')) + '</p>', IC.trend);
    h += card(t('Mashq tarixi (urinishlar)', 'Practice history (attempts)'), attemptsTable(), IC.clock);
    MOUNT = function () {
      var fm = $('#resForm'); if (!fm) return;
      var hint = function () {
        var k = fm.kind.value;
        fm.querySelector('[data-kind="practice"]').hidden = k !== 'practice'; fm.querySelector('[data-kind="band"]').hidden = k === 'practice';
        $('#resHint').textContent = { practice: t("Xom ball (to'g'ri/jami). Band emas.", 'Raw score (correct/total). Not a band.'), estimate: t("O'zingizning taxminiy bandingiz — rasmiy emas.", 'Your own estimated band — not official.'), verified: t("Rasmiy formatdagi test + o'sha manbaning konversiya jadvali (manbani yozing).", 'An official-format test converted with that source\'s own table (name the source).'), official: t('Faqat haqiqiy IELTS imtihoni natijasi (TRF).', 'Only a real IELTS exam result (TRF).') }[k];
      };
      fm.kind.addEventListener('change', hint); hint();
      fm.addEventListener('submit', function (e) {
        e.preventDefault();
        var k = fm.kind.value, o = { kind: k, date: fm.date.value, source: fm.source.value, notes: fm.notes.value };
        if (k === 'practice') { o.raw = {}; [['Reading', 'rR'], ['Listening', 'rL'], ['Writing', 'rW'], ['Speaking', 'rS']].forEach(function (x) { var v = fm[x[1]].value.trim(); if (v) o.raw[x[0]] = v.slice(0, 20); }); if (!Object.keys(o.raw).length) { toast(t('Kamida bitta ball kiriting', 'Enter at least one score'), 'warn'); return; } }
        else ['L', 'R', 'W', 'S'].forEach(function (x) { o[x] = fm[x].value.trim(); });
        try { M().results.add(o); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); }
        catch (er) { toast(er.message === 'band' ? t("Band 0–9, 0.5 qadam bilan", 'Band must be 0–9 in 0.5 steps') : t('Kamida bitta band kiriting', 'Enter at least one band'), 'warn'); }
      });
      $$('[data-resdel]').forEach(function (b) { b.addEventListener('click', function () { if (confirm(t("Natijani o'chirasizmi?", 'Delete this result?'))) { M().results.del(b.dataset.resdel); App.render(); } }); });
    };
    return h + '</div>';
  };
  function compare(rs) {
    var out = '';
    ['estimate', 'verified', 'official'].forEach(function (k) {
      var l = rs.filter(function (r) { return r.kind === k; }); if (l.length < 2) return;
      var first = l[l.length - 1], last = l[0];
      out += '<div class="ms-cmp"><b>' + esc(KINDL(k)) + '</b> ' + ['L', 'R', 'W', 'S'].map(function (x) { return first[x] != null && last[x] != null ? x + ' ' + first[x] + ' → ' + last[x] : ''; }).filter(Boolean).join(' · ') + '</div>';
    });
    return out ? '<div class="gc-l">' + t('Taqqoslash (bir xil turdagi birinchi → oxirgi)', 'Comparison (first → latest of the same kind)') + '</div>' + out : '';
  }
  function attemptsTable() {
    var a = M().M().attempts.slice(-25).reverse();
    if (!a.length) return '<p class="hint">' + esc(t("Hali urinish yo'q.", 'No attempts yet.')) + '</p>';
    var modeL = { practice: t('mashq', 'practice'), diagnostic: t('diagnostika', 'diagnostic'), mock: 'mock' };
    return '<div class="ms-att">' + a.map(function (x) {
      var sc = x.kind === 'writing' || x.kind === 'speaking' ? (x.score != null ? x.score + ' ' + t("(o'z bahosi)", '(self-estimate)') : '—') : (Math.round(x.score * 10) / 10) + ' / ' + x.total;
      return '<div><span>' + esc(fmtD(x.at)) + '</span><b>' + esc(skillName(x.skill || x.kind)) + '</b><small>' + esc(x.ref) + ' · ' + esc(modeL[x.mode] || x.mode || '') + '</small><b>' + sc + '</b></div>';
    }).join('') + '</div>';
  }

  /* ====================== PROFIL ======================================= */
  VIEWS.profile = function () {
    var pr = M().profile(), C = M().C();
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Profil — dalil asosida', 'Profile — evidence-based'), t("Har ko'nikma: nechta dalil, aniqlik, ishonch darajasi, kuchli va zaif tomonlar. Band ball qo'yilmaydi — faqat siz kiritgan tasdiqlangan/rasmiy natijalar band sifatida ko'rinadi.", 'Per skill: amount of evidence, accuracy, confidence, strengths and weaknesses. No band is assigned — only verified/official results you log appear as bands.')) + subnav('profile');
    var typeName = function (sk, k) {
      if (sk === 'grammar' && C.grammarCats[k]) return L(C.grammarCats[k].title);
      if (sk === 'listening') { var LT = { 'tl-test': 'Target Listening 1', 'own-test': t("O'z testlaringiz", 'Your own tests'), 'sec-form': 'Section 1 · form', 'sec-matching': 'Section 2 · matching', 'sec-mcq': 'Section 3 · MCQ', 'sec-notes': 'Section 4 · notes' }; if (LT[k]) return LT[k]; if (C.listenReasons[k]) return L(C.listenReasons[k]); }
      var q = window.ENG_BOOK && ENG_BOOK.qTypes[k]; return q ? L(q) : k;
    };
    ['reading', 'listening', 'grammar', 'vocab'].forEach(function (sk) {
      var p = pr[sk], s = M().strengths(sk);
      var b = '<div class="ms-prow">' + tile(t('Dalil', 'Evidence'), p.n, t('javob', 'answers')) + tile(t('Aniqlik', 'Accuracy'), pc(p.acc), p.recentAcc != null ? t("so'nggi 40: ", 'last 40: ') + pc(p.recentAcc) : '') + tile(t('Tendensiya', 'Trend'), p.earlyAcc != null && p.recentAcc != null ? pc(p.earlyAcc) + ' → ' + pc(p.recentAcc) : '—', p.earlyAcc == null ? t('kamida 50 javob kerak', 'needs 50+ answers') : '') + '</div>' + confChip(p.conf);
      if (p.n === 0) b += '<p class="hint">' + esc(t("Bu ko'nikma hali baholanmagan. Diagnostikadan boshlang.", 'This skill has not been assessed yet. Start with the diagnostic.')) + '</p>';
      var types = Object.keys(p.byType);
      if (types.length) b += '<div class="ms-types">' + types.map(function (k) { var v = p.byType[k]; return '<div><span>' + esc(typeName(sk, k)) + '</span><div class="bar"><i style="width:' + (v[0] / v[1] * 100) + '%"></i></div><b>' + Math.round(v[0] / v[1] * 100) + '% · ' + v[1] + '</b></div>'; }).join('') + '</div>';
      if (s.strong.length) b += '<p><b>' + t('Kuchli: ', 'Strong: ') + '</b>' + s.strong.map(function (r) { return esc(typeName(sk, r.t)); }).join(', ') + '</p>';
      if (s.weak.length) b += '<p><b>' + t('Zaif: ', 'Weak: ') + '</b>' + s.weak.map(function (r) { return esc(typeName(sk, r.t)) + ' (' + Math.round(r.acc * 100) + '%)'; }).join(', ') + '</p>';
      if (sk === 'listening') {
        var rs = {}; M().errors.list().forEach(function (e) { if (e.skill === 'listening' && e.cat) rs[e.cat] = (rs[e.cat] || 0) + (e.n || 1); });
        var rk = Object.keys(rs).sort(function (a, b2) { return rs[b2] - rs[a]; });
        if (rk.length) b += '<p><b>' + t('Xato sabablari: ', 'Miss reasons: ') + '</b>' + rk.map(function (k) { return esc(C.listenReasons[k] ? L(C.listenReasons[k]) : k) + ' ×' + rs[k]; }).join(', ') + '</p>';
      }
      if (sk === 'reading' && p.books) b += '<p class="hint">' + esc(t('Kitob ishi: ' + p.books + ' ta yozuv (kitob kaliti bilan o\'zingiz tekshirgan).', 'Book work: ' + p.books + ' entries (self-checked with the book key).')) + '</p>';
      h += card(skillName(sk), b, icon(sk));
    });
    var w = pr.writing, sp = pr.speaking;
    h += '<div class="ms-two">' + card('Writing', '<div class="ms-prow">' + tile(t('Baholangan ishlar', 'Assessed pieces'), w.n, t(w.pieces + ' ta jami', w.pieces + ' total')) + tile(t("Oxirgi o'z bahosi", 'Latest self-estimate'), w.lastSelf != null ? w.lastSelf.toFixed(1) : '—', t('rasmiy emas', 'not official')) + '</div>' + confChip(w.conf) + '<p class="hint">' + esc(t("O'z bahosi — taxmin. Ishonch faqat 2+ tashqi (sertifikatli) baho bilan yuqori bo'ladi.", 'Self-estimates are estimates. Confidence becomes high only with 2+ external (certified) marks.')) + '</p>', IC.pen) +
      card('Speaking', '<div class="ms-prow">' + tile(t('Baholangan sessiya', 'Assessed sessions'), sp.n, t(sp.recorded + ' ta yozuv', sp.recorded + ' recorded')) + '</div>' + confChip(sp.conf) + '<p class="hint">' + esc(t("Talaffuz faqat yozuv bo'lgan sessiyada baholanadi. Yozuvsiz — faqat ravonlik/lug'at/grammatika o'z kuzatuvi.", 'Pronunciation is only rated in recorded sessions. Without audio — self-observation of fluency/vocabulary/grammar only.')) + '</p>', IC.mic) + '</div>';
    h += card(t("Dastlabki ko'rsatkichlar (rasmiy emas)", 'Preliminary indicators (not official)'), '<ul class="ms-ul">' + pr.prelim.map(function (x) { return '<li><b>' + esc(skillName(x.skill)) + ':</b> ' + (x.kind === 'quiz' ? x.score + '/' + x.total + ' — ' : '') + esc(L(x.note)) + '</li>'; }).join('') + '</ul><p class="hint">' + esc(t("Bular siz bergan boshlang'ich ma'lumot; yangi dalil kelgach ustuvorlikka ta'siri kamayadi.", 'These came from you at the start; their influence fades as new evidence arrives.')) + '</p>', IC.doc);
    h += card(t('Keyingi qadamlar', 'Next steps'), recsPanel(), IC.bulb);
    MOUNT = null;
    return h + '</div>';
  };

  /* ====================== XATOLAR BANKI ================================ */
  var CATN = function (e) { var C = M().C(); return C.grammarCats[e.cat] ? L(C.grammarCats[e.cat].title) : C.listenReasons[e.cat] ? L(C.listenReasons[e.cat]) : C.readReasons[e.cat] ? L(C.readReasons[e.cat]) : C.writeCats[e.cat] ? L(C.writeCats[e.cat]) : (window.ENG_BOOK && ENG_BOOK.qTypes[e.cat] ? L(ENG_BOOK.qTypes[e.cat]) : (e.cat || '—')); };
  VIEWS.errors = function (parts, q) {
    if (parts[1] === 'review') return vReview(q);
    RV.list = null;   // bankdan qaytib kirilganda takror navbati yangidan yig'iladi
    var st = M().errors.stats(), sk = q.skill || '', list = M().errors.list().filter(function (e) { return !sk || e.skill === sk; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Xatolar banki', 'Error bank'), t("Har xato — keyingi o'rganish imkoniyati: javobingiz, to'g'ri javob, toifa, tushuntirish va keyingi takror sanasi.", 'Every error is a future learning opportunity: your answer, the correct one, the category, an explanation and the next review date.')) + subnav('errors');
    h += '<div class="stat-grid ms-stats">' + tile(t('Jami', 'Total'), st.total) + tile(t('Ochiq', 'Open'), st.open, null, st.open ? 'red' : '') + tile(t('Bugun takror', 'Due today'), st.due, null, st.due ? 'gold' : '') + tile(t('Qaytgan', 'Returned'), st.returned.length) + tile(t('Yaqinda tuzatilgan', 'Recently fixed'), st.fixedRecent.length, t('14 kun', '14 days')) + '</div>';
    h += '<div class="ms-acts"><button class="btn btn-primary" data-go="mission/errors/review"' + (st.due ? '' : ' disabled') + '>' + IC.refresh + t('Takrorni boshlash', 'Start review') + ' (' + st.due + ')</button></div>';
    h += '<div class="ms-two">' + card(t("Eng ko'p uchraydigan toifalar", 'Most common categories'), st.top.length ? '<div class="ms-hbars">' + st.top.slice(0, 8).map(function (r) { return '<div><span>' + esc(skillName(r.skill)) + ' · ' + esc(CATN(r)) + '</span><div class="bar"><i style="width:' + (r.n / st.top[0].n * 100) + '%"></i></div><b>' + r.open + ' / ' + r.n + '</b></div>'; }).join('') + '</div>' : '<p class="hint">—</p>', IC.trend) +
      card(t('Qaytgan va yangi tuzatilgan', 'Returned & recently fixed'), (st.returned.length ? '<p><b>' + t('Qaytgan: ', 'Returned: ') + '</b>' + st.returned.slice(0, 6).map(function (e) { return esc(CATN(e)); }).join(', ') + '</p>' : '') + (st.fixedRecent.length ? '<p><b>' + t('Tuzatilgan: ', 'Fixed: ') + '</b>' + st.fixedRecent.slice(0, 6).map(function (e) { return esc(CATN(e)); }).join(', ') + '</p>' : '') + (!st.returned.length && !st.fixedRecent.length ? '<p class="hint">—</p>' : ''), IC.check) + '</div>';
    var skills = ['', 'reading', 'listening', 'grammar', 'vocab', 'writing', 'speaking'];
    h += '<div class="ms-filter">' + skills.map(function (s) { return '<button class="seg' + (s === sk ? ' on' : '') + '" data-go="mission/errors' + (s ? '?skill=' + s : '') + '">' + esc(s ? skillName(s) : t('Hammasi', 'All')) + '</button>'; }).join('') + '</div>';
    h += card(t('Xatolar', 'Errors') + ' · ' + list.length, list.length ? list.slice(0, 120).map(errRow).join('') : '<p class="hint">' + esc(t("Xato yo'q. Mashqlarda xato qilganingizda shu yerda paydo bo'ladi.", 'No errors. Misses in practice appear here.')) + '</p>', IC.alert);
    MOUNT = null;
    return h + '</div>';
  };
  function errRow(e) {
    var sl = { open: t('ochiq', 'open'), fixed: t('tuzatildi', 'fixed'), returned: t('qaytdi', 'returned') }[e.status];
    return '<article class="ms-err s-' + esc(e.status) + '"><div class="ms-err-h"><span class="chip">' + esc(skillName(e.skill)) + ' · ' + esc(CATN(e)) + '</span><span class="ms-st st-' + (e.status === 'fixed' ? 'done' : 'todo') + '">' + esc(sl) + (e.n > 1 ? ' · ×' + e.n : '') + '</span><small>' + esc(fmtD(e.at)) + ' · ' + t('takror: ', 'review: ') + esc(e.srs ? fmtD(e.srs.due) : '—') + '</small></div>' +
      (e.q ? '<p class="ms-q">' + esc(e.q) + '</p>' : '') + '<div class="ms-ans">' + (e.resp ? '<span class="bad">' + esc(e.resp) + '</span>' : '') + (e.correct ? '<span class="good">' + esc(e.correct) + '</span>' : '') + '</div>' +
      (e.expl ? '<p class="hint">' + esc(e.expl) + '</p>' : '') + (e.follow ? '<button class="btn btn-quiet btn-sm" data-go="' + esc(e.follow) + '">' + IC.arrowR + t('Manbaga', 'Go to source') + '</button>' : '') + '</article>';
  }
  /* Takror sessiyasi: avval o'zingiz javob berasiz, keyin to'g'ri javob */
  var RV = { list: null, i: 0, shown: false, typed: '', done: 0 };
  function vReview() {
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Xatolar takrori', 'Error review'), t("Javobni ko'rmasdan oldin eslang. Natijani halol belgilang: mustaqil to'g'ri / qisman / xato.", 'Recall before you look. Mark the outcome honestly: independent / partial / wrong.')) + subnav('errors');
    if (!RV.list || RV.date !== M().today()) { RV = { list: M().errors.due().slice(0, 20).map(function (e) { return e.id; }), i: 0, shown: false, typed: '', done: 0, date: M().today() }; }
    var id = RV.list[RV.i], e = id ? M().M().errors[id] : null;
    if (!e) {
      h += card(t('Tugadi', 'Finished'), '<p>' + esc(t(RV.done + ' ta xato ko\'rib chiqildi. Keyingi takrorlar natijaga qarab rejalashtirildi.', RV.done + ' errors reviewed. Next reviews were scheduled from your results.')) + '</p><div class="ms-acts"><button class="btn btn-primary btn-sm" data-go="mission">' + t('Missiyaga', 'Back to mission') + '</button><button class="btn btn-ghost btn-sm" id="rvAgain">' + t('Yangilash', 'Refresh') + '</button></div>', IC.check);
      MOUNT = function () { var b = $('#rvAgain'); if (b) b.addEventListener('click', function () { RV.list = null; App.render(); }); markTask('review'); };
      return h + '</div>';
    }
    var b = '<p class="ms-count">' + (RV.i + 1) + ' / ' + RV.list.length + ' · ' + esc(skillName(e.skill)) + ' · ' + esc(CATN(e)) + (e.n > 1 ? ' · ' + t('takrorlangan ×', 'repeated ×') + e.n : '') + '</p>';
    b += '<p class="ms-q big">' + esc(e.q || t('(savol matni yo\'q)', '(no prompt text)')) + '</p>';
    b += '<label class="field"><span>' + t('Javobingiz (eslab yozing)', 'Your answer (from memory)') + '</span><input class="input" id="rvIn" value="' + esc(RV.typed) + '" autocomplete="off"' + (RV.shown ? ' disabled' : '') + '></label>';
    if (!RV.shown) b += '<div class="ms-acts"><button class="btn btn-primary btn-sm" id="rvShow">' + t('Tekshirish', 'Check') + '</button></div>';
    else {
      var auto = e.correct && M().norm(RV.typed) === M().norm(e.correct);
      b += '<div class="ms-ans"><span class="good">' + esc(e.correct || t('(to\'g\'ri javob yozilmagan — tushuntirishga qarang)', '(no stored answer — see explanation)')) + '</span>' + (e.resp ? '<span class="bad">' + t('avval: ', 'before: ') + esc(e.resp) + '</span>' : '') + '</div>' + (e.expl ? '<p class="hint">' + esc(e.expl) + '</p>' : '');
      if (auto) b += '<p class="ok-line">' + IC.check + t('Avtomatik: aynan mos keldi', 'Auto: exact match') + '</p>';
      b += '<div class="ms-acts"><button class="btn btn-primary btn-sm" data-rvo="independent">' + t("Mustaqil to'g'ri", 'Independent correct') + '</button><button class="btn btn-ghost btn-sm" data-rvo="partial">' + t('Qisman / yordam bilan', 'Partial / with help') + '</button><button class="btn btn-quiet btn-sm" data-rvo="wrong">' + t('Xato', 'Wrong') + '</button></div>' + (e.follow ? '<button class="btn btn-quiet btn-sm" data-go="' + esc(e.follow) + '">' + IC.arrowR + t('Mavzuni qayta ochish', 'Revisit the source') + '</button>' : '');
    }
    h += card(t('Takror', 'Review'), b, IC.refresh);
    MOUNT = function () {
      var inp = $('#rvIn'); if (inp && !RV.shown) { inp.focus(); inp.addEventListener('input', function () { RV.typed = inp.value; }); inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { RV.shown = true; App.render(); } }); }
      var s = $('#rvShow'); if (s) s.addEventListener('click', function () { RV.shown = true; App.render(); });
      $$('[data-rvo]').forEach(function (bb) { bb.addEventListener('click', function () { M().errors.review(id, bb.dataset.rvo); RV.i++; RV.done++; RV.shown = false; RV.typed = ''; App.render(); }); });
    };
    return h + '</div>';
  }

  /* Runnerdan keyin: missiya vazifasini "bajarildi" deb belgilash taklifi */
  function markTask(skill) {
    var x = null; try { x = JSON.parse(sessionStorage.getItem('uzla.msnTask') || 'null'); } catch (e) {}
    var rec = x && M().M().days[x.d], tk = rec && (rec.plan || []).filter(function (p) { return p.id === x.id; })[0];
    if (!tk || (skill && tk.skill !== skill && !(skill === 'grammar' && tk.skill === 'grammar'))) return false;
    var s = rec.tasks[x.id]; if (s && s.st === 'done') return false;
    var host = $('.ms-page'); if (!host || $('#msDoneAsk')) return false;
    var div = document.createElement('div'); div.id = 'msDoneAsk'; div.className = 'callout tip ms-doneask';
    div.innerHTML = '<span class="co-ic">' + IC.check + '</span><div>' + esc(t('Missiya vazifasi: ', 'Mission task: ') + L(tk.title)) + ' <button class="btn btn-primary btn-sm" id="msDoneYes">' + t('Bajarildi deb belgilash', 'Mark as done') + '</button> <button class="btn btn-quiet btn-sm" data-go="mission">' + t('Missiyaga qaytish', 'Back to mission') + '</button></div>';
    host.appendChild(div);
    $('#msDoneYes').addEventListener('click', function () { M().tasks.done(x.d, x.id); try { sessionStorage.removeItem('uzla.msnTask'); } catch (e) {} toast(t('Belgilandi', 'Marked done'), 'ok'); App.go('mission'); });
    return true;
  }

  /* ====================== KITOB ISHI =================================== */
  VIEWS.books = function () {
    var types = window.ENG_BOOK ? ENG_BOOK.qTypes : {};
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Kitob ishi', 'Book work'), t("Reading Explorer 4, Reading Accelerator yoki boshqa ruxsat etilgan kitob bilan ishlaganingizni yozing. Platformada bu kitoblarning matni YO'Q — siz o'z nusxangizdan ishlaysiz va kitobning o'z kaliti bilan tekshirasiz.", 'Log work done in Reading Explorer 4, Reading Accelerator or any other authorised book. The platform does NOT contain these books — you work from your own copy and check with the book\'s own key.')) + subnav('books');
    var f = '<form class="ms-form" id="bkForm"><div class="ms-frow"><label class="field"><span>' + t('Kitob', 'Book') + '</span><select class="input" name="book"><option value="re4">Reading Explorer 4</option><option value="ra">Reading Accelerator</option><option value="ielts">' + t('Rasmiy IELTS amaliyot kitobi', 'Official IELTS practice book') + '</option><option value="other">' + t('Boshqa', 'Other') + '</option></select></label>' +
      '<label class="field"><span>' + t('Unit / bo\'lim', 'Unit / section') + '</span><input class="input" name="unit" maxlength="60" placeholder="3A"></label><label class="field"><span>' + t('Sahifa', 'Pages') + '</span><input class="input" name="pages" maxlength="40"></label><label class="field"><span>' + t('Daqiqa', 'Minutes') + '</span><input class="input" name="min" inputmode="numeric"></label></div>' +
      '<div class="ms-frow"><label class="field"><span>' + t("To'g'ri", 'Correct') + '</span><input class="input" name="score" inputmode="numeric"></label><label class="field"><span>' + t('Jami savol', 'Total questions') + '</span><input class="input" name="total" inputmode="numeric"></label><label class="field"><span>' + t('Mavzu / nom', 'Title') + '</span><input class="input" name="title" maxlength="120"></label></div>' +
      '<div class="field"><span>' + t('Savol turlari', 'Question types') + '</span><div class="ms-checks">' + Object.keys(types).filter(function (k) { return ['form', 'map', 'table'].indexOf(k) < 0; }).map(function (k) { return '<label><input type="checkbox" name="types" value="' + k + '"> ' + esc(L(types[k])) + '</label>'; }).join('') + '<label><input type="checkbox" name="types" value="main idea"> Main idea</label><label><input type="checkbox" name="types" value="vocab in context"> Vocabulary in context</label><label><input type="checkbox" name="types" value="inference"> Inference</label></div></div>' +
      '<label class="field"><span>' + t("Xatolar va sababi (har biri yangi qatordan — xatolar bankiga tushadi)", 'Misses and why (one per line — they go to the error bank)') + '</span><textarea class="textarea" name="misses" rows="3"></textarea></label><div class="ms-acts"><button class="btn btn-primary btn-sm" type="submit">' + IC.check + t('Saqlash', 'Save') + '</button></div></form>';
    h += card(t("Yangi yozuv", 'New entry'), f, IC.plus);
    var l = M().books.list(), nm = { re4: 'Reading Explorer 4', ra: 'Reading Accelerator', ielts: 'IELTS', other: t('Boshqa', 'Other') };
    h += card(t('Jurnal', 'Log') + ' · ' + l.length, l.length ? '<div class="ms-att">' + l.map(function (b) { return '<div><span>' + esc(fmtD(b.at)) + '</span><b>' + esc(nm[b.book] || b.book) + ' ' + esc(b.unit) + '</b><small>' + esc(b.title) + (b.types.length ? ' · ' + esc(b.types.join(', ')) : '') + '</small><b>' + (b.total ? b.score + '/' + b.total : '—') + '</b></div>'; }).join('') + '</div>' : '<p class="hint">—</p>', IC.book);
    MOUNT = function () {
      var fm = $('#bkForm'); if (!fm) return;
      fm.addEventListener('submit', function (e) {
        e.preventDefault();
        var types2 = $$('input[name="types"]:checked', fm).map(function (x) { return x.value; });
        if (!fm.unit.value.trim() && !fm.title.value.trim()) { toast(t('Unit yoki nomni yozing', 'Enter a unit or title'), 'warn'); return; }
        var sc = fm.score.value.trim(), tot = fm.total.value.trim();
        if (sc !== '' && (tot === '' || Number(sc) > Number(tot))) { toast(t("To'g'ri soni jami sondan oshmasin", 'Correct cannot exceed total'), 'warn'); return; }
        var rec = M().books.add({ book: fm.book.value, unit: fm.unit.value, pages: fm.pages.value, min: fm.min.value, score: sc === '' ? NaN : sc, total: tot === '' ? NaN : tot, title: fm.title.value, types: types2, misses: fm.misses.value });
        fm.misses.value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 10).forEach(function (line, i) { M().errors.add({ skill: 'reading', src: 'book:' + rec.id, key: String(i), q: line, resp: '', correct: '', cat: 'locate', expl: t('Kitob ishidan', 'From book work'), follow: 'mission/books' }); });
        M().save(); toast(t('Saqlandi', 'Saved'), 'ok'); markTask('reading') || App.render();
      });
    };
    return h + '</div>';
  };

  /* ====================== O'Z TINGLASH TESTINI KIRITISH ================ */
  VIEWS.import = function () {
    var m = M().M(), list = Object.keys(m.custom).map(function (k) { return Object.assign({ id: k }, m.custom[k]); });
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t("O'z tinglash testingiz", 'Your own listening tests'), t("Sizning Section 1 amaliy testlaringiz yoki boshqa ruxsat etilgan test: kalitni kiriting, audio faylni (ixtiyoriy) yuklang — u faqat SHU brauzerda saqlanadi, serverga yuborilmaydi.", 'Your Section 1 practice tests or another authorised test: enter the key and (optionally) attach the audio — it is stored in THIS browser only, never uploaded.')) + subnav('tests');
    h += card(t("Yangi test", 'New test'), '<form class="ms-form" id="cuForm"><label class="field"><span>' + t('Nomi', 'Title') + '</span><input class="input" name="title" maxlength="80" required placeholder="Section 1 — Test 3"></label>' +
      '<label class="field"><span>' + t("Kalit: har javob alohida qatorda yoki vergul bilan (muqobil javob — '/' bilan)", "Key: one answer per line or comma-separated (alternatives with '/')") + '</span><textarea class="textarea" name="key" rows="5" required placeholder="Okonkwo&#10;45&#10;Tuesday / Tues"></textarea></label>' +
      filePick('cuAudio', 'audio/*', t('Audio fayl (ixtiyoriy)', 'Audio file (optional)')) + '<div class="ms-acts"><button class="btn btn-primary btn-sm" type="submit">' + IC.check + t('Saqlash', 'Save') + '</button></div></form>', IC.plus);
    h += card(t('Testlar', 'Tests') + ' · ' + list.length, list.length ? list.map(function (c) { return '<div class="ms-drow"><span class="ms-ic">' + IC.headphones + '</span><div><b>' + esc(c.title) + '</b><small>' + c.key.length + t(' savol', ' questions') + (c.audio ? ' · ' + t('audio bor', 'audio attached') : '') + (M().attempted('cu:' + c.id) ? ' · ' + t('ishlangan', 'done') : '') + '</small></div><button class="btn btn-primary btn-sm" data-go="mission/run/custom/' + esc(c.id) + '">' + t('Ochish', 'Open') + '</button><button class="btn btn-quiet btn-sm" data-cudel="' + esc(c.id) + '">' + IC.trash + '</button></div>'; }).join('') : '<p class="hint">—</p>', IC.headphones);
    MOUNT = function () {
      var fm = $('#cuForm'); if (!fm) return;
      fm.addEventListener('submit', function (e) {
        e.preventDefault();
        var key = fm.key.value.split(/\n|,/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 60);
        if (!key.length) { toast(t('Kalit bo\'sh', 'The key is empty'), 'warn'); return; }
        var id = 'c' + Date.now().toString(36), f = $('#cuAudio').files[0];
        m.custom[id] = { title: fm.title.value.trim().slice(0, 80), key: key, audio: !!f, at: Date.now() };
        var fin = function () { M().save(); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); };
        if (f && window.MissionMedia) MissionMedia.put('cu:' + id, f).then(fin, function () { m.custom[id].audio = false; fin(); toast(t("Audio saqlanmadi (brauzer xotirasi)", 'Audio not stored (browser storage)'), 'warn'); });
        else fin();
      });
      $$('[data-cudel]').forEach(function (b) { b.addEventListener('click', function () { if (!confirm(t("Testni o'chirasizmi? (natijalar tarixda qoladi)", 'Delete this test? (results stay in history)'))) return; delete m.custom[b.dataset.cudel]; if (window.MissionMedia) MissionMedia.del('cu:' + b.dataset.cudel); M().save(); App.render(); }); });
    };
    return h + '</div>';
  };

  /* ====================== SOZLAMALAR =================================== */
  VIEWS.settings = function () {
    var s = M().M().settings, iv = M().ivls();
    var h = '<div class="page stagger ms-page">' + head('IELTS Mission', t('Sozlamalar', 'Settings'), '') + subnav('home');
    h += card(t('Takror oraliqlari (kun)', 'Review intervals (days)'), '<form class="ms-form" id="ivForm"><label class="field"><span>' + t("Vergul bilan, o'sib boruvchi (standart 1, 3, 7, 14). Natijaga qarab moslashadi: xato → ertaga, 3 marta ketma-ket mustaqil → bir qadam o'tkazib.", 'Comma-separated, increasing (default 1, 3, 7, 14). Adapts to results: wrong → tomorrow, 3 independent in a row → skip a step.') + '</span><input class="input" name="iv" value="' + esc(iv.join(', ')) + '"></label><div class="ms-acts"><button class="btn btn-primary btn-sm">' + t('Saqlash', 'Save') + '</button><button class="btn btn-quiet btn-sm" type="button" id="ivReset">' + t('Standart', 'Default') + '</button></div></form>', IC.refresh);
    h += card(t('Kunlik hajm', 'Daily workload'), '<p>' + esc(t('Joriy: ', 'Current: ') + (s.mode === 'custom' ? s.custom + ' ' + t('daq (boshqa)', 'min (custom)') : s.mode + ' ' + t('daq', 'min'))) + '</p><p class="hint">' + esc(t("Bugungi sahifadagi tugmalar bilan almashtiriladi; o'zgarish bugungi rejani qayta quradi (bajarilganlar saqlanadi).", "Change it with the buttons on Today's page; it rebuilds today's plan (finished tasks are kept).")) + '</p>', IC.clock);
    h += card(t("Ma'lumot xavfsizligi", 'Data safety'), '<p class="hint">' + esc(t("Missiya birinchi ochilganda butun holatingizning mahalliy zaxirasi olingan (uzla.state.backup.mission-v1). Missiya ma'lumoti alohida kalitda — boshqa kurslar progressiga tegmaydi.", 'When the mission first opened, a local backup of your whole state was saved (uzla.state.backup.mission-v1). Mission data lives in its own key — other course progress is untouched.')) + '</p><button class="btn btn-quiet btn-sm" id="msReset">' + IC.trash + t("Faqat Mission ma'lumotini tozalash…", 'Reset Mission data only…') + '</button>', IC.lock);
    MOUNT = function () {
      var fm = $('#ivForm'); if (fm) fm.addEventListener('submit', function (e) { e.preventDefault(); var v = fm.iv.value.split(',').map(function (x) { return Math.round(Number(x)); }).filter(function (x) { return x > 0 && x <= 90; }); var okInc = v.every(function (x, i) { return !i || x > v[i - 1]; }); if (v.length < 2 || !okInc) { toast(t("Kamida 2 ta o'sib boruvchi son (1–90)", 'At least 2 increasing numbers (1–90)'), 'warn'); return; } s.ivls = v; M().save(); toast(t('Saqlandi', 'Saved'), 'ok'); App.render(); });
      var r = $('#ivReset'); if (r) r.addEventListener('click', function () { s.ivls = null; M().save(); App.render(); });
      var rs = $('#msReset'); if (rs) rs.addEventListener('click', function () {
        if (!confirm(t("Faqat IELTS Mission ma'lumoti (rejalar, urinishlar, xatolar banki, Studio ishlari) o'chadi. Boshqa kurslar va eski ingliz tili progressi saqlanadi. Davom etasizmi?", 'Only IELTS Mission data (plans, attempts, error bank, Studio work) will be removed. Other courses and earlier English progress are kept. Continue?'))) return;
        if ((prompt(t("Tasdiqlash uchun MISSION deb yozing", 'Type MISSION to confirm')) || '').trim().toUpperCase() !== 'MISSION') return;
        try { localStorage.setItem('uzla.mission.backup.' + Date.now(), JSON.stringify(M().M())); } catch (e) {}
        Store.all().mission = null; M().M(); M().save(); toast(t('Tozalandi (zaxira saqlandi)', 'Reset (a backup was kept)'), 'ok'); App.go('mission');
      });
    };
    return h + '</div>';
  };

  /* ====================== DISPATCH ===================================== */
  window.MissionUI = { VIEWS: VIEWS, head: head, subnav: subnav, card: card, tile: tile, t: t, pc: pc, qs: qs, skillName: skillName, confChip: confChip, icon: icon, fmtD: fmtD, markTask: markTask,
    setMount: function (fn) { MOUNT = fn; } };
  window.PageMission = function (path) {
    if (!window.Mission || !window.MISSION_CFG) return '<div class="page"><p>Mission not loaded.</p></div>';
    var raw = String(path || ''), qi = raw.indexOf('?'), base = qi < 0 ? raw : raw.slice(0, qi), q = qs(qi < 0 ? '' : raw.slice(qi + 1));
    var parts = base.split('/').filter(Boolean), v = VIEWS[parts[0] || 'home'] || VIEWS.home;
    MOUNT = null;
    try { return v(parts, q); }
    catch (e) { MOUNT = null; if (window.console) console.error(e); return '<div class="page"><div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(t('Sahifani ochishda xato: ', 'Could not open this page: ') + e.message) + '</div></div></div>'; }
  };
  window.PageMission.mount = function () { if (MOUNT) { try { MOUNT(); } catch (e) { if (window.console) console.error(e); } } };
})();
