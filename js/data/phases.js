/* ==========================================================================
   PHASES — Uzlat & Ribat: 4 bosqichli makro-tizim (Mission Control)
   --------------------------------------------------------------------------
   Kunlik chorcho'ba (Tahajjud 02:00, 3 pora, namozga anchor) 16 hafta
   O'ZGARMAYDI — HABIT.meta izohiga qarang. O'zgaradigan narsa: shu soatlar
   ichiga quyiladigan VAZIFALAR darajasi. Shu fayl aynan buni saqlaydi.

   Sanalar: 1-bosqich rasmiy startdan (25-okt, yakshanba kickoff) boshlanadi,
   har bosqich 4 hafta. 4-bosqich esa 10-fevralda tugaydi — kalendar
   shu kunda yopiladi — va undan keyin 11-20 fevral IMTIHON SPRINTI
   keladi (IELTS 2027-02-20). Shuning uchun 4-bosqich 25 kun, qolganlari 28.

   MILESTONE'lar ISBOT talab qiladi (`evidence`): vaqt sarflash o'z-o'zidan
   bosqichni yopmaydi. `evidence` qiymatlari:
     lesson   — platformadagi dars/bob yopilgan
     test     — baholash topshirilgan (ball saqlangan)
     artifact — ishlaydigan natija: repozitoriy, deploy, yozma ish, audio
     review   — haftalik hisobotda tasdiqlangan
   ========================================================================== */
window.PHASES = {
  meta: {
    from: '2026-10-25',
    to: '2027-02-10',
    exam: '2027-02-20',
    sprint: { from: '2027-02-11', to: '2027-02-20',
      title: { uz: 'IMTIHON SPRINTI', en: 'EXAM SPRINT' },
      d: { uz: "Kalendar 10-fevralda yopiladi. Qolgan 10 kun — faqat imtihon: mock testlar, xatolar jurnali, Speaking mashqi. Yangi mavzu yo'q.",
           en: 'The calendar closes on 10 February. The remaining ten days are exam only: mock tests, the error journal, speaking practice. No new material.' } },
    note: {
      uz: "Soat mexanizmi 4 oy davomida o'zgarmaydi. Faqat qilinadigan ishlarning darajasi qiyinlashib boradi.",
      en: 'The clockwork of the day does not change for four months. Only the difficulty of the work inside it rises.'
    }
  },

  list: [
    {
      k: 'p1', n: 1, from: '2026-10-25', to: '2026-11-21',
      title: { uz: 'POYDEVOR', en: 'FOUNDATION' },
      lede: { uz: 'Miya sof mantiq va xotira bazasini shakllantiradi.',
              en: 'The mind builds a base of clean logic and memory.' },
      tech: { uz: "Python asoslarini qotirish, developer muhiti, Git. T-Port uchun backend mantiqi va ma'lumotlar bazasi.",
              en: 'Python fundamentals, the developer environment, Git. Backend logic and the database for T-Port.' },
      english: { uz: "Qabul qilish: Listening va Reading. Destination B2 bo'limlari Mission qismlariga bog'lanadi.",
                 en: 'Input: listening and reading. Destination B2 units are linked to the Mission parts.' },
      spirit: { uz: "Kuniga 3 pora qiroat rejimini qon-qonga singdirish. Tahajjud 02:00 — odatga aylanishi kerak.",
                en: 'Make the three-juz rhythm second nature. Tahajjud at 02:00 must become a habit.' },
      milestones: [
        { id: 'p1-diag', evidence: 'test', t: { uz: 'Kirish baholashi: Python va ingliz tili darajasi', en: 'Entry assessment: Python and English level' } },
        { id: 'p1-py', evidence: 'lesson', t: { uz: 'Python 30 kunlik kurs yopildi (23-noyabrgacha)', en: 'The 30-day Python course closed (by 23 November)' } },
        { id: 'p1-dc', evidence: 'lesson', t: { uz: 'DataCamp 1-bosqich: Python Fundamentals treki', en: 'DataCamp phase 1: the Python Fundamentals track' } },
        { id: 'p1-git', evidence: 'artifact', t: { uz: 'Git va GitHub: birinchi repozitoriy va commit tarixi', en: 'Git and GitHub: a first repository with commit history' } },
        { id: 'p1-cli', evidence: 'artifact', t: { uz: 'Birinchi loyiha: ishlaydigan Python CLI vositasi', en: 'First project: a working Python CLI tool' } },
        { id: 'p1-rhythm', evidence: 'review', t: { uz: "4 hafta: 3 pora va Tahajjud uzilmadi", en: 'Four weeks: the three juz and Tahajjud unbroken' } }
      ]
    },
    {
      k: 'p2', n: 2, from: '2026-11-22', to: '2026-12-19',
      title: { uz: 'ARXITEKTURA', en: 'ARCHITECTURE' },
      lede: { uz: "Qoidalarni o'rgandingiz — endi o'zingiznikini yaratishni boshlaysiz.",
              en: 'You have learned the rules — now you start making your own.' },
      tech: { uz: "Oraliq Python, OOP, fayllar va xatolar. JSON, HTTP, REST va SQL. T-Port va CAIBER uchun API. LangChain BOSHLANADI (o'zlashtirilmaydi — DataCamp rejasi bo'yicha u fevralgacha davom etadi).",
              en: 'Intermediate Python, OOP, files and exceptions. JSON, HTTP, REST and SQL. APIs for T-Port and CAIBER. LangChain STARTS here (it is not mastered — by the DataCamp plan it runs into February).' },
      english: { uz: "Chiqarishga o'tish: Writing Task 1 va 2, mock Reading/Listening testlari. Kechqurungi bloklarda insho.",
                 en: 'Moving to output: Writing Task 1 and 2, mock reading and listening tests. Essays in the evening blocks.' },
      spirit: { uz: 'Tahajjud duolarida maqsadlarni kattalashtirish. Qarz har shanba oqshomida nolga tushadi.',
                en: 'Enlarge the goals in the Tahajjud supplications. Debt returns to zero every Saturday evening.' },
      milestones: [
        { id: 'p2-oop', evidence: 'lesson', t: { uz: 'OOP va modullar: Module 2 yopildi', en: 'OOP and modules: Module 2 closed' } },
        { id: 'p2-api', evidence: 'artifact', t: { uz: 'REST API: ishlaydigan endpoint va testlari', en: 'REST API: a working endpoint with tests' } },
        { id: 'p2-sql', evidence: 'artifact', t: { uz: "SQL: ma'lumotlar bazasiga ulangan modul", en: 'SQL: a module backed by a database' } },
        { id: 'p2-writing', evidence: 'test', t: { uz: 'Writing Task 1 va 2: kamida 8 ta tekshirilgan insho', en: 'Writing Task 1 and 2: at least eight reviewed essays' } },
        { id: 'p2-mock', evidence: 'test', t: { uz: 'Birinchi to\'liq mock Reading + Listening testi', en: 'The first full mock reading and listening test' } },
        { id: 'p2-tport', evidence: 'artifact', t: { uz: 'T-Port: backend va DB ishlaydigan holatda', en: 'T-Port: backend and database in a working state' } }
      ]
    },
    {
      k: 'p3', n: 3, from: '2026-12-20', to: '2027-01-16',
      title: { uz: 'VIZUALIZATSIYA VA SHIDDAT', en: 'VISUALISATION AND INTENSITY' },
      lede: { uz: "Tizimlar tayyor — endi uni dunyoga taqdim etish uchun qadoqlash vaqti.",
              en: 'The systems work — now it is time to package them for the world.' },
      tech: { uz: "Frontend: HTML, CSS, JavaScript. Minimalist dark mode, glassmorphism, qora va tilla UI. AI API integratsiyasi, RAG (embedding, retrieval, chunking). UzLeeder portfelini sayqallash.",
              en: 'Frontend: HTML, CSS, JavaScript. Minimalist dark mode, glassmorphism, a black and gold UI. AI API integration, RAG (embeddings, retrieval, chunking). Polishing the UzLeeder portfolio.' },
      english: { uz: "Speaking eng qizg'in pallasi: ovoz chiqarib gapirish, yozib olish, to'xtamasdan fikr tushuntirish.",
                 en: 'The most intense speaking phase: speaking aloud, recording, explaining without pausing.' },
      spirit: { uz: "Qish eng qiyin oy: Bomdod 06:09 ga suriladi, kun qisqaradi. Chorcho'ba shu yerda sinaladi.",
                en: 'Winter is the hardest stretch: Fajr moves to 06:09 and the day shortens. The frame is tested here.' },
      milestones: [
        { id: 'p3-ui', evidence: 'artifact', t: { uz: 'Frontend: responsive interfeys deploy qilindi', en: 'Frontend: a responsive interface deployed' } },
        { id: 'p3-ai', evidence: 'artifact', t: { uz: 'AI API: tuzilgan javob (structured output) bilan integratsiya', en: 'AI API: an integration with structured output' } },
        { id: 'p3-rag', evidence: 'artifact', t: { uz: 'RAG prototipi: retrieval ishlaydigan bilim yordamchisi', en: 'A RAG prototype: a knowledge assistant with working retrieval' } },
        { id: 'p3-speak', evidence: 'artifact', t: { uz: 'Speaking: kamida 20 ta yozib olingan javob', en: 'Speaking: at least twenty recorded answers' } },
        { id: 'p3-cv', evidence: 'artifact', t: { uz: 'EPAM darajasidagi rezyume va GitHub profili', en: 'An EPAM-grade CV and GitHub profile' } },
        { id: 'p3-portfolio', evidence: 'artifact', t: { uz: 'UzLeeder portfeli jonli manzilda', en: 'The UzLeeder portfolio live at a URL' } }
      ]
    },
    {
      k: 'p4', n: 4, from: '2027-01-17', to: '2027-02-10',
      title: { uz: 'JANG VA NATIJA', en: 'BATTLE AND RESULT' },
      lede: { uz: "Marafonning so'nggi sprinti: hamma o'rgangan narsani sinovdan o'tkazish.",
              en: 'The last sprint of the marathon: everything learned goes to the test.' },
      tech: { uz: "T-Port va boshqa loyihalarni production'ga yuklash. Testlar, monitoring, xavfsiz deploy, texnik hujjat. Capstone loyihasi.",
              en: 'Shipping T-Port and the other projects to production. Tests, monitoring, secure deployment, technical documentation. The capstone project.' },
      english: { uz: "Faqat imtihon rejimi: mock testlar, xatolar jurnali, Speaking. Yangi mavzu YO'Q.",
                 en: 'Exam mode only: mock tests, the error journal, speaking. NO new material.' },
      spirit: { uz: "Tawakkul: sababni to'liq qilib, natijani Allohdan kutish.",
                en: 'Tawakkul: do the work in full and leave the result to God.' },
      milestones: [
        { id: 'p4-prod', evidence: 'artifact', t: { uz: 'Capstone production\'da: jonli manzil va testlar yashil', en: 'The capstone in production: a live URL and green tests' } },
        { id: 'p4-review', evidence: 'review', t: { uz: 'Kod ko\'rigi: tashqi odam o\'qib tushundi', en: 'Code review: someone else read it and understood it' } },
        { id: 'p4-mock', evidence: 'test', t: { uz: 'Kamida 4 ta to\'liq mock IELTS testi', en: 'At least four full mock IELTS tests' } },
        { id: 'p4-interview', evidence: 'review', t: { uz: 'Texnik intervyu mashqi: 3 ta sessiya', en: 'Technical interview practice: three sessions' } },
        { id: 'p4-exam', evidence: 'test', t: { uz: 'IELTS imtihoni topshirildi (2027-02-20)', en: 'The IELTS exam taken (20 February 2027)' } }
      ]
    }
  ],

  /* --- Yordamchilar: sana → bosqich --------------------------------- */
  of: function (key) {
    var k = key || (window.Store && Store.dateKey());
    var out = null;
    PHASES.list.forEach(function (p) { if (k >= p.from && k <= p.to) out = p; });
    return out;
  },
  isSprint: function (key) {
    var k = key || (window.Store && Store.dateKey()), s = PHASES.meta.sprint;
    return k >= s.from && k <= s.to;
  },
  /* Bosqichning necha foizi o'tdi (kun bo'yicha; isbot emas, VAQT) */
  elapsed: function (key) {
    var p = PHASES.of(key); if (!p) return null;
    var d = function (x) { var a = String(x).split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); };
    var total = Math.round((d(p.to) - d(p.from)) / 86400000) + 1;
    var gone = Math.round((d(key || Store.dateKey()) - d(p.from)) / 86400000) + 1;
    return { phase: p, day: gone, total: total, pct: Math.round(gone / total * 100) };
  },
  /* Bajarilgan milestone'lar — ISBOT bo'yicha, vaqt bo'yicha emas.
     Belgi: read["ms-<id>"] = { at, evidence, note }                   */
  doneOf: function (p) {
    if (!window.Store) return [];
    return (p.milestones || []).filter(function (m) {
      var r = Store.readGet('ms-' + m.id);
      return !!(r && r.at);
    });
  }
};
