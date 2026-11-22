/* Course map (#/map): every basics chapter and every lesson on one page, coloured by the student's progress,
   track by track, with the tracks each track builds on (worked out from the lessons' "Before you start" links).
   Progress comes from P.lessonProgress (lessons.js) and from the saved quiz answers (pico.quiz). */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;
  var B = function (he, en) { return { he: he, en: en }; };
  var L = {
    h: B('מפת הקורס', 'Course map'),
    lead: B('כל הקורס בעמוד אחד. כל ריבוע הוא פרק או שיעור, והצבע שלו מראה כמה התקדמתם. לחצו על ריבוע כדי לפתוח אותו.', 'The whole course on one page. Each square is a chapter or a lesson, and its colour shows how far you have got. Click a square to open it.'),
    basics: B('יסודות', 'Basics'),
    basicsDesc: B('פרקי קריאה קצרים. פרק נחשב שנקרא כשעונים על כל השאלות שבסופו.', 'Short reading chapters. A chapter counts as read once every question at its end is answered.'),
    builds: B('נשען על מסלולים', 'Builds on tracks'),
    none: B('אפשר להתחיל ישר', 'You can start straight away'),
    legend: [['new', B('עוד לא התחלתם', 'Not started')], ['busy', B('בתהליך', 'In progress')], ['done', B('הושלם', 'Done')]],
    progress: B('ההתקדמות שלי', 'My progress'),
    lessons: B('לכל השיעורים', 'All lessons')
  };

  function quizRec(key) { var all; try { all = JSON.parse(localStorage.getItem('pico.quiz')) || {}; } catch (e) { all = {}; } return all[key]; }
  function chapterState(c) {
    var r = quizRec('basics:' + c.id), n = (c.quiz || []).length, k = r && r.a ? Object.keys(r.a).length : 0;
    return n && k >= n ? 'done' : k ? 'busy' : 'new';
  }
  /* the other tracks whose lessons this track's lessons point to under "Before you start" */
  function buildsOn(trackId) {
    var seen = {};
    P.lessons.forEach(function (l) {
      if (l.track !== trackId) return;
      (l.before || []).forEach(function (b) {
        var m = /^#\/lessons\/([A-Z])\d+$/.exec(b.href || '');
        if (m && m[1] !== trackId) seen[m[1]] = true;
      });
    });
    return P.tracks.map(function (t) { return t.id; }).filter(function (id) { return seen[id]; });
  }
  function cell(href, label, title, state) {
    return '<a class="cm-cell ' + state + '" href="' + href + '" title="' + esc(title) + '"><b>' + esc(label) + '</b><span>' + esc(title) + '</span></a>';
  }

  /* ---------- end-of-track review (#/review/<track>) ----------
     Up to 10 questions drawn from the track's lessons, in a fixed shuffled order. Saved under 'track:<id>'. */
  var RV = {
    card: B('בדקו את עצמכם על כל המסלול', 'Check yourself on the whole track'),
    open: B('למבחן המסלול', 'To the track quiz'),
    score: B('ציון: {r} מתוך {n}', 'Score: {r} of {n}'),
    h: B('בדקו את עצמכם: מסלול', 'Check yourself: track'),
    lead: B('שאלות מכל השיעורים במסלול, בסדר מעורבב. חלק מהן כבר ראיתם בשיעורים, וזו הזדמנות לבדוק שאתם עדיין זוכרים. ענו בלי לחזור לשיעור, ורק אחר כך בדקו מה פספסתם.', 'Questions from every lesson in the track, in a mixed order. You have seen some of them in the lessons, and this is a chance to check you still remember. Answer without going back to the lesson, and only then check what you missed.'),
    back: B('למפת הקורס', 'To the course map'),
    none: B('במסלול הזה אין עדיין שאלות.', 'This track has no questions yet.')
  };
  function seedOf(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  P.trackQuizItems = function (trackId) {
    var all = [];
    P.lessons.forEach(function (l) { if (l.track === trackId) (l.quiz || []).forEach(function (q) { all.push(q); }); });
    var s = seedOf('track|' + trackId);
    for (var i = all.length - 1; i > 0; i--) { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9E3779B9) >>> 0; var j = s % (i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
    return all.slice(0, 10);
  };
  P.trackQuizCard = function (trackId) {
    var items = P.trackQuizItems(trackId);
    if (items.length < 3) return '';
    var rec = P.quiz.load()['track:' + trackId], sc = P.quiz.score(items, rec);
    return '<a class="cm-review" href="#/review/' + trackId + '"><span>' + T(RV.card) + '</span><b>' +
      (sc.done ? T(RV.score).replace('{r}', sc.right).replace('{n}', sc.n) : T(RV.open)) + '</b></a>';
  };
  P.viewReview = function (app, trackId) {
    var t = P.tracks.filter(function (x) { return x.id === trackId; })[0];
    if (!t) { location.hash = '#/map'; return; }
    var items = P.trackQuizItems(trackId);
    app.className = 'page narrow';
    app.innerHTML = P.h.crumb('#/map', T(RV.back)) +
      '<div class="page-head" style="--head-c:var(' + t.color + ')"><span class="bar"></span><div><h1>' + T(RV.h) + ' ' + t.id + '</h1>' +
      '<p class="lead" style="margin:6px 0 0">' + esc(T(t.title)) + '</p></div></div>' +
      '<p>' + T(RV.lead) + '</p>' + (items.length ? P.quiz.html(items, 'track:' + trackId) : '<p class="muted">' + T(RV.none) + '</p>');
  };

  P.viewMap = function (app) {
    var lp = P.lessonProgress;
    var rows = '<section class="cm-row" style="--tile-c:var(--c-uart)"><div class="cm-head"><span class="track-id">·</span><div><h2>' + T(L.basics) + '</h2><p class="muted">' + T(L.basicsDesc) + '</p></div>' +
      '<span class="track-count mono">' + P.basics.filter(function (c) { return chapterState(c) === 'done'; }).length + ' / ' + P.basics.length + '</span></div>' +
      '<div class="cm-cells">' + P.basics.map(function (c, i) { return cell('#/basics/' + c.id, String(i + 1), T(c.title), chapterState(c)); }).join('') + '</div></section>';
    rows += P.tracks.map(function (t) {
      var list = P.lessons.filter(function (l) { return l.track === t.id; });
      var dep = buildsOn(t.id);
      var done = list.filter(function (l) { return lp.isDone(l.id); }).length;
      return '<section class="cm-row" style="--tile-c:var(' + t.color + ')"><div class="cm-head"><span class="track-id">' + t.id + '</span><div><h2>' + esc(T(t.title)) + '</h2>' +
        '<p class="muted">' + (dep.length ? T(L.builds) + ': ' + dep.map(function (d) { return '<b class="mono">' + d + '</b>'; }).join(', ') : T(L.none)) + '</p></div>' +
        '<span class="track-count mono">' + done + ' / ' + list.length + '</span></div>' +
        '<div class="cm-cells">' + list.map(function (l) { return cell('#/lessons/' + l.id, l.id, T(l.title), lp.status(l.id)); }).join('') + '</div>' +
        (P.trackQuizCard ? P.trackQuizCard(t.id) : '') + '</section>';
    }).join('');
    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 12px">' + T(L.lead) + '</p>' +
      lp.continueHTML({ always: true }).replace(/<a class="btn ghost small" href="#\/map">[^<]*<\/a>/, '') +
      '<div class="cm-legend">' + L.legend.map(function (x) { return '<span><i class="cm-dot ' + x[0] + '"></i>' + T(x[1]) + '</span>'; }).join('') +
      '<span class="cm-links"><a href="#/lessons">' + T(L.lessons) + '</a> · <a href="#/progress">' + T(L.progress) + '</a></span></div>' + rows;
  };
})(window.PICO);
