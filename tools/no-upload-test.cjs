/* ==========================================================================
   tools/no-upload-test.cjs — SHAXSIY PROGRESS BULUTGA KETMAYDI
   --------------------------------------------------------------------------
   Brief 13-bo'lim talab qiladi: "Add a specific test proving that normal
   learning activity does not upload personal progress to a cloud state
   endpoint."

   Shuning uchun bu test js/sync.js ning HAQIQIY kodini yuklaydi, tarmoqni
   josuslik qiluvchi fetch bilan almashtiradi va oddiy o'quv ishini
   taqlid qiladi: dars yopish, test topshirish, xato yozish, eslatma
   qo'shish, sahifani yopish, tabga qaytish.

   Agar birorta so'rov /api/state ga ketsa — TEST YIQILADI.

   Testning o'zi haqiqatan ishlashini isbotlash uchun oxirida sinxron
   ATAYLAB yoqiladi: o'shanda so'rov KETISHI shart. Aks holda test
   "hech narsa yubormaydi" degan yolg'onni ham o'tkazib yuborardi.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;

function ok(cond, name) {
  if (cond) { pass++; console.log('ok   ' + name); }
  else { fail++; console.log('FAIL ' + name); }
}
function head(t) { console.log(''); console.log(t); console.log('-'.repeat(t.length)); }

/* ---------- Soxta brauzer muhiti -------------------------------------- */
function makeEnv(cloudSync) {
  const calls = [];
  const listeners = {};
  const storeListeners = [];

  const state = {
    v: 10, lang: 'uz', theme: 'os', name: 'Leejon',
    best: {}, scores: {}, notes: {}, mistakes: [], quiz: {}, review: {},
    eng: { done: {}, tasks: {}, scores: {}, notes: {} },
    events: [], sessions: {}, osTasks: {},
    settings: { cloudSync: cloudSync }
  };

  const sandbox = {
    console, Date, Math, JSON, Object, Array, String, Number, RegExp,
    setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout,
    Promise,

    /* Tarmoq: har chaqiruv yoziladi, hech qayerga ketmaydi */
    fetch: function (url, opts) {
      calls.push({ url: String(url), method: (opts && opts.method) || 'GET', keepalive: !!(opts && opts.keepalive) });
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ rev: 1, savedAt: 1, state: null })
      });
    },

    location: { protocol: 'https:', hostname: 'academy.example', pathname: '/', search: '', hash: '', replace: function () {} },

    localStorage: (function () {
      const m = {};
      return {
        getItem: k => (k in m ? m[k] : null),
        setItem: (k, v) => { m[k] = String(v); },
        removeItem: k => { delete m[k]; },
        key: i => Object.keys(m)[i] || null,
        get length() { return Object.keys(m).length; }
      };
    })(),

    document: {
      visibilityState: 'visible',
      addEventListener: (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); }
    },

    navigator: { onLine: true },

    /* Haqiqiy Store o'rniga: sync.js ishlatadigan yuzasi */
    Store: {
      all: () => state,
      get: k => state[k],
      set: (k, v) => { state[k] = v; fire(); },
      setting: k => state.settings[k],
      setSetting: (k, v) => { state.settings[k] = v; fire(); },
      onChange: fn => { storeListeners.push(fn); },
      replace: (o) => { Object.assign(state, o); },
      clone: o => JSON.parse(JSON.stringify(o)),
      migrate: o => o,
      /* O'quv harakatlari — har biri holatni o'zgartiradi */
      recordScore: (day, score) => { state.best[day] = score; state.scores[day] = score; fire(); },
      addMistake: (id) => { state.mistakes.push({ id: id, at: Date.now() }); fire(); },
      quizSet: (k, s, t) => { state.quiz[k] = { score: s, total: t, at: Date.now() }; fire(); },
      setNote: (d, t) => { state.notes[d] = { text: t, at: Date.now() }; fire(); },
      engSetDayDone: (d) => { state.eng.done[d] = true; fire(); },
      sessionAdd: (k, min) => { state.sessions[k] = { min: min }; fire(); },
      logEvent: (type, ref, title) => { state.events.push({ id: 'e' + state.events.length, at: Date.now(), type, ref, title }); fire(); }
    }
  };

  function fire() { storeListeners.forEach(fn => { try { fn(); } catch (e) {} }); }

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.addEventListener = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };

  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/sync.js'), 'utf8'), sandbox, { filename: 'js/sync.js' });

  return {
    sandbox, calls, state,
    emit: (ev) => (listeners[ev] || []).forEach(fn => { try { fn({}); } catch (e) {} }),
    stateCalls: () => calls.filter(c => /\/api\/state/.test(c.url))
  };
}

/* ====================== 1. ODATDAGI O'QUV ISHI ======================== */
head('Oddiy o\'quv ishi — bulutga HECH NARSA ketmaydi');

const env = makeEnv(false);
const Sync = env.sandbox.Sync;
const Store = env.sandbox.Store;

ok(typeof Sync.autoEnabled === 'function', 'Sync.autoEnabled mavjud');
ok(Sync.autoEnabled() === false, 'avtomatik sinxron standart holatda O\'CHIQ');

Sync.init();
ok(env.stateCalls().length === 0, 'ishga tushganda /api/state ga so\'rov YO\'Q');
ok(Sync.status() === 'off', 'holat: off');

/* Haqiqiy o'quv harakatlari */
Store.recordScore(1, 9);              // dars testi topshirildi
Store.quizSet('eng:3', 8, 10);        // ingliz tili testi
Store.addMistake('3:1');              // xato yozildi
Store.setNote(3, 'personal note');    // shaxsiy eslatma
Store.engSetDayDone(3);               // kun yopildi
Store.sessionAdd('2026-12-01', 95);   // o'lchangan vaqt
Store.logEvent('review', 'vocab:w1', 'takror');

ok(env.stateCalls().length === 0, 'yetti xil o\'quv harakatidan keyin ham so\'rov YO\'Q');

/* Kutib ko'ramiz: push 1.5 soniyalik kechikish bilan ketardi */
const waited = new Promise(resolve => setTimeout(resolve, 2100));

waited.then(() => {
  ok(env.stateCalls().length === 0, '2.1 soniya kutilgandan keyin ham so\'rov YO\'Q (kechiktirilgan push yo\'q)');

  /* Tabga qaytish va sahifani yopish */
  env.emit('visibilitychange');
  env.emit('pagehide');
  env.emit('online');
  ok(env.stateCalls().length === 0, 'tabga qaytish, sahifani yopish va onlayn bo\'lish ham so\'rov yubormaydi');

  const beacons = env.calls.filter(c => c.keepalive);
  ok(beacons.length === 0, 'pagehide beacon (keepalive) YUBORILMAYDI');

  /* Hech qanday boshqa manzilga ham ketmaganini tekshiramiz */
  ok(env.calls.length === 0, 'umuman birorta tarmoq so\'rovi yo\'q (' + env.calls.length + ')');

  /* ============ 2. ANIQ SO'RALGANDA ESA ISHLAYDI ================= */
  head('Aniq so\'rov bilan: Sync.importOnce() — faqat O\'QIYDI');

  return Sync.importOnce().then(r => {
    const after = env.stateCalls();
    ok(after.length === 1, 'importOnce AYNAN bitta so\'rov qiladi');
    ok(after[0].method === 'GET', 'importOnce faqat GET — hech narsa YOZMAYDI');
    ok(env.calls.filter(c => c.method === 'PUT').length === 0, 'hech qachon PUT /api/state yo\'q');

    /* ============ 3. TEST HAQIQIYLIGI ============================= */
    head('Nazorat: sinqron ATAYLAB yoqilsa so\'rov KETISHI shart');

    const on = makeEnv(true);
    on.sandbox.Sync.init();
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      ok(on.stateCalls().length > 0,
        'yoqilganda so\'rov ketadi — demak yuqoridagi "so\'rov yo\'q" natijasi haqiqiy');

      /* ============ XULOSA ======================================== */
      console.log('');
      console.log(fail
        ? 'FAIL — ' + fail + ' ta xato, ' + pass + ' ta ok'
        : 'ALL OK — ' + pass + ' ta tekshiruv · shaxsiy progress bulutga ketmaydi');
      process.exit(fail ? 1 : 0);
    });
  });
}).catch(e => {
  console.log('FAIL — kutilmagan xato: ' + (e && e.stack || e));
  process.exit(1);
});
