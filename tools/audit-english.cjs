/* ==========================================================================
   tools/audit-english.cjs — 140 kunlik ingliz tili kursi tuzilma auditi
   node tools/audit-english.cjs
   Tekshiradi: kunlar 1–140 mavjud va takrorlanmagan · gram/vocab kalitlari
   ENG_GRAMMAR / ENG_VOCAB da bor · bo'limlar bo'sh emas · practice bor ·
   haftaning 7-kunida test (qo'lda yoki generator) · o'qish/tinglash havolalari.
   Ma'lumot o'zgartirilmaydi — faqat hisobot.
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs');
global.window = global;
const root = path.join(__dirname, '..');
const load = f => new Function(fs.readFileSync(path.join(root, f), 'utf8'))();
['js/data/english.js', 'js/data/eng-grammar.js', 'js/data/eng-grammar-2.js', 'js/data/eng-vocab.js', 'js/data/eng-skills.js',
  'js/data/eng-days-1.js', 'js/data/eng-days-2.js', 'js/data/eng-days-3.js', 'js/data/eng-days-4.js', 'js/data/eng-days-5.js', 'js/data/eng-days-6.js',
  'js/data/eng-reading-1.js', 'js/data/eng-reading-2.js', 'js/data/eng-reading-3.js', 'js/data/eng-reading-4.js', 'js/data/eng-listening-1.js', 'js/data/eng-listening-2.js'].forEach(load);
const RAW = [].concat(global.ENG_DAYS_1 || [], global.ENG_DAYS_2 || [], global.ENG_DAYS_3 || [], global.ENG_DAYS_4 || [], global.ENG_DAYS_5 || [], global.ENG_DAYS_6 || []);
const LEGACY_INTRO = 4;
const intro = RAW.filter(x => x.w === 0), days = RAW.filter(x => x.w > 0).map(x => Object.assign({}, x, { d: x.d - LEGACY_INTRO }));
const errors = [], warns = [];
const seen = {};
days.forEach(x => { if (seen[x.d]) errors.push('duplicate day ' + x.d); seen[x.d] = 1; });
for (let d = 1; d <= 140; d++) if (!seen[d]) errors.push('missing day ' + d);
const G = global.ENG_GRAMMAR || {}, V = global.ENG_VOCAB || {};
let quizManual = 0, quizGen = 0, noPractice = 0;
days.forEach(x => {
  if (x.gram && !G[x.gram]) errors.push('day ' + x.d + ': grammar key not found: ' + x.gram);
  if (x.vocab && !V[x.vocab]) errors.push('day ' + x.d + ': vocab key not found: ' + x.vocab);
  if (!x.title) errors.push('day ' + x.d + ': no title');
  if (!(x.sections && x.sections.length) && !x.mock && !x.review) warns.push('day ' + x.d + ': no sections');
  (x.sections || []).forEach((s, i) => { if (!s.h || !s.p) errors.push('day ' + x.d + ' section ' + i + ': empty'); });
  if (!(x.practice && x.practice.length)) noPractice++;
  const w = Math.ceil(x.d / 7), i = ((x.d - 1) % 7) + 1;
  if (x.w !== w || x.i !== i) errors.push('day ' + x.d + ': week/index mismatch (w=' + x.w + ',i=' + x.i + ' expected ' + w + '/' + i + ')');
  if (i === 7) { if (x.quiz && x.quiz.length) quizManual++; else quizGen++; }
  (x.quiz || []).forEach((q, qi) => { if (!q.q || !q.opts || q.opts.length < 2 || typeof q.correct !== 'number' || q.correct >= q.opts.length) errors.push('day ' + x.d + ' quiz ' + qi + ': malformed'); });
});
const readings = [].concat(global.ENG_READING_1 || [], global.ENG_READING_2 || [], global.ENG_READING_3 || [], global.ENG_READING_4 || []);
const rn = {}; readings.forEach(r => { if (rn[r.n]) errors.push('duplicate reading n=' + r.n); rn[r.n] = 1; if (!r.paras || !r.paras.length) errors.push('reading ' + r.n + ' has no paragraphs'); if (!r.qs || !r.qs.length) errors.push('reading ' + r.n + ' has no questions'); });
for (let n = 1; n <= 24; n++) if (!rn[n]) errors.push('missing reading ' + n);
const short = readings.filter(r => r.paras.reduce((a, p) => a + (p.t || '').split(/\s+/).length, 0) < 600).map(r => r.n + ':' + r.title);
const listening = [].concat(global.ENG_LISTENING_1 || [], global.ENG_LISTENING_2 || []);
console.log('English course audit');
console.log('  intro lessons: ' + intro.length + ' · course days: ' + days.length + '/140');
console.log('  weekly tests: manual ' + quizManual + ' · generator-backed ' + quizGen + ' (weeks total 20)');
console.log('  days without practice list: ' + noPractice);
console.log('  readings: ' + readings.length + '/24 · listening sections: ' + listening.length);
console.log('  readings under 600 words (fine for early weeks): ' + short.length);
if (warns.length) console.log('  warnings:\n    ' + warns.slice(0, 20).join('\n    '));
console.log(errors.length ? 'ERRORS:\n  ' + errors.join('\n  ') : 'STRUCTURE OK — no missing/duplicate days, all grammar/vocab references resolve, all weekly tests present');
process.exit(errors.length ? 1 : 0);
