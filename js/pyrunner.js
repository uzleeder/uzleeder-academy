/* ==========================================================================
   PyRunner — mashq kodini tekshirish (Pyodide, Web Worker ichida)
   --------------------------------------------------------------------------
   Nima qiladi: o'quvchi kodi + ISHONCHLI testlar (kurs ma'lumotidan) Pyodide
   (CPython → WebAssembly) bilan alohida Worker'da bajariladi.
     • Asosiy oqim (sahifa) muzlamaydi; vaqt chegarasi (standart 8 s) o'tsa
       Worker o'chiriladi (terminate) va yangisi yaratiladi — cheksiz sikl
       sahifani osib qo'ymaydi.
     • Har ishga tushirish — toza namespace (dict). input() → xato beradi.
     • Testlar funksiya chaqiruvi bilan (assert), aniq satrni yodlash emas.
   HALOL CHEGARA: bu xavfsizlik sandbox'i EMAS — kod sizning brauzeringizda,
   sizning ruxsatingiz bilan ishlaydi; serverda hech narsa bajarilmaydi.
   Mashqlar tarmoqqa murojaat qilmaydi (HTTP mashqlari soxta "mock" bilan).
   Adapter: PyRunner.run({code, tests, pkgs, timeout}) → Promise<result>.
   Kelajakda server sandbox qo'shilsa — shu interfeys saqlanadi.
   ========================================================================== */
(function () {
  'use strict';
  var URL0 = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  var WORKER_SRC = [
    "importScripts('" + URL0 + "pyodide.js');",
    "var ready = loadPyodide({ indexURL: '" + URL0 + "' }).then(function (py) {",
    "  py.runPython('import builtins\\ndef _no_input(*a, **k):\\n    raise RuntimeError(\"input() is not available in exercises - use function parameters\")\\nbuiltins.input = _no_input\\n');",
    "  return py; });",
    "var HARNESS = [",
    "'import sys, io, traceback, json',",
    "'def __uz_run(code, tests):',",
    "'    out = io.StringIO(); old = sys.stdout; sys.stdout = out; ns = {\"__name__\": \"__main__\"}; res = {\"ok\": True, \"error\": None, \"tests\": []}',",
    "'    try:',",
    "'        exec(compile(code, \"solution.py\", \"exec\"), ns)',",
    "'    except BaseException as e:',",
    "'        res[\"ok\"] = False; res[\"error\"] = \"\".join(traceback.format_exception_only(type(e), e)).strip(); res[\"trace\"] = traceback.format_exc(limit=3)',",
    "'    if res[\"ok\"]:',",
    "'        for t in tests:',",
    "'            try:',",
    "'                exec(compile(t[\"code\"], \"test\", \"exec\"), ns)',",
    "'                res[\"tests\"].append({\"name\": t[\"name\"], \"pass\": True})',",
    "'            except AssertionError as e:',",
    "'                res[\"tests\"].append({\"name\": t[\"name\"], \"pass\": False, \"msg\": str(e) or \"assertion failed\"})',",
    "'            except BaseException as e:',",
    "'                res[\"tests\"].append({\"name\": t[\"name\"], \"pass\": False, \"msg\": type(e).__name__ + \": \" + str(e)})',",
    "'    sys.stdout = old; res[\"stdout\"] = out.getvalue()[-4000:]',",
    "'    return json.dumps(res)'",
    "].join('\\n');",
    "self.onmessage = function (ev) { var m = ev.data; ready.then(function (py) {",
    "  var p = (m.pkgs && m.pkgs.length) ? py.loadPackage(m.pkgs) : Promise.resolve();",
    "  return p.then(function () { py.runPython(HARNESS); self.postMessage({ id: m.id, phase: 'start' }); var f = py.globals.get('__uz_run'); var r = f(m.code, py.toPy(m.tests || [])); f.destroy(); self.postMessage({ id: m.id, result: JSON.parse(r) }); });",
    "}).catch(function (e) { self.postMessage({ id: m.id, fatal: String(e && e.message || e) }); }); };"
  ].join('\n');

  /* Bir vaqtda bitta ish: qolganlari navbatda kutadi (Worker'ga yuborilmaydi).
     Vaqt chegarasi ish BOSHLANGANDA yoqiladi — navbatda kutish hisoblanmaydi.
     Vaqt tugasa Worker o'chiriladi; navbatdagilar yangi Worker'da davom etadi. */
  var worker = null, seq = 0, queue = [], active = null, warm = false;
  function make() {
    var blob = new Blob([WORKER_SRC], { type: 'text/javascript' });
    worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function (ev) {
      if (!active || ev.data.id !== active.id) return;
      /* Yuklash tugadi, o'quvchi kodi boshlandi — endi faqat kod vaqti hisoblanadi */
      if (ev.data.phase === 'start') { warm = true; armCode(active); return; }
      var job = active; active = null; clearTimeout(job.timer); warm = true;
      if (ev.data.fatal) job.reject(new Error(ev.data.fatal)); else job.resolve(ev.data.result);
      pump();
    };
    worker.onerror = function (e) {
      var job = active; active = null; kill();
      if (job) { clearTimeout(job.timer); job.reject(new Error(e.message || 'worker error')); }
      pump();
    };
  }
  function kill() { if (worker) worker.terminate(); worker = null; warm = false; }
  /* 2-bosqich: o'quvchi kodi — qat'iy chegara (standart 8 s) */
  function armCode(job) {
    clearTimeout(job.timer);
    job.timer = setTimeout(function () {
      if (active !== job) return;
      active = null; kill();
      job.resolve({ ok: false, timeout: true, error: 'Timeout: code ran longer than ' + Math.round((job.o.timeout || 8000) / 1000) + ' s (infinite loop?) — the checker was restarted.', tests: [], stdout: '' });
      pump();
    }, job.o.timeout || 8000);
  }
  function pump() {
    if (active || !queue.length) return;
    if (!worker) make();
    var job = active = queue.shift();
    /* 1-bosqich: Pyodide va paketlarni yuklash (internetga bog'liq) — keng chegara */
    job.timer = setTimeout(function () {
      if (active !== job) return;
      active = null; kill();
      job.reject(new Error('Python could not be loaded in time (check the internet connection)'));
      pump();
    }, 120000);
    worker.postMessage({ id: job.id, code: String(job.o.code || ''), tests: job.o.tests || [], pkgs: job.o.pkgs || [] });
  }

  window.PyRunner = {
    available: function () { return typeof Worker !== 'undefined' && typeof Blob !== 'undefined'; },
    isWarm: function () { return warm; },
    busy: function () { return !!active || queue.length > 0; },
    /* {code, tests:[{name, code}], pkgs:[], timeout(ms)} → {ok, error, tests:[{name, pass, msg}], stdout, timeout?} */
    run: function (o) {
      if (!PyRunner.available()) return Promise.reject(new Error('no-worker'));
      return new Promise(function (resolve, reject) {
        queue.push({ id: ++seq, o: o, resolve: resolve, reject: reject, timer: null });
        pump();
      });
    },
    reset: function () { queue.length = 0; if (active) { clearTimeout(active.timer); active = null; } kill(); }
  };
})();
