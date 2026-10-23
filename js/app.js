/* ==========================================================================
   App — router, qobiq (topbar/sidebar) va global hodisalar
   --------------------------------------------------------------------------
   Marshrutlar hash orqali: #/dashboard, #/lesson/7, #/notes …
   Nega hash? Server sozlamasi talab qilmaydi va file:// dan ochilganda ham
   ishlaydi — ya'ni faylni ikki marta bosib ochish yetarli.

   Hodisalar bitta joyda (delegatsiya): sahifa qayta chizilganda tinglovchilar
   "yo'qolib" ketmaydi va xotira sizib chiqmaydi.
   ========================================================================== */
(function () {
  'use strict';

  var currentRoute = '';
  var goChord = 0;           // "g" bosilgan vaqt — ikki tugmali tez o'tish uchun

  /* --- Marshrutlar jadvali ------------------------------------------- */
  var ROUTES = {
    dashboard:  { render: function () { return PageDashboard(); },  nav: 'dashboard', mount: function () { if (window.Focus) Focus.mount(); } },
    habit:      { render: function () { return PageHabit(); },      nav: 'habit', mount: function () { PageHabit.mount(); } },
    course:     { render: function () { return PageCourses(); },    nav: 'course' },   // kurslar markazi: Coding | English
    python:     { render: function () { return PageCourse(); },     nav: 'course' },   // Python kursining o'zi
    english:    { render: function () { return PageEnglish(); },    nav: 'course' },
    speaking:   { render: function () { return PageSpeaking(); },   nav: 'course', mount: function () { PageSpeaking.mount(); } },   // 30 kunlik fluency treki
    writing:    { render: function () { return PageWriting(); },    nav: 'course', mount: function () { PageWriting.mount(); } },
    books:      { render: function () { return PageBooks(); },      nav: 'books', mount: function () { PageBooks.mount(); } },
    datacamp:   { render: function () { return PageDataCamp(); },   nav: 'datacamp' },
    quick:      { render: function () { return PageQuick(); },      nav: 'course', mount: function () { PageQuick.mount(); } },
    jobready:   { render: function () { return PageJobReady(); },  nav: 'course' },   // Job Ready dasturi (kurslar ichida)
    career:     { render: function () { return PageCareer(); },     nav: 'career', mount: function () { if (PageCareer.mount) PageCareer.mount(); } },
    settings:   { render: function () { return PageSettings(); },   nav: 'settings', mount: function () { PageSettings.mount(); } },
    profile:    { render: function () { return PageProfile(); },    nav: 'profile',  mount: function () { PageProfile.mount(); } },
    today:      { render: function () { return PageToday(); },      nav: 'today',    mount: function () { PageToday.mount(); } },
    dua:        { render: function () { return PageDua('morning'); }, nav: 'dua',    mount: function () { PageDua.mount(); } },
    week:       { render: function () { return PageWeek(); },       nav: 'week',   mount: function () { PageWeek.mount(); } },
    practice:   { render: function () { return PagePractice(); },   nav: 'practice', mount: function () { PagePractice.mount(); } },
    projects:   { render: function () { return PageProjects(); },   nav: 'projects', mount: function () { PageProjects.mount(); } },
    analytics:  { render: function () { return PageAnalytics('all'); },     nav: 'analytics' },
    weekly:     { render: function () { return PageAnalytics('weekly'); },  mount: function () { PageAnalytics.mount(); }, nav: 'analytics' },
    monthly:    { render: function () { return PageAnalytics('monthly'); }, mount: function () { PageAnalytics.mount(); }, nav: 'analytics' },
    movies:     { render: function () { return PageMovies(); },     nav: 'movies',   mount: function () { PageMovies.mount(); } },
  };

  function parseRoute() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (!h) return { name: 'dashboard' };
    var parts = h.split('/');
    if (parts[0] === 'lesson') return { name: 'lesson', day: Number(parts[1]) || 1 };
    // #/english — kurs sahifasi, #/english/12 — 12-kun
    if (parts[0] === 'english' && parts[1]) return { name: 'englishDay', day: /^i\d+$/.test(parts[1]) ? parts[1] : (Number(parts[1]) || 1) };
    // #/habit — bugun, #/habit/2026-09-10 — aniq sana
    if (parts[0] === 'habit' && parts[1]) return { name: 'habitDay', date: parts[1] };
    // #/writing/7 — Writing kursining haftasi
    if (parts[0] === 'writing' && parts[1]) return { name: 'writingWeek', n: Number(parts[1]) || 1 };
    // #/bbc/6min — BBC tinglash kursi (seriya)
    if (parts[0] === 'bbc') return { name: 'bbc', series: parts[1] || '6min' };
    // #/dua/study — duolar to'plami (morning | study | evening | sleep | home)
    if (parts[0] === 'dua' && parts[1]) return { name: 'duaSet', set: parts[1] };
    // #/week/2026-09-21 — aniq hafta
    if (parts[0] === 'week' && parts[1]) return { name: 'weekOf', from: parts[1] };
    // #/copy/vocab — daftarlar (vocab | english | coding)
    // #/copy/free — erkin daftar ro'yxati · #/copy/free/<id> — muharrir
    if (parts[0] === 'copy' && parts[1] === 'free') return parts[2] ? { name: 'freeNote', id: parts[2] } : { name: 'copyFree' };
    if (parts[0] === 'copy') return { name: 'copybook', kind: parts[1] || 'vocab' };
    // #/datacamp/3 — DataCamp trekining bobi
    if (parts[0] === 'datacamp' && parts[1]) return { name: 'dcChapter', n: Number(parts[1]) || 1 };
    // #/quick/3 — Quick Repeat kursining kuni · #/quick/test — yakuniy test
    if (parts[0] === 'quick' && parts[1]) return parts[1] === 'test' ? { name: 'quickTest' } : { name: 'quickDay', n: Number(parts[1]) || 1 };
    // #/practice/coding — mashq markazi, manba oldindan tanlangan (yakshanba katta testi)
    if (parts[0] === 'practice' && parts[1]) return { name: 'practiceSrc', src: parts[1] };
    // #/movies/<id> — kino pleyeri
    if (parts[0] === 'movies' && parts[1]) return { name: 'movie', id: parts[1] };
    // #/eng-skill/speaking — bitta ko'nikmaning 144 kunlik rejasi
    if (parts[0] === 'eng-skill' && parts[1]) return { name: 'engSkill', key: parts[1] };
    // #/books/v12 — lug'at uniti · r3 — o'qish (ebook) · l2 — tinglash
    // #/books/reading — uch yo'nalishli o'qish markazi
    // #/books/d3 — diniy o'qish · t3 — tarixiy o'qish
    if (parts[0] === 'books' && parts[1]) {
      if (parts[1] === 'reading' || parts[1] === 'ebook') return { name: 'bookTrack', track: 'ebook' };
      if (parts[1] === 'religious' || parts[1] === 'history') return { name: 'bookTrack', track: parts[1] };
      if (parts[1] === 'listen') return { name: 'bookListen' };
      // #/books/vocab — Destination B2 markazi (2026-09-20 dan asosiy lug'at) · #/books/ess4 — Essential 4 (ixtiyoriy)
      if (parts[1] === 'vocab' || parts[1] === 'dest' && !parts[2]) return { name: 'bookDest' };
      if (parts[1] === 'ess4') return { name: 'bookVocabList' };
      // #/books/dest/4/phrasal — Destination B2 uniti va bo'limi
      if (parts[1] === 'dest') return { name: 'bookDestUnit', num: Number(parts[2]) || 2, sec: parts[3] || 'topic' };
      // #/books/dict/3/7 — diktant mashqi (3-test, 7-mashq)
      if (parts[1] === 'dict') return { name: 'bookDict', t: Number(parts[2]) || 1, e: Number(parts[3]) || 1 };
      var kind = parts[1].charAt(0), num = Number(parts[1].slice(1)) || 1;
      if (kind === 'v') return { name: 'bookVocab', num: num };
      if (kind === 'r') return { name: 'bookReading', num: num, track: 'ebook' };
      if (kind === 'd') return { name: 'bookReading', num: num, track: 'religious' };
      if (kind === 't') return { name: 'bookReading', num: num, track: 'history' };
      if (kind === 'l') return { name: 'bookListening', num: num };
      return { name: 'books' };
    }
    // #/cheatsheet — Python · #/cheatsheet/grammar · #/cheatsheet/vocab (bitta bo'lim, tepada tablar)
    if (parts[0] === 'cheatsheet') return { name: 'cheatsheet', tab: /^(grammar|vocab)$/.test(parts[1] || '') ? parts[1] : 'python' };
    if (parts[0] === 'eng-grammar') return { name: 'cheatsheet', tab: 'grammar' };   // eski manzil
    if (parts[0] === 'eng-vocab') return { name: 'cheatsheet', tab: 'vocab' };       // eski manzil
    // #/flash — kartalar · #/flash/etch — toshbitik (qat'iy rejim); #/etch — eski manzil
    if (parts[0] === 'flash') return { name: 'flash', tab: parts[1] === 'etch' ? 'etch' : 'cards' };
    if (parts[0] === 'etch') return { name: 'flash', tab: 'etch' };
    // #/review — SRS navbati · #/review/mistakes — xatolar daftari (eski #/mistakes)
    if (parts[0] === 'review') return { name: 'review', tab: parts[1] === 'mistakes' ? 'mistakes' : 'srs' };
    if (parts[0] === 'mistakes') return { name: 'review', tab: 'mistakes' };
    // #/notes — eslatmalar · #/notes/saved — saqlanganlar (eski #/saved)
    if (parts[0] === 'notes') return { name: 'notes', tab: parts[1] === 'saved' ? 'saved' : parts[1] === 'free' ? 'free' : 'notes' };
    if (parts[0] === 'saved') return { name: 'notes', tab: 'saved' };
    // #/roadmap — yo'l xaritasi · #/roadmap/goal — maqsad · #/roadmap/plan — DataCamp rejasi (eski #/goal, #/plan)
    if (parts[0] === 'roadmap') return { name: 'roadmap', tab: /^(goal|plan)$/.test(parts[1] || '') ? parts[1] : 'map' };
    if (parts[0] === 'goal') return { name: 'roadmap', tab: 'goal' };
    if (parts[0] === 'plan') return { name: 'roadmap', tab: 'plan' };
    // #/comm — aloqa markazi: messages/<rol> · assignments · feedback · sessions · notifications
    // Eski: #/chat → messages/controller · #/assignments → assignments
    if (parts[0] === 'comm') { var ct = /^(messages|assignments|feedback|sessions|notifications)$/.test(parts[1] || '') ? parts[1] : 'messages'; return { name: 'comm', tab: ct, sub: parts[2] || '' }; }
    if (parts[0] === 'chat') return { name: 'comm', tab: 'messages', sub: parts[1] || 'controller' };
    if (parts[0] === 'assignments') return { name: 'comm', tab: 'assignments', sub: '' };
    if (parts[0] === 'notifications') return { name: 'comm', tab: 'notifications', sub: '' };
    // #/mission/... — IELTS Mission (yo'l va so'rov qatori o'zi tahlil qiladi) · #/pyai/... — Python & AI yo'li
    if (parts[0] === 'mission') return { name: 'mission', path: h.slice(8) };
    if (parts[0] === 'pyai') return { name: 'pyai', path: h.slice(5) };
    if (ROUTES[parts[0]]) return { name: parts[0] };
    return { name: 'dashboard' };
  }

  window.App = {
    /* --- ketma-ket rejim ---------------------------------------------
       Sozlama o'chiq bo'lsa hamma dars ochiq. Yoqilgan bo'lsa: 1-kun
       doim ochiq, qolgani oldingi kun tugatilgan bo'lsa ochiladi.     */
    isDayOpen: function (day) {
      if (!Store.setting('gate')) return true;
      if (day <= 1) return true;
      return Store.isDone(day - 1);
    },
    firstOpenDay: function () {
      for (var i = 0; i < COURSE.length; i++) {
        if (!Store.isDone(COURSE[i].day)) return COURSE[i].day;
      }
      return COURSE[COURSE.length - 1].day;
    },

    /* Bir xil marshrutga bosilganda hash o'zgarmaydi va hashchange otilmaydi —
       shuning uchun sahifani o'zimiz qayta chizamiz. Aks holda darsdagi
       "Qayta urinish" tugmasi hech narsa qilmasdi.                        */
    go: function (route) {
      var target = '#/' + route;
      if (location.hash === target) App.render();
      else location.hash = target;
    },

    /* Mavzular — "UzLeeder Official Design" (v2026.09) rang shablonlari.
       Bold Red — rasmiy identitet va standart; qolganlari qo'llanmadagi
       shablonlar. id, qorong'imi, ko'rsatkich ranglari (fon, aksent).      */
    THEMES: [
      { id: 'dark',    dark: true,  sw: ['#07090d', '#f0384e'] },   /* Bold Red · rasmiy */
      { id: 'light',   dark: false, sw: ['#f6f7f9', '#e01e37'] },   /* Bold Red · qog'oz */
      { id: 'navy',    dark: true,  sw: ['#0b1f3a', '#c9a227'] },
      { id: 'emerald', dark: true,  sw: ['#0f2a24', '#10b981'] },
      { id: 'ocean',   dark: true,  sw: ['#0f1d33', '#3b82f6'] },
      { id: 'royal',   dark: true,  sw: ['#1e1b3a', '#8b5cf6'] },
      { id: 'sunset',  dark: true,  sw: ['#2a1a10', '#f97316'] },
      { id: 'mono',    dark: true,  sw: ['#10141f', '#f2f4f8'] }
    ],
    /* Eski mavzu nomlari (rebrenddan oldingi) → yangilari. Saqlangan sozlama
       yo'qolmasin: forest→emerald, plum→royal, sand→sunset.                */
    THEME_ALIAS: { forest: 'emerald', plum: 'royal', sand: 'sunset' },
    themeOf: function (id) {
      id = App.THEME_ALIAS[id] || id;
      for (var i = 0; i < App.THEMES.length; i++) if (App.THEMES[i].id === id) return App.THEMES[i];
      return App.THEMES[0];
    },

    applyTheme: function () {
      var saved = Store.get('theme'), t = App.themeOf(saved);
      if (saved !== t.id) Store.set('theme', t.id);   /* eski nomni bir marta ko'chiramiz */
      document.documentElement.setAttribute('data-theme', t.id);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', t.sw[0]);
      var btn = $('#themeBtn');
      if (btn) btn.innerHTML = t.dark ? IC.sun : IC.moon;
      /* Favicon — brend qo'llanmasidagi "app icon": yumaloq INK plita,
         belgisi mavzu aksentida. Akademiya belgisi (o'sish chizig'i) o'zgarmaydi. */
      var icon = document.querySelector('link[rel="icon"]');
      if (icon) {
        icon.href = 'data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5.5" fill="#1c2233"/>' +
          '<path d="M4 18 L9 8 L13 14 L20 5" stroke="' + t.sw[1] + '" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="20" cy="5" r="2.2" fill="' + t.sw[1] + '"/></svg>');
      }
      var pop = $('#themePop');
      if (pop && !pop.hidden) App.renderThemePop();
    },
    /* Tepadagi tugma: mavzu to'ri (sozlamalardagi bilan bir xil kartalar) */
    renderThemePop: function () {
      var pop = $('#themePop');
      if (!pop) return;
      pop.innerHTML = '<div class="tp-head"><b>' + esc(tr('setTheme')) + '</b><span>' + esc(tr('setThemeD')) + '</span></div>' +
        '<div class="theme-grid">' + App.THEMES.map(function (t) {
          return '<button class="theme-sw' + (Store.get('theme') === t.id ? ' on' : '') + '" data-theme-set="' + t.id + '" style="--sw-bg:' + t.sw[0] + ';--sw-ac:' + t.sw[1] + '">' +
            '<span class="ts-chip"><i></i><i></i><i></i></span><span class="ts-n">' + esc(tr('theme_' + t.id)) + '</span></button>';
        }).join('') + '</div>';
    },
    toggleThemePop: function (open) {
      var pop = $('#themePop'), btn = $('#themeBtn');
      if (!pop) return;
      var o = open === undefined ? pop.hidden : open;
      if (o) App.renderThemePop();
      pop.hidden = !o;
      if (btn) { btn.classList.toggle('on', o); btn.setAttribute('aria-expanded', o); }
    },
    /* Progressni o'chirish — kuchli tasdiq: avval zaxira taklifi, keyin "OCHIR" so'zini yozish.
       Bulutdagi nusxa ham keyingi sinxronda bo'shaydi — shuning uchun tasodifan bosib bo'lmasin. */
    resetProgress: function () {
      if (!confirm(tr('resetConfirm'))) return;
      var typed = prompt(tr('resetType', { w: 'OCHIR' }));
      if (typed === null) return;
      if (typed.trim().toUpperCase() !== 'OCHIR') { toast(tr('resetCancel'), 'warn'); return; }
      Store.resetAll(); toast(tr('resetDone'), 'ok'); App.render();
    },
    /* "?" — klaviatura qisqartmalari oynasi (bir marta yaratiladi) */
    kbdHelp: function (open) {
      var ov = $('#kbdOverlay');
      if (!ov) {
        ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'kbdOverlay';
        document.body.appendChild(ov);
        ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-kbdx]')) App.kbdHelp(false); });
      }
      var o = open === undefined ? !ov.classList.contains('show') : open;
      if (o) {
        var rows = [
          ['Ctrl K', '/', tr('kbSearch')], ['[', '', tr('kbSidebar')], ['J / K', '← / →', tr('kbLesson')],
          ['g d', 'g t', tr('kbGoDT')], ['g r', 'g p', tr('kbGoRP')], ['g m', 'g s', tr('kbGoMS')],
          ['g c', 'g e', tr('kbGoCE')], ['g b', 'g a', tr('kbGoBA')],
          ['Space', '1 2 3', tr('kbReview')], ['Ctrl ↵', '', tr('kbRun')], ['Esc', '?', tr('kbEsc')]
        ];
        ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(tr('kbTitle')) + '">' +
          '<div class="modal-head"><h3>' + esc(tr('kbTitle')) + '</h3><button class="icon-btn" data-kbdx aria-label="Close">' + IC.close + '</button></div>' +
          '<div class="kbd-list">' + rows.map(function (r) {
            return '<div class="kbd-row"><span>' + '<span class="kbd">' + esc(r[0]) + '</span>' + (r[1] ? ' <span class="kbd">' + esc(r[1]) + '</span>' : '') + '</span><span>' + esc(r[2]) + '</span></div>';
          }).join('') + '</div></div>';
      }
      ov.classList.toggle('show', o);
      if (o) { var x = ov.querySelector('[data-kbdx]'); if (x) x.focus(); }
    },
    /* Tepadagi tugma: qorong'i ↔ yorug' (oxirgi tanlangan variantni eslaydi) */
    toggleTheme: function () {
      var t = App.themeOf(Store.get('theme'));
      var last = Store.setting('themeLast') || {};
      last[t.dark ? 'dark' : 'light'] = t.id;
      var next = last[t.dark ? 'light' : 'dark'] || (t.dark ? 'light' : 'dark');
      Store.setSetting('themeLast', last);
      Store.set('theme', next);
      App.applyTheme();
    },

    setLang: function (lang) {
      Store.set('lang', lang);
      document.documentElement.lang = lang;
      Search.invalidate();
      App.render();
    },

    /* Topbar + sidebar'ni qayta chizish (sahifa mazmuniga tegmasdan) */
    refreshChrome: function () {
      renderProfileBtn();
      renderProgress();
      renderNav();
    },

    render: function () {
      var r = parseRoute();
      var prevRoute = currentRoute;
      currentRoute = r.name === 'lesson' ? 'lesson/' + r.day
        : r.name === 'englishDay' ? 'english/' + r.day
        : r.name === 'habitDay' ? 'habit/' + r.date
        : r.name === 'engSkill' ? 'eng-skill/' + r.key
        : r.name === 'bookVocab' ? 'books/v' + r.num
        : r.name === 'bookTrack' ? 'books/' + r.track
        : r.name === 'bookListen' ? 'books/listen'
        : r.name === 'bookVocabList' ? 'books/ess4'
        : r.name === 'bookDest' ? 'books/vocab'
        : r.name === 'bookDestUnit' ? 'books/dest/' + r.num + '/' + r.sec
        : r.name === 'bookDict' ? 'books/dict/' + r.t + '/' + r.e
        : r.name === 'copyFree' ? 'copy/free'
        : r.name === 'freeNote' ? 'copy/free/' + r.id
        : r.name === 'speaking' ? 'speaking'
        : r.name === 'bbc' ? 'bbc/' + r.series
        : r.name === 'duaSet' ? 'dua/' + r.set
        : r.name === 'weekOf' ? 'week/' + r.from
        : r.name === 'copybook' ? 'copy/' + r.kind
        : r.name === 'writingWeek' ? 'writing/' + r.n
        : r.name === 'dcChapter' ? 'datacamp/' + r.n
        : r.name === 'quickDay' ? 'quick/' + r.n
        : r.name === 'quickTest' ? 'quick/test'
        : r.name === 'practiceSrc' ? 'practice/' + r.src
        : r.name === 'cheatsheet' ? (r.tab === 'python' ? 'cheatsheet' : 'cheatsheet/' + r.tab)
        : r.name === 'flash' ? (r.tab === 'cards' ? 'flash' : 'flash/etch')
        : r.name === 'comm' ? 'comm/' + r.tab + (r.sub ? '/' + r.sub : '')
        : r.name === 'review' ? (r.tab === 'srs' ? 'review' : 'review/mistakes')
        : r.name === 'notes' ? (r.tab === 'notes' ? 'notes' : 'notes/' + r.tab)
        : r.name === 'roadmap' ? (r.tab === 'map' ? 'roadmap' : 'roadmap/' + r.tab)
        : r.name === 'bookReading' ? 'books/' + (r.track === 'religious' ? 'd' : r.track === 'history' ? 't' : 'r') + r.num
        : r.name === 'bookListening' ? 'books/l' + r.num
        : r.name === 'mission' ? 'mission' + (r.path ? '/' + r.path : '')
        : r.name === 'pyai' ? 'pyai' + (r.path ? '/' + r.path : '')
        : r.name;

      var content = $('#content');
      if (r.name === 'lesson') {
        content.innerHTML = PageLesson(r.day);
        PageLesson.mount(r.day);
      } else if (r.name === 'englishDay') {
        content.innerHTML = PageEnglishDay(r.day);
        PageEnglishDay.mount(r.day);
      } else if (r.name === 'habitDay') {
        content.innerHTML = PageHabit(r.date);
        PageHabit.mount();
      } else if (r.name === 'bookVocab') {
        content.innerHTML = PageBookVocab(r.num);
        PageBookVocab.mount();
      } else if (r.name === 'bbc') {
        content.innerHTML = PageBBC(r.series);
        PageBBC.mount();
      } else if (r.name === 'duaSet') {
        content.innerHTML = PageDua(r.set);
        PageDua.mount();
      } else if (r.name === 'weekOf') {
        content.innerHTML = PageWeek(r.from);
        PageWeek.mount();
      } else if (r.name === 'copybook') {
        content.innerHTML = PageCopybook(r.kind);
        PageCopybook.mount();
      } else if (r.name === 'copyFree') {
        content.innerHTML = PageCopyFree();
        PageCopyFree.mount();
      } else if (r.name === 'freeNote') {
        content.innerHTML = PageFreeNote(r.id);
        PageFreeNote.mount();
      } else if (r.name === 'bookDest') {
        content.innerHTML = PageBookDest();
        PageBookDest.mount();
      } else if (r.name === 'bookDestUnit') {
        content.innerHTML = PageBookDestUnit(r.num, r.sec);
        PageBookDestUnit.mount(r.num, r.sec);
      } else if (r.name === 'bookDict') {
        content.innerHTML = PageBookDict(r.t, r.e);
        PageBookDict.mount();
      } else if (r.name === 'movie') {
        content.innerHTML = PageMovie(r.id);
        PageMovie.mount(r.id);
      } else if (r.name === 'writingWeek') {
        content.innerHTML = PageWriting(r.n);
        PageWriting.mount();
      } else if (r.name === 'dcChapter') {
        content.innerHTML = PageDCChapter(r.n);
        PageDCChapter.mount(r.n);
      } else if (r.name === 'quickDay') {
        content.innerHTML = PageQuickDay(r.n);
        PageQuickDay.mount(r.n);
      } else if (r.name === 'quickTest') {
        content.innerHTML = PageQuickTest();
        PageQuickTest.mount();
      } else if (r.name === 'practiceSrc') {
        content.innerHTML = PagePractice(r.src);
        PagePractice.mount(r.src);
      } else if (r.name === 'cheatsheet') {
        /* Uch cheatsheet bitta bo'limda: tepada tablar, pastda o'sha sahifa */
        var csTabs = [['cheatsheet', 'python', 'Python', IC.code], ['cheatsheet/grammar', 'grammar', tr('engGrammarSheet'), IC.brain], ['cheatsheet/vocab', 'vocab', tr('engVocabSheet'), IC.layers]];
        var csBody = r.tab === 'grammar' ? PageEngGrammar() : r.tab === 'vocab' ? PageEngVocab() : PageCheatsheet();
        content.innerHTML = hubTabs(csTabs, r.tab) + csBody;
        if (r.tab === 'grammar') PageEngGrammar.mount(); else if (r.tab === 'vocab') PageEngVocab.mount(); else PageCheatsheet.mount();
      } else if (r.name === 'comm') {
        /* Aloqa: xabarlar · topshiriqlar · feedback · sessiya · bildirishnomalar */
        var cmTabs = [['comm/messages', 'messages', tr('commMsgs'), IC.mic], ['comm/assignments', 'assignments', tr('commAssign'), IC.checklist], ['comm/feedback', 'feedback', tr('commFb'), IC.star], ['comm/sessions', 'sessions', tr('commSess'), IC.eye], ['comm/notifications', 'notifications', tr('commNotif'), IC.alert]];
        content.innerHTML = PageComm(r.tab, r.sub).replace('</header>', '</header>' + hubTabs(cmTabs, r.tab));
        PageComm.mount(r.tab, r.sub);
      } else if (r.name === 'review') {
        /* Takror: SRS navbati + xatolar daftari — bitta bo'lim */
        var rvTabs = [['review', 'srs', tr('reviewPage'), IC.refresh], ['review/mistakes', 'mistakes', tr('mistakes'), IC.alert]];
        content.innerHTML = hubTabs(rvTabs, r.tab) + (r.tab === 'mistakes' ? PageMistakes() : PageReview());
        if (r.tab !== 'mistakes') PageReview.mount();
      } else if (r.name === 'notes') {
        /* Daftar: eslatmalar + saqlanganlar */
        var ntTabs = [['notes', 'notes', tr('notes'), IC.notebook], ['notes/saved', 'saved', tr('savedPage'), IC.bookmark], ['notes/free', 'free', tr('copyFree'), IC.pen]];
        content.innerHTML = hubTabs(ntTabs, r.tab) + (r.tab === 'saved' ? PageSaved() : r.tab === 'free' ? PageCopyFree() : PageNotes());
        if (r.tab === 'saved') PageSaved.mount();
        if (r.tab === 'free') PageCopyFree.mount();
      } else if (r.name === 'roadmap') {
        /* Reja: yo'l xaritasi + maqsad doskasi + DataCamp rejasi */
        var rmTabs = [['roadmap', 'map', tr('roadmap'), IC.map], ['roadmap/goal', 'goal', tr('navGoal'), IC.flame], ['roadmap/plan', 'plan', tr('plan'), IC.checklist]];
        content.innerHTML = hubTabs(rmTabs, r.tab) + (r.tab === 'goal' ? PageGoal() : r.tab === 'plan' ? PagePlan() : PageRoadmap());
        if (r.tab === 'goal') PageGoal.mount();
      } else if (r.name === 'flash') {
        /* Kartalar: yengil (flashcards) va qat'iy (toshbitik) rejim — bitta bo'lim */
        var flTabs = [['flash', 'cards', tr('flashPage'), IC.cards], ['flash/etch', 'etch', tr('etchPage'), IC.stone]];
        content.innerHTML = hubTabs(flTabs, r.tab) + (r.tab === 'etch' ? PageEtch() : PageFlash());
        if (r.tab === 'etch') PageEtch.mount(); else PageFlash.mount();
      } else if (r.name === 'engSkill') {
        content.innerHTML = PageEngSkill(r.key);
      } else if (r.name === 'bookTrack') {
        content.innerHTML = PageBookTrack(r.track);
        PageBookTrack.mount();
      } else if (r.name === 'bookListen') {
        content.innerHTML = PageBookListen();
        PageBookListen.mount();
      } else if (r.name === 'bookVocabList') {
        content.innerHTML = PageBookVocabList();
        PageBookVocabList.mount();
      } else if (r.name === 'bookReading') {
        content.innerHTML = PageBookReading(r.num, r.track);
        PageBookReading.mount();
      } else if (r.name === 'bookListening') {
        content.innerHTML = PageBookListening(r.num);
        PageBookListening.mount();
      } else if (r.name === 'mission' && window.PageMission) {
        content.innerHTML = PageMission(r.path);
        PageMission.mount(r.path);
      } else if (r.name === 'pyai' && window.PagePyAI) {
        content.innerHTML = PagePyAI(r.path);
        PagePyAI.mount(r.path);
      } else {
        var route = ROUTES[r.name] || ROUTES.dashboard;
        content.innerHTML = route.render();
        if (route.mount) route.mount();
      }
      /* Coding — Python, DataCamp va Python & AI — Job Ready dasturi ichida: qaytish havolasi */
      if (/^((python|datacamp|pyai)(\/|$)|lesson\/)/.test(currentRoute) && window.PageJobReady) {
        var pg = content.querySelector('.page');
        if (pg) pg.insertAdjacentHTML('afterbegin', '<button class="link-btn jr-crumb" data-go="jobready">← Job Ready: Python & AI Engineer</button>');
      }
      /* English, Speaking, BBC, Writing, Quick Repeat — IELTS Mission ichida: qaytish havolasi */
      if (/^((english|speaking|writing|bbc|quick)(\/|$)|eng-skill\/)/.test(currentRoute) && window.PageMission) {
        var pgE = content.querySelector('.page');
        if (pgE) pgE.insertAdjacentHTML('afterbegin', '<button class="link-btn jr-crumb" data-go="mission">← IELTS Mission</button>');
      }

      App.refreshChrome();
      applyStaticText();
      document.body.classList.remove('drawer-open');

      /* "Davom etish" uchun oxirgi joy — sahifa sarlavhasi bilan */
      if (window.Continue) {
        var h1 = content.querySelector('h1');
        Continue.touch(currentRoute, h1 ? h1.textContent.trim().slice(0, 60) : currentRoute);
      }
      /* "Birinchi qadamlar" uchun: muhim sahifalar bir marta ko'rilganini belgilash */
      var seenKey = /^(roadmap|goal|habit)(\/|$)/.test(currentRoute) ? 'seen:' + currentRoute.split('/')[0]
        : /^english\/\d+/.test(currentRoute) ? 'seen:englishday' : null;
      if (seenKey && !Store.flag(seenKey)) Store.setFlag(seenKey);
      /* Nazoratchi uchun: qayerdaman (faqat Vercel'da, 10 s throttle) */
      if (window.Ctrl && currentRoute !== prevRoute) Ctrl.touch();

      /* Tepaga faqat marshrut HAQIQATAN o'zgarganda chiqamiz. Aks holda
         sozlamadagi tugmani bosgan odam har safar sahifa boshiga otilardi. */
      if (currentRoute !== prevRoute) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        /* Klaviatura/ekran o'quvchi: yangi sahifada fokus mazmunga tushadi, sarlavha yangilanadi */
        var h1f = content.querySelector('h1');
        document.title = (h1f && currentRoute !== 'dashboard' ? h1f.textContent.trim().slice(0, 60) + ' · ' : '') + 'UzLeeder Academy';
        if (!document.activeElement || document.activeElement === document.body || !content.contains(document.activeElement)) {
          try { content.focus({ preventScroll: true }); } catch (e) { content.focus(); }
        }
      }
    }
  };

  /* ====================== QOBIQ (chrome) =============================== */

  /* Tepadagi profil tugmasi: rasm yoki ismning bosh harfi + o'qilmagan xabar nuqtasi */
  function renderProfileBtn() {
    var b = $('#profileBtn'); if (!b) return;
    var prof = Store.profile ? (Store.profile() || {}) : {};
    var name = Store.get('name') || '';
    var unread = window.Ctrl && Ctrl.badge ? Ctrl.badge() : 0;
    b.innerHTML = (prof.photo ? '<img src="' + esc(prof.photo) + '" alt="">' : '<span class="pf-initial">' + esc((name || 'U').charAt(0).toUpperCase()) + '</span>') +
      (unread ? '<i class="pf-dot"></i>' : '');
    renderBell();
    b.title = name || tr('profile');
    var mChat = $('#pmChatBadge'); if (mChat) mChat.textContent = unread ? String(unread) : '';
    var mName = $('#pmName'); if (mName) mName.textContent = name || tr('profile');
    var mSub = $('#pmSub'); if (mSub) mSub.textContent = prof.title || tr('navSystem');
    ['pmProfile', 'pmChat', 'pmSettings', 'pmLogout'].forEach(function (id) { var el = $('#' + id + 'T'); if (el) el.textContent = tr(id); });
  }
  /* Bildirishnoma qo'ng'irog'i: soni + ochiladigan ro'yxat (real hodisalar) */
  function renderBell() {
    var b = $('#notifBtn'); if (!b) return;
    var n = window.Ctrl && Ctrl.notifUnread ? Ctrl.notifUnread() : 0;
    b.innerHTML = IC.alert + (n ? '<span class="nb-n">' + (n > 9 ? '9+' : n) + '</span>' : '');
    b.title = tr('notifT'); b.setAttribute('aria-label', tr('notifT') + (n ? ' · ' + n : ''));
    b.hidden = !(window.Ctrl && Ctrl.available());
    var pop = $('#notifPop'); if (!pop) return;
    var list = window.Ctrl ? Ctrl.notif().slice(0, 8) : [];
    var ic = function (t) { return { assignment: IC.checklist, feedback: IC.star, message: IC.mic, review: IC.pen, session: IC.eye, assignment_done: IC.check }[t] || IC.spark; };
    pop.innerHTML = '<div class="np-head"><b>' + esc(tr('notifT')) + '</b><button class="btn btn-quiet btn-sm" id="npAll" data-go="comm/notifications">' + esc(tr('notifAll')) + '</button></div>' +
      (list.length ? list.map(function (x) { return '<button class="nf-row' + (x.read ? '' : ' unread') + '" data-nf="' + esc(x.id) + '" data-go="' + esc(x.route || 'comm') + '">' + ic(x.type) + '<span class="nf-b"><b>' + esc(tr('notifType_' + x.type)) + '</b><span>' + esc(x.type === 'session' ? tr('chEv_' + String(x.title).replace('session:', '')) : x.title) + '</span></span></button>'; }).join('') : '<p class="hint" style="padding:10px 12px">' + esc(tr('notifNone')) + '</p>');
  }
  function toggleBell(open) {
    var m = $('#notifPop'), b = $('#notifBtn'); if (!m) return;
    var on = typeof open === 'boolean' ? open : m.hidden;
    m.hidden = !on; if (b) b.setAttribute('aria-expanded', String(on));
    if (on) toggleProfileMenu(false);
  }
  function toggleProfileMenu(open) {
    var m = $('#profileMenu'), b = $('#profileBtn'); if (!m) return;
    var on = typeof open === 'boolean' ? open : !m.classList.contains('open');
    m.classList.toggle('open', on); if (b) b.setAttribute('aria-expanded', String(on));
  }
  window.App.logout = function () {
    var done = function () { location.href = '/login'; };
    try { fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).then(done, done); } catch (e) { done(); }
  };

  /* Progress halqasi va streak */
  function renderProgress() {
    var total = COURSE.length;
    var done = Store.doneCount();
    var pct = done / total;
    var circumference = 2 * Math.PI * 15;   // r = 15

    var fill = $('#ringFill');
    if (fill) {
      fill.setAttribute('stroke-dasharray', circumference.toFixed(1));
      fill.style.strokeDashoffset = (circumference * (1 - pct)).toFixed(1);
    }
    var label = $('#ringLabel');
    if (label) label.textContent = Math.round(pct * 100) + '%';

    var streak = Store.streak();
    var pill = $('#streakPill');
    if (pill) {
      pill.className = 'streak-pill' + (streak ? '' : ' cold');
      pill.innerHTML = IC.flame + '<b>' + streak + '</b><span>' + esc(tr('days')) + '</span>';
      pill.title = streak ? tr('streakDays') : tr('streakNone');
    }
  }

  /* Chap paneldagi bo'limlar ro'yxati */
  /* Hub tablari: birlashtirilgan bo'limlar tepasidagi qator.
     tabs: [[route, key, label, icon]]; faol tab — active.                  */
  function hubTabs(tabs, active) {
    return '<div class="hub-tabs no-print">' + tabs.map(function (t) {
      return '<button class="hub-tab' + (t[1] === active ? ' on' : '') + '" data-go="' + t[0] + '"' + (t[1] === active ? ' aria-current="page"' : '') + '>' + t[3] + '<span>' + esc(t[2]) + '</span></button>';
    }).join('') + '</div>';
  }

  function renderNav() {
    var openMis = Store.openMistakes().length;
    var noteN = Store.notesList().length;

    var debt = window.Goal ? Goal.debt().days : 0;

    var due = window.Review ? Review.dueCount() : 0;
    var bm = Store.bookmarksList().length;

    /* [kalit, sarlavha, elementlar] — o'quvchi yo'li bo'yicha guruhlar:
       HOME · LEARN · PRACTICE · DEVELOPMENT · CAREER · SYSTEM               */
    /* Aloqa nishoni: o'qilmagan xabar + bildirishnoma + ochiq topshiriq (muddati o'tgan) */
    var commBadge = window.Ctrl && Ctrl.badge ? Ctrl.badge() + Ctrl.openAssignments().filter(function (a) { return a.st === 'overdue'; }).length : 0;
    var groups = [
      ['home', tr('navHome'), [
        ['dashboard', IC.home, tr('dashboard'), ''],
        ['today', IC.today, tr('todayPage'), due ? String(due) : '', due > 0],
        ['week', IC.trend, tr('wkTitle'), ''],
        ['dua', IC.mosque, tr('duaPage'), window.DuaGate && !DuaGate.isRead(Store.dateKey()) ? '!' : '', window.DuaGate && !DuaGate.isRead(Store.dateKey())],
        ['habit', IC.clock, tr('habit'), HabitPlan.streak() ? String(HabitPlan.streak()) : ''],
        ['comm', IC.mic, tr('commHub'), commBadge ? String(commBadge) : '', commBadge > 0]
      ]],
      /* Kurslar — bitta kirish nuqtasi (Python, DataCamp, English, Speaking, BBC, Writing).
         Daftar = eslatmalar + saqlanganlar (tablar).                         */
      ['learn', tr('navLearn'), [
        ['course', IC.book, tr('courses'), window.DataCamp && DataCamp.overdue().length ? String(DataCamp.overdue().length) : '', window.DataCamp && DataCamp.overdue().length > 0],
        ['books', IC.doc, tr('books'), ''],
        ['movies', IC.film, tr('moviesPage'), ''],
        ['notes', IC.notebook, tr('notebookHub'), '']
      ]],
      /* Takror = SRS + xatolar; Kartalar = flashcards + toshbitik; Cheatsheet = Python + grammatika + lug'at */
      ['practice', tr('navPractice'), [
        ['practice', IC.target, tr('practiceCenter'), ''],
        ['review', IC.refresh, tr('reviewPage'), due ? String(due) : (openMis ? String(openMis) : ''), due > 0 || openMis > 0],
        ['flash', IC.cards, tr('cardsHub'), window.Etch && Etch.dueCount() ? String(Etch.dueCount()) : '', window.Etch && Etch.dueCount() > 0],
        ['cheatsheet', IC.grid, tr('cheatsheet'), '']
      ]],
      /* Reja = yo'l xaritasi + maqsad + DataCamp rejasi (tablar) */
      ['dev', tr('navDev'), [
        ['roadmap', IC.map, tr('planHub'), debt ? String(debt) : '', debt > 0],
        ['analytics', IC.trend, tr('analyticsPage'), '']
      ]],
      ['career', tr('navCareer'), [
        ['projects', IC.rocket, tr('projectsPage'), ''],
        ['career', IC.star, tr('career'), '']
      ]]
    ];
    var collapsed = Store.setting('navCollapsed') || {};
    var html = '';
    groups.forEach(function (g) {
      var isCol = !!collapsed[g[0]];
      var anyOn = false;
      var items = '';
      g[2].forEach(function (item) {
        var on = currentRoute === item[0] ||
          (item[0] === 'course' && /^(mission(\/|$)|pyai(\/|$)|jobready|speaking|writing|bbc\/|writing\/|quick|python|lesson\/|datacamp|english|eng-skill\/)/.test(currentRoute)) ||
          (item[0] === 'cheatsheet' && /^cheatsheet\//.test(currentRoute)) ||
          (item[0] === 'review' && /^review\//.test(currentRoute)) ||
          (item[0] === 'comm' && /^comm\//.test(currentRoute)) ||
          (item[0] === 'mission' && /^mission(\/|$)/.test(currentRoute)) ||
          (item[0] === 'pyai' && /^pyai(\/|$)/.test(currentRoute)) ||
          (item[0] === 'notes' && /^notes\//.test(currentRoute)) ||
          (item[0] === 'roadmap' && /^roadmap\//.test(currentRoute)) ||
          (item[0] === 'flash' && /^flash\//.test(currentRoute)) ||
          (item[0] === 'datacamp' && /^datacamp\//.test(currentRoute)) ||
          (item[0] === 'practice' && /^practice\//.test(currentRoute)) ||
          (item[0] === 'python' && /^lesson\//.test(currentRoute)) ||
          (item[0] === 'english' && /^(english\/|eng-skill\/)/.test(currentRoute)) ||
          (item[0] === 'analytics' && /^(weekly|monthly)$/.test(currentRoute)) ||
          (item[0] === 'habit' && currentRoute.indexOf('habit/') === 0) ||
          (item[0] === 'dua' && /^dua\//.test(currentRoute)) ||
          (item[0] === 'week' && /^week\//.test(currentRoute)) ||
          (item[0] === 'books' && (currentRoute.indexOf('books/') === 0 || currentRoute.indexOf('copy/') === 0)) ||
          (item[0] === 'movies' && currentRoute.indexOf('movies/') === 0);
        if (on) anyOn = true;
        var lp = /^(cheatsheet|plan|career|eng-vocab|saved|notes|movies)$/.test(item[0]) && !on;
        items += '<button class="nav-item' + (on ? ' on' : '') + (lp ? ' lp' : '') + '" data-go="' + item[0] + '" title="' + esc(item[2]) + '"' + (on ? ' aria-current="page"' : '') + '>' +
          item[1] + '<span>' + esc(item[2]) + '</span>' +
          (item[3] ? '<span class="badge' + (item[4] ? ' hot' : '') + '">' + esc(item[3]) + '</span>' : '') +
          '</button>';
      });
      /* Yig'ilgan guruh: sarlavha + (agar faol sahifa shu guruhda bo'lsa) faqat o'sha element */
      html += '<div class="nav-group' + (isCol ? ' collapsed' : '') + (anyOn ? ' has-on' : '') + '">' +
        '<button class="nav-label" data-navgroup="' + g[0] + '" aria-expanded="' + !isCol + '">' +
          '<span>' + esc(g[1]) + '</span>' + IC.chevron + '</button>' +
        '<div class="nav-items">' + items + '</div></div>';
    });
    $('#navGroups').innerHTML = html;
  }

  /* Til almashganda o'zgaradigan statik matnlar */
  function applyStaticText() {
    $('#searchLabel').textContent = tr('search');
    $('#footTag').textContent = tr('footTag');
    $('#footReset').textContent = tr('setReset');
    $('#footSettings').textContent = tr('settings');
    $('#paletteInput').placeholder = tr('palettePh');
    $('#palHintNav').textContent = tr('palNav');
    $('#palHintOpen').textContent = tr('palOpen');
    $('#palHintClose').textContent = tr('palClose');
    $$('#langSeg button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.langSet === Store.get('lang'));
    });
  }

  /* ====================== GLOBAL HODISALAR ============================= */

  function onClick(e) {
    // SVG ichidagi element ham Element, lekin ehtiyot shart: closest bo'lmasa ota elementga o'tamiz
    var t = (e.target && e.target.closest) ? e.target : e.target.parentElement;
    if (!t) return;
    var el;

    // Navigatsiya
    el = t.closest('[data-go]');
    if (el) { e.preventDefault(); App.go(el.dataset.go); return; }

    // Kodni nusxalash / ishga tushirish
    el = t.closest('[data-copy]');
    if (el) { var pre = document.getElementById(el.dataset.copy); if (pre) copyText(pre.dataset.src || pre.textContent); return; }
    el = t.closest('[data-run]');
    if (el) { Playground.toggle(el.dataset.run); return; }

    // Sertifikat
    el = t.closest('[data-cert]');
    if (el) { Certificate.open(Number(el.dataset.cert)); return; }
    el = t.closest('[data-engcert]');
    if (el) { Certificate.openIELTS(); return; }

    // Ingliz tili: kun vazifasi va kunni yopish
    el = t.closest('[data-engtask]');
    if (el) {
      var p = el.dataset.engtask.split(':');
      Eng.toggleTask(/^i/.test(p[0]) ? p[0] : Number(p[0]), Number(p[1]));
      App.render();
      return;
    }
    el = t.closest('[data-engday]');
    if (el) { Eng.toggleDay(/^i/.test(el.dataset.engday) ? el.dataset.engday : Number(el.dataset.engday)); App.render(); return; }
    // Boshqaruv panelidagi "Birinchi qadamlar" kartasini yopish
    el = t.closest('[data-onbhide]');
    if (el) { Store.setFlag('onb:hide'); App.render(); return; }

    // Kunlik intizom: bitta blok / butun kun
    el = t.closest('[data-habit]');
    if (el) {
      var hp = el.dataset.habit.split('|');
      Store.habitToggle(hp[0], hp[1]);
      App.render();
      return;
    }
    /* Qo'lda daqiqa qo'shish: "sana|eng|30" yoki "sana|code|reset" */
    el = t.closest('[data-addmin]');
    if (el) {
      var am = el.dataset.addmin.split('|');
      if (am[2] === 'reset') Store.addMinutes(am[0], am[1], -100000);
      else Store.addMinutes(am[0], am[1], Number(am[2]) || 0);
      App.render();
      return;
    }

    el = t.closest('[data-habitall]');
    if (el) {
      var ha = el.dataset.habitall.split('|');
      var plan = HabitPlan.forDate(ha[0]);
      var ids = plan.blocks.filter(function (b) { return b.core; }).map(function (b) { return b.id; });
      Store.habitSetDay(ha[0], ids, ha[1] === '1');
      toast(tr(ha[1] === '1' ? 'habDayDone' : 'habDayReopened'), ha[1] === '1' ? 'ok' : '');
      App.render();
      return;
    }
    el = t.closest('[data-prayerset]');
    if (el) {
      var ps = el.dataset.prayerset.split('|');
      var cfg = Store.setting('prayer') || {};
      cfg[ps[0]] = ps[0] === 'city' ? ps[1] : Number(ps[1]);
      Store.setSetting('prayer', cfg);
      App.render();
      return;
    }
    /* Namoz vaqti: avtomatik (hisoblangan) yoki qo'lda kiritilgan */
    el = t.closest('[data-manualmode]');
    if (el) {
      var mm = el.dataset.manualmode.split('|');
      var pcfg = Store.setting('prayer') || {};
      pcfg.manual = pcfg.manual || {};
      if (mm[1] === 'auto') delete pcfg.manual[mm[0]];
      else pcfg.manual[mm[0]] = HabitPlan.times(Store.dateKey())[mm[0]].str;
      Store.setSetting('prayer', pcfg);
      App.render();
      return;
    }

    // Reja bosqichi
    el = t.closest('[data-phase]');
    if (el) { Store.togglePlan(el.dataset.phase); App.render(); return; }

    // Sozlama kalitlari
    el = t.closest('[data-setting]');
    if (el) {
      var key = el.dataset.setting;
      var on = !Store.setting(key);
      Store.setSetting(key, on);
      /* Bildirishnoma yoqilganda brauzerdan ruxsat so'raladi */
      if (key === 'notify' && on && window.Notify) {
        Notify.request().then(function (p) { if (p !== 'granted') toast(tr('notifDenied'), 'warn'); else Notify.check(); App.render(); });
      }
      App.render();
      return;
    }
    el = t.closest('[data-navgroup]');
    if (el) {
      var nc = Store.setting('navCollapsed') || {};
      nc[el.dataset.navgroup] = !nc[el.dataset.navgroup];
      Store.setSetting('navCollapsed', nc);
      renderNav();
      return;
    }

    el = t.closest('[data-theme-set]');
    if (el) {
      var th = App.themeOf(el.dataset.themeSet);
      var lastT = Store.setting('themeLast') || {};
      lastT[th.dark ? 'dark' : 'light'] = th.id;
      Store.setSetting('themeLast', lastT);
      Store.set('theme', th.id); App.applyTheme();
      if (el.closest('#themePop')) App.renderThemePop(); else App.render();
      return;
    }
    el = t.closest('[data-lang-set]');
    if (el) { App.setLang(el.dataset.langSet); return; }

    // Eslatma o'chirish
    el = t.closest('[data-delnote]');
    if (el) { Store.setNote(Number(el.dataset.delnote), ''); Search.invalidate(); toast(tr('noteDeleted')); App.render(); return; }

    // Xatolar daftari
    el = t.closest('[data-fixmis]');
    if (el) { Store.toggleMistake(el.dataset.fixmis); App.render(); return; }
    el = t.closest('[data-misfilter]');
    if (el) { PageMistakes.setFilter(el.dataset.misfilter); App.render(); return; }
    el = t.closest('#clearFixed');
    if (el) { Store.clearFixedMistakes(); toast(tr('misCleared'), 'ok'); App.render(); return; }
  }

  function onKey(e) {
    // Ctrl/Cmd + K — qidiruv
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      Search.isOpen() ? Search.close() : Search.open();
      return;
    }
    // [ — chap panelni yig'ish/yoyish (matn maydonida emas)
    var tag = (e.target && e.target.tagName) || '';
    if (e.key === '[' && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && !(e.target && e.target.isContentEditable)) {
      $('#menuBtn').click(); return;
    }
    if (e.key === 'Escape') {
      if ($('#kbdOverlay') && $('#kbdOverlay').classList.contains('show')) App.kbdHelp(false);
      else if ($('#themePop') && !$('#themePop').hidden) App.toggleThemePop(false);
      else if (Search.isOpen()) Search.close();
      else if ($('#certOverlay').classList.contains('show')) Certificate.close();
      else document.body.classList.remove('drawer-open');
      return;
    }

    // Matn kiritilayotgan bo'lsa — qolgan qisqartmalar ishlamasin
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // "/" — qidiruv
    if (e.key === '/') { e.preventDefault(); Search.open(); return; }
    // "?" — qisqartmalar ro'yxati
    if (e.key === '?') { e.preventDefault(); App.kbdHelp(); return; }

    /* "g" + harf — tez o'tish: g d Boshqaruv, g t Bugun, g r Takror, g p Mashq,
       g m Xatolar, g s Sozlamalar. Ikkinchi tugma 1.2 s ichida bosilishi kerak. */
    if (e.key.toLowerCase() === 'g') { goChord = Date.now(); return; }
    if (goChord && Date.now() - goChord < 1200) {
      var chord = { d: 'dashboard', t: 'today', r: 'review', p: 'practice', m: 'mistakes', s: 'settings', c: 'course', e: 'english', b: 'books', a: 'analytics' }[e.key.toLowerCase()];
      goChord = 0;
      if (chord) { e.preventDefault(); App.go(chord); return; }
    }

    var fwd  = e.key === 'ArrowRight' || e.key.toLowerCase() === 'j';
    var back = e.key === 'ArrowLeft'  || e.key.toLowerCase() === 'k';
    if (!fwd && !back) return;

    // Darslar bo'ylab: J / K yoki ← / →
    var m = currentRoute.match(/^lesson\/(\d+)$/);
    if (m) {
      var day = Number(m[1]);
      if (fwd) { if (dayOf(day + 1) && App.isDayOpen(day + 1)) App.go('lesson/' + (day + 1)); }
      else if (dayOf(day - 1)) App.go('lesson/' + (day - 1));
      return;
    }

    // Ingliz tili kunlari bo'ylab — o'sha tugmalar
    m = currentRoute.match(/^english\/(i?\d+)$/);
    if (m) {
      var ed = /^i/.test(m[1]) ? m[1] : Number(m[1]);
      var nk = fwd ? Eng.nextKey(ed) : Eng.prevKey(ed);
      if (nk !== null && Eng.dayOf(nk)) App.go('english/' + nk);
    }
  }

  /* ====================== ISHGA TUSHIRISH ============================== */
  function boot() {
    Store.init();
    /* ?lang=en&theme=navy — havola orqali til/mavzu (demo, video, ulashish uchun) */
    try {
      var qp = new URLSearchParams(location.search);
      if (/^(uz|en)$/.test(qp.get('lang') || '')) Store.set('lang', qp.get('lang'));
      if (qp.get('theme') && App.themeOf(qp.get('theme')).id === qp.get('theme')) Store.set('theme', qp.get('theme'));
    } catch (e) {}
    document.documentElement.lang = Store.get('lang');
    App.applyTheme();

    $('#themeBtn').addEventListener('click', function (e) { e.stopPropagation(); App.toggleThemePop(); });
    // Popover tashqarisiga bosilsa yopiladi
    document.addEventListener('click', function (e) {
      var pop = $('#themePop');
      if (pop && !pop.hidden && !pop.contains(e.target) && !e.target.closest('#themePop')) App.toggleThemePop(false);
    });
    /* Tor ekranda — drawer; keng ekranda — chap panelni ikonka rejimiga yig'ish */
    $('#menuBtn').addEventListener('click', function () {
      if (window.matchMedia('(max-width: 980px)').matches) { document.body.classList.toggle('drawer-open'); return; }
      var col = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', col);
      Store.setSetting('sidebarCollapsed', col);
    });
    if (Store.setting('sidebarCollapsed')) document.body.classList.add('sidebar-collapsed');
    /* Profil menyusi: tugma ochadi, tashqariga bosish / Esc / navigatsiya yopadi */
    $('#profileBtn').addEventListener('click', function (e) { e.stopPropagation(); toggleBell(false); toggleProfileMenu(); });
    var nb = $('#notifBtn');
    if (nb) {
      nb.addEventListener('click', function (e) { e.stopPropagation(); renderBell(); toggleBell(); });
      $('#notifPop').addEventListener('click', function (e) {
        var nf = e.target.closest('[data-nf]'); if (nf && window.Ctrl) Ctrl.readNotif([nf.dataset.nf]);
        if (e.target.closest('[data-go]')) { toggleBell(false); return; }
        e.stopPropagation();
      });
      document.addEventListener('click', function () { toggleBell(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleBell(false); });
    }
    $('#profileMenu').addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]'); if (go) { toggleProfileMenu(false); return; }
      if (e.target.closest('#pmLogout')) { toggleProfileMenu(false); App.logout(); }
      e.stopPropagation();
    });
    document.addEventListener('click', function () { toggleProfileMenu(false); });
    $('#scrim').addEventListener('click', function () { document.body.classList.remove('drawer-open'); });
    $('#searchBtn').addEventListener('click', function () { Search.open(); });
    $('#certDownload').addEventListener('click', function () { Certificate.download(); });
    $('#certClose').addEventListener('click', function () { Certificate.close(); });
    $('#certX').addEventListener('click', function () { Certificate.close(); });
    $('#certOverlay').addEventListener('click', function (e) {
      if (e.target === $('#certOverlay')) Certificate.close();
    });
    $('#footReset').addEventListener('click', function () { App.resetProgress(); });

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);

    /* Oflayn qobiq: faqat https (Vercel) da — mahalliy file:// va localhost'da kerak emas */
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      var swv = ((document.querySelector('script[src*="?v="]') || {}).src || '').split('v=')[1] || 'dev';
      navigator.serviceWorker.register('sw.js?v=' + swv).then(function () { window.__swReady = true; }).catch(function () {});
    }

    /* Kutilmagan xato — jim o'tib ketmasin: toast + konsol (xatoni topish oson bo'ladi) */
    var lastErr = '';
    window.addEventListener('error', function (e) {
      var msg = (e.message || 'Error') + (e.filename ? ' — ' + e.filename.split('/').pop() + ':' + e.lineno : '');
      if (msg === lastErr) return; lastErr = msg;
      if (window.toast) toast(msg, 'warn');
    });
    window.addEventListener('unhandledrejection', function (e) {
      var msg = 'Promise: ' + (e.reason && e.reason.message || e.reason);
      if (msg === lastErr) return; lastErr = msg;
      if (window.toast) toast(msg, 'warn');
    });
    window.addEventListener('hashchange', App.render);

    /* Oflayn/onlayn: halol xabar — ma'lumot qurilmada, sinxron ulanish qaytganda */
    function netState() { document.body.classList.toggle('is-offline', !navigator.onLine); }
    window.addEventListener('offline', function () { netState(); if (window.toast) toast(tr('netOffline'), 'warn'); });
    window.addEventListener('online', function () { netState(); if (window.toast) toast(tr('netOnline'), 'ok'); if (window.Sync && Sync.pull) Sync.pull(); });
    netState();

    Search.init();
    if (window.Ctrl) Ctrl.init();                            // nazorat sessiyasi / chat (faqat Vercel'da faol)
    if (window.Clock) Clock.init();                          // tepadagi soat + flip clock
    Store.onChange(function () { Search.invalidate(); });   // daftar/xato o'zgarsa indeks qayta quriladi
    App.render();
    if (window.UZ_APP_READY) UZ_APP_READY();                // intro: 100% — ilova chizildi (real tayyorlik)

    /* Bulut sinxron — render'dan KEYIN: avval mahalliy holat ko'rinsin,
       bulutdan yangisi kelsa Sync o'zi qayta chizadi. Sahifa hech qachon
       tarmoqni kutib turmaydi.                                             */
    if (window.Sync) Sync.init();
    /* Bildirishnomalar: ertalab reja, kechqurun ogohlantirish va roast */
    if (window.Notify) Notify.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
