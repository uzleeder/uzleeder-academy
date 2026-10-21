/* ==========================================================================
   DEEP — qo'shimcha tushuntirishlar qatlami
   --------------------------------------------------------------------------
   Asosiy kurs (course.js) qisqa va aniq. Bu fayl unga QO'SHIMCHA beradi:

     notes[i]        — i-bo'limga tegishli izohlar. Uch xil:
                         why      "Nega shunday?"        — mexanizmni ochadi
                         analogy  "Hayotiy misol"        — tasavvurga bog'laydi
                         pitfall  "Ko'p uchraydigan xato" — oldindan ogohlantiradi
     extraSections[] — to'liq yangi bo'limlar {h, p, code}. Asosan takrorlash
                       kunlari uchun: ularda avval faqat 3-4 qatorlik "recap"
                       bor edi, endi haqiqiy dars bor.
     intro / close   — kun boshi va oxiridagi qo'shimcha fikr.

   Bu fayl ixtiyoriy: bo'lmasa ham platforma ishlaydi, shunchaki izohlar
   ko'rinmaydi. Shuning uchun yangi kunlarni bemalol qo'shib borish mumkin.
   ========================================================================== */

window.DEEP = {

  /* ===================== HAFTA 1 — ASOSLAR =========================== */

  1: {
    notes: [
      {
        analogy: { uz: "O'zgaruvchi — bu shkafdagi yorliqli quti. `name` yorlig'i yopishtirilgan qutiga \"Akbar\" solib qo'yasan. Keyin qutiga emas, YORLIQQA murojaat qilasan: `print(name)`.", en: "A variable is a labelled box in a cupboard. You stick the label `name` on a box and put \"Akbar\" inside. From then on you refer to the label, not the box: `print(name)`." },
        why: { uz: "`=` — matematik tenglik EMAS. `x = x + 1` matematikada ma'nosiz, Python'da esa mutlaqo normal: \"o'ngdagini hisobla, natijani chapdagi qutiga sol\". Shuning uchun tartib har doim: avval o'ng taraf, keyin chap.", en: "`=` is not mathematical equality. `x = x + 1` is nonsense in maths but perfectly normal in Python: \"evaluate the right side, put the result in the left box\". The order is always: right side first, then left." }
      },
      {
        why: { uz: "Nega turlar kerak? Chunki `+` har turda boshqacha ishlaydi: sonlar uchun — qo'shish, matnlar uchun — yopishtirish. Python qiymatning turiga qarab qaysi amalni bajarishni tanlaydi.", en: "Why do types matter? Because `+` behaves differently per type: addition for numbers, concatenation for text. Python picks the operation based on the value's type." },
        pitfall: { uz: "`True` va `False` — bosh harf bilan. `true` yozsang `NameError` chiqadi, chunki Python uni o'zgaruvchi nomi deb o'ylaydi.", en: "`True` and `False` are capitalised. Writing `true` gives a `NameError` because Python thinks it is a variable name." }
      },
      {
        pitfall: { uz: "Eng ko'p uchraydigan boshlang'ich xato: `input()` dan olingan \"5\" ga 2 qo'shmoqchi bo'lish. `\"5\" + 2` → `TypeError`. Yechim: `int(javob) + 2`.", en: "The most common beginner error: adding 2 to the \"5\" that came from `input()`. `\"5\" + 2` → `TypeError`. Fix: `int(answer) + 2`." },
        why: { uz: "`\"20\"` — bu yigirmata emas, ikkita belgi: '2' va '0'. Kompyuter uchun bu rasm kabi narsa. `int(\"20\")` esa rasmni sonlar dunyosiga tarjima qiladi.", en: "`\"20\"` is not twenty — it is two characters, '2' and '0'. To the computer it is more like a picture. `int(\"20\")` translates that picture into the world of numbers." }
      },
      {
        analogy: { uz: "f-string — matn ichiga \"oyna\" ochish. `f\"Salom {name}\"` da `{name}` — oynacha; Python u yerdan o'zgaruvchining qiymatini ko'rsatadi.", en: "An f-string opens \"windows\" inside text. In `f\"Hello {name}\"`, `{name}` is a window through which Python shows the variable's value." },
        pitfall: { uz: "Boshidagi `f` ni unutish — juda tez-tez bo'ladi. `\"Salom {name}\"` aynan shunday, jonli matn bo'lib chiqadi: `Salom {name}`.", en: "Forgetting the leading `f` is very common. `\"Hello {name}\"` prints literally as `Hello {name}`." }
      }
    ],
    close: { uz: "Bugungi eng muhim fikr: Python'da har qiymatning TURI bor va u nimani qila olishini belgilaydi. Shubhalansang — `type(x)` bilan tekshir. Bu odat keyingi 29 kunda ko'p xatodan qutqaradi.", en: "Today's key idea: in Python every value has a TYPE, and that type decides what it can do. When in doubt, check with `type(x)`. This habit will save you from many errors over the next 29 days." }
  },

  2: {
    notes: [
      {
        why: { uz: "`/` har doim float qaytaradi — hatto `10 / 2` ham `5.0`. Sabab: bo'lish natijasi umuman butun bo'lmasligi mumkin, shuning uchun Python bir xil, bashorat qilinadigan turni tanlagan. Butun kerak bo'lsa — `//`.", en: "`/` always returns a float — even `10 / 2` gives `5.0`. Reason: division may well not be whole, so Python picks one predictable type. Use `//` when you need a whole number." },
        analogy: { uz: "`%` (qoldiq) — 17 ta konfetni 5 bolaga bo'lganda qo'lda qolgani: `17 % 5 = 2`. Juft/toqni tekshirish ham shu: `n % 2 == 0`.", en: "`%` (remainder) is what's left in your hand after dividing 17 sweets among 5 children: `17 % 5 = 2`. Checking odd/even uses the same idea: `n % 2 == 0`." }
      },
      {
        why: { uz: "Taqqoslash natijasi — son emas, `bool`. `5 > 3` → `True`. Aynan shuning uchun uni to'g'ridan-to'g'ri `if` ichiga qo'yish mumkin: `if 5 > 3:`.", en: "A comparison produces a `bool`, not a number. `5 > 3` → `True`. That is exactly why it can go straight into an `if`: `if 5 > 3:`." },
        pitfall: { uz: "Kasr sonlarni `==` bilan solishtirish aldaydi: `0.1 + 0.2 == 0.3` → `False`. Sabab — kompyuter kasrlarni ikkilik sanoqda taqriban saqlaydi. Yechim: `abs(a - b) < 0.0001`.", en: "Comparing floats with `==` misleads: `0.1 + 0.2 == 0.3` → `False`, because the computer stores fractions approximately in binary. Fix: `abs(a - b) < 0.0001`." }
      },
      {
        why: { uz: "`and` / `or` \"dangasa\": `and` da chap taraf `False` bo'lsa, o'ng tarafni umuman hisoblamaydi. Bu tezlik uchun emas, xavfsizlik uchun ham: `if n != 0 and 10 / n > 1` — nolga bo'linish sodir bo'lmaydi.", en: "`and` / `or` are lazy: if the left side of `and` is `False`, the right side is never evaluated. That is not only about speed but safety: `if n != 0 and 10 / n > 1` never divides by zero." }
      },
      {
        pitfall: { uz: "Tartibga ishonma — qavs qo'y. `2 + 3 * 4` → 14 (18 emas). Shubhang bo'lsa `(2 + 3) * 4` deb yoz: kod uzunroq, lekin xato nolga tushadi.", en: "Don't rely on precedence — use brackets. `2 + 3 * 4` is 14, not 18. When unsure write `(2 + 3) * 4`: slightly longer, but the error rate drops to zero." }
      }
    ]
  },

  3: {
    notes: [
      {
        why: { uz: "`print(a, b)` orasiga avtomatik bo'shliq qo'yadi, chunki standart `sep=\" \"`. Uni o'zgartirish mumkin: `print(1, 2, sep=\"-\")` → `1-2`. `end=\"\"` esa yangi qatorga o'tmaslikni bildiradi.", en: "`print(a, b)` inserts a space because the default is `sep=\" \"`. You can change it: `print(1, 2, sep=\"-\")` → `1-2`. And `end=\"\"` stops it moving to a new line." }
      },
      {
        why: { uz: "`input()` DOIM string qaytaradi — hatto foydalanuvchi 25 yozsa ham. Sabab: klaviaturadan kelayotgani belgilar oqimi; Python uni son deb taxmin qilishga urinmaydi, chunki taxmin xato bo'lishi mumkin edi.", en: "`input()` ALWAYS returns a string — even if the user types 25. Reason: what arrives from the keyboard is a stream of characters; Python does not guess it is a number, because guessing could be wrong." },
        pitfall: { uz: "`int(input())` ni bitta qatorga siqish qulay, lekin foydalanuvchi \"salom\" yozsa dastur yiqiladi. 23-kunda buni `try/except` bilan tuzatamiz.", en: "Squeezing `int(input())` into one line is convenient, but the program crashes if the user types \"hello\". On day 23 we fix that with `try/except`." }
      },
      {
        pitfall: { uz: "`int(\"3.5\")` — XATO (`ValueError`), chunki `int()` faqat butun ko'rinishdagi matnni oladi. To'g'risi: `int(float(\"3.5\"))` → 3.", en: "`int(\"3.5\")` is an ERROR (`ValueError`) — `int()` only accepts text that looks whole. The right way: `int(float(\"3.5\"))` → 3." },
        why: { uz: "`int(3.9)` → 3, ya'ni yaxlitlamaydi, KESADI. Yaxlitlash kerak bo'lsa `round(3.9)` → 4.", en: "`int(3.9)` → 3: it truncates, it does not round. For rounding use `round(3.9)` → 4." }
      },
      {
        analogy: { uz: "`{narx:.2f}` — kassa cheki formati: har doim ikki xona kasr. `.2f` dagi `f` — float, `2` — xona soni.", en: "`{price:.2f}` is receipt formatting: always two decimal places. The `f` means float, the `2` is the number of digits." }
      }
    ]
  },

  4: {
    intro: { uz: "Takrorlash kuni — yangi mavzu yo'q, lekin bu \"dam olish\" degani emas. Bugun uch kunlik bilim bir tizimga tushadi: turlar, amallar, kirish/chiqish bir-biriga qanday ulanishini ko'rasan.", en: "A review day — no new topic, but this is not a rest day. Today three days of knowledge become one system: you see how types, operators and I/O connect." },
    extraSections: [
      {
        h: { uz: "To'rt tur — bir jadvalda", en: "The four types — in one table" },
        p: { uz: "Har turni yonma-yon ko'rish eng tez eslab qolish usuli. Diqqat qil: `type()` har doim `<class '...'>` ko'rinishida qaytaradi. Va `bool` aslida `int` ning bir turi — `True` 1 ga, `False` 0 ga teng.", en: "Seeing the types side by side is the fastest way to remember them. Note that `type()` always returns something like `<class '...'>`. And `bool` is really a kind of `int` — `True` equals 1, `False` equals 0." },
        code: "butun   = 20          # int   — butun son\nkasr    = 19.99       # float — kasr son\nmatn    = \"Akbar\"     # str   — matn\nbelgi   = True        # bool  — True / False\n\nfor qiymat in [butun, kasr, matn, belgi]:\n    print(qiymat, \"->\", type(qiymat))\n\n# Kutilmagan, lekin haqiqat:\nprint(True + True)    # 2  — bool aslida int\nprint(int(False))     # 0",
        notes: {
          pitfall: { uz: "`bool` ni sonday ishlatish mumkin, lekin buni kodda ataylab qilma — o'qiydigan odam adashadi.", en: "You can use a `bool` as a number, but don't do it deliberately in real code — it confuses the reader." }
        }
      },
      {
        h: { uz: "Uch xil bo'lish: /, // va %", en: "Three kinds of division: /, // and %" },
        p: { uz: "Uchalasi bir sonni ikkinchisiga bo'ladi, lekin uch xil savolga javob beradi. `/` — \"necha marta, kasr bilan?\", `//` — \"necha marta, to'liq?\", `%` — \"qancha ortdi?\". Sertifikat imtihonlarida bu uchlik doim uchraydi.", en: "All three divide, but answer three different questions. `/` — \"how many times, with fractions?\", `//` — \"how many whole times?\", `%` — \"how much is left over?\". This trio always appears in certification exams." },
        code: "print(17 / 5)    # 3.4  — aniq javob (har doim float)\nprint(17 // 5)   # 3    — butun qismi\nprint(17 % 5)    # 2    — qoldiq\n\n# Amalda: 17 daqiqani soat va daqiqaga bo'lish\njami = 137\nsoat = jami // 60      # 2\ndaqiqa = jami % 60     # 17\nprint(f\"{soat} soat {daqiqa} daqiqa\")\n\n# Juft/toq tekshirish — eng ko'p ishlatiladigan naqsh\nson = 8\nprint(\"juft\" if son % 2 == 0 else \"toq\")"
      },
      {
        h: { uz: "Kirishdan hisobgacha — to'liq zanjir", en: "From input to calculation — the full chain" },
        p: { uz: "Har qanday interaktiv dastur shu uch qadamdan iborat: matn olish → songa aylantirish → hisoblash va chiroyli chiqarish. Bu zanjirni yod olsang, kalkulyator, konvertor va o'yin — hammasi shu qolipga tushadi.", en: "Every interactive program is these three steps: take text → convert to a number → compute and print nicely. Learn this chain and calculators, converters and games all fit the same mould." },
        code: "# 1) matn olish (input DOIM str)\nmatn = input(\"Yoshingiz: \")     # \"20\"\n\n# 2) songa aylantirish\nyosh = int(matn)                # 20\n\n# 3) hisoblash va formatlash\nyil = 2026 - yosh\nprint(f\"Siz taxminan {yil}-yilda tug'ilgansiz.\")\n\n# Bir qatorda ham bo'ladi (lekin xatoga ochiq):\nbo_y = float(input(\"Bo'y (m): \"))\nvazn = float(input(\"Vazn (kg): \"))\nprint(f\"VMI: {vazn / bo_y ** 2:.1f}\")"
      },
      {
        h: { uz: "Xato ovlash mashqi: bu kodda nima noto'g'ri?", en: "Bug hunt: what is wrong with this code?" },
        p: { uz: "Xatoni o'zing topish — o'qishning eng samarali usuli. Quyidagi kodda uchta xato bor. Avval o'zing qara, keyin tuzatilgan variantni ko'r. Har xato boshlang'ich dasturchilarda eng ko'p uchraydiganlaridan.", en: "Finding the bug yourself is the most effective way to learn. There are three errors below. Look first, then read the fixed version. Each is among the most common beginner mistakes." },
        code: "# ✗ XATO variant\n# narx = input(\"Narx: \")\n# soni = input(\"Soni: \")\n# jami = narx * soni          # str * str -> TypeError\n# print(\"Jami: \" + jami)      # str + int -> TypeError\n# print(\"Chegirma: {jami*0.9}\")  # f yo'q -> jonli matn\n\n# ✓ TO'G'RI variant\nnarx = float(input(\"Narx: \"))      # songa aylantirdik\nsoni = int(input(\"Soni: \"))\njami = narx * soni\nprint(f\"Jami: {jami:.2f}\")          # f-string ishlatdik\nprint(f\"Chegirma: {jami * 0.9:.2f}\")",
        notes: {
          why: { uz: "Uchala xato ham bitta sababdan: TUR. Python xatolarining katta qismi \"kutilgan tur boshqa edi\" degani. Xato matnida `TypeError` yoki `ValueError` ko'rsang — birinchi savol: bu yerda qaysi tur bor va qaysi tur kerak edi?", en: "All three come from one cause: TYPE. Most Python errors mean \"a different type was expected\". When you see `TypeError` or `ValueError`, ask first: what type is here, and what type was needed?" }
        }
      }
    ]
  },

  /* ============ HAFTA 2 — BOSHQARUV VA STRUKTURALAR ================== */

  5: {
    notes: [
      {
        why: { uz: "Python blokni qavs bilan emas, BO'SHLIQ bilan ajratadi. `if` dan keyingi ichkariga surilgan qatorlar — shart bajarilganda ishlaydigan kod. Surilish tugagan joyda blok ham tugaydi.", en: "Python marks a block with INDENTATION, not braces. The lines indented under `if` are the code that runs when the condition holds. Where the indentation stops, the block ends." },
        pitfall: { uz: "`if` dan keyin `:` qo'yishni unutish — birinchi haftaning eng ko'p xatosi (`SyntaxError`). Ikkinchisi: bir joyda tab, boshqa joyda probel ishlatish (`IndentationError`). Bir usulni tanla — 4 ta probel.", en: "Forgetting the `:` after `if` is week one's most common error (`SyntaxError`). Second most common: mixing tabs and spaces (`IndentationError`). Pick one — four spaces." }
      },
      {
        pitfall: { uz: "`if x = 5:` — sintaksis xatosi. `=` qiymat SOLADI, `==` TEKSHIRADI. Python bu xatoni ataylab taqiqlagan, chunki boshqa tillarda u jimgina buzuq kodga olib keladi.", en: "`if x = 5:` is a syntax error. `=` assigns, `==` compares. Python forbids this deliberately, because in other languages it silently produces broken code." }
      },
      {
        why: { uz: "`elif` zanjirida FAQAT BIRINCHI mos keladigan shart ishlaydi, qolganlari umuman tekshirilmaydi. Shuning uchun tartib muhim: eng tor shartni yuqoriga qo'y, eng kengini pastga.", en: "In an `elif` chain only the FIRST matching branch runs; the rest are not even checked. So order matters: put the narrowest condition on top, the widest at the bottom." },
        pitfall: { uz: "Ketma-ket `if` lar bilan `elif` — boshqa narsa. Uchta alohida `if` uchalasi ham ishlashi mumkin; `elif` esa faqat bittasini tanlaydi.", en: "A series of separate `if`s is not the same as `elif`. Three separate `if`s can all run; an `elif` chain picks exactly one." }
      },
      {
        analogy: { uz: "`and` — \"ikkalasi ham\" (pasport VA chipta), `or` — \"kamida bittasi\" (naqd YOKI karta), `not` — teskarisi. Shartni gap qilib o'qi: \"agar yosh 18 dan katta VA hujjat bor bo'lsa\".", en: "`and` means \"both\" (passport AND ticket), `or` means \"at least one\" (cash OR card), `not` flips it. Read the condition as a sentence: \"if age is over 18 AND they have ID\"." }
      }
    ]
  },

  6: {
    notes: [
      {
        why: { uz: "Index 0 dan boshlanadi, chunki index aslida \"boshidan qancha qadam\" degani. Birinchi element boshining o'zida — 0 qadam. Shuning uchun oxirgi elementning indeksi `len(lst) - 1`.", en: "Indexing starts at 0 because an index is really \"how many steps from the start\". The first element is at the start itself — zero steps. That is why the last index is `len(lst) - 1`." },
        pitfall: { uz: "`IndexError: list index out of range` — 5 elementli listda `lst[5]` so'raganingda chiqadi. Oxirgisi `lst[4]` yoki oddiyroq: `lst[-1]`.", en: "`IndexError: list index out of range` appears when you ask for `lst[5]` in a five-element list. The last one is `lst[4]`, or more simply `lst[-1]`." }
      },
      {
        why: { uz: "Slicingda `stop` KIRMAYDI: `[1:3]` — 1 va 2 indekslar. Sabab shu qulaylikda: `len(lst[a:b]) == b - a`, ya'ni uzunlikni bosh­da hisoblash oson. Va `lst[:3] + lst[3:]` har doim to'liq listni beradi.", en: "In slicing the `stop` is EXCLUDED: `[1:3]` gives indexes 1 and 2. The convenience is that `len(lst[a:b]) == b - a`, so the length is easy to compute, and `lst[:3] + lst[3:]` always reconstructs the whole list." }
      },
      {
        pitfall: { uz: "`lst.sort()` listni JOYIDA saralaydi va `None` qaytaradi. `saralangan = lst.sort()` yozsang — `None` olasan. Yangi list kerak bo'lsa: `sorted(lst)`.", en: "`lst.sort()` sorts in place and returns `None`. Writing `result = lst.sort()` gives you `None`. If you need a new list, use `sorted(lst)`." },
        why: { uz: "Umumiy qoida: listni O'ZGARTIRADIGAN metodlar (`append`, `sort`, `reverse`) `None` qaytaradi; YANGI qiymat beradiganlar (`sorted`, `len`, `sum`) natija qaytaradi. Shu farqni bilsang, yarim xato yo'qoladi.", en: "General rule: methods that MUTATE the list (`append`, `sort`, `reverse`) return `None`; those that PRODUCE a new value (`sorted`, `len`, `sum`) return a result. Knowing this removes half your bugs." }
      },
      {
        analogy: { uz: "`sum(lst) / len(lst)` — o'rtachaning ta'rifi: hammasini qo'sh, nechtaga bo'l. Bo'sh listda `len` 0 bo'ladi va `ZeroDivisionError` chiqadi — shuning uchun avval `if lst:` deb tekshirish odat qil.", en: "`sum(lst) / len(lst)` is the definition of an average: add everything, divide by the count. On an empty list `len` is 0 and you get `ZeroDivisionError` — so make `if lst:` a habit." }
      }
    ]
  },

  7: {
    intro: { uz: "Shartlar va listlar — Python'dagi eng ko'p ishlatiladigan ikkilik. Bugun ularni alohida emas, BIRGA ishlatishni mashq qilamiz: ro'yxatni filtrlash, tekshirish, saralash.", en: "Conditions and lists are the most-used pair in Python. Today we practise using them TOGETHER, not separately: filtering, checking and sorting a list." },
    extraSections: [
      {
        h: { uz: "Qaror daraxti: to'liq misol", en: "A decision tree: full example" },
        p: { uz: "`if / elif / else` ni bir masalada ko'rish — quruq ta'rifdan foydaliroq. Diqqat qil: shartlar YUQORIDAN pastga tekshiriladi va birinchi to'g'risi ishlaganda qolganlari tashlab ketiladi. Shuning uchun `>= 90` ni `>= 60` dan yuqoriga qo'yish shart.", en: "Seeing `if / elif / else` on a real task beats a dry definition. Note that conditions are checked TOP to bottom and the rest are skipped once one matches. That is why `>= 90` must come above `>= 60`." },
        code: "ball = 78\n\nif ball >= 90:\n    baho = \"A'lo\"\nelif ball >= 75:\n    baho = \"Yaxshi\"\nelif ball >= 60:\n    baho = \"Qoniqarli\"\nelse:\n    baho = \"Qayta topshirish\"\n\nprint(f\"{ball} ball -> {baho}\")   # 78 ball -> Yaxshi\n\n# ✗ Noto'g'ri tartib — hamma narsa \"Qoniqarli\" bo'lib qoladi:\n# if ball >= 60: ...\n# elif ball >= 90: ...   # bu yerga hech qachon yetib kelmaydi"
      },
      {
        h: { uz: "Index va slicing — bitta rasmda", en: "Indexing and slicing — in one picture" },
        p: { uz: "Slicingni tushunishning eng oson yo'li: indekslar elementlarning o'zida emas, ULAR ORASIDA turadi deb tasavvur qil. Shunda `[1:3]` — 1-chegaradan 3-chegaragacha bo'lgan bo'lak, ya'ni ikkita element.", en: "The easiest way to understand slicing: imagine the indexes sit BETWEEN the elements, not on them. Then `[1:3]` is the piece from boundary 1 to boundary 3 — two elements." },
        code: "harflar = ['a', 'b', 'c', 'd', 'e']\n#  chegara: 0    1    2    3    4    5\n#  index:     0    1    2    3    4\n#  manfiy:   -5   -4   -3   -2   -1\n\nprint(harflar[1:3])    # ['b', 'c']   — 3 kirmaydi\nprint(harflar[:2])     # ['a', 'b']   — boshidan\nprint(harflar[3:])     # ['d', 'e']   — oxirigacha\nprint(harflar[-2:])    # ['d', 'e']   — oxirgi ikkitasi\nprint(harflar[::2])    # ['a','c','e'] — bittadan tashlab\nprint(harflar[::-1])   # ['e','d','c','b','a'] — teskari\n\n# Slicing hech qachon IndexError bermaydi:\nprint(harflar[2:100])  # ['c', 'd', 'e'] — xato emas!",
        notes: {
          why: { uz: "Slicing chegaradan chiqsa xato bermaydi, oddiy indexing esa beradi. Sabab: bo'lak so'raganda \"bor bo'lganini ber\" mantiqi ishlaydi, bitta element so'raganda esa aniq shu element kerak.", en: "Slicing never raises an out-of-range error, but plain indexing does. Reason: asking for a slice means \"give me whatever exists\", while asking for one element means you need exactly that element." }
        }
      },
      {
        h: { uz: "Shart + list: filtrlash naqshi", en: "Condition + list: the filtering pattern" },
        p: { uz: "Bu naqsh butun dasturlashda takrorlanadi: bo'sh natija yaratasan, ro'yxat bo'ylab yurасan, shartga mos kelganini qo'shasan. 21-kunda buni bir qatorga siqishni (comprehension) o'rganamiz, lekin avval uzun shaklini mustahkamla.", en: "This pattern repeats across all of programming: create an empty result, walk the list, append what matches. On day 21 we compress it into one line (a comprehension), but first make the long form solid." },
        code: "ballar = [45, 88, 72, 91, 59, 100]\n\no_tganlar = []\nfor b in ballar:\n    if b >= 60:\n        o_tganlar.append(b)\n\nprint(o_tganlar)              # [88, 72, 91, 100]\nprint(len(o_tganlar), \"ta o'tdi\")\nprint(f\"O'rtacha: {sum(ballar) / len(ballar):.1f}\")\n\n# Tez tekshiruvlar:\nprint(max(ballar), min(ballar))\nprint(100 in ballar)          # True\nprint(sorted(ballar, reverse=True)[:3])   # eng yuqori 3 ta"
      },
      {
        h: { uz: "O'zgartiradigan va qaytaradigan metodlar", en: "Methods that mutate vs methods that return" },
        p: { uz: "Bu farqni bir marta tushunib olsang, list bilan bog'liq xatolarning yarmi yo'qoladi. Qoida sodda: metod listning o'zini o'zgartirsa — `None` qaytaradi; yangi qiymat yasasa — o'sha qiymatni qaytaradi.", en: "Understand this distinction once and half of your list bugs disappear. The rule is simple: if a method changes the list itself, it returns `None`; if it builds a new value, it returns that value." },
        code: "lst = [3, 1, 2]\n\n# --- O'ZGARTIRADI, None qaytaradi ---\nnatija = lst.sort()\nprint(lst, natija)        # [1, 2, 3] None\nlst.append(4)             # lst = [1,2,3,4]\nlst.reverse()             # lst = [4,3,2,1]\n\n# --- YANGI qiymat qaytaradi, aslini tegmaydi ---\nasl = [3, 1, 2]\nyangi = sorted(asl)\nprint(asl, yangi)         # [3, 1, 2] [1, 2, 3]\nprint(len(asl), sum(asl)) # 3 6\n\n# Nusxa olish (aks holda ikkalasi bitta listga ishora qiladi!)\nnusxa = asl[:]            # yoki asl.copy()\nnusxa.append(99)\nprint(asl)                # [3, 1, 2] — o'zgarmadi",
        notes: {
          pitfall: { uz: "`b = a` list uchun NUSXA olmaydi — ikkala nom bitta listga ishora qiladi va biridagi o'zgarish ikkinchisida ko'rinadi. Nusxa uchun `a[:]` yoki `a.copy()` ishlat.", en: "For lists, `b = a` does not copy — both names point at the same list, so a change through one shows up in the other. Use `a[:]` or `a.copy()` for a real copy." }
        }
      }
    ]
  },

  8: {
    notes: [
      {
        analogy: { uz: "`for` — \"har biriga bir marta\" degani. `for kitob in javon:` — javondagi har kitobni qo'lga olib, biror ish qilib, joyiga qo'yasan. Ro'yxat tugaganda loop ham tugaydi.", en: "`for` means \"once for each\". `for book in shelf:` — you pick up each book, do something, put it back. When the shelf is done, the loop is done." },
        why: { uz: "`for x in lst` da `x` — bu nusxa emas, elementning o'zi. Lekin `x = 5` deb yozsang, listdagi element o'zgarmaydi — faqat nom boshqa qiymatga ko'chadi. Listni o'zgartirish uchun index kerak: `lst[i] = 5`.", en: "In `for x in lst`, `x` is the element itself, not a copy. But assigning `x = 5` does not change the list — it only rebinds the name. To change the list you need the index: `lst[i] = 5`." }
      },
      {
        why: { uz: "`range(5)` 0,1,2,3,4 beradi — oxiri kirmaydi. Bu slicing bilan bir xil qoida va bir xil sababdan: `range(len(lst))` aynan listning barcha indekslarini beradi.", en: "`range(5)` yields 0,1,2,3,4 — the end is excluded. Same rule and same reason as slicing: `range(len(lst))` gives exactly the list's valid indexes." },
        pitfall: { uz: "`range(1, 5)` — 1,2,3,4 (5 yo'q). 1 dan 5 GACHA kerak bo'lsa `range(1, 6)` yoz.", en: "`range(1, 5)` gives 1,2,3,4 (no 5). If you need 1 through 5, write `range(1, 6)`." }
      },
      {
        analogy: { uz: "`total += n` — savatga narsa solish. Loop boshlanishidan OLDIN savat bo'sh bo'lishi kerak (`total = 0`), aks holda oldingi hisob qo'shilib ketadi.", en: "`total += n` is putting things in a basket. The basket must be empty BEFORE the loop (`total = 0`), otherwise the previous count carries over." }
      },
      {
        why: { uz: "`break` loopdan butunlay chiqadi, `continue` esa faqat joriy aylanishni tashlab, keyingisiga o'tadi. Ikkalasi ham qolgan kodni \"o'tkazib yuboradi\", lekin `break` boshqa qaytmaydi.", en: "`break` leaves the loop entirely; `continue` only skips the current pass and moves to the next. Both skip the rest of the body, but `break` never comes back." }
      }
    ]
  },

  9: {
    notes: [
      {
        pitfall: { uz: "Cheksiz loop — `while` ning eng katta xavfi. Agar loop ichida shartga ta'sir qiladigan narsa o'zgarmasa, dastur abadiy ishlaydi. Har `while` yozganda darhol o'zingdan so'ra: \"bu shart QACHON `False` bo'ladi?\"", en: "An infinite loop is `while`'s biggest hazard. If nothing inside the loop affects the condition, the program runs forever. Every time you write `while`, ask immediately: \"when does this condition become `False`?\"" },
        why: { uz: "`for` — necha marta ekani OLDINDAN ma'lum bo'lganda. `while` — noma'lum bo'lganda (\"to'g'ri parol kiritilguncha\"). Shubhalansang: sanash — `for`, kutish — `while`.", en: "Use `for` when the number of repetitions is known in advance; `while` when it is not (\"until the correct password is typed\"). Rule of thumb: counting → `for`, waiting → `while`." }
      },
      {
        analogy: { uz: "`break` — chiqish eshigi. `while True:` (abadiy loop) + ichida `break` — bu \"shart tekshirilishi o'rtada bo'lgan\" loop. Foydalanuvchidan ma'lumot olishda eng qulay naqsh.", en: "`break` is the exit door. `while True:` with a `break` inside is a loop whose test sits in the middle — the handiest pattern for reading user input." }
      },
      {
        pitfall: { uz: "`continue` ni `while` ichida ehtiyot bo'lib ishlat: hisoblagichni oshirishdan OLDIN `continue` qilsang, cheksiz loopga tushasan.", en: "Be careful with `continue` inside a `while`: if you `continue` before incrementing the counter, you fall into an infinite loop." }
      },
      {
        why: { uz: "`while ... else` — kam ishlatiladi, lekin sertifikatda uchraydi: `else` bloki loop NORMAL tugaganda (ya'ni `break` bo'lmaganda) ishlaydi. \"Qidirdim, topmadim\" holatini yozishga qulay.", en: "`while ... else` is rare but appears in certification exams: the `else` runs when the loop finishes NORMALLY (no `break`). It is handy for \"I searched and found nothing\"." }
      }
    ]
  },

  10: {
    intro: { uz: "Loop — dasturlashning yuragi. Bugun `for` va `while` ni yonma-yon qo'yamiz va \"qachon qaysi biri\" degan savolga aniq javob beramiz.", en: "Loops are the heart of programming. Today we put `for` and `while` side by side and answer clearly: which one, when?" },
    extraSections: [
      {
        h: { uz: "for yoki while — qanday tanlash", en: "for or while — how to choose" },
        p: { uz: "Qoida bitta savolga tayanadi: \"necha marta takrorlanishini oldindan bilamanmi?\" Bilsam — `for`. Bilmasam va biror shart bajarilishini kutayotgan bo'lsam — `while`. Ikkalasi ham bir masalani yechishi mumkin, lekin biri o'qishga osonroq bo'ladi.", en: "The rule rests on one question: do I know in advance how many repetitions there are? If yes — `for`. If not, and I am waiting for some condition — `while`. Both can solve the same task, but one will read better." },
        code: "# Soni MA'LUM -> for\nfor i in range(3):\n    print(\"Salom\", i)\n\nnarxlar = [10, 25, 7]\njami = 0\nfor n in narxlar:\n    jami += n\n\n# Soni NOMA'LUM -> while\nparol = \"\"\nwhile parol != \"python\":\n    parol = input(\"Parol: \")\nprint(\"Kirdingiz!\")\n\n# Bir xil natija, ikki uslub:\n# for i in range(1, 6): print(i)\ni = 1\nwhile i <= 5:\n    print(i)\n    i += 1          # BU QATOR bo'lmasa — cheksiz loop"
      },
      {
        h: { uz: "range() ning uchta shakli", en: "The three forms of range()" },
        p: { uz: "`range` bitta, ikkita yoki uchta argument oladi va har biri boshqa savolga javob beradi. Uchinchi argument — QADAM — manfiy ham bo'lishi mumkin, ya'ni teskari sanash.", en: "`range` takes one, two or three arguments, each answering a different question. The third — the STEP — may be negative, which counts backwards." },
        code: "print(list(range(5)))         # [0,1,2,3,4]      — 0 dan, 5 kirmaydi\nprint(list(range(2, 6)))      # [2,3,4,5]        — 2 dan 6 gacha\nprint(list(range(0, 10, 2)))  # [0,2,4,6,8]      — ikkitadan\nprint(list(range(10, 0, -2))) # [10,8,6,4,2]     — teskari\n\n# Indeks kerak bo'lganda:\nmevalar = [\"olma\", \"anor\", \"uzum\"]\nfor i in range(len(mevalar)):\n    print(i, mevalar[i])\n\n# Lekin ko'pincha enumerate chiroyliroq:\nfor i, meva in enumerate(mevalar):\n    print(i, meva)",
        notes: {
          why: { uz: "`range` ro'yxat emas — u sonlarni birma-bir \"tug'adi\". Shuning uchun `print(range(5))` `range(0, 5)` deb chiqadi. Ko'rish uchun `list()` ga o'rash kerak. Bu xotirani tejash uchun shunday: `range(1000000)` bir dona son joyini egallaydi.", en: "`range` is not a list — it produces numbers one at a time. That is why `print(range(5))` shows `range(0, 5)`; wrap it in `list()` to see the values. This saves memory: `range(1000000)` occupies about as much space as a single number." }
        }
      },
      {
        h: { uz: "Yig'ish naqshi (accumulator)", en: "The accumulator pattern" },
        p: { uz: "Uchta qadam: (1) loopdan OLDIN bo'sh natija tayyorla, (2) loop ichida to'ldir, (3) loopdan KEYIN ishlat. Yig'indi, sanoq, eng kattasi, ro'yxat yasash — hammasi shu naqsh.", en: "Three steps: (1) prepare an empty result BEFORE the loop, (2) fill it inside, (3) use it AFTER. Sums, counts, maximums, building lists — all follow this pattern." },
        code: "sonlar = [12, 7, 25, 3, 18]\n\njami = 0            # 1) tayyorlash\nsoni = 0\neng_katta = sonlar[0]\njuftlar = []\n\nfor n in sonlar:    # 2) to'ldirish\n    jami += n\n    soni += 1\n    if n > eng_katta:\n        eng_katta = n\n    if n % 2 == 0:\n        juftlar.append(n)\n\nprint(jami, soni)                    # 65 5\nprint(f\"O'rtacha: {jami / soni:.1f}\")  # 13.0\nprint(eng_katta, juftlar)            # 25 [12, 18]",
        notes: {
          pitfall: { uz: "`jami = 0` ni loop ICHIGA qo'yish — juda tez-tez uchraydigan xato. U holda har aylanishda nol tiklanadi va natija noto'g'ri chiqadi.", en: "Putting `total = 0` INSIDE the loop is a very common mistake: it resets on every pass and the result comes out wrong." }
        }
      },
      {
        h: { uz: "Cheksiz loop: sabab va davo", en: "Infinite loops: cause and cure" },
        p: { uz: "Dastur javob bermay qolsa — deyarli har doim sabab bitta: `while` sharti hech qachon `False` bo'lmayapti. Uch xil tipik sabab bor va uchalasining ham davosi oddiy.", en: "If the program stops responding, the cause is almost always the same: a `while` condition that never becomes `False`. There are three typical causes, and all three have simple cures." },
        code: "# ✗ 1) hisoblagich oshmayapti\n# i = 0\n# while i < 5:\n#     print(i)          # i o'zgarmaydi -> abadiy\n\n# ✗ 2) continue oshirishdan oldin\n# i = 0\n# while i < 5:\n#     if i == 2:\n#         continue      # i hech qachon 3 bo'lmaydi\n#     i += 1\n\n# ✗ 3) shart noto'g'ri yo'nalishda\n# i = 10\n# while i > 0:\n#     i += 1            # kattalashib ketadi\n\n# ✓ To'g'ri shakl — har doim shu uchlik:\ni = 0                   # boshlang'ich qiymat\nwhile i < 5:            # to'xtash sharti\n    print(i)\n    i += 1              # shartga ta'sir qiladigan o'zgarish\n\n# Dastur qotib qolsa: terminalda Ctrl + C"
      }
    ]
  },

  11: {
    notes: [
      {
        why: { uz: "Tuple o'zgarmas bo'lgani uchun tezroq va xavfsizroq. \"Bu ma'lumot o'zgarmasligi kerak\" degan niyatni kodda IFODALAYDI — koordinata, RGB rang, sana kabi narsalar uchun ideal.", en: "A tuple is immutable, which makes it faster and safer. It EXPRESSES the intent \"this must not change\" — ideal for coordinates, RGB colours, dates." },
        pitfall: { uz: "Tuple elementini o'zgartirmoqchi bo'lsang `TypeError` chiqadi. Lekin butun tuple'ni yangisi bilan almashtirsang bo'ladi: `t = (1, 2)` keyin `t = (3, 4)` — bu o'zgartirish emas, qayta bog'lash.", en: "Changing a tuple element raises `TypeError`. But you may rebind the whole name: `t = (1, 2)` then `t = (3, 4)` — that is rebinding, not mutation." }
      },
      {
        pitfall: { uz: "`(5)` — bu tuple emas, oddiy son (qavs faqat guruhlash uchun). Bir elementli tuple uchun vergul SHART: `(5,)`.", en: "`(5)` is not a tuple, it is just a number — the brackets only group. A one-element tuple needs the comma: `(5,)`." },
        analogy: { uz: "Unpacking — quti ichidagi narsalarni bir vaqtda javonga terish: `x, y = (10, 20)`. Chap va o'ng tarafdagi sonlar mos kelishi shart, aks holda `ValueError`.", en: "Unpacking is laying out a box's contents onto shelves at once: `x, y = (10, 20)`. The counts on both sides must match, otherwise `ValueError`." }
      },
      {
        why: { uz: "Set takrorlarni avtomatik yo'q qiladi, chunki u ichida \"hash-jadval\" ishlatadi: har qiymat o'z manziliga tushadi va ikkinchi marta kelgani o'sha manzilni bosib o'tadi. Shu sabab tekshirish (`x in s`) juda tez.", en: "A set removes duplicates automatically because it uses a hash table underneath: each value lands at its own address, and a repeat simply overwrites it. That is also why membership tests (`x in s`) are very fast." },
        pitfall: { uz: "Bo'sh set `{}` emas — bu bo'sh dictionary! Bo'sh set uchun `set()` yoz.", en: "An empty set is not `{}` — that is an empty dictionary. Use `set()` for an empty set." }
      },
      {
        analogy: { uz: "Set amallari — Venn diagrammasi: `|` ikkala doira, `&` kesishgan joy, `-` faqat birinchi doirada qolgani. Ikki ro'yxatni solishtirishda bebaho.", en: "Set operations are a Venn diagram: `|` both circles, `&` the overlap, `-` what is only in the first. Invaluable for comparing two lists." }
      }
    ]
  },

  12: {
    notes: [
      {
        analogy: { uz: "Dictionary — lug'at: so'z (key) → ma'no (value). Listda \"nechanchi\" deb so'raysan, dictionaryда \"qaysi nom bilan\" deb so'raysan. Shuning uchun ismlar, sozlamalar, JSON — hammasi dict.", en: "A dictionary is a real dictionary: word (key) → meaning (value). With a list you ask \"which position?\", with a dict you ask \"under which name?\". That is why names, settings and JSON are all dicts." },
        why: { uz: "Key o'zgarmas turdan bo'lishi shart (str, int, tuple) — list key bo'la olmaydi. Sabab: dict kalitni \"hash\" qiladi, o'zgaruvchan narsani esa hash qilib bo'lmaydi (bugun bir joyda, ertaga boshqa joyda bo'lib qolardi).", en: "Keys must be immutable (str, int, tuple) — a list cannot be a key. Reason: a dict hashes the key, and you cannot hash something mutable (it would sit in one place today and another tomorrow)." }
      },
      {
        why: { uz: "`d[\"yangi\"] = 5` — kalit bo'lmasa qo'shadi, bo'lsa almashtiradi. Bitta amal ikki ish qiladi, shuning uchun \"qo'shish\" va \"yangilash\" uchun alohida metod yo'q.", en: "`d[\"new\"] = 5` adds the key if missing and replaces it if present. One operation does both jobs, which is why there is no separate \"add\" and \"update\" method." }
      },
      {
        pitfall: { uz: "`d[\"yo'q\"]` — `KeyError` bilan yiqiladi. `d.get(\"yo'q\")` esa `None` qaytaradi, `d.get(\"yo'q\", 0)` esa 0. Foydalanuvchi ma'lumoti bilan ishlaganda DOIM `get()` ishlat.", en: "`d[\"missing\"]` crashes with `KeyError`. `d.get(\"missing\")` returns `None`, and `d.get(\"missing\", 0)` returns 0. Always prefer `get()` when working with user data." }
      },
      {
        why: { uz: "`for k in d` kalitlar bo'ylab yuradi (qiymatlar emas). Ikkalasi kerak bo'lsa `for k, v in d.items()`. Bu Python'da eng ko'p ishlatiladigan loop shakllaridan biri.", en: "`for k in d` iterates over keys, not values. When you need both, use `for k, v in d.items()`. It is one of the most-used loop forms in Python." }
      }
    ]
  },

  13: {
    notes: [
      {
        analogy: { uz: "Matritsa — shaxmat taxtasi. `matrix[1][2]` — \"1-qator, 2-ustun\". Tartib har doim shunday: avval qaysi qatorni olamiz, keyin o'sha qatorning qaysi elementini.", en: "A matrix is a chessboard. `matrix[1][2]` means \"row 1, column 2\". The order is always: pick the row first, then the element within that row." }
      },
      {
        why: { uz: "List ichida dictionary — bu aslida JSON va ma'lumotlar bazasi jadvallarining shakli. Har dict — bitta yozuv (qator), har key — ustun nomi. Kelajakda API'dan keladigan ma'lumot ANIQ shu ko'rinishda bo'ladi.", en: "A list of dictionaries is the shape of JSON and of database tables. Each dict is one record (row), each key a column name. Data coming from an API will look EXACTLY like this." }
      },
      {
        pitfall: { uz: "Chuqur strukturada `KeyError` yoki `IndexError` topish qiyin. Yechim: bosqichma-bosqich tekshir — avval `print(data[0])`, keyin `print(data[0][\"tel\"])`. Bir yo'la yozib, keyin xatoni qidirishdan ko'ra tezroq.", en: "Finding a `KeyError` or `IndexError` deep in a structure is hard. Fix: check step by step — first `print(data[0])`, then `print(data[0][\"phone\"])`. Faster than writing it all at once and hunting the error afterwards." }
      },
      {
        why: { uz: "Nested loopda ichki loop tashqi loopning HAR aylanishida to'liq ishlaydi. 3 qator × 4 ustun = 12 marta. Shuning uchun katta ma'lumotda nested loop sekin ishlaydi — bu \"algoritm murakkabligi\" mavzusining birinchi qadami.", en: "In a nested loop, the inner loop runs fully on EVERY pass of the outer one. 3 rows × 4 columns = 12 iterations. That is why nested loops get slow on big data — your first step into algorithmic complexity." }
      }
    ]
  },

  14: {
    intro: { uz: "To'rt struktura — list, tuple, set, dict. Ular bir-biriga o'xshaydi, lekin har biri boshqa savolga javob beradi. Bugun \"qaysi holatda qaysi birini olish kerak\" degan savolni yopamiz.", en: "Four structures — list, tuple, set, dict. They look similar but answer different questions. Today we settle which one to reach for, when." },
    extraSections: [
      {
        h: { uz: "To'rt struktura yonma-yon", en: "The four structures side by side" },
        p: { uz: "Farqni yodlash emas, KO'RISH kerak. Uch xususiyatga qara: tartibi bormi, o'zgaradimi, takror bo'ladimi. Shu uch savolga javob har birini boshqasidan ajratadi.", en: "Don't memorise the differences — SEE them. Look at three properties: is it ordered, is it mutable, does it allow duplicates? Those three answers separate them all." },
        code: "lst = [1, 2, 2, 3]        # list  — tartibli, o'zgaruvchan, takror bor\ntpl = (1, 2, 2, 3)        # tuple — tartibli, O'ZGARMAS, takror bor\nst  = {1, 2, 2, 3}        # set   — TARTIBSIZ, o'zgaruvchan, takror YO'Q\nd   = {\"a\": 1, \"b\": 2}    # dict  — kalit->qiymat\n\nprint(lst, tpl, st, d)\n# [1, 2, 2, 3] (1, 2, 2, 3) {1, 2, 3} {'a': 1, 'b': 2}\n\nlst[0] = 99               # ✓ mumkin\n# tpl[0] = 99             # ✗ TypeError\nst.add(4)                 # ✓ mumkin\nd[\"c\"] = 3                # ✓ mumkin\n\nprint(len(lst), len(st))  # 4 3  — set takrorni tashladi"
      },
      {
        h: { uz: "Qaysi birini tanlash — amaliy qoida", en: "Which to choose — a practical rule" },
        p: { uz: "Har safar o'zingdan uchta savol so'ra. Tartib muhimmi? Ma'lumot o'zgaradimi? Nom bilan qidiramanmi? Javoblardan struktura o'zi kelib chiqadi.", en: "Ask yourself three questions each time. Does order matter? Will the data change? Will I look things up by name? The structure follows from the answers." },
        code: "# 1) Tartibli, o'zgaradigan ro'yxat -> LIST\nvazifalar = [\"o'qish\", \"mashq\", \"test\"]\nvazifalar.append(\"takror\")\n\n# 2) O'zgarmasligi kerak -> TUPLE\nkoordinata = (41.31, 69.24)     # Toshkent\nRGB = (217, 119, 87)\n\n# 3) Takrorlanmasin / tez tekshirish -> SET\nkorilgan = set()\nkorilgan.add(\"kun1\")\nkorilgan.add(\"kun1\")            # ikkinchisi qo'shilmaydi\nprint(\"kun1\" in korilgan)       # True — juda tez\n\n# 4) Nom bilan qidirish -> DICT\ntalaba = {\"ism\": \"Akbar\", \"yosh\": 20, \"ball\": 92}\nprint(talaba[\"ball\"])\n\n# Klassik hiyla: takrorlarni tozalash\nsonlar = [1, 2, 2, 3, 3, 3]\nprint(list(set(sonlar)))        # [1, 2, 3]"
      },
      {
        h: { uz: "Nested: real ma'lumot shakli", en: "Nested: the shape of real data" },
        p: { uz: "Amaliy dasturlarda ma'lumot deyarli har doim ichma-ich bo'ladi: dict ichida list, list ichida dict. Bu — JSON ning aynan o'zi. Bugun shu shaklga ko'nikish keyingi yil OpenAI API bilan ishlaganingda foyda beradi.", en: "In real programs data is almost always nested: lists inside dicts, dicts inside lists. This is exactly what JSON is. Getting comfortable now pays off next year when you work with the OpenAI API." },
        code: "maktab = {\n    \"nom\": \"UzLeeder\",\n    \"sinflar\": [\n        {\"nom\": \"9-A\", \"talabalar\": [\"Akbar\", \"Laylo\"]},\n        {\"nom\": \"9-B\", \"talabalar\": [\"Bekzod\"]}\n    ]\n}\n\nprint(maktab[\"nom\"])                          # UzLeeder\nprint(maktab[\"sinflar\"][0][\"nom\"])            # 9-A\nprint(maktab[\"sinflar\"][0][\"talabalar\"][1])   # Laylo\n\n# Hammasini aylanib chiqish\nfor sinf in maktab[\"sinflar\"]:\n    print(sinf[\"nom\"], \"-\", len(sinf[\"talabalar\"]), \"talaba\")\n    for t in sinf[\"talabalar\"]:\n        print(\"   \", t)",
        notes: {
          why: { uz: "Chuqur murojaatni chapdan o'ngga o'qi: `maktab[\"sinflar\"]` — list; `[0]` — birinchi dict; `[\"nom\"]` — o'sha dictning kaliti. Har qadamda \"hozir qo'limda nima turibdi?\" deb so'ra.", en: "Read a deep access from left to right: `school[\"classes\"]` is a list; `[0]` is the first dict; `[\"name\"]` is that dict's key. At each step ask: what do I hold right now?" }
        }
      },
      {
        h: { uz: "Dictionary bo'ylab yurishning uch usuli", en: "Three ways to walk a dictionary" },
        p: { uz: "Bu uchtasi sertifikat imtihonlarida doim so'raladi. Farqni bilib olsang — kod ham qisqaradi, xato ham kamayadi.", en: "These three are a staple of certification exams. Knowing the difference makes your code shorter and your bugs fewer." },
        code: "narxlar = {\"non\": 5000, \"sut\": 12000, \"tuxum\": 20000}\n\n# 1) Faqat kalitlar (standart)\nfor mahsulot in narxlar:\n    print(mahsulot)\n\n# 2) Faqat qiymatlar\nfor narx in narxlar.values():\n    print(narx)\nprint(\"Jami:\", sum(narxlar.values()))\n\n# 3) Ikkalasi birga — eng ko'p ishlatiladi\nfor mahsulot, narx in narxlar.items():\n    print(f\"{mahsulot:<8} {narx:>7,} so'm\")\n\n# Xavfsiz o'qish\nprint(narxlar.get(\"guruch\", 0))    # 0 — KeyError yo'q"
      }
    ]
  },

  /* ============ HAFTA 3 — FUNKSIYA VA STRING ========================= */

  15: {
    notes: [
      {
        analogy: { uz: "Funksiya — retsept. `def` retseptni YOZADI (hech narsa pishmaydi), `name()` esa uni ISHLATADI. Retseptni bir marta yozib, yuz marta ishlatish mumkin.", en: "A function is a recipe. `def` WRITES the recipe (nothing gets cooked), `name()` USES it. Write once, use a hundred times." },
        why: { uz: "Funksiya nima uchun kerak? Uch sabab: takrorni yo'qotadi, nom berish orqali kodni tushuntiradi, va xatoni bitta joyda tuzatish imkonini beradi. Uchinchisi eng qimmatlisi.", en: "Why functions? Three reasons: they remove repetition, they explain the code by naming it, and they let you fix a bug in one place. The third is the most valuable." }
      },
      {
        why: { uz: "Parametr — retseptdagi \"ingredient nomi\", argument — haqiqiy ingredient. `def salom(ism)` da `ism` — parametr; `salom(\"Akbar\")` da `\"Akbar\"` — argument.", en: "A parameter is the ingredient's name in the recipe; an argument is the actual ingredient. In `def hello(name)`, `name` is the parameter; in `hello(\"Akbar\")`, `\"Akbar\"` is the argument." }
      },
      {
        pitfall: { uz: "`return` va `print` ni chalkashtirish — eng ko'p uchraydigan funksiya xatosi. `print` EKRANGA chiqaradi va yo'qoladi; `return` esa qiymatni QAYTARADI va uni saqlash, qo'shish, boshqa funksiyaga berish mumkin. `return` bo'lmasa funksiya `None` qaytaradi.", en: "Mixing up `return` and `print` is the classic function bug. `print` shows on screen and is gone; `return` hands back a value you can store, add, or pass on. Without `return`, a function returns `None`." },
        why: { uz: "`return` dan keyingi kod HECH QACHON ishlamaydi — funksiya o'sha zahoti tugaydi. Bu ataylab: `return` — \"ishim bitdi, mana natija\" degani.", en: "Code after `return` NEVER runs — the function ends immediately. That is deliberate: `return` means \"I'm done, here is the result\"." }
      },
      {
        why: { uz: "Funksiya ichidan boshqa funksiyani chaqirish mumkin — shunday qilib katta masala kichiklarga bo'linadi. Bu \"dekompozitsiya\" deyiladi va professional kodning asosi.", en: "A function may call another — that is how a big problem breaks into small ones. It is called decomposition and it underpins all professional code." }
      }
    ]
  },

  16: {
    notes: [
      {
        pitfall: { uz: "Default qiymatli parametr oddiy parametrdan KEYIN turishi shart: `def f(x, y=5)` ✓, `def f(x=1, y)` ✗ `SyntaxError`. Sabab: Python argumentlarni chapdan o'ngga taqsimlaydi.", en: "A parameter with a default must come AFTER plain parameters: `def f(x, y=5)` ✓, `def f(x=1, y)` ✗ `SyntaxError`. Reason: Python matches arguments left to right." },
        why: { uz: "Default qiymat funksiya YARATILGANDA bir marta hisoblanadi, har chaqiruvda emas. Shuning uchun `def f(lst=[])` xavfli: barcha chaqiruvlar bitta listni bo'lishadi. To'g'risi: `def f(lst=None)` va ichida `if lst is None: lst = []`.", en: "A default is evaluated ONCE when the function is defined, not on each call. That makes `def f(lst=[])` dangerous — every call shares one list. The fix: `def f(lst=None)` with `if lst is None: lst = []` inside." }
      },
      {
        analogy: { uz: "`*args` — \"qolganini hammasini shu savatga sol\". Funksiya ichida u TUPLE bo'ladi, ya'ni loop bilan aylanish mumkin. `print()` ning o'zi ham shunday ishlaydi.", en: "`*args` means \"put everything else in this basket\". Inside the function it is a TUPLE, so you can loop over it. `print()` itself works this way." }
      },
      {
        why: { uz: "`**kwargs` nomli argumentlarni DICT qilib yig'adi. `f(ism=\"Akbar\", yosh=20)` → `{\"ism\": \"Akbar\", \"yosh\": 20}`. Sozlamalar uzatishda va kutubxonalarda juda ko'p uchraydi.", en: "`**kwargs` collects named arguments into a DICT. `f(name=\"Akbar\", age=20)` → `{\"name\": \"Akbar\", \"age\": 20}`. Very common for passing options and in libraries." }
      },
      {
        why: { uz: "Funksiya ichida yaratilgan o'zgaruvchi tashqarida MAVJUD EMAS — funksiya tugashi bilan yo'qoladi. Bu cheklov emas, himoya: bir funksiya boshqasining o'zgaruvchisini tasodifan buzolmaydi.", en: "A variable created inside a function does not exist outside — it vanishes when the function ends. That is not a limitation but a protection: one function cannot accidentally clobber another's variables." },
        pitfall: { uz: "`global` kalit so'zini imkon qadar ishlatma. Uning o'rniga qiymatni `return` bilan qaytar — kod ancha oson tushuniladi va sinaladi.", en: "Avoid the `global` keyword where you can. Return the value instead — the code becomes far easier to understand and to test." }
      }
    ]
  },

  17: {
    intro: { uz: "Funksiyalar — yaxshi dasturchini boshlang'ichdan ajratadigan chegara. Bugun `return` bilan `print` farqini, argument turlarini va scope'ni bir tizimga solamiz.", en: "Functions are the line between a beginner and a competent programmer. Today we bring `return` vs `print`, argument kinds and scope into one system." },
    extraSections: [
      {
        h: { uz: "return va print — eng muhim farq", en: "return vs print — the crucial difference" },
        p: { uz: "Ikkalasi ham \"natijani ko'rsatgandek\" tuyuladi, lekin butunlay boshqa narsa. `print` — odam uchun; `return` — DASTUR uchun. Faqat `print` qilgan funksiyaning natijasini ishlatib bo'lmaydi.", en: "Both look like \"showing a result\", but they are completely different. `print` is for a human; `return` is for the PROGRAM. You cannot reuse the result of a function that only prints." },
        code: "def qosh_print(a, b):\n    print(a + b)          # ekranga chiqaradi, qiymat qaytarmaydi\n\ndef qosh_return(a, b):\n    return a + b          # qiymatni QAYTARADI\n\nx = qosh_print(2, 3)      # ekranda: 5\nprint(x)                  # None  <- natija yo'qoldi!\n\ny = qosh_return(2, 3)     # ekranda hech narsa\nprint(y)                  # 5\nprint(y * 10)             # 50    <- ishlatish mumkin\nprint(qosh_return(qosh_return(1, 2), 3))   # 6\n\n# Amaliy qoida: hisoblaydigan funksiya RETURN qilsin,\n# ko'rsatadigan funksiya PRINT qilsin. Ikkalasini aralashtirma."
      },
      {
        h: { uz: "Argumentlarning to'rt turi va tartibi", en: "Four kinds of arguments, and their order" },
        p: { uz: "Python'da argumentlar aniq tartibda yoziladi: oddiy → default → `*args` → `**kwargs`. Bu tartib buzilsa `SyntaxError`. Sertifikat imtihonida shu tartib bo'yicha savol deyarli kafolatlangan.", en: "Python requires a fixed order: plain → default → `*args` → `**kwargs`. Break it and you get a `SyntaxError`. A question on this order is all but guaranteed in the certification exam." },
        code: "def profil(ism, yosh=18, *qiziqishlar, **qoshimcha):\n    print(\"Ism:\", ism)              # majburiy\n    print(\"Yosh:\", yosh)            # default bor\n    print(\"Qiziqish:\", qiziqishlar) # tuple\n    print(\"Qo'shimcha:\", qoshimcha) # dict\n\nprofil(\"Akbar\")\n# Ism: Akbar / Yosh: 18 / Qiziqish: () / Qo'shimcha: {}\n\nprofil(\"Laylo\", 20, \"kitob\", \"sport\", shahar=\"Toshkent\")\n# Qiziqish: ('kitob', 'sport')\n# Qo'shimcha: {'shahar': 'Toshkent'}\n\n# Nomi bilan berish — tartibdan qutqaradi va o'qishga oson\nprofil(ism=\"Bek\", yosh=25)"
      },
      {
        h: { uz: "Scope — o'zgaruvchi qayerda ko'rinadi", en: "Scope — where a variable is visible" },
        p: { uz: "Python nomni izlaganda ichkaridan tashqariga qaraydi: avval funksiya ichi (local), keyin tashqarisi (global), oxirida o'rnatilganlar (builtins). Birinchi topilgani ishlatiladi.", en: "Python looks a name up from the inside out: the function body (local) first, then the enclosing module (global), then builtins. The first match wins." },
        code: "hisob = 100                  # global\n\ndef korish():\n    print(hisob)             # 100 — o'qish mumkin\n\ndef ozgartirish_xato():\n    hisob = 5                # YANGI local yaratdi\n    print(hisob)             # 5\n\ndef ozgartirish_togri():\n    global hisob\n    hisob = 5                # globalni o'zgartirdi\n\nkorish()                     # 100\nozgartirish_xato()           # 5\nprint(hisob)                 # 100 — o'zgarmadi!\nozgartirish_togri()\nprint(hisob)                 # 5\n\n# Eng toza usul — globalga tegmasdan return qilish:\ndef yaxshi(qiymat):\n    return qiymat + 1\nhisob = yaxshi(hisob)",
        notes: {
          why: { uz: "Nega `hisob = 5` yozganda Python uni local deb hisoblaydi? Chunki funksiya ichida biror nomga qiymat berilsa, Python butun funksiya davomida uni local deb belgilaydi — hatto qiymat berish qatoridan oldin ham. `global` shu qoidani bekor qiladi.", en: "Why does `count = 5` create a local? Because if a name is assigned anywhere in a function, Python treats it as local throughout — even before the assignment line. `global` overrides that rule." }
        }
      },
      {
        h: { uz: "Mutable default — klassik tuzoq", en: "Mutable defaults — the classic trap" },
        p: { uz: "Bu xato sertifikat imtihonlarida ham, real ishda ham uchraydi va uni bilmagan odam bir necha soat vaqt yo'qotadi. Sabab: default qiymat funksiya yozilganda BIR MARTA yaratiladi.", en: "This bug shows up both in exams and in real work, and costs hours if you have not met it. The cause: a default value is created ONCE, when the function is defined." },
        code: "# ✗ XAVFLI\ndef qosh_xato(element, ro_yxat=[]):\n    ro_yxat.append(element)\n    return ro_yxat\n\nprint(qosh_xato(1))    # [1]\nprint(qosh_xato(2))    # [1, 2]  <- kutilmagan!\nprint(qosh_xato(3))    # [1, 2, 3]\n\n# ✓ TO'G'RI\ndef qosh_togri(element, ro_yxat=None):\n    if ro_yxat is None:\n        ro_yxat = []      # har chaqiruvda YANGI list\n    ro_yxat.append(element)\n    return ro_yxat\n\nprint(qosh_togri(1))   # [1]\nprint(qosh_togri(2))   # [2]  <- to'g'ri\n\n# Qoida: default qiymat sifatida faqat O'ZGARMAS turlarni ishlat\n# (son, matn, None, tuple). List/dict/set — hech qachon."
      }
    ]
  },

  18: {
    notes: [
      {
        why: { uz: "String — belgilar ro'yxatiga o'xshaydi va aynan shu qoidalar bilan ishlaydi: index 0 dan, `[-1]` oxirgi, slicing bir xil. Listda o'rgangan hamma narsa shu yerda ham amal qiladi.", en: "A string behaves like a list of characters and follows the same rules: index from 0, `[-1]` is last, slicing identical. Everything you learned about lists carries over." },
        pitfall: { uz: "String O'ZGARMAS: `s[0] = \"X\"` — `TypeError`. Almashtirish uchun yangi string yasaysan: `s = \"X\" + s[1:]`.", en: "Strings are immutable: `s[0] = \"X\"` raises `TypeError`. To change one you build a new string: `s = \"X\" + s[1:]`." }
      },
      {
        why: { uz: "String metodlari hech qachon aslini o'zgartirmaydi — YANGI string qaytaradi. Shuning uchun `s.upper()` yolg'iz o'zi hech narsa qilmaydi; `s = s.upper()` deb saqlash kerak.", en: "String methods never modify the original — they return a NEW string. So `s.upper()` on its own does nothing; you must store it: `s = s.upper()`." },
        analogy: { uz: "`strip()` — matnning boshi va oxiridagi ko'rinmas bo'shliqlarni qirqish. Foydalanuvchi kiritgan ma'lumot bilan ishlaganda deyarli har doim kerak bo'ladi.", en: "`strip()` trims the invisible whitespace at both ends. You will need it almost every time you handle user input." }
      },
      {
        analogy: { uz: "`split()` — matnni qaychi bilan kesish (natija — list), `join()` — bo'laklarni yelim bilan yopishtirish (natija — string). Ular bir-birining teskarisi.", en: "`split()` cuts text with scissors (result: a list), `join()` glues pieces back (result: a string). They are inverses of each other." },
        pitfall: { uz: "`join()` ni teskari yozish juda tez-tez bo'ladi. To'g'risi: `\"-\".join(lst)` — yelim OLDINDA turadi, list ichkarida.", en: "Writing `join()` backwards is very common. The correct form is `\"-\".join(lst)` — the glue comes first, the list goes inside." }
      },
      {
        why: { uz: "`in` operatori string ichida bo'lak qidiradi: `\"world\" in \"hello world\"` → `True`. Bu `find()` dan oddiyroq, chunki javob to'g'ridan-to'g'ri `bool` — `if` ga tayyor.", en: "The `in` operator searches for a substring: `\"world\" in \"hello world\"` → `True`. Simpler than `find()` because the answer is already a `bool`, ready for an `if`." }
      }
    ]
  },

  19: {
    notes: [
      {
        why: { uz: "f-string ichida IFODA yozish mumkin, nafaqat o'zgaruvchi: `f\"{a + b}\"`, `f\"{lst[0].upper()}\"`, hatto `f\"{'juft' if n % 2 == 0 else 'toq'}\"`. Bu uni eski `%` va `.format()` usullaridan ancha kuchli qiladi.", en: "You can put an EXPRESSION inside an f-string, not just a variable: `f\"{a + b}\"`, `f\"{lst[0].upper()}\"`, even `f\"{'even' if n % 2 == 0 else 'odd'}\"`. That makes it far more powerful than the older `%` and `.format()` styles." }
      },
      {
        analogy: { uz: "`:.2f` — kassa formati, `:,` — bank formati (mingliklar), `:.0%` — hisobot formati (foiz). Har biri bitta belgi bilan chiroyli natija beradi.", en: "`:.2f` is receipt format, `:,` is bank format (thousands), `:.0%` is report format (percentage). Each gives a polished result from a single character." },
        pitfall: { uz: "`{narx:.2f}` faqat SONGA ishlaydi. `narx` string bo'lsa `ValueError` chiqadi — avval `float()` qil.", en: "`{price:.2f}` only works on numbers. If `price` is a string you get a `ValueError` — convert with `float()` first." }
      },
      {
        why: { uz: "Tekislash (`>` `<` `^`) jadval chiqarish uchun kerak: har ustun bir xil kenglikda bo'lsa, natija tekis ko'rinadi. Terminalда hisobot yasashning eng oson yo'li.", en: "Alignment (`>` `<` `^`) is for tables: give each column a fixed width and the output lines up. It is the easiest way to print a report in a terminal." }
      },
      {
        pitfall: { uz: "Windows yo'llarida `\\` muammo tug'diradi: `\"C:\\new\"` da `\\n` yangi qator bo'lib ketadi. Yechim — xom string: `r\"C:\\new\"`.", en: "Backslashes bite on Windows paths: in `\"C:\\new\"` the `\\n` becomes a newline. Fix with a raw string: `r\"C:\\new\"`." }
      }
    ]
  },

  20: {
    intro: { uz: "String — dasturlashda eng ko'p ishlatiladigan tur. Ismlar, xabarlar, fayllar, API javoblari — hammasi matn. Bugun uni to'liq egallaymiz.", en: "Strings are the most-used type in programming. Names, messages, files, API responses — all text. Today we take full command of them." },
    extraSections: [
      {
        h: { uz: "\"O'zgarmas\" (immutable) nima degani", en: "What \"immutable\" actually means" },
        p: { uz: "String o'zgarmasligi — cheklov emas, dizayn qarori. U string'ni xavfsiz (bir joyda o'zgartirsang boshqa joyda buzilmaydi) va tez (kesh qilish mumkin) qiladi. Amalda esa bu shuni anglatadiki: har \"o'zgartirish\" aslida YANGI string yaratadi.", en: "Immutability is a design decision, not a restriction. It makes strings safe (changing one place cannot break another) and fast (they can be cached). In practice it means every \"change\" actually creates a NEW string." },
        code: "s = \"python\"\n\n# s[0] = \"P\"          # ✗ TypeError\n\ns2 = \"P\" + s[1:]      # ✓ yangi string\nprint(s, s2)          # python Python\n\n# Metodlar ham yangi string qaytaradi\nprint(s.upper())      # PYTHON\nprint(s)              # python  <- asli o'zgarmadi\n\ns = s.upper()         # saqlash kerak\nprint(s)              # PYTHON\n\n# Zanjir qilish mumkin\nmatn = \"   Salom Dunyo   \"\nprint(matn.strip().lower().replace(\" \", \"_\"))\n# salom_dunyo"
      },
      {
        h: { uz: "Slicing to'liq: [start:stop:step]", en: "Slicing in full: [start:stop:step]" },
        p: { uz: "Uchta son bilan istalgan bo'lakni olish mumkin. Har biri ixtiyoriy: yozmasang standart qiymat ishlaydi. Manfiy qadam — teskari yo'nalish.", en: "Three numbers give you any piece you want. Each is optional; omit it and the default applies. A negative step reverses direction." },
        code: "s = \"Python dasturlash\"\n\nprint(s[0])        # P\nprint(s[-1])       # h\nprint(s[0:6])      # Python\nprint(s[:6])       # Python   — boshidan\nprint(s[7:])       # dasturlash — oxirigacha\nprint(s[::2])      # Pto atrls  — bittadan tashlab\nprint(s[::-1])     # hsalrutsad nohtyP — teskari\nprint(len(s))      # 17\n\n# Amaliy: fayl kengaytmasini olish\nfayl = \"hisobot.pdf\"\nprint(fayl[-3:])           # pdf\nprint(fayl.split(\".\")[-1]) # pdf — ishonchliroq\n\n# Palindrom tekshirish\nsoz = \"radar\"\nprint(soz == soz[::-1])    # True"
      },
      {
        h: { uz: "split va join — matn bilan ishlashning yuragi", en: "split and join — the heart of text work" },
        p: { uz: "Deyarli har matn masalasi shu ikkitasiga tushadi: matnni bo'laklarga ajrat, ular bilan ishla, qaytib yig'. CSV o'qish, so'z sanash, ism formatlash — hammasi shu.", en: "Almost every text task reduces to these two: split the text apart, work on the pieces, join them back. Reading CSV, counting words, formatting names — all the same." },
        code: "matn = \"Akbar,20,Toshkent\"\nbolaklar = matn.split(\",\")\nprint(bolaklar)            # ['Akbar', '20', 'Toshkent']\n\nism, yosh, shahar = bolaklar     # unpacking!\nprint(f\"{ism} — {yosh} yosh, {shahar}\")\n\n# Orqaga yig'ish\nprint(\" | \".join(bolaklar))      # Akbar | 20 | Toshkent\n\n# Bo'shliq bo'yicha (argumentsiz split)\ngap = \"Python juda kuchli til\"\nsozlar = gap.split()\nprint(len(sozlar), \"ta so'z\")     # 4\nprint([s.upper() for s in sozlar])\n\n# join faqat STRING listini oladi:\nsonlar = [1, 2, 3]\n# print(\"-\".join(sonlar))        # ✗ TypeError\nprint(\"-\".join(str(n) for n in sonlar))   # 1-2-3",
        notes: {
          pitfall: { uz: "`join()` ga son listini bersang `TypeError` chiqadi. Avval har elementni `str()` ga aylantir.", en: "Passing a list of numbers to `join()` raises `TypeError`. Convert each element with `str()` first." }
        }
      },
      {
        h: { uz: "f-string formatlash lug'ati", en: "The f-string formatting cheat sheet" },
        p: { uz: "Bu jadvalni bir marta ko'rib chiqsang, hisobot va jadval chiqarish muammosi butunlay yopiladi. Sintaksis: `{qiymat:[to'ldiruvchi][tekislash][kenglik][,][.aniqlik][tur]}`.", en: "Go through this once and printing reports and tables stops being a problem. The syntax is `{value:[fill][align][width][,][.precision][type]}`." },
        code: "narx = 1234567.891\nism = \"Akbar\"\nfoiz = 0.876\n\nprint(f\"{narx:.2f}\")      # 1234567.89   — 2 xona kasr\nprint(f\"{narx:,.0f}\")     # 1,234,568    — mingliklar\nprint(f\"{foiz:.1%}\")      # 87.6%        — foiz\nprint(f\"{42:05d}\")        # 00042        — nol bilan to'ldirish\n\nprint(f\"|{ism:<10}|\")     # |Akbar     |  — chapga\nprint(f\"|{ism:>10}|\")     # |     Akbar|  — o'ngga\nprint(f\"|{ism:^10}|\")     # |  Akbar   |  — markazga\nprint(f\"|{ism:*^10}|\")    # |**Akbar***|  — to'ldiruvchi bilan\n\n# Jadval chiqarish\nmahsulotlar = [(\"Non\", 5000), (\"Sut\", 12000), (\"Tuxum\", 20000)]\nfor nom, n in mahsulotlar:\n    print(f\"{nom:<10} {n:>10,} so'm\")"
      }
    ]
  },

  21: {
    notes: [
      {
        analogy: { uz: "Comprehension — loopni bir qatorga siqish. O'qish tartibi: avval o'rtadagi `for` ni o'qi (\"nima bo'ylab yuramiz\"), keyin boshidagi ifodani (\"har biriga nima qilamiz\").", en: "A comprehension compresses a loop into one line. Read it middle-first: the `for` tells you what you walk over, then the leading expression tells you what you do to each item." },
        why: { uz: "Comprehension nafaqat qisqa, balki TEZROQ ham — Python uni ichki darajada optimallashtiradi. Lekin asosiy foyda — niyat aniq ko'rinadi: \"bu yerda yangi list yasayapman\".", en: "A comprehension is not only shorter but FASTER — Python optimises it internally. The main benefit, though, is that the intent is visible: \"I am building a new list here\"." }
      },
      {
        why: { uz: "Shart oxirida turadi: `[x for x in seq if shart]`. Bu \"filtr\" — mos kelmaganlar natijaga tushmaydi. Tartibni eslab qol: NIMA → QAYERDAN → QAYSI SHARTDA.", en: "The condition goes at the end: `[x for x in seq if cond]`. That is a filter — non-matching items simply don't appear. Remember the order: WHAT → FROM WHERE → UNDER WHICH CONDITION." }
      },
      {
        pitfall: { uz: "`if-else` bo'lsa, u BOSHDA turadi: `[x if shart else y for x in seq]`. Bu filtr emas, o'zgartirish — hamma element natijaga tushadi, faqat qiymati boshqacha bo'ladi. Ikki shaklni chalkashtirish juda tez-tez bo'ladi.", en: "With `if-else` the condition goes at the FRONT: `[x if cond else y for x in seq]`. That is a transformation, not a filter — every element ends up in the result, just with a different value. Confusing the two forms is very common." }
      },
      {
        pitfall: { uz: "Comprehension'ni ikki qatordan uzun qilma. Uch shart va nested loop bilan siqilgan kod \"aqlli\" ko'rinadi, lekin bir haftadan keyin o'zing ham tushunmaysan. Bunday holatda oddiy `for` yoz.", en: "Don't let a comprehension grow past two lines. Three conditions and a nested loop look clever but you won't understand your own code in a week. Use a plain `for` in that case." }
      }
    ]
  },

  22: {
    intro: { uz: "Uch mavzu — funksiya, string, comprehension — birga ishlaganda haqiqiy kuch chiqadi. Bugun ularni bitta real masalada birlashtiramiz.", en: "Three topics — functions, strings, comprehensions — show their real power together. Today we combine them on one realistic task." },
    extraSections: [
      {
        h: { uz: "Comprehension — loopdan tarjima", en: "Comprehension — translated from a loop" },
        p: { uz: "Comprehension'ni yodlash shart emas; uni loopdan \"tarjima qilish\" mumkin. Uch qadam: `result = []` ni `[` ga, `append(...)` ichidagini boshiga, `for` va `if` ni o'z tartibida oxiriga.", en: "You don't need to memorise comprehensions; you can translate them from a loop. Three steps: `result = []` becomes `[`, whatever is inside `append(...)` moves to the front, and the `for` and `if` follow in order." },
        code: "sonlar = [1, 2, 3, 4, 5, 6]\n\n# --- Uzun shakl ---\nnatija = []\nfor n in sonlar:\n    if n % 2 == 0:\n        natija.append(n * n)\nprint(natija)              # [4, 16, 36]\n\n# --- Tarjimasi ---\nnatija = [n * n for n in sonlar if n % 2 == 0]\nprint(natija)              # [4, 16, 36]\n#         ^^^^^  ^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^\n#         nima   qayerdan          qaysi shartda\n\n# Filtr (if oxirida) va o'zgartirish (if-else boshida) — farqi:\nprint([n for n in sonlar if n > 3])            # [4, 5, 6] — 3 ta\nprint([n if n > 3 else 0 for n in sonlar])     # [0,0,0,4,5,6] — 6 ta\n\n# Dict va set uchun ham bor:\nprint({n: n * n for n in range(4)})            # {0:0, 1:1, 2:4, 3:9}\nprint({len(s) for s in [\"a\", \"bb\", \"cc\"]})     # {1, 2}"
      },
      {
        h: { uz: "Qachon comprehension ISHLATMASLIK kerak", en: "When NOT to use a comprehension" },
        p: { uz: "Comprehension — chiroyli, lekin har joyga to'g'ri kelmaydi. Uch holatda oddiy loop yaxshiroq: kod uzun bo'lganda, ichida `print` yoki fayl yozish bo'lganda, va nested comprehension o'qib bo'lmaydigan darajaga yetganda.", en: "Comprehensions are elegant but not universal. A plain loop is better in three cases: when the body is long, when it does side effects like `print` or writing a file, and when nesting makes it unreadable." },
        code: "sozlar = [\"python\", \"kod\", \"dastur\"]\n\n# ✓ Yaxshi: qisqa va toza\nuzunliklar = [len(s) for s in sozlar]\n\n# ✗ Yomon: yon ta'sir (print) uchun comprehension\n# [print(s) for s in sozlar]     # keraksiz list yasaydi\n# ✓ To'g'risi:\nfor s in sozlar:\n    print(s)\n\n# ✗ Yomon: o'qib bo'lmaydi\n# r = [x*y for x in range(5) if x%2==0 for y in range(5) if y>x]\n\n# ✓ To'g'risi: oddiy loop\nnatija = []\nfor x in range(5):\n    if x % 2 != 0:\n        continue\n    for y in range(5):\n        if y > x:\n            natija.append(x * y)\nprint(natija)",
        notes: {
          why: { uz: "Qoida: comprehension YANGI ma'lumot yasash uchun. Biror ish BAJARISH uchun (chiqarish, saqlash, yuborish) — oddiy loop.", en: "Rule of thumb: use a comprehension to BUILD new data. To DO something (print, save, send) use a plain loop." }
        }
      },
      {
        h: { uz: "Uchtasi birga: matn statistikasi", en: "All three together: text statistics" },
        p: { uz: "Mana bu haqiqiy dastur: funksiyalar bilan bo'lingan, string metodlari bilan tozalangan, comprehension bilan qisqartirilgan. Bu — 30-kunlik loyihangning skeleti.", en: "Here is a real program: split into functions, cleaned with string methods, shortened with comprehensions. This is the skeleton of your day-30 project." },
        code: "def tozala(matn):\n    \"\"\"Tinish belgilarini olib tashlaydi va kichik harfga o'giradi.\"\"\"\n    for belgi in \".,!?;:\":\n        matn = matn.replace(belgi, \"\")\n    return matn.lower().strip()\n\ndef sozlar_soni(matn):\n    return len(tozala(matn).split())\n\ndef eng_uzun(matn, n=3):\n    sozlar = tozala(matn).split()\n    return sorted(sozlar, key=len, reverse=True)[:n]\n\ndef chastota(matn):\n    hisob = {}\n    for soz in tozala(matn).split():\n        hisob[soz] = hisob.get(soz, 0) + 1\n    return hisob\n\nmatn = \"Python juda kuchli til. Python bilan hamma narsa mumkin!\"\n\nprint(\"So'zlar:\", sozlar_soni(matn))          # 9\nprint(\"Eng uzun:\", eng_uzun(matn))\nprint(\"Takrorlangan:\", {k: v for k, v in chastota(matn).items() if v > 1})\nprint(\"Katta harflar:\", [s.upper() for s in tozala(matn).split()[:3]])"
      }
    ]
  },

  /* ============ HAFTA 4 — ILG'OR ASOSLAR ============================= */

  23: {
    notes: [
      {
        analogy: { uz: "`try/except` — xavfsizlik to'ri. Kod yiqilganda dastur o'lmaydi, `except` bloki uni ushlaydi va nima qilishni aytadi.", en: "`try/except` is a safety net. When code falls, the program does not die — the `except` block catches it and says what to do next." },
        why: { uz: "Nega bu muhim? Chunki foydalanuvchi har doim kutilmagan narsa yozadi, fayl har doim joyida bo'lmaydi, internet har doim ishlamaydi. Professional kod — bu \"nima noto'g'ri ketishi mumkin\" degan savolga javob bergan kod.", en: "Why does this matter? Because users always type something unexpected, files are not always there, the network is not always up. Professional code is code that has answered the question \"what could go wrong?\"" }
      },
      {
        pitfall: { uz: "Yalang'och `except:` yozma — u HAMMA xatoni, hatto Ctrl+C ni ham ushlaydi va dasturni to'xtatib bo'lmay qoladi. Har doim aniq turini yoz: `except ValueError:`.", en: "Never write a bare `except:` — it swallows EVERYTHING, even Ctrl+C, and you can no longer stop the program. Always name the type: `except ValueError:`." },
        why: { uz: "Aniq xato turini yozish yana bir foyda beradi: kutilmagan xato YASHIRINMAYDI. Agar kodda boshqa muammo bo'lsa, u ko'rinib turadi va tuzatiladi.", en: "Naming the exact exception has a second benefit: unexpected errors are not hidden. If there is another bug in the code, you will see it and fix it." }
      },
      {
        why: { uz: "`except ValueError as e` — `e` ichida xatoning tafsiloti bo'ladi. Uni `print(e)` bilan ko'rsatish nosozlikni topishda juda yordam beradi.", en: "`except ValueError as e` puts the error's details in `e`. Printing it with `print(e)` is a huge help when debugging." }
      },
      {
        analogy: { uz: "`finally` — \"nima bo'lsa ham\" bloki: xato bo'ldimi, bo'lmadimi, hatto `return` bo'lsa ham ishlaydi. Fayl yopish, ulanish uzish kabi tozalash ishlari uchun.", en: "`finally` is the \"no matter what\" block: it runs whether or not there was an error, even after a `return`. It is for cleanup — closing files, dropping connections." }
      }
    ]
  },

  24: {
    notes: [
      {
        pitfall: { uz: "`'w'` rejimi faylni OCHISHDA darhol tozalaydi — ichidagi hamma narsa yo'qoladi. Qo'shish kerak bo'lsa `'a'` ishlat. Bu xato bilan yozilgan ma'lumotni qaytarib bo'lmaydi.", en: "Mode `'w'` wipes the file the moment it opens — everything inside is gone. Use `'a'` when you want to append. Data lost this way is not recoverable." },
        why: { uz: "Uch asosiy rejim: `'r'` o'qish (fayl bo'lishi shart), `'w'` yozish (yo'q bo'lsa yaratadi, bor bo'lsa tozalaydi), `'a'` qo'shish (oxiriga yozadi). Shubhalansang — `'a'`.", en: "Three core modes: `'r'` read (the file must exist), `'w'` write (creates or wipes), `'a'` append (adds at the end). When unsure, use `'a'`." }
      },
      {
        why: { uz: "`with open(...)` blokdan chiqishda faylni AVTOMATIK yopadi — hatto xato chiqsa ham. Qo'lda `f.close()` yozish esa unutiladi va fayl ochiq qolib, ma'lumot diskka yozilmasligi mumkin.", en: "`with open(...)` closes the file AUTOMATICALLY when the block ends — even on an error. A manual `f.close()` gets forgotten, leaving the file open and the data possibly unwritten." },
        analogy: { uz: "`with` — o'zi yopiladigan eshik. Kirasan, ishingni qilasan, chiqasan — eshik orqangdan yopiladi.", en: "`with` is a self-closing door. You walk in, do your work, walk out — the door shuts behind you." }
      },
      {
        why: { uz: "`for line in f` — eng yaxshi o'qish usuli, chunki u faylni QATOR-QATOR o'qiydi. `read()` esa butun faylni xotiraga soladi — 2 GB log fayl bilan bu ishlamaydi.", en: "`for line in f` is the best way to read because it works LINE BY LINE. `read()` loads the whole file into memory — which fails on a 2 GB log file." },
        pitfall: { uz: "Har qator oxirida ko'rinmas `\\n` bo'ladi. `print(line)` ikki marta yangi qator beradi. Yechim: `print(line.strip())`.", en: "Each line ends with an invisible `\\n`, so `print(line)` produces a double line break. Fix: `print(line.strip())`." }
      },
      {
        why: { uz: "Fayl va `try/except` deyarli har doim birga yuradi: fayl yo'q bo'lishi, huquq yetmasligi, disk to'lishi mumkin. `FileNotFoundError` — eng ko'p uchraydigani.", en: "Files and `try/except` almost always travel together: the file may be missing, permissions may be denied, the disk may be full. `FileNotFoundError` is the most common." }
      }
    ]
  },

  25: {
    intro: { uz: "Xato va fayl — \"o'yinchoq dastur\" bilan \"haqiqiy dastur\" orasidagi chegara. Ma'lumotni saqlay oladigan va yiqilmaydigan kod — bu allaqachon jiddiy dastur.", en: "Errors and files are the line between a toy program and a real one. Code that can save data and does not crash is already serious software." },
    extraSections: [
      {
        h: { uz: "Xato turlari lug'ati", en: "A dictionary of error types" },
        p: { uz: "Xato matnini o'qishni bilish — dasturchining eng foydali ko'nikmasi. Har xato turi ANIQ nimani anglatishini bilsang, tuzatish bir daqiqalik ish bo'ladi.", en: "Reading an error message is a programmer's most useful skill. Once you know exactly what each type means, fixing it takes a minute." },
        code: "# ValueError — tur to'g'ri, lekin QIYMAT noto'g'ri\n# int(\"salom\")\n\n# TypeError — TUR noto'g'ri\n# \"2\" + 2\n\n# ZeroDivisionError — nolga bo'lish\n# 10 / 0\n\n# IndexError — ro'yxatda bunday index yo'q\n# [1, 2, 3][5]\n\n# KeyError — dictionaryда bunday kalit yo'q\n# {\"a\": 1}[\"b\"]\n\n# FileNotFoundError — fayl topilmadi\n# open(\"yoq.txt\")\n\n# NameError — bunday nomdagi o'zgaruvchi yo'q (ko'pincha imlo xatosi)\n# print(prnt)\n\n# AttributeError — bu turda bunday metod yo'q\n# \"matn\".append(\"x\")\n\n# Amalda ushlash:\ntry:\n    son = int(\"salom\")\nexcept ValueError as e:\n    print(\"Xato turi:\", type(e).__name__)   # ValueError\n    print(\"Tafsilot:\", e)"
      },
      {
        h: { uz: "try / except / else / finally — to'liq tartib", en: "try / except / else / finally — the full order" },
        p: { uz: "To'rttasi birga ishlatilganda tartib qat'iy: `try` → `except` → `else` → `finally`. `else` xato BO'LMAGANDA ishlaydi, `finally` esa har doim. Sertifikat imtihonida shu tartib bo'yicha savol bo'ladi.", en: "When all four appear, the order is fixed: `try` → `except` → `else` → `finally`. The `else` runs when there was NO error, `finally` runs always. Expect an exam question on this order." },
        code: "def bol(a, b):\n    try:\n        natija = a / b\n    except ZeroDivisionError:\n        print(\"Nolga bo'lib bo'lmaydi\")\n        return None\n    except TypeError as e:\n        print(\"Tur xatosi:\", e)\n        return None\n    else:\n        print(\"Xatosiz bajarildi\")     # faqat xato bo'lmasa\n        return natija\n    finally:\n        print(\"--- tugadi ---\")        # HAR DOIM\n\nprint(bol(10, 2))\n# Xatosiz bajarildi / --- tugadi --- / 5.0\n\nprint(bol(10, 0))\n# Nolga bo'lib bo'lmaydi / --- tugadi --- / None\n\nprint(bol(10, \"a\"))\n# Tur xatosi: ... / --- tugadi --- / None",
        notes: {
          why: { uz: "`finally` hatto `return` dan keyin ham ishlaydi — funksiya qiymatni qaytarishdan OLDIN `finally` bajariladi. Shuning uchun u tozalash ishlari uchun ishonchli joy.", en: "`finally` runs even after a `return` — it executes just before the function actually hands back the value. That is why it is the reliable place for cleanup." }
        }
      },
      {
        h: { uz: "Fayl rejimlari — to'liq jadval", en: "File modes — the complete table" },
        p: { uz: "Rejani noto'g'ri tanlash — ma'lumot yo'qotishning eng tez yo'li. Quyidagi jadvalni bir marta ko'rib chiq va `'w'` ni ehtiyot bilan ishlat.", en: "Choosing the wrong mode is the fastest way to lose data. Go through this table once, and treat `'w'` with care." },
        code: "# 'r'  o'qish        — fayl BO'LISHI SHART, aks holda FileNotFoundError\n# 'w'  yozish        — yo'q bo'lsa yaratadi, BOR BO'LSA TOZALAYDI (!)\n# 'a'  qo'shish      — yo'q bo'lsa yaratadi, bor bo'lsa oxiriga yozadi\n# 'r+' o'qish+yozish — fayl bo'lishi shart\n# 'x'  yaratish      — fayl BOR bo'lsa xato beradi (himoya)\n\n# Yozish\nwith open(\"vazifalar.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"Python o'rganish\\n\")\n    f.write(\"Mashq qilish\\n\")\n\n# Qo'shish — avvalgisi saqlanadi\nwith open(\"vazifalar.txt\", \"a\", encoding=\"utf-8\") as f:\n    f.write(\"Test topshirish\\n\")\n\n# O'qish\nwith open(\"vazifalar.txt\", \"r\", encoding=\"utf-8\") as f:\n    for i, qator in enumerate(f, 1):\n        print(i, qator.strip())",
        notes: {
          pitfall: { uz: "O'zbekcha (yoki har qanday lotin bo'lmagan) matn bilan ishlaganda `encoding=\"utf-8\"` yozishni unutma — aks holda Windows'da `UnicodeDecodeError` chiqadi.", en: "Always pass `encoding=\"utf-8\"` when the text is not plain ASCII — otherwise Windows throws `UnicodeDecodeError`." }
        }
      },
      {
        h: { uz: "Xavfsiz fayl shabloni", en: "The safe file pattern" },
        p: { uz: "Bu shablonni yodlab ol — real loyihalarda fayl bilan ishlaganda deyarli har doim shu ko'rinishda yoziladi. Uchta himoya bor: `with`, `try/except` va standart qiymat.", en: "Memorise this pattern — real projects handle files this way nearly every time. It has three protections: `with`, `try/except`, and a fallback value." },
        code: "def oqi(fayl_nomi):\n    \"\"\"Faylni o'qiydi. Muammo bo'lsa bo'sh list qaytaradi (yiqilmaydi).\"\"\"\n    try:\n        with open(fayl_nomi, \"r\", encoding=\"utf-8\") as f:\n            return [q.strip() for q in f if q.strip()]\n    except FileNotFoundError:\n        print(f\"'{fayl_nomi}' topilmadi — bo'sh ro'yxat qaytarildi\")\n        return []\n    except PermissionError:\n        print(\"Faylga kirish huquqi yo'q\")\n        return []\n\ndef qosh(fayl_nomi, matn):\n    try:\n        with open(fayl_nomi, \"a\", encoding=\"utf-8\") as f:\n            f.write(matn + \"\\n\")\n        return True\n    except OSError as e:\n        print(\"Yozib bo'lmadi:\", e)\n        return False\n\nqosh(\"vazifalar.txt\", \"Yangi vazifa\")\nfor v in oqi(\"vazifalar.txt\"):\n    print(\"•\", v)\nprint(oqi(\"yoq_fayl.txt\"))   # [] — dastur yiqilmadi"
      }
    ]
  },

  26: {
    notes: [
      {
        analogy: { uz: "Modul — tayyor asboblar qutisi. `import math` — qutini stol ustiga qo'yish; `math.sqrt(16)` — qutidan asbob olish. Har safar qutining nomini aytish kerak.", en: "A module is a ready-made toolbox. `import math` puts the box on your desk; `math.sqrt(16)` takes a tool out of it. You name the box each time." },
        why: { uz: "Python'ning kuchi — \"batareyalar ichida\" falsafasi: 200 dan ortiq modul o'rnatilgan holda keladi. Biror narsa yozishdan oldin \"buni Python allaqachon qilganmi?\" deb so'rash professional odat.", en: "Python's strength is its \"batteries included\" philosophy: over 200 modules ship with it. Asking \"has Python already done this?\" before writing something is a professional habit." }
      },
      {
        pitfall: { uz: "`random` haqiqiy tasodifiy emas — u \"psevdo-tasodifiy\". Parol yoki xavfsizlik uchun `secrets` modulini ishlat, `random` esa o'yin va simulyatsiya uchun.", en: "`random` is not truly random — it is pseudo-random. Use the `secrets` module for passwords and security; keep `random` for games and simulations." }
      },
      {
        why: { uz: "`from math import sqrt` — nomni to'g'ridan-to'g'ri olib keladi, ya'ni `math.` yozish shart emas. Lekin `from math import *` yozma: qaysi nom qayerdan kelganini bilib bo'lmay qoladi va nomlar to'qnashadi.", en: "`from math import sqrt` brings the name in directly, so you skip the `math.` prefix. But never write `from math import *`: you lose track of where names came from and they collide." }
      },
      {
        analogy: { uz: "O'z modulingni yasash — kodni javonlarga terish. `yordamchi.py` fayl yasab, `import yordamchi` deb chaqirasan. Katta loyihada bu yagona omon qolish usuli.", en: "Making your own module is shelving your code. Create `helpers.py` and call `import helpers`. In a large project it is the only way to survive." }
      }
    ]
  },

  27: {
    notes: [
      {
        analogy: { uz: "Klass — pechene qolipi, obyekt — pechenening o'zi. Qolip bitta, pechene esa istagancha. Har pechenening o'z ta'mi (atributlari) bo'lishi mumkin.", en: "A class is a cookie cutter, an object is a cookie. One cutter, as many cookies as you like — and each cookie can have its own flavour (attributes)." },
        why: { uz: "OOP nima uchun kerak? Chunki dunyo obyektlardan iborat: talaba, mahsulot, buyurtma. Ma'lumot va u bilan bajariladigan amallarni BIRGA saqlash kodni tartibli qiladi. Katta loyihada bu farqni darhol sezasan.", en: "Why OOP? Because the world is made of objects: a student, a product, an order. Keeping data and the operations on it TOGETHER keeps code organised — a difference you feel immediately on a large project." }
      },
      {
        why: { uz: "`__init__` — obyekt yaratilganda AVTOMATIK ishlaydigan metod (konstruktor). Uni o'zing chaqirmaysan: `Talaba(\"Akbar\")` yozganingda Python o'zi chaqiradi.", en: "`__init__` is the method that runs AUTOMATICALLY when an object is created (the constructor). You never call it yourself: writing `Student(\"Akbar\")` makes Python call it for you." },
        pitfall: { uz: "`self` ni birinchi parametr sifatida yozishni unutish — OOP'dagi eng ko'p xato. Har metodda `self` birinchi turishi SHART, aks holda `TypeError` chiqadi.", en: "Forgetting `self` as the first parameter is the number-one OOP mistake. Every method must take `self` first, otherwise you get a `TypeError`." }
      },
      {
        why: { uz: "`self` — \"shu obyektning o'zi\". `self.ism = ism` — \"shu obyektga `ism` atributini yopishtir\". `self` bo'lmasa, o'zgaruvchi metod tugashi bilan yo'qoladi.", en: "`self` means \"this particular object\". `self.name = name` says \"attach a `name` attribute to this object\". Without `self` the variable disappears when the method ends." }
      },
      {
        analogy: { uz: "Atribut — obyektning XUSUSIYATI (ot: ism, yosh, rang). Metod — obyektning HARAKATI (fe'l: yur, hisobla, chiqar). Klass yozayotganda shu ikki savolni ber: \"bu nimalarga ega?\" va \"bu nima qila oladi?\"", en: "An attribute is a PROPERTY (a noun: name, age, colour). A method is an ACTION (a verb: move, calculate, print). When writing a class ask two questions: what does it have, and what can it do?" }
      }
    ]
  },

  28: {
    notes: [
      {
        why: { uz: "Metodlar bir-birini `self` orqali chaqira oladi: `self.boshqa_metod()`. Bu klassni ichkaridan tartibga solishning asosiy usuli — bitta katta metod o'rniga bir nechta kichigi.", en: "Methods can call each other through `self`: `self.other_method()`. That is the main way to organise a class from the inside — several small methods instead of one large one." }
      },
      {
        analogy: { uz: "Inheritance — oiladagi meros. `class It(Hayvon)` — It hayvonning hamma xususiyatini oladi va o'ziniki qo'shadi. \"It — bu hayvon\" deb aytish mumkin bo'lsa, meros to'g'ri ishlatilgan.", en: "Inheritance is a family legacy. `class Dog(Animal)` — Dog takes everything Animal has and adds its own. If you can say \"a Dog IS an Animal\", the inheritance is right." },
        pitfall: { uz: "Meros faqat \"X — bu Y\" bo'lganda ishlatiladi. \"Mashinada dvigatel bor\" — bu meros emas, bu tarkib (composition): `self.dvigatel = Dvigatel()`.", en: "Use inheritance only for \"X IS A Y\". \"A car HAS an engine\" is not inheritance but composition: `self.engine = Engine()`." }
      },
      {
        why: { uz: "`super().__init__()` — ota klassning konstruktorini chaqiradi. Busiz ota klass o'rnatadigan atributlar yaratilmaydi va keyin `AttributeError` chiqadi.", en: "`super().__init__()` calls the parent's constructor. Without it the parent's attributes are never created and you hit an `AttributeError` later." }
      },
      {
        why: { uz: "Override — ota klassdagi metodni bola klassda qayta yozish. Nom bir xil bo'lishi shart; Python avval bola klassda qaraydi, topmasa otaga chiqadi. Bu \"polimorfizm\" ning asosi: bir xil chaqiruv, turli xatti-harakat.", en: "Overriding means rewriting a parent method in the child. The name must match; Python looks in the child first and falls back to the parent. This is the basis of polymorphism: one call, different behaviour." }
      }
    ]
  },

  29: {
    intro: { uz: "Modullar va OOP — professional Python kodining ikki ustuni. Bugun ularni mustahkamlaymiz, chunki ertaga bitiruv kuni.", en: "Modules and OOP are the two pillars of professional Python. Today we solidify them, because tomorrow is graduation day." },
    extraSections: [
      {
        h: { uz: "import ning to'rt shakli", en: "The four forms of import" },
        p: { uz: "To'rttasi ham bir ishni qiladi, lekin nomlar boshqacha ko'rinadi. Birinchi ikkitasi tavsiya etiladi, uchinchisi qulay, to'rtinchisi — deyarli har doim yomon g'oya.", en: "All four do the same job but expose names differently. The first two are recommended, the third is convenient, and the fourth is nearly always a bad idea." },
        code: "# 1) Butun modul — eng tushunarli\nimport math\nprint(math.sqrt(16), math.pi)\n\n# 2) Qisqa nom bilan — uzun nomlar uchun\nimport random as rnd\nprint(rnd.randint(1, 6))\n\n# 3) Aniq nomlarni olib kelish\nfrom math import sqrt, ceil, floor\nprint(sqrt(25), ceil(4.1), floor(4.9))\n\n# 4) ✗ Hammasini — TAVSIYA ETILMAYDI\n# from math import *\n# print(sqrt(9))\n# Muammo: qaysi nom qayerdan kelgani ko'rinmaydi va\n# o'z o'zgaruvching bilan to'qnashishi mumkin.\n\n# Foydali modullar:\nimport datetime\nprint(datetime.date.today())\nimport os\nprint(os.path.exists(\"vazifalar.txt\"))"
      },
      {
        h: { uz: "Klass anatomiyasi — hamma qismi bir joyda", en: "Anatomy of a class — every part in one place" },
        p: { uz: "Quyidagi klassda OOP ning barcha asosiy qismlari bor: konstruktor, atribut, metod, `__str__`, va metodlarning bir-birini chaqirishi. Buni tushunsang, 27–28 kunlar to'liq yopilgan.", en: "The class below contains every basic OOP part: a constructor, attributes, methods, `__str__`, and methods calling one another. Understand it and days 27–28 are fully covered." },
        code: "class Talaba:\n    maktab = \"UzLeeder\"          # klass atributi — hammaga umumiy\n\n    def __init__(self, ism, ballar=None):\n        self.ism = ism                    # obyekt atributi\n        self.ballar = ballar or []        # har obyektga o'ziniki\n\n    def qosh(self, ball):                 # metod\n        self.ballar.append(ball)\n\n    def ortacha(self):\n        if not self.ballar:\n            return 0\n        return sum(self.ballar) / len(self.ballar)\n\n    def baho(self):\n        o = self.ortacha()                # metod metodni chaqiradi\n        return \"A'lo\" if o >= 90 else \"Yaxshi\" if o >= 75 else \"O'rta\"\n\n    def __str__(self):                    # print() shu matnni ko'rsatadi\n        return f\"{self.ism} ({self.maktab}): {self.ortacha():.1f} — {self.baho()}\"\n\na = Talaba(\"Akbar\")\na.qosh(95); a.qosh(88)\nprint(a)                    # Akbar (UzLeeder): 91.5 — A'lo\nprint(a.ballar, a.maktab)",
        notes: {
          why: { uz: "`__str__` — `print(obyekt)` chaqirilganda ishlaydigan metod. Busiz `<__main__.Talaba object at 0x...>` chiqadi. Har klassga `__str__` yozish yaxshi odat.", en: "`__str__` is what `print(object)` uses. Without it you get `<__main__.Student object at 0x...>`. Writing a `__str__` for every class is a good habit." }
        }
      },
      {
        h: { uz: "Inheritance zanjiri va super()", en: "The inheritance chain and super()" },
        p: { uz: "Meros olganda uch narsa sodir bo'ladi: bola ota metodlarini oladi, o'ziniki qo'shadi, kerak bo'lsa ota metodini qayta yozadi (override). `super()` esa otaning versiyasiga murojaat qiladi.", en: "Inheriting does three things: the child gains the parent's methods, adds its own, and may override the parent's. `super()` reaches back to the parent's version." },
        code: "class Hayvon:\n    def __init__(self, ism):\n        self.ism = ism\n\n    def ovoz(self):\n        return \"...\"\n\n    def tanishtir(self):\n        return f\"{self.ism}: {self.ovoz()}\"\n\nclass It(Hayvon):\n    def __init__(self, ism, zot):\n        super().__init__(ism)      # ota konstruktori — SHART\n        self.zot = zot             # o'ziniki\n\n    def ovoz(self):                # override\n        return \"Vov!\"\n\nclass Mushuk(Hayvon):\n    def ovoz(self):\n        return \"Miyov!\"\n\nhayvonlar = [It(\"Rex\", \"husky\"), Mushuk(\"Kitty\"), Hayvon(\"Noma'lum\")]\nfor h in hayvonlar:\n    print(h.tanishtir())\n# Rex: Vov!  /  Kitty: Miyov!  /  Noma'lum: ...\n\nprint(It(\"Bobik\", \"laika\").zot)      # laika\nprint(isinstance(It(\"a\", \"b\"), Hayvon))   # True",
        notes: {
          why: { uz: "Diqqat: `tanishtir()` faqat ota klassda yozilgan, lekin har obyekt uchun BOSHQACHA natija beradi. Sabab: u `self.ovoz()` ni chaqiradi va Python o'sha obyektning haqiqiy klassidagi versiyani topadi. Bu — polimorfizm.", en: "Notice that `introduce()` is defined only in the parent, yet gives a different result per object. It calls `self.speak()`, and Python finds the version on the object's actual class. That is polymorphism." }
        }
      },
      {
        h: { uz: "self nima uchun kerak — bir marta va butunlay", en: "Why self exists — once and for all" },
        p: { uz: "`self` yangi boshlovchilarni eng ko'p chalkashtiradigan narsa. Sirri oddiy: `a.qosh(5)` aslida `Talaba.qosh(a, 5)` degani. Ya'ni `self` — qaysi obyekt bilan ishlayotganingni bildiruvchi birinchi argument.", en: "`self` confuses beginners more than anything else. The secret is simple: `a.add(5)` is really `Student.add(a, 5)`. So `self` is just the first argument saying which object you are working with." },
        code: "class Hisoblagich:\n    def __init__(self):\n        self.qiymat = 0\n\n    def oshir(self, n=1):\n        self.qiymat += n\n        return self.qiymat\n\na = Hisoblagich()\nb = Hisoblagich()\n\na.oshir(5)\na.oshir(3)\nb.oshir(100)\n\nprint(a.qiymat, b.qiymat)     # 8 100 — har obyekt o'ziniki\n\n# Bu ikkalasi AYNAN bir xil:\nprint(a.oshir(1))                  # 9\nprint(Hisoblagich.oshir(a, 1))     # 10\n\n# ✗ self yozmasang:\n# class Xato:\n#     def metod():        # self yo'q\n#         pass\n# Xato().metod()          # TypeError: takes 0 positional arguments but 1 was given"
      }
    ]
  },

  30: {
    intro: { uz: "30 kun tugadi. Bugun yangi narsa o'rganmaymiz — o'rganganingni BIR TIZIMGA solamiz va keyingi qadamni aniqlaymiz. Bu kunning maqsadi: \"men Python bilaman\" deb ishonch bilan ayta olish.", en: "Thirty days are done. Today we learn nothing new — we bring what you know into ONE system and define the next step. The goal: to be able to say \"I know Python\" with confidence." },
    extraSections: [
      {
        h: { uz: "30 kunlik xarita — bir sahifada", en: "Thirty days — on one page" },
        p: { uz: "Butun kursning sintaksisi quyida. Buni chop etib, stol ustiga qo'y. Har qatorni o'qib, \"bu nima qilishini bilamanmi?\" deb so'ra — bilmaganingni o'sha kunga qaytib ko'r.", en: "The whole course's syntax is below. Print it and keep it on your desk. Read each line and ask \"do I know what this does?\" — go back to that day for anything you don't." },
        code: "# --- Hafta 1: asoslar ---\nx = 5; s = \"matn\"; f = 1.5; b = True\nprint(type(x), int(\"20\"), float(\"1.5\"), str(20))\nprint(7 // 2, 7 % 2, 2 ** 3, 7 / 2)\nism = input(\"Ism: \")\nprint(f\"{ism}: {3.14159:.2f}\")\n\n# --- Hafta 2: boshqaruv va strukturalar ---\nif x > 3 and s: pass\nelif x == 3: pass\nelse: pass\n\nlst = [1, 2, 3]; lst.append(4); print(lst[-1], lst[1:3], sorted(lst))\ntpl = (1, 2); st = {1, 2, 2}; d = {\"a\": 1}\nprint(d.get(\"b\", 0), list(d.items()))\n\nfor i in range(3): pass\nwhile x > 0: x -= 1\n\n# --- Hafta 3: funksiya va string ---\ndef f2(a, b=2, *args, **kw):\n    return a + b\n\nt = \"Salom Dunyo\"\nprint(t.upper(), t.split(), \"-\".join([\"a\", \"b\"]), t[::-1])\nprint([n * 2 for n in range(4) if n % 2 == 0])\n\n# --- Hafta 4: ilg'or ---\ntry:\n    v = int(\"x\")\nexcept ValueError as e:\n    v = 0\nfinally:\n    pass\n\nwith open(\"a.txt\", \"a\", encoding=\"utf-8\") as fh:\n    fh.write(\"qator\\n\")\n\nimport math, random\nprint(math.sqrt(9), random.randint(1, 6))\n\nclass A:\n    def __init__(self, n): self.n = n\n    def show(self): return self.n\nclass B(A):\n    def show(self): return super().show() * 2\nprint(B(5).show())   # 10"
      },
      {
        h: { uz: "Sertifikat imtihonida uchraydigan 10 savol turi", en: "Ten question types you will meet in the exam" },
        p: { uz: "PCEP, freeCodeCamp yoki DataCamp Associate — uchalasida ham savollar shu o'nta turdan chiqadi. Har birini bilsang, imtihon kutilmagan bo'lmaydi.", en: "PCEP, freeCodeCamp or the DataCamp Associate — all three draw from these ten patterns. Know each one and the exam holds no surprises." },
        code: "# 1) Natijani bashorat qil\nprint(7 // 2, 7 % 2)            # 3 1\n\n# 2) Tur aniqlash\nprint(type(10 / 2))             # <class 'float'>\n\n# 3) Slicing\nprint([1,2,3,4,5][1:4:2])       # [2, 4]\n\n# 4) Mutable / immutable\nt = (1, 2)                      # t[0] = 9 -> TypeError\n\n# 5) Xato turini aniqlash\n# int(\"abc\")  -> ValueError    |  [1][3] -> IndexError\n\n# 6) Scope\nz = 1\ndef g():\n    z = 2                       # local\ng(); print(z)                   # 1\n\n# 7) Default argument tartibi\n# def h(a=1, b) -> SyntaxError\n\n# 8) Loop natijasi\nprint([i for i in range(1, 10, 3)])   # [1, 4, 7]\n\n# 9) String metodi aslini o'zgartirmaydi\nw = \"abc\"; w.upper(); print(w)  # abc\n\n# 10) OOP: override va super()\nclass P:\n    def m(self): return \"P\"\nclass C(P):\n    def m(self): return super().m() + \"C\"\nprint(C().m())                  # PC",
        notes: {
          tip: { uz: "Imtihonga tayyorgarlik maslahati: savolni o'qigach, javobni KO'RMASDAN natijani o'zing bashorat qil, keyin variantlarga qara. Bu usul yodlashni emas, tushunishni tekshiradi.", en: "Exam tip: after reading the question, predict the answer BEFORE looking at the options, then check. This tests understanding rather than recall." }
        }
      },
      {
        h: { uz: "Portfolio loyihasi — nima yozish kerak", en: "Your portfolio project — what to build" },
        p: { uz: "Ish beruvchi sertifikatga emas, ISHLAYDIGAN kodga qaraydi. Bitta yaxshi loyiha o'nta sertifikatdan qimmatliroq. Quyida shu 30 kunda o'rganilgan hamma narsani ishlatadigan loyiha skeleti.", en: "Employers look at WORKING code, not certificates. One good project beats ten certificates. Below is a project skeleton that uses everything from these thirty days." },
        code: "\"\"\"Shaxsiy xarajatlar hisobchisi — portfolio loyihasi.\nIshlatadi: OOP, fayl, xato, dict, comprehension, f-string.\"\"\"\n\nclass Hisobchi:\n    def __init__(self, fayl=\"xarajatlar.txt\"):\n        self.fayl = fayl\n        self.yozuvlar = self._yukla()\n\n    def _yukla(self):\n        try:\n            with open(self.fayl, encoding=\"utf-8\") as f:\n                return [q.strip().split(\",\") for q in f if q.strip()]\n        except FileNotFoundError:\n            return []\n\n    def qosh(self, kategoriya, summa):\n        self.yozuvlar.append([kategoriya, str(summa)])\n        with open(self.fayl, \"a\", encoding=\"utf-8\") as f:\n            f.write(f\"{kategoriya},{summa}\\n\")\n\n    def jami(self):\n        return sum(float(s) for _, s in self.yozuvlar)\n\n    def kategoriya_boyicha(self):\n        natija = {}\n        for k, s in self.yozuvlar:\n            natija[k] = natija.get(k, 0) + float(s)\n        return natija\n\n    def hisobot(self):\n        print(f\"{'Kategoriya':<14}{'Summa':>12}\")\n        for k, s in sorted(self.kategoriya_boyicha().items(),\n                           key=lambda p: p[1], reverse=True):\n            print(f\"{k:<14}{s:>12,.0f}\")\n        print(f\"{'JAMI':<14}{self.jami():>12,.0f}\")\n\nh = Hisobchi()\nh.qosh(\"Ovqat\", 45000)\nh.qosh(\"Transport\", 12000)\nh.qosh(\"Ovqat\", 30000)\nh.hisobot()",
        notes: {
          tip: { uz: "GitHub'ga joylashda uchta narsa bo'lsin: `README.md` (loyiha nima qiladi va qanday ishga tushiriladi), toza kod (izohlar bilan), va bitta ekran surati. Shu uchtasi bilan loyiha \"jiddiy\" ko'rinadi.", en: "When you publish to GitHub, include three things: a `README.md` (what it does and how to run it), clean commented code, and one screenshot. Those three make a project look serious." }
        }
      },
      {
        h: { uz: "Keyingi qadam — qayerdan davom etish", en: "The next step — where to continue" },
        p: { uz: "Python asoslari tugadi, lekin yo'l endi boshlandi. Keyingi olti oy uchun aniq tartib quyida. Har bosqichni tugatib, keyingisiga o't — sakrash foyda bermaydi.", en: "The Python foundation is done, but the road is just starting. Here is a concrete order for the next six months. Finish each stage before the next — skipping does not help." },
        code: "# 1) DARHOL (1-2 hafta)\n#    • Portfolio loyihangni GitHub'ga joyla\n#    • PCEP yoki DataCamp Associate imtihoniga tayyorlan\n#    • Shu platformadagi \"Reja\" bo'limini och\n\n# 2) KEYINGI 2 OY — data uchun Python\n#    pip install numpy pandas\nimport numpy as np\nimport pandas as pd\n#    df = pd.read_csv(\"data.csv\")\n#    df.head(); df.describe(); df.groupby(\"col\").mean()\n\n# 3) KEYINGI 3-4 OY — API va AI\n#    pip install requests openai\nimport requests\n#    r = requests.get(\"https://api.example.com/data\")\n#    ma'lumot = r.json()\n#    Keyin: OpenAI API, RAG, LangChain\n\n# 4) DOIMIY\n#    • Har hafta kamida bitta kichik loyiha\n#    • Ingliz tili (barcha AI materiali inglizcha)\n#    • Boshqalarning kodini o'qish — GitHub'da\n\nprint(\"Tabriklaymiz! 30 kun tugadi. Yo'l davom etadi.\")",
        notes: {
          tip: { uz: "\"Reja\" va \"Karyera\" bo'limlarini ochib ko'r — u yerda keyingi 5 yillik yo'l, sertifikatlar va kompaniyalar batafsil yozilgan.", en: "Open the \"Plan\" and \"Career\" sections — they lay out the next five years, the certificates and the companies in detail." }
        }
      }
    ],
    close: { uz: "30 kun oldin `print(\"Salom\")` yozgan eding. Bugun klass, fayl, xato va comprehension bilan ishlaysan. Bu — kichik yutuq emas. Endi eng muhimi: to'xtama. Har kuni 30 daqiqa — bir yildan keyin seni tanib bo'lmaydi.", en: "Thirty days ago you were writing `print(\"Hello\")`. Today you work with classes, files, exceptions and comprehensions. That is no small achievement. Now the most important part: don't stop. Thirty minutes a day, and in a year you will be unrecognisable." }
  }
};
