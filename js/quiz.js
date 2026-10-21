/* ==========================================================================
   Test (quiz) moduli
   --------------------------------------------------------------------------
   Nima uchun alohida modul:
     1) Variantlarni ARALASHTIRISH kerak. Asl ma'lumotda 300 savoldan 251 tasi
        "B" javobiga to'g'ri kelardi — ya'ni har safar B ni bosgan odam
        hamma testdan o'tib ketardi. Bu bilimni o'lchamaydi.
        Endi variantlar har renderda aralashtiriladi; har bir tugma o'z ASL
        indeksini id/data-o da olib yuradi, shuning uchun javob kaliti buzilmaydi.
     2) Har savol javobidan keyin "nega shunday" izohi chiqadi (data/explain.js).
     3) Xato qilingan savollar "Xatolar daftari"ga yoziladi.
   ========================================================================== */
(function () {
  'use strict';

  var picked = {};    // qi -> tanlangan ASL indeks
  var locked = false; // tekshirilgandan keyin tanlash o'chadi

  function explainFor(dayNum, qi) {
    var list = window.EXPLAIN && window.EXPLAIN[dayNum];
    if (!list) return null;
    return list[qi] || null;
  }

  function looksLikeCode(s) {
    return /[=()\[\]{}<>]/.test(s) || /^(True|False|None)$/.test(String(s).trim());
  }

  window.Quiz = {
    render: function (d) {
      picked = {}; locked = false;
      var shuffle = Store.setting('shuffle');
      var total = d.quiz.length;

      var h = '<section class="quiz" id="l-quiz">' +
        '<div class="quiz-head"><h3><span class="q-ic">' + IC.spark + '</span>' + esc(tr('quiz')) + '</h3>' +
        '<span class="q-count">' + total + ' ' + esc(tr('questions')) + '</span></div>' +
        '<p class="quiz-sub">' + esc(tr('quizSub')) + '</p>' +
        '<div class="callout tip" style="margin-bottom:16px"><span class="co-ic">' + IC.lock + '</span>' +
          '<div>' + esc(tr('quizGate')) +
          (shuffle ? '<br><span style="color:var(--muted)">' + esc(tr('quizShuffleNote')) + '</span>' : '') +
          '</div></div>';

      d.quiz.forEach(function (q, qi) {
        // Savol matni joriy tilda (tarjima bo'lmasa — asl matn)
        var loc = localizedQuiz(d.day, qi, q);

        // Ko'rsatish tartibi: aralashtirilgan indekslar. Tugma id'si ASL indeksni
        // saqlaydi, shuning uchun tekshirish mantiqi o'zgarmaydi.
        var order = shuffle ? shuffledIndexes(q.opts.length) : q.opts.map(function (_, i) { return i; });

        h += '<div class="q-block" id="qb' + qi + '">' +
          '<div class="q-text"><span class="q-n">' + (qi + 1) + '</span>' + inlineCode(loc.q) + '</div>';

        order.forEach(function (origIdx, displayIdx) {
          var text = loc.opts[origIdx];
          h += '<button type="button" class="opt" id="o' + qi + '_' + origIdx + '" ' +
            'data-q="' + qi + '" data-o="' + origIdx + '">' +
            '<span class="mk">' + String.fromCharCode(65 + displayIdx) + '</span>' +
            '<span class="' + (looksLikeCode(text) ? 'mono' : '') + '">' + esc(text) + '</span></button>';
        });

        var why = explainFor(d.day, qi);
        h += '<div class="q-why" id="why' + qi + '">' +
          '<span class="w-ic">' + IC.bulb + '</span>' +
          '<div>' + (why ? inlineCode(L(why)) : '') + '</div></div>';

        h += '</div>';
      });

      h += '<div class="quiz-actions">' +
        '<button class="btn btn-primary" id="checkBtn" disabled>' + IC.check + esc(tr('check')) + '</button>' +
        '<span class="counter" id="qCounter">0 / ' + total + '</span></div>' +
        '<div class="result" id="qResult"><div class="score" id="qScore"></div>' +
          '<div><h4 id="qResultT"></h4><p id="qResultM"></p></div></div>' +
        '<div id="qSummary"></div>' +
        '<div class="quiz-actions" id="qAfter"></div>' +
        '</section>';
      return h;
    },

    mount: function (d) {
      var box = $('#l-quiz');
      if (!box) return;

      box.addEventListener('click', function (e) {
        var opt = e.target.closest ? e.target.closest('.opt') : null;
        if (opt && !locked) { pick(d, Number(opt.dataset.q), Number(opt.dataset.o)); return; }
        var btn = e.target.closest ? e.target.closest('#checkBtn') : null;
        if (btn && !btn.disabled) check(d);
      });
    }
  };

  function pick(d, qi, oi) {
    picked[qi] = oi;
    var block = $('#qb' + qi);
    block.classList.add('answered');
    $$('#qb' + qi + ' .opt').forEach(function (el) {
      el.classList.toggle('sel', Number(el.dataset.o) === oi);
    });
    var n = Object.keys(picked).length;
    $('#qCounter').textContent = n + ' / ' + d.quiz.length;
    $('#checkBtn').disabled = n < d.quiz.length;
  }

  function check(d) {
    locked = true;
    var correct = 0, newMistakes = 0;

    d.quiz.forEach(function (q, qi) {
      var chosen = picked[qi];
      $$('#qb' + qi + ' .opt').forEach(function (el) { el.classList.add('locked'); });

      var chosenEl = $('#o' + qi + '_' + chosen);
      var rightEl = $('#o' + qi + '_' + q.correct);

      if (chosen === q.correct) {
        correct++;
        if (chosenEl) chosenEl.classList.add('correct');
      } else {
        if (chosenEl) chosenEl.classList.add('wrong');
        if (rightEl) rightEl.classList.add('correct');
        $('#qb' + qi).classList.add('was-wrong');
        var loc = localizedQuiz(d.day, qi, q);
        Store.addMistake(d.day, qi, loc.opts[chosen], loc.opts[q.correct], loc.q);
        if (window.Review) Review.add('mistake', d.day + ':' + qi, { cat: 'python' });   // takror navbatiga
        newMistakes++;
      }
      // Izohni faqat javob berilgandan keyin ochamiz — oldindan ko'rinmasin
      var why = $('#why' + qi);
      if (why && why.textContent.trim()) why.classList.add('show');
    });

    $('#checkBtn').style.display = 'none';

    var pass = correct >= 7;
    var unlockedNew = Store.recordScore(d.day, correct);
    if (window.Review) { Store.quizSet('py:' + d.day, correct, d.quiz.length); if (pass) Review.add('py', d.day); }   // konspekt SRS ga

    var res = $('#qResult');
    res.className = 'result show ' + (pass ? 'pass' : 'fail');
    $('#qScore').textContent = correct + '/' + d.quiz.length;
    $('#qResultT').textContent = pass ? tr('passT') : tr('failT');
    $('#qResultM').textContent = pass ? tr('passM') : tr('failM');

    var after = $('#qAfter');
    after.innerHTML = '';
    var next = dayOf(d.day + 1);
    if (pass && next) {
      after.innerHTML = '<button class="btn btn-primary" data-go="lesson/' + next.day + '">' +
        esc(tr('nextDay')) + IC.arrowR + '</button>';
    } else if (pass) {
      after.innerHTML = '<div style="font-size:18px;font-weight:800;color:var(--green)">🎓 ' + esc(tr('congrats')) + '</div>';
    } else {
      after.innerHTML = '<button class="btn btn-ghost" data-go="lesson/' + d.day + '">' + IC.refresh + esc(tr('retry')) + '</button>' +
        '<button class="btn btn-quiet" data-go="mistakes">' + esc(tr('mistakes')) + IC.arrowR + '</button>';
    }

    buildSummary(d, correct, pass);
    App.refreshChrome();          // yon panel, streak, progress halqasi

    if (newMistakes) toast(tr('mistakesAdded', { n: newMistakes }), 'warn');
    if (unlockedNew) toast(tr('passT'), 'ok');

    res.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Test yakunidagi xulosa: natija izohi + asosiy nuqtalar + keyingi qadam */
  function buildSummary(d, correct, pass) {
    var pts = [];
    if (d.konspekt) pts = (L(d.konspekt) || []).slice(0, 5);
    else if (d.sections) pts = d.sections.map(function (s) { return L(s.h); });
    else pts = [L(d.title)];

    var msg = correct === d.quiz.length ? tr('sumPerfect')
      : pass ? tr('sumGood', { w: d.quiz.length - correct })
      : tr('sumRetry');

    var next = dayOf(d.day + 1);
    var h = '<div class="card" style="margin-top:16px;border-color:color-mix(in srgb,var(--brand) 35%,transparent)">' +
      '<h3 class="card-title"><span class="num">' + IC.doc + '</span>' + esc(tr('sumTitle')) + '</h3>' +
      '<p>' + esc(msg) + '</p><div style="display:grid;gap:9px;margin-top:14px">';
    pts.forEach(function (p, i) {
      h += '<div style="display:flex;gap:11px;align-items:flex-start;font-size:14.5px;color:var(--ink-soft)">' +
        '<span style="width:22px;height:22px;flex-shrink:0;border-radius:6px;display:grid;place-items:center;' +
        'background:color-mix(in srgb,var(--brand) 18%,transparent);color:var(--brand-hi);font-weight:800;font-size:12px">' +
        (i + 1) + '</span><span>' + esc(p) + '</span></div>';
    });
    h += '</div>';
    h += '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)">' +
      (next
        ? esc(pass ? tr('sumNext') : tr('sumStay')) + ' <b style="color:var(--brand-hi)">' +
          esc(tr('day') + ' ' + next.day + ': ' + L(next.title)) + '</b>'
        : '🎓 ' + esc(tr('congrats'))) +
      '</div></div>';

    $('#qSummary').innerHTML = quizBreakdown(d.quiz.map(function (q, qi) {
      return { q: localizedQuiz(d.day, qi, q).q, ok: picked[qi] === q.correct };
    })) + h;
  }

  /* Test yakunida "Kuchli / Takror kerak" bo'linmasi — savollar ikki ustunga.
     Xatoga tushganlar allaqachon Xato banki + SRS navbatida; shu yerda ko'rsatiladi.
     Python va ingliz testlari birgalikda ishlatadi. */
  window.quizBreakdown = function (items) {
    var ok = items.filter(function (i) { return i.ok; }), bad = items.filter(function (i) { return !i.ok; });
    var cut = function (s) { s = String(s || '').replace(/`/g, ''); return s.length > 64 ? s.slice(0, 62) + '…' : s; };
    var col = function (cls, ic, title, arr, empty) {
      var h = '<div class="qb-col ' + cls + '"><div class="qb-h">' + ic + esc(title) + ' <b>' + arr.length + '</b></div>';
      if (!arr.length) return h + '<div class="qb-empty">' + esc(empty) + '</div></div>';
      arr.forEach(function (i, n) { h += '<div class="qb-i"><span>' + (n + 1) + '</span>' + esc(cut(i.q)) + '</div>'; });
      return h + '</div>';
    };
    return '<div class="qb-wrap">' +
      col('ok', IC.check, tr('qbStrong'), ok, tr('qbStrongNone')) +
      col('bad', IC.refresh, tr('qbWeak'), bad, tr('qbWeakNone')) +
      (bad.length ? '<div class="qb-foot">' + esc(tr('qbFoot', { n: bad.length })) +
        ' <button class="btn btn-quiet btn-sm" data-go="review">' + IC.refresh + esc(tr('reviewPage')) + '</button>' +
        ' <button class="btn btn-quiet btn-sm" data-go="mistakes">' + esc(tr('mistakes')) + IC.arrowR + '</button></div>' : '') +
      '</div>';
  };
})();
