/* UzLeeder Academy — 30 kunlik Python kursi (asosiy kontent)
   Har bir kun: day, type(topic|review), unit, title, intro, sections[], practice[], quiz[], konspekt[]
   Qoshimcha kontent: js/data/deep.js (chuqur tushuntirish) va js/data/explain.js (test izohlari) */
window.COURSE = [
  {
    "day": 1,
    "type": "topic",
    "unit": "Hafta 1 — Asoslar",
    "title": {
      "uz": "O'zgaruvchilar va turlar",
      "en": "Variables & Types"
    },
    "intro": {
      "uz": "Python sayohatimiz shu yerdan boshlanadi. O'zgaruvchi — ma'lumot saqlanadigan nomlangan quti. Bugun 4 ta asosiy ma'lumot turini o'rganamiz.",
      "en": "Our Python journey starts here. A variable is a named box that stores data. Today we learn the 4 basic data types."
    },
    "sections": [
      {
        "h": {
          "uz": "O'zgaruvchi — nomlangan quti",
          "en": "Variable — a named box"
        },
        "p": {
          "uz": "O'zgaruvchiga nom berasan va ichiga qiymat solasan. `=` belgisi \"o'ngdagini chapga sol\" degani — matematik tenglik emas. Nom harfdan boshlanadi, bo'sh joysiz, katta-kichik harf farqlanadi.",
          "en": "You name a variable and put a value inside. The `=` sign means \"put the right side into the left\" — not mathematical equality. Names start with a letter, no spaces, case-sensitive."
        },
        "code": "name = \"Akbar\"\nage = 20\nheight = 1.75\nstudent = True\n\nprint(name, age)   # Akbar 20"
      },
      {
        "h": {
          "uz": "4 ta ma'lumot turi",
          "en": "The 4 data types"
        },
        "p": {
          "uz": "Har qiymatning turi bor: int (butun son), float (kasr son), str (matn), bool (True/False). type() bilan tekshiriladi.",
          "en": "Every value has a type: int (whole number), float (decimal), str (text), bool (True/False). Check with type()."
        },
        "code": "age = 20          # int\nprice = 19.99     # float\nname = \"Max\"      # str\nactive = True     # bool\n\nprint(type(age))    # <class 'int'>\nprint(type(price))  # <class 'float'>"
      },
      {
        "h": {
          "uz": "Eng muhim: \"20\" ≠ 20",
          "en": "Most important: \"20\" ≠ 20"
        },
        "p": {
          "uz": "Matn va son boshqa narsa. \"2\" + \"2\" matnlarni yopishtiradi (\"22\"), 2 + 2 sonlarni qo'shadi (4). int(), float(), str() bilan aylantiriladi.",
          "en": "Text and number are different. \"2\" + \"2\" joins strings (\"22\"), 2 + 2 adds numbers (4). Convert with int(), float(), str()."
        },
        "code": "print(2 + 2)        # 4\nprint(\"2\" + \"2\")    # 22\n\ntext = \"25\"\nnum = int(text)     # convert to number\nprint(num + 5)      # 30"
      },
      {
        "h": {
          "uz": "Kirish va chiqish + f-string",
          "en": "Input, output & f-string"
        },
        "p": {
          "uz": "print() ekranga chiqaradi. input() foydalanuvchidan oladi — DOIM matn qaytaradi, son kerak bo'lsa int() bilan aylantir. f-string: matn ichiga o'zgaruvchini {} bilan qo'yasan.",
          "en": "print() shows on screen. input() takes from the user — ALWAYS returns text, convert with int() if you need a number. f-string: put variables inside text with {}."
        },
        "code": "name = input(\"Name: \")\nage = int(input(\"Age: \"))\n\nprint(f\"Hello {name}! Next year you turn {age + 1}.\")"
      }
    ],
    "practice": [
      {
        "uz": "O'zing haqingda 4 ta o'zgaruvchi yoz (ism, yosh, shahar, student) va print() bilan chiqar.",
        "en": "Write 4 variables about yourself (name, age, city, student) and print them."
      },
      {
        "uz": "type() bilan har birining turini chiqar.",
        "en": "Print each one's type with type()."
      },
      {
        "uz": "input() bilan ism so'ra, f-string bilan salomlash.",
        "en": "Ask for a name with input(), greet with an f-string."
      },
      {
        "uz": "Ikkita sonni input() bilan ol, int() ga aylantir, yig'indisini chiqar.",
        "en": "Take two numbers via input(), convert with int(), print the sum."
      },
      {
        "uz": "Do'kon narxi 50000, chegirma 15%. Yangi narxni hisobla.",
        "en": "Shop price 50000, discount 15%. Compute the new price."
      }
    ],
    "quiz": [
      {
        "q": "Which is a valid variable name?",
        "opts": [
          "2age",
          "open price",
          "open_price",
          "price-2"
        ],
        "correct": 2
      },
      {
        "q": "print(type(3.14)) outputs?",
        "opts": [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'str'>",
          "3.14"
        ],
        "correct": 1
      },
      {
        "q": "\"2\" + \"2\" gives?",
        "opts": [
          "4",
          "22",
          "\"2 2\"",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "input() always returns what type?",
        "opts": [
          "int",
          "float",
          "str",
          "depends"
        ],
        "correct": 2
      },
      {
        "q": "True belongs to which type?",
        "opts": [
          "int",
          "str",
          "bool",
          "float"
        ],
        "correct": 2
      },
      {
        "q": "ism=\"Max\"; print(f\"Hi {ism}!\") outputs?",
        "opts": [
          "Hi {ism}!",
          "Hi Max!",
          "Hi ism!",
          "f\"Hi Max!\""
        ],
        "correct": 1
      },
      {
        "q": "Convert text to a whole number with?",
        "opts": [
          "str()",
          "float()",
          "int()",
          "type()"
        ],
        "correct": 2
      },
      {
        "q": "yosh=input('Age: '); print(yosh + 5) — the problem?",
        "opts": [
          "print wrong",
          "yosh is str, can't add number",
          "input needs no text",
          "no problem"
        ],
        "correct": 1
      },
      {
        "q": "Which is a float?",
        "opts": [
          "20",
          "\"19.99\"",
          "19.99",
          "True"
        ],
        "correct": 2
      },
      {
        "q": "In Python, = does what?",
        "opts": [
          "Checks equality",
          "Assigns right side to left",
          "Compares",
          "Prints"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "O'zgaruvchi = nomlangan quti. name = \"Akbar\"",
        "= belgisi: o'ngdagini chapga sol (tenglik EMAS)",
        "4 tur: int (20), float (19.99), str (\"Max\"), bool (True/False)",
        "type() turini aytadi",
        "\"20\" (matn) ≠ 20 (son) — int() bilan aylantir",
        "\"2\"+\"2\"=\"22\", 2+2=4",
        "input() DOIM matn qaytaradi → int(input()) kerak",
        "f-string: f\"Salom {ism}\" — {} ichiga o'zgaruvchi"
      ],
      "en": [
        "Variable = named box. name = \"Akbar\"",
        "= sign: put right into left (NOT equality)",
        "4 types: int (20), float (19.99), str (\"Max\"), bool (True/False)",
        "type() tells the type",
        "\"20\" (text) ≠ 20 (number) — convert with int()",
        "\"2\"+\"2\"=\"22\", 2+2=4",
        "input() ALWAYS returns text → int(input()) needed",
        "f-string: f\"Hi {name}\" — variable inside {}"
      ]
    }
  },
  {
    "day": 2,
    "type": "topic",
    "unit": "Hafta 1 — Asoslar",
    "title": {
      "uz": "Operatorlar va ifodalar",
      "en": "Operators & expressions"
    },
    "intro": {
      "uz": "Operatorlar — bu qiymatlar ustida amal bajaradigan belgilar: qo'shish, taqqoslash, mantiq. Sertifikat imtihonlarida operatorlar tartibi va natija turi ko'p so'raladi. Bugun barcha asosiy operatorlarni va ular qaytaradigan qiymatlarni chuqur o'rganamiz.",
      "en": "Operators act on values: arithmetic, comparison, logic. Certification exams test operator precedence and result types heavily."
    },
    "sections": [
      {
        "h": {
          "uz": "Arifmetik operatorlar",
          "en": "Arithmetic operators"
        },
        "p": {
          "uz": "+ - * / oddiy. Lekin uchtasi muhim: // butun bo'lish (kasrsiz), % qoldiq (modulo), ** daraja. Sertifikatda 7 // 2 = 3 va 7 % 2 = 1 kabi savollar ko'p. / doim float qaytaradi (10/2 = 5.0), // butun qaytaradi.",
          "en": "+ - * / are basic. Three matter: // floor division, % modulo, ** power. / always returns float."
        },
        "code": "print(7 + 3)    # 10\nprint(7 / 2)    # 3.5  (float!)\nprint(7 // 2)   # 3    (butun bo'lish)\nprint(7 % 2)    # 1    (qoldiq)\nprint(2 ** 3)   # 8    (daraja)\nprint(10 / 2)   # 5.0  (/ doim float)"
      },
      {
        "h": {
          "uz": "Taqqoslash operatorlari",
          "en": "Comparison operators"
        },
        "p": {
          "uz": "== teng, != teng emas, > < >= <=. Natija DOIM bool (True/False). ENG MUHIM: = qiymat soladi, == tenglikni tekshiradi — bu ikkisini adashtirmaslik kerak. Taqqoslashni zanjir qilsa bo'ladi: 1 < x < 10.",
          "en": "==, !=, >, <, >=, <=. Result is ALWAYS bool. = assigns, == checks equality."
        },
        "code": "print(5 == 5)    # True\nprint(5 != 3)    # True\nprint(5 > 10)    # False\nx = 7\nprint(1 < x < 10)   # True (zanjir)\nprint(type(5 > 3))  # <class 'bool'>"
      },
      {
        "h": {
          "uz": "Mantiqiy operatorlar: and or not",
          "en": "Logical: and or not"
        },
        "p": {
          "uz": "and — ikkalasi True bo'lishi kerak. or — bittasi yetadi. not — teskarisi. Ular bool qiymatlar ustida ishlaydi. Sertifikatda 'qisqa tutashuv' (short-circuit) so'raladi: True or X da X tekshirilmaydi, False and X da ham X tekshirilmaydi.",
          "en": "and (both), or (either), not (flip). Short-circuit: True or X skips X; False and X skips X."
        },
        "code": "print(True and False)   # False\nprint(True or False)    # True\nprint(not True)         # False\n\n# Qisqa tutashuv:\nage = 20\nprint(age > 18 and age < 65)   # True\nprint(age < 10 or age > 15)    # True"
      },
      {
        "h": {
          "uz": "Operatorlar tartibi (precedence)",
          "en": "Operator precedence"
        },
        "p": {
          "uz": "Python amallarni ma'lum tartibda bajaradi: avval ** , keyin * / // % , keyin + - , keyin taqqoslash, oxirida and/or/not. Qavs () tartibni o'zgartiradi. Sertifikatda 2 + 3 * 4 = 14 (14 emas 20) kabi savollar bor.",
          "en": "Order: ** first, then * / // %, then + -, then comparisons, then not/and/or. Parentheses override."
        },
        "code": "print(2 + 3 * 4)      # 14 (* oldin)\nprint((2 + 3) * 4)    # 20 (qavs)\nprint(2 ** 3 ** 2)    # 512 (o'ngdan: 2**9)\nprint(10 - 2 - 3)     # 5  (chapdan)\nprint(True or False and False)  # True (and oldin)"
      }
    ],
    "practice": [
      {
        "uz": "// va % bilan: 17 ni 5 ga bo'lganda butun va qoldiqni chiqar.",
        "en": "17 // 5 and 17 % 5."
      },
      {
        "uz": "** bilan 2 ning 10-darajasini hisobla.",
        "en": "2 ** 10."
      },
      {
        "uz": "Zanjir taqqoslash: 0 < yosh < 120 shartini sinab ko'r.",
        "en": "Chain comparison 0 < age < 120."
      },
      {
        "uz": "and/or/not uchtasini bitta ifodada ishlat.",
        "en": "Combine and/or/not in one expression."
      },
      {
        "uz": "2 + 3 * 4 va (2 + 3) * 4 farqini ko'r, sababini tushuntir.",
        "en": "Compare 2+3*4 vs (2+3)*4."
      }
    ],
    "quiz": [
      {
        "q": "7 // 2 natijasi?",
        "opts": [
          "3.5",
          "3",
          "4",
          "1"
        ],
        "correct": 1
      },
      {
        "q": "7 % 3 natijasi?",
        "opts": [
          "2",
          "1",
          "0",
          "2.3"
        ],
        "correct": 1
      },
      {
        "q": "10 / 2 qanday tur qaytaradi?",
        "opts": [
          "int",
          "float (5.0)",
          "str",
          "bool"
        ],
        "correct": 1
      },
      {
        "q": "2 ** 4 natijasi?",
        "opts": [
          "8",
          "16",
          "6",
          "24"
        ],
        "correct": 1
      },
      {
        "q": "5 == 5 natijasi turi?",
        "opts": [
          "int",
          "bool",
          "str",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "True and False?",
        "opts": [
          "True",
          "False",
          "Xato",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "not (3 > 5)?",
        "opts": [
          "True",
          "False",
          "3",
          "Xato"
        ],
        "correct": 0
      },
      {
        "q": "2 + 3 * 4 natijasi?",
        "opts": [
          "20",
          "14",
          "24",
          "9"
        ],
        "correct": 1
      },
      {
        "q": "= va == farqi?",
        "opts": [
          "Bir xil",
          "= soladi, == tekshiradi",
          "== soladi",
          "Farqi yo'q"
        ],
        "correct": 1
      },
      {
        "q": "1 < 5 < 10 natijasi?",
        "opts": [
          "True",
          "False",
          "Xato",
          "1"
        ],
        "correct": 0
      }
    ],
    "konspekt": {
      "uz": [
        "+ - * / oddiy; / DOIM float (10/2=5.0)",
        "// butun bo'lish (7//2=3), % qoldiq (7%2=1)",
        "** daraja (2**3=8)",
        "==, !=, >, < — natija DOIM bool",
        "= soladi, == tekshiradi (adashtirma!)",
        "and ikkalasi, or bittasi, not teskari",
        "Tartib: ** → * / // % → + - → taqqoslash → and/or",
        "Qavs () tartibni o'zgartiradi",
        "Zanjir: 1 < x < 10 mumkin"
      ],
      "en": [
        "+ - * /; / always float",
        "// floor, % modulo",
        "** power",
        "comparisons return bool",
        "= assigns, == checks",
        "and/or/not",
        "precedence: ** first",
        "parentheses override",
        "chained comparisons"
      ]
    }
  },
  {
    "day": 3,
    "type": "topic",
    "unit": "Hafta 1 — Asoslar",
    "title": {
      "uz": "Kirish/chiqish va tur almashtirish",
      "en": "Input/output & type conversion"
    },
    "intro": {
      "uz": "Dastur foydalanuvchi bilan gaplashadi: print() bilan chiqaradi, input() bilan oladi. Lekin input() DOIM matn (string) qaytaradi — sertifikatda eng ko'p adashtiriladigan joy. Bugun kirish/chiqish va turlarni to'g'ri almashtirni chuqur o'rganamiz.",
      "en": "print() outputs, input() reads. But input() ALWAYS returns a string — the most common exam trap."
    },
    "sections": [
      {
        "h": {
          "uz": "print() va uning parametrlari",
          "en": "print() and its parameters"
        },
        "p": {
          "uz": "print() ekranga chiqaradi. Bir nechta qiymatni vergul bilan chiqarsa, orasiga bo'shliq qo'yadi. sep= ajratgichni, end= oxirini o'zgartiradi. Standart end='\\n' (yangi qator).",
          "en": "print() outputs. Multiple values separated by comma get a space. sep= and end= customize."
        },
        "code": "print(\"a\", \"b\", \"c\")           # a b c\nprint(\"a\", \"b\", sep=\"-\")        # a-b\nprint(\"Hello\", end=\" \")          # no newline\nprint(\"World\")                   # Hello World\nprint(1, 2, 3, sep=\", \")         # 1, 2, 3"
      },
      {
        "h": {
          "uz": "input() DOIM string qaytaradi",
          "en": "input() ALWAYS returns a string"
        },
        "p": {
          "uz": "input() foydalanuvchidan matn oladi va DOIM string qaytaradi — hatto raqam yozsa ham. Shuning uchun son kerak bo'lsa int() yoki float() bilan aylantirish SHART. Bu sertifikat imtihonining klassik savoli.",
          "en": "input() always returns a string, even for digits. Convert with int()/float() when you need a number."
        },
        "code": "age = input(\"Age: \")       # \"20\" (string!)\nprint(type(age))            # <class 'str'>\n\n# To'g'ri usul:\nage = int(input(\"Age: \"))   # 20 (int)\nprint(age + 1)              # 21 (ishlaydi)"
      },
      {
        "h": {
          "uz": "Tur almashtirish funksiyalari",
          "en": "Type conversion functions"
        },
        "p": {
          "uz": "int() butun songa, float() kasr songa, str() matnga, bool() mantiqga aylantiradi. Ehtiyot bo'l: int(\"abc\") xato beradi, int(\"3.5\") ham xato (avval float). int(3.9) = 3 (kesadi, yaxlitlamaydi).",
          "en": "int(), float(), str(), bool(). int('abc') errors; int(3.9)=3 (truncates)."
        },
        "code": "print(int(\"25\"))     # 25\nprint(float(\"3.14\")) # 3.14\nprint(str(100))      # \"100\"\nprint(int(3.9))      # 3 (kesadi!)\nprint(bool(0))       # False\nprint(bool(1))       # True"
      },
      {
        "h": {
          "uz": "f-string bilan chiqarish",
          "en": "Output with f-string"
        },
        "p": {
          "uz": "f-string — matn ichiga qiymat qo'yishning eng qulay usuli. f\"...\" oldiga f qo'yasan, {} ichiga o'zgaruvchi yoki ifoda. Sonlarni formatlash: {narx:.2f} ikki xona kasr, {son:5} kenglik.",
          "en": "f-strings embed values: f\"...{var}...\". Format numbers: {price:.2f}."
        },
        "code": "name = \"Max\"\nage = 20\nprint(f\"{name} is {age}\")       # Max is 20\nprint(f\"Sum: {5 + 3}\")          # Sum: 8\nprint(f\"Pi: {3.14159:.2f}\")     # Pi: 3.14\nprint(f\"{'hi':>5}\")             # '   hi' (o'ngga)"
      }
    ],
    "practice": [
      {
        "uz": "print() da sep va end parametrlarini sinab ko'r.",
        "en": "Try print() sep and end."
      },
      {
        "uz": "input() bilan son ol, type() bilan string ekanini ko'r, keyin int() qil.",
        "en": "input() → check type → convert."
      },
      {
        "uz": "int(3.9) va int('3') ni sinab ko'r, farqni tushuntir.",
        "en": "int(3.9) vs int('3')."
      },
      {
        "uz": "Ikki sonni input bilan olib, yig'indisini f-string bilan chiqar.",
        "en": "Sum two inputs, print with f-string."
      },
      {
        "uz": "bool(0), bool(''), bool('a'), bool(5) natijalarini ko'r.",
        "en": "bool(0), bool(''), bool('a'), bool(5)."
      }
    ],
    "quiz": [
      {
        "q": "input() qanday tur qaytaradi?",
        "opts": [
          "int",
          "str (DOIM)",
          "float",
          "vaziyatga qarab"
        ],
        "correct": 1
      },
      {
        "q": "int('20') natijasi?",
        "opts": [
          "'20'",
          "20",
          "20.0",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "int(3.9) natijasi?",
        "opts": [
          "4",
          "3",
          "3.9",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "int('abc') natijasi?",
        "opts": [
          "0",
          "abc",
          "Xato (ValueError)",
          "None"
        ],
        "correct": 2
      },
      {
        "q": "print('a','b',sep='-') chiqishi?",
        "opts": [
          "a b",
          "a-b",
          "ab",
          "a,b"
        ],
        "correct": 1
      },
      {
        "q": "print('x', end='') keyingi print?",
        "opts": [
          "Yangi qatorda",
          "Xuddi shu qatorda",
          "Xato",
          "Bo'sh"
        ],
        "correct": 1
      },
      {
        "q": "bool(0) natijasi?",
        "opts": [
          "True",
          "False",
          "0",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "bool('') (bo'sh string)?",
        "opts": [
          "True",
          "False",
          "Xato",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "yosh=input(); yosh+1 — muammo?",
        "opts": [
          "Yo'q",
          "yosh string, songa qo'shib bo'lmaydi",
          "input xato",
          "+1 xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{2*3}\" natijasi?",
        "opts": [
          "{2*3}",
          "6",
          "2*3",
          "Xato"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "print() chiqaradi; sep= ajratgich, end= oxir",
        "input() DOIM string qaytaradi (raqam ham)",
        "Son uchun: int(input()) yoki float(input())",
        "int() butun, float() kasr, str() matn, bool() mantiq",
        "int(3.9)=3 (kesadi, yaxlitlamaydi)",
        "int('abc') → ValueError",
        "bool(0)=False, bool('')=False, bool(5)=True",
        "f-string: f\"{ism}\", format f\"{narx:.2f}\""
      ],
      "en": [
        "print(); sep, end",
        "input() always str",
        "int()/float() to convert",
        "int(3.9)=3 truncates",
        "int('abc') errors",
        "bool falsy: 0, ''",
        "f-strings"
      ]
    }
  },
  {
    "day": 4,
    "type": "review",
    "unit": "Hafta 1 — Asoslar",
    "reviewOf": 3,
    "title": {
      "uz": "Takrorlash: Asoslar",
      "en": "Review: Basics"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) o'zgaruvchi = nomlangan quti, 4 tur (int/float/str/bool). (2) operatorlar: // butun, % qoldiq, ** daraja; ==/!= bool qaytaradi. (3) input() DOIM string, int()/float() bilan aylantir. (4) f-string formatlash.",
      "en": "Recap: variables & types; operators; input() returns str; f-strings."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Hisob-kitob mashinasi",
        "en": "Project: Calculator"
      },
      "desc": {
        "uz": "Foydalanuvchidan ikki son olib (input+int), to'rt amalni (+, -, *, /) bajaradigan va natijani f-string bilan chiroyli chiqaradigan dastur. // va % ni ham qo'sh.",
        "en": "Take two numbers, do 4 operations, print with f-string."
      },
      "starter": "a = float(input(\"Birinchi son: \"))\nb = float(input(\"Ikkinchi son: \"))\n\nprint(f\"{a} + {b} = {a + b}\")\nprint(f\"{a} - {b} = {a - b}\")\nprint(f\"{a} * {b} = {a * b}\")\nif b != 0:\n    print(f\"{a} / {b} = {a / b:.2f}\")\nelse:\n    print(\"Nolga bo'lib bo'lmaydi\")"
    },
    "practice": [
      {
        "uz": "// va % bilan qoldiqli bo'lishni ko'rsat.",
        "en": "Show floor division and modulo."
      },
      {
        "uz": "input() bilan olingan qiymat turini tekshir.",
        "en": "Check input() type."
      },
      {
        "uz": "f-string bilan narxni 2 xona kasr chiqar.",
        "en": "Format price with f-string."
      }
    ],
    "quiz": [
      {
        "q": "7 // 2?",
        "opts": [
          "3.5",
          "3",
          "4",
          "1"
        ],
        "correct": 1
      },
      {
        "q": "input() turi?",
        "opts": [
          "int",
          "str",
          "float",
          "bool"
        ],
        "correct": 1
      },
      {
        "q": "int('20')?",
        "opts": [
          "'20'",
          "20",
          "20.0",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "2 ** 3?",
        "opts": [
          "6",
          "8",
          "9",
          "5"
        ],
        "correct": 1
      },
      {
        "q": "10 % 3?",
        "opts": [
          "3",
          "1",
          "0",
          "3.3"
        ],
        "correct": 1
      },
      {
        "q": "5 == 5 turi?",
        "opts": [
          "int",
          "bool",
          "str",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "int(3.9)?",
        "opts": [
          "4",
          "3",
          "3.9",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{2+3}\"?",
        "opts": [
          "{2+3}",
          "5",
          "2+3",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "10 / 2 turi?",
        "opts": [
          "int",
          "float",
          "str",
          "bool"
        ],
        "correct": 1
      },
      {
        "q": "bool(0)?",
        "opts": [
          "True",
          "False",
          "0",
          "Xato"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "o'zgaruvchi = nomlangan quti; int/float/str/bool",
        "// butun, % qoldiq, ** daraja",
        "/ DOIM float; == natija bool",
        "input() DOIM string → int()/float()",
        "int(3.9)=3 (kesadi)",
        "f-string: f\"{x}\", f\"{narx:.2f}\""
      ],
      "en": [
        "variables & types",
        "// % **",
        "input() str",
        "f-strings"
      ]
    }
  },
  {
    "day": 5,
    "type": "topic",
    "unit": "Hafta 1 — Asoslar",
    "title": {
      "uz": "Shartlar (conditionals)",
      "en": "Conditionals"
    },
    "intro": {
      "uz": "AI'da har qaror — bu shart. \"Bu rasm mushukmi?\" → if. Bugun qaror qabul qilishni o'rganamiz.",
      "en": "In AI every decision is a condition. \"Is this a cat?\" → if. Today we learn to make decisions."
    },
    "sections": [
      {
        "h": {
          "uz": "if / else",
          "en": "if / else"
        },
        "p": {
          "uz": "if — \"agar\". Shart to'g'ri bo'lsa ichdagi kod ishlaydi. else — aks holda. Ikkisidan faqat bittasi ishlaydi.",
          "en": "if — \"if\". If the condition is true, the inner code runs. else — otherwise. Only one of the two runs."
        },
        "code": "age = 20\n\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Minor\")"
      },
      {
        "h": {
          "uz": "Solishtirish: = va == farqi",
          "en": "Comparison: = vs =="
        },
        "p": {
          "uz": "== teng, != teng emas, > < >= <=. ENG MUHIM: = qiymat soladi, == tenglikni tekshiradi. Natija True/False (bool).",
          "en": "== equal, != not equal, > < >= <=. MOST IMPORTANT: = assigns, == checks equality. Result is True/False (bool)."
        },
        "code": "age = 18       # ONE =: assign\nprint(age == 18)   # True  (TWO ==: check)\nprint(age != 20)   # True\nprint(age > 18)    # False\nprint(age >= 18)   # True"
      },
      {
        "h": {
          "uz": "elif — ko'p shart",
          "en": "elif — many conditions"
        },
        "p": {
          "uz": "elif = else if. Python yuqoridan pastga tekshiradi, BIRINCHI to'g'ri shartda to'xtaydi. Tartib muhim: katta shartdan kichikka!",
          "en": "elif = else if. Python checks top to bottom, STOPS at the FIRST true condition. Order matters: big to small!"
        },
        "code": "mark = 75\n\nif mark >= 90:\n    print(\"Excellent\")\nelif mark >= 70:\n    print(\"Good\")\nelif mark >= 60:\n    print(\"Pass\")\nelse:\n    print(\"Fail\")"
      },
      {
        "h": {
          "uz": "and / or / not",
          "en": "and / or / not"
        },
        "p": {
          "uz": "and — ikkalasi ham True bo'lishi kerak. or — bittasi yetadi. not — teskarisiga. Natija doim True/False.",
          "en": "and — both must be True. or — one is enough. not — flips it. Result is always True/False."
        },
        "code": "age = 25\nhas_pass = True\n\nif age >= 18 and has_pass:\n    print(\"Can travel\")\n\nday = \"sat\"\nif day == \"sat\" or day == \"sun\":\n    print(\"Weekend\")\n\nprint(True and False)   # False\nprint(True or False)    # True\nprint(not True)         # False"
      }
    ],
    "practice": [
      {
        "uz": "Yoshni tekshir: 18+ 'Voyaga yetgan', aks holda 'Yosh'.",
        "en": "Check age: 18+ 'Adult', else 'Minor'."
      },
      {
        "uz": "Baho darajasini elif bilan aniqla (90 A'lo, 70 Yaxshi, 60 O'rta, past Yiqildi).",
        "en": "Determine grade with elif (90 Excellent, 70 Good, 60 Pass, low Fail)."
      },
      {
        "uz": "and bilan tekshir: yosh 18+ VA ishlaydi bo'lsa 'kredit'.",
        "en": "Check with and: age 18+ AND employed → 'credit'."
      },
      {
        "uz": "or bilan: shanba yoki yakshanba bo'lsa 'dam olish'.",
        "en": "With or: saturday or sunday → 'weekend'."
      },
      {
        "uz": "True and False, True or False, not True natijalarini chiqar.",
        "en": "Print True and False, True or False, not True."
      }
    ],
    "quiz": [
      {
        "q": "= vs == difference?",
        "opts": [
          "None",
          "= assigns, == checks equality",
          "== assigns, = checks",
          "== numbers only"
        ],
        "correct": 1
      },
      {
        "q": "print(20 != 20) outputs?",
        "opts": [
          "True",
          "False",
          "20",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "age=15; if age>=18: 'Big' else: 'Small' — output?",
        "opts": [
          "Big",
          "Small",
          "Both",
          "Nothing"
        ],
        "correct": 1
      },
      {
        "q": "mark=85; grade with elif (90/70/30) — output?",
        "opts": [
          "Excellent",
          "Good",
          "Good & Pass",
          "Pass"
        ],
        "correct": 1
      },
      {
        "q": "if mark>=60 BEFORE elif mark>=90 — bug?",
        "opts": [
          "elif wrong",
          "Order reversed, 95 hits 60 first",
          "No else",
          "No bug"
        ],
        "correct": 1
      },
      {
        "q": "True and False?",
        "opts": [
          "True",
          "False",
          "Error",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "True or False?",
        "opts": [
          "True",
          "False",
          "Error",
          "None"
        ],
        "correct": 0
      },
      {
        "q": "if age>=18 and passport: — runs when?",
        "opts": [
          "age 18+ only",
          "passport only",
          "both true",
          "one true"
        ],
        "correct": 2
      },
      {
        "q": "not True?",
        "opts": [
          "True",
          "False",
          "not",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "age=25; type(age > 18)?",
        "opts": [
          "int",
          "bool",
          "str",
          "True"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "if shart: — agar to'g'ri bo'lsa",
        "else: — aks holda. Faqat bittasi ishlaydi",
        "= soladi, == tekshiradi (FARQ MUHIM)",
        "==, !=, >, <, >=, <= — natija True/False",
        "elif — ko'p shart, birinchi to'g'rida to'xtaydi",
        "Tartib: katta shartdan kichikka!",
        "and — ikkalasi ham, or — bittasi, not — teskari",
        "and/or/not natijasi doim bool"
      ],
      "en": [
        "if condition: — if true",
        "else: — otherwise. Only one runs",
        "= assigns, == checks (KEY DIFFERENCE)",
        "==, !=, >, <, >=, <= — result True/False",
        "elif — many conditions, stops at first true",
        "Order: big condition to small!",
        "and — both, or — one, not — flip",
        "and/or/not always give bool"
      ]
    }
  },
  {
    "day": 6,
    "type": "topic",
    "unit": "Hafta 1 — Asoslar",
    "title": {
      "uz": "Listlar",
      "en": "Lists"
    },
    "intro": {
      "uz": "Bitta quti — bitta qiymat edi. List — bitta nomda ko'p qiymat. Dataset shu yerdan boshlanadi.",
      "en": "One box held one value. A list holds many values under one name. Datasets start here."
    },
    "sections": [
      {
        "h": {
          "uz": "List yaratish va indexing",
          "en": "Creating lists & indexing"
        },
        "p": {
          "uz": "Kvadrat qavs [] ichida, vergul bilan. Har element index'da — 0 dan boshlanadi! [-1] oxirgi element. len() uzunlikni beradi.",
          "en": "Square brackets [], comma-separated. Each element has an index — starting from 0! [-1] is the last. len() gives length."
        },
        "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\n#           0        1         2\n\nprint(fruits[0])    # apple\nprint(fruits[-1])   # cherry (last)\nprint(len(fruits))  # 3"
      },
      {
        "h": {
          "uz": "Slicing — bo'lak olish",
          "en": "Slicing — taking a slice"
        },
        "p": {
          "uz": "[start:stop] — stop KIRMAYDI! Nechta element: stop − start. Uchinchi raqam qadam: [::2] har ikkinchisi.",
          "en": "[start:stop] — stop is EXCLUDED! Count: stop − start. Third number is step: [::2] every second."
        },
        "code": "nums = [10, 20, 30, 40, 50]\n\nprint(nums[1:3])   # [20, 30]\nprint(nums[:3])    # [10, 20, 30]\nprint(nums[-2:])   # [40, 50]\nprint(nums[::2])   # [10, 30, 50]"
      },
      {
        "h": {
          "uz": "Metodlar",
          "en": "Methods"
        },
        "p": {
          "uz": "append() oxiriga qo'shadi, insert() joyga qo'shadi, remove() qiymatni o'chiradi, pop() o'chiradi va qaytaradi, sort() tartiblaydi.",
          "en": "append() adds to end, insert() adds at position, remove() deletes by value, pop() removes and returns, sort() orders."
        },
        "code": "fruits = [\"apple\", \"banana\"]\nfruits.append(\"cherry\")   # add to end\nfruits.insert(0, \"mango\")  # add at index 0\nfruits.remove(\"banana\")   # remove by value\nlast = fruits.pop()        # remove & return last\nfruits.sort()              # alphabetical"
      },
      {
        "h": {
          "uz": "Listda statistika",
          "en": "Stats on a list"
        },
        "p": {
          "uz": "len(), sum(), max(), min() — listda ishlaydi. sum()/len() = o'rtacha (mean). Bu — ML'ning birinchi qadami, NumPy'da .mean().",
          "en": "len(), sum(), max(), min() work on lists. sum()/len() = average (mean). This is ML's first step, .mean() in NumPy."
        },
        "code": "marks = [5, 4, 3, 5, 4]\n\nprint(len(marks))   # 5\nprint(sum(marks))   # 21\nprint(max(marks))   # 5\naverage = sum(marks) / len(marks)\nprint(average)      # 4.2"
      }
    ],
    "practice": [
      {
        "uz": "3 ta list yarat (matn, son, aralash). len() bilan chiqar.",
        "en": "Create 3 lists (text, numbers, mixed). Print with len()."
      },
      {
        "uz": "5 shaharlik list. [0], [2], [-1] ni chiqar, keyin [10] bilan xatoni ko'r.",
        "en": "5-city list. Print [0], [2], [-1], then see the error with [10]."
      },
      {
        "uz": "6 elementli list. [1:4], [:3], [::2] ni bashorat qil, keyin tekshir.",
        "en": "6-element list. Predict [1:4], [:3], [::2], then verify."
      },
      {
        "uz": "append, insert, remove, pop, sort — beshtasini sinab ko'r.",
        "en": "Try all five: append, insert, remove, pop, sort."
      },
      {
        "uz": "Baholar listidan len, sum, max, min va o'rtachani hisobla.",
        "en": "From a marks list compute len, sum, max, min and average."
      }
    ],
    "quiz": [
      {
        "q": "First element of a list is at index?",
        "opts": [
          "1",
          "0",
          "-1",
          "[0:1]"
        ],
        "correct": 1
      },
      {
        "q": "m=[\"a\",\"b\",\"c\"]; print(m[-1]) outputs?",
        "opts": [
          "a",
          "c",
          "b",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "len([10,20,30,40]) is?",
        "opts": [
          "3",
          "4",
          "100",
          "list"
        ],
        "correct": 1
      },
      {
        "q": "n=[10,20,30,40,50]; n[1:3] gives?",
        "opts": [
          "[20,30,40]",
          "[10,20,30]",
          "[20,30]",
          "[20]"
        ],
        "correct": 2
      },
      {
        "q": "Add to the END of a list with?",
        "opts": [
          "insert()",
          "append()",
          "add()",
          "pop()"
        ],
        "correct": 1
      },
      {
        "q": "m=[\"a\",\"b\",\"c\"]; m[1]=\"x\"; print(m)?",
        "opts": [
          "['a','b','c']",
          "['x','b','c']",
          "['a','x','c']",
          "Error"
        ],
        "correct": 2
      },
      {
        "q": "Difference between [] and ()?",
        "opts": [
          "None",
          "[] list mutable, () tuple immutable",
          "[] numbers only",
          "() faster"
        ],
        "correct": 1
      },
      {
        "q": "s=(1,2,3); s.append(4) — why error?",
        "opts": [
          "append misspelled",
          "tuple has no append",
          "need quotes",
          "no error"
        ],
        "correct": 1
      },
      {
        "q": "Average of a marks list?",
        "opts": [
          "max/len",
          "sum*len",
          "sum/len",
          "len/sum"
        ],
        "correct": 2
      },
      {
        "q": "h=[\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"]; h[::2]?",
        "opts": [
          "['a','b']",
          "['a','c','e']",
          "['b','d','f']",
          "all"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "List = bir nomda ko'p qiymat: [5, 4, 3]",
        "Index 0 dan boshlanadi. [-1] = oxirgi",
        "len() uzunlik, sum() yig'indi, max()/min()",
        "Slicing [start:stop] — stop KIRMAYDI",
        "Nechta element = stop − start",
        "[::2] = har ikkinchisi (step)",
        "append() qo'shadi, remove() o'chiradi, sort() tartiblaydi",
        "o'rtacha = sum()/len() → NumPy'da .mean()",
        "[] list o'zgaruvchan, () tuple o'zgarmas"
      ],
      "en": [
        "List = many values in one name: [5, 4, 3]",
        "Index starts at 0. [-1] = last",
        "len() length, sum() total, max()/min()",
        "Slicing [start:stop] — stop EXCLUDED",
        "Count = stop − start",
        "[::2] = every second (step)",
        "append() adds, remove() deletes, sort() orders",
        "average = sum()/len() → .mean() in NumPy",
        "[] list mutable, () tuple immutable"
      ]
    }
  },
  {
    "day": 7,
    "type": "review",
    "unit": "Hafta 1 — Asoslar",
    "reviewOf": 6,
    "title": {
      "uz": "Takrorlash: Shart va list",
      "en": "Review: Conditions & lists"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) if/elif/else — qaror, = soladi == tekshiradi. (2) and/or/not — bool. (3) list: index 0 dan, [-1] oxirgi, slicing [start:stop]. (4) append/remove/sort. (5) sum()/len()=o'rtacha.",
      "en": "Recap: if/elif/else; and/or/not; lists, indexing, slicing, methods."
    },
    "project": {
      "title": {
        "uz": "Haftalik loyiha: Baholar tahlilchisi",
        "en": "Weekly project: Grade analyzer"
      },
      "desc": {
        "uz": "Baholar listini olib, loop va if bilan o'rtacha, eng yuqori, eng past va o'tganlar sonini (60+) hisoblaydigan dastur. Birinchi haftaning hamma narsasi birga.",
        "en": "Analyze a grades list: average, max, min, count passing."
      },
      "starter": "grades = [85, 45, 92, 78, 63, 95, 55, 88]\n\ntotal = sum(grades)\naverage = total / len(grades)\npassed = 0\nfor g in grades:\n    if g >= 60:\n        passed += 1\n\nprint(f\"O'rtacha: {average:.1f}\")\nprint(f\"Eng yuqori: {max(grades)}, eng past: {min(grades)}\")\nprint(f\"O'tganlar: {passed} / {len(grades)}\")"
    },
    "practice": [
      {
        "uz": "if/elif bilan bahoni A/B/C/F ga aylantir.",
        "en": "Grade to letter with if/elif."
      },
      {
        "uz": "Listning teskarisini [::-1] bilan chiqar.",
        "en": "Reverse a list."
      },
      {
        "uz": "and bilan ikki shartni birga tekshir.",
        "en": "Combine two conditions with and."
      }
    ],
    "quiz": [
      {
        "q": "= va == farqi?",
        "opts": [
          "Bir xil",
          "= soladi, == tekshiradi",
          "== soladi",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "[10,20,30][-1]?",
        "opts": [
          "10",
          "30",
          "20",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "[1,2,3,4][1:3]?",
        "opts": [
          "[1,2]",
          "[2,3]",
          "[2,3,4]",
          "[1,2,3]"
        ],
        "correct": 1
      },
      {
        "q": "True and False?",
        "opts": [
          "True",
          "False",
          "Xato",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "Listga oxiriga qo'shish?",
        "opts": [
          "insert()",
          "append()",
          "add()",
          "pop()"
        ],
        "correct": 1
      },
      {
        "q": "elif nima?",
        "opts": [
          "else",
          "else if (ko'p shart)",
          "if",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "sum([1,2,3])/len([1,2,3])?",
        "opts": [
          "6",
          "2.0",
          "3",
          "1"
        ],
        "correct": 1
      },
      {
        "q": "[1,2,3].sort() nima qiladi?",
        "opts": [
          "O'chiradi",
          "Tartiblaydi",
          "Qo'shadi",
          "Nusxa"
        ],
        "correct": 1
      },
      {
        "q": "not True?",
        "opts": [
          "True",
          "False",
          "not",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "List index 0 dan boshlanadimi?",
        "opts": [
          "Yo'q, 1 dan",
          "Ha, 0 dan",
          "-1 dan",
          "Farqi yo'q"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "if/elif/else — qaror; = soladi, == tekshiradi",
        "and/or/not — natija bool",
        "list: index 0 dan, [-1] oxirgi",
        "slicing [start:stop] — stop kirmaydi",
        "append/insert/remove/sort",
        "sum()/len() = o'rtacha"
      ],
      "en": [
        "if/elif/else",
        "and/or/not",
        "lists & slicing",
        "methods",
        "average"
      ]
    }
  },
  {
    "day": 8,
    "type": "topic",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "title": {
      "uz": "Loops (takrorlash)",
      "en": "Loops"
    },
    "intro": {
      "uz": "sum() Python berdi. Endi QANDAY hisoblaganini o'zing yozasan. Loop'siz AI yo'q.",
      "en": "sum() came from Python. Now you write HOW it computes. No AI without loops."
    },
    "sections": [
      {
        "h": {
          "uz": "for — list bo'ylab aylanish",
          "en": "for — iterating a list"
        },
        "p": {
          "uz": "for har elementni navbatma-navbat oladi. 2 ta majburiy: oxirida :, ichki qator surilgan (indentation).",
          "en": "for takes each element in turn. 2 mandatory things: : at the end, indented inner line (indentation)."
        },
        "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\n\nfor fruit in fruits:\n    print(fruit)\n\n# apple / banana / cherry"
      },
      {
        "h": {
          "uz": "range() — sonlar ketma-ketligi",
          "en": "range() — number sequence"
        },
        "p": {
          "uz": "range() sonlar yasaydi. 0 dan boshlaydi, oxiri kirmaydi (slicing'dagidek). range(0,10,2) qadam bilan.",
          "en": "range() makes numbers. Starts from 0, end excluded (like slicing). range(0,10,2) with step."
        },
        "code": "for i in range(5):\n    print(i)          # 0 1 2 3 4\n\nfor i in range(1, 6):\n    print(i)          # 1 2 3 4 5\n\nfor i in range(0, 10, 2):\n    print(i)          # 0 2 4 6 8"
      },
      {
        "h": {
          "uz": "Loop bilan hisob + while",
          "en": "Computing with loops + while"
        },
        "p": {
          "uz": "Bo'sh idishdan boshlab, har element qo'shiladi — bu sum() ichida bo'layotgan ish. while shart to'g'ri bo'lguncha aylanadi — son += 1 ni unutma, aks holda cheksiz loop!",
          "en": "Start from empty, add each element — this is what happens inside sum(). while loops while a condition is true — don't forget son += 1 or it's an infinite loop!"
        },
        "code": "nums = [5, 4, 3]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)          # 12\n\ncount = 1\nwhile count <= 3:\n    print(count)\n    count += 1        # important!"
      },
      {
        "h": {
          "uz": "break va continue",
          "en": "break and continue"
        },
        "p": {
          "uz": "break loopni butunlay to'xtatadi. continue faqat shu aylanishni o'tkazadi.",
          "en": "break stops the loop entirely. continue skips just this iteration."
        },
        "code": "for i in range(10):\n    if i == 5:\n        break         # stop at 5\n    print(i)          # 0 1 2 3 4\n\nfor i in range(5):\n    if i == 2:\n        continue      # skip 2\n    print(i)          # 0 1 3 4"
      }
    ],
    "practice": [
      {
        "uz": "5 shaharlik listni for bilan aylantirib chiqar.",
        "en": "Iterate and print a 5-city list with for."
      },
      {
        "uz": "range(5), range(1,6), range(0,10,2) ni sinab ko'r.",
        "en": "Try range(5), range(1,6), range(0,10,2)."
      },
      {
        "uz": "Baholar yig'indisini LOOP bilan hisobla (sum() ishlatmasdan).",
        "en": "Compute a marks sum with a LOOP (without sum())."
      },
      {
        "uz": "while bilan 1 dan 5 gacha chiqar. count += 1 ni unutma!",
        "en": "Print 1 to 5 with while. Don't forget count += 1!"
      },
      {
        "uz": "break: 5 da to'xta. continue: 2 ni o'tkaz.",
        "en": "break: stop at 5. continue: skip 2."
      }
    ],
    "quiz": [
      {
        "q": "for i in range(3): print(i) outputs?",
        "opts": [
          "1 2 3",
          "0 1 2",
          "0 1 2 3",
          "1 2"
        ],
        "correct": 1
      },
      {
        "q": "for needs what (mandatory)?",
        "opts": [
          "only :",
          "only indentation",
          "both : and indentation",
          "nothing"
        ],
        "correct": 2
      },
      {
        "q": "range(1, 5) gives?",
        "opts": [
          "1 2 3 4 5",
          "0 1 2 3 4",
          "1 2 3 4",
          "1 2 3 4 5 6"
        ],
        "correct": 2
      },
      {
        "q": "son=1; while son<=5: print(son) — problem?",
        "opts": [
          "while wrong",
          "no son += 1, infinite loop",
          "no :",
          "no problem"
        ],
        "correct": 1
      },
      {
        "q": "for i in range(6): if i==3: break; print(i)?",
        "opts": [
          "0 1 2",
          "0 1 2 3",
          "0 1 2 4 5",
          "0-5"
        ],
        "correct": 0
      },
      {
        "q": "for i in range(5): if i==2: continue; print(i)?",
        "opts": [
          "0 1 2 3 4",
          "0 1 3 4",
          "0 1",
          "2"
        ],
        "correct": 1
      },
      {
        "q": "nums=[10,20,30]; total=0; for n in nums: total+=n; print(total)?",
        "opts": [
          "10",
          "30",
          "60",
          "[10,20,30]"
        ],
        "correct": 2
      },
      {
        "q": "range(0, 10, 2) gives?",
        "opts": [
          "0 1 2...10",
          "0 2 4 6 8",
          "0 2 4 6 8 10",
          "2 4 6 8 10"
        ],
        "correct": 1
      },
      {
        "q": "break vs continue?",
        "opts": [
          "Same",
          "break stops loop, continue skips iteration",
          "continue stops",
          "both stop"
        ],
        "correct": 1
      },
      {
        "q": "Why not use 'sum' as a variable name?",
        "opts": [
          "Too long",
          "sum is a Python function, you overwrite it",
          "Numbers only",
          "No reason"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "Loop = kodni takrorlash",
        "for element in list: — har birini oladi",
        "2 majburiy: : va indentation (surish)",
        "range(5) = 0 1 2 3 4 (5 kirmaydi)",
        "range(1,6), range(0,10,2) — start, stop, step",
        "total += n → sum() ichi",
        "while shart: — shart to'g'ri bo'lguncha",
        "son += 1 unutma → cheksiz loop!",
        "break to'xtatadi, continue o'tkazadi",
        "'sum' ni o'zgaruvchi qilma — band nom"
      ],
      "en": [
        "Loop = repeating code",
        "for element in list: — takes each one",
        "2 mandatory: : and indentation",
        "range(5) = 0 1 2 3 4 (5 excluded)",
        "range(1,6), range(0,10,2) — start, stop, step",
        "total += n → inside of sum()",
        "while condition: — while true",
        "don't forget count += 1 → infinite loop!",
        "break stops, continue skips",
        "don't use 'sum' as a name — reserved"
      ]
    }
  },
  {
    "day": 9,
    "type": "topic",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "title": {
      "uz": "Loops: while, break, continue",
      "en": "Loops: while, break, continue"
    },
    "intro": {
      "uz": "for ma'lum sonli takror uchun edi. while esa SHART to'g'ri bo'lguncha aylanadi — necha marta ekani oldindan noma'lum. Bu foydalanuvchi to'g'ri javob berguncha so'rash kabi holatlar uchun. Sertifikatda cheksiz loop va break/continue ko'p so'raladi.",
      "en": "while loops while a condition is true — count unknown in advance. Exams test infinite loops and break/continue."
    },
    "sections": [
      {
        "h": {
          "uz": "while asoslari",
          "en": "while basics"
        },
        "p": {
          "uz": "while shart: — shart True bo'lguncha ichidagi kod takrorlanadi. ENG MUHIM: ichida shartni o'zgartiradigan narsa bo'lishi kerak (masalan count += 1), aks holda CHEKSIZ loop — dastur qotadi. Bu klassik xato.",
          "en": "while condition: repeats while true. MUST change the condition inside (count += 1) or infinite loop."
        },
        "code": "count = 1\nwhile count <= 5:\n    print(count)\n    count += 1     # MUHIM! aks holda cheksiz\n\n# Chiqishi: 1 2 3 4 5"
      },
      {
        "h": {
          "uz": "break — loopni to'xtatish",
          "en": "break — stop the loop"
        },
        "p": {
          "uz": "break loopni BUTUNLAY to'xtatadi va undan chiqadi. Ko'pincha while True: (cheksiz) bilan birga ishlatiladi — ma'lum shart bajarilganda break bilan chiqiladi. Bu 'to'g'ri javob kelguncha so'rash' uchun ideal.",
          "en": "break stops the loop entirely. Often used with while True: and an exit condition."
        },
        "code": "while True:\n    answer = input(\"Parol: \")\n    if answer == \"1234\":\n        print(\"To'g'ri!\")\n        break         # loopdan chiqadi\n    print(\"Xato, qayta urin\")"
      },
      {
        "h": {
          "uz": "continue — o'tkazib yuborish",
          "en": "continue — skip iteration"
        },
        "p": {
          "uz": "continue joriy aylanishni to'xtatib, KEYINGISIGA o'tadi (loopdan chiqmaydi). Masalan faqat juft sonlarni chiqarish uchun toqlarni continue bilan o'tkazasan. break va continue farqini sertifikat ko'p so'raydi.",
          "en": "continue skips the rest of this iteration, moves to the NEXT (doesn't exit the loop)."
        },
        "code": "for i in range(1, 6):\n    if i == 3:\n        continue      # 3 ni o'tkazadi\n    print(i)          # 1 2 4 5 (3 yo'q)\n\n# break bo'lsa edi: 1 2 (3 da to'xtardi)"
      },
      {
        "h": {
          "uz": "while + else va sanash",
          "en": "while + else and counting"
        },
        "p": {
          "uz": "while da ham else bo'ladi: loop NORMAL tugaganda (break'siz) ishlaydi. Agar break bilan chiqilsa, else ishlamaydi. while ko'pincha sanash, yig'ish, foydalanuvchi kiritishini tekshirish uchun ishlatiladi.",
          "en": "while can have else: runs when loop ends normally (no break). Skipped if break exits."
        },
        "code": "n = 5\nwhile n > 0:\n    print(n)\n    n -= 1\nelse:\n    print(\"Tugadi!\")   # normal tugadi\n\n# Chiqishi: 5 4 3 2 1 Tugadi!"
      }
    ],
    "practice": [
      {
        "uz": "while bilan 1 dan 10 gacha chiqar (count += 1 ni unutma).",
        "en": "Print 1-10 with while."
      },
      {
        "uz": "while True + break bilan 'sonni top' o'yini yoz.",
        "en": "Guess game with while True + break."
      },
      {
        "uz": "continue bilan 1-10 orasida faqat toq sonlarni chiqar.",
        "en": "Print odd numbers with continue."
      },
      {
        "uz": "while bilan sonlar yig'indisini hisobla (0 kiritilguncha).",
        "en": "Sum inputs until 0."
      },
      {
        "uz": "break va continue farqini bir loopda ko'rsat.",
        "en": "Show break vs continue difference."
      }
    ],
    "quiz": [
      {
        "q": "while qachon aylanadi?",
        "opts": [
          "Ma'lum marta",
          "Shart True bo'lguncha",
          "Bir marta",
          "Hech qachon"
        ],
        "correct": 1
      },
      {
        "q": "while count<=5 da count += 1 bo'lmasa?",
        "opts": [
          "Bir marta",
          "Cheksiz loop (qotadi)",
          "Xato",
          "5 marta"
        ],
        "correct": 1
      },
      {
        "q": "break nima qiladi?",
        "opts": [
          "O'tkazadi",
          "Loopni to'xtatadi (chiqadi)",
          "Qayta boshlaydi",
          "Hech narsa"
        ],
        "correct": 1
      },
      {
        "q": "continue nima qiladi?",
        "opts": [
          "Loopni to'xtatadi",
          "Joriyni o'tkazib, keyingiga o'tadi",
          "Qotadi",
          "Chiqadi"
        ],
        "correct": 1
      },
      {
        "q": "for i in range(5): if i==2: continue — chiqishi?",
        "opts": [
          "0 1 2 3 4",
          "0 1 3 4",
          "0 1",
          "2"
        ],
        "correct": 1
      },
      {
        "q": "for i in range(5): if i==2: break — chiqishi?",
        "opts": [
          "0 1",
          "0 1 3 4",
          "0 1 2",
          "2 3 4"
        ],
        "correct": 0
      },
      {
        "q": "while True: — o'zi qachon to'xtaydi?",
        "opts": [
          "Avtomatik",
          "break bo'lmasa hech qachon",
          "5 dan keyin",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "while else qachon ishlaydi?",
        "opts": [
          "Har doim",
          "Loop break'siz tugaganda",
          "break bo'lganda",
          "Hech qachon"
        ],
        "correct": 1
      },
      {
        "q": "n=3; while n>0: print(n); n-=1 — oxirgi son?",
        "opts": [
          "0",
          "1",
          "3",
          "-1"
        ],
        "correct": 1
      },
      {
        "q": "break va continue farqi?",
        "opts": [
          "Bir xil",
          "break chiqadi, continue o'tkazadi",
          "continue chiqadi",
          "Farqi yo'q"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "while shart: — shart True bo'lguncha aylanadi",
        "Ichida shartni o'zgartir (count += 1) — aks holda CHEKSIZ",
        "break — loopdan butunlay chiqadi",
        "continue — joriyni o'tkazib, keyingiga o'tadi",
        "while True: + break — shart bajarilganda chiqish",
        "while else: — break'siz tugaganda ishlaydi",
        "while: sanash, yig'ish, kiritish tekshirish uchun"
      ],
      "en": [
        "while condition:",
        "change condition inside or infinite",
        "break exits",
        "continue skips",
        "while True + break",
        "while else",
        "counting/summing"
      ]
    }
  },
  {
    "day": 10,
    "type": "review",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "reviewOf": 9,
    "title": {
      "uz": "Takrorlash: Loops",
      "en": "Review: Loops"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) for element in list/range. (2) range(n) 0 dan, oxiri kirmaydi. (3) while shart: — count += 1 ni unutma (cheksiz!). (4) break to'xtatadi, continue o'tkazadi. (5) total += n — yig'ish.",
      "en": "Recap: for/range; while + change condition; break/continue."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Sonni top o'yini",
        "en": "Project: Guess the number"
      },
      "desc": {
        "uz": "Kompyuter 1-20 orasida son o'ylaydi. while True + break bilan foydalanuvchi topguncha so'raydi, 'katta'/'kichik' deb yo'l ko'rsatadi.",
        "en": "Guess game with while True + break."
      },
      "starter": "import random\nsecret = random.randint(1, 20)\nattempts = 0\n\nwhile True:\n    guess = int(input(\"Son (1-20): \"))\n    attempts += 1\n    if guess == secret:\n        print(f\"Topdingiz! {attempts} urinishda.\")\n        break\n    elif guess < secret:\n        print(\"Kattaroq!\")\n    else:\n        print(\"Kichikroq!\")"
    },
    "practice": [
      {
        "uz": "for + range bilan ko'paytirish jadvali.",
        "en": "Multiplication table."
      },
      {
        "uz": "while bilan 0 kiritilguncha sonlar yig'indisi.",
        "en": "Sum until 0."
      },
      {
        "uz": "continue bilan faqat juftlarni chiqar.",
        "en": "Print evens with continue."
      }
    ],
    "quiz": [
      {
        "q": "range(3) chiqishi?",
        "opts": [
          "1 2 3",
          "0 1 2",
          "0 1 2 3",
          "1 2"
        ],
        "correct": 1
      },
      {
        "q": "while da count+=1 bo'lmasa?",
        "opts": [
          "Bir marta",
          "Cheksiz loop",
          "Xato",
          "5 marta"
        ],
        "correct": 1
      },
      {
        "q": "break nima qiladi?",
        "opts": [
          "O'tkazadi",
          "Loopdan chiqadi",
          "Qaytadan",
          "Hech narsa"
        ],
        "correct": 1
      },
      {
        "q": "continue nima qiladi?",
        "opts": [
          "Chiqadi",
          "Keyingiga o'tadi",
          "Qotadi",
          "To'xtatadi"
        ],
        "correct": 1
      },
      {
        "q": "range(1,5)?",
        "opts": [
          "1 2 3 4 5",
          "0 1 2 3 4",
          "1 2 3 4",
          "1-6"
        ],
        "correct": 2
      },
      {
        "q": "for i in range(10) necha marta?",
        "opts": [
          "9",
          "10",
          "11",
          "1"
        ],
        "correct": 1
      },
      {
        "q": "while True break'siz?",
        "opts": [
          "Bir marta",
          "Cheksiz",
          "Xato",
          "10"
        ],
        "correct": 1
      },
      {
        "q": "total=0; for n in [2,4,6]: total+=n?",
        "opts": [
          "6",
          "12",
          "246",
          "3"
        ],
        "correct": 1
      },
      {
        "q": "range(0,10,2)?",
        "opts": [
          "0-10",
          "0 2 4 6 8",
          "0 2 4 6 8 10",
          "2 4 6 8"
        ],
        "correct": 1
      },
      {
        "q": "break va continue farqi?",
        "opts": [
          "Bir xil",
          "break chiqadi, continue o'tkazadi",
          "continue chiqadi",
          "Yo'q"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "for element in list/range — har birini oladi",
        "range(5)=0 1 2 3 4 (oxiri kirmaydi)",
        "while shart: — count += 1 unutma (cheksiz!)",
        "break to'xtatadi, continue o'tkazadi",
        "total += n — yig'ish"
      ],
      "en": [
        "for/range",
        "while + change",
        "break/continue",
        "summing"
      ]
    }
  },
  {
    "day": 11,
    "type": "topic",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "title": {
      "uz": "Tuple va Set",
      "en": "Tuples & Sets"
    },
    "intro": {
      "uz": "List — o'zgaruvchan ketma-ketlik. Lekin Python'da yana ikki muhim struktura bor: tuple (o'zgarmas ketma-ketlik) va set (takrorlanmas to'plam). Sertifikatda ularning farqi va qachon ishlatilishi ko'p so'raladi. Bugun ikkalasini chuqur o'rganamiz.",
      "en": "Beyond lists: tuple (immutable sequence) and set (unique collection). Exams test their differences."
    },
    "sections": [
      {
        "h": {
          "uz": "Tuple — o'zgarmas ketma-ketlik",
          "en": "Tuple — immutable sequence"
        },
        "p": {
          "uz": "Tuple listga o'xshaydi, lekin () qavs bilan va O'ZGARMAS — yaratilgach elementini o'zgartirib, qo'shib yoki o'chirib bo'lmaydi. Index, slicing, len() ishlaydi. Nega kerak? Xavfsiz ma'lumot (koordinatalar, sozlamalar) uchun.",
          "en": "Tuple is like a list but with () and IMMUTABLE — can't change after creation. Indexing works."
        },
        "code": "point = (3, 5)\nprint(point[0])     # 3\nprint(len(point))   # 2\n\n# O'zgartirib bo'lmaydi:\n# point[0] = 10   # XATO! TypeError\n\ncolors = (\"red\", \"green\", \"blue\")\nprint(colors[1])    # green"
      },
      {
        "h": {
          "uz": "Tuple unpacking va bir elementli tuple",
          "en": "Tuple unpacking & single-element"
        },
        "p": {
          "uz": "Tuple'ni bir vaqtda o'zgaruvchilarga bo'lish mumkin — 'unpacking'. Bu funksiyadan bir necha qiymat qaytarishda juda foydali. Diqqat: bir elementli tuple uchun vergul SHART: (5,) — tuple, (5) — oddiy son.",
          "en": "Tuple unpacking: a, b = (1, 2). Single-element needs a comma: (5,) is a tuple, (5) is a number."
        },
        "code": "a, b = (1, 2)\nprint(a, b)       # 1 2\n\nx, y, z = 10, 20, 30   # qavssiz ham\nprint(y)          # 20\n\nsingle = (5,)     # tuple (vergul SHART)\nnot_tuple = (5)   # oddiy int\nprint(type(single), type(not_tuple))"
      },
      {
        "h": {
          "uz": "Set — takrorlanmas to'plam",
          "en": "Set — unique collection"
        },
        "p": {
          "uz": "Set {} qavs bilan, TAKRORLANMAS elementlar to'plami — bir xil qiymat faqat bir marta bo'ladi. Tartibsiz (index yo'q). add() qo'shadi, remove() o'chiradi. Nega kerak? Takrorlarni olib tashlash uchun eng tez usul.",
          "en": "Set uses {} with UNIQUE elements — duplicates auto-removed. Unordered (no index). add()/remove()."
        },
        "code": "nums = {1, 2, 2, 3, 3, 3}\nprint(nums)        # {1, 2, 3} (takror yo'q!)\n\nnums.add(4)\nnums.add(2)        # allaqachon bor, o'zgarmaydi\nprint(nums)        # {1, 2, 3, 4}\n\n# Listdan takrorlarni olib tashlash:\nlst = [1, 1, 2, 3, 3]\nprint(list(set(lst)))   # [1, 2, 3]"
      },
      {
        "h": {
          "uz": "Set amallari: birlashma, kesishma",
          "en": "Set operations"
        },
        "p": {
          "uz": "Set'lar ustida matematik amallar: | birlashma (union), & kesishma (intersection), - ayirma (difference). Bu ikki to'plamni solishtirishda juda foydali — masalan umumiy do'stlar, farqli elementlar.",
          "en": "Set math: | union, & intersection, - difference. Useful for comparing two collections."
        },
        "code": "a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\nprint(a | b)   # {1,2,3,4,5,6} birlashma\nprint(a & b)   # {3, 4} kesishma\nprint(a - b)   # {1, 2} a da bor, b da yo'q\n\nprint(3 in a)  # True (tekshirish tez)"
      }
    ],
    "practice": [
      {
        "uz": "Tuple yarat, elementini o'zgartirishga urinib, xatoni ko'r.",
        "en": "Create a tuple, try to modify it, see the error."
      },
      {
        "uz": "Tuple unpacking bilan 3 ta o'zgaruvchini bir qatorda o'rnat.",
        "en": "Unpack a tuple into 3 variables."
      },
      {
        "uz": "Bir elementli tuple yarat (vergul bilan), type() bilan tekshir.",
        "en": "Single-element tuple with comma."
      },
      {
        "uz": "Set bilan listdagi takrorlarni olib tashla.",
        "en": "Remove duplicates with set."
      },
      {
        "uz": "Ikki set'ning kesishmasi va birlashmasini top.",
        "en": "Union and intersection of two sets."
      }
    ],
    "quiz": [
      {
        "q": "Tuple qaysi qavs bilan?",
        "opts": [
          "[]",
          "()",
          "{}",
          "<>"
        ],
        "correct": 1
      },
      {
        "q": "Tuple elementini o'zgartirsa?",
        "opts": [
          "O'zgaradi",
          "TypeError (o'zgarmas)",
          "Qo'shadi",
          "None"
        ],
        "correct": 1
      },
      {
        "q": "(5,) va (5) farqi?",
        "opts": [
          "Bir xil",
          "(5,) tuple, (5) int",
          "Ikkalasi tuple",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "a, b = (1, 2) — b nima?",
        "opts": [
          "1",
          "2",
          "(1,2)",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "Set qaysi qavs bilan?",
        "opts": [
          "()",
          "[]",
          "{}",
          "<>"
        ],
        "correct": 2
      },
      {
        "q": "{1,2,2,3} natijasi?",
        "opts": [
          "{1,2,2,3}",
          "{1,2,3}",
          "[1,2,3]",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "Setda index bormi (set[0])?",
        "opts": [
          "Ha",
          "Yo'q (tartibsiz)",
          "Ba'zan",
          "Faqat 0"
        ],
        "correct": 1
      },
      {
        "q": "list(set([1,1,2,3,3])) natijasi?",
        "opts": [
          "[1,1,2,3,3]",
          "[1,2,3]",
          "{1,2,3}",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "{1,2,3} & {2,3,4} natijasi?",
        "opts": [
          "{1,2,3,4}",
          "{2,3}",
          "{1,4}",
          "{}"
        ],
        "correct": 1
      },
      {
        "q": "{1,2,3} | {3,4} natijasi?",
        "opts": [
          "{3}",
          "{1,2,3,4}",
          "{1,2}",
          "Xato"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "Tuple = () o'zgarmas ketma-ketlik",
        "Tuple elementini o'zgartirib bo'lmaydi (TypeError)",
        "Unpacking: a, b = (1, 2)",
        "Bir elementli: (5,) — vergul SHART",
        "Set = {} takrorlanmas, tartibsiz to'plam",
        "Takror avtomatik olib tashlanadi",
        "list(set(lst)) — takrorlarni tozalash",
        "Set amallari: | birlashma, & kesishma, - ayirma",
        "in bilan tekshirish set'da juda tez"
      ],
      "en": [
        "Tuple = () immutable",
        "can't modify tuple",
        "unpacking a,b=(1,2)",
        "single: (5,) comma!",
        "Set = {} unique, unordered",
        "auto-removes duplicates",
        "list(set()) dedup",
        "| & - operations"
      ]
    }
  },
  {
    "day": 12,
    "type": "topic",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "title": {
      "uz": "Dictionaries",
      "en": "Dictionaries"
    },
    "intro": {
      "uz": "List index bilan ishlaydi (0,1,2). Dictionary NOM bilan ishlaydi (key). Real datasetlar (JSON) shu strukturada keladi.",
      "en": "Lists work by index (0,1,2). A dictionary works by NAME (key). Real datasets (JSON) come in this structure."
    },
    "sections": [
      {
        "h": {
          "uz": "Dictionary yaratish",
          "en": "Creating a dictionary"
        },
        "p": {
          "uz": "Jingalak qavs {} ichida key: value juftliklari. Key odatda matn, value istalgan tur. Qiymatga key bilan murojaat qilinadi.",
          "en": "Curly braces {} with key: value pairs. Key is usually text, value any type. Access a value by its key."
        },
        "code": "student = {\n    \"name\": \"Max\",\n    \"age\": 20,\n    \"active\": True\n}\n\nprint(student[\"name\"])   # Max\nprint(student[\"age\"])    # 20"
      },
      {
        "h": {
          "uz": "Qo'shish va o'zgartirish",
          "en": "Adding and changing"
        },
        "p": {
          "uz": "Yangi key: dict[key] = value. Mavjud key ustiga yozsa — o'zgaradi. del bilan o'chiriladi.",
          "en": "New key: dict[key] = value. Writing over an existing key changes it. Delete with del."
        },
        "code": "student = {\"name\": \"Max\"}\nstudent[\"age\"] = 20        # add\nstudent[\"name\"] = \"Akbar\"  # change\ndel student[\"age\"]         # delete\nprint(student)"
      },
      {
        "h": {
          "uz": "Metodlar: keys, values, get",
          "en": "Methods: keys, values, get"
        },
        "p": {
          "uz": "keys() barcha kalitlar, values() barcha qiymatlar, get() xavfsiz olish (yo'q key uchun xato bermaydi).",
          "en": "keys() all keys, values() all values, get() safe access (no error for a missing key)."
        },
        "code": "student = {\"name\": \"Max\", \"age\": 20}\n\nprint(student.keys())    # dict_keys(['name', 'age'])\nprint(student.values())  # dict_values(['Max', 20])\nprint(student.get(\"city\", \"Unknown\"))  # Unknown"
      },
      {
        "h": {
          "uz": "Dictionary bo'ylab loop",
          "en": "Looping a dictionary"
        },
        "p": {
          "uz": "for key in dict — kalitlar bo'ylab. items() bilan key va value birga olinadi. Bu datasetni qayta ishlashning asosi.",
          "en": "for key in dict — over keys. items() gives key and value together. This is the basis of processing a dataset."
        },
        "code": "student = {\"name\": \"Max\", \"age\": 20}\n\nfor key in student:\n    print(key, \"=\", student[key])\n\nfor key, value in student.items():\n    print(f\"{key}: {value}\")"
      }
    ],
    "practice": [
      {
        "uz": "O'zing haqingda dictionary yarat (name, age, city, student).",
        "en": "Create a dictionary about yourself (name, age, city, student)."
      },
      {
        "uz": "Yangi key qo'sh, mavjudini o'zgartir, bittasini o'chir.",
        "en": "Add a new key, change an existing one, delete one."
      },
      {
        "uz": "keys(), values(), get() ni sinab ko'r.",
        "en": "Try keys(), values(), get()."
      },
      {
        "uz": "Dictionary bo'ylab items() bilan loop qil.",
        "en": "Loop over a dictionary with items()."
      },
      {
        "uz": "Talaba: bahosini dictionary'da saqla (fan: baho), o'rtachani hisobla.",
        "en": "Student: store grades in a dict (subject: grade), compute the average."
      }
    ],
    "quiz": [
      {
        "q": "Dictionaries use which brackets?",
        "opts": [
          "[]",
          "()",
          "{}",
          "<>"
        ],
        "correct": 2
      },
      {
        "q": "d={\"a\":1}; d[\"a\"] gives?",
        "opts": [
          "a",
          "1",
          "{a:1}",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "Access a dict value by?",
        "opts": [
          "index",
          "key",
          "position",
          "value"
        ],
        "correct": 1
      },
      {
        "q": "d={\"x\":1}; d[\"y\"]=2 does?",
        "opts": [
          "Error",
          "Adds key y",
          "Changes x",
          "Nothing"
        ],
        "correct": 1
      },
      {
        "q": "d.get(\"z\",\"none\") when z missing?",
        "opts": [
          "Error",
          "none",
          "z",
          "None object"
        ],
        "correct": 1
      },
      {
        "q": "d={\"a\":1,\"b\":2}; len(d)?",
        "opts": [
          "1",
          "2",
          "4",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "items() gives you?",
        "opts": [
          "keys only",
          "values only",
          "key-value pairs",
          "length"
        ],
        "correct": 2
      },
      {
        "q": "d={\"a\":1}; d[\"a\"]=9; d[\"a\"]?",
        "opts": [
          "1",
          "9",
          "[1,9]",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "del d['a'] does?",
        "opts": [
          "Adds a",
          "Removes key a",
          "Clears all",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "d={\"x\":1}; \"x\" in d gives?",
        "opts": [
          "True",
          "False",
          "1",
          "Error"
        ],
        "correct": 0
      }
    ],
    "konspekt": {
      "uz": [
        "Dictionary = {key: value} juftliklari",
        "{} jingalak qavs ichida",
        "dict[key] bilan qiymatga murojaat",
        "Yangi key: dict[key] = value (qo'shadi)",
        "get() xavfsiz — yo'q key uchun xato bermaydi",
        "keys(), values(), items()",
        "for k in dict — kalitlar bo'ylab",
        "items() bilan key va value birga",
        "Real datasetlar (JSON) shu strukturada"
      ],
      "en": [
        "Dictionary = {key: value} pairs",
        "Inside {} curly braces",
        "Access value with dict[key]",
        "New key: dict[key] = value (adds)",
        "get() is safe — no error for missing key",
        "keys(), values(), items()",
        "for k in dict — over keys",
        "items() gives key and value together",
        "Real datasets (JSON) use this structure"
      ]
    }
  },
  {
    "day": 13,
    "type": "topic",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "title": {
      "uz": "Nested strukturalar",
      "en": "Nested data structures"
    },
    "intro": {
      "uz": "Haqiqiy ma'lumot ko'pincha ichma-ich joylashadi: list ichida list, list ichida dictionary. Masalan talabalar ro'yxati — har biri dictionary. Bu JSON ma'lumotining tuzilishi. Sertifikatda ichki elementga murojaat qilish ko'p so'raladi.",
      "en": "Real data nests: lists of dicts, dicts of lists. This is how JSON is structured. Exams test nested access."
    },
    "sections": [
      {
        "h": {
          "uz": "List ichida list (matritsa)",
          "en": "List of lists (matrix)"
        },
        "p": {
          "uz": "List ichida list — jadval yoki matritsa. Ichki elementga IKKI index bilan murojaat: matrix[qator][ustun]. Birinchi index qatorni, ikkinchisi ustunni beradi. Bu o'yin taxtalari, jadvallar uchun.",
          "en": "List of lists = a grid. Access with two indices: matrix[row][col]."
        },
        "code": "matrix = [[1, 2, 3],\n          [4, 5, 6],\n          [7, 8, 9]]\n\nprint(matrix[0])       # [1, 2, 3] (birinchi qator)\nprint(matrix[1][2])    # 6 (2-qator, 3-ustun)\nprint(matrix[2][0])    # 7"
      },
      {
        "h": {
          "uz": "List ichida dictionary",
          "en": "List of dictionaries"
        },
        "p": {
          "uz": "Eng ko'p uchraydigan struktura: har element bir dictionary. Masalan talabalar ro'yxati — har biri {ism, yosh}. Loop bilan har birini olib, key bilan murojaat qilasan. Bu API va JSON ma'lumotining odatiy shakli.",
          "en": "Most common: a list where each element is a dict. Loop through, access by key."
        },
        "code": "students = [\n    {\"name\": \"Ali\", \"age\": 20},\n    {\"name\": \"Vali\", \"age\": 22}\n]\n\nprint(students[0][\"name\"])   # Ali\n\nfor s in students:\n    print(f\"{s['name']}: {s['age']}\")"
      },
      {
        "h": {
          "uz": "Dictionary ichida list/dictionary",
          "en": "Dict containing list/dict"
        },
        "p": {
          "uz": "Dictionary value'si list yoki boshqa dictionary bo'lishi mumkin. Masalan bir odam ma'lumoti: ismi (string), hobbi'lari (list), manzili (dictionary). Ichkariga zanjir bilan murojaat: person['address']['city'].",
          "en": "A dict value can be a list or another dict. Access by chaining: person['address']['city']."
        },
        "code": "person = {\n    \"name\": \"Max\",\n    \"hobbies\": [\"coding\", \"chess\"],\n    \"address\": {\"city\": \"Tashkent\", \"zip\": \"100000\"}\n}\n\nprint(person[\"hobbies\"][0])       # coding\nprint(person[\"address\"][\"city\"])  # Tashkent"
      },
      {
        "h": {
          "uz": "Nested loop bilan aylanish",
          "en": "Iterating with nested loops"
        },
        "p": {
          "uz": "Ichma-ich strukturani nested loop (loop ichida loop) bilan aylantiriladi. Tashqi loop qatorlarni, ichki loop ustunlarni oladi. Sertifikatda nested loop necha marta ishlashi (3×3=9) ko'p so'raladi.",
          "en": "Nested loops iterate nested structures. Outer=rows, inner=columns. Exams ask iteration count."
        },
        "code": "matrix = [[1, 2], [3, 4], [5, 6]]\n\nfor row in matrix:\n    for value in row:\n        print(value, end=\" \")\n    print()   # yangi qator\n# Chiqishi:\n# 1 2\n# 3 4\n# 5 6"
      }
    ],
    "practice": [
      {
        "uz": "3×3 matritsa yasab, o'rtadagi elementni (matrix[1][1]) chiqar.",
        "en": "3x3 matrix, print center."
      },
      {
        "uz": "Talabalar listini (dict) yasab, loop bilan ismlarni chiqar.",
        "en": "List of student dicts, print names."
      },
      {
        "uz": "Person dictionary yasab (list va dict ichida), shahrini chiqar.",
        "en": "Nested person dict, print city."
      },
      {
        "uz": "Nested loop bilan matritsaning barcha elementlarini chiqar.",
        "en": "Print all matrix elements with nested loops."
      },
      {
        "uz": "List ichidagi dictionary'lardan yosh o'rtachasini hisobla.",
        "en": "Average age from list of dicts."
      }
    ],
    "quiz": [
      {
        "q": "matrix=[[1,2],[3,4]]; matrix[1][0]?",
        "opts": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct": 2
      },
      {
        "q": "students[0]['name'] — students nima?",
        "opts": [
          "dict",
          "list ichida dict",
          "string",
          "int"
        ],
        "correct": 1
      },
      {
        "q": "person['address']['city'] nechta daraja?",
        "opts": [
          "1",
          "2 (nested)",
          "3",
          "0"
        ],
        "correct": 1
      },
      {
        "q": "matrix=[[1,2,3],[4,5,6]]; matrix[0][2]?",
        "opts": [
          "3",
          "4",
          "6",
          "2"
        ],
        "correct": 0
      },
      {
        "q": "Nested loop 3×3 necha marta ishlaydi?",
        "opts": [
          "3",
          "6",
          "9",
          "12"
        ],
        "correct": 2
      },
      {
        "q": "d={'a':[1,2,3]}; d['a'][1]?",
        "opts": [
          "1",
          "2",
          "3",
          "[1,2,3]"
        ],
        "correct": 1
      },
      {
        "q": "List ichida dict — JSON'ga o'xshaydimi?",
        "opts": [
          "Yo'q",
          "Ha",
          "Faqat matn",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "matrix[0] nima qaytaradi?",
        "opts": [
          "Bitta son",
          "Birinchi qator (list)",
          "Ustun",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "for row in matrix: for x in row: — bu?",
        "opts": [
          "Bitta loop",
          "Nested loop",
          "while",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "d={'x':{'y':5}}; d['x']['y']?",
        "opts": [
          "5",
          "x",
          "y",
          "Xato"
        ],
        "correct": 0
      }
    ],
    "konspekt": {
      "uz": [
        "List ichida list = jadval/matritsa",
        "matrix[qator][ustun] — ikki index",
        "List ichida dict — eng ko'p (JSON shakli)",
        "students[0]['name'] — index keyin key",
        "Dict ichida list/dict bo'la oladi",
        "person['address']['city'] — zanjir murojaat",
        "Nested loop: tashqi qator, ichki ustun",
        "3×3 nested loop = 9 marta"
      ],
      "en": [
        "list of lists = grid",
        "matrix[row][col]",
        "list of dicts = JSON",
        "students[0]['name']",
        "dicts nest too",
        "chain access",
        "nested loops",
        "3x3 = 9 times"
      ]
    }
  },
  {
    "day": 14,
    "type": "review",
    "unit": "Hafta 2 — Boshqaruv va strukturalar",
    "reviewOf": 13,
    "title": {
      "uz": "Takrorlash: Data strukturalari",
      "en": "Review: Data structures"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) tuple () o'zgarmas, set {} takrorlanmas. (2) dict {key:value}, get() xavfsiz. (3) nested: matrix[qator][ustun], students[0]['name']. (4) nested loop.",
      "en": "Recap: tuple/set; dict; nested access; nested loops."
    },
    "project": {
      "title": {
        "uz": "Haftalik loyiha: Kontaktlar kitobi",
        "en": "Weekly project: Contact book"
      },
      "desc": {
        "uz": "Kontaktlarni saqlaydigan dastur: har kontakt dictionary (ism, tel), hammasi listda. Qo'shish, ko'rish, qidirish. List + dict + loop birga.",
        "en": "Contact book: list of dicts, add/view/search."
      },
      "starter": "contacts = []\n\ndef add(name, phone):\n    contacts.append({\"name\": name, \"phone\": phone})\n\ndef show_all():\n    for c in contacts:\n        print(f\"{c['name']} — {c['phone']}\")\n\nadd(\"Max\", \"998901234567\")\nadd(\"Ali\", \"998907654321\")\nshow_all()"
    },
    "practice": [
      {
        "uz": "Set bilan listdagi takrorlarni olib tashla.",
        "en": "Dedup with set."
      },
      {
        "uz": "Tuple unpacking bilan qiymatlarni bo'l.",
        "en": "Tuple unpacking."
      },
      {
        "uz": "List ichida dict'lardan ma'lumot ol.",
        "en": "Access list of dicts."
      }
    ],
    "quiz": [
      {
        "q": "Tuple qavs?",
        "opts": [
          "[]",
          "()",
          "{}",
          "<>"
        ],
        "correct": 1
      },
      {
        "q": "Tuple o'zgaruvchanmi?",
        "opts": [
          "Ha",
          "Yo'q (o'zgarmas)",
          "Ba'zan",
          "Faqat son"
        ],
        "correct": 1
      },
      {
        "q": "{1,2,2,3}?",
        "opts": [
          "{1,2,2,3}",
          "{1,2,3}",
          "[1,2,3]",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "Set qavs?",
        "opts": [
          "()",
          "[]",
          "{}",
          "<>"
        ],
        "correct": 2
      },
      {
        "q": "matrix=[[1,2],[3,4]]; matrix[1][0]?",
        "opts": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct": 2
      },
      {
        "q": "students[0]['name'] — students?",
        "opts": [
          "dict",
          "list ichida dict",
          "string",
          "int"
        ],
        "correct": 1
      },
      {
        "q": "dict get() xavfsizmi?",
        "opts": [
          "Yo'q",
          "Ha (xato bermaydi)",
          "Ba'zan",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "list(set([1,1,2]))?",
        "opts": [
          "[1,1,2]",
          "[1,2]",
          "{1,2}",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "(5,) va (5) farqi?",
        "opts": [
          "Yo'q",
          "(5,) tuple, (5) int",
          "Ikkalasi tuple",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "3×3 nested loop necha marta?",
        "opts": [
          "3",
          "6",
          "9",
          "12"
        ],
        "correct": 2
      }
    ],
    "konspekt": {
      "uz": [
        "tuple () o'zgarmas; unpacking a,b=(1,2)",
        "set {} takrorlanmas, tartibsiz",
        "list(set()) — takrorlarni tozalash",
        "dict {key:value}, get() xavfsiz",
        "nested: matrix[qator][ustun]",
        "list ichida dict = JSON shakli",
        "nested loop: tashqi qator, ichki ustun"
      ],
      "en": [
        "tuple/set",
        "dedup",
        "dict get()",
        "nested access",
        "nested loops"
      ]
    }
  },
  {
    "day": 15,
    "type": "topic",
    "unit": "Hafta 3 — Funksiya va string",
    "title": {
      "uz": "Funksiyalar",
      "en": "Functions"
    },
    "intro": {
      "uz": "Bir marta yozib, ko'p marta ishlatiladigan kod. print(), len() — bular funksiya. Bugun o'zingnikini yasaysan.",
      "en": "Code written once, used many times. print(), len() are functions. Today you make your own."
    },
    "sections": [
      {
        "h": {
          "uz": "def va chaqirish",
          "en": "def and calling"
        },
        "p": {
          "uz": "def funksiyani yaratadi (retsept). Chaqirmaguncha ishlamaydi — faqat tayyor turadi. def() bilan chaqiriladi.",
          "en": "def creates a function (recipe). It doesn't run until called — it just waits. Call it with name()."
        },
        "code": "def greet():\n    print(\"Hello!\")\n    print(\"Welcome!\")\n\ngreet()   # call it — NOW it runs\ngreet()   # can call again"
      },
      {
        "h": {
          "uz": "Parametrlar",
          "en": "Parameters"
        },
        "p": {
          "uz": "Funksiya tashqaridan ma'lumot oladi — parametr. Har chaqirganda boshqa qiymat berasan. Tartib muhim.",
          "en": "A function takes data from outside — a parameter. You pass a different value each call. Order matters."
        },
        "code": "def greet(name):\n    print(f\"Hello, {name}!\")\n\ngreet(\"Max\")    # Hello, Max!\ngreet(\"Ali\")    # Hello, Ali!\n\ndef intro(name, age):\n    print(f\"{name}, {age}\")\nintro(\"Max\", 20)"
      },
      {
        "h": {
          "uz": "return — natija qaytarish",
          "en": "return — returning a result"
        },
        "p": {
          "uz": "print faqat ko'rsatadi. return qiymatni QAYTARADI — keyin ishlatsa bo'ladi. Bu eng muhim farq. return'dan keyingi kod ishlamaydi.",
          "en": "print only shows. return RETURNS a value — you can use it later. This is the key difference. Code after return doesn't run."
        },
        "code": "def add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint(result)        # 8\nprint(add(10, 20) * 2)   # 60 — used the result!"
      },
      {
        "h": {
          "uz": "Default qiymat + funksiya funksiyani chaqiradi",
          "en": "Default values + functions calling functions"
        },
        "p": {
          "uz": "Parametrga oldindan qiymat berish mumkin (default). Funksiyalar bir-birini chaqirishi mumkin — katta dasturlarning asosi.",
          "en": "You can give a parameter a preset (default). Functions can call each other — the basis of big programs."
        },
        "code": "def greet(name, msg=\"Hi\"):\n    print(f\"{msg}, {name}!\")\ngreet(\"Max\")             # Hi, Max!\ngreet(\"Ali\", \"Hello\")    # Hello, Ali!\n\ndef square(x):\n    return x * x\ndef sum_sq(a, b):\n    return square(a) + square(b)\nprint(sum_sq(3, 4))      # 25"
      }
    ],
    "practice": [
      {
        "uz": "Parametrsiz greet() funksiya yoz, ikki marta chaqir.",
        "en": "Write a parameterless greet() function, call it twice."
      },
      {
        "uz": "Ism va yosh oladigan intro(name, age) funksiya yoz.",
        "en": "Write intro(name, age) taking name and age."
      },
      {
        "uz": "add(a, b) return bilan yoz, natijani * 2 qilib chiqar.",
        "en": "Write add(a, b) with return, print result * 2."
      },
      {
        "uz": "average(nums) funksiya — listni olib o'rtachani qaytaradi.",
        "en": "average(nums) function — takes a list, returns the average."
      },
      {
        "uz": "square va sum_squares — biri ikkinchisini chaqiradi.",
        "en": "square and sum_squares — one calls the other."
      }
    ],
    "quiz": [
      {
        "q": "Create a function with which keyword?",
        "opts": [
          "func",
          "def",
          "function",
          "return"
        ],
        "correct": 1
      },
      {
        "q": "def hi(): print('Hi') — with no call, output?",
        "opts": [
          "Hi",
          "nothing",
          "def",
          "Error"
        ],
        "correct": 1
      },
      {
        "q": "print vs return?",
        "opts": [
          "Same",
          "print shows, return gives back a value",
          "return shows",
          "return numbers only"
        ],
        "correct": 1
      },
      {
        "q": "def add(a,b): return a+b; print(add(4,6))?",
        "opts": [
          "10",
          "a+b",
          "46",
          "nothing"
        ],
        "correct": 0
      },
      {
        "q": "return 5 then print('x') on next line — does print run?",
        "opts": [
          "Yes",
          "No, return ends function",
          "Error",
          "Once"
        ],
        "correct": 1
      },
      {
        "q": "def g(n, m='Hi'): ... ; g('Max') uses m as?",
        "opts": [
          "Hi",
          "empty",
          "Error",
          "Max"
        ],
        "correct": 0
      },
      {
        "q": "def defined but never called does?",
        "opts": [
          "Runs auto",
          "Error",
          "Nothing, just ready",
          "Once"
        ],
        "correct": 2
      },
      {
        "q": "def sq(x): return x*x; sq(sq(2))?",
        "opts": [
          "4",
          "8",
          "16",
          "2"
        ],
        "correct": 2
      },
      {
        "q": "def f(a,b): print(a+b); x=f(3,5); print(x*2) — problem?",
        "opts": [
          "f wrong",
          "f has no return, x is None",
          "print twice",
          "no problem"
        ],
        "correct": 1
      },
      {
        "q": "Same function name defined twice?",
        "opts": [
          "Both work",
          "Error",
          "Last one wins",
          "First wins"
        ],
        "correct": 2
      }
    ],
    "konspekt": {
      "uz": [
        "def name(): — funksiya yaratadi (retsept)",
        "name() — chaqiradi (ishga tushiradi)",
        "Chaqirmasang ishlamaydi, xato ham bermaydi",
        "Parametr: def greet(name) — tashqi ma'lumot",
        "return — qiymat qaytaradi (ishlatsa bo'ladi)",
        "print ko'rsatadi, return qaytaradi (FARQ)",
        "return'dan keyingi kod ishlamaydi",
        "default: def f(x, msg=\"Hi\")",
        "Funksiya funksiyani chaqira oladi",
        "Bir nomda bitta funksiya (oxirgisi g'olib)"
      ],
      "en": [
        "def name(): — creates a function (recipe)",
        "name() — calls it (runs it)",
        "No call = no run, but no error either",
        "Parameter: def greet(name) — outside data",
        "return — gives back a value (usable)",
        "print shows, return returns (DIFFERENCE)",
        "code after return doesn't run",
        "default: def f(x, msg=\"Hi\")",
        "A function can call another function",
        "One function per name (last one wins)"
      ]
    }
  },
  {
    "day": 16,
    "type": "topic",
    "unit": "Hafta 3 — Funksiya va string",
    "title": {
      "uz": "Funksiyalar: default, *args, scope",
      "en": "Functions: default, *args, scope"
    },
    "intro": {
      "uz": "Kecha funksiya asoslarini o'rgandik. Bugun ilg'or imkoniyatlar: standart qiymatlar, cheksiz argumentlar (*args, **kwargs), va scope (o'zgaruvchi ko'rinish sohasi). Bular sertifikat imtihonining muhim mavzulari — ayniqsa scope va default qiymatlar.",
      "en": "Advanced functions: defaults, *args/**kwargs, and scope. Key exam topics."
    },
    "sections": [
      {
        "h": {
          "uz": "Default (standart) qiymatlar",
          "en": "Default values"
        },
        "p": {
          "uz": "Parametrga oldindan qiymat berish mumkin: def greet(name, msg='Salom'). Agar chaqirganda qiymat berilmasa, standart ishlatiladi. MUHIM: default parametrlar oddiylaridan KEYIN kelishi shart, aks holda xato.",
          "en": "Parameters can have defaults: def f(x, y=10). Defaults must come AFTER non-default params."
        },
        "code": "def greet(name, msg=\"Salom\"):\n    print(f\"{msg}, {name}!\")\n\ngreet(\"Max\")            # Salom, Max!\ngreet(\"Ali\", \"Hi\")      # Hi, Ali!\n\n# def f(x=1, y):  # XATO! default oldin bo'lmaydi\ndef f(x, y=2):          # to'g'ri\n    return x + y"
      },
      {
        "h": {
          "uz": "*args — cheksiz argumentlar",
          "en": "*args — variable arguments"
        },
        "p": {
          "uz": "*args funksiyaga istalgancha argument berishga imkon beradi — ular tuple sifatida yig'iladi. Masalan sum_all(1,2,3,4) hammasini qo'shadi. Bu qancha argument kelishini oldindan bilmaganda ishlatiladi.",
          "en": "*args accepts any number of positional args, collected as a tuple."
        },
        "code": "def sum_all(*args):\n    total = 0\n    for n in args:\n        total += n\n    return total\n\nprint(sum_all(1, 2, 3))       # 6\nprint(sum_all(1, 2, 3, 4, 5)) # 15\nprint(sum_all())              # 0"
      },
      {
        "h": {
          "uz": "**kwargs — nomli argumentlar",
          "en": "**kwargs — keyword arguments"
        },
        "p": {
          "uz": "**kwargs nomli argumentlarni dictionary sifatida yig'adi. Masalan info(name='Max', age=20). Bu moslashuvchan funksiyalar (masalan sozlamalar) uchun. args va kwargs birga ham ishlatilsa bo'ladi.",
          "en": "**kwargs collects keyword arguments as a dict: info(name='Max', age=20)."
        },
        "code": "def info(**kwargs):\n    for key, value in kwargs.items():\n        print(f\"{key}: {value}\")\n\ninfo(name=\"Max\", age=20)\n# name: Max\n# age: 20\n\ndef mix(a, *args, **kwargs):\n    print(a, args, kwargs)"
      },
      {
        "h": {
          "uz": "Scope — o'zgaruvchi ko'rinishi",
          "en": "Scope — variable visibility"
        },
        "p": {
          "uz": "Funksiya ICHIDA yaratilgan o'zgaruvchi faqat o'sha funksiyada ko'rinadi (local). Tashqarida yaratilgani hamma joyda ko'rinadi (global). Funksiya ichida global'ni o'zgartirish uchun global kalit so'zi kerak. Sertifikatda scope savoli ko'p.",
          "en": "Variables inside a function are local (only visible there). Outside = global. Use 'global' to modify globals."
        },
        "code": "x = 10          # global\n\ndef test():\n    y = 5       # local (faqat shu yerda)\n    print(x)    # global'ni o'qiy oladi: 10\n    print(y)    # 5\n\ntest()\n# print(y)     # XATO! y faqat funksiya ichida"
      }
    ],
    "practice": [
      {
        "uz": "Default qiymatli funksiya yoz, ham qiymat bilan ham qiymatsiz chaqir.",
        "en": "Function with default, call both ways."
      },
      {
        "uz": "*args bilan istalgancha son qabul qilib, ko'paytmasini qaytar.",
        "en": "*args product function."
      },
      {
        "uz": "**kwargs bilan ma'lumot qabul qilib, chiroyli chiqar.",
        "en": "**kwargs info printer."
      },
      {
        "uz": "Local va global o'zgaruvchi farqini ko'rsat.",
        "en": "Show local vs global."
      },
      {
        "uz": "global kalit so'zi bilan funksiya ichidan global'ni o'zgartir.",
        "en": "Modify a global with 'global'."
      }
    ],
    "quiz": [
      {
        "q": "def f(x, y=5) — f(3) da y nima?",
        "opts": [
          "0",
          "5",
          "3",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "def f(x=1, y) — muammo?",
        "opts": [
          "Yo'q",
          "default oddiydan oldin bo'lmaydi",
          "y xato",
          "x xato"
        ],
        "correct": 1
      },
      {
        "q": "*args nima yig'adi?",
        "opts": [
          "dict",
          "tuple",
          "list",
          "string"
        ],
        "correct": 1
      },
      {
        "q": "**kwargs nima yig'adi?",
        "opts": [
          "tuple",
          "dict",
          "list",
          "set"
        ],
        "correct": 1
      },
      {
        "q": "sum_all(*args) da sum_all() (bo'sh)?",
        "opts": [
          "Xato",
          "Ishlaydi (bo'sh)",
          "None",
          "0 ta arg xato"
        ],
        "correct": 1
      },
      {
        "q": "Funksiya ichidagi o'zgaruvchi qayerda ko'rinadi?",
        "opts": [
          "Hamma joyda",
          "Faqat o'sha funksiyada (local)",
          "Tashqarida",
          "Global"
        ],
        "correct": 1
      },
      {
        "q": "Funksiya global o'zgaruvchini o'qiy oladimi?",
        "opts": [
          "Yo'q",
          "Ha, o'qiy oladi",
          "Xato",
          "Faqat local"
        ],
        "correct": 1
      },
      {
        "q": "Funksiya ichidan global'ni O'ZGARTIRISH uchun?",
        "opts": [
          "oddiy =",
          "global kalit so'zi",
          "local",
          "mumkin emas"
        ],
        "correct": 1
      },
      {
        "q": "info(name='Max', age=20) — bular?",
        "opts": [
          "*args",
          "**kwargs (nomli)",
          "default",
          "local"
        ],
        "correct": 1
      },
      {
        "q": "def mix(a, *args, **kwargs) — tartib to'g'rimi?",
        "opts": [
          "Yo'q",
          "Ha (oddiy, *args, **kwargs)",
          "Xato",
          "kwargs oldin"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "default: def f(x, y=5) — qiymatsiz chaqirsa 5",
        "default parametrlar oddiylaridan KEYIN",
        "*args — cheksiz argument (tuple sifatida)",
        "**kwargs — nomli argument (dict sifatida)",
        "Tartib: oddiy, *args, **kwargs",
        "local — funksiya ichida yaratilgan (faqat shu yerda)",
        "global — tashqarida (hamma joyda ko'rinadi)",
        "Funksiya global'ni o'qiydi; o'zgartirish uchun global kalit so'zi"
      ],
      "en": [
        "defaults after non-defaults",
        "*args = tuple",
        "**kwargs = dict",
        "order: normal, *args, **kwargs",
        "local vs global scope",
        "global keyword to modify"
      ]
    }
  },
  {
    "day": 17,
    "type": "review",
    "unit": "Hafta 3 — Funksiya va string",
    "reviewOf": 16,
    "title": {
      "uz": "Takrorlash: Funksiyalar",
      "en": "Review: Functions"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) def yaratadi, name() chaqiradi. (2) return qaytaradi (ishlatsa bo'ladi), print ko'rsatadi. (3) default: def f(x, y=5). (4) *args tuple, **kwargs dict. (5) local vs global scope.",
      "en": "Recap: def/return; defaults; *args/**kwargs; scope."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Matn statistikasi funksiyalari",
        "en": "Project: Text stats functions"
      },
      "desc": {
        "uz": "Bir necha funksiya yoz: count_words(text), count_chars(text), longest_word(text). Har biri return bilan natija qaytarsin, keyin birga ishlat.",
        "en": "Functions for text stats using return."
      },
      "starter": "def count_words(text):\n    return len(text.split())\n\ndef longest_word(text):\n    words = text.split()\n    longest = \"\"\n    for w in words:\n        if len(w) > len(longest):\n            longest = w\n    return longest\n\ntext = input(\"Matn: \")\nprint(f\"So'zlar: {count_words(text)}\")\nprint(f\"Eng uzun: {longest_word(text)}\")"
    },
    "practice": [
      {
        "uz": "*args bilan istalgancha son qo'shadigan funksiya.",
        "en": "*args sum function."
      },
      {
        "uz": "default qiymatli funksiyani ikki xil chaqir.",
        "en": "Call default function two ways."
      },
      {
        "uz": "local va global farqini ko'rsat.",
        "en": "Show local vs global."
      }
    ],
    "quiz": [
      {
        "q": "def yaratadimi yoki chaqiradimi?",
        "opts": [
          "Chaqiradi",
          "Yaratadi",
          "Ikkalasi",
          "Hech biri"
        ],
        "correct": 1
      },
      {
        "q": "return vs print?",
        "opts": [
          "Bir xil",
          "print ko'rsatadi, return qaytaradi",
          "return ko'rsatadi",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "def f(x,y=5); f(3) da y?",
        "opts": [
          "0",
          "5",
          "3",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "*args nima yig'adi?",
        "opts": [
          "dict",
          "tuple",
          "list",
          "str"
        ],
        "correct": 1
      },
      {
        "q": "**kwargs nima yig'adi?",
        "opts": [
          "tuple",
          "dict",
          "list",
          "set"
        ],
        "correct": 1
      },
      {
        "q": "Funksiya ichidagi o'zgaruvchi?",
        "opts": [
          "Global",
          "Local (faqat shu yerda)",
          "Hamma joyda",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "return'dan keyingi kod?",
        "opts": [
          "Ishlaydi",
          "Ishlamaydi",
          "Xato",
          "Qaytadan"
        ],
        "correct": 1
      },
      {
        "q": "def f(x=1,y) — muammo?",
        "opts": [
          "Yo'q",
          "default oddiydan oldin bo'lmaydi",
          "y xato",
          "x xato"
        ],
        "correct": 1
      },
      {
        "q": "Funksiya funksiyani chaqira oladimi?",
        "opts": [
          "Yo'q",
          "Ha",
          "Faqat init",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "global'ni funksiyada o'zgartirish uchun?",
        "opts": [
          "oddiy =",
          "global kalit so'zi",
          "local",
          "mumkin emas"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "def yaratadi, name() chaqiradi",
        "return qaytaradi (ishlatsa bo'ladi), print ko'rsatadi",
        "default: def f(x, y=5) — keyin kelishi shart",
        "*args tuple, **kwargs dict",
        "local funksiya ichida, global tashqarida",
        "global'ni o'zgartirish: global kalit so'zi"
      ],
      "en": [
        "def/return",
        "defaults",
        "*args/**kwargs",
        "scope"
      ]
    }
  },
  {
    "day": 18,
    "type": "topic",
    "unit": "Hafta 3 — Funksiya va string",
    "title": {
      "uz": "Stringlar va metodlar",
      "en": "Strings & methods"
    },
    "intro": {
      "uz": "String — matn, dasturlashda eng ko'p ishlatiladigan turlardan biri. Ismlar, xabarlar, fayllar — hammasi string. Sertifikatda string metodlari (upper, split, replace, strip) va indexing juda ko'p so'raladi. Bugun ularni chuqur o'rganamiz.",
      "en": "Strings are text — everywhere in code. Exams heavily test string methods and indexing."
    },
    "sections": [
      {
        "h": {
          "uz": "String indexing va slicing",
          "en": "String indexing & slicing"
        },
        "p": {
          "uz": "String — belgilar ketma-ketligi. Har belgi index'da (0 dan). [0] birinchi, [-1] oxirgi. Slicing [start:stop] — stop kirmaydi (listdagidek). MUHIM: string O'ZGARMAS — s[0]='x' xato beradi.",
          "en": "Strings are character sequences. Index from 0, [-1] last. Slicing [start:stop]. Strings are IMMUTABLE."
        },
        "code": "s = \"Python\"\nprint(s[0])      # P\nprint(s[-1])     # n\nprint(s[0:3])    # Pyt\nprint(s[2:])     # thon\nprint(s[::-1])   # nohtyP (teskari)\nprint(len(s))    # 6"
      },
      {
        "h": {
          "uz": "Katta-kichik va tozalash metodlari",
          "en": "Case & cleaning methods"
        },
        "p": {
          "uz": "upper() katta, lower() kichik, title() har so'z bosh harfi, capitalize() birinchi harf. strip() atrofdagi bo'shliqni tozalaydi. MUHIM: metodlar YANGI string qaytaradi, asl string o'zgarmaydi (o'zgarmas).",
          "en": "upper/lower/title/capitalize; strip() removes surrounding whitespace. Methods return NEW strings."
        },
        "code": "s = \"  Hello World  \"\nprint(s.upper())      # '  HELLO WORLD  '\nprint(s.lower())      # '  hello world  '\nprint(s.strip())      # 'Hello World'\nprint(\"python\".title())  # Python\nprint(s.strip().upper()) # 'HELLO WORLD'"
      },
      {
        "h": {
          "uz": "split() va join()",
          "en": "split() and join()"
        },
        "p": {
          "uz": "split() stringni listga bo'ladi (bo'shliq yoki berilgan belgi bo'yicha). join() listni stringga birlashtiradi. Bu ikkalasi matnni so'zlarga bo'lish va qayta yig'ishda eng ko'p ishlatiladi. Sertifikatda klassik juftlik.",
          "en": "split() → list, join() → string. The classic pair for text processing."
        },
        "code": "text = \"a,b,c,d\"\nparts = text.split(\",\")     # ['a','b','c','d']\nprint(len(parts))            # 4\n\nwords = \"men kod yozaman\".split()  # bo'shliq bo'yicha\nprint(words)                 # ['men','kod','yozaman']\n\nprint(\"-\".join([\"x\",\"y\",\"z\"]))  # x-y-z"
      },
      {
        "h": {
          "uz": "Qidirish va tekshirish metodlari",
          "en": "Search & check methods"
        },
        "p": {
          "uz": "in — string ichida bor-yo'qligini tekshiradi (True/False). replace() almashtiradi. find() index topadi (yo'q bo'lsa -1). count() nechta borligini sanaydi. startswith()/endswith() boshi/oxirini tekshiradi.",
          "en": "'in' checks membership; replace(); find() returns index or -1; count(); startswith/endswith."
        },
        "code": "s = \"hello world\"\nprint(\"world\" in s)         # True\nprint(s.replace(\"o\", \"0\"))  # hell0 w0rld\nprint(s.count(\"o\"))         # 2\nprint(s.find(\"world\"))      # 6\nprint(s.startswith(\"hello\"))# True"
      }
    ],
    "practice": [
      {
        "uz": "String slicing bilan [::-1] teskari yozuvni chiqar.",
        "en": "Reverse a string with [::-1]."
      },
      {
        "uz": "upper, lower, strip, title metodlarini bir stringda sinab ko'r.",
        "en": "Try upper/lower/strip/title."
      },
      {
        "uz": "Gapni split() bilan so'zlarga bo'lib, sanab chiqar.",
        "en": "Split a sentence, count words."
      },
      {
        "uz": "replace() bilan matndagi belgini almashtir.",
        "en": "Replace a character."
      },
      {
        "uz": "in bilan so'z bor-yo'qligini, count bilan nechtaligini tekshir.",
        "en": "Check membership and count."
      }
    ],
    "quiz": [
      {
        "q": "'Python'[0] natijasi?",
        "opts": [
          "P",
          "y",
          "Python",
          "0"
        ],
        "correct": 0
      },
      {
        "q": "'Python'[-1] natijasi?",
        "opts": [
          "P",
          "n",
          "o",
          "6"
        ],
        "correct": 1
      },
      {
        "q": "'Hello'[1:3] natijasi?",
        "opts": [
          "He",
          "el",
          "ell",
          "llo"
        ],
        "correct": 1
      },
      {
        "q": "'abc'[::-1] natijasi?",
        "opts": [
          "abc",
          "cba",
          "acb",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "String o'zgaruvchanmi? (s[0]='x')",
        "opts": [
          "Ha",
          "Yo'q, o'zgarmas (xato)",
          "Ba'zan",
          "Faqat harf"
        ],
        "correct": 1
      },
      {
        "q": "'a,b,c'.split(',') natijasi?",
        "opts": [
          "'abc'",
          "['a','b','c']",
          "['a,b,c']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "'-'.join(['1','2']) natijasi?",
        "opts": [
          "'12'",
          "'1-2'",
          "['1','2']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "'hello'.count('l') natijasi?",
        "opts": [
          "1",
          "2",
          "3",
          "0"
        ],
        "correct": 1
      },
      {
        "q": "'  hi  '.strip() natijasi?",
        "opts": [
          "'  hi  '",
          "'hi'",
          "'HI'",
          "'hi '"
        ],
        "correct": 1
      },
      {
        "q": "'world' in 'hello world' natijasi?",
        "opts": [
          "True",
          "False",
          "6",
          "Xato"
        ],
        "correct": 0
      }
    ],
    "konspekt": {
      "uz": [
        "String = belgilar ketma-ketligi, index 0 dan",
        "[0] birinchi, [-1] oxirgi, [start:stop] slice",
        "[::-1] teskari. String O'ZGARMAS",
        "upper/lower/title/capitalize — katta-kichik",
        "strip() atrofdagi bo'shliqni tozalaydi",
        "Metodlar YANGI string qaytaradi (asl o'zgarmas)",
        "split() → list, join() → string",
        "in tekshiradi, replace almashtiradi, count sanaydi",
        "find() index (yo'q=-1), startswith/endswith"
      ],
      "en": [
        "string = char sequence, index 0",
        "[::-1] reverse, immutable",
        "upper/lower/title",
        "strip()",
        "methods return new string",
        "split/join",
        "in, replace, count, find"
      ]
    }
  },
  {
    "day": 19,
    "type": "topic",
    "unit": "Hafta 3 — Funksiya va string",
    "title": {
      "uz": "String formatlash va escape",
      "en": "String formatting & escape"
    },
    "intro": {
      "uz": "Ma'lumotni chiroyli chiqarish uchun formatlash kerak: sonlarni yaxlitlash, ustunlarga tekislash, maxsus belgilar. f-string bu ishning zamonaviy usuli. Sertifikatda format spetsifikatorlari va escape belgilari so'raladi.",
      "en": "Formatting makes output clean: rounding, alignment, special characters. f-strings are the modern way."
    },
    "sections": [
      {
        "h": {
          "uz": "f-string asoslari va ifodalar",
          "en": "f-string basics & expressions"
        },
        "p": {
          "uz": "f\"...\" ichida {} orasiga o'zgaruvchi yoki HATTO ifoda qo'yiladi. {5+3} hisoblanadi, {name.upper()} metod ishlaydi. Bu eng o'qiladigan va tez usul — Python 3.6+ da.",
          "en": "f-strings embed variables or expressions in {}. {5+3} computes, {name.upper()} calls methods."
        },
        "code": "name = \"Max\"\nage = 20\nprint(f\"{name} is {age}\")        # Max is 20\nprint(f\"Next: {age + 1}\")        # Next: 21\nprint(f\"{name.upper()}\")         # MAX\nprint(f\"{'yes' if age >= 18 else 'no'}\")  # yes"
      },
      {
        "h": {
          "uz": "Sonlarni formatlash",
          "en": "Formatting numbers"
        },
        "p": {
          "uz": "{son:.2f} — 2 xona kasr (float). {son:,} — mingliklarni vergul bilan ajratadi. {son:.0%} — foiz. {son:05d} — 5 xona, nol bilan to'ldirish. Bu hisobotlar va pul chiqarishda juda muhim.",
          "en": "{x:.2f} 2 decimals, {x:,} thousands separator, {x:.0%} percent, {x:05d} zero-padded."
        },
        "code": "price = 1234.5678\nprint(f\"{price:.2f}\")      # 1234.57\nprint(f\"{price:,.2f}\")     # 1,234.57\nprint(f\"{0.85:.0%}\")       # 85%\nprint(f\"{42:05d}\")         # 00042\nprint(f\"{3.14159:.3f}\")    # 3.142"
      },
      {
        "h": {
          "uz": "Tekislash va kenglik",
          "en": "Alignment & width"
        },
        "p": {
          "uz": "{matn:>10} o'ngga, {matn:<10} chapga, {matn:^10} markazga tekislaydi (10 — kenglik). To'ldirish belgisini qo'shsa bo'ladi: {x:*^10}. Bu jadval kabi chiroyli chiqarishda ishlatiladi.",
          "en": "{s:>10} right, {s:<10} left, {s:^10} center align, with width 10. Fill char: {s:*^10}."
        },
        "code": "print(f\"{'hi':>10}|\")    # '        hi|'\nprint(f\"{'hi':<10}|\")    # 'hi        |'\nprint(f\"{'hi':^10}|\")    # '    hi    |'\nprint(f\"{'hi':*^10}\")    # ****hi****"
      },
      {
        "h": {
          "uz": "Escape belgilari",
          "en": "Escape characters"
        },
        "p": {
          "uz": "Ba'zi belgilar maxsus: \\n yangi qator, \\t tab, \\\\ teskari chiziq, \\\" qo'shtirnoq. Raw string r\"...\" da escape ishlamaydi (fayl yo'llari uchun). Sertifikatda \\n va \\t ko'p so'raladi.",
          "en": "Escapes: \\n newline, \\t tab, \\\\ backslash, \\\" quote. Raw strings r\"...\" ignore escapes."
        },
        "code": "print(\"Line1\\nLine2\")     # ikki qator\nprint(\"A\\tB\\tC\")          # tab bilan\nprint(\"He said \\\"Hi\\\"\")   # He said \"Hi\"\nprint(r\"C:\\new\\folder\")   # raw: \\n oddiy"
      }
    ],
    "practice": [
      {
        "uz": "f-string ichida ifoda hisobla ({5*3}).",
        "en": "Compute an expression in f-string."
      },
      {
        "uz": "Narxni 2 xona kasr va minglik vergul bilan chiqar.",
        "en": "Format price with 2 decimals and comma."
      },
      {
        "uz": "0.75 ni foiz ko'rinishida chiqar.",
        "en": "Format 0.75 as a percent."
      },
      {
        "uz": ">, <, ^ bilan matnni tekisla (kenglik 12).",
        "en": "Align text with >, <, ^."
      },
      {
        "uz": "\\n va \\t bilan formatlangan jadval chiqar.",
        "en": "Print a table with \\n and \\t."
      }
    ],
    "quiz": [
      {
        "q": "f\"{2+3}\" natijasi?",
        "opts": [
          "{2+3}",
          "5",
          "2+3",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{3.14159:.2f}\" natijasi?",
        "opts": [
          "3.14159",
          "3.14",
          "3.1",
          "3"
        ],
        "correct": 1
      },
      {
        "q": "f\"{1000000:,}\" natijasi?",
        "opts": [
          "1000000",
          "1,000,000",
          "1.000.000",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{0.5:.0%}\" natijasi?",
        "opts": [
          "0.5",
          "50%",
          "5%",
          "0.50"
        ],
        "correct": 1
      },
      {
        "q": "\\n nima?",
        "opts": [
          "Tab",
          "Yangi qator",
          "Bo'shliq",
          "Nuqta"
        ],
        "correct": 1
      },
      {
        "q": "\\t nima?",
        "opts": [
          "Yangi qator",
          "Tab",
          "Teskari chiziq",
          "Qo'shtirnoq"
        ],
        "correct": 1
      },
      {
        "q": "f\"{'hi':>5}\" — matn qayerga?",
        "opts": [
          "Chapga",
          "O'ngga",
          "Markazga",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{42:05d}\" natijasi?",
        "opts": [
          "42",
          "00042",
          "42000",
          "5"
        ],
        "correct": 1
      },
      {
        "q": "r\"C:\\new\" da \\n?",
        "opts": [
          "Yangi qator",
          "Oddiy \\n (raw)",
          "Xato",
          "Tab"
        ],
        "correct": 1
      },
      {
        "q": "f\"{'x':^7}\" — matn qayerda?",
        "opts": [
          "Chapda",
          "O'ngda",
          "Markazda",
          "Xato"
        ],
        "correct": 2
      }
    ],
    "konspekt": {
      "uz": [
        "f\"{var}\" — o'zgaruvchi/ifoda qo'yish",
        "{5+3} hisoblanadi, {s.upper()} metod ishlaydi",
        "{x:.2f} — 2 xona kasr",
        "{x:,} — minglik vergul, {x:.0%} — foiz",
        "{x:05d} — nol bilan to'ldirish (kenglik 5)",
        "{s:>10} o'ng, {s:<10} chap, {s:^10} markaz",
        "\\n yangi qator, \\t tab, \\\\ chiziq, \\\" tirnoq",
        "r\"...\" raw string — escape ishlamaydi"
      ],
      "en": [
        "f-string {var}",
        "{x:.2f}, {x:,}, {x:.0%}",
        "{x:05d} zero-pad",
        "> < ^ align",
        "\\n \\t \\\\ escapes",
        "raw strings r\"\""
      ]
    }
  },
  {
    "day": 20,
    "type": "review",
    "unit": "Hafta 3 — Funksiya va string",
    "reviewOf": 19,
    "title": {
      "uz": "Takrorlash: Stringlar",
      "en": "Review: Strings"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) index 0 dan, [-1] oxirgi, slicing, [::-1] teskari. String o'zgarmas. (2) upper/lower/strip/split/join/replace. (3) f-string: {x:.2f}, tekislash > < ^. (4) \\n \\t escape.",
      "en": "Recap: string indexing/slicing; methods; f-string formatting; escapes."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Matn tozalovchi",
        "en": "Project: Text cleaner"
      },
      "desc": {
        "uz": "Foydalanuvchi kiritgan iflos matnni tozalaydigan dastur: bo'shliqlarni olib tashlash (strip), katta harf (title), va so'zlar sonini hisoblash. String metodlari birga.",
        "en": "Clean messy text: strip, title, count words."
      },
      "starter": "text = input(\"Matn: \")\n\ncleaned = text.strip().title()\nword_count = len(text.split())\nchar_count = len(text.replace(\" \", \"\"))\n\nprint(f\"Tozalangan: {cleaned}\")\nprint(f\"So'zlar: {word_count}\")\nprint(f\"Harflar: {char_count}\")"
    },
    "practice": [
      {
        "uz": "[::-1] bilan teskari yozuv.",
        "en": "Reverse with [::-1]."
      },
      {
        "uz": "split() va join() bilan matn qayta yig'.",
        "en": "split then join."
      },
      {
        "uz": "f-string bilan sonni formatla.",
        "en": "Format number with f-string."
      }
    ],
    "quiz": [
      {
        "q": "'Python'[0]?",
        "opts": [
          "P",
          "y",
          "Python",
          "0"
        ],
        "correct": 0
      },
      {
        "q": "'abc'[::-1]?",
        "opts": [
          "abc",
          "cba",
          "acb",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "String o'zgaruvchanmi?",
        "opts": [
          "Ha",
          "Yo'q (o'zgarmas)",
          "Ba'zan",
          "Faqat harf"
        ],
        "correct": 1
      },
      {
        "q": "'a,b'.split(',')?",
        "opts": [
          "'ab'",
          "['a','b']",
          "['a,b']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "'-'.join(['1','2'])?",
        "opts": [
          "'12'",
          "'1-2'",
          "['1','2']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "'  hi  '.strip()?",
        "opts": [
          "'  hi  '",
          "'hi'",
          "'HI'",
          "'hi '"
        ],
        "correct": 1
      },
      {
        "q": "f\"{3.14159:.2f}\"?",
        "opts": [
          "3.14159",
          "3.14",
          "3.1",
          "3"
        ],
        "correct": 1
      },
      {
        "q": "\\n nima?",
        "opts": [
          "Tab",
          "Yangi qator",
          "Bo'shliq",
          "Nuqta"
        ],
        "correct": 1
      },
      {
        "q": "'world' in 'hello world'?",
        "opts": [
          "True",
          "False",
          "6",
          "Xato"
        ],
        "correct": 0
      },
      {
        "q": "'hi'.upper()?",
        "opts": [
          "'hi'",
          "'HI'",
          "'Hi'",
          "Xato"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "index 0 dan, [-1] oxirgi, [::-1] teskari",
        "String O'ZGARMAS",
        "upper/lower/strip/title",
        "split() → list, join() → string",
        "replace, count, find, in",
        "f-string: {x:.2f}, tekislash > < ^",
        "\\n yangi qator, \\t tab"
      ],
      "en": [
        "indexing/slicing",
        "immutable",
        "methods",
        "split/join",
        "f-string format",
        "escapes"
      ]
    }
  },
  {
    "day": 21,
    "type": "topic",
    "unit": "Hafta 3 — Funksiya va string",
    "title": {
      "uz": "List comprehension",
      "en": "List comprehension"
    },
    "intro": {
      "uz": "List comprehension — Python'ning eng chiroyli imkoniyati: bitta qatorda yangi list yasash. Loop va shartni siqib, o'qiladigan kod yozasan. Sertifikatda va real kodda juda ko'p uchraydi. Bugun uni chuqur o'rganamiz.",
      "en": "List comprehension builds a list in one line, compressing loop and condition. Common on exams."
    },
    "sections": [
      {
        "h": {
          "uz": "Oddiy comprehension",
          "en": "Basic comprehension"
        },
        "p": {
          "uz": "Sintaksis: [ifoda for element in ketma-ketlik]. Bu loop bilan list yasashning qisqa shakli. Masalan har sonning kvadratini olish. O'ngdan chapga o'qi: 'har x uchun, x*x ol'.",
          "en": "[expression for item in sequence]. Short form of building a list with a loop."
        },
        "code": "# Oddiy loop:\nsquares = []\nfor x in range(5):\n    squares.append(x ** 2)\n\n# Comprehension (bir qator):\nsquares = [x ** 2 for x in range(5)]\nprint(squares)   # [0, 1, 4, 9, 16]"
      },
      {
        "h": {
          "uz": "Shart bilan comprehension",
          "en": "Comprehension with condition"
        },
        "p": {
          "uz": "Oxiriga if qo'shib, faqat shartga mos elementlarni olasan: [x for x in ... if shart]. Masalan faqat juft sonlar. Bu filter va map'ni birga qiladi — juda kuchli.",
          "en": "Add if to filter: [x for x in ... if condition]. Keeps only matching elements."
        },
        "code": "# Faqat juft sonlar:\nevens = [x for x in range(10) if x % 2 == 0]\nprint(evens)   # [0, 2, 4, 6, 8]\n\n# Faqat uzun so'zlar:\nwords = [\"cat\", \"elephant\", \"dog\", \"tiger\"]\nlong = [w for w in words if len(w) > 3]\nprint(long)    # ['elephant', 'tiger']"
      },
      {
        "h": {
          "uz": "Ifoda bilan o'zgartirish",
          "en": "Transforming with expression"
        },
        "p": {
          "uz": "Element ustida amal bajarib list yasaysan: har harfni katta qilish, har sonni ikkilash, string uzunligini olish. Ifoda qismi (boshidagi) elementni qanday o'zgartirishni belgilaydi.",
          "en": "Transform each element: uppercase, double, get length. The expression defines the transformation."
        },
        "code": "words = [\"hi\", \"bye\", \"ok\"]\nupper = [w.upper() for w in words]\nprint(upper)   # ['HI', 'BYE', 'OK']\n\nlengths = [len(w) for w in words]\nprint(lengths) # [2, 3, 2]\n\ndoubled = [n * 2 for n in [1, 2, 3]]\nprint(doubled) # [2, 4, 6]"
      },
      {
        "h": {
          "uz": "if-else va nested comprehension",
          "en": "if-else & nested"
        },
        "p": {
          "uz": "if-else ni ifoda oldiga qo'yish mumkin: [x if shart else y for ...]. Bu har elementni ikki holatdan biriga aylantiradi. Nested (ichma-ich) ham bo'ladi, lekin o'qish qiyinlashadi — ehtiyot bo'l.",
          "en": "if-else before the expression: [x if cond else y for ...]. Transforms each into one of two."
        },
        "code": "nums = [1, 2, 3, 4, 5]\n# Juft/toq belgilash:\nlabels = [\"juft\" if n % 2 == 0 else \"toq\" for n in nums]\nprint(labels)  # ['toq','juft','toq','juft','toq']\n\n# Dictionary comprehension ham bor:\nsquares = {x: x**2 for x in range(4)}\nprint(squares) # {0:0, 1:1, 2:4, 3:9}"
      }
    ],
    "practice": [
      {
        "uz": "Comprehension bilan 1-10 kvadratlar listini yasa.",
        "en": "Squares 1-10 with comprehension."
      },
      {
        "uz": "if bilan faqat 5 dan katta sonlarni filtrla.",
        "en": "Filter numbers > 5."
      },
      {
        "uz": "Har so'zni katta harf qiladigan comprehension yoz.",
        "en": "Uppercase each word."
      },
      {
        "uz": "if-else bilan sonlarni 'musbat'/'manfiy' deb belgila.",
        "en": "Label positive/negative with if-else."
      },
      {
        "uz": "Dictionary comprehension bilan {son: kvadrat} yasa.",
        "en": "Dict comprehension {n: n**2}."
      }
    ],
    "quiz": [
      {
        "q": "[x*2 for x in range(3)] natijasi?",
        "opts": [
          "[0,1,2]",
          "[0,2,4]",
          "[2,4,6]",
          "[1,2,3]"
        ],
        "correct": 1
      },
      {
        "q": "[x for x in range(5) if x%2==0]?",
        "opts": [
          "[1,3]",
          "[0,2,4]",
          "[0,1,2,3,4]",
          "[2,4]"
        ],
        "correct": 1
      },
      {
        "q": "Comprehension sintaksisi?",
        "opts": [
          "[for x ifoda]",
          "[ifoda for x in seq]",
          "[x in seq]",
          "(ifoda for x)"
        ],
        "correct": 1
      },
      {
        "q": "[w.upper() for w in ['a','b']]?",
        "opts": [
          "['a','b']",
          "['A','B']",
          "['AB']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "[len(w) for w in ['hi','bye']]?",
        "opts": [
          "[2,3]",
          "['hi','bye']",
          "[2,2]",
          "5"
        ],
        "correct": 0
      },
      {
        "q": "if comprehension oxirida nima qiladi?",
        "opts": [
          "O'zgartiradi",
          "Filtrlaydi (tanlaydi)",
          "Xato",
          "Qo'shadi"
        ],
        "correct": 1
      },
      {
        "q": "['j' if x%2==0 else 't' for x in [1,2]]?",
        "opts": [
          "['t','j']",
          "['j','t']",
          "['t','t']",
          "Xato"
        ],
        "correct": 0
      },
      {
        "q": "Comprehension oddiy loopga nisbatan?",
        "opts": [
          "Sekinroq",
          "Qisqaroq va tezroq",
          "Bir xil",
          "Murakkabroq"
        ],
        "correct": 1
      },
      {
        "q": "{x: x**2 for x in range(3)} nima?",
        "opts": [
          "list",
          "dict comprehension",
          "set",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "[x for x in 'abc'] natijasi?",
        "opts": [
          "'abc'",
          "['a','b','c']",
          "[abc]",
          "Xato"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "[ifoda for element in ketma-ketlik] — bir qatorda list",
        "[x**2 for x in range(5)] = [0,1,4,9,16]",
        "if oxirida — filtrlaydi: [x for x in ... if shart]",
        "Ifoda qismi elementni o'zgartiradi (upper, *2, len)",
        "if-else oldida: [x if shart else y for ...]",
        "Dict comprehension: {k: v for ...}",
        "Comprehension = loop'ning qisqa, tez shakli"
      ],
      "en": [
        "[expr for x in seq]",
        "filter with if at end",
        "transform with expression",
        "if-else before expr",
        "dict comprehension",
        "shorter than loop"
      ]
    }
  },
  {
    "day": 22,
    "type": "review",
    "unit": "Hafta 3 — Funksiya va string",
    "reviewOf": 21,
    "title": {
      "uz": "Takrorlash: Funksiya, string, comprehension",
      "en": "Review: Functions, strings, comprehension"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) funksiya: def/return, *args/**kwargs. (2) string metodlari va formatlash. (3) comprehension: [ifoda for x in seq if shart]. Uch mavzu birga real loyihada.",
      "en": "Recap: functions; strings; comprehension — combined."
    },
    "project": {
      "title": {
        "uz": "Haftalik loyiha: So'z chastotasi hisoblagichi",
        "en": "Weekly project: Word frequency counter"
      },
      "desc": {
        "uz": "Matnni olib, har so'z necha marta kelganini dictionary'da sanaydigan dastur. split(), dict, loop, va comprehension birga. Bu NLP'ning eng oddiy ko'rinishi.",
        "en": "Count word frequency with dict + comprehension."
      },
      "starter": "text = input(\"Matn: \").lower()\nwords = text.split()\n\nfreq = {}\nfor word in words:\n    freq[word] = freq.get(word, 0) + 1\n\n# Comprehension bilan uzun so'zlar:\nlong_words = [w for w in words if len(w) > 4]\n\nprint(\"Chastota:\")\nfor word, count in freq.items():\n    print(f\"  {word}: {count}\")\nprint(f\"Uzun so'zlar: {long_words}\")"
    },
    "practice": [
      {
        "uz": "comprehension bilan kvadratlar listi.",
        "en": "Squares with comprehension."
      },
      {
        "uz": "funksiya + string metodlari birga.",
        "en": "Function + string methods."
      },
      {
        "uz": "if bilan comprehension'da filtrla.",
        "en": "Filter with comprehension."
      }
    ],
    "quiz": [
      {
        "q": "[x*2 for x in range(3)]?",
        "opts": [
          "[0,1,2]",
          "[0,2,4]",
          "[2,4,6]",
          "[1,2,3]"
        ],
        "correct": 1
      },
      {
        "q": "[x for x in range(5) if x%2==0]?",
        "opts": [
          "[1,3]",
          "[0,2,4]",
          "[0,1,2,3,4]",
          "[2,4]"
        ],
        "correct": 1
      },
      {
        "q": "comprehension sintaksisi?",
        "opts": [
          "[for x ifoda]",
          "[ifoda for x in seq]",
          "[x in seq]",
          "(ifoda)"
        ],
        "correct": 1
      },
      {
        "q": "return vs print?",
        "opts": [
          "Bir xil",
          "print ko'rsatadi, return qaytaradi",
          "return ko'rsatadi",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "*args nima?",
        "opts": [
          "dict",
          "tuple (cheksiz arg)",
          "list",
          "str"
        ],
        "correct": 1
      },
      {
        "q": "'a,b'.split(',')?",
        "opts": [
          "'ab'",
          "['a','b']",
          "['a,b']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "f\"{5:.1f}\"?",
        "opts": [
          "5",
          "5.0",
          "5.00",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "[w.upper() for w in ['a']]?",
        "opts": [
          "['a']",
          "['A']",
          "['AB']",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "dict.get('x',0) yo'q bo'lsa?",
        "opts": [
          "Xato",
          "0",
          "None",
          "x"
        ],
        "correct": 1
      },
      {
        "q": "comprehension loopga nisbatan?",
        "opts": [
          "Sekin",
          "Qisqa va tez",
          "Bir xil",
          "Murakkab"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "funksiya: def/return, *args/**kwargs",
        "string: metodlar + formatlash",
        "comprehension: [ifoda for x in seq if shart]",
        "dict.get(key, default) — xavfsiz",
        "comprehension = loop'ning qisqa shakli"
      ],
      "en": [
        "functions",
        "strings",
        "comprehension",
        "dict.get"
      ]
    }
  },
  {
    "day": 23,
    "type": "topic",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "title": {
      "uz": "Xatolarni tutish (try/except)",
      "en": "Error handling"
    },
    "intro": {
      "uz": "Dasturlar xato qiladi: foydalanuvchi harf o'rniga son kiritadi, fayl topilmaydi, nolga bo'linadi. try/except bu xatolarni ushlab, dasturni yiqilishdan saqlaydi. Sertifikatda xato turlari (ValueError, TypeError) va try/except/finally tuzilishi ko'p so'raladi.",
      "en": "Programs error: bad input, missing files, division by zero. try/except catches these. Exams test error types."
    },
    "sections": [
      {
        "h": {
          "uz": "try / except asoslari",
          "en": "try / except basics"
        },
        "p": {
          "uz": "try blokiga 'xato bo'lishi mumkin' kod yoziladi. Xato chiqsa, dastur yiqilmaydi — except bloki ishlaydi. Bu foydalanuvchi noto'g'ri ma'lumot kiritganda juda muhim.",
          "en": "try holds risky code. On error, except runs instead of crashing."
        },
        "code": "try:\n    age = int(input(\"Yosh: \"))\n    print(age + 1)\nexcept:\n    print(\"Xato: son kiriting!\")\n\n# 'yigirma' yozsa — yiqilmaydi, except ishlaydi"
      },
      {
        "h": {
          "uz": "Aniq xato turlari",
          "en": "Specific error types"
        },
        "p": {
          "uz": "Har xatoning nomi bor: ValueError (noto'g'ri qiymat, int('abc')), TypeError (noto'g'ri tur, '5'+5), ZeroDivisionError (10/0), IndexError (yo'q index), KeyError (yo'q key). Aniq turni ushlash yaxshiroq — har xatoga boshqacha javob.",
          "en": "Error types: ValueError, TypeError, ZeroDivisionError, IndexError, KeyError. Catch specific types."
        },
        "code": "try:\n    x = int(input(\"Son: \"))\n    print(10 / x)\nexcept ValueError:\n    print(\"Bu son emas!\")\nexcept ZeroDivisionError:\n    print(\"Nolga bo'lib bo'lmaydi!\")"
      },
      {
        "h": {
          "uz": "except ... as e va xabar",
          "en": "except ... as e"
        },
        "p": {
          "uz": "except Turi as e — xatoning matnini beradi (nima bo'lganini ko'rish uchun). Bir except da bir necha turni ushlash: except (ValueError, TypeError). Bu debugging va foydalanuvchiga aniq xabar berishda foydali.",
          "en": "except Type as e gives the error message. Catch multiple: except (ValueError, TypeError)."
        },
        "code": "try:\n    x = int(\"abc\")\nexcept ValueError as e:\n    print(f\"Xato: {e}\")\n    # Xato: invalid literal for int()\n\n# Bir necha tur:\ntry:\n    pass\nexcept (ValueError, TypeError) as e:\n    print(e)"
      },
      {
        "h": {
          "uz": "else va finally",
          "en": "else and finally"
        },
        "p": {
          "uz": "else — xato BO'LMAGANDA ishlaydi ('hammasi joyida, davom et'). finally — xato bo'ldimi yo'qmi, HAR DOIM ishlaydi (tozalash uchun: fayl yopish). Sertifikatda finally har doim ishlashi ko'p so'raladi.",
          "en": "else runs when NO error; finally runs ALWAYS (cleanup). Exams test that finally always runs."
        },
        "code": "try:\n    x = int(\"5\")\nexcept ValueError:\n    print(\"Xato\")\nelse:\n    print(f\"OK: {x}\")    # xato yo'q → ishlaydi\nfinally:\n    print(\"Har doim\")    # HAR DOIM ishlaydi\n# Chiqishi: OK: 5 / Har doim"
      }
    ],
    "practice": [
      {
        "uz": "int(input()) ni try/except bilan o'ra, harf kiritilsa xabar chiqsin.",
        "en": "Guard int(input())."
      },
      {
        "uz": "10/son ni ZeroDivisionError bilan himoyala.",
        "en": "Guard division by zero."
      },
      {
        "uz": "except ... as e bilan xato matnini chiqar.",
        "en": "Print error message with as e."
      },
      {
        "uz": "try/except/else/finally to'rttasini birga ishlat.",
        "en": "Use all four together."
      },
      {
        "uz": "Bir except da ikki xato turini ushla.",
        "en": "Catch two error types in one except."
      }
    ],
    "quiz": [
      {
        "q": "try/except nima uchun?",
        "opts": [
          "Tezlik",
          "Xatoni ushlab, yiqilishdan saqlash",
          "Rang",
          "Fayl"
        ],
        "correct": 1
      },
      {
        "q": "int('abc') qanday xato?",
        "opts": [
          "TypeError",
          "ValueError",
          "ZeroDivisionError",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "10/0 qanday xato?",
        "opts": [
          "ValueError",
          "ZeroDivisionError",
          "TypeError",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "'5'+5 qanday xato?",
        "opts": [
          "ValueError",
          "TypeError",
          "IndexError",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "except qachon ishlaydi?",
        "opts": [
          "Har doim",
          "Xato bo'lganda",
          "Xato yo'qda",
          "Hech qachon"
        ],
        "correct": 1
      },
      {
        "q": "else (try bilan) qachon?",
        "opts": [
          "Xato bo'lganda",
          "Xato BO'LMAGANDA",
          "Har doim",
          "Hech qachon"
        ],
        "correct": 1
      },
      {
        "q": "finally qachon ishlaydi?",
        "opts": [
          "Faqat xatoda",
          "Faqat muvaffaqiyatda",
          "HAR DOIM",
          "Hech qachon"
        ],
        "correct": 2
      },
      {
        "q": "except ValueError as e — e nima?",
        "opts": [
          "Son",
          "Xato ma'lumoti",
          "Fayl",
          "True"
        ],
        "correct": 1
      },
      {
        "q": "list[100] (yo'q) qanday xato?",
        "opts": [
          "KeyError",
          "IndexError",
          "ValueError",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "try'siz xato chiqsa?",
        "opts": [
          "Hech narsa",
          "Dastur yiqiladi",
          "Tuzatiladi",
          "Qaytadan"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "try: — xato bo'lishi mumkin kod",
        "except: — xato bo'lganda ishlaydi (yiqilmaydi)",
        "ValueError (int('abc')), TypeError ('5'+5)",
        "ZeroDivisionError (10/0), IndexError, KeyError",
        "except Turi: — aniq turni ushlash",
        "except ... as e: — xato matni",
        "else: — xato BO'LMAGANDA",
        "finally: — HAR DOIM ishlaydi (tozalash)"
      ],
      "en": [
        "try/except catches errors",
        "ValueError, TypeError, ZeroDivisionError",
        "IndexError, KeyError",
        "except Type as e",
        "else = no error",
        "finally = always"
      ]
    }
  },
  {
    "day": 24,
    "type": "topic",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "title": {
      "uz": "Fayllar bilan ishlash",
      "en": "Working with files"
    },
    "intro": {
      "uz": "Dastur tugagach ma'lumot yo'qoladi. Fayllar buni hal qiladi — ma'lumotni diskka saqlab, keyin o'qiysan. Sertifikatda fayl rejimlari (r/w/a), with bloki va o'qish usullari so'raladi. Bugun fayl yozish va o'qishni chuqur o'rganamiz.",
      "en": "Files persist data to disk. Exams test file modes (r/w/a), with blocks, and reading methods."
    },
    "sections": [
      {
        "h": {
          "uz": "Fayl ochish: open() va rejimlar",
          "en": "open() and modes"
        },
        "p": {
          "uz": "open(nom, rejim) faylni ochadi. Rejimlar: 'r' o'qish (default), 'w' yozish (eskisini O'CHIRADI!), 'a' qo'shish (append, oxiriga). Fayl ishlatib bo'lgach yopish shart — aks holda ma'lumot saqlanmasligi mumkin.",
          "en": "open(name, mode): 'r' read, 'w' write (ERASES!), 'a' append. Must close after use."
        },
        "code": "# Yozish ('w' — eskisini o'chiradi):\nf = open(\"data.txt\", \"w\")\nf.write(\"Salom\\n\")\nf.close()   # yopish SHART\n\n# Qo'shish ('a' — oxiriga):\nf = open(\"data.txt\", \"a\")\nf.write(\"Yana\\n\")\nf.close()"
      },
      {
        "h": {
          "uz": "with bloki — eng yaxshi usul",
          "en": "with block — best practice"
        },
        "p": {
          "uz": "with open(...) as f: — faylni AVTOMATIK yopadi, hatto xato bo'lsa ham. close() ni unutmaslikning eng yaxshi usuli. Sertifikat va professional kod doim with ishlatadi. Blok tugagach fayl yopiladi.",
          "en": "with open(...) as f: auto-closes the file, even on error. The recommended way."
        },
        "code": "with open(\"data.txt\", \"w\") as f:\n    f.write(\"Birinchi\\n\")\n    f.write(\"Ikkinchi\\n\")\n# fayl avtomatik yopildi\n\nwith open(\"data.txt\", \"r\") as f:\n    content = f.read()\nprint(content)"
      },
      {
        "h": {
          "uz": "O'qish usullari",
          "en": "Reading methods"
        },
        "p": {
          "uz": "read() butun faylni bitta string qilib o'qiydi. readline() bitta qator. readlines() qatorlar listini beradi. Eng yaxshi: for line in f — qator-qator (katta fayllarda tejamli). strip() ortiqcha \\n ni oladi.",
          "en": "read() whole file, readline() one line, readlines() list of lines. Best: for line in f."
        },
        "code": "with open(\"data.txt\", \"r\") as f:\n    for line in f:\n        print(line.strip())   # \\n ni oladi\n\n# Yoki:\nwith open(\"data.txt\", \"r\") as f:\n    lines = f.readlines()   # list\n    print(len(lines))       # qatorlar soni"
      },
      {
        "h": {
          "uz": "Fayl va xato birga",
          "en": "Files with error handling"
        },
        "p": {
          "uz": "Mavjud bo'lmagan faylni 'r' bilan ochsa — FileNotFoundError. Buni try/except bilan ushlash kerak. Fayl bilan ishlaganda xato himoyasi professional kodning majburiy qismi.",
          "en": "Opening a missing file with 'r' raises FileNotFoundError. Guard with try/except."
        },
        "code": "try:\n    with open(\"yoq.txt\", \"r\") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print(\"Fayl topilmadi\")\n\n# Ro'yxatni saqlash:\ntasks = [\"a\", \"b\", \"c\"]\nwith open(\"tasks.txt\", \"w\") as f:\n    for t in tasks:\n        f.write(t + \"\\n\")"
      }
    ],
    "practice": [
      {
        "uz": "Faylga 3 qator yoz ('w'), keyin o'qib chiqar.",
        "en": "Write 3 lines, then read."
      },
      {
        "uz": "'a' rejimi bilan mavjud faylga qo'sh.",
        "en": "Append with 'a' mode."
      },
      {
        "uz": "with bloki bilan faylni o'qib, qator-qator chiqar.",
        "en": "Read line-by-line with with."
      },
      {
        "uz": "readlines() bilan qatorlar sonini sana.",
        "en": "Count lines with readlines()."
      },
      {
        "uz": "Yo'q faylni ochib, FileNotFoundError ni ushla.",
        "en": "Catch FileNotFoundError."
      }
    ],
    "quiz": [
      {
        "q": "O'qish rejimi qaysi?",
        "opts": [
          "'w'",
          "'r'",
          "'a'",
          "'x'"
        ],
        "correct": 1
      },
      {
        "q": "'w' rejimi mavjud fayl bilan?",
        "opts": [
          "Qo'shadi",
          "Eskisini O'CHIRADI",
          "Xato",
          "O'qiydi"
        ],
        "correct": 1
      },
      {
        "q": "Qo'shish (append) rejimi?",
        "opts": [
          "'r'",
          "'w'",
          "'a'",
          "'add'"
        ],
        "correct": 2
      },
      {
        "q": "with open() afzalligi?",
        "opts": [
          "Tez",
          "Faylni avtomatik yopadi",
          "Rang",
          "Farqi yo'q"
        ],
        "correct": 1
      },
      {
        "q": "read() nima qaytaradi?",
        "opts": [
          "list",
          "Butun fayl (string)",
          "Son",
          "Bitta qator"
        ],
        "correct": 1
      },
      {
        "q": "readlines() nima qaytaradi?",
        "opts": [
          "string",
          "Qatorlar listi",
          "Son",
          "Bitta harf"
        ],
        "correct": 1
      },
      {
        "q": "\\n nima?",
        "opts": [
          "Bo'shliq",
          "Yangi qator",
          "Tab",
          "Nuqta"
        ],
        "correct": 1
      },
      {
        "q": "Yo'q faylni 'r' bilan ochsa?",
        "opts": [
          "Yaratadi",
          "FileNotFoundError",
          "Bo'sh",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "line.strip() nega kerak?",
        "opts": [
          "Tezlik",
          "Ortiqcha \\n ni olish",
          "Rang",
          "Kerak emas"
        ],
        "correct": 1
      },
      {
        "q": "f.write(5) — muammo?",
        "opts": [
          "Yo'q",
          "Son emas, string kerak str(5)",
          "Fayl yopiq",
          "Rejim"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "open(nom, rejim): 'r' o'qish, 'w' yozish (o'chiradi!), 'a' qo'shish",
        "with open(...) as f: — avtomatik yopadi (eng yaxshi)",
        "f.write(matn) — yozadi, \\n yangi qator",
        "read() butun fayl, readlines() qatorlar listi",
        "for line in f: — qator-qator (tejamli)",
        "line.strip() — ortiqcha \\n ni oladi",
        "Yo'q faylni 'r' → FileNotFoundError",
        "f.write(str(son)) — son yozish uchun aylantir"
      ],
      "en": [
        "open modes r/w/a",
        "with auto-closes",
        "write/read",
        "readlines() list",
        "for line in f",
        "strip() removes \\n",
        "FileNotFoundError"
      ]
    }
  },
  {
    "day": 25,
    "type": "review",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "reviewOf": 24,
    "title": {
      "uz": "Takrorlash: Xato va fayl",
      "en": "Review: Errors & files"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) try/except — xatoni ushlaydi (ValueError, TypeError, ZeroDivisionError). (2) else xatosiz, finally har doim. (3) with open(nom, rejim) 'r'/'w'/'a'. (4) read/readlines/for line in f.",
      "en": "Recap: try/except/finally; file modes; reading."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Xavfsiz vazifalar menejeri",
        "en": "Project: Safe task manager"
      },
      "desc": {
        "uz": "Vazifalarni faylda saqlaydigan dastur: qo'shish (append), ko'rish. Fayl bilan saqlaydi, try/except bilan xatolarni ushlaydi. Fayl + xato + funksiya birga.",
        "en": "File-backed task manager with try/except."
      },
      "starter": "def add_task(task):\n    with open(\"tasks.txt\", \"a\") as f:\n        f.write(task + \"\\n\")\n    print(\"Qo'shildi!\")\n\ndef show_tasks():\n    try:\n        with open(\"tasks.txt\", \"r\") as f:\n            for i, line in enumerate(f):\n                print(f\"{i+1}. {line.strip()}\")\n    except FileNotFoundError:\n        print(\"Hali vazifa yo'q\")\n\nadd_task(\"Python o'rganish\")\nshow_tasks()"
    },
    "practice": [
      {
        "uz": "int(input()) ni try/except bilan himoyala.",
        "en": "Guard int(input())."
      },
      {
        "uz": "Faylga yozib, o'qib tekshir.",
        "en": "Write then read a file."
      },
      {
        "uz": "FileNotFoundError ni ushla.",
        "en": "Catch FileNotFoundError."
      }
    ],
    "quiz": [
      {
        "q": "int('abc') xatosi?",
        "opts": [
          "TypeError",
          "ValueError",
          "ZeroDiv",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "10/0 xatosi?",
        "opts": [
          "ValueError",
          "ZeroDivisionError",
          "TypeError",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "finally qachon?",
        "opts": [
          "Faqat xato",
          "Faqat OK",
          "HAR DOIM",
          "Hech qachon"
        ],
        "correct": 2
      },
      {
        "q": "else (try) qachon?",
        "opts": [
          "Xatoda",
          "Xato YO'Qda",
          "Har doim",
          "Hech qachon"
        ],
        "correct": 1
      },
      {
        "q": "'w' rejimi?",
        "opts": [
          "O'qish",
          "Yozish (o'chiradi)",
          "Qo'shish",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "'a' rejimi?",
        "opts": [
          "O'qish",
          "Yozish",
          "Qo'shish (oxiriga)",
          "Xato"
        ],
        "correct": 2
      },
      {
        "q": "with open() afzalligi?",
        "opts": [
          "Tez",
          "Avtomatik yopadi",
          "Rang",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "Yo'q faylni 'r' bilan?",
        "opts": [
          "Yaratadi",
          "FileNotFoundError",
          "Bo'sh",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "readlines() qaytaradi?",
        "opts": [
          "string",
          "Qatorlar listi",
          "Son",
          "Harf"
        ],
        "correct": 1
      },
      {
        "q": "except ... as e — e?",
        "opts": [
          "Son",
          "Xato ma'lumoti",
          "Fayl",
          "True"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "try/except — xatoni ushlaydi (yiqilmaydi)",
        "ValueError, TypeError, ZeroDivisionError",
        "else xatosiz, finally HAR DOIM",
        "with open(nom, rejim) — avtomatik yopadi",
        "'r' o'qish, 'w' yozish (o'chiradi), 'a' qo'shish",
        "read/readlines/for line in f",
        "FileNotFoundError — yo'q fayl"
      ],
      "en": [
        "try/except/finally",
        "error types",
        "file modes",
        "reading"
      ]
    }
  },
  {
    "day": 26,
    "type": "topic",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "title": {
      "uz": "Modullar va import",
      "en": "Modules & import"
    },
    "intro": {
      "uz": "Modul — boshqalar yozgan tayyor kod to'plami. import bilan uni chaqirasan. math, random, datetime — Python bilan keladi. AI'da NumPy, Pandas ham import qilinadi. O'zing ham modul yasashing mumkin.",
      "en": "A module is ready-made code. You call it with import. NumPy, Pandas are imported too."
    },
    "sections": [
      {
        "h": {
          "uz": "import — modulni chaqirish",
          "en": "import"
        },
        "p": {
          "uz": "import moduleName butun modulni oladi. Keyin modul.funksiya() bilan ishlatasan. Python'da minglab tayyor modul bor.",
          "en": "import moduleName, then module.function()."
        },
        "code": "import math\n\nprint(math.sqrt(16))    # 4.0\nprint(math.pi)          # 3.14159...\nprint(math.ceil(4.2))   # 5\nprint(math.floor(4.8))  # 4"
      },
      {
        "h": {
          "uz": "random — tasodifiy sonlar",
          "en": "random"
        },
        "p": {
          "uz": "random tasodifiy qiymatlar beradi: randint(a,b) butun son, choice(list) tasodifiy element, shuffle(list) aralashtiradi. O'yin va simulyatsiyalarda ishlatiladi.",
          "en": "random: randint, choice, shuffle."
        },
        "code": "import random\n\nprint(random.randint(1, 6))          # 1-6\nprint(random.choice([\"a\",\"b\",\"c\"]))  # tasodifiy\n\nnums = [1, 2, 3, 4, 5]\nrandom.shuffle(nums)\nprint(nums)"
      },
      {
        "h": {
          "uz": "from ... import",
          "en": "from ... import"
        },
        "p": {
          "uz": "Faqat kerakli funksiyani olish: from math import sqrt. Keyin modul nomsiz sqrt(16) deb ishlatasan. import ... as bilan qisqa nom beriladi.",
          "en": "from math import sqrt; import x as y."
        },
        "code": "from math import sqrt, pi\n\nprint(sqrt(25))   # 5.0\nprint(pi)         # 3.14159\n\nimport random as r\nprint(r.randint(1, 10))"
      },
      {
        "h": {
          "uz": "O'z modulingni yasash",
          "en": "Your own module"
        },
        "p": {
          "uz": "Har .py fayl — modul. Bir faylda funksiya yozib, boshqasidan import qilsang bo'ladi. Katta loyihani bo'laklarga bo'lish uchun.",
          "en": "Every .py file is a module you can import."
        },
        "code": "# tools.py:\ndef greet(name):\n    return f\"Salom, {name}!\"\n\n# main.py:\nimport tools\nprint(tools.greet(\"Max\"))\n\nfrom tools import greet\nprint(greet(\"Ali\"))"
      }
    ],
    "practice": [
      {
        "uz": "math bilan sqrt, pi, ceil, floor ni sinab ko'r.",
        "en": "Try math functions."
      },
      {
        "uz": "random.randint bilan zar tashlash o'yini yoz.",
        "en": "Dice with randint."
      },
      {
        "uz": "random.choice bilan tasodifiy tanlov qil.",
        "en": "Random choice."
      },
      {
        "uz": "from math import bilan aniq funksiya ol.",
        "en": "from math import."
      },
      {
        "uz": "import ... as bilan qisqa nom ber.",
        "en": "import as."
      }
    ],
    "quiz": [
      {
        "q": "Modul nima?",
        "opts": [
          "O'zgaruvchi",
          "Tayyor kod to'plami",
          "Son",
          "Klass"
        ],
        "correct": 1
      },
      {
        "q": "import math'dan keyin sqrt qanday?",
        "opts": [
          "sqrt()",
          "math.sqrt()",
          "import.sqrt()",
          "sqrt.math()"
        ],
        "correct": 1
      },
      {
        "q": "random.randint(1,6) nima beradi?",
        "opts": [
          "Doim 1",
          "1-6 tasodifiy",
          "6",
          "List"
        ],
        "correct": 1
      },
      {
        "q": "random.choice(list) nima qiladi?",
        "opts": [
          "Sort",
          "Tasodifiy element",
          "O'chiradi",
          "Qo'shadi"
        ],
        "correct": 1
      },
      {
        "q": "from math import sqrt — keyin?",
        "opts": [
          "math.sqrt()",
          "sqrt() to'g'ridan",
          "import sqrt",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "import numpy as np — np nima?",
        "opts": [
          "Xato",
          "numpy'ga qisqa nom",
          "Yangi modul",
          "Funksiya"
        ],
        "correct": 1
      },
      {
        "q": "math.pi nima?",
        "opts": [
          "Funksiya",
          "Doimiy qiymat",
          "Klass",
          "List"
        ],
        "correct": 1
      },
      {
        "q": "Har .py fayl nima bo'la oladi?",
        "opts": [
          "Faqat main",
          "Modul",
          "Klass",
          "Funksiya"
        ],
        "correct": 1
      },
      {
        "q": "random.shuffle(list) nima?",
        "opts": [
          "Sort",
          "Aralashtiradi",
          "O'chiradi",
          "Nusxa"
        ],
        "correct": 1
      },
      {
        "q": "NumPy qanday olinadi?",
        "opts": [
          "O'zi keladi",
          "import bilan",
          "class bilan",
          "def bilan"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "Modul = tayyor kod to'plami",
        "import math → math.sqrt(), math.pi",
        "random: randint, choice, shuffle",
        "from math import sqrt → sqrt()",
        "import numpy as np → qisqa nom",
        "Har .py fayl — modul",
        "NumPy, Pandas import bilan olinadi"
      ],
      "en": [
        "Module = ready code",
        "import math",
        "random funcs",
        "from import",
        "import as",
        "every .py is a module"
      ]
    }
  },
  {
    "day": 27,
    "type": "topic",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "title": {
      "uz": "Klasslar (OOP asoslari)",
      "en": "Classes (OOP basics)"
    },
    "intro": {
      "uz": "Klass ma'lumot va amalni birlashtiradi — o'z ma'lumoti va amallari bo'lgan 'obyekt' yaratadi. AI kutubxonalari (NumPy, PyTorch) klasslar ustiga qurilgan.",
      "en": "A class bundles data and behavior into objects. ML libraries are built on classes."
    },
    "sections": [
      {
        "h": {
          "uz": "Klass — obyekt shabloni",
          "en": "Class — a template"
        },
        "p": {
          "uz": "class shablon yaratadi (masalan 'Mashina' tushunchasi). Obyekt — shu shablondan yasalgan aniq narsa. Nom katta harf bilan boshlanadi.",
          "en": "class defines a template; object is an instance."
        },
        "code": "class Dog:\n    def bark(self):\n        print(\"Vov-vov!\")\n\nmy_dog = Dog()\nmy_dog.bark()   # Vov-vov!"
      },
      {
        "h": {
          "uz": "__init__ va self",
          "en": "__init__ and self"
        },
        "p": {
          "uz": "__init__ — konstruktor, obyekt yaratilganda avtomatik ishlaydi. self — 'shu obyektning o'zi'. Har metodning birinchi parametri self.",
          "en": "__init__ runs on creation; self is the object itself."
        },
        "code": "class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\ns = Student(\"Max\", 20)\nprint(s.name)   # Max\nprint(s.age)    # 20"
      },
      {
        "h": {
          "uz": "Atributlar",
          "en": "Attributes"
        },
        "p": {
          "uz": "Atribut — obyektning ma'lumoti (self.name). obyekt.atribut orqali murojaat. Har obyektning o'z atributlari bor.",
          "en": "Attributes hold object data; each object has its own."
        },
        "code": "class Car:\n    def __init__(self, brand, speed):\n        self.brand = brand\n        self.speed = speed\n\ncar1 = Car(\"Toyota\", 180)\ncar2 = Car(\"BMW\", 220)\nprint(car1.brand)   # Toyota\nprint(car2.speed)   # 220"
      },
      {
        "h": {
          "uz": "Metodlar",
          "en": "Methods"
        },
        "p": {
          "uz": "Metod — klass ichidagi funksiya, obyektning amali. self orqali atributlardan foydalanadi. Ma'lumot va amalni birga saqlashning kuchi.",
          "en": "Methods are functions inside a class using self."
        },
        "code": "class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    def introduce(self):\n        print(f\"Men {self.name}, bahom {self.grade}\")\n    def is_passing(self):\n        return self.grade >= 60\n\ns = Student(\"Ali\", 75)\ns.introduce()\nprint(s.is_passing())   # True"
      }
    ],
    "practice": [
      {
        "uz": "Dog klassi: __init__ da name, bark() metodi.",
        "en": "Dog class."
      },
      {
        "uz": "Student klassi: name, age va introduce() metodi.",
        "en": "Student class."
      },
      {
        "uz": "Car klassi: brand, speed va accelerate() metodi.",
        "en": "Car class."
      },
      {
        "uz": "Ikki obyekt yarat, atributlari har xil ekanini ko'r.",
        "en": "Two objects."
      },
      {
        "uz": "Rectangle klassi: width, height va area() metodi.",
        "en": "Rectangle area."
      }
    ],
    "quiz": [
      {
        "q": "Klass yaratish kalit so'zi?",
        "opts": [
          "def",
          "class",
          "object",
          "new"
        ],
        "correct": 1
      },
      {
        "q": "__init__ qachon ishlaydi?",
        "opts": [
          "Hech qachon",
          "Obyekt yaratilganda",
          "Chaqirganda",
          "Oxirida"
        ],
        "correct": 1
      },
      {
        "q": "self nima?",
        "opts": [
          "Funksiya",
          "Shu obyektning o'zi",
          "Son",
          "Klass nomi"
        ],
        "correct": 1
      },
      {
        "q": "s = Student('Max') — Student nima?",
        "opts": [
          "Obyekt",
          "Klass",
          "Metod",
          "Atribut"
        ],
        "correct": 1
      },
      {
        "q": "self.name = name nima qiladi?",
        "opts": [
          "Funksiya",
          "Atribut o'rnatadi",
          "Xato",
          "Print"
        ],
        "correct": 1
      },
      {
        "q": "Metodning 1-parametri doim?",
        "opts": [
          "name",
          "self",
          "init",
          "data"
        ],
        "correct": 1
      },
      {
        "q": "car.brand — brand nima?",
        "opts": [
          "Metod",
          "Atribut",
          "Klass",
          "Funksiya"
        ],
        "correct": 1
      },
      {
        "q": "Metod nima?",
        "opts": [
          "Atribut",
          "Klass ichidagi funksiya",
          "O'zgaruvchi",
          "Son"
        ],
        "correct": 1
      },
      {
        "q": "Ikki obyektning atributlari?",
        "opts": [
          "Bir xil",
          "Har xil bo'la oladi",
          "Doim bir xil",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "Klass nomi qanday yoziladi?",
        "opts": [
          "kichik",
          "Katta harf bilan",
          "HAMMASI KATTA",
          "Farqi yo'q"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "class — obyekt shabloni (Katta harf)",
        "Obyekt — shablondan yasalgan aniq narsa",
        "__init__ — konstruktor, avtomatik ishlaydi",
        "self — shu obyektning o'zi",
        "self.name = name — atribut",
        "Atribut = ma'lumot, Metod = amal",
        "obyekt.atribut, obyekt.metod()"
      ],
      "en": [
        "class template",
        "__init__",
        "self",
        "attributes",
        "methods"
      ]
    }
  },
  {
    "day": 28,
    "type": "topic",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "title": {
      "uz": "OOP: atribut va inheritance",
      "en": "OOP: attributes & inheritance"
    },
    "intro": {
      "uz": "Kecha klass asoslarini o'rgandik. Bugun ilg'or OOP: bir nechta metod, va inheritance (meros) — klass boshqasidan atribut va metod olishi. Bu kodni takrorlamaslikning kuchli usuli. Sertifikatda inheritance va super() so'raladi.",
      "en": "Advanced OOP: multiple methods and inheritance — a class taking attributes/methods from another. Exams test super()."
    },
    "sections": [
      {
        "h": {
          "uz": "Bir nechta metodli klass",
          "en": "Class with multiple methods"
        },
        "p": {
          "uz": "Klass ichida ko'p metod bo'ladi, ular self orqali bir-birini ham chaqira oladi. Har metod obyektning bir amali. Bu obyektni to'liq 'tirik' qiladi — o'z ma'lumoti va amallari bilan.",
          "en": "A class can have many methods; they call each other via self."
        },
        "code": "class Circle:\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14 * self.r ** 2\n    def describe(self):\n        print(f\"Yuza: {self.area()}\")\n\nc = Circle(5)\nc.describe()   # metod metodni chaqirdi"
      },
      {
        "h": {
          "uz": "Inheritance — meros olish",
          "en": "Inheritance"
        },
        "p": {
          "uz": "class Bola(Ota): — Bola klass Ota klassning barcha atribut va metodlarini MEROS oladi, keyin o'ziga xos narsa qo'shadi. Bu umumiy kodni bir marta yozib, ko'p klassda ishlatish imkonini beradi.",
          "en": "class Child(Parent): inherits all of Parent's attributes and methods, then adds its own."
        },
        "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def eat(self):\n        print(f\"{self.name} ovqatlanmoqda\")\n\nclass Dog(Animal):    # meros oladi\n    def bark(self):\n        print(\"Vov!\")\n\nd = Dog(\"Rex\")\nd.eat()    # meros: Rex ovqatlanmoqda\nd.bark()   # o'ziniki: Vov!"
      },
      {
        "h": {
          "uz": "super() — ota klassni chaqirish",
          "en": "super()"
        },
        "p": {
          "uz": "Bola klassda ham __init__ kerak bo'lsa, super().__init__() bilan ota konstruktorini chaqirasan — umumiy atributlarni qayta yozmaslik uchun. Keyin o'ziga xos atribut qo'shasan. Sertifikatda super() klassik savol.",
          "en": "super().__init__() calls the parent constructor, avoiding rewriting shared attributes."
        },
        "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)  # ota init\n        self.breed = breed      # o'ziniki\n\nd = Dog(\"Rex\", \"Lab\")\nprint(d.name, d.breed)  # Rex Lab"
      },
      {
        "h": {
          "uz": "Override — metodni qayta yozish",
          "en": "Method override"
        },
        "p": {
          "uz": "Bola klass ota metodini bir xil nom bilan qayta yozishi mumkin — 'override'. Masalan har hayvon boshqacha ovoz chiqaradi: umumiy speak() ni har klass o'zicha yozadi. Bu 'polimorfizm' asosi.",
          "en": "A child can override a parent method with the same name. Basis of polymorphism."
        },
        "code": "class Animal:\n    def speak(self):\n        print(\"...\")\n\nclass Cat(Animal):\n    def speak(self):        # override\n        print(\"Miyov!\")\n\nclass Cow(Animal):\n    def speak(self):\n        print(\"Mo'o!\")\n\nfor a in [Cat(), Cow()]:\n    a.speak()   # har biri o'zicha!"
      }
    ],
    "practice": [
      {
        "uz": "Ko'p metodli klass yoz (area, perimeter, describe).",
        "en": "Class with 3 methods."
      },
      {
        "uz": "Animal'dan Dog meros oldirib, bark() qo'sh.",
        "en": "Dog inherits Animal, add bark()."
      },
      {
        "uz": "super().__init__() bilan bola klassga atribut qo'sh.",
        "en": "Add attribute with super()."
      },
      {
        "uz": "speak() ni Cat va Cow da override qil.",
        "en": "Override speak() in Cat and Cow."
      },
      {
        "uz": "Shape va undan Square, Circle meros oldir.",
        "en": "Shape → Square, Circle."
      }
    ],
    "quiz": [
      {
        "q": "Inheritance nima?",
        "opts": [
          "Nusxa",
          "Klass boshqasidan atribut/metod olishi",
          "O'chirish",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "class Dog(Animal): nima bo'ladi?",
        "opts": [
          "Xato",
          "Dog Animal'dan meros oladi",
          "Ikki klass",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "super() nima qiladi?",
        "opts": [
          "Yangi klass",
          "Ota klassni chaqiradi",
          "O'chiradi",
          "Print"
        ],
        "correct": 1
      },
      {
        "q": "Override nima?",
        "opts": [
          "Yangi atribut",
          "Meros metodni qayta yozish",
          "O'chirish",
          "Nusxa"
        ],
        "correct": 1
      },
      {
        "q": "Dog(Animal) da eat() (Animal'da) ishlaydimi?",
        "opts": [
          "Yo'q",
          "Ha, meros orqali",
          "Xato",
          "Faqat bark"
        ],
        "correct": 1
      },
      {
        "q": "super().__init__() nega?",
        "opts": [
          "Chiroy",
          "Ota atributlarini qayta yozmaslik",
          "Tez",
          "Kerak emas"
        ],
        "correct": 1
      },
      {
        "q": "Metod boshqa metodni chaqira oladimi?",
        "opts": [
          "Yo'q",
          "Ha, self.metod()",
          "Faqat init",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "Cat va Cow'da speak() har xil — bu?",
        "opts": [
          "Xato",
          "Override (polimorfizm)",
          "Meros",
          "Nusxa"
        ],
        "correct": 1
      },
      {
        "q": "Ota klass yana nima deyiladi?",
        "opts": [
          "Bola",
          "Parent/base",
          "Metod",
          "Obyekt"
        ],
        "correct": 1
      },
      {
        "q": "Meros nega foydali?",
        "opts": [
          "Tez",
          "Umumiy kodni takrorlamaslik",
          "Rang",
          "Qisqa nom"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "Klassda ko'p metod, self orqali bir-birini chaqiradi",
        "class Bola(Ota): — meros (inheritance)",
        "Bola ota atribut/metodlarini oladi",
        "super().__init__() — ota konstruktorini chaqiradi",
        "Override — meros metodni bir xil nom bilan qayta yozish",
        "Ota = parent/base, Bola = child",
        "Override + loop = polimorfizm (har biri o'zicha)",
        "Meros = umumiy kodni takrorlamaslik"
      ],
      "en": [
        "multiple methods",
        "class Child(Parent) inheritance",
        "super().__init__()",
        "override methods",
        "parent/child",
        "polymorphism"
      ]
    }
  },
  {
    "day": 29,
    "type": "review",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "reviewOf": 28,
    "title": {
      "uz": "Takrorlash: Modul va OOP",
      "en": "Review: Modules & OOP"
    },
    "intro": {
      "uz": "Kecha o'rgangan mavzuni mustahkamlaymiz: qisqa takror, yangi mashqlar va kichik loyiha.",
      "en": "Reinforce yesterday's topic: recap, new exercises and a mini-project."
    },
    "recap": {
      "uz": "Eslatma: (1) import math/random; from x import y. (2) class, __init__, self, atribut, metod. (3) inheritance: class Bola(Ota), super(), override. (4) obyekt.atribut, obyekt.metod().",
      "en": "Recap: modules; class/__init__/self; inheritance/super()/override."
    },
    "project": {
      "title": {
        "uz": "Loyiha: Bank hisobi tizimi",
        "en": "Project: Bank account system"
      },
      "desc": {
        "uz": "BankAccount klassi (owner, balance) va undan SavingsAccount meros oladi (foiz qo'shadi). deposit, withdraw metodlari, super() bilan meros. OOP + inheritance birga.",
        "en": "BankAccount + SavingsAccount with inheritance."
      },
      "starter": "class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n        print(f\"Balans: {self.balance}\")\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print(\"Mablag' yetarli emas!\")\n        else:\n            self.balance -= amount\n\nclass SavingsAccount(BankAccount):\n    def __init__(self, owner, balance=0, rate=0.05):\n        super().__init__(owner, balance)\n        self.rate = rate\n    def add_interest(self):\n        self.balance += self.balance * self.rate\n\nacc = SavingsAccount(\"Max\", 100)\nacc.deposit(50)\nacc.add_interest()\nprint(f\"Yakuniy: {acc.balance}\")"
    },
    "practice": [
      {
        "uz": "random moduli bilan parol generatori.",
        "en": "Password generator with random."
      },
      {
        "uz": "Klass yozib, ikki obyekt yarat.",
        "en": "Class with two objects."
      },
      {
        "uz": "super() bilan meros oldirib klass yoz.",
        "en": "Inheritance with super()."
      }
    ],
    "quiz": [
      {
        "q": "import math'dan sqrt?",
        "opts": [
          "sqrt()",
          "math.sqrt()",
          "import.sqrt()",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "__init__ qachon?",
        "opts": [
          "Hech qachon",
          "Obyekt yaratilganda",
          "Chaqirganda",
          "Oxirida"
        ],
        "correct": 1
      },
      {
        "q": "self nima?",
        "opts": [
          "Funksiya",
          "Shu obyektning o'zi",
          "Son",
          "Klass nomi"
        ],
        "correct": 1
      },
      {
        "q": "class Dog(Animal):?",
        "opts": [
          "Xato",
          "Meros oladi",
          "Ikki klass",
          "Yo'q"
        ],
        "correct": 1
      },
      {
        "q": "super() nima?",
        "opts": [
          "Yangi klass",
          "Ota klassni chaqiradi",
          "O'chiradi",
          "Print"
        ],
        "correct": 1
      },
      {
        "q": "random.randint(1,6)?",
        "opts": [
          "Doim 1",
          "1-6 tasodifiy",
          "6",
          "list"
        ],
        "correct": 1
      },
      {
        "q": "Override nima?",
        "opts": [
          "Yangi atribut",
          "Metodni qayta yozish",
          "O'chirish",
          "Nusxa"
        ],
        "correct": 1
      },
      {
        "q": "Metod nima?",
        "opts": [
          "Atribut",
          "Klass ichidagi funksiya",
          "O'zgaruvchi",
          "Son"
        ],
        "correct": 1
      },
      {
        "q": "from math import sqrt keyin?",
        "opts": [
          "math.sqrt()",
          "sqrt()",
          "import sqrt",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "obyekt.atribut — atribut nima?",
        "opts": [
          "Metod",
          "Obyekt ma'lumoti",
          "Klass",
          "Funksiya"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "import math → math.sqrt(); from x import y",
        "class — shablon, __init__ konstruktor, self obyekt",
        "atribut = ma'lumot (self.x), metod = amal",
        "class Bola(Ota) — meros",
        "super().__init__() — ota konstruktori",
        "override — metodni qayta yozish",
        "random: randint, choice, shuffle"
      ],
      "en": [
        "modules",
        "class/init/self",
        "attributes/methods",
        "inheritance/super/override"
      ]
    }
  },
  {
    "day": 30,
    "type": "review",
    "unit": "Hafta 4 — Ilg'or asoslar",
    "reviewOf": 29,
    "title": {
      "uz": "Bitiruv: Sertifikatga tayyorgarlik",
      "en": "Graduation: Certification prep"
    },
    "intro": {
      "uz": "Tabriklayman, Max! 30 kunda Python asoslarini to'liq o'rganding: turlar, operatorlar, boshqaruv, funksiyalar, strukturalar, string, xato, fayl, OOP. Endi sertifikat imtihoniga (PCEP va boshqalar) tayyorsan. Bu — kuchli poydevor.",
      "en": "Congratulations! You've covered all Python essentials — ready for certification."
    },
    "recap": {
      "uz": "To'liq safar: (1) Asoslar — turlar, operatorlar, kirish/chiqish. (2) Boshqaruv — shart, loop, break/continue. (3) Strukturalar — list, tuple, set, dict, nested. (4) Funksiya — def, return, *args, scope. (5) String — metodlar, formatlash, comprehension. (6) Ilg'or — xato, fayl, modul, OOP, inheritance. Sen tayyorsan!",
      "en": "Full journey: types, operators, control flow, structures, functions, strings, errors, files, OOP."
    },
    "project": {
      "title": {
        "uz": "Bitiruv loyihasi: To'liq Python dasturi",
        "en": "Capstone: Complete Python program"
      },
      "desc": {
        "uz": "Barcha bilimingni birlashtir: klass (OOP), fayl saqlash, xato himoyasi, funksiyalar, va string ishlash bilan to'liq dastur yoz — masalan talabalar boshqaruv tizimi. GitHub'ga joyla! Keyin sertifikat imtihoniga yozil (PCEP yoki freeCodeCamp).",
        "en": "Combine everything into one program (e.g. student management). Put on GitHub, then take the cert exam."
      },
      "starter": "class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    def is_passing(self):\n        return self.grade >= 60\n\ndef save_students(students):\n    with open(\"students.txt\", \"w\") as f:\n        for s in students:\n            f.write(f\"{s.name},{s.grade}\\n\")\n\nstudents = [Student(\"Ali\", 85), Student(\"Vali\", 45)]\nfor s in students:\n    status = \"o'tdi\" if s.is_passing() else \"yiqildi\"\n    print(f\"{s.name}: {s.grade} ({status})\")\n\nsave_students(students)\nprint(\"Saqlandi! GitHub'ga joylang.\")"
    },
    "practice": [
      {
        "uz": "O'z loyihangni yoz (OOP + fayl + xato birga).",
        "en": "Write your own project (OOP+file+error)."
      },
      {
        "uz": "Loyihani GitHub'ga joylab, README yoz.",
        "en": "Put project on GitHub with README."
      },
      {
        "uz": "Sertifikat imtihoniga tayyorlaning (PCEP mavzulari).",
        "en": "Prepare for the cert exam."
      }
    ],
    "quiz": [
      {
        "q": "Sertifikat uchun qaysi asos EMAS?",
        "opts": [
          "O'zgaruvchi",
          "Funksiya",
          "Loop",
          "HTML"
        ],
        "correct": 3
      },
      {
        "q": "OOP'da model shablon nima?",
        "opts": [
          "Obyekt",
          "class",
          "metod",
          "atribut"
        ],
        "correct": 1
      },
      {
        "q": "input() qanday tur?",
        "opts": [
          "int",
          "str",
          "float",
          "bool"
        ],
        "correct": 1
      },
      {
        "q": "7 // 2?",
        "opts": [
          "3.5",
          "3",
          "4",
          "1"
        ],
        "correct": 1
      },
      {
        "q": "try/except nima uchun?",
        "opts": [
          "Tez",
          "Xatoni ushlash",
          "Rang",
          "Fayl"
        ],
        "correct": 1
      },
      {
        "q": "[x for x in range(3)]?",
        "opts": [
          "[0,1,2]",
          "[1,2,3]",
          "range",
          "Xato"
        ],
        "correct": 0
      },
      {
        "q": "with open() nima qiladi?",
        "opts": [
          "Ochadi va avtomatik yopadi",
          "Faqat o'qiydi",
          "O'chiradi",
          "Xato"
        ],
        "correct": 0
      },
      {
        "q": "class Dog(Animal) — inheritance?",
        "opts": [
          "Yo'q",
          "Ha",
          "Faqat 2",
          "Xato"
        ],
        "correct": 1
      },
      {
        "q": "Loyihani qayerga joylaysan?",
        "opts": [
          "Fayl",
          "GitHub",
          "Excel",
          "Hech qayerga"
        ],
        "correct": 1
      },
      {
        "q": "Sen endi nimaga tayyorsan?",
        "opts": [
          "Hech narsa",
          "Python sertifikatiga",
          "Faqat o'yin",
          "Dam"
        ],
        "correct": 1
      }
    ],
    "konspekt": {
      "uz": [
        "30 kun: Python asoslari to'liq",
        "Turlar, operatorlar, boshqaruv oqimi",
        "List, tuple, set, dict, nested",
        "Funksiya: def/return/*args/scope",
        "String: metodlar, formatlash, comprehension",
        "Xato, fayl, modul, OOP, inheritance",
        "Keyingi: sertifikat imtihoni (PCEP/freeCodeCamp)",
        "Loyihani GitHub'ga → portfolio"
      ],
      "en": [
        "30 days of Python essentials",
        "types, operators, control flow",
        "data structures",
        "functions",
        "strings",
        "errors/files/OOP",
        "cert exam next"
      ]
    }
  }
];
