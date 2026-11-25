/* ==========================================================================
   OS.migrate — localStorage (uzla.state) → IndexedDB ko'chirish
   --------------------------------------------------------------------------
   Brief 9-bo'lim. Tartib qat'iy:
     1. Asl holat ZAXIRALANADI (localStorage nusxasi + fayl taklifi)
     2. Sxema o'qiladi
     3. Yozuvlar IndexedDB ga ko'chiriladi
     4. Yozuvlar SONI va bog'lanishi tekshiriladi
     5. id va vaqt belgilari O'ZGARMAYDI
     6. Dars progressi va test ballari tekshiriladi
     7. Eslatma, xato, takror, missiya yozuvlari tekshiriladi
     8. Hisobot yoziladi (migrationHistory)
     9. Orqaga qaytish mumkin bo'lib qoladi
    10. Tekshiruv o'tmaguncha ASL HOLAT O'CHIRILMAYDI

   Eslatma: ko'chirishdan keyin ham ilova localStorage'dan ishlaydi.
   IndexedDB hozircha IKKINCHI nusxa va yangi modullar uchun asosiy ombor;
   eski sahifalar Store bilan ishlashda davom etadi. Shu tufayli ko'chirish
   XAVFSIZ: bitta ham sahifa buzilmaydi.
   ========================================================================== */
(function () {
  'use strict';

  var OS = (typeof window !== 'undefined' ? (window.OS = window.OS || {}) : {});

  /* ---------- 1. REJA: holatdan yozuvlar yasash (sof funksiya) ---------- */

  /* Har yozuv: { id, ...maydonlar, at } — id va at ASLIDAN olinadi. */
  function plan(state) {
    var s = state || {};
    var out = {};
    OS_STORES.forEach(function (k) { out[k] = []; });

    /* profile — bitta yozuv */
    out.profile.push({
      id: 'me',
      name: s.name || '',
      bio: (s.profile && s.profile.bio) || '',
      title: (s.profile && s.profile.title) || '',
      photo: (s.profile && s.profile.photo) || '',
      at: (s.profile && s.profile.at) || 0
    });

    /* settings — qurilma sozlamalari (shaxsiy yozuv emas) */
    out.settings.push({ id: 'device', lang: s.lang || 'uz', theme: s.theme || 'os', at: Date.now() });
    out.settings.push({ id: 'app', value: s.settings || {}, at: Date.now() });

    /* missions — markaziy kalendar holati */
    out.missions.push({
      id: 'ielts-2027-02',
      v: s.v || 0,
      scheduleVersion: s.scheduleVersion || 0,
      calendarReset: s.calendarReset || null,
      mission: s.mission || null,
      pyai: s.pyai || null,
      at: Date.now()
    });

    /* tasks — Personal OS vazifalari */
    Object.keys(s.osTasks || {}).forEach(function (id) {
      var t = s.osTasks[id];
      if (!t || t.del) return;
      out.tasks.push(Object.assign({}, t, { id: id, at: t.at || 0 }));
    });

    /* scheduleBlocks — blok natijalari: "2026-12-01|h-code" */
    Object.keys(s.blockLog || {}).forEach(function (key) {
      var r = s.blockLog[key] || {};
      var parts = String(key).split('|');
      out.scheduleBlocks.push({
        id: key, date: parts[0] || '', block: parts[1] || '',
        status: r.st || '', note: r.note || '', at: r.at || 0
      });
    });
    /* habit belgilari — "2026-12-01" -> { "h-code": true } */
    Object.keys(s.habit || {}).forEach(function (date) {
      Object.keys(s.habit[date] || {}).forEach(function (bid) {
        var id = date + '|' + bid;
        if (s.blockLog && s.blockLog[id]) return;        // natija bor — dublikat qilmaymiz
        out.scheduleBlocks.push({ id: id, date: date, block: bid, status: 'done', note: '', at: 0 });
      });
    });

    /* studySessions — o'lchangan daqiqalar va qo'lda yozilgan soatlar */
    Object.keys(s.sessions || {}).forEach(function (date) {
      out.studySessions.push({ id: 'm:' + date, date: date, kind: 'measured', min: (s.sessions[date] || {}).min || 0, at: 0 });
    });
    Object.keys(s.hours || {}).forEach(function (date) {
      var h = s.hours[date] || {};
      if (h.eng) out.studySessions.push({ id: 'h:eng:' + date, date: date, kind: 'manual', track: 'eng', min: h.eng, at: 0 });
      if (h.code) out.studySessions.push({ id: 'h:code:' + date, date: date, kind: 'manual', track: 'code', min: h.code, at: 0 });
    });

    /* learningTracks + lessonProgress — Python kunlari va ingliz kunlari */
    out.learningTracks.push({ id: 'python', kind: 'coding', at: 0 });
    out.learningTracks.push({ id: 'english', kind: 'ielts', at: 0 });

    Object.keys(s.best || {}).forEach(function (day) {
      out.lessonProgress.push({
        id: 'python:' + day, track: 'python', ref: String(day),
        best: s.best[day], score: (s.scores || {})[day],
        status: (s.best[day] || 0) >= 7 ? 'completed' : 'in-progress', at: 0
      });
    });
    Object.keys((s.eng || {}).done || {}).forEach(function (day) {
      out.lessonProgress.push({
        id: 'english:' + day, track: 'english', ref: String(day),
        status: 'completed', at: 0
      });
    });
    Object.keys((s.eng || {}).tasks || {}).forEach(function (key) {
      out.lessonProgress.push({ id: 'engtask:' + key, track: 'english', ref: key, status: 'task-done', at: 0 });
    });

    /* quizAttempts */
    Object.keys(s.quiz || {}).forEach(function (ref) {
      var q = s.quiz[ref] || {};
      out.quizAttempts.push({
        id: ref, ref: ref, score: q.score, best: q.best, total: q.total,
        n: q.n || 1, at: q.at || 0
      });
    });

    /* skillAssessments — ingliz tili mock ballari KUN bo'yicha */
    Object.keys((s.eng || {}).scores || {}).forEach(function (day) {
      var sc = s.eng.scores[day] || {};
      out.mockExams.push({
        id: 'mock:' + day, day: String(day),
        listening: sc.l, reading: sc.r, writing: sc.w, speaking: sc.s,
        at: sc.at || 0
      });
    });
    Object.keys(s.read || {}).forEach(function (ref) {
      var r = s.read[ref] || {};
      out.skillAssessments.push({ id: 'read:' + ref, skill: 'reading', ref: ref, wpm: r.wpm, score: r.score, at: r.at || 0 });
    });
    Object.keys(s.speak || {}).forEach(function (n) {
      var sp = s.speak[n] || {};
      out.skillAssessments.push({ id: 'speak:' + n, skill: 'speaking', ref: String(n), text: sp.text || '', at: sp.at || 0 });
    });

    /* vocabulary — daftardagi so'zlar */
    Object.keys((s.copy || {}).vocab || {}).forEach(function (id) {
      var e = s.copy.vocab[id];
      if (!e || e.del) return;
      out.vocabulary.push(Object.assign({}, e, { id: id, at: e.at || 0 }));
    });

    /* reviewQueue — SRS */
    Object.keys(s.review || {}).forEach(function (id) {
      var it = s.review[id] || {};
      out.reviewQueue.push(Object.assign({}, it, { id: id, at: it.at || it.last || 0 }));
    });

    /* mistakes — xatolar daftari (to'rt ustun saqlanadi) */
    (s.mistakes || []).forEach(function (m) {
      if (!m || !m.id) return;
      var meta = (s.osMistakeMeta || {})[m.id] || {};
      out.mistakes.push({
        id: m.id, day: m.day, qi: m.qi,
        question: m.q || '', mine: m.chosen || '', correct: m.correct || '',
        why: meta.why || '',
        cat: meta.cat || '', difficulty: meta.difficulty || null,
        times: m.times || 1, resolved: m.fixed ? 1 : 0,
        resolvedBy: meta.resolvedBy || '', at: m.at || 0
      });
    });

    /* notes — dars eslatmalari, ingliz eslatmalari, erkin daftarlar */
    Object.keys(s.notes || {}).forEach(function (day) {
      var n = s.notes[day] || {};
      out.notes.push({ id: 'py:' + day, kind: 'lesson', ref: String(day), text: n.text || '', at: n.at || 0 });
    });
    Object.keys((s.eng || {}).notes || {}).forEach(function (day) {
      var n = s.eng.notes[day] || {};
      out.notes.push({ id: 'eng:' + day, kind: 'lesson', ref: String(day), text: n.text || '', at: n.at || 0 });
    });
    ['free', 'english', 'coding'].forEach(function (kind) {
      Object.keys((s.copy || {})[kind] || {}).forEach(function (id) {
        var e = s.copy[kind][id];
        if (!e || e.del) return;
        out.notes.push({ id: kind + ':' + id, kind: kind, ref: id, title: e.title || '', text: e.body || e.text || '', at: e.at || 0 });
      });
    });

    /* bookmarks */
    Object.keys(s.bookmarks || {}).forEach(function (id) {
      var b = s.bookmarks[id];
      if (!b || b.del) return;
      out.bookmarks.push(Object.assign({}, b, { id: id, at: b.at || 0 }));
    });

    /* projects — profil loyihalari va sertifikatlar */
    Object.keys((s.profile || {}).projects || {}).forEach(function (id) {
      var p = s.profile.projects[id];
      if (!p || p.del) return;
      out.projects.push(Object.assign({}, p, { id: 'pp:' + id, kind: 'portfolio', at: p.at || 0 }));
    });
    Object.keys((s.profile || {}).certs || {}).forEach(function (id) {
      var c = s.profile.certs[id];
      if (!c || c.del) return;
      out.projects.push(Object.assign({}, c, { id: 'cert:' + id, kind: 'certificate', at: c.at || 0 }));
    });

    /* activityEvents — faollik jurnali */
    (s.events || []).forEach(function (e) {
      if (!e || !e.id) return;
      out.activityEvents.push({ id: e.id, at: e.at || 0, type: e.type || '', ref: e.ref || '', title: e.title || '' });
    });

    return out;
  }

  var OS_STORES = [
    'profile', 'settings', 'missions', 'tasks', 'scheduleBlocks', 'studySessions',
    'learningTracks', 'lessonProgress', 'quizAttempts', 'skillAssessments',
    'vocabulary', 'reviewQueue', 'mistakes', 'mockExams', 'notes', 'bookmarks',
    'projects', 'activityEvents', 'migrationHistory'
  ];

  /* ---------- 2. KUTILGAN SONLAR (tekshiruv uchun, mustaqil hisob) ------ */

  function expected(state) {
    var s = state || {};
    var n = function (o) { return Object.keys(o || {}).length; };
    var live = function (o) {
      return Object.keys(o || {}).filter(function (k) { return o[k] && !o[k].del; }).length;
    };
    var habitBlocks = 0;
    Object.keys(s.habit || {}).forEach(function (d) {
      Object.keys(s.habit[d] || {}).forEach(function (b) {
        if (!(s.blockLog && s.blockLog[d + '|' + b])) habitBlocks++;
      });
    });
    var manualHours = 0;
    Object.keys(s.hours || {}).forEach(function (d) {
      var h = s.hours[d] || {};
      if (h.eng) manualHours++;
      if (h.code) manualHours++;
    });
    var copyNotes = 0;
    ['free', 'english', 'coding'].forEach(function (k) { copyNotes += live((s.copy || {})[k]); });

    return {
      profile: 1,
      settings: 2,
      missions: 1,
      tasks: live(s.osTasks),
      scheduleBlocks: n(s.blockLog) + habitBlocks,
      studySessions: n(s.sessions) + manualHours,
      learningTracks: 2,
      lessonProgress: n(s.best) + n((s.eng || {}).done) + n((s.eng || {}).tasks),
      quizAttempts: n(s.quiz),
      skillAssessments: n(s.read) + n(s.speak),
      vocabulary: live((s.copy || {}).vocab),
      reviewQueue: n(s.review),
      mistakes: (s.mistakes || []).filter(function (m) { return m && m.id; }).length,
      mockExams: n((s.eng || {}).scores),
      notes: n(s.notes) + n((s.eng || {}).notes) + copyNotes,
      bookmarks: live(s.bookmarks),
      projects: live((s.profile || {}).projects) + live((s.profile || {}).certs),
      activityEvents: (s.events || []).filter(function (e) { return e && e.id; }).length,
      migrationHistory: 0
    };
  }

  /* ---------- 3. TEKSHIRUV --------------------------------------------- */

  /* Rejani kutilgan sonlar bilan solishtiradi + id va vaqt belgilarini
     tekshiradi. Farq topilsa — ko'chirish TASDIQLANMAYDI.               */
  function verify(state, built) {
    var exp = expected(state);
    var problems = [];
    var counts = {};

    OS_STORES.forEach(function (st) {
      var got = (built[st] || []).length;
      counts[st] = { expected: exp[st], got: got };
      if (got !== exp[st]) {
        problems.push(st + ': ' + got + ' ≠ ' + exp[st]);
      }
      /* id majburiy va takrorlanmasligi kerak */
      var seen = {};
      (built[st] || []).forEach(function (r) {
        if (r.id == null || r.id === '') problems.push(st + ': id yo\'q yozuv');
        else if (seen[r.id]) problems.push(st + ': takroriy id ' + r.id);
        seen[r.id] = true;
      });
    });

    /* Dars progressi: har bir `best` yozuvi o'z joyida */
    Object.keys((state || {}).best || {}).forEach(function (day) {
      var rec = (built.lessonProgress || []).filter(function (r) { return r.id === 'python:' + day; })[0];
      if (!rec) problems.push('lessonProgress: python:' + day + ' yo\'qoldi');
      else if (rec.best !== state.best[day]) problems.push('lessonProgress: python:' + day + ' ball o\'zgardi');
    });

    /* Test ballari */
    Object.keys((state || {}).quiz || {}).forEach(function (ref) {
      var rec = (built.quizAttempts || []).filter(function (r) { return r.id === ref; })[0];
      if (!rec) problems.push('quizAttempts: ' + ref + ' yo\'qoldi');
      else if (rec.total !== state.quiz[ref].total) problems.push('quizAttempts: ' + ref + ' total o\'zgardi');
    });

    /* Xatolar: to'rt ustun saqlanganmi */
    ((state || {}).mistakes || []).forEach(function (m) {
      if (!m || !m.id) return;
      var rec = (built.mistakes || []).filter(function (r) { return r.id === m.id; })[0];
      if (!rec) { problems.push('mistakes: ' + m.id + ' yo\'qoldi'); return; }
      if (rec.mine !== (m.chosen || '') || rec.correct !== (m.correct || '') ||
          rec.question !== (m.q || '')) problems.push('mistakes: ' + m.id + ' ustunlari o\'zgardi');
      if (rec.at !== (m.at || 0)) problems.push('mistakes: ' + m.id + ' vaqt belgisi o\'zgardi');
    });

    /* Takror navbati: due saqlanganmi */
    Object.keys((state || {}).review || {}).forEach(function (id) {
      var rec = (built.reviewQueue || []).filter(function (r) { return r.id === id; })[0];
      if (!rec) { problems.push('reviewQueue: ' + id + ' yo\'qoldi'); return; }
      if (rec.due !== state.review[id].due) problems.push('reviewQueue: ' + id + ' muddati o\'zgardi');
    });

    return { ok: problems.length === 0, problems: problems, counts: counts };
  }

  /* ---------- 4. ISHGA TUSHIRISH (brauzerda) --------------------------- */

  var BACKUP_PREFIX = 'uzla.state.backup.os-';

  function backupNow() {
    try {
      var raw = localStorage.getItem('uzla.state');
      if (!raw) return null;
      var key = BACKUP_PREFIX + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      localStorage.setItem(key, raw);
      return key;
    } catch (e) { return null; }
  }

  function status() {
    try {
      var raw = localStorage.getItem('uzla.os.migration');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function markDone(report) {
    try { localStorage.setItem('uzla.os.migration', JSON.stringify(report)); } catch (e) {}
  }

  /* To'liq ko'chirish. Asl holat O'CHIRILMAYDI. */
  function run(opts) {
    opts = opts || {};
    if (!OS.db || !OS.db.supported()) {
      return Promise.resolve({ ok: false, reason: 'indexeddb-unsupported' });
    }
    var state;
    try {
      state = window.Store && Store.all ? Store.all() : JSON.parse(localStorage.getItem('uzla.state') || '{}');
    } catch (e) {
      return Promise.resolve({ ok: false, reason: 'state-unreadable' });
    }

    var backupKey = backupNow();
    var built = plan(state);
    var check = verify(state, built);

    if (!check.ok && !opts.force) {
      return Promise.resolve({
        ok: false, reason: 'verify-failed', problems: check.problems,
        counts: check.counts, backup: backupKey
      });
    }

    var stores = OS_STORES.filter(function (s) { return s !== 'migrationHistory'; });
    return Promise.all(stores.map(function (s) {
      return OS.db.putMany(s, built[s]);
    })).then(function () {
      /* Yozilgandan keyin HAQIQIY sonlarni bazadan qayta o'qiymiz */
      return OS.db.counts();
    }).then(function (dbCounts) {
      var mismatch = [];
      stores.forEach(function (s) {
        if (dbCounts[s] !== (built[s] || []).length) {
          mismatch.push(s + ': baza ' + dbCounts[s] + ' ≠ reja ' + (built[s] || []).length);
        }
      });
      var report = {
        id: 'mig-' + Date.now().toString(36),
        at: Date.now(),
        ok: mismatch.length === 0,
        schema: state.v || 0,
        backup: backupKey,
        counts: check.counts,
        dbCounts: dbCounts,
        problems: check.problems.concat(mismatch),
        rollback: 'localStorage[' + (backupKey || 'uzla.state') + ']'
      };
      return OS.db.put('migrationHistory', report).then(function () {
        if (report.ok) markDone({ at: report.at, id: report.id, ok: true, backup: backupKey });
        return report;
      });
    }).catch(function (e) {
      return { ok: false, reason: String(e && e.message || e), backup: backupKey };
    });
  }

  /* Orqaga qaytish: IndexedDB tozalanadi, localStorage zaxirasi tiklanadi */
  function rollback(backupKey) {
    var raw = null;
    try { raw = localStorage.getItem(backupKey); } catch (e) {}
    if (!raw) return Promise.resolve({ ok: false, reason: 'backup-not-found' });
    var stores = OS_STORES;
    return Promise.all(stores.map(function (s) { return OS.db.clear(s).catch(function () {}); }))
      .then(function () {
        try { localStorage.setItem('uzla.state', raw); } catch (e) {}
        try { localStorage.removeItem('uzla.os.migration'); } catch (e) {}
        return { ok: true };
      });
  }

  function listBackups() {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('uzla.state.backup.') === 0) {
          out.push({ key: k, bytes: (localStorage.getItem(k) || '').length });
        }
      }
    } catch (e) {}
    return out.sort(function (a, b) { return a.key < b.key ? 1 : -1; });
  }

  var API = {
    STORES: OS_STORES,
    plan: plan, expected: expected, verify: verify,
    run: run, rollback: rollback, status: status,
    backupNow: backupNow, listBackups: listBackups
  };

  if (typeof window !== 'undefined') OS.migrate = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
