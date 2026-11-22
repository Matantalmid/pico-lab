/* Component catalog, part 2 of 2. Same structure as data-components.js. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, seat = c.seat, wire = c.wire;

  var LIB_STEP = function (name) {
    return B('התקינו את הספרייה: ב-Thonny פתחו את התפריט Tools, בחרו Manage packages, חפשו `' + name + '` ולחצו Install. הלוח צריך להיות מחובר בזמן ההתקנה.',
      'Install the library: in Thonny open the Tools menu, choose Manage packages, search for `' + name + '` and press Install. The board must be connected during the install.');
  };
  var I2C_SHARE = B('אם כבר מחובר רכיב I2C אחר, השתמשו באותם שני טורים של `SDA` ו-`SCL`, כי רכיבי I2C חולקים את אותם חוטים.',
    'If another I2C part is already connected, use the same two columns for `SDA` and `SCL`. I2C parts share the wires.');
  var PIN_VCC33 = { n: 'VCC', d: B('הזנה של 3.3V. מתחבר ל-`3V3(OUT)`.', 'Power, 3.3 V. Connects to `3V3(OUT)`.') };
  var PIN_GND = { n: 'GND', d: B('[[ground|אדמה]].', '[[ground|Ground]].') };
  var PIN_SDA = { n: 'SDA', d: B('קו הנתונים של [[i2c|I2C]].', 'The [[i2c|I2C]] data line.') };
  var PIN_SCL = { n: 'SCL', d: B('[[clock|קו השעון]] של I2C.', 'The I2C [[clock|clock line]].') };

  P.components.push(
    /* ------------------------------------------------------------ DHT22 */
    {
      id: 'dht22', name: B('טמפרטורה ולחות DHT22', 'DHT22 temperature & humidity'), iface: ['gpio'], cat: 'sensor', volt: '3.3V',
      summary: B('מודד את הטמפרטורה ואת לחות האוויר בחדר.', 'Measures the temperature and air humidity in the room.'),
      what: [
        B('DHT22 מודד שני דברים: את הטמפרטורה ואת לחות האוויר. זה ה[[sensor|חיישן]] הנפוץ ביותר בתחנות מזג אוויר ביתיות.',
          'The DHT22 measures two things: the temperature and the air humidity. It is the most common [[sensor|sensor]] for home weather stations.')
      ],
      looks: B('קופסת פלסטיק לבנה עם חריצים, שבדרך כלל מורכבת על לוח קטן עם שלושה פינים המסומנים +, out ו-−. יש לו גם אח קטן וכחול בשם DHT11: הוא זול יותר ופחות מדויק, ומתחבר בדיוק באותה צורה.',
        'A white plastic box with slots, usually on a small board with three pins marked +, out and −. There is also a small blue sibling called the DHT11: cheaper, less accurate, and connected in exactly the same way.'),
      pins: [
        { n: '+', d: B('הזנה של 3.3V.', 'Power, 3.3 V.') },
        { n: 'OUT', d: B('קו הנתונים. דרכו החיישן שולח את המדידה.', 'The data line. The sensor sends its measurement through it.') },
        { n: '−', d: B('[[ground|אדמה]].', '[[ground|Ground]].') }
      ],
      how: [
        B('החיישן מבצע את המדידה בעצמו, ושולח את התוצאה ל-Pico כרצף של [[bit|ביטים]] על חוט אחד, בתזמון מיוחד משלו. אין צורך להבין את התזמון הזה, כי ב-[[micropython|MicroPython]] כבר יש [[library|ספרייה]] בשם `dht` שעושה את העבודה.',
          'The sensor does the measuring itself and sends the result to the Pico as a stream of [[bit|bits]] on one wire, with a special timing of its own. You need not understand that timing: [[micropython|MicroPython]] already includes a [[library|library]] named `dht` that does the work.')
      ],
      needs: [B('מודול DHT22 או DHT11', 'A DHT22 or DHT11 module'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W('+', '3V3', 36),
        W('OUT', 'GP6', 9, B('חיישן בלי לוח צריך גם נגד 10kΩ בין OUT ל-3V3', 'a sensor with no board also needs a 10 kΩ resistor from OUT to 3V3')),
        W('−', 'GND', 8)
      ],
      steps: [UNPLUG, seat(3), wire('+', '3V3(OUT)', 36), wire('OUT', 'GP6', 9), wire('−', 'GND', 8), CHECK],
      code: [
        'import dht',
        'from machine import Pin',
        'from time import sleep',
        '',
        'sensor = dht.DHT22(Pin(6))       # for a DHT11 use dht.DHT11',
        '',
        'while True:',
        '    sensor.measure()',
        '    print(sensor.temperature(), "C", sensor.humidity(), "%")',
        '    sleep(2)                     # the sensor needs 2 s between readings'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את הספרייה `dht`, שיודעת לתקשר עם החיישן.', 'Brings in the `dht` library, which knows how to talk to the sensor.'),
        E([5], 'השורה הזו יוצרת משתנה שמייצג את החיישן, ומגדירה שהוא מחובר ל-GP6. אם יש לכם DHT11, החליפו ל-`dht.DHT11`.', 'Creates a variable that stands for the sensor and tells it that it is on GP6. If you have a DHT11, change it to `dht.DHT11`.'),
        E([8], 'השורה הזו מבקשת מהחיישן לבצע מדידה ולשלוח אותה.', 'Asks the sensor to take a measurement and send it.'),
        E([9], 'השורה הזו מדפיסה את הטמפרטורה במעלות צלזיוס ואת הלחות באחוזים.', 'Prints the temperature in degrees Celsius and the humidity as a percentage.'),
        E([10], 'כאן ממתינים שתי שניות, כי החיישן לא מסוגל למדוד מהר יותר.', 'Waits two seconds. The sensor cannot measure any faster.')
      ],
      expect: B('כל שתי שניות מודפסת שורה כמו `24.3 C 51.2 %`. נשפו על החיישן, ואחרי כמה שניות הלחות תעלה.', 'Every two seconds a line such as `24.3 C 51.2 %` is printed. Breathe on the sensor, and after a few seconds the humidity rises.'),
      mistakes: [
        B('מופיעה שגיאה `OSError`: החיישן לא עונה. בדקו את שלושת החוטים, וודאו שהמספר בקוד תואם לפין.', 'An `OSError` appears: the sensor is not answering. Check the three wires, and that the number in the code matches the pin.'),
        B('הקריאה מהירה מדי. אם מקצרים את ההמתנה לפחות משתי שניות, מתקבלת שגיאה.', 'Reading too fast. Reducing the wait below two seconds gives an error.'),
        B('הערכים לא הגיוניים: בקוד כתוב `DHT22`, אבל החיישן הוא DHT11, או להפך.', 'The values make no sense: the code says `DHT22` but the sensor is a DHT11, or the other way round.')
      ],
      ideas: [
        B('תחנת מזג אוויר שמציגה את הנתונים על מסך.', 'A weather station that shows the readings on a display.'),
        B('התראה: לד אדום שנדלק כשחם מדי בחדר.', 'An alert: a red LED that comes on when the room is too hot.'),
        B('בקר לחממה קטנה שמפעיל מאוורר.', 'A controller for a small greenhouse that switches on a fan.')
      ]
    },

    /* ------------------------------------------------------------ DS18B20 */
    {
      id: 'ds18b20', name: B('מד טמפרטורה DS18B20', 'DS18B20 thermometer'), iface: ['gpio', 'onewire'], cat: 'sensor', volt: '3.3V',
      summary: B('מד טמפרטורה מדויק, שקיים גם בגרסה אטומה למים.', 'An accurate thermometer that also comes in a waterproof version.'),
      what: [
        B('DS18B20 הוא מד טמפרטורה מדויק. היתרון הגדול שלו הוא שהוא קיים גם בגרסה אטומה למים, בקצה של כבל ארוך. כך אפשר למדוד את הטמפרטורה של המים באקווריום, של האדמה בעציץ או של האוויר בחוץ.',
          'The DS18B20 is an accurate thermometer. Its big advantage is that it also comes in a waterproof version at the end of a long cable. That lets you measure the temperature of water in a fish tank, soil in a plant pot or the air outside.')
      ],
      looks: B('יש לו שתי צורות. האחת: רכיב שחור קטן בצורת חצי גליל עם שלוש רגליים. השנייה: מוט מתכת קטן בקצה של כבל, עם שלושה חוטים בצבעים אדום, צהוב ושחור. ברכיב השחור, כשהצד השטוח פונה אליכם והרגליים למטה, הסדר משמאל לימין הוא GND, DQ, VDD.',
        'Two forms. One: a small black part shaped like half a cylinder with three legs. The other: a small metal rod at the end of a cable, with three wires coloured red, yellow and black. On the black part, with the flat side facing you and the legs down, the order from left to right is GND, DQ, VDD.'),
      pins: [
        { n: B('GND (שחור)', 'GND (black)'), d: B('[[ground|אדמה]].', '[[ground|Ground]].') },
        { n: B('DQ (צהוב)', 'DQ (yellow)'), d: B('קו הנתונים.', 'The data line.') },
        { n: B('VDD (אדום)', 'VDD (red)'), d: B('הזנה של 3.3V.', 'Power, 3.3 V.') }
      ],
      how: [
        B('החיישן מתקשר ב[[protocol|פרוטוקול]] שנקרא 1-Wire, "חוט אחד": כל המידע עובר בקו נתונים אחד. לכל חיישן יש מספר זיהוי ייחודי שנצרב בו במפעל. לכן אפשר לחבר כמה חיישנים לאותו פין, וה-Pico פונה לכל אחד מהם לפי המספר שלו.',
          'The sensor speaks a [[protocol|protocol]] called 1-Wire: all the information travels on a single data line. Every sensor has a unique ID number burned in at the factory. So several sensors can be connected to the same pin, and the Pico addresses each by its number.'),
        B('קו הנתונים צריך [[pullup|נגד משיכה]] של 4.7kΩ שמחבר אותו ל-3.3V. בלי הנגד הזה, ה-Pico לא מזהה את החיישן.', 'The data line needs a 4.7 kΩ [[pullup|pull-up resistor]] connecting it to 3.3 V. Without that resistor the sensor is not detected.')
      ],
      needs: [B('DS18B20', 'A DS18B20'), B('נגד 4.7kΩ (צהוב, סגול, אדום)', 'A 4.7 kΩ resistor (yellow, violet, red)'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W(B('VDD (אדום)', 'VDD (red)'), '3V3', 36),
        W(B('DQ (צהוב)', 'DQ (yellow)'), 'GP7', 10, B('ועוד נגד 4.7kΩ בין DQ ל-VDD', 'plus a 4.7 kΩ resistor from DQ to VDD')),
        W(B('GND (שחור)', 'GND (black)'), 'GND', 8)
      ],
      steps: [
        UNPLUG,
        B('הכניסו את החיישן כך שכל אחת משלוש הרגליים, או משלושת החוטים, נמצאת בטור נפרד.', 'Push in the sensor so each of the three legs, or three wires, is in its own column.'),
        wire('VDD', '3V3(OUT)', 36),
        wire('GND', 'GND', 8),
        wire('DQ', 'GP7', 10),
        B('הכניסו את הנגד 4.7kΩ כך שרגל אחת שלו נמצאת בטור של `DQ`, והרגל השנייה בטור של `VDD`.', 'Push in the 4.7 kΩ resistor with one leg in the `DQ` column and the other in the `VDD` column.'),
        CHECK
      ],
      code: [
        'import onewire, ds18x20',
        'from machine import Pin',
        'from time import sleep_ms',
        '',
        'ds = ds18x20.DS18X20(onewire.OneWire(Pin(7)))',
        'roms = ds.scan()             # every sensor on the wire has a unique ID',
        'print("found", len(roms), "sensor(s)")',
        '',
        'while True:',
        '    ds.convert_temp()',
        '    sleep_ms(750)            # conversion time',
        '    for rom in roms:',
        '        print(ds.read_temp(rom), "C")'
      ],
      explain: [
        E([1], 'השורה הזו טוענת שתי ספריות מובנות: אחת לפרוטוקול 1-Wire, ואחת לחיישן עצמו.', 'Brings in two built-in libraries: one for the 1-Wire protocol and one for the sensor itself.'),
        E([5], 'השורה הזו מגדירה קו 1-Wire על GP7, ועליו חיישני טמפרטורה.', 'Sets up a 1-Wire line on GP7, with temperature sensors on it.'),
        E([6, 7], 'השורות האלה מחפשות אילו חיישנים מחוברים לקו, ומדפיסות כמה מהם נמצאו. `roms` היא רשימה של מספרי הזיהוי שלהם.', 'Searches for the sensors connected to the line and prints how many were found. `roms` is a list of their ID numbers.'),
        E([10], 'השורה הזו מבקשת מכל החיישנים להתחיל מדידה.', 'Asks all the sensors to start a measurement.'),
        E([11], 'כאן ממתינים 750 אלפיות שנייה, שהם הזמן שלוקח לחיישן למדוד.', 'Waits 750 milliseconds. That is how long the sensor takes to measure.'),
        E([12, 13], 'השורות האלה עוברות על כל חיישן שנמצא, וקוראות ממנו את הטמפרטורה.', 'Goes through each sensor found and reads its temperature.')
      ],
      expect: B('קודם מודפס `found 1 sensor(s)`, ואחר כך הטמפרטורה, בערך פעם בשנייה. החזיקו את החיישן בין האצבעות, והמספר יעלה.', 'First `found 1 sensor(s)` is printed, then the temperature about once a second. Hold the sensor between your fingers and the number rises.'),
      mistakes: [
        B('מודפס `found 0 sensor(s)`: חסר הנגד 4.7kΩ, או שהוא לא מחבר בין DQ ל-VDD.', '`found 0 sensor(s)` is printed: the 4.7 kΩ resistor is missing, or it does not join DQ to VDD.'),
        B('החיישן מתחמם מאוד: הוא מחובר הפוך, ו-VDD ו-GND התחלפו. נתקו את ה-USB מיד.', 'The sensor gets very hot: it is connected backwards, with VDD and GND swapped. Unplug the USB at once.'),
        B('מודפס 85: זה הערך שהחיישן מחזיר לפני המדידה הראשונה. אם הוא ממשיך להופיע, ההזנה לא יציבה.', '85 is printed: this is the value the sensor returns before its first measurement. If it keeps coming back, the power is unstable.')
      ],
      ideas: [
        B('מד טמפרטורה לאקווריום, עם התראה.', 'A fish-tank thermometer with an alert.'),
        B('בדיקה שהמקרר נשאר קר.', 'A check that the fridge is staying cold.'),
        B('שני חיישנים על אותו פין: אחד בפנים ואחד בחוץ.', 'Two sensors on the same pin: one indoors and one outdoors.')
      ]
    },

    /* ------------------------------------------------------------ OLED */
    {
      id: 'oled', name: B('מסך OLED SSD1306', 'SSD1306 OLED display'), iface: ['i2c'], cat: 'display', volt: '3.3V', addr: '0x3C',
      summary: B('מסך קטן שמציג טקסט ומספרים, בלי צורך במחשב.', 'A small screen that shows text and numbers, with no computer needed.'),
      what: [
        B('מסך קטן, בערך בגודל של בול דואר, שמציג טקסט, מספרים וציורים פשוטים. בזכותו הפרויקט יכול להציג מידע גם כשהוא לא מחובר למחשב.',
          'A small screen, about the size of a postage stamp, that shows text, numbers and simple drawings. Thanks to it a project can show information even when it is not connected to a computer.'),
        B('יש בו 128 נקודות לרוחב ו-64 נקודות לגובה. כל נקודה כזו נקראת פיקסל, והיא יכולה להיות דולקת או כבויה.', 'It has 128 dots across and 64 down. Each dot is called a pixel, and is either on or off.')
      ],
      looks: B('לוח קטן עם מסך זכוכית שחור וארבעה פינים: GND, VCC, SCL ו-SDA. הסדר שלהם משתנה מיצרן ליצרן, ולכן קראו תמיד את הכיתוב שמודפס ליד הפינים של המסך שבידכם.',
        'A small board with a black glass screen and four pins: GND, VCC, SCL, SDA. Their order varies between makers. Always read the printing beside the pins of the display in your hand.'),
      pins: [PIN_VCC33, PIN_GND, PIN_SDA, PIN_SCL],
      how: [
        B('המסך מתקשר עם ה-Pico ב-[[i2c|I2C]], שמשתמש בשני חוטים בלבד: [[sdascl|SDA ו-SCL]]. ה[[address|כתובת]] שלו על ה[[bus|אפיק]] היא `0x3C`.',
          'The display talks to the Pico over [[i2c|I2C]]: only two wires, [[sdascl|SDA and SCL]]. Its [[address|address]] on the [[bus|bus]] is `0x3C`.'),
        B('ה[[library|ספרייה]] שומרת "דף טיוטה" בזיכרון של ה-Pico. פקודות כמו `text` ו-`fill` מציירות על הדף הזה, אבל עדיין לא רואים כלום. רק הפקודה `show` שולחת את כל הדף למסך.',
          'The [[library|library]] keeps a "draft page" in the Pico\'s memory. Commands such as `text` and `fill` draw on that page, and nothing is visible yet. Only the `show` command sends the whole page to the screen.')
      ],
      needs: [B('מסך OLED בגודל 0.96 אינץ\' עם חיבור I2C (ארבעה פינים)', 'A 0.96" OLED display with an I2C connection (four pins)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      lib: { name: 'ssd1306', how: B('ב-Thonny: פתחו את Tools ואחר כך את Manage packages, חפשו ssd1306 והתקינו.', 'In Thonny: Tools, then Manage packages. Search for ssd1306 and install.') },
      wiring: [
        W('VCC', '3V3', 36),
        W('GND', 'GND', 8),
        W('SDA', 'GP4', 6, B('I2C0 SDA', 'I2C0 SDA')),
        W('SCL', 'GP5', 7, B('I2C0 SCL', 'I2C0 SCL'))
      ],
      steps: [UNPLUG, seat(4), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7), CHECK, LIB_STEP('ssd1306')],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)',
        'print([hex(a) for a in i2c.scan()])   # expect 0x3c',
        '',
        'oled = SSD1306_I2C(128, 64, i2c)',
        'oled.fill(0)',
        'oled.text("Hello Pico 2", 0, 0)',
        'oled.text("I2C works!", 0, 16)',
        'oled.show()'
      ],
      explain: [
        E([2], 'השורה הזו טוענת את הספרייה של המסך. אם מופיעה שגיאה בשורה הזו, הספרייה לא הותקנה.', 'Brings in the display\'s library. If an error appears on this line, the library was not installed.'),
        E([4], 'השורה הזו מגדירה את אפיק I2C מספר 0, עם SDA על GP4 ו-SCL על GP5.', 'Sets up I2C bus number 0, with SDA on GP4 and SCL on GP5.'),
        E([5], 'זו בדיקת חיווט: השורה שואלת "מי מחובר?" ומדפיסה את הכתובות שענו. אמור להופיע `0x3c`.', 'A wiring check: asks "who is connected?" and prints the addresses that answered. `0x3c` should appear.'),
        E([7], 'השורה הזו יוצרת את המסך: 128 פיקסלים לרוחב ו-64 לגובה, על האפיק שהגדרנו.', 'Creates the display: 128 pixels wide, 64 high, on the bus we set up.'),
        E([8], 'השורה הזו מנקה את דף הטיוטה. 0 פירושו שחור.', 'Clears the draft page. 0 is black.'),
        E([9, 10], 'השורות האלה כותבות טקסט. שני המספרים הם המיקום: כמה פיקסלים מהקצה השמאלי, וכמה מלמעלה. כל שורת טקסט גבוהה 8 פיקסלים.', 'Writes text. The two numbers are the position: how many pixels from the left edge, and how many from the top. Each line of text is 8 pixels high.'),
        E([11], 'השורה הזו שולחת את הדף למסך. רק עכשיו רואים משהו.', 'Sends the page to the screen. Only now is anything visible.')
      ],
      expect: B('במסוף מודפס `[\'0x3c\']`, ועל המסך מופיעות שתי שורות טקסט. התוכנית מסתיימת, והטקסט נשאר על המסך.', '`[\'0x3c\']` is printed in the console, and two lines of text appear on the screen. The program ends and the text stays on the screen.'),
      mistakes: [
        B('במסוף מודפס `[]`, כלומר רשימה ריקה: המסך לא עונה. כמעט תמיד הסיבה היא ש-SDA ו-SCL התחלפו, או שחוט הזנה רופף.', '`[]`, an empty list, is printed: the display is not answering. Almost always SDA and SCL are swapped, or a power wire is loose.'),
        B('מופיעה שגיאה `ImportError`: הספרייה ssd1306 לא הותקנה על הלוח.', 'An `ImportError`: the ssd1306 library was not installed on the board.'),
        B('המסך נשאר שחור ואין שגיאה: שכחתם את `oled.show()`.', 'The screen stays black with no error: `oled.show()` was forgotten.'),
        B('מודפסת כתובת אחרת, כמו `0x3d`: יש מסכים עם כתובת שונה. זה תקין, והספרייה מסתדרת עם זה.', 'A different address such as `0x3d` is printed: some displays have a different address. That is fine, and the library copes with it.')
      ],
      ideas: [
        B('הצגת טמפרטורה ולחות מחיישן.', 'Showing temperature and humidity from a sensor.'),
        B('מונה לחיצות או שעון עצר.', 'A press counter or a stopwatch.'),
        B('תפריט שמנווטים בו בעזרת שני כפתורים.', 'A menu you navigate with two buttons.')
      ]
    },

    /* ------------------------------------------------------------ BH1750 */
    {
      id: 'bh1750', name: B('מד אור BH1750', 'BH1750 light meter'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x23',
      summary: B('מודד את עוצמת האור ונותן מספר מדויק ביחידות לוקס.', 'Measures light level and gives an exact number in lux.'),
      what: [
        B('BH1750 מודד כמה אור יש, ומחזיר מספר ביחידה שנקראת לוקס (lux). בניגוד ל-LDR, שנותן רק "יותר" או "פחות", כאן מקבלים ערך אמיתי שאפשר להשוות: בחדר מואר יש בערך 300 לוקס, ובאור שמש ישיר יש עשרות אלפים.',
          'The BH1750 measures how much light there is and returns a number in a unit called lux. Unlike an LDR, which only gives "more" or "less", here you get a real value you can compare: a lit room is about 300 lux, and direct sunlight is tens of thousands.')
      ],
      looks: B('לוח כחול קטן, שבדרך כלל מסומן GY-302, עם רכיב זעיר במרכז וחמישה פינים: VCC, GND, SCL, SDA ו-ADDR.',
        'A small blue board, usually marked GY-302, with a tiny part in the centre and five pins: VCC, GND, SCL, SDA, ADDR.'),
      pins: [PIN_VCC33, PIN_GND, PIN_SCL, PIN_SDA,
        { n: 'ADDR', d: B('בוחר בין שתי [[address|כתובות]] אפשריות. אם משאירים אותו לא מחובר, הכתובת היא `0x23`.', 'Selects between two possible [[address|addresses]]. Leave it unconnected, and the address is `0x23`.') }],
      how: [
        B('החיישן מתקשר ב-[[i2c|I2C]]. השיחה איתו פשוטה כל כך שאפשר לנהל אותה בלי [[library|ספרייה]], וזו דרך טובה לראות איך I2C עובד באמת.',
          'The sensor speaks [[i2c|I2C]]. The conversation with it is so simple that you can hold it without a [[library|library]], which is a good way to see how I2C really works.'),
        B('ה-Pico שולח לחיישן [[byte|בית]] אחד, שהוא הפקודה "מדוד". אחר כך ממתינים עד שהמדידה מסתיימת. לבסוף ה-Pico מבקש בחזרה שני בתים, ומצרף אותם למספר אחד.',
          'The Pico sends the sensor one [[byte|byte]], which is the command "measure". You wait for the measurement to finish. Then the Pico asks for two bytes back, and joins them into one number.')
      ],
      needs: [B('מודול BH1750 (GY-302)', 'A BH1750 module (GY-302)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [
        W('VCC', '3V3', 36),
        W('GND', 'GND', 8),
        W('SDA', 'GP4', 6, B('אותו אפיק כמו של ה-OLED', 'the same bus as the OLED')),
        W('SCL', 'GP5', 7)
      ],
      steps: [UNPLUG, seat(5), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7),
        B('השאירו את הפין `ADDR` בלי חוט.', 'Leave the `ADDR` pin with no wire.'), I2C_SHARE, CHECK],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep_ms',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x23',
        '',
        'while True:',
        '    i2c.writeto(ADDR, b"\\x20")        # command: one high-resolution measurement',
        '    sleep_ms(180)                     # wait for it to finish',
        '    data = i2c.readfrom(ADDR, 2)      # result arrives as 2 bytes',
        '    lux = (data[0] << 8 | data[1]) / 1.2',
        '    print(round(lux), "lux")',
        '    sleep_ms(500)'
      ],
      explain: [
        E([4], 'השורה הזו מגדירה את אפיק ה-I2C על GP4 ו-GP5.', 'Sets up the I2C bus on GP4 and GP5.'),
        E([5], 'השורה הזו שומרת את הכתובת של החיישן במשתנה, כדי שלא נצטרך לכתוב אותה שוב ושוב.', 'Stores the sensor\'s address in a variable, so it need not be written again and again.'),
        E([8], 'השורה הזו שולחת לכתובת הזו בית אחד שערכו `0x20`, שהוא הפקודה "בצע מדידה מדויקת אחת". הכתיב `b"\\x20"` פירושו "בית אחד שערכו 0x20".', 'Sends that address one byte with the value `0x20`. This is the command "take one accurate measurement". The notation `b"\\x20"` means "one byte whose value is 0x20".'),
        E([9], 'כאן ממתינים 180 אלפיות שנייה, עד שהמדידה מוכנה.', 'Waits 180 milliseconds for the measurement to be ready.'),
        E([10], 'השורה הזו מבקשת מהחיישן שני בתים. `data[0]` הוא הבית הראשון, ו-`data[1]` הוא השני.', 'Asks the sensor for two bytes. `data[0]` is the first and `data[1]` the second.'),
        E([11], 'השורה הזו מצרפת את שני הבתים למספר אחד: הראשון הוא החלק הגבוה (`<< 8` מכפיל אותו ב-256), והשני הוא החלק הנמוך. החלוקה ב-1.2 הופכת את התוצאה ללוקס, לפי הוראות היצרן.', 'Joins the two bytes into one number: the first is the high part (`<< 8` multiplies it by 256), and the second the low part. Dividing by 1.2 turns the result into lux, per the maker\'s instructions.'),
        E([12], 'השורה הזו מדפיסה את התוצאה, מעוגלת.', 'Prints the result, rounded.')
      ],
      expect: B('פעמיים בשנייה מודפס מספר בלוקס. בחדר רגיל הוא בין 100 ל-500. כסו את החיישן, והמספר יירד כמעט ל-0. קרבו אותו לחלון, והוא יקפוץ לאלפים.', 'Twice a second a number in lux is printed. In an ordinary room it is between 100 and 500. Cover the sensor and it drops almost to 0. Bring it to a window and it jumps into the thousands.'),
      mistakes: [
        B('מופיעה שגיאה `OSError: [Errno 5] EIO`: החיישן לא עונה. בדקו ש-SDA ו-SCL לא התחלפו.', 'An `OSError: [Errno 5] EIO`: the sensor is not answering. Check that SDA and SCL are not swapped.'),
        B('תמיד מודפס 0: התוצאה נקראת מוקדם מדי. אל תקצרו את ההמתנה של 180 אלפיות השנייה.', '0 is always printed: the result is being read too soon. Do not shorten the 180 millisecond wait.')
      ],
      ideas: [
        B('מד אור לצילום או לצמחים.', 'A light meter for photography or plants.'),
        B('תאורה שמסתגלת לסביבה: פס לדים שמתחזק כשמחשיך.', 'Adaptive lighting: an LED strip that brightens as it gets dark.'),
        B('רישום של שעות האור לאורך יום שלם.', 'A log of the hours of light over a whole day.')
      ]
    },

    /* ------------------------------------------------------------ MPU6050 */
    {
      id: 'mpu6050', name: B('חיישן תנועה והטיה MPU6050', 'MPU6050 motion & tilt sensor'), iface: ['i2c'], cat: 'sensor', volt: '3.3V', addr: '0x68',
      summary: B('מרגיש הטיה, ניעור וסיבוב, כמו החיישן שבטלפון.', 'Senses tilt, shaking and rotation, like the sensor in a phone.'),
      what: [
        B('MPU6050 מרגיש את התנועה של עצמו: לאיזה כיוון מטים אותו, אם מנערים אותו, וכמה מהר הוא מסתובב. חיישן דומה נמצא בכל טלפון, והוא זה שמסובב את המסך כשמטים את המכשיר.',
          'The MPU6050 senses its own motion: which way it is tilted, whether it is shaken, and how fast it is rotating. A similar sensor is in every phone, and it is what turns the screen when you tilt the device.')
      ],
      looks: B('לוח כחול קטן, שבדרך כלל מסומן GY-521, עם שבב שחור מרובע ושמונה פינים בשורה. משתמשים רק בארבעה מהם: VCC, GND, SCL ו-SDA. את ארבעת האחרים משאירים לא מחוברים.',
        'A small blue board, usually marked GY-521, with a square black chip and eight pins in a row. Only four are used: VCC, GND, SCL, SDA. The other four are left unconnected.'),
      pins: [PIN_VCC33, PIN_GND, PIN_SCL, PIN_SDA],
      how: [
        B('בתוך השבב יש משקולות זעירות על קפיצים. כשהשבב מאיץ או מוטה, הן זזות, והשבב מודד בכמה. הוא מודד בשלושה כיוונים, שנקראים צירים: X, Y ו-Z. כוח המשיכה של כדור הארץ מושך תמיד למטה, ולכן גם כשהחיישן מונח בשקט, אחד הצירים מראה בערך 1. כך יודעים לאיזה כיוון הוא מוטה.',
          'Inside the chip are tiny weights on springs. When the chip accelerates or tilts they move, and the chip measures how much. It measures in three directions, called axes: X, Y and Z. Earth\'s gravity always pulls down, so even when the sensor lies still, one of the axes shows about 1. That is how you know which way it is tilted.'),
        B('החיישן מתקשר ב-[[i2c|I2C]]. המידע שלו שמור בתאים ממוספרים שנקראים רגיסטרים. כדי לקבל את התאוצה, קוראים שישה [[byte|בתים]] החל מהתא שמספרו `0x3B`: שני בתים לכל ציר.',
          'The sensor speaks [[i2c|I2C]]. Its information is kept in numbered cells called registers. To get the acceleration you read six [[byte|bytes]] starting from cell number `0x3B`: two bytes per axis.')
      ],
      needs: [B('מודול MPU6050 (GY-521)', 'An MPU6050 module (GY-521)'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [W('VCC', '3V3', 36), W('GND', 'GND', 8), W('SDA', 'GP4', 6), W('SCL', 'GP5', 7)],
      steps: [UNPLUG, seat(8), wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 8), wire('SDA', 'GP4', 6), wire('SCL', 'GP5', 7), I2C_SHARE, CHECK],
      code: [
        'from machine import Pin, I2C',
        'from time import sleep',
        'import struct',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'ADDR = 0x68',
        '',
        'i2c.writeto_mem(ADDR, 0x6B, b"\\x00")          # register 0x6B: wake the sensor up',
        '',
        'while True:',
        '    raw = i2c.readfrom_mem(ADDR, 0x3B, 6)     # 6 bytes: accel X, Y, Z',
        '    ax, ay, az = struct.unpack(">hhh", raw)',
        '    print(ax / 16384, ay / 16384, az / 16384) # in g',
        '    sleep(0.2)'
      ],
      explain: [
        E([3], 'השורה הזו טוענת את `struct`, כלי שהופך רצף של בתים למספרים.', 'Brings in `struct`, a tool that turns a run of bytes into numbers.'),
        E([5, 6], 'השורות האלה מגדירות את האפיק ושומרות את הכתובת של החיישן.', 'Sets up the bus and stores the sensor\'s address.'),
        E([8], 'החיישן נדלק במצב שינה. השורה הזו כותבת 0 לתא `0x6B` כדי להעיר אותו. בלי השורה הזו, כל הקריאות יהיו אפס.', 'The sensor powers up asleep. Writing 0 to cell `0x6B` wakes it. Without this line every reading would be zero.'),
        E([11], 'השורה הזו קוראת שישה בתים, החל מהתא `0x3B`.', 'Reads six bytes, starting from cell `0x3B`.'),
        E([12], 'השורה הזו הופכת את ששת הבתים לשלושה מספרים, אחד לכל ציר. `">hhh"` פירושו "שלושה מספרים, בני שני בתים כל אחד".', 'Turns the six bytes into three numbers, one per axis. `">hhh"` means "three numbers, two bytes each".'),
        E([13], 'כאן מחלקים ב-16384 כדי לקבל את התוצאה ביחידות g. 1g הוא כוח המשיכה של כדור הארץ.', 'Divides by 16384 to get the result in units of g. 1 g is Earth\'s gravity.')
      ],
      expect: B('חמש פעמים בשנייה מודפסים שלושה מספרים. כשהלוח מונח שטוח על השולחן, שני הראשונים קרובים ל-0, והשלישי קרוב ל-1. הטו את הלוח, והמספרים יתחלפו ביניהם.', 'Five times a second three numbers are printed. With the board lying flat on the table, the first two are close to 0 and the third is close to 1. Tilt the board and the numbers trade places.'),
      mistakes: [
        B('כל המספרים הם 0.0: החיישן עדיין ישן. בדקו ששורה 8 נמצאת בקוד.', 'All the numbers are 0.0: the sensor is still asleep. Check that line 8 is there.'),
        B('מופיעה שגיאה `OSError`: החיישן לא עונה. בדקו ש-SDA ו-SCL לא התחלפו.', 'An `OSError`: the sensor is not answering. Check that SDA and SCL are not swapped.'),
        B('המספרים קופצים מעט גם כשהלוח לא זז. זה תקין, כי החיישן רגיש מאוד.', 'The numbers jitter slightly even with the board still. That is normal, the sensor is very sensitive.')
      ],
      ideas: [
        B('פלס דיגיטלי שמראה אם משטח ישר.', 'A digital spirit level that shows whether a surface is flat.'),
        B('אזעקה שמצפצפת כשמזיזים חפץ.', 'An alarm that sounds when an object is moved.'),
        B('שליטה בהטיה: מטים את הלוח, והסרבו זז בהתאם.', 'Tilt control: tilt the board and a servo follows.')
      ]
    },

    /* ------------------------------------------------------------ NeoPixel */
    {
      id: 'neopixel', name: B('פס לדים NeoPixel (WS2812)', 'NeoPixel LED strip (WS2812)'), iface: ['pio'], cat: 'output', volt: '5V',
      summary: B('שורה של לדים צבעוניים, שכל אחד מהם מקבל צבע משלו.', 'A row of colour LEDs, each of which gets its own colour.'),
      what: [
        B('פס של לדים צבעוניים, שבו כל לד יכול לקבל צבע ועוצמה משלו. הפס כולו נשלט דרך חוט נתונים אחד, לא משנה כמה לדים יש בו. הוא מגיע כפס גמיש, כטבעת או כריבוע.',
          'A strip of colour LEDs in which each LED can have its own colour and brightness. The whole strip is controlled through one data wire, however many LEDs it has. It comes as a flexible strip, a ring or a square.')
      ],
      looks: B('פס או טבעת עם ריבועים לבנים קטנים, שהם הלדים, ושלושה מגעים בקצה: 5V, DIN ו-GND. על הפס מודפס חץ שמראה לאיזה כיוון זורמים הנתונים. התחברו לקצה שבו כתוב DIN. בקצה השני כתוב DOUT.',
        'A strip or ring with small white squares, which are the LEDs, and three contacts at the end: 5V, DIN and GND. An arrow printed on the strip shows which way the data flows. Connect to the end marked DIN. The other end is marked DOUT.'),
      pins: [
        { n: '5V', d: B('הזנה של 5V. מתחבר ל-`VBUS`.', 'Power, 5 V. Connects to `VBUS`.') },
        { n: 'DIN', d: B('כניסת הנתונים. מתחבר לפין של ה-Pico.', 'The data input. Connects to a Pico pin.') },
        { n: 'GND', d: B('[[ground|אדמה]].', '[[ground|Ground]].') }
      ],
      how: [
        B('בתוך כל לד יש שבב זעיר. ה-Pico שולח רצף ארוך של צבעים, צבע אחד לכל לד. הלד הראשון לוקח לעצמו את הצבע הראשון ומעביר את כל השאר הלאה. הלד השני לוקח את הצבע הבא, וכך הלאה עד סוף הפס.',
          'Inside each LED is a tiny chip. The Pico sends a long run of colours, one per LED. The first LED keeps the first colour for itself and passes all the rest along. The second takes the next, and so on to the end of the strip.'),
        B('ה[[bit|ביטים]] נשלחים בתזמון מהיר ומדויק מאוד, פחות ממיליונית שנייה לכל ביט. את זה מבצע [[pio|PIO]], היכולת המיוחדת של ה-Pico, וכל זה עטוף ב[[library|ספרייה]] המובנית `neopixel`.',
          'The [[bit|bits]] are sent with very fast, exact timing, less than a millionth of a second per bit. This is done by [[pio|PIO]], the Pico\'s special ability, and it is all wrapped in the built-in `neopixel` [[library|library]].')
      ],
      needs: [B('פס או טבעת WS2812 עם 8 לדים', 'A WS2812 strip or ring with 8 LEDs'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [
        W('5V', 'VBUS', 40),
        W('DIN', 'GP0', 1, B('לקצה DIN, ולא לקצה DOUT', 'to the DIN end, not the DOUT end')),
        W('GND', 'GND', 3)
      ],
      steps: [
        UNPLUG,
        B('מצאו את הקצה של הפס שבו כתוב `DIN`. החץ שעל הפס מצביע ממנו והלאה.', 'Find the end of the strip marked `DIN`. The arrow on the strip points away from it.'),
        B('חברו את `5V` של הפס אל פין 40 של ה-Pico, שהוא `VBUS`.', 'Connect the strip\'s `5V` to Pico pin 40, which is `VBUS`.'),
        B('חברו את `GND` של הפס אל פין 3, שהוא `GND`.', 'Connect the strip\'s `GND` to pin 3, which is `GND`.'),
        B('חברו את `DIN` אל פין 1, שהוא `GP0`.', 'Connect `DIN` to pin 1, which is `GP0`.'),
        CHECK
      ],
      code: [
        'from machine import Pin',
        'from neopixel import NeoPixel',
        'from time import sleep',
        '',
        'N = 8',
        'strip = NeoPixel(Pin(0), N)',
        '',
        'while True:',
        '    for i in range(N):',
        '        strip.fill((0, 0, 0))',
        '        strip[i] = (0, 40, 80)        # (R, G, B), each 0..255. Keep it dim.',
        '        strip.write()',
        '        sleep(0.1)'
      ],
      explain: [
        E([5], 'זה מספר הלדים בפס. אם בפס שלכם יש מספר אחר, שנו אותו כאן.', 'The number of LEDs in the strip. If yours has a different number, change it here.'),
        E([6], 'השורה הזו יוצרת את הפס: הוא מחובר ל-GP0, ויש בו N לדים.', 'Creates the strip: connected to GP0, with N LEDs in it.'),
        E([9], 'זו לולאה שבה `i` עובר על המספרים 0 עד 7, מספר אחד לכל לד. הלד הראשון הוא מספר 0.', 'A loop in which `i` goes through the numbers 0 to 7, one per LED. The first LED is number 0.'),
        E([10], 'השורה הזו מכבה את כל הלדים. צבע נכתב כשלושה מספרים: כמה אדום, כמה ירוק וכמה כחול, כל אחד מהם בין 0 ל-255.', 'Switches all the LEDs off. A colour is written as three numbers: how much red, how much green and how much blue, each from 0 to 255.'),
        E([11], 'השורה הזו נותנת ללד מספר `i` צבע תכלת: בלי אדום, מעט ירוק ויותר כחול.', 'Gives LED number `i` a light-blue colour: no red, a little green, more blue.'),
        E([12], 'השורה הזו שולחת את הצבעים לפס. עד השורה הזו שום דבר לא משתנה בפועל.', 'Sends the colours to the strip. Until this line nothing actually changes.'),
        E([13], 'כאן ממתינים עשירית שנייה, ואז עוברים ללד הבא.', 'Waits a tenth of a second, then moves on to the next LED.')
      ],
      expect: B('נקודת אור בצבע תכלת רצה לאורך הפס, מלד ללד, וחוזרת להתחלה.', 'A light-blue dot of light runs along the strip, LED to LED, and returns to the start.'),
      mistakes: [
        B('אף לד לא נדלק: התחברתם לקצה `DOUT` במקום לקצה `DIN`.', 'No LED lights: you are connected to the `DOUT` end instead of `DIN`.'),
        B('הלוח מתנתק כשהפס נדלק: יותר מדי לדים דולקים בעוצמה גבוהה. כל לד שדולק בלבן מלא צורך עד 60mA. הקטינו את המספרים של הצבע, או הזינו את הפס מספק 5V נפרד.', 'The board disconnects when the strip lights up: too many LEDs at high brightness. Each LED at full white draws up to 60 mA. Lower the colour numbers, or power the strip from a separate 5 V supply.'),
        B('הצבעים לא משתנים: שכחתם את `strip.write()`.', 'The colours do not change: `strip.write()` was forgotten.')
      ],
      ideas: [
        B('מד עוצמה: ככל שהחיישן קורא ערך גבוה יותר, נדלקים יותר לדים.', 'A level meter: the higher the sensor reads, the more LEDs light up.'),
        B('תאורת אווירה שמחליפה צבעים לאט.', 'Mood lighting that changes colour slowly.'),
        B('שעון: טבעת של 12 לדים שמראה את השעה.', 'A clock: a ring of 12 LEDs that shows the hour.')
      ]
    },

    /* ------------------------------------------------------------ microSD */
    {
      id: 'sdcard', name: B('כרטיס microSD', 'microSD card'), iface: ['spi'], cat: 'storage', volt: '3.3V',
      summary: B('שומר נתונים בקובץ, שאפשר לפתוח אחר כך במחשב.', 'Saves data to a file that you can open later on a computer.'),
      what: [
        B('מודול שמחזיק כרטיס זיכרון קטן, מהסוג שנמצא בטלפונים ובמצלמות. בזכותו הפרויקט יכול לשמור קבצים: למשל, לרשום את הטמפרטורה כל דקה במשך שבוע, ואחר כך להכניס את הכרטיס למחשב ולפתוח את הקובץ.',
          'A module that holds a small memory card, the kind found in phones and cameras. With it a project can save files: for example recording the temperature every minute for a week, then putting the card in a computer and opening the file.')
      ],
      looks: B('לוח קטן עם חריץ מתכת שאליו מחליקים את הכרטיס, ושישה פינים: GND, VCC, MISO, MOSI, SCK ו-CS.',
        'A small board with a metal slot the card slides into, and six pins: GND, VCC, MISO, MOSI, SCK, CS.'),
      pins: [
        PIN_VCC33, PIN_GND,
        { n: 'SCK', d: B('[[clock|קו השעון]].', 'The [[clock|clock line]].') },
        { n: 'MOSI', d: B('נתונים שעוברים מה-Pico אל הכרטיס.', 'Data from the Pico to the card.') },
        { n: 'MISO', d: B('נתונים שעוברים מהכרטיס אל ה-Pico.', 'Data from the card to the Pico.') },
        { n: 'CS', d: B('קו הבחירה. ה-Pico מוריד אותו ל-0 כדי לומר "אני מדבר איתך".', 'The select line. The Pico pulls it to 0 to say "I am talking to you".') }
      ],
      how: [
        B('הכרטיס מתקשר ב-[[spi|SPI]], שיטה מהירה שמשתמשת בארבעה חוטי [[signal|אות]]. את כל הפרטים מנהלת ה[[library|ספרייה]] `sdcard`.',
          'The card speaks [[spi|SPI]], a fast method with four [[signal|signal]] wires. All the details are handled by the `sdcard` [[library|library]].'),
        B('אחרי שמחברים את הכרטיס בקוד, הוא מופיע כתיקייה בשם `/sd`. מאותו רגע אפשר לכתוב ולקרוא קבצים בפקודות הרגילות של Python, כמו במחשב.', 'Once the card is attached in code, it appears as a folder named `/sd`. From then on you write and read files with Python\'s ordinary commands, as on a computer.')
      ],
      needs: [B('מודול microSD', 'A microSD module'), B('כרטיס microSD בפורמט FAT32', 'A microSD card formatted as FAT32'), B('שישה חוטי גישור', 'Six jumper wires')],
      lib: { name: 'sdcard', how: B('ב-Thonny: פתחו את Tools ואחר כך את Manage packages, חפשו sdcard והתקינו.', 'In Thonny: Tools, then Manage packages. Search for sdcard and install.') },
      wiring: [
        W('VCC', '3V3', 36, B('מודול עם מייצב מתח משלו צריך 5V מ-VBUS', 'a module with its own regulator needs 5 V from VBUS')),
        W('GND', 'GND', 23),
        W('SCK', 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK')),
        W('MOSI', 'GP19', 25, B('SPI0 TX', 'SPI0 TX')),
        W('MISO', 'GP16', 21, B('SPI0 RX', 'SPI0 RX')),
        W('CS', 'GP17', 22, B('SPI0 CSn', 'SPI0 CSn'))
      ],
      steps: [
        B('במחשב: פרמטו את הכרטיס ל-FAT32, והכניסו אותו לחריץ של המודול.', 'On the computer: format the card as FAT32, and put it in the module\'s slot.'),
        UNPLUG, seat(6),
        wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 23), wire('SCK', 'GP18', 24),
        wire('MOSI', 'GP19', 25), wire('MISO', 'GP16', 21), wire('CS', 'GP17', 22),
        CHECK, LIB_STEP('sdcard')
      ],
      code: [
        'import os, sdcard',
        'from machine import Pin, SPI',
        '',
        'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))',
        'sd = sdcard.SDCard(spi, Pin(17, Pin.OUT))',
        'os.mount(sd, "/sd")',
        '',
        'with open("/sd/log.txt", "a") as f:',
        '    f.write("hello from Pico 2\\n")',
        '',
        'print(os.listdir("/sd"))'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את `os`, שמטפל בקבצים ובתיקיות, ואת הספרייה של הכרטיס.', 'Brings in `os`, which handles files and folders, and the card\'s library.'),
        E([4], 'השורה הזו מגדירה את אפיק ה-SPI: איזה פין משמש כשעון, ואיזה פין משמש לכל כיוון של נתונים.', 'Sets up the SPI bus: which pin is the clock, and which pin for each direction of data.'),
        E([5], 'השורה הזו יוצרת את הכרטיס, וקובעת שקו הבחירה שלו הוא GP17.', 'Creates the card, and says its select line is GP17.'),
        E([6], 'השורה הזו מחברת את הכרטיס כתיקייה בשם `/sd`.', 'Attaches the card as a folder named `/sd`.'),
        E([8], 'השורה הזו פותחת קובץ בשם log.txt. האות `"a"` פירושה "הוסף לסוף", כך שמה שכבר כתוב בקובץ לא נמחק.', 'Opens a file named log.txt. The letter `"a"` means "append", so what is already in the file is not erased.'),
        E([9], 'השורה הזו כותבת שורת טקסט. `\\n` מסמן סוף שורה. בסוף הבלוק הקובץ נסגר ונשמר מעצמו.', 'Writes a line of text. `\\n` marks the end of the line. At the end of the block the file is closed and saved by itself.'),
        E([11], 'השורה הזו מדפיסה את רשימת הקבצים שבכרטיס.', 'Prints the list of files on the card.')
      ],
      expect: B('מודפסת רשימה שמופיע בה `log.txt`. כל הרצה מוסיפה לקובץ שורה אחת. הוציאו את הכרטיס, הכניסו אותו למחשב ופתחו את הקובץ, כדי לראות את השורות.', 'A list containing `log.txt` is printed. Each run adds one line to the file. Take the card out, put it in a computer, and open the file to see the lines.'),
      mistakes: [
        B('מופיעה שגיאה `OSError: no SD card`: MOSI ו-MISO התחלפו, או שהכרטיס לא הוכנס עד הסוף.', 'An `OSError: no SD card`: MOSI and MISO are swapped, or the card is not pushed fully in.'),
        B('מופיעה שגיאה ב-`os.mount`: הכרטיס לא בפורמט FAT32. כרטיסים גדולים מגיעים בפורמט exFAT, וצריך לפרמט אותם מחדש.', 'An error at `os.mount`: the card is not FAT32. Large cards come as exFAT and must be reformatted.'),
        B('מופיעה שגיאה `ImportError`: הספרייה sdcard לא הותקנה על הלוח.', 'An `ImportError`: the sdcard library was not installed on the board.')
      ],
      ideas: [
        B('יומן טמפרטורה: מדידה אחת בכל דקה במשך שבוע.', 'A temperature log: one reading a minute for a week.'),
        B('רישום של כל פעם שחיישן התנועה זיהה מישהו.', 'A record of every time the motion sensor detected someone.'),
        B('שמירת הגדרות, כך שהפרויקט יזכור אותן גם אחרי כיבוי.', 'Saving settings, so the project remembers them after power-off.')
      ]
    },

    /* ------------------------------------------------------------ GPS */
    {
      id: 'gps', name: B('מקלט GPS NEO-6M', 'NEO-6M GPS receiver'), iface: ['uart'], cat: 'sensor', volt: '3.3V',
      summary: B('קולט אותות מלוויינים ומוסר את המיקום ואת השעה המדויקת.', 'Receives satellites and reports position and the exact time.'),
      what: [
        B('מקלט GPS מקשיב ללוויינים, ולפיהם מחשב איפה הוא נמצא על כדור הארץ. מלבד המיקום, הוא מוסר גם את השעה המדויקת ואת המהירות.',
          'A GPS receiver listens to satellites and works out from them where on Earth it is. Besides position it also reports the exact time and the speed.')
      ],
      looks: B('לוח קטן שמחוברת אליו, בכבל קצר, אנטנה מרובעת בצבע בז\', וארבעה פינים: VCC, RX, TX ו-GND. על הלוח יש נורית קטנה שמתחילה להבהב כשיש קליטה.',
        'A small board with a square beige antenna attached by a short cable, and four pins: VCC, RX, TX, GND. The board has a small light that starts blinking once it has reception.'),
      pins: [
        PIN_VCC33, PIN_GND,
        { n: 'TX', d: B('קו השידור של המקלט. ממנו יוצא המידע, ולכן הוא מתחבר לפין הקליטה (RX) של ה-Pico.', 'The receiver\'s transmit line. The information comes out of it, so it connects to the Pico\'s receive pin (RX).') },
        { n: 'RX', d: B('קו הקליטה של המקלט. הוא מתחבר לפין השידור (TX) של ה-Pico.', 'The receiver\'s receive line. Connects to the Pico\'s transmit pin (TX).') }
      ],
      how: [
        B('פעם בשנייה המקלט שולח כמה שורות טקסט דרך [[uart|UART]], במהירות של 9600 [[baud|baud]]. כל שורה מתחילה בסימן $ ובשם קצר שמציין מה יש בה. השורה שבשמה מופיע GGA מכילה את המיקום.',
          'Once a second the receiver sends a few lines of text over [[uart|UART]], at a speed of 9600 [[baud|baud]]. Each line starts with a $ sign and a short name saying what it holds. The line whose name contains GGA carries the position.'),
        B('ב-UART תמיד מצליבים את החוטים: מה שצד אחד [[txrx|משדר]], הצד השני קולט.', 'In UART you always cross the wires: what one side [[txrx|transmits]], the other receives.')
      ],
      needs: [B('מודול NEO-6M עם אנטנה', 'A NEO-6M module with its antenna'), B('ארבעה חוטי גישור', 'Four jumper wires')],
      wiring: [
        W('VCC', '3V3', 36),
        W('GND', 'GND', 13),
        W('TX', 'GP9', 12, B('TX של המקלט ל-RX של ה-Pico (UART1 RX)', 'the receiver\'s TX to the Pico\'s RX (UART1 RX)')),
        W('RX', 'GP8', 11, B('RX של המקלט ל-TX של ה-Pico (UART1 TX)', 'the receiver\'s RX to the Pico\'s TX (UART1 TX)'))
      ],
      steps: [
        UNPLUG,
        B('חברו את האנטנה למחבר הקטן שעל הלוח, אם היא עדיין לא מחוברת.', 'Attach the antenna to the small connector on the board, if it is not already attached.'),
        seat(4),
        wire('VCC', '3V3(OUT)', 36), wire('GND', 'GND', 13),
        wire('TX', 'GP9', 12), wire('RX', 'GP8', 11),
        CHECK,
        B('הניחו את האנטנה ליד חלון או בחוץ, כשהצד בצבע בז\' פונה לשמיים.', 'Put the antenna by a window or outdoors, with the beige side facing the sky.')
      ],
      code: [
        'from machine import Pin, UART',
        '',
        'gps = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))',
        '',
        'while True:',
        '    line = gps.readline()',
        '    if line and b"GGA" in line:       # the sentence that carries the position',
        '        print(line)'
      ],
      explain: [
        E([3], 'השורה הזו מגדירה את חיבור UART מספר 1, במהירות 9600. ה-Pico משדר ב-GP8 וקולט ב-GP9.', 'Sets up UART connection number 1, at a speed of 9600. The Pico transmits on GP8 and receives on GP9.'),
        E([6], 'השורה הזו קוראת שורה אחת, אם כבר הגיעה. אם עדיין לא הגיעה שורה שלמה, מתקבל `None`, כלומר "כלום".', 'Reads one line, if one has arrived. If no whole line has arrived yet, the result is `None`, meaning "nothing".'),
        E([7], 'התוכנית ממשיכה רק אם יש שורה, ורק אם מופיעות בה האותיות GGA.', 'Carries on only if there is a line, and only if it contains the letters GGA.'),
        E([8], 'השורה הזו מדפיסה את השורה שהתקבלה כמו שהיא.', 'Prints the line as it is.')
      ],
      expect: B('פעם בשנייה מודפסת שורה שמתחילה ב-`b\'$GPGGA` או ב-`b\'$GNGGA`. לפני שיש קליטה, השורה מלאה בפסיקים בלי ערכים ביניהם. אחרי כמה דקות מול שמיים פתוחים מופיעים בה מספרים: השעה, קו הרוחב וקו האורך.', 'Once a second a line starting with `b\'$GPGGA` or `b\'$GNGGA` is printed. Before there is reception the line is full of empty commas. After a few minutes under open sky numbers appear in it: the time, the latitude and the longitude.'),
      mistakes: [
        B('שום דבר לא מודפס: TX ו-RX לא מוצלבים. ה-TX של המקלט חייב להגיע ל-GP9.', 'Nothing prints: TX and RX are not crossed. The receiver\'s TX must reach GP9.'),
        B('מודפסים תווים משובשים: המהירות לא תואמת. רוב המודולים עובדים במהירות 9600.', 'Garbled characters are printed: the speed does not match. Most modules work at 9600.'),
        B('השורות מגיעות, אבל הן ריקות: אין קליטה. בתוך בניין המקלט כמעט לא קולט, והקליטה הראשונה לוקחת כמה דקות.', 'The lines arrive but are empty: there is no reception. Indoors the receiver picks up almost nothing. The first fix takes a few minutes.')
      ],
      ideas: [
        B('שעון שמכוון את עצמו לפי הלוויינים.', 'A clock that sets itself from the satellites.'),
        B('רישום של מסלול הליכה בכרטיס זיכרון.', 'Logging a walking route to a memory card.'),
        B('מד מהירות לאופניים.', 'A speedometer for a bicycle.')
      ]
    }
  );
})(window.PICO);
