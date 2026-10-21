/* ==========================================================================
   QUIZ_L10N — test savollarining o'zbekcha tarjimasi
   --------------------------------------------------------------------------
   Asl kursda 1, 5, 6, 8, 12 va 15-kunlarning testlari butunlay INGLIZCHA
   yozilgan edi — interfeys o'zbekcha bo'lsa ham. Bu fayl o'sha kunlarni
   tarjima qiladi.

   Nega course.js ichida emas? Chunki course.js — asosiy manba; tarjimani
   ustiga qo'yiladigan qatlam qilib ajratsak, asl ma'lumot buzilmaydi va
   yangi tarjimani xohlagancha qo'shish mumkin.

   MUHIM: variantlar tartibi asl ma'lumotdagidek qolishi SHART, chunki
   `correct` indeksi shu tartibga bog'langan.

   Format: QUIZ_L10N[kun][savol_indeksi] = { q: {uz}, opts: {uz: [...]} }
   ========================================================================== */

window.QUIZ_L10N = {

  1: [
    { q: { uz: "Qaysi biri to'g'ri o'zgaruvchi nomi?" }, opts: { uz: ["2age", "open price", "open_price", "price-2"] } },
    { q: { uz: "`print(type(3.14))` nima chiqaradi?" }, opts: { uz: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "3.14"] } },
    { q: { uz: "`\"2\" + \"2\"` natijasi?" }, opts: { uz: ["4", "22", "\"2 2\"", "Xato"] } },
    { q: { uz: "`input()` har doim qanday tur qaytaradi?" }, opts: { uz: ["int", "float", "str", "Vaziyatga qarab"] } },
    { q: { uz: "`True` qaysi turga tegishli?" }, opts: { uz: ["int", "str", "bool", "float"] } },
    { q: { uz: "`ism=\"Max\"; print(f\"Salom {ism}!\")` nima chiqaradi?" }, opts: { uz: ["Salom {ism}!", "Salom Max!", "Salom ism!", "f\"Salom Max!\""] } },
    { q: { uz: "Matnni butun songa qaysi funksiya aylantiradi?" }, opts: { uz: ["str()", "float()", "int()", "type()"] } },
    { q: { uz: "`yosh=input('Yosh: '); print(yosh + 5)` — muammo nimada?" }, opts: { uz: ["print noto'g'ri", "yosh — string, songa qo'shib bo'lmaydi", "input matn talab qilmaydi", "Muammo yo'q"] } },
    { q: { uz: "Qaysi biri float?" }, opts: { uz: ["20", "\"19.99\"", "19.99", "True"] } },
    { q: { uz: "Python'da `=` nima qiladi?" }, opts: { uz: ["Tenglikni tekshiradi", "O'ngdagini chapga soladi", "Solishtiradi", "Chop etadi"] } }
  ],

  5: [
    { q: { uz: "`=` va `==` farqi nimada?" }, opts: { uz: ["Farqi yo'q", "= soladi, == tenglikni tekshiradi", "== soladi, = tekshiradi", "== faqat sonlar uchun"] } },
    { q: { uz: "`print(20 != 20)` nima chiqaradi?" }, opts: { uz: ["True", "False", "20", "Xato"] } },
    { q: { uz: "`yosh=15`; `if yosh>=18: 'Katta' else: 'Kichik'` — natija?" }, opts: { uz: ["Katta", "Kichik", "Ikkalasi", "Hech narsa"] } },
    { q: { uz: "`ball=85`; `elif` bilan baho (90/70/30) — natija?" }, opts: { uz: ["A'lo", "Yaxshi", "Yaxshi va O'tdi", "O'tdi"] } },
    { q: { uz: "`if ball>=60` ni `elif ball>=90` dan OLDIN yozish — xatosi nimada?" }, opts: { uz: ["elif noto'g'ri", "Tartib teskari: 95 ham avval 60 ga tushadi", "else yo'q", "Xato yo'q"] } },
    { q: { uz: "`True and False` natijasi?" }, opts: { uz: ["True", "False", "Xato", "None"] } },
    { q: { uz: "`True or False` natijasi?" }, opts: { uz: ["True", "False", "Xato", "None"] } },
    { q: { uz: "`if yosh>=18 and pasport:` — qachon ishlaydi?" }, opts: { uz: ["Faqat yosh 18+ bo'lsa", "Faqat pasport bo'lsa", "Ikkalasi ham True bo'lsa", "Bittasi True bo'lsa"] } },
    { q: { uz: "`not True` natijasi?" }, opts: { uz: ["True", "False", "not", "Xato"] } },
    { q: { uz: "`yosh=25`; `type(yosh > 18)` nima beradi?" }, opts: { uz: ["int", "bool", "str", "True"] } }
  ],

  6: [
    { q: { uz: "Listning birinchi elementi qaysi indeksda?" }, opts: { uz: ["1", "0", "-1", "[0:1]"] } },
    { q: { uz: "`m=[\"a\",\"b\",\"c\"]; print(m[-1])` nima chiqaradi?" }, opts: { uz: ["a", "c", "b", "Xato"] } },
    { q: { uz: "`len([10,20,30,40])` nechaga teng?" }, opts: { uz: ["3", "4", "100", "list"] } },
    { q: { uz: "`n=[10,20,30,40,50]; n[1:3]` nima beradi?" }, opts: { uz: ["[20,30,40]", "[10,20,30]", "[20,30]", "[20]"] } },
    { q: { uz: "Listning OXIRIGA qaysi metod qo'shadi?" }, opts: { uz: ["insert()", "append()", "add()", "pop()"] } },
    { q: { uz: "`m=[\"a\",\"b\",\"c\"]; m[1]=\"x\"; print(m)` natijasi?" }, opts: { uz: ["['a','b','c']", "['x','b','c']", "['a','x','c']", "Xato"] } },
    { q: { uz: "`[]` va `()` farqi nimada?" }, opts: { uz: ["Farqi yo'q", "[] list — o'zgaruvchan, () tuple — o'zgarmas", "[] faqat sonlar uchun", "() tezroq"] } },
    { q: { uz: "`s=(1,2,3); s.append(4)` — nega xato beradi?" }, opts: { uz: ["append noto'g'ri yozilgan", "tuple'da append metodi yo'q", "Tirnoq kerak", "Xato bermaydi"] } },
    { q: { uz: "Ballar listining o'rtachasi qanday hisoblanadi?" }, opts: { uz: ["max/len", "sum*len", "sum/len", "len/sum"] } },
    { q: { uz: "`h=[\"a\",\"b\",\"c\",\"d\",\"e\",\"f\"]; h[::2]` natijasi?" }, opts: { uz: ["['a','b']", "['a','c','e']", "['b','d','f']", "Hammasi"] } }
  ],

  8: [
    { q: { uz: "`for i in range(3): print(i)` nima chiqaradi?" }, opts: { uz: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"] } },
    { q: { uz: "`for` uchun nima MAJBURIY?" }, opts: { uz: ["Faqat :", "Faqat ichkariga surish", "Ham :, ham ichkariga surish", "Hech narsa"] } },
    { q: { uz: "`range(1, 5)` nima beradi?" }, opts: { uz: ["1 2 3 4 5", "0 1 2 3 4", "1 2 3 4", "1 2 3 4 5 6"] } },
    { q: { uz: "`son=1; while son<=5: print(son)` — muammo nimada?" }, opts: { uz: ["while noto'g'ri", "`son += 1` yo'q — cheksiz loop", ": qo'yilmagan", "Muammo yo'q"] } },
    { q: { uz: "`for i in range(6): if i==3: break; print(i)` natijasi?" }, opts: { uz: ["0 1 2", "0 1 2 3", "0 1 2 4 5", "0 dan 5 gacha"] } },
    { q: { uz: "`for i in range(5): if i==2: continue; print(i)` natijasi?" }, opts: { uz: ["0 1 2 3 4", "0 1 3 4", "0 1", "2"] } },
    { q: { uz: "`nums=[10,20,30]; total=0; for n in nums: total+=n` — `total`?" }, opts: { uz: ["10", "30", "60", "[10,20,30]"] } },
    { q: { uz: "`range(0, 10, 2)` nima beradi?" }, opts: { uz: ["0 1 2 ... 10", "0 2 4 6 8", "0 2 4 6 8 10", "2 4 6 8 10"] } },
    { q: { uz: "`break` va `continue` farqi?" }, opts: { uz: ["Bir xil", "break loopni to'xtatadi, continue aylanishni o'tkazadi", "continue to'xtatadi", "Ikkalasi to'xtatadi"] } },
    { q: { uz: "Nega `sum` ni o'zgaruvchi nomi qilib olmaslik kerak?" }, opts: { uz: ["Juda uzun", "sum — Python funksiyasi, uni bosib o'tasan", "Faqat sonlar uchun", "Sababi yo'q"] } }
  ],

  12: [
    { q: { uz: "Dictionary qaysi qavs bilan yoziladi?" }, opts: { uz: ["[]", "()", "{}", "<>"] } },
    { q: { uz: "`d={\"a\":1}; d[\"a\"]` nima beradi?" }, opts: { uz: ["a", "1", "{a:1}", "Xato"] } },
    { q: { uz: "Dictionary qiymatiga nima orqali murojaat qilinadi?" }, opts: { uz: ["index", "kalit (key)", "o'rin", "qiymat"] } },
    { q: { uz: "`d={\"x\":1}; d[\"y\"]=2` nima qiladi?" }, opts: { uz: ["Xato", "y kalitini qo'shadi", "x ni o'zgartiradi", "Hech narsa"] } },
    { q: { uz: "`d.get(\"z\",\"yo'q\")` — z kaliti bo'lmasa?" }, opts: { uz: ["Xato", "yo'q", "z", "None obyekti"] } },
    { q: { uz: "`d={\"a\":1,\"b\":2}; len(d)` nechaga teng?" }, opts: { uz: ["1", "2", "4", "Xato"] } },
    { q: { uz: "`items()` nima qaytaradi?" }, opts: { uz: ["Faqat kalitlar", "Faqat qiymatlar", "kalit-qiymat juftliklari", "Uzunlik"] } },
    { q: { uz: "`d={\"a\":1}; d[\"a\"]=9; d[\"a\"]` nima?" }, opts: { uz: ["1", "9", "[1,9]", "Xato"] } },
    { q: { uz: "`del d['a']` nima qiladi?" }, opts: { uz: ["a ni qo'shadi", "a kalitini o'chiradi", "Hammasini tozalaydi", "Xato"] } },
    { q: { uz: "`d={\"x\":1}; \"x\" in d` nima beradi?" }, opts: { uz: ["True", "False", "1", "Xato"] } }
  ],

  15: [
    { q: { uz: "Funksiya qaysi kalit so'z bilan yaratiladi?" }, opts: { uz: ["func", "def", "function", "return"] } },
    { q: { uz: "`def hi(): print('Salom')` — chaqirilmasa nima chiqadi?" }, opts: { uz: ["Salom", "Hech narsa", "def", "Xato"] } },
    { q: { uz: "`print` va `return` farqi?" }, opts: { uz: ["Bir xil", "print ko'rsatadi, return qiymat qaytaradi", "return ko'rsatadi", "return faqat sonlar uchun"] } },
    { q: { uz: "`def add(a,b): return a+b`; `print(add(4,6))` natijasi?" }, opts: { uz: ["10", "a+b", "46", "Hech narsa"] } },
    { q: { uz: "`return 5` dan keyingi qatordagi `print('x')` ishlaydimi?" }, opts: { uz: ["Ha", "Yo'q — return funksiyani tugatadi", "Xato", "Bir marta"] } },
    { q: { uz: "`def g(n, m='Salom')`; `g('Max')` da `m` nimaga teng?" }, opts: { uz: ["Salom", "Bo'sh", "Xato", "Max"] } },
    { q: { uz: "Yaratilgan, lekin hech qachon chaqirilmagan funksiya nima qiladi?" }, opts: { uz: ["O'zi ishlaydi", "Xato beradi", "Hech narsa — tayyor turadi", "Bir marta ishlaydi"] } },
    { q: { uz: "`def sq(x): return x*x`; `sq(sq(2))` natijasi?" }, opts: { uz: ["4", "8", "16", "2"] } },
    { q: { uz: "`def f(a,b): print(a+b)`; `x=f(3,5); print(x*2)` — muammo?" }, opts: { uz: ["f noto'g'ri", "f'da return yo'q, x — None", "Ikki marta print", "Muammo yo'q"] } },
    { q: { uz: "Bir xil nomli funksiya ikki marta yozilsa?" }, opts: { uz: ["Ikkalasi ishlaydi", "Xato", "Oxirgisi qoladi", "Birinchisi qoladi"] } }
  ]
};

/* Savol matnini joriy tilga moslaydi.
   Tarjima bo'lmasa — asl matn qaytadi, ya'ni bu qatlam hech narsani buzmaydi. */
window.localizedQuiz = function (day, qi, q) {
  var lang = window.Store ? Store.get('lang') : 'uz';
  var ov = window.QUIZ_L10N && QUIZ_L10N[day] && QUIZ_L10N[day][qi];
  if (!ov) return { q: q.q, opts: q.opts };
  var text = ov.q && ov.q[lang];
  var opts = ov.opts && ov.opts[lang];
  return {
    q: text || q.q,
    // Tartib asl ma'lumotdagidek qolishi shart — `correct` indeksi shunga bog'liq
    opts: (opts && opts.length === q.opts.length) ? opts : q.opts
  };
};
