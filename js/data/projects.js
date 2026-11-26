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
    lede: { uz: "Bilim faqat qöllanganda mahoratga aylanadi. Har loyiha kursning aniq bosqiçidan keyin oçiladi va örganilgan narsalarning özini talab qiladi — ortiqça heç narsa.", en: 'Knowledge becomes mastery only when applied. Each project unlocks after a specific stage of the course and demands exactly what was learned — nothing extra.' }
  },
  list: [
    { id: 'p1', after: 4, level: 1, hours: 2,
      title: { uz: 'Kunlik hisob-kitob (kalkulyator)', en: 'Daily calculator' },
      goal: { uz: "Foydalanuvçidan ikki son va amalni öqib, natijani çiroyli çiqaradigan konsol dasturi. 0 ga bölişni uşlaydi.", en: 'A console program that reads two numbers and an operation and prints a clean result. Handles division by zero.' },
      skills: ['input()', 'int/float', 'if/elif', 'f-string'],
      steps: [
        { uz: "input() bilan ikki son va amalni öqiş", en: 'Read two numbers and an operator with input()' },
        { uz: "int/float ga aylantiriş, xato kiritilsa qayta söraş", en: 'Convert to int/float; ask again on bad input' },
        { uz: '4 amal + qoldiq (%) + daraja (**)', en: '4 operations + modulo + power' },
        { uz: "0 ga böliş — xabar, dastur yiqilmaydi", en: 'Division by zero — message, no crash' },
        { uz: "Natija f-string bilan 2 xonali: 7.50", en: 'Result via f-string with 2 decimals: 7.50' }
      ] },
    { id: 'p2', after: 7, level: 1, hours: 3,
      title: { uz: "IELTS luğat testi", en: 'IELTS vocabulary quiz' },
      goal: { uz: "Röyxatdagi 20 sözdan tasodifiy 10 tasini söraydi (söz → tarjima), ballni hisoblaydi, xatolarni oxirida körsatadi. Öz daftaringdagi sözlar bilan.", en: 'Asks 10 random words from a list of 20 (word → translation), scores, shows mistakes at the end. Use your own copybook words.' },
      skills: ['list', 'for', 'random', 'while', 'dict'],
      steps: [
        { uz: "20 ta söz: [ ['kerosene','kerosin'], … ] röyxati", en: 'A list of 20 pairs [word, translation]' },
        { uz: 'random.sample bilan 10 tasini tanlaş', en: 'Pick 10 with random.sample' },
        { uz: 'Har savolga javob, töğri/xato sanaş', en: 'Ask each, count right/wrong' },
        { uz: "Xatolarni alohida röyxatga yiğib oxirida çiqariş", en: 'Collect mistakes in a list and print at the end' },
        { uz: '"Yana?" — while bilan takrorlaş', en: '"Again?" — repeat with while' }
      ] },
    { id: 'p3', after: 13, level: 2, hours: 4,
      title: { uz: 'Intizom jurnali (CSV)', en: 'Discipline journal (CSV)' },
      goal: { uz: "Har kuni: sana, ingliz tili daqiqasi, coding daqiqasi, namoz 5/5 — CSV faylga yozadi. Haftalik hisobot: jami, örtaça, eng yaxşi kun.", en: 'Each day: date, English minutes, coding minutes, prayers 5/5 — written to CSV. Weekly report: totals, averages, best day.' },
      skills: ['dict', 'file open/with', 'csv', 'datetime', 'functions'],
      steps: [
        { uz: 'add_day() — bitta kunni CSV ga qöşadi', en: 'add_day() — appends one day to the CSV' },
        { uz: 'read_all() — faylni luğatlar röyxatiga öqiydi', en: 'read_all() — reads the file into a list of dicts' },
        { uz: "week_report() — oxirgi 7 kun: jami/örtaça/eng yaxşi", en: 'week_report() — last 7 days: total/average/best' },
        { uz: 'Fayl yöq bölsa — yaratadi, buzilgan qator — ötkazib yuboradi', en: 'Creates the file if missing, skips broken rows' },
        { uz: 'Menyu: 1 qöşiş · 2 hisobot · 0 çiqiş', en: 'Menu: 1 add · 2 report · 0 exit' }
      ] },
    { id: 'p4', after: 19, level: 2, hours: 5,
      title: { uz: 'Speaking kartalar treki', en: 'Speaking cards tracker' },
      goal: { uz: "Class Card, Deck, Session: kartani körsatadi, javob vaqtini ölçaydi, WPM va pauzani yozadi, JSON'ga saqlaydi. 30 kunlik trekni Python'da qayta quradi.", en: 'Classes Card, Deck, Session: shows a card, times the answer, stores WPM and pauses, saves to JSON. Rebuilds the 30-day track in Python.' },
      skills: ['class', '__init__', 'methods', 'json', 'time', 'list comprehension'],
      steps: [
        { uz: 'Card(question, part, minutes) klassi', en: 'Card(question, part, minutes) class' },
        { uz: 'Deck — kartalar röyxati, tasodifiy tanlaş, filtr (Part 2)', en: 'Deck — list of cards, random pick, filter (Part 2)' },
        { uz: 'Session — start/stop, davomiylik, WPM kiritiş', en: 'Session — start/stop, duration, enter WPM' },
        { uz: 'json.dump / json.load bilan tarix', en: 'History with json.dump / json.load' },
        { uz: 'Hisobot: haftalik örtaça WPM (list comprehension)', en: 'Report: weekly average WPM (list comprehension)' }
      ] },
    { id: 'p5', after: 25, level: 3, hours: 6,
      title: { uz: 'Xato banki tahlilçisi', en: 'Mistake-bank analyser' },
      goal: { uz: "Platformadan eksport qilingan JSON (progress) ni öqib: eng köp xato mavzular, hafta böyiça dinamika, takror muddati ötganlar — matn hisobot va oddiy ASCII grafik.", en: 'Reads the exported platform JSON: most-missed topics, weekly dynamics, overdue reviews — a text report and a simple ASCII chart.' },
      skills: ['json', 'collections.Counter', 'datetime', 'sorted + lambda', 'try/except', 'modules'],
      steps: [
        { uz: 'Sozlamalar → eksport JSON ni öqiş (try/except)', en: 'Read the exported JSON from Settings (try/except)' },
        { uz: 'mistakes → Counter böyiça top-5 mavzu', en: 'mistakes → top-5 topics via Counter' },
        { uz: 'review → muddati ötganlar (datetime taqqoslaş)', en: 'review → overdue items (datetime comparison)' },
        { uz: 'Hafta böyiça yopilgan darslar — ASCII ustunlar', en: 'Lessons closed per week — ASCII bars' },
        { uz: 'Kod 2 modulga bölingan: load.py, report.py', en: 'Code split into 2 modules: load.py, report.py' }
      ] },
    { id: 'p6', after: 30, level: 3, hours: 10,
      title: { uz: 'Leeder Assistant — CLI öquv yordamçisi', en: 'Leeder Assistant — CLI study helper' },
      goal: { uz: "Bitta dastur: bugungi reja (kun turi böyiça), luğat testi, speaking taymer, xato tahlili, CSV/JSON saqlaş. Portfolioning birinçi loyihasi — GitHub'da README bilan.", en: "One program: today's plan (by day type), vocabulary quiz, speaking timer, mistake analysis, CSV/JSON storage. First portfolio project — on GitHub with a README." },
      skills: ['everything so far', 'argparse', 'packages', 'README', 'git'],
      steps: [
        { uz: 'Paket tuzilmasi: leeder/ (plan, vocab, speak, report)', en: 'Package layout: leeder/ (plan, vocab, speak, report)' },
        { uz: 'argparse: leeder plan | quiz | speak | report', en: 'argparse: leeder plan | quiz | speak | report' },
        { uz: 'Avvalgi 5 loyiha modullar sifatida qayta işlatiladi', en: 'The previous 5 projects reused as modules' },
        { uz: 'README: nima, qanday işga tuşiriş, skrinşot', en: 'README: what, how to run, screenshot' },
        { uz: 'GitHub\'ga puş, Profil → Karyera ga havola', en: 'Push to GitHub, link from Profile → Career' }
      ] }
  ]
};
