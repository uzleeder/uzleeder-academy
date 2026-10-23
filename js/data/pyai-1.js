/* ==========================================================================
   PYAI — Python & AI Engineering Career Path (1-qism)
   --------------------------------------------------------------------------
   Tarkib: kurs sozlamasi, eski kursdan migratsiya xaritasi (legacyMap),
   Modul 0 (diagnostika va sozlash), Modul 1 (Python Core — ESKI 30 DARS
   asosida yaxshilangan; eski darslar o'zgarmagan, #/lesson/N da turibdi).
   Qolgan modullar: pyai-2.js, pyai-3.js (PYAI_ADD orqali qo'shiladi).

   Dars sxemasi:
     { id, module, title, legacy:[eski kun], goal, prereq:[id], concept,
       terms:[[en, uz]], analogy?, example:{code, walk:[[satr, izoh]]},
       predict:{code, opts, a, why}, mistake:{bad, good, why},
       guided: EX, independent: EX, debug: EX, check:[MCQ], real, summary:[], exit:[MCQ] }
     EX  = { id, prompt, starter, tests:[[nom, kod]], solution, hints:[h1, h2], level, pkgs? }
     MCQ = { q, opts, a, why }
   Kod mashqlari Pyodide (brauzerda) bilan tekshiriladi; yechimlar
   tools/pyai-test.cjs da haqiqiy CPython bilan ham sinovdan o'tkaziladi.
   ========================================================================== */
(function () {
  'use strict';
  var D = function (s) { return String(s).replace(/^\n/, '').replace(/\s+$/, '') + '\n'; };
  var T = function (uz, en) { return { uz: uz, en: en }; };

  window.PYAI = {
    version: 1,
    meta: {
      title: T('Python & AI Engineering Career Path', 'Python & AI Engineering Career Path'),
      subtitle: T("Python asoslaridan ishonchli AI ilovalarigacha.", 'From Python fundamentals to reliable AI-powered applications.'),
      lede: T("O'zbekcha tushuntirish + inglizcha atamalar. Har dars: maqsad → tushuncha → misol → oldindan taxmin → yo'naltirilgan mashq → mustaqil mashq → xatoni tuzatish → tekshiruv → takror. Kod brauzeringizda Pyodide bilan tekshiriladi.", 'Uzbek explanations with English terms. Every lesson: goal → concept → example → predict → guided practice → independent practice → debugging → check → review. Code is checked in your browser with Pyodide.'),
      honest: T("Bu kurs rasmiy sertifikat, ish kafolati yoki maosh va'dasi bermaydi. Natija — siz yozgan, testlangan va hujjatlangan loyihalar.", 'This course gives no official certificate, job guarantee or salary promise. The outcome is projects you wrote, tested and documented.'),
      outcomes: [
        T("Python'da toza, testlangan funksiya va modullar yozish", 'Write clean, tested Python functions and modules'),
        T('Git, virtual muhit, testlar va logging bilan ishlash', 'Work with Git, virtual environments, tests and logging'),
        T("HTTP API, SQL va JSON/CSV ma'lumotlari bilan ilova qurish", 'Build applications with HTTP APIs, SQL and JSON/CSV data'),
        T("pandas bilan ma'lumotni tozalash va tahlil qilish", 'Clean and analyse data with pandas'),
        T("AI model API'larini xavfsiz, ishonchli va o'lchanadigan tarzda ishlatish", 'Use AI model APIs safely, reliably and measurably'),
        T("RAG (retrieval) va tool-calling ish oqimlarini qurish va baholash", 'Build and evaluate RAG (retrieval) and tool-calling workflows'),
        T('Portfolio: README, testlar, xavfsizlik ko\'rigi bilan 5 loyiha + yakuniy capstone', 'Portfolio: 5 projects + a capstone with README, tests and a security review')
      ]
    },
    /* Barcha qoidalar shu yerda — kod ichiga tarqatilmagan */
    config: {
      mastery: 0.8,                // dars mahorati: exit/check ≥ 80% + mustaqil mashq o'tgan
      moduleTestPass: 0.8,         // modul testi
      requiredSections: ['concept', 'example', 'predict', 'guided', 'independent', 'debug', 'check'],
      requiredExercises: ['guided', 'independent'],   // dars "tugallandi" uchun topshirilishi shart
      masteryExercises: ['independent'],              // mahorat uchun yordamsiz (yechim ochilmagan) o'tishi shart
      ivls: [1, 3, 7, 14],
      timeoutMs: 8000,
      legacyPass: 7                // eski dars: eng yaxshi ball ≥ 7/10
    },
    modules: [],
    lessons: {},
    /* Eski dars → muammo → yaxshilanish → yangi joy → tekshiruv mezoni.
       Hujjat: docs/PYTHON-LEGACY-MAP.md (shu ro'yxat bilan bir xil). */
    legacyMap: [
      { day: 1,  to: 'm1-basics', issue: T("Faqat 10 MCQ; mustaqil kod tekshiruvi yo'q", 'MCQ only; no checked coding task'), fix: T('Turlarni aylantirish funksiyasi + avtomatik test', 'Type-conversion function + automated tests') },
      { day: 2,  to: 'm1-basics', issue: T("Truthiness va qisqa tutashuv (short-circuit) yo'q", 'No truthiness or short-circuit'), fix: T("Predict mashqi: and/or qaytaradigan qiymat", 'Predict task: values returned by and/or') },
      { day: 3,  to: 'm1-basics', issue: T("input() ga tayanadi — testlab bo'lmaydi", 'Relies on input() — untestable'), fix: T('Parametrli funksiya; input faqat chegarada', 'Parameterised functions; input only at the edge') },
      { day: 4,  to: 'm1-basics', issue: T("Takror kuni — yangi dalil yo'q", 'Review day — no new evidence'), fix: T("Modul 1 testi va SRS takrori o'rnini egalladi", 'Replaced by the Module 1 test and SRS review') },
      { day: 5,  to: 'm1-conditions', issue: T('= va == farqi bor, lekin truthy qiymatlar yo\'q', '= vs == covered, truthy values missing'), fix: T('Chegara holatlari bilan grade() funksiyasi', 'grade() with boundary cases') },
      { day: 6,  to: 'm1-lists', issue: T("Mutable ro'yxat xavfi tushuntirilmagan", 'List mutability not explained'), fix: T("Yangi m1-mutability darsiga bog'landi", 'Linked to the new m1-mutability lesson') },
      { day: 7,  to: 'm1-lists', issue: T("Takror kuni", 'Review day'), fix: T('Interleaved mashq: ro\'yxat + shart', 'Interleaved task: lists + conditions') },
      { day: 8,  to: 'm1-loops', issue: T("8 va 9-kunlar while/break ni takrorlaydi", 'Days 8 and 9 repeat while/break'), fix: T("Bitta darsga birlashtirildi, accumulator naqshi qo'shildi", 'Merged into one lesson; accumulator pattern added') },
      { day: 9,  to: 'm1-loops', issue: T("Takror (8-kun bilan)", 'Duplicate of day 8'), fix: T('Birlashtirildi', 'Merged') },
      { day: 10, to: 'm1-loops', issue: T('Takror kuni', 'Review day'), fix: T('Debug mashqi: off-by-one', 'Debug task: off-by-one') },
      { day: 11, to: 'm1-collections', issue: T("Qachon tuple/set ishlatish — qaror qoidasi yo'q", 'No decision rule for tuple vs set'), fix: T("Tanlash jadvali + dedupe mashqi", 'Choice table + dedupe task') },
      { day: 12, to: 'm1-collections', issue: T(".get() bor, Counter yo'q", '.get() present, Counter missing'), fix: T("So'z sanash: dict va Counter", 'Word count: dict and Counter') },
      { day: 13, to: 'm1-collections', issue: T("Ichma-ich tuzilma — amaliy misol kam", 'Nested data — few practical examples'), fix: T("JSON'ga o'xshash ma'lumotdan qiymat olish", 'Extracting values from JSON-like data') },
      { day: 14, to: 'm1-collections', issue: T('Takror kuni', 'Review day'), fix: T('Modul testiga kiritildi', 'Folded into the module test') },
      { day: 15, to: 'm1-functions', issue: T("print va return chalkashligi oldini olinmagan", 'print vs return confusion not addressed'), fix: T("Predict: None qaytarish; return'li testlar", 'Predict: returning None; return-based tests') },
      { day: 16, to: 'm1-functions', issue: T("Mutable default argument xavfi yo'q", 'No mutable default argument pitfall'), fix: T("Debug mashqi: def f(x, acc=[])", 'Debug task: def f(x, acc=[])') },
      { day: 17, to: 'm1-functions', issue: T('Takror kuni', 'Review day'), fix: T('SRS', 'SRS') },
      { day: 18, to: 'm1-strings', issue: T("Satrlar 18-kunda — lekin 1-kundan ishlatiladi", 'Strings arrive on day 18 but are used from day 1'), fix: T("Yangi yo'lda shartlardan OLDIN", 'Moved BEFORE conditions in the new path') },
      { day: 19, to: 'm1-strings', issue: T("Formatlash yaxshi; tozalash (normalize) kam", 'Formatting fine; normalisation thin'), fix: T('normalize_name() mashqi', 'normalize_name() task') },
      { day: 20, to: 'm1-strings', issue: T('Takror kuni', 'Review day'), fix: T('SRS', 'SRS') },
      { day: 21, to: 'm1-comprehensions', issue: T("Faqat list comprehension", 'List comprehensions only'), fix: T("dict/set comprehension qo'shildi", 'dict/set comprehensions added') },
      { day: 22, to: 'm1-comprehensions', issue: T('Takror kuni', 'Review day'), fix: T('Interleaved: funksiya + comprehension', 'Interleaved: functions + comprehensions') },
      { day: 23, to: 'm1-errors', issue: T("Bare except ishlatilishi xavfi kam ta'kidlangan", 'Bare except danger under-stressed'), fix: T("Aniq istisno + raise ValueError mashqi", 'Specific exceptions + raise ValueError task') },
      { day: 24, to: 'm1-files', issue: T("pathlib va encoding yo'q", 'No pathlib or encoding'), fix: T("with + encoding='utf-8' + pathlib", "with + encoding='utf-8' + pathlib") },
      { day: 25, to: 'm1-files', issue: T('Takror kuni', 'Review day'), fix: T('Debug: fayl yopilmagan', 'Debug: file left open') },
      { day: 26, to: 'm1-modules', issue: T("__name__ == '__main__' va loyiha tuzilmasi yo'q", "No __name__ == '__main__' or project layout"), fix: T("Tuzilma va import qoidalari", 'Layout and import rules') },
      { day: 27, to: 'm1-oop', issue: T("Kompozitsiya yo'q, faqat meros", 'Inheritance only, no composition'), fix: T("Kompozitsiya + dataclass", 'Composition + dataclass') },
      { day: 28, to: 'm1-oop', issue: T("__repr__ yo'q", 'No __repr__'), fix: T('__repr__/__str__ va testlanadigan metodlar', '__repr__/__str__ and testable methods') },
      { day: 29, to: 'm1-oop', issue: T('Takror kuni', 'Review day'), fix: T('Modul testi', 'Module test') },
      { day: 30, to: 'm1-test', issue: T("Bitiruv = 10 MCQ", 'Graduation = 10 MCQ'), fix: T("Modul 1 testi: MCQ + amaliy kod vazifasi", 'Module 1 test: MCQ + practical coding task') }
    ],
    /* Yangi (eski kursda yo'q) darslar — eski progressga bog'lanmaydi */
    newLessons: ['m1-mutability', 'm1-iter', 'm1-typing'],
    projects: [],
    capstone: null,
    portfolio: []
  };

  /* Boshqa fayllar shu orqali qo'shadi */
  window.PYAI_ADD = function (o) {
    (o.modules || []).forEach(function (m) { PYAI.modules.push(m); });
    Object.keys(o.lessons || {}).forEach(function (k) { o.lessons[k].id = k; PYAI.lessons[k] = o.lessons[k]; });
    (o.projects || []).forEach(function (p) { PYAI.projects.push(p); });
    if (o.capstone) PYAI.capstone = o.capstone;
    (o.portfolio || []).forEach(function (p) { PYAI.portfolio.push(p); });
    if (o.diagnostic) PYAI.diagnostic = o.diagnostic;
  };

  /* ====================== MODUL 0 — DIAGNOSTIKA ======================= */
  PYAI_ADD({
    diagnostic: {
      intro: T("16 ta savol: kodni o'qish, natijani taxmin qilish va qisqa funksiya. Natija — qaysi mavzular kuchli/zaif va qayerdan boshlash tavsiyasi. Hech qaysi dars yopilmaydi.", '16 items: reading code, predicting output and a short function. The result shows strong/weak topics and a recommended start. No lesson is ever locked.'),
      items: [
        { topic: 'basics', lesson: 'm1-basics', q: 'x = "5"\ny = 2\nprint(x * y)', opts: ['10', '55', 'TypeError', '"5"2'], a: 1, why: T("str * int — satr takrorlanadi: '55'.", "str * int repeats the string: '55'.") },
        { topic: 'basics', lesson: 'm1-basics', q: 'print(bool("False"), bool(""), bool(0.0))', opts: ['False False False', 'True False False', 'True True False', 'False False True'], a: 1, why: T("Bo'sh bo'lmagan satr — True, hatto 'False' bo'lsa ham.", 'A non-empty string is truthy, even "False".') },
        { topic: 'strings', lesson: 'm1-strings', q: 's = "academy"\nprint(s[1:4], s[-1])', opts: ['aca y', 'cad y', 'cade y', 'cad m'], a: 1, why: T("[1:4] — 1,2,3 indekslar: 'cad'.", "[1:4] takes indexes 1,2,3: 'cad'.") },
        { topic: 'conditions', lesson: 'm1-conditions', q: 'n = 0\nprint("a" if n else "b")', opts: ['a', 'b', '0', 'None'], a: 1, why: T('0 — falsy.', '0 is falsy.') },
        { topic: 'lists', lesson: 'm1-lists', q: 'a = [3, 1, 2]\nb = a.sort()\nprint(b)', opts: ['[1, 2, 3]', 'None', '[3, 1, 2]', 'Error'], a: 1, why: T(".sort() joyida saralaydi va None qaytaradi.", '.sort() sorts in place and returns None.') },
        { topic: 'loops', lesson: 'm1-loops', q: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)', opts: ['15', '10', '4', '5'], a: 1, why: T('1+2+3+4 = 10 (5 kirmaydi).', '1+2+3+4 = 10 (5 is excluded).') },
        { topic: 'collections', lesson: 'm1-collections', q: 'd = {"a": 1}\nprint(d.get("b", 0) + d["a"])', opts: ['1', 'KeyError', '0', 'None'], a: 0, why: T(".get('b', 0) → 0; 0 + 1 = 1.", ".get('b', 0) → 0; 0 + 1 = 1.") },
        { topic: 'mutability', lesson: 'm1-mutability', q: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)', opts: ['[1, 2]', '[1, 2, 3]', '[3]', 'Error'], a: 1, why: T("b va a — bitta ro'yxat (alias).", 'b and a are the same list (alias).') },
        { topic: 'functions', lesson: 'm1-functions', q: 'def f(x):\n    print(x * 2)\nr = f(3)\nprint(r)', opts: ['6 then 6', '6 then None', 'None', '6'], a: 1, why: T("print qiymat qaytarmaydi — f None qaytaradi.", 'print does not return — f returns None.') },
        { topic: 'comprehensions', lesson: 'm1-comprehensions', q: 'print({w: len(w) for w in ["hi", "yes"]})', opts: ["{'hi': 2, 'yes': 3}", "['hi', 'yes']", '{2, 3}', 'Error'], a: 0, why: T('Dict comprehension.', 'A dict comprehension.') },
        { topic: 'errors', lesson: 'm1-errors', q: 'try:\n    int("x")\nexcept ValueError:\n    print("bad")\nfinally:\n    print("end")', opts: ['bad', 'end', 'bad end (two lines)', 'ValueError'], a: 2, why: T('except, keyin finally har doim.', 'except runs, then finally always runs.') },
        { topic: 'files', lesson: 'm1-files', q: "with open('a.txt', 'w') as f:\n    f.write('hi')\nprint(f.closed)", opts: ['False', 'True', 'Error', 'None'], a: 1, why: T('with bloki tugagach fayl yopiladi.', 'The file closes when the with block ends.') },
        { topic: 'oop', lesson: 'm1-oop', q: 'class A:\n    def __init__(self):\n        self.n = 1\na = A(); b = A()\nb.n = 5\nprint(a.n)', opts: ['5', '1', 'Error', 'None'], a: 1, why: T('Har obyektning o\'z atributi.', 'Each instance has its own attribute.') },
        { topic: 'iter', lesson: 'm1-iter', q: 'g = (x * x for x in range(3))\nprint(list(g), list(g))', opts: ['[0, 1, 4] [0, 1, 4]', '[0, 1, 4] []', '[] []', 'Error'], a: 1, why: T('Generator bir marta tugaydi.', 'A generator is exhausted after one pass.') },
        { topic: 'typing', lesson: 'm1-typing', q: 'def add(a: int, b: int) -> int:\n    return a + b\nprint(add("a", "b"))', opts: ['TypeError', 'ab', 'None', '0'], a: 1, why: T("Type hint ish vaqtida tekshirilmaydi — 'ab'.", "Type hints are not enforced at runtime — 'ab'.") }
      ],
      code: { id: 'diag-code', prompt: T("count_vowels(text) yozing: matndagi unli harflar (a, e, i, o, u; katta-kichik farqsiz) sonini qaytarsin.", 'Write count_vowels(text) returning the number of vowels (a, e, i, o, u; case-insensitive) in the text.'),
        starter: D('def count_vowels(text):\n    pass'), solution: D('def count_vowels(text):\n    return sum(1 for ch in text.lower() if ch in "aeiou")'),
        tests: [['basic', 'assert count_vowels("Academy") == 3'], ['empty', 'assert count_vowels("") == 0'], ['upper', 'assert count_vowels("AEIOU xyz") == 5']], hints: [T("Har harfni tekshirib sanang.", 'Check each character and count.'), T('text.lower() va "aeiou" ichida borligini tekshiring.', 'Use text.lower() and test membership in "aeiou".')], level: 'beginner', topic: 'functions' }
    },
    modules: [
      { id: 'm0', n: 0, title: T('Diagnostika va dasturchi muhiti', 'Diagnostic & developer setup'), goal: T("Hozirgi darajangizni aniqlash va ishlash muhitini sozlash", 'Find your current level and set up your environment'), lessons: ['m0-setup'] }
    ],
    lessons: {
      'm0-setup': {
        module: 'm0', title: T("Muhit: Python, muharrir, terminal, ish tartibi", 'Setup: Python, editor, terminal, workflow'),
        goal: T("Kompyuteringizda Python skriptini yozib, ishga tushirib, xatoni o'qiy olish", 'Write, run and read errors from a Python script on your computer'),
        prereq: [],
        concept: T("Platformadagi mashqlar brauzeringizda (Pyodide) ishlaydi, lekin haqiqiy loyihalar kompyuteringizda bo'ladi. Kerak bo'ladi: Python 3.12+ (python.org), muharrir (VS Code), terminal (Windows'da PowerShell). Ish tartibi (workflow): papka → virtual muhit (venv) → kod → ishga tushirish → xatoni o'qish → tuzatish → test. Xato xabari (traceback) pastdan yuqoriga o'qiladi: oxirgi qator — xato turi (exception type) va sababi; yuqoridagi qatorlar — qaysi fayl va qator.", 'Platform exercises run in your browser (Pyodide), but real projects live on your computer. You need Python 3.12+ (python.org), an editor (VS Code) and a terminal (PowerShell on Windows). Workflow: folder → virtual environment (venv) → code → run → read the error → fix → test. A traceback is read bottom-up: the last line is the exception type and message; the lines above show the file and line.'),
        terms: [['interpreter', 'tarjimon dastur'], ['script', 'skript fayl (.py)'], ['REPL', 'interaktiv rejim (>>>)'], ['traceback', 'xato izi'], ['virtual environment', 'loyiha uchun alohida muhit']],
        example: { code: D('# hello.py\nname = "Max"\nprint(f"Hello, {name}!")\n\n# Terminal:\n#   python --version\n#   python hello.py'), walk: [[2, T("O'zgaruvchi — satr", 'A string variable')], [3, T('f-string bilan chiqarish', 'Print with an f-string')], [6, T('Versiyani tekshirish: 3.12+ bo\'lishi kerak', 'Check the version: should be 3.12+')]] },
        predict: { code: D('print(len("hello")\n'), opts: ['5', 'SyntaxError: "(" was never closed', 'None', '0'], a: 1, why: T("Qavs yopilmagan — Python kodni ishga tushirishdan OLDIN SyntaxError beradi.", 'The parenthesis is not closed — Python raises SyntaxError BEFORE running anything.') },
        mistake: { bad: D('print("Total: " + 5)'), good: D('print("Total: " + str(5))\nprint(f"Total: {5}")'), why: T("str + int — TypeError. Aylantiring yoki f-string ishlating.", 'str + int is a TypeError. Convert, or use an f-string.') },
        guided: { id: 'm0-setup-g', prompt: T("greet(name) funksiyasi 'Hello, <name>!' satrini QAYTARSIN (print emas).", "greet(name) should RETURN the string 'Hello, <name>!' (not print it)."), starter: D('def greet(name):\n    # f-string bilan qaytaring\n    return ...'), solution: D('def greet(name):\n    return f"Hello, {name}!"'), tests: [['max', 'assert greet("Max") == "Hello, Max!"'], ['other', 'assert greet("Ali") == "Hello, Ali!"']], hints: [T('return f"..." ishlating.', 'Use return f"...".'), T("f\"Hello, {name}!\" — vergul va undov belgisi ham kerak.", 'f"Hello, {name}!" — the comma and exclamation mark matter.')], level: 'beginner' },
        independent: { id: 'm0-setup-i', prompt: T("python_ok(version) — '3.12.1' kabi satrni oladi; asosiy va kichik versiya 3.12 yoki undan yuqori bo'lsa True qaytaradi.", "python_ok(version) takes a string like '3.12.1' and returns True if major.minor is 3.12 or newer."), starter: D('def python_ok(version):\n    pass'), solution: D('def python_ok(version):\n    major, minor = (int(p) for p in version.split(".")[:2])\n    return (major, minor) >= (3, 12)'), tests: [['3.12.1', 'assert python_ok("3.12.1") is True'], ['3.9', 'assert python_ok("3.9.18") is False'], ['3.13', 'assert python_ok("3.13.0") is True'], ['4.0', 'assert python_ok("4.0.0") is True'], ['3.10 vs 3.9', 'assert python_ok("3.10.2") is False']], hints: [T("split('.') bilan qismlarga ajrating va int() ga aylantiring.", "Split on '.' and convert with int()."), T("Tuple taqqoslash: (3, 13) >= (3, 12) True. Satr taqqoslash '3.10' < '3.9' — xato natija beradi!", "Compare tuples: (3, 13) >= (3, 12) is True. Comparing strings gives '3.10' < '3.9' — wrong!")], level: 'intermediate' },
        debug: { id: 'm0-setup-d', prompt: T("Funksiya fayl kengaytmasini qaytarishi kerak ('report.final.py' → 'py'), lekin xato ishlaydi. Tuzating.", "The function should return the file extension ('report.final.py' → 'py') but is buggy. Fix it."), starter: D('def extension(filename):\n    return filename.split(".")[1]'), solution: D('def extension(filename):\n    if "." not in filename:\n        return ""\n    return filename.rsplit(".", 1)[1]'), tests: [['multi dot', 'assert extension("report.final.py") == "py"'], ['simple', 'assert extension("a.txt") == "txt"'], ['none', 'assert extension("Makefile") == ""']], hints: [T("[1] — ikkinchi bo'lak, oxirgisi emas.", '[1] is the second piece, not the last.'), T("rsplit('.', 1) va nuqta bo'lmagan holat.", "Use rsplit('.', 1) and handle the no-dot case.")], level: 'beginner' },
        check: [
          { q: T("Traceback'ning qaysi qatori xato TURINI aytadi?", 'Which traceback line names the exception TYPE?'), opts: [T('Birinchi qator', 'The first line'), T('Oxirgi qator', 'The last line'), T("O'rtadagi", 'A middle line')], a: 1, why: T('Oxirgi qator: masalan ValueError: ...', 'The last line, e.g. ValueError: ...') },
          { q: T("Nega loyihaga virtual muhit kerak?", 'Why does a project need a virtual environment?'), opts: [T('Kod tezroq ishlaydi', 'Code runs faster'), T("Har loyiha kutubxonalari alohida va takrorlanadigan bo'ladi", "Each project's libraries stay separate and reproducible"), T('Internet kerak bo\'lmaydi', 'No internet needed')], a: 1, why: T("Loyiha A pandas 2.0, loyiha B 1.5 talab qilsa — ziddiyat bo'lmaydi.", 'Project A can need pandas 2.0 and project B 1.5 without conflict.') }
        ],
        real: T("Har ishda birinchi kun: muhitni sozlash va kodni ishga tushirish. Xatoni tez o'qiy olish — eng ko'p vaqt tejaydigan ko'nikma.", 'Day one of every job: set up the environment and run the code. Reading errors quickly saves the most time.'),
        summary: [T('python --version · python fayl.py', 'python --version · python file.py'), T("Traceback pastdan yuqoriga o'qiladi", 'Read tracebacks bottom-up'), T("Funksiya qiymatni return qiladi — print emas", 'Functions return values — not print')],
        exit: [{ q: T("print(f(2)) None chiqardi. Eng ehtimolli sabab?", 'print(f(2)) shows None. Most likely cause?'), opts: [T("f ichida return yo'q", 'f has no return'), T('f juda sekin', 'f is too slow'), T("2 noto'g'ri tur", '2 is the wrong type')], a: 0, why: T("return bo'lmasa funksiya None qaytaradi.", 'Without return a function returns None.') }],
        setup: [T("python.org dan Python 3.12+ o'rnating (Windows: 'Add python.exe to PATH' belgisi).", "Install Python 3.12+ from python.org (Windows: tick 'Add python.exe to PATH')."), T('VS Code + Python kengaytmasi.', 'VS Code + the Python extension.'), T("Terminalda: python --version → 3.12+ ko'rinishi kerak.", 'In the terminal: python --version → should show 3.12+.'), T("Papka: mkdir myproj; cd myproj; python -m venv .venv; .venv\\Scripts\\Activate.ps1 (Windows) yoki source .venv/bin/activate.", 'Folder: mkdir myproj; cd myproj; python -m venv .venv; .venv\\Scripts\\Activate.ps1 (Windows) or source .venv/bin/activate.')],
        trouble: [T("'python' topilmadi → PATH yoki py launcher: py --version", "'python' not found → PATH, or use the py launcher: py --version"), T("Activate.ps1 bloklandi → Set-ExecutionPolicy -Scope CurrentUser RemoteSigned", 'Activate.ps1 blocked → Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'), T("ModuleNotFoundError → venv faolmi? pip install <nom>", 'ModuleNotFoundError → is the venv active? pip install <name>'), T('IndentationError → tab va bo\'shliqni aralashtirmang (4 bo\'shliq)', 'IndentationError → do not mix tabs and spaces (4 spaces)')]
      }
    }
  });
})();
