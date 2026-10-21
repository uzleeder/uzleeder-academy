/* ==========================================================================
   tools/validator-negative-test.cjs
   Validator HAQIQIY muammolarni topa oladimi? (spec §49)
   Har testda jadvalga ataylab bitta nuqson kiritiladi va validator uni
   topishi SHART. Shartli (bir-birini istisno qiluvchi) bloklar esa
   to'qnashuv sifatida BELGILANMASLIGI kerak.

       node tools/validator-negative-test.cjs
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
const root = path.join(__dirname, '..');
const habitData = fs.readFileSync(path.join(root, 'js/data/habit.js'), 'utf8');
const habitEngine = fs.readFileSync(path.join(root, 'js/habit.js'), 'utf8');

function validateWith(mutate) {
  const g = {};
  g.window = g;
  g.Store = { setting: () => null, shiftDays: () => '', dateKey: () => '2026-09-21', habitBlock: () => false, habitAll: () => ({}) };
  g.Prayer = { CITIES: [], DEFAULTS: {}, ORDER: [], times: () => ({}), NAMES: {}, inRange: () => [] };
  g.tr = k => k; g.L = o => (o && o.uz) || o;
  const vm = require('vm');
  vm.createContext(g);
  vm.runInContext(habitData, g);
  if (mutate) mutate(g.HABIT);
  vm.runInContext(habitEngine, g);
  return g.HabitPlan.validate();
}

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('ok   ' + m); } else { fail++; console.log('FAIL ' + m); } };
const hasRule = (r, rule) => r.findings.some(f => f.rule.indexOf(rule) >= 0);

console.log('Validator — salbiy testlar (nuqson kiritilib tekshiriladi)');
console.log('');

/* 0. Tegilmagan jadval toza */
ok(validateWith(null).ok, "tegilmagan jadval: xato yo'q");

/* 1a. HAQIQIY to'qnashuv: qisman ustma-ust (shartsiz) */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.push({ id: 'x-clash', kind: 'eng', at: '07:00', min: 60, core: true, w: 'med' });
}), "to'qnashuv"), "qisman ustma-ust to'qnashuv topildi");

/* 1b. Ichma-ich blok: biri ikkinchisining ichida to'liq */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.push({ id: 'x-nested', kind: 'eng', at: '06:30', min: 30, core: true, w: 'med' });
}), 'ichma-ich'), 'ichma-ich blok topildi');

/* 2. OG'IR yuk chegarasi */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-eng-mid') b.w = 'hard'; });
}), "OG'IR yuk"), "OG'IR yuk chegarasi (240 daq) ishladi");

/* 3. `w` yo'q */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-code') delete b.w; });
}), "w yo'q"), "yadro blokida w yo'qligi topildi");

/* 4. Juda qisqa yadro bloki */
ok(hasRule(validateWith(H => {
  H.rest.blocks.forEach(b => { if (b.id === 'r-close') { b.min = 20; } });
  H.rest.blocks.forEach(b => { if (b.id === 'r-wind') b.min = 70; });   // kun 1440 qolsin
}), 'qisqa blok'), 'qisqa yadro bloki (< 45 daq) topildi');

/* 5. Blok soni chegarasi */
ok(hasRule(validateWith(H => {
  H.rest.blocks.forEach(b => { if (['r-walk', 'r-rest2', 'r-rest3', 'r-rest4'].indexOf(b.id) >= 0) { b.core = true; b.w = 'light'; } });
}), 'blok soni'), 'yadro bloklari soni (> 6) topildi');

/* 6. Tushdan keyin ikkita OG'IR */
ok(hasRule(validateWith(H => {
  H.rest.blocks.forEach(b => { if (b.id === 'r-close') b.w = 'hard'; });
  H.rest.blocks.forEach(b => { if (b.id === 'r-test') { b.at = '14:00'; } });
}), 'tushdan keyingi'), "tushdan keyin > 1 OG'IR blok topildi");

/* 7. Kun 1440 emas */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-wind') b.min = 40; });
}), 'kun uzunligi'), 'kun 1440 daqiqa emasligi topildi');

/* 8. Dublikat id */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-walk') b.id = 'h-close'; });
}), 'dublikat id'), 'dublikat id topildi');

/* 9. Noto'g'ri shartli kombinatsiya */
ok(hasRule(validateWith(H => {
  H.rest.blocks.forEach(b => { if (b.id === 'r-focus') { b.dcOnly = true; } });   // noDc + dcOnly
}), 'shartli'), "noto'g'ri shartli kombinatsiya (dcOnly + noDc) topildi");

/* 10. Noma'lum kind */
ok(hasRule(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-code') b.kind = 'qwerty'; });
}), 'kind'), "noma'lum kind topildi");

/* 11. MUHIM: shartli juftlik to'qnashuv DEB HISOBLANMAYDI */
const clean = validateWith(null);
ok(!clean.findings.some(f => /to'qnashuv|ichma-ich/.test(f.rule) && /r-focus|r-code|r-kick/.test(f.msg)),
  "shartli juftliklar (10:30 va 18:35) to'qnashuv deb belgilanmadi");

/* 12. Yangi shartli juftlik qo'shilsa ham to'qnashuv emas */
ok(validateWith(H => {
  H.heavy.blocks.forEach(b => { if (b.id === 'h-walk') b.dcOnly = true; });
  H.heavy.blocks.push(Object.assign({}, H.heavy.blocks.find(b => b.id === 'h-walk'),
    { id: 'h-walk-alt', dcOnly: false, noDc: true }));
}).ok, "yangi bir-birini istisno qiluvchi juftlik to'qnashuv bermadi");

console.log('');
console.log(fail ? ('FAIL — ' + fail + ' ta, ok: ' + pass) : ('ALL OK — ' + pass + ' ta tekshiruv'));
process.exit(fail ? 1 : 0);
