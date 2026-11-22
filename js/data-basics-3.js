/* Basics, chapter 14: what is different on the Pico 2.
   The board most often found in a lab may be a Pico, a Pico W, a Pico 2 or a Pico 2 W,
   and early Pico 2 chips have a known fault with the internal pull-down.
   Same block types as data-basics.js. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };

  P.basics.push({
    id: 'pico2',
    title: B('מה שונה ב-Pico 2', 'What is different on the Pico 2'),
    lead: B('פרק המשך קצר למי שיש לו גם לוחות ישנים יותר, או לוח Pico 2 מהסדרות הראשונות: מה השתנה מאז ה-Pico הראשון, ותקלה אחת בשבב שכדאי להכיר.', 'A short follow-on chapter for anyone who also has older boards, or a Pico 2 from the first batches. What changed since the first Pico, and one chip fault worth knowing.'),
    blocks: [
      { h: B('אותו לוח מבחוץ, שבב חדש מבפנים', 'Same board outside, a new chip inside') },
      { p: B('ה-Pico 2 נראה כמעט בדיוק כמו ה-Pico הראשון: אותו גודל, אותם 40 פינים באותו סדר ואותם מספרי GP. לכן רוב הקוד והחיווט עובדים על שניהם. ההבדל הוא בשבב: RP2350 במקום RP2040.', 'The Pico 2 looks almost the same as the first Pico: the same size, the same 40 pins in the same order, and the same GP numbers. So most code and wiring work on both. The difference is the chip: RP2350 instead of RP2040.') },
      { table: {
        head: [B('', ''), B('Pico (RP2040)', 'Pico (RP2040)'), B('Pico 2 (RP2350)', 'Pico 2 (RP2350)')],
        rows: [
          [B('מעבד', 'Processor'), B('2 ליבות Cortex-M0+, עד 133 MHz', '2 Cortex-M0+ cores, up to 133 MHz'), B('2 ליבות Cortex-M33, עד 150 MHz (או 2 ליבות RISC-V)', '2 Cortex-M33 cores, up to 150 MHz (or 2 RISC-V cores)')],
          [B('זיכרון RAM', 'RAM'), B('264 KB', '264 KB'), B('520 KB', '520 KB')],
          [B('זיכרון Flash על הלוח', 'Flash on the board'), B('2 MB', '2 MB'), B('4 MB', '4 MB')],
          [B('בלוקי PIO', 'PIO blocks'), B('2 (8 מכונות מצב)', '2 (8 state machines)'), B('3 (12 מכונות מצב)', '3 (12 state machines)')],
          [B('קובץ MicroPython', 'MicroPython file'), B('`RPI_PICO`', '`RPI_PICO`'), B('`RPI_PICO2`', '`RPI_PICO2`')],
          [B('שם הכונן ב-BOOTSEL', 'Drive name in BOOTSEL'), B('RPI-RP2', 'RPI-RP2'), B('RP2350', 'RP2350')]
        ]
      } },
      { tip: B('בגרסאות W של שני הלוחות יש גם שבב אלחוטי (Wi-Fi ו-Bluetooth), ולכל אחת מהן יש קובץ MicroPython משלה. הבורר בעמוד "מתחילים" מראה איזה קובץ מתאים לכל לוח.', 'The W versions of both boards also carry a wireless chip (Wi-Fi and Bluetooth), and have their own MicroPython file. The picker on the "Get started" page shows which file fits each board.') },

      { h: B('התקלה בנגד המשיכה למטה (E9)', 'The pull-down fault (E9)') },
      { p: B('בשבבי RP2350 מהגרסאות הראשונות יש תקלה מתועדת, שנקראת E9 ברשימת התקלות הרשמית. כניסה שמוגדרת עם `Pin.PULL_DOWN` נתקעת על כ-2.1V אחרי שהופעל עליה מתח גבוה, במקום לחזור ל-0. התוצאה היא שלחצן שמחובר ל-3V3 עם PULL_DOWN נשאר "לחוץ" גם אחרי שמשחררים אותו.', 'RP2350 chips from the first revisions have a documented fault, called E9 in the official errata list. An input set up with `Pin.PULL_DOWN` gets stuck at about 2.1 V after a high voltage was applied to it, instead of returning to 0. The result: a button wired to 3V3 with PULL_DOWN stays "pressed" after it is released.') },
      { p: B('לכן כל הלחצנים באתר מחוברים ל-GND עם `Pin.PULL_UP`: כשהלחצן לחוץ הפין קורא 0, וכשהוא משוחרר הפין קורא 1. השיטה הזו עובדת בכל ארבעת הלוחות ובכל גרסה של השבב.', 'That is why every button on this site is wired to GND with `Pin.PULL_UP`: while the button is pressed the pin reads 0, and when released 1. This works on all four boards and on every chip revision.') },
      { code: ['from machine import Pin', '', 'button = Pin(14, Pin.IN, Pin.PULL_UP)   # button between GP14 and GND', '', 'if button.value() == 0:', '    print("pressed")'] },
      { tip: B('צריכים בכל זאת נגד משיכה למטה? חברו נגד חיצוני של 8.2 קילו-אוהם או פחות בין הפין ל-GND, ואל תפעילו את ה-PULL_DOWN הפנימי.', 'Still need a pull-down? Fit an outside resistor of 8.2 kilo-ohms or less between the pin and GND, and do not turn on the internal PULL_DOWN.') },

      { h: B('איך יודעים איזו גרסה יש לכם', 'How to tell which revision I have') },
      { p: B('הגרסה מודפסת על השבב עצמו, בסוף שורת הכיתוב (למשל A2 או A4). בגרסה A4, משנת 2025, התקלה תוקנה. אבל לוחות מהסדרות הקודמות עדיין נמכרים ועדיין נמצאים במעבדות, ולכן האתר מניח שכל לוח עלול להיות ישן.', 'The revision is printed on the chip itself, at the end of the marking (for example A2 or A4). In revision A4, from 2025, the fault was fixed. But boards from earlier batches are still sold and still sit in labs, so the site assumes any board may be an old one.') },

      { h: B('5 וולט, RISC-V והלד שעל הלוח', '5 volts, RISC-V and the LED on the board') },
      { ul: [
        B('5V: בגרסה A4 הפינים עומדים ב-5V, אבל רק כאשר הלוח עצמו מוזן במתח. הכלל בכיתה לא משתנה: כל פין מיועד ל-3.3V בלבד, ולעולם לא מחברים אליו 5V.', '5 V: on revision A4 the pins tolerate 5 V, but only while the board itself is powered. The classroom rule does not change: every pin is 3.3 V only, and 5 V never goes into one.'),
        B('RISC-V: השבב יכול להריץ גם ליבות RISC-V במקום ARM, ויש גרסאות ניסיוניות של MicroPython בשבילן. בכיתה משתמשים בגרסה הרגילה (ARM), שבשבילה נכתבו כל הדוגמאות.', 'RISC-V: the chip can also run RISC-V cores instead of ARM, and there are experimental MicroPython builds for them. In class use the ordinary (ARM) build, which every example was written for.'),
        B('הלד שעל הלוח: ב-Pico וב-Pico 2 הוא מחובר ל-GP25. בגרסאות W הוא מחובר לשבב האלחוטי, ולכן `Pin(25)` לא מדליק אותו. `Pin("LED")`, כמו שמופיע באתר, עובד בכל הלוחות.', 'The LED on the board: on the Pico and the Pico 2 it is on GP25. On the W versions it is wired to the wireless chip, and `Pin(25)` does not light it. `Pin("LED")`, as used on this site, works on every board.')
      ] },

      { h: B('איך בודקים מה רץ על הלוח', 'Checking what runs on the board') },
      { code: ['import os, sys', '', 'print(os.uname().machine)   # e.g. Raspberry Pi Pico2 with RP2350', 'print(os.uname().release)   # the MicroPython version', 'print(sys.implementation)'] }
    ],
    quiz: [
      Q(B('לחצן מחובר בין GP14 ל-3V3, והפין מוגדר עם `Pin.PULL_DOWN`. ב-Pico 2 ישן, הלחצן נשאר "לחוץ" אחרי ששחררו אותו. מה הפתרון הפשוט?', 'A button is wired between GP14 and 3V3, and the pin is set with `Pin.PULL_DOWN`. On an older Pico 2 the button stays "pressed" after release. What is the simple fix?'),
        [B('להחליף את הלוח', 'Replace the board'), B('לחבר את הלחצן ל-GND ולהשתמש ב-`Pin.PULL_UP`', 'Wire the button to GND and use `Pin.PULL_UP`'), B('להוסיף `sleep` בלולאה', 'Add a `sleep` to the loop')], 1,
        B('זו התקלה E9. כשמשתמשים ב-PULL_UP ומחברים את הלחצן ל-GND, היא לא משפיעה בשום גרסה של השבב.', 'This is fault E9. With PULL_UP and the button to GND it has no effect, on any chip revision.')),
      Q(B('סטודנט צרב את הקובץ `RPI_PICO2` על Pico 2 W. מה יקרה כשיריצו `import network`?', 'A student flashed the file `RPI_PICO2` onto a Pico 2 W. What happens when `import network` is run?'),
        [B('זה יעבוד כרגיל', 'It works as usual'), B('תופיע שגיאה: אין מודול network, כי בקובץ הזה אין Wi-Fi', 'An error: there is no network module, because that file has no Wi-Fi'), B('הלוח יימחק', 'The board is erased')], 1,
        B('לכל לוח יש קובץ משלו, ול-Pico 2 W צריך את `RPI_PICO2_W`.', 'Each board has its own file. The Pico 2 W needs `RPI_PICO2_W`.')),
      Q(B('איזו שורה מדליקה את הלד שעל הלוח בכל ארבעת הלוחות?', 'Which line lights the LED on the board on all four boards?'),
        [B('`Pin(25, Pin.OUT).on()`', '`Pin(25, Pin.OUT).on()`'), B('`Pin("LED", Pin.OUT).on()`', '`Pin("LED", Pin.OUT).on()`'), B('`Pin(0, Pin.OUT).on()`', '`Pin(0, Pin.OUT).on()`')], 1,
        B('בגרסאות W הלד לא מחובר ל-GP25, והשם "LED" מתאים את עצמו ללוח.', 'On the W versions the LED is not on GP25. The name "LED" adapts to the board.'))
    ]
  });
})(window.PICO);
