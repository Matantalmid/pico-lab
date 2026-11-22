/* Component catalog, part 4: the remaining sensors, then displays, time,
   identity and communication. Same structure as data-components.js.
   A part with `driver` needs one extra file saved on the board first; the
   page shows that file above the example. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, seat = c.seat, wire = c.wire, loose = c.loose, lead = c.lead, GND = c.GND, V33 = c.V33, V5 = c.V5;

  var SDA = { n: 'SDA', d: B('קו הנתונים של [[i2c|I2C]].', 'The [[i2c|I2C]] data line.') };
  var SCL = { n: 'SCL', d: B('[[clock|קו השעון]] של I2C.', 'The I2C [[clock|clock line]].') };
  var SAVE = function (file) {
    return B('שמרו על הלוח את הקובץ `' + file + '` שמופיע למטה: ב-Thonny הדביקו אותו בחלון חדש, ובחרו File, Save as, Raspberry Pi Pico, עם השם הזה בדיוק.',
      'Save the file `' + file + '` shown below onto the board: in Thonny paste it into a new window, and choose File, Save as, Raspberry Pi Pico, with exactly that name.');
  };

  P.categories.comm = B('תקשורת', 'Communication');

  P.components.push(
    /* ============================================================ sound */
    {
      id: 'sound', name: B('חיישן קול', 'Sound sensor'), iface: ['gpio'], cat: 'sensor', volt: '3.3V',
      summary: B('מזהה רעש חזק, כמו מחיאת כף.', 'Detects a loud noise, such as a clap.'),
      what: [B('מיקרופון קטן על לוח, שמדווח כשיש רעש חזק מספיק. הוא לא מקליט ולא מזהה מילים, אלא רק אומר "היה רעש" או "לא היה רעש".', 'A small microphone on a board that reports when a noise is loud enough. It does not record or recognise words, only "there was a noise" or "there was not".')],
      looks: B('לוח קטן עם מיקרופון עגול כסוף בקצה, בורג כחול קטן לכיוון הרגישות, וארבעה פינים: AO, G, פלוס ו-DO.', 'A small board with a round silver microphone at the end, a small blue screw for setting sensitivity, and four pins: AO, G, plus and DO.'),
      pins: [{ n: 'DO', d: B('יציאה [[digital|דיגיטלית]]: היא משתנה כשהרעש עובר את הסף. בה משתמשים כאן.', 'A [[digital|digital]] output: it changes when the noise passes the threshold. This is what we use here.') }, V33('+'), GND('G'), { n: 'AO', d: B('יציאה אנלוגית. כאן לא מחברים אותה.', 'An analog output. Not connected here.') }],
      how: [B('על הלוח יש רכיב שמשווה את עוצמת הקול לסף שנקבע בעזרת הבורג הכחול. כשהקול חזק מהסף, היציאה DO מתחלפת, ונורית קטנה על הלוח נדלקת.', 'The board has a part that compares the sound level with a threshold set by the blue screw. When the sound is louder than the threshold, the DO output flips and a small light on the board comes on.')],
      needs: [B('מודול חיישן קול KY-038', 'A KY-038 sound sensor module'), B('שלושה חוטי גישור', 'Three jumper wires'), B('מברג קטן', 'A small screwdriver')],
      wiring: [W('+', '3V3', 36), W('G', 'GND', 28), W('DO', 'GP20', 26)],
      steps: [UNPLUG, seat(4), wire('+', '3V3(OUT)', 36), wire('G', 'GND', 28), wire('DO', 'GP20', 26), CHECK,
        B('סובבו את הבורג הכחול עד שהנורית השנייה שעל המודול בדיוק נכבית כשיש שקט. זה הסף.', 'Turn the blue screw until the second light on the module just goes out in silence. That is the threshold.')],
      code: ['from machine import Pin', 'from time import sleep', '', 'sound = Pin(20, Pin.IN)', 'led = Pin("LED", Pin.OUT)', '', 'while True:', '    if sound.value():', '        led.toggle()', '        print("clap!")', '        sleep(0.3)', '    sleep(0.001)'],
      explain: [
        E([4], 'זה פין כניסה רגיל.', 'An ordinary input pin.'),
        E([8], 'השורה הזו בודקת אם החיישן מדווח על רעש.', 'Checks whether the sensor reports a noise.'),
        E([9, 11], 'השורות האלה הופכות את מצב הלד, מדפיסות הודעה ומחכות מעט, כדי שמחיאת כף אחת לא תיספר פעמיים.', 'Flips the LED, prints, and waits a little so one clap is not counted twice.'),
        E([12], 'המתנה קצרה מאוד: מחיאת כף נמשכת אלפיות שנייה, ולכן צריך לבדוק מהר כדי לא לפספס אותה.', 'A very short wait: a clap lasts milliseconds, and you must check fast to catch it.')
      ],
      expect: B('כשמוחאים כף, הלד שעל ה-Pico נדלק. כשמוחאים שוב, הוא נכבה.', 'Clap, and the LED on the Pico lights. Clap again, and it goes off.'),
      mistakes: [
        B('הלד מתחלף כל הזמן: הסף רגיש מדי. סובבו את הבורג.', 'The LED keeps flipping: the threshold is too sensitive. Turn the screw.'),
        B('הלוגיקה הפוכה: יש מודולים שבהם DO יורד ל-0 כשיש רעש. שנו את התנאי ל-`sound.value() == 0`.', 'The logic is reversed: on some modules DO drops to 0 on noise. Change the condition to `sound.value() == 0`.')
      ],
      ideas: [B('מנורה שנדלקת במחיאת כף.', 'A lamp that switches on with a clap.'), B('מד רעש לכיתה.', 'A noise meter for a classroom.'), B('אזעקה שמופעלת על ידי רעש.', 'An alarm triggered by noise.')]
    },

    /* ============================================================ MQ-2 */
    {
      id: 'mq2', name: B('חיישן גז MQ-2', 'MQ-2 gas sensor'), iface: ['gpio'], cat: 'sensor', volt: '5V', fig: 'divider',
      summary: B('מזהה עשן וגזים דליקים באוויר.', 'Detects smoke and flammable gases in the air.'),
      what: [
        B('חיישן שמגיב לעשן ולגזים דליקים, כמו גז בישול. משתמשים בו בפרויקטים של התרעה.', 'A sensor that reacts to smoke and flammable gases such as cooking gas. It is used in warning projects.'),
        B('זה רכיב לימודי, לא מכשיר בטיחות. אל תסמכו עליו כגלאי עשן או גז אמיתי.', 'This is a learning part and not a safety device. Do not rely on it as a real smoke or gas detector.')
      ],
      looks: B('לוח עם גליל מתכת מכוסה ברשת, בורג כחול קטן וארבעה פינים: VCC, GND, DO, AO. הגליל מתחמם כשהחיישן פועל, וזה תקין.', 'A board with a metal cylinder covered in mesh, a small blue screw, and four pins: VCC, GND, DO, AO. The cylinder gets warm while the sensor runs, which is normal.'),
      pins: [V5(), GND(), { n: 'DO', d: B('יציאה דיגיטלית: היא מתחלפת כשריכוז הגז עובר את הסף. היא מוציאה 5V, ולכן מחברים אותה דרך שני נגדים.', 'A digital output: it flips when the gas level passes the threshold. It outputs 5 V, so it goes through two resistors.') }, { n: 'AO', d: B('יציאה אנלוגית של עד 5V. לא מחברים אותה ל-Pico.', 'An analog output of up to 5 V. Not connected to the Pico.') }],
      how: [
        B('בתוך הגליל יש גוף חימום קטן וחומר שה[[resistance|התנגדות]] שלו משתנה כשיש גז באוויר. לכן החיישן צריך 5V, וצריך לתת לו זמן להתחמם לפני שהמדידה מתייצבת.',
          'Inside the cylinder are a small heater and a material whose [[resistance|resistance]] changes when gas is in the air. That is why the sensor needs 5 V, and needs time to warm up before the reading is steady.'),
        B('היציאה DO מוציאה 5V, יותר ממה שבטוח לפין של ה-Pico. לכן מחברים אותה דרך [[divider|מחלק מתח]] של שני נגדים, כמו בחיישן המרחק.', 'The DO output gives 5 V, more than is safe for a Pico pin. So it is connected through a [[divider|voltage divider]] of two resistors, as with the distance sensor.')
      ],
      needs: [B('מודול MQ-2', 'An MQ-2 module'), B('נגד 1kΩ ונגד 2kΩ', 'A 1 kΩ resistor and a 2 kΩ resistor'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('VCC', 'VBUS', 40, B('5V', '5 V')), W('GND', 'GND', 28), W('DO', 'GP21', 27, B('דרך מחלק מתח: נגד 1kΩ בין DO ל-GP21, ונגד 2kΩ בין GP21 ל-GND', 'through a divider: 1 kΩ from DO to GP21, and 2 kΩ from GP21 to GND'))],
      steps: [UNPLUG, seat(4), wire('VCC', 'VBUS', 40), wire('GND', 'GND', 28),
        B('הכניסו נגד 1kΩ מהטור של `DO` לטור פנוי, שייקרא "טור האמצע".', 'Push in a 1 kΩ resistor from the `DO` column to a free column, the "middle column".'),
        B('הכניסו נגד 2kΩ מטור האמצע אל האדמה.', 'Push in a 2 kΩ resistor from the middle column to ground.'),
        B('חברו חוט גישור מטור האמצע אל פין 27, שהוא `GP21`.', 'Connect a jumper wire from the middle column to pin 27, which is `GP21`.'), CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'gas = Pin(21, Pin.IN)', '', 'print("warming up...")', 'sleep(30)', '', 'while True:', '    if gas.value() == 0:          # this module pulls the line low on gas', '        print("gas detected!")', '    else:', '        print("air is clean")', '    sleep(1)'],
      explain: [
        E([4], 'זה פין כניסה רגיל.', 'An ordinary input pin.'),
        E([6, 7], 'השורות האלה נותנות לחיישן חצי דקה להתחמם.', 'Gives the sensor half a minute to warm up.'),
        E([10, 13], 'במודול הזה היציאה יורדת ל-0 כשיש גז, ולכן בודקים `== 0`.', 'On this module the output drops to 0 when there is gas. So we check `== 0`.')
      ],
      expect: B('אחרי חצי דקה מודפס "air is clean" פעם בשנייה. כשמקרבים מצית כבוי ומשחררים ממנו מעט גז, מודפס "gas detected!".', 'After half a minute "air is clean" is printed once a second. Bring an unlit lighter close and release a little gas, and "gas detected!" is printed.'),
      mistakes: [
        B('תמיד מודפס "gas detected!": הסף רגיש מדי. סובבו את הבורג הכחול עד שהנורית שעל המודול נכבית באוויר נקי.', '"gas detected!" is always printed: the threshold is too sensitive. Turn the blue screw until the light on the module goes out in clean air.'),
        B('היציאה DO מחוברת ישירות לפין, בלי הנגדים.', 'The DO output is connected straight to the pin, without the resistors.')
      ],
      ideas: [B('התרעת עשן עם באזר.', 'A smoke warning with a buzzer.'), B('מאוורר שנדלק כשיש עשן.', 'A fan that comes on when there is smoke.')]
    },

    /* ============================================================ tilt */
    {
      id: 'tilt', name: B('חיישן הטיה', 'Tilt sensor'), iface: ['gpio'], cat: 'sensor', volt: '3.3V',
      summary: B('יודע אם הוא עומד ישר או מוטה.', 'Knows whether it is upright or tilted.'),
      what: [B('זה חיישן ההטיה הפשוט ביותר: הוא עונה רק "ישר" או "מוטה". הוא מתאים כשרוצים לדעת אם משהו נפל, נפתח או הורם.', 'The simplest tilt sensor: it answers only "upright" or "tilted". Suitable when you want to know whether something fell, opened or was picked up.')],
      looks: B('לוח קטן עם גליל קטן ממתכת או מפלסטיק, ושלושה פינים: S, פלוס ומינוס. כשמנערים אותו, שומעים כדור קטן מקשקש בפנים.', 'A small board with a small metal or plastic cylinder, and three pins: S, plus and minus. Shake it and you hear a little ball rattling inside.'),
      pins: [{ n: 'S', d: B('היציאה: 0 או 1, לפי ההטיה.', 'The output: 0 or 1 according to the tilt.') }, V33('+'), GND('−')],
      how: [B('בתוך הגליל יש כדור מתכת קטן ושני מגעים. כשהגליל עומד ישר, הכדור מונח על המגעים ומחבר ביניהם. כשמטים אותו, הכדור מתגלגל הצידה והחיבור נפתח. למעשה זה כפתור שכוח המשיכה לוחץ עליו.', 'Inside the cylinder are a small metal ball and two contacts. When the cylinder is upright, the ball rests on the contacts and joins them. Tilt it and the ball rolls away, opening the connection. It is really a button pressed by gravity.')],
      needs: [B('מודול חיישן הטיה KY-020', 'A KY-020 tilt sensor module'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('S', 'GP20', 26), W('+', '3V3', 36), W('−', 'GND', 28)],
      steps: [UNPLUG, seat(3), wire('S', 'GP20', 26), wire('+', '3V3(OUT)', 36), wire('−', 'GND', 28), CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'tilt = Pin(20, Pin.IN)', 'last = tilt.value()', '', 'while True:', '    now = tilt.value()', '    if now != last:', '        print("tilt changed:", now)', '        last = now', '    sleep(0.05)'],
      explain: [
        E([5], 'השורה הזו זוכרת את המצב ההתחלתי.', 'Remembers the starting state.'),
        E([8], 'השורה הזו קוראת את המצב הנוכחי.', 'Reads the current state.'),
        E([9, 11], 'השורות האלה מדפיסות רק כשהמצב השתנה, ומעדכנות את המצב השמור. `!=` פירושו "שונה מ-".', 'Prints only when the state has changed, and updates what is remembered. `!=` means "not equal to".')
      ],
      expect: B('בכל פעם שמטים את המטריצה או מחזירים אותה למקומה, מודפסת שורה אחת.', 'Every time you tilt the breadboard or set it back, one line is printed.'),
      mistakes: [B('בכל הטיה מודפסות כמה שורות: הכדור קופץ לרגע. הגדילו את ההמתנה ל-0.2.', 'Several lines are printed on each tilt: the ball bounces for a moment. Increase the wait to 0.2.')],
      ideas: [B('אזעקה לקופסה שמישהו הרים.', 'An alarm for a box that was picked up.'), B('קובייה שמאירה בצבע אחר לפי הצד שפונה למעלה.', 'A cube that lights a different colour depending on which side is up.')]
    },

    /* ============================================================ hall */
    {
      id: 'hall', name: B('חיישן הול (מגנט)', 'Hall sensor (magnet)'), iface: ['gpio'], cat: 'sensor', volt: '3.3V',
      summary: B('מרגיש כשמגנט מתקרב אליו.', 'Senses when a magnet comes near.'),
      what: [B('חיישן שמרגיש מגנט בלי לגעת בו. משתמשים בו כדי לדעת אם דלת סגורה (המגנט על הדלת והחיישן על המשקוף), או כדי לספור סיבובים של גלגל.', 'A sensor that senses a magnet without touching it. It is used to know whether a door is closed (magnet on the door, sensor on the frame), or to count the turns of a wheel.')],
      looks: B('לוח קטן עם רכיב שחור ושטוח בעל שלוש רגליים, ושלושה פינים: מינוס, פלוס ו-S.', 'A small board with a flat black three-legged part, and three pins: minus, plus and S.'),
      pins: [GND('−'), V33('+'), { n: 'S', d: B('היציאה. היא יורדת ל-0 כשמגנט קרוב.', 'The output. It drops to 0 when a magnet is near.') }],
      how: [B('שדה מגנטי משפיע על הזרם שעובר ברכיב. הרכיב מרגיש את השינוי, וכשהמגנט קרוב מספיק הוא מוריד את היציאה ל-0. הוא מגיב רק לצד אחד של המגנט, ולכן אם זה לא עובד, הפכו את המגנט.', 'A magnetic field affects current passing through the part. The part senses this, and when the magnet is close enough it pulls the output to 0. It reacts to only one side of the magnet, so if it does not work, turn the magnet over.')],
      needs: [B('מודול חיישן הול KY-003', 'A KY-003 Hall sensor module'), B('מגנט קטן', 'A small magnet'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('−', 'GND', 28), W('+', '3V3', 36), W('S', 'GP20', 26)],
      steps: [UNPLUG, seat(3), wire('−', 'GND', 28), wire('+', '3V3(OUT)', 36), wire('S', 'GP20', 26), CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'hall = Pin(20, Pin.IN, Pin.PULL_UP)', 'led = Pin("LED", Pin.OUT)', '', 'while True:', '    near = hall.value() == 0      # the sensor pulls the line low near a magnet', '    led.value(near)', '    sleep(0.02)'],
      explain: [
        E([4], 'זו כניסה עם [[pullup|נגד משיכה]], כמו בכפתור.', 'An input with a [[pullup|pull-up]], like a button.'),
        E([8], 'כשהמגנט קרוב, הפין קורא 0. השורה שומרת `True` או `False` במשתנה `near`.', 'With the magnet near the pin reads 0. `True` or `False` is stored in the variable `near`.'),
        E([9], 'השורה הזו מדליקה את הלד כשהמגנט קרוב.', 'Lights the LED when the magnet is near.')
      ],
      expect: B('כשמקרבים מגנט לרכיב השחור, הלד שעל ה-Pico נדלק. כשמרחיקים אותו, הלד נכבה.', 'Bring a magnet up to the black part and the LED on the Pico lights. Move it away and it goes off.'),
      mistakes: [B('אין תגובה: הפכו את המגנט. החיישן מגיב רק לקוטב אחד.', 'No reaction: turn the magnet over. The sensor reacts to one pole only.')],
      ideas: [B('אזעקה לדלת או לחלון.', 'An alarm for a door or window.'), B('מד מהירות לאופניים: מגנט על הגלגל.', 'A bicycle speedometer: a magnet on the wheel.')]
    },

    /* ============================================================ LCD 16x2 */
    {
      id: 'lcd1602', name: B('מסך LCD 16×2 עם מתאם I2C', '16×2 LCD with an I2C adapter'), iface: ['i2c'], cat: 'display', volt: '5V', addr: '0x27',
      summary: B('מסך טקסט גדול וברור: שתי שורות של 16 תווים.', 'A big clear text display: two lines of 16 characters.'),
      what: [B('מסך ירוק או כחול שמציג שתי שורות טקסט. הוא גדול וקריא הרבה יותר ממסך ה-OLED, אבל מציג רק אותיות באנגלית, ספרות וסימנים.', 'A green or blue display showing two lines of text. It is much bigger and easier to read than the OLED, but shows only English letters, digits and symbols.')],
      looks: B('מסך מלבני גדול. בגב שלו מולחם לוח שחור קטן עם ארבעה פינים (GND, VCC, SDA, SCL) ובורג כחול. זה מתאם ה-I2C, והבורג מכוון את הניגודיות.', 'A large rectangular display. Soldered on the back is a small black board with four pins (GND, VCC, SDA, SCL) and a blue screw. This is the I2C adapter, and the screw sets the contrast.'),
      pins: [GND(), V5(), SDA, SCL],
      how: [
        B('למסך עצמו יש 16 פינים. המתאם שבגב המסך מצמצם אותם לשני חוטי [[i2c|I2C]]. הכתובת שלו היא בדרך כלל `0x27`, ולפעמים `0x3F`.',
          'The display itself has 16 pins. The adapter on its back reduces them to two [[i2c|I2C]] wires. Its address is usually `0x27`, sometimes `0x3F`.'),
        B('המסך צריך 5V. המתאם מושך את קווי ה-I2C ל-5V, יותר ממה שהאתר הזה ממליץ לחבר לפין. לפי היצרן, הפינים של ה-Pico 2 עומדים בזה כשהלוח מוזן, אבל הדרך הבטוחה היא להשתמש ברכיב שנקרא ממיר רמות. החיבור הישיר הזה לא נבדק.',
          'The display needs 5 V. The adapter pulls the I2C lines up to 5 V, more than this site recommends connecting to a pin. According to the maker, the Pico 2\'s pins tolerate this while the board is powered, but the safe way is a part called a level shifter. This direct connection has not been tested.')
      ],
      needs: [B('מסך LCD 16×2 עם מתאם I2C מולחם', 'A 16×2 LCD with an I2C adapter soldered on'), B('ארבעה חוטי גישור עם קצה נקבה', 'Four jumper wires with a female end')],
      lib: { name: 'pico_lcd.py', how: B('קובץ קצר שמופיע בעמוד הזה. שמרו אותו על הלוח לפני הרצת הדוגמה.', 'A short file shown on this page. Save it on the board before running the example.') },
      driver: {
        file: 'pico_lcd.py',
        code: [
          'from time import sleep_ms', '',
          'class LCD:', '    def __init__(self, i2c, addr=0x27):', '        self.i2c = i2c', '        self.addr = addr', '        sleep_ms(50)',
          '        for nibble in (0x03, 0x03, 0x03, 0x02):', '            self._nibble(nibble << 4)', '            sleep_ms(5)',
          '        for cmd in (0x28, 0x0C, 0x06, 0x01):', '            self.command(cmd)', '        sleep_ms(2)', '',
          '    def _nibble(self, data):', '        # 0x08 keeps the backlight on, 0x04 is the "read this now" pulse', '        self.i2c.writeto(self.addr, bytes([data | 0x08 | 0x04]))', '        self.i2c.writeto(self.addr, bytes([data | 0x08]))', '',
          '    def _byte(self, value, rs):', '        self._nibble((value & 0xF0) | rs)', '        self._nibble(((value << 4) & 0xF0) | rs)', '',
          '    def command(self, cmd):', '        self._byte(cmd, 0)', '        sleep_ms(2)', '',
          '    def clear(self):', '        self.command(0x01)', '',
          '    def move(self, col, row):', '        self.command(0x80 | (col + 0x40 * row))', '',
          '    def write(self, text):', '        for ch in text:', '            self._byte(ord(ch), 1)'
        ]
      },
      wiring: [W('GND', 'GND', 8), W('VCC', 'VBUS', 40, B('5V', '5 V')), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, loose(4), lead('GND', 'GND', 8), lead('VCC', 'VBUS', 40), lead('SDA', 'GP4', 6), lead('SCL', 'GP5', 7), CHECK, SAVE('pico_lcd.py')],
      code: ['from machine import Pin, I2C', 'from pico_lcd import LCD', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=100_000)', 'print([hex(a) for a in i2c.scan()])   # expect 0x27 or 0x3f', '', 'lcd = LCD(i2c, 0x27)', 'lcd.clear()', 'lcd.write("Hello Pico 2")', 'lcd.move(0, 1)', 'lcd.write("Line two")'],
      explain: [
        E([2], 'השורה הזו טוענת את `LCD` מהקובץ ששמרתם על הלוח.', 'Brings in `LCD` from the file you saved on the board.'),
        E([4, 5], 'השורות האלה מגדירות את ה[[bus|אפיק]] ובודקות איזו כתובת עונה.', 'Sets up the [[bus|bus]] and checks which address answers.'),
        E([7], 'השורה הזו יוצרת את המסך בכתובת `0x27`. אם `scan` הדפיס `0x3f`, שנו את הכתובת כאן.', 'Creates the display at address `0x27`. If `scan` printed `0x3f`, change it here.'),
        E([8, 9], 'השורות האלה מנקות את המסך וכותבות בשורה הראשונה.', 'Clears and writes on the first line.'),
        E([10, 11], 'השורות האלה עוברות לתחילת השורה השנייה (עמודה 0, שורה 1) וכותבות שם.', 'Moves to the start of the second line (column 0, row 1) and writes there.')
      ],
      expect: B('על המסך מופיעות שתי שורות טקסט, והתאורה האחורית דולקת.', 'Two lines of text appear on the display, with the backlight on.'),
      mistakes: [
        B('התאורה דולקת אבל אין טקסט, או שרואים מלבנים: סובבו את הבורג הכחול שבגב המסך עד שהאותיות מופיעות.', 'The backlight is on but there is no text, or you see blocks: turn the blue screw on the back until the letters appear.'),
        B('מופיעה שגיאה `OSError`: הכתובת שגויה. השתמשו בכתובת ש-`scan()` הדפיס.', 'An `OSError`: the address is wrong. Use what `scan()` printed.'),
        B('מופיעה שגיאה `ImportError`: הקובץ `pico_lcd.py` לא נשמר על הלוח, או שנשמר בשם אחר.', 'An `ImportError`: the file `pico_lcd.py` was not saved on the board, or was saved under another name.')
      ],
      ideas: [B('שעון שמציג גם תאריך.', 'A clock with the date.'), B('הצגת מדידות מכמה חיישנים.', 'Showing readings from several sensors.'), B('הודעות מתחלפות.', 'Rotating messages.')]
    },

    /* ============================================================ TM1637 */
    {
      id: 'tm1637', name: B('תצוגת ספרות TM1637', 'TM1637 digit display'), iface: ['gpio'], cat: 'display', volt: '3.3V',
      summary: B('ארבע ספרות אדומות גדולות, כמו בשעון מעורר.', 'Four big red digits, like on an alarm clock.'),
      what: [B('תצוגה של ארבע ספרות מוארות, שרואים אותן מרחוק וגם בחושך. היא מתאימה לשעון, לטיימר, למונה או להצגת טמפרטורה.', 'A display of four lit digits, visible from a distance and in the dark. Good for a clock, a timer, a counter or a temperature.')],
      looks: B('לוח שחור עם ארבע ספרות ונקודתיים באמצע, וארבעה פינים: CLK, DIO, VCC, GND.', 'A black board with four digits and a colon in the middle, and four pins: CLK, DIO, VCC, GND.'),
      pins: [{ n: 'CLK', d: B('[[clock|קו שעון]].', 'A [[clock|clock line]].') }, { n: 'DIO', d: B('קו הנתונים.', 'The data line.') }, V33(), GND()],
      how: [B('כל ספרה בנויה משבעה מקטעים שנדלקים בנפרד. השבב TM1637 שעל הלוח מדליק אותם, וה-Pico רק שולח לו בשני חוטים אילו מקטעים להדליק. השיטה דומה ל-I2C אבל לא זהה לו, ולכן יש לה קובץ קוד קטן משלה.', 'Each digit is built from seven segments that light separately. The TM1637 chip on the board lights them, and the Pico only sends it which segments to light, over two wires. It resembles I2C but is not the same, so it has a small code file of its own.')],
      needs: [B('מודול TM1637 עם ארבע ספרות', 'A TM1637 module with four digits'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      lib: { name: 'pico_tm1637.py', how: B('קובץ קצר שמופיע בעמוד הזה. שמרו אותו על הלוח לפני הרצת הדוגמה.', 'A short file shown on this page. Save it on the board before running the example.') },
      driver: {
        file: 'pico_tm1637.py',
        code: [
          'from machine import Pin', 'from time import sleep_us', '',
          '# which of the seven segments are lit for the digits 0 to 9', 'SEGMENTS = b"\\x3f\\x06\\x5b\\x4f\\x66\\x6d\\x7d\\x07\\x7f\\x6f"', '',
          'class TM1637:', '    def __init__(self, clk, dio, brightness=7):', '        self.clk = clk', '        self.dio = dio', '        self.clk.init(Pin.OUT, value=1)', '        self.dio.init(Pin.OUT, value=1)', '        self.brightness = brightness', '',
          '    def _start(self):', '        self.dio(0)', '        sleep_us(10)', '        self.clk(0)', '        sleep_us(10)', '',
          '    def _stop(self):', '        self.dio(0)', '        sleep_us(10)', '        self.clk(1)', '        sleep_us(10)', '        self.dio(1)', '',
          '    def _write(self, value):', '        for i in range(8):', '            self.dio((value >> i) & 1)', '            sleep_us(10)', '            self.clk(1)', '            sleep_us(10)', '            self.clk(0)',
          '        sleep_us(10)          # one extra clock tick for the chip\'s answer', '        self.clk(1)', '        sleep_us(10)', '        self.clk(0)', '',
          '    def show(self, segments):', '        self._start()', '        self._write(0x40)', '        self._stop()', '        self._start()', '        self._write(0xC0)', '        for s in segments:', '            self._write(s)', '        self._stop()', '        self._start()', '        self._write(0x88 | self.brightness)', '        self._stop()', '',
          '    def number(self, n):', '        text = "%4d" % (n % 10000)', '        self.show([0 if ch == " " else SEGMENTS[int(ch)] for ch in text])'
        ]
      },
      wiring: [W('CLK', 'GP20', 26), W('DIO', 'GP21', 27), W('VCC', '3V3', 36), W('GND', 'GND', 28)],
      steps: [UNPLUG, seat(4), wire('CLK', 'GP20', 26), wire('DIO', 'GP21', 27), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 28), CHECK, SAVE('pico_tm1637.py')],
      code: ['from machine import Pin', 'from time import sleep', 'from pico_tm1637 import TM1637', '', 'display = TM1637(Pin(20), Pin(21))', '', 'count = 0', 'while True:', '    display.number(count)', '    count = count + 1', '    sleep(0.5)'],
      explain: [
        E([3], 'השורה הזו טוענת את `TM1637` מהקובץ ששמרתם על הלוח.', 'Brings in `TM1637` from the file you saved on the board.'),
        E([5], 'השורה הזו יוצרת את התצוגה: קודם פין השעון, ואחריו פין הנתונים.', 'Creates the display: clock pin first, then the data pin.'),
        E([9], 'השורה הזו מציגה מספר, עד 9999.', 'Shows a number, up to 9999.'),
        E([10, 11], 'השורות האלה מוסיפות אחד למונה ומחכות חצי שנייה.', 'Adds one and waits half a second.')
      ],
      expect: B('התצוגה סופרת 0, 1, 2 וכן הלאה, פעמיים בשנייה.', 'The display counts: 0, 1, 2 and so on, twice a second.'),
      mistakes: [
        B('התצוגה חשוכה: החוטים של CLK ושל DIO הוחלפו.', 'The display is dark: CLK and DIO are swapped.'),
        B('מופיעה שגיאה `ImportError`: הקובץ `pico_tm1637.py` לא נשמר על הלוח.', 'An `ImportError`: the file `pico_tm1637.py` was not saved on the board.')
      ],
      ideas: [B('שעון עצר עם כפתור.', 'A stopwatch with a button.'), B('הצגת המרחק שמודד חיישן המרחק.', 'Showing the distance from the distance sensor.'), B('לוח תוצאות למשחק.', 'A scoreboard for a game.')]
    },

    /* ============================================================ MAX7219 */
    {
      id: 'max7219', name: B('מטריצת לדים 8×8 (MAX7219)', '8×8 LED matrix (MAX7219)'), iface: ['spi'], cat: 'display', volt: '5V',
      summary: B('64 לדים בריבוע, לציורים, לחצים ולאנימציות.', '64 LEDs in a square, for drawings, arrows and animations.'),
      what: [B('ריבוע של 8 על 8 לדים אדומים. כל לד נשלט בנפרד, ולכן אפשר לצייר עליו סמלים, חצים, פרצופים ואנימציות קטנות.', 'A square of 8 by 8 red LEDs. Each LED is controlled separately, so you can draw symbols, arrows, faces and small animations on it.')],
      looks: B('לוח עם ריבוע של לדים, שבב שחור ארוך וחמישה פינים בכל צד: VCC, GND, DIN, CS, CLK. התחברו לצד שבו כתוב DIN.', 'A board with a square of LEDs, a long black chip, and five pins on each side: VCC, GND, DIN, CS, CLK. Connect to the side marked DIN.'),
      pins: [V5(), GND(), { n: 'DIN', d: B('כניסת הנתונים. היא מתחברת ל-TX של [[spi|SPI]].', 'The data input. Connects to [[spi|SPI]] TX.') }, { n: 'CS', d: B('קו הבחירה.', 'The select line.') }, { n: 'CLK', d: B('[[clock|קו השעון]].', 'The [[clock|clock line]].') }],
      how: [
        B('השבב MAX7219 מדליק את 64 הלדים במקום ה-Pico. ה-Pico שולח לו שמונה [[byte|בתים]], אחד לכל שורה, ובכל בית יש שמונה [[bit|ביטים]] שקובעים אילו לדים דולקים באותה שורה.', 'The MAX7219 chip lights the 64 LEDs on the Pico\'s behalf. The Pico sends it eight [[byte|bytes]], one per row, and in each byte eight [[bit|bits]] say which LEDs are lit on that row.'),
        B('השבב עובד ב-5V אבל מקבל פקודות ב-3.3V. ברוב המודולים זה עובד, אבל זה על גבול מה שהיצרן מבטיח.', 'The chip runs at 5 V but takes commands at 3.3 V. On most modules this works, but it is at the edge of what the maker guarantees.')
      ],
      needs: [B('מודול MAX7219 עם מטריצה 8×8', 'A MAX7219 module with an 8×8 matrix'), B('חמישה חוטי גישור עם קצה נקבה', 'Five jumper wires with a female end')],
      lib: { name: 'pico_max7219.py', how: B('קובץ קצר שמופיע בעמוד הזה. שמרו אותו על הלוח לפני הרצת הדוגמה.', 'A short file shown on this page. Save it on the board before running the example.') },
      driver: {
        file: 'pico_max7219.py',
        code: [
          'class Matrix:', '    def __init__(self, spi, cs):', '        self.spi = spi', '        self.cs = cs', '        self.cs.high()', '        self.rows = bytearray(8)',
          '        # no digit decoding, medium brightness, all 8 rows, switch on, no test mode', '        for reg, value in ((0x09, 0), (0x0A, 3), (0x0B, 7), (0x0C, 1), (0x0F, 0)):', '            self._send(reg, value)', '        self.show()', '',
          '    def _send(self, reg, value):', '        self.cs.low()', '        self.spi.write(bytes([reg, value]))', '        self.cs.high()', '',
          '    def fill(self, on):', '        for i in range(8):', '            self.rows[i] = 0xFF if on else 0', '',
          '    def pixel(self, x, y, on):', '        if on:', '            self.rows[y] |= 1 << (7 - x)', '        else:', '            self.rows[y] &= ~(1 << (7 - x))', '',
          '    def show(self):', '        for i in range(8):', '            self._send(i + 1, self.rows[i])'
        ]
      },
      wiring: [W('VCC', 'VBUS', 40, B('5V', '5 V')), W('GND', 'GND', 23), W('CLK', 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK')), W('DIN', 'GP19', 25, B('SPI0 TX', 'SPI0 TX')), W('CS', 'GP17', 22)],
      steps: [UNPLUG, loose(5), lead('VCC', 'VBUS', 40), lead('GND', 'GND', 23), lead('CLK', 'GP18', 24), lead('DIN', 'GP19', 25), lead('CS', 'GP17', 22), CHECK, SAVE('pico_max7219.py')],
      code: ['from machine import Pin, SPI', 'from time import sleep', 'from pico_max7219 import Matrix', '', 'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19))', 'matrix = Matrix(spi, Pin(17, Pin.OUT))', '', 'while True:', '    for i in range(8):', '        matrix.fill(0)', '        matrix.pixel(i, i, 1)', '        matrix.show()', '        sleep(0.1)'],
      explain: [
        E([5], 'השורה הזו מגדירה SPI עם קו שעון וקו נתונים אחד. המטריצה לא שולחת שום דבר בחזרה, ולכן אין צורך ב-MISO.', 'Sets up SPI with a clock and one data line. The matrix sends nothing back, so MISO is not needed.'),
        E([6], 'השורה הזו יוצרת את המטריצה, כשקו הבחירה מחובר ל-GP17.', 'Creates the matrix, with the select line on GP17.'),
        E([10], 'השורה הזו מכבה את כל הלדים בזיכרון.', 'Switches all LEDs off, in memory.'),
        E([11], 'השורה הזו מדליקה לד אחד: עמודה i, שורה i. כך נוצר אלכסון.', 'Lights one LED: column i, row i. This makes a diagonal.'),
        E([12], 'השורה הזו שולחת את התמונה למטריצה.', 'Sends the picture to the matrix.')
      ],
      expect: B('נקודת אור אחת רצה באלכסון מפינה לפינה, שוב ושוב.', 'A single dot of light runs diagonally from corner to corner, over and over.'),
      mistakes: [
        B('שום דבר לא נדלק: החוטים מחוברים לצד DOUT במקום לצד DIN.', 'Nothing lights: you are connected to the DOUT side instead of DIN.'),
        B('התמונה הפוכה או מסובבת: המודול מולחם בכיוון אחר. החליפו בין x ל-y.', 'The picture is flipped or rotated: the module is soldered the other way. Swap x and y.')
      ],
      ideas: [B('פרצוף שמחייך או מתעצב לפי חיישן.', 'A face that smiles or frowns according to a sensor.'), B('חץ שמראה כיוון.', 'An arrow showing a direction.'), B('משחק נחש עם ג\'ויסטיק.', 'A snake game with a joystick.')]
    },

    /* ============================================================ DS3231 */
    {
      id: 'ds3231', name: B('שעון זמן אמת DS3231', 'DS3231 real-time clock'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x68',
      summary: B('שומר את השעה גם כשה-Pico כבוי.', 'Keeps the time even when the Pico is off.'),
      what: [B('ה-Pico לא יודע מה השעה: בכל הדלקה הוא מתחיל לספור מאפס. המודול הזה הוא שעון מדויק עם סוללה קטנה משלו, והוא ממשיך לפעול גם כשהכול כבוי.', 'The Pico does not know the time: at each power-up it starts counting from zero. This module is an accurate clock with a small battery of its own, which keeps running even when everything is off.')],
      looks: B('לוח קטן עם סוללה עגולה ושטוחה, כמו של שעון יד, וארבעה פינים עיקריים: GND, VCC, SDA, SCL.', 'A small board with a flat round battery, like a wristwatch\'s, and four main pins: GND, VCC, SDA, SCL.'),
      pins: [GND(), V33(), SDA, SCL],
      how: [
        B('השעון מתקשר ב-[[i2c|I2C]], בכתובת `0x68`. הזמן שמור בתאים ממוספרים שנקראים [[register|רגיסטרים]]: תא 0 שומר את השניות, תא 1 את הדקות ותא 2 את השעות.', 'The clock speaks [[i2c|I2C]], at address `0x68`. The time is kept in numbered cells called [[register|registers]]: cell 0 is the seconds, cell 1 the minutes and cell 2 the hours.'),
        B('המספרים שמורים בצורה מיוחדת: 4 [[bit|ביטים]] לספרת העשרות ו-4 ביטים לספרת האחדות. לכן יש בקוד פונקציה קטנה שממירה אותם למספר רגיל.', 'The numbers are stored in a special form: 4 [[bit|bits]] for the tens digit and 4 for the units digit. So the code has a small function that converts them to an ordinary number.')
      ],
      needs: [B('מודול DS3231 עם סוללה', 'A DS3231 module with a battery'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('GND', 'GND', 8), W('VCC', '3V3', 36), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, seat(4), wire('GND', 'GND', 8), wire('VCC', '3V3(OUT)', 36), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7), CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'ADDR = 0x68', '', 'def bcd(value):', '    return (value >> 4) * 10 + (value & 0x0F)', '', 'while True:', '    data = i2c.readfrom_mem(ADDR, 0, 3)       # seconds, minutes, hours', '    print("%02d:%02d:%02d" % (bcd(data[2] & 0x3F), bcd(data[1]), bcd(data[0])))', '    sleep(1)'],
      explain: [
        E([4, 5], 'השורות האלה מגדירות את האפיק ואת הכתובת של השעון.', 'Sets up the bus and the clock\'s address.'),
        E([7, 8], 'הפונקציה הזו ממירה מהצורה המיוחדת למספר רגיל: ארבעת הביטים הגבוהים הם העשרות, וארבעת הנמוכים הם האחדות.', 'Converts from the special form to an ordinary number: the four high bits are the tens, and the low ones the units.'),
        E([11], 'השורה הזו קוראת שלושה [[byte|בתים]], החל מתא 0.', 'Reads three [[byte|bytes]] starting at cell 0.'),
        E([12], 'השורה הזו מדפיסה שעות, דקות ושניות. `%02d` מציג מספר בשתי ספרות, עם אפס מוביל.', 'Prints hours, minutes and seconds. `%02d` shows a number as two digits, with a leading zero.')
      ],
      expect: B('פעם בשנייה מודפסת השעה, והשניות מתקדמות. בפעם הראשונה השעה לא נכונה, כי אף אחד עוד לא כיוון אותה.', 'Once a second the time is printed, with the seconds advancing. The first time the hour is wrong, because nobody has set it yet.'),
      mistakes: [
        B('השעה לא נכונה: צריך לכוון אותה פעם אחת. כדי לכוון ל-14:30:00, הריצו `i2c.writeto_mem(0x68, 0, b"\\x00\\x30\\x14")`. שימו לב שהספרות נכתבות כמו שהן, אחרי `\\x`.', 'The time is wrong: it must be set once. For 14:30:00 run `i2c.writeto_mem(0x68, 0, b"\\x00\\x30\\x14")`. Note that the digits are written as they are, after `\\x`.'),
        B('השעון מתאפס כשמנתקים את החשמל: אין בו סוללה, או שהסוללה ריקה.', 'The clock resets when unplugged: there is no battery, or it is flat.'),
        B('הכתובת `0x68` זהה לכתובת של חיישן התנועה MPU6050, ולכן שני הרכיבים האלה לא יכולים לשבת על אותו אפיק.', 'The address `0x68` is the same as the MPU6050 motion sensor\'s. The two cannot sit on the same bus.')
      ],
      ideas: [B('שעון על מסך או על תצוגת ספרות.', 'A clock on a display or a digit display.'), B('השקיה בשעה קבועה.', 'Watering at a set hour.'), B('רישום מדידות עם השעה לכרטיס זיכרון.', 'Logging readings with the time, to a memory card.')]
    },

    /* ============================================================ RC522 */
    {
      id: 'rc522', name: B('קורא כרטיסים RFID RC522', 'RC522 RFID card reader'), iface: ['spi'], cat: 'sensor', volt: '3.3V',
      summary: B('מזהה כרטיס או מחזיק מפתחות שמקרבים אליו.', 'Identifies a card or key fob held up to it.'),
      what: [B('קורא כרטיסים כמו זה שבכניסה לבניין או באוטובוס. לכל כרטיס יש מספר ייחודי, והקורא מעביר אותו ל-Pico. כך הפרויקט יודע מי קירב את הכרטיס.', 'A card reader like the one at a building entrance or on a bus. Every card has a unique number, and the reader passes it to the Pico. This tells a project who held up the card.')],
      looks: B('לוח כחול מלבני עם סליל מודפס גדול ושמונה פינים בשורה. הוא מגיע עם כרטיס לבן ומחזיק מפתחות כחול.', 'A rectangular blue board with a large printed coil, and eight pins in a row. It comes with a white card and a blue key fob.'),
      pins: [
        V33('3.3V'), GND(),
        { n: 'SCK, MOSI, MISO', d: B('שלושת קווי ה-[[spi|SPI]].', 'The three [[spi|SPI]] lines.') },
        { n: 'SDA', d: B('למרות השם, זה קו הבחירה (CS) של SPI.', 'Despite the name, this is the SPI select line (CS).') },
        { n: 'RST', d: B('איפוס הקורא.', 'Resets the reader.') },
        { n: 'IRQ', d: B('לא מחברים.', 'Not connected.') }
      ],
      how: [
        B('הסליל שעל הלוח יוצר שדה שמעביר חשמל לכרטיס דרך האוויר. אין בכרטיס סוללה: השדה מעיר שבב זעיר שבתוכו, והשבב משדר בחזרה את המספר שלו.', 'The coil on the board creates a field that passes power to the card through the air. The card has no battery: the field wakes a tiny chip inside it, which transmits its number back.'),
        B('הפרוטוקול מסובך, ולכן משתמשים ב[[library|ספרייה]]. הקורא עובד ב-3.3V בלבד, ו-5V שורף אותו.', 'The protocol is complicated, so a [[library|library]] is used. The reader works at 3.3 V only: 5 V destroys it.')
      ],
      needs: [B('מודול RC522 עם כרטיס', 'An RC522 module with a card'), B('שבעה חוטי גישור עם קצה נקבה', 'Seven jumper wires with a female end')],
      lib: { name: 'mfrc522', how: B('ספרייה חיצונית בשם mfrc522. שם הספרייה, אופן ההתקנה והפקודות שבדוגמה לא נבדקו על לוח אמיתי, וייתכן שבגרסה שתמצאו הם יהיו מעט שונים.', 'A third-party library named mfrc522. The library name, the installation and the commands in the example have not been tried on a real board, and may differ slightly in the version you find.') },
      wiring: [W('3.3V', '3V3', 36, B('לא 5V', 'not 5 V')), W('GND', 'GND', 23), W('SCK', 'GP18', 24), W('MOSI', 'GP19', 25), W('MISO', 'GP16', 21), W('SDA', 'GP17', 22, B('קו הבחירה', 'the select line')), W('RST', 'GP22', 29)],
      steps: [UNPLUG, loose(7), lead('3.3V', '3V3(OUT)', 36), lead('GND', 'GND', 23), lead('SCK', 'GP18', 24), lead('MOSI', 'GP19', 25), lead('MISO', 'GP16', 21), lead('SDA', 'GP17', 22), lead('RST', 'GP22', 29), CHECK,
        B('התקינו את הספרייה `mfrc522`.', 'Install the `mfrc522` library.')],
      code: ['from mfrc522 import MFRC522', 'from time import sleep', '', 'reader = MFRC522(spi_id=0, sck=18, mosi=19, miso=16, cs=17, rst=22)', '', 'while True:', '    reader.init()', '    stat, tag_type = reader.request(reader.REQIDL)', '    if stat == reader.OK:', '        stat, uid = reader.SelectTagSN()', '        if stat == reader.OK:', '            print("card:", uid)', '            sleep(1)', '    sleep(0.1)'],
      explain: [
        E([4], 'השורה הזו יוצרת את הקורא ומעבירה לספרייה את מספרי הפינים.', 'Creates the reader and gives the library the pin numbers.'),
        E([8], 'השורה הזו שואלת: "יש כרטיס בקרבת מקום?"', 'Asks: "is there a card nearby?"'),
        E([9, 10], 'אם יש כרטיס, השורות האלה מבקשות את המספר הייחודי שלו.', 'If so, asks for its unique number.'),
        E([12, 13], 'השורות האלה מדפיסות את המספר ומחכות שנייה, כדי שלא יודפס שוב ושוב.', 'Prints the number, and waits a second so it is not printed over and over.')
      ],
      expect: B('כשמקרבים כרטיס לקורא, מודפסת רשימה של מספרים, למשל `card: [67, 201, 14, 9]`. לכל כרטיס יש רשימה אחרת.', 'Hold a card up to the reader, and a list of numbers is printed, for example `card: [67, 201, 14, 9]`. Each card has a different list.'),
      mistakes: [
        B('חיברתם את הקורא ל-5V. הוא עובד רק ב-3.3V, ועלול להישרף.', 'The reader was connected to 5 V. It works only at 3.3 V and may be destroyed.'),
        B('אף כרטיס לא מזוהה: בדקו את MOSI ואת MISO, ושהכרטיס נמצא במרחק של עד שלושה סנטימטרים.', 'No card is detected: check MOSI and MISO, and that the card is within three centimetres.')
      ],
      ideas: [B('מנעול שנפתח רק לכרטיס מסוים.', 'A lock that opens only for a certain card.'), B('רישום נוכחות.', 'An attendance log.'), B('כל כרטיס מנגן מנגינה אחרת.', 'Each card plays a different tune.')]
    },

    /* ============================================================ HC-05 */
    {
      id: 'hc05', name: B('מודול Bluetooth HC-05', 'HC-05 Bluetooth module'), iface: ['uart'], cat: 'comm', volt: '5V',
      summary: B('מחבר את הפרויקט לטלפון, בלי חוטים.', 'Connects a project to a phone, with no wires.'),
      what: [B('מודול שמאפשר לטלפון לתקשר עם ה-Pico דרך Bluetooth. מבחינת ה-Pico זה פשוט חיבור [[uart|UART]]: מה שהטלפון שולח מגיע כטקסט, ומה שה-Pico כותב מגיע לטלפון.', 'A module that lets a phone talk to the Pico over Bluetooth. To the Pico it is simply a [[uart|UART]] connection: what the phone sends arrives as text, and what the Pico writes reaches the phone.')],
      looks: B('לוח כחול צר עם אנטנה מודפסת בצורת זיגזג, נורית אדומה ושישה פינים. משתמשים בארבעה מהם: VCC, GND, TXD, RXD.', 'A narrow blue board with a zigzag printed antenna, a red light and six pins. Four are used: VCC, GND, TXD, RXD.'),
      pins: [V5(), GND(), { n: 'TXD', d: B('המודול משדר דרכו. הוא מתחבר ל-[[txrx|RX]] של ה-Pico.', 'The module transmits. Connects to the Pico\'s [[txrx|RX]].') }, { n: 'RXD', d: B('המודול קולט דרכו. הוא מתחבר ל-TX של ה-Pico.', 'The module receives. Connects to the Pico\'s TX.') }],
      how: [
        B('המודול עושה את כל עבודת ה-Bluetooth בעצמו. בטלפון מצמידים אותו כמו אוזניות (הקוד הוא בדרך כלל 1234), ומשתמשים באפליקציה מסוג Serial Bluetooth Terminal כדי לשלוח ולקבל טקסט.', 'The module does all the Bluetooth work itself. On the phone you pair it like headphones (the code is usually 1234), and use an app of the "Serial Bluetooth Terminal" kind to send and receive text.'),
        B('HC-05 עובד עם טלפונים מסוג Android. מכשירי iPhone לא מתחברים לסוג הזה של Bluetooth.', 'The HC-05 works with Android phones. iPhones do not connect to this kind of Bluetooth.')
      ],
      needs: [B('מודול HC-05', 'An HC-05 module'), B('ארבעה חוטי גישור', 'Four jumper wires'), B('טלפון Android עם אפליקציית Serial Bluetooth Terminal', 'An Android phone with a Serial Bluetooth Terminal app')],
      wiring: [W('VCC', 'VBUS', 40, B('5V', '5 V')), W('GND', 'GND', 28), W('TXD', 'GP21', 27, B('TXD של המודול ל-RX של ה-Pico (UART1 RX)', 'the module\'s TXD to the Pico\'s RX (UART1 RX)')), W('RXD', 'GP20', 26, B('RXD של המודול ל-TX של ה-Pico (UART1 TX)', 'the module\'s RXD to the Pico\'s TX (UART1 TX)'))],
      steps: [UNPLUG, seat(4), wire('VCC', 'VBUS', 40), wire('GND', 'GND', 28), wire('TXD', 'GP21', 27), wire('RXD', 'GP20', 26), CHECK,
        B('בטלפון: הצמידו את המכשיר שנקרא HC-05, פתחו את האפליקציה והתחברו אליו.', 'On the phone: pair the device named HC-05, open the app and connect to it.')],
      code: ['from machine import Pin, UART', '', 'bt = UART(1, baudrate=9600, tx=Pin(20), rx=Pin(21))', 'led = Pin("LED", Pin.OUT)', '', 'while True:', '    if bt.any():', '        text = bt.readline()', '        print("got:", text)', '        if b"on" in text:', '            led.on()', '        if b"off" in text:', '            led.off()', '        bt.write("ok\\n")'],
      explain: [
        E([3], 'השורה הזו פותחת חיבור UART במהירות 9600: ה-Pico משדר ב-GP20 וקולט ב-GP21.', 'A UART connection at 9600: the Pico transmits on GP20 and receives on GP21.'),
        E([7, 8], 'אם הגיע משהו מהטלפון, השורות האלה קוראות שורה אחת.', 'If something arrived from the phone, reads a line.'),
        E([10, 13], 'אם בטקסט מופיעה המילה on, הלד נדלק, ואם מופיעה המילה off, הוא נכבה. `b"on"` הוא טקסט בצורת בתים.', 'If the text contains the word on, lights the LED, and if off, switches it off. `b"on"` is text in the form of bytes.'),
        E([14], 'השורה הזו שולחת תשובה לטלפון.', 'Answers the phone.')
      ],
      expect: B('כשכותבים on באפליקציה שבטלפון, הלד שעל ה-Pico נדלק. כשכותבים off, הוא נכבה. הטלפון מקבל בחזרה ok.', 'Type on in the phone app, and the LED on the Pico lights. Type off, and it goes out. The phone receives ok back.'),
      mistakes: [
        B('הנורית האדומה מהבהבת מהר: הטלפון עוד לא התחבר. אחרי החיבור היא מהבהבת לאט.', 'The red light blinks fast: the phone has not connected yet. Once connected it blinks slowly.'),
        B('שום דבר לא מגיע: החוטים של TXD ו-RXD לא מוצלבים.', 'Nothing arrives: TXD and RXD are not crossed.'),
        B('צריך להגדיר באפליקציה שכל שורה תסתיים ב-Newline, אחרת `readline` ממשיך לחכות.', 'The app must be set to end each line with a Newline, otherwise `readline` keeps waiting.')
      ],
      ideas: [B('נהיגה ברכב מהטלפון.', 'Driving a car from the phone.'), B('קבלת מדידות בטלפון.', 'Receiving readings on the phone.'), B('שינוי צבע של פס לדים מהטלפון.', 'Changing an LED strip\'s colour from the phone.')]
    },

    /* ============================================================ nRF24L01 */
    {
      id: 'nrf24', name: B('מודול רדיו nRF24L01', 'nRF24L01 radio module'), iface: ['spi'], cat: 'comm', volt: '3.3V',
      summary: B('שני לוחות Pico מתקשרים זה עם זה בלי חוטים.', 'Two Pico boards talk to each other with no wires.'),
      what: [B('מודול רדיו קטן וזול. שמים מודול אחד על כל לוח Pico, והם שולחים זה לזה הודעות קצרות למרחק של כמה עשרות מטרים. כך בונים שלט רחוק, או חיישן שנמצא בחדר אחר.', 'A small cheap radio module. Put one on each Pico board, and they send short messages to each other over a few tens of metres. This is how you build a remote control, or a sensor in another room.')],
      looks: B('לוח שחור קטן עם אנטנה מודפסת בצורת זיגזג, ושמונה פינים בשתי שורות של ארבעה. בגלל שתי השורות האלה הוא לא נכנס למטריצה.', 'A small black board with a zigzag printed antenna, and eight pins in two rows of four. Because of the two rows it does not plug into a breadboard.'),
      pins: [
        V33(), GND(),
        { n: 'SCK, MOSI, MISO', d: B('שלושת קווי ה-[[spi|SPI]].', 'The three [[spi|SPI]] lines.') },
        { n: 'CSN', d: B('קו הבחירה של SPI.', 'The SPI select line.') },
        { n: 'CE', d: B('מפעיל את השידור או את הקליטה.', 'Switches transmitting or receiving on.') },
        { n: 'IRQ', d: B('לא מחברים.', 'Not connected.') }
      ],
      how: [
        B('שני המודולים צריכים להסכים על שני דברים: ערוץ (תדר) ו[[address|כתובת]]. אחד מהם שולח, והשני מקשיב. כל הודעה היא כמה [[byte|בתים]], והמקלט מאשר שקיבל אותה.', 'The two modules must agree on two things: a channel (frequency) and an [[address|address]]. One of them sends, and the other listens. Each message is a few [[byte|bytes]], and the receiver confirms it arrived.'),
        B('המודול עובד ב-3.3V בלבד, והוא רגיש לאיכות ההזנה. את הפרוטוקול מנהלת [[library|ספרייה]].', 'The module works at 3.3 V only, and is sensitive to the quality of its power. The protocol is handled by a [[library|library]].')
      ],
      needs: [B('שני מודולי nRF24L01, אחד לכל לוח', 'Two nRF24L01 modules, one per board'), B('שבעה חוטי גישור עם קצה נקבה לכל מודול', 'Seven jumper wires with a female end per module')],
      lib: { name: 'nrf24l01', how: B('ב-Thonny: Tools, ואחר כך Manage packages. חפשו nrf24l01 והתקינו. הפקודות שבדוגמה לא נבדקו על לוח אמיתי.', 'In Thonny: Tools, then Manage packages. Search for nrf24l01 and install. The commands in the example have not been tried on a real board.') },
      wiring: [W('VCC', '3V3', 36, B('לא 5V', 'not 5 V')), W('GND', 'GND', 23), W('SCK', 'GP18', 24), W('MOSI', 'GP19', 25), W('MISO', 'GP16', 21), W('CSN', 'GP15', 20), W('CE', 'GP14', 19)],
      steps: [UNPLUG, loose(7), lead('VCC', '3V3(OUT)', 36), lead('GND', 'GND', 23), lead('SCK', 'GP18', 24), lead('MOSI', 'GP19', 25), lead('MISO', 'GP16', 21), lead('CSN', 'GP15', 20), lead('CE', 'GP14', 19), CHECK,
        B('בנו בדיוק את אותו מעגל על הלוח השני, והתקינו את הספרייה `nrf24l01` בשני הלוחות.', 'Build exactly the same circuit on the second board, and install the `nrf24l01` library on both boards.'),
        B('הריצו את הקוד על שני הלוחות. באחד מהם שנו את שורה 9 ל-`SENDER = False`.', 'Run the code on both boards. On one of them change line 9 to `SENDER = False`.')],
      code: [
        'from machine import Pin, SPI', 'from time import sleep', 'from nrf24l01 import NRF24L01', '',
        'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))', 'nrf = NRF24L01(spi, Pin(15, Pin.OUT), Pin(14, Pin.OUT), payload_size=8)', 'ADDRESS = b"pico1"', '',
        'SENDER = True                  # True on one board, False on the other', '',
        'if SENDER:', '    nrf.open_tx_pipe(ADDRESS)', '    nrf.stop_listening()', 'else:', '    nrf.open_rx_pipe(1, ADDRESS)', '    nrf.start_listening()', '',
        'while True:', '    if SENDER:', '        try:', '            nrf.send(b"hello")', '            print("sent")', '        except OSError:', '            print("nobody answered")', '        sleep(1)', '    elif nrf.any():', '        print("got:", nrf.recv())'
      ],
      explain: [
        E([5, 6], 'השורות האלה מגדירות SPI ויוצרות את הרדיו, עם קו הבחירה (GP15) וקו ההפעלה (GP14). כל הודעה תהיה באורך 8 בתים.', 'Sets up SPI, and creates the radio with the select line (GP15) and the enable line (GP14). Each message will be 8 bytes long.'),
        E([7], 'זו הכתובת המשותפת. שני הלוחות חייבים להשתמש באותה כתובת.', 'The shared address. Both boards must use the same address.'),
        E([9], 'זו השורה היחידה ששונה בין שני הלוחות: לוח אחד שולח, והשני מקבל.', 'The only line that differs between the two boards: one sends and the other receives.'),
        E([11, 16], 'השולח פותח ערוץ שידור ומפסיק להקשיב. המקבל פותח ערוץ קליטה ומתחיל להקשיב.', 'The sender opens a transmit channel and stops listening. The receiver opens a receive channel and starts listening.'),
        E([20, 24], 'השולח מנסה לשלוח. אם אף אחד לא אישר שקיבל את ההודעה, מתרחשת שגיאה, והקוד מדפיס הודעה במקום לעצור.', 'The sender tries to send. If nobody confirmed receipt, an error is raised, and the code prints a message rather than stopping.'),
        E([26, 27], 'המקבל בודק אם הגיעה הודעה, ומדפיס אותה.', 'The receiver checks whether a message arrived, and prints it.')
      ],
      expect: B('בלוח השולח מודפס sent פעם בשנייה. בלוח המקבל מודפס `got: b\'hello\'` באותו קצב.', 'On the sending board sent is printed once a second. On the receiving board `got: b\'hello\'` is printed at the same pace.'),
      mistakes: [
        B('תמיד מודפס "nobody answered": בדקו שהלוח השני רץ עם `SENDER = False`, ושהכתובת זהה בשני הלוחות.', '"nobody answered" is always printed: check the other board is running with `SENDER = False`, and that the address is the same on both.'),
        B('המודול מחובר ל-5V, אבל הוא עובד רק ב-3.3V.', 'The module is connected to 5 V. It works only at 3.3 V.'),
        B('החיבור לא יציב: המודול רגיש להזנה. קבל קטן (10µF) בין ה-VCC וה-GND שלו, קרוב למודול, עוזר.', 'The link is unreliable: the module is sensitive to its power. A small capacitor (10 µF) between its VCC and GND, close to the module, helps.')
      ],
      ideas: [B('שלט רחוק לרכב: ג\'ויסטיק על לוח אחד, ומנועים על השני.', 'A remote control for a car: a joystick on one board, motors on the other.'), B('חיישן טמפרטורה בחוץ ומסך בפנים.', 'A temperature sensor outdoors and a display indoors.'), B('פעמון דלת אלחוטי.', 'A wireless doorbell.')]
    }
  );
})(window.PICO);
