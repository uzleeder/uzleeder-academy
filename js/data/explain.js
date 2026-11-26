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
    { uz: "Özgaruvçi nomi harf yoki `_` bilan boşlanadi, içida böşliq va `-` bölmaydi. `2age` raqamdan boşlangan, `open price` da böşliq, `price-2` da minus — uçalasi ham xato.", en: "A name must start with a letter or `_` and contain no spaces or `-`. `2age` starts with a digit, `open price` has a space, `price-2` has a minus — all invalid." },
    { uz: "`3.14` da nuqta bor, yaʼni kasr son — `float`. `type()` esa har doim `<class '...'>` körinişida qaytaradi.", en: "`3.14` has a decimal point, so it is a `float`. And `type()` always answers in the form `<class '...'>`." },
    { uz: "Qöştirnoq içidagisi — matn. Matnlar uçun `+` qöşmaydi, YOPIŞTIRADI: `\"2\" + \"2\"` → `\"22\"`. Sonlar kerak bölsa `int()` qil.", en: "Anything in quotes is text. For text, `+` does not add but joins: `\"2\" + \"2\"` → `\"22\"`. Convert with `int()` if you need numbers." },
    { uz: "`input()` DOIM `str` qaytaradi — foydalanuvçi 25 yozsa ham `\"25\"` böladi. Bu qoidada istisno yöq.", en: "`input()` ALWAYS returns a `str` — even if the user types 25 you get `\"25\"`. There is no exception to this rule." },
    { uz: "`True` va `False` — `bool` turi. Ular faqat ikki qiymatga ega va şartlar natijasi şu turda böladi.", en: "`True` and `False` are the `bool` type. It has only two values, and every comparison produces one of them." },
    { uz: "`f` prefiksi bor, şuning uçun `{ism}` öz qiymatiga almaşadi. `f` bölmaganda jonli matn — `Hi {ism}!` — çiqardi.", en: "The `f` prefix is present, so `{name}` is replaced by its value. Without the `f` it would print literally as `Hi {name}!`." },
    { uz: "`int()` matnni butun songa aylantiradi. `float()` kasr beradi, `str()` teskarisini qiladi, `type()` esa umuman aylantirmaydi.", en: "`int()` converts text to a whole number. `float()` gives a decimal, `str()` does the reverse, and `type()` converts nothing at all." },
    { uz: "`yosh` — string, `5` — son. `str + int` `TypeError` beradi. Töğrisi: `int(yosh) + 5`.", en: "`age` is a string and `5` is a number, so `str + int` raises `TypeError`. The fix: `int(age) + 5`." },
    { uz: "`19.99` — tirnoqsiz kasr son, yaʼni `float`. `\"19.99\"` esa tirnoq içida bölgani uçun matn.", en: "`19.99` is a decimal without quotes, so it is a `float`. `\"19.99\"` is in quotes and therefore text." },
    { uz: "`=` — qiymat SOLADI (öngdagini çapdagiga). Tekşiriş uçun `==` işlatiladi.", en: "`=` ASSIGNS (right side into left). To compare, use `==`." }
  ],

  2: [
    { uz: "`//` — butun böliş: 7/2 = 3.5, butun qismi 3. Kasr taşlab yuboriladi, yaxlitlanmaydi.", en: "`//` is floor division: 7/2 = 3.5, whole part 3. The fraction is dropped, not rounded." },
    { uz: "`%` — qoldiq: 7 içida 3 ikki marta bor (6), qolgani 1.", en: "`%` is the remainder: 3 fits into 7 twice (6), leaving 1." },
    { uz: "`/` HAR DOIM `float` qaytaradi — natija butun çiqsa ham `5.0`. Butun kerak bölsa `//` işlat.", en: "`/` ALWAYS returns a `float` — even when the result is whole you get `5.0`. Use `//` for a whole number." },
    { uz: "`**` — daraja: 2×2×2×2 = 16. `*` bilan adaştirma: `2 * 4` = 8.", en: "`**` is exponentiation: 2×2×2×2 = 16. Don't confuse it with `*`: `2 * 4` is 8." },
    { uz: "Taqqoslaş natijasi son emas — `bool` (`True`/`False`). Şuning uçun uni töğridan-töğri `if` ga beriş mumkin.", en: "A comparison produces a `bool` (`True`/`False`), not a number. That is why it can go straight into an `if`." },
    { uz: "`and` ikkala taraf ham `True` bölişini talab qiladi. Bittasi `False` bölsa — natija `False`.", en: "`and` requires both sides to be `True`. If either is `False`, the result is `False`." },
    { uz: "Avval qavs içi: `3 > 5` → `False`. Keyin `not False` → `True`.", en: "Brackets first: `3 > 5` → `False`. Then `not False` → `True`." },
    { uz: "Köpaytiriş qöşişdan oldin bajariladi: `3 * 4 = 12`, keyin `2 + 12 = 14`. Aniqlik uçun qavs qöy.", en: "Multiplication runs before addition: `3 * 4 = 12`, then `2 + 12 = 14`. Use brackets to be explicit." },
    { uz: "`=` qiymat soladi (`x = 5`), `==` teng-emasligini tekşiradi (`x == 5`). Bu farq boşlanğiç xatolarning yarmi.", en: "`=` assigns (`x = 5`), `==` tests equality (`x == 5`). This distinction accounts for half of all beginner bugs." },
    { uz: "Python zanjirli taqqoslaşni tuşunadi: `1 < 5 < 10` — bu `1 < 5 and 5 < 10`, yaʼni `True`. Köp tillarda bunday yozib bölmaydi.", en: "Python understands chained comparisons: `1 < 5 < 10` means `1 < 5 and 5 < 10`, so `True`. Most languages do not allow this." }
  ],

  3: [
    { uz: "Istisnosiz qoida: `input()` har doim `str`. Sonlar bilan işlaş uçun `int()` yoki `float()` şart.", en: "A rule without exceptions: `input()` always gives a `str`. You must use `int()` or `float()` to work with numbers." },
    { uz: "`int('20')` matnni songa aylantiradi va tirnoqsiz `20` beradi. Endi u bilan arifmetika qiliş mumkin.", en: "`int('20')` turns text into a number and yields `20` without quotes. Now you can do arithmetic with it." },
    { uz: "`int()` yaxlitlamaydi — KESADI. `3.9` → `3`. Yaxlitlaş uçun `round(3.9)` → `4`.", en: "`int()` does not round — it truncates. `3.9` → `3`. Use `round(3.9)` → `4` to round." },
    { uz: "`'abc'` da son yöq, şuning uçun `ValueError`. 23-kunda buni `try/except` bilan uşlaşni örganamiz.", en: "There is no number in `'abc'`, hence `ValueError`. On day 23 we learn to catch it with `try/except`." },
    { uz: "`sep` — argumentlar orasidagi ajratgiç. Standart `\" \"` (böşliq), bu yerda `\"-\"` ga özgartirilgan.", en: "`sep` is the separator between arguments. The default is `\" \"`; here it was changed to `\"-\"`." },
    { uz: "`end=\"\"` yangi qatorga ötişni bekor qiladi — keyingi `print` xuddi şu qatordan davom etadi.", en: "`end=\"\"` cancels the line break, so the next `print` continues on the same line." },
    { uz: "Python'da 0 — \"böş/yöq\" degani, yaʼni `False`. Noldan boşqa har qanday son `True`.", en: "In Python 0 means \"empty/none\", i.e. `False`. Any non-zero number is `True`." },
    { uz: "Böş string, böş list, böş dict — hammasi `False`. Şuning uçun `if matn:` — \"matn böş emasmi\" degani.", en: "An empty string, list or dict is `False`. That is why `if text:` means \"is the text non-empty?\"." },
    { uz: "`input()` string qaytargani uçun `yosh + 1` — `str + int` bölib `TypeError` beradi. `int(yosh) + 1` yoz.", en: "`input()` returns a string, so `age + 1` is `str + int` and raises `TypeError`. Write `int(age) + 1`." },
    { uz: "f-string içida IFODA hisoblanadi: `2*3` bajarilib, `6` qöyiladi. Faqat özgaruvçi emas, har qanday ifoda bölişi mumkin.", en: "An f-string evaluates the EXPRESSION inside: `2*3` runs and `6` is inserted. It need not be just a variable." }
  ],

  4: [
    { uz: "`//` butun böliş: 7/2 = 3.5 → butun qismi 3.", en: "`//` is floor division: 7/2 = 3.5 → whole part 3." },
    { uz: "`input()` har doim `str`. Bu qoidani yodda tut — u 30 kun davomida özgarmaydi.", en: "`input()` always returns `str`. Remember it — the rule does not change over the thirty days." },
    { uz: "`int('20')` → `20` (tirnoqsiz son). Endi arifmetikaga tayyor.", en: "`int('20')` → `20`, a real number without quotes, ready for arithmetic." },
    { uz: "`**` — daraja: 2³ = 2×2×2 = 8.", en: "`**` is exponentiation: 2³ = 2×2×2 = 8." },
    { uz: "`%` — qoldiq: 10 içida 3 uç marta (9), qolgani 1.", en: "`%` is the remainder: 3 fits into 10 three times (9), leaving 1." },
    { uz: "Taqqoslaş `bool` qaytaradi. `5 == 5` → `True`, uning turi `bool`.", en: "A comparison returns a `bool`. `5 == 5` is `True`, whose type is `bool`." },
    { uz: "`int()` kasrni kesadi: `3.9` → `3`. Yaxlitlaş `round()` ning işi.", en: "`int()` truncates the fraction: `3.9` → `3`. Rounding is `round()`'s job." },
    { uz: "f-string ifodani hisoblaydi: `2+3` → `5`.", en: "An f-string evaluates the expression: `2+3` → `5`." },
    { uz: "`/` istisnosiz `float` qaytaradi — `10 / 2` ham `5.0`.", en: "`/` returns a `float` without exception — even `10 / 2` gives `5.0`." },
    { uz: "`bool(0)` → `False`. Nol \"böş\" hisoblanadi; boşqa sonlar `True`.", en: "`bool(0)` → `False`. Zero counts as \"empty\"; other numbers are `True`." }
  ],

  /* ---------------- HAFTA 2 ---------------- */

  5: [
    { uz: "`=` qiymat soladi, `==` tenglikni tekşiradi. `if x = 5:` — sintaksis xatosi, Python buni ataylab taqiqlagan.", en: "`=` assigns, `==` compares. `if x = 5:` is a syntax error — Python forbids it deliberately." },
    { uz: "`!=` — \"teng emas\". 20 va 20 teng, şuning uçun \"teng emas\" `False`.", en: "`!=` means \"not equal\". 20 and 20 are equal, so \"not equal\" is `False`." },
    { uz: "15 >= 18 emas, şuning uçun `if` bloki taşlab ketiladi va `else` işlaydi.", en: "15 is not >= 18, so the `if` block is skipped and the `else` runs." },
    { uz: "85 >= 90 emas, lekin 85 >= 70 — şuning uçun ikkinçi şart işlaydi. `elif` zanjirida faqat BITTA tarmoq bajariladi.", en: "85 is not >= 90 but is >= 70, so the second branch runs. Only ONE branch of an `elif` chain executes." },
    { uz: "Şartlar yuqoridan pastga tekşiriladi. `>= 60` yuqorida tursa, 95 ham unga tuşib ketadi va `>= 90` ga yetib bormaydi. Eng tor şart eng yuqorida bölişi kerak.", en: "Conditions are checked top-down. If `>= 60` comes first, 95 matches it and never reaches `>= 90`. The narrowest condition must come first." },
    { uz: "`and` ikkalasini talab qiladi; `False` bölgani uçun natija `False`.", en: "`and` requires both; one is `False`, so the result is `False`." },
    { uz: "`or` kamida bittasini talab qiladi; `True` bori bor, şuning uçun `True`.", en: "`or` needs at least one; there is a `True`, so the result is `True`." },
    { uz: "`and` — ikkala şart ham bajarilişi şart. Bittasi yetarli bölsa `or` işlatilardi.", en: "`and` means both conditions must hold. If one were enough, you would use `or`." },
    { uz: "`not` qiymatni teskarisiga ögiradi: `not True` → `False`.", en: "`not` flips the value: `not True` → `False`." },
    { uz: "`age > 18` — taqqoslaş, natijasi `True`/`False`, yaʼni turi `bool`.", en: "`age > 18` is a comparison; its result is `True`/`False`, so the type is `bool`." }
  ],

  6: [
    { uz: "Index 0 dan boşlanadi, çunki u \"boşidan qança qadam\" degani. Birinçi element — 0 qadam.", en: "Indexing starts at 0 because an index counts steps from the start. The first element is zero steps away." },
    { uz: "Manfiy index oxiridan sanaydi: `[-1]` — oxirgisi, `[-2]` — undan oldingisi. Uzunlikni bilmasdan oxirgini olişning eng qisqa yöli.", en: "A negative index counts from the end: `[-1]` is last, `[-2]` second-to-last. The shortest way to reach the end without knowing the length." },
    { uz: "`len()` elementlar SONINI beradi (indekslarni emas). 4 element — 4, lekin oxirgi index 3.", en: "`len()` gives the COUNT of elements, not indexes. Four elements → 4, but the last index is 3." },
    { uz: "Slicingda `stop` kirmaydi: `[1:3]` — 1 va 2 indekslar, yaʼni `[20, 30]`.", en: "In slicing the `stop` is excluded: `[1:3]` gives indexes 1 and 2, i.e. `[20, 30]`." },
    { uz: "`append()` oxiriga qöşadi. `insert()` esa berilgan öringa qöyadi, `add()` — setning metodi.", en: "`append()` adds at the end. `insert()` places at a given position, and `add()` belongs to sets." },
    { uz: "`m[1]` — ikkinçi element (index 1), yaʼni `\"b\"`. U `\"x\"` ga almaşadi.", en: "`m[1]` is the second element (index 1), i.e. `\"b\"`. It becomes `\"x\"`." },
    { uz: "`[]` — list: özgartirsa böladi. `()` — tuple: özgarmas. Şakl öxşaş, xatti-harakat boşqa.", en: "`[]` is a list — mutable. `()` is a tuple — immutable. Similar look, different behaviour." },
    { uz: "Tuple özgarmas, şuning uçun unda `append` degan metod umuman yöq — `AttributeError`.", en: "A tuple is immutable, so it has no `append` method at all — `AttributeError`." },
    { uz: "Örtaça = yiğindi ÷ soni, yaʼni `sum(lst) / len(lst)`. Böş listda `len` 0 bölişini unutma.", en: "Average = sum ÷ count, i.e. `sum(lst) / len(lst)`. Remember that `len` is 0 for an empty list." },
    { uz: "Uçinçi son — qadam: `[::2]` bittadan taşlab oladi, yaʼni 0, 2, 4-indekslar.", en: "The third number is the step: `[::2]` takes every other item — indexes 0, 2, 4." }
  ],

  7: [
    { uz: "`=` soladi, `==` tekşiradi. Şartlarda faqat `==` işlatiladi.", en: "`=` assigns, `==` compares. Only `==` belongs in a condition." },
    { uz: "`[-1]` oxirgi elementni beradi — `30`.", en: "`[-1]` gives the last element — `30`." },
    { uz: "`[1:3]` — 1 va 2-indekslar, `stop` (3) kirmaydi → `[2, 3]`.", en: "`[1:3]` takes indexes 1 and 2; the `stop` (3) is excluded → `[2, 3]`." },
    { uz: "`and` da bitta `False` yetadi — natija `False`.", en: "One `False` is enough for `and` — the result is `False`." },
    { uz: "`append()` — listning oxiriga qöşiş metodi.", en: "`append()` is the method that adds to the end of a list." },
    { uz: "`elif` — \"else if\": oldingisi bajarilmasa, yangi şartni tekşiradi. Köp variantli qarorlar uçun.", en: "`elif` is \"else if\": if the previous branch failed, test a new condition. For multi-way decisions." },
    { uz: "`sum([1,2,3])` = 6, `len` = 3, `6 / 3` = `2.0`. `/` har doim float bergani uçun `2` emas, `2.0`.", en: "`sum([1,2,3])` is 6, `len` is 3, and `6 / 3` is `2.0` — a float, because `/` always returns one." },
    { uz: "`sort()` listni JOYIDA tartiblaydi va `None` qaytaradi. Yangi list kerak bölsa `sorted()`.", en: "`sort()` orders the list IN PLACE and returns `None`. Use `sorted()` if you want a new list." },
    { uz: "`not` teskarisiga ögiradi: `not True` → `False`.", en: "`not` flips it: `not True` → `False`." },
    { uz: "Ha, index 0 dan. Şuning uçun oxirgi index — `len(lst) - 1`.", en: "Yes, indexing starts at 0 — which is why the last index is `len(lst) - 1`." }
  ],

  8: [
    { uz: "`range(3)` — 0, 1, 2. Nol dan boşlanadi va 3 KIRMAYDI.", en: "`range(3)` yields 0, 1, 2. It starts at zero and 3 is EXCLUDED." },
    { uz: "`for` uçun ikkalasi ham şart: qator oxirida `:` va keyingi qatorda içkariga suriş. Biri yöq bölsa — `SyntaxError` yoki `IndentationError`.", en: "A `for` needs both: a `:` at the end of the line and an indented body. Miss either and you get a `SyntaxError` or `IndentationError`." },
    { uz: "`range(1, 5)` — 1 dan boşlanadi, 5 kirmaydi: 1, 2, 3, 4.", en: "`range(1, 5)` starts at 1 and excludes 5: 1, 2, 3, 4." },
    { uz: "`son` heç qaçon özgarmaydi, şart har doim `True` — çeksiz loop. Içida `son += 1` bölişi şart.", en: "`num` never changes, so the condition stays `True` forever — an infinite loop. It needs `num += 1` inside." },
    { uz: "`break` loopdan butunlay çiqadi, şuning uçun `i == 3` bölganda 3 çop etilmaydi va loop tugaydi: 0 1 2.", en: "`break` exits the loop entirely, so when `i == 3` nothing is printed and the loop ends: 0 1 2." },
    { uz: "`continue` faqat joriy aylanişni taşlaydi, loop davom etadi — şuning uçun 2 tuşib qoladi: 0 1 3 4.", en: "`continue` skips only the current pass and the loop continues — so 2 is missing: 0 1 3 4." },
    { uz: "Yiğiş naqşi: `total` 0 dan boşlanadi va har elementga oşadi → 10+20+30 = 60.", en: "The accumulator pattern: `total` starts at 0 and grows by each element → 10+20+30 = 60." },
    { uz: "Uçinçi argument — qadam: 0 dan 10 gaça ikkitadan → 0 2 4 6 8 (10 kirmaydi).", en: "The third argument is the step: from 0 to 10 in twos → 0 2 4 6 8 (10 excluded)." },
    { uz: "`break` loopni töxtatadi, `continue` faqat bitta aylanişni ötkazadi. Ikkalasi ham qolgan kodni taşlaydi, lekin `break` qaytmaydi.", en: "`break` stops the loop; `continue` only skips one pass. Both skip the remaining body, but `break` never returns." },
    { uz: "`sum` — Python'ning öz funksiyasi. Uni özgaruvçi nomi qilsang, keyin `sum([1,2])` çaqirib bölmaydi. Şu sabab `list`, `str`, `dict` ham nom sifatida işlatilmaydi.", en: "`sum` is a built-in function. Using it as a variable name means you can no longer call `sum([1,2])`. The same applies to `list`, `str` and `dict`." }
  ],

  9: [
    { uz: "`while` — şart `True` bölib turgan davomida aylanadi. Neça marta ekani oldindan nomaʼlum bölişi mumkin.", en: "`while` loops as long as the condition stays `True`. The number of repetitions may be unknown in advance." },
    { uz: "Hisoblagiç oşmasa şart heç qaçon `False` bölmaydi — dastur qotib qoladi. Çiqiş uçun Ctrl+C.", en: "If the counter never grows, the condition never turns `False` and the program hangs. Press Ctrl+C to escape." },
    { uz: "`break` loopdan çiqadi va undan keyingi kodga ötadi. Qolgan aylanişlar bajarilmaydi.", en: "`break` leaves the loop and jumps to the code after it. The remaining passes never happen." },
    { uz: "`continue` joriy aylanişning qolgan qismini taşlab, darhol keyingisini boşlaydi.", en: "`continue` abandons the rest of the current pass and starts the next one immediately." },
    { uz: "`i == 2` bölganda `continue` işlaydi va `print` taşlab ketiladi: 0 1 3 4.", en: "When `i == 2` the `continue` fires and the `print` is skipped: 0 1 3 4." },
    { uz: "`i == 2` da `break` — loop butunlay töxtaydi. Faqat 0 va 1 çiqadi.", en: "At `i == 2` the `break` stops the loop entirely, so only 0 and 1 appear." },
    { uz: "`while True:` şarti heç qaçon özgarmaydi — çiqişning yagona yöli `break` (yoki `return`).", en: "The condition of `while True:` never changes — the only way out is a `break` (or a `return`)." },
    { uz: "`else` loop NORMAL tugaganda işlaydi. `break` bilan çiqilsa — işlamaydi. \"Qidirdim, topmadim\" holatiga qulay.", en: "The `else` runs when the loop finishes NORMALLY. If a `break` fired, it is skipped. Handy for \"searched, found nothing\"." },
    { uz: "3, 2, 1 çop etiladi; `n` 0 bölganda `n > 0` `False` bölib loop tugaydi. Oxirgi çiqarilgani — 1.", en: "It prints 3, 2, 1; when `n` reaches 0 the condition `n > 0` fails and the loop ends. The last printed value is 1." },
    { uz: "`break` — çiqiş eşigi, `continue` — ötkazib yuboriş. Aralaştirmaslik uçun: break = tugadi, continue = keyingisi.", en: "`break` is the exit door, `continue` is a skip. Remember: break = done, continue = next." }
  ],

  10: [
    { uz: "`range(3)` — 0 1 2. Oxiri heç qaçon kirmaydi.", en: "`range(3)` gives 0 1 2. The end value is never included." },
    { uz: "Şartga taʼsir qiladigan özgariş bölmasa — çeksiz loop.", en: "Without a change that affects the condition, the loop runs forever." },
    { uz: "`break` — loopdan butunlay çiqiş.", en: "`break` exits the loop completely." },
    { uz: "`continue` joriy aylanişni tugatib, keyingisiga ötadi.", en: "`continue` ends the current pass and moves to the next." },
    { uz: "`range(1,5)` — 1 dan boşlab 4 gaça: 1 2 3 4.", en: "`range(1,5)` runs from 1 to 4: 1 2 3 4." },
    { uz: "`range(10)` — 0 dan 9 gaça, yaʼni 10 ta qiymat. Loop 10 marta aylanadi.", en: "`range(10)` covers 0 to 9 — ten values, so the loop runs ten times." },
    { uz: "`while True` şarti abadiy `True`; `break` bölmasa heç qaçon töxtamaydi.", en: "The condition of `while True` is eternally true; without a `break` it never stops." },
    { uz: "2 + 4 + 6 = 12. Yiğiş naqşi: `total` loopdan OLDIN 0 ga tenglanadi.", en: "2 + 4 + 6 = 12. The accumulator pattern: `total` is set to 0 BEFORE the loop." },
    { uz: "`range(0,10,2)` — 0 dan 10 gaça ikkitadan: 0 2 4 6 8. 10 kirmaydi.", en: "`range(0,10,2)` steps by two from 0 up to 10: 0 2 4 6 8. 10 is excluded." },
    { uz: "`break` loopni tark etadi, `continue` esa faqat bitta aylanişni ötkazadi.", en: "`break` leaves the loop; `continue` merely skips one pass." }
  ],

  11: [
    { uz: "Tuple — oddiy qavs `()`. `[]` list, `{}` set yoki dict.", en: "A tuple uses round brackets `()`. `[]` is a list, `{}` is a set or dict." },
    { uz: "Tuple ÖZGARMAS — elementini almaştirmoqçi bölsang `TypeError`. Butun tuple'ni yangisi bilan almaştiriş esa mumkin.", en: "A tuple is IMMUTABLE — assigning to an element raises `TypeError`. Rebinding the whole tuple is fine." },
    { uz: "Vergul tuple yasaydi, qavs emas. `(5)` — oddiy son, `(5,)` — bir elementli tuple.", en: "The comma makes a tuple, not the brackets. `(5)` is just a number; `(5,)` is a one-element tuple." },
    { uz: "Unpacking çapdagi nomlarga öngdagi qiymatlarni tartib bilan taqsimlaydi: `a=1`, `b=2`.", en: "Unpacking distributes the right-hand values to the left-hand names in order: `a=1`, `b=2`." },
    { uz: "Set figurali qavs `{}` bilan yoziladi (böş set esa `set()`).", en: "A set uses curly braces `{}` — though an empty set is `set()`." },
    { uz: "Set takrorlarni avtomatik taşlaydi: ikkita `2` bittaga aylanadi.", en: "A set drops duplicates automatically: the two `2`s become one." },
    { uz: "Set TARTIBSIZ — elementlar joyi belgilanmagan, şuning uçun `set[0]` işlamaydi. Kerak bölsa `list()` ga aylantir.", en: "A set is UNORDERED — positions are undefined, so `set[0]` does not work. Convert with `list()` if you need order." },
    { uz: "`set()` takrorlarni tozalaydi, `list()` esa natijani listga qaytaradi — takrorlarni olib taşlaşning eng qisqa yöli.", en: "`set()` removes duplicates and `list()` turns the result back into a list — the shortest way to de-duplicate." },
    { uz: "`&` — kesişma: ikkala töplamda ham bor elementlar, yaʼni `{2, 3}`.", en: "`&` is intersection: elements present in both sets, i.e. `{2, 3}`." },
    { uz: "`|` — birlaşma: ikkala töplamdagi hamma element, takrorsiz.", en: "`|` is union: every element from both sets, without duplicates." }
  ],

  12: [
    { uz: "Dictionary figurali qavs `{}` va `kalit: qiymat` juftliklaridan iborat.", en: "A dictionary uses curly braces `{}` and `key: value` pairs." },
    { uz: "`d[\"a\"]` — `\"a\"` kalitining qiymatini beradi, yaʼni `1`.", en: "`d[\"a\"]` returns the value stored under the key `\"a\"`, i.e. `1`." },
    { uz: "Dictionaryda index emas, KALIT bilan murojaat qilinadi. Tartib bu yerda ahamiyatsiz.", en: "You reach a dictionary value by KEY, not by index. Position is irrelevant here." },
    { uz: "Yöq kalitga qiymat bersang — u qöşiladi. Bor bölsa — almaştiriladi. Bitta amal ikki iş qiladi.", en: "Assigning to a missing key adds it; assigning to an existing one replaces it. One operation, two jobs." },
    { uz: "`get()` ning ikkinçi argumenti — kalit topilmaganda qaytariladigan standart qiymat. Xato çiqmaydi.", en: "The second argument of `get()` is the fallback returned when the key is missing. No error is raised." },
    { uz: "`len()` dictionaryda juftliklar sonini beradi — bu yerda 2 ta kalit bor.", en: "`len()` on a dict counts the pairs — here there are two keys." },
    { uz: "`items()` har juftlikni `(kalit, qiymat)` şaklida beradi. Şuning uçun `for k, v in d.items()` işlaydi.", en: "`items()` yields each pair as `(key, value)`. That is why `for k, v in d.items()` works." },
    { uz: "Kalit allaqaçon bor edi, şuning uçun qiymat almaşdi: `1` → `9`.", en: "The key already existed, so its value was replaced: `1` → `9`." },
    { uz: "`del d['a']` kalitni ham, qiymatini ham öçiradi. Yöq kalitni öçirsang `KeyError` çiqadi.", en: "`del d['a']` removes both the key and its value. Deleting a missing key raises `KeyError`." },
    { uz: "`in` dictionaryda KALITLAR orasidan qidiradi. `\"x\"` kalit bor — `True`.", en: "`in` searches a dict's KEYS. `\"x\"` is a key, so `True`." }
  ],

  13: [
    { uz: "Avval qator, keyin ustun: `matrix[1]` → `[3,4]`, undan `[0]` → `3`.", en: "Row first, then column: `matrix[1]` → `[3,4]`, then `[0]` → `3`." },
    { uz: "`students[0]` list elementi (dict), `['name']` esa öşa dictning kaliti. Demak: list içida dict.", en: "`students[0]` is a list element (a dict) and `['name']` is that dict's key. So: dicts inside a list." },
    { uz: "`person` → `address` → `city`: ikkita dict bir-birining içida, yaʼni 2 daraja.", en: "`person` → `address` → `city`: two dicts nested, so 2 levels." },
    { uz: "`matrix[0]` → `[1,2,3]`, undan `[2]` → uçinçi element `3`.", en: "`matrix[0]` → `[1,2,3]`, then `[2]` → the third element, `3`." },
    { uz: "Içki loop taşqi loopning HAR aylanişida töliq işlaydi: 3 × 3 = 9.", en: "The inner loop runs fully on EVERY pass of the outer one: 3 × 3 = 9." },
    { uz: "`d['a']` → `[1,2,3]` (list), undan `[1]` → ikkinçi element `2`.", en: "`d['a']` → `[1,2,3]` (a list), then `[1]` → the second element, `2`." },
    { uz: "Ha — list içida dict aynan JSON ning şakli. API'lardan keladigan maʼlumot deyarli har doim şunday.", en: "Yes — a list of dicts is exactly the shape of JSON. Data from APIs almost always looks like this." },
    { uz: "`matrix[0]` bitta son emas, butun QATORNI (listni) qaytaradi. Son uçun ikkinçi index kerak.", en: "`matrix[0]` returns the whole ROW (a list), not a single number. You need a second index for that." },
    { uz: "Loop içida loop — nested loop. Taşqisi qatorlar böylab, içkisi har qator elementlari böylab yuradi.", en: "A loop inside a loop is a nested loop. The outer walks the rows, the inner walks each row's elements." },
    { uz: "`d['x']` → `{'y':5}` (dict), undan `['y']` → `5`.", en: "`d['x']` → `{'y':5}` (a dict), then `['y']` → `5`." }
  ],

  14: [
    { uz: "Tuple — `()`. Uni `[]` (list) va `{}` (set/dict) bilan adaştirma.", en: "A tuple uses `()`. Don't confuse it with `[]` (list) or `{}` (set/dict)." },
    { uz: "Tuple özgarmas: yaratilgandan keyin element qöşib ham, almaştirib ham bölmaydi.", en: "A tuple is immutable: once created you can neither add nor replace an element." },
    { uz: "Set takrorlarni taşlaydi: ikkita `2` bittaga aylanadi.", en: "A set drops duplicates: the two `2`s collapse into one." },
    { uz: "Set `{}` bilan yoziladi. Böş set esa `set()` — çunki `{}` böş dictionary.", en: "A set uses `{}`. An empty set is `set()`, because `{}` is an empty dictionary." },
    { uz: "`matrix[1]` → `[3,4]`, undan `[0]` → `3`. Avval qator, keyin ustun.", en: "`matrix[1]` → `[3,4]`, then `[0]` → `3`. Row first, column second." },
    { uz: "Index (`[0]`) list ekanini, kalit (`['name']`) dict ekanini körsatadi. Demak: list içida dict.", en: "The index (`[0]`) shows a list; the key (`['name']`) shows a dict. So: dicts inside a list." },
    { uz: "`get()` yöq kalitda xato bermaydi, `None` (yoki berilgan standart qiymat) qaytaradi.", en: "`get()` does not raise on a missing key; it returns `None` (or the fallback you supply)." },
    { uz: "`set` takrorlarni taşlaydi, `list` esa natijani listga qaytaradi → `[1, 2]`.", en: "`set` drops duplicates and `list` turns the result back into a list → `[1, 2]`." },
    { uz: "Vergul tuple yasaydi: `(5,)` — tuple, `(5)` — oddiy son.", en: "The comma makes the tuple: `(5,)` is a tuple, `(5)` is just a number." },
    { uz: "3 × 3 = 9. Içki loop taşqi loopning har aylanişida töliq işlaydi.", en: "3 × 3 = 9. The inner loop runs in full on each pass of the outer." }
  ],

  /* ---------------- HAFTA 3 ---------------- */

  15: [
    { uz: "`def` — funksiya yaratiş kalit sözi. `return` esa funksiya içida natija qaytariş uçun.", en: "`def` is the keyword that creates a function. `return` is used inside it to hand back a result." },
    { uz: "`def` faqat retseptni YOZADI. Çaqirilmagan funksiya heç narsa qilmaydi — heç narsa çiqmaydi.", en: "`def` only WRITES the recipe. An uncalled function does nothing, so nothing is printed." },
    { uz: "`print` ekranga çiqaradi va natija yöqoladi; `return` qiymatni qaytaradi va uni saqlaş, qöşiş, uzatiş mumkin.", en: "`print` shows on screen and the value is gone; `return` hands the value back so you can store, add or pass it on." },
    { uz: "`add(4,6)` → `return 4+6` → `10`. `print` uni ekranga çiqaradi.", en: "`add(4,6)` → `return 4+6` → `10`, which `print` then displays." },
    { uz: "`return` funksiyani DARHOL tugatadi — undan keyingi kod heç qaçon işlamaydi.", en: "`return` ends the function IMMEDIATELY — code after it never runs." },
    { uz: "`m` uçun argument berilmagan, şuning uçun default qiymat `'Hi'` işlatiladi.", en: "No argument was given for `m`, so its default `'Hi'` is used." },
    { uz: "Çaqirilmagan funksiya şunçaki tayyor turadi — xotirada saqlanadi, lekin bajarilmaydi.", en: "An uncalled function simply sits ready — stored in memory but not executed." },
    { uz: "Içkaridan taşqariga: `sq(2)` → 4, keyin `sq(4)` → 16.", en: "Inside out: `sq(2)` → 4, then `sq(4)` → 16." },
    { uz: "`f` faqat `print` qiladi, `return` yöq — şuning uçun `x` `None` böladi va `None * 2` `TypeError` beradi.", en: "`f` only prints and has no `return`, so `x` is `None` and `None * 2` raises `TypeError`." },
    { uz: "Ikkinçi `def` birinçisini bosib ötadi — Python uçun bu şunçaki nomga yangi qiymat beriş.", en: "The second `def` overwrites the first — to Python it is simply rebinding the name." }
  ],

  16: [
    { uz: "`y` uçun argument berilmadi, şuning uçun default `5` işlatiladi.", en: "No argument was passed for `y`, so the default `5` is used." },
    { uz: "Default qiymatli parametr oddiylaridan KEYIN turişi şart, aks holda Python argumentlarni taqsimlay olmaydi — `SyntaxError`.", en: "A defaulted parameter must come AFTER plain ones, otherwise Python cannot match arguments — `SyntaxError`." },
    { uz: "`*args` ortiqça pozitsion argumentlarni TUPLE qilib yiğadi.", en: "`*args` collects extra positional arguments into a TUPLE." },
    { uz: "`**kwargs` nomli argumentlarni DICT qilib yiğadi: `{'ism': 'Max'}`.", en: "`**kwargs` collects named arguments into a DICT: `{'name': 'Max'}`." },
    { uz: "`*args` böş ham bölişi mumkin — u holda böş tuple `()` böladi va funksiya bemalol işlaydi.", en: "`*args` may be empty — it becomes the empty tuple `()` and the function runs fine." },
    { uz: "Funksiya içidagi özgaruvçi LOCAL: faqat öşa funksiyada mavjud, tugaşi bilan yöqoladi.", en: "A variable inside a function is LOCAL: it exists only there and disappears when the function ends." },
    { uz: "Öqiş mumkin — Python nomni topmaganda taşqariga qaraydi. Lekin ÖZGARTIRIŞ uçun `global` kerak.", en: "Reading works — Python looks outward when a name is not local. But CHANGING it requires `global`." },
    { uz: "`global x` deb eʼlon qilsang, funksiya içidagi `x = ...` taşqaridagi özgaruvçini özgartiradi. Imkon qadar `return` işlatgan maʼqul.", en: "Declaring `global x` makes an assignment inside the function change the outer variable. Prefer returning a value where you can." },
    { uz: "`name=`, `age=` — nomli argumentlar, ular `**kwargs` ga tuşadi (yoki mos parametrlarga).", en: "`name=`, `age=` are named arguments; they land in `**kwargs` (or in the matching parameters)." },
    { uz: "Töğri tartib: oddiy → default → `*args` → `**kwargs`. Buzilsa `SyntaxError`.", en: "The correct order is: plain → default → `*args` → `**kwargs`. Break it and you get a `SyntaxError`." }
  ],

  17: [
    { uz: "`def` funksiyani YARATADI. Çaqiriş esa nom va qavs bilan: `f()`.", en: "`def` CREATES the function. Calling it is done with the name and brackets: `f()`." },
    { uz: "`print` ekranga çiqaradi, `return` qiymat qaytaradi. Faqat `print` qilgan funksiyaning natijasini işlatib bölmaydi.", en: "`print` displays; `return` gives a value back. You cannot reuse the result of a function that only prints." },
    { uz: "Argument berilmaganda default işlaydi — `y` `5` böladi.", en: "The default applies when no argument is given — `y` becomes `5`." },
    { uz: "`*args` — tuple (pozitsion argumentlar).", en: "`*args` is a tuple of positional arguments." },
    { uz: "`**kwargs` — dict (nomli argumentlar).", en: "`**kwargs` is a dict of named arguments." },
    { uz: "Local: faqat öşa funksiya içida körinadi va tugaşi bilan yöqoladi.", en: "Local: visible only inside that function, and gone once it ends." },
    { uz: "`return` funksiyani tugatadi — undan keyingi qatorlar heç qaçon bajarilmaydi.", en: "`return` ends the function, so lines after it never execute." },
    { uz: "Default qiymatli parametr oddiysidan oldin kelolmaydi — `SyntaxError`.", en: "A defaulted parameter cannot precede a plain one — `SyntaxError`." },
    { uz: "Ha, va bu yaxşi amaliyot: katta masala kiçik funksiyalarga bölinadi (dekompozitsiya).", en: "Yes, and it is good practice: a big problem is split into small functions (decomposition)." },
    { uz: "`global` kalit sözi kerak. Lekin toza yeçim — qiymatni `return` qilib, taşqarida saqlaş.", en: "You need the `global` keyword — though the clean solution is to return the value and store it outside." }
  ],

  18: [
    { uz: "Index 0 dan: `'Python'[0]` — birinçi harf `P`.", en: "Indexing starts at 0: `'Python'[0]` is the first letter, `P`." },
    { uz: "`[-1]` oxirgi belgini beradi — `'Python'` ning oxirgisi `n`.", en: "`[-1]` gives the last character — the last letter of `'Python'` is `n`." },
    { uz: "`[1:3]` — 1 va 2-indekslar, yaʼni `'e'` va `'l'` → `'el'`. `stop` (3) kirmaydi.", en: "`[1:3]` takes indexes 1 and 2 — `'e'` and `'l'` → `'el'`. The `stop` (3) is excluded." },
    { uz: "Qadam `-1` — teskari yönaliş. Bu satrni ağdarişning eng qisqa usuli.", en: "A step of `-1` reverses direction — the shortest way to flip a string." },
    { uz: "String ÖZGARMAS: `s[0]='x'` `TypeError` beradi. Yangi string yasaş kerak: `'x' + s[1:]`.", en: "Strings are IMMUTABLE: `s[0]='x'` raises `TypeError`. Build a new one: `'x' + s[1:]`." },
    { uz: "`split()` stringni berilgan belgi böyiça kesib, LIST qaytaradi.", en: "`split()` cuts the string at the given separator and returns a LIST." },
    { uz: "`join()` — yelim oldinda: `'-'.join([...])` bölaklarni `-` bilan yopiştiradi.", en: "With `join()` the glue comes first: `'-'.join([...])` sticks the pieces together with `-`." },
    { uz: "`'hello'` da `l` ikki marta uçraydi (`he-l-l-o`).", en: "`'hello'` contains `l` twice (`he-l-l-o`)." },
    { uz: "`strip()` faqat BOŞI va OXIRIDAGI böşliqlarni oladi; örtadagilar qoladi.", en: "`strip()` removes whitespace only at the START and END; inner spaces stay." },
    { uz: "`in` string içida bölak qidiradi va `bool` qaytaradi — `if` ga töğridan-töğri tayyor.", en: "`in` looks for a substring and returns a `bool` — ready to drop straight into an `if`." }
  ],

  19: [
    { uz: "f-string içidagi ifoda hisoblanadi: `2+3` → `5`.", en: "The expression inside an f-string is evaluated: `2+3` → `5`." },
    { uz: "`.2f` — ikki xona kasr bilan yaxlitlaş. `3.14159` → `3.14`.", en: "`.2f` rounds to two decimal places: `3.14159` → `3.14`." },
    { uz: "`,` mingliklarni ajratadi — hisobotlarda öqişni ança osonlaştiradi.", en: "`,` groups thousands — it makes reports far easier to read." },
    { uz: "`.0%` qiymatni 100 ga köpaytirib, `%` qöşadi va kasrsiz çiqaradi: `0.5` → `50%`.", en: "`.0%` multiplies by 100, appends `%` and shows no decimals: `0.5` → `50%`." },
    { uz: "`\\n` — yangi qator belgisi. `print` içida işlatilsa matn keyingi qatordan davom etadi.", en: "`\\n` is the newline character. Inside `print` it moves the text to the next line." },
    { uz: "`\\t` — tabulyatsiya (katta böşliq). Oddiy jadval çiqarişda qulay.", en: "`\\t` is a tab (a wide space) — handy for quick tabular output." },
    { uz: "`>` matnni öngga tekislaydi (çapdan böşliq qöşadi). `<` çapga, `^` markazga.", en: "`>` right-aligns (padding on the left). `<` is left, `^` is centre." },
    { uz: "`05d` — 5 xona, yetmagan joyi nol bilan töldiriladi: `42` → `00042`.", en: "`05d` means five digits, zero-padded: `42` → `00042`." },
    { uz: "`r\"...\"` — xom (raw) string: `\\n` maxsus belgi emas, oddiy ikki belgi bölib qoladi. Windows yöllari uçun kerak.", en: "`r\"...\"` is a raw string: `\\n` is no longer special, just two characters. Needed for Windows paths." },
    { uz: "`^` matnni markazga tekislaydi, ikki tomondan teng böşliq qöşadi.", en: "`^` centres the text, padding both sides equally." }
  ],

  20: [
    { uz: "Index 0 dan — birinçi harf `P`.", en: "Indexing starts at 0 — the first letter is `P`." },
    { uz: "`[::-1]` — teskari öqiş: `abc` → `cba`.", en: "`[::-1]` reads backwards: `abc` → `cba`." },
    { uz: "String özgarmas — element almaştirsang `TypeError`. Yangi string yasaş kerak.", en: "Strings are immutable — assigning to an element raises `TypeError`. Build a new string instead." },
    { uz: "`split(',')` vergul böyiça kesadi va list qaytaradi.", en: "`split(',')` cuts at commas and returns a list." },
    { uz: "`'-'.join([...])` — bölaklarni `-` bilan birlaştiradi va string qaytaradi.", en: "`'-'.join([...])` joins the pieces with `-` and returns a string." },
    { uz: "`strip()` boşi va oxiridagi böşliqlarni oladi.", en: "`strip()` removes whitespace at the start and end." },
    { uz: "`.2f` — ikki xona kasr: `3.14`.", en: "`.2f` means two decimal places: `3.14`." },
    { uz: "`\\n` — yangi qatorga ötiş belgisi.", en: "`\\n` is the newline character." },
    { uz: "`in` bölak bor-yöqligini tekşiradi va `True` qaytaradi.", en: "`in` checks for a substring and returns `True` here." },
    { uz: "`upper()` hamma harfni katta qiladi va YANGI string qaytaradi (aslini özgartirmaydi).", en: "`upper()` uppercases everything and returns a NEW string (the original is untouched)." }
  ],

  21: [
    { uz: "Har element 2 ga köpayadi: `range(3)` → 0,1,2 → `[0,2,4]`.", en: "Each element is doubled: `range(3)` → 0,1,2 → `[0,2,4]`." },
    { uz: "Oxiridagi `if` — FILTR: faqat juftlar qoladi → `[0,2,4]`.", en: "The trailing `if` is a FILTER: only even numbers remain → `[0,2,4]`." },
    { uz: "Töğri tartib: `[ifoda for x in ketma-ketlik]` — avval nima yasaymiz, keyin qayerdan olamiz.", en: "The correct order is `[expression for x in sequence]` — what we build first, where it comes from second." },
    { uz: "Har sözga `upper()` qöllaniladi: `['a','b']` → `['A','B']`.", en: "`upper()` is applied to each word: `['a','b']` → `['A','B']`." },
    { uz: "`len('hi')` = 2, `len('bye')` = 3 → `[2,3]`.", en: "`len('hi')` is 2 and `len('bye')` is 3 → `[2,3]`." },
    { uz: "Oxirdagi `if` filtrlaydi — mos kelmagan elementlar natijaga umuman tuşmaydi.", en: "A trailing `if` filters — non-matching elements never enter the result." },
    { uz: "`if-else` boşda turganda har element natijaga tuşadi, faqat qiymati özgaradi: 1 toq → `'t'`, 2 juft → `'j'`.", en: "With `if-else` at the front every element appears, only its value changes: 1 is odd → `'t'`, 2 is even → `'j'`." },
    { uz: "Comprehension qisqaroq va Python uni içki darajada optimallaştirgani uçun tezroq ham.", en: "A comprehension is shorter, and faster too because Python optimises it internally." },
    { uz: "Figurali qavs va `kalit: qiymat` — bu dict comprehension: `{0:0, 1:1, 2:4}`.", en: "Curly braces with `key: value` make a dict comprehension: `{0:0, 1:1, 2:4}`." },
    { uz: "String ham ketma-ketlik — har belgisi böylab yuriş mumkin: `['a','b','c']`.", en: "A string is a sequence too, so you can iterate its characters: `['a','b','c']`." }
  ],

  22: [
    { uz: "Har element ikkiga köpayadi: `[0,2,4]`.", en: "Each element is doubled: `[0,2,4]`." },
    { uz: "`if x%2==0` — filtr, faqat juftlar qoladi.", en: "`if x%2==0` filters, leaving only the even numbers." },
    { uz: "`[ifoda for x in seq]` — avval nima yasaymiz, keyin manba.", en: "`[expression for x in seq]` — the result first, the source second." },
    { uz: "`print` körsatadi, `return` qiymat qaytaradi va uni keyin işlatiş mumkin.", en: "`print` displays; `return` gives back a value you can use later." },
    { uz: "`*args` — çeksiz pozitsion argumentlarni tuple qilib yiğadi.", en: "`*args` gathers any number of positional arguments into a tuple." },
    { uz: "`split(',')` vergul böyiça kesib list qaytaradi.", en: "`split(',')` cuts at commas and returns a list." },
    { uz: "`.1f` — bitta xona kasr, şuning uçun `5` → `5.0`.", en: "`.1f` means one decimal place, so `5` becomes `5.0`." },
    { uz: "Har elementga `upper()` qöllaniladi → `['A']`.", en: "`upper()` is applied to each element → `['A']`." },
    { uz: "`get()` ning ikkinçi argumenti — kalit yöq bölganda qaytariladigan qiymat, yaʼni `0`.", en: "The second argument of `get()` is what to return when the key is missing — here `0`." },
    { uz: "Comprehension oddiy loopdan qisqa va tezroq, lekin faqat YANGI maʼlumot yasaş uçun.", en: "A comprehension is shorter and faster than a plain loop — but only for BUILDING new data." }
  ],

  /* ---------------- HAFTA 4 ---------------- */

  23: [
    { uz: "`try/except` xatoni uşlab, dasturning yiqilişini oldini oladi. Foydalanuvçi kutilmagan narsa kiritsa ham dastur işlaşda davom etadi.", en: "`try/except` catches an error and keeps the program from crashing, so it survives unexpected input." },
    { uz: "Tur töğri (string berildi), lekin QIYMAT songa aylanmaydi — bu `ValueError`.", en: "The type is right (a string was given) but the VALUE cannot become a number — that is a `ValueError`." },
    { uz: "Nolga böliş matematik jihatdan aniqlanmagan — `ZeroDivisionError`.", en: "Division by zero is mathematically undefined — `ZeroDivisionError`." },
    { uz: "Bu yerda TURLAR mos kelmaydi (`str` va `int`) — `TypeError`. `ValueError` dan farqi şu.", en: "Here the TYPES do not match (`str` and `int`) — a `TypeError`. That is what distinguishes it from `ValueError`." },
    { uz: "`except` faqat `try` içida xato çiqqanda işlaydi. Xato bölmasa u butunlay taşlab ketiladi.", en: "`except` runs only when the `try` block raised an error. Otherwise it is skipped entirely." },
    { uz: "`else` — xato BÖLMAGANDA işlaydi. \"Hammasi joyida bölsa, endi şuni qil\" degani.", en: "`else` runs when there was NO error — \"if all went well, now do this\"." },
    { uz: "`finally` HAR DOIM işlaydi: xato böldimi, bölmadimi, hatto `return` bölsa ham. Tozalaş işlari uçun.", en: "`finally` ALWAYS runs — error or not, even after a `return`. It is for cleanup." },
    { uz: "`as e` xato obyektini `e` ga boğlaydi; `print(e)` bilan tafsilotni köriş mumkin.", en: "`as e` binds the exception object to `e`; `print(e)` shows the details." },
    { uz: "Listda bunday örin yöq — `IndexError`. Dictionaryda bölsa `KeyError` bölardi.", en: "There is no such position in the list — `IndexError`. In a dictionary it would be a `KeyError`." },
    { uz: "Uşlanmagan xato dasturni töxtatadi va traceback çiqaradi. Şuning uçun xavfli joylarni `try` ga öraş kerak.", en: "An uncaught error stops the program and prints a traceback. That is why risky spots belong in a `try`." }
  ],

  24: [
    { uz: "`'r'` — read (öqiş). Bu standart rejim ham: `open(nom)` avtomatik `'r'` böladi.", en: "`'r'` means read. It is also the default: `open(name)` implies `'r'`." },
    { uz: "`'w'` faylni oçiş bilan TOZALAYDI. Avvalgi maʼlumotni saqlaş uçun `'a'` işlat.", en: "`'w'` WIPES the file on opening. Use `'a'` to keep what was there." },
    { uz: "`'a'` — append: yozilgan narsa faylning oxiriga qöşiladi.", en: "`'a'` means append: what you write goes to the end of the file." },
    { uz: "`with` blokdan çiqişda faylni AVTOMATIK yopadi — hatto xato çiqsa ham. Qölda `close()` yoziş unutiladi.", en: "`with` closes the file AUTOMATICALLY when the block ends, even on an error. A manual `close()` gets forgotten." },
    { uz: "`read()` butun faylni bitta STRING qilib qaytaradi. Katta fayl uçun xotira yetmasligi mumkin.", en: "`read()` returns the entire file as one STRING. For a big file that may exhaust memory." },
    { uz: "`readlines()` har qatorni alohida element qilib LIST qaytaradi (har birida `\\n` bilan).", en: "`readlines()` returns a LIST with each line as an element (each still ending in `\\n`)." },
    { uz: "`\\n` — yangi qator. Faylda har qator şu belgi bilan tugaydi.", en: "`\\n` is a newline. In a file each line ends with it." },
    { uz: "Yöq faylni `'r'` bilan oçib bölmaydi — `FileNotFoundError`. `'w'` yoki `'a'` esa yaratadi.", en: "You cannot open a missing file with `'r'` — `FileNotFoundError`. `'w'` and `'a'` would create it." },
    { uz: "Öqilgan har qator oxirida körinmas `\\n` böladi; `strip()` uni olib taşlaydi va ikki karra böş qatorning oldini oladi.", en: "Every line read ends with an invisible `\\n`; `strip()` removes it and prevents double line breaks." },
    { uz: "`write()` faqat STRING qabul qiladi. Son yoziş uçun `f.write(str(5))` yoki `f.write(f\"{5}\")`.", en: "`write()` accepts only a STRING. To write a number use `f.write(str(5))` or `f.write(f\"{5}\")`." }
  ],

  25: [
    { uz: "`'abc'` ni songa aylantirib bölmaydi — `ValueError` (tur töğri, qiymat notöğri).", en: "`'abc'` cannot become a number — `ValueError` (right type, wrong value)." },
    { uz: "Nolga böliş — `ZeroDivisionError`.", en: "Dividing by zero gives `ZeroDivisionError`." },
    { uz: "`finally` har doim işlaydi — xato bölsa ham, bölmasa ham.", en: "`finally` always runs — with or without an error." },
    { uz: "`else` faqat xato BÖLMAGANDA işlaydi.", en: "`else` runs only when there was NO error." },
    { uz: "`'w'` yoziş rejimi — mavjud faylni tozalaydi.", en: "`'w'` is write mode — it wipes an existing file." },
    { uz: "`'a'` qöşiş rejimi — oxiriga yozadi, eskisini saqlaydi.", en: "`'a'` is append mode — it writes at the end and keeps what was there." },
    { uz: "`with` faylni avtomatik yopadi, şuning uçun maʼlumot yöqolmaydi va resurs böşatiladi.", en: "`with` closes the file automatically, so no data is lost and resources are freed." },
    { uz: "`'r'` fayl mavjud bölişini talab qiladi — yöq bölsa `FileNotFoundError`.", en: "`'r'` requires the file to exist — otherwise `FileNotFoundError`." },
    { uz: "`readlines()` qatorlar LISTini qaytaradi.", en: "`readlines()` returns a LIST of lines." },
    { uz: "`as e` — `e` içida xato haqidagi maʼlumot böladi.", en: "With `as e`, the variable `e` holds information about the error." }
  ],

  26: [
    { uz: "Modul — boşqa birov yozgan tayyor kod töplami. `import` bilan çaqirib, funksiyalaridan foydalanasan.", en: "A module is a ready-made bundle of code someone else wrote. You `import` it and use its functions." },
    { uz: "`import math` butun modulni oladi, şuning uçun nomni töliq yoziş kerak: `math.sqrt()`.", en: "`import math` brings in the whole module, so you write the full name: `math.sqrt()`." },
    { uz: "`randint(a, b)` — a dan b GAÇA (ikkalasi ham kiradi) tasodifiy butun son.", en: "`randint(a, b)` returns a random integer from a to b, INCLUSIVE of both." },
    { uz: "`choice()` ketma-ketlikdan bitta tasodifiy element tanlaydi.", en: "`choice()` picks one random element from a sequence." },
    { uz: "`from math import sqrt` nomni töğridan-töğri olib keladi — `math.` prefiksi kerak emas.", en: "`from math import sqrt` brings the name in directly — no `math.` prefix needed." },
    { uz: "`as` — modulga qisqa nom (taxallus) beriş. `numpy` ni har safar yozmaslik uçun `np`.", en: "`as` gives the module a short alias — `np` so you need not type `numpy` every time." },
    { uz: "`math.pi` — funksiya emas, DOIMIY qiymat (3.14159…). Şuning uçun qavssiz yoziladi.", en: "`math.pi` is not a function but a CONSTANT (3.14159…), so it takes no brackets." },
    { uz: "Har `.py` fayl modul böla oladi: `yordamchi.py` yasab, `import yordamchi` deb çaqirasan.", en: "Any `.py` file can be a module: create `helpers.py` and call `import helpers`." },
    { uz: "`shuffle()` listni JOYIDA aralaştiradi va `None` qaytaradi — natijani özgaruvçiga solma.", en: "`shuffle()` shuffles the list IN PLACE and returns `None` — do not assign its result." },
    { uz: "NumPy standart kutubxonada yöq: avval `pip install numpy`, keyin `import numpy`.", en: "NumPy is not in the standard library: first `pip install numpy`, then `import numpy`." }
  ],

  27: [
    { uz: "`class` — klass yaratiş kalit sözi. `def` funksiya uçun.", en: "`class` creates a class; `def` is for functions." },
    { uz: "`__init__` obyekt YARATILGANDA avtomatik çaqiriladi — uni özing çaqirmaysan.", en: "`__init__` is called automatically when the object is CREATED — you never call it yourself." },
    { uz: "`self` — şu obyektning özi. `self.ism` — \"aynan şu obyektning ismi\".", en: "`self` is this very object. `self.name` means \"the name of this particular object\"." },
    { uz: "`Student` — şablon (klass); `s` esa undan yasalgan obyekt (nusxa).", en: "`Student` is the template (the class); `s` is the object made from it (an instance)." },
    { uz: "`self.name = name` obyektga `name` atributini yopiştiradi — u obyekt bilan birga yaşaydi.", en: "`self.name = name` attaches a `name` attribute to the object, and it lives as long as the object." },
    { uz: "Har metodning birinçi parametri `self` bölişi şart — aks holda `TypeError`.", en: "Every method's first parameter must be `self`, otherwise you get a `TypeError`." },
    { uz: "`car.brand` — nuqta orqali olingan MAʼLUMOT, yaʼni atribut. Qavs bölganda metod bölardi.", en: "`car.brand` is DATA reached through a dot — an attribute. With brackets it would be a method." },
    { uz: "Metod — klass içidagi funksiya. U obyektning HARAKATINI ifodalaydi.", en: "A method is a function inside a class; it expresses what the object DOES." },
    { uz: "Har obyekt öz atributlariga ega — bitta klassdan yasalgan bölsa ham qiymatlari har xil böladi.", en: "Each object has its own attributes — same class, different values." },
    { uz: "Kelişuv (PEP 8): klass nomi katta harf bilan (`Student`), funksiya nomi kiçik harf bilan (`get_name`).", en: "By convention (PEP 8) class names start with a capital (`Student`), function names are lowercase (`get_name`)." }
  ],

  28: [
    { uz: "Inheritance — bir klassning boşqasidan atribut va metodlarni MEROS olişi. Umumiy kodni takrorlamaslik uçun.", en: "Inheritance is one class taking on another's attributes and methods — so shared code is not repeated." },
    { uz: "Qavs içidagi nom — OTA klass. `Dog` `Animal` ning hamma metodini oladi va öziniki qöşadi.", en: "The name in brackets is the PARENT class. `Dog` gains all of `Animal`'s methods and adds its own." },
    { uz: "`super()` ota klassga murojaat qiladi — köpinça uning `__init__` ini çaqiriş uçun.", en: "`super()` reaches the parent class — most often to call its `__init__`." },
    { uz: "Override — otadan meros olingan metodni bola klassda qayta yoziş. Nom bir xil bölişi şart.", en: "Overriding means rewriting an inherited method in the child. The name must match." },
    { uz: "Ha — meros olingan barça metodlar bola obyektida işlaydi, qayta yoziş şart emas.", en: "Yes — every inherited method works on the child object without being rewritten." },
    { uz: "`super().__init__()` ota örnatadigan atributlarni yaratadi. Busiz ular yöq böladi va keyin `AttributeError` çiqadi.", en: "`super().__init__()` creates the attributes the parent sets. Without it they are missing and you hit `AttributeError` later." },
    { uz: "Ha — `self.metod()` orqali. Bu klassni içkaridan tartibga solişning asosiy usuli.", en: "Yes — via `self.method()`. It is the main way to organise a class internally." },
    { uz: "Bir xil nomli metod turli klasslarda turliça işlaşi — bu override, yaʼni polimorfizm.", en: "The same method name behaving differently per class is overriding — that is polymorphism." },
    { uz: "Ota klass — parent yoki base class. Bola esa çild/derived class deyiladi.", en: "The parent class is also called the base class; the child is the derived class." },
    { uz: "Meros umumiy kodni bir marta yozib, hamma bola klasslarda işlatiş imkonini beradi — takrorlaniş yöqoladi.", en: "Inheritance lets you write shared code once and use it in every child class — repetition disappears." }
  ],

  29: [
    { uz: "`import math` butun modulni oladi, şuning uçun `math.sqrt()` deb töliq yoziladi.", en: "`import math` brings the whole module, so you write `math.sqrt()` in full." },
    { uz: "`__init__` obyekt yaratilganda avtomatik işlaydi (konstruktor).", en: "`__init__` runs automatically when the object is created (the constructor)." },
    { uz: "`self` — şu obyektning özi; u orqali obyektning atribut va metodlariga murojaat qilinadi.", en: "`self` is the object itself; through it you reach the object's attributes and methods." },
    { uz: "Qavs içidagi klass — ota. `Dog` `Animal` dan meros oladi.", en: "The class in brackets is the parent: `Dog` inherits from `Animal`." },
    { uz: "`super()` ota klassni çaqiradi — ayniqsa `super().__init__()` şaklida.", en: "`super()` calls the parent class — most often as `super().__init__()`." },
    { uz: "`randint(1,6)` — 1 dan 6 gaça (ikkalasi ham kiradi) tasodifiy butun son. Zar taşlaş aynan şu.", en: "`randint(1,6)` gives a random integer from 1 to 6 inclusive — exactly a dice roll." },
    { uz: "Override — meros olingan metodni bola klassda qayta yoziş.", en: "Overriding is rewriting an inherited method in the child class." },
    { uz: "Metod — klass içidagi funksiya, obyektning harakati.", en: "A method is a function inside a class — what the object does." },
    { uz: "`from math import sqrt` dan keyin nom töğridan-töğri işlatiladi: `sqrt(16)`.", en: "After `from math import sqrt` you use the name directly: `sqrt(16)`." },
    { uz: "Atribut — obyektning maʼlumoti (xususiyati). Metod esa harakati.", en: "An attribute is the object's data (a property); a method is its action." }
  ],

  30: [
    { uz: "HTML — veb sahifa belgilaş tili, Python asoslariga kirmaydi. Qolgan uçtasi — kursning özagi.", en: "HTML is a web markup language, not part of Python fundamentals. The other three are the core of the course." },
    { uz: "`class` — obyekt yasaş uçun şablon (qolip). Obyekt esa şu qolipdan çiqqan nusxa.", en: "A `class` is the template for making objects; an object is an instance made from it." },
    { uz: "`input()` istisnosiz `str` qaytaradi — 30 kunlik kursning eng köp takrorlangan qoidasi.", en: "`input()` returns `str` without exception — the most repeated rule of the whole course." },
    { uz: "`//` — butun böliş: 7/2 = 3.5 → 3.", en: "`//` is floor division: 7/2 = 3.5 → 3." },
    { uz: "`try/except` xatoni uşlab, dasturning yiqilişiga yöl qöymaydi.", en: "`try/except` catches an error and stops the program from crashing." },
    { uz: "`range(3)` — 0, 1, 2, comprehension esa ularni listga yiğadi: `[0,1,2]`.", en: "`range(3)` yields 0, 1, 2 and the comprehension collects them: `[0,1,2]`." },
    { uz: "`with open()` faylni oçadi va blok tugaşi bilan AVTOMATIK yopadi.", en: "`with open()` opens the file and closes it AUTOMATICALLY when the block ends." },
    { uz: "Ha — qavs içidagi klass ota hisoblanadi, yaʼni bu inheritance.", en: "Yes — the class in brackets is the parent, so this is inheritance." },
    { uz: "GitHub — kod portfoliosi uçun standart joy. Iş beruvçilar birinçi navbatda şuni köradi.", en: "GitHub is the standard home for a code portfolio, and the first place employers look." },
    { uz: "30 kun Python asoslarini töliq qopladi — endi PCEP yoki DataCamp Associate kabi sertifikat imtihoniga tayyorsan.", en: "Thirty days have covered the Python fundamentals in full — you are ready for a certification exam such as PCEP or the DataCamp Associate." }
  ]
};
