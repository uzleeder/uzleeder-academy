/* ==========================================================================
   Movies & Videos (#/movies · #/movies/<id>) — shaxsiy kino va video kutubxonasi
   --------------------------------------------------------------------------
   Ikki tur: KINO (movie) va VIDEO (YouTube, dars, vlog…). Manba: fayl
   (mp4/webm/mkv…), to'g'ri URL yoki YouTube havolasi. Har yozuvda: nom,
   tur, davlat, yil, tavsif, davomiylik, baho, thumbnail, ko'rilgan joy.

   FAYL QAYERDA TURADI (halol):
     1) Bulut (Vercel Blob) sozlangan bo'lsa — fayl brauzerdan to'g'ridan-
        to'g'ri Blob'ga yuklanadi (katta fayl bo'laklab), URL bulutdagi
        holatga yoziladi → ISTALGAN qurilmada ochiladi.
     2) Sozlanmagan / mahalliy (file://, localhost) — fayl shu qurilmadagi
        IndexedDB'da (uzla-media). Boshqa qurilmada karta ko'rinadi, fayl yo'q.
   Metadata (sarlavha, tur, davlat, yil, baho, joy) doim bulutga sinxron.

   Pleyer: <video> (fayl → blob URL; URL → to'g'ridan), YouTube → iframe.
   Ko'rilgan joy har 5 s da saqlanadi (movies[id].pos), qaytganda davom etadi.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- IndexedDB: videos + thumbs (qurilma ombori) ---------- */
  var MediaDB = (function () {
    var dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) { rej(new Error('nodb')); return; }
        var r = indexedDB.open('uzla-media', 1);
        r.onupgradeneeded = function () { var d = r.result; d.createObjectStore('videos'); d.createObjectStore('thumbs'); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      });
      return dbp;
    }
    function tx(store, mode, fn) {
      return open().then(function (db) {
        return new Promise(function (res, rej) {
          var t = db.transaction(store, mode), st = t.objectStore(store), req = fn(st);
          t.oncomplete = function () { res(req && req.result); };
          t.onerror = function () { rej(t.error); };
        });
      });
    }
    return {
      get: function (s, id) { return tx(s, 'readonly', function (st) { return st.get(id); }); },
      set: function (s, id, blob) { return tx(s, 'readwrite', function (st) { return st.put(blob, id); }); },
      del: function (s, id) { return tx(s, 'readwrite', function (st) { return st.delete(id); }); }
    };
  })();
  window.MediaDB = MediaDB;    // o'qish matni rasmlari (books.js) ham 'thumbs' omborida: kalit 'rd:<track>:<n>:<slot>'
  var thumbCache = {};

  /* ---------- Bulut fayl ombori (Vercel Blob) — /api/media orqali ---------- */
  var Cloud = {
    available: function () { return location.protocol === 'https:'; },
    status: null,   // null — noma'lum, true/false — tekshirilgan
    check: function () {
      if (!Cloud.available()) { Cloud.status = false; return Promise.resolve(false); }
      if (Cloud.status !== null) return Promise.resolve(Cloud.status);
      return fetch('/api/media', { credentials: 'same-origin' }).then(function (r) { return r.json(); })
        .then(function (j) { Cloud.status = !!(j && j.configured); return Cloud.status; })
        .catch(function () { Cloud.status = false; return false; });
    },
    token: function (file) {
      return fetch('/api/media', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'token', pathname: file.name, size: file.size, type: file.type }) })
        .then(function (r) { if (!r.ok) throw new Error('token' + r.status); return r.json(); });
    },
    /* Yuklash: ≤ 20 MB — bitta PUT; katta — multipart (16 MB bo'laklar). onProgress(0..1) */
    upload: function (file, onProgress) {
      return Cloud.token(file).then(function (t) {
        if(t.backend==='netlify') {
          var i=0;
          function nextPart(){
            if(i>=t.parts)return fetch('/api/media',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({op:'complete',id:t.id})}).then(function(r){if(!r.ok)throw new Error('complete '+r.status);return r.json();});
            var idx=i++, chunk=file.slice(idx*t.partSize,Math.min(file.size,(idx+1)*t.partSize));
            return putXHR('/api/media?id='+t.id+'&part='+idx,chunk,{'Content-Type':'application/octet-stream'},function(p){if(onProgress)onProgress((idx+p)/t.parts);}).then(nextPart);
          }
          return nextPart();
        }
        var base = { authorization: 'Bearer ' + t.token, 'x-api-version': '11' };
        var ctype = file.type || 'application/octet-stream';
        var url = t.api + '/' + t.pathname;
        if (file.size <= 20 * 1024 * 1024) {
          return putXHR(url, file, Object.assign({ 'x-content-type': ctype, 'x-add-random-suffix': '0', 'x-cache-control-max-age': '31536000' }, base), onProgress);
        }
        var mpu = t.api + '/mpu?pathname=' + encodeURIComponent(t.pathname);
        return fetch(mpu, { method: 'POST', headers: Object.assign({ 'x-mpu-action': 'create', 'x-content-type': ctype, 'x-add-random-suffix': '0', 'x-cache-control-max-age': '31536000' }, base) })
          .then(function (r) { if (!r.ok) throw new Error('mpu-create ' + r.status); return r.json(); })
          .then(function (c) {
            var PART = 16 * 1024 * 1024, parts = [], n = Math.ceil(file.size / PART), i = 0;
            function next() {
              if (i >= n) return Promise.resolve();
              var idx = i++, chunk = file.slice(idx * PART, Math.min(file.size, (idx + 1) * PART));
              return putXHR(mpu, chunk, Object.assign({ 'x-mpu-action': 'upload', 'x-mpu-key': c.key, 'x-mpu-upload-id': c.uploadId, 'x-mpu-part-number': String(idx + 1) }, base), function (p) { if (onProgress) onProgress((idx + p) / n); }, 'POST')
                .then(function (j) { parts.push({ partNumber: idx + 1, etag: j.etag }); return next(); });
            }
            return next().then(function () {
              return fetch(mpu, { method: 'POST', headers: Object.assign({ 'x-mpu-action': 'complete', 'x-mpu-key': c.key, 'x-mpu-upload-id': c.uploadId, 'content-type': 'application/json' }, base), body: JSON.stringify(parts) })
                .then(function (r) { if (!r.ok) throw new Error('mpu-complete ' + r.status); return r.json(); });
            });
          });
      });
    },
    del: function (url) {
      return fetch('/api/media', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'delete', url: url }) }).catch(function () {});
    }
  };
  window.MediaCloud = Cloud;   // profil (rasm, loyiha muqovasi) ham shu ombordan foydalanadi

  function putXHR(url, body, headers, onProgress, method) {
    return new Promise(function (res, rej) {
      var x = new XMLHttpRequest(); x.open(method || 'PUT', url);
      Object.keys(headers).forEach(function (k) { x.setRequestHeader(k, headers[k]); });
      x.upload.onprogress = function (e) { if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total); };
      x.onload = function () { if (x.status >= 200 && x.status < 300) { try { res(JSON.parse(x.responseText)); } catch (e) { res({}); } } else rej(new Error('upload ' + x.status)); };
      x.onerror = function () { rej(new Error('network')); };
      x.send(body);
    });
  }

  /* ---------- yordamchilar ---------- */
  function ytId(u) { var m = String(u || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/); return m ? m[1] : null; }
  function fmtDur(min) { if (!min) return '—'; var h = Math.floor(min / 60), m = Math.round(min % 60); return (h ? h + ' ' + tr('hoursShort') + ' ' : '') + (m ? m + ' ' + tr('engMin') : ''); }
  function stars(r) { r = Number(r) || 0; var h = ''; for (var i = 1; i <= 10; i++) h += '<i class="' + (i <= r ? 'on' : '') + '"></i>'; return '<span class="mv-stars" title="' + r + '/10">' + h + '<b>' + (r || '—') + '</b></span>'; }
  function fmtSize(b) { return b > 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b > 1e6 ? Math.round(b / 1e6) + ' MB' : Math.round(b / 1e3) + ' KB'; }
  function typeOf(m) { return m.type === 'video' || (!m.type && m.src === 'yt') ? 'video' : 'movie'; }
  function srcTag(m) { return m.cloud ? tr('mvSrcCloud') + (m.size ? ' · ' + fmtSize(m.size) : '') : m.src === 'file' ? tr('mvSrcFile') + (m.size ? ' · ' + fmtSize(m.size) : '') : m.src === 'yt' ? 'YouTube' : 'URL'; }
  var COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Ireland', 'New Zealand', 'India', 'South Korea', 'Japan', 'France', 'Germany', 'Spain', 'Italy', 'Turkey', 'Russia', 'Uzbekistan', 'Other'];
  function yearOpts(sel) { var y = new Date().getFullYear(), h = '<option value="">—</option>'; for (var i = y + 1; i >= 1950; i--) h += '<option value="' + i + '"' + (Number(sel) === i ? ' selected' : '') + '>' + i + '</option>'; return h; }
  function countryOpts(sel) { return '<option value="">—</option>' + COUNTRIES.map(function (c) { return '<option value="' + esc(c) + '"' + (sel === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join(''); }
  function metaForm(pfx, m) {
    m = m || {};
    return '<div class="mv-row2">' +
      '<div class="field"><label>' + esc(tr('mvType')) + '</label><div class="segmented" data-mvtype="' + pfx + '"><button type="button" data-v="movie"' + (typeOf(m) === 'movie' ? ' class="on"' : '') + '>' + IC.film + esc(tr('mvTypeMovie')) + '</button><button type="button" data-v="video"' + (typeOf(m) === 'video' ? ' class="on"' : '') + '>' + IC.play + esc(tr('mvTypeVideo')) + '</button></div><input type="hidden" id="' + pfx + 'Type" value="' + esc(typeOf(m)) + '"></div>' +
      '<div class="field"><label>' + esc(tr('mvCountry')) + '</label><select class="input" id="' + pfx + 'Country">' + countryOpts(m.country || '') + '</select></div>' +
      '<div class="field"><label>' + esc(tr('mvYear')) + '</label><select class="input" id="' + pfx + 'Year">' + yearOpts(m.year) + '</select></div>' +
      '<div class="field"><label>' + esc(tr('mvDur')) + '</label><input class="input" id="' + pfx + 'Dur" type="number" min="1" max="600" placeholder="min" value="' + (m.dur || '') + '"></div>' +
      '<div class="field"><label>' + esc(tr('mvRate')) + '</label><select class="input" id="' + pfx + 'Rate">' + [0,1,2,3,4,5,6,7,8,9,10].map(function (i) { return '<option value="' + i + '"' + (i === (m.rate || 0) ? ' selected' : '') + '>' + (i || '—') + '</option>'; }).join('') + '</select></div>' +
      '</div>';
  }

  /* ---------- Kutubxona ---------- */
  window.PageMovies = function () {
    var list = Store.movieList(), q = (Store.setting('mvQ') || '').toLowerCase(), f = Store.setting('mvF') || 'all';
    var shown = list.filter(function (m) {
      if (f === 'movie' && typeOf(m) !== 'movie') return false;
      if (f === 'video' && typeOf(m) !== 'video') return false;
      if (f === 'yt' && m.src !== 'yt') return false;
      if (f === 'todo' && m.done) return false;
      if (q && ((m.title || '') + ' ' + (m.desc || '') + ' ' + (m.country || '') + ' ' + (m.year || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var totalMin = list.reduce(function (s, m) { return s + (Number(m.dur) || 0); }, 0);
    var nMovies = list.filter(function (m) { return typeOf(m) === 'movie'; }).length, nVideos = list.length - nMovies;
    var h = '<div class="page stagger mv-page">';
    h += '<header class="page-head"><div class="eyebrow">' + esc(tr('mvKick')) + '</div><h1>' + esc(tr('moviesPage')) + '</h1><p class="lede">' + esc(tr('mvLede')) + '</p></header>';
    h += '<div class="stat-grid" style="margin-bottom:16px">' +
      '<div class="stat-tile accent"><div class="st-l">' + IC.film + esc(tr('mvTypeMovie')) + '</div><div class="st-v">' + nMovies + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.play + esc(tr('mvTypeVideo')) + '</div><div class="st-v">' + nVideos + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.clock + esc(tr('mvTotal')) + '</div><div class="st-v">' + esc(fmtDur(totalMin)) + '</div></div>' +
      '<div class="stat-tile"><div class="st-l">' + IC.check + esc(tr('mvWatched')) + '</div><div class="st-v">' + list.filter(function (m) { return m.done; }).length + '</div></div></div>';

    /* Bugungi kino (intizom jadvalidan) */
    if (window.HabitPlan && HABIT.movies) {
      var cd = HabitPlan.calDayOf(Store.dateKey());
      if (cd > 0) h += '<div class="callout tip mv-today"><span class="co-ic">' + IC.film + '</span><div><h4>' + esc(tr('mvTodayT')) + '</h4>' + esc(HABIT.movies[(cd - 1) % HABIT.movies.length]) + ' — ' + esc(tr('mvTodayS')) + '</div></div>';
    }

    /* Qo'shish */
    h += '<details class="card mv-add" id="mvAdd"' + (list.length ? '' : ' open') + '><summary><span class="num">' + IC.plus + '</span>' + esc(tr('mvAddT')) + '</summary>' +
      '<div class="mv-form">' +
        '<div class="mv-src"><label class="mv-drop" id="mvDrop">' + IC.upload + '<b>' + esc(tr('mvFile')) + '</b><span id="mvFileName">' + esc(tr('mvFileS')) + '</span><input type="file" id="mvFile" accept="video/*" hidden></label>' +
          '<div class="mv-cloud" id="mvCloud"><span class="mv-cloud-dot"></span><span id="mvCloudT">' + esc(tr('mvCloudCheck')) + '</span></div>' +
          '<div class="mv-or">' + esc(tr('mvOr')) + '</div>' +
          '<div class="field"><label>' + esc(tr('mvUrl')) + '</label><input class="input" id="mvUrl" placeholder="https://… .mp4 / youtube.com/watch?v=…"></div></div>' +
        '<div class="mv-meta">' +
          '<div class="field"><label>' + esc(tr('mvTitle')) + '</label><input class="input" id="mvTitle" maxlength="120"></div>' +
          metaForm('mv', {}) +
          '<div class="field"><label>' + esc(tr('mvDesc')) + '</label><textarea class="textarea" id="mvDesc" rows="2" maxlength="1000"></textarea></div>' +
          '<div class="mv-row2"><div class="field"><label>' + esc(tr('mvThumb')) + '</label><label class="btn btn-ghost btn-sm mv-thumb-btn">' + IC.upload + '<span id="mvThumbName">' + esc(tr('mvThumbPick')) + '</span><input type="file" id="mvThumb" accept="image/*" hidden></label></div></div>' +
          '<div class="sync-actions"><button class="btn btn-primary" id="mvSave">' + IC.check + esc(tr('mvSave')) + '</button><span class="hint" id="mvStatus"></span></div>' +
          '<div class="mv-prog" id="mvProg" hidden><i></i></div>' +
        '</div></div>' +
      '<p class="hint">' + esc(tr('mvAddNote')) + '</p></details>';

    /* Filtr + qidiruv */
    h += '<div class="mv-tools"><div class="segmented">' + [['all', tr('copyAll')], ['movie', tr('mvTypeMovie')], ['video', tr('mvTypeVideo')], ['yt', 'YouTube'], ['todo', tr('mvTodo')]].map(function (x) { return '<button data-mvf="' + x[0] + '"' + (f === x[0] ? ' class="on"' : '') + '>' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<input class="input" id="mvQ" placeholder="' + esc(tr('search')) + '…" value="' + esc(Store.setting('mvQ') || '') + '"></div>';

    /* Kartalar */
    if (!list.length) h += '<div class="rv-empty">' + IC.film + '<h3>' + esc(tr('mvNone')) + '</h3><p>' + esc(tr('mvNoneS')) + '</p></div>';
    else if (!shown.length) h += '<p class="hint">' + esc(tr('mvNoMatch')) + '</p>';
    else {
      h += '<div class="mv-grid">' + shown.map(function (m) {
        var pct = m.dur && m.pos ? Math.min(100, Math.round(m.pos / 60 / m.dur * 100)) : 0;
        var meta = [m.year, m.country].filter(Boolean).join(' · ');
        return '<button class="mv-card' + (m.done ? ' done' : '') + ' t-' + typeOf(m) + '" data-go="movies/' + esc(m.id) + '">' +
          '<span class="mv-thumb" data-thumb="' + esc(m.id) + '"><span class="mv-ph">' + (typeOf(m) === 'video' ? IC.play : IC.film) + '</span>' + (m.src === 'yt' ? '<img src="https://i.ytimg.com/vi/' + esc(ytId(m.url)) + '/hqdefault.jpg" alt="">' : m.thumbUrl ? '<img src="' + esc(m.thumbUrl) + '" alt="">' : '') +
            '<span class="mv-type">' + esc(typeOf(m) === 'video' ? tr('mvTypeVideo') : tr('mvTypeMovie')) + '</span>' +
            '<span class="mv-dur">' + esc(fmtDur(m.dur)) + '</span>' + (m.done ? '<span class="mv-done">' + IC.check + '</span>' : '') + (pct ? '<i class="mv-prog-bar" style="width:' + pct + '%"></i>' : '') + '</span>' +
          '<span class="mv-body"><b>' + esc(m.title || tr('mvUntitled')) + '</b>' + (meta ? '<span class="mv-meta">' + esc(meta) + '</span>' : '') + stars(m.rate) + '<span class="mv-desc">' + esc((m.desc || '').slice(0, 100)) + '</span>' +
          '<span class="mv-src-tag' + (m.cloud ? ' cloud' : '') + '">' + (m.cloud ? IC.cloud : '') + esc(srcTag(m)) + '</span></span></button>';
      }).join('') + '</div>';
    }
    return h + '</div>';
  };

  function bindTypeSeg(pfx) {
    var seg = document.querySelector('[data-mvtype="' + pfx + '"]'); if (!seg) return;
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach(function (x) { x.classList.toggle('on', x === b); }); $('#' + pfx + 'Type').value = b.dataset.v; });
  }
  function readMeta(pfx) {
    return { type: $('#' + pfx + 'Type').value || 'movie', country: $('#' + pfx + 'Country').value, year: Number($('#' + pfx + 'Year').value) || 0, dur: Number($('#' + pfx + 'Dur').value) || 0, rate: Number($('#' + pfx + 'Rate').value) || 0 };
  }

  window.PageMovies.mount = function () {
    loadThumbs();
    var q = $('#mvQ'), qt;
    if (q) q.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { Store.setSetting('mvQ', q.value); App.render(); var q2 = $('#mvQ'); if (q2) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); } }, 350); });
    $$('[data-mvf]').forEach(function (b) { b.addEventListener('click', function () { Store.setSetting('mvF', b.dataset.mvf); App.render(); }); });
    bindTypeSeg('mv');

    /* Bulut holati */
    var cl = $('#mvCloud');
    if (cl) Cloud.check().then(function (ok) { var tEl = $('#mvCloudT'); if (!tEl || !document.body.contains(cl)) return; cl.classList.toggle('on', ok); cl.classList.toggle('off', !ok); tEl.textContent = ok ? tr('mvCloudOn') : (Cloud.available() ? tr('mvCloudOff') : tr('mvCloudLocal')); });

    var file = null, thumb = null, fIn = $('#mvFile'), tIn = $('#mvThumb'), drop = $('#mvDrop');
    if (!fIn) return;
    function pickFile(f) {
      if (!f || !/^video\//.test(f.type) && !/\.(mp4|webm|mkv|mov|avi|m4v)$/i.test(f.name)) { toast(tr('mvBadFile'), 'warn'); return; }
      file = f; $('#mvFileName').textContent = f.name + ' · ' + fmtSize(f.size);
      if (!$('#mvTitle').value) $('#mvTitle').value = f.name.replace(/\.[^.]+$/, '').replace(/[._]+/g, ' ');
      var ym = f.name.match(/\b(19|20)\d{2}\b/); if (ym && !$('#mvYear').value) $('#mvYear').value = ym[0];
      var v = document.createElement('video'); v.preload = 'metadata'; v.muted = true; v.src = URL.createObjectURL(f);
      v.onloadedmetadata = function () { if (isFinite(v.duration)) $('#mvDur').value = Math.max(1, Math.round(v.duration / 60)); try { v.currentTime = Math.min(30, v.duration / 4); } catch (e) {} };
      v.onseeked = function () {
        if (thumb) return;
        try { var c = document.createElement('canvas'); c.width = 480; c.height = Math.round(480 * v.videoHeight / v.videoWidth) || 270; c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
          c.toBlob(function (b) { if (b && !thumb) { thumb = b; $('#mvThumbName').textContent = tr('mvThumbAuto'); } }, 'image/jpeg', .8); } catch (e) {}
        URL.revokeObjectURL(v.src);
      };
    }
    fIn.addEventListener('change', function () { pickFile(fIn.files[0]); });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); pickFile(e.dataTransfer.files[0]); });
    tIn.addEventListener('change', function () { thumb = tIn.files[0] || null; $('#mvThumbName').textContent = thumb ? thumb.name : tr('mvThumbPick'); });

    $('#mvSave').addEventListener('click', function () {
      var url = $('#mvUrl').value.trim(), title = $('#mvTitle').value.trim();
      if (!file && !url) { toast(tr('mvNeedSrc'), 'warn'); return; }
      if (!title) { toast(tr('mvNeedTitle'), 'warn'); return; }
      var m = Object.assign({ title: title, desc: $('#mvDesc').value.trim(), pos: 0, done: false }, readMeta('mv'));
      var st = $('#mvStatus'), prog = $('#mvProg'), bar = prog.querySelector('i');
      $('#mvSave').disabled = true;

      /* Thumbnail: bulut bo'lsa u ham Blob'ga (kichik JPEG) — barcha qurilmada ko'rinsin */
      function saveThumb(id) {
        if (!thumb) return Promise.resolve();
        if (Cloud.status) return Cloud.upload(new File([thumb], 'thumb-' + id + '.jpg', { type: 'image/jpeg' })).then(function (b) { var mm = Store.movieGet(id); if (mm) { mm.thumbUrl = b.url; Store.movieSet(mm); } }).catch(function () { return MediaDB.set('thumbs', id, thumb); });
        return MediaDB.set('thumbs', id, thumb);
      }

      if (!file) {
        m.src = ytId(url) ? 'yt' : 'url'; m.url = url;
        var id0 = Store.movieSet(m);
        saveThumb(id0).then(function () { toast(tr('mvSaved'), 'ok'); App.render(); });
        return;
      }
      m.size = file.size; m.name = file.name; m.mime = file.type;
      Cloud.check().then(function (cloud) {
        if (cloud) {
          st.textContent = tr('mvUploading'); prog.hidden = false;
          return Cloud.upload(file, function (p) { bar.style.width = Math.round(p * 100) + '%'; st.textContent = tr('mvUploading') + ' ' + Math.round(p * 100) + '%'; })
            .then(function (b) { m.src = 'url'; m.url = b.url; m.cloud = true; var id = Store.movieSet(m); return saveThumb(id); })
            .then(function () { toast(tr('mvSavedCloud'), 'ok'); App.render(); })
            .catch(function (e) { st.textContent = tr('mvCloudErr') + ' (' + e.message + ')'; prog.hidden = true; $('#mvSave').disabled = false; });
        }
        st.textContent = tr('mvSaving');
        m.src = 'file';
        var id = Store.movieSet(m);
        return MediaDB.set('videos', id, file).then(function () { return saveThumb(id); })
          .then(function () { toast(tr('mvSaved'), 'ok'); App.render(); })
          .catch(function () { Store.movieDel(id); toast(tr('mvSaveErr'), 'warn'); $('#mvSave').disabled = false; st.textContent = ''; });
      });
    });
  };

  function loadThumbs() {
    $$('[data-thumb]').forEach(function (el) {
      var id = el.dataset.thumb;
      if (el.querySelector('img')) return;
      var paint = function (u) { var img = document.createElement('img'); img.src = u; img.alt = ''; el.insertBefore(img, el.firstChild); };
      if (thumbCache[id]) { paint(thumbCache[id]); return; }
      MediaDB.get('thumbs', id).then(function (b) { if (b) { thumbCache[id] = URL.createObjectURL(b); paint(thumbCache[id]); } }).catch(function () {});
    });
  }

  /* ---------- Pleyer ---------- */
  window.PageMovie = function (id) {
    var m = Store.movieGet(id);
    if (!m) return '<div class="page"><div class="rv-empty">' + IC.film + '<h3>' + esc(tr('mvNotFound')) + '</h3><button class="btn btn-primary btn-sm" data-go="movies">' + esc(tr('moviesPage')) + '</button></div></div>';
    var h = '<div class="page mv-play">';
    h += '<div class="lesson-nav no-print" style="margin:0 0 14px"><button class="btn btn-ghost btn-sm" data-go="movies">' + IC.arrowL + esc(tr('moviesPage')) + '</button><span></span></div>';
    h += '<div class="mv-screen" id="mvScreen">';
    if (m.src === 'yt') h += '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(ytId(m.url)) + '?rel=0" title="' + esc(m.title) + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    else h += '<video id="mvVideo" controls playsinline preload="metadata"' + (m.src === 'url' ? ' src="' + esc(m.url) + '"' : '') + '></video><div class="mv-loading" id="mvLoading">' + esc(m.src === 'file' ? tr('mvLoadingFile') : tr('mvLoadingUrl')) + '</div>';
    h += '</div>';
    var meta = [typeOf(m) === 'video' ? tr('mvTypeVideo') : tr('mvTypeMovie'), m.year, m.country].filter(Boolean).join(' · ');
    h += '<div class="mv-info"><div><h1>' + esc(m.title) + '</h1><div class="mv-meta-row"><span class="chip">' + esc(meta) + '</span>' + stars(m.rate) + '<span>' + IC.clock + esc(fmtDur(m.dur)) + '</span><span>' + (m.cloud ? IC.cloud : '') + esc(srcTag(m)) + '</span>' + (m.done ? '<span class="chip done">' + esc(tr('mvWatchedTag')) + '</span>' : '') + '</div>' +
      (m.desc ? '<p class="mv-desc-full">' + esc(m.desc) + '</p>' : '') + '</div>' +
      '<div class="mv-actions"><button class="btn btn-ghost btn-sm" data-mvdone="' + esc(id) + '">' + IC.check + esc(m.done ? tr('mvUnwatch') : tr('mvMarkWatched')) + '</button>' +
      '<button class="btn btn-ghost btn-sm" data-mvedit="' + esc(id) + '">' + IC.pen + esc(tr('edit')) + '</button>' +
      '<button class="btn btn-quiet btn-sm danger" data-mvdel="' + esc(id) + '">' + IC.close + esc(tr('delete')) + '</button></div></div>';
    /* Tahrir formasi (yopiq) */
    h += '<div class="card mv-edit" id="mvEdit" hidden><div class="field"><label>' + esc(tr('mvTitle')) + '</label><input class="input" id="meTitle" value="' + esc(m.title) + '"></div>' +
      metaForm('me', m) +
      '<div class="field"><label>' + esc(tr('mvDesc')) + '</label><textarea class="textarea" id="meDesc" rows="3">' + esc(m.desc || '') + '</textarea></div>' +
      '<div class="mv-row2"><div class="field"><label>' + esc(tr('mvThumb')) + '</label><label class="btn btn-ghost btn-sm mv-thumb-btn">' + IC.upload + '<span id="meThumbName">' + esc(tr('mvThumbPick')) + '</span><input type="file" id="meThumb" accept="image/*" hidden></label></div>' +
      (m.src !== 'yt' ? '<div class="field"><label>' + esc(tr('mvFile')) + '</label><label class="btn btn-ghost btn-sm mv-thumb-btn">' + IC.upload + '<span id="meFileName">' + esc(tr('mvReupload')) + '</span><input type="file" id="meFile" accept="video/*" hidden></label></div>' : '') + '</div>' +
      '<div class="sync-actions"><button class="btn btn-primary btn-sm" id="meSave">' + IC.check + esc(tr('save')) + '</button><span class="hint" id="meStatus"></span></div></div>';
    return h + '</div>';
  };

  window.PageMovie.mount = function (id) {
    var m = Store.movieGet(id); if (!m) return;
    var v = $('#mvVideo'), ld = $('#mvLoading');
    if (v) {
      var ready = function () {
        if (ld) ld.remove();
        if (m.pos > 5 && (!v.duration || m.pos < v.duration - 10)) { try { v.currentTime = m.pos; } catch (e) {} toast(tr('mvResumed', { t: Math.floor(m.pos / 60) + ':' + ('0' + Math.floor(m.pos % 60)).slice(-2) }), 'ok'); }
      };
      if (m.src === 'file') {
        MediaDB.get('videos', id).then(function (blob) {
          if (!blob) { if (ld) ld.innerHTML = '<span class="red">' + esc(tr('mvFileMissing')) + '</span>'; return; }
          v.src = URL.createObjectURL(blob); v.addEventListener('loadedmetadata', ready, { once: true });
        }).catch(function () { if (ld) ld.textContent = tr('mvFileMissing'); });
      } else v.addEventListener('loadedmetadata', ready, { once: true });
      v.addEventListener('error', function () { if (ld && ld.parentNode) ld.innerHTML = '<span class="red">' + esc(m.src === 'file' ? tr('mvFileErr') : tr('mvUrlErr')) + '</span>'; }, { once: true });
      var last = 0;
      v.addEventListener('timeupdate', function () {
        var now = Date.now(); if (now - last < 5000) return; last = now;
        var mm = Store.movieGet(id); if (!mm) return; mm.pos = Math.floor(v.currentTime);
        if (v.duration && v.currentTime > v.duration * .92 && !mm.done) { mm.done = true; toast(tr('mvAutoDone'), 'ok'); }
        Store.movieSet(mm);
      });
      v.addEventListener('pause', function () { var mm = Store.movieGet(id); if (mm) { mm.pos = Math.floor(v.currentTime); Store.movieSet(mm); } });
    }
    bindTypeSeg('me');
    $$('[data-mvdone]').forEach(function (b) { b.addEventListener('click', function () { var mm = Store.movieGet(id); mm.done = !mm.done; Store.movieSet(mm); App.render(); }); });
    $$('[data-mvdel]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm(tr('mvDelQ'))) return;
      var mm = Store.movieGet(id);
      if (mm && mm.cloud && mm.url) Cloud.del(mm.url);
      if (mm && mm.thumbUrl) Cloud.del(mm.thumbUrl);
      Store.movieDel(id); MediaDB.del('videos', id).catch(function () {}); MediaDB.del('thumbs', id).catch(function () {}); App.go('movies');
    }); });
    $$('[data-mvedit]').forEach(function (b) { b.addEventListener('click', function () { var e = $('#mvEdit'); e.hidden = !e.hidden; if (!e.hidden) $('#meTitle').focus(); }); });
    var th = null, tIn = $('#meThumb'); if (tIn) tIn.addEventListener('change', function () { th = tIn.files[0] || null; $('#meThumbName').textContent = th ? th.name : tr('mvThumbPick'); });
    var nf = null, fIn2 = $('#meFile'); if (fIn2) fIn2.addEventListener('change', function () { nf = fIn2.files[0] || null; $('#meFileName').textContent = nf ? nf.name + ' · ' + fmtSize(nf.size) : tr('mvReupload'); });
    var sv = $('#meSave'); if (sv) sv.addEventListener('click', function () {
      var mm = Store.movieGet(id); var meta = readMeta('me');
      mm.title = $('#meTitle').value.trim() || mm.title; mm.desc = $('#meDesc').value.trim();
      mm.type = meta.type; mm.country = meta.country; mm.year = meta.year; mm.dur = meta.dur || mm.dur; mm.rate = meta.rate;
      Store.movieSet(mm);
      var st = $('#meStatus'); sv.disabled = true;
      var jobs = [];
      if (th) jobs.push(Cloud.check().then(function (c) { if (c) return Cloud.upload(new File([th], 'thumb-' + id + '.jpg', { type: th.type || 'image/jpeg' })).then(function (b) { var x = Store.movieGet(id); x.thumbUrl = b.url; Store.movieSet(x); }); return MediaDB.set('thumbs', id, th).then(function () { delete thumbCache[id]; }); }));
      if (nf) jobs.push(Cloud.check().then(function (c) {
        if (c) { st.textContent = tr('mvUploading'); return Cloud.upload(nf, function (p) { st.textContent = tr('mvUploading') + ' ' + Math.round(p * 100) + '%'; }).then(function (b) { var x = Store.movieGet(id); if (x.cloud && x.url) Cloud.del(x.url); x.src = 'url'; x.url = b.url; x.cloud = true; x.size = nf.size; x.name = nf.name; x.pos = 0; Store.movieSet(x); }); }
        var x = Store.movieGet(id); x.src = 'file'; x.size = nf.size; x.name = nf.name; delete x.url; x.cloud = false; Store.movieSet(x);
        return MediaDB.set('videos', id, nf);
      }));
      Promise.all(jobs).then(function () { toast(tr('saved'), 'ok'); App.render(); }).catch(function (e) { toast(tr('mvSaveErr') + ' ' + e.message, 'warn'); sv.disabled = false; });
    });
  };
})();
