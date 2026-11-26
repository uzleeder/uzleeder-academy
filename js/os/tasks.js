/* ==========================================================================
   OS.tasks — Missiya rejasidagi vazifalar (yagona haqiqat manbai)
   Mission Planner tasks — the single source of truth for planning
   --------------------------------------------------------------------------
   Brief 4B. Har vazifada: sana, vaqt, davomiylik, toifa, holat.
   Holatlar: pending · active · done · partial · skipped.
   Ko'chirish (reschedule) mumkin. JAZO VA QARZ TIZIMI YO'Q — o'tkazib
   yuborilgan vazifa ertangi kunga "qarz" bo'lib yig'ilmaydi; u shunchaki
   skipped bo'lib qoladi va kerak bo'lsa qo'lda ko'chiriladi.

   Saqlash: hozircha Store ichida (`osTasks`), 8-bosqichda IndexedDB
   ombori `tasks` ga ko'chadi (OS.db). Yozuv shakli o'zgarmaydi — shuning
   uchun ko'chirish id va vaqt belgilarini saqlab qoladi.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  var KEY = 'osTasks';

  var STATUS = ['pending', 'active', 'done', 'partial', 'skipped'];

  var CATS = {
    ielts:    { t: { uz: 'IELTS', en: 'IELTS' } },
    coding:   { t: { uz: 'Kod', en: 'Coding' } },
    review:   { t: { uz: 'Takror', en: 'Review' } },
    reading:  { t: { uz: 'Öqiş', en: 'Reading' } },
    routine:  { t: { uz: 'Odat', en: 'Routine' } },
    rest:     { t: { uz: 'Dam', en: 'Rest' } },
    other:    { t: { uz: 'Boşqa', en: 'Other' } }
  };

  function all() {
    var st = window.Store;
    if (!st || !st.all) return {};
    var s = st.all();
    if (!s[KEY]) s[KEY] = {};
    return s[KEY];
  }

  function write() {
    var st = window.Store;
    if (st && st.set) st.set(KEY, all());
  }

  function uid() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  /* Vazifa yaratish. date majburiy; qolganlari ixtiyoriy. */
  function add(task) {
    var t = {
      id: task.id || uid(),
      date: String(task.date || OS.cal.today()),
      time: task.time || '',                 // "07:30" yoki bo'sh (vaqt belgilanmagan)
      min: Number(task.min) || 0,            // davomiylik, daqiqa
      cat: CATS[task.cat] ? task.cat : 'other',
      title: String(task.title || '').slice(0, 160),
      note: String(task.note || '').slice(0, 500),
      status: STATUS.indexOf(task.status) >= 0 ? task.status : 'pending',
      ref: task.ref || '',                   // bog'liq marshrut (ixtiyoriy)
      src: task.src || 'manual',             // manual | prelaunch | routine
      at: task.at || Date.now(),
      up: Date.now()
    };
    var m = all();
    m[t.id] = t;
    write();
    if (window.Store && Store.logEvent) Store.logEvent('task', t.id, t.title);
    return t.id;
  }

  function get(id) { var t = all()[id]; return t && !t.del ? t : null; }

  function update(id, patch) {
    var m = all(), t = m[id];
    if (!t || t.del) return false;
    Object.keys(patch || {}).forEach(function (k) {
      if (k === 'id' || k === 'at') return;
      if (k === 'status' && STATUS.indexOf(patch[k]) < 0) return;
      t[k] = patch[k];
    });
    t.up = Date.now();
    write();
    return true;
  }

  /* Holatni belgilash. `done` hodisa jurnaliga tushadi (dalil).
     `skipped` jazo emas — hech narsa yig'ilmaydi va keyingi kunga ko'chmaydi. */
  function setStatus(id, status, note) {
    if (STATUS.indexOf(status) < 0) return false;
    var ok = update(id, { status: status, resultNote: note || '' });
    if (ok && status === 'done' && window.Store && Store.logEvent) {
      var t = get(id);
      Store.logEvent('task-done', id, t ? t.title : id);
    }
    return ok;
  }

  /* Boshqa kunga ko'chirish — asl yozuv saqlanadi, sana o'zgaradi */
  function reschedule(id, dateKey, time) {
    var t = get(id);
    if (!t) return false;
    return update(id, {
      date: String(dateKey), time: time === undefined ? t.time : time,
      status: t.status === 'done' ? 'done' : 'pending',
      moved: (t.moved || 0) + 1
    });
  }

  function remove(id) {
    var m = all();
    if (!m[id]) return false;
    m[id] = { id: id, del: true, up: Date.now() };   // o'chirish belgisi (birlashtirish uchun)
    write();
    return true;
  }

  function list(filter) {
    filter = filter || {};
    var m = all();
    var out = Object.keys(m).map(function (k) { return m[k]; })
      .filter(function (t) { return t && !t.del; });
    if (filter.date) out = out.filter(function (t) { return t.date === filter.date; });
    if (filter.from) out = out.filter(function (t) { return t.date >= filter.from; });
    if (filter.to) out = out.filter(function (t) { return t.date <= filter.to; });
    if (filter.cat) out = out.filter(function (t) { return t.cat === filter.cat; });
    if (filter.status) out = out.filter(function (t) { return t.status === filter.status; });
    return out.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      var at = a.time || '99:99', bt = b.time || '99:99';
      return at < bt ? -1 : at > bt ? 1 : (a.at || 0) - (b.at || 0);
    });
  }

  function onDay(dateKey) { return list({ date: dateKey }); }

  function countsOn(dateKey) {
    var t = onDay(dateKey), out = { total: t.length };
    STATUS.forEach(function (s) { out[s] = t.filter(function (x) { return x.status === s; }).length; });
    return out;
  }

  /* Pre-launch vazifalarini bir marta yoyish (OS.CFG.prelaunch).
     Takroran chaqirilsa dublikat YARATMAYDI — src+ref bo'yicha tekshiradi. */
  function seedPrelaunch() {
    var c = OS.CFG;
    if (!c || !c.prelaunch) return 0;
    var existing = {};
    list({}).forEach(function (t) { if (t.src === 'prelaunch') existing[t.ref] = true; });
    var days = [];
    var k = OS.cal, p = c.mission.phases[0];
    var n = k.diffDays(p.from, p.to);
    for (var i = 0; i <= n; i++) days.push(k.addDays(p.from, i));
    var made = 0;
    c.prelaunch.forEach(function (item, i) {
      if (existing[item.id]) return;
      add({
        date: days[i % days.length],
        min: item.min, cat: item.sk === 'coding' ? 'coding' : item.sk === 'review' ? 'review' : 'ielts',
        title: OS.shell ? OS.shell.L(item.t) : (item.t.uz || item.t.en),
        note: '', ref: item.id, src: 'prelaunch'
      });
      made++;
    });
    return made;
  }

  OS.tasks = {
    STATUS: STATUS, CATS: CATS,
    add: add, get: get, update: update, setStatus: setStatus,
    reschedule: reschedule, remove: remove,
    list: list, onDay: onDay, countsOn: countsOn,
    seedPrelaunch: seedPrelaunch,
    _key: KEY
  };
})();
