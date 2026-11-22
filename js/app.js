/* Router and page views. Hash routes so the site works from any folder
   or static host with no server configuration. */
(function (P) {
  'use strict';
  var T = P.t, S = P.s, esc = P.esc, R = function (v) { return P.rich(T(v)); };
  var app = document.getElementById('app');

  var TYPE_COLOR = {
    gpio: '--c-gpio', adc: '--c-adc', pwm: '--c-pwm', i2c: '--c-i2c', spi: '--c-spi',
    uart: '--c-uart', pio: '--c-pio', onewire: '--c-adc', power: '--c-power', gnd: '--c-gnd', sys: '--c-sys'
  };
  var TYPE_NAME = {
    gpio: 'GPIO', adc: 'ADC', pwm: 'PWM', i2c: 'I2C', spi: 'SPI', uart: 'UART', pio: 'PIO', onewire: 'One-Wire',
    power: { he: 'מתח', en: 'Power' }, gnd: 'GND', sys: { he: 'מערכת', en: 'System' }
  };

  /* ---------- small helpers ---------- */
  function highlight(line) {
    var re = /(#.*$)|(b?"(?:\\.|[^"\\])*"|b?'(?:\\.|[^'\\])*')|\b(from|import|while|for|in|if|else|elif|def|return|True|False|None|not|and|or|with|as)\b|\b(0x[0-9a-fA-F]+|\d[\d_]*(?:\.\d+)?)\b|(@[\w.]+)/g;
    var out = '', last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      var cls = m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : m[4] ? 'tk-n' : 'tk-d';
      out += '<span class="' + cls + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + esc(line.slice(last));
  }

  /* A code block with Run and Copy buttons. With `explain`, the lines are
     numbered and a line-by-line walk-through is listed underneath. */
  function codeBlock(lines, explain, noRun) {
    var raw = lines.join('\n');
    var html = '<div class="code' + (explain ? ' numbered' : '') + '" data-code="' + esc(raw) + '"><div class="code-btns">' +
      (noRun ? '' : '<button type="button" class="run"><b aria-hidden="true">▶</b><span> ' + esc(P.board.runLabel()) + '</span></button>') +
      '<button type="button" class="copy">' + S('copy') + '</button></div>' +
      '<pre><code>' + lines.map(function (l, i) {
        return '<span class="ln" data-n="' + (i + 1) + '">' + (highlight(l) || ' ') + '</span>';
      }).join('') + '</code></pre></div>';
    if (!explain || !explain.length) return html;
    return '<div class="walk-wrap">' + html + '<ol class="walk">' + explain.map(function (e) {
      var a = e.l[0], b = e.l[1] || e.l[0];
      return '<li tabindex="0" data-from="' + a + '" data-to="' + b + '"><span class="walk-ln">' +
        (a === b ? S('line') + ' ' + a : S('lines') + ' <bdi dir="ltr">' + a + '–' + b + '</bdi>') + '</span><span>' + R(e.t) + '</span></li>';
    }).join('') + '</ol></div>';
  }

  /* Check questions: the engine is in quiz.js (P.quiz). */
  function quizLoad() { return P.quiz.load(); }
  function quiz(items, key) { return P.quiz.html(items, key); }
  P.quizResults = function () {
    var all = quizLoad(), out = {};
    function add(key, items) { if (items && items.length) out[key] = P.quiz.score(items, all[key]); }
    P.lessons.forEach(function (l) { add('lesson:' + l.id, l.quiz); });
    P.basics.forEach(function (c) { add('basics:' + c.id, c.quiz); });
    P.interfaces.forEach(function (it) { add('iface:' + it.id, it.quiz); });
    if (P.trackQuizItems) P.tracks.forEach(function (t) { add('track:' + t.id, P.trackQuizItems(t.id)); });
    return out;
  };

  function tag(type, label, big) {
    return '<span class="tag t-' + type + (big ? ' big' : '') + '">' + esc(label) + '</span>';
  }
  function ifaceTag(id) {
    var it = P.interfaceById(id);
    return tag(it.type, T(TYPE_NAME[it.type]), true);
  }
  function compCard(c) {
    return '<a class="card tile comp-tile" data-cat="' + c.cat + '" data-name="' + esc((c.name.he + ' ' + c.name.en + ' ' + c.id).toLowerCase()) + '" href="#/components/' + c.id + '" style="--tile-c:var(' + TYPE_COLOR[P.interfaceById(c.iface[0]).type] + ')">' +
      '<span class="tile-bar"></span><div class="thumb" aria-hidden="true">' + P.art(c.id) + '</div><div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">' + c.iface.map(ifaceTag).join('') + '</div>' +
      '<h3>' + esc(T(c.name)) + '</h3><p>' + esc(P.plain(T(c.summary))) + '</p></div></a>';
  }
  function list(items, ordered) {
    var t = ordered ? 'ol' : 'ul';
    return '<' + t + '>' + items.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</' + t + '>';
  }
  function paras(items) {
    return items.map(function (x) { return '<p>' + R(x) + '</p>'; }).join('');
  }
  function crumb(href, label) {
    var arrow = P.lang() === 'he' ? '→' : '←';
    return '<a class="crumb" href="' + href + '"><span aria-hidden="true">' + arrow + '</span> ' + esc(label) + '</a>';
  }

  /* ---------- home ---------- */
  function viewHome() {
    var L = {
      eyebrow: { he: 'מדריך אינטראקטיבי למתחילים', en: 'An interactive guide for beginners' },
      lead: {
        he: 'ה-Pico 2 הוא מחשב קטן שאפשר לחבר אליו נוריות, כפתורים, חיישנים ומנועים, ולתכנת אותו כך שיעשה איתם כל מה שתרצו. האתר מלמד את זה מההתחלה, ואינו מניח שום ידע קודם בחשמל או בתכנות.',
        en: 'The Pico 2 is a small computer you can connect lights, buttons, sensors and motors to, and program to do whatever you want with them. This site teaches it from the very beginning, assuming no earlier knowledge of electricity or programming.'
      },
      cta1: { he: 'התחילו מהיסודות', en: 'Start with the basics' },
      cta2: { he: 'פתחו את מפת הפינים', en: 'Open the pinout' },
      path: { he: 'הדרך לפרויקט, שלב אחר שלב', en: 'The road to a project, in order' },
      steps: [
        { href: '#/basics', c: '--c-uart', h: { he: 'למדו את היסודות', en: 'Learn the basics' }, p: { he: 'מה הם חשמל, מטריצה וקוד. לא צריך ידע קודם.', en: 'What electricity, a breadboard and code are. No earlier knowledge needed.' } },
        { href: '#/start', c: '--c-sys', h: { he: 'התקינו והריצו', en: 'Install and run' }, p: { he: 'הכינו את הלוח, והבהבו בלד הראשון שלכם.', en: 'Prepare the board and blink your first LED.' } },
        { href: '#/lessons', c: '--c-pwm', h: { he: 'בנו, שיעור אחר שיעור', en: 'Build, lesson by lesson' }, p: { he: P.lessons.length + ' שיעורים מעשיים, מהלד הראשון ועד פרויקט משלכם.', en: P.lessons.length + ' hands-on lessons, from the first LED to a project of your own.' } },
        { href: '#/pinout', c: '--c-gpio', h: { he: 'הכירו את הפינים', en: 'Meet the pins' }, p: { he: 'לחצו על פין, וראו מה הוא יודע לעשות.', en: 'Click a pin and see what it can do.' } },
        { href: '#/interfaces', c: '--c-i2c', h: { he: 'למדו את סוגי החיבורים', en: 'Learn the kinds of connection' }, p: { he: 'איך ה-Pico מתקשר עם רכיבים, בעזרת הדמיות חיות.', en: 'How the Pico talks to parts, with live demos.' } },
        { href: '#/components', c: '--c-spi', h: { he: 'בחרו רכיבים', en: 'Pick your parts' }, p: { he: 'לכל רכיב: מה הוא, איך מחברים אותו, קוד והסבר.', en: 'For each part: what it is, how to connect it, code and explanation.' } },
        { href: '#/planner', c: '--accent', h: { he: 'תכננו פרויקט', en: 'Plan your project' }, p: { he: 'בחרו רכיבים, וקבלו חיווט וקוד התחלתי.', en: 'Pick parts and get wiring and starter code.' } }
      ],
      glance: { he: 'הלוח במספרים', en: 'The board in numbers' },
      specs: [
        ['RP2350', { he: 'השבב שבמרכז הלוח, ה"מוח" שלו', en: 'The chip at the centre of the board, the "brain"' }],
        ['40', { he: 'פינים בסך הכול, 20 בכל צד', en: 'Pins in total, 20 on each side' }],
        ['26', { he: 'פינים לשימוש כללי (GP)', en: 'General-purpose pins (GP)' }],
        ['3', { he: 'פינים שמודדים מתח (ADC)', en: 'Pins that measure voltage (ADC)' }],
        ['3.3 V', { he: 'המתח שבו עובדים כל הפינים', en: 'The voltage all the pins work at' }],
        ['5 V', { he: 'המתח שמגיע מכבל ה-USB', en: 'The voltage that arrives over USB' }],
        ['4 MB', { he: 'מקום לתוכנית ולקבצים', en: 'Room for your program and files' }],
        ['USB', { he: 'גם אספקת חשמל וגם קשר עם המחשב', en: 'Both power and the link to the computer' }]
      ],
      rulesH: { he: 'חמישה כללים ששומרים על הלוח שלם', en: 'Five rules that keep the board alive' },
      rules: [
        { he: 'הפינים עובדים ב-3.3V, ולכן לעולם אל תחברו 5V ישירות לפין GP. למה? [[voltage|מתח]] גבוה מדי עלול לשרוף את הפין, ואין דרך לתקן אותו.', en: 'The pins work at 3.3 V. Never connect 5 V straight to a GP pin. Why: too high a [[voltage|voltage]] can destroy the pin, and it cannot be repaired.' },
        { he: 'חברו את ה[[ground|אדמה]] של כל רכיב חיצוני לאדמה של ה-Pico. למה? בלי נקודת אפס משותפת, הרכיב וה-Pico לא יכולים להבין זה את האותות של זה.', en: 'Connect every external part\'s [[ground|ground]] to the Pico\'s ground. Why: without a shared zero point, the part and the Pico cannot understand each other\'s signals.' },
        { he: 'חברו [[led|לד]] תמיד עם [[resistor|נגד]]. למה? בלי נגד עובר בלד יותר מדי [[current|זרם]], והלד או הפין נשרפים.', en: 'An [[led|LED]] always gets a [[resistor|resistor]]. Why: without one too much [[current|current]] flows, and the LED or the pin burns out.' },
        { he: 'לעולם אל תזינו מנוע או סרבו מהפין 3V3(OUT). למה? הם צורכים יותר זרם ממה שהלוח מסוגל לספק שם, ואז הלוח נכבה ומתאתחל.', en: 'Never power a motor or servo from the 3V3(OUT) pin. Why: they draw more current than the board can supply there, and the board shuts down and restarts.' },
        { he: 'חווטו רק כשכבל ה-USB מנותק, ובדקו פעמיים לפני שאתם מחברים אותו. למה? חוט שנוגע במקום הלא נכון בזמן שיש מתח עלול ליצור [[short|קצר]].', en: 'Only wire with the USB cable unplugged, and check twice before plugging in. Why: a wire touching the wrong place while power is on can cause a [[short|short circuit]].' }
      ]
    };
    app.className = 'page';
    app.innerHTML =
      '<section class="hero"><div>' +
      '<div class="eyebrow">' + T(L.eyebrow) + '</div>' +
      '<h1><span class="ltr">Raspberry Pi Pico 2</span></h1>' +
      '<p class="lead" style="margin-top:12px">' + T(L.lead) + '</p>' +
      '<div class="hero-cta"><a class="btn" href="#/basics">' + T(L.cta1) + '</a>' +
      '<a class="btn ghost" href="#/pinout">' + T(L.cta2) + '</a></div></div>' +
      '<div class="hero-board" id="hero-board"></div></section>' +
      P.lessonProgress.continueHTML() +
      '<h2>' + T(L.path) + '</h2><div class="grid c4">' +
      L.steps.map(function (s, i) {
        return '<a class="card tile" href="' + s.href + '" style="--tile-c:var(' + s.c + ')"><span class="tile-bar"></span>' +
          '<span class="tile-num">0' + (i + 1) + '</span><h3>' + T(s.h) + '</h3><p>' + T(s.p) + '</p></a>';
      }).join('') + '</div>' +
      '<h2>' + T(L.glance) + '</h2><div class="specs">' +
      L.specs.map(function (s) { return '<div class="spec"><b>' + s[0] + '</b><span>' + T(s[1]) + '</span></div>'; }).join('') +
      '</div>' +
      '<h2>' + T(L.rulesH) + '</h2><div class="card rules">' + list(L.rules) + '</div>';

    P.renderBoard(document.getElementById('hero-board'), {
      highlight: { 40: '5V', 36: '3.3V', 38: 'GND', 31: 'ADC', 1: 'UART TX', 2: 'UART RX', 6: 'I2C SDA', 7: 'I2C SCL', 20: 'PWM' },
      onSelect: function (pin) { location.hash = '#/pinout/pin/' + pin.num; }
    });
  }

  /* ---------- basics ---------- */
  function blockHTML(b, i) {
    if (b.p) return '<p>' + R(b.p) + '</p>';
    if (b.h) return '<h2>' + R(b.h) + '</h2>';
    if (b.ul) return list(b.ul);
    if (b.ol) return '<div class="card build">' + list(b.ol, true) + '</div>';
    if (b.tip) return '<div class="callout">' + R(b.tip) + '</div>';
    if (b.fig) return '<figure class="fig card">' + P.fig(b.fig) + (b.cap ? '<figcaption>' + R(b.cap) + '</figcaption>' : '') + '</figure>';
    if (b.demo) return '<div class="demo-slot" data-demo="' + b.demo + '" id="bdemo-' + i + '"></div>';
    if (b.wiring) return '<div class="wiring-slot" data-layout="' + b.wiring + '"></div>';
    if (b.code) return codeBlock(b.code, b.explain);
    if (b.table) {
      return '<div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><thead><tr>' +
        b.table.head.map(function (x) { return '<th>' + R(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        b.table.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + R(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody></table></div>';
    }
    return '';
  }

  /* a chapter counts as read once every question of its quiz has been answered */
  function readCh(c) { var r = c.quiz && c.quiz.length ? quizLoad()['basics:' + c.id] : null; return !!(r && r.a && Object.keys(r.a).length >= c.quiz.length); }
  function viewBasics(id) {
    var L = {
      h: { he: 'יסודות: כל מה שצריך לדעת לפני שמתחילים', en: 'Basics: everything you need before you start' },
      lead: {
        he: 'שמונה פרקים קצרים, לפי הסדר. אחרי שתקראו אותם, כל שאר העמודים באתר יהיו מובנים. אפשר לקרוא פרק אחד בכל פעם. פרקים 9 עד {n} הם פרקי המשך למסלולים המתקדמים.',
        en: 'Eight short chapters, in order. After them every other page on the site will make sense. Read one chapter at a time if you like. Chapters 9 to {n} are follow-on chapters for the advanced tracks.'
      }
    };
    var chapters = P.basics;
    var idx = -1;
    chapters.forEach(function (c, i) { if (c.id === id) idx = i; });

    if (idx < 0) {
      app.className = 'page';
      app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 20px">' + T(L.lead).replace('{n}', chapters.length) + '</p>' +
        '<div class="grid c3">' + chapters.map(function (c, i) {
          return '<a class="card tile" href="#/basics/' + c.id + '" style="--tile-c:var(--c-uart)"><span class="tile-bar"></span>' +
            '<span class="tile-num">' + S('chapter') + ' ' + (i + 1) + (readCh(c) ? ' <span class="st-chip done">' + T({ he: 'נקרא', en: 'Read' }) + '</span>' : '') + '</span><h3>' + esc(T(c.title)) + '</h3><p>' + esc(P.plain(T(c.lead))) + '</p></a>';
        }).join('') + '</div>';
      return;
    }

    var c = chapters[idx], prev = chapters[idx - 1], next = chapters[idx + 1];
    app.className = 'page narrow';
    app.innerHTML = crumb('#/basics', S('navBasics')) +
      '<div class="eyebrow">' + S('chapter') + ' ' + (idx + 1) + ' / ' + chapters.length + '</div>' +
      '<h1>' + esc(T(c.title)) + '</h1><p class="lead" style="margin-block:8px 6px">' + R(c.lead) + '</p>' +
      '<div class="vline" style="margin-bottom:14px">' + P.verifyBadge('basics:' + c.id) + '</div>' +
      c.blocks.map(blockHTML).join('') +
      (c.id === 'debug' ? '<div class="callout" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">' + T({ he: 'יש גם דף עזר בן עמוד אחד, שאפשר להדפיס ולתלות ליד עמדת העבודה.', en: 'There is also a one-page cheat sheet, to print and pin up by the bench.' }) + '<a class="btn small" href="#/debug">' + T({ he: 'פתחו את דף העזר', en: 'Open the cheat sheet' }) + '</a></div>' : '') +
      quiz(c.quiz, 'basics:' + c.id) +
      '<div class="ch-nav">' +
      (prev ? '<a class="btn ghost" href="#/basics/' + prev.id + '">' + S('prevCh') + ': ' + esc(T(prev.title)) + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/basics/' + next.id + '">' + S('nextCh') + ': ' + esc(T(next.title)) + '</a>'
        : '<a class="btn" href="#/start">' + S('navStart') + '</a>') + '</div>';
    app.querySelectorAll('.demo-slot').forEach(function (el) { P.demos[el.dataset.demo](el); });
    app.querySelectorAll('.wiring-slot').forEach(function (el) { P.wiringView(el, el.dataset.layout); });
  }

  /* ---------- get started ---------- */
  function viewStart() {
    var L = {
      h: { he: 'צעדים ראשונים: מהקופסה ועד לד מהבהב', en: 'Get started: from the box to a blinking LED' },
      lead: {
        he: 'אחרי שש פעולות בלבד, הלוח יריץ את התוכנית הראשונה שלכם. את שלבים 2 עד 4 עושים פעם אחת בלבד.',
        en: 'Six steps, and the board is running your first program. Steps 2 to 4 are done only once.'
      },
      steps: [
        {
          h: { he: 'מה צריך', en: 'What you need' },
          p: [
            { he: 'לוח Raspberry Pi Pico 2, מחשב וכבל micro-USB. בשלב הזה לא צריך שום רכיב נוסף, כי על הלוח עצמו יש [[led|לד]] קטן.', en: 'A Raspberry Pi Pico 2, a computer, and a micro-USB cable. You need no other parts at this stage, because the board itself carries a small [[led|LED]].' },
            { he: 'שימו לב לכבל: יש כבלי USB שמעבירים רק חשמל לטעינה, ולא נתונים. עם כבל כזה המחשב לא יזהה את הלוח. אם שלב 3 נכשל, הכבל הוא החשוד הראשון.', en: 'Mind the cable: some USB cables carry only charging power and no data. With such a cable the computer will not see the board. If step 3 fails, this is the first suspect.' }
          ]
        },
        {
          h: { he: 'הורידו את MicroPython', en: 'Download MicroPython' },
          p: [
            { he: 'לוח חדש מגיע ריק. כדי שיבין קוד Python, צריך להתקין עליו [[firmware|קושחה]] בשם [[micropython|MicroPython]]. הקושחה מגיעה כ[[uf2|קובץ UF2]] אחד.', en: 'A new board arrives empty. For it to understand Python code you install [[firmware|firmware]] called [[micropython|MicroPython]]. It comes as a single [[uf2|UF2 file]].' },
            { he: 'לכל אחד מארבעת לוחות ה-Pico יש קובץ משלו. בחרו את הלוח שבידכם, הורידו מהאתר הרשמי את הגרסה העדכנית ביותר, ושמרו אותה במחשב.', en: 'Each of the four Pico boards has a file of its own. Pick the board in your hand, download the newest version from the official site, and save it on your computer.' }
          ],
          slot: 'picker'
        },
        {
          h: { he: 'התקינו את הקושחה על הלוח', en: 'Install the firmware on the board' },
          figs: ['bootsel', 'drive'],
          ol: [
            { he: 'ודאו שהלוח מנותק מהמחשב.', en: 'Make sure the board is unplugged from the computer.' },
            { he: 'לחצו על הכפתור הלבן [[bootsel|BOOTSEL]] שעל הלוח והחזיקו אותו לחוץ.', en: 'Press the white [[bootsel|BOOTSEL]] button on the board and keep it held down.' },
            { he: 'בזמן שהכפתור לחוץ, חברו את כבל ה-USB למחשב. אחרי שנייה, שחררו את הכפתור.', en: 'While holding it, plug the USB cable into the computer. After a second, release the button.' },
            { he: 'במחשב יופיע כונן חדש בשם RP2350, כמו דיסק-און-קי. בלוחות הישנים Pico או Pico W הוא נקרא RPI-RP2.', en: 'A new drive named RP2350 appears on the computer, like a USB stick. On the older Pico or Pico W it is called RPI-RP2.' },
            { he: 'גררו את קובץ ה-UF2 שהורדתם אל הכונן הזה.', en: 'Drag the UF2 file you downloaded onto that drive.' },
            { he: 'אחרי כמה שניות הכונן ייעלם מעצמו. זה תקין: הלוח התאתחל, ועכשיו רץ עליו MicroPython.', en: 'After a few seconds the drive disappears by itself. That is correct: the board restarted and is now running MicroPython.' }
          ]
        },
        {
          h: { he: 'התקינו את Thonny', en: 'Install Thonny' },
          figs: ['thonny'],
          p: [
            { he: '[[thonny|Thonny]] היא התוכנה שבה כותבים את הקוד ושולחים אותו ללוח. הורידו והתקינו אותה כמו כל תוכנה אחרת.', en: '[[thonny|Thonny]] is the program in which you write code and send it to the board. Download and install it like any other program.' },
            { he: 'פתחו את Thonny, לחצו על הטקסט שבפינה הימנית התחתונה של החלון, ובחרו MicroPython (Raspberry Pi Pico).', en: 'Open Thonny, click the text in the bottom-right corner of the window, and choose MicroPython (Raspberry Pi Pico).' },
            { he: 'בחלק התחתון של החלון, שנקרא Shell, מופיע הסימן `>>>`. זה ה-[[repl|REPL]], והוא מסמן שהלוח מחובר ומחכה לפקודות. נסו להקליד שם `print("hello")` וללחוץ Enter, והלוח יענה hello.', en: 'In the lower part of the window, called the Shell, the `>>>` sign appears. This is the [[repl|REPL]], and it means the board is connected and waiting for commands. Try typing `print("hello")` there and pressing Enter. The board answers hello.' }
          ],
          link: ['https://thonny.org/', 'thonny.org'],
          os: [
            { he: 'Windows: התקינו כרגיל. לא צריך דרייבר, כי הלוח מופיע כפורט COM.', en: 'Windows: install as usual. No driver is needed: the board shows up as a COM port.' },
            { he: 'macOS: התקינו את הגרסה ל-Mac. הלוח מופיע כ-`/dev/cu.usbmodem...`, ולא צריך דרייבר.', en: 'macOS: install the Mac version. The board shows up as `/dev/cu.usbmodem...`, with no driver.' },
            { he: 'Linux: התקינו מהאתר או ממנהל החבילות. אם הלוח לא מופיע, הוסיפו את המשתמש שלכם לקבוצה dialout בפקודה `sudo usermod -aG dialout $USER`, והתחברו מחדש.', en: 'Linux: install from the site or the package manager. If the board does not appear, add your user to the dialout group with `sudo usermod -aG dialout $USER`, and log in again.' },
            { he: 'Chromebook: אין גרסה רגילה של Thonny. אפשר להריץ קוד ישירות מהאתר הזה בעזרת הכפתור "הריצו על הלוח" ב-Chrome, או להשתמש ב-ViperIDE (בהמשך הדף).', en: 'Chromebook: there is no ordinary Thonny. You can run code straight from this site with the "Run on board" button in Chrome, or use ViperIDE (further down the page).' }
          ]
        },
        {
          h: { he: 'התוכנית הראשונה', en: 'Your first program' },
          p: [
            { he: 'העתיקו את הקוד לחלק העליון של Thonny, ולחצו על הכפתור הירוק Run (או F5). הלד הירוק שעל הלוח יתחיל להבהב, פעם בשנייה.', en: 'Copy the code into the upper part of Thonny and press the green Run button (or F5). The green LED on the board starts blinking, once a second.' },
            { he: 'ב-Chrome או ב-Edge אפשר גם ללחוץ כאן על "הריצו על הלוח" ולהריץ את הקוד ישירות מהאתר. סגרו קודם את Thonny, כי רק תוכנה אחת יכולה להיות מחוברת ללוח בכל רגע נתון.', en: 'In Chrome or Edge you can also press "Run on board" here and run it straight from the site. Close Thonny first, because only one program can be connected to the board at a time.' },
            { he: 'רוצים לבדוק איזו קושחה מותקנת? הקלידו ב-Shell את `import os`, ואחריו את `os.uname()`. השדה machine מציג את שם הלוח, והשדה release מציג את גרסת MicroPython.', en: 'Want to check which firmware is installed? Type `import os` in the Shell, then `os.uname()`. The machine field shows the board name, and release shows the MicroPython version.' }
          ],
          code: [
            'from machine import Pin',
            'from time import sleep',
            '',
            'led = Pin("LED", Pin.OUT)      # the LED on the board itself',
            '',
            'while True:',
            '    led.toggle()',
            '    sleep(0.5)'
          ],
          explain: [
            { l: [1], t: { he: 'השורה הזו טוענת לתוכנית את הכלי `Pin`, ששולט בפינים של הלוח. בלעדיה הלוח לא יודע מה זה `Pin`. זו פקודת [[imp|import]].', en: 'Brings the `Pin` tool into the program, which controls the board\'s pins. Without this line the board does not know what `Pin` is. This is an [[imp|import]] command.' } },
            { l: [2], t: { he: 'השורה הזו טוענת את הפקודה `sleep`, שגורמת לתוכנית להמתין.', en: 'Brings in the `sleep` command, which makes the program wait.' } },
            { l: [4], t: { he: 'כאן נוצר [[variable|משתנה]] בשם `led`, שמייצג את הלד שעל הלוח. `Pin.OUT` קובע שהפין הזה הוא יציאה: אנחנו שולטים בו, ולא קוראים ממנו. מה שבא אחרי הסימן # הוא [[comment|הערה]] לקורא.', en: 'Creates a [[variable|variable]] named `led` that stands for the LED on the board. `Pin.OUT` says this pin is an output: we control it rather than read from it. What follows the # sign is a [[comment|comment]] for the reader.' } },
            { l: [6], t: { he: '[[loop|לולאה]] שחוזרת על עצמה לנצח. כל השורות שמתחתיה שמוזזות ימינה שייכות אליה.', en: 'A [[loop|loop]] that repeats forever. Every line beneath it that is shifted to the right belongs to it.' } },
            { l: [7], t: { he: 'השורה הזו הופכת את מצב הלד: אם הוא היה כבוי, הוא נדלק, ואם היה דולק, הוא נכבה. שימו לב ל[[indent|הזחה]] של ארבעה רווחים.', en: 'Flips the LED: if it was off it turns on, and if it was on it turns off. Note the [[indent|indentation]] of four spaces.' } },
            { l: [8], t: { he: 'התוכנית ממתינה חצי שנייה, ואז הלולאה חוזרת לשורה 7. שנו את המספר ל-0.1 והריצו שוב, והלד יהבהב מהר יותר.', en: 'Waits half a second, then the loop goes back to line 7. Change the number to 0.1 and run again: the LED will blink faster.' } }
          ]
        },
        {
          h: { he: 'שמרו את התוכנית על הלוח', en: 'Save the program on the board' },
          p: [
            { he: 'תוכנית שמריצים מ-Thonny או מהאתר נמחקת ברגע שמנתקים את הלוח. כדי שהיא תרוץ מעצמה בכל פעם שהלוח מקבל חשמל, גם בלי מחשב, שמרו אותה על הלוח עצמו בשם `main.py`.', en: 'A program run from Thonny or from the site is gone the moment the board is unplugged. To make it run by itself every time the board gets power, even with no computer, save it on the board itself under the name `main.py`.' },
            { he: 'ב-Thonny: בחרו בתפריט File באפשרות Save as, ואז ב-Raspberry Pi Pico, וכתבו את השם main.py.', en: 'In Thonny: choose File, Save as, then Raspberry Pi Pico, and type the name main.py.' }
          ]
        }
      ],
      fixH: { he: 'משהו לא עובד?', en: 'Something not working?' },
      fix2H: { he: 'הלוח מחובר, אבל התוכנית אינה עובדת', en: 'The board is connected, but the program does not work' },
      fix: [
        { he: 'מופיעה [[error|הודעת שגיאה]] אדומה? קראו את השורה האחרונה שלה. `IndentationError` פירושו שהרווחים בתחילת שורה כלשהי שגויים, ו-`NameError` פירושו ששם כלשהו נכתב עם שגיאת כתיב.', en: 'A red [[error|error message]] appears: read its last line. `IndentationError` means the spaces at the start of a line are wrong, and `NameError` means a name was misspelled.' },
        { he: 'התוכנית רצה, אבל הלד לא מהבהב? ודאו שבשורה 4 כתוב `"LED"`, עם מירכאות ובאותיות גדולות.', en: 'The program runs but the LED does not blink: make sure line 4 says `"LED"` with quotation marks and in capital letters.' }
      ],
      toolsH: { he: 'כלים אחרים לכתיבת קוד', en: 'Other tools for writing code' },
      tools: [
        { he: 'Thonny: הכלי שהאתר מניח שאתם משתמשים בו. הוא הפשוט ביותר למתחילים, ו-Raspberry Pi ממליצה עליו.', en: 'Thonny: the tool this site assumes. It is the simplest for beginners, and Raspberry Pi recommends it.' },
        { he: 'VS Code עם התוסף MicroPico: לסטודנטים שכבר עובדים ב-VS Code. הוא מציע השלמה אוטומטית, ומעלה תיקייה שלמה ללוח.', en: 'VS Code with the MicroPico extension: for students who already work in VS Code. It gives auto-completion and uploads a whole folder.' },
        { he: 'ViperIDE: עורך שרץ בדפדפן (Chrome או Edge), ולא דורש התקנה. מתאים ל-Chromebook.', en: 'ViperIDE: an editor that runs in the browser (Chrome or Edge), with nothing to install. Good for a Chromebook.' },
        { he: 'mpremote: כלי שורת הפקודה הרשמי של MicroPython, שמשמש להעתקת קבצים ולהתקנת ספריות.', en: 'mpremote: the official MicroPython command-line tool, for copying files and installing libraries.' }
      ],
      libs: { he: 'צריכים ספרייה בשביל חיישן או מסך?', en: 'Need a library for a sensor or a screen?' },
      libsBtn: { he: 'התקנת ספרייה', en: 'Installing a library' },
      next: { he: 'הלד מהבהב? עכשיו למדו לחבר רכיבים משלכם.', en: 'LED blinking? Now learn to connect parts of your own.' },
      nextBtn: { he: 'פתחו את מפת הפינים', en: 'Open the pinout' }
    };
    app.className = 'page narrow';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 6px">' + T(L.lead) + '</p>' +
      '<div class="vline" style="margin-bottom:20px">' + P.verifyBadge('start') + '</div>' +
      '<div class="steps">' + L.steps.map(function (s) {
        return '<div class="card step"><h3>' + T(s.h) + '</h3>' + (s.p ? paras(s.p) : '') +
          (s.figs ? s.figs.map(function (f) { return '<figure class="fig">' + P.fig(f) + '</figure>'; }).join('') : '') + (s.ol ? list(s.ol, true) : '') +
          (s.link ? '<p><a class="ltr" href="' + s.link[0] + '" target="_blank" rel="noopener">' + s.link[1] + ' ↗</a></p>' : '') +
          (s.os ? list(s.os) : '') + (s.slot ? '<div data-help="' + s.slot + '"></div>' : '') +
          (s.code ? codeBlock(s.code, s.explain) : '') + '</div>';
      }).join('') + '</div>' +
      '<h2>' + T(L.fixH) + '</h2><div class="card" data-help="connect"></div>' +
      '<h3>' + T(L.fix2H) + '</h3><div class="card rules">' + list(L.fix) + '</div>' +
      '<h2>' + T(L.toolsH) + '</h2><div class="card">' + list(L.tools) + '<p style="margin:8px 0 0"><a href="#/tools">' + esc(T({ he: 'השוואה מלאה של הכלים', en: 'A full comparison of the tools' })) + '</a></p></div>' +
      '<div class="card" style="margin-top:14px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap"><b>' + T(L.libs) + '</b><span style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn ghost" href="#/libraries">' + T(L.libsBtn) + '</a><a class="btn ghost" href="#/debug">' + T({ he: 'דף עזר לתקלות', en: 'Fault-finding cheat sheet' }) + '</a></span></div>' +
      '<div class="card" style="margin-top:22px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">' +
      '<b>' + T(L.next) + '</b><a class="btn" href="#/pinout">' + T(L.nextBtn) + '</a></div>';
    P.help.mount(app);
  }

  /* ---------- pinout ---------- */
  var FILTERS = ['all', 'gpio', 'adc', 'pwm', 'i2c', 'spi', 'uart', 'power'];

  function pinPanelHTML(pin) {
    if (!pin) {
      return '<div class="empty-panel">' +
        '<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>' +
        '<p><b>' + S('pickPin') + '</b></p><p>' + S('pickPinHint') + '</p></div>';
    }
    var s = '<h2>' + tag(pin.kind === 'gpio' ? 'gpio' : pin.kind, pin.label, true) +
      '<span class="sub">' + S('physicalPin') + ' ' + pin.num + '</span></h2>';

    if (pin.kind !== 'gpio') {
      return s + '<p>' + R(pin.desc) + '</p>' +
        '<a class="btn ghost small" href="#/interfaces/power">' + esc(T(P.interfaceById('power').name)) + '</a>';
    }

    s += '<p class="muted" style="font-size:.92rem">' + R({
      he: 'בקוד פונים לפין הזה לפי המספר שבשמו: `Pin(' + pin.gp + ')`. המספר ' + pin.num + ' הוא רק המיקום שלו על הלוח.',
      en: 'In code this pin is called by the number in its name: `Pin(' + pin.gp + ')`. The number ' + pin.num + ' is only its position on the board.'
    }) + '</p><h3 style="margin-bottom:4px">' + S('functions') + '</h3>';
    var n = pin.gp;
    pin.funcs.forEach(function (f) {
      var code = '';
      if (f.type === 'gpio') code = 'Pin(' + n + ', Pin.OUT)   # or Pin.IN';
      else if (f.type === 'adc') code = 'ADC(' + n + ')';
      else if (f.type === 'pwm') code = 'PWM(Pin(' + n + '), freq=1000)';
      else if (f.type === 'i2c') {
        var other = P.findPartner(n, 'i2c', f.bus, f.role === 'SDA' ? 'SCL' : 'SDA');
        var sda = f.role === 'SDA' ? n : other.gp, scl = f.role === 'SCL' ? n : other.gp;
        code = 'I2C(' + f.bus + ', sda=Pin(' + sda + '), scl=Pin(' + scl + '))';
      } else if (f.type === 'uart' && !f.minor) {
        var o = P.findPartner(n, 'uart', f.bus, f.role === 'TX' ? 'RX' : 'TX');
        var tx = f.role === 'TX' ? n : o.gp, rx = f.role === 'RX' ? n : o.gp;
        code = 'UART(' + f.bus + ', 9600, tx=Pin(' + tx + '), rx=Pin(' + rx + '))';
      }
      var info = f.type === 'uart' && f.minor
        ? { he: 'קו עזר של UART, שמווסת את קצב הנתונים. כמעט אף פעם לא צריך אותו.', en: 'A helper UART line for pacing data. You almost never need it.' }
        : P.funcInfo[f.type];
      s += '<div class="fn"><div class="fn-head">' + tag(f.type, f.label, true) +
        '<a href="#/interfaces/' + f.type + '">' + esc(T(P.interfaceById(f.type).name)) + '</a></div>' +
        '<p>' + R(info) + '</p>' +
        (code ? '<div class="live-code">' + esc(code) + '</div>' : '') + '</div>';
    });

    var users = P.components.filter(function (c) {
      return c.wiring.some(function (w) { return w.to === pin.name; });
    });
    if (users.length) {
      s += '<h3 style="margin-top:14px">' + S('usedBy') + '</h3><div class="used">' +
        users.map(function (c) { return '<a href="#/components/' + c.id + '">' + esc(T(c.name)) + '</a>'; }).join('') + '</div>';
    }
    return s;
  }

  function viewPinout(arg1, arg2) {
    var L = {
      h: { he: 'מפת הפינים', en: 'Pinout' },
      lead: {
        he: 'ל-Pico 2 יש 40 [[pin|פינים]], 20 בכל צד, והם נקודות החיבור שלו לעולם. לחצו על פין כדי לראות מה הוא עושה, או בחרו סוג חיבור כדי לראות אילו פינים מתאימים לו.',
        en: 'The Pico 2 has 40 [[pin|pins]], 20 on each side. These are its connection points to the world. Click a pin to see what it does, or pick a kind of connection to see which pins suit it.'
      },
      readH: { he: 'איך קוראים את המפה', en: 'How to read the map' },
      read: [
        { he: 'לכל פין יש שני שמות. המספר שבעיגול הזהוב, מ-1 עד 40, הוא המיקום שלו על הלוח. הספירה מתחילה בפינה שליד שקע ה-USB, ופין 1 מסומן בריבוע.', en: 'Every pin has two names. The number in the gold circle, 1 to 40, is its position on the board. Count from the corner next to the USB socket. Pin 1 is marked with a square.' },
        { he: 'השם שבירוק, למשל GP15, הוא השם שכותבים בקוד: `Pin(15)`. זה לא אותו מספר כמו המיקום: GP15 נמצא בפין 20.', en: 'The name in green, such as GP15, is the name you write in code: `Pin(15)`. It is not the same number as the position. GP15 sits at pin 20.' },
        { he: 'הפינים האדומים מספקים [[voltage|מתח]], והפינים הכהים הם [[ground|אדמה]]. בשבילם לא כותבים קוד, אלא רק מחברים אליהם חוטים.', en: 'Red pins supply [[voltage|voltage]]. Dark pins are [[ground|ground]]. You do not write code for them, you only connect wires.' },
        { he: 'התגיות הצבעוניות שליד כל פין הן תפקידים נוספים שהוא יכול למלא. פין אחד יכול לעשות כמה דברים, והקוד שלכם קובע איזה מהם.', en: 'The coloured tags beside each pin are extra jobs it can take on. One pin can do several things, and your code chooses which.' }
      ],
      legendH: { he: 'מה כל צבע אומר', en: 'What each colour means' },
      legend: [
        ['gpio', { he: 'פין כללי: שולח או קורא 0 או 1.', en: 'General pin: sends or reads 0 or 1.' }],
        ['adc', { he: 'מודד כמה מתח יש, ולא רק אם יש מתח.', en: 'Measures how much voltage there is, not just whether there is any.' }],
        ['pwm', { he: 'מיתוג מהיר, לעמעום, לצליל ולסרבו.', en: 'Fast switching, for dimming, sound and servos.' }],
        ['i2c', { he: 'שני חוטים שמשרתים חיישנים ומסכים רבים.', en: 'Two wires for many sensors and displays.' }],
        ['spi', { he: 'חיבור מהיר, לכרטיס זיכרון ולמסכים.', en: 'A fast link, for memory cards and displays.' }],
        ['uart', { he: 'שיחה בין שני מכשירים, למשל עם GPS.', en: 'A conversation between two devices, e.g. GPS.' }],
        ['power', { he: 'מקורות המתח של הלוח.', en: 'The board\'s power sources.' }],
        ['gnd', { he: 'אדמה, נקודת האפס.', en: 'Ground, the zero point.' }]
      ]
    };
    var filter = FILTERS.indexOf(arg1) >= 0 ? arg1 : 'all';
    var selected = arg1 === 'pin' ? P.pinByNum(parseInt(arg2, 10)) : null;

    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-top:10px">' + R(L.lead) + '</p>' +
      '<p><a class="btn ghost small" href="#/pinsheet">' + esc(T({ he: 'מפת פינים להדפסה', en: 'Printable pin map' })) + '</a></p>' +
      '<details class="card how-read"' + (selected || filter !== 'all' ? '' : ' open') + '><summary>' + T(L.readH) + '</summary>' + list(L.read) + '</details>' +
      '<div class="chips" id="filters">' + FILTERS.map(function (f) {
        var label = f === 'all' ? S('all') : f === 'power' ? S('power') : T(TYPE_NAME[f]);
        var dot = f === 'all' ? '' : '<span class="dot" style="--chip-c:var(' + TYPE_COLOR[f] + ')"></span>';
        return '<button type="button" class="chip' + (f === filter ? ' on' : '') + '" data-f="' + f + '">' + dot + esc(label) + '</button>';
      }).join('') + '</div>' +
      '<div class="pinout-layout"><div class="card" id="board-host"></div>' +
      '<aside class="card pin-panel" id="pin-panel" aria-live="polite"></aside></div>' +
      '<h2>' + T(L.legendH) + '</h2><div class="legend">' + L.legend.map(function (x) {
        var href = x[0] === 'gnd' ? 'power' : x[0];
        return '<a class="card" href="#/interfaces/' + href + '">' + tag(x[0], T(TYPE_NAME[x[0]]), true) + '<span>' + T(x[1]) + '</span></a>';
      }).join('') + '</div>' +
      '<h2>' + S('onboard') + '</h2><div class="onboard">' + P.onboard.map(function (o) {
        return '<div class="card"><b>' + esc(o.name) + '</b> · ' + esc(T(o.what)) + '<p>' + R(o.desc) + '</p></div>';
      }).join('') + '</div>';

    var panel = document.getElementById('pin-panel');
    panel.innerHTML = pinPanelHTML(selected);

    var board = P.renderBoard(document.getElementById('board-host'), {
      filter: filter,
      selected: selected ? selected.num : null,
      onSelect: function (pin) {
        panel.innerHTML = pinPanelHTML(pin);
        history.replaceState(null, '', '#/pinout/pin/' + pin.num);
        if (window.matchMedia('(max-width: 1160px)').matches) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    document.getElementById('filters').addEventListener('click', function (e) {
      var b = e.target.closest('[data-f]');
      if (!b) return;
      this.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === b); });
      board.setFilter(b.dataset.f);
      history.replaceState(null, '', '#/pinout' + (b.dataset.f === 'all' ? '' : '/' + b.dataset.f));
    });
  }

  /* ---------- interfaces ---------- */
  function viewInterfaces() {
    var L = {
      h: { he: 'סוגי החיבורים', en: 'The kinds of connection' },
      lead: {
        he: 'כדי שה-Pico יעבוד עם רכיב, שניהם צריכים "לדבר" באותה שיטה, ושיטה כזו נקראת ממשק. יש שיטות פשוטות, כמו חוט אחד שהוא דולק או כבוי, ויש שיטות שמעבירות הרבה מידע. כשיודעים באיזה ממשק רכיב משתמש, יודעים לאילו פינים לחבר אותו ואיזה קוד לכתוב.',
        en: 'For the Pico to work with a part, the two must "talk" in the same way. Each such way is called an interface. Some are simple, like one wire that is on or off, and some carry a lot of information. Once you know which interface a part uses, you know which pins to connect it to and what code to write.'
      },
      order: {
        he: 'אם זו הפעם הראשונה שלכם, קראו לפי הסדר: קודם GPIO, אחריו ADC ו-PWM, ורק אז I2C, SPI ו-UART.',
        en: 'If this is your first time, read in order: GPIO, then ADC and PWM, and only then I2C, SPI and UART.'
      },
      chooseH: { he: 'מה אני רוצה לעשות?', en: 'What do I want to do?' },
      want: { he: 'אני רוצה', en: 'I want to' },
      use: { he: 'הממשק שמתאים', en: 'Use this interface' }
    };
    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 12px">' + T(L.lead) + '</p>' +
      '<div class="callout" style="margin-bottom:18px">' + T(L.order) + '</div>' +
      '<div class="grid c3">' + P.interfaces.map(function (it) {
        return '<a class="card tile" href="#/interfaces/' + it.id + '" style="--tile-c:var(' + TYPE_COLOR[it.type] + ')">' +
          '<span class="tile-bar"></span><h3>' + esc(T(it.name)) + '</h3><p>' + esc(T(it.short)) + '</p></a>';
      }).join('') + '</div>' +
      '<h2>' + T(L.chooseH) + '</h2><div class="card tbl-wrap"><table class="tbl"><thead><tr><th>' + T(L.want) + '</th><th>' + T(L.use) + '</th></tr></thead><tbody>' +
      P.chooser.map(function (r) {
        var it = P.interfaceById(r.use);
        return '<tr><td>' + esc(T(r.want)) + '</td><td><a href="#/interfaces/' + it.id + '">' + tag(it.type, T(TYPE_NAME[it.type]), true) + '</a></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function viewInterface(id) {
    var it = P.interfaceById(id);
    if (!it) return viewNotFound();
    var comps = P.components.filter(function (c) { return c.iface.indexOf(it.id) >= 0; });
    app.className = 'page narrow';
    app.innerHTML = crumb('#/interfaces', S('navInterfaces')) +
      '<div class="page-head" style="--head-c:var(' + TYPE_COLOR[it.type] + ')"><span class="bar"></span><div>' +
      '<h1>' + esc(T(it.name)) + '</h1><p class="lead" style="margin:6px 0 0">' + esc(T(it.short)) + '</p></div></div>' +
      '<div class="card plain-box"><b>' + S('inShort') + '</b><p>' + R(it.plain) + '</p></div>' +
      '<div class="callout"><b>' + S('analogy') + ':</b> ' + R(it.analogy) + '</div>' +
      '<figure class="fig card">' + P.fig('if-' + it.id) + '<figcaption>' + T({ he: 'דוגמה לחיבור. כל קו מייצג חוט אחד.', en: 'An example hook-up. Each line is one wire.' }) + '</figcaption></figure>' +
      '<h2>' + S('howItWorks') + '</h2>' + paras(it.what) +
      '<h2>' + S('whenUse') + '</h2>' + list(it.when) +
      '<h2>' + S('signals') + '</h2><div class="wires">' + it.wires.map(function (w) {
        return '<div class="wire"><b>' + esc(w.name) + '</b><span>' + R(w.desc) + '</span></div>';
      }).join('') + '</div>' +
      '<h2>' + S('whichPins') + '</h2><p>' + R(it.pinsNote) + '</p>' +
      '<a class="btn ghost small" href="#/pinout/' + it.filter + '">' + S('showOnBoard') + '</a>' +
      (it.demo ? '<h2>' + S('tryIt') + '</h2><div id="demo-host"></div>' : '') +
      '<h2>' + S('explainCode') + '</h2>' + codeBlock(it.code, it.explain) +
      (it.id === 'adc' || it.id === 'pwm' ? '<div data-help="bits-' + it.id + '"></div>' : '') +
      (it.id === 'i2c' ? '<h2>' + T({ he: 'כשהרכיב לא עונה', en: 'When the part does not answer' }) + '</h2><div class="card" data-help="i2c"></div>' : '') +
      '<h2>' + S('tips') + '</h2><div class="card tips">' + list(it.tips) + '</div>' +
      (comps.length ? '<h2>' + S('worksWith') + '</h2><div class="grid c2">' + comps.map(compCard).join('') + '</div>' : '') +
      (it.more ? '<h2>' + S('more') + '</h2><p>' + R(it.more) + '</p>' : '') +
      quiz(it.quiz, 'iface:' + it.id);
    if (it.demo) P.demos[it.demo](document.getElementById('demo-host'));
    P.help.mount(app);
  }

  /* ---------- components ---------- */
  function viewComponents(filter) {
    var L = {
      h: { he: 'קטלוג רכיבים', en: 'Component catalog' },
      allKinds: { he: 'כל הסוגים', en: 'All kinds' },
      search: { he: 'חיפוש רכיב לפי שם', en: 'Search for a part by name' },
      count: { he: 'רכיבים', en: 'parts' },
      none: { he: 'לא נמצא רכיב שמתאים לחיפוש.', en: 'No matching part.' },
      lead: {
        he: 'כל רכיב מוסבר מההתחלה: מה הוא, איך מזהים אותו, איך מחברים אותו צעד אחר צעד, קוד שעובד עם הסבר לכל שורה, ומה לבדוק אם משהו לא עובד. אם אתם רק מתחילים, התחילו מהלד ומהכפתור.',
        en: 'Every part is explained from the beginning: what it is, how to recognise it, how to connect it step by step, working code with every line explained, and what to check if something does not work. If you are just starting, begin with the LED and the button.'
      }
    };
    var ids = ['all'].concat(P.interfaces.filter(function (it) {
      return P.components.some(function (c) { return c.iface.indexOf(it.id) >= 0; });
    }).map(function (it) { return it.id; }));
    if (ids.indexOf(filter) < 0) filter = 'all';

    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-top:10px">' + T(L.lead) + '</p>' +
      '<div class="chips">' + ids.map(function (f) {
        var it = P.interfaceById(f);
        var label = f === 'all' ? S('all') : T(TYPE_NAME[it.type]);
        var dot = f === 'all' ? '' : '<span class="dot" style="--chip-c:var(' + TYPE_COLOR[it.type] + ')"></span>';
        return '<a class="chip' + (f === filter ? ' on' : '') + '" href="#/components' + (f === 'all' ? '' : '/by/' + f) + '" style="color:' + (f === filter ? 'var(--bg)' : 'var(--ink)') + '">' + dot + esc(label) + '</a>';
      }).join('') + '</div>' +
      '<div class="chips" id="cat-chips" style="margin-top:0">' + ['all'].concat(Object.keys(P.categories).filter(function (k) {
        return P.components.some(function (c) { return c.cat === k; });
      })).map(function (k) {
        return '<button type="button" class="chip' + (k === 'all' ? ' on' : '') + '" data-cat="' + k + '">' + esc(k === 'all' ? T(L.allKinds) : T(P.categories[k])) + '</button>';
      }).join('') + '</div>' +
      '<input type="search" class="gl-search" id="comp-search" placeholder="' + esc(T(L.search)) + '" aria-label="' + esc(T(L.search)) + '">' +
      '<p class="muted" id="comp-count" style="margin:10px 0"></p>' +
      '<div class="grid c2" id="comp-grid">' + P.components.filter(function (c) {
        return filter === 'all' || c.iface.indexOf(filter) >= 0;
      }).map(compCard).join('') + '</div>';

    var cat = 'all', search = document.getElementById('comp-search'), tiles = app.querySelectorAll('#comp-grid .comp-tile');
    function apply() {
      var q = search.value.trim().toLowerCase(), n = 0;
      Array.prototype.forEach.call(tiles, function (el) {
        var show = (cat === 'all' || el.getAttribute('data-cat') === cat) && (!q || el.getAttribute('data-name').indexOf(q) >= 0);
        el.hidden = !show;
        if (show) n++;
      });
      document.getElementById('comp-count').textContent = n ? n + ' ' + T(L.count) : T(L.none);
    }
    document.getElementById('cat-chips').addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      cat = b.getAttribute('data-cat');
      Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle('on', x === b); });
      apply();
    });
    search.addEventListener('input', apply);
    apply();
  }

  function viewComponent(id) {
    var c = P.componentById(id);
    if (!c) return viewNotFound();
    var hl = {};
    c.wiring.forEach(function (w) { hl[w.num] = P.plain(T(w.part)); });

    var rows = c.wiring.map(function (w) {
      var pin = P.pinByNum(w.num);
      return '<tr><td><b>' + esc(T(w.part)) + '</b></td>' +
        '<td><a class="pico-pin" href="#/pinout/pin/' + w.num + '">' + tag(pin.kind === 'gpio' ? 'gpio' : pin.kind, pin.label, true) +
        '<small>' + S('pin') + ' ' + w.num + '</small></a></td>' +
        '<td class="muted">' + (w.note ? R(w.note) : '') + '</td></tr>';
    }).join('');

    var legs = c.pins && c.pins.length
      ? '<h2>' + S('partPins') + '</h2><div class="wires">' + c.pins.map(function (p) {
        return '<div class="wire"><b>' + esc(T(p.n)) + '</b><span>' + R(p.d) + '</span></div>';
      }).join('') + '</div>' : '';

    app.className = 'page narrow';
    app.innerHTML = crumb('#/components', S('navComponents')) +
      '<div class="page-head" style="--head-c:var(' + TYPE_COLOR[P.interfaceById(c.iface[0]).type] + ')"><span class="bar"></span><div>' +
      '<h1>' + esc(T(c.name)) + '</h1><p class="lead" style="margin:6px 0 0">' + R(c.summary) + '</p></div></div>' +
      '<div class="vline">' + P.verifyBadge('component:' + c.id) + '</div>' +
      '<div class="meta"><span>' + S('interface') + ': ' + c.iface.map(function (i) {
        return '<a href="#/interfaces/' + i + '">' + ifaceTag(i) + '</a>';
      }).join(' ') + '</span>' +
      '<span>' + S('voltage') + ': <b class="ltr">' + c.volt + '</b></span>' +
      '<span>' + esc(T(P.categories[c.cat])) + '</span>' +
      (c.addr ? '<span>' + R({ he: '[[address|כתובת]] I2C', en: 'I2C [[address|address]]' }) + ': <b class="mono">' + c.addr + '</b></span>' : '') + '</div>' +

      '<h2>' + S('whatIs') + '</h2><div class="what-row"><div>' + paras(c.what) + '</div>' +
      '<figure class="fig card part-art">' + P.art(c.id) + '</figure></div>' +
      '<h2>' + S('looks') + '</h2><p>' + R(c.looks) + '</p>' + legs +
      '<h2>' + S('howItWorks') + '</h2>' + paras(c.how) +
      (c.fig ? '<figure class="fig card">' + P.fig(c.fig) + '</figure>' : '') +

      '<h2>' + S('needs') + '</h2>' + list(c.needs) +
      (c.lib ? '<div class="callout" style="margin-top:12px">' + R({ he: '[[library|ספרייה]] להתקנה', en: '[[library|Library]] to install' }) + ': <b>' + esc(c.lib.name) + '</b><br>' + esc(T(c.lib.how)) + '</div>' : '') +
      (c.driver ? '<details class="card driver"><summary>' + esc(T({ he: 'הקובץ ', en: 'The file ' })) + '<b class="mono ltr">' + esc(c.driver.file) + '</b>' +
        esc(T({ he: ': שמרו אותו על הלוח לפני שתריצו את הדוגמה', en: ': save it on the board before the example' })) + '</summary>' +
        '<p class="muted">' + R({ he: 'אין צורך להבין את הקובץ הזה. הוא מתרגם פקודות פשוטות כמו `write` לאותות שהרכיב מבין. ב-Thonny: הדביקו אותו בחלון חדש, ואז בחרו File, Save as, Raspberry Pi Pico, ושמרו אותו בדיוק בשם הזה.',
          en: 'You do not need to understand this file. It turns simple commands such as `write` into the signals the part understands. In Thonny: paste it into a new window, then File, Save as, Raspberry Pi Pico, with exactly this name.' }) + '</p>' +
        codeBlock(c.driver.code, null, true) + '</details>' : '') +

      '<h2>' + S('build') + '</h2><div id="wv-host"></div>' +
      '<div class="two-col"><div><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl" id="wire-tbl"><thead><tr><th>' + S('wiringPart') + '</th><th>' + S('wiringPico') + '</th><th>' + S('wiringNote') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<div class="card" id="mini-board"></div></div>' +
      '<div class="card build" style="margin-top:14px">' + list(c.steps, true) + '</div>' +

      '<h2>' + S('explainCode') + '</h2>' + codeBlock(c.code, c.explain) +
      '<h2>' + S('expect') + '</h2><div class="card expect"><p>' + R(c.expect) + '</p></div>' +
      '<h2>' + S('mistakes') + '</h2><div class="card rules">' + list(c.mistakes) + '</div>' +
      '<h2>' + S('ideas') + '</h2>' + list(c.ideas) +
      (function () {
        var ls = P.lessons.filter(function (l) { return (l.parts || []).some(function (p) { return p.id === c.id; }); });
        return ls.length ? '<h2>' + S('usedInLessons') + '</h2><div class="used">' + ls.map(function (l) {
          return '<a href="#/lessons/' + l.id + '">' + l.id + ' · ' + esc(T(l.title)) + '</a>';
        }).join('') + '</div>' : '';
      })() +
      '<a class="btn" href="#/planner/add/' + c.id + '" style="margin-top:14px">' + S('addToPlan') + '</a>';

    P.renderBoard(document.getElementById('mini-board'), {
      highlight: hl,
      onSelect: function (pin) { location.hash = '#/pinout/pin/' + pin.num; }
    });
    P.wiringView(document.getElementById('wv-host'), c.id, { rows: app.querySelectorAll('#wire-tbl tbody tr') });
  }

  /* ---------- glossary ---------- */
  function viewGlossary(id) {
    var L = {
      h: { he: 'מילון מונחים', en: 'Glossary' },
      lead: {
        he: 'כל מילה טכנית שמופיעה באתר, עם הסבר קצר ופשוט. בכל מקום באתר, מילה שיש מתחתיה קו מקווקו היא מונח מהמילון, ולחיצה עליה פותחת את ההסבר במקום.',
        en: 'Every technical word used on the site, explained briefly and simply. Anywhere on the site, a word with a dotted underline is a glossary term: clicking it opens the explanation on the spot.'
      },
      none: { he: 'לא נמצא מונח מתאים.', en: 'No matching term found.' }
    };
    var cats = Object.keys(P.glossaryCats);
    app.className = 'page narrow';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:10px 16px">' + T(L.lead) + '</p>' +
      '<input type="search" class="gl-search" placeholder="' + S('searchTerm') + '" aria-label="' + S('searchTerm') + '">' +
      cats.map(function (cat) {
        var ids = Object.keys(P.glossary).filter(function (k) { return P.glossary[k].cat === cat; })
          .sort(function (a, b) { return T(P.glossary[a].t).localeCompare(T(P.glossary[b].t), P.lang()); });
        return '<section class="gl-cat"><h2>' + T(P.glossaryCats[cat]) + '</h2><dl class="gl">' + ids.map(function (k) {
          var g = P.glossary[k];
          return '<div class="gl-item" id="g-' + k + '" data-text="' + esc((g.t.he + ' ' + g.t.en + ' ' + P.plain(T(g.d))).toLowerCase()) + '">' +
            '<dt>' + esc(T(g.t)) + '</dt><dd>' + R(g.d) + '</dd></div>';
        }).join('') + '</dl></section>';
      }).join('') + '<p class="muted gl-none" hidden>' + T(L.none) + '</p>';

    var input = app.querySelector('.gl-search');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase(), any = false;
      app.querySelectorAll('.gl-cat').forEach(function (sec) {
        var shown = 0;
        sec.querySelectorAll('.gl-item').forEach(function (it) {
          var ok = !q || it.dataset.text.indexOf(q) >= 0;
          it.hidden = !ok; if (ok) shown++;
        });
        sec.hidden = shown === 0; if (shown) any = true;
      });
      app.querySelector('.gl-none').hidden = any;
    });
    if (id) {
      var el = document.getElementById('g-' + id);
      if (el) { el.classList.add('hit'); setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 0); return true; }
    }
    return false;
  }

  function viewNotFound() {
    app.className = 'page narrow';
    app.innerHTML = '<h1>404</h1><p class="lead">' + S('notFound') + '</p><a class="btn" href="#/">' + S('navHome') + '</a>';
  }

  /* ---------- chrome: nav, language, theme ---------- */
  var NAV = [
    ['', 'navHome'], ['basics', 'navBasics'], ['start', 'navStart'], ['lessons', 'navLessons'], ['pinout', 'navPinout'],
    ['interfaces', 'navInterfaces'], ['components', 'navComponents'], ['planner', 'navPlanner'], ['robot', 'navRobot'], ['glossary', 'navGlossary']
  ];

  function renderChrome(section) {
    var he = P.lang() === 'he';
    document.documentElement.lang = P.lang();
    document.documentElement.dir = he ? 'rtl' : 'ltr';
    document.title = S('brand');
    document.getElementById('brand-text').textContent = S('brand');
    document.getElementById('lang-btn').textContent = S('langSwitch');
    var sb = document.getElementById('search-btn');
    if (sb) { sb.setAttribute('aria-label', T({ he: 'חיפוש באתר', en: 'Search the site' })); sb.title = sb.getAttribute('aria-label'); sb.classList.toggle('on', section === 'search'); }
    document.getElementById('theme-btn').setAttribute('aria-label', S('themeToggle'));
    document.getElementById('theme-btn').title = S('themeToggle');
    document.getElementById('foot-text').innerHTML = esc(T({
      he: 'חומר לימוד ל-Raspberry Pi Pico 2 ול-MicroPython. בדקו תמיד את החיווט מול הסימונים שעל הרכיב שבידכם.',
      en: 'Teaching material for the Raspberry Pi Pico 2 and MicroPython. Always check your wiring against the markings on the part in your hand.'
    })) + ' <a class="foot-link" href="#/teach">' + esc(T({ he: 'למרצה', en: 'For lecturers' })) + '</a> · <a class="foot-link" href="#/verify">' + esc(T({ he: 'בדיקה על לוח', en: 'Board check' })) + '</a> · <a class="foot-link" href="#/tools">' + esc(T({ he: 'כלים', en: 'Tools' })) + '</a> · <a class="foot-link" href="#/pinsheet">' + esc(T({ he: 'מפת פינים להדפסה', en: 'Printable pin map' })) + '</a>';
    P.board.refresh();
    document.getElementById('nav').innerHTML = NAV.map(function (n) {
      return '<a href="#/' + n[0] + '"' + (n[0] === section ? ' class="on" aria-current="page"' : '') + '>' + S(n[1]) + '</a>';
    }).join('');
  }

  /* pico.last: the last lesson, chapter, component or interface page opened, for "carry on where you stopped" */
  function rememberPlace(section, parts) {
    var k = section === 'lessons' && parts[1] && !parts[2] ? 'lesson' : section === 'basics' && parts[1] ? 'basics' :
      section === 'components' && parts[1] && parts[1] !== 'by' ? 'component' : section === 'interfaces' && parts[1] ? 'iface' : null;
    if (!k) return;
    try { localStorage.setItem('pico.last', JSON.stringify({ k: k, id: decodeURIComponent(parts[1]) })); } catch (e) { /* ignore */ }
  }

  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
    var section = parts[0] || '';
    var keepScroll = false;
    hideTerm();
    document.body.classList.remove('rf-full');
    renderChrome(section);
    rememberPlace(section, parts);
    if (section === '') viewHome();
    else if (section === 'basics') viewBasics(parts[1]);
    else if (section === 'start') viewStart();
    else if (section === 'lessons') P.viewLessons(app, parts[1], parts[2]);
    else if (section === 'pinout') viewPinout(parts[1], parts[2]);
    else if (section === 'interfaces') parts[1] ? viewInterface(parts[1]) : viewInterfaces();
    else if (section === 'components') {
      if (parts[1] === 'by') viewComponents(parts[2]);
      else if (parts[1]) viewComponent(parts[1]);
      else viewComponents('all');
    } else if (section === 'planner') P.viewPlanner(app, parts[1], parts[2]);
    else if (section === 'robot') P.viewRobot(app);
    else if (section === 'glossary') keepScroll = viewGlossary(parts[1]);
    else if (section === 'verify') P.viewVerify(app);
    else if (section === 'libraries') P.viewLibraries(app);
    else if (section === 'debug') P.viewDebugSheet(app);
    else if (section === 'teach') P.viewTeach(app);
    else if (section === 'progress') P.viewProgress(app);
    else if (section === 'pinsheet') P.viewPinSheet(app);
    else if (section === 'tools') P.viewTools(app);
    else if (section === 'map') P.viewMap(app);
    else if (section === 'review') P.viewReview(app, parts[1]);
    else if (section === 'search') P.viewSearch(app);
    else viewNotFound();
    if (!keepScroll) window.scrollTo(0, 0);
  }

  document.getElementById('lang-btn').addEventListener('click', function () {
    P.setLang(P.lang() === 'he' ? 'en' : 'he');
    route();
  });

  document.getElementById('theme-btn').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('pico.theme', root.dataset.theme); } catch (e) { /* ignore */ }
  });
  try {
    var savedTheme = localStorage.getItem('pico.theme');
    if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
  } catch (e) { /* ignore */ }

  /* ---------- glossary popover ---------- */
  var pop = document.createElement('div');
  pop.className = 'term-pop';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  pop.innerHTML = '<b></b><p></p><a></a>';
  document.body.appendChild(pop);
  var popFor = null;

  function hideTerm() { pop.hidden = true; popFor = null; }
  function showTerm(btn) {
    var g = P.glossary[btn.dataset.term];
    if (!g) return;
    if (popFor === btn) { hideTerm(); return; }
    popFor = btn;
    pop.querySelector('b').textContent = T(g.t);
    pop.querySelector('p').innerHTML = P.rich(T(g.d)).replace(/<button[^>]*>|<\/button>/g, '');
    var a = pop.querySelector('a');
    a.textContent = S('toGlossary');
    a.href = '#/glossary/' + btn.dataset.term;
    pop.hidden = false;
    var r = btn.getBoundingClientRect(), w = pop.offsetWidth, hgt = pop.offsetHeight;
    var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, document.documentElement.clientWidth - w - 8));
    var top = r.bottom + 8;
    if (top + hgt > window.innerHeight - 8 && r.top - hgt - 8 > 0) top = r.top - hgt - 8;
    pop.style.left = (left + window.scrollX) + 'px';
    pop.style.top = (top + window.scrollY) + 'px';
  }

  /* ---------- delegated clicks: terms, copy, quiz, code walk-through ---------- */
  document.addEventListener('click', function (e) {
    var term = e.target.closest('.term');
    if (term) { e.preventDefault(); showTerm(term); return; }
    if (!e.target.closest('.term-pop')) hideTerm();

    var copy = e.target.closest('.code .copy');
    if (copy) {
      copyText(copy.closest('.code').dataset.code, function () {
        copy.textContent = S('copied');
        setTimeout(function () { copy.textContent = S('copy'); }, 1400);
      });
      return;
    }

    var li = e.target.closest('.walk li');
    if (li) walkTo(li);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTerm(); });
  document.addEventListener('mouseover', function (e) {
    var li = e.target.closest && e.target.closest('.walk li');
    if (li) walkTo(li);
  });
  document.addEventListener('focusin', function (e) {
    var li = e.target.closest && e.target.closest('.walk li');
    if (li) walkTo(li);
  });
  function walkTo(li) {
    var wrap = li.closest('.walk-wrap');
    var from = parseInt(li.dataset.from, 10), to = parseInt(li.dataset.to, 10);
    wrap.querySelectorAll('.walk li').forEach(function (x) { x.classList.toggle('on', x === li); });
    wrap.querySelectorAll('.ln').forEach(function (ln) {
      var n = parseInt(ln.dataset.n, 10);
      ln.classList.toggle('hot', n >= from && n <= to);
    });
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* shared with planner.js */
  P.h = { codeBlock: codeBlock, tag: tag, ifaceTag: ifaceTag, list: list, copyText: copyText, quiz: quiz, crumb: crumb };

  window.addEventListener('hashchange', route);
  route();
})(window.PICO);
