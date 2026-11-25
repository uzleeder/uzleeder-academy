/* ==========================================================================
   OS.CFG — Personal OS markaziy sozlamasi (YAGONA MANBA)
   Personal OS central configuration (SINGLE SOURCE OF TRUTH)
   --------------------------------------------------------------------------
   Missiya sanalari, maqsad ball, bosqichlar va navigatsiya SHU YERDA.
   Boshqa modullar sanalarni o'zida saqlamaydi — shu fayldan o'qiydi.

   Audit (docs/PERSONAL-OS-AUDIT.md §9 A6) ko'rsatdi: sanalar to'rtta faylda
   takrorlangan edi (data/mission.js, data/phases.js, data/english.js,
   data/habit.js). Endi ular HOSILA: OS.CFG asosiy, qolgani undan keladi.

   Kalendar (brief, 2026-11-25):
     Pre-launch         26–30 noyabr 2026
     Asosiy ijro        1 dekabr 2026 – 31 yanvar 2027
     Yakuniy mustahkam  1–19 fevral 2027
     IELTS Academic     20 fevral 2027
     Maqsad             Overall 7.5 (ko'nikmalar sozlanadi)

   MUHIM: bu reja, kafolat emas. Hech qaysi ball oldindan va'da qilinmaydi.
   ========================================================================== */
(function () {
  'use strict';

  /* --- kichik sana yordamchilari (UTC, mahalliy vaqt zonasi ta'sir qilmasin) --- */
  function parse(iso) {
    var p = String(iso).split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]);
  }
  function key(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(d.getUTCDate()).padStart(2, '0');
  }
  function addDays(iso, n) { return key(parse(iso) + n * 86400000); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  /* Bugun — MAHALLIY kalendar kuni (foydalanuvchi ko'rgan sana), UTC kalitida */
  function todayKey(now) {
    var d = now ? new Date(now) : new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /* ====================== KALENDAR ===================================== */
  var PHASES = [
    {
      key: 'prelaunch', n: 0,
      from: '2026-11-26', to: '2026-11-30',
      title: { uz: 'Pre-launch', en: 'Pre-launch' },
      focus: {
        uz: 'Boshlangʼich oʻlchov: diagnostika, mock, resurslarni tayyorlash. Ball emas — dalil.',
        en: 'Baseline measurement: diagnostic, mock, resource setup. Not a score — evidence.'
      }
    },
    {
      key: 'main', n: 1,
      from: '2026-12-01', to: '2027-01-31',
      title: { uz: 'Asosiy ijro', en: 'Main execution' },
      focus: {
        uz: 'Kunlik ish: lugʻat, oʻqish, tinglash, yozish, gapirish, grammatika, Python.',
        en: 'Daily work: vocabulary, reading, listening, writing, speaking, grammar, Python.'
      }
    },
    {
      key: 'final', n: 2,
      from: '2027-02-01', to: '2027-02-19',
      title: { uz: 'Yakuniy mustahkamlash', en: 'Final consolidation' },
      focus: {
        uz: 'Zaif joyni tuzatish, vaqtli mashq, mock, xatolar daftari, dam va uyqu.',
        en: 'Weak-skill repair, timed practice, mocks, error log, rest and sleep.'
      }
    }
  ];

  var CFG = {
    version: 1,

    mission: {
      id: 'ielts-2027-02',
      title: { uz: 'IELTS Academic 7.5', en: 'IELTS Academic 7.5' },
      /* Butun missiya oynasi: pre-launch boshidan yakuniy kungacha */
      start: '2026-11-26',
      end: '2027-02-19',          // missiya oxiri (brief: 19 fevral 2027)
      exam: '2027-02-20',         // IELTS Academic imtihoni
      phases: PHASES
    },

    /* Maqsad: umumiy 7.5. Ko'nikma maqsadlari SOZLANADI (Vault > Mission).
       Bu reja, kafolat emas.                                            */
    target: {
      overall: 7.5,
      skills: { listening: 8.0, reading: 7.5, writing: 7.0, speaking: 7.0 },
      editable: true,
      guarantee: false
    },

    /* Pre-launch vazifalari — brief 7-bo'lim. Har biri Mission Planner'da
       haqiqiy vazifa bo'lib tushadi (evidence: qanday dalil kutiladi).   */
    prelaunch: [
      { id: 'pl-diag',    sk: 'all',       min: 60, t: { uz: 'Boshlangʼich diagnostika (4 koʻnikma)', en: 'Baseline diagnostic (4 skills)' }, ev: 'assessment' },
      { id: 'pl-mock',    sk: 'all',       min: 165, t: { uz: 'Cambridge mock imtihoni', en: 'Cambridge mock examination' }, ev: 'mock' },
      { id: 'pl-listen',  sk: 'listening', min: 45, t: { uz: 'Listening Booster: boshlangʼich oʻlchov', en: 'Listening Booster: baseline' }, ev: 'attempt' },
      { id: 'pl-read',    sk: 'reading',   min: 45, t: { uz: 'Reading Explorer: tezlik va aniqlik', en: 'Reading Explorer: speed and accuracy' }, ev: 'attempt' },
      { id: 'pl-vocab',   sk: 'vocab',     min: 40, t: { uz: 'Lugʻat tahlili: bilaman / bilmayman', en: 'Vocabulary analysis: known / unknown' }, ev: 'assessment' },
      { id: 'pl-speak',   sk: 'speaking',  min: 30, t: { uz: 'Speaking yozib olish (Part 1–2)', en: 'Speaking recording (Parts 1–2)' }, ev: 'recording' },
      { id: 'pl-write',   sk: 'writing',   min: 60, t: { uz: 'Writing mashqi: Task 1 va Task 2', en: 'Writing practice: Task 1 and Task 2' }, ev: 'artifact' },
      { id: 'pl-errors',  sk: 'review',    min: 20, t: { uz: 'Xatolar daftarini tayyorlash', en: 'Error Log preparation' }, ev: 'setup' },
      { id: 'pl-setup',   sk: 'all',       min: 30, t: { uz: 'Resurslar va jadvalni sozlash', en: 'Resource and schedule setup' }, ev: 'setup' }
    ],

    /* Asosiy ijro yo'nalishlari — original rejadan saqlangan (brief 7-bo'lim) */
    tracks: [
      { id: 'vocab',     sk: 'vocab',     t: { uz: 'Lugʻat: faol eslash', en: 'Vocabulary: active recall' } },
      { id: 'reading',   sk: 'reading',   t: { uz: 'Oʻqish: matn va skanerlash', en: 'Reading: passages and scanning' } },
      { id: 'lboost',    sk: 'listening', t: { uz: 'Listening Booster', en: 'Listening Booster' } },
      { id: 'lmaps',     sk: 'listening', t: { uz: 'Listening Section 2: xaritalar', en: 'Listening Section 2: maps' } },
      { id: 'l34',       sk: 'listening', t: { uz: 'Listening Section 3–4', en: 'Listening Sections 3–4' } },
      { id: 'wt1',       sk: 'writing',   t: { uz: 'Writing Task 1', en: 'Writing Task 1' } },
      { id: 'wt2',       sk: 'writing',   t: { uz: 'Writing Task 2', en: 'Writing Task 2' } },
      { id: 'speaking',  sk: 'speaking',  t: { uz: 'Speaking Part 1–3', en: 'Speaking Parts 1–3' } },
      { id: 'grammar',   sk: 'grammar',   t: { uz: 'Grammatika aniqligi', en: 'Grammar accuracy' } },
      { id: 'python',    sk: 'coding',    t: { uz: 'Python va DataCamp', en: 'Python and DataCamp' } }
    ],

    /* Yakuniy 19 kun — yangi material EMAS (brief: oxirgi kunlarni yuklamang) */
    finalFocus: [
      { id: 'f-weak',   t: { uz: 'Zaif koʻnikmani tuzatish', en: 'Weak-skill repair' } },
      { id: 'f-revise', t: { uz: 'Maqsadli takrorlash', en: 'Targeted revision' } },
      { id: 'f-timed',  t: { uz: 'Vaqt bilan mashq', en: 'Timed practice' } },
      { id: 'f-mock',   t: { uz: 'Mock imtihonlar', en: 'Mock examinations' } },
      { id: 'f-errors', t: { uz: 'Xatolar daftari takrori', en: 'Error Log revision' } },
      { id: 'f-speak',  t: { uz: 'Speaking mashqi', en: 'Speaking practice' } },
      { id: 'f-exam',   t: { uz: 'Imtihonga tayyorgarlik', en: 'Exam preparation' } },
      { id: 'f-rest',   t: { uz: 'Dam olish va uyqu', en: 'Recovery and sleep' } }
    ],

    /* Dars/ko'nikma holati — "ochilgan" o'rganilgan degani emas (brief 4C) */
    mastery: ['not-started', 'in-progress', 'completed', 'practiced', 'mastered'],
    /* Vazifa holati (brief 4B) — jazo yoki qarz tizimi YO'Q */
    taskStatus: ['pending', 'active', 'done', 'partial', 'skipped'],

    skills: {
      listening: { icon: 'headphones', t: { uz: 'Tinglash', en: 'Listening' } },
      reading:   { icon: 'doc',        t: { uz: 'Oʻqish', en: 'Reading' } },
      writing:   { icon: 'pen',        t: { uz: 'Yozish', en: 'Writing' } },
      speaking:  { icon: 'mic',        t: { uz: 'Gapirish', en: 'Speaking' } },
      grammar:   { icon: 'grid',       t: { uz: 'Grammatika', en: 'Grammar' } },
      vocab:     { icon: 'notebook',   t: { uz: 'Lugʻat', en: 'Vocabulary' } },
      coding:    { icon: 'code',       t: { uz: 'Kod', en: 'Coding' } },
      review:    { icon: 'refresh',    t: { uz: 'Takror', en: 'Review' } }
    },

    /* Mahalliylik: shaxsiy yozuvlar qurilmada qoladi (brief 8-bo'lim) */
    privacy: {
      localFirst: true,
      autoCloudSync: false,         // AVTOMATIK sinxron O'CHIQ
      cloudImportOnce: true,        // bir martalik ANIQ import mumkin
      uploadsRequireConsent: true
    }
  };

  /* ====================== HOSILA QIYMATLAR ============================= */

  function phaseOf(dateKey) {
    for (var i = 0; i < PHASES.length; i++) {
      if (dateKey >= PHASES[i].from && dateKey <= PHASES[i].to) return PHASES[i];
    }
    return null;
  }

  /* Missiyaning necha kuni: 1 = 26-noyabr 2026. Oraliqdan tashqarida 0 yoki -1 */
  function dayNumber(dateKey) {
    var d = diffDays(CFG.mission.start, dateKey);
    return d < 0 ? -1 : d + 1;
  }

  function totalDays() { return diffDays(CFG.mission.start, CFG.mission.end) + 1; }

  function daysToExam(dateKey) { return diffDays(dateKey || todayKey(), CFG.mission.exam); }

  function daysToEnd(dateKey) { return diffDays(dateKey || todayKey(), CFG.mission.end); }

  /* Missiya qancha bajarildi — KUN bo'yicha (bu vaqt o'lchovi, natija emas) */
  function elapsedRatio(dateKey) {
    var n = dayNumber(dateKey || todayKey());
    if (n < 1) return 0;
    var t = totalDays();
    return Math.max(0, Math.min(1, n / t));
  }

  function phaseList() { return PHASES.slice(); }

  /* Bosqich ichidagi kun: {n, of} */
  function phaseDay(dateKey) {
    var p = phaseOf(dateKey);
    if (!p) return null;
    return { phase: p, n: diffDays(p.from, dateKey) + 1, of: diffDays(p.from, p.to) + 1 };
  }

  /* Haftaning dushanbasi (ISO) */
  function weekStart(dateKey) {
    var ms = parse(dateKey), dow = new Date(ms).getUTCDay();   // 0=yakshanba
    return key(ms - ((dow + 6) % 7) * 86400000);
  }

  function weekDays(fromKey) {
    var out = [], s = weekStart(fromKey);
    for (var i = 0; i < 7; i++) out.push(addDays(s, i));
    return out;
  }

  /* Missiya oynasi ichidami */
  function inMission(dateKey) {
    return dateKey >= CFG.mission.start && dateKey <= CFG.mission.end;
  }

  /* Saqlangan maqsadlar (Vault > Missiya) markaziy sozlamaga qo'llanadi.
     Sana va bosqichlar SOZLANMAYDI: ular missiyaning o'zi.            */
  function applySaved() {
    try {
      if (!window.Store || !Store.setting) return;
      var ov = Store.setting('osTargetOverall');
      if (typeof ov === 'number' && ov >= 4 && ov <= 9) CFG.target.overall = ov;
      var sk = Store.setting('osTarget');
      if (sk && typeof sk === 'object') {
        Object.keys(sk).forEach(function (k) {
          if (CFG.target.skills[k] !== undefined && typeof sk[k] === 'number') CFG.target.skills[k] = sk[k];
        });
      }
    } catch (e) {}
  }

  window.OS = window.OS || {};
  window.OS.CFG = CFG;
  window.OS.applySaved = applySaved;
  window.OS.cal = {
    parse: parse, key: key, addDays: addDays, diffDays: diffDays, today: todayKey,
    phaseOf: phaseOf, phaseDay: phaseDay, phaseList: phaseList,
    dayNumber: dayNumber, totalDays: totalDays,
    daysToExam: daysToExam, daysToEnd: daysToEnd, elapsedRatio: elapsedRatio,
    weekStart: weekStart, weekDays: weekDays, inMission: inMission
  };

  /* Node (testlar) uchun */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CFG: CFG, cal: window.OS.cal };
  }
})();
