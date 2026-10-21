/* ==========================================================================
   Global qidiruv (Ctrl+K / ⌘K)
   --------------------------------------------------------------------------
   Indeks bir marta quriladi va til almashganda qayta quriladi.
   Qidiruv oddiy: kichik harfga keltirilgan matn ichidan bo'lak izlanadi.
   30 kunlik kurs uchun bu yetarli va tashqi kutubxona talab qilmaydi —
   fuzzy qidiruv kutubxonasi bu hajmda foydadan ko'ra og'irlik qo'shardi.
   ========================================================================== */
(function () {
  'use strict';

  var index = null;
  var cursor = 0;
  var results = [];

  function build() {
    var items = [];

    /* Bo'limlar */
    [['dashboard', tr('dashboard'), IC.home], ['course', tr('courses'), IC.book],
     ['python', tr('course'), IC.code], ['english', tr('english'), IC.globe],
     ['books', tr('books'), IC.book], ['habit', tr('habit'), IC.mosque],
     ['roadmap', tr('roadmap'), IC.map], ['plan', tr('plan'), IC.checklist],
     ['career', tr('career'), IC.star], ['cheatsheet', tr('cheatsheet'), IC.grid],
     ['notes', tr('notes'), IC.notebook], ['mistakes', tr('mistakes'), IC.alert],
     ['settings', tr('settings'), IC.settings],
     ['goal', tr('goal'), IC.target], ['profile', tr('profile'), IC.user],
     ['today', tr('todayPage'), IC.today], ['review', tr('reviewPage'), IC.refresh], ['practice', tr('practiceCenter'), IC.target],
     ['projects', tr('projectsPage'), IC.star], ['analytics', tr('analyticsPage'), IC.trend], ['weekly', tr('anWeekly'), IC.calendar], ['monthly', tr('anMonthly'), IC.calendar],
     ['saved', tr('savedPage'), IC.bookmark], ['comm', tr('commHub'), IC.mic], ['comm/assignments', tr('commAssign'), IC.checklist], ['comm/feedback', tr('commFb'), IC.star], ['comm/notifications', tr('notifT'), IC.alert], ['copy/free', tr('copyFree'), IC.notebook], ['books/ess4', ENG_BOOK.sources[0].title, IC.book],
     ['speaking', tr('habSpeakTrack'), IC.mic], ['writing', tr('coursesWriting'), IC.doc],
     ['bbc/6min', 'BBC 6 Minute English', IC.headphones], ['bbc/tews', 'BBC The English We Speak', IC.headphones],
     ['books/ebook', tr('booksTrack_ebook'), IC.book], ['books/religious', tr('booksTrack_religious'), IC.book],
     ['books/history', tr('booksTrack_history'), IC.book], ['books/listen', tr('engSkillListening'), IC.headphones],
     ['books/vocab', tr('engSkillVocab'), IC.book], ['copy/vocab', tr('copyVocab'), IC.mic], ['copy/english', tr('copyEnglish'), IC.pen], ['copy/coding', tr('copyCoding'), IC.code], ['eng-grammar', tr('engGrammarSheet'), IC.brain], ['eng-vocab', tr('engVocabSheet'), IC.book]
    ].forEach(function (p) {
      items.push({ group: 'palPages', route: p[0], title: p[1], sub: '', icon: p[2], hay: p[1].toLowerCase() });
    });

    /* Topshiriqlar va feedback (o'quvchiga ko'rinadigan, server bo'lsa) — xodim shaxsiy eslatmalari hech qachon indekslanmaydi */
    if (window.Ctrl && Ctrl.feed && Ctrl.feed()) {
      Ctrl.assignments().forEach(function (a) { items.push({ group: 'palPages', route: a.route || 'comm/assignments', title: a.title, sub: tr('commAssign') + ' · ' + tr('role_' + a.by) + ' · ' + tr('asSt_' + a.st), icon: IC.checklist, hay: (a.title + ' ' + (a.desc || '')).toLowerCase() }); });
      Ctrl.feedback().forEach(function (f) { var a = f.activity || {}; items.push({ group: 'palNotes', route: 'comm/feedback', title: a.title || tr('commFb'), sub: tr('commFb') + ' · ' + tr('role_' + f.role), icon: IC.star, hay: ((a.title || '') + ' ' + (f.text || '') + ' ' + JSON.stringify(f.fb || {})).toLowerCase() }); });
    }
    /* Erkin daftarlar */
    Store.copyList('free').forEach(function (e) { items.push({ group: 'palNotes', route: 'copy/free/' + e.id, title: e.title || tr('copyFreeUntitled'), sub: tr('copyFree'), icon: IC.notebook, hay: ((e.title || '') + ' ' + (e.text || '').slice(0, 2000)).toLowerCase() }); });

    /* Darslar */
    COURSE.forEach(function (d) {
      var title = L(d.title);
      items.push({
        group: 'palLessons', route: 'lesson/' + d.day,
        title: title, sub: d.unit + ' · ' + tr('day') + ' ' + d.day,
        badge: String(d.day),
        hay: (title + ' ' + d.unit + ' ' + L(d.intro)).toLowerCase()
      });

      /* Bo'limlar va kod misollari */
      var all = (d.sections || []).concat((window.DEEP && DEEP[d.day] && DEEP[d.day].extraSections) || []);
      all.forEach(function (s) {
        items.push({
          group: 'palCode', route: 'lesson/' + d.day,
          title: L(s.h), sub: tr('day') + ' ' + d.day + ' · ' + title,
          badge: String(d.day), icon: IC.code,
          hay: (L(s.h) + ' ' + L(s.p) + ' ' + (s.code || '')).toLowerCase()
        });
      });

      /* Konspekt qatorlari — sintaksisni tez topish uchun */
      (L(d.konspekt) || []).forEach(function (k) {
        items.push({
          group: 'palCode', route: 'lesson/' + d.day,
          title: k, sub: tr('day') + ' ' + d.day, badge: String(d.day), icon: IC.spark,
          hay: String(k).toLowerCase()
        });
      });
    });

    /* Ingliz tili kunlari — sarlavha, kirish, bo'limlar va vazifalar bo'yicha */
    if (window.ENG_DAYS) {
      (window.ENG_INTRO || []).concat(ENG_DAYS).forEach(function (day) {
        var title = L(day.title);
        var body = [L(day.intro)];
        (day.sections || []).forEach(function (s) {
          body.push(L(s.h), L(s.p));
          (s.ex || []).forEach(function (e) { body.push(e); });
        });
        (day.practice || []).forEach(function (t) { body.push(L(t)); });
        (L(day.konspekt) || []).forEach(function (k) { body.push(k); });
        items.push({
          group: 'palEnglish', route: 'english/' + day.d,
          title: title,
          sub: (day.isIntro ? tr('engIntroN', { n: day.i }) + ' · ' + tr('engIntroBlock') : tr('day') + ' ' + day.d + ' · ' + tr('engWeek') + ' ' + day.w),
          badge: day.isIntro ? 'i' + day.i : String(day.d),
          hay: (title + ' ' + body.join(' ')).toLowerCase()
        });
      });
    }

    /* Grammatik mavzular — cheatsheet sahifasidagi lang'ariga olib boradi */
    if (window.ENG_GRAMMAR) {
      Object.keys(ENG_GRAMMAR).forEach(function (k) {
        var g = ENG_GRAMMAR[k];
        var body = [L(g.short), L(g.rule)];
        (g.examples || []).forEach(function (e) { body.push(e); });
        (g.mistakes || []).forEach(function (m) { body.push(m.bad, m.good); });
        items.push({
          group: 'palGrammar', route: 'eng-grammar', icon: IC.brain,
          title: L(g.name), sub: L(g.short),
          hay: (L(g.name) + ' ' + k + ' ' + body.join(' ')).toLowerCase()
        });
      });
    }

    /* Lug'at to'plamlari va ulardagi so'zlar */
    if (window.ENG_VOCAB) {
      Object.keys(ENG_VOCAB).forEach(function (k) {
        var v = ENG_VOCAB[k];
        var words = v.words.map(function (w) { return w.w + ' ' + w.uz + ' ' + w.col.join(' '); });
        items.push({
          group: 'palVocab', route: 'eng-vocab', icon: IC.book,
          title: L(v.name), sub: v.words.length + ' ' + tr('engWords'),
          hay: (L(v.name) + ' ' + words.join(' ')).toLowerCase()
        });
      });
    }

    /* Loyihalar */
    if (window.PROJECTS) {
      PROJECTS.list.forEach(function (p) {
        items.push({ group: 'palPages', route: 'projects', title: L(p.title), sub: tr('projectsPage') + ' · L' + p.level, icon: IC.rocket, hay: (L(p.title) + ' ' + L(p.goal) + ' ' + p.skills.join(' ')).toLowerCase() });
      });
    }
    /* Daftar so'zlari va yozuvlari */
    Store.copyList('vocab').forEach(function (e) {
      if (!e.word) return;
      items.push({ group: 'palVocab', route: 'copy/vocab', title: e.word, sub: [e.tr, e.syn].filter(Boolean).join(' · '), icon: IC.mic, hay: (e.word + ' ' + (e.tr || '') + ' ' + (e.syn || '') + ' ' + (e.ex || '')).toLowerCase() });
    });
    ['english', 'coding'].forEach(function (k) {
      Store.copyList(k).forEach(function (e) {
        if (!e.title) return;
        items.push({ group: 'palNotes', route: 'copy/' + k, title: e.title, sub: k === 'english' ? tr('copyEnglish') : tr('copyCoding'), icon: IC.notebook, hay: (e.title + ' ' + (e.text || '') + ' ' + (e.code || '')).toLowerCase() });
      });
    });
    /* Xatolar */
    Store.openMistakes().forEach(function (m) {
      items.push({ group: 'palNotes', route: m.route || (m.day ? 'lesson/' + m.day : 'mistakes'), title: clip(m.q || '', 70), sub: tr('mistakes') + ' · ' + tr('misCat_' + (m.cat || 'python')), icon: IC.alert, hay: ((m.q || '') + ' ' + (m.correct || '')).toLowerCase() });
    });

    /* Shaxsiy eslatmalar */
    Store.notesList().forEach(function (n) {
      var d = dayOf(n.day);
      items.push({
        group: 'palNotes', route: 'lesson/' + n.day,
        title: clip(n.text, 70), sub: tr('day') + ' ' + n.day + ' · ' + (d ? L(d.title) : ''),
        icon: IC.pen, hay: n.text.toLowerCase()
      });
    });

    index = items;
  }

  /* Topilgan bo'lakni <mark> bilan ajratish */
  function mark(text, q) {
    var s = esc(text);
    if (!q) return s;
    var i = s.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return s;
    return s.slice(0, i) + '<mark>' + s.slice(i, i + q.length) + '</mark>' + s.slice(i + q.length);
  }

  function search(q) {
    if (!index) build();
    q = q.trim().toLowerCase();
    if (!q) {
      // Bo'sh so'rovda — bo'limlar va keyingi dars
      return index.filter(function (it) { return it.group === 'palPages'; }).slice(0, 9);
    }
    var scored = [];
    index.forEach(function (it) {
      var pos = it.hay.indexOf(q);
      if (pos < 0) return;
      // Sarlavhada topilgani mazmun ichidagidan muhimroq
      var titleHit = it.title.toLowerCase().indexOf(q);
      var score = (titleHit === 0 ? 0 : titleHit > 0 ? 20 : 100) + pos * 0.02;
      scored.push({ it: it, score: score });
    });
    scored.sort(function (a, b) { return a.score - b.score; });
    return groupInOrder(scored.slice(0, 30).map(function (s) { return s.it; }));
  }

  /* Natijalar ball bo'yicha saralanadi, lekin ekranda guruhlab ko'rsatiladi.
     Saralashdan keyin darhol chizsak "Darslar / Kod / Darslar / Kod" bo'lib
     sarlavha takrorlanardi. Shuning uchun guruhlarni birinchi uchrash
     tartibida (ya'ni eng yaxshi natijasi bo'yicha) yig'ib chiqamiz —
     guruhlar tartibi ham, guruh ichidagi tartib ham ballga bog'liq qoladi. */
  function groupInOrder(list) {
    var order = [], buckets = {};
    list.forEach(function (it) {
      if (!buckets[it.group]) { buckets[it.group] = []; order.push(it.group); }
      buckets[it.group].push(it);
    });
    var out = [];
    order.forEach(function (g) { out = out.concat(buckets[g]); });
    return out;
  }

  function render(q) {
    results = search(q);
    cursor = 0;
    var host = $('#palResults');
    if (!results.length) {
      host.innerHTML = '<div style="padding:34px 16px;text-align:center;color:var(--muted);font-size:14px">' +
        esc(tr('palEmpty')) + '</div>';
      return;
    }
    var html = '', lastGroup = '';
    results.forEach(function (it, i) {
      if (it.group !== lastGroup) { html += '<div class="palette-group">' + esc(tr(it.group)) + '</div>'; lastGroup = it.group; }
      html += '<button class="palette-item' + (i === 0 ? ' cursor' : '') + '" data-idx="' + i + '">' +
        '<span class="pi-badge">' + (it.badge || it.icon || IC.doc) + '</span>' +
        '<span><span class="pi-t" style="display:block">' + mark(it.title, q) + '</span>' +
        (it.sub ? '<span class="pi-s" style="display:block">' + esc(it.sub) + '</span>' : '') + '</span></button>';
    });
    host.innerHTML = html;
  }

  function moveCursor(delta) {
    var items = $$('.palette-item');
    if (!items.length) return;
    items[cursor] && items[cursor].classList.remove('cursor');
    cursor = (cursor + delta + items.length) % items.length;
    items[cursor].classList.add('cursor');
    items[cursor].scrollIntoView({ block: 'nearest' });
  }

  function choose(i) {
    var it = results[i];
    if (!it) return;
    Search.close();
    App.go(it.route);
  }

  window.Search = {
    invalidate: function () { index = null; },

    open: function () {
      build();
      var ov = $('#paletteOverlay');
      ov.classList.add('show');
      var input = $('#paletteInput');
      input.value = '';
      input.placeholder = tr('palettePh');
      render('');
      input.focus();
    },

    close: function () { $('#paletteOverlay').classList.remove('show'); },

    isOpen: function () { return $('#paletteOverlay').classList.contains('show'); },

    init: function () {
      var ov = $('#paletteOverlay');
      var input = $('#paletteInput');

      input.addEventListener('input', function () { render(input.value); });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); choose(cursor); }
        else if (e.key === 'Escape') { Search.close(); }
      });

      $('#palResults').addEventListener('click', function (e) {
        var item = e.target.closest ? e.target.closest('.palette-item') : null;
        if (item) choose(Number(item.dataset.idx));
      });

      // Panel tashqarisiga bosilsa — yopiladi
      ov.addEventListener('click', function (e) { if (e.target === ov) Search.close(); });
    }
  };
})();
