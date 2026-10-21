# UzLeeder Academy

Noldan AI muhandisligigacha — ikki kursli o'quv platformasi:

- **Python** — 30 kunlik kurs (kun birligi, har kuni test)
- **Ingliz tili** — 20 haftalik IELTS 8.0 tayyorgarligi (hafta birligi, vazifalar ro'yxati)

Ilgari bitta `working.html` fayl edi; endi kengaytiriladigan loyiha.

---

## 2026-09-27 — Jadval dvigateli v2: kamroq blok, yuk darajasi, validator, migratsiya

**Muammo.** Kun 11–12 ta yadro blokiga bo'lingan edi (o'rtacha 33 daqiqa). Har blok
kontekst almashuvi: grammatika → nonushta → Python → tanaffus → tinglash → DataCamp.
Jami soat to'g'ri, lekin foydali vaqt kam.

**Yechim — blok konsolidatsiyasi.** Umumiy soat O'ZGARMADI (≈40 s/hafta), faqat
bloklar birlashtirildi va mavzu bo'yicha guruhlandi:

| Kun | Ilgari | Endi | Yadro daqiqa |
|---|---|---|---|
| Og'ir (Du·Ch·Ju) | 11 blok (o'rt. 33 daq) | **5 blok** (o'rt. 72 daq) | 360 (o'zgarmadi) |
| LC (Se·Pa·Sha) | 10 blok | **5 blok** | 375 (o'zgarmadi) |
| Yakshanba | 5 blok | **3 blok** | 220 → **205** |
| **Hafta** | 2425 daq | **2410 daq** | **40.2 soat** |

Og'ir kun: `h-eng-am` (grammatika+lug'at 75) · `h-code` (Python+DataCamp 100) ·
`h-eng-mid` (tinglash+o'qish 75) · `h-eng-pm` (yozish+gapirish 65) · `h-close` (yakun 45).
LC kunida alohida **tinglash bloki olib tashlandi** — LC ning o'zi ikki soatlik tinglash
va gapirish (takrorlanmasin).

**Yuk darajasi (`w`).** Har yadro blokida majburiy: `hard` | `med` | `light`.
`HabitPlan.loadOf(plan)` va `HabitPlan.weekLoad(sana)` — kunlik va haftalik taqsimot
(og'ir/o'rta/yengil daqiqalar). Maqsad — ortiqcha yuklamani ko'rish, ko'proq o'qishga
undash emas.

**Shartli bloklar.** `dcOnly`/`noDc` va `firstOnly`/`notFirst` juftliklari bir slotda
tursa ham **to'qnashuv emas** — validator variantni avval filtrlaydi, keyin vaqtni
solishtiradi. Yakshanba 10:30 (`r-focus-dc` ‖ `r-focus`) va 18:35 (`r-code` ‖ `r-kick`).

**Validator — 15 qoida** (`HabitPlan.validate()`, hisobot `tools/validate-schedule.cjs`):
imkonsiz vaqt · haqiqiy to'qnashuv · shartli variantlar ruxsat · OG'IR yuk ≤ 240 daq ·
bloklar ≤ 6 · yadro bloki ≥ 45 daq · tushdan keyin ≤ 1 OG'IR · `w` majburiy · kun 1440 daq ·
dublikat · ichma-ich · noto'g'ri shartli kombinatsiya · id siz · dublikat id · noma'lum kind.

`fixed: true` — tashqi majburiyat (Everest LC, ish bloki): yakka o'quv yukiga kirmaydi.
`shortOk: true` — ataylab qisqa blok (ish kunidagi 10 daqiqalik yakun).

```bash
node tools/validate-schedule.cjs --full      # variantlar jadvali + chegaralar
node tools/schedule-migration-test.cjs       # 30 ta migratsiya testi
node tools/validator-negative-test.cjs       # 14 ta: validator nuqsonni topadimi
```

**Migratsiya (v1 → v2), progress yo'qolmaydi.** `Store` da `scheduleVersion` —
versiyalangan va idempotent. Eski blok id lari (`h-l1`…`h-l6`, `c-l1`…, `r-py`, `r-dc`…)
yangilariga ko'chiriladi:

- Yangi blok **faqat o'zining BARCHA eski qismlari bajarilgan bo'lsa** yopiq deb
  belgilanadi. Qisman bajarilgan bo'lsa — belgilanmaydi (yolg'on "bajarildi" qo'yilmaydi).
- Har holda eski yozuv `state.habitLegacy` da **tarix sifatida saqlanadi** — o'chirilmaydi.
- `c-l3` (LC bilan takrorlangan tinglash) yangi jadvalda yo'q — faqat tarixga ko'chadi.
- Hisobot: `state.scheduleMigration = { at, from, to, moved, partial, dropped }`.

Python, ingliz tili, testlar, xatolar, takror navbati, loyihalar, eslatmalar —
**hech biriga tegilmaydi** (migratsiya testi buni tekshiradi).

### Fokus, blok yakuni va yuk paneli (`js/focus.js`)

**Joriy sessiya / keyingi amal** (§13). Today sahifasining tepasida — "hozir nima
qilay?" degan savolga bitta javob: joriy yadro bloki (jonli) yoki keyingi ochiq blok,
vaqti, yuk darajasi, qolgan daqiqa. Manba — jadvalning o'zi, ikkinchi reja emas.

**Fokus rejimi** (§14). `Focus.open(blokId)` — bitta blok, ortiqcha navigatsiyasiz:
sarlavha, maqsad, taymer (boshlanishiga / tugashiga), kursga o'tish tugmasi, eslatma
maydoni. Esc yoki fon bosilsa yopiladi; fokus birinchi amal tugmasida (a11y).

**Blok yakuni** (§15). Uch holat — `done` · `partial` · `skipped` +ixtiyoriy eslatma.
`done`/`partial` blokni yopadi (qilingan ish — ish), `partial` qo'shimcha takror
navbatiga tushadi, `skipped` yopmaydi. Jazolash yo'q: matn ochiq aytadi — bu o'lchov,
baho emas. Saqlanadi: `Store.blockLog["sana|blok-id"] = { st, note, at }`.

**Yuk taqsimoti** (§19). `Focus.loadBar(load)` — og'ir/o'rta/yengil chiziq + daqiqalar.
Today sahifasida kunlik, haftalik panelda haftalik.

**Haftalik yuk paneli** (§18). Dushanbadan boshlab 7 kun: rejada · bajarildi · og'ir ·
o'rta · yengil · qarz kuni + foiz. Izoh ochiq: *maqsad — ortiqcha yuklamani ko'rish,
ko'proq o'qishga undash emas*.

**Kun yakuni** (§52). Kunning oxirgi yadro bloki tugagachgina chiqadi: yopilgan bloklar,
qisman bajarilganlar, qolganlar. Ayblash yo'q.

### Haftalik yakun (`#/week`) — uch signal

Soat noto'g'ri ko'rsatkich. `js/pages/week.js` **uchta signalni** o'lchaydi va
xulosa chiqaradi (hammasi haqiqiy yozuvdan; ma'lumot yetmasa — shunday deb aytadi):

| Signal | Manba | "Yaxshi" |
|---|---|---|
| 1 · Bloklarni oxirigacha bajarish | `habit` + `blockLog` (qisman alohida) | ≥ 80% |
| 2 · 7 kunlik eslab qolish | SRS (`review`: `reps ≥ 2`, `ivl ≥ 7`) | ≥ 75% |
| 3 · Ertalabki uyg'onish | bomdod bloki belgilanganmi | ≥ 70% |

**Xulosa qoidasi:** uchalasi yaxshi → yadroni 6 s dan 6,5 s ga ko'tarish mumkin,
lekin **faqat yengil hisobiga**. Birortasi past → **soat qo'shilmaydi, kamaytiriladi**.
Og'ir daraja kuniga 4 soatdan oshmaydi (validator ham shuni majburlaydi).

Sahifada yana: haftalik yuk (og'ir/o'rta/yengil), kunma-kun 7 kunlik to'r
(to'liq/qisman/bo'sh), umumiy progress. `#/week/2026-09-21` — aniq hafta.

### Dashboard, analitika, responsive, a11y

- **Dashboard** (§37) — "Joriy fokus" kartasi qo'shildi (Today bilan **bir xil**
  komponent, ikkinchi tizim emas) + kunlik yuk chizig'i.
- **Analitika** (§26) — "Jadval signallari" kartasi: yopilgan blok, bajarish ulushi,
  qisman bajarilganlar, og'ir soat + yuk chizig'i → haftalik yakunga havola.
- **Responsive** (§41) — ≤400 px da topbar 19 px gorizontal skroll berardi
  (streak pili sig'masdi). Tuzatildi: tor telefonda streak pili va `ACADEMY`
  yozuvi yashiriladi, oraliqlar qisqaradi. **10 ta asosiy sahifa 375 px da
  tekshirildi — gorizontal skroll yo'q.**
- **A11y** (§42) — Fokus modalida `role="dialog"`, `aria-modal`, `aria-label`,
  ochilganda fokus ichkariga, **fokus tuzog'i** (Tab modaldan chiqmaydi),
  Escape yopadi, fon skroli bloklanadi. Klaviatura bilan tekshirildi.

**Tiklanish tartibi** (§16) spec bo'yicha qayta tartiblandi: muddati o'tgan topshiriq →
o'qituvchi topshirig'i → majburiy takror → ochiq xatolar → bugungi yadro → ixtiyoriylarni
o'tkazib yuborish. Qarz chegarasi (§17) ilgaridan bor: `HABIT.meta.debtCap = 3` —
undan ortiq to'planmaydi, eng eskilari kechiriladi.

---

## 2026-09-26 — Rasmiy identitet: **Bold Red** (rebrend)

Butun akademiya "UzLeeder Official Design — Brand Guidelines v2026.09" ga o'tkazildi.
**Akademiya logotipi o'zgarmadi** — o'sha o'sish chizig'i (`M4 18 L9 8 L13 14 L20 5` + cho'qqi
nuqtasi); faqat uning taqdimi brend qoidasiga moslandi.

| Nima | Ilgari (Terrakota) | Endi (Bold Red) |
|---|---|---|
| Aksent | `#d97757` iliq terrakota | `#f0384e` (qorong'i) · `#e01e37` (yorug') · `#e5243b` logo rangi |
| Fon | `#17110e` jigarrang | `#07090d` Deep Black · `#f6f7f9` Paper |
| Qatlamlar | iliq jigarrang | `#10141c` Surface · `#1c2233` Ink Navy |
| Display shrift | Sora | **Outfit** 600–800 |
| Matn shrifti | Inter | **Manrope** 400–800 |
| Yorliqlar | JetBrains Mono | **Cascadia Mono / Consolas** (tizim) |
| Radius | tugma 12 · karta 20 | **tugma 10 · karta 14–18** |
| Birlamchi tugma | gradient + soya | **to'la qizil, oq matn** (bir ko'rinishda bitta) |
| Karta | soya bilan | **1 px chegara, soyasiz, hoverda 3 px ko'tariladi** |
| Bo'lim sarlavhasi | to'ldirilgan plita | **qizil raqam + ingichka chiziq + sarlavha** |
| Belgi plitasi | qizil plita | **yumaloq Ink Navy plita + aksentdagi belgi** |
| Wordmark | `UzLeeder` | `Uz` + **`Leeder`** qizilda |

**Nisbat qoidasi:** asosan to'q yoki qog'oz, ozgina ink — qizil faqat aksent (≈5%).
Qizil "amal" yoki "brend" degani.

**Mavzular** endi qo'llanmadagi rang shablonlari (`js/app.js → App.THEMES`):
`dark` Bold Red (rasmiy, standart) · `light` Bold Red qog'oz · `navy` Navy+Gold ·
`emerald` · `ocean` Ocean Blue · `royal` Royal Purple · `sunset` Sunset Orange · `mono`
Monochrome. Eski nomlar avtomatik ko'chiriladi (`App.THEME_ALIAS`: forest→emerald,
plum→royal, sand→sunset), saqlangan tanlov yo'qolmaydi.

**Hujjatlar har doim Bold Red** (qo'llanma, 13-bo'lim): `js/certificate.js` sayt mavzusiga
ergashmaydi — **to'rtala sertifikat turi** (Python, IELTS, haftalik, umumiy) bir xil hujjat
palitrasida: qog'oz oq, matn Ink Navy, aksent `#e01e37`, logotip plitasi ink. Ilgari ular
turli rangda edi (ko'k, yashil, binafsha) — endi tur sarlavha matni bilan ajratiladi.
Sayt shabloni o'zgarsa ham sertifikat o'zgarmaydi.

**Rasmiy muhr** (qo'llanma, 07-bo'lim · `certificate.js → uzStamp()`): sertifikatning
pastki o'ng burchagida, imzo yonida — qo'llanmadagi `emblem-stamp` aynan o'sha geometriyada
(200×200: halqalar r=97/91/72, yon nuqtalar, r=77 yoyda «UZLEEDER» va «·FOR·LEADERS·»,
markazda Λ belgisi, pastda «EST. 2026»), −8° burilgan, `mix-blend-mode: multiply`.
Halqa matni va sana o'zgartirilmaydi. Ilgari o'zimiz chizgan «OFFICIAL SEAL · VERIFIED»
muhri bor edi — u olib tashlandi.

*Halollik:* muhr hujjat **UzLeeder tomonidan** berilganini bildiradi — bu uchinchi tomon
sertifikatlashtiruvi emas.

Diqqat: markazdagi Λ — UzLeeder bosh brendining belgisi (muhr — kompaniyaniki).
Akademiyaning o'z belgisi (o'sish chizig'i) sertifikat sarlavhasida va ilovaning hamma
joyida o'zgarishsiz qoladi.

Tegilgan fayllar: `css/tokens.css` (butun palitra + shriftlar + radius + harakat),
`css/components.css` (tugma, karta, kicker), `css/layout.css` (brend belgisi),
`js/app.js` (THEMES, favicon), `js/i18n.js` (mavzu nomlari), `js/certificate.js`,
`js/goal.js` (bildirishnoma ikonkasi), `index.html` · `login.html` · `controller.html` ·
`404.html` · `error.html` (ichki tokenlar, shriftlar, intro), `manifest.json`,
`img/icon-192.png` · `icon-512.png` · `apple-touch-icon.png` (qayta chizildi).

Daftar muqovalari (`.cb-page.cb-clay` va h.k.) — bu brend chrome'i emas, qog'oz uslublari;
ular ataylab turli rangda qoldirildi.

---

## 2026-09-20 — Personal Learning OS: rollar, xodimlar paneli, aloqa, topshiriq, feedback

UzLeeder Academy — **shaxsiy, yopiq o'quv tizimi** (ochiq LMS emas). Bitta o'quvchi va
uchta xodim roli bitta ekotizimda: o'quvchi *reja → dars → mashq → test → xato → takror →
mahorat → loyiha → feedback* halqasida yuradi; xodimlar *kuzatadi → o'qitadi → topshiradi →
tekshiradi → feedback beradi → yozishadi*.

### Yagona kirish (bitta login sahifasi)

`/login` — **hamma rol uchun bitta** kirish oynasi: logo, nom, qisqa xabar, login, parol,
"Bu qurilmani eslab qol", Kirish. Rol tanlanmaydi — `POST /api/login` hisobni tekshiradi
(o'quvchi + barcha xodim rollari, hammasi hisoblanadi) va **serverdan** rolni qaytaradi,
tegishli imzolangan cookie'ni o'rnatadi; mijoz faqat ish maydoniga o'tadi:
student → `/`, controller/teacher/english → `/controller`. Bir hisobda bir nechta rol
(bir xil login+parol bir nechta rolda sozlangan) bo'lsa — cookie berilmaydi, `choose`
ro'yxati qaytadi va login sahifasi **"Ish maydonini tanlang"** ekranini ko'rsatadi
(ikkinchi login emas; faqat hisobga biriktirilgan rollar; tanlangan rolni server qayta
tekshiradi — mijoz aytgan rolga ishonilmaydi). URL/`localStorage`/forma maydoni rol bera
olmaydi. "Eslab qol" o'chiq bo'lsa cookie brauzer sessiyasigacha (1 kun).
Yagona chiqish: `POST /api/logout` ikkala cookie'ni tozalaydi → `/login`. Sessiya tugasa
har qanday sahifa `/login?expired=1` ga qaytadi (rolga xos login sahifasi yo'q);
ruxsat bo'lmasa `/login?denied=1`. `controller.html` da o'z login formasi YO'Q.

### Rollar va ruxsatlar

| Rol | Cookie / login | Nima ko'radi va qiladi | Nima qila OLMAYDI |
|---|---|---|---|
| **student** (o'quvchi) | `uzla_session`, `/login` (`AUTH_USER`) | butun Academy, o'z progressi, topshiriqlar, o'quvchiga ko'rinadigan feedback, chat, sessiya, bildirishnomalar | xodim paneli, boshqa rolning API amallari (`403`), rol o'zgartirish, xodim eslatmalarini o'qish |
| **controller** (nazoratchi) | `uzla_ctrl` (`role: controller`), `/login` → `/controller` | **monitoring**: onlayn holat, joriy sahifa/blok, vaqt chizig'i, sessiya (start/pause/resume/finish), chat, sessiya tarixi, faollik tahlili, shaxsiy eslatma, o'quvchi holati (faqat o'qish) | topshiriq/feedback (o'quvchiga), writing/speaking tekshiruvi, sozlamalar/rollar/kontentni o'zgartirish, o'quvchi holatini yozish |
| **teacher** (o'qituvchi) | `uzla_ctrl` (`role: teacher`) | progress, kurslar, testlar, xatolar, mahorat, **topshiriq** (dars/mashq/test/takror/o'qish/tinglash/speaking/writing/loyiha), **feedback** (o'quvchiga yoki shaxsiy), writing/speaking **tekshiruv oqimi**, loyihalar, chat, o'qituvchi tahlili | nazorat sessiyasi, autentifikatsiya/rollar/sirlar, global kontent, boshqa xodimning topshirig'ini tahrirlash |
| **english** (ingliz tili o'qituvchisi) | `uzla_ctrl` (`role: english`) | teacher bilan bir xil, **faqat ingliz tili**: holat serverda filtrlanadi (`filterStateForRole` — Python/DataCamp/coding yo'q), topshiriq faqat `course: english`, feedback faqat ingliz tili turlari | Python ma'lumotlari, Python topshirig'i, nazorat sessiyasi, ma'muriy amallar |

Ruxsat matritsasi — `api/_lib.js` → `PERMS` (har `/api/ctrl/io` amali uchun rollar ro'yxati). Tekshiruv **serverda**; paneldagi yashirin tablar faqat qulaylik.
Rol almashtirish yopiq: o'quvchi tokeni `role`siz, xodim tokeni `role`li — xodim tokenini
`uzla_session` cookie'siga ko'chirib o'quvchi bo'lib bo'lmaydi (`sessionOf` rad etadi,
`middleware.js` ham). Sessiya muddati: o'quvchi `SESSION_DAYS` (standart 90 kun, ilgari 10 yil),
xodim `STAFF_SESSION_DAYS` (standart 30).

### Marshrutlar (yangi)

O'quvchi ilovasi (`index.html`, hash):
- `#/comm` — **Aloqa markazi**: `#/comm/messages/<controller|teacher|english>` chat (alohida suhbatlar),
  `#/comm/assignments` MENING TOPSHIRIQLARIM, `#/comm/feedback` feedback + writing/speaking tekshiruvi,
  `#/comm/sessions` nazorat sessiyasi, `#/comm/notifications` bildirishnomalar. Eski `#/chat`, `#/assignments`,
  `#/notifications` shu yerga yo'naltiriladi. Tepada qo'ng'iroq (`#notifBtn`) — o'qilmagan bildirishnomalar.
- `#/copy/free`, `#/copy/free/<id>` — erkin daftar (bo'linmagan varaq). `#/notes/free` — Daftar hubidagi tab.
- `#/books/listen` (Target Listening), `#/books/dict/<test>/<n>` diktant, `#/books/vocab` Destination B2,
  `#/books/dest/<unit>/<sec>`, `#/books/ess4` Essential 4 (ixtiyoriy).

Xodimlar paneli — `controller.html` (`/controller`; `/staff`, `/teacher`, `/english` — rewrite, `vercel.json`).
Bitta sahifa, rolga qarab tablar (`js/staff.js` → `TABSET`).

API (`api/ctrl/[fn].js` router, 9 funksiya — Hobby 12 chegarasi ichida):
- `POST/DELETE/GET /api/ctrl/login` — xodim kirishi (rol login nomidan aniqlanadi, parol faqat o'sha rol hash'i bilan), chiqish, sozlangan rollar ro'yxati.
- `POST /api/ctrl/password` — xodim o'z parolini almashtiradi (o'z roli).
- `GET /api/ctrl/state` — o'quvchi holati (controller/teacher to'liq, english filtrlangan).
- `GET/POST /api/ctrl/io` — butun aloqa: `heartbeat` (o'quvchi: sahifa + hodisalar), `session`, `message {to}`,
  `read {conv}`, `notes`, `assignment {create|update|delete}`, `astatus`, `feedback {create|update|delete}`,
  `review {submit|revise|feedback|complete|reopen}`, `notif {read}`.

### Ma'lumot modeli (server kalitlari — Neon/Redis)

| Kalit | Nima |
|---|---|
| `uzla:state` | o'quvchi holati `{rev, savedAt, state}` (avvalgidek; `state.events` — faollik jurnali, `state.copy.free` — erkin daftarlar) |
| `uzla:ctrl:status` · `:sessions` · `:seen` | joriy sahifa/blok, so'nggi 40 sahifa, 60 hodisa; sessiyalar (`events: start/pause/resume/finish`); har rolning oxirgi so'rovi (onlayn = 45 s) |
| `uzla:ctrl:chat` · `uzla:chat:teacher` · `uzla:chat:english` | suhbatlar (400 ta oxirgi xabar); `uzla:staff:read` — o'qilganlik `{<rol>: {learner, staff}}` |
| `uzla:staff:assignments` | `{id, by, to, type, title, desc, course, route, priority, due, status: assigned/in_progress/completed, createdAt, completedAt}` — `overdue` mijozda `due < bugun` dan hisoblanadi |
| `uzla:staff:feedback` | `{id, by, role, at, activity: {kind, ref, route, title}, text, visibility: student/private, fb: {strengths, weaknesses, corrections, recommendations, next}}` |
| `uzla:staff:reviews` | writing/speaking oqimi: `{id, kind, ref, title, route, text, stage: submitted→reviewed→revised→reviewed2→completed, history[]}` |
| `uzla:staff:notif` | bildirishnomalar `{id, at, to, type, title, route, from, read}` — FAQAT real hodisadan (topshiriq, feedback, xabar, tekshiruv, sessiya) |
| `uzla:ctrl:notes` · `uzla:staff:notes:<rol>` | xodimning shaxsiy eslatmasi (o'quvchi hech qachon olmaydi) |
| `uzla:ctrl:hash` · `uzla:staff:teacher:hash` · `uzla:staff:english:hash` | paneldan almashtirilgan parol hash'lari (env'dagi zaxira) |

O'quvchi ilovasida `Store.events` (400 ta oxirgi, `sync.js` id bo'yicha birlashtiradi): `py-done`, `py-quiz`,
`eng-done`, `quiz`, `mistake`, `read`, `review`, `flag`, `plan`. Controller/Teacher vaqt chizig'i shundan +
heartbeat sahifalari + sessiya voqealari. **Soxta hodisa yo'q.**

### Kun duosi (`#/dua`, Today darvozasi)

Har kun **ishlardan oldin dua**. `js/data/duas.js` — 5 to'plam: tong (20), ilm (6), kech (6), uxlash (4),
uydan chiqish (2). Manbalar: **tazkiya.uz** «Rasululloh ﷺ ning tongda va tunda o'qigan duolari»
(islom.uz «Zikr ahlidan so'rang» hay'ati yo'naltirgan sahifa — arabcha matn aynan shu yerdan),
**islom.uz** «Imtihon oldidan o'qish foydali bo'lgan duolar», Buxoriy/Muslim (raqami bilan), Qur'on.
Har duo: arabcha (Amiri), o'qilishi (lotin), ma'nosi, takror soni, rivoyat manbasi + havola.
Today sahifasida osmon ostida **Kun duosi** oqimi: `core` duolar birma-bir, hisoblagich
(3×, 7×, 10×, 100×), oxirida «O'qidim» → `Store.done['dua:<sana>']`.

> **2026-09-27 o'zgarish:** kunlik oqim 20 tadan **5 taga** qisqartirildi — har kuni
> bajariladigan narsa qisqa bo'lishi kerak. Qolgan 33 duo **o'chirilmadi**: ular Duolar
> sahifasida (`#/dua`) turaveradi, faqat `core` bayrog'i olindi. Oqimda qolganlari:
> `bika-asbahna` (kunni ochish) · `sayyid-istighfar` (Buxoriy 6306) · `bismillah-la-yadurr` 3× ·
> `ilm-nafi` (foydali ilm) · `ayat-kursi` (Buxoriy 2311). Belgi qo'yilmaguncha kun
ro'yxati xira (`.td-gated`); «Keyinroq» faqat shu sessiyada ochadi, belgi qo'ymaydi. Duolar
sahifasida ketma-ket kunlar (streak) va jami. Soxta belgi yo'q — faqat qo'lda.

### Today, jadval, qarz, testlar, mahorat

- **Today** ustuvorlik: 0 muddati o'tgan/muhim topshiriq → 1 o'qituvchi topshirig'i → 1.5 faol nazorat sessiyasi →
  2 majburiy takror (toshbitik, SRS, xato) → 3 zaif soha → 4 bugungi dars → 5 kitoblar → 6–7 ixtiyoriy.
  12 tadan ko'p ochiq band bo'lsa past ustuvorlikdagilar "Ixtiyoriy" ostida yig'iladi.
- **Jadval**: `HabitPlan.validate()` (konsol) va `node tools/validate-schedule.cjs` — har shablon (oddiy + ish kuni,
  birinchi/oddiy kun, DataCamp bor/yo'q) aynan 1440 daqiqa, ustma-ust yo'q, dublikat yadro yo'q, teshik yo'q,
  LC kuni LC bilan. Haftalik yadro yuk **≈ 39.7 soat** (LC 6 soat bilan; ilgari 63.5 soat deb hisoblangan edi).
  Yakshanba to'qnashuvi (kickoff `r-kick`/`r-code`) tuzatilgan.
- **Qarz**: `HABIT.meta.debtCap` (3) — undan ortiq to'planmaydi, eng eskilari kechiriladi; Today'da
  **tiklanish rejasi** (`Goal.recovery()`): bugungi yadro → muddati o'tgan takrorlar → ochiq topshiriqlar → 5 xato →
  ixtiyoriylarni o'tkazib yuborish.
- **Haftalik testlar**: 20/20 hafta — 6 tasi qo'lda, 14 tasi generator (`ensureWeeklyQuiz`, seed = 1000 + hafta);
  natija `quiz`, xato banki, SRS, tahlilga tushadi. Audit: `node tools/audit-english.cjs`.
- **Mahorat holatlari** (`Mastery.level`): `novice < 20 · learning < 45 · developing < 70 · strong < 90 · mastered` —
  reyting emas, o'quv holati; `Mastery.evidence()` — bajarish, test, mashq, xato, takror, takroriy muvaffaqiyat.
- **Xato banki** (`#/review/mistakes`): python · english · grammar · vocab · reading · listening · writing · speaking ·
  practice; har xato: manba, sana, savol, javob, to'g'ri javob, izoh, holat, urinishlar soni.

### Testlar

```bash
node tools/api-test.cjs          # 60 ta rol/ruxsat/oqim tekshiruvi (xotiradagi ombor bilan real handler'lar)
node tools/middleware-test.mjs   # Edge darvoza: cookie yo'q / muddati o'tgan / imzo buzuq / rol almashtirish / xodim
node tools/validate-schedule.cjs # jadval 1440 · ustma-ust · dublikat · LC
node tools/audit-english.cjs     # 140 kun · havolalar · haftalik testlar · o'qish matnlari
```

### Halol chegaralar

- Aloqa, topshiriq, feedback, bildirishnoma — faqat Vercel'da (API). Mahalliy nusxa buni aniq aytadi, soxta holat yo'q.
- "Onlayn" = oxirgi 45 soniyada so'rov kelgan (polling 5–60 s), WebSocket yo'q.
- Speaking ovoz yozuvi qurilmada (IndexedDB) — o'qituvchiga faqat matnli ikkinchi variant yuboriladi.
- Avtomatik baholash/AI yo'q: band va feedback'ni faqat odam yozadi.
- Bitta o'quvchi tizimi: xodim paneli "o'quvchi" deganda `uzla:state` dagi yagona hisobni ko'radi.

---

## 2026-09-17 — yangi tizim (rasmiy kalendar, DataCamp, Quick Repeat, bulut media)

**Rasmiy kalendar.** Platforma **20-sentabr 2026 (yakshanba, kickoff)** da rasman boshlanadi va
**10-fevral 2027** da tugaydi. 16–19-sentabr — **introduction**: 4 kirish darsi (`#/english/i1…i4`),
kurs kuni EMAS, progressga kirmaydi. Ingliz tili **1-kun = 21-sentabr** (dushanba), 140 kun, 140-kun
7-fevral; 8–10-fev zaxira, 20-fev imtihon. Python 30 kun: 20-sen → 19-okt, har kuni. Kunlik intizom
jadvali 20-sentabrdan. Ma'lumot fayllari eski raqamlashda (1–4 kirish, 5–144) — `js/pages/english.js`
yuklashda bir marta o'giradi (`ENG_INTRO`, `ENG_DAYS`), Store v8 migratsiyasi eski progressni ko'chiradi.

**DataCamp — Python Programming Fundamentals** (`#/datacamp`, `js/data/datacamp.js`, `js/pages/datacamp.js`).
16 soat, 4 kurs (13 bob) + loyiha, 20-sen → 5-okt, kuniga bitta bob (yakshanbalar bo'sh). Har bobda
DataCamp'dagi darslar ro'yxati, "nima qila olishing kerak", 5 savollik test (4/5 — yopish sharti).
Kunlik coding: og'ir kun Python 2s + mashq 1s + DataCamp 1s; LC kuni Python 1s15d + DataCamp 45d;
yakshanba Python 1s + **KATTA CODING TESTI** (`#/practice/coding`, 30 savol — Python darslari + DataCamp
boblari, natija `read['codetest-<sana>']`). Reja sahifasida 1-bosqich = shu trek (o'zi yopiladi).

**Quick Repeat** (`#/quick`, `js/data/quick10.js`, `js/pages/quick.js`) — 10 kunlik General English
takror kursi (B1+/pre-IELTS): har kuni 5 blok (grammar · vocab · reading · listening · speaking) mavjud
kontentdan, kunlik mini-test, oxirida 40 savollik yakuniy test (70%) → sertifikat (`Certificate.openGeneric`).

**Lug'at rejasi** (`ENG_BOOK.cycle`): 1–15-kalendar kun **C-book** — kuniga 40 so'z o'zing daftarga
yozasan (platforma sanaydi: `Books.wordsAddedOn`), 16-kundan (5-okt) **4000 Essential Words 4**, kuniga
2 unit. Daftarda so'z turi tanlovi (`pos`: noun/verb/adj/adv/…).

**Kun tartibi.** Writing bloki 1-oktabrgacha jadvalda yo'q (o'rni erkin vaqt). **Ish davri**
(Sozlamalar → Ish davri; standart 20-sen → 3-okt, 150 daq): erkin vaqt bloklari avtomatik ISH blokiga
aylanadi. Kunning filmi — zamonaviy action + animation ro'yxati.

**Movies & Videos** (`#/movies`): tur (kino/video), davlat, yil, filtrlar. Fayl **bulutda** —
`api/media.js` + Vercel Blob: `BLOB_READ_WRITE_TOKEN` env qo'shilsa fayl brauzerdan to'g'ridan-to'g'ri
Blob'ga (katta fayl bo'laklab) yuklanadi va istalgan qurilmada ochiladi; token bo'lmasa — avvalgidek
IndexedDB (faqat shu qurilma). Profil rasmi/loyiha muqovasi ham shu ombordan foydalanadi.

**Profil**: rasm, sertifikatlar, **Loyihalar (portfolio)** — nom, bozor narxi, tavsif, rasm, video muqova.

**Nazoratchi paneli** (`/controller`) qayta qurildi: ilova CSS/modullari bilan, o'quvchining butun
holatini **faqat o'qish** rejimida ko'radi (`GET /api/ctrl/state`) — umumiy, bugun/intizom, kurslar,
daftar, xatolar, eslatmalar, kinolar, profil, tahlil, sozlamalar, chat/sessiya (maqsad doskasi yo'q).
Kirish — umumiy `/login` oynasi. `middleware.js` nazoratchi cookie'siga `/js /css /img` ni ochadi.

**Tahlil** — o'ng ustunda halqalar paneli (umumiy + 6 soha; bosilsa tafsilot). **Dashboard** — pro
hero (KPI plitalari), ikki ustun, o'ng panelda halqalar, qarz, keyingi bosqich, davom etish.

---

## Ishga tushirish

**Eng oddiy yo'l** — `index.html` ni brauzerda ikki marta bosib ochish.
Barcha skriptlar klassik `<script src>` bo'lgani uchun `file://` rejimida ham ishlaydi.

**Server bilan** (tavsiya etiladi — nusxa olish va Pyodide uchun qulayroq):

```bash
python -m http.server 5173 --directory uzleeder-academy
```

Keyin `http://localhost:5173` ni oching.

**Vercel / Netlify / GitHub Pages**: papkani o'sha holicha joylash yetarli — build qadami yo'q.
Vercel uchun `vercel.json` tayyor (xavfsizlik sarlavhalari + `.css/.js` uchun `must-revalidate`).

---

## Vercel'ga joylash + bulut sinxron (akkaunt)

Statik sayt hech qanday serverga muhtoj emas. Lekin **"qaysi kompyuterdan
kirsam ham progressim ko'rinsin"** — bu serverni talab qiladi: progress
bir joyda turishi kerak. Shuning uchun `api/` papkasida uchta kichik
Vercel funksiyasi bor:

```
api/login.js    POST  login+parol → imzolangan cookie (10 yil; brauzerda saqlanadi)
api/logout.js   POST  cookie'ni o'chiradi
api/password.js POST  joriy parolni tasdiqlab yangisini Neon/Redis'ga yozadi
api/state.js    GET   bulutdagi progress · PUT  saqlash (rev nazorati bilan)
api/health.js   GET   sozlash tekshiruvi (sirsiz)
api/_lib.js     umumiy: PBKDF2, HMAC cookie, ombor (Neon Postgres | Upstash Redis)
```

Progress bazada bitta kalitda turadi (`uzla:state`, ~50 KB).
Bitta foydalanuvchi — jadval, ORM, ro'yxatdan o'tish yo'q. Parol serverda
saqlanmaydi, faqat PBKDF2 hash'i muhit o'zgaruvchisida.

### 1. Kerakli narsalar (bir marta)

- **Node.js** (LTS) — https://nodejs.org (Vercel CLI uchun)
- Vercel akkaunt — https://vercel.com (GitHub bilan kirsa bo'ladi)

```bash
npm i -g vercel
```

### 2. Parol va sirlarni yaratish

```bash
powershell -ExecutionPolicy Bypass -File tools\make-credentials.ps1
```

Chiqadi: **PAROL** (o'zingga — parol menejeriga), `AUTH_PASSWORD_HASH`,
`SESSION_SECRET`. Parol hech qaysi faylga yozilmaydi.

### 3. Birinchi deploy

Loyiha papkasida:

```bash
vercel
```

Savollarga: yangi loyiha → nomi `uzleeder-academy` → root `./` → build
sozlamalarini o'zgartirmaslik (build yo'q). Preview URL beradi.

### 4. Baza ulash — Neon (Postgres) yoki Upstash (Redis)

Vercel dashboard → loyiha → **Storage** → **Create Database**. Ikkalasi
ham bo'ladi, kod o'zi aniqlaydi:

- **Neon Postgres** — Connect dialogida: Environments = Production +
  Preview; "Create database branch" = faqat Production (Preview branch
  progressni ikkiga bo'ladi); prefix o'zgartirilmaydi. Vercel `…_URL`
  o'zgaruvchisini qo'shadi (`DATABASE_URL` yoki `STORAGE_URL`) — kod
  `postgres://` bilan boshlangan istalgan `*_URL` ni topadi. Jadval
  (`uzla_kv`) birinchi so'rovda o'zi yaratiladi.
- **Upstash Redis** — `KV_REST_API_URL` + `KV_REST_API_TOKEN` qo'shiladi.

Ikkalasi ham npm paketsiz, faqat `fetch` bilan ishlaydi (Neon — HTTP SQL
endpoint, Upstash — REST). Tekshirish: `https://<sayt>/api/health` →
`{ ok, backend, missing, db }`.

### 5. Akkaunt o'zgaruvchilari

Vercel dashboard → loyiha → **Settings** → **Environment Variables**
(Production + Preview):

| Nomi | Qiymati |
|---|---|
| `AUTH_USER` | login (masalan `max`) |
| `AUTH_PASSWORD_HASH` | 2-qadamdagi `pbkdf2$210000$…` qatori TO'LIQ |
| `SESSION_SECRET` | 2-qadamdagi base64 qator |

### 6. Production

```bash
vercel --prod
```

Sayt ochilganda **login sahifasi** chiqadi (`login.html`) → login/parol →
ichkariga. Boshqa kompyuterda ham xuddi shunday — progress bulutdan keladi.

Keyingi o'zgarishlarda: faylni tahrirla → `vercel --prod`. Tamom.

### 7. Sayt darvozasi — `middleware.js`

Vercel'da **butun sayt** yopiq: `middleware.js` (Edge) har so'rovni —
HTML, CSS, JS, API — `uzla_session` cookie'siga qarab o'tkazadi yoki
qaytaradi. Cookie yo'q/yaroqsiz bo'lsa: sahifa so'rovi `/login.html` ga
yo'naltiriladi (`/login`), boshqa fayllar `401` oladi — begona odam hatto CSS'ni ham
ko'rmaydi. Ochiq qolgan yo'llar: `/login` (`login.html`, cleanUrls), `/api/login`, `/api/health`,
`/controller` (`/staff`, `/teacher`, `/english`) va `/api/ctrl/*` — xodimlar paneli o'z cookie'si
(`uzla_ctrl`, ichida `role`) bilan; xodim ilova sahifasini so'rasa panelga qaytariladi, o'quvchi API'si
(`/api/state` …) unga `401`. O'quvchi cookie'sida `role` bo'lsa (ko'chirilgan xodim tokeni) — rad etiladi.

Imzo tekshiruvi `api/_lib.js` bilan bir xil (HMAC-SHA256, `SESSION_SECRET`),
faqat WebCrypto orqali. Sessiya tugasa yoki "Chiqish" bosilsa `js/sync.js`
o'zi login sahifasiga yuboradi. Mahalliy (`file://`, `localhost`) nusxada
darvoza yo'q — u faqat sizning kompyuteringizda.

**Parolni almashtirish:** sayt ichida **Sozlamalar → Akkaunt va bulut →
Parolni almashtirish** ni oching. Joriy parol va kamida 6 belgili yangi
parolni kiriting. Hash Neon/Redis bazasiga yoziladi; Vercel sozlamalariga
kirish va redeploy qilish shart emas. Bu keyingi loginlarni yangilaydi.

**Barcha qurilmalardan majburiy chiqish:** agar telefon yoki boshqa
kompyuterda sessiya qolgan bo'lishi mumkin bo'lsa, `tools\make-credentials.ps1`
orqali yangi `SESSION_SECRET` yarating, Vercel'dagi `SESSION_SECRET`ni
yangilang va `vercel --prod` qiling. Shunda barcha eski cookie'lar bir zumda
yaroqsiz bo'ladi. Progress bazada qoladi.

### Sinxron qanday ishlaydi (`js/sync.js`)

- `localStorage` **doim** asosiy manba; bulut — nusxa. Internet yo'q,
  `file://` dan ochilgan, login qilinmagan — ilova avvalgidek ishlaydi.
- Yuklanganda avval **tortadi** (pull), keyin yozadi. Tab'ga qaytilganda
  ham tortadi — kecha ochiq qolgan tab bugungi ishni ko'radi.
- Har o'zgarish 1.5 s kutib **yuboriladi** (push). Sahifa yopilayotganda
  kutayotgan o'zgarish bo'lsa `keepalive` bilan darhol.
- Push `baseRev` bilan boradi. Server rev boshqa bo'lsa → **409**: boshqa
  qurilma orada yozgan. Ustidan yozilmaydi — ikkalasi **birlashtiriladi**
  (bajarilganlar OR, ballar max, eslatmalar yangisi) va qayta yuboriladi.
  Eskirgan tab bugungi ishni o'chira olmaydi.
- Qurilma sozlamalari (til, mavzu, namoz sozlamasi) sinxronlanmaydi —
  ular qurilmaniki.

### Xavfsizlik

- Parol: PBKDF2-HMAC-SHA256, 210 000 iteratsiya, `timingSafeEqual`.
- Sessiya: HMAC-imzolangan cookie — `HttpOnly; Secure; SameSite=Strict`.
  Serverda sessiya jadvali yo'q; sirni almashtirsang hamma chiqib ketadi.
  Muddat sozlanadi: `SESSION_DAYS` (o'quvchi, standart 90), `STAFF_SESSION_DAYS` (xodim, 30).
- Rollar: `api/_lib.js` `PERMS` — har amal serverda tekshiriladi; english roli uchun holat filtrlanadi.
  Testlar: `node tools/api-test.cjs`, `node tools/middleware-test.mjs`.
- Login: IP bo'yicha 15 daqiqada 10 xato urinishdan keyin 429.
- Hech bir sir repoda yo'q. `.env*` `.gitignore`'da.
- Parolni unutsang: `tools\make-credentials.ps1` → yangi hash → Vercel →
  redeploy. Progress KV'da, parolga bog'liq emas - yo'qolmaydi.

---

## Papka tuzilishi

```
uzleeder-academy/
├── index.html              qobiq: topbar, sidebar, modal oynalar
├── css/
│   ├── tokens.css          rang/o'lcham/soya tokenlari, dark + light mavzu
│   ├── layout.css          app shell: topbar, sidebar, drawer, print
│   ├── components.css      tugma, karta, kod bloki, test, modal, toast
│   └── pages.css           sahifalarga xos uslublar
├── js/
│   ├── data/
│   │   ├── course.js       30 kunlik Python kontenti (COURSE)
│   │   ├── english.js      IELTS kursining meta/bosqich/metodlari (ENGLISH)
│   │   ├── eng-grammar.js  34 grammatik mavzu — cheatsheet (ENG_GRAMMAR)
│   │   ├── eng-grammar-2.js +10 zamon/tuzilma (barcha future, PPC, used to, wish…) + 44×5 mashq (ENG_GRAMMAR_EX)
│   │   ├── eng-vocab.js    18 mavzuli lug'at to'plami (ENG_VOCAB)
│   │   ├── eng-skills.js   olti ko'nikma kunlik dasturi (ENG_SKILLS)
│   │   ├── eng-days-*.js   144 kunlik kontent, qismlarga bo'lingan (ENG_DAYS_n)
│   │   ├── eng-book.js     manba kitoblar xaritasi va kunlik sikl (ENG_BOOK)
│   │   ├── eng-book-vocab-*.js  30 unit × 20 so'z, sinonimli (ENG_BOOK_VOCAB_n)
│   │   ├── eng-reading-*.js     IELTS o'qish matnlari + savollar (ENG_READING_n)
│   │   ├── eng-listening-*.js   tinglash bo'limlari + transkript (ENG_LISTENING_n)
│   │   ├── speaking30.js   Speaking Fluency 30 kunlik trek (SPEAK30)
│   │   ├── habit.js        kunlik intizom shablonlari (HABIT)
│   │   ├── dual.js         ikki kursni parallel olib borish rejasi (DUAL)
│   │   ├── deep.js         chuqur izohlar + takror kunlari uchun bo'limlar (DEEP)
│   │   ├── explain.js      300 ta test izohi (EXPLAIN)
│   │   ├── quiz-l10n.js    inglizcha testlarning o'zbekcha tarjimasi
│   │   ├── plan.js         DataCamp rejasi va karyera ma'lumotlari
│   │   └── roadmap.js      roadmap yordamchi ma'lumotlari
│   ├── icons.js            inline SVG ikonlar (IC)
│   ├── store.js            holat + localStorage (Store)
│   ├── sync.js             bulut sinxron: pull/push/merge (Sync)
│   ├── prayer.js           namoz vaqtlari — astronomik hisob (Prayer)
│   ├── habit.js            kun jadvalini yig'uvchi (HabitPlan)
│   ├── i18n.js             interfeys matnlari (tr, L)
│   ├── utils.js            esc, kod bo'yash, sana, toast, clipboard
│   ├── quiz.js             test: aralashtirish, izoh, xatolarni yozish
│   ├── playground.js       Pyodide orqali brauzerda Python
│   ├── certificate.js      haftalik Python + IELTS sertifikati (SVG → PNG)
│   ├── search.js           Ctrl+K qidiruv paneli
│   ├── pages/              har bir sahifa alohida modul
│   └── app.js              router + global hodisalar
├── api/                    Vercel funksiyalari: login, logout, state (+ _lib)
├── tools/
│   ├── make-credentials.ps1  parol + hash + sessiya siri generatori
│   ├── render-brand.ps1      brand assetlar renderi (Windows)
│   └── render-brand.sh       brand assetlar renderi (macOS/Linux)
├── vercel.json, package.json, .vercelignore
└── README.md
```

**Yuklanish tartibi muhim**: ma'lumot → yordamchilar → sahifalar → `app.js`.
Tartib `index.html` oxirida belgilangan.

---

## Asosiy tushunchalar

### Store — yagona darvoza
Butun holat `js/store.js` orqali o'qiladi va yoziladi (`localStorage` kaliti: `uzla.state`).
Kod bo'ylab sochilgan `localStorage` chaqiruvlari yo'q — shuning uchun migratsiya,
eksport va tozalash bitta joyda hal bo'ladi. Eski `working.html` ning `uzl_*`
kalitlari birinchi ochilishda avtomatik ko'chiriladi.

### Kontent qatlamlari
`course.js` — asosiy manba. `deep.js` va `explain.js` — ustiga qo'yiladigan qatlamlar.
Ular bo'lmasa ham platforma ishlaydi, shunchaki izohlar ko'rinmaydi. Shu sababli
yangi izoh yoki yangi kun qo'shish asosiy ma'lumotni buzmaydi.

### i18n
Interfeysdagi har bir matn `js/i18n.js` da. Kontent obyektlari `{uz, en}`
shaklida bo'ladi va `L(obj)` orqali o'qiladi.

---

## Kurslar markazi (`#/course`)

Yon paneldagi **Kurslar** bitta joy: oltita karta — **Coding (Python)**,
**English (IELTS)**, **Speaking (30 kunlik ravonlik)**, **BBC Listening**,
**Writing** va **Maqsad**. Har kartada progress, bugungi/keyingi dars va
"Kursga kirish". Bosilsa o'sha kursga o'tadi:

| Karta | Marshrut | Nima |
|---|---|---|
| Coding | `#/python` | 30 dars, 16-sen → 15-okt **har kuni** (LC kunlari 2 soat, boshqa kunlar 4 soat coding) |
| English | `#/english` | 144 kun, 6 ko'nikma, cheatsheet'lar |
| Speaking | `#/speaking` | 30 kun, har kuni **3 yozuv (45 daq)**, haftalik WPM/pauza maqsadi, yakshanba o'lchov testi |
| BBC Listening | `#/bbc/6min`, `#/bbc/tews` | 6 Minute English / The English We Speak — audio BBC'dan (`api/bbc.js` RSS proxy), 6 qadamli mashq, eslatma, "bajarildi" |
| Writing | `#/writing`, `#/writing/N` | 1-okt dan 19 hafta: har hafta bo'limlar, model javob, checklist, kunlik topshiriqlar |
| Maqsad | `#/goal` | 0 → expert xaritasi, **qarz kunlari**, bugungi soat talabi (ingliz 4 s, coding 4/2 s), roast, bildirishnomalar |

**Speaking — kafolat haqida.** Hech qanday dastur 30 kunda "100% ravonlik"
bera olmaydi; ravonlik yozib olingan soatlar bilan o'sadi. Shuning uchun trek
o'lchanadigan qilingan: 3 yozuv/kun (sovuq urinish → tahlil + qayta yozuv →
shadowing + Part 3), haftalik maqsad (90 → 100 → 110 → 120 WPM; 2 soniyalik
pauzalar 8 → 5 → 3 → 1), yakshanba testi natijasi jadvalga kiritiladi
(`Store.read['spkwN']`). Maqsadga yetilmasa hafta takrorlanadi.

**Qarz kunlari** (`js/goal.js`). O'tgan kunlardan bajarilmaganlari sanaladi;
har qarz kuni maqsad xaritasidagi barcha kelgusi bosqichlarni bir kunga
suradi. Daraja 0–4 (0 / 1–2 / 3–5 / 6–10 / 10+) — dashboard va Maqsad
sahifasidagi roast matni (`STRINGS.roastN`) shunga qarab qattiqlashadi;
bildirishnomalar (`Notify`, brauzer Notification API, sozlamada yoqiladi)
ertalab/kunduzi/kechqurun bir martadan, qarz bo'lsa roast bilan.
Bugungi soatlar jadvaldagi belgilangan bloklardan hisoblanadi; jadvaldan
tashqari ish intizom sahifasidagi **+15/+30/+60** bilan qo'shiladi
(`Store.hours`).

**Kitoblar** (`#/books`) ham shu qolipda: beshta karta — e-book, diniy,
tarixiy, tinglash (kitob rejasi), lug'at — har biri o'z sahifasiga
(`#/books/ebook | religious | history | listen | vocab`). Nav'da "Kurslar" ikkala kursning barcha
sahifalarida (`python`, `lesson/N`, `english`, `english/N`, `eng-skill/*`)
yoniq turadi. Qidiruv (Ctrl+K) ham ikkalasini alohida topadi.

---

## Ingliz tili (IELTS) kursi

Python kursi bilan bir xil qolipda qurilgan ikkinchi kurs — **kunlarga bo'lingan**:
`#/english`, `#/english/<kun>`, `#/eng-grammar`, `#/eng-vocab`.

### Kalendar

`ENGLISH.meta` dan hisoblanadi — bironta sana kod ichida qattiq yozilmagan:

| | | |
|---|---|---|
| Kirish bloki | 1–4-kun | 15–18-sen 2026 (Se → Ju) |
| Bo'sh kun | — | 20-sen 2026 (Ya) — kurs kuni emas |
| 20 hafta | 5–144-kun | 21-sen 2026 → 7-fev 2027 (Du → Ya) |
| Zaxira | — | 8–10-fev 2027 (kursning rasmiy tugashi 10-fev) |
| Imtihon | — | 20-fev 2027 |

Nega ikki bo'lak: kurs 16-sentabrda (chorshanba) boshlanadi, lekin 20 haftani
**dushanbadan** boshlasak, har haftaning 7-kuni aynan **yakshanbaga** tushadi
(rejadagi test kuni), 2/4/6-kunlari esa Se/Pa/Sha — Everest LC kunlari.
Birinchi dushanba 21-sentabr; orada 1 kun (20-sen) **bo'sh kun**: kurs
kuni emas, lekin intizom jadvali (LC + dam) va kitob rejasi ishlaydi.

`EngCal.dayKey(d)` ikki bo'lakni biladi: kirish `start` dan, haftalar `week1`
dan sanaladi; `dayOfKey(sana)` teskarisi (bo'sh kunda 0). Kitob rejalari
(o'qish/tinglash/lug'at) **kalendar kuni** bilan yuradi (`EngCal.calDay()`),
kurs kuni bilan emas — bo'sh kunlarda ham o'qish to'xtamaydi. Kun turi
(`study` / `class` / `test`) taqvimdan chiqariladi — `EngCal.dayType()`
haftaning kuniga qaraydi, ro'yxat qo'lda yozilmagan.

### Python kursidan farqi

| | Python | Ingliz tili |
|---|---|---|
| Birlik | kun (1–30) | kun (1–144) |
| "Tugadi" mezoni | testdan 7/10 | kun vazifalari to'liq belgilangan |
| Qulf | ixtiyoriy (`gate`) | yo'q — istalgan kun ochiq |
| Kod bloki | Pyodide playground | grammatika cheatsheet + lug'at to'plami |
| Test | har kuni 10 savol | faqat yakshanba (haftalik nazorat) |
| Sertifikat | har hafta (unit) uchun | bitta, kurs tugagach |

Vazifa belgilanganda kun **avtomatik** yopiladi (va biri olib tashlansa qayta
ochiladi) — "yopilgan" bayrog'i har doim haqiqatni ko'rsatadi.

**Mock kunlari** (4, 32, …) da band ballari formasi chiqadi. Umumiy ball rasmiy
IELTS qoidasi bo'yicha yaxlitlanadi: `.25` → yuqoriga (`.5`), `.75` → yuqoriga
(butun). `Store.engOverall()` shuni bajaradi.

**Yakshanba testi** Python kursining Quiz moduliga tegmaydi — ingliz tilining
o'z yengil testi bor (`EngQuiz`), u `Store.recordScore` va xatolar daftariga
yozmaydi. Aks holda 30 kunlik Python progressi buzilardi.

### Olti ko'nikma — har kunda

Rejaning asosiy qoidasi: olti ko'nikma **har kuni birga** ishlaydi, alohida emas.
Shuning uchun har kun sahifasida oltalasi uchun ham aniq vazifa chiqadi:

| | Du·Ch·Ju | Se·Pa·Sha (LC) | Yakshanba |
|---|---|---|---|
| Grammatika | 45 | 25 | 20 (takror) |
| Lug'at | 40 | 20 | 20 |
| Listening | 45 | 40 | 40 (**test**) |
| Reading | 45 | 20 | 60 (**test**) |
| Writing | 60 | 25 | 60 (**test**) |
| Speaking | 40 | 40 | 20 |
| **Jami** | **4s 35d** | **2s 50d** | **3s 40d** |

LC kunida Reading va Writing **qisqaradi, lekin tushib qolmaydi**. Yakshanba —
uchtasi to'liq test formatiga o'tadi. Bu raqamlar `js/data/habit.js` dagi
kunlik jadval bloklari bilan aynan mos.

### Kontent qatlamlari

```
js/data/eng-grammar.js   ENG_GRAMMAR — 34 grammatik mavzu (cheatsheet)
js/data/eng-grammar-2.js ENG_GRAMMAR +10 (to'liq zamonlar tizimi) · ENG_GRAMMAR_EX — har mavzuga 5 mashq, javob yopiq
js/data/eng-vocab.js     ENG_VOCAB   — 18 mavzuli lug'at to'plami
js/data/eng-skills.js    ENG_SKILLS  — olti ko'nikma dasturi (hafta + kun)
js/data/eng-days-1.js    ENG_DAYS_1  — 1–18-kun
js/data/eng-days-2.js    ENG_DAYS_2  — 19–32-kun
js/data/eng-days-3.js    ENG_DAYS_3  — 33–60-kun
js/data/eng-days-4.js    ENG_DAYS_4  — 61–88-kun   (3-bosqich: 7 → 7.5, 3-mock 88)
js/data/eng-days-5.js    ENG_DAYS_5  — 89–116-kun  (4-bosqich: 7.5 → 8, 4-mock 116)
js/data/eng-days-6.js    ENG_DAYS_6  — 117–144-kun (5-bosqich: yakuniy hujum, mock 130 va 141)
                         144/144 kun yozilgan — qismlar sahifa modulida yig'iladi

js/data/eng-book.js           ENG_BOOK          — kitob xaritasi + kunlik sikl
js/data/eng-book-vocab-1..3.js ENG_BOOK_VOCAB_n — 30 unit × 20 so'z (sinonim)
js/data/eng-reading-1..4.js   ENG_READING_n     — 24 matn (RE3 unit 1–12, sarlavhalar kitobniki)
js/data/eng-read-rel-1..2.js  ENG_READ_REL_n    — 24 diniy matn (1–15 yengil, 16–24 IELTS)
js/data/eng-read-hist-1..2.js ENG_READ_HIST_n   — 24 tarixiy matn
js/data/eng-listening-1..2.js ENG_LISTENING_n   — 10 qo'shimcha bo'lim (asosiy = kitob rejasi)
```

**Matn rasmlari — o'zing yuklaysan** (`books.js → readingFigures`, `Store.rdimg`). Har o'qish
matni (72 ta) oldida **2 ta bo'sh joy**: bosilsa fayl tanlanadi, brauzerda kichraytiriladi
(≤ 1400 px, JPEG) va saqlanadi. Qayerda turadi — Movies/Profil bilan bir xil, halol:
bulut (Vercel Blob, `BLOB_READ_WRITE_TOKEN`) sozlangan bo'lsa fayl Blob'ga, holatga faqat URL
(`rdimg["ebook:3:0"] = { url, cap, at }`) → istalgan qurilmada ko'rinadi; sozlanmagan yoki
mahalliy nusxada — shu qurilmadagi IndexedDB (`uzla-media/thumbs`, kalit `rd:<track>:<n>:<slot>`),
holatga `{ local: true }` → boshqa qurilmada "faqat yuklangan qurilmada" yozuvi chiqadi.
Har rasm ostida tahrirlanadigan izoh (bulutga sinxron), ustida almashtirish/o'chirish
(hover). Tayyor rasm to'plami yo'q — soxta rasm ham yo'q.

`ENG_BOOK` ikkita funksiyani ochadi — kun raqamidan bugungi materialni
topadi: `vocabUnitFor(kun)` (1–30, keyin takror sikli) va `readingRefFor(kun)`
(12 unit × A/B = 24 matn, keyin qaytadan). Sahifa moduli
(`js/pages/books.js`) qismlarni `ENG_BOOK_VOCAB`, `ENG_READING`,
`ENG_LISTENING` ro'yxatlariga yig'adi — `ENG_DAYS` bilan bir xil qolip.
Marshrutlar: `#/books`, `#/books/v<n>`, `#/books/r<n>`, `#/books/l<n>`.

**Ko'nikma sahifasi (`#/eng-skill/<key>`):** olti ko'nikma kartasi
bosiladi → o'sha ko'nikmaning 144 kuni: sana, daqiqa, mavzu, vazifa,
jami soat. Ma'lumot yangi yozilmaydi — `skillPlan()` 144 kunga
aylantiriladi, kitob moduli bilan bog'lanadi (o'qish → matn + 7B kabi
havola, lug'at → unit). Speaking'da birinchi 30 kun trek jadvali.

**Speaking 30 — kunlik farq (`SPEAK30.daily`):** savol takrorlanadi
(film: 8, 15, 22-kun — spiral), lekin kunning ishi takrorlanmaydi:
`tech` (bitta texnika), `drill` (3 daqiqalik isitish), `chunks` (savolga
mos 5 ibora), `f`/`t` (bugun diqqat qilinadigan 2 filler + 3 bog'lovchi).
Sabab: 13 ibora birdan berilsa birortasi yodda qolmaydi; kuniga 5 tasi qoladi.

**Streak:** `Store.activeOn(kun)` — Python darsi YOKI ingliz tili kuni
yopilgan YOKI intizom jadvali to'liq belgilangan. Ilgari faqat Python
sanalardi.

**Nega `eng-skills.js` alohida:** `course.js + deep.js + explain.js` bilan bir
xil mantiq — asosiy ma'lumot ustiga qo'shiladigan qatlam. U uch darajada
ishlaydi: `days[kun]` → `weeks[hafta]` → standart. Shu sababli kontenti hali
yozilmagan kun ham oltala ko'nikma bilan to'liq chiqadi, va bitta haftaning
dasturini o'zgartirish o'sha haftaning yettala kuniga tarqaladi.

**Nega grammatika alohida faylda:** bitta mavzu (masalan Present Perfect)
kursning 5–6 kunida qaytadi. Tushuntirish kunlar ichida yozilsa, u olti marta
ko'chirilardi va bittasini tuzatganda qolgani eskirib qolardi. Kun faqat
`gram: 'present-perfect'` deb havola qiladi, cheatsheet esa bitta joyda turadi
va `#/eng-grammar` sahifasida hammasi birga chiqadi (chop etsa bo'ladi).
44 mavzu — barcha zamonlar (Present/Past/Future x Simple/Continuous/
Perfect/Perfect Continuous), shart, majhul, modal, tuzilma va uslub. Har
kartaning oxirida 5 mashq: 'Javob' tugmasi ochadi, chop etilganda javoblar
ko'rinadi.

**Yangi kun qo'shish:**

```js
{
  d: 33, w: 5, i: 1,               // kun · hafta · hafta ichidagi kun
  gram: 'participle-clauses',      // ENG_GRAMMAR kaliti (ixtiyoriy)
  vocab: 'environment',            // ENG_VOCAB kaliti (ixtiyoriy)
  focus: ['grammar', 'writing'],
  title: {uz,en}, intro: {uz,en},
  sections: [ { h:{uz,en}, p:{uz,en}, ex:['misol gap', …] } ],
  practice: [ {uz,en} ],           // belgilanadigan vazifalar
  konspekt: { uz:[…], en:[…] },
  mock: true,                      // ball formasi chiqadi
  review: true,                    // takror kuni
  quiz: [ {q, opts, correct} ]     // faqat yakshanba
}
```

Yangi qism fayli qo'shilsa: `index.html` ga `<script>` va
`js/pages/english.js` boshidagi ro'yxatga `window.ENG_DAYS_N` qo'shiladi.
Kontent yozilmagan kun ochilsa sahifa buzilmaydi — "hali tayyor emas" ekrani
chiqadi va oxirgi tayyor kunga havola beradi.

---

## Kunlik intizom (`#/habit`)

16-sentabr 2026 → 20-fevral 2027, **158 kun**. Har kunning jadvali soatga emas,
**namoz vaqtlariga** bog'langan.

### Kun skeleti — uyg'onish 05:20, yotish 21:20

Kun **qat'iy vaqtlar** ustiga qurilgan: har blokning boshlanish soati
shablonda yozilgan, hech narsa surilmaydi.

**Uyqu — 8 soat, himoyalangan blok.** `21:20 → 05:20` jadvalning qoldig'i emas,
ASOSI: qolgan hamma narsa shundan keyin joylashadi. Kam uxlagan miya yangi
material yodda saqlamaydi, ya'ni uyquni qisqartirish o'qishni tezlashtirmaydi.
Kun ulgurmasa — dars qisqaradi, uyqu emas.

Dars va uy vazifasi **alohida** bloklar: `DARS 1 · Grammatika`,
`UY VAZIFASI 1 · Grammatika mashqlari`. Dars — yangi material, uy vazifasi —
o'sha materialni o'zing ishlatib ko'rishing. Ikkinchisisiz birinchisi yodda
qolmaydi.

| Kun | Dars | Uy vazifasi | Kino | Uyqu |
|---|---|---|---|---|
| Du·Ch·Ju | 6s 05d (ingliz 4s 35d + **Python** 1s 30d) | 1s 15d | 45d | 8s |
| Se·Pa·Sha | 5s 40d (ingliz 3s 40d + **LC** 2s) | 1s 15d | 35d | 8s |
| Yakshanba | test 2s 40d | yo'q | 45d | 8s |

### Python LC kunlaridan ajratilgan

Python **Du/Ch/Ju** kunlarida, Everest LC esa **Se/Pa/Sha** da. Ular ataylab
ajratilgan: ilgari ikkalasi bir kunda edi va o'sha kunlar 7s 50d bo'lib ketardi
— 8 soatlik uyquga joy qolmasdi. Haftasiga 3 kun × 10 hafta = **30 dars**,
ya'ni Python darslarining soni o'zgarmadi (dasturiy tekshirilgan).

### Kino bloki

Har kuni 35–45 daqiqa (yakshanba — film kechasi). Nega chegarali va nega har
kuni: (1) chegarasi bor dam chegarasizidan yaxshi, aks holda kechqurun uyqu
vaqtiga o'tib ketadi; (2) inglizcha ko'rilsa, bu dam bo'lgani holda Listening
mashqi ham bo'ladi. Uyqudan oldingi oxirgi blok emas — orasida qisqa yakun
bloki turadi.

### Namoz vaqtlari

**Bomdod 05:20 va Peshin 13:00** — jadvalning ikki ustuni, standart bo'yicha
qo'lda kiritilgan. Sozlamalardan o'zgartiriladi.

**Asr, Shom va Xufton hisoblanadi** (`js/prayer.js`, PrayTimes.org bilan bir xil
algoritm). Nega qotirib qo'yilmagan: bu 164 kunda Shom 18:43 dan 16:56 ga, keyin
18:02 ga suriladi — ikki soatdan ko'p. Qotirib qo'yilsa jadval yolg'on bo'lardi.

Har namoz uchun **Avto / Qo'lda** tanlovi bor (Sozlamalar → Namoz vaqtlari).
Shahar (10 ta), mazhab (hanafiy standart, Asr soyasi 2×) va Bomdod burchagi ham
o'zgartiriladi. Ochiq yozilgan: **hisob taxminiy**, rasmiy taqvim bilan
solishtirish kerak.

Hisoblangan namoz jadval blokining ichiga tushsa — u **surilmaydi**, o'z vaqtida
qoladi va qaysi blok ichida ekani ko'rsatiladi (masalan `Shom 16:57 · dars ichida`).

### Kun turlari

| Kun | Shablon | Mazmun |
|---|---|---|
| Du · Ch · Ju | `heavy` | ingliz tili to'liq (~3s 20d), Python yo'q |
| Se · Pa · Sha | `class` | Python darsi + Everest LC 16:30–18:30 |
| Yakshanba | `rest` | **dam + takror/test kuni** — yangi mavzu yo'q, LC yo'q, lekin haftalik test shu kuni |

Kun turi taqvimdan chiqadi (`HabitPlan.typeOf`), ro'yxat qo'lda yozilmagan.

### Namoz va dars to'qnashuvi

Everest LC 16:30–18:30 qat'iy. Yilning katta qismida namoz aynan shu oraliqqa
tushadi — bu yashirilmaydi, ogohlantirish sifatida chiqadi:

| Davr | LC vaqtiga tushadigan namoz |
|---|---|
| sentabr – oktabr boshi | Asr (16:51 → 16:00) |
| oktabr o'rtasi – fevral | Shom (17:44 → 16:56 → 18:02) |

### Progress

Har blok belgilanadi. `core` bloklar kunni yopadi; namoz bloklari alohida
sanaladi — ular o'quv rejasining sharti emas, lekin intizomning bir qismi.
Zanjir (streak) bugundan orqaga qarab uzluksiz yopilgan kunlardan hisoblanadi.

Ma'lumot `state.habit["2026-09-10"] = { "h-fajr": true, … }` shaklida. Store
bloklar ro'yxatini bilmaydi — shablon o'zgarsa, eski belgi shunchaki
e'tiborsiz qoladi va hech narsa buzilmaydi.

---

## Speaking Fluency — 30 kunlik trek

Har kunning asosiy savolidan keyin **5 ta qo'shimcha savol**: 3 tasi mavzuga
tegishli (`SPEAK30.qs[n]`), 2 tasi umumiy hovuzdan tasodifiy (`SPEAK30.pool`,
kun raqamiga bog'liq — bir kun bir xil). Har biriga 40–60 soniya, to'xtamasdan,
yozib olib. Intizom sahifasidagi Speaking kartasida ham, `#/speaking`
ro'yxatida ham ko'rinadi.

**Roast** (`STRINGS.roast0..4`): har darajada 6–10 ta gap, har kuni boshqasi
(kun raqami + qarz kunlari bo'yicha aylanadi) — takrorlanmaydi va daraja
oshgani sari qattiqlashadi.

`js/data/speaking30.js` (`SPEAK30`). Kursning **birinchi 30 kunida**
(16-sen → 15-okt) kunlik Speaking bloki shu trekning savoli bilan
almashtiriladi — qolgan hamma narsa 20 haftalik rejaga tegmaydi.

Har kun kartada: hafta maqsadi → bugungi savol (+ Part 3, 4-haftada) →
4 qadamli usul → to'ldiruvchi iboralar → bog'lovchilar → ikkinchi variantni
yozadigan maydon. Javob `state.speak[n]` da saqlanadi.

Maqsad ochiq yozilgan: **ravonlik odati, band ball emas** — 30 kundan keyin
kutiladigan natija ravonlik bo'yicha "ikkilanuvchi 6.0" dan "barqaror 6.5" ga,
toza grammatika yoki Band 8 emas.

---

## Kitoblar moduli (`#/books`)

Uch manba kitob asosidagi kunlik mashq: **1 ta o'qish matni + IELTS savollari ·
1 ta tinglash bo'limi (10 savol) · 1 ta lug'at uniti (20 so'z)**.

| Kitob | Rol | Holat |
|---|---|---|
| 4000 Essential English Words 4 | lug'at — 30 unit × 20 so'z | **600 so'z · 144/144 kun** |
| Reading Explorer 3 (3rd ed.) | o'qish — 12 mavzu × 2 matn = 24 matn | **24/24 · 144/144 kun** |
| IELTS Listening (foydalanuvchi kitobi) | tinglash — **reja**: unit · mashq · kun | **144/144 kun** (matn yozilmaydi) |
| Diniy o'qish | payg'ambarlar, sahobalar, xalifalar — 24 matn | **24/24 · 144/144 kun** |
| Tarixiy o'qish | faqat tarix, Markaziy Osiyo ko'proq — 24 matn | **24/24 · 144/144 kun** |

### Tinglash — kitob rejasi, platforma matni emas

Foydalanuvchi so'roviga ko'ra tinglash uchun platformada bo'lim YOZILMAYDI —
u o'z kitobidan ishlaydi. Platforma faqat **rejani** beradi: qaysi kun
qaysi unit, qaysi mashqlar (1–10 / 11–20), necha daqiqa, soat nechada
(intizom jadvalidagi Listening bloki). `Books.listenPlan(kun)`:
anchor `{day, unit, half}` dan davom etadi, oxirgi unitdan keyin 1-unitga
qaytadi (`2-aylanish`). Kitobdagi unit soni sozlanadi (standart 20).
Ilgari yozilgan 10 ta platforma bo'limi qo'shimcha sifatida qoladi.

### Nega aynan 24 ta

Reading Explorer'da 12 unit × (A va B matni) = 24 matn. Shuning uchun
platformadagi matn va tinglash bo'limlari ham 24 talik siklda aylanadi:
`readingNoFor(kun)` va `listeningNoFor(kun)` — ikkalasi ham `((kun-1) % 24) + 1`.
Ya'ni **24 ta matn 144 kunning hammasini yopadi**; 25-kun 1-matnga qaytadi,
lekin bu safar boshqa maqsad bilan (`passOf(kun)`: 1-aylanish — yangi,
2-aylanish — tezlik, 3-aylanish — nazorat). Lug'at ham xuddi shunday:
30 unit → 144 kun.

### Mualliflik huquqi — nima ko'chirilgan, nima yo'q

Kitoblarning **matni ko'chirilmagan va ko'chirilmaydi**: ikkalasi ham himoyalangan
(4000 EEW: *"All rights reserved. No part of this book may be reproduced…"*).

Modulda:
- **so'z ro'yxati** — fakt, kitobdan olingan
- **sinonim va misol gap** — shu platforma uchun qaytadan yozilgan
- **o'qish matnlari** — kitobniki EMAS, o'sha 12 mavzuda IELTS darajasida
  maxsus yozilgan
- **savollar** — IELTS formatida (T/F/NG, matching headings, summary
  completion), shu platforma uchun tuzilgan

Reading Explorer'ning o'z savollari IELTS formatida emas — shuning uchun bu
takrorlash emas, **to'ldirish**. Kitoblar foydalanuvchida qoladi va u ulardan
o'qiydi; platforma yonida IELTS mashqini beradi. Har kun kitobning aniq
unit va sahifasini ko'rsatadi (`Kitobda: 1A, 8-sahifa`).

### Lug'at: faqat sinonim

Foydalanuvchi talabi bo'yicha lug'atda **o'zbekcha tarjima yo'q** — faqat
sinonim, turkum va inglizcha misol gap. Sabab kodda ham yozilgan: tarjima
orqali o'rganilgan so'z ikki bosqichda eslanadi (inglizcha → o'zbekcha →
ma'no) va gapirishda sekinlashtiradi; sinonim orqali o'rganilgani esa
to'g'ridan-to'g'ri inglizcha tarmoqqa ulanadi — bu IELTS paraphrase uchun
ham aynan kerak narsa. Dasturiy tekshirilgan: 600 so'zning birortasida ham
o'zbekcha matn yo'q.

30 unit tugagach (31-kundan) lug'at **takror sikliga** o'tadi: har kuni
oldingi unitlardan biri qaytariladi. Bir marta ko'rilgan so'z yodda qolmaydi.

Matn uzunligi sahifada `paras` dan HISOBLANADI (`wordCount()`), qo'lda
yozilmaydi — aks holda matn tahrirlanganda son eskirib qoladi. Hozirgi
matnlar 520–610 so'z; haqiqiy IELTS Academic matni 700–900 so'z bo'ladi,
ya'ni bular hozircha biroz qisqa. Savol turlari va tuzoqlar to'liq
IELTS qolipida.

### O'qish markazi — uch yo'nalish (`#/books/reading`)

Har kuni uchta matn, har birida o'z IELTS savollari:

| Yo'nalish | Manba | Sikl | Fayl |
|---|---|---|---|
| Kitob (e-book) | Reading Explorer 3 mavzulari, **sarlavhalar kitobniki** | 24 matn, aylanadi | `eng-reading-*.js` |
| Diniy | payg'ambarlar, sahobalar, chahoryor, xalifalar | ketma-ket (d-kun → d-matn) | `eng-read-rel-*.js` |
| Tarixiy | faqat tarix; Markaziy Osiyo ko'proq | ketma-ket | `eng-read-hist-*.js` |

`tier: 'easy'` — 1–15-kun: T/F/NG, ko'p variantli, qisqa javob (moslashish).
16-kundan to'liq IELTS: matching headings, summary completion, Y/N/NG.
Diniy matnlar keng tarqalgan siyrat va tarix manbalaridagi voqealarga
tayanadi; bahsli tafsilotlar ataylab kiritilmagan.

### Kitobdagi joyim (anchor)

Foydalanuvchi kitobni platformadan tezroq o'qishi mumkin. `#/books` da
"Kitobda qayerdaman?" → 1A…12B tanlanadi → **bugungi kun anchor** bo'ladi:
`settings.books.readingAnchor = {day, no}`. Keyingi kunlar undan davom
etadi (`cycleNo()` — `books.js`). Tinglash uchun ham shunday + erkin izoh
("Unit 5 · 11–20"). Kod jadvalni foydalanuvchiga emas, foydalanuvchining
real joyiga moslaydi.

### Savollar bilan ishlash

Javob yopiq turadi — avval o'zing yoz, keyin och. Javob bilan birga **NEGA
shundayligi** chiqadi, chunki IELTS'da javobning o'zidan ko'ra sababi
muhimroq (`why` maydoni). Tinglashda transkript ham yopiq: uni telefondagi
text-to-speech bilan tinglab ishlash, transkriptni esa faqat javob berib
bo'lgach ochish tavsiya etiladi.

---

## Ikki kursni parallel olib borish

`js/data/dual.js` (`DUAL`) — Python va ingliz tili bir vaqtda yurganda
haftaning qaysi kuni kimniki ekanini belgilaydi. Roadmap sahifasining
2-bo'limida ko'rinadi.

| Kun | Ingliz tili | Python | Everest LC |
|---|---|---|---|
| Du · Ch · Ju | 6 ko'nikma (4s 35d) | 1 dars + uy vazifasi | — |
| Se · Pa · Sha | 6 ko'nikma (3s 40d) | — | 16:30–18:30 |
| Yakshanba | test + tahlil | — | — |

Python haftasiga 3 kun × 10 hafta = 30 dars, ya'ni ingliz tilining 1–10-haftasiga
aynan sig'adi. Keyin DataCamp 1-bosqichiga o'tiladi.

**Ikkita asosiy qoida:**
1. Vaqt yetmasa Python sekinlashtiriladi, ingliz tili emas — IELTS sanasi
   qat'iy, Pythonniki yo'q.
2. 8 soat uyqu hech qachon qisqartirilmaydi. Kun ulgurmasa dars qisqaradi.

---

## Kontentni tahrirlash

### Yangi kun qo'shish
`js/data/course.js` ga obyekt qo'shing:

```js
{
  day: 31,
  type: "topic",                        // yoki "review"
  unit: "Hafta 5 — Yangi mavzu",
  title:  { uz: "…", en: "…" },
  intro:  { uz: "…", en: "…" },
  sections: [{ h: {uz,en}, p: {uz,en}, code: "…" }],
  practice: [{ uz: "…", en: "…" }],
  konspekt: { uz: ["…"], en: ["…"] },
  quiz: [{ q: "…", opts: ["a","b","c","d"], correct: 0 }]
}
```

Sidebar, roadmap, cheatsheet, qidiruv va progress avtomatik yangilanadi —
hech qayerda `30` raqami qattiq yozilmagan.

### Izoh qo'shish
`js/data/deep.js`:

```js
DEEP[31] = {
  notes: [                      // course.js dagi sections bilan indeks bo'yicha mos
    { why: {uz,en}, analogy: {uz,en}, pitfall: {uz,en} }
  ],
  extraSections: [ { h, p, code } ],   // qo'shimcha to'liq bo'limlar
  close: {uz,en}
};
```

### Test izohi
`js/data/explain.js`: `EXPLAIN[31] = [ {uz,en} × 10 ]` — savollar tartibida.

---

## Klaviatura qisqartmalari

| Tugma | Vazifa |
|---|---|
| `Ctrl/⌘ + K` yoki `/` | Qidiruv paneli |
| `↑ ↓` va `Enter` | Qidiruvda yurish va ochish |
| `Esc` | Panel / modal / drawer'ni yopish |
| `→` yoki `J` | Keyingi dars / hafta |
| `←` yoki `K` | Oldingi dars / hafta |
| `Ctrl/⌘ + Enter` | Kod maydonida kodni ishga tushirish |
| `[` | Chap panelni yig'ish / yoyish (☰ tugmasi bilan bir xil) |
| `?` | Qisqartmalar oynasi (Sozlamalar → Qisqartmalar tugmasi ham ochadi) |
| `g` + harf | Tez o'tish: `g d` panel · `g t` Bugun · `g r` Takror · `g p` Mashq · `g m` Xatolar · `g s` Sozlamalar · `g c` Kurslar · `g e` Ingliz · `g b` Kitoblar · `g a` Tahlil (1.2 s ichida) |
| `Space`, `1 2 3` | Takror sessiyasida: javobni ochish, baholash |

---

## V2 — Learning OS: o'rganish halqasi (AI'siz, deterministik)

```
MAQSAD → BUGUN → O'RGAN → MASHQ → TEST → XATO → TAKROR → MAHORAT → LOYIHA → TAHLIL
```

Yangi qatlam `js/engine.js` (Review · Mastery · Recommend · Continue ·
StudyTime) va sahifalar: `today.js`, `review.js`, `practice.js`,
`projects.js`, `analytics.js` (+ Saved). Holat `Store` v7 — hammasi
**qo'shimcha** maydonlar (`quiz`, `review`, `last`, `bookmarks`, `done`,
`sessions`), eski progress o'zgarmaydi; sinxronda `newerMap`/`orMap`.

| Bo'lim | Marshrut | Nima qiladi |
|---|---|---|
| Chap menyu | — | Yo'l bo'yicha: UY (panel, Bugun, intizom) · O'QUV · MASHQ (mashq, takror, xatolar, cheatsheet) · RIVOJLANISH · KARYERA (loyihalar) · TIZIM (profil, eslatmalar, saqlanganlar, sozlamalar) |
| Boshqaruv paneli | `#/dashboard` | Hozirgi missiya (Recommend[0]), Davom etish chiplari, qarz, sohalar bo'yicha progress, o'quv salomatligi (izchillik/mahorat/mashq/takror), zaif sohalar |
| Bugun | `#/today` | Deterministik reja: muddati o'tgan takror → xatolar → zaif soha → bugungi dars → kitob rejasi → speaking/writing; belgilash → `Store.sessions` (vaqt) |
| Takror | `#/review` | SRS navbati: so'z · xato · Python konspekti · ingliz kuni · grammatika. Oraliq 1→3→7→14→30→60. Baho: Yana/Yaxshi/Oson (klaviatura: Space, 1/2/3) |
| Mashq markazi | `#/practice` | Manba (Python / ingliz / grammatika / lug'at / xatolar) × qiyinlik × soni. Natija, kuchli/zaif mavzular; xato → Xato banki + takror |
| Xatolar | `#/mistakes` | Yagona bank: kategoriya (Python, ingliz, grammatika, lug'at, mashq), takror holati va sanasi, "takror navbatiga" |
| Loyihalar | `#/projects` | 6 Python loyihasi, darsdan keyin ochiladi, checklist, eslatma, mulohaza; tugashi Python mahoratining "qo'llash" qismi |
| Tahlil | `#/analytics`, `#/weekly`, `#/monthly` | Vaqt (ustunlar), darslar, mashqlar, takrorlar, tuzatilgan xatolar; Python/ingliz mahorati; kuchli/zaif; keyingi hafta/oy ustuvorligi |
| Saqlanganlar | `#/saved` | Xatcho'plar: Python darsi, ingliz kuni, grammatika mavzusi, lug'at uniti, matn (har sahifa sarlavhasida tugma) |
| Eslatmalar | `#/notes` | Yagona: Python + ingliz kunlari + daftarlar, qidiruv, filtr |

**Mahorat** (`Mastery`): Python — bilim (darslar), mashq (test balli), xotira
(takror oraliqlari), qo'llash (loyihalar). Ingliz — lug'at (daftar + SRS),
grammatika (o'rganilgan mavzular + practice), o'qish (matnlar + ball),
tinglash (BBC + reja kunlari), speaking (trek + WPM), writing (haftalar).
Hammasi real saqlangan progressdan; tugatish ≠ mahorat.

**Ulanishlar**: Python testi → `quiz`, xato → bank + SRS, o'tsa konspekt → SRS;
ingliz testi → `quiz` + xato bank + SRS; ingliz kuni yopilsa → SRS; daftarga
so'z → SRS; grammatika kartasida "O'rgandim / Takrorga / Saqlash"; speaking
kunida 5 bandli o'z-o'zini baholash; writing haftasida qoralama → versiyalar →
6 bandli tekshiruv; tinglash rejasida kun "bajarildi"; `Continue.touch` har
sahifada oxirgi joyni eslaydi.

**Dars ostidagi halqa** (`learnLoop`, `js/pages/lesson.js`; Python darsi va
ingliz kunida): Dars → Test → Xatolar → Takror → Mashq → Loyiha holati bilan +
**"O'z so'zim bilan tushuntirish"** maydoni (chuqur o'rganish; `Store.read`
`exp-<kind>-<id>`). **Maqsad** sahifasida ufqlar: kunlik / qisqa (7 kun) /
o'rta (3 oy) / uzoq — xaritadan avtomatik. **Intizom**: shu hafta / shu oy
to'liq kunlar. **Yo'l xaritasi**: Maqsad → Kurslar → Ko'nikmalar → Mashq →
Loyihalar → Mahorat → Karyera zanjiri, har halqa real raqam bilan. **Karyera**:
tayyorlik % + 8 bandli ro'yxat. Qidiruv daftar so'zlari, loyihalar va ochiq
xatolarni ham topadi.

**Test yakuni** (Python testi va ingliz kunidagi test): natija ostida
**Kuchli / Takror kerak** bo'linmasi (`quizBreakdown`, `js/quiz.js`) —
qaysi savollar mustahkam, qaysilari Xato banki + takror navbatiga tushgani,
"Takror" / "Xatolar" tugmalari bilan.

**Kitoblar ichida**: tinglash bo'limida ball kartasi (`read['l<n>']`:
score/best/attempts, `quiz['ls:<n>']`, belgilanmagan savol → xato banki +
SRS); o'qish trekida **Davom etish / Saqlangan / Tugallangan** ro'yxatlari;
lug'at unitida "Daftarga qo'shish (N so'z)" → daftar + SRS; kod maydonida
"Daftarga" → Coding daftari. **Reja** sahifasida shu haftaning Du–Ya jadvali
(Python kuni, ingliz kuni, speaking, takror muddati). **Sozlamalar → Kunlik
me'yor**: ingliz / coding og'ir / coding LC daqiqalari — `Goal.required`,
Bugun va qarz hisobi shundan oladi.

**Tahlil → Hafta/Oy**: "oldingi davrga nisbatan" farqlar (vaqt, Python, EN,
mashq, takror) va **mulohaza** (3 savol: nima ishladi / nima to'sdi / bitta
fokus; `read['rf-w-<dushanba>']`, `read['rf-m-<yil-oy>']`, avtomatik
saqlanadi, oldingilar ro'yxati). **Boshqaruv panelida "Birinchi qadamlar"**:
ism, yo'l xaritasi, intizom, Python 1-kun, ingliz 1-kun, birinchi so'z —
holatdan hisoblanadi (`done['seen:*']`), hammasi bajarilsa yoki yashirilsa
(`done['onb:hide']`) yo'qoladi.

**Chuqurlashtirish (audit → to'ldirish)**:
- **Python mavzu mahorati** (`Mastery.lesson(day)`, `Mastery.topics()`):
  bilim 35% + test 35% + xotira 30% (konspekt SRS oralig'i, tuzatilgan
  xatolar). Python kursi sahifasida mavzular jadvali va har dars kartasida
  `ball · %`, dars ostidagi halqada "Mahorat N%", Tahlilda mavzu tugmalari
  (eng zaif darsga o'tadi).
- **Tavsiya**: takrorlanuvchi xato (2+ marta) — bitta bo'lsa ham 2-ustuvorlik.
- **So'z holati**: yangi · o'rganilmoqda · tanish · **takror kerak** (muddati
  o'tgan) · mahorat; daftarda "takror kerak" filtri.
- **Boshqaruv panelida "Bugungi ustuvorlik"** — Bugun sahifasining o'sha
  ro'yxati (`TodayPlan.items`), birinchi 4 ochiq band; ikkinchi tizim emas.
- **Davom etish** loyihani ham eslaydi (`last.project`).
- **Writing**: Savol → Reja → Lug'at → Qoralama → Tekshiruv → Qayta yozish →
  Final bosqich chizig'i; reja maydoni (`read['wr-N'].plan`), versiyani
  "Final" deb belgilash (`.final`), versiyani qoralamaga qaytarish.
- **Daftar**: sevimli (⭐, `fav`), manba havolasi (`src`/`srcT` — darsga
  qaytadi), "Sevimli" filtri; darsdan yozish tugmalari: Python darsi → Coding
  daftari, ingliz kuni va grammatika kartasi → Ingliz daftari, matn → Lug'at
  daftari (`Copybook.fromBtn`).
- **Karyera**: Portfolio (tugallangan loyihalar: daraja, ko'nikmalar,
  mulohaza) + **CV matni** faqat real raqamlardan (nusxalash tugmasi).
- **Tahlil → Oy**: keyingi 4 bosqich (Maqsad xaritasi, qarz bilan surilgan).
- **Progressni o'chirish**: zaxira eslatmasi + `OCHIR` so'zini yozib tasdiqlash.
- Sensorli qurilmalarda bosiladigan elementlar ≥ 40px; 30 kunlik ustunlar
  telefonda zich rejimda.

**Oflayn**: `sw.js` (faqat https) — ilova qobig'i va `?v=` li fayllar
keshlanadi, `/api/*` hech qachon; sahifa tarmoq-avval. Kesh nomi versiyaga
bog'liq. Brauzer oflayn bo'lsa — toast + brend belgisida qizil halqa
(`body.is-offline`), qaytganda `Sync.pull()`. **A11y**: skip-link,
`aria-current`, focus halqalari, checkbox rollari; marshrut almashganda
fokus `#content` ga tushadi va `document.title` sahifa sarlavhasiga
o'zgaradi.

## V3 — intro, nazoratchi, kino, soat, flashcard, Toshbitik, generatorlar, xarita

| Nima | Qayerda | Qisqacha |
|---|---|---|
| **Intro oynasi** | `index.html`, `login.html` (inline) | Logo + UzLeeder + ACADEMY + 100% chizig'i + "by UzLeeder". Har kirishda; login sahifasida allaqachon kirgan bo'lsa intro tugagach ilovaga o'tadi (`UZ_INTRO_DONE`). |
| **Nazoratchi (Controller)** | `controller.html`, `api/ctrl/{login,io,password}.js`, `js/ctrl.js`, `js/pages/chat.js` (`#/chat`) | **Alohida login/parol** (`CTRL_USER`, `CTRL_PASSWORD_HASH`; paneldan almashtirilsa `uzla:ctrl:hash`), alohida cookie `uzla_ctrl` — nazoratchi ilovaga kira olmaydi, o'quvchi panelga kira olmaydi. Sessiya holati `idle → active → paused → finished` (ikkala tomon boshqaradi), o'quvchi qaysi sahifada (heartbeat 20 s + marshrut o'zgarganda), so'nggi 40 harakat, sessiyalar tarixi (faol daqiqa), shaxsiy chat (oxirgi 400 xabar), nazoratchi eslatmalari (faqat u ko'radi). **Real vaqt = 5 s polling** — WebSocket yo'q. Ekran/kamera uzatilmaydi. Faqat Vercel'da (`https`); mahalliy nusxada sahifa buni aytadi. |
| **Daftar dizaynlari** | `css/pages.css` (`.cb-amber`, `.cb-clay`) | Lug'at — LEXICON: qaymoq index-karta, qizil chekka, serif (Fraunces) bosh so'z, A–Z tab, muhr. Ingliz — JOURNAL: chiziqli varaq, ikki qizil chekka, teshiklar, Caveat sarlavha, tur yorlig'i. Coding — HUD (o'zgarmadi). |
| **Kinolar** | `js/pages/movies.js` (`#/movies`, `#/movies/<id>`) | Cheksiz: fayl (drag-drop / tanlash) yoki havola (mp4/webm URL, YouTube). Sarlavha, tavsif, davomiylik (videodan avtomatik), baho 1–10, thumbnail (avtomatik kadr yoki rasm). **Halol**: video fayl va thumbnail **IndexedDB** (`uzla-media`, shu qurilma), bulutda faqat metadata (`Store.movies`). Pleyer: to'xtagan joydan davom, 92% da "ko'rildi". |
| **Soat + flip clock** | `js/clock.js` | Tepada HH:MM (bosilsa vidjet). Vidjet: soat / taymer (25·50·90·+5, tugaganda signal, daqiqani ingliz/coding soatiga qo'shish) / sekundomer; **to'liq ekran** tugmasi (Esc yopadi). Holat `settings.flip`. |
| **Flashcardlar** | `js/pages/flash.js` (`#/flash`) | To'plam: daftar · takror kerak · kitob uniti 1–30 · mavzuli to'plam; yo'nalish so'z→ma'no / ma'no→so'z; Space/1/2/3. Baho SRS ga (`vocab:<id>` yoki `bw:u<n>:<so'z>` — `Review.card` 'bw' turi, `Flash.lookup`). |
| **Toshbitik (qat'iy xotira)** | `js/pages/etch.js` (`#/etch`) | Yozmasdan ochib bo'lmaydi: so'z — aniq yozish (6+ harfda 1 xato), tushuncha — ≥ 25 belgi o'z so'zi bilan. Baho: Bildim/Bilmadim. 5 ketma-ket → **o'yildi** (30 kun). Xato yoki 1+ kun kechikish → **darz** (streak −1/0). `review[id].streak/carved/cracks`. Bugun sahifasida 1-ustuvorlik. |
| **Savol generatorlari** | `js/gen.js` (`QGen`) | Python 31 shablon (arifmetika, `//` `%` `**`, `type`, kesim, str/list/dict metodlari, aliasing, bool, sikllar, funksiyalar, scope, rekursiya, f-string, set/tuple, xato turlari) — javob kod bilan hisoblanadi; grammatika (80 fe'l × 12 zamon × 10 ega × gap/inkor/savol + artikl, predlog, qiyosiy, shart, majhul, ko'chirma) ≈ 32 000; lug'at (kitob + mavzu + daftar × sinonim/teskari/ma'no/bo'sh joy/kollokatsiya) ≈ 2 500; speaking 40 mavzu × ramkalar × burchaklar ≈ 3 000 (mavzu tanlanadi yoki tasodifiy; taymer, chunk'lar, halol baho). Mashq markazi: yarmi tayyor, yarmi generator; soni ko'rsatiladi. |
| **Maqsad xaritasi** | `js/data/masterplan.js`, `js/goalmap.js` | 2026 → 2083 yo'l, 4 qalin bosqich (16–19 · 19–24 · 24–29 · 29–63), maqsadlar nuqta. **SEN** = 1-bosqich 5 o'lchovining o'rtachasi (IELTS: ingliz kunlari+mahorat; Tech: Python darslari+mahorat; Academy V2: loyihalar; karyera: tayyorlik; $50K: profildagi jamg'arma) − qarz × 0.4%. **TAQVIM** = bugungi sana bo'yicha kerak bo'lgan joy. Pastda master-reja jadvali. |

**Vercel env (yangi)**: `CTRL_PASSWORD_HASH` (nazoratchi paroli, `make-credentials.ps1` bilan yoki README'dagi Node bir qatorligi), ixtiyoriy `CTRL_USER` (standart `controller`). Nazoratchi manzili: `https://<sayt>/controller`.

## Brand assets (`brand/`)

Cover image (1920×1080), thumbnail (1280×720) va cover video (8 s, MP4) —
hammasi koddan render qilinadi (`brand/*.html` → headless Chrome → PNG /
kadrlar → ffmpeg). Identity: navy fon, cyan aksent, "Personal Learning OS",
Learn → Practice → Master → Build, by UzLeeder. Tafsilot: `brand/README.md`,
qayta render: `tools\render-brand.ps1` (Windows) yoki `bash tools/render-brand.sh` (macOS/Linux).

## Daftarlar — Books & Copybook (`#/copy/vocab | english | coding`)

Kitoblar bo'limi endi **Kitoblar & daftar**: 5 kitob kartasi + 3 daftar.
Dizayn — tech HUD: qora shisha panellar, grid fon, neon aksent (amber /
terrakota / yashil), burchak qavslari, #01 indeks, fokusda skan chizig'i,
yozib olish va eshitishda to'lqin animatsiyasi, kod — terminal oynasi.

- **Lug'at daftari** — har so'z: so'z · transkripsiya · tarjima · sinonimlar
  · misol · izoh + **talaffuzni yozib olish** (MediaRecorder, 30 s gacha) va
  eshitish. "Bugungi 40 so'z" tugmasi kitobning ikki unitini bo'sh varaqlar
  qilib qo'shadi (sinonimlar oldindan). Filtr: hammasi / ovozsiz / bugun.
- **Ingliz tili daftari** — grammatika / ibora / xato / fikr, matn va misol.
- **Coding daftari** — sarlavha, til, kod (qora kod-varaq), izoh, teglar.

Matn `Store.copy` da, bulutga sinxron (`newerMap`). **Ovoz yozuvlari**
IndexedDB (`uzla-audio`) da — faqat shu qurilmada; bulut chegarasi (1 MB)
uchun ataylab sinxronlanmaydi. Hamma maydon joyida tahrirlanadi, 600 ms da
saqlanadi. Kod: `js/pages/copybook.js`. Intizom jadvalidagi "DARS 2 · Lug'at"
bloki endi daftarga olib boradi.

## Profil (`#/profile`)

Ism, lavozim/maqsad va bio (joyida tahrirlanadi, bulutga sinxron). Uch xil
sertifikat bir joyda:

- **Haftalik intizom** — dushanba–yakshanba har kun to'liq yopilsa (bironta
  kun tashlab yuborilmasa) hafta tugagach avtomatik beriladi
  (`Certificate.weeks()`, `js/certificate.js`). Yashil-tilla dizayn, PNG.
- **Kurs** — Python haftalari va IELTS (mavjud sertifikatlar).
- **Tashqi** — IELTS, DataCamp, LC va boshqalar rasm sifatida biriktiriladi;
  brauzerda ≤1000px JPEG'ga kichraytiriladi, `profile.certs` da saqlanadi,
  bulutga sinxronlanadi (holat hajmi 900 KB gacha nazorat qilinadi).

## Chap panel

- Guruh sarlavhalari (LEARN / MA'LUMOTNOMA / PLATFORMA / MEN) bosilsa
  yig'iladi (`settings.navCollapsed`); yig'ilgan guruhda faol sahifa
  bo'lsa faqat o'sha qator ko'rinadi.
- ☰ (yoki `[`) — butun panel ikonka rejimiga yig'iladi (36px, raqamlarsiz,
  `settings.sidebarCollapsed`). Panel ekranning chap burchagiga qotirilgan
  (`position: fixed`), kontent esa qolgan joyning o'rtasida turadi.
- Tor ekranda ☰ avvalgidek drawer'ni ochadi.

## Maqsad sahifasi — Leeder City

0→ekspert xaritasidan keyin uzoq muddatli manzara: ikkita rasm (saytning
o'zida sudrab tashlanadi, `Store.city`, bulutga sinxron; bo'lmasa
`img/city-1.jpg`, `img/city-2.jpg`), SVG silueti (binolar bosqichi kelganda
yoritiladi), 6 bosqichli reja (`GOAL_CITY_PHASES`) va infratuzilma jadvali
(`GOAL_CITY`) — hammasi `js/pages/goal.js` da.

## Sozlamalar

- **Mavzu** — sakkizta: Terrakota (qorong'i/yorug'), Navy·tilla, O'rmon·amber,
  Okean·moviy, Binafsha·pushti, Qum·dengiz ko'ki, Mono. Hammasi
  `css/tokens.css` da `[data-theme="…"]` bloki — komponentlar faqat
  `var(--…)` ishlatadi, shuning uchun yangi mavzu = bitta blok. Tepadagi
  quyosh/oy tugmasi mavzu menyusini
  ochadi — sozlamalardagi bilan bir xil kartalar; login sahifasida ham shu
  menyu bor. Logo va favicon mavzu rangida. Ro'yxat `App.THEMES` (`js/app.js`).
- **Bildirishnomalar** — Maqsad sahifasida yoqiladi (brauzer ruxsati).
- **Ketma-ket rejim** — keyingi kun faqat oldingisidan 7/10 olingandan keyin ochiladi
  (standart: o'chiq).
- **Javoblarni aralashtirish** — test variantlari har safar boshqa tartibda
  (standart: yoqilgan; o'chirish tavsiya etilmaydi, quyiga qarang).
- **Kod maydoni** — kod misollari ostida Pyodide bilan ishlaydigan muharrir.

Progressni JSON fayl sifatida yuklab olish va tiklash ham Sozlamalar bo'limida.

---

## Bilib qo'yish kerak bo'lgan tafsilotlar

**PWA.** `manifest.json` + `img/icon-*.png` — telefonda "Bosh ekranga
qo'shish" alohida ilova kabi ochiladi (standalone). Service worker yo'q —
login darvozasi bilan kesh to'qnashmasin. Manifest va ikonkalar
`middleware.js` da ochiq (ularda sir yo'q).

**Kutilmagan xato — toast.** `window.onerror` / `unhandledrejection` xabarni
toast qilib ko'rsatadi (fayl:qator bilan) — jim buzilish bo'lmaydi.

**Kesh.** `index.html` dagi barcha skript/CSS manzillarida `?v=…` bor.
O'zgarish kiritganda versiyani oshiring — eski fayl yangisi bilan aralashmaydi
(aynan shu sabab bir marta chap panelda "UNDEFINED" chiqqan edi).

**Inglizcha birlik.** `tr()` `1 days` → `1 day` ni o'zi tuzatadi.

**Test javoblari aralashtiriladi.** Asl ma'lumotda 300 savoldan 251 tasining
to'g'ri javobi "B" variantida edi — ya'ni har safar B ni bosgan odam hamma
testdan o'tib ketardi. Ma'lumotning o'zi o'zgartirilmadi; variantlar
ko'rsatishdan oldin aralashtiriladi, har tugma o'z asl indeksini `data-o` da
olib yuradi. Shuning uchun aralashtirishni o'chirish testni yana zaiflashtiradi.

**Pyodide ~10 MB.** U sahifa ochilishida emas, faqat birinchi marta
"Ishga tushirish" bosilganda yuklanadi. Internet bo'lmasa tushunarli xabar
chiqadi va sahifa buzilmaydi. `input()` brauzer `prompt()` iga bog'langan.

**Kompaniya logotiplari haqiqiy** — chizib yasalgani emas, chunki logotip brend
mulki va o'xshatib chizilgani noto'g'ri bo'ladi. Uch bosqichli zanjir:
`cdn.simpleicons.org` (brend rasmiy SVG'si) → kompaniyaning **o'z saytidan**
favicon → harfli zaxira. O'zbekiston kompaniyalari simpleicons'da yo'q, shuning
uchun ular ikkinchi bosqichdan keladi. Har karta kompaniya saytiga havola.

**Ma'lumot faqat brauzerda saqlanadi.** Server yo'q — boshqa qurilmaga o'tish
uchun Sozlamalardan JSON eksport/import qiling. Saqlash sxemasi hozir `v: 6`
(`habit`, `speak` va `settings.prayer` — jumladan qo'lda kiritilgan vaqtlar).
Eski eksportlar muammosiz import bo'ladi — yetishmagan maydonlar standart qiymat
bilan to'ldiriladi. `v3 → v4` da ingliz tili progressi hafta bo'yichadan kun
bo'yichaga o'tdi; ikkalasi ham oddiy son bo'lgani uchun ularni ajratib bo'lmaydi,
shuning uchun migratsiyada eski progress tozalanadi (mock ballari saqlanadi).

**IELTS sertifikati rasmiy hujjat emas.** U shu platformadagi 20 haftalik
tayyorgarlik tugatilganini tasdiqlaydi, xolos — sertifikatning o'zida ham
shu izoh yozilgan. Oxirgi mock natijasi bo'lsa, band ballari ham chiziladi.
"# uzleeder-academy" 
