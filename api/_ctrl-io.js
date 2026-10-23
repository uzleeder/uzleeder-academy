/* ==========================================================================
   /api/ctrl/io — controller va o'quvchi o'rtasidagi BUTUN aloqa (bitta funksiya)
   --------------------------------------------------------------------------
   Kim: o'quvchi (uzla_session) yoki controller (uzla_ctrl, role=controller).
   Polling (5–60 s) — WebSocket yo'q, "deyarli real vaqt".

   GET → rolga qarab kesilgan holat:
     { role, now, roles, status, controllerOnline, staffOnline, seen,
       sessions, convs, archive, assignments, feedback, reviews, notif, notes?, retired? }

   POST { op, ... } — ruxsatlar L.PERMS da (server tekshiradi):
     heartbeat  {route, title, name, lang, events[]}   o'quvchi: qayerdaman
     session    {action: start|pause|resume|finish}    o'quvchi / controller
     message    {text}                                  chat (faqat controller suhbati)
     read       {}                                      suhbat o'qildi
     notes      {text}                                  controllerning shaxsiy eslatmasi
     astatus    {id, status}                            o'quvchi: tarixiy topshiriq holati
     feedback   {action: create|update|delete, f}       controller — faqat private eslatma
     notif      {action: read, ids[] | all}             bildirishnoma o'qildi

   2026-10: teacher / english rollari olib tashlandi. Topshiriq yaratish va
   writing/speaking "tekshiruvga yuborish" oqimi yo'q — o'rniga o'quvchi
   ilovasidagi Mission (kunlik reja) va Writing/Speaking Studio (o'z-o'zini
   baholash). Eski yozuvlar (topshiriq, feedback, tekshiruv, eski rollar bilan
   chat) O'CHIRILMAYDI: o'quvchiga faqat-o'qish arxivi sifatida qaytadi.

   Bildirishnomalar FAQAT real hodisadan tug'iladi. Soxta "onlayn" yo'q:
   onlayn = oxirgi 45 soniyada so'rov kelgan.

   Kalitlar: uzla:ctrl:status · :sessions · :seen · :chat (controller suhbati)
   · uzla:chat:<eski rol> (arxiv) · uzla:staff:read · :assignments · :feedback
   · :reviews · :notif · uzla:ctrl:notes
   ========================================================================== */
'use strict';
const L = require('./_lib');

const K = {
  status: 'uzla:ctrl:status', sessions: 'uzla:ctrl:sessions', seen: 'uzla:ctrl:seen', readLegacy: 'uzla:ctrl:read',
  read: 'uzla:staff:read', assignments: 'uzla:staff:assignments', feedback: 'uzla:staff:feedback',
  reviews: 'uzla:staff:reviews', notif: 'uzla:staff:notif'
};
const ONLINE_MS = 45 * 1000;
const LIMITS = { chat: 400, assignments: 300, feedback: 500, reviews: 120, notif: 300, events: 60 };
const A_STATUS = ['assigned', 'in_progress', 'completed'];

function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function chatKey(role) { return role === 'controller' ? 'uzla:ctrl:chat' : 'uzla:chat:' + role; }
function notesKey(role) { return role === 'controller' ? 'uzla:ctrl:notes' : 'uzla:staff:notes:' + role; }
function str(v, n) { return String(v == null ? '' : v).trim().slice(0, n); }
function isStaff(r) { return L.isStaffRole(r); }

/* Sessiya davomida faol daqiqalar: start/resume → pause/finish oraliqlari */
function activeMinutes(s, now) {
  let t = 0, open = null;
  (s.events || []).forEach(e => {
    if (e.type === 'start' || e.type === 'resume') open = e.at;
    else if ((e.type === 'pause' || e.type === 'finish') && open != null) { t += e.at - open; open = null; }
  });
  if (open != null && !s.endedAt) t += (now || Date.now()) - open;
  return Math.round(t / 60000);
}

/* Bildirishnoma qo'shish (real hodisa) */
async function notify(to, type, title, route, from) {
  const list = await L.getJSON(K.notif, []);
  list.push({ id: id(), at: Date.now(), to: to, type: type, title: str(title, 140), route: str(route, 120), from: from || null, read: false });
  await L.setJSON(K.notif, list.slice(-LIMITS.notif));
}

module.exports = async function (req, res) {
  const missing = L.missingEnv();
  if (missing.length) return L.json(res, 500, { error: 'env', missing: missing });
  const role = L.roleOf(req);
  if (!role) return L.json(res, 401, { error: 'auth' });
  const now = Date.now();

  /* ============================== GET ============================== */
  if (req.method === 'GET') {
    const [status, seen, readMap, readLegacy, sessions, assignments, feedback, reviews, notif] = await Promise.all([
      L.getJSON(K.status, {}), L.getJSON(K.seen, {}), L.getJSON(K.read, null), L.getJSON(K.readLegacy, {}),
      L.getJSON(K.sessions, []), L.getJSON(K.assignments, []), L.getJSON(K.feedback, []), L.getJSON(K.reviews, []), L.getJSON(K.notif, [])
    ]);
    seen[role] = now; await L.setJSON(K.seen, seen);
    /* O'qilganlik: yangi xarita, bo'lmasa tarixiy controller yozuvidan */
    const read = readMap || { controller: { learner: readLegacy.learner || 0, staff: readLegacy.controller || 0 } };
    const convRoles = role === 'learner' ? L.STAFF_ROLES : [role];
    const chats = await Promise.all(convRoles.map(r => L.getJSON(chatKey(r), [])));
    const convs = {};
    convRoles.forEach((r, i) => {
      const rd = read[r] || {};
      const msgs = chats[i].slice(-200);
      convs[r] = {
        msgs: msgs, read: rd,
        online: !!seen[r] && now - seen[r] < ONLINE_MS,
        unread: msgs.filter(m => role === 'learner' ? (m.from !== 'learner' && m.at > (rd.learner || 0)) : (m.from === 'learner' && m.at > (rd.staff || 0))).length
      };
    });
    const staffOnline = {}; L.STAFF_ROLES.forEach(r => { staffOnline[r] = !!seen[r] && now - seen[r] < ONLINE_MS; });
    /* Olib tashlangan rollar bilan eski suhbatlar — o'quvchiga faqat-o'qish arxivi */
    const archive = {};
    if (role === 'learner') {
      for (const r of Object.keys(L.RETIRED_ROLES)) {
        const msgs = await L.getJSON(chatKey(r), []);
        if (msgs.length) archive[r] = { msgs: msgs.slice(-200), retired: true };
      }
    }

    const out = {
      role: role, now: now, roles: await L.staffRolesAvailable(),
      status: Object.assign({ state: 'idle' }, status, { online: !!seen.learner && now - seen.learner < ONLINE_MS }),
      controllerOnline: staffOnline.controller, staffOnline: staffOnline, seen: seen,
      sessions: sessions.slice(-30).map(s => Object.assign({}, s, { activeMin: activeMinutes(s, now) })),
      convs: convs, archive: archive,
      /* Tarixiy topshiriqlar (eski o'qituvchi rollari bergan) — o'quvchi ko'radi va yopadi */
      assignments: role === 'learner' ? assignments : [],
      /* Feedback: o'quvchi faqat student-visible (arxiv); controller — student-visible + o'zining private eslatmalari */
      feedback: feedback.filter(f => role === 'learner' ? f.visibility === 'student' : (f.visibility === 'student' || f.role === role)),
      /* Writing/speaking tekshiruv arxivi — faqat o'quvchiga, faqat o'qish */
      reviews: role === 'learner' ? reviews : [],
      notif: notif.filter(n => n.to === role).slice(-100)
    };
    if (role === 'controller') out.retired = await L.retiredAccounts();
    if (isStaff(role)) out.notes = (await L.store.get(notesKey(role))) || '';
    return L.json(res, 200, out);
  }

  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  let body;
  try { body = await L.readJSON(req, 64 * 1024); } catch (e) { return L.json(res, 400, { error: 'body' }); }
  const op = body && String(body.op || '');
  if (!L.can(role, op)) return L.json(res, 403, { error: 'role', op: op });

  /* ---------------- heartbeat (o'quvchi) ---------------- */
  if (op === 'heartbeat') {
    const st = await L.getJSON(K.status, {});
    const route = str(body.route, 80), title = str(body.title, 80);
    st.route = route; st.title = title; st.at = now; st.lang = str(body.lang || 'uz', 2);
    if (body.name) st.name = str(body.name, 40);
    st.recent = st.recent || [];
    const last = st.recent[st.recent.length - 1];
    if (!last || last.route !== route) { st.recent.push({ route: route, title: title, at: now }); st.recent = st.recent.slice(-40); }
    /* O'quvchi ilovasidagi REAL hodisalar (dars tugadi, test, xato…) — jurnal */
    if (Array.isArray(body.events)) {
      st.events = st.events || [];
      const have = {}; st.events.forEach(e => { have[e.id] = 1; });
      body.events.slice(-LIMITS.events).forEach(e => {
        if (!e || !e.id || have[e.id]) return;
        st.events.push({ id: str(e.id, 20), at: Number(e.at) || now, type: str(e.type, 24), ref: str(e.ref, 60), title: str(e.title, 100) });
      });
      st.events = st.events.slice(-LIMITS.events);
    }
    const seen = await L.getJSON(K.seen, {}); seen.learner = now;
    await Promise.all([L.setJSON(K.status, st), L.setJSON(K.seen, seen)]);
    return L.json(res, 200, { ok: true });
  }

  /* ---------------- nazorat sessiyasi ---------------- */
  if (op === 'session') {
    const action = String(body.action || '');
    if (!/^(start|pause|resume|finish)$/.test(action)) return L.json(res, 400, { error: 'action' });
    const [st, sessions] = await Promise.all([L.getJSON(K.status, {}), L.getJSON(K.sessions, [])]);
    let cur = sessions.length && !sessions[sessions.length - 1].endedAt ? sessions[sessions.length - 1] : null;
    if (action === 'start') {
      if (cur) return L.json(res, 409, { error: 'open' });
      cur = { id: id(), startedAt: now, by: role, events: [{ type: 'start', at: now, by: role }] };
      sessions.push(cur); st.state = 'active'; st.sid = cur.id; st.since = now;
    } else {
      if (!cur) return L.json(res, 409, { error: 'none' });
      const stt = st.state || 'active';
      if (action === 'pause' && stt !== 'active') return L.json(res, 409, { error: 'state' });
      if (action === 'resume' && stt !== 'paused') return L.json(res, 409, { error: 'state' });
      cur.events.push({ type: action, at: now, by: role });
      if (action === 'finish') { cur.endedAt = now; cur.activeMin = activeMinutes(cur, now); st.state = 'finished'; st.sid = null; }
      else st.state = action === 'pause' ? 'paused' : 'active';
      st.since = now;
    }
    st.stateBy = role;
    await Promise.all([L.setJSON(K.status, st), L.setJSON(K.sessions, sessions.slice(-100))]);
    await notify(role === 'learner' ? 'controller' : 'learner', 'session', 'session:' + action, 'comm/sessions', role);
    return L.json(res, 200, { ok: true, state: st.state, session: cur });
  }

  /* ---------------- chat ---------------- */
  if (op === 'message') {
    const text = str(body.text, 2000);
    if (!text) return L.json(res, 400, { error: 'empty' });
    const conv = role === 'learner' ? String(body.to || 'controller') : role;
    if (!isStaff(conv)) return L.json(res, 400, { error: 'to' });
    const [chat, st] = await Promise.all([L.getJSON(chatKey(conv), []), L.getJSON(K.status, {})]);
    const m = { id: id(), from: role, text: text, at: now, sid: st.sid || null };
    chat.push(m);
    await L.setJSON(chatKey(conv), chat.slice(-LIMITS.chat));
    await notify(role === 'learner' ? conv : 'learner', 'message', text.slice(0, 80), 'comm/messages/' + conv, role);
    return L.json(res, 200, { ok: true, message: m });
  }

  if (op === 'read') {
    const conv = role === 'learner' ? String(body.conv || 'controller') : role;
    if (!isStaff(conv)) return L.json(res, 400, { error: 'conv' });
    const readLegacy = await L.getJSON(K.readLegacy, {});
    const read = (await L.getJSON(K.read, null)) || { controller: { learner: readLegacy.learner || 0, staff: readLegacy.controller || 0 } };
    read[conv] = read[conv] || {};
    read[conv][role === 'learner' ? 'learner' : 'staff'] = now;
    await L.setJSON(K.read, read);
    return L.json(res, 200, { ok: true });
  }

  if (op === 'notes') {
    await L.store.set(notesKey(role), str(body.text, 20000));
    return L.json(res, 200, { ok: true });
  }

  /* ---------------- tarixiy topshiriq holati (o'quvchi) ---------------- */
  if (op === 'astatus') {
    const status = String(body.status || '');
    if (A_STATUS.indexOf(status) < 0) return L.json(res, 400, { error: 'status' });
    const list = await L.getJSON(K.assignments, []);
    const cur = list.filter(x => x.id === body.id)[0];
    if (!cur) return L.json(res, 404, { error: 'id' });
    cur.status = status; cur.updatedAt = now;
    cur.completedAt = status === 'completed' ? now : null;
    await L.setJSON(K.assignments, list);
    /* Faqat FAOL xodimga xabar — olib tashlangan rolga bildirishnoma yozilmaydi */
    if (status === 'completed' && isStaff(cur.by)) await notify(cur.by, 'assignment_done', cur.title, 'assignments', 'learner');
    return L.json(res, 200, { ok: true, assignment: cur });
  }

  /* ---------------- feedback ---------------- */
  if (op === 'feedback') {
    const action = String(body.action || ''), f = body.f || {};
    const list = await L.getJSON(K.feedback, []);
    if (action === 'create' || action === 'update') {
      const act = f.activity || {};
      const rec = {
        activity: { kind: str(act.kind, 24) || 'general', ref: str(act.ref, 60), route: str(act.route, 120).replace(/^#\/?/, ''), title: str(act.title, 120) },
        text: str(f.text, 4000),
        visibility: f.visibility === 'private' ? 'private' : 'student',
        fb: f.fb && typeof f.fb === 'object' ? {
          strengths: str(f.fb.strengths, 1500), weaknesses: str(f.fb.weaknesses, 1500), corrections: str(f.fb.corrections, 3000),
          recommendations: str(f.fb.recommendations, 1500), next: str(f.fb.next, 600)
        } : null
      };
      if (!rec.text && !rec.fb) return L.json(res, 400, { error: 'empty' });
      if (rec.visibility !== 'private') return L.json(res, 403, { error: 'scope' });   // controller: faqat shaxsiy eslatma
      if (action === 'create') {
        const full = Object.assign({ id: id(), by: role, role: role, at: now }, rec);
        list.push(full);
        await L.setJSON(K.feedback, list.slice(-LIMITS.feedback));
        if (full.visibility === 'student') await notify('learner', 'feedback', full.activity.title || full.text.slice(0, 60), 'comm/feedback', role);
        return L.json(res, 200, { ok: true, feedback: full });
      }
      const cur = list.filter(x => x.id === f.id)[0];
      if (!cur) return L.json(res, 404, { error: 'id' });
      if (cur.by !== role) return L.json(res, 403, { error: 'owner' });
      Object.assign(cur, rec, { updatedAt: now });
      await L.setJSON(K.feedback, list);
      return L.json(res, 200, { ok: true, feedback: cur });
    }
    if (action === 'delete') {
      const cur = list.filter(x => x.id === f.id)[0];
      if (!cur) return L.json(res, 404, { error: 'id' });
      if (cur.by !== role) return L.json(res, 403, { error: 'owner' });
      await L.setJSON(K.feedback, list.filter(x => x.id !== f.id));
      return L.json(res, 200, { ok: true });
    }
    return L.json(res, 400, { error: 'action' });
  }

  /* ---------------- bildirishnomalar ---------------- */
  if (op === 'notif') {
    const list = await L.getJSON(K.notif, []);
    const ids = Array.isArray(body.ids) ? body.ids : [];
    list.forEach(n => { if (n.to === role && (body.all || ids.indexOf(n.id) >= 0)) n.read = true; });
    await L.setJSON(K.notif, list);
    return L.json(res, 200, { ok: true });
  }

  return L.json(res, 400, { error: 'op' });
};
