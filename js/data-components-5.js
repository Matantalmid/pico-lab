/* Component catalog, part 5: eight more parts. Power switching, more pins,
   precise measuring and more sensors. Same structure as data-components.js.
   None of these needs a library: each example talks to the part directly,
   so the page also shows how such a part is spoken to.
   The names in each wiring row match the part's placement template
   (js/data-layouts-2.js), which draws its breadboard picture. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, seat = c.seat, wire = c.wire, loose = c.loose, lead = c.lead, GND = c.GND, V33 = c.V33, V5 = c.V5;

  var SDA = { n: 'SDA', d: B('קו הנתונים של [[i2c|I2C]].', 'The [[i2c|I2C]] data line.') };
  var SCL = { n: 'SCL', d: B('[[clock|קו השעון]] של I2C.', 'The I2C [[clock|clock line]].') };
  var I2C_LINE = 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))';
  var NO_ANSWER = function (addr) {
    return B('מופיעה השגיאה `OSError`, כלומר הרכיב לא עונה. הריצו `print(i2c.scan())`. אם הרשימה ריקה, ייתכן ש-SDA ו-SCL הוחלפו זה בזה או שאין לרכיב הזנה. אם מופיע מספר שונה מ-`' + addr + '`, שנו את `ADDR`.',
      'An `OSError`: the part does not answer. Run `print(i2c.scan())`. If the list is empty, SDA and SCL are swapped or there is no power. If a number other than `' + addr + '` appears, change `ADDR`.');
  };

  P.components.push(
    /* ============================================================ MOSFET */
    {
      id: 'mosfet', name: B('מודול MOSFET (מתג אלקטרוני)', 'MOSFET module (electronic switch)'), iface: ['pwm', 'gpio'], cat: 'output', volt: '5V–12V',
      summary: B('מתג שקט ומהיר לעומסים גדולים, שיכול גם לעמעם אותם.', 'A silent, fast switch for big loads, which can also dim.'),
      what: [
        B('[[mosfet|MOSFET]] הוא מתג אלקטרוני ללא חלקים נעים. בדומה ל[[relay|ממסר]], הוא מאפשר לפין של ה-Pico להפעיל רכיב שצורך זרם רב: פס לדים של 12V, מאוורר או משאבה קטנה.',
          'A [[mosfet|MOSFET]] is an electronic switch with no moving parts. Like a [[relay|relay]], it lets a Pico pin operate something that draws a lot of current: a 12 V LED strip, a fan, a small pump.'),
        B('ההבדל בינו לבין ממסר הוא שהוא יכול להידלק ולהיכבות אלפי פעמים בשנייה. לכן אפשר להפעיל אותו באמצעות [[pwm|PWM]] ולשלוט בעוצמה, ולא רק לבחור בין דולק לכבוי. הוא מתאים רק לזרם ישר במתח נמוך, ולעולם לא לחשמל מהשקע שבקיר.',
          'The difference from a relay: it can switch on and off thousands of times a second. So it can be driven with [[pwm|PWM]] to control strength, not just on or off. It suits only low-voltage direct current, never mains electricity.')
      ],
      looks: B('לוח קטן שעליו רכיב שחור ושטוח עם גב מתכתי. בצד אחד יש שלושה פינים (SIG, VCC, GND), ובצד השני מהדקי בורג: זוג אחד לספק הכוח וזוג אחד לעומס.',
        'A small board carrying a flat black part with a metal back, three pins on one side (SIG, VCC, GND) and screw terminals on the other: one pair for the power supply and one pair for the load.'),
      pins: [
        { n: 'SIG', d: B('האות שמגיע מה-Pico. 1 סוגר את המתג, ו-0 פותח אותו.', 'The signal from the Pico. 1 closes the switch, 0 opens it.') },
        { n: 'VCC', d: B('ברוב המודולים אין צורך לחבר אותו.', 'On most modules this does not need connecting.') },
        GND(),
        { n: 'VIN, GND', d: B('מהדקי הבורג של ספק הכוח שמזין את העומס, למשל 12V.', 'The screw terminals for the load\'s power supply, for example 12 V.') },
        { n: 'V+, V−', d: B('מהדקי הבורג של העומס עצמו.', 'The screw terminals for the load itself.') }
      ],
      how: [
        B('ל-MOSFET יש שלוש רגליים. מתח קטן על אחת מהן, שנקראת השער, פותח מעבר לזרם גדול בין שתי האחרות. כמעט שום זרם לא נכנס לשער עצמו, ולכן הפין של ה-Pico לא מתאמץ.',
          'A MOSFET has three legs. A small voltage on one leg, the gate, opens a path for a large current between the other two. Almost no current flows into the gate itself, so the Pico pin is not strained.'),
        B('המודול מנתק ומחבר את הצד השלילי של העומס. האדמה של ספק הכוח והאדמה של ה-Pico חייבות להיות מחוברות זו לזו. זוהי [[commonground|אדמה משותפת]], ובלעדיה האות חסר משמעות.',
          'The module switches the negative side of the load. The power supply\'s ground and the Pico\'s ground must be joined. This is a [[commonground|common ground]], and without it the signal means nothing.'),
        B('לא כל מודול נפתח עד הסוף באות של 3.3V. המודול הנפוץ IRF520 צריך 5V על השער, ולכן עם ה-Pico הוא מתחמם ומעביר רק חלק מהזרם. חפשו מודול שמסומן כמתאים ל-3.3V, למשל מודול עם הרכיב AOD4184.',
          'Not every module opens fully with a 3.3 V signal. The common IRF520 module needs 5 V on its gate, and with the Pico it runs hot and passes only part of the current. Look for a module marked as 3.3 V compatible, for example one with the AOD4184 part.')
      ],
      needs: [B('מודול MOSFET שמתאים לאות של 3.3V', 'A MOSFET module that accepts a 3.3 V signal'), B('עומס של זרם ישר, למשל פס לדים של 12V', 'A direct-current load, for example a 12 V LED strip'), B('ספק כוח שמתאים לעומס', 'A power supply that suits the load'), B('שני חוטי גישור', 'Two jumper wires')],
      wiring: [W('SIG', 'GP21', 27), W('GND', 'GND', 28, B('גם האדמה של ספק הכוח מגיעה לכאן, דרך המודול', 'the power supply\'s ground reaches here too, through the module'))],
      steps: [UNPLUG, loose(2), lead('SIG', 'GP21', 27), lead('GND', 'GND', 28),
        B('כאשר ספק הכוח מנותק מהחשמל, הבריגו את החוט החיובי שלו למהדק `VIN` ואת החוט השלילי למהדק `GND`.', 'With the power supply unplugged: screw its positive wire into the `VIN` terminal and its negative wire into the `GND` terminal.'),
        B('הבריגו את החוט החיובי של העומס למהדק `V+` ואת החוט השלילי שלו למהדק `V−`.', 'Screw the load\'s positive wire into the `V+` terminal and its negative wire into `V−`.'),
        CHECK,
        B('חברו את ספק הכוח לחשמל רק אחרי שה-Pico כבר מחובר והתוכנית כבר רצה.', 'Plug the power supply in only after the Pico is connected and the program is running.')],
      code: ['from machine import Pin, PWM', 'from time import sleep', '', 'load = PWM(Pin(21))', 'load.freq(1000)', '', 'while True:', '    for level in range(0, 65536, 4096):', '        load.duty_u16(level)', '        sleep(0.1)', '    load.duty_u16(0)', '    sleep(1)'],
      explain: [
        E([4, 5], 'השורות האלה יוצרות פין PWM בתדר של 1000 הרץ, מהיר מספיק כדי שהעין לא תראה הבהוב.', 'A PWM pin at 1000 Hz: fast enough that no flicker is seen.'),
        E([8], 'כאן מתחילה לולאה שעולה מ-0 בקפיצות של 4096, ב-16 צעדים.', 'A loop rising from 0 in jumps of 4096, 16 steps.'),
        E([9, 10], 'השורות האלה קובעות את העוצמה וממתינות עשירית שנייה.', 'Sets the strength and waits a tenth of a second.'),
        E([11, 12], 'כאן העומס נכבה לשנייה, והכול מתחיל מחדש.', 'Switches off for a second, and starts over.')
      ],
      expect: B('העומס מתחזק בהדרגה במשך שנייה וחצי, נכבה לשנייה, וחוזר חלילה.', 'The load grows stronger over a second and a half, goes off for a second, and repeats.'),
      mistakes: [
        B('העומס חלש או שהמודול מתחמם: המודול לא נפתח עד הסוף ב-3.3V. החליפו אותו במודול שמתאים ל-3.3V.', 'The load is weak, or the module runs hot: the module does not open fully at 3.3 V. Change to a 3.3 V compatible module.'),
        B('שום דבר לא קורה: האדמה של ספק הכוח לא מחוברת לאדמה של ה-Pico.', 'Nothing happens: the power supply\'s ground is not joined to the Pico\'s ground.'),
        B('מנוע או משאבה משמיעים צפצוף צורם: העלו את התדר ל-20000.', 'A motor or pump whines: raise the frequency to 20000.'),
        B('העומס דולק כל הזמן: החוטים שלו מחוברים למהדקי הספק במקום למהדקי העומס.', 'The load is always on: its wires are in the supply terminals instead of the load terminals.')
      ],
      ideas: [B('תאורת לדים שמתעמעמת לאט בשעות הערב.', 'LED lighting that dims slowly in the evening.'), B('מאוורר שמהירותו עולה ככל שהטמפרטורה עולה.', 'A fan whose speed rises with temperature.'), B('משאבת השקיה עם ספיקה שאפשר לכוונן.', 'A watering pump with adjustable flow.')]
    },

    /* ============================================================ PCF8574 */
    {
      id: 'pcf8574', name: B('מרחיב פינים PCF8574', 'PCF8574 pin expander'), iface: ['i2c'], cat: 'output', volt: '3.3V', addr: '0x20',
      summary: B('שמונה פינים נוספים, בשני חוטים בלבד.', 'Eight more pins, over just two wires.'),
      what: [B('כשנגמרים הפינים של ה-Pico, המודול הזה מוסיף עוד שמונה. כל אחד מהם יכול להדליק לד או לקרוא כפתור. המודול מתחבר ב-[[i2c|I2C]], ואפשר לחבר עד שמונה מודולים כאלה לאותם שני חוטים.',
        'When the Pico runs out of pins, this module adds eight. Each can light an LED or read a button. It connects over [[i2c|I2C]], and up to eight such modules can share the same two wires.')],
      looks: B('לוח כחול וצר. בקצה אחד יש ארבעה פינים (VCC, GND, SDA, SCL), לאורך הצד יש שמונה פינים שמסומנים P0 עד P7, ויש גם שלושה מגשרים צהובים קטנים שקובעים את הכתובת.',
        'A narrow blue board. At one end are four pins (VCC, GND, SDA, SCL), along the side eight pins marked P0 to P7, and three small yellow jumpers that set the address.'),
      pins: [V33(), GND(), SDA, SCL, { n: 'P0–P7', d: B('שמונת הפינים הנוספים.', 'The eight extra pins.') }, { n: 'A0, A1, A2', d: B('מגשרים שקובעים את ה[[address|כתובת]], מ-`0x20` ועד `0x27`.', 'Jumpers that set the [[address|address]], from `0x20` to `0x27`.') }],
      how: [
        B('כל התקשורת עם המודול היא [[byte|בית]] אחד. כל [[bit|ביט]] בבית מייצג פין אחד: ביט 0 הוא P0, וביט 7 הוא P7. כותבים בית כדי לקבוע את מצב הפינים, וקוראים בית כדי לדעת מה מצבם.',
          'All communication is a single [[byte|byte]]. Each [[bit|bit]] in it is one pin: bit 0 is P0, and bit 7 is P7. You write a byte to set the pins, and read a byte to learn their state.'),
        B('הפינים האלה חלשים כשהם ב-1 וחזקים כשהם ב-0. לכן מחברים את הלד הפוך מהרגיל: מ-3.3V, דרך נגד, אל הפין. הלד נדלק כשכותבים 0. כדי לקרוא כפתור, כותבים 1 לפין, והכפתור מוריד אותו ל-0.',
          'These pins are weak at 1 and strong at 0. So an LED is connected the opposite way from usual: from 3.3 V, through a resistor, to the pin. The LED lights when you write 0. To read a button you write 1 to the pin, and the button pulls it to 0.')
      ],
      needs: [B('מודול PCF8574', 'A PCF8574 module'), B('לד ונגד 330Ω', 'An LED and a 330 Ω resistor'), B('כפתור', 'A push button'), B('שישה חוטי גישור', 'Six jumper wires')],
      wiring: [W('VCC', '3V3', 36), W('GND', 'GND', 8), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, seat(4), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7),
        B('לד: הרגל הארוכה מתחברת ל-3.3V, הרגל הקצרה לנגד 330Ω, והקצה השני של הנגד לפין `P0` של המודול.', 'LED: long leg to 3.3 V, short leg to a 330 Ω resistor, and the resistor\'s other end to the module\'s `P0` pin.'),
        B('כפתור: רגל אחת מתחברת לפין `P7` של המודול, והרגל שמולה מתחברת לאדמה.', 'Button: one leg to the module\'s `P7` pin, and the opposite leg to ground.'),
        CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep', '', I2C_LINE, 'ADDR = 0x20', '', 'def write(value):', '    i2c.writeto(ADDR, bytes([value]))', '', 'def read():', '    return i2c.readfrom(ADDR, 1)[0]', '', 'state = 0xFF                      # all eight pins at 1', 'while True:', '    state = state ^ 0x01          # flip bit 0, which is P0', '    write(state | 0x80)           # keep P7 at 1 so the button can pull it down', '    pressed = (read() & 0x80) == 0', '    print("button on P7:", pressed)', '    sleep(0.5)'],
      explain: [
        E([4, 5], 'השורות האלה מגדירות את ה[[bus|אפיק]] ואת הכתובת של המודול.', 'Sets up the [[bus|bus]] and the module\'s address.'),
        E([7, 8], 'פונקציית הכתיבה שולחת בית אחד. `bytes([value])` הופך מספר לבית.', 'Writing: sends one byte. `bytes([value])` turns a number into a byte.'),
        E([10, 11], 'פונקציית הקריאה מבקשת בית אחד ומחזירה את המספר שבו.', 'Reading: asks for one byte, and takes the number in it.'),
        E([13], '`0xFF` הוא שמונה ביטים דולקים, בכתיב [[hex|הקסדצימלי]]. כל הלדים כבויים, וכל הפינים מוכנים לקריאה.', '`0xFF` is eight bits set, in [[hex|hexadecimal]]. All LEDs are off, and all pins are ready to be read.'),
        E([15], '`^` הופך ביט: אם ביט 0 היה 1 הוא הופך ל-0, ולהפך. כך הלד מהבהב.', '`^` flips a bit: if bit 0 was 1 it becomes 0, and the other way round. This makes the LED blink.'),
        E([16], '`|` מדליק ביט: השורה מוודאת שביט 7 יישאר 1, כי אחרת אי אפשר לקרוא את הכפתור.', '`|` sets a bit: makes sure bit 7 stays 1, otherwise the button cannot be read.'),
        E([17], '`&` בודק ביט אחד. אם ביט 7 הוא 0, הכפתור לחוץ.', '`&` tests a single bit. If bit 7 is 0, the button is pressed.')
      ],
      expect: B('הלד שמחובר ל-P0 מהבהב פעם בשנייה. בכל חצי שנייה מודפס אם הכפתור שמחובר ל-P7 לחוץ.', 'The LED on P0 blinks once a second. Every half second it prints whether the button on P7 is pressed.'),
      mistakes: [
        NO_ANSWER('0x20'),
        B('הלד לא נדלק: הוא מחובר בין הפין לאדמה. במודול הזה צריך לחבר אותו בין 3.3V לבין הפין.', 'The LED does not light: it is connected between the pin and ground. Here it goes between 3.3 V and the pin.'),
        B('הכפתור תמיד מופיע כ"לחוץ": כתבתם 0 לביט 7. פין שרוצים לקרוא חייב להיות ב-1.', 'The button always reads "pressed": you wrote 0 to bit 7. A pin you want to read must be at 1.'),
        B('יש גרסה בשם PCF8574A, שהכתובות שלה מתחילות ב-`0x38`.', 'There is a version named PCF8574A, with addresses starting at `0x38`.')
      ],
      ideas: [B('שורה של שמונה לדים שאור רץ בה הלוך ושוב.', 'A row of eight LEDs that runs back and forth.'), B('לוח מקשים 4×4, בלי לתפוס שמונה פינים של ה-Pico.', 'A 4×4 keypad without taking eight Pico pins.'), B('לוח בקרה עם הרבה כפתורים.', 'A control panel with many buttons.')]
    },

    /* ============================================================ ADS1115 */
    {
      id: 'ads1115', name: B('ממיר אנלוגי מדויק ADS1115', 'ADS1115 precise analog converter'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x48',
      summary: B('ארבע כניסות אנלוגיות נוספות, מדויקות בהרבה מהכניסות של ה-Pico עצמו.', 'Four more analog inputs, far more precise than the Pico\'s own.'),
      what: [B('ל-Pico יש שלוש כניסות [[analog|אנלוגיות]], והן רועשות למדי. המודול הזה מוסיף ארבע כניסות שקטות ומדויקות. משתמשים בו כשצריך למדוד מתח קטן או שינוי עדין, למשל של סוללה, חיישן לחץ או חיישן זרם.',
        'The Pico has three [[analog|analog]] inputs, and they are fairly noisy. This module adds four quiet, precise ones. It is used when a small voltage or a fine change must be measured: a battery, a pressure sensor, a current sensor.')],
      looks: B('לוח כחול קטן עם שבב זעיר ועשרה פינים בשורה: VDD, GND, SCL, SDA, ADDR, ALRT, A0, A1, A2, A3.', 'A small blue board with a tiny chip, and ten pins in a row: VDD, GND, SCL, SDA, ADDR, ALRT, A0, A1, A2, A3.'),
      pins: [V33('VDD'), GND(), SCL, SDA, { n: 'A0–A3', d: B('ארבע הכניסות. אסור שהמתח עליהן יעלה על המתח של VDD.', 'The four inputs. The voltage on them must not exceed the VDD voltage.') }, { n: 'ADDR, ALRT', d: B('לא מחברים אותם. כש-ADDR נשאר פנוי, הכתובת היא `0x48`.', 'Not connected. With ADDR left free the address is `0x48`.') }],
      how: [
        B('ה-[[adc|ADC]] של ה-Pico מחלק את הטווח ל-4096 מדרגות. ה-ADS1115 מחלק אותו ל-32768 מדרגות, ולכן הוא מבחין בשינויים קטנים פי שמונה.',
          'The Pico\'s [[adc|ADC]] divides the range into 4096 steps. The ADS1115 divides it into 32768, so it can tell apart changes eight times smaller.'),
        B('העבודה איתו נעשית בשני שלבים. קודם כותבים ל[[register|רגיסטר]] ההגדרות (רגיסטר מספר 1) איזו כניסה למדוד ובאיזה טווח. אחר כך ממתינים רגע וקוראים את התוצאה מרגיסטר 0. בדוגמה הטווח הוא עד 4.096V, כך שכל מדרגה היא שמינית של אלפית וולט.',
          'Working with it takes two stages. You write to the settings [[register|register]] (number 1) which input to measure and over what range. You wait a moment, then read the result from register 0. In the example the range is up to 4.096 V, so each step is an eighth of a thousandth of a volt.')
      ],
      needs: [B('מודול ADS1115', 'An ADS1115 module'), B('פוטנציומטר, כדי שיהיה משהו למדוד', 'A potentiometer, to have something to measure'), B('שבעה חוטי גישור', 'Seven jumper wires')],
      wiring: [W('VDD', '3V3', 36), W('GND', 'GND', 8), W('SCL', 'GP5', 7), W('SDA', 'GP4', 6)],
      steps: [UNPLUG, seat(10), wire('VDD', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SCL', 'GP5', 7), wire('SDA', 'GP4', 6),
        B('פוטנציומטר: חברו רגל קיצונית אחת ל-3.3V, את הרגל הקיצונית השנייה לאדמה, ואת הרגל האמצעית לטור של `A0`.', 'Potentiometer: one outer leg to 3.3 V, the other to ground, and the middle leg to the column of `A0`.'),
        CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep, sleep_ms', '', I2C_LINE, 'ADDR = 0x48', '', 'def read_volts(channel):', '    config = 0xC383 | (channel << 12)', '    i2c.writeto_mem(ADDR, 1, bytes([config >> 8, config & 0xFF]))', '    sleep_ms(10)', '    data = i2c.readfrom_mem(ADDR, 0, 2)', '    raw = (data[0] << 8) | data[1]', '    if raw > 32767:', '        raw = raw - 65536', '    return raw * 4.096 / 32768', '', 'while True:', '    print("A0: %.4f V" % read_volts(0))', '    sleep(0.5)'],
      explain: [
        E([7], 'זו פונקציה שמקבלת מספר כניסה, מ-0 עד 3, ומחזירה את המתח בוולטים.', 'A function that takes an input number, 0 to 3, and returns volts.'),
        E([8], '`0xC383` פירושו: התחל מדידה אחת של הכניסה A0, בטווח של 4.096V. `channel << 12` מזיז את מספר הכניסה למקום שלו בתוך המספר.', '`0xC383` means: start one measurement, of input A0, over the 4.096 V range. `channel << 12` shifts the input number into its place within the number.'),
        E([9], 'השורה כותבת את ההגדרה לרגיסטר 1 כשני בתים: קודם החצי הגבוה ואחריו החצי הנמוך.', 'Writes the setting to register 1, as two bytes: the high half then the low half.'),
        E([10], 'מדידה אחת נמשכת כ-8 אלפיות שנייה, ולכן ממתינים 10.', 'One measurement takes about 8 milliseconds. We wait 10.'),
        E([11, 12], 'השורות קוראות שני בתים מרגיסטר 0 ומחברות אותם למספר אחד.', 'Reads two bytes from register 0 and joins them into one number.'),
        E([13, 14], 'מספר שגדול מ-32767 הוא בעצם מספר שלילי, והשורות האלה מתקנות אותו.', 'A number above 32767 is really a negative number. This corrects it.'),
        E([15], 'השורה ממירה מדרגות לוולטים.', 'Turns steps into volts.'),
        E([18], '`%.4f` מדפיס ארבע ספרות אחרי הנקודה העשרונית.', '`%.4f` prints four digits after the point.')
      ],
      expect: B('פעמיים בשנייה מודפס המתח שעל A0. כשמסובבים את הפוטנציומטר, המספר נע בין 0 לבין 3.3 בערך, עם ארבע ספרות יציבות אחרי הנקודה.', 'Twice a second the voltage on A0 is printed. Turn the potentiometer and the number moves between 0 and about 3.3, with four steady digits after the point.'),
      mistakes: [
        NO_ANSWER('0x48'),
        B('המספר קופץ בלי קשר לפוטנציומטר: הכניסה לא מחוברת לשום דבר, וכניסה פנויה קולטת רעש.', 'The number jumps regardless of the potentiometer: the input is not connected to anything. A free input picks up noise.'),
        B('אל תחברו לכניסה מתח גבוה מ-3.3V כשהמודול מוזן מ-3.3V.', 'Do not connect more than 3.3 V to an input while the module is powered from 3.3 V.')
      ],
      ideas: [B('מד מתח לסוללה, דרך [[divider|מחלק מתח]].', 'A battery voltmeter, through a [[divider|voltage divider]].'), B('ארבעה פוטנציומטרים שקובעים ארבעה ערכים.', 'Four potentiometers setting four values.'), B('קריאה מדויקת של חיישן לחות אדמה.', 'An accurate reading of a soil moisture sensor.')]
    },

    /* ============================================================ INA219 */
    {
      id: 'ina219', name: B('מד זרם ומתח INA219', 'INA219 current and voltage meter'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x40',
      summary: B('מודד כמה מתח וכמה זרם הפרויקט צורך.', 'Measures how much voltage and current a project draws.'),
      what: [B('מודול שמודד את ה[[voltage|מתח]] ואת ה[[current|זרם]] של מעגל אחר. כך אפשר לדעת כמה זרם צורך מנוע, כמה זמן תחזיק סוללה, או אם משהו נתקע וצורך יותר מדי.',
        'A module that measures the [[voltage|voltage]] and [[current|current]] of another circuit. This tells you how much a motor draws, how long a battery will last, or whether something is stuck and drawing too much.')],
      looks: B('לוח קטן, כחול או סגול, ועליו נגד שחור גדול שכתוב עליו R100, מהדק בורג כפול (Vin+, Vin−) וארבעה פינים עיקריים: VCC, GND, SCL, SDA.',
        'A small board, blue or purple, with a large black resistor marked R100, a two-way screw terminal (Vin+, Vin−), and four main pins: VCC, GND, SCL, SDA.'),
      pins: [V33(), GND(), SCL, SDA, { n: 'Vin+', d: B('לכאן מגיע הצד החיובי של ספק הכוח.', 'The positive side of the power supply comes in here.') }, { n: 'Vin−', d: B('מכאן הזרם ממשיך אל העומס.', 'From here it continues to the load.') }],
      how: [
        B('הזרם של העומס עובר דרך הנגד הגדול שעל הלוח, [[shunt|נגד מדידה]] של עשירית אוהם. על הנגד נופל מתח זעיר שגדל ככל שהזרם גדל. השבב מודד את המתח הזעיר הזה, ומתוכו מחשבים את הזרם.',
          'The load\'s current passes through the large resistor on the board, a [[shunt|shunt resistor]] of a tenth of an ohm. A tiny voltage drops across it, growing with the current. The chip measures this tiny voltage, and the current is worked out from it.'),
        B('המודול מתחבר בטור: החוט החיובי מהספק נכנס ב-Vin+ ויוצא מ-Vin− אל העומס. האדמה של הספק חייבת להיות מחוברת לאדמה של ה-Pico. המודול מודד עד 26V ועד 3.2A.',
          'The module connects in series: the positive wire from the supply enters at Vin+ and leaves from Vin− to the load. The supply\'s ground must be joined to the Pico\'s ground. The module measures up to 26 V and up to 3.2 A.')
      ],
      needs: [B('מודול INA219', 'An INA219 module'), B('מעגל שאותו מודדים, למשל מנוע קטן עם סוללות', 'A circuit to measure, for example a small motor with batteries'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('VCC', '3V3', 36), W('GND', 'GND', 8, B('וגם האדמה של המעגל הנמדד', 'and also the ground of the measured circuit')), W('SCL', 'GP5', 7), W('SDA', 'GP4', 6)],
      steps: [UNPLUG, loose(4), lead('VCC', '3V3(OUT)', 36), lead('GND', 'GND', 8), lead('SCL', 'GP5', 7), lead('SDA', 'GP4', 6),
        B('נתקו את החוט החיובי שבין הספק לעומס. הבריגו את הקצה שמגיע מהספק ל-`Vin+`, ואת הקצה שהולך לעומס ל-`Vin−`.', 'Break the positive wire between the supply and the load. Screw the end coming from the supply into `Vin+`, and the end going to the load into `Vin−`.'),
        B('חברו חוט מהמינוס של הספק לפין אדמה של ה-Pico, למשל לפין 13.', 'Connect a wire from the supply\'s minus to a ground pin of the Pico, for example pin 13.'),
        CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep', '', I2C_LINE, 'ADDR = 0x40', '', 'def read16(reg):', '    data = i2c.readfrom_mem(ADDR, reg, 2)', '    return (data[0] << 8) | data[1]', '', 'while True:', '    volts = (read16(2) >> 3) * 0.004', '    shunt = read16(1)', '    if shunt > 32767:', '        shunt = shunt - 65536', '    milliamps = shunt * 0.1', '    print("%.2f V   %.1f mA   %.2f W" % (volts, milliamps, volts * milliamps / 1000))', '    sleep(1)'],
      explain: [
        E([7, 9], 'זו פונקציה שקוראת רגיסטר של שני בתים ומחברת אותם למספר אחד.', 'A function that reads a two-byte register and joins it into one number.'),
        E([12], 'רגיסטר 2 מכיל את המתח. שלושת הביטים הנמוכים אינם חלק מהמספר, ולכן `>> 3` משמיט אותם. כל מדרגה היא 4 אלפיות וולט.', 'Register 2 is the voltage. The three low bits are not part of the number, so `>> 3` drops them. Each step is 4 thousandths of a volt.'),
        E([13, 15], 'רגיסטר 1 מכיל את המתח על נגד המדידה. הוא יכול להיות שלילי כשהזרם זורם בכיוון ההפוך.', 'Register 1 is the voltage across the shunt. It can be negative, when current flows the other way.'),
        E([16], 'כל מדרגה היא 10 מיליוניות וולט. על נגד של עשירית אוהם זה יוצא עשירית [[ma|mA]].', 'Each step is 10 millionths of a volt. Across a tenth of an ohm that comes to a tenth of a [[ma|mA]].'),
        E([17], 'השורה מדפיסה מתח, זרם והספק. ההספק הוא המתח כפול הזרם.', 'Prints voltage, current and power. Power is voltage times current.')
      ],
      expect: B('פעם בשנייה מודפסים המתח, הזרם וההספק. כשמעמיסים על המנוע באצבע, הזרם עולה.', 'Once a second the voltage, current and power are printed. Load the motor with a finger and the current rises.'),
      mistakes: [
        NO_ANSWER('0x40'),
        B('הזרם תמיד 0: המודול לא מחובר בטור. הזרם חייב לעבור דרכו, מ-Vin+ אל Vin−.', 'The current is always 0: the module is not in series. The current must pass through it, from Vin+ to Vin−.'),
        B('הזרם שלילי: Vin+ ו-Vin− הוחלפו זה בזה.', 'The current is negative: Vin+ and Vin− are swapped.'),
        B('המתח קופץ: האדמה של הספק לא מחוברת לאדמה של ה-Pico.', 'The voltage jumps: the supply\'s ground is not joined to the Pico\'s ground.'),
        B('הכתובת `0x40` זהה לכתובת של בקר הסרוואים PCA9685. כדי לחבר את שניהם לאותו אפיק, צריך לשנות בהלחמה את הכתובת של אחד מהם.', 'The address `0x40` is the same as the PCA9685 servo controller\'s. To put both on one bus, one of them must have its address changed, by soldering.')
      ],
      ideas: [B('מד סוללה שמראה כמה נשאר בה.', 'A battery gauge showing how much is left.'), B('הגנה: עצירת מנוע שצורך יותר מדי.', 'Protection: stop a motor that draws too much.'), B('בדיקה של כמה צורך כל חלק בפרויקט.', 'Checking how much each part of a project draws.')]
    },

    /* ============================================================ AHT20 */
    {
      id: 'aht20', name: B('חיישן טמפרטורה ולחות AHT20', 'AHT20 temperature and humidity sensor'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x38',
      summary: B('טמפרטורה ולחות, במדידה מדויקת ובלי ספרייה.', 'Temperature and humidity, accurate, with no library.'),
      what: [B('חיישן קטן שמודד את הטמפרטורה והלחות של האוויר. הוא מדויק ויציב יותר מה-DHT22, מתחבר ב-[[i2c|I2C]], ואפשר לקרוא אותו בכמה שורות קוד בלי להתקין שום דבר.',
        'A small sensor that measures air temperature and humidity. It is more accurate and steady than the DHT22, connects over [[i2c|I2C]], and can be read in a few lines of code with nothing to install.')],
      looks: B('לוח קטן ועליו קופסה זעירה, שחורה או לבנה, עם חריץ, וארבעה פינים: VIN, GND, SCL, SDA.', 'A small board with a tiny black or white box that has a slot in it, and four pins: VIN, GND, SCL, SDA.'),
      pins: [V33('VIN'), GND(), SCL, SDA],
      how: [
        B('העבודה איתו דומה לשיחה. שולחים פקודה של שלושה [[byte|בתים]] שאומרת "מדוד". ממתינים 80 אלפיות שנייה. קוראים שישה בתים של תשובה.',
          'You work with it as in a conversation. You send a three-[[byte|byte]] command that says "measure". You wait 80 milliseconds. You read six bytes of answer.'),
        B('בתשובה, הלחות והטמפרטורה ארוזות כל אחת ב-20 [[bit|ביטים]], צמודות זו לזו. הבית הרביעי מתחלק ביניהן: חציו שייך ללחות וחציו לטמפרטורה. לכן יש בקוד הזזות של ביטים.',
          'In the answer, humidity and temperature are each packed into 20 [[bit|bits]], back to back. The fourth byte is shared between them: half belongs to humidity and half to temperature. That is why the code shifts bits about.')
      ],
      needs: [B('מודול AHT20', 'An AHT20 module'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('VIN', '3V3', 36), W('GND', 'GND', 8), W('SCL', 'GP5', 7), W('SDA', 'GP4', 6)],
      steps: [UNPLUG, seat(4), wire('VIN', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SCL', 'GP5', 7), wire('SDA', 'GP4', 6), CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep, sleep_ms', '', I2C_LINE, 'ADDR = 0x38', '', 'sleep_ms(40)', 'i2c.writeto(ADDR, b"\\xBE\\x08\\x00")      # switch on calibration', 'sleep_ms(10)', '', 'def measure():', '    i2c.writeto(ADDR, b"\\xAC\\x33\\x00")  # "measure now"', '    sleep_ms(80)', '    d = i2c.readfrom(ADDR, 6)', '    raw_h = (d[1] << 12) | (d[2] << 4) | (d[3] >> 4)', '    raw_t = ((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]', '    return raw_t * 200 / 1048576 - 50, raw_h * 100 / 1048576', '', 'while True:', '    temp, hum = measure()', '    print("%.1f C   %.1f %%" % (temp, hum))', '    sleep(2)'],
      explain: [
        E([7, 9], 'השורות נותנות לחיישן זמן להתעורר, ושולחות פקודה חד-פעמית שמפעילה את הכיול שלו.', 'Lets the sensor wake up, and sends a one-off command that switches on its calibration.'),
        E([12, 13], 'השורות מבקשות מדידה וממתינות עד שהיא מסתיימת.', 'Asks for a measurement and waits for it to finish.'),
        E([14], 'השורה קוראת שישה בתים. הראשון הוא בית מצב, ולא משתמשים בו כאן.', 'Reads six bytes. The first is a status byte, not used here.'),
        E([15], 'הלחות מורכבת מבית 1, מבית 2 ומהחצי הגבוה של בית 3.', 'Humidity: byte 1, byte 2 and the high half of byte 3.'),
        E([16], 'הטמפרטורה מורכבת מהחצי הנמוך של בית 3, מבית 4 ומבית 5. `& 0x0F` משאיר רק את החצי הנמוך.', 'Temperature: the low half of byte 3, byte 4 and byte 5. `& 0x0F` keeps only the low half.'),
        E([17], 'אלה הנוסחאות מדף הנתונים של החיישן. 1048576 הוא 2 בחזקת 20. הפונקציה מחזירה שני ערכים יחד.', 'The formulas from the sensor\'s data sheet. 1048576 is 2 to the power of 20. The function returns two values together.'),
        E([20], 'השורה מקבלת את שני הערכים לתוך שני משתנים.', 'Receives the two values into two variables.'),
        E([21], '`%%` מדפיס סימן אחוז אחד.', '`%%` prints a single percent sign.')
      ],
      expect: B('כל שתי שניות מודפסות הטמפרטורה והלחות. כשנושפים על החיישן, הלחות קופצת למעלה.', 'Every two seconds the temperature and humidity are printed. Breathe on the sensor and the humidity jumps up.'),
      mistakes: [
        NO_ANSWER('0x38'),
        B('הטמפרטורה גבוהה במעלה או שתיים: החיישן קרוב מדי ל-Pico, שמתחמם מעט. הרחיקו אותו בעזרת חוטים.', 'The temperature reads a degree or two high: the sensor is too close to the Pico, which warms slightly. Move it away on wires.'),
        B('הערכים לא משתנים: מדדתם מהר מדי. המתינו לפחות שתי שניות בין מדידה למדידה.', 'The values do not change: you measured too fast. Wait at least two seconds between measurements.')
      ],
      ideas: [B('תחנת מזג אוויר עם מסך.', 'A weather station with a display.'), B('רישום הטמפרטורה לקובץ לאורך יום שלם.', 'Logging temperature to a file over a whole day.'), B('מאוורר שנדלק כשהלחות גבוהה.', 'A fan that comes on when humidity is high.')]
    },

    /* ============================================================ HX711 */
    {
      id: 'hx711', name: B('משקל: תא עומס עם HX711', 'Scale: load cell with an HX711'), iface: ['gpio'], cat: 'sensor', volt: '3.3V',
      summary: B('מודד משקל, כמו משקל מטבח.', 'Measures weight, like a kitchen scale.'),
      what: [B('תא עומס הוא מוט מתכת שמתכופף מעט מאוד כשמניחים עליו משקל. המודול HX711 מודד את הכיפוף הזעיר הזה, ויחד הם יוצרים משקל דיגיטלי.',
        'A load cell is a metal bar that bends very slightly when weight is put on it. The HX711 module measures that tiny bend. Together they make a digital scale.')],
      looks: B('מוט אלומיניום עם ארבעה חוטים דקים (אדום, שחור, לבן וירוק), ולוח ירוק קטן עם ארבעה פינים בצד אחד: GND, DT, SCK, VCC.', 'An aluminium bar with four thin wires (red, black, white, green), and a small green board with four pins on one side: GND, DT, SCK, VCC.'),
      pins: [GND(), { n: 'DT', d: B('קו הנתונים. הוא יורד ל-0 כשיש מדידה מוכנה.', 'The data line. It drops to 0 when a measurement is ready.') }, { n: 'SCK', d: B('[[clock|קו השעון]]. ה-Pico הוא שמפעיל אותו.', 'The [[clock|clock line]]. The Pico drives it.') }, V33(), { n: 'E+, E−, A−, A+', d: B('לכאן מולחמים ארבעת החוטים של תא העומס: אדום, שחור, לבן וירוק.', 'The four wires of the load cell are soldered here: red, black, white, green.') }],
      how: [
        B('על המוט מודבקים נגדים דקים, וה[[resistance|התנגדות]] שלהם משתנה כשהמוט מתכופף. השינוי זעיר, ולכן ה-HX711 מגביר אותו ומודד אותו ב-24 [[bit|ביטים]], כלומר ביותר מ-16 מיליון מדרגות.',
          'Thin resistors are glued to the bar, and their [[resistance|resistance]] changes as the bar bends. The change is tiny, so the HX711 amplifies it and measures it with 24 [[bit|bits]], more than 16 million steps.'),
        B('ה-Pico קורא את המספר ביט אחרי ביט: הוא שולח [[pulse|פולס]] על SCK וקורא ביט אחד מ-DT, וחוזר על כך 24 פעמים. המספר שמתקבל אינו בגרמים, ולכן צריך לכייל: למדוד בלי משקל, למדוד עם משקל ידוע ולחשב את היחס.',
          'The Pico reads the number bit by bit: it gives a [[pulse|pulse]] on SCK, and reads one bit from DT. So 24 times over. The number you get is not grams. You must calibrate: measure with no weight, measure with a known weight, and work out the ratio.')
      ],
      needs: [B('תא עומס של 1 או 5 ק"ג עם מודול HX711', 'A 1 or 5 kg load cell with an HX711 module'), B('משקל ידוע לכיול, למשל חבילת סוכר', 'A known weight for calibration, for example a bag of sugar'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('GND', 'GND', 28), W('DT', 'GP20', 26), W('SCK', 'GP21', 27), W('VCC', '3V3', 36)],
      steps: [UNPLUG, loose(4), lead('GND', 'GND', 28), lead('DT', 'GP20', 26), lead('SCK', 'GP21', 27), lead('VCC', '3V3(OUT)', 36),
        B('ודאו שארבעת החוטים של תא העומס מחוברים למודול: האדום ל-`E+`, השחור ל-`E−`, הלבן ל-`A−` והירוק ל-`A+`.', 'Make sure the load cell\'s four wires are joined to the module: red to `E+`, black to `E−`, white to `A−` and green to `A+`.'),
        B('הבריגו קצה אחד של המוט לבסיס יציב, כך שהקצה השני יישאר תלוי באוויר. את המשקל מניחים על הקצה החופשי. החץ שעל המוט צריך להצביע למטה.', 'Bolt one end of the bar to a steady base, so the other end hangs in the air. The weight goes on the free end. The arrow on the bar points down.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'dt = Pin(20, Pin.IN)', 'sck = Pin(21, Pin.OUT, value=0)', '', 'def read():', '    while dt.value() == 1:', '        pass', '    value = 0', '    for i in range(24):', '        sck.on()', '        sck.off()', '        value = (value << 1) | dt.value()', '    sck.on()', '    sck.off()', '    if value & 0x800000:', '        value = value - 0x1000000', '    return value', '', 'SCALE = 400                # raw steps per gram: set this by calibrating', 'zero = read()', '', 'while True:', '    grams = (read() - zero) / SCALE', '    print("%.0f g" % grams)', '    sleep(0.5)'],
      explain: [
        E([4, 5], 'DT מוגדר ככניסה. SCK מוגדר כיציאה שמתחילה ב-0.', 'DT is an input. SCK is an output that starts at 0.'),
        E([8, 9], 'הלולאה ממתינה עד ש-DT יורד ל-0, וזה הסימן שיש מדידה מוכנה. `pass` פירושו "אל תעשה כלום".', 'Waits until DT drops to 0. That is the sign a measurement is ready. `pass` means "do nothing".'),
        E([11, 14], 'הלולאה חוזרת 24 פעמים: היא שולחת פולס על השעון, מזיזה את המספר מקום אחד שמאלה ומוסיפה את הביט החדש בסופו.', '24 times: a pulse on the clock, then the number is shifted one place left and the new bit added at its end.'),
        E([15, 16], 'פולס נוסף, ה-25, אומר לשבב איך למדוד בפעם הבאה.', 'One more pulse, the 25th. It tells the chip how to measure next time.'),
        E([17, 18], 'אם הביט העליון דולק, המספר שלילי, והשורות האלה מתקנות אותו.', 'If the top bit is set, the number is negative. This corrects it.'),
        E([21], 'כמה מדרגות יש בגרם אחד. המספר הזה שונה בכל תא עומס.', 'How many steps there are in one gram. This number differs for every load cell.'),
        E([22], 'מדידה אחת בלי משקל, שמשמשת כנקודת האפס.', 'One measurement with no weight. This is the zero point.'),
        E([25], 'השורה מחסירה את האפס ומחלקת ביחס, וכך מתקבלים גרמים.', 'Subtracts the zero and divides by the ratio. The result is grams.')
      ],
      expect: B('בלי משקל מודפס מספר קרוב ל-0. כשמניחים חפץ, המספר עולה. הוא יהיה נכון בגרמים רק אחרי שתכיילו את `SCALE`.', 'With no weight a number near 0 is printed. Put an object on and the number rises. It will be right in grams only after `SCALE` is calibrated.'),
      mistakes: [
        B('המשקל שגוי: צריך לכייל. הניחו משקל ידוע, למשל 1000 גרם, וחלקו ב-1000 את המספר שמודפס. הכפילו את התוצאה ב-`SCALE` הנוכחי, וכתבו את המספר שיצא במקומו.', 'The weight is wrong: calibration is needed. Put on a known weight, say 1000 grams, and divide the printed number by 1000. Multiply the result by the current `SCALE` and write it in its place.'),
        B('המספר יורד כשמוסיפים משקל: החוטים הלבן והירוק הוחלפו, או שהמוט הפוך.', 'The number falls as weight is added: the white and green wires are swapped, or the bar is upside down.'),
        B('התוכנית נתקעת: DT אף פעם לא יורד. בדקו את ההזנה ואת החוטים של תא העומס.', 'The program hangs: DT never drops. Check the power and the load cell\'s wires.'),
        B('המספר זוחל לאט: זה טבעי, ונובע משינויי טמפרטורה. אפסו מחדש לפני כל שקילה.', 'The number creeps slowly: this is natural, because of temperature changes. Re-zero before each weighing.')
      ],
      ideas: [B('משקל מטבח עם מסך.', 'A kitchen scale with a display.'), B('התרעה כשקערת האוכל של החתול ריקה.', 'A warning when the cat\'s food bowl is empty.'), B('ספירה של חלקים זהים לפי המשקל שלהם.', 'Counting identical parts by weight.')]
    },

    /* ============================================================ PCA9685 */
    {
      id: 'pca9685', name: B('בקר סרוואים PCA9685', 'PCA9685 servo controller'), iface: ['i2c'], cat: 'output', volt: '3.3V', addr: '0x40',
      summary: B('שולט ב-16 מנועי סרבו באמצעות שני חוטים.', 'Controls 16 servos over two wires.'),
      what: [B('זרוע רובוטית או רובוט הולך צריכים הרבה מנועי סרבו. הלוח הזה יוצר בעצמו 16 אותות [[pwm|PWM]], וה-Pico רק אומר לו ב-[[i2c|I2C]] מה הרוחב של כל אחד מהם. הוא גם מספק לסרוואים הזנה נפרדת.',
        'A robot arm or a walking robot needs many servos. This board produces 16 [[pwm|PWM]] signals by itself, and the Pico just tells it over [[i2c|I2C]] how wide each one is. It also hands the servos a separate power feed.')],
      looks: B('לוח כחול מוארך עם 16 שלשות של פינים (צהוב, אדום, שחור) לסרוואים, מהדק בורג כחול להזנה, ושישה פינים בקצה: GND, OE, SCL, SDA, VCC, V+.',
        'A long blue board with 16 sets of three pins (yellow, red, black) for servos, a blue screw terminal for power, and six pins at the end: GND, OE, SCL, SDA, VCC, V+.'),
      pins: [GND(), { n: 'OE', d: B('לא מחברים אותו.', 'Not connected.') }, SCL, SDA, { n: 'VCC', d: B('הזנה לשבב, 3.3V.', 'Power for the chip, 3.3 V.') }, { n: 'V+', d: B('הזנה לסרוואים, 5V. לסרבו אחד או שניים קטנים מספיק `VBUS`. ליותר מזה צריך ספק נפרד, שמתחבר דרך מהדק הבורג.', 'Power for the servos, 5 V. For one or two small servos `VBUS` is enough. For more, a separate supply is needed, through the screw terminal.') }],
      how: [
        B('השבב מחלק כל מחזור של PWM ל-4096 חלקים. לכל אחת מ-16 היציאות אומרים באיזה חלק האות עולה ובאיזה חלק הוא יורד. סרבו צריך 50 מחזורים בשנייה, ו[[pulse|פולס]] שאורכו בין חצי אלפית שנייה ל-2.5 אלפיות שנייה.',
          'The chip divides each PWM cycle into 4096 parts. For each of the 16 outputs you say at which part the signal rises and at which it falls. A servo needs 50 cycles a second, and a [[pulse|pulse]] between half a millisecond and 2.5 milliseconds.'),
        B('לשבב יש שתי הזנות נפרדות: VCC למוח שלו ו-V+ למנועים. כך הרעש החשמלי של המנועים לא מגיע ל-Pico. האדמה משותפת לכולם.',
          'The chip has two separate feeds: VCC for its brain and V+ for the motors. This keeps the motors\' electrical noise away from the Pico. Ground is shared by all.')
      ],
      needs: [B('לוח PCA9685', 'A PCA9685 board'), B('מנוע סרבו אחד או יותר', 'One or more servos'), B('שישה חוטי גישור עם קצה נקבה', 'Six jumper wires with a female end')],
      wiring: [W('GND', 'GND', 8), W('SCL', 'GP5', 7), W('SDA', 'GP4', 6), W('VCC', '3V3', 36), W('V+', 'VBUS', 40, B('5V לסרוואים', '5 V for the servos'))],
      steps: [UNPLUG, loose(5), lead('GND', 'GND', 8), lead('SCL', 'GP5', 7), lead('SDA', 'GP4', 6), lead('VCC', '3V3(OUT)', 36), lead('V+', 'VBUS', 40),
        B('הלבישו את התקע של הסרבו על השלשה שמסומנת 0, כך שהחוט החום או השחור יהיה בצד של `GND`.', 'Push the servo\'s plug onto the set of three marked 0, with the brown or black wire on the `GND` side.'),
        CHECK],
      code: ['from machine import Pin, I2C', 'from time import sleep, sleep_ms', '', I2C_LINE, 'ADDR = 0x40', '', 'def write(reg, value):', '    i2c.writeto_mem(ADDR, reg, bytes([value]))', '', 'write(0x00, 0x10)          # sleep, so the speed can be changed', 'write(0xFE, 121)           # 50 cycles a second', 'write(0x00, 0x20)          # wake up', 'sleep_ms(5)', '', 'def angle(channel, deg):', '    us = 500 + deg * 2000 // 180', '    ticks = us * 4096 // 20000', '    i2c.writeto_mem(ADDR, 0x06 + 4 * channel, bytes([0, 0, ticks & 0xFF, ticks >> 8]))', '', 'while True:', '    for deg in (0, 90, 180, 90):', '        angle(0, deg)', '        sleep(1)'],
      explain: [
        E([7, 8], 'זו פונקציה שכותבת בית אחד ל[[register|רגיסטר]].', 'A function that writes one byte to a [[register|register]].'),
        E([10, 13], 'שלוש פקודות הכנה. את קצב המחזורים אפשר לשנות רק כשהשבב במצב שינה. 121 הוא המספר שנותן 50 מחזורים בשנייה.', 'Three set-up commands. The cycle rate can only be changed while the chip sleeps. 121 is the number that gives 50 cycles a second.'),
        E([15, 16], 'השורות ממירות זווית לרוחב פולס במיליוניות שנייה: 0 מעלות הן 500, ו-180 מעלות הן 2500.', 'Turns an angle into a pulse width in millionths of a second: 0 degrees is 500, and 180 degrees is 2500.'),
        E([17], 'מחזור שלם נמשך 20000 מיליוניות שנייה ומחולק ל-4096 חלקים. כך מחשבים במשך כמה חלקים האות דולק.', 'A whole cycle is 20000 millionths of a second, divided into 4096 parts. This works out for how many parts the signal is on.'),
        E([18], 'לכל יציאה יש ארבעה רגיסטרים, החל מ-`0x06`. שני הראשונים קובעים שהאות עולה בחלק 0, ושני האחרונים קובעים מתי הוא יורד.', 'Each output has four registers, starting at `0x06`. The first two: the signal rises at part 0. The last two: when it falls.'),
        E([21, 23], 'השורות מזיזות את סרבו 0 בין ארבע זוויות, שנייה בכל אחת.', 'Moves servo 0 between four angles, a second at each.')
      ],
      expect: B('הסרבו שמחובר ליציאה 0 זז: 0 מעלות, 90, 180, 90, וחוזר חלילה.', 'The servo on output 0 moves: 0 degrees, 90, 180, 90, and repeats.'),
      mistakes: [
        NO_ANSWER('0x40'),
        B('הסרבו לא זז, אבל אין שגיאה: אין הזנה ב-V+. השבב עובד, אבל למנועים אין חשמל.', 'The servo does not move yet there is no error: there is no power on V+. The chip works, but the motors have no electricity.'),
        B('ה-Pico מתנתק כשכמה סרוואים זזים יחד: הם צורכים יותר ממה שה-USB יכול לספק. חברו ספק של 5V למהדק הבורג, ונתקו את החוט מ-`VBUS`.', 'The Pico disconnects when several servos move together: they draw more than USB gives. Connect a 5 V supply to the screw terminal, and remove the wire from `VBUS`.'),
        B('הסרבו נתקע בקצה ומזמזם: הטווח שלו קצר מהרגיל. שנו את 500 ל-600 ואת 2000 ל-1800.', 'The servo jams at the end and buzzes: its range is shorter than usual. Change 500 to 600 and 2000 to 1800.')
      ],
      ideas: [B('זרוע רובוטית עם ארבעה מפרקים.', 'A robot arm with four joints.'), B('רובוט שהולך על שש רגליים.', 'A robot walking on six legs.'), B('16 לדים שמתעמעמים כל אחד בנפרד.', '16 LEDs that dim separately.')]
    },

    /* ============================================================ MAX6675 */
    {
      id: 'max6675', name: B('מד חום גבוה MAX6675', 'MAX6675 high-temperature meter'), iface: ['spi'], cat: 'sensor', volt: '3.3V',
      summary: B('מודד טמפרטורות של מאות מעלות, בעזרת חיישן שנמצא בקצה חוט ארוך.', 'Measures temperatures of hundreds of degrees, with a probe on a long wire.'),
      what: [B('רוב חיישני הטמפרטורה עובדים עד 80 או 125 מעלות. המודול הזה, יחד עם [[thermocouple|צמד תרמי]], מודד עד כ-1000 מעלות: תנור, מלחם, מדפסת תלת-ממד או מנגל.',
        'Most temperature sensors work up to 80 or 125 degrees. This module, with a [[thermocouple|thermocouple]], measures up to about 1000 degrees: an oven, a soldering iron, a 3D printer, a barbecue.')],
      looks: B('לוח כחול קטן עם מהדק בורג כפול לחוט החיישן, וחמישה פינים: GND, VCC, SCK, CS, SO. החיישן עצמו הוא חוט ארוך בתוך שרוול מתכת קלוע, שבקצהו חוד מתכתי.',
        'A small blue board with a two-way screw terminal for the probe wire, and five pins: GND, VCC, SCK, CS, SO. The probe itself is a long wire in a braided metal sleeve, with a metal tip.'),
      pins: [GND(), V33(), { n: 'SCK', d: B('[[clock|קו השעון]] של [[spi|SPI]].', 'The [[spi|SPI]] [[clock|clock line]].') }, { n: 'CS', d: B('קו הבחירה. הוא יורד ל-0 בזמן הקריאה.', 'The select line. It goes to 0 during a read.') }, { n: 'SO', d: B('הנתונים מהמודול אל ה-Pico (MISO).', 'The data from the module to the Pico (MISO).') }],
      how: [
        B('צמד תרמי הוא שני חוטים ממתכות שונות שמחוברים זה לזה בקצה. כשהקצה מתחמם, נוצר ביניהם מתח זעיר, של כמה מיליוניות וולט לכל מעלה. השבב MAX6675 מגביר את המתח הזה והופך אותו למספר.',
          'A thermocouple is two wires of different metals joined at the tip. When the tip is hot a tiny voltage appears between them, a few millionths of a volt per degree. The MAX6675 chip amplifies this voltage and turns it into a number.'),
        B('המודול הוא רכיב [[spi|SPI]] פשוט במיוחד: הוא רק שולח נתונים ולא מקבל פקודות. מורידים את CS, קוראים שני [[byte|בתים]] ומעלים את CS. מתוך 16 ה[[bit|ביטים]] האלה, 12 מייצגים את הטמפרטורה ברבעי מעלה, וביט אחד מציין אם החיישן מנותק.',
          'The module is an especially simple [[spi|SPI]] part: it only sends, and takes no commands. You lower CS, read two [[byte|bytes]], and raise CS. Of those 16 [[bit|bits]], 12 are the temperature in quarter degrees, and one bit says whether the probe is disconnected.')
      ],
      needs: [B('מודול MAX6675 עם צמד תרמי מסוג K', 'A MAX6675 module with a type K thermocouple'), B('חמישה חוטי גישור', 'Five jumper wires')],
      wiring: [W('GND', 'GND', 23), W('VCC', '3V3', 36), W('SCK', 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK')), W('CS', 'GP17', 22), W('SO', 'GP16', 21, B('SPI0 RX', 'SPI0 RX'))],
      steps: [UNPLUG, loose(5), lead('GND', 'GND', 23), lead('VCC', '3V3(OUT)', 36), lead('SCK', 'GP18', 24), lead('CS', 'GP17', 22), lead('SO', 'GP16', 21),
        B('הבריגו את שני החוטים של החיישן למהדק: את האדום לפלוס ואת השני למינוס.', 'Screw the probe\'s two wires into the terminal: the red one to plus and the other to minus.'),
        CHECK],
      code: ['from machine import Pin, SPI', 'from time import sleep', '', 'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))', 'cs = Pin(17, Pin.OUT, value=1)', '', 'def read_temp():', '    cs.low()', '    data = spi.read(2)', '    cs.high()', '    value = (data[0] << 8) | data[1]', '    if value & 0x04:', '        return None            # the probe is not connected', '    return (value >> 3) * 0.25', '', 'while True:', '    t = read_temp()', '    if t is None:', '        print("no probe")', '    else:', '        print("%.2f C" % t)', '    sleep(0.5)'],
      explain: [
        E([4], 'השורה מגדירה SPI. המודול רק שולח, ולכן לא מחברים שום דבר לפין `mosi` (GP19).', 'Sets up SPI. The module only sends, so nothing is connected to the `mosi` pin (GP19).'),
        E([5], 'קו הבחירה מתחיל ב-1, שפירושו "לא מדברים איתך כרגע".', 'The select line, starting at 1: "not talking to you right now".'),
        E([8, 10], 'השורות מורידות את קו הבחירה, קוראות שני בתים ומעלות אותו בחזרה.', 'Lowers the select line, reads two bytes, and raises it.'),
        E([11], 'השורה מחברת את שני הבתים למספר אחד של 16 ביטים.', 'Joins the two bytes into one 16-bit number.'),
        E([12, 13], 'ביט 2 דולק כשהחיישן מנותק. במקרה כזה הפונקציה מחזירה `None`, כלומר "אין מדידה".', 'Bit 2 is set when the probe is disconnected. Returns `None`: "no measurement".'),
        E([14], 'השורה משמיטה את שלושת הביטים הנמוכים, ומה שנשאר הוא הטמפרטורה ברבעי מעלה.', 'Drops the three low bits. What is left is quarter degrees.'),
        E([22], 'השבב מודד רק ארבע פעמים בשנייה, ולכן קריאה מהירה יותר תחזיר את אותו מספר.', 'The chip measures only four times a second. Reading faster returns the same number.')
      ],
      expect: B('פעמיים בשנייה מודפסת הטמפרטורה של קצה החיישן. כשאוחזים אותו בין האצבעות, היא עולה לכיוון 30 מעלות.', 'Twice a second the temperature of the probe tip is printed. Hold it between your fingers and it climbs towards 30 degrees.'),
      mistakes: [
        B('מודפס "no probe": החוטים של החיישן רופפים במהדק.', '"no probe" is printed: the probe\'s wires are loose in the terminal.'),
        B('הטמפרטורה יורדת כשמחממים את החיישן: שני החוטים שלו הוחלפו.', 'The temperature falls as you heat it: the probe\'s two wires are swapped.'),
        B('תמיד מודפס 0.00: SO לא מחובר ל-GP16, או ש-CS לא מחובר.', '0.00 is always printed: SO is not connected to GP16, or CS is not connected.'),
        B('המודול מודד רק מעל 0 מעלות, ובקפיצות של רבע מעלה.', 'The module measures only above 0 degrees, and in quarter-degree jumps.'),
        B('קצה החיישן חם מאוד אחרי מדידה, ולכן אל תיגעו בו.', 'The probe tip is very hot after measuring. Do not touch it.')
      ],
      ideas: [B('מד חום לתנור עם התרעה.', 'An oven thermometer with an alarm.'), B('בקרת טמפרטורה: ממסר שמדליק ומכבה גוף חימום של 12V.', 'Temperature control: a relay switching a 12 V heater on and off.'), B('רישום של עקומת ההתחממות של מלחם.', 'Logging the warm-up curve of a soldering iron.')]
    }
  );
})(window.PICO);
