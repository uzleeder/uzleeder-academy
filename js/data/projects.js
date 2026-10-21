/* ==========================================================================
   PROJECTS — Python loyihalari: bilim → mashq → kichik loyiha → katta loyiha
   --------------------------------------------------------------------------
   Har loyiha kursning aniq darsidan keyin ochiladi (after = yopilgan darslar
   soni). Checklist bandlari Store.done da: "proj:<id>:<i>", tugallanishi
   "proj:<id>:done". Eslatma va mulohaza — Store.copy emas, Store.notes ham
   emas: Store.read('proj-<id>') (umumiy kichik yozuvlar ombori).
   Faqat Python — boshqa til/kurs qo'shilmaydi.
   ========================================================================== */
window.PROJECTS = {
  meta: {
    title: { uz: 'Loyihalar', en: 'Projects' },
    lede: { uz: "Bilim faqat qo'llanganda mahoratga aylanadi. Har loyiha kursning aniq bosqichidan keyin ochiladi va o'rganilgan narsalarning o'zini talab qiladi — ortiqcha hech narsa.", en: 'Knowledge becomes mastery only when applied. Each project unlocks after a specific stage of the course and demands exactly what was learned — nothing extra.' }
  },
  list: [
    { id: 'p1', after: 4, level: 1, hours: 2,
      title: { uz: 'Kunlik hisob-kitob (kalkulyator)', en: 'Daily calculator' },
      goal: { uz: "Foydalanuvchidan ikki son va amalni o'qib, natijani chiroyli chiqaradigan konsol dasturi. 0 ga bo'lishni ushlaydi.", en: 'A console program that reads two numbers and an operation and prints a clean result. Handles division by zero.' },
      skills: ['input()', 'int/float', 'if/elif', 'f-string'],
      steps: [
        { uz: "input() bilan ikki son va amalni o'qish", en: 'Read two numbers and an operator with input()' },
        { uz: "int/float ga aylantirish, xato kiritilsa qayta so'rash", en: 'Convert to int/float; ask again on bad input' },
        { uz: '4 amal + qoldiq (%) + daraja (**)', en: '4 operations + modulo + power' },
        { uz: "0 ga bo'lish — xabar, dastur yiqilmaydi", en: 'Division by zero — message, no crash' },
        { uz: "Natija f-string bilan 2 xonali: 7.50", en: 'Result via f-string with 2 decimals: 7.50' }
      ] },
    { id: 'p2', after: 7, level: 1, hours: 3,
      title: { uz: "IELTS lug'at testi", en: 'IELTS vocabulary quiz' },
      goal: { uz: "Ro'yxatdagi 20 so'zdan tasodifiy 10 tasini so'raydi (so'z → tarjima), ballni hisoblaydi, xatolarni oxirida ko'rsatadi. O'z daftaringdagi so'zlar bilan.", en: 'Asks 10 random words from a list of 20 (word → translation), scores, shows mistakes at the end. Use your own copybook words.' },
      skills: ['list', 'for', 'random', 'while', 'dict'],
      steps: [
        { uz: "20 ta so'z: [ ['kerosene','kerosin'], … ] ro'yxati", en: 'A list of 20 pairs [word, translation]' },
        { uz: 'random.sample bilan 10 tasini tanlash', en: 'Pick 10 with random.sample' },
        { uz: 'Har savolga javob, to\'g\'ri/xato sanash', en: 'Ask each, count right/wrong' },
        { uz: "Xatolarni alohida ro'yxatga yig'ib oxirida chiqarish", en: 'Collect mistakes in a list and print at the end' },
        { uz: '"Yana?" — while bilan takrorlash', en: '"Again?" — repeat with while' }
      ] },
    { id: 'p3', after: 13, level: 2, hours: 4,
      title: { uz: 'Intizom jurnali (CSV)', en: 'Discipline journal (CSV)' },
      goal: { uz: "Har kuni: sana, ingliz tili daqiqasi, coding daqiqasi, namoz 5/5 — CSV faylga yozadi. Haftalik hisobot: jami, o'rtacha, eng yaxshi kun.", en: 'Each day: date, English minutes, coding minutes, prayers 5/5 — written to CSV. Weekly report: totals, averages, best day.' },
      skills: ['dict', 'file open/with', 'csv', 'datetime', 'functions'],
      steps: [
        { uz: 'add_day() — bitta kunni CSV ga qo\'shadi', en: 'add_day() — appends one day to the CSV' },
        { uz: 'read_all() — faylni lug\'atlar ro\'yxatiga o\'qiydi', en: 'read_all() — reads the file into a list of dicts' },
        { uz: "week_report() — oxirgi 7 kun: jami/o'rtacha/eng yaxshi", en: 'week_report() — last 7 days: total/average/best' },
        { uz: 'Fayl yo\'q bo\'lsa — yaratadi, buzilgan qator — o\'tkazib yuboradi', en: 'Creates the file if missing, skips broken rows' },
        { uz: 'Menyu: 1 qo\'shish · 2 hisobot · 0 chiqish', en: 'Menu: 1 add · 2 report · 0 exit' }
      ] },
    { id: 'p4', after: 19, level: 2, hours: 5,
      title: { uz: 'Speaking kartalar treki', en: 'Speaking cards tracker' },
      goal: { uz: "Class Card, Deck, Session: kartani ko'rsatadi, javob vaqtini o'lchaydi, WPM va pauzani yozadi, JSON'ga saqlaydi. 30 kunlik trekni Python'da qayta quradi.", en: 'Classes Card, Deck, Session: shows a card, times the answer, stores WPM and pauses, saves to JSON. Rebuilds the 30-day track in Python.' },
      skills: ['class', '__init__', 'methods', 'json', 'time', 'list comprehension'],
      steps: [
        { uz: 'Card(question, part, minutes) klassi', en: 'Card(question, part, minutes) class' },
        { uz: 'Deck — kartalar ro\'yxati, tasodifiy tanlash, filtr (Part 2)', en: 'Deck — list of cards, random pick, filter (Part 2)' },
        { uz: 'Session — start/stop, davomiylik, WPM kiritish', en: 'Session — start/stop, duration, enter WPM' },
        { uz: 'json.dump / json.load bilan tarix', en: 'History with json.dump / json.load' },
        { uz: 'Hisobot: haftalik o\'rtacha WPM (list comprehension)', en: 'Report: weekly average WPM (list comprehension)' }
      ] },
    { id: 'p5', after: 25, level: 3, hours: 6,
      title: { uz: 'Xato banki tahlilchisi', en: 'Mistake-bank analyser' },
      goal: { uz: "Platformadan eksport qilingan JSON (progress) ni o'qib: eng ko'p xato mavzular, hafta bo'yicha dinamika, takror muddati o'tganlar — matn hisobot va oddiy ASCII grafik.", en: 'Reads the exported platform JSON: most-missed topics, weekly dynamics, overdue reviews — a text report and a simple ASCII chart.' },
      skills: ['json', 'collections.Counter', 'datetime', 'sorted + lambda', 'try/except', 'modules'],
      steps: [
        { uz: 'Sozlamalar → eksport JSON ni o\'qish (try/except)', en: 'Read the exported JSON from Settings (try/except)' },
        { uz: 'mistakes → Counter bo\'yicha top-5 mavzu', en: 'mistakes → top-5 topics via Counter' },
        { uz: 'review → muddati o\'tganlar (datetime taqqoslash)', en: 'review → overdue items (datetime comparison)' },
        { uz: 'Hafta bo\'yicha yopilgan darslar — ASCII ustunlar', en: 'Lessons closed per week — ASCII bars' },
        { uz: 'Kod 2 modulga bo\'lingan: load.py, report.py', en: 'Code split into 2 modules: load.py, report.py' }
      ] },
    { id: 'p6', after: 30, level: 3, hours: 10,
      title: { uz: 'Leeder Assistant — CLI o\'quv yordamchisi', en: 'Leeder Assistant — CLI study helper' },
      goal: { uz: "Bitta dastur: bugungi reja (kun turi bo'yicha), lug'at testi, speaking taymer, xato tahlili, CSV/JSON saqlash. Portfolioning birinchi loyihasi — GitHub'da README bilan.", en: "One program: today's plan (by day type), vocabulary quiz, speaking timer, mistake analysis, CSV/JSON storage. First portfolio project — on GitHub with a README." },
      skills: ['everything so far', 'argparse', 'packages', 'README', 'git'],
      steps: [
        { uz: 'Paket tuzilmasi: leeder/ (plan, vocab, speak, report)', en: 'Package layout: leeder/ (plan, vocab, speak, report)' },
        { uz: 'argparse: leeder plan | quiz | speak | report', en: 'argparse: leeder plan | quiz | speak | report' },
        { uz: 'Avvalgi 5 loyiha modullar sifatida qayta ishlatiladi', en: 'The previous 5 projects reused as modules' },
        { uz: 'README: nima, qanday ishga tushirish, skrinshot', en: 'README: what, how to run, screenshot' },
        { uz: 'GitHub\'ga push, Profil → Karyera ga havola', en: 'Push to GitHub, link from Profile → Career' }
      ] }
  ]
};
