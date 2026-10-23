/* ==========================================================================
   i18n-2026 — 2026-10 yangilanishi matnlari (I18N_ADD orqali qo'shiladi)
   --------------------------------------------------------------------------
   • teacher / english rollari olib tashlandi → rol nomlari "olib tashlangan
     rol" deb ko'rsatiladi (eski yozuvlar arxivda shunday chiqadi).
   • "O'qituvchiga yuborish" o'rniga o'z-o'zini tekshirish (Writing/Speaking Studio).
   • Writing'dagi "ustoz bahosi" — platforma roli EMAS, tashqi sertifikatli
     baholovchi: nomi aniqlashtirildi, ma'lumot kaliti (teacher) o'zgarmagan.
   • Mission (IELTS) va Python & AI yo'li uchun umumiy matnlar.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.I18N_ADD) return;
  I18N_ADD({
    uz: {
      role_teacher: "Sobiq o'qituvchi (olib tashlangan rol)",
      role_english: "Sobiq ingliz tili o'qituvchisi (olib tashlangan rol)",
      commNoStaff: "Hozircha nazoratchi sozlanmagan (server env: CTRL_PASSWORD_HASH).",
      commArchive: 'Arxiv (olib tashlangan rollar)',
      commRetired: 'faqat o\'qish',
      commArchiveS: "Bu rol 2026-oktabrda olib tashlangan. Suhbat o'chirilmagan, lekin yangi xabar yuborib bo'lmaydi. Savollaringizni nazoratchiga yozing; o'quv savollari uchun Mission sahifasidagi tushuntirishlar va Writing/Speaking Studio bor.",
      asArchiveNote: "Topshiriqlar endi yaratilmaydi (o'qituvchi rollari olib tashlangan). Bu — eski topshiriqlar arxivi. Kunlik reja Mission sahifasida.",
      msnOpen: 'Mission',
      fbNone: "Eski feedback yo'q. Yangi ishlaringiz Writing / Speaking Studio'da o'z-o'zini baholash orqali tekshiriladi.",
      rvFlowS: "Eski tekshiruvlar arxivi (faqat o'qish). Yangi ishlar Writing Studio'da: mezonlar bo'yicha o'z bahosi, xato belgilari, qayta yozish.",
      rvSelfT: "O'z-o'zini tekshirish — Writing Studio",
      rvSelfS: "Matningizni Writing Studio'ga olib o'ting: so'z soni va tuzilma tekshiruvi, 4 mezon bo'yicha o'z bahosi, xatolarni belgilash (ular takror navbatiga tushadi), qayta yozish va versiyalarni solishtirish. Ball — o'z bahongiz, rasmiy emas.",
      rvSelfBtn: "Writing Studio'da ochish",
      rvSelfSpkT: "O'z-o'zini tekshirish — Speaking Studio",
      rvSelfSpkS: "Speaking Studio'da javobni yozib oling, qayta tinglang va mezonlar bo'yicha o'zingizni baholang. Talaffuz faqat yozuv bo'lsa baholanadi.",
      rvSelfSpkBtn: "Speaking Studio'ni ochish",
      rvArchive: "Eski tekshiruv / feedback (arxiv)",
      wrTeacherT: 'Tashqi baho (sertifikatli IELTS baholovchi)',
      wrTeacherHint: "Ixtiyoriy. Platformadan TASHQARIDA sertifikatli IELTS baholovchi bergan bandni yozing. O'z bahongizni bu yerga yozmang — u Writing Studio'da alohida saqlanadi.",
      wrTeacherBand: 'Tashqi baholovchi bergan band',
      wrTeacherNote: "Baholovchining izohi (asosiy 2–3 kamchilik)",
      wrTeacherSaved: 'Tashqi baho saqlandi: band {b}',
      navMission: 'IELTS Mission',
      navPyai: 'Python & AI yo\'li'
    },
    en: {
      role_teacher: 'Former teacher (retired role)',
      role_english: 'Former English support teacher (retired role)',
      commNoStaff: 'No controller configured yet (server env: CTRL_PASSWORD_HASH).',
      commArchive: 'Archive (retired roles)',
      commRetired: 'read-only',
      commArchiveS: 'This role was removed in October 2026. The conversation is kept, but no new messages can be sent. Write to the controller for support; for learning questions use the explanations in Mission and the Writing/Speaking Studio.',
      asArchiveNote: 'Assignments are no longer created (teacher roles were removed). This is the archive of earlier assignments. Your daily plan is in Mission.',
      msnOpen: 'Mission',
      fbNone: 'No earlier feedback. New work is checked through self-assessment in the Writing / Speaking Studio.',
      rvFlowS: 'Archive of earlier reviews (read-only). New work goes to the Writing Studio: self-assessment on the criteria, error marks, revision.',
      rvSelfT: 'Self-review — Writing Studio',
      rvSelfS: 'Take your text to the Writing Studio: word-count and structure checks, self-assessment on the 4 criteria, error marking (marked errors join your review queue), revision and version comparison. Scores are your own estimate, not official.',
      rvSelfBtn: 'Open in the Writing Studio',
      rvSelfSpkT: 'Self-review — Speaking Studio',
      rvSelfSpkS: 'In the Speaking Studio record your answer, listen back and assess yourself on the criteria. Pronunciation is only rated when a recording exists.',
      rvSelfSpkBtn: 'Open the Speaking Studio',
      rvArchive: 'Earlier review / feedback (archive)',
      wrTeacherT: 'External mark (certified IELTS examiner)',
      wrTeacherHint: 'Optional. Enter a band given OUTSIDE the platform by a certified IELTS examiner. Do not put your own estimate here — that is stored separately in the Writing Studio.',
      wrTeacherBand: 'Band given by the external examiner',
      wrTeacherNote: "Examiner's comment (the 2–3 main weaknesses)",
      wrTeacherSaved: 'External mark saved: band {b}',
      navMission: 'IELTS Mission',
      navPyai: 'Python & AI path'
    }
  });
})();
