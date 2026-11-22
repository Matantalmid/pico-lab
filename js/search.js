/* Site-wide search (#/search?q=...): lessons, basics chapters, components, interfaces and glossary terms.
   The index is built in memory from the same data the pages use, in the current language, the first time
   it is needed. Every word of the query must appear; a hit in the title counts more than one in the text. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;
  var B = function (he, en) { return { he: he, en: en }; };
  var L = {
    h: B('חיפוש באתר', 'Search the site'),
    ph: B('מה מחפשים? למשל: ריטוט, I2C, מסך, סרוו', 'What are you looking for? For example: bounce, I2C, display, servo'),
    hint: B('הקלידו לפחות שתי אותיות. החיפוש עובר על השיעורים, פרקי היסודות, הרכיבים, הממשקים והמילון.', 'Type at least two letters. The search covers the lessons, the basics chapters, the components, the interfaces and the glossary.'),
    none: B('לא נמצא שום דבר. נסו מילה אחרת, או מילה אחת בלבד.', 'Nothing found. Try another word, or a single word.'),
    groups: { lesson: B('שיעורים', 'Lessons'), basics: B('פרקי יסודות', 'Basics chapters'), component: B('רכיבים', 'Components'), iface: B('ממשקים', 'Interfaces'), term: B('מונחים במילון', 'Glossary terms') },
    more: B('ועוד {n} תוצאות', 'and {n} more results')
  };

  /* every {he, en} text inside an object, in the current language */
  function texts(o, out, depth) {
    if (!o || depth > 6) return out;
    if (typeof o === 'object' && typeof o.he === 'string' && typeof o.en === 'string') { out.push(T(o)); return out; }
    if (Array.isArray(o)) { o.forEach(function (x) { texts(x, out, depth + 1); }); return out; }
    if (typeof o === 'object') Object.keys(o).forEach(function (k) { if (k !== 'code' && k !== 'wokwi') texts(o[k], out, depth + 1); });
    return out;
  }
  function norm(s) { return P.plain(String(s)).toLowerCase().replace(/[֑-ׇ]/g, '').replace(/\s+/g, ' '); }

  var index = null, indexLang = null;
  function build() {
    var items = [];
    function add(kind, href, title, rest) {
      var body = texts(rest, [], 0).join(' · ');
      items.push({ kind: kind, href: href, title: title, t: norm(title), b: norm(body), raw: P.plain(body) });
    }
    P.lessons.forEach(function (l) { add('lesson', '#/lessons/' + l.id, l.id + ', ' + T(l.title), [l.goal, l.learn, l.steps, l.explain, l.expect, l.tasks]); });
    P.basics.forEach(function (c, i) { add('basics', '#/basics/' + c.id, (i + 1) + '. ' + T(c.title), [c.lead, c.blocks]); });
    P.components.forEach(function (c) { var rest = {}; Object.keys(c).forEach(function (k) { if (k !== 'name' && k !== 'code') rest[k] = c[k]; }); add('component', '#/components/' + c.id, T(c.name), rest); });
    P.interfaces.forEach(function (it) { var rest = {}; Object.keys(it).forEach(function (k) { if (k !== 'name' && k !== 'code') rest[k] = it[k]; }); add('iface', '#/interfaces/' + it.id, T(it.name), rest); });
    Object.keys(P.glossary).forEach(function (id) { var g = P.glossary[id]; add('term', '#/glossary/' + id, T(g.t), [g.d]); });
    index = items; indexLang = P.lang();
  }

  function search(q) {
    if (!index || indexLang !== P.lang()) build();
    var words = norm(q).split(' ').filter(function (w) { return w.length > 1; });
    if (!words.length) return null;
    var hits = [];
    index.forEach(function (it) {
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i], inT = it.t.indexOf(w) >= 0, inB = it.b.indexOf(w) >= 0;
        if (!inT && !inB) return;
        score += (inT ? 10 : 0) + (inB ? 1 : 0);
      }
      hits.push({ it: it, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return { words: words, hits: hits };
  }
  function snippet(it, words) {
    var low = it.raw.toLowerCase().replace(/[֑-ׇ]/g, ''), at = -1;
    words.forEach(function (w) { var i = low.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; });
    if (at < 0) return esc(it.raw.slice(0, 140)) + (it.raw.length > 140 ? '…' : '');
    var from = Math.max(0, at - 60), to = Math.min(it.raw.length, at + 120);
    var s = esc((from ? '…' : '') + it.raw.slice(from, to) + (to < it.raw.length ? '…' : ''));
    words.forEach(function (w) { s = s.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); });
    return s;
  }
  function resultsHTML(q) {
    var r = search(q || '');
    if (!r) return '<p class="muted">' + T(L.hint) + '</p>';
    if (!r.hits.length) return '<p class="muted">' + T(L.none) + '</p>';
    /* groups in the order of their best hit, so an exact term or title comes first */
    var order = [];
    r.hits.forEach(function (h) { if (order.indexOf(h.it.kind) < 0) order.push(h.it.kind); });
    return order.map(function (kind) {
      var list = r.hits.filter(function (h) { return h.it.kind === kind; });
      if (!list.length) return '';
      var shown = list.slice(0, 8);
      return '<section class="sr-group"><h2>' + T(L.groups[kind]) + ' <span class="muted mono">' + list.length + '</span></h2>' +
        shown.map(function (h) { return '<a class="card sr-item" href="' + h.it.href + '"><b>' + esc(h.it.title) + '</b><p>' + snippet(h.it, r.words) + '</p></a>'; }).join('') +
        (list.length > shown.length ? '<p class="muted">' + T(L.more).replace('{n}', list.length - shown.length) + '</p>' : '') + '</section>';
    }).join('');
  }

  P.viewSearch = function (app) {
    var m = /[?&]q=([^&]*)/.exec(location.hash), q = m ? decodeURIComponent(m[1]) : '';
    app.className = 'page narrow';
    app.innerHTML = '<h1>' + T(L.h) + '</h1>' +
      '<input type="search" id="sr-q" class="sr-input" autocomplete="off" placeholder="' + esc(T(L.ph)) + '" aria-label="' + esc(T(L.h)) + '" value="' + esc(q) + '">' +
      '<div id="sr-out" aria-live="polite">' + resultsHTML(q) + '</div>';
    var input = document.getElementById('sr-q'), out = document.getElementById('sr-out'), timer = null;
    input.focus();
    input.setSelectionRange(q.length, q.length);
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        out.innerHTML = resultsHTML(input.value);
        history.replaceState(null, '', '#/search' + (input.value ? '?q=' + encodeURIComponent(input.value) : ''));
      }, 120);
    });
  };
})(window.PICO);
