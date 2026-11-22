/* Component catalog, part 7: parts that Wokwi can simulate and the catalog did not have.
   The NTC thermistor, the 74HC165 input shift register with an 8-way DIP switch, a 10-segment LED bar,
   the 20x4 LCD, the ILI9341 colour display, the A4988 stepper driver and the BMP180 pressure sensor.
   Every example here was run in Wokwi (the LCD and the ILI9341 on Wokwi's first Pico: its Pico 2 model
   fails on them). Same structure as data-components.js. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, lead = c.lead, loose = c.loose, GND = c.GND, V33 = c.V33, V5 = c.V5;
  var SDA = { n: 'SDA', d: B('קו הנתונים של [[i2c|I2C]].', 'The [[i2c|I2C]] data line.') };
  var SCL = { n: 'SCL', d: B('[[clock|קו השעון]] של I2C.', 'The I2C [[clock|clock line]].') };
  var SAVE = function (file) {
    return B('שמרו על הלוח את הקובץ `' + file + '` שמופיע למטה: ב-Thonny הדביקו אותו בחלון חדש, ובחרו File, Save as, Raspberry Pi Pico, עם השם הזה בדיוק.',
      'Save the file `' + file + '` shown below onto the board: in Thonny paste it into a new window, and choose File, Save as, Raspberry Pi Pico, with exactly that name.');
  };
  var LIB = function (file) { return { name: file, how: B('קובץ קצר שמופיע בעמוד הזה. שמרו אותו על הלוח לפני הרצת הדוגמה.', 'A short file shown on this page. Save it on the board before running the example.') }; };

  P.glossary.thermistor = { cat: 'hw', t: B('תרמיסטור (NTC)', 'Thermistor (NTC)'), d: B('נגד שההתנגדות שלו משתנה עם הטמפרטורה. ב-NTC ההתנגדות יורדת כשחם. מחברים אותו במחלק מתח וקוראים אותו בפין אנלוגי.', 'A resistor whose resistance changes with temperature. In an NTC the resistance falls as it gets warmer. It is wired in a voltage divider and read on an analog pin.') };

  /* the LCD driver, now with the row addresses of a four-row display too (the 16x2 page uses the same file) */
  var LCD_DRIVER = [
    'from time import sleep_ms', '',
    'ROWS = (0x00, 0x40, 0x14, 0x54)   # where each row starts in the display\'s memory', '',
    'class LCD:', '    def __init__(self, i2c, addr=0x27):', '        self.i2c = i2c', '        self.addr = addr', '        sleep_ms(50)',
    '        for nibble in (0x03, 0x03, 0x03, 0x02):', '            self._nibble(nibble << 4)', '            sleep_ms(5)',
    '        for cmd in (0x28, 0x0C, 0x06, 0x01):', '            self.command(cmd)', '        sleep_ms(2)', '',
    '    def _nibble(self, data):', '        # 0x08 keeps the backlight on, 0x04 is the "read this now" pulse', '        self.i2c.writeto(self.addr, bytes([data | 0x08 | 0x04]))', '        self.i2c.writeto(self.addr, bytes([data | 0x08]))', '',
    '    def _byte(self, value, rs):', '        self._nibble((value & 0xF0) | rs)', '        self._nibble(((value << 4) & 0xF0) | rs)', '',
    '    def command(self, cmd):', '        self._byte(cmd, 0)', '        sleep_ms(2)', '',
    '    def clear(self):', '        self.command(0x01)', '',
    '    def move(self, col, row):', '        self.command(0x80 | (col + ROWS[row]))', '',
    '    def write(self, text):', '        for ch in text:', '            self._byte(ord(ch), 1)'
  ];
  var lcd1602 = P.componentById('lcd1602');
  if (lcd1602 && lcd1602.driver) lcd1602.driver.code = LCD_DRIVER;

  P.components.push(
    /* ============================================================ NTC thermistor */
    {
      id: 'ntc', name: B('חיישן טמפרטורה NTC', 'NTC temperature sensor'), iface: ['adc'], cat: 'sensor', volt: '3.3V',
      summary: B('נגד שמשתנה עם החום. החיישן האנלוגי הפשוט והזול ביותר לטמפרטורה.', 'A resistor that changes with heat. The simplest and cheapest analog temperature sensor.'),
      what: [
        B('[[thermistor|תרמיסטור]] הוא נגד שההתנגדות שלו תלויה בטמפרטורה. ב-NTC ההתנגדות יורדת כשמתחמם: בערך 10kΩ ב-25°C, ופחות מזה כשחם יותר.', 'A [[thermistor|thermistor]] is a resistor whose resistance depends on temperature. In an NTC the resistance falls as it warms up: about 10 kΩ at 25 °C, and less when it is hotter.'),
        B('על המודול יש גם נגד קבוע של 10kΩ. שניהם יחד יוצרים [[divider|מחלק מתח]], וה-Pico קורא את המתח שבאמצע בפין [[adc|ADC]].', 'The module also has a fixed 10 kΩ resistor. Together they form a [[divider|voltage divider]], and the Pico reads the voltage in the middle on an [[adc|ADC]] pin.')
      ],
      looks: B('לוח קטן עם שלושה פינים (GND, VCC, OUT) ועליו טיפה שחורה קטנה עם שתי רגליים: זה התרמיסטור. יש גם תרמיסטור בודד, בלי לוח, שנראה כמו קבל קרמי קטן.', 'A small board with three pins (GND, VCC, OUT) and a little black drop with two legs on it: that is the thermistor. There is also a bare thermistor with no board, which looks like a small ceramic capacitor.'),
      pins: [GND(), V33(), { n: 'OUT', d: B('המתח שבין התרמיסטור לנגד הקבוע. מתחבר לפין ADC.', 'The voltage between the thermistor and the fixed resistor. Goes to an ADC pin.') }],
      how: [
        B('מהקריאה מחשבים את היחס בין שני הנגדים, ומהיחס את הטמפרטורה בנוסחת "בטא". המספר BETA מופיע בדף הנתונים של התרמיסטור, ובדרך כלל הוא 3950.', 'From the reading you work out the ratio between the two resistors, and from the ratio the temperature with the "beta" formula. The number BETA is in the thermistor\'s datasheet, and is usually 3950.'),
        B('הדיוק תלוי בנגד הקבוע ובערך של BETA. כדי לקבל דיוק של חצי מעלה, כדאי לכייל מול מדחום טוב.', 'The accuracy depends on the fixed resistor and on BETA. For half a degree of accuracy, calibrate against a good thermometer.')
      ],
      needs: [B('מודול NTC עם נגד של 10kΩ, או תרמיסטור 10kΩ ונגד 10kΩ', 'An NTC module with a 10 kΩ resistor, or a 10 kΩ thermistor and a 10 kΩ resistor'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('VCC', '3V3', 36), W('GND', 'GND', 38), W('OUT', 'GP26', 31, B('ADC0', 'ADC0'))],
      steps: [UNPLUG,
        B('הכניסו את המודול למטריצה כך שכל פין יושב בטור נפרד.', 'Push the module into the breadboard so each pin sits in a column of its own.'),
        lead('VCC', '3V3(OUT)', 36), lead('GND', 'GND', 38), lead('OUT', 'GP26', 31), CHECK],
      code: ['from machine import ADC', 'from time import sleep', 'import math', '', 'ntc = ADC(26)', 'BETA = 3950          # from the thermistor\'s datasheet', '',
        'def celsius():', '    raw = ntc.read_u16()', '    ratio = 65535 / raw - 1             # how many times bigger the fixed resistor is', '    return 1 / (math.log(1 / ratio) / BETA + 1 / 298.15) - 273.15', '',
        'while True:', '    print("%.1f C" % celsius())', '    sleep(1)'],
      explain: [
        E([5, 6], 'השורות האלה מגדירות את פין ה-ADC ואת מקדם הבטא של התרמיסטור.', 'These lines set up the ADC pin and the thermistor\'s beta value.'),
        E([8, 11], 'השורות האלה הופכות קריאה לטמפרטורה: קודם היחס בין הנגדים, ואז נוסחת בטא. 298.15 הם 25°C בקלווין.', 'These lines turn a reading into a temperature: first the ratio between the resistors, then the beta formula. 298.15 is 25 °C in kelvin.'),
        E([13, 15], 'השורות האלה מדפיסות את הטמפרטורה פעם בשנייה.', 'These lines print the temperature once a second.')
      ],
      expect: B('בחדר מודפס מספר בסביבת 20 עד 26 מעלות. כשאוחזים את התרמיסטור באצבעות, המספר עולה לאט.', 'In a room a number around 20 to 26 degrees is printed. When you hold the thermistor between your fingers, the number slowly rises.'),
      mistakes: [
        B('הטמפרטורה יורדת כשמחממים: במודול שלכם התרמיסטור והנגד בסדר הפוך. כתבו `ratio = 1 / (65535 / raw - 1)`.', 'The temperature falls when you warm it: on your module the thermistor and the resistor are the other way round. Write `ratio = 1 / (65535 / raw - 1)`.'),
        B('שגיאת `ZeroDivisionError` או `math domain error`: הקריאה היא 0 או 65535. פין OUT לא מחובר, או מחובר לפין שאינו ADC.', 'A `ZeroDivisionError` or `math domain error`: the reading is 0 or 65535. OUT is not connected, or is on a pin that is not an ADC.'),
        B('המספר רחוק בכמה מעלות מהאמת: שנו את BETA לפי דף הנתונים, או הוסיפו תיקון קבוע אחרי כיול.', 'The number is a few degrees off: change BETA to the datasheet value, or add a fixed correction after calibrating.')
      ],
      ideas: [B('מאוורר שנדלק כשחם, עם הטרנזיסטור 2N2222.', 'A fan that switches on when it is hot, with the 2N2222 transistor.'), B('השוואה בין NTC ל-DS18B20 על אותו שולחן.', 'A comparison between the NTC and the DS18B20 on the same table.'), B('אזעקת קירור למקרר: לד שנדלק מעל 8 מעלות.', 'A fridge alarm: an LED that lights above 8 degrees.')]
    },
    /* ============================================================ 74HC165 + DIP switch */
    {
      id: 'hc165', name: B('אוגר קלט 74HC165 עם מתג DIP', '74HC165 input register with a DIP switch'), iface: ['gpio'], cat: 'input', volt: '3.3V',
      summary: B('שבב שקורא שמונה מתגים או כפתורים בשלושה פינים בלבד.', 'A chip that reads eight switches or buttons on just three pins.'),
      what: [
        B('זה ההפך של [[shiftreg|אוגר ההזזה]] 74HC595: הוא מצלם את המצב של שמונה כניסות בבת אחת, ואז מוציא אותן אחת אחרי השנייה על חוט אחד.', 'It is the opposite of the 74HC595 [[shiftreg|shift register]]: it takes a snapshot of eight inputs at once, then sends them out one after another on a single wire.'),
        B('בדוגמה הכניסות מחוברות למתג DIP, שמונה מתגים קטנים בגוף אחד. כך בוחרים מצב עבודה, כתובת או מספר בינארי בלי לשנות את הקוד.', 'In the example the inputs go to a DIP switch, eight small switches in one body. That way you choose a mode, an address or a binary number without changing the code.')
      ],
      looks: B('שבב שחור עם 16 רגליים ועליו 74HC165, וחריץ שמסמן את רגל 1. מתג ה-DIP הוא קופסה אדומה או כחולה עם שמונה מתגים לבנים, ממוספרים 1 עד 8, והמילה ON.', 'A black 16-leg chip marked 74HC165, with a notch marking leg 1. The DIP switch is a red or blue box with eight white switches numbered 1 to 8, and the word ON.'),
      pins: [
        { n: 'PL (1)', d: B('טעינה: כשהוא ב-0, השבב מצלם את שמונה הכניסות.', 'Load: while it is 0, the chip takes a snapshot of the eight inputs.') },
        { n: 'CP (2)', d: B('השעון: כל עלייה מוציאה את הביט הבא.', 'The clock: each rise brings out the next bit.') },
        { n: 'Q7 (9)', d: B('היציאה: כאן יוצאים הביטים, D7 ראשון.', 'The output: the bits come out here, D7 first.') },
        { n: 'D0 עד D7', d: B('שמונה הכניסות: רגליים 11 עד 14 ו-3 עד 6.', 'The eight inputs: legs 11 to 14 and 3 to 6.') },
        { n: 'CE (15), DS (10)', d: B('הפעלת השעון וכניסת השרשור. מחברים את שתיהן לאדמה.', 'Clock enable and the chain input. Tie both to ground.') },
        V33('VCC (16)'), GND('GND (8)')
      ],
      how: [
        B('פולס קצר ב-0 על PL מעתיק את שמונה הכניסות פנימה. אחרי זה כל פולס על CP מזיז את הביטים מקום אחד, והביט הבא מופיע על Q7.', 'A short 0 pulse on PL copies the eight inputs inside. After that each pulse on CP moves the bits one place, and the next bit appears on Q7.'),
        B('כל מתג מחבר כניסה ל-3.3V. נגד של 10kΩ מכל כניסה לאדמה מחזיק אותה ב-0 כשהמתג פתוח. בלי הנגדים הכניסות "צפות", והקריאות אקראיות.', 'Each switch connects an input to 3.3 V. A 10 kΩ resistor from each input to ground holds it at 0 when the switch is open. Without the resistors the inputs "float", and the readings are random.')
      ],
      needs: [B('שבב 74HC165', 'A 74HC165 chip'), B('מתג DIP של 8 מתגים', 'An 8-way DIP switch'), B('שמונה נגדים של 10kΩ, או מערך נגדים אחד', 'Eight 10 kΩ resistors, or one resistor array'), B('כ-25 חוטי גישור', 'About 25 jumper wires')],
      wiring: [W('PL', 'GP6', 9, B('רגל 1', 'leg 1')), W('CP', 'GP7', 10, B('רגל 2', 'leg 2')), W('Q7', 'GP8', 11, B('רגל 9', 'leg 9')), W('VCC', '3V3', 36, B('רגל 16, וגם הצד העליון של כל המתגים', 'leg 16, and the top side of every switch')), W('GND', 'GND', 38, B('רגל 8, וגם CE, DS ושמונת הנגדים', 'leg 8, and also CE, DS and the eight resistors'))],
      steps: [UNPLUG,
        B('הכניסו את השבב ואת מתג ה-DIP מעל התעלה, זה ליד זה. החריץ של השבב פונה שמאלה, והמילה ON של המתג למעלה.', 'Push the chip and the DIP switch in across the channel, side by side. The chip\'s notch faces left, and the switch\'s ON faces up.'),
        B('חברו את הצד העליון של כל שמונת המתגים לפס ההזנה.', 'Connect the top side of all eight switches to the power rail.'),
        B('חברו את הצד התחתון של מתג 1 לכניסה D0 (רגל 11), של מתג 2 ל-D1, וכן הלאה עד מתג 8 ו-D7 (רגל 6). מכל אחד מהטורים האלה חברו נגד של 10kΩ לפס האדמה.', 'Connect the bottom side of switch 1 to input D0 (leg 11), switch 2 to D1, and so on up to switch 8 and D7 (leg 6). From each of those columns connect a 10 kΩ resistor to the ground rail.'),
        lead('PL (1)', 'GP6', 9), lead('CP (2)', 'GP7', 10), lead('Q7 (9)', 'GP8', 11),
        B('חברו את רגל 16 לפס ההזנה, ואת רגליים 8, 10 ו-15 לפס האדמה.', 'Connect leg 16 to the power rail, and legs 8, 10 and 15 to the ground rail.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'load = Pin(6, Pin.OUT, value=1)     # PL: 0 copies the 8 inputs inside', 'clock = Pin(7, Pin.OUT, value=0)    # CP', 'data = Pin(8, Pin.IN)               # Q7: the bits come out here, one at a time', '',
        'def read():', '    load.off()                      # take a snapshot of D0 to D7', '    load.on()', '    byte = 0', '    for i in range(8):', '        byte = (byte << 1) | data.value()   # D7 comes out first', '        clock.on()', '        clock.off()', '    return byte', '',
        'last = None', 'while True:', '    switches = read()', '    if switches != last:', '        print("switches:", "{:08b}".format(switches))', '        last = switches', '    sleep(0.1)'],
      explain: [
        E([4, 6], 'השורות האלה מגדירות את שלושת הפינים: שתי יציאות לשבב, וכניסה אחת ממנו.', 'These lines set up the three pins: two outputs to the chip, and one input from it.'),
        E([9, 10], 'השורות האלה מצלמות את המתגים: פולס של 0 על PL.', 'These lines take the snapshot of the switches: a 0 pulse on PL.'),
        E([12, 15], 'השורות האלה קוראות שמונה ביטים. כל ביט נכנס מימין, והקודמים זזים שמאלה. אחרי כל קריאה, פולס שעון מביא את הביט הבא.', 'These lines read eight bits. Each bit comes in on the right, and the earlier ones move left. After each read, a clock pulse brings the next bit.'),
        E([21, 23], 'השורות האלה מדפיסות רק כשמשהו השתנה, כמספר בינארי של שמונה ספרות.', 'These lines print only when something changed, as an eight-digit binary number.')
      ],
      expect: B('בהתחלה מודפס `switches: 00000000`. כשמעבירים את מתג 1 ל-ON מודפס `00000001`, ומתג 8 מדליק את הספרה השמאלית.', 'At first `switches: 00000000` is printed. Turning switch 1 ON prints `00000001`, and switch 8 sets the leftmost digit.'),
      mistakes: [
        B('תמיד 11111111 או תמיד 00000000: PL או CP לא מחוברים, או ש-CE לא מחובר לאדמה.', 'Always 11111111 or always 00000000: PL or CP is not connected, or CE is not tied to ground.'),
        B('הספרות קופצות לבד: חסרים נגדי ה-10kΩ, והכניסות צפות.', 'The digits jump by themselves: the 10 kΩ resistors are missing, and the inputs float.'),
        B('הסדר הפוך: מתג 1 מדליק את הספרה השמאלית. המתגים מחוברים לכניסות בסדר הפוך, או שהקוד קורא מהצד השני.', 'The order is reversed: switch 1 sets the leftmost digit. The switches are wired to the inputs the other way round, or the code reads from the other end.')
      ],
      ideas: [B('בחירת מצב עבודה בתחילת התוכנית, בלי לשנות קוד.', 'Choosing a working mode at the start of the program, without changing code.'), B('שמונה כפתורים של משחק על שלושה פינים.', 'Eight game buttons on three pins.'), B('יחד עם 74HC595: המתגים קובעים אילו לדים דולקים.', 'Together with the 74HC595: the switches decide which LEDs are lit.')]
    },
    /* ============================================================ LED bar graph */
    {
      id: 'ledbar', name: B('פס לדים של 10 מקטעים', '10-segment LED bar'), iface: ['gpio'], cat: 'display', volt: '3.3V',
      summary: B('עשרה לדים מלבניים בגוף אחד. מד רמה פשוט, בלי ספרייה.', 'Ten rectangular LEDs in one body. A simple level meter, with no library.'),
      what: [B('בתוך הגוף יש עשרה לדים נפרדים, כל אחד עם אנודה וקתודה משלו. מדליקים כמה מהם לפי ערך כלשהו, ומקבלים מד רמה: עוצמת קול, טמפרטורה או מצב סוללה.', 'Inside the body are ten separate LEDs, each with its own anode and cathode. Light some of them according to a value, and you get a level meter: volume, temperature or battery state.')],
      looks: B('מלבן צר עם עשרה חלונות, ו-20 רגליים, עשר בכל צד. בצד אחד האנודות, ובשני הקתודות. בצד של האנודות יש לפעמים כיתוב או פינה משופעת.', 'A narrow rectangle with ten windows, and 20 legs, ten on each side. One side is the anodes, the other the cathodes. The anode side sometimes has writing or a bevelled corner.'),
      pins: [
        { n: 'A1 עד A10', d: B('האנודות. כל אחת לפין משלה.', 'The anodes. Each goes to a pin of its own.') },
        { n: 'C1 עד C10', d: B('הקתודות. כל אחת לאדמה דרך נגד של 330Ω.', 'The cathodes. Each goes to ground through a 330 Ω resistor.') }
      ],
      how: [
        B('כל מקטע הוא לד רגיל, ולכן כל אחד צריך נגד משלו. כאן הנגדים בצד הקתודות, ישר לפס האדמה, והפינים מחוברים ישר לאנודות.', 'Each segment is an ordinary LED, so each needs its own resistor. Here the resistors are on the cathode side, straight into the ground rail, and the pins go straight to the anodes.'),
        B('בדוגמה פוטנציומטר קובע כמה מקטעים דולקים. כל עשירית מהסיבוב מוסיפה מקטע.', 'In the example a potentiometer sets how many segments are lit. Each tenth of a turn adds a segment.')
      ],
      needs: [B('פס לדים של 10 מקטעים', 'A 10-segment LED bar'), B('עשרה נגדים של 330Ω', 'Ten 330 Ω resistors'), B('פוטנציומטר של 10kΩ', 'A 10 kΩ potentiometer'), B('כ-15 חוטי גישור', 'About 15 jumper wires')],
      wiring: [W('A1', 'GP6', 9, B('המקטע התחתון', 'the bottom segment')), W('A2', 'GP7', 10), W('A3', 'GP8', 11), W('A4', 'GP9', 12), W('A5', 'GP10', 14), W('A6', 'GP11', 15), W('A7', 'GP12', 16), W('A8', 'GP13', 17), W('A9', 'GP14', 19), W('A10', 'GP15', 20),
        W(B('C1 עד C10', 'C1 to C10'), 'GND', 38, B('כל אחת דרך נגד 330Ω', 'each through a 330 Ω resistor')),
        W(B('פוטנציומטר, הרגל האמצעית', 'Potentiometer, middle leg'), 'GP27', 32, B('ADC1', 'ADC1')), W(B('פוטנציומטר, רגל צד', 'Potentiometer, side leg'), '3V3', 36), W(B('פוטנציומטר, הרגל השנייה', 'Potentiometer, other side leg'), 'GND', 33)],
      steps: [UNPLUG,
        B('הכניסו את פס הלדים מעל התעלה, כשרגלי האנודות בשורה התחתונה.', 'Push the LED bar in across the channel, with the anode legs in the bottom row.'),
        B('מכל רגל קתודה בשורה העליונה, חברו נגד של 330Ω אל פס האדמה.', 'From each cathode leg in the top row, connect a 330 Ω resistor to the ground rail.'),
        B('חברו את האנודות A1 עד A10 לפינים GP6 עד GP15 לפי הטבלה.', 'Connect the anodes A1 to A10 to pins GP6 to GP15 as in the table.'),
        B('הכניסו את הפוטנציומטר, וחברו אותו כמו בשיעור B1: רגל צד ל-3.3V, האמצעית ל-GP27 והשנייה לאדמה.', 'Insert the potentiometer and wire it as in lesson B1: a side leg to 3.3 V, the middle to GP27 and the other to ground.'),
        CHECK],
      code: ['from machine import Pin, ADC', 'from time import sleep', '', 'pot = ADC(27)', 'bars = [Pin(n, Pin.OUT) for n in range(6, 16)]   # GP6 to GP15, bottom bar first', '',
        'while True:', '    level = pot.read_u16() * 11 // 65536             # 0 to 10 bars', '    for i, bar in enumerate(bars):', '        bar.value(i < level)', '    sleep(0.05)'],
      explain: [
        E([5], 'השורה הזו יוצרת רשימה של עשרה פינים בפקודה אחת, מ-GP6 עד GP15.', 'This line makes a list of ten pins in one go, from GP6 to GP15.'),
        E([8], 'השורה הזו הופכת את הקריאה (0 עד 65535) למספר המקטעים, מ-0 עד 10.', 'This line turns the reading (0 to 65535) into a number of segments, from 0 to 10.'),
        E([9, 10], 'השורות האלה מדליקות כל מקטע שהמספר שלו קטן מהרמה, ומכבות את השאר.', 'These lines light every segment whose number is below the level, and switch off the rest.')
      ],
      expect: B('כשמסובבים את הפוטנציומטר, הפס מתמלא מלמטה למעלה: בקצה אחד כל המקטעים כבויים, ובקצה השני כולם דולקים.', 'As you turn the potentiometer, the bar fills from the bottom up: at one end all segments are off, and at the other all are lit.'),
      mistakes: [
        B('מקטע אחד לא נדלק: הנגד שלו לא מחובר לפס האדמה, או שהחוט לאנודה שלו רופף.', 'One segment does not light: its resistor is not connected to the ground rail, or the wire to its anode is loose.'),
        B('אף מקטע לא נדלק: הפס הפוך, האנודות בשורה העליונה. סובבו אותו.', 'No segment lights: the bar is the wrong way round, with the anodes in the top row. Turn it round.'),
        B('הפס מתמלא מלמעלה למטה: הפכו את הרשימה, `range(15, 5, -1)`.', 'The bar fills from the top down: reverse the list, `range(15, 5, -1)`.')
      ],
      ideas: [B('מד עוצמת קול עם חיישן הקול.', 'A volume meter with the sound sensor.'), B('מד טמפרטורה עם ה-NTC.', 'A temperature meter with the NTC.'), B('אותו פס על שלושה פינים בלבד, דרך שני שבבי 74HC595.', 'The same bar on just three pins, through two 74HC595 chips.')]
    },
    /* ============================================================ LCD 20x4 */
    {
      id: 'lcd2004', name: B('מסך LCD 20×4 עם מתאם I2C', '20×4 LCD with an I2C adapter'), iface: ['i2c'], cat: 'display', volt: '5V', addr: '0x27',
      summary: B('הגרסה הגדולה של מסך ה-LCD: ארבע שורות של 20 תווים.', 'The big version of the LCD: four lines of 20 characters.'),
      what: [B('מסך טקסט כמו LCD 16×2, עם פי שניים מקום. מתאים לתפריט, ללוח נתונים של כמה חיישנים, או להודעה ארוכה.', 'A text display like the 16×2 LCD, with twice the room. Good for a menu, a dashboard of several sensors, or a long message.')],
      looks: B('מסך מלבני גדול, ובגב שלו אותו מתאם I2C שחור עם ארבעה פינים ובורג כחול לניגודיות.', 'A large rectangular display, with the same black I2C adapter on its back: four pins and a blue contrast screw.'),
      pins: [GND(), V5(), SDA, SCL],
      how: [
        B('הקוד זהה לזה של מסך 16×2, ומשתמש באותו קובץ `pico_lcd.py`. ההבדל היחיד הוא שהשורות השלישית והרביעית מתחילות בכתובות אחרות בזיכרון של המסך. הטבלה `ROWS` בקובץ שומרת אותן.', 'The code is the same as for the 16×2 display, and uses the same `pico_lcd.py` file. The only difference is that the third and fourth rows start at other addresses in the display\'s memory. The `ROWS` table in the file keeps them.'),
        B('כמו ב-16×2, המסך צריך 5V, והאזהרה על קווי ה-I2C של 5V נכונה גם כאן.', 'As with the 16×2, the display needs 5 V, and the warning about 5 V I2C lines applies here too.')
      ],
      needs: [B('מסך LCD 20×4 עם מתאם I2C מולחם', 'A 20×4 LCD with an I2C adapter soldered on'), B('ארבעה חוטי גישור עם קצה נקבה', 'Four jumper wires with a female end')],
      lib: LIB('pico_lcd.py'),
      driver: { file: 'pico_lcd.py', code: LCD_DRIVER },
      wiring: [W('GND', 'GND', 8), W('VCC', 'VBUS', 40, B('5V', '5 V')), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, loose(4), lead('GND', 'GND', 8), lead('VCC', 'VBUS', 40), lead('SDA', 'GP4', 6), lead('SCL', 'GP5', 7), CHECK, SAVE('pico_lcd.py')],
      code: ['from machine import Pin, I2C', 'from pico_lcd import LCD', 'from time import sleep, ticks_ms', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=100_000)', 'lcd = LCD(i2c, 0x27)', 'lcd.clear()',
        'lcd.write("Pico 2 Lab")', 'lcd.move(0, 1)', 'lcd.write("A 20x4 display")', 'lcd.move(0, 3)', 'lcd.write("Row 4 is down here")', '',
        'while True:', '    lcd.move(0, 2)', '    lcd.write("Uptime: %d s" % (ticks_ms() // 1000))', '    sleep(1)'],
      explain: [
        E([5, 7], 'השורות האלה מגדירות את ה[[bus|אפיק]], יוצרות את המסך ומנקות אותו.', 'These lines set up the [[bus|bus]], create the display and clear it.'),
        E([8, 12], 'השורות האלה כותבות בשורות 1, 2 ו-4. השורות ממוספרות מ-0, ולכן `move(0, 3)` היא השורה הרביעית.', 'These lines write on rows 1, 2 and 4. Rows are numbered from 0, so `move(0, 3)` is the fourth row.'),
        E([14, 17], 'השורות האלה מעדכנות את השורה השלישית פעם בשנייה, עם הזמן מאז ההפעלה.', 'These lines update the third row once a second, with the time since start-up.')
      ],
      expect: B('ארבע שורות מופיעות, והשורה השלישית סופרת שניות.', 'Four rows appear, and the third row counts seconds.'),
      mistakes: [
        B('השורה השלישית מופיעה אחרי הראשונה, באמצע: בקובץ `pico_lcd.py` יש גרסה ישנה בלי `ROWS`. החליפו אותו בגרסה שבעמוד הזה.', 'The third row appears after the first, in the middle: the `pico_lcd.py` on the board is an old version without `ROWS`. Replace it with the one on this page.'),
        B('המסך מואר אבל ריק: סובבו את בורג הניגודיות שבגב.', 'The display is lit but blank: turn the contrast screw on the back.'),
        B('`OSError: [Errno 5]`: הכתובת אינה 0x27. הדפיסו את `i2c.scan()` ונסו 0x3F.', '`OSError: [Errno 5]`: the address is not 0x27. Print `i2c.scan()` and try 0x3F.')
      ],
      ideas: [B('לוח נתונים: טמפרטורה, לחות, לחץ ושעה, שורה לכל אחד.', 'A dashboard: temperature, humidity, pressure and time, a row each.'), B('תפריט עם מקודד סיבובי.', 'A menu with the rotary encoder.'), B('שלט הודעות כמו בשיעור F6, עם הודעות ארוכות יותר.', 'A message board as in lesson F6, with longer messages.')]
    },
    /* ============================================================ ILI9341 colour display */
    {
      id: 'ili9341', name: B('מסך צבעוני ILI9341', 'ILI9341 colour display'), iface: ['spi'], cat: 'display', volt: '3.3V',
      summary: B('מסך צבעוני של 240×320 פיקסלים, מהיר, ב-SPI.', 'A 240×320 pixel colour display, fast, over SPI.'),
      what: [
        B('מסך TFT בגודל 2.4 עד 2.8 אינץ\', עם 65 אלף צבעים. מתאים לגרפים, למשחקים ולממשק עם כפתורים מצוירים.', 'A 2.4 to 2.8 inch TFT display, with 65 thousand colours. Good for graphs, games, and an interface with drawn buttons.'),
        B('כל פיקסל צריך 16 ביטים, ולמסך כולו יש 76,800 פיקסלים. לכן הוא עובד ב-[[spi|SPI]] מהיר, ולא ב-I2C.', 'Each pixel needs 16 bits, and the whole display has 76,800 pixels. That is why it works over fast [[spi|SPI]], not I2C.')
      ],
      looks: B('מסך מלבני על לוח אדום, ובצד אחד שורה של 9 פינים: VCC, GND, CS, RESET, DC, MOSI (או SDI), SCK, LED ו-MISO. בחלק מהדגמים יש גם שקע לכרטיס SD ופינים למגע.', 'A rectangular display on a red board, with a row of 9 pins on one side: VCC, GND, CS, RESET, DC, MOSI (or SDI), SCK, LED and MISO. Some models also have an SD card slot and touch pins.'),
      pins: [
        { n: 'SCK', d: B('השעון של SPI.', 'The SPI clock.') },
        { n: 'MOSI (SDI)', d: B('הנתונים מה-Pico למסך.', 'The data from the Pico to the display.') },
        { n: 'CS', d: B('בחירת המסך: 0 בזמן שמדברים איתו.', 'Chip select: 0 while talking to it.') },
        { n: 'D/C', d: B('0 = פקודה, 1 = נתונים (צבעים).', '0 = command, 1 = data (colours).') },
        { n: 'RST', d: B('איפוס בהפעלה.', 'Reset at start-up.') },
        { n: 'LED', d: B('התאורה האחורית. ל-3.3V.', 'The backlight. To 3.3 V.') },
        V33(), GND()
      ],
      how: [
        B('כדי לצייר, שולחים למסך חלון (טווח של x ו-y), ואז את הצבעים של כל הפיקסלים בחלון ברצף. כך מלבן מלא נשלח בפקודה אחת.', 'To draw, you send the display a window (a range of x and y), then the colours of all the pixels in it in a row. That way a filled rectangle goes in one command.'),
        B('הקובץ `pico_ili9341.py` שבעמוד הזה עושה את זה ב-80 שורות: איתחול, מלבן מלא, מילוי המסך וטקסט בגופן המובנה של MicroPython, עם הגדלה. הפונקציה `rgb()` הופכת שלושה מספרים של 0 עד 255 לצבע של 16 ביטים.', 'The file `pico_ili9341.py` on this page does that in 80 lines: start-up, a filled rectangle, filling the screen, and text in MicroPython\'s built-in font, with scaling. The `rgb()` function turns three numbers from 0 to 255 into a 16-bit colour.')
      ],
      needs: [B('מסך ILI9341 עם 9 פינים', 'An ILI9341 display with 9 pins'), B('שמונה חוטי גישור', 'Eight jumper wires')],
      lib: LIB('pico_ili9341.py'),
      driver: {
        file: 'pico_ili9341.py',
        code: ['import framebuf', 'from machine import Pin', 'from time import sleep_ms', '',
          'def rgb(r, g, b):', '    # 0 to 255 each, packed into 16 bits: 5 red, 6 green, 5 blue', '    return (r & 0xF8) << 8 | (g & 0xFC) << 3 | b >> 3', '',
          'class ILI9341:', '    def __init__(self, spi, cs, dc, rst, width=240, height=320):', '        self.spi, self.cs, self.dc, self.rst = spi, cs, dc, rst', '        self.width, self.height = width, height',
          '        for p in (cs, dc, rst):', '            p.init(Pin.OUT, value=1)', '        rst.off()', '        sleep_ms(10)', '        rst.on()', '        sleep_ms(120)',
          '        self.command(0x01)              # software reset', '        sleep_ms(120)', '        self.command(0x11)              # wake up', '        sleep_ms(120)',
          '        self.command(0x3A, b"\\x55")     # 16 bits per pixel', '        self.command(0x36, b"\\x48")     # rotation and colour order', '        self.command(0x29)              # display on', '',
          '    def command(self, cmd, data=None):', '        self.cs.off()', '        self.dc.off()                   # D/C low: a command', '        self.spi.write(bytes([cmd]))', '        if data:', '            self.dc.on()                # D/C high: data', '            self.spi.write(data)', '        self.cs.on()', '',
          '    def window(self, x, y, w, h):', '        x2, y2 = x + w - 1, y + h - 1', '        self.command(0x2A, bytes([x >> 8, x & 255, x2 >> 8, x2 & 255]))', '        self.command(0x2B, bytes([y >> 8, y & 255, y2 >> 8, y2 & 255]))', '        self.command(0x2C)              # the pixels come next', '',
          '    def pixels(self, data):', '        self.cs.off()', '        self.dc.on()', '        self.spi.write(data)', '        self.cs.on()', '',
          '    def fill_rect(self, x, y, w, h, color):', '        self.window(x, y, w, h)', '        line = bytes([color >> 8, color & 255]) * w', '        self.cs.off()', '        self.dc.on()', '        for _ in range(h):', '            self.spi.write(line)', '        self.cs.on()', '',
          '    def fill(self, color):', '        self.fill_rect(0, 0, self.width, self.height, color)', '',
          '    def text(self, s, x, y, color, bg=0, scale=1):', '        w = 8 * len(s)', '        small = framebuf.FrameBuffer(bytearray(w), w, 8, framebuf.MONO_HLSB)', '        small.text(s, 0, 0, 1)          # the built-in 8x8 font',
          '        big = bytearray(w * scale * 8 * scale * 2)', '        i = 0', '        for py in range(8 * scale):', '            for px in range(w * scale):', '                c = color if small.pixel(px // scale, py // scale) else bg', '                big[i] = c >> 8', '                big[i + 1] = c & 255', '                i += 2',
          '        self.window(x, y, w * scale, 8 * scale)', '        self.pixels(big)']
      },
      wiring: [W('SCK', 'GP18', 24, B('SPI0', 'SPI0')), W('MOSI', 'GP19', 25, B('בחלק מהמסכים כתוב SDI', 'marked SDI on some displays')), W('CS', 'GP20', 26), W('DC', 'GP21', 27, B('בחלק מהמסכים כתוב D/C', 'marked D/C on some displays')), W('RST', 'GP22', 29), W('VCC', '3V3', 36), W('LED', '3V3', 36, B('התאורה האחורית', 'the backlight')), W('GND', 'GND', 38)],
      steps: [UNPLUG, loose(8), lead('SCK', 'GP18', 24), lead('MOSI (SDI)', 'GP19', 25), lead('CS', 'GP20', 26), lead('D/C', 'GP21', 27), lead('RST', 'GP22', 29),
        B('חברו את VCC ואת LED ל-3V3(OUT) (פין 36), ואת GND לאדמה. את MISO לא צריך לחבר.', 'Connect VCC and LED to 3V3(OUT) (pin 36), and GND to ground. MISO does not need connecting.'),
        CHECK, SAVE('pico_ili9341.py')],
      code: ['from machine import Pin, SPI', 'from pico_ili9341 import ILI9341, rgb', '', 'spi = SPI(0, baudrate=20_000_000, sck=Pin(18), mosi=Pin(19))', 'tft = ILI9341(spi, cs=Pin(20), dc=Pin(21), rst=Pin(22))', '',
        'tft.fill(rgb(0, 0, 60))', 'tft.text("Pico 2 Lab", 0, 20, rgb(255, 255, 0), rgb(0, 0, 60), scale=3)', 'tft.fill_rect(20, 80, 200, 20, rgb(255, 0, 0))', 'tft.fill_rect(20, 110, 140, 20, rgb(0, 255, 0))', 'tft.fill_rect(20, 140, 80, 20, rgb(0, 128, 255))'],
      explain: [
        E([4, 5], 'השורות האלה מגדירות את SPI במהירות של 20 מגה-הרץ, ויוצרות את המסך עם שלושת פיני הבקרה.', 'These lines set up SPI at 20 MHz, and create the display with its three control pins.'),
        E([7, 8], 'השורות האלה צובעות את כל המסך בכחול כהה, וכותבות כותרת צהובה בגודל פי 3.', 'These lines paint the whole screen dark blue, and write a yellow title three times the normal size.'),
        E([9, 11], 'השורות האלה מציירות שלושה מלבנים: אדום, ירוק וכחול, באורכים שונים, כמו גרף עמודות.', 'These lines draw three rectangles: red, green and blue, of different lengths, like a bar chart.')
      ],
      expect: B('המסך נצבע בכחול כהה, מופיעה הכותרת Pico 2 Lab בצהוב, ומתחתיה שלושה פסים צבעוניים.', 'The screen turns dark blue, the title Pico 2 Lab appears in yellow, and below it three coloured bars.'),
      mistakes: [
        B('המסך לבן לגמרי: הוא מקבל חשמל אבל לא פקודות. בדקו את CS, D/C ו-RST, ואת SCK ו-MOSI.', 'The screen is all white: it has power but no commands. Check CS, D/C and RST, and SCK and MOSI.'),
        B('אדום וכחול מתחלפים: שנו את `b"\\x48"` ל-`b"\\x40"` בפקודה 0x36.', 'Red and blue are swapped: change `b"\\x48"` to `b"\\x40"` in command 0x36.'),
        B('`MemoryError` בטקסט גדול: כל פיקסל דורש שני בתים. קצרו את המחרוזת או הקטינו את `scale`.', 'A `MemoryError` on big text: each pixel takes two bytes. Shorten the string or reduce `scale`.')
      ],
      ideas: [B('גרף טמפרטורה שמתעדכן בזמן אמת.', 'A temperature graph that updates live.'), B('משחק פונג עם הג\'ויסטיק.', 'A pong game with the joystick.'), B('מסך מצב לרובוט: מהירות, מרחק וסוללה.', 'A status screen for the robot: speed, distance and battery.')]
    },
    /* ============================================================ A4988 stepper driver */
    {
      id: 'a4988', name: B('דרייבר צעדים A4988 ומנוע דו-קוטבי', 'A4988 stepper driver and bipolar motor'), iface: ['gpio'], cat: 'output', volt: '3.3V',
      summary: B('שני פינים מסובבים מנוע צעדים חזק: STEP לכל צעד, ו-DIR לכיוון.', 'Two pins turn a strong stepper motor: STEP for each step, and DIR for the direction.'),
      what: [
        B('מנוע צעדים דו-קוטבי, כמו NEMA 17, הוא המנוע של מדפסות תלת-ממד ומכונות CNC. הוא זז בצעדים מדויקים של 1.8 מעלות, 200 צעדים לסיבוב.', 'A bipolar stepper motor, such as a NEMA 17, is the motor of 3D printers and CNC machines. It moves in precise steps of 1.8 degrees, 200 steps per turn.'),
        B('ה-A4988 הוא [[motordriver|דרייבר]] שעושה את כל העבודה: ה-Pico שולח פולס על STEP, והדרייבר מזיז את המנוע צעד אחד. זה פשוט יותר מהמנוע 28BYJ-48, שבו הקוד מפעיל ארבעה סלילים בעצמו.', 'The A4988 is a [[motordriver|driver]] that does all the work: the Pico sends a pulse on STEP, and the driver moves the motor one step. It is simpler than the 28BYJ-48 motor, where the code drives four coils itself.')
      ],
      looks: B('לוח קטן ירוק או סגול עם 16 פינים, שמונה בכל צד, שבב שחור במרכז וחום קטן בצד: פוטנציומטר שמגביל את הזרם. לפעמים מודבק עליו גוף קירור. המנוע הוא קובייה מתכתית עם ארבעה חוטים.', 'A small green or purple board with 16 pins, eight on each side, a black chip in the middle and a small trimmer at the side that limits the current. Sometimes a heat sink is stuck on it. The motor is a metal cube with four wires.'),
      pins: [
        { n: 'STEP', d: B('כל עלייה מזיזה את המנוע צעד אחד.', 'Each rise moves the motor one step.') },
        { n: 'DIR', d: B('הכיוון: 1 או 0.', 'The direction: 1 or 0.') },
        { n: 'SLEEP, RESET', d: B('מחברים אותם זה לזה, כדי שהדרייבר יהיה ער.', 'Join them to each other, so the driver stays awake.') },
        { n: 'MS1, MS2, MS3', d: B('חצאי צעדים ופחות. לא מחוברים = צעד מלא.', 'Half steps and smaller. Unconnected = full steps.') },
        { n: '1A, 1B, 2A, 2B', d: B('שני הסלילים של המנוע: זוג לכל סליל.', 'The motor\'s two coils: one pair per coil.') },
        { n: 'VMOT', d: B('המתח של המנוע, 8 עד 35V, מספק נפרד. קבל של 100µF בין VMOT לאדמה.', 'The motor voltage, 8 to 35 V, from a separate supply. A 100 µF capacitor between VMOT and ground.') },
        V33('VDD'), GND()
      ],
      how: [
        B('מספר הפולסים קובע כמה המנוע מסתובב, והזמן בין הפולסים קובע את המהירות. 200 פולסים הם סיבוב שלם.', 'The number of pulses sets how far the motor turns, and the time between pulses sets the speed. 200 pulses are a full turn.'),
        B('המנוע צריך הרבה יותר זרם ממה שה-Pico יכול לתת, ולכן הוא מקבל חשמל מספק נפרד דרך VMOT. האדמה של הספק משותפת לאדמה של ה-Pico.', 'The motor needs far more current than the Pico can give, so it is fed from a separate supply through VMOT. The supply\'s ground is shared with the Pico\'s ground.')
      ],
      needs: [B('דרייבר A4988', 'An A4988 driver'), B('מנוע צעדים דו-קוטבי (NEMA 17 או קטן יותר)', 'A bipolar stepper motor (NEMA 17 or smaller)'), B('ספק של 12V, וקבל של 100µF', 'A 12 V supply, and a 100 µF capacitor'), B('כ-12 חוטי גישור', 'About 12 jumper wires')],
      wiring: [W('STEP', 'GP2', 4), W('DIR', 'GP3', 5), W('VDD', '3V3', 36), W('GND', 'GND', 38, B('משותפת עם המינוס של ספק המנוע', 'shared with the motor supply\'s minus'))],
      steps: [UNPLUG,
        B('הכניסו את הדרייבר מעל התעלה, כשהפוטנציומטר הקטן בצד ימין.', 'Push the driver in across the channel, with the small trimmer on the right.'),
        B('חברו חוט קצר בין SLEEP ל-RESET.', 'Connect a short wire between SLEEP and RESET.'),
        lead('STEP', 'GP2', 4), lead('DIR', 'GP3', 5),
        B('חברו את VDD לפס ההזנה (3.3V), ואת שתי רגלי ה-GND לפס האדמה.', 'Connect VDD to the power rail (3.3 V), and both GND legs to the ground rail.'),
        B('חברו את ארבעת חוטי המנוע ל-1A, 1B, 2A ו-2B: זוג החוטים של סליל אחד ל-1A ו-1B, והזוג השני ל-2A ו-2B. כדי למצוא זוג, מדדו התנגדות במולטימטר: בין חוטים של אותו סליל יש כמה אוהמים.', 'Connect the motor\'s four wires to 1A, 1B, 2A and 2B: one coil\'s pair to 1A and 1B, the other pair to 2A and 2B. To find a pair, measure resistance with a multimeter: between wires of the same coil there are a few ohms.'),
        B('חברו את הפלוס של ספק ה-12V ל-VMOT ואת המינוס לפס האדמה, עם קבל של 100µF ביניהם, הפס של הקבל לכיוון האדמה.', 'Connect the 12 V supply\'s plus to VMOT and its minus to the ground rail, with a 100 µF capacitor between them, the capacitor\'s stripe towards ground.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep_us, sleep', '', 'step = Pin(2, Pin.OUT)', 'direction = Pin(3, Pin.OUT)', 'STEPS = 200            # full steps in one turn of a 1.8 degree motor', '',
        'def turn(steps, forward=True, delay_us=2000):', '    direction.value(1 if forward else 0)', '    for _ in range(steps):', '        step.on()          # each pulse on STEP moves the motor one step', '        sleep_us(5)', '        step.off()', '        sleep_us(delay_us) # a shorter wait turns it faster', '',
        'while True:', '    turn(STEPS)            # one full turn', '    sleep(1)', '    turn(STEPS // 2, False)', '    sleep(1)'],
      explain: [
        E([4, 6], 'השורות האלה מגדירות את שני הפינים, ואת מספר הצעדים בסיבוב.', 'These lines set up the two pins, and the number of steps in a turn.'),
        E([8, 14], 'השורות האלה מסובבות את המנוע: קובעות כיוון, ושולחות פולס קצר על STEP לכל צעד. ההמתנה בין הפולסים קובעת את המהירות.', 'These lines turn the motor: they set the direction, and send a short pulse on STEP for each step. The wait between pulses sets the speed.'),
        E([16, 20], 'השורות האלה עושות סיבוב שלם קדימה, וחצי סיבוב אחורה, שוב ושוב.', 'These lines make a full turn forward, and half a turn back, again and again.')
      ],
      expect: B('המנוע מסתובב סיבוב שלם, עוצר לשנייה, חוזר חצי סיבוב, ושוב. כל סיבוב לוקח בערך 0.4 שניות.', 'The motor makes a full turn, stops for a second, goes back half a turn, and again. Each turn takes about 0.4 seconds.'),
      mistakes: [
        B('המנוע רועד ולא מסתובב: הזוגות מחוברים לא נכון. החליפו בין החוט של 1B לחוט של 2A.', 'The motor shakes and does not turn: the pairs are wired wrong. Swap the 1B wire with the 2A wire.'),
        B('המנוע מאבד צעדים או לא זז במהירות גבוהה: הגדילו את `delay_us`, או סובבו מעט את פוטנציומטר הזרם.', 'The motor loses steps or does not move at high speed: increase `delay_us`, or turn the current trimmer a little.'),
        B('הדרייבר חם מאוד: הזרם גבוה מדי. הנמיכו אותו בפוטנציומטר, והוסיפו גוף קירור.', 'The driver is very hot: the current is too high. Lower it with the trimmer, and add a heat sink.'),
        B('לעולם אל תנתקו את המנוע בזמן שיש מתח ב-VMOT. הקפיצה במתח עלולה לשרוף את הדרייבר.', 'Never disconnect the motor while VMOT is powered. The voltage spike can destroy the driver.')
      ],
      ideas: [B('מסוע קטן שזז בצעדים מדויקים.', 'A small conveyor that moves in precise steps.'), B('שעון עם מחוג אחד שזז כל דקה.', 'A clock with a single hand that moves every minute.'), B('פלוטר: שני מנועים ועט.', 'A plotter: two motors and a pen.')]
    },
    /* ============================================================ BMP180 */
    {
      id: 'bmp180', name: B('חיישן לחץ BMP180', 'BMP180 pressure sensor'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x77',
      summary: B('לחץ אוויר וטמפרטורה ב-I2C. מהלחץ אפשר לחשב גובה.', 'Air pressure and temperature over I2C. From the pressure you can work out height.'),
      what: [
        B('החיישן מודד את לחץ האוויר, בערך 1013 הקטופסקל בגובה פני הים. הלחץ יורד כשעולים, בערך הקטופסקל אחד לכל 8 מטרים, ולכן אפשר לחשב ממנו גובה.', 'The sensor measures air pressure, about 1013 hectopascals at sea level. The pressure falls as you climb, about one hectopascal per 8 metres, so height can be worked out from it.'),
        B('זה שבב ותיק, ויש לו יורשים: BMP280 ו-BME280, שיש באתר. הקוד שלו הוא תרגיל טוב ב[[datasheet|קריאת דף נתונים]]: את הנוסחאות מעתיקים מהדף, שורה אחרי שורה.', 'It is an older chip, with successors: the BMP280 and BME280, which are on the site. Its code is a good exercise in [[datasheet|reading a datasheet]]: the formulas are copied from the sheet, line by line.')
      ],
      looks: B('לוח קטן כחול או סגול עם ארבעה או חמישה פינים, ועליו קופסה מתכתית זעירה עם חור קטן. בדרך כלל כתוב GY-68.', 'A small blue or purple board with four or five pins, carrying a tiny metal box with a small hole. It is usually marked GY-68.'),
      pins: [V33('VIN'), GND(), SCL, SDA],
      how: [
        B('בכל שבב נשמרים במפעל 11 מספרי כיול. הקוד קורא אותם פעם אחת, ואחר כך משתמש בהם כדי להפוך כל מדידה גולמית לטמפרטורה וללחץ אמיתיים.', 'Each chip stores 11 calibration numbers at the factory. The code reads them once, then uses them to turn each raw measurement into a real temperature and pressure.'),
        B('הגובה מחושב בנוסחה הבינלאומית, מתוך הלחץ בגובה פני הים. הלחץ הזה משתנה עם מזג האוויר, ולכן הגובה המוחלט לא מדויק. ההפרש בגובה בין שתי נקודות, באותו זמן, מדויק בהרבה.', 'The height comes from the international formula, from the pressure at sea level. That pressure changes with the weather, so the absolute height is not accurate. The difference in height between two places, at the same time, is far more accurate.')
      ],
      needs: [B('מודול BMP180 (GY-68)', 'A BMP180 module (GY-68)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      lib: LIB('pico_bmp180.py'),
      driver: {
        file: 'pico_bmp180.py',
        code: ['import struct', 'from time import sleep_ms', '',
          'class BMP180:', '    def __init__(self, i2c, addr=0x77):', '        self.i2c, self.addr = i2c, addr', '        # 11 calibration numbers, written into the chip at the factory',
          '        (self.ac1, self.ac2, self.ac3, self.ac4, self.ac5, self.ac6,', '         self.b1, self.b2, self.mb, self.mc, self.md) = struct.unpack(">hhhHHHhhhhh", i2c.readfrom_mem(addr, 0xAA, 22))', '',
          '    def _measure(self, cmd, n):', '        self.i2c.writeto_mem(self.addr, 0xF4, bytes([cmd]))', '        sleep_ms(5)', '        return self.i2c.readfrom_mem(self.addr, 0xF6, n)', '',
          '    def read(self):', '        # temperature, by the formulas in the datasheet', '        d = self._measure(0x2E, 2)', '        ut = d[0] << 8 | d[1]', '        x1 = (ut - self.ac6) * self.ac5 >> 15', '        x2 = int((self.mc << 11) / (x1 + self.md))', '        b5 = x1 + x2', '        t = ((b5 + 8) >> 4) / 10',
          '        # pressure, the same way', '        d = self._measure(0x34, 3)', '        up = (d[0] << 16 | d[1] << 8 | d[2]) >> 8', '        b6 = b5 - 4000', '        x1 = (self.b2 * (b6 * b6 >> 12)) >> 11', '        x2 = self.ac2 * b6 >> 11', '        b3 = (self.ac1 * 4 + x1 + x2 + 2) >> 2',
          '        x1 = self.ac3 * b6 >> 13', '        x2 = (self.b1 * (b6 * b6 >> 12)) >> 16', '        b4 = self.ac4 * (((x1 + x2 + 2) >> 2) + 32768) >> 15', '        p = (up - b3) * 50000 * 2 // b4',
          '        x1 = ((p >> 8) * (p >> 8) * 3038) >> 16', '        x2 = (-7357 * p) >> 16', '        p += (x1 + x2 + 3791) >> 4', '        return t, p                     # degrees C, pascals']
      },
      wiring: [W('VIN', '3V3', 36), W('GND', 'GND', 38), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG,
        B('הכניסו את המודול למטריצה כך שכל פין יושב בטור נפרד.', 'Push the module into the breadboard so each pin sits in a column of its own.'),
        lead('VIN', '3V3(OUT)', 36), lead('GND', 'GND', 38), lead('SDA', 'GP4', 6), lead('SCL', 'GP5', 7), CHECK, SAVE('pico_bmp180.py')],
      code: ['from machine import Pin, I2C', 'from pico_bmp180 import BMP180', 'from time import sleep', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'print([hex(a) for a in i2c.scan()])     # expect 0x77', 'bmp = BMP180(i2c)', '',
        'while True:', '    t, p = bmp.read()', '    height = 44330 * (1 - (p / 101325) ** (1 / 5.255))', '    print("%.1f C   %.1f hPa   %d m" % (t, p / 100, round(height)))', '    sleep(2)'],
      explain: [
        E([5, 7], 'השורות האלה מגדירות את האפיק, מדפיסות את הכתובות שעונות (צריך להופיע 0x77), ויוצרות את החיישן. ביצירה הוא קורא את מספרי הכיול.', 'These lines set up the bus, print the addresses that answer (0x77 should appear), and create the sensor. On creation it reads the calibration numbers.'),
        E([10, 11], 'השורות האלה קוראות טמפרטורה ולחץ, ומחשבות גובה בנוסחה הבינלאומית. 101325 פסקל הם הלחץ הממוצע בגובה פני הים.', 'These lines read temperature and pressure, and work out height with the international formula. 101325 pascals is the average pressure at sea level.'),
        E([12], 'השורה הזו מדפיסה את שלושתם. הלחץ מחולק ב-100 כדי לקבל הקטופסקל.', 'This line prints all three. The pressure is divided by 100 to get hectopascals.')
      ],
      expect: B('מודפסת שורה כל שתי שניות, למשל `24.3 C   1009.5 hPa   32 m`. כשמרימים את החיישן מהרצפה לתקרה, הגובה עולה בשניים או שלושה מטרים.', 'A line is printed every two seconds, for example `24.3 C   1009.5 hPa   32 m`. Lifting the sensor from the floor to the ceiling raises the height by two or three metres.'),
      mistakes: [
        B('`[]` בסריקה: החיישן לא עונה. בדקו את SDA ו-SCL, ושה-VIN מקבל 3.3V.', '`[]` in the scan: the sensor does not answer. Check SDA and SCL, and that VIN gets 3.3 V.'),
        B('הגובה רחוק מהאמת בעשרות מטרים: זה בגלל מזג האוויר. החליפו את 101325 בלחץ של היום בגובה פני הים, מתחזית מזג האוויר.', 'The height is tens of metres off: that is the weather. Replace 101325 with today\'s sea-level pressure, from the weather forecast.'),
        B('הטמפרטורה גבוהה ממה שבחדר: המודול קרוב ל-Pico או לרכיב חם. הרחיקו אותו.', 'The temperature is higher than the room: the module is close to the Pico or to a warm part. Move it away.')
      ],
      ideas: [B('מד גובה למעלית או למדרגות: הפרש הגובה מקומה לקומה.', 'An altimeter for a lift or stairs: the height difference from floor to floor.'), B('תחנת מזג אוויר: לחץ שיורד מהר מסמן גשם.', 'A weather station: falling pressure warns of rain.'), B('רישום של הלחץ לאורך יממה לכרטיס microSD.', 'Logging the pressure over a day to a microSD card.')]
    }
  );
})(window.PICO);
