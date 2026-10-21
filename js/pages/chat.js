/* ==========================================================================
   Aloqa markazi (#/comm) — xodimlar bilan BITTA aloqa tizimi (o'quvchi tomoni)
   --------------------------------------------------------------------------
     #/comm/messages/<rol>  — chat: controller · teacher · english (alohida suhbatlar)
     #/comm/assignments     — MENING TOPSHIRIQLARIM (kim berdi, kurs, muddat, holat)
     #/comm/feedback        — o'quvchiga ko'rinadigan feedback + writing/speaking tekshiruvi
     #/comm/sessions        — nazorat sessiyasi (Waiting → Active → Paused → Finished)
     #/comm/notifications   — bildirishnomalar markazi
   Eski #/chat → #/comm/messages/controller (App.parseRoute).

   Holat serverda (Ctrl), ikkala tomon bir xil ko'radi. Mahalliy nusxada
   (API yo'q) — sahifa buni halol aytadi. Soxta onlayn/feedback yo'q.
   ========================================================================== */
(function () {
  'use strict';

  function hm(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function dmy(ts) { return EngCal.fmt(Store.dateKey(new Date(ts))) + ' ' + hm(ts); }
  function roleName(r) { return tr('role_' + r); }
  function roleIcon(r) { return r === 'controller' ? IC.eye : r === 'english' ? IC.globe : IC.user; }

  /* Holat bloklari: API yo'q / kirish / server sozlanmagan / xato — bo'sh sahifa emas */
  function stateBlock() {
    if (!Ctrl.available()) return '<div class="rv-empty">' + IC.alert + '<h3>' + esc(tr('chOffT')) + '</h3><p>' + esc(tr('chOffS')) + '</p></div>';
    var st = Ctrl.status();
    if (st === 'env') return '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(tr('chEnv')) + '</div></div>';
    if (st === 'auth') return '<div class="callout pitfall"><span class="co-ic">' + IC.lock + '</span><div>' + esc(tr('commAuth')) + ' <a href="/login">' + esc(tr('login')) + '</a></div></div>';
    if (st === 'err') return '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div>' + esc(tr('commErr')) + '</div></div>';
    if (!Ctrl.feed()) return '<div class="callout tip"><span class="co-ic">' + IC.cloud + '</span><div>' + esc(tr('commLoading')) + '</div></div>';
    return '';
  }

  window.PageComm = function (tab, sub) {
    var h = '<div class="page stagger comm-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('chKick')) + '</div><h1>' + esc(tr('commHub')) + '</h1><p class="lede">' + esc(tr('commLede')) + '</p></header>';
    var blk = stateBlock();
    if (blk && !Ctrl.feed()) return h + blk + '</div>';
    if (blk) h += blk;
    var R = { messages: vMessages, assignments: vAssignments, feedback: vFeedback, sessions: vSessions, notifications: vNotifications };
    h += (R[tab] || vMessages)(sub);
    return h + '</div>';
  };

  /* ====================== 1. XABARLAR ================================= */
  function vMessages(sub) {
    var roles = Ctrl.roles(), cur = roles.indexOf(sub) >= 0 ? sub : (roles[0] || 'controller');
    var h = '<div class="ch-grid msgs">';
    /* Suhbatlar ro'yxati */
    h += '<aside class="card ch-list"><h3 class="card-title"><span class="num">' + IC.user + '</span>' + esc(tr('commConvs')) + '</h3>';
    if (!roles.length) h += '<p class="hint">' + esc(tr('commNoStaff')) + '</p>';
    roles.forEach(function (r) {
      var c = Ctrl.conv(r) || {}, last = (c.msgs || []).slice(-1)[0];
      h += '<button class="ch-conv' + (r === cur ? ' on' : '') + '" data-go="comm/messages/' + r + '">' + roleIcon(r) + '<span class="cc-b"><b>' + esc(roleName(r)) + '</b><i class="' + (Ctrl.staffOnline(r) ? 'on' : '') + '">' + esc(Ctrl.staffOnline(r) ? tr('chOnline') : tr('chOffline')) + '</i>' +
        '<span class="cc-last">' + (last ? esc(last.text.slice(0, 48)) : esc(tr('chNoMsg'))) + '</span></span>' + (c.unread ? '<em class="cc-n">' + c.unread + '</em>' : '') + '</button>';
    });
    h += '</aside>';
    /* Chat oynasi */
    var c = Ctrl.conv(cur), items = [];
    if (c) c.msgs.forEach(function (m) { items.push({ at: m.at, html: '<div class="ch-m ' + (m.from === 'learner' ? 'me' : 'them') + '">' + esc(m.text) + '<time>' + dmy(m.at) + '</time></div>' }); });
    if (cur === 'controller') (Ctrl.feed().sessions || []).forEach(function (s) { (s.events || []).forEach(function (e) { items.push({ at: e.at, html: '<div class="ch-m sys">' + hm(e.at) + ' · ' + esc(tr('chEv_' + e.type)) + ' (' + esc(e.by === 'learner' ? tr('chMe') : roleName(e.by)) + ')</div>' }); }); });
    items.sort(function (a, b) { return a.at - b.at; });
    h += '<section class="card ch-chat"><h3 class="card-title"><span class="num">' + roleIcon(cur) + '</span>' + esc(roleName(cur)) + '<span class="ch-state ' + (Ctrl.staffOnline(cur) ? 'st-active' : 'st-idle') + '">' + esc(Ctrl.staffOnline(cur) ? tr('chOnline') : tr('chOffline')) + '</span></h3>' +
      '<div class="ch-msgs" id="chMsgs">' + (items.length ? items.slice(-200).map(function (i) { return i.html; }).join('') : '<div class="ch-empty">' + esc(tr('chNoMsg')) + '</div>') + '</div>' +
      '<div class="ch-send"><textarea class="textarea" id="chTxt" rows="2" placeholder="' + esc(tr('chPh')) + '" aria-label="' + esc(tr('chPh')) + '"></textarea><button class="btn btn-primary" id="chSend" data-to="' + cur + '">' + IC.arrowR + esc(tr('chSend')) + '</button></div>' +
      '<p class="hint">' + esc(tr('chHint')) + '</p></section>';
    return h + '</div>';
  }

  /* ====================== 2. TOPSHIRIQLAR ============================= */
  function aBadge(st) { return '<span class="as-st st-' + st + '">' + esc(tr('asSt_' + st)) + '</span>'; }
  function aRow(a) {
    return '<div class="as-row pr-' + a.priority + ' st-' + a.st + '">' +
      '<div class="as-main"><span class="as-type">' + esc(tr('asType_' + a.type)) + ' · ' + esc(tr('course_' + a.course)) + '</span>' +
        '<b>' + esc(a.title) + '</b>' + (a.desc ? '<p>' + esc(a.desc) + '</p>' : '') +
        '<span class="as-meta">' + esc(tr('asBy')) + ': ' + esc(roleName(a.by)) + ' · ' + esc(EngCal.fmt(Store.dateKey(new Date(a.createdAt)))) + (a.due ? ' · ' + esc(tr('asDue')) + ': <i>' + esc(EngCal.fmt(a.due)) + '</i>' : '') + ' · ' + esc(tr('asPr_' + a.priority)) + '</span></div>' +
      '<div class="as-side">' + aBadge(a.st) +
        (a.route ? '<button class="btn btn-ghost btn-sm" data-go="' + esc(a.route) + '" data-astart="' + esc(a.id) + '">' + IC.arrowR + esc(tr('asOpen')) + '</button>' : '') +
        (a.st !== 'completed' ? '<button class="btn btn-primary btn-sm" data-adone="' + esc(a.id) + '">' + IC.check + esc(tr('asDone')) + '</button>' : '<button class="btn btn-quiet btn-sm" data-areopen="' + esc(a.id) + '">' + esc(tr('asReopen')) + '</button>') +
      '</div></div>';
  }
  function vAssignments() {
    var all = Ctrl.assignments(), open = all.filter(function (a) { return a.st !== 'completed'; }), done = all.filter(function (a) { return a.st === 'completed'; });
    var ord = { overdue: 0, in_progress: 1, assigned: 2 }, pr = { high: 0, normal: 1, low: 2 };
    open.sort(function (a, b) { return ord[a.st] - ord[b.st] || pr[a.priority] - pr[b.priority] || (a.due || '9') .localeCompare(b.due || '9'); });
    var h = '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile"><div class="st-l">' + esc(tr('asOpenN')) + '</div><div class="st-v">' + open.length + '</div></div>' +
      '<div class="stat-tile ' + (open.filter(function (a) { return a.st === 'overdue'; }).length ? 'red' : '') + '"><div class="st-l">' + esc(tr('asSt_overdue')) + '</div><div class="st-v">' + open.filter(function (a) { return a.st === 'overdue'; }).length + '</div></div>' +
      '<div class="stat-tile gold"><div class="st-l">' + esc(tr('asSt_completed')) + '</div><div class="st-v">' + done.length + '</div></div></div>';
    h += '<section class="card"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('asMine')) + '</h3>';
    h += open.length ? '<div class="as-list">' + open.map(aRow).join('') + '</div>' : '<p class="hint">' + esc(tr('asNone')) + '</p>';
    h += '</section>';
    if (done.length) h += '<section class="card"><h3 class="card-title"><span class="num">' + IC.check + '</span>' + esc(tr('asSt_completed')) + ' · ' + done.length + '</h3><div class="as-list">' + done.slice(0, 20).map(aRow).join('') + '</div></section>';
    return h;
  }

  /* ====================== 3. FEEDBACK ================================= */
  function fbBlock(fb) {
    if (!fb) return '';
    var keys = ['strengths', 'weaknesses', 'corrections', 'recommendations', 'next'];
    return '<div class="fb-struct">' + keys.filter(function (k) { return fb[k]; }).map(function (k) { return '<div class="fb-k"><span>' + esc(tr('fb_' + k)) + '</span><p>' + esc(fb[k]) + '</p></div>'; }).join('') + '</div>';
  }
  function fbRow(f) {
    var a = f.activity || {};
    return '<article class="fb-row"><div class="fb-head"><span class="chip">' + esc(tr('fbKind_' + a.kind) === 'fbKind_' + a.kind ? a.kind : tr('fbKind_' + a.kind)) + '</span>' +
      (a.title ? '<b>' + esc(a.title) + '</b>' : '') + '<span class="fb-by">' + esc(roleName(f.role)) + ' · ' + esc(dmy(f.at)) + '</span>' +
      (a.route ? '<button class="btn btn-quiet btn-sm" data-go="' + esc(a.route) + '">' + IC.arrowR + esc(tr('asOpen')) + '</button>' : '') + '</div>' +
      (f.text ? '<p class="fb-text">' + esc(f.text) + '</p>' : '') + fbBlock(f.fb) + '</article>';
  }
  function stageLabel(s) { return tr('rvStage_' + s); }
  function reviewRow(r) {
    var last = r.history.slice().reverse().filter(function (x) { return x.fb; })[0];
    return '<article class="fb-row rv-flow"><div class="fb-head"><span class="chip">' + esc(tr('fbKind_' + r.kind)) + '</span><b>' + esc(r.title) + '</b>' +
      '<span class="as-st st-' + r.stage + '">' + esc(stageLabel(r.stage)) + '</span><span class="fb-by">' + esc(dmy(r.updatedAt)) + '</span>' +
      (r.route ? '<button class="btn btn-quiet btn-sm" data-go="' + esc(r.route) + '">' + IC.arrowR + esc(tr('asOpen')) + '</button>' : '') + '</div>' +
      '<div class="rv-stages">' + ['submitted', 'reviewed', 'revised', 'reviewed2', 'completed'].map(function (s) { var hit = r.history.some(function (x) { return x.stage === s; }); return '<span class="' + (hit ? 'on' : '') + (r.stage === s ? ' cur' : '') + '">' + esc(stageLabel(s)) + '</span>'; }).join('') + '</div>' +
      (last ? '<div class="fb-by">' + esc(roleName(last.by)) + ' · ' + esc(dmy(last.at)) + (last.band != null ? ' · Band ' + last.band : '') + (last.result ? ' · ' + esc(tr('rvRes_' + last.result)) : '') + '</div>' + fbBlock(last.fb) : '') +
      (r.stage === 'reviewed' ? '<div class="rv-revise"><label class="field"><span class="gc-l">' + esc(tr('rvReviseT')) + '</span><textarea class="textarea" rows="6" data-rvtext="' + esc(r.id) + '">' + esc(r.text) + '</textarea></label><button class="btn btn-primary btn-sm" data-rvsend="' + esc(r.id) + '">' + IC.upload + esc(tr('rvReviseSend')) + '</button></div>' : '') +
      '</article>';
  }
  function vFeedback() {
    var fbs = Ctrl.feedback(), rvs = Ctrl.reviews();
    var h = '<section class="card"><h3 class="card-title"><span class="num">' + IC.pen + '</span>' + esc(tr('rvFlowT')) + ' · ' + rvs.length + '</h3><p class="hint">' + esc(tr('rvFlowS')) + '</p>';
    h += rvs.length ? rvs.map(reviewRow).join('') : '<p class="hint">' + esc(tr('rvFlowNone')) + '</p>';
    h += '</section>';
    h += '<section class="card"><h3 class="card-title"><span class="num">' + IC.star + '</span>' + esc(tr('fbT')) + ' · ' + fbs.length + '</h3>';
    h += fbs.length ? fbs.map(fbRow).join('') : '<p class="hint">' + esc(tr('fbNone')) + '</p>';
    h += '</section>';
    return h;
  }

  /* ====================== 4. NAZORAT SESSIYASI ======================== */
  function vSessions() {
    var f = Ctrl.feed(), state = Ctrl.state(), cur = Ctrl.currentSession(), ctrlOn = Ctrl.staffOnline('controller');
    var h = '<div class="ch-grid">';
    h += '<section class="card ch-sess"><h3 class="card-title"><span class="num">' + IC.eye + '</span>' + esc(tr('chSessT')) + '<span class="ch-state st-' + state + '">' + esc(tr('chSt_' + state)) + '</span></h3>' +
      '<div class="ch-kv"><span>' + esc(tr('chCtrl')) + '</span><b class="' + (ctrlOn ? 'on' : '') + '">' + esc(ctrlOn ? tr('chOnline') : tr('chOffline')) + '</b>' +
      '<span>' + esc(tr('chActiveMin')) + '</span><b>' + (cur ? cur.activeMin + ' ' + tr('engMin') : '—') + '</b>' +
      '<span>' + esc(tr('chSince')) + '</span><b>' + (f.status && f.status.since ? hm(f.status.since) : '—') + '</b></div>' +
      '<div class="sync-actions">' +
        (!cur ? '<button class="btn btn-primary btn-sm" data-chs="start">' + IC.play + esc(tr('chStart')) + '</button>' : '') +
        (state === 'active' ? '<button class="btn btn-ghost btn-sm" data-chs="pause">' + esc(tr('chPause')) + '</button>' : '') +
        (state === 'paused' ? '<button class="btn btn-primary btn-sm" data-chs="resume">' + IC.play + esc(tr('chResume')) + '</button>' : '') +
        (cur ? '<button class="btn btn-quiet btn-sm" data-chs="finish">' + esc(tr('chFinish')) + '</button>' : '') +
      '</div><p class="hint">' + esc(tr('chSessS')) + '</p></section>';
    var hist = (f.sessions || []).filter(function (s) { return s.endedAt; }).slice(-12).reverse();
    h += '<section class="card"><h3 class="card-title"><span class="num">' + IC.clock + '</span>' + esc(tr('chHist')) + '</h3>' +
      (hist.length ? '<div class="ch-hist">' + hist.map(function (s) { return '<div><span>' + esc(EngCal.fmt(Store.dateKey(new Date(s.startedAt)))) + ' ' + hm(s.startedAt) + '–' + hm(s.endedAt) + '</span><b>' + s.activeMin + ' ' + esc(tr('engMin')) + '</b></div>'; }).join('') + '</div>' : '<p class="hint">' + esc(tr('chNoSess')) + '</p>') + '</section>';
    return h + '</div>';
  }

  /* ====================== 5. BILDIRISHNOMALAR ========================= */
  function notifIcon(t) { return { assignment: IC.checklist, feedback: IC.star, message: IC.mic, review: IC.pen, session: IC.eye, assignment_done: IC.check }[t] || IC.spark; }
  function notifText(n) {
    if (n.type === 'session') return tr('chEv_' + String(n.title).replace('session:', ''));
    return n.title;
  }
  function vNotifications() {
    var list = Ctrl.notif();
    var h = '<section class="card"><h3 class="card-title"><span class="num">' + IC.alert + '</span>' + esc(tr('notifT')) + ' · ' + Ctrl.notifUnread() + '</h3>' +
      '<div class="sync-actions" style="margin-bottom:10px"><button class="btn btn-ghost btn-sm" id="nfReadAll">' + IC.check + esc(tr('notifReadAll')) + '</button></div>';
    h += list.length ? '<div class="nf-list">' + list.map(function (n) { return '<button class="nf-row' + (n.read ? '' : ' unread') + '" data-nf="' + esc(n.id) + '" data-go="' + esc(n.route || 'comm') + '">' + notifIcon(n.type) + '<span class="nf-b"><b>' + esc(tr('notifType_' + n.type)) + '</b><span>' + esc(notifText(n)) + '</span></span><time>' + esc(dmy(n.at)) + '</time></button>'; }).join('') + '</div>' : '<p class="hint">' + esc(tr('notifNone')) + '</p>';
    return h + '</section>';
  }

  window.PageComm.mount = function (tab, sub) {
    if (!Ctrl.available() || !Ctrl.feed()) return;
    var box = $('#chMsgs'); if (box) box.scrollTop = box.scrollHeight;
    if (tab === 'messages') { var roles = Ctrl.roles(), cur = roles.indexOf(sub) >= 0 ? sub : roles[0]; if (cur && Ctrl.unread(cur)) Ctrl.markRead(cur); }
    if (tab === 'notifications' && Ctrl.notifUnread()) Ctrl.readNotif();
    $$('[data-chs]').forEach(function (b) { b.addEventListener('click', function () {
      if (b.dataset.chs === 'finish' && !confirm(tr('chFinishQ'))) return;
      b.disabled = true; Ctrl.session(b.dataset.chs).then(function () { App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); b.disabled = false; });
    }); });
    var sb = $('#chSend');
    var send = function () { var ta = $('#chTxt'), v = ta.value.trim(); if (!v) return; ta.value = ''; Ctrl.send(v, sb.dataset.to).then(function () { App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); }); };
    if (sb) sb.addEventListener('click', send);
    var ta = $('#chTxt'); if (ta) { ta.focus(); ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }); }
    $$('[data-adone]').forEach(function (b) { b.addEventListener('click', function () { b.disabled = true; Ctrl.setAssignment(b.dataset.adone, 'completed').then(function () { toast(tr('asDoneOk'), 'ok'); App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); b.disabled = false; }); }); });
    $$('[data-areopen]').forEach(function (b) { b.addEventListener('click', function () { Ctrl.setAssignment(b.dataset.areopen, 'in_progress').then(function () { App.render(); }); }); });
    /* Ochilganda "jarayonda" bo'ladi */
    $$('[data-astart]').forEach(function (b) { b.addEventListener('click', function () { var a = Ctrl.assignments().filter(function (x) { return x.id === b.dataset.astart; })[0]; if (a && a.status === 'assigned') Ctrl.setAssignment(a.id, 'in_progress'); }); });
    $$('[data-rvsend]').forEach(function (b) { b.addEventListener('click', function () { var ta2 = $('[data-rvtext="' + b.dataset.rvsend + '"]'); if (!ta2 || !ta2.value.trim()) return; b.disabled = true; Ctrl.reviseReview(b.dataset.rvsend, ta2.value.trim()).then(function () { toast(tr('rvSent'), 'ok'); App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); b.disabled = false; }); }); });
    var ra = $('#nfReadAll'); if (ra) ra.addEventListener('click', function () { Ctrl.readNotif().then(function () { App.render(); }); });
    $$('[data-nf]').forEach(function (b) { b.addEventListener('click', function () { Ctrl.readNotif([b.dataset.nf]); }); });
    Ctrl.refresh();
  };

  /* Dars sahifalari uchun: "ustozga yuborish" bloki + hozirgi tekshiruv holati.
     kind: writing | speaking · ref: 'wr3' | 'spk12' · text: yuboriladigan matn.
     Mahalliy nusxada (API yo'q) halol izoh; soxta holat yo'q.               */
  window.ReviewBlock = function (kind, ref, title, route, text) {
    if (!window.Ctrl) return '';
    var h = '<div class="card rv-submit"><h3 class="card-title"><span class="num gold">' + IC.upload + '</span>' + esc(tr('rvSubmitT')) + '</h3>';
    if (!Ctrl.available()) return h + '<p class="hint">' + esc(tr('chOffS')) + '</p></div>';
    if (!Ctrl.feed()) return h + '<p class="hint">' + esc(tr(Ctrl.status() === 'auth' ? 'commAuth' : Ctrl.status() === 'env' ? 'chEnv' : 'commLoading')) + '</p></div>';
    var r = Ctrl.reviewFor(kind, ref);
    var fbs = Ctrl.feedbackFor(kind, ref);
    if (r) h += reviewRow(r);
    else h += '<p class="hint">' + esc(tr('rvSubmitS')) + '</p>';
    var canSend = !r || r.stage === 'completed';
    if (canSend) h += '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="rvSubmit" data-kind="' + esc(kind) + '" data-ref="' + esc(ref) + '" data-title="' + esc(title) + '" data-route="' + esc(route) + '"' + (text && text.trim() ? '' : ' disabled title="' + esc(tr('rvNoText')) + '"') + '>' + IC.upload + esc(r ? tr('rvSubmitAgain') : tr('rvSubmitBtn')) + '</button><span class="hint">' + esc(tr('rvSubmitHint')) + '</span></div>';
    if (fbs.length) h += '<div class="gc-l" style="margin-top:12px">' + esc(tr('fbT')) + '</div>' + fbs.map(fbRow).join('');
    return h + '</div>';
  };
  window.ReviewBlock.mount = function (getText) {
    var b = $('#rvSubmit'); if (!b) return;
    b.addEventListener('click', function () {
      var text = (getText ? getText() : '') || '';
      if (!text.trim()) { toast(tr('rvNoText'), 'warn'); return; }
      b.disabled = true;
      Ctrl.submitReview({ kind: b.dataset.kind, ref: b.dataset.ref, title: b.dataset.title, route: b.dataset.route, text: text }).then(function () { toast(tr('rvSent'), 'ok'); App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); b.disabled = false; });
    });
    $$('[data-rvsend]').forEach(function (b2) { b2.addEventListener('click', function () { var ta2 = $('[data-rvtext="' + b2.dataset.rvsend + '"]'); if (!ta2 || !ta2.value.trim()) return; b2.disabled = true; Ctrl.reviseReview(b2.dataset.rvsend, ta2.value.trim()).then(function () { toast(tr('rvSent'), 'ok'); App.render(); }).catch(function () { toast(tr('chErr'), 'warn'); b2.disabled = false; }); }); });
  };

  /* Eski #/chat — xabarlar tabi */
  window.PageChat = function () { return PageComm('messages', 'controller'); };
  window.PageChat.mount = function () { PageComm.mount('messages', 'controller'); };

  /* Yangi xabar/bildirishnoma kelsa — sahifada bo'lsa qayta chizish; bo'lmasa nishon */
  var lastSig = '';
  Ctrl.onChange(function (f) {
    var sig = f ? JSON.stringify([Object.keys(f.convs || {}).map(function (k) { return f.convs[k].msgs.length + ':' + (f.convs[k].msgs.slice(-1)[0] || {}).id; }), (f.status || {}).state, f.staffOnline, (f.assignments || []).length, (f.feedback || []).length, (f.reviews || []).map(function (r) { return r.stage; }), (f.notif || []).length]) : '';
    if (sig === lastSig) return; lastSig = sig;
    if (window.Search && Search.invalidate) Search.invalidate();   // topshiriq/feedback qidiruvda yangilansin
    if (/^#\/(chat|comm)/.test(location.hash) && document.activeElement && /^(chTxt)$/.test(document.activeElement.id) && document.activeElement.value) return;
    if (/^#\/(chat|comm)/.test(location.hash)) App.render(); else App.refreshChrome();
  });
})();
