/* Lesson tracks, part 4: track H (measuring and controlling precisely).
   One lesson for each part of data-components-5.js that tracks E to G do
   not use. Same structure as data-lessons-3.js. The breadboard pictures of
   these lessons are at the end of data-layouts-2.js. Connections between a
   module and another part (not the Pico) are not in the wiring table: the
   steps describe them, and the picture shows them too. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, UNPLUG = x.UNPLUG, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ;

  var CLEAR = B('פנו מהמטריצה את כל מה שנשאר מהשיעור הקודם.', 'Clear the breadboard of the previous lesson.');
  var RAILS = B('ההזנה והאדמה עוברות דרך הפסים שלאורך המטריצה, כמו בציור. לחצו על "בנו צעד אחר צעד" שמעל הציור כדי לראות את החוטים אחד אחרי השני.', 'Power and ground run through the rails along the breadboard, as in the picture. Click "Build it step by step" above the picture to see each wire in turn.');
  var BASICS = function (id, he, en, whyHe, whyEn) { return { href: '#/basics/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var PART = function (id, he, en, whyHe, whyEn) { return { href: '#/components/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var LESSON = function (id) { return { href: '#/lessons/' + id, label: B('שיעור ' + id, 'Lesson ' + id) }; };

  P.tracks.push(
    { id: 'H', color: '--c-pio', title: B('מדידה ושליטה מדויקות', 'Measuring and controlling precisely'), desc: B('עמעם לעומס גדול, פינים נוספים, מד סוללה, הגנת זרם, משקל, זרוע עם כמה סרוואים ותרמוסטט. אחריהם באים שילובים: מאוורר לפי לחות, כפתורים עם פסיקה, ידיות שמכוונות סרוואים ומונה אנרגיה.', 'A dimmer for a big load, extra pins, a battery meter, current protection, a scale, an arm with several servos and a thermostat. Then come combinations: a fan that follows humidity, buttons with an interrupt, knobs that aim servos and an energy counter.') }
  );

  P.lessons.push(
    /* ============================================================ H1 */
    {
      id: 'H1', track: 'H',
      title: B('עמעם לפס לדים של 12V', 'A dimmer for a 12 V LED strip'),
      goal: B('כפתור סיבוב קובע את העוצמה של פס לדים שמקבל מתח מספק נפרד. האור משתנה ברכות, בלי קפיצות.', 'A knob sets the brightness of an LED strip fed from a separate supply. The light changes softly, with no jumps.'),
      learn: [
        B('איך מפעילים עומס גדול בעזרת [[mosfet|MOSFET]], ובמה הוא שונה מ[[relay|ממסר]].', 'To drive a big load with a [[mosfet|MOSFET]], and understand how it differs from a [[relay|relay]].'),
        B('איך מחברים [[commonground|אדמה משותפת]] בין שני ספקים.', 'To join a [[commonground|common ground]] between two supplies.'),
        B('איך מחליקים שינוי, כך שהערך מתקרב בהדרגה לערך המבוקש.', 'To smooth a change: approaching the requested value gradually.'),
        B('איך מתאימים את העוצמה לעין, שלא רואה את השינוי באור בקו ישר.', 'To fit the brightness to the eye, which does not see light in a straight line.')
      ],
      before: [
        BASICS('power', 'יסודות: כוח', 'Basics: Power', 'כדאי מאוד לקרוא אותו לפני שמתחילים את המסלול הזה.', 'Do read this before the whole track.'),
        PART('mosfet', 'העמוד של מודול ה-MOSFET', 'The MOSFET module\'s page', 'שם מוסבר איזה מודול מתאים לעבודה ב-3.3V.', 'It explains which module suits 3.3 V.'),
        LESSON('B2'), LESSON('E1')
      ],
      parts: [{ id: 'mosfet', qty: 1 }, { id: 'pot', qty: 1 }, { text: B('פס לדים של 12V (חצי מטר מספיק) וספק 12V שמתאים לו', 'A 12 V LED strip (half a metre is enough) and a matching 12 V supply') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('MOSFET, SIG', 'MOSFET, SIG'), 'GP21', 27, null, 'SIG'),
        W(B('MOSFET, GND', 'MOSFET, GND'), 'GND', 38, B('זו האדמה המשותפת', 'this is the common ground'), 'GND'),
        W(B('פוטנציומטר, רגל קיצונית', 'Potentiometer, outer leg'), '3V3', 36, null, '3.3V'),
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, B('ADC0', 'ADC0'), B('כפתור סיבוב', 'Knob')),
        W(B('פוטנציומטר, רגל קיצונית שנייה', 'Potentiometer, other outer leg'), 'GND', 38, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('ודאו שספק ה-12V מנותק מהשקע.', 'Make sure the 12 V supply is unplugged from the wall.'),
        B('מודול ה-MOSFET נשאר מחוץ למטריצה, כמו בציור. חברו את הפינים `SIG` ו-`GND` שלו לפי הטבלה, בחוטים עם קצה נקבה. את `VCC` משאירים לא מחובר.', 'The MOSFET module stays off the breadboard, as in the picture. Connect its `SIG` and `GND` with female-ended wires, following the table. `VCC` is left unconnected.'),
        B('הכניסו את הפוטנציומטר למטריצה, וחברו את שלוש הרגליים שלו כמו בשיעור B1.', 'Push in the potentiometer and connect its three legs, as in lesson B1.'),
        RAILS,
        B('הבריגו את חוט הפלוס של הספק למהדק `VIN` של המודול, ואת חוט המינוס למהדק `GND`.', 'Screw the supply\'s plus into the module\'s `VIN` terminal, and its minus into the `GND` terminal.'),
        B('הבריגו את חוט הפלוס של פס הלדים למהדק `V+`, ואת חוט המינוס שלו למהדק `V−`.', 'Screw the LED strip\'s plus into the `V+` terminal, and its minus into the `V−` terminal.'),
        B('שימו לב: אף חוט של 12V לא נוגע במטריצה או ב-Pico. רק האדמה משותפת, והחיבור שלה עובר בתוך המודול.', 'Note: no 12 V wire touches the breadboard or the Pico. Only ground is shared, and it passes inside the module.'),
        B('סובבו את הפוטנציומטר עד הסוף שמאלה.', 'Turn the potentiometer fully to the left.'),
        PLUG, RUN,
        B('רק עכשיו חברו את הספק לשקע. סובבו את הכפתור לאט, ואחר כך בתנועה חדה אחת.', 'Only now plug the supply in. Turn the knob slowly, and then in one sharp movement.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, ADC',
        'from time import sleep',
        '',
        'load = PWM(Pin(21), freq=1000)',
        'knob = ADC(26)',
        '',
        'level = 0',
        '',
        'while True:',
        '    target = knob.read_u16()',
        '    if target < 1500:',
        '        target = 0',
        '    level = level + (target - level) // 8',
        '    load.duty_u16(level * level // 65535)',
        '    print(level * 100 // 65535, "%")',
        '    sleep(0.02)'
      ],
      explain: [
        E([4], 'השורה הזו יוצרת פין [[pwm|PWM]] בתדר של 1000 הרץ. ה-MOSFET נדלק ונכבה אלף פעמים בשנייה, והעין רואה אור רציף.', 'A [[pwm|PWM]] pin at 1000 Hz. The MOSFET switches on and off a thousand times a second, and the eye sees steady light.'),
        E([7], 'זו העוצמה הנוכחית. היא לא קופצת מיד לערך של הכפתור, אלא רודפת אחריו.', 'The current level. It does not jump to the knob, but chases it.'),
        E([10, 12], 'השורות האלה קוראות את הכפתור. כשהוא קרוב לקצה השמאלי, הערך נקבע ל-0 בדיוק, כדי שהפס ייכבה לגמרי.', 'Reads the knob. Near the left end it is set to exactly 0, so the strip truly goes off.'),
        E([13], 'זו ההחלקה: בכל סיבוב של הלולאה העוצמה מתקרבת ליעד בשמינית מהמרחק שנשאר. כשהיעד רחוק הצעד גדול, וכשהוא קרוב הצעד קטן.', 'The smoothing: on each turn an eighth of the distance to the target is closed. Far from the target the step is big, and near it the step is small.'),
        E([14], 'השורה מעלה את הערך בריבוע. חצי סיבוב של הכפתור נותן רבע מהעוצמה, וכך העין רואה שינוי אחיד לאורך כל הסיבוב.', 'Squares the value. Half the knob gives a quarter of the power, and so the eye sees an even change along the whole turn.'),
        E([15], 'השורה מדפיסה את מיקום הכפתור באחוזים.', 'Prints the knob position as a percentage.')
      ],
      expect: B('הפס מתבהר ומתעמעם יחד עם הכפתור, לאורך כל הסיבוב. בתנועה חדה האור לא קופץ, אלא גולש אל העוצמה החדשה בתוך כחצי שנייה. בקצה השמאלי הפס כבוי לגמרי.', 'The strip brightens and dims with the knob, along the whole turn. On a sharp movement the light does not jump but glides to the new level within about half a second. At the left end it is fully off.'),
      tasks: [
        { t: B('החליפו את שורה 14 ב-`load.duty_u16(level)` והריצו. באיזה חלק של הסיבוב קורה רוב השינוי?', 'Replace line 14 with `load.duty_u16(level)` and run. Where along the turn does most of the change happen?'), hint: B('כמעט כל השינוי שרואים קורה ברבע הראשון של הסיבוב, ואחריו הכפתור כמעט לא משפיע. העין רגישה מאוד לשינוי באור חלש, וכמעט לא מבחינה בשינוי באור חזק.', 'Nearly all the visible change happens in the first quarter, and after that the knob hardly matters. The eye is very sensitive to change in dim light, and indifferent to change in bright light.') },
        { t: B('שנו את התדר ל-50, ואחר כך ל-20000. מה רואים ומה שומעים?', 'Change the frequency to 50 and then to 20000. What do you see and hear?'), hint: B('ב-50 הרץ האור מהבהב, בעיקר כשמזיזים את העיניים. ב-20000 הרץ אין הבהוב, וגם מנוע או מאוורר לא ישמיעו צפצוף. החיסרון הוא שה-MOSFET מתחמם קצת יותר.', 'At 50 Hz the light flickers, mostly when you move your eyes. At 20000 there is no flicker, and a motor or fan will not whine either. The price: the MOSFET runs a little warmer.') },
        { t: B('אור שעולה לאט בבוקר: בלי כפתור, העוצמה עולה מ-0 ועד למקסימום במשך דקה, ונשארת שם.', 'A light that rises slowly in the morning: with no knob, the level rises from 0 to full over a minute, and stays there.'), hint: B('השתמשו בלולאת `for` מ-0 עד 65535 בקפיצות של 64, עם המתנה קצרה בכל צעד. את ההעלאה בריבוע השאירו.', 'A `for` loop from 0 to 65535 in jumps of 64, with a short wait at each step. Keep the squaring.'),
          code: ['for level in range(0, 65536, 64):', '    load.duty_u16(level * level // 65535)', '    sleep(0.06)'] }
      ],
      quiz: [
        Q(B('למה משתמשים כאן ב-MOSFET ולא בממסר?', 'Why a MOSFET here and not a relay?'),
          [B('כי ממסר לא יכול להעביר 12V', 'Because a relay cannot pass 12 V'), B('כי MOSFET נדלק ונכבה אלפי פעמים בשנייה, ולכן אפשר לעמעם בעזרתו', 'Because a MOSFET switches thousands of times a second, which makes dimming possible'), B('כי MOSFET לא צריך אדמה', 'Because a MOSFET needs no ground')], 1,
          B('ממסר הוא מתג מכני: הוא רק דולק או כבוי, והוא איטי. עמעום דורש מיתוג מהיר מאוד, וזה בדיוק מה ש-MOSFET יודע לעשות.', 'A relay is a mechanical switch: on or off, and slow. Dimming needs very fast switching, which is what a MOSFET can do.'))
      ]
    },

    /* ============================================================ H2 */
    {
      id: 'H2', track: 'H',
      title: B('עוד פינים: אור רץ על מרחיב', 'More pins: a running light on an expander'),
      goal: B('ארבעה לדים וכפתור מחוברים למרחיב פינים, ולא ישירות ל-Pico. האור רץ הלוך ושוב, ולחיצה על הכפתור מאיצה אותו. כל זה תופס רק שני פינים של ה-Pico.', 'Four LEDs and a button are connected to a pin expander, not to the Pico. The light runs back and forth, and a press speeds it up. All on two Pico pins.'),
      learn: [
        B('איך מוסיפים פינים דרך [[i2c|I2C]], בעזרת מודול PCF8574.', 'To add pins over [[i2c|I2C]], with a PCF8574 module.'),
        B('איך שולטים בכמה יציאות בעזרת [[byte|בית]] אחד, [[bit|ביט]] לכל פין.', 'To control several outputs with one [[byte|byte]], a [[bit|bit]] per pin.'),
        B('איך משתמשים בפעולות על ביטים: הזזה, היפוך ובדיקה.', 'To use bit operations: shifting, flipping and testing.'),
        B('איך עובד לד שנדלק ב-0 ולא ב-1.', 'To understand an LED that lights at 0 and not at 1.')
      ],
      before: [
        BASICS('bits', 'יסודות: ביטים ו-hex', 'Basics: Bits and hex', 'בלי הפרק הזה לא תבינו את הקוד כאן.', 'Without this chapter the code here will not make sense.'),
        BASICS('buses', 'יסודות: I2C, SPI ו-UART', 'Basics: I2C, SPI and UART'),
        PART('pcf8574', 'העמוד של מרחיב הפינים', 'The pin expander\'s page'),
        LESSON('A2')
      ],
      parts: [{ id: 'pcf8574', qty: 1 }, { id: 'led', qty: 4 }, { id: 'button', qty: 1 }, { text: B('ארבעה נגדים של 330Ω', 'Four 330 Ω resistors') }, { text: B('כעשרה חוטי גישור', 'About ten jumper wires') }],
      wiring: [
        W(B('מרחיב, VCC', 'Expander, VCC'), '3V3', 36, null, '3.3V'),
        W(B('מרחיב, GND', 'Expander, GND'), 'GND', 38, null, 'GND'),
        W(B('מרחיב, SDA', 'Expander, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מרחיב, SCL', 'Expander, SCL'), 'GP5', 7, null, 'SCL')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את המרחיב למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה.', 'Push in the expander and connect its four pins following the table.'),
        RAILS,
        B('הכניסו ארבעה לדים בשורה, במקום פנוי במטריצה. חברו את הרגל הארוכה של כל לד לפס ה-3.3V.', 'Push in four LEDs in a row, in a free place on the breadboard. Connect the long leg of each LED to the 3.3 V rail.'),
        B('לרגל הקצרה של כל לד חברו נגד 330Ω, ומהקצה השני של הנגד חברו חוט אל המרחיב: את הלד הראשון ל-`P0`, את השני ל-`P1`, את השלישי ל-`P2` ואת הרביעי ל-`P3`.', 'From the short leg of each LED connect a 330 Ω resistor, and from the resistor\'s other end a wire to the expander: the first LED to `P0`, the second to `P1`, the third to `P2` and the fourth to `P3`.'),
        B('שימו לב: החיבור הפוך מזה של שיעור A1. שם הלד היה בין הפין לאדמה, וכאן הוא בין 3.3V לפין.', 'Note: this is the reverse of lesson A1. There the LED sat between the pin and ground, and here it sits between 3.3 V and the pin.'),
        B('הכניסו כפתור למטריצה. חברו רגל אחת שלו לפין `P7` של המרחיב, ואת הרגל שמולה לפס האדמה.', 'Push in a button. One of its legs goes to the expander\'s `P7` pin, and the opposite leg to the ground rail.'),
        PLUG, RUN,
        B('הסתכלו על הלדים. אחר כך לחצו על הכפתור והחזיקו אותו לחוץ.', 'Watch the LEDs. Then press the button and hold it.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x20',
        'LEDS = 4',
        '',
        'def write(value):',
        '    i2c.writeto(ADDR, bytes([value]))',
        '',
        'def read():',
        '    return i2c.readfrom(ADDR, 1)[0]',
        '',
        'position = 0',
        'step = 1',
        '',
        'while True:',
        '    lit = 1 << position',
        '    write(0xFF ^ lit)',
        '    pressed = (read() & 0x80) == 0',
        '    position = position + step',
        '    if position == 0 or position == LEDS - 1:',
        '        step = -step',
        '    sleep(0.05 if pressed else 0.2)'
      ],
      explain: [
        E([4, 5], 'השורות האלה יוצרות את ה[[bus|אפיק]], וקובעות את ה[[address|כתובת]] של המרחיב.', 'The [[bus|bus]], and the expander\'s [[address|address]].'),
        E([8, 9], 'פונקציית הכתיבה שולחת בית אחד, שקובע את כל שמונת הפינים בבת אחת.', 'Writing: one byte that sets all eight pins at once.'),
        E([11, 12], 'פונקציית הקריאה מחזירה בית אחד, שמתאר את המצב של כל שמונת הפינים.', 'Reading: one byte describing the state of all eight pins.'),
        E([14, 15], 'המשתנים האלה שומרים איזה לד דולק עכשיו, ולאיזה כיוון האור זז: 1 קדימה, ומינוס 1 אחורה.', 'Which LED is lit now, and which way the light moves: 1 forwards, minus 1 backwards.'),
        E([18], '`1 << position` הוא מספר שרק ביט אחד דולק בו, במקום של הלד. למשל, עבור מקום 2 מתקבל `0b00000100`.', '`1 << position` is a number with a single bit set, at the LED\'s place. For place 2, for example, it gives `0b00000100`.'),
        E([19], '`0xFF ^ lit` הופך את התמונה: כל הביטים הם 1, חוץ מהביט של הלד, כי הלדים כאן נדלקים ב-0. ביט 7 נשאר 1, וזה מה שמאפשר לקרוא את הכפתור.', '`0xFF ^ lit` inverts the picture: every bit is 1, except the LED\'s bit. The LEDs here light at 0. Bit 7 stays 1, which is what lets the button be read.'),
        E([20], 'השורה בודקת את ביט 7. הסוגריים הכרחיים: בלעדיהם Python משווה קודם את `0x80` ל-0, והתוצאה שגויה.', 'Tests bit 7. The brackets are required: without them Python first compares `0x80` with 0, and the result is wrong.'),
        E([21, 23], 'השורות מקדמות את האור בצעד אחד. כשהוא מגיע לאחד הקצוות, הכיוון מתהפך.', 'Moves one step. On reaching either end the direction is reversed.'),
        E([24], 'ההמתנה קצרה כשהכפתור לחוץ, וארוכה כשהוא לא לחוץ.', 'A short wait while the button is pressed, and a long one when it is not.')
      ],
      expect: B('בכל רגע דולק לד אחד, והוא נע מקצה לקצה וחזרה. כשמחזיקים את הכפתור לחוץ, האור רץ פי ארבעה מהר יותר.', 'One LED is lit at any moment, and it moves from end to end and back. While the button is held the light runs four times faster.'),
      tasks: [
        { t: B('הפכו את התמונה: כל הלדים דולקים, ו"נקודה חשוכה" אחת רצה ביניהם.', 'Invert the picture: all LEDs lit, and a single "dark spot" runs between them.'), hint: B('כתבו `lit` במקום ההיפוך שלו. אבל ביט 7 חייב להישאר 1, וגם ביטים 4 עד 6, שלא בשימוש.', 'Write `lit` instead of its inverse, but bit 7 must stay 1, and so must the unused bits 4 to 6.'),
          code: ['    write(lit | 0xF0)'] },
        { t: B('הוסיפו עוד שלושה לדים, על `P4`, `P5` ו-`P6`, כדי שהאור ירוץ על שבעה לדים. מה צריך לשנות בקוד?', 'Add three more LEDs, on `P4`, `P5` and `P6`, so the light runs over seven. What needs changing in the code?'), hint: B('רק שורה אחת: `LEDS = 7`. כל שאר הקוד נשען על הקבוע הזה, וזה היתרון של קבוע עם שם.', 'Only one line: `LEDS = 7`. All the rest of the code leans on this constant, which is the benefit of a named constant.') },
        { t: B('מונה בינארי: ארבעת הלדים מציגים מספר בין 0 ל-15, וכל לחיצה מגדילה אותו ב-1.', 'A binary counter: the four LEDs show a number from 0 to 15, and each press raises it by 1.'), hint: B('זהו את רגע הלחיצה כמו בשיעור A4, בעזרת משתנה `last`. כתבו את המספר הפוך, כי הלדים נדלקים ב-0: `0xFF ^ count`. `% 16` מחזיר את המונה ל-0 אחרי 15.', 'Catch the moment of the press as in lesson A4, with a `last` variable. The number is written inverted, because the LEDs light at 0: `0xFF ^ count`. `% 16` returns the counter to 0 after 15.'),
          code: ['count = 0', 'last = False', '', 'while True:', '    write(0xFF ^ count)', '    pressed = (read() & 0x80) == 0', '    if pressed and not last:', '        count = (count + 1) % 16', '    last = pressed', '    sleep(0.02)'] }
      ],
      quiz: [
        Q(B('כותבים למרחיב את הבית `0xFE`. מה קורה?', 'The byte `0xFE` is written to the expander. What happens?'),
          [B('כל הלדים דולקים', 'All the LEDs light'), B('רק הלד שעל P0 דולק', 'Only the LED on P0 lights'), B('רק הלד שעל P7 דולק', 'Only the LED on P7 lights')], 1,
          B('`0xFE` הוא `0b11111110`: כל הביטים הם 1, חוץ מביט 0. כאן לד נדלק כשהביט שלו הוא 0.', '`0xFE` is `0b11111110`: every bit is 1 except bit 0. Here an LED lights when its bit is 0.'))
      ]
    },

    /* ============================================================ H3 */
    {
      id: 'H3', track: 'H',
      title: B('בודק סוללות מדויק', 'A precise battery tester'),
      goal: B('מצמידים סוללת AA לשני חוטים, והמסך מציג את המתח שלה עם שלוש ספרות אחרי הנקודה, וגם אם היא טובה, חלשה או ריקה.', 'Touch an AA battery to two wires, and the display shows its voltage to three decimal places, and whether it is good, weak or empty.'),
      learn: [
        B('איך מודדים מתח בדיוק גבוה בעזרת [[adc|ADC]] חיצוני.', 'To measure voltage precisely with an external [[adc|ADC]].'),
        B('איך מחברים שני רכיבים לאותו [[bus|אפיק]] I2C, כשלכל אחד יש [[address|כתובת]] משלו.', 'To connect two parts to the same I2C [[bus|bus]], each with its own [[address|address]].'),
        B('איך מפחיתים רעש בעזרת ממוצע של כמה מדידות.', 'To cut noise by averaging several measurements.'),
        B('איך הופכים מספר להחלטה, בעזרת כמה ספים.', 'To turn a number into a decision, with several thresholds.')
      ],
      before: [
        BASICS('buses', 'יסודות: I2C, SPI ו-UART', 'Basics: I2C, SPI and UART', 'שם מוסבר איך שני רכיבים חולקים את אותו אפיק.', 'It explains how two parts share a bus.'),
        PART('ads1115', 'העמוד של ה-ADS1115', 'The ADS1115\'s page', 'שם מוסברת הפונקציה `read_volts`, שורה אחר שורה.', 'The `read_volts` function is explained there line by line.'),
        LESSON('C3')
      ],
      parts: [{ id: 'ads1115', qty: 1 }, { id: 'oled', qty: 1 }, { text: B('סוללות AA או AAA לבדיקה, חדשות וישנות', 'AA or AAA batteries to test, new and old') }, { text: B('עשרה חוטי גישור', 'Ten jumper wires') }],
      wiring: [
        W(B('ממיר, VDD ומסך, VCC', 'Converter VDD and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('ממיר, GND ומסך, GND', 'Converter GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('ממיר, SDA ומסך, SDA', 'Converter SDA and display SDA'), 'GP4', 6, B('שני הרכיבים מחוברים לאותו קו', 'both parts on the same line'), 'SDA'),
        W(B('ממיר, SCL ומסך, SCL', 'Converter SCL and display SCL'), 'GP5', 7, B('שני הרכיבים מחוברים לאותו קו', 'both parts on the same line'), 'SCL')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את הממיר ואת המסך למטריצה, וחברו את שניהם לפי הטבלה: שני קווי ה-I2C מגיעים לשני הרכיבים.', 'Push in the converter and the display. Connect both following the table: the two I2C lines reach both parts.'),
        RAILS,
        B('חוט המדידה: חברו חוט גישור ארוך לטור של `A0` בממיר, והשאירו את הקצה השני שלו חופשי. זה חוט הפלוס.', 'The probe wire: a long jumper wire from the column of `A0` on the converter. Its other end stays free. This is the plus.'),
        B('חוט האדמה: חברו חוט גישור ארוך לפס האדמה, גם הוא עם קצה חופשי. זה חוט המינוס.', 'The ground wire: a long jumper wire from the ground rail, with a free end. This is the minus.'),
        B('אזהרה: כאן בודקים רק סוללות בודדות של 1.5V. מתח של יותר מ-3.3V על `A0` יפגע בממיר.', 'Warning: only single 1.5 V batteries are tested here. More than 3.3 V on `A0` damages the converter.'),
        PLUG, RUN,
        B('הצמידו את חוט המינוס לצד השטוח של הסוללה, ואת חוט הפלוס לצד שיש בו בליטה. נסו כמה סוללות.', 'Hold the minus wire against the flat end of a battery, and the plus wire against the end with the bump. Try several batteries.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep, sleep_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        'ADDR = 0x48',
        '',
        'def read_volts(channel):',
        '    config = 0xC383 | (channel << 12)',
        '    i2c.writeto_mem(ADDR, 1, bytes([config >> 8, config & 0xFF]))',
        '    sleep_ms(10)',
        '    data = i2c.readfrom_mem(ADDR, 0, 2)',
        '    raw = (data[0] << 8) | data[1]',
        '    if raw > 32767:',
        '        raw = raw - 65536',
        '    return raw * 4.096 / 32768',
        '',
        'def average(times):',
        '    total = 0',
        '    for i in range(times):',
        '        total = total + read_volts(0)',
        '    return total / times',
        '',
        'while True:',
        '    volts = average(16)',
        '    if volts < 0.2:',
        '        verdict = "no battery"',
        '    elif volts > 1.4:',
        '        verdict = "GOOD"',
        '    elif volts > 1.2:',
        '        verdict = "weak"',
        '    else:',
        '        verdict = "EMPTY"',
        '    oled.fill(0)',
        '    oled.text("Battery", 0, 0)',
        '    oled.text("%.3f V" % volts, 0, 20)',
        '    oled.text(verdict, 0, 44)',
        '    oled.show()',
        '    sleep(0.2)'
      ],
      explain: [
        E([5, 7], 'אפיק אחד ושני רכיבים עליו. המסך עונה בכתובת `0x3C` והממיר בכתובת `0x48`, ולכן הם לא מפריעים זה לזה.', 'One bus, with two parts on it. The display answers at address `0x3C` and the converter at `0x48`, so they do not disturb each other.'),
        E([9, 17], 'זו הפונקציה מהעמוד של הממיר: היא מבקשת מדידה של כניסה אחת, מחכה, ומחזירה את התוצאה בוולטים.', 'The function from the converter\'s page: asks for a measurement of one input, waits, and reads volts.'),
        E([19, 23], 'הפונקציה מחשבת ממוצע: היא מודדת כמה פעמים, מחברת את התוצאות ומחלקת במספר המדידות. כך רוב הרעש האקראי מתבטל.', 'An average: measures several times, adds up, and divides by the number of measurements. Random noise mostly cancels out.'),
        E([26], '16 מדידות של 10 אלפיות שנייה כל אחת, ולכן כל ממוצע נמשך כשישית שנייה.', '16 measurements of 10 milliseconds: each average takes about a sixth of a second.'),
        E([27, 28], 'כמעט אפס וולט פירושו שהחוטים לא נוגעים בסוללה.', 'Nearly zero volts: the wires are not touching a battery.'),
        E([29, 34], 'שלושה ספים, מהגבוה לנמוך. כל `elif` נבדק רק אם כל התנאים שמעליו לא התקיימו.', 'Three thresholds, from high to low. An `elif` is tested only if the conditions above it failed.'),
        E([35, 39], 'השורות מוחקות את המסך וכותבות עליו שלוש שורות. `%.3f` מדפיס שלוש ספרות אחרי הנקודה.', 'Clears the display and writes three lines. `%.3f` prints three digits after the point.')
      ],
      expect: B('כשאין סוללה כתוב "no battery". סוללה חדשה מראה 1.5 עד 1.6 וולט ו-"GOOD", וסוללה משומשת מראה פחות. שלוש הספרות יציבות, ורק האחרונה זזה מעט.', 'With no battery it reads "no battery". A new battery shows 1.5 to 1.6 volts and "GOOD". A used one shows less. The three digits are steady, and only the last moves a little.'),
      tasks: [
        { t: B('שנו את `average(16)` ל-`average(1)`. מה קרה לספרה האחרונה?', 'Change `average(16)` to `average(1)`. What happened to the last digit?'), hint: B('היא קופצת יותר. ככל שהממוצע ארוך יותר, המספר יציב יותר, אבל הוא מגיב לאט יותר. זו פשרה שקיימת בכל מכשיר מדידה.', 'It jumps about more. The longer the average the steadier the number, but the slower it responds. This is a trade-off that recurs in every measuring instrument.') },
        { t: B('השוו ל-ADC של ה-Pico עצמו: חברו את חוט הפלוס גם לפין 31 (`GP26`), והציגו בשורה נוספת את המתח שה-Pico מודד.', 'Compare with the Pico\'s own ADC: connect the plus wire to pin 31 (`GP26`) as well, and show on another line the voltage the Pico measures.'), hint: B('`ADC(26).read_u16() * 3.3 / 65535`. המספר של ה-Pico קופץ בספרה השנייה אחרי הנקודה, ובדרך כלל הוא גם סוטה מעט מהערך האמיתי.', '`ADC(26).read_u16() * 3.3 / 65535`. The Pico\'s number jumps in the second digit after the point, and is usually a little off as well.'),
          code: ['from machine import ADC', 'pico_adc = ADC(26)', '', '    oled.text("Pico %.3f V" % (pico_adc.read_u16() * 3.3 / 65535), 0, 32)'] },
        { t: B('אסור לחבר סוללה של 9V ישירות. איך בכל זאת אפשר למדוד אותה?', 'A 9 V battery must not be connected directly. How can it be measured all the same?'), hint: B('בעזרת [[divider|מחלק מתח]]: שני נגדים בטור, של 20kΩ ושל 10kΩ, מהפלוס של הסוללה לאדמה. מודדים בנקודה שביניהם, ושם המתח הוא שליש מהמתח של הסוללה. בקוד מכפילים את התוצאה ב-3.', 'With a [[divider|voltage divider]]: two resistors in series, 20 kΩ and 10 kΩ, from the battery\'s plus to ground. Measure at the point between them, where there is a third of the voltage. In the code, multiply by 3.') }
      ],
      quiz: [
        Q(B('המסך והממיר מחוברים לאותם שני חוטים. איך ה-Pico פונה רק לאחד מהם?', 'The display and the converter are on the same two wires. How does the Pico address just one of them?'),
          [B('לפי הסדר שבו הם חוברו', 'By the order in which they were connected'), B('כל הודעה מתחילה בכתובת, ורק הרכיב שזו הכתובת שלו עונה', 'Each message begins with an address, and only the part with that address answers'), B('הוא לא יכול, ולכן צריך אפיק נפרד לכל רכיב', 'It cannot, so each part needs its own bus')], 1,
          B('זה הרעיון של I2C: הרבה רכיבים על שני חוטים, ולכל אחד כתובת משלו.', 'This is the idea of I2C: many parts on two wires, each with an address.'))
      ]
    },

    /* ============================================================ H4 */
    {
      id: 'H4', track: 'H',
      title: B('מנוע עם הגנה מעומס יתר', 'A motor with overload protection'),
      goal: B('מנוע קטן מקבל מתח מסוללות. התוכנית מודדת כמה זרם הוא צורך, וכשהוא נתקע, היא מנתקת אותו לשלוש שניות.', 'A small motor runs from batteries. The program measures how much current it draws, and when it stalls, cuts it off for three seconds.'),
      learn: [
        B('איך מודדים את ה[[current|זרם]] של מעגל אחר בעזרת INA219.', 'To measure the [[current|current]] of another circuit with an INA219.'),
        B('למה מנוע תקוע צורך הרבה יותר זרם ממנוע שמסתובב.', 'To understand that a stalled motor draws far more current than a turning one.'),
        B('איך בונים הגנה שמתעלמת מקפיצה רגעית, ומגיבה רק לבעיה שנמשכת.', 'To build a safeguard that ignores a momentary spike, and reacts only to a problem that lasts.'),
        B('איך משלבים שני רכיבים: אחד מודד, והשני מנתק.', 'To combine two parts: one measures and one cuts off.')
      ],
      before: [
        BASICS('power', 'יסודות: כוח', 'Basics: Power'),
        PART('ina219', 'העמוד של מד הזרם INA219', 'The INA219 current meter\'s page', 'שם מוסבר איך מחברים אותו בטור.', 'It explains how it is connected in series.'),
        LESSON('H1')
      ],
      parts: [{ id: 'ina219', qty: 1 }, { id: 'mosfet', qty: 1 }, { text: B('מנוע DC קטן (מנוע של צעצוע), ובית סוללות ל-2 עד 4 סוללות AA', 'A small DC motor (a toy motor), and a battery holder for 2 to 4 AA batteries') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('מד זרם, VCC', 'Current meter, VCC'), '3V3', 36, null, '3.3V'),
        W(B('מד זרם, GND ו-MOSFET, GND', 'Current meter GND and MOSFET GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('מד זרם, SCL', 'Current meter, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('מד זרם, SDA', 'Current meter, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('MOSFET, SIG', 'MOSFET, SIG'), 'GP21', 27, null, 'SIG')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הוציאו סוללה אחת מבית הסוללות, כדי שלא יהיה בו מתח בזמן הבנייה.', 'Take one battery out of the holder, so it carries no voltage while you build.'),
        B('מד הזרם ומודול ה-MOSFET נשארים מחוץ למטריצה, כמו בציור. חברו את הפינים שלהם לפי הטבלה, בחוטים עם קצה נקבה.', 'The current meter and the MOSFET module stay off the breadboard, as in the picture. Connect their pins with female-ended wires, following the table.'),
        RAILS,
        B('המעגל של המנוע, לפי הסדר: חברו את הפלוס של הסוללות למהדק `Vin+` של מד הזרם, ואחר כך חוט ממהדק `Vin−` של מד הזרם למהדק `VIN` של ה-MOSFET.', 'The motor\'s circuit, in order: the batteries\' plus to the current meter\'s `Vin+` terminal. A wire from the current meter\'s `Vin−` terminal to the MOSFET\'s `VIN` terminal.'),
        B('את המינוס של הסוללות חברו למהדק `GND` של ה-MOSFET, ואת שני החוטים של המנוע למהדקים `V+` ו-`V−`.', 'The batteries\' minus to the MOSFET\'s `GND` terminal. The motor\'s two wires to the `V+` and `V−` terminals.'),
        B('עקבו באצבע אחרי מסלול הזרם: סוללות, מד זרם, MOSFET, מנוע, וחזרה לסוללות. כל הזרם של המנוע עובר דרך מד הזרם.', 'Trace the current with a finger: batteries, current meter, MOSFET, motor, and back to the batteries. All the motor\'s current passes through the current meter.'),
        PLUG, RUN,
        B('החזירו את הסוללה למקומה, והמנוע יתחיל להסתובב. קראו את הזרם שמודפס.', 'Put the battery back. The motor starts turning. Read the current that is printed.'),
        B('בלמו בעדינות את הציר בין שתי אצבעות, עד שהוא נעצר. שחררו אחרי שהמנוע מנותק.', 'Brake the shaft gently between two fingers, until it stops. Let go once the motor is cut off.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x40',
        'motor = Pin(21, Pin.OUT)',
        '',
        'LIMIT = 400              # milliamps: above this the motor is in trouble',
        '',
        'def read_ma():',
        '    data = i2c.readfrom_mem(ADDR, 1, 2)',
        '    raw = (data[0] << 8) | data[1]',
        '    if raw > 32767:',
        '        raw = raw - 65536',
        '    return raw * 0.1',
        '',
        'def start():',
        '    motor.on()',
        '    sleep(0.5)           # let the start-up surge pass',
        '',
        'start()',
        'over = 0',
        '',
        'while True:',
        '    ma = read_ma()',
        '    print("%.0f mA" % ma)',
        '    if ma > LIMIT:',
        '        over = over + 1',
        '    else:',
        '        over = 0',
        '    if over >= 3:',
        '        motor.off()',
        '        print("overload: resting 3 seconds")',
        '        sleep(3)',
        '        start()',
        '        over = 0',
        '    sleep(0.1)'
      ],
      explain: [
        E([6], 'ה-MOSFET משמש כאן כמתג פשוט, שרק דולק או כבוי, בלי PWM.', 'The MOSFET serves here as a plain switch: on or off, with no PWM.'),
        E([8], 'זה הסף, ב-[[ma|מיליאמפר]]. הוא תלוי במנוע, ואת הערך הנכון מוצאים בניסוי.', 'The threshold, in [[ma|milliamps]]. It depends on the motor, and the right value is found by experiment.'),
        E([10, 15], 'הפונקציה קוראת את המתח על [[shunt|נגד המדידה]] והופכת אותו למיליאמפר, כמו בעמוד של הרכיב.', 'Reads the voltage across the [[shunt|shunt resistor]] and turns it into milliamps, as on the part\'s page.'),
        E([17, 19], 'ההתנעה. מנוע שמתחיל לזוז צורך לרגע זרם גבוה מאוד, ולכן מחכים חצי שנייה לפני שמתחילים לבדוק.', 'Starting. A motor that begins to move draws a very high current for a moment, so half a second passes before checking begins.'),
        E([27, 30], 'השורות סופרות כמה מדידות רצופות היו מעל הסף. מדידה תקינה אחת מאפסת את הספירה.', 'Counts how many measurements in a row were above the threshold. A single normal measurement resets the count.'),
        E([31, 36], 'אחרי שלוש מדידות חריגות ברצף, כלומר 0.3 שנייה, התוכנית מנתקת את המנוע, מחכה ומנסה שוב.', 'Three abnormal measurements in a row, that is 0.3 seconds: cut off, wait, and try again.')
      ],
      expect: B('המנוע מסתובב, ומודפס זרם של כמה עשרות עד כמה מאות מיליאמפר. כשבולמים את הציר הזרם קופץ, ואחרי שליש שנייה המנוע מתנתק ומודפסת הודעה. אחרי שלוש שניות הוא מנסה שוב.', 'The motor turns, and a current of a few tens to a few hundred milliamps is printed. When the shaft is braked the current jumps, and after a third of a second the motor is cut off and a message is printed. After three seconds it tries again.'),
      tasks: [
        { t: B('מצאו את הסף שמתאים למנוע שלכם: רשמו את הזרם כשהמנוע מסתובב חופשי, ואת הזרם כשהוא בלום.', 'Find the right threshold for your motor: note the current while it spins freely, and the current while it is braked.'), hint: B('קבעו את `LIMIT` באמצע בין שני המספרים. אם ההגנה מנתקת בלי סיבה, הסף נמוך מדי. אם היא לא מנתקת כשבולמים, הסף גבוה מדי.', 'Set `LIMIT` halfway between the two numbers. If the safeguard trips for no reason, the threshold is too low. If it does not trip when you brake, it is too high.') },
        { t: B('מחקו את ההמתנה שבתוך `start`. מה קורה, ולמה?', 'Delete the wait inside `start`. What happens, and why?'), hint: B('ההגנה עלולה לנתק מיד בכל התנעה, והמנוע לא יצליח להתחיל לפעול. בעיני התוכנית, זרם ההתנעה נראה כמו עומס יתר. לכן כל הגנה אמיתית מתעלמת מהרגע הראשון.', 'The safeguard may trip at once on every start, and the motor never gets going. The start-up current looks like an overload to the program. This is why every real safeguard ignores the first moment.') },
        { t: B('אחרי שלוש תקלות ברצף, המנוע נשאר מנותק עד שמריצים את התוכנית מחדש.', 'After three faults in a row, the motor stays cut off until the program is run again.'), hint: B('הוסיפו מונה `faults` שגדל בכל ניתוק. כשהוא מגיע ל-3, הדפיסו הודעה וצאו מהלולאה בעזרת `break`. מכונה שמנסה שוב ושוב בלי סוף עלולה להישרף.', 'A `faults` counter that rises on each cut-off. When it reaches 3, print a message and leave the loop with `break`. A machine that retries without end may burn out.'),
          code: ['faults = 0', '', '    if over >= 3:', '        motor.off()', '        faults = faults + 1', '        if faults >= 3:', '            print("giving up: check the motor")', '            break', '        sleep(3)', '        start()', '        over = 0'] }
      ],
      quiz: [
        Q(B('למה ההגנה מחכה לשלוש מדידות חריגות, ולא מנתקת כבר אחרי הראשונה?', 'Why does the safeguard wait for three abnormal measurements instead of cutting off at the first?'),
          [B('כדי לחסוך בסוללות', 'To save the batteries'), B('כי קפיצה רגעית בזרם היא דבר רגיל, ורק עומס שנמשך הוא בעיה', 'Because a momentary spike in current is normal, and only a load that lasts is a problem'), B('כי מד הזרם איטי', 'Because the current meter is slow')], 1,
          B('מנוע צורך לרגע יותר זרם בכל פעם שהעומס עליו משתנה. הגנה שמגיבה לכל קפיצה תנתק את המנוע כל הזמן.', 'A motor briefly draws more on every change of load. A safeguard that reacts to every spike cuts off constantly.'))
      ]
    },

    /* ============================================================ H5 */
    {
      id: 'H5', track: 'H',
      title: B('משקל מטבח עם כפתור איפוס', 'A kitchen scale with a tare button'),
      goal: B('משקל דיגיטלי שמציג גרמים על מסך. כפתור מאפס אותו, כך שאפשר להניח קערה, לאפס את המשקל, ולשקול רק את מה שבתוכה.', 'A digital scale that shows grams on a display. A button zeroes it, so a bowl can be put on, zeroed, and only its contents weighed.'),
      learn: [
        B('איך קוראים תא עומס בעזרת מודול HX711, [[bit|ביט]] אחרי ביט.', 'To read a load cell with an HX711 module, [[bit|bit]] by bit.'),
        B('איך מכיילים: הופכים מספר גולמי ליחידות אמיתיות.', 'To calibrate: turning a raw number into real units.'),
        B('מה זה איפוס (טרה), ולמה הוא בסך הכול חיסור.', 'To understand what taring is, and why it is just a subtraction.'),
        B('איך מייצבים מדידה בעזרת ממוצע.', 'To steady a measurement with an average.')
      ],
      before: [
        PART('hx711', 'העמוד של המשקל (HX711)', 'The scale\'s page (HX711)', 'שם מוסבר איך מרכיבים את תא העומס, ואיך הקריאה עובדת.', 'It explains how the load cell is mounted and how the reading works.'),
        LESSON('C3'), LESSON('H3')
      ],
      parts: [{ id: 'hx711', qty: 1 }, { id: 'oled', qty: 1 }, { id: 'button', qty: 1 }, { text: B('חפץ במשקל ידוע לכיול: חבילת סוכר של קילו, או בקבוק מים מלא של חצי ליטר (כ-520 גרם)', 'A known weight for calibration: a one-kilo bag of sugar, or a full half-litre water bottle (about 520 grams)') }, { text: B('עשרה חוטי גישור', 'Ten jumper wires') }],
      wiring: [
        W(B('משקל, GND ומסך, GND', 'Scale GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('משקל, DT', 'Scale, DT'), 'GP20', 26, null, 'DT'),
        W(B('משקל, SCK', 'Scale, SCK'), 'GP21', 27, null, 'SCK'),
        W(B('משקל, VCC ומסך, VCC', 'Scale VCC and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('מסך, SDA', 'Display, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מסך, SCL', 'Display, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('איפוס', 'Tare')),
        W(B('כפתור, הרגל שמולה', 'Button, the opposite leg'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('ודאו שקצה אחד של תא העומס מוברג לבסיס יציב ושהקצה השני חופשי, כמו בעמוד של הרכיב. הניחו צלחת קלה על הקצה החופשי.', 'Make sure the load cell is bolted to a steady base at one end, with the other end free, as on the part\'s page. Put a light plate on the free end.'),
        B('מודול ה-HX711 נשאר מחוץ למטריצה, כמו בציור. ודאו שארבעת החוטים של תא העומס מחוברים אליו: האדום ל-`E+`, השחור ל-`E−`, הלבן ל-`A−` והירוק ל-`A+`.', 'The HX711 module stays off the breadboard, as in the picture. Make sure the load cell\'s four wires are joined to it: red to `E+`, black to `E−`, white to `A−` and green to `A+`.'),
        B('חברו את ארבעת הפינים של המודול בחוטים עם קצה נקבה. הכניסו את המסך ואת הכפתור למטריצה, וחברו אותם לפי הטבלה.', 'Connect the module\'s four pins with female-ended wires. Push in the display and the button, and connect them following the table.'),
        RAILS,
        B('ודאו שהצלחת ריקה, כי התוכנית מאפסת את המשקל ברגע שהיא מתחילה לרוץ.', 'Make sure the plate is empty. The program zeroes the scale the moment it starts.'),
        PLUG, RUN,
        B('הניחו את החפץ שמשקלו ידוע. המספר שמוצג עדיין לא נכון. רשמו אותו.', 'Put the known weight on. The number shown is not right yet. Write it down.'),
        B('כיול: הערך החדש של `SCALE` הוא 400 כפול המספר שרשמתם, חלקי המשקל האמיתי בגרמים. כתבו אותו בשורה 10, והריצו שוב.', 'Calibration: the new `SCALE` is 400 times the number you wrote down, divided by the true weight in grams. Write it on line 10 and run again.'),
        B('הניחו כוס ריקה ולחצו על הכפתור. עכשיו מזגו לתוכה מים.', 'Put an empty cup on and press the button. Now pour water into it.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        '',
        'dt = Pin(20, Pin.IN)',
        'sck = Pin(21, Pin.OUT, value=0)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        '',
        'SCALE = 400                # raw steps per gram: set this by calibrating',
        '',
        'def read_raw():',
        '    while dt.value() == 1:',
        '        pass',
        '    value = 0',
        '    for i in range(24):',
        '        sck.on()',
        '        sck.off()',
        '        value = (value << 1) | dt.value()',
        '    sck.on()',
        '    sck.off()',
        '    if value & 0x800000:',
        '        value = value - 0x1000000',
        '    return value',
        '',
        'def average(times):',
        '    total = 0',
        '    for i in range(times):',
        '        total = total + read_raw()',
        '    return total // times',
        '',
        'def show(line):',
        '    oled.fill(0)',
        '    oled.text("Scale", 0, 0)',
        '    oled.text(line, 0, 28)',
        '    oled.show()',
        '',
        'show("zeroing...")',
        'zero = average(10)',
        '',
        'while True:',
        '    if button.value() == 0:',
        '        show("zeroing...")',
        '        zero = average(10)',
        '    grams = (average(5) - zero) / SCALE',
        '    show("%.0f g" % grams)'
      ],
      explain: [
        E([4, 8], 'השורות מגדירות שלושה פינים רגילים, למשקל ולכפתור, ואפיק I2C למסך.', 'Three ordinary pins for the scale and the button, and an I2C bus for the display.'),
        E([10], 'זה מספר המדרגות הגולמיות בגרם אחד, והכיול נועד למצוא אותו.', 'How many raw steps there are in one gram. This is the number calibration finds.'),
        E([12, 24], 'זו הקריאה מהעמוד של הרכיב: הפונקציה מחכה למדידה, קוראת 24 ביטים, ומתקנת מספר שלילי.', 'The reading from the part\'s page: waits for a measurement, reads 24 bits, and corrects a negative number.'),
        E([26, 30], 'הפונקציה מחשבת ממוצע של כמה קריאות. `//` מחלק ומשאיר מספר שלם.', 'An average of several readings. `//` divides and keeps a whole number.'),
        E([32, 36], 'פונקציה קטנה שמציגה שורה אחת על המסך. בזכותה לא צריך לחזור על אותן ארבע שורות שלוש פעמים.', 'A small function that shows one line on the display. This avoids repeating the same four lines three times.'),
        E([38, 39], 'האיפוס הראשון: מדידה כשהצלחת ריקה. עשר קריאות, שנמשכות כשנייה אחת.', 'The first zeroing: the measurement with the plate empty. Ten readings, about one second.'),
        E([42, 44], 'כשלוחצים על כפתור האיפוס, התוכנית מודדת שוב, ומה שמונח עכשיו על המשקל הופך לאפס החדש.', 'The tare button: measures again, and whatever is on the scale now becomes the new zero.'),
        E([45], 'המשקל הוא ההפרש מהאפס, חלקי היחס. זה כל הסוד של האיפוס: חיסור.', 'The weight is the difference from zero, divided by the ratio. That is the whole secret of taring: a subtraction.'),
        E([46], 'אין כאן `sleep`, כי חמש הקריאות נמשכות בעצמן חצי שנייה: המודול מודד עשר פעמים בשנייה.', 'There is no `sleep` here. Five readings take half a second by themselves, because the module measures ten times a second.')
      ],
      expect: B('בהתחלה כתוב "zeroing..." ואחר כך "0 g". אחרי הכיול, החפץ שמשקלו ידוע מציג את הערך הנכון. לחיצה על הכפתור מחזירה את התצוגה ל-0, עם כל מה שמונח על המשקל. החזיקו את הכפתור כשנייה: התוכנית בודקת אותו רק בין מדידה למדידה, ולחיצה קצרה מאוד עלולה להתפספס.', 'At first it reads "zeroing..." and then "0 g". After calibration the known weight shows its true value. A press on the button returns the display to 0, with whatever is on the scale. Hold the button for about a second: the program checks it only between measurements, and a very short press may be missed.'),
      tasks: [
        { t: B('התצוגה מרצדת בין 0, 1 ומינוס 1 גם כשהמשקל ריק. הסתירו את הריצוד הזה.', 'The display flickers between 0, 1 and minus 1 even when the scale is empty. Hide that.'), hint: B('[[deadzone|אזור מת]]: אם הערך המוחלט של `grams` קטן מ-2, מציגים 0. כל משקל מסחרי עושה את זה.', 'A [[deadzone|dead zone]]: if the absolute value of `grams` is under 2, show 0. Every commercial scale does this.'),
          code: ['    if abs(grams) < 2:', '        grams = 0'] },
        { t: B('מונה חלקים: שוקלים בורג אחד, ואז המסך מראה כמה ברגים מונחים על המשקל.', 'A parts counter: weigh one screw, and then the display shows how many screws are on the scale.'), hint: B('הגדירו קבוע `ONE` עם המשקל של חלק אחד בגרמים. מספר החלקים הוא `round(grams / ONE)`. `round` מעגל למספר השלם הקרוב.', 'A constant `ONE` holding the weight of one part in grams. The number of parts is `round(grams / ONE)`. `round` rounds to the nearest whole number.') },
        { t: B('הוסיפו את הבאזר משיעור B4: צפצוף קצר כשהמשקל עובר 500 גרם, פעם אחת בלבד.', 'Add the buzzer from lesson B4: a short beep when the weight passes 500 grams, once only.'), hint: B('השתמשו במשתנה `beeped` שזוכר שכבר היה צפצוף. צפצפו רק כש-`grams > 500` ו-`beeped` הוא `False`, ואפסו אותו כשהמשקל יורד מתחת ל-450.', 'A `beeped` variable that remembers the beep already happened. Beep only when `grams > 500` and `beeped` is `False`. Reset it when the weight drops below 450.') }
      ],
      quiz: [
        Q(B('מניחים קערה של 200 גרם ולוחצים על כפתור האיפוס. מה קרה בתוכנית?', 'A 200 gram bowl is put on and the tare button pressed. What happened in the program?'),
          [B('הקערה נמחקה מהזיכרון של המודול', 'The bowl was erased from the module\'s memory'), B('המשתנה `zero` קיבל את המדידה הנוכחית, ומעכשיו היא מוחסרת מכל מדידה', 'The `zero` variable took the current measurement, and from now on it is subtracted from every measurement'), B('`SCALE` השתנה', '`SCALE` changed')], 1,
          B('המודול ממשיך למדוד הכול, כולל הקערה. רק נקודת האפס זזה.', 'The module goes on measuring everything, the bowl included. Only the zero point moved.'))
      ]
    },

    /* ============================================================ H6 */
    {
      id: 'H6', track: 'H',
      title: B('זרוע שחוזרת על רצף תנועות', 'An arm that repeats a sequence of moves'),
      goal: B('שלושה מנועי סרבו שמחוברים לבקר אחד עוברים בתנועה חלקה בין תנוחות ששמורות ברשימה, כמו זרוע במפעל שחוזרת שוב ושוב על אותה פעולה.', 'Three servos on one controller pass between poses stored in a list, moving smoothly. Like a factory arm repeating the same action.'),
      learn: [
        B('איך שולטים בהרבה סרוואים דרך בקר PCA9685, בעזרת שני פינים בלבד.', 'To control many servos through a PCA9685 controller, on two pins.'),
        B('איך שומרים תנוחות ב[[list|רשימה]] של שלשות.', 'To store poses in a [[list|list]] of triples.'),
        B('איך נעים בהדרגה בין שתי תנוחות, כך שכל המפרקים מגיעים יחד.', 'To move gradually between two poses, with all joints arriving together.'),
        B('איך מזינים מנועים מספק נפרד.', 'To feed motors from a separate supply.')
      ],
      before: [
        BASICS('python2', 'יסודות: עוד Python', 'Basics: More Python', 'רשימות, ולולאות שעוברות על רשימות.', 'Lists and loops over lists.'),
        PART('pca9685', 'העמוד של בקר הסרוואים', 'The servo controller\'s page', 'שם מוסברת הפונקציה `angle`.', 'The `angle` function is explained there.'),
        LESSON('B5'), LESSON('E4')
      ],
      parts: [{ id: 'pca9685', qty: 1 }, { id: 'servo', qty: 3 }, { text: B('ספק 5V של 2 אמפר לפחות, או בית לארבע סוללות AA', 'A 5 V supply of at least 2 amps, or a holder with four AA batteries') }, { text: B('חמישה חוטי גישור עם קצה נקבה', 'Five jumper wires with a female end') }],
      wiring: [
        W(B('בקר, GND', 'Controller, GND'), 'GND', 38, null, 'GND'),
        W(B('בקר, SCL', 'Controller, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('בקר, SDA', 'Controller, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('בקר, VCC', 'Controller, VCC'), '3V3', 36, B('הזנה לשבב בלבד', 'power for the chip only'), '3.3V'),
        W(B('בקר, V+', 'Controller, V+'), 'VBUS', 40, B('5V לסרוואים, אבל זה מספיק לסרבו אחד בלבד', '5 V for the servos. Enough for one servo only'), '5V')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את חמשת הפינים של הבקר לפי הטבלה.', 'Connect the controller\'s five pins following the table.'),
        B('ניסוי ראשון, עם סרבו אחד: חברו סרבו לשלשת הפינים שמסומנת 0, כשהחוט החום או השחור בצד של `GND`. בציור, הקו הכתום שבין הבקר לכל סרבו מייצג את הכבל המשולש של הסרבו.', 'A first trial, with one servo: push a servo onto the set of three marked 0, with the brown or black wire on the `GND` side. In the picture, the orange line between the controller and each servo is the servo\'s three-wire cable.'),
        PLUG, RUN,
        B('הסרבו נע בין התנוחות, וזה מוכיח שהבקר מחובר נכון. עצרו את התוכנית ונתקו את ה-USB.', 'The servo moves between the poses. This proves the controller is connected correctly. Stop the program and unplug the USB.'),
        B('שלושה סרוואים שזזים יחד צורכים יותר זרם ממה ש-USB מספק. לכן הוציאו את החוט שבין `V+` ל-`VBUS`, והבריגו ספק של 5V למהדק הבורג הכחול של הבקר: את הפלוס ל-`V+` ואת המינוס ל-`GND`.', 'Three servos moving together draw more than USB gives. So remove the wire between `V+` and `VBUS`, and screw a 5 V supply into the controller\'s blue screw terminal: plus to `V+`, minus to `GND`.'),
        B('חברו עוד שני סרוואים לשלשות 1 ו-2.', 'Push two more servos onto the sets marked 1 and 2.'),
        B('אם יש לכם ערכת זרוע: 0 הוא הבסיס, 1 הוא הכתף ו-2 הוא הצבת. אם אין לכם ערכה, הדביקו פס נייר על כל סרבו, כדי לראות את התנועה.', 'If you have an arm kit: 0 is the base, 1 the shoulder and 2 the gripper. With no kit, stick a strip of paper on each servo, to see the movement.'),
        B('ודאו שיש לזרוע מקום לנוע. חברו את ה-USB, ואחריו את הספק של הסרוואים, והריצו שוב.', 'Make sure the arm has room to move. Plug in the USB, then the servos\' supply, and run again.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep, sleep_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x40',
        '',
        'def write(reg, value):',
        '    i2c.writeto_mem(ADDR, reg, bytes([value]))',
        '',
        'write(0x00, 0x10)',
        'write(0xFE, 121)',
        'write(0x00, 0x20)',
        'sleep_ms(5)',
        '',
        'def angle(channel, deg):',
        '    us = 500 + deg * 2000 // 180',
        '    ticks = us * 4096 // 20000',
        '    i2c.writeto_mem(ADDR, 0x06 + 4 * channel, bytes([0, 0, ticks & 0xFF, ticks >> 8]))',
        '',
        'POSES = [',
        '    (90, 90, 90),        # rest',
        '    (40, 120, 90),       # reach to the left',
        '    (40, 120, 30),       # close the gripper',
        '    (140, 60, 30),       # carry to the right',
        '    (140, 60, 90),       # open the gripper',
        ']',
        '',
        'current = [90, 90, 90]',
        'for ch in range(3):',
        '    angle(ch, current[ch])',
        '',
        'def move_to(pose, steps=25):',
        '    start = current[:]',
        '    for s in range(1, steps + 1):',
        '        for ch in range(3):',
        '            current[ch] = start[ch] + (pose[ch] - start[ch]) * s // steps',
        '            angle(ch, current[ch])',
        '        sleep(0.02)',
        '',
        'while True:',
        '    for pose in POSES:',
        '        move_to(pose)',
        '        sleep(0.5)'
      ],
      explain: [
        E([4, 18], 'ההכנה והפונקציה `angle`, בדיוק כמו בעמוד של הרכיב: הפונקציה מסובבת את הסרבו שביציאה מספר `channel` לזווית `deg`.', 'The set-up and the `angle` function, exactly as on the part\'s page: output number `channel` turns to angle `deg`.'),
        E([20, 26], 'זו רשימת התנוחות. כל תנוחה היא שלוש זוויות: בסיס, כתף וצבת. כדי ללמד את הזרוע תנועה חדשה, משנים רק את הרשימה הזו.', 'A list of poses. Each pose is three angles: base, shoulder, gripper. To teach the arm a new move, only this list changes.'),
        E([28, 30], 'הרשימה הזו שומרת איפה הזרוע נמצאת עכשיו. מתחילים מהאמצע, ושולחים את שלושת המפרקים לשם.', 'Where the arm is now. It starts from the middle, and the three joints are sent there.'),
        E([32], 'פונקציה שעוברת לתנוחה חדשה ב-25 צעדים קטנים. `steps=25` הוא ערך ברירת מחדל, ולכן אפשר לקרוא לפונקציה גם בלי לציין אותו.', 'A function that moves to a new pose in 25 small steps. `steps=25` is a default value: the function can be called without stating it.'),
        E([33], '`current[:]` יוצר עותק של הרשימה. בלי העותק, `start` היה משתנה יחד עם `current`, והחישוב היה משתבש.', '`current[:]` makes a copy of the list. Without the copy, `start` would change along with `current` and the sum would go wrong.'),
        E([34, 37], 'בכל צעד, כל מפרק מתקדם חלק יחסי מהדרך שלו. מפרק שצריך לזוז הרבה זז מהר, מפרק שצריך לזוז מעט זז לאט, וכולם מגיעים באותו רגע.', 'On each step, every joint advances a proportional part of its way. A joint with far to go moves fast, one with little to go moves slowly, and all arrive at the same moment.'),
        E([38], '25 צעדים של 20 אלפיות שנייה, ולכן כל מעבר נמשך חצי שנייה.', '25 steps of 20 milliseconds: each move takes half a second.'),
        E([40, 43], 'הלולאה עוברת על התנוחות לפי הסדר, עם הפסקה קצרה בכל אחת, וחוזרת על הרצף שוב ושוב.', 'Goes through the poses in order, with a short pause at each, and repeats.')
      ],
      expect: B('הזרוע עוברת בין חמש התנוחות בתנועה רכה, עוצרת לחצי שנייה בכל אחת, ומתחילה מחדש. שלושת המפרקים מתחילים ומסיימים כל תנועה יחד.', 'The arm passes between the five poses in a soft motion, stops for half a second at each, and starts over. The three joints begin and end each move together.'),
      tasks: [
        { t: B('קראו ל-`move_to(pose, 1)`, ואחר כך ל-`move_to(pose, 100)`. מה ההבדל, ומה עדיף לזרוע אמיתית?', 'Call `move_to(pose, 1)` and then `move_to(pose, 100)`. What is the difference, and which is better for a real arm?'), hint: B('בצעד אחד הזרוע קופצת בבת אחת, וזה מטלטל אותה וצורך זרם גבוה. במאה צעדים היא נעה לאט ובעדינות. תנועה חלקה שומרת על המנועים ועל מה שהזרוע מחזיקה.', 'In one step the arm jumps with a jolt, which shakes it and draws a high current. In a hundred steps it moves slowly and gently. A smooth motion spares the motors and whatever the arm is holding.') },
        { t: B('הוסיפו לכל תנוחה מספר רביעי: כמה זמן לחכות בה.', 'Add a fourth number to each pose: how long to wait at it.'), hint: B('כתבו למשל `(40, 120, 30, 1.5)`. הלולאה שב-`move_to` עוברת רק על שלושת המספרים הראשונים, ולכן אין צורך לשנות אותה. בלולאה הראשית כתבו `sleep(pose[3])`.', 'Write, for example, `(40, 120, 30, 1.5)`. The loop in `move_to` only goes over the first three, so it needs no change. In the main loop write `sleep(pose[3])`.') },
        { t: B('מצב הפעלה יחידה: כפתור על `GP14` מפעיל את הרצף פעם אחת, ואז הזרוע מחכה ללחיצה הבאה.', 'A single-run mode: a button on `GP14` plays the sequence once, and the arm waits for the next press.'), hint: B('בלולאה הראשית חכו שהכפתור יחזיר 0, ורק אז עברו על התנוחות. בסוף החזירו את הזרוע לתנוחת המנוחה.', 'In the main loop, wait for the button to read 0, and only then go through the poses. At the end return to the rest pose.'),
          code: ['button = Pin(14, Pin.IN, Pin.PULL_UP)', '', 'while True:', '    if button.value() == 0:', '        for pose in POSES:', '            move_to(pose)', '            sleep(0.5)', '        move_to(POSES[0])', '    sleep(0.02)'] }
      ],
      quiz: [
        Q(B('למה הסרוואים מקבלים מתח מספק נפרד, ולא מה-Pico?', 'Why are the servos fed from a separate supply and not from the Pico?'),
          [B('כי הם צריכים 12V', 'Because they need 12 V'), B('כי כמה סרוואים יחד צורכים יותר זרם ממה ש-USB מספק, וה-Pico היה מתאפס', 'Because several servos together draw more current than USB gives, and the Pico would reset'), B('כי I2C לא עובד בלי ספק נפרד', 'Because I2C does not work without a separate supply')], 1,
          B('זו [[brownout|נפילת מתח]]: המנועים מושכים זרם, המתח צונח והלוח מתאפס. ספק נפרד עם אדמה משותפת פותר את הבעיה.', 'This is a [[brownout|brown-out]]: the motors pull current, the voltage sags, and the board resets. A separate supply with a common ground solves it.'))
      ]
    },

    /* ============================================================ H7 */
    {
      id: 'H7', track: 'H',
      title: B('תרמוסטט: שמירה על טמפרטורה', 'A thermostat: holding a temperature'),
      goal: B('חיישן חום וממסר שומרים על טמפרטורה קבועה: הממסר מדליק גוף חימום כשקר מדי, ומכבה אותו כשחם מדי. אם החיישן מתנתק, החימום נכבה.', 'A heat probe and a relay hold a steady temperature: the relay switches a heater on when it is too cold and off when it is too hot. If the probe comes loose, the heating goes off.'),
      learn: [
        B('איך קוראים [[thermocouple|צמד תרמי]] דרך [[spi|SPI]].', 'To read a [[thermocouple|thermocouple]] over [[spi|SPI]].'),
        B('איך בונים בקרה עם שני ספים, כדי שהממסר לא יתקתק.', 'To build control with two thresholds, so the relay does not chatter.'),
        B('איך מתכננים מה יקרה כשמשהו מתקלקל: מצב בטוח.', 'To plan what happens when something fails: a safe state.')
      ],
      before: [
        BASICS('buses', 'יסודות: I2C, SPI ו-UART', 'Basics: I2C, SPI and UART'),
        PART('max6675', 'העמוד של מד החום MAX6675', 'The MAX6675 thermometer\'s page', 'שם מוסברת הפונקציה `read_temp`.', 'The `read_temp` function is explained there.'),
        LESSON('E1')
      ],
      parts: [{ id: 'max6675', qty: 1 }, { id: 'relay', qty: 1 }, { text: B('מעגל שאותו מפעילים: בית סוללות ונורת להט קטנה (נורה של פנס). הנורה משמשת כאן כגוף החימום', 'A circuit to switch: a battery holder and a small filament bulb (a torch bulb). The bulb serves here as the heater') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('מד חום, GND וממסר, GND', 'Thermometer GND and relay GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('מד חום, VCC', 'Thermometer, VCC'), '3V3', 36, null, '3.3V'),
        W(B('מד חום, SCK', 'Thermometer, SCK'), 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK'), 'SCK'),
        W(B('מד חום, CS', 'Thermometer, CS'), 'GP17', 22, null, 'CS'),
        W(B('מד חום, SO', 'Thermometer, SO'), 'GP16', 21, B('SPI0 RX', 'SPI0 RX'), 'SO'),
        W(B('ממסר, VCC', 'Relay, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('ממסר, IN', 'Relay, IN'), 'GP21', 27, null, B('ממסר', 'Relay'))
      ],
      steps: [
        UNPLUG, CLEAR,
        B('מודול מד החום ומודול הממסר נשארים מחוץ למטריצה, כמו בציור. חברו את חמשת הפינים של מד החום לפי הטבלה, בחוטים עם קצה נקבה. הבריגו את שני החוטים של החיישן למהדק שלו, כשהחוט האדום הולך לפלוס.', 'The thermometer module and the relay module stay off the breadboard, as in the picture. Connect the thermometer\'s five pins with female-ended wires, following the table. Screw the probe\'s two wires into its terminal: the red one to plus.'),
        B('חברו את שלושת הפינים של מודול הממסר.', 'Connect the relay module\'s three pins.'),
        RAILS,
        B('המעגל הנפרד, כמו בשיעור E1: חברו את הפלוס של הסוללות למהדק `COM`, חוט ממהדק `NO` אל הנורה, ומהנורה חוט אל המינוס של הסוללות.', 'The separate circuit, as in lesson E1: the batteries\' plus to the `COM` terminal, a wire from the `NO` terminal to the bulb, and from the bulb to the batteries\' minus.'),
        B('הצמידו את קצה החיישן לזכוכית של הנורה בעזרת סרט דבק.', 'Fix the probe tip against the bulb\'s glass with sticky tape.'),
        PLUG, RUN,
        B('עקבו אחרי ההדפסות במשך כמה דקות. הנורה נדלקת ונכבית מעצמה.', 'Follow the printout for a few minutes. The bulb switches on and off by itself.'),
        B('שחררו מהמהדק חוט אחד של החיישן, וראו מה קורה. אחר כך הבריגו אותו בחזרה.', 'Loosen one of the probe\'s wires from the terminal, and see what happens. Screw it back.'),
        READ
      ],
      code: [
        'from machine import Pin, SPI',
        'from time import sleep',
        '',
        'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))',
        'cs = Pin(17, Pin.OUT, value=1)',
        'relay = Pin(21, Pin.OUT)',
        '',
        'TARGET = 35.0            # degrees C to hold',
        'BAND = 1.0               # how far it may drift each way',
        '',
        'def read_temp():',
        '    cs.low()',
        '    data = spi.read(2)',
        '    cs.high()',
        '    value = (data[0] << 8) | data[1]',
        '    if value & 0x04:',
        '        return None',
        '    return (value >> 3) * 0.25',
        '',
        'heating = False',
        '',
        'while True:',
        '    t = read_temp()',
        '    if t is None:',
        '        heating = False',
        '        print("no probe: heater off")',
        '    else:',
        '        if t < TARGET - BAND:',
        '            heating = True',
        '        elif t > TARGET + BAND:',
        '            heating = False',
        '        print("%.2f C   heater %s" % (t, "ON" if heating else "off"))',
        '    relay.value(heating)',
        '    sleep(1)'
      ],
      explain: [
        E([4, 6], 'השורות יוצרות אפיק SPI וקו בחירה למד החום, ופין רגיל לממסר.', 'An SPI bus and a select line for the thermometer, and an ordinary pin for the relay.'),
        E([8, 9], 'הטמפרטורה הרצויה, ורוחב התחום שסביבה. עם הערכים האלה, החימום נדלק מתחת ל-34 ונכבה מעל 36.', 'The wanted temperature, and the width of the band around it. With these values, switch on below 34 and off above 36.'),
        E([11, 18], 'זו הקריאה מהעמוד של הרכיב. הפונקציה מחזירה `None` כשהחיישן מנותק.', 'The reading from the part\'s page. It returns `None` when the probe is disconnected.'),
        E([20], 'המשתנה הזה זוכר אם החימום דולק, מסיבוב לסיבוב של הלולאה.', 'Whether the heating is on. This variable remembers the state from one turn to the next.'),
        E([24, 26], 'המצב הבטוח: אם אין מדידה, אין חימום. תרמוסטט שלא יודע מה הטמפרטורה חייב לכבות את החימום.', 'The safe state: no measurement, no heating. A thermostat that does not know the temperature must switch off.'),
        E([28, 31], 'שני הספים. בין 34 ל-36 אף אחד מהתנאים לא מתקיים, והמצב נשאר כמו שהיה. זה מה שמונע מהממסר לתקתק.', 'The two thresholds. Between 34 and 36 neither condition holds, and the state stays as it was. This is what stops the relay chattering.'),
        E([32], 'השורה מדפיסה את הטמפרטורה ואת המצב. `"ON" if heating else "off"` בוחר אחת משתי מילים.', 'Prints the temperature and the state. `"ON" if heating else "off"` picks one of two words.'),
        E([33], 'רק במקום אחד בקוד קובעים את מצב הממסר, לפי המשתנה.', 'In one place only, the relay is set from the variable.')
      ],
      expect: B('הנורה נדלקת, והטמפרטורה שמודפסת עולה. מעל 36 מעלות נשמע קליק, והנורה נכבית. הטמפרטורה יורדת לאט, ומתחת ל-34 הנורה נדלקת שוב. כשמשחררים חוט של החיישן, מודפס "no probe" והנורה כבויה.', 'The bulb lights, and the printed temperature climbs. Above 36 degrees a click is heard and the bulb goes out. The temperature falls slowly, and below 34 the bulb lights again. When a probe wire is loosened "no probe" is printed and the bulb is off.'),
      tasks: [
        { t: B('קבעו את `BAND` ל-0 והריצו. מה שומעים כשהטמפרטורה מגיעה ליעד?', 'Set `BAND` to 0 and run. What do you hear when the temperature reaches the target?'), hint: B('הממסר מתקתק כל שנייה, כי המדידה קופצת ברבע מעלה סביב הסף, וזה שוחק את הממסר. תחום רחב יותר פירושו פחות מיתוגים, אבל גם טמפרטורה פחות מדויקת.', 'The relay clicks every second, because the measurement hops a quarter degree around the threshold. This wears the relay out. A wider band means fewer switchings, but a less exact temperature.') },
        { t: B('הגנה נוספת: אם החימום דולק חמש דקות ברצף והטמפרטורה עדיין מתחת ליעד, כבו את החימום והדפיסו שגיאה.', 'Another safeguard: if the heating has been on for five minutes straight and the temperature is still below the target, switch off and print an error.'), hint: B('השתמשו במונה שגדל ב-1 בכל שנייה שבה החימום דולק, ומתאפס כשהוא כבוי. כשהמונה עובר את 300, כבו את הממסר וצאו מהלולאה. ייתכן שהחיישן נפל מהנורה ומודד את החדר.', 'A counter that rises by 1 each second the heating is on and resets when it is off. When it passes 300, leave the loop after switching the relay off. Perhaps the probe fell off the bulb, and is measuring the room.'),
          code: ['on_time = 0', '', '    on_time = on_time + 1 if heating else 0', '    if on_time > 300:', '        relay.off()', '        print("error: heating for 5 minutes with no result")', '        break'] },
        { t: B('החליפו את הממסר במודול ה-MOSFET משיעור H1, והפכו את הבקרה לרכה: ככל שהטמפרטורה רחוקה יותר מהיעד, החימום חזק יותר.', 'Replace the relay with the MOSFET module from lesson H1, and make the control gentle: the further from the target, the harder it heats.'), hint: B('העוצמה היא `(TARGET - t) * 20000`, מוגבלת לטווח שבין 0 ל-65535, ונכתבת בעזרת `duty_u16`. כשהמרחק מהיעד הוא 3 מעלות או יותר החימום מלא, וליד היעד הוא חלש. כך הטמפרטורה מתייצבת בלי לעלות ולרדת שוב ושוב.', 'The power is `(TARGET - t) * 20000`, limited between 0 and 65535, and written with `duty_u16`. At 3 degrees away or more the heating is full, and near the target it is weak. This lets the temperature settle without rising and falling.') }
      ],
      quiz: [
        Q(B('הטמפרטורה היא 35.2 מעלות, היעד הוא 35 והתחום הוא 1. האם החימום דולק?', 'The temperature is 35.2 degrees, the target 35 and the band 1. Is the heating on?'),
          [B('כן', 'Yes'), B('לא', 'No'), B('זה תלוי במצב הקודם', 'It depends on what it was before')], 2,
          B('35.2 נמצא בין שני הספים, ושם המצב לא משתנה. אם הטמפרטורה הגיעה מלמטה החימום עדיין דולק, ואם היא הגיעה מלמעלה הוא כבוי.', '35.2 lies between the two thresholds, where the state does not change. Coming from below, the heating is still on; coming from above, it is off.'))
      ]
    }
  );
})(window.PICO);
