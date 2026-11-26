/* ==========================================================================
   tools/storage-test.cjs — saqlash xatosi testi
   --------------------------------------------------------------------------
   Avval js/store.js dagi write() xatoni JIMGINA yutardi: joy tugasa yoki
   brauzer yozishga ruxsat bermasa, ilova ishlayverardi, lekin progress
   saqlanmasdi va foydalanuvchi buni bilmasdi. Bu test aynan shuning
   qaytib kelmasligini tekshiradi.

       node tools/storage-test.cjs
   ========================================================================== */
'use strict';
const path = require('path');

/* --- soxta localStorage: xatoni xohlagan paytda yoqib-o'chiramiz --- */
const LS = {};
let failWith = null;          // null | 'quota' | 'blocked'

function quotaError() {
  const e = new Error('QuotaExceededError');
  e.name = 'QuotaExceededError';
  e.code = 22;
  return e;
}
function blockedError() {
  const e = new Error('SecurityError');
  e.name = 'SecurityError';
  return e;
}

global.localStorage = {
  getItem: k => (k in LS ? LS[k] : null),
  setItem: (k, v) => {
    if (failWith === 'quota') throw quotaError();
    if (failWith === 'blocked') throw blockedError();
    LS[k] = String(v);
  },
  removeItem: k => { delete LS[k]; }
};
global.window = {};
global.document = { addEventListener() {}, documentElement: {} };

require(path.join(path.resolve(__dirname, '..'), 'js/store.js'));
const Store = global.window.Store;
Store.init();

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('ok   ' + m); } else { fail++; console.log('FAIL ' + m); } };

/* --- tinglovchi: nechta xabar kelganini sanaymiz --- */
const events = [];
Store.onSaveError(st => events.push({ ok: st.ok, kind: st.kind }));

/* 1. Oddiy holat */
Store.set('name', 'Test');
ok(Store.saveStatus().ok === true, 'oddiy yozuv: saqlandi');
ok(LS['uzla.state'] !== undefined, 'oddiy yozuv: localStorage ga tushdi');
ok(events.length === 0, 'oddiy yozuvda ogohlantirish yo\'q');
ok(Store.bytes() > 0, 'Store.bytes() hajm qaytaradi');

/* 2. Joy tugadi — ENDI YUTILMAYDI */
failWith = 'quota';
Store.set('name', 'Quota');
ok(Store.saveStatus().ok === false, 'joy tugadi: holat ok=false');
ok(Store.saveStatus().kind === 'quota', 'joy tugadi: turi aniqlandi (quota)');
ok(events.length === 1 && events[0].ok === false, 'joy tugadi: bir marta xabar berildi');
ok(Store.saveStatus().bytes > 0, 'joy tugadi: hajm yozildi');

/* 3. Ketma-ket xatolar foydalanuvchini bezdirmasin */
Store.set('name', 'Quota2');
Store.set('name', 'Quota3');
ok(events.length === 1, 'takroriy xatoda qayta xabar yo\'q (spam emas)');

/* 4. Xotiradagi holat ishlayveradi — ilova to'xtamaydi */
ok(Store.get('name') === 'Quota3', 'xato bo\'lsa ham xotiradagi holat yangilanadi');

/* 5. Tiklanish */
failWith = null;
Store.set('name', 'Back');
ok(Store.saveStatus().ok === true, 'tiklandi: holat ok=true');
ok(events.length === 2 && events[1].ok === true, 'tiklanganda xabar berildi');
ok(JSON.parse(LS['uzla.state']).name === 'Back', 'tiklangandan keyin diskka yozildi');

/* 6. Brauzer bloklagan holat (privat rejim) */
failWith = 'blocked';
Store.set('name', 'Blocked');
ok(Store.saveStatus().kind === 'blocked', 'bloklangan holat alohida aniqlanadi');

/* 7. Eski xatolik vaqti saqlanadi (keyin ogohlantirish uchun kerak) */
ok(Store.saveStatus().failedAt > 0, 'oxirgi xatolik vaqti yozilgan');

failWith = null;
console.log('');
if (fail) { console.log('FAIL — ' + fail + ' ta xato, ' + pass + ' ta ok'); process.exit(1); }
console.log('ALL OK — ' + pass + ' ta tekshiruv');
