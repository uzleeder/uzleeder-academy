/* ==========================================================================
   Sync — progressni bulut bilan sinxronlash (Vercel /api/state)
   --------------------------------------------------------------------------
   Maqsad: qaysi kompyuterdan kirmasin, bir xil progress ko'rinsin.

   Qoidalar:
     • localStorage HAR DOIM asosiy manba — bulut uning nusxasi. Internet
       yo'q, file:// dan ochilgan, yoki login qilinmagan — ilova avvalgidek
       ishlayveradi, faqat sinxron bo'lmaydi.
     • Yuklanganda avval TORTILADI (pull), keyin yoziladi. Boshqa
       kompyuterdagi ish shu yerda paydo bo'ladi.
     • Har o'zgarish 1.5 s kutib bulutga YUBORILADI (push) — har bosishda
       so'rov ketmasin.
     • Push `baseRev` bilan boradi. Server 409 qaytarsa — kimdir orada
       yozgan: ikkalasini BIRLASHTIRIB qayta yuboramiz. Odatda bu bo'lmaydi
       (bitta odam ikki kompyuterda bir vaqtda ishlamaydi), lekin eskirgan
       tab bugungi ishni o'chirib yubormasligi kerak.
     • Tab'ga qaytilganda (focus) yana pull — kecha ochiq qolgan tab
       bugungi ishni ko'rsin.

   Birlashtirish (merge) — faqat 409 da va birinchi login'da:
     done/tasks/habit/plan  → birlashma (OR): bajarilgan narsa yo'qolmaydi
     best/activity          → maksimum
     notes/speak/mistakes   → `at` bo'yicha yangisi
     scores                 → mahalliy bo'lsa mahalliy, aks holda bulut
     lang/theme/name/settings → mahalliy (bu qurilma sozlamasi)

   Sinxron meta (rev) holat ichida EMAS, alohida kalitda — u o'zi
   sinxronlanmasligi kerak.
   ========================================================================== */
(function () {
  'use strict';

  var META_KEY = 'uzla.sync';
  var PUSH_DELAY = 1500;

  var meta = { rev: 0, at: 0 };
  var status = 'off';          // off | out | in | error | busy | env
  var envMissing = [];         // env — server sozlanmagan (Vercel o'zgaruvchilari yo'q)
  var user = '';
  var timer = null;
  var pushing = false;
  var dirty = false;
  var watchers = [];

  function readMeta() {
    try { meta = JSON.parse(localStorage.getItem(META_KEY)) || meta; } catch (e) {}
    user = meta.user || '';
  }
  function writeMeta() { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) {} }

  function setStatus(s) {
    status = s;
    watchers.forEach(function (fn) { try { fn(s); } catch (e) {} });
  }

  /* Bulut umuman bormi: faqat http(s) orqali ochilganda */
  function available() {
    return location.protocol === 'http:' || location.protocol === 'https:';
  }

  function api(method, path, body) {
    return fetch('/api/' + path, {
      method: method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; });
    });
  }

  /* ---------- birlashtirish ---------------------------------------------- */
  function orMap(a, b) {
    var out = {};
    Object.keys(a || {}).forEach(function (k) { if (a[k]) out[k] = true; });
    Object.keys(b || {}).forEach(function (k) { if (b[k]) out[k] = true; });
    return out;
  }
  function maxMap(a, b) {
    var out = {};
    Object.keys(a || {}).forEach(function (k) { out[k] = a[k]; });
    Object.keys(b || {}).forEach(function (k) { out[k] = Math.max(out[k] || 0, b[k] || 0); });
    return out;
  }
  function newerMap(a, b) {
    var out = {};
    Object.keys(a || {}).forEach(function (k) { out[k] = a[k]; });
    Object.keys(b || {}).forEach(function (k) {
      if (!out[k] || (b[k] && (b[k].at || 0) > (out[k].at || 0))) out[k] = b[k];
    });
    return out;
  }
  function mergeMistakes(a, b) {
    var byId = {};
    (a || []).forEach(function (m) { byId[m.id] = m; });
    (b || []).forEach(function (m) {
      if (!byId[m.id] || (m.at || 0) > (byId[m.id].at || 0)) byId[m.id] = m;
    });
    return Object.keys(byId).map(function (k) { return byId[k]; });
  }
  function mergeHabit(a, b) {
    var out = {};
    Object.keys(a || {}).forEach(function (d) { out[d] = orMap(a[d], {}); });
    Object.keys(b || {}).forEach(function (d) { out[d] = orMap(out[d], b[d]); });
    return out;
  }

  function mergeStates(local, remote) {
    var L = local || {}, R = remote || {};
    /* Bulutdagi nusxa eski sxemada bo'lsa (v7: ingliz kunlari eski raqamda) — avval migratsiya */
    if (Store.migrate) { L = Store.migrate(L); R = Store.migrate(R); }
    var out = Store.clone(L);
    out.scores   = Object.assign({}, R.scores || {}, L.scores || {});
    out.best     = maxMap(R.best, L.best);
    out.notes    = newerMap(R.notes, L.notes);
    out.mistakes = mergeMistakes(R.mistakes, L.mistakes);
    out.activity = maxMap(R.activity, L.activity);
    out.plan     = orMap(R.plan, L.plan);
    out.eng = {
      done:   orMap((R.eng || {}).done, (L.eng || {}).done),
      tasks:  orMap((R.eng || {}).tasks, (L.eng || {}).tasks),
      scores: newerMap((R.eng || {}).scores, (L.eng || {}).scores),
      notes:  newerMap((R.eng || {}).notes, (L.eng || {}).notes)
    };
    out.habit = mergeHabit(R.habit, L.habit);
    out.habitLegacy = mergeHabit(R.habitLegacy, L.habitLegacy);   // migratsiya tarixi
    out.blockLog = newerMap(R.blockLog, L.blockLog);               // blok yakuni (§15)
    out.scheduleVersion = Math.max(R.scheduleVersion || 1, L.scheduleVersion || 1);
    out.speak = newerMap(R.speak, L.speak);
    out.bbc   = newerMap(R.bbc, L.bbc);
    out.read  = newerMap(R.read, L.read);
    /* Profil: matn — yangirog'i; sertifikatlar — id bo'yicha yangirog'i (o'chirilgani ham 'at' bilan) */
    var pl = L.profile || {}, pr = R.profile || {};
    out.profile = Object.assign({}, (pr.at || 0) > (pl.at || 0) ? pr : pl);
    out.profile.certs = newerMap(pr.certs, pl.certs);
    out.profile.projects = newerMap(pr.projects, pl.projects);
    if (!out.profile.photo) out.profile.photo = pr.photo || pl.photo || '';
    out.city = newerMap(R.city, L.city);
    out.movies = newerMap(R.movies, L.movies);   // metadata; fayl/thumbnail qurilmada (IndexedDB)
    out.rdimg  = newerMap(R.rdimg, L.rdimg);     // o'qish matni rasmlari: url bulutda, local — faqat yuklangan qurilmada
    /* v7 maydonlari */
    out.quiz = newerMap(R.quiz, L.quiz);
    out.review = newerMap(R.review, L.review);   // last — oxirgi baholash vaqti
    out.last = newerMap(R.last, L.last);
    out.bookmarks = newerMap(R.bookmarks, L.bookmarks);
    out.done = orMap(R.done, L.done);
    /* Faollik jurnali: id bo'yicha birlashma, vaqt bo'yicha tartib, 400 ta oxirgisi */
    var evm = {}; (R.events || []).concat(L.events || []).forEach(function (e) { if (e && e.id) evm[e.id] = e; });
    out.events = Object.keys(evm).map(function (k) { return evm[k]; }).sort(function (a, b) { return a.at - b.at; }).slice(-400);
    out.sessions = {};
    Object.keys(R.sessions || {}).forEach(function (k) { out.sessions[k] = { min: R.sessions[k].min || 0 }; });
    Object.keys(L.sessions || {}).forEach(function (k) { out.sessions[k] = { min: Math.max((out.sessions[k] || {}).min || 0, L.sessions[k].min || 0) }; });
    out.copy = { vocab: newerMap((R.copy || {}).vocab, (L.copy || {}).vocab), english: newerMap((R.copy || {}).english, (L.copy || {}).english), coding: newerMap((R.copy || {}).coding, (L.copy || {}).coding),
      free: newerMap((R.copy || {}).free, (L.copy || {}).free) };   // erkin daftarlar (matematika va h.k.)
    /* 2026-10: IELTS Mission va Python & AI yo'li — o'z birlashtirish qoidalari bilan */
    if (window.Mission && (L.mission || R.mission)) out.mission = Mission.merge(L.mission, R.mission);
    if (window.PyAI && (L.pyai || R.pyai)) out.pyai = PyAI.merge(L.pyai, R.pyai);
    /* Soatlar: har kun uchun maksimum — ikki qurilmada yozilgani yo'qolmasin */
    out.hours = {};
    Object.keys(R.hours || {}).forEach(function (k) { out.hours[k] = { eng: R.hours[k].eng || 0, code: R.hours[k].code || 0 }; });
    Object.keys(L.hours || {}).forEach(function (k) {
      var o = out.hours[k] || { eng: 0, code: 0 };
      out.hours[k] = { eng: Math.max(o.eng, L.hours[k].eng || 0), code: Math.max(o.code, L.hours[k].code || 0) };
    });
    return out;
  }

  function hasProgress(s) {
    if (!s) return false;
    return Object.keys(s.best || {}).length > 0 || Object.keys((s.eng || {}).done || {}).length > 0 ||
      Object.keys(s.habit || {}).length > 0 || Object.keys(s.notes || {}).length > 0 ||
      Object.keys((s.eng || {}).tasks || {}).length > 0;
  }

  /* ---------- pull ------------------------------------------------------- */
  function pull() {
    if (!available()) return Promise.resolve(false);
    setStatus('busy');
    return api('GET', 'state').then(function (r) {
      if (r.status === 401) { setStatus('out'); gate(); return false; }
      if (r.status === 500 && r.body && r.body.error === 'env') { envMissing = r.body.missing || []; setStatus('env'); return false; }
      if (r.status !== 200) { setStatus('error'); return false; }
      var doc = r.body;
      var local = Store.all();

      if (!doc.state) {
        // Bulut bo'sh — birinchi marta: mahalliyni yuboramiz
        meta.rev = doc.rev || 0; writeMeta();
        setStatus('in');
        return push(true);
      }
      if (doc.rev === meta.rev) { setStatus('in'); return false; }   // hech narsa o'zgarmagan

      var next, merged = false;
      if (meta.rev === 0 && hasProgress(local)) {
        // Bu qurilma bulutni birinchi marta ko'ryapti, lekin o'zida ham ish bor —
        // ustidan yozmaymiz, birlashtiramiz
        next = mergeStates(local, doc.state);
        merged = true;
      } else {
        next = doc.state;
      }
      // Qurilma sozlamalari bulutdan kelmasin
      next.lang = local.lang; next.theme = local.theme;
      next.settings = local.settings;

      Store.replace(next, true);
      meta.rev = doc.rev; meta.at = Date.now(); writeMeta();
      setStatus('in');
      if (window.App) { App.applyTheme(); App.render(); }
      if (merged) return push(true);   // birlashgan nusxani bulutga qaytaramiz
      return true;
    }).catch(function () { setStatus('error'); return false; });
  }

  /* ---------- push ------------------------------------------------------- */
  function push(now) {
    if (!available() || status === 'out' || status === 'off' || status === 'env') return Promise.resolve(false);
    dirty = true;
    if (!now) {
      clearTimeout(timer);
      timer = setTimeout(function () { push(true); }, PUSH_DELAY);
      return Promise.resolve(false);
    }
    if (pushing) return Promise.resolve(false);   // tugagach `dirty` tufayli yana yuboriladi
    pushing = true; dirty = false;
    clearTimeout(timer);
    setStatus('busy');

    return api('PUT', 'state', { baseRev: meta.rev, state: Store.all() }).then(function (r) {
      pushing = false;
      if (r.status === 200) {
        meta.rev = r.body.rev; meta.at = r.body.savedAt || Date.now(); writeMeta();
        setStatus('in');
        if (dirty) return push(true);
        return true;
      }
      if (r.status === 409) {
        // Boshqa qurilma oldinroq yozgan — birlashtirib qayta yuboramiz
        var merged = mergeStates(Store.all(), r.body.state);
        Store.replace(merged, true);
        meta.rev = r.body.rev; writeMeta();
        if (window.App) App.render();
        return push(true);
      }
      if (r.status === 401) { setStatus('out'); gate(); return false; }
      setStatus('error');
      return false;
    }).catch(function () { pushing = false; setStatus('error'); return false; });
  }

  /* ---------- login / logout -------------------------------------------- */
  function login(u, p) {
    return api('POST', 'login', { user: u, password: p }).then(function (r) {
      if (r.status === 200) {
        user = r.body.user || u;
        meta = { rev: 0, at: 0, user: user }; writeMeta();
        return pull().then(function () { return { ok: true }; });
      }
      if (r.status === 429) return { ok: false, reason: 'locked', retryMin: r.body.retryMin };
      if (r.status === 500 && r.body.error === 'env') return { ok: false, reason: 'env', missing: r.body.missing };
      return { ok: false, reason: 'auth' };
    }).catch(function () { return { ok: false, reason: 'network' }; });
  }

  /* Parolni almashtirish — server joriy parolni tekshiradi, yangi hash bazaga yoziladi */
  function changePassword(current, next) {
    return api('POST', 'password', { current: current, next: next }).then(function (r) {
      if (r.status === 200) return { ok: true };
      var b = r.body || {};
      if (r.status === 429) return { ok: false, reason: 'locked', retryMin: b.retryMin };
      if (r.status === 401) return { ok: false, reason: b.error === 'wrong' ? 'wrong' : 'auth' };
      if (r.status === 400) return { ok: false, reason: b.error || 'fields', min: b.min };
      return { ok: false, reason: 'network' };
    }).catch(function () { return { ok: false, reason: 'network' }; });
  }

  /* Login nomini almashtirish - server joriy parolni qayta tekshiradi. */
  function changeUsername(current, next) {
    return api('POST', 'username', { current: current, next: next }).then(function (r) {
      if (r.status === 200) {
        user = r.body.user || next;
        meta.user = user; writeMeta();
        return { ok: true, user: user };
      }
      var b = r.body || {};
      if (r.status === 401) return { ok: false, reason: b.error === 'wrong' ? 'wrong' : 'auth' };
      if (r.status === 400) return { ok: false, reason: b.error || 'format' };
      return { ok: false, reason: 'network' };
    }).catch(function () { return { ok: false, reason: 'network' }; });
  }

  function logout() {
    return api('POST', 'logout').then(function () {
      user = ''; meta = { rev: 0, at: 0 }; writeMeta();
      setStatus('out');
      gate();
    });
  }

  /* Sayt darvozasi: hosting'da sessiya yo'q bo'lsa middleware baribir hech
     narsa bermaydi — foydalanuvchini to'g'ridan-to'g'ri login sahifasiga
     yuboramiz (mahalliy file:// va localhost'da bu chaqirilmaydi).        */
  function gate() {
    if (!available() || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    var next = location.pathname + location.search + location.hash;
    location.replace('/login?expired=1' + (next && next !== '/' ? '&next=' + encodeURIComponent(next) : ''));
  }

  /* ---------- boshlash --------------------------------------------------- */
  function init() {
    readMeta();
    if (!available()) { setStatus('off'); return; }
    setStatus('out');
    Store.onChange(function () { push(false); });
    // Tab'ga qaytilganda yangilash — kecha ochiq qolgan tab uchun
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && status === 'in') pull();
    });
    // Sahifa yopilayotganda kutib turgan o'zgarish bo'lsa — darhol yuborish
    window.addEventListener('pagehide', function () {
      if (dirty && status !== 'out' && status !== 'off') {
        try {
          fetch('/api/state', {
            method: 'PUT', keepalive: true, credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ baseRev: meta.rev, state: Store.all() })
          });
        } catch (e) {}
      }
    });
    pull();
  }

  window.Sync = {
    init: init, pull: pull, push: function () { return push(true); },
    login: login, logout: logout, changePassword: changePassword, changeUsername: changeUsername,
    status: function () { return status; },
    envMissing: function () { return envMissing; },
    user: function () { return user; },
    lastAt: function () { return meta.at; },
    rev: function () { return meta.rev; },
    onStatus: function (fn) { watchers.push(fn); },
    available: available,
    _merge: mergeStates      // testlar uchun
  };
})();
