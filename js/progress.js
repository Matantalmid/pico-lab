/* "My progress" (#/progress): what this student has done, from this browser.
   Lessons marked done, steps ticked, and the score of every quiz. The student types a name,
   then prints the page or saves it as a file and hands it in (for example in Moodle).
   There are no accounts: everything comes from localStorage in this browser. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;
  var B = function (he, en) { return { he: he, en: en }; };
  var L = {
    h: B('ההתקדמות שלי', 'My progress'),
    lead: B('הסיכום נבנה ממה שנשמר בדפדפן הזה: שיעורים שסומנו כגמורים, שלבים שסומנו, ותוצאות שאלות הבדיקה. כתבו שם, ואז הדפיסו את הסיכום או שמרו אותו כקובץ, והגישו אותו למרצה.', 'This summary is built from what was saved in this browser: lessons marked done, steps ticked, and the results of the check questions. Type a name, then print or save it as a file and hand it to the lecturer.'),
    note: B('הנתונים נשמרים רק בדפדפן ובמחשב שבהם עבדתם. בדפדפן אחר, או אחרי ניקוי נתוני הגלישה, הם לא יופיעו.', 'The data lives only in the browser and on the computer you worked on. In another browser, or after clearing browsing data, it will not appear.'),
    name: B('שם מלא', 'Full name'), id: B('מספר זהות או מספר סטודנט (לא חובה)', 'ID or student number (optional)'),
    print: B('הדפיסו', 'Print'), save: B('שמרו כקובץ', 'Save as a file'), made: B('נוצר', 'Made'),
    sumH: B('סיכום', 'Summary'), lessons: B('שיעורים שהושלמו', 'Lessons completed'), questions: B('שאלות בדיקה שנענו נכון', 'Check questions right'), answered: B('שאלות שנענו', 'Questions answered'),
    lessonsH: B('שיעורים', 'Lessons'), lesson: B('שיעור', 'Lesson'), status: B('מצב', 'Status'), steps: B('שלבים', 'Steps'), quiz: B('שאלות', 'Questions'),
    st: { done: B('הושלם', 'Done'), busy: B('בתהליך', 'In progress'), 'new': B('לא התחיל', 'Not started') },
    basicsH: B('פרקים, ממשקים ומבחני מסלול', 'Chapters, interfaces and track quizzes'), page: B('עמוד', 'Page'),
    onlyStarted: B('להציג רק מה שהתחלתי', 'Show only what I started'),
    load: B('טענו קובץ התקדמות', 'Load a progress file'),
    loadAsk: B('לטעון את ההתקדמות מהקובץ? היא תחליף את ההתקדמות שנשמרה בדפדפן הזה.', 'Load the progress from the file? It will replace the progress saved in this browser.'),
    loadOk: B('ההתקדמות נטענה.', 'The progress was loaded.'),
    loadOld: B('ההתקדמות נטענה. הקובץ נשמר בגרסה קודמת של האתר, ולכן נטענו רק השיעורים והצעדים, בלי התשובות לשאלות.', 'The progress was loaded. The file was saved by an earlier version of the site, so only the lessons and steps were loaded, not the answers to the questions.'),
    loadBad: B('הקובץ הזה הוא לא קובץ התקדמות של האתר.', 'This file is not a progress file from this site.'),
    loadWhy: B('עובדים על מחשב אחר? שמרו כאן קובץ, וטענו אותו במחשב השני.', 'Working on another computer? Save a file here, and load it on the other one.'),
    map: B('מפת הקורס', 'Course map'),
    review: B('מבחן מסלול', 'Track quiz'),
    none: B('—', '—')
  };
  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  function today() { return new Date().toLocaleString(P.lang() === 'he' ? 'he-IL' : 'en-GB'); }

  P.viewProgress = function (app) {
    var me = load('pico.student'), only = me.only !== false;
    function render() {
      var les = load('pico.lessons'), q = P.quizResults(), sp = P.lessonProgress;
      var done = 0, right = 0, answered = 0, total = 0;
      Object.keys(q).forEach(function (k) { right += q[k].right; answered += q[k].done; total += q[k].n; });
      var rows = P.lessons.map(function (l) {
        var s = sp.status(l.id), r = les[l.id] || {}, ticked = (r.steps || []).filter(Boolean).length, qs = q['lesson:' + l.id];
        if (s === 'done') done++;
        if (only && s === 'new' && !(qs && qs.done)) return '';
        return '<tr><td><b>' + l.id + '</b> ' + esc(T(l.title)) + '</td><td>' + T(L.st[s]) + '</td><td class="ltr">' + ticked + ' / ' + l.steps.length + '</td><td class="ltr">' + (qs && qs.done ? qs.right + ' / ' + qs.n : T(L.none)) + '</td></tr>';
      }).join('');
      var others = P.basics.map(function (c, i) { return ['basics:' + c.id, (i + 1) + '. ' + T(c.title)]; })
        .concat(P.interfaces.map(function (it) { return ['iface:' + it.id, T(it.name)]; }))
        .concat(P.tracks.map(function (t) { return ['track:' + t.id, T(L.review) + ' ' + t.id + ': ' + T(t.title)]; }))
        .map(function (x) { var s = q[x[0]]; return s && (s.done || !only) ? '<tr><td>' + esc(x[1]) + '</td><td class="ltr">' + (s.done ? s.right + ' / ' + s.n : T(L.none)) + '</td></tr>' : ''; }).join('');
      document.getElementById('pg-body').innerHTML =
        '<p class="muted pg-made">' + T(L.made) + ': ' + esc(today()) + '</p>' +
        '<h2>' + T(L.sumH) + '</h2><div class="pg-sum"><div class="card"><b class="ltr">' + done + ' / ' + P.lessons.length + '</b><span>' + T(L.lessons) + '</span></div>' +
        '<div class="card"><b class="ltr">' + right + ' / ' + answered + '</b><span>' + T(L.questions) + '</span></div>' +
        '<div class="card"><b class="ltr">' + answered + ' / ' + total + '</b><span>' + T(L.answered) + '</span></div></div>' +
        '<h2>' + T(L.lessonsH) + '</h2><div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.lesson) + '</th><th>' + T(L.status) + '</th><th>' + T(L.steps) + '</th><th>' + T(L.quiz) + '</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4">' + T(L.none) + '</td></tr>') + '</tbody></table></div>' +
        (others ? '<h2>' + T(L.basicsH) + '</h2><div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.page) + '</th><th>' + T(L.quiz) + '</th></tr></thead><tbody>' + others + '</tbody></table></div>' : '');
      return { done: done, right: right, answered: answered, total: total };
    }
    app.className = 'page narrow';
    app.innerHTML = '<div class="sheet" id="pg-root"><div class="sheet-bar no-print"><a class="btn ghost" href="#/map">' + T(L.map) + '</a><label class="btn ghost pg-load">' + T(L.load) + '<input type="file" id="pg-file" accept=".json,application/json" hidden></label><button type="button" class="btn ghost" id="pg-save">' + T(L.save) + '</button><button type="button" class="btn" id="pg-print">' + T(L.print) + '</button></div>' +
      '<h1>' + T(L.h) + '</h1><p class="lead no-print">' + T(L.lead) + '</p><p class="muted no-print" style="font-size:.88rem">' + T(L.note) + ' ' + T(L.loadWhy) + '</p>' +
      '<div class="card pg-me"><label class="vf-f"><span>' + T(L.name) + '</span><input type="text" id="pg-name" value="' + esc(me.name || '') + '"></label>' +
      '<label class="vf-f"><span>' + T(L.id) + '</span><input type="text" id="pg-id" dir="ltr" value="' + esc(me.id || '') + '"></label></div>' +
      '<label class="no-print pg-only"><input type="checkbox" id="pg-only"' + (only ? ' checked' : '') + '> ' + T(L.onlyStarted) + '</label>' +
      '<div id="pg-body"></div></div>';
    render();
    var root = document.getElementById('pg-root');
    function keep() { me.name = document.getElementById('pg-name').value.trim(); me.id = document.getElementById('pg-id').value.trim(); me.only = only; try { localStorage.setItem('pico.student', JSON.stringify(me)); } catch (e) { /* ignore */ } }
    root.addEventListener('change', function (e) {
      if (e.target.id === 'pg-only') { only = e.target.checked; keep(); render(); } else keep();
    });
    document.getElementById('pg-print').addEventListener('click', function () { keep(); window.print(); });
    document.getElementById('pg-save').addEventListener('click', function () {
      keep();
      var sum = render(), q = P.quizResults(), sp = P.lessonProgress, les = load('pico.lessons');
      var data = { name: me.name || '', id: me.id || '', made: new Date().toISOString(), lessonsDone: sum.done, lessonsTotal: P.lessons.length, questionsRight: sum.right, questionsAnswered: sum.answered, questionsTotal: sum.total,
        lessons: P.lessons.map(function (l) { var r = les[l.id] || {}; return { id: l.id, status: sp.status(l.id), steps: (r.steps || []).filter(Boolean).length + '/' + l.steps.length, quiz: q['lesson:' + l.id] ? q['lesson:' + l.id].right + '/' + q['lesson:' + l.id].n : '' }; }),
        quizzes: q,
        raw: { lessons: les, quiz: load('pico.quiz') } };
      var a = document.createElement('a'), safe = (me.name || 'student').replace(/[^\w֐-׿ -]/g, '').trim().replace(/\s+/g, '-') || 'student';
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'pico-progress-' + safe + '.json'; document.body.appendChild(a); a.click(); a.remove();
    });
    document.getElementById('pg-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        var data; try { data = JSON.parse(rd.result); } catch (err) { data = null; }
        if (!data || !Array.isArray(data.lessons)) { window.alert(T(L.loadBad)); return; }
        if (!window.confirm(T(L.loadAsk))) return;
        var msg = L.loadOk;
        try {
          if (data.raw && data.raw.lessons) {
            localStorage.setItem('pico.lessons', JSON.stringify(data.raw.lessons));
            localStorage.setItem('pico.quiz', JSON.stringify(data.raw.quiz || {}));
          } else {
            /* an older file: rebuild the lessons from their status and step count */
            var les = {};
            data.lessons.forEach(function (r) {
              var k = parseInt(String(r.steps || '0').split('/')[0], 10) || 0, steps = [];
              for (var i = 0; i < k; i++) steps.push(true);
              les[r.id] = { steps: steps };
              if (r.status === 'done') les[r.id].done = true;
            });
            localStorage.setItem('pico.lessons', JSON.stringify(les));
            msg = L.loadOld;
          }
          if (data.name || data.id) { me.name = data.name || me.name; me.id = data.id || me.id; localStorage.setItem('pico.student', JSON.stringify(me)); }
        } catch (err) { window.alert(T(L.loadBad)); return; }
        P.lessonProgress.reload();
        P.viewProgress(app);
        window.alert(T(msg));
      };
      rd.readAsText(file);
    });
  };
})(window.PICO);
