/* ==========================================================================
   Mission — IELTS Mission dvigateli (holat, kunlik reja, dalil, xatolar)
   --------------------------------------------------------------------------
   AI yo'q. Hammasi saqlangan dalil + shaffof qoidalar. Har reja vazifasi
   "nega" ro'yxatini olib yuradi — qaysi dalil uni tanlagani.

   Holat: Store.all().mission (bulut bilan sinxron, sync.js → Mission.merge)
     settings  { mode, custom, ivls }
     days      { "YYYY-MM-DD": { plan:[task], budget, mode, frozenAt, tasks:{id:{st,min,startedAt,movedTo,at}}, notes:[], extra:[task] } }
     attempts  [ { id, at, ts, kind, ref, mode, min, items:[[key, res, cat]], score, total } ]
                 res: 2 = mustaqil to'g'ri · 1 = yordam bilan / qisman · 0 = xato
     errors    { eid: { id, skill, src, at, q, resp, correct, cat, expl, follow, status, srs, n } }
     vocab     { ptr:{u,s,i}, items:{ id:{ w, m, u, s, srs, pex, col, first } } }
     writing   { id: piece }   speaking { id: session }
     mocks     [ { id, at, date, kind, source, L, R, W, S, raw, notes } ]
     books     [ { id, at, book, title, unit, pages, score, total, types, misses, min } ]
     custom    { id: { title, key:[], audio:bool, at } }   — o'quvchi kiritgan tinglash testlari
     diag      { skill: { at, attempt } }
   Hajm: attempt elementlari ixcham massiv; drafts har ishda ≤ 6; jurnal ≤ 2000.
   ========================================================================== */
(function () {
  'use strict';
  var C = function () { return window.MISSION_CFG; };
  var T = function (uz, en) { return { uz: uz, en: en }; };
  /* Ikki tilli birlashtirish: cc(T('O\'qish: ', 'Reading: '), title, ' …') — har til o'z qismini oladi */
  function cc() {
    var a = Array.prototype.slice.call(arguments), pick = function (l) { return a.map(function (x) { return x && typeof x === 'object' ? (x[l] || x.en || x.uz || '') : String(x == null ? '' : x); }).join(''); };
    return { uz: pick('uz'), en: pick('en') };
  }
  var SKILLS = ['reading', 'listening', 'vocab', 'grammar', 'speaking'];
  var LIMIT = { attempts: 2000, drafts: 6, errorsOpen: 1500 };

  function today() { return Store.dateKey(); }
  function addDays(k, n) { return SRS2.addDays(k, n); }
  function diffDays(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function round5(x) { return Math.max(0, Math.round(x / 5) * 5); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[’']/g, "'").replace(/[.,;:!?"()]+$/g, '').replace(/^[\s"(]+/, '').replace(/\s+/g, ' ').trim(); }
  function lev(a, b) {
    a = norm(a); b = norm(b);
    if (Math.abs(a.length - b.length) > 3) return 9;
    var d = []; for (var i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (var j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }

  /* ====================== HOLAT ========================================= */
  function blank() {
    return { v: 1, createdAt: Date.now(), settings: { mode: C().defaultMode, custom: 150, ivls: null },
      days: {}, attempts: [], errors: {}, vocab: { ptr: { u: 0, s: 0, i: 0 }, items: {} },
      writing: {}, speaking: {}, mocks: [], books: [], custom: {}, diag: {} };
  }
  function M() {
    var st = Store.all();
    if (!st.mission || !st.mission.v) {
      /* Birinchi marta: mavjud holatning bir martalik mahalliy zaxirasi (hech narsa o'chirilmaydi) */
      try { if (!localStorage.getItem('uzla.state.backup.mission-v1')) localStorage.setItem('uzla.state.backup.mission-v1', JSON.stringify({ at: Date.now(), state: st })); } catch (e) {}
      var b = blank(), cur = st.mission || {};
      Object.keys(cur).forEach(function (k) { b[k] = cur[k]; });
      st.mission = b;
    }
    var m = st.mission, d = blank();
    Object.keys(d).forEach(function (k) { if (m[k] === undefined) m[k] = d[k]; });
    return m;
  }
  function save() { Store.set('mission', M()); }
  function ivls() { var s = M().settings.ivls; return s && s.length ? s : C().intervals; }

  /* ====================== KALENDAR ===================================== */
  function dayIndex(k) { return diffDays(C().start, k || today()) + 1; }          // 1..113 (113 = yakuniy takror)
  function weekOf(k) { var i = dayIndex(k); return i < 1 ? 0 : Math.min(C().weeks, Math.ceil(i / 7)); }
  function phaseOf(k) { var w = weekOf(k); return C().phases.filter(function (p) { return w >= p.from && w <= p.to; })[0] || null; }
  function inMission(k) { var i = dayIndex(k); return i >= 1 && i <= C().days; }

  /* ====================== MATERIAL KATALOGI ============================ */
  var Cat = {
    readings: function () { return window.ENG_READING || [].concat(window.ENG_READING_1 || [], window.ENG_READING_2 || [], window.ENG_READING_3 || [], window.ENG_READING_4 || []); },
    reading: function (n) { return Cat.readings().filter(function (r) { return r.n === Number(n); })[0] || null; },
    sections: function () { return [].concat(window.ENG_LISTENING_1 || [], window.ENG_LISTENING_2 || []); },
    section: function (n) { return Cat.sections().filter(function (s) { return s.n === Number(n); })[0] || null; },
    /* Target Listening 1: 12 test × 2 yarim (1–15, 16–30) — kalit kitobdan */
    tl: function () { return window.ENG_DICT || null; },
    tlKey: function (t) { var D = Cat.tl(); return D && D.keys[String(t)] ? D.keys[String(t)] : ''; },
    tlSessions: function () { var out = [], D = Cat.tl(); if (!D) return out; for (var t = 1; t <= D.meta.tests; t++) if (Cat.tlKey(t)) { out.push('tl:' + t + ':1'); out.push('tl:' + t + ':2'); } return out; },
    grammarItems: function (cat) {
      var G = window.ENG_GRAMMAR_EX || {}, def = C().grammarCats[cat]; if (!def) return [];
      var out = [];
      def.keys.forEach(function (k) { (G[k] || []).forEach(function (e, i) { out.push({ id: 'g:' + k + ':' + i, topic: k, cat: cat, q: e.q, a: e.a }); }); });
      return out;
    },
    grammarCatOf: function (topic) { var cs = C().grammarCats; for (var c in cs) if (cs[c].keys.indexOf(topic) >= 0) return c; return 'structure'; },
    /* Grammatika kalitini avtomatik tekshirish mumkinmi: aniq javob ro'yxati bo'lsa */
    autoAnswers: function (a) {
      a = String(a || '');
      if (/[…✓✗→]|\.\.\.|\(|[ʻ`]|\byo'q\b|\bha\b/i.test(a) || a.length > 60) return null;
      return a.split(' / ').map(norm).filter(Boolean);
    },
    dest: function () { return window.ENG_DEST_B2 || null; },
    cards: function () {
      var out = [], S = window.SPEAK30, seen = {};
      (C().cards || []).forEach(function (c) { out.push({ id: c.id, q: c.q, cue: c.cue, p3: c.p3, src: 'mission' }); });
      if (S) S.days.forEach(function (d) {
        if (!/Part 2/.test(d.part) || !/^Describe/.test(d.q.en) || seen[d.q.en]) return;
        seen[d.q.en] = 1;
        var m = d.q.en.match(/^(Describe [^.]+\.)\s*Say (.+)$/);
        out.push({ id: 's30-' + d.n, q: m ? m[1] : d.q.en, cue: m ? m[2].replace(/\.$/, '').split(/, (?:and )?/) : [], p3: (S.qs && S.qs[d.n]) || [], src: 'speak30' });
      });
      return out;
    },
    part1: function () { var S = window.SPEAK30; return S && S.pool ? S.pool.slice() : []; },
    prompt: function (task, id) { return ((C().prompts || {})[task] || []).filter(function (p) { return p.id === id; })[0] || null; }
  };

  /* ====================== DALIL (attempts) ============================= */
  function record(a) {
    var m = M();
    a.id = a.id || uid(); a.at = a.at || today(); a.ts = Date.now();
    a.items = (a.items || []).map(function (x) { return [String(x[0]).slice(0, 40), x[1], x[2] || '']; });
    a.total = a.total != null ? a.total : a.items.length;
    a.score = a.score != null ? a.score : a.items.reduce(function (s, x) { return s + (x[1] === 2 ? 1 : x[1] === 1 ? 0.5 : 0); }, 0);
    m.attempts.push(a);
    if (m.attempts.length > LIMIT.attempts) m.attempts = m.attempts.slice(-LIMIT.attempts);
    if (a.mode === 'diagnostic' && a.skill) m.diag[a.skill] = { at: a.at, attempt: a.id };
    if (Store.logEvent) Store.logEvent('msn-' + a.kind, a.ref, (a.kind + ' ' + a.ref + ' · ' + a.score + '/' + a.total).slice(0, 100));
    save();
    return a;
  }
  function skillOfAttempt(a) { return a.skill || ({ reading: 'reading', book: 'reading', listening: 'listening', vocab: 'vocab', grammar: 'grammar', writing: 'writing', speaking: 'speaking' })[a.kind] || a.kind; }
  function attemptsOf(skill) { return M().attempts.filter(function (a) { return skillOfAttempt(a) === skill; }); }
  function attempted(ref) { return M().attempts.some(function (a) { return a.ref === ref; }); }

  /* ====================== PROFIL (dalil asosida) ======================
     Ishonch: dalil soniga qarab. Writing/Speaking — o'z-o'zini baholash,
     shuning uchun eng ko'pi "o'rta" (tashqi baho ≥ 2 bo'lsa "yuqori").   */
  function confOf(n) { return n === 0 ? 'none' : n < 10 ? 'low' : n < 40 ? 'medium' : 'high'; }
  function profile() {
    var m = M(), out = {};
    ['reading', 'listening', 'grammar', 'vocab'].forEach(function (sk) {
      var items = [], byType = {}, last = null;
      attemptsOf(sk).forEach(function (a) {
        last = !last || a.at > last ? a.at : last;
        a.items.forEach(function (x) {
          if (x[1] < 0) return;
          items.push(x);
          var t = x[2] || 'other'; byType[t] = byType[t] || [0, 0]; byType[t][0] += x[1] === 2 ? 1 : x[1] === 1 ? 0.5 : 0; byType[t][1]++;
        });
      });
      var n = items.length, ok = items.reduce(function (s, x) { return s + (x[1] === 2 ? 1 : x[1] === 1 ? 0.5 : 0); }, 0);
      var recent = items.slice(-40), early = items.slice(0, Math.min(40, Math.max(0, n - 40)));
      var acc = function (arr) { return arr.length ? arr.reduce(function (s, x) { return s + (x[1] === 2 ? 1 : x[1] === 1 ? 0.5 : 0); }, 0) / arr.length : null; };
      out[sk] = { n: n, acc: n ? ok / n : null, conf: confOf(n), byType: byType, last: last, recentAcc: acc(recent), earlyAcc: early.length >= 10 ? acc(early) : null,
        books: sk === 'reading' ? m.books.length : 0 };
    });
    var pieces = Object.keys(m.writing).map(function (k) { return m.writing[k]; });
    var assessed = pieces.filter(function (p) { return p.self && p.self.length; });
    var ext = pieces.filter(function (p) { return p.external && p.external.band != null; });
    out.writing = { n: assessed.length, pieces: pieces.length, conf: assessed.length === 0 ? 'none' : ext.length >= 2 ? 'high' : assessed.length >= 3 ? 'medium' : 'low', self: true,
      lastSelf: assessed.length ? lastSelfAvg(assessed[assessed.length - 1]) : null, last: (function () { var mx = pieces.reduce(function (l, p) { return Math.max(l, p.at || 0); }, 0); return mx ? Store.dateKey(new Date(mx)) : null; })() };
    var ss = Object.keys(m.speaking).map(function (k) { return m.speaking[k]; });
    var rated = ss.filter(function (s) { return s.self; });
    out.speaking = { n: rated.length, sessions: ss.length, recorded: ss.filter(function (s) { return s.rec; }).length, conf: rated.length === 0 ? 'none' : rated.length >= 4 ? 'medium' : 'low', self: true,
      last: ss.reduce(function (l, s) { return !l || s.at > l ? s.at : l; }, null) };
    out.prelim = C().prelim;
    return out;
  }
  function lastSelfAvg(p) {
    var s = p.self[p.self.length - 1]; if (!s || !s.scores) return null;
    var v = Object.keys(s.scores).map(function (k) { return Number(s.scores[k]); }).filter(function (x) { return !isNaN(x); });
    return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length * 2) / 2 : null;
  }
  /* Kuchli/zaif tomonlar — kamida 3 dalil bo'lgan savol turlari */
  function strengths(sk) {
    var p = profile()[sk]; if (!p || !p.byType) return { strong: [], weak: [] };
    var rows = Object.keys(p.byType).map(function (t) { var v = p.byType[t]; return { t: t, acc: v[0] / v[1], n: v[1] }; }).filter(function (r) { return r.n >= 3; });
    return { strong: rows.filter(function (r) { return r.acc >= 0.8; }).sort(function (a, b) { return b.acc - a.acc; }), weak: rows.filter(function (r) { return r.acc < 0.65; }).sort(function (a, b) { return a.acc - b.acc; }) };
  }

  /* ====================== XATOLAR BANKI ================================ */
  var Errors = {
    /* Xatoni qo'shish yoki takrorlanganini belgilash (bir xil eid — bir xil element) */
    add: function (e) {
      var m = M(), id = e.id || (e.skill + ':' + e.src + ':' + (e.key || uid()));
      var cur = m.errors[id], t = today();
      if (cur) {
        cur.n = (cur.n || 1) + 1; cur.at = t; cur.resp = String(e.resp || '').slice(0, 300);
        if (cur.status === 'fixed') cur.status = 'returned';
        cur.srs = SRS2.apply(cur.srs || SRS2.fresh(t, 0), 'wrong', t, ivls());
      } else {
        m.errors[id] = { id: id, skill: e.skill, src: String(e.src || ''), at: t, first: t, q: String(e.q || '').slice(0, 400), resp: String(e.resp || '').slice(0, 300),
          correct: String(e.correct || '').slice(0, 300), cat: e.cat || '', expl: String(e.expl || '').slice(0, 600), follow: e.follow || '', status: 'open', n: 1,
          srs: SRS2.fresh(t, 1) };
      }
      return m.errors[id];
    },
    list: function () { var m = M(); return Object.keys(m.errors).map(function (k) { return m.errors[k]; }); },
    due: function (d) { d = d || today(); return Errors.list().filter(function (e) { return e.status !== 'fixed' && e.srs && e.srs.due <= d; }).sort(function (a, b) { return (b.n || 1) - (a.n || 1) || (a.srs.due < b.srs.due ? -1 : 1); }); },
    /* Takror natijasi: 'wrong' | 'partial' | 'independent' */
    review: function (id, outcome) {
      var e = M().errors[id]; if (!e) return null;
      var t = today(), wasFixed = e.status === 'fixed';
      e.srs = SRS2.apply(e.srs || SRS2.fresh(t, 0), outcome, t, ivls());
      e.tries = (e.tries || []).concat([[t, outcome[0]]]).slice(-20);
      if (outcome === 'wrong') { e.status = wasFixed || e.status === 'returned' ? 'returned' : 'open'; e.n = (e.n || 1) + 1; }
      else if (outcome === 'independent' && e.srs.streak >= 2) { e.status = 'fixed'; e.fixedAt = t; }
      save();
      return e;
    },
    /* Statistika: eng ko'p toifalar, yaqinda tuzatilgan, qaytganlar */
    stats: function () {
      var list = Errors.list(), cats = {}, t = today();
      list.forEach(function (e) { var k = e.skill + ':' + (e.cat || 'other'); cats[k] = cats[k] || { skill: e.skill, cat: e.cat || 'other', open: 0, total: 0, n: 0 }; cats[k].total++; cats[k].n += e.n || 1; if (e.status !== 'fixed') cats[k].open++; });
      return {
        total: list.length, open: list.filter(function (e) { return e.status !== 'fixed'; }).length,
        due: Errors.due().length,
        top: Object.keys(cats).map(function (k) { return cats[k]; }).sort(function (a, b) { return b.open - a.open || b.n - a.n; }),
        fixedRecent: list.filter(function (e) { return e.status === 'fixed' && e.fixedAt && diffDays(e.fixedAt, t) <= 14; }),
        returned: list.filter(function (e) { return e.status === 'returned'; }),
        repeated: list.filter(function (e) { return (e.n || 1) >= 2 && e.status !== 'fixed'; })
      };
    },
    grammarFocus: function () {
      var counts = {};
      Errors.list().forEach(function (e) { if (e.skill === 'grammar' || (e.skill === 'writing' && C().grammarCats[e.cat])) { if (e.status !== 'fixed') counts[e.cat] = (counts[e.cat] || 0) + (e.n || 1); } });
      var best = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      return best ? { cat: best, n: counts[best], src: 'errors' } : null;
    }
  };

  /* ====================== LUG'AT (Destination B2 + o'z so'zlari) ========= */
  var Vocab = {
    item: function (id) { return M().vocab.items[id] || null; },
    list: function () { var v = M().vocab.items; return Object.keys(v).map(function (k) { v[k].id = k; return v[k]; }); },
    due: function (d) { d = d || today(); return Vocab.list().filter(function (it) { return it.srs && it.srs.due <= d; }); },
    /* Ko'rsatkich bo'yicha keyingi yangi so'zlar (unit → bo'lim → element) */
    peekNew: function (n) {
      var D = Cat.dest(), out = []; if (!D) return out;
      var p = Object.assign({}, M().vocab.ptr), guard = 0;
      while (out.length < n && guard++ < 5000) {
        var u = D.units[p.u]; if (!u) break;
        var sec = u.secs[p.s]; if (!sec) { p.u++; p.s = 0; p.i = 0; continue; }
        var it = sec.items[p.i]; if (!it) { p.s++; p.i = 0; continue; }
        var id = 'd:' + u.n + ':' + sec.k + ':' + p.i;
        if (!M().vocab.items[id] && it[0] && it[1]) out.push({ id: id, w: it[0], m: it[1], u: u.n, s: sec.k, theme: u.theme, ptr: { u: p.u, s: p.s, i: p.i + 1 } });
        p.i++;
      }
      return out;
    },
    /* Yangi so'zni kartochkaga qo'shish (ko'rsatkich oldinga suriladi) */
    learn: function (x) {
      var m = M();
      if (!m.vocab.items[x.id]) m.vocab.items[x.id] = { w: x.w, m: x.m, u: x.u || null, s: x.s || 'own', theme: x.theme || '', first: today(), srs: SRS2.fresh(today(), 0), pex: '', col: '' };
      if (x.ptr) m.vocab.ptr = x.ptr;
      save(); return m.vocab.items[x.id];
    },
    addOwn: function (w, mean, ex) {
      var id = 'own:' + norm(w).replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      if (!w || !mean) return null;
      var it = Vocab.learn({ id: id, w: String(w).trim(), m: String(mean).trim(), s: 'own' });
      if (ex) { it.pex = String(ex).slice(0, 300); save(); }
      return it;
    },
    /* Ishlab chiqarish (production): ma'no → so'z. hint = birinchi harf ko'rsatilgan */
    check: function (id, typed, hint) {
      var it = Vocab.item(id); if (!it) return null;
      var want = norm(it.w).replace(/^to /, ''), got = norm(typed).replace(/^to /, '');
      var alts = want.split(/\s*\/\s*|\s*,\s*/);
      var ok = alts.indexOf(got) >= 0 || got === want;
      var close = !ok && got && alts.some(function (a) { return lev(a, got) <= (a.length > 6 ? 2 : 1); });
      var outcome = ok ? (hint ? 'hint' : 'independent') : 'wrong';
      it.srs = SRS2.apply(it.srs, outcome, today(), ivls());
      if (!ok) Errors.add({ skill: 'vocab', src: id, key: 'w', q: it.m, resp: typed, correct: it.w, cat: close ? 'spelling' : 'meaning', expl: close ? 'Spelling is close — check each letter.' : 'Meaning not recalled.', follow: 'mission/vocab' });
      save();
      return { ok: ok, close: close, outcome: outcome, word: it.w };
    },
    setExample: function (id, ex, col) { var it = Vocab.item(id); if (!it) return; it.pex = String(ex || '').slice(0, 300); if (col != null) it.col = String(col).slice(0, 120); save(); },
    stats: function () {
      var t = today(), l = Vocab.list(), st = { total: l.length, due: 0, learning: 0, familiar: 0, secure: 0, withExample: 0 };
      l.forEach(function (it) { var s = SRS2.status(it.srs, t); if (s === 'due') st.due++; else if (s === 'secure') st.secure++; else if (s === 'familiar') st.familiar++; else st.learning++; if (it.pex) st.withExample++; });
      return st;
    }
  };

  /* ====================== WRITING STUDIO (saqlash) ===================== */
  var LINKERS = ['however', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'as a result', 'for example', 'for instance', 'on the other hand', 'in contrast', 'whereas', 'while', 'although', 'despite', 'nevertheless', 'firstly', 'secondly', 'finally', 'in conclusion', 'overall', 'this means', 'which'];
  var STOP = 'the a an and or of to in on for is are be with that this it as by at from their they there these those was were has have had not but can will would should could more most than which who also its into such'.split(' ');
  var Studio = {
    list: function () { var w = M().writing; return Object.keys(w).map(function (k) { return w[k]; }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); }); },
    get: function (id) { return M().writing[id] || null; },
    create: function (o) {
      var id = 'w' + uid(), p = o.promptId ? Cat.prompt(o.task, o.promptId) : null;
      M().writing[id] = { id: id, task: o.task === 1 ? 1 : 2, promptId: p ? p.id : '', prompt: p ? p.q : String(o.prompt || '').slice(0, 1200), title: String(o.title || (p ? p.id : 'Custom')).slice(0, 120),
        src: o.src || '', created: Date.now(), at: Date.now(), drafts: o.text ? [{ at: Date.now(), text: String(o.text).slice(0, 12000), min: 0 }] : [], plan: '', self: [], notes: [], timed: !!o.timed, mode: o.mode || 'practice' };
      save(); return id;
    },
    importText: function (o) { return Studio.create({ task: 2, prompt: o.title || '', title: o.title || 'Imported', src: o.src, text: o.text }); },
    /* Qoralama: oxirgi versiyani yangilaydi; newVersion=true — yangi versiya (≤ 6) */
    saveDraft: function (id, text, newVersion, min) {
      var p = Studio.get(id); if (!p) return;
      text = String(text || '').slice(0, 12000);
      if (!p.drafts.length || newVersion) p.drafts.push({ at: Date.now(), text: text, min: min || 0 });
      else { var d = p.drafts[p.drafts.length - 1]; d.text = text; d.at = Date.now(); if (min) d.min = (d.min || 0) + min; }
      if (p.drafts.length > LIMIT.drafts) p.drafts = [p.drafts[0]].concat(p.drafts.slice(-(LIMIT.drafts - 1)));
      p.at = Date.now(); save();
    },
    setPlan: function (id, plan) { var p = Studio.get(id); if (!p) return; p.plan = String(plan || '').slice(0, 3000); p.at = Date.now(); save(); },
    /* Izoh/xato belgisi: bankka ham tushadi (grammatika toifasi bo'lsa grammar sifatida) */
    annotate: function (id, d, a) {
      var p = Studio.get(id); if (!p) return null;
      var n = { id: uid(), d: d, quote: String(a.quote || '').slice(0, 300), cat: a.cat || 'task', note: String(a.note || '').slice(0, 400), fix: String(a.fix || '').slice(0, 300), at: Date.now() };
      p.notes.push(n);
      var gram = !!C().grammarCats[n.cat];
      Errors.add({ skill: gram ? 'grammar' : 'writing', src: 'wr:' + id, key: n.id, q: n.quote, resp: n.quote, correct: n.fix, cat: n.cat, expl: n.note, follow: 'mission/writing/' + id });
      p.at = Date.now(); save(); return n;
    },
    unannotate: function (id, nid) { var p = Studio.get(id); if (!p) return; p.notes = p.notes.filter(function (x) { return x.id !== nid; }); save(); },
    /* O'z-o'zini baholash (har versiya uchun alohida); ball — TAXMIN */
    assess: function (id, d, scores, checks, note) {
      var p = Studio.get(id); if (!p) return;
      p.self = p.self.filter(function (s) { return s.d !== d; });
      p.self.push({ d: d, at: Date.now(), scores: scores || {}, checks: checks || {}, note: String(note || '').slice(0, 1000) });
      p.at = Date.now();
      record({ kind: 'writing', skill: 'writing', ref: 'wr:' + id + ':' + d, mode: p.mode === 'diagnostic' ? 'diagnostic' : p.mode === 'mock' ? 'mock' : 'practice', items: [], score: lastSelfAvg(p), total: 9, task: p.task });
    },
    external: function (id, band, note) { var p = Studio.get(id); if (!p) return; p.external = { band: Number(band), note: String(note || '').slice(0, 600), at: Date.now() }; save(); },
    del: function (id) { delete M().writing[id]; save(); },
    /* Matn statistikasi — baho EMAS, faqat o'lchov */
    stats: function (text) {
      text = String(text || '');
      var words = (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []);
      var paras = text.split(/\n\s*\n/).filter(function (x) { return x.trim(); });
      var sents = text.split(/[.!?]+(\s|$)/).filter(function (x) { return x && x.trim().length > 2; });
      var low = ' ' + text.toLowerCase().replace(/\s+/g, ' ') + ' ';
      var linkers = LINKERS.filter(function (l) { return low.indexOf(' ' + l + ' ') >= 0 || low.indexOf(' ' + l + ',') >= 0; });
      var freq = {};
      words.forEach(function (w) { w = w.toLowerCase(); if (w.length > 3 && STOP.indexOf(w) < 0) freq[w] = (freq[w] || 0) + 1; });
      var rep = Object.keys(freq).filter(function (w) { return freq[w] >= 4; }).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 6).map(function (w) { return [w, freq[w]]; });
      return { words: words.length, paras: paras.length, sents: sents.length, avg: sents.length ? Math.round(words.length / sents.length) : 0, linkers: linkers, repeated: rep };
    },
    /* So'z darajasidagi farq (LCS). 1500 so'zgacha. → [[op, word]] op: '=', '+', '-' */
    diff: function (a, b) {
      var A = String(a || '').split(/\s+/).filter(Boolean), B = String(b || '').split(/\s+/).filter(Boolean);
      if (A.length * B.length > 2250000) return [['+', B.join(' ')]];
      var n = A.length, m = B.length, L = new Array(n + 1);
      for (var i = 0; i <= n; i++) L[i] = new Uint16Array(m + 1);
      for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      var out = []; i = 0; j = 0;
      while (i < n && j < m) { if (A[i] === B[j]) { out.push(['=', A[i]]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { out.push(['-', A[i]]); i++; } else { out.push(['+', B[j]]); j++; } }
      while (i < n) out.push(['-', A[i++]]); while (j < m) out.push(['+', B[j++]]);
      return out;
    }
  };

  /* ====================== SPEAKING STUDIO (saqlash) ==================== */
  var Speaking = {
    list: function () { var s = M().speaking; return Object.keys(s).map(function (k) { return s[k]; }).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); }); },
    get: function (id) { return M().speaking[id] || null; },
    create: function (o) {
      var id = 's' + uid();
      M().speaking[id] = { id: id, at: today(), ts: Date.now(), part: o.part || 'full', cardId: o.cardId || '', qs: (o.qs || []).slice(0, 12), notes: '', dur: 0, rec: false, reflection: {}, self: null, mode: o.mode || 'practice' };
      save(); return id;
    },
    update: function (id, patch) { var s = Speaking.get(id); if (!s) return; Object.keys(patch).forEach(function (k) { s[k] = patch[k]; }); s.ts = Date.now(); save(); },
    /* O'z bahosi: talaffuz FAQAT yozuv bo'lsa */
    assess: function (id, self, reflection) {
      var s = Speaking.get(id); if (!s) return;
      if (!s.rec) delete self.pron;
      s.self = self; s.reflection = reflection || s.reflection; s.ts = Date.now();
      var v = ['fc', 'lr', 'gra', 'pron'].map(function (k) { return Number(self[k]); }).filter(function (x) { return !isNaN(x) && x > 0; });
      record({ kind: 'speaking', skill: 'speaking', ref: 'spk:' + id, mode: s.mode === 'diagnostic' ? 'diagnostic' : s.mode === 'mock' ? 'mock' : 'practice', items: [], score: v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length * 2) / 2 : null, total: 9, rec: !!s.rec });
      if (reflection && reflection.errors) String(reflection.errors).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8).forEach(function (line, i) {
        Errors.add({ skill: 'speaking', src: 'spk:' + id, key: String(i), q: line, resp: line, correct: '', cat: 'grammar', expl: 'Noted in speaking self-review.', follow: 'mission/speaking' });
      });
      save();
    },
    del: function (id) { delete M().speaking[id]; save(); }
  };

  /* ====================== TEST NATIJALARI (to'rt xil) =================== */
  var KINDS = ['practice', 'estimate', 'verified', 'official'];
  var Results = {
    kinds: KINDS,
    list: function () { return M().mocks.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); },
    /* practice: xom ball (x/y); estimate/verified/official: band 0–9 (0.5 qadam) */
    add: function (r) {
      if (KINDS.indexOf(r.kind) < 0) throw new Error('kind');
      var band = function (v) { if (v === '' || v == null) return null; v = Number(v); if (isNaN(v) || v < 0 || v > 9 || Math.round(v * 2) !== v * 2) throw new Error('band'); return v; };
      var rec = { id: uid(), at: Date.now(), date: /^\d{4}-\d{2}-\d{2}$/.test(r.date || '') ? r.date : today(), kind: r.kind, source: String(r.source || '').slice(0, 160), notes: String(r.notes || '').slice(0, 600) };
      if (r.kind === 'practice') rec.raw = r.raw || {};
      else { rec.L = band(r.L); rec.R = band(r.R); rec.W = band(r.W); rec.S = band(r.S); if ([rec.L, rec.R, rec.W, rec.S].every(function (x) { return x == null; })) throw new Error('empty'); }
      M().mocks.push(rec); save(); return rec;
    },
    del: function (id) { M().mocks = M().mocks.filter(function (x) { return x.id !== id; }); save(); }
  };

  /* ====================== KITOB ISHI (o'z kitobidan) =================== */
  var Books = {
    add: function (b) {
      var score = Number(b.score), total = Number(b.total);
      var rec = { id: uid(), at: today(), book: b.book || 'other', title: String(b.title || '').slice(0, 120), unit: String(b.unit || '').slice(0, 60), pages: String(b.pages || '').slice(0, 40),
        score: isNaN(score) ? null : score, total: isNaN(total) || total <= 0 ? null : total, types: (b.types || []).slice(0, 8), misses: String(b.misses || '').slice(0, 800), min: Number(b.min) || 0 };
      M().books.push(rec);
      if (rec.total) record({ kind: 'book', skill: 'reading', ref: 'book:' + rec.id, mode: 'practice', items: [], score: rec.score, total: rec.total, book: rec.book });
      else save();
      return rec;
    },
    list: function () { return M().books.slice().reverse(); }
  };

  /* ====================== KUNLIK REJA ==================================
     Qoidalar (hammasi ko'rinadigan "nega" bilan):
       1) Byudjet = rejim daqiqasi. Xatolar takrori: ≥120 → 15, 90 → 10,
          60 → faqat takror kutayotgan bo'lsa 10.
       2) Ustuvorlik: baholanmagan ko'nikma ↑, aniqlik < 60% ↑↑, < 75% ↑,
          ≥ 85% va ishonch yuqori ↓, necha kun mashq qilinmagan ↑ (≤ +0.6),
          grammatikada ochiq xato ≥ 5 ↑.
       3) ≥ 165 daqiqa — 5 ko'nikmaning hammasi (standart nisbatda, ustuvorlik
          ×0.75–1.3); 100–164 — hammasi, kamida 15 daq; ≤ 95 — eng ustuvor 3 ta.
       4) 1-hafta yoki diagnostikasi yo'q ko'nikma — diagnostika vazifasi.
       5) Mock kuni — amaliy mock (rasmiy emas). Yakuniy kun — yakuniy takror.   */
  function lastPracticed(sk) {
    var last = null, m = M();
    m.attempts.forEach(function (a) { if (skillOfAttempt(a) === sk || (sk === 'grammar' && a.kind === 'writing')) last = !last || a.at > last ? a.at : last; });
    Object.keys(m.days).forEach(function (d) { var day = m.days[d]; (day.plan || []).forEach(function (t) { var s = day.tasks && day.tasks[t.id]; if (s && s.st === 'done' && t.skill === sk) last = !last || d > last ? d : last; }); });
    return last;
  }
  function priorities(d) {
    var pr = profile(), out = {};
    SKILLS.forEach(function (sk) {
      var why = [], p = pr[sk === 'grammar' ? 'grammar' : sk], score = { reading: 1, listening: 1, vocab: 0.9, grammar: 1, speaking: 0.9 }[sk];
      if (sk === 'grammar' && pr.writing.n === 0) { score += 0.2; why.push(T('Writing hali baholanmagan', 'Writing not assessed yet')); }
      if (!p || p.conf === 'none') {
        var pre = C().prelim.filter(function (x) { return x.skill === sk && x.kind === 'quiz'; })[0];
        if (pre) {
          var pa = pre.score / pre.total; score += 0.3 + (pa < 0.6 ? 0.4 : 0);
          why.push(T('Faqat dastlabki ko\'rsatkich bor: ' + pre.score + '/' + pre.total + ' (ishonch past)', 'Only a preliminary indicator: ' + pre.score + '/' + pre.total + ' (low confidence)'));
        } else { score += 0.6; why.push(T('Hali baholanmagan — dalil kerak', 'Not assessed yet — evidence needed')); }
      } else {
        var acc = p.recentAcc != null ? p.recentAcc : p.acc, pc = Math.round(acc * 100);
        if (acc < 0.6) { score += 0.5; why.push(T("So'nggi aniqlik " + pc + '% (60% dan past)', 'Recent accuracy ' + pc + '% (below 60%)')); }
        else if (acc < 0.75) { score += 0.25; why.push(T("So'nggi aniqlik " + pc + '%', 'Recent accuracy ' + pc + '%')); }
        else if (acc >= 0.85 && p.conf === 'high') { score -= 0.3; why.push(T('Barqaror kuchli (' + pc + '%, ishonch yuqori)', 'Consistently strong (' + pc + '%, high confidence)')); }
      }
      var lp = lastPracticed(sk), gap = lp ? diffDays(lp, d) : 3;
      if (gap >= 2) { score += Math.min(0.6, gap * 0.15); why.push(T(gap + ' kundan beri mashq qilinmagan', 'Not practised for ' + gap + ' days')); }
      if (sk === 'grammar') { var gf = Errors.grammarFocus(); if (gf && gf.n >= 5) { score += 0.3; why.push(T('Grammatikada ' + gf.n + ' ta ochiq xato', gf.n + ' open grammar errors')); } }
      if (sk === 'vocab') { var vd = Vocab.due(d).length; if (vd >= 20) { score += 0.3; why.push(T(vd + " ta so'z takror kutmoqda", vd + ' words due for review')); } }
      out[sk] = { score: Math.round(score * 100) / 100, why: why };
    });
    return out;
  }
  function budgetFor(mode) {
    var s = M().settings, md = mode || s.mode;
    if (md === 'custom') return Math.max(30, Math.min(360, Number(s.custom) || 150));
    var x = C().modes.filter(function (m) { return m.key === md; })[0];
    return x && x.min ? x.min : 195;
  }
  function allocate(budget, pri, dueN) {
    var review = budget >= 120 ? 15 : budget >= 90 ? 10 : (dueN > 0 ? 10 : 0);
    var rest = budget - review, base = C().split, skills = SKILLS.slice();
    if (budget <= 95) skills = skills.sort(function (a, b) { return pri[b].score - pri[a].score; }).slice(0, 3);
    var w = {}, sum = 0;
    skills.forEach(function (sk) { var mul = Math.max(0.75, Math.min(1.3, pri[sk].score)); w[sk] = base[sk] * mul; sum += w[sk]; });
    var out = {}, used = 0, minEach = budget >= 165 ? 20 : 15;
    skills.forEach(function (sk) { out[sk] = Math.max(minEach, round5(rest * w[sk] / sum)); used += out[sk]; });
    /* Yaxlitlash farqi: eng ustuvorga qo'shish / eng pastdan olish */
    var order = skills.slice().sort(function (a, b) { return pri[b].score - pri[a].score; }), guard = 0;
    while (used !== rest && guard++ < 50) {
      if (used < rest) { out[order[0]] += 5; used += 5; }
      else { var low = order.slice().reverse().filter(function (sk) { return out[sk] > minEach; })[0]; if (!low) break; out[low] -= 5; used -= 5; }
    }
    if (review) out.review = review;
    return out;
  }

  /* --- vazifa yasovchilar (har biri: objective, activity, material, criteria, assess, next) --- */
  function taskBase(d, sk, min, why) { return { id: d + ':' + sk, skill: sk, min: min, why: why || [], parts: [] }; }

  function mkReading(d, min, why, diag) {
    var t = taskBase(d, 'reading', min, why), ph = phaseOf(d), timed = ph && ph.key !== 'diag' && ph.key !== 'found';
    if (diag) {
      t.kind = 'diag'; t.ref = 'r:1';
      t.title = T("O'qish diagnostikasi", 'Reading diagnostic');
      t.objective = T("Savol turlari bo'yicha boshlang'ich aniqlikni o'lchash", 'Measure baseline accuracy by question type');
      t.activity = T("1-matn (aralash savol turlari), 20 daqiqa, javobdan keyin dalil (abzats) ko'rsatish", 'Passage 1 (mixed question types), 20 minutes, then show the evidence paragraph for each answer');
      t.material = { route: 'mission/run/reading/1?mode=diagnostic', label: T('Diagnostika matni', 'Diagnostic passage') };
    } else {
      var weak = strengths('reading').weak[0], rs = Cat.readings(), pick = null;
      var fresh = rs.filter(function (r) { return !attempted('r:' + r.n); });
      if (weak) pick = fresh.filter(function (r) { return r.qs.some(function (q) { return q.type === weak.t; }); })[0];
      pick = pick || fresh[0];
      if (!pick) { /* hammasi ishlangan → eng ko'p xato qilingan, eng eski urinishli matn */
        var errBy = {}; Errors.list().forEach(function (e) { if (e.skill === 'reading') errBy[e.src] = (errBy[e.src] || 0) + (e.status === 'fixed' ? 0 : 1); });
        pick = rs.slice().sort(function (a, b) { return (errBy['r:' + b.n] || 0) - (errBy['r:' + a.n] || 0); })[0];
        t.why.push(T('Barcha 24 matn ishlangan — eng ko\'p ochiq xatoli matn qayta', 'All 24 passages done — re-attempt the one with most open errors'));
      }
      if (weak) t.why.push(T('Eng zaif savol turi: ' + weak.t + ' (' + Math.round(weak.acc * 100) + '%)', 'Weakest question type: ' + weak.t + ' (' + Math.round(weak.acc * 100) + '%)'));
      t.kind = 'reading'; t.ref = 'r:' + pick.n;
      var rmin = min >= 40 ? Math.min(25, min - 15) : min;
      t.title = cc(T("O'qish: ", 'Reading: '), pick.title);
      t.objective = weak ? T(weak.t + ' savollarida dalil topish', 'Find evidence for ' + weak.t + ' questions') : T("Matn tuzilishini tushunib, savollarga dalil bilan javob berish", 'Understand passage structure and answer with evidence');
      t.activity = T((timed ? '20 daqiqa vaqt bilan' : 'Vaqtsiz, lekin vaqt yoziladi') + ': ' + pick.qs.length + ' savol; har xatoda matndan dalil va sabab', (timed ? 'Timed, 20 minutes' : 'Untimed, time recorded') + ': ' + pick.qs.length + ' questions; for each miss, the evidence and the reason');
      t.material = { route: 'mission/run/reading/' + pick.n, label: T('Platforma matni (Reading Explorer 3 mavzusida yozilgan)', 'Platform passage (written on a Reading Explorer 3 theme)') };
      t.parts.push({ min: rmin, label: t.material.label, route: t.material.route });
      if (min >= 40) t.parts.push({ min: min - rmin, label: T("Kitob ishi: Reading Explorer 4 yoki Reading Accelerator — bitta bo'lim, keyin natijani yozing", 'Book work: Reading Explorer 4 or Reading Accelerator — one section, then log your result'), route: 'mission/books' });
    }
    t.criteria = T("Hamma javob topshirilgan va har xato sababi bilan ko'rib chiqilgan", 'All answers submitted and every miss reviewed with its reason');
    t.assess = T('Kalit bilan tekshiruv; savol turi bo\'yicha aniqlik', 'Checked against the key; accuracy by question type');
    t.next = T('Xatolar 1 kundan keyin takrorga tushadi', 'Misses return for review after 1 day');
    return t;
  }
  function mkListening(d, min, why, diag) {
    var t = taskBase(d, 'listening', min, why);
    if (diag) {
      t.kind = 'diag'; t.ref = 'ls:1+3';
      t.title = T('Tinglash diagnostikasi', 'Listening diagnostic');
      t.objective = T("Section 1 (forma) va Section 3 (MCQ) bo'yicha boshlang'ich nuqta", 'Baseline on Section 1 (form) and Section 3 (MCQ)');
      t.activity = T("Ikki bo'lim brauzer ovozi (speech synthesis) bilan; transkript javobdan keyin ochiladi. Natija taxminiy — imtihon audiosi emas", 'Two sections read aloud by the browser (speech synthesis); transcript unlocks after answering. Indicative only — not exam audio');
      t.material = { route: 'mission/run/listen/1?mode=diagnostic&then=3', label: T('Platforma bo\'limlari 1 va 3', 'Platform sections 1 and 3') };
    } else {
      var m = M(), custom = Object.keys(m.custom).filter(function (k) { return !attempted('cu:' + k); })[0];
      var tl = Cat.tlSessions().filter(function (s) { return !attempted(s); })[0];
      var sec = Cat.sections().filter(function (s) { return !attempted('ls:' + s.n); })[0];
      t.kind = 'listening';
      var first = null;
      if (custom) { first = { ref: 'cu:' + custom, route: 'mission/run/custom/' + custom, label: T("O'zingiz kiritgan test: " + m.custom[custom].title, 'Your imported test: ' + m.custom[custom].title) }; t.why.push(T("Siz kiritgan Section 1 testi hali ishlanmagan", 'Your imported Section 1 test is not done yet')); }
      else if (tl) { var p = tl.split(':'); first = { ref: tl, route: 'mission/run/tl/' + p[1] + '/' + p[2], label: T('Target Listening 1 — ' + p[1] + '-test, ' + (p[2] === '1' ? '1–15' : '16–30') + ' savollar (kitob audiosi)', 'Target Listening 1 — Test ' + p[1] + ', questions ' + (p[2] === '1' ? '1–15' : '16–30') + ' (book audio)') }; }
      else if (sec) first = { ref: 'ls:' + sec.n, route: 'mission/run/listen/' + sec.n, label: T('Platforma bo\'limi ' + sec.n + ' (brauzer ovozi)', 'Platform section ' + sec.n + ' (browser voice)') };
      else { var lst = Errors.list().filter(function (e) { return e.skill === 'listening' && e.status !== 'fixed'; })[0]; first = { ref: lst ? lst.src : 'tl:1:1', route: 'mission/errors?skill=listening', label: T('Tinglash xatolari — qayta tinglash', 'Listening misses — re-listen') }; }
      t.ref = first.ref;
      t.title = cc(T('Tinglash: ', 'Listening: '), first.label);
      t.objective = T("Avval tinglab javob berish, keyin har xatoning ANIQ sababini topish", 'Answer while listening first, then find the EXACT reason for each miss');
      t.activity = T("Transkriptsiz tinglang → javob → kalit → qiyin joyni qayta tinglang → sabab", 'Listen without the transcript → answer → key → replay hard parts → reason');
      t.material = { route: first.route, label: first.label };
      var lmin = sec && min >= 40 && first.ref.indexOf('ls:') !== 0 ? min - 15 : min;
      t.parts.push({ min: lmin, label: first.label, route: first.route });
      if (lmin < min) t.parts.push({ min: min - lmin, label: T('Platforma bo\'limi ' + sec.n + ': brauzer ovozi bilan, transkript keyin', 'Platform section ' + sec.n + ': browser voice, transcript afterwards'), route: 'mission/run/listen/' + sec.n });
    }
    t.criteria = T('Javoblar kalit bilan tekshirilgan, har xato uchun sabab tanlangan', 'Answers checked against the key, a reason chosen for every miss');
    t.assess = T("To'g'ri/xato, imlo va birlik/ko'plik alohida", 'Correct/incorrect, spelling and singular/plural tracked separately');
    t.next = T("Sababi bo'yicha xatolar takrorga tushadi", 'Misses join the review queue by reason');
    return t;
  }
  function mkVocab(d, min, why, diag) {
    var t = taskBase(d, 'vocab', min, why), due = Vocab.due(d).length, nNew = Math.min(20, Math.max(5, Math.round(min / 2)));
    if (diag) {
      t.kind = 'diag'; t.ref = 'v:diag';
      t.title = T("Lug'at diagnostikasi", 'Vocabulary diagnostic');
      t.objective = T("Destination B2 so'zlarini faol eslash darajasi", 'Active recall level on Destination B2 words');
      t.activity = T("30 ta so'z: ma'nosi ko'rsatiladi → inglizcha so'zni yozasiz (yordamsiz)", '30 words: you see the meaning → type the English word (no hints)');
      t.material = { route: 'mission/vocab?mode=diagnostic', label: T("Lug'at diagnostikasi", 'Vocabulary diagnostic') };
    } else {
      t.kind = 'vocab'; t.ref = 'v:' + d;
      t.title = T("Lug'at: " + due + ' takror + ' + nNew + " yangi so'z", 'Vocabulary: ' + due + ' reviews + ' + nNew + ' new words');
      t.objective = T("So'zni ma'nosidan ESLAB yozish va o'z gapingizda ishlatish", 'RECALL the word from its meaning and use it in your own sentence');
      t.activity = T("Avval takror (eslash → tekshirish), keyin yangi so'zlar; har yangi so'zga shaxsiy gap", 'Reviews first (recall → check), then new words; a personal sentence for each new word');
      t.material = { route: 'mission/vocab', label: T('Destination B2 + o\'z so\'zlaringiz', 'Destination B2 + your own words') };
      if (due) t.why.push(T(due + " ta so'z bugun takror kutmoqda", due + ' words are due today'));
    }
    t.newN = nNew;
    t.criteria = T("Takrorlar tugagan; yangi so'zlarning har biriga gap yozilgan", 'Reviews finished; a sentence written for each new word');
    t.assess = T("Yozib eslash: mustaqil / yordam bilan / xato", 'Typed recall: independent / with hint / wrong');
    t.next = T("Natijaga qarab 1–3–7–14 kun oralig'ida qaytadi", 'Returns after 1–3–7–14 days depending on the result');
    return t;
  }
  function writingFor(d) {
    var idx = Math.max(1, dayIndex(d)), ph = phaseOf(d), k = ph ? ph.key : 'found';
    var t2 = C().prompts[2], t1 = C().prompts[1];
    var rot = idx % 3;
    if (rot === 1) return { task: 1, prompt: t1[(Math.floor(idx / 3)) % t1.length], what: T('Task 1: overview + 2 ta asosiy xususiyat abzatsi', 'Task 1: overview + 2 key-feature paragraphs') };
    var p = t2[(Math.floor(idx / 3) + 1) % t2.length];
    if (k === 'found' || k === 'diag') return { task: 2, prompt: p, what: rot === 0 ? T('Task 2: reja + kirish + 1 ta asosiy abzats', 'Task 2: plan + introduction + one body paragraph') : T('Task 2: reja + ikkinchi asosiy abzats + xulosa', 'Task 2: plan + second body paragraph + conclusion') };
    return { task: 2, prompt: p, what: T('Task 2: reja va 2 ta to\'liq asosiy abzats (vaqt bilan)', 'Task 2: plan and two full body paragraphs (timed)') };
  }
  function mkGrammar(d, min, why, diag) {
    var t = taskBase(d, 'grammar', min, why);
    if (diag) {
      t.kind = 'diag'; t.ref = 'g:diag';
      t.title = T('Grammatika diagnostikasi + Writing', 'Grammar diagnostic + Writing');
      t.objective = T("10 toifa bo'yicha qaysi xatolar eng ko'p ekanini aniqlash", 'Find which of the 10 categories cause most errors');
      t.activity = T("20 ta mashq (har toifadan 2 ta), keyin Writing diagnostikasi: Task 2, 40 daqiqa (alohida kun ham bo'lishi mumkin)", '20 exercises (2 per category), then the Writing diagnostic: Task 2, 40 minutes (can be another day)');
      t.material = { route: 'mission/run/grammar/diag?mode=diagnostic', label: T('Grammatika diagnostikasi', 'Grammar diagnostic') };
      t.parts.push({ min: Math.min(min, 15), label: t.material.label, route: t.material.route });
      t.parts.push({ min: Math.max(0, min - 15), label: T("Writing diagnostikasini boshlash (Task 2 to'liq 40 daqiqa — boshqa kunga ham bo'ladi)", 'Start the Writing diagnostic (a full Task 2 takes 40 minutes — fine on another day)'), route: 'mission/writing/new?task=2&prompt=t2-01&mode=diagnostic&timed=40' });
    } else {
      var gf = Errors.grammarFocus(), cat = gf ? gf.cat : null;
      if (!cat) {
        var pr = profile().grammar, rows = Object.keys(pr.byType).map(function (c) { var v = pr.byType[c]; return { c: c, acc: v[0] / v[1], n: v[1] }; }).filter(function (r) { return r.n >= 2 && C().grammarCats[r.c]; }).sort(function (a, b) { return a.acc - b.acc; });
        cat = rows[0] ? rows[0].c : 'tenses';
        t.why.push(rows[0] ? cc(T('Diagnostikada eng past toifa: ', 'Lowest category in the evidence: '), C().grammarCats[cat].title) : T('Dastlabki feedback: grammatik aniqlik — zamon tanlashdan boshlaymiz', 'Earlier feedback: grammar accuracy — starting with tense choice'));
      } else t.why.push(cc(T('Eng ko\'p ochiq xato: ', 'Most open errors: '), C().grammarCats[cat].title, ' (' + gf.n + ')'));
      var w = writingFor(d), gmin = Math.max(10, round5(min / 3));
      t.kind = 'grammar'; t.ref = 'g:' + cat; t.cat = cat;
      t.title = cc(C().grammarCats[cat].title, ' + ', w.what);
      t.objective = T("Bitta ustuvor grammatika toifasini mashq qilib, darhol o'z yozuvingizda 3 marta ishlatish", 'Practise one priority grammar category, then use it 3 times in your own writing');
      t.activity = cc(T('8 ta mashq → ', '8 exercises → '), w.what);
      t.material = { route: 'mission/run/grammar/' + cat, label: cc(T('Grammatika: ', 'Grammar: '), C().grammarCats[cat].title) };
      t.parts.push({ min: gmin, label: t.material.label, route: t.material.route });
      t.parts.push({ min: min - gmin, label: w.what, route: 'mission/writing/new?task=' + w.task + '&prompt=' + w.prompt.id + '&focus=' + cat });
    }
    t.criteria = T("Mashqlar tekshirilgan; yozuv saqlangan va kamida bitta xato belgilangan yoki o'z bahosi berilgan", 'Exercises checked; writing saved with at least one error marked or a self-assessment done');
    t.assess = T("Avtomatik (aniq kalit) yoki o'z-o'zini tekshirish — har biri belgilanadi", 'Auto-check (clean key) or self-check — each is labelled');
    t.next = T('Takrorlanuvchi toifa qisqa tushuntirish bilan ertaga qaytadi', 'A recurring category comes back tomorrow with a short explanation');
    return t;
  }
  function mkSpeaking(d, min, why, diag) {
    var t = taskBase(d, 'speaking', min, why), cards = Cat.cards(), idx = Math.max(1, dayIndex(d));
    if (diag) {
      t.kind = 'diag'; t.ref = 'spk:diag';
      t.title = T('Speaking diagnostikasi (to\'liq: Part 1–3)', 'Speaking diagnostic (full: Parts 1–3)');
      t.objective = T("Ravonlik, lug'at va grammatika bo'yicha boshlang'ich yozuv", 'A baseline recording for fluency, vocabulary and grammar');
      t.activity = T('Part 1 (3 savol) → Part 2 (1 daqiqa tayyorgarlik, 2 daqiqa gapirish) → Part 3 (3 savol); yozib oling va qayta tinglang', 'Part 1 (3 questions) → Part 2 (1 minute prep, 2 minutes talk) → Part 3 (3 questions); record and listen back');
      t.material = { route: 'mission/speaking/new?part=full&card=c01&mode=diagnostic', label: T('Speaking Studio', 'Speaking Studio') };
    } else {
      var card = cards[(idx - 1) % cards.length], rot = idx % 3, part = rot === 0 ? '2+3' : rot === 1 ? '1+2' : '1+3';
      t.kind = 'speaking'; t.ref = 'card:' + card.id;
      t.title = T('Speaking: Part ' + part + ' — ' + card.q, 'Speaking: Part ' + part + ' — ' + card.q);
      t.objective = T("To'g'ridan-to'g'ri javob + sabab + misol; takrorsiz, bog'langan fikr", 'Direct answer + reason + example; connected ideas without repetition');
      t.activity = T("Tayyorgarlik taymeri, qisqa eslatma, yozib olish, qayta tinglash, refleksiya ro'yxati", 'Prep timer, short notes, record, listen back, reflection checklist');
      t.material = { route: 'mission/speaking/new?part=' + encodeURIComponent(part) + '&card=' + card.id, label: T('Speaking Studio', 'Speaking Studio') };
    }
    t.criteria = T("Javob yozib olingan (yoki gapirildi deb belgilangan) va refleksiya to'ldirilgan", 'Answer recorded (or marked as spoken) and the reflection completed');
    t.assess = T("O'z bahosi: FC, LR, GRA; talaffuz faqat yozuv bo'lsa", 'Self-assessment: FC, LR, GRA; pronunciation only with a recording');
    t.next = T('Refleksiyada yozilgan xatolar takrorga tushadi', 'Errors noted in the reflection join the review queue');
    return t;
  }
  function mkReview(d, min) {
    var t = taskBase(d, 'review', min, []), due = Errors.due(d).length;
    t.kind = 'review'; t.ref = 'err:' + d;
    t.title = T('Xatolar takrori: ' + due + ' ta kutmoqda', 'Error review: ' + due + ' due');
    t.objective = T('Oldingi xatolarni javobni ko\'rmasdan qayta yechish', 'Re-solve earlier errors before seeing the answer');
    t.activity = due ? T("Har xato: avval o'zingiz javob bering → keyin to'g'ri javob va tushuntirish → natija", 'Each error: answer first → then the correct answer and explanation → outcome')
      : T("Kutayotgan xato yo'q — eski so'z va grammatikani aralash eslash (interleaving)", 'No errors due — mixed recall of older words and grammar (interleaving)');
    t.material = { route: 'mission/errors/review', label: T('Xatolar banki', 'Error bank') };
    if (due) t.why.push(T(due + ' ta xato takror muddati keldi', due + ' errors reached their review date'));
    t.criteria = T("Kutayotgan xatolar ko'rib chiqilgan (eng ko'pi 20 ta — qolgani ertaga)", 'Due errors reviewed (max 20 — the rest tomorrow)');
    t.assess = T('Mustaqil / qisman / xato — keyingi takror shunga qarab', 'Independent / partial / wrong — the next review depends on it');
    t.next = T('2 marta ketma-ket mustaqil to\'g\'ri → "tuzatildi"', 'Two independent correct answers in a row → "fixed"');
    return t;
  }
  var MAKERS = { reading: mkReading, listening: mkListening, vocab: mkVocab, grammar: mkGrammar, speaking: mkSpeaking };

  function mockPlan(d) {
    var rs = Cat.readings().slice().sort(function (a, b) { return (attempted('r:' + a.n) ? 1 : 0) - (attempted('r:' + b.n) ? 1 : 0) || b.n - a.n; }).slice(0, 3).map(function (r) { return r.n; });
    var tl = Cat.tlSessions().filter(function (s) { return !attempted(s); })[0] || 'tl:12:1', tn = tl.split(':')[1];
    var mk = function (sk, min, title, act, route) { return { id: d + ':mock-' + sk, skill: sk, min: min, kind: 'mock', ref: 'mock:' + sk, title: title, objective: T('Imtihon sharoitida bajarish (amaliy, rasmiy emas)', 'Work under exam conditions (practice, not official)'), activity: act, material: { route: route, label: title }, parts: [], why: [T('Amaliy mock kuni (' + weekOf(d) + '-hafta)', 'Practice mock day (week ' + weekOf(d) + ')')], criteria: T("To'liq, vaqt bilan bajarilgan", 'Completed in full, timed'), assess: T('Xom ball / o\'z bahosi — band EMAS', 'Raw score / self-estimate — NOT a band'), next: T('Natija Testlar sahifasida "practice" sifatida', 'Result logged as "practice" on the Tests page') }; };
    return [
      mk('reading', 60, T("Mock Reading: 3 matn, 60 daqiqa", 'Mock Reading: 3 passages, 60 minutes'), T('Matnlar: ' + rs.join(', ') + ' — ketma-ket, umumiy 60 daqiqa', 'Passages ' + rs.join(', ') + ' — back to back, 60 minutes total'), 'mission/run/reading/' + rs[0] + '?mode=mock&set=' + rs.join(',')),
      mk('listening', 35, T('Mock Listening: Target Listening 1, ' + tn + '-test (30 savol)', 'Mock Listening: Target Listening 1, Test ' + tn + ' (30 questions)'), T('Kitob audiosi, to\'xtatmasdan; javoblar oxirida', 'Book audio, no pausing; answers at the end'), 'mission/run/tl/' + tn + '/all?mode=mock'),
      mk('grammar', 60, T('Mock Writing: Task 1 (20 daq) + Task 2 (40 daq)', 'Mock Writing: Task 1 (20 min) + Task 2 (40 min)'), T("Ikkala vazifa Writing Studio'da vaqt bilan, keyin o'z bahosi", 'Both tasks in the Writing Studio, timed, then self-assessment'), 'mission/writing/new?task=2&mode=mock&timed=40'),
      mk('speaking', 15, T("Mock Speaking: Part 1–3, yozib olinadi", 'Mock Speaking: Parts 1–3, recorded'), T('To\'liq test, yozuv, keyin o\'z bahosi', 'Full test, recording, then self-assessment'), 'mission/speaking/new?part=full&mode=mock'),
      mkReview(d, 15)
    ];
  }

  /* Rejani yasash (saqlamaydi) */
  function build(d, modeOverride) {
    var budget = budgetFor(modeOverride), idx = dayIndex(d), w = weekOf(d), notes = [];
    var out = { date: d, idx: idx, week: w, phase: phaseOf(d), budget: budget, tasks: [], notes: notes, mock: false, final: false, before: idx < 1, after: idx > C().days };
    if (out.after) { notes.push(T("Mission tugagan (14-fevral). Imtihon: " + C().exam + '. Xatolar banki va lug\'at takrori davom etadi.', 'The mission has ended (14 February). Exam: ' + C().exam + '. Error-bank and vocabulary reviews continue.')); }
    if (C().mockDays.indexOf(d) >= 0) {
      out.mock = true; out.tasks = mockPlan(d);
      notes.push(T("Mock kuni ~3 soat. Vaqtingiz kam bo'lsa — Reading va Listening bugun, Writing va Speaking'ni ertaga ko'chiring.", 'A mock day is ~3 hours. If you have less time, do Reading and Listening today and move Writing and Speaking to tomorrow.'));
      return out;
    }
    if (d === C().finalReview) {
      out.final = true;
      var rv = mkReview(d, 60); rv.title = T('Yakuniy takror: barcha ochiq xatolar', 'Final review: all open errors');
      out.tasks = [rv,
        { id: d + ':final-profile', skill: 'review', min: 30, kind: 'profile', ref: 'profile', title: T('Yakuniy profil: kuchli va zaif tomonlar, ishonch darajasi', 'Final profile: strengths, weaknesses, confidence'), objective: T("16 haftalik dalilni ko'rib chiqish va imtihon kunigacha 6 kunlik rejani tanlash", 'Review 16 weeks of evidence and choose the plan for the 6 days before the exam'), activity: T("Profil sahifasini o'qing, eng zaif 3 toifani yozing", 'Read the profile page, write down the 3 weakest categories'), material: { route: 'mission/profile', label: T('Profil', 'Profile') }, parts: [], why: [T('Yakuniy takror kuni', 'Final review day')], criteria: T('3 ta toifa va reja yozilgan', '3 categories and a plan written'), assess: T('—', '—'), next: T('Imtihon: ' + C().exam, 'Exam: ' + C().exam) },
        mkVocab(d, 30, [T('Yakuniy lug\'at takrori', 'Final vocabulary review')])];
      return out;
    }
    var pri = priorities(d), dueN = Errors.due(d).length, alloc = allocate(budget, pri, dueN);
    SKILLS.forEach(function (sk) {
      if (!alloc[sk]) return;
      var diag = !M().diag[sk] && (w <= 1 || idx < 1);
      var task = MAKERS[sk](d, alloc[sk], pri[sk].why.slice(), diag);
      task.pri = pri[sk].score;
      if (diag) {
        task.criteria = T('Diagnostika oxirigacha bajarilgan va natija saqlangan', 'The diagnostic is completed and the result saved');
        task.assess = T("Boshlang'ich dalil — band emas; profil va keyingi rejalar shundan tuziladi", 'Baseline evidence — not a band; the profile and later plans are built from it');
        task.next = T("Shu ko'nikma bo'yicha oddiy mashqlar boshlanadi", 'Regular practice for this skill starts next');
        task.why.unshift(T("Bu ko'nikma uchun diagnostika hali bajarilmagan", 'No diagnostic done for this skill yet'));
      }
      out.tasks.push(task);
    });
    out.tasks.sort(function (a, b) { return (b.pri || 0) - (a.pri || 0); });
    if (alloc.review) out.tasks.push(mkReview(d, alloc.review));
    var skipped = SKILLS.filter(function (sk) { return !alloc[sk]; });
    if (skipped.length) notes.push(T('Bugun yo\'q (qisqa reja): ' + skipped.join(', ') + " — ular ustuvorligi ertaga oshadi.", 'Not today (short plan): ' + skipped.join(', ') + ' — their priority rises tomorrow.'));
    if (out.before) notes.push(T('Mission ' + C().start + ' kuni boshlanadi. Hozir diagnostikalarni oldindan bajarishingiz mumkin — natijalar saqlanadi.', 'The mission starts on ' + C().start + '. You can take the diagnostics early — results are kept.'));
    return out;
  }

  /* Bugungi reja: birinchi ochilganda MUZLATILADI (ish davomida o'zgarmasin).
     Kechagi tugallanmagan ishlar uyulib qolmaydi: eng ustuvor BITTASI qayd
     qilinadi (bugungi shu ko'nikma vazifasi birinchi qo'yiladi), qolganlari
     ro'yxatda "ko'chirilmadi" deb ko'rsatiladi.                              */
  function day(d, opts) {
    d = d || today(); opts = opts || {};
    var m = M(), rec = m.days[d];
    if (rec && rec.plan && !opts.rebuild) return dayView(d);
    var b = build(d, opts.mode || (rec && rec.mode));
    var keep = {};
    if (rec && rec.plan) (rec.plan || []).forEach(function (t) { var s = rec.tasks[t.id]; if (s && (s.st === 'done' || s.st === 'active' || s.st === 'paused')) keep[t.id] = t; });
    rec = rec || { tasks: {}, extra: [] };
    rec.mode = opts.mode || rec.mode || m.settings.mode; rec.budget = b.budget; rec.frozenAt = Date.now();
    /* bajarilgan/jarayondagi vazifa qayta yasalganda yo'qolmaydi */
    var plan = b.tasks.map(function (t) { return keep[t.id] || t; });
    Object.keys(keep).forEach(function (id) { if (!plan.some(function (t) { return t.id === id; })) plan.push(keep[id]); });
    rec.notes = b.notes.slice();
    /* Davomiylik: oxirgi muzlatilgan kun */
    if (!opts.rebuild && inMission(d)) {
      var prevKey = Object.keys(m.days).filter(function (k) { return k < d && m.days[k].plan; }).sort().pop();
      if (prevKey) {
        var gap = diffDays(prevKey, d), prev = m.days[prevKey];
        var unfinished = (prev.plan || []).filter(function (t) { var s = prev.tasks[t.id]; return t.skill !== 'review' && (!s || (s.st !== 'done' && s.st !== 'skipped' && s.st !== 'moved')); });
        if (gap > 1) rec.notes.push(T((gap - 1) + " kun o'tkazib yuborildi. Hech narsa uyulmadi — bugun oddiy kun. Qaytish uchun 90 daqiqalik rejani tanlash mumkin.", (gap - 1) + ' day(s) missed. Nothing piled up — today is a normal day. You can pick the 90-minute plan to restart.'));
        else if (unfinished.length) {
          unfinished.sort(function (a, b) { return (b.pri || 0) - (a.pri || 0); });
          var top = unfinished[0], same = plan.filter(function (t) { return t.skill === top.skill; })[0];
          if (same) { same.carried = true; plan = [same].concat(plan.filter(function (t) { return t !== same; })); }
          rec.notes.push(cc(T('Kecha tugallanmagan: ', 'Unfinished yesterday: '), top.title, same ? T(" — bugungi shu ko'nikma vazifasi birinchi.", " — today's task for this skill comes first.") : ''));
          if (unfinished.length > 1) rec.notes.push(T("Ko'chirilmadi (uyulib qolmasin): " + unfinished.slice(1).map(function (t) { return t.skill; }).join(', '), 'Not carried over (to avoid a backlog): ' + unfinished.slice(1).map(function (t) { return t.skill; }).join(', ')));
        }
      }
    }
    (rec.extra || []).forEach(function (t) { if (!plan.some(function (x) { return x.id === t.id; })) plan.push(t); });
    rec.plan = plan;
    m.days[d] = rec; save();
    return dayView(d);
  }
  function dayView(d) {
    var rec = M().days[d], b = build(d, rec.mode);
    var planned = rec.plan.reduce(function (s, t) { return s + (rec.tasks[t.id] && rec.tasks[t.id].st === 'moved' ? 0 : t.min); }, 0);
    var done = rec.plan.filter(function (t) { return rec.tasks[t.id] && rec.tasks[t.id].st === 'done'; }).length;
    var spent = Object.keys(rec.tasks).reduce(function (s, k) { var x = rec.tasks[k]; return s + (x.min || 0) + (x.st === 'active' && x.startedAt ? Math.round((Date.now() - x.startedAt) / 60000) : 0); }, 0);
    return { date: d, idx: b.idx, week: b.week, phase: b.phase, mock: b.mock, final: b.final, before: b.before, after: b.after, mode: rec.mode, budget: rec.budget, planned: planned, spent: spent, done: done,
      tasks: rec.plan.map(function (t) { var s = rec.tasks[t.id] || { st: 'todo', min: 0 }; return Object.assign({}, t, { state: s }); }), notes: rec.notes || [] };
  }
  function taskState(d, id) { var rec = M().days[d]; if (!rec) return null; rec.tasks[id] = rec.tasks[id] || { st: 'todo', min: 0 }; return rec.tasks[id]; }
  var Tasks = {
    /* start/pause/resume — bo'lingan sessiyalar; daqiqalar yig'iladi */
    start: function (d, id) { var s = taskState(d, id); if (!s) return; if (s.st !== 'active') { s.st = 'active'; s.startedAt = Date.now(); s.at = Date.now(); save(); } },
    pause: function (d, id) { var s = taskState(d, id); if (!s || s.st !== 'active') return; s.min = (s.min || 0) + Math.max(0, Math.round((Date.now() - s.startedAt) / 60000)); s.st = 'paused'; s.startedAt = null; s.at = Date.now(); save(); },
    done: function (d, id) { var s = taskState(d, id); if (!s) return; if (s.st === 'active') s.min = (s.min || 0) + Math.max(0, Math.round((Date.now() - s.startedAt) / 60000)); s.st = 'done'; s.startedAt = null; s.at = Date.now(); if (Store.logEvent) Store.logEvent('msn-task', id, 'Mission task done'); save(); },
    skip: function (d, id) { var s = taskState(d, id); if (!s) return; s.st = 'skipped'; s.startedAt = null; s.at = Date.now(); save(); },
    reopen: function (d, id) { var s = taskState(d, id); if (!s) return; s.st = s.min ? 'paused' : 'todo'; s.at = Date.now(); save(); },
    /* Boshqa kunga ko'chirish: maqsad kunning "extra" ro'yxatiga qo'shiladi */
    move: function (d, id, to) {
      var rec = M().days[d]; if (!rec || !/^\d{4}-\d{2}-\d{2}$/.test(to) || to <= d) return false;
      var t = rec.plan.filter(function (x) { return x.id === id; })[0]; if (!t) return false;
      var s = taskState(d, id); s.st = 'moved'; s.movedTo = to; s.at = Date.now();
      var copy = Object.assign({}, t, { id: to + ':moved:' + t.skill + ':' + d, movedFrom: d });
      var tr2 = M().days[to] = M().days[to] || { tasks: {}, extra: [] };
      tr2.extra = (tr2.extra || []).filter(function (x) { return x.id !== copy.id; }).concat([copy]);
      if (tr2.plan && !tr2.plan.some(function (x) { return x.id === copy.id; })) tr2.plan.push(copy);
      save(); return true;
    },
    setMode: function (d, mode, custom) {
      var m = M();
      if (C().modes.some(function (x) { return x.key === mode; })) m.settings.mode = mode;
      if (mode === 'custom' && custom) m.settings.custom = Math.max(30, Math.min(360, Number(custom) || 150));
      return day(d, { mode: mode, rebuild: true });
    }
  };

  /* Haftalik o'quv vaqti (real yozilgan daqiqalar) */
  function weekMinutes(end) {
    end = end || today(); var m = M(), out = [];
    for (var i = 6; i >= 0; i--) { var k = addDays(end, -i), rec = m.days[k], min = 0, planned = 0;
      if (rec && rec.plan) { rec.plan.forEach(function (t) { var s = rec.tasks[t.id]; if (!s || s.st !== 'moved') planned += t.min; if (s) min += s.min || 0; }); }
      out.push({ date: k, min: min, planned: planned }); }
    return out;
  }

  /* Tavsiyalar — har biri o'z dalili bilan */
  function recommend() {
    var pr = profile(), es = Errors.stats(), out = [];
    var NM = { reading: T("O'qish", 'Reading'), listening: T('Tinglash', 'Listening'), grammar: T('Grammatika', 'Grammar'), vocab: T("Lug'at", 'Vocabulary'), writing: T('Writing', 'Writing'), speaking: T('Speaking', 'Speaking') };
    ['reading', 'listening', 'grammar', 'vocab', 'writing', 'speaking'].forEach(function (sk) {
      if (pr[sk].conf === 'none') out.push({ route: sk === 'writing' ? 'mission/writing/new?task=2&prompt=t2-01&mode=diagnostic&timed=40' : sk === 'speaking' ? 'mission/speaking/new?part=full&card=c01&mode=diagnostic' : 'mission/tests', title: cc(NM[sk], T(': diagnostika', ': diagnostic')), why: T("Bu ko'nikma bo'yicha hali dalil yo'q — profil uni baholamaydi", 'No evidence for this skill yet — the profile cannot assess it') });
    });
    es.repeated.slice(0, 1).forEach(function (e) { out.push({ route: 'mission/errors/review', title: T('Takrorlangan xato: ' + (e.cat || e.skill), 'Repeated error: ' + (e.cat || e.skill)), why: T(e.n + ' marta takrorlangan (' + e.skill + ')', 'Repeated ' + e.n + ' times (' + e.skill + ')') }); });
    var rw = strengths('reading').weak[0]; if (rw) out.push({ route: 'mission/practice/reading?type=' + rw.t, title: T("O'qish: " + rw.t, 'Reading: ' + rw.t), why: T(rw.n + ' savoldan aniqlik ' + Math.round(rw.acc * 100) + '%', 'Accuracy ' + Math.round(rw.acc * 100) + '% over ' + rw.n + ' questions') });
    var lw = strengths('listening').weak[0]; if (lw) out.push({ route: 'mission/errors?skill=listening', title: T("Tinglash: xatolarni sabab bo'yicha qayta tinglash", 'Listening: re-listen to misses by reason'), why: T(lw.n + ' ta savolda aniqlik ' + Math.round(lw.acc * 100) + '%', 'Accuracy ' + Math.round(lw.acc * 100) + '% over ' + lw.n + ' questions') });
    var gf = Errors.grammarFocus(); if (gf) out.push({ route: 'mission/run/grammar/' + gf.cat, title: cc(T('Grammatika: ', 'Grammar: '), C().grammarCats[gf.cat] ? C().grammarCats[gf.cat].title : gf.cat), why: T(gf.n + ' ta ochiq xato shu toifada', gf.n + ' open errors in this category') });
    var vs = Vocab.stats(); if (vs.due) out.push({ route: 'mission/vocab', title: T(vs.due + " so'z takrori", vs.due + ' word reviews'), why: T('Takror muddati keldi — kechiktirilsa unutish tezlashadi', 'Review date reached — delaying speeds up forgetting') });
    return out.slice(0, 6);
  }

  /* ====================== SINXRON BIRLASHTIRISH ======================= */
  function newerById(a, b, f) { var out = {}; Object.keys(a || {}).forEach(function (k) { out[k] = a[k]; }); Object.keys(b || {}).forEach(function (k) { if (!out[k] || (f(b[k]) || 0) > (f(out[k]) || 0)) out[k] = b[k]; }); return out; }
  function unionArr(a, b, max) { var m = {}; (a || []).concat(b || []).forEach(function (x) { if (x && x.id) m[x.id] = x; }); var arr = Object.keys(m).map(function (k) { return m[k]; }).sort(function (x, y) { return (x.ts || x.at || 0) > (y.ts || y.at || 0) ? 1 : -1; }); return max ? arr.slice(-max) : arr; }
  function merge(L, R) {
    if (!L || !L.v) return R || L; if (!R || !R.v) return L;
    var out = JSON.parse(JSON.stringify(L));
    out.attempts = unionArr(L.attempts, R.attempts, LIMIT.attempts);
    out.errors = newerById(L.errors, R.errors, function (e) { return e.srs && e.srs.last ? e.srs.last + ':' + (e.n || 0) : e.at; });
    out.writing = newerById(L.writing, R.writing, function (p) { return p.at; });
    out.speaking = newerById(L.speaking, R.speaking, function (s) { return s.ts; });
    out.mocks = unionArr(L.mocks, R.mocks); out.books = unionArr(L.books, R.books);
    out.custom = newerById(L.custom, R.custom, function (c) { return c.at; });
    out.diag = newerById(L.diag, R.diag, function (x) { return x.at; });
    out.vocab = { ptr: (R.vocab && L.vocab && (R.vocab.ptr.u * 1e6 + R.vocab.ptr.s * 1e3 + R.vocab.ptr.i) > (L.vocab.ptr.u * 1e6 + L.vocab.ptr.s * 1e3 + L.vocab.ptr.i)) ? R.vocab.ptr : (L.vocab || {}).ptr,
      items: newerById((L.vocab || {}).items, (R.vocab || {}).items, function (it) { return it.srs ? (it.srs.last || '') + ':' + (it.srs.n || 0) : ''; }) };
    out.days = {};
    Object.keys(L.days || {}).concat(Object.keys(R.days || {})).forEach(function (k) {
      var a = (L.days || {})[k], b = (R.days || {})[k];
      if (!a || !b) { out.days[k] = a || b; return; }
      var base = (a.frozenAt || 0) >= (b.frozenAt || 0) ? a : b;
      out.days[k] = Object.assign({}, base, { tasks: newerById(a.tasks, b.tasks, function (s) { return s.at; }), extra: unionArr(a.extra, b.extra) });
    });
    return out;
  }

  window.Mission = {
    C: C, T: T, cc: cc, Cat: Cat, M: M, save: save, today: today, norm: norm, lev: lev,
    dayIndex: dayIndex, weekOf: weekOf, phaseOf: phaseOf, inMission: inMission, diffDays: diffDays,
    record: record, attempted: attempted, attemptsOf: attemptsOf, profile: profile, strengths: strengths,
    errors: Errors, vocab: Vocab, studio: Studio, speaking: Speaking, results: Results, books: Books,
    build: build, day: day, tasks: Tasks, priorities: priorities, allocate: allocate, budgetFor: budgetFor,
    weekMinutes: weekMinutes, recommend: recommend, merge: merge, ivls: ivls, lastSelfAvg: lastSelfAvg
  };
})();
