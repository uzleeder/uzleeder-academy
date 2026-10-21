/* ==========================================================================
   tools/schedule-migration-test.cjs
   Jadval migratsiyasi (v1 → v2) testi.
   --------------------------------------------------------------------------
   Har stsenariy ALOHIDA node jarayonida ishlaydi: store.js bir marta
   yuklanadigan IIFE, shuning uchun bitta jarayonda qayta yuklab bo'lmaydi.

   Ishga tushirish:  node tools/schedule-migration-test.cjs
   ========================================================================== */
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');

/* --- bola jarayon rejimi: bitta stsenariyni bajarib, JSON qaytaradi --- */
if (process.argv[2] === '--run') {
  const LS = {};
  const input = JSON.parse(process.argv[3]);
  if (input !== null) LS['uzla.state'] = JSON.stringify(input);
  global.localStorage = {
    getItem: (k) => (k in LS ? LS[k] : null),
    setItem: (k, v) => { LS[k] = String(v); },
    removeItem: (k) => { delete LS[k]; }
  };
  global.window = {};
  global.document = { addEventListener() {}, documentElement: {} };
  require(path.join(ROOT, 'js/store.js'));
  const S = global.window.Store;
  if (S.init) S.init();
  process.stdout.write(JSON.stringify(S.all()));
  process.exit(0);
}

/* --- ota jarayon: stsenariylarni ishga tushirib, tekshiradi --- */
function run(state) {
  const out = execFileSync(process.execPath,
    [__filename, '--run', JSON.stringify(state === undefined ? null : state)],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  return JSON.parse(out);
}

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('ok   ' + m); } else { fail++; console.log('FAIL ' + m); } };

console.log('Jadval migratsiyasi v1 → v2');
console.log('');

/* 1. To'liq bajarilgan og'ir kun → barcha yangi bloklar yopiladi */
let s = run({ v: 8, habit: { '2026-09-21': {
  'h-fajr': true, 'h-l1': true, 'h-l2': true, 'h-py': true, 'h-dc': true,
  'h-l3': true, 'h-l4': true, 'h-l5': true, 'h-l6': true,
  'h-hw2': true, 'h-book': true, 'h-log': true } } });
let d = s.habit['2026-09-21'];
ok(d['h-eng-am'] === true,  "to'liq kun: h-l1+h-l2 → h-eng-am");
ok(d['h-code'] === true,    "to'liq kun: h-py+h-dc → h-code");
ok(d['h-eng-mid'] === true, "to'liq kun: h-l3+h-l4 → h-eng-mid");
ok(d['h-eng-pm'] === true,  "to'liq kun: h-l5+h-l6 → h-eng-pm");
ok(d['h-close'] === true,   "to'liq kun: h-hw2+h-book+h-log → h-close");
ok(d['h-fajr'] === true,    'namoz bloki tegilmadi');
ok(!d['h-l1'],              "eski id habit dan olib tashlandi");
ok(s.habitLegacy['2026-09-21']['h-l1'] === true, 'eski id habitLegacy ga ko\'chdi');
ok(s.scheduleVersion === 2, 'scheduleVersion = 2');
ok(s.scheduleMigration && s.scheduleMigration.moved === 5, 'migratsiya hisoboti: 5 blok ko\'chdi');

/* 2. QISMAN bajarilgan → yangi blok belgilanMAYDI (yolg'on "bajarildi" yo'q) */
s = run({ v: 8, habit: { '2026-09-23': { 'h-l1': true } } });
d = s.habit['2026-09-23'] || {};
ok(!d['h-eng-am'], "qisman: yolg'iz h-l1 → h-eng-am YOPILMADI");
ok(s.habitLegacy['2026-09-23']['h-l1'] === true, 'qisman: eski yozuv tarixda');
ok(s.scheduleMigration.partial === 1, 'migratsiya hisoboti: 1 qisman');

/* 3. Yangi jadvalda o'rni yo'q blok (c-l3 — LC bilan takror) */
s = run({ v: 8, habit: { '2026-09-22': { 'c-l3': true, 'c-l1': true, 'c-l2': true } } });
d = s.habit['2026-09-22'] || {};
ok(!d['c-l3'], "c-l3 yangi jadvalda yo'q");
ok(d['c-eng'] === true, 'c-l1+c-l2 → c-eng');
ok(s.habitLegacy['2026-09-22']['c-l3'] === true, 'c-l3 tarixda saqlandi');

/* 4. Yakshanba: shartli juftlik */
s = run({ v: 8, habit: { '2026-09-20': { 'r-test': true, 'r-dc': true, 'r-book': true, 'r-board': true } } });
d = s.habit['2026-09-20'];
ok(d['r-test'] === true,     'r-test o\'zgarmadi');
ok(d['r-focus-dc'] === true, 'r-dc → r-focus-dc (dcOnly variant)');
ok(d['r-close'] === true,    'r-book+r-board → r-close');

/* 5. Idempotent — migratsiya ikkinchi marta ishlamaydi */
const once = run({ v: 8, habit: { '2026-09-21': { 'h-l1': true, 'h-l2': true } } });
const twice = run(once);
ok(JSON.stringify(twice.habit) === JSON.stringify(once.habit), 'idempotent: habit o\'zgarmadi');
ok(twice.scheduleMigration.at === once.scheduleMigration.at, 'idempotent: qayta ishlamadi');

/* 6. Yangi foydalanuvchi */
s = run(undefined);
ok(s.scheduleVersion === 2, 'yangi foydalanuvchi: scheduleVersion = 2');
ok(Object.keys(s.habit).length === 0, 'yangi foydalanuvchi: habit bo\'sh');

/* 7. Boshqa progress tegilmaydi */
s = run({ v: 8, best: { '1': 9, '2': 8 }, eng: { done: { '5': true }, tasks: { '5:0': true }, scores: {}, notes: {} },
  habit: { '2026-09-21': { 'h-l1': true, 'h-l2': true } },
  mistakes: [{ id: 'm1', cat: 'python' }], review: { r1: { kind: 'vocab' } },
  quiz: { 'eng:5': { score: 8 } }, read: { r1: { wpm: 200 } } });
ok(Object.keys(s.best).length === 2, 'Python ballari saqlandi');
ok(s.eng.done['5'] === true, 'ingliz tili kuni saqlandi');
ok(s.eng.tasks['5:0'] === true, 'ingliz tili vazifasi saqlandi');
ok(s.mistakes.length === 1, 'xatolar saqlandi');
ok(Object.keys(s.review).length === 1, 'takror navbati saqlandi');
ok(s.quiz['eng:5'] && s.quiz['eng:5'].score === 8, 'test natijasi saqlandi');
ok(s.read.r1 && s.read.r1.wpm === 200, "o'qish natijasi saqlandi");

console.log('');
console.log(fail ? ('FAIL — ' + fail + ' ta xato, ' + pass + ' ta ok') : ('ALL OK — ' + pass + ' ta tekshiruv'));
process.exit(fail ? 1 : 0);
