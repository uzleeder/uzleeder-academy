/* ==========================================================================
   DataCamp o'qish rejasi sahifasi
   --------------------------------------------------------------------------
   Har bosqichni "tugatdim" deb belgilash mumkin — belgi Store.plan da saqlanadi.
   ========================================================================== */
(function () {
  'use strict';

  window.PagePlan = function () {
    var phases = DCPLAN.phases;
    var donePh = phases.filter(function (p) { return Store.planDone('phase' + p.n); }).length;
    var pct = Math.round(donePh / phases.length * 100);

    var h = '<div class="page stagger">';

    h += '<header class="page-head">' +
      '<div class="eyebrow">DataCamp × UzLeeder</div>' +
      '<h1>AI Engineer <span class="grad">' + esc(tr('planShort')) + '</span></h1>' +
      '<p class="lede">' + esc(L(DCPLAN.intro)) + '</p></header>';

    /* Haftalik reja — bu hafta (Du–Ya) nima bor: Python darslari, ingliz kunlari,
       writing haftasi, speaking kunlari, takror muddati. Hammasi taqvimdan. */
    if (window.HabitPlan && window.EngCal) {
      var tk = Store.dateKey(), dd = new Date(tk + 'T00:00:00');
      var mon = Store.shiftDays(tk, -((dd.getDay() + 6) % 7));
      var names = Store.get('lang') === 'en' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha', 'Ya'];
      h += '<div class="section-head"><div class="sh-n">' + IC.calendar + '</div><div><h2>' + esc(tr('wpT')) + '</h2><div class="sh-sub">' + esc(tr('wpS')) + '</div></div></div><div class="wp-grid">';
      for (var i = 0; i < 7; i++) {
        var k = Store.shiftDays(mon, i), inR = HabitPlan.inRange(k);
        var py = inR ? HabitPlan.pyDayOf(k) : 0, en = inR ? EngCal.dayOfKey(k) : 0, sp = inR ? HabitPlan.speakDayOf(k) : 0;
        var type = inR ? HabitPlan.typeOf(k) : '';
        var done = inR && k < tk ? HabitPlan.isDayDone(HabitPlan.forDate(k)) : null;
        var rvDue = window.Review ? Review.list().filter(function (it) { return it.due === k; }).length : 0;
        h += '<button class="wp-day' + (k === tk ? ' today' : '') + (done === true ? ' done' : done === false ? ' missed' : '') + '" data-go="habit/' + k + '">' +
          '<span class="wp-d">' + names[i] + ' <i>' + k.slice(8) + '</i></span>' +
          (inR ? '<span class="wp-t">' + esc(tr('habType_' + type)) + '</span>' : '<span class="wp-t">—</span>') +
          (py ? '<span>' + IC.code + 'Py ' + py + '</span>' : '') + (en ? '<span>' + IC.globe + 'EN ' + en + '</span>' : '') + (sp ? '<span>' + IC.mic + 'Spk ' + sp + '</span>' : '') +
          (rvDue ? '<span class="wp-rv">' + IC.refresh + rvDue + '</span>' : '') + '</button>';
      }
      h += '</div>';
    }

    /* Umumiy progress */
    h += '<div class="card" style="max-width:860px;margin-bottom:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:9px">' +
      '<span style="font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--brand-hi)">' +
        esc(Store.get('lang') === 'en' ? 'Phases' : 'Bosqichlar') + '</span>' +
      '<span style="font-family:var(--font-mono);font-weight:800;color:var(--brand-hi)">' + donePh + ' / ' + phases.length + '</span>' +
      '</div><div class="bar gold"><i style="width:' + pct + '%"></i></div></div>';

    /* Halol muddat izohi */
    h += '<div class="callout tip" style="max-width:860px"><span class="co-ic">' + IC.clock + '</span>' +
      '<div>' + esc(L(DCPLAN.totalNote)) + '</div></div>';

    /* Ingliz tili parallel yuradi — reja shuni hisobga olishi kerak */
    h += '<div class="callout why" style="max-width:860px"><span class="co-ic">' + IC.globe + '</span>' +
      '<div><h4>' + esc(tr('dualPlanT')) + '</h4>' + esc(tr('dualPlanP')) +
      '<div style="margin-top:12px"><button class="btn btn-primary btn-sm" data-go="roadmap">' +
        esc(tr('dualT')) + IC.arrowR + '</button></div></div></div>';

    /* Bosqichlar */
    h += '<div class="plan-list" style="margin-top:20px">';
    phases.forEach(function (ph) {
      var key = 'phase' + ph.n;
      /* 1-bosqich = DataCamp treki: holati trekdan o'zi hisoblanadi */
      var done = ph.n === 1 && window.DataCamp ? DataCamp.doneCount() >= DataCamp.total() : Store.planDone(key);
      h += '<div class="plan-phase' + (done ? ' done' : '') + '">' +
        '<button class="ph-head" ' + (ph.n === 1 && window.DataCamp ? 'data-go="datacamp"' : 'data-phase="' + key + '"') + '>' +
          '<span class="ph-n">' + (done ? IC.check : ph.n) + '</span>' +
          '<span class="ph-t"><span class="t" style="display:block">' + esc(L(ph.title)) + '</span>' +
          '<span class="time" style="display:block">' + esc(L(ph.time)) + '</span></span>' +
          '<span class="ph-chk">' + (done ? '✓' : '') + '</span>' +
        '</button>' +
        '<div class="ph-body">' +
          '<div class="ph-goal">' + esc(L(ph.goal)) + '</div>' +
          '<div class="ph-label">' + esc(Store.get('lang') === 'en' ? 'Courses:' : 'Kurslar:') + '</div>';
      ph.courses.forEach(function (c, i) {
        h += '<div class="ph-course"><span class="n">' + (i + 1) + '</span>' + esc(L(c)) + '</div>';
      });
      if (ph.n === 1) {
        var dcp = window.DataCamp ? DataCamp.doneCount() + '/' + DataCamp.total() : '';
        h += '<div class="callout why" style="margin:14px 0"><span class="co-ic">' + IC.layers + '</span>' +
          '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">' +
          '<span style="flex:1;min-width:170px">' + esc(tr('coursesDCD')) + (dcp ? ' <b>' + dcp + '</b>' : '') + '</span>' +
          '<button class="btn btn-primary btn-sm" data-go="datacamp">DataCamp' + IC.arrowR + '</button>' +
          '<button class="btn btn-ghost btn-sm" data-go="python">Python 30' + IC.arrowR + '</button></div></div>';
      }
      h += '<div class="callout tip"><span class="co-ic">' + IC.medal + '</span><div>' + esc(L(ph.tip)) + '</div></div>' +
        '</div></div>';
    });
    h += '</div>';

    h += '<div class="callout why" style="text-align:center;flex-direction:column;align-items:center;margin-top:20px;max-width:860px">' +
      '<div>' + esc(tr('rmCareerCTA')) + '</div>' +
      '<button class="btn btn-primary" data-go="career" style="margin-top:12px">' + IC.star + esc(tr('career')) + IC.arrowR + '</button></div>';

    h += '<div class="note-band">' + esc(tr('rmNote')) + '</div>';
    return h + '</div>';
  };
})();
