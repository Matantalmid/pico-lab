/* Practising a lesson in the Wokwi simulator, before or without hardware.
   For each lesson that Wokwi can run (tracks A-H and T) there is a ready diagram.json (the circuit) and the lesson's code as main.py.
   The student opens Wokwi's MicroPython Pico template, pastes both, and presses play.
   Part types and pin names follow docs.wokwi.com (checked 2026-11-21). The board is "board-pi-pico-2" with the MicroPython
   "env" attribute copied from Wokwi's own MicroPython Pico template; checked in Wokwi on 2026-11-21 (lesson A3 ran).
   A lesson may also carry `wokwi: 'https://wokwi.com/projects/...'`, a saved public project, shown as a link. */
(function (P) {
  'use strict';
  var T = P.t, R = function (v) { return P.rich(T(v)); };
  var B = function (he, en) { return { he: he, en: en }; };
  var TEMPLATE = 'https://wokwi.com/projects/new/micropython-pi-pico';

  /* ---------- building a diagram ---------- */
  var ENV = 'micropython-20260406-v1.28.0';      // the MicroPython build Wokwi's own template used on 2026-11-21
  var LIB_URL = 'https://raw.githubusercontent.com/micropython/micropython-lib/master/micropython/drivers/display/ssd1306/ssd1306.py';
  function Diagram(board) { this.parts = [{ type: board || 'board-pi-pico-2', id: 'pico', top: 0, left: 0, attrs: { env: ENV } }]; this.conn = []; }
  Diagram.prototype.part = function (id, type, attrs, left, top) { this.parts.push({ type: type, id: id, top: top, left: left, attrs: attrs || {} }); return this; };
  Diagram.prototype.wire = function (a, b, color) { this.conn.push([a, b, color || 'green', []]); return this; };
  Diagram.prototype.json = function () { return JSON.stringify({ version: 1, author: 'Pico 2 Lab', editor: 'wokwi', parts: this.parts, connections: this.conn, dependencies: {} }, null, 2); };
  /* an LED through a 330 Ω resistor from a GP pin to GND */
  function led(d, id, gp, color, top) {
    d.part('r' + id, 'wokwi-resistor', { value: '330' }, 150, top + 20).part('led' + id, 'wokwi-led', { color: color || 'red' }, 230, top);
    d.wire('pico:GP' + gp, 'r' + id + ':1', 'orange').wire('r' + id + ':2', 'led' + id + ':A', 'orange').wire('led' + id + ':C', 'pico:GND.4', 'black');
  }
  /* a push button between a GP pin and GND (the code uses PULL_UP) */
  function button(d, gp, top) { d.part('btn1', 'wokwi-pushbutton', { color: 'blue' }, 150, top).wire('pico:GP' + gp, 'btn1:1.l', 'blue').wire('btn1:2.r', 'pico:GND.4', 'black'); }
  function pot(d, gp, top) { d.part('pot1', 'wokwi-potentiometer', {}, 150, top).wire('pot1:VCC', 'pico:3V3', 'red').wire('pot1:SIG', 'pico:GP' + gp, 'green').wire('pot1:GND', 'pico:GND.7', 'black'); }
  function buzzer(d, gp, top) { d.part('bz1', 'wokwi-buzzer', { volume: '0.1' }, 280, top).wire('bz1:2', 'pico:GP' + gp, 'purple').wire('bz1:1', 'pico:GND.4', 'black'); }
  function oled(d, top) { d.part('oled1', 'board-ssd1306', {}, 160, top).wire('oled1:VCC', 'pico:3V3', 'red').wire('oled1:GND', 'pico:GND.2', 'black').wire('oled1:SDA', 'pico:GP4', 'blue').wire('oled1:SCL', 'pico:GP5', 'yellow'); }

  var N = {
    divider: B('ב-Wokwi חיישן המרחק מחובר ישירות ל-GP2, בלי מחלק המתח. בלוח אמיתי מחלק המתח הוא חובה, כי ECHO יוצא ב-5V.', 'In Wokwi the distance sensor goes straight to GP2, without the voltage divider. On a real board the divider is a must: ECHO comes out at 5 V.'),
    ldr: B('ב-Wokwi יש מודול של חיישן אור עם יציאה אנלוגית (AO), במקום LDR ונגד. בזמן הריצה לחצו על החיישן כדי לשנות את כמות האור.', 'Wokwi has a light-sensor module with an analog output (AO), instead of an LDR and a resistor. While it runs, click the sensor to change the amount of light.'),
    ldrInv: B('שימו לב: המודול של Wokwi קורא הפוך מהמעגל שבשיעור. באור חזק המספר נמוך (כ-16%), ובחושך הוא גבוה (כ-93%). לכן ב-Wokwi הלד יידלק דווקא כשיש אור. כדי לראות את ההתנהגות שבשיעור, החליפו ב-Wokwi את `light < THRESHOLD` ב-`light > 100 - THRESHOLD`.', 'Note: Wokwi\'s module reads the other way round from the lesson\'s circuit. In bright light the number is low (about 16%), and in the dark it is high (about 93%). So in Wokwi the LED lights in the light. To see the lesson\'s behaviour, in Wokwi replace `light < THRESHOLD` with `light > 100 - THRESHOLD`.'),
    servoEnd: B('הסרוו של Wokwi מקבל פולסים של עד 2.4 מילישניות בערך. כשהכפתור בקצה, הקוד שולח 2.5 מילישניות, ו-Wokwi מתעלם מהן. לכן ממש בסוף הסיבוב הזרוע נעצרת קצת לפני 180°. סרוו אמיתי מגיב גם ל-2.5.', 'Wokwi\'s servo accepts pulses up to about 2.4 milliseconds. At the end of the knob the code sends 2.5 milliseconds, which Wokwi ignores, so right at the end of the turn the arm stops a little short of 180°. A real servo responds to 2.5 too.'),
    float: B('ב-Wokwi כניסה צפה לא "רוקדת": היא קוראת 0 באופן קבוע, ולכן הלד פשוט דולק כל הזמן. הקפיצות האקראיות מופיעות רק בלוח אמיתי.', 'In Wokwi a floating input does not "dance": it reads a steady 0, so the LED simply stays on. The random jumps appear only on a real board.'),
    lib: B('הקוד צריך את הספרייה ssd1306. כך מוסיפים אותה ב-Wokwi: לחצו על החץ שליד הלשוניות, בחרו New file, קראו לקובץ `ssd1306.py`, והדביקו בו את התוכן של הקובץ הרשמי (הכפתור "הקובץ ssd1306.py הרשמי" למעלה).', 'The code needs the ssd1306 library. In Wokwi: click the arrow beside the tabs, choose New file, name it `ssd1306.py`, and paste in the contents of the official file (the "official ssd1306.py file" button above).'),
    pico1: B('בשיעור הזה המעגל משתמש בלוח ה-Pico הראשון של Wokwi, ולא ב-Pico 2. בסימולציה של Pico 2, המסך והחיישן יחד גורמים לשגיאה `ETIMEDOUT` (זו תקלה של הסימולטור, לא של הקוד). על ה-Pico הראשון הקוד רץ בלי שגיאות, ועל לוח Pico 2 אמיתי הוא אמור לרוץ כרגיל.', 'In this lesson the circuit uses Wokwi\'s first Pico board, not the Pico 2. In the Pico 2 simulation the display and the sensor together cause an `ETIMEDOUT` error (a simulator fault, not a code one). On the first Pico the code runs with no errors, and on a real Pico 2 board it should run as usual.'),
    pico1b: B('בשיעור הזה המעגל משתמש בלוח ה-Pico הראשון של Wokwi, ולא ב-Pico 2. בסימולציה של Pico 2 הקוד הזה נכשל בשגיאות מוזרות שאין להן קשר אליו (זו תקלה של הסימולטור). על ה-Pico הראשון הוא רץ כמו שצריך, ועל לוח Pico 2 אמיתי הוא אמור לרוץ כרגיל.', 'In this lesson the circuit uses Wokwi\'s first Pico board, not the Pico 2. In the Pico 2 simulation this code fails with odd errors that have nothing to do with it (a simulator fault). On the first Pico it runs as it should, and on a real Pico 2 board it should run as usual.'),
    relay: B('ב-Wokwi הממסר מדליק לד צהוב, במקום נורה וסוללות. לחצו על הכפתור הכחול.', 'In Wokwi the relay switches a yellow LED on, instead of a bulb and batteries. Click the blue button.'),
    motor: B('ב-Wokwi אין מנוע DC ודרייבר. במקומם יש שני לדים: הירוק (IN1) מראה את המהירות קדימה, והאדום (IN2) מראה את המהירות אחורה. ככל שהלד בהיר יותר, כך המנוע היה מסתובב מהר יותר.', 'Wokwi has no DC motor and driver. Instead there are two LEDs: the green one (IN1) shows the forward speed, and the red one (IN2) the reverse speed. The brighter the LED, the faster the motor would spin.'),
    stepper: B('ב-Wokwi אין את המנוע 28BYJ-48 ואת לוח הדרייבר שלו. במקומם יש מנוע צעד אחר, שמחובר ישירות לפינים ומוגדר כך שסיבוב שלם הוא 4096 צעדים, כמו במנוע שבשיעור. המספר שעל המנוע הוא הזווית.', 'Wokwi does not have the 28BYJ-48 motor and its driver board. Instead there is another stepper motor, wired straight to the pins and set so that a full turn is 4096 steps, as with the lesson\'s motor. The number on the motor is the angle.'),
    joy: B('לחצו על החצים של הג\'ויסטיק כדי להטות אותו, ועל המרכז שלו כדי ללחוץ עליו. ב-Wokwi כל הטיה היא הטיה מלאה, ולכן תראו רק את התנועה המהירה.', 'Click the joystick\'s arrows to tilt it, and its centre to press it. In Wokwi every tilt is a full tilt, so you see only the fast movement.'),
    keypad: B('לחצו בעכבר על המקשים של לוח המקשים.', 'Click the keys of the keypad with the mouse.'),
    encoder: B('לחצו על החצים של המקודד כדי לסובב אותו בצעד אחד, ועל הכפתור שלו כדי ללחוץ עליו.', 'Click the encoder\'s arrows to turn it one step, and its knob to press it.'),
    rtc: B('ב-Wokwi אין DS3231. במקומו יש DS1307, שעונה באותה כתובת (0x68) ושומר את השעה באותם אוגרים, ולכן הקוד לא משתנה. השעון מתחיל מהשעה של המחשב. כאן אי אפשר לבדוק מה קורה כשמנתקים את החשמל.', 'Wokwi has no DS3231. Instead there is a DS1307, which answers at the same address (0x68) and keeps the time in the same registers, so the code does not change. The clock starts from the computer\'s time. Unplugging cannot be tried here.'),
    libTm: B('הקוד צריך את הקובץ `pico_tm1637.py`. כך מוסיפים אותו ב-Wokwi: לחצו על החץ שליד הלשוניות, בחרו New file, קראו לקובץ `pico_tm1637.py`, והדביקו בו את הקוד מהעמוד של תצוגת הספרות (הכפתור למעלה).', 'The code needs the file `pico_tm1637.py`. In Wokwi: click the arrow beside the tabs, choose New file, name it `pico_tm1637.py`, and paste in the code from the digit display\'s page (the button above).'),
    dimmer: B('ב-Wokwi אין MOSFET ואין פס לדים של 12V. במקומם יש לד לבן על GP21, שמקבל את אותו אות PWM.', 'Wokwi has no MOSFET and 12 V LED strip. Instead there is a white LED on GP21, which gets the same PWM signal.'),
    scale: B('לחצו על המגבר והזיזו את המשקל (0 עד 5 ק"ג). המגבר של Wokwi נותן רק כ-420 צעדים לקילו, הרבה פחות מתא עומס אמיתי. לכן כש-`SCALE = 400`, קילו אחד מוצג כ-1 g. כדי לראות גרמים ב-Wokwi, שנו את השורה ל-`SCALE = 0.42`. את כפתור האיפוס החזיקו לחוץ כשנייה.', 'Click the amplifier and move the weight (0 to 5 kg). Wokwi\'s amplifier gives only about 420 steps per kilo, far fewer than a real load cell. So with `SCALE = 400` one kilo shows as 1 g. To see grams in Wokwi, change it to `SCALE = 0.42`. Hold the zero button for about a second.'),
    walkLed: B('הלד של הולכי הרגל הוא הלד הלבן. הכפתור הכחול הוא הכפתור של הולכי הרגל.', 'The pedestrian LED is the white one. The blue button is the pedestrian button.'),
    ds: B('בזמן הריצה לחצו על החיישן ושנו את הטמפרטורה בפס הגלילה. כדי להדליק את הלד, העלו אותה מעל 28 מעלות.', 'While it runs, click the sensor and change the temperature with the slider. To light the LED, raise it above 28 degrees.'),
    soilPot: B('ב-Wokwi אין חיישן לחות קרקע. פוטנציומטר על GP28 מחליף אותו: ככל שמסובבים אותו למעלה, הקריאה עולה והאדמה "יבשה" יותר. הממסר מדליק לד צהוב במקום משאבה.', 'Wokwi has no soil moisture sensor. A potentiometer on GP28 stands in for it: the further up it is turned, the higher the reading and the "drier" the soil. The relay lights a yellow LED instead of a pump.'),
    remote: B('לחצו על הכפתורים של השלט שבסימולציה. השלט של Wokwi שולח את הביטים של כל קוד בסדר הפוך משלט אמיתי, ולכן רק הקוד של 2 זהה לקוד שבשיעור. ב-Wokwi הקודים הם: 1 הוא `0xFF0CF3`, 2 הוא `0xFF18E7`, 3 הוא `0xFF5EA1` ו-0 הוא `0xFF16E9`. העתיקו אותם למילון `COLORS`, בדיוק כמו שהייתם עושים עם שלט אמיתי.', 'Click the buttons of the remote in the simulation. Wokwi\x27s remote sends the bits of each code in the opposite order to a real remote, so only the code of 2 matches the lesson. In Wokwi the codes are: 1 is `0xFF0CF3`, 2 is `0xFF18E7`, 3 is `0xFF5EA1` and 0 is `0xFF16E9`. Copy them into the `COLORS` dictionary, just as you would with a real remote.'),
    libLcd: B('הקוד צריך את הקובץ `pico_lcd.py`. ב-Wokwi: לחצו על החץ שליד הלשוניות, בחרו New file, קראו לקובץ `pico_lcd.py`, והדביקו בו את הקוד מהעמוד של מסך ה-LCD (הכפתור למעלה).', 'The code needs the file `pico_lcd.py`. In Wokwi: click the arrow beside the tabs, choose New file, name it `pico_lcd.py`, and paste in the code from the LCD\'s page (the button above).'),
    libSd: B('הקוד צריך את הקובץ `sdcard.py`. ב-Wokwi: לחצו על החץ שליד הלשוניות, בחרו New file, קראו לקובץ `sdcard.py`, והדביקו בו את התוכן של הקובץ הרשמי (הכפתור למעלה). Wokwi יוצר לבד כרטיס מפורמט של 8MB. הכרטיס של Wokwi לא עונה לפקודה 16 (קביעת גודל בלוק), ולכן `sdcard.py` עוצר עם השגיאה `can\'t set 512 block size`. כרטיס אמיתי עונה לה. כדי לעקוף את זה רק בסימולטור, הוסיפו ב-`main.py`, אחרי שורת ה-`import`, את חמש השורות שלמטה.', 'The code needs the file `sdcard.py`. In Wokwi: click the arrow beside the tabs, choose New file, name it `sdcard.py`, and paste in the contents of the official file (the button above). Wokwi creates a formatted 8 MB card by itself. Wokwi\'s card does not answer command 16 (set block size), so `sdcard.py` stops with the error `can\'t set 512 block size`. A real card answers it. To work around this in the simulator only, add the five lines below to `main.py`, after the `import` line.'),
    libSdFix: { pre: '_orig = sdcard.SDCard.cmd\ndef _cmd(self, c, *a, **k):\n    r = _orig(self, c, *a, **k)\n    return 0 if c == 16 else r      # Wokwi only\nsdcard.SDCard.cmd = _cmd' },
    mpu: B('בזמן הריצה לחצו על החיישן ושנו את התאוצה בצירים X ו-Y כדי "להטות" אותו.', 'While it runs, click the sensor and change the acceleration on the X and Y axes to "tilt" it.'),
    boardLed: B('ב-Wokwi הלד שעל הלוח נראה כנקודה ירוקה קטנה ליד מחבר ה-USB.', 'In Wokwi the board\'s LED is the small green dot next to the USB connector.'),
    pir: B('בזמן הריצה לחצו על חיישן התנועה ובחרו Simulate motion.', 'While it runs, click the motion sensor and choose Simulate motion.'),
    dht: B('בזמן הריצה לחצו על החיישן כדי לשנות את הטמפרטורה ואת הלחות.', 'While it runs, click the sensor to change the temperature and humidity.'),
    hc: B('בזמן הריצה לחצו על חיישן המרחק והזיזו את המרחק.', 'While it runs, click the distance sensor and move the distance.'),
    pot: B('בזמן הריצה גררו את הידית של הפוטנציומטר.', 'While it runs, drag the potentiometer\'s knob.'),
    servo: B('הסרוו מקבל מתח מ-VBUS, כמו בשיעור.', 'The servo is fed from VBUS, as in the lesson.')
  };
  /* the circuits, by lesson */
  var C = {
    led: function (d) { led(d, 1, 15, 'red', 0); },
    traffic: function (d) { led(d, 1, 15, 'red', 0); led(d, 2, 14, 'yellow', 60); led(d, 3, 13, 'limegreen', 120); },
    ledBtn: function (d) { led(d, 1, 15, 'red', 0); button(d, 14, 90); },
    pot: function (d) { pot(d, 26, 40); },
    potLed: function (d) { pot(d, 26, 90); led(d, 1, 15, 'red', 0); },
    ldr: function (d) { d.part('ldr1', 'wokwi-photoresistor-sensor', {}, 150, 100).wire('ldr1:VCC', 'pico:3V3', 'red').wire('ldr1:GND', 'pico:GND.7', 'black').wire('ldr1:AO', 'pico:GP27', 'green'); led(d, 1, 15, 'red', 0); },
    bell: function (d) { buzzer(d, 13, 0); button(d, 14, 90); },
    servo: function (d) { d.part('servo1', 'wokwi-servo', {}, 200, 0).wire('servo1:PWM', 'pico:GP10', 'orange').wire('servo1:V+', 'pico:VBUS', 'red').wire('servo1:GND', 'pico:GND.3', 'black'); pot(d, 26, 120); },
    parking: function (d) { d.part('sonar1', 'wokwi-hc-sr04', { distance: '100' }, 150, 0).wire('sonar1:VCC', 'pico:VBUS', 'red').wire('sonar1:TRIG', 'pico:GP3', 'blue').wire('sonar1:ECHO', 'pico:GP2', 'green').wire('sonar1:GND', 'pico:GND.1', 'black'); buzzer(d, 13, 130); },
    alarm: function (d) { d.part('pir1', 'wokwi-pir-motion-sensor', {}, 150, 120).wire('pir1:VCC', 'pico:VBUS', 'red').wire('pir1:OUT', 'pico:GP22', 'green').wire('pir1:GND', 'pico:GND.6', 'black'); led(d, 1, 15, 'red', 0); buzzer(d, 13, 60); },
    display: function (d) { oled(d, 0); },
    weather: function (d) { oled(d, 0); d.part('dht1', 'wokwi-dht22', {}, 160, 110).wire('dht1:VCC', 'pico:3V3', 'red').wire('dht1:SDA', 'pico:GP6', 'green').wire('dht1:GND', 'pico:GND.2', 'black'); },
    /* tracks E-H */
    relay: function (d) {
      d.part('relay1', 'wokwi-relay-module', {}, 160, 0).wire('relay1:VCC', 'pico:VBUS', 'red').wire('relay1:GND', 'pico:GND.6', 'black').wire('relay1:IN', 'pico:GP21', 'orange');
      /* the "bulb": an LED that the relay's contact switches on from 3V3 */
      d.part('rL', 'wokwi-resistor', { value: '330' }, 330, 60).part('ledL', 'wokwi-led', { color: 'yellow' }, 400, 40);
      d.wire('relay1:COM', 'pico:3V3', 'red').wire('relay1:NO', 'rL:1', 'orange').wire('rL:2', 'ledL:A', 'orange').wire('ledL:C', 'pico:GND.7', 'black');
      button(d, 14, 130);
    },
    motorLeds: function (d) { led(d, 1, 20, 'limegreen', 0); led(d, 2, 21, 'red', 60); pot(d, 26, 130); },
    stepper: function (d) {
      d.part('step1', 'wokwi-stepper-motor', { size: '17', arrow: 'orange', display: 'angle', gearRatio: '256:25' }, 180, -40);
      d.wire('step1:A+', 'pico:GP10', 'blue').wire('step1:B+', 'pico:GP11', 'green').wire('step1:A-', 'pico:GP12', 'yellow').wire('step1:B-', 'pico:GP13', 'purple');
      button(d, 14, 160); d.part('btn2', 'wokwi-pushbutton', { color: 'green' }, 150, 220).wire('pico:GP15', 'btn2:1.l', 'green').wire('btn2:2.r', 'pico:GND.4', 'black');
    },
    joystick: function (d) {
      d.part('joy1', 'wokwi-analog-joystick', {}, 160, 120).wire('joy1:VCC', 'pico:3V3', 'red').wire('joy1:GND', 'pico:GND.7', 'black')
        .wire('joy1:HORZ', 'pico:GP26', 'green').wire('joy1:VERT', 'pico:GP27', 'blue').wire('joy1:SEL', 'pico:GP22', 'orange');
      d.part('servo1', 'wokwi-servo', {}, 200, -100).wire('servo1:PWM', 'pico:GP10', 'orange').wire('servo1:V+', 'pico:VBUS', 'red').wire('servo1:GND', 'pico:GND.3', 'black');
      d.part('servo2', 'wokwi-servo', {}, 200, 0).wire('servo2:PWM', 'pico:GP11', 'orange').wire('servo2:V+', 'pico:VBUS', 'red').wire('servo2:GND', 'pico:GND.3', 'black');
    },
    rgb: function (d) {
      d.part('rgb1', 'wokwi-rgb-led', { common: 'cathode' }, 200, 0).wire('rgb1:R', 'pico:GP11', 'red').wire('rgb1:G', 'pico:GP12', 'green').wire('rgb1:B', 'pico:GP13', 'blue').wire('rgb1:COM', 'pico:GND.4', 'black');
      pot(d, 26, 110);
    },
    strip: function (d) { d.part('strip1', 'wokwi-led-strip', { pixels: '8' }, -60, -90).wire('strip1:VDD', 'pico:VBUS', 'red').wire('strip1:DIN', 'pico:GP0', 'green').wire('strip1:VSS', 'pico:GND.1', 'black'); button(d, 14, 90); },
    keypad: function (d) {
      d.part('kp1', 'wokwi-membrane-keypad', {}, -330, -40);
      [2, 3, 4, 5].forEach(function (gp, i) { d.wire('kp1:R' + (i + 1), 'pico:GP' + gp, 'orange'); });
      [6, 7, 8, 9].forEach(function (gp, i) { d.wire('kp1:C' + (i + 1), 'pico:GP' + gp, 'blue'); });
      led(d, 1, 15, 'limegreen', 0); buzzer(d, 13, 90);
    },
    encoder: function (d) { oled(d, 0); d.part('enc1', 'wokwi-ky-040', {}, 160, 110).wire('enc1:CLK', 'pico:GP10', 'green').wire('enc1:DT', 'pico:GP11', 'blue').wire('enc1:SW', 'pico:GP12', 'orange').wire('enc1:VCC', 'pico:3V3', 'red').wire('enc1:GND', 'pico:GND.4', 'black'); },
    clock: function (d) {
      d.part('rtc1', 'wokwi-ds1307', {}, 160, 0).wire('rtc1:5V', 'pico:3V3', 'red').wire('rtc1:GND', 'pico:GND.2', 'black').wire('rtc1:SDA', 'pico:GP4', 'blue').wire('rtc1:SCL', 'pico:GP5', 'yellow');
      d.part('tm1', 'wokwi-tm1637-7segment', {}, 160, 110).wire('tm1:CLK', 'pico:GP20', 'green').wire('tm1:DIO', 'pico:GP21', 'orange').wire('tm1:VCC', 'pico:3V3', 'red').wire('tm1:GND', 'pico:GND.6', 'black');
    },
    dimmer: function (d) { led(d, 1, 21, 'white', 0); pot(d, 26, 90); },
    scale: function (d) { oled(d, 0); d.part('hx1', 'wokwi-hx711', { type: '5kg' }, 160, 110).wire('hx1:VCC', 'pico:3V3', 'red').wire('hx1:GND', 'pico:GND.6', 'black').wire('hx1:DT', 'pico:GP20', 'green').wire('hx1:SCK', 'pico:GP21', 'orange'); button(d, 14, 220); },
    crossing: function (d) { led(d, 1, 15, 'red', 0); led(d, 2, 14, 'yellow', 60); led(d, 3, 13, 'limegreen', 120); led(d, 4, 12, 'white', 180); button(d, 16, 250); },
    shifter: function (d) {
      d.part('sr1', 'wokwi-74hc595', {}, 160, 40).wire('sr1:DS', 'pico:GP10', 'green').wire('sr1:SHCP', 'pico:GP11', 'yellow').wire('sr1:STCP', 'pico:GP12', 'orange')
        .wire('sr1:VCC', 'pico:3V3', 'red').wire('sr1:MR', 'pico:3V3', 'red').wire('sr1:GND', 'pico:GND.4', 'black').wire('sr1:OE', 'pico:GND.4', 'black');
      for (var i = 0; i < 8; i++) {
        d.part('r' + i, 'wokwi-resistor', { value: '330' }, 300, -60 + i * 30).part('led' + i, 'wokwi-led', { color: 'red' }, 380, -80 + i * 30);
        d.wire('sr1:Q' + i, 'r' + i + ':1', 'orange').wire('r' + i + ':2', 'led' + i + ':A', 'orange').wire('led' + i + ':C', 'pico:GND.6', 'black');
      }
    },
    thermo: function (d) {
      d.part('ds1', 'wokwi-ds18b20', { temperature: '22' }, 170, 120).part('rp', 'wokwi-resistor', { value: '4700' }, 240, 90);
      d.wire('ds1:VCC', 'pico:3V3', 'red').wire('ds1:GND', 'pico:GND.2', 'black').wire('ds1:DQ', 'pico:GP7', 'yellow').wire('rp:1', 'ds1:DQ', 'yellow').wire('rp:2', 'pico:3V3', 'red');
      led(d, 1, 15, 'red', 0);
    },
    watering: function (d) {
      d.part('pot1', 'wokwi-potentiometer', {}, 150, 200).wire('pot1:VCC', 'pico:3V3', 'red').wire('pot1:SIG', 'pico:GP28', 'green').wire('pot1:GND', 'pico:GND.7', 'black');
      d.part('relay1', 'wokwi-relay-module', {}, 160, 0).wire('relay1:VCC', 'pico:VBUS', 'red').wire('relay1:GND', 'pico:GND.6', 'black').wire('relay1:IN', 'pico:GP21', 'orange');
      d.part('rL', 'wokwi-resistor', { value: '330' }, 330, 60).part('ledL', 'wokwi-led', { color: 'yellow' }, 400, 40);
      d.wire('relay1:COM', 'pico:3V3', 'red').wire('relay1:NO', 'rL:1', 'orange').wire('rL:2', 'ledL:A', 'orange').wire('ledL:C', 'pico:GND.7', 'black');
    },
    remote: function (d) {
      d.part('ir1', 'wokwi-ir-receiver', {}, 170, 120).wire('ir1:DAT', 'pico:GP21', 'green').wire('ir1:VCC', 'pico:3V3', 'red').wire('ir1:GND', 'pico:GND.6', 'black');
      d.part('remote1', 'wokwi-ir-remote', {}, 300, 40);
      d.part('rgb1', 'wokwi-rgb-led', { common: 'cathode' }, 200, 0).wire('rgb1:R', 'pico:GP11', 'red').wire('rgb1:G', 'pico:GP12', 'green').wire('rgb1:B', 'pico:GP13', 'blue').wire('rgb1:COM', 'pico:GND.4', 'black');
    },
    lcdBoard: function (d) {
      d.part('lcd1', 'wokwi-lcd1602', { pins: 'i2c' }, 160, -20).wire('lcd1:GND', 'pico:GND.2', 'black').wire('lcd1:VCC', 'pico:VBUS', 'red').wire('lcd1:SDA', 'pico:GP4', 'blue').wire('lcd1:SCL', 'pico:GP5', 'yellow');
      button(d, 14, 120);
    },
    sdlog: function (d) {
      d.part('sd1', 'wokwi-microsd-card', {}, 180, 60).wire('sd1:VCC', 'pico:3V3', 'red').wire('sd1:GND', 'pico:GND.5', 'black')
        .wire('sd1:SCK', 'pico:GP18', 'yellow').wire('sd1:DI', 'pico:GP19', 'blue').wire('sd1:DO', 'pico:GP16', 'green').wire('sd1:CS', 'pico:GP17', 'orange');
    },
    level: function (d) { oled(d, 0); d.part('mpu1', 'wokwi-mpu6050', {}, 170, 110).wire('mpu1:VCC', 'pico:3V3', 'red').wire('mpu1:GND', 'pico:GND.2', 'black').wire('mpu1:SDA', 'pico:GP4', 'blue').wire('mpu1:SCL', 'pico:GP5', 'yellow'); }
  };
  var LESSON = {
    A1: ['led'], A2: ['traffic'], A3: ['ledBtn'], A4: ['ledBtn'],
    B1: ['pot', N.pot], B2: ['potLed', N.pot], B3: ['ldr', N.ldr, N.ldrInv], B4: ['bell'], B5: ['servo', N.pot, N.servo, N.servoEnd],
    C1: ['parking', N.hc, N.divider], C2: ['alarm', N.pir], C3: ['display', N.lib], C4: ['weather', N.lib, N.dht, N.pico1],
    D1: ['ledBtn'], D2: ['led'],
    T1: ['led'], T2: ['ledBtn', N.float], T3: ['ledBtn'], T4: ['pot', N.pot], T5: ['potLed', N.pot], T6: ['display', N.lib],
    E1: ['relay', N.relay], E2: ['motorLeds', N.motor, N.pot], E3: ['stepper', N.stepper], E4: ['joystick', N.joy],
    F1: ['rgb', N.pot], F2: ['strip', N.pico1b], F3: ['keypad', N.keypad, N.pico1b], F4: ['encoder', N.lib, N.encoder, N.pico1b],
    G1: ['clock', N.libTm, N.rtc, N.pico1b], H1: ['dimmer', N.dimmer, N.pot], H5: ['scale', N.lib, N.scale, N.pico1b],
    R1: ['ledBtn', N.boardLed], R2: ['ledBtn', N.pico1b], R3: ['ledBtn', N.boardLed],
    S1: ['crossing', N.walkLed], S2: ['potLed', N.pot], S3: ['potLed', N.pot], S4: ['shifter'], S5: ['thermo', N.ds],
    E5: ['watering', N.soilPot], F5: ['remote', N.remote], F6: ['lcdBoard', N.libLcd], G5: ['sdlog', N.libSd, N.libSdFix], H8: ['level', N.lib, N.mpu]
  };
  var BOARD = { C4: 'wokwi-pi-pico', F2: 'wokwi-pi-pico', F3: 'wokwi-pi-pico', F4: 'wokwi-pi-pico', G1: 'wokwi-pi-pico', H5: 'wokwi-pi-pico', R2: 'wokwi-pi-pico' };   // Wokwi's Pico 2 model crashes on these (I2C timeouts, odd TypeErrors); its first Pico runs them
  var SSD = [B('הקובץ ssd1306.py הרשמי', 'The official ssd1306.py file'), LIB_URL];
  var NEEDS_LIB = { C3: SSD, C4: SSD, T6: SSD, F4: SSD, H5: SSD, H8: SSD, F6: [B('הקוד של pico_lcd.py', 'The pico_lcd.py code'), '#/components/lcd1602'], G5: [B('הקובץ sdcard.py הרשמי', 'The official sdcard.py file'), 'https://raw.githubusercontent.com/micropython/micropython-lib/master/micropython/drivers/storage/sdcard/sdcard.py'], G1: [B('הקוד של pico_tm1637.py', 'The pico_tm1637.py code'), '#/components/tm1637'] };
  var NO_PART = function (he, en) { return B('ב-Wokwi אין ' + he + ', ולכן אין כאן סימולציה לשיעור הזה.', 'Wokwi has no ' + en + ', so this lesson has no simulation here.'); };
  var NO_WIFI = B('Wokwi לא מדמה את שבב ה-Wi-Fi של Pico 2 W, ולכן אין כאן סימולציה לשיעור הזה. דרוש לוח אמיתי.', 'Wokwi does not simulate the Pico 2 W\'s Wi-Fi chip, so this lesson has no simulation here. A real board is needed.');
  var NONE = {
    D3: B('בשיעור הזה יש שני לוחות שמדברים זה עם זה, ו-Wokwi מריץ לוח אחד בלבד בכל פרויקט. לכן אין כאן סימולציה לשיעור הזה.', 'This lesson has two boards talking to each other, and Wokwi runs one board per project. It has no simulation here.'),
    G2: NO_PART('חיישן AHT20', 'AHT20 sensor'),
    G3: B('ב-Wokwi יש קורא RFID, אבל עם הספרייה mfrc522 שבשיעור הוא מחזיר את מספר הכרטיס משובש (כל בית שני חסר), ולכן המנעול אף פעם לא נפתח. זו אי-התאמה בין הסימולטור לספרייה, ולכן אין כאן סימולציה לשיעור הזה.', 'Wokwi has an RFID reader, but with the lesson\'s mfrc522 library it returns the card number garbled (every other byte is missing), so the lock never opens. It is a mismatch between the simulator and the library, so this lesson has no simulation here.'),
    G4: NO_PART('מודול Bluetooth HC-05', 'HC-05 Bluetooth module'),
    H2: NO_PART('מרחיב פינים PCF8574', 'PCF8574 pin expander'),
    H3: NO_PART('ממיר ADS1115', 'ADS1115 converter'),
    H4: NO_PART('מד זרם INA219', 'INA219 current meter'),
    H6: NO_PART('בקר סרוו PCA9685', 'PCA9685 servo controller'),
    H7: NO_PART('מגבר צמד תרמי MAX6675', 'MAX6675 thermocouple amplifier'),
    W1: NO_WIFI, W2: NO_WIFI, W3: NO_WIFI,
    S6: B('אין ב-Wokwi מקלט GPS, ולכן לשיעור הזה אין סימולציה כאן. את פונקציות הפענוח אפשר לבדוק גם בלי לוח: האתגר הראשון מריץ אותן על שורה לדוגמה.', 'Wokwi has no GPS receiver, so this lesson has no simulation here. The parsing functions can be tested without a board too: the first challenge runs them on a sample line.')
  };

  function diagramFor(id) {
    var e = LESSON[id];
    if (!e) return null;
    var d = new Diagram(BOARD[id]);
    C[e[0]](d);
    return d.json();
  }

  var L = {
    h: B('תרגול בסימולטור (Wokwi)', 'Practise in the simulator (Wokwi)'),
    lead: B('Wokwi מריץ את השיעור בדפדפן, בלי לוח ובלי רכיבים. זו דרך טובה להתכונן בבית לפני המעבדה.', 'Wokwi runs the lesson in the browser, with no board and no parts. Good for preparing at home before the lab.'),
    steps: [B('פתחו פרויקט MicroPython חדש ב-Wokwi (הקישור למטה).', 'Open a new MicroPython project in Wokwi (the link below).'),
      B('עברו ללשונית `diagram.json`, מחקו את כל מה שכתוב בה, והדביקו את המעגל שהעתקתם.', 'Go to the `diagram.json` tab, delete everything in it, and paste the circuit you copied.'),
      B('עברו ללשונית `main.py`, מחקו את מה שכתוב בה, והדביקו את הקוד.', 'Go to the `main.py` tab, delete what is in it, and paste the code.'),
      B('לחצו על כפתור ההפעלה הירוק.', 'Press the green play button.')],
    open: B('פרויקט חדש ב-Wokwi', 'A new Wokwi project'), saved: B('פרויקט מוכן ב-Wokwi', 'A ready Wokwi project'),
    copyD: B('העתיקו את המעגל (diagram.json)', 'Copy the circuit (diagram.json)'), copyM: B('העתיקו את הקוד (main.py)', 'Copy the code (main.py)'), copied: B('הועתק', 'Copied'),
    board: B('המעגל משתמש בלוח Pico 2 של Wokwi. אם Wokwi מודיע שגרסת ה-MicroPython לא קיימת, השאירו את שורת ה-`env` שהייתה בתבנית.', 'The circuit uses Wokwi\'s Pico 2 board. If Wokwi says the MicroPython version does not exist, keep the `env` line that was in the template.'),
    board1: B('בשיעור הזה המעגל משתמש בלוח ה-Pico המקורי של Wokwi (ההסבר למטה). אם Wokwi מודיע שגרסת ה-MicroPython לא קיימת, השאירו את שורת ה-`env` שהייתה בתבנית.', 'In this lesson the circuit uses Wokwi\'s original Pico board (explained below). If Wokwi says the MicroPython version does not exist, keep the `env` line that was in the template.'),
    notesH: B('בשיעור הזה', 'In this lesson'),
    missH: B('מה שהסימולטור לא יראה', 'What the simulator will not show'),
    miss: [B('חוט רופף, רגל שלא נכנסה למטריצה או לד שחובר הפוך: ב-Wokwi כל חוט מתחבר בדיוק.', 'A loose wire, a leg that missed the breadboard, or a reversed LED: in Wokwi every wire connects exactly.'),
      B('נפילת מתח כשמנוע או סרוו מתחילים לפעול, וחימום של רכיב שמושך יותר מדי זרם.', 'A voltage drop when a motor or servo starts, and the heat of a part drawing too much current.'),
      B('רעש אמיתי בקריאת ה-ADC ובכניסה צפה.', 'Real noise on an ADC reading and on a floating input.'),
      B('תקלות בשבב עצמו, כמו באג ה-pull-down בשבבי Pico 2 המוקדמים.', 'Faults of the chip itself, such as the pull-down bug of early Pico 2 chips.'),
      B('כבל USB שמתאים לטעינה בלבד, ו-Thonny שלא מוצא את הלוח.', 'A charge-only USB cable, and Thonny not finding the board.')],
    missEnd: B('לכן Wokwi משמש להכנה. ההרצה על הלוח האמיתי היא עדיין החלק החשוב של המעבדה.', 'So Wokwi is preparation. Running on the real board is still the important part of the lab.')
  };

  P.wokwiHTML = function (l) {
    if (NONE[l.id]) return '<h2>' + T(L.h) + '</h2><p class="muted">' + T(NONE[l.id]) + '</p>';
    var e = LESSON[l.id];
    if (!e && !l.wokwi) return '';
    var notes = e ? e.slice(1) : [];
    return '<h2>' + T(L.h) + '</h2><div class="card wk"><p>' + T(L.lead) + '</p><ol>' + L.steps.map(function (s) { return '<li>' + R(s) + '</li>'; }).join('') + '</ol>' +
      '<div class="wk-acts">' + (l.wokwi ? '<a class="btn small" href="' + P.esc(l.wokwi) + '" target="_blank" rel="noopener">' + T(L.saved) + ' ↗</a>' : '') +
      '<a class="btn' + (l.wokwi ? ' ghost' : '') + ' small" href="' + TEMPLATE + '" target="_blank" rel="noopener">' + T(L.open) + ' ↗</a>' +
      (e ? '<button type="button" class="btn ghost small" data-wk="d" data-id="' + l.id + '">' + T(L.copyD) + '</button>' : '') +
      '<button type="button" class="btn ghost small" data-wk="m" data-id="' + l.id + '">' + T(L.copyM) + '</button>' +
      (NEEDS_LIB[l.id] ? '<a class="btn ghost small" href="' + NEEDS_LIB[l.id][1] + '"' + (NEEDS_LIB[l.id][1].charAt(0) === '#' ? '>' + T(NEEDS_LIB[l.id][0]) + '</a>' : ' target="_blank" rel="noopener">' + T(NEEDS_LIB[l.id][0]) + ' ↗</a>') : '') + '</div>' +
      '<p class="muted" style="font-size:.86rem;margin-bottom:0">' + R(BOARD[l.id] ? L.board1 : L.board) + '</p>' +
      (notes.length ? '<p style="margin:10px 0 0"><b>' + T(L.notesH) + ':</b></p><ul>' + notes.map(function (n) { return n.pre ? '<li style="list-style:none"><pre dir="ltr" style="margin:4px 0">' + P.esc(n.pre) + '</pre></li>' : '<li>' + R(n) + '</li>'; }).join('') + '</ul>' : '') + '</div>' +
      '<details class="card wk-miss"><summary><b>' + T(L.missH) + '</b></summary><ul>' + L.miss.map(function (m) { return '<li>' + R(m) + '</li>'; }).join('') + '</ul><p class="muted">' + T(L.missEnd) + '</p></details>';
  };
  P.wokwi = { diagram: diagramFor, LESSON: LESSON };

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-wk]');
    if (!b) return;
    var id = b.getAttribute('data-id'), l = P.lessons.filter(function (x) { return x.id === id; })[0];
    var text = b.getAttribute('data-wk') === 'd' ? diagramFor(id) : l.code.join('\n') + '\n';
    var label = b.textContent;
    P.h.copyText(text, function () { b.textContent = T(L.copied); setTimeout(function () { b.textContent = label; }, 1400); });
  });
})(window.PICO);
