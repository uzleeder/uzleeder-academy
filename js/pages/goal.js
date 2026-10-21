/* ==========================================================================
   Goal — #/goal · 0 dan ekspertgacha, sanalar bilan
   --------------------------------------------------------------------------
   Yuqorida: bugungi talab (ingliz 4 soat, coding 4/2 soat) va bajarilgani,
   qarz kunlari va roast. Keyin sanali xarita: har bosqich, holati, va qarz
   tufayli qancha surilgani. Pastda: haftalik soat me'yori va "nima uchun".
   ========================================================================== */

  /* Leeder City — Maqsad sahifasidagi uzoq muddatli ko'rinish jadvali.
     Ustunlar: infratuzilma · asosiy arxitektura va vazifa · ekotizimga ulanish */
  window.GOAL_CITY = [
    { ic: 'building', n: { uz: 'Singularity Tower', en: 'Singularity Tower' },
      a: { uz: "Markaziy shtab-kvartira — to'q dengiz ko'ki va tilla rangdagi monolit osmono'par bino.", en: 'A monolithic dark navy and gold skyscraper serving as the central HQ.' },
      e: { uz: 'Asosiy AI/AGI server infratuzilmasini joylashtiradi.', en: 'Houses the main AI/AGI server infrastructure.' } },
    { ic: 'mosque', n: { uz: 'Cultural Core', en: 'Cultural Core' },
      a: { uz: "Monumental masjid — nurlanuvchi neyron-tarmoq ko'rinishidagi AI muzeyi bilan birlashtirilgan.", en: 'Monumental mosque integrated with a glowing, neural-network AI Museum.' },
      e: { uz: "100% foizsiz islomiy moliya iqtisodiyotining tayanchi.", en: 'Anchors the 100% zero-interest Islamic finance economy.' } },
    { ic: 'book', n: { uz: 'Education Hub', en: 'Education Hub' },
      a: { uz: 'MIT, Harvard va Stanford filial kampuslari.', en: 'Branch campuses for MIT, Harvard, and Stanford.' },
      e: { uz: "Dunyoning eng kuchli muhandislik iste'dodlarini to'g'ridan-to'g'ri Leeder Corp'ga yetkazib beradi.", en: 'Feeds top global engineering talent directly into Leeder Corp.' } },
    { ic: 'home', n: { uz: 'Residential Zones', en: 'Residential Zones' },
      a: { uz: 'Ichki hovlili zamonaviy, minimalist aqlli villalar.', en: 'Modern, minimalist smart-villas designed with internal courtyards.' },
      e: { uz: "100% yashil energiya tarmog'i va avtonom logistika bilan ta'minlanadi.", en: 'Powered by a 100% green energy grid and autonomous logistics.' } }
  ];

  /* Leeder City — bosqichma-bosqich reja. Har bosqich: yillar, nima
     quriladi (GOAL_CITY indekslari), va HOZIR nima qilinishi kerak.
     Sanalar 0→ekspert xaritasining davomi: 2030 gacha ekspert, keyin shahar. */
  window.GOAL_CITY_PHASES = [
    { y: '2026 – 2027', k: 'foundation', build: [],
      t: { uz: 'Poydevor: IELTS 8.0 + Python + birinchi ish', en: 'Foundation: IELTS 8.0 + Python + first job' },
      d: { uz: "Shu platformadagi 140 kun (20-sen → 10-fev). Har kun 4 soat ingliz, 2–4 soat coding. 20-fevral — IELTS, 1-iyun — birinchi ish. Shaharning bironta g'ishti ham hali yo'q — lekin uni quradigan odam shu yerda yasaladi.", en: 'The 144 days on this platform. 4 h English and 2–4 h coding every day. 20 Feb — IELTS, 1 June — first job. Not one brick of the city yet — but the person who builds it is being made here.' } },
    { y: '2027 – 2030', k: 'expert', build: [],
      t: { uz: 'Ekspert: senior AI muhandisi + magistratura', en: 'Expert: senior AI engineer + master\'s' },
      d: { uz: "Ish bilan parallel: Data Science → mid → senior/MLOps. Magistratura (IELTS 8.0 bilan grant). Ochiq manba loyihalar. Kapital: daromadning 30% jamg'arma — foizsiz, halol.", en: 'Alongside work: Data Science → mid → senior/MLOps. Master\'s (scholarship with IELTS 8.0). Open-source projects. Capital: 30% of income saved — interest-free, halal.' } },
    { y: '2030 – 2033', k: 'corp', build: [],
      t: { uz: 'Leeder Corp: kompaniya va birinchi mahsulot', en: 'Leeder Corp: the company and the first product' },
      d: { uz: "AI mahsuloti (agentlar / ta'lim / moliya). 10 → 50 kishilik jamoa. Birinchi daromad. Islomiy moliya modeli kompaniyaning ichida sinovdan o'tadi — keyin shaharga ko'chadi.", en: 'An AI product (agents / education / finance). Team of 10 → 50. First revenue. The Islamic finance model is tested inside the company — then moves to the city.' } },
    { y: '2033 – 2036', k: 'tower', build: [0],
      t: { uz: 'Singularity Tower: yer, loyiha, qurilish', en: 'Singularity Tower: land, design, construction' },
      d: { uz: "Yer maydoni va bosh reja. Tower — shtab-kvartira va AI/AGI server infratuzilmasi. Shu bosqichda MIT/Harvard/Stanford bilan hamkorlik muzokaralari boshlanadi.", en: 'Land and master plan. The Tower — HQ and AI/AGI server infrastructure. Partnership talks with MIT/Harvard/Stanford start in this phase.' } },
    { y: '2036 – 2040', k: 'hub', build: [2, 1],
      t: { uz: 'Education Hub + Cultural Core', en: 'Education Hub + Cultural Core' },
      d: { uz: "Filial kampuslar ochiladi — iste'dod oqimi Leeder Corp'ga. Masjid va AI muzeyi — shaharning ma'naviy va ilmiy markazi. Foizsiz moliya tizimi shahar iqtisodiyotiga aylanadi.", en: 'Branch campuses open — talent flows into Leeder Corp. The mosque and AI Museum — the city\'s spiritual and scientific centre. The zero-interest finance system becomes the city economy.' } },
    { y: '2040 +', k: 'city', build: [3],
      t: { uz: 'Residential Zones: to\'liq shahar', en: 'Residential Zones: the full city' },
      d: { uz: "Aqlli villalar, 100% yashil energiya, avtonom logistika. Leeder City — yashaydigan, o'qiydigan, ibodat qiladigan va quradigan shahar.", en: 'Smart villas, 100% green energy, autonomous logistics. Leeder City — a city that lives, learns, prays and builds.' } }
  ];

  /* Shahar silueti (SVG). Har bino GOAL_CITY tartibida id oladi (b0–b3);
     joriy bosqichga kirgan binolar yoritiladi, qolganlari xira. */
  window.goalCitySVG = function (litSet) {
    var lit = function (i) { return litSet && litSet[i] ? ' lit' : ''; };
    return '<svg class="city-svg" viewBox="0 0 900 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="cySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#16223a"/></linearGradient>' +
      '<linearGradient id="cyGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c96a"/><stop offset="1" stop-color="#c99b2c"/></linearGradient>' +
      '<radialGradient id="cyGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e6b84a" stop-opacity=".55"/><stop offset="1" stop-color="#e6b84a" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="900" height="260" rx="14" fill="url(#cySky)"/>' +
      // yulduzlar
      '<g fill="#e6b84a" opacity=".5"><circle cx="80" cy="30" r="1.2"/><circle cx="200" cy="52" r="1"/><circle cx="330" cy="24" r="1.4"/><circle cx="640" cy="40" r="1.1"/><circle cx="760" cy="26" r="1.3"/><circle cx="850" cy="60" r="1"/></g>' +
      // yer
      '<rect x="0" y="212" width="900" height="48" fill="#0a0f1a"/><rect x="0" y="211" width="900" height="1.5" fill="#e6b84a" opacity=".6"/>' +
      // b2 — Education Hub (chapda: uchta kampus binosi)
      '<g class="cy-b' + lit(2) + '"><rect x="60" y="150" width="70" height="62" rx="3" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><rect x="140" y="132" width="60" height="80" rx="3" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><rect x="210" y="158" width="66" height="54" rx="3" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/>' +
      '<path d="M140 132 L170 112 L200 132Z" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><g class="cy-win" fill="#f0c96a"><rect x="70" y="160" width="8" height="8"/><rect x="86" y="160" width="8" height="8"/><rect x="102" y="160" width="8" height="8"/><rect x="70" y="178" width="8" height="8"/><rect x="86" y="178" width="8" height="8"/><rect x="102" y="178" width="8" height="8"/><rect x="150" y="145" width="8" height="10"/><rect x="166" y="145" width="8" height="10"/><rect x="182" y="145" width="8" height="10"/><rect x="150" y="165" width="8" height="10"/><rect x="166" y="165" width="8" height="10"/><rect x="182" y="165" width="8" height="10"/><rect x="222" y="168" width="8" height="8"/><rect x="238" y="168" width="8" height="8"/><rect x="254" y="168" width="8" height="8"/></g>' +
      '<text x="168" y="232" text-anchor="middle" font-size="10" fill="#9aacc7" font-family="Inter,system-ui" letter-spacing="1.5">EDUCATION HUB</text></g>' +
      // b1 — Cultural Core (masjid + neyron-tarmoq muzeyi)
      '<g class="cy-b' + lit(1) + '"><rect x="300" y="168" width="110" height="44" rx="3" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><path d="M310 168 A45 45 0 0 1 400 168Z" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><path d="M355 118 l0 -14 m-4 6 l4 -4 l4 4" stroke="#e6b84a" stroke-width="1.5" fill="none"/>' +
      '<rect x="288" y="120" width="8" height="92" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><path d="M286 120 l6 -12 l6 12Z" fill="#e6b84a"/><rect x="414" y="120" width="8" height="92" fill="#182339" stroke="#e6b84a" stroke-width="1.2"/><path d="M412 120 l6 -12 l6 12Z" fill="#e6b84a"/>' +
      '<path d="M340 212 A15 15 0 0 1 370 212Z" fill="#0b1220" stroke="#e6b84a" stroke-width="1"/>' +
      // muzey: neyron tarmoq
      '<rect x="430" y="176" width="70" height="36" rx="4" fill="#182339" stroke="#4ec8d8" stroke-width="1.2"/><g class="cy-net" stroke="#4ec8d8" stroke-width=".8" fill="#4ec8d8"><path d="M442 200 L458 186 L474 200 L490 186 M458 186 L474 186 M442 200 L474 200"/><circle cx="442" cy="200" r="2"/><circle cx="458" cy="186" r="2"/><circle cx="474" cy="200" r="2"/><circle cx="490" cy="186" r="2"/><circle cx="474" cy="186" r="2"/></g>' +
      '<text x="395" y="232" text-anchor="middle" font-size="10" fill="#9aacc7" font-family="Inter,system-ui" letter-spacing="1.5">CULTURAL CORE</text></g>' +
      // b0 — Singularity Tower (markaz, eng baland)
      '<g class="cy-b' + lit(0) + '"><ellipse class="cy-halo" cx="580" cy="120" rx="90" ry="90" fill="url(#cyGlow)"/><path d="M548 212 L548 62 L580 40 L612 62 L612 212Z" fill="#0f1a2c" stroke="url(#cyGold)" stroke-width="1.6"/><path d="M580 40 L580 22" stroke="#e6b84a" stroke-width="1.6"/><circle cx="580" cy="20" r="2.5" fill="#f0c96a"/>' +
      '<g class="cy-win" fill="#f0c96a"><rect x="556" y="72" width="6" height="10"/><rect x="568" y="66" width="6" height="10"/><rect x="580" y="62" width="6" height="10"/><rect x="592" y="66" width="6" height="10"/><rect x="556" y="92" width="6" height="10"/><rect x="568" y="92" width="6" height="10"/><rect x="580" y="92" width="6" height="10"/><rect x="592" y="92" width="6" height="10"/><rect x="556" y="112" width="6" height="10"/><rect x="568" y="112" width="6" height="10"/><rect x="580" y="112" width="6" height="10"/><rect x="592" y="112" width="6" height="10"/><rect x="556" y="132" width="6" height="10"/><rect x="568" y="132" width="6" height="10"/><rect x="580" y="132" width="6" height="10"/><rect x="592" y="132" width="6" height="10"/><rect x="556" y="152" width="6" height="10"/><rect x="568" y="152" width="6" height="10"/><rect x="580" y="152" width="6" height="10"/><rect x="592" y="152" width="6" height="10"/><rect x="556" y="172" width="6" height="10"/><rect x="568" y="172" width="6" height="10"/><rect x="580" y="172" width="6" height="10"/><rect x="592" y="172" width="6" height="10"/></g>' +
      '<rect x="548" y="196" width="64" height="3" fill="#e6b84a"/>' +
      '<text x="580" y="232" text-anchor="middle" font-size="10" fill="#f0c96a" font-family="Inter,system-ui" font-weight="700" letter-spacing="1.5">SINGULARITY TOWER</text></g>' +
      // b3 — Residential Zones (villalar + shamol turbinasi + quyosh panellari)
      '<g class="cy-b' + lit(3) + '"><g fill="#182339" stroke="#e6b84a" stroke-width="1.2"><rect x="660" y="180" width="46" height="32" rx="2"/><rect x="716" y="172" width="52" height="40" rx="2"/><rect x="778" y="184" width="44" height="28" rx="2"/></g>' +
      '<g fill="#0b1220" stroke="#e6b84a" stroke-width=".8"><rect x="674" y="192" width="14" height="14"/><rect x="732" y="184" width="16" height="16"/><rect x="790" y="194" width="14" height="12"/></g>' +
      '<g class="cy-win" fill="#f0c96a"><rect x="664" y="185" width="5" height="5"/><rect x="722" y="177" width="5" height="5"/><rect x="782" y="188" width="5" height="5"/></g>' +
      '<g stroke="#7fcf9a" stroke-width="1.4" fill="none"><path d="M850 212 L850 150"/><g class="cy-rotor"><path d="M850 150 L850 122 M850 150 L826 164 M850 150 L874 164"/></g></g>' +
      '<g fill="#4ec8d8" opacity=".9"><rect x="662" y="176" width="14" height="3"/><rect x="678" y="176" width="14" height="3"/><rect x="718" y="168" width="14" height="3"/><rect x="734" y="168" width="14" height="3"/></g>' +
      '<text x="750" y="232" text-anchor="middle" font-size="10" fill="#9aacc7" font-family="Inter,system-ui" letter-spacing="1.5">RESIDENTIAL ZONES</text></g>' +
      '<text x="450" y="252" text-anchor="middle" font-size="9" fill="#66738f" font-family="JetBrains Mono,monospace" letter-spacing="3">LEEDER CITY · 100% GREEN · 0% INTEREST</text>' +
      '</svg>';
  };
(function () {
  'use strict';

  window.PageGoal = function () {
    var key = Store.dateKey();
    var req = Goal.required(key), done = Goal.doneMinutes(key);
    var debt = Goal.debt(), lvl = Goal.debtLevel(debt.days);
    var ms = Goal.milestones();
    var next = Goal.next();
    var pyLeft = Math.max(0, COURSE.length - Store.doneCount());
    var pyDaysLeft = Math.round((new Date('2026-10-15T00:00:00') - new Date(key + 'T00:00:00')) / 86400000);

    var h = '<div class="page stagger">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('goalTag')) + '</div>' +
      '<h1>' + esc(tr('goal')) + '</h1>' +
      '<p class="lede">' + esc(tr('goalLede')) + '</p></header>';

    /* Xarita: 2026 → 2083, 4 bosqich, SEN nuqtasi real progressdan (qarz orqaga suradi) */
    if (window.GoalMap && window.MASTERPLAN) {
      h += '<section class="card gm-card"><div class="gm-head"><h3 class="card-title"><span class="num">' + IC.map + '</span>' + esc(tr('gmT')) + '</h3><span class="hint">' + esc(tr('gmS')) + '</span></div>' +
        '<div class="gm-wrap">' + GoalMap.svg() + '</div>' + GoalMap.index() + GoalMap.legend() + '</section>';
    }

    /* Qarz va roast */
    h += '<div class="goal-debt lvl-' + lvl + '"><div class="gd-n"><b>' + debt.days + '</b><span>' + esc(tr('goalDebtDays')) + '</span></div>' +
      '<div class="gd-body"><h4>' + esc(tr('goalDebtT' + lvl)) + '</h4><p>' + esc(Goal.roast(lvl)) + '</p>' +
      (debt.days ? '<p class="gd-shift">' + esc(tr('goalShifted', { n: debt.days })) + '</p>' : '') +
      '</div></div>';

    /* Bugungi talab */
    h += '<div class="stat-grid" style="margin-bottom:18px">' +
      tile(IC.globe, tr('goalEngToday'), done.eng, req.eng) +
      tile(IC.code, tr('goalCodeToday'), done.code, req.code) +
      '<div class="stat-tile ' + (pyLeft ? 'gold' : '') + '"><div class="st-l">' + IC.rocket + esc(tr('goalPyDeadline')) + '</div><div class="st-v">' + pyLeft + '<small> ' + esc(tr('goalLessonsLeft')) + '</small></div>' +
        '<div class="st-note">' + esc(pyDaysLeft > 0 ? tr('goalPyDays', { d: pyDaysLeft, r: pyLeft ? (pyLeft / pyDaysLeft).toFixed(1) : '0' }) : (pyLeft ? tr('goalPyOverdue', { n: -pyDaysLeft }) : tr('goalPyDone'))) + '</div></div>' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.target + esc(tr('goalNextT')) + '</div><div class="st-v" style="font-size:18px;line-height:1.3">' + esc(next ? L(next.t) : '—') + '</div>' +
        '<div class="st-note">' + esc(next ? EngCal.fmt(next.date) + (next.shift ? ' (+' + next.shift + ')' : '') : '') + '</div></div>' +
      '</div>';

    /* Soat me'yori */
    h += '<div class="callout why"><span class="co-ic">' + IC.clock + '</span><div><h4>' + esc(tr('goalHoursT')) + '</h4>' + esc(tr('goalHours')) + '</div></div>';

    /* Maqsadlar ufqi: kunlik → qisqa → o'rta → uzoq. Xaritadan chiqariladi, qo'lda emas. */
    var in7 = Store.shiftDays(key, 7), in90 = Store.shiftDays(key, 90);
    var openMs = ms.filter(function (m) { return m.status !== 'done'; });
    var shortG = openMs.filter(function (m) { return m.date <= in7; }).slice(0, 3);
    var midG = openMs.filter(function (m) { return m.date > in7 && m.date <= in90; }).slice(0, 3);
    var longG = openMs.filter(function (m) { return m.hard && m.date > in90; }).slice(0, 3);
    var gCard = function (lbl, items, extra) {
      return '<div class="card gh"><div class="gc-l">' + esc(lbl) + '</div>' + (extra || '') +
        (items.length ? '<ul class="wr-check">' + items.map(function (m) { return '<li>' + esc(L(m.t)) + ' <i>' + esc(EngCal.fmt(m.date)) + '</i></li>'; }).join('') + '</ul>' : (extra ? '' : '<p class="hint">—</p>')) + '</div>';
    };
    h += '<div class="gh-grid">' +
      gCard(tr('ghDaily'), [], '<ul class="wr-check"><li>' + esc(tr('ghDailyEng')) + '</li><li>' + esc(tr('ghDailyCode', { h: req.code / 60 })) + '</li><li>' + esc(tr('ghDailyReview')) + '</li></ul>') +
      gCard(tr('ghShort'), shortG) + gCard(tr('ghMid'), midG) +
      gCard(tr('ghLong'), longG, '<ul class="wr-check"><li>' + esc(tr('ghLongCity')) + '</li></ul>') +
      '</div>';

    /* Xarita */
    h += sectionHead(1, tr('goalMapT'), tr('goalMapS'));
    h += '<div class="goal-map">';
    var yearShown = '';
    ms.forEach(function (m) {
      var y = m.date.slice(0, 4);
      if (y !== yearShown) { yearShown = y; h += '<div class="gm-year">' + y + '</div>'; }
      var past = m.date < key && m.status !== 'done';
      h += '<div class="gm-item ' + m.status + (m.hard ? ' hard' : '') + (past ? ' missed' : '') + ' tr-' + m.track + '">' +
        '<span class="gm-dot">' + (m.status === 'done' ? IC.check : '') + '</span>' +
        '<span class="gm-date">' + esc(EngCal.fmt(m.date)) + (m.shift ? '<i>+' + m.shift + ' ' + esc(tr('days')) + '</i>' : '') + '</span>' +
        '<span class="gm-t">' + esc(L(m.t)) + '</span>' +
        '<span class="gm-tr">' + esc(tr('goalTrack_' + m.track)) + '</span></div>';
    });
    h += '</div>';

    /* Nima uchun — sen haqingda */
    h += sectionHead(2, tr('goalWhyT'), '');
    h += '<div class="card"><ul class="wr-check">';
    L(STRINGS[Store.get('lang')].goalWhy ? { uz: STRINGS.uz.goalWhy, en: STRINGS.en.goalWhy } : { uz: [], en: [] }).forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
    h += '</ul></div>';

    /* Master-reja: 4 bosqich, maqsadlar va 1-bosqichning real o'lchovlari */
    if (window.GoalMap && window.MASTERPLAN) { h += sectionHead('★', tr('gmPlanT'), tr('gmPlanS')); h += GoalMap.plan(); }

    /* Leeder City — uzoq muddatli ko'rinish (infratuzilma jadvali) */
    h += sectionHead(3, tr('goalCityT'), tr('goalCityS'));

    /* Joriy bosqich: yil bo'yicha; shu bosqichgacha qurilgan binolar yoritiladi */
    var yr = Number(key.slice(0, 4));
    var curPhase = 0;
    GOAL_CITY_PHASES.forEach(function (p, i) { if (yr >= Number(p.y.slice(0, 4))) curPhase = i; });
    var litSet = {};
    GOAL_CITY_PHASES.forEach(function (p, i) { if (i <= curPhase) p.build.forEach(function (b) { litSet[b] = true; }); });
    /* Shahar previewi: img/city-1.jpg (umumiy ko'rinish) va img/city-2.jpg
       (Singularity Tower + masjid). Rasm topilmasa — SVG silueti qoladi. */
    /* Manba: 1) Store.city (saytdan yuklangan, bulutga sinxron) 2) img/city-N.jpg
       3) hech biri bo'lmasa — yuklash maydoni (rasmni shu yerga tashlash). */
    var shot = function (n, alt, cap) {
      var c = Store.cityGet(n);
      var src = c ? c.img : 'img/city-' + n + '.jpg?v=1';
      return '<figure class="city-shot' + (n === 1 ? ' main' : '') + '" data-cityslot="' + n + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(alt) + '" data-cityimg="' + n + '"' + (c ? ' data-stored="1"' : '') + '>' +
        '<figcaption>' + esc(cap) + '</figcaption>' +
        '<label class="city-drop" hidden>' + IC.upload + '<span>' + esc(tr('goalCityDrop', { n: n })) + '</span><input type="file" accept="image/*" data-cityfile="' + n + '" hidden></label>' +
        (c ? '<button class="city-x" data-cityclear="' + n + '" title="' + esc(tr('delete')) + '">' + IC.close + '</button>' : '') +
        '</figure>';
    };
    h += '<div class="city-gallery">' + shot(1, 'Leeder City', tr('goalCityCap1')) + shot(2, 'Singularity Tower', tr('goalCityCap2')) + '</div>';
    h += '<div class="city-hero">' + goalCitySVG(litSet) + '</div>';

    /* Bosqichma-bosqich reja */
    h += '<div class="city-phases">';
    GOAL_CITY_PHASES.forEach(function (p, i) {
      var st = i < curPhase ? 'done' : i === curPhase ? 'now' : '';
      h += '<div class="cp-phase ' + st + '"><div class="cp-y"><span class="cp-n">' + (i + 1) + '</span>' + esc(p.y) + (st === 'now' ? '<i>' + esc(tr('goalPhaseNow')) + '</i>' : '') + '</div>' +
        '<b>' + esc(L(p.t)) + '</b><p>' + esc(L(p.d)) + '</p>' +
        (p.build.length ? '<div class="cp-build">' + p.build.map(function (b) { return '<span>' + (IC[GOAL_CITY[b].ic] || IC.spark) + esc(L(GOAL_CITY[b].n)) + '</span>'; }).join('') + '</div>' : '') +
        '</div>';
    });
    h += '</div>';

    h += '<div class="card city-card"><div class="gc-table-wrap"><table class="gc-table city-table"><thead><tr>' +
      '<th>' + esc(tr('goalCityH1')) + '</th><th>' + esc(tr('goalCityH2')) + '</th><th>' + esc(tr('goalCityH3')) + '</th></tr></thead><tbody>';
    GOAL_CITY.forEach(function (r) {
      h += '<tr><td class="k"><span class="city-ic">' + (IC[r.ic] || IC.spark) + '</span>' + esc(L(r.n)) + '</td>' +
        '<td>' + esc(L(r.a)) + '</td><td>' + esc(L(r.e)) + '</td></tr>';
    });
    h += '</tbody></table></div></div>';

    /* Qarz kunlari ro'yxati */
    if (debt.days) {
      h += sectionHead(4, tr('goalDebtList'), tr('goalDebtListS'));
      h += '<div class="bk-grid">';
      debt.list.slice(-30).forEach(function (d) {
        h += '<button class="bk-unit" data-go="habit/' + esc(d) + '"><span class="bu-n">' + esc(EngCal.fmt(d)) + '</span><span class="bu-t">' + esc(tr('goalFixDay')) + '</span></button>';
      });
      h += '</div>';
    }

    /* Bildirishnoma */
    h += sectionHead(5, tr('notifT'), tr('notifS'));
    var on = Store.setting('notify');
    h += '<div class="card"><div class="switch-row"><div><div class="sw-t">' + esc(tr('notifOn')) + '</div><div class="sw-d">' + esc(Notify.can() ? (Notify.granted() ? tr('notifGranted') : tr('notifAsk')) : tr('notifUnsupported')) + '</div></div>' +
      '<button class="switch' + (on ? ' on' : '') + '" data-setting="notify" role="switch" aria-checked="' + !!on + '"></button></div>' +
      '<div class="sync-actions"><button class="btn btn-ghost btn-sm" id="notifTest">' + IC.alert + esc(tr('notifTest')) + '</button></div></div>';

    h += '<div class="lesson-nav no-print"><button class="btn btn-ghost" data-go="course">' + IC.arrowL + esc(tr('courses')) + '</button><button class="btn btn-primary" data-go="habit">' + IC.mosque + esc(tr('habit')) + IC.arrowR + '</button></div>';
    return h + '</div>';
  };

  function tile(icon, label, done, req) {
    var pct = req ? Math.min(100, Math.round(done / req * 100)) : 100;
    return '<div class="stat-tile ' + (req && done >= req ? 'gold' : '') + '"><div class="st-l">' + icon + esc(label) + '</div>' +
      '<div class="st-v">' + Math.round(done / 60 * 10) / 10 + '<small> / ' + (req / 60) + ' ' + esc(tr('hoursShort')) + '</small></div>' +
      '<div class="bar" style="margin-top:9px"><i style="width:' + pct + '%"></i></div>' +
      '<div class="st-note">' + esc(req ? (done >= req ? tr('goalMet') : tr('goalLeft', { m: req - done })) : tr('engRestDay')) + '</div></div>';
  }

  window.PageGoal.mount = function () {
    /* Rasm yo'q bo'lsa — o'sha kartani yashiramiz (SVG silueti baribir turadi) */
    $$('[data-cityimg]').forEach(function (img) {
      var fig = img.closest('.city-shot');
      /* Rasm yo'q — o'rniga yuklash maydoni (rasmni tashlash / tanlash) */
      var drop = function () { img.hidden = true; fig.classList.add('empty'); var l = fig.querySelector('.city-drop'); if (l) l.hidden = false; };
      img.addEventListener('error', drop);
      if (img.complete && img.naturalWidth === 0) drop();
      img.addEventListener('click', function () {
        if (window.Certificate) Certificate.openImage({ name: img.alt, img: img.src });
      });
    });

    /* Rasmni saqlash: ≤1400px, JPEG .8 — bulut chegarasi (1 MB) uchun */
    function saveCity(n, file) {
      if (!file || !/^image\//.test(file.type)) return;
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1400 / Math.max(im.width, im.height));
        var c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        var data = c.toDataURL('image/jpeg', 0.8);
        if (JSON.stringify(Store.all()).length + data.length > 900 * 1024) { toast(tr('profTooBig'), 'warn'); return; }
        Store.citySet(n, data); toast(tr('saved'), 'ok'); App.render();
      };
      im.onerror = function () { URL.revokeObjectURL(url); toast(tr('profImgErr'), 'warn'); };
      im.src = url;
    }
    $$('[data-cityfile]').forEach(function (inp) {
      inp.addEventListener('change', function () { saveCity(Number(inp.dataset.cityfile), inp.files[0]); });
    });
    $$('[data-cityslot]').forEach(function (fig) {
      fig.addEventListener('dragover', function (e) { e.preventDefault(); fig.classList.add('over'); });
      fig.addEventListener('dragleave', function () { fig.classList.remove('over'); });
      fig.addEventListener('drop', function (e) { e.preventDefault(); fig.classList.remove('over'); saveCity(Number(fig.dataset.cityslot), e.dataTransfer.files[0]); });
    });
    $$('[data-cityclear]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); Store.citySet(Number(b.dataset.cityclear), null); App.render(); });
    });
    var t = $('#notifTest');
    if (t) t.addEventListener('click', function () {
      Notify.request().then(function () {
        if (!Notify.test()) toast(tr('notifDenied'), 'warn');
      });
    });
  };

  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div><h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }
})();
