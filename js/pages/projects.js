/* ==========================================================================
   Projects (#/projects) — Python loyihalari: ochilish, checklist, mulohaza
   --------------------------------------------------------------------------
   Holat: locked (dars yetarli emas) → open → in-progress → done.
   Checklist bandlari Store.done["proj:<id>:<i>"], tugash "proj:<id>:done"
   (hamma band belgilangandan keyingina bosiladi). Eslatma/mulohaza —
   Store.readSet('proj-<id>', {notes, reflection}).
   ========================================================================== */
(function () {
  'use strict';

  function state(p) {
    var done = Store.flag('proj:' + p.id + ':done');
    var n = p.steps.filter(function (_, i) { return Store.flag('proj:' + p.id + ':' + i); }).length;
    var open = Store.doneCount() >= p.after;
    return { done: done, n: n, open: open, st: done ? 'done' : !open ? 'locked' : n ? 'progress' : 'open' };
  }

  window.PageProjects = function () {
    var list = PROJECTS.list, doneN = list.filter(function (p) { return state(p).done; }).length;
    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">Python · ' + esc(tr('prjKick')) + '</div><h1>' + esc(L(PROJECTS.meta.title)) + '</h1><p class="lede">' + esc(L(PROJECTS.meta.lede)) + '</p></header>';
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.check + esc(tr('prjDone')) + '</div><div class="st-v">' + doneN + '<small> / ' + list.length + '</small></div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.code + esc(tr('prjUnlocked')) + '</div><div class="st-v">' + list.filter(function (p) { return state(p).open; }).length + '</div><div class="st-note">' + esc(tr('prjUnlockNote', { n: Store.doneCount() })) + '</div></div>' +
      '<div class="stat-tile gold"><div class="st-l">' + IC.star + esc(tr('prjPortfolio')) + '</div><div class="st-v">' + list.filter(function (p) { return state(p).done && p.level >= 3; }).length + '</div><div class="st-note">' + esc(tr('prjPortfolioNote')) + '</div></div></div>';

    h += '<div class="prj-flow">' + ['prjFlow1', 'prjFlow2', 'prjFlow3', 'prjFlow4', 'prjFlow5'].map(function (k) { return '<span>' + esc(tr(k)) + '</span>'; }).join('<i>→</i>') + '</div>';

    list.forEach(function (p) {
      var s = state(p), r = Store.readGet('proj-' + p.id) || {};
      h += '<details class="prj ' + s.st + '"' + (s.st === 'open' || s.st === 'progress' ? ' open' : '') + '>' +
        '<summary><span class="prj-lv">L' + p.level + '</span><span class="prj-body"><b>' + esc(L(p.title)) + '</b><span>' + esc(tr('prjAfter', { n: p.after })) + ' · ~' + p.hours + ' ' + esc(tr('hoursShort')) + ' · ' + esc(p.skills.join(' · ')) + '</span></span>' +
        '<span class="prj-st">' + (s.done ? IC.check : s.st === 'locked' ? IC.lock : s.n + '/' + p.steps.length) + '</span></summary>' +
        '<div class="prj-in"><p class="prj-goal">' + esc(L(p.goal)) + '</p>';
      if (s.st === 'locked') h += '<div class="callout tip"><span class="co-ic">' + IC.lock + '</span><div>' + esc(tr('prjLocked', { n: p.after - Store.doneCount() })) + '</div></div>';
      h += '<ul class="prj-steps">';
      p.steps.forEach(function (st, i) {
        var on = Store.flag('proj:' + p.id + ':' + i);
        h += '<li class="' + (on ? 'on' : '') + '"><button class="hb-check" data-prjstep="' + p.id + ':' + i + '"' + (s.st === 'locked' ? ' disabled' : '') + ' role="checkbox" aria-checked="' + on + '">' + (on ? IC.check : '') + '</button><span>' + esc(L(st)) + '</span></li>';
      });
      h += '</ul>';
      /* Muddat (o'zim qo'yaman) + xodim feedback'i (server, faqat student-visible) */
      h += '<div class="prj-meta"><label class="field"><span class="gc-l">' + esc(tr('prjDeadline')) + '</span><input class="input sm" type="date" data-prjdl="' + p.id + '" value="' + esc(r.deadline || '') + '"></label>' +
        '<span class="chip">' + esc(tr('prjStatus_' + s.st)) + '</span>' + (r.deadline && !s.done && r.deadline < Store.dateKey() ? '<span class="chip hot">' + esc(tr('asSt_overdue')) + '</span>' : '') + '</div>';
      var pfb = window.Ctrl && Ctrl.feedbackFor ? Ctrl.feedbackFor('project', p.id) : [];
      if (pfb.length) h += '<div class="prj-fb"><div class="gc-l">' + IC.star + ' ' + esc(tr('fbT')) + '</div>' + pfb.map(function (f) { return '<div class="fb-row"><div class="fb-head"><span class="fb-by">' + esc(tr('role_' + f.role)) + ' · ' + esc(fmtDate(f.at)) + '</span></div><p class="fb-text">' + esc(f.text) + '</p>' + (f.fb ? '<div class="fb-struct">' + ['strengths', 'weaknesses', 'corrections', 'recommendations', 'next'].filter(function (k) { return f.fb[k]; }).map(function (k) { return '<div class="fb-k"><span>' + esc(tr('fb_' + k)) + '</span><p>' + esc(f.fb[k]) + '</p></div>'; }).join('') + '</div>' : '') + '</div>'; }).join('') + '</div>';
      h += '<div class="field"><label>' + esc(tr('prjNotes')) + '</label><textarea class="textarea" data-prjnote="' + p.id + '" rows="2" placeholder="' + esc(tr('prjNotesPh')) + '">' + esc(r.notes || '') + '</textarea></div>';
      h += '<div class="field"><label>' + esc(tr('prjReflect')) + '</label><textarea class="textarea" data-prjref="' + p.id + '" rows="2" placeholder="' + esc(tr('prjReflectPh')) + '">' + esc(r.reflection || '') + '</textarea></div>';
      h += '<div class="sync-actions"><button class="btn ' + (s.done ? 'btn-ghost' : 'btn-primary') + '" data-prjdone="' + p.id + '"' + (s.n < p.steps.length && !s.done ? ' disabled title="' + esc(tr('prjNeedAll')) + '"' : '') + '>' + (s.done ? esc(tr('engDayReopen')) : IC.check + esc(tr('prjMarkDone'))) + '</button>' +
        '<button class="btn btn-ghost btn-sm" data-go="cheatsheet">' + IC.grid + esc(tr('cheatsheet')) + '</button></div>';
      h += '</div></details>';
    });
    return h + '</div>';
  };

  window.PageProjects.mount = function () {
    /* "Davom etish" uchun: qaysi loyiha ustida ishlanayotgani */
    var touch = function (id) {
      var p = PROJECTS.list.filter(function (x) { return x.id === id; })[0];
      if (p && !Store.flag('proj:' + id + ':done')) Store.lastSet('project', 'projects', L(p.title));
    };
    $$('[data-prjstep]').forEach(function (b) { b.addEventListener('click', function () { Store.setFlag('proj:' + b.dataset.prjstep); touch(b.dataset.prjstep.split(':')[0]); App.render(); }); });
    $$('[data-prjdone]').forEach(function (b) { b.addEventListener('click', function () { var k = 'proj:' + b.dataset.prjdone + ':done'; Store.setFlag(k); if (Store.flag(k)) toast(tr('prjCongrats'), 'ok'); App.render(); App.refreshChrome(); }); });
    var save = function (id, patch) { Store.readSet('proj-' + id, patch); touch(id); };
    $$('[data-prjdl]').forEach(function (i) { i.addEventListener('change', function () { save(i.dataset.prjdl, { deadline: i.value }); App.render(); }); });
    $$('[data-prjnote]').forEach(function (t) { var tm; t.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { save(t.dataset.prjnote, { notes: t.value }); }, 600); }); });
    $$('[data-prjref]').forEach(function (t) { var tm; t.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { save(t.dataset.prjref, { reflection: t.value }); }, 600); }); });
  };
})();
