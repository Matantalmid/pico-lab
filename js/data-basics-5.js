/* Basics, chapters 16 to 20: the engineering skills a first-year student needs and the lessons take for granted.
   Transistors, diodes and capacitors; state machines; reading a datasheet; writing your own module;
   a project that runs by itself for a long time (boot.py, the watchdog, memory).
   Same block types as data-basics.js. Quizzes may use the newer question kinds of quiz.js. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };
  var OUT = function (q, code, answer, why) { return { type: 'output', q: q, code: code, answer: answer, why: why }; };
  var FILL = function (q, code, a, ok, why) { return { type: 'fill', q: q, code: code, a: a, ok: ok, why: why }; };
  var G = function (cat, he, en, dHe, dEn) { return { cat: cat, t: { he: he, en: en }, d: { he: dHe, en: dEn } }; };

  P.glossary.transistor = G('hw', 'טרנזיסטור', 'Transistor',
    'מתג אלקטרוני בלי חלקים זזים. זרם קטן שנכנס לבסיס מאפשר לזרם גדול לעבור בין הקולט לפולט. כך פין של ה-Pico יכול להפעיל עומס שהוא לא היה מסוגל להזין לבד.',
    'An electronic switch with no moving parts. A small current into the base lets a large current flow between the collector and the emitter. That way a Pico pin can switch a load it could never feed by itself.');
  P.glossary.diode = G('hw', 'דיודה', 'Diode',
    'רכיב שמעביר זרם רק בכיוון אחד. הפס שעל הדיודה מסמן את הקתודה, הצד שאליו הזרם יוצא. גם לד הוא סוג של דיודה.',
    'A part that lets current through in one direction only. The stripe on a diode marks the cathode, the side the current leaves from. An LED is a kind of diode too.');
  P.glossary.capacitor = G('hw', 'קבל', 'Capacitor',
    'רכיב שאוגר מטען חשמלי לזמן קצר ומשחרר אותו כשצריך. קבל ליד ספק או מנוע ממלא ירידות קצרות במתח. בקבל אלקטרוליטי יש קוטביות: הפס מסמן את המינוס.',
    'A part that stores electric charge for a short time and releases it when needed. A capacitor next to a supply or a motor fills in short dips in the voltage. An electrolytic capacitor has a polarity: the stripe marks the minus.');
  P.glossary.statemachine = G('sw', 'מכונת מצבים', 'State machine',
    'דרך לכתוב תוכנית שבכל רגע נמצאת במצב אחד מתוך רשימה קבועה. כל מצב קובע מה עושים עכשיו, ואילו אירועים מעבירים למצב אחר.',
    'A way of writing a program that is in exactly one state from a fixed list at any moment. Each state says what to do now, and which events move to another state.');
  P.glossary.datasheet = G('hw', 'דף נתונים (datasheet)', 'Datasheet',
    'המסמך של היצרן על רכיב: פינים, מתחים מותרים, כתובת, פקודות ונוסחאות. כשהאתר לא מכסה רכיב, דף הנתונים הוא המקור.',
    'The maker\'s document about a part: pins, allowed voltages, address, commands and formulas. When the site does not cover a part, the datasheet is the source.');
  P.glossary.classobj = G('sw', 'מחלקה (class)', 'Class',
    'תבנית ב-Python שמאגדת נתונים ופונקציות יחד. מכל מחלקה יוצרים עצמים, ולכל עצם יש ערכים משלו. רוב ספריות הרכיבים בנויות כמחלקה.',
    'A Python template that groups data and functions together. From a class you create objects, and each object has its own values. Most part libraries are built as a class.');
  P.glossary.watchdog = G('sw', 'כלב שמירה (watchdog)', 'Watchdog',
    'טיימר בתוך השבב שמאפס את הלוח אם התוכנית לא "מאכילה" אותו בזמן. כך תוכנית שנתקעה מתחילה מחדש לבד.',
    'A timer inside the chip that resets the board if the program does not "feed" it in time. That way a program that got stuck starts again by itself.');

  P.basics.push(
    /* ------------------------------------------------------------ transistors, diodes, capacitors */
    {
      id: 'semis',
      title: B('טרנזיסטור, דיודה וקבל', 'Transistor, diode and capacitor'),
      lead: B('שלושה רכיבים קטנים שמופיעים כמעט בכל מעגל אמיתי, גם בתוך המודולים שהאתר משתמש בהם. הפרק מסביר מה כל אחד עושה, ולמה המעגלים של הממסר, המנוע והסרבו בנויים כמו שהם בנויים.', 'Three small parts that appear in almost every real circuit, including inside the modules the site uses. This chapter explains what each one does, and why the relay, motor and servo circuits are built the way they are.'),
      blocks: [
        { h: B('הבעיה: פין חלש מדי', 'The problem: a pin is too weak') },
        { p: B('פין של ה-Pico נותן כמה מיליאמפר בלבד, ב-3.3V. זה מספיק ללד עם נגד, אבל מנוע, ממסר או פס לדים צריכים מאות מיליאמפר, ולפעמים מתח גבוה יותר. כשמחברים אותם ישר לפין, הלוח מתאפס או שהפין נשרף.', 'A Pico pin gives only a few milliamps, at 3.3 V. That is enough for an LED with a resistor, but a motor, a relay or an LED strip needs hundreds of milliamps, and sometimes a higher voltage. Connected straight to a pin, they reset the board or burn out the pin.') },
        { h: B('[[transistor|טרנזיסטור]]: מתג שהפין לוחץ עליו', 'The [[transistor|transistor]]: a switch the pin presses') },
        { p: B('לטרנזיסטור NPN, כמו 2N2222, יש שלוש רגליים: בסיס, קולט ופולט. הפין שולח זרם קטן לבסיס דרך נגד, והטרנזיסטור נפתח ומעביר זרם גדול מהעומס אל האדמה. העומס מקבל את החשמל שלו ממקור אחר, למשל מ-5V, ולא מהפין.', 'An NPN transistor such as the 2N2222 has three legs: base, collector and emitter. The pin sends a small current into the base through a resistor, and the transistor opens and passes a large current from the load to ground. The load gets its power from another source, for example 5 V, not from the pin.') },
        { ul: [
          B('הפין מתחבר לבסיס דרך נגד של 1kΩ. בלי הנגד עובר זרם גדול מדי, והפין והטרנזיסטור עלולים להישרף.', 'The pin goes to the base through a 1 kΩ resistor. Without it too much current flows, and the pin and the transistor can burn out.'),
          B('הפולט מתחבר לאדמה, והאדמה הזו משותפת ל-Pico ולמקור של העומס.', 'The emitter goes to ground, and that ground is shared by the Pico and by the load\'s supply.'),
          B('העומס מחובר בין הפלוס של המקור שלו לבין הקולט.', 'The load is connected between the plus of its supply and the collector.'),
          B('בקוד זה פין רגיל: `on()` מדליק את העומס, ו-`off()` מכבה אותו. אפשר גם `PWM`, כדי לשלוט בעוצמה.', 'In code it is an ordinary pin: `on()` switches the load on and `off()` switches it off. `PWM` also works, to control the strength.')
        ] },
        { p: B('כמה זרם נכנס לבסיס? בטרנזיסטור יש ירידת מתח של כ-0.7V, ולכן על הנגד נשארים בערך 3.3 − 0.7 = 2.6V, ודרך 1kΩ עוברים כ-2.6 מיליאמפר. טרנזיסטור כזה מגביר את הזרם בערך פי 100, וזה מספיק לעומס של כמה מאות מיליאמפר.', 'How much current goes into the base? The transistor drops about 0.7 V, so about 3.3 − 0.7 = 2.6 V is left across the resistor, and about 2.6 milliamps flow through 1 kΩ. Such a transistor amplifies the current about 100 times, which is enough for a load of a few hundred milliamps.') },
        { tip: B('מודול ה-MOSFET שבשיעור H1 עושה את אותה עבודה בדיוק, רק לעומסים גדולים יותר. גם על מודול הממסר יש טרנזיסטור קטן שמפעיל את הסליל.', 'The MOSFET module in lesson H1 does exactly the same job, for bigger loads. The relay module also has a small transistor on it that drives the coil.') },
        { h: B('[[diode|דיודה]]: זרם בכיוון אחד', 'The [[diode|diode]]: current one way') },
        { p: B('דיודה מעבירה זרם רק מהאנודה לקתודה, והפס שעליה מסמן את הקתודה. השימוש החשוב שלה ליד מיקרו-בקר הוא הגנה: סליל של ממסר או מנוע אוגר אנרגיה, וברגע שמנתקים אותו הוא יוצר קפיצת מתח הפוכה וחדה, שיכולה להרוס את הטרנזיסטור.', 'A diode passes current only from the anode to the cathode, and its stripe marks the cathode. Its important use next to a microcontroller is protection: the coil of a relay or a motor stores energy, and the moment it is switched off it makes a sharp reverse voltage spike that can destroy the transistor.') },
        { p: B('הפתרון הוא דיודה (למשל 1N4007) שמחוברת במקביל לסליל, הפוך: הפס לכיוון הפלוס. בזמן רגיל היא לא מעבירה כלום, וברגע הניתוק היא נותנת לקפיצה מסלול סגור ובטוח. במודולי ממסר הדיודה כבר מורכבת על הלוח, וזו אחת הסיבות להשתמש במודול ולא בממסר בודד.', 'The fix is a diode (for example a 1N4007) connected across the coil, the wrong way round: stripe towards the plus. Normally it passes nothing, and at the moment of switching off it gives the spike a closed, safe path. On relay modules the diode is already fitted, which is one reason to use a module rather than a bare relay.') },
        { h: B('[[capacitor|קבל]]: מאגר קטן של חשמל', 'The [[capacitor|capacitor]]: a small store of electricity') },
        { p: B('קבל נטען ונפרק מהר מאוד. כשמנוע או סרבו מתחילים לזוז, הם מושכים זרם גדול לרגע, והמתח יורד. קבל ליד ההזנה ממלא את הירידה הקצרה, וה-Pico לא מתאפס.', 'A capacitor charges and discharges very fast. When a motor or servo starts to move it draws a large current for a moment, and the voltage drops. A capacitor next to the supply fills in the short dip, and the Pico does not reset.') },
        { table: {
          head: [B('קבל', 'Capacitor'), B('ערך טיפוסי', 'Typical value'), B('איפה שמים אותו', 'Where it goes')],
          rows: [
            [B('קרמי (קטן, בלי קוטביות)', 'Ceramic (small, no polarity)'), B('100nF', '100 nF'), B('צמוד לפיני ההזנה של שבב או מודול, כדי לסנן רעש מהיר', 'Right at the supply pins of a chip or module, to filter fast noise')],
            [B('אלקטרוליטי (גלילי, עם קוטביות)', 'Electrolytic (cylinder, with polarity)'), B('100µF עד 470µF', '100 µF to 470 µF'), B('בין הפלוס למינוס של ההזנה של מנוע או סרבו', 'Between the plus and minus of a motor\'s or servo\'s supply')]
          ]
        } },
        { tip: B('קבל אלקטרוליטי הפוך עלול להתנפח ולהתפוצץ. הפס שעל הגליל מסמן את המינוס, והרגל הקצרה היא המינוס.', 'An electrolytic capacitor put in backwards can swell and burst. The stripe on the cylinder marks the minus, and the short leg is the minus.') }
      ],
      quiz: [
        OUT(B('כמה מיליאמפר נכנסים לבסיס של הטרנזיסטור, דרך נגד של 1kΩ?', 'How many milliamps go into the transistor\'s base, through a 1 kΩ resistor?'),
          ['volts = 3.3 - 0.7          # the transistor drops about 0.7 V', 'ma = volts / 1000 * 1000    # amps to milliamps', 'print(round(ma, 1))'], '2.6',
          B('לפי חוק אוהם, 2.6V חלקי 1000Ω הם 0.0026 אמפר, כלומר 2.6 מיליאמפר.', 'By Ohm\'s law, 2.6 V over 1000 Ω is 0.0026 amps, that is 2.6 milliamps.')),
        Q(B('למה לא מחברים מנוע קטן ישר לפין, אלא דרך טרנזיסטור?', 'Why is a small motor not wired straight to a pin, but through a transistor?'),
          [B('המנוע צריך הרבה יותר זרם ממה שפין מסוגל לתת', 'The motor needs far more current than a pin can give'), B('המנוע עובד רק עם PWM', 'The motor works only with PWM'), B('הטרנזיסטור הופך את כיוון הסיבוב', 'The transistor reverses the direction')], 0,
          B('פין נותן כמה מיליאמפר, ומנוע צריך מאות. הטרנזיסטור מעביר את הזרם הגדול מהמקור של המנוע, והפין רק שולט בו.', 'A pin gives a few milliamps, and a motor needs hundreds. The transistor passes the big current from the motor\'s own supply, and the pin only controls it.')),
        Q(B('איך מחברים את דיודת ההגנה ליד סליל של ממסר?', 'How is the protection diode connected next to a relay coil?'),
          [B('במקביל לסליל, והפס לכיוון הפלוס', 'Across the coil, with the stripe towards the plus'), B('בטור עם הסליל, והפס לכיוון המינוס', 'In series with the coil, stripe towards the minus'), B('בין הפין של ה-Pico לבסיס', 'Between the Pico pin and the base')], 0,
          B('כך הדיודה לא מעבירה זרם בזמן רגיל, ורק ברגע הניתוק היא נותנת לקפיצת המתח מסלול סגור.', 'That way the diode passes no current normally, and only at the moment of switching off does it give the voltage spike a closed path.'))
      ]
    },
    /* ------------------------------------------------------------ state machines */
    {
      id: 'states',
      title: B('מכונת מצבים: תוכנית שזוכרת איפה היא', 'State machines: a program that knows where it is'),
      lead: B('כשפרויקט גדל, מצטברים בו משתנים כמו `blinking`, `waiting` ו-`menu_open`, ותנאים שבודקים את כולם יחד. [[statemachine|מכונת מצבים]] מסדרת את זה: בכל רגע התוכנית נמצאת במצב אחד בלבד, ולכל מצב יש כללים משלו.', 'As a project grows, it collects variables such as `blinking`, `waiting` and `menu_open`, and conditions that test all of them together. A [[statemachine|state machine]] tidies this up: at any moment the program is in exactly one state, and each state has its own rules.'),
      blocks: [
        { h: B('שלושה מושגים', 'Three ideas') },
        { ul: [
          B('מצב: מה המערכת עושה עכשיו. למשל "כבוי", "דולק" או "מהבהב".', 'State: what the system is doing now. For example "off", "on" or "blinking".'),
          B('אירוע: משהו שקורה. למשל לחיצה, זמן שעבר או מדידה שעברה סף.', 'Event: something that happens. For example a press, time passing, or a reading crossing a threshold.'),
          B('מעבר: איזה אירוע, באיזה מצב, מעביר לאיזה מצב חדש.', 'Transition: which event, in which state, moves to which new state.')
        ] },
        { p: B('לפני שכותבים קוד, כותבים את המצבים והמעברים בטבלה או מציירים אותם בעיגולים וחיצים. אם הטבלה ברורה, הקוד כמעט נכתב לבד.', 'Before writing code, write the states and transitions in a table, or draw them as circles and arrows. If the table is clear, the code almost writes itself.') },
        { h: B('דוגמה: לד עם שלושה מצבים', 'An example: an LED with three states') },
        { p: B('המעגל של שיעור A3: לד על GP15 וכפתור על GP14. כל לחיצה מעבירה למצב הבא: כבוי, דולק, מהבהב, ושוב כבוי.', 'The circuit of lesson A3: an LED on GP15 and a button on GP14. Each press moves to the next state: off, on, blinking, and off again.') },
        { table: {
          head: [B('מצב', 'State'), B('מה עושים בו', 'What it does'), B('לחיצה מעבירה אל', 'A press moves to')],
          rows: [
            [B('`OFF`', '`OFF`'), B('הלד כבוי', 'The LED is off'), B('`ON`', '`ON`')],
            [B('`ON`', '`ON`'), B('הלד דולק', 'The LED is on'), B('`BLINK`', '`BLINK`')],
            [B('`BLINK`', '`BLINK`'), B('הלד מתחלף כל רבע שנייה', 'The LED switches every quarter second'), B('`OFF`', '`OFF`')]
          ]
        } },
        { code: [
          'from machine import Pin',
          'from time import ticks_ms, ticks_diff, sleep_ms',
          '',
          'led = Pin(15, Pin.OUT)',
          'button = Pin(14, Pin.IN, Pin.PULL_UP)',
          '',
          'OFF, ON, BLINK = 0, 1, 2',
          'state = OFF',
          'last = 1',
          'blink_at = ticks_ms()',
          '',
          'while True:',
          '    now = button.value()',
          '    pressed = last == 1 and now == 0',
          '    last = now',
          '',
          '    if state == OFF:',
          '        led.off()',
          '        if pressed:',
          '            state = ON',
          '    elif state == ON:',
          '        led.on()',
          '        if pressed:',
          '            state = BLINK',
          '    elif state == BLINK:',
          '        if ticks_diff(ticks_ms(), blink_at) >= 250:',
          '            led.toggle()',
          '            blink_at = ticks_ms()',
          '        if pressed:',
          '            state = OFF',
          '    sleep_ms(20)               # also filters out bounce'
        ], explain: [
          { l: [7, 8], t: B('שמות למצבים, והמצב שבו מתחילים. משתנה אחד, `state`, זוכר איפה התוכנית נמצאת.', 'Names for the states, and the state to start in. One variable, `state`, remembers where the program is.') },
          { l: [13, 15], t: B('זיהוי רגע הלחיצה, כמו בשיעור A4. התוצאה היא אירוע: `pressed` הוא `True` רק בסיבוב שבו הכפתור נלחץ.', 'Catching the moment of the press, as in lesson A4. The result is an event: `pressed` is `True` only on the round where the button went down.') },
          { l: [17, 30], t: B('כל מצב הוא ענף אחד. בתוכו עושים את מה שהמצב עושה, ובודקים רק את האירועים שחשובים לו. המצב מהבהב בלי `sleep` ארוך, ולכן הכפתור נשאר רגיש.', 'Each state is one branch. Inside it, do what the state does and check only the events that matter to it. The blinking state blinks without a long `sleep`, so the button stays responsive.') }
        ] },
        { tip: B('כדי להוסיף מצב, מוסיפים שורה לטבלה וענף אחד לקוד. שאר המצבים לא משתנים, ולכן קשה לשבור משהו שכבר עבד.', 'To add a state, add one row to the table and one branch to the code. The other states do not change, so it is hard to break something that already worked.') }
      ],
      quiz: [
        OUT(B('התוכנית מתחילה ב-OFF, וכל לחיצה מעבירה למצב הבא. באיזה מצב היא תהיה אחרי 4 לחיצות?', 'The program starts in OFF, and each press moves to the next state. Which state is it in after 4 presses?'),
          ['state = "OFF"', 'for press in range(4):', '    if state == "OFF":', '        state = "ON"', '    elif state == "ON":', '        state = "BLINK"', '    else:', '        state = "OFF"', 'print(state)'], 'ON',
          B('OFF, ON, BLINK, OFF, ON: אחרי שלוש לחיצות המחזור חוזר להתחלה, והלחיצה הרביעית מעבירה ל-ON.', 'OFF, ON, BLINK, OFF, ON: after three presses the cycle is back at the start, and the fourth press moves to ON.')),
        Q(B('מה היתרון של מכונת מצבים על פני הרבה משתנים מסוג True/False?', 'What is the advantage of a state machine over many True/False variables?'),
          [B('יש מצב אחד בלבד בכל רגע, ולכן אין צירופים סותרים כמו "מהבהב וגם כבוי"', 'There is only one state at a time, so there are no contradictory mixes such as "blinking and also off"'), B('היא רצה מהר יותר', 'It runs faster'), B('היא חוסכת זיכרון', 'It saves memory')], 0,
          B('עם הרבה דגלים אפשר להגיע לצירופים שאף אחד לא תכנן. משתנה מצב אחד מונע את זה.', 'With many flags you can reach combinations nobody planned. A single state variable prevents that.')),
        Q(B('במצב BLINK, למה לא כותבים `sleep(0.25)` במקום `ticks_diff`?', 'In the BLINK state, why not write `sleep(0.25)` instead of `ticks_diff`?'),
          [B('`sleep` חוסם, ולחיצה קצרה בזמן ההמתנה עלולה ללכת לאיבוד', '`sleep` blocks, and a short press during the wait may be lost'), B('`sleep` לא עובד בתוך `if`', '`sleep` does not work inside an `if`'), B('אין הבדל', 'There is no difference')], 0,
          B('כמו בשיעור R1: מדידת זמן במקום המתנה משאירה את הלולאה מהירה, וכל אירוע נקלט.', 'As in lesson R1: measuring time instead of waiting keeps the loop fast, so every event is caught.'))
      ]
    },
    /* ------------------------------------------------------------ reading a datasheet */
    {
      id: 'datasheet',
      title: B('איך קוראים דף נתונים', 'How to read a datasheet'),
      lead: B('לכל רכיב יש [[datasheet|דף נתונים]] מהיצרן. הוא נראה מאיים, עשרות עמודים באנגלית טכנית, אבל לפרויקט צריך בדרך כלל רק חמישה דברים ממנו. הפרק עובר עליהם עם חיישן הטמפרטורה והלחות AHT20.', 'Every part has a [[datasheet|datasheet]] from its maker. It looks daunting, dozens of pages of technical English, but a project usually needs only five things from it. This chapter goes through them with the AHT20 temperature and humidity sensor.'),
      blocks: [
        { h: B('איפה מוצאים אותו', 'Where to find it') },
        { p: B('מחפשים ברשת את שם הדגם ואת המילה datasheet, למשל "AHT20 datasheet". עדיף את המסמך של היצרן של השבב, ולא דף של חנות. במודולים, כמו לוח קטן עם חיישן, יש שני דברים נפרדים: דף הנתונים של השבב, והחיווט של הלוח הקטן.', 'Search the web for the model name and the word datasheet, for example "AHT20 datasheet". Prefer the chip maker\'s document over a shop page. With modules, such as a small board carrying a sensor, there are two separate things: the chip\'s datasheet, and the small board\'s wiring.') },
        { h: B('חמשת הדברים שמחפשים', 'The five things to look for') },
        { table: {
          head: [B('מה מחפשים', 'What to look for'), B('איפה זה בדרך כלל', 'Where it usually is'), B('ב-AHT20', 'On the AHT20')],
          rows: [
            [B('מתח הפעלה', 'Supply voltage'), B('Electrical characteristics', 'Electrical characteristics'), B('בערך 2.2V עד 5.5V. אפשר לחבר ל-3V3', 'About 2.2 V to 5.5 V. It can go on 3V3')],
            [B('ערכים מרביים: מה הורס את הרכיב', 'Absolute maximum ratings: what destroys the part'), B('Absolute maximum ratings', 'Absolute maximum ratings'), B('לא לעבור את המתח המרבי, גם לא לרגע', 'Never exceed the maximum voltage, not even for a moment')],
            [B('הפינים', 'The pins'), B('Pin description / Pinout', 'Pin description / Pinout'), B('VDD, GND, SDA ו-SCL', 'VDD, GND, SDA and SCL')],
            [B('הממשק והכתובת', 'The interface and address'), B('Interface / Communication', 'Interface / Communication'), B('I2C, כתובת 0x38', 'I2C, address 0x38')],
            [B('הפקודות והנוסחאות', 'The commands and formulas'), B('Measurement / Signal conversion', 'Measurement / Signal conversion'), B('פקודת מדידה, המתנה של 80 אלפיות, ושתי נוסחאות', 'A measure command, an 80-millisecond wait, and two formulas')]
          ]
        } },
        { tip: B('ההבדל החשוב בטבלה: "ערכים מרביים" הם הגבול שמעבר לו הרכיב נהרס. "מאפיינים חשמליים" הם התנאים שבהם הוא עובד כמו שכתוב. מתכננים לפי המאפיינים, ולעולם לא מתקרבים לערכים המרביים.', 'The important difference in the table: "absolute maximum ratings" are the limit beyond which the part is destroyed. "Electrical characteristics" are the conditions under which it works as described. Design to the characteristics, and never go near the maximum ratings.') },
        { h: B('מהדף לקוד', 'From the page to the code') },
        { p: B('בפרק המדידה של AHT20 כתוב: שלחו את הבתים 0xAC, 0x33, 0x00; חכו 80 אלפיות שנייה; קראו 6 בתים. הלחות היא 20 ביטים, והטמפרטורה היא 20 הביטים שאחריה. כך זה נראה בקוד:', 'The AHT20\'s measurement section says: send the bytes 0xAC, 0x33, 0x00; wait 80 milliseconds; read 6 bytes. Humidity is 20 bits, and temperature is the 20 bits after it. This is how it looks in code:') },
        { code: [
          'from machine import Pin, I2C',
          'from time import sleep_ms',
          '',
          'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
          'ADDR = 0x38                                  # "I2C address: 0x38"',
          '',
          'i2c.writeto(ADDR, bytes([0xAC, 0x33, 0x00]))  # "trigger measurement"',
          'sleep_ms(80)                                 # "wait at least 80 ms"',
          'd = i2c.readfrom(ADDR, 6)                    # "read 6 bytes"',
          '',
          'hum_raw = (d[1] << 12) | (d[2] << 4) | (d[3] >> 4)',
          'temp_raw = ((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]',
          'print("humidity:", hum_raw * 100 / 1048576, "%")',
          'print("temperature:", temp_raw * 200 / 1048576 - 50, "C")'
        ], explain: [
          { l: [5], t: B('הכתובת שכתובה בפרק הממשק. אותו מספר שהסריקה `i2c.scan()` מחזירה.', 'The address from the interface section. The same number `i2c.scan()` returns.') },
          { l: [7, 9], t: B('שלוש השורות האלה הן בדיוק שלושת הצעדים שבדף: פקודה, המתנה וקריאה.', 'These three lines are exactly the three steps on the page: a command, a wait and a read.') },
          { l: [11, 12], t: B('הדף מצייר איך 40 הביטים מחולקים בין הבתים. `<<` מזיז ביטים שמאלה, `>>` ימינה, ו-`|` מחבר. הפרק "ביטים, בתים ומספרים" מסביר את הסימנים האלה.', 'The page draws how the 40 bits are split across the bytes. `<<` shifts bits left, `>>` right, and `|` joins them. The chapter "Bits, bytes and numbers" explains these signs.') },
          { l: [13, 14], t: B('שתי הנוסחאות מהדף. 1048576 הוא 2 בחזקת 20, הערך הגבוה ביותר של 20 ביטים.', 'The two formulas from the page. 1048576 is 2 to the power of 20, the highest value of 20 bits.') }
        ] },
        { p: B('בעמוד של AHT20 בקטלוג יש גרסה מלאה של הקוד הזה, עם פקודת הכיול שהדף מבקש לשלוח אחרי ההדלקה.', 'The AHT20\'s catalog page has a full version of this code, with the calibration command the page asks for after power-up.') },
        { tip: B('אם הדף של הרכיב שבידכם שונה מהדוגמה, הדף שלכם קובע. יצרנים שונים מוכרים שבבים דומים עם פרטים שונים.', 'If the datasheet of the part in your hand differs from this example, your datasheet wins. Different makers sell similar chips with different details.') }
      ],
      quiz: [
        Q(B('מה המשמעות של "absolute maximum ratings"?', 'What do "absolute maximum ratings" mean?'),
          [B('הגבול שמעבר לו הרכיב עלול להיהרס', 'The limit beyond which the part may be destroyed'), B('הערכים המומלצים לעבודה רגילה', 'The recommended values for normal use'), B('המהירות הגבוהה ביותר של הממשק', 'The highest speed of the interface')], 0,
          B('מתכננים לפי המאפיינים החשמליים, ושומרים מרחק מהערכים המרביים.', 'Design to the electrical characteristics, and keep well away from the maximum ratings.')),
        OUT(B('הדף כותב את הכתובת בבסיס 16. מה מדפיסה השורה?', 'The page writes the address in base 16. What does this line print?'),
          ['print(hex(56))'], '0x38',
          B('56 בבסיס 10 הוא 0x38 בבסיס 16, הכתובת של AHT20.', '56 in base 10 is 0x38 in base 16, the AHT20\'s address.')),
        Q(B('לפי הדף צריך לחכות 80 אלפיות שנייה אחרי פקודת המדידה. מה יקרה אם קוראים מיד?', 'The page says to wait 80 milliseconds after the measure command. What happens if you read at once?'),
          [B('המדידה עוד לא הסתיימה, והערכים שגויים או ישנים', 'The measurement has not finished yet, and the values are wrong or stale'), B('החיישן נשרף', 'The sensor burns out'), B('שום דבר, ההמתנה היא רק המלצה', 'Nothing, the wait is only a suggestion')], 0,
          B('זמני המתנה בדף הם הזמן שהשבב צריך כדי לעבוד. קריאה מוקדמת מחזירה מה שהיה בזיכרון שלו.', 'Wait times in a datasheet are the time the chip needs to do its work. Reading early returns whatever was in its memory.'))
      ]
    },
    /* ------------------------------------------------------------ your own module */
    {
      id: 'module',
      title: B('מודול משלכם: קוד שחוזר על עצמו בקובץ אחד', 'Your own module: repeated code in one file'),
      lead: B('בשיעורים העתקתם קבצים כמו `pico_tm1637.py` לתוך הלוח, וכתבתם `import`. כאן תכתבו קובץ כזה בעצמכם: [[classobj|מחלקה]] קטנה שמהבהבת לד בלי `sleep`, ושאפשר להשתמש בה בכל פרויקט.', 'In the lessons you copied files such as `pico_tm1637.py` onto the board and wrote `import`. Here you will write such a file yourselves: a small [[classobj|class]] that blinks an LED without `sleep`, which you can use in any project.'),
      blocks: [
        { h: B('מחלקה: תבנית לעצמים', 'A class: a template for objects') },
        { p: B('מחלקה מאגדת יחד נתונים ופונקציות. מכל מחלקה יוצרים כמה עצמים, ולכל עצם יש ערכים משלו. למשל שני לדים שמהבהבים בקצב שונה הם שני עצמים מאותה מחלקה.', 'A class groups data and functions together. From one class you create several objects, and each object has its own values. Two LEDs blinking at different paces, for example, are two objects of the same class.') },
        { p: B('שמרו את הקובץ הזה על הלוח בשם `blinker.py`, באותה תיקייה של `main.py` או בתיקייה `lib`:', 'Save this file on the board as `blinker.py`, in the same folder as `main.py` or in the `lib` folder:') },
        { code: [
          '# blinker.py',
          'from machine import Pin',
          'from time import ticks_ms, ticks_diff',
          '',
          'class Blinker:',
          '    def __init__(self, pin, ms):',
          '        self.led = Pin(pin, Pin.OUT)',
          '        self.ms = ms',
          '        self.last = ticks_ms()',
          '',
          '    def update(self):',
          '        if ticks_diff(ticks_ms(), self.last) >= self.ms:',
          '            self.led.toggle()',
          '            self.last = ticks_ms()'
        ], explain: [
          { l: [5], t: B('השורה פותחת מחלקה בשם `Blinker`. לפי המוסכמה, שם של מחלקה מתחיל באות גדולה.', 'This line starts a class named `Blinker`. By convention a class name starts with a capital letter.') },
          { l: [6, 9], t: B('`__init__` רץ פעם אחת, כשיוצרים עצם חדש. `self` הוא העצם עצמו, והערכים שנשמרים בו, כמו `self.ms`, שייכים רק לו.', '`__init__` runs once, when a new object is created. `self` is the object itself, and the values kept on it, such as `self.ms`, belong to it alone.') },
          { l: [11, 14], t: B('פונקציה של המחלקה (שיטה). קוראים לה בכל סיבוב של הלולאה, והיא מחליפה את הלד רק כשעבר מספיק זמן, כמו בשיעור R1.', 'A function of the class (a method). It is called on every round of the loop, and switches the LED only when enough time has passed, as in lesson R1.') }
        ] },
        { p: B('עכשיו `main.py` קצר וקריא:', 'Now `main.py` is short and readable:') },
        { code: [
          'from blinker import Blinker',
          'from time import sleep_ms',
          '',
          'fast = Blinker(15, 100)',
          'slow = Blinker("LED", 500)',
          '',
          'while True:',
          '    fast.update()',
          '    slow.update()',
          '    sleep_ms(5)'
        ], explain: [
          { l: [1], t: B('`from blinker` מחפש קובץ בשם `blinker.py`. שם הקובץ, בלי `.py`, הוא השם שכותבים ב-`import`.', '`from blinker` looks for a file named `blinker.py`. The file name, without `.py`, is the name used in `import`.') },
          { l: [4, 5], t: B('שני עצמים מאותה מחלקה: לד חיצוני על GP15 שמהבהב מהר, והלד שעל הלוח שמהבהב לאט.', 'Two objects of the same class: an outside LED on GP15 that blinks fast, and the board\'s LED that blinks slowly.') }
        ] },
        { h: B('שלוש תקלות נפוצות', 'Three common problems') },
        { ul: [
          B('`ImportError: no module named \'blinker\'`: הקובץ לא נשמר על הלוח, או שנשמר בשם אחר. בדקו ב-Thonny בחלון הקבצים של הלוח.', '`ImportError: no module named \'blinker\'`: the file was not saved on the board, or was saved under another name. Check in Thonny\'s file pane for the board.'),
          B('שיניתם את `blinker.py` ושום דבר לא השתנה: MicroPython זוכר מודול שכבר נטען. לחצו Stop ב-Thonny כדי לאתחל, והריצו שוב.', 'You changed `blinker.py` and nothing changed: MicroPython remembers a module it already loaded. Press Stop in Thonny to restart, and run again.'),
          B('שכחתם את `self.` לפני משתנה בתוך המחלקה: המשתנה נעלם בסוף הפונקציה, ובפעם הבאה מופיעה שגיאה.', 'You forgot `self.` before a variable inside the class: the variable disappears at the end of the function, and an error appears next time.')
        ] },
        { tip: B('ככה בנויות כל הספריות של הרכיבים: קובץ אחד, מחלקה אחת, ופונקציות בשמות ברורים. אחרי הפרק הזה אפשר לפתוח את `pico_tm1637.py` ולהבין אותו.', 'This is how every part library is built: one file, one class, and functions with clear names. After this chapter you can open `pico_tm1637.py` and understand it.') }
      ],
      quiz: [
        OUT(B('מחלקה קטנה שסופרת.', 'A small class that counts.'),
          ['class Counter:', '    def __init__(self):', '        self.n = 0', '', '    def add(self):', '        self.n = self.n + 1', '', 'c = Counter()', 'c.add()', 'c.add()', 'print(c.n)'], '2',
          B('`__init__` מתחיל את `n` ב-0, וכל קריאה ל-`add` מוסיפה 1. אחרי שתי קריאות `n` הוא 2.', '`__init__` starts `n` at 0, and each call to `add` adds 1. After two calls `n` is 2.')),
        Q(B('בקוד כתוב `from sensors import Thermo`. באיזה שם צריך לשמור את הקובץ על הלוח?', 'The code says `from sensors import Thermo`. Under what name must the file be saved on the board?'),
          [B('`sensors.py`', '`sensors.py`'), B('`Thermo.py`', '`Thermo.py`'), B('`main.py`', '`main.py`')], 0,
          B('אחרי `from` בא שם הקובץ, ואחרי `import` בא שם המחלקה שבתוכו.', 'After `from` comes the file name, and after `import` the name of the class inside it.')),
        FILL(B('השלימו את השורה שיוצרת עצם שמהבהב את GP15 כל 200 אלפיות שנייה.', 'Complete the line that creates an object blinking GP15 every 200 milliseconds.'),
          ['from blinker import Blinker', '', '___', '', 'while True:', '    b.update()'],
          ['b = Blinker(15, 200)', 'b = Blinker.update(15, 200)', 'Blinker(b, 15, 200)', 'b = blinker(15, 200)'], 0,
          B('יוצרים עצם בקריאה לשם המחלקה עם הערכים ש-`__init__` מקבל. `self` מתמלא לבד.', 'You create an object by calling the class name with the values `__init__` takes. `self` is filled in by itself.'))
      ]
    },
    /* ------------------------------------------------------------ running for a long time */
    {
      id: 'longrun',
      title: B('פרויקט שרץ לבד לאורך זמן', 'A project that runs by itself for a long time'),
      lead: B('פרויקט שעובד שעה על השולחן הוא לא תמיד פרויקט שעובד שבוע בלי מחשב. הפרק מסביר מה רץ בהדלקה, איך [[watchdog|כלב שמירה]] מאתחל תוכנית שנתקעה, ואיך שומרים תיעוד של שגיאה כשאין מסך.', 'A project that works for an hour on the bench is not always one that works for a week without a computer. This chapter explains what runs at power-up, how a [[watchdog|watchdog]] restarts a program that got stuck, and how to keep a record of an error when there is no screen.'),
      blocks: [
        { h: B('`boot.py` ו-`main.py`', '`boot.py` and `main.py`') },
        { p: B('בכל הדלקה MicroPython מריץ קודם את `boot.py`, אם יש קובץ כזה, ואחר כך את `main.py`. ב-`boot.py` שמים רק הגדרות קצרות שחייבות לרוץ ראשונות. את כל התוכנית שמים ב-`main.py`. כשאין `boot.py`, פשוט מדלגים עליו.', 'On every power-up MicroPython first runs `boot.py`, if there is one, and then `main.py`. `boot.py` holds only short settings that must run first. The whole program goes in `main.py`. When there is no `boot.py`, it is simply skipped.') },
        { h: B('כלב שמירה: אתחול כשהתוכנית נתקעת', 'The watchdog: a restart when the program gets stuck') },
        { p: B('תוכנית יכולה להיתקע: חיישן שלא עונה, לולאה שמחכה לנצח, או זיכרון שנגמר. כלב השמירה הוא טיימר בתוך השבב. התוכנית צריכה "להאכיל" אותו כל כמה שניות, ואם היא מפסיקה, הוא מאתחל את הלוח.', 'A program can get stuck: a sensor that does not answer, a loop that waits forever, or memory that runs out. The watchdog is a timer inside the chip. The program has to "feed" it every few seconds, and if it stops, the watchdog resets the board.') },
        { code: [
          'import machine, gc',
          'from machine import Pin, WDT',
          'from time import sleep',
          '',
          'if machine.reset_cause() == machine.WDT_RESET:',
          '    print("the watchdog restarted the board")',
          '',
          'led = Pin("LED", Pin.OUT)',
          'wdt = WDT(timeout=5000)        # restart if not fed for 5 seconds',
          '',
          'while True:',
          '    led.toggle()',
          '    # ... the project\'s work goes here ...',
          '    wdt.feed()                 # "I am still alive"',
          '    print("free memory:", gc.mem_free())',
          '    sleep(1)'
        ], explain: [
          { l: [5, 6], t: B('`reset_cause` אומר למה הלוח התחיל עכשיו: הדלקה רגילה, או אתחול של כלב השמירה. כך יודעים שמשהו נתקע.', '`reset_cause` says why the board just started: a normal power-up, or a watchdog restart. That is how you know something got stuck.') },
          { l: [9], t: B('מפעילים את כלב השמירה עם זמן של 5 שניות. ב-Pico הזמן יכול להיות עד כ-8 שניות. אחרי שהופעל, אי אפשר לעצור אותו עד האתחול הבא.', 'Starts the watchdog with a time of 5 seconds. On the Pico the time can be up to about 8 seconds. Once started, it cannot be stopped until the next reset.') },
          { l: [14], t: B('ההאכלה. שמים אותה במקום שמגיעים אליו רק כשסיבוב שלם של העבודה הצליח.', 'The feeding. Put it where you get only when a whole round of the work succeeded.') },
          { l: [15], t: B('`gc.mem_free()` מראה כמה זיכרון פנוי. אם המספר יורד כל הזמן, משהו בתוכנית צובר נתונים ולא משחרר אותם.', '`gc.mem_free()` shows how much memory is free. If the number keeps falling, something in the program is piling up data and never letting go of it.') }
        ] },
        { tip: B('הוסיפו את כלב השמירה רק בסוף, אחרי שהפרויקט עובד. בזמן פיתוח הוא מאתחל את הלוח גם כשעצרתם את התוכנית ב-Thonny, וזה מבלבל מאוד.', 'Add the watchdog only at the end, after the project works. During development it resets the board even after you stopped the program in Thonny, which is very confusing.') },
        { h: B('לשמור את השגיאה בקובץ', 'Keeping the error in a file') },
        { p: B('כשאין מחשב, הודעת שגיאה נעלמת. אפשר לעטוף את התוכנית ב-`try`, לכתוב את השגיאה לקובץ, ולאתחל. בפעם הבאה שמחברים למחשב, פותחים את `errors.txt` ורואים מה קרה.', 'With no computer, an error message disappears. You can wrap the program in `try`, write the error to a file, and restart. The next time you plug into a computer, open `errors.txt` and see what happened.') },
        { code: [
          'import machine',
          'from time import sleep',
          '',
          'def main():',
          '    # ... the whole project ...',
          '    pass',
          '',
          'try:',
          '    main()',
          'except Exception as e:',
          '    with open("errors.txt", "a") as f:',
          '        f.write(repr(e) + "\\n")',
          '    sleep(5)',
          '    machine.reset()'
        ] },
        { tip: B('ה-`sleep(5)` לפני האתחול חשוב: הוא נותן זמן ללחוץ Stop ב-Thonny אם השגיאה חוזרת בכל הדלקה. אחרת הלוח מאתחל את עצמו שוב ושוב.', 'The `sleep(5)` before the reset matters: it gives time to press Stop in Thonny if the error comes back on every power-up. Otherwise the board keeps resetting itself.') }
      ],
      quiz: [
        FILL(B('השלימו את השורה החסרה, כך שכלב השמירה לא יאתחל לוח שעובד כרגיל.', 'Complete the missing line, so the watchdog does not reset a board that is working normally.'),
          ['wdt = WDT(timeout=5000)', '', 'while True:', '    do_work()', '    ___', '    sleep(1)'],
          ['wdt.feed()', 'wdt.stop()', 'machine.reset()', 'gc.collect()'], 0,
          B('`feed` אומר לכלב השמירה שהתוכנית חיה. אין `stop`: אחרי שהופעל הוא רץ עד האתחול הבא.', '`feed` tells the watchdog the program is alive. There is no `stop`: once started it runs until the next reset.')),
        Q(B('יש על הלוח גם `boot.py` וגם `main.py`. מה רץ בהדלקה?', 'The board has both `boot.py` and `main.py`. What runs at power-up?'),
          [B('קודם `boot.py`, ואחריו `main.py`', 'First `boot.py`, then `main.py`'), B('רק `main.py`', 'Only `main.py`'), B('רק `boot.py`', 'Only `boot.py`')], 0,
          B('שניהם רצים, תמיד בסדר הזה. את רוב התוכנית שמים ב-`main.py`.', 'Both run, always in this order. Most of the program goes in `main.py`.')),
        Q(B('`gc.mem_free()` יורד קצת בכל שעה, עד שהתוכנית נעצרת עם `MemoryError`. מה הסיבה הסבירה?', '`gc.mem_free()` drops a little every hour, until the program stops with `MemoryError`. What is the likely cause?'),
          [B('משהו בתוכנית צובר נתונים, למשל רשימה שמוסיפים לה ואף פעם לא מנקים', 'Something in the program piles up data, for example a list that is appended to and never cleared'), B('הלוח מתחמם', 'The board is warming up'), B('כלב השמירה מאכל זיכרון', 'The watchdog eats memory')], 0,
          B('זיכרון שיורד כל הזמן מעיד על נתונים שנשמרים ולא משתחררים. בודקים אילו רשימות או מחרוזות גדלות בלולאה.', 'Memory that keeps falling points to data that is kept and never released. Check which lists or strings grow inside the loop.'))
      ]
    }
  );
})(window.PICO);
