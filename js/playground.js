/* ==========================================================================
   Kod maydoni (Playground) — Python brauzerda
   --------------------------------------------------------------------------
   Pyodide (CPython WebAssembly'ga o'girilgani) CDN'dan yuklanadi va kod
   foydalanuvchi brauzerida bajariladi — server ham, hisob ham kerak emas.

   Muhim tafsilotlar:
     • Pyodide ~10 MB. Shuning uchun sahifa ochilishida EMAS, faqat birinchi
       "Ishga tushirish" bosilganda yuklanadi (lazy load).
     • Internet bo'lmasa yoki CDN bloklansa — xato ushlanadi va foydalanuvchi
       tushunarli xabar oladi, sahifa buzilmaydi.
     • input() brauzerda ishlamaydi: uni prompt() ga bog'lab qo'yamiz, aks
       holda input() ishlatgan darslar "muzlab" qolardi.
   ========================================================================== */
(function () {
  'use strict';

  var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
  var pyodide = null;
  var loading = null;   // Promise — bir vaqtda ikki marta yuklanmasin

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error('script')); };
      document.head.appendChild(s);
    });
  }

  function ensurePyodide(onStatus) {
    if (pyodide) return Promise.resolve(pyodide);
    if (loading) return loading;

    onStatus(tr('pgLoading'), 'busy');
    loading = loadScript(PYODIDE_URL)
      .then(function () { return window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' }); })
      .then(function (py) {
        pyodide = py;
        // input() ni brauzer prompt()'iga bog'laymiz
        pyodide.runPython(
          'import builtins, js\n' +
          'def _browser_input(prompt=""):\n' +
          '    v = js.window.prompt(str(prompt))\n' +
          '    return "" if v is None else str(v)\n' +
          'builtins.input = _browser_input\n'
        );
        return pyodide;
      })
      .catch(function (e) { loading = null; throw e; });
    return loading;
  }

  function runCode(code, outEl, statusFn) {
    outEl.classList.add('show');
    outEl.innerHTML = '<span class="meta">' + esc(tr('pgLoading')) + '</span>';

    ensurePyodide(statusFn).then(function (py) {
      statusFn(tr('pgRunning'), 'busy');
      // stdout/stderr ni ushlab olamiz
      py.runPython('import sys, io\n_out = io.StringIO()\nsys.stdout = _out\nsys.stderr = _out');
      var error = null;
      try { py.runPython(code); }
      catch (e) { error = String(e.message || e); }
      var out = '';
      try { out = py.runPython('_out.getvalue()'); } catch (e) {}
      try { py.runPython('import sys\nsys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__'); } catch (e) {}

      var html = '';
      if (out) html += esc(out);
      if (error) html += (out ? '\n' : '') + '<span class="err">' + esc(error) + '</span>';
      if (!html) html = '<span class="meta">' + esc(tr('pgNoOut')) + '</span>';
      outEl.innerHTML = html;
      statusFn(tr('pgReady'), 'ready');
    }).catch(function () {
      outEl.innerHTML = '<span class="err">' + esc(tr('pgFailed')) + '</span>';
      statusFn('', '');
    });
  }

  /* Kod bloki ostida tahrirlanadigan maydonni ochadi/yopadi */
  window.Playground = {
    toggle: function (codeId) {
      var pre = document.getElementById(codeId);
      var host = document.getElementById('pg_' + codeId);
      if (!pre || !host) return;

      if (!host.hidden) { host.hidden = true; return; }

      var source = pre.dataset.src || pre.textContent;
      host.hidden = false;
      host.innerHTML =
        '<div class="pg-bar">' + esc(tr('playgroundTitle')) +
          '<span class="pg-status">' + esc(tr('pgIdle')) + '</span></div>' +
        '<textarea class="pg-editor" spellcheck="false"></textarea>' +
        '<div class="pg-bar" style="border-top:1px solid var(--line);border-bottom:0">' +
          '<button class="btn btn-primary btn-sm" data-pgrun>' + IC.play + esc(tr('run')) + '</button>' +
          '<button class="btn btn-quiet btn-sm" data-pgreset>' + IC.refresh + esc(tr('pgReset')) + '</button>' +
          '<button class="btn btn-quiet btn-sm" data-pgsave>' + IC.notebook + esc(tr('pgSaveSnippet')) + '</button>' +
        '</div>' +
        '<div class="pg-out"></div>';

      var editor = host.querySelector('.pg-editor');
      var out = host.querySelector('.pg-out');
      var statusEl = host.querySelector('.pg-status');
      editor.value = source;
      // Matnga qarab balandlikni moslash
      editor.style.height = Math.min(420, Math.max(150, source.split('\n').length * 23 + 34)) + 'px';

      function status(text, cls) {
        statusEl.textContent = text;
        statusEl.className = 'pg-status ' + (cls || '');
      }

      host.querySelector('[data-pgrun]').addEventListener('click', function () {
        runCode(editor.value, out, status);
      });
      host.querySelector('[data-pgreset]').addEventListener('click', function () {
        editor.value = source; out.classList.remove('show');
      });
      /* Kod parchasini Coding daftariga saqlash — sarlavha darsdan */
      host.querySelector('[data-pgsave]').addEventListener('click', function () {
        var h1 = document.querySelector('#content h1');
        Store.copySet('coding', { title: (h1 ? h1.textContent.trim() : 'Snippet') + ' · ' + new Date().toLocaleDateString(), lang: 'python', code: editor.value, text: '' });
        toast(tr('pgSnippetSaved'), 'ok');
      });

      // Tab tugmasi fokusni ko'chirmasin — kodda otstup kerak
      editor.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          var s = editor.selectionStart, en = editor.selectionEnd;
          editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(en);
          editor.selectionStart = editor.selectionEnd = s + 4;
        }
        // Ctrl/Cmd + Enter — ishga tushirish
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCode(editor.value, out, status); }
      });

      editor.focus();
    }
  };
})();
