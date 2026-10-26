/* ==========================================================================
   tools/validator-negative-test.cjs
   Validator HAQIQIY muammolarni topa oladimi?
   Har testda jadvalga ataylab bitta nuqson kiritiladi va validator uni
   topishi SHART. Ataylab qilingan istisnolar (shortOk, longOk, gibrid
   pmHardMax) esa xato sifatida BELGILANMASLIGI kerak.

       node tools/validator-negative-test.cjs
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs'), vm = require('vm');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const prayerSrc = read('js/prayer.js');
const habitData = read('js/data/habit.js');
const habitEngine = read('js/habit.js');

const shift = (k, n) => {
  const d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

/* Tez bo'lsin: validator bir haftani tekshiradi (4 shablon shu yerda bor) */
const WINDOW = { from: '2026-10-26', to: '2026-11-01' };

function validateWith(mutate) {
  const g = {};
  g.window = g;
  g.Store = {
    setting: () => null, shiftDays: shift, dateKey: () => '2026-10-26',
    readGet: () => null, habitBlock: () => false, habitAll: () => ({})
  };
  g.tr = k => k;
  g.L = o => (o && (o.uz || o.en)) || o;
  g.COURSE = Array.from({ length: 30 }, (_, i) => ({ day: i + 1 }));
  g.ENGLISH = { meta: { start: '2026-10-26', days: 108, orientation: { from: '2026-10-22' }, classDays: [2, 4, 6] } };
  g.SPEAK30 = { meta: { days: 30 } };
  vm.createContext(g);
  vm.runInContext(prayerSrc, g);
  vm.runInContext(habitData, g);
  if (mutate) mutate(g.HABIT);
  vm.runInContext(habitEngine, g);
  return g.HabitPlan.validate(WINDOW);
}

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('ok   ' + m); } else { fail++; console.log('FAIL ' + m); } };
const hasRule = (r, rule) => r.findings.some(f => f.rule.indexOf(rule) >= 0);
const blk = (H, tpl, id) => H[tpl].blocks.filter(b => b.id === id)[0];

console.log('Validator — salbiy testlar (nuqson kiritilib tekshiriladi)');
console.log('');

/* 0. Tegilmagan jadval toza */
const clean = validateWith(null);
ok(clean.ok, "tegilmagan jadval: xato yo'q" + (clean.ok ? '' : ' → ' + clean.errors.slice(0, 3).join(' | ')));

/* 1. Kun 1440 daqiqa emas: oxirgi uyquni qat'iy qilib qo'yamiz */
ok(hasRule(validateWith(H => {
  const b = blk(H, 'oddiy', 'h-sleep'); delete b.flexTo; b.min = 200;
}), 'kun 1440'), 'kun 1440 daqiqa emasligi topildi');

/* 2. Shablondan blok yo'qolsa: dvigatel bo'shliqni yopadi, lekin
      validator katta avtomatik bo'shliqni ochiq aytishi kerak */
ok(hasRule(validateWith(H => {
  const b = blk(H, 'oddiy', 'h-free'); delete b.flex; delete b.until; b.min = 5;
}), "avtomatik bo'shliq"), 'katta avtomatik bo\'shliq topildi');

/* 3. Uyqu kamayib ketdi: qayta uyquni qat'iy 10 daqiqa qilamiz */
ok(hasRule(validateWith(H => {
  const b = blk(H, 'lc', 'c-resleep'); delete b.flex; delete b.until; b.min = 10;
}), 'uyqu'), 'uyqu normadan chiqqani topildi');

/* 4. Pora soni kamaydi */
ok(hasRule(validateWith(H => {
  H.oddiy.blocks = H.oddiy.blocks.filter(b => b.id !== 'h-juz2');
}), 'pora soni'), "pora soni 3 emasligi topildi");

/* 5. Pora davomiyligi o'zgardi */
ok(hasRule(validateWith(H => { blk(H, 'oddiy', 'h-juz1').min = 45; }), 'pora davomiyligi'),
  'pora davomiyligi 90 emasligi topildi');

/* 6. Qisqa yadro bloki (shortOk YO'Q) */
ok(hasRule(validateWith(H => {
  const b = blk(H, 'lc', 'c-close'); b.shortOk = false; b.min = 20;
}), 'qisqa yadro'), 'qisqa yadro bloki topildi');

/* 7. Uzun yadro bloki (longOk YO'Q, chegara pasaytirilgan) */
ok(hasRule(validateWith(H => {
  blk(H, 'gibrid', 'g-kitchen').longOk = false;
  H.gibrid.limits = { pmHardMax: 2, maxCore: 100 };
}), 'uzun yadro'), 'uzun yadro bloki topildi');

/* 8. OG'IR yuk chegarasidan oshdi */
ok(hasRule(validateWith(H => {
  blk(H, 'oddiy', 'h-input').w = 'hard';
  blk(H, 'oddiy', 'h-close').w = 'hard';
}), "OG'IR yuk"), "OG'IR yuk chegarasi topildi");

/* 9. Tushdan keyin ortiqcha OG'IR blok (oddiy shablonda chegara 1) */
ok(hasRule(validateWith(H => { blk(H, 'oddiy', 'h-input').w = 'hard'; }), 'tushdan keyingi'),
  'tushdan keyingi ortiqcha OG\'IR blok topildi');

/* 10. Yadro blokida w yo'q */
ok(hasRule(validateWith(H => { delete blk(H, 'oddiy', 'h-tech').w; }), "w yo'q"),
  "yadro blokida w yo'qligi topildi");

/* 11. Dublikat id */
ok(hasRule(validateWith(H => {
  H.oddiy.blocks.push({ id: 'h-juz1', kind: 'rest', min: 0, t: { uz: 'x', en: 'x' } });
}), 'dublikat id'), 'dublikat id topildi');

/* 12. Noma'lum kind */
ok(hasRule(validateWith(H => { blk(H, 'oddiy', 'h-tech').kind = 'teleport'; }), "noma'lum kind"),
  "noma'lum kind topildi");

/* 13. Noto'g'ri anchor nomi */
ok(hasRule(validateWith(H => { blk(H, 'oddiy', 'h-asr').anchor = 'sunrise'; }), "noto'g'ri anchor"),
  "noto'g'ri anchor nomi topildi");

/* 14. Blok sig'may qoldi: Tech blokini juda uzun qat'iy qilamiz */
ok(hasRule(validateWith(H => {
  const b = blk(H, 'lc', 'c-input'); delete b.flex; delete b.untilBlock; b.min = 600;
}), "sig'madi"), "blok sig'may qolgani topildi");

/* 15. Tahajjud kechaning oxirgi uchdan biridan oldin */
ok(hasRule(validateWith(H => { H.meta.tahajjud = '22:30'; }), 'Tahajjud'),
  'Tahajjud oxirgi uchdan birdan oldin ekani topildi');

/* --- ATAYLAB QILINGAN ISTISNOLAR xato deb BELGILANMASLIGI kerak ------ */
ok(!clean.findings.some(f => /qisqa yadro/.test(f.rule)),
  'shortOk bloklari (muhosaba 20 daq) qisqa deb belgilanmadi');
ok(!clean.findings.some(f => /uzun yadro/.test(f.rule)),
  'longOk bloki (oshxona) uzun deb belgilanmadi');
ok(!clean.findings.some(f => /tushdan keyingi/.test(f.rule)),
  'gibrid kunidagi ikki OG\'IR blok to\'qnashuv deb belgilanmadi');
ok(!clean.findings.some(f => /Tahajjud/.test(f.rule)),
  'Tahajjud 02:00 oxirgi uchdan bir ichida deb tasdiqlandi');
ok(!clean.findings.some(f => /avtomatik bo/.test(f.rule)),
  "tegilmagan jadvalda katta avtomatik bo'shliq yo'q");

console.log('');
if (fail) { console.log('FAIL — ' + fail + ' ta tekshiruv ishlamadi (' + pass + ' ta o\'tdi)'); process.exit(1); }
console.log('ALL OK — ' + pass + ' ta tekshiruv');
