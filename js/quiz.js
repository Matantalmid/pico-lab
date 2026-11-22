/* Check questions ("Check yourself"), on lessons, basics chapters, interfaces and track reviews.

   A question is { q, why } plus one of:
     multiple choice     { a: [options], ok: index }                       (the original kind, made by Q() in the data files)
     type: 'fill'        { code: [lines, one of them '___'], a: [options], ok }   pick the missing line
     type: 'output'      { code: [lines], answer: 'text' | ['text', ...] }       type what the code prints
     type: 'order'       { lines: [lines in the right order] }                    put the lines in order

   Answers are kept in this browser (pico.quiz): { key: { n, a: { questionIndex: answer }, t } }, where the answer is the
   chosen option index for multiple choice and fill, and 1 (right) or 0 (wrong) for output and order.
   Keys: 'lesson:A1', 'basics:<id>', 'iface:<id>', 'track:<id>'. The first answer to each question is the one that counts;
   "Try again" on a question lets the student answer it again for practice, without changing the score.
   Options and lines are shuffled the same way every time for the same question, so a page looks the same on reload. */
(function (P) {
  'use strict';
  var T = P.t, S = P.s, esc = P.esc, R = function (v) { return P.rich(T(v)); };
  var L = {
    check: { he: 'בדקו', en: 'Check' },
    retry: { he: 'נסו שוב את השאלה', en: 'Try this question again' },
    retryNote: { he: 'הציון נשמר לפי התשובה הראשונה.', en: 'The score keeps your first answer.' },
    typeHere: { he: 'כתבו כאן את מה שיודפס', en: 'Type here what will be printed' },
    outputQ: { he: 'מה יודפס?', en: 'What will be printed?' },
    orderQ: { he: 'סדרו את השורות בסדר הנכון בעזרת החצים, ואז לחצו "בדקו".', en: 'Put the lines in the right order with the arrows, then press "Check".' },
    fillQ: { he: 'איזו שורה חסרה במקום ___?', en: 'Which line is missing in place of ___?' },
    up: { he: 'הזיזו למעלה', en: 'Move up' }, down: { he: 'הזיזו למטה', en: 'Move down' },
    rightAnswer: { he: 'התשובה הנכונה:', en: 'The right answer:' },
    rightOrder: { he: 'הסדר הנכון:', en: 'The right order:' }
  };

  function load() { try { return JSON.parse(localStorage.getItem('pico.quiz')) || {}; } catch (e) { return {}; } }
  function save(all) { try { localStorage.setItem('pico.quiz', JSON.stringify(all)); } catch (e) { /* ignore */ } }
  function kind(q) { return q.type || 'choice'; }
  function isRight(q, ans) { var k = kind(q); return k === 'output' || k === 'order' ? ans === 1 : ans === q.ok; }
  function score(items, rec) {
    var right = 0, done = 0;
    (items || []).forEach(function (q, n) { if (rec && rec.a && rec.a[n] !== undefined) { done++; if (isRight(q, rec.a[n])) right++; } });
    return { right: right, done: done, n: (items || []).length };
  }
  function scoreLine(sc) {
    if (!sc.done) return '';
    return S('quizScore').replace('{r}', sc.right).replace('{n}', sc.n) + (sc.done < sc.n ? ' ' + S('quizLeft').replace('{k}', sc.n - sc.done) : '');
  }

  /* a fixed shuffle for each question: the same seed gives the same order */
  function seedOf(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function perm(n, seed) {
    var p = [], i; for (i = 0; i < n; i++) p.push(i);
    var s = seed || 1;
    for (i = n - 1; i > 0; i--) { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9E3779B9) >>> 0; var j = s % (i + 1), t = p[i]; p[i] = p[j]; p[j] = t; }
    return p;
  }
  function qSeed(key, n, q) { return seedOf((key || '') + '|' + n + '|' + (q.q && (q.q.en || q.q) || '')); }
  /* order questions must not start in the right order */
  function orderPerm(q, key, n) {
    var p = perm(q.lines.length, qSeed(key, n, q));
    if (p.every(function (v, i) { return v === i; }) && p.length > 1) { var t = p[0]; p[0] = p[1]; p[1] = t; }
    return p;
  }

  function codeHTML(lines) {
    return '<pre class="qz-code" dir="ltr"><code>' + lines.map(function (l) {
      return l.indexOf('___') >= 0 ? '<span class="qz-blank">' + esc(l) + '</span>' : esc(l);
    }).join('\n') + '</code></pre>';
  }
  function normOut(s) { return String(s).replace(/\r/g, '').split('\n').map(function (x) { return x.trim().replace(/\s+/g, ' '); }).filter(Boolean).join('\n'); }
  function answers(q) { return Array.isArray(q.answer) ? q.answer : [q.answer]; }

  /* one question. shown: the answer to display (undefined = fresh, ready to answer) */
  function questionHTML(q, n, key, shown) {
    var k = kind(q), has = shown !== undefined, right = has && isRight(q, shown);
    var head = '<p class="qz-q"><b>' + (n + 1) + '.</b> ' + R(q.q) + '</p>';
    var body = '';
    if (k === 'choice' || k === 'fill') {
      if (k === 'fill') body += '<p class="muted qz-sub">' + T(L.fillQ) + '</p>' + codeHTML(q.code);
      body += '<div class="qz-opts">' + perm(q.a.length, qSeed(key, n, q)).map(function (i) {
        var cls = has ? (i === q.ok ? ' right' : i === shown ? ' wrong' : '') : '';
        var txt = k === 'fill' ? '<code dir="ltr">' + esc(T(q.a[i])) + '</code>' : R(q.a[i]);
        return '<button type="button" class="qz-opt' + cls + '" data-i="' + i + '"' + (has ? ' disabled' : '') + '>' + txt + '</button>';
      }).join('') + '</div>';
    } else if (k === 'output') {
      body += '<p class="muted qz-sub">' + T(L.outputQ) + '</p>' + codeHTML(q.code) +
        '<div class="qz-row"><textarea class="qz-in" dir="ltr" rows="' + Math.min(4, Math.max(1, answers(q)[0].split('\n').length)) + '" placeholder="' + esc(T(L.typeHere)) + '"' + (has ? ' disabled' : '') + '></textarea>' +
        '<button type="button" class="btn small qz-check"' + (has ? ' disabled' : '') + '>' + T(L.check) + '</button></div>' +
        (has && !right ? '<p class="qz-right"><b>' + T(L.rightAnswer) + '</b></p>' + codeHTML(answers(q)[0].split('\n')) : '');
    } else if (k === 'order') {
      body += has
        ? '<p class="muted qz-sub">' + T(L.rightOrder) + '</p>' + codeHTML(q.lines)
        : '<p class="muted qz-sub">' + T(L.orderQ) + '</p><ol class="qz-order" dir="ltr">' + orderPerm(q, key, n).map(function (i) {
          return '<li data-i="' + i + '"><code>' + esc(q.lines[i]) + '</code><span class="qz-mv"><button type="button" class="qz-up" aria-label="' + esc(T(L.up)) + '">▲</button><button type="button" class="qz-down" aria-label="' + esc(T(L.down)) + '">▼</button></span></li>';
        }).join('') + '</ol><button type="button" class="btn small qz-check">' + T(L.check) + '</button>';
    }
    var why = '<div class="qz-why"' + (has ? '' : ' hidden') + '><p><b>' + (has ? S(right ? 'correct' : 'wrong') : '') + '</b> ' + (q.why ? R(q.why) : '') + '</p>' +
      (has ? '<button type="button" class="btn ghost small qz-retry">' + T(L.retry) + '</button> <span class="muted qz-note">' + T(L.retryNote) + '</span>' : '') + '</div>';
    return head + body + why;
  }

  var registry = {};    /* key -> items, so a question can be drawn again after an answer */
  function html(items, key) {
    if (!items || !items.length) return '';
    if (key) registry[key] = items;
    var rec = key ? load()[key] : null, sc = score(items, rec);
    return '<h2>' + S('quiz') + '</h2><div class="quiz"' + (key ? ' data-qkey="' + esc(key) + '"' : '') + '>' + items.map(function (q, n) {
      var mine = rec && rec.a ? rec.a[n] : undefined;
      return '<div class="qz card qz-k-' + kind(q) + '" data-n="' + n + '">' + questionHTML(q, n, key, mine) + '</div>';
    }).join('') + (key ? '<div class="qz-score"><span>' + scoreLine(sc) + '</span><button type="button" class="btn ghost small qz-reset"' + (sc.done ? '' : ' hidden') + '>' + S('quizAgain') + '</button></div>' : '') + '</div>';
  }

  /* an answer was given: keep it if it is the first one, then draw the question with this answer */
  function answer(qz, value) {
    var box = qz.closest('.quiz'), key = box && box.dataset.qkey, n = parseInt(qz.dataset.n, 10);
    var items = key ? registry[key] : null, q = items && items[n];
    if (!q) return;
    var all = load(), rec = all[key] || { a: {} };
    if (rec.a[n] === undefined) rec.a[n] = value;
    rec.n = items.length; rec.t = Date.now();
    all[key] = rec; save(all);
    qz.innerHTML = questionHTML(q, n, key, value);
    box.querySelector('.qz-score span').textContent = scoreLine(score(items, rec));
    box.querySelector('.qz-reset').hidden = false;
  }

  document.addEventListener('click', function (e) {
    var qz = e.target.closest('.qz');
    if (qz) {
      var box = qz.closest('.quiz'), key = box && box.dataset.qkey, n = parseInt(qz.dataset.n, 10), q = key && registry[key] && registry[key][n];
      if (!q) return;
      var opt = e.target.closest('.qz-opt');
      if (opt && !opt.disabled) { answer(qz, parseInt(opt.dataset.i, 10)); return; }
      var mv = e.target.closest('.qz-up, .qz-down');
      if (mv) {
        var li = mv.closest('li'), up = mv.classList.contains('qz-up');
        if (up && li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
        else if (!up && li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
        mv.focus();
        return;
      }
      if (e.target.closest('.qz-check')) {
        if (kind(q) === 'output') {
          var typed = normOut(qz.querySelector('.qz-in').value);
          if (!typed) { qz.querySelector('.qz-in').focus(); return; }
          answer(qz, answers(q).some(function (a) { return normOut(a) === typed; }) ? 1 : 0);
        } else {
          var got = [].map.call(qz.querySelectorAll('.qz-order li'), function (x) { return parseInt(x.dataset.i, 10); });
          answer(qz, got.every(function (v, i) { return v === i; }) ? 1 : 0);
        }
        return;
      }
      if (e.target.closest('.qz-retry')) { qz.innerHTML = questionHTML(q, n, key, undefined); return; }
    }
    var again = e.target.closest('.qz-reset');
    if (again) {
      var qb = again.closest('.quiz'), k2 = qb.dataset.qkey, all = load();
      delete all[k2]; save(all);
      var tmp = document.createElement('div');
      tmp.innerHTML = html(registry[k2], k2);
      qb.replaceWith(tmp.querySelector('.quiz'));
    }
  });
  /* Enter in an output answer checks it; Shift+Enter adds a line */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target.classList && e.target.classList.contains('qz-in')) {
      e.preventDefault();
      var b = e.target.closest('.qz').querySelector('.qz-check');
      if (b) b.click();
    }
  });

  P.quiz = { html: html, score: score, load: load, isRight: isRight, kind: kind, answers: answers };
})(window.PICO);
