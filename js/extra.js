/* Two reference pages:
   #/pinsheet  a one-page printable pin map, laid out like the board (pin 1 opposite pin 40)
   #/tools     the editors and tools that talk to the Pico, side by side
   Both are linked from the footer; the pin sheet also from the pinout page, the tools page also from "Get started". */
(function (P) {
  'use strict';
  var T = P.t, R = function (v) { return P.rich(T(v)); }, esc = P.esc;
  var B = function (he, en) { return { he: he, en: en }; };

  /* ---------------- printable pin map ---------------- */
  var PS = {
    h: B('מפת פינים להדפסה', 'Printable pin map'),
    lead: B('עמוד אחד, מסודר כמו הלוח עצמו: פין 1 מול פין 40, ושקע ה-USB למעלה. הדפיסו אותו ותלו אותו ליד כל עמדה, או שמרו אותו בתיק המעבדה.', 'One page, laid out like the board itself: pin 1 opposite pin 40, and the USB socket at the top. Print it and hang it at each bench, or keep it in the lab folder.'),
    print: B('הדפסה', 'Print'),
    back: B('למפת הפינים האינטראקטיבית', 'To the interactive pinout'),
    usb: B('USB למעלה', 'USB at the top'),
    num: B('פין', 'Pin'), name: B('שם בקוד', 'Name in code'), more: B('תפקידים נוספים', 'Other jobs'),
    rulesH: B('שלושה כללים', 'Three rules'),
    rules: [
      B('`Pin(n)` מקבל את מספר ה-GP, ולא את מספר הפין על הלוח. GP15 הוא פין 20.', '`Pin(n)` takes the GP number, not the pin number on the board. GP15 is pin 20.'),
      B('כל פין עובד ב-3.3V בלבד. לעולם אל תחברו 5V לאף פין GP.', 'Every pin is 3.3 V only. Never connect 5 V to any GP pin.'),
      B('ADC יש רק ב-GP26, GP27 ו-GP28. שני הפינים של I2C חייבים להיות מאותו אפיק (I2C0 או I2C1).', 'ADC only on GP26, GP27 and GP28. Two I2C pins must come from the same bus (I2C0 or I2C1).')
    ],
    onboardH: B('בלי חוטים', 'With no wires'),
    onboard: B('הלד שעל הלוח: `Pin("LED")`. חיישן הטמפרטורה שבתוך השבב: `ADC(4)`. מתח ההזנה (שליש ממנו): `ADC(3)`.', 'The board\'s LED: `Pin("LED")`. The temperature sensor inside the chip: `ADC(4)`. The supply voltage (a third): `ADC(3)`.')
  };
  var KIND_CLASS = { gpio: 'gpio', gnd: 'gnd', power: 'power', sys: 'sys' };

  function funcText(pin) {
    if (pin.kind !== 'gpio') return '';
    return pin.funcs.filter(function (f) { return f.type !== 'gpio'; }).map(function (f) {
      return '<span class="ps-f ps-' + f.type + '">' + esc(f.label) + '</span>';
    }).join(' ');
  }
  function cell(pin, side) {
    var name = '<b class="ps-name ps-k-' + (KIND_CLASS[pin.kind] || 'sys') + '">' + esc(pin.label || pin.name) + '</b>';
    var n = '<span class="ps-num">' + pin.num + '</span>';
    var f = '<span class="ps-funcs">' + funcText(pin) + '</span>';
    /* the left column reads outward from the board's left edge, the right column from its right edge */
    return side === 'l' ? '<td class="ps-fcell">' + f + '</td><td>' + name + '</td><td>' + n + '</td>' : '<td>' + n + '</td><td>' + name + '</td><td class="ps-fcell">' + f + '</td>';
  }

  P.viewPinSheet = function (app) {
    app.className = 'page pinsheet';
    var rows = '';
    for (var i = 1; i <= 20; i++) {
      rows += '<tr>' + cell(P.pinByNum(i), 'l') + '<td class="ps-board"></td>' + cell(P.pinByNum(41 - i), 'r') + '</tr>';
    }
    app.innerHTML =
      '<div class="crumb no-print"><a href="#/pinout">' + T(PS.back) + '</a></div>' +
      '<h1>' + T(PS.h) + '</h1><p class="lead no-print" style="margin-top:8px">' + T(PS.lead) + '</p>' +
      '<p class="no-print"><button type="button" class="btn" id="ps-print">' + T(PS.print) + '</button></p>' +
      '<div class="ps-wrap" dir="ltr"><table class="ps-table">' +
      '<thead><tr><th>' + T(PS.more) + '</th><th>' + T(PS.name) + '</th><th>' + T(PS.num) + '</th><th class="ps-board ps-usb">' + T(PS.usb) + '</th><th>' + T(PS.num) + '</th><th>' + T(PS.name) + '</th><th>' + T(PS.more) + '</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<div class="ps-notes"><div><b>' + T(PS.rulesH) + '</b><ol>' + PS.rules.map(function (r) { return '<li>' + R(r) + '</li>'; }).join('') + '</ol></div>' +
      '<div><b>' + T(PS.onboardH) + '</b><p>' + R(PS.onboard) + '</p></div></div>';
    document.getElementById('ps-print').addEventListener('click', function () { window.print(); });
  };

  /* ---------------- tools ---------------- */
  var TL = {
    h: B('כלים לעבודה עם ה-Pico', 'Tools for working with the Pico'),
    lead: B('כל הכלים האלה עושים את אותו הדבר הבסיסי: הם שולחים קוד ללוח, מריצים אותו ומציגים את ההדפסות. ההבדל ביניהם הוא בנוחות ובמידה שבה הם מתאימים לכיתה. האתר בנוי סביב Thonny, וכל השיעורים עובדים גם בשאר הכלים.', 'All these tools do the same basic thing: send code to the board, run it and show the prints. The difference is in convenience and in what suits a class. The site is written around Thonny, and every lesson works in the other tools too.'),
    cols: [B('כלי', 'Tool'), B('מה זה', 'What it is'), B('למי זה מתאים', 'Suits'), B('איך מריצים קובץ', 'How to run a file')],
    tools: [
      { name: 'Thonny', url: 'https://thonny.org',
        what: B('עורך פשוט עם כפתור הרצה ירוק וחלון הדפסות. התקינו אותו, בחרו בפינה הימנית התחתונה "MicroPython (Raspberry Pi Pico)", וזהו.', 'A simple editor with a green run button and a print window. Install it, choose "MicroPython (Raspberry Pi Pico)" at the bottom right, and that is it.'),
        who: B('מתחילים ומעבדה בכיתה. זה הכלי שהאתר בחר.', 'Beginners, and a classroom lab. The site\'s choice.'),
        run: B('כפתור ה-Run הירוק (F5). שמירה על הלוח: File, Save as, Raspberry Pi Pico.', 'The green Run button (F5). Saving on the board: File, Save as, Raspberry Pi Pico.') },
      { name: 'VS Code + MicroPico', url: 'https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go',
        what: B('תוסף לעורך VS Code. הוא מאפשר השלמה אוטומטית, עבודה עם תיקיית פרויקט שלמה, והעלאה של כל הקבצים ללוח בפקודה אחת.', 'An extension for the VS Code editor. Gives autocomplete, work with a whole project folder, and uploading every file to the board in one command.'),
        who: B('סטודנטים שכבר מכירים VS Code, ופרויקטים עם כמה קבצים.', 'Students who already know VS Code, and projects with several files.'),
        run: B('בשורת המצב: Run. או מלוח הפקודות: MicroPico: Run current file. העלאת הפרויקט: MicroPico: Upload project to Pico.', 'In the status bar: Run. Or from the command palette: MicroPico: Run current file. Uploading the project: MicroPico: Upload project to Pico.') },
      { name: 'ViperIDE', url: 'https://viper-ide.org',
        what: B('עורך שרץ בדפדפן (Chrome או Edge), בלי התקנה. הוא מתחבר ללוח דרך USB ישירות מהדף.', 'An editor that runs in the browser (Chrome or Edge), with no installing. It connects to the board over USB straight from the page.'),
        who: B('מחשבים שאי אפשר להתקין עליהם תוכנות, ומחשבי Chromebook.', 'Computers where software cannot be installed, and Chromebooks.'),
        run: B('לחצו Connect, בחרו את הלוח, ואז לחצו על כפתור ההרצה.', 'Connect, choose the board, then the run button.') },
      { name: 'mpremote', url: 'https://docs.micropython.org/en/latest/reference/mpremote.html',
        what: B('כלי שורת הפקודה הרשמי של MicroPython. מתקינים אותו עם `pip install mpremote`.', 'MicroPython\'s official command-line tool. Install it with `pip install mpremote`.'),
        who: B('מרצים ומשתמשים מתקדמים: הכנה של הרבה לוחות, סקריפטים ובדיקות אוטומטיות.', 'Lecturers and advanced users: preparing many boards, scripts, and automatic checks.'),
        run: B('`mpremote run main.py` מריץ בלי לשמור. `mpremote cp main.py :` שומר את הקובץ על הלוח. `mpremote mip install ssd1306` מתקין ספרייה.', '`mpremote run main.py` runs without saving. `mpremote cp main.py :` saves it on the board. `mpremote mip install ssd1306` installs a library.') },
      { name: B('האתר הזה', 'This site'), url: '#/start',
        what: B('כפתור "הריצו על הלוח" שליד כל קוד באתר. הוא מתחבר דרך USB מהדפדפן (Chrome או Edge).', 'The "Run on board" button next to every code block on the site. Connects over USB from the browser (Chrome or Edge).'),
        who: B('הרצה מהירה של דוגמה, בלי להעתיק אותה.', 'Running an example quickly without copying it.'),
        run: B('לחצו על "חיבור ללוח" בתחתית הדף, ואחר כך על "הריצו על הלוח" שליד הקוד.', '"Connect to board" at the bottom of the page, then "Run on board" next to the code.') }
    ],
    ruleH: B('כלל אחד לכל הכלים', 'One rule for every tool'),
    rule: B('רק כלי אחד יכול לתקשר עם הלוח בכל רגע נתון. אם Thonny פתוח ומחובר, ViperIDE או האתר יקבלו "port busy". סגרו את הכלי השני, או לחצו בו על Disconnect.', 'Only one tool can talk to the board at a time. If Thonny is open and connected, ViperIDE or the site will get "port busy". Close the other tool, or press Disconnect in it.'),
    prepH: B('הכנה של הרבה לוחות לפני מעבדה', 'Preparing many boards before a lab'),
    prep: B('עם mpremote אפשר להעתיק את אותם הקבצים לכל לוח שמחברים, בפקודה אחת:', 'With mpremote you can copy the same files to every board you plug in, with one command:')
  };

  P.viewTools = function (app) {
    app.className = 'page';
    app.innerHTML = '<h1>' + T(TL.h) + '</h1><p class="lead" style="margin-top:10px">' + R(TL.lead) + '</p>' +
      '<div class="tbl-wrap"><table class="tbl tools-tbl"><thead><tr>' + TL.cols.map(function (c) { return '<th>' + T(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      TL.tools.map(function (t) {
        var name = typeof t.name === 'string' ? t.name : T(t.name);
        var link = t.url.charAt(0) === '#' ? '<a href="' + t.url + '">' + esc(name) + '</a>' : '<a href="' + t.url + '" target="_blank" rel="noopener">' + esc(name) + ' ↗</a>';
        return '<tr><th scope="row">' + link + '</th><td>' + R(t.what) + '</td><td>' + R(t.who) + '</td><td>' + R(t.run) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="callout" style="margin-top:16px"><b>' + T(TL.ruleH) + ':</b> ' + R(TL.rule) + '</div>' +
      '<h2>' + T(TL.prepH) + '</h2><p>' + R(TL.prep) + '</p>' +
      P.h.codeBlock(['# run in a terminal on the lecturer\'s computer, once per board', 'mpremote cp main.py ssd1306.py :', 'mpremote ls'], null, true);
  };
})(window.PICO);
