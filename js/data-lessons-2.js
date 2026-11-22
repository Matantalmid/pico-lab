/* Lesson tracks, part 2 of 2: track C (sensors and a display) and
   track D (your own project). Same structure as data-lessons.js. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, UNPLUG = x.UNPLUG, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ, RES = x.RES;

  P.lessons.push(
    /* ============================================================ C1 */
    {
      id: 'C1', track: 'C',
      title: B('חיישן חניה', 'A parking sensor'),
      goal: B('חיישן מרחק ובאזר: ככל שמתקרבים, הצפצופים נעשים מהירים יותר.', 'A distance sensor and a buzzer: the closer you get, the faster the beeps.'),
      learn: [
        B('איך מחברים בבטחה רכיב שעובד ב-5V, בעזרת [[divider|מחלק מתח]].', 'To connect a 5 V part safely, with a [[divider|voltage divider]].'),
        B('איך הופכים מדידה להתנהגות: המרחק קובע את הקצב.', 'To turn a measurement into behaviour: distance sets the pace.'),
        B('איך מטפלים במקרה שבו אין מדידה.', 'To handle the case where there is no measurement.')
      ],
      before: [
        { href: '#/components/hcsr04', label: B('העמוד של חיישן המרחק', 'The distance sensor\'s page'), why: B('שם מוסבר מחלק המתח צעד אחר צעד. חשוב מאוד לקרוא אותו.', 'The voltage divider is explained step by step there. Do read it.') },
        { href: '#/lessons/B4', label: B('שיעור B4', 'Lesson B4'), why: B('שם למדנו להשתמש בבאזר.', 'For the buzzer.') }
      ],
      parts: [{ id: 'hcsr04', qty: 1 }, { id: 'buzzer', qty: 1 }, { text: B('נגד של 1kΩ ונגד של 2kΩ', 'A 1 kΩ resistor and a 2 kΩ resistor') }, { text: B('שישה חוטי גישור', 'Six jumper wires') }],
      wiring: [
        W(B('חיישן, VCC', 'Sensor, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('חיישן, Trig', 'Sensor, Trig'), 'GP3', 5, null, 'Trig'),
        W(B('חיישן, Echo', 'Sensor, Echo'), 'GP2', 4, B('דרך מחלק מתח: נגד של 1kΩ בין Echo ל-GP2, ונגד של 2kΩ בין GP2 ל-GND', 'through a divider: 1 kΩ from Echo to GP2, and 2 kΩ from GP2 to GND'), 'Echo'),
        W(B('חיישן, GND', 'Sensor, GND'), 'GND', 3, null, 'GND'),
        W(B('באזר, +', 'Buzzer, +'), 'GP13', 17, null, B('באזר', 'Buzzer')),
        W(B('באזר, −', 'Buzzer, −'), 'GND', 18, null, 'GND')
      ],
      steps: [
        UNPLUG,
        B('הוציאו מהמטריצה את הרכיבים מהשיעורים הקודמים.', 'Clear the breadboard of the earlier lessons.'),
        B('חברו את חיישן המרחק לפי ההוראות שבעמוד שלו, כולל שני הנגדים שעל Echo. אל תוותרו על הנגדים.', 'Connect the distance sensor following its page, including the two resistors on Echo. Do not skip the resistors.'),
        B('חברו את הבאזר: את ה-+ לפין 17 (`GP13`), ואת הרגל השנייה לפין 18 (`GND`).', 'Connect the buzzer: + to pin 17 (`GP13`), and the other leg to pin 18 (`GND`).'),
        PLUG, RUN,
        B('קרבו יד או ספר אל החיישן, והרחיקו אותם ממנו.', 'Move a hand, or a book, towards and away from the sensor.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, time_pulse_us',
        'from time import sleep, sleep_us',
        '',
        'trig = Pin(3, Pin.OUT)',
        'echo = Pin(2, Pin.IN)',
        'buzzer = PWM(Pin(13))',
        'buzzer.freq(1000)',
        '',
        'def distance_cm():',
        '    trig.low()',
        '    sleep_us(2)',
        '    trig.high()',
        '    sleep_us(10)',
        '    trig.low()',
        '    t = time_pulse_us(echo, 1, 30000)',
        '    if t < 0:',
        '        return None',
        '    return t * 0.0343 / 2',
        '',
        'def beep():',
        '    buzzer.duty_u16(32768)',
        '    sleep(0.05)',
        '    buzzer.duty_u16(0)',
        '',
        'while True:',
        '    d = distance_cm()',
        '    print(d)',
        '    if d is not None and d < 50:',
        '        beep()',
        '        sleep(d / 100)          # closer = shorter pause = faster beeps',
        '    else:',
        '        sleep(0.2)'
      ],
      explain: [
        E([4, 7], 'השורות האלה מכינות את שלושת הפינים: Trig כיציאה, Echo ככניסה, ואת הבאזר ב-PWM עם צליל קבוע של 1000 הרץ.', 'Prepares the three pins: Trig as output, Echo as input, and the buzzer on PWM with a fixed 1000 Hz tone.'),
        E([9, 18], 'זו הפונקציה מעמוד הרכיב: היא שולחת [[pulse|פולס]], מודדת כמה זמן לוקח להד לחזור, ומחזירה את המרחק בסנטימטרים. אם לא חוזר הד, היא מחזירה `None`.', 'The function from the part\'s page: sends a [[pulse|pulse]], times how long the echo takes to return, and returns a distance in centimetres. With no echo it returns `None`.'),
        E([20, 23], 'זו פונקציה שמשמיעה צפצוף קצר אחד, באורך של 5 מאיות שנייה.', 'A function for one short beep, 5 hundredths of a second long.'),
        E([26, 27], 'כאן מודדים את המרחק ומדפיסים אותו, כדי שתוכלו לראות את המספרים.', 'Measures and prints, so you can see the numbers.'),
        E([28], 'כאן נבדקים שני תנאים יחד: שיש מדידה (`is not None`), ושהמרחק קטן מ-50 סנטימטר. הבדיקה הראשונה חייבת לבוא קודם, כי אי אפשר להשוות את `None` למספר.', 'Two conditions together: there is a measurement (`is not None`), and the distance is under 50 centimetres. The first check must come first, because `None` cannot be compared with a number.'),
        E([29, 30], 'התוכנית מצפצפת, ואז ממתינה זמן שתלוי במרחק. במרחק של 50 סנטימטר ההמתנה היא חצי שנייה, ובמרחק של 5 סנטימטר היא 5 מאיות שנייה.', 'Beeps, then waits for a time that depends on the distance. At 50 centimetres the wait is half a second. At 5 centimetres it is 5 hundredths of a second.'),
        E([31, 32], 'אם שום דבר לא נמצא קרוב, הבאזר שותק, והמדידה הבאה מתבצעת אחרי חמישית שנייה.', 'If nothing is close, stays quiet and measures again after a fifth of a second.')
      ],
      expect: B('כשאין שום דבר בטווח של חצי מטר, שקט. כשמקרבים יד מתחילים צפצופים, והם נעשים מהירים יותר ככל שהיד מתקרבת.', 'With nothing within half a metre, silence. Bring a hand closer and beeps begin, growing faster the closer the hand gets.'),
      tasks: [
        { t: B('גרמו לכך שמתחת ל-5 סנטימטר יישמע צליל רצוף במקום צפצופים.', 'Below 5 centimetres, make the sound continuous rather than beeps.'), hint: B('הוסיפו בדיקה לפני הצפצוף: אם `d < 5`, הפעילו את הבאזר ואל תכבו אותו. אל תשכחו לכבות אותו בכל שאר המקרים.', 'Add a check before the beep: if `d < 5`, turn the buzzer on and do not turn it off. Remember to turn it off in the other cases.') },
        { t: B('הוסיפו שלושה לדים: ירוק כשהמרחק מעל 30 סנטימטר, צהוב כשהוא בין 10 ל-30, ואדום כשהוא מתחת ל-10.', 'Add three LEDs: green above 30 centimetres, yellow between 10 and 30, red below 10.'), hint: B('השתמשו ב-`if`, `elif` ו-`else`. לפני שמדליקים לד, כבו את שלושתם.', 'Use `if`, `elif`, `else`. Before lighting an LED, switch all three off.') },
        { t: B('שנו גם את גובה הצליל לפי המרחק: ככל שהעצם קרוב יותר, הצליל גבוה יותר.', 'Change the pitch with the distance too: closer means higher.'), hint: B('הוסיפו לפני `beep()` את השורה `buzzer.freq(2000 - int(d) * 30)`.', 'Before `beep()`: `buzzer.freq(2000 - int(d) * 30)`.') }
      ],
      quiz: [
        Q(B('למה בודקים את `d is not None` לפני `d < 50`?', 'Why check `d is not None` before `d < 50`?'),
          [B('כי אי אפשר להשוות "אין מדידה" למספר, והתוכנית תיעצר בשגיאה', 'Because "no measurement" cannot be compared with a number, and the program would stop with an error'), B('כדי שהתוכנית תרוץ מהר יותר', 'To make the program run faster'), B('אין סיבה, הסדר לא משנה', 'No reason, the order does not matter')], 0,
          B('כשהחיישן לא קולט הד, הפונקציה מחזירה `None`, והשוואה שלו ל-50 גורמת לשגיאה.', 'When the sensor gets no echo, the function returns `None`. Comparing that with 50 is an error.'))
      ]
    },

    /* ============================================================ C2 */
    {
      id: 'C2', track: 'C',
      title: B('אזעקת תנועה', 'A motion alarm'),
      goal: B('חיישן תנועה שמפעיל לד מהבהב וצפצוף כשמישהו עובר לידו.', 'A motion sensor that sets off a flashing LED and a beep when someone passes.'),
      learn: [
        B('איך משלבים שלושה רכיבים בתוכנית אחת.', 'To combine three parts in one program.'),
        B('איך מפעילים כמה יציאות בבת אחת.', 'To drive several outputs together.'),
        B('איך נותנים לחיישן זמן להתייצב לפני שמתחילים.', 'To give a sensor time to settle before starting.')
      ],
      before: [{ href: '#/components/pir', label: B('העמוד של חיישן התנועה', 'The motion sensor\'s page') }, { href: '#/lessons/C1', label: B('שיעור C1', 'Lesson C1') }],
      parts: [{ id: 'pir', qty: 1 }, { id: 'led', qty: 1 }, { id: 'buzzer', qty: 1 }, { text: B('נגד של 330Ω', 'A 330 Ω resistor') }],
      wiring: [
        W(B('חיישן תנועה, VCC', 'Motion sensor, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('חיישן תנועה, OUT', 'Motion sensor, OUT'), 'GP22', 29, null, B('תנועה', 'Motion')),
        W(B('חיישן תנועה, GND', 'Motion sensor, GND'), 'GND', 28, null, 'GND'),
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('באזר, +', 'Buzzer, +'), 'GP13', 17, null, B('באזר', 'Buzzer')),
        W(B('לד, רגל קצרה + באזר, −', 'LED short leg + buzzer −'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [
        UNPLUG,
        B('פרקו את חיישן המרחק ואת שני הנגדים שלו. הבאזר נשאר מחובר ל-`GP13`.', 'Remove the distance sensor and its two resistors. The buzzer stays on `GP13`.'),
        B('חברו את הלד ל-`GP15` דרך נגד, כמו בשיעור A1.', 'Connect the LED to `GP15` through a resistor, as in lesson A1.'),
        B('חברו את חיישן התנועה בשלושה חוטים עם קצה נקבה: את VCC לפין 40, את OUT לפין 29 ואת GND לפין 28.', 'Connect the motion sensor with three female-ended wires: VCC to pin 40, OUT to pin 29, GND to pin 28.'),
        PLUG, RUN,
        B('חכו בלי לזוז עד שיודפס armed, ואז הזיזו יד מול החיישן.', 'Wait without moving until armed is printed, then move a hand in front of the sensor.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'pir = Pin(22, Pin.IN)',
        'led = Pin(15, Pin.OUT)',
        'buzzer = PWM(Pin(13))',
        'buzzer.freq(880)',
        '',
        'print("warming up...")',
        'sleep(30)',
        'print("armed")',
        '',
        'while True:',
        '    if pir.value() == 1:',
        '        print("motion!")',
        '        for i in range(5):',
        '            led.on()',
        '            buzzer.duty_u16(32768)',
        '            sleep(0.1)',
        '            led.off()',
        '            buzzer.duty_u16(0)',
        '            sleep(0.1)',
        '    sleep(0.1)'
      ],
      explain: [
        E([4, 7], 'השורות האלה מכינות שלושה רכיבים: החיישן הוא כניסה, הלד הוא יציאה, והבאזר עובד ב-PWM.', 'Three parts: the sensor is an input, the LED an output, and the buzzer on PWM.'),
        E([9, 11], 'כאן נותנים לחיישן חצי דקה להתייצב, כי בזמן הזה הוא נותן התרעות שווא. ההדפסות מספרות לכם מה קורה.', 'Gives the sensor half a minute to settle. During that time it gives false alarms. The prints tell you what is going on.'),
        E([14], 'החיישן מוציא 1 כשהוא מזהה תנועה.', 'The sensor outputs 1 when there is motion.'),
        E([16], 'השורה הזו חוזרת חמש פעמים על מה שנמצא בתוכה.', 'Repeats what is inside five times.'),
        E([17, 19], 'כאן מדליקים את הלד ואת הבאזר יחד, וממתינים עשירית שנייה.', 'Switches the LED and the buzzer on together, and waits a tenth of a second.'),
        E([20, 22], 'כאן מכבים את שניהם וממתינים שוב. כך נוצר הבהוב עם צפצוף.', 'Switches both off and waits. This gives a flash with a beep.'),
        E([23], 'בזכות ההמתנה הזו, החיישן נבדק עשר פעמים בשנייה.', 'Checks the sensor ten times a second.')
      ],
      expect: B('מודפס warming up, ואחרי חצי דקה מודפס armed. מאותו רגע, כל תנועה מול החיישן גורמת לחמישה הבהובים עם צפצוף.', 'warming up is printed, and after half a minute armed. From then on, any motion in front of the sensor causes five flashes with a beep.'),
      tasks: [
        { t: B('ספרו כמה פעמים זוהתה תנועה, והדפיסו את המספר.', 'Count how many times motion was detected, and print the number.'), hint: B('צרו משתנה `count` שמתחיל מ-0, והוסיפו `count = count + 1` בתוך ה-`if`.', 'A variable `count` starting at 0, and `count = count + 1` inside the `if`.') },
        { t: B('הוסיפו כפתור שמפעיל את האזעקה ומכבה אותה.', 'Add a button that arms and disarms the alarm.'), hint: B('צרו משתנה `armed` שערכו `True` או `False`. כל לחיצה הופכת אותו, כמו בשיעור A4. האזעקה פועלת רק כאשר `armed` הוא `True`.', 'A variable `armed` that is `True` or `False`. A press flips it, as in lesson A4. The alarm only acts while `armed` is `True`.') },
        { t: B('בעמוד של חיישן התנועה יש גרסה שמשתמשת ב[[interrupt|פסיקה]]. נסו להפוך את התוכנית הזו לגרסה כזו.', 'The motion sensor\'s page has a version using an [[interrupt|interrupt]]. Try turning this program into that kind.'), hint: B('הפונקציה שהפסיקה מפעילה צריכה להיות קצרה. מספיק שהיא תשנה משתנה, והלולאה הראשית תטפל בהבהוב.', 'The function an interrupt runs should be short. It is enough for it to change a variable, with the main loop handling the flashing.') }
      ],
      quiz: [
        Q(B('למה התוכנית ממתינה 30 שניות בהתחלה?', 'Why does the program wait 30 seconds at the start?'),
          [B('כדי שהלוח יתחמם', 'So the board warms up'), B('כי חיישן התנועה צריך זמן להתייצב, ובינתיים הוא נותן התרעות שווא', 'Because the motion sensor needs time to settle, and gives false alarms meanwhile'), B('אין סיבה', 'No reason')], 1,
          B('החיישן מודד שינויים בחום. אחרי שמדליקים אותו, לוקח לו זמן ללמוד את הסביבה.', 'The sensor measures changes in heat. After power-up it takes time to learn its surroundings.'))
      ]
    },

    /* ============================================================ C3 */
    {
      id: 'C3', track: 'C',
      title: B('המסך הראשון', 'The first display'),
      goal: B('חברו מסך קטן, והציגו עליו טקסט ומונה שעולה.', 'Connect a small display and show text and a rising counter on it.'),
      learn: [
        B('איך מחברים רכיב [[i2c|I2C]] ובודקים שהוא עונה.', 'To connect an [[i2c|I2C]] part and check that it answers.'),
        B('איך מתקינים [[library|ספרייה]].', 'To install a [[library|library]].'),
        B('איך מציירים על המסך: מנקים, כותבים ומציגים.', 'To draw on the display: clear, write and show.')
      ],
      before: [{ href: '#/components/oled', label: B('העמוד של המסך', 'The display\'s page'), why: B('שם מוסבר איך מתקינים את הספרייה.', 'It explains how to install the library.') }, { href: '#/interfaces/i2c', label: B('העמוד על I2C', 'The I2C page') }],
      parts: [{ id: 'oled', qty: 1 }, { text: B('ארבעה חוטי גישור', 'Four jumper wires') }],
      wiring: [
        W(B('מסך, VCC', 'Display, VCC'), '3V3', 36, null, '3.3V'),
        W(B('מסך, GND', 'Display, GND'), 'GND', 8, null, 'GND'),
        W(B('מסך, SDA', 'Display, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מסך, SCL', 'Display, SCL'), 'GP5', 7, null, 'SCL')
      ],
      steps: [
        UNPLUG,
        B('אפשר להשאיר את הרכיבים מהשיעור הקודם, כי המסך משתמש בפינים אחרים.', 'The parts from the previous lesson can stay. The display uses different pins.'),
        B('הכניסו את המסך למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה. קראו את הכיתוב שעל המסך, כי סדר הפינים משתנה בין יצרנים.', 'Push the display into the breadboard and connect its four pins by the table. Read the printing on the display: the pin order varies between makers.'),
        PLUG,
        B('התקינו את הספרייה `ssd1306` דרך Thonny: בתפריט Tools בחרו Manage packages.', 'Install the `ssd1306` library through Thonny: Tools, then Manage packages.'),
        RUN, READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        '',
        'count = 0',
        'while True:',
        '    oled.fill(0)',
        '    oled.text("Pico 2 Lab", 0, 0)',
        '    oled.text("count: " + str(count), 0, 24)',
        '    oled.show()',
        '    count = count + 1',
        '    sleep(1)'
      ],
      explain: [
        E([2], 'השורה הזו טוענת את הספרייה של המסך. אם מופיעה בה שגיאה, סימן שהספרייה לא הותקנה.', 'Brings in the display\'s library. An error on this line means the library was not installed.'),
        E([5, 6], 'השורות האלה מגדירות את [[bus|אפיק]] ה-I2C על GP4 ו-GP5, ועליו מסך של 128 על 64 פיקסלים.', 'Sets up the I2C [[bus|bus]] on GP4 and GP5, with a 128 by 64 pixel display on it.'),
        E([10], 'השורה הזו מנקה את דף הטיוטה. בלעדיה, הטקסט החדש ייכתב מעל הישן.', 'Clears the draft page. Without it the new text is written over the old.'),
        E([11], 'השורה הזו כותבת שורת טקסט בפינה השמאלית העליונה: 0 פיקסלים משמאל ו-0 מלמעלה.', 'Writes a line of text in the top-left corner: 0 pixels from the left, 0 from the top.'),
        E([12], 'השורה הזו כותבת את המונה, 24 פיקסלים מלמעלה. `str(count)` הופך את המספר לטקסט, כי אי אפשר לחבר טקסט למספר.', 'Writes the counter, 24 pixels from the top. `str(count)` turns the number into text, because text cannot be joined to a number.'),
        E([13], 'השורה הזו שולחת את הדף למסך. רק עכשיו רואים את השינוי.', 'Sends the page to the screen. Only now is the change visible.'),
        E([14, 15], 'השורות האלה מוסיפות 1 למונה וממתינות שנייה.', 'Adds 1 to the counter and waits a second.')
      ],
      expect: B('על המסך מופיעה הכותרת Pico 2 Lab, ומתחתיה מונה שעולה באחד בכל שנייה.', 'The heading Pico 2 Lab appears on the display, with a counter beneath it rising by one every second.'),
      tasks: [
        { t: B('כתבו את השם שלכם באנגלית במקום הכותרת.', 'Write your name in place of the heading.'), hint: B('המסך הזה מציג רק אותיות באנגלית, ספרות וסימנים. עברית לא תוצג עליו.', 'This display shows only English letters, digits and symbols.') },
        { t: B('הוסיפו מתחת למונה פס התקדמות שמתמלא לאט.', 'Add a progress bar that slowly fills beneath the counter.'), hint: B('`oled.fill_rect(x, y, רוחב, גובה, 1)` מצייר מלבן מלא. נסו `oled.fill_rect(0, 44, count % 128, 10, 1)`.', '`oled.fill_rect(x, y, width, height, 1)` draws a filled rectangle. Try `oled.fill_rect(0, 44, count % 128, 10, 1)`.') },
        { t: B('החליפו את הזמן בכפתור: המונה יעלה רק כשלוחצים עליו.', 'Replace time with a button: the counter rises only when pressed.'), hint: B('שלבו את זיהוי רגע הלחיצה משיעור A4, ועדכנו את המסך רק כשהמונה משתנה.', 'Bring in the press detection from lesson A4. Update the display only when the counter changes.') }
      ],
      quiz: [
        Q(B('שיניתם את הטקסט בקוד, אבל המסך לא השתנה. מה שכחתם?', 'You changed the text in the code, but the display did not change. What did you forget?'),
          [B('`oled.show()`', '`oled.show()`'), B('`import`', '`import`'), B('נגד', 'A resistor')], 0,
          B('`text` ו-`fill` מציירים רק בזיכרון. `show` הוא זה ששולח את הציור למסך.', '`text` and `fill` draw only in memory. `show` is what sends the drawing to the screen.'))
      ]
    },

    /* ============================================================ C4 */
    {
      id: 'C4', track: 'C',
      title: B('תחנת מזג אוויר', 'A weather station'),
      goal: B('מדדו טמפרטורה ולחות, והציגו אותן על המסך. זה מכשיר שלם שעובד בלי מחשב.', 'Measure temperature and humidity and show them on the display. A whole device that works without a computer.'),
      learn: [
        B('איך משלבים חיישן ומסך.', 'To combine a sensor and a display.'),
        B('איך בונים שורת טקסט ממספרים.', 'To build a line of text from numbers.'),
        B('איך מסדרים תוכנית: קודם קוראים, ואחר כך מציגים.', 'To organise a program: read first, then show.')
      ],
      before: [{ href: '#/lessons/C3', label: B('שיעור C3', 'Lesson C3'), why: B('המסך נשאר מחובר.', 'The display stays connected.') }, { href: '#/components/dht22', label: B('העמוד של חיישן הטמפרטורה', 'The temperature sensor\'s page') }],
      parts: [{ id: 'dht22', qty: 1 }, { id: 'oled', qty: 1 }, { text: B('שלושה חוטי גישור נוספים', 'Three more jumper wires') }],
      wiring: [
        W(B('חיישן, +', 'Sensor, +'), '3V3', 36, B('יחד עם המסך, דרך פס המתח', 'together with the display, through the power rail'), '3.3V'),
        W(B('חיישן, OUT', 'Sensor, OUT'), 'GP6', 9, null, 'DHT22'),
        W(B('חיישן, −', 'Sensor, −'), 'GND', 8, B('יחד עם המסך', 'together with the display'), 'GND'),
        W(B('מסך, SDA', 'Display, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מסך, SCL', 'Display, SCL'), 'GP5', 7, null, 'SCL')
      ],
      steps: [
        UNPLUG,
        B('המסך משיעור C3 נשאר מחובר.', 'The display from lesson C3 stays connected.'),
        B('עכשיו שני רכיבים צריכים 3.3V ואדמה. חברו את פין 36 (`3V3(OUT)`) לפס המתח האדום של המטריצה ואת פין 8 (`GND`) לפס הכחול, וקחו משם מתח לשני הרכיבים.', 'Two parts now need 3.3 V and ground. Connect pin 36 (`3V3(OUT)`) to the breadboard\'s red power rail and pin 8 (`GND`) to the blue rail, and take power for both parts from there.'),
        B('הכניסו את חיישן הטמפרטורה למטריצה. חברו את ה-+ לפס האדום, את ה-− לפס הכחול, ואת OUT לפין 9 (`GP6`).', 'Push in the temperature sensor. Connect + to the red rail, − to the blue rail, and OUT to pin 9 (`GP6`).'),
        PLUG, RUN,
        B('נשפו על החיישן, וראו איך הלחות עולה.', 'Breathe on the sensor and watch the humidity rise.'),
        READ
      ],
      code: [
        'import dht',
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep',
        '',
        'sensor = dht.DHT22(Pin(6))',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        '',
        'while True:',
        '    sensor.measure()',
        '    temp = sensor.temperature()',
        '    hum = sensor.humidity()',
        '',
        '    oled.fill(0)',
        '    oled.text("Weather", 0, 0)',
        '    oled.text("Temp: " + str(temp) + " C", 0, 20)',
        '    oled.text("Hum:  " + str(hum) + " %", 0, 36)',
        '    oled.show()',
        '',
        '    print(temp, hum)',
        '    sleep(2)'
      ],
      explain: [
        E([1, 4], 'ארבע שורות import: אחת לחיישן, אחת לפינים ול-I2C, אחת למסך ואחת להמתנה.', 'Four import lines: for the sensor, for pins and I2C, for the display, and for waiting.'),
        E([6, 8], 'השורות האלה מכינות את החיישן ואת המסך, כל רכיב על הפינים שלו.', 'Prepares the sensor and the display. Each part on its own pins.'),
        E([11, 13], 'זה החלק הראשון של הלולאה, הקלט: מבקשים מדידה, ושומרים את שני הערכים במשתנים.', 'The first part of the loop, the input: asks for a measurement and stores the two values in variables.'),
        E([15, 19], 'זה החלק השני, הפלט: מנקים את המסך, כותבים כותרת ושתי שורות, ומציגים. הסימן `+` מחבר כמה חלקי טקסט לשורה אחת.', 'The second part, the output: clears the display, writes a heading and two lines, and shows it. `+` joins pieces of text into one line.'),
        E([21], 'השורה הזו מדפיסה את הערכים גם למחשב. זה נוח לבדיקה, ולא מזיק כשאין מחשב.', 'Prints to the computer as well. Handy for checking, and harmless when there is no computer.'),
        E([22], 'השורה הזו ממתינה שתי שניות, כי החיישן לא יכול למדוד מהר יותר.', 'Waits two seconds. The sensor cannot measure any faster.')
      ],
      expect: B('על המסך מופיעות הטמפרטורה והלחות, והן מתעדכנות כל שתי שניות.', 'The temperature and humidity appear on the display, updating every two seconds.'),
      tasks: [
        { t: B('הוסיפו לד שנדלק כשהטמפרטורה עולה מעל 28 מעלות.', 'Add an LED that lights when the temperature is above 28 degrees.'), hint: B('הוסיפו `if temp > 28:` אחרי המדידה. כדי לבדוק, חממו את החיישן בין האצבעות.', '`if temp > 28:` after the measurement. To test it, warm the sensor between your fingers.') },
        { t: B('שמרו את הטמפרטורה הגבוהה ביותר שנמדדה, והציגו אותה בשורה נוספת.', 'Remember the highest temperature measured, and show it on an extra line.'), hint: B('צרו משתנה `max_temp` לפני הלולאה. בכל סיבוב בדקו `if temp > max_temp:`, ואם כן, עדכנו אותו.', 'A variable `max_temp` before the loop. Each round: `if temp > max_temp:` update it.') },
        {
          t: B('לפעמים החיישן נכשל במדידה, והתוכנית נעצרת בשגיאה. גרמו לה להמשיך לרוץ.', 'Sometimes the sensor fails a measurement and the program stops with an error. Make it keep running.'),
          hint: B('`try:` מנסה להריץ קטע קוד. אם מתרחשת שגיאה, רץ מה שנמצא תחת `except`. `continue` קופץ לתחילת הסיבוב הבא של הלולאה.', '`try:` attempts to run a piece of code. If there is an error, what is under `except` runs. `continue` jumps to the start of the next round of the loop.'),
          code: [
            'import dht',
            'from machine import Pin',
            'from time import sleep',
            '',
            'sensor = dht.DHT22(Pin(6))',
            '',
            'while True:',
            '    try:',
            '        sensor.measure()',
            '    except OSError:',
            '        print("sensor error, trying again")',
            '        sleep(2)',
            '        continue',
            '    print(sensor.temperature(), sensor.humidity())',
            '    sleep(2)'
          ]
        }
      ],
      quiz: [
        Q(B('שני הרכיבים צריכים 3.3V, אבל יש רק פין `3V3(OUT)` אחד. מה עושים?', 'Both parts need 3.3 V, but there is only one `3V3(OUT)` pin. What do you do?'),
          [B('מחברים את הפין לפס המתח של המטריצה, ומשם לכל אחד מהרכיבים', 'Connect the pin to the breadboard\'s power rail, and from there to each part'), B('מזינים אחד מהם מפין GP', 'Power one of them from a GP pin'), B('אי אפשר לחבר שני רכיבים', 'Two parts cannot be connected')], 0,
          B('כל החורים בפס המתח מחוברים זה לזה, ולכן הוא מחלק את המתח לכמה רכיבים שצריך.', 'All the holes in the power rail are connected, so it shares the voltage among as many parts as needed.'))
      ]
    },

    /* ============================================================ D1 */
    {
      id: 'D1', track: 'D',
      title: B('מתכננים פרויקט', 'Planning a project'),
      goal: B('איך הופכים רעיון לפרויקט שעובד, בלי ללכת לאיבוד בדרך.', 'How to turn an idea into a working project without getting lost on the way.'),
      learn: [
        B('איך מפרקים רעיון לקלט, עיבוד ופלט.', 'To break an idea into input, processing and output.'),
        B('איך בונים בשלבים קטנים ובודקים כל שלב.', 'To build in small stages and test each one.'),
        B('איך מסדרים תוכנית בשלושה חלקים: קוראים, מחליטים ופועלים.', 'To organise a program in three parts: read, decide, act.')
      ],
      before: [{ href: '#/basics/microcontroller', label: B('הפרק "מה זה מיקרו-בקר"', 'The chapter "What a microcontroller is"'), why: B('שם מוסברים קלט, עיבוד ופלט.', 'For input, processing and output.') }, { href: '#/planner', label: B('מתכנן הפרויקט', 'The project planner') }],
      parts: [{ text: B('דף ועט', 'Paper and a pen') }, { text: B('המעגל משיעור A3, עם לד וכפתור, כדי להריץ את הדוגמה', 'The circuit from lesson A3, an LED and a button, to run the example') }],
      steps: [
        B('כתבו במשפט אחד מה הפרויקט עושה. למשל: "מנורה שנדלקת כשחשוך ויש תנועה בחדר".', 'Write in one sentence what the project does. For example: "A lamp that comes on when it is dark and there is motion in the room".'),
        B('רשמו את הקלטים: מה הפרויקט צריך לדעת? בדוגמה: כמה אור יש, והאם יש תנועה.', 'List the inputs: what does the project need to know? In the example: how much light there is, and whether there is motion.'),
        B('רשמו את הפלטים: מה הפרויקט עושה? בדוגמה: הוא מדליק לדים.', 'List the outputs: what does the project do? In the example: it switches LEDs on.'),
        B('כתבו במילים את הכלל שמקשר ביניהם: "אם חשוך וגם יש תנועה, הדלק לחצי דקה".', 'Write the rule that links them, in words: "if it is dark and there is motion, switch on for half a minute".'),
        B('בחרו מתוך קטלוג הרכיבים רכיב לכל קלט ולכל פלט.', 'Choose a part for each input and each output from the component catalog.'),
        B('פתחו את מתכנן הפרויקט, סמנו את הרכיבים, ושמרו את הקישור לתוכנית.', 'Open the project planner, select the parts, and save the link to the plan.'),
        B('חברו רק רכיב אחד, והריצו את הדוגמה מהעמוד שלו. ודאו שהוא עובד לפני שאתם ממשיכים.', 'Connect just one part and run the example from its page. Make sure it works before going on.'),
        B('הוסיפו את הרכיב הבא ובדקו שוב. כך, אם משהו מפסיק לעבוד, ברור שהבעיה נמצאת ברכיב האחרון שהוספתם.', 'Add the next part and test again. That way, if something stops working, the problem is clearly in the last part you added.'),
        B('רק אחרי שכל הרכיבים עובדים כל אחד בנפרד, כתבו את הכלל בקוד. התחילו מהקוד שהמתכנן מייצר.', 'Only when every part works on its own, write the rule in code. Start from the code the planner generates.')
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        '# 1. Set up every part once',
        'led = Pin(15, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        '# 2. Small functions, one job each',
        'def read_inputs():',
        '    return button.value() == 0',
        '',
        'def decide(pressed):',
        '    return pressed',
        '',
        'def act(light_on):',
        '    led.value(light_on)',
        '',
        '# 3. The loop: read, decide, act',
        'while True:',
        '    pressed = read_inputs()',
        '    light_on = decide(pressed)',
        '    act(light_on)',
        '    sleep(0.02)'
      ],
      explain: [
        E([4, 6], 'החלק הראשון מכין את כל הרכיבים. הוא רץ פעם אחת בלבד.', 'Part one: prepare every part. This section runs once.'),
        E([9, 10], 'זו פונקציה שקוראת את הקלטים ומחזירה את מה שמצאה. כאן היא בודקת אם הכפתור לחוץ.', 'A function that reads the inputs and returns what it found. Here: whether the button is pressed.'),
        E([12, 13], 'זו הפונקציה שמחליטה. כאן הכלל פשוט מאוד: האור דולק כשהכפתור לחוץ. בפרויקט שלכם, הכלל שכתבתם במילים ייכנס לכאן.', 'A function that decides. Here the rule is very simple: the light is on while the button is pressed. In your project, the rule you wrote in words goes here.'),
        E([15, 16], 'זו הפונקציה שמבצעת: היא מדליקה או מכבה את הלד לפי ההחלטה.', 'A function that acts: switches the LED on or off according to the decision.'),
        E([19, 23], 'הלולאה עצמה קצרה וקלה לקריאה: קוראים, מחליטים, פועלים וממתינים. כל פרויקט, גדול ככל שיהיה, יכול להיראות כך.', 'The loop itself is short and readable: read, decide, act, wait. Any project, however large, can look like this.')
      ],
      expect: B('הדוגמה מתנהגת כמו בשיעור A3: הלד דולק כל עוד לוחצים על הכפתור. ההבדל הוא במבנה: כשתרצו לשנות את הכלל, תצטרכו לגעת רק בפונקציה `decide`.', 'The example behaves like lesson A3: the LED is lit while you press. The difference is in the structure. When you want to change the rule, you touch only the `decide` function.'),
      tasksTitle: B('רעיונות לפרויקט', 'Project ideas'),
      tasksHint: B('אפשר לבחור אחד מהרעיונות האלה, לשנות אותו, או להמציא רעיון משלכם. הקישור פותח את התוכנית במתכנן, עם חיווט וקוד התחלתי.', 'Pick one of these, change it, or invent your own. The link opens the plan in the planner, with wiring and starter code.'),
      taskLabel: B('רעיון', 'Idea'),
      tasks: [
        { t: B('מנורה חכמה: נדלקת רק כשחשוך וגם יש תנועה, ונכבית אחרי חצי דקה.', 'A smart lamp: it comes on only when it is dark and there is motion, and goes off after half a minute.'), plan: 'ldr,pir,neopixel' },
        { t: B('תחנת מזג אוויר עם התרעה: מציגה טמפרטורה ולחות, ומצפצפת כשחם מדי.', 'A weather station with an alert: it shows temperature and humidity, and beeps when it is too hot.'), plan: 'led,buzzer,dht22,oled' },
        { t: B('מחסום חניה: נפתח בלחיצת כפתור, ונסגר מעצמו אחרי שהרכב עבר את חיישן המרחק.', 'A car-park barrier: it opens at the press of a button, and closes by itself once the car has passed the distance sensor.'), plan: 'led:2,button,servo,hcsr04' },
        { t: B('יומן טמפרטורה: מודד כל דקה ושומר את המדידות בכרטיס זיכרון, עם מסך שמציג את המדידה האחרונה.', 'A temperature log: it measures every minute and saves to a memory card, with a display showing the latest reading.'), plan: 'ds18b20,oled,sdcard' },
        { t: B('משחק תגובה: לד נדלק ברגע אקראי, ושני שחקנים מתחרים מי ילחץ ראשון.', 'A reaction game: an LED lights at a random moment, and two players race to press first.'), plan: 'led:3,button:2,buzzer', hint: B('המתנה אקראית: `import random`, ואחר כך `sleep(random.uniform(1, 5))`.', 'A random wait: `import random` then `sleep(random.uniform(1, 5))`.') }
      ],
      quiz: [
        Q(B('חיברתם חמישה רכיבים בבת אחת, ושום דבר לא עובד. מה היה עדיף לעשות?', 'You connected five parts at once and nothing works. What would have been better?'),
          [B('לחבר רכיב אחד, לבדוק אותו, ורק אז להוסיף את הבא', 'To connect one part, test it, and only then add the next'), B('לקנות רכיבים יקרים יותר', 'To buy more expensive parts'), B('לכתוב יותר קוד', 'To write more code')], 0,
          B('כשמוסיפים רכיב אחד בכל פעם, כל בעיה שמופיעה שייכת לרכיב האחרון שנוסף.', 'When you add one part at a time, any problem that appears belongs to the last part added.'))
      ]
    },

    /* ============================================================ D2 */
    {
      id: 'D2', track: 'D',
      title: B('הפרויקט עובד לבד', 'The project runs by itself'),
      goal: B('נתקו את הפרויקט מהמחשב. הוא יתחיל לעבוד מעצמו ברגע שיקבל חשמל.', 'Unplug the project from the computer. It starts working by itself the moment it gets power.'),
      learn: [
        B('איך שומרים תוכנית על הלוח כך שתרוץ בכל הדלקה.', 'To save a program on the board so it runs on every power-up.'),
        B('איך מזינים את הפרויקט בלי מחשב.', 'To power the project without a computer.'),
        B('איך יודעים שהתוכנית רצה, גם כשאין מסך שמציג את ההדפסות.', 'To know the program is running even with no screen to show prints.')
      ],
      before: [{ href: '#/start', label: B('העמוד "מתחילים", שלב 6', 'The "Get started" page, step 6'), why: B('שם מוסבר איך שומרים כ-main.py.', 'Saving as main.py is explained there.') }],
      parts: [{ text: B('פרויקט שעובד, מכל אחד מהשיעורים', 'A working project, from any of the lessons') }, { text: B('מטען USB של טלפון, או סוללה ניידת (power bank)', 'A phone USB charger, or a power bank') }],
      steps: [
        B('הוסיפו לתוכנית שלכם את "דופק החיים" מהדוגמה: הלד שעל הלוח מהבהב כל עוד התוכנית רצה.', 'Add the "heartbeat" from the example to your program: the LED on the board blinks for as long as the program runs.'),
        B('הריצו את התוכנית מהמחשב, וודאו שהכול עובד, כולל הלד שעל הלוח.', 'Run it from the computer and make sure everything works, including the LED on the board.'),
        B('ב-Thonny: בתפריט File בחרו Save as, אחר כך Raspberry Pi Pico, וכתבו את השם `main.py`. השם חייב להיות בדיוק כזה.', 'In Thonny: choose File, Save as, then Raspberry Pi Pico, and type the name `main.py`. The name must be exactly that.'),
        B('נתקו את הכבל מהמחשב.', 'Unplug the cable from the computer.'),
        B('חברו את הכבל למטען של טלפון או לסוללה ניידת. אחרי שנייה התוכנית תתחיל לרוץ מעצמה.', 'Plug the cable into a phone charger or a power bank. After a second the program starts running by itself.'),
        B('כדי לשנות את התוכנית, חברו את הלוח שוב למחשב ולחצו על Stop ב-Thonny. התוכנית תיעצר, ותוכלו לערוך אותה.', 'To change the program: reconnect to the computer and press Stop in Thonny. The program stops and can be edited.')
      ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'status = Pin("LED", Pin.OUT)      # the LED on the board itself',
        '',
        '# ... set up your own parts here ...',
        '',
        'while True:',
        '    status.toggle()               # heartbeat: shows the program is alive',
        '    # ... your own loop goes here ...',
        '    sleep(0.5)'
      ],
      explain: [
        E([4], 'זה הלד הירוק שעל הלוח. לא צריך לחבר שום דבר כדי להשתמש בו.', 'The green LED on the board. Nothing needs connecting to use it.'),
        E([6], 'כאן נכנסות שורות ההכנה של הפרויקט שלכם.', 'Your project\'s setup lines go here.'),
        E([9], 'בכל סיבוב של הלולאה הלד מחליף מצב. כל עוד הוא מהבהב, התוכנית חיה. אם הוא מפסיק, התוכנית נתקעה או נעצרה בשגיאה.', 'On every round of the loop the LED flips. While it blinks, the program is alive. If it stops, the program is stuck or has stopped with an error.'),
        E([10], 'כאן נכנס מה שהפרויקט שלכם עושה בכל סיבוב.', 'What your project does on each round goes here.')
      ],
      expect: B('הפרויקט עובד כשהוא מחובר רק למטען, בלי מחשב. הלד שעל הלוח מהבהב ומראה שהתוכנית רצה.', 'The project works connected only to a charger, with no computer. The LED on the board blinks, showing the program is running.'),
      tasks: [
        { t: B('מה קורה להדפסות של `print` כשאין מחשב?', 'What happens to `print` output when there is no computer?'), hint: B('הן פשוט נעלמות. זה לא גורם לשום בעיה, אבל אף אחד לא קורא אותן. לכן צריך לד או מסך כדי לדעת מה קורה.', 'It simply vanishes. That causes no problem, but nobody reads it. Which is why you need an LED or a display to know what is happening.') },
        {
          t: B('אם התוכנית נעצרת בשגיאה כשאין מחשב, לא תדעו למה. גרמו ללד שעל הלוח להבהב מהר כשיש שגיאה.', 'If the program stops with an error and there is no computer, you will not know why. Make the LED on the board blink fast in case of an error.'),
          hint: B('עטפו את הלולאה ב-`try`, ובתוך `except` שימו לולאה שמהבהבת מהר.', 'Wrap the loop in `try`, and inside `except` put a loop that blinks fast.'),
          code: [
            'from machine import Pin',
            'from time import sleep',
            '',
            'status = Pin("LED", Pin.OUT)',
            '',
            'try:',
            '    while True:',
            '        status.toggle()',
            '        # ... your own loop goes here ...',
            '        sleep(0.5)',
            'except Exception as e:',
            '    print("error:", e)',
            '    while True:                  # fast blink = something went wrong',
            '        status.toggle()',
            '        sleep(0.08)'
          ]
        },
        { t: B('בפרויקט יש רכיב שעובד ב-5V, למשל סרבו. האם הוא יעבוד כשמזינים את הלוח ממטען USB?', 'The project has a 5 V part, such as a servo. Will it work when powered from a USB charger?'), hint: B('כן. הפין `VBUS` מקבל 5V מכל מקור שמחובר לשקע ה-USB, וגם ממטען.', 'Yes. The `VBUS` pin gets 5 V from whatever is plugged into the USB socket, a charger included.') }
      ],
      quiz: [
        Q(B('באיזה שם צריך לשמור את התוכנית כדי שתרוץ מעצמה בכל הדלקה?', 'Under what name do you save the program so it runs by itself on every power-up?'),
          [B('`start.py`', '`start.py`'), B('`main.py`', '`main.py`'), B('כל שם שרוצים', 'Any name you like')], 1,
          B('MicroPython מחפש קובץ בשם `main.py` ומריץ אותו בכל פעם שהלוח מקבל חשמל.', 'MicroPython looks for a file named `main.py` and runs it every time the board gets power.'))
      ]
    },

    /* ============================================================ D3 */
    {
      id: 'D3', track: 'D',
      title: B('שני לוחות מדברים', 'Two boards talk'),
      goal: B('כפתור שמחובר ללוח Pico אחד מדליק [[led|לד]] שמחובר ללוח Pico אחר. הלוחות מדברים זה עם זה דרך שלושה חוטים.', 'A button connected to one Pico board lights an [[led|LED]] connected to another Pico board. The boards talk to each other over three wires.'),
      learn: [
        B('איך מחברים שני לוחות Pico בתקשורת [[uart|UART]].', 'To connect two Pico boards with [[uart|UART]] communication.'),
        B('למה החוטים מוצלבים: ה-TX של לוח אחד מחובר ל-RX של הלוח השני.', 'Why the wires cross: one board\'s TX goes to the other\'s RX.'),
        B('למה שני לוחות חייבים [[ground|אדמה]] משותפת.', 'Why two boards must share a [[ground|ground]].'),
        B('איך שולחים הודעה קצרה מלוח אחד, ופועלים לפיה בלוח השני.', 'To send a short message from one board and act on it on the other.')
      ],
      before: [
        { href: '#/lessons/A3', label: B('שיעור A3: לד וכפתור', 'Lesson A3: an LED and a button'), why: B('זה אותו מעגל, אלא שכאן הוא מפוצל בין שני לוחות.', 'The same circuit, split here across two boards.') },
        { href: '#/interfaces/uart', label: B('העמוד על UART', 'The UART page') }
      ],
      parts: [
        { text: B('שני לוחות Pico 2, כל אחד על מטריצה משלו', 'Two Pico 2 boards, each on its own breadboard') },
        { id: 'button' }, { id: 'led' },
        { text: B('נגד של 330Ω ללד', 'A 330 Ω resistor for the LED') },
        { text: B('שלושה חוטי גישור ארוכים, לחיבור בין המטריצות', 'Three long jumper wires, to connect the breadboards') },
        { text: B('שני כבלי USB. אפשר גם להסתפק בכבל אחד ולהעביר אותו מלוח ללוח', 'Two USB cables. One also works, moved from board to board') }
      ],
      boards: 'A=button;B=led;A-B=uart',
      steps: [
        B('נתקו את שני הלוחות מה-USB.', 'Unplug both boards from USB.'),
        B('לוח A: בנו את מעגל הכפתור לפי האיור הראשון. הכפתור מחובר ל-`GP14` ולאדמה.', 'Board A: build the button circuit as in the first picture. The button connects to `GP14` and to ground.'),
        B('לוח B: בנו את מעגל הלד לפי האיור השני. הלד מחובר ל-`GP15` דרך נגד, ולאדמה.', 'Board B: build the LED circuit as in the second picture. The LED connects to `GP15` through a resistor, and to ground.'),
        B('חוט ראשון: מ-`GP8` של לוח A (פין 11) אל `GP9` של לוח B (פין 12). זה ה-TX של A, שמחובר ל-RX של B.', 'First wire: from `GP8` on board A (pin 11) to `GP9` on board B (pin 12). This is A\'s TX going to B\'s RX.'),
        B('חוט שני: מ-`GP9` של לוח A (פין 12) אל `GP8` של לוח B (פין 11). זה הכיוון ההפוך.', 'Second wire: from `GP9` on board A (pin 12) to `GP8` on board B (pin 11). This is the opposite direction.'),
        B('חוט שלישי: מ-`GND` של לוח A אל `GND` של לוח B. בלי החוט הזה שום דבר לא יעבוד.', 'Third wire: from `GND` on board A to `GND` on board B. Without this wire nothing will work.'),
        B('אל תחברו את ה-`3V3` של לוח אחד ל-`3V3` של הלוח השני. כל לוח מקבל חשמל מה-USB שלו.', 'Do not connect one board\'s `3V3` to the other\'s `3V3`. Each board gets power from its own USB.'),
        B('חברו את לוח B למחשב, ושמרו עליו את התוכנית השנייה בשם `main.py`. אחר כך נתקו אותו, וחברו אותו למטען או לשקע USB אחר.', 'Connect board B to the computer, and save the second program on it as `main.py`. Unplug it and connect it to a charger or another USB socket.'),
        B('חברו את לוח A למחשב, והריצו עליו את התוכנית הראשונה.', 'Connect board A to the computer and run the first program on it.'),
        B('לחצו על הכפתור שבלוח A.', 'Press the button on board A.')
      ],
      code: [
        '# Board A: the button',
        'from machine import Pin, UART',
        'from time import sleep',
        '',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        'link = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))',
        '',
        'last = 1',
        'while True:',
        '    now = button.value()',
        '    if now != last:                 # only when the button changed',
        '        if now == 0:',
        '            link.write("on\\n")',
        '        else:',
        '            link.write("off\\n")',
        '        last = now',
        '    sleep(0.02)'
      ],
      explain: [
        E([5], 'זה הכפתור, כמו בשיעור A3.', 'The button, as in lesson A3.'),
        E([6], 'השורה הזו פותחת את חיבור UART מספר 1: משדרים ב-GP8 וקולטים ב-GP9. המהירות, 9600, חייבת להיות זהה בשני הלוחות.', 'Opens UART number 1: transmitting on GP8 and receiving on GP9. The speed, 9600, must be the same on both boards.'),
        E([8], 'כאן שומרים את המצב הקודם של הכפתור. 1 פירושו "לא לחוץ".', 'Remembers the button\'s previous state. 1 means "not pressed".'),
        E([11], 'שולחים הודעה רק כשהמצב השתנה. אחרת היו נשלחות חמישים הודעות בשנייה.', 'Sends a message only when the state changed. Otherwise we would send fifty messages a second.'),
        E([12, 15], 'אם הכפתור נלחץ, שולחים את המילה on, ואם הוא שוחרר, שולחים off. הסימן `\\n` מסמן סוף שורה, וכך הלוח השני יודע שההודעה הסתיימה.', 'Pressed: sends the word on. Released: sends off. The `\\n` marks the end of a line, which is how the other board knows the message is finished.'),
        E([16], 'כאן מעדכנים את המצב השמור.', 'Updates the remembered state.')
      ],
      second: {
        title: B('התוכנית של לוח B', 'The program for board B'),
        code: [
          '# Board B: the LED',
          'from machine import Pin, UART',
          '',
          'led = Pin(15, Pin.OUT)',
          'link = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))',
          '',
          'while True:',
          '    if link.any():',
          '        text = link.readline()',
          '        if text == b"on\\n":',
          '            led.on()',
          '        elif text == b"off\\n":',
          '            led.off()'
        ],
        explain: [
          E([4], 'זה הלד, כמו בשיעור A1.', 'The LED, as in lesson A1.'),
          E([5], 'זו בדיוק אותה שורה כמו בלוח A. ההצלבה נעשית בחוטים, לא בקוד.', 'Exactly the same line as on board A. The crossing is done in the wires, not in the code.'),
          E([8, 9], 'אם הגיע משהו, קוראים שורה שלמה.', 'If something arrived, reads a whole line.'),
          E([10, 13], 'כאן משווים את מה שהגיע להודעות שאנחנו מכירים, ומדליקים או מכבים את הלד. `b"..."` הוא טקסט בצורת [[byte|בתים]], וכך הוא מגיע דרך החוט.', 'Compares what arrived with the messages we know, and switches on or off. `b"..."` is text in the form of [[byte|bytes]], which is how it arrives over the wire.')
        ]
      },
      expect: B('כשלוחצים על הכפתור שבלוח A, הלד שבלוח B נדלק. כשמשחררים, הוא נכבה.', 'Press the button on board A, and the LED on board B lights. Release, and it goes off.'),
      tasks: [
        { t: B('הלד לא מגיב. מה בודקים קודם?', 'The LED does not react. What do you check first?'), hint: B('שלושה דברים, לפי הסדר: את חוט האדמה בין הלוחות, שהחוטים מוצלבים (GP8 ל-GP9), ושלוח B באמת מריץ את התוכנית שלו.', 'Three things, in order: the ground wire between the boards, that the wires are crossed (GP8 to GP9), and that board B is really running its program.') },
        { t: B('שנו את התוכניות כך שכל לחיצה תהפוך את מצב הלד: לחיצה אחת מדליקה אותו, והלחיצה הבאה מכבה.', 'Change the programs so each press flips the LED: one press switches on, the next switches off.'), hint: B('בלוח A שלחו הודעה אחת בלבד, `"toggle\\n"`, כשהכפתור נלחץ. בלוח B השתמשו ב-`led.toggle()`.', 'On board A send just one message, `"toggle\\n"`, when the button is pressed. On board B use `led.toggle()`.') },
        { t: B('הוסיפו תשובה: לוח B שולח בחזרה `"ok\\n"`, ולוח A מדפיס אותה.', 'Add a reply: board B sends back `"ok\\n"`, and board A prints it.'), hint: B('החוט השני, מ-B ל-A, כבר מחובר. בלוח B הוסיפו `link.write("ok\\n")`, ובלוח A בדקו את `link.any()`.', 'The second wire, from B to A, is already connected. On board B add `link.write("ok\\n")`, and on board A check `link.any()`.') },
        { t: B('רוצים לעשות את אותו הדבר בלי חוטים? פתחו את התוכנית במתכנן, והחליפו את החיבור לחיבור אלחוטי.', 'Want the same with no wires? Open the plan in the planner and switch the link to wireless.'), plan: 'A=button;B=led;A-B=radio' }
      ],
      quiz: [
        Q(B('למה מחברים את ה-TX של לוח A ל-RX של לוח B, ולא TX ל-TX?', 'Why connect board A\'s TX to board B\'s RX, and not TX to TX?'),
          [B('כי TX משדר ו-RX קולט: מה שלוח אחד אומר, הלוח השני צריך לשמוע', 'Because TX transmits and RX receives: what one says, the other must hear'), B('כי זה חוסך חוט', 'Because it saves a wire'), B('אין הבדל', 'It makes no difference')], 0,
          B('אם מחברים TX ל-TX, שני הלוחות מדברים על אותו חוט, ואף אחד לא מקשיב.', 'With TX joined to TX, both boards talk on the same wire and nobody listens.')),
        Q(B('שכחתם לחבר את חוט האדמה בין הלוחות. מה יקרה?', 'You forgot the ground wire between the boards. What happens?'),
          [B('הכול יעבוד, רק לאט יותר', 'Everything works, just more slowly'), B('ההודעות לא יגיעו, או שיגיעו משובשות', 'The messages will not arrive, or will arrive garbled'), B('הלוחות יישרפו', 'The boards will burn out')], 1,
          B('[[voltage|מתח]] נמדד תמיד ביחס לאדמה. בלי אדמה משותפת, לוח B לא יכול לדעת מה לוח A שולח.', '[[voltage|Voltage]] is always measured relative to ground. Without a shared ground, board B cannot tell what board A is sending.'))
      ]
    }
  );
})(window.PICO);
