/* ==========================================================================
   tools/validate-schedule.cjs — jadval validatori (deployga kirmaydi)
   --------------------------------------------------------------------------
       node tools/validate-schedule.cjs          qisqa hisobot
       node tools/validate-schedule.cjs --full   har kun bo'yicha jadval
       node tools/validate-schedule.cjs --day 2026-12-21   bitta kun

   Jadval QAT'IY emas — har kuni namoz vaqtlaridan hisoblanadi, shuning
   uchun validator MARAFONNING HAR KUNINI tekshiradi (108 kun × 4 shablon).
   Prayer moduli haqiqiy: js/prayer.js yuklanadi, stub emas.

   16 qoida — HabitPlan.validate (js/habit.js) ustidagi izohda.
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
global.window = global;

const root = path.join(__dirname, '..');
const load = f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))();

const shift = (k, n) => {
  const d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

global.Store = {
  setting: () => null,
  shiftDays: shift,
  dateKey: () => '2026-10-26',
  readGet: () => null,
  habitBlock: () => false,
  habitAll: () => ({})
};
global.L = o => (o && (o.uz || o.en)) || o;
global.tr = k => k;

load('js/prayer.js');                       // HAQIQIY namoz kalkulyatori
load('js/data/habit.js');
global.COURSE = Array.from({ length: 30 }, (_, i) => ({ day: i + 1 }));
global.ENGLISH = { meta: { start: '2026-10-26', days: 108, orientation: { from: '2026-10-22' }, classDays: [2, 4, 6] } };
global.SPEAK30 = { meta: { days: 30 } };
load('js/habit.js');

const argv = process.argv.slice(2);
const full = argv.includes('--full');
const oneIdx = argv.indexOf('--day');
const oneDay = oneIdx >= 0 ? argv[oneIdx + 1] : null;
const DOW = ['Yak', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'];
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

function printDay(key) {
  const p = global.HabitPlan.forDate(key);
  console.log('');
  console.log(p.type.toUpperCase() + ' · ' + key + ' [' + DOW[p.dow] + ']   ' +
    'Bomdod ' + p.prayer.fajr.str + ' · Peshin ' + p.prayer.dhuhr.str + ' · Asr ' + p.prayer.asr.str +
    ' · Shom ' + p.prayer.maghrib.str + ' · Xufton ' + p.prayer.isha.str);
  console.log('   yotish ' + p.bedStr + ' · uyqu ' + p.sleep.main + ' + qayta ' + p.sleep.re +
    ' = ' + p.sleep.total + ' daq' + (p.type === 'gibrid' ? ' · 3-pora ' + (p.juzEvening ? 'kechqurun' : 'ertalab') : ''));
  console.log('   ' + '-'.repeat(70));
  p.blocks.forEach(b => {
    console.log('   ' + b.fromStr + '–' + b.toStr + num(b.min, 5) + ' daq  ' +
      (b.injected ? '· ' : b.core ? '▸ ' : '  ') + global.L(b.t) +
      (b.juz ? '  [' + b.book + ']' : '') +
      (b.core && b.w ? '  [' + b.w + ']' : '') +
      (b.inside ? '  ← ' + global.L(b.insideOf) + ' ichida' : ''));
  });
  p.warnings.forEach(w => console.log('   ! ' + (w.text ? global.L(w.text) : JSON.stringify(w))));
}

if (oneDay) { printDay(oneDay); process.exit(0); }

const r = global.HabitPlan.validate();
const rep = r.report;
const h = m => (m / 60).toFixed(1) + ' h';

console.log('UZLEEDER ACADEMY — SCHEDULE VALIDATION (Uzlat & Ribat)');
console.log('='.repeat(72));
console.log('Oyna: ' + global.HABIT.meta.from + ' → ' + global.HABIT.meta.to + '   (' + rep.days + ' kun)');
console.log('Chorcho\'ba: Tahajjud ' + global.HABIT.meta.tahajjud + ' · ' + global.HABIT.meta.juzPerDay +
  ' pora × ' + global.HABIT.meta.juz + ' daq · uyqu ' + global.HABIT.meta.sleepMin + ' daq');
console.log('');

console.log('SHABLON BO\'YICHA');
console.log('-'.repeat(72));
console.log(pad('shablon', 12) + num('kun', 5) + num('yadro', 8) + num('eng kam', 10) + num('eng ko\'p', 10) + num('OG\'IR', 8));
Object.keys(rep.byType).forEach(k => {
  const a = rep.byType[k];
  console.log(pad(k, 12) + num(a.n, 5) + num(a.avg, 8) + num(a.min, 10) + num(a.max, 10) + num(a.avgHard, 8));
});
console.log('');
console.log('Haftalik yadro: ' + rep.week + ' daq = ' + h(rep.week) +
  '   (2 gibrid + 3 lc + 1 oddiy + 1 tiklanish)');
console.log('Haftalik Qur\'on: ' + (global.HABIT.meta.juz * global.HABIT.meta.juzPerDay * 7) + ' daq = ' +
  h(global.HABIT.meta.juz * global.HABIT.meta.juzPerDay * 7) + ' (' + (global.HABIT.meta.juzPerDay * 7) + ' pora)');
console.log('Haftalik uyqu: ' + h(global.HABIT.meta.sleepMin * 7));
console.log('');

console.log('CHEGARALAR (HabitPlan.LIMITS)');
console.log('-'.repeat(72));
const LIM = global.HabitPlan.LIMITS;
Object.keys(LIM).forEach(k => console.log('  ' + pad(k, 14) + LIM[k]));
console.log('  gibrid shabloni: pmHardMax ' + (global.HABIT.gibrid.limits || {}).pmHardMax +
  ' — oshxona ertalabni egallaydi, Tech tushdan keyin ikki qismda (ataylab)');
console.log('');

if (full) {
  let k = global.HABIT.meta.from, n = 0;
  while (k <= global.HABIT.meta.to && n++ < 400) { printDay(k); k = shift(k, 1); }
  console.log('');
}

console.log('='.repeat(72));
if (r.ok) {
  console.log('PASS — ' + rep.days + '/' + rep.days + ' kun, 16 qoida, xato yo\'q.');
} else {
  console.log('FAIL — ' + r.findings.length + ' topilma:');
  const byRule = {};
  r.findings.forEach(f => { (byRule[f.rule] = byRule[f.rule] || []).push(f); });
  Object.keys(byRule).forEach(rule => {
    const list = byRule[rule];
    console.log('');
    console.log('  ' + rule + '  (' + list.length + ' ta)');
    list.slice(0, 6).forEach(f => console.log('    ' + f.day + '  ' + f.msg));
    if (list.length > 6) console.log('    … va yana ' + (list.length - 6) + ' ta');
  });
  process.exit(1);
}
