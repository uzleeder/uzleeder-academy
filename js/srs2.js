/* ==========================================================================
   SRS2 — natijaga moslashadigan takror jadvali (Mission va Python & AI yo'li)
   --------------------------------------------------------------------------
   Deterministik qoida, AI yo'q. Element: { step, due, streak, lapses, n, last }
     outcome:
       'wrong'       — eslay olmadi / xato:        step = 0, ertaga; lapses+1
       'partial'     — qisman / yordam (hint) bilan: step o'zgarmaydi, joriy oraliq
       'hint'        — to'g'ri, lekin yordam bilan:  'partial' bilan bir xil
       'independent' — mustaqil to'g'ri:             step+1; 3+ ketma-ket bo'lsa step+2
   Oraliqlar sozlanadi (standart 1 · 3 · 7 · 14). Oxirgisidan keyin har safar
   ×2 (28, 56 …), eng ko'pi 90 kun. Takrorlanuvchi xato (lapses ≥ 2) — keyingi
   takror hech qachon 1 kundan uzoq emas, toki 2 marta ketma-ket mustaqil
   to'g'ri bo'lmaguncha. Har natija tarixga yoziladi (o'chirilmaydi).
   ========================================================================== */
(function (root) {
  'use strict';
  var DEF = [1, 3, 7, 14];
  var MAX = 90;

  function addDays(key, n) {
    var p = key.split('-'), d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function ivlFor(step, ivls) {
    ivls = ivls && ivls.length ? ivls : DEF;
    if (step < ivls.length) return ivls[step];
    var v = ivls[ivls.length - 1];
    for (var i = ivls.length; i <= step; i++) v = Math.min(MAX, v * 2);
    return v;
  }

  var SRS2 = {
    DEF: DEF,
    addDays: addDays,
    ivlFor: ivlFor,
    /* Yangi element — bugun takrorlanadi (yoki `firstIn` kundan keyin) */
    fresh: function (today, firstIn) { return { step: 0, due: addDays(today, firstIn == null ? 1 : firstIn), streak: 0, lapses: 0, n: 0, last: null, hist: [] }; },
    /* Natijani qo'llash. it o'zgaradi va qaytariladi. */
    apply: function (it, outcome, today, ivls) {
      it = it || SRS2.fresh(today, 0);
      it.n = (it.n || 0) + 1; it.last = today;
      var step = it.step || 0, days;
      if (outcome === 'wrong') {
        it.lapses = (it.lapses || 0) + 1; it.streak = 0; step = 0; days = 1;
      } else if (outcome === 'partial' || outcome === 'hint') {
        it.streak = 0; days = ivlFor(step, ivls);
        if ((it.lapses || 0) >= 2) days = 1;
      } else {
        it.streak = (it.streak || 0) + 1;
        step = step + (it.streak >= 3 ? 2 : 1);
        days = ivlFor(step - 1, ivls);
        /* Takrorlanuvchi xato: 2 marta ketma-ket mustaqil to'g'ri bo'lmaguncha — qisqa */
        if ((it.lapses || 0) >= 2 && it.streak < 2) days = 1;
      }
      it.step = step;
      it.due = addDays(today, days);
      it.hist = (it.hist || []).concat([[today, outcome[0]]]).slice(-20);
      return it;
    },
    isDue: function (it, today) { return !!it && !it.retired && it.due <= today; },
    /* Holat: yangi · o'rganilmoqda · tanish · mustahkam · takror kerak */
    status: function (it, today) {
      if (!it || !it.n) return 'new';
      if (it.due <= today) return 'due';
      if ((it.step || 0) >= 4 && (it.streak || 0) >= 2) return 'secure';
      if ((it.step || 0) >= 2) return 'familiar';
      return 'learning';
    }
  };
  root.SRS2 = SRS2;
  if (typeof module !== 'undefined' && module.exports) module.exports = SRS2;
})(typeof window !== 'undefined' ? window : globalThis);
