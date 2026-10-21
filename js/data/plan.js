/* ==========================================================================
   DataCamp o'qish rejasi (DCPLAN) va karyera ma'lumotlari (CAREER)
   --------------------------------------------------------------------------
   Bu fayl faqat MA'LUMOT saqlaydi — chizish js/pages/ ichida.
   Shunday ajratilgan: rejani yangilash uchun HTML/CSS bilishning hojati yo'q.
   ========================================================================== */

window.DCPLAN = {
  intro: {
    uz: "DataCamp Premium bilan AI Engineer bo'lish yo'li. Bu — real jadval: shoshilmasdan, mustahkam. Har bosqichni tugatganda belgila.",
    en: "Your path to AI Engineer with DataCamp Premium. A realistic schedule — steady, not rushed. Check off each phase as you finish."
  },
  totalNote: {
    uz: "Jami real muddat: ~5–7 oy muntazam ishlaganda (kuniga 1.5–2 soat). \"2 oy\" emas — chunki 0 darajadan mustahkam poydevor qurish vaqt oladi. Bu yaxshi: yuzaki emas, haqiqiy bilim.",
    en: "Total realistic time: ~5–7 months of steady work (1.5–2h/day). Not \"2 months\" — building a solid base from zero takes time. That's good: real skill, not surface-level."
  },
  phases: [
    {
      n: 1,
      title: { uz: "Python Programming Fundamentals — DataCamp treki (Poydevor)", en: "Python Programming Fundamentals — the DataCamp track (Foundation)" },
      time: { uz: "16 soat · 20-sen → 5-okt · kuniga 1 bob", en: "16 hours · 20 Sep → 5 Oct · one chapter a day" },
      goal: { uz: "Python'da mustaqil kod yozib, xatolarni o'zing tuzatasan. Platformadagi 30 kunlik kurs bilan parallel: bir mavzu ikki manbadan.", en: "Write Python independently and fix your own errors. In parallel with the 30-day course here: each topic from two sources." },
      courses: [
        { uz: "Introduction to Python for Developers (3 bob)", en: "Introduction to Python for Developers (3 chapters)" },
        { uz: "Intermediate Python for Developers (3 bob)", en: "Intermediate Python for Developers (3 chapters)" },
        { uz: "Python Toolbox — iteratorlar, comprehension, generatorlar (3 bob)", en: "Python Toolbox — iterators, comprehensions, generators (3 chapters)" },
        { uz: "Data Types in Python (4 bob)", en: "Data Types in Python (4 chapters)" },
        { uz: "Loyiha: Creating Functions to Register App Users", en: "Project: Creating Functions to Register App Users" }
      ],
      tip: { uz: "Trek sahifasi (#/datacamp) har bobning sanasi, darslari va testini beradi. Yakshanba — katta coding testi. Bosqich trek 14/14 bo'lganda o'zi yopiladi.", en: "The track page (#/datacamp) gives every chapter's date, lessons and quiz. Sunday — the big coding test. The phase closes itself at 14/14." }
    },
    {
      n: 2,
      title: { uz: "Data uchun Python (Oraliq — muhim!)", en: "Python for Data (Bridge — important!)" },
      time: { uz: "3–4 hafta · kuniga 1.5–2 soat", en: "3–4 weeks · 1.5–2h/day" },
      goal: { uz: "NumPy, Pandas va OOP'ni chuqurroq. API'dan OLDIN bu kerak — aks holda keyingi bosqich juda qiyin bo'ladi.", en: "NumPy, Pandas, and deeper OOP. Needed BEFORE APIs — otherwise the next phase is too hard." },
      courses: [
        { uz: "Introduction to NumPy", en: "Introduction to NumPy" },
        { uz: "Data Manipulation with pandas", en: "Data Manipulation with pandas" },
        { uz: "Object-Oriented Programming in Python", en: "Object-Oriented Programming in Python" }
      ],
      tip: { uz: "Bu bosqich asl rejada yo'q edi, lekin qo'shildi — chunki OpenAI API va LangChain OOP va data bilan ishlashni talab qiladi. Buni tashlab ketma.", en: "This wasn't in the original plan, but it was added — because the OpenAI API and LangChain require OOP and data skills. Don't skip it." }
    },
    {
      n: 3,
      title: { uz: "AI va Prompt arxitekturasi (Nazariya)", en: "AI & Prompt Architecture (Theory)" },
      time: { uz: "1 hafta · kuniga 1.5 soat", en: "1 week · 1.5h/day" },
      goal: { uz: "AI modellari ilmiy jihatdan qanday ishlashini tushunasan. Prompt muhandisligi qoidalari.", en: "Understand how AI models work scientifically. The rules of prompt engineering." },
      courses: [
        { uz: "Understanding Artificial Intelligence / AI Fundamentals", en: "Understanding Artificial Intelligence / AI Fundamentals" },
        { uz: "Introduction to ChatGPT / Generative AI Concepts", en: "Introduction to ChatGPT / Generative AI Concepts" }
      ],
      tip: { uz: "Bu bosqich yengil va qiziqarli — nazariya, ko'p kod yo'q. Miya AI tafakkuriga moslashadi.", en: "This phase is light and fun — theory, not much code. Your mind adapts to AI thinking." }
    },
    {
      n: 4,
      title: { uz: "Professional AI muhandisligi (Amaliyot)", en: "Professional AI Engineering (Practice)" },
      time: { uz: "8–12 hafta · kuniga 2 soat", en: "8–12 weeks · 2h/day" },
      goal: { uz: "AI'dan foydalanuvchi emas — uni dasturga ulaydigan, mustaqil agent quradigan muhandis bo'lasan. Eng qiyin, eng qimmatli bosqich.", en: "Not an AI user — an engineer who integrates it and builds autonomous agents. The hardest, most valuable phase." },
      courses: [
        { uz: "Introduction to APIs in Python (tizimlarni ulash)", en: "Introduction to APIs in Python" },
        { uz: "Working with the OpenAI API", en: "Working with the OpenAI API" },
        { uz: "Developing AI Systems with the OpenAI API", en: "Developing AI Systems with the OpenAI API" },
        { uz: "AI Engineering with LangChain (mustaqil agentlar)", en: "AI Engineering with LangChain" }
      ],
      tip: { uz: "Bu yerda sekinlashsang normal — LangChain agent qurish junior darajadagi ish. Har kursdan keyin kichik loyiha yoz, faqat ko'rib o'tma.", en: "Slowing down here is normal — building LangChain agents is junior-level work. Write a small project after each course, don't just watch." }
    },
    {
      n: 5,
      title: { uz: "Sertifikat va Portfolio", en: "Certificate & Portfolio" },
      time: { uz: "2 hafta", en: "2 weeks" },
      goal: { uz: "Rasmiy sertifikat qo'lga kirit va o'z loyihangni GitHub'ga joyla. Ish topishda aynan shu kerak.", en: "Earn the official certificate and put your project on GitHub. This is exactly what gets you hired." },
      courses: [
        { uz: "DataCamp: AI Engineer for Developers imtihonini topshirish", en: "DataCamp: pass the AI Engineer for Developers exam" },
        { uz: "Portfolio: o'z Python/LangChain loyihangni GitHub'ga joylash", en: "Portfolio: publish your Python/LangChain project on GitHub" }
      ],
      tip: { uz: "Sertifikat — yaxshi, lekin ISHLAYDIGAN loyiha undan muhimroq. Ish beruvchilar GitHub'ingni ko'radi. Bittagina yaxshi loyiha 10 ta sertifikatdan ko'ra qimmatliroq.", en: "The certificate is good, but a WORKING project matters more. Employers look at your GitHub. One good project beats ten certificates." }
    }
  ]
};

window.CAREER = {
  truths: {
    title: { uz: "Uchta halol haqiqat", en: "Three honest truths" },
    items: [
      {
        h: { uz: "\"Ekspert\" — 2–4 yillik yo'l.", en: "\"Expert\" is a 2–4 year path." },
        p: { uz: "Obunaning o'zi seni ekspert qilmaydi — loyihalar, tajriba, vaqt kerak.", en: "A subscription alone won't make you an expert — projects, experience and time do." }
      },
      {
        h: { uz: "DataCamp hammasini bermaydi.", en: "DataCamp isn't everything." },
        p: { uz: "Matematika, real loyihalar, GitHub portfolio — tashqarida quriladi.", en: "Math, real projects and a GitHub portfolio are built outside it." }
      },
      {
        h: { uz: "\"Track completion\" ≠ \"Certification\".", en: "\"Track completion\" ≠ \"Certification\"." },
        p: { uz: "Track tugatish — guvohnoma; Associate/Professional — imtihon.", en: "Finishing a track is a statement; Associate/Professional are exams." }
      }
    ]
  },

  levels: [
    { k: "A", color: "#d97757",
      t: { uz: "Poydevor", en: "Foundation" },
      s: { uz: "Python asoslari + qo'lda kod yozish", en: "Python basics + coding by hand" },
      time: { uz: "2–3 oy", en: "2–3 mo" } },
    { k: "B", color: "#e08d6f",
      t: { uz: "AI Engineer (ishga tayyor)", en: "AI Engineer (job-ready)" },
      s: { uz: "API, OpenAI, RAG, LangChain, agentlar + xavfsizlik + sertifikat", en: "API, OpenAI, RAG, LangChain, agents + security + cert" },
      time: { uz: "4–6 oy", en: "4–6 mo" } },
    { k: "C", color: "#d9a441",
      t: { uz: "Data Scientist / ML", en: "Data Scientist / ML" },
      s: { uz: "Statistika, ML, matematika, deep learning + sertifikat", en: "Statistics, ML, math, deep learning + cert" },
      time: { uz: "6–9 oy", en: "6–9 mo" } },
    { k: "D", color: "#7bb389",
      t: { uz: "Ekspert (senior yo'li)", en: "Expert (senior path)" },
      s: { uz: "Ixtisoslashuv, MLOps, ochiq manba, ish tajribasi", en: "Specialization, MLOps, open source, work experience" },
      time: { uz: "1–2+ yil", en: "1–2+ yr" } }
  ],

  totalNote: {
    uz: "AI Engineer ishga tayyor — ~6–9 oy. Data Scientist/ML gacha — yana ~6–9 oy (ish bilan parallel). Ekspert — 2–4 yil tajriba.",
    en: "Job-ready AI Engineer ~6–9 mo. Through Data Scientist/ML ~6–9 mo more (alongside work). Expert — 2–4 years of experience."
  },
  totalCaveat: {
    uz: "\"Ishga tayyor\" ≠ \"ish topildi\" — ish topish alohida jarayon.",
    en: "\"Job-ready\" ≠ \"hired\" — finding a job is a separate process."
  },

  certNote: {
    uz: "⭐ = asosiy maqsad. \"Completion\" = guvohnoma; \"Associate/Professional\" = imtihon.",
    en: "⭐ = main goal. \"Completion\" = statement; \"Associate/Professional\" = exam."
  },
  certs: [
    /* IELTS birinchi turadi: u eng erta (20-fev 2027) va qolgan hammasining
       sharti — xalqaro ish ham, chet el ham ingliz tilisiz ochilmaydi. */
    { lv: "★", type: "IELTS", color: "#4a90d9", seal: "check", featured: true,
      name: { uz: "IELTS 8.0 (Academic)", en: "IELTS 8.0 (Academic)" },
      desc: { uz: "20-fevral 2027. Xalqaro ish, chet el va AI materialining sharti — birinchi va eng erta maqsad.",
              en: "20 February 2027. The precondition for international work, moving abroad and AI material — the first and earliest goal." },
      stamp: { uz: "★ BIRINCHI MAQSAD · 20-fev 2027", en: "★ FIRST GOAL · 20 Feb 2027" } },
    { lv: "A", type: "Completion", color: "#d97757", seal: "star",
      name: { uz: "Associate Python Developer", en: "Associate Python Developer" },
      desc: { uz: "Python asoslari tugatilgani — birinchi guvohnoma.", en: "Python basics done — first statement." } },
    { lv: "B", type: "Completion", color: "#e08d6f", seal: "star",
      name: { uz: "AI Engineer for Developers (track)", en: "AI Engineer for Developers (track)" },
      desc: { uz: "9 kurslik AI track guvohnomasi.", en: "9-course AI track statement." } },
    { lv: "B", type: "Associate ★", color: "#7bb389", seal: "check", featured: true,
      name: { uz: "AI Engineer for Developers — Associate", en: "AI Engineer for Developers — Associate" },
      desc: { uz: "Imtihon topshiriladigan HAQIQIY sertifikat. Birinchi asosiy maqsad.", en: "A REAL exam-based certificate. First main goal." },
      stamp: { uz: "★ ASOSIY MAQSAD", en: "★ MAIN GOAL" } },
    { lv: "C", type: "Associate", color: "#d9a441", seal: "check",
      name: { uz: "Data Scientist — Associate", en: "Data Scientist — Associate" },
      desc: { uz: "DS/ML yo'lidagi birinchi rasmiy sertifikat.", en: "First official DS/ML certificate." } },
    { lv: "C", type: "Professional ★★", color: "#7bb389", seal: "star", featured: true,
      name: { uz: "Data Scientist — Professional", en: "Data Scientist — Professional" },
      desc: { uz: "Imtihon + amaliy loyiha + taqdimot. Eng yuqori qadrlanadi.", en: "Exam + project + presentation. Most valued." },
      stamp: { uz: "★★ ENG QIMMATLI", en: "★★ MOST VALUED" } },
    { lv: "D", type: "Bonus", color: "#a68a76", seal: "plus",
      name: { uz: "Ixtisos sertifikatlari", en: "Specialization certs" },
      desc: { uz: "AWS ML, Azure AI (AI-102) yoki TensorFlow — ish talabiga qarab.", en: "AWS ML, Azure AI (AI-102) or TensorFlow — as the job needs." } }
  ],

  companiesNote: {
    uz: "Uch bosqich: O'zbekiston (2 yil) → chet el (5 yil) → maqsad kompaniyalar.",
    en: "Three stages: Uzbekistan (2 yr) → abroad (5 yr) → target companies."
  },
  companyGroups: [
    {
      title: { uz: "1-bosqich · O'zbekiston (2 yil)", en: "Stage 1 · Uzbekistan (2 yr)" },
      items: [
        { logo: { domain: "epam.com", text: "E", bg: "#1C7A3E" }, name: "EPAM Systems", site: "https://www.epam.com",
          d: { uz: "Xalqaro, Python/ML, junior ham.", en: "International, Python/ML, juniors too." },
          tag: { uz: "Xalqaro", en: "International" } },
        { logo: { domain: "uzum.uz", text: "U", bg: "#7C4DFF" }, name: "Uzum", site: "https://uzum.uz",
          d: { uz: "Eng yirik texnologiya kompaniyasi.", en: "Largest tech company." },
          tag: { uz: "Top mahalliy", en: "Top local" } },
        { logo: { domain: "it-park.uz", text: "IT", bg: "#0088CC" }, name: "IT Park Uzbekistan", site: "https://it-park.uz",
          d: { uz: "Rezidentlar, internship imkoniyatlari.", en: "Residents, internships." },
          tag: { uz: "Internship", en: "Internship" } },
        { logo: { domain: "payme.uz", text: "Pe", bg: "#00C4B3" }, name: "Payme", site: "https://payme.uz",
          d: { uz: "Fintech, data va backend.", en: "Fintech, data & backend." },
          tag: { uz: "Fintech", en: "Fintech" } },
        { logo: { domain: "group-ib.com", text: "GI", bg: "#C62828" }, name: "Group-IB", site: "https://www.group-ib.com",
          d: { uz: "Kiberxavfsizlik + AI/ML, R&D.", en: "Cybersecurity + AI/ML, R&D." },
          tag: { uz: "AI / Security", en: "AI / Security" } },
        { logo: { domain: "beeline.uz", text: "B", bg: "#FFCC00", fg: "#000" }, name: "VEON / Beeline", site: "https://beeline.uz",
          d: { uz: "Telekom, data va Python.", en: "Telecom, data & Python." },
          tag: { uz: "Telekom", en: "Telecom" } }
      ]
    },
    {
      title: { uz: "Remote (ingliz tiling afzallik ✓)", en: "Remote (your English is an edge ✓)" },
      items: [
        { logo: { slug: "upwork", color: "6FDA44", domain: "upwork.com", text: "Up", bg: "#14A800" }, name: "Upwork / Toptal", site: "https://www.upwork.com",
          d: { uz: "Freelance — birinchi tajriba, portfolio.", en: "Freelance — first experience, portfolio." },
          tag: { uz: "Freelance", en: "Freelance" } },
        { logo: { slug: "linkedin", color: "0A66C2", domain: "linkedin.com", text: "in", bg: "#0A66C2" }, name: "LinkedIn Jobs", site: "https://www.linkedin.com/jobs",
          d: { uz: "\"Junior Python\", remote filtri bilan qidir.", en: "Search \"Junior Python\" with remote filter." },
          tag: { uz: "Qidiruv", en: "Search" } },
        { logo: { domain: "wellfound.com", text: "W", bg: "#EC2C40" }, name: "Wellfound", site: "https://wellfound.com",
          d: { uz: "AI startaplar, remote junior.", en: "AI startups, remote junior." },
          tag: { uz: "Startaplar", en: "Startups" } }
      ]
    },
    {
      title: { uz: "Maqsad kompaniyalar (7+ yil)", en: "Target companies (7+ yr)" },
      target: true,
      items: [
        { logo: { slug: "google", color: "4285F4", domain: "deepmind.google", text: "G", bg: "#4285F4" }, name: "Google / DeepMind", site: "https://deepmind.google",
          d: { uz: "AI research va muhandislik.", en: "AI research and engineering." } },
        { logo: { slug: "openai", color: "10A37F", domain: "openai.com", text: "O", bg: "#10A37F" }, name: "OpenAI", site: "https://openai.com",
          d: { uz: "ChatGPT yaratuvchilari.", en: "Makers of ChatGPT." } },
        { logo: { slug: "anthropic", color: "D97757", domain: "anthropic.com", text: "A", bg: "#D97757" }, name: "Anthropic", site: "https://www.anthropic.com",
          d: { uz: "Claude yaratuvchilari.", en: "Makers of Claude." } },
        { logo: { slug: "nvidia", color: "76B900", domain: "nvidia.com", text: "N", bg: "#76B900" }, name: "NVIDIA", site: "https://www.nvidia.com",
          d: { uz: "AI apparati va dasturi.", en: "AI hardware and software." } }
      ]
    }
  ],

  yearsNote: {
    uz: "Taxminiy xarita. Tez borsang oldinga suriladi, sekin borsang cho'ziladi.",
    en: "An estimate. It shifts earlier if you're fast, later if slow."
  },
  years: [
    { y: "2026", color: "#d97757",
      label: { uz: "1-YIL", en: "YR 1" },
      t: { uz: "Python poydevori + AI asoslari", en: "Python foundation + AI basics" },
      d: { uz: "Python 0 dan; yil oxiriga NumPy, Pandas, OOP, API asoslari. Birinchi GitHub loyihalar.", en: "Python from zero; by year-end NumPy, Pandas, OOP, API basics. First GitHub projects." } },
    { y: "2027", color: "#e08d6f",
      label: { uz: "2-YIL", en: "YR 2" },
      t: { uz: "AI Engineer + birinchi ish", en: "AI Engineer + first job" },
      d: { uz: "OpenAI API, RAG, LangChain. AI Engineer Associate sertifikati. 3+ portfolio. O'zbekistonda junior ishga kir.", en: "OpenAI API, RAG, LangChain. AI Engineer Associate cert. 3+ portfolio. First junior job in Uzbekistan." } },
    { y: "2028", color: "#d9a441",
      label: { uz: "3-YIL", en: "YR 3" },
      t: { uz: "Tajriba + DS/ML (parallel)", en: "Experience + DS/ML (parallel)" },
      d: { uz: "Ish bilan parallel: matematika, ML. Data Scientist Associate. Chet el universitetlarini o'rgana boshla.", en: "Alongside work: math, ML. Data Scientist Associate. Start researching universities abroad." } },
    { y: "2029", color: "#c99a3a",
      label: { uz: "4-YIL", en: "YR 4" },
      t: { uz: "Tajriba + chet elga hujjat", en: "Experience + apply abroad" },
      d: { uz: "Data Scientist Professional. Kuchli portfolio. Master/PhD ariza: IELTS/GRE, grant izla.", en: "Data Scientist Professional. Strong portfolio. Master/PhD application: IELTS/GRE, seek grants." } },
    { y: "2030", color: "#8fae6e",
      label: { uz: "5-YIL", en: "YR 5" },
      t: { uz: "Chet elga o'tish · magistratura", en: "Move abroad · master's" },
      d: { uz: "AI/ML master. Xalqaro tarmoq. Yozgi internship — top kompaniyalarga birinchi eshik.", en: "AI/ML master's. International network. Summer internships — first door to top companies." } },
    { y: "2031–32", color: "#7bb389",
      label: { uz: "MASTER", en: "MASTER" },
      t: { uz: "Master yakuni / PhD + internship", en: "Master's / PhD + internship" },
      d: { uz: "Master tugat yoki PhD'ga o't. Kuchli internshiplar. Ilmiy ish yoki ochiq manba — senior signali.", en: "Finish master's or start PhD. Strong internships. Research or open source — a senior signal." } },
    { y: "2033+", color: "#4e8d5b",
      label: { uz: "MAQSAD", en: "GOAL" },
      t: { uz: "Google · OpenAI · Anthropic · NVIDIA", en: "Google · OpenAI · Anthropic · NVIDIA" },
      d: { uz: "Kuchli ta'lim + tajriba + portfolio bilan top kompaniyalarga ariza. Maqsad baland — yo'l yuqoriga olib chiqadi.", en: "With strong education + experience + portfolio, apply to top companies. Aim high — the path lifts you." } }
  ],

  closing: {
    title: { uz: "Muhim", en: "Important" },
    p: { uz: "Bu — taxminiy yo'l, qat'iy qonun emas. Ba'zilar tezroq, ba'zilar sekinroq boradi. Muhimi — har yil bir qadam oldinga.", en: "This is an estimate, not a strict rule. Some go faster, some slower. What matters is one step forward each year." }
  }
};
