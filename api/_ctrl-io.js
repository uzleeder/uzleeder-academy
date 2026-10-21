/* ==========================================================================
   /api/ctrl/io — xodimlar va o'quvchi o'rtasidagi BUTUN aloqa (bitta funksiya)
   --------------------------------------------------------------------------
   Kim: o'quvchi (uzla_session) yoki xodim (uzla_ctrl: controller | teacher |
   english). Polling (5–60 s) — WebSocket yo'q, "deyarli real vaqt".

   GET → rolga qarab kesilgan holat:
     { role, now, roles, status, controllerOnline, staffOnline, seen,
       sessions, convs, assignments, feedback, reviews, notif, notes? }

   POST { op, ... } — ruxsatlar L.PERMS da (server tekshiradi):
     heartbeat  {route, title, name, lang, events[]}   o'quvchi: qayerdaman
     session    {action: start|pause|resume|finish}    o'quvchi / controller
     message    {to, text}                              chat (to = rol yoki 'learner')
     read       {conv}                                  suhbat o'qildi
     notes      {text}                                  xodimning shaxsiy eslatmasi (o'z roli)
     assignment {action: create|update|delete, a}       teacher / english
     astatus    {id, status}                            o'quvchi: in_progress|completed; xodim: istalgan
     feedback   {action: create|update|delete, f}       teacher / english; controller — faqat private
     review     {action: submit|revise|feedback|complete|reopen, r}  writing/speaking tekshiruv oqimi
     notif      {action: read, ids[] | all}             bildirishnoma o'qildi

   Bildirishnomalar FAQAT real hodisadan tug'iladi (yangi topshiriq, feedback,
   xabar, tekshiruv bosqichi, sessiya). Soxta "onlayn" yo'q: onlayn = oxirgi
   45 soniyada so'rov kelgan.

   Kalitlar: uzla:ctrl:status · :sessions · :seen · :chat (controller suhbati,
   tarixiy nom) · uzla:chat:<rol> · uzla:staff:read · :assignments · :feedback
   · :reviews · :notif · uzla:ctrl:notes (controller) · uzla:staff:notes:<rol>
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
const A_TYPES = ['lesson', 'practice', 'quiz', 'review', 'reading', 'listening', 'speaking', 'writing', 'project', 'vocab', 'grammar'];
const A_COURSES = ['python', 'english', 'datacamp', 'general'];
const A_STATUS = ['assigned', 'in_progress', 'completed'];
const ENGLISH_KINDS = /^(english|eng|grammar|vocab|reading|listening|speaking|writing|books|bbc|quiz-eng|assignment)$/;

function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function chatKey(role) { return role === 'controller' ? 'uzla:ctrl:chat' : 'uzla:chat:' + role; }
function notesKey(role) { return role === 'controller' ? 'uzla:ctrl:notes' : 'uzla:staff:notes:' + role; }
function str(v, n) { return String(v == null ? '' : v).trim().slice(0, n); }
function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); }
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

/* English roli: faqat ingliz tili ob'ektlari */
function englishOk(role, obj) {
  if (role !== 'english') return true;
  if (obj.course && obj.course !== 'english') return false;
  if (obj.kind && !ENGLISH_KINDS.test(obj.kind)) return false;
  return true;
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

    const out = {
      role: role, now: now, roles: await L.staffRolesAvailable(),
      status: Object.assign({ state: 'idle' }, status, { online: !!seen.learner && now - seen.learner < ONLINE_MS }),
      controllerOnline: staffOnline.controller, staffOnline: staffOnline, seen: seen,
      sessions: (role === 'learner' || role === 'controller') ? sessions.slice(-30).map(s => Object.assign({}, s, { activeMin: activeMinutes(s, now) }))
        : sessions.filter(s => !s.endedAt).map(s => ({ id: s.id, startedAt: s.startedAt, activeMin: activeMinutes(s, now) })),
      convs: convs,
      assignments: assignments.filter(a => role === 'learner' ? true : role === 'english' ? a.course === 'english' : true),
      /* Feedback: o'quvchi faqat student-visible; xodim — hamma student-visible + O'Z rolining private eslatmalari */
      feedback: feedback.filter(f => role === 'learner' ? f.visibility === 'student' : (f.visibility === 'student' || f.role === role) && (role !== 'english' || ENGLISH_KINDS.test((f.activity || {}).kind || 'assignment'))),
      reviews: reviews.filter(r => role !== 'controller' && (role !== 'english' || r.kind !== 'project')),
      notif: notif.filter(n => n.to === role).slice(-100)
    };
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

  /* ---------------- topshiriqlar ---------------- */
  if (op === 'assignment') {
    const action = String(body.action || ''), a = body.a || {};
    const list = await L.getJSON(K.assignments, []);
    if (action === 'create' || action === 'update') {
      const rec = {
        type: A_TYPES.indexOf(a.type) >= 0 ? a.type : 'lesson',
        title: str(a.title, 120), desc: str(a.desc, 2000),
        course: A_COURSES.indexOf(a.course) >= 0 ? a.course : 'general',
        route: str(a.route, 120).replace(/^#\/?/, ''),
        priority: /^(low|normal|high)$/.test(a.priority) ? a.priority : 'normal',
        due: isDate(String(a.due || '')) ? a.due : ''
      };
      if (!rec.title) return L.json(res, 400, { error: 'title' });
      if (!englishOk(role, rec)) return L.json(res, 403, { error: 'scope' });
      if (action === 'create') {
        const full = Object.assign({ id: id(), by: role, to: 'learner', status: 'assigned', createdAt: now, completedAt: null }, rec);
        list.push(full);
        await L.setJSON(K.assignments, list.slice(-LIMITS.assignments));
        await notify('learner', 'assignment', full.title, 'comm/assignments', role);
        return L.json(res, 200, { ok: true, assignment: full });
      }
      const cur = list.filter(x => x.id === a.id)[0];
      if (!cur) return L.json(res, 404, { error: 'id' });
      if (cur.by !== role) return L.json(res, 403, { error: 'owner' });
      Object.assign(cur, rec, { updatedAt: now });
      await L.setJSON(K.assignments, list);
      return L.json(res, 200, { ok: true, assignment: cur });
    }
    if (action === 'delete') {
      const cur = list.filter(x => x.id === a.id)[0];
      if (!cur) return L.json(res, 404, { error: 'id' });
      if (cur.by !== role) return L.json(res, 403, { error: 'owner' });
      await L.setJSON(K.assignments, list.filter(x => x.id !== a.id));
      return L.json(res, 200, { ok: true });
    }
    return L.json(res, 400, { error: 'action' });
  }

  if (op === 'astatus') {
    const status = String(body.status || '');
    if (A_STATUS.indexOf(status) < 0) return L.json(res, 400, { error: 'status' });
    const list = await L.getJSON(K.assignments, []);
    const cur = list.filter(x => x.id === body.id)[0];
    if (!cur) return L.json(res, 404, { error: 'id' });
    if (!englishOk(role, cur)) return L.json(res, 403, { error: 'scope' });
    cur.status = status; cur.updatedAt = now;
    cur.completedAt = status === 'completed' ? now : null;
    await L.setJSON(K.assignments, list);
    if (role === 'learner' && status === 'completed') await notify(cur.by, 'assignment_done', cur.title, 'assignments', 'learner');
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
      if (role === 'controller' && rec.visibility !== 'private') return L.json(res, 403, { error: 'scope' });
      if (!englishOk(role, { kind: rec.activity.kind })) return L.json(res, 403, { error: 'scope' });
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

  /* ---------------- writing / speaking tekshiruv oqimi ----------------
     submitted → reviewed → revised → reviewed2 → completed
     O'quvchi: submit, revise. Xodim: feedback (reviewed/reviewed2), complete, reopen. */
  if (op === 'review') {
    const action = String(body.action || ''), r = body.r || {};
    const list = await L.getJSON(K.reviews, []);
    const kindOk = /^(writing|speaking)$/.test(r.kind || '');
    if (action === 'submit') {
      if (role !== 'learner') return L.json(res, 403, { error: 'role' });
      if (!kindOk) return L.json(res, 400, { error: 'kind' });
      const text = str(r.text, 12000);
      if (!text) return L.json(res, 400, { error: 'empty' });
      const rec = { id: id(), kind: r.kind, ref: str(r.ref, 40), title: str(r.title, 120), route: str(r.route, 120).replace(/^#\/?/, ''),
        stage: 'submitted', createdAt: now, updatedAt: now, text: text, history: [{ stage: 'submitted', at: now, by: 'learner', text: text }] };
      list.push(rec);
      await L.setJSON(K.reviews, list.slice(-LIMITS.reviews));
      await notify('teacher', 'review', rec.title, 'reviews', 'learner');
      await notify('english', 'review', rec.title, 'reviews', 'learner');
      return L.json(res, 200, { ok: true, review: rec });
    }
    const cur = list.filter(x => x.id === r.id)[0];
    if (!cur) return L.json(res, 404, { error: 'id' });
    if (action === 'revise') {
      if (role !== 'learner') return L.json(res, 403, { error: 'role' });
      if (cur.stage !== 'reviewed') return L.json(res, 409, { error: 'stage' });
      const text = str(r.text, 12000); if (!text) return L.json(res, 400, { error: 'empty' });
      cur.stage = 'revised'; cur.text = text; cur.updatedAt = now;
      cur.history.push({ stage: 'revised', at: now, by: 'learner', text: text });
      await L.setJSON(K.reviews, list);
      await notify(cur.reviewer || 'teacher', 'review', cur.title, 'reviews', 'learner');
      return L.json(res, 200, { ok: true, review: cur });
    }
    if (!isStaff(role) || role === 'controller') return L.json(res, 403, { error: 'role' });
    if (action === 'feedback') {
      if (cur.stage !== 'submitted' && cur.stage !== 'revised') return L.json(res, 409, { error: 'stage' });
      const fb = r.fb || {};
      const entry = { stage: cur.stage === 'submitted' ? 'reviewed' : 'reviewed2', at: now, by: role,
        fb: { strengths: str(fb.strengths, 1500), weaknesses: str(fb.weaknesses, 1500), corrections: str(fb.corrections, 4000), recommendations: str(fb.recommendations, 1500), next: str(fb.next, 600) },
        result: /^(completed|incomplete)$/.test(r.result || '') ? r.result : null, band: typeof r.band === 'number' ? r.band : null };
      cur.stage = entry.stage; cur.reviewer = role; cur.updatedAt = now; cur.history.push(entry);
      /* Ikkinchi tekshiruvdan keyin — tugallangan. Speaking: xodim natijani darhol yopishi mumkin. */
      if (entry.stage === 'reviewed2' || (cur.kind === 'speaking' && entry.result)) { cur.stage = 'completed'; cur.completedAt = now; cur.history.push({ stage: 'completed', at: now, by: role }); }
      await L.setJSON(K.reviews, list);
      await notify('learner', 'review', cur.title, 'comm/feedback', role);
      return L.json(res, 200, { ok: true, review: cur });
    }
    if (action === 'complete') {
      cur.stage = 'completed'; cur.completedAt = now; cur.updatedAt = now; cur.reviewer = role; cur.history.push({ stage: 'completed', at: now, by: role });
      await L.setJSON(K.reviews, list);
      await notify('learner', 'review', cur.title, 'comm/feedback', role);
      return L.json(res, 200, { ok: true, review: cur });
    }
    if (action === 'reopen') {
      cur.stage = 'reviewed'; cur.completedAt = null; cur.updatedAt = now; cur.history.push({ stage: 'reopened', at: now, by: role });
      await L.setJSON(K.reviews, list);
      return L.json(res, 200, { ok: true, review: cur });
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
