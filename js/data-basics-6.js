/* Basics, chapter 21: seeing the signals. The logic analyzer, in Wokwi and on the bench.
   Same block types as data-basics.js. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };
  var OUT = function (q, code, answer, why) { return { type: 'output', q: q, code: code, answer: answer, why: why }; };

  P.glossary.logicanalyzer = { cat: 'hw', t: B('מנתח לוגי', 'Logic analyzer'), d: B('מכשיר שמקליט את הרמה (0 או 1) של כמה חוטים לאורך זמן, ומציג אותם כגרף. בעזרתו רואים מה באמת עובר על I2C, SPI או UART.', 'An instrument that records the level (0 or 1) of several wires over time, and shows them as a graph. With it you see what really goes over I2C, SPI or UART.') };

  P.basics.push({
    id: 'analyzer',
    title: B('לראות את האותות: מנתח לוגי', 'Seeing the signals: the logic analyzer'),
    lead: B('כשחיישן לא עונה, אי אפשר לדעת מהקוד לבד אם הבעיה בחיווט, בכתובת או בתזמון. [[logicanalyzer|מנתח לוגי]] מראה מה עובר על החוטים, ביט אחרי ביט. הפרק מסביר איך משתמשים במנתח של Wokwi, ואיך עושים את אותו הדבר בכיתה.', 'When a sensor does not answer, the code alone cannot tell whether the problem is the wiring, the address or the timing. A [[logicanalyzer|logic analyzer]] shows what goes over the wires, bit after bit. This chapter explains how to use Wokwi\'s analyzer, and how to do the same in the lab.'),
    blocks: [
      { h: B('מה מנתח לוגי מראה', 'What a logic analyzer shows') },
      { p: B('המנתח מחובר לכמה חוטים במעגל ודוגם אותם מיליוני פעמים בשנייה. בסוף מקבלים גרף: לכל חוט קו שעולה ל-1 ויורד ל-0 לאורך הזמן. תוכנה שנקראת מפענח קוראת את הגרף והופכת אותו למילים: "כתובת 0x77, כתיבה, נתון 0xF4".', 'The analyzer is connected to a few wires in the circuit and samples them millions of times a second. At the end you get a graph: for each wire a line that rises to 1 and falls to 0 over time. Software called a decoder reads the graph and turns it into words: "address 0x77, write, data 0xF4".') },
      { ul: [
        B('ב-[[i2c|I2C]] רואים את ה-START, את הכתובת, את ה-ACK של החיישן ואת הנתונים. אם החיישן לא עונה, רואים NACK מיד אחרי הכתובת.', 'On [[i2c|I2C]] you see the START, the address, the sensor\'s ACK and the data. If the sensor does not answer, you see a NACK right after the address.'),
        B('ב-[[spi|SPI]] רואים את השעון, את הנתונים ואת CS. אפשר לבדוק שהמהירות והסדר נכונים.', 'On [[spi|SPI]] you see the clock, the data and CS. You can check that the speed and the order are right.'),
        B('ב-[[uart|UART]] רואים כל תו, ואפשר למדוד את קצב הבאוד בפועל.', 'On [[uart|UART]] you see each character, and you can measure the actual baud rate.'),
        B('ב-[[pwm|PWM]] רואים את התדר ואת מחזור העבודה, ובפולסים של חיישן מרחק או סרוו את האורך המדויק שלהם.', 'On [[pwm|PWM]] you see the frequency and the duty cycle, and for the pulses of a distance sensor or a servo their exact length.')
      ] },
      { h: B('המנתח של Wokwi', 'Wokwi\'s analyzer') },
      { p: B('ב-Wokwi יש רכיב בשם Logic Analyzer, עם שמונה כניסות (D0 עד D7) ופין GND. מוסיפים אותו לקובץ `diagram.json`, ומחברים כל כניסה לחוט שרוצים לראות. בדוגמה הוא מחובר לחוטי ה-I2C של חיישן BMP180:', 'Wokwi has a part called Logic Analyzer, with eight inputs (D0 to D7) and a GND pin. Add it to the `diagram.json` file, and connect each input to a wire you want to see. In the example it is connected to the I2C wires of a BMP180 sensor:') },
      { code: [
        '{ "type": "wokwi-logic-analyzer", "id": "logic1", "top": 150, "left": 300,',
        '  "attrs": { "channelNames": "SDA,SCL" } },',
        '',
        '[ "logic1:D0", "pico:GP4", "green", [] ],',
        '[ "logic1:D1", "pico:GP5", "yellow", [] ],',
        '[ "logic1:GND", "pico:GND.8", "black", [] ]'
      ] },
      { ol: [
        B('הוסיפו את השורה הראשונה לרשימה `parts`, ואת שלושת החיבורים לרשימה `connections`.', 'Add the first entry to the `parts` list, and the three connections to the `connections` list.'),
        B('הריצו את הסימולציה. על המנתח מופיע מספר הדגימות שנאספו.', 'Run the simulation. The analyzer shows the number of samples collected.'),
        B('עצרו את הסימולציה. הדפדפן מוריד קובץ בשם `wokwi-logic.vcd`.', 'Stop the simulation. The browser downloads a file named `wokwi-logic.vcd`.'),
        B('פתחו את הקובץ בתוכנה החינמית PulseView: File, Import, Value Change Dump. הוסיפו מפענח I2C, ובחרו את D0 כ-SDA ואת D1 כ-SCL.', 'Open the file in the free PulseView program: File, Import, Value Change Dump. Add an I2C decoder, and choose D0 as SDA and D1 as SCL.')
      ] },
      { tip: B('הקלטה ארוכה יוצרת קובץ גדול וקשה לחיפוש. כדי להקליט רק את הרגע המעניין, השתמשו בטריגר: `"triggerMode": "edge"` ו-`"triggerPin": "D2"`, וחברו את D2 לפין שהקוד מעלה ל-1 רגע לפני הפעולה שרוצים לראות.', 'A long recording makes a big file that is hard to search. To record only the interesting moment, use the trigger: `"triggerMode": "edge"` and `"triggerPin": "D2"`, and connect D2 to a pin the code raises to 1 just before the action you want to see.') },
      { h: B('בכיתה: מנתח לוגי אמיתי', 'In the lab: a real logic analyzer') },
      { p: B('מנתח לוגי קטן עם שמונה ערוצים ו-USB עושה את אותו הדבר על מעגל אמיתי, ועובד עם אותה תוכנה, PulseView. מחברים את ה-GND שלו לאדמה של המעגל, ואת הערוצים לחוטים בעזרת תפסנים קטנים. קצב דגימה של 24 מגה-הרץ מספיק ל-I2C, ל-UART ולרוב ה-SPI שבאתר.', 'A small eight-channel USB logic analyzer does the same on a real circuit, and works with the same software, PulseView. Connect its GND to the circuit\'s ground, and the channels to the wires with small hook clips. A sample rate of 24 MHz is enough for I2C, UART and most of the SPI on this site.') },
      { table: {
        head: [B('מה רואים', 'What you see'), B('מה זה אומר', 'What it means')],
        rows: [
          [B('אחרי הכתובת יש NACK', 'A NACK after the address'), B('אין רכיב בכתובת הזו: כתובת שגויה, חיווט או הזנה.', 'No part at that address: a wrong address, wiring or power.')],
          [B('SDA או SCL תמיד ב-0', 'SDA or SCL always 0'), B('קצר לאדמה, או רכיב תקוע שמחזיק את הקו.', 'A short to ground, or a stuck part holding the line.')],
          [B('הקווים עולים לאט, בשיפוע', 'The lines rise slowly, in a slope'), B('אין נגדי משיכה למעלה, או שהם חלשים מדי לאורך החוט.', 'No pull-up resistors, or they are too weak for the length of the wire.')],
          [B('ב-UART מופיעים תווים משובשים', 'Garbled characters on UART'), B('קצב באוד שונה בשני הצדדים.', 'A different baud rate on the two sides.')]
        ]
      } },
      { tip: B('מנתח לוגי מראה רק 0 ו-1. כדי לראות מתח אמיתי, רעש או צורת גל, צריך אוסצילוסקופ.', 'A logic analyzer shows only 0 and 1. To see a real voltage, noise or a waveform, you need an oscilloscope.') }
    ],
    quiz: [
      Q(B('חיישן I2C לא עונה. במנתח רואים את הכתובת שנשלחה, ומיד אחריה NACK. מה הכי סביר?', 'An I2C sensor does not answer. The analyzer shows the address that was sent, followed at once by a NACK. What is most likely?'),
        [B('הכתובת בקוד לא נכונה, או שהחיישן לא מחובר', 'The address in the code is wrong, or the sensor is not connected'), B('קצב ה-I2C מהיר מדי', 'The I2C speed is too fast'), B('הקוד לא קרא את הנתונים', 'The code did not read the data')], 0,
        B('NACK מיד אחרי הכתובת אומר שאף רכיב לא זיהה את הכתובת שלו. בודקים את הכתובת בעזרת `i2c.scan()`, ואת החיווט וההזנה.', 'A NACK right after the address means no part recognised its address. Check the address with `i2c.scan()`, and the wiring and power.')),
      Q(B('מה מקבלים כשעוצרים סימולציה עם Logic Analyzer ב-Wokwi?', 'What do you get when you stop a simulation that has a Logic Analyzer in Wokwi?'),
        [B('קובץ VCD שאפשר לפתוח ב-PulseView', 'A VCD file you can open in PulseView'), B('תמונה של הגרף בתוך Wokwi', 'A picture of the graph inside Wokwi'), B('הדפסה של הביטים ב-Serial', 'A printout of the bits on Serial')], 0,
        B('המנתח שומר את הדגימות בקובץ בפורמט VCD, והדפדפן מוריד אותו. את הגרף והפענוח רואים בתוכנה כמו PulseView.', 'The analyzer saves the samples in a VCD file, and the browser downloads it. You see the graph and the decoding in a program such as PulseView.')),
      OUT(B('כל מעבר של חוט מ-0 ל-1 או מ-1 ל-0 תופס מקום אחד בזיכרון של המנתח. בשעון של I2C ב-100 קילו-הרץ יש שני מעברים בכל מחזור. כמה מעברים יש בשנייה אחת, רק בחוט השעון?', 'Each change of a wire from 0 to 1 or 1 to 0 takes one slot in the analyzer\'s memory. An I2C clock at 100 kHz has two changes per cycle. How many changes are there in one second, on the clock wire alone?'),
        ['freq = 100_000      # cycles per second', 'print(freq * 2)'], '200000',
        B('100 אלף מחזורים, ובכל אחד עלייה וירידה: 200 אלף מעברים. לכן הקלטה ארוכה ממלאת את הזיכרון מהר, וטריגר עוזר.', '100 thousand cycles, each with a rise and a fall: 200 thousand changes. That is why a long recording fills the memory fast, and a trigger helps.')),
      Q(B('מה מנתח לוגי לא יכול להראות?', 'What can a logic analyzer not show?'),
        [B('את המתח המדויק ואת הרעש על החוט', 'The exact voltage and the noise on the wire'), B('את הכתובת ששולחים ב-I2C', 'The address sent on I2C'), B('את אורך הפולס של סרוו', 'The length of a servo pulse')], 0,
        B('המנתח רואה רק 0 או 1. מתח אמיתי, רעש וצורת גל רואים באוסצילוסקופ.', 'The analyzer sees only 0 or 1. A real voltage, noise and the waveform are seen on an oscilloscope.'))
    ]
  });
})(window.PICO);
