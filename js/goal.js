/* ==========================================================================
   Goal · Debt · Notify — maqsad xaritasi, qarz kunlari, bildirishnoma
   --------------------------------------------------------------------------
   GOAL   — 0 dan ekspertgacha sanali bosqichlar. Har bosqichning holati
            saqlangan progressdan HISOBLANADI (qo'lda belgilanmaydi).
   DEBT   — o'tgan kunlardan nechtasi bajarilmagan (intizom jadvali to'liq
            emas). Har qarz kuni maqsad sanalarini 1 kunga SURADI — "qilmagan
            sari kunlar uzayadi". Qarz darajasiga qarab roast keskinlashadi.
   NOTIFY — brauzer bildirishnomasi (ruxsat so'raladi). Sahifa ochiq
            bo'lganda ishlaydi: ertalab bugungi reja, 20:00 da ogohlantirish,
            21:00 da roast (agar kun bajarilmagan bo'lsa). Kuniga bir marta.
   ========================================================================== */
(function () {
  'use strict';

  /* ====================== MAQSAD XARITASI ============================== */
  var BASE = [
    { k: 'kickoff',    date: '2026-09-20', t: { uz: 'RASMIY START — kickoff: Python 1-kun, DataCamp 1-kun', en: 'OFFICIAL START — kickoff: Python day 1, DataCamp day 1' }, track: 'coding', hard: true },
    { k: 'eng-start',  date: '2026-09-21', t: { uz: 'Ingliz tili: 1-kun (140 kunlik kurs)', en: 'English: day 1 (140-day course)' },      track: 'english' },
    { k: 'py-start',   date: '2026-09-20', t: { uz: 'Python: 1-dars (har kuni)', en: 'Python: lesson 1 (daily)' },   track: 'coding' },
    { k: 'writing',    date: '2026-10-01', t: { uz: 'Writing chuqur kursi boshlandi', en: 'Writing deep course begins' }, track: 'english' },
    { k: 'dc-track',   date: '2026-10-05', t: { uz: 'DataCamp: Python Programming Fundamentals treki tugadi (4 kurs + loyiha)', en: 'DataCamp: Python Programming Fundamentals track done (4 courses + project)' }, track: 'coding', hard: true },
    { k: 'cbook',      date: '2026-10-04', t: { uz: "Lug'at: C-book 15 kun × 40 so'z = 600 so'z daftarda", en: 'Vocabulary: C-book 15 days × 40 words = 600 words in the copybook' }, track: 'english' },
    { k: 'ess4',       date: '2026-10-05', t: { uz: "Lug'at: 4000 Essential Words 4 boshlandi (kuniga 2 unit)", en: 'Vocabulary: 4000 Essential Words 4 begins (2 units a day)' }, track: 'english' },
    { k: 'py-end',     date: '2026-10-19', t: { uz: 'PYTHON KURSI TUGADI (30/30) — muddat', en: 'PYTHON COURSE DONE (30/30) — deadline' }, track: 'coding', hard: true },
    { k: 'speak30',    date: '2026-10-20', t: { uz: 'Speaking 30 kun — trek tugadi', en: 'Speaking 30 — track complete' }, track: 'english' },
    { k: 'mock1',      date: '2026-10-18', t: { uz: '1-mock (28-kun): boshlang\'ich nuqta', en: 'Mock 1 (day 28): baseline' }, track: 'english' },
    { k: 'dc1',        date: '2026-11-15', t: { uz: 'DataCamp 2-bosqich: NumPy · pandas · OOP', en: 'DataCamp phase 2: NumPy · pandas · OOP' }, track: 'coding' },
    { k: 'mock2',      date: '2026-11-15', t: { uz: '2-mock (56-kun): 6.5 kutiladi', en: 'Mock 2 (day 56): 6.5 expected' }, track: 'english' },
    { k: 'dc2',        date: '2026-11-30', t: { uz: 'DataCamp 3-bosqich: AI nazariyasi', en: 'DataCamp phase 3: AI theory' }, track: 'coding' },
    { k: 'mock3',      date: '2026-12-13', t: { uz: '3-mock (84-kun): 7.0 kutiladi', en: 'Mock 3 (day 84): 7.0 expected' }, track: 'english' },
    { k: 'mock4',      date: '2027-01-10', t: { uz: '4-mock (112-kun): 7.5 kutiladi', en: 'Mock 4 (day 112): 7.5 expected' }, track: 'english' },
    { k: 'dc4',        date: '2027-01-20', t: { uz: 'DataCamp 4-bosqich: OpenAI API · LangChain · agentlar', en: 'DataCamp phase 4: OpenAI API · LangChain · agents' }, track: 'coding' },
    { k: 'dc5',        date: '2027-02-05', t: { uz: 'DataCamp sertifikat + 1-loyiha GitHub\'da', en: 'DataCamp certificate + project 1 on GitHub' }, track: 'coding' },
    { k: 'eng-end',    date: '2027-02-07', t: { uz: 'Ingliz tili kursi tugadi (140/140)', en: 'English course complete (140/140)' }, track: 'english' },
    { k: 'ielts',      date: '2027-02-20', t: { uz: 'IELTS IMTIHONI — maqsad 8.0', en: 'IELTS EXAM — target 8.0' }, track: 'english', hard: true },
    { k: 'ielts-res',  date: '2027-03-05', t: { uz: 'IELTS natijasi', en: 'IELTS result' }, track: 'english' },
    { k: 'apply',      date: '2027-04-01', t: { uz: 'Ishga arizalar boshlanadi (junior AI/Python)', en: 'Job applications begin (junior AI/Python)' }, track: 'career' },
    { k: 'portfolio',  date: '2027-04-15', t: { uz: 'Portfolio: 3 ishlaydigan loyiha (GitHub)', en: 'Portfolio: 3 working projects (GitHub)' }, track: 'coding' },
    { k: 'masters',    date: '2027-05-01', t: { uz: 'Magistratura / grant arizalari (IELTS 8.0 bilan)', en: 'Master\'s / scholarship applications (with IELTS 8.0)' }, track: 'career' },
    { k: 'job',        date: '2027-06-01', t: { uz: 'BIRINCHI ISH — junior AI Engineer / Python dev', en: 'FIRST JOB — junior AI Engineer / Python dev' }, track: 'career', hard: true },
    { k: 'lvC',        date: '2028-03-31', t: { uz: 'C daraja: Data Scientist / ML (ish bilan parallel)', en: 'Level C: Data Scientist / ML (alongside work)' }, track: 'career' },
    { k: 'mid',        date: '2028-09-01', t: { uz: 'Mid-level AI Engineer', en: 'Mid-level AI Engineer' }, track: 'career' },
    { k: 'expert',     date: '2030-06-01', t: { uz: 'EKSPERT: senior / MLOps / ochiq manba', en: 'EXPERT: senior / MLOps / open source' }, track: 'career', hard: true }
  ];

  function status(k) {
    var today = Store.dateKey();
    switch (k) {
      case 'kickoff':   return today >= '2026-09-20' ? 'done' : 'todo';
      case 'eng-start': return Store.engDoneCount() >= 1 || today > '2026-09-21' ? 'done' : 'todo';
      case 'py-start':  return Store.doneCount() >= 1 ? 'done' : 'todo';
      case 'py-end':    return Store.doneCount() >= COURSE.length ? 'done' : 'todo';
      case 'writing':   return today >= '2026-10-01' ? 'done' : 'todo';
      case 'dc-track':  return window.DataCamp && DataCamp.doneCount() >= DataCamp.total() ? 'done' : 'todo';
      case 'cbook':     return Store.copyList('vocab').length >= 600 ? 'done' : 'todo';
      case 'ess4':      return today >= '2026-10-05' ? 'done' : 'todo';
      case 'speak30':   return Store.speakDoneCount() >= 30 ? 'done' : 'todo';
      case 'dc1': return Store.planDone('phase2') ? 'done' : 'todo';
      case 'dc2': return Store.planDone('phase3') ? 'done' : 'todo';
      case 'dc4': return Store.planDone('phase4') ? 'done' : 'todo';
      case 'dc5': return Store.planDone('phase5') ? 'done' : 'todo';
      case 'eng-end':   return Store.engDoneCount() >= ENGLISH.meta.days ? 'done' : 'todo';
      case 'mock1':     return !!Store.engScore(28) ? 'done' : 'todo';
      case 'mock2':     return !!Store.engScore(56) ? 'done' : 'todo';
      case 'mock3':     return !!Store.engScore(84) ? 'done' : 'todo';
      case 'mock4':     return !!Store.engScore(112) ? 'done' : 'todo';
      default: return 'todo';
    }
  }

  /* ====================== QARZ KUNLARI ================================== */
  function debtDays() {
    if (!window.HabitPlan) return { days: 0, list: [] };
    var today = Store.dateKey(), list = [];
    var from = HABIT.meta.official || HABIT.meta.from;   // sinov kunlari (17–19-sen) qarzga kirmaydi
    if (today <= from) return { days: 0, list: [] };
    var cursor = from;
    while (cursor < today) {
      if (HabitPlan.inRange(cursor)) {
        var plan = HabitPlan.forDate(cursor);
        if (!HabitPlan.isDayDone(plan)) list.push(cursor);
      }
      cursor = Store.shiftDays(cursor, 1);
    }
    /* Chegara: qarz ko'pi bilan HABIT.meta.debtCap (3) kun. Undan ortiq
       to'planmaydi — bosqichlar 3 kundan ko'p surilmaydi, roast darajasi
       o'smaydi, xabarnoma har kuni og'irlashmaydi. Ro'yxatda faqat eng
       so'nggi qarz kunlari qoladi (eng eskilarini "kechirib" yuboramiz),
       chunki 10 kun oldingi bo'shliqni bugun to'ldirib bo'lmaydi.        */
    var cap = (HABIT.meta && HABIT.meta.debtCap) || 3;
    if (list.length > cap) list = list.slice(-cap);
    return { days: list.length, list: list, capped: list.length >= cap };
  }
  function debtLevel(n) { return n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 10 ? 3 : 4; }

  window.Goal = {
    milestones: function () {
      var d = debtDays().days;
      return BASE.map(function (m) {
        var st = status(m.k);
        /* Bajarilmagan bosqich sanasi qarz kunlariga suriladi */
        var shifted = (st === 'done' || m.date < Store.dateKey()) ? m.date : Store.shiftDays(m.date, d);
        return { k: m.k, base: m.date, date: shifted, shift: shifted === m.date ? 0 : d, t: m.t, track: m.track, hard: !!m.hard, status: st };
      }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    },
    next: function () {
      var today = Store.dateKey();
      var list = Goal.milestones().filter(function (m) { return m.status !== 'done' && m.date >= today; });
      return list[0] || null;
    },
    nextLabel: function () {
      var n = Goal.next();
      if (!n) return '';
      var days = Math.round((new Date(n.date + 'T00:00:00') - new Date(Store.dateKey() + 'T00:00:00')) / 86400000);
      return L(n.t) + ' · ' + tr('goalInDays', { n: days });
    },
    debt: debtDays,
    debtLevel: debtLevel,
    /* TIKLANISH REJASI — qarz chegaraga yetganda (spiral emas, yo'l):
       1) bugungi yadro bloklari, 2) muddati o'tgan takrorlar, 3) ochiq
       topshiriqlar, 4) eski kunlarning bajarilmagan darslarini QAYTA
       rejalashtirmaslik — eng eskisi arxivga (kechiriladi), 5) ixtiyoriylar
       kechiktiriladi. Qarz yo'q bo'lsa null.                                */
    /* Tartib spec §16 bo'yicha:
         1 muddati o'tgan / muhim  2 o'qituvchi topshirig'i  3 majburiy takror
         4 yaqin muddat            5 odatiy ish              6 ixtiyoriy
       Har qadam FAQAT haqiqatan ish bo'lsa chiqadi — bo'sh ro'yxat yo'q.  */
    recovery: function () {
      var d = debtDays(); if (!d.days) return null;
      var cap = (HABIT.meta && HABIT.meta.debtCap) || 3;
      var due = window.Review ? Review.dueCount() : 0;
      var mis = Store.openMistakes().length;
      var all = window.Ctrl && Ctrl.openAssignments ? Ctrl.openAssignments() : [];
      var overdue = all.filter(function (a) { return a.st === 'overdue'; }).length;
      var asg = all.length - overdue;
      var steps = [
        overdue ? tr('rcStepOverdue', { n: overdue }) : null,   // 1 muddati o'tgan
        asg ? tr('rcStep3', { n: asg }) : null,                  // 2 o'qituvchi topshirig'i
        due ? tr('rcStep2', { n: due }) : null,                  // 3 majburiy takror
        mis ? tr('rcStep4', { n: mis }) : null,                  // 4 ochiq xatolar
        tr('rcStep1'),                                           // 5 bugungi yadro
        tr('rcStep5'),                                           // 6 ixtiyoriylarni o'tkazib yuborish
        d.capped ? tr('rcStep6', { n: cap }) : null
      ].filter(Boolean);
      return { days: d.days, capped: d.capped, overdue: overdue, assignments: asg, due: due, mistakes: mis,
               title: tr('rcTitle', { n: d.days }), lede: tr(d.capped ? 'rcLedeCap' : 'rcLede', { n: cap }), steps: steps };
    },
    /* Roast — qarz darajasiga qarab, tasodifiy */
    roast: function (level) {
      var arr = STRINGS[Store.get('lang')]['roast' + level] || [];
      if (!arr.length) return '';
      /* Har kun boshqa gap: kun raqami + qarz kunlari bo'yicha — takror kam */
      var dayN = Math.floor(Date.now() / 86400000);
      var i = (dayN + debtDays().days) % arr.length;
      return arr[i];
    },
    /* Bugungi talab: ingliz 240 daq har kuni; coding 240 (og'ir) / 120 (LC), yakshanba 0 */
    required: function (key) {
      key = key || Store.dateKey();
      var type = window.HabitPlan ? HabitPlan.typeOf(key) : 'heavy';
      var pyMonth = window.HabitPlan && HabitPlan.pyDayOf(key) > 0;
      var s = Store.all().settings || {};
      var eng = s.targetEng || 240, heavy = s.targetCodeHeavy || 240, cls = s.targetCodeClass || 120;
      return { eng: eng, code: type === 'rest' ? (pyMonth ? 60 : 0) : type === 'class' ? cls : heavy };
    },
    /* Bugungi bajarilgan daqiqalar: jadvaldagi belgilangan bloklardan */
    doneMinutes: function (key) {
      key = key || Store.dateKey();
      var out = { eng: 0, code: 0 };
      if (!window.HabitPlan || !HabitPlan.inRange(key)) return out;
      var plan = HabitPlan.forDate(key);
      plan.blocks.forEach(function (b) {
        if (!Store.habitBlock(key, b.id)) return;
        /* Uy vazifasi bloklari: sarlavhasida Python bo'lsa — coding */
        var isPyHw = b.kind === 'hw' && /Python/.test((b.t && b.t.en) || '');
        if (b.kind === 'py' || b.kind === 'dc' || isPyHw) out.code += b.min;
        else if (/^(eng|hw|lc|speak|review)$/.test(b.kind)) out.eng += b.min;
      });
      var manual = Store.hoursOf(key);
      out.eng += manual.eng || 0; out.code += manual.code || 0;
      return out;
    }
  };

  /* ====================== BILDIRISHNOMA ================================ */
  function can() { return 'Notification' in window; }
  function granted() { return can() && Notification.permission === 'granted'; }
  function onceKey(tag) { return 'uzla.notif.' + Store.dateKey() + '.' + tag; }
  function fire(tag, title, body) {
    if (!granted()) return false;
    try { if (localStorage.getItem(onceKey(tag))) return false; } catch (e) {}
    try {
      new Notification(title, { body: body, icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5.5" fill="#1c2233"/><path d="M4 18 L9 8 L13 14 L20 5" stroke="#f0384e" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="5" r="2.2" fill="#f0384e"/></svg>'), tag: 'uzla-' + tag });
      localStorage.setItem(onceKey(tag), '1');
    } catch (e) {}
    return true;
  }

  function check() {
    if (!Store.setting('notify')) return;
    var key = Store.dateKey();
    if (!window.HabitPlan || !HabitPlan.inRange(key)) return;
    var h = new Date().getHours();
    var req = Goal.required(key), done = Goal.doneMinutes(key);
    var debt = debtDays().days;
    var plan = HabitPlan.forDate(key);
    var engDay = plan.engDay;

    /* Ertalab: bugungi reja */
    if (h >= 5 && h < 12) {
      var parts = [tr('notifEng', { m: req.eng })];
      if (req.code) parts.push(tr('notifCode', { m: req.code }));
      if (engDay && window.Eng && Eng.dayOf(engDay)) parts.push(tr('day') + ' ' + engDay + ' · ' + L(Eng.dayOf(engDay).title));
      fire('morning', tr('notifMorningT'), parts.join(' · ') + (debt ? ' · ' + tr('notifDebt', { n: debt }) : ''));
    }
    /* 17:00 — o'rtacha tekshiruv */
    if (h >= 17 && h < 20 && (done.eng < req.eng * 0.5 || done.code < req.code * 0.5)) {
      fire('afternoon', tr('notifBehindT'), tr('notifBehind', { e: done.eng, E: req.eng, c: done.code, C: req.code }));
    }
    /* 20:00 — ogohlantirish */
    if (h >= 20 && h < 21 && (done.eng < req.eng || done.code < req.code)) {
      fire('evening', tr('notifLateT'), tr('notifLate', { e: req.eng - done.eng, c: Math.max(0, req.code - done.code) }));
    }
    /* 21:00+ — roast */
    if (h >= 21 && (done.eng < req.eng || done.code < req.code)) {
      fire('roast', tr('notifRoastT'), Goal.roast(Math.max(1, debtLevel(debt + 1))));
    }
  }

  window.Notify = {
    can: can, granted: granted,
    request: function () {
      if (!can()) return Promise.resolve('unsupported');
      return Notification.requestPermission();
    },
    check: check,
    init: function () {
      check();
      setInterval(check, 15 * 60 * 1000);
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); });
    },
    test: function () {
      if (!granted()) return false;
      try { new Notification(tr('notifTestT'), { body: Goal.roast(2) }); } catch (e) {}
      return true;
    }
  };
})();
