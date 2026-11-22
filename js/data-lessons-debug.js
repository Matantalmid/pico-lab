/* Track T: find the bug. Six short labs that reuse circuits from tracks A to C.
   Each one runs code with one planted fault. The student sees the symptom, looks for the cause,
   and fixes it. The fixed code is in the second task's solution. Comes right after track D. */
(function (P) {
  'use strict';
  var L = P._l, B = L.B, Q = L.Q, PLUG = L.PLUG, RUN = L.RUN;

  var SEE = B('מה תראו (זה הבאג)', 'What you will see (this is the bug)');
  var FIX = B('מצאו ותקנו', 'Find it and fix it');
  var FIXHINT = B('נסו לבד לפני שפותחים את הרמז, והיעזרו בדף העזר לתקלות.', 'Try on your own before opening the hint. Use the fault-finding cheat sheet.');
  var LOOK = B('הריצו את התוכנית, והסתכלו מה קורה. אל תשנו עדיין שום דבר בקוד.', 'Run it, and watch what happens. Do not change anything in the code yet.');
  var SHEET = { href: '#/debug', label: B('דף העזר לתקלות', 'The fault-finding cheat sheet'), why: B('השיטה בחמישה צעדים, וטבלת הסימפטומים.', 'The five-step method, and the table of symptoms.') };
  function build(id) { return B('בנו את המעגל של שיעור ' + id + ', בדיוק לפי טבלת החיווט שלו. המעגל תקין, והבאג נמצא בקוד.', 'Build the circuit from lesson ' + id + ', exactly as in its table. The circuit is right: the bug is in the code.'); }
  function tasks(where, why, fixed) {
    return [{ t: B('מצאו את השורה שגורמת לבעיה.', 'Find the line that causes the problem.'), hint: where },
      { t: B('תקנו אותה, הריצו שוב, והסבירו במשפט אחד למה זה קרה.', 'Fix it, run again, and explain in one sentence why it happened.'), hint: why, code: fixed }];
  }

  P.tracks.splice(4, 0, { id: 'T', color: '--c-uart', title: B('מצאו את הבאג', 'Find the bug'),
    desc: B('שש מעבדות קצרות, ובכל אחת תקלה שתולה. מתרגלים בהן את המיומנות החשובה ביותר במעבדה: לגלות למה משהו לא עובד.', 'Six short labs with a planted fault. Practise the skill that matters most in a lab: finding out why something does not work.') });

  var labs = [
    /* ------------------------------------------------------------ T1 */
    {
      id: 'T1', track: 'T',
      title: B('הלד שלא מהבהב', 'The LED that will not blink'),
      goal: B('התוכנית רצה בלי שגיאה, אבל הלד לא עושה כלום. גלו למה.', 'The program runs with no error, but the LED does nothing. Find out why.'),
      learn: [B('איך מבדילים בין מספר פין פיזי (1 עד 40) לבין מספר ה-GP שבקוד.', 'To tell a physical pin number (1 to 40) from the GP number in code.'), B('שגם תוכנית שרצה בלי שגיאה יכולה להיות שגויה.', 'That a program with no error can still be wrong.')],
      before: [{ href: '#/lessons/A1', label: B('שיעור A1, הלד הראשון', 'Lesson A1, the first LED'), why: B('בונים את אותו מעגל.', 'Build the same circuit.') }, SHEET],
      parts: [{ id: 'led', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      steps: [build('A1'), PLUG, RUN, LOOK],
      code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(20, Pin.OUT)      # the LED is on pin 20', '', 'while True:', '    led.toggle()', '    sleep(0.5)'],
      expectTitle: SEE,
      expect: B('אין שום הודעת שגיאה, והלד לא נדלק בכלל.', 'There is no error message at all, and the LED never lights.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('הסתכלו על שורה 4, ועל טבלת החיווט של A1. הלד מחובר לפין 20 של הלוח, אבל איך קוראים לפין הזה בקוד?', 'Look at line 4, and at A1\'s wiring table. The LED is on the board\'s pin 20, but what is that pin called in code?'),
        B('`Pin(n)` מקבל מספר GP, ולא מספר פיזי. פין פיזי 20 הוא `GP15`. הקוד הדליק וכיבה את GP20, שאין עליו שום דבר.', '`Pin(n)` takes a GP number, not a physical one. Physical pin 20 is `GP15`. The code was switching GP20, which has nothing on it.'),
        ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)      # physical pin 20 is GP15', '', 'while True:', '    led.toggle()', '    sleep(0.5)']),
      quiz: [Q(B('לד מחובר לפין הפיזי 1 של הלוח. מה כותבים בקוד?', 'An LED is wired to the board\'s physical pin 1. What goes in the code?'), [B('`Pin(1, Pin.OUT)`', '`Pin(1, Pin.OUT)`'), B('`Pin(0, Pin.OUT)`', '`Pin(0, Pin.OUT)`'), B('`Pin("1", Pin.OUT)`', '`Pin("1", Pin.OUT)`')], 1, B('פין פיזי 1 הוא GP0. בדקו תמיד במפת הפינים.', 'Physical pin 1 is GP0. Always check the pinout.'))]
    },
    /* ------------------------------------------------------------ T2 */
    {
      id: 'T2', track: 'T',
      title: B('הכפתור שנלחץ לבד', 'The button that presses itself'),
      goal: B('הלד מהבהב ומשתנה גם כשאף אחד לא נוגע בכפתור. גלו למה.', 'The LED flickers and changes even when nobody touches the button. Find out why.'),
      learn: [B('מה זו כניסה "צפה".', 'What a "floating" input is.'), B('למה צריך נגד משיכה (pull-up).', 'Why a pull-up resistor is needed.')],
      before: [{ href: '#/lessons/A3', label: B('שיעור A3, כפתור שמדליק לד', 'Lesson A3, a button that lights an LED'), why: B('בונים את אותו מעגל.', 'Build the same circuit.') }, SHEET],
      parts: [{ id: 'led', qty: 1 }, { id: 'button', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      steps: [build('A3'), PLUG, RUN, LOOK, B('קרבו אצבע לחוט של הכפתור בלי לגעת בו, והסתכלו על המספרים.', 'Bring a finger near the button\'s wire without touching it, and watch the numbers.')],
      code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'button = Pin(14, Pin.IN)', '', 'while True:', '    print(button.value())', '    led.value(not button.value())', '    sleep(0.1)'],
      expectTitle: SEE,
      expect: B('המספרים שמודפסים קופצים בין 0 ל-1 באופן אקראי, והלד מהבהב גם בלי שלוחצים. לפעמים מספיק לקרב יד.', 'The printed numbers jump between 0 and 1 at random, and the LED flickers with no press. Sometimes bringing a hand near is enough.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('השוו את שורה 5 לשורה המקבילה בשיעור A3. מה מחזיק את הפין על 1 כשהכפתור לא לחוץ?', 'Compare line 5 with the matching line in lesson A3. What holds the pin at 1 while the button is not pressed?'),
        B('בלי `Pin.PULL_UP` הפין לא מחובר לשום מתח כשהכפתור פתוח, ולכן הוא "צף" וקולט רעשים. נגד המשיכה הפנימי מחזיק אותו על 1, והכפתור מוריד אותו ל-0.', 'Without `Pin.PULL_UP` the pin is tied to no voltage while the button is open, so it "floats" and picks up noise. The internal pull-up holds it at 1, and the button pulls it to 0.'),
        ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', '', 'while True:', '    print(button.value())', '    led.value(not button.value())', '    sleep(0.1)']),
      quiz: [Q(B('כפתור מחובר בין GP14 ל-GND. מה הפין קורא כשהכפתור לחוץ, עם `Pin.PULL_UP`?', 'A button is wired between GP14 and GND. What does the pin read while it is pressed, with `Pin.PULL_UP`?'), [B('1', '1'), B('0', '0'), B('ערך אקראי', 'A random value')], 1, B('הכפתור מחבר את הפין ל-GND, ולכן הוא קורא 0. כשהכפתור משוחרר, הנגד מושך את הפין ל-1.', 'The button connects the pin to GND, so 0. Released, the resistor pulls it to 1.'))]
    },
    /* ------------------------------------------------------------ T3 */
    {
      id: 'T3', track: 'T',
      title: B('הכפתור שמגיב רק לפעמים', 'The button that only works sometimes'),
      goal: B('לחיצה קצרה על הכפתור לפעמים נקלטת ולפעמים לא. גלו למה.', 'A short press of the button is sometimes caught and sometimes missed. Find out why.'),
      learn: [B('ש-`sleep` עוצר את כל התוכנית.', 'That `sleep` stops the whole program.'), B('איך בודקים כפתור לעיתים קרובות, בלי לעצור את הלולאה.', 'To check a button often, without stopping the loop.')],
      before: [{ href: '#/lessons/A3', label: B('שיעור A3, כפתור שמדליק לד', 'Lesson A3, a button that lights an LED'), why: B('בונים את אותו מעגל.', 'Build the same circuit.') }, SHEET],
      parts: [{ id: 'led', qty: 1 }, { id: 'button', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      steps: [build('A3'), PLUG, RUN, B('לחצו על הכפתור כמה לחיצות קצרות ומהירות, וספרו כמה מהן נקלטו.', 'Give the button short, quick presses, and count how many are caught.')],
      code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', 'count = 0', '', 'while True:', '    if button.value() == 0:', '        count += 1', '        print("press", count)', '        led.toggle()', '    sleep(1)                # wait a second between checks'],
      expectTitle: SEE,
      expect: B('לחיצה קצרה נקלטת רק אם היא קורית בדיוק ברגע הבדיקה. רוב הלחיצות המהירות לא נספרות, ולחיצה ארוכה נספרת כמה פעמים.', 'A short press is caught only if it lands exactly on the moment of the check. Most quick presses are not counted, and a long press is counted several times.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('כמה פעמים בשנייה התוכנית בודקת את הכפתור? ומה הלוח עושה בשאר הזמן?', 'How many times a second does the program check the button? What is the board doing the rest of the time?'),
        B('`sleep(1)` עוצר הכול לשנייה שלמה, ולחיצה של עשירית שנייה נופלת בתוך זמן השינה. בדקו את הכפתור כל 20 מילישניות, וספרו רק את הרגע שבו הוא עובר מ-1 ל-0, כך שלחיצה ארוכה תיספר פעם אחת.', '`sleep(1)` stops everything for a whole second, and a press of a tenth of a second falls inside the sleep. Check every 20 milliseconds, and count only the moment the button goes from 1 to 0, so a long press counts once.'),
        ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', 'count = 0', 'before = 1', '', 'while True:', '    now = button.value()', '    if before == 1 and now == 0:     # the moment of the press', '        count += 1', '        print("press", count)', '        led.toggle()', '    before = now', '    sleep(0.02)                     # check 50 times a second']),
      quiz: [Q(B('תוכנית בודקת כפתור, ואחר כך קוראת ל-`sleep(2)`. מה יקרה ללחיצה של חצי שנייה?', 'A program checks a button and then calls `sleep(2)`. What happens to a half-second press?'), [B('היא תמיד תיקלט', 'It is always caught'), B('היא תיקלט רק אם תיפול על רגע הבדיקה', 'It is caught only if it lands on the moment of the check'), B('היא תעיר את הלוח מהשינה', 'It wakes the board from the sleep')], 1, B('`sleep` רגיל לא מתעורר כשלוחצים. בזמן השינה אף אחד לא מסתכל על הכפתור.', 'An ordinary `sleep` does not wake on a press. While it sleeps nobody looks at the button.'))]
    },
    /* ------------------------------------------------------------ T4 */
    {
      id: 'T4', track: 'T',
      title: B('6400 אחוז', '6400 percent'),
      goal: B('התוכנית אמורה להציג את מיקום כפתור הסיבוב באחוזים, אבל היא מציגה מספרים בלתי אפשריים. גלו למה.', 'The program should show the knob\'s position in percent, and shows impossible numbers. Find out why.'),
      learn: [B('ש-`read_u16` מחזיר ערך בין 0 ל-65535.', 'That `read_u16` returns 0 to 65535.'), B('איך ממירים קריאה לאחוזים ולמתח.', 'To turn a reading into percent and volts.')],
      before: [{ href: '#/lessons/B1', label: B('שיעור B1, כפתור סיבוב', 'Lesson B1, a knob'), why: B('בונים את אותו מעגל.', 'Build the same circuit.') }, { href: '#/interfaces/adc', label: B('העמוד על ADC', 'The ADC page'), why: B('יש בו הסבר על הטווח 0 עד 65535.', 'It explains the range 0 to 65535.') }],
      parts: [{ id: 'pot', qty: 1 }],
      steps: [build('B1'), PLUG, RUN, B('סובבו את הכפתור מקצה לקצה, והסתכלו על המספרים.', 'Turn the knob from end to end, and watch the numbers.')],
      code: ['from machine import ADC', 'from time import sleep', '', 'pot = ADC(26)', '', 'while True:', '    percent = pot.read_u16() / 1023 * 100', '    print(round(percent), "%")', '    sleep(0.2)'],
      expectTitle: SEE,
      expect: B('בקצה אחד מופיע 0%, ובקצה השני מספר באלפים, בסביבות 6400%. המספר 100% לא מופיע בשום מקום.', 'At one end 0% appears, and at the other a number in the thousands, around 6400%. Nowhere does 100% appear.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('הדפיסו את `pot.read_u16()` לבד, בלי חישוב. מה המספר הגדול ביותר שמופיע? ובמה מחלקים בשורה 7?', 'Print `pot.read_u16()` on its own, with no maths. What is the largest number that appears? And what does line 7 divide by?'),
        B('`read_u16` מחזיר ערכים עד 65535, ולא עד 1023 (כמו ב-Arduino). 65535 חלקי 1023 הם בערך 64, כלומר 6400%. צריך לחלק ב-65535.', '`read_u16` returns up to 65535, not 1023 (as on Arduino). 65535 divided by 1023 is about 64, so 6400%. Divide by 65535.'),
        ['from machine import ADC', 'from time import sleep', '', 'pot = ADC(26)', '', 'while True:', '    percent = pot.read_u16() / 65535 * 100', '    print(round(percent), "%")', '    sleep(0.2)']),
      quiz: [Q(B('`read_u16()` החזיר 32768. מה המתח בפין, בערך?', '`read_u16()` returned 32768. What is the voltage on the pin, roughly?'), [B('32 וולט', '32 volts'), B('1.65 וולט', '1.65 volts'), B('3.3 וולט', '3.3 volts')], 1, B('32768 הוא חצי מ-65535, וחצי מ-3.3V הוא 1.65V.', '32768 is half of 65535, and half of 3.3 V is 1.65 V.'))]
    },
    /* ------------------------------------------------------------ T5 */
    {
      id: 'T5', track: 'T',
      title: B('העמעם שכמעט לא מאיר', 'The dimmer that barely glows'),
      goal: B('הלד אמור להגיע לבהירות מלאה, אבל הוא בקושי נדלק. גלו למה.', 'The LED should reach full brightness, and barely lights. Find out why.'),
      learn: [B('ש-`duty_u16` מקבל ערך בין 0 ל-65535.', 'That `duty_u16` takes 0 to 65535.'), B('איך ממירים ערך מטווח אחד לטווח אחר.', 'To convert a value from one range to another.')],
      before: [{ href: '#/lessons/B2', label: B('שיעור B2, עמעם', 'Lesson B2, a dimmer'), why: B('בונים את אותו מעגל.', 'Build the same circuit.') }, { href: '#/interfaces/pwm', label: B('העמוד על PWM', 'The PWM page'), why: B('יש בו מחוון שמראה מה כל ערך עושה.', 'It has a slider showing what each value does.') }],
      parts: [{ id: 'pot', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      steps: [build('B2'), PLUG, RUN, LOOK],
      code: ['from machine import Pin, PWM', 'from time import sleep', '', 'led = PWM(Pin(15), freq=1000)', '', 'while True:', '    for level in range(256):       # 0 to 255, dark to bright', '        led.duty_u16(level)', '        sleep(0.01)'],
      expectTitle: SEE,
      expect: B('הלד נשאר כמעט חשוך כל הזמן. בחדר חשוך אולי תראו זוהר חלש מאוד.', 'The LED stays almost dark all the time. In a dark room you may see a very faint glow.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('מה הערך הגדול ביותר ש-`level` מגיע אליו, ומה הערך הגדול ביותר ש-`duty_u16` מקבל?', 'What is the largest value `level` reaches, and what is the largest value `duty_u16` takes?'),
        B('הלולאה מגיעה רק ל-255, ו-255 מתוך 65535 הם פחות מחצי אחוז. כפלו ב-257 כדי למתוח את 0-255 על כל הטווח.', 'The loop only reaches 255, and 255 out of 65535 is under half a percent. Multiply by 257 to stretch 0-255 over the whole range.'),
        ['from machine import Pin, PWM', 'from time import sleep', '', 'led = PWM(Pin(15), freq=1000)', '', 'while True:', '    for level in range(256):', '        led.duty_u16(level * 257)   # 255 * 257 = 65535', '        sleep(0.01)']),
      quiz: [Q(B('איזה ערך יגרום ללד לדלוק בערך רבע מהזמן?', 'Which value gives an LED that is on about a quarter of the time?'), [B('`duty_u16(25)`', '`duty_u16(25)`'), B('`duty_u16(16384)`', '`duty_u16(16384)`'), B('`duty_u16(64)`', '`duty_u16(64)`')], 1, B('רבע מ-65535 הוא בערך 16384.', 'A quarter of 65535 is about 16384.'))]
    },
    /* ------------------------------------------------------------ T6 */
    {
      id: 'T6', track: 'T',
      title: B('המסך שלא נמצא', 'The display that is not found'),
      goal: B('התוכנית נעצרת עם `OSError` עוד לפני שהמסך מציג משהו. גלו למה.', 'The program stops with an `OSError` before the display shows anything. Find out why.'),
      learn: [B('איך משתמשים ב-`i2c.scan()` כדי לבדוק חיבור.', 'To use `i2c.scan()` to test a connection.'), B('שהפינים בקוד חייבים להיות בדיוק אותם פינים שבחיווט.', 'That the pins in the code must be exactly the pins in the wiring.')],
      before: [{ href: '#/lessons/C3', label: B('שיעור C3, המסך הראשון', 'Lesson C3, the first display'), why: B('בונים את אותו מעגל, כשהספרייה מותקנת.', 'Build the same circuit, with the library installed.') }, SHEET],
      parts: [{ id: 'oled', qty: 1 }],
      steps: [build('C3'), PLUG, RUN, LOOK],
      code: ['from machine import Pin, I2C', 'from ssd1306 import SSD1306_I2C', '', 'i2c = I2C(0, sda=Pin(8), scl=Pin(9))     # copied from another project', 'print([hex(a) for a in i2c.scan()])', 'oled = SSD1306_I2C(128, 64, i2c)', 'oled.text("Hello", 0, 0)', 'oled.show()'],
      expectTitle: SEE,
      expect: B('מודפס `[]` (רשימה ריקה), ואחריו שגיאת `OSError`, בדרך כלל `EIO` או `ETIMEDOUT`. המסך נשאר שחור.', '`[]` (an empty list) is printed, then an `OSError`: usually `EIO` or `ETIMEDOUT`. The display stays black.'),
      tasksTitle: FIX, tasksHint: FIXHINT,
      tasks: tasks(B('הסריקה לא מצאה כלום, כלומר הלוח לא שומע את המסך. השוו את שורה 4 לטבלת החיווט של C3: לאילו פינים מחוברים ה-SDA וה-SCL של המסך?', 'The scan found nothing, so the board does not hear the display. Compare line 4 with C3\'s wiring table: which pins are the display\'s SDA and SCL on?'),
        B('המסך מחובר ל-GP4 (SDA) ול-GP5 (SCL), אבל הקוד מדבר דרך GP8 ו-GP9, שאין עליהם כלום. גם הם פינים חוקיים של I2C(0), ולכן אין שגיאה על הפינים: פשוט אף רכיב לא עונה. (אם במקום זה מחליפים בקוד בין 4 ל-5, MicroPython נעצר מיד עם `ValueError: bad SCL pin`.) עץ השאלות של I2C עובר על הבדיקה הזו.', 'The display is on GP4 (SDA) and GP5 (SCL), but the code talks on GP8 and GP9, which have nothing on them. Those are valid I2C(0) pins too, so there is no pin error: simply no part answers. (Swapping 4 and 5 in the code instead makes MicroPython stop at once with `ValueError: bad SCL pin`.) The I2C question tree walks through this check.'),
        ['from machine import Pin, I2C', 'from ssd1306 import SSD1306_I2C', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'print([hex(a) for a in i2c.scan()])   # expect 0x3c', 'oled = SSD1306_I2C(128, 64, i2c)', 'oled.text("Hello", 0, 0)', 'oled.show()']),
      quiz: [Q(B('`i2c.scan()` החזיר `[\'0x3c\']`. מה זה אומר?', '`i2c.scan()` returned `[\'0x3c\']`. What does that mean?'), [B('יש תקלה בחיווט', 'The wiring is faulty'), B('רכיב אחד עונה בכתובת 0x3c, ולכן החיבור תקין', 'One part answers at address 0x3c: the wiring is fine'), B('צריך להחליף את המסך', 'The display must be replaced')], 1, B('רכיב שמופיע בסריקה מחובר נכון. מה שנשאר לבדוק הוא הקוד והכתובת.', 'A part that shows up in the scan is wired right. What is left to check is the code and the address.'))]
    }
  ];

  var at = 0;
  P.lessons.forEach(function (l, i) { if (l.track === 'D') at = i + 1; });
  P.lessons.splice.apply(P.lessons, [at, 0].concat(labs));
})(window.PICO);
