/* More check questions for tracks A to D, T and R, so every lesson has at least three, one of them of a new kind
   (see quiz.js): OUT = "what will be printed?", ORD = "put the lines in order", FILL = "pick the missing line".
   They are added to the end of each lesson's quiz. Code and options in code are plain strings (not translated).
   Order questions must not contain two identical lines, because the check compares positions. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };
  var OUT = function (q, code, answer, why) { return { type: 'output', q: q, code: code, answer: answer, why: why }; };
  var ORD = function (q, lines, why) { return { type: 'order', q: q, lines: lines, why: why }; };
  var FILL = function (q, code, a, ok, why) { return { type: 'fill', q: q, code: code, a: a, ok: ok, why: why }; };

  var MORE = {
    A1: [
      ORD(B('הלד צריך להבזיק: לדלוק חמישית שנייה, ואז להיות כבוי שנייה שלמה. סדרו את השורות שבתוך הלולאה.', 'The LED should flash: on for a fifth of a second, then off for a whole second. Put the lines inside the loop in order.'),
        ['led.on()', 'sleep(0.2)', 'led.off()', 'sleep(1)'],
        B('קודם מדליקים ומחכים את זמן ההדלקה, ואחר כך מכבים ומחכים את זמן הכיבוי. אחרי השורה האחרונה הלולאה חוזרת להתחלה.', 'First switch on and wait the on-time, then switch off and wait the off-time. After the last line the loop goes back to the start.')),
      FILL(B('הלד מחובר לפין הפיזי 20 של הלוח.', 'The LED is wired to the board\'s physical pin 20.'),
        ['from machine import Pin', 'from time import sleep', '', '___', '', 'while True:', '    led.toggle()', '    sleep(0.5)'],
        ['led = Pin(15, Pin.OUT)', 'led = Pin(20, Pin.OUT)', 'led = Pin(15, Pin.IN)', 'led = Pin("20", Pin.OUT)'], 0,
        B('פין פיזי 20 הוא GP15, והלד צריך פין שמוגדר כיציאה.', 'Physical pin 20 is GP15, and the LED needs a pin set as an output.'))
    ],
    A2: [
      OUT(B('שלושת זמני ההמתנה של הרמזור שמורים ברשימה.', 'The traffic light\'s three waits are kept in a list.'),
        ['times = [3, 3, 1]', 'print(sum(times))'], '7',
        B('`sum` מחבר את כל הערכים: 3 + 3 + 1 = 7. זה גם אורך סיבוב שלם של הרמזור, בשניות.', '`sum` adds every value: 3 + 3 + 1 = 7. That is also how long one full round of the light takes, in seconds.')),
      Q(B('הלד האדום נדלק, אבל הירוק אף פעם לא נדלק. החיווט נבדק והוא תקין. מה בודקים בקוד?', 'The red LED lights, but the green one never does. The wiring was checked and is fine. What do you check in the code?'),
        [B('שמספר הפין של `green` הוא ה-GP שאליו הלד הירוק מחובר', 'That the pin number of `green` is the GP the green LED is wired to'), B('את אורך ה-`sleep`', 'The length of the `sleep`'), B('את ערך הנגד', 'The resistor value')], 0,
        B('אם החיווט תקין, הסיבה הנפוצה היא מספר פין שגוי בקוד: הקוד מדליק פין שאין עליו כלום.', 'If the wiring is fine, the usual cause is a wrong pin number in the code: the code switches a pin with nothing on it.'))
    ],
    A3: [
      FILL(B('הכפתור מחובר בין GP14 לאדמה.', 'The button is wired between GP14 and ground.'),
        ['led = Pin(15, Pin.OUT)', '___', '', 'while True:', '    if button.value() == 0:', '        led.on()', '    else:', '        led.off()'],
        ['button = Pin(14, Pin.IN, Pin.PULL_UP)', 'button = Pin(14, Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_DOWN)', 'button = Pin(19, Pin.IN, Pin.PULL_UP)'], 0,
        B('כפתור הוא כניסה, וכשהוא מחובר לאדמה צריך `PULL_UP` שיחזיק את הפין על 1 כשהכפתור לא לחוץ. 19 הוא מספר הפין הפיזי, לא מספר ה-GP.', 'A button is an input, and when it goes to ground it needs `PULL_UP` to hold the pin at 1 while it is not pressed. 19 is the physical pin number, not the GP number.')),
      Q(B('אחרי שינוי בקוד, הלד דולק כשהכפתור לא לחוץ, ונכבה כשלוחצים. מה כנראה השתנה?', 'After a change to the code, the LED is on while the button is not pressed, and goes off when it is pressed. What probably changed?'),
        [B('`== 0` הפך ל-`== 1` בתנאי', '`== 0` became `== 1` in the condition'), B('ה-`sleep` התקצר', 'The `sleep` got shorter'), B('מספר הפין של הלד', 'The LED\'s pin number')], 0,
        B('לחוץ פירושו 0. אם התנאי בודק 1, הוא מתקיים דווקא כשהכפתור משוחרר, וההתנהגות מתהפכת.', 'Pressed means 0. If the condition checks for 1, it is true precisely when the button is released, and the behaviour flips.'))
    ],
    A4: [
      OUT(B('לולאה שסופרת שלוש לחיצות.', 'A loop that counts three presses.'),
        ['count = 0', 'for i in range(3):', '    count = count + 1', 'print("presses:", count)'], 'presses: 3',
        B('הלולאה רצה שלוש פעמים, ובכל פעם מוסיפה 1. `print` עם פסיק מדפיס רווח בין שני החלקים.', 'The loop runs three times, adding 1 each time. `print` with a comma prints a space between the two parts.')),
      ORD(B('סדרו את השורות כך שהלד יתחלף רק ברגע הלחיצה, ולא כל עוד הכפתור לחוץ.', 'Put the lines in order so the LED switches only at the moment of the press, not for as long as the button is held.'),
        ['pressed = button.value() == 0', 'if pressed and not was_pressed:', '    led.toggle()', 'was_pressed = pressed'],
        B('קודם קוראים את המצב עכשיו, אחר כך משווים למצב הקודם, ורק בסוף שומרים את המצב הנוכחי לסיבוב הבא.', 'First read the state now, then compare it with the previous one, and only at the end keep the current state for the next round.'))
    ],
    B1: [
      OUT(B('הפוטנציומטר באמצע הסיבוב.', 'The potentiometer is halfway round.'),
        ['raw = 32768', 'percent = raw * 100 // 65535', 'print(percent)'], '50',
        B('32768 הוא בערך חצי מ-65535, ולכן יוצא 50. `//` מחלק ומעגל כלפי מטה, כך שמתקבל מספר שלם.', '32768 is about half of 65535, so the result is 50. `//` divides and rounds down, giving a whole number.')),
      Q(B('באילו פינים אפשר לקרוא פוטנציומטר עם `ADC`?', 'Which pins can read a potentiometer with `ADC`?'),
        [B('GP26, GP27 ו-GP28', 'GP26, GP27 and GP28'), B('בכל פין GP', 'Any GP pin'), B('רק GP0', 'Only GP0')], 0,
        B('רק לשלושת הפינים האלה יש ממיר אנלוגי. פין רגיל קורא רק 0 או 1.', 'Only these three pins have an analog converter. An ordinary pin reads only 0 or 1.'))
    ],
    B2: [
      FILL(B('העמעם: הכפתור קובע את עוצמת הלד.', 'The dimmer: the knob sets the LED\'s brightness.'),
        ['pot = ADC(26)', 'led = PWM(Pin(15), freq=1000)', '', 'while True:', '    ___', '    sleep(0.02)'],
        ['led.duty_u16(pot.read_u16())', 'led.value(pot.read_u16())', 'led.duty_u16(pot)', 'pot.duty_u16(led.read_u16())'], 0,
        B('קוראים את הכפתור עם `read_u16`, ושולחים את אותו מספר ל-`duty_u16`. שני הטווחים הם 0 עד 65535, ולכן לא צריך המרה.', 'Read the knob with `read_u16`, and send the same number to `duty_u16`. Both ranges are 0 to 65535, so no conversion is needed.')),
      Q(B('מה עושה `led.duty_u16(65535)`?', 'What does `led.duty_u16(65535)` do?'),
        [B('הלד דולק כל הזמן, בעוצמה מלאה', 'The LED is on all the time, at full brightness'), B('הלד כבוי', 'The LED is off'), B('הלד בחצי עוצמה', 'The LED is at half brightness')], 0,
        B('65535 הוא הערך הגבוה ביותר: הפין דולק בכל המחזור.', '65535 is the highest value: the pin is on for the whole cycle.'))
    ],
    B3: [
      OUT(B('חשוך בחדר, והחיישן מודד 20% אור.', 'The room is dark, and the sensor measures 20% light.'),
        ['light = 20', 'THRESHOLD = 30', 'if light < THRESHOLD:', '    print("on")', 'else:', '    print("off")'], 'on',
        B('20 קטן מ-30, ולכן התנאי מתקיים והלד נדלק.', '20 is less than 30, so the condition is true and the LED lights.')),
      Q(B('כשהאור קרוב לסף, הלד מהבהב ומתחלף בלי הפסקה. מה פתרון טוב?', 'When the light is close to the threshold, the LED flickers on and off non-stop. What is a good fix?'),
        [B('שני ספים: להדליק מתחת ל-25 ולכבות רק מעל 35', 'Two thresholds: switch on below 25 and off only above 35'), B('נגד גדול יותר ללד', 'A bigger resistor for the LED'), B('למחוק את ה-`sleep`', 'Delete the `sleep`')], 0,
        B('עם שני ספים, רעש קטן במדידה לא מספיק כדי להחליף מצב. השיטה הזו נקראת hysteresis.', 'With two thresholds, a little noise in the reading is not enough to switch state. This method is called hysteresis.'))
    ],
    B4: [
      OUT(B('גרסה של `tone` שרק מדפיסה, בלי באזר.', 'A version of `tone` that only prints, with no buzzer.'),
        ['def tone(freq, seconds):', '    print("tone", freq, seconds)', '', 'tone(659, 0.3)', 'tone(523, 0.5)'], 'tone 659 0.3\ntone 523 0.5',
        B('כל קריאה ל-`tone` מדפיסה שורה אחת עם הערכים שהועברו אליה, לפי סדר הקריאות.', 'Each call to `tone` prints one line with the values passed to it, in the order of the calls.')),
      Q(B('איזו שורה קובעת את גובה הצליל?', 'Which line sets the pitch of the note?'),
        [B('`buzzer.freq(freq)`', '`buzzer.freq(freq)`'), B('`buzzer.duty_u16(32768)`', '`buzzer.duty_u16(32768)`'), B('`sleep(seconds)`', '`sleep(seconds)`')], 0,
        B('התדר הוא גובה הצליל. `duty_u16` מפעיל או משתיק את הבאזר, ו-`sleep` קובע כמה זמן הצליל נמשך.', 'The frequency is the pitch. `duty_u16` turns the buzzer on or silences it, and `sleep` sets how long the note lasts.'))
    ],
    B5: [
      OUT(B('כמה ננו-שניות נמשך הפולס עבור 90 מעלות?', 'How many nanoseconds long is the pulse for 90 degrees?'),
        ['deg = 90', 'ns = 500_000 + int(deg / 180 * 2_000_000)', 'print(ns)'], '1500000',
        B('90 הוא חצי מ-180, ולכן מוסיפים מיליון ננו-שניות ל-500,000. התוצאה היא 1.5 אלפיות שנייה, האמצע של הסרבו.', '90 is half of 180, so a million nanoseconds is added to 500,000. The result is 1.5 milliseconds, the servo\'s middle.')),
      Q(B('הפוטנציומטר באמצע הסיבוב. לאן בערך מצביעה הזרוע?', 'The potentiometer is halfway round. Roughly where does the arm point?'),
        [B('ל-90 מעלות, לאמצע', 'To 90 degrees, the middle'), B('ל-0 מעלות', 'To 0 degrees'), B('ל-180 מעלות', 'To 180 degrees')], 0,
        B('הקוד ממיר את 0 עד 65535 ל-0 עד 180, ולכן חצי מהכפתור נותן חצי מהזווית.', 'The code turns 0 to 65535 into 0 to 180, so half the knob gives half the angle.'))
    ],
    C1: [
      OUT(B('ההד חזר אחרי 1166 מיקרו-שניות. מה המרחק בסנטימטרים?', 'The echo came back after 1166 microseconds. What is the distance in centimetres?'),
        ['t = 1166', 'd = t * 0.0343 / 2', 'print(round(d))'], '20',
        B('1166 כפול 0.0343 הם כ-40 סנטימטרים, הדרך הלוך וחזור. חצי מזה, 20, הוא המרחק לעצם.', '1166 times 0.0343 is about 40 centimetres, the trip there and back. Half of that, 20, is the distance to the object.')),
      Q(B('למה מחלקים ב-2 בשורה `t * 0.0343 / 2`?', 'Why divide by 2 in `t * 0.0343 / 2`?'),
        [B('כי הצליל עובר את הדרך פעמיים: אל העצם ובחזרה', 'Because the sound travels the distance twice: to the object and back'), B('כי מהירות הקול היא חצי', 'Because the speed of sound is half'), B('כי החיישן שולח שני פולסים', 'Because the sensor sends two pulses')], 0,
        B('הזמן שנמדד הוא של הדרך הלוך וחזור, והמרחק לעצם הוא חצי ממנה.', 'The time measured is for the trip there and back, and the distance to the object is half of it.'))
    ],
    C2: [
      ORD(B('סדרו את ההתחלה של תוכנית האזעקה.', 'Put the start of the alarm program in order.'),
        ['print("warming up...")', 'sleep(30)', 'print("armed")', 'while True:'],
        B('קודם מודיעים שהחיישן מתחמם, מחכים לו 30 שניות, מודיעים שהאזעקה דרוכה, ורק אז נכנסים ללולאה.', 'First say the sensor is warming up, wait 30 seconds for it, say the alarm is armed, and only then enter the loop.')),
      Q(B('`pir.value()` מחזיר 1. מה זה אומר?', '`pir.value()` returns 1. What does that mean?'),
        [B('החיישן מזהה תנועה עכשיו', 'The sensor detects motion right now'), B('אין תנועה', 'There is no motion'), B('החיישן מקולקל', 'The sensor is broken')], 0,
        B('יציאת ה-PIR עולה ל-1 כשהוא מזהה תנועה, ונשארת כך כמה שניות.', 'The PIR\'s output goes to 1 when it detects motion, and stays there for a few seconds.'))
    ],
    C3: [
      ORD(B('סדרו את השורות כך שעל המסך יופיע רק הטקסט החדש.', 'Put the lines in order so only the new text appears on the display.'),
        ['oled.fill(0)', 'oled.text("Pico 2 Lab", 0, 0)', 'oled.show()'],
        B('קודם מנקים את הזיכרון של המסך, אחר כך כותבים, ובסוף `show` שולח את הכול למסך.', 'First clear the display\'s memory, then write, and at the end `show` sends everything to the display.')),
      OUT(B('מה תכיל השורה על המסך?', 'What will the line on the display say?'),
        ['count = 7', 'print("count: " + str(count))'], 'count: 7',
        B('`str` הופך את המספר לטקסט, ו-`+` מחבר אותו לטקסט שלפניו.', '`str` turns the number into text, and `+` joins it to the text before it.'))
    ],
    C4: [
      OUT(B('החיישן מדד 23.5 מעלות.', 'The sensor measured 23.5 degrees.'),
        ['temp = 23.5', 'print("Temp: " + str(temp) + " C")'], 'Temp: 23.5 C',
        B('שלושת החלקים מתחברים לשורה אחת. שימו לב לרווחים שבתוך המירכאות.', 'The three parts join into one line. Notice the spaces inside the quotes.')),
      Q(B('למה בתחנה כתוב `sleep(2)` ולא `sleep(0.1)`?', 'Why does the station use `sleep(2)` and not `sleep(0.1)`?'),
        [B('כי DHT22 יכול למדוד רק פעם בשתי שניות', 'Because the DHT22 can measure only once every two seconds'), B('כי המסך איטי', 'Because the display is slow'), B('כדי לחסוך בחשמל', 'To save power')], 0,
        B('מדידה מהירה יותר מחזירה שגיאה או את הערך הקודם.', 'Measuring faster returns an error or the previous value.'))
    ],
    D1: [
      ORD(B('סדרו את הלולאה הראשית לפי השיטה "לקרוא, להחליט, לפעול".', 'Put the main loop in order, by the "read, decide, act" method.'),
        ['pressed = read_inputs()', 'light_on = decide(pressed)', 'act(light_on)', 'sleep(0.02)'],
        B('קודם קוראים את הקלט, אחר כך מחליטים מה לעשות, ואז מפעילים. ההמתנה הקצרה בסוף שומרת על קצב קבוע.', 'First read the inputs, then decide what to do, then act. The short wait at the end keeps a steady pace.')),
      Q(B('למה כדאי לחלק את התוכנית לפונקציות קטנות, שלכל אחת תפקיד אחד?', 'Why split the program into small functions with one job each?'),
        [B('קל יותר לבדוק ולשנות חלק אחד בלי לשבור את השאר', 'It is easier to test and change one part without breaking the rest'), B('התוכנית רצה מהר יותר', 'The program runs faster'), B('MicroPython מחייב את זה', 'MicroPython requires it')], 0,
        B('כשכל חלק קטן ונפרד, אפשר לבדוק אותו לבד ולמצוא תקלה מהר.', 'When each part is small and separate, it can be tested on its own, and a fault found quickly.'))
    ],
    D2: [
      FILL(B('"דופק החיים": הלד שעל הלוח מראה שהתוכנית רצה.', 'The "heartbeat": the board\'s LED shows that the program is running.'),
        ['status = Pin("LED", Pin.OUT)', '', 'while True:', '    ___', '    sleep(0.5)'],
        ['status.toggle()', 'status.on()', 'print(status)', 'status = 1'], 0,
        B('`toggle` מחליף מצב בכל סיבוב, ולכן הלד מהבהב. `on` רק משאיר אותו דולק, ואז לא רואים אם התוכנית נתקעה.', '`toggle` switches state on every round, so the LED blinks. `on` just leaves it lit, and then you cannot see whether the program got stuck.')),
      Q(B('התוכנית שמורה כ-`main.py` ורצה ממטען, בלי מחשב. איך יודעים שהיא חיה?', 'The program is saved as `main.py` and runs from a charger, with no computer. How do you know it is alive?'),
        [B('הלד שעל הלוח מהבהב', 'The board\'s LED blinks'), B('ההדפסות מופיעות ב-Thonny', 'The prints appear in Thonny'), B('אי אפשר לדעת', 'You cannot tell')], 0,
        B('בלי מחשב אין לאן להדפיס. הלד המהבהב הוא הסימן שהלולאה ממשיכה לרוץ.', 'With no computer there is nowhere to print. The blinking LED is the sign that the loop keeps running.'))
    ],
    D3: [
      OUT(B('לוח B קרא מה-UART את השורה "on" עם תו סוף שורה.', 'Board B read the line "on" from the UART, with an end-of-line character.'),
        ['msg = "on\\n"', 'print(msg.strip() == "on")'], 'True',
        B('`strip` מוריד את תו סוף השורה, ואז נשאר בדיוק "on". בלי `strip` ההשוואה הייתה נכשלת.', '`strip` removes the end-of-line character, leaving exactly "on". Without `strip` the comparison would fail.'))
    ],
    T1: [
      FILL(B('תקנו את הבאג: הלד מחובר לפין הפיזי 20.', 'Fix the bug: the LED is wired to physical pin 20.'),
        ['from machine import Pin', 'from time import sleep', '', '___      # the LED is on physical pin 20', '', 'while True:', '    led.toggle()', '    sleep(0.5)'],
        ['led = Pin(15, Pin.OUT)', 'led = Pin(20, Pin.OUT)', 'led = Pin("20", Pin.OUT)', 'led = Pin(19, Pin.OUT)'], 0,
        B('`Pin` מקבל את מספר ה-GP. פין פיזי 20 הוא GP15.', '`Pin` takes the GP number. Physical pin 20 is GP15.')),
      Q(B('התוכנית רצה בלי שום הודעת שגיאה, אבל לא קורה כלום. מה זה מלמד?', 'The program runs with no error message, but nothing happens. What does that tell you?'),
        [B('קוד תקין יכול לעשות את הדבר הלא נכון. בודקים פינים וחיווט', 'Valid code can do the wrong thing. Check the pins and wiring'), B('הלוח מקולקל', 'The board is broken'), B('צריך להתקין מחדש את MicroPython', 'MicroPython must be reinstalled')], 0,
        B('MicroPython לא יודע מה חיברתם. הוא מפעיל את הפין שביקשתם, גם אם אין עליו כלום.', 'MicroPython does not know what you wired. It switches the pin you asked for, even if nothing is on it.'))
    ],
    T2: [
      FILL(B('תקנו את הבאג: הכפתור מחובר בין GP14 לאדמה.', 'Fix the bug: the button is wired between GP14 and ground.'),
        ['led = Pin(15, Pin.OUT)', '___', '', 'while True:', '    led.value(not button.value())', '    sleep(0.1)'],
        ['button = Pin(14, Pin.IN, Pin.PULL_UP)', 'button = Pin(14, Pin.IN)', 'button = Pin(14, Pin.OUT)', 'button = Pin(15, Pin.IN, Pin.PULL_UP)'], 0,
        B('בלי `PULL_UP` הפין צף כשהכפתור משוחרר. עם `PULL_UP` הוא יציב על 1, והכפתור מוריד אותו ל-0.', 'Without `PULL_UP` the pin floats while the button is released. With `PULL_UP` it stays at 1, and the button pulls it to 0.')),
      Q(B('למה כניסה צפה "רוקדת" יותר כשמקרבים אליה יד?', 'Why does a floating input "dance" more when a hand comes near?'),
        [B('הפין הפתוח קולט רעש חשמלי מהסביבה, גם מהגוף', 'The open pin picks up electrical noise from around it, the body included'), B('בגלל החום של היד', 'Because of the hand\'s heat'), B('בגלל האור', 'Because of the light')], 0,
        B('פין שלא מחובר לשום מתח רגיש מאוד לשדות חשמליים קטנים, ולכן הערך שלו מקרי.', 'A pin tied to no voltage is very sensitive to small electric fields, so its value is random.'))
    ],
    T3: [
      OUT(B('הלולאה בודקת את הכפתור פעם בשנייה. כמה בדיקות יהיו ב-5 שניות?', 'The loop checks the button once a second. How many checks are there in 5 seconds?'),
        ['checks = 0', 'for second in range(5):', '    checks = checks + 1', 'print(checks)'], '5',
        B('רק 5 בדיקות. לחיצה של חצי שנייה שנופלת בין שתי בדיקות לא נראית בכלל.', 'Only 5 checks. A half-second press that falls between two checks is never seen.')),
      Q(B('מה התיקון הנכון ב-T3?', 'What is the right fix in T3?'),
        [B('המתנה קצרה, כמו `sleep(0.02)`, וזיהוי של רגע הלחיצה', 'A short wait, such as `sleep(0.02)`, and catching the moment of the press'), B('המתנה ארוכה יותר', 'A longer wait'), B('למחוק את `PULL_UP`', 'Delete `PULL_UP`')], 0,
        B('המתנה קצרה בודקת את הכפתור לעיתים קרובות, וזיהוי רגע הלחיצה (כמו ב-A4) מונע ספירה כפולה.', 'A short wait checks the button often, and catching the moment of the press (as in A4) prevents counting twice.'))
    ],
    T4: [
      OUT(B('הכפתור בקצה. מה מדפיס הקוד עם הבאג?', 'The knob is at the end. What does the buggy code print?'),
        ['raw = 65535', 'print(round(raw / 1023 * 100))'], '6406',
        B('הקוד מחלק ב-1023, אבל `read_u16` מגיע עד 65535. לכן התוצאה גדולה פי 64 מ-100.', 'The code divides by 1023, but `read_u16` goes up to 65535. So the result is 64 times bigger than 100.')),
      FILL(B('תקנו את חישוב האחוזים.', 'Fix the percentage calculation.'),
        ['pot = ADC(26)', '', 'while True:', '    ___', '    print(round(percent), "%")'],
        ['percent = pot.read_u16() / 65535 * 100', 'percent = pot.read_u16() / 1023 * 100', 'percent = pot.read_u16() * 100', 'percent = pot / 65535 * 100'], 0,
        B('מחלקים בערך הגבוה ביותר האפשרי, 65535, ומכפילים ב-100.', 'Divide by the highest possible value, 65535, and multiply by 100.'))
    ],
    T5: [
      OUT(B('איך הופכים ערך בין 0 ל-255 לערך בין 0 ל-65535?', 'How do you turn a value from 0 to 255 into a value from 0 to 65535?'),
        ['level = 255', 'print(level * 257)'], '65535',
        B('255 כפול 257 הם בדיוק 65535, ולכן הכפלה ב-257 מותחת את כל הטווח.', '255 times 257 is exactly 65535, so multiplying by 257 stretches the whole range.')),
      Q(B('עם `duty_u16(255)`, כמה מהזמן הלד דולק?', 'With `duty_u16(255)`, how much of the time is the LED on?'),
        [B('פחות מחצי אחוז', 'Less than half a percent'), B('כל הזמן', 'All the time'), B('רבע מהזמן', 'A quarter of the time')], 0,
        B('255 מתוך 65535 הם בערך 0.4%, ולכן הלד כמעט כבוי.', '255 out of 65535 is about 0.4%, so the LED is almost off.'))
    ],
    T6: [
      ORD(B('סדרו את השורות של בדיקת המסך.', 'Put the lines of the display check in order.'),
        ['i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'print([hex(a) for a in i2c.scan()])', 'oled = SSD1306_I2C(128, 64, i2c)', 'oled.text("Hello", 0, 0)', 'oled.show()'],
        B('קודם מגדירים את האפיק, סורקים כדי לראות שהמסך עונה, ורק אז יוצרים את המסך, כותבים ומציגים.', 'First set up the bus, scan to see that the display answers, and only then create the display, write and show.')),
      Q(B('הסריקה הדפיסה `[]`. מה בודקים קודם?', 'The scan printed `[]`. What do you check first?'),
        [B('את החיווט של SDA ו-SCL, ואת הפינים שבקוד', 'The SDA and SCL wiring, and the pins in the code'), B('את הטקסט שעל המסך', 'The text on the display'), B('את גרסת הספרייה', 'The library version')], 0,
        B('רשימה ריקה אומרת שאף רכיב לא ענה, ולכן הבעיה בחיבור או בפינים, עוד לפני הספרייה.', 'An empty list says no part answered, so the problem is in the connection or the pins, before the library is involved.'))
    ],
    R1: [
      OUT(B('עברו 500 אלפיות מאז ההבהוב הקודם?', 'Have 500 milliseconds passed since the last blink?'),
        ['from time import ticks_diff', 'print(ticks_diff(1500, 1000) >= 500)'], 'True',
        B('`ticks_diff(1500, 1000)` הוא 500, ו-500 גדול או שווה ל-500, ולכן הגיע הזמן להבהב.', '`ticks_diff(1500, 1000)` is 500, and 500 is greater than or equal to 500, so it is time to blink.'))
    ],
    R2: [
      FILL(B('הפונקציה צריכה לשנות את המונה שמחוץ לה.', 'The function has to change the counter that is outside it.'),
        ['presses = 0', '', 'def on_press(pin):', '    ___', '    presses = presses + 1'],
        ['global presses', 'presses = 0', 'return presses', 'print(presses)'], 0,
        B('בלי `global`, השורה `presses = presses + 1` יוצרת משתנה מקומי חדש, ו-Python עוצר בשגיאה.', 'Without `global`, the line `presses = presses + 1` makes a new local variable, and Python stops with an error.'))
    ],
    R3: [
      ORD(B('סדרו את השורות כך שהלד יהבהב בזמן שמשימת הכפתור רצה.', 'Put the lines in order so the LED blinks while the button task runs.'),
        ['async def main():', '    asyncio.create_task(blink(led, 500))', '    await watch_button()', 'asyncio.run(main())'],
        B('יוצרים את משימת ההבהוב לפני ה-`await`: משימת הכפתור לא מסתיימת, ושורה שאחריה לא תרוץ אף פעם.', 'Create the blink task before the `await`: the button task never finishes, so a line after it would never run.'))
    ]
  };

  P.lessons.forEach(function (l) {
    if (MORE[l.id]) l.quiz = (l.quiz || []).concat(MORE[l.id]);
  });
})(window.PICO);
