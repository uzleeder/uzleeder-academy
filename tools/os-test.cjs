/* ==========================================================================
   tools/os-test.cjs — Personal OS: kalendar, navigatsiya, ko'chirish, zaxira
   --------------------------------------------------------------------------
   Brauzersiz: fayllar vm ichida bajariladi, `window` o'rniga sandbox.
   Haqiqiy manbalar tekshiriladi — nusxa yoki maket emas.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;

function ok(cond, name) {
  if (cond) { pass++; console.log('ok   ' + name); }
  else { fail++; console.log('FAIL ' + name); }
}
function eq(got, want, name) {
  ok(got === want, name + (got === want ? '' : '  (got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want) + ')'));
}
function head(t) { console.log(''); console.log(t); console.log('-'.repeat(t.length)); }

/* ---------- OS modullarini yuklash ------------------------------------ */
function loadOS(files) {
  const sandbox = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, isNaN, parseFloat, parseInt };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  files.forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInContext(src, sandbox, { filename: f });
  });
  return sandbox.OS;
}

const OS = loadOS(['js/os/config.js', 'js/os/nav.js', 'js/os/migrate.js', 'js/os/backup.js']);

/* ====================== 1. MARKAZIY KALENDAR ========================== */
head('Markaziy kalendar (js/os/config.js) — yagona manba');

const C = OS.CFG, cal = OS.cal;

eq(C.mission.start, '2026-11-26', 'missiya boshlanishi 26-noyabr 2026');
eq(C.mission.end, '2027-02-19', 'missiya tugashi 19-fevral 2027');
eq(C.mission.exam, '2027-02-20', 'IELTS imtihoni 20-fevral 2027');
eq(C.target.overall, 7.5, 'maqsad overall 7.5');
eq(C.target.guarantee, false, 'ball KAFOLATLANMAYDI');

eq(C.mission.phases.length, 3, 'uch bosqich');
eq(C.mission.phases[0].from + '→' + C.mission.phases[0].to, '2026-11-26→2026-11-30', 'pre-launch 26–30 noyabr');
eq(C.mission.phases[1].from + '→' + C.mission.phases[1].to, '2026-12-01→2027-01-31', 'asosiy ijro 1 dek — 31 yan');
eq(C.mission.phases[2].from + '→' + C.mission.phases[2].to, '2027-02-01→2027-02-19', 'yakuniy 1–19 fevral');

/* Bosqichlar uzluksiz va ustma-ust tushmaydi */
let gapOk = true;
for (let i = 1; i < C.mission.phases.length; i++) {
  const prevEnd = C.mission.phases[i - 1].to;
  const thisFrom = C.mission.phases[i].from;
  if (cal.addDays(prevEnd, 1) !== thisFrom) gapOk = false;
}
ok(gapOk, 'bosqichlar orasida bo\'shliq va ustma-ustlik yo\'q');

eq(cal.totalDays(), 86, 'missiya 86 kun (26 noy → 19 fev)');
eq(cal.dayNumber('2026-11-26'), 1, 'birinchi kun = 1');
eq(cal.dayNumber('2027-02-19'), 86, 'oxirgi kun = 86');
eq(cal.dayNumber('2026-11-25'), -1, 'missiyadan oldingi kun oraliqda emas');
eq(cal.daysToExam('2026-11-26'), 86, 'imtihongacha 86 kun');
eq(cal.phaseOf('2026-12-15').key, 'main', '15-dekabr asosiy ijroda');
eq(cal.phaseOf('2027-02-10').key, 'final', '10-fevral yakuniy bosqichda');
eq(cal.phaseOf('2027-02-20'), null, 'imtihon kuni bosqichdan tashqarida');
eq(cal.inMission('2027-02-19'), true, 'oxirgi kun missiya ichida');
eq(cal.inMission('2027-02-20'), false, 'imtihon kuni missiya oynasidan tashqarida');

/* Yakuniy bosqich aynan 19 kun (brief: "final 19-day phase") */
eq(cal.diffDays('2027-02-01', '2027-02-19') + 1, 19, 'yakuniy bosqich 19 kun');

/* Hafta dushanbadan boshlanadi */
eq(cal.weekStart('2026-12-03'), '2026-11-30', 'hafta dushanbadan');
eq(cal.weekDays('2026-12-03').length, 7, 'haftada 7 kun');

/* Sanalar BOSHQA fayllarda qattiq yozilmaganini eslatish: config yagona
   manba bo'lgani uchun bu yerda faqat bitta nusxa bor.                  */
eq(Object.keys(C.target.skills).length, 4, 'to\'rt ko\'nikma maqsadi sozlanadi');
ok(C.target.editable === true, 'ko\'nikma maqsadlari tahrirlanadi');

/* Pre-launch vazifalari brief ro'yxatiga mos */
eq(C.prelaunch.length, 9, 'pre-launch: 9 vazifa');
ok(C.prelaunch.some(t => t.ev === 'mock'), 'pre-launch ichida Cambridge mock bor');
ok(C.prelaunch.some(t => t.id === 'pl-errors'), 'pre-launch ichida xatolar daftarini tayyorlash bor');
eq(C.finalFocus.length, 8, 'yakuniy bosqich: 8 yo\'nalish');
ok(C.finalFocus.some(f => f.id === 'f-rest'), 'yakuniy bosqichda dam va uyqu bor');

/* ====================== 2. NAVIGATSIYA ================================ */
head('Axborot arxitekturasi (js/os/nav.js) — 8 manzil, eski yo\'llar tirik');

eq(OS.NAV.DEST.length, 8, 'sakkizta manzil');
eq(OS.NAV.DEST.map(d => d.key).join(','), 'center,planner,studio,lab,library,insights,portfolio,vault', 'manzillar tartibi');

/* Brief 5-bo'limidagi birlashtirishlar */
const R = OS.NAV.REDIRECT;
[['today', 'planner'], ['week', 'planner'], ['habit', 'planner'],
 ['roadmap', 'planner'], ['goal', 'planner'], ['plan', 'planner'],
 ['python', 'studio'], ['datacamp', 'studio'], ['jobready', 'studio'],
 ['english', 'studio'], ['speaking', 'studio'], ['writing', 'studio'],
 ['practice', 'lab'], ['flash', 'lab'], ['cheatsheet', 'lab'], ['review', 'lab'],
 ['books', 'library'], ['movies', 'library'], ['notes', 'library'], ['saved', 'library'],
 ['weekly', 'insights'], ['monthly', 'insights'], ['analytics', 'insights'],
 ['projects', 'portfolio'], ['career', 'portfolio'],
 ['settings', 'vault'], ['profile', 'vault'], ['dashboard', 'center']
].forEach(([from, to]) => {
  ok((R[from] || '').indexOf(to) === 0, 'birlashdi: ' + from + ' → ' + to);
});

/* Dua asosiy menyudan olib tashlandi, lekin yo'qolmadi */
ok(!OS.NAV.DEST.some(d => d.key === 'dua'), 'dua asosiy navigatsiyada emas');
eq(R['dua'], 'planner/routines', 'dua ixtiyoriy odat sifatida rejada');

/* Chuqur marshrutlar yo'naltirilmaydi — ular haqiqiy dars sahifalari */
['lesson/7', 'english/12', 'books/v3', 'mission/day', 'pyai/m1', 'copy/vocab',
 'habit/2026-12-01', 'week/2026-12-07', 'review/mistakes', 'flash/etch',
 'cheatsheet/grammar', 'datacamp/2', 'quick/3', 'writing/2', 'bbc/6min'
].forEach(r => {
  eq(OS.NAV.redirectFor(r), null, 'o\'z joyida qoladi: ' + r);
});

/* Hech bir yo'naltirish o'zini ko'rsatmaydi (tsikl bo'lmaydi) */
let cycle = false;
Object.keys(R).forEach(k => { if (R[k] === k) cycle = true; });
ok(!cycle, 'yo\'naltirishda tsikl yo\'q');

/* Har bir yo'naltirish manzili haqiqiy manzilga olib boradi */
let badTarget = [];
Object.keys(R).forEach(k => {
  const headKey = R[k].split('/')[0];
  if (!OS.NAV.ROUTE_KEYS.includes(headKey)) badTarget.push(k + ' → ' + R[k]);
});
ok(badTarget.length === 0, 'har bir yo\'naltirish mavjud manzilga boradi' + (badTarget.length ? ': ' + badTarget.join(', ') : ''));

/* Qaytish havolasi: bare nom ham, ichki yo'l ham */
eq((OS.NAV.crumbFor('english') || {}).route, 'studio/ielts', 'crumb: english → IELTS Studio');
eq((OS.NAV.crumbFor('english/12') || {}).route, 'studio/ielts', 'crumb: english/12 → IELTS Studio');
eq((OS.NAV.crumbFor('lesson/3') || {}).route, 'studio/coding', 'crumb: lesson/3 → Coding Studio');
eq((OS.NAV.crumbFor('books/v3') || {}).route, 'library/books', 'crumb: books/v3 → Kutubxona');
eq(OS.NAV.activeKey('lesson/3'), 'studio', 'yon menyu: dars ochiq bo\'lsa Studiya yonadi');
eq(OS.NAV.activeKey('planner/week'), 'planner', 'yon menyu: reja ichidagi tab');

/* Har manzilning sahifa moduli bor va index.html ga ulangan */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
OS.NAV.DEST.forEach(d => {
  const rel = 'js/os/pages/' + d.key + '.js';
  ok(fs.existsSync(path.join(ROOT, rel)), 'sahifa moduli bor: ' + rel);
  ok(indexHtml.indexOf(rel) >= 0, 'index.html ga ulangan: ' + rel);
});
['js/os/config.js', 'js/os/nav.js', 'js/os/shell.js', 'js/os/data.js',
 'js/os/tasks.js', 'js/os/db.js', 'js/os/migrate.js', 'js/os/backup.js',
 'css/os.css'].forEach(f => {
  ok(indexHtml.indexOf(f) >= 0, 'index.html ga ulangan: ' + f);
});

/* Sanalar BOSHQA modullarda qayta yozilmaganini tekshiramiz: yangi
   kalendar qiymatlari faqat config.js da bo'lishi kerak.            */
const otherDates = ['js/mission.js', 'js/habit.js', 'js/app.js', 'js/store.js']
  .filter(f => /2026-11-26|2027-02-19/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
ok(otherDates.length === 0, 'yangi kalendar sanalari faqat config.js da' +
  (otherDates.length ? ' (topildi: ' + otherDates.join(', ') + ')' : ''));

/* Oflayn: SW versiyali resurslarni keshlaydi, /api/ ga tegmaydi.
   Demak yangi js/os/*.js va css/os.css avtomatik oflayn ishlaydi,
   sinxron o'chiq bo'lgani uchun esa tarmoq umuman kerak emas.      */
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
ok(/url\.pathname\.indexOf\('\/api\/'\) === 0\) return/.test(sw), 'oflayn: /api/ keshlanmaydi (faqat tarmoq)');
ok(/url\.search\.indexOf\('v='\) >= 0/.test(sw), 'oflayn: ?v= li resurslar keshlanadi');
const osRefs = (indexHtml.match(/js\/os\/[\w\/.-]+\.js\?v=/g) || []).length;
eq(osRefs, 16, 'oflayn: 16 ta OS fayli versiya belgisi bilan ulangan (demak keshlanadi)');
ok(/css\/os\.css\?v=/.test(indexHtml), 'oflayn: css/os.css versiya belgisi bilan ulangan');

/* Build oq ro'yxati OS fayllarini olib chiqadi (js/ va css/ to'liq) */
const build = fs.readFileSync(path.join(ROOT, 'build/site.cjs'), 'utf8');
ok(/'css'/.test(build) && /'js'/.test(build), 'build: css/ va js/ dist ga chiqadi (OS fayllari ham)');
ok(!/'api'|'netlify'|'server'|'tools'/.test(build), 'build: backend va vositalar dist ga CHIQMAYDI');

/* ====================== 3. KO'CHIRISH ================================= */
head('localStorage → IndexedDB ko\'chirish (js/os/migrate.js)');

const STATE = {
  v: 10, lang: 'uz', theme: 'os', name: 'Leejon',
  best: { '1': 9, '2': 7 }, scores: { '1': 9, '2': 7 },
  eng: { done: { '3': true, '4': true }, tasks: { '3:0': true }, scores: { '28': { l: 6.5, r: 7, w: 6, s: 6.5, at: 111 } }, notes: { '3': { text: 'eng note', at: 5 } } },
  habit: { '2026-12-01': { 'h-eng': true, 'h-code': true } },
  blockLog: { '2026-12-01|h-eng': { st: 'done', note: '', at: 7 } },
  sessions: { '2026-12-01': { min: 95 } },
  hours: { '2026-12-01': { eng: 60, code: 30 } },
  quiz: { 'eng:3': { score: 8, best: 9, total: 10, at: 9, n: 2 } },
  review: { 'vocab:w1': { kind: 'vocab', ref: 'w1', due: '2026-12-05', reps: 2, ivl: 1, at: 3 } },
  mistakes: [{ id: '3:1', day: 3, qi: 1, q: 'Question?', chosen: 'wrong', correct: 'right', times: 2, fixed: false, at: 42 }],
  osMistakeMeta: { '3:1': { why: 'rushed', cat: 'grammar' } },
  notes: { '3': { text: 'py note', at: 6 } },
  copy: { vocab: { w1: { id: 'w1', word: 'arid', at: 1 } }, english: {}, coding: {}, free: { f1: { id: 'f1', title: 'idea', at: 2 } } },
  bookmarks: { b1: { route: 'english/3', title: 'Day 3', at: 4 } },
  profile: { bio: 'bio', title: 'learner', certs: { c1: { id: 'c1', name: 'cert', at: 8 } }, projects: { p1: { id: 'p1', name: 'proj', at: 9 } }, at: 10 },
  events: [{ id: 'e1', at: 1, type: 'quiz', ref: 'x', title: 'T' }, { id: 'e2', at: 2, type: 'review', ref: 'y', title: 'U' }],
  osTasks: { t1: { id: 't1', date: '2026-12-01', title: 'Read', status: 'done', cat: 'ielts', at: 11, up: 11 } },
  read: { r5: { wpm: 210, score: 8, at: 12 } },
  speak: { '2': { at: 13, text: 'spoke' } },
  settings: { gate: false, cloudSync: false }
};

const built = OS.migrate.plan(STATE);
const check = OS.migrate.verify(STATE, built);

ok(check.ok, 'tekshiruv o\'tdi' + (check.ok ? '' : ': ' + check.problems.join(' | ')));

eq(built.tasks.length, 1, 'vazifalar ko\'chdi');
eq(built.mistakes.length, 1, 'xatolar ko\'chdi');
eq(built.reviewQueue.length, 1, 'takror navbati ko\'chdi');
eq(built.quizAttempts.length, 1, 'test urinishlari ko\'chdi');
eq(built.mockExams.length, 1, 'mock natijasi ko\'chdi');
eq(built.activityEvents.length, 2, 'faollik hodisalari ko\'chdi');
eq(built.lessonProgress.length, 5, 'dars progressi: 2 python + 2 ingliz kuni + 1 vazifa');
eq(built.scheduleBlocks.length, 2, 'jadval bloklari: natija + belgi (dublikatsiz)');
eq(built.studySessions.length, 3, 'o\'quv vaqti: 1 o\'lchangan + 2 qo\'lda');
eq(built.notes.length, 3, 'eslatmalar: python + ingliz + erkin daftar');
eq(built.projects.length, 2, 'portfel: loyiha + sertifikat');

/* id va vaqt belgilari asl holida */
const m = built.mistakes[0];
eq(m.id, '3:1', 'xato id saqlandi');
eq(m.at, 42, 'xato vaqt belgisi saqlandi');
eq(m.mine, 'wrong', 'ustun 2: mening javobim');
eq(m.correct, 'right', 'ustun 3: to\'g\'ri javob');
eq(m.question, 'Question?', 'ustun 1: savol matni');
eq(m.why, 'rushed', 'ustun 4: nega xato qildim');
eq(built.reviewQueue[0].due, '2026-12-05', 'takror muddati saqlandi');
eq(built.lessonProgress.find(r => r.id === 'python:1').best, 9, 'dars ballari saqlandi');
eq(built.mockExams[0].listening, 6.5, 'mock Listening bandi saqlandi');
eq(built.tasks[0].at, 11, 'vazifa vaqt belgisi saqlandi');

/* Buzilgan hisob topiladi: bitta yozuv yo'qotib ko'ramiz */
const broken = JSON.parse(JSON.stringify(built));
broken.mistakes = [];
ok(!OS.migrate.verify(STATE, broken).ok, 'yo\'qolgan yozuv TOPILADI (tekshiruv jim o\'tmaydi)');

const dupd = JSON.parse(JSON.stringify(built));
dupd.tasks.push(dupd.tasks[0]);
ok(!OS.migrate.verify(STATE, dupd).ok, 'takroriy id TOPILADI');

/* Bo'sh holat ham ishlaydi */
const emptyBuilt = OS.migrate.plan({});
ok(OS.migrate.verify({}, emptyBuilt).ok, 'bo\'sh holat ham toza ko\'chadi');

/* ====================== 4. ZAXIRA VA QAYTARISH ======================== */
head('Zaxira: JSON, ZIP, import (js/os/backup.js)');

const doc = OS.backup.buildJSON(STATE);
eq(doc.format, 'uzleeder-personal-os', 'format belgisi bor');
ok(!!doc.exportedAt, 'eksport vaqti bor');
eq(doc.schema, 10, 'sxema versiyasi yozilgan');
ok(!!doc.checksum, 'nazorat yig\'indisi (CRC32) bor');
eq(doc.mission.exam, '2027-02-20', 'zaxirada missiya sanalari bor');
eq(doc.records.mistakes, 1, 'yozuvlar soni hisoblangan');

/* Sirlar hech qachon chiqmaydi */
const withSecrets = Object.assign({}, STATE, {
  password: 'hunter2', settings: { sessionToken: 'abc', gate: false },
  auth: { hash: 'x' }
});
const cleaned = OS.backup.stripSecrets(withSecrets);
ok(!('password' in cleaned), 'eksportda parol YO\'Q');
ok(!('auth' in cleaned), 'eksportda auth YO\'Q');
ok(!('sessionToken' in (cleaned.settings || {})), 'eksportda sessiya tokeni YO\'Q');
eq(cleaned.settings.gate, false, 'sir bo\'lmagan sozlama qoladi');
ok(OS.backup.findSecrets(withSecrets).length >= 3, 'import oldidan sir maydonlari topiladi');

/* CRC32 — ma'lum qiymat bilan tekshiriladi */
eq(OS.backup.crc32(OS.backup.utf8('123456789')).toString(16), 'cbf43926', 'CRC32 standart qiymatga mos');

/* ZIP: haqiqiy arxiv tuzilishi */
const zipBytes = OS.backup.zip([
  { name: 'data.json', data: '{"a":1}' },
  { name: 'manifest.json', data: '{"files":[]}' }
]);
const sig = Array.from(zipBytes.slice(0, 4));
eq(sig.join(','), '80,75,3,4', 'ZIP local header imzosi (PK\\x03\\x04)');
const tail = Array.from(zipBytes.slice(zipBytes.length - 22, zipBytes.length - 18));
eq(tail.join(','), '80,75,5,6', 'ZIP end-of-central-directory imzosi');
const dv = new DataView(zipBytes.buffer, zipBytes.length - 22, 22);
eq(dv.getUint16(8, true), 2, 'ZIP ichida 2 ta yozuv');

/* Import: birlashtirish hech narsani yo'qotmaydi */
const mine = {
  best: { '1': 9 }, eng: { done: { '3': true }, tasks: {}, scores: {}, notes: {} },
  mistakes: [{ id: '3:1', fixed: true, at: 10, times: 1 }],
  review: {}, quiz: {}, notes: {}, bookmarks: {}, osTasks: {}, blockLog: {},
  done: {}, habit: {}, events: [], sessions: {}
};
const theirs = {
  best: { '1': 7, '2': 8 }, eng: { done: { '4': true }, tasks: {}, scores: {}, notes: {} },
  mistakes: [{ id: '3:1', fixed: false, at: 20, times: 3 }, { id: '4:2', fixed: false, at: 21 }],
  review: {}, quiz: {}, notes: {}, bookmarks: {}, osTasks: {}, blockLog: {},
  done: {}, habit: {}, events: [], sessions: {}
};
const merged = OS.backup.mergeStates(mine, theirs);
eq(merged.best['1'], 9, 'birlashma: yuqori ball saqlanadi');
eq(merged.best['2'], 8, 'birlashma: yangi ball qo\'shiladi');
ok(merged.eng.done['3'] && merged.eng.done['4'], 'birlashma: ikkala kun ham bajarilgan');
eq(merged.mistakes.length, 2, 'birlashma: xatolar id bo\'yicha');
eq(merged.mistakes.find(x => x.id === '3:1').fixed, true, 'birlashma: tuzatilgan xato QAYTA ochilmaydi');
eq(merged.mistakes.find(x => x.id === '3:1').times, 3, 'birlashma: takror soni maksimum');

/* Dublikat va to'qnashuv hisoboti */
const dup = OS.backup.duplicates(mine, theirs);
eq(dup.mistakes, 1, 'dublikat topildi');
const conf = OS.backup.conflictList(mine, theirs);
ok(conf.some(c => c.kind === 'lessonScore' && c.id === '1'), 'to\'qnashuv hisobotga tushdi');

/* ====================== XULOSA ======================================== */
console.log('');
console.log(fail ? 'FAIL — ' + fail + ' ta xato, ' + pass + ' ta ok' : 'ALL OK — ' + pass + ' ta tekshiruv');
process.exit(fail ? 1 : 0);
