/* ==========================================================================
   OS.db — mahalliy ma'lumotlar bazasi (IndexedDB) va markazlashgan kirish
   Local-first data layer: one repository over IndexedDB
   --------------------------------------------------------------------------
   Brief 8-bo'lim. Shaxsiy o'quv yozuvlari QURILMADA qoladi.

   Nega IndexedDB: localStorage bitta kalitga sig'adi, har yozishda BUTUN
   holat qayta yoziladi va ~5 MB da tugaydi (audit §9 A1–A2). IndexedDB
   ombor-ombor ishlaydi, so'rov qila oladi va hajmi kattaroq.

   Omborlar (brief ro'yxati bo'yicha):
     profile · settings · missions · tasks · scheduleBlocks · studySessions
     learningTracks · lessonProgress · quizAttempts · skillAssessments
     vocabulary · reviewQueue · mistakes · mockExams · notes · bookmarks
     projects · activityEvents · migrationHistory

   MUHIM: bu modul localStorage'dagi `uzla.state` ni O'CHIRMAYDI. Ko'chirish
   (OS.migrate) nusxa ko'chiradi va tekshiradi; asl holat joyida qoladi,
   shuning uchun orqaga qaytish mumkin.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};

  var NAME = 'uzleeder-os';
  var VERSION = 1;

  var STORES = [
    'profile', 'settings', 'missions', 'tasks', 'scheduleBlocks', 'studySessions',
    'learningTracks', 'lessonProgress', 'quizAttempts', 'skillAssessments',
    'vocabulary', 'reviewQueue', 'mistakes', 'mockExams', 'notes', 'bookmarks',
    'projects', 'activityEvents', 'migrationHistory'
  ];

  /* Qaysi omborda qanday indeks kerak — so'rov qilish uchun */
  var INDEXES = {
    tasks: [['date', 'date'], ['status', 'status'], ['cat', 'cat']],
    scheduleBlocks: [['date', 'date']],
    studySessions: [['date', 'date']],
    lessonProgress: [['track', 'track'], ['status', 'status']],
    quizAttempts: [['at', 'at'], ['ref', 'ref']],
    skillAssessments: [['skill', 'skill'], ['at', 'at']],
    vocabulary: [['due', 'due']],
    reviewQueue: [['due', 'due'], ['kind', 'kind']],
    mistakes: [['at', 'at'], ['resolved', 'resolved']],
    mockExams: [['at', 'at']],
    notes: [['at', 'at']],
    bookmarks: [['at', 'at']],
    activityEvents: [['at', 'at'], ['type', 'type']],
    migrationHistory: [['at', 'at']]
  };

  var dbp = null;

  function supported() {
    try { return typeof indexedDB !== 'undefined' && !!indexedDB; } catch (e) { return false; }
  }

  function open() {
    if (dbp) return dbp;
    if (!supported()) return Promise.reject(new Error('indexeddb-unsupported'));
    dbp = new Promise(function (resolve, reject) {
      var req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = function (e) {
        var db = req.result;
        STORES.forEach(function (name) {
          var s = db.objectStoreNames.contains(name)
            ? req.transaction.objectStore(name)
            : db.createObjectStore(name, { keyPath: 'id' });
          (INDEXES[name] || []).forEach(function (ix) {
            if (!s.indexNames.contains(ix[0])) s.createIndex(ix[0], ix[1], { unique: false });
          });
        });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('indexeddb-open-failed')); };
      req.onblocked = function () { reject(new Error('indexeddb-blocked')); };
    });
    return dbp;
  }

  function tx(store, mode) {
    return open().then(function (db) {
      return { t: db.transaction(store, mode || 'readonly'), db: db };
    });
  }

  function wrap(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  /* ---------- CRUD ------------------------------------------------------ */

  function put(store, record) {
    if (!record || record.id == null) return Promise.reject(new Error('record-needs-id'));
    return tx(store, 'readwrite').then(function (c) {
      return wrap(c.t.objectStore(store).put(record));
    });
  }

  function putMany(store, records) {
    if (!records || !records.length) return Promise.resolve(0);
    return tx(store, 'readwrite').then(function (c) {
      var s = c.t.objectStore(store);
      records.forEach(function (r) { if (r && r.id != null) s.put(r); });
      return new Promise(function (resolve, reject) {
        c.t.oncomplete = function () { resolve(records.length); };
        c.t.onerror = function () { reject(c.t.error); };
        c.t.onabort = function () { reject(c.t.error || new Error('aborted')); };
      });
    });
  }

  function get(store, id) {
    return tx(store).then(function (c) { return wrap(c.t.objectStore(store).get(id)); });
  }

  function all(store) {
    return tx(store).then(function (c) { return wrap(c.t.objectStore(store).getAll()); });
  }

  function count(store) {
    return tx(store).then(function (c) { return wrap(c.t.objectStore(store).count()); });
  }

  function del(store, id) {
    return tx(store, 'readwrite').then(function (c) { return wrap(c.t.objectStore(store).delete(id)); });
  }

  function clear(store) {
    return tx(store, 'readwrite').then(function (c) { return wrap(c.t.objectStore(store).clear()); });
  }

  /* Indeks bo'yicha so'rov: byIndex('tasks', 'date', '2026-12-01') */
  function byIndex(store, index, value) {
    return tx(store).then(function (c) {
      var s = c.t.objectStore(store);
      if (!s.indexNames.contains(index)) return [];
      return wrap(s.index(index).getAll(value));
    });
  }

  /* Oraliq bo'yicha: range('tasks', 'date', '2026-12-01', '2026-12-31') */
  function range(store, index, from, to) {
    return tx(store).then(function (c) {
      var s = c.t.objectStore(store);
      if (!s.indexNames.contains(index)) return [];
      return wrap(s.index(index).getAll(IDBKeyRange.bound(from, to)));
    });
  }

  /* ---------- hajm va barqarorlik --------------------------------------- */

  /* Brauzer xotirasi DOIMIY EMAS (audit §9 A5). Shuning uchun:
     1) doimiylik so'raladi, 2) hajm ko'rsatiladi, 3) zaxira eslatiladi. */
  function persist() {
    try {
      if (navigator.storage && navigator.storage.persist) return navigator.storage.persist();
    } catch (e) {}
    return Promise.resolve(false);
  }

  function persisted() {
    try {
      if (navigator.storage && navigator.storage.persisted) return navigator.storage.persisted();
    } catch (e) {}
    return Promise.resolve(false);
  }

  function usage() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        return navigator.storage.estimate().then(function (e) {
          return { usage: e.usage || 0, quota: e.quota || 0 };
        });
      }
    } catch (e) {}
    return Promise.resolve({ usage: 0, quota: 0 });
  }

  function counts() {
    return Promise.all(STORES.map(function (s) {
      return count(s).then(function (n) { return [s, n]; }).catch(function () { return [s, -1]; });
    })).then(function (pairs) {
      var out = {};
      pairs.forEach(function (p) { out[p[0]] = p[1]; });
      return out;
    });
  }

  /* ---------- OPFS (katta shaxsiy fayllar) ------------------------------ */

  /* Katta fayllar (audio, video, PDF) uchun Origin Private File System.
     Qo'llab-quvvatlanmasa — IndexedDB blob sifatida zaxira yo'l.        */
  function opfsSupported() {
    try { return !!(navigator.storage && navigator.storage.getDirectory); } catch (e) { return false; }
  }

  function opfsDir() {
    if (!opfsSupported()) return Promise.reject(new Error('opfs-unsupported'));
    return navigator.storage.getDirectory().then(function (root) {
      return root.getDirectoryHandle('uzleeder', { create: true });
    });
  }

  function opfsWrite(name, blob) {
    return opfsDir().then(function (dir) {
      return dir.getFileHandle(name, { create: true }).then(function (fh) {
        return fh.createWritable().then(function (w) {
          return w.write(blob).then(function () { return w.close(); });
        });
      });
    });
  }

  function opfsRead(name) {
    return opfsDir().then(function (dir) {
      return dir.getFileHandle(name).then(function (fh) { return fh.getFile(); });
    });
  }

  function opfsList() {
    if (!opfsSupported()) return Promise.resolve([]);
    return opfsDir().then(function (dir) {
      var out = [];
      var it = dir.entries ? dir.entries() : null;
      if (!it) return out;
      function step() {
        return it.next().then(function (r) {
          if (r.done) return out;
          out.push({ name: r.value[0], kind: r.value[1].kind });
          return step();
        });
      }
      return step();
    }).catch(function () { return []; });
  }

  OS.db = {
    NAME: NAME, VERSION: VERSION, STORES: STORES,
    supported: supported, open: open,
    put: put, putMany: putMany, get: get, all: all, count: count, counts: counts,
    del: del, clear: clear, byIndex: byIndex, range: range,
    persist: persist, persisted: persisted, usage: usage,
    opfsSupported: opfsSupported, opfsWrite: opfsWrite, opfsRead: opfsRead, opfsList: opfsList
  };
})();
