/* The debugging cheat sheet (#/debug): one printable page to hand out in week 1.
   How to look for a fault, what each error message means, and what common symptoms point to. */
(function (P) {
  'use strict';
  var T = P.t, R = function (v) { return P.rich(T(v)); };
  var B = function (he, en) { return { he: he, en: en }; };

  var L = {
    h: B('דף עזר: איך מוצאים תקלה', 'Cheat sheet: finding a fault'),
    lead: B('עמוד אחד שאפשר להדפיס ולחלק בשבוע הראשון. קודם השיטה, אחר כך מה אומרות הודעות השגיאה, ולבסוף מה מלמדים הסימפטומים כשאין הודעה בכלל.', 'One page to print and hand out in week one. First the method, then what the error messages say, and last what the symptoms say when there is no message at all.'),
    print: B('הדפסה', 'Print'),
    methodH: B('השיטה: חמישה צעדים, לפי הסדר', 'The method: five steps, in order'),
    method: [
      B('קראו את השורה האחרונה של הודעת השגיאה, ואת מספר השורה שמופיע בה.', 'Read the last line of the error message, and the line number it names.'),
      B('הדפיסו: `print()` של הערך החשוד מראה מה הלוח רואה באמת, ולא מה שהנחנו.', 'Print: a `print()` of the suspect value shows what the board really sees, not what we assumed.'),
      B('השוו את החיווט לטבלה, חוט אחרי חוט. מספר הפין בקוד הוא מספר ה-GP, ולא המספר הפיזי.', 'Compare the wiring with the table, wire by wire. The pin number in code is the GP number, not the physical one.'),
      B('חצי-חצי: נתקו הכול חוץ מרכיב אחד, ודאו שהוא עובד, ורק אז הוסיפו את הרכיב הבא.', 'Half and half: disconnect everything but one part, make sure it works, then add the next.'),
      B('שנו דבר אחד בכל פעם, והריצו שוב.', 'Change one thing at a time, and run again.')
    ],
    errH: B('הודעות שגיאה', 'Error messages'), msg: B('ההודעה', 'The message'), means: B('מה זה אומר', 'What it means'), todo: B('מה עושים', 'What to do'),
    errors: [
      ['IndentationError', B('הרווחים בתחילת השורה שגויים', 'The spaces at the start of a line are wrong'), B('השתמשו בארבעה רווחים לכל רמה, ואל תערבבו אותם עם Tab', 'Four spaces per level, never mixed with Tab')],
      ['SyntaxError', B('Python לא מצליח לקרוא את השורה', 'Python cannot read the line'), B('חסרים `:`, סוגר או מירכאה, בשורה הזו או בשורה שלפניה', 'A missing `:`, bracket or quote, on this line or the one before')],
      ["NameError: name 'x' isn't defined", B('השתמשתם בשם שלא הוגדר אף פעם', 'A name that was never defined'), B('שגיאת כתיב, או שחסרה שורת `import`', 'A typo, or a missing `import`')],
      ["ImportError: no module named 'x'", B('הספרייה לא נמצאת על הלוח', 'The library is not on the board'), B('שמרו את הקובץ על הלוח (ראו את הדף "התקנת ספרייה")', 'Save the file on the board (the "Installing a library" page)')],
      ['AttributeError', B('לאובייקט אין פקודה בשם הזה', 'The object has no command by that name'), B('בדקו את השם בעמוד של הרכיב, למשל `duty_u16` ולא `duty`', 'Check the name on the part\'s page, e.g. `duty_u16`, not `duty`')],
      ['ValueError: bad SCL pin', B('הפין לא מתאים לתפקיד או לערוץ', 'The pin does not fit the job or the channel'), B('בחרו פין מתאים במפת הפינים', 'Pick a suitable pin on the pinout')],
      ['OSError: [Errno 5] EIO', B('רכיב I2C לא עונה', 'An I2C part does not answer'), B('עברו על עץ השאלות של I2C: חשמל, SDA ו-SCL, כתובת', 'The I2C question tree: power, SDA and SCL, address')],
      ["TypeError: can't convert float to int", B('נשלח מספר עשרוני במקום שבו צריך מספר שלם', 'A decimal number was sent where a whole one is needed'), B('עטפו אותו ב-`int()`, למשל `duty_u16(int(x))`', 'Wrap it in `int()`, e.g. `duty_u16(int(x))`')],
      ['MemoryError', B('נגמר הזיכרון', 'Out of memory'), B('רשימה שגדלה בלי סוף בתוך לולאה, או קובץ גדול מדי', 'A list that grows forever in a loop, or a file that is too big')]
    ],
    symH: B('אין הודעת שגיאה, אבל משהו לא עובד', 'No message, but something is wrong'), see: B('מה רואים', 'What you see'), cause: B('הסיבה הנפוצה', 'The usual cause'),
    symptoms: [
      [B('הלד לא נדלק', 'The LED does not light'), B('הלד הפוך (הרגל הארוכה צריכה להיות מחוברת לפין), הפין בקוד שגוי (מספר GP מול מספר פיזי), או שהנגד חסר או גדול מדי', 'The LED is reversed (long leg to the pin), the wrong pin in code (GP versus physical), the resistor missing or too large')],
      [B('כפתור "נלחץ" מעצמו, או שהקריאה קופצת', 'A button "presses" itself, or a reading jumps'), B('כניסה צפה: חסר `Pin.PULL_UP`, או שחוט ה-GND רופף', 'A floating input: a missing `Pin.PULL_UP`, or a loose GND wire')],
      [B('הכפתור מגיב רק לפעמים', 'The button reacts only sometimes'), B('יש `sleep` ארוך בלולאה, ולכן הלוח "ישן" בזמן הלחיצה', 'A long `sleep` in the loop: the board "sleeps" through the press')],
      [B('לחיצה אחת נספרת כמה פעמים', 'One press counts several times'), B('ריטוט של הכפתור: חכו 20-50 מילישניות אחרי כל שינוי', 'Button bounce: wait 20-50 milliseconds after a change')],
      [B('ערך ה-ADC מגיע לאלפי אחוזים', 'An ADC value reaches thousands of percent'), B('חילקתם ב-1023 או ב-4095 במקום ב-65535', 'Dividing by 1023 or 4095 instead of 65535')],
      [B('הלד בקושי נדלק ב-PWM', 'The LED barely lights on PWM'), B('נשלח ל-`duty_u16` ערך בטווח 0-255, אבל הוא מצפה לערך בטווח 0-65535', 'A 0-255 value sent to `duty_u16`, which expects 0-65535')],
      [B('הלוח מתנתק כשהמנוע מתחיל לפעול', 'The board drops out when a motor starts'), B('המנוע מקבל חשמל מהלוח. הוא צריך ספק נפרד ו-GND משותף', 'The motor is fed from the board. It needs its own supply and a shared GND')],
      [B('עובד כשהלוח מחובר למחשב, אבל לא מסוללה', 'Works from the computer, not from a battery'), B('התוכנית לא נשמרה על הלוח בשם `main.py`', 'The program was not saved as `main.py` on the board')],
      [B('Thonny לא רואה את הלוח', 'Thonny cannot see the board'), B('הכבל מיועד לטעינה בלבד, או שתוכנה אחרת תופסת את הפורט', 'A charge-only cable, or another program holds the port')]
    ],
    rulesH: B('ארבעה כללים ששומרים על הלוח שלם', 'Four rules that keep the board alive'),
    rules: [
      B('כל פין עובד ב-3.3V בלבד. לעולם אל תחברו אליו 5V.', 'Every pin is 3.3 V only. Never connect 5 V to one.'),
      B('פין מספק זרם קטן (כמה מיליאמפר): הוא יכול להפעיל לד עם נגד, אבל לא מנוע או ממסר.', 'A pin gives a small current (a few milliamps): an LED with a resistor yes, a motor or a relay no.'),
      B('לכל הספקים צריך להיות GND משותף.', 'Every supply shares a common GND.'),
      B('חברו ונתקו חוטים רק כשהלוח מנותק מה-USB.', 'Connect and disconnect wires only while the board is unplugged from USB.')
    ],
    links: B('באתר: "הלוח לא מתחבר" בדף מתחילים · עץ השאלות של I2C בדף I2C · "התקנת ספרייה" · פרק 13, איך מוצאים תקלה', 'On the site: "The board will not connect" on the Get started page · the I2C tree on the I2C page · "Installing a library" · chapter 13, finding faults')
  };

  P.viewDebugSheet = function (app) {
    app.className = 'page narrow';
    var row = function (cells) { return '<tr>' + cells.map(function (c) { return '<td>' + (typeof c === 'string' ? '<code class="ltr">' + P.esc(c) + '</code>' : R(c)) + '</td>'; }).join('') + '</tr>'; };
    app.innerHTML = '<div class="sheet">' +
      '<div class="sheet-bar no-print"><button type="button" class="btn" id="dbg-print">' + T(L.print) + '</button></div>' +
      '<h1>' + T(L.h) + '</h1><p class="lead">' + T(L.lead) + '</p>' +
      '<h2>' + T(L.methodH) + '</h2><ol class="sheet-ol">' + L.method.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ol>' +
      '<h2>' + T(L.errH) + '</h2><div class="tbl-wrap"><table class="tbl sheet-tbl"><thead><tr><th>' + T(L.msg) + '</th><th>' + T(L.means) + '</th><th>' + T(L.todo) + '</th></tr></thead><tbody>' + L.errors.map(row).join('') + '</tbody></table></div>' +
      '<h2>' + T(L.symH) + '</h2><div class="tbl-wrap"><table class="tbl sheet-tbl"><thead><tr><th>' + T(L.see) + '</th><th>' + T(L.cause) + '</th></tr></thead><tbody>' + L.symptoms.map(row).join('') + '</tbody></table></div>' +
      '<h2>' + T(L.rulesH) + '</h2><ul class="sheet-ol">' + L.rules.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="muted sheet-foot">' + T(L.links) + '</p></div>';
    document.getElementById('dbg-print').addEventListener('click', function () { window.print(); });
  };
})(window.PICO);
