/* Component catalog, part 1 of 2 (parts 9-16 are in data-components-2.js).
   Every entry is written for a reader who has never seen the part:
   what it is, how to recognise it, how it works, how to build it step by
   step, code with a line-by-line walk-through, the expected result, what to
   check when it fails, and project ideas.
   Pins are chosen so the examples do not collide with each other. */
(function (P) {
  'use strict';

  var B = function (he, en) { return { he: he, en: en }; };
  var W = function (part, to, num, note) { return { part: part, to: to, num: num, note: note }; };
  var E = function (lines, he, en) { return { l: lines, t: B(he, en) }; };

  /* Sentences that repeat in almost every build list. */
  var UNPLUG = B('נתקו את כבל ה-USB מה-Pico. חווטו רק כשהחשמל מנותק.', 'Unplug the USB cable from the Pico. Wire only with the power off.');
  var CHECK = B('עברו על כל החיבורים והשוו אותם לטבלה. רק אחרי זה חברו את ה-USB והריצו את הקוד.', 'Go over every connection against the table. Only then plug in the USB and run the code.');
  var seat = function (n) {
    return B('הכניסו את המודול למטריצה כך שכל אחד מ-' + n + ' הפינים שלו יושב בטור נפרד.',
      'Push the module into the breadboard so each of its ' + n + ' pins sits in a column of its own.');
  };
  var wire = function (from, name, num) {
    return B('חברו חוט גישור מהטור של `' + from + '` אל פין ' + num + ' של ה-Pico, שהוא `' + name + '`.',
      'Connect a jumper wire from the column of `' + from + '` to Pico pin ' + num + ', which is `' + name + '`.');
  };
  P._c = { B: B, W: W, E: E, UNPLUG: UNPLUG, CHECK: CHECK, seat: seat, wire: wire };

  P.components = [
    /* ------------------------------------------------------------ LED */
    {
      id: 'led', name: B('לד', 'LED'), iface: ['gpio', 'pwm'], cat: 'output', volt: '3.3V',
      summary: B('נורית קטנה. זה רכיב הפלט הפשוט ביותר, והרכיב הראשון שכדאי לחבר.', 'A small light. The simplest output, and the first part worth connecting.'),
      what: [
        B('[[led|לד]] הוא נורית קטנה שמאירה כאשר עובר דרכה [[current|זרם]]. זה הרכיב הראשון שכולם מחברים, כי רואים מיד אם הוא עובד.',
          'An [[led|LED]] is a small light that glows when [[current|current]] passes through it. It is the first part everyone connects, because you can see at once whether it works.'),
        B('משתמשים בו כדי שהפרויקט "יגיד" משהו: הוא דולק כשהמערכת פועלת, מהבהב כשיש בעיה, או מאיר בירוק ובאדום כדי להראות מצבים שונים.',
          'It is used to let a project "say" something: on while the system runs, blinking when there is a problem, green and red for different states.')
      ],
      looks: B('כיפה קטנה מפלסטיק צבעוני או שקוף, ולה שתי רגליים באורכים שונים. הרגל הארוכה היא הצד החיובי. אם הרגליים כבר נחתכו, חפשו צד שטוח בשולי הכיפה: הוא מסמן את הרגל שמתחברת לאדמה.',
        'A small dome of coloured or clear plastic with two legs of different lengths. The long leg is the positive side. If the legs have been trimmed, look for a flat edge on the rim of the dome: it marks the leg that goes to ground.'),
      pins: [
        { n: B('רגל ארוכה', 'Long leg'), d: B('ה[[anode|אנודה]], הצד החיובי. היא מתחברת לפין של ה-Pico דרך ה[[resistor|נגד]].', 'The [[anode|anode]], the positive side. Connects to the Pico pin, through the [[resistor|resistor]].') },
        { n: B('רגל קצרה', 'Short leg'), d: B('הקתודה. היא מתחברת ל[[ground|אדמה]].', 'The cathode. Connects to [[ground|ground]].') }
      ],
      how: [
        B('כשהתוכנית מעבירה את הפין GP15 למצב 1, יש עליו מתח של 3.3V. הזרם יוצא מהפין, עובר דרך הנגד שמגביל אותו, עובר דרך הלד ומדליק אותו, וחוזר לאדמה. כשהפין במצב 0 אין עליו [[voltage|מתח]], ולכן אין זרם והלד כבוי.',
          'When the program sets pin GP15 to 1, it carries 3.3 V. Current leaves the pin, passes through the resistor that limits it, passes through the LED which glows, and returns to ground. When the pin is 0 there is no [[voltage|voltage]], no current, and the LED is off.'),
        B('לד מעביר זרם בכיוון אחד בלבד. לכן אם מחברים אותו הפוך, הוא פשוט לא נדלק. זה לא מזיק לו.',
          'An LED passes current in one direction only. So if it is connected backwards it simply does not light. This does not harm it.')
      ],
      needs: [B('לד, בכל צבע', 'An LED, any colour'), B('נגד 330Ω (כתום, כתום, חום)', 'A 330 Ω resistor (orange, orange, brown)'), B('חוט גישור אחד', 'One jumper wire')],
      wiring: [
        W(B('רגל ארוכה', 'Long leg'), 'GP15', 20, B('דרך נגד 330Ω', 'through a 330 Ω resistor')),
        W(B('רגל קצרה', 'Short leg'), 'GND', 18)
      ],
      steps: [
        UNPLUG,
        B('הכניסו רגל אחת של הנגד לטור של פין 20 (`GP15`), ואת הרגל השנייה לטור פנוי כלשהו.', 'Push one leg of the resistor into the column of pin 20 (`GP15`), and the other leg into any free column.'),
        B('הכניסו את הרגל הארוכה של הלד לטור שבו נמצאת הרגל השנייה של הנגד, ואת הרגל הקצרה לטור שלידו.', 'Push the LED\'s long leg into the same column where the resistor ends, and the short leg into the next column.'),
        B('חברו חוט גישור מהטור של הרגל הקצרה אל הטור של פין 18 (`GND`).', 'Connect a jumper wire from the short leg\'s column to the column of pin 18 (`GND`).'),
        B('איור מלא של המעגל הזה נמצא בחלק "יסודות", בפרק "המעגל הראשון שלכם".', 'A full drawing of this circuit is in Basics, in the chapter "Your first circuit".'),
        CHECK
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        '',
        'while True:',
        '    led.toggle()',
        '    sleep(0.5)'
      ],
      explain: [
        E([1, 2], 'השורות האלה טוענות את `Pin`, ששולט בפינים, ואת `sleep`, שממתין.', 'Brings in the `Pin` tool that controls pins, and `sleep` which waits.'),
        E([4], 'השורה הזו מגדירה ל-Pico שהפין GP15 הוא יציאה (`Pin.OUT`), ונותנת לו את השם `led`.', 'Tells the Pico that pin GP15 is an output (`Pin.OUT`), and gives it the name `led`.'),
        E([6], 'מכאן מתחילה [[loop|לולאה]] אינסופית. השורות המוזחות שמתחתיה חוזרות על עצמן בלי סוף.', 'An endless [[loop|loop]]. The indented lines beneath it repeat forever.'),
        E([7], 'השורה הזו הופכת את מצב הפין: מ-0 ל-1, או מ-1 ל-0.', 'Flips the pin: from 0 to 1 or from 1 to 0.'),
        E([8], 'כאן ממתינים חצי שנייה לפני הסיבוב הבא.', 'Waits half a second before the next round.')
      ],
      expect: B('הלד מהבהב פעם בשנייה: חצי שנייה הוא דולק וחצי שנייה הוא כבוי. שנו את המספר בשורה 8 ל-`0.1`, והוא יהבהב מהר.', 'The LED blinks once a second: half a second on, half a second off. Change the number on line 8 to `0.1` and it blinks fast.'),
      mistakes: [
        B('הלד מחובר הפוך. הוא מוליך זרם רק בכיוון אחד, ולכן הוציאו אותו, סובבו אותו והכניסו אותו בחזרה.', 'The LED is backwards. It only conducts one way. Pull it out, turn it round, and put it back.'),
        B('שתי הרגליים של הלד, או של הנגד, נמצאות באותו טור. במצב כזה הזרם עוקף את הרכיב.', 'Both legs of the LED, or of the resistor, are in the same column. Then the current skips the part.'),
        B('ספרתם את הפינים לא נכון. פין 20 הוא האחרון בשורה שלו, הרחוק ביותר מחיבור ה-USB.', 'The pins were counted wrongly. Pin 20 is the last in its row, the furthest from USB.'),
        B('אין נגד. בלי נגד הלד עלול להישרף, ואז הוא לא יעבוד גם אחרי שתתקנו את החיבור.', 'There is no resistor. Without one the LED can burn out, and then it will not work even after the fix.')
      ],
      ideas: [
        B('רמזור: שלושה לדים, אדום, צהוב וירוק, שמתחלפים לפי תזמון.', 'A traffic light: three LEDs in red, yellow and green, changing on a timer.'),
        B('נורית התראה שמהבהבת מהר כאשר חיישן מזהה משהו.', 'A warning light that blinks fast when a sensor detects something.'),
        B('עמעום הדרגתי, כמו נשימה. עושים את זה בעזרת [[pwm|PWM]].', 'A gradual fade, like breathing. This is done with [[pwm|PWM]].')
      ]
    },

    /* ------------------------------------------------------------ button */
    {
      id: 'button', name: B('כפתור', 'Push button'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('מתג שסוגר מעגל רק כל עוד לוחצים עליו. זה רכיב הקלט הפשוט ביותר.', 'A switch that connects only while it is pressed. The simplest input.'),
      what: [
        B('כפתור לחיצה הוא מתג קטן שמחבר שני חוטים רק כל עוד לוחצים עליו. כשמשחררים אותו, החיבור מתנתק. זו הדרך הפשוטה ביותר לתת פקודה לפרויקט.',
          'A push button is a small switch that joins two wires only while it is pressed. Release it and they separate. It is the simplest way to give a project a command.')
      ],
      looks: B('קובייה שחורה קטנה עם כפתור עגול למעלה וארבע רגליים. למרות שיש ארבע רגליים, יש רק שני חיבורים, כי בתוך הכפתור הרגליים מחוברות בזוגות. כדי לא להתבלבל, השתמשו תמיד בשתי רגליים שנמצאות באלכסון זו לזו. הן בוודאות שייכות לזוגות שונים.',
        'A small black cube with a round button on top and four legs. There are four legs but only two connections, because the legs are joined in pairs inside the button. To avoid confusion, always use two legs that are diagonal to each other. They are certain to belong to different pairs.'),
      how: [
        B('צד אחד של הכפתור מתחבר לפין GP14, והצד השני ל[[ground|אדמה]]. בקוד מפעילים [[pullup|נגד משיכה]] פנימי, שמחזיק את הפין במצב 1 כל עוד שום דבר לא קורה.',
          'One side of the button connects to pin GP14 and the other to [[ground|ground]]. In code you enable an internal [[pullup|pull-up resistor]], which holds the pin at 1 while nothing is happening.'),
        B('כשלוחצים על הכפתור, הוא מחבר את הפין ישירות לאדמה, והפין קורא 0. לכן ההיגיון הפוך ממה שאפשר לצפות: לחוץ הוא 0, ומשוחרר הוא 1. בעמוד של [[gpio|GPIO]] יש הדמיה שמראה את זה.',
          'When pressed, the button connects the pin straight to ground and the pin reads 0. So the logic is the reverse of what you might expect: pressed is 0, released is 1. The [[gpio|GPIO]] page has a demo that shows this.')
      ],
      needs: [B('כפתור לחיצה', 'A push button'), B('שני חוטי גישור', 'Two jumper wires')],
      wiring: [
        W(B('רגל אחת', 'One leg'), 'GP14', 19),
        W(B('הרגל שבאלכסון', 'The diagonal leg'), 'GND', 18)
      ],
      steps: [
        UNPLUG,
        B('הכניסו את הכפתור כך שיחצה את התעלה שבאמצע המטריצה, עם שתי רגליים מכל צד שלה. לחצו חזק, כי הוא נכנס בקושי.', 'Push the button in across the channel in the middle of the breadboard, with two legs on each side of it. Press firmly, it is a tight fit.'),
        B('חברו חוט גישור מהטור של רגל אחת אל פין 19 של ה-Pico, שהוא `GP14`.', 'Connect a jumper wire from the column of one leg to Pico pin 19, which is `GP14`.'),
        B('חברו חוט גישור מהטור של הרגל שנמצאת באלכסון אליה אל פין 18, שהוא `GND`.', 'Connect a jumper wire from the column of the leg diagonal to it to pin 18, which is `GND`.'),
        CHECK
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'while True:',
        '    if button.value() == 0:      # 0 = pressed (pin pulled to GND)',
        '        print("pressed")',
        '    sleep(0.05)'
      ],
      explain: [
        E([4], '`Pin.IN` קובע שהפין הוא כניסה: קוראים ממנו, ולא שולטים בו. `Pin.PULL_UP` מפעיל את נגד המשיכה הפנימי.', '`Pin.IN` says the pin is an input: you read it rather than control it. `Pin.PULL_UP` switches on the internal pull-up resistor.'),
        E([7], '`button.value()` קורא את הפין ומחזיר 0 או 1. ה[[cond|תנאי]] בודק אם התקבל 0, כלומר אם הכפתור לחוץ.', '`button.value()` reads the pin and returns 0 or 1. The [[cond|condition]] checks whether 0 came back, i.e. whether the button is pressed.'),
        E([8], 'השורה הזו רצה רק כשהכפתור לחוץ.', 'Runs only while the button is pressed.'),
        E([9], 'כאן ממתינים 5 מאיות שנייה. בלי ההמתנה, הלולאה בודקת אלפי פעמים בשנייה ומדפיסה מהר מדי.', 'Waits 5 hundredths of a second. Without the wait the loop checks thousands of times a second and prints far too fast.')
      ],
      expect: B('כל עוד מחזיקים את הכפתור לחוץ, המילה pressed מופיעה במסוף שוב ושוב. כשמשחררים אותו, ההדפסה נעצרת.', 'While the button is held, the word pressed appears in the console over and over. On release the printing stops.'),
      mistakes: [
        B('שום דבר לא מודפס: כנראה השתמשתם בשתי רגליים מאותו זוג. העבירו את החוט לרגל שבאלכסון.', 'Nothing prints: you probably used two legs from the same pair. Move to the diagonal leg.'),
        B('המילה pressed מודפסת כל הזמן, גם בלי ללחוץ: הפין מחובר לאדמה באופן קבוע. גם זה קורה כשבוחרים שתי רגליים מאותו זוג.', 'pressed prints all the time, even without pressing: the pin is permanently connected to ground. This too happens when you pick two legs from the same pair.'),
        B('שכחתם את `Pin.PULL_UP`. בלי נגד משיכה הפין "צף", והקריאה קופצת באקראי בין 0 ל-1.', '`Pin.PULL_UP` was forgotten. Without a pull-up the pin "floats" and the reading jumps randomly between 0 and 1.'),
        B('לחיצה אחת נספרת כמה פעמים. זה קורה כי המגעים בתוך הכפתור רועדים לרגע בזמן הלחיצה. המתנה קצרה אחרי שמזהים את הלחיצה פותרת את הבעיה.', 'One press is counted several times. The contacts inside the button bounce for a moment as it is pressed. A short wait after detecting it solves this.')
      ],
      ideas: [
        B('כפתור שמדליק ומכבה לד בכל לחיצה.', 'A button that switches an LED on and off with each press.'),
        B('מונה לחיצות שמוצג על מסך.', 'A press counter shown on a display.'),
        B('פעמון דלת: כפתור ובאזר.', 'A doorbell: a button and a buzzer.')
      ]
    },

    /* ------------------------------------------------------------ potentiometer */
    {
      id: 'pot', name: B('פוטנציומטר', 'Potentiometer'), iface: ['adc'], cat: 'input', volt: '3.3V',
      summary: B('כפתור סיבוב, כמו כפתור עוצמת קול, שנותן ל-Pico ערך שמשתנה בהדרגה.', 'A knob, like a volume control. It gives the Pico a value that changes gradually.'),
      what: [
        B('פוטנציומטר הוא כפתור שמסובבים, כמו כפתור עוצמת הקול ברדיו. בניגוד לכפתור לחיצה, שמכיר רק "לחוץ" או "לא לחוץ", הוא נותן ל-Pico מספר שמשתנה בהדרגה לפי מידת הסיבוב.',
          'A potentiometer is a knob you turn, like the volume control on a radio. Unlike a push button, which only knows "pressed" or "not", it gives the Pico a number that changes gradually with how far it is turned.'),
        B('זו הדרך הקלה ביותר להכיר קלט [[analog|אנלוגי]].', 'It is the easiest way to meet [[analog|analog]] input.')
      ],
      looks: B('גוף עגול עם ציר שמסובבים ביד או במברג, ושלוש רגליים בשורה. שתי הרגליים החיצוניות הן הקצוות, והרגל האמצעית היא היציאה.',
        'A round body with a shaft you turn by hand or with a screwdriver, and three legs in a row. The two outer legs are the ends, and the middle one is the output.'),
      pins: [
        { n: B('רגל קיצונית', 'Outer leg'), d: B('מתחברת ל-3.3V.', 'Connects to 3.3 V.') },
        { n: B('רגל אמצעית', 'Middle leg'), d: B('היציאה. המתח עליה משתנה בין 0V ל-3.3V לפי הסיבוב. היא מתחברת לפין שמודד מתח.', 'The output. Its voltage changes between 0 V and 3.3 V with the turn. Connects to a pin that measures voltage.') },
        { n: B('רגל קיצונית שנייה', 'Other outer leg'), d: B('מתחברת ל[[ground|אדמה]].', 'Connects to [[ground|ground]].') }
      ],
      how: [
        B('בתוך הפוטנציומטר יש פס של חומר בעל התנגדות, ומגע שנע לאורכו כשמסובבים את הציר. קצה אחד של הפס מחובר ל-3.3V, והקצה השני לאדמה. המגע "טועם" את המתח בנקודה שבה הוא נמצא: ליד קצה אחד המתח הוא 0V, ליד הקצה השני 3.3V, ובאמצע בערך 1.65V. זה [[divider|מחלק מתח]] שאפשר לכוונן ביד.',
          'Inside the potentiometer is a strip of resistive material, and a contact that slides along it as you turn. One end of the strip is connected to 3.3 V and the other to ground. The contact "tastes" the voltage at the point where it sits: near one end it is 0 V, near the other 3.3 V, and in the middle about 1.65 V. It is a [[divider|voltage divider]] you can adjust by hand.'),
        B('ה-[[adc|ADC]] של ה-Pico מודד את המתח הזה והופך אותו למספר בין 0 ל-65535.', 'The Pico\'s [[adc|ADC]] measures that voltage and turns it into a number between 0 and 65535.')
      ],
      needs: [B('פוטנציומטר 10kΩ', 'A 10 kΩ potentiometer'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W(B('רגל קיצונית', 'Outer leg'), '3V3', 36),
        W(B('רגל אמצעית', 'Middle leg'), 'GP26', 31, B('ADC0', 'ADC0')),
        W(B('רגל קיצונית שנייה', 'Other outer leg'), 'AGND', 33)
      ],
      steps: [
        UNPLUG,
        B('הכניסו את הפוטנציומטר למטריצה כך ששלוש הרגליים שלו נמצאות בשלושה טורים שונים.', 'Push the potentiometer into the breadboard so its three legs are in three different columns.'),
        B('חברו חוט גישור מהטור של אחת הרגליים הקיצוניות אל פין 36, שהוא `3V3(OUT)`.', 'Connect a jumper wire from the column of an outer leg to pin 36, which is `3V3(OUT)`.'),
        B('חברו חוט גישור מהטור של הרגל האמצעית אל פין 31, שהוא `GP26`.', 'Connect a jumper wire from the middle leg\'s column to pin 31, which is `GP26`.'),
        B('חברו חוט גישור מהטור של הרגל הקיצונית השנייה אל פין 33, שהוא `AGND`.', 'Connect a jumper wire from the other outer leg\'s column to pin 33, which is `AGND`.'),
        CHECK
      ],
      code: [
        'from machine import ADC',
        'from time import sleep',
        '',
        'pot = ADC(26)',
        '',
        'while True:',
        '    raw = pot.read_u16()             # 0..65535',
        '    volts = raw * 3.3 / 65535',
        '    print(raw, round(volts, 2))',
        '    sleep(0.2)'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את `ADC`, שמודד מתח.', 'Brings in the `ADC` tool, which measures voltage.'),
        E([4], 'השורה הזו קובעת שהפין GP26 ישמש למדידת מתח.', 'Sets pin GP26 to be used for measuring voltage.'),
        E([7], 'כאן קוראים את המתח. התוצאה היא מספר בין 0 (0V) ל-65535 (3.3V).', 'Reads the voltage. The result is a number from 0 (0 V) to 65535 (3.3 V).'),
        E([8], 'השורה הזו ממירה את המספר לוולטים, כדי שיהיה קל להבין אותו.', 'Converts the number to volts, to make it easy to understand.'),
        E([9], 'השורה הזו מדפיסה את שני הערכים. `round(volts, 2)` מעגל את המספר לשתי ספרות אחרי הנקודה.', 'Prints both values. `round(volts, 2)` rounds to two digits after the point.')
      ],
      expect: B('שני מספרים מתעדכנים חמש פעמים בשנייה. כשמסובבים את הכפתור מקצה לקצה, המספר הראשון נע בערך בין 0 ל-65535, והשני בין 0 ל-3.3.', 'Two numbers update five times a second. As you turn the knob from end to end, the first moves between roughly 0 and 65535, and the second between 0 and 3.3.'),
      mistakes: [
        B('חיברתם את הקצה ל-`VBUS` (5V) במקום ל-`3V3`. פיני ה-ADC מודדים עד 3.3V בלבד, ומתח גבוה יותר מזיק להם.', 'The end was connected to `VBUS` (5 V) instead of `3V3`. The ADC pins measure only up to 3.3 V, and a higher voltage harms them.'),
        B('המספר לא משתנה: הרגל האמצעית לא מחוברת לפין הנכון. רק GP26, GP27 ו-GP28 יכולים למדוד מתח.', 'The number does not change: the middle leg is not on the right pin. Only GP26, GP27 and GP28 can measure voltage.'),
        B('המספר קופץ מעט גם כשלא נוגעים בכפתור. זה תקין, כי כל מדידה אנלוגית רועשת מעט.', 'The number jitters a little even untouched. That is normal, every analog measurement is slightly noisy.')
      ],
      ideas: [
        B('שליטה בבהירות של לד.', 'Controlling the brightness of an LED.'),
        B('שליטה בזווית של סרבו: מסובבים את הכפתור, והזרוע זזה.', 'Controlling a servo\'s angle: turn the knob and the arm moves.'),
        B('קביעת מהירות ההבהוב של לד.', 'Setting how fast an LED blinks.')
      ]
    },

    /* ------------------------------------------------------------ LDR */
    {
      id: 'ldr', name: B('חיישן אור (LDR)', 'Light sensor (LDR)'), iface: ['adc'], cat: 'sensor', volt: '3.3V', fig: 'divider',
      summary: B('רכיב שמרגיש כמה אור יש סביבו.', 'A part that senses how much light is around it.'),
      what: [
        B('LDR הוא ראשי תיבות של Light Dependent Resistor, נגד שתלוי באור. זה [[sensor|חיישן]] פשוט וזול שמרגיש כמה אור יש סביבו.',
          'LDR stands for Light Dependent Resistor. It is a simple, cheap [[sensor|sensor]] that senses how much light is around it.'),
        B('משתמשים בו כשרוצים שהפרויקט ידע אם עכשיו יום או לילה, אם מישהו פתח מגירה, או אם משהו מטיל צל.', 'Use it when a project should know whether it is day or night, whether a drawer was opened, or whether something casts a shadow.')
      ],
      looks: B('דיסקית קטנה עם פס מפותל על פניה, ושתי רגליים. אין לו כיוון, ולכן אפשר לחבר אותו בשני הכיוונים.',
        'A small disc with a wavy line on its face, and two legs. It has no direction and can be connected either way round.'),
      how: [
        B('ה[[resistance|התנגדות]] של ה-LDR משתנה לפי האור: באור חזק היא נמוכה, ובחושך היא גבוהה מאוד.', 'The LDR\'s [[resistance|resistance]] changes with light: in bright light it is low, and in the dark it is very high.'),
        B('ה-Pico לא יודע למדוד התנגדות, אלא רק [[voltage|מתח]]. לכן מחברים את ה-LDR יחד עם נגד קבוע של 10kΩ, אחד אחרי השני, בין 3.3V לאדמה. זה [[divider|מחלק מתח]]: המתח בנקודה שביניהם עולה כשיש יותר אור, ויורד בחושך. את הנקודה הזו מחברים לפין שמודד מתח.',
          'The Pico cannot measure resistance, only [[voltage|voltage]]. So the LDR is wired together with a fixed 10 kΩ resistor, one after the other between 3.3 V and ground. This is a [[divider|voltage divider]]: the voltage at the point between them rises with more light and falls in the dark. That point is connected to a pin that measures voltage.')
      ],
      needs: [B('LDR', 'An LDR'), B('נגד 10kΩ (חום, שחור, כתום)', 'A 10 kΩ resistor (brown, black, orange)'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W(B('LDR, רגל אחת', 'LDR, one leg'), '3V3', 36),
        W(B('LDR, רגל שנייה + נגד', 'LDR, other leg + resistor'), 'GP27', 32, B('נקודת האמצע של המחלק, ADC1', 'the midpoint of the divider, ADC1')),
        W(B('הקצה השני של הנגד', 'Other end of the resistor'), 'AGND', 33)
      ],
      steps: [
        UNPLUG,
        B('הכניסו את ה-LDR כך שכל רגל שלו נמצאת בטור נפרד.', 'Push in the LDR with each leg in its own column.'),
        B('הכניסו רגל אחת של הנגד לאותו טור שבו נמצאת אחת מרגלי ה-LDR, ואת הרגל השנייה של הנגד לטור פנוי. הטור המשותף הוא נקודת האמצע.', 'Push one leg of the resistor into the same column as one of the LDR\'s legs, and the resistor\'s other leg into a free column. The shared column is the midpoint.'),
        B('חברו חוט גישור מהרגל החופשית של ה-LDR אל פין 36, שהוא `3V3(OUT)`.', 'Connect a jumper wire from the LDR\'s free leg to pin 36, which is `3V3(OUT)`.'),
        B('חברו חוט גישור מהטור המשותף אל פין 32, שהוא `GP27`.', 'Connect a jumper wire from the shared column to pin 32, which is `GP27`.'),
        B('חברו חוט גישור מהרגל החופשית של הנגד אל פין 33, שהוא `AGND`.', 'Connect a jumper wire from the resistor\'s free leg to pin 33, which is `AGND`.'),
        CHECK
      ],
      code: [
        'from machine import ADC',
        'from time import sleep',
        '',
        'ldr = ADC(27)',
        '',
        'while True:',
        '    light = ldr.read_u16() * 100 // 65535    # 0..100 %',
        '    print("light:", light, "%")',
        '    sleep(0.5)'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את GP27 כפין שמודד מתח.', 'Sets GP27 as a pin that measures voltage.'),
        E([7], 'השורה הזו קוראת את המתח (0 עד 65535) והופכת אותו לאחוזים. `//` היא חלוקה שמשמיטה את השבר ומשאירה מספר שלם.', 'Reads the voltage (0 to 65535) and turns it into a percentage. `//` is division that drops the fraction and keeps a whole number.'),
        E([8], 'השורה הזו מדפיסה את התוצאה, עם מילת הסבר לפניה.', 'Prints the result with a word of explanation before it.')
      ],
      expect: B('פעמיים בשנייה מודפס אחוז האור. כסו את החיישן ביד, והמספר יירד. האירו עליו בפנס של הטלפון, והוא יעלה.', 'Twice a second the light percentage is printed. Cover the sensor with your hand and the number drops. Shine your phone torch on it and it rises.'),
      mistakes: [
        B('אין נגד קבוע. בלי מחלק מתח, המתח על הפין לא משתנה כשהאור משתנה.', 'There is no fixed resistor. With no voltage divider, the pin voltage does not change with light.'),
        B('החוט ל-GP27 לא יוצא מהטור שמשותף ל-LDR ולנגד.', 'The wire to GP27 does not come from the column shared by the LDR and the resistor.'),
        B('המספר יורד באור ועולה בחושך: ה-LDR והנגד החליפו מקומות. זה לא מזיק, רק הפוך.', 'The number falls in light and rises in the dark: the LDR and the resistor have swapped places. It is harmless, just reversed.')
      ],
      ideas: [
        B('מנורת לילה: לד שנדלק כשמחשיך.', 'A night light: an LED that comes on when it gets dark.'),
        B('אזעקת מגירה שמצפצפת כשנכנס אור.', 'A drawer alarm: it beeps when light gets in.'),
        B('מד אור לצמחים, שמראה אם הם מקבלים מספיק אור.', 'A plant light meter that shows whether they get enough light.')
      ]
    },

    /* ------------------------------------------------------------ buzzer */
    {
      id: 'buzzer', name: B('באזר פסיבי', 'Passive buzzer'), iface: ['pwm'], cat: 'output', volt: '3.3V',
      summary: B('רמקול זעיר לצפצופים ולמנגינות פשוטות.', 'A tiny speaker for beeps and simple tunes.'),
      what: [
        B('באזר הוא רמקול זעיר. הוא לא מנגן מוזיקה אמיתית, אבל הוא משמיע צפצופים ומנגינות פשוטות, וזה מספיק כדי שהפרויקט ישמיע התראה או יאשר לחיצה.',
          'A buzzer is a tiny speaker. It will not play real music, but it makes beeps and simple tunes, which is enough for a project to sound an alert or confirm a press.')
      ],
      looks: B('גליל שחור קטן עם חור למעלה ושתי רגליים. ליד אחת הרגליים מסומן +. יש שני סוגים שנראים כמעט אותו דבר. באזר פסיבי, שבו משתמשים כאן, צריך אות משתנה כדי להשמיע צליל, ובתחתית שלו רואים לוח ירוק קטן. באזר אקטיבי מצפצף בעצמו בצליל אחד ברגע שהוא מקבל מתח, והתחתית שלו אטומה ושחורה.',
        'A small black cylinder with a hole on top and two legs. A + is marked beside one leg. There are two kinds that look almost the same. A passive buzzer, used here, needs a changing signal to make a sound, and you can see a small green board on its underside. An active buzzer beeps by itself at one pitch as soon as it gets power, and its underside is sealed in black.'),
      pins: [
        { n: '+', d: B('מתחבר לפין של ה-Pico.', 'Connects to the Pico pin.') },
        { n: '−', d: B('מתחבר ל[[ground|אדמה]].', 'Connects to [[ground|ground]].') }
      ],
      how: [
        B('בתוך הבאזר יש דיסקית דקה שזזה מעט כשהמתח עליה משתנה. כשמדליקים ומכבים את הפין מאות פעמים בשנייה, הדיסקית רוטטת, והרטט הזה הוא הצליל שאנחנו שומעים.',
          'Inside the buzzer is a thin disc that moves slightly when the voltage on it changes. Switch the pin on and off hundreds of times a second and the disc vibrates, and that vibration is the sound we hear.'),
        B('את ההדלקה והכיבוי המהירים מבצע [[pwm|PWM]]. ה[[frequency|תדר]], כלומר מספר הפעמים בשנייה, קובע את גובה הצליל: 262 פעמים בשנייה הן התו דו, ו-523 הן דו גבוה יותר.',
          'The fast switching is done by [[pwm|PWM]]. The [[frequency|frequency]], meaning the number of times per second, sets the pitch: 262 times a second is the note C, and 523 is a higher C.')
      ],
      needs: [B('באזר פסיבי', 'A passive buzzer'), B('שני חוטי גישור', 'Two jumper wires')],
      wiring: [W('+', 'GP13', 17), W('−', 'GND', 18)],
      steps: [
        UNPLUG,
        B('הכניסו את הבאזר למטריצה כך שכל רגל שלו נמצאת בטור נפרד.', 'Push the buzzer into the breadboard with each leg in its own column.'),
        wire('+', 'GP13', 17),
        wire('−', 'GND', 18),
        CHECK
      ],
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'buzzer = PWM(Pin(13))',
        '',
        'for freq in (262, 330, 392, 523):   # C E G C',
        '    buzzer.freq(freq)',
        '    buzzer.duty_u16(32768)          # 50% duty = loudest',
        '    sleep(0.3)',
        '',
        'buzzer.duty_u16(0)                  # silence'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את GP13 כפין PWM, כלומר פין שנדלק ונכבה במהירות.', 'Sets GP13 as a PWM pin, i.e. a pin that switches on and off fast.'),
        E([6], 'זו לולאה שעוברת על ארבעה תדרים, תדר אחד בכל סיבוב. אלה ארבעה תווים.', 'A loop that goes through four frequencies, one per round. These are four notes.'),
        E([7], 'השורה הזו קובעת את התדר, כלומר את גובה הצליל.', 'Sets the frequency, i.e. the pitch.'),
        E([8], 'השורה הזו מפעילה את הצליל. 32768 הוא חצי מ-65535, כלומר הפין דולק חצי מהזמן, וזה נותן את הצליל החזק ביותר.', 'Turns the sound on. 32768 is half of 65535, meaning the pin is on half the time. This gives the loudest sound.'),
        E([9], 'כאן נותנים לתו להישמע 0.3 שניות.', 'Lets the note sound for 0.3 seconds.'),
        E([11], 'השורה הזו משתיקה את הבאזר. 0 פירושו שהפין לא נדלק בכלל.', 'Silences it. 0 means the pin never switches on.')
      ],
      expect: B('נשמעים ארבעה צלילים עולים, ואחריהם שקט. התוכנית הזו מסתיימת מעצמה, כי אין בה לולאה אינסופית.', 'Four rising notes are heard, then silence. This program ends by itself, because it has no endless loop.'),
      mistakes: [
        B('נשמע רק צליל אחד קבוע, או קליק: זה באזר אקטיבי, והוא לא מתאים למנגינות.', 'Only one fixed tone, or a click, is heard: it is an active buzzer. It is not suited to tunes.'),
        B('אין צליל בכלל: בדקו שכל רגל נמצאת בטור אחר, ושה-+ מחובר ל-GP13.', 'No sound at all: check each leg is in a different column and that + goes to GP13.'),
        B('הצליל חלש. זה רגיל בבאזר קטן שמחובר ישירות לפין.', 'The sound is quiet. That is normal for a small buzzer driven straight from a pin.')
      ],
      ideas: [
        B('פעמון דלת עם כפתור.', 'A doorbell with a button.'),
        B('אזעקה שמופעלת על ידי חיישן תנועה.', 'An alarm triggered by a motion sensor.'),
        B('צפצוף קצר שמאשר כל לחיצה על כפתור.', 'A short beep confirming every button press.')
      ]
    },

    /* ------------------------------------------------------------ servo */
    {
      id: 'servo', name: B('מנוע סרבו SG90', 'SG90 servo'), iface: ['pwm'], cat: 'output', volt: '5V',
      summary: B('מנוע קטן שפונה לזווית מדויקת ונשאר בה.', 'A small motor that turns to an exact angle and stays there.'),
      what: [
        B('סרבו הוא מנוע קטן מסוג מיוחד. הוא לא מסתובב בחופשיות כמו מאוורר. במקום זאת, נותנים לו זווית בין 0 ל-180 מעלות, והוא פונה אליה ונשאר בה.',
          'A servo is a small motor of a special kind. It does not spin freely like a fan. Instead you tell it an angle, between 0 and 180 degrees, and it turns to it and stays there.'),
        B('משתמשים בו בכל דבר שצריך לזוז למקום מסוים: מחסום, מחוג, מכסה או זרוע של רובוט.', 'It is used for anything that must move to a particular position: a barrier, a pointer, a lid, a robot arm.')
      ],
      looks: B('קופסה כחולה קטנה עם ציר שעליו מרכיבים זרוע פלסטיק לבנה, ושלושה חוטים, חום, אדום וכתום, שמסתיימים במחבר אחד.',
        'A small blue box with a shaft that takes a white plastic arm, and three wires ending in a single connector: brown, red and orange.'),
      pins: [
        { n: B('חום', 'Brown'), d: B('[[ground|אדמה]].', '[[ground|Ground]].') },
        { n: B('אדום', 'Red'), d: B('הזנה של 5V. מתחבר ל-`VBUS`.', 'Power, 5 V. Connects to `VBUS`.') },
        { n: B('כתום', 'Orange'), d: B('ה[[signal|אות]] שאומר לסרבו לאיזו זווית לפנות. מתחבר לפין של ה-Pico.', 'The [[signal|signal]] that tells the servo which angle to turn to. Connects to a Pico pin.') }
      ],
      how: [
        B('ה-Pico שולח לסרבו 50 [[pulse|פולסים]] בשנייה. הסרבו מודד כמה זמן נמשך כל פולס, ולפי זה הוא יודע את הזווית: פולס של חצי אלפית שנייה הוא 0 מעלות, פולס של אלפית וחצי הוא 90 מעלות, ופולס של שתיים וחצי אלפיות הוא 180 מעלות.',
          'The Pico sends the servo 50 [[pulse|pulses]] a second. The servo measures how long each pulse lasts, and that tells it the angle: a pulse of half a millisecond is 0 degrees, one and a half milliseconds is 90 degrees, and two and a half milliseconds is 180 degrees.'),
        B('את הפולסים מייצר [[pwm|PWM]]. הסרבו צורך הרבה [[current|זרם]] כשהוא זז, ולכן הוא מקבל הזנה מ-`VBUS` ולא מהפין `3V3`.', 'The pulses are produced by [[pwm|PWM]]. The servo draws a lot of [[current|current]] when it moves, which is why it is powered from `VBUS` and not from the `3V3` pin.')
      ],
      needs: [B('סרבו SG90', 'An SG90 servo'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W(B('כתום (אות)', 'Orange (signal)'), 'GP10', 14),
        W(B('אדום (הזנה)', 'Red (power)'), 'VBUS', 40, B('5V מה-USB', '5 V from USB')),
        W(B('חום (אדמה)', 'Brown (ground)'), 'GND', 13)
      ],
      steps: [
        UNPLUG,
        B('הרכיבו את הזרוע הלבנה על הציר של הסרבו, כדי שתוכלו לראות אותו זז.', 'Fit the white arm onto the servo\'s shaft, so you can see it move.'),
        B('הכניסו שלושה חוטי גישור לשלושת החורים שבמחבר של הסרבו.', 'Push three jumper wires into the three holes of the servo\'s connector.'),
        B('חברו את החוט שמול החוט הכתום לפין 14 של ה-Pico, שהוא `GP10`.', 'Connect the wire opposite orange to Pico pin 14, which is `GP10`.'),
        B('חברו את החוט שמול החוט האדום לפין 40, שהוא `VBUS`.', 'Connect the wire opposite red to pin 40, which is `VBUS`.'),
        B('חברו את החוט שמול החוט החום לפין 13, שהוא `GND`.', 'Connect the wire opposite brown to pin 13, which is `GND`.'),
        CHECK
      ],
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'servo = PWM(Pin(10), freq=50)        # one pulse every 20 ms',
        '',
        'def angle(deg):',
        '    # 0.5 ms pulse = 0 deg, 2.5 ms pulse = 180 deg',
        '    servo.duty_ns(500_000 + int(deg / 180 * 2_000_000))',
        '',
        'while True:',
        '    for deg in (0, 90, 180, 90):',
        '        angle(deg)',
        '        sleep(1)'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את GP10 כפין PWM בתדר של 50 פעמים בשנייה, שהוא הקצב שסרבו מצפה לו.', 'Sets GP10 as a PWM pin at 50 times a second, the pace a servo expects.'),
        E([6], 'כאן מוגדרת [[func|פונקציה]] בשם `angle`, שמקבלת זווית במעלות.', 'Defines a [[func|function]] named `angle` that receives an angle in degrees.'),
        E([8], 'השורה הזו מחשבת את אורך הפולס לפי הזווית וקובעת אותו. `duty_ns` מקבל את האורך בננו-שניות, כלומר במיליארדיות שנייה. הקו התחתון בתוך המספר נועד רק להקל על הקריאה: `500_000` הוא 500000.', 'Works out the pulse length from the angle and sets it. `duty_ns` takes the length in nanoseconds, billionths of a second. The underscore inside the number only makes it easier to read: `500_000` is 500000.'),
        E([10, 13], 'בלי סוף: עוברים על ארבע זוויות, פונים לכל אחת מהן וממתינים שנייה.', 'Forever: go through four angles, turn to each, and wait a second.')
      ],
      expect: B('הזרוע עוברת בין ארבעה מצבים, מצב אחד בכל שנייה: 0, 90, 180 ובחזרה ל-90 מעלות.', 'The arm moves between four positions, one per second: 0, 90, 180 and back to 90 degrees.'),
      mistakes: [
        B('הלוח מתנתק או מאתחל את עצמו כשהסרבו זז: הסרבו מקבל הזנה מ-`3V3`. העבירו את החוט האדום ל-`VBUS`.', 'The board disconnects or restarts when the servo moves: the servo is powered from `3V3`. Move the red wire to `VBUS`.'),
        B('הסרבו מזמזם או רועד בקצה: הוא לא מסוגל פיזית להגיע עד לשם. נסו זוויות של 10 ו-170 במקום 0 ו-180.', 'The servo buzzes or shakes at the end: it cannot physically reach that far. Try angles of 10 and 170 instead of 0 and 180.'),
        B('הסרבו לא זז בכלל: בדקו את סדר שלושת החוטים לפי הצבעים.', 'The servo does not move at all: check the order of the three wires against the colours.')
      ],
      ideas: [
        B('מחסום חניה שנפתח בלחיצת כפתור.', 'A car-park barrier that opens at the press of a button.'),
        B('מד עם מחוג שמראה טמפרטורה.', 'A gauge with a pointer that shows temperature.'),
        B('פח שהמכסה שלו נפתח כשמקרבים אליו יד.', 'A bin whose lid opens when a hand comes near.')
      ]
    },

    /* ------------------------------------------------------------ HC-SR04 */
    {
      id: 'hcsr04', name: B('חיישן מרחק HC-SR04', 'HC-SR04 distance sensor'), iface: ['gpio'], cat: 'sensor', volt: '5V', fig: 'divider',
      summary: B('מודד מרחק בלי לגעת, בעזרת צליל שהאוזן לא שומעת.', 'Measures distance without touching, using sound the ear cannot hear.'),
      what: [
        B('HC-SR04 מודד כמה רחוק נמצא העצם שמולו, מ-2 סנטימטרים ועד כ-4 מטרים, בלי לגעת בו. הוא עובד כמו עטלף: משמיע צליל ומקשיב להד.',
          'The HC-SR04 measures how far away the object in front of it is, from 2 centimetres to about 4 metres, without touching it. It works like a bat: it makes a sound and listens for the echo.')
      ],
      looks: B('לוח כחול מלבני עם שני גלילים כסופים שנראים כמו עיניים, וארבעה פינים: VCC, Trig, Echo ו-GND. גליל אחד משדר, והשני קולט.',
        'A rectangular blue board with two silver cylinders that look like eyes, and four pins: VCC, Trig, Echo, GND. One cylinder transmits and the other receives.'),
      pins: [
        { n: 'VCC', d: B('הזנה של 5V. מתחבר ל-`VBUS`.', 'Power, 5 V. Connects to `VBUS`.') },
        { n: 'Trig', d: B('כניסה. [[pulse|פולס]] קצר שנשלח לכאן אומר לחיישן "מדוד עכשיו".', 'An input. A short [[pulse|pulse]] here tells the sensor "measure now".') },
        { n: 'Echo', d: B('יציאה. היא נשארת במצב 1 בדיוק למשך הזמן שלקח להד לחזור. היא מוציאה 5V, ולכן מחברים אותה דרך שני נגדים.', 'An output. It stays at 1 for exactly as long as the echo took to return. It outputs 5 V, which is why it is connected through two resistors.') },
        { n: 'GND', d: B('[[ground|אדמה]].', '[[ground|Ground]].') }
      ],
      how: [
        B('ה-Pico שולח פולס קצר ל-Trig. החיישן משדר צפצוף בתדר גבוה מכדי שהאוזן תשמע אותו, ומעלה את Echo ל-1. כשההד חוזר מהעצם, הוא מוריד את Echo ל-0. ה-Pico מודד כמה זמן Echo היה במצב 1. צליל עובר כ-343 מטרים בשנייה, ולכן לפי הזמן הזה אפשר לדעת כמה רחוק העצם.',
          'The Pico sends a short pulse to Trig. The sensor transmits a beep too high-pitched for the ear, and raises Echo to 1. When the echo returns from the object, it drops Echo to 0. The Pico measures how long Echo stayed at 1. Sound travels about 343 metres a second, so that time tells how far the object is.'),
        B('החיישן עובד ב-5V, והיציאה Echo שלו מוציאה 5V. זה יותר מדי לפין של ה-Pico, ולכן מוסיפים [[divider|מחלק מתח]] משני נגדים, שמוריד את ה-5V לכ-3.3V.',
          'The sensor runs at 5 V, and its Echo output gives 5 V. That is too much for a Pico pin. So a [[divider|voltage divider]] of two resistors is added, bringing the 5 V down to about 3.3 V.')
      ],
      needs: [B('HC-SR04', 'An HC-SR04'), B('נגד 1kΩ (חום, שחור, אדום)', 'A 1 kΩ resistor (brown, black, red)'), B('נגד 2kΩ (אדום, שחור, אדום)', 'A 2 kΩ resistor (red, black, red)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [
        W('VCC', 'VBUS', 40, B('5V', '5 V')),
        W('Trig', 'GP3', 5),
        W('Echo', 'GP2', 4, B('דרך מחלק מתח: נגד 1kΩ בין Echo ל-GP2, ונגד 2kΩ בין GP2 ל-GND', 'through a divider: 1 kΩ from Echo to GP2, and 2 kΩ from GP2 to GND')),
        W('GND', 'GND', 3)
      ],
      steps: [
        UNPLUG,
        seat(4),
        wire('VCC', 'VBUS', 40),
        wire('GND', 'GND', 3),
        wire('Trig', 'GP3', 5),
        B('עכשיו בונים את מחלק המתח. הכניסו רגל אחת של הנגד 1kΩ לטור של `Echo`, ואת הרגל השנייה שלו לטור פנוי. נקרא לטור הפנוי הזה "טור האמצע".', 'Now the voltage divider. Push one leg of the 1 kΩ resistor into the column of `Echo`, and its other leg into a free column. Call that free column the "middle column".'),
        B('הכניסו רגל אחת של הנגד 2kΩ לטור האמצע, ואת הרגל השנייה שלו לטור של `GND` של החיישן.', 'Push one leg of the 2 kΩ resistor into the middle column, and its other leg into the column of the sensor\'s `GND`.'),
        B('חברו חוט גישור מטור האמצע אל פין 4 של ה-Pico, שהוא `GP2`.', 'Connect a jumper wire from the middle column to Pico pin 4, which is `GP2`.'),
        CHECK
      ],
      code: [
        'from machine import Pin, time_pulse_us',
        'from time import sleep, sleep_us',
        '',
        'trig = Pin(3, Pin.OUT)',
        'echo = Pin(2, Pin.IN)',
        '',
        'def distance_cm():',
        '    trig.low()',
        '    sleep_us(2)',
        '    trig.high()',
        '    sleep_us(10)',
        '    trig.low()',
        '    t = time_pulse_us(echo, 1, 30000)   # microseconds, negative on timeout',
        '    if t < 0:',
        '        return None',
        '    return t * 0.0343 / 2               # speed of sound, there and back',
        '',
        'while True:',
        '    print(distance_cm())',
        '    sleep(0.5)'
      ],
      explain: [
        E([4, 5], 'Trig הוא יציאה, כי אנחנו שולחים אליו פולס. Echo הוא כניסה, כי אנחנו קוראים ממנו.', 'Trig is an output, because we send it a pulse. Echo is an input, because we read from it.'),
        E([7], 'כאן מוגדרת פונקציה שמבצעת מדידה אחת ומחזירה את המרחק.', 'Defines a function that makes one measurement and returns the distance.'),
        E([8, 12], 'השורות האלה שולחות ל-Trig פולס של 10 מיליוניות שנייה: מורידות, מעלות, ממתינות ומורידות שוב. `sleep_us` ממתין במיליוניות שנייה.', 'Sends a pulse of 10 millionths of a second to Trig: low, high, wait, low. `sleep_us` waits in millionths of a second.'),
        E([13], 'השורה הזו מודדת כמה זמן Echo נשאר במצב 1, במיליוניות שנייה. אם ההד לא חזר אחרי 30000 מיליוניות שנייה, היא מוותרת ומחזירה מספר שלילי.', 'Measures how long Echo stays at 1, in millionths of a second. If after 30000 millionths no echo has returned, it gives up and a negative number comes back.'),
        E([14, 15], 'אם לא התקבל הד, הפונקציה מחזירה `None`, שפירושו "אין תשובה".', 'If no echo arrived, returns `None`, which means "no answer".'),
        E([16], 'השורה הזו מחשבת את המרחק: צליל עובר 0.0343 סנטימטר במיליונית שנייה. מחלקים ב-2 כי הצליל הלך אל העצם וחזר.', 'Works out the distance: sound travels 0.0343 centimetres in a millionth of a second. Divide by 2 because the sound went to the object and back.'),
        E([18, 20], 'הלולאה מודדת ומדפיסה פעמיים בשנייה.', 'Measures and prints twice a second.')
      ],
      expect: B('פעמיים בשנייה מודפס המרחק בסנטימטרים. קרבו יד לחיישן, והמספר יקטן. כשאין שום דבר בטווח, מודפס None.', 'Twice a second the distance in centimetres is printed. Bring a hand towards the sensor and the number shrinks. When nothing is in range, None is printed.'),
      mistakes: [
        B('תמיד מודפס None: בדקו שהחיישן מקבל 5V מ-`VBUS` ולא 3.3V, ושהחוט ל-GP2 יוצא מטור האמצע.', 'None is always printed: check the sensor gets 5 V from `VBUS` and not 3.3 V, and that the wire to GP2 comes from the middle column.'),
        B('Echo מחובר ישירות לפין, בלי הנגדים. עם הזמן זה עלול להזיק לפין.', 'Echo is connected straight to the pin, without the resistors. This can harm the pin over time.'),
        B('המספרים קופצים: משטח רך, כמו בגד או וילון, בולע את הצליל. נסו למדוד מול קיר או ספר.', 'The numbers jump about: a soft surface, such as clothing or a curtain, absorbs the sound. Try it against a wall or a book.')
      ],
      ideas: [
        B('חיישן חניה שמצפצף מהר יותר ככל שמתקרבים.', 'A parking sensor that beeps faster the closer you get.'),
        B('מד גובה לאנשים, שמותקן מעל הדלת.', 'A height gauge for people, mounted above the door.'),
        B('פח אוטומטי: סרבו פותח את המכסה כשיד מתקרבת.', 'An automatic bin: a servo opens the lid when a hand approaches.')
      ]
    },

    /* ------------------------------------------------------------ PIR */
    {
      id: 'pir', name: B('חיישן תנועה PIR', 'PIR motion sensor'), iface: ['gpio'], cat: 'sensor', volt: '5V',
      summary: B('מרגיש כשאדם או בעל חיים זזים בקרבתו.', 'Senses when a person or animal moves nearby.'),
      what: [
        B('חיישן PIR מרגיש כשאדם או בעל חיים זזים בקרבתו. זה אותו חיישן שמדליק את האור בחדר המדרגות כשמישהו נכנס.',
          'A PIR sensor senses when a person or animal moves nearby. It is the same sensor that switches on a stairwell light when someone walks in.')
      ],
      looks: B('לוח קטן עם כיפה לבנה חלבית, שלושה פינים, ובדרך כלל גם שני ברגים כתומים קטנים. הברגים מכווננים את הרגישות ואת משך הזמן שבו היציאה נשארת דולקת.',
        'A small board with a milky white dome, three pins, and usually two small orange screws. The screws adjust the sensitivity and how long the output stays on.'),
      pins: [
        { n: 'VCC', d: B('הזנה של 5V. מתחבר ל-`VBUS`.', 'Power, 5 V. Connects to `VBUS`.') },
        { n: 'OUT', d: B('היציאה: 1 כשיש תנועה, ו-0 כשאין. המתח עליה הוא 3.3V, ולכן בטוח לחבר אותה ישירות לפין.', 'The output. 1 when there is motion, 0 when there is none. Its voltage is 3.3 V, so it is safe to connect straight to a pin.') },
        { n: 'GND', d: B('[[ground|אדמה]].', '[[ground|Ground]].') }
      ],
      how: [
        B('כל גוף חם פולט קרינת חום שהעין לא רואה, והחיישן שמתחת לכיפה מרגיש אותה. כשכמות החום שמולו משתנה פתאום, כלומר כשמשהו חם זז, הוא מעלה את היציאה OUT ל-1 למשך כמה שניות.',
          'Every warm body gives off heat radiation the eye cannot see. The sensor under the dome senses it. When the amount of heat in front of it changes suddenly, meaning something warm moved, it raises the OUT output to 1 for a few seconds.'),
        B('הקוד משתמש ב[[interrupt|פסיקה]]: במקום לבדוק את הפין שוב ושוב, מבקשים מה-Pico להפעיל פונקציה ברגע שהפין משתנה.', 'The code uses an [[interrupt|interrupt]]: instead of checking the pin over and over, you ask the Pico to run a function the moment the pin changes.')
      ],
      needs: [B('חיישן PIR מדגם HC-SR501', 'An HC-SR501 PIR sensor'), B('שלושה חוטי גישור עם קצה נקבה, שמתלבשים על הפינים של החיישן', 'Three jumper wires with a female end, which slide onto the sensor\'s pins')],
      wiring: [
        W('VCC', 'VBUS', 40, B('5V', '5 V')),
        W('OUT', 'GP22', 29),
        W('GND', 'GND', 28)
      ],
      steps: [
        UNPLUG,
        B('הפינים של החיישן נמצאים מתחת ללוח שלו, ולכן לא מכניסים אותו למטריצה. הלבישו על כל פין חוט גישור עם קצה נקבה. שמות הפינים מודפסים על הלוח, ולפעמים הם מסתתרים מתחת לכיפה.', 'The sensor\'s pins are underneath its board, so it is not pushed into the breadboard. Slide a jumper wire with a female end onto each pin. The pin names are printed on the board, sometimes under the dome.'),
        B('חברו את החוט של `VCC` לפין 40 של ה-Pico, שהוא `VBUS`.', 'Connect the `VCC` wire to Pico pin 40, which is `VBUS`.'),
        B('חברו את החוט של `OUT` לפין 29, שהוא `GP22`.', 'Connect the `OUT` wire to pin 29, which is `GP22`.'),
        B('חברו את החוט של `GND` לפין 28, שהוא `GND`.', 'Connect the `GND` wire to pin 28, which is `GND`.'),
        CHECK,
        B('אחרי החיבור, המתינו כדקה בלי לזוז מול החיישן. הוא צריך זמן כדי להתייצב.', 'After connecting, wait about a minute without moving in front of the sensor. It needs time to settle.')
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'pir = Pin(22, Pin.IN)',
        '',
        'def on_motion(pin):',
        '    print("motion!")',
        '',
        '# Call on_motion every time the pin goes from 0 to 1',
        'pir.irq(trigger=Pin.IRQ_RISING, handler=on_motion)',
        '',
        'while True:',
        '    sleep(1)             # the main program is free to do other work'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את GP22 ככניסה. אין צורך בנגד משיכה, כי החיישן תמיד מוציא 0 או 1 ברורים.', 'GP22 is an input. No pull-up is needed, because the sensor always outputs a clear 0 or 1.'),
        E([6, 7], 'כאן מוגדרת פונקציה שתופעל כשיש תנועה. בשלב הזה היא רק מוגדרת, ועדיין לא רצה.', 'Defines a function to be run when there is motion. For now it is only defined, it has not run yet.'),
        E([10], 'השורה הזו מבקשת מה-Pico: "בכל פעם שהפין עולה מ-0 ל-1, הפעל את `on_motion`". `IRQ_RISING` פירושו "בעלייה".', 'Asks the Pico: "every time the pin rises from 0 to 1, run `on_motion`". `IRQ_RISING` means "on the rise".'),
        E([12, 13], 'התוכנית הראשית לא צריכה לבדוק שום דבר. היא פשוט ממשיכה לרוץ, וה-Pico עוצר אותה לרגע כשיש תנועה.', 'The main program has nothing to check. It just keeps running, and the Pico interrupts it for a moment when there is motion.')
      ],
      expect: B('אחרי דקת ההתייצבות, בכל פעם שמזיזים יד מול החיישן מודפס motion!. אחרי כל זיהוי יש הפסקה של כמה שניות לפני שהחיישן יכול לזהות שוב.', 'After the settling minute, every time you move a hand in front of the sensor, motion! is printed. After each detection there is a pause of a few seconds before it detects again.'),
      mistakes: [
        B('מודפס motion! למרות שאף אחד לא זז: החיישן עוד לא התייצב. המתינו דקה.', 'motion! prints with nobody moving: the sensor has not settled yet. Wait a minute.'),
        B('אין זיהוי בכלל: בדקו ש-`VCC` מחובר ל-`VBUS` ולא ל-`3V3`.', 'No detection at all: check `VCC` is on `VBUS` and not on `3V3`.'),
        B('הזיהוי איטי או נמשך זמן רב: סובבו בעדינות את הברגים הכתומים.', 'Detection is slow or lasts a long time: gently turn the orange screws.')
      ],
      ideas: [
        B('אזעקה: באזר שמצפצף כשמישהו נכנס לחדר.', 'An alarm: a buzzer that sounds when someone enters the room.'),
        B('תאורה אוטומטית: לד או פס לדים שנדלקים לחצי דקה.', 'An automatic light: an LED or LED strip that comes on for half a minute.'),
        B('מונה שסופר כמה פעמים עברו אנשים במסדרון.', 'A counter of how many times someone passed along the corridor.')
      ]
    }
  ];

  P.componentById = function (id) {
    for (var i = 0; i < P.components.length; i++) if (P.components[i].id === id) return P.components[i];
    return null;
  };

  P.categories = {
    input: B('קלט', 'Input'),
    output: B('פלט', 'Output'),
    sensor: B('חיישן', 'Sensor'),
    display: B('תצוגה', 'Display'),
    storage: B('אחסון', 'Storage')
  };
})(window.PICO);
