/* ==========================================================================
   EXPLAIN — test savollariga "nega shunday" izohlari
   --------------------------------------------------------------------------
   Har kun uchun 10 ta izoh, savollar tartibida. Izoh javob berilgandan KEYIN
   ochiladi (js/quiz.js) va "Xatolar daftari"da ham ko'rinadi.

   Nega kerak? Chunki to'g'ri javobni ko'rish o'rgatmaydi — SABABINI bilish
   o'rgatadi. Xato qilgan odam "demak B ekan" deb yodlab qo'ymasin, balki
   qoidani tushunib ketsin.

   Format: EXPLAIN[kun][savol_indeksi] = { uz, en }
   `backtick` ichidagi matn kod sifatida chiroyli chiqadi.
   ========================================================================== */

window.EXPLAIN = {

  /* ---------------- HAFTA 1 ---------------- */

  1: [
    { uz: "O'zgaruvchi nomi harf yoki `_` bilan boshlanadi, ichida bo'shliq va `-` bo'lmaydi. `2age` raqamdan boshlangan, `open price` da bo'shliq, `price-2` da minus — uchalasi ham xato.", en: "A name must start with a letter or `_` and contain no spaces or `-`. `2age` starts with a digit, `open price` has a space, `price-2` has a minus — all invalid." },
    { uz: "`3.14` da nuqta bor, ya'ni kasr son — `float`. `type()` esa har doim `<class '...'>` ko'rinishida qaytaradi.", en: "`3.14` has a decimal point, so it is a `float`. And `type()` always answers in the form `<class '...'>`." },
    { uz: "Qo'shtirnoq ichidagisi — matn. Matnlar uchun `+` qo'shmaydi, YOPISHTIRADI: `\"2\" + \"2\"` → `\"22\"`. Sonlar kerak bo'lsa `int()` qil.", en: "Anything in quotes is text. For text, `+` does not add but joins: `\"2\" + \"2\"` → `\"22\"`. Convert with `int()` if you need numbers." },
    { uz: "`input()` DOIM `str` qaytaradi — foydalanuvchi 25 yozsa ham `\"25\"` bo'ladi. Bu qoidada istisno yo'q.", en: "`input()` ALWAYS returns a `str` — even if the user types 25 you get `\"25\"`. There is no exception to this rule." },
    { uz: "`True` va `False` — `bool` turi. Ular faqat ikki qiymatga ega va shartlar natijasi shu turda bo'ladi.", en: "`True` and `False` are the `bool` type. It has only two values, and every comparison produces one of them." },
    { uz: "`f` prefiksi bor, shuning uchun `{ism}` o'z qiymatiga almashadi. `f` bo'lmaganda jonli matn — `Hi {ism}!` — chiqardi.", en: "The `f` prefix is present, so `{name}` is replaced by its value. Without the `f` it would print literally as `Hi {name}!`." },
    { uz: "`int()` matnni butun songa aylantiradi. `float()` kasr beradi, `str()` teskarisini qiladi, `type()` esa umuman aylantirmaydi.", en: "`int()` converts text to a whole number. `float()` gives a decimal, `str()` does the reverse, and `type()` converts nothing at all." },
    { uz: "`yosh` — string, `5` — son. `str + int` `TypeError` beradi. To'g'risi: `int(yosh) + 5`.", en: "`age` is a string and `5` is a number, so `str + int` raises `TypeError`. The fix: `int(age) + 5`." },
    { uz: "`19.99` — tirnoqsiz kasr son, ya'ni `float`. `\"19.99\"` esa tirnoq ichida bo'lgani uchun matn.", en: "`19.99` is a decimal without quotes, so it is a `float`. `\"19.99\"` is in quotes and therefore text." },
    { uz: "`=` — qiymat SOLADI (o'ngdagini chapdagiga). Tekshirish uchun `==` ishlatiladi.", en: "`=` ASSIGNS (right side into left). To compare, use `==`." }
  ],

  2: [
    { uz: "`//` — butun bo'lish: 7/2 = 3.5, butun qismi 3. Kasr tashlab yuboriladi, yaxlitlanmaydi.", en: "`//` is floor division: 7/2 = 3.5, whole part 3. The fraction is dropped, not rounded." },
    { uz: "`%` — qoldiq: 7 ichida 3 ikki marta bor (6), qolgani 1.", en: "`%` is the remainder: 3 fits into 7 twice (6), leaving 1." },
    { uz: "`/` HAR DOIM `float` qaytaradi — natija butun chiqsa ham `5.0`. Butun kerak bo'lsa `//` ishlat.", en: "`/` ALWAYS returns a `float` — even when the result is whole you get `5.0`. Use `//` for a whole number." },
    { uz: "`**` — daraja: 2×2×2×2 = 16. `*` bilan adashtirma: `2 * 4` = 8.", en: "`**` is exponentiation: 2×2×2×2 = 16. Don't confuse it with `*`: `2 * 4` is 8." },
    { uz: "Taqqoslash natijasi son emas — `bool` (`True`/`False`). Shuning uchun uni to'g'ridan-to'g'ri `if` ga berish mumkin.", en: "A comparison produces a `bool` (`True`/`False`), not a number. That is why it can go straight into an `if`." },
    { uz: "`and` ikkala taraf ham `True` bo'lishini talab qiladi. Bittasi `False` bo'lsa — natija `False`.", en: "`and` requires both sides to be `True`. If either is `False`, the result is `False`." },
    { uz: "Avval qavs ichi: `3 > 5` → `False`. Keyin `not False` → `True`.", en: "Brackets first: `3 > 5` → `False`. Then `not False` → `True`." },
    { uz: "Ko'paytirish qo'shishdan oldin bajariladi: `3 * 4 = 12`, keyin `2 + 12 = 14`. Aniqlik uchun qavs qo'y.", en: "Multiplication runs before addition: `3 * 4 = 12`, then `2 + 12 = 14`. Use brackets to be explicit." },
    { uz: "`=` qiymat soladi (`x = 5`), `==` teng-emasligini tekshiradi (`x == 5`). Bu farq boshlang'ich xatolarning yarmi.", en: "`=` assigns (`x = 5`), `==` tests equality (`x == 5`). This distinction accounts for half of all beginner bugs." },
    { uz: "Python zanjirli taqqoslashni tushunadi: `1 < 5 < 10` — bu `1 < 5 and 5 < 10`, ya'ni `True`. Ko'p tillarda bunday yozib bo'lmaydi.", en: "Python understands chained comparisons: `1 < 5 < 10` means `1 < 5 and 5 < 10`, so `True`. Most languages do not allow this." }
  ],

  3: [
    { uz: "Istisnosiz qoida: `input()` har doim `str`. Sonlar bilan ishlash uchun `int()` yoki `float()` shart.", en: "A rule without exceptions: `input()` always gives a `str`. You must use `int()` or `float()` to work with numbers." },
    { uz: "`int('20')` matnni songa aylantiradi va tirnoqsiz `20` beradi. Endi u bilan arifmetika qilish mumkin.", en: "`int('20')` turns text into a number and yields `20` without quotes. Now you can do arithmetic with it." },
    { uz: "`int()` yaxlitlamaydi — KESADI. `3.9` → `3`. Yaxlitlash uchun `round(3.9)` → `4`.", en: "`int()` does not round — it truncates. `3.9` → `3`. Use `round(3.9)` → `4` to round." },
    { uz: "`'abc'` da son yo'q, shuning uchun `ValueError`. 23-kunda buni `try/except` bilan ushlashni o'rganamiz.", en: "There is no number in `'abc'`, hence `ValueError`. On day 23 we learn to catch it with `try/except`." },
    { uz: "`sep` — argumentlar orasidagi ajratgich. Standart `\" \"` (bo'shliq), bu yerda `\"-\"` ga o'zgartirilgan.", en: "`sep` is the separator between arguments. The default is `\" \"`; here it was changed to `\"-\"`." },
    { uz: "`end=\"\"` yangi qatorga o'tishni bekor qiladi — keyingi `print` xuddi shu qatordan davom etadi.", en: "`end=\"\"` cancels the line break, so the next `print` continues on the same line." },
    { uz: "Python'da 0 — \"bo'sh/yo'q\" degani, ya'ni `False`. Noldan boshqa har qanday son `True`.", en: "In Python 0 means \"empty/none\", i.e. `False`. Any non-zero number is `True`." },
    { uz: "Bo'sh string, bo'sh list, bo'sh dict — hammasi `False`. Shuning uchun `if matn:` — \"matn bo'sh emasmi\" degani.", en: "An empty string, list or dict is `False`. That is why `if text:` means \"is the text non-empty?\"." },
    { uz: "`input()` string qaytargani uchun `yosh + 1` — `str + int` bo'lib `TypeError` beradi. `int(yosh) + 1` yoz.", en: "`input()` returns a string, so `age + 1` is `str + int` and raises `TypeError`. Write `int(age) + 1`." },
    { uz: "f-string ichida IFODA hisoblanadi: `2*3` bajarilib, `6` qo'yiladi. Faqat o'zgaruvchi emas, har qanday ifoda bo'lishi mumkin.", en: "An f-string evaluates the EXPRESSION inside: `2*3` runs and `6` is inserted. It need not be just a variable." }
  ],

  4: [
    { uz: "`//` butun bo'lish: 7/2 = 3.5 → butun qismi 3.", en: "`//` is floor division: 7/2 = 3.5 → whole part 3." },
    { uz: "`input()` har doim `str`. Bu qoidani yodda tut — u 30 kun davomida o'zgarmaydi.", en: "`input()` always returns `str`. Remember it — the rule does not change over the thirty days." },
    { uz: "`int('20')` → `20` (tirnoqsiz son). Endi arifmetikaga tayyor.", en: "`int('20')` → `20`, a real number without quotes, ready for arithmetic." },
    { uz: "`**` — daraja: 2³ = 2×2×2 = 8.", en: "`**` is exponentiation: 2³ = 2×2×2 = 8." },
    { uz: "`%` — qoldiq: 10 ichida 3 uch marta (9), qolgani 1.", en: "`%` is the remainder: 3 fits into 10 three times (9), leaving 1." },
    { uz: "Taqqoslash `bool` qaytaradi. `5 == 5` → `True`, uning turi `bool`.", en: "A comparison returns a `bool`. `5 == 5` is `True`, whose type is `bool`." },
    { uz: "`int()` kasrni kesadi: `3.9` → `3`. Yaxlitlash `round()` ning ishi.", en: "`int()` truncates the fraction: `3.9` → `3`. Rounding is `round()`'s job." },
    { uz: "f-string ifodani hisoblaydi: `2+3` → `5`.", en: "An f-string evaluates the expression: `2+3` → `5`." },
    { uz: "`/` istisnosiz `float` qaytaradi — `10 / 2` ham `5.0`.", en: "`/` returns a `float` without exception — even `10 / 2` gives `5.0`." },
    { uz: "`bool(0)` → `False`. Nol \"bo'sh\" hisoblanadi; boshqa sonlar `True`.", en: "`bool(0)` → `False`. Zero counts as \"empty\"; other numbers are `True`." }
  ],

  /* ---------------- HAFTA 2 ---------------- */

  5: [
    { uz: "`=` qiymat soladi, `==` tenglikni tekshiradi. `if x = 5:` — sintaksis xatosi, Python buni ataylab taqiqlagan.", en: "`=` assigns, `==` compares. `if x = 5:` is a syntax error — Python forbids it deliberately." },
    { uz: "`!=` — \"teng emas\". 20 va 20 teng, shuning uchun \"teng emas\" `False`.", en: "`!=` means \"not equal\". 20 and 20 are equal, so \"not equal\" is `False`." },
    { uz: "15 >= 18 emas, shuning uchun `if` bloki tashlab ketiladi va `else` ishlaydi.", en: "15 is not >= 18, so the `if` block is skipped and the `else` runs." },
    { uz: "85 >= 90 emas, lekin 85 >= 70 — shuning uchun ikkinchi shart ishlaydi. `elif` zanjirida faqat BITTA tarmoq bajariladi.", en: "85 is not >= 90 but is >= 70, so the second branch runs. Only ONE branch of an `elif` chain executes." },
    { uz: "Shartlar yuqoridan pastga tekshiriladi. `>= 60` yuqorida tursa, 95 ham unga tushib ketadi va `>= 90` ga yetib bormaydi. Eng tor shart eng yuqorida bo'lishi kerak.", en: "Conditions are checked top-down. If `>= 60` comes first, 95 matches it and never reaches `>= 90`. The narrowest condition must come first." },
    { uz: "`and` ikkalasini talab qiladi; `False` bo'lgani uchun natija `False`.", en: "`and` requires both; one is `False`, so the result is `False`." },
    { uz: "`or` kamida bittasini talab qiladi; `True` bori bor, shuning uchun `True`.", en: "`or` needs at least one; there is a `True`, so the result is `True`." },
    { uz: "`and` — ikkala shart ham bajarilishi shart. Bittasi yetarli bo'lsa `or` ishlatilardi.", en: "`and` means both conditions must hold. If one were enough, you would use `or`." },
    { uz: "`not` qiymatni teskarisiga o'giradi: `not True` → `False`.", en: "`not` flips the value: `not True` → `False`." },
    { uz: "`age > 18` — taqqoslash, natijasi `True`/`False`, ya'ni turi `bool`.", en: "`age > 18` is a comparison; its result is `True`/`False`, so the type is `bool`." }
  ],

  6: [
    { uz: "Index 0 dan boshlanadi, chunki u \"boshidan qancha qadam\" degani. Birinchi element — 0 qadam.", en: "Indexing starts at 0 because an index counts steps from the start. The first element is zero steps away." },
    { uz: "Manfiy index oxiridan sanaydi: `[-1]` — oxirgisi, `[-2]` — undan oldingisi. Uzunlikni bilmasdan oxirgini olishning eng qisqa yo'li.", en: "A negative index counts from the end: `[-1]` is last, `[-2]` second-to-last. The shortest way to reach the end without knowing the length." },
    { uz: "`len()` elementlar SONINI beradi (indekslarni emas). 4 element — 4, lekin oxirgi index 3.", en: "`len()` gives the COUNT of elements, not indexes. Four elements → 4, but the last index is 3." },
    { uz: "Slicingda `stop` kirmaydi: `[1:3]` — 1 va 2 indekslar, ya'ni `[20, 30]`.", en: "In slicing the `stop` is excluded: `[1:3]` gives indexes 1 and 2, i.e. `[20, 30]`." },
    { uz: "`append()` oxiriga qo'shadi. `insert()` esa berilgan o'ringa qo'yadi, `add()` — setning metodi.", en: "`append()` adds at the end. `insert()` places at a given position, and `add()` belongs to sets." },
    { uz: "`m[1]` — ikkinchi element (index 1), ya'ni `\"b\"`. U `\"x\"` ga almashadi.", en: "`m[1]` is the second element (index 1), i.e. `\"b\"`. It becomes `\"x\"`." },
    { uz: "`[]` — list: o'zgartirsa bo'ladi. `()` — tuple: o'zgarmas. Shakl o'xshash, xatti-harakat boshqa.", en: "`[]` is a list — mutable. `()` is a tuple — immutable. Similar look, different behaviour." },
    { uz: "Tuple o'zgarmas, shuning uchun unda `append` degan metod umuman yo'q — `AttributeError`.", en: "A tuple is immutable, so it has no `append` method at all — `AttributeError`." },
    { uz: "O'rtacha = yig'indi ÷ soni, ya'ni `sum(lst) / len(lst)`. Bo'sh listda `len` 0 bo'lishini unutma.", en: "Average = sum ÷ count, i.e. `sum(lst) / len(lst)`. Remember that `len` is 0 for an empty list." },
    { uz: "Uchinchi son — qadam: `[::2]` bittadan tashlab oladi, ya'ni 0, 2, 4-indekslar.", en: "The third number is the step: `[::2]` takes every other item — indexes 0, 2, 4." }
  ],

  7: [
    { uz: "`=` soladi, `==` tekshiradi. Shartlarda faqat `==` ishlatiladi.", en: "`=` assigns, `==` compares. Only `==` belongs in a condition." },
    { uz: "`[-1]` oxirgi elementni beradi — `30`.", en: "`[-1]` gives the last element — `30`." },
    { uz: "`[1:3]` — 1 va 2-indekslar, `stop` (3) kirmaydi → `[2, 3]`.", en: "`[1:3]` takes indexes 1 and 2; the `stop` (3) is excluded → `[2, 3]`." },
    { uz: "`and` da bitta `False` yetadi — natija `False`.", en: "One `False` is enough for `and` — the result is `False`." },
    { uz: "`append()` — listning oxiriga qo'shish metodi.", en: "`append()` is the method that adds to the end of a list." },
    { uz: "`elif` — \"else if\": oldingisi bajarilmasa, yangi shartni tekshiradi. Ko'p variantli qarorlar uchun.", en: "`elif` is \"else if\": if the previous branch failed, test a new condition. For multi-way decisions." },
    { uz: "`sum([1,2,3])` = 6, `len` = 3, `6 / 3` = `2.0`. `/` har doim float bergani uchun `2` emas, `2.0`.", en: "`sum([1,2,3])` is 6, `len` is 3, and `6 / 3` is `2.0` — a float, because `/` always returns one." },
    { uz: "`sort()` listni JOYIDA tartiblaydi va `None` qaytaradi. Yangi list kerak bo'lsa `sorted()`.", en: "`sort()` orders the list IN PLACE and returns `None`. Use `sorted()` if you want a new list." },
    { uz: "`not` teskarisiga o'giradi: `not True` → `False`.", en: "`not` flips it: `not True` → `False`." },
    { uz: "Ha, index 0 dan. Shuning uchun oxirgi index — `len(lst) - 1`.", en: "Yes, indexing starts at 0 — which is why the last index is `len(lst) - 1`." }
  ],

  8: [
    { uz: "`range(3)` — 0, 1, 2. Nol dan boshlanadi va 3 KIRMAYDI.", en: "`range(3)` yields 0, 1, 2. It starts at zero and 3 is EXCLUDED." },
    { uz: "`for` uchun ikkalasi ham shart: qator oxirida `:` va keyingi qatorda ichkariga surish. Biri yo'q bo'lsa — `SyntaxError` yoki `IndentationError`.", en: "A `for` needs both: a `:` at the end of the line and an indented body. Miss either and you get a `SyntaxError` or `IndentationError`." },
    { uz: "`range(1, 5)` — 1 dan boshlanadi, 5 kirmaydi: 1, 2, 3, 4.", en: "`range(1, 5)` starts at 1 and excludes 5: 1, 2, 3, 4." },
    { uz: "`son` hech qachon o'zgarmaydi, shart har doim `True` — cheksiz loop. Ichida `son += 1` bo'lishi shart.", en: "`num` never changes, so the condition stays `True` forever — an infinite loop. It needs `num += 1` inside." },
    { uz: "`break` loopdan butunlay chiqadi, shuning uchun `i == 3` bo'lganda 3 chop etilmaydi va loop tugaydi: 0 1 2.", en: "`break` exits the loop entirely, so when `i == 3` nothing is printed and the loop ends: 0 1 2." },
    { uz: "`continue` faqat joriy aylanishni tashlaydi, loop davom etadi — shuning uchun 2 tushib qoladi: 0 1 3 4.", en: "`continue` skips only the current pass and the loop continues — so 2 is missing: 0 1 3 4." },
    { uz: "Yig'ish naqshi: `total` 0 dan boshlanadi va har elementga oshadi → 10+20+30 = 60.", en: "The accumulator pattern: `total` starts at 0 and grows by each element → 10+20+30 = 60." },
    { uz: "Uchinchi argument — qadam: 0 dan 10 gacha ikkitadan → 0 2 4 6 8 (10 kirmaydi).", en: "The third argument is the step: from 0 to 10 in twos → 0 2 4 6 8 (10 excluded)." },
    { uz: "`break` loopni to'xtatadi, `continue` faqat bitta aylanishni o'tkazadi. Ikkalasi ham qolgan kodni tashlaydi, lekin `break` qaytmaydi.", en: "`break` stops the loop; `continue` only skips one pass. Both skip the remaining body, but `break` never returns." },
    { uz: "`sum` — Python'ning o'z funksiyasi. Uni o'zgaruvchi nomi qilsang, keyin `sum([1,2])` chaqirib bo'lmaydi. Shu sabab `list`, `str`, `dict` ham nom sifatida ishlatilmaydi.", en: "`sum` is a built-in function. Using it as a variable name means you can no longer call `sum([1,2])`. The same applies to `list`, `str` and `dict`." }
  ],

  9: [
    { uz: "`while` — shart `True` bo'lib turgan davomida aylanadi. Necha marta ekani oldindan noma'lum bo'lishi mumkin.", en: "`while` loops as long as the condition stays `True`. The number of repetitions may be unknown in advance." },
    { uz: "Hisoblagich oshmasa shart hech qachon `False` bo'lmaydi — dastur qotib qoladi. Chiqish uchun Ctrl+C.", en: "If the counter never grows, the condition never turns `False` and the program hangs. Press Ctrl+C to escape." },
    { uz: "`break` loopdan chiqadi va undan keyingi kodga o'tadi. Qolgan aylanishlar bajarilmaydi.", en: "`break` leaves the loop and jumps to the code after it. The remaining passes never happen." },
    { uz: "`continue` joriy aylanishning qolgan qismini tashlab, darhol keyingisini boshlaydi.", en: "`continue` abandons the rest of the current pass and starts the next one immediately." },
    { uz: "`i == 2` bo'lganda `continue` ishlaydi va `print` tashlab ketiladi: 0 1 3 4.", en: "When `i == 2` the `continue` fires and the `print` is skipped: 0 1 3 4." },
    { uz: "`i == 2` da `break` — loop butunlay to'xtaydi. Faqat 0 va 1 chiqadi.", en: "At `i == 2` the `break` stops the loop entirely, so only 0 and 1 appear." },
    { uz: "`while True:` sharti hech qachon o'zgarmaydi — chiqishning yagona yo'li `break` (yoki `return`).", en: "The condition of `while True:` never changes — the only way out is a `break` (or a `return`)." },
    { uz: "`else` loop NORMAL tugaganda ishlaydi. `break` bilan chiqilsa — ishlamaydi. \"Qidirdim, topmadim\" holatiga qulay.", en: "The `else` runs when the loop finishes NORMALLY. If a `break` fired, it is skipped. Handy for \"searched, found nothing\"." },
    { uz: "3, 2, 1 chop etiladi; `n` 0 bo'lganda `n > 0` `False` bo'lib loop tugaydi. Oxirgi chiqarilgani — 1.", en: "It prints 3, 2, 1; when `n` reaches 0 the condition `n > 0` fails and the loop ends. The last printed value is 1." },
    { uz: "`break` — chiqish eshigi, `continue` — o'tkazib yuborish. Aralashtirmaslik uchun: break = tugadi, continue = keyingisi.", en: "`break` is the exit door, `continue` is a skip. Remember: break = done, continue = next." }
  ],

  10: [
    { uz: "`range(3)` — 0 1 2. Oxiri hech qachon kirmaydi.", en: "`range(3)` gives 0 1 2. The end value is never included." },
    { uz: "Shartga ta'sir qiladigan o'zgarish bo'lmasa — cheksiz loop.", en: "Without a change that affects the condition, the loop runs forever." },
    { uz: "`break` — loopdan butunlay chiqish.", en: "`break` exits the loop completely." },
    { uz: "`continue` joriy aylanishni tugatib, keyingisiga o'tadi.", en: "`continue` ends the current pass and moves to the next." },
    { uz: "`range(1,5)` — 1 dan boshlab 4 gacha: 1 2 3 4.", en: "`range(1,5)` runs from 1 to 4: 1 2 3 4." },
    { uz: "`range(10)` — 0 dan 9 gacha, ya'ni 10 ta qiymat. Loop 10 marta aylanadi.", en: "`range(10)` covers 0 to 9 — ten values, so the loop runs ten times." },
    { uz: "`while True` sharti abadiy `True`; `break` bo'lmasa hech qachon to'xtamaydi.", en: "The condition of `while True` is eternally true; without a `break` it never stops." },
    { uz: "2 + 4 + 6 = 12. Yig'ish naqshi: `total` loopdan OLDIN 0 ga tenglanadi.", en: "2 + 4 + 6 = 12. The accumulator pattern: `total` is set to 0 BEFORE the loop." },
    { uz: "`range(0,10,2)` — 0 dan 10 gacha ikkitadan: 0 2 4 6 8. 10 kirmaydi.", en: "`range(0,10,2)` steps by two from 0 up to 10: 0 2 4 6 8. 10 is excluded." },
    { uz: "`break` loopni tark etadi, `continue` esa faqat bitta aylanishni o'tkazadi.", en: "`break` leaves the loop; `continue` merely skips one pass." }
  ],

  11: [
    { uz: "Tuple — oddiy qavs `()`. `[]` list, `{}` set yoki dict.", en: "A tuple uses round brackets `()`. `[]` is a list, `{}` is a set or dict." },
    { uz: "Tuple O'ZGARMAS — elementini almashtirmoqchi bo'lsang `TypeError`. Butun tuple'ni yangisi bilan almashtirish esa mumkin.", en: "A tuple is IMMUTABLE — assigning to an element raises `TypeError`. Rebinding the whole tuple is fine." },
    { uz: "Vergul tuple yasaydi, qavs emas. `(5)` — oddiy son, `(5,)` — bir elementli tuple.", en: "The comma makes a tuple, not the brackets. `(5)` is just a number; `(5,)` is a one-element tuple." },
    { uz: "Unpacking chapdagi nomlarga o'ngdagi qiymatlarni tartib bilan taqsimlaydi: `a=1`, `b=2`.", en: "Unpacking distributes the right-hand values to the left-hand names in order: `a=1`, `b=2`." },
    { uz: "Set figurali qavs `{}` bilan yoziladi (bo'sh set esa `set()`).", en: "A set uses curly braces `{}` — though an empty set is `set()`." },
    { uz: "Set takrorlarni avtomatik tashlaydi: ikkita `2` bittaga aylanadi.", en: "A set drops duplicates automatically: the two `2`s become one." },
    { uz: "Set TARTIBSIZ — elementlar joyi belgilanmagan, shuning uchun `set[0]` ishlamaydi. Kerak bo'lsa `list()` ga aylantir.", en: "A set is UNORDERED — positions are undefined, so `set[0]` does not work. Convert with `list()` if you need order." },
    { uz: "`set()` takrorlarni tozalaydi, `list()` esa natijani listga qaytaradi — takrorlarni olib tashlashning eng qisqa yo'li.", en: "`set()` removes duplicates and `list()` turns the result back into a list — the shortest way to de-duplicate." },
    { uz: "`&` — kesishma: ikkala to'plamda ham bor elementlar, ya'ni `{2, 3}`.", en: "`&` is intersection: elements present in both sets, i.e. `{2, 3}`." },
    { uz: "`|` — birlashma: ikkala to'plamdagi hamma element, takrorsiz.", en: "`|` is union: every element from both sets, without duplicates." }
  ],

  12: [
    { uz: "Dictionary figurali qavs `{}` va `kalit: qiymat` juftliklaridan iborat.", en: "A dictionary uses curly braces `{}` and `key: value` pairs." },
    { uz: "`d[\"a\"]` — `\"a\"` kalitining qiymatini beradi, ya'ni `1`.", en: "`d[\"a\"]` returns the value stored under the key `\"a\"`, i.e. `1`." },
    { uz: "Dictionaryda index emas, KALIT bilan murojaat qilinadi. Tartib bu yerda ahamiyatsiz.", en: "You reach a dictionary value by KEY, not by index. Position is irrelevant here." },
    { uz: "Yo'q kalitga qiymat bersang — u qo'shiladi. Bor bo'lsa — almashtiriladi. Bitta amal ikki ish qiladi.", en: "Assigning to a missing key adds it; assigning to an existing one replaces it. One operation, two jobs." },
    { uz: "`get()` ning ikkinchi argumenti — kalit topilmaganda qaytariladigan standart qiymat. Xato chiqmaydi.", en: "The second argument of `get()` is the fallback returned when the key is missing. No error is raised." },
    { uz: "`len()` dictionaryda juftliklar sonini beradi — bu yerda 2 ta kalit bor.", en: "`len()` on a dict counts the pairs — here there are two keys." },
    { uz: "`items()` har juftlikni `(kalit, qiymat)` shaklida beradi. Shuning uchun `for k, v in d.items()` ishlaydi.", en: "`items()` yields each pair as `(key, value)`. That is why `for k, v in d.items()` works." },
    { uz: "Kalit allaqachon bor edi, shuning uchun qiymat almashdi: `1` → `9`.", en: "The key already existed, so its value was replaced: `1` → `9`." },
    { uz: "`del d['a']` kalitni ham, qiymatini ham o'chiradi. Yo'q kalitni o'chirsang `KeyError` chiqadi.", en: "`del d['a']` removes both the key and its value. Deleting a missing key raises `KeyError`." },
    { uz: "`in` dictionaryda KALITLAR orasidan qidiradi. `\"x\"` kalit bor — `True`.", en: "`in` searches a dict's KEYS. `\"x\"` is a key, so `True`." }
  ],

  13: [
    { uz: "Avval qator, keyin ustun: `matrix[1]` → `[3,4]`, undan `[0]` → `3`.", en: "Row first, then column: `matrix[1]` → `[3,4]`, then `[0]` → `3`." },
    { uz: "`students[0]` list elementi (dict), `['name']` esa o'sha dictning kaliti. Demak: list ichida dict.", en: "`students[0]` is a list element (a dict) and `['name']` is that dict's key. So: dicts inside a list." },
    { uz: "`person` → `address` → `city`: ikkita dict bir-birining ichida, ya'ni 2 daraja.", en: "`person` → `address` → `city`: two dicts nested, so 2 levels." },
    { uz: "`matrix[0]` → `[1,2,3]`, undan `[2]` → uchinchi element `3`.", en: "`matrix[0]` → `[1,2,3]`, then `[2]` → the third element, `3`." },
    { uz: "Ichki loop tashqi loopning HAR aylanishida to'liq ishlaydi: 3 × 3 = 9.", en: "The inner loop runs fully on EVERY pass of the outer one: 3 × 3 = 9." },
    { uz: "`d['a']` → `[1,2,3]` (list), undan `[1]` → ikkinchi element `2`.", en: "`d['a']` → `[1,2,3]` (a list), then `[1]` → the second element, `2`." },
    { uz: "Ha — list ichida dict aynan JSON ning shakli. API'lardan keladigan ma'lumot deyarli har doim shunday.", en: "Yes — a list of dicts is exactly the shape of JSON. Data from APIs almost always looks like this." },
    { uz: "`matrix[0]` bitta son emas, butun QATORNI (listni) qaytaradi. Son uchun ikkinchi index kerak.", en: "`matrix[0]` returns the whole ROW (a list), not a single number. You need a second index for that." },
    { uz: "Loop ichida loop — nested loop. Tashqisi qatorlar bo'ylab, ichkisi har qator elementlari bo'ylab yuradi.", en: "A loop inside a loop is a nested loop. The outer walks the rows, the inner walks each row's elements." },
    { uz: "`d['x']` → `{'y':5}` (dict), undan `['y']` → `5`.", en: "`d['x']` → `{'y':5}` (a dict), then `['y']` → `5`." }
  ],

  14: [
    { uz: "Tuple — `()`. Uni `[]` (list) va `{}` (set/dict) bilan adashtirma.", en: "A tuple uses `()`. Don't confuse it with `[]` (list) or `{}` (set/dict)." },
    { uz: "Tuple o'zgarmas: yaratilgandan keyin element qo'shib ham, almashtirib ham bo'lmaydi.", en: "A tuple is immutable: once created you can neither add nor replace an element." },
    { uz: "Set takrorlarni tashlaydi: ikkita `2` bittaga aylanadi.", en: "A set drops duplicates: the two `2`s collapse into one." },
    { uz: "Set `{}` bilan yoziladi. Bo'sh set esa `set()` — chunki `{}` bo'sh dictionary.", en: "A set uses `{}`. An empty set is `set()`, because `{}` is an empty dictionary." },
    { uz: "`matrix[1]` → `[3,4]`, undan `[0]` → `3`. Avval qator, keyin ustun.", en: "`matrix[1]` → `[3,4]`, then `[0]` → `3`. Row first, column second." },
    { uz: "Index (`[0]`) list ekanini, kalit (`['name']`) dict ekanini ko'rsatadi. Demak: list ichida dict.", en: "The index (`[0]`) shows a list; the key (`['name']`) shows a dict. So: dicts inside a list." },
    { uz: "`get()` yo'q kalitda xato bermaydi, `None` (yoki berilgan standart qiymat) qaytaradi.", en: "`get()` does not raise on a missing key; it returns `None` (or the fallback you supply)." },
    { uz: "`set` takrorlarni tashlaydi, `list` esa natijani listga qaytaradi → `[1, 2]`.", en: "`set` drops duplicates and `list` turns the result back into a list → `[1, 2]`." },
    { uz: "Vergul tuple yasaydi: `(5,)` — tuple, `(5)` — oddiy son.", en: "The comma makes the tuple: `(5,)` is a tuple, `(5)` is just a number." },
    { uz: "3 × 3 = 9. Ichki loop tashqi loopning har aylanishida to'liq ishlaydi.", en: "3 × 3 = 9. The inner loop runs in full on each pass of the outer." }
  ],

  /* ---------------- HAFTA 3 ---------------- */

  15: [
    { uz: "`def` — funksiya yaratish kalit so'zi. `return` esa funksiya ichida natija qaytarish uchun.", en: "`def` is the keyword that creates a function. `return` is used inside it to hand back a result." },
    { uz: "`def` faqat retseptni YOZADI. Chaqirilmagan funksiya hech narsa qilmaydi — hech narsa chiqmaydi.", en: "`def` only WRITES the recipe. An uncalled function does nothing, so nothing is printed." },
    { uz: "`print` ekranga chiqaradi va natija yo'qoladi; `return` qiymatni qaytaradi va uni saqlash, qo'shish, uzatish mumkin.", en: "`print` shows on screen and the value is gone; `return` hands the value back so you can store, add or pass it on." },
    { uz: "`add(4,6)` → `return 4+6` → `10`. `print` uni ekranga chiqaradi.", en: "`add(4,6)` → `return 4+6` → `10`, which `print` then displays." },
    { uz: "`return` funksiyani DARHOL tugatadi — undan keyingi kod hech qachon ishlamaydi.", en: "`return` ends the function IMMEDIATELY — code after it never runs." },
    { uz: "`m` uchun argument berilmagan, shuning uchun default qiymat `'Hi'` ishlatiladi.", en: "No argument was given for `m`, so its default `'Hi'` is used." },
    { uz: "Chaqirilmagan funksiya shunchaki tayyor turadi — xotirada saqlanadi, lekin bajarilmaydi.", en: "An uncalled function simply sits ready — stored in memory but not executed." },
    { uz: "Ichkaridan tashqariga: `sq(2)` → 4, keyin `sq(4)` → 16.", en: "Inside out: `sq(2)` → 4, then `sq(4)` → 16." },
    { uz: "`f` faqat `print` qiladi, `return` yo'q — shuning uchun `x` `None` bo'ladi va `None * 2` `TypeError` beradi.", en: "`f` only prints and has no `return`, so `x` is `None` and `None * 2` raises `TypeError`." },
    { uz: "Ikkinchi `def` birinchisini bosib o'tadi — Python uchun bu shunchaki nomga yangi qiymat berish.", en: "The second `def` overwrites the first — to Python it is simply rebinding the name." }
  ],

  16: [
    { uz: "`y` uchun argument berilmadi, shuning uchun default `5` ishlatiladi.", en: "No argument was passed for `y`, so the default `5` is used." },
    { uz: "Default qiymatli parametr oddiylaridan KEYIN turishi shart, aks holda Python argumentlarni taqsimlay olmaydi — `SyntaxError`.", en: "A defaulted parameter must come AFTER plain ones, otherwise Python cannot match arguments — `SyntaxError`." },
    { uz: "`*args` ortiqcha pozitsion argumentlarni TUPLE qilib yig'adi.", en: "`*args` collects extra positional arguments into a TUPLE." },
    { uz: "`**kwargs` nomli argumentlarni DICT qilib yig'adi: `{'ism': 'Max'}`.", en: "`**kwargs` collects named arguments into a DICT: `{'name': 'Max'}`." },
    { uz: "`*args` bo'sh ham bo'lishi mumkin — u holda bo'sh tuple `()` bo'ladi va funksiya bemalol ishlaydi.", en: "`*args` may be empty — it becomes the empty tuple `()` and the function runs fine." },
    { uz: "Funksiya ichidagi o'zgaruvchi LOCAL: faqat o'sha funksiyada mavjud, tugashi bilan yo'qoladi.", en: "A variable inside a function is LOCAL: it exists only there and disappears when the function ends." },
    { uz: "O'qish mumkin — Python nomni topmaganda tashqariga qaraydi. Lekin O'ZGARTIRISH uchun `global` kerak.", en: "Reading works — Python looks outward when a name is not local. But CHANGING it requires `global`." },
    { uz: "`global x` deb e'lon qilsang, funksiya ichidagi `x = ...` tashqaridagi o'zgaruvchini o'zgartiradi. Imkon qadar `return` ishlatgan ma'qul.", en: "Declaring `global x` makes an assignment inside the function change the outer variable. Prefer returning a value where you can." },
    { uz: "`name=`, `age=` — nomli argumentlar, ular `**kwargs` ga tushadi (yoki mos parametrlarga).", en: "`name=`, `age=` are named arguments; they land in `**kwargs` (or in the matching parameters)." },
    { uz: "To'g'ri tartib: oddiy → default → `*args` → `**kwargs`. Buzilsa `SyntaxError`.", en: "The correct order is: plain → default → `*args` → `**kwargs`. Break it and you get a `SyntaxError`." }
  ],

  17: [
    { uz: "`def` funksiyani YARATADI. Chaqirish esa nom va qavs bilan: `f()`.", en: "`def` CREATES the function. Calling it is done with the name and brackets: `f()`." },
    { uz: "`print` ekranga chiqaradi, `return` qiymat qaytaradi. Faqat `print` qilgan funksiyaning natijasini ishlatib bo'lmaydi.", en: "`print` displays; `return` gives a value back. You cannot reuse the result of a function that only prints." },
    { uz: "Argument berilmaganda default ishlaydi — `y` `5` bo'ladi.", en: "The default applies when no argument is given — `y` becomes `5`." },
    { uz: "`*args` — tuple (pozitsion argumentlar).", en: "`*args` is a tuple of positional arguments." },
    { uz: "`**kwargs` — dict (nomli argumentlar).", en: "`**kwargs` is a dict of named arguments." },
    { uz: "Local: faqat o'sha funksiya ichida ko'rinadi va tugashi bilan yo'qoladi.", en: "Local: visible only inside that function, and gone once it ends." },
    { uz: "`return` funksiyani tugatadi — undan keyingi qatorlar hech qachon bajarilmaydi.", en: "`return` ends the function, so lines after it never execute." },
    { uz: "Default qiymatli parametr oddiysidan oldin kelolmaydi — `SyntaxError`.", en: "A defaulted parameter cannot precede a plain one — `SyntaxError`." },
    { uz: "Ha, va bu yaxshi amaliyot: katta masala kichik funksiyalarga bo'linadi (dekompozitsiya).", en: "Yes, and it is good practice: a big problem is split into small functions (decomposition)." },
    { uz: "`global` kalit so'zi kerak. Lekin toza yechim — qiymatni `return` qilib, tashqarida saqlash.", en: "You need the `global` keyword — though the clean solution is to return the value and store it outside." }
  ],

  18: [
    { uz: "Index 0 dan: `'Python'[0]` — birinchi harf `P`.", en: "Indexing starts at 0: `'Python'[0]` is the first letter, `P`." },
    { uz: "`[-1]` oxirgi belgini beradi — `'Python'` ning oxirgisi `n`.", en: "`[-1]` gives the last character — the last letter of `'Python'` is `n`." },
    { uz: "`[1:3]` — 1 va 2-indekslar, ya'ni `'e'` va `'l'` → `'el'`. `stop` (3) kirmaydi.", en: "`[1:3]` takes indexes 1 and 2 — `'e'` and `'l'` → `'el'`. The `stop` (3) is excluded." },
    { uz: "Qadam `-1` — teskari yo'nalish. Bu satrni ag'darishning eng qisqa usuli.", en: "A step of `-1` reverses direction — the shortest way to flip a string." },
    { uz: "String O'ZGARMAS: `s[0]='x'` `TypeError` beradi. Yangi string yasash kerak: `'x' + s[1:]`.", en: "Strings are IMMUTABLE: `s[0]='x'` raises `TypeError`. Build a new one: `'x' + s[1:]`." },
    { uz: "`split()` stringni berilgan belgi bo'yicha kesib, LIST qaytaradi.", en: "`split()` cuts the string at the given separator and returns a LIST." },
    { uz: "`join()` — yelim oldinda: `'-'.join([...])` bo'laklarni `-` bilan yopishtiradi.", en: "With `join()` the glue comes first: `'-'.join([...])` sticks the pieces together with `-`." },
    { uz: "`'hello'` da `l` ikki marta uchraydi (`he-l-l-o`).", en: "`'hello'` contains `l` twice (`he-l-l-o`)." },
    { uz: "`strip()` faqat BOSHI va OXIRIDAGI bo'shliqlarni oladi; o'rtadagilar qoladi.", en: "`strip()` removes whitespace only at the START and END; inner spaces stay." },
    { uz: "`in` string ichida bo'lak qidiradi va `bool` qaytaradi — `if` ga to'g'ridan-to'g'ri tayyor.", en: "`in` looks for a substring and returns a `bool` — ready to drop straight into an `if`." }
  ],

  19: [
    { uz: "f-string ichidagi ifoda hisoblanadi: `2+3` → `5`.", en: "The expression inside an f-string is evaluated: `2+3` → `5`." },
    { uz: "`.2f` — ikki xona kasr bilan yaxlitlash. `3.14159` → `3.14`.", en: "`.2f` rounds to two decimal places: `3.14159` → `3.14`." },
    { uz: "`,` mingliklarni ajratadi — hisobotlarda o'qishni ancha osonlashtiradi.", en: "`,` groups thousands — it makes reports far easier to read." },
    { uz: "`.0%` qiymatni 100 ga ko'paytirib, `%` qo'shadi va kasrsiz chiqaradi: `0.5` → `50%`.", en: "`.0%` multiplies by 100, appends `%` and shows no decimals: `0.5` → `50%`." },
    { uz: "`\\n` — yangi qator belgisi. `print` ichida ishlatilsa matn keyingi qatordan davom etadi.", en: "`\\n` is the newline character. Inside `print` it moves the text to the next line." },
    { uz: "`\\t` — tabulyatsiya (katta bo'shliq). Oddiy jadval chiqarishda qulay.", en: "`\\t` is a tab (a wide space) — handy for quick tabular output." },
    { uz: "`>` matnni o'ngga tekislaydi (chapdan bo'shliq qo'shadi). `<` chapga, `^` markazga.", en: "`>` right-aligns (padding on the left). `<` is left, `^` is centre." },
    { uz: "`05d` — 5 xona, yetmagan joyi nol bilan to'ldiriladi: `42` → `00042`.", en: "`05d` means five digits, zero-padded: `42` → `00042`." },
    { uz: "`r\"...\"` — xom (raw) string: `\\n` maxsus belgi emas, oddiy ikki belgi bo'lib qoladi. Windows yo'llari uchun kerak.", en: "`r\"...\"` is a raw string: `\\n` is no longer special, just two characters. Needed for Windows paths." },
    { uz: "`^` matnni markazga tekislaydi, ikki tomondan teng bo'shliq qo'shadi.", en: "`^` centres the text, padding both sides equally." }
  ],

  20: [
    { uz: "Index 0 dan — birinchi harf `P`.", en: "Indexing starts at 0 — the first letter is `P`." },
    { uz: "`[::-1]` — teskari o'qish: `abc` → `cba`.", en: "`[::-1]` reads backwards: `abc` → `cba`." },
    { uz: "String o'zgarmas — element almashtirsang `TypeError`. Yangi string yasash kerak.", en: "Strings are immutable — assigning to an element raises `TypeError`. Build a new string instead." },
    { uz: "`split(',')` vergul bo'yicha kesadi va list qaytaradi.", en: "`split(',')` cuts at commas and returns a list." },
    { uz: "`'-'.join([...])` — bo'laklarni `-` bilan birlashtiradi va string qaytaradi.", en: "`'-'.join([...])` joins the pieces with `-` and returns a string." },
    { uz: "`strip()` boshi va oxiridagi bo'shliqlarni oladi.", en: "`strip()` removes whitespace at the start and end." },
    { uz: "`.2f` — ikki xona kasr: `3.14`.", en: "`.2f` means two decimal places: `3.14`." },
    { uz: "`\\n` — yangi qatorga o'tish belgisi.", en: "`\\n` is the newline character." },
    { uz: "`in` bo'lak bor-yo'qligini tekshiradi va `True` qaytaradi.", en: "`in` checks for a substring and returns `True` here." },
    { uz: "`upper()` hamma harfni katta qiladi va YANGI string qaytaradi (aslini o'zgartirmaydi).", en: "`upper()` uppercases everything and returns a NEW string (the original is untouched)." }
  ],

  21: [
    { uz: "Har element 2 ga ko'payadi: `range(3)` → 0,1,2 → `[0,2,4]`.", en: "Each element is doubled: `range(3)` → 0,1,2 → `[0,2,4]`." },
    { uz: "Oxiridagi `if` — FILTR: faqat juftlar qoladi → `[0,2,4]`.", en: "The trailing `if` is a FILTER: only even numbers remain → `[0,2,4]`." },
    { uz: "To'g'ri tartib: `[ifoda for x in ketma-ketlik]` — avval nima yasaymiz, keyin qayerdan olamiz.", en: "The correct order is `[expression for x in sequence]` — what we build first, where it comes from second." },
    { uz: "Har so'zga `upper()` qo'llaniladi: `['a','b']` → `['A','B']`.", en: "`upper()` is applied to each word: `['a','b']` → `['A','B']`." },
    { uz: "`len('hi')` = 2, `len('bye')` = 3 → `[2,3]`.", en: "`len('hi')` is 2 and `len('bye')` is 3 → `[2,3]`." },
    { uz: "Oxirdagi `if` filtrlaydi — mos kelmagan elementlar natijaga umuman tushmaydi.", en: "A trailing `if` filters — non-matching elements never enter the result." },
    { uz: "`if-else` boshda turganda har element natijaga tushadi, faqat qiymati o'zgaradi: 1 toq → `'t'`, 2 juft → `'j'`.", en: "With `if-else` at the front every element appears, only its value changes: 1 is odd → `'t'`, 2 is even → `'j'`." },
    { uz: "Comprehension qisqaroq va Python uni ichki darajada optimallashtirgani uchun tezroq ham.", en: "A comprehension is shorter, and faster too because Python optimises it internally." },
    { uz: "Figurali qavs va `kalit: qiymat` — bu dict comprehension: `{0:0, 1:1, 2:4}`.", en: "Curly braces with `key: value` make a dict comprehension: `{0:0, 1:1, 2:4}`." },
    { uz: "String ham ketma-ketlik — har belgisi bo'ylab yurish mumkin: `['a','b','c']`.", en: "A string is a sequence too, so you can iterate its characters: `['a','b','c']`." }
  ],

  22: [
    { uz: "Har element ikkiga ko'payadi: `[0,2,4]`.", en: "Each element is doubled: `[0,2,4]`." },
    { uz: "`if x%2==0` — filtr, faqat juftlar qoladi.", en: "`if x%2==0` filters, leaving only the even numbers." },
    { uz: "`[ifoda for x in seq]` — avval nima yasaymiz, keyin manba.", en: "`[expression for x in seq]` — the result first, the source second." },
    { uz: "`print` ko'rsatadi, `return` qiymat qaytaradi va uni keyin ishlatish mumkin.", en: "`print` displays; `return` gives back a value you can use later." },
    { uz: "`*args` — cheksiz pozitsion argumentlarni tuple qilib yig'adi.", en: "`*args` gathers any number of positional arguments into a tuple." },
    { uz: "`split(',')` vergul bo'yicha kesib list qaytaradi.", en: "`split(',')` cuts at commas and returns a list." },
    { uz: "`.1f` — bitta xona kasr, shuning uchun `5` → `5.0`.", en: "`.1f` means one decimal place, so `5` becomes `5.0`." },
    { uz: "Har elementga `upper()` qo'llaniladi → `['A']`.", en: "`upper()` is applied to each element → `['A']`." },
    { uz: "`get()` ning ikkinchi argumenti — kalit yo'q bo'lganda qaytariladigan qiymat, ya'ni `0`.", en: "The second argument of `get()` is what to return when the key is missing — here `0`." },
    { uz: "Comprehension oddiy loopdan qisqa va tezroq, lekin faqat YANGI ma'lumot yasash uchun.", en: "A comprehension is shorter and faster than a plain loop — but only for BUILDING new data." }
  ],

  /* ---------------- HAFTA 4 ---------------- */

  23: [
    { uz: "`try/except` xatoni ushlab, dasturning yiqilishini oldini oladi. Foydalanuvchi kutilmagan narsa kiritsa ham dastur ishlashda davom etadi.", en: "`try/except` catches an error and keeps the program from crashing, so it survives unexpected input." },
    { uz: "Tur to'g'ri (string berildi), lekin QIYMAT songa aylanmaydi — bu `ValueError`.", en: "The type is right (a string was given) but the VALUE cannot become a number — that is a `ValueError`." },
    { uz: "Nolga bo'lish matematik jihatdan aniqlanmagan — `ZeroDivisionError`.", en: "Division by zero is mathematically undefined — `ZeroDivisionError`." },
    { uz: "Bu yerda TURLAR mos kelmaydi (`str` va `int`) — `TypeError`. `ValueError` dan farqi shu.", en: "Here the TYPES do not match (`str` and `int`) — a `TypeError`. That is what distinguishes it from `ValueError`." },
    { uz: "`except` faqat `try` ichida xato chiqqanda ishlaydi. Xato bo'lmasa u butunlay tashlab ketiladi.", en: "`except` runs only when the `try` block raised an error. Otherwise it is skipped entirely." },
    { uz: "`else` — xato BO'LMAGANDA ishlaydi. \"Hammasi joyida bo'lsa, endi shuni qil\" degani.", en: "`else` runs when there was NO error — \"if all went well, now do this\"." },
    { uz: "`finally` HAR DOIM ishlaydi: xato bo'ldimi, bo'lmadimi, hatto `return` bo'lsa ham. Tozalash ishlari uchun.", en: "`finally` ALWAYS runs — error or not, even after a `return`. It is for cleanup." },
    { uz: "`as e` xato obyektini `e` ga bog'laydi; `print(e)` bilan tafsilotni ko'rish mumkin.", en: "`as e` binds the exception object to `e`; `print(e)` shows the details." },
    { uz: "Listda bunday o'rin yo'q — `IndexError`. Dictionaryda bo'lsa `KeyError` bo'lardi.", en: "There is no such position in the list — `IndexError`. In a dictionary it would be a `KeyError`." },
    { uz: "Ushlanmagan xato dasturni to'xtatadi va traceback chiqaradi. Shuning uchun xavfli joylarni `try` ga o'rash kerak.", en: "An uncaught error stops the program and prints a traceback. That is why risky spots belong in a `try`." }
  ],

  24: [
    { uz: "`'r'` — read (o'qish). Bu standart rejim ham: `open(nom)` avtomatik `'r'` bo'ladi.", en: "`'r'` means read. It is also the default: `open(name)` implies `'r'`." },
    { uz: "`'w'` faylni ochish bilan TOZALAYDI. Avvalgi ma'lumotni saqlash uchun `'a'` ishlat.", en: "`'w'` WIPES the file on opening. Use `'a'` to keep what was there." },
    { uz: "`'a'` — append: yozilgan narsa faylning oxiriga qo'shiladi.", en: "`'a'` means append: what you write goes to the end of the file." },
    { uz: "`with` blokdan chiqishda faylni AVTOMATIK yopadi — hatto xato chiqsa ham. Qo'lda `close()` yozish unutiladi.", en: "`with` closes the file AUTOMATICALLY when the block ends, even on an error. A manual `close()` gets forgotten." },
    { uz: "`read()` butun faylni bitta STRING qilib qaytaradi. Katta fayl uchun xotira yetmasligi mumkin.", en: "`read()` returns the entire file as one STRING. For a big file that may exhaust memory." },
    { uz: "`readlines()` har qatorni alohida element qilib LIST qaytaradi (har birida `\\n` bilan).", en: "`readlines()` returns a LIST with each line as an element (each still ending in `\\n`)." },
    { uz: "`\\n` — yangi qator. Faylda har qator shu belgi bilan tugaydi.", en: "`\\n` is a newline. In a file each line ends with it." },
    { uz: "Yo'q faylni `'r'` bilan ochib bo'lmaydi — `FileNotFoundError`. `'w'` yoki `'a'` esa yaratadi.", en: "You cannot open a missing file with `'r'` — `FileNotFoundError`. `'w'` and `'a'` would create it." },
    { uz: "O'qilgan har qator oxirida ko'rinmas `\\n` bo'ladi; `strip()` uni olib tashlaydi va ikki karra bo'sh qatorning oldini oladi.", en: "Every line read ends with an invisible `\\n`; `strip()` removes it and prevents double line breaks." },
    { uz: "`write()` faqat STRING qabul qiladi. Son yozish uchun `f.write(str(5))` yoki `f.write(f\"{5}\")`.", en: "`write()` accepts only a STRING. To write a number use `f.write(str(5))` or `f.write(f\"{5}\")`." }
  ],

  25: [
    { uz: "`'abc'` ni songa aylantirib bo'lmaydi — `ValueError` (tur to'g'ri, qiymat noto'g'ri).", en: "`'abc'` cannot become a number — `ValueError` (right type, wrong value)." },
    { uz: "Nolga bo'lish — `ZeroDivisionError`.", en: "Dividing by zero gives `ZeroDivisionError`." },
    { uz: "`finally` har doim ishlaydi — xato bo'lsa ham, bo'lmasa ham.", en: "`finally` always runs — with or without an error." },
    { uz: "`else` faqat xato BO'LMAGANDA ishlaydi.", en: "`else` runs only when there was NO error." },
    { uz: "`'w'` yozish rejimi — mavjud faylni tozalaydi.", en: "`'w'` is write mode — it wipes an existing file." },
    { uz: "`'a'` qo'shish rejimi — oxiriga yozadi, eskisini saqlaydi.", en: "`'a'` is append mode — it writes at the end and keeps what was there." },
    { uz: "`with` faylni avtomatik yopadi, shuning uchun ma'lumot yo'qolmaydi va resurs bo'shatiladi.", en: "`with` closes the file automatically, so no data is lost and resources are freed." },
    { uz: "`'r'` fayl mavjud bo'lishini talab qiladi — yo'q bo'lsa `FileNotFoundError`.", en: "`'r'` requires the file to exist — otherwise `FileNotFoundError`." },
    { uz: "`readlines()` qatorlar LISTini qaytaradi.", en: "`readlines()` returns a LIST of lines." },
    { uz: "`as e` — `e` ichida xato haqidagi ma'lumot bo'ladi.", en: "With `as e`, the variable `e` holds information about the error." }
  ],

  26: [
    { uz: "Modul — boshqa birov yozgan tayyor kod to'plami. `import` bilan chaqirib, funksiyalaridan foydalanasan.", en: "A module is a ready-made bundle of code someone else wrote. You `import` it and use its functions." },
    { uz: "`import math` butun modulni oladi, shuning uchun nomni to'liq yozish kerak: `math.sqrt()`.", en: "`import math` brings in the whole module, so you write the full name: `math.sqrt()`." },
    { uz: "`randint(a, b)` — a dan b GACHA (ikkalasi ham kiradi) tasodifiy butun son.", en: "`randint(a, b)` returns a random integer from a to b, INCLUSIVE of both." },
    { uz: "`choice()` ketma-ketlikdan bitta tasodifiy element tanlaydi.", en: "`choice()` picks one random element from a sequence." },
    { uz: "`from math import sqrt` nomni to'g'ridan-to'g'ri olib keladi — `math.` prefiksi kerak emas.", en: "`from math import sqrt` brings the name in directly — no `math.` prefix needed." },
    { uz: "`as` — modulga qisqa nom (taxallus) berish. `numpy` ni har safar yozmaslik uchun `np`.", en: "`as` gives the module a short alias — `np` so you need not type `numpy` every time." },
    { uz: "`math.pi` — funksiya emas, DOIMIY qiymat (3.14159…). Shuning uchun qavssiz yoziladi.", en: "`math.pi` is not a function but a CONSTANT (3.14159…), so it takes no brackets." },
    { uz: "Har `.py` fayl modul bo'la oladi: `yordamchi.py` yasab, `import yordamchi` deb chaqirasan.", en: "Any `.py` file can be a module: create `helpers.py` and call `import helpers`." },
    { uz: "`shuffle()` listni JOYIDA aralashtiradi va `None` qaytaradi — natijani o'zgaruvchiga solma.", en: "`shuffle()` shuffles the list IN PLACE and returns `None` — do not assign its result." },
    { uz: "NumPy standart kutubxonada yo'q: avval `pip install numpy`, keyin `import numpy`.", en: "NumPy is not in the standard library: first `pip install numpy`, then `import numpy`." }
  ],

  27: [
    { uz: "`class` — klass yaratish kalit so'zi. `def` funksiya uchun.", en: "`class` creates a class; `def` is for functions." },
    { uz: "`__init__` obyekt YARATILGANDA avtomatik chaqiriladi — uni o'zing chaqirmaysan.", en: "`__init__` is called automatically when the object is CREATED — you never call it yourself." },
    { uz: "`self` — shu obyektning o'zi. `self.ism` — \"aynan shu obyektning ismi\".", en: "`self` is this very object. `self.name` means \"the name of this particular object\"." },
    { uz: "`Student` — shablon (klass); `s` esa undan yasalgan obyekt (nusxa).", en: "`Student` is the template (the class); `s` is the object made from it (an instance)." },
    { uz: "`self.name = name` obyektga `name` atributini yopishtiradi — u obyekt bilan birga yashaydi.", en: "`self.name = name` attaches a `name` attribute to the object, and it lives as long as the object." },
    { uz: "Har metodning birinchi parametri `self` bo'lishi shart — aks holda `TypeError`.", en: "Every method's first parameter must be `self`, otherwise you get a `TypeError`." },
    { uz: "`car.brand` — nuqta orqali olingan MA'LUMOT, ya'ni atribut. Qavs bo'lganda metod bo'lardi.", en: "`car.brand` is DATA reached through a dot — an attribute. With brackets it would be a method." },
    { uz: "Metod — klass ichidagi funksiya. U obyektning HARAKATINI ifodalaydi.", en: "A method is a function inside a class; it expresses what the object DOES." },
    { uz: "Har obyekt o'z atributlariga ega — bitta klassdan yasalgan bo'lsa ham qiymatlari har xil bo'ladi.", en: "Each object has its own attributes — same class, different values." },
    { uz: "Kelishuv (PEP 8): klass nomi katta harf bilan (`Student`), funksiya nomi kichik harf bilan (`get_name`).", en: "By convention (PEP 8) class names start with a capital (`Student`), function names are lowercase (`get_name`)." }
  ],

  28: [
    { uz: "Inheritance — bir klassning boshqasidan atribut va metodlarni MEROS olishi. Umumiy kodni takrorlamaslik uchun.", en: "Inheritance is one class taking on another's attributes and methods — so shared code is not repeated." },
    { uz: "Qavs ichidagi nom — OTA klass. `Dog` `Animal` ning hamma metodini oladi va o'ziniki qo'shadi.", en: "The name in brackets is the PARENT class. `Dog` gains all of `Animal`'s methods and adds its own." },
    { uz: "`super()` ota klassga murojaat qiladi — ko'pincha uning `__init__` ini chaqirish uchun.", en: "`super()` reaches the parent class — most often to call its `__init__`." },
    { uz: "Override — otadan meros olingan metodni bola klassda qayta yozish. Nom bir xil bo'lishi shart.", en: "Overriding means rewriting an inherited method in the child. The name must match." },
    { uz: "Ha — meros olingan barcha metodlar bola obyektida ishlaydi, qayta yozish shart emas.", en: "Yes — every inherited method works on the child object without being rewritten." },
    { uz: "`super().__init__()` ota o'rnatadigan atributlarni yaratadi. Busiz ular yo'q bo'ladi va keyin `AttributeError` chiqadi.", en: "`super().__init__()` creates the attributes the parent sets. Without it they are missing and you hit `AttributeError` later." },
    { uz: "Ha — `self.metod()` orqali. Bu klassni ichkaridan tartibga solishning asosiy usuli.", en: "Yes — via `self.method()`. It is the main way to organise a class internally." },
    { uz: "Bir xil nomli metod turli klasslarda turlicha ishlashi — bu override, ya'ni polimorfizm.", en: "The same method name behaving differently per class is overriding — that is polymorphism." },
    { uz: "Ota klass — parent yoki base class. Bola esa child/derived class deyiladi.", en: "The parent class is also called the base class; the child is the derived class." },
    { uz: "Meros umumiy kodni bir marta yozib, hamma bola klasslarda ishlatish imkonini beradi — takrorlanish yo'qoladi.", en: "Inheritance lets you write shared code once and use it in every child class — repetition disappears." }
  ],

  29: [
    { uz: "`import math` butun modulni oladi, shuning uchun `math.sqrt()` deb to'liq yoziladi.", en: "`import math` brings the whole module, so you write `math.sqrt()` in full." },
    { uz: "`__init__` obyekt yaratilganda avtomatik ishlaydi (konstruktor).", en: "`__init__` runs automatically when the object is created (the constructor)." },
    { uz: "`self` — shu obyektning o'zi; u orqali obyektning atribut va metodlariga murojaat qilinadi.", en: "`self` is the object itself; through it you reach the object's attributes and methods." },
    { uz: "Qavs ichidagi klass — ota. `Dog` `Animal` dan meros oladi.", en: "The class in brackets is the parent: `Dog` inherits from `Animal`." },
    { uz: "`super()` ota klassni chaqiradi — ayniqsa `super().__init__()` shaklida.", en: "`super()` calls the parent class — most often as `super().__init__()`." },
    { uz: "`randint(1,6)` — 1 dan 6 gacha (ikkalasi ham kiradi) tasodifiy butun son. Zar tashlash aynan shu.", en: "`randint(1,6)` gives a random integer from 1 to 6 inclusive — exactly a dice roll." },
    { uz: "Override — meros olingan metodni bola klassda qayta yozish.", en: "Overriding is rewriting an inherited method in the child class." },
    { uz: "Metod — klass ichidagi funksiya, obyektning harakati.", en: "A method is a function inside a class — what the object does." },
    { uz: "`from math import sqrt` dan keyin nom to'g'ridan-to'g'ri ishlatiladi: `sqrt(16)`.", en: "After `from math import sqrt` you use the name directly: `sqrt(16)`." },
    { uz: "Atribut — obyektning ma'lumoti (xususiyati). Metod esa harakati.", en: "An attribute is the object's data (a property); a method is its action." }
  ],

  30: [
    { uz: "HTML — veb sahifa belgilash tili, Python asoslariga kirmaydi. Qolgan uchtasi — kursning o'zagi.", en: "HTML is a web markup language, not part of Python fundamentals. The other three are the core of the course." },
    { uz: "`class` — obyekt yasash uchun shablon (qolip). Obyekt esa shu qolipdan chiqqan nusxa.", en: "A `class` is the template for making objects; an object is an instance made from it." },
    { uz: "`input()` istisnosiz `str` qaytaradi — 30 kunlik kursning eng ko'p takrorlangan qoidasi.", en: "`input()` returns `str` without exception — the most repeated rule of the whole course." },
    { uz: "`//` — butun bo'lish: 7/2 = 3.5 → 3.", en: "`//` is floor division: 7/2 = 3.5 → 3." },
    { uz: "`try/except` xatoni ushlab, dasturning yiqilishiga yo'l qo'ymaydi.", en: "`try/except` catches an error and stops the program from crashing." },
    { uz: "`range(3)` — 0, 1, 2, comprehension esa ularni listga yig'adi: `[0,1,2]`.", en: "`range(3)` yields 0, 1, 2 and the comprehension collects them: `[0,1,2]`." },
    { uz: "`with open()` faylni ochadi va blok tugashi bilan AVTOMATIK yopadi.", en: "`with open()` opens the file and closes it AUTOMATICALLY when the block ends." },
    { uz: "Ha — qavs ichidagi klass ota hisoblanadi, ya'ni bu inheritance.", en: "Yes — the class in brackets is the parent, so this is inheritance." },
    { uz: "GitHub — kod portfoliosi uchun standart joy. Ish beruvchilar birinchi navbatda shuni ko'radi.", en: "GitHub is the standard home for a code portfolio, and the first place employers look." },
    { uz: "30 kun Python asoslarini to'liq qopladi — endi PCEP yoki DataCamp Associate kabi sertifikat imtihoniga tayyorsan.", en: "Thirty days have covered the Python fundamentals in full — you are ready for a certification exam such as PCEP or the DataCamp Associate." }
  ]
};
