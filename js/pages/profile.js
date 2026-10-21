/* ==========================================================================
   Profil (#/profile)
   --------------------------------------------------------------------------
   Bitta joyda: ism, lavozim/maqsad, bio va BARCHA sertifikatlar:
     1) Platforma sertifikatlari — Python haftalari, IELTS, haftalik intizom
        (dushanba–yakshanba bironta kun tashlab yuborilmasa — avtomatik).
     2) Tashqi sertifikatlar — rasm sifatida biriktiriladi (IELTS, DataCamp,
        LC…), brauzerda kichraytirilib (≤1000px, JPEG) saqlanadi va bulutga
        sinxronlanadi. Holat hajmi 1 MB dan oshmasligi kerak — shuning uchun
        biriktirishdan oldin hajm tekshiriladi.
   ========================================================================== */
(function () {
  'use strict';

  var MAX_STATE = 900 * 1024;   // api/state.js chegarasi 1 MB; zaxira qoldiramiz

  function stateBytes() { try { return JSON.stringify(Store.all()).length; } catch (e) { return 0; } }

  function initials(name) {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('') || '?';
  }

  window.PageProfile = function () {
    var p = Store.profile();
    var name = Store.get('name') || '';
    var weeks = Certificate.weeks();
    var earned = weeks.filter(function (w) { return w.earned; }).length;
    var units = groupUnits();
    var unitsDone = units.filter(function (u, i) { return Certificate.unitReady(i); }).length;
    var ext = Store.certList();
    var total = unitsDone + earned + ext.length + (Eng.certReady() ? 1 : 0);
    var streak = HabitPlan.streak();

    var h = '<div class="page stagger">';

    /* --- sarlavha kartasi --- */
    h += '<section class="prof-head">' +
      '<label class="prof-avatar' + (p.photo ? ' has' : '') + '" title="' + esc(tr('profPhotoPick')) + '">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : esc(initials(name))) + '<span class="pa-edit">' + IC.upload + '</span><input type="file" id="profPhoto" accept="image/*" hidden></label>' +
      '<div class="prof-main">' +
        '<input class="prof-name" id="profName" value="' + esc(name) + '" placeholder="' + esc(tr('profNamePh')) + '" autocomplete="name">' +
        '<input class="prof-title" id="profTitle" value="' + esc(p.title || '') + '" placeholder="' + esc(tr('profTitlePh')) + '">' +
        '<textarea class="prof-bio" id="profBio" placeholder="' + esc(tr('profBioPh')) + '">' + esc(p.bio || '') + '</textarea>' +
        /* Jamg'arma — Maqsad xaritasidagi "$50K" o'lchovi (qo'lda, halol) */
        '<label class="prof-sav"><span>' + esc(tr('profSavings')) + '</span><input class="input sm" id="profSavings" type="number" min="0" step="100" value="' + (p.savings || 0) + '"><i>USD</i></label>' +
        '<div class="hint" id="profSaved">' + (p.at ? esc(tr('saved') + ' · ' + fmtDate(p.at)) : '') + '</div>' +
      '</div>' +
      '<div class="prof-stats">' +
        stat(IC.medal, total, tr('profCerts')) +
        stat(IC.flame, streak, tr('days')) +
        stat(IC.calendar, earned + '/' + weeks.length, tr('profWeeks')) +
        (window.Mastery ? stat(IC.trend, Math.round((Mastery.python().overall + Mastery.english().overall) / 2) + '%', tr('anMastery')) : '') +
      '</div></section>';

    /* Missiya va xaritadagi joy — profil shaxsiy, ijtimoiy emas */
    if (window.Recommend && window.Goal) {
      var mis = Recommend.list()[0], nx = Goal.next();
      h += '<div class="prof-mission">' +
        '<div><span class="dh-ml">' + esc(tr('dashMission')) + '</span><b>' + esc(mis ? mis.title : '—') + '</b></div>' +
        '<div><span class="dh-ml">' + esc(tr('goalNextT')) + '</span><b>' + esc(nx ? L(nx.t) + ' · ' + EngCal.fmt(nx.date) : '—') + '</b></div>' +
        '<div><span class="dh-ml">' + esc(tr('profPosition')) + '</span><b>Python ' + Store.doneCount() + '/30 · ' + esc(tr('english')) + ' ' + Store.engDoneCount() + '/144</b></div>' +
        '</div>';
    }

    /* --- 1. Haftalik intizom --- */
    h += sectionHead(1, tr('profWeekT'), tr('profWeekS'));
    h += '<div class="cert-grid">';
    if (!weeks.length) h += '<p class="hint">' + esc(tr('profWeekNone')) + '</p>';
    weeks.forEach(function (w, i) {
      var cls = w.earned ? 'ok' : w.over ? 'missed' : 'live';
      h += '<button class="cert-card ' + cls + '" data-week="' + esc(w.mon) + '"' + (w.earned ? '' : ' disabled') + '>' +
        '<span class="cc-ic">' + (w.earned ? IC.medal : w.over ? IC.lock : IC.clock) + '</span>' +
        '<span class="cc-t">' + esc(tr('profWeekN', { n: i + 1 })) + '</span>' +
        '<span class="cc-s">' + esc(EngCal.fmt(w.mon)) + ' – ' + esc(EngCal.fmt(w.sun)) + '</span>' +
        '<span class="cc-b">' + (w.earned ? esc(tr('profOpen')) : w.done + '/' + w.days + ' ' + esc(tr('days'))) + '</span>' +
        '</button>';
    });
    h += '</div>';

    /* --- 2. Kurs sertifikatlari --- */
    h += sectionHead(2, tr('profCourseT'), tr('profCourseS'));
    h += '<div class="cert-grid">';
    units.forEach(function (u, i) {
      var ok = Certificate.unitReady(i);
      var parts = splitUnit(u.name);
      var done = u.days.filter(function (d) { return Store.isDone(d.day); }).length;
      h += '<button class="cert-card ' + (ok ? 'ok' : 'live') + '" data-unit="' + i + '"' + (ok ? '' : ' disabled') + '>' +
        '<span class="cc-ic">' + (ok ? IC.medal : IC.code) + '</span>' +
        '<span class="cc-t">Python · ' + esc(parts.wk) + '</span>' +
        '<span class="cc-s">' + esc(parts.name) + '</span>' +
        '<span class="cc-b">' + (ok ? esc(tr('profOpen')) : done + '/' + u.days.length) + '</span></button>';
    });
    var ieOk = Eng.certReady();
    h += '<button class="cert-card ielts ' + (ieOk ? 'ok' : 'live') + '" data-ielts="1"' + (ieOk ? '' : ' disabled') + '>' +
      '<span class="cc-ic">' + (ieOk ? IC.medal : IC.globe) + '</span>' +
      '<span class="cc-t">IELTS 8.0 · ' + ENGLISH.meta.days + ' ' + esc(tr('days')) + '</span>' +
      '<span class="cc-s">' + esc(EngCal.fmt(ENGLISH.meta.start)) + ' – ' + esc(EngCal.fmt(ENGLISH.meta.bufferTo)) + '</span>' +
      '<span class="cc-b">' + (ieOk ? esc(tr('profOpen')) : Object.keys(Store.all().eng.done || {}).length + '/' + ENGLISH.meta.days) + '</span></button>';
    h += '</div>';

    /* --- 3. Tashqi sertifikatlar --- */
    h += sectionHead(3, tr('profExtT'), tr('profExtS'));
    h += '<div class="card"><form id="certForm" class="cert-form">' +
      '<div class="field"><label>' + esc(tr('profCertName')) + '</label><input class="input" id="cfName" required maxlength="80" placeholder="IELTS 7.5 · DataCamp · LC…"></div>' +
      '<div class="field"><label>' + esc(tr('profCertIssuer')) + '</label><input class="input" id="cfIssuer" maxlength="80" placeholder="British Council, DataCamp…"></div>' +
      '<div class="field"><label>' + esc(tr('profCertDate')) + '</label><input class="input" id="cfDate" type="date"></div>' +
      '<div class="field"><label>' + esc(tr('profCertFile')) + '</label>' + filePick('cfFile', 'image/*,.pdf', tr('filePick')) + '</div>' +
      '<div class="field cf-wide"><label>' + esc(tr('profCertUrl')) + '</label><div class="link-row"><input class="input" id="cfUrl" type="url" placeholder="https://…" autocomplete="off"><div class="link-prev" id="cfPrev" hidden></div></div><div class="hint">' + esc(tr('profCertUrlHint')) + '</div></div>' +
      '<div class="sync-actions cf-wide"><button class="btn btn-primary btn-sm" type="submit" id="cfSave">' + IC.upload + esc(tr('profAttach')) + '</button>' +
      '<span class="hint" id="cfHint">' + esc(tr('profSize', { kb: Math.round(stateBytes() / 1024), max: Math.round(MAX_STATE / 1024) })) + '</span></div></form></div>';

    if (ext.length) {
      h += '<div class="cert-grid ext">';
      ext.forEach(function (c) {
        var pv = c.img || (c.url ? previewOf(c.url) : null);
        h += '<div class="cert-card ext ok">' +
          '<button class="cc-img" data-cert="' + esc(c.id) + '">' + (pv ? '<img src="' + esc(pv) + '" alt="" loading="lazy">' : IC.doc) + (c.url ? '<span class="cc-link">' + IC.external + '</span>' : '') + '</button>' +
          '<span class="cc-t">' + esc(c.name) + '</span>' +
          '<span class="cc-s">' + esc([c.issuer, c.date].filter(Boolean).join(' · ')) + '</span>' +
          '<span class="cc-row">' + (c.url ? '<a class="btn btn-ghost btn-sm" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + IC.external + esc(tr('profOpen')) + '</a>' : '<button class="btn btn-ghost btn-sm" data-cert="' + esc(c.id) + '">' + esc(tr('profOpen')) + '</button>') +
          '<button class="btn btn-ghost btn-sm danger" data-certdel="' + esc(c.id) + '">' + esc(tr('delete')) + '</button></span></div>';
      });
      h += '</div>';
    }

    /* --- 4. Loyihalar (portfolio) --- */
    var pj = Store.pprojList();
    h += sectionHead(4, tr('profProjT'), tr('profProjS'));
    h += '<div class="card"><form id="ppForm" class="pp-form">' +
      '<div class="field"><label>' + esc(tr('profProjName')) + '</label><input class="input" id="ppName" required maxlength="80" placeholder="' + esc(tr('profProjNamePh')) + '"></div>' +
      '<div class="field"><label>' + esc(tr('profProjPrice')) + '</label><div class="pp-price"><input class="input" id="ppPrice" type="number" min="0" step="50" placeholder="500"><span>USD</span></div></div>' +
      '<div class="field pp-wide"><label>' + esc(tr('profProjDesc')) + '</label><textarea class="textarea" id="ppDesc" rows="2" maxlength="600" placeholder="' + esc(tr('profProjDescPh')) + '"></textarea></div>' +
      '<div class="field"><label>' + esc(tr('profProjImg')) + '</label>' + filePick('ppImg', 'image/*', tr('filePick')) + '</div>' +
      '<div class="field"><label>' + esc(tr('profProjImgUrl')) + '</label><div class="link-row"><input class="input" id="ppImgUrl" type="url" placeholder="https://… .jpg / Drive"><div class="link-prev" id="ppPrev" hidden></div></div></div>' +
      '<div class="field"><label>' + esc(tr('profProjVideo')) + '</label><input class="input" id="ppVideo" placeholder="youtube.com/watch?v=… / .mp4"></div>' +
      '<div class="field"><label>' + esc(tr('profProjLink')) + '</label><input class="input" id="ppLink" type="url" placeholder="github.com/… / demo"></div>' +
      '<div class="sync-actions pp-wide"><button class="btn btn-primary btn-sm" type="submit" id="ppSave">' + IC.plus + esc(tr('profProjAdd')) + '</button><span class="hint" id="ppHint"></span></div></form></div>';
    if (pj.length) {
      h += '<div class="pp-grid">' + pj.map(function (x) {
        var yt = String(x.video || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
        var cover = x.imgUrl || x.img || (yt ? 'https://i.ytimg.com/vi/' + yt[1] + '/hqdefault.jpg' : '');
        return '<div class="pp-card"><div class="pp-cover' + (cover ? '' : ' empty') + '">' + (cover ? '<img src="' + esc(cover) + '" alt="" loading="lazy">' : IC.rocket) +
          (x.video ? '<a class="pp-play" href="' + esc(x.video) + '" target="_blank" rel="noopener" title="' + esc(tr('profProjVideo')) + '">' + IC.play + '</a>' : '') + '</div>' +
          '<div class="pp-body"><div class="pp-top"><b>' + esc(x.name) + '</b>' + (x.price ? '<span class="pp-tag">$' + esc(Number(x.price).toLocaleString('en-US')) + '</span>' : '') + '</div>' +
          (x.desc ? '<p>' + esc(x.desc) + '</p>' : '') +
          '<div class="pp-row"><span class="hint">' + esc(fmtDate(x.at)) + (x.link ? ' · <a href="' + esc(x.link) + '" target="_blank" rel="noopener" class="pp-link">' + IC.external + esc(x.link.replace(/^https?:\/\/(www\.)?/, '').slice(0, 32)) + '</a>' : '') + '</span><button class="btn btn-quiet btn-sm danger" data-ppdel="' + esc(x.id) + '">' + esc(tr('delete')) + '</button></div></div></div>';
      }).join('') + '</div>';
    } else h += '<p class="hint">' + esc(tr('profProjNone')) + '</p>';

    return h + '</div>';
  };

  /* Rasmni kichraytirish (umumiy): maxSide px, JPEG q */
  function shrinkTo(file, maxSide, q) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var k = Math.min(1, maxSide / Math.max(img.width, img.height));
        var c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', q));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    });
  }

  function stat(ic, v, l) {
    return '<div class="prof-stat">' + ic + '<b>' + esc(String(v)) + '</b><span>' + esc(l) + '</span></div>';
  }
  function sectionHead(n, title, sub) {
    return '<div class="section-head"><div class="sh-n">' + n + '</div><div>' +
      '<h2>' + esc(title) + '</h2>' + (sub ? '<div class="sh-sub">' + esc(sub) + '</div>' : '') + '</div></div>';
  }

  /* Rasmni kichraytirish: eng uzun tomoni ≤ 1000px, JPEG 0.78 */
  function shrink(file) {
    return new Promise(function (resolve, reject) {
      if (file.type === 'application/pdf') { reject(new Error('pdf')); return; }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1000 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    });
  }

  window.PageProfile.mount = function () {
    /* Ism / lavozim / bio — yozib bo'lgach 600 ms da saqlanadi */
    var timer = null;
    ['profName', 'profTitle', 'profBio', 'profSavings'].forEach(function (id) {
      var el = $('#' + id);
      if (!el) return;
      el.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          Store.set('name', $('#profName').value.trim());
          Store.profileSet({ title: $('#profTitle').value.trim(), bio: $('#profBio').value, savings: Number(($('#profSavings') || {}).value) || 0 });
          var s = $('#profSaved'); if (s) s.textContent = tr('saved');
          var av = $('.prof-avatar'); if (av && !av.querySelector('img')) av.firstChild.textContent = initials($('#profName').value);
        }, 600);
      });
    });

    /* Profil rasmi — kichraytirilib (≤ 240px) holatga yoziladi, bulutga sinxron */
    var ph = $('#profPhoto');
    if (ph) ph.addEventListener('change', function () {
      var f = ph.files[0]; if (!f) return;
      shrinkTo(f, 240, 0.82).then(function (d) { Store.profileSet({ photo: d }); toast(tr('saved'), 'ok'); App.render(); }).catch(function () { toast(tr('profImgErr'), 'warn'); });
    });

    /* Havola → rasm ko'rinishi (sertifikat va loyiha) */
    function bindPreview(inputId, prevId) {
      var inp = $('#' + inputId), pv = $('#' + prevId); if (!inp || !pv) return;
      var paint = function () {
        var u = previewOf(inp.value);
        pv.hidden = !inp.value.trim();
        pv.innerHTML = u ? '<img src="' + esc(u) + '" alt="" onerror="this.parentNode.classList.add(\'bad\')">' : (inp.value.trim() ? '<span class="lp-doc">' + IC.doc + esc(tr('profOpen')) + '</span>' : '');
        pv.classList.remove('bad');
      };
      inp.addEventListener('input', paint); inp.addEventListener('change', paint);
    }
    bindPreview('cfUrl', 'cfPrev'); bindPreview('ppImgUrl', 'ppPrev');

    /* Loyihalar */
    var pf = $('#ppForm');
    if (pf) pf.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#ppName').value.trim(); if (!name) return;
      var btn = $('#ppSave'), hint = $('#ppHint'); btn.disabled = true;
      var rec = { name: name, price: Number($('#ppPrice').value) || 0, desc: $('#ppDesc').value.trim(), video: $('#ppVideo').value.trim(), link: $('#ppLink').value.trim() };
      var f = $('#ppImg').files[0];
      var imgUrl = $('#ppImgUrl').value.trim();
      if (imgUrl && !f) rec.imgUrl = previewOf(imgUrl) || imgUrl;
      var save = function () { Store.pprojSet(rec); toast(tr('profProjAdded'), 'ok'); App.render(); };
      if (!f) { save(); return; }
      var useCloud = window.MediaCloud ? MediaCloud.check() : Promise.resolve(false);
      useCloud.then(function (cloud) {
        if (cloud) return MediaCloud.upload(f).then(function (b) { rec.imgUrl = b.url; save(); });
        return shrinkTo(f, 720, 0.72).then(function (d) {
          if (stateBytes() + d.length > MAX_STATE) { hint.textContent = tr('profTooBig'); btn.disabled = false; return; }
          rec.img = d; save();
        });
      }).catch(function () { hint.textContent = tr('profImgErr'); btn.disabled = false; });
    });
    $$('[data-ppdel]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm(tr('profDelQ'))) return;
      var x = Store.pprojGet(b.dataset.ppdel); if (x && x.imgUrl && window.MediaCloud) MediaCloud.del(x.imgUrl);
      Store.pprojDel(b.dataset.ppdel); App.render();
    }); });

    /* Sertifikat kartalari */
    $$('[data-week]').forEach(function (b) { b.addEventListener('click', function () { Certificate.openWeek(b.dataset.week); }); });
    $$('[data-unit]').forEach(function (b) { b.addEventListener('click', function () { Certificate.open(Number(b.dataset.unit)); }); });
    $$('[data-ielts]').forEach(function (b) { b.addEventListener('click', function () { Certificate.openIELTS(); }); });
    $$('[data-cert]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = Store.profile().certs[b.dataset.cert];
        if (!c || c.del) return;
        if (c.img) Certificate.openImage(c);
        else if (c.url) window.open(c.url, '_blank', 'noopener');
      });
    });
    $$('[data-certdel]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!confirm(tr('profDelQ'))) return;
        Store.certDel(b.dataset.certdel);
        App.render();
      });
    });

    /* Biriktirish */
    var form = $('#certForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = $('#cfFile').files[0], url = $('#cfUrl').value.trim();
      var btn = $('#cfSave'), hint = $('#cfHint');
      if (!f && !url) { hint.textContent = tr('profCertNeed'); return; }
      if (!f) {
        /* Faqat havola: rasm bulutga yozilmaydi — ko'rinish havoladan (previewOf) */
        Store.certAdd({ name: $('#cfName').value.trim(), issuer: $('#cfIssuer').value.trim(), date: $('#cfDate').value, url: url });
        toast(tr('profAttached'), 'ok'); App.render(); return;
      }
      btn.disabled = true;
      shrink(f).then(function (dataUrl) {
        if (stateBytes() + dataUrl.length > MAX_STATE) {
          hint.textContent = tr('profTooBig'); btn.disabled = false; return;
        }
        Store.certAdd({ name: $('#cfName').value.trim(), issuer: $('#cfIssuer').value.trim(), date: $('#cfDate').value, img: dataUrl, url: url || '' });
        toast(tr('profAttached'), 'ok');
        App.render();
      }).catch(function (err) {
        hint.textContent = err.message === 'pdf' ? tr('profPdf') : tr('profImgErr');
        btn.disabled = false;
      });
    });
  };
})();
