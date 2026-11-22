/* Lesson tracks, part 3: track E (movement and power), track F (light,
   display and input) and track G (time, data and communication).
   Same structure as data-lessons.js. The breadboard pictures of these
   lessons are in data-layouts-2.js. In the wiring tables, ground goes to
   pin 38 or pin 3: those are the pins that feed the two ground rails. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, UNPLUG = x.UNPLUG, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ, RES = x.RES;

  var CLEAR = B('פנו מהמטריצה את כל מה שנשאר מהשיעור הקודם.', 'Clear the breadboard of the previous lesson.');
  var RAILS = B('ההזנה והאדמה עוברות בפסים שלאורך המטריצה, כמו בציור. לחצו על "בנו צעד אחר צעד" שמעל הציור כדי לראות את החוטים אחד אחרי השני.', 'Power and ground run through the rails along the breadboard, as in the picture. Click "Build it step by step" above the picture to see each wire in turn.');
  var BASICS = function (id, he, en, whyHe, whyEn) { return { href: '#/basics/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var PART = function (id, he, en, whyHe, whyEn) { return { href: '#/components/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var LESSON = function (id) { return { href: '#/lessons/' + id, label: B('שיעור ' + id, 'Lesson ' + id) }; };

  P.tracks.push(
    { id: 'E', color: '--c-power', title: B('תנועה וכוח', 'Movement and power'), desc: B('ממסר, מנוע רגיל, מנוע צעד וג\'ויסטיק: איך מפעילים רכיבים שפין לבדו לא יכול להפעיל.', 'A relay, a plain motor, a stepper motor and a joystick. Driving things a pin cannot drive by itself.') },
    { id: 'F', color: '--c-spi', title: B('אור, צבע וקלט', 'Light, colour and input'), desc: B('ערבוב צבעים, פס לדים, לוח מקשים ותפריט שמוצג על מסך.', 'Mixing colours, an LED strip, a keypad and a menu on a display.') },
    { id: 'G', color: '--c-uart', title: B('זמן, נתונים ותקשורת', 'Time, data and communication'), desc: B('שעון אמיתי, רישום נתונים לקובץ, כרטיס RFID ושליטה מהטלפון.', 'A real clock, logging to a file, an RFID card and control from a phone.') }
  );

  P.lessons.push(
    /* ============================================================ E1 */
    {
      id: 'E1', track: 'E',
      title: B('ממסר: מתג שהתוכנית לוחצת עליו', 'A relay: a switch the program presses'),
      goal: B('כפתור מפעיל ממסר, והממסר מפעיל מעגל חשמלי נפרד. אחרי עשר שניות המעגל נכבה אוטומטית.', 'A button operates a relay, and the relay switches a separate circuit. With automatic switch-off after ten seconds.'),
      learn: [
        B('למה פין לא יכול להפעיל עומס גדול, ומה תפקידו של [[relay|ממסר]].', 'To understand why a pin does not drive a big load, and what a [[relay|relay]] does.'),
        B('איך מחברים מעגל שני, נפרד, למהדקי הבורג.', 'To connect a second, separate circuit to the screw terminals.'),
        B('איך מוסיפים הגנה: כל דבר שנדלק חייב גם להיכבות מעצמו.', 'To add a safeguard: something that switches on must also switch off by itself.')
      ],
      before: [
        BASICS('power', 'יסודות: כוח', 'Basics: Power', 'חשוב לקרוא את העמוד הזה לפני שמתחילים את המסלול.', 'Do read this before the whole track.'),
        PART('relay', 'העמוד של מודול הממסר', 'The relay module\'s page'),
        LESSON('A4')
      ],
      parts: [{ id: 'relay', qty: 1 }, { id: 'button', qty: 1 }, { text: B('מעגל שהממסר יפעיל: בית סוללות (2 עד 4 סוללות AA) ונורה קטנה או מנוע קטן', 'A circuit to switch: a battery holder (2 to 4 AA batteries) and a small bulb or small motor') }, { text: B('חוטי גישור ומברג קטן', 'Jumper wires and a small screwdriver') }],
      wiring: [
        W(B('ממסר, VCC', 'Relay, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('ממסר, GND', 'Relay, GND'), 'GND', 38, null, 'GND'),
        W(B('ממסר, IN', 'Relay, IN'), 'GP21', 27, null, B('ממסר', 'Relay')),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('כפתור, הרגל שמולה', 'Button, the opposite leg'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('מודול הממסר נשאר מחוץ למטריצה, כמו בציור. חברו את שלושת הפינים שלו לפי הטבלה, בחוטים שיש להם קצה נקבה.', 'The relay module stays off the breadboard, as in the picture. Connect its three pins with female-ended wires, following the table.'),
        B('חברו את הכפתור: רגל אחת לפין 19 (`GP14`), והרגל שמולה לאדמה.', 'Connect the button: one leg to pin 19 (`GP14`), and the opposite leg to ground.'),
        RAILS,
        B('עכשיו המעגל הנפרד: חברו את הפלוס של בית הסוללות למהדק `COM` של הממסר. חברו חוט ממהדק `NO` אל הנורה, וחוט נוסף מהצד השני של הנורה אל המינוס של הסוללות. השאירו את המהדק `NC` ריק.', 'The separate circuit: connect the battery holder\'s plus to the relay\'s `COM` terminal. Run a wire from the `NO` terminal to the bulb, and from the bulb\'s other side to the batteries\' minus. The `NC` terminal stays empty.'),
        B('שימו לב: המעגל של הסוללות לא נוגע ב-Pico בשום נקודה.', 'Note: the battery circuit does not touch the Pico at any point.'),
        PLUG, RUN,
        B('לחצו על הכפתור, ואחר כך לחצו שוב. לבסוף לחצו פעם נוספת, וחכו עשר שניות.', 'Press the button. Press again. Press, and wait ten seconds.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep, ticks_ms, ticks_diff',
        '',
        'relay = Pin(21, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'MAX_ON = 10000          # milliseconds: switch off by itself after this',
        'on = False',
        'since = 0',
        'last = 1',
        '',
        'while True:',
        '    now = button.value()',
        '    if last == 1 and now == 0:',
        '        on = not on',
        '        since = ticks_ms()',
        '    last = now',
        '    if on and ticks_diff(ticks_ms(), since) > MAX_ON:',
        '        on = False',
        '        print("safety: switched off")',
        '    relay.value(on)',
        '    sleep(0.02)'
      ],
      explain: [
        E([4, 5], 'הממסר מחובר לפין יציאה רגיל, בדיוק כמו לד. הכפתור מחובר לכניסה עם [[pullup|נגד משיכה]].', 'The relay is an ordinary output pin, exactly like an LED. The button is an input with a [[pullup|pull-up]].'),
        E([7], 'הזמן המרבי, באלפיות שנייה, שבו הממסר נשאר דולק.', 'The longest the relay stays on, in milliseconds.'),
        E([8, 10], 'שלושה דברים שהתוכנית זוכרת: האם הממסר דולק, ממתי הוא דולק, ומה היה מצב הכפתור בבדיקה הקודמת.', 'Three things remembered: whether the relay is on, since when, and what the button read last time.'),
        E([14], 'כאן מזהים את רגע הלחיצה, כמו בשיעור A4: קודם הכפתור היה 1, ועכשיו הוא 0.', 'Catching the moment of the press, as in lesson A4: it was 1 before, and is 0 now.'),
        E([15, 16], 'השורות האלה הופכות את המצב, ושומרות את הרגע שבו זה קרה.', 'Flips the state, and remembers when that happened.'),
        E([18, 20], 'זו ההגנה: אם הממסר דולק יותר מעשר שניות, מכבים אותו. `ticks_diff` מחשב כמה זמן עבר.', 'The safeguard: if the relay has been on for more than ten seconds, switch off. `ticks_diff` works out how much time has passed.'),
        E([21], 'רק כאן, במקום אחד, הפין נקבע לפי המשתנה. `True` שווה 1, ו-`False` שווה 0.', 'Only here, in one place, is the pin set from the variable. `True` is 1 and `False` is 0.')
      ],
      expect: B('לחיצה אחת: נשמע "קליק" והנורה נדלקת. לחיצה נוספת: עוד קליק, והנורה נכבית. אם משאירים אותה דולקת, אחרי עשר שניות היא נכבית מעצמה ומודפסת הודעה.', 'A press: a "click" is heard and the bulb lights. Another press: a click, and it goes out. Leave it on, and after ten seconds it goes out by itself and a message is printed.'),
      tasks: [
        { t: B('העבירו את החוט ממהדק `NO` למהדק `NC`. מה השתנה, ולמה?', 'Move the wire from the `NO` terminal to the `NC` terminal. What changed, and why?'), hint: B('`NC` מחובר ל-`COM` כשהממסר במנוחה, ולכן הכול מתהפך: הנורה דולקת כשהממסר כבוי. כך בונים מעגל שנשאר דולק גם כשה-Pico מאבד חשמל.', '`NC` is joined to `COM` while the relay is at rest. Everything is reversed: the bulb is lit while the relay is off. This is how to build something that stays on even if the Pico loses power.') },
        { t: B('החליפו את הכפתור בחיישן האור משיעור B3, כך שהנורה תידלק כשמחשיך.', 'Replace the button with the light sensor from lesson B3: the bulb comes on when it gets dark.'), hint: B('השתמשו בשני ספים, כמו באתגר של B3: הדליקו מתחת ל-25 אחוז, וכבו מעל 35. בלי זה הממסר מתקתק שוב ושוב ליד הסף, וזה מקצר את חייו.', 'Two thresholds, as in the B3 challenge: switch on below 25 per cent and off above 35. Without this the relay chatters near the threshold, which shortens its life.') },
        { t: B('טיימר לביצים: לחיצה מפעילה את הממסר לדקה אחת בדיוק, ואחר כך הוא נכבה. לחיצה בזמן שהוא פועל לא עושה כלום.', 'An egg timer: a press runs the relay for exactly one minute, then it switches off. A press in the middle does nothing.'), hint: B('בתוך התנאי של הלחיצה, הדליקו את הממסר רק אם `on` הוא `False`. שנו את `MAX_ON` ל-60000.', 'Inside the press condition, switch on only if `on` is `False`. Change `MAX_ON` to 60000.'),
          code: ['    if last == 1 and now == 0 and not on:', '        on = True', '        since = ticks_ms()'] }
      ],
      quiz: [
        Q(B('למה מחברים את הנורה דרך ממסר, ולא ישירות לפין?', 'Why is the bulb connected through a relay and not straight to a pin?'),
          [B('כי הנורה צריכה יותר מתח וזרם ממה שפין יכול לתת, והממסר מפריד בין שני המעגלים', 'Because the bulb needs more voltage and current than a pin gives, and the relay keeps the two circuits apart'), B('כדי שיישמע קליק', 'So that a click is heard'), B('כי פין לא יכול להיות יציאה', 'Because a pin cannot be an output')], 0,
          B('הפין נותן רק אות. הזרם של הנורה מגיע מהסוללות ועובר דרך המגע של הממסר.', 'The pin only gives a signal. The bulb\'s current comes from the batteries, and passes through the relay\'s contact.'))
      ]
    },

    /* ============================================================ E2 */
    {
      id: 'E2', track: 'E',
      title: B('מנוע עם מהירות וכיוון', 'A motor with speed and direction'),
      goal: B('כפתור סיבוב שולט במנוע: באמצע המנוע עומד, כשמסובבים ימינה הוא מסתובב קדימה, וכשמסובבים שמאלה הוא מסתובב אחורה.', 'A knob controls a motor: stopped in the middle, forward to the right, reverse to the left.'),
      learn: [
        B('איך שולטים במנוע DC דרך [[motordriver|דרייבר]], בעזרת שני פיני [[pwm|PWM]].', 'To control a DC motor through a [[motordriver|driver]], with two [[pwm|PWM]] pins.'),
        B('איך ממפים טווח אחד לטווח אחר, כולל מספרים שליליים.', 'To map one range onto another, negative numbers included.'),
        B('איך מוסיפים [[deadzone|אזור מת]], כדי שהמנוע יעמוד באמת במקום.', 'To add a [[deadzone|dead zone]], so the motor truly stands still.')
      ],
      before: [PART('motor', 'העמוד של מנוע DC', 'The DC motor\'s page', 'שם מוסבר איך מחברים את המנוע לדרייבר.', 'It explains how the motor connects to the driver.'), LESSON('B2')],
      parts: [{ id: 'motor', qty: 1 }, { id: 'pot', qty: 1 }, { text: B('שבעה חוטי גישור', 'Seven jumper wires') }],
      wiring: [
        W(B('דרייבר, IN1', 'Driver, IN1'), 'GP20', 26, null, 'IN1'),
        W(B('דרייבר, IN2', 'Driver, IN2'), 'GP21', 27, null, 'IN2'),
        W(B('דרייבר, VCC', 'Driver, VCC'), 'VBUS', 40, B('5V למנוע', '5 V for the motor'), '5V'),
        W(B('דרייבר, GND', 'Driver, GND'), 'GND', 38, null, 'GND'),
        W(B('פוטנציומטר, רגל קיצונית', 'Potentiometer, outer leg'), '3V3', 36, null, '3.3V'),
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, B('ADC0', 'ADC0'), B('כפתור סיבוב', 'Knob')),
        W(B('פוטנציומטר, רגל קיצונית שנייה', 'Potentiometer, other outer leg'), 'GND', 38, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את הדרייבר למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה.', 'Push in the driver and connect its four pins following the table.'),
        B('חברו את שני החוטים של המנוע ליציאות `OUT1` ו-`OUT2` של הדרייבר: הכניסו כל חוט לטור של היציאה שלו, כמו בציור. הסדר לא חשוב, כי הוא רק קובע לאיזה כיוון נקרא "קדימה".', 'Connect the motor\'s two wires to the driver\'s `OUT1` and `OUT2` outputs: push each wire into the column of its output, as in the picture. The order does not matter, it only decides which way is called "forward".'),
        B('הכניסו את הפוטנציומטר למטריצה, וחברו את שלוש הרגליים שלו כמו בשיעור B1.', 'Push in the potentiometer and connect its three legs, as in lesson B1.'),
        RAILS,
        B('סובבו את הפוטנציומטר לאמצע, והחזיקו את המנוע כך שהציר שלו יוכל להסתובב בחופשיות.', 'Turn the potentiometer to the middle, and hold the motor so its shaft is free.'),
        PLUG, RUN,
        B('סובבו לאט ימינה, חזרו לאמצע, ואחר כך סובבו לאט שמאלה.', 'Turn slowly to the right, back to the middle, and slowly to the left.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, ADC',
        'from time import sleep',
        '',
        'in1 = PWM(Pin(20), freq=1000)',
        'in2 = PWM(Pin(21), freq=1000)',
        'knob = ADC(26)',
        '',
        'DEAD = 3000',
        '',
        'def motor(speed):',
        '    # speed from -65535 (full reverse) to 65535 (full forward)',
        '    in1.duty_u16(speed if speed > 0 else 0)',
        '    in2.duty_u16(-speed if speed < 0 else 0)',
        '',
        'while True:',
        '    value = knob.read_u16() - 32768',
        '    if abs(value) < DEAD:',
        '        value = 0',
        '    speed = max(-65535, min(65535, value * 2))',
        '    motor(speed)',
        '    print(speed)',
        '    sleep(0.05)'
      ],
      explain: [
        E([4, 5], 'אלה שני פיני PWM. הדרייבר מסובב את המנוע לפי ההפרש ביניהם.', 'Two PWM pins. The driver turns the motor according to the difference between them.'),
        E([8], 'זה רוחב האזור המת: עד כמה רחוק מהאמצע הערך עדיין נחשב "אמצע".', 'The width of the dead zone: how far from the middle still counts as "middle".'),
        E([10, 13], 'זו פונקציה שמקבלת מהירות עם סימן. מספר חיובי מפעיל רק את IN1, ומספר שלילי מפעיל רק את IN2. `-speed` הופך מספר שלילי לחיובי.', 'A function that takes a signed speed. A positive number drives only IN1, and a negative one only IN2. `-speed` turns a negative number positive.'),
        E([16], 'הפוטנציומטר נותן ערך בין 0 ל-65535. כשמחסירים ממנו את האמצע, מקבלים מספר בין מינוס 32768 ל-32767, ועכשיו האמצע הוא 0.', 'The potentiometer gives 0 to 65535. Subtracting the middle gives a number between minus 32768 and 32767. Now the middle is 0.'),
        E([17, 18], 'אם הערך קרוב לאפס, קובעים אותו לאפס בדיוק. `abs` מסיר את הסימן.', 'If the value is near zero, it is set to exactly zero. `abs` drops the sign.'),
        E([19], 'מכפילים ב-2 כדי להגיע לטווח המלא, ומוודאים שהערך לא חורג ממנו.', 'Multiplies by 2 to reach the full range, and makes sure it is not exceeded.'),
        E([20, 21], 'השורות האלה מפעילות את המנוע ומדפיסות את המהירות.', 'Drives the motor and prints the speed.')
      ],
      expect: B('כשהכפתור באמצע, המנוע עומד ומודפס 0. ככל שמסובבים יותר ימינה, הוא מסתובב מהר יותר. משמאל לאמצע הוא מסתובב לכיוון השני, והמספר שלילי.', 'In the middle the motor stands still and 0 is printed. The further right you turn, the faster it spins. Left of the middle it spins the other way, and the number is negative.'),
      tasks: [
        { t: B('קבעו את `DEAD` ל-0 והריצו. מה קורה כשמנסים לעצור את המנוע?', 'Set `DEAD` to 0 and run. What happens when you try to stop the motor?'), hint: B('כמעט אי אפשר לכוון את הפוטנציומטר ל-32768 בדיוק, ולכן המנוע מזמזם או זוחל. האזור המת פותר בדיוק את הבעיה הזאת.', 'It is nearly impossible to set the potentiometer to exactly 32768. The motor hums or creeps. The dead zone solves precisely that.') },
        { t: B('במהירות נמוכה המנוע מזמזם ולא מסתובב. גרמו לו לקפוץ ישר למהירות שבה הוא כבר זז.', 'At low speed the motor hums and does not turn. Make it jump straight to a speed at which it already moves.'), hint: B('מצאו בניסוי את המהירות הנמוכה ביותר שבה הוא מסתובב, נניח 20000. אם `speed` אינו 0 וקטן מזה בערך המוחלט, קבעו אותו ל-20000 עם הסימן המתאים.', 'Find by experiment the lowest speed at which it turns, say 20000. If `speed` is not 0 and smaller than that in absolute value, set it to 20000 with the right sign.'),
          code: ['MIN = 20000', '', '    if 0 < abs(speed) < MIN:', '        speed = MIN if speed > 0 else -MIN'] },
        { t: B('התנעה רכה: המנוע לא יקפוץ מיד למהירות המבוקשת, אלא יתקרב אליה בהדרגה.', 'A soft start: the motor should not jump to the requested speed, but approach it gradually.'), hint: B('צרו משתנה `current` שמתחיל ב-0. בכל סיבוב של הלולאה קרבו אותו ל-`speed` ב-2000 לכל היותר, והעבירו לפונקציה `motor` את `current`.', 'A variable `current` starting at 0. On each turn of the loop it moves towards `speed` by at most 2000, and `current` is what is passed to `motor`.') }
      ],
      quiz: [
        Q(B('בשביל מה צריך את האזור המת?', 'What is the dead zone for?'),
          [B('כדי שהמנוע יסתובב מהר יותר', 'So the motor spins faster'), B('כדי שסטייה קטנה מהאמצע לא תזיז את המנוע', 'So a small drift from the middle does not move the motor'), B('כדי לחסוך בחשמל', 'To save electricity')], 1,
          B('פוטנציומטר וג\'ויסטיק אף פעם לא נותנים בדיוק את האמצע, ולכן מתעלמים מטווח קטן סביבו.', 'A potentiometer and a joystick never give exactly the middle. A small range around it is ignored.'))
      ]
    },

    /* ============================================================ E3 */
    {
      id: 'E3', track: 'E',
      title: B('מנוע צעד: רבע סיבוב בדיוק', 'A stepper motor: exactly a quarter turn'),
      goal: B('שני כפתורים: אחד מסובב את המנוע 90 מעלות ימינה, והשני 90 מעלות שמאלה.', 'Two buttons: one turns the motor 90 degrees to the right, the other 90 degrees to the left.'),
      learn: [
        B('במה [[stepmotor|מנוע צעד]] שונה ממנוע רגיל ומסרבו.', 'To understand how a [[stepmotor|stepper motor]] differs from a plain motor and from a servo.'),
        B('איך מפעילים ארבעה סלילים ברצף, בעזרת [[list|רשימה]] של מצבים.', 'To drive four coils in sequence, with a [[list|list]] of states.'),
        B('איך ממירים מעלות לצעדים.', 'To convert degrees into steps.')
      ],
      before: [
        BASICS('python2', 'יסודות: עוד פייתון', 'Basics: More Python', 'שם מוסבר מה הן רשימות.', 'For lists.'),
        PART('stepper', 'העמוד של מנוע הצעד', 'The stepper motor\'s page')
      ],
      parts: [{ id: 'stepper', qty: 1 }, { id: 'button', qty: 2 }, { text: B('שישה חוטי גישור עם קצה נקבה, וארבעה רגילים', 'Six jumper wires with a female end, and four ordinary ones') }],
      wiring: [
        W(B('לוח הדרייבר, IN1', 'Driver board, IN1'), 'GP10', 14, null, 'IN1'),
        W(B('לוח הדרייבר, IN2', 'Driver board, IN2'), 'GP11', 15, null, 'IN2'),
        W(B('לוח הדרייבר, IN3', 'Driver board, IN3'), 'GP12', 16, null, 'IN3'),
        W(B('לוח הדרייבר, IN4', 'Driver board, IN4'), 'GP13', 17, null, 'IN4'),
        W(B('לוח הדרייבר, +', 'Driver board, +'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('לוח הדרייבר, −', 'Driver board, −'), 'GND', 38, null, 'GND'),
        W(B('כפתור ימני, רגל אחת', 'Right button, one leg'), 'GP14', 19, null, B('ימינה', 'Right')),
        W(B('כפתור שמאלי, רגל אחת', 'Left button, one leg'), 'GP15', 20, null, B('שמאלה', 'Left')),
        W(B('שני הכפתורים, הרגל שמולה', 'Both buttons, the opposite leg'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את התקע הלבן של המנוע ללוח הדרייבר הירוק. התקע נכנס רק בכיוון אחד. בציור, הקו הלבן שבין הלוח למנוע הוא הכבל הזה.', 'Plug the motor\'s white connector into the green driver board. It only fits one way round. In the picture, the white line between the board and the motor is this cable.'),
        B('חברו את ששת הפינים של לוח הדרייבר לפי הטבלה.', 'Connect the driver board\'s six pins following the table.'),
        B('הכניסו שני כפתורים למטריצה וחברו אותם: אחד לפין 19 (`GP14`), השני לפין 20 (`GP15`), ואת הרגל השנייה של שניהם לאדמה.', 'Push in two buttons and connect them: one to pin 19 (`GP14`), the other to pin 20 (`GP15`), and the second leg of both to ground.'),
        RAILS,
        B('הדביקו פיסת נייר דבק על ציר המנוע, כמו דגל, כדי לראות כמה הוא הסתובב.', 'Stick a piece of tape on the motor shaft, like a flag. This shows how far it has turned.'),
        PLUG, RUN,
        B('לחצו כמה פעמים על כל כפתור, ועקבו אחרי הדגל.', 'Press each button a few times, and watch the flag.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep, sleep_ms',
        '',
        'coils = [Pin(10, Pin.OUT), Pin(11, Pin.OUT), Pin(12, Pin.OUT), Pin(13, Pin.OUT)]',
        'right = Pin(14, Pin.IN, Pin.PULL_UP)',
        'left = Pin(15, Pin.IN, Pin.PULL_UP)',
        '',
        'SEQ = [(1, 0, 0, 0), (1, 1, 0, 0), (0, 1, 0, 0), (0, 1, 1, 0),',
        '       (0, 0, 1, 0), (0, 0, 1, 1), (0, 0, 0, 1), (1, 0, 0, 1)]',
        'STEPS_PER_TURN = 4096',
        'phase = 0',
        '',
        'def step(direction):',
        '    global phase',
        '    phase = (phase + direction) % 8',
        '    for i in range(4):',
        '        coils[i].value(SEQ[phase][i])',
        '    sleep_ms(2)',
        '',
        'def turn(degrees):',
        '    direction = 1 if degrees > 0 else -1',
        '    for i in range(abs(degrees) * STEPS_PER_TURN // 360):',
        '        step(direction)',
        '    for coil in coils:',
        '        coil.off()',
        '',
        'while True:',
        '    if right.value() == 0:',
        '        turn(90)',
        '    if left.value() == 0:',
        '        turn(-90)',
        '    sleep(0.02)'
      ],
      explain: [
        E([4], 'זו רשימה של ארבעה פינים, אחד לכל [[coil|סליל]] במנוע.', 'A list of four pins, one for each [[coil|coil]] in the motor.'),
        E([8, 9], 'אלה שמונה מצבים, לפי הסדר. כל מצב קובע אילו סלילים דולקים. בכל מעבר בין מצבים משתנה רק סליל אחד, והמנוע זז צעד קטן אחד.', 'Eight states, in order. Each state says which coils are on. At each change only one coil differs, and the motor moves one small step.'),
        E([10], 'זה מספר הצעדים בסיבוב שלם של הציר. במנוע הזה יש תמסורת פנימית, ולכן המספר גדול.', 'How many steps make one whole turn of the shaft. This motor has gears inside, which is why the number is large.'),
        E([11], 'המשתנה הזה שומר באיזה מצב, מתוך השמונה, אנחנו נמצאים עכשיו.', 'Which of the eight states we are in now.'),
        E([13, 15], 'זה צעד אחד: מתקדמים מצב אחד קדימה או אחורה. `% 8` חוזר להתחלה אחרי המצב האחרון, וגם כשיורדים מתחת לאפס.', 'One step. Moves one state forward or back. `% 8` wraps round to the start after the last state, and also when going below zero.'),
        E([16, 17], 'השורות האלה קובעות את ארבעת הפינים לפי המצב הנוכחי. `SEQ[phase][i]` הוא ערך אחד מתוך רשימה שנמצאת בתוך רשימה.', 'Sets the four pins from the current state. `SEQ[phase][i]` is one value from a list inside a list.'),
        E([18], 'נותנים למנוע זמן להגיע למצב החדש. אם ההמתנה קצרה מדי, הוא מזמזם ולא זז.', 'Gives the motor time to arrive. Too short, and it buzzes without moving.'),
        E([20, 23], 'כאן ממירים מעלות לצעדים: 90 מעלות הן רבע מ-4096, כלומר 1024 צעדים. הסימן קובע את הכיוון.', 'Converts degrees into steps: 90 degrees is a quarter of 4096, which is 1024 steps. The sign sets the direction.'),
        E([24, 25], 'בסוף מכבים את כל הסלילים. אחרת המנוע ממשיך לצרוך זרם ומתחמם גם כשהוא עומד.', 'Switches all coils off at the end. Otherwise the motor keeps drawing current and warms up even while standing still.')
      ],
      expect: B('לחיצה על הכפתור הימני: הדגל מסתובב רבע סיבוב בתוך שתי שניות, ונעצר. אחרי ארבע לחיצות הוא חוזר בדיוק לנקודת ההתחלה. הכפתור השמאלי מסובב אותו לכיוון השני.', 'A press of the right button: the flag turns a quarter turn in two seconds and stops. Four presses bring it back exactly to where it started. The left button turns it the other way.'),
      tasks: [
        { t: B('שנו את ההמתנה בשורה 18 ל-1, ואחר כך ל-5. מה קורה למהירות ולכוח של המנוע?', 'Change the wait on line 18 to 1, and then to 5. What happens to speed and to strength?'), hint: B('ב-1 המנוע כנראה מזמזם ולא מסתובב, כי הוא לא מספיק להגיע לפני הצעד הבא. ב-5 הוא איטי וחזק. מנוע צעד חזק כשהוא איטי.', 'At 1 the motor probably buzzes and does not turn: it cannot arrive before the next step. At 5 it is slow and strong. A stepper is strong when it is slow.') },
        { t: B('מחוג שניות: גרמו למנוע לזוז 6 מעלות בכל שנייה, כמו בשעון.', 'A seconds hand: make the motor move 6 degrees every second, like a clock.'), hint: B('בלולאה הראשית כתבו `turn(6)`, ואחריו `sleep` של קצת פחות משנייה, כי גם התנועה עצמה לוקחת זמן. 6 מעלות אינן מספר שלם של צעדים, ולכן השעון יסטה מעט. חשבו איך לתקן את זה.', 'In the main loop: `turn(6)` followed by a `sleep` of a little under a second, because the movement itself takes time. 6 degrees is not a whole number of steps, so the clock will drift a little. Think how to correct that.') },
        { t: B('הוסיפו פוטנציומטר, וגרמו למנוע לעקוב אחריו: כשמסובבים את הכפתור, המנוע פונה לאותה זווית.', 'Add a potentiometer, and have the motor follow it: turn the knob, and the motor points to the same angle.'), hint: B('שמרו במשתנה `position` כמה צעדים המנוע עשה מההתחלה. חשבו לפי הפוטנציומטר לאיזה צעד רוצים להגיע, ובצעו את ההפרש. המנוע לא יודע איפה הוא נמצא: רק התוכנית סופרת.', 'Keep in a variable `position` how many steps you have made since the start. Work out from the potentiometer which step you want to reach, and make the difference. The motor does not know where it is: only the program counts.') }
      ],
      quiz: [
        Q(B('איך התוכנית יודעת שהמנוע הסתובב בדיוק 90 מעלות?', 'How does the program know the motor turned exactly 90 degrees?'),
          [B('המנוע מדווח לה על הזווית', 'The motor reports its angle'), B('היא סופרת צעדים: 1024 צעדים הם רבע סיבוב', 'It counts steps: 1024 steps make a quarter turn'), B('היא מודדת זמן', 'It measures time')], 1,
          B('למנוע צעד אין חיישן. התוכנית רק סופרת, ואם משהו חוסם את הציר, הספירה כבר לא נכונה.', 'A stepper has no sensor. The program counts, and if something blocks the shaft, the count is no longer true.'))
      ]
    },

    /* ============================================================ E4 */
    {
      id: 'E4', track: 'E',
      title: B('ג\'ויסטיק שמכוון שני סרוואים', 'A joystick that aims two servos'),
      goal: B('מזיזים את הג\'ויסטיק, ושני מנועי סרבו פונים ימינה-שמאלה ולמעלה-למטה. זה הבסיס לצריח מצלמה או לזרוע.', 'Move the joystick, and two servos swing left-right and up-down. The basis of a camera turret or an arm.'),
      learn: [
        B('איך קוראים שתי כניסות [[analog|אנלוגיות]] בבת אחת.', 'To read two [[analog|analog]] inputs together.'),
        B('מה ההבדל בין שליטה במיקום לבין שליטה במהירות.', 'To tell position control from speed control.'),
        B('איך מזינים שני מנועים בלי להפיל את הלוח.', 'To power two motors without bringing the board down.')
      ],
      before: [PART('joystick', 'העמוד של הג\'ויסטיק', 'The joystick\'s page'), LESSON('B5'), LESSON('E2')],
      parts: [{ id: 'joystick', qty: 1 }, { id: 'servo', qty: 2 }, { text: B('חמישה חוטי גישור עם קצה נקבה, ושישה רגילים', 'Five jumper wires with a female end, and six ordinary ones') }],
      wiring: [
        W(B('ג\'ויסטיק, GND', 'Joystick, GND'), 'GND', 3, null, 'GND'),
        W(B('ג\'ויסטיק, +5V', 'Joystick, +5V'), '3V3', 36, B('ל-3.3V, לא ל-5V', 'to 3.3 V, not 5 V'), '3.3V'),
        W(B('ג\'ויסטיק, VRx', 'Joystick, VRx'), 'GP26', 31, B('ADC0', 'ADC0'), 'X'),
        W(B('ג\'ויסטיק, VRy', 'Joystick, VRy'), 'GP27', 32, B('ADC1', 'ADC1'), 'Y'),
        W(B('ג\'ויסטיק, SW', 'Joystick, SW'), 'GP22', 29, null, B('לחיצה', 'Press')),
        W(B('סרבו 1, חוט כתום', 'Servo 1, orange wire'), 'GP10', 14, null, B('סרבו 1', 'Servo 1')),
        W(B('סרבו 2, חוט כתום', 'Servo 2, orange wire'), 'GP11', 15, null, B('סרבו 2', 'Servo 2')),
        W(B('שני הסרוואים, חוט אדום', 'Both servos, red wire'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('שני הסרוואים, חוט חום', 'Both servos, brown wire'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את חמשת הפינים של הג\'ויסטיק לפי הטבלה. שימו לב: את הפין שמסומן `+5V` מחברים ל-3.3V.', 'Connect the joystick\'s five pins following the table. Note: the pin marked `+5V` goes to 3.3 V.'),
        B('חברו את שני הסרוואים: את החוט הכתום לפין האות, את האדום ל-5V ואת החום לאדמה.', 'Connect the two servos: orange to the signal pin, red to 5 V, brown to ground.'),
        RAILS,
        B('הדביקו בנייר דבק סרבו אחד על השני, כך שהראשון יסובב את השני. אפשר גם פשוט להניח אותם זה ליד זה.', 'Tape one servo onto the other, so the first swings the second. Or simply lay them side by side.'),
        PLUG, RUN,
        B('הטו את הג\'ויסטיק מעט, ואחר כך עד הסוף. שחררו אותו, ואז לחצו עליו.', 'Tilt the joystick a little, then all the way. Let go. Press it down.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, ADC',
        'from time import sleep',
        '',
        'pan = PWM(Pin(10), freq=50)',
        'tilt = PWM(Pin(11), freq=50)',
        'joy_x = ADC(26)',
        'joy_y = ADC(27)',
        'button = Pin(22, Pin.IN, Pin.PULL_UP)',
        '',
        'DEAD = 4000',
        'angles = [90, 90]',
        '',
        'def set_angle(servo, deg):',
        '    servo.duty_u16(1638 + deg * 6554 // 180)',
        '',
        'def nudge(index, raw):',
        '    offset = raw - 32768',
        '    if abs(offset) < DEAD:',
        '        return',
        '    angles[index] = angles[index] + offset / 32768 * 3',
        '    angles[index] = max(0, min(180, angles[index]))',
        '',
        'while True:',
        '    nudge(0, joy_x.read_u16())',
        '    nudge(1, joy_y.read_u16())',
        '    if button.value() == 0:',
        '        angles[0] = 90',
        '        angles[1] = 90',
        '    set_angle(pan, int(angles[0]))',
        '    set_angle(tilt, int(angles[1]))',
        '    sleep(0.02)'
      ],
      explain: [
        E([4, 5], 'אלה שני הסרוואים, ושניהם עובדים ב-50 מחזורים בשנייה.', 'Two servos, both at 50 cycles a second.'),
        E([6, 8], 'שני הצירים של הג\'ויסטיק הם בעצם שני פוטנציומטרים, והלחיצה עליו היא כפתור רגיל.', 'The joystick\'s two axes are two potentiometers. Pressing it down is an ordinary button.'),
        E([11], 'זו רשימה של שתי זוויות, אחת לכל סרבו. שתיהן מתחילות באמצע.', 'A list of two angles, one per servo. Both start in the middle.'),
        E([13, 14], 'הפונקציה הזו הופכת זווית לרוחב [[pulse|פולס]]: 1638 הוא 0 מעלות, ו-8192 הוא 180 מעלות.', 'Turns an angle into a [[pulse|pulse]] width: 1638 is 0 degrees, and 8192 is 180.'),
        E([16, 19], 'כאן מחשבים כמה רחוק הג\'ויסטיק מהאמצע. בתוך ה[[deadzone|אזור המת]] לא עושים כלום: `return` בלי ערך פשוט יוצא מהפונקציה.', 'How far the joystick is from the middle. Inside the [[deadzone|dead zone]] nothing is done: a bare `return` leaves the function.'),
        E([20], 'זה העיקר: לא קובעים את הזווית, אלא מוסיפים לה. ככל שמטים יותר, מוסיפים יותר, עד 3 מעלות בכל סיבוב של הלולאה. זו שליטה במהירות.', 'The heart of it: the angle is not set but added to. The harder you tilt the more is added, up to 3 degrees per turn of the loop. This is speed control.'),
        E([21], 'השורה הזו דואגת שהזווית תישאר בין 0 ל-180.', 'Keeps the angle between 0 and 180.'),
        E([26, 28], 'לחיצה על הג\'ויסטיק מחזירה את שני הסרוואים לאמצע.', 'Pressing the joystick returns both to the middle.'),
        E([29, 30], 'כאן שולחים את הזוויות לסרוואים. הזווית נשמרת כמספר עם שבר, ו-`int` מעגל אותה רק ברגע השליחה.', 'Sends to the servos. The angle is kept with a fraction, and `int` rounds it only at the moment of sending.')
      ],
      expect: B('הטיה קלה מזיזה את הסרבו לאט, והטיה מלאה מזיזה אותו מהר. כשמשחררים, הסרבו נשאר במקום שאליו הגיע. לחיצה מחזירה את שניהם לאמצע.', 'A slight tilt moves the servo slowly, and a full tilt quickly. Let go and the servo stays where it got to. A press returns both to the middle.'),
      tasks: [
        { t: B('עברו לשליטה במיקום: הסרבו פונה לכיוון שאליו הג\'ויסטיק מוטה, וחוזר לאמצע כשמשחררים. מה נוח יותר, ולמה?', 'Change to position control: the servo points where the joystick is tilted, and returns to the middle on release. Which is more comfortable, and why?'), hint: B('במקום להוסיף לזווית, קבעו אותה: `angles[index] = raw * 180 // 65535`. שליטה במיקום מהירה, אבל רועדת יחד עם היד. שליטה במהירות מדויקת יותר, והסרבו נשאר במקום.', 'Instead of adding, set: `angles[index] = raw * 180 // 65535`. Position control is quick but shakes with your hand. Speed control is more precise, and stays put.') },
        { t: B('ה-Pico מתנתק כששני הסרוואים זזים יחד? תקנו את הבעיה.', 'Does the Pico disconnect when both servos move together? Fix it.'), hint: B('זו [[brownout|נפילת מתח]]. הזינו את הסרוואים מבית של ארבע סוללות AA: חברו את הפלוס שלו לחוטים האדומים, ואת המינוס שלו לחוטים החומים וגם ל-GND של ה-Pico. נתקו את החוט שהולך ל-`VBUS`.', 'That is a [[brownout|brown-out]]. Power the servos from a holder of four AA batteries: its plus to the red wires, and its minus to the brown wires and also to the Pico\'s GND. The wire to `VBUS` is removed.') },
        { t: B('הקלטה והשמעה: לחיצה קצרה שומרת את המיקום הנוכחי ברשימה, ולחיצה ארוכה מריצה את כל המיקומים השמורים לפי הסדר.', 'Record and replay: a short press saves the current position in a list. A long press plays back all saved positions in order.'), hint: B('השתמשו ברשימה ריקה `saved = []`, וב-`saved.append((angles[0], angles[1]))`. כדי להבחין בין לחיצה קצרה לארוכה, מדדו בעזרת `ticks_ms` כמה זמן הכפתור היה לחוץ.', 'An empty list `saved = []`, and `saved.append((angles[0], angles[1]))`. To tell a short press from a long one, time with `ticks_ms` how long the button was held.') }
      ],
      quiz: [
        Q(B('מה קורה בתוכנית הזו כשמשחררים את הג\'ויסטיק?', 'In this program, what happens when the joystick is released?'),
          [B('הסרוואים חוזרים לאמצע', 'The servos return to the middle'), B('הסרוואים נשארים במקום שאליו הגיעו', 'The servos stay where they got to'), B('הסרוואים ממשיכים לזוז', 'The servos keep moving')], 1,
          B('הג\'ויסטיק קובע מהירות, ולא מיקום. כשהוא באמצע המהירות היא אפס, ולכן הזווית לא משתנה.', 'The joystick sets speed, not position. In the middle the speed is zero, so the angle does not change.'))
      ]
    },

    /* ============================================================ F1 */
    {
      id: 'F1', track: 'F',
      title: B('כל הצבעים מלד אחד', 'Every colour from one LED'),
      goal: B('מסובבים כפתור, ולד RGB עובר בין כל צבעי הקשת.', 'Turn a knob, and an RGB LED runs through every colour of the rainbow.'),
      learn: [
        B('איך מערבבים אדום, ירוק וכחול לכל צבע שרוצים, בעזרת שלושה ערוצי [[pwm|PWM]].', 'To mix red, green and blue into any colour, with three [[pwm|PWM]] channels.'),
        B('איך כותבים [[func|פונקציה]] שמחזירה שלושה ערכים בבת אחת.', 'To write a [[func|function]] that returns three values together.'),
        B('איך הופכים מספר אחד לצבע.', 'To turn a single number into a colour.')
      ],
      before: [PART('rgb', 'העמוד של לד RGB', 'The RGB LED\'s page'), BASICS('python2', 'יסודות: עוד פייתון', 'Basics: More Python', 'שם מוסבר `return`.', 'For `return`.'), LESSON('B2')],
      parts: [{ id: 'rgb', qty: 1 }, { id: 'pot', qty: 1 }, { text: B('שבעה חוטי גישור', 'Seven jumper wires') }],
      wiring: [
        W(B('לד RGB, R', 'RGB LED, R'), 'GP11', 15, null, B('אדום', 'Red')),
        W(B('לד RGB, G', 'RGB LED, G'), 'GP12', 16, null, B('ירוק', 'Green')),
        W(B('לד RGB, B', 'RGB LED, B'), 'GP13', 17, null, B('כחול', 'Blue')),
        W(B('לד RGB, −', 'RGB LED, −'), 'GND', 38, null, 'GND'),
        W(B('פוטנציומטר, רגל קיצונית', 'Potentiometer, outer leg'), '3V3', 36, null, '3.3V'),
        W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, B('ADC0', 'ADC0'), B('כפתור סיבוב', 'Knob')),
        W(B('פוטנציומטר, רגל קיצונית שנייה', 'Potentiometer, other outer leg'), 'GND', 38, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את מודול ה-RGB למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה.', 'Push in the RGB module and connect its four pins following the table.'),
        B('הכניסו את הפוטנציומטר למטריצה, וחברו את שלוש הרגליים שלו.', 'Push in the potentiometer and connect its three legs.'),
        RAILS, PLUG, RUN,
        B('סובבו את הפוטנציומטר לאט, מקצה אחד לקצה השני.', 'Turn the potentiometer slowly, from end to end.'),
        B('כסו את הלד בפיסת נייר לבן או בכדור פינג-פונג, וכך הצבעים יתערבבו הרבה יותר יפה.', 'Cover the LED with a piece of white paper or a ping-pong ball. The colours blend far better.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, ADC',
        'from time import sleep',
        '',
        'red = PWM(Pin(11), freq=1000)',
        'green = PWM(Pin(12), freq=1000)',
        'blue = PWM(Pin(13), freq=1000)',
        'knob = ADC(26)',
        '',
        'def wheel(pos):',
        '    # pos from 0 to 255: red -> green -> blue -> back to red',
        '    if pos < 85:',
        '        return 255 - pos * 3, pos * 3, 0',
        '    if pos < 170:',
        '        pos = pos - 85',
        '        return 0, 255 - pos * 3, pos * 3',
        '    pos = pos - 170',
        '    return pos * 3, 0, 255 - pos * 3',
        '',
        'def show(r, g, b):',
        '    red.duty_u16(r * 257)',
        '    green.duty_u16(g * 257)',
        '    blue.duty_u16(b * 257)',
        '',
        'while True:',
        '    pos = knob.read_u16() >> 8',
        '    r, g, b = wheel(pos)',
        '    show(r, g, b)',
        '    sleep(0.02)'
      ],
      explain: [
        E([4, 6], 'אלה שלושה פיני PWM, אחד לכל צבע שבתוך הלד.', 'Three PWM pins, one for each colour inside the LED.'),
        E([9], 'זו פונקציה שמקבלת מקום על גלגל הצבעים: מספר בין 0 ל-255.', 'A function that takes a position on the colour wheel, a number from 0 to 255.'),
        E([11, 12], 'בשליש הראשון האדום יורד והירוק עולה. הפונקציה מחזירה שלושה מספרים שמופרדים בפסיקים.', 'The first third: red falls and green rises. The function returns three numbers, separated by commas.'),
        E([13, 15], 'בשליש השני הירוק יורד והכחול עולה.', 'The second third: green falls and blue rises.'),
        E([16, 17], 'בשליש האחרון הכחול יורד והאדום חוזר.', 'The last third: blue falls and red returns.'),
        E([19, 22], 'מקובל לכתוב צבע כשלושה מספרים בין 0 ל-255. PWM מצפה לערך בין 0 ל-65535, והכפלה ב-257 ממירה בדיוק מטווח אחד לשני.', 'A colour is usually written as three numbers from 0 to 255. PWM wants 0 to 65535, and multiplying by 257 converts exactly.'),
        E([25], '`>> 8` מזיז את המספר שמונה [[bit|ביטים]] ימינה, כלומר מחלק אותו ב-256. כך הטווח 0 עד 65535 הופך ל-0 עד 255.', '`>> 8` shifts the number eight [[bit|bits]] to the right, which divides by 256. So 0 to 65535 becomes 0 to 255.'),
        E([26], 'השורה הזו מכניסה את שלושת הערכים לשלושה משתנים בבת אחת.', 'Receives the three values into three variables at once.')
      ],
      expect: B('בקצה אחד של הפוטנציומטר הלד אדום. כשמסובבים, הוא עובר לצהוב, לירוק, לתכלת, לכחול ולסגול, וחוזר לאדום בקצה השני.', 'At one end of the potentiometer the LED is red. As you turn it passes through yellow, green, cyan, blue, purple, and back to red at the other end.'),
      tasks: [
        { t: B('הלד מאיר בצבעים הפוכים, או נכבה כשהוא אמור להאיר בלבן? תקנו את זה.', 'Does the LED show inverted colours, or go dark when it should be white? Fix it.'), hint: B('יש לדי RGB שהרגל המשותפת שלהם חיובית. חברו את הרגל המשותפת ל-3.3V במקום לאדמה, ובפונקציה `show` כתבו `65535 - r * 257`, וכך גם לשני הצבעים האחרים.', 'Some RGB LEDs have a positive common leg. The common leg goes to 3.3 V instead of ground, and in `show` you write `65535 - r * 257`, and likewise for the other two.') },
        { t: B('בלי פוטנציומטר: גרמו ללד לעבור מעצמו בין כל הצבעים, שוב ושוב, בתוך עשר שניות.', 'Without the potentiometer: have the LED run through all the colours by itself, over and over, within ten seconds.'), hint: B('צרו משתנה `pos` שעולה ב-1 בכל סיבוב של הלולאה, עם `% 256`. ההמתנה צריכה להיות 10 שניות חלקי 256.', 'A variable `pos` that rises by 1 on each turn, with `% 256`. The wait: 10 seconds divided by 256.'),
          code: ['pos = 0', 'while True:', '    r, g, b = wheel(pos)', '    show(r, g, b)', '    pos = (pos + 1) % 256', '    sleep(0.04)'] },
        { t: B('מדחום צבעוני: כחול כשקר, ירוק כשנעים ואדום כשחם. השתמשו בחיישן הטמפרטורה שבתוך ה-Pico.', 'A colour thermometer: blue when cold, green when pleasant, red when hot. Use the temperature sensor inside the Pico.'), hint: B('`ADC(4)` קורא את החיישן הפנימי. המתח הוא `read_u16() * 3.3 / 65535`, והטמפרטורה היא `27 - (volts - 0.706) / 0.001721`. מפו את הטווח 15 עד 35 מעלות למקום על הגלגל, מ-170 (כחול) ועד 0 (אדום).', '`ADC(4)` reads the internal sensor. The voltage is `read_u16() * 3.3 / 65535`, and the temperature is `27 - (volts - 0.706) / 0.001721`. Map 15 to 35 degrees onto a wheel position, from 170 (blue) down to 0 (red).') }
      ],
      quiz: [
        Q(B('איזה צבע מתקבל מהפקודה `show(255, 255, 0)`?', 'What colour does `show(255, 255, 0)` give?'),
          [B('לבן', 'White'), B('צהוב', 'Yellow'), B('סגול', 'Purple')], 1,
          B('אדום וירוק יחד, בלי כחול, נראים לעין כצהוב. שלושת הצבעים יחד נותנים לבן.', 'Red and green together, with no blue, look yellow to the eye. All three together give white.'))
      ]
    },

    /* ============================================================ F2 */
    {
      id: 'F2', track: 'F',
      title: B('פס לדים עם אנימציות', 'An LED strip with animations'),
      goal: B('שמונה לדים צבעוניים שמחוברים לפין אחד. כפתור מחליף בין נקודה רצה, קשת בתנועה ומצב כבוי.', 'Eight coloured LEDs on one pin. A button switches between a running dot, a moving rainbow and off.'),
      learn: [
        B('איך שולטים בהרבה לדים דרך פין אחד.', 'To control many LEDs through one pin.'),
        B('איך בונים אנימציה: מונה של פריימים, ולולאה שמציירת כל פריים.', 'To build an animation: a frame counter, and a loop that draws each frame.'),
        B('איך מחשבים את צריכת הזרם לפני שמדליקים.', 'To work out current draw before switching on.')
      ],
      before: [PART('neopixel', 'העמוד של פס הלדים', 'The LED strip\'s page'), LESSON('F1')],
      parts: [{ id: 'neopixel', qty: 1, note: B('של 8 לדים', 'of 8 LEDs') }, { id: 'button', qty: 1 }, { text: B('חמישה חוטי גישור', 'Five jumper wires') }],
      wiring: [
        W(B('פס לדים, 5V', 'LED strip, 5V'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('פס לדים, DIN', 'LED strip, DIN'), 'GP0', 1, B('הקצה שממנו יוצא החץ', 'the end the arrow leaves from'), B('נתונים', 'Data')),
        W(B('פס לדים, GND', 'LED strip, GND'), 'GND', 3, null, 'GND'),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('כפתור, הרגל שמולה', 'Button, the opposite leg'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את שלושת החוטים של הפס לפי הטבלה. התחברו לקצה שמסומן `DIN`, ולא לקצה `DOUT`.', 'Connect the strip\'s three wires following the table. Connect to the end marked `DIN`, not `DOUT`.'),
        B('חברו את הכפתור: רגל אחת לפין 19 (`GP14`), והרגל שמולה לאדמה.', 'Connect the button: one leg to pin 19 (`GP14`), and the opposite leg to ground.'),
        RAILS, PLUG, RUN,
        B('לחצו כמה פעמים על הכפתור.', 'Press the button a few times.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from neopixel import NeoPixel',
        'from time import sleep',
        '',
        'N = 8',
        'strip = NeoPixel(Pin(0), N)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'def wheel(pos):',
        '    if pos < 85:',
        '        return (255 - pos * 3) // 8, pos * 3 // 8, 0',
        '    if pos < 170:',
        '        pos = pos - 85',
        '        return 0, (255 - pos * 3) // 8, pos * 3 // 8',
        '    pos = pos - 170',
        '    return pos * 3 // 8, 0, (255 - pos * 3) // 8',
        '',
        'mode = 0',
        'frame = 0',
        'last = 1',
        '',
        'while True:',
        '    now = button.value()',
        '    if last == 1 and now == 0:',
        '        mode = (mode + 1) % 3',
        '    last = now',
        '',
        '    for i in range(N):',
        '        if mode == 0:',
        '            strip[i] = (30, 0, 0) if i == frame % N else (0, 0, 0)',
        '        elif mode == 1:',
        '            strip[i] = wheel((i * 256 // N + frame * 8) % 256)',
        '        else:',
        '            strip[i] = (0, 0, 0)',
        '    strip.write()',
        '    frame = frame + 1',
        '    sleep(0.05)'
      ],
      explain: [
        E([2], 'הספרייה `neopixel` כלולה ב-MicroPython, ולכן אין צורך להתקין שום דבר.', 'The `neopixel` library is included in MicroPython. There is nothing to install.'),
        E([5, 6], 'זה פס של 8 לדים שמחובר ל-GP0. כדי להתאים את התוכנית לפס באורך אחר, מספיק לשנות את `N`.', 'A strip of 8 LEDs on GP0. Changing `N` is all it takes to suit a strip of another length.'),
        E([9, 16], 'זה גלגל הצבעים משיעור F1, עם חילוק ב-8. הלדים האלה חזקים מאוד, ושמינית מהעוצמה המלאה מספיקה בהחלט.', 'The colour wheel from lesson F1, divided by 8. These LEDs are very bright, and an eighth of full strength is plenty.'),
        E([18, 20], 'המשתנים האלה שומרים איזו אנימציה פעילה, כמה פריימים עברו, ומה היה מצב הכפתור.', 'Which animation is active, how many frames have passed, and what the button read.'),
        E([24, 25], 'לחיצה עוברת לאנימציה הבאה. `% 3` חוזר ל-0 אחרי 2.', 'A press moves to the next animation. `% 3` goes back to 0 after 2.'),
        E([28], 'הלולאה עוברת על כל הלדים, וקובעת לכל אחד מהם צבע לפריים הזה.', 'Walks through all the LEDs, giving each a colour for this frame.'),
        E([30], 'נקודה רצה: נדלק רק הלד שהמספר שלו שווה לפריים הנוכחי. `frame % N` חוזר להתחלה כשמגיעים לסוף הפס.', 'A running dot: only the LED whose number equals the current frame lights. `frame % N` wraps to the start at the end of the strip.'),
        E([32], 'קשת: כל לד מקבל מקום אחר על הגלגל, והוספת הפריים מזיזה את כל הקשת קדימה.', 'A rainbow: each LED gets a different position on the wheel. Adding the frame moves the whole rainbow along.'),
        E([35], 'עד השורה הזו שום דבר לא השתנה על הפס. `write` שולח אליו את כל הצבעים בבת אחת.', 'Up to this line nothing has changed on the strip. `write` sends all the colours at once.')
      ],
      expect: B('נקודה אדומה רצה לאורך הפס. אחרי לחיצה מופיעה קשת שזזה. אחרי לחיצה נוספת הכול כבוי, ובלחיצה השלישית חוזרים לנקודה.', 'A red dot runs along the strip. A press: a moving rainbow. Another press: everything off. A third press: back to the dot.'),
      tasks: [
        { t: B('חשבו: כמה זרם צורך הפס אם כל שמונת הלדים דולקים בלבן מלא? האם ה-USB מספיק? ומה לגבי פס של 60 לדים?', 'Work it out: how much current does the strip draw if all eight LEDs are at full white? Is USB enough? And a strip of 60 LEDs?'), hint: B('כל לד צורך עד 60mA בלבן מלא. שמונה לדים צורכים 480mA, וזה בגבול של USB. 60 לדים צורכים 3.6A, פי שבעה ממה ש-USB נותן. פס ארוך צריך ספק 5V משלו, עם [[commonground|אדמה משותפת]]. חילוק העוצמה ב-8 מקטין גם את הזרם פי 8.', 'Each LED draws up to 60 mA at full white. Eight LEDs: 480 mA, at the edge of USB. 60 LEDs: 3.6 A, seven times what USB gives. A long strip needs a 5 V supply of its own, with a [[commonground|common ground]]. Dividing the brightness by 8 cuts the current by 8 too.') },
        { t: B('הוסיפו לנקודה הרצה זנב: הלד שמאחוריה מאיר חלש, והלד שאחריו מאיר חלש עוד יותר.', 'Give the running dot a tail: the LED behind it glows dimly, and the one behind that dimmer still.'), hint: B('חשבו לכל לד את המרחק שלו מהנקודה: `d = (frame - i) % N`. לד במרחק 0 מקבל 30, במרחק 1 מקבל 8, במרחק 2 מקבל 2, וכל השאר מקבלים 0. [[list|רשימה]] `[30, 8, 2]` מקצרת את הקוד.', 'For each LED work out its distance from the dot: `d = (frame - i) % N`. Distance 0 gets 30, distance 1 gets 8, distance 2 gets 2, and the rest 0. A [[list|list]] `[30, 8, 2]` keeps this short.'),
          code: ['TAIL = [30, 8, 2]', '', '            d = (frame - i) % N', '            strip[i] = (TAIL[d], 0, 0) if d < len(TAIL) else (0, 0, 0)'] },
        { t: B('מד מרחק: חברו את חיישן המרחק משיעור C1, והדליקו יותר לדים ככל שהחפץ קרוב יותר: ירוק כשהוא רחוק, ואדום כשהוא קרוב.', 'A distance gauge: connect the distance sensor from lesson C1, and light more LEDs the closer the object is. Green when far, red when near.'), hint: B('המירו מרחק של 5 עד 45 סנטימטר למספר לדים בין 8 ל-0. בלולאה, לד `i` נדלק אם `i` קטן ממספר הלדים.', 'Turn a distance of 5 to 45 centimetres into a number of LEDs from 8 to 0. In the loop: LED `i` lights if `i` is less than the number of LEDs.') }
      ],
      quiz: [
        Q(B('שיניתם צבע בעזרת `strip[3] = (0, 30, 0)`, אבל הלד לא השתנה. מה חסר?', 'You changed a colour with `strip[3] = (0, 30, 0)` and the LED did not change. What is missing?'),
          [B('`strip.write()`', '`strip.write()`'), B('`sleep(1)`', '`sleep(1)`'), B('נגד', 'A resistor')], 0,
          B('ההשמה משנה רק את הזיכרון של ה-Pico. `write` היא הפקודה ששולחת את הצבעים לפס.', 'The assignment changes only the Pico\'s memory. `write` is what sends the colours to the strip.'))
      ]
    },

    /* ============================================================ F3 */
    {
      id: 'F3', track: 'F',
      title: B('מנעול קוד עם לוח מקשים', 'A code lock with a keypad'),
      goal: B('מקלידים קוד של ארבע ספרות. קוד נכון מדליק לד, וקוד שגוי משמיע צליל נמוך.', 'Type a four-digit code. The right code lights an LED, a wrong one sounds a low tone.'),
      learn: [
        B('איך קוראים 16 מקשים בעזרת שמונה פינים בלבד, בשיטת סריקה.', 'To read 16 keys with only eight pins, by scanning.'),
        B('איך אוספים תווים ל[[variable|משתנה]] של טקסט, ואיך משווים אותו.', 'To gather characters into a text [[variable|variable]] and compare it.'),
        B('איך מחכים ללחיצה ולשחרור, כדי שמקש אחד לא ייקרא פעמיים.', 'To wait for press and release, so one key is not read twice.')
      ],
      before: [PART('keypad', 'העמוד של לוח המקשים', 'The keypad\'s page'), BASICS('python2', 'יסודות: עוד פייתון', 'Basics: More Python', 'שם מוסברים רשימות וטקסט.', 'For lists and text.'), LESSON('B4')],
      parts: [{ id: 'keypad', qty: 1 }, { id: 'led', qty: 1 }, { id: 'buzzer', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }, { text: B('11 חוטי גישור', '11 jumper wires') }],
      wiring: [
        W(B('לוח מקשים, R1', 'Keypad, R1'), 'GP2', 4, B('שורה 1', 'row 1'), 'R1'),
        W(B('לוח מקשים, R2', 'Keypad, R2'), 'GP3', 5, null, 'R2'),
        W(B('לוח מקשים, R3', 'Keypad, R3'), 'GP4', 6, null, 'R3'),
        W(B('לוח מקשים, R4', 'Keypad, R4'), 'GP5', 7, null, 'R4'),
        W(B('לוח מקשים, C1', 'Keypad, C1'), 'GP6', 9, B('עמודה 1', 'column 1'), 'C1'),
        W(B('לוח מקשים, C2', 'Keypad, C2'), 'GP7', 10, null, 'C2'),
        W(B('לוח מקשים, C3', 'Keypad, C3'), 'GP8', 11, null, 'C3'),
        W(B('לוח מקשים, C4', 'Keypad, C4'), 'GP9', 12, null, 'C4'),
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('באזר, +', 'Buzzer, +'), 'GP13', 17, null, B('באזר', 'Buzzer')),
        W(B('לד, רגל קצרה + באזר, −', 'LED short leg + buzzer −'), 'GND', 3, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את שמונת החוטים של לוח המקשים לפי הסדר: כשהמקשים פונים אליכם, החוט השמאלי ביותר הוא `R1`.', 'Connect the keypad\'s eight wires, in order: with the keys facing you, the leftmost wire is `R1`.'),
        B('חברו את הלד דרך נגד לפין 20 (`GP15`), ואת הבאזר לפין 17 (`GP13`).', 'Connect the LED through a resistor to pin 20 (`GP15`), and the buzzer to pin 17 (`GP13`).'),
        RAILS, PLUG, RUN,
        B('הקלידו 2580 ואחריו `#`. אחר כך נסו להקליד קוד אחר.', 'Type 2580 followed by `#`. Then try a different code.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM',
        'from time import sleep',
        '',
        'KEYS = ["123A", "456B", "789C", "*0#D"]',
        'rows = [Pin(n, Pin.OUT, value=1) for n in (2, 3, 4, 5)]',
        'cols = [Pin(n, Pin.IN, Pin.PULL_UP) for n in (6, 7, 8, 9)]',
        'led = Pin(15, Pin.OUT)',
        'buzzer = PWM(Pin(13))',
        '',
        'SECRET = "2580"',
        '',
        'def beep(freq, seconds):',
        '    buzzer.freq(freq)',
        '    buzzer.duty_u16(32768)',
        '    sleep(seconds)',
        '    buzzer.duty_u16(0)',
        '',
        'def read_key():',
        '    for r in range(4):',
        '        rows[r].off()',
        '        for c in range(4):',
        '            if cols[c].value() == 0:',
        '                rows[r].on()',
        '                return KEYS[r][c]',
        '        rows[r].on()',
        '    return None',
        '',
        'def wait_key():',
        '    while read_key() is not None:',
        '        sleep(0.02)',
        '    while True:',
        '        key = read_key()',
        '        if key is not None:',
        '            return key',
        '        sleep(0.02)',
        '',
        'typed = ""',
        'while True:',
        '    key = wait_key()',
        '    beep(1500, 0.05)',
        '    if key == "*":',
        '        typed = ""',
        '    elif key == "#":',
        '        if typed == SECRET:',
        '            print("open")',
        '            led.on()',
        '            sleep(3)',
        '            led.off()',
        '        else:',
        '            print("wrong code")',
        '            beep(200, 0.6)',
        '        typed = ""',
        '    else:',
        '        typed = typed + key',
        '        print("*" * len(typed))'
      ],
      explain: [
        E([4], 'זו מפת המקשים: ארבע שורות של טקסט, עם ארבעה תווים בכל אחת. `KEYS[1][2]` הוא התו השלישי בשורה השנייה, כלומר 6.', 'The key map: four rows of text, four characters in each. `KEYS[1][2]` is the third character of the second row: 6.'),
        E([5], 'זו דרך קצרה לבנות [[list|רשימה]]: "פין יציאה לכל `n` מתוך 2, 3, 4, 5". כל השורות מתחילות במצב 1.', 'A short way to build a [[list|list]]: "an output pin for each `n` out of 2, 3, 4, 5". All the rows start at 1.'),
        E([6], 'ארבע העמודות הן כניסות עם [[pullup|נגד משיכה]], בדיוק כמו ארבעה כפתורים.', 'The four columns are inputs with a [[pullup|pull-up]], like four buttons.'),
        E([12, 16], 'הפונקציה הזו משמיעה צפצוף בגובה ובאורך שבוחרים.', 'A beep of a chosen pitch and length.'),
        E([18, 20], 'זו הסריקה: מורידים שורה אחת ל-0, וכל השאר נשארות ב-1.', 'The scan: one row is taken to 0, and all the others stay at 1.'),
        E([21, 24], 'כאן בודקים את ארבע העמודות. אם עמודה קוראת 0, המקש שנמצא בהצטלבות לחוץ. אז מחזירים את השורה ל-1, ומחזירים את התו המתאים מהמפה.', 'Checks the four columns. If a column reads 0, the key at the crossing is pressed. The row is put back to 1, and the character from the map is returned.'),
        E([25, 26], 'אם אף מקש בשורה הזו לא לחוץ, ממשיכים לשורה הבאה. אם לא לחוץ אף מקש בכלל, מחזירים `None`.', 'No key on this row. On to the next. If no key is pressed at all, `None` is returned.'),
        E([29, 30], 'קודם מחכים שהמקש הקודם ישוחרר.', 'First waits for the previous key to be released.'),
        E([31, 35], 'אחר כך מחכים למקש חדש, ומחזירים אותו.', 'Then waits for a new key, and returns it.'),
        E([41, 42], 'הכוכבית מוחקת את מה שהוקלד עד עכשיו.', 'The star erases what has been typed.'),
        E([43, 52], 'הסולמית היא "אישור": משווים את מה שהוקלד לקוד הסודי. בכל מקרה, אחר כך מוחקים את מה שהוקלד.', 'The hash is "enter": what was typed is compared with the code. Either way it is erased afterwards.'),
        E([54, 55], 'כל מקש אחר מתווסף לסוף הטקסט. מדפיסים כוכביות לפי מספר התווים, כדי לא לחשוף את הקוד.', 'Any other key is joined to the end of the text. Stars are printed to match the number of characters, so the code is not revealed.')
      ],
      expect: B('כל מקש משמיע צפצוף קצר ומוסיף כוכבית להדפסה. אחרי 2580 ו-`#` הלד נדלק לשלוש שניות. כל קוד אחר משמיע צליל נמוך וארוך.', 'Each key sounds a short beep and adds a star to the print-out. 2580 followed by `#`: the LED lights for three seconds. Any other code: a long low tone.'),
      tasks: [
        { t: B('נעילה: אחרי שלושה קודים שגויים ברצף, המנעול לא מגיב במשך 30 שניות.', 'Lock-out: after three wrong codes in a row, the lock does not respond for 30 seconds.'), hint: B('צרו משתנה `wrong` שעולה ב-1 בכל קוד שגוי, ומתאפס כשמקלידים קוד נכון. כשהוא מגיע ל-3, השמיעו צפצוף ארוך, הפעילו `sleep(30)`, ואפסו אותו.', 'A variable `wrong` that rises by 1 on each wrong code and resets on a right one. When it reaches 3: a long beep, `sleep(30)`, and a reset.') },
        { t: B('שינוי הקוד מהמקשים: לחיצה על `A` אחרי קוד נכון מאפשרת להקליד קוד חדש.', 'Changing the code from the keys: the `A` key after a right code lets a new code be typed.'), hint: B('`SECRET` הוא משתנה רגיל, ואפשר לשנות אותו. אחרי קוד נכון, אם המקש הבא הוא `A`, אספו ספרות עד `#` ושמרו אותן ב-`SECRET`. הקוד החדש נשכח כשמנתקים את החשמל. בשיעור G2 תלמדו איך שומרים ב[[file|קובץ]].', '`SECRET` is an ordinary variable, and can be changed. After a right code, if the next key is `A`, gather digits until `#` and store them in `SECRET`. The new code is forgotten when power is removed. Lesson G2 teaches saving to a [[file|file]].') },
        { t: B('החליפו את הלד בסרבו שמסובב בריח, או בממסר משיעור E1.', 'Replace the LED with a servo that turns a bolt, or with the relay from lesson E1.'), hint: B('בסרבו, 0 מעלות הן "נעול" ו-90 מעלות הן "פתוח". הקוד של `set_angle` נמצא בשיעור E4.', 'A servo: 0 degrees locked, 90 degrees open. The code for `set_angle` is in lesson E4.') }
      ],
      quiz: [
        Q(B('למה מורידים ל-0 רק שורה אחת בכל פעם?', 'Why is only one row taken to 0 at a time?'),
          [B('כדי לחסוך בחשמל', 'To save electricity'), B('כדי לדעת באיזו שורה נמצא המקש הלחוץ', 'To know which row the pressed key is on'), B('כי ה-Pico לא יכול להוריד שתי שורות בבת אחת', 'Because the Pico cannot lower two rows together')], 1,
          B('עמודה שקוראת 0 מגלה רק באיזו עמודה נמצא המקש. השורה שהורדנו באותו רגע משלימה את התשובה.', 'A column reading 0 tells only which column the key is in. The row lowered at that moment completes the answer.'))
      ]
    },

    /* ============================================================ F4 */
    {
      id: 'F4', track: 'F',
      title: B('תפריט על מסך עם כפתור סיבוב', 'A menu on a display with a rotary knob'),
      goal: B('מסובבים כדי לבחור שורה בתפריט, ולוחצים כדי להפעיל אותה, כמו במדפסת או במיקרוגל.', 'Turn to pick a line on the menu, and press to run it. As on a printer or a microwave.'),
      learn: [
        B('איך קוראים מקודד סיבובי בעזרת [[interrupt|פסיקה]], בלי לפספס אף קליק.', 'To read a rotary encoder with an [[interrupt|interrupt]], missing no click.'),
        B('איך בונים תפריט מ[[list|רשימה]], ואיך מציירים אותו על המסך.', 'To build a menu from a [[list|list]], and draw it on the display.'),
        B('איך מציירים מחדש רק כשמשהו השתנה.', 'To redraw only when something has changed.')
      ],
      before: [
        BASICS('interrupts', 'יסודות: פסיקות וטיימרים', 'Basics: Interrupts and timers', 'חובה לקרוא לפני השיעור הזה.', 'Required before this lesson.'),
        PART('encoder', 'העמוד של המקודד הסיבובי', 'The rotary encoder\'s page'),
        LESSON('C3')
      ],
      parts: [{ id: 'encoder', qty: 1 }, { id: 'oled', qty: 1 }, { text: B('תשעה חוטי גישור', 'Nine jumper wires') }],
      wiring: [
        W(B('מקודד, CLK', 'Encoder, CLK'), 'GP10', 14, null, 'CLK'),
        W(B('מקודד, DT', 'Encoder, DT'), 'GP11', 15, null, 'DT'),
        W(B('מקודד, SW', 'Encoder, SW'), 'GP12', 16, null, B('לחיצה', 'Press')),
        W(B('מקודד, + ומסך, VCC', 'Encoder + and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('מקודד, GND ומסך, GND', 'Encoder GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('מסך, SDA', 'Display, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('מסך, SCL', 'Display, SCL'), 'GP5', 7, null, 'SCL')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את המקודד למטריצה, וחברו את חמשת הפינים שלו לפי הטבלה.', 'Push in the encoder and connect its five pins following the table.'),
        B('הכניסו את המסך למטריצה, וחברו אותו כמו בשיעור C3. הספרייה `ssd1306` כבר מותקנת מאותו שיעור.', 'Push in the display and connect it as in lesson C3. The `ssd1306` library is already installed from that lesson.'),
        RAILS, PLUG, RUN,
        B('סובבו את המקודד קליק אחר קליק, לשני הכיוונים. לחצו עליו כשהחץ נמצא על כל אחת מהשורות.', 'Turn the encoder click by click, both ways. Press it on each of the lines.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep, ticks_ms, ticks_diff',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        'clk = Pin(10, Pin.IN, Pin.PULL_UP)',
        'dt = Pin(11, Pin.IN, Pin.PULL_UP)',
        'sw = Pin(12, Pin.IN, Pin.PULL_UP)',
        'led = Pin("LED", Pin.OUT)',
        '',
        'ITEMS = ["LED on", "LED off", "Blink 3x", "About"]',
        'position = 0',
        'last_turn = 0',
        '',
        'def turned(pin):',
        '    global position, last_turn',
        '    now = ticks_ms()',
        '    if ticks_diff(now, last_turn) < 5:',
        '        return',
        '    last_turn = now',
        '    if dt.value() == 1:',
        '        position = position + 1',
        '    else:',
        '        position = position - 1',
        '',
        'clk.irq(trigger=Pin.IRQ_FALLING, handler=turned)',
        '',
        'def draw(selected):',
        '    oled.fill(0)',
        '    for i in range(len(ITEMS)):',
        '        mark = ">" if i == selected else " "',
        '        oled.text(mark + ITEMS[i], 0, i * 14)',
        '    oled.show()',
        '',
        'def run(choice):',
        '    if choice == 0:',
        '        led.on()',
        '    elif choice == 1:',
        '        led.off()',
        '    elif choice == 2:',
        '        for i in range(6):',
        '            led.toggle()',
        '            sleep(0.2)',
        '    else:',
        '        oled.fill(0)',
        '        oled.text("Pico 2 menu", 0, 24)',
        '        oled.show()',
        '        sleep(2)',
        '',
        'shown = -1',
        'while True:',
        '    selected = position % len(ITEMS)',
        '    if selected != shown:',
        '        draw(selected)',
        '        shown = selected',
        '    if sw.value() == 0:',
        '        run(selected)',
        '        shown = -1',
        '        sleep(0.3)',
        '    sleep(0.02)'
      ],
      explain: [
        E([7, 9], 'אלה שלושת הפינים של המקודד: שניים לסיבוב, ואחד ללחיצה.', 'The encoder\'s three pins: two for turning and one for the press.'),
        E([12], 'התפריט הוא רשימה של טקסטים. כדי להוסיף שורה לתפריט, מוסיפים כאן טקסט.', 'The menu is a list of texts. To add a line, add a text here.'),
        E([13, 14], 'המשתנים האלה שומרים כמה קליקים סובבו מההתחלה, ומתי היה הקליק האחרון.', 'How many clicks have been turned since the start, and when the last click was.'),
        E([16, 21], 'זו הפונקציה שהפסיקה מפעילה. היא מתעלמת מפסיקה שמגיעה פחות מ-5 אלפיות שנייה אחרי הקודמת, כי זה [[bounce|ריטוט]].', 'The function the interrupt runs. It ignores an interrupt arriving less than 5 milliseconds after the last: that is [[bounce|bounce]].'),
        E([22, 25], 'ברגע ש-CLK יורד, בודקים את DT: הוא 1 כשמסובבים לכיוון אחד, ו-0 כשמסובבים לכיוון השני.', 'At the moment CLK falls, DT is looked at. It is 1 when turning one way, and 0 when turning the other.'),
        E([27], 'השורה הזו מחברת את הפונקציה ל-CLK. מעכשיו אף קליק לא הולך לאיבוד, גם כשהתוכנית עסוקה בציור.', 'Attaches the function to CLK. From now on no click is lost, even while the program is busy drawing.'),
        E([29, 34], 'כאן מציירים את התפריט: שורה לכל פריט, 14 נקודות בין שורה לשורה, וחץ ליד הפריט הנבחר.', 'Draws the menu: a line for each item, 14 dots between lines, and an arrow next to the chosen item.'),
        E([36, 49], 'כאן נקבע מה עושה כל פריט. המספר הוא המקום של הפריט ברשימה.', 'What each item does. The number is its position in the list.'),
        E([53], '`%` הופך את מונה הקליקים, שיכול להיות גם 17 או מינוס 3, למקום בין 0 ל-3. כך התפריט חוזר על עצמו במעגל.', '`%` turns the click counter, which may be 17 or minus 3, into a position from 0 to 3. So the menu goes round in a circle.'),
        E([54, 56], 'מציירים רק אם הבחירה השתנתה. ציור המסך איטי, ואין טעם לחזור עליו 50 פעמים בשנייה.', 'Draws only if the choice has changed. Drawing the display is slow, and there is no point repeating it 50 times a second.'),
        E([57, 60], 'לחיצה מפעילה את הפריט. `shown = -1` גורם לכך שהתפריט יצויר מחדש אחרי הפעולה.', 'A press runs the item. `shown = -1` forces the menu to be redrawn after the action.')
      ],
      expect: B('על המסך מופיעות ארבע שורות וחץ. כל קליק מזיז את החץ שורה אחת, ובסוף הרשימה הוא חוזר להתחלה. לחיצה על "LED on" מדליקה את הלד שעל ה-Pico.', 'The display shows four lines and an arrow. Each click moves the arrow one line, and at the end of the list it goes back to the start. Pressing on "LED on" lights the LED on the Pico.'),
      tasks: [
        { t: B('החץ זז בכיוון ההפוך לכיוון הסיבוב? תקנו את זה בלי להחליף חוטים.', 'Does the arrow move opposite to the way you turn? Fix it without swapping wires.'), hint: B('החליפו בין `+ 1` ל-`- 1` בפונקציה `turned`.', 'Swap `+ 1` and `- 1` in the `turned` function.') },
        { t: B('הוסיפו פריט "Brightness" שמאפשר לכוון ערך: אחרי לחיצה, הסיבוב משנה מספר בין 0 ל-100, ולחיצה נוספת מחזירה לתפריט.', 'Add a "Brightness" item that lets a value be set: after a press, turning changes a number from 0 to 100, and another press returns to the menu.'), hint: B('בתוך `run` כתבו לולאה שרצה עד הלחיצה הבאה. שמרו את `position` בכניסה ללולאה, והערך יהיה ההפרש ממנו. הציגו את המספר על המסך. חכו שהכפתור ישוחרר לפני שנכנסים ללולאה.', 'Inside `run`: a loop that runs until a press. Remember `position` on entry, and the value is the difference from it. Show the number on the display. Wait for the button to be released before entering the loop.') },
        { t: B('תפריט של שבע שורות לא נכנס במסך. גרמו לו לגלול.', 'A menu of seven lines does not fit on the display. Make it scroll.'), hint: B('ציירו רק ארבעה פריטים, החל מ-`top`. אם הפריט הנבחר קטן מ-`top`, קבעו `top = selected`. אם הוא גדול מ-`top + 3`, קבעו `top = selected - 3`.', 'Draw only four items, starting at `top`. If the chosen one is less than `top`, set `top = selected`. If it is greater than `top + 3`, set `top = selected - 3`.') }
      ],
      quiz: [
        Q(B('למה קוראים את המקודד בפסיקה, ולא בלולאה הראשית?', 'Why is the encoder read in an interrupt, and not in the main loop?'),
          [B('כי קליק נמשך אלפיות שנייה, וציור המסך לוקח יותר זמן. בלולאה היו מפספסים קליקים.', 'Because a click lasts milliseconds, and drawing the display takes longer. In the loop clicks would be missed.'), B('כי פסיקה צורכת פחות חשמל', 'Because an interrupt uses less electricity'), B('כי אי אפשר לקרוא פין בלולאה', 'Because a pin cannot be read in a loop')], 0,
          B('הפסיקה עוצרת את הציור לרגע, סופרת את הקליק, וחוזרת להמשיך בציור.', 'The interrupt pauses the drawing for a moment, counts the click, and returns.'))
      ]
    },

    /* ============================================================ G1 */
    {
      id: 'G1', track: 'G',
      title: B('שעון שזוכר את השעה', 'A clock that remembers the time'),
      goal: B('שעון דיגיטלי עם ארבע ספרות ונקודתיים מהבהבות, שממשיך להראות את השעה הנכונה גם אחרי שמנתקים את ה-Pico.', 'A digital clock with four digits and a blinking colon, which stays right even after the Pico is unplugged.'),
      learn: [
        B('איך קוראים [[register|רגיסטרים]] של רכיב [[i2c|I2C]] בלי ספרייה.', 'To read the [[register|registers]] of an [[i2c|I2C]] part with no library.'),
        B('מה זה [[bcd|BCD]], ולמה צריך להמיר אותו.', 'To understand [[bcd|BCD]], and why converting is needed.'),
        B('איך משלבים שני רכיבים שכל אחד מהם מדבר בשפה אחרת.', 'To combine two parts that each speak a different language.')
      ],
      before: [
        BASICS('buses', 'יסודות: I2C, SPI ו-UART', 'Basics: I2C, SPI and UART'),
        PART('ds3231', 'העמוד של השעון', 'The clock\'s page'),
        PART('tm1637', 'העמוד של תצוגת הספרות', 'The digit display\'s page', 'משם שומרים על הלוח את הקובץ `pico_tm1637.py`.', 'From there you save the file `pico_tm1637.py` onto the board.')
      ],
      parts: [{ id: 'ds3231', qty: 1, note: B('עם סוללה', 'with a battery') }, { id: 'tm1637', qty: 1 }, { text: B('שמונה חוטי גישור', 'Eight jumper wires') }],
      wiring: [
        W(B('שעון, VCC ותצוגה, VCC', 'Clock VCC and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('שעון, GND ותצוגה, GND', 'Clock GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('שעון, SDA', 'Clock, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('שעון, SCL', 'Clock, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('תצוגה, CLK', 'Display, CLK'), 'GP20', 26, null, 'CLK'),
        W(B('תצוגה, DIO', 'Display, DIO'), 'GP21', 27, null, 'DIO')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את מודול השעון למטריצה, וחברו את ארבעת הפינים שלו.', 'Push in the clock module and connect its four pins.'),
        B('הכניסו את תצוגת הספרות למטריצה, וחברו את ארבעת הפינים שלה.', 'Push in the digit display and connect its four pins.'),
        RAILS, PLUG,
        B('שמרו על הלוח את הקובץ `pico_tm1637.py` מהעמוד של תצוגת הספרות, אם עוד לא עשיתם זאת.', 'Save the file `pico_tm1637.py` from the digit display\'s page onto the board, if you have not done so yet.'),
        B('כיוון השעה, פעם אחת בלבד: כתבו את השעה הנוכחית בתוכנית השנייה שלמטה, והריצו אותה.', 'Setting the time, once: run the second program below, after writing the current time into it.'),
        RUN,
        B('נתקו את ה-USB לדקה, וחברו אותו שוב. האם השעה עדיין נכונה?', 'Unplug the USB for a minute and plug it in again. Is the time still right?'),
        READ
      ],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep',
        'from pico_tm1637 import TM1637, SEGMENTS',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'display = TM1637(Pin(20), Pin(21))',
        'CLOCK = 0x68',
        '',
        'def bcd(value):',
        '    return (value >> 4) * 10 + (value & 0x0F)',
        '',
        'while True:',
        '    data = i2c.readfrom_mem(CLOCK, 0, 3)',
        '    seconds = bcd(data[0])',
        '    minutes = bcd(data[1])',
        '    hours = bcd(data[2] & 0x3F)',
        '    digits = [SEGMENTS[hours // 10], SEGMENTS[hours % 10],',
        '              SEGMENTS[minutes // 10], SEGMENTS[minutes % 10]]',
        '    if seconds % 2 == 0:',
        '        digits[1] = digits[1] | 0x80      # the colon',
        '    display.show(digits)',
        '    sleep(0.2)'
      ],
      explain: [
        E([3], 'השורה הזו טוענת שני דברים מהקובץ ששמרתם: את התצוגה, ואת הטבלה `SEGMENTS`, שקובעת אילו מקטעים דולקים בכל ספרה.', 'From the file you saved two things are brought in: the display, and the `SEGMENTS` table that says which segments light for each digit.'),
        E([5, 7], 'השעון מחובר לאפיק ה-I2C, בכתובת `0x68`. התצוגה מחוברת לשני פינים משלה.', 'The clock is on the I2C bus, at address `0x68`. The display is on two pins of its own.'),
        E([9, 10], 'השעון שומר כל מספר כשתי ספרות נפרדות: ארבעה [[bit|ביטים]] לעשרות וארבעה לאחדות. `>> 4` מוציא את העשרות, ו-`& 0x0F` מוציא את האחדות.', 'The clock stores each number as two separate digits: four [[bit|bits]] for the tens and four for the units. `>> 4` takes out the tens, and `& 0x0F` the units.'),
        E([13], 'כאן קוראים שלושה [[byte|בתים]] החל מרגיסטר 0: שניות, דקות ושעות.', 'Reads three [[byte|bytes]] starting at register 0: seconds, minutes, hours.'),
        E([16], 'בבית של השעות, שני הביטים העליונים אינם חלק מהמספר, ו-`& 0x3F` מסתיר אותם.', 'In the hours byte, the top two bits are not part of the number. `& 0x3F` masks them off.'),
        E([17, 18], 'זו [[list|רשימה]] של ארבע ספרות: העשרות והאחדות של השעות, ואחריהן של הדקות. `//` הוא חילוק שלם, ו-`%` היא השארית.', 'A [[list|list]] of four digits: tens and units of the hours, then of the minutes. `//` is whole division and `%` is the remainder.'),
        E([19, 20], 'בשניות זוגיות מדליקים גם את הנקודתיים, שהן ביט נוסף בספרה השנייה. כך הן מהבהבות פעם בשנייה.', 'On even seconds the colon is lit too: it is one more bit in the second digit. So it blinks once a second.'),
        E([22], 'התוכנית בודקת חמש פעמים בשנייה, כדי שההבהוב יקרה בזמן.', 'Checks five times a second, so the blink is on time.')
      ],
      second: {
        title: B('תוכנית נפרדת שמריצים פעם אחת: כיוון השעה', 'A separate program, run once: setting the time'),
        code: ['from machine import Pin, I2C', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', '# seconds, minutes, hours: the digits are written as they read, after \\x', 'i2c.writeto_mem(0x68, 0, b"\\x00\\x30\\x14")      # 14:30:00'],
        explain: [
          E([5], 'השורה הזו כותבת שלושה בתים לרגיסטרים 0, 1 ו-2. בזכות ה-BCD אפשר לכתוב את הספרות כמו שהן: 14:30:00 נכתב `\\x00`, `\\x30`, `\\x14`.', 'Writes three bytes to registers 0, 1 and 2. Thanks to BCD the digits are written as they are: 14:30:00 is `\\x00`, `\\x30`, `\\x14`.')
        ]
      },
      expect: B('על התצוגה מופיעה השעה, עם נקודתיים שמהבהבות פעם בשנייה. גם אחרי ניתוק וחיבור מחדש השעה נכונה, כי הסוללה הקטנה המשיכה להפעיל את השעון.', 'The display shows the time, with a colon blinking once a second. After unplugging and plugging in the time is right, because the small battery kept the clock running.'),
      tasks: [
        { t: B('עמעמו את התצוגה בלילה, כך שבין 22:00 ל-7:00 היא תאיר חלש.', 'Dim the display at night: between 22:00 and 7:00 it glows faintly.'), hint: B('לפני `display.show` הוסיפו: `display.brightness = 1 if hours >= 22 or hours < 7 else 7`. העוצמה היא מספר בין 0 ל-7.', 'Before `display.show`: `display.brightness = 1 if hours >= 22 or hours < 7 else 7`. Brightness is a number from 0 to 7.') },
        { t: B('שעון מעורר: בשעה שקבעתם, באזר מצפצף במשך דקה, או עד שלוחצים על כפתור.', 'An alarm clock: at the time you set, a buzzer beeps for a minute, or until a button is pressed.'), hint: B('הגדירו שני קבועים, `ALARM_H` ו-`ALARM_M`, ומשתנה `silenced` שהופך ל-`True` בלחיצה וחוזר ל-`False` כשהדקה מתחלפת.', 'Two constants, `ALARM_H` and `ALARM_M`. A variable `silenced` that becomes `True` on a press, and goes back to `False` when the minute changes.') },
        { t: B('חברו את מסך ה-OLED לאותו [[bus|אפיק]], והציגו עליו גם את התאריך. אילו רגיסטרים צריך לקרוא?', 'Add the OLED display to the same [[bus|bus]], and show the date on it too. Which registers must be read?'), hint: B('אפשר לחבר את המסך לאותם SDA ו-SCL, כי הכתובת שלו שונה: `0x3C`. הריצו `i2c.scan()` ובדקו ששתי הכתובות מופיעות. היום בחודש נמצא ברגיסטר 4, החודש ב-5 (עם `& 0x1F`) והשנה ב-6. קראו שבעה בתים במקום שלושה.', 'The display goes on the same SDA and SCL, because its address differs: `0x3C`. Run `i2c.scan()` and check both addresses appear. The day of the month is in register 4, the month in 5 (with `& 0x1F`) and the year in 6. Read seven bytes instead of three.') }
      ],
      quiz: [
        Q(B('השעון מחזיר את הבית `0x47` בתור הדקות. כמה דקות זה?', 'The clock returns the byte `0x47` as the minutes. How many minutes is that?'),
          [B('71', '71'), B('47', '47'), B('11', '11')], 1,
          B('ב-BCD כל ספרה הקסדצימלית מייצגת ספרה עשרונית: 4 עשרות ו-7 אחדות. כמספר רגיל, `0x47` היה שווה 71.', 'In BCD each hexadecimal digit is a decimal digit: 4 tens and 7 units. As an ordinary number `0x47` would be 71.'))
      ]
    },

    /* ============================================================ G2 */
    {
      id: 'G2', track: 'G',
      title: B('רושם נתונים: מדידות שנשמרות בקובץ', 'A data logger: readings saved to a file'),
      goal: B('כל עשר שניות התוכנית מודדת טמפרטורה ולחות, וכותבת אותן לקובץ על ה-Pico. אחר כך פותחים את הקובץ כטבלה.', 'Every ten seconds temperature and humidity are measured, and written to a file on the Pico. Afterwards the file is opened as a table.'),
      learn: [
        B('איך כותבים ל[[file|קובץ]], ואיך קוראים ממנו.', 'To write to a [[file|file]] and read from it.'),
        B('איך מתזמנים פעולה בעזרת [[timer|טיימר]], בלי `sleep` ארוך.', 'To schedule an action with a [[timer|timer]], with no long `sleep`.'),
        B('איך שומרים נתונים בפורמט שגיליון אלקטרוני יודע לפתוח.', 'To store data in a form a spreadsheet can open.')
      ],
      before: [
        BASICS('interrupts', 'יסודות: פסיקות וטיימרים', 'Basics: Interrupts and timers'),
        PART('aht20', 'העמוד של חיישן AHT20', 'The AHT20 sensor\'s page', 'שם מוסברת הפונקציה `measure`.', 'The `measure` function is explained there.'),
        LESSON('D2')
      ],
      parts: [{ id: 'aht20', qty: 1 }, { text: B('ארבעה חוטי גישור', 'Four jumper wires') }],
      wiring: [
        W(B('חיישן, VIN', 'Sensor, VIN'), '3V3', 36, null, '3.3V'),
        W(B('חיישן, GND', 'Sensor, GND'), 'GND', 38, null, 'GND'),
        W(B('חיישן, SCL', 'Sensor, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('חיישן, SDA', 'Sensor, SDA'), 'GP4', 6, null, 'SDA')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את החיישן למטריצה, וחברו את ארבעת הפינים שלו לפי הטבלה.', 'Push in the sensor and connect its four pins following the table.'),
        RAILS, PLUG, RUN,
        B('תנו לתוכנית לרוץ דקה או שתיים, ובאמצע נשפו על החיישן.', 'Let the program run for a minute or two. Breathe on the sensor part-way through.'),
        B('עצרו את התוכנית. ב-Thonny בחרו View ואחר כך Files. בחלק התחתון, ששייך ל-Pico, מופיע הקובץ `log.csv`.', 'Stop the program. In Thonny choose View, then Files. In the lower part, the Pico\'s, the file `log.csv` appears.'),
        B('לחצו לחיצה ימנית על הקובץ ובחרו Download, כדי להעתיק אותו למחשב. פתחו אותו בגיליון אלקטרוני.', 'A right-click on the file, then Download, copies it to the computer. Open it in a spreadsheet.'),
        B('הריצו את התוכנית השנייה שלמטה. היא קוראת את הקובץ ישירות על הלוח.', 'Run the second program below. It reads the file on the board itself.'),
        READ
      ],
      code: [
        'from machine import Pin, I2C, Timer',
        'from time import sleep_ms, ticks_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'SENSOR = 0x38',
        'led = Pin("LED", Pin.OUT)',
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
        'due = True',
        '',
        'def tick(timer):',
        '    global due',
        '    due = True',
        '',
        'clock = Timer(period=10000, mode=Timer.PERIODIC, callback=tick)',
        '',
        'while True:',
        '    if due:',
        '        due = False',
        '        temp, hum = measure()',
        '        line = "%d,%.1f,%.1f" % (ticks_ms() // 1000, temp, hum)',
        '        with open("log.csv", "a") as f:',
        '            f.write(line + "\\n")',
        '        print(line)',
        '        led.toggle()',
        '    sleep_ms(50)'
      ],
      explain: [
        E([8, 18], 'השורות האלה מכינות את החיישן ומגדירות את הפונקציה `measure`, בדיוק כמו בעמוד של ה-AHT20. הפונקציה מחזירה טמפרטורה ולחות.', 'Setting up the sensor and the `measure` function, exactly as on the AHT20 page. It returns temperature and humidity.'),
        E([20], 'זה דגל שאומר "הגיע הזמן למדוד". הוא מתחיל ב-`True`, כדי שהמדידה הראשונה תתבצע מיד.', 'A flag: "it is time to measure". It starts as `True`, so the first measurement happens at once.'),
        E([22, 24], 'זו הפונקציה שהטיימר מפעיל, והיא רק מרימה את הדגל. מדידה וכתיבה לקובץ איטיות מדי בשביל פסיקה.', 'The function the timer runs. It only raises the flag. Measuring and writing a file are far too slow for an interrupt.'),
        E([26], 'זה טיימר שפועל שוב ושוב, כל 10000 אלפיות שנייה.', 'A timer that repeats every 10000 milliseconds.'),
        E([29, 30], 'הלולאה הראשית רואה שהדגל מורם, מורידה אותו, ומבצעת את העבודה.', 'The main loop sees the flag, lowers it, and does the work.'),
        E([32], 'כאן בונים שורת טקסט: השניות מאז ההדלקה, הטמפרטורה והלחות, מופרדות בפסיקים. זה הפורמט CSV.', 'Builds a line of text: seconds since power-up, temperature and humidity, separated by commas. This is the CSV format.'),
        E([33], 'פותחים את הקובץ במצב `"a"`, כלומר הוספה בסופו. אם הקובץ לא קיים, הוא נוצר. `with` סוגר אותו מעצמו בסוף הבלוק.', 'Opens the file in `"a"` mode, appending at the end. If the file does not exist, it is created. `with` closes it by itself at the end of the block.'),
        E([34], 'כותבים את השורה לקובץ, עם `\\n` שעובר לשורה חדשה.', 'Writes the line, with `\\n` to move to a new line.'),
        E([35, 36], 'מדפיסים את השורה, והופכים את מצב הלד. כך רואים שנרשמה מדידה גם כשאין מחשב מחובר.', 'Prints, and flips the LED: a sign that a reading was logged even with no computer.')
      ],
      second: {
        title: B('תוכנית שנייה: קריאת הקובץ בחזרה', 'A second program: reading the file back'),
        code: ['count = 0', 'total = 0', 'with open("log.csv") as f:', '    for line in f:', '        seconds, temp, hum = line.strip().split(",")', '        total = total + float(temp)', '        count = count + 1', 'print(count, "readings, average", total / count, "C")'],
        explain: [
          E([3], 'פותחים את הקובץ לקריאה. כשלא מציינים מצב, ברירת המחדל היא קריאה.', 'Opens for reading. With no mode given, reading is the default.'),
          E([4], 'לולאת `for` על קובץ עוברת עליו שורה אחרי שורה.', 'A `for` loop over a file walks through it line by line.'),
          E([5], '`strip` מסיר את סימן השורה החדשה, ו-`split(",")` חותך את הטקסט בפסיקים לשלושה חלקים.', '`strip` removes the new-line mark, and `split(",")` cuts the text at the commas into three pieces.'),
          E([6], 'כל מה שנקרא מקובץ הוא טקסט. `float` הופך אותו למספר עשרוני.', 'What is read from a file is text. `float` turns it into a number with a point.'),
          E([8], 'השורה הזו מדפיסה את מספר המדידות ואת הממוצע שלהן.', 'The number of readings and their average.')
        ]
      },
      expect: B('כל עשר שניות מודפסת שורה כמו `20,24.3,51.8`, והלד משנה את מצבו. בקובץ `log.csv` מצטברת שורה לכל מדידה, והקובץ נשמר גם אחרי ניתוק החשמל.', 'Every ten seconds a line such as `20,24.3,51.8` is printed, and the LED flips. In the file `log.csv` a line builds up for each reading, and it stays even after power is removed.'),
      tasks: [
        { t: B('כמה זמן אפשר לרשום נתונים לפני שהזיכרון מתמלא? חשבו, ואז הגבילו את גודל הקובץ.', 'How long can you log before memory fills up? Work it out, then cap the file.'), hint: B('שורה היא כ-15 תווים. שורה כל עשר שניות מצטברת לכ-130,000 תווים ביממה. על הלוח יש בערך מיליון וחצי תווים פנויים, כלומר מספיק לכמה ימים. כהגנה, ספרו את השורות ועצרו את הטיימר עם `clock.deinit()` אחרי 5000.', 'A line is about 15 characters. A line every ten seconds is about 130,000 characters a day. The board has roughly a million and a half characters free, which means a few days. A safeguard: count lines, and stop the timer with `clock.deinit()` after 5000.') },
        { t: B('הוסיפו שורת כותרת, `seconds,temp,hum`, אבל רק אם הקובץ עדיין לא קיים.', 'Add a header line, `seconds,temp,hum`, but only if the file does not exist yet.'), hint: B('נסו לפתוח את הקובץ לקריאה. אם הקובץ לא קיים, מתקבלת [[exception|חריגה]] מסוג `OSError`, ואז יוצרים אותו עם הכותרת.', 'Try opening it for reading. If the file does not exist you get an [[exception|exception]] of the `OSError` kind, and then create it with the header.'),
          code: ['try:', '    open("log.csv").close()', 'except OSError:', '    with open("log.csv", "w") as f:', '        f.write("seconds,temp,hum\\n")'] },
        { t: B('"שניות מאז ההדלקה" לא אומר מתי המדידה באמת נעשתה. הוסיפו את השעון משיעור G1, ורשמו את השעה האמיתית.', '"Seconds since power-up" does not say when the reading was really taken. Add the clock from lesson G1, and log real time.'), hint: B('השעון והחיישן מחוברים לאותו אפיק, בכתובות `0x68` ו-`0x38`. קראו את שלושת הבתים של השעה, ובנו את תחילת השורה בעזרת `"%02d:%02d:%02d"`.', 'The clock and the sensor share a bus: `0x68` and `0x38`. Read the three time bytes, and build the start of the line with `"%02d:%02d:%02d"`.') }
      ],
      quiz: [
        Q(B('מה ההבדל בין `open("log.csv", "a")` לבין `open("log.csv", "w")`?', 'What is the difference between `open("log.csv", "a")` and `open("log.csv", "w")`?'),
          [B('אין הבדל', 'No difference'), B('`"a"` מוסיף לסוף הקובץ, ו-`"w"` מוחק אותו ומתחיל מחדש.', '`"a"` adds to the end of the file. `"w"` erases it and starts afresh.'), B('`"w"` מהיר יותר', '`"w"` is faster')], 1,
          B('מספיקה טעות באות אחת, וכל המדידות של אתמול נמחקות. לרישום נתונים משתמשים ב-`"a"`.', 'One wrong letter, and all of yesterday\'s readings are erased. For logging, use `"a"`.'))
      ]
    },

    /* ============================================================ G3 */
    {
      id: 'G3', track: 'G',
      title: B('כרטיס שפותח מנעול', 'A card that opens a lock'),
      goal: B('מקרבים כרטיס לקורא. כרטיס מורשה מסובב סרבו שפותח בריח, וכרטיס לא מוכר גורם ללד להבהב.', 'Hold a card up to the reader. An authorised card turns a servo that opens a bolt, and a strange card makes the LED flash.'),
      learn: [
        B('איך מחברים רכיב [[spi|SPI]] בעזרת שבעה חוטים.', 'To connect an [[spi|SPI]] part with seven wires.'),
        B('איך משווים [[list|רשימה]] לרשימות של כרטיסים מורשים.', 'To compare a [[list|list]] against lists of authorised ones.'),
        B('איך אורזים רצף של פעולות בפונקציה שמחזירה תשובה או `None`.', 'To wrap a sequence of actions in a function that returns an answer or `None`.')
      ],
      before: [
        BASICS('buses', 'יסודות: I2C, SPI ו-UART', 'Basics: I2C, SPI and UART', 'קראו את החלק על SPI.', 'The part about SPI.'),
        PART('rc522', 'העמוד של קורא הכרטיסים', 'The card reader\'s page', 'שם מוסבר איך מתקינים את הספרייה.', 'It explains how to install the library.'),
        LESSON('B5')
      ],
      parts: [{ id: 'rc522', qty: 1, note: B('עם כרטיס ומחזיק מפתחות', 'with a card and a key fob') }, { id: 'servo', qty: 1 }, { text: B('שבעה חוטי גישור עם קצה נקבה, ושלושה רגילים', 'Seven jumper wires with a female end, and three ordinary ones') }],
      wiring: [
        W(B('קורא, 3.3V', 'Reader, 3.3V'), '3V3', 36, B('לא 5V', 'not 5 V'), '3.3V'),
        W(B('קורא, GND', 'Reader, GND'), 'GND', 38, null, 'GND'),
        W(B('קורא, SCK', 'Reader, SCK'), 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK'), 'SCK'),
        W(B('קורא, MOSI', 'Reader, MOSI'), 'GP19', 25, B('SPI0 TX', 'SPI0 TX'), 'MOSI'),
        W(B('קורא, MISO', 'Reader, MISO'), 'GP16', 21, B('SPI0 RX', 'SPI0 RX'), 'MISO'),
        W(B('קורא, SDA', 'Reader, SDA'), 'GP17', 22, B('קו הבחירה', 'the select line'), 'CS'),
        W(B('קורא, RST', 'Reader, RST'), 'GP22', 29, null, 'RST'),
        W(B('סרבו, חוט כתום', 'Servo, orange wire'), 'GP10', 14, null, B('סרבו', 'Servo')),
        W(B('סרבו, חוט אדום', 'Servo, red wire'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('סרבו, חוט חום', 'Servo, brown wire'), 'GND', 3, null, 'GND')
      ],
      steps: [
        UNPLUG, CLEAR,
        B('חברו את שבעת החוטים של הקורא לפי הטבלה. בדקו פעמיים שההזנה שלו מחוברת ל-3.3V, כי 5V הורס אותו.', 'Connect the reader\'s seven wires following the table. Check twice that its power goes to 3.3 V: 5 V destroys it.'),
        B('חברו את הסרבו: את החוט הכתום לפין 14 (`GP10`), את האדום ל-5V ואת החום לאדמה.', 'Connect the servo: orange to pin 14 (`GP10`), red to 5 V, brown to ground.'),
        RAILS, PLUG,
        B('התקינו את הספרייה `mfrc522`, כפי שמוסבר בעמוד של הקורא.', 'Install the `mfrc522` library, as explained on the reader\'s page.'),
        RUN,
        B('קרבו את הכרטיס הלבן לקורא. הלד יהבהב, ותודפס רשימה של מספרים. העתיקו אותה לשורה 10 במקום המספרים שכתובים שם, והריצו שוב.', 'Hold up the white card. The LED flashes, and a list of numbers is printed. Copy it into line 10 in place of the numbers there, and run again.'),
        B('קרבו שוב את הכרטיס הלבן, ואחר כך את מחזיק המפתחות הכחול.', 'Hold up the white card again, and then the blue key fob.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM',
        'from mfrc522 import MFRC522',
        'from time import sleep',
        '',
        'reader = MFRC522(spi_id=0, sck=18, mosi=19, miso=16, cs=17, rst=22)',
        'servo = PWM(Pin(10), freq=50)',
        'led = Pin("LED", Pin.OUT)',
        '',
        'ALLOWED = [',
        '    [67, 201, 14, 9],',
        ']',
        '',
        'def lock(closed):',
        '    servo.duty_u16(1638 if closed else 4915)',
        '',
        'def read_card():',
        '    reader.init()',
        '    stat, tag_type = reader.request(reader.REQIDL)',
        '    if stat != reader.OK:',
        '        return None',
        '    stat, uid = reader.SelectTagSN()',
        '    if stat != reader.OK:',
        '        return None',
        '    return list(uid)',
        '',
        'lock(True)',
        'while True:',
        '    card = read_card()',
        '    if card is not None:',
        '        print("card:", card)',
        '        if card in ALLOWED:',
        '            lock(False)',
        '            sleep(3)',
        '            lock(True)',
        '        else:',
        '            for i in range(6):',
        '                led.toggle()',
        '                sleep(0.1)',
        '    sleep(0.1)'
      ],
      explain: [
        E([5], 'השורה הזו יוצרת את הקורא, ומוסרת לספרייה את מספרי הפינים של ה-SPI.', 'Creates the reader, and gives the library the SPI pin numbers.'),
        E([9, 11], 'זו רשימת הכרטיסים המורשים. כל כרטיס הוא רשימה של מספרים, ולכן זו רשימה של רשימות. כדי להוסיף כרטיס, מוסיפים שורה.', 'The list of authorised cards. Each card is a list of numbers, so this is a list of lists. To add a card, add a line.'),
        E([13, 14], 'פונקציה אחת שמפעילה את המנעול: סגור הוא 0 מעלות, ופתוח הוא 90 מעלות.', 'One function for the lock: closed is 0 degrees, open is 90.'),
        E([16, 20], 'כאן שואלים את הקורא אם יש כרטיס בקרבתו. אם אין, מחזירים `None`.', 'Asks whether a card is nearby. If not, returns `None`.'),
        E([21, 24], 'מבקשים את המספר הייחודי של הכרטיס, ומחזירים אותו כרשימה.', 'Asks for the card\'s unique number, and returns it as a list.'),
        E([26], 'התוכנית מתחילה במצב נעול.', 'Starts in the locked state.'),
        E([29, 30], 'אם נמצא כרטיס, מדפיסים את המספר שלו. כך מגלים את המספר של כרטיס חדש.', 'There is a card. Its number is printed: this is how a new card\'s number is found out.'),
        E([31, 34], '`in` בודק אם הרשימה הזו נמצאת בין המורשים. אם כן, פותחים, מחכים שלוש שניות ונועלים שוב.', '`in` checks whether this list is among the authorised ones. If so: open, wait three seconds, and lock.'),
        E([35, 38], 'אם הכרטיס לא מוכר, הלד מהבהב שלוש פעמים, והמנעול נשאר סגור.', 'A strange card: the LED flashes three times, and the lock stays shut.')
      ],
      expect: B('כשמקרבים כרטיס שהמספר שלו ברשימה, הסרבו מסתובב רבע סיבוב, מחכה שלוש שניות וחוזר. עם כרטיס אחר, הלד שעל ה-Pico מהבהב, והסרבו לא זז.', 'A card whose number is on the list: the servo turns a quarter turn, waits three seconds and returns. Another card: the LED on the Pico flashes, and the servo does not move.'),
      tasks: [
        { t: B('תנו שם לכל כרטיס, והדפיסו "Welcome, Dana".', 'Give each card a name, and print "Welcome, Dana".'), hint: B('[[dict|מילון]] מתאים לזה, אבל רשימה לא יכולה להיות מפתח במילון. הפכו אותה ל-tuple בעזרת `tuple(uid)`. המילון ייראה כך: `NAMES = {(67, 201, 14, 9): "Dana"}`.', 'A [[dict|dictionary]] suits this, but a list cannot be a dictionary key. Turn it into a tuple: `tuple(uid)`. The dictionary: `NAMES = {(67, 201, 14, 9): "Dana"}`.') },
        { t: B('יומן כניסות: כל כרטיס שנקרא נרשם בקובץ, עם סימון אם הוא אושר או נדחה.', 'An entry log: every card read is written to a file, marked as accepted or refused.'), hint: B('כמו בשיעור G2, השתמשו ב-`open("entries.csv", "a")`. הפכו את רשימת המספרים לטקסט בעזרת `str(card)`.', 'As in lesson G2: `open("entries.csv", "a")`. Turn the list of numbers into text with `str(card)`.') },
        { t: B('כרטיס מנהל: אחרי שמקרבים אותו, הכרטיס הבא שיקורב יתווסף לרשימת המורשים.', 'A master card: after it is held up, the next card held up is added to the authorised list.'), hint: B('צרו משתנה `learning` שהופך ל-`True` כשקוראים את כרטיס המנהל. כל עוד הוא `True`, הכרטיס הבא נכנס לרשימה עם `ALLOWED.append(card)`, והמשתנה חוזר ל-`False`. הרשימה נשכחת כשמכבים את הלוח, אלא אם שומרים אותה בקובץ.', 'A variable `learning` that becomes `True` when the master card is read. While it is `True`, the next card goes in with `ALLOWED.append(card)`, and the variable goes back to `False`. The list is forgotten at power-off, unless it is saved to a file.') }
      ],
      quiz: [
        Q(B('למה מנעול כזה לא מתאים לדלת הכניסה של בית אמיתי?', 'Why is a lock like this not fit for a real front door?'),
          [B('כי הסרבו חלש מדי', 'Because the servo is too weak'), B('כי קל להעתיק את המספר של כרטיס כזה, והוא משודר בלי הצפנה', 'Because such a card\'s number is easy to copy, and is sent with no encryption'), B('כי הכרטיסים יקרים', 'Because the cards are expensive')], 1,
          B('הקורא בודק רק את המספר, וכל קורא אחר יכול לקרוא אותו ולשכפל אותו. זה פרויקט לימודי, ולא מערכת אבטחה.', 'The reader checks only the number, and any other reader can read and clone it. This is a learning project, not a security system.'))
      ]
    },

    /* ============================================================ G4 */
    {
      id: 'G4', track: 'G',
      title: B('שליטה מהטלפון', 'Control from a phone'),
      goal: B('כותבים פקודה בטלפון, כמו `red` או `dim 30`, ולד RGB מבצע אותה. ה-Pico גם שולח תשובה.', 'Type a command on the phone, such as `red` or `dim 30`, and an RGB LED obeys. The Pico answers too.'),
      learn: [
        B('איך מקבלים טקסט דרך [[uart|UART]], ואיך מפרקים אותו למילים.', 'To receive text over [[uart|UART]] and split it into words.'),
        B('איך בונים "שפת פקודות" קטנה בעזרת [[dict|מילון]].', 'To build a small "command language", with a [[dict|dictionary]].'),
        B('איך מתמודדים עם קלט שגוי בלי שהתוכנית תיעצר.', 'To cope with bad input without the program stopping.')
      ],
      before: [
        PART('hc05', 'העמוד של מודול ה-Bluetooth', 'The Bluetooth module\'s page', 'שם מוסבר איך מצמידים את הטלפון למודול.', 'It explains how to pair the phone.'),
        BASICS('python2', 'יסודות: עוד פייתון', 'Basics: More Python', 'שם מוסברים מילונים ו-`try`.', 'For dictionaries and `try`.'),
        LESSON('F1')
      ],
      parts: [{ id: 'hc05', qty: 1 }, { id: 'rgb', qty: 1 }, { text: B('טלפון Android עם אפליקציית Serial Bluetooth Terminal', 'An Android phone with a Serial Bluetooth Terminal app') }, { text: B('שמונה חוטי גישור', 'Eight jumper wires') }],
      wiring: [
        W(B('Bluetooth, VCC', 'Bluetooth, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('Bluetooth, GND ולד RGB, −', 'Bluetooth GND and RGB LED −'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('Bluetooth, TXD', 'Bluetooth, TXD'), 'GP21', 27, B('אל ה-RX של ה-Pico (UART1)', 'to the Pico\'s RX (UART1)'), 'RX'),
        W(B('Bluetooth, RXD', 'Bluetooth, RXD'), 'GP20', 26, B('אל ה-TX של ה-Pico (UART1)', 'to the Pico\'s TX (UART1)'), 'TX'),
        W(B('לד RGB, R', 'RGB LED, R'), 'GP11', 15, null, B('אדום', 'Red')),
        W(B('לד RGB, G', 'RGB LED, G'), 'GP12', 16, null, B('ירוק', 'Green')),
        W(B('לד RGB, B', 'RGB LED, B'), 'GP13', 17, null, B('כחול', 'Blue'))
      ],
      steps: [
        UNPLUG, CLEAR,
        B('הכניסו את מודול ה-Bluetooth למטריצה, וחברו את ארבעת הפינים שלו. שימו לב להצלבה: את ה-`TXD` שלו לפין 27, ואת ה-`RXD` שלו לפין 26.', 'Push in the Bluetooth module and connect its four pins. Mind the crossing: its `TXD` to pin 27, and its `RXD` to pin 26.'),
        B('הכניסו את מודול ה-RGB למטריצה, וחברו אותו כמו בשיעור F1.', 'Push in the RGB module and connect it as in lesson F1.'),
        RAILS, PLUG, RUN,
        B('בטלפון: הצמידו את המכשיר HC-05 (הקוד הוא בדרך כלל 1234), פתחו את האפליקציה והתחברו. הנורית שעל המודול תעבור להבהוב איטי.', 'On the phone: pair the HC-05 device (the code is usually 1234), open the app and connect. The light on the module changes to a slow blink.'),
        B('בהגדרות האפליקציה, תחת Send, בחרו שכל שורה תסתיים ב-Newline.', 'In the app settings, under Send, choose for each line to end with a Newline.'),
        B('שלחו `red`, ואחר כך `blue`, `dim 20`, `white`, `off`, ולבסוף `hello`.', 'Send: `red`, then `blue`, `dim 20`, `white`, `off`, and finally `hello`.'),
        READ
      ],
      code: [
        'from machine import Pin, PWM, UART',
        'from time import sleep',
        '',
        'bt = UART(1, baudrate=9600, tx=Pin(20), rx=Pin(21), timeout=100)',
        'red = PWM(Pin(11), freq=1000)',
        'green = PWM(Pin(12), freq=1000)',
        'blue = PWM(Pin(13), freq=1000)',
        '',
        'COLORS = {',
        '    "red": (255, 0, 0), "green": (0, 255, 0), "blue": (0, 0, 255),',
        '    "white": (255, 255, 255), "off": (0, 0, 0),',
        '}',
        'color = (0, 0, 0)',
        'level = 100',
        '',
        'def show():',
        '    red.duty_u16(color[0] * 257 * level // 100)',
        '    green.duty_u16(color[1] * 257 * level // 100)',
        '    blue.duty_u16(color[2] * 257 * level // 100)',
        '',
        'def handle(words):',
        '    global color, level',
        '    if words[0] in COLORS:',
        '        color = COLORS[words[0]]',
        '        return "ok " + words[0]',
        '    if words[0] == "dim" and len(words) == 2 and words[1].isdigit():',
        '        level = min(100, int(words[1]))',
        '        return "ok dim " + str(level)',
        '    return "unknown: " + words[0]',
        '',
        'while True:',
        '    if bt.any():',
        '        line = bt.readline()',
        '        try:',
        '            words = line.decode().strip().lower().split()',
        '        except (UnicodeError, AttributeError):',
        '            words = []',
        '        if words:',
        '            bt.write(handle(words) + "\\n")',
        '            show()',
        '    sleep(0.02)'
      ],
      explain: [
        E([4], 'זה UART מספר 1, במהירות של 9600 [[baud|baud]]. `timeout=100` אומר ל-`readline` לחכות עד עשירית שנייה לסוף השורה.', 'UART number 1 at 9600 [[baud|baud]]. `timeout=100` tells `readline` to wait up to a tenth of a second for the end of the line.'),
        E([9, 12], 'זה מילון שמתרגם שם של צבע לשלושה מספרים. כדי להוסיף צבע, מוסיפים זוג נוסף.', 'A dictionary that translates a colour name into three numbers. To add a colour, add a pair.'),
        E([13, 14], 'המשתנים האלה שומרים את המצב הנוכחי: איזה צבע דולק, ובאיזו עוצמה באחוזים.', 'The current state: which colour, and at what strength in per cent.'),
        E([16, 19], 'הפונקציה הזו מציגה את הצבע, כשהוא מוכפל בעוצמה.', 'Shows the colour, multiplied by the strength.'),
        E([21, 22], 'זו הפונקציה שמפענחת פקודה. היא מקבלת רשימה של מילים ומחזירה תשובה, ומשנה שני [[global|משתנים גלובליים]].', 'The function that understands a command. It takes a list of words and returns an answer. It changes two [[global|global variables]].'),
        E([23, 25], 'אם המילה הראשונה היא שם של צבע, לוקחים את הצבע מהמילון.', 'If the first word is a colour name, it is taken from the dictionary.'),
        E([26, 28], 'הפקודה `dim` צריכה בדיוק שתי מילים, והשנייה חייבת להיות מספר. `isdigit` בודק את זה לפני ש-`int` ממיר אותה למספר.', 'The `dim` command needs exactly two words, and the second must be a number. `isdigit` checks this before `int` converts.'),
        E([29], 'על כל דבר אחר עונים שהפקודה לא הובנה, ולא עושים כלום.', 'Anything else: answer that it was not understood, and do nothing.'),
        E([33], 'כאן קוראים שורה. היא מגיעה כ[[byte|בתים]], ולא כטקסט.', 'Reads a line. It arrives as [[byte|bytes]] and not as text.'),
        E([34, 37], '`decode` הופך בתים לטקסט, `strip` מסיר רווחים וסימן שורה, `lower` הופך לאותיות קטנות, ו-`split` חותך את הטקסט למילים. אם הגיע זבל, ה-[[exception|חריגה]] נתפסת, ומתעלמים מהשורה.', '`decode` turns bytes into text, `strip` removes spaces and the line mark, `lower` makes it lower case, and `split` cuts it into words. If rubbish arrived, the [[exception|exception]] is caught and the line ignored.'),
        E([38, 40], 'רשימה ריקה נחשבת `False`. אם יש מילים, מטפלים בהן, עונים לטלפון ומעדכנים את הלד.', 'An empty list counts as `False`. If there are words: handle them, answer the phone, and update the LED.')
      ],
      expect: B('`red` מדליק את הלד באדום, והטלפון מקבל `ok red`. `dim 20` מעמעם את האור לחמישית, ואז `white` מאיר בלבן מעומעם. `hello` לא משנה כלום, והטלפון מקבל `unknown: hello`.', '`red` lights red, and the phone receives `ok red`. `dim 20` dims to a fifth, and `white` glows a dimmed white. `hello` changes nothing, and the phone receives `unknown: hello`.'),
      tasks: [
        { t: B('הוסיפו פקודה `rgb 255 100 0`, שקובעת כל צבע שרוצים.', 'Add a command `rgb 255 100 0` that sets any colour you like.'), hint: B('לפקודה יש ארבע מילים, ושלוש האחרונות הן מספרים. בנו מהן tuple: `color = (int(words[1]), int(words[2]), int(words[3]))`. אל תשכחו לבדוק `isdigit`, ולהגביל את הערכים ל-255.', 'Four words, the last three being numbers. Build a tuple from them: `color = (int(words[1]), int(words[2]), int(words[3]))`. Do not forget to check `isdigit` and cap at 255.') },
        { t: B('הוסיפו פקודה `help` שמחזירה את רשימת הפקודות, בלי לכתוב את הרשימה ידנית.', 'Add a `help` command that returns the list of commands, without writing it out by hand.'), hint: B('`", ".join(COLORS)` מחבר את כל המפתחות של המילון לטקסט אחד, עם פסיק ורווח ביניהם. כך כל צבע חדש מופיע בעזרה מעצמו.', '`", ".join(COLORS)` joins all the dictionary\'s keys into one text, with a comma and a space between. So a new colour shows up in the help by itself.') },
        { t: B('דיווח יזום: חברו את חיישן AHT20, ושלחו לטלפון את הטמפרטורה כל חמש שניות, בלי שיבקשו.', 'Reporting unasked: connect the AHT20 sensor, and send the temperature to the phone every five seconds.'), hint: B('אל תוסיפו `sleep(5)`, כי אז הפקודות יתעכבו. השתמשו ב-`ticks_ms` וב-`ticks_diff`, כמו בפרק "פסיקות וטיימרים", ושלחו בעזרת `bt.write`.', 'Do not add a `sleep(5)`, because then commands would be held up. Use `ticks_ms` and `ticks_diff`, as in the chapter "Interrupts and timers", and send with `bt.write`.') }
      ],
      quiz: [
        Q(B('שולחים `dim abc`. מה יקרה?', 'You send `dim abc`. What happens?'),
          [B('התוכנית נעצרת בשגיאה', 'The program stops with an error'), B('הטלפון מקבל `unknown: dim`, והתוכנית ממשיכה לרוץ', 'The phone receives `unknown: dim`, and the program carries on'), B('הלד נכבה', 'The LED goes off')], 1,
          B('`isdigit` מחזיר `False` עבור `abc`, ולכן `int` לא נקרא בכלל. תוכנית שמקבלת קלט מבחוץ צריכה לבדוק אותו לפני שהיא סומכת עליו.', '`isdigit` gives `False` for `abc`, so `int` is never called. A program that takes input from outside checks it before trusting it.'))
      ]
    }
  );
})(window.PICO);
