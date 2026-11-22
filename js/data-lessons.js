/* Lesson tracks, part 1 of 2: track A (digital) and track B (analog and PWM).
   Tracks C and D are in data-lessons-2.js.

   A lesson: id, track, title, goal, learn[], before[], parts[], wiring[],
   steps[] (a checklist), code[], explain[], expect, tasks[] (challenges with
   a hint and sometimes a solution), quiz[]. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var E = function (lines, he, en) { return { l: lines, t: B(he, en) }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };
  /* wiring row: what is connected, Pico pin name, physical pin number, note, short tag for the board drawing */
  var W = function (who, to, num, note, tag) { return { who: who, to: to, num: num, note: note, tag: tag }; };

  var UNPLUG = B('נתקו את כבל ה-USB. חברו חוטים רק כשהחשמל מנותק.', 'Unplug the USB cable. Wire only with the power off.');
  var PLUG = B('השוו כל חיבור לטבלה, ורק אז חברו את כבל ה-USB.', 'Go over every connection against the table, and only then plug in the USB.');
  var RUN = B('הריצו את הקוד שלמטה: ב-Thonny בעזרת הכפתור הירוק, או כאן בעזרת הכפתור "הריצו על הלוח".', 'Run the code below: in Thonny with the green button, or here with "Run on board".');
  var READ = B('קראו את ההסבר שמתחת לקוד, שורה אחר שורה, עד שכל שורה תהיה ברורה לכם.', 'Read the line-by-line explanation under the code until every line is clear.');
  var RES = B('דרך נגד 330Ω', 'through a 330 Ω resistor');

  P._l = { B: B, E: E, Q: Q, W: W, UNPLUG: UNPLUG, PLUG: PLUG, RUN: RUN, READ: READ, RES: RES };

  P.tracks = [
    { id: 'A', color: '--c-gpio', title: B('צעדים ראשונים: דולק וכבוי', 'First steps: on and off'), desc: B('לדים וכפתורים. למדו לשלוט בפין ולקרוא ממנו.', 'LEDs and buttons. Learn to control a pin and to read one.') },
    { id: 'B', color: '--c-pwm', title: B('לא רק דולק וכבוי', 'More than on and off'), desc: B('כפתור סיבוב, חיישן אור, עמעום, צליל ותנועה.', 'A knob, a light sensor, dimming, sound and movement.') },
    { id: 'C', color: '--c-i2c', title: B('חיישנים ומסך', 'Sensors and a display'), desc: B('מדדו מרחק, תנועה וטמפרטורה, והציגו אותם על מסך.', 'Measure distance, motion and temperature, and show them on a display.') },
    { id: 'D', color: '--accent', title: B('הפרויקט שלכם', 'Your own project'), desc: B('איך מתכננים ובונים פרויקט מההתחלה ועד הסוף.', 'How to plan and build a project from start to finish.') }
  ];

  P.lessons = [
    /* ============================================================ A1 */
    {
      id: 'A1', track: 'A',
      title: B('הלד הראשון', 'The first LED'),
      goal: B('חברו [[led|לד]] אחד ל-Pico, וגרמו לו להבהב.', 'Connect one [[led|LED]] to the Pico and make it blink.'),
      learn: [
        B('איך בונים [[circuit|מעגל]] פשוט על ה[[breadboard|מטריצה]].', 'To build a simple [[circuit|circuit]] on the [[breadboard|breadboard]].'),
        B('איך מגדירים פין כיציאה, ואיך מדליקים ומכבים אותו מהקוד.', 'To set a pin as an output, and switch it on and off from code.'),
        B('איך משנים תוכנית קיימת ורואים מה קורה.', 'To change an existing program and see what happens.')
      ],
      before: [
        { href: '#/basics/first-circuit', label: B('הפרק "המעגל הראשון שלכם" ביסודות', 'The Basics chapter "Your first circuit"'), why: B('יש בו איור מלא של המעגל הזה.', 'It has a full drawing of this circuit.') },
        { href: '#/start', label: B('העמוד "מתחילים"', 'The "Get started" page'), why: B('על הלוח צריכה לרוץ MicroPython.', 'The board must be running MicroPython.') }
      ],
      parts: [{ id: 'led', qty: 1 }, { text: B('[[resistor|נגד]] 330Ω', 'A 330 Ω [[resistor|resistor]]') }, { text: B('[[jumper|חוט גישור]] אחד', 'One [[jumper|jumper wire]]') }],
      wiring: [
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('לד, רגל קצרה', 'LED, short leg'), 'GND', 18, null, 'GND')
      ],
      steps: [
        UNPLUG,
        B('הכניסו רגל אחת של הנגד לטור של פין 20 (`GP15`), ואת הרגל השנייה לטור פנוי.', 'Push one leg of the resistor into the column of pin 20 (`GP15`), and the other into a free column.'),
        B('הכניסו את הרגל הארוכה של הלד לטור שבו נמצאת הרגל השנייה של הנגד, ואת הרגל הקצרה לטור שלידו.', 'Push the LED\'s long leg into the column where the resistor ends, and the short leg into the next column.'),
        B('חברו חוט גישור מהטור של הרגל הקצרה אל פין 18 (`GND`).', 'Connect a jumper wire from the short leg\'s column to pin 18 (`GND`).'),
        PLUG, RUN, READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        '',
        'while True:',
        '    led.on()',
        '    sleep(0.5)',
        '    led.off()',
        '    sleep(0.5)'
      ],
      explain: [
        E([1, 2], 'השורות האלה טוענות את `Pin`, ששולט בפינים, ואת `sleep`, שממתין.', 'Brings in the `Pin` tool and the `sleep` command.'),
        E([4], 'השורה מגדירה את GP15 כיציאה ונותנת לו את השם `led`.', 'Sets GP15 as an output and names it `led`.'),
        E([6], 'מכאן מתחילה לולאה שחוזרת על עצמה בלי סוף.', 'From here on, forever.'),
        E([7, 8], 'השורות מדליקות את הלד וממתינות חצי שנייה.', 'Switches the LED on and waits half a second.'),
        E([9, 10], 'השורות מכבות את הלד וממתינות חצי שנייה. אחר כך הלולאה חוזרת לשורה 7.', 'Switches the LED off and waits half a second. Then the loop goes back to line 7.')
      ],
      expect: B('הלד מהבהב: חצי שנייה דולק וחצי שנייה כבוי.', 'The LED blinks: half a second on, half a second off.'),
      tasks: [
        { t: B('גרמו ללד להבהב מהר פי חמישה.', 'Make the LED blink five times faster.'), hint: B('שני המספרים שבתוך `sleep` קובעים את הקצב. ככל שהמספר קטן יותר, ההמתנה קצרה יותר.', 'The two numbers inside `sleep` set the pace. A smaller number is a shorter wait.') },
        { t: B('גרמו ללד להבזיק הבזק קצר: דולק עשירית שנייה, וכבוי שנייה שלמה.', 'Make the LED give a short flash: on for a tenth of a second, off for a whole second.'), hint: B('שתי ההמתנות לא חייבות להיות שוות.', 'The two waits do not have to be equal.') },
        {
          t: B('שדרו SOS: שלושה הבזקים קצרים, שלושה ארוכים, שלושה קצרים, ואחר כך הפסקה.', 'Signal SOS: three short flashes, three long, three short, then a pause.'),
          hint: B('כדי לחזור על פעולה שלוש פעמים, משתמשים ב-`for i in range(3):`. כדאי לכתוב [[func|פונקציה]] שמקבלת את אורך ההבזק.', 'To repeat something three times use `for i in range(3):`. It is worth writing a [[func|function]] that takes the length of the flash.'),
          code: [
            'from machine import Pin',
            'from time import sleep',
            '',
            'led = Pin(15, Pin.OUT)',
            '',
            'def flash(seconds):',
            '    led.on()',
            '    sleep(seconds)',
            '    led.off()',
            '    sleep(0.2)',
            '',
            'while True:',
            '    for i in range(3):',
            '        flash(0.2)',
            '    for i in range(3):',
            '        flash(0.6)',
            '    for i in range(3):',
            '        flash(0.2)',
            '    sleep(2)'
          ]
        }
      ],
      quiz: [
        Q(B('מה יקרה אם תמחקו את שורה 10?', 'What happens if you delete line 10?'),
          [B('הלד יישאר דולק כל הזמן', 'The LED stays on all the time'), B('הלד ייראה דולק כמעט כל הזמן, כי הוא נכבה רק לרגע קצרצר', 'The LED looks on almost all the time, because it goes off only for an instant'), B('תופיע שגיאה', 'An error appears')], 1,
          B('בלי ההמתנה שאחרי הכיבוי, הלולאה חוזרת מיד ומדליקה את הלד שוב. הכיבוי קצר מדי כדי שהעין תבחין בו.', 'Without the wait after switching off, the loop returns at once and switches it on again. The off moment is too short for the eye.'))
      ]
    },

    /* ============================================================ A2 */
    {
      id: 'A2', track: 'A',
      title: B('רמזור', 'A traffic light'),
      goal: B('שלושה לדים שנדלקים בזה אחר זה, כמו ברמזור.', 'Three LEDs that light in turn, like a traffic light.'),
      learn: [
        B('איך שולטים בכמה פינים באותה תוכנית.', 'To control several pins in the same program.'),
        B('איך משתמשים בפס האדמה של המטריצה.', 'To use the breadboard\'s ground rail.'),
        B('איך בונים רצף של פעולות לפי תזמון.', 'To build a timed sequence of actions.')
      ],
      before: [{ href: '#/lessons/A1', label: B('שיעור A1', 'Lesson A1') }, { href: '#/basics/breadboard', label: B('הפרק "המטריצה"', 'The chapter "The breadboard"'), why: B('כדי להכיר את פסי המתח.', 'For the power rails.') }],
      parts: [{ id: 'led', qty: 3, note: B('אדום, צהוב וירוק', 'red, yellow and green') }, { text: B('שלושה נגדים של 330Ω', 'Three 330 Ω resistors') }, { text: B('ארבעה חוטי גישור', 'Four jumper wires') }],
      wiring: [
        W(B('לד אדום, רגל ארוכה', 'Red LED, long leg'), 'GP15', 20, RES, B('אדום', 'Red')),
        W(B('לד צהוב, רגל ארוכה', 'Yellow LED, long leg'), 'GP14', 19, RES, B('צהוב', 'Yellow')),
        W(B('לד ירוק, רגל ארוכה', 'Green LED, long leg'), 'GP13', 17, RES, B('ירוק', 'Green')),
        W(B('שלוש הרגליים הקצרות', 'The three short legs'), 'GND', 18, B('דרך פס האדמה של המטריצה', 'through the breadboard\'s ground rail'), 'GND')
      ],
      steps: [
        UNPLUG,
        B('חברו חוט גישור מפין 18 (`GND`) אל פס האדמה של המטריצה, כלומר הפס שלאורך הקו הכחול. מעכשיו כל חור בפס הזה מחובר לאדמה.', 'Connect a jumper wire from pin 18 (`GND`) to the breadboard\'s ground rail, the rail along the blue line. Now every hole in that rail is ground.'),
        B('הפעם הלדים נמצאים מימין ל-Pico, כי שם יש מקום. לד אדום: חוט גישור מפין 20 (`GP15`) אל טור פנוי, נגד מאותו טור אל טור נוסף, ובטור הזה הרגל הארוכה של הלד. האיור שלמעלה מראה את החורים המדויקים.', 'This time the LEDs sit to the right of the Pico, where there is room. Red LED: a jumper wire from pin 20 (`GP15`) to a free column, a resistor from that column to another column, and the LED\'s long leg there. The drawing above shows the exact holes.'),
        B('חברו בחוט גישור את הרגל הקצרה של הלד האדום אל פס האדמה.', 'Connect the red LED\'s short leg with a jumper wire to the ground rail.'),
        B('בנו באותו אופן את הלד הצהוב מפין 19 (`GP14`) ואת הלד הירוק מפין 17 (`GP13`). לכל לד יש נגד משלו.', 'Build the yellow LED the same way from pin 19 (`GP14`) and the green one from pin 17 (`GP13`). Each LED gets a resistor of its own.'),
        PLUG, RUN, READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'red = Pin(15, Pin.OUT)',
        'yellow = Pin(14, Pin.OUT)',
        'green = Pin(13, Pin.OUT)',
        '',
        'while True:',
        '    red.on()',
        '    sleep(3)',
        '    red.off()',
        '',
        '    green.on()',
        '    sleep(3)',
        '    green.off()',
        '',
        '    yellow.on()',
        '    sleep(1)',
        '    yellow.off()'
      ],
      explain: [
        E([4, 6], 'אלה שלושה [[variable|משתנים]], אחד לכל לד. שם טוב למשתנה מסביר מה הוא מייצג: `red` ברור יותר מ-`led1`.', 'Three [[variable|variables]], one per LED. A good variable name says what it is: `red` is clearer than `led1`.'),
        E([9, 11], 'הלד האדום נדלק, נשאר דולק שלוש שניות, ונכבה.', 'Red comes on, stays for three seconds, and goes off.'),
        E([13, 15], 'אותו דבר קורה עם הלד הירוק.', 'The same for green.'),
        E([17, 19], 'הלד הצהוב נדלק לשנייה אחת בלבד. אחר כך הלולאה חוזרת לאדום.', 'Yellow comes on for just one second. Then the loop returns to red.')
      ],
      expect: B('אדום לשלוש שניות, ירוק לשלוש שניות, צהוב לשנייה אחת, וחוזר חלילה. בכל רגע דולק רק לד אחד.', 'Red for three seconds, green for three seconds, yellow for one second, and round again. Only one LED is lit at any moment.'),
      tasks: [
        { t: B('ברמזור אמיתי, האדום והצהוב נדלקים יחד לשנייה לפני הירוק. הוסיפו את השלב הזה.', 'On a real traffic light, red and yellow light together for a second before green. Add that stage.'), hint: B('אפשר להדליק שני לדים בזה אחר זה בלי `sleep` ביניהם, והם יידלקו כמעט באותו רגע.', 'You can switch two LEDs on one after the other with no `sleep` between them. They light at almost the same moment.') },
        { t: B('גרמו לירוק להבהב שלוש פעמים לפני שהוא מתחלף לצהוב.', 'Make green blink three times before it changes to yellow.'), hint: B('`for i in range(3):`, ובתוכו כיבוי, המתנה קצרה, הדלקה והמתנה קצרה.', '`for i in range(3):` and inside it off, a short wait, on, and a short wait.') },
        {
          t: B('שלושת החלקים שבלולאה כמעט זהים. כתבו פונקציה אחת שתחליף את שלושתם.', 'The three parts of the loop are almost identical. Write one function that replaces all three.'),
          hint: B('הפונקציה מקבלת שני דברים: איזה לד להדליק, ולכמה שניות.', 'The function receives two things: which LED, and how many seconds.'),
          code: [
            'from machine import Pin',
            'from time import sleep',
            '',
            'red = Pin(15, Pin.OUT)',
            'yellow = Pin(14, Pin.OUT)',
            'green = Pin(13, Pin.OUT)',
            '',
            'def show(led, seconds):',
            '    led.on()',
            '    sleep(seconds)',
            '    led.off()',
            '',
            'while True:',
            '    show(red, 3)',
            '    show(green, 3)',
            '    show(yellow, 1)'
          ]
        }
      ],
      quiz: [
        Q(B('למה לכל לד יש נגד משלו, ולא נגד אחד לשלושתם?', 'Why does each LED have its own resistor, and not one resistor for all three?'),
          [B('כי כך זה נראה מסודר יותר', 'Because it looks tidier'), B('כי כל לד הוא מעגל נפרד, שמוזן מפין משלו', 'Because each LED is a separate circuit, from its own pin'), B('כי נגדים זולים', 'Because resistors are cheap')], 1,
          B('כל פין מזין לד אחר, והזרם של כל לד צריך הגבלה משלו.', 'Each pin feeds a different LED, and each one\'s current needs its own limit.'))
      ]
    },

    /* ============================================================ A3 */
    {
      id: 'A3', track: 'A',
      title: B('כפתור שמדליק לד', 'A button that lights an LED'),
      goal: B('הלד דולק רק כל עוד הכפתור לחוץ. זו הפעם הראשונה שהתוכנית מגיבה למשהו.', 'The LED is lit only while the button is pressed. For the first time the program reacts to something.'),
      learn: [
        B('איך מגדירים פין ככניסה ואיך קוראים אותו.', 'To set a pin as an input and read it.'),
        B('איך משתמשים ב[[cond|תנאי]] `if` ו-`else`.', 'To use an `if` and `else` [[cond|condition]].'),
        B('למה כפתור לחוץ נקרא כ-0.', 'Why a pressed button reads as 0.')
      ],
      before: [{ href: '#/lessons/A2', label: B('שיעור A2', 'Lesson A2') }, { href: '#/interfaces/gpio', label: B('העמוד על GPIO', 'The GPIO page'), why: B('יש בו הדמיה של כפתור עם נגד משיכה.', 'It has a demo of a button with a pull-up.') }],
      parts: [{ id: 'led', qty: 1 }, { id: 'button', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }, { text: B('שלושה חוטי גישור', 'Three jumper wires') }],
      wiring: [
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('לד, רגל קצרה + כפתור, הרגל שבאלכסון', 'LED short leg + button\'s diagonal leg'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [
        UNPLUG,
        B('פרקו את הרמזור. השאירו את הלד האדום על `GP15` ואת החוט שמחבר את פין 18 לפס האדמה.', 'Take the traffic light apart. Keep the red LED on `GP15` and the wire from pin 18 to the ground rail.'),
        B('הכניסו את הכפתור כך שיגשר מעל התעלה שבאמצע המטריצה.', 'Push the button in across the channel in the middle of the breadboard.'),
        B('חברו חוט מרגל אחת של הכפתור אל פין 19 (`GP14`).', 'Connect a wire from one leg of the button to pin 19 (`GP14`).'),
        B('חברו חוט מהרגל שנמצאת באלכסון אליה אל פס האדמה.', 'Connect a wire from the leg diagonal to it to the ground rail.'),
        PLUG, RUN, READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'while True:',
        '    if button.value() == 0:',
        '        led.on()',
        '    else:',
        '        led.off()',
        '    sleep(0.01)'
      ],
      explain: [
        E([5], 'הכפתור מוגדר ככניסה (`Pin.IN`). `Pin.PULL_UP` מפעיל [[pullup|נגד משיכה]] פנימי, שמחזיק את הפין ב-1 כל עוד הכפתור לא לחוץ.', 'The button is an input (`Pin.IN`). `Pin.PULL_UP` enables an internal [[pullup|pull-up resistor]], which holds the pin at 1 while it is not pressed.'),
        E([8], 'השורה קוראת את הכפתור. לחיצה מחברת את הפין לאדמה, ולכן כפתור לחוץ נקרא כ-0. `==` בודק שוויון.', 'Reads the button. Pressing connects the pin to ground, so pressed is 0. `==` tests equality.'),
        E([9], 'השורה הזו רצה רק כשהתנאי מתקיים, כלומר כשהכפתור לחוץ.', 'Runs only when the condition is true, i.e. while pressed.'),
        E([10, 11], 'השורות האלה רצות בכל מקרה אחר, כלומר כשהכפתור לא לחוץ.', 'Runs in every other case, i.e. while not pressed.'),
        E([12], 'המתנה קצרצרה של מאית שנייה. הלולאה בודקת את הכפתור מאה פעמים בשנייה, ולכן התגובה מרגישה מיידית.', 'A tiny wait, a hundredth of a second. The loop checks the button a hundred times a second, which feels instant.')
      ],
      expect: B('הלד כבוי. כשלוחצים על הכפתור הוא נדלק, וכשמשחררים הוא נכבה.', 'The LED is off. Press the button and it lights. Release and it goes off.'),
      tasks: [
        { t: B('הפכו את ההתנהגות: הלד דולק כל הזמן, ונכבה רק כשהכפתור לחוץ.', 'Reverse the behaviour: the LED is always on and goes off only while pressed.'), hint: B('מספיק להחליף בין שתי שורות.', 'Swapping two lines is enough.') },
        { t: B('קצרו את כל ה-`if` וה-`else` לשורה אחת.', 'Shorten the whole `if` and `else` to a single line.'), hint: B('`led.value(...)` מקבל 0 או 1. `not button.value()` הופך 0 ל-1 ו-1 ל-0.', '`led.value(...)` takes 0 or 1. `not button.value()` turns 0 into 1 and 1 into 0.'), code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', '', 'while True:', '    led.value(not button.value())', '    sleep(0.01)'] },
        { t: B('גרמו ללד להבהב מהר כל עוד הכפתור לחוץ, ולהישאר כבוי כשהוא משוחרר.', 'Make the LED blink fast while the button is held, and stay off when released.'), hint: B('בתוך ה-`if` כתבו הדלקה, המתנה, כיבוי והמתנה.', 'Inside the `if` put on, wait, off and wait.') }
      ],
      quiz: [
        Q(B('מחקתם את `Pin.PULL_UP` משורה 5. מה יקרה?', 'You deleted `Pin.PULL_UP` from line 5. What happens?'),
          [B('שום דבר לא ישתנה', 'Nothing changes'), B('הלד יהבהב באקראי כשהכפתור לא לחוץ', 'The LED flickers randomly when not pressed'), B('הכפתור יישרף', 'The button burns out')], 1,
          B('בלי נגד משיכה, הפין "צף" כשהכפתור משוחרר, וקורא 0 או 1 באקראי.', 'Without a pull-up the pin "floats" when the button is released, reading 0 or 1 at random.'))
      ]
    },

    /* ============================================================ A4 */
    {
      id: 'A4', track: 'A',
      title: B('לחיצה שמחליפה מצב', 'A press that flips a state'),
      goal: B('כל לחיצה מדליקה או מכבה את הלד, כמו מתג של מנורה, והתוכנית סופרת את הלחיצות.', 'Each press switches the LED on or off, like a lamp switch, and the program counts the presses.'),
      learn: [
        B('איך מזהים את רגע הלחיצה, ולא רק את המצב "לחוץ".', 'To detect the moment of a press, rather than the state "pressed".'),
        B('איך שומרים מידע במשתנה מסיבוב אחד של הלולאה לסיבוב הבא.', 'To keep information in a variable from one round of the loop to the next.'),
        B('איך מדפיסים ערכים כדי לראות מה התוכנית עושה.', 'To print values so you can see what the program is doing.')
      ],
      before: [{ href: '#/lessons/A3', label: B('שיעור A3', 'Lesson A3'), why: B('בדיוק אותו מעגל, כך שאין צורך לחווט שום דבר.', 'Exactly the same circuit. Nothing to wire.') }],
      parts: [{ id: 'led', qty: 1 }, { id: 'button', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      wiring: [
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('לד, רגל קצרה + כפתור, הרגל שבאלכסון', 'LED short leg + button\'s diagonal leg'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [
        B('המעגל הוא אותו מעגל משיעור A3. ודאו שהוא עדיין מחובר.', 'The circuit is the same one from lesson A3. Make sure it is still connected.'),
        RUN,
        B('לחצו כמה פעמים, וצפו גם בלד וגם במסוף.', 'Press a few times and watch both the LED and the console.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'count = 0',
        'was_pressed = False',
        '',
        'while True:',
        '    pressed = button.value() == 0',
        '    if pressed and not was_pressed:',
        '        count = count + 1',
        '        led.toggle()',
        '        print("presses:", count)',
        '    was_pressed = pressed',
        '    sleep(0.02)'
      ],
      explain: [
        E([7], 'זה מונה הלחיצות, והוא מתחיל מאפס.', 'The press counter. Starts from zero.'),
        E([8], 'משתנה שזוכר אם הכפתור היה לחוץ בסיבוב הקודם של הלולאה. `False` פירושו "לא".', 'A variable that remembers whether the button was pressed on the previous round of the loop. `False` means "no".'),
        E([11], 'השורה בודקת אם הכפתור לחוץ עכשיו. התוצאה היא `True` או `False`, והיא נשמרת במשתנה `pressed`.', 'Checks whether the button is pressed now. The result is `True` or `False`, stored in the variable `pressed`.'),
        E([12], 'זה התנאי החשוב: הכפתור לחוץ עכשיו, אבל לא היה לחוץ קודם. התנאי מתקיים רק ברגע אחד, רגע הלחיצה עצמו.', 'The important condition: pressed now, but not pressed before. That is true at only one moment, the instant of the press.'),
        E([13, 15], 'השורות מוסיפות אחד למונה, הופכות את מצב הלד ומדפיסות.', 'Adds one to the counter, flips the LED, and prints.'),
        E([16], 'השורה זוכרת את המצב הנוכחי לקראת הסיבוב הבא.', 'Remembers the current state ready for the next round.'),
        E([17], 'המתנה של שתי מאיות שנייה. היא גם מונעת ספירה כפולה, כי המגעים שבתוך הכפתור רועדים לרגע בזמן הלחיצה.', 'A wait of two hundredths of a second. It also prevents double counting: the contacts inside the button bounce for a moment as it is pressed.')
      ],
      expect: B('כל לחיצה הופכת את מצב הלד: נדלק, נכבה, נדלק. במסוף מודפס `presses: 1`, `presses: 2` וכן הלאה. החזקה ארוכה של הכפתור נספרת כלחיצה אחת.', 'Each press flips the LED: on, off, on. The console prints `presses: 1`, `presses: 2` and so on. Holding the button for a long time counts as one press.'),
      tasks: [
        { t: B('מחקו את שורה 16 והריצו. מה קורה, ולמה?', 'Delete line 16 and run. What happens, and why?'), hint: B('בלי השורה הזו, `was_pressed` נשאר `False` לתמיד, ולכן התנאי מתקיים בכל סיבוב שבו הכפתור לחוץ.', 'Without that line `was_pressed` stays `False` for ever, so the condition is true on every round in which the button is pressed.') },
        { t: B('הדפיסו הודעה מיוחדת בכל לחיצה חמישית.', 'Print a special message on every fifth press.'), hint: B('`count % 5` נותן את השארית של החלוקה ב-5. כשהשארית היא 0, המספר מתחלק ב-5.', '`count % 5` gives the remainder after dividing by 5. When it is 0, the number divides by 5.') },
        { t: B('הוסיפו לד שני. הלחיצה הראשונה מדליקה את הלד הראשון, השנייה מדליקה את הלד השני, והשלישית מכבה את שניהם.', 'Add a second LED. One press lights the first, the second lights the other, the third switches both off.'), hint: B('השתמשו ב-`count % 3`, שנותן 0, 1 או 2, יחד עם `if`, `elif`, `else`.', 'Use `count % 3`, which gives 0, 1 or 2, with `if`, `elif`, `else`.') }
      ],
      quiz: [
        Q(B('למה לא מספיק לכתוב `if pressed:` בשורה 12?', 'Why is it not enough to write `if pressed:` on line 12?'),
          [B('כי אז לחיצה אחת תיספר עשרות פעמים', 'Because then one press would be counted dozens of times'), B('כי זו שגיאת תחביר', 'Because it is a syntax error'), B('כי הלד יישרף', 'Because the LED would burn out')], 0,
          B('הלולאה רצה 50 פעמים בשנייה, ולכן לחיצה של חצי שנייה תיספר 25 פעמים.', 'The loop runs 50 times a second. A half-second press would be counted 25 times.'))
      ]
    },

    /* ============================================================ B1 */
    {
      id: 'B1', track: 'B',
      title: B('כפתור סיבוב', 'A knob'),
      goal: B('קראו פוטנציומטר, וצפו במספר שמשתנה כשמסובבים אותו.', 'Read a potentiometer and watch a number change as you turn it.'),
      learn: [
        B('מה ההבדל בין קלט של "כן או לא" לבין קלט של "כמה".', 'The difference between "yes or no" input and "how much" input.'),
        B('איך קוראים פין [[adc|ADC]], ומה פירוש הטווח 0 עד 65535.', 'To read an [[adc|ADC]] pin and understand the range 0 to 65535.'),
        B('איך ממירים מספר גולמי לאחוזים.', 'To turn a raw number into a percentage.')
      ],
      before: [{ href: '#/basics/digital-analog', label: B('הפרק "דיגיטלי ואנלוגי"', 'The chapter "Digital and analog"') }, { href: '#/interfaces/adc', label: B('העמוד על ADC', 'The ADC page') }],
      parts: [{ id: 'pot', qty: 1 }, { text: B('שלושה חוטי גישור', 'Three jumper wires') }],
      wiring: [
        W(B('פוטנציומטר, רגל קיצונית', 'Potentiometer, outer leg'), '3V3', 36, null, '3.3V'),
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, null, B('אמצע', 'Middle')),
        W(B('פוטנציומטר, רגל קיצונית שנייה', 'Potentiometer, other outer leg'), 'AGND', 33, null, 'AGND')
      ],
      steps: [
        UNPLUG,
        B('אפשר לפרק את הכפתור. השאירו את הלד, כי הוא יחזור בשיעור הבא.', 'You can remove the button. Keep the LED, it comes back in the next lesson.'),
        B('הכניסו את הפוטנציומטר כך שכל אחת משלוש הרגליים שלו תהיה בטור אחר.', 'Push in the potentiometer with its three legs in three different columns.'),
        B('חברו רגל קיצונית אחת לפין 36 (`3V3(OUT)`), את הרגל האמצעית לפין 31 (`GP26`), ואת הרגל הקיצונית השנייה לפין 33 (`AGND`).', 'Connect one outer leg to pin 36 (`3V3(OUT)`), the middle one to pin 31 (`GP26`), and the other outer leg to pin 33 (`AGND`).'),
        PLUG, RUN,
        B('סובבו לאט מקצה לקצה, וצפו במספרים.', 'Turn slowly from end to end and watch the numbers.'),
        READ
      ],
      code: [
        'from machine import ADC',
        'from time import sleep',
        '',
        'pot = ADC(26)',
        '',
        'while True:',
        '    raw = pot.read_u16()',
        '    percent = raw * 100 // 65535',
        '    print(raw, percent, "%")',
        '    sleep(0.2)'
      ],
      explain: [
        E([1], 'הפעם השורה טוענת את `ADC` במקום את `Pin`.', 'This time `ADC` is brought in rather than `Pin`.'),
        E([4], 'השורה מגדירה את GP26 למדידת [[voltage|מתח]].', 'GP26 is used for measuring [[voltage|voltage]].'),
        E([7], 'השורה מודדת, ומתקבל מספר בין 0 ל-65535.', 'Measures. A number from 0 to 65535 comes back.'),
        E([8], 'השורה ממירה את המספר לאחוזים: מכפילה ב-100 ומחלקת ב-65535. `//` היא חלוקה שנותנת מספר שלם.', 'Turns it into a percentage: multiply by 100 and divide by 65535. `//` is division that gives a whole number.'),
        E([9], 'השורה מדפיסה את שני הערכים.', 'Prints both values.')
      ],
      expect: B('חמש פעמים בשנייה מודפסים שני מספרים. בקצה אחד של הסיבוב הם קרובים ל-0, ובקצה השני הם קרובים ל-65535 ול-100.', 'Five times a second two numbers are printed. At one end of the turn they are close to 0, and at the other close to 65535 and 100.'),
      tasks: [
        { t: B('הדפיסו גם את המתח בוולטים.', 'Also print the voltage in volts.'), hint: B('`raw * 3.3 / 65535`. כדי לעגל את התוצאה: `round(volts, 2)`.', '`raw * 3.3 / 65535`. To round it: `round(volts, 2)`.') },
        { t: B('הדפיסו מילה במקום מספר: "low" מתחת ל-33%, "medium" עד 66%, ו-"high" מעל זה.', 'Print a word instead of a number: "low" below 33%, "medium" up to 66%, and "high" above.'), hint: B('`if percent < 33:`, אחריו `elif percent < 66:`, ואחריו `else:`.', '`if percent < 33:` followed by `elif percent < 66:` followed by `else:`.') },
        { t: B('ציירו מד במסוף: שורה של סימני # שמתארכת ככל שמסובבים.', 'Draw a gauge in the console: a row of # signs that grows as you turn.'), hint: B('ב-Python אפשר להכפיל טקסט במספר: `"#" * 5` נותן `#####`.', 'In Python you can multiply text by a number: `"#" * 5` gives `#####`.'), code: ['from machine import ADC', 'from time import sleep', '', 'pot = ADC(26)', '', 'while True:', '    percent = pot.read_u16() * 100 // 65535', '    print("#" * (percent // 4), percent)', '    sleep(0.1)'] }
      ],
      quiz: [
        Q(B('המספר קופץ מעט גם כשלא נוגעים בכפתור. האם משהו מקולקל?', 'The number jitters a little even when the knob is untouched. Is something broken?'),
          [B('כן, צריך להחליף את הפוטנציומטר', 'Yes, the potentiometer needs replacing'), B('לא, כל מדידה אנלוגית רועשת מעט', 'No, every analog measurement is slightly noisy'), B('כן, החוטים ארוכים מדי', 'Yes, the wires are too long')], 1,
          B('זה רגיל. אם צריך ערך יציב, מודדים כמה פעמים ומחשבים ממוצע.', 'That is normal. If you need a steady value, measure several times and take the average.'))
      ]
    },

    /* ============================================================ B2 */
    {
      id: 'B2', track: 'B',
      title: B('עמעם', 'A dimmer'),
      goal: B('סובבו את הכפתור, והלד יתבהר או יתעמעם. כאן קלט ופלט עובדים יחד.', 'Turn the knob and the LED brightens or dims. Input and output working together.'),
      learn: [
        B('איך משתמשים ב-[[pwm|PWM]] כדי לשנות בהירות.', 'To use [[pwm|PWM]] to change brightness.'),
        B('איך מעבירים ערך של קלט ישירות אל הפלט.', 'To feed an input value straight into an output.'),
        B('מה פירוש [[duty|duty cycle]].', 'What [[duty|duty cycle]] means.')
      ],
      before: [{ href: '#/lessons/B1', label: B('שיעור B1', 'Lesson B1') }, { href: '#/interfaces/pwm', label: B('העמוד על PWM', 'The PWM page'), why: B('יש בו הדמיה של duty cycle.', 'It has a duty-cycle demo.') }],
      parts: [{ id: 'pot', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      wiring: [
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, null, B('כפתור סיבוב', 'Knob')),
        W(B('פוטנציומטר, הרגליים הקיצוניות', 'Potentiometer, outer legs'), '3V3', 36, B('והרגל השנייה לפין 33, AGND', 'and the other to pin 33, AGND'), '3.3V'),
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('לד, רגל קצרה', 'LED, short leg'), 'GND', 18, null, 'GND')
      ],
      steps: [
        B('הפוטנציומטר משיעור B1 נשאר במקומו.', 'The potentiometer from lesson B1 stays where it is.'),
        B('ודאו שהלד עדיין מחובר ל-`GP15` דרך הנגד, ושהרגל הקצרה שלו מחוברת לאדמה.', 'Make sure the LED is still connected to `GP15` through the resistor, and that its short leg goes to ground.'),
        PLUG, RUN,
        B('סובבו את הכפתור וצפו בלד.', 'Turn the knob and watch the LED.'),
        READ
      ],
      code: [
        'from machine import Pin, ADC, PWM',
        'from time import sleep',
        '',
        'pot = ADC(26)',
        'led = PWM(Pin(15), freq=1000)',
        '',
        'while True:',
        '    led.duty_u16(pot.read_u16())',
        '    sleep(0.02)'
      ],
      explain: [
        E([5], 'הלד כבר אינו פין רגיל אלא פין PWM, שנדלק ונכבה 1000 פעמים בשנייה. זה מהר מדי בשביל העין.', 'The LED is no longer an ordinary pin but a PWM pin, switching 1000 times a second. Too fast for the eye.'),
        E([8], 'שורה אחת שעושה הכול: היא קוראת את הכפתור (0 עד 65535), ומשתמשת באותו מספר כ-duty cycle של הלד (גם הוא 0 עד 65535). שני הטווחים זהים, ולכן לא צריך שום חישוב.', 'One line that does everything: reads the knob (0 to 65535), and uses the same number as the LED\'s duty cycle (also 0 to 65535). The two ranges are identical, so no sum is needed.'),
        E([9], 'העדכון קורה חמישים פעמים בשנייה, ולכן התגובה מרגישה חלקה.', 'Updates fifty times a second, so the response feels smooth.')
      ],
      expect: B('הלד מגיב לסיבוב: בקצה אחד הוא כבוי, בקצה השני הוא בבהירות מלאה, ובאמצע הוא עובר בכל הדרגות שביניהם.', 'The LED follows the turn: off at one end, full brightness at the other, and everything in between.'),
      tasks: [
        { t: B('הפכו את הכיוון: סיבוב שמבהיר עכשיו צריך לעמעם.', 'Reverse the direction: a turn that brightens now should dim.'), hint: B('`65535 - pot.read_u16()`.', '`65535 - pot.read_u16()`.') },
        { t: B('גרמו ללד להיות כבוי לגמרי כשהכפתור מתחת ל-10%.', 'Make the LED fully off when the knob is below 10%.'), hint: B('שמרו את הקריאה במשתנה, ובדקו אותה ב-`if` לפני שקובעים את ה-duty.', 'Store the reading in a variable, and test it with an `if` before setting the duty.') },
        { t: B('במקום הבהירות, תנו לכפתור לקבוע את מהירות ההבהוב.', 'Instead of brightness, let the knob set the blink speed.'), hint: B('חזרו ללד רגיל (`Pin`, ולא `PWM`). ההמתנה יכולה להיות `0.05 + pot.read_u16() / 65535`.', 'Go back to an ordinary LED (`Pin`, not `PWM`). The wait can be `0.05 + pot.read_u16() / 65535`.'), code: ['from machine import Pin, ADC', 'from time import sleep', '', 'pot = ADC(26)', 'led = Pin(15, Pin.OUT)', '', 'while True:', '    led.toggle()', '    sleep(0.05 + pot.read_u16() / 65535)'] }
      ],
      quiz: [
        Q(B('מה באמת קורה ללד כשהוא ב"חצי בהירות"?', 'What is really happening to the LED at "half brightness"?'),
          [B('הוא מקבל 1.65V', 'It receives 1.65 V'), B('הוא נדלק ונכבה מהר, ודולק חצי מהזמן', 'It switches on and off fast, lit half the time'), B('הנגד מתחמם', 'The resistor heats up')], 1,
          B('הפין מכיר רק 0V או 3.3V. PWM משנה את החלק מהזמן שבו הפין דולק.', 'The pin only knows 0 V or 3.3 V. PWM changes the share of the time it is on.'))
      ]
    },

    /* ============================================================ B3 */
    {
      id: 'B3', track: 'B',
      title: B('מנורת לילה', 'A night light'),
      goal: B('לד שנדלק מעצמו כשמחשיך. זה הפרויקט השימושי הראשון.', 'An LED that comes on by itself when it gets dark. The first useful project.'),
      learn: [
        B('איך מחברים חיישן שמשנה [[resistance|התנגדות]] בעזרת [[divider|מחלק מתח]].', 'To connect a sensor that changes [[resistance|resistance]] using a [[divider|voltage divider]].'),
        B('איך קובעים סף ומחליטים לפיו.', 'To set a threshold and decide by it.'),
        B('איך מכיילים: מודדים את הסביבה שלכם ומתאימים אליה את התוכנית.', 'To calibrate: measure your own surroundings and fit the program to them.')
      ],
      before: [{ href: '#/lessons/B2', label: B('שיעור B2', 'Lesson B2') }, { href: '#/components/ldr', label: B('העמוד של חיישן האור', 'The light sensor\'s page'), why: B('שם מוסבר החיווט צעד אחר צעד.', 'The wiring is explained step by step there.') }],
      parts: [{ id: 'ldr', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 10kΩ ונגד 330Ω', 'A 10 kΩ resistor and a 330 Ω resistor') }],
      wiring: [
        W(B('LDR, רגל אחת', 'LDR, one leg'), '3V3', 36, null, '3.3V'),
        W(B('LDR, רגל שנייה + נגד 10kΩ', 'LDR other leg + 10 kΩ resistor'), 'GP27', 32, B('נקודת האמצע', 'the midpoint'), B('חיישן אור', 'Light sensor')),
        W(B('הקצה השני של הנגד 10kΩ', 'Other end of the 10 kΩ resistor'), 'AGND', 33, null, 'AGND'),
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('לד, רגל קצרה', 'LED, short leg'), 'GND', 18, null, 'GND')
      ],
      steps: [
        UNPLUG,
        B('אפשר להוציא את הפוטנציומטר. הלד נשאר במקומו.', 'You can remove the potentiometer. The LED stays.'),
        B('חברו את ה-LDR ואת הנגד 10kΩ לפי הטבלה. הטור שבו נפגשים ה-LDR והנגד הוא נקודת האמצע, וממנו יוצא החוט אל `GP27`.', 'Connect the LDR and the 10 kΩ resistor by the table. The column where the LDR and resistor meet is the midpoint, and the wire to `GP27` comes from it.'),
        PLUG, RUN,
        B('רשמו לעצמכם את אחוז האור שמודפס כשהחיישן חשוף, ואת האחוז שמודפס כשמכסים אותו ביד.', 'Note down the light percentage printed with the sensor uncovered, and the percentage with your hand covering it.'),
        B('שנו את `THRESHOLD` בשורה 7 למספר שנמצא בין שני הערכים שרשמתם, והריצו שוב.', 'Change `THRESHOLD` on line 7 to a number between the two values you noted, and run again.'),
        READ
      ],
      code: [
        'from machine import Pin, ADC',
        'from time import sleep',
        '',
        'ldr = ADC(27)',
        'led = Pin(15, Pin.OUT)',
        '',
        'THRESHOLD = 30          # percent of light below which it counts as dark',
        '',
        'while True:',
        '    light = ldr.read_u16() * 100 // 65535',
        '    print("light:", light, "%")',
        '    if light < THRESHOLD:',
        '        led.on()',
        '    else:',
        '        led.off()',
        '    sleep(0.5)'
      ],
      explain: [
        E([7], 'זה הסף: אור שמתחת לאחוז הזה נחשב "חשוך". שם באותיות גדולות הוא מוסכמה למספר שקובעים פעם אחת ולא משנים בזמן הריצה.', 'The threshold: below this percentage counts as "dark". A name in capitals is a convention for a number set once and not changed while running.'),
        E([10], 'השורה מודדת את האור וממירה אותו לאחוזים.', 'Measures the light and turns it into a percentage.'),
        E([11], 'השורה מדפיסה את הערך. בלי ההדפסה הזו אי אפשר לדעת איזה סף לבחור.', 'Prints. Without this print you could not know which threshold to choose.'),
        E([12, 15], 'כאן מתקבלת ההחלטה: אם האור מתחת לסף, הלד נדלק, ואחרת הוא נכבה.', 'The decision: if the light is below the threshold, switch on. Otherwise, switch off.')
      ],
      expect: B('אחרי הכיול: כשהחיישן חשוף לאור, הלד כבוי. כשמכסים את החיישן ביד, הלד נדלק.', 'After calibrating: with the sensor in the light the LED is off. Cover the sensor with your hand and the LED comes on.'),
      tasks: [
        { t: B('ליד הסף הלד מהבהב בעצבנות. למה זה קורה, ואיך מתקנים את זה?', 'Near the threshold the LED flickers nervously. Why, and how do you fix it?'), hint: B('המדידה קופצת מעט סביב הסף. הפתרון הוא להשתמש בשני ספים: להדליק מתחת ל-25, ולכבות רק מעל 35. בין שני הספים לא משנים כלום.', 'The reading jitters slightly around the threshold. The fix is two thresholds: switch on below 25, and off only above 35. In between, change nothing.') },
        { t: B('במקום דולק או כבוי, גרמו ללד להאיר חזק יותר ככל שחשוך יותר.', 'Instead of on or off, make the LED shine brighter the darker it gets.'), hint: B('הפכו את הלד ל-PWM כמו בשיעור B2, והשתמשו ב-`65535 - ldr.read_u16()`.', 'Turn the LED into PWM as in lesson B2, and use `65535 - ldr.read_u16()`.') },
        { t: B('החזירו את הפוטנציומטר, ותנו לו לקבוע את הסף במקום המספר הקבוע.', 'Put the potentiometer back, and let it set the threshold instead of the fixed number.'), hint: B('קראו את הפוטנציומטר בתוך הלולאה, המירו את הקריאה לאחוזים, והשוו את האור לערך הזה.', 'Read the potentiometer inside the loop, turn it into a percentage, and compare against it.') }
      ],
      quiz: [
        Q(B('למה המספר 30 לא מתאים לכל חדר?', 'Why does the number 30 not suit every room?'),
          [B('כי כל חיישן מודד בחדר אחר, עם תאורה אחרת', 'Because every sensor measures in a different room, with different lighting'), B('כי 30 הוא מספר קטן מדי', 'Because 30 is too small a number'), B('הוא כן מתאים לכל חדר', 'It does suit every room')], 0,
          B('לכן מכיילים: מודדים את הערכים אצלכם, ובוחרים סף שנמצא ביניהם.', 'That is why you calibrate: measure the values where you are, and choose a threshold between them.'))
      ]
    },

    /* ============================================================ B4 */
    {
      id: 'B4', track: 'B',
      title: B('פעמון דלת', 'A doorbell'),
      goal: B('לחצו על כפתור, והבאזר ינגן שני צלילים, כמו פעמון דלת.', 'Press a button and the buzzer plays two notes, like a doorbell.'),
      learn: [
        B('איך [[frequency|תדר]] הופך לגובה של צליל.', 'How [[frequency|frequency]] becomes the pitch of a note.'),
        B('איך כותבים [[func|פונקציה]] משלכם ומשתמשים בה כמה פעמים.', 'To write a [[func|function]] of your own and use it several times.'),
        B('איך מנגנים מנגינה מתוך רשימה של תווים.', 'To play a tune from a list of notes.')
      ],
      before: [{ href: '#/lessons/A3', label: B('שיעור A3', 'Lesson A3'), why: B('בשביל הכפתור.', 'For the button.') }, { href: '#/components/buzzer', label: B('העמוד של הבאזר', 'The buzzer\'s page') }],
      parts: [{ id: 'buzzer', qty: 1 }, { id: 'button', qty: 1 }, { text: B('ארבעה חוטי גישור', 'Four jumper wires') }],
      wiring: [
        W(B('באזר, +', 'Buzzer, +'), 'GP13', 17, null, B('באזר', 'Buzzer')),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('באזר, − + כפתור, הרגל שבאלכסון', 'Buzzer − + button\'s diagonal leg'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [
        UNPLUG,
        B('פרקו את חיישן האור. את הלד אפשר להשאיר.', 'Remove the light sensor. The LED can stay.'),
        B('הכניסו את הבאזר כך שכל רגל תהיה בטור משלה. חברו את ה-+ לפין 17 (`GP13`), ואת הרגל השנייה לפס האדמה.', 'Push in the buzzer with each leg in its own column. Connect + to pin 17 (`GP13`) and the other leg to the ground rail.'),
        B('חברו את הכפתור כמו בשיעור A3: רגל אחת לפין 19 (`GP14`), והרגל שבאלכסון לפס האדמה.', 'Connect the button as in lesson A3: one leg to pin 19 (`GP14`), and the diagonal leg to the ground rail.'),
        PLUG, RUN,
        B('לחצו על הכפתור.', 'Press the button.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'buzzer = PWM(Pin(13))',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'def tone(freq, seconds):',
        '    buzzer.freq(freq)',
        '    buzzer.duty_u16(32768)',
        '    sleep(seconds)',
        '    buzzer.duty_u16(0)',
        '',
        'while True:',
        '    if button.value() == 0:',
        '        tone(659, 0.3)',
        '        tone(523, 0.5)',
        '    sleep(0.02)'
      ],
      explain: [
        E([7], 'השורה מגדירה פונקציה בשם `tone` שמקבלת שני דברים: תדר, ומשך בשניות.', 'Defines a function named `tone` that receives two things: a frequency, and a length in seconds.'),
        E([8], 'השורה קובעת את התדר. ככל שהתדר גבוה יותר, הצליל נשמע גבוה יותר.', 'Sets the frequency. A higher frequency sounds as a higher note.'),
        E([9], 'השורה מפעילה את הצליל. 32768 הוא חצי מ-65535, וזה נותן את הצליל החזק ביותר.', 'Turns the sound on. 32768 is half of 65535, which gives the loudest sound.'),
        E([10, 11], 'השורות ממתינות כמה זמן שביקשו, ואז משתיקות את הבאזר.', 'Waits as long as asked, then silences it.'),
        E([14], 'השורה בודקת אם הכפתור לחוץ.', 'Checks whether the button is pressed.'),
        E([15, 16], 'השורות מפעילות את הפונקציה פעמיים, עם ערכים שונים: קודם צליל גבוה וקצר, ואחריו צליל נמוך וארוך יותר.', 'Runs the function twice with different values: a high short note, then a lower longer one.')
      ],
      expect: B('שקט. כשלוחצים על הכפתור, נשמע "דינג-דונג". כל עוד מחזיקים את הכפתור, הפעמון חוזר על עצמו.', 'Silence. Press the button and a "ding-dong" sounds. While the button is held, the bell repeats.'),
      tasks: [
        { t: B('שנו את שני התדרים וצרו פעמון משלכם. אלה התדרים של התווים: דו 262, רה 294, מי 330, פה 349, סול 392, לה 440, סי 494, דו גבוה 523.', 'Change the two frequencies to make a doorbell of your own. These are the note frequencies: C 262, D 294, E 330, F 349, G 392, A 440, B 494, high C 523.'), hint: B('נסו גם שלושה או ארבעה תווים. כל קריאה ל-`tone` היא תו אחד.', 'Try three or four notes too. Each call to `tone` is one note.') },
        {
          t: B('נגנו מנגינה שלמה מתוך רשימה, במקום לכתוב שורה לכל תו.', 'Play a whole tune from a list, instead of writing a line per note.'),
          hint: B('רשימה נכתבת בסוגריים מרובעים. כל תו הוא זוג של תדר ומשך. `for freq, seconds in melody:` עובר על הזוגות אחד אחרי השני.', 'A list is written in square brackets. Each note is a pair: frequency and length. `for freq, seconds in melody:` goes through the pairs.'),
          code: [
            'from machine import Pin, PWM',
            'from time import sleep',
            '',
            'buzzer = PWM(Pin(13))',
            'button = Pin(14, Pin.IN, Pin.PULL_UP)',
            '',
            'melody = [(262, 0.3), (262, 0.3), (392, 0.3), (392, 0.3), (440, 0.3), (440, 0.3), (392, 0.6)]',
            '',
            'def tone(freq, seconds):',
            '    buzzer.freq(freq)',
            '    buzzer.duty_u16(32768)',
            '    sleep(seconds)',
            '    buzzer.duty_u16(0)',
            '    sleep(0.05)',
            '',
            'while True:',
            '    if button.value() == 0:',
            '        for freq, seconds in melody:',
            '            tone(freq, seconds)',
            '    sleep(0.02)'
          ]
        },
        { t: B('צרו סירנה: צליל שעולה בהדרגה מ-400 ל-1200.', 'Make a siren: a note that rises gradually from 400 to 1200.'), hint: B('`for freq in range(400, 1200, 20):`, ובתוכו `tone(freq, 0.01)`.', '`for freq in range(400, 1200, 20):` with `tone(freq, 0.01)` inside.') }
      ],
      quiz: [
        Q(B('מה היתרון של הפונקציה `tone`?', 'What is the advantage of the `tone` function?'),
          [B('היא משמיעה צליל חזק יותר', 'It makes a louder sound'), B('כותבים את ארבע השורות פעם אחת, ומשתמשים בהן שוב ושוב', 'The four lines are written once and used again and again'), B('בלעדיה הבאזר לא עובד', 'The buzzer does not work without it')], 1,
          B('בלי פונקציה, היה צריך לחזור על ארבע השורות בכל תו. עם פונקציה, כל תו הוא שורה אחת.', 'Without a function the four lines would be repeated for every note. With one, each note is a single line.'))
      ]
    },

    /* ============================================================ B5 */
    {
      id: 'B5', track: 'B',
      title: B('זרוע שנשלטת בכפתור סיבוב', 'An arm steered by a knob'),
      goal: B('סובבו פוטנציומטר, והזרוע של הסרבו תפנה לאותה זווית.', 'Turn a potentiometer and the servo\'s arm turns to the same angle.'),
      learn: [
        B('איך מזינים רכיב ב-5V מהפין `VBUS`.', 'To power a part from 5 V, from the `VBUS` pin.'),
        B('איך ממירים טווח אחד של מספרים לטווח אחר.', 'To convert one range of numbers to another.'),
        B('איך אורך של [[pulse|פולס]] קובע זווית.', 'How the length of a [[pulse|pulse]] sets an angle.')
      ],
      before: [{ href: '#/lessons/B1', label: B('שיעור B1', 'Lesson B1'), why: B('בשביל הפוטנציומטר.', 'For the potentiometer.') }, { href: '#/components/servo', label: B('העמוד של הסרבו', 'The servo\'s page') }],
      parts: [{ id: 'servo', qty: 1 }, { id: 'pot', qty: 1 }, { text: B('שישה חוטי גישור', 'Six jumper wires') }],
      wiring: [
        W(B('סרבו, כתום', 'Servo, orange'), 'GP10', 14, null, B('סרבו', 'Servo')),
        W(B('סרבו, אדום', 'Servo, red'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('סרבו, חום', 'Servo, brown'), 'GND', 13, null, 'GND'),
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, null, B('כפתור סיבוב', 'Knob')),
        W(B('פוטנציומטר, רגל קיצונית', 'Potentiometer, outer leg'), '3V3', 36, null, '3.3V'),
        W(B('פוטנציומטר, רגל קיצונית שנייה', 'Potentiometer, other outer leg'), 'AGND', 33, null, 'AGND')
      ],
      steps: [
        UNPLUG,
        B('פרקו את הבאזר ואת הכפתור.', 'Remove the buzzer and the button.'),
        B('חברו את הפוטנציומטר כמו בשיעור B1.', 'Connect the potentiometer as in lesson B1.'),
        B('הכניסו שלושה חוטי גישור למחבר של הסרבו. את החוט שמול הכתום חברו לפין 14 (`GP10`), את החוט שמול האדום לפין 40 (`VBUS`), ואת החוט שמול החום לפין 13 (`GND`).', 'Push three jumper wires into the servo\'s connector. Opposite orange to pin 14 (`GP10`), opposite red to pin 40 (`VBUS`), opposite brown to pin 13 (`GND`).'),
        B('שימו לב: החוט האדום של הסרבו מתחבר ל-`VBUS` ולא ל-`3V3`. הפוטנציומטר, לעומת זאת, מתחבר ל-`3V3`. אל תחליפו ביניהם.', 'Note: the servo\'s red goes to `VBUS` and not to `3V3`. The potentiometer, by contrast, connects to `3V3`. Do not swap them.'),
        PLUG, RUN,
        B('סובבו את הכפתור לאט.', 'Turn the knob slowly.'),
        READ
      ],
      code: [
        'from machine import Pin, ADC, PWM',
        'from time import sleep',
        '',
        'pot = ADC(26)',
        'servo = PWM(Pin(10), freq=50)',
        '',
        'def angle(deg):',
        '    servo.duty_ns(500_000 + int(deg / 180 * 2_000_000))',
        '',
        'while True:',
        '    deg = pot.read_u16() * 180 // 65535',
        '    angle(deg)',
        '    sleep(0.02)'
      ],
      explain: [
        E([5], 'השורה קובעת שהסרבו יקבל 50 פולסים בשנייה.', 'The servo receives 50 pulses a second.'),
        E([7, 8], 'פונקציה שמקבלת זווית וקובעת את אורך הפולס המתאים לה: חצי אלפית שנייה ל-0 מעלות, ועד שתיים וחצי אלפיות שנייה ל-180 מעלות.', 'A function that takes an angle and sets the matching pulse length. Half a millisecond for 0 degrees, up to two and a half milliseconds for 180.'),
        E([11], 'כאן ממירים טווח לטווח: הכפתור נותן 0 עד 65535, והסרבו צריך 0 עד 180. לכן מכפילים ב-180 ומחלקים ב-65535.', 'A range conversion: the knob gives 0 to 65535, and the servo wants 0 to 180. Multiply by 180 and divide by 65535.'),
        E([12], 'השורה שולחת את הזווית לסרבו.', 'Sends the angle to the servo.')
      ],
      expect: B('הזרוע עוקבת אחרי הכפתור: סיבוב מקצה לקצה מזיז אותה חצי סיבוב, מ-0 עד 180 מעלות.', 'The arm follows the knob: a turn from end to end moves it half a turn, from 0 to 180 degrees.'),
      tasks: [
        { t: B('הגבילו את התנועה לטווח שבין 45 ל-135 מעלות בלבד.', 'Limit the movement to the range between 45 and 135 degrees only.'), hint: B('במקום 0 עד 180, חשבו 0 עד 90 והוסיפו 45.', 'Instead of 0 to 180, work out 0 to 90 and add 45.') },
        { t: B('הדפיסו את הזווית, אבל רק כשהיא משתנה.', 'Print the angle, but only when it changes.'), hint: B('שמרו את הזווית הקודמת במשתנה, כמו `was_pressed` בשיעור A4.', 'Keep the previous angle in a variable, like `was_pressed` in lesson A4.') },
        { t: B('מחסום: החליפו את הפוטנציומטר בכפתור. לחיצה מרימה את הזרוע ל-90 מעלות, ושחרור מוריד אותה ל-0.', 'A barrier: replace the potentiometer with a button. Pressing raises the arm to 90 degrees, and releasing lowers it to 0.'), hint: B('`if button.value() == 0:`, ואז `angle(90)`, ואחרת `angle(0)`.', '`if button.value() == 0:` then `angle(90)`, otherwise `angle(0)`.') }
      ],
      quiz: [
        Q(B('הלוח מתנתק מהמחשב בכל פעם שהסרבו זז. מה הסיבה הסבירה?', 'The board disconnects from the computer every time the servo moves. What is the likely cause?'),
          [B('הקוד שגוי', 'The code is wrong'), B('הסרבו מוזן מ-`3V3` במקום מ-`VBUS`', 'The servo is powered from `3V3` instead of `VBUS`'), B('הפוטנציומטר הפוך', 'The potentiometer is backwards')], 1,
          B('סרבו צורך הרבה זרם כשהוא זז. הפין `3V3` לא יכול לספק אותו, ולכן המתח של הלוח נופל.', 'A servo draws a lot of current when it moves. The `3V3` pin cannot supply it, and the board\'s voltage drops.'))
      ]
    }
  ];
})(window.PICO);
