/* ==========================================================================
   Settings & Personal Data Vault
   --------------------------------------------------------------------------
   Brief 4H va 8-bo'lim. Profil · Ko'rinish · Missiya · Ma'lumot · Zaxira ·
   Xavfsizlik.

   Bu sahifaning asosiy vazifasi — o'quvchiga O'Z ma'lumoti ustidan
   to'liq nazorat berish: qayerda turibdi, qancha joy egallaydi, qanday
   olib ketiladi, qanday qaytariladi.
   ========================================================================== */
(function () {
  'use strict';

  var OS = window.OS = window.OS || {};
  OS.pages = OS.pages || {};

  function sh() { return OS.shell; }
  function L(o) { return OS.shell.L(o); }
  function esc(s) { return OS.shell.esc(s); }

  var dbInfo = null;      // asinxron o'qiladi, keyin qayta chiziladi
  var importPreview = null;

  function bytes(n) {
    if (!n) return '0 B';
    var u = ['B', 'KB', 'MB', 'GB'], i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (Math.round(n * 10) / 10) + ' ' + u[i];
  }

  /* ---------- 1. PROFIL ------------------------------------------------ */
  function viewProfile() {
    var st = window.Store;
    var p = st && st.profile ? st.profile() : {};
    var name = st ? st.get('name') : '';
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Shaxsiy profil', en: 'Personal profile' })) + '</h2>' +
        '<label style="display:block;font-size:12px;color:var(--muted);margin-bottom:5px">' +
          esc(L({ uz: 'Ism', en: 'Name' })) + '</label>' +
        '<input id="vName" type="text" value="' + esc(name || '') + '" ' +
          'style="width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13.5px;margin-bottom:12px">' +
        '<label style="display:block;font-size:12px;color:var(--muted);margin-bottom:5px">' +
          esc(L({ uz: 'Lavozim yoki maqsad', en: 'Title or goal' })) + '</label>' +
        '<input id="vTitle" type="text" value="' + esc(p.title || '') + '" ' +
          'style="width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13.5px;margin-bottom:12px">' +
        '<button class="os-btn primary" id="vSaveProfile">' + esc(L({ uz: 'Saqlash', en: 'Save' })) + '</button>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Til', en: 'Language' })) + '</h2>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="os-btn' + (st && st.get('lang') === 'uz' ? ' primary' : '') + '" data-lang-set="uz">Oʻzbekcha</button>' +
          '<button class="os-btn' + (st && st.get('lang') === 'en' ? ' primary' : '') + '" data-lang-set="en">English</button>' +
        '</div>' +
        '<div style="margin-top:18px"><button class="os-btn ghost" data-go="classic/profile">' +
          esc(L({ uz: 'Toʻliq profil sahifasi', en: 'Full profile page' })) + '</button></div>' +
      '</section>' +
      '</div>';
  }

  /* ---------- 2. KO'RINISH --------------------------------------------- */
  function viewLook() {
    var cur = window.Store ? Store.get('theme') : 'os';
    var themes = (window.App && App.THEMES) || [];
    return '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Mavzu', en: 'Theme' })) + '</h2>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
        esc(L({ uz: 'Personal OS — yangi standart. Eski Bold Red saqlanib qoldi.',
                en: 'Personal OS is the new default. The old Bold Red is preserved.' })) + '</p>' +
      '<div class="os-grid c4">' + themes.map(function (t) {
        var isOS = t.id === 'os' || t.id === 'os-light';
        return '<button class="os-card pad-sm" data-theme-set="' + t.id + '"' +
          (t.id === cur ? ' style="border-color:var(--brand)"' : '') + '>' +
          '<div style="display:flex;gap:6px;margin-bottom:8px">' +
            '<i style="width:22px;height:22px;border-radius:6px;background:' + t.sw[0] + ';border:1px solid var(--line);display:block"></i>' +
            '<i style="width:22px;height:22px;border-radius:6px;background:' + t.sw[1] + ';display:block"></i>' +
          '</div>' +
          '<b style="font-size:13px">' + esc(t.id) + '</b>' +
          (isOS ? '<div style="font-size:11px;color:var(--brand);margin-top:3px">Personal OS</div>' : '') +
          (t.id === cur ? '<div style="font-size:11px;color:var(--muted);margin-top:3px">' + esc(L({ uz: 'tanlangan', en: 'selected' })) + '</div>' : '') +
          '</button>';
      }).join('') + '</div></section>';
  }

  /* ---------- 3. MISSIYA ------------------------------------------------ */
  function viewMission() {
    var c = OS.CFG;
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Kalendar', en: 'Calendar' })) + '</h2>' +
        '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Bu sanalar YAGONA manbada (js/os/config.js). Boshqa modullar ularni oʻzida saqlamaydi.',
                  en: 'These dates live in one place (js/os/config.js). No other module keeps its own copy.' })) + '</p>' +
        '<div class="os-table-wrap"><table class="os-table"><tbody>' +
          c.mission.phases.map(function (p) {
            return '<tr><td data-l="' + esc(L({ uz: 'Bosqich', en: 'Phase' })) + '"><b>' + esc(L(p.title)) + '</b></td>' +
              '<td data-l="' + esc(L({ uz: 'Sana', en: 'Dates' })) + '">' + esc(p.from) + ' → ' + esc(p.to) + '</td></tr>';
          }).join('') +
          '<tr><td data-l="' + esc(L({ uz: 'Imtihon', en: 'Exam' })) + '"><b>IELTS Academic</b></td>' +
          '<td data-l="' + esc(L({ uz: 'Sana', en: 'Date' })) + '" style="color:var(--gold)">' + esc(c.mission.exam) + '</td></tr>' +
        '</tbody></table></div>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Maqsad', en: 'Target' })) + '</h2>' +
        '<label style="display:block;font-size:12px;color:var(--muted);margin-bottom:5px">' +
          esc(L({ uz: 'Umumiy ball', en: 'Overall band' })) + '</label>' +
        '<input id="vTarget" type="number" step="0.5" min="4" max="9" value="' + c.target.overall + '" ' +
          'style="width:110px;padding:9px 12px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:14px">' +
        '<div style="margin-top:14px">' +
          Object.keys(c.target.skills).map(function (k) {
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line-soft)">' +
              '<span style="font-size:13px">' + esc(L(c.skills[k].t)) + '</span>' +
              '<input type="number" step="0.5" min="4" max="9" value="' + c.target.skills[k] + '" data-goal="' + k + '" ' +
              'style="width:72px;padding:5px 8px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface);color:var(--ink);font:inherit;font-size:13px"></div>';
          }).join('') +
        '</div>' +
        '<div class="os-note warn" style="margin-top:14px">' + sh().icon('alert') + '<div>' +
          esc(L({ uz: 'Ball kafolatlanmaydi — bu maqsad, vaʻda emas.', en: 'No score is guaranteed — this is a target, not a promise.' })) +
        '</div></div>' +
      '</section>' +
      '</div>';
  }

  /* ---------- 4. MA'LUMOT ----------------------------------------------- */
  function viewData() {
    var st = window.Store;
    var lsBytes = st && st.bytes ? st.bytes() : 0;
    var mig = OS.migrate ? OS.migrate.status() : null;
    var counts = OS.backup ? OS.backup.recordCounts(st ? st.all() : {}) : {};

    var html = '<div class="os-grid c4" style="margin-bottom:var(--sp-4)">' +
      sh().stat(L({ uz: 'localStorage', en: 'localStorage' }), bytes(lsBytes), L({ uz: 'asosiy holat', en: 'main state' })) +
      sh().stat(L({ uz: 'IndexedDB', en: 'IndexedDB' }),
        dbInfo ? bytes(dbInfo.usage) : '…',
        dbInfo && dbInfo.quota ? L({ uz: 'chegaradan', en: 'of' }) + ' ' + bytes(dbInfo.quota) : null) +
      sh().stat(L({ uz: 'Doimiy xotira', en: 'Persistent storage' }),
        dbInfo ? (dbInfo.persisted ? L({ uz: 'ha', en: 'yes' }) : L({ uz: 'yoʻq', en: 'no' })) : '…',
        dbInfo && !dbInfo.persisted ? L({ uz: 'soʻrash mumkin', en: 'can be requested' }) : null,
        dbInfo && dbInfo.persisted ? '' : 'gold') +
      sh().stat(L({ uz: 'Koʻchirish', en: 'Migration' }),
        mig && mig.ok ? L({ uz: 'bajarilgan', en: 'done' }) : L({ uz: 'bajarilmagan', en: 'not run' }),
        mig && mig.at ? new Date(mig.at).toISOString().slice(0, 10) : null) +
      '</div>';

    html += '<div class="os-grid c2">';

    /* Yozuvlar soni */
    html += '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Yozuvlar', en: 'Records' })) + '</h2>' +
      '<div class="os-table-wrap"><table class="os-table"><tbody>' +
      Object.keys(counts).map(function (k) {
        return '<tr><td data-l="' + esc(k) + '">' + esc(k) + '</td>' +
          '<td data-l="n" style="text-align:right;font-family:var(--font-mono)">' + counts[k] + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      (dbInfo && dbInfo.counts ? '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'IndexedDB omborlarida', en: 'In IndexedDB stores' })) + ': ' +
        Object.keys(dbInfo.counts).reduce(function (a, k) { return a + Math.max(0, dbInfo.counts[k]); }, 0) +
        '</p>' : '') +
      '</section>';

    /* Mahalliylik va ko'chirish */
    html += '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Mahalliy saqlash', en: 'Local-first storage' })) + '</h2>' +
      '<div class="os-note ok">' + sh().icon('check') + '<div>' +
        esc(L({ uz: 'Avtomatik bulut sinxroni OʻCHIQ. Shaxsiy oʻquv yozuvlari shu qurilmada qoladi.',
                en: 'Automatic cloud sync is OFF. Personal learning records stay on this device.' })) +
      '</div></div>' +
      '<p style="margin:12px 0;color:var(--muted);font-size:13px">' +
        esc(L({ uz: 'Brauzer xotirasi doimiy emas. Doimiylikni soʻrang va muntazam zaxira oling.',
                en: 'Browser storage is not permanent. Request persistence and take regular backups.' })) + '</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="os-btn" id="vPersist">' + esc(L({ uz: 'Doimiylik soʻrash', en: 'Request persistence' })) + '</button>' +
        '<button class="os-btn" id="vMigrate">' + esc(L({ uz: 'IndexedDB ga koʻchirish', en: 'Migrate to IndexedDB' })) + '</button>' +
      '</div>' +
      '<div id="vMigrateOut" style="margin-top:12px"></div>' +
      '</section>';

    html += '</div>';
    return html;
  }

  /* ---------- 5. ZAXIRA -------------------------------------------------- */
  function viewBackup() {
    var backups = OS.migrate ? OS.migrate.listBackups() : [];
    var html = '<div class="os-grid c2">';

    html += '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Zaxira olish', en: 'Export' })) + '</h2>' +
      '<p style="margin:0 0 14px;color:var(--muted);font-size:13px">' +
        esc(L({ uz: 'Ikki xil: JSON — tuzilgan maʼlumot; ZIP — maʼlumot + manifest + shaxsiy fayllar.',
                en: 'Two kinds: JSON for structured data; ZIP for data, manifest and your own files.' })) + '</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="os-btn primary" id="vExportJSON">' + esc(L({ uz: 'JSON yuklab olish', en: 'Download JSON' })) + '</button>' +
        '<button class="os-btn" id="vExportZIP">' + esc(L({ uz: 'ZIP yuklab olish', en: 'Download ZIP' })) + '</button>' +
      '</div>' +
      '<div class="os-note info" style="margin-top:14px">' + sh().icon('lock') + '<div>' +
        esc(L({ uz: 'Zaxirada parol, cookie yoki sessiya YOʻQ. U bilan hisobga kirib boʻlmaydi.',
                en: 'A backup contains no password, cookie or session. It cannot be used to sign in.' })) +
      '</div></div>' +
      '</section>';

    html += '<section class="os-card">' +
      '<h2>' + esc(L({ uz: 'Qaytarish', en: 'Import' })) + '</h2>' +
      '<p style="margin:0 0 12px;color:var(--muted);font-size:13px">' +
        esc(L({ uz: 'Avval tekshiriladi va koʻrsatiladi. Siz tasdiqlamaguncha hech narsa oʻzgarmaydi.',
                en: 'It is validated and previewed first. Nothing changes until you confirm.' })) + '</p>' +
      '<input type="file" id="vImportFile" accept="application/json,.json" ' +
        'style="width:100%;padding:9px;border:1px dashed var(--line);border-radius:var(--r-md);background:var(--surface);color:var(--ink);font:inherit;font-size:13px">' +
      '<div id="vImportOut" style="margin-top:12px">' + (importPreview ? previewHTML(importPreview) : '') + '</div>' +
      '</section>';

    html += '</div>';

    if (backups.length) {
      html += '<section class="os-card" style="margin-top:var(--sp-4)">' +
        '<h2>' + esc(L({ uz: 'Avtomatik zaxiralar (shu qurilmada)', en: 'Automatic backups (on this device)' })) + '</h2>' +
        backups.map(function (b) {
          return '<div class="os-row"><span class="os-row-main"><b>' + esc(b.key) + '</b>' +
            '<span>' + bytes(b.bytes) + '</span></span></div>';
        }).join('') +
        '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
        esc(L({ uz: 'Sxema almashganda va koʻchirishdan oldin avtomatik olinadi.',
                en: 'Taken automatically before a schema change or a migration.' })) + '</p>' +
        '</section>';
    }

    return html;
  }

  function previewHTML(p) {
    if (!p.ok) {
      return '<div class="os-note err">' + sh().icon('alert') + '<div>' +
        esc(L({ uz: 'Fayl oʻqilmadi', en: 'The file could not be read' })) + ': ' + esc(p.reason) + '</div></div>';
    }
    var rows = Object.keys(p.incoming).map(function (k) {
      var mine = p.current[k] || 0, theirs = p.incoming[k] || 0;
      return '<tr><td data-l="' + esc(k) + '">' + esc(k) + '</td>' +
        '<td data-l="' + esc(L({ uz: 'Hozir', en: 'Now' })) + '" style="text-align:right;font-family:var(--font-mono)">' + mine + '</td>' +
        '<td data-l="' + esc(L({ uz: 'Faylda', en: 'In file' })) + '" style="text-align:right;font-family:var(--font-mono)">' + theirs + '</td></tr>';
    }).join('');

    var dup = Object.keys(p.duplicates).filter(function (k) { return p.duplicates[k]; });

    return '<div class="os-note' + (p.checksumOk === false ? ' warn' : ' info') + '">' + sh().icon('bulb') + '<div>' +
        esc(L({ uz: 'Format', en: 'Format' })) + ': ' + esc(p.format) + ' · ' +
        esc(L({ uz: 'sxema', en: 'schema' })) + ': ' + p.schema +
        (p.exportedAt ? ' · ' + esc(p.exportedAt.slice(0, 10)) : '') +
        (p.checksumOk === false ? ' · <b>' + esc(L({ uz: 'nazorat yigʼindisi mos emas', en: 'checksum mismatch' })) + '</b>' : '') +
      '</div></div>' +
      '<div class="os-table-wrap" style="margin-top:10px"><table class="os-table"><thead><tr>' +
        '<th>' + esc(L({ uz: 'Yozuv', en: 'Record' })) + '</th>' +
        '<th style="text-align:right">' + esc(L({ uz: 'Hozir', en: 'Now' })) + '</th>' +
        '<th style="text-align:right">' + esc(L({ uz: 'Faylda', en: 'In file' })) + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      (dup.length ? '<p style="margin:10px 0 0;font-size:12.5px;color:var(--muted)">' +
        esc(L({ uz: 'Dublikat', en: 'Duplicates' })) + ': ' + dup.map(function (k) { return k + ' ' + p.duplicates[k]; }).join(' · ') + '</p>' : '') +
      (p.conflicts.length ? '<p style="margin:6px 0 0;font-size:12.5px;color:var(--gold)">' +
        esc(L({ uz: 'Toʻqnashuv', en: 'Conflicts' })) + ': ' + p.conflicts.length + '</p>' : '') +
      (p.secretsFound.length ? '<p style="margin:6px 0 0;font-size:12.5px;color:var(--red)">' +
        esc(L({ uz: 'Sir maydonlari topildi va import qilinmaydi', en: 'Secret-like fields found and will not be imported' })) +
        ': ' + esc(p.secretsFound.slice(0, 5).join(', ')) + '</p>' : '') +
      '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">' +
        '<button class="os-btn primary" id="vImportMerge">' + esc(L({ uz: 'Birlashtirish (xavfsiz)', en: 'Merge (safe)' })) + '</button>' +
        '<button class="os-btn danger" id="vImportReplace">' + esc(L({ uz: 'Toʻliq almashtirish', en: 'Replace everything' })) + '</button>' +
      '</div>';
  }

  /* ---------- 6. XAVFSIZLIK --------------------------------------------- */
  function viewSecurity() {
    var syncOn = window.Sync && Sync.autoEnabled ? Sync.autoEnabled() : false;
    return '<div class="os-grid c2">' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Bulut sinxroni', en: 'Cloud synchronisation' })) + '</h2>' +
        '<div class="os-note ' + (syncOn ? 'warn' : 'ok') + '">' + sh().icon(syncOn ? 'alert' : 'check') + '<div>' +
          esc(syncOn
            ? L({ uz: 'Avtomatik sinxron YONIQ', en: 'Automatic sync is ON' })
            : L({ uz: 'Avtomatik sinxron OʻCHIQ — shaxsiy progress yuborilmaydi',
                  en: 'Automatic sync is OFF — personal progress is not uploaded' })) +
        '</div></div>' +
        '<p style="margin:12px 0;color:var(--muted);font-size:13px">' +
          esc(L({ uz: 'Avval ilova har oʻzgarishdan 1.5 soniya keyin BUTUN holatni /api/state ga yuborardi — testlar, eslatmalar, xatolar, faollik jurnali. Endi bu oʻchirilgan.',
                  en: 'The app used to send the entire state to /api/state 1.5 s after every change — quizzes, notes, mistakes, activity log. That is now off.' })) + '</p>' +
        '<button class="os-btn" id="vCloudImport">' +
          esc(L({ uz: 'Bulutdagi nusxani bir marta olish', en: 'Import the cloud copy once' })) + '</button>' +
        '<div id="vCloudOut" style="margin-top:10px"></div>' +
      '</section>' +
      '<section class="os-card">' +
        '<h2>' + esc(L({ uz: 'Hisob xavfsizligi', en: 'Account security' })) + '</h2>' +
        '<div class="os-table-wrap"><table class="os-table"><tbody>' +
          '<tr><td data-l="x">' + esc(L({ uz: 'Parol', en: 'Password' })) + '</td><td data-l="y">PBKDF2-SHA256 · 210 000</td></tr>' +
          '<tr><td data-l="x">' + esc(L({ uz: 'Sessiya', en: 'Session' })) + '</td><td data-l="y">HMAC-SHA256 · HttpOnly cookie</td></tr>' +
          '<tr><td data-l="x">' + esc(L({ uz: 'Muddat', en: 'Expiry' })) + '</td><td data-l="y">SESSION_DAYS (90)</td></tr>' +
          '<tr><td data-l="x">' + esc(L({ uz: 'Darvoza', en: 'Gate' })) + '</td><td data-l="y">Edge middleware · Vercel + Netlify</td></tr>' +
        '</tbody></table></div>' +
        '<p style="margin:12px 0 0;font-size:12px;color:var(--faint)">' +
          esc(L({ uz: 'Parol va token brauzerga berilmaydi. Zaxira fayllarida ham yoʻq.',
                  en: 'Passwords and tokens are never exposed to the browser, and never appear in backups.' })) + '</p>' +
        '<div style="margin-top:14px"><button class="os-btn ghost" data-go="classic/profile">' +
          esc(L({ uz: 'Parolni almashtirish', en: 'Change password' })) + '</button></div>' +
      '</section>' +
      '</div>';
  }

  /* ---------- sahifa ---------------------------------------------------- */

  function render(tab) {
    tab = tab || 'profile';
    var dest = OS.NAV.destOf('vault');
    var body =
        tab === 'look'     ? viewLook()
      : tab === 'mission'  ? viewMission()
      : tab === 'data'     ? viewData()
      : tab === 'backup'   ? viewBackup()
      : tab === 'security' ? viewSecurity()
      : viewProfile();
    return '<div class="page os-page">' +
      sh().head(L(dest.t), L(dest.d)) +
      sh().tabs('vault', dest.tabs, tab) +
      body + '</div>';
  }

  function mount(tab) {
    var $ = function (id) { return document.getElementById(id); };

    /* Profil */
    if ($('vSaveProfile')) {
      $('vSaveProfile').addEventListener('click', function () {
        Store.set('name', ($('vName').value || '').trim());
        if (Store.profileSet) Store.profileSet({ title: ($('vTitle').value || '').trim() });
        if (window.toast) toast(L({ uz: 'Saqlandi', en: 'Saved' }), 'ok');
        App.render();
      });
    }

    /* Mavzu */
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-set]'), function (b) {
      b.addEventListener('click', function () {
        Store.set('theme', b.dataset.themeSet);
        App.applyTheme();
        App.render();
      });
    });

    /* Maqsad */
    if ($('vTarget')) {
      $('vTarget').addEventListener('change', function () {
        var v = parseFloat($('vTarget').value);
        if (isNaN(v)) return;
        OS.CFG.target.overall = v;
        Store.setSetting('osTargetOverall', v);
        if (window.toast) toast(L({ uz: 'Maqsad yangilandi', en: 'Target updated' }), 'ok');
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-goal]'), function (inp) {
      inp.addEventListener('change', function () {
        var v = parseFloat(inp.value);
        if (isNaN(v)) return;
        OS.CFG.target.skills[inp.dataset.goal] = v;
        var cur = Store.setting('osTarget') || {};
        cur[inp.dataset.goal] = v;
        Store.setSetting('osTarget', cur);
      });
    });

    /* Ma'lumot: hajm va ko'chirish */
    if (tab === 'data') {
      if (!dbInfo && OS.db && OS.db.supported()) {
        Promise.all([OS.db.usage(), OS.db.persisted(), OS.db.counts()]).then(function (r) {
          dbInfo = { usage: r[0].usage, quota: r[0].quota, persisted: r[1], counts: r[2] };
          if (location.hash.indexOf('vault') >= 0) App.render();
        }).catch(function () { dbInfo = { usage: 0, quota: 0, persisted: false, counts: {} }; });
      }
      if ($('vPersist')) {
        $('vPersist').addEventListener('click', function () {
          OS.db.persist().then(function (ok) {
            toast(ok ? L({ uz: 'Doimiy xotira berildi', en: 'Persistent storage granted' })
                     : L({ uz: 'Brauzer rad etdi', en: 'The browser declined' }), ok ? 'ok' : 'warn');
            dbInfo = null; App.render();
          });
        });
      }
      if ($('vMigrate')) {
        $('vMigrate').addEventListener('click', function () {
          var out = $('vMigrateOut');
          out.innerHTML = '<div class="os-note info">' + sh().icon('refresh') + '<div>' +
            esc(L({ uz: 'Koʻchirilmoqda…', en: 'Migrating…' })) + '</div></div>';
          OS.migrate.run().then(function (r) {
            if (r.ok) {
              out.innerHTML = '<div class="os-note ok">' + sh().icon('check') + '<div><b>' +
                esc(L({ uz: 'Koʻchirildi va tekshirildi', en: 'Migrated and verified' })) + '</b><br>' +
                Object.keys(r.dbCounts || {}).filter(function (k) { return r.dbCounts[k] > 0; })
                  .map(function (k) { return esc(k) + ': ' + r.dbCounts[k]; }).join(' · ') +
                '<br><span style="color:var(--faint)">' + esc(L({ uz: 'Zaxira', en: 'Backup' })) + ': ' + esc(r.backup || '—') +
                ' · ' + esc(L({ uz: 'asl holat oʻchirilmadi', en: 'the original state was not deleted' })) + '</span></div></div>';
            } else {
              out.innerHTML = '<div class="os-note err">' + sh().icon('alert') + '<div><b>' +
                esc(L({ uz: 'Koʻchirish tasdiqlanmadi', en: 'Migration not confirmed' })) + '</b><br>' +
                esc((r.problems || [r.reason]).slice(0, 6).join(' · ')) + '</div></div>';
            }
          });
        });
      }
    }

    /* Zaxira */
    if ($('vExportJSON')) {
      $('vExportJSON').addEventListener('click', function () {
        var doc = OS.backup.exportJSON();
        toast(L({ uz: 'JSON yuklab olindi', en: 'JSON downloaded' }) + ' · ' + doc.checksum, 'ok');
      });
    }
    if ($('vExportZIP')) {
      $('vExportZIP').addEventListener('click', function () {
        OS.backup.exportZIP().then(function (r) {
          toast(L({ uz: 'ZIP yuklab olindi', en: 'ZIP downloaded' }) + ' · ' + r.files + ' ' +
            L({ uz: 'fayl', en: 'files' }), 'ok');
        }).catch(function (e) { toast(String(e.message || e), 'warn'); });
      });
    }
    if ($('vImportFile')) {
      $('vImportFile').addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          importPreview = OS.backup.inspect(String(fr.result));
          $('vImportOut').innerHTML = previewHTML(importPreview);
          bindImportButtons();
        };
        fr.readAsText(f);
      });
      bindImportButtons();
    }

    function bindImportButtons() {
      ['vImportMerge', 'vImportReplace'].forEach(function (id) {
        var b = $(id);
        if (!b || !importPreview || !importPreview.ok) return;
        b.addEventListener('click', function () {
          var strategy = id === 'vImportReplace' ? 'replace' : 'merge';
          if (strategy === 'replace' && !window.confirm(L({
            uz: 'Butun mahalliy progress fayldagi bilan almashtiriladi. Davom etilsinmi?',
            en: 'All local progress will be replaced by the file. Continue?'
          }))) return;
          var r = OS.backup.apply(JSON.stringify(importPreview.state), strategy);
          if (r.ok) {
            importPreview = null;
            toast(L({ uz: 'Qaytarildi', en: 'Imported' }) + ' · ' + strategy, 'ok');
            App.render();
          } else {
            toast(L({ uz: 'Xato', en: 'Failed' }) + ': ' + r.reason + (r.rolledBack ? ' · ' + L({ uz: 'orqaga qaytarildi', en: 'rolled back' }) : ''), 'warn');
          }
        });
      });
    }

    /* Bulutdan bir martalik import */
    if ($('vCloudImport')) {
      $('vCloudImport').addEventListener('click', function () {
        var out = $('vCloudOut');
        if (!window.Sync || !Sync.importOnce) {
          out.innerHTML = '<div class="os-note warn">' + sh().icon('alert') + '<div>' +
            esc(L({ uz: 'Bulut faqat saytda ishlaydi', en: 'The cloud copy is only available on the hosted site' })) + '</div></div>';
          return;
        }
        out.innerHTML = '<div class="os-note info">' + sh().icon('cloud') + '<div>' +
          esc(L({ uz: 'Soʻralmoqda…', en: 'Requesting…' })) + '</div></div>';
        Sync.importOnce().then(function (r) {
          out.innerHTML = '<div class="os-note ' + (r.ok ? 'ok' : 'warn') + '">' + sh().icon(r.ok ? 'check' : 'alert') +
            '<div>' + esc(r.ok
              ? L({ uz: 'Bulutdagi nusxa birlashtirildi', en: 'The cloud copy was merged' })
              : L({ uz: 'Olinmadi', en: 'Not retrieved' }) + ': ' + (r.reason || '')) + '</div></div>';
          if (r.ok) App.render();
        });
      });
    }
  }

  OS.pages.vault = { render: render, mount: mount };
})();
