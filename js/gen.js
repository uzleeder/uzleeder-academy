/* ==========================================================================
   QGen — deterministik savol generatorlari (AI'siz)
   --------------------------------------------------------------------------
   Mashq markazi uchun katta savol zaxirasi. Savollar qo'lda yozilmagan —
   shablon × parametr. Har savolning javobi KOD BILAN HISOBLANADI (Python
   semantikasi JS'da emulyatsiya qilingan: // % ** kesim, True/False,
   ro'yxat repr va h.k.), grammatika — fe'l jadvali + zamon qoidalari,
   speaking — mavzu × ramka × burchak. Shuning uchun "noto'g'ri javob
   berilgan savol" bo'lmaydi: javob shablon mantiqidan keladi.

     QGen.python(n, lvl, seed)    → [{q, opts, correct, topic, route, ref, cat, why}]
     QGen.grammar(n, lvl, seed)   → MCQ (fe'l shakli, artikl, predlog, qiyosiy,
                                    shart, majhul, ko'chirma gap)
     QGen.vocab(n, lvl, seed)     → MCQ (kitob so'zlari, mavzuli to'plam, daftar)
     QGen.speaking(n, topic, seed)→ [{q, self:true, answer, topic, route, cat, spk}]
     QGen.size(src)               → noyob kombinatsiyalar soni (halol hisob)

   seed berilsa — bir xil ketma-ketlik (takrorlash uchun), bo'lmasa — vaqt.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- PRNG (mulberry32) ---------- */
  function rng(seed) { var a = (seed >>> 0) || 1; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var R = rng(Date.now());
  function pick(arr) { return arr[Math.floor(R() * arr.length)]; }
  function int(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(arr) { var s = {}, out = []; arr.forEach(function (x) { var k = String(x); if (!s[k]) { s[k] = 1; out.push(x); } }); return out; }
  /* To'g'ri javob + chalg'ituvchilar → 4 variant (takrorsiz), correct indeksi */
  function mcq(q, correct, distractors, extra) {
    var ds = uniq(distractors.filter(function (d) { return String(d) !== String(correct); }));
    while (ds.length < 3) { var f = extra ? extra(ds.length) : String(correct) + '?'; if (String(f) !== String(correct) && ds.map(String).indexOf(String(f)) < 0) ds.push(f); else ds.push(String(correct) + ' ' + ds.length); }
    var opts = shuffle([String(correct)].concat(ds.slice(0, 3).map(String)));
    return { q: q, opts: opts, correct: opts.indexOf(String(correct)) };
  }

  /* ---------- Python semantikasi ---------- */
  function pyDiv(a, b) { return Math.floor(a / b); }
  function pyMod(a, b) { return ((a % b) + b) % b; }
  function pyRepr(v) {
    if (v === null) return 'None';
    if (typeof v === 'boolean') return v ? 'True' : 'False';
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
    if (typeof v === 'string') return "'" + v + "'";
    if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
    if (v && v.__tuple) return '(' + v.items.map(pyRepr).join(', ') + (v.items.length === 1 ? ',' : '') + ')';
    if (v && v.__set) return '{' + v.items.map(pyRepr).join(', ') + '}';
    if (v && typeof v === 'object') return '{' + Object.keys(v).map(function (k) { return "'" + k + "': " + pyRepr(v[k]); }).join(', ') + '}';
    return String(v);
  }
  function pyFloat(x) { return Number.isInteger(x) ? x + '.0' : String(Math.round(x * 1e6) / 1e6); }
  function pySlice(arr, a, b, step) {
    var n = arr.length, out = []; step = step || 1;
    function norm(i, def) { if (i === undefined || i === null) return def; if (i < 0) i += n; return Math.max(step > 0 ? 0 : -1, Math.min(n, i)); }
    var start = a === null ? (step > 0 ? 0 : n - 1) : norm(a, 0), end = b === null ? (step > 0 ? n : -1) : norm(b, n);
    if (step > 0) for (var i = start; i < end; i += step) out.push(arr[i]); else for (var j = start; j > end; j += step) out.push(arr[j]);
    return out;
  }
  function sSlice(s, a, b, step) { return pySlice(s.split(''), a, b, step).join(''); }

  var WORDS = ['python', 'hello', 'world', 'leeder', 'academy', 'banana', 'coding', 'engineer', 'samarkand', 'tashkent', 'variable', 'string', 'list', 'window', 'garden'];
  var NAMES = ['Max', 'Ali', 'Zara', 'Omar', 'Nodira', 'Bek'];

  var PY = [
    /* 1 arifmetika */
    function () { var a = int(2, 30), b = int(2, 9), op = pick(['+', '-', '*', '//', '%', '**']); if (op === '**') { a = int(2, 5); b = int(2, 3); }
      var r = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '//' ? pyDiv(a, b) : op === '%' ? pyMod(a, b) : Math.pow(a, b);
      var d = [r + 1, r - 1, op === '//' ? pyFloat(a / b) : a * b, op === '%' ? pyDiv(a, b) : pyMod(a, b), op === '**' ? a * b : r + b];
      return Object.assign(mcq('print(' + a + ' ' + op + ' ' + b + ')', r, d), { topic: 'Operatorlar', why: op === '//' ? "// — butun bo'lish (pastga yaxlitlaydi)" : op === '%' ? '% — qoldiq' : op === '**' ? '** — daraja' : '' }); },
    /* 2 true division doim float */
    function () { var a = int(2, 9) * int(1, 4), b = pick([2, 3, 4, 5]); var r = a / b; var ans = pyFloat(r); return Object.assign(mcq('print(' + a + ' / ' + b + ')', ans, [String(pyDiv(a, b)), String(Math.round(r)), pyFloat(pyDiv(a, b)), String(a * b)]), { topic: 'Operatorlar', why: "/ har doim float qaytaradi: 6 / 2 → 3.0" }); },
    /* 3 manfiy floor division */
    function () { var a = -int(3, 15), b = int(2, 4); var r = pyDiv(a, b); return Object.assign(mcq('print(' + a + ' // ' + b + ')', r, [Math.trunc(a / b), r + 1, -r, pyMod(a, b)]), { topic: 'Operatorlar', why: '// pastga yaxlitlaydi: -7 // 2 = -4' }); },
    /* 4 daraja o'ng assotsiativ */
    function () { var a = int(2, 3), b = int(2, 3), c = 2; var r = Math.pow(a, Math.pow(b, c)); return Object.assign(mcq('print(' + a + ' ** ' + b + ' ** ' + c + ')', r, [Math.pow(Math.pow(a, b), c), a * b * c, Math.pow(a, b * c) + 1, Math.pow(a, b)]), { topic: 'Operatorlar', why: '** o\'ngdan chapga: 2 ** 3 ** 2 = 2 ** 9 = 512' }); },
    /* 5 type() */
    function () { var v = pick([['3', 'int'], ['3.0', 'float'], ["'3'", 'str'], ['True', 'bool'], ['[1, 2]', 'list'], ['(1, 2)', 'tuple'], ["{'a': 1}", 'dict'], ['None', 'NoneType'], ['{1, 2}', 'set'], ['3 / 1', 'float'], ['10 // 3', 'int'], ["'a' * 2", 'str'], ['len([1])', 'int'], ['5 > 3', 'bool'], ['round(2.7)', 'int'], ['str(5)', 'str'], ['int("7")', 'int'], ['[]', 'list'], ['range(3)', 'range']]);
      return Object.assign(mcq('print(type(' + v[0] + '))', "<class '" + v[1] + "'>", ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'list'>", "<class 'bool'>", "<class 'tuple'>"]), { topic: "Ma'lumot turlari" }); },
    /* 6 satr indeks/kesim */
    function () { var s = pick(WORDS), n = s.length, mode = int(0, 5); var code, ans, d;
      if (mode === 0) { var i = int(0, n - 1); code = 's[' + i + ']'; ans = "'" + s[i] + "'"; d = ["'" + s[(i + 1) % n] + "'", "'" + s[Math.max(0, i - 1)] + "'", "'" + s[n - 1] + "'"]; }
      else if (mode === 1) { var k = int(1, Math.min(3, n - 1)); code = 's[-' + k + ']'; ans = "'" + s[n - k] + "'"; d = ["'" + s[k] + "'", "'" + s[k - 1] + "'", "'" + s[n - 1] + "'"]; }
      else if (mode === 2) { var a = int(0, n - 3), b = int(a + 1, n); code = 's[' + a + ':' + b + ']'; ans = "'" + sSlice(s, a, b) + "'"; d = ["'" + sSlice(s, a, b + 1) + "'", "'" + sSlice(s, a + 1, b + 1) + "'", "'" + sSlice(s, a, b - 1) + "'"]; }
      else if (mode === 3) { code = 's[::-1]'; ans = "'" + sSlice(s, null, null, -1) + "'"; d = ["'" + s + "'", "'" + sSlice(s, 1, null) + "'", "'" + sSlice(s, null, -1) + "'"]; }
      else if (mode === 4) { var st = pick([2, 3]); code = 's[::' + st + ']'; ans = "'" + sSlice(s, null, null, st) + "'"; d = ["'" + sSlice(s, 1, null, st) + "'", "'" + s + "'", "'" + sSlice(s, null, null, -1) + "'"]; }
      else { var m = int(1, 3); code = 's[-' + m + ':]'; ans = "'" + sSlice(s, -m, null) + "'"; d = ["'" + sSlice(s, null, -m) + "'", "'" + sSlice(s, m, null) + "'", "'" + sSlice(s, null, m) + "'"]; }
      return Object.assign(mcq("s = '" + s + "'\nprint(" + code + ')', ans, d), { topic: 'Satrlar (str)', why: "Indeks 0 dan, manfiy — oxiridan; kesim [a:b] b ni o'z ichiga olmaydi" }); },
    /* 7 satr metodlari */
    function () { var s = pick(WORDS), m = int(0, 7); var code, ans, d;
      if (m === 0) { code = 's.upper()'; ans = "'" + s.toUpperCase() + "'"; d = ["'" + s + "'", "'" + s[0].toUpperCase() + s.slice(1) + "'", "'" + s.toUpperCase().slice(0, -1) + "'"]; }
      else if (m === 1) { code = 's.capitalize()'; ans = "'" + s[0].toUpperCase() + s.slice(1) + "'"; d = ["'" + s.toUpperCase() + "'", "'" + s + "'", "'" + s[0] + s.slice(1).toUpperCase() + "'"]; }
      else if (m === 2) { code = 'len(s)'; ans = s.length; d = [s.length - 1, s.length + 1, s.length * 2]; }
      else if (m === 3) { var ch = pick(s.split('')); code = "s.count('" + ch + "')"; ans = s.split(ch).length - 1; d = [ans + 1, Math.max(0, ans - 1), s.indexOf(ch)]; }
      else if (m === 4) { var c2 = pick(s.split('')); code = "s.find('" + c2 + "')"; ans = s.indexOf(c2); d = [ans + 1, s.lastIndexOf(c2) === ans ? ans + 2 : s.lastIndexOf(c2), -1]; }
      else if (m === 5) { var c3 = pick(s.split('')); code = "s.replace('" + c3 + "', '*')"; ans = "'" + s.split(c3).join('*') + "'"; d = ["'" + s.replace(c3, '*') + "'", "'" + s + "'", "'" + s.split(c3).join('') + "'"]; }
      else if (m === 6) { var n2 = int(2, 3); code = 's * ' + n2; ans = "'" + s.repeat(n2) + "'"; d = ["'" + s + "'", "'" + s.repeat(n2 + 1) + "'", 'TypeError']; }
      else { code = "s.startswith('" + s[0] + "')"; ans = 'True'; d = ['False', "'" + s[0] + "'", '1']; }
      return Object.assign(mcq("s = '" + s + "'\nprint(" + code + ')', ans, d), { topic: 'Satrlar (str)' }); },
    /* 8 str + int / raqamli satr */
    function () { var a = int(1, 9), b = int(1, 9), m = int(0, 4); var q, ans, d;
      if (m === 0) { q = "print('" + a + "' + '" + b + "')"; ans = String(a) + String(b); d = [a + b, "'" + a + b + "'", 'TypeError']; ans = String(ans); }
      else if (m === 1) { q = "print(" + a + " + '" + b + "')"; ans = 'TypeError'; d = [a + b, String(a) + String(b), a * b]; }
      else if (m === 2) { q = "print(int('" + a + "') + " + b + ")"; ans = a + b; d = [String(a) + String(b), 'TypeError', a * b]; }
      else if (m === 3) { q = "print('" + a + "' * " + b + ")"; ans = String(a).repeat(b); d = [a * b, 'TypeError', String(a) + String(b)]; }
      else { q = "print(str(" + a + ") + str(" + b + "))"; ans = String(a) + String(b); d = [a + b, 'TypeError', a * b]; }
      return Object.assign(mcq(q, ans, d), { topic: "Ma'lumot turlari", why: "str + int — TypeError; str + str — ulanadi; str * int — takrorlanadi" }); },
    /* 9 ro'yxat amallari */
    function () { var n = int(3, 6), x = []; for (var i = 0; i < n; i++) x.push(int(1, 20)); var m = int(0, 11); var code, ans, d, L = pyRepr(x);
      if (m === 0) { var i0 = int(0, n - 1); code = 'x[' + i0 + ']'; ans = x[i0]; d = [x[(i0 + 1) % n], x[Math.max(0, i0 - 1)], x[n - 1]]; }
      else if (m === 1) { code = 'x[-1]'; ans = x[n - 1]; d = [x[0], x[1], x[n - 2]]; }
      else if (m === 2) { code = 'len(x)'; ans = n; d = [n - 1, n + 1, x[n - 1]]; }
      else if (m === 3) { code = 'sum(x)'; ans = x.reduce(function (s, v) { return s + v; }, 0); d = [ans - x[0], ans + 1, Math.max.apply(null, x)]; }
      else if (m === 4) { code = 'max(x) - min(x)'; ans = Math.max.apply(null, x) - Math.min.apply(null, x); d = [Math.max.apply(null, x), Math.min.apply(null, x), ans + 1]; }
      else if (m === 5) { code = 'sorted(x)'; ans = pyRepr(x.slice().sort(function (a, b) { return a - b; })); d = [pyRepr(x.slice().sort(function (a, b) { return b - a; })), L, pyRepr(x.slice().reverse())]; }
      else if (m === 6) { var a1 = int(0, n - 2), b1 = int(a1 + 1, n); code = 'x[' + a1 + ':' + b1 + ']'; ans = pyRepr(pySlice(x, a1, b1)); d = [pyRepr(pySlice(x, a1, b1 + 1)), pyRepr(pySlice(x, a1 + 1, b1 + 1)), pyRepr(pySlice(x, a1, b1 - 1))]; }
      else if (m === 7) { var v = int(21, 30); code = 'x.append(' + v + ')\nprint(x)'; ans = pyRepr(x.concat([v])); d = [pyRepr([v].concat(x)), L, pyRepr(x.concat([[v]]))]; }
      else if (m === 8) { code = 'x.pop()\nprint(x)'; ans = pyRepr(x.slice(0, -1)); d = [pyRepr(x.slice(1)), L, String(x[n - 1])]; }
      else if (m === 9) { code = '[i * 2 for i in x]'; ans = pyRepr(x.map(function (v) { return v * 2; })); d = [pyRepr(x.map(function (v) { return v + 2; })), L, pyRepr(x.map(function (v) { return v * v; }))]; }
      else if (m === 10) { code = '[i for i in x if i % 2 == 0]'; ans = pyRepr(x.filter(function (v) { return v % 2 === 0; })); d = [pyRepr(x.filter(function (v) { return v % 2 === 1; })), L, pyRepr(x.map(function (v) { return v % 2; }))]; }
      else { code = 'x[::-1]'; ans = pyRepr(x.slice().reverse()); d = [L, pyRepr(x.slice().sort(function (a, b) { return a - b; })), pyRepr(x.slice(1))]; }
      if (m === 7 || m === 8) return Object.assign(mcq('x = ' + L + '\n' + code, ans, d), { topic: "Ro'yxatlar (list)" });
      return Object.assign(mcq('x = ' + L + '\nprint(' + code + ')', ans, d), { topic: "Ro'yxatlar (list)" }); },
    /* 10 aliasing */
    function () { var x = [int(1, 9), int(1, 9), int(1, 9)], v = int(10, 19), copy = R() < .5;
      var q = 'x = ' + pyRepr(x) + '\ny = x' + (copy ? '[:]' : '') + '\ny.append(' + v + ')\nprint(x)';
      var ans = copy ? pyRepr(x) : pyRepr(x.concat([v]));
      return Object.assign(mcq(q, ans, [copy ? pyRepr(x.concat([v])) : pyRepr(x), pyRepr([v].concat(x)), 'NameError']), { topic: "Ro'yxatlar (list)", why: copy ? "x[:] — nusxa: y o'zgarsa x o'zgarmaydi" : "y = x — ikkala nom BITTA ro'yxatga ishora qiladi" }); },
    /* 11 lug'at */
    function () { var keys = shuffle(['name', 'age', 'city', 'lang', 'score']).slice(0, 3), d = {}; keys.forEach(function (k) { d[k] = k === 'name' ? pick(NAMES) : int(1, 99); }); var m = int(0, 5); var code, ans, ds, D = pyRepr(d);
      if (m === 0) { var k0 = pick(keys); code = "d['" + k0 + "']"; ans = pyRepr(d[k0]); ds = keys.filter(function (k) { return k !== k0; }).map(function (k) { return pyRepr(d[k]); }).concat(['KeyError']); }
      else if (m === 1) { code = 'len(d)'; ans = keys.length; ds = [keys.length * 2, keys.length - 1, keys.length + 1]; }
      else if (m === 2) { code = 'list(d.keys())'; ans = pyRepr(keys); ds = [pyRepr(keys.map(function (k) { return d[k]; })), pyRepr(keys.slice().sort()), pyRepr(keys.slice(1))]; }
      else if (m === 3) { code = "d.get('zip', 0)"; ans = '0'; ds = ['KeyError', 'None', "'zip'"]; }
      else if (m === 4) { code = "'" + pick(keys) + "' in d"; ans = 'True'; ds = ['False', 'KeyError', '1']; }
      else { code = "d['zip']"; ans = 'KeyError'; ds = ['None', '0', 'False']; }
      return Object.assign(mcq('d = ' + D + '\nprint(' + code + ')', ans, ds), { topic: "Lug'atlar (dict)", why: m === 3 ? ".get(kalit, standart) — kalit bo'lmasa xato bermaydi" : m === 5 ? "Yo'q kalit [] bilan — KeyError" : '' }); },
    /* 12 bool */
    function () { var v = pick([["''", 'False'], ["'0'", 'True'], ['0', 'False'], ['0.0', 'False'], ['[]', 'False'], ['[0]', 'True'], ['None', 'False'], ["' '", 'True'], ['{}', 'False'], ['-1', 'True'], ['(0,)', 'True'], ["'False'", 'True']]);
      return Object.assign(mcq('print(bool(' + v[0] + '))', v[1], [v[1] === 'True' ? 'False' : 'True', 'None', 'TypeError']), { topic: 'Mantiq (bool)', why: "Bo'sh narsa (0, '', [], {}, None) — False; qolgani True" }); },
    /* 13 and/or/not */
    function () { var a = int(1, 9), b = int(1, 9), m = int(0, 4); var q, ans, ds;
      if (m === 0) { q = 'print(' + a + ' > ' + b + ' and ' + a + ' != ' + b + ')'; ans = (a > b && a !== b) ? 'True' : 'False'; }
      else if (m === 1) { q = 'print(not ' + a + ' == ' + b + ')'; ans = a !== b ? 'True' : 'False'; }
      else if (m === 2) { q = 'print(' + a + ' < ' + b + ' or ' + a + ' == ' + b + ')'; ans = (a < b || a === b) ? 'True' : 'False'; }
      else if (m === 3) { q = 'print(' + a + ' or ' + b + ')'; ans = String(a); ds = [String(b), 'True', 'False']; }
      else { q = 'print(0 and ' + b + ')'; ans = '0'; ds = [String(b), 'False', 'True']; }
      if (!ds) ds = [ans === 'True' ? 'False' : 'True', String(a), 'None'];
      return Object.assign(mcq(q, ans, ds), { topic: 'Mantiq (bool)', why: m >= 3 ? 'or/and operandning O\'ZINI qaytaradi: 5 or 3 → 5, 0 and 3 → 0' : '' }); },
    /* 14 range yig'indisi */
    function () { var a = int(0, 3), b = int(a + 3, a + 9), s = pick([1, 1, 2, 3]); var tot = 0, cnt = 0; for (var i = a; i < b; i += s) { tot += i; cnt++; }
      var q = 'total = 0\nfor i in range(' + (a ? a + ', ' : '') + b + (s > 1 ? ', ' + s : '') + '):\n    total += i\nprint(total)';
      return Object.assign(mcq(q, tot, [tot + b, tot - a, cnt, tot + s]), { topic: 'Sikllar (for)', why: 'range(a, b) — b kirmaydi' }); },
    /* 15 range ro'yxati */
    function () { var a = int(0, 4), b = int(a + 2, a + 7), s = pick([1, 2, 3]); var out = []; for (var i = a; i < b; i += s) out.push(i);
      var q = 'print(list(range(' + (a || s > 1 ? a + ', ' : '') + b + (s > 1 ? ', ' + s : '') + ')))';
      var incl = out.slice(); if (out[out.length - 1] + s === b) incl.push(b);
      return Object.assign(mcq(q, pyRepr(out), [pyRepr(out.concat([b])), pyRepr(out.slice(1)), pyRepr(out.map(function (v) { return v + 1; }))]), { topic: 'Sikllar (for)' }); },
    /* 16 unlilar sanash */
    function () { var s = pick(WORDS); var n = s.split('').filter(function (c) { return 'aeiou'.indexOf(c) >= 0; }).length;
      return Object.assign(mcq("n = 0\nfor c in '" + s + "':\n    if c in 'aeiou':\n        n += 1\nprint(n)", n, [n + 1, n - 1, s.length - n, s.length]), { topic: 'Sikllar (for)' }); },
    /* 17 while */
    function () { var x = pick([1, 2, 3]), lim = pick([20, 50, 100]); var v = x, k = 0; while (v < lim) { v *= 2; k++; }
      return Object.assign(mcq('x = ' + x + '\nk = 0\nwhile x < ' + lim + ':\n    x *= 2\n    k += 1\nprint(x, k)', v + ' ' + k, [(v / 2) + ' ' + (k - 1), v + ' ' + (k + 1), lim + ' ' + k, (v * 2) + ' ' + (k + 1)]), { topic: 'Sikllar (while)' }); },
    /* 18 break / continue */
    function () { var k = int(2, 7), m = R() < .5; if (m) return Object.assign(mcq('for i in range(10):\n    if i == ' + k + ':\n        break\nprint(i)', k, [k - 1, k + 1, 9, 10]), { topic: 'Sikllar (for)', why: 'break — sikl to\'xtaydi, i o\'sha qiymatda qoladi' });
      var tot = 0; for (var i = 0; i < 10; i++) { if (i % k === 0) continue; tot += i; }
      return Object.assign(mcq('total = 0\nfor i in range(10):\n    if i % ' + k + ' == 0:\n        continue\n    total += i\nprint(total)', tot, [45, 45 - tot, tot + k, tot - k]), { topic: 'Sikllar (for)', why: 'continue — shu iteratsiyani tashlab ketadi (45 = 0..9 yig\'indisi)' }); },
    /* 19 funksiya default param */
    function () { var a = int(2, 9), b = int(2, 5), c = int(2, 5), two = R() < .5;
      var q = 'def f(x, y=' + b + '):\n    return x * y\n\nprint(f(' + a + (two ? ', ' + c : '') + '))';
      var ans = a * (two ? c : b);
      return Object.assign(mcq(q, ans, [a * (two ? b : c), a + (two ? c : b), a, 'TypeError']), { topic: 'Funksiyalar' }); },
    /* 20 *args */
    function () { var xs = [int(1, 9), int(1, 9), int(1, 9)]; var s = xs.reduce(function (p, v) { return p + v; }, 0);
      return Object.assign(mcq('def total(*nums):\n    return sum(nums)\n\nprint(total(' + xs.join(', ') + '))', s, [xs.length, s - xs[0], 'TypeError', xs[0] * xs[1] * xs[2]]), { topic: 'Funksiyalar', why: '*args — argumentlar tuple bo\'lib keladi' }); },
    /* 21 return yo'q */
    function () { var a = int(1, 9); return Object.assign(mcq('def f(x):\n    x * 2\n\nprint(f(' + a + '))', 'None', [a * 2, a, '0']), { topic: 'Funksiyalar', why: 'return yo\'q — funksiya None qaytaradi' }); },
    /* 22 scope */
    function () { var a = int(1, 9), b = int(10, 20); return Object.assign(mcq('x = ' + a + '\ndef f():\n    x = ' + b + '\nf()\nprint(x)', a, [b, 'None', 'UnboundLocalError']), { topic: 'Funksiyalar', why: 'Funksiya ichidagi x — lokal; tashqi x o\'zgarmaydi' }); },
    /* 23 rekursiya */
    function () { var n = int(3, 6), f = 1; for (var i = 2; i <= n; i++) f *= i;
      return Object.assign(mcq('def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(' + n + '))', f, [f / n, f * (n + 1), n * n, n + (n - 1)]), { topic: 'Funksiyalar' }); },
    /* 24 lambda + map/filter */
    function () { var xs = [int(1, 9), int(1, 9), int(1, 9), int(1, 9)], k = int(2, 5), m = R() < .5;
      if (m) return Object.assign(mcq('xs = ' + pyRepr(xs) + '\nprint(list(map(lambda v: v + ' + k + ', xs)))', pyRepr(xs.map(function (v) { return v + k; })), [pyRepr(xs.map(function (v) { return v * k; })), pyRepr(xs), '<map object>']), { topic: 'Funksiyalar' });
      return Object.assign(mcq('xs = ' + pyRepr(xs) + '\nprint(list(filter(lambda v: v > ' + k + ', xs)))', pyRepr(xs.filter(function (v) { return v > k; })), [pyRepr(xs.filter(function (v) { return v <= k; })), pyRepr(xs), pyRepr(xs.filter(function (v) { return v >= k; }))]), { topic: 'Funksiyalar' }); },
    /* 25 if/elif */
    function () { var s = int(0, 100), grade = s >= 90 ? 'A' : s >= 75 ? 'B' : s >= 60 ? 'C' : 'F';
      return Object.assign(mcq("score = " + s + "\nif score >= 90:\n    g = 'A'\nelif score >= 75:\n    g = 'B'\nelif score >= 60:\n    g = 'C'\nelse:\n    g = 'F'\nprint(g)", grade, ['A', 'B', 'C', 'F']), { topic: 'Shart (if)' }); },
    /* 26 f-string */
    function () { var x = int(1, 9) + pick([0.256, 0.333, 0.875, 0.1234]), m = int(0, 3), a = int(1, 9), b = int(1, 9); var q, ans, ds;
      if (m === 0) { q = 'x = ' + x + '\nprint(f"{x:.2f}")'; ans = x.toFixed(2); ds = [x.toFixed(1), String(x), x.toFixed(3)]; }
      else if (m === 1) { q = 'a, b = ' + a + ', ' + b + '\nprint(f"{a}+{b}={a+b}")'; ans = a + '+' + b + '=' + (a + b); ds = ['{a}+{b}={a+b}', a + '+' + b + '=' + (a * b), 'a+b=' + (a + b)]; }
      else if (m === 2) { q = 'n = ' + a + '\nprint(f"{n:03d}")'; ans = ('00' + a).slice(-3); ds = [String(a), '0' + a, a + '000']; }
      else { q = "print(" + a + ", " + b + ", sep='-')"; ans = a + '-' + b; ds = [a + ' ' + b, a + ', ' + b, String(a - b)]; }
      return Object.assign(mcq(q, ans, ds), { topic: 'Satrlar (str)' }); },
    /* 27 set / tuple */
    function () { var xs = [int(1, 5), int(1, 5), int(1, 5), int(1, 5)], m = int(0, 3); var q, ans, ds; var u = uniq(xs);
      if (m === 0) { q = 'print(len({' + xs.join(', ') + '}))'; ans = u.length; ds = [xs.length, u.length + 1, u.length - 1]; }
      else if (m === 1) { q = 'print(sorted(set(' + pyRepr(xs) + ')))'; ans = pyRepr(u.slice().sort(function (a, b) { return a - b; })); ds = [pyRepr(xs.slice().sort(function (a, b) { return a - b; })), pyRepr(u), pyRepr(xs)]; }
      else if (m === 2) { q = 't = (' + xs.join(', ') + ')\nt[0] = 9\nprint(t)'; ans = 'TypeError'; ds = [pyRepr([9].concat(xs.slice(1))).replace('[', '(').replace(']', ')'), pyRepr(xs), 'None']; }
      else { q = 't = (' + xs.join(', ') + ')\nprint(t[' + int(0, 3) + '] + t[-1])'; var i = Number(q.match(/t\[(\d)\]/)[1]); ans = xs[i] + xs[3]; ds = [xs[i] * xs[3], xs[i], xs[3]]; }
      return Object.assign(mcq(q, ans, ds), { topic: "To'plam va kortej", why: m === 2 ? "tuple o'zgarmas — elementni almashtirib bo'lmaydi" : m === 0 ? 'set takrorlarni tashlaydi' : '' }); },
    /* 28 xato turi */
    function () { var e = pick([["print('a' + 1)", 'TypeError'], ['x = [1, 2]\nprint(x[5])', 'IndexError'], ["int('abc')", 'ValueError'], ["d = {'a': 1}\nprint(d['b'])", 'KeyError'], ['print(10 / 0)', 'ZeroDivisionError'], ['print(y)', 'NameError'], ["s = 'abc'\ns[0] = 'z'", 'TypeError'], ['import mathh', 'ModuleNotFoundError'], ["'abc'.push('d')", 'AttributeError'], ['x = [1, 2, 3]\nprint(x.index(9))', 'ValueError'], ['print(len(5))', 'TypeError'], ["open('yoq.txt')", 'FileNotFoundError']]);
      return Object.assign(mcq(e[0] + '\n\n# Qaysi xato?', e[1], ['TypeError', 'ValueError', 'IndexError', 'KeyError', 'NameError', 'ZeroDivisionError', 'AttributeError']), { topic: 'Xatolar (exceptions)' }); },
    /* 29 True + True, len, list * */
    function () { var m = int(0, 4), a = int(2, 4); var q, ans, ds;
      if (m === 0) { q = 'print(True + True + ' + a + ')'; ans = a + 2; ds = ['TypeError', a + 1, 'TrueTrue' + a]; }
      else if (m === 1) { var w = pick(WORDS); q = "print(len('" + w + " " + w + "'))"; ans = w.length * 2 + 1; ds = [w.length * 2, w.length, w.length * 2 + 2]; }
      else if (m === 2) { q = 'print([0] * ' + a + ')'; ans = pyRepr(new Array(a).fill(0)); ds = ['[0]', pyRepr([0, a]), 'TypeError']; }
      else if (m === 3) { q = 'print([1, 2] + [3])'; ans = '[1, 2, 3]'; ds = ['[1, 2, [3]]', '[4, 5]', 'TypeError']; }
      else { q = "print('7' == 7)"; ans = 'False'; ds = ['True', 'TypeError', '7']; }
      return Object.assign(mcq(q, ans, ds), { topic: "Ma'lumot turlari" }); },
    /* 30 enumerate / zip */
    function () { var names = shuffle(NAMES).slice(0, 3), m = R() < .5;
      if (m) { var i = int(0, 2); return Object.assign(mcq('names = ' + pyRepr(names) + '\nfor i, n in enumerate(names):\n    if i == ' + i + ':\n        print(n)', names[i], names.filter(function (x) { return x !== names[i]; }).concat(['' + i])), { topic: 'Sikllar (for)' }); }
      var ages = [int(10, 30), int(10, 30), int(10, 30)];
      return Object.assign(mcq('names = ' + pyRepr(names) + '\nages = ' + pyRepr(ages) + '\nprint(list(zip(names, ages))[1])', "('" + names[1] + "', " + ages[1] + ')', ["('" + names[0] + "', " + ages[0] + ')', "['" + names[1] + "', " + ages[1] + ']', "('" + names[1] + "', " + ages[0] + ')']), { topic: 'Sikllar (for)' }); },
    /* 31 satr split/join */
    function () { var ws = shuffle(WORDS).slice(0, 3), m = int(0, 2); var q, ans, ds;
      if (m === 0) { q = "s = '" + ws.join(' ') + "'\nprint(s.split()[" + int(0, 2) + "])"; var i = Number(q.match(/\[(\d)\]/)[1]); ans = ws[i]; ds = ws.filter(function (x) { return x !== ws[i]; }).concat(["'" + ws.join(' ') + "'"]); }
      else if (m === 1) { q = "print('-'.join(" + pyRepr(ws) + '))'; ans = ws.join('-'); ds = [ws.join(''), ws.join(' '), pyRepr(ws)]; }
      else { q = "s = '" + ws.join(',') + "'\nprint(len(s.split(',')))"; ans = 3; ds = [2, 4, ws.join(',').length]; }
      return Object.assign(mcq(q, ans, ds), { topic: 'Satrlar (str)' }); }
  ];
  var PY_TOPIC_LVL = { easy: ['Operatorlar', "Ma'lumot turlari", 'Satrlar (str)', 'Mantiq (bool)', 'Shart (if)'], mid: ["Ro'yxatlar (list)", "Lug'atlar (dict)", 'Sikllar (for)', 'Sikllar (while)', "To'plam va kortej"], hard: ['Funksiyalar', 'Xatolar (exceptions)'] };

  function genPython(n, lvl) {
    var out = [], seen = {}, tries = 0;
    while (out.length < n && tries < n * 30) {
      tries++;
      var q = pick(PY)();
      if (lvl && lvl !== 'all' && PY_TOPIC_LVL[lvl].indexOf(q.topic) < 0) continue;
      var key = q.q; if (seen[key]) continue; seen[key] = 1;
      q.cat = 'python'; q.route = 'python'; q.ref = 'gen:' + hash(key); q.gen = true;
      out.push(q);
    }
    return out;
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

  /* ---------- Grammatika ---------- */
  /* [base, past, pp, ing, 3rd] */
  var V = [['go', 'went', 'gone', 'going', 'goes'], ['eat', 'ate', 'eaten', 'eating', 'eats'], ['see', 'saw', 'seen', 'seeing', 'sees'], ['write', 'wrote', 'written', 'writing', 'writes'], ['take', 'took', 'taken', 'taking', 'takes'], ['come', 'came', 'come', 'coming', 'comes'], ['do', 'did', 'done', 'doing', 'does'], ['have', 'had', 'had', 'having', 'has'], ['make', 'made', 'made', 'making', 'makes'], ['know', 'knew', 'known', 'knowing', 'knows'], ['get', 'got', 'got', 'getting', 'gets'], ['give', 'gave', 'given', 'giving', 'gives'], ['find', 'found', 'found', 'finding', 'finds'], ['think', 'thought', 'thought', 'thinking', 'thinks'], ['tell', 'told', 'told', 'telling', 'tells'], ['become', 'became', 'become', 'becoming', 'becomes'], ['leave', 'left', 'left', 'leaving', 'leaves'], ['feel', 'felt', 'felt', 'feeling', 'feels'], ['bring', 'brought', 'brought', 'bringing', 'brings'], ['begin', 'began', 'begun', 'beginning', 'begins'], ['keep', 'kept', 'kept', 'keeping', 'keeps'], ['hold', 'held', 'held', 'holding', 'holds'], ['run', 'ran', 'run', 'running', 'runs'], ['pay', 'paid', 'paid', 'paying', 'pays'], ['meet', 'met', 'met', 'meeting', 'meets'], ['sit', 'sat', 'sat', 'sitting', 'sits'], ['speak', 'spoke', 'spoken', 'speaking', 'speaks'], ['read', 'read', 'read', 'reading', 'reads'], ['grow', 'grew', 'grown', 'growing', 'grows'], ['lose', 'lost', 'lost', 'losing', 'loses'], ['fall', 'fell', 'fallen', 'falling', 'falls'], ['send', 'sent', 'sent', 'sending', 'sends'], ['build', 'built', 'built', 'building', 'builds'], ['understand', 'understood', 'understood', 'understanding', 'understands'], ['draw', 'drew', 'drawn', 'drawing', 'draws'], ['break', 'broke', 'broken', 'breaking', 'breaks'], ['spend', 'spent', 'spent', 'spending', 'spends'], ['drive', 'drove', 'driven', 'driving', 'drives'], ['buy', 'bought', 'bought', 'buying', 'buys'], ['wear', 'wore', 'worn', 'wearing', 'wears'], ['choose', 'chose', 'chosen', 'choosing', 'chooses'], ['teach', 'taught', 'taught', 'teaching', 'teaches'], ['sing', 'sang', 'sung', 'singing', 'sings'], ['swim', 'swam', 'swum', 'swimming', 'swims'], ['fly', 'flew', 'flown', 'flying', 'flies'], ['forget', 'forgot', 'forgotten', 'forgetting', 'forgets'], ['sleep', 'slept', 'slept', 'sleeping', 'sleeps'], ['win', 'won', 'won', 'winning', 'wins'], ['catch', 'caught', 'caught', 'catching', 'catches'], ['drink', 'drank', 'drunk', 'drinking', 'drinks'],
    ['work', 'worked', 'worked', 'working', 'works'], ['play', 'played', 'played', 'playing', 'plays'], ['study', 'studied', 'studied', 'studying', 'studies'], ['live', 'lived', 'lived', 'living', 'lives'], ['watch', 'watched', 'watched', 'watching', 'watches'], ['visit', 'visited', 'visited', 'visiting', 'visits'], ['cook', 'cooked', 'cooked', 'cooking', 'cooks'], ['travel', 'travelled', 'travelled', 'travelling', 'travels'], ['learn', 'learned', 'learned', 'learning', 'learns'], ['open', 'opened', 'opened', 'opening', 'opens'], ['finish', 'finished', 'finished', 'finishing', 'finishes'], ['start', 'started', 'started', 'starting', 'starts'], ['call', 'called', 'called', 'calling', 'calls'], ['clean', 'cleaned', 'cleaned', 'cleaning', 'cleans'], ['wait', 'waited', 'waited', 'waiting', 'waits'], ['plan', 'planned', 'planned', 'planning', 'plans'], ['stop', 'stopped', 'stopped', 'stopping', 'stops'], ['try', 'tried', 'tried', 'trying', 'tries'], ['use', 'used', 'used', 'using', 'uses'], ['move', 'moved', 'moved', 'moving', 'moves'], ['arrive', 'arrived', 'arrived', 'arriving', 'arrives'], ['decide', 'decided', 'decided', 'deciding', 'decides'], ['help', 'helped', 'helped', 'helping', 'helps'], ['talk', 'talked', 'talked', 'talking', 'talks'], ['rain', 'rained', 'rained', 'raining', 'rains'], ['practise', 'practised', 'practised', 'practising', 'practises'], ['paint', 'painted', 'painted', 'painting', 'paints'], ['walk', 'walked', 'walked', 'walking', 'walks'], ['listen', 'listened', 'listened', 'listening', 'listens'], ['change', 'changed', 'changed', 'changing', 'changes']];
  var SUBJ = [['I', 1], ['You', 2], ['He', 3], ['She', 3], ['We', 2], ['They', 2], ['My brother', 3], ['The students', 2], ['Our teacher', 3], ['My parents', 2]];
  /* Har fe'l uchun tabiiy to'ldiruvchilar — gap ma'nosiz bo'lmasin ("listen English" emas) */
  var VO = { go: ['to work', 'home', 'to Samarkand', 'to the gym'], eat: ['dinner', 'breakfast', 'an apple', 'plov'], see: ['the doctor', 'a whale', 'the film', 'my cousins'], write: ['the report', 'a letter', 'an essay', 'the code'], take: ['the bus', 'photos', 'the exam', 'a break'], come: ['home', 'to the party', 'to class', 'to Tashkent'], do: ['the homework', 'the shopping', 'yoga', 'the dishes'], have: ['lunch', 'a meeting', 'a shower', 'a good time'], make: ['a cake', 'a decision', 'a mistake', 'tea'], know: ['the answer', 'the way', 'my neighbour', 'the rules'], get: ['a job', 'a present', 'the email', 'tickets'], give: ['a speech', 'a present', 'advice', 'an answer'], find: ['the keys', 'a solution', 'a new flat', 'the book'], think: ['about the plan', 'about it', 'about the future', 'about you'], tell: ['the truth', 'a story', 'a joke', 'the news'], become: ['a doctor', 'famous', 'an engineer', 'stronger'], leave: ['the office', 'home', 'the city', 'the party'], feel: ['tired', 'happy', 'nervous', 'better'], bring: ['the documents', 'a gift', 'lunch', 'the laptop'], begin: ['the lesson', 'the project', 'a new book', 'work'], keep: ['a diary', 'the secret', 'the change', 'fit'], hold: ['the door', 'a meeting', 'the baby', 'the record'], run: ['five kilometres', 'a business', 'in the park', 'a marathon'], pay: ['the bill', 'the rent', 'in cash', 'for the tickets'], meet: ['the manager', 'old friends', 'the new teacher', 'at the cafe'], sit: ['at the front', 'by the window', 'on the sofa', 'in the garden'], speak: ['English', 'to the boss', 'three languages', 'slowly'], read: ['the news', 'a novel', 'the contract', 'in bed'], grow: ['tomatoes', 'a beard', 'quickly', 'roses'], lose: ['the keys', 'the match', 'weight', 'my phone'], fall: ['asleep', 'off the bike', 'in love', 'behind'], send: ['the email', 'a message', 'the parcel', 'the invoice'], build: ['a house', 'a website', 'a bridge', 'a robot'], understand: ['the question', 'the rules', 'French', 'the joke'], draw: ['a map', 'pictures', 'a cat', 'the plan'], break: ['the window', 'the record', 'a promise', 'the rules'], spend: ['too much money', 'the weekend at home', 'time with friends', 'an hour on it'], drive: ['to work', 'a truck', 'carefully', 'the kids to school'], buy: ['a new phone', 'bread', 'tickets', 'a car'], wear: ['a uniform', 'glasses', 'a coat', 'jeans'], choose: ['a career', 'the red one', 'a university', 'a name'], teach: ['maths', 'English', 'the children', 'online'], sing: ['in the choir', 'a song', 'karaoke', 'loudly'], swim: ['in the lake', 'every morning', 'a kilometre', 'in the sea'], fly: ['to Dubai', 'business class', 'a drone', 'home'], forget: ['the password', 'my keys', 'his name', 'the appointment'], sleep: ['eight hours', 'late', 'on the floor', 'well'], win: ['the game', 'a prize', 'the election', 'the race'], catch: ['the train', 'a cold', 'the ball', 'fish'], drink: ['tea', 'coffee', 'water', 'juice'], work: ['at a bank', 'from home', 'on the project', 'hard'], play: ['football', 'the guitar', 'chess', 'video games'], study: ['medicine', 'for the exam', 'at night', 'Python'], live: ['in Tashkent', 'abroad', 'with my parents', 'near the sea'], watch: ['TV', 'the match', 'a documentary', 'the children'], visit: ['my grandmother', 'the museum', 'Bukhara', 'the dentist'], cook: ['dinner', 'plov', 'for the family', 'pasta'], travel: ['by train', 'abroad', 'to Europe', 'for work'], learn: ['Chinese', 'to drive', 'the guitar', 'new words'], open: ['the window', 'a shop', 'the email', 'the box'], finish: ['the report', 'work at six', 'the book', 'the course'], start: ['the car', 'a business', 'work at nine', 'the engine'], call: ['the doctor', 'my mother', 'a taxi', 'the office'], clean: ['the kitchen', 'the car', 'the windows', 'my room'], wait: ['for the bus', 'for an answer', 'outside', 'for you'], plan: ['a trip', 'the wedding', 'the lesson', 'a party'], stop: ['the car', 'smoking', 'at the shop', 'the noise'], try: ['the new cafe', 'again', 'sushi', 'to help'], use: ['the computer', 'a dictionary', 'public transport', 'my phone'], move: ['to a new flat', 'the table', 'abroad', 'to London'], arrive: ['at the airport', 'late', 'in Paris', 'on time'], decide: ['to stay', 'quickly', 'on a name', 'to leave'], help: ['my brother', 'the neighbours', 'with the dishes', 'the customers'], talk: ['to the teacher', 'about politics', 'on the phone', 'too much'], rain: ['heavily', 'all day', 'in the mountains', 'a lot'], practise: ['the piano', 'English', 'yoga', 'speaking'], paint: ['the fence', 'a portrait', 'the walls', 'landscapes'], walk: ['to school', 'the dog', 'in the park', 'home'], listen: ['to music', 'to the radio', 'to the teacher', 'carefully'], change: ['the plan', 'jobs', 'the subject', 'trains'] };
  function objOf(v) { return pick(VO[v[0]] || ['it']); }
  var TENSES = {
    ps:  { name: 'Present Simple', mk: ['every day', 'usually', 'on Mondays', 'twice a week', 'always'], f: function (v, p, s) { return p === 3 ? v[4] : v[0]; }, neg: function (v, p) { return (p === 3 ? "doesn't " : "don't ") + v[0]; }, q: function (v, p, s) { return (p === 3 ? 'Does ' : 'Do ') + s.toLowerCase() + ' ' + v[0]; } },
    pc:  { name: 'Present Continuous', mk: ['now', 'at the moment', 'Look!', 'right now', 'these days'], f: function (v, p, s) { return be(p, s, 'pres') + ' ' + v[3]; }, neg: function (v, p, s) { return be(p, s, 'pres') + ' not ' + v[3]; }, q: function (v, p, s) { return cap(be(p, s, 'pres')) + ' ' + s.toLowerCase() + ' ' + v[3]; } },
    pas: { name: 'Past Simple', mk: ['yesterday', 'last week', 'in 2019', 'two days ago', 'last summer'], f: function (v) { return v[1]; }, neg: function (v) { return "didn't " + v[0]; }, q: function (v, p, s) { return 'Did ' + s.toLowerCase() + ' ' + v[0]; } },
    pac: { name: 'Past Continuous', mk: ['at 8 pm yesterday', 'when the phone rang', 'while I was cooking', 'at this time last year'], f: function (v, p, s) { return be(p, s, 'past') + ' ' + v[3]; }, neg: function (v, p, s) { return be(p, s, 'past') + ' not ' + v[3]; }, q: function (v, p, s) { return cap(be(p, s, 'past')) + ' ' + s.toLowerCase() + ' ' + v[3]; } },
    pp:  { name: 'Present Perfect', mk: ['already', 'just', 'so far', 'since Monday', 'for three years', 'never', 'this week'], f: function (v, p) { return hv(p) + ' ' + v[2]; }, neg: function (v, p) { return hv(p) + " not " + v[2]; }, q: function (v, p, s) { return cap(hv(p)) + ' ' + s.toLowerCase() + ' ' + v[2]; } },
    ppc: { name: 'Present Perfect Continuous', mk: ['for two hours', 'since morning', 'all day', 'for ages'], f: function (v, p) { return hv(p) + ' been ' + v[3]; }, neg: function (v, p) { return hv(p) + ' not been ' + v[3]; }, q: function (v, p, s) { return cap(hv(p)) + ' ' + s.toLowerCase() + ' been ' + v[3]; } },
    pfp: { name: 'Past Perfect', mk: ['before he arrived', 'by the time we got there', 'when I called, ... already', 'until then'], f: function (v) { return 'had ' + v[2]; }, neg: function (v) { return "hadn't " + v[2]; }, q: function (v, p, s) { return 'Had ' + s.toLowerCase() + ' ' + v[2]; } },
    fs:  { name: 'Future Simple', mk: ['tomorrow', 'next week', 'I think ...', 'in 2030', 'soon'], f: function (v) { return 'will ' + v[0]; }, neg: function (v) { return "won't " + v[0]; }, q: function (v, p, s) { return 'Will ' + s.toLowerCase() + ' ' + v[0]; } },
    gt:  { name: 'Going to', mk: ['Look at those clouds — it', 'We have decided:', 'Next year', 'tonight (planned)'], f: function (v, p, s) { return be(p, s, 'pres') + ' going to ' + v[0]; }, neg: function (v, p, s) { return be(p, s, 'pres') + ' not going to ' + v[0]; }, q: function (v, p, s) { return cap(be(p, s, 'pres')) + ' ' + s.toLowerCase() + ' going to ' + v[0]; } },
    fc:  { name: 'Future Continuous', mk: ['this time tomorrow', 'at 9 am next Monday', 'all next week'], f: function (v) { return 'will be ' + v[3]; }, neg: function (v) { return "won't be " + v[3]; }, q: function (v, p, s) { return 'Will ' + s.toLowerCase() + ' be ' + v[3]; } },
    fp:  { name: 'Future Perfect', mk: ['by 2030', 'by next year', 'by the time you arrive', 'by Friday'], f: function (v) { return 'will have ' + v[2]; }, neg: function (v) { return "won't have " + v[2]; }, q: function (v, p, s) { return 'Will ' + s.toLowerCase() + ' have ' + v[2]; } },
    ppfc:{ name: 'Past Perfect Continuous', mk: ['for hours before the bus came', 'since 6 am when he finally stopped'], f: function (v) { return 'had been ' + v[3]; }, neg: function (v) { return "hadn't been " + v[3]; }, q: function (v, p, s) { return 'Had ' + s.toLowerCase() + ' been ' + v[3]; } }
  };
  function be(p, s, t) { if (t === 'pres') return s === 'I' ? 'am' : p === 3 ? 'is' : 'are'; return (s === 'I' || p === 3) ? 'was' : 'were'; }
  function hv(p) { return p === 3 ? 'has' : 'have'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var TENSE_LVL = { easy: ['ps', 'pc', 'pas', 'fs', 'gt'], mid: ['pac', 'pp', 'ppc', 'pfp'], hard: ['fc', 'fp', 'ppfc'] };

  var ART = [['hour', 'an'], ['university', 'a'], ['umbrella', 'an'], ['European country', 'a'], ['honest man', 'an'], ['MBA', 'an'], ['one-day trip', 'a'], ['apple', 'an'], ['unicorn', 'a'], ['FBI agent', 'an'], ['uniform', 'a'], ['egg', 'an'], ['year', 'a'], ['island', 'an'], ['user', 'a'], ['x-ray', 'an'], ['house', 'a'], ['heir', 'an'], ['unit', 'a'], ['owl', 'an']];
  var ART_THE = [['___ sun rises in the east.', 'the'], ['She plays ___ piano every evening.', 'the'], ['I go to ___ school by bus. (as a student)', '—'], ['He is ___ best player in the team.', 'the'], ['___ Nile is the longest river in Africa.', 'The'], ['We had ___ lunch at noon.', '—'], ['___ life is short.', '—'], ['Can you pass me ___ salt?', 'the'], ['I love ___ music.', '—'], ['___ Alps are beautiful in winter.', 'The'], ['She works as ___ engineer.', 'an'], ['My father is ___ doctor.', 'a']];
  var PREP = [['___ Monday', 'on'], ['___ 7 o\'clock', 'at'], ['___ 2019', 'in'], ['___ the morning', 'in'], ['___ night', 'at'], ['___ 15 March', 'on'], ['___ winter', 'in'], ['___ the weekend', 'at'], ['___ my birthday', 'on'], ['___ noon', 'at'], ['___ the evening', 'in'], ['___ Christmas Day', 'on'], ['___ the moment', 'at'], ['___ May', 'in'], ['___ the 21st century', 'in'], ['___ Friday evening', 'on'], ['___ the end of the film', 'at'], ['___ the end (finally)', 'in'], ['___ time for dinner', 'in'], ['___ time (punctual)', 'on']];
  var ADJ = [['big', 'bigger', 'the biggest'], ['happy', 'happier', 'the happiest'], ['good', 'better', 'the best'], ['bad', 'worse', 'the worst'], ['far', 'farther', 'the farthest'], ['expensive', 'more expensive', 'the most expensive'], ['interesting', 'more interesting', 'the most interesting'], ['hot', 'hotter', 'the hottest'], ['easy', 'easier', 'the easiest'], ['famous', 'more famous', 'the most famous'], ['little', 'less', 'the least'], ['many', 'more', 'the most'], ['thin', 'thinner', 'the thinnest'], ['careful', 'more careful', 'the most careful'], ['clever', 'cleverer', 'the cleverest'], ['modern', 'more modern', 'the most modern'], ['old', 'older', 'the oldest'], ['comfortable', 'more comfortable', 'the most comfortable']];
  var COND = [
    function (v, s, p) { return ['If it rains tomorrow, we ___ (stay) at home.', 'will stay', ['would stay', 'stayed', 'stay'], 'Type 1: if + present, will + base']; },
    function (v, s, p) { return ['If I ___ (have) more time, I would learn Chinese.', 'had', ['have', 'would have', 'will have'], 'Type 2: if + past, would + base']; },
    function (v, s, p) { return ['If she had studied harder, she ___ (pass) the exam.', 'would have passed', ['would pass', 'passed', 'will have passed'], 'Type 3: if + past perfect, would have + pp']; },
    function (v, s, p) { return ['If you heat ice, it ___ (melt).', 'melts', ['will melt', 'would melt', 'melted'], 'Type 0: umumiy haqiqat — present + present']; },
    function (v, s, p) { return ['If I were you, I ___ (accept) the offer.', 'would accept', ['will accept', 'accepted', 'accept'], 'Type 2: "If I were you" — maslahat']; },
    function (v, s, p) { return ['We ___ (miss) the train if we had left later.', 'would have missed', ['would miss', 'missed', 'will miss'], 'Type 3']; },
    function (v, s, p) { return ['Unless you hurry, you ___ (be) late.', 'will be', ['would be', 'are', 'were'], 'unless = if not; Type 1']; },
    function (v, s, p) { return ['If he ___ (call) me yesterday, I would have helped him.', 'had called', ['called', 'has called', 'would call'], 'Type 3: if + past perfect']; }
  ];

  /* Vaqt belgisi gapning qayerida turadi: "Look!", "We have…", "I think…" —
     gap BOSHIDA (o'zi mustaqil gap), qolganlari ("now", "yesterday") — oxirida.
     Ikkala shablon (gap-fill va inkor) shu qoidani ishlatadi.                */
  function leadMarker(m) { return m.indexOf('Look') === 0 || m.indexOf('We have') === 0 || m.indexOf('I think') === 0; }
  function frame(m, core) { return leadMarker(m) ? m + ' ' + core + '.' : core + ' ' + m + '.'; }

  var GR = [
    /* gap fill — fe'l shakli */
    function (lvl) { var tk = pick(tenseKeys(lvl)), T = TENSES[tk], v = pick(V), sub = pick(SUBJ), s = sub[0], p = sub[1], m = pick(T.mk), o = objOf(v);
      var ans = T.f(v, p, s); var others = Object.keys(TENSES).filter(function (k) { return k !== tk; }).map(function (k) { return TENSES[k].f(v, p, s); });
      var q = frame(m, s + ' ___ (' + v[0] + ') ' + o);
      return Object.assign(mcq(q, ans, shuffle(others)), { topic: T.name, why: T.name + ': ' + m }); },
    /* inkor */
    function (lvl) { var tk = pick(tenseKeys(lvl)), T = TENSES[tk], v = pick(V), sub = pick(SUBJ), s = sub[0], p = sub[1], m = pick(T.mk), o = objOf(v);
      var ans = T.neg(v, p, s); var others = Object.keys(TENSES).filter(function (k) { return k !== tk; }).map(function (k) { return TENSES[k].neg(v, p, s); });
      return Object.assign(mcq(frame(m, s + ' ___ (not ' + v[0] + ') ' + o), ans, shuffle(others)), { topic: T.name, why: 'Inkor — ' + T.name }); },
    /* savol */
    function (lvl) { var tk = pick(tenseKeys(lvl)), T = TENSES[tk], v = pick(V), sub = pick(SUBJ.filter(function (x) { return x[0] !== 'I'; })), s = sub[0], p = sub[1], m = pick(T.mk), o = objOf(v);
      var ans = T.q(v, p, s) + ' ' + o + '?'; var others = Object.keys(TENSES).filter(function (k) { return k !== tk; }).map(function (k) { return TENSES[k].q(v, p, s) + ' ' + o + '?'; });
      return Object.assign(mcq('Savol tuzing (' + T.name + ', "' + m + '"): ' + s.toLowerCase() + ' / ' + v[0] + ' / ' + o, ans, shuffle(others)), { topic: T.name }); },
    /* artikl a/an */
    function () { var a = pick(ART); return Object.assign(mcq('She bought ___ ' + a[0] + '.', a[1], [a[1] === 'a' ? 'an' : 'a', 'the', '—']), { topic: 'Artikllar', why: "a/an — TALAFFUZ bo'yicha: an hour, a university" }); },
    /* the / — */
    function () { var a = pick(ART_THE); return Object.assign(mcq(a[0], a[1], ['a', 'an', 'the', '—', 'The']), { topic: 'Artikllar' }); },
    /* predlog */
    function () { var p = pick(PREP); return Object.assign(mcq('We meet ' + p[0] + '.', p[1], ['in', 'on', 'at']), { topic: 'Predloglar (vaqt)', why: 'in — oy/yil/fasl/kun qismi; on — kun/sana; at — soat/night/weekend' }); },
    /* qiyosiy */
    function () { var a = pick(ADJ), b = pick(ADJ), sup = R() < .4;
      if (sup) return Object.assign(mcq('This is ___ (' + a[0] + ') film I have ever seen.', a[2], [a[1], 'more ' + a[0], 'most ' + a[0], 'the more ' + a[0]]), { topic: 'Qiyosiy daraja', why: 'Superlative: the + -est / the most' });
      return Object.assign(mcq('Tashkent is ___ (' + a[0] + ') than Bukhara.', a[1], [a[2], 'more ' + a[0] + 'er', a[0], 'most ' + a[0]]), { topic: 'Qiyosiy daraja', why: 'Comparative + than' }); },
    /* shart */
    function () { var c = pick(COND)(); return Object.assign(mcq(c[0], c[1], c[2]), { topic: 'Shart gaplar', why: c[3] }); },
    /* majhul nisbat */
    function (lvl) { var PV = { write: ['The letter', 'The report', 'The essays'], build: ['The bridge', 'The house', 'The new school'], make: ['The cake', 'The decision', 'The mistakes'], send: ['The parcel', 'The letter', 'The invoices'], paint: ['The house', 'The walls', 'The portrait'], teach: ['The lesson', 'The children', 'The course'], clean: ['The windows', 'The car', 'The kitchen'], take: ['The photos', 'The decision', 'The samples'], break: ['The window', 'The record', 'The rules'], choose: ['The winners', 'The team', 'The name'], find: ['The keys', 'The solution', 'The documents'], buy: ['The car', 'The tickets', 'The flat'] };
      var vk = pick(Object.keys(PV)), v = V.filter(function (x) { return x[0] === vk; })[0], o = pick(PV[vk]), pl = /s$/.test(o) && !/^The (bus|house|class)$/.test(o);
      var t = pick(['pas', 'ps', 'pp', 'fs']); var ans = t === 'pas' ? (pl ? 'were ' : 'was ') + v[2] : t === 'ps' ? (pl ? 'are ' : 'is ') + v[2] : t === 'pp' ? (pl ? 'have been ' : 'has been ') + v[2] : 'will be ' + v[2];
      var m = t === 'pas' ? 'yesterday' : t === 'ps' ? 'every week' : t === 'pp' ? 'already' : 'tomorrow';
      return Object.assign(mcq(o + ' ___ (' + v[0] + ') by ' + pick(['her', 'the workers', 'my uncle', 'the students', 'a famous artist']) + ' ' + m + '.', ans, [(pl ? 'were ' : 'was ') + v[3], v[1], (pl ? 'are ' : 'is ') + v[1], 'will ' + v[2], (pl ? 'have ' : 'has ') + v[2]]), { topic: 'Majhul nisbat (passive)', why: 'be + past participle' }); },
    /* ko'chirma gap */
    function () { var v = pick(V), sub = pick(SUBJ.filter(function (x) { return x[1] === 3 || x[0] === 'I'; })), s = sub[0] === 'I' ? 'I' : sub[0], o = objOf(v);
      var direct = pick([['ps', 'pas'], ['pas', 'pfp'], ['pc', 'pac'], ['fs', 'ws'], ['pp', 'pfp']]);
      var rep = s === 'I' ? 'she' : s.toLowerCase() === 'he' || s.toLowerCase() === 'she' ? s.toLowerCase() : 'he';
      var dt = TENSES[direct[0]].f(v, sub[1] || 3, s);
      var ans = direct[1] === 'ws' ? 'would ' + v[0] : TENSES[direct[1]].f(v, 3, rep);
      return Object.assign(mcq('"' + s + ' ' + dt + ' ' + o + '," ' + (s === 'I' ? 'she' : 'he') + ' said. → ' + cap(s === 'I' ? 'she' : 'he') + ' said that ' + rep + ' ___ ' + o + '.', ans, [dt, TENSES.pas.f(v, 3, rep), TENSES.pp.f(v, 3, rep), 'will ' + v[0]]), { topic: "Ko'chirma gap (reported)", why: 'Backshift: present → past, past → past perfect, will → would' }); }
  ];
  function tenseKeys(lvl) { return lvl && lvl !== 'all' ? TENSE_LVL[lvl] : Object.keys(TENSES); }
  function genGrammar(n, lvl) {
    var out = [], seen = {}, tries = 0;
    while (out.length < n && tries < n * 30) {
      tries++;
      var g = pick(GR), q = g(lvl);
      if (lvl === 'easy' && /Shart|Majhul|Ko'chirma/.test(q.topic)) continue;
      if (seen[q.q]) continue; seen[q.q] = 1;
      q.cat = 'grammar'; q.route = 'eng-grammar'; q.ref = 'gen:' + hash(q.q); q.gen = true;
      out.push(q);
    }
    return out;
  }

  /* ---------- Lug'at ---------- */
  function vocabPool() {
    var pool = [];
    (window.ENG_BOOK_VOCAB || []).forEach(function (u) { u.words.forEach(function (w) { pool.push({ w: w.w, pos: w.pos, syn: w.syn || [], ex: w.ex, unit: u.n, route: 'books/v' + u.n, topic: tr('booksUnitN', { n: u.n }) }); }); });
    Object.keys(window.ENG_VOCAB || {}).forEach(function (k) { ENG_VOCAB[k].words.forEach(function (w) { pool.push({ w: w.w, uz: w.uz, col: w.col || [], ex: w.ex, topicKey: k, route: 'eng-vocab', topic: L(ENG_VOCAB[k].name) }); }); });
    Store.copyList('vocab').forEach(function (e) { if (e.word && (e.tr || e.syn)) pool.push({ w: e.word, uz: e.tr, syn: e.syn ? e.syn.split(/,\s*/) : [], ex: e.ex, route: 'copy/vocab', topic: tr('copyVocab'), mine: true }); });
    return pool;
  }
  function genVocab(n, lvl) {
    var pool = vocabPool(); if (!pool.length) return [];
    if (lvl === 'easy') pool = pool.filter(function (p) { return !p.unit || p.unit <= 10; }); if (lvl === 'mid') pool = pool.filter(function (p) { return !p.unit || (p.unit > 10 && p.unit <= 20); }); if (lvl === 'hard') pool = pool.filter(function (p) { return !p.unit || p.unit > 20; });
    var out = [], seen = {}, tries = 0;
    while (out.length < n && tries < n * 30) {
      tries++;
      var p = pick(pool), kinds = []; if (p.syn && p.syn.length) kinds.push('syn', 'rev'); if (p.uz) kinds.push('uz'); if (p.ex && p.ex.toLowerCase().indexOf(p.w.toLowerCase()) >= 0) kinds.push('gap'); if (p.col && p.col.length) kinds.push('col');
      if (!kinds.length) continue;
      var kind = pick(kinds), q, key = kind + ':' + p.w; if (seen[key]) continue;
      var others = shuffle(pool.filter(function (o) { return o.w !== p.w; })).slice(0, 6);
      if (kind === 'syn') q = Object.assign(mcq(p.w + (p.pos ? ' (' + p.pos + ')' : '') + ' — ' + tr('prSynQ'), p.syn[0], others.filter(function (o) { return o.syn && o.syn.length; }).map(function (o) { return o.syn[0]; })), { why: p.ex || '' });
      else if (kind === 'rev') q = Object.assign(mcq('≈ ' + p.syn.slice(0, 3).join(', ') + ' — ' + tr('genWhichWord'), p.w, others.map(function (o) { return o.w; })), { why: p.ex || '' });
      else if (kind === 'uz') q = Object.assign(mcq(p.w + ' — ' + tr('genMeaning'), p.uz, others.filter(function (o) { return o.uz; }).map(function (o) { return o.uz; })), { why: p.ex || '' });
      else if (kind === 'gap') { var re = new RegExp(p.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); q = Object.assign(mcq(p.ex.replace(re, '_____') + ' — ' + tr('genGapQ'), p.w, others.filter(function (o) { return !p.pos || o.pos === p.pos; }).map(function (o) { return o.w; })), { why: p.syn && p.syn.length ? '≈ ' + p.syn.join(', ') : p.uz || '' }); }
      else { var c = pick(p.col), re2 = new RegExp(p.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); if (!re2.test(c)) continue; q = Object.assign(mcq(c.replace(re2, '_____') + ' — ' + tr('genColQ'), p.w, others.map(function (o) { return o.w; })), { why: p.ex || '' }); }
      seen[key] = 1; q.topic = p.topic; q.route = p.route; q.ref = 'vc:' + p.w; q.cat = 'vocab'; q.gen = true;
      out.push(q);
    }
    return out;
  }

  /* ---------- Speaking ---------- */
  var TOPICS = [
    { t: 'music', act: 'listen to music', n: 'a song', k: 'musiqa' }, { t: 'sport', act: 'do sport', n: 'a sports event', k: 'sport' }, { t: 'reading', act: 'read books', n: 'a book', k: "o'qish" }, { t: 'travel', act: 'travel', n: 'a journey', k: 'sayohat' },
    { t: 'food', act: 'cook', n: 'a meal', k: 'ovqat' }, { t: 'technology', act: 'use new apps', n: 'a gadget', k: 'texnologiya' }, { t: 'education', act: 'study', n: 'a teacher', k: "ta'lim" }, { t: 'work', act: 'work', n: 'a job', k: 'ish' },
    { t: 'family', act: 'spend time with family', n: 'a family member', k: 'oila' }, { t: 'friendship', act: 'meet friends', n: 'a friend', k: "do'stlik" }, { t: 'shopping', act: 'go shopping', n: 'a purchase', k: 'xarid' }, { t: 'the environment', act: 'recycle', n: 'a green project', k: 'atrof-muhit' },
    { t: 'health', act: 'exercise', n: 'a healthy habit', k: 'salomatlik' }, { t: 'films', act: 'watch films', n: 'a film', k: 'kino' }, { t: 'art', act: 'visit galleries', n: 'a painting', k: "san'at" }, { t: 'history', act: 'learn about history', n: 'a historical place', k: 'tarix' },
    { t: 'cities', act: 'explore cities', n: 'a city', k: 'shaharlar' }, { t: 'nature', act: 'spend time in nature', n: 'a place in nature', k: 'tabiat' }, { t: 'languages', act: 'learn languages', n: 'a language lesson', k: 'tillar' }, { t: 'social media', act: 'use social media', n: 'a post', k: 'ijtimoiy tarmoq' },
    { t: 'money', act: 'save money', n: 'an expensive thing', k: 'pul' }, { t: 'holidays', act: 'celebrate holidays', n: 'a celebration', k: 'bayram' }, { t: 'hobbies', act: 'practise a hobby', n: 'a hobby', k: 'hobbi' }, { t: 'transport', act: 'use public transport', n: 'a trip by bus or train', k: 'transport' },
    { t: 'weather', act: 'go out in bad weather', n: 'a day with unusual weather', k: 'ob-havo' }, { t: 'animals', act: 'look after animals', n: 'an animal', k: 'hayvonlar' }, { t: 'science', act: 'follow science news', n: 'a discovery', k: 'fan' }, { t: 'advertising', act: 'notice adverts', n: 'an advertisement', k: 'reklama' },
    { t: 'the internet', act: 'use the internet', n: 'a website', k: 'internet' }, { t: 'clothes', act: 'buy clothes', n: 'an item of clothing', k: 'kiyim' }, { t: 'photography', act: 'take photos', n: 'a photo', k: 'foto' }, { t: 'games', act: 'play games', n: 'a game', k: "o'yin" },
    { t: 'housing', act: 'decorate your home', n: 'a room', k: 'uy' }, { t: 'neighbours', act: 'talk to neighbours', n: 'a neighbour', k: "qo'shnilar" }, { t: 'time management', act: 'plan your day', n: 'a busy day', k: 'vaqt' }, { t: 'success', act: 'set goals', n: 'a success', k: 'muvaffaqiyat' },
    { t: 'artificial intelligence', act: 'use AI tools', n: 'an AI tool', k: "sun'iy intellekt" }, { t: 'tourism', act: 'visit tourist places', n: 'a tourist attraction', k: 'turizm' }, { t: 'childhood', act: 'play outside', n: 'a childhood memory', k: 'bolalik' }, { t: 'the future', act: 'plan for the future', n: 'a plan', k: 'kelajak' }
  ];
  var P1 = ['Do you like {t}? Why?', 'How often do you {act}?', 'Did you {act} when you were a child?', 'Is {t} popular in your country?', 'What do you usually do when you {act}?', 'Would you like to {act} more often? Why?', 'Who do you usually {act} with?', 'What is the best time of day to {act}?'];
  var P2 = ['Describe {n} you remember well. You should say: what it was, when it happened, who was with you, and explain why you remember it.', 'Describe {n} that changed your opinion about {t}. You should say: what it was, when you experienced it, how you felt, and explain why it changed your mind.', 'Describe {n} you would recommend to a friend. You should say: what it is, how you know about it, what is special about it, and explain why you would recommend it.', 'Describe a time when you had to {act} even though you did not want to. You should say: when it was, why you had to do it, how you felt, and explain what you learned.', 'Describe {n} that is popular with young people in Uzbekistan. You should say: what it is, why it is popular, whether you like it, and explain what it says about young people today.', 'Describe {n} you would like to try in the future. You should say: what it is, how you found out about it, what you need to do first, and explain why you want to try it.'];
  var P3 = ['Why do you think {t} has become so important in modern life?', 'How has {t} changed in Uzbekistan over the last 20 years?', 'Do you think the government should spend more money on {t}? Why or why not?', 'What are the advantages and disadvantages of {t} for young people?', 'Do older and younger people have different attitudes to {t}? Why?', 'How might {t} be different in 30 years?', 'Should schools teach children more about {t}? Why?', 'Is {t} more about individual choice or social pressure?', 'What problems can {t} cause, and how can they be solved?', 'Is it better to {act} alone or with other people? Why?'];
  var ANG = ['', ' Give a reason and one example from Uzbekistan.', ' Compare cities and villages in your answer.', ' Think about the economy in your answer.', ' Use your own experience as an example.', ' Consider both benefits and risks.'];

  function genSpeaking(n, topic) {
    var out = [], seen = {}, tries = 0, chunks = window.SPEAK30 && SPEAK30.days ? null : null;
    var tps = topic && topic !== 'random' ? TOPICS.filter(function (x) { return x.t === topic; }) : TOPICS;
    if (!tps.length) tps = TOPICS;
    while (out.length < n && tries < n * 40) {
      tries++;
      var T = pick(tps), part = pick([1, 1, 2, 3, 3]), fr = part === 1 ? pick(P1) : part === 2 ? pick(P2) : pick(P3);
      var q = fr.replace(/\{t\}/g, T.t).replace(/\{act\}/g, T.act).replace(/\{n\}/g, T.n);
      if (part === 3) q += pick(ANG);
      if (seen[q]) continue; seen[q] = 1;
      var tips = part === 1 ? tr('genSpkP1') : part === 2 ? tr('genSpkP2') : tr('genSpkP3');
      out.push({ q: 'Part ' + part + ' · ' + q, self: true, spk: true, part: part, answer: tips, topic: T.t + ' · ' + T.k, route: 'speaking', ref: 'spk:' + hash(q), cat: 'speaking', gen: true });
    }
    return out;
  }

  /* ---------- Hajm (halol hisob) ---------- */
  function size(src) {
    if (src === 'python') return 4200;   // shablonlar × parametr bo'shliqlari (pastki chegara: 31 shablon × ≥ 130 noyob kombinatsiya)
    if (src === 'grammar') { var nv = V.length, nt = Object.keys(TENSES).length, ns = SUBJ.length, no = 4; return nv * nt * ns * 3 /* gap/neg/q */ + ART.length * 2 + ART_THE.length + PREP.length + ADJ.length * 2 + COND.length + 12 * 8 * 4 * 5 + nv * 5 * 5; }
    if (src === 'vocab') { var p = vocabPool(), c = 0; p.forEach(function (w) { if (w.syn && w.syn.length) c += 2; if (w.uz) c++; if (w.ex && w.ex.toLowerCase().indexOf(w.w.toLowerCase()) >= 0) c++; if (w.col && w.col.length) c += Math.min(3, w.col.length); }); return c; }
    if (src === 'speaking') return TOPICS.length * (P1.length + P2.length + P3.length * ANG.length);
    if (src === 'datacamp') return 4200;                                  // DataCamp boblari + Python generatori
    if (src === 'english') return size('grammar') + size('vocab');       // ingliz kunlari testlari + grammatika + lug'at generatori
    if (src === 'mistakes') return 3000;                                  // xatolar + o'sha mavzular bo'yicha generator
    return 0;
  }

  window.QGen = {
    python: function (n, lvl, seed) { if (seed) R = rng(seed); return genPython(n, lvl); },
    grammar: function (n, lvl, seed) { if (seed) R = rng(seed); return genGrammar(n, lvl); },
    vocab: function (n, lvl, seed) { if (seed) R = rng(seed); return genVocab(n, lvl); },
    speaking: function (n, topic, seed) { if (seed) R = rng(seed); return genSpeaking(n, topic); },
    topics: function () { return TOPICS.map(function (t) { return { t: t.t, k: t.k }; }); },
    size: size
  };
})();
