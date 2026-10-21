/* ==========================================================================
   Store — barcha holat (state) va uni brauzerda saqlash
   --------------------------------------------------------------------------
   Butun ilova o'z ma'lumotini SHU yerdan oladi va SHU yerga yozadi.
   Sabab: localStorage chaqiruvlari kod bo'ylab sochilib ketsa, bir joyda
   yozib boshqa joyda o'qilmay qolgan kalitlar paydo bo'ladi. Bitta darvoza
   bo'lsa — nom xatosi ham, migratsiya ham bitta joyda hal bo'ladi.

   Saqlanadigan shakl (localStorage kaliti: "uzla.state"):
   {
     v: 3,                        // sxema versiyasi (kelajakdagi migratsiya uchun)
     lang, theme, name,
     scores:   { "3": 9 },        // kun -> oxirgi ball
     best:     { "3": 10 },       // kun -> eng yaxshi ball
     notes:    { "3": {text, at} },
     mistakes: [ {id, day, qi, chosen, at, times, fixed} ],
     activity: { "2026-09-08": 2 },// sana -> o'sha kuni yopilgan darslar soni
     plan:     { phase1: true },
     eng: {                       // ingliz tili (IELTS) kursi — 144 kun
       done:   { "12": true },    // KUN -> yopilgan
       tasks:  { "12:1": true },  // "kun:vazifa indeksi" -> bajarilgan
       scores: { "32": {l,r,w,s,at} }, // mock KUNI -> band ballari
       notes:  { "12": {text, at} }    // kunga yozilgan eslatma
     },
     settings: { gate, shuffle, playground }
   }

   Nega ingliz tili alohida "eng" ichida: ikkala kurs ham KUN bo'yicha yuradi
   (Python 1–30, ingliz tili 1–144). Bir xil "scores" ichiga qo'shsak,
   12-Python kuni bilan 12-ingliz kuni chalkashardi.

   v3 → v4: ilgari eng.done HAFTA bo'yicha edi, endi KUN bo'yicha. Ikkalasi
   ham oddiy son bo'lgani uchun ularni ajratib bo'lmaydi — shuning uchun
   migratsiyada eski progress tozalanadi, mock ballari esa saqlanadi.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'uzla.state';
  var SCHEMA = 8;   // v8: ingliz tili kunlari qayta raqamlangan (1–4 kirish → 'i1'…'i4', 5–144 → 1–140)

  var DEFAULTS = {
    v: SCHEMA,
    lang: 'uz',
    theme: 'dark',
    name: '',
    scores: {},
    best: {},
    notes: {},
    mistakes: [],
    activity: {},
    plan: {},
    eng: { done: {}, tasks: {}, scores: {}, notes: {} },
    habit: {},            // "2026-09-10": { "h-fajr": true, … }
    habitLegacy: {},      // eski jadval (v1) bloklari — migratsiyada saqlangan tarix, hisobga kirmaydi
    scheduleVersion: 2,   // kunlik jadval versiyasi (migrateScheduleV2)
    /* Blok yakuni (§15): "2026-10-05|h-code" → { st, note, at }
       st: done | partial | skipped.  `done`/`partial` habit belgisini qo'yadi,
       `partial` qo'shimcha takrorga tushadi. Jazolash yo'q — bu o'lchov.   */
    blockLog: {},
    speak: {},            // "12": { at, text }  — Speaking 30 trekining ikkinchi varianti
    bbc: {},              // "<epizod id>": { done, notes, at } — BBC tinglash
    hours: {},            // "2026-09-15": { eng: 240, code: 120 } — qo'lda yozilgan daqiqalar
    read: {},             // "r5" | "d3" | "t7": { wpm, score, at } — o'qish natijalari
    profile: { bio: '', title: '', at: 0, certs: {}, photo: '', projects: {} },   // certs: id → { name, issuer, date, img, at }; photo — kichik dataURL; projects: id → { name, price, desc, img|imgUrl, video, at }
    city: {},             // "1" | "2": { img (dataURL), at } — Leeder City previewi (Maqsad sahifasi)
    movies: {},           // id → { title, desc, dur, rate, src:'file'|'url'|'yt', url, size, at, up, pos, done } — fayl IndexedDB'da
    rdimg: {},            // "ebook:3:0" (track:matn:slot 0|1) → { url (bulut) | local:true (IndexedDB), cap, at } — o'qish matni rasmlari
    copy: { vocab: {}, english: {}, coding: {}, free: {} },   // daftarlar: id → yozuv (matn bulutga; ovoz — IndexedDB, faqat shu qurilma)
    quiz: {},             // "eng:12" | "pr:grammar": { score, total, best, at, n } — ingliz/practice test natijalari
    review: {},           // SRS: id → { kind, ref, due, ivl, reps, lapses, last, meta }
    last: {},             // "python" | "english" | … : { route, title, at } — "Davom etish"
    bookmarks: {},        // id → { route, title, kind, at }
    done: {},             // umumiy "bajarildi" bayroqlari: "spk-ck:12:2", "gr:present-perfect", "proj:p1:3" → true
    sessions: {},         // "2026-09-16": { min } — Today sahifasida o'lchangan o'quv vaqti
    events: [],           // faollik jurnali: { id, at, type, ref, title } — Controller/Teacher vaqt chizig'i (REAL hodisalar)
    settings: {
      gate: false,        // ketma-ket rejim: standart o'chiq (hamma dars ochiq)
      shuffle: true,      // test variantlarini aralashtirish: standart yoqilgan
      playground: true,   // kod maydoni: standart yoqilgan
      notify: false,      // brauzer bildirishnomalari (ruxsat so'raladi)
      /* Namoz vaqti sozlamalari — O'zbekiston uchun standart:
         Hanafiy mazhab (Asr soyasi 2×), Bomdod va Xufton 18°.
         manual — qo'lda kiritilgan vaqtlar hisobning ustiga qo'yiladi.
         Bomdod va Peshin standart bo'yicha qo'lda: ular kunlik jadvalning
         ikki ustuni va har kuni bir xil soatda bo'lishi qulayroq.        */
      prayer: {
        city: 'tashkent', fajr: 18, isha: 18, asr: 2,
        manual: { fajr: '05:20', dhuhr: '13:00' }
      },
      /* Kitobdagi joy: {day, no} — D-kunda N-matn; keyingi kunlar undan
         davom etadi. null — standart (1-kun → 1-matn).                  */
      books: { readingAnchor: null, listeningAnchor: null, listeningNote: '' }
    }
  };

  var state = null;
  var listeners = [];

  /* --- ichki: chuqur nusxa va birlashtirish --------------------------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, patch) {
    var out = clone(base);
    Object.keys(patch || {}).forEach(function (k) {
      var v = patch[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) {
        out[k] = merge(out[k], v);
      } else if (v !== undefined) {
        out[k] = v;
      }
    });
    return out;
  }

  /* --- eski (working.html) ma'lumotlarini ko'chirish ------------------- */
  function migrateLegacy(s) {
    try {
      var oldScores = JSON.parse(localStorage.getItem('uzl_scores') || 'null');
      var oldLang = JSON.parse(localStorage.getItem('uzl_lang') || 'null');
      var oldTheme = JSON.parse(localStorage.getItem('uzl_theme') || 'null');
      var oldPlan = JSON.parse(localStorage.getItem('uzl_plan') || 'null');
      if (oldScores && typeof oldScores === 'object') {
        Object.keys(oldScores).forEach(function (d) {
          if (s.scores[d] === undefined) s.scores[d] = oldScores[d];
          if (s.best[d] === undefined) s.best[d] = oldScores[d];
        });
      }
      if (oldLang && !localStorage.getItem(KEY)) s.lang = oldLang;
      if (oldTheme && !localStorage.getItem(KEY)) s.theme = oldTheme;
      if (oldPlan && typeof oldPlan === 'object') s.plan = merge(s.plan, oldPlan);
    } catch (e) { /* eski ma'lumot buzilgan bo'lsa — jimgina o'tkazib yuboramiz */ }
    return s;
  }

  /* v3 da ingliz tili progressi HAFTA bo'yicha saqlangan edi, v4 da KUN
     bo'yicha. Ikkalasi ham oddiy son — "12" hafta 12 mi yoki kun 12 mi,
     ajratib bo'lmaydi. Noto'g'ri ko'chirgandan ko'ra tozalagan ma'qul:
     mock ballari (ular kun/hafta raqamiga bog'liq emas) saqlanadi.       */
  function migrateEngToDays(s) {
    s.eng.done = {};
    s.eng.tasks = {};
    return s;
  }

  /* v7 → v8: kirish bloki kurs kuni emas. Eski 1–4 → 'i1'…'i4', 5–144 → 1–140.
     Kalitlar: eng.done, eng.tasks ("kun:indeks"), eng.scores, eng.notes,
     quiz ("eng:kun"), review ("eng:kun"). Bir marta, faqat eski sxemada.    */
  function migrateEngRenumber(s) {
    var mapKey = function (k) { var n = Number(k); if (isNaN(n)) return k; return n <= 4 ? 'i' + n : String(n - 4); };
    ['done', 'scores', 'notes'].forEach(function (f) {
      var o = s.eng[f] || {}, out = {};
      Object.keys(o).forEach(function (k) { out[mapKey(k)] = o[k]; });
      s.eng[f] = out;
    });
    var t = s.eng.tasks || {}, tout = {};
    Object.keys(t).forEach(function (k) { var p = k.split(':'); tout[mapKey(p[0]) + ':' + p[1]] = t[k]; });
    s.eng.tasks = tout;
    ['quiz', 'review'].forEach(function (f) {
      var o = s[f] || {}, out = {};
      Object.keys(o).forEach(function (k) {
        var m = k.match(/^eng:(\d+)(.*)$/);
        if (m) { var nk = 'eng:' + mapKey(m[1]) + m[2]; if (o[k] && o[k].ref) o[k].ref = mapKey(m[1]); out[nk] = o[k]; }
        else out[k] = o[k];
      });
      s[f] = out;
    });
    return s;
  }

  /* ====================== JADVAL MIGRATSIYASI (v1 → v2) ==================
     2026-09-27 da kunlik jadval qayta qurildi: og'ir kun 11 → 5 yadro bloki,
     LC kuni 10 → 5, yakshanba 5 → 3 (shartli juftlik bilan). Eski bloklarning
     ID lari yo'qoldi, lekin `state.habit["sana"]["blok-id"]` da bajarilgan
     bloklar saqlanadi — ularni O'CHIRIB BO'LMAYDI.

     Qoida (§47): yangi blok faqat o'zining BARCHA eski qismlari bajarilgan
     bo'lsagina bajarilgan deb belgilanadi. Qisman bajarilgan bo'lsa — yangi
     blok belgilanmaydi, eski yozuv `habitLegacy` da saqlanib qoladi.
     Yolg'on "bajarildi" qo'yilmaydi.

     Idempotent: `scheduleVersion` maydoni bilan bir marta ishlaydi.        */
  var SCHEDULE_VERSION = 2;

  /* yangi id → uni tashkil qilgan eski id lar */
  var SCHEDULE_MAP_V2 = {
    'h-eng-am':  ['h-l1', 'h-l2'],
    'h-code':    ['h-py', 'h-dc'],
    'h-eng-mid': ['h-l3', 'h-l4'],
    'h-eng-pm':  ['h-l5', 'h-l6'],
    'h-close':   ['h-hw2', 'h-book', 'h-log'],
    'c-eng':     ['c-l1', 'c-l2'],
    'c-code':    ['c-py', 'c-dc'],
    'c-write':   ['c-l4'],
    'c-close':   ['c-hw2', 'c-book', 'c-log'],
    'r-focus':   ['r-py'],
    'r-focus-dc': ['r-dc'],
    'r-close':   ['r-book', 'r-board']
  };
  /* Yangi jadvalda o'rni yo'q (LC bilan takrorlanmasin deb olib tashlangan):
     faqat tarixiy yozuv sifatida saqlanadi. */
  var SCHEDULE_DROPPED_V2 = ['c-l3'];

  function migrateScheduleV2(s) {
    var days = s.habit || {};
    var legacy = s.habitLegacy || {};
    var moved = 0, partial = 0, kept = 0;

    Object.keys(days).forEach(function (date) {
      var day = days[date] || {};
      var oldIds = Object.keys(day);
      if (!oldIds.length) return;

      Object.keys(SCHEDULE_MAP_V2).forEach(function (newId) {
        var parts = SCHEDULE_MAP_V2[newId];
        var present = parts.filter(function (p) { return day[p]; });
        if (!present.length) return;
        if (present.length === parts.length) {
          day[newId] = true; moved++;            // hammasi bajarilgan → yangi blok yopiq
        } else {
          partial++;                              // qisman → yangi blok BELGILANMAYDI
        }
        /* eski yozuv tarixda qoladi */
        if (!legacy[date]) legacy[date] = {};
        present.forEach(function (p) { legacy[date][p] = true; delete day[p]; });
      });

      SCHEDULE_DROPPED_V2.forEach(function (p) {
        if (day[p]) {
          if (!legacy[date]) legacy[date] = {};
          legacy[date][p] = true; delete day[p]; kept++;
        }
      });

      if (!Object.keys(day).length) delete days[date];
    });

    s.habitLegacy = legacy;
    s.scheduleVersion = SCHEDULE_VERSION;
    s.scheduleMigration = { at: Date.now(), from: 1, to: SCHEDULE_VERSION, moved: moved, partial: partial, dropped: kept };
    return s;
  }

  function read() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (e) { raw = null; }
    var s = merge(DEFAULTS, raw || {});
    if (raw && (raw.v || 1) < 4) s = migrateEngToDays(s);
    if (raw && (raw.v || 1) < 8) s = migrateEngRenumber(s);
    /* Jadval migratsiyasi — sxema versiyasidan MUSTAQIL, o'z hisoblagichi bilan */
    if (raw && (raw.scheduleVersion || 1) < SCHEDULE_VERSION) s = migrateScheduleV2(s);
    s.v = SCHEMA;
    if (!raw) s = migrateLegacy(s);
    return s;
  }

  /* Faollik jurnali — real hodisalar (dars, test, xato, o'qish, takror …).
     Bir daqiqada bir xil (type, ref) takrorlanmaydi. 400 ta oxirgisi qoladi.
     Sinxron: id bo'yicha birlashadi (sync.js). Staff paneli vaqt chizig'i shundan. */
  function logEvent(type, ref, title) {
    if (!state) return;
    state.events = state.events || [];
    var now = Date.now(), last = state.events[state.events.length - 1];
    if (last && last.type === type && last.ref === ref && now - last.at < 60000) { last.at = now; last.title = title; return; }
    state.events.push({ id: now.toString(36) + Math.random().toString(36).slice(2, 6), at: now, type: type, ref: String(ref || ''), title: String(title || '').slice(0, 100) });
    if (state.events.length > 400) state.events = state.events.slice(-400);
  }

  function write() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* privat rejim yoki joy tugagan — ilova baribir ishlaydi */ }
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }

  /* --- sana yordamchilari (mahalliy vaqt bo'yicha) --------------------- */
  function dateKey(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function shiftDays(key, n) {
    var p = key.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  window.Store = {
    /* --- hayotiy sikl --- */
    init: function () { state = read(); return state; },
    all: function () { return state; },
    onChange: function (fn) { listeners.push(fn); },

    /* --- oddiy get/set --- */
    get: function (k) { return state ? state[k] : DEFAULTS[k]; },
    set: function (k, v) { state[k] = v; write(); },
    setting: function (k) { return state.settings[k]; },
    setSetting: function (k, v) { state.settings[k] = v; write(); },

    /* --- ballar -------------------------------------------------------
       recordScore kunning oxirgi VA eng yaxshi ballini saqlaydi.
       Eng yaxshisi alohida kerak: qayta topshirganda past ball olsang,
       tugatgan kuning "yo'qolib" ketmasin.                              */
    score: function (day) { return state.scores[day]; },
    bestScore: function (day) { return state.best[day]; },
    isDone: function (day) { return (state.best[day] || 0) >= 7; },
    doneCount: function () {
      var n = 0;
      Object.keys(state.best).forEach(function (d) { if (state.best[d] >= 7) n++; });
      return n;
    },
    avgScore: function () {
      var keys = Object.keys(state.best);
      if (!keys.length) return 0;
      var sum = 0;
      keys.forEach(function (d) { sum += state.best[d]; });
      return sum / keys.length;
    },
    recordScore: function (day, score) {
      var wasDone = this.isDone(day);
      state.scores[day] = score;
      if (!state.best[day] || score > state.best[day]) state.best[day] = score;
      // Faollik xaritasiga faqat YANGI yopilgan kun qo'shiladi
      if (!wasDone && score >= 7) {
        var k = dateKey();
        state.activity[k] = (state.activity[k] || 0) + 1;
      }
      logEvent(!wasDone && score >= 7 ? 'py-done' : 'py-quiz', String(day), 'Python ' + day + ' · ' + score + '/10');
      write();
      return !wasDone && score >= 7;
    },

    /* --- ketma-ket kunlar (streak) ------------------------------------
       Bugun yoki kecha faollik bo'lsa — zanjir tirik. Aks holda 0.
       Kecha ham hisoblanadi: kun almashgan zahoti streak "o'lmasin".    */
    streak: function () {
      var today = dateKey();
      var cursor = Store.activeOn(today) ? today : shiftDays(today, -1);
      if (!Store.activeOn(cursor)) return 0;
      var n = 0;
      while (Store.activeOn(cursor)) { n++; cursor = shiftDays(cursor, -1); }
      return n;
    },
    /* Kun "faol" hisoblanadi, agar o'sha kuni: Python darsi yopilgan YOKI
       ingliz tili kuni yopilgan (activity ga yoziladi) YOKI kunlik intizom
       jadvali to'liq belgilangan. Ilgari faqat Python sanalardi — ingliz
       tili va intizomni to'liq qilgan kun streak'ka kirmasdi.            */
    activeOn: function (key) {
      if (state.activity[key]) return true;
      if (window.HabitPlan && HabitPlan.inRange(key)) {
        try { return HabitPlan.isDayDone(HabitPlan.forDate(key)); } catch (e) { return false; }
      }
      return false;
    },
    activityMap: function () { return state.activity; },
    dateKey: dateKey,
    shiftDays: shiftDays,

    /* --- eslatmalar --- */
    note: function (day) { return state.notes[day] || null; },
    setNote: function (day, text) {
      if (!text || !text.trim()) delete state.notes[day];
      else state.notes[day] = { text: text.trim(), at: Date.now() };
      write();
    },
    notesList: function () {
      return Object.keys(state.notes)
        .map(function (d) { return { day: Number(d), text: state.notes[d].text, at: state.notes[d].at }; })
        .sort(function (a, b) { return b.at - a.at; });
    },

    /* --- xatolar daftari ----------------------------------------------
       Bir savol qayta xato qilinsa yangi yozuv ochilmaydi — "times"
       oshadi va "fixed" bekor qilinadi. Shunda ro'yxat toza qoladi.     */
    addMistake: function (day, qi, chosenText, correctText, questionText) {
      var id = day + ':' + qi;
      var found = null;
      state.mistakes.forEach(function (m) { if (m.id === id) found = m; });
      if (found) {
        found.times++; found.fixed = false; found.chosen = chosenText; found.at = Date.now();
      } else {
        state.mistakes.push({
          id: id, day: day, qi: qi, q: questionText,
          chosen: chosenText, correct: correctText,
          times: 1, fixed: false, at: Date.now()
        });
      }
      write();
    },
    mistakes: function () { return state.mistakes.slice().sort(function (a, b) { return b.at - a.at; }); },
    openMistakes: function () { return state.mistakes.filter(function (m) { return !m.fixed; }); },
    toggleMistake: function (id) {
      state.mistakes.forEach(function (m) { if (m.id === id) m.fixed = !m.fixed; });
      write();
    },
    clearFixedMistakes: function () {
      state.mistakes = state.mistakes.filter(function (m) { return !m.fixed; });
      write();
    },

    /* --- DataCamp reja bosqichlari --- */
    planDone: function (key) { return !!state.plan[key]; },
    togglePlan: function (key) { state.plan[key] = !state.plan[key]; if (state.plan[key]) logEvent('plan', key, key); write(); },

    /* --- Ingliz tili (IELTS) kursi -------------------------------------
       Kun "yopilgan" bayrog'i va vazifa belgilari ALOHIDA saqlanadi.
       Sabab: foydalanuvchi kunni qo'lda yopishi ham, vazifalarni birma-bir
       belgilashi ham mumkin. Ikkalasini bog'lash sahifa moduli ishi —
       Store faqat ma'lumotni saqlaydi.                                    */
    /* Kirish darslari (i1…i4) rasmiy tugallangan — ENGLISH.meta.orientation.done */
    engDayDone: function (d) { if (/^i/.test(String(d)) && window.ENGLISH && ENGLISH.meta.orientation && ENGLISH.meta.orientation.done) return true; return !!state.eng.done[d]; },
    engSetDayDone: function (d, on) {
      var was = !!state.eng.done[d];
      if (on) state.eng.done[d] = true; else delete state.eng.done[d];
      // Yangi yopilgan ingliz tili kuni ham faollik xaritasiga kiradi —
      // streak faqat Python bilan emas, ingliz tili bilan ham yashaydi.
      if (on && !was) {
        var k = dateKey();
        state.activity[k] = (state.activity[k] || 0) + 1;
        logEvent('eng-done', String(d), 'English ' + d);
      }
      write();
    },
    /* Faqat kurs kunlari (1–140); kirish darslari ('i1'…) progressga kirmaydi */
    engDoneCount: function () { return Object.keys(state.eng.done).filter(function (k) { return /^\d+$/.test(k); }).length; },
    engIntroDoneCount: function () { if (window.ENGLISH && ENGLISH.meta.orientation && ENGLISH.meta.orientation.done && window.ENG_INTRO) return ENG_INTRO.length; return Object.keys(state.eng.done).filter(function (k) { return /^i/.test(k); }).length; },

    engTask: function (d, i) { return !!state.eng.tasks[d + ':' + i]; },
    engSetTask: function (d, i, on) {
      var k = d + ':' + i;
      if (on) state.eng.tasks[k] = true; else delete state.eng.tasks[k];
      write();
    },
    engTasksDone: function (d) {
      var p = d + ':', n = 0;
      Object.keys(state.eng.tasks).forEach(function (k) { if (k.indexOf(p) === 0) n++; });
      return n;
    },

    /* --- ingliz tili kunига eslatma --- */
    engNote: function (d) { return state.eng.notes[d] || null; },
    engSetNote: function (d, text) {
      if (!text || !text.trim()) delete state.eng.notes[d];
      else state.eng.notes[d] = { text: text.trim(), at: Date.now() };
      write();
    },
    engNotesList: function () {
      return Object.keys(state.eng.notes)
        .map(function (d) { return { day: Number(d), text: state.eng.notes[d].text, at: state.eng.notes[d].at }; })
        .sort(function (a, b) { return b.at - a.at; });
    },

    /* Mock kunlarining band ballari (kalit — KUN raqami) */
    engScore: function (d) { return state.eng.scores[d] || null; },
    engSetScore: function (d, o) {
      if (!o) delete state.eng.scores[d];
      else state.eng.scores[d] = { l: o.l, r: o.r, w: o.w, s: o.s, at: Date.now() };
      write();
    },
    engScoreList: function () {
      var ord = function (d) { return /^i/.test(d) ? Number(d.slice(1)) - 100 : Number(d); };
      return Object.keys(state.eng.scores)
        .map(function (d) { var o = state.eng.scores[d]; return { day: /^i/.test(d) ? d : Number(d), l: o.l, r: o.r, w: o.w, s: o.s, at: o.at }; })
        .sort(function (a, b) { return ord(a.day) - ord(b.day); });
    },
    /* IELTS umumiy ball: 4 bo'lim o'rtachasi, eng yaqin yarim balga.
       .25 → yuqoriga (.5), .75 → yuqoriga (butun) — rasmiy qoida shunday,
       va Math.round(x*2)/2 aynan shu natijani beradi.                     */
    engOverall: function (o) {
      if (!o) return null;
      var b = [o.l, o.r, o.w, o.s];
      for (var i = 0; i < 4; i++) if (typeof b[i] !== 'number' || isNaN(b[i])) return null;
      return Math.round((b[0] + b[1] + b[2] + b[3]) / 4 * 2) / 2;
    },
    engLastScore: function () {
      var list = this.engScoreList();
      return list.length ? list[list.length - 1] : null;
    },

    /* --- Kunlik intizom ------------------------------------------------
       Kalit: sana → blok id. Bloklar kun turiga qarab hosil bo'ladi,
       shuning uchun Store ularning ro'yxatini bilmaydi — faqat belgini
       saqlaydi. Bu HabitPlan shabloni o'zgarsa ham eski ma'lumot buzilmasligi
       uchun: yo'q blok belgisi shunchaki e'tiborsiz qoladi.               */
    habitBlock: function (key, id) { return !!(state.habit[key] && state.habit[key][id]); },
    habitToggle: function (key, id) {
      if (!state.habit[key]) state.habit[key] = {};
      if (state.habit[key][id]) {
        delete state.habit[key][id];
        if (!Object.keys(state.habit[key]).length) delete state.habit[key];
      } else {
        state.habit[key][id] = true;
      }
      write();
    },
    habitSetDay: function (key, ids, on) {
      if (!state.habit[key]) state.habit[key] = {};
      ids.forEach(function (id) {
        if (on) state.habit[key][id] = true; else delete state.habit[key][id];
      });
      if (!Object.keys(state.habit[key]).length) delete state.habit[key];
      write();
    },
    habitDayCount: function (key) { return state.habit[key] ? Object.keys(state.habit[key]).length : 0; },
    habitAll: function () { return state.habit; },

    /* --- Blok yakuni (§15): bajarildi / qisman / o'tkazib yuborildi ------
       `done` va `partial` blokni yopadi (qilingan ish — ish); `partial`
       qo'shimcha takror bayrog'ini qo'yadi. `skipped` yopmaydi.
       Jazo yo'q: natija faqat rejalashtirish uchun o'lchov.                */
    blockResult: function (key, id) { return state.blockLog[key + '|' + id] || null; },
    setBlockResult: function (key, id, st, note) {
      var k = key + '|' + id;
      if (!st) { delete state.blockLog[k]; }
      else {
        state.blockLog[k] = { st: st, note: (note || '').slice(0, 400), at: Date.now() };
        if (st === 'done' || st === 'partial') {
          if (!state.habit[key]) state.habit[key] = {};
          state.habit[key][id] = true;
        } else if (state.habit[key]) {
          delete state.habit[key][id];
          if (!Object.keys(state.habit[key]).length) delete state.habit[key];
        }
        logEvent('flag', 'block:' + k, id + ' · ' + st);
      }
      write();
    },
    /* Kunning blok natijalari: { done, partial, skipped } */
    blockStats: function (key) {
      var out = { done: 0, partial: 0, skipped: 0 }, p = key + '|';
      Object.keys(state.blockLog).forEach(function (k) {
        if (k.indexOf(p) !== 0) return;
        var st = state.blockLog[k].st;
        if (out[st] !== undefined) out[st]++;
      });
      return out;
    },

    /* --- Speaking 30 trekining javoblari --- */
    speakNote: function (n) { return state.speak[n] || null; },
    setSpeakNote: function (n, text) {
      if (!text || !text.trim()) delete state.speak[n];
      else state.speak[n] = { text: text.trim(), at: Date.now() };
      write();
    },
    speakDoneCount: function () { return Object.keys(state.speak).length; },

    /* --- BBC tinglash: epizod bo'yicha eslatma va "tugatildi" --- */
    bbcGet: function (id) { return state.bbc[id] || null; },
    bbcSet: function (id, patch) {
      var cur = state.bbc[id] || {};
      Object.keys(patch).forEach(function (k) { cur[k] = patch[k]; });
      cur.at = Date.now();
      if (!cur.done && !(cur.notes && cur.notes.trim())) delete state.bbc[id]; else state.bbc[id] = cur;
      write();
    },
    bbcDoneCount: function () { var n = 0; Object.keys(state.bbc).forEach(function (k) { if (state.bbc[k].done) n++; }); return n; },

    /* --- Kunlik soatlar (daqiqa): ingliz tili va coding — qo'lda yoziladi --- */
    hoursOf: function (key) { return state.hours[key] || { eng: 0, code: 0 }; },
    addMinutes: function (key, kind, min) {
      var h = state.hours[key] || { eng: 0, code: 0 };
      h[kind] = Math.max(0, (h[kind] || 0) + min);
      state.hours[key] = h;
      write();
    },

    /* --- Umumiy bayroqlar, quiz natijalari, SRS, oxirgi faoliyat, xatcho'plar --- */
    /* Faollik jurnali */
    logEvent: function (type, ref, title) { logEvent(type, ref, title); write(); },
    events: function (n) { return (state.events || []).slice(-(n || 200)); },
    flag: function (k) { return !!state.done[k]; },
    setFlag: function (k, v) { if (v === undefined) v = !state.done[k]; if (v) state.done[k] = true; else delete state.done[k]; if (v && /^(dc:|q10:|spk-ck:|db2:|dq:)/.test(k)) logEvent('flag', k, k); write(); },
    quizGet: function (k) { return state.quiz[k] || null; },
    quizSet: function (k, score, total) {
      var q = state.quiz[k] || { best: 0, n: 0 };
      q.score = score; q.total = total; q.n = (q.n || 0) + 1; q.at = Date.now();
      if (score / total > (q.best || 0) / (q.bestTotal || 1)) { q.best = score; q.bestTotal = total; }
      state.quiz[k] = q;
      logEvent('quiz', k, k + ' · ' + score + '/' + total);
      write();
    },
    reviewAll: function () { return state.review; },
    reviewSet: function (id, item) { state.review[id] = item; write(); },
    reviewDel: function (id) { delete state.review[id]; write(); },
    lastGet: function (track) { return state.last[track] || null; },
    lastSet: function (track, route, title) { state.last[track] = { route: route, title: title, at: Date.now() }; write(); },
    lastAll: function () { return state.last; },
    bookmark: function (id) { var b = state.bookmarks[id]; return b && !b.del ? b : null; },
    bookmarkToggle: function (id, route, title, kind) {
      var b = state.bookmarks[id];
      if (b && !b.del) state.bookmarks[id] = { del: true, at: Date.now() };
      else state.bookmarks[id] = { route: route, title: title, kind: kind, at: Date.now() };
      write(); return !!(state.bookmarks[id] && !state.bookmarks[id].del);
    },
    bookmarksList: function () { var m = state.bookmarks; return Object.keys(m).filter(function (k) { return !m[k].del; }).map(function (k) { var b = m[k]; b.id = k; return b; }).sort(function (a, b) { return b.at - a.at; }); },
    sessionAdd: function (key, min) { var s = state.sessions[key] || { min: 0 }; s.min = (s.min || 0) + min; state.sessions[key] = s; write(); },
    sessionOf: function (key) { return (state.sessions[key] || {}).min || 0; },

    /* --- Umumiy xato banki: cat = python | english | grammar | vocab | reading | practice --- */
    addMistake2: function (cat, key, info) {
      var id = cat + ':' + key, found = null;
      state.mistakes.forEach(function (m) { if (m.id === id) found = m; });
      if (found) { found.times++; found.fixed = false; found.chosen = info.chosen; found.at = Date.now(); }
      else state.mistakes.push({ id: id, cat: cat, ref: key, q: info.q, chosen: info.chosen, correct: info.correct, topic: info.topic || '', route: info.route || '', why: info.why || '', times: 1, fixed: false, at: Date.now() });
      logEvent('mistake', id, (info.topic || cat) + ' · ' + String(info.q || '').slice(0, 60));
      write();
    },

    /* --- Daftarlar (copybook) --- */
    copyList: function (kind) { var m = state.copy[kind] || {}; return Object.keys(m).filter(function (k) { return !m[k].del; }).map(function (k) { return m[k]; }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); },
    copyGet: function (kind, id) { var e = (state.copy[kind] || {})[id]; return e && !e.del ? e : null; },
    copySet: function (kind, e) {
      if (!state.copy[kind]) state.copy[kind] = {};
      var isNew = !e.id || !state.copy[kind][e.id];
      e.id = e.id || (kind.charAt(0) + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
      if (isNew && !e.created) e.created = Date.now();   // "bugun nechta so'z yozildi" hisobi uchun — tahrir emas, yaratilgan vaqt
      e.at = Date.now(); state.copy[kind][e.id] = e; write(); return e.id;
    },
    copyDel: function (kind, id) { if (state.copy[kind] && state.copy[kind][id]) { state.copy[kind][id] = { id: id, del: true, at: Date.now() }; write(); } },

    /* --- Kinolar: faqat metadata bulutda; fayl va thumbnail IndexedDB'da (qurilma) --- */
    movieList: function () { var m = state.movies || {}; return Object.keys(m).filter(function (k) { return !m[k].del; }).map(function (k) { return m[k]; }).sort(function (a, b) { return (b.added || 0) - (a.added || 0); }); },
    movieGet: function (id) { var e = (state.movies || {})[id]; return e && !e.del ? e : null; },
    movieSet: function (e) { if (!state.movies) state.movies = {}; e.id = e.id || ('m' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)); e.added = e.added || Date.now(); e.at = Date.now(); state.movies[e.id] = e; write(); return e.id; },
    movieDel: function (id) { if (state.movies && state.movies[id]) { state.movies[id] = { id: id, del: true, at: Date.now() }; write(); } },

    /* --- O'qish matni rasmlari: har matnga 2 joy (slot 0/1); fayl bulutda (url) yoki IndexedDB'da (local) --- */
    rdimgGet: function (track, n, slot) { var r = (state.rdimg || {})[track + ':' + n + ':' + slot]; return r && !r.del ? r : null; },
    rdimgSet: function (track, n, slot, rec) { if (!state.rdimg) state.rdimg = {}; rec.at = Date.now(); state.rdimg[track + ':' + n + ':' + slot] = rec; write(); },
    rdimgDel: function (track, n, slot) { if (!state.rdimg) state.rdimg = {}; state.rdimg[track + ':' + n + ':' + slot] = { del: true, at: Date.now() }; write(); },

    /* --- Leeder City rasmlari --- */
    cityGet: function (n) { var c = state.city[n]; return c && !c.del ? c : null; },
    citySet: function (n, img) { state.city[n] = img ? { img: img, at: Date.now() } : { del: true, at: Date.now() }; write(); },

    /* --- Profil: bio, lavozim, tashqi sertifikatlar --- */
    profile: function () { return state.profile; },
    profileSet: function (patch) { Object.assign(state.profile, patch, { at: Date.now() }); write(); },
    certAdd: function (c) { c.id = c.id || ('c' + Date.now().toString(36)); c.at = Date.now(); state.profile.certs[c.id] = c; write(); return c.id; },
    certDel: function (id) { if (state.profile.certs[id]) { state.profile.certs[id] = { del: true, at: Date.now() }; write(); } },
    certList: function () { var m = state.profile.certs; return Object.keys(m).filter(function (k) { return !m[k].del; }).map(function (k) { return m[k]; }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); },
    /* --- Profil loyihalari (portfolio): nom, bozor narxi, tavsif, rasm, video muqova --- */
    pprojList: function () { var m = state.profile.projects || {}; return Object.keys(m).filter(function (k) { return !m[k].del; }).map(function (k) { return m[k]; }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); },
    pprojGet: function (id) { var p = (state.profile.projects || {})[id]; return p && !p.del ? p : null; },
    pprojSet: function (p) { if (!state.profile.projects) state.profile.projects = {}; p.id = p.id || ('pp' + Date.now().toString(36)); p.at = Date.now(); state.profile.projects[p.id] = p; write(); return p.id; },
    pprojDel: function (id) { if (state.profile.projects && state.profile.projects[id]) { state.profile.projects[id] = { id: id, del: true, at: Date.now() }; write(); } },

    /* --- O'qish natijalari: WPM va to'g'ri javob foizi --- */
    readGet: function (id) { return state.read[id] || null; },
    readSet: function (id, patch) {
      var cur = state.read[id] || {};
      Object.keys(patch).forEach(function (k) { cur[k] = patch[k]; });
      cur.at = Date.now();
      state.read[id] = cur;
      if (patch.score != null) logEvent('read', id, id + ' · ' + patch.score + '/' + patch.total);
      write();
    },
    readList: function () { return state.read; },

    /* --- eksport / import / tozalash --- */
    exportJSON: function () { return JSON.stringify(state, null, 2); },
    importJSON: function (text) {
      var parsed = JSON.parse(text);           // xato bo'lsa chaqiruvchi ushlaydi
      if (!parsed || typeof parsed !== 'object') throw new Error('bad shape');
      state = merge(DEFAULTS, parsed);
      if ((parsed.v || 1) < 8) state = migrateEngRenumber(state);
      state.v = SCHEMA;
      write();
    },
    /* Bulutdan kelgan holatni o'rnatish. `silent` — listener'larga
       aytilmaydi: aks holda Sync o'zi olib kelgan narsani yana bulutga
       qaytarib yuborardi (aylanma).                                       */
    replace: function (obj, silent) {
      state = merge(DEFAULTS, obj || {});
      if (obj && (obj.v || 1) < 8) state = migrateEngRenumber(state);
      state.v = SCHEMA;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      if (!silent) listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
    },
    clone: clone,
    /* Tashqi (bulut) nusxani joriy sxemaga keltirish — Sync birlashtirishdan oldin chaqiradi */
    migrate: function (obj) {
      var s = merge(DEFAULTS, obj || {});
      if ((obj && obj.v || 1) < 8) s = migrateEngRenumber(s);
      s.v = SCHEMA;
      return s;
    },
    resetAll: function () {
      // Ko'rinish sozlamalari "progress" emas — ularni saqlab qolamiz
      var lang = state.lang, theme = state.theme;
      state = clone(DEFAULTS);
      state.lang = lang; state.theme = theme;
      write();
    }
  };
})();
