/* Component catalog, part 3: movement and switching, input from the user,
   and the first of the extra sensors. Same structure as data-components.js.
   The names in each wiring row match the pin names of the part's placement
   template (js/autolayout.js), which is what draws its breadboard picture. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, seat = c.seat, wire = c.wire;

  /* for parts that do not plug into the breadboard */
  var loose = function (n) {
    return B('הרכיב הזה לא נכנס למטריצה. הלבישו על הפינים שלו ' + n + ' חוטי גישור עם קצה נקבה.',
      'This part does not plug into the breadboard. Slide ' + n + ' jumper wires with a female end onto its pins.');
  };
  var lead = function (from, name, num) {
    return B('חברו את החוט של `' + from + '` לפין ' + num + ' של ה-Pico, שהוא `' + name + '`.',
      'Connect the `' + from + '` wire to Pico pin ' + num + ', which is `' + name + '`.');
  };
  P._c.loose = loose; P._c.lead = lead;
  var GND = function (n) { return { n: n || 'GND', d: B('[[ground|אדמה]].', '[[ground|Ground]].') }; };
  var V33 = function (n) { return { n: n || 'VCC', d: B('הזנה של 3.3V. מתחבר ל-`3V3(OUT)`.', 'Power, 3.3 V. Connects to `3V3(OUT)`.') }; };
  var V5 = function (n) { return { n: n || 'VCC', d: B('הזנה של 5V. מתחבר ל-`VBUS`.', 'Power, 5 V. Connects to `VBUS`.') }; };
  P._c.GND = GND; P._c.V33 = V33; P._c.V5 = V5;

  P.components.push(
    /* ============================================================ relay */
    {
      id: 'relay', name: B('מודול ממסר', 'Relay module'), iface: ['gpio'], cat: 'output', volt: '5V',
      summary: B('מתג חשמלי שה-Pico מפעיל, עבור דברים שצורכים יותר זרם ממה שפין יכול לספק.', 'An electrical switch the Pico operates, for things that draw more than a pin can give.'),
      what: [
        B('[[relay|ממסר]] הוא מתג שלא לוחצים עליו ביד: אות חשמלי קטן הוא שסוגר אותו. כך פין של ה-Pico, שמסוגל להדליק רק לד, יכול להפעיל משאבה קטנה, מנורה של 12V או מנעול חשמלי.',
          'A [[relay|relay]] is a switch you do not press by hand: a small electrical signal closes it. This lets a Pico pin, which can only light an LED, operate a small pump, a 12 V lamp or an electric lock.'),
        B('חשוב: באתר הזה עובדים רק עם מתחים נמוכים, עד 12V. אל תחברו לממסר את החשמל מהשקע בקיר. זה מסוכן, ועבודה כזו דורשת חשמלאי.',
          'Important: on this site we work only with low voltages, up to 12 V. Do not connect mains electricity to the relay. It is dangerous and needs an electrician.')
      ],
      looks: B('לוח קטן ועליו קופסה כחולה מלבנית. בצד אחד יש שלושה פינים (VCC, GND, IN), ובצד השני שלושה מהדקי בורג. כשהממסר מחליף מצב שומעים "קליק", ונורית נדלקת.',
        'A small board carrying a rectangular blue box, three pins on one side (VCC, GND, IN) and three screw terminals on the other. When the relay switches you hear a "click" and a light comes on.'),
      pins: [V5(), GND(), { n: 'IN', d: B('האות שמפעיל את הממסר. הוא מתחבר לפין של ה-Pico.', 'The signal that operates the relay. Connects to a Pico pin.') }],
      how: [
        B('בתוך הקופסה הכחולה יש [[coil|סליל]]. כשעובר בו זרם, הוא הופך למגנט ומושך לשונית מתכת שסוגרת מעגל אחר, נפרד לגמרי. המעגל של ה-Pico והמעגל שהממסר מפעיל אף פעם לא נוגעים זה בזה.',
          'Inside the blue box is a [[coil|coil]]. When current passes through it, it becomes a magnet and pulls a metal tongue that closes a different, entirely separate circuit. The Pico\'s circuit and the circuit the relay switches never touch.'),
        B('במהדקי הבורג: COM הוא המהדק המשותף. NO מחובר אליו רק כשהממסר פועל, ו-NC מחובר אליו כשהממסר במנוחה.',
          'On the screw terminals: COM is the common one, NO is connected to it only while the relay is on, and NC is connected to it while the relay is at rest.')
      ],
      needs: [B('מודול ממסר של 5V, ערוץ אחד', 'A 5 V relay module, one channel'), B('שלושה חוטי גישור עם קצה נקבה', 'Three jumper wires with a female end'), B('מעגל שאותו מפעילים: בית סוללות ונורה קטנה או מנוע קטן', 'A circuit to switch: a battery holder and a small bulb or small motor'), B('מברג קטן', 'A small screwdriver')],
      wiring: [W('VCC', 'VBUS', 40, B('5V', '5 V')), W('GND', 'GND', 28), W('IN', 'GP21', 27)],
      steps: [UNPLUG, loose(3), lead('VCC', 'VBUS', 40), lead('GND', 'GND', 28), lead('IN', 'GP21', 27),
        B('המעגל הנפרד מתחבר למהדקי הבורג: הבריגו את הפלוס של הסוללות למהדק `COM`, והבריגו חוט מהמהדק `NO` אל הפלוס של העומס (הנורה או המנוע).', 'The separate circuit, on the screw terminals: screw the batteries\' plus into the `COM` terminal. Screw a wire from the `NO` terminal to the plus of the load (the bulb or the motor).'),
        B('חברו את המינוס של העומס ישירות למינוס של הסוללות. המעגל הזה לא נוגע ב-Pico באף נקודה. המהדק `NC` נשאר ריק.', 'Connect the load\'s minus straight to the batteries\' minus. This circuit does not touch the Pico at any point. The `NC` terminal stays empty.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'relay = Pin(21, Pin.OUT)', '', 'while True:', '    relay.on()', '    sleep(2)', '    relay.off()', '    sleep(2)'],
      explain: [
        E([4], 'שולטים בממסר בדיוק כמו בלד: דרך פין יציאה רגיל.', 'The relay is controlled just like an LED: an ordinary output pin.'),
        E([7, 8], 'השורות האלה מפעילות את הממסר למשך שתי שניות.', 'Switches the relay on for two seconds.'),
        E([9, 10], 'השורות האלה מכבות אותו למשך שתי שניות.', 'Switches it off for two seconds.')
      ],
      expect: B('כל שתי שניות נשמע "קליק", והנורית שעל המודול נדלקת או נכבית. העומס שבמעגל הנפרד נדלק ונכבה יחד איתה.', 'Every two seconds a "click" is heard, and the light on the module switches on or off. The load in the separate circuit switches on and off with it.'),
      mistakes: [
        B('הממסר פועל הפוך: יש מודולים שנדלקים כשהפין במצב 0. במקרה כזה החליפו בין `on()` ל-`off()`.', 'The relay works the other way round: some modules switch on when the pin is 0. Swap `on()` and `off()`.'),
        B('אין קליק: המודול צריך 5V מ-`VBUS`, ומ-`3V3` הוא לא יפעל.', 'No click: the module needs 5 V from `VBUS`. It will not work from `3V3`.'),
        B('הממסר מרצד ולא נסגר עד הסוף: יש מודולים שצריכים אות של 5V. נסו מודול שמסומן "3.3V compatible".', 'The relay flickers and does not close fully: some modules need a 5 V signal. Try a module marked "3.3V compatible".')
      ],
      ideas: [B('השקיה אוטומטית: משאבה קטנה שפועלת כשהאדמה יבשה.', 'Automatic watering: a small pump that runs when the soil is dry.'), B('מנעול חשמלי שנפתח בעזרת כרטיס RFID.', 'An electric lock that opens with an RFID card.'), B('מאוורר שנדלק כשחם.', 'A fan that comes on when it is hot.')]
    },

    /* ============================================================ DC motor */
    {
      id: 'motor', name: B('מנוע DC עם דרייבר DRV8833', 'DC motor with a DRV8833 driver'), iface: ['pwm'], cat: 'output', volt: '5V',
      summary: B('מנוע שמסתובב בחופשיות, עם שליטה במהירות ובכיוון.', 'A motor that spins freely, with control of speed and direction.'),
      what: [
        B('מנוע DC הוא המנוע הפשוט שנמצא בצעצועים ובמאווררים קטנים: כשנותנים לו מתח הוא מסתובב, וכשהופכים את המתח הוא מסתובב לכיוון השני.',
          'A DC motor is the simple motor found in toys and small fans: give it voltage and it spins. Reverse the voltage and it spins the other way.'),
        B('מנוע צורך הרבה יותר זרם ממה שפין יכול לספק, ולכן אף פעם לא מחברים אותו ישירות ל-Pico. בין השניים מחברים [[motordriver|דרייבר מנוע]]: ה-Pico נותן לו פקודות, והוא מעביר את הזרם למנוע.',
          'A motor draws far more current than a pin can supply, so it is never connected straight to the Pico. A [[motordriver|motor driver]] sits between the two: the Pico gives it commands, and it passes the current to the motor.')
      ],
      looks: B('הדרייבר DRV8833 הוא לוח קטן עם שבב אחד. בצד אחד שלו נמצאים פיני הפקודה (IN1, IN2), ובצד השני היציאות למנוע (OUT1, OUT2). למנוע עצמו יש שני חוטים.',
        'The DRV8833 driver is a small board with one chip. On one side are the command pins (IN1, IN2), and on the other the outputs to the motor (OUT1, OUT2). The motor itself has two wires.'),
      pins: [
        { n: 'IN1, IN2', d: B('פקודות מה-Pico. אחד מהם קובע תנועה קדימה, והשני תנועה אחורה.', 'Commands from the Pico. One sets forward motion and the other reverse.') },
        V5('VCC'), GND(),
        { n: 'OUT1, OUT2', d: B('שני החוטים של המנוע. הם לא מתחברים ל-Pico.', 'The motor\'s two wires. They do not connect to the Pico.') }
      ],
      how: [
        B('כאשר IN1 דולק ו-IN2 כבוי, המנוע מסתובב לכיוון אחד. כשהופכים ביניהם, הוא מסתובב לכיוון השני. כששניהם כבויים, הוא נעצר.',
          'With IN1 on and IN2 off the motor spins one way. Reverse them and it spins the other way. With both off it stops.'),
        B('כדי לשנות את המהירות משתמשים ב-[[pwm|PWM]]: במקום להשאיר את הפין דולק כל הזמן, מדליקים אותו רק בחלק מהזמן, וכך המנוע מקבל פחות כוח.',
          'To change speed you use [[pwm|PWM]]: instead of keeping the pin on all the time, it is on only part of the time, and the motor gets less power.')
      ],
      needs: [B('מודול DRV8833', 'A DRV8833 module'), B('מנוע DC קטן, 3V עד 6V', 'A small DC motor, 3 V to 6 V'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('IN1', 'GP20', 26), W('IN2', 'GP21', 27), W('VCC', 'VBUS', 40, B('5V למנוע', '5 V for the motor')), W('GND', 'GND', 28)],
      steps: [UNPLUG, seat(4), wire('IN1', 'GP20', 26), wire('IN2', 'GP21', 27), wire('VCC', 'VBUS', 40), wire('GND', 'GND', 28),
        B('חברו את שני החוטים של המנוע ליציאות `OUT1` ו-`OUT2` של הדרייבר. הסדר קובע רק את כיוון הסיבוב.', 'Connect the motor\'s two wires to the driver\'s `OUT1` and `OUT2` outputs. The order only sets the direction of spin.'), CHECK],
      code: [
        'from machine import Pin, PWM', 'from time import sleep', '',
        'in1 = PWM(Pin(20), freq=1000)', 'in2 = PWM(Pin(21), freq=1000)', '',
        'def motor(speed):', '    # speed from -100 (full reverse) to 100 (full forward), 0 stops',
        '    duty = int(abs(speed) * 65535 / 100)', '    in1.duty_u16(duty if speed > 0 else 0)', '    in2.duty_u16(duty if speed < 0 else 0)', '',
        'while True:', '    motor(60)', '    sleep(2)', '    motor(0)', '    sleep(1)', '    motor(-60)', '    sleep(2)', '    motor(0)', '    sleep(1)'
      ],
      explain: [
        E([4, 5], 'שני פיני הפקודה מוגדרים כפיני PWM, כדי שאפשר יהיה לשלוט במהירות.', 'Both command pins are PWM pins, so the speed can be controlled.'),
        E([7], 'כאן מוגדרת פונקציה שמקבלת מהירות: מספר חיובי הוא קדימה, מספר שלילי הוא אחורה, ואפס הוא עצירה.', 'A function that takes a speed: a positive number forward, negative for reverse, and zero to stop.'),
        E([9], 'השורה הזו הופכת את המהירות (0 עד 100) לערך של PWM (0 עד 65535). `abs` מוריד את סימן המינוס.', 'Turns the speed (0 to 100) into a PWM value (0 to 65535). `abs` drops the minus sign.'),
        E([10, 11], 'השורות האלה מפעילות רק אחד משני הפינים, לפי הכיוון.', 'Drives only one of the two pins, according to the direction.'),
        E([14, 21], 'המנוע נע קדימה שתי שניות, נעצר, נע אחורה שתי שניות, ונעצר שוב.', 'Forward for two seconds, stop, reverse for two seconds, stop.')
      ],
      expect: B('המנוע מסתובב לכיוון אחד במשך שתי שניות, נעצר לשנייה, מסתובב לכיוון השני, ונעצר.', 'The motor spins one way for two seconds, stops for a second, spins the other way, and stops.'),
      mistakes: [
        B('הלוח מתנתק כשהמנוע מתחיל לפעול: המנוע צורך יותר זרם ממה שה-USB מספק. הזינו את ה-VCC של הדרייבר מסוללות נפרדות, וחברו את האדמה שלהן לאדמה של ה-Pico.', 'The board disconnects when the motor starts: the motor draws more than USB gives. Power the driver\'s VCC from separate batteries, and connect their ground to the Pico\'s ground.'),
        B('המנוע מזמזם ולא מסתובב: המהירות נמוכה מדי. נסו 60 ומעלה.', 'The motor hums and does not turn: the speed is too low. Try 60 or more.'),
        B('המנוע מסתובב לכיוון ההפוך ממה שרציתם: החליפו בין שני החוטים שלו.', 'The motor spins the opposite way to what you wanted: swap its two wires.')
      ],
      ideas: [B('רכב קטן עם שני מנועים.', 'A small car with two motors.'), B('מאוורר שהמהירות שלו תלויה בטמפרטורה.', 'A fan whose speed depends on temperature.'), B('מסוע קטן שנעצר כשחיישן מזהה חפץ.', 'A small conveyor that stops when a sensor detects an object.')]
    },

    /* ============================================================ stepper */
    {
      id: 'stepper', name: B('מנוע צעד 28BYJ-48', '28BYJ-48 stepper motor'), iface: ['gpio'], cat: 'output', volt: '5V',
      summary: B('מנוע שמסתובב בצעדים קטנים ומדויקים, בדיוק כמה צעדים שתבקשו.', 'A motor that turns in small exact steps, as many as you tell it.'),
      what: [
        B('מנוע צעד לא מסתובב בחופשיות. הוא זז צעד קטן אחד בכל פעם, ולכן אפשר לסובב אותו בדיוק חצי סיבוב, רבע סיבוב או עשרה סיבובים. בניגוד לסרבו, אין לו מגבלה של 180 מעלות.',
          'A stepper motor does not spin freely. It moves one small step at a time, so you can turn it exactly half a turn, a quarter, or ten turns. Unlike a servo, it has no 180 degree limit.')
      ],
      looks: B('מנוע עגול כסוף עם ציר וכבל של חמישה חוטים, ולוח דרייבר ירוק בשם ULN2003 עם ארבע נוריות. הכבל של המנוע נכנס למחבר הלבן שעל הלוח, ואפשר לחבר אותו רק בכיוון אחד.',
        'A round silver motor with a shaft and a five-wire cable, and a green driver board named ULN2003 with four lights. The motor\'s cable goes into the white connector on the board, one way round only.'),
      pins: [{ n: 'IN1 ... IN4', d: B('ארבע פקודות מה-Pico, אחת לכל [[coil|סליל]] במנוע.', 'Four commands from the Pico, one for each [[coil|coil]] in the motor.') }, V5('+'), GND('−')],
      how: [
        B('בתוך המנוע יש ארבעה סלילים. כשמדליקים אותם בזה אחר זה בסדר הנכון, המגנט שבמרכז נמשך מסליל לסליל, והציר מסתובב צעד אחר צעד. הנוריות שעל לוח הדרייבר מראות איזה סליל דולק.',
          'Inside the motor are four coils. Switch them on one after another in the right order and the magnet in the middle is pulled from coil to coil, turning the shaft step by step. The lights on the driver board show which coil is on.'),
        B('בתוך המנוע יש גם גלגלי שיניים שמאטים אותו. לכן סיבוב שלם של הציר דורש יותר מ-4000 צעדים קטנים, והמנוע חזק אבל איטי.',
          'There are also gears inside the motor that slow it down. So one full turn of the shaft takes more than 4000 small steps, making it strong but slow.')
      ],
      needs: [B('מנוע 28BYJ-48 עם לוח ULN2003', 'A 28BYJ-48 motor with a ULN2003 board'), B('שישה חוטי גישור עם קצה נקבה', 'Six jumper wires with a female end')],
      wiring: [W('IN1', 'GP10', 14), W('IN2', 'GP11', 15), W('IN3', 'GP12', 16), W('IN4', 'GP13', 17), W('+', 'VBUS', 40, B('5V', '5 V')), W('−', 'GND', 18)],
      steps: [UNPLUG, B('חברו את הכבל של המנוע למחבר הלבן שעל לוח הדרייבר.', 'Plug the motor\'s cable into the white connector on the driver board.'), c.loose ? loose(6) : null,
        lead('IN1', 'GP10', 14), lead('IN2', 'GP11', 15), lead('IN3', 'GP12', 16), lead('IN4', 'GP13', 17), lead('+', 'VBUS', 40), lead('−', 'GND', 18), CHECK],
      code: [
        'from machine import Pin', 'from time import sleep, sleep_ms', '',
        'coils = [Pin(10, Pin.OUT), Pin(11, Pin.OUT), Pin(12, Pin.OUT), Pin(13, Pin.OUT)]', '',
        'SEQ = [(1, 0, 0, 0), (1, 1, 0, 0), (0, 1, 0, 0), (0, 1, 1, 0),', '       (0, 0, 1, 0), (0, 0, 1, 1), (0, 0, 0, 1), (1, 0, 0, 1)]', '',
        'def step(count):', '    for i in range(count):', '        for pattern in SEQ:', '            for pin, value in zip(coils, pattern):', '                pin.value(value)', '            sleep_ms(2)', '',
        'while True:', '    step(512)            # one full turn', '    sleep(1)'
      ],
      explain: [
        E([4], 'כאן נוצרת רשימה של ארבעת הפינים, פין אחד לכל סליל.', 'A list of the four pins, one per coil.'),
        E([6, 7], 'זה סדר ההדלקה: שמונה שלבים, ובכל שלב כתוב אילו סלילים דולקים.', 'The switching order: eight stages, each saying which coils are on.'),
        E([9, 14], 'כאן מוגדרת פונקציה שמבצעת את כל שמונת השלבים, כמה פעמים שמבקשים. `zip` מצמיד לכל פין את הערך שלו.', 'A function that runs all eight stages, as many times as asked. `zip` pairs each pin with its value.'),
        E([17], '512 חזרות שוות לסיבוב שלם אחד של הציר.', '512 repeats are one full turn of the shaft.')
      ],
      expect: B('הציר מסתובב לאט סיבוב שלם, נעצר לשנייה ומסתובב שוב. ארבע הנוריות שעל הדרייבר מהבהבות בזו אחר זו.', 'The shaft slowly makes one full turn, pauses for a second, and turns again. The four lights on the driver flicker one after another.'),
      mistakes: [
        B('המנוע רועד ולא מסתובב: סדר ארבעת החוטים שגוי. בדקו ש-IN1 עד IN4 מחוברים לפי הטבלה.', 'The motor shakes and does not turn: the order of the four wires is wrong. Check IN1 to IN4 are wired as in the table.'),
        B('המנוע מדלג על צעדים: הוא לא מספיק לזוז בזמן. הגדילו את ההמתנה מ-2 ל-3 אלפיות שנייה.', 'The motor skips: it cannot keep up. Increase the wait from 2 to 3 milliseconds.'),
        B('כדי לסובב לכיוון השני, עברו על `SEQ` מהסוף להתחלה: `reversed(SEQ)`.', 'To turn the other way, go through `SEQ` from end to start: `reversed(SEQ)`.')
      ],
      ideas: [B('וילון שנפתח ונסגר.', 'A curtain that opens and closes.'), B('שעון עם מחוג אמיתי.', 'A clock with a real hand.'), B('מאכיל דגים שמסתובב רבע סיבוב בכל יום.', 'A fish feeder that turns a quarter turn a day.')]
    },

    /* ============================================================ RGB LED */
    {
      id: 'rgb', name: B('לד RGB', 'RGB LED'), iface: ['pwm'], cat: 'output', volt: '3.3V',
      summary: B('לד אחד שיכול להאיר בכל צבע.', 'One LED that can shine in any colour.'),
      what: [
        B('לד RGB הוא שלושה לדים קטנים בתוך כיפה אחת: אדום (R), ירוק (G) וכחול (B). כשמערבבים את שלושתם בעוצמות שונות אפשר לקבל כל צבע, בדיוק כמו במסך של טלפון.',
          'An RGB LED is three small LEDs inside one dome: red (R), green (G) and blue (B). Mixing the three at different strengths gives any colour, exactly as on a phone screen.')
      ],
      looks: B('כאן משתמשים במודול: לוח קטן עם לד אחד וארבעה פינים שמסומנים R, G, B ומינוס. במודול כבר יש נגדים, ולכן אין צורך להוסיף נגדים.',
        'Here we use a module: a small board with one LED and four pins marked R, G, B and minus. The module already has resistors, so none need adding.'),
      pins: [{ n: 'R, G, B', d: B('פין לכל צבע. כל אחד מהם מתחבר לפין [[pwm|PWM]] של ה-Pico.', 'One pin per colour. Each connects to a Pico [[pwm|PWM]] pin.') }, GND('−')],
      how: [
        B('כל צבע מקבל עוצמה משלו בעזרת PWM. אדום מלא בלי ירוק ובלי כחול נותן אדום. אדום וירוק יחד נותנים צהוב, ושלושתם יחד נותנים לבן.',
          'Each colour gets its own strength through PWM. Full red with no green and no blue is red. Red and green together are yellow. All three together are white.')
      ],
      needs: [B('מודול לד RGB (עם נגדים)', 'An RGB LED module (with resistors)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('R', 'GP11', 15), W('G', 'GP12', 16), W('B', 'GP13', 17), W('−', 'GND', 18)],
      steps: [UNPLUG, seat(4), wire('R', 'GP11', 15), wire('G', 'GP12', 16), wire('B', 'GP13', 17), wire('−', 'GND', 18), CHECK],
      code: [
        'from machine import Pin, PWM', 'from time import sleep', '',
        'red = PWM(Pin(11), freq=1000)', 'green = PWM(Pin(12), freq=1000)', 'blue = PWM(Pin(13), freq=1000)', '',
        'def color(r, g, b):', '    red.duty_u16(r * 257)', '    green.duty_u16(g * 257)', '    blue.duty_u16(b * 257)', '',
        'while True:', '    color(255, 0, 0)', '    sleep(1)', '    color(0, 255, 0)', '    sleep(1)', '    color(0, 0, 255)', '    sleep(1)', '    color(255, 120, 0)', '    sleep(1)'
      ],
      explain: [
        E([4, 6], 'השורות האלה מגדירות שלושה פיני PWM, אחד לכל צבע.', 'Three PWM pins, one per colour.'),
        E([8, 11], 'כאן מוגדרת פונקציה שמקבלת שלושה מספרים בין 0 ל-255, אחד לכל צבע. הכפל ב-257 מביא אותם לטווח של PWM, מ-0 עד 65535.', 'A function taking three numbers from 0 to 255, one per colour. Multiplying by 257 reaches the PWM range, 0 to 65535.'),
        E([14, 21], 'הלד מאיר באדום, בירוק, בכחול ואחר כך בכתום, כל צבע למשך שנייה.', 'Red, green, blue, and then orange, each for a second.')
      ],
      expect: B('הלד מחליף צבע כל שנייה: אדום, ירוק, כחול, כתום.', 'The LED changes colour every second: red, green, blue, orange.'),
      mistakes: [
        B('הצבעים הפוכים, והלד דולק כשהוא אמור להיות כבוי: יש מודולים שבהם הפין המשותף הוא פלוס ולא מינוס. חברו אותו ל-`3V3`, והשתמשו ב-`255 - r` במקום ב-`r`.', 'The colours are inverted, and the LED is on when it should be off: some modules have a common plus rather than minus. Connect it to `3V3`, and use `255 - r` instead of `r`.'),
        B('צבע אחד לא נדלק: בדקו את החוט שלו.', 'One colour does not light: check its wire.')
      ],
      ideas: [B('נורית מצב: ירוקה כשהכול תקין, ואדומה כשיש בעיה.', 'A status light: green when all is well, red when there is a problem.'), B('מד טמפרטורה בצבעים: כחול לקור, אדום לחום.', 'A colour thermometer: blue for cold, red for hot.'), B('מעבר הדרגתי בין צבעים.', 'A gradual fade between colours.')]
    },

    /* ============================================================ joystick */
    {
      id: 'joystick', name: B('ג\'ויסטיק', 'Joystick'), iface: ['adc', 'gpio'], cat: 'input', volt: '3.3V',
      summary: B('מוט שאפשר להזיז לארבעה כיוונים, עם כפתור לחיצה.', 'A stick you move in four directions, with a push button.'),
      what: [
        B('ג\'ויסטיק כמו זה שבשלט של קונסולת משחקים. הוא נותן שני ערכים: כמה הוא מוטה ימינה או שמאלה, וכמה למעלה או למטה. יש בו גם כפתור שנלחץ כשלוחצים על המוט כלפי מטה.',
          'A joystick like the one on a games console controller. It gives two values, how far it is tilted left-right and how far up-down, plus a button that is pressed when you push the stick down.')
      ],
      looks: B('לוח קטן עם מוט שחור שזז, וחמישה פינים: GND, +5V, VRx, VRy, SW.', 'A small board with a black stick that moves, and five pins: GND, +5V, VRx, VRy, SW.'),
      pins: [
        GND(),
        { n: '+5V', d: B('הזנה. למרות הכיתוב, חברו אותו ל-`3V3(OUT)`. כך המתח שיוצא ממנו אף פעם לא עולה על 3.3V, וזה בטוח לפיני ה-[[adc|ADC]].', 'Power. Despite the label, connect it to `3V3(OUT)`. That way the voltage it outputs never exceeds 3.3 V, which is safe for the [[adc|ADC]] pins.') },
        { n: 'VRx, VRy', d: B('שני מתחים שמשתנים לפי ההטיה, אחד לכל ציר.', 'Two voltages that change with the tilt, one per axis.') },
        { n: 'SW', d: B('הכפתור. הוא מתחבר לאדמה כשלוחצים עליו.', 'The button. Connected to ground when pressed.') }
      ],
      how: [
        B('בתוך הג\'ויסטיק יש שני פוטנציומטרים, אחד לכל כיוון. כל אחד מהם מוציא מתח בין 0V ל-3.3V, וה-Pico קורא את שניהם בשני פיני ADC. במנוחה שני הערכים נמצאים באמצע הטווח, בערך 50%.',
          'Inside the joystick are two potentiometers, one per direction. Each outputs a voltage between 0 V and 3.3 V, and the Pico reads them on two ADC pins. At rest both values sit mid-range, about 50%.')
      ],
      needs: [B('מודול ג\'ויסטיק', 'A joystick module'), B('חמישה חוטי גישור עם קצה נקבה', 'Five jumper wires with a female end')],
      wiring: [W('GND', 'GND', 38), W('+5V', '3V3', 36, B('ל-3.3V, לא ל-5V', 'to 3.3 V, not 5 V')), W('VRx', 'GP26', 31), W('VRy', 'GP27', 32), W('SW', 'GP22', 29)],
      steps: [UNPLUG, loose(5), lead('GND', 'GND', 38), lead('+5V', '3V3(OUT)', 36), lead('VRx', 'GP26', 31), lead('VRy', 'GP27', 32), lead('SW', 'GP22', 29), CHECK],
      code: [
        'from machine import Pin, ADC', 'from time import sleep', '',
        'x_axis = ADC(26)', 'y_axis = ADC(27)', 'button = Pin(22, Pin.IN, Pin.PULL_UP)', '',
        'while True:', '    x = x_axis.read_u16() * 100 // 65535', '    y = y_axis.read_u16() * 100 // 65535', '    print("x:", x, "y:", y, "pressed:", button.value() == 0)', '    sleep(0.2)'
      ],
      explain: [
        E([4, 5], 'השורות האלה מגדירות שני פיני ADC, אחד לכל ציר.', 'Two ADC pins, one per axis.'),
        E([6], 'זה הכפתור, עם [[pullup|נגד משיכה]], כמו כל כפתור.', 'The button, with a [[pullup|pull-up]], like any button.'),
        E([9, 10], 'השורות האלה קוראות כל ציר והופכות את הקריאה לאחוזים.', 'Reads each axis and turns it into a percentage.'),
        E([11], 'השורה הזו מדפיסה את שני הצירים, ואם הכפתור לחוץ.', 'Prints both axes and whether the button is pressed.')
      ],
      expect: B('במנוחה מודפס בערך `x: 50 y: 50`. כשמזיזים את המוט, המספרים משתנים בין 0 ל-100, ולחיצה עליו מדפיסה `pressed: True`.', 'At rest about `x: 50 y: 50` is printed. Moving the stick changes the numbers between 0 and 100, and pressing it prints `pressed: True`.'),
      mistakes: [
        B('חיברתם את `+5V` ל-`VBUS`. במצב כזה המתח על VRx ועל VRy מגיע ל-5V, וזה מזיק לפיני ה-ADC.', '`+5V` was connected to `VBUS`. Then the voltage on VRx and VRy reaches 5 V, which harms the ADC pins.'),
        B('במנוחה המספרים הם 48 או 52 ולא בדיוק 50. זה תקין.', 'The numbers at rest are 48 or 52 rather than exactly 50. That is normal.')
      ],
      ideas: [B('שליטה בשני סרבואים, אחד לכל ציר.', 'Controlling two servos, one per axis.'), B('משחק על מטריצת לדים.', 'A game on an LED matrix.'), B('רכב שנוהגים בו בעזרת ג\'ויסטיק.', 'A car you drive with the joystick.')]
    },

    /* ============================================================ rotary encoder */
    {
      id: 'encoder', name: B('מקודד סיבובי', 'Rotary encoder'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('כפתור שמסתובב בלי סוף וסופר קליקים לכל כיוון.', 'A knob that turns endlessly and counts clicks in each direction.'),
      what: [
        B('מקודד סיבובי נראה כמו פוטנציומטר, אבל הוא מסתובב בלי סוף, בלי נקודת התחלה ובלי נקודת סוף. הוא לא מדווח "כמה סובבו אותו", אלא "זזתי קליק אחד ימינה" או "קליק אחד שמאלה". מקודד כזה נמצא בכפתור של רדיו ברכב.',
          'A rotary encoder looks like a potentiometer, but it turns endlessly with no start or end. It does not report "how far it was turned", but "I moved one click right" or "one click left". There is one in a car radio\'s knob.')
      ],
      looks: B('לוח קטן עם ציר מתכת שאפשר לסובב וללחוץ עליו, וחמישה פינים: CLK, DT, SW, + ו-GND.', 'A small board with a metal shaft that turns and presses, and five pins: CLK, DT, SW, + and GND.'),
      pins: [{ n: 'CLK, DT', d: B('שני אותות שמשתנים כשמסובבים. ההפרש ביניהם מגלה את כיוון הסיבוב.', 'Two signals that change as you turn. The difference between them reveals the direction.') }, { n: 'SW', d: B('הכפתור שבתוך הציר.', 'The button in the shaft.') }, V33('+'), GND()],
      how: [
        B('בכל קליק שני האותות, CLK ו-DT, יורדים ל-0 בזה אחר זה. אם CLK ירד ראשון, סובבו לכיוון אחד, ואם DT ירד ראשון, סובבו לכיוון השני. הקוד בודק את DT בדיוק ברגע ש-CLK יורד.',
          'On each click the two signals, CLK and DT, drop to 0 one after the other. If CLK dropped first, it was turned one way. If DT dropped first, the other way. The code checks DT at the exact moment CLK drops.'),
        B('כדי לא לפספס אף קליק, משתמשים ב[[interrupt|פסיקה]].', 'To avoid missing a click an [[interrupt|interrupt]] is used.')
      ],
      needs: [B('מודול מקודד סיבובי KY-040', 'A KY-040 rotary encoder module'), B('חמישה חוטי גישור', 'Five jumper wires')],
      wiring: [W('CLK', 'GP10', 14), W('DT', 'GP11', 15), W('SW', 'GP12', 16), W('+', '3V3', 36), W('GND', 'GND', 13)],
      steps: [UNPLUG, seat(5), wire('CLK', 'GP10', 14), wire('DT', 'GP11', 15), wire('SW', 'GP12', 16), wire('+', '3V3(OUT)', 36), wire('GND', 'GND', 13), CHECK],
      code: [
        'from machine import Pin', 'from time import sleep', '',
        'clk = Pin(10, Pin.IN, Pin.PULL_UP)', 'dt = Pin(11, Pin.IN, Pin.PULL_UP)', 'sw = Pin(12, Pin.IN, Pin.PULL_UP)', '',
        'position = 0', '',
        'def on_turn(pin):', '    global position', '    if dt.value():', '        position += 1', '    else:', '        position -= 1', '',
        'clk.irq(trigger=Pin.IRQ_FALLING, handler=on_turn)', '',
        'while True:', '    print("position:", position, "pressed:", sw.value() == 0)', '    sleep(0.2)'
      ],
      explain: [
        E([4, 6], 'השורות האלה מגדירות שלושה פיני כניסה עם נגדי משיכה.', 'Three input pins with pull-ups.'),
        E([8], 'זה המונה ששומר את המיקום.', 'The position counter.'),
        E([10, 15], 'זו הפונקציה שמופעלת בכל קליק. `global` אומר שהיא משנה את המונה שנמצא מחוץ לה. היא בודקת את DT, ומוסיפה אחד או מורידה אחד.', 'The function run on every click. `global` says it changes the counter outside itself. It checks DT and adds or subtracts one.'),
        E([17], 'השורה הזו מבקשת להפעיל את הפונקציה בכל פעם ש-CLK יורד מ-1 ל-0.', 'Asks for the function to run every time CLK drops from 1 to 0.'),
        E([20], 'הלולאה הראשית רק מדפיסה, והספירה מתבצעת ברקע.', 'The main loop only prints. The counting happens in the background.')
      ],
      expect: B('סיבוב לכיוון אחד מעלה את המספר, וסיבוב לכיוון השני מוריד אותו. לחיצה על הציר מדפיסה `pressed: True`.', 'Turning one way raises the number, and the other way lowers it. Pressing the shaft prints `pressed: True`.'),
      mistakes: [
        B('המספר עולה כשמסובבים שמאלה: החליפו בין החוטים של CLK ושל DT.', 'The number rises when you turn left: swap the CLK and DT wires.'),
        B('קליק אחד נספר פעמיים: יש ריטוט במגעים. זה קורה במקודדים זולים.', 'One click is counted twice: the contacts bounce. It happens on cheap encoders.')
      ],
      ideas: [B('כפתור עוצמת קול לבאזר.', 'A volume knob for the buzzer.'), B('בחירה מתוך תפריט שמוצג על מסך.', 'Choosing from a menu on a display.'), B('כיוון מדויק של הזווית של סרבו.', 'Fine adjustment of a servo angle.')]
    },

    /* ============================================================ keypad */
    {
      id: 'keypad', name: B('לוח מקשים 4×4', '4×4 keypad'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('16 מקשים, כמו בכספומט, עם שמונה חוטים בלבד.', '16 keys, like on a cash machine, with only eight wires.'),
      what: [
        B('לוח עם 16 מקשים: ספרות, כוכבית, סולמית והאותיות A עד D. משתמשים בו כדי להקליד קוד סודי או מספרים.', 'A pad with 16 keys: digits, star, hash and the letters A to D. It is used for entering a secret code or numbers.')
      ],
      looks: B('משטח דק וגמיש עם מקשים, ורצועה של שמונה חוטים שמסתיימת במחבר. ארבעת החוטים הראשונים הם השורות, וארבעת האחרונים הם העמודות.',
        'A thin flexible pad with keys, and a ribbon of eight wires ending in a connector. The first four wires are the rows, and the last four the columns.'),
      pins: [{ n: 'R1 ... R4', d: B('ארבע השורות.', 'The four rows.') }, { n: 'C1 ... C4', d: B('ארבע העמודות.', 'The four columns.') }],
      how: [
        B('כדי לחבר 16 מקשים היו צריכים 16 פינים. במקום זה המקשים מסודרים ברשת: כל מקש מחבר שורה אחת לעמודה אחת, וכך מספיקים שמונה חוטים.',
          '16 keys would need 16 pins. Instead the keys are arranged in a grid: each key joins one row to one column. That way eight wires are enough.'),
        B('הקוד "סורק": הוא מוריד שורה אחת ל-0 ובודק באיזו עמודה מופיע 0, ואז עובר לשורה הבאה. הסריקה מהירה כל כך שנראה כאילו הכול נבדק בבת אחת.',
          'The code "scans": it pulls one row to 0 and checks which column shows 0. Then it moves to the next row. The scan is so fast it looks as if everything is checked at once.')
      ],
      needs: [B('לוח מקשים 4×4', 'A 4×4 keypad'), B('שמונה חוטי גישור', 'Eight jumper wires')],
      wiring: [W('R1', 'GP2', 4), W('R2', 'GP3', 5), W('R3', 'GP4', 6), W('R4', 'GP5', 7), W('C1', 'GP6', 9), W('C2', 'GP7', 10), W('C3', 'GP8', 11), W('C4', 'GP9', 12)],
      steps: [UNPLUG, B('הכניסו שמונה חוטי גישור למחבר של לוח המקשים. החוט הראשון, בצד שמאל כשהמקשים פונים אליכם, הוא R1.', 'Push eight jumper wires into the keypad\'s connector. The first wire, on the left with the keys facing you, is R1.'),
        B('חברו את R1 עד R4 לפינים 4, 5, 6 ו-7 (`GP2` עד `GP5`).', 'Connect R1 to R4 to pins 4, 5, 6 and 7 (`GP2` to `GP5`).'),
        B('חברו את C1 עד C4 לפינים 9, 10, 11 ו-12 (`GP6` עד `GP9`).', 'Connect C1 to C4 to pins 9, 10, 11 and 12 (`GP6` to `GP9`).'), CHECK],
      code: [
        'from machine import Pin', 'from time import sleep', '',
        'rows = [Pin(n, Pin.OUT, value=1) for n in (2, 3, 4, 5)]', 'cols = [Pin(n, Pin.IN, Pin.PULL_UP) for n in (6, 7, 8, 9)]', 'KEYS = ["123A", "456B", "789C", "*0#D"]', '',
        'def read_key():', '    for r, row in enumerate(rows):', '        row.low()', '        for c, col in enumerate(cols):', '            if col.value() == 0:', '                row.high()', '                return KEYS[r][c]', '        row.high()', '    return None', '',
        'while True:', '    key = read_key()', '    if key:', '        print("key:", key)', '        sleep(0.3)', '    sleep(0.02)'
      ],
      explain: [
        E([4], 'ארבע השורות מוגדרות כיציאות, ומתחילות במצב 1. זו דרך קצרה ליצור רשימה של ארבעה פינים.', 'The four rows are outputs, starting at 1. This is a short way to build a list of four pins.'),
        E([5], 'ארבע העמודות מוגדרות ככניסות עם נגדי משיכה.', 'The four columns are inputs with pull-ups.'),
        E([6], 'כאן כתוב מה מופיע על כל מקש, שורה אחרי שורה.', 'What is written on each key, row by row.'),
        E([8, 16], 'זו הסריקה: מורידים שורה ל-0, בודקים את העמודות ומחזירים את השורה למצבה. אם נמצא מקש לחוץ, הפונקציה מחזירה את התו שלו.', 'The scan: pull a row low, check the columns, and put it back. If a pressed key is found, its character is returned.'),
        E([19, 22], 'אם נלחץ מקש, מדפיסים אותו ומחכים מעט, כדי שלא יודפס שוב ושוב.', 'If a key was pressed, print it and wait a little so it is not printed over and over.')
      ],
      expect: B('כל לחיצה על מקש מדפיסה את התו שלו, למשל `key: 5`.', 'Each key press prints its character, for example `key: 5`.'),
      mistakes: [
        B('מודפס תו לא נכון: סדר החוטים הפוך. סובבו את המחבר, או שנו את הסדר ברשימות.', 'The wrong character is printed: the wire order is reversed. Turn the connector round, or change the order in the lists.'),
        B('שורה שלמה או עמודה שלמה לא עובדת: אחד החוטים רופף.', 'A whole row or column does not work: one wire is loose.')
      ],
      ideas: [B('מנעול עם קוד סודי.', 'A lock with a secret code.'), B('מחשבון עם מסך.', 'A calculator on a display.'), B('כיוון הזמן בטיימר.', 'Setting the time on a timer.')]
    },

    /* ============================================================ touch */
    {
      id: 'touch', name: B('חיישן מגע TTP223', 'TTP223 touch sensor'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('כפתור בלי חלקים זזים: מספיק לגעת בו.', 'A button with no moving parts: a touch is enough.'),
      what: [B('חיישן שמרגיש נגיעה של אצבע, כמו מסך של טלפון. אין בו שום חלק שנלחץ, ולכן הוא לא נשחק, ואפשר להסתיר אותו מאחורי פלסטיק דק או קרטון.', 'A sensor that feels the touch of a finger, like a phone screen. Nothing in it is pressed, so it does not wear out, and it can be hidden behind thin plastic or card.')],
      looks: B('לוח קטן, לרוב אדום, עם עיגול מודפס שבו נוגעים, ושלושה פינים: SIG, VCC, GND.', 'A small board, usually red, with a printed circle that you touch, and three pins: SIG, VCC, GND.'),
      pins: [{ n: 'SIG', d: B('היציאה: 1 כשנוגעים, ו-0 כשלא נוגעים.', 'The output. 1 when touched, 0 when not.') }, V33(), GND()],
      how: [B('הגוף שלנו מוליך מעט חשמל. כשאצבע מתקרבת לעיגול, השבב שעל הלוח מרגיש שינוי זעיר ומעלה את היציאה ל-1. מבחינת ה-Pico זה כפתור רגיל, אבל בלי צורך בנגד משיכה.', 'Our body conducts a little electricity. When a finger nears the circle, the chip on the board senses a tiny change and raises the output to 1. To the Pico it is an ordinary button, but with no need for a pull-up.')],
      needs: [B('מודול TTP223', 'A TTP223 module'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('SIG', 'GP22', 29), W('VCC', '3V3', 36), W('GND', 'GND', 28)],
      steps: [UNPLUG, seat(3), wire('SIG', 'GP22', 29), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 28), CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'touch = Pin(22, Pin.IN)', 'led = Pin("LED", Pin.OUT)', '', 'while True:', '    led.value(touch.value())', '    sleep(0.02)'],
      explain: [
        E([4], 'זה פין כניסה רגיל. החיישן מוציא 0 או 1 ברורים, ולכן אין צורך בנגד משיכה.', 'An ordinary input pin. The sensor outputs a clear 0 or 1, so no pull-up is needed.'),
        E([5], 'זה הלד שעל הלוח, כדי שאפשר יהיה לראות את התוצאה בלי לחבר שום דבר.', 'The LED on the board, to see the result without connecting anything.'),
        E([8], 'השורה הזו מעתיקה את מצב החיישן ללד.', 'Copies the sensor\'s state to the LED.')
      ],
      expect: B('כשנוגעים בעיגול, הלד שעל ה-Pico נדלק. כשמרימים את האצבע, הוא נכבה.', 'Touch the circle and the LED on the Pico lights. Lift the finger and it goes off.'),
      mistakes: [B('החיישן מגיב גם בלי נגיעה: הוא מתכייל בשנייה הראשונה אחרי ההדלקה, ולכן אל תיגעו בו בזמן הזה.', 'The sensor reacts with no touch: it calibrates in the first second after power-up. Do not touch it during that time.')],
      ideas: [B('מנורת מגע.', 'A touch lamp.'), B('כפתור נסתר מאחורי תמונה.', 'A hidden button behind a picture.'), B('פסנתר קטן עם כמה חיישנים ובאזר.', 'A small piano with several sensors and a buzzer.')]
    },

    /* ============================================================ IR receiver */
    {
      id: 'irrecv', name: B('מקלט IR ושלט', 'IR receiver and remote'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('שליטה בפרויקט מרחוק, עם שלט רגיל.', 'Control a project from a distance, with an ordinary remote.'),
      what: [B('מקלט שקולט את האור הבלתי נראה ששולח שלט של טלוויזיה. כך אפשר לשלוט בפרויקט מהצד השני של החדר. לכל כפתור בשלט יש קוד משלו.', 'A receiver that picks up the invisible light a TV remote sends. This lets you control a project from across the room. Each button on the remote has its own code.')],
      looks: B('לוח קטן עם רכיב שחור בעל כיפה, ושלושה פינים: S, פלוס ומינוס. הערכה מגיעה בדרך כלל עם שלט קטן ודק.', 'A small board with a black domed part, and three pins: S, plus and minus. The kit usually comes with a small thin remote.'),
      pins: [{ n: 'S', d: B('היציאה. במנוחה היא 1, והיא יורדת ל-0 כשמגיע אור מהשלט.', 'The output. At rest it is 1, dropping to 0 when light arrives from the remote.') }, V33('+'), GND('−')],
      how: [
        B('השלט מהבהב בנורית [[infrared|אינפרא-אדום]] בקצב מהיר מאוד, והמקלט הופך את ההבהובים ל-0 ול-1. כל לחיצה מתחילה בהבהוב ארוך, ואחריו מגיעים 32 [[bit|ביטים]]: הבהוב קצר ואחריו הפסקה קצרה הם 0, והפסקה ארוכה היא 1.',
          'The remote flashes an [[infrared|infrared]] light very fast, and the receiver turns the flashes into 0s and 1s. Each press starts with a long flash, followed by 32 [[bit|bits]]: a short flash then a short gap is 0, and a long gap is 1.'),
        B('הקוד מודד את אורך ההפסקות ומרכיב מהן מספר. זו השיטה הנפוצה ביותר בשלטים, והיא נקראת NEC. שלטים אחרים עשויים לעבוד בשיטה אחרת.', 'The code times the gaps and builds a number from them. This is the most common scheme for remotes, called NEC. Other remotes may use a different scheme.')
      ],
      needs: [B('מודול מקלט IR (KY-022 או VS1838B)', 'An IR receiver module (KY-022 or VS1838B)'), B('שלט IR', 'An IR remote'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('S', 'GP21', 27), W('+', '3V3', 36), W('−', 'GND', 28)],
      steps: [UNPLUG, seat(3), wire('S', 'GP21', 27), wire('+', '3V3(OUT)', 36), wire('−', 'GND', 28), CHECK],
      code: [
        'from machine import Pin, time_pulse_us', '', 'ir = Pin(21, Pin.IN)', '',
        'def read_ir():', '    if time_pulse_us(ir, 0, 100000) < 8000:    # the 9 ms start burst', '        return None', '    if time_pulse_us(ir, 1, 10000) < 4000:     # the 4.5 ms gap', '        return None',
        '    code = 0', '    for i in range(32):', '        t = time_pulse_us(ir, 1, 5000)', '        if t < 0:', '            return None', '        code = (code << 1) | (1 if t > 1000 else 0)', '    return code', '',
        'while True:', '    code = read_ir()', '    if code:', '        print("button code:", hex(code))'
      ],
      explain: [
        E([3], 'זה פין כניסה רגיל.', 'An ordinary input pin.'),
        E([6, 9], 'השורות האלה מחכות לפתיחה של כל לחיצה: הבהוב של 9 אלפיות שנייה, ואחריו הפסקה של 4.5 אלפיות שנייה. אם האורכים לא מתאימים, האות לא הגיע משלט.', 'Waits for the opening of every press: a 9 millisecond flash, then a 4.5 millisecond gap. If the lengths do not match, it is not a remote.'),
        E([11, 15], 'השורות האלה קוראות 32 ביטים ומודדות כל הפסקה: הפסקה ארוכה היא 1, וקצרה היא 0. `<<` מזיז את המספר מקום אחד שמאלה, ו-`|` מוסיף את הביט החדש.', 'Reads 32 bits. Each gap is timed: long is 1, short is 0. `<<` shifts the number one place left, and `|` adds the new bit.'),
        E([19, 21], 'אם התקבל קוד, הוא מודפס בכתיב [[hex|hex]].', 'If a code was received, prints it in [[hex|hex]] notation.')
      ],
      expect: B('כל לחיצה על כפתור בשלט מדפיסה מספר, למשל `button code: 0xff30cf`. לכל כפתור יש מספר אחר. רשמו את המספרים כדי להשתמש בהם בפרויקט.', 'Each press of a remote button prints a number, for example `button code: 0xff30cf`. Every button has a different number. Note them down to use in your project.'),
      mistakes: [
        B('שום דבר לא מודפס: כוונו את השלט ישירות אל הכיפה השחורה, ובדקו שיש בו סוללה.', 'Nothing prints: point the remote straight at the black dome, and check it has a battery.'),
        B('השלט שלכם לא עובד בשיטת NEC. נסו שלט אחר. הקוד הזה לא נבדק עם שלט אמיתי.', 'Your remote does not use the NEC scheme. Try another remote. This code has not been tried with a real remote.')
      ],
      ideas: [B('הדלקה וכיבוי של פס לדים מהספה.', 'Switching an LED strip on and off from the sofa.'), B('רכב שנשלט בשלט.', 'A remote-controlled car.'), B('בחירת מנגינה לבאזר.', 'Choosing a tune for the buzzer.')]
    },

    /* ============================================================ BME280 */
    {
      id: 'bme280', name: B('חיישן BME280', 'BME280 sensor'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x76',
      summary: B('טמפרטורה, לחות ולחץ אוויר ברכיב זעיר אחד.', 'Temperature, humidity and air pressure in one tiny part.'),
      what: [B('חיישן מדויק שמודד שלושה דברים: טמפרטורה, לחות ולחץ אוויר. לחץ האוויר יורד כשעולים לגובה ולפני גשם, ולכן אפשר להעריך בעזרתו גובה ולחזות את מזג האוויר.', 'An accurate sensor that measures three things: temperature, humidity and air pressure. Air pressure falls as you climb and before rain, so it can be used to estimate height and forecast weather.')],
      looks: B('לוח סגול או כחול קטן מאוד, עם רכיב מתכתי זעיר שיש בו חור קטן, וארבעה פינים: VIN, GND, SCL, SDA. יש לוח דומה בשם BMP280, שלא מודד לחות.',
        'A very small purple or blue board with a tiny metal part that has a small hole, and four pins: VIN, GND, SCL, SDA. A similar board named BMP280 does not measure humidity.'),
      pins: [V33('VIN'), GND(), c.GND ? { n: 'SCL', d: B('[[clock|קו השעון]] של I2C.', 'The I2C [[clock|clock line]].') } : null, { n: 'SDA', d: B('קו הנתונים של [[i2c|I2C]].', 'The [[i2c|I2C]] data line.') }],
      how: [B('החיישן מתקשר ב-[[i2c|I2C]], בכתובת `0x76` או `0x77`. כדי להפוך את המדידות הגולמיות שלו למספרים אמיתיים צריך חישוב ארוך, ולכן משתמשים ב[[library|ספרייה]] שמבצעת אותו.', 'The sensor speaks [[i2c|I2C]], at address `0x76` or `0x77`. Turning its raw measurements into real numbers needs a long calculation, so a [[library|library]] that does it is used.')],
      needs: [B('מודול BME280', 'A BME280 module'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      lib: { name: 'bme280', how: B('ספרייה חיצונית בשם bme280. חפשו אותה ב-Thonny דרך Tools ואחר כך Manage packages. שם הספרייה ואופן ההתקנה לא נבדקו על לוח אמיתי.', 'A third-party library named bme280. Look for it in Thonny through Tools, then Manage packages. The library name and installation have not been tried on a real board.') },
      wiring: [W('VIN', '3V3', 36), W('GND', 'GND', 8), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, seat(4), wire('VIN', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7), CHECK,
        B('התקינו את הספרייה `bme280` דרך Thonny.', 'Install the `bme280` library through Thonny.')],
      code: ['from machine import Pin, I2C', 'from time import sleep', 'import bme280', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'print([hex(a) for a in i2c.scan()])   # expect 0x76 or 0x77', '', 'sensor = bme280.BME280(i2c=i2c)', '', 'while True:', '    print(sensor.values)', '    sleep(2)'],
      explain: [
        E([3], 'השורה הזו טוענת את הספרייה. אם מופיעה כאן שגיאה, סימן שהספרייה לא הותקנה.', 'Brings in the library. An error here means it was not installed.'),
        E([5, 6], 'השורות האלה מגדירות את ה[[bus|אפיק]] ובודקות שהחיישן עונה.', 'Sets up the [[bus|bus]] and checks the sensor answers.'),
        E([8], 'השורה הזו יוצרת את החיישן על האפיק.', 'Creates the sensor on the bus.'),
        E([11], 'השורה הזו מדפיסה את שלוש המדידות: טמפרטורה, לחץ ולחות.', 'Prints the three measurements: temperature, pressure and humidity.')
      ],
      expect: B('כל שתי שניות מודפסת שורה עם שלושה ערכים, למשל `(\'24.1C\', \'1009.2hPa\', \'48.3%\')`.', 'Every two seconds a line with three values is printed, for example `(\'24.1C\', \'1009.2hPa\', \'48.3%\')`.'),
      mistakes: [
        B('`scan()` מחזיר רשימה ריקה: החוטים של SDA ו-SCL הוחלפו.', '`scan()` returns an empty list: SDA and SCL are swapped.'),
        B('הלחות תמיד 0: זה מודול BMP280, שלא מודד לחות.', 'Humidity is always 0: this is a BMP280 module, which does not measure humidity.'),
        B('מופיעה שגיאה ביצירת החיישן: הכתובת שלו היא `0x77`. הוסיפו `address=0x77`.', 'An error creating the sensor: its address is `0x77`. Add `address=0x77`.')
      ],
      ideas: [B('תחנת מזג אוויר שלמה.', 'A complete weather station.'), B('מד גובה לטיולים.', 'An altimeter for a hike.'), B('התרעה לפני גשם, כשהלחץ יורד במהירות.', 'A warning before rain, when the pressure drops fast.')]
    },

    /* ============================================================ soil */
    {
      id: 'soil', name: B('חיישן לחות קרקע', 'Soil moisture sensor'), iface: ['adc'], cat: 'sensor', volt: '3.3V',
      summary: B('נועצים אותו בעציץ, והוא מודד כמה האדמה רטובה.', 'Push it into a plant pot and it measures how wet the soil is.'),
      what: [B('חיישן שנועצים באדמה של עציץ, והוא מדווח כמה היא רטובה. כך הפרויקט יודע מתי הצמח צריך מים.', 'A sensor you push into the soil of a plant pot, and it reports how wet it is. This tells a project when the plant needs water.')],
      looks: B('לוח שחור ארוך וצר בצורת חץ, עם כבל של שלושה חוטים: GND, VCC ו-AOUT. זה הדגם הקיבולי. יש גם דגם ישן עם שתי רגלי מתכת חשופות, שמחליד מהר.',
        'A long narrow arrow-shaped board, black, with a cable of three wires: GND, VCC and AOUT. This is the capacitive kind. There is an older kind with two bare metal legs, which rusts quickly.'),
      pins: [GND(), V33(), { n: 'AOUT', d: B('מתח שמשתנה לפי הלחות. הוא מתחבר לפין [[adc|ADC]].', 'A voltage that changes with moisture. Connects to an [[adc|ADC]] pin.') }],
      how: [
        B('החיישן מוציא [[voltage|מתח]] שיורד ככל שהאדמה רטובה יותר: באוויר יבש המתח גבוה, ובתוך מים הוא נמוך. ה-Pico קורא אותו בעזרת ה-ADC.',
          'The sensor outputs a [[voltage|voltage]] that falls as the soil gets wetter: in dry air the voltage is high, and in water it is low. The Pico reads it on an ADC.'),
        B('כל חיישן שונה מעט מהאחרים, ולכן צריך לכייל אותו: מודדים פעם אחת באוויר ופעם אחת בכוס מים, ורושמים את שני המספרים בקוד.', 'Every sensor differs slightly, so it must be calibrated: measure once in air and once in a glass of water, and write both numbers into the code.')
      ],
      needs: [B('חיישן לחות קרקע קיבולי', 'A capacitive soil moisture sensor'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('GND', 'GND', 38), W('VCC', '3V3', 36), W('AOUT', 'GP28', 34, B('ADC2', 'ADC2'))],
      steps: [UNPLUG, B('חברו שלושה חוטי גישור למחבר של החיישן.', 'Connect three jumper wires to the sensor\'s connector.'), lead('GND', 'GND', 38), lead('VCC', '3V3(OUT)', 36), lead('AOUT', 'GP28', 34), CHECK,
        B('הריצו את הקוד, ורשמו את המספר הראשון שמודפס כשהחיישן באוויר. טבלו אותו בכוס מים עד הקו המסומן, ורשמו את המספר שוב. עדכנו את `DRY` ואת `WET` בקוד.', 'Run it, and note the first number printed with the sensor in air. Dip it in a glass of water up to the marked line, and note it again. Update `DRY` and `WET` in the code.')],
      code: [
        'from machine import ADC', 'from time import sleep', '', 'soil = ADC(28)', '',
        'DRY = 52000      # the reading in dry air: measure yours', 'WET = 24000      # the reading in a glass of water: measure yours', '',
        'while True:', '    raw = soil.read_u16()', '    percent = (DRY - raw) * 100 // (DRY - WET)', '    percent = max(0, min(100, percent))', '    print(raw, percent, "%")', '    sleep(1)'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את GP28 למדידת מתח.', 'GP28 is used for measuring voltage.'),
        E([6, 7], 'אלה שני מספרי הכיול. אלה ערכים לדוגמה, ואת הערכים שלכם צריך למדוד.', 'The two calibration numbers. These are sample values, and yours must be measured.'),
        E([10], 'זו הקריאה הגולמית.', 'The raw reading.'),
        E([11], 'השורה הזו הופכת את הקריאה לאחוזים: 0% ביובש ו-100% במים.', 'Turns it into a percentage: 0% when dry and 100% in water.'),
        E([12], 'השורה הזו מגבילה את התוצאה לטווח שבין 0 ל-100, למקרה שהקריאה חורגת מעט.', 'Limits the result to the range 0 to 100, in case the reading strays slightly.')
      ],
      expect: B('פעם בשנייה מודפסים הקריאה הגולמית ואחוז הלחות. באוויר האחוז קרוב ל-0, ובכוס מים הוא קרוב ל-100.', 'Once a second the raw reading and the moisture percentage are printed. In air the percentage is near 0, and in a glass of water near 100.'),
      mistakes: [
        B('האחוזים לא הגיוניים: החיישן לא כויל. עדכנו את `DRY` ואת `WET`.', 'The percentages make no sense: it was not calibrated. Update `DRY` and `WET`.'),
        B('החיישן נרטב מעל הקו המסומן. האלקטרוניקה שבחלק העליון שלו לא עמידה במים.', 'The sensor got wet above the marked line. The electronics at the top are not waterproof.')
      ],
      ideas: [B('נורית "השקו אותי".', 'A "water me" light.'), B('השקיה אוטומטית בעזרת ממסר ומשאבה.', 'Automatic watering with a relay and a pump.'), B('רישום של הלחות לאורך שבוע.', 'Logging moisture over a week.')]
    }
  );

  /* a null slipped in where an optional helper was used: drop empty entries */
  P.components.forEach(function (comp) {
    ['steps', 'pins'].forEach(function (k) { if (comp[k]) comp[k] = comp[k].filter(Boolean); });
  });
})(window.PICO);
