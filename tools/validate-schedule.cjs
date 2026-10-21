/* ==========================================================================
   tools/validate-schedule.cjs — jadval validatori (deployga kirmaydi)
   --------------------------------------------------------------------------
       node tools/validate-schedule.cjs          qisqa hisobot
       node tools/validate-schedule.cjs --full   har variant bo'yicha jadval

   15 qoida (HabitPlan.validate, js/habit.js):
     1  imkonsiz vaqt oralig'i yo'q
     2  haqiqiy to'qnashuv yo'q
     3  bir-birini istisno qiluvchi shartli variantlar RUXSAT etilgan
     4  OG'IR yuk ≤ 240 daq (yakka ish; tashqi dars hisobga kirmaydi)
     5  yadro bloklari ≤ 6
     6  yadro bloki ≥ 45 daq (shortOk — ataylab ruxsat etilgan istisno)
     7  tushdan keyin ≤ 1 OG'IR blok
     8  har yadro blokida `w` majburiy (hard | med | light)
     9  kun 1440 daqiqa
     10 dublikat majburiy blok yo'q
     11 ichma-ich blok yo'q
     12 noto'g'ri shartli kombinatsiya yo'q (firstOnly+notFirst, dcOnly+noDc)
     13 id siz blok yo'q
     14 dublikat id yo'q
     15 noma'lum `kind` yo'q
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
global.window = global;
global.Store = { setting: () => null, shiftDays: () => '', dateKey: () => '2026-09-21', habitBlock: () => false, habitAll: () => ({}) };
global.Prayer = { CITIES: [], DEFAULTS: {}, ORDER: [], times: () => ({}), NAMES: {}, inRange: () => [] };
global.tr = k => k; global.L = o => (o && o.uz) || o;
const root = path.join(__dirname, '..');
new Function(fs.readFileSync(path.join(root, 'js/data/habit.js'), 'utf8'))();
new Function(fs.readFileSync(path.join(root, 'js/habit.js'), 'utf8'))();

const full = process.argv.includes('--full');
const r = global.HabitPlan.validate();
const L = global.HabitPlan.LIMITS;
const rep = r.report;
const h = m => (m / 60).toFixed(1) + ' h';
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log('UZLEEDER ACADEMY — SCHEDULE VALIDATION');
console.log('='.repeat(64));
console.log('');

/* --- Har variant --- */
if (full) {
  console.log(pad('VARIANT', 30) + num('blk', 4) + num('core', 6) + num('hard', 6) + num('med', 5) + num('light', 6) + num('min', 5) + num('day', 6));
  console.log('-'.repeat(68));
  rep.variants.forEach(v => {
    console.log(pad(v.name, 30) + num(v.blocks, 4) + num(v.core, 6) + num(v.hard, 6) +
      num(v.med, 5) + num(v.light, 6) + num(v.minBlock, 5) + num(v.day, 6));
  });
  console.log('');
}

/* --- Qoida bo'yicha xulosa (oddiy kunlar) --- */
const plain = rep.variants.filter(v => !v.work && /notFirst\/noDc/.test(v.name));
console.log('KUNLAR (oddiy variant)');
console.log('-'.repeat(64));
plain.forEach(v => {
  console.log('  ' + pad(v.type, 8) + num(v.blocks, 2) + ' blok · yadro ' + num(v.core, 4) + ' daq' +
    '  (og\'ir ' + num(v.hard, 3) + ' · o\'rta ' + num(v.med, 3) + ' · yengil ' + num(v.light, 3) + ')' +
    '  eng qisqa ' + num(v.minBlock, 3) + ' daq');
});
console.log('');
console.log('  Haftalik yadro: ' + h(rep.week) + ' (' + rep.week + ' daq) — og\'ir ' +
  rep.weekParts.heavy + ' × 3 · LC ' + rep.weekParts.class + ' × 3 · yakshanba ' + rep.weekParts.rest);
console.log('');

/* --- Chegaralar --- */
console.log('CHEGARALAR');
console.log('-'.repeat(64));
const worstHard = Math.max(...rep.variants.map(v => v.soloHard));
const worstBlocks = Math.max(...rep.variants.map(v => v.blocks));
const worstMin = Math.min(...rep.variants.filter(v => v.blocks).map(v => v.minBlock));
const worstPm = Math.max(...rep.variants.map(v => v.pmHard));
const line = (name, actual, limit, okc) =>
  '  ' + (okc ? 'PASS' : 'FAIL') + '  ' + pad(name, 34) + num(actual, 5) + '  (chegara ' + limit + ')';
console.log(line("OG'IR yuk (yakka ish)", worstHard, L.hardMax, worstHard <= L.hardMax));
console.log(line('Yadro bloklari soni', worstBlocks, L.maxBlocks, worstBlocks <= L.maxBlocks));
console.log(line('Eng qisqa yadro bloki', worstMin, L.minCore, worstMin >= L.minCore));
console.log(line("Tushdan keyingi OG'IR bloklar", worstPm, L.pmHardMax, worstPm <= L.pmHardMax));
console.log('');

/* --- Shartli variantlar --- */
console.log('SHARTLI VARIANTLAR (to\'qnashuv emas)');
console.log('-'.repeat(64));
['heavy', 'class', 'rest'].forEach(t => {
  const pairs = (global.HABIT[t].blocks || []).filter(b => b.dcOnly || b.noDc || b.firstOnly || b.notFirst);
  if (!pairs.length) return;
  const byAt = {};
  pairs.forEach(b => { (byAt[b.at] = byAt[b.at] || []).push(b); });
  Object.keys(byAt).sort().forEach(at => {
    const g = byAt[at];
    console.log('  ' + pad(t, 7) + at + '  ' + g.map(b =>
      b.id + ' (' + (b.dcOnly ? 'dcOnly' : b.noDc ? 'noDc' : b.firstOnly ? 'firstOnly' : 'notFirst') + ')').join('  ‖  '));
  });
});
console.log('');

/* --- Migratsiya holati --- */
const storeSrc = fs.readFileSync(path.join(root, 'js/store.js'), 'utf8');
const mv = (storeSrc.match(/SCHEDULE_VERSION\s*=\s*(\d+)/) || [])[1];
console.log('MIGRATSIYA');
console.log('-'.repeat(64));
console.log('  scheduleVersion (store.js): ' + (mv || "topilmadi"));
console.log('  test: node tools/schedule-migration-test.cjs');
console.log('');

/* --- Natija --- */
console.log('='.repeat(64));
if (r.ok) {
  console.log('PASS — 15 qoida, ' + rep.variants.length + ' variant tekshirildi, xato yo\'q.');
} else {
  console.log('FAIL — ' + r.findings.length + ' ta muammo:');
  console.log('');
  r.findings.forEach(f => {
    console.log('  SCHEDULE ERROR');
    console.log('    Kun:      ' + f.day);
    console.log('    Qoida:    ' + f.rule);
    if (f.actual !== undefined) console.log('    Hozirgi:  ' + f.actual);
    if (f.limit !== undefined) console.log('    Chegara:  ' + f.limit);
    console.log('    Tafsilot: ' + f.msg);
    console.log('');
  });
}
process.exit(r.ok ? 0 : 1);
