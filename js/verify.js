/* Checking the site on a real board.
   - P.verifyBadge(key) is the small tag at the top of a page: checked on a board, or not yet.
   - P.viewVerify(app) is the lecturer's test page (#/verify): for each page, what to build,
     what to run and what should happen, with "worked" / "did not work" and a note.
     Marks are kept in this browser (pico.verify). "Export" writes a new js/data-verify.js. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc, R = function (v) { return P.rich(T(v)); };
  var B = function (he, en) { return { he: he, en: en }; };
  var KEY = 'pico.verify';

  var L = {
    ok: B('נבדק על לוח', 'Checked on a board'), not: B('עוד לא נבדק על לוח', 'Not yet checked on a board'),
    notTip: B('הקוד בעמוד הזה נכתב לפי התיעוד, ועדיין לא הורץ על Pico 2 אמיתי. אם משהו לא עובד, בדקו את החיווט ואת ההודעה שמופיעה ב-Thonny.', 'The code on this page was written from the documentation and has not yet been run on a real Pico 2. If something does not work, check the wiring and the message in Thonny.'),
    h: B('בדיקה על לוח אמיתי', 'Checking on a real board'),
    lead: B('העמוד הזה מיועד למרצה. עברו על כל עמוד ברשימה עם Pico 2 ורכיבים אמיתיים, וסמנו אם הוא עבד. הסימונים נשמרים בדפדפן הזה. בסוף לחצו על "ייצוא", והחליפו את התוכן של הקובץ js/data-verify.js בתוכן שנוצר. מאותו רגע, כל עמוד שעבד יציג את התג "נבדק על לוח".',
      'This page is for the lecturer. Go through each page on the list with a Pico 2 and real parts, and mark whether it worked. The marks are kept in this browser. At the end press "Export" and replace the file js/data-verify.js with what it produces. From then on every page that worked shows the tag "Checked on a board".'),
    metaH: B('פרטי הבדיקה', 'About this test run'), by: B('שם הבודק', 'Tested by'), board: B('לוח', 'Board'), fw: B('גרסת MicroPython', 'MicroPython version'), rev: B('גרסת שבב', 'Chip revision'),
    read: B('קראו את פרטי הלוח', 'Read board details'),
    readTip: B('חברו את הלוח בכבל USB. הכפתור מריץ על הלוח שלוש שורות קוד וממלא את השדות בעצמו. עובד ב-Chrome או ב-Edge במחשב.', 'Plug the board in with a USB cable. The button runs three lines of code on the board and fills in the fields. Works in Chrome or Edge on a computer.'),
    readFail: B('לא התקבלו פרטים מהלוח. בדקו שהוא מחובר ושמותקן עליו MicroPython, או מלאו את השדות ידנית.', 'No details came back from the board. Check that it is connected and has MicroPython, or fill in the fields by hand.'),
    revNote: B('מספר הגרסה נקרא מהרגיסטר CHIP_ID. עדיין לא אומת איך המספר הזה מתאים לסימון A2, A3 או A4 שעל השבב, ולכן השוו לכיתוב שמודפס על השבב עצמו.', 'The revision number is read from the CHIP_ID register. How it maps to the A2, A3 or A4 marking on the chip has not been confirmed yet: compare with the text printed on the chip itself.'),
    sumH: B('התקדמות', 'Progress'), worked: B('עבד', 'Worked'), failed: B('לא עבד', 'Did not work'), unchecked: B('לא נבדק', 'Not checked'),
    coreH: B('המסלול הבסיסי: התחילו כאן', 'The core path: start here'),
    coreLead: B('דף ההתחלה, פרקי היסודות 1 עד 8 ומסלולי השיעורים A עד D. את כל אלה סטודנט עובר בשבועות הראשונים.', 'The Get started page, basics chapters 1 to 8 and lesson tracks A to D. This is what a student goes through in the first weeks.'),
    moreH: B('שאר האתר', 'The rest of the site'),
    moreLead: B('פרקי היסודות 9 עד 14, המסלולים E עד H ודפי הרכיבים. בודקים אותם אחרי המסלול הבסיסי.', 'Basics chapters 9 to 14, tracks E to H and the component pages. After the core path.'),
    build: B('מה בונים', 'What to build'), run: B('מה מריצים', 'What to run'), expect: B('מה אמור לקרות', 'What should happen'),
    note: B('הערה (מה לא עבד, מה ראיתם)', 'Note (what did not work, what you saw)'),
    noParts: B('רק הלוח, בלי רכיבים חיצוניים.', 'Just the board, no outside parts.'),
    codeN: B('קטעי קוד בפרק', 'code blocks in the chapter'), codeRun: B('הריצו כל קטע קוד בפרק, ובדקו שהוא עושה מה שהטקסט מתאר.', 'Run each code block in the chapter, and check that it does what the text says.'),
    readOnly: B('פרק קריאה: אין בו קוד להריץ. בדקו שההסברים והאיורים נכונים.', 'A reading chapter: no code to run. Check that the explanations and drawings are right.'),
    lessonRun: B('הקוד הראשי של השיעור, ואחריו פתרונות המשימות.', 'The lesson\'s main code, then the task solutions.'),
    compRun: B('הקוד שבעמוד הרכיב.', 'The code on the component page.'),
    exportH: B('ייצוא', 'Export'),
    exportLead: B('הקובץ כולל את כל העמודים שסומנו "עבד", יחד עם מה שכבר היה בו. עמוד שסומן "לא עבד" יוסר מהקובץ. שלחו אליי את רשימת התקלות כדי שאוכל לתקן אותן.', 'The file holds every page marked "Worked", together with what was already in it. A page marked "Did not work" is taken out. Send me the list of failures so I can fix them.'),
    makeFile: B('צרו את data-verify.js', 'Make data-verify.js'), download: B('הורידו את הקובץ', 'Download file'), copy: B('העתיקו', 'Copy'), copied: B('הועתק', 'Copied'),
    failH: B('רשימת התקלות', 'List of failures'), noFail: B('לא סומנה אף תקלה.', 'No failures marked.'),
    reset: B('נקו את כל הסימונים', 'Clear all marks'), resetAsk: B('למחוק את כל הסימונים בדפדפן הזה?', 'Delete every mark in this browser?'),
    start: B('דף ההתחלה', 'Get started'),
    startBuild: B('לוח Pico 2 וכבל USB שמעביר נתונים.', 'A Pico 2 and a USB cable that carries data.'),
    startRun: B('כל השלבים: הורדת MicroPython, צריבה עם BOOTSEL, התקנת Thonny, התוכנית שמהבהבת את הלד שעל הלוח, ושמירה בשם main.py.', 'Every step: download MicroPython, flash with BOOTSEL, install Thonny, the program that blinks the LED on the board, and saving as main.py.'),
    startExpect: B('הלד שעל הלוח מהבהב, וממשיך להבהב גם אחרי שמנתקים את הכבל ומחברים אותו מחדש.', 'The LED on the board blinks, and keeps blinking after the cable is unplugged and plugged back in.'),
    chapter: B('פרק', 'Chapter'), lesson: B('שיעור', 'Lesson'), comp: B('רכיב', 'Part')
  };

  /* ---------- the badge ---------- */
  P.verifyBadge = function (key) {
    var v = P.verified && P.verified[key];
    if (v) {
      var bits = [v.date, v.firmware ? 'MicroPython ' + v.firmware : '', v.rev ? 'rev ' + v.rev : ''].filter(Boolean).join(' · ');
      return '<span class="vbadge ok" title="' + esc([v.board, v.by].filter(Boolean).join(' · ')) + '"><span aria-hidden="true">✔</span> ' + T(L.ok) + (bits ? ' <small class="ltr">' + esc(bits) + '</small>' : '') + '</span>';
    }
    return '<span class="vbadge" title="' + esc(T(L.notTip)) + '">' + T(L.not) + '</span>';
  };

  /* ---------- the list of pages to check ---------- */
  function partsText(parts) {
    var names = (parts || []).map(function (p) {
      if (p.text) return P.plain(T(p.text));
      var c = P.componentById(p.id);
      return (p.qty > 1 ? p.qty + ' × ' : '') + (c ? T(c.name) : p.id);
    });
    return names.length ? names.join(', ') : T(L.noParts);
  }
  function groups() {
    var core = [{ key: 'start', title: L.start, href: '#/start', build: T(L.startBuild), run: T(L.startRun), expect: T(L.startExpect) }];
    var more = [];
    P.basics.forEach(function (c, i) {
      var codes = c.blocks.filter(function (b) { return b.code; }).length;
      var it = { key: 'basics:' + c.id, kind: L.chapter, num: i + 1, title: c.title, href: '#/basics/' + c.id,
        build: T(L.noParts), run: codes ? codes + ' ' + T(L.codeN) + '. ' + T(L.codeRun) : T(L.readOnly), expect: '' };
      (i < 8 ? core : more).push(it);
    });
    P.lessons.forEach(function (l) {
      var it = { key: 'lesson:' + l.id, kind: L.lesson, num: l.id, title: l.title, href: '#/lessons/' + l.id,
        build: partsText(l.parts), run: T(L.lessonRun), expect: l.expect ? P.plain(T(l.expect)) : '' };
      ('ABCDT'.indexOf(l.track) >= 0 ? core : more).push(it);
    });
    P.components.forEach(function (c) {
      more.push({ key: 'component:' + c.id, kind: L.comp, title: c.name, href: '#/components/' + c.id, build: T(c.name), run: T(L.compRun), expect: c.expect ? P.plain(T(c.expect)) : '' });
    });
    return { core: core, more: more };
  }

  /* ---------- marks kept in this browser ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function fileText(s) {
    var out = {};
    Object.keys(P.verified || {}).forEach(function (k) { out[k] = P.verified[k]; });
    Object.keys(s.items || {}).forEach(function (k) {
      var m = s.items[k];
      if (m.st === 'ok') out[k] = { date: m.date || today(), board: s.meta.board || '', firmware: s.meta.fw || '', rev: s.meta.rev || '', by: s.meta.by || '', note: m.note || '' };
      else if (m.st === 'bad') delete out[k];
    });
    var body = Object.keys(out).sort().map(function (k) { return '    ' + JSON.stringify(k) + ': ' + JSON.stringify(out[k]); }).join(',\n');
    return '/* What has been checked on a real board.\n' +
      '   Each key is a page: \'start\', \'basics:<chapter id>\', \'lesson:<lesson id>\', \'component:<part id>\'.\n' +
      '   Made by the test page (#/verify) on ' + today() + '. */\n' +
      '(function (P) {\n  \'use strict\';\n  P.verified = {\n' + body + (body ? '\n' : '') + '  };\n})(window.PICO);\n';
  }
  function failText(s, all) {
    var lines = [];
    all.forEach(function (it) {
      var m = (s.items || {})[it.key];
      if (m && m.st === 'bad') lines.push(it.key + ' (' + T(it.title) + '): ' + (m.note || '-'));
    });
    return lines.join('\n');
  }

  /* ---------- the page ---------- */
  P.viewVerify = function (app) {
    var s = load();
    s.meta = s.meta || {}; s.items = s.items || {};
    var G = groups(), all = G.core.concat(G.more);

    function itemHTML(it) {
      var m = s.items[it.key] || {}, done = P.verified && P.verified[it.key];
      return '<div class="card vf-item' + (m.st ? ' st-' + m.st : '') + '" data-key="' + esc(it.key) + '">' +
        '<div class="vf-top"><a href="' + it.href + '" target="_blank" rel="noopener"><b>' + (it.kind ? T(it.kind) + ' ' + esc(String(it.num || '')) + ': ' : '') + esc(T(it.title)) + '</b></a>' +
        (done ? ' <span class="vbadge ok"><span aria-hidden="true">✔</span> ' + esc(done.date || '') + '</span>' : '') +
        '<span class="vf-st" role="group">' + ['ok', 'bad', ''].map(function (st) {
          return '<button type="button" class="chip' + ((m.st || '') === st ? ' on' : '') + '" data-st="' + st + '" aria-pressed="' + ((m.st || '') === st) + '">' + T(st === 'ok' ? L.worked : st === 'bad' ? L.failed : L.unchecked) + '</button>';
        }).join('') + '</span></div>' +
        '<dl class="vf-dl"><dt>' + T(L.build) + '</dt><dd>' + esc(it.build) + '</dd><dt>' + T(L.run) + '</dt><dd>' + esc(it.run) + '</dd>' +
        (it.expect ? '<dt>' + T(L.expect) + '</dt><dd>' + esc(it.expect) + '</dd>' : '') + '</dl>' +
        '<label class="vf-note"><span class="muted">' + T(L.note) + '</span><input type="text" data-note value="' + esc(m.note || '') + '"></label></div>';
    }
    function counts(list) {
      var c = { ok: 0, bad: 0, none: 0 };
      list.forEach(function (it) { var m = s.items[it.key]; if (m && m.st === 'ok') c.ok++; else if (m && m.st === 'bad') c.bad++; else c.none++; });
      return c;
    }
    function sumHTML() {
      var a = counts(G.core), b = counts(G.more);
      var row = function (h, c, n) { return '<tr><td>' + T(h) + '</td><td class="ltr"><b>' + c.ok + '</b></td><td class="ltr">' + c.bad + '</td><td class="ltr">' + c.none + '</td><td class="ltr">' + n + '</td></tr>'; };
      return '<table class="tbl"><thead><tr><th></th><th>' + T(L.worked) + '</th><th>' + T(L.failed) + '</th><th>' + T(L.unchecked) + '</th><th>Σ</th></tr></thead><tbody>' +
        row(L.coreH, a, G.core.length) + row(L.moreH, b, G.more.length) + '</tbody></table>';
    }
    function field(k, label) { return '<label class="vf-f"><span>' + T(label) + '</span><input type="text" data-meta="' + k + '" value="' + esc(s.meta[k] || '') + '"' + (k === 'by' ? '' : ' dir="ltr"') + '></label>'; }

    app.className = 'page narrow';
    app.innerHTML = '<div id="vf-root">' + '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:8px 18px">' + T(L.lead) + '</p>' +
      '<h2>' + T(L.metaH) + '</h2><div class="card vf-meta">' + field('by', L.by) + field('board', L.board) + field('fw', L.fw) + field('rev', L.rev) +
      '<div class="vf-acts"><button type="button" class="btn small" id="vf-read">' + T(L.read) + '</button><span class="muted" id="vf-read-msg">' + T(L.readTip) + '</span></div>' +
      '<p class="muted" style="font-size:.85rem;margin:6px 0 0">' + T(L.revNote) + '</p></div>' +
      '<h2>' + T(L.sumH) + '</h2><div class="card tbl-wrap" id="vf-sum" style="padding:8px 12px">' + sumHTML() + '</div>' +
      '<h2>' + T(L.coreH) + '</h2><p>' + T(L.coreLead) + '</p><div class="vf-list">' + G.core.map(itemHTML).join('') + '</div>' +
      '<details class="vf-more"><summary><h2 style="display:inline">' + T(L.moreH) + '</h2></summary><p>' + T(L.moreLead) + '</p><div class="vf-list">' + G.more.map(itemHTML).join('') + '</div></details>' +
      '<h2>' + T(L.exportH) + '</h2><p>' + T(L.exportLead) + '</p><div class="vf-acts"><button type="button" class="btn" id="vf-make">' + T(L.makeFile) + '</button>' +
      '<button type="button" class="btn ghost small" id="vf-reset">' + T(L.reset) + '</button></div><div id="vf-out"></div></div>';
    var root = document.getElementById('vf-root');

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var card = b.closest('.vf-item');
      if (card && b.hasAttribute('data-st')) {
        var k = card.getAttribute('data-key'), st = b.getAttribute('data-st'), m = s.items[k] || {};
        m.st = st; m.date = today();
        if (!st && !m.note) delete s.items[k]; else s.items[k] = m;
        save(s);
        card.className = 'card vf-item' + (st ? ' st-' + st : '');
        card.querySelectorAll('[data-st]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
        document.getElementById('vf-sum').innerHTML = sumHTML();
      } else if (b.id === 'vf-read') readBoard(b);
      else if (b.id === 'vf-make') makeFile();
      else if (b.id === 'vf-reset') { if (window.confirm(T(L.resetAsk))) { s = { meta: s.meta, items: {} }; save(s); P.viewVerify(app); } }
      else if (b.dataset.copy) { var src = document.getElementById(b.dataset.copy); P.h.copyText(src.value, function () { b.textContent = T(L.copied); }); }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-meta')) { s.meta[t.getAttribute('data-meta')] = t.value.trim(); save(s); }
      else if (t.hasAttribute('data-note')) {
        var k = t.closest('.vf-item').getAttribute('data-key'), m = s.items[k] || {};
        m.note = t.value.trim(); if (!m.date) m.date = today();
        s.items[k] = m; save(s);
      }
    });

    async function readBoard(btn) {
      var msg = document.getElementById('vf-read-msg');
      btn.disabled = true;
      var out = await P.board.run(['import os, machine', 'u = os.uname()', "print('@@' + u.machine + '|' + u.release + '|' + str(machine.mem32[0x40000000] >> 28))"].join('\n'));
      btn.disabled = false;
      var line = (out || '').split('\n').filter(function (x) { return x.indexOf('@@') === 0; })[0];
      if (!line) { msg.textContent = T(L.readFail); return; }
      var f = line.slice(2).trim().split('|');
      s.meta.board = f[0] || ''; s.meta.fw = (f[1] || '').trim(); s.meta.rev = (f[2] || '').trim();
      save(s);
      ['board', 'fw', 'rev'].forEach(function (k) { app.querySelector('[data-meta="' + k + '"]').value = s.meta[k]; });
      msg.textContent = s.meta.board + ' · MicroPython ' + s.meta.fw;
    }
    function makeFile() {
      var txt = fileText(s), fails = failText(s, all);
      var url = URL.createObjectURL(new Blob([txt], { type: 'text/javascript' }));
      document.getElementById('vf-out').innerHTML =
        '<div class="vf-acts" style="margin-top:12px"><a class="btn small" download="data-verify.js" href="' + url + '">' + T(L.download) + '</a><button type="button" class="btn ghost small" data-copy="vf-file">' + T(L.copy) + '</button></div>' +
        '<textarea id="vf-file" class="vf-text" dir="ltr" readonly rows="10">' + esc(txt) + '</textarea>' +
        '<h3>' + T(L.failH) + '</h3>' + (fails ? '<div class="vf-acts"><button type="button" class="btn ghost small" data-copy="vf-fails">' + T(L.copy) + '</button></div><textarea id="vf-fails" class="vf-text" dir="auto" readonly rows="6">' + esc(fails) + '</textarea>' : '<p class="muted">' + T(L.noFail) + '</p>');
    }
  };
})(window.PICO);
