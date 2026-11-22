/* Lesson tracks: guided hands-on lessons that combine the parts from the
   catalog into small working builds. Each lesson has a checklist, wiring,
   code explained line by line, challenges and a short quiz. Progress is
   kept in this browser only (localStorage), with no account. */
(function (P) {
  'use strict';
  var T = P.t, S = P.s, esc = P.esc, R = function (v) { return P.rich(T(v)); };

  var L = {
    h: { he: 'שיעורים מעשיים', en: 'Hands-on lessons' },
    lead: {
      he: '{n} מסלולים, מהלד הראשון ועד פרויקט משלכם. כל שיעור הוא בנייה קטנה שעובדת: חברו אותה, הריצו אותה, הבינו את הקוד, ואז שנו אותו בעצמכם. עשו את השיעורים לפי הסדר, כי כל שיעור נשען על הקודם.',
      en: '{n} tracks, from the first LED to a project of your own. Each lesson is a small build that works: connect it, run it, understand the code, then change it yourself. Do the lessons in order, because each builds on the one before.'
    },
    autoDone: { he: 'שיעור נחשב שהושלם כשכל הצעדים מסומנים וכל השאלות נענו. אפשר גם לסמן אותו בעצמכם.', en: 'A lesson counts as done when every step is ticked and every question answered. You can also mark it yourself.' },
    missing: { he: 'כדאי לעשות קודם את', en: 'It is worth doing these first:' },
    missingWhy: { he: 'השיעור הזה נשען על מה שלומדים שם. זו רק המלצה, ואפשר להמשיך גם בלי זה.', en: 'This lesson builds on what is learned there. It is only a suggestion, and you can carry on without it.' },
    before: {
      he: 'לפני השיעור הראשון עברו על "יסודות" ועל "מתחילים", כדי שהלוח כבר יריץ MicroPython.',
      en: 'Before the first lesson go through Basics and Get started, so the board is already running MicroPython.'
    },
    overall: { he: 'ההתקדמות שלכם', en: 'Your progress' },
    of: { he: 'מתוך', en: 'of' },
    lessonsDone: { he: 'שיעורים הושלמו', en: 'lessons completed' },
    saved: { he: 'ההתקדמות נשמרת בדפדפן הזה בלבד.', en: 'Progress is saved in this browser only.' },
    reset: { he: 'איפוס ההתקדמות', en: 'Reset progress' },
    resetAsk: { he: 'למחוק את כל ההתקדמות בשיעורים?', en: 'Erase all lesson progress?' },
    track: { he: 'מסלול', en: 'Track' },
    lesson: { he: 'שיעור', en: 'Lesson' },
    stDone: { he: 'הושלם', en: 'Done' },
    stBusy: { he: 'בתהליך', en: 'In progress' },
    goal: { he: 'המטרה', en: 'The goal' },
    learn: { he: 'מה תלמדו', en: 'What you will learn' },
    prep: { he: 'לפני שמתחילים', en: 'Before you start' },
    parts: { he: 'מה צריך', en: 'What you need' },
    partsHint: { he: 'לא מכירים רכיב? לחצו על השם שלו כדי לפתוח את העמוד שמסביר אותו.', en: 'Do not know a part? Click its name to open the page that explains it.' },
    wiring: { he: 'החיווט', en: 'The wiring' },
    who: { he: 'מה מחברים', en: 'What to connect' },
    steps: { he: 'עשו את זה, צעד אחר צעד', en: 'Do it, step by step' },
    stepsHint: { he: 'סמנו כל צעד שסיימתם. הסימונים נשמרים.', en: 'Tick each step you finish. The ticks are saved.' },
    tasks: { he: 'אתגרים: עכשיו תורכם', en: 'Challenges: your turn' },
    tasksHint: { he: 'כאן מתרחשת הלמידה האמיתית. נסו לבד לפני שאתם פותחים את הרמז.', en: 'This is where the real learning happens. Try by yourself before opening the hint.' },
    task: { he: 'אתגר', en: 'Challenge' },
    hint: { he: 'רמז', en: 'Hint' },
    solution: { he: 'פתרון אפשרי', en: 'One possible solution' },
    markDone: { he: 'סיימתי את השיעור', en: 'I finished this lesson' },
    unmark: { he: 'סמנו כלא הושלם', en: 'Mark as not finished' },
    doneMsg: { he: 'כל הכבוד. השיעור הושלם.', en: 'Well done. Lesson complete.' },
    next: { he: 'השיעור הבא', en: 'Next lesson' },
    prev: { he: 'השיעור הקודם', en: 'Previous lesson' },
    all: { he: 'לכל השיעורים', en: 'All lessons' },
    toPlanner: { he: 'למתכנן הפרויקט', en: 'Open the project planner' },
    openPlan: { he: 'פתחו את התוכנית הזו במתכנן', en: 'Open this plan in the planner' }
  };

  /* ---------- progress ----------
     pico.lessons: { id: { steps: [bool], done: true | false | undefined } }.
     A lesson counts as done when it was marked done by hand (done: true), or, unless it was
     unmarked by hand (done: false), when every step is ticked and every quiz question answered. */
  var KEY = 'pico.lessons';
  var state = {};
  function loadState() { try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; } }
  loadState();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function st(id) { return state[id] || { steps: [] }; }
  function quizAnswered(key, n) {
    if (!n) return true;
    var all; try { all = JSON.parse(localStorage.getItem('pico.quiz')) || {}; } catch (e) { all = {}; }
    var rec = all[key];
    return !!rec && !!rec.a && Object.keys(rec.a).length >= n;
  }
  function autoDone(id) {
    var l = lessonById(id), s = st(id);
    if (!l) return false;
    for (var i = 0; i < l.steps.length; i++) if (!(s.steps && s.steps[i])) return false;
    return quizAnswered('lesson:' + id, (l.quiz || []).length);
  }
  function isDone(id) { var s = st(id); return s.done === true || (s.done !== false && autoDone(id)); }
  function status(id) {
    var s = st(id);
    return isDone(id) ? 'done' : (s.steps || []).some(Boolean) || quizAnswered('lesson:' + id, 1) && (lessonById(id) || {}).quiz ? 'busy' : 'new';
  }
  function setStep(id, i, on) {
    var s = state[id] = st(id);
    s.steps = s.steps || [];
    s.steps[i] = !!on; save();
  }
  function setDone(id, on) {
    var s = state[id] = st(id);
    s.done = !!on; save();
  }
  function doneCount(list) { return list.filter(function (l) { return isDone(l.id); }).length; }

  function lessonById(id) {
    for (var i = 0; i < P.lessons.length; i++) if (P.lessons[i].id === id) return P.lessons[i];
    return null;
  }

  /* ---------- where the student stopped, and what to do next ----------
     pico.last = { k: 'lesson' | 'basics' | 'component' | 'iface', id } is written by route() in app.js. */
  function lastPlace() {
    var v; try { v = JSON.parse(localStorage.getItem('pico.last')); } catch (e) { v = null; }
    if (!v || !v.k || !v.id) return null;
    var title = null, href = null;
    if (v.k === 'lesson') { var l = lessonById(v.id); if (l) { title = l.id + ', ' + T(l.title); href = '#/lessons/' + l.id; } }
    else if (v.k === 'basics') { P.basics.forEach(function (c) { if (c.id === v.id) { title = T(c.title); href = '#/basics/' + c.id; } }); }
    else if (v.k === 'component') { var c = P.componentById(v.id); if (c) { title = T(c.name); href = '#/components/' + c.id; } }
    else if (v.k === 'iface') { var it = P.interfaceById(v.id); if (it) { title = T(it.name); href = '#/interfaces/' + it.id; } }
    return title ? { k: v.k, id: v.id, title: title, href: href } : null;
  }
  /* the first unfinished lesson of the track the student is in; after that, the first unfinished one further on */
  function suggestion() {
    var last = lastPlace(), from = 0, i;
    if (last && last.k === 'lesson') {
      var cur = lessonById(last.id), trackId = cur.track;
      for (i = 0; i < P.lessons.length; i++) if (P.lessons[i].track === trackId && !isDone(P.lessons[i].id)) return P.lessons[i];
      from = P.lessons.indexOf(cur);
    }
    for (i = from; i < P.lessons.length; i++) if (!isDone(P.lessons[i].id)) return P.lessons[i];
    for (i = 0; i < P.lessons.length; i++) if (!isDone(P.lessons[i].id)) return P.lessons[i];
    return null;
  }
  var C = {
    h: { he: 'מאיפה ממשיכים', en: 'Where to go on from' },
    cont: { he: 'המשיכו מאיפה שעצרתם', en: 'Carry on where you stopped' },
    next: { he: 'השיעור הבא שמומלץ לכם', en: 'The next lesson we suggest' },
    first: { he: 'התחילו כאן', en: 'Start here' },
    allDone: { he: 'השלמתם את כל השיעורים. אפשר לתכנן פרויקט משלכם במתכנן.', en: 'You have completed every lesson. You can plan a project of your own in the planner.' },
    map: { he: 'מפת הקורס', en: 'Course map' }
  };
  /* opts.always: show the card even when nothing has been started yet (the lessons index) */
  function continueHTML(opts) {
    var last = lastPlace(), next = suggestion(), started = Object.keys(state).length > 0 || !!last;
    if (!started && !(opts && opts.always)) return '';
    var items = [];
    if (last && !(last.k === 'lesson' && (isDone(last.id) || next && last.id === next.id))) {
      items.push('<a class="cont-item" href="' + last.href + '"><small>' + T(C.cont) + '</small><b>' + esc(last.title) + '</b></a>');
    }
    if (next) items.push('<a class="cont-item main" href="#/lessons/' + next.id + '"><small>' + T(started ? C.next : C.first) + '</small><b>' + next.id + ', ' + esc(T(next.title)) + '</b></a>');
    else items.push('<p class="muted" style="margin:0">' + T(C.allDone) + '</p>');
    return '<div class="card cont-card"><div class="cont-items">' + items.join('') + '</div>' +
      '<a class="btn ghost small" href="#/map">' + T(C.map) + '</a></div>';
  }

  /* lessons listed under "Before you start" that are not done yet */
  function missingBefore(l) {
    return (l.before || []).map(function (b) { var m = /^#\/lessons\/([A-Z]\d+)$/.exec(b.href || ''); return m && lessonById(m[1]); })
      .filter(function (x) { return x && !isDone(x.id); });
  }
  function usesI2C(l) {
    return (l.parts || []).some(function (p) { var c = p.id && P.componentById(p.id); return c && c.iface.indexOf('i2c') >= 0; });
  }
  function trackOf(l) { return P.tracks.filter(function (t) { return t.id === l.track; })[0]; }
  function chip(id) {
    var s = status(id);
    return s === 'new' ? '' : '<span class="st-chip ' + s + '">' + T(s === 'done' ? L.stDone : L.stBusy) + '</span>';
  }
  function bar(n, total) {
    return '<div class="prog"><i style="width:' + (total ? n / total * 100 : 0) + '%"></i></div>';
  }

  /* ---------- index ---------- */
  function viewIndex(app) {
    var total = P.lessons.length, done = doneCount(P.lessons);
    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 12px">' + T(L.lead).replace('{n}', P.tracks.length) + '</p>' +
      '<div class="callout">' + T(L.before) + ' <a href="#/basics">' + S('navBasics') + '</a> · <a href="#/start">' + S('navStart') + '</a></div>' +
      continueHTML({ always: true }) +
      '<div class="card overall"><div class="overall-top"><b>' + T(L.overall) + '</b><span><b class="mono">' + done + '</b> ' + T(L.of) + ' <b class="mono">' + total + '</b> ' + T(L.lessonsDone) + '</span></div>' +
      bar(done, total) + '<p class="muted" style="font-size:.86rem;margin:8px 0 0">' + T(L.autoDone) + '</p><div class="overall-foot"><span class="muted">' + T(L.saved) + '</span>' +
      '<span style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn small" href="#/progress">' + T({ he: 'ההתקדמות שלי: להדפסה ולהגשה', en: 'My progress: to print and hand in' }) + '</a>' +
      '<button type="button" class="btn ghost small" id="les-reset">' + T(L.reset) + '</button></span></div></div>' +
      P.tracks.map(function (t) {
        var list = P.lessons.filter(function (l) { return l.track === t.id; });
        return '<section class="track" style="--tile-c:var(' + t.color + ')"><div class="track-head"><span class="track-id">' + t.id + '</span><div>' +
          '<h2>' + esc(T(t.title)) + '</h2><p class="muted">' + esc(T(t.desc)) + '</p></div>' +
          '<span class="track-count mono">' + doneCount(list) + ' / ' + list.length + '</span></div>' +
          '<div class="grid c2">' + list.map(function (l) {
            return '<a class="card tile lesson-card ' + status(l.id) + '" href="#/lessons/' + l.id + '"><span class="tile-bar"></span>' +
              '<div class="lesson-top"><span class="tile-num">' + l.id + '</span>' + chip(l.id) + '</div>' +
              '<h3>' + esc(T(l.title)) + '</h3><p>' + esc(P.plain(T(l.goal))) + '</p></a>';
          }).join('') + '</div>' + P.trackQuizCard(t.id) + '</section>';
      }).join('');

    document.getElementById('les-reset').addEventListener('click', function () {
      if (!window.confirm(T(L.resetAsk))) return;
      state = {}; save(); viewIndex(app);
    });
  }

  /* ---------- one lesson ---------- */
  function viewLesson(app, l) {
    var H = P.h, t = trackOf(l);
    var idx = P.lessons.indexOf(l), prev = P.lessons[idx - 1], next = P.lessons[idx + 1];
    var inTrack = P.lessons.filter(function (x) { return x.track === l.track; });
    var s = st(l.id), missing = missingBefore(l);

    var hl = {};
    (l.wiring || []).forEach(function (w) {
      hl[w.num] = hl[w.num] || [];
      var label = P.plain(T(w.tag || w.who));
      if (hl[w.num].indexOf(label) < 0) hl[w.num].push(label);
    });
    var hlFlat = {};
    Object.keys(hl).forEach(function (k) { hlFlat[k] = hl[k].join(' + '); });

    var rows = (l.wiring || []).map(function (w) {
      var pin = P.pinByNum(w.num);
      return '<tr><td><b>' + esc(T(w.who)) + '</b></td>' +
        '<td><a class="pico-pin" href="#/pinout/pin/' + w.num + '">' + H.tag(pin.kind === 'gpio' ? 'gpio' : pin.kind, pin.label, true) +
        '<small>' + S('pin') + ' ' + w.num + '</small></a></td>' +
        '<td class="muted">' + (w.note ? R(w.note) : '') + '</td></tr>';
    }).join('');

    var parts = (l.parts || []).map(function (p) {
      if (p.text) return '<li>' + R(p.text) + '</li>';
      var c = P.componentById(p.id);
      return '<li>' + (p.qty > 1 ? '<b class="mono">' + p.qty + ' ×</b> ' : '') +
        '<a href="#/components/' + c.id + '">' + esc(T(c.name)) + '</a>' + (p.note ? ' <span class="muted">' + R(p.note) + '</span>' : '') + '</li>';
    }).join('');

    app.className = 'page narrow';
    app.innerHTML = H.crumb('#/lessons', T(L.h)) +
      '<div class="eyebrow">' + T(L.track) + ' ' + t.id + ': ' + esc(T(t.title)) + ' · ' + T(L.lesson) + ' ' + (inTrack.indexOf(l) + 1) + ' / ' + inTrack.length + '</div>' +
      '<div class="page-head" style="--head-c:var(' + t.color + ')"><span class="bar"></span><div>' +
      '<h1>' + esc(T(l.title)) + '</h1><p class="lead" style="margin:6px 0 0">' + R(l.goal) + '</p></div></div>' +
      '<div class="vline" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">' + P.verifyBadge('lesson:' + l.id) + P.labSheetButton(l) + '</div>' +
      (missing.length ? '<div class="callout prereq"><b>' + T(L.missing) + '</b> ' + missing.map(function (m) {
        return '<a href="#/lessons/' + m.id + '">' + m.id + ', ' + esc(T(m.title)) + '</a>';
      }).join(' · ') + '<br><span class="muted">' + T(L.missingWhy) + '</span></div>' : '') +

      '<h2>' + T(L.learn) + '</h2>' + H.list(l.learn) +
      (l.before && l.before.length ? '<h2>' + T(L.prep) + '</h2><ul>' + l.before.map(function (b) {
        return '<li>' + (b.href ? '<a href="' + b.href + '">' + esc(T(b.label)) + '</a>' : R(b.label)) + (b.why ? ' <span class="muted">' + R(b.why) + '</span>' : '') + '</li>';
      }).join('') + '</ul>' : '') +

      (parts ? '<h2>' + T(L.parts) + '</h2><ul>' + parts + '</ul><p class="muted" style="font-size:.9rem;margin-top:8px">' + T(L.partsHint) + '</p>' : '') +

      (rows ? '<h2>' + T(L.wiring) + '</h2><div id="wv-host"></div><div class="two-col"><div><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl" id="wire-tbl"><thead><tr><th>' +
        T(L.who) + '</th><th>' + S('wiringPico') + '</th><th>' + S('wiringNote') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
        '<div class="card" id="les-board"></div></div>' : '') +
      (l.boards ? '<h2>' + T(L.wiring) + '</h2><div id="les-boards"></div>' +
        '<a class="btn ghost small" href="#/planner/' + l.boards + '">' + T(L.openPlan) + '</a>' : '') +

      '<h2>' + T(L.steps) + '</h2><p class="muted" style="font-size:.9rem">' + T(L.stepsHint) + '</p>' +
      '<div class="card checks-list" id="les-steps">' + l.steps.map(function (x, i) {
        return '<label class="chk"><input type="checkbox" data-i="' + i + '"' + (s.steps && s.steps[i] ? ' checked' : '') + '><span>' + R(x) + '</span></label>';
      }).join('') + '</div>' +

      '<h2>' + S('explainCode') + '</h2>' + H.codeBlock(l.code, l.explain) +
      (l.second ? '<h3 style="margin-top:22px">' + esc(T(l.second.title)) + '</h3>' + H.codeBlock(l.second.code, l.second.explain) : '') +
      '<h2>' + (l.expectTitle ? T(l.expectTitle) : S('expect')) + '</h2><div class="card ' + (l.expectTitle ? 'rules' : 'expect') + '"><p>' + R(l.expect) + '</p></div>' +
      (usesI2C(l) ? '<div class="card" data-help="i2c" style="margin-top:14px"></div>' : '') +
      P.wokwiHTML(l) +

      (l.tasks && l.tasks.length ? '<h2>' + T(l.tasksTitle || L.tasks) + '</h2><p class="muted" style="font-size:.9rem">' + T(l.tasksHint || L.tasksHint) + '</p>' +
        l.tasks.map(function (k, i) {
          return '<div class="card task"><p><b>' + T(l.taskLabel || L.task) + ' ' + (i + 1) + '.</b> ' + R(k.t) + '</p>' +
            (k.plan ? '<a class="btn ghost small" href="#/planner/' + k.plan + '">' + T(L.openPlan) + '</a>' : '') +
            (k.hint ? '<details><summary>' + T(L.hint) + '</summary><p>' + R(k.hint) + '</p></details>' : '') +
            (k.code ? '<details><summary>' + T(L.solution) + '</summary>' + H.codeBlock(k.code) + '</details>' : '') + '</div>';
        }).join('') : '') +

      H.quiz(l.quiz, 'lesson:' + l.id) +

      '<div class="card les-done" id="les-done"></div>' +
      '<div class="ch-nav">' +
      (prev ? '<a class="btn ghost" href="#/lessons/' + prev.id + '">' + T(L.prev) + ': ' + prev.id + '</a>' : '<a class="btn ghost" href="#/lessons">' + T(L.all) + '</a>') +
      (next ? '<a class="btn" href="#/lessons/' + next.id + '">' + T(L.next) + ': ' + esc(T(next.title)) + '</a>'
        : '<a class="btn" href="#/planner">' + T(L.toPlanner) + '</a>') + '</div>';

    if (rows) {
      P.renderBoard(document.getElementById('les-board'), {
        highlight: hlFlat,
        onSelect: function (pin) { location.hash = '#/pinout/pin/' + pin.num; }
      });
      P.wiringView(document.getElementById('wv-host'), 'L:' + l.id, { rows: app.querySelectorAll('#wire-tbl tbody tr') });
    }

    if (l.boards) {
      /* a lesson with several boards shows the planner's own pictures */
      var proj = P.parseProject(l.boards), plan = P.planProject(proj), host = document.getElementById('les-boards');
      proj.stations.forEach(function (s) {
        var h = document.createElement('h3'), d = document.createElement('div');
        h.textContent = 'Pico ' + s.id;
        host.appendChild(h); host.appendChild(d);
        if (plan[s.id].auto && !plan[s.id].auto.errors.length) P.wiringView(d, plan[s.id].auto.layout);
      });
    }

    var box = document.getElementById('les-done');
    function renderDone() {
      var d = isDone(l.id), next = d ? suggestion() : null;
      box.classList.toggle('on', d);
      box.innerHTML = d
        ? '<b>' + T(L.doneMsg) + '</b><span style="display:flex;gap:8px;flex-wrap:wrap">' +
          (next ? '<a class="btn small" href="#/lessons/' + next.id + '">' + T(C.next) + ': ' + next.id + '</a>' : '') +
          '<button type="button" class="btn ghost small">' + T(L.unmark) + '</button></span>'
        : '<span>' + esc(T(l.title)) + '</span><button type="button" class="btn">' + T(L.markDone) + '</button>';
    }
    document.getElementById('les-steps').addEventListener('change', function (e) {
      if (e.target.matches('input[type=checkbox]')) { setStep(l.id, parseInt(e.target.dataset.i, 10), e.target.checked); renderDone(); }
    });
    /* answering the quiz may complete the lesson; app.js stores the answer on the same click */
    var qbox = app.querySelector('.quiz');
    if (qbox) qbox.addEventListener('click', function (e) { if (e.target.closest('.qz-opt, .qz-check, .qz-reset')) setTimeout(renderDone, 0); });
    box.addEventListener('click', function (e) {
      if (!e.target.closest('button')) return;
      setDone(l.id, !isDone(l.id)); renderDone();
    });
    renderDone();
    P.help.mount(app);
  }

  P.viewLessons = function (app, id, sub) {
    var l = id ? lessonById(id) : null;
    if (l && sub === 'sheet') P.viewLabSheet(app, l);
    else if (l) viewLesson(app, l); else viewIndex(app);
  };
  P.lessonProgress = {
    status: status, isDone: isDone, suggestion: suggestion, continueHTML: continueHTML, lastPlace: lastPlace,
    doneCount: function () { return doneCount(P.lessons); },
    reload: loadState
  };
})(window.PICO);
