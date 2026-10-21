/* ==========================================================================
   BBC Listening — #/bbc  (kurslar markazidagi "Listening · BBC" kartasi)
   --------------------------------------------------------------------------
   Manba: BBC Learning English podcastlari (6 Minute English, The English We
   Speak). Epizodlar ro'yxati va MP3 manzillari /api/bbc orqali BBC'ning
   ochiq RSS'idan keladi; audio to'g'ridan-to'g'ri BBC serveridan oqadi,
   platformada saqlanmaydi. Transkript BBC sahifasida — havola beriladi.

   Har epizod uchun bir xil 6 bosqichli mashq (haqiqiy IELTS tinglash
   mashqi): bashorat → umumiy ma'no → tafsilot (6 so'z) → shadowing →
   transkript bilan solishtirish → xulosa + og'zaki qayta aytish.
   Eslatma va "tugatildi" Store.bbc da (bulut bilan sinxron).

   file:// yoki API bo'lmasa — qo'lda rejim: BBC sahifasiga havola va
   MP3 manzilini o'zi qo'yish.
   ========================================================================== */
(function () {
  'use strict';

  var SERIES = [
    { key: '6min',  title: '6 Minute English',    per: '6 daq', note: { uz: 'Har epizodda 1 savol + 6 ta so\'z. IELTS Section 3 tezligi.', en: 'One question + six words per episode. IELTS Section 3 pace.' } },
    { key: 'speak', title: 'The English We Speak', per: '3 daq', note: { uz: 'Bitta ibora, so\'zlashuv tili — Speaking uchun.', en: 'One expression, spoken English — for Speaking.' } }
  ];
  var cache = {};

  function load(series) {
    if (cache[series]) return Promise.resolve(cache[series]);
    try {
      var raw = JSON.parse(localStorage.getItem('uzla.bbc.' + series) || 'null');
      if (raw && raw.at && Date.now() - raw.at < 6 * 3600 * 1000) { cache[series] = raw.data; return Promise.resolve(raw.data); }
    } catch (e) {}
    if (!(location.protocol === 'http:' || location.protocol === 'https:')) return Promise.resolve(null);
    return fetch('/api/bbc?series=' + series).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (j && j.items) { cache[series] = j; try { localStorage.setItem('uzla.bbc.' + series, JSON.stringify({ at: Date.now(), data: j })); } catch (e) {} }
      return j && j.items ? j : null;
    }).catch(function () { return null; });
  }

  var STEPS = [
    { n: 1, t: { uz: 'Bashorat — 1 daqiqa', en: 'Predict — 1 minute' }, d: { uz: "Faqat sarlavhaga qarab 5 ta so'z yoz: nima haqida bo'ladi? Tinglashdan OLDIN.", en: 'From the title alone write 5 words you expect. BEFORE listening.' } },
    { n: 2, t: { uz: "1-tinglash — umumiy ma'no", en: 'First listen — gist' }, d: { uz: "To'xtatmasdan. 6 Minute English boshida savol beradi — javobini yoz. Asosiy fikr bir jumlada.", en: 'No pausing. 6 Minute English asks a question at the start — write the answer. Main point in one sentence.' } },
    { n: 3, t: { uz: '2-tinglash — tafsilot', en: 'Second listen — detail' }, d: { uz: "Epizodda o'rgatilgan 6 so'zni yoz, har biriga O'Z ta'rifing (o'zbekcha emas — inglizcha sinonim).", en: 'Write the 6 words taught, each with YOUR definition (English synonym, no translation).' } },
    { n: 4, t: { uz: 'Shadowing — 2 daqiqa', en: 'Shadowing — 2 minutes' }, d: { uz: "Istalgan 2 daqiqasini qo'yib, notiqdan yarim soniya orqada takrorla. Ohang va urg'u — so'zlar emas.", en: 'Play any 2 minutes and repeat half a second behind. Intonation and stress, not the words.' } },
    { n: 5, t: { uz: 'Transkript bilan tekshir', en: 'Check with the transcript' }, d: { uz: "BBC sahifasidagi transkriptni och. Noto'g'ri eshitgan 3 joyni top — NEGA (tez? bog'langan tovush? notanish so'z?).", en: 'Open the transcript on the BBC page. Find 3 things you misheard — WHY (speed? linking? unknown word?).' } },
    { n: 6, t: { uz: "Xulosa + og'zaki", en: 'Summary + spoken' }, d: { uz: "5 gapda xulosa yoz (pastga). Keyin telefonga 1 daqiqa qayta aytib ber — 6 so'zdan kamida 3 tasini ishlat.", en: 'Write a 5-sentence summary (below). Then retell it for 1 minute on your phone — use at least 3 of the 6 words.' } }
  ];

  window.PageBBC = function (series) {
    series = SERIES.some(function (s) { return s.key === series; }) ? series : '6min';
    var S = SERIES.filter(function (s) { return s.key === series; })[0];
    var done = Store.bbcDoneCount();

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('courses')) + ' · BBC Learning English</div>' +
      '<h1>' + esc(tr('bbcTitle')) + '</h1>' +
      '<p class="lede">' + esc(tr('bbcLede')) + '</p></header>';

    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.headphones + esc(tr('bbcDone')) + '</div><div class="st-v">' + done + '</div><div class="st-note">' + esc(tr('bbcDoneS')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('spkDaily')) + '</div><div class="st-v" style="font-size:26px">1<small> ' + esc(tr('bbcEpisode')) + '</small></div><div class="st-note">' + esc(tr('bbcDailyS')) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.target + esc(tr('spkGoal')) + '</div><div class="st-v" style="font-size:22px">' + esc(tr('bbcGoal')) + '</div><div class="st-note">' + esc(tr('bbcGoalS')) + '</div></div>' +
      '</div>';

    h += '<div class="callout why"><span class="co-ic">' + IC.bulb + '</span><div><h4>' + esc(tr('bbcSourceT')) + '</h4>' + esc(tr('bbcSource')) + '</div></div>';

    /* Seriya tanlovi */
    h += '<div class="seg-wrap" style="margin-bottom:14px">';
    SERIES.forEach(function (s) {
      h += '<button class="seg-opt' + (s.key === series ? ' on' : '') + '" data-go="bbc/' + s.key + '">' + esc(s.title) + ' · ' + esc(s.per) + '</button>';
    });
    h += '</div><p class="hint" style="margin-bottom:14px">' + esc(L(S.note)) + '</p>';

    /* Mashq tartibi */
    h += sectionHead(1, tr('bbcRoutine'), tr('bbcRoutineS'));
    h += '<div class="bbc-steps">';
    STEPS.forEach(function (s) {
      h += '<div class="bbc-step"><span class="n">' + s.n + '</span><div><b>' + esc(L(s.t)) + '</b><span>' + esc(L(s.d)) + '</span></div></div>';
    });
    h += '</div>';

    h += sectionHead(2, S.title, tr('bbcLoading'));
    h += '<div id="bbcList" data-series="' + esc(series) + '"><div class="bbc-loading">' + esc(tr('bbcLoading')) + '</div></div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="course">' + IC.arrowL + esc(tr('courses')) + '</button><span></span></div>';
    return h + '</div>';
  };

  function episodeCard(ep, isToday) {
    var st = Store.bbcGet(ep.id) || {};
    return '<details class="bbc-ep' + (st.done ? ' done' : '') + (isToday ? ' today' : '') + '"' + (isToday ? ' open' : '') + '>' +
      '<summary><span class="be-st">' + (st.done ? IC.check : isToday ? '●' : '') + '</span>' +
        '<span class="be-body"><b>' + esc(ep.title) + '</b><span>' + esc(ep.date) + (ep.duration ? ' · ' + esc(ep.duration) : '') + (isToday ? ' · ' + esc(tr('coursesToday')) : '') + '</span></span></summary>' +
      '<div class="be-in">' +
        (ep.desc ? '<p class="be-desc">' + esc(ep.desc) + '</p>' : '') +
        '<audio controls preload="none" src="' + esc(ep.mp3) + '"></audio>' +
        '<div class="sync-actions">' +
          (ep.link ? '<a class="btn btn-ghost btn-sm" href="' + esc(ep.link) + '" target="_blank" rel="noopener">' + IC.doc + esc(tr('bbcTranscript')) + '</a>' : '') +
          '<a class="btn btn-ghost btn-sm" href="' + esc(ep.mp3) + '" target="_blank" rel="noopener">' + IC.download + 'MP3</a>' +
        '</div>' +
        '<div class="field" style="margin-top:12px"><label>' + esc(tr('bbcNotes')) + '</label>' +
          '<textarea class="textarea" data-bbcnotes="' + esc(ep.id) + '" placeholder="' + esc(tr('bbcNotesPh')) + '">' + esc(st.notes || '') + '</textarea></div>' +
        '<div class="sync-actions"><button class="btn ' + (st.done ? 'btn-ghost' : 'btn-primary') + ' btn-sm" data-bbcdone="' + esc(ep.id) + '">' + (st.done ? esc(tr('engDayReopen')) : IC.check + esc(tr('bbcMarkDone'))) + '</button>' +
          (st.at ? '<span class="hint">' + esc(fmtDate(st.at)) + '</span>' : '') + '</div>' +
      '</div></details>';
  }

  function renderList(series, data) {
    var box = $('#bbcList');
    if (!box) return;
    if (!data) {
      box.innerHTML = '<div class="callout pitfall"><span class="co-ic">' + IC.alert + '</span><div><h4>' + esc(tr('bbcOffT')) + '</h4>' + esc(tr('bbcOff')) +
        ' <a href="https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" target="_blank" rel="noopener">bbc.co.uk/learningenglish</a></div></div>';
      return;
    }
    /* Bugungi epizod: sanasi bo'yicha eng eskisidan boshlab birinchi tugatilmagani */
    var items = data.items.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var todayEp = null;
    items.forEach(function (ep) { if (!todayEp && !(Store.bbcGet(ep.id) || {}).done) todayEp = ep; });
    var h = '';
    if (todayEp) h += episodeCard(todayEp, true);
    items.slice().reverse().forEach(function (ep) { if (ep !== todayEp) h += episodeCard(ep, false); });
    box.innerHTML = h;
    bind(box);
  }

  function bind(box) {
    $$('[data-bbcnotes]', box).forEach(function (ta) {
      var t = null;
      ta.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { Store.bbcSet(ta.dataset.bbcnotes, { notes: ta.value }); }, 500);
      });
    });
    $$('[data-bbcdone]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.bbcdone, cur = Store.bbcGet(id) || {};
        Store.bbcSet(id, { done: !cur.done });
        toast(tr(cur.done ? 'engDayReopened' : 'bbcDoneToast'), cur.done ? '' : 'ok');
        App.render();
      });
    });
  }

  window.PageBBC.mount = function () {
    var box = $('#bbcList');
    if (!box) return;
    var series = box.dataset.series;
    load(series).then(function (data) { renderList(series, data); });
  };

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div><h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }
})();
