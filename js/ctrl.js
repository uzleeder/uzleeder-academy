/* ==========================================================================
   Ctrl (Comm) — nazoratchi (controller) bilan aloqa: chat, nazorat sessiyasi,
   bildirishnomalar + eski topshiriq/feedback/tekshiruv ARXIVI (o'quvchi tomoni).
   teacher / english rollari 2026-10 da olib tashlangan: ularga xabar yoki
   ish yuborilmaydi; eski yozuvlar faqat o'qish uchun ko'rinadi.
   --------------------------------------------------------------------------
   Server: /api/ctrl/io (Vercel). Mahalliy static serverda API yo'q — modul
   "off" holatida turadi, sahifalar buni halol ko'rsatadi (soxta holat yo'q).

   • heartbeat  — marshrut o'zgarganda (throttle 10 s) + har 20 s (tab ko'rinib
                  turganda): qayerdaman + Store.events dagi YANGI hodisalar
   • poll       — /api/ctrl/io GET: aloqa sahifasida yoki sessiya faol bo'lsa
                  har 5 s, aks holda har 60 s
   • feed       — { convs, assignments, feedback, reviews, notif, sessions,
                    status, staffOnline, roles }
   Nomi tarixiy (Ctrl) — eski chaqiruvlar (Ctrl.unread, Ctrl.state …) ishlaydi.
   ========================================================================== */
(function () {
  'use strict';

  var feed = null, status = 'off', lastHb = 0, hbTimer = null, pollTimer = null, watchers = [], sentEv = {};
  var FAST = 5000, SLOW = 60000;
  var ROLES = ['controller'];               // faol xodim roli (teacher / english — olib tashlangan)
  var RETIRED = ['teacher', 'english'];     // faqat arxiv (eski suhbat va yozuvlar)

  function api(method, body) {
    return fetch('/api/ctrl/io', { method: method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        if (r.status === 401) { status = 'auth'; throw new Error('auth'); }
        if (!r.ok) { status = r.status === 500 ? 'env' : 'err'; return r.json().then(function (j) { var e = new Error('http' + r.status); e.body = j; throw e; }); }
        return r.json();
      });
  }

  function notify() { watchers.forEach(function (fn) { try { fn(feed); } catch (e) {} }); }

  function poll() {
    if (!Ctrl.available()) return Promise.resolve(null);
    return api('GET').then(function (j) { feed = j; status = 'on'; notify(); schedule(); return j; })
      .catch(function () { if (status !== 'auth' && status !== 'env') status = 'err'; notify(); schedule(); return null; });
  }
  function schedule() {
    clearTimeout(pollTimer);
    var fast = /^#\/(chat|comm)/.test(location.hash) || (feed && feed.status && /^(active|paused)$/.test(feed.status.state));
    pollTimer = setTimeout(poll, fast ? FAST : SLOW);
  }

  /* Yangi hodisalar (Store.events) — bir marta yuboriladi */
  function newEvents() {
    var out = [];
    (Store.events ? Store.events(60) : []).forEach(function (e) { if (!sentEv[e.id]) out.push(e); });
    return out.slice(-30);
  }
  function heartbeat(force) {
    if (!Ctrl.available() || document.visibilityState !== 'visible') return;
    var now = Date.now();
    if (!force && now - lastHb < 10000) return;
    lastHb = now;
    var h1 = document.querySelector('#content h1');
    var route = (location.hash || '').replace(/^#\//, '');
    var ev = newEvents();
    api('POST', { op: 'heartbeat', route: route, title: h1 ? h1.textContent.trim().slice(0, 60) : route, name: Store.get('name') || '', lang: Store.get('lang'), events: ev })
      .then(function () { ev.forEach(function (e) { sentEv[e.id] = 1; }); }).catch(function () {});
  }

  function assignmentStatus(a) {
    if (a.status === 'completed') return 'completed';
    if (a.due && a.due < Store.dateKey()) return 'overdue';
    return a.status || 'assigned';
  }

  var Ctrl = {
    ROLES: ROLES,
    RETIRED: RETIRED,
    isRetired: function (r) { return RETIRED.indexOf(r) >= 0; },
    /* Eski rollar bilan suhbatlar — faqat o'qish */
    archive: function () { return feed && feed.archive ? feed.archive : {}; },
    /* API faqat https (Vercel) da bor; localhost/file — yo'q */
    available: function () { return location.protocol === 'https:'; },
    status: function () { return status; },
    feed: function () { return feed; },
    roles: function () { return feed && feed.roles ? feed.roles : []; },
    staffOnline: function (r) { return !!(feed && feed.staffOnline && feed.staffOnline[r]); },
    /* --- chat --- */
    conv: function (r) { return feed && feed.convs ? feed.convs[r] || null : null; },
    unread: function (r) {
      if (!feed || !feed.convs) return 0;
      if (r) return (feed.convs[r] || {}).unread || 0;
      return ROLES.reduce(function (n, k) { return n + ((feed.convs[k] || {}).unread || 0); }, 0);
    },
    send: function (text, to) { return api('POST', { op: 'message', text: text, to: to || 'controller' }).then(poll); },
    markRead: function (conv) {
      return api('POST', { op: 'read', conv: conv || 'controller' }).then(function () {
        if (feed && feed.convs && feed.convs[conv || 'controller']) { feed.convs[conv || 'controller'].unread = 0; feed.convs[conv || 'controller'].read.learner = Date.now(); notify(); }
      });
    },
    /* --- nazorat sessiyasi --- */
    state: function () { return feed && feed.status ? feed.status.state || 'idle' : 'idle'; },
    session: function (action) { return api('POST', { op: 'session', action: action }).then(poll); },
    currentSession: function () { return feed ? (feed.sessions || []).filter(function (s) { return !s.endedAt; })[0] || null : null; },
    /* --- topshiriqlar --- */
    assignments: function () { return feed && feed.assignments ? feed.assignments.map(function (a) { a.st = assignmentStatus(a); return a; }) : []; },
    assignmentStatus: assignmentStatus,
    openAssignments: function () { return Ctrl.assignments().filter(function (a) { return a.st !== 'completed'; }); },
    setAssignment: function (id, st) { return api('POST', { op: 'astatus', id: id, status: st }).then(poll); },
    /* --- feedback (faqat student-visible keladi) --- */
    feedback: function () { return feed && feed.feedback ? feed.feedback.slice().sort(function (a, b) { return b.at - a.at; }) : []; },
    feedbackFor: function (kind, ref) { return Ctrl.feedback().filter(function (f) { return f.activity && f.activity.kind === kind && (!ref || f.activity.ref === ref); }); },
    /* --- writing / speaking tekshiruvi --- */
    reviews: function () { return feed && feed.reviews ? feed.reviews.slice().sort(function (a, b) { return b.updatedAt - a.updatedAt; }) : []; },
    reviewFor: function (kind, ref) { return Ctrl.reviews().filter(function (r) { return r.kind === kind && r.ref === ref; })[0] || null; },
    /* --- bildirishnomalar --- */
    notif: function () { return feed && feed.notif ? feed.notif.slice().reverse() : []; },
    notifUnread: function () { return Ctrl.notif().filter(function (n) { return !n.read; }).length; },
    readNotif: function (ids) { return api('POST', { op: 'notif', action: 'read', ids: ids || [], all: !ids }).then(function () { if (feed) { (feed.notif || []).forEach(function (n) { if (!ids || ids.indexOf(n.id) >= 0) n.read = true; }); notify(); } }); },
    /* Yig'ma nishon (sidebar): o'qilmagan xabar + o'qilmagan bildirishnoma */
    badge: function () { return Ctrl.unread() + Ctrl.notifUnread(); },
    refresh: poll,
    onChange: function (fn) { watchers.push(fn); },
    touch: function () { heartbeat(false); },
    init: function () {
      if (!Ctrl.available()) { status = 'off'; return; }
      poll();
      heartbeat(true);
      hbTimer = setInterval(function () { heartbeat(true); }, 20000);
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { heartbeat(true); poll(); } });
    }
  };
  /* Faqat mahalliy ishlab chiqish (localhost): soxta feed bilan sahifalarni ko'rish.
     Ishlab chiqarishda (https) mavjud emas; server har amalni o'zi tekshiradi. */
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) Ctrl.devFeed = function (f) { feed = f; status = 'on'; Ctrl.available = function () { return true; }; api = function (m) { return Promise.resolve(m === 'GET' ? feed : { ok: true }); }; notify(); };
  window.Ctrl = Ctrl;
  window.Comm = Ctrl;
})();
