/* ==========================================================================
   Writing kursi — #/writing (1-oktabrdan), #/writing/<hafta>
   --------------------------------------------------------------------------
   WRITING (eng-writing.js): 19 hafta. Joriy hafta sanadan hisoblanadi.
   Har hafta: mavzu, 3 bo'lim (model gaplar bilan), tekshiruv ro'yxati,
   7 kunlik vazifalar (bugungisi ajratilgan), tez-tez uchraydigan xatolar.
   "Haftani yopish" → Store.plan['wr<n>'] (bulut bilan sinxron, OR).
   ========================================================================== */
(function () {
  'use strict';

  function weekOf(key) {
    var W = window.WRITING; if (!W) return null;
    key = key || Store.dateKey();
    if (key < W.meta.start) return null;
    var cur = null;
    W.weeks.forEach(function (w) { if (key >= w.from) cur = w; });
    if (key > W.meta.end) return null;
    return cur;
  }
  function weekRange(w) {
    var W = window.WRITING, i = W.weeks.indexOf(w);
    var next = W.weeks[i + 1];
    return { from: w.from, to: next ? Store.shiftDays(next.from, -1) : W.meta.end };
  }
  /* Haftaning bugungi vazifa indeksi: 1-hafta payshanbadan boshlanadi (0..3),
     boshqalari dushanbadan (0..6) */
  function taskIndex(w, key) {
    var r = weekRange(w), n = Math.round((new Date(key + 'T00:00:00') - new Date(r.from + 'T00:00:00')) / 86400000);
    var dow = new Date(key + 'T00:00:00').getDay();
    var idx = dow === 0 ? 6 : dow - 1;   // Du=0 … Ya=6
    return Math.min(6, Math.max(0, idx));
  }

  window.Writing = {
    currentWeek: function () { return weekOf(); },
    weekRange: weekRange,
    daysToStart: function () { return Math.round((new Date(WRITING.meta.start + 'T00:00:00') - new Date(Store.dateKey() + 'T00:00:00')) / 86400000); },
    isDone: function (n) { return Store.planDone('wr' + n); },
    doneCount: function () { var c = 0; WRITING.weeks.forEach(function (w) { if (Store.planDone('wr' + w.n)) c++; }); return c; },
    /* ====================== USTOZ BAHOSI (tashqi kalibrovka) ================
       Platforma insho bandini o'lchay olmaydi — 6.5 mi, 7.5 mi, faqat
       sertifikatli IELTS o'qituvchisi real band deskriptorlari bo'yicha
       aytadi. Shu raqam butun rejaning to'g'ri sozlanganini belgilaydi.
       Maqsad: kamida 5 ta topshiriq baholansin. Saqlanadi: Store.read
       'wr-N' -> { teacher: { band, note, at } }.                          */
    teacherMarks: function () {
      var out = [];
      WRITING.weeks.forEach(function (w) { var r = Store.readGet('wr-' + w.n) || {}; if (r.teacher && typeof r.teacher.band === 'number') out.push({ n: w.n, band: r.teacher.band, note: r.teacher.note || '', at: r.teacher.at || 0 }); });
      return out;
    },
    teacherAvg: function () { var m = Writing.teacherMarks(); if (!m.length) return null; return Math.round(m.reduce(function (s, x) { return s + x.band; }, 0) / m.length * 2) / 2; },
    TEACHER_GOAL: 5
  };

  window.PageWriting = function (n) {
    var W = window.WRITING;
    if (!W) return '<div class="page empty"><h3>404</h3></div>';
    var cur = weekOf();
    var w = n ? W.weeks.filter(function (x) { return x.n === Number(n); })[0] : cur;
    if (n && !w) return '<div class="page empty"><h3>404</h3><p>' + esc(tr('engWeek')) + ' ' + esc(n) + '</p></div>';

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('courses')) + ' · ' + esc(tr('engSkillWriting')) + '</div>' +
      '<h1>' + esc(L(W.meta.title)) + '</h1>' +
      '<p class="lede">' + esc(L(W.meta.lede)) + '</p></header>';

    var done = Writing.doneCount();
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.trend + esc(tr('engProgress')) + '</div><div class="st-v">' + done + '<small> / ' + W.weeks.length + '</small></div>' +
        '<div class="bar" style="margin-top:9px"><i style="width:' + (done / W.weeks.length * 100) + '%"></i></div><div class="st-note">' + esc(tr('wrWeeksDone')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.calendar + esc(tr('engToday')) + '</div><div class="st-v">' + (cur ? cur.n : '—') + '</div><div class="st-note">' + esc(cur ? L(cur.title) : (Writing.daysToStart() > 0 ? tr('engDaysToStart', { n: Writing.daysToStart() }) : tr('engOver'))) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('spkDaily')) + '</div><div class="st-v" style="font-size:26px">45–60<small>' + esc(tr('engMin')) + '</small></div><div class="st-note">' + esc(EngCal.fmt(W.meta.start)) + ' → ' + esc(EngCal.fmt(W.meta.end)) + '</div></div>' +
      '<div class="stat-tile gold"><div class="st-l">' + IC.target + esc(tr('spkGoal')) + '</div><div class="st-v" style="font-size:22px">Writing 7.5+</div><div class="st-note">' + esc(tr('wrGoalS')) + '</div></div>' +
      '</div>';

    /* Tashqi kalibrovka: necha insho ustoz tomonidan baholangan, o'rtacha band */
    var marks = Writing.teacherMarks(), tAvg = Writing.teacherAvg();
    h += '<div class="callout ' + (marks.length >= Writing.TEACHER_GOAL ? 'good' : 'pitfall') + '" style="margin-bottom:18px"><span class="co-ic">' + IC.user + '</span><div>' +
      '<h4>' + esc(tr('wrTeacherT')) + ' \u00b7 ' + marks.length + ' / ' + Writing.TEACHER_GOAL + (tAvg !== null ? ' \u00b7 ' + esc(tr('wrTeacherAvg')) + ' ' + tAvg.toFixed(1) : '') + '</h4>' +
      esc(marks.length >= Writing.TEACHER_GOAL ? tr('wrTeacherOk') : tr('wrTeacherWhy')) + '</div></div>';

    /* 4 mezon */
    h += '<div class="wr-crit">';
    W.meta.criteria.forEach(function (c) { h += '<div class="wr-c"><b>' + esc(c.k) + '</b><span>' + esc(L(c.name)) + '</span></div>'; });
    h += '</div>';

    if (!w) {
      h += '<div class="callout tip"><span class="co-ic">' + IC.clock + '</span><div>' + esc(tr('wrNotYet', { d: EngCal.fmt(W.meta.start) })) + '</div></div>';
    } else {
      h += weekView(w, w === cur);
    }

    /* Barcha haftalar */
    h += sectionHead(9, tr('wrAllWeeks'), W.weeks.length + ' ' + tr('engWeek').toLowerCase());
    h += '<div class="bk-grid">';
    W.weeks.forEach(function (x) {
      var r = weekRange(x);
      h += '<button class="bk-unit' + (cur && x.n === cur.n ? ' today' : '') + (Writing.isDone(x.n) ? ' done' : '') + '" data-go="writing/' + x.n + '">' +
        '<span class="bu-n">' + (Writing.isDone(x.n) ? IC.check + ' ' : '') + esc(tr('engWeek')) + ' ' + x.n + ' · ' + esc(EngCal.fmt(r.from)) + '</span>' +
        '<span class="bu-t">' + esc(L(x.title)) + '</span>' +
        '<span class="bu-w">' + esc(L(x.focus)) + '</span></button>';
    });
    h += '</div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="course">' + IC.arrowL + esc(tr('courses')) + '</button><span></span></div>';
    return h + '</div>';
  };

  function weekView(w, isCurrent) {
    var r = weekRange(w);
    var ti = isCurrent ? taskIndex(w, Store.dateKey()) : -1;
    var h = '<div class="eng-phase-head"><span class="ep-n">' + w.n + '</span><span class="ep-t"><b>' + esc(L(w.title)) + '</b>' +
      '<span>' + esc(EngCal.fmt(r.from)) + ' – ' + esc(EngCal.fmt(r.to)) + ' · ' + esc(L(w.focus)) + '</span></span></div>';
    h += '<div class="intro-block">' + esc(L(w.intro)) + '</div>';

    w.sections.forEach(function (s, i) {
      h += '<div class="card wr-sec"><h3 class="card-title"><span class="num">' + (i + 1) + '</span>' + esc(L(s.h)) + '</h3>' +
        '<p>' + esc(L(s.p)) + '</p>';
      if (s.model && s.model.length) {
        h += '<div class="wr-model"><div class="gc-l">' + esc(tr('wrModel')) + '</div>';
        s.model.forEach(function (m) { h += '<div class="wr-m">' + esc(m) + '</div>'; });
        h += '</div>';
      }
      h += '</div>';
    });

    /* Tekshiruv ro'yxati */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.checklist + '</span>' + esc(tr('wrChecklist')) + '</h3><ul class="wr-check">';
    L(w.checklist).forEach(function (c) { h += '<li>' + esc(c) + '</li>'; });
    h += '</ul></div>';

    /* 7 kunlik vazifalar */
    h += '<div class="card"><h3 class="card-title"><span class="num">' + IC.calendar + '</span>' + esc(tr('wrTasks')) + '</h3><div class="wr-tasks">';
    var names = ['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha', 'Ya'];
    L(w.tasks).forEach(function (t, i) {
      h += '<div class="wr-task' + (i === ti ? ' today' : '') + '"><span class="wt-d">' + names[i] + '</span><span>' + esc(t) + '</span>' + (i === ti ? '<span class="wt-now">' + esc(tr('coursesToday')) + '</span>' : '') + '</div>';
    });
    h += '</div></div>';

    /* Xatolar */
    if (w.errors && w.errors.length) {
      h += '<div class="card"><h3 class="card-title"><span class="num red">' + IC.alert + '</span>' + esc(tr('engCommonMistakes')) + '</h3><div class="gc-mis">';
      w.errors.forEach(function (e) { h += '<div class="gm-row"><span class="gm-bad">' + esc(e.bad) + '</span><span class="gm-arrow">→</span><span class="gm-good">' + esc(e.good) + '</span></div>'; });
      h += '</div></div>';
    }

    /* Qoralama → tekshiruv → qayta yozish: versiyalar (Store.read 'wr-N') + 6 bandli checklist */
    var rec = Store.readGet('wr-' + w.n) || {}, versions = rec.versions || [];
    var draft = rec.draft || '';
    var finalIdx = typeof rec.final === 'number' ? rec.final : -1;
    /* Bosqichlar: Savol → Reja → Lug'at → Qoralama → Tekshiruv → Qayta yozish → Final */
    var stage = finalIdx >= 0 ? 7 : versions.length >= 2 ? 5 : versions.length === 1 ? 4 : draft.trim() ? 3 : (rec.plan || '').trim() ? 2 : 1;
    h += '<div class="wr-flow">' + ['wrSt1', 'wrSt2', 'wrSt3', 'wrSt4', 'wrSt5', 'wrSt6', 'wrSt7'].map(function (k, i) { return '<span class="' + (i < stage ? 'on' : '') + (i === stage ? ' now' : '') + '">' + esc(tr(k)) + '</span>'; }).join('<i>→</i>') + '</div>';
    h += '<div class="card wr-draft"><h3 class="card-title"><span class="num">' + IC.pen + '</span>' + esc(tr('wrVersions')) + ' · ' + versions.length + (finalIdx >= 0 ? ' · <span class="wr-final-tag">' + esc(tr('wrFinal')) + ' v' + (finalIdx + 1) + '</span>' : '') + '</h3>' +
      '<div class="field"><label for="wrPlan">' + esc(tr('wrPlanT')) + '</label><textarea class="textarea" id="wrPlan" rows="3" placeholder="' + esc(tr('wrPlanPh')) + '">' + esc(rec.plan || '') + '</textarea><div class="hint">' + esc(tr('wrPlanS')) + '</div></div>' +
      '<label class="field-label" for="wrDraft">' + esc(tr('wrDraftT')) + '</label>' +
      '<textarea class="textarea" id="wrDraft" rows="8" placeholder="' + esc(tr('wrVersionPh')) + '">' + esc(draft) + '</textarea>' +
      '<div class="sync-actions"><span class="hint" id="wrWords">' + esc(tr('wrWords', { n: draft.trim() ? draft.trim().split(/\s+/).length : 0 })) + '</span><button class="btn btn-primary btn-sm" id="wrSaveV" data-wk="' + w.n + '">' + IC.check + esc(tr('wrSaveVersion')) + '</button></div>' +
      '<div class="wr-ck">' + [1, 2, 3, 4, 5, 6].map(function (i) { var on = Store.flag('wr-ck:' + w.n + ':' + i); return '<label class="ck-row' + (on ? ' on' : '') + '"><input type="checkbox" data-wrck="' + w.n + ':' + i + '"' + (on ? ' checked' : '') + '><span>' + esc(tr('wrCk' + i)) + '</span></label>'; }).join('') + '</div>' +
      (versions.length ? '<div class="wr-vlist">' + versions.map(function (v, i) {
        return '<details class="wr-v' + (i === finalIdx ? ' final' : '') + '"><summary><b>v' + (i + 1) + '</b> · ' + esc(fmtDate(v.at)) + ' · ' + esc(tr('wrWords', { n: v.words })) + (i === finalIdx ? ' · <span class="wr-final-tag">' + esc(tr('wrFinal')) + '</span>' : '') + '</summary><pre>' + esc(v.text) + '</pre>' +
          '<div class="sync-actions"><button class="btn btn-quiet btn-sm" data-wrfinal="' + w.n + ':' + i + '">' + (i === finalIdx ? IC.close + esc(tr('wrUnfinal')) : IC.check + esc(tr('wrMarkFinal'))) + '</button>' +
          '<button class="btn btn-quiet btn-sm" data-wrload="' + w.n + ':' + i + '">' + IC.refresh + esc(tr('wrLoadV')) + '</button></div></details>';
      }).reverse().join('') + '</div>' : '<p class="hint">' + esc(tr('wrNoVersions')) + '</p>') +
      '</div>';

    /* Platformadagi o'qituvchi/english xodimga yuborish: FINAL (yoki oxirgi) versiya.
       Oqim: yuborildi → tekshirildi → qayta yozildi → 2-tekshiruv → tugallandi. */
    var sendText = finalIdx >= 0 && versions[finalIdx] ? versions[finalIdx].text : (versions.length ? versions[versions.length - 1].text : draft);
    if (window.ReviewBlock) h += ReviewBlock('writing', 'wr' + w.n, tr('engWeek') + ' ' + w.n + ' — ' + L(w.title), 'writing/' + w.n, sendText);

    /* Ustoz bahosi — real band, izoh bilan. Faqat sertifikatli o'qituvchi bahosi yoziladi. */
    var tch = rec.teacher || {};
    var bands = []; for (var bb = 5; bb <= 9; bb += 0.5) bands.push(bb);
    h += '<div class="card"><h3 class="card-title"><span class="num gold">' + IC.user + '</span>' + esc(tr('wrTeacherT')) + '</h3>' +
      '<p style="font-size:14px;color:var(--muted);margin-bottom:12px">' + esc(tr('wrTeacherHint')) + '</p>' +
      '<div class="field"><label for="wrTBand">' + esc(tr('wrTeacherBand')) + '</label><select class="select" id="wrTBand" data-wk="' + w.n + '" style="max-width:200px">' +
        '<option value="">\u2014</option>' + bands.map(function (b) { return '<option value="' + b + '"' + (tch.band === b ? ' selected' : '') + '>' + b.toFixed(1) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="wrTNote">' + esc(tr('wrTeacherNote')) + '</label><textarea class="textarea" id="wrTNote" rows="3" placeholder="' + esc(tr('wrTeacherNotePh')) + '">' + esc(tch.note || '') + '</textarea>' +
      '<div class="hint" id="wrTStatus">' + (tch.at ? esc(tr('saved') + ' \u00b7 ' + fmtDate(tch.at)) : '') + '</div></div></div>';

    h += '<div class="sync-actions" style="margin:12px 0 24px"><button class="btn ' + (Writing.isDone(w.n) ? 'btn-ghost' : 'btn-primary') + '" data-wrdone="' + w.n + '">' +
      (Writing.isDone(w.n) ? esc(tr('engDayReopen')) : IC.check + esc(tr('wrMarkWeek'))) + '</button></div>';
    return h;
  }

  window.PageWriting.mount = function () {
    var ta = $('#wrDraft'), sv = $('#wrSaveV'), tm = null;
    if (ta && sv) {
      var wk = sv.dataset.wk;
      ta.addEventListener('input', function () {
        var wc = $('#wrWords'); if (wc) wc.textContent = tr('wrWords', { n: ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0 });
        clearTimeout(tm); tm = setTimeout(function () { Store.readSet('wr-' + wk, { draft: ta.value }); }, 600);
      });
      sv.addEventListener('click', function () {
        var text = ta.value.trim(); if (!text) return;
        var rec = Store.readGet('wr-' + wk) || {}; var vs = (rec.versions || []).slice();
        vs.push({ text: text, words: text.split(/\s+/).length, at: Date.now() });
        Store.readSet('wr-' + wk, { versions: vs, draft: text });
        toast(tr('wrVersionSaved'), 'ok'); App.render();
      });
    }
    /* Reja (outline) — avtomatik saqlanadi */
    var pl = $('#wrPlan'), ptm = null;
    if (pl && sv) pl.addEventListener('input', function () { clearTimeout(ptm); ptm = setTimeout(function () { Store.readSet('wr-' + sv.dataset.wk, { plan: pl.value }); }, 600); });
    /* Final versiya belgisi va versiyani qoralamaga qaytarish */
    $$('[data-wrfinal]').forEach(function (b) { b.addEventListener('click', function () {
      var p = b.dataset.wrfinal.split(':'), r = Store.readGet('wr-' + p[0]) || {};
      Store.readSet('wr-' + p[0], { final: r.final === Number(p[1]) ? -1 : Number(p[1]) }); App.render();
    }); });
    $$('[data-wrload]').forEach(function (b) { b.addEventListener('click', function () {
      var p = b.dataset.wrload.split(':'), r = Store.readGet('wr-' + p[0]) || {}, v = (r.versions || [])[Number(p[1])];
      if (!v) return; Store.readSet('wr-' + p[0], { draft: v.text }); App.render(); toast(tr('wrLoaded', { n: Number(p[1]) + 1 }), 'ok');
    }); });
    $$('[data-wrck]').forEach(function (cb) { cb.addEventListener('change', function () { Store.setFlag('wr-ck:' + cb.dataset.wrck, cb.checked); cb.closest('.ck-row').classList.toggle('on', cb.checked); }); });
    /* Ustoz bahosi — band tanlansa yoki izoh yozilsa saqlanadi */
    var tb = $('#wrTBand'), tn = $('#wrTNote'), ttm = null;
    function saveTeacher() {
      if (!tb) return;
      var band = tb.value === '' ? null : Number(tb.value);
      var rec = Store.readGet('wr-' + tb.dataset.wk) || {};
      var prev = rec.teacher || {};
      var teacher = (band === null && !(tn && tn.value.trim())) ? null : { band: band, note: tn ? tn.value.trim() : '', at: Date.now() };
      Store.readSet('wr-' + tb.dataset.wk, { teacher: teacher });
      var st = $('#wrTStatus'); if (st) st.textContent = teacher ? tr('saved') : '';
      if (teacher && band !== null && prev.band !== band) toast(tr('wrTeacherSaved', { b: band.toFixed(1) }), 'ok');
    }
    if (tb) tb.addEventListener('change', saveTeacher);
    if (tn) tn.addEventListener('input', function () { clearTimeout(ttm); ttm = setTimeout(saveTeacher, 600); });

    if (window.ReviewBlock) ReviewBlock.mount(function () {
      var sv = $('#wrSaveV'); if (!sv) return '';
      var r = Store.readGet('wr-' + sv.dataset.wk) || {}, vs = r.versions || [];
      var fi = typeof r.final === 'number' ? r.final : -1;
      return fi >= 0 && vs[fi] ? vs[fi].text : (vs.length ? vs[vs.length - 1].text : (r.draft || ''));
    });
    $$('[data-wrdone]').forEach(function (b) {
      b.addEventListener('click', function () {
        Store.togglePlan('wr' + b.dataset.wrdone);
        toast(tr(Store.planDone('wr' + b.dataset.wrdone) ? 'wrWeekDone' : 'engDayReopened'), 'ok');
        App.render();
      });
    });
  };

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div><h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }
})();
