/* The kinds of connection ("interfaces") of the Pico 2, written for a reader
   with no background: one plain sentence, an everyday comparison, how it
   works, when to use it, the wires, the pins, code explained line by line,
   things worth knowing, and a few check-yourself questions. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var E = function (lines, he, en) { return { l: lines, t: B(he, en) }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };

  P.interfaces = [
    /* ------------------------------------------------------------ GPIO */
    {
      id: 'gpio', type: 'gpio', filter: 'gpio', demo: 'gpio',
      name: B('GPIO, פין דיגיטלי', 'GPIO, a digital pin'),
      short: B('הבסיס לכל השאר: חוט אחד שהוא 0 או 1', 'The basis for everything else: one wire that is 0 or 1'),
      plain: B('[[gpio|GPIO]] הוא פין רגיל של ה-Pico. אפשר להשתמש בו כדי להדליק ולכבות משהו, או כדי לבדוק אם משהו דולק או כבוי.',
        '[[gpio|GPIO]] is an ordinary pin of the Pico. You can use it to switch something on and off, or to check whether something is on or off.'),
      analogy: B('מתג אור ונורה. כאשר הפין מוגדר כיציאה, ה-Pico הוא היד שמפעילה את המתג. כאשר הפין מוגדר ככניסה, ה-Pico הוא העין שבודקת אם הנורה דולקת.',
        'Think of a light switch and a bulb. When the pin is an output, the Pico is the hand on the switch. When the pin is an input, the Pico is the eye checking whether the bulb is lit.'),
      what: [
        B('השם הוא קיצור של General Purpose Input/Output, כלומר קלט ופלט לשימוש כללי. כל פין כזה מכיר רק שני מצבים, ולכן הוא [[digital|דיגיטלי]]: 0, שפירושו 0V, או 1, שפירושו 3.3V.',
          'The name is short for General Purpose Input/Output. Each such pin knows only two states, which makes it [[digital|digital]]: 0, which is 0 V, or 1, which is 3.3 V.'),
        B('הקוד קובע מה הפין עושה. כאשר הוא יציאה, התוכנית קובעת אם יש עליו מתח, וכך מדליקים לד. כאשר הוא כניסה, התוכנית קוראת אם משהו אחר הכניס אליו מתח, וכך יודעים שכפתור לחוץ.',
          'Your code decides what the pin does. As an output, the program sets whether it carries voltage, which is how you light an LED. As an input, the program reads whether something else has put voltage on it, which is how you know a button is pressed.'),
        B('לכניסה יש בעיה אחת: אם שום דבר לא מחובר אליה, היא "צפה", והקריאה שלה קופצת באקראי בין 0 ל-1. הפתרון הוא [[pullup|נגד משיכה]], כלומר נגד בתוך ה-Pico שמחזיק את הפין במצב 1 עד שמשהו מושך אותו ל-0. מפעילים אותו בקוד בעזרת `Pin.PULL_UP`.',
          'There is one problem with an input: if nothing is connected to it, it "floats", and its reading jumps randomly between 0 and 1. The fix is a [[pullup|pull-up resistor]]: a resistor inside the Pico that holds the pin at 1 until something pulls it to 0. You switch it on in code with `Pin.PULL_UP`.')
      ],
      when: [
        B('כאשר רוצים להדליק או לכבות משהו: לד, באזר פשוט או [[module|מודול]] ממסר.', 'When you want to switch something on or off: an LED, a simple buzzer, or a relay [[module|module]].'),
        B('כאשר רוצים לדעת "כן או לא": האם כפתור לחוץ, האם דלת פתוחה, האם חיישן תנועה זיהה מישהו.', 'When you want to know "yes or no": a button pressed, a door open, a motion sensor triggered.'),
        B('הוא לא מתאים כאשר רוצים לדעת "כמה". לשם כך יש [[adc|ADC]].', 'Not suitable when you want to know "how much". That is what [[adc|ADC]] is for.')
      ],
      wires: [
        { name: 'GPx', desc: B('חוט אחד לכל רכיב, שנושא את האות.', 'One wire per part. It carries the signal.') },
        { name: 'GND', desc: B('[[ground|אדמה]] משותפת. בלעדיה אין [[circuit|מעגל]] סגור.', 'A shared [[ground|ground]]. Without it there is no closed [[circuit|circuit]].') }
      ],
      pinsNote: B('כל 26 הפינים ששמם מתחיל ב-GP: מ-GP0 עד GP22, ומ-GP26 עד GP28. בקוד משתמשים במספר שמופיע בשם: `Pin(15)` הוא GP15.',
        'All 26 pins whose name starts with GP: GP0 to GP22, and GP26 to GP28. Code uses the number in the name: `Pin(15)` is GP15.'),
      code: [
        'from machine import Pin',
        '',
        'led = Pin(15, Pin.OUT)                    # output',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)     # input with pull-up',
        '',
        'while True:',
        '    # the button reads 0 while pressed, so invert it for the LED',
        '    led.value(not button.value())'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את הכלי `Pin`, ששולט בפינים.', 'Brings in the `Pin` tool, which controls pins.'),
        E([3], 'GP15 מוגדר כיציאה, ואליו מחובר לד.', 'GP15 is an output. An LED is connected to it.'),
        E([4], 'GP14 מוגדר ככניסה עם נגד משיכה. אליו מחובר כפתור, שהצד השני שלו מחובר לאדמה.', 'GP14 is an input with a pull-up. A button is connected to it, with its other side at ground.'),
        E([6], 'מכאן מתחילה לולאה שחוזרת על עצמה בלי סוף.', 'An endless loop.'),
        E([8], '`button.value()` קורא את מצב הכפתור: 1 כשהוא משוחרר, ו-0 כשהוא לחוץ. `not` הופך את הערך, ו-`led.value(...)` כותב אותו ללד. התוצאה: הלד דולק כל עוד לוחצים על הכפתור.', '`button.value()` reads the button: 1 when released, 0 when pressed. `not` flips the value, and `led.value(...)` writes it to the LED. The result: the LED is lit for as long as you press.')
      ],
      tips: [
        B('הפינים עובדים ב-3.3V. רכיב שמוציא 5V צריך לחבר דרך [[divider|מחלק מתח]], אחרת הפין עלול להינזק.', 'The pins work at 3.3 V. A part that outputs 5 V is connected through a [[divider|voltage divider]], or the pin may be damaged.'),
        B('פין יכול לספק רק [[current|זרם]] קטן, שמספיק ללד עם נגד. מנוע או פס לדים צורכים הרבה יותר, ולכן מפעילים אותם דרך [[driver|דרייבר]] ולא ישירות מהפין.', 'A pin can supply only a small [[current|current]], enough for an LED with a resistor. A motor or LED strip draws far more, so they are run through a [[driver|driver]] and not straight from the pin.'),
        B('עדיף לחבר את הכפתור לאדמה ולהשתמש ב-`PULL_UP`, כמו בדוגמה. בגרסאות הראשונות של השבב יש תקלה ידועה בנגד המשיכה ההפוך, `PULL_DOWN`.', 'Prefer a button wired to ground together with `PULL_UP`, as in the example. The first versions of the chip have a known fault in the opposite pull, `PULL_DOWN`.'),
        B('במקום לבדוק את הפין שוב ושוב בלולאה, אפשר להשתמש ב[[interrupt|פסיקה]]. יש לכך דוגמה בעמוד של חיישן התנועה.', 'Instead of checking a pin in a loop you can use an [[interrupt|interrupt]]. There is an example on the motion sensor\'s page.')
      ],
      more: B('מודול ממסר (מתג חשמלי שה-Pico מפעיל), חיישן מכשולים, מקודד סיבובי, לוח מקשים, חיישן מגע.', 'A relay module (an electrical switch the Pico operates), an obstacle sensor, a rotary encoder, a keypad, a touch sensor.'),
      quiz: [
        Q(B('כפתור מחובר בין GP14 לאדמה, עם `PULL_UP`. מה הפין קורא כשהכפתור לחוץ?', 'A button is wired between GP14 and ground, with `PULL_UP`. What does the pin read while the button is pressed?'),
          [B('1', '1'), B('0', '0'), B('ערך אקראי', 'A random value')], 1,
          B('הלחיצה מחברת את הפין לאדמה, ולכן הוא קורא 0. כשמשחררים את הכפתור, נגד המשיכה מחזיר את הפין ל-1.', 'Pressing connects the pin to ground, so it reads 0. On release, the pull-up brings it back to 1.')),
        Q(B('מה קורה לכניסה שלא מחובר אליה כלום ואין לה נגד משיכה?', 'What happens to an input with nothing connected and no pull resistor?'),
          [B('היא תמיד קוראת 0', 'It always reads 0'), B('היא קוראת ערכים אקראיים', 'It reads random values'), B('היא נשרפת', 'It burns out')], 1,
          B('פין כזה "צף" וקולט רעש מהסביבה. נגד משיכה נותן לו ערך ידוע.', 'Such a pin "floats" and picks up noise from its surroundings. A pull resistor gives it a known value.')),
        Q(B('רוצים להפעיל מנוע. האם מחברים אותו ישירות לפין GPIO?', 'You want to run a motor. Do you connect it straight to a GPIO pin?'),
          [B('כן', 'Yes'), B('לא, דרך דרייבר', 'No, through a driver')], 1,
          B('מנוע צורך הרבה יותר זרם ממה שפין יכול לספק. הפין רק נותן פקודה לדרייבר, והדרייבר הוא שמעביר את הזרם.', 'A motor draws far more current than a pin can supply. The pin only commands the driver, and the driver passes the current.'))
      ]
    },

    /* ------------------------------------------------------------ ADC */
    {
      id: 'adc', type: 'adc', filter: 'adc', demo: 'adc',
      name: B('ADC, מדידת מתח', 'ADC, measuring voltage'),
      short: B('לא רק "יש או אין", אלא גם "כמה"', 'Not just "is there or not", but "how much"'),
      plain: B('[[adc|ADC]] הוא פין שמודד כמה [[voltage|מתח]] יש עליו, והופך את המדידה למספר שהתוכנית יכולה לקרוא.',
        '[[adc|ADC]] is a pin that measures how much [[voltage|voltage]] is on it, and turns that into a number the program can read.'),
      analogy: B('פין רגיל הוא כמו לשאול "האם יש מים בכוס?". ADC הוא כמו כוס מדידה עם שנתות, שעונה על השאלה "כמה מים יש בכוס?".',
        'An ordinary pin is like asking "is there water in the glass?". ADC is like a measuring jug with markings: it answers "how much water is there".'),
      what: [
        B('השם הוא קיצור של Analog to Digital Converter, ממיר אנלוגי-לדיגיטלי. חיישנים רבים לא עונים "כן או לא", אלא מוציאים מתח שמשתנה: ככל שיש יותר אור, המתח גבוה יותר. זהו אות [[analog|אנלוגי]]. ה-ADC מודד את המתח הזה, בטווח שבין 0V ל-3.3V.',
          'The name is short for Analog to Digital Converter. Many sensors do not answer "yes or no", but output a voltage that varies: more light, more voltage. That is an [[analog|analog]] signal. The ADC measures that voltage, between 0 V and 3.3 V.'),
        B('התוצאה היא מספר בין 0 ל-65535: 0 פירושו 0V, ו-65535 פירושו 3.3V. באמצע, 32768 הוא בערך 1.65V. למה דווקא 65535? כי זה המספר הגדול ביותר שאפשר לכתוב ב-16 [[bit|ביטים]].',
          'The result is a number from 0 to 65535. 0 means 0 V, and 65535 means 3.3 V. In between, 32768 is about 1.65 V. Why 65535 exactly? It is the largest number that can be written in 16 [[bit|bits]].')
      ],
      when: [
        B('כאשר הרכיב עונה על השאלה "כמה": כפתור סיבוב, חיישן אור, חיישן לחות קרקע, ג\'ויסטיק.', 'When the part answers "how much": a knob, a light sensor, a soil-moisture sensor, a joystick.'),
        B('הוא לא מתאים לרכיב שמוציא רק 0 או 1. לשם כך מספיק [[gpio|GPIO]].', 'Not for a part that outputs only 0 or 1. [[gpio|GPIO]] is enough for that.'),
        B('הוא גם לא מתאים לחיישן ששולח את המדידה שלו כמספר מוכן, כמו BH1750. חיישן כזה מתחבר ב-[[i2c|I2C]].', 'Not for a sensor that sends its measurement as a ready-made number, such as the BH1750. Such a sensor connects over [[i2c|I2C]].')
      ],
      wires: [
        { name: 'ADCx', desc: B('החוט שעליו נמצא המתח שמודדים.', 'The wire carrying the voltage being measured.') },
        { name: '3V3', desc: B('מזין את החיישן.', 'Powers the sensor.') },
        { name: 'AGND', desc: B('ה[[ground|אדמה]] של החיישן. זו אדמה "שקטה" שנועדה למדידות.', 'The sensor\'s [[ground|ground]]. It is a "quiet" ground meant for measurements.') }
      ],
      pinsNote: B('רק שלושה פינים יודעים למדוד מתח: GP26, GP27 ו-GP28. הם נקראים גם ADC0, ADC1 ו-ADC2. בקוד כותבים `ADC(26)`.',
        'Only three pins can measure voltage: GP26, GP27 and GP28. They are also called ADC0, ADC1 and ADC2. In code you write `ADC(26)`.'),
      code: [
        'from machine import ADC',
        'from time import sleep',
        '',
        'sensor = ADC(26)                    # GP26 = ADC0',
        '',
        'while True:',
        '    raw = sensor.read_u16()         # 0..65535',
        '    volts = raw * 3.3 / 65535',
        '    print(raw, round(volts, 2), "V")',
        '    sleep(0.2)'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את הכלי `ADC`.', 'Brings in the `ADC` tool.'),
        E([4], 'השורה הזו אומרת ל-Pico שהפין GP26 משמש למדידת מתח.', 'Tells the Pico that pin GP26 is used for measuring voltage.'),
        E([7], 'כאן מתבצעת המדידה. מתקבל מספר בין 0 ל-65535, והוא נשמר במשתנה `raw`.', 'Measures. A number from 0 to 65535 comes back and is stored in the variable `raw`.'),
        E([8], 'השורה הזו ממירה את המספר לוולטים: היא מכפילה ב-3.3 ומחלקת ב-65535.', 'Converts to volts: multiply by 3.3 and divide by 65535.'),
        E([9], 'השורה הזו מדפיסה את המספר הגולמי ואת המתח, מעוגל לשתי ספרות.', 'Prints the raw number and the voltage, rounded to two digits.'),
        E([10], 'התוכנית ממתינה חמישית שנייה לפני המדידה הבאה.', 'Waits a fifth of a second before the next measurement.')
      ],
      tips: [
        B('אסור לחבר לפין ADC יותר מ-3.3V. לחיישן אנלוגי שעובד ב-5V מוסיפים [[divider|מחלק מתח]].', 'Never connect more than 3.3 V to an ADC pin. A 5 V analog sensor gets a [[divider|voltage divider]].'),
        B('המדידה תמיד קופצת מעט. אם צריך ערך יציב, מודדים כמה פעמים ומחשבים ממוצע.', 'The reading always jitters a little. If you need a steady value, measure several times and take the average.'),
        B('חיישן שמשנה את ה[[resistance|התנגדות]] שלו, כמו LDR, לא מוציא מתח בעצמו. מחברים אותו יחד עם נגד קבוע כמחלק מתח, ומודדים את הנקודה שביניהם.', 'A sensor that changes [[resistance|resistance]], such as an LDR, does not output a voltage by itself. Wire it with a fixed resistor as a voltage divider, and measure the point between them.')
      ],
      more: B('חיישן לחות קרקע, ג\'ויסטיק, חיישן גז, מיקרופון אנלוגי.', 'A soil-moisture sensor, a joystick, a gas sensor, an analog microphone.'),
      quiz: [
        Q(B('`read_u16()` החזיר 32768. בערך כמה מתח יש על הפין?', '`read_u16()` returned 32768. Roughly how much voltage is on the pin?'),
          [B('0V', '0 V'), B('1.65V', '1.65 V'), B('3.3V', '3.3 V')], 1,
          B('32768 הוא חצי מ-65535, ולכן המתח הוא חצי מ-3.3V.', '32768 is half of 65535, so the voltage is half of 3.3 V.')),
        Q(B('אילו פינים יכולים למדוד מתח?', 'Which pins can measure voltage?'),
          [B('כל הפינים', 'All the pins'), B('רק GP26, GP27 ו-GP28', 'Only GP26, GP27 and GP28'), B('רק GP0', 'Only GP0')], 1,
          B('רק שלושת הפינים האלה מחוברים ל-ADC שבתוך השבב.', 'Only these three are connected to the ADC inside the chip.')),
        Q(B('מהו המתח הגבוה ביותר שמותר לחבר לפין ADC?', 'What is the highest voltage you may connect to an ADC pin?'),
          [B('3.3V', '3.3 V'), B('5V', '5 V'), B('12V', '12 V')], 0,
          B('מתח גבוה מ-3.3V עלול להזיק לפין. חיישן של 5V מחברים דרך מחלק מתח.', 'Above 3.3 V the pin may be damaged. A 5 V sensor is connected through a voltage divider.'))
      ]
    },

    /* ------------------------------------------------------------ PWM */
    {
      id: 'pwm', type: 'pwm', filter: 'pwm', demo: 'pwm',
      name: B('PWM, הבהוב מהיר', 'PWM, fast switching'),
      short: B('איך פין שמכיר רק 0 ו-1 מעמעם אור ומזיז מנוע', 'How a pin that only knows 0 and 1 dims a light and moves a motor'),
      plain: B('[[pwm|PWM]] מדליק ומכבה פין מהר מאוד, ומשנה את החלק מהזמן שבו הוא דולק. כך נראה כאילו הפין הדיגיטלי מוציא עוצמה חלקית.',
        '[[pwm|PWM]] switches a pin on and off very fast and changes the share of the time it is on. That makes a digital pin look as though it is giving a partial level.'),
      analogy: B('דמיינו שאתם מדליקים ומכבים את האור בחדר מאה פעמים בשנייה. העין לא רואה את ההבהוב, אלא רק אור חלש יותר. אם האור דולק רבע מהזמן, החדר נראה עמום. אם הוא דולק רוב הזמן, החדר מואר כמעט לגמרי.',
        'Imagine switching the room light on and off a hundred times a second. The eye does not see the flicker, only a weaker light. If the light is on a quarter of the time, the room looks dim. If it is on most of the time, the room is almost fully lit.'),
      what: [
        B('השם הוא קיצור של Pulse Width Modulation, כלומר שינוי של רוחב ה[[pulse|פולס]]. פין [[digital|דיגיטלי]] לא יכול להוציא 1.5V, אלא רק 0V או 3.3V. PWM עוקף את המגבלה הזו בעזרת הזמן.',
          'The name is short for Pulse Width Modulation. A [[digital|digital]] pin cannot output 1.5 V, only 0 V or 3.3 V. PWM gets round that by using time.'),
        B('שני מספרים קובעים הכול. הראשון הוא ה-[[duty|duty cycle]]: החלק מהזמן שבו הפין דולק, באחוזים. בלד, זו הבהירות. בקוד כותבים אותו כמספר בין 0 ל-65535, כך ש-32768 הוא 50%.',
          'Two numbers decide everything. The first is the [[duty|duty cycle]]: what share of the time the pin is on, as a percentage. On an LED this is the brightness. In code it is written as a number from 0 to 65535, so 32768 is 50%.'),
        B('השני הוא ה[[frequency|תדר]]: כמה פעמים בשנייה המחזור כולו חוזר על עצמו. בבאזר, התדר הוא גובה הצליל. בסרבו התדר קבוע, 50 פעמים בשנייה, ואורך הפולס אומר לו לאיזו זווית לפנות.',
          'The second is the [[frequency|frequency]]: how many times a second the whole cycle repeats. On a buzzer the frequency is the pitch. On a servo the frequency is fixed, 50 times a second, and the pulse length tells it which angle to turn to.')
      ],
      when: [
        B('כדי לשנות את הבהירות של לד בהדרגה.', 'To change an LED\'s brightness gradually.'),
        B('כדי להשמיע בבאזר צלילים בגבהים שונים.', 'To play notes of different pitch on a buzzer.'),
        B('כדי לקבוע את הזווית של סרבו, או את המהירות של מנוע דרך [[driver|דרייבר]].', 'To set a servo\'s angle, or a motor\'s speed through a [[driver|driver]].'),
        B('הוא לא מתאים כאשר צריך מתח אמיתי וחלק, כי PWM הוא עדיין אות שקופץ בין 0 ל-3.3V.', 'Not suitable when you need a real, smooth voltage. PWM is still a signal jumping between 0 and 3.3 V.')
      ],
      wires: [
        { name: 'PWM', desc: B('חוט אות אחד אל הרכיב.', 'One signal wire to the part.') },
        { name: 'GND', desc: B('[[ground|אדמה]] משותפת.', 'A shared [[ground|ground]].') }
      ],
      pinsNote: B('כל פין GP יכול לשמש ל-PWM. הפינים מסודרים בזוגות שנקראים יחידות, למשל PWM0A ו-PWM0B. שני הפינים של אותה יחידה חייבים לעבוד באותו תדר, אבל לכל אחד מהם יש duty משלו. לכן סרבו ובאזר, שצריכים תדרים שונים, מחוברים ליחידות שונות.',
        'Every GP pin can be used for PWM. The pins come in pairs called units, for example PWM0A and PWM0B. The two pins of one unit must run at the same frequency, but each has its own duty. That is why a servo and a buzzer, which need different frequencies, go on different units.'),
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'led = PWM(Pin(15), freq=1000)',
        '',
        'while True:',
        '    for duty in range(0, 65536, 1024):   # fade in',
        '        led.duty_u16(duty)',
        '        sleep(0.01)'
      ],
      explain: [
        E([1], 'השורה הזו טוענת גם את `Pin` וגם את `PWM`.', 'Brings in both `Pin` and `PWM`.'),
        E([4], 'השורה הזו הופכת את GP15 לפין PWM שנדלק ונכבה 1000 פעמים בשנייה. זה מהיר מספיק כדי שהעין לא תראה הבהוב.', 'Turns GP15 into a PWM pin switching 1000 times a second. That is fast enough for the eye to see no flicker.'),
        E([7], 'זו לולאה שבה `duty` עולה מ-0 עד 65535 בקפיצות של 1024. הצורה היא `range(התחלה, סוף, קפיצה)`.', 'A loop in which `duty` rises from 0 to 65535 in steps of 1024. `range(start, end, step)`.'),
        E([8], 'השורה הזו קובעת את ה-duty cycle, כלומר את הבהירות.', 'Sets the duty cycle, i.e. the brightness.'),
        E([9], 'התוכנית ממתינה מאית שנייה בין צעד לצעד, כדי שהשינוי ייראה הדרגתי.', 'Waits a hundredth of a second between steps, so the change looks gradual.')
      ],
      tips: [
        B('`duty_u16` מקבל מספר בין 0 ל-65535: 0 פירושו כבוי, ו-65535 פירושו דולק כל הזמן.', '`duty_u16` takes a number from 0 to 65535. 0 is off, 65535 is on the whole time.'),
        B('בסרבו נוח יותר להשתמש ב-`duty_ns`, שמקבל את אורך הפולס ישירות.', 'For a servo it is handier to use `duty_ns`, which takes the pulse length directly.'),
        B('אם רואים בעין שהלד מהבהב, התדר נמוך מדי. העלו אותו ל-1000.', 'If an LED flickers visibly, the frequency is too low. Raise it to 1000.')
      ],
      more: B('מנוע דרך דרייבר, לד RGB שמחליף צבעים, מאוורר.', 'A motor through a driver, an RGB LED that changes colour, a fan.'),
      quiz: [
        Q(B('מה קובע את הבהירות של לד ב-PWM?', 'What sets an LED\'s brightness under PWM?'),
          [B('התדר', 'The frequency'), B('ה-duty cycle', 'The duty cycle'), B('מספר הפין', 'The pin number')], 1,
          B('ה-duty cycle הוא החלק מהזמן שבו הלד דולק. ככל שהלד דולק זמן רב יותר, הוא בהיר יותר.', 'The duty cycle is the share of the time the LED is on. More time on, brighter.')),
        Q(B('מה קובע את גובה הצליל של באזר?', 'What sets the pitch of a buzzer?'),
          [B('התדר', 'The frequency'), B('ה-duty cycle', 'The duty cycle')], 0,
          B('התדר הוא מספר הרעידות בשנייה, וזה מה שהאוזן שומעת כגובה הצליל.', 'The frequency is the number of vibrations per second, which is what the ear hears as pitch.')),
        Q(B('איזה ערך של `duty_u16` נותן בערך חצי בהירות?', 'Which `duty_u16` value gives about half brightness?'),
          [B('50', '50'), B('32768', '32768'), B('65535', '65535')], 1,
          B('הטווח הוא 0 עד 65535, וחציו הוא 32768.', 'The range is 0 to 65535, and half of that is 32768.'))
      ]
    },

    /* ------------------------------------------------------------ I2C */
    {
      id: 'i2c', type: 'i2c', filter: 'i2c', demo: 'i2c',
      name: B('I2C', 'I2C'),
      short: B('שני חוטים, הרבה רכיבים, ולכל אחד כתובת', 'Two wires, many parts, each with an address'),
      plain: B('[[i2c|I2C]] היא שיטה שבה ה-Pico מתקשר עם כמה רכיבים דרך אותם שני חוטים. לכל רכיב יש מספר משלו, וה-Pico פונה אליו לפי המספר הזה.',
        '[[i2c|I2C]] is a way for the Pico to talk to several parts over the same two wires. Each part has its own number, and the Pico addresses it by that number.'),
      analogy: B('כיתה: המורה הוא ה-Pico, והתלמידים הם הרכיבים. כולם שומעים את המורה, אבל כשהוא קורא בשם, רק התלמיד שזה שמו עונה. השם הוא ה[[address|כתובת]].',
        'Think of a classroom. The teacher is the Pico, and the pupils are the parts. Everyone hears the teacher, but when a name is called, only that pupil answers. The name is the [[address|address]].'),
      what: [
        B('לחוטים המשותפים קוראים [[bus|אפיק]]. ב-I2C יש באפיק שני חוטים. בחוט אחד, SDA, עוברים הנתונים. החוט השני, SCL, הוא [[clock|קו שעון]]: הוא מתקתק, וכל תקתוק אומר "עכשיו קוראים את הביט הבא".',
          'The shared wires are called a [[bus|bus]]. In I2C it has two wires. One, SDA, carries the data. The other, SCL, is a [[clock|clock line]]: it ticks, and each tick says "now read the next bit".'),
        B('כל שיחה מתחילה בכך שה-Pico שולח כתובת. הכתובת היא מספר שנכתב ב-[[hex|hex]], למשל `0x3C` עבור מסך OLED. הרכיב שזו הכתובת שלו עונה "אני כאן", ורק אז עוברים הנתונים.',
          'Every conversation starts with the Pico sending an address. The address is a number written in [[hex|hex]], for example `0x3C` for an OLED display. The part that owns that address answers "I am here", and only then does data move.'),
        B('זה הממשק הנפוץ ביותר לחיישנים ולמסכים קטנים, כי הוא חוסך פינים: גם עם עשרה רכיבים משתמשים רק בשני פינים.',
          'It is the most common interface for sensors and small displays, because it saves pins: ten parts, and still only two pins.')
      ],
      when: [
        B('כאשר על ה[[module|מודול]] יש פינים בשם SDA ו-SCL.', 'When the [[module|module]] has pins named SDA and SCL.'),
        B('כאשר רוצים לחבר כמה חיישנים ומסך בלי לבזבז פינים.', 'When you want to connect several sensors and a display without using up pins.'),
        B('הוא לא מתאים לכמויות גדולות של נתונים, כמו בכרטיס זיכרון. לשם כך יש [[spi|SPI]].', 'Not suitable for large amounts of data, such as a memory card. That is what [[spi|SPI]] is for.')
      ],
      wires: [
        { name: 'SDA', desc: B('קו הנתונים. המידע עובר בו בשני הכיוונים.', 'The data line. Information travels both ways on it.') },
        { name: 'SCL', desc: B('קו השעון. ה-Pico קובע את הקצב.', 'The clock line. The Pico sets the pace.') },
        { name: 'VCC + GND', desc: B('הזנה ו[[ground|אדמה]] לכל רכיב.', 'Power and [[ground|ground]] for each part.') }
      ],
      pinsNote: B('ל-Pico 2 יש שני אפיקי I2C נפרדים, I2C0 ו-I2C1. בוחרים פין SDA ופין SCL מאותו אפיק. באתר הזה משתמשים תמיד ב-GP4 בתור SDA וב-GP5 בתור SCL, ושניהם שייכים ל-I2C0. כל רכיבי ה-I2C מתחברים לאותם שני פינים.',
        'The Pico 2 has two separate I2C buses, I2C0 and I2C1. Pick an SDA pin and an SCL pin from the same bus. This site always uses GP4 as SDA and GP5 as SCL, both on I2C0. All I2C parts connect to the same two pins.'),
      code: [
        'from machine import Pin, I2C',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)',
        '',
        '# Ask every address whether a device is there',
        'for addr in i2c.scan():',
        '    print("found device at", hex(addr))'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את `Pin` ואת `I2C`.', 'Brings in `Pin` and `I2C`.'),
        E([3], 'השורה הזו מגדירה את אפיק מספר 0: הנתונים עוברים ב-GP4, והשעון ב-GP5. `freq` הוא קצב השעון, 400,000 תקתוקים בשנייה.', 'Sets up bus number 0: data on GP4, clock on GP5. `freq` is the clock pace, 400,000 ticks a second.'),
        E([6], '`i2c.scan()` פונה לכל הכתובות האפשריות, אחת אחרי השנייה, ומחזיר רשימה של הכתובות שענו. הלולאה עוברת על הרשימה הזו.', '`i2c.scan()` calls every possible address one after the other, and returns a list of those that answered. The loop goes through the list.'),
        E([7], 'השורה הזו מדפיסה כל כתובת בכתיב hex, כפי שהיא מופיעה בעמודי הרכיבים.', 'Prints each address in hex notation, as it appears on the part pages.')
      ],
      tips: [
        B('התחילו תמיד ב-`i2c.scan()`. אם לא מודפס כלום, הבעיה בחיווט ולא בקוד, ובדרך כלל SDA ו-SCL התחלפו.', 'Always start with `i2c.scan()`. If nothing is printed, the problem is in the wiring and not the code. Usually SDA and SCL are swapped.'),
        B('שני הקווים צריכים [[pullup|נגדי משיכה]] ל-3.3V. ברוב המודולים הם כבר מולחמים על הלוח, ואין צורך להוסיף אותם.', 'Both lines need [[pullup|pull-up resistors]] to 3.3 V. On most modules they are already soldered on the board, and nothing need be added.'),
        B('שני רכיבים עם אותה כתובת לא יכולים להיות על אותו אפיק. העבירו אחד מהם לאפיק השני, I2C1.', 'Two parts with the same address cannot sit on the same bus. Move one of them to the other bus, I2C1.')
      ],
      more: B('חיישן טמפרטורה, לחות ולחץ BME280, מסך טקסט של 16 תווים עם מתאם I2C, שעון זמן אמת, חיישן מרחק בלייזר.', 'A BME280 temperature, humidity and pressure sensor, a 16-character text display with an I2C adapter, a real-time clock, a laser distance sensor.'),
      quiz: [
        Q(B('איך ה-Pico בוחר עם איזה רכיב לדבר ב-I2C?', 'How does the Pico choose which part to talk to on I2C?'),
          [B('לפי הכתובת של הרכיב', 'By the part\'s address'), B('לפי צבע החוט', 'By the wire colour'), B('הוא מדבר עם כולם יחד', 'It talks to all of them at once')], 0,
          B('לכל רכיב יש כתובת, ורק הרכיב שהכתובת שלו נשלחה עונה.', 'Each part has an address, and only the part whose address was sent answers.')),
        Q(B('חיברתם מסך, ו-`i2c.scan()` החזיר רשימה ריקה. מה בודקים קודם?', 'You connected a display and `i2c.scan()` returned an empty list. What do you check first?'),
          [B('את הקוד שמצייר על המסך', 'The code that draws on the display'), B('את החיווט: האם SDA ו-SCL התחלפו', 'The wiring: whether SDA and SCL are swapped'), B('את כבל ה-USB', 'The USB cable')], 1,
          B('רשימה ריקה פירושה שאף רכיב לא ענה. זו בעיה של חיווט או של הזנה.', 'An empty list means no part answered. That is a wiring or power problem.')),
        Q(B('כמה פינים של ה-Pico צריך כדי לחבר חמישה חיישני I2C?', 'How many Pico pins are needed to connect five I2C sensors?'),
          [B('2', '2'), B('5', '5'), B('10', '10')], 0,
          B('כולם חולקים את אותם שני חוטים, SDA ו-SCL.', 'They all share the same two wires, SDA and SCL.'))
      ]
    },

    /* ------------------------------------------------------------ SPI */
    {
      id: 'spi', type: 'spi', filter: 'spi', demo: 'spi',
      name: B('SPI', 'SPI'),
      short: B('ארבעה חוטים, מהיר מאוד', 'Four wires, very fast'),
      plain: B('[[spi|SPI]] היא שיטת תקשורת מהירה, לרכיבים שמעבירים הרבה נתונים, כמו כרטיס זיכרון או מסך צבעוני.',
        '[[spi|SPI]] is a fast way of communicating for parts that move a lot of data, such as a memory card or a colour display.'),
      analogy: B('אם I2C היא כיתה שבה המורה קורא בשם, SPI הוא משרד שבו לכל עובד יש פעמון משלו על השולחן. כדי לדבר עם עובד מסוים, מצלצלים בפעמון שלו, ושאר העובדים יודעים שלא פונים אליהם.',
        'If I2C is a classroom where the teacher calls a name, SPI is an office where every worker has their own bell on the desk. To talk to one worker, you ring their bell. The others know they are not being addressed.'),
      what: [
        B('ב-SPI אין כתובות. במקומן, לכל רכיב יש חוט בחירה משלו, שנקרא CS. ה-Pico מוריד את החוט הזה ל-0 כדי לומר לרכיב "עכשיו אני מדבר איתך". זה ה"פעמון".',
          'SPI has no addresses. Instead each part has its own select wire called CS. The Pico pulls that wire to 0 to tell the part "I am talking to you now". That is the "bell".'),
        B('שלושת החוטים האחרים משותפים לכל הרכיבים: [[clock|קו שעון]], קו שבו הנתונים יוצאים מה-Pico, וקו שבו הנתונים חוזרים אליו. מכיוון שיש חוט נפרד לכל כיוון, הנתונים יכולים לעבור בשני הכיוונים באותו רגע, וזה חלק ממה שהופך את SPI למהיר.',
          'The other three wires are shared by all parts: a [[clock|clock line]], a line where data leaves the Pico, and a line where data returns to it. Because there is a separate wire for each direction, data can move both ways at the same moment, which is part of what makes SPI fast.'),
        B('בפועל, כמעט אף פעם לא שולחים בתים ב-SPI באופן ידני. ה[[library|ספרייה]] של הרכיב עושה זאת, ואתם רק אומרים לה לאילו פינים חיברתם אותו.',
          'In practice you almost never send SPI bytes by hand. The part\'s [[library|library]] does it, and you only tell it which pins you connected.')
      ],
      when: [
        B('כאשר על המודול יש פינים בשם SCK, MOSI, MISO ו-CS.', 'When the module has pins named SCK, MOSI, MISO and CS.'),
        B('עבור כרטיס זיכרון, מסך צבעוני או קורא כרטיסי RFID.', 'For a memory card, a colour display, an RFID card reader.'),
        B('אם לרכיב יש גם גרסת [[i2c|I2C]] ואין צורך במהירות, החיווט של I2C פשוט יותר.', 'If the part also comes in an [[i2c|I2C]] version and speed is not needed, I2C is simpler to wire.')
      ],
      wires: [
        { name: 'SCK', desc: B('קו השעון.', 'The clock line.') },
        { name: 'MOSI (TX)', desc: B('נתונים מה-Pico אל הרכיב. במפת הפינים הוא מסומן TX.', 'Data from the Pico to the part. On the pinout it is marked TX.') },
        { name: 'MISO (RX)', desc: B('נתונים מהרכיב אל ה-Pico. במפת הפינים הוא מסומן RX.', 'Data from the part to the Pico. On the pinout it is marked RX.') },
        { name: 'CS', desc: B('קו הבחירה. כל פין GP יכול למלא את התפקיד הזה.', 'The select line. Any GP pin can do this job.') }
      ],
      pinsNote: B('יש שני אפיקים, SPI0 ו-SPI1. שלושת הקווים SCK, TX ו-RX חייבים להיות מאותו אפיק. באתר הזה משתמשים ב-SPI0: GP18 הוא SCK, GP19 הוא TX, GP16 הוא RX, ו-GP17 הוא CS.',
        'There are two buses, SPI0 and SPI1. The three lines SCK, TX and RX must come from the same bus. This site uses SPI0: GP18 is SCK, GP19 is TX, GP16 is RX, and GP17 is CS.'),
      code: [
        'from machine import Pin, SPI',
        '',
        'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))',
        'cs = Pin(17, Pin.OUT, value=1)       # 1 = device not selected',
        '',
        'cs.low()                             # select the device',
        'spi.write(b"\\x9f")                   # send a command byte',
        'reply = spi.read(3)                  # read 3 bytes back',
        'cs.high()                            # release it',
        'print(reply)'
      ],
      explain: [
        E([3], 'השורה הזו מגדירה את אפיק SPI מספר 0. `baudrate` הוא המהירות, כאן מיליון ביטים בשנייה. אחריו מציינים איזה פין הוא השעון, ואיזה פין משמש לכל כיוון.', 'Sets up SPI bus number 0. `baudrate` is the speed, here a million bits a second. After that you say which pin is the clock and which pin serves each direction.'),
        E([4], 'פין הבחירה הוא יציאה רגילה. הוא מתחיל במצב 1, שפירושו "לא מדבר איתך".', 'The select pin is an ordinary output. It starts at 1, meaning "not talking to you".'),
        E([6], 'השורה הזו מורידה את CS ל-0, וכך בוחרת ברכיב.', 'Pulls CS to 0: selects the part.'),
        E([7], 'השורה הזו שולחת בית אחד. `b"\\x9f"` הוא בית שערכו `0x9F`. ברכיבי זיכרון רבים זו הפקודה "מי אתה?".', 'Sends one byte. `b"\\x9f"` is a byte with the value `0x9F`. On many memory parts this is the command "who are you?".'),
        E([8], 'השורה הזו קוראת שלושה בתים שהרכיב שולח בחזרה.', 'Reads three bytes the part sends back.'),
        E([9], 'השורה הזו מחזירה את CS ל-1, וכך משחררת את הרכיב.', 'Returns CS to 1: releases the part.'),
        E([10], 'השורה הזו מדפיסה את התשובה. אם אין רכיב מחובר, יודפסו אפסים או `0xff`.', 'Prints the answer. With no part connected, zeros or `0xff` are printed.')
      ],
      tips: [
        B('השמות מבלבלים, אז זכרו את הכלל: MOSI של הרכיב מתחבר ל-TX של ה-Pico, ו-MISO של הרכיב מתחבר ל-RX. ב-SPI לא מצליבים.', 'The names are confusing. The rule: the part\'s MOSI connects to the Pico\'s TX, and the part\'s MISO to RX. SPI is not crossed.'),
        B('הדוגמה כאן מראה מה קורה מאחורי הקלעים. בעמוד של כרטיס ה-microSD יש דוגמה אמיתית שמשתמשת בספרייה.', 'The example here shows what happens under the bonnet. The microSD card\'s page has a real example that uses a library.')
      ],
      more: B('קורא כרטיסי RFID, מסך צבעוני, מטריצת לדים, מודול רדיו.', 'An RFID card reader, a colour display, an LED matrix, a radio module.'),
      quiz: [
        Q(B('איך ה-Pico בוחר עם איזה רכיב לדבר ב-SPI?', 'How does the Pico choose which part to talk to on SPI?'),
          [B('הוא שולח כתובת', 'It sends an address'), B('הוא מוריד ל-0 את קו ה-CS של הרכיב', 'It pulls that part\'s CS line to 0'), B('הוא מחליף את כבל ה-USB', 'It swaps the USB cable')], 1,
          B('ב-SPI אין כתובות. לכל רכיב יש קו בחירה משלו.', 'SPI has no addresses. Each part has its own select line.')),
        Q(B('לאן מתחבר הפין MOSI של המודול?', 'Where does the module\'s MOSI pin connect?'),
          [B('לפין TX של אותו אפיק SPI', 'To the TX pin of the same SPI bus'), B('לפין RX', 'To the RX pin'), B('ל-GND', 'To GND')], 0,
          B('MOSI הוא הקו שבו הנתונים יוצאים מה-Pico, וב-Pico הוא נקרא TX.', 'MOSI is the line where data leaves the Pico, and on the Pico it is called TX.'))
      ]
    },

    /* ------------------------------------------------------------ UART */
    {
      id: 'uart', type: 'uart', filter: 'uart', demo: 'uart',
      name: B('UART, תקשורת טורית', 'UART, serial'),
      short: B('שיחה בין שני מכשירים, עם חוט אחד לכל כיוון', 'A conversation between two devices, one wire each way'),
      plain: B('[[uart|UART]] היא שיטת תקשורת בין שני מכשירים בלבד: בחוט אחד ה-Pico מדבר, ובחוט השני הוא מקשיב.',
        '[[uart|UART]] is a way for exactly two devices to communicate: one wire on which the Pico talks, and one on which it listens.'),
      analogy: B('דמיינו שני אנשים עם טלפון של פחיות וחוט. יש חוט מהפה שלי לאוזן שלך, וחוט מהפה שלך לאוזן שלי. אם מחברים פה לפה, אף אחד לא שומע כלום.',
        'Two people with tin-can telephones. There is a string from my mouth to your ear, and a string from your mouth to my ear. Connect mouth to mouth, and nobody hears anything.'),
      what: [
        B('לכל צד יש קו שידור בשם TX וקו קליטה בשם RX. ה[[bit|ביטים]] נשלחים אחד אחרי השני על אותו חוט, ולכן קוראים לזה גם תקשורת טורית.',
          'Each side has a transmit line named TX and a receive line named RX. The [[bit|bits]] are sent one after another on the same wire, which is why it is also called serial communication.'),
        B('בניגוד ל-I2C ול-SPI, אין כאן קו שעון, ולכן שני הצדדים חייבים להסכים מראש על המהירות. המהירות נקראת [[baud|baud rate]], והיא נמדדת בביטים לשנייה. הערך הנפוץ ביותר הוא 9600.',
          'Unlike I2C and SPI, there is no clock line here. So both sides must agree on the speed in advance. The speed is called the [[baud|baud rate]], measured in bits per second. The most common value is 9600.'),
        B('כך מתקשרים עם מקלט GPS, עם מודול Bluetooth או עם לוח Pico נוסף.', 'This is how you talk to a GPS receiver, a Bluetooth module, or another Pico board.')
      ],
      when: [
        B('כאשר על המודול יש פינים בשם TX ו-RX.', 'When the module has pins named TX and RX.'),
        B('כאשר רוצים ששני לוחות יתקשרו זה עם זה.', 'When you want two boards to talk to each other.'),
        B('הוא לא מתאים לחיבור של כמה רכיבים על אותם חוטים, כי UART מחבר שני מכשירים בלבד.', 'Not suitable for several parts on the same wires. UART joins two only.')
      ],
      wires: [
        { name: 'TX', desc: B('שידור. מתחבר ל-RX של הצד השני.', 'Transmit. Connects to the other side\'s RX.') },
        { name: 'RX', desc: B('קליטה. מתחבר ל-TX של הצד השני.', 'Receive. Connects to the other side\'s TX.') },
        { name: 'GND', desc: B('[[ground|אדמה]] משותפת לשני המכשירים.', 'A [[ground|ground]] shared by both devices.') }
      ],
      pinsNote: B('יש שני חיבורים, UART0 ו-UART1. באתר הזה משתמשים ב-UART1: GP8 הוא TX, ו-GP9 הוא RX.',
        'There are two ports, UART0 and UART1. This site uses UART1: GP8 is TX and GP9 is RX.'),
      code: [
        'from machine import Pin, UART',
        '',
        'uart = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))',
        '',
        'uart.write("hello\\n")',
        '',
        'while True:',
        '    if uart.any():                   # are there bytes waiting?',
        '        print(uart.readline())'
      ],
      explain: [
        E([3], 'השורה הזו מגדירה את חיבור UART מספר 1, במהירות 9600. ה-Pico משדר ב-GP8 וקולט ב-GP9.', 'Sets up UART port number 1, at a speed of 9600. The Pico transmits on GP8 and receives on GP9.'),
        E([5], 'השורה הזו שולחת את המילה hello לצד השני. `\\n` מסמן סוף שורה.', 'Sends the word hello to the other side. `\\n` marks the end of a line.'),
        E([8], '`uart.any()` בודק אם הגיע משהו שממתין לקריאה.', '`uart.any()` checks whether anything has arrived and is waiting to be read.'),
        E([9], 'השורה הזו קוראת שורה אחת שהגיעה ומדפיסה אותה.', 'Reads one line that arrived and prints it.')
      ],
      tips: [
        B('תמיד מצליבים את החוטים: ה-TX שלכם ל-RX של הצד השני, וה-RX שלכם ל-TX שלו. זו הטעות הנפוצה ביותר ב-UART.', 'Always cross the wires: your TX to its RX, and your RX to its TX. This is the most common UART mistake.'),
        B('אם מגיעים תווים משובשים, ה-baud rate של שני הצדדים לא זהה.', 'If garbled characters arrive, the baud rates of the two sides are not the same.'),
        B('הפקודה `print` לא משתמשת בפינים האלה. היא שולחת את הטקסט למחשב דרך כבל ה-USB.', 'The `print` command does not use these pins. It sends its text to the computer over the USB cable.')
      ],
      more: B('מודול Bluetooth, נגן MP3 קטן, חיישן טביעת אצבע, לוח Pico נוסף.', 'A Bluetooth module, a small MP3 player, a fingerprint sensor, another Pico board.'),
      quiz: [
        Q(B('לאן מחברים את הפין TX של המודול?', 'Where do you connect the module\'s TX pin?'),
          [B('ל-TX של ה-Pico', 'To the Pico\'s TX'), B('ל-RX של ה-Pico', 'To the Pico\'s RX'), B('ל-3V3', 'To 3V3')], 1,
          B('את מה שהמודול משדר, ה-Pico צריך לקלוט. לכן TX מתחבר ל-RX.', 'What the module transmits, the Pico must receive. So TX connects to RX.')),
        Q(B('מגיעים תווים משובשים. מה כנראה הבעיה?', 'Garbled characters arrive. What is the likely problem?'),
          [B('ה-baud rate לא תואם', 'The baud rate does not match'), B('חסר נגד', 'A resistor is missing'), B('הכבל ארוך מדי', 'The cable is too long')], 0,
          B('כשאין קו שעון, שני הצדדים חייבים לעבוד באותה מהירות. אחרת כל ביט נקרא ברגע הלא נכון.', 'With no clock line, both sides need the same speed. Otherwise every bit is read at the wrong moment.'))
      ]
    },

    /* ------------------------------------------------------------ PIO */
    {
      id: 'pio', type: 'pio', filter: 'gpio', demo: null,
      name: B('PIO', 'PIO'),
      short: B('נושא מתקדם: אותות בתזמון מדויק במיוחד', 'An advanced topic: signals with especially exact timing'),
      plain: B('[[pio|PIO]] היא יכולת מיוחדת של ה-Pico לייצר אותות בתזמון מדויק מאוד. ברוב המקרים משתמשים בה בלי לשים לב, דרך ספרייה מוכנה.',
        '[[pio|PIO]] is a special ability of the Pico to produce signals with very exact timing. Most of the time you use it without knowing, through a ready-made library.'),
      analogy: B('המעבד הראשי הוא מנהל עסוק. PIO הוא עוזר שיושב ליד הפין ועושה רק דבר אחד, בדיוק מושלם, בלי שהמנהל יצטרך להשגיח עליו.',
        'The main processor is a busy manager. PIO is an assistant who sits by the pin and does just one thing, with perfect precision, without the manager having to watch.'),
      what: [
        B('השם הוא קיצור של Programmable I/O, כלומר קלט ופלט שאפשר לתכנת. בתוך השבב יש כמה מעבדים זעירים, נפרדים מהמעבד הראשי, וכל אחד מהם מריץ תוכנית קצרה מאוד ששולטת בפינים.',
          'The name is short for Programmable I/O. Inside the chip are a few tiny processors, separate from the main one. Each runs a very short program that controls pins.'),
        B('למה צריך את זה? יש רכיבים שדורשים תזמון מדויק עד כדי מיליוניות שנייה, כמו פס לדים צבעוני. קוד Python רגיל לא מדויק מספיק, אבל PIO כן.',
          'Why is it needed? Some parts demand timing exact to millionths of a second, such as a colour LED strip. Ordinary Python code is not precise enough. PIO is.'),
        B('אם אתם בתחילת הדרך, אפשר לדלג על העמוד הזה. מספיק לדעת ש-PIO קיים, ושה[[library|ספרייה]] `neopixel` משתמשת בו בשבילכם.',
          'If you are just starting out, you can skip this page. It is enough to know that PIO exists and that the `neopixel` [[library|library]] uses it for you.')
      ],
      when: [
        B('כאשר מחברים פס לדים מסוג NeoPixel. הספרייה כבר עושה את העבודה.', 'When connecting a NeoPixel LED strip. The library already does the work.'),
        B('כאשר צריך [[protocol|פרוטוקול]] שאין לו חומרה מוכנה בשבב. זה שימוש מתקדם.', 'When you need a [[protocol|protocol]] the chip has no ready-made hardware for. That is an advanced use.')
      ],
      wires: [
        { name: 'GPx', desc: B('כל פין GP, לפי מה שהתוכנית מגדירה.', 'Any GP pin, as the program defines.') }
      ],
      pinsNote: B('ה-PIO יכול להשתמש בכל אחד מפיני ה-GP.', 'Every GP pin can be used by PIO.'),
      code: [
        'import rp2',
        'from machine import Pin',
        '',
        '# A PIO program: turn the pin on, wait, turn it off, wait.',
        '@rp2.asm_pio(set_init=rp2.PIO.OUT_LOW)',
        'def blink():',
        '    set(pins, 1)',
        '    set(x, 31)                  [5]',
        '    label("high")',
        '    nop()                       [29]',
        '    jmp(x_dec, "high")',
        '    set(pins, 0)',
        '    set(x, 31)                  [5]',
        '    label("low")',
        '    nop()                       [29]',
        '    jmp(x_dec, "low")',
        '',
        '# Run it on the on-board LED at 2500 steps per second (about 1 blink/s)',
        'sm = rp2.StateMachine(0, blink, freq=2500, set_base=Pin(25))',
        'sm.active(1)'
      ],
      explain: [
        E([5, 6], 'השורות האלה מסמנות שהפונקציה `blink` היא תוכנית PIO ולא קוד Python רגיל. הפקודות שבתוכה שייכות לשפה קטנה ונפרדת.', 'Marks the function `blink` as a PIO program rather than ordinary Python. The commands inside it belong to a small, separate language.'),
        E([7], 'השורה הזו מדליקה את הפין.', 'Switches the pin on.'),
        E([8, 11], 'זו לולאת המתנה: היא סופרת לאחור מ-31, ובכל צעד ממתינה. המספר שבסוגריים המרובעים קובע כמה צעדים נוספים להמתין.', 'A waiting loop: counts down from 31, waiting at each step. The number in square brackets is how many extra steps to wait.'),
        E([12], 'השורה הזו מכבה את הפין.', 'Switches the pin off.'),
        E([13, 16], 'זו אותה לולאת המתנה, הפעם כשהפין כבוי.', 'The same waiting loop, this time with the pin off.'),
        E([19], 'השורה הזו טוענת את התוכנית לאחד המעבדים הזעירים, קובעת שהוא יבצע 2500 צעדים בשנייה, ומחברת אותו לפין 25, שהוא הלד שעל הלוח.', 'Loads the program into one of the tiny processors, sets it to run 2500 steps a second, and attaches it to pin 25, which is the LED on the board.'),
        E([20], 'השורה הזו מפעילה את התוכנית. מעכשיו הלד מהבהב בעצמו, גם כשהתוכנית הראשית עסוקה במשהו אחר.', 'Starts it. From here the LED blinks by itself, even if the main program is busy with something else.')
      ],
      tips: [
        B('הדוגמה הזו לא צריכה שום רכיב חיצוני, כי היא מהבהבת בלד שעל הלוח.', 'This example needs no external part. It blinks the LED on the board.'),
        B('כדאי להגיע לנושא הזה רק אחרי שאתם מרגישים בנוח עם GPIO ועם PWM.', 'Come to this topic only once you feel at home with GPIO and PWM.')
      ],
      more: null,
      quiz: [
        Q(B('למה פס לדים NeoPixel צריך PIO?', 'Why does a NeoPixel LED strip need PIO?'),
          [B('כי הוא צורך הרבה זרם', 'Because it draws a lot of current'), B('כי הוא דורש תזמון מדויק מאוד של הביטים', 'Because it demands very exact timing of the bits'), B('כי הוא עובד ב-5V', 'Because it runs at 5 V')], 1,
          B('כל ביט נמשך פחות ממיליונית שנייה, ורק PIO מדויק מספיק בשביל זה.', 'Each bit lasts less than a millionth of a second. Only PIO is precise enough.'))
      ]
    },

    /* ------------------------------------------------------------ power */
    {
      id: 'power', type: 'power', filter: 'power', demo: null,
      name: B('מתח ואדמה', 'Power & ground'),
      short: B('מאיפה מגיע החשמל, ולאן הוא חוזר', 'Where the electricity comes from, and where it returns'),
      plain: B('חלק מהפינים של ה-Pico לא מעבירים מידע. הם מספקים חשמל לרכיבים שאתם מחברים, ומחזירים אותו ל[[ground|אדמה]].',
        'Some of the Pico\'s pins carry no information. They supply electricity to the parts you connect, and return it to [[ground|ground]].'),
      analogy: B('שקעי החשמל בקיר. הם לא חלק מהמחשב, אבל בלעדיהם שום דבר לא עובד. גם לפיני המתח לא כותבים קוד, אלא רק מחברים אליהם חוטים.',
        'Think of the wall sockets. They are not part of the computer, but nothing works without them. You do not write code for the power pins, you only connect wires to them.'),
      what: [
        B('החשמל מגיע מכבל ה-[[usb|USB]], במתח של 5V. על הלוח יש [[regulator|מייצב מתח]] שמוריד אותו ל-3.3V, שזה המתח שבו השבב עובד. שני המתחים זמינים בפינים: `VBUS` נותן 5V, ו-`3V3(OUT)` נותן 3.3V.',
          'The electricity arrives over the [[usb|USB]] cable, at 5 V. On the board is a [[regulator|voltage regulator]] that brings it down to 3.3 V, the voltage the chip runs at. Both voltages are available on pins: `VBUS` gives 5 V, and `3V3(OUT)` gives 3.3 V.'),
        B('לכל רכיב יש פין הזנה, שבדרך כלל נקרא [[vcc|VCC]], ופין אדמה שנקרא GND. לפני שמחברים רכיב, בודקים באיזה מתח הוא עובד: 3.3V או 5V. המידע הזה כתוב בעמוד של כל רכיב באתר.',
          'Every part has a power pin, usually named [[vcc|VCC]], and a ground pin named GND. Before connecting a part, check which voltage it runs on: 3.3 V or 5 V. It is written on each part\'s page on this site.'),
        B('ה-GND של כל רכיב חייב להתחבר ל-GND של ה-Pico, וזו "אדמה משותפת". בלעדיה אין [[circuit|מעגל]] סגור, והרכיב וה-Pico לא מבינים זה את האותות של זה.',
          'Every part\'s GND must connect to the Pico\'s GND. This is a "shared ground". Without it there is no closed [[circuit|circuit]], and the part and the Pico cannot understand each other\'s signals.')
      ],
      when: [
        B('`3V3(OUT)`: עבור חיישנים ומסכים קטנים שעובדים ב-3.3V.', '`3V3(OUT)`: for sensors and small displays that run at 3.3 V.'),
        B('`VBUS`: עבור רכיבים שצריכים 5V, כמו סרבו, פס לדים או חיישן המרחק HC-SR04.', '`VBUS`: for parts that need 5 V, such as a servo, an LED strip or the HC-SR04 distance sensor.'),
        B('`GND`: עבור כל רכיב, תמיד.', '`GND`: for every part, always.')
      ],
      wires: [
        { name: 'VBUS', desc: B('5V ישירות מה-USB. המתח קיים רק כשהכבל מחובר.', '5 V straight from USB. Present only while the cable is connected.') },
        { name: '3V3(OUT)', desc: B('3.3V מהמייצב שעל הלוח.', '3.3 V from the regulator on the board.') },
        { name: 'VSYS', desc: B('כניסה לסוללות, כאשר רוצים שהפרויקט יעבוד בלי מחשב.', 'An input for batteries, when the project should run with no computer.') },
        { name: 'GND', desc: B('אדמה. יש שמונה פינים כאלה, וכולם מחוברים זה לזה.', 'Ground. There are eight such pins, all connected to each other.') }
      ],
      pinsNote: B('`VBUS` נמצא בפין 40, `VSYS` בפין 39, ו-`3V3(OUT)` בפין 36. פיני ה-GND הם 3, 8, 13, 18, 23, 28 ו-38, ובנוסף `AGND` בפין 33. אפשר להשתמש ב-GND הקרוב ביותר.',
        '`VBUS` on pin 40, `VSYS` on pin 39, `3V3(OUT)` on pin 36. GND pins: 3, 8, 13, 18, 23, 28 and 38, plus `AGND` on pin 33. Use whichever GND is closest.'),
      code: [
        'from machine import ADC',
        '',
        '# ADC3 measures one third of VSYS, so you can check the supply voltage',
        'vsys = ADC(29).read_u16() * 3.3 / 65535 * 3',
        'print("VSYS =", round(vsys, 2), "V")'
      ],
      explain: [
        E([4], 'פין פנימי בשם GP29 מחובר למתח ההזנה של הלוח, אחרי שהמתח חולק בשלוש. השורה הזו מודדת אותו, ממירה לוולטים ומכפילה בשלוש.', 'An internal pin named GP29 is connected to the board\'s supply voltage, after it has been divided by three. Measure it, convert to volts, and multiply by three.'),
        E([5], 'השורה הזו מדפיסה את המתח. כשהלוח מחובר ל-USB, התוצאה אמורה להיות בערך 4.7 עד 5.', 'Prints the voltage. With the board on USB the result should be about 4.7 to 5.')
      ],
      tips: [
        B('אל תזינו מנוע, סרבו או פס לדים מ-`3V3(OUT)`. הם צורכים יותר [[current|זרם]] ממה שהמייצב יכול לספק, ואז הלוח נכבה ומתאתחל.', 'Do not power a motor, servo or LED strip from `3V3(OUT)`. They draw more [[current|current]] than the regulator can supply, and the board shuts down and restarts.'),
        B('יציאת USB של מחשב מספקת בערך 500[[ma|mA]] לכל הפרויקט, כולל ה-Pico עצמו.', 'A computer\'s USB port supplies about 500 [[ma|mA]] for the whole project, including the Pico itself.'),
        B('כאשר משתמשים בספק כוח נפרד למנועים, חברו את ה-GND שלו ל-GND של ה-Pico.', 'When using a separate supply for motors, connect its GND to the Pico\'s GND.'),
        B('כאשר כמה רכיבים צריכים 3.3V ו-GND, חברו את שני הפינים האלה פעם אחת לפסי המתח של ה[[breadboard|מטריצה]], ומשם לכל רכיב.', 'When several parts need 3.3 V and GND, connect those two pins once to the [[breadboard|breadboard]] power rails, and from there to each part.'),
        B('לפני שמחברים את ה-USB, בדקו שאין [[short|קצר]]: שאף חוט לא מחבר ישירות בין `3V3` או `VBUS` לבין `GND`.', 'Before plugging in USB, check there is no [[short|short circuit]]: no wire directly joining `3V3` or `VBUS` to `GND`.')
      ],
      more: null,
      quiz: [
        Q(B('מאיזה פין מזינים סרבו?', 'Which pin powers a servo?'),
          [B('`3V3(OUT)`', '`3V3(OUT)`'), B('`VBUS`', '`VBUS`'), B('`GP15`', '`GP15`')], 1,
          B('סרבו צריך 5V והרבה זרם, ו-`VBUS` נותן 5V ישירות מה-USB.', 'A servo needs 5 V and a lot of current. `VBUS` gives 5 V straight from USB.')),
        Q(B('חיישן מקבל הזנה מספק נפרד. האם צריך לחבר את ה-GND שלו ל-Pico?', 'A sensor is powered from a separate supply. Must its GND be connected to the Pico?'),
          [B('כן, תמיד', 'Yes, always'), B('לא, יש לו ספק משלו', 'No, it has its own supply')], 0,
          B('בלי אדמה משותפת, האותות שעוברים בין הרכיב ל-Pico חסרי משמעות.', 'Without a shared ground the signals between the part and the Pico mean nothing.'))
      ]
    }
  ];

  P.interfaceById = function (id) {
    for (var i = 0; i < P.interfaces.length; i++) if (P.interfaces[i].id === id) return P.interfaces[i];
    return null;
  };

  /* "I want to..." -> which interface. Shown on the interfaces index. */
  P.chooser = [
    { want: B('להדליק ולכבות לד', 'Switch an LED on and off'), use: 'gpio' },
    { want: B('לדעת אם כפתור לחוץ, או אם יש תנועה', 'Know whether a button is pressed, or there is motion'), use: 'gpio' },
    { want: B('לקרוא כפתור סיבוב, כמות אור או לחות קרקע', 'Read a knob, the amount of light, soil moisture'), use: 'adc' },
    { want: B('לעמעם לד, להזיז סרבו או לנגן צליל', 'Dim an LED, move a servo, play a tone'), use: 'pwm' },
    { want: B('לחבר מסך קטן, או כמה חיישנים יחד', 'Connect a small display, or several sensors together'), use: 'i2c' },
    { want: B('לשמור נתונים בכרטיס זיכרון', 'Save data to a memory card'), use: 'spi' },
    { want: B('לתקשר עם GPS, עם Bluetooth או עם לוח נוסף', 'Talk to GPS, Bluetooth or another board'), use: 'uart' },
    { want: B('לשלוט בפס לדים צבעוני', 'Control a colour LED strip'), use: 'pio' },
    { want: B('להבין לאן מחברים VCC ו-GND', 'Understand where VCC and GND connect'), use: 'power' }
  ];
})(window.PICO);
