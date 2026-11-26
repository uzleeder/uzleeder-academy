/* ==========================================================================
   MASTERPLAN — Leeder Corporation (UzLeeder): 0 dan global AI-Islom Smart
   City darajasigacha. 4 bosqich, har birida katta maqsad (qalin) va o'lchovli
   ko'rsatkichlar. Maqsad sahifasidagi XARITA shu yerdan chiziladi.

   Bosqich obyekti: k, y (yillar), age, t (qalin sarlavha), goals: [{t, when, d, m}]
     m — o'lchov kaliti (faqat 1-bosqichda; boshqalari hali o'lchanmaydi):
         ielts | tech | product | work | finance
   ========================================================================== */
window.MASTERPLAN = {
  from: '2026-10-25', to: '2083-12-31',
  phases: [
    { k: 'p1', y: '2026 – 2029', age: '16–19', from: '2026-10-25', to: '2029-01-01',
      t: { uz: 'Tizimli poydevor va akademik tayyorgarlik', en: 'Systematic foundation and academic preparation' },
      goals: [
        { m: 'ielts', t: { uz: 'IELTS 7.5+', en: 'IELTS 7.5+' }, when: '2027', d: { uz: "B1+/Pre-IELTS'dan çiqib, IELTS Intro va Advanced darslarini yopiş. Xalqaro VC muzokaralari uçun zarur.", en: 'Leave B1+/Pre-IELTS behind, close the IELTS Intro and Advanced lessons. Needed for international VC negotiations.' } },
        { m: 'tech', t: { uz: 'Teç Mastery: Python, LangChain, REST API, LeetCode', en: 'Tech Mastery: Python, LangChain, REST API, LeetCode' }, when: '2027', d: { uz: 'Dasturlaşning "asab tizimi"ni master qiliş. Şokirov Math Academy CRM backendini topşiriş.', en: 'Master the "nervous system" of programming. Deliver the Shokirov Math Academy CRM backend.' } },
        { m: 'product', t: { uz: 'UzLeeder Academy V2 — Learning OS (Vercel)', en: 'UzLeeder Academy V2 — Learning OS (Vercel)' }, when: '2028 Q1', d: { uz: "Xususiy Mistake Bank va Review Systemʼga ega Learning OS'ni noldan qurib deploy qiliş. Portfolioning asosiy ğişti.", en: 'Build and deploy a personal Learning OS with a Mistake Bank and Review System. The cornerstone of the portfolio.' } },
        { m: 'work', t: { uz: 'Iş tajribasi: lokal senior teç leadlar bilan', en: 'Work experience with local senior tech leads' }, when: '2028 – 2029', d: { uz: "Global işga kirişdan oldin real jamoada işlaş tajribasi (lokal CRM loyihalari).", en: 'Real team experience before a global job (local CRM projects).' } },
        { m: 'finance', t: { uz: "Jamğarma: $0 → $50K", en: 'Savings: $0 → $50K' }, when: '2029', d: { uz: "Global kompaniyaga köçiş uçun birlamçi xarajatlarni yopiş.", en: 'Cover the initial costs of moving to a global company.' } }
      ] },
    { k: 'p2', y: '2029 – 2034', age: '19–24', from: '2029-01-01', to: '2034-01-01',
      t: { uz: 'Global tajriba va kapital', en: 'Global experience and capital' },
      goals: [
        { t: { uz: 'Karyera starti: EPAM Systems / FAANG — AI/Software Engineer (AQŞ/Yevropa)', en: 'Career start: EPAM Systems / FAANG — AI/Software Engineer (US/Europe)' }, when: '2029 (2030 bufer)', d: { uz: 'Enterprise-darajadagi kodlaş, jamoa boşqaruvi va arxitektura standartlari.', en: 'Enterprise-level coding, team management and architecture standards.' } },
        { t: { uz: 'Senior AI Engineer', en: 'Senior AI Engineer' }, when: '2033', d: { uz: "Murakkab enterprise maʼlumot arxitekturalarini boşqariş; $10M+ loyiha byudjetlari tajribasi.", en: 'Manage complex enterprise data architectures; experience with $10M+ project budgets.' } },
        { t: { uz: 'Şaxsiy kapital $1.2M', en: 'Personal capital $1.2M' }, when: '2034', d: { uz: "Maoş, stock options, oqilona investitsiya. Leeder Corpʼning global startini şaxsan moliyalaştiriş uçun minimal zarur pul.", en: 'Salary, stock options, wise investing. The minimum needed to personally fund Leeder Corp\'s global start.' } },
        { t: { uz: 'UzLeeder brendi va AI-Islom Smart City konsepsiyasi', en: 'UzLeeder brand and the AI-Islamic Smart City concept' }, when: '2029 – 2034', d: { uz: "Işdan böş vaqtda şahar arxitekturasini çizişda davom etiş.", en: 'Keep drawing the city architecture in free time.' } }
      ] },
    { k: 'p3', y: '2034 – 2039', age: '24–29', from: '2034-01-01', to: '2039-01-01',
      t: { uz: 'Leeder Corp global launch va "Unicorn"', en: 'Leeder Corp global launch and "Unicorn"' },
      goals: [
        { t: { uz: 'Global start: Enterprise AI va B2B SaaS', en: 'Global start: Enterprise AI and B2B SaaS' }, when: '2034', d: { uz: "$1.2M kapital va EPAM obrösiga tayanib global kompaniyani noldan kötariş.", en: 'Raise a global company from zero on $1.2M capital and the EPAM reputation.' } },
        { t: { uz: 'Valuatsiya $3B – $8B (Decacorn), ARR $10M – $50M', en: 'Valuation $3B – $8B (Decacorn), ARR $10M – $50M' }, when: '2038', d: { uz: 'Davlatlar bilan "Jurisdictional Arbitrage" muzokaralari uçun iqtisodiy qudrat.', en: 'Economic power for "jurisdictional arbitrage" negotiations with states.' } },
        { t: { uz: 'VC sindikati $15B – $50B (Yaqin Şarq)', en: 'VC syndicate $15B – $50B (Middle East)' }, when: '2038 – 2039', d: { uz: '50 yillik soliq imtiyozi va SEZ maqomini muzokara qiliş.', en: 'Negotiate a 50-year tax holiday and SEZ status.' } }
      ] },
    { k: 'p4', y: '2039 – 2083', age: '29–63', from: '2039-01-01', to: '2083-12-31',
      t: { uz: 'Smart City qurilişi va "Singularity"', en: 'Smart City construction and "Singularity"' },
      goals: [
        { t: { uz: 'Poydevor: yer (Samarqand / Qozoğiston), 50 yillik SEZ', en: 'Foundation: land (Samarkand / Kazakhstan), 50-year SEZ' }, when: '2039 – 2044', d: { uz: 'Xususiy aeroport, Singularity Tower, Markaziy Masjid, AI Museum, MIT/Harvard/Stanford filiallari — boşlanişi.', en: 'Private airport, Singularity Tower, Central Mosque, AI Museum, MIT/Harvard/Stanford campuses — the start.' } },
        { t: { uz: 'Quriliş va launch: 1-bosqiç şahar', en: 'Construction and launch: phase 1 of the city' }, when: '2044 – 2055', d: { uz: '100% yaşil energiya, deterministik AI logistika, foizsiz islomiy moliya.', en: '100% green energy, deterministic AI logistics, interest-free Islamic finance.' } },
        { t: { uz: 'Sivilizatsiya merosi: AGI hub, ROI 2060', en: 'Civilisational legacy: AGI hub, ROI in the 2060s' }, when: '2055 – 2083+', d: { uz: "Şahar AGI va sivilizatsiya ösiş xabi; soliq imtiyozi tugagandan söng sivilizatsiya aktivi.", en: 'The city as an AGI and civilisational growth hub; a civilisational asset after the tax holiday ends.' } }
      ] }
  ]
};
