/* Lesson tracks, part 7: four more lessons of track H (H9 to H12).
   Each one uses the parts of data-components-5.js in a way lessons H1 to H7
   do not: a fan that follows humidity (AHT20 + MOSFET), buttons on the
   expander with its interrupt pin (PCF8574), two knobs steering two servos
   (ADS1115 + PCA9685) and an energy counter (INA219 + OLED).
   Same structure as data-lessons-4.js. Loaded after data-lessons-6.js, so
   the lessons come after H8. Their breadboard pictures are in
   data-layouts-2.js, after the picture of H7. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, UNPLUG = x.UNPLUG, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ;

  var CLEAR = B('פנו מהמטריצה את כל מה שנשאר מהשיעור הקודם.', 'Clear the breadboard of the previous lesson.');
  var RAILS = B('ההזנה והאדמה עוברות דרך הפסים שלאורך המטריצה, כמו בציור. לחצו על "בנו צעד אחר צעד" שמעל הציור כדי לראות את החוטים אחד אחרי השני.', 'Power and ground run through the rails along the breadboard, as in the picture. Click "Build it step by step" above the picture to see each wire in turn.');
  var BASICS = function (id, he, en, whyHe, whyEn) { return { href: '#/basics/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var PART = function (id, he, en, whyHe, whyEn) { return { href: '#/components/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var LESSON = function (id) { return { href: '#/lessons/' + id, label: B('שיעור ' + id, 'Lesson ' + id) }; };

  P.lessons.push(
    /* ============================================================ H9 */
    {
      id: 'H9', track: 'H',
      title: B('מאוורר שמגיב ללחות', 'A fan that follows the humidity'),
      goal: B('חיישן מודד את הלחות באוויר, ומאוורר קטן מסתובב מהר יותר ככל שהלחות עולה. כשהאוויר יבש המאוורר נח.', 'A sensor measures the humidity of the air, and a small fan turns faster as the humidity rises. When the air is dry the fan rests.'),
      learn: [
        B('איך משלבים חיישן [[i2c|I2C]] עם עומס שמקבל מתח מספק נפרד.', 'To combine an [[i2c|I2C]] sensor with a load fed from a separate supply.'),
        B('מהי בקרה יחסית: התגובה גדלה בהדרגה יחד עם המדידה, ולא רק נדלקת ונכבית.', 'What proportional control is: the response grows gradually with the measurement, instead of only switching on and off.'),
        B('איך ממירים טווח אחד של מספרים לטווח אחר.', 'To convert one range of numbers into another.'),
        B('למה מנוע צריך עוצמה מינימלית כדי להתחיל להסתובב.', 'To understand why a motor needs a minimum power to start turning.')
      ],
      before: [
        PART('aht20', 'העמוד של חיישן ה-AHT20', 'The AHT20 sensor\'s page', 'שם מוסברת פונקציית המדידה, שורה אחר שורה.', 'The measuring function is explained there line by line.'),
        PART('mosfet', 'העמוד של מודול ה-MOSFET', 'The MOSFET module\'s page'),
        LESSON('H1'), LESSON('H7')
      ],
      parts: [{ id: 'aht20', qty: 1 }, { id: 'mosfet', qty: 1 }, { text: B('מאוורר קטן של 5V, או מנוע צעצוע עם מדחף', 'A small 5 V fan, or a toy motor with a propeller') }, { text: B('בית לשלוש סוללות AA', 'A holder for three AA batteries') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('חיישן, VIN', 'Sensor, VIN'), '3V3', 36, null, '3.3V'),
        W(B('חיישן, GND ו-MOSFET, GND', 'Sensor GND and MOSFET GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('חיישן, SCL', 'Sensor, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('חיישן, SDA', 'Sensor, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('MOSFET, SIG', 'MOSFET, SIG'), 'GP21', 27, null, 'SIG')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הוציאו סוללה אחת מבית הסוללות, כדי שלא יהיה בו מתח בזמן הבנייה.', 'Take one battery out of the holder, so it carries no voltage while you build.'),
        B('הכניסו את החיישן למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה.', 'Push the sensor into the breadboard and connect its four pins following the table.'),
        B('מודול ה-MOSFET נשאר מחוץ למטריצה, כמו בציור. חברו את הפינים `SIG` ו-`GND` שלו לפי הטבלה, בחוטים עם קצה נקבה.', 'The MOSFET module stays off the breadboard, as in the picture. Connect its `SIG` and `GND` pins with female-ended wires, following the table.'),
        RAILS,
        B('הבריגו את חוט הפלוס של בית הסוללות למהדק `VIN` של המודול, ואת חוט המינוס למהדק `GND`.', 'Screw the battery holder\'s plus wire into the module\'s `VIN` terminal, and its minus wire into the `GND` terminal.'),
        B('הבריגו את החוט האדום של המאוורר למהדק `V+`, ואת החוט השחור למהדק `V−`.', 'Screw the fan\'s red wire into the `V+` terminal, and its black wire into the `V−` terminal.'),
        B('הרחיקו את המאוורר מהחיישן, כדי שהוא לא ינשוף עליו ישירות.', 'Keep the fan away from the sensor, so that it does not blow straight at it.'),
        PLUG, RUN,
        B('החזירו את הסוללה למקומה. קראו את הלחות שמודפסת, ואחר כך נשפו לאט על החיישן כמה פעמים.', 'Put the battery back. Read the humidity that is printed, and then breathe slowly on the sensor a few times.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C, PWM',
        'from time import sleep, sleep_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'SENSOR = 0x38',
        'fan = PWM(Pin(21), freq=1000)',
        '',
        'LOW = 55                 # percent humidity: below this the fan rests',
        'HIGH = 80                # percent humidity: from here the fan runs at full speed',
        '',
        'sleep_ms(40)',
        'i2c.writeto(SENSOR, b"\\xBE\\x08\\x00")',
        'sleep_ms(10)',
        '',
        'def measure():',
        '    i2c.writeto(SENSOR, b"\\xAC\\x33\\x00")',
        '    sleep_ms(80)',
        '    d = i2c.readfrom(SENSOR, 6)',
        '    raw_h = (d[1] << 12) | (d[2] << 4) | (d[3] >> 4)',
        '    raw_t = ((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]',
        '    return raw_t * 200 / 1048576 - 50, raw_h * 100 / 1048576',
        '',
        'def speed_for(humidity):',
        '    if humidity <= LOW:',
        '        return 0',
        '    if humidity >= HIGH:',
        '        return 100',
        '    return 30 + (humidity - LOW) * 70 / (HIGH - LOW)',
        '',
        'while True:',
        '    temp, humidity = measure()',
        '    percent = speed_for(humidity)',
        '    fan.duty_u16(int(percent * 65535 / 100))',
        '    print("%.1f C   %.0f %%   fan %.0f %%" % (temp, humidity, percent))',
        '    sleep(2)'
      ],
      explain: [
        E([4, 6], 'השורות יוצרות את ה[[bus|אפיק]] של החיישן, ופין [[pwm|PWM]] שמפעיל את ה-MOSFET.', 'These lines create the sensor\'s [[bus|bus]], and a [[pwm|PWM]] pin that drives the MOSFET.'),
        E([8, 9], 'שני הגבולות של הטווח, באחוזי לחות. מתחת ל-`LOW` המאוורר כבוי, ומעל `HIGH` הוא פועל בעוצמה מלאה.', 'The two ends of the range, in percent humidity. Below `LOW` the fan is off, and above `HIGH` it runs at full power.'),
        E([11, 21], 'ההכנה של החיישן ופונקציית המדידה, בדיוק כמו בעמוד של הרכיב. הפונקציה מחזירה טמפרטורה ולחות.', 'The sensor\'s set-up and the measuring function, exactly as on the part\'s page. The function returns temperature and humidity.'),
        E([23, 27], 'הפונקציה מחליטה על המהירות באחוזים. קודם היא מטפלת בשני הקצוות: אוויר יבש ואוויר לח מאוד.', 'The function decides the speed in percent. It first deals with the two ends: dry air and very humid air.'),
        E([28], 'זו ההמרה בין הטווחים. `(humidity - LOW) / (HIGH - LOW)` הוא מספר בין 0 ל-1, שאומר כמה התקדמנו בתוך הטווח. מכפילים אותו ב-70 ומוסיפים 30, ולכן המהירות נעה בין 30 ל-100 אחוז.', 'This is the conversion between the ranges. `(humidity - LOW) / (HIGH - LOW)` is a number from 0 to 1 that says how far along the range we are. It is multiplied by 70 and 30 is added, so the speed runs from 30 to 100 percent.'),
        E([31, 32], 'השורות מודדות, ושואלות את הפונקציה איזו מהירות מתאימה ללחות הזו.', 'These lines measure, and ask the function which speed suits this humidity.'),
        E([33], 'השורה הופכת אחוזים למספר בין 0 ל-65535, שהוא ה[[duty|מחזור הפעולה]] של ה-PWM.', 'This line turns percent into a number from 0 to 65535, which is the PWM [[duty|duty cycle]].'),
        E([35], 'החיישן צריך שתי שניות בין מדידה למדידה, ולכן זה גם הקצב של הלולאה.', 'The sensor needs two seconds between measurements, so that is also the pace of the loop.')
      ],
      expect: B('כל שתי שניות מודפסות הטמפרטורה, הלחות ומהירות המאוורר. בחדר רגיל המאוורר כבוי. כשנושפים על החיישן הלחות עולה, והמאוורר מתחיל להסתובב ומאיץ. כשמפסיקים לנשוף הוא מאט בהדרגה ונעצר.', 'Every two seconds the temperature, the humidity and the fan speed are printed. In an ordinary room the fan is off. Breathe on the sensor and the humidity rises, and the fan starts turning and speeds up. Stop breathing on it and the fan slows gradually and stops.'),
      tasks: [
        { t: B('שנו את שורה 28 כך שהמהירות תתחיל מ-0 ולא מ-30. מה קורה כשהלחות רק מעט מעל `LOW`?', 'Change line 28 so that the speed starts from 0 and not from 30. What happens when the humidity is only a little above `LOW`?'), hint: B('המאוורר מזמזם ולא זז. מנוע צריך עוצמה מינימלית כדי להתגבר על החיכוך ולהתחיל להסתובב. לכן המהירות הנמוכה ביותר כאן היא 30 אחוז ולא אחוז אחד.', 'The fan hums and does not move. A motor needs a minimum power to overcome friction and start turning. That is why the lowest speed here is 30 percent and not one percent.') },
        { t: B('אם הלחות בחדר שלכם גבוהה מ-55 אחוז, המאוורר לא נעצר אף פעם. התאימו את הגבולות לחדר.', 'If the humidity in your room is above 55 percent, the fan never stops. Fit the limits to the room.'), hint: B('קראו את הלחות שמודפסת כשלא נושפים על החיישן. קבעו את `LOW` בחמישה אחוזים מעליה, ואת `HIGH` בעשרים אחוזים מעל `LOW`.', 'Read the humidity that is printed when nobody breathes on the sensor. Set `LOW` five percent above it, and `HIGH` twenty percent above `LOW`.') },
        { t: B('כשהלחות קרובה מאוד ל-`LOW`, המאוורר נדלק ונכבה שוב ושוב. הוסיפו [[hysteresis|היסטרזיס]]: המאוורר נדלק מעל `LOW`, ונכבה רק כשהלחות יורדת שלושה אחוזים מתחתיו.', 'When the humidity is very close to `LOW`, the fan switches on and off again and again. Add [[hysteresis|hysteresis]]: the fan comes on above `LOW`, and goes off only when the humidity drops three percent below it.'), hint: B('שמרו במשתנה `running` אם המאוורר פועל. כשהוא פועל, אל תעצרו אותו עד שהלחות יורדת מתחת ל-`LOW - 3`. זה אותו רעיון כמו בתרמוסטט של שיעור H7.', 'Keep in a `running` variable whether the fan is on. While it is on, do not stop it until the humidity drops below `LOW - 3`. This is the same idea as the thermostat of lesson H7.'),
          code: ['running = False', '', 'while True:', '    temp, humidity = measure()', '    if humidity > LOW:', '        running = True', '    elif humidity < LOW - 3:', '        running = False', '    percent = max(30, speed_for(humidity)) if running else 0', '    fan.duty_u16(int(percent * 65535 / 100))', '    sleep(2)'] }
      ],
      quiz: [
        Q(B('הלחות היא 67.5 אחוז, בדיוק באמצע בין `LOW` ל-`HIGH`. באיזו מהירות המאוורר מסתובב?', 'The humidity is 67.5 percent, exactly halfway between `LOW` and `HIGH`. How fast does the fan turn?'),
          [B('50 אחוז', '50 percent'), B('65 אחוז', '65 percent'), B('100 אחוז', '100 percent')], 1,
          B('באמצע הטווח החלק היחסי הוא חצי. חצי מ-70 הוא 35, ויחד עם 30 מתקבל 65.', 'Halfway along the range the proportional part is a half. Half of 70 is 35, and with the 30 that makes 65.'))
      ]
    },

    /* ============================================================ H10 */
    {
      id: 'H10', track: 'H',
      title: B('ארבעה כפתורים על שני חוטים', 'Four buttons on two wires'),
      goal: B('ארבעה כפתורים מחוברים למרחיב פינים. המרחיב מודיע ל-Pico בחוט אחד שמשהו השתנה, ורק אז ה-Pico שואל אותו איזה כפתור נלחץ.', 'Four buttons are connected to a pin expander. The expander tells the Pico over one wire that something has changed, and only then does the Pico ask which button was pressed.'),
      learn: [
        B('איך קוראים כניסות דרך מרחיב הפינים PCF8574.', 'To read inputs through the PCF8574 pin expander.'),
        B('איך משתמשים בפין ההתרעה `INT` של המרחיב יחד עם [[interrupt|פסיקה]] ב-Pico.', 'To use the expander\'s `INT` alert pin together with an [[interrupt|interrupt]] on the Pico.'),
        B('למה פונקציית הפסיקה רק מרימה דגל, ואת העבודה עושה הלולאה הראשית.', 'To understand why the interrupt function only raises a flag, and the main loop does the work.'),
        B('איך מגלים מה השתנה, בעזרת השוואה בין שני [[byte|בתים]].', 'To find out what changed, by comparing two [[byte|bytes]].')
      ],
      before: [
        BASICS('interrupts', 'יסודות: פסיקות וטיימרים', 'Basics: Interrupts and timers', 'בלי הפרק הזה לא תבינו את הקוד כאן.', 'Without this chapter the code here will not make sense.'),
        BASICS('bits', 'יסודות: ביטים ו-hex', 'Basics: Bits and hex'),
        PART('pcf8574', 'העמוד של מרחיב הפינים', 'The pin expander\'s page'),
        LESSON('H2')
      ],
      parts: [{ id: 'pcf8574', qty: 1 }, { id: 'button', qty: 4 }, { text: B('כ-15 חוטי גישור', 'About 15 jumper wires') }],
      wiring: [
        W(B('מרחיב, VCC', 'Expander, VCC'), '3V3', 36, null, '3.3V'),
        W(B('מרחיב, GND', 'Expander, GND'), 'GND', 38, null, 'GND'),
        W(B('מרחיב, SDA', 'Expander, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מרחיב, SCL', 'Expander, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('מרחיב, INT', 'Expander, INT'), 'GP15', 20, B('קו ההתרעה', 'the alert line'), 'INT')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את המרחיב למטריצה, וחברו את חמשת הפינים שלו לפי הטבלה. הפין `INT` נמצא בדרך כלל בקצה השורה, או בצד הלוח.', 'Push the expander into the breadboard and connect its five pins following the table. The `INT` pin is usually at the end of the row, or on the side of the board.'),
        RAILS,
        B('הכניסו ארבעה כפתורים בשורה, מעל התעלה שבאמצע המטריצה, כמו בציור.', 'Push in four buttons in a row, across the channel in the middle of the breadboard, as in the picture.'),
        B('חברו רגל אחת של כל כפתור למרחיב: את הכפתור הראשון ל-`P0`, את השני ל-`P1`, את השלישי ל-`P2` ואת הרביעי ל-`P3`.', 'Connect one leg of each button to the expander: the first button to `P0`, the second to `P1`, the third to `P2` and the fourth to `P3`.'),
        B('חברו את הרגל שמולה, בכל כפתור, לפס האדמה.', 'Connect the opposite leg of each button to the ground rail.'),
        B('שימו לב: אין כאן נגדים. בתוך המרחיב יש משיכה חלשה למעלה על כל פין, כמו ה-[[pullup|pull-up]] הפנימי של ה-Pico.', 'Note: there are no resistors here. Inside the expander there is a weak pull upwards on every pin, like the Pico\'s internal [[pullup|pull-up]].'),
        PLUG, RUN,
        B('לחצו על הכפתורים אחד אחרי השני, ואחר כך על שניים יחד.', 'Press the buttons one after another, and then two together.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x20',
        'alert = Pin(15, Pin.IN, Pin.PULL_UP)',
        'led = Pin("LED", Pin.OUT)',
        'NAMES = ["up", "down", "left", "right"]',
        '',
        'i2c.writeto(ADDR, b"\\xFF")',
        'changed = True',
        '',
        'def on_change(pin):',
        '    global changed',
        '    changed = True',
        '',
        'alert.irq(on_change, Pin.IRQ_FALLING)',
        '',
        'last = 0x0F',
        '',
        'while True:',
        '    if changed:',
        '        changed = False',
        '        now = i2c.readfrom(ADDR, 1)[0] & 0x0F',
        '        for n in range(4):',
        '            mask = 1 << n',
        '            if (last & mask) and not (now & mask):',
        '                print(NAMES[n], "pressed")',
        '                led.toggle()',
        '        last = now',
        '    sleep(0.01)'
      ],
      explain: [
        E([6], 'הפין שמקשיב לקו ההתרעה. המרחיב יכול רק למשוך את הקו לאדמה, ולכן צריך כאן pull-up שמחזיק אותו ב-1 בשאר הזמן.', 'The pin that listens to the alert line. The expander can only pull the line to ground, so a pull-up is needed here to hold it at 1 the rest of the time.'),
        E([8], 'שם לכל כפתור, לפי הסדר של הפינים `P0` עד `P3`.', 'A name for each button, in the order of pins `P0` to `P3`.'),
        E([10], 'כותבים 1 לכל שמונת הפינים. במרחיב הזה פין שנכתב אליו 1 משמש ככניסה: הוא נמשך למעלה בעדינות, וכפתור יכול למשוך אותו לאדמה.', 'Writes 1 to all eight pins. On this expander a pin written as 1 serves as an input: it is pulled up gently, and a button can pull it to ground.'),
        E([11], 'הדגל מתחיל ב-`True`, כדי שהלולאה תקרא את המרחיב פעם אחת מיד בהתחלה. הקריאה הזו מנקה התרעה ישנה, אם נשארה כזו.', 'The flag starts as `True`, so that the loop reads the expander once right at the start. That read clears an old alert, if one was left.'),
        E([13, 15], 'זו פונקציית הפסיקה. היא רק מרימה דגל. אסור לדבר ב-I2C מתוך פסיקה, כי היא עלולה לקטוע שיחה אחרת באמצע. `global` מאפשר לפונקציה לשנות משתנה שהוגדר מחוץ לה.', 'This is the interrupt function. It only raises a flag. Talking over I2C from inside an interrupt is not allowed, because it may cut another conversation in the middle. `global` lets the function change a variable defined outside it.'),
        E([17], 'השורה מבקשת לקרוא לפונקציה בכל פעם שקו ההתרעה יורד מ-1 ל-0.', 'This line asks for the function to be called every time the alert line falls from 1 to 0.'),
        E([19], 'המצב הקודם של ארבעת הכפתורים. `0x0F` הוא ארבעה ביטים של 1, כלומר אף כפתור לא לחוץ.', 'The previous state of the four buttons. `0x0F` is four bits of 1, meaning no button is pressed.'),
        E([22, 24], 'כשהדגל מורם, מורידים אותו וקוראים את המרחיב. הקריאה גם מחזירה את קו ההתרעה ל-1. `& 0x0F` משאיר רק את ארבעת הביטים של הכפתורים.', 'When the flag is up, it is lowered and the expander is read. The read also returns the alert line to 1. `& 0x0F` keeps only the four bits of the buttons.'),
        E([25, 29], 'הלולאה בודקת כל כפתור בנפרד. כפתור נלחץ עכשיו אם הביט שלו היה 1 בקריאה הקודמת והוא 0 בקריאה הזו.', 'The loop tests each button separately. A button has just been pressed if its bit was 1 on the previous read and is 0 on this one.'),
        E([30], 'המצב הנוכחי נשמר, והוא יהיה המצב הקודם בפעם הבאה.', 'The present state is kept, and it will be the previous state next time.')
      ],
      expect: B('בכל לחיצה מודפס שם הכפתור, והלד שעל ה-Pico מתחלף. כשמשחררים כפתור לא מודפס כלום. כשלא נוגעים בכפתורים, ה-Pico לא פונה למרחיב בכלל.', 'On each press the button\'s name is printed, and the LED on the Pico toggles. Releasing a button prints nothing. While nobody touches the buttons, the Pico does not talk to the expander at all.'),
      tasks: [
        { t: B('הדפיסו גם את רגע השחרור של כל כפתור.', 'Print the moment each button is released as well.'), hint: B('שחרור הוא המעבר ההפוך: הביט היה 0 בקריאה הקודמת, והוא 1 בקריאה הזו.', 'A release is the opposite change: the bit was 0 on the previous read, and is 1 on this one.'),
          code: ['            if not (last & mask) and (now & mask):', '                print(NAMES[n], "released")'] },
        { t: B('לפעמים לחיצה אחת מודפסת פעמיים. למה, ואיך מתקנים?', 'Sometimes one press is printed twice. Why, and how is it fixed?'), hint: B('זו [[bounce|ריטוט]]: המגעים של הכפתור קופצים לרגע, והמרחיב מתריע על כל קפיצה. הוסיפו `sleep(0.02)` מיד אחרי `changed = False`, כדי לקרוא את המרחיב רק אחרי שהכפתור נרגע.', 'This is [[bounce|bounce]]: the button\'s contacts jump for a moment, and the expander alerts on every jump. Add `sleep(0.02)` right after `changed = False`, so that the expander is read only after the button has settled.') },
        { t: B('צירוף מקשים: כשלוחצים על הכפתור הראשון והרביעי יחד, מודפס "secret".', 'A key combination: when the first and the fourth buttons are pressed together, "secret" is printed.'), hint: B('שני הכפתורים לחוצים כשביט 0 וביט 3 הם 0, כלומר `now & 0b1001` שווה ל-0. בדקו גם שבקריאה הקודמת זה עוד לא היה כך, כדי שההודעה תודפס פעם אחת.', 'Both buttons are pressed when bit 0 and bit 3 are 0, that is `now & 0b1001` equals 0. Also check that this was not yet so on the previous read, so that the message is printed once.'),
          code: ['        if now & 0b1001 == 0 and last & 0b1001 != 0:', '            print("secret")'] }
      ],
      quiz: [
        Q(B('למה פונקציית הפסיקה לא קוראת בעצמה את המרחיב?', 'Why does the interrupt function not read the expander itself?'),
          [B('כי פסיקה לא יכולה לקרוא משתנים', 'Because an interrupt cannot read variables'), B('כי פסיקה צריכה להיות קצרה, ושיחת I2C מתוכה עלולה לקטוע שיחה אחרת באמצע', 'Because an interrupt must be short, and an I2C conversation inside it may cut another one in the middle'), B('כי המרחיב עונה רק פעם בשנייה', 'Because the expander answers only once a second')], 1,
          B('פסיקה יכולה להגיע בכל רגע, גם באמצע שיחה אחרת על אותו אפיק. לכן היא רק מרימה דגל, והלולאה הראשית עושה את העבודה ברגע בטוח.', 'An interrupt can arrive at any moment, also in the middle of another conversation on the same bus. So it only raises a flag, and the main loop does the work at a safe moment.'))
      ]
    },

    /* ============================================================ H11 */
    {
      id: 'H11', track: 'H',
      title: B('שתי ידיות שמכוונות שני סרוואים', 'Two knobs that aim two servos'),
      goal: B('שני כפתורי סיבוב מכוונים שני מנועי סרבו, אחד לכל ציר, כמו ראש של מצלמה שפונה ימינה ושמאלה, למעלה ולמטה. הקריאה מדויקת, ולכן הסרוואים עומדים במקום בלי לרעוד.', 'Two knobs aim two servos, one for each axis, like a camera head that turns left and right, up and down. The reading is precise, so the servos stand still without trembling.'),
      learn: [
        B('איך שני מודולים על אותו [[bus|אפיק]] I2C עובדים יחד: אחד מודד, והשני מזיז.', 'How two modules on the same I2C [[bus|bus]] work together: one measures and the other moves.'),
        B('איך ממירים מתח לזווית.', 'To convert a voltage into an angle.'),
        B('איך מונעים רעידות בעזרת החלקה ו[[deadzone|אזור מת]].', 'To prevent trembling with smoothing and a [[deadzone|dead zone]].'),
        B('איך שומרים מצב של כמה ערוצים ב[[list|רשימה]].', 'To keep the state of several channels in a [[list|list]].')
      ],
      before: [
        PART('ads1115', 'העמוד של ה-ADS1115', 'The ADS1115\'s page', 'שם מוסברת הפונקציה `read_volts`.', 'The `read_volts` function is explained there.'),
        PART('pca9685', 'העמוד של בקר הסרוואים', 'The servo controller\'s page', 'שם מוסברת הפונקציה `angle`.', 'The `angle` function is explained there.'),
        LESSON('H3'), LESSON('H6')
      ],
      parts: [{ id: 'ads1115', qty: 1 }, { id: 'pca9685', qty: 1 }, { id: 'pot', qty: 2 }, { id: 'servo', qty: 2 }, { text: B('בית לארבע סוללות AA, או ספק 5V', 'A holder for four AA batteries, or a 5 V supply') }, { text: B('כ-15 חוטי גישור, ארבעה מהם עם קצה נקבה', 'About 15 jumper wires, four of them with a female end') }],
      wiring: [
        W(B('ממיר, VDD ובקר, VCC', 'Converter VDD and controller VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('ממיר, GND ובקר, GND', 'Converter GND and controller GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('ממיר, SDA ובקר, SDA', 'Converter SDA and controller SDA'), 'GP4', 6, B('שני המודולים מחוברים לאותו קו', 'both modules on the same line'), 'SDA'),
        W(B('ממיר, SCL ובקר, SCL', 'Converter SCL and controller SCL'), 'GP5', 7, B('שני המודולים מחוברים לאותו קו', 'both modules on the same line'), 'SCL')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הוציאו סוללה אחת מבית הסוללות.', 'Take one battery out of the holder.'),
        B('הכניסו את הממיר למטריצה. הבקר נשאר מחוץ למטריצה, כמו בציור. חברו את שניהם לפי הטבלה: שני קווי ה-I2C מגיעים לשני המודולים.', 'Push the converter into the breadboard. The controller stays off the breadboard, as in the picture. Connect both following the table: the two I2C lines reach both modules.'),
        RAILS,
        B('הכניסו שני פוטנציומטרים למטריצה. בכל אחד מהם חברו רגל קיצונית אחת לפס ה-3.3V, ואת הרגל הקיצונית השנייה לפס האדמה.', 'Push two potentiometers into the breadboard. On each of them connect one outer leg to the 3.3 V rail, and the other outer leg to the ground rail.'),
        B('חברו את הרגל האמצעית של הפוטנציומטר הראשון לכניסה `A0` של הממיר, ואת הרגל האמצעית של השני לכניסה `A1`.', 'Connect the middle leg of the first potentiometer to the converter\'s `A0` input, and the middle leg of the second to the `A1` input.'),
        B('הבריגו את בית הסוללות למהדק הבורג הכחול של הבקר: את הפלוס ל-`V+` ואת המינוס ל-`GND`.', 'Screw the battery holder into the controller\'s blue screw terminal: plus to `V+` and minus to `GND`.'),
        B('חברו שני סרוואים לשלשות הפינים שמסומנות 0 ו-1, כשהחוט החום או השחור בצד של `GND`.', 'Push two servos onto the sets of three pins marked 0 and 1, with the brown or black wire on the `GND` side.'),
        B('אם יש לכם מעמד לשני סרוואים, הרכיבו אותם זה על זה. אם אין, הדביקו פס נייר על כל סרבו.', 'If you have a bracket for two servos, mount one on the other. If not, stick a strip of paper on each servo.'),
        B('סובבו את שני הפוטנציומטרים לאמצע.', 'Turn both potentiometers to the middle.'),
        PLUG, RUN,
        B('החזירו את הסוללה למקומה. סובבו כל ידית לאט, ואחר כך עזבו אותה והסתכלו על הסרבו.', 'Put the battery back. Turn each knob slowly, and then let go of it and watch the servo.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'KNOBS = 0x48',
        'SERVOS = 0x40',
        '',
        'def read_volts(channel):',
        '    config = 0xC383 | (channel << 12)',
        '    i2c.writeto_mem(KNOBS, 1, bytes([config >> 8, config & 0xFF]))',
        '    sleep_ms(10)',
        '    data = i2c.readfrom_mem(KNOBS, 0, 2)',
        '    raw = (data[0] << 8) | data[1]',
        '    if raw > 32767:',
        '        raw = raw - 65536',
        '    return raw * 4.096 / 32768',
        '',
        'def write(reg, value):',
        '    i2c.writeto_mem(SERVOS, reg, bytes([value]))',
        '',
        'write(0x00, 0x10)',
        'write(0xFE, 121)',
        'write(0x00, 0x20)',
        'sleep_ms(5)',
        '',
        'def angle(channel, deg):',
        '    us = 500 + int(deg * 2000 / 180)',
        '    ticks = us * 4096 // 20000',
        '    i2c.writeto_mem(SERVOS, 0x06 + 4 * channel, bytes([0, 0, ticks & 0xFF, ticks >> 8]))',
        '',
        'place = [90.0, 90.0]',
        '',
        'while True:',
        '    for ch in range(2):',
        '        target = read_volts(ch) * 180 / 3.3',
        '        target = max(0, min(180, target))',
        '        if abs(target - place[ch]) > 0.3:',
        '            place[ch] = place[ch] + (target - place[ch]) / 4',
        '            angle(ch, place[ch])',
        '    sleep_ms(10)'
      ],
      explain: [
        E([5, 6], 'שתי [[address|כתובות]] על אותו אפיק: הממיר שקורא את הידיות, והבקר שמזיז את הסרוואים.', 'Two [[address|addresses]] on the same bus: the converter that reads the knobs, and the controller that moves the servos.'),
        E([8, 16], 'הפונקציה מהעמוד של הממיר: היא מודדת כניסה אחת ומחזירה וולטים.', 'The function from the converter\'s page: it measures one input and returns volts.'),
        E([18, 29], 'ההכנה של הבקר והפונקציה `angle`, כמו בשיעור H6. כאן הזווית יכולה להיות גם מספר עם שבר, ולכן יש `int` בחישוב.', 'The controller\'s set-up and the `angle` function, as in lesson H6. Here the angle can also be a number with a fraction, which is why there is an `int` in the sum.'),
        E([31], 'הרשימה שומרת איפה כל סרבו נמצא עכשיו. מתחילים מהאמצע.', 'The list keeps where each servo is now. It starts from the middle.'),
        E([34], 'הלולאה מטפלת בשני הערוצים באותו קוד: ערוץ 0 הוא הידית הראשונה והסרבו הראשון, וערוץ 1 הוא הזוג השני.', 'The loop handles both channels with the same code: channel 0 is the first knob and the first servo, and channel 1 is the second pair.'),
        E([35], 'ההמרה ממתח לזווית: 0 וולט הם 0 מעלות, ו-3.3 וולט הם 180 מעלות.', 'The conversion from voltage to angle: 0 volts is 0 degrees, and 3.3 volts is 180 degrees.'),
        E([36], 'השורה מגבילה את התוצאה לטווח שבין 0 ל-180, למקרה שהמתח בפס מעט גבוה מ-3.3 וולט.', 'This line limits the result to the range from 0 to 180, in case the rail voltage is slightly above 3.3 volts.'),
        E([37], 'זה האזור המת: אם היעד קרוב למקום הנוכחי ביותר משליש מעלה, לא עושים כלום. כך הסרבו לא מגיב לרעש זעיר.', 'This is the dead zone: if the target is within a third of a degree of the present place, nothing is done. So the servo does not react to tiny noise.'),
        E([38, 39], 'ההחלקה: בכל סיבוב הסרבו מתקרב ליעד ברבע מהמרחק שנשאר, כמו העמעם של שיעור H1.', 'The smoothing: on each turn the servo closes a quarter of the distance left to the target, like the dimmer of lesson H1.')
      ],
      expect: B('כל ידית מזיזה סרבו אחד, לאורך כל הטווח שלו. הסרבו עוקב אחרי הידית בתנועה רכה. כשעוזבים את הידית, הסרבו עומד בשקט ולא מזמזם.', 'Each knob moves one servo, along its whole range. The servo follows the knob in a soft motion. When the knob is let go, the servo stands quietly and does not buzz.'),
      tasks: [
        { t: B('מחקו את שורה 37, והזיחו את שתי השורות שאחריה שמאלה. האזינו לסרוואים כשלא נוגעים בידיות.', 'Delete line 37, and move the two lines after it to the left. Listen to the servos while nobody touches the knobs.'), hint: B('ייתכן שתשמעו זמזום חלש. בלי אזור מת, הסרבו מקבל פקודה חדשה בכל סיבוב של הלולאה, וגם שינוי זעיר במדידה מזיז אותו מעט.', 'You may hear a faint buzz. With no dead zone, the servo gets a new command on every turn of the loop, and even a tiny change in the measurement moves it a little.') },
        { t: B('הפכו את הכיוון של הסרבו השני: כשמסובבים את הידית ימינה, הוא פונה שמאלה.', 'Reverse the direction of the second servo: when the knob is turned right, it turns left.'), hint: B('היעד ההפוך הוא `180 - target`. עשו זאת רק כש-`ch` שווה ל-1.', 'The reversed target is `180 - target`. Do this only when `ch` equals 1.'),
          code: ['        if ch == 1:', '            target = 180 - target'] },
        { t: B('הגבילו את הסרבו הראשון לטווח שבין 30 ל-150 מעלות, כך שכל הסיבוב של הידית מתפרש על הטווח הזה.', 'Limit the first servo to the range from 30 to 150 degrees, so that the whole turn of the knob spreads over that range.'), hint: B('זו אותה המרת טווחים כמו בשיעור H9. במקום להכפיל ב-180, הכפילו ב-120 והוסיפו 30. שמרו את הגבולות ברשימה, זוג לכל ערוץ.', 'This is the same range conversion as in lesson H9. Instead of multiplying by 180, multiply by 120 and add 30. Keep the limits in a list, a pair for each channel.'),
          code: ['LIMITS = [(30, 150), (0, 180)]', '', '        low, high = LIMITS[ch]', '        target = low + read_volts(ch) * (high - low) / 3.3', '        target = max(low, min(high, target))'] }
      ],
      quiz: [
        Q(B('הממיר והבקר מחוברים לאותם שני קווים. למה הם לא מפריעים זה לזה?', 'The converter and the controller are on the same two lines. Why do they not disturb each other?'),
          [B('כי אחד מהם רק קורא והשני רק כותב', 'Because one of them only reads and the other only writes'), B('כי לכל אחד כתובת משלו, והוא מתעלם מהודעות שנשלחות לכתובת אחרת', 'Because each has its own address, and ignores messages sent to another address'), B('כי ה-Pico מחליף ביניהם כל שנייה', 'Because the Pico swaps between them every second')], 1,
          B('כל הודעה ב-I2C מתחילה בכתובת. הממיר עונה רק ל-`0x48`, והבקר רק ל-`0x40`.', 'Every I2C message begins with an address. The converter answers only to `0x48`, and the controller only to `0x40`.'))
      ]
    },

    /* ============================================================ H12 */
    {
      id: 'H12', track: 'H',
      title: B('מונה אנרגיה לסוללות', 'An energy counter for batteries'),
      goal: B('המסך מציג את המתח של הסוללות, את הזרם שהעומס צורך, את ההספק, וכמה מיליאמפר-שעה יצאו מהסוללות מאז תחילת המדידה. כך אפשר לדעת כמה זמן הסוללות יחזיקו.', 'The display shows the batteries\' voltage, the current the load draws, the power, and how many milliamp-hours have left the batteries since the measurement began. This tells how long the batteries will last.'),
      learn: [
        B('איך קוראים מה-INA219 גם [[voltage|מתח]] וגם [[current|זרם]].', 'To read both [[voltage|voltage]] and [[current|current]] from the INA219.'),
        B('מהו הספק, ואיך מחשבים אותו.', 'What power is, and how it is calculated.'),
        B('מהי מיליאמפר-שעה, היחידה שכתובה על סוללות.', 'What a milliamp-hour is, the unit written on batteries.'),
        B('איך סוכמים מדידה לאורך זמן, בעזרת שעון מדויק.', 'To add up a measurement over time, with an accurate clock.')
      ],
      before: [
        BASICS('electricity', 'יסודות: חשמל', 'Basics: Electricity'),
        PART('ina219', 'העמוד של מד הזרם INA219', 'The INA219 current meter\'s page', 'שם מוסבר איך מחברים אותו בטור.', 'It explains how it is connected in series.'),
        LESSON('H4'), LESSON('C3')
      ],
      parts: [{ id: 'ina219', qty: 1 }, { id: 'oled', qty: 1 }, { text: B('בית לשתיים או שלוש סוללות AA', 'A holder for two or three AA batteries') }, { text: B('עומס קטן: נורת פנס, מנוע צעצוע או פס קצר של לדים', 'A small load: a torch bulb, a toy motor or a short strip of LEDs') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('מד זרם, VCC ומסך, VCC', 'Current meter VCC and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('מד זרם, GND ומסך, GND', 'Current meter GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('מד זרם, SDA ומסך, SDA', 'Current meter SDA and display SDA'), 'GP4', 6, B('שני הרכיבים מחוברים לאותו קו', 'both parts on the same line'), 'SDA'),
        W(B('מד זרם, SCL ומסך, SCL', 'Current meter SCL and display SCL'), 'GP5', 7, B('שני הרכיבים מחוברים לאותו קו', 'both parts on the same line'), 'SCL')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הוציאו סוללה אחת מבית הסוללות.', 'Take one battery out of the holder.'),
        B('הכניסו את המסך למטריצה. מד הזרם נשאר מחוץ למטריצה, כמו בציור. חברו את שניהם לפי הטבלה.', 'Push the display into the breadboard. The current meter stays off the breadboard, as in the picture. Connect both following the table.'),
        RAILS,
        B('המעגל של העומס, לפי הסדר: הבריגו את הפלוס של הסוללות למהדק `Vin+` של מד הזרם, וחברו חוט ממהדק `Vin−` אל העומס.', 'The load\'s circuit, in order: screw the batteries\' plus into the current meter\'s `Vin+` terminal, and connect a wire from the `Vin−` terminal to the load.'),
        B('חברו את החוט השני של העומס למינוס של הסוללות.', 'Connect the load\'s other wire to the batteries\' minus.'),
        B('חברו חוט נוסף מהמינוס של הסוללות לפס האדמה שבתחתית המטריצה. בלי [[commonground|אדמה משותפת]] מד הזרם לא יכול למדוד את המתח של הסוללות.', 'Connect one more wire from the batteries\' minus to the ground rail at the bottom of the breadboard. Without a [[commonground|common ground]] the current meter cannot measure the batteries\' voltage.'),
        PLUG, RUN,
        B('החזירו את הסוללה למקומה. העומס נדלק, והמספרים על המסך מתחילים להשתנות.', 'Put the battery back. The load comes on, and the numbers on the display begin to change.'),
        B('הסתכלו על השורה התחתונה במשך דקה. אחר כך נתקו את העומס לכמה שניות וחברו אותו שוב.', 'Watch the bottom line for a minute. Then disconnect the load for a few seconds and connect it again.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep, ticks_ms, ticks_diff',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        'ADDR = 0x40',
        '',
        'def read_reg(reg):',
        '    data = i2c.readfrom_mem(ADDR, reg, 2)',
        '    return (data[0] << 8) | data[1]',
        '',
        'def read_ma():',
        '    raw = read_reg(1)',
        '    if raw > 32767:',
        '        raw = raw - 65536',
        '    return raw * 0.1',
        '',
        'def read_volts():',
        '    return (read_reg(2) >> 3) * 0.004',
        '',
        'used = 0.0',
        'last = ticks_ms()',
        '',
        'while True:',
        '    ma = read_ma()',
        '    volts = read_volts()',
        '    now = ticks_ms()',
        '    hours = ticks_diff(now, last) / 3600000',
        '    last = now',
        '    used = used + ma * hours',
        '    oled.fill(0)',
        '    oled.text("%.2f V" % volts, 0, 0)',
        '    oled.text("%.0f mA" % ma, 0, 16)',
        '    oled.text("%.0f mW" % (volts * ma), 0, 32)',
        '    oled.text("%.3f mAh" % used, 0, 48)',
        '    oled.show()',
        '    sleep(0.5)'
      ],
      explain: [
        E([9, 11], 'פונקציה שקוראת [[register|אוגר]] אחד של מד הזרם: שני בתים שמתחברים למספר אחד.', 'A function that reads one [[register|register]] of the current meter: two bytes joined into one number.'),
        E([13, 17], 'אוגר 1 הוא המתח על [[shunt|נגד המדידה]]. הפונקציה הופכת אותו ל[[ma|מיליאמפר]], כמו בשיעור H4.', 'Register 1 is the voltage across the [[shunt|shunt resistor]]. The function turns it into [[ma|milliamps]], as in lesson H4.'),
        E([19, 20], 'אוגר 2 הוא המתח של הסוללות. שלושת הביטים הנמוכים שלו הם דגלים ולא חלק מהמספר, ולכן `>> 3` זורק אותם. כל יחידה שווה 4 אלפיות וולט.', 'Register 2 is the batteries\' voltage. Its three low bits are flags and not part of the number, so `>> 3` throws them away. Each unit is worth 4 thousandths of a volt.'),
        E([22, 23], 'המונה מתחיל מאפס, ונשמר הרגע שבו התחילה המדידה.', 'The counter starts from zero, and the moment the measurement began is kept.'),
        E([28, 30], 'השורות מחשבות כמה זמן עבר מאז הסיבוב הקודם של הלולאה, בשעות. בשעה יש 3,600,000 אלפיות שנייה. מודדים את הזמן ולא סומכים על ה-`sleep`, כי גם הציור על המסך לוקח זמן.', 'These lines work out how much time has passed since the previous turn of the loop, in hours. An hour has 3,600,000 milliseconds. The time is measured and the `sleep` is not relied on, because drawing on the display takes time as well.'),
        E([31], 'זרם כפול זמן הוא מיליאמפר-שעה. בכל סיבוב מוסיפים למונה את החלק הקטן שנצרך מאז הסיבוב הקודם.', 'Current times time is milliamp-hours. On each turn the small part used since the previous turn is added to the counter.'),
        E([35], 'הספק הוא מתח כפול זרם. וולט כפול מיליאמפר נותן מילי-ואט.', 'Power is voltage times current. Volts times milliamps gives milliwatts.'),
        E([36], 'שלוש ספרות אחרי הנקודה, כדי שיהיה אפשר לראות את המונה עולה כבר בשניות הראשונות.', 'Three digits after the point, so that the counter can be seen rising already in the first seconds.')
      ],
      expect: B('המסך מציג ארבע שורות: מתח, זרם, הספק ומונה. המונה עולה לאט ובקצב קבוע כל עוד העומס מחובר. כשמנתקים את העומס הזרם יורד לאפס, והמונה נעצר. כשמחברים אותו שוב, המונה ממשיך מאותו מקום.', 'The display shows four lines: voltage, current, power and the counter. The counter rises slowly and steadily as long as the load is connected. Disconnect the load and the current drops to zero, and the counter stops. Connect it again and the counter carries on from the same place.'),
      tasks: [
        { t: B('על סוללת AA כתוב בערך 2000 מיליאמפר-שעה. לפי הזרם שמדדתם, כמה שעות העומס שלכם יפעל?', 'An AA battery is marked with about 2000 milliamp-hours. By the current you measured, how many hours will your load run?'), hint: B('חלקו 2000 בזרם במיליאמפר. עומס שצורך 200 מיליאמפר יפעל כעשר שעות. סוללות בטור לא מגדילות את המספר הזה, אלא רק את המתח.', 'Divide 2000 by the current in milliamps. A load that draws 200 milliamps will run for about ten hours. Batteries in series do not raise this number, only the voltage.') },
        { t: B('הציגו במקום ההספק את הזמן שנשאר, בשעות, לפי קיבולת של 2000 מיליאמפר-שעה.', 'Show the time left, in hours, in place of the power, for a capacity of 2000 milliamp-hours.'), hint: B('מה שנשאר בסוללה הוא הקיבולת פחות `used`. חלקו אותו בזרם הנוכחי. היזהרו מחלוקה באפס כשהעומס מנותק.', 'What is left in the battery is the capacity minus `used`. Divide it by the present current. Beware of dividing by zero when the load is disconnected.'),
          code: ['CAPACITY = 2000', '', '    if ma > 1:', '        oled.text("%.1f h left" % ((CAPACITY - used) / ma), 0, 32)', '    else:', '        oled.text("no load", 0, 32)'] },
        { t: B('הסתכלו על המתח ברגע שמחברים את העומס. הוא יורד מעט. למה?', 'Watch the voltage at the moment the load is connected. It drops a little. Why?'), hint: B('לכל סוללה יש [[resistance|התנגדות]] פנימית קטנה. ככל שהזרם גדול יותר, חלק גדול יותר מהמתח נופל בתוך הסוללה עצמה. בסוללה חלשה הירידה גדולה יותר, ולכן מודדים סוללה כשיש עליה עומס.', 'Every battery has a small internal [[resistance|resistance]]. The bigger the current, the bigger the part of the voltage that drops inside the battery itself. In a weak battery the drop is bigger, which is why a battery is measured under load.') }
      ],
      quiz: [
        Q(B('עומס צורך 100 מיליאמפר במשך חצי שעה. כמה מיליאמפר-שעה יצאו מהסוללה?', 'A load draws 100 milliamps for half an hour. How many milliamp-hours have left the battery?'),
          [B('200', '200'), B('100', '100'), B('50', '50')], 2,
          B('מיליאמפר-שעה הם זרם כפול זמן בשעות: 100 כפול חצי הם 50.', 'Milliamp-hours are current times time in hours: 100 times a half is 50.'))
      ]
    }
  );
})(window.PICO);
