/* First-week help.
   - The board picker: which of the four Pico boards is in your hand, and which MicroPython file it needs.
   - The "board will not connect" tree: yes/no questions that end in a fix.
   - The libraries page (#/libraries): how to put a library file on the board, and what ImportError means.
   Slots in a page are <div data-help="picker|connect"></div>; P.help.mount(root) fills them. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc, R = function (v) { return P.rich(T(v)); };
  var B = function (he, en) { return { he: he, en: en }; };

  /* ---------- the four boards ---------- */
  var BOARDS = [
    { id: 'pico2', name: 'Pico 2', chip: 'RP2350', w: false, uf2: 'RPI_PICO2', drive: 'RP2350',
      look: B('על השבב המרובע שבאמצע כתוב RP2350, ועל הלוח עצמו כתוב Pico 2. בקצה הרחוק מחיבור ה-USB אין קופסת מתכת.', 'The square chip in the middle says RP2350, and the board itself says Pico 2. There is no metal box at the end away from the USB socket.'),
      note: B('זה הלוח שהאתר נכתב בשבילו, וכל השיעורים והדוגמאות מתאימים לו.', 'This is the board the site is written for. Every lesson and example fits it.') },
    { id: 'pico2w', name: 'Pico 2 W', chip: 'RP2350', w: true, uf2: 'RPI_PICO2_W', drive: 'RP2350',
      look: B('על השבב כתוב RP2350, ובקצה הרחוק מה-USB יש קופסת מתכת כסופה וקטנה (השבב האלחוטי) ולידה אנטנה. על הלוח כתוב Pico 2 W.', 'The RP2350 chip, and at the end away from the USB there is a small silver metal box (the wireless chip) with an antenna beside it. The board says Pico 2 W.'),
      note: B('כל השיעורים מתאימים גם לו, אבל חובה לצרוב את קובץ ה-W: בקובץ של Pico 2 הרגיל אין Wi-Fi, ולכן `import network` נכשל.', 'Every lesson fits it too. You must flash the W file: the plain Pico 2 file has no Wi-Fi, and `import network` fails.') },
    { id: 'pico', name: 'Pico', chip: 'RP2040', w: false, uf2: 'RPI_PICO', drive: 'RPI-RP2',
      look: B('על השבב כתוב RP2-B2 או RP2040, ואין עליו קופסת מתכת. זה הלוח הראשון, משנת 2021.', 'The chip says RP2-B2 or RP2040. No metal box. This is the first board, from 2021.'),
      note: B('רוב השיעורים עובדים גם עליו, כי הפינים זהים. עם זאת, הוא איטי יותר ויש לו פחות זיכרון, והכונן שלו נקרא RPI-RP2 ולא RP2350.', 'Most lessons work on it too, because the pins are the same. It is slower with less memory, and its drive is called RPI-RP2, not RP2350.') },
    { id: 'picow', name: 'Pico W', chip: 'RP2040', w: true, uf2: 'RPI_PICO_W', drive: 'RPI-RP2',
      look: B('על השבב כתוב RP2040, ובקצה יש קופסת מתכת כסופה ואנטנה. על הלוח כתוב Pico W.', 'The RP2040 chip, with a silver metal box and an antenna at the end. The board says Pico W.'),
      note: B('רוב השיעורים עובדים גם עליו. הלד שעל הלוח מחובר לשבב האלחוטי, ולכן `Pin(25)` לא מדליק אותו. לעומת זאת, `Pin("LED")`, שבו האתר משתמש, עובד בכל הלוחות.', 'Most lessons work on it too. The LED on the board is wired to the wireless chip, so `Pin(25)` does not light it. `Pin("LED")`, as used on this site, works on every board.') }
  ];
  function boardSVG(b) {
    var can = b.w ? '<rect x="90" y="11" width="21" height="27" rx="1.5" fill="#d5dade" stroke="#6e7781" stroke-width="1"/><text x="100.5" y="27" font-size="5" text-anchor="middle" fill="#57606a" font-family="sans-serif">Wi-Fi</text><path d="M112 9 h4 v4 h-4 v4 h4 v4 h-4 v4 h4" fill="none" stroke="#d4a72c" stroke-width="1.4"/>' : '';
    var pins = '';
    for (var i = 0; i < 20; i++) { pins += '<circle cx="' + (8 + i * 5.6) + '" cy="4" r="1.3" fill="#d4a72c"/><circle cx="' + (8 + i * 5.6) + '" cy="46" r="1.3" fill="#d4a72c"/>'; }
    return '<svg viewBox="0 0 122 50" class="hb-svg" aria-hidden="true"><rect x="1" y="1" width="120" height="48" rx="3" fill="#1b7a3d"/>' + pins +
      '<rect x="0" y="19" width="9" height="12" rx="1" fill="#b9bfc4" stroke="#8b949b"/>' +
      '<rect x="17" y="12" width="7" height="6" rx="1" fill="#f4f4f4"/>' +
      '<rect x="44" y="14" width="22" height="22" rx="1.5" fill="#24292e"/><text x="55" y="27.5" font-size="4.6" text-anchor="middle" fill="#e6e6e6" font-family="monospace">' + b.chip + '</text>' +
      '<rect x="72" y="18" width="12" height="14" rx="1" fill="#2f363d"/>' + can +
      '<text x="' + (b.w ? 66 : 96) + '" y="44" font-size="4.4" text-anchor="middle" fill="#e8f5e9" font-family="sans-serif">' + b.name + '</text></svg>';
  }

  var LP = {
    h: B('איזה לוח יש לי?', 'Which board do I have?'),
    lead: B('יש ארבעה לוחות Pico, ולכל אחד מהם קובץ MicroPython משלו. קובץ של לוח אחר לא יעבוד, או שיעבוד בלי חלק מהיכולות. לחצו על הלוח שנמצא בידיכם.', 'There are four Pico boards, and each has its own MicroPython file. A file for another board will not work, or will work without some of its features. Click the board in your hand.'),
    look: B('איך מזהים אותו', 'How to recognise it'), file: B('קובץ הקושחה', 'Firmware file'), drive: B('שם הכונן ב-BOOTSEL', 'Drive name in BOOTSEL'),
    get: B('לדף ההורדה של', 'Download page for'),
    pick: B('בדף ההורדה יש כמה קבצים. בחרו את הגרסה העדכנית ביותר שתחת Releases, אבל לא קבצים שמסומנים preview ולא קבצים שיש בשמם RISCV, כי הם ניסיוניים.', 'The download page lists several files. Pick the newest version under Releases. Not the ones marked preview, and not the ones with RISCV in the name: they are experimental.'),
    check: B('לא בטוחים מה מותקן? הקלידו את הפקודה הזו ב-Shell של Thonny:', 'Not sure what is installed? Type this in the Thonny Shell:'),
    checkOut: B('השדה machine מראה את שם הלוח, והשדה release מראה את גרסת MicroPython.', 'The machine field shows the board name, and release shows the MicroPython version.')
  };
  function picker(el) {
    var cur = 'pico2';
    function draw() {
      var b = BOARDS.filter(function (x) { return x.id === cur; })[0];
      el.innerHTML = '<div class="hb"><b class="hb-h">' + T(LP.h) + '</b><p class="muted" style="margin:4px 0 10px">' + T(LP.lead) + '</p>' +
        '<div class="hb-pick" role="group">' + BOARDS.map(function (x) {
          return '<button type="button" class="hb-opt' + (x.id === cur ? ' on' : '') + '" data-b="' + x.id + '" aria-pressed="' + (x.id === cur) + '">' + boardSVG(x) + '<span>' + x.name + '</span></button>';
        }).join('') + '</div>' +
        '<div class="hb-info"><dl><dt>' + T(LP.look) + '</dt><dd>' + R(b.look) + '</dd><dt>' + T(LP.file) + '</dt><dd><b class="mono ltr">' + b.uf2 + '</b></dd>' +
        '<dt>' + T(LP.drive) + '</dt><dd><b class="mono ltr">' + b.drive + '</b></dd></dl><p>' + R(b.note) + '</p>' +
        '<p><a class="btn small" href="https://micropython.org/download/' + b.uf2 + '/" target="_blank" rel="noopener">' + T(LP.get) + ' <bdi class="ltr">' + b.name + '</bdi> ↗</a></p>' +
        '<p class="muted" style="font-size:.88rem">' + T(LP.pick) + '</p></div></div>';
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-b]'); if (b) { cur = b.getAttribute('data-b'); draw(); } });
    draw();
  }

  /* ---------- "the board will not connect" ---------- */
  var NUKE = 'https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html#resetting-flash-memory';
  var TREE = {
    start: { q: B('החזיקו את BOOTSEL לחוץ וחברו את הכבל. האם מופיע במחשב כונן חדש (RP2350, או RPI-RP2 בלוח ישן יותר)?', 'Hold BOOTSEL down and plug in the cable. Does a new drive appear on the computer (RP2350, or RPI-RP2 on an older board)?'), yes: 'flashed', no: 'cable' },
    cable: { q: B('האם אתם בטוחים שהכבל מעביר נתונים? למשל כבל שמחבר טלפון למחשב ומעביר קבצים, ולא כבל שהגיע עם מטען.', 'Is the cable certainly a data cable? For example one that connects a phone to a computer and moves files, not one that came with a charger.'), yes: 'press', no: 'fixCable' },
    press: { q: B('נסו שוב, לאט: לחצו על BOOTSEL, החזיקו אותו, חברו את הכבל, ושחררו רק אחרי שנייה. השתמשו בשקע אחר במחשב, בלי מפצל USB. האם הכונן מופיע עכשיו?', 'Try again slowly: press BOOTSEL, hold it, plug in, and release only after a second. Use another socket on the computer, with no USB hub. Does the drive appear now?'), yes: 'flashed', no: 'fixBoard' },
    flashed: { q: B('האם גררתם לכונן את קובץ ה-UF2 שמתאים ללוח שלכם (ראו את בורר הלוחות שלמעלה), והאם הכונן נעלם מעצמו אחרי כמה שניות?', 'Did you drag the UF2 file that matches your board (the board picker above) onto the drive, and did the drive vanish by itself after a few seconds?'), yes: 'thonny', no: 'fixFile' },
    thonny: { q: B('האם בחרתם ב-Thonny, בפינה התחתונה, באפשרות MicroPython (Raspberry Pi Pico), והאם מופיע `>>>` בחלון ה-Shell?', 'In Thonny, did you choose MicroPython (Raspberry Pi Pico) in the bottom corner, and does `>>>` appear in the Shell?'), yes: 'fixOk', no: 'busy' },
    busy: { q: B('האם Thonny כותב Device is busy, could not enter REPL, או שתוכנית ישנה ממשיכה לרוץ ולא מאפשרת להקליד?', 'Does Thonny say Device is busy, could not enter REPL, or does an old program keep running and not let you type?'), yes: 'fixBusy', no: 'port' },
    port: { q: B('האם ברשימת הלוחות של Thonny (בפינה התחתונה, או בתפריט Run ואחריו Configure interpreter) מופיע פורט, כמו COM3 או /dev/ttyACM0?', 'Does Thonny\'s list of boards (the bottom corner, or Run then Configure interpreter) show a port, such as COM3 or /dev/ttyACM0?'), yes: 'fixNuke', no: 'fixPort' },
    fixCable: { fix: B('החליפו את הכבל. זו הסיבה הנפוצה ביותר, כי כבלי טעינה נראים בדיוק כמו כבלי נתונים. סמנו בכיתה את הכבלים שעובדים.', 'Replace the cable. This is the most common cause: charge-only cables look exactly like data cables. Mark the working cables in the classroom.') },
    fixBoard: { fix: B('נסו מחשב אחר וכבל אחר. אם גם אז הכונן לא מופיע, ייתכן שהלוח פגום, או שיש קצר בחיווט שמחובר אליו: נתקו ממנו את כל החוטים ונסו שוב.', 'Try another computer and another cable. If the drive still does not appear, the board may be faulty, or the wiring on it may have a short: remove every wire from it and try again.') },
    fixFile: { fix: B('פתחו את בורר הלוחות שלמעלה, הורידו את הקובץ של הלוח שלכם, וגררו אותו שוב לכונן. אם הכונן לא נעלם, חכו 10 שניות. זכרו שקובץ של לוח אחר לא יעבוד.', 'Open the board picker above, download the file for your board, and drag it onto the drive again. If the drive does not vanish, wait 10 seconds. A file for another board will not work.') },
    fixBusy: { fix: B('לחצו על כפתור Stop האדום ב-Thonny, ואחר כך על Ctrl+C בחלון ה-Shell. סגרו כל תוכנה אחרת שמחוברת ללוח: חלון Thonny נוסף, או המסוף שבתחתית האתר (לחצו "נתק"). אם `main.py` שעל הלוח נתקע בלולאה, פתחו ב-Thonny את View ואחריו Files, ומחקו את הקובץ מהלוח או שנו את שמו.', 'Press the red Stop button in Thonny, then Ctrl+C in the Shell. Close any other program connected to the board: a second Thonny window, or the console at the bottom of this site (press "Disconnect"). If the `main.py` on the board is stuck in a loop, open View then Files in Thonny and delete or rename that file on the board.') },
    fixPort: { fix: B('הלוח לא מזוהה כפורט טורי, כלומר אין עליו MicroPython תקין. צרבו שוב את הקובץ הנכון בעזרת BOOTSEL. ב-Linux, הוסיפו את המשתמש לקבוצה dialout (`sudo usermod -aG dialout $USER`) והתחברו מחדש. ב-Windows וב-macOS אין צורך בדרייבר.', 'The board is not showing up as a serial port, so it has no working MicroPython. Flash the right file again with BOOTSEL. On Linux, add your user to the dialout group (`sudo usermod -aG dialout $USER`) and log in again. Windows and macOS need no driver.') },
    fixNuke: { fix: B('כששום דבר לא עוזר, מחקו את כל הזיכרון של הלוח והתחילו מחדש: בדף של Raspberry Pi, בסעיף Resetting flash memory, יש קובץ UF2 מיוחד שמוחק הכול. גררו אותו לכונן במצב BOOTSEL, ואחר כך צרבו שוב את MicroPython. זהירות: כל הקבצים שעל הלוח יימחקו.', 'When nothing helps, erase the board\'s whole memory and start again: the Raspberry Pi page, in the section Resetting flash memory, has a special UF2 file that erases everything. Drag it onto the drive in BOOTSEL, then flash MicroPython again. Careful: every file on the board is deleted.'), link: NUKE },
    fixOk: { ok: true, fix: B('הלוח מחובר ועובד. המשיכו לשלב 5, התוכנית הראשונה שלכם.', 'The board is connected and working. Go on to step 5, your first program.') }
  };
  var LT = {
    h: B('הלוח לא מתחבר? ענו על כמה שאלות', 'The board will not connect? Answer a few questions'),
    yes: B('כן', 'Yes'), no: B('לא', 'No'), again: B('להתחיל מחדש', 'Start again'), back: B('שאלה קודמת', 'Previous question'),
    fixH: B('מה עושים', 'What to do'), docs: B('הדף של Raspberry Pi', 'The Raspberry Pi page')
  };
  /* A question tree. A node is a question with yes/no (q, yes, no) or with its own answers (q, opts: [[label, next]]),
     and may show code; an end node is a fix (fix, ok?, link?, linkLabel?). */
  function opts(n) { return n.opts || [[LT.yes, n.yes], [LT.no, n.no]]; }
  function tree(el, DEF, title) {
    DEF = DEF || TREE; title = title || LT.h;
    var path = ['start'];
    function draw() {
      var id = path[path.length - 1], n = DEF[id], done = path.slice(0, -1);
      var trail = done.map(function (pid, i) {
        var ans = opts(DEF[pid]).filter(function (o) { return o[1] === path[i + 1]; })[0];
        return '<li><span>' + R(DEF[pid].q) + '</span> <b class="ht-ans">' + (ans ? R(ans[0]) : '') + '</b></li>';
      }).join('');
      var ext = n.link && /^https?:/.test(n.link);
      el.innerHTML = '<div class="ht"><b class="hb-h">' + T(title) + '</b>' + (trail ? '<ol class="ht-trail">' + trail + '</ol>' : '') +
        (n.q ? '<div class="ht-q card"><p>' + R(n.q) + '</p>' + (n.code ? P.h.codeBlock(n.code) : '') + '<div class="ht-btns">' + opts(n).map(function (o) {
          return '<button type="button" class="btn small" data-go="' + o[1] + '">' + R(o[0]) + '</button>';
        }).join('') + '</div></div>'
          : '<div class="ht-fix card ' + (n.ok ? 'expect' : 'rules') + '"><b>' + T(n.ok ? { he: 'מעולה', en: 'Great' } : LT.fixH) + '</b><p>' + R(n.fix) + '</p>' +
            (n.link ? '<p><a href="' + n.link + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + T(n.linkLabel || LT.docs) + (ext ? ' ↗' : '') + '</a></p>' : '') + '</div>') +
        '<div class="ht-nav">' + (path.length > 1 ? '<button type="button" class="btn ghost small" data-back>' + T(LT.back) + '</button><button type="button" class="btn ghost small" data-again>' + T(LT.again) + '</button>' : '') + '</div></div>';
    }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-go')) path.push(b.getAttribute('data-go'));
      else if (b.hasAttribute('data-back')) path.pop();
      else if (b.hasAttribute('data-again')) path = ['start'];
      else return;
      draw();
      var q = el.querySelector('.ht-q, .ht-fix'); if (q && q.scrollIntoView) q.scrollIntoView({ block: 'nearest' });
    });
    draw();
  }

  /* ---------- "the I2C part is not found" ---------- */
  var I2C_TREE = {
    start: { q: B('הריצו את שלוש השורות האלה (עם הפינים שבקוד שלכם). מה הודפס?', 'Run these three lines (with the pins from your own code). What was printed?'),
      code: ['from machine import Pin, I2C', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'print([hex(a) for a in i2c.scan()])'],
      opts: [[B('`[]`: רשימה ריקה', '`[]`: an empty list'), 'empty'], [B('כתובת אחת או כמה כתובות', 'One address or a few'), 'found'], [B('כמעט כל הכתובות', 'Almost every address'), 'all'], [B('הודעת שגיאה', 'An error message'), 'error']] },
    empty: { q: B('האם הרכיב מקבל חשמל? כלומר, האם נורית דולקת עליו, או שמודד מראה כ-3.3V בין ה-VCC וה-GND שלו?', 'Does the part get power? A light on it is lit, or a meter shows about 3.3 V between its VCC and GND.'), yes: 'pins', no: 'fixPower' },
    pins: { q: B('האם ה-SDA של הרכיב מחובר לפין שכתוב ב-`sda=` בקוד, וה-SCL לפין שכתוב ב-`scl=`? (הם לא הפוכים?) והאם שני הפינים שייכים לאותו ערוץ, I2C(0) או I2C(1)?', 'Is the part\'s SDA wired to the pin named in `sda=` in the code, and SCL to the pin in `scl=`? (Not swapped?) And do the pins belong to the same channel, I2C(0) or I2C(1)?'), yes: 'pull', no: 'fixPins' },
    pull: { q: B('האם יש נגדי משיכה (pull-up) על SDA ועל SCL? כמעט כל מודול מוכן כולל אותם, אבל לחיישן "חשוף", בלי לוח מודול, אין אותם.', 'Are there pull-up resistors on SDA and SCL? Almost every ready-made module has them. A "bare" sensor chip, with no module board, does not.'), yes: 'fixLoose', no: 'fixPull' },
    found: { q: B('האם הכתובת שהודפסה זהה לכתובת שבקוד, או לכתובת שמופיעה בעמוד הרכיב?', 'Is the printed address the same as the one in the code, or the one on the part\'s page?'), yes: 'fixDriver', no: 'fixAddr' },
    error: { q: B('האם ההודעה היא `OSError: [Errno 5] EIO` או `ETIMEDOUT`, בשורה שקוראת מהרכיב?', 'Is the message `OSError: [Errno 5] EIO` or `ETIMEDOUT`, on a line that reads the part?'), yes: 'empty', no: 'fixValue' },
    fixPower: { fix: B('חברו את ה-VCC של הרכיב ל-3V3 (פין 36) ואת ה-GND שלו לפין GND. בדקו שהחוטים נעוצים עד הסוף, ושהרכיב עובד ב-3.3V (זה כתוב בעמוד שלו).', 'Wire the part\'s VCC to 3V3 (pin 36) and its GND to a GND pin. Check the wires are pushed all the way in, and that the part runs on 3.3 V (its page says).'), link: '#/components', linkLabel: B('לקטלוג הרכיבים', 'To the parts catalog') },
    fixPins: { fix: B('אם SDA ו-SCL הפוכים, החליפו ביניהם, או תקנו את המספרים בקוד. לא כל זוג פינים מתאים: לכל ערוץ I2C יש זוגות מותרים, ומפת הפינים מראה אותם.', 'Swap SDA and SCL if they are reversed, or fix the numbers in the code. Not every pair of pins will do: each I2C channel has allowed pairs, and the pinout shows them.'), link: '#/pinout/i2c', linkLabel: B('פיני I2C במפת הפינים', 'I2C pins on the pinout') },
    fixPull: { fix: B('הוסיפו נגד של 4.7 קילו-אוהם מ-SDA ל-3V3, ועוד נגד כזה מ-SCL ל-3V3. בלי נגדי משיכה, הקווים אף פעם לא חוזרים ל-1, ולכן הרכיב לא נשמע.', 'Add a 4.7 kilo-ohm resistor from SDA to 3V3, and another from SCL to 3V3. Without pull-ups the lines never return to 1 and the part is never heard.') },
    fixLoose: { fix: B('הכול נראה נכון על הנייר, ולכן החשוד הוא החומרה: חוט רופף, חוט שבור או רכיב תקול. החליפו את ארבעת החוטים, אחד בכל פעם, ונסו רכיב אחר מאותו סוג.', 'Everything looks right on paper, so suspect the hardware: a loose wire, a broken wire or a faulty part. Replace the four wires one at a time, and try another part of the same kind.') },
    fixAddr: { fix: B('השתמשו בכתובת שהסריקה מצאה. למשל, מסך שעונה בכתובת `0x3c` ולא `0x3d`, או מסך LCD שעונה ב-`0x27` ולא ב-`0x3f`. בחלק מהמודולים יש מגשר או רגל שמשנים את הכתובת.', 'Use the address the scan found. For example a display that answers at `0x3c`, not `0x3d`, or an LCD at `0x27`, not `0x3f`. Some modules have a jumper or a pin that changes the address.') },
    fixDriver: { ok: true, fix: B('החיווט תקין: הרכיב עונה בכתובת הנכונה. אם התוכנית עדיין לא עובדת, הבעיה בקוד או בספרייה, ולא בחוטים.', 'The wiring is fine: the part answers at the right address. If the program still does not work, the problem is in the code or the library, not the wires.'), link: '#/libraries', linkLabel: B('התקנת ספרייה', 'Installing a library') },
    fixValue: { fix: B('קראו את השורה האחרונה של ההודעה. `ValueError: bad SCL pin` (או SDA) אומר שהפין לא שייך לערוץ שבחרתם. `ImportError` אומר שהספרייה לא נמצאת על הלוח.', 'Read the last line of the message. `ValueError: bad SCL pin` (or SDA) means the pin does not belong to the channel you chose. `ImportError` means the library is not on the board.'), link: '#/libraries', linkLabel: B('התקנת ספרייה', 'Installing a library') },
    all: { fix: B('כשהסריקה "מוצאת" כמעט את כל הכתובות, משהו בקווים לא תקין: SDA או SCL מקוצר ל-GND, צף בלי נגד משיכה, או מחובר לפין הלא נכון. נתקו את הרכיב והריצו שוב. אם עכשיו הרשימה ריקה, הבעיה בחוטים של הרכיב.', 'When the scan "finds" nearly every address, the lines are broken: SDA or SCL is shorted to GND, floating with no pull-up, or on the wrong pin. Unplug the part and run again. If the list is now empty, the problem is in the part\'s wires.') }
  };
  var I2C_H = B('הרכיב ב-I2C לא נמצא? ענו על כמה שאלות', 'The I2C part is not found? Answer a few questions');

  /* ---------- 16-bit values: read_u16 and duty_u16 ---------- */
  var LB = {
    adcH: B('המספר 0 עד 65535: מה הוא אומר באמת', 'The number 0 to 65535: what it really is'),
    adc: [B('`read_u16()` תמיד מחזיר מספר בין 0 ל-65535, אף שהממיר שבשבב מודד רק 12 ביט (0 עד 4095). MicroPython מותח את המספר לטווח של 16 ביט, ולכן ארבעת הביטים התחתונים לא מוסיפים דיוק.', '`read_u16()` always returns a number from 0 to 65535, even though the chip\'s converter measures only 12 bits (0 to 4095). MicroPython stretches the number to the 16-bit range, so the bottom four bits add no precision.'),
      B('כדי להמיר את הערך למתח: `volts = value * 3.3 / 65535`. כדי להמיר אותו לאחוזים: `value * 100 / 65535`. טעות נפוצה היא לחלק ב-1023 (כמו ב-Arduino) או ב-4095.', 'To turn it into volts: `volts = value * 3.3 / 65535`. Into percent: `value * 100 / 65535`. A common mistake is dividing by 1023 (from Arduino) or by 4095.'),
      B('המספר "רוקד" בכמה עשרות גם כשלא נוגעים בשום דבר. זה רעש רגיל, וממוצע של כמה קריאות מייצב אותו.', 'The number "dances" by a few tens even when nothing is touched. That is ordinary noise. Averaging a few readings steadies it.')],
    pwmH: B('`duty_u16`: גם כאן 0 עד 65535', '`duty_u16`: here too, 0 to 65535'),
    pwm: [B('`duty_u16(0)` פירושו כבוי לגמרי, `duty_u16(65535)` פירושו דולק כל הזמן, ו-`duty_u16(32768)` פירושו דולק חצי מהזמן.', '`duty_u16(0)` is fully off, `duty_u16(65535)` is on all the time, and `duty_u16(32768)` half the time.'),
      B('טעות נפוצה היא לשלוח מספר בין 0 ל-255 (כמו ב-Arduino). 255 מתוך 65535 הם פחות מחצי אחוז, ולכן הלד כמעט לא נדלק. כדי להמיר מספר בטווח 0 עד 255 ל-16 ביט, הכפילו אותו ב-257.', 'A common mistake: sending a number from 0 to 255 (as on Arduino). 255 out of 65535 is under half a percent, and the LED barely lights. Convert from 0 to 255 to 16 bits by multiplying by 257.')],
    try: B('נסו בעצמכם: גררו את המחוון', 'Try it: drag the slider'),
    raw: B('הערך', 'The value'), volts: B('מתח', 'Voltage'), pct: B('אחוזים', 'Percent'), bits12: B('בערך 12 ביט', 'About 12 bits'), duty: B('הלד דולק', 'LED on for')
  };
  function bits16(el, kind) {
    var isAdc = kind === 'adc', v = 32768;
    var code = isAdc ? ['from machine import ADC', 'from time import sleep', '', 'pot = ADC(26)', '', 'while True:', '    total = 0', '    for i in range(8):            # average 8 readings', '        total += pot.read_u16()', '    value = total // 8', '    print(value, round(value * 3.3 / 65535, 2), "V")', '    sleep(0.2)']
      : ['from machine import Pin, PWM', '', 'led = PWM(Pin(15), freq=1000)', '', 'level = 128                    # a 0-255 value, as on Arduino', 'led.duty_u16(level * 257)      # stretched to 0-65535'];
    el.innerHTML = '<h2>' + R(isAdc ? LB.adcH : LB.pwmH) + '</h2>' + (isAdc ? LB.adc : LB.pwm).map(function (x) { return '<p>' + R(x) + '</p>'; }).join('') +
      '<div class="card b16"><b>' + T(LB.try) + '</b><input type="range" min="0" max="65535" step="1" value="' + v + '" aria-label="' + esc(T(LB.raw)) + '"><div class="b16-out"></div>' +
      (isAdc ? '' : '<div class="b16-bar" aria-hidden="true"><span></span></div>') + '</div>' + P.h.codeBlock(code);
    var inp = el.querySelector('input'), out = el.querySelector('.b16-out'), bar = el.querySelector('.b16-bar span');
    function show() {
      v = +inp.value;
      var pct = (v * 100 / 65535).toFixed(1);
      out.innerHTML = '<span>' + T(LB.raw) + ': <b class="ltr">' + v + '</b></span>' +
        (isAdc ? '<span>' + T(LB.volts) + ': <b class="ltr">' + (v * 3.3 / 65535).toFixed(3) + ' V</b></span><span>' + T(LB.bits12) + ': <b class="ltr">' + (v >> 4) + ' / 4095</b></span>'
          : '<span>' + T(LB.duty) + ': <b class="ltr">' + pct + '%</b></span><span>0-255: <b class="ltr">' + Math.round(v / 257) + '</b></span>') +
        '<span>' + T(LB.pct) + ': <b class="ltr">' + pct + '%</b></span>';
      if (bar) bar.style.width = pct + '%';
    }
    inp.addEventListener('input', show);
    show();
  }

  /* ---------- the libraries page ---------- */
  var LL = {
    h: B('התקנת ספרייה על הלוח', 'Putting a library on the board'),
    lead: B('ספרייה היא קובץ Python שהתוכנית שלכם טוענת בעזרת `import`. רוב החיישנים הפשוטים לא צריכים ספרייה, אבל מסכים וחלק מהמודולים כן צריכים. הקובץ חייב להיות שמור על הלוח עצמו, ולא במחשב.', 'A library is a Python file your program brings in with `import`. Most simple sensors need no library, but screens and some modules do. The file must sit on the board itself, not on the computer.'),
    waysH: B('שלוש דרכים להעלות ספרייה ללוח', 'Three ways to put a library on the board'),
    w1h: B('1. דרך Thonny (הכי פשוט)', '1. Through Thonny (simplest)'),
    w1: [B('לספרייה שמופיעה בחיפוש: ב-Thonny בחרו Tools ואחריו Manage packages, חפשו את השם ולחצו Install. Thonny יתקין אותה בתיקייה `lib` שעל הלוח.', 'For a library that shows up in search: in Thonny choose Tools, then Manage packages, search for the name and press Install. Thonny installs it into the `lib` folder on the board.'),
      B('לקובץ שקיבלתם (למשל מהאתר הזה): פתחו אותו ב-Thonny, בחרו File ואחריו Save as, בחרו Raspberry Pi Pico, והקלידו את השם בדיוק כמו בשורת ה-`import`, עם הסיומת `.py`.', 'For a file you were given (for example from this site): open it in Thonny, choose File then Save as, choose Raspberry Pi Pico, and type the name exactly as in the `import` line, with the `.py` ending.')],
    w2h: B('2. דרך mpremote (משורת הפקודה)', '2. Through mpremote (from the command line)'),
    w2: B('זהו כלי רשמי של MicroPython, שעובד בכל מערכת הפעלה. התקינו אותו פעם אחת עם `pip install mpremote`, וסגרו את Thonny לפני שאתם משתמשים בו.', 'An official MicroPython tool that works on every operating system. Install it once with `pip install mpremote`, and close Thonny before using it.'),
    w3h: B('3. דרך mip על הלוח (רק Pico 2 W)', '3. Through mip on the board (Pico 2 W only)'),
    w3: B('לוח עם Wi-Fi יכול להוריד ספרייה בעצמו, אחרי שהוא מתחבר לרשת. בלוח Pico 2 רגיל, שאין בו Wi-Fi, השתמשו בדרך 1 או בדרך 2.', 'A board with Wi-Fi can download a library itself, once it is on a network. On a plain Pico 2, with no Wi-Fi, use way 1 or 2.'),
    errH: B('קיבלתם ImportError? בדקו לפי הסדר', 'Got an ImportError? Check in this order'),
    err: [B('הקובץ שמור על הלוח ולא במחשב: ב-Thonny פתחו את View ואחריו Files, ובדקו שהקובץ מופיע תחת Raspberry Pi Pico.', 'The file is saved on the board, not the computer: in Thonny open View then Files, and check that it appears under Raspberry Pi Pico.'),
      B('השם זהה לגמרי, כולל אותיות גדולות וקטנות: `import pico_lcd` מחפש קובץ בשם `pico_lcd.py`.', 'The name matches exactly, including capital and small letters: `import pico_lcd` looks for a file named `pico_lcd.py`.'),
      B('הקובץ נמצא בתיקייה הראשית של הלוח או בתיקייה `lib`, ולא בתוך תיקייה אחרת.', 'The file is in the board\'s main folder, or in the `lib` folder. Not inside some other folder.'),
      B('לא נתתם לתוכנית שלכם שם של מודול קיים, כמו `machine.py` או `time.py`, כי קובץ כזה מסתיר את המודול האמיתי.', 'You did not name your own program after an existing module, such as `machine.py` or `time.py`. Such a file hides the real module.'),
      B('הספרייה נכתבה ל-MicroPython, ולא ל-Python הרגיל שבמחשב. ספרייה שנכתבה למחשב (למשל מ-pip רגיל) לא תרוץ על הלוח.', 'The library was written for MicroPython, not for ordinary Python on a computer. A computer library (for example from plain pip) will not run on the board.'),
      B('`ImportError: no module named \'network\'` אומר שנצרבה קושחה בלי Wi-Fi. צרבו את קובץ ה-W (ראו "איזה לוח יש לי?" בדף מתחילים).', '`ImportError: no module named \'network\'` means firmware without Wi-Fi was flashed. Flash the W file (see "Which board do I have?" on the Get started page).')],
    usedH: B('הספריות שהאתר משתמש בהן', 'The libraries this site uses'),
    part: B('רכיב', 'Part'), lib: B('ספרייה', 'Library'), how: B('איך מתקינים', 'How to install'),
    dl: B('הורדה', 'Download'),
    usedNote: B('את שלושת הקבצים שהאתר כתב בעצמו אפשר להוריד מכאן ישירות. הם נכתבו לפי דפי הנתונים, ועדיין לא נבדקו על לוח אמיתי.', 'The three files the site wrote itself can be downloaded here directly. They were written from the datasheets and have not yet been checked on a real board.')
  };
  P.viewLibraries = function (app) {
    var H = P.h, used = P.components.filter(function (c) { return c.lib; });
    app.className = 'page narrow';
    app.innerHTML = H.crumb('#/start', P.s('navStart')) + '<h1>' + T(LL.h) + '</h1><p class="lead" style="margin-block:8px 18px">' + R(LL.lead) + '</p>' +
      '<h2>' + T(LL.waysH) + '</h2>' +
      '<div class="card step-plain"><h3>' + T(LL.w1h) + '</h3>' + LL.w1.map(function (x) { return '<p>' + R(x) + '</p>'; }).join('') + '</div>' +
      '<div class="card step-plain"><h3>' + T(LL.w2h) + '</h3><p>' + R(LL.w2) + '</p>' +
      H.codeBlock(['mpremote mip install ssd1306        # install a library from the MicroPython index', 'mpremote cp pico_lcd.py :           # copy a file from the computer to the board', 'mpremote ls                         # list the files on the board'], null, true) + '</div>' +
      '<div class="card step-plain"><h3>' + T(LL.w3h) + '</h3><p>' + R(LL.w3) + '</p>' +
      H.codeBlock(['import mip', 'mip.install("ssd1306")   # needs the board to be on Wi-Fi first'], null, true) + '</div>' +
      '<h2>' + T(LL.errH) + '</h2><div class="card rules"><ol>' + LL.err.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ol></div>' +
      '<h2>' + T(LL.usedH) + '</h2><p class="muted">' + T(LL.usedNote) + '</p><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(LL.part) + '</th><th>' + T(LL.lib) + '</th><th>' + T(LL.how) + '</th></tr></thead><tbody>' +
      used.map(function (c) {
        return '<tr><td><a href="#/components/' + c.id + '">' + esc(T(c.name)) + '</a></td><td><b class="mono ltr">' + esc(c.lib.name) + '</b>' +
          (c.driver ? '<br><button type="button" class="btn ghost small" data-dl="' + c.id + '">' + T(LL.dl) + ' ' + esc(c.driver.file) + '</button>' : '') + '</td><td>' + R(c.lib.how) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var root = app.querySelector('.tbl');
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dl]');
      if (!b) return;
      var c = P.componentById(b.getAttribute('data-dl')), a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([c.driver.code.join('\n') + '\n'], { type: 'text/x-python' }));
      a.download = c.driver.file; document.body.appendChild(a); a.click(); a.remove();
    });
  };

  P.help = {
    BOARDS: BOARDS, TREE: TREE, I2C_TREE: I2C_TREE,
    mount: function (root) {
      root.querySelectorAll('[data-help]').forEach(function (el) {
        var k = el.getAttribute('data-help');
        if (k === 'picker') picker(el);
        else if (k === 'connect') tree(el);
        else if (k === 'i2c') tree(el, I2C_TREE, I2C_H);
        else if (k === 'bits-adc' || k === 'bits-pwm') bits16(el, k.slice(5));
      });
    }
  };
})(window.PICO);
