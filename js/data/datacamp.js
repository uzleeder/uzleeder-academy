/* ==========================================================================
   DCTRACK — DataCamp "Python Programming Fundamentals" skill track
   --------------------------------------------------------------------------
   Manba: https://app.datacamp.com/learn/skill-tracks/python-programming-fundamentals
   16 soat · Basic · 4 kurs (13 bob) · 1 loyiha. Kurslar va boblar DataCamp'dagi
   tartibda, har bobning darslari (video/mashq nomlari) ro'yxati bilan.

   Jadval: RASMIY START 20-sen 2026 (kickoff, yakshanba) — kuniga BITTA bob,
   yakshanbalar (27-sen, 4-okt) katta coding testi uchun bo'sh. 13 bob +
   loyiha = 14 kun → 5-oktabrda trek tugaydi. Keyin DataCamp bloki DCPLAN 2-bosqichga
   (NumPy · pandas · OOP) o'tadi.

   Har bobda: min (taxminiy daqiqa), lessons (DataCamp'dagi dars nomlari),
   goals (bobdan keyin NIMA qila olishing kerak — tekshiruv mezoni),
   quiz (5 savol — platformadagi bob testi; yakshanba katta testiga ham kiradi).
   ========================================================================== */
window.DCTRACK = {
  meta: {
    title: 'Python Programming Fundamentals',
    short: 'DataCamp · Python track',
    url: 'https://app.datacamp.com/learn/skill-tracks/python-programming-fundamentals',
    start: '2026-09-20',
    hours: 16, level: 'Basic',
    lede: {
      uz: "DataCamp'ning 16 soatlik treki: 4 kurs, 13 bob, 1 loyiha. Kuniga bitta bob — nazariya va mashqlar DataCamp'da, keyin shu yerda bob testi. Yakshanba: shu haftagacha o'tilgan hamma narsa bo'yicha KATTA coding testi.",
      en: "DataCamp's 16-hour track: 4 courses, 13 chapters, 1 project. One chapter a day — theory and exercises on DataCamp, then the chapter quiz here. Sunday: the BIG coding test on everything covered so far."
    },
    rule: {
      uz: "Qoida: bob DataCamp'da 100% tugallanmaguncha va shu yerdagi testdan 4/5 olmaguncha \"bajarildi\" belgilanmaydi. Platformadagi Python darsi va DataCamp bobi — bitta kunlik codingning ikki qismi (og'ir kun 4 soat, LC kuni 2 soat).",
      en: 'Rule: a chapter is not "done" until it is 100% complete on DataCamp AND you score 4/5 on the quiz here. The platform Python lesson and the DataCamp chapter are two halves of one daily coding block (4h on heavy days, 2h on LC days).'
    },
    how: {
      uz: ["DataCamp'da bobni och — har videoni ko'r, har mashqni O'ZING yoz (nusxa emas)", "Tushunmagan joyni shu platformadagi Python darsidan o'zbekcha o'qi (mavzu ko'rsatilgan)", "Bob tugagach — shu yerdagi 5 savollik test. 4/5 dan past bo'lsa bobga qaytasan", "Yakshanba: KATTA test (Practice → Coding) — Python darslari + DataCamp boblari", "Xato savollar Xatolar daftariga tushadi va Takror navbatiga kiradi"],
      en: ['Open the chapter on DataCamp — watch every video, write every exercise YOURSELF (no copying)', 'Anything unclear: read the matching Python lesson here in Uzbek (topic shown)', 'Chapter done → the 5-question quiz here. Below 4/5 → back to the chapter', 'Sunday: the BIG test (Practice → Coding) — Python lessons + DataCamp chapters', 'Wrong answers go to the Error log and the Review queue']
    }
  },

  courses: [
    /* ---------------------------------------------------------------- */
    { id: 'intro', n: 1, title: 'Introduction to Python for Developers', hours: 3.2, videos: 12, exercises: 39,
      url: 'https://app.datacamp.com/learn/courses/introduction-to-python-for-developers',
      desc: { uz: "Python asoslari: o'zgaruvchi, turlar, ro'yxat, lug'at, shart, sikl. Platformadagi 1–8-darslar bilan bir mavzu.", en: 'Python basics: variables, types, lists, dicts, conditions, loops. Same ground as lessons 1–8 here.' },
      chapters: [
        { id: 'intro-1', title: 'Introduction to Python', min: 60, py: [1, 2],
          lessons: ['What is Python?', 'Running your first Python script', 'Writing your first Python script', 'Python variables, strings, and integers', 'Storing variables', 'Updating variables', 'Common data types', 'Working with number variables', 'Working with booleans', 'Checking data types'],
          goals: { uz: ["print() bilan chiqarish, o'zgaruvchiga qiymat berish va yangilash", 'int · float · str · bool turlarini ajratish, type() bilan tekshirish', "O'zgaruvchi nomlash qoidalari (harf bilan boshlanadi, bo'sh joysiz)"], en: ['Print with print(), assign and update variables', 'Tell int · float · str · bool apart, check with type()', 'Variable naming rules (starts with a letter, no spaces)'] },
          quiz: [
            { q: 'x = 5\nx = x + 2\nprint(x)', opts: ['5', '7', '52', 'Error'], correct: 1, why: 'x qayta yoziladi: 5 + 2 = 7' },
            { q: 'print(type(7.0))', opts: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"], correct: 1, why: '7.0 — kasr nuqtasi bor, demak float' },
            { q: 'Which line is a valid variable assignment?', opts: ['2nd_name = "Ali"', 'my name = "Ali"', 'my_name = "Ali"', 'my-name = "Ali"'], correct: 2, why: "Nom harf yoki _ bilan boshlanadi, bo'sh joy va - bo'lmaydi" },
            { q: 'is_open = True\nprint(type(is_open))', opts: ["<class 'bool'>", "<class 'str'>", "<class 'int'>", 'True'], correct: 0, why: 'True/False — bool turi' },
            { q: 'name = "Ada"\nprint("Hi " + name)', opts: ['Hi Ada', 'HiAda', 'Hi name', 'Error'], correct: 0, why: "+ satrlarni ulaydi; \"Hi \" ichida bo'sh joy bor" }
          ] },
        { id: 'intro-2', title: 'Working with Data Types', min: 70, py: [3, 4, 5],
          lessons: ['Working with strings', 'Multi-line strings', 'Modifying string values', 'Lists', 'Building a list', 'Subsetting lists', 'Dictionaries', 'Building a dictionary', 'Working with dictionaries', 'Sets and tuples', 'Creating a tuple', 'Working with sets', 'Choosing a data structure'],
          goals: { uz: ["Satr metodlari: .upper() .lower() .replace() va ko'p qatorli satr", "Ro'yxat: yaratish, indeks va kesim ([0], [-1], [1:3])", "Lug'at: kalit → qiymat, .keys() .values() .items()", "To'plam (set) takrorsiz, kortej (tuple) o'zgarmas — qachon qaysi"], en: ['String methods: .upper() .lower() .replace(), multi-line strings', 'Lists: build, index and slice ([0], [-1], [1:3])', 'Dicts: key → value, .keys() .values() .items()', 'Sets are unique, tuples immutable — which to pick when'] },
          quiz: [
            { q: 'xs = [10, 20, 30, 40]\nprint(xs[1:3])', opts: ['[20, 30]', '[10, 20, 30]', '[20, 30, 40]', '[30, 40]'], correct: 0, why: 'Kesim: 1-indeksdan 3-gacha (3 kirmaydi)' },
            { q: 'd = {"a": 1, "b": 2}\nprint(d["b"])', opts: ['1', '2', 'b', 'Error'], correct: 1, why: "Lug'atdan kalit bo'yicha qiymat" },
            { q: 'print(len({1, 1, 2, 3, 3}))', opts: ['5', '3', '2', 'Error'], correct: 1, why: 'set takrorlarni tashlaydi: {1, 2, 3}' },
            { q: 't = (1, 2, 3)\nt[0] = 9', opts: ['t becomes (9, 2, 3)', 'TypeError', 'Nothing happens', 't becomes [9, 2, 3]'], correct: 1, why: "Tuple o'zgarmas — element qayta yozilmaydi" },
            { q: 's = "python"\nprint(s.upper()[0])', opts: ['p', 'P', 'PYTHON', 'Error'], correct: 1, why: '.upper() → "PYTHON", [0] → "P"' }
          ] },
        { id: 'intro-3', title: 'Control Flow and Loops', min: 75, py: [6, 7, 8],
          lessons: ['Conditional statements and operators', 'Checking ingredients', 'Checking equality', 'For loops', 'Looping through a list', 'Conditional looping with lists', 'Looping with a dictionary', 'While loops', 'Breaking a while loop', 'Using a while loop', 'Conditional while loops', 'Building a workflow', 'Appending to a list', 'Checking values', 'Building the recipe scaler', 'Congratulations!'],
          goals: { uz: ['if / elif / else, == != < > and or not', "for — ro'yxat va lug'at ustida (.items())", "while — shart bilan, break va cheksiz sikldan saqlanish", "Ish oqimi: ro'yxatga .append() qilib natija yig'ish"], en: ['if / elif / else, == != < > and or not', 'for over lists and dicts (.items())', 'while with a condition, break, avoiding infinite loops', 'A workflow: collect results with .append()'] },
          quiz: [
            { q: 'for i in range(3):\n    print(i)', opts: ['1 2 3', '0 1 2', '0 1 2 3', '3'], correct: 1, why: 'range(3) → 0, 1, 2' },
            { q: 'x = 7\nif x > 10:\n    print("big")\nelif x > 5:\n    print("mid")\nelse:\n    print("small")', opts: ['big', 'mid', 'small', 'Nothing'], correct: 1, why: "7 > 10 yo'q, 7 > 5 ha → mid" },
            { q: 'n = 0\nwhile n < 3:\n    n += 1\nprint(n)', opts: ['2', '3', '4', 'Infinite loop'], correct: 1, why: 'n: 1, 2, 3 → 3 < 3 emas, sikl tugaydi' },
            { q: 'd = {"a": 1, "b": 2}\nfor k, v in d.items():\n    print(k, v)', opts: ['a 1 / b 2', 'a b', '1 2', 'Error'], correct: 0, why: '.items() kalit-qiymat juftlarini beradi' },
            { q: 'for i in range(10):\n    if i == 2:\n        break\nprint(i)', opts: ['0', '2', '9', '10'], correct: 1, why: 'break i == 2 da siklni to‘xtatadi; i = 2 qoladi' }
          ] }
      ] },

    /* ---------------------------------------------------------------- */
    { id: 'inter', n: 2, title: 'Intermediate Python for Developers', hours: 2.2, videos: 11, exercises: 38,
      url: 'https://app.datacamp.com/learn/courses/intermediate-python-for-developers',
      desc: { uz: "O'rnatilgan funksiyalar, modullar va paketlar, o'z funksiyang, lambda va xatolar bilan ishlash. Platformadagi 9–15-darslar.", en: 'Built-in functions, modules and packages, your own functions, lambda and error handling. Lessons 9–15 here.' },
      chapters: [
        { id: 'inter-1', title: 'The Python Ecosystem', min: 45, py: [9, 12],
          lessons: ['Built-in functions', 'Calculating key metrics', 'Finding the average', 'Sorting lists', 'Modules', 'What is a module?', 'Working with the os module', 'Working with the string module', 'Packages', 'Package or module', 'Working with pandas', 'Reading files with pandas'],
          goals: { uz: ['max min sum len round sorted — qachon qaysi', "import os / from string import … — modul va funksiya", 'Modul (bitta fayl) va paket (papka) farqi; pip bilan o\'rnatish', 'pandas: read_csv() bilan faylni DataFrame ga o\'qish'], en: ['max min sum len round sorted — which when', 'import os / from string import … — modules and functions', 'Module (one file) vs package (folder); installing with pip', 'pandas: read a file into a DataFrame with read_csv()'] },
          quiz: [
            { q: 'xs = [3, 1, 2]\nprint(sorted(xs), xs)', opts: ['[1, 2, 3] [1, 2, 3]', '[1, 2, 3] [3, 1, 2]', '[3, 1, 2] [1, 2, 3]', 'Error'], correct: 1, why: "sorted() yangi ro'yxat qaytaradi, aslini o'zgartirmaydi" },
            { q: 'print(round(3.14159, 2))', opts: ['3.14', '3.1', '3', '3.142'], correct: 0, why: '2 xonagacha yaxlitlash' },
            { q: 'Which statement imports only the function getcwd from os?', opts: ['import os.getcwd', 'from os import getcwd', 'import getcwd from os', 'os.import(getcwd)'], correct: 1, why: 'from modul import nom' },
            { q: 'A package is …', opts: ['a single .py file', 'a folder of modules', 'a function inside a module', 'a variable'], correct: 1, why: 'Paket — modullar papkasi' },
            { q: 'import pandas as pd\ndf = pd.read_csv("sales.csv")\nprint(type(df))', opts: ["<class 'list'>", "<class 'dict'>", "<class 'pandas.core.frame.DataFrame'>", "<class 'str'>"], correct: 2, why: 'read_csv DataFrame qaytaradi' }
          ] },
        { id: 'inter-2', title: 'Working with Functions', min: 50, py: [10, 11],
          lessons: ['Defining a custom function', 'Custom function syntax', 'Report-generating function', 'Building a password validator', 'Default and keyword arguments', 'Positional versus keyword arguments', 'Adding a keyword argument', 'Calculating a discount', 'Docstrings', 'Single-line docstrings', 'Multi-line docstrings', 'Arbitrary arguments', 'Adding arbitrary arguments', 'Arbitrary keyword arguments'],
          goals: { uz: ['def nom(arg): … return — funksiya yozish va chaqirish', 'Standart qiymat (arg=…) va kalitli argument (nom=qiymat)', 'Docstring — """…""" bilan hujjat', '*args va **kwargs — istalgan sondagi argumentlar'], en: ['def name(arg): … return — write and call functions', 'Default values (arg=…) and keyword arguments (name=value)', 'Docstrings with """…"""', '*args and **kwargs — any number of arguments'] },
          quiz: [
            { q: 'def f(x, y=2):\n    return x * y\n\nprint(f(3))', opts: ['3', '6', '5', 'Error'], correct: 1, why: 'y standart 2 → 3 * 2' },
            { q: 'def f(x):\n    x * 2\n\nprint(f(4))', opts: ['8', 'None', '4', 'Error'], correct: 1, why: "return yo'q — funksiya None qaytaradi" },
            { q: 'def total(*nums):\n    return sum(nums)\n\nprint(total(1, 2, 3))', opts: ['6', '(1, 2, 3)', '3', 'Error'], correct: 0, why: '*nums — argumentlar kortej bo‘lib keladi' },
            { q: 'def info(**kw):\n    return list(kw.keys())\n\nprint(info(a=1, b=2))', opts: ["['a', 'b']", '[1, 2]', '{a: 1, b: 2}', 'Error'], correct: 0, why: "**kw — kalitli argumentlar lug'at" },
            { q: 'Where does a docstring go?', opts: ['Before def', 'Right after the def line, as the first statement', 'After return', 'In a comment above the file'], correct: 1, why: "Docstring — funksiya tanasining birinchi ifodasi" }
          ] },
        { id: 'inter-3', title: 'Lambda Functions and Error-Handling', min: 50, py: [13, 14, 15],
          lessons: ['Lambda functions', 'Calculating file sizes', 'Calling lambda in-line', 'Lambda functions with iterables', 'Introduction to errors', 'Debugging code', 'Module and package tracebacks', 'Fixing an issue', 'Error handling', 'Avoiding errors', 'Returning errors', 'Congratulations'],
          goals: { uz: ['lambda x: … — bir qatorli funksiya, map() bilan', 'Traceback o‘qish: xato turi va qatori', 'try / except — xatoni ushlash, dastur yiqilmasin', 'raise — o‘zing xato qaytarish (masalan, noto‘g‘ri kiritish)'], en: ['lambda x: … — one-line functions, with map()', 'Reading a traceback: error type and line', 'try / except — catch errors so the program does not crash', 'raise — throw your own error (e.g. bad input)'] },
          quiz: [
            { q: 'sq = lambda x: x ** 2\nprint(sq(4))', opts: ['8', '16', '4', 'Error'], correct: 1, why: '4 ** 2 = 16' },
            { q: 'print(list(map(lambda v: v + 1, [1, 2, 3])))', opts: ['[1, 2, 3]', '[2, 3, 4]', '[2, 4, 6]', 'Error'], correct: 1, why: 'map har elementga funksiyani qo‘llaydi' },
            { q: 'try:\n    x = int("abc")\nexcept ValueError:\n    x = 0\nprint(x)', opts: ['abc', '0', 'ValueError', 'None'], correct: 1, why: 'int("abc") ValueError beradi → except ishlaydi' },
            { q: 'print(10 / 0) raises …', opts: ['ValueError', 'TypeError', 'ZeroDivisionError', 'KeyError'], correct: 2, why: 'Nolga bo‘lish — ZeroDivisionError' },
            { q: 'def age(n):\n    if n < 0:\n        raise ValueError("negative")\n    return n\n\nage(-1)', opts: ['Returns -1', 'Returns None', 'Raises ValueError', 'Prints negative'], correct: 2, why: 'raise dasturni xato bilan to‘xtatadi' }
          ] }
      ] },

    /* ---------------------------------------------------------------- */
    { id: 'toolbox', n: 3, title: 'Python Toolbox', hours: 4.2, videos: 12, exercises: 46,
      url: 'https://app.datacamp.com/learn/courses/python-toolbox',
      desc: { uz: "Iteratorlar, enumerate/zip, list comprehension, generatorlar va katta faylni bo'laklab o'qish. Platformadagi 16–22-darslar.", en: 'Iterators, enumerate/zip, list comprehensions, generators and reading large files in chunks. Lessons 16–22 here.' },
      chapters: [
        { id: 'tb-1', title: 'Using Iterators in PythonLand', min: 80, py: [16, 17],
          lessons: ['Introduction to iterators', 'Iterators vs. Iterables', 'Iterating over iterables (1)', 'Iterating over iterables (2)', 'Iterators as function arguments', 'Playing with iterators', 'Using enumerate', 'Using zip', "Using * and zip to 'unzip'", 'Using iterators to load large files into memory', 'Processing large amounts of Twitter data', 'Extracting information for large amounts of Twitter data', 'Congratulations!'],
          goals: { uz: ['iter() va next() — iteratsiya qanday ishlaydi', 'enumerate() — indeks + element; zip() — ikki ro‘yxatni juftlash', 'Katta faylni chunksize bilan bo‘laklab o‘qish (pandas)'], en: ['iter() and next() — how iteration works', 'enumerate() — index + item; zip() — pair two lists', 'Read a large file in chunks (pandas chunksize)'] },
          quiz: [
            { q: 'it = iter([1, 2, 3])\nprint(next(it), next(it))', opts: ['1 1', '1 2', '2 3', 'Error'], correct: 1, why: 'next har safar keyingi elementni beradi' },
            { q: 'for i, x in enumerate(["a", "b"]):\n    print(i, x)', opts: ['0 a / 1 b', 'a 0 / b 1', '1 a / 2 b', 'Error'], correct: 0, why: 'enumerate 0 dan indeks beradi' },
            { q: 'print(list(zip([1, 2], ["a", "b"])))', opts: ["[(1, 'a'), (2, 'b')]", "[1, 'a', 2, 'b']", "{1: 'a', 2: 'b'}", 'Error'], correct: 0, why: 'zip juftliklar kortejini beradi' },
            { q: 'Which is an iterable but NOT an iterator?', opts: ['A list', 'iter([1, 2])', 'A generator', 'A file object'], correct: 0, why: "Ro'yxat — iterable; iter() uni iteratorga aylantiradi" },
            { q: 'for chunk in pd.read_csv("big.csv", chunksize=1000):\n    ...', opts: ['Reads the whole file at once', 'Reads 1000 rows at a time', 'Reads only the first 1000 rows', 'Error'], correct: 1, why: 'chunksize — bo‘laklab o‘qish, xotira tejaladi' }
          ] },
        { id: 'tb-2', title: 'List Comprehensions and Generators', min: 90, py: [18, 19],
          lessons: ['List comprehensions', 'Write a basic list comprehension', 'List comprehension over iterables', 'Writing list comprehensions', 'Nested list comprehensions', 'Advanced comprehensions', 'Using conditionals in comprehensions (1)', 'Using conditionals in comprehensions (2)', 'Dict comprehensions', 'Introduction to generator expressions', 'List comprehensions vs. generators', 'Write your own generator expressions', 'Changing the output in generator expressions', 'Build a generator', 'Wrapping up comprehensions and generators', 'List comprehensions for time-stamped data', 'Conditional list comprehensions for time-stamped data'],
          goals: { uz: ['[x*2 for x in xs if x > 0] — shart bilan comprehension', '{k: v for …} — dict comprehension', '(x for x in …) — generator: xotira tejaydi, bir marta o‘qiladi', 'yield bilan o‘z generator funksiyang'], en: ['[x*2 for x in xs if x > 0] — comprehensions with a condition', '{k: v for …} — dict comprehensions', '(x for x in …) — generators: memory-light, consumed once', 'Your own generator function with yield'] },
          quiz: [
            { q: 'print([x * 2 for x in range(4)])', opts: ['[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 1, 2, 3]', 'Error'], correct: 0, why: 'range(4) = 0..3, har biri ×2' },
            { q: 'print([x for x in range(6) if x % 2 == 0])', opts: ['[1, 3, 5]', '[0, 2, 4]', '[2, 4, 6]', '[0, 2, 4, 6]'], correct: 1, why: 'Faqat juftlar 0..5 orasidan' },
            { q: 'g = (x for x in range(3))\nprint(type(g))', opts: ["<class 'list'>", "<class 'generator'>", "<class 'tuple'>", "<class 'range'>"], correct: 1, why: '( ) — generator ifodasi' },
            { q: 'def gen():\n    yield 1\n    yield 2\n\nprint(list(gen()))', opts: ['[1, 2]', '1 2', '[2]', 'Error'], correct: 0, why: 'yield qiymatlarni birma-bir beradi' },
            { q: 'print({k: len(k) for k in ["hi", "hey"]})', opts: ["{'hi': 2, 'hey': 3}", "['hi', 'hey']", '{2, 3}', 'Error'], correct: 0, why: 'dict comprehension: kalit → uzunlik' }
          ] },
        { id: 'tb-3', title: 'Bringing It All Together!', min: 80, py: [20, 21, 22],
          lessons: ['Welcome to the case study!', 'Zipping dictionaries', 'Writing a function to help you', 'Using a list comprehension', 'Turning this all into a DataFrame', 'Using Python generators for streaming data', 'Processing data in chunks (1)', 'Writing a generator to load data in chunks (2)', 'Writing a generator to load data in chunks (3)', "Using pandas' read_csv iterator for streaming data", 'Writing an iterator to load data in chunks (1)', 'Writing an iterator to load data in chunks (2)', 'Writing an iterator to load data in chunks (3)', 'Writing an iterator to load data in chunks (4)', 'Writing an iterator to load data in chunks (5)', 'Final thoughts'],
          goals: { uz: ['zip + dict — ikki ro‘yxatdan lug‘at', 'Real ma’lumot ustida funksiya + comprehension + DataFrame', 'Fayl bilan ishlash: with open(…) va bo‘laklab o‘qish'], en: ['zip + dict — a dict from two lists', 'Function + comprehension + DataFrame on real data', 'Files: with open(…) and chunked reading'] },
          quiz: [
            { q: 'keys = ["a", "b"]\nvals = [1, 2]\nprint(dict(zip(keys, vals)))', opts: ["{'a': 1, 'b': 2}", "[('a', 1), ('b', 2)]", "{'a', 'b'}", 'Error'], correct: 0, why: 'zip → juftlar, dict → lug‘at' },
            { q: 'with open("f.txt") as f:\n    line = f.readline()', opts: ['Reads the whole file', 'Reads one line', 'Reads one character', 'Error'], correct: 1, why: 'readline() bitta qator o‘qiydi' },
            { q: 'Why use "with open(...)"?', opts: ['It is faster', 'It closes the file automatically', 'It reads in chunks', 'It sorts the lines'], correct: 1, why: 'with — fayl avtomatik yopiladi' },
            { q: 'def read_chunks(path, n):\n    with open(path) as f:\n        while True:\n            data = f.read(n)\n            if not data:\n                break\n            yield data', opts: ['Returns a list of chunks', 'Is a generator that yields n characters at a time', 'Reads the file once into memory', 'Error'], correct: 1, why: 'yield — bo‘laklab beradigan generator' },
            { q: 'import pandas as pd\ndf = pd.DataFrame({"x": [1, 2]})\nprint(df.shape)', opts: ['(2, 1)', '(1, 2)', '2', '[2, 1]'], correct: 0, why: 'shape = (qatorlar, ustunlar)' }
          ] }
      ] },

    /* ---------------------------------------------------------------- */
    { id: 'types', n: 4, title: 'Data Types in Python', hours: 4.25, videos: 15, exercises: 47,
      url: 'https://app.datacamp.com/learn/courses/data-types-in-python',
      desc: { uz: "Ro'yxat, kortej, satr, lug'at, son, mantiq, to'plam va collections (Counter, defaultdict, namedtuple, dataclass). Platformadagi 23–28-darslar.", en: 'Lists, tuples, strings, dicts, numbers, booleans, sets and collections (Counter, defaultdict, namedtuple, dataclass). Lessons 23–28 here.' },
      chapters: [
        { id: 'dt-1', title: 'Fundamental Sequence Data Types', min: 65, py: [3, 23],
          lessons: ['Introduction and lists', 'Manipulating lists for fun and profit', 'Looping over lists', 'Meet the tuples', 'Data type usage', 'Using and unpacking tuples', 'Making tuples by accident', 'Strings', 'Formatted String Literals ("f" strings)', 'Combining multiple strings', 'Finding strings in other strings'],
          goals: { uz: ['.append .extend .insert .pop .sort — ro‘yxat metodlari', 'Kortej ochish: a, b = (1, 2); tasodifiy kortej (x = 1,)', 'f-string: f"{name} {n:.2f}"; .join() .find() in'], en: ['.append .extend .insert .pop .sort — list methods', 'Tuple unpacking: a, b = (1, 2); accidental tuples (x = 1,)', 'f-strings: f"{name} {n:.2f}"; .join() .find() in'] },
          quiz: [
            { q: 'xs = [1, 2]\nxs.extend([3, 4])\nprint(xs)', opts: ['[1, 2, [3, 4]]', '[1, 2, 3, 4]', '[3, 4]', 'Error'], correct: 1, why: 'extend elementlarni qo‘shadi, append ro‘yxatni bitta element qilib qo‘yardi' },
            { q: 'x = 5,\nprint(type(x))', opts: ["<class 'int'>", "<class 'tuple'>", "<class 'list'>", 'Error'], correct: 1, why: 'Vergul kortej yasaydi: (5,)' },
            { q: 'a, b = (10, 20)\nprint(b)', opts: ['10', '20', '(10, 20)', 'Error'], correct: 1, why: 'Kortej ochish (unpacking)' },
            { q: 'n = 3.14159\nprint(f"{n:.1f}")', opts: ['3.14159', '3.1', '3', '3.14'], correct: 1, why: ':.1f — 1 xona kasr' },
            { q: 'print("-".join(["a", "b", "c"]))', opts: ['a-b-c', 'abc', '-abc-', 'Error'], correct: 0, why: 'join elementlarni ajratuvchi bilan uladi' }
          ] },
        { id: 'dt-2', title: 'Dictionaries - The Root of Python', min: 65, py: [5, 24],
          lessons: ['Using dictionaries', 'Creating and looping through dictionaries', 'Safely finding by key', 'Altering dictionaries', 'Adding and extending dictionaries', 'Popping and deleting from dictionaries', 'Pythonically using dictionaries', 'Working with dictionaries more pythonically', 'Checking dictionaries for data', 'Mixed data types in dictionaries', 'Dealing with nested dictionaries', 'Dealing with nested mixed types'],
          goals: { uz: ['.get(key, default) — xavfsiz olish', '.update() .pop() del — o‘zgartirish', 'in bilan kalit borligini tekshirish', 'Ichma-ich lug‘atlar: d["a"]["b"]'], en: ['.get(key, default) — safe lookup', '.update() .pop() del — modifying', 'in to check a key exists', 'Nested dicts: d["a"]["b"]'] },
          quiz: [
            { q: 'd = {"a": 1}\nprint(d.get("b", 0))', opts: ['None', '0', 'KeyError', '1'], correct: 1, why: 'get — kalit bo‘lmasa standart qiymat' },
            { q: 'd = {"a": 1}\nprint(d["b"])', opts: ['None', '0', 'KeyError', '1'], correct: 2, why: '[] — kalit yo‘q bo‘lsa KeyError' },
            { q: 'd = {"a": 1}\nd.update({"b": 2})\nprint(len(d))', opts: ['1', '2', '3', 'Error'], correct: 1, why: 'update yangi kalit qo‘shadi' },
            { q: 'd = {"x": {"y": 5}}\nprint(d["x"]["y"])', opts: ['5', '{"y": 5}', 'y', 'Error'], correct: 0, why: 'Ichma-ich kirish' },
            { q: 'd = {"a": 1, "b": 2}\nv = d.pop("a")\nprint(v, d)', opts: ["1 {'b': 2}", "1 {'a': 1, 'b': 2}", "{'b': 2}", 'Error'], correct: 0, why: 'pop qiymatni qaytaradi va kalitni o‘chiradi' }
          ] },
        { id: 'dt-3', title: 'Numeric Data Types, Booleans, and Sets', min: 65, py: [2, 25],
          lessons: ['Numeric data types', 'Choosing when to use integers and floats', 'Printing floats', 'Division with integers and floats', 'Booleans - The logical data type', 'More than just true and false', 'Comparisons', 'Truthy, True, Falsey, and False', 'Sets (unordered data with optimized logic operations)', 'Determining set differences', 'Finding all the data and the overlapping data between sets'],
          goals: { uz: ['int / float, / va // farqi, float aniqligi', 'Truthy/falsy: 0, "", [], None → False', 'set: union | intersection & difference -'], en: ['int / float, / vs //, float precision', 'Truthy/falsy: 0, "", [], None → False', 'set: union | intersection & difference -'] },
          quiz: [
            { q: 'print(7 // 2, 7 / 2)', opts: ['3 3', '3 3.5', '3.5 3', '4 3.5'], correct: 1, why: '// butun bo‘lish, / doim float' },
            { q: 'print(bool([]), bool("a"))', opts: ['True True', 'False True', 'False False', 'True False'], correct: 1, why: 'Bo‘sh ro‘yxat falsy, bo‘sh bo‘lmagan satr truthy' },
            { q: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b)', opts: ['{1, 2, 3, 4}', '{2, 3}', '{1}', '{4}'], correct: 1, why: '& — kesishma' },
            { q: 'print({1, 2, 3} - {2})', opts: ['{1, 3}', '{2}', '{1, 2, 3}', 'Error'], correct: 0, why: '- — ayirma' },
            { q: 'print(0.1 + 0.2 == 0.3)', opts: ['True', 'False', 'Error', '0.3'], correct: 1, why: 'float aniqligi: 0.30000000000000004' }
          ] },
        { id: 'dt-4', title: 'Advanced Data Types', min: 70, py: [26, 27, 28],
          lessons: ['Counting made easy', 'Using Counter on lists', 'Finding most common elements', 'Dictionaries of unknown structure - Defaultdict', 'Creating dictionaries of an unknown structure', "Safely appending to a key's value list", "What do you mean I don't have any class? Namedtuple", 'Creating namedtuples for storing data', 'Leveraging attributes on namedtuples', 'Dataclasses', 'Creating a dataclass', 'Using dataclasses', 'Wrap-up'],
          goals: { uz: ['Counter — sanash va .most_common()', 'defaultdict(list) — kalit yo‘q bo‘lsa avtomatik bo‘sh ro‘yxat', 'namedtuple va @dataclass — nomlangan maydonli yozuv'], en: ['Counter — counting and .most_common()', 'defaultdict(list) — auto-empty list for missing keys', 'namedtuple and @dataclass — records with named fields'] },
          quiz: [
            { q: 'from collections import Counter\nc = Counter("aab")\nprint(c["a"])', opts: ['1', '2', '3', 'Error'], correct: 1, why: 'Counter har belgini sanaydi' },
            { q: 'from collections import defaultdict\nd = defaultdict(list)\nd["k"].append(1)\nprint(d["k"])', opts: ['[1]', 'KeyError', 'None', '1'], correct: 0, why: 'Kalit yo‘q bo‘lsa list() chaqiriladi' },
            { q: 'from collections import namedtuple\nP = namedtuple("P", ["x", "y"])\np = P(1, 2)\nprint(p.y)', opts: ['1', '2', '(1, 2)', 'Error'], correct: 1, why: 'Maydonga nom bilan kirish' },
            { q: 'from dataclasses import dataclass\n@dataclass\nclass U:\n    name: str\n    age: int = 0\n\nprint(U("Ali"))', opts: ["U(name='Ali', age=0)", 'Ali', "<U object>", 'Error'], correct: 0, why: 'dataclass __init__ va __repr__ ni o‘zi yozadi' },
            { q: 'Counter([1, 1, 2]).most_common(1) returns …', opts: ['[(1, 2)]', '[(2, 1)]', '[1]', '2'], correct: 0, why: '(element, soni) juftligi' }
          ] }
      ] }
  ],

  /* Yakuniy loyiha — trekning 13-kuni */
  project: {
    id: 'proj', title: 'Creating Functions to Register App Users', min: 60, py: [11, 15],
    url: 'https://app.datacamp.com/learn/projects/creating-functions-to-register-app-users',
    desc: { uz: "Yangi foydalanuvchi ro'yxatdan o'tganda xatolarni ushlaydigan funksiyalar: nom/email/parol tekshiruvi, raise bilan xato, try/except.", en: 'Functions that catch errors when new users register: name/email/password validation, raising errors, try/except.' },
    lessons: ['validate_user(name, email, password, dob) — every rule as a check', 'raise ValueError with a clear message', 'register_user(...) — returns a dict or False', 'Test with valid and invalid data'],
    goals: { uz: ['Bir necha tekshiruvni bitta funksiyaga yig‘ish', 'raise / try / except — real ish oqimida', 'Lug‘at qaytaruvchi funksiya va False holati'], en: ['Combine several checks in one function', 'raise / try / except in a real flow', 'A function returning a dict, or False'] },
    quiz: [
      { q: 'def validate(name):\n    if not name:\n        raise ValueError("empty")\n    return True\n\ntry:\n    validate("")\nexcept ValueError as e:\n    print(e)', opts: ['True', 'empty', 'ValueError', 'Nothing'], correct: 1, why: 'Xabar except orqali chop etiladi' },
      { q: 'def register(name, email):\n    return {"name": name, "email": email}\n\nu = register("Ali", "a@b.c")\nprint(u["email"])', opts: ['Ali', 'a@b.c', "{'name': 'Ali'}", 'Error'], correct: 1, why: 'Lug‘atdan kalit bo‘yicha' },
      { q: 'Which check is a good email rule?', opts: ['"@" in email and "." in email', 'len(email) > 3 only', 'email.isdigit()', 'email == "email"'], correct: 0, why: 'Minimal tekshiruv: @ va nuqta' },
      { q: 'def ok(pw):\n    return len(pw) >= 8 and any(c.isdigit() for c in pw)\n\nprint(ok("abcdefg1"), ok("abcdefgh"))', opts: ['True True', 'True False', 'False True', 'False False'], correct: 1, why: 'Ikkinchisida raqam yo‘q' },
      { q: 'What should register_user return when validation fails?', opts: ['A dict with empty values', 'False (or raise)', 'None silently', 'The string "error"'], correct: 1, why: 'Loyiha qoidasi: False qaytaradi yoki xato ko‘taradi' }
    ]
  }
};
