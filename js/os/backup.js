/* ==========================================================================
   OS.backup — zaxira va ko'chirib olish (JSON va ZIP)
   --------------------------------------------------------------------------
   Brief 8-bo'lim. Ikki xil zaxira:
     1. JSON  — tuzilgan shaxsiy ma'lumot
     2. ZIP   — tuzilgan ma'lumot + manifest + haqiqiy shaxsiy fayllar

   Har ikkalasida: sxema versiyasi, eksport vaqti, yozuv identifikatorlari,
   fayl manifesti, imkon qadar nazorat yig'indisi (CRC32).

   IMPORT: tekshiruv → ko'rib chiqish → dublikat topish → xavfsiz
   birlashtirish → to'qnashuv hisoboti → xato bo'lsa orqaga qaytish.

   HECH QACHON import qilinmaydi: parol, cookie, sessiya, token.
   Eksport qilingan profil bilan hisobga KIRIB BO'LMAYDI.
   ========================================================================== */
(function () {
  'use strict';

  var OS = (typeof window !== 'undefined' ? (window.OS = window.OS || {}) : {});

  var FORMAT = 'uzleeder-personal-os';
  var FORMAT_VERSION = 1;

  /* Hech qachon zaxiraga tushmaydigan kalitlar — sir va sessiya izlari */
  var NEVER_EXPORT = ['password', 'pass', 'token', 'session', 'cookie', 'secret', 'auth', 'hash'];

  function stripSecrets(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(stripSecrets);
    var out = {};
    Object.keys(obj).forEach(function (k) {
      var low = k.toLowerCase();
      for (var i = 0; i < NEVER_EXPORT.length; i++) {
        if (low.indexOf(NEVER_EXPORT[i]) >= 0) return;   // tashlab ketiladi
      }
      out[k] = stripSecrets(obj[k]);
    });
    return out;
  }

  /* ---------- CRC32 (ZIP uchun ham, nazorat yig'indisi uchun ham) ------- */

  var CRC_TABLE = null;
  function crcTable() {
    if (CRC_TABLE) return CRC_TABLE;
    CRC_TABLE = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      CRC_TABLE[n] = c >>> 0;
    }
    return CRC_TABLE;
  }

  function crc32(bytes) {
    var t = crcTable(), c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = t[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function utf8(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    var out = [], s = unescape(encodeURIComponent(str));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return new Uint8Array(out);
  }

  /* ---------- ZIP yozuvchi (siqishsiz, "store" usuli) ------------------
     Tashqi kutubxona yo'q: brief "yashirin bog'liqlik qo'shmang" deydi.
     Store usuli to'liq ZIP standarti (method 0) — har qanday arxivator ochadi. */

  function zip(files) {
    var parts = [], central = [], offset = 0;

    files.forEach(function (f) {
      var nameBytes = utf8(f.name);
      var data = f.data instanceof Uint8Array ? f.data : utf8(String(f.data));
      var crc = crc32(data);

      var local = new Uint8Array(30 + nameBytes.length);
      var dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true);      // local file header
      dv.setUint16(4, 20, true);              // version needed
      dv.setUint16(6, 0x0800, true);          // UTF-8 nomlar
      dv.setUint16(8, 0, true);               // method: store
      dv.setUint16(10, 0, true);              // vaqt
      dv.setUint16(12, 0, true);              // sana
      dv.setUint32(14, crc, true);
      dv.setUint32(18, data.length, true);
      dv.setUint32(22, data.length, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);
      local.set(nameBytes, 30);

      parts.push(local, data);

      var cen = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(cen.buffer);
      cv.setUint32(0, 0x02014b50, true);      // central directory
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, data.length, true);
      cv.setUint32(24, data.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint32(42, offset, true);
      cen.set(nameBytes, 46);
      central.push(cen);

      offset += local.length + data.length;
    });

    var centralSize = central.reduce(function (a, c) { return a + c.length; }, 0);
    var end = new Uint8Array(22);
    var ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);

    var all = parts.concat(central, [end]);
    var total = all.reduce(function (a, p) { return a + p.length; }, 0);
    var out = new Uint8Array(total), pos = 0;
    all.forEach(function (p) { out.set(p, pos); pos += p.length; });
    return out;
  }

  /* ---------- 1. JSON eksport ------------------------------------------ */

  function buildJSON(state) {
    var s = state || (window.Store && Store.all ? Store.all() : {});
    var clean = stripSecrets(s);
    var body = JSON.stringify(clean);
    return {
      format: FORMAT,
      formatVersion: FORMAT_VERSION,
      schema: s.v || 0,
      exportedAt: new Date().toISOString(),
      app: 'UzLeeder Academy Personal OS',
      mission: OS.CFG ? {
        id: OS.CFG.mission.id, start: OS.CFG.mission.start,
        end: OS.CFG.mission.end, exam: OS.CFG.mission.exam,
        target: OS.CFG.target.overall
      } : null,
      records: recordCounts(clean),
      checksum: crc32(utf8(body)).toString(16),
      state: clean
    };
  }

  function recordCounts(s) {
    var n = function (o) { return o ? Object.keys(o).length : 0; };
    return {
      lessonScores: n(s.best),
      englishDays: n((s.eng || {}).done),
      quizAttempts: n(s.quiz),
      mistakes: (s.mistakes || []).length,
      reviewItems: n(s.review),
      notes: n(s.notes) + n((s.eng || {}).notes),
      bookmarks: n(s.bookmarks),
      tasks: n(s.osTasks),
      blockLog: n(s.blockLog),
      events: (s.events || []).length,
      sessions: n(s.sessions)
    };
  }

  function exportJSON() {
    var doc = buildJSON();
    download(JSON.stringify(doc, null, 2), fileName('json'), 'application/json');
    return doc;
  }

  /* ---------- 2. ZIP eksport (ma'lumot + manifest + fayllar) ----------- */

  function exportZIP() {
    var doc = buildJSON();
    var files = [
      { name: 'data.json', data: JSON.stringify(doc, null, 2) }
    ];

    /* Fayl manifesti: shaxsiy binary fayllar (OPFS / IndexedDB) */
    var listing = OS.db && OS.db.opfsSupported() ? OS.db.opfsList() : Promise.resolve([]);

    return listing.then(function (entries) {
      var reads = entries.filter(function (e) { return e.kind === 'file'; })
        .map(function (e) {
          return OS.db.opfsRead(e.name)
            .then(function (f) { return f.arrayBuffer(); })
            .then(function (buf) { return { name: 'files/' + e.name, data: new Uint8Array(buf) }; })
            .catch(function () { return null; });
        });
      return Promise.all(reads);
    }).then(function (blobs) {
      var manifest = { files: [], note: 'Personal binary files from this device.' };
      blobs.filter(Boolean).forEach(function (b) {
        files.push(b);
        manifest.files.push({ path: b.name, bytes: b.data.length, crc32: crc32(b.data).toString(16) });
      });
      manifest.exportedAt = doc.exportedAt;
      manifest.formatVersion = FORMAT_VERSION;
      manifest.dataChecksum = doc.checksum;
      files.splice(1, 0, { name: 'manifest.json', data: JSON.stringify(manifest, null, 2) });
      files.push({ name: 'README.txt', data: readme(doc) });

      var bytes = zip(files);
      download(bytes, fileName('zip'), 'application/zip');
      return { files: files.length, bytes: bytes.length, manifest: manifest };
    });
  }

  function readme(doc) {
    return [
      'UzLeeder Academy — Personal OS backup',
      '',
      'Exported: ' + doc.exportedAt,
      'Format: ' + doc.format + ' v' + doc.formatVersion,
      'Schema: ' + doc.schema,
      'Data checksum (CRC32): ' + doc.checksum,
      '',
      'data.json      — your structured learning records',
      'manifest.json  — file list with sizes and checksums',
      'files/         — your own binary files from this device',
      '',
      'This archive contains NO password, session or token.',
      'It cannot be used to sign in to the account.',
      ''
    ].join('\n');
  }

  /* ---------- 3. Import: tekshiruv va ko'rib chiqish -------------------- */

  /* Avval FAQAT tekshiradi va nimani o'zgartirishini aytadi. Hech narsa
     yozilmaydi — foydalanuvchi ko'rib chiqadi.                           */
  function inspect(text) {
    var doc;
    try { doc = JSON.parse(text); } catch (e) {
      return { ok: false, reason: 'not-json' };
    }
    /* Eski format: to'g'ridan-to'g'ri holat obyekti */
    var incoming = doc && doc.state ? doc.state : doc;
    if (!incoming || typeof incoming !== 'object') return { ok: false, reason: 'shape' };

    if (doc.format && doc.format !== FORMAT) {
      return { ok: false, reason: 'foreign-format', format: doc.format };
    }

    /* Sir bo'lsa — rad etamiz (import qilinmaydi, jimgina tashlanmaydi) */
    var secrets = findSecrets(incoming);

    var current = window.Store && Store.all ? Store.all() : {};
    var mine = recordCounts(current);
    var theirs = recordCounts(incoming);

    var dup = duplicates(current, incoming);
    var conflicts = conflictList(current, incoming);

    return {
      ok: true,
      format: doc.format || 'legacy',
      formatVersion: doc.formatVersion || 0,
      schema: incoming.v || doc.schema || 0,
      exportedAt: doc.exportedAt || null,
      checksumOk: doc.checksum ? (crc32(utf8(JSON.stringify(incoming))).toString(16) === doc.checksum) : null,
      current: mine,
      incoming: theirs,
      duplicates: dup,
      conflicts: conflicts,
      secretsFound: secrets,
      state: incoming
    };
  }

  function findSecrets(obj, path, out) {
    out = out || [];
    path = path || '';
    if (!obj || typeof obj !== 'object' || out.length > 20) return out;
    Object.keys(obj).forEach(function (k) {
      var low = k.toLowerCase();
      for (var i = 0; i < NEVER_EXPORT.length; i++) {
        if (low.indexOf(NEVER_EXPORT[i]) >= 0) { out.push(path + k); return; }
      }
      if (obj[k] && typeof obj[k] === 'object') findSecrets(obj[k], path + k + '.', out);
    });
    return out;
  }

  /* Dublikat: bir xil id, bir xil vaqt belgisi */
  function duplicates(a, b) {
    var out = { mistakes: 0, review: 0, bookmarks: 0, tasks: 0 };
    var aM = {}; (a.mistakes || []).forEach(function (m) { aM[m.id] = m; });
    (b.mistakes || []).forEach(function (m) { if (aM[m.id]) out.mistakes++; });
    Object.keys(b.review || {}).forEach(function (k) { if ((a.review || {})[k]) out.review++; });
    Object.keys(b.bookmarks || {}).forEach(function (k) { if ((a.bookmarks || {})[k]) out.bookmarks++; });
    Object.keys(b.osTasks || {}).forEach(function (k) { if ((a.osTasks || {})[k]) out.tasks++; });
    return out;
  }

  /* To'qnashuv: bir xil id, LEKIN boshqa mazmun */
  function conflictList(a, b) {
    var out = [];
    Object.keys(b.best || {}).forEach(function (d) {
      if ((a.best || {})[d] != null && a.best[d] !== b.best[d]) {
        out.push({ kind: 'lessonScore', id: d, mine: a.best[d], theirs: b.best[d] });
      }
    });
    Object.keys(b.quiz || {}).forEach(function (k) {
      var m = (a.quiz || {})[k], t = b.quiz[k];
      if (m && t && m.best !== t.best) out.push({ kind: 'quiz', id: k, mine: m.best, theirs: t.best });
    });
    var aM = {}; (a.mistakes || []).forEach(function (m) { aM[m.id] = m; });
    (b.mistakes || []).forEach(function (m) {
      var mine = aM[m.id];
      if (mine && mine.fixed !== m.fixed) out.push({ kind: 'mistake', id: m.id, mine: !!mine.fixed, theirs: !!m.fixed });
    });
    return out.slice(0, 50);
  }

  /* ---------- 4. Import: xavfsiz birlashtirish -------------------------- */

  /* strategy: 'merge' (standart, hech narsa yo'qolmaydi) yoki 'replace'.
     Har ikkalasida ham AVVAL zaxira olinadi va xato bo'lsa qaytariladi.  */
  function apply(text, strategy) {
    var check = inspect(text);
    if (!check.ok) return { ok: false, reason: check.reason };

    var backupKey = OS.migrate ? OS.migrate.backupNow() : null;
    var before = null;
    try { before = localStorage.getItem('uzla.state'); } catch (e) {}

    try {
      var incoming = stripSecrets(check.state);          // sir hech qachon kirmaydi
      var current = Store.all();
      var next;

      if (strategy === 'replace') {
        next = incoming;
      } else {
        next = mergeStates(current, incoming);
      }

      /* Qurilma sozlamalari HAR DOIM shu qurilmaniki */
      next.lang = current.lang;
      next.theme = current.theme;
      next.settings = current.settings;

      Store.replace(Store.migrate ? Store.migrate(next) : next, true);

      return {
        ok: true, strategy: strategy || 'merge', backup: backupKey,
        conflicts: check.conflicts, duplicates: check.duplicates,
        secretsRemoved: check.secretsFound
      };
    } catch (e) {
      /* Orqaga qaytish */
      try { if (before) localStorage.setItem('uzla.state', before); } catch (e2) {}
      try { if (window.Store && Store.init) Store.init(); } catch (e3) {}
      return { ok: false, reason: String(e && e.message || e), rolledBack: true, backup: backupKey };
    }
  }

  /* Birlashtirish: bajarilgan ish YO'QOLMAYDI (OR / maksimum / yangirog'i) */
  function mergeStates(a, b) {
    function orMap(x, y) {
      var o = {};
      Object.keys(x || {}).forEach(function (k) { if (x[k]) o[k] = x[k]; });
      Object.keys(y || {}).forEach(function (k) { if (y[k]) o[k] = y[k]; });
      return o;
    }
    function maxMap(x, y) {
      var o = {};
      Object.keys(x || {}).forEach(function (k) { o[k] = x[k]; });
      Object.keys(y || {}).forEach(function (k) { o[k] = Math.max(o[k] || 0, y[k] || 0); });
      return o;
    }
    function newer(x, y) {
      var o = {};
      Object.keys(x || {}).forEach(function (k) { o[k] = x[k]; });
      Object.keys(y || {}).forEach(function (k) {
        if (!o[k] || ((y[k] || {}).at || 0) > ((o[k] || {}).at || 0)) o[k] = y[k];
      });
      return o;
    }

    var out = JSON.parse(JSON.stringify(a || {}));
    out.best = maxMap(a.best, b.best);
    out.scores = Object.assign({}, b.scores || {}, a.scores || {});
    out.activity = maxMap(a.activity, b.activity);
    out.plan = orMap(a.plan, b.plan);
    out.notes = newer(a.notes, b.notes);
    out.quiz = newer(a.quiz, b.quiz);
    out.review = newer(a.review, b.review);
    out.bookmarks = newer(a.bookmarks, b.bookmarks);
    out.osTasks = newer(a.osTasks, b.osTasks);
    out.blockLog = newer(a.blockLog, b.blockLog);
    out.done = orMap(a.done, b.done);
    out.eng = {
      done: orMap((a.eng || {}).done, (b.eng || {}).done),
      tasks: orMap((a.eng || {}).tasks, (b.eng || {}).tasks),
      scores: newer((a.eng || {}).scores, (b.eng || {}).scores),
      notes: newer((a.eng || {}).notes, (b.eng || {}).notes)
    };
    out.habit = (function () {
      var o = {};
      Object.keys(a.habit || {}).forEach(function (d) { o[d] = orMap(a.habit[d], {}); });
      Object.keys(b.habit || {}).forEach(function (d) { o[d] = orMap(o[d], b.habit[d]); });
      return o;
    })();

    /* Xatolar: id bo'yicha, yangirog'i; hal bo'lgani YO'QOLMAYDI */
    var byId = {};
    (a.mistakes || []).forEach(function (m) { byId[m.id] = m; });
    (b.mistakes || []).forEach(function (m) {
      var cur = byId[m.id];
      if (!cur) { byId[m.id] = m; return; }
      byId[m.id] = (m.at || 0) > (cur.at || 0) ? m : cur;
      byId[m.id].fixed = cur.fixed || m.fixed;             // tuzatilgani saqlanadi
      byId[m.id].times = Math.max(cur.times || 1, m.times || 1);
    });
    out.mistakes = Object.keys(byId).map(function (k) { return byId[k]; });

    /* Hodisalar: id bo'yicha birlashma, oxirgi 400 ta */
    var ev = {};
    (a.events || []).concat(b.events || []).forEach(function (e) { if (e && e.id) ev[e.id] = e; });
    out.events = Object.keys(ev).map(function (k) { return ev[k]; })
      .sort(function (x, y) { return (x.at || 0) - (y.at || 0); }).slice(-400);

    /* Sessiyalar va soatlar: maksimum (ikki qurilmada yozilgani yo'qolmasin) */
    out.sessions = {};
    Object.keys(b.sessions || {}).forEach(function (k) { out.sessions[k] = { min: (b.sessions[k] || {}).min || 0 }; });
    Object.keys(a.sessions || {}).forEach(function (k) {
      out.sessions[k] = { min: Math.max((out.sessions[k] || {}).min || 0, (a.sessions[k] || {}).min || 0) };
    });

    return out;
  }

  /* ---------- yordamchilar --------------------------------------------- */

  function fileName(ext) {
    var d = new Date();
    var stamp = d.toISOString().slice(0, 10);
    return 'uzleeder-personal-os-' + stamp + '.' + ext;
  }

  function download(data, name, mime) {
    try {
      var blob = data instanceof Uint8Array ? new Blob([data], { type: mime }) : new Blob([data], { type: mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
      return true;
    } catch (e) { return false; }
  }

  var API = {
    FORMAT: FORMAT, FORMAT_VERSION: FORMAT_VERSION,
    crc32: crc32, zip: zip, utf8: utf8,
    stripSecrets: stripSecrets, findSecrets: findSecrets,
    buildJSON: buildJSON, recordCounts: recordCounts,
    exportJSON: exportJSON, exportZIP: exportZIP,
    inspect: inspect, apply: apply, mergeStates: mergeStates,
    duplicates: duplicates, conflictList: conflictList
  };

  if (typeof window !== 'undefined') OS.backup = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
