/* ==========================================================================
   Utils — kichik, umumiy yordamchilar
   (HTML xavfsizligi, DOM, kod bo'yash, toast, clipboard, aralashtirish)
   ========================================================================== */
(function () {
  'use strict';

  /* --- HTML xavfsizligi ------------------------------------------------
     Kontent .js fayllarida turadi, lekin foydalanuvchi yozgan eslatmalar
     ham ekranga chiqadi. Shuning uchun ekranga chiqadigan HAR QANDAY matn
     esc() dan o'tadi — aks holda eslatmaga yozilgan <script> ishlab ketadi. */
  window.esc = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* Matn ichidagi `backtick` bo'laklarini <code> ga aylantiradi.
     Avval esc() qilinadi — ya'ni HTML kiritib bo'lmaydi.               */
  window.inlineCode = function (s) {
    var bt = String.fromCharCode(96);
    var re = new RegExp(bt + '([^' + bt + ']+)' + bt, 'g');
    return esc(s).replace(re, '<code>$1</code>');
  };

  /* Matnni qisqartiradi. Uch nuqta faqat HAQIQATAN kesilgan bo'lsa qo'yiladi —
     aks holda qisqa matn ham "yarim qolgandek" ko'rinardi.                 */
  window.clip = function (s, n) {
    s = String(s === null || s === undefined ? '' : s);
    return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s;
  };

  /* --- Zamonaviy fayl tanlash tugmasi ------------------------------------
     filePick(id, accept, label) → <label class="file-pick"> … <input type=file hidden>.
     Tanlangan fayl nomi avtomatik chiqadi (quyidagi delegat). Har joyda
     "Choose file / No file chosen" o'rniga shu ishlatiladi.                   */
  window.filePick = function (id, accept, label, opts) {
    opts = opts || {};
    return '<label class="file-pick' + (opts.cls ? ' ' + opts.cls : '') + '" for="' + esc(id) + '">' +
      '<span class="fp-ic">' + (window.IC ? IC.upload : '') + '</span>' +
      '<span class="fp-b"><span class="fp-t">' + esc(label || tr('filePick')) + '</span><span class="fp-n" data-fp-name>' + esc(opts.hint || tr('filePickHint')) + '</span></span>' +
      '<input type="file" id="' + esc(id) + '"' + (accept ? ' accept="' + esc(accept) + '"' : '') + (opts.required ? ' required' : '') + ' hidden></label>';
  };
  document.addEventListener('change', function (e) {
    var inp = e.target; if (!inp || inp.type !== 'file') return;
    var lab = inp.closest('.file-pick'); if (!lab) return;
    var f = inp.files && inp.files[0];
    var n = lab.querySelector('[data-fp-name]');
    if (n) n.textContent = f ? f.name + (f.size ? ' · ' + (f.size > 1e6 ? (f.size / 1e6).toFixed(1) + ' MB' : Math.round(f.size / 1e3) + ' KB') : '') : tr('filePickHint');
    lab.classList.toggle('has', !!f);
  });

  /* --- Havoladan rasm ko'rinishini aniqlash ------------------------------
     Rasm URL → o'zi; YouTube → thumbnail; Google Drive (file/d/ID yoki id=ID) →
     thumbnail; boshqa → null (hujjat ikonkasi + havola).                     */
  window.previewOf = function (url) {
    url = String(url || '').trim();
    if (!/^https?:\/\//i.test(url)) return null;
    var yt = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    if (yt) return 'https://i.ytimg.com/vi/' + yt[1] + '/hqdefault.jpg';
    var gd = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]{20,})/);
    if (gd) return 'https://drive.google.com/thumbnail?id=' + gd[1] + '&sz=w1200';
    if (/\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i.test(url) || /googleusercontent\.com|imgur\.com|cloudinary|blob\.vercel-storage/i.test(url)) return url;
    return null;
  };

  /* --- DOM qisqartmalari --- */
  window.$ = function (sel, root) { return (root || document).querySelector(sel); };
  window.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* --- Aralashtirish (Fisher–Yates) -----------------------------------
     Test variantlarini aralashtirish uchun. Natija — indekslar massivi,
     shunda asl ma'lumot o'zgarmaydi, faqat ko'rsatish tartibi o'zgaradi. */
  window.shuffledIndexes = function (n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  };

  /* --- Python kodini bo'yash ------------------------------------------
     Bu to'liq parser emas, "yetarlicha to'g'ri" leksik bo'yagich.
     Muhim tafsilotlar:
       • qator ichidagi # faqat satr (string) tashqarisida izoh hisoblanadi
       • qochirilgan qo'shtirnoq (\") satrni tugatmaydi
       • f"..." kabi prefiksli satrlar ham to'g'ri ushlanadi
       • uch tirnoqli blok (\"\"\") bir qatorda boshlansa ham buzilmaydi   */
  var KEYWORDS = ['def','return','if','elif','else','for','while','in','and','or','not',
    'import','from','as','True','False','None','break','continue','with','try','except',
    'finally','class','pass','lambda','is','del','global','nonlocal','assert','yield','raise','await','async'];
  var BUILTINS = ['print','len','range','int','str','float','bool','input','type','sum','max','min',
    'sorted','list','dict','set','tuple','open','abs','round','enumerate','zip','map','filter',
    'append','insert','remove','pop','sort','get','keys','values','items','split','join','strip',
    'replace','find','lower','upper','format','isinstance','super','reversed','any','all'];

  function tokenizeCode(code) {
    var out = '', i = 0, n = code.length;
    while (i < n) {
      var ch = code[i];

      // Satr (string) — prefiks (f, r, b, u) bilan ham
      var strStart = -1, prefixLen = 0;
      if (ch === '"' || ch === "'") { strStart = i; }
      else if (/[fFrRbBuU]/.test(ch) && (code[i + 1] === '"' || code[i + 1] === "'")) { strStart = i + 1; prefixLen = 1; }
      else if (/[fFrRbBuU]/.test(ch) && /[fFrRbBuU]/.test(code[i + 1] || '') && (code[i + 2] === '"' || code[i + 2] === "'")) { strStart = i + 2; prefixLen = 2; }

      if (strStart >= 0) {
        var quote = code[strStart];
        var triple = code.slice(strStart, strStart + 3) === quote + quote + quote;
        var j = strStart + (triple ? 3 : 1);
        while (j < n) {
          if (code[j] === '\\') { j += 2; continue; }          // qochirilgan belgi
          if (triple && code.slice(j, j + 3) === quote + quote + quote) { j += 3; break; }
          if (!triple && code[j] === quote) { j += 1; break; }
          j++;
        }
        out += '<span class="c-str">' + esc(code.slice(i, j)) + '</span>';
        i = j; continue;
      }

      // Son
      if (/[0-9]/.test(ch) && (i === 0 || /[^A-Za-z0-9_]/.test(code[i - 1]))) {
        var k = i;
        while (k < n && /[0-9._]/.test(code[k])) k++;
        out += '<span class="c-num">' + esc(code.slice(i, k)) + '</span>';
        i = k; continue;
      }

      // Nom / kalit so'z / funksiya chaqiruvi
      if (/[A-Za-z_]/.test(ch)) {
        var m = i;
        while (m < n && /[A-Za-z0-9_]/.test(code[m])) m++;
        var word = code.slice(i, m);
        var next = code[m];
        if (KEYWORDS.indexOf(word) >= 0) out += '<span class="c-kw">' + word + '</span>';
        else if (next === '(' && BUILTINS.indexOf(word) >= 0) out += '<span class="c-fn">' + word + '</span>';
        else if (next === '(') out += '<span class="c-call">' + word + '</span>';
        else out += '<span class="c-var">' + word + '</span>';
        i = m; continue;
      }

      // Operator
      if ('=+-*/<>!%&|^~'.indexOf(ch) >= 0) { out += '<span class="c-op">' + esc(ch) + '</span>'; i++; continue; }

      out += esc(ch); i++;
    }
    return out;
  }

  /* Qatordagi izoh (#) qayerdan boshlanishini topadi.
     Satr (string) ichidagi # izoh EMAS — shuning uchun oddiy indexOf('#')
     yaramaydi: print("# salom") butunlay izohga aylanib qolardi.
     -1 qaytsa — qatorda izoh yo'q.                                         */
  function commentCut(line) {
    var inStr = false, quote = '';
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inStr) {
        if (ch === '\\') { i++; continue; }
        if (ch === quote) inStr = false;
      } else if (ch === '"' || ch === "'") { inStr = true; quote = ch; }
      else if (ch === '#') return i;
    }
    return -1;
  }

  // Bitta qatorni bo'yaydi: avval izohni (#) ajratadi, qolganini tokenlaydi.
  function highlightLine(line) {
    var cut = commentCut(line);
    if (cut < 0) return tokenizeCode(line);
    return tokenizeCode(line.slice(0, cut)) + '<span class="c-cmt">' + esc(line.slice(cut)) + '</span>';
  }

  window.highlightPython = function (code) {
    return String(code).split('\n').map(highlightLine).join('\n');
  };

  /* Cheatsheet uchun soddaroq bo'yash (kichik shriftda o'qishga qulay).
     Izohni to'liq bo'yagich bilan bir xil — satrni hisobga oluvchi — usulda
     ajratadi, aks holda print("# x") kabi qatorlar noto'g'ri bo'yalardi. */
  window.highlightCompact = function (code) {
    var re = new RegExp('\\b(' + KEYWORDS.join('|') + '|print|len|range|input)\\b', 'g');
    return String(code).split('\n').map(function (line) {
      var hi = commentCut(line);
      var codePart = hi >= 0 ? line.slice(0, hi) : line;
      var cmtPart = hi >= 0 ? line.slice(hi) : '';
      return esc(codePart).replace(re, '<span class="ck">$1</span>') +
        (cmtPart ? '<span class="cc">' + esc(cmtPart) + '</span>' : '');
    }).join('\n');
  };

  /* --- Kod bloki (sarlavha paneli + nusxa + ixtiyoriy playground) ------ */
  var codeSeq = 0;
  window.codeBlock = function (code, caption, opts) {
    opts = opts || {};
    var id = 'code' + (++codeSeq);
    var canRun = opts.runnable !== false && window.Store && Store.setting('playground');
    var actions = '<button type="button" data-copy="' + id + '">' + IC.copy + tr('copy') + '</button>';
    if (canRun) actions += '<button type="button" data-run="' + id + '">' + IC.play + tr('run') + '</button>';
    return '<div class="code-block">' +
      '<div class="code-bar"><span class="dot"></span>' + esc(caption || 'Python') +
      '<span class="code-actions">' + actions + '</span></div>' +
      '<pre class="code" id="' + id + '" data-src="' + esc(code) + '">' + highlightPython(code) + '</pre>' +
      '<div class="pg" id="pg_' + id + '" hidden></div>' +
      '</div>';
  };

  /* --- Clipboard -------------------------------------------------------
     navigator.clipboard faqat xavfsiz kontekstda (https / localhost)
     ishlaydi. file:// dan ochilganda eski usulga tushamiz.              */
  window.copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(tr('copied'), 'ok'); },
        function () { legacyCopy(text); });
    } else { legacyCopy(text); }
  };
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(tr('copied'), 'ok'); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* --- Toast (qisqa xabar) --- */
  window.toast = function (msg, kind) {
    var host = $('#toastHost');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = (kind === 'ok' ? IC.check : kind === 'warn' ? IC.alert : IC.spark) +
      '<span>' + esc(msg) + '</span>';
    host.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s, transform .3s';
      el.style.opacity = '0'; el.style.transform = 'translateY(8px)';
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  };

  /* --- Sana formatlash -------------------------------------------------
     Brauzerning uz-UZ locale'i "2026 M09 10" ko'rinishida beradi — o'zbekcha
     o'qishga noqulay. Shuning uchun o'zbek tilida oy nomini o'zimiz qo'yamiz;
     inglizchada esa brauzerning en-GB formati yaxshi.                     */
  var MON_UZ = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];

  function fmtDateObj(d) {
    if (Store.get('lang') === 'en') {
      try { return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
      catch (e) { return d.toISOString().slice(0, 10); }
    }
    return d.getDate() + '-' + MON_UZ[d.getMonth()] + ' ' + d.getFullYear();
  }

  window.fmtDate = function (ts) { return fmtDateObj(new Date(ts)); };

  /* "YYYY-MM-DD" kalitini formatlaydi (Store.dateKey bilan bir xil shakl) */
  window.fmtDateKey = function (key) {
    var p = String(key).split('-');
    return fmtDateObj(new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
  };

  /* --- Kurs bo'yicha kichik yordamchilar --- */
  window.dayOf = function (n) {
    for (var i = 0; i < COURSE.length; i++) if (COURSE[i].day === n) return COURSE[i];
    return null;
  };
  window.groupUnits = function () {
    var units = [], cur = null;
    COURSE.forEach(function (d) {
      if (!cur || cur.name !== d.unit) { cur = { name: d.unit, days: [] }; units.push(cur); }
      cur.days.push(d);
    });
    return units;
  };
  // "Hafta 1 — Asoslar" -> {wk:"Hafta 1", name:"Asoslar"}
  window.splitUnit = function (name) {
    var dash = name.indexOf('—');
    if (dash < 0) return { wk: name, name: name };
    return { wk: name.slice(0, dash).trim(), name: name.slice(dash + 1).trim() };
  };
  /* Darsning taxminiy davomiyligi — bo'limlar va mashqlar sonidan.
     Aniq o'lchov emas, lekin foydalanuvchiga rejalashtirishga yordam beradi. */
  window.estimateMinutes = function (d) {
    var deep = (window.DEEP && DEEP[d.day]) || {};
    var sections = (d.sections || []).length + (deep.extraSections || []).length;
    var notes = (deep.notes || []).length;
    var mins = 8;
    mins += sections * 6;
    mins += notes * 1;                      // qo'shimcha izohlar ham vaqt oladi
    mins += (d.practice || []).length * 3;
    if (d.project) mins += 15;
    mins += 6;                              // test
    return Math.round(mins / 5) * 5;
  };
})();
