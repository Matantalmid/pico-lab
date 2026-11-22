/* Component catalog, part 6: parts that most starter kits ship with and the catalog did not have.
   The 74HC595 shift register, a single seven-segment digit, the L298N motor driver, the FS90R
   continuous-rotation servo, and two basic parts: the 2N2222 transistor and the 1N4007 diode.
   Also: more mistakes and ideas for four thin entries of part 4 (tilt, hall, touch, mq2).
   Same structure as data-components.js. */
(function (P) {
  'use strict';
  var c = P._c, B = c.B, W = c.W, E = c.E, UNPLUG = c.UNPLUG, CHECK = c.CHECK, lead = c.lead, GND = c.GND, V33 = c.V33, V5 = c.V5;

  P.categories.basic = B('רכיבים בסיסיים', 'Basic parts');
  var RES330 = B('נגד 330Ω לכל לד או מקטע', 'A 330 Ω resistor for each LED or segment');

  P.components.push(
    /* ============================================================ 74HC595 */
    {
      id: 'hc595', name: B('אוגר הזזה 74HC595', '74HC595 shift register'), iface: ['gpio'], cat: 'output', volt: '3.3V',
      summary: B('שבב שהופך שלושה פינים של ה-Pico לשמונה יציאות.', 'A chip that turns three Pico pins into eight outputs.'),
      what: [
        B('[[shiftreg|אוגר הזזה]] מקבל ביטים אחד אחרי השני על חוט נתונים אחד, ושומר אותם בתוכו. כשמתקבלים שמונה ביטים, הוא מוציא את כולם יחד על שמונה רגליים.', 'A [[shiftreg|shift register]] takes bits one after another on a single data wire, and keeps them inside. Once eight bits have arrived, it puts them all out together on eight legs.'),
        B('כך אפשר להדליק שמונה לדים, ספרה של שבעה מקטעים או שורה של מטריצת לדים בשלושה פינים בלבד. אפשר גם לשרשר כמה שבבים, ולקבל 16 או 24 יציאות על אותם שלושה פינים.', 'That way eight LEDs, a seven-segment digit or a row of an LED matrix can be driven from just three pins. Several chips can also be chained, giving 16 or 24 outputs on the same three pins.')
      ],
      looks: B('שבב שחור עם 16 רגליים, שמונה בכל צד, ועליו הכיתוב 74HC595. בקצה אחד יש חריץ קטן או נקודה, שמסמנים את רגל 1.', 'A black chip with 16 legs, eight on each side, marked 74HC595. One end has a small notch or dot, which marks leg 1.'),
      pins: [
        { n: 'DS (14)', d: B('קו הנתונים: הביט הבא שנכנס.', 'The data line: the next bit going in.') },
        { n: 'SHCP (11)', d: B('השעון: בכל עלייה שלו, הביט שעל DS נכנס פנימה.', 'The clock: on each rise, the bit on DS goes in.') },
        { n: 'STCP (12)', d: B('התפס: בעלייה שלו, שמונת הביטים עוברים ליציאות.', 'The latch: on its rise, the eight bits pass to the outputs.') },
        { n: 'Q0 עד Q7', d: B('שמונה היציאות: רגל 15, ורגליים 1 עד 7.', 'The eight outputs: leg 15, and legs 1 to 7.') },
        { n: 'MR (10)', d: B('איפוס. מחברים ל-3.3V כדי שלא יאפס.', 'Reset. Tie it to 3.3 V so it does not reset.') },
        { n: 'OE (13)', d: B('הפעלת היציאות. מחברים לאדמה כדי שהן יעבדו.', 'Output enable. Tie it to ground so the outputs work.') },
        V33('VCC (16)'), GND('GND (8)')
      ],
      how: [
        B('כל פולס בשעון מזיז את כל הביטים מקום אחד, ומכניס את הביט שעל DS למקום הראשון. אחרי שמונה פולסים, הבית כולו נמצא בפנים.', 'Each clock pulse moves all the bits one place, and puts the bit on DS into the first place. After eight pulses, the whole byte is inside.'),
        B('היציאות לא משתנות בזמן ההזזה. רק כשהתפס עולה, הן מתעדכנות בבת אחת, ולכן הלדים לא מהבהבים.', 'The outputs do not change while bits are shifting. Only when the latch rises do they update at once, so the LEDs do not flicker.')
      ],
      needs: [B('שבב 74HC595', 'A 74HC595 chip'), B('שמונה לדים ושמונה נגדים של 330Ω', 'Eight LEDs and eight 330 Ω resistors'), B('כ-20 חוטי גישור', 'About 20 jumper wires')],
      wiring: [W('DS', 'GP10', 14), W('SHCP', 'GP11', 15), W('STCP', 'GP12', 16), W('VCC', '3V3', 36, B('ועוד MR (רגל 10)', 'and MR (leg 10)')), W('GND', 'GND', 38, B('ועוד OE (רגל 13)', 'and OE (leg 13)'))],
      steps: [UNPLUG,
        B('הכניסו את השבב מעל התעלה שבאמצע המטריצה, כשהחריץ פונה שמאלה. רגל 1 נמצאת משמאל למטה, והספירה ממשיכה נגד כיוון השעון.', 'Push the chip in across the channel in the middle of the breadboard, notch to the left. Leg 1 is at the bottom left, and the count goes on anticlockwise.'),
        lead('DS (14)', 'GP10', 14), lead('SHCP (11)', 'GP11', 15), lead('STCP (12)', 'GP12', 16),
        B('חברו את רגל 16 (VCC) ואת רגל 10 (MR) לפס ההזנה, ואת רגל 8 (GND) ואת רגל 13 (OE) לפס האדמה.', 'Connect leg 16 (VCC) and leg 10 (MR) to the power rail, and leg 8 (GND) and leg 13 (OE) to the ground rail.'),
        B('מכל יציאה, Q0 עד Q7, חברו נגד של 330Ω ללד, ואת הרגל הקצרה של כל לד לפס האדמה.', 'From each output, Q0 to Q7, wire a 330 Ω resistor to an LED, and each LED\'s short leg to the ground rail.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'data = Pin(10, Pin.OUT)', 'clock = Pin(11, Pin.OUT)', 'latch = Pin(12, Pin.OUT)', '',
        'def write(byte):', '    latch.off()', '    for i in range(8):', '        data.value((byte >> (7 - i)) & 1)', '        clock.on()', '        clock.off()', '    latch.on()', '',
        'for n in range(256):', '    write(n)          # the LEDs count in binary', '    sleep(0.2)'],
      explain: [
        E([8, 14], 'הפונקציה שולחת בית אחד: שמונה ביטים, מהגבוה לנמוך, עם פולס שעון אחרי כל אחד. בסוף התפס מציג את כולם.', 'The function sends one byte: eight bits, highest first, with a clock pulse after each. At the end the latch shows them all.'),
        E([16, 18], 'שולחים את המספרים 0 עד 255. כל לד הוא ביט אחד, ולכן הלדים סופרים בבסיס 2.', 'Send the numbers 0 to 255. Each LED is one bit, so the LEDs count in base 2.')
      ],
      expect: B('הלדים סופרים בבסיס 2: הלד של Q0 מתחלף כל חמישית שנייה, זה שאחריו כל שתי חמישיות, וכן הלאה. אחרי 255 כולם דולקים, והספירה נגמרת.', 'The LEDs count in base 2: the Q0 LED switches every fifth of a second, the next one every two fifths, and so on. After 255 they are all lit, and the count ends.'),
      mistakes: [
        B('שום לד לא נדלק: OE לא מחובר לאדמה, או MR לא מחובר ל-3.3V.', 'No LED lights: OE is not tied to ground, or MR is not tied to 3.3 V.'),
        B('הלדים דולקים בסדר הפוך: מחקו את `7 -` בשורה 11, וכך הביט הנמוך יישלח ראשון.', 'The LEDs light in reverse order: delete `7 -` on line 11, so the low bit is sent first.'),
        B('השבב מתחמם: הוא הפוך במטריצה. נתקו מיד ובדקו איפה החריץ.', 'The chip gets warm: it is the wrong way round in the breadboard. Unplug at once and check where the notch is.')
      ],
      ideas: [B('אור רץ ומד עוצמה, כמו בשיעור S4.', 'A running light and a level meter, as in lesson S4.'), B('ספרה של שבעה מקטעים על שלושה פינים.', 'A seven-segment digit on three pins.'), B('שני שבבים משורשרים: 16 לדים. רגל Q7S של הראשון מתחברת ל-DS של השני.', 'Two chained chips: 16 LEDs. Leg Q7S of the first goes to DS of the second.')]
    },
    /* ============================================================ seven-segment digit */
    {
      id: 'sevenseg', name: B('ספרה של שבעה מקטעים', 'Seven-segment digit'), iface: ['gpio'], cat: 'display', volt: '3.3V',
      summary: B('ספרה אחת משבעה לדים בצורת פסים. התצוגה הפשוטה ביותר למספרים.', 'One digit made of seven bar-shaped LEDs. The simplest display for numbers.'),
      what: [
        B('בתוך הרכיב יש שבעה לדים בצורת פסים, שמסומנים a עד g, ועוד נקודה (dp). כל ספרה מ-0 עד 9 היא צירוף של פסים דולקים.', 'Inside the part are seven bar-shaped LEDs, marked a to g, plus a dot (dp). Each digit from 0 to 9 is a combination of lit bars.'),
        B('בדגם "קתודה משותפת" כל הרגליים הקצרות מחוברות יחד לאדמה, וכל מקטע נדלק כשהפין שלו ב-1. בדגם "אנודה משותפת" זה הפוך: הרגל המשותפת ל-3.3V, ומקטע נדלק כשהפין ב-0.', 'In the "common cathode" type all the short legs are joined to ground, and each segment lights when its pin is 1. In the "common anode" type it is the other way round: the common leg goes to 3.3 V, and a segment lights when its pin is 0.')
      ],
      looks: B('קוביה לבנה או אפורה עם ספרה בצורת "8" ונקודה, ו-10 רגליים: חמש למעלה וחמש למטה. הרגל האמצעית בכל שורה היא הרגל המשותפת.', 'A white or grey block with an "8"-shaped digit and a dot, and 10 legs: five on top and five underneath. The middle leg of each row is the common leg.'),
      pins: [
        { n: 'a עד g', d: B('שבעת המקטעים. כל אחד מתחבר לפין של ה-Pico דרך נגד.', 'The seven segments. Each one connects to a Pico pin through a resistor.') },
        { n: 'dp', d: B('הנקודה.', 'The dot.') },
        { n: 'COM', d: B('הרגל המשותפת: לאדמה בקתודה משותפת, ל-3.3V באנודה משותפת.', 'The common leg: to ground for common cathode, to 3.3 V for common anode.') }
      ],
      how: [
        B('כל מקטע הוא לד רגיל, ולכן כל אחד צריך נגד משלו. בלי נגדים, המקטעים שדולקים יחד מושכים יותר מדי זרם.', 'Each segment is an ordinary LED, so each needs its own resistor. Without resistors, the segments that are lit together draw too much current.'),
        B('בקוד, כל ספרה נשמרת כמספר אחד: ביט 0 הוא מקטע a, ביט 1 הוא b, וכן הלאה עד ביט 6, מקטע g.', 'In code, each digit is stored as one number: bit 0 is segment a, bit 1 is b, and so on up to bit 6, segment g.')
      ],
      needs: [B('ספרה של שבעה מקטעים, קתודה משותפת', 'A seven-segment digit, common cathode'), B('שבעה נגדים של 330Ω', 'Seven 330 Ω resistors'), B('תשעה חוטי גישור', 'Nine jumper wires')],
      wiring: [W('a', 'GP2', 4), W('b', 'GP3', 5), W('c', 'GP4', 6), W('d', 'GP5', 7), W('e', 'GP6', 9), W('f', 'GP7', 10), W('g', 'GP8', 11), W('COM', 'GND', 3)],
      steps: [UNPLUG,
        B('הכניסו את הספרה מעל התעלה שבאמצע המטריצה, עם הנקודה למטה.', 'Push the digit in across the channel in the middle of the breadboard, with the dot at the bottom.'),
        B('חברו כל מקטע לפין שלו לפי הטבלה, דרך נגד של 330Ω. מקטע a הוא הפס העליון, והם מסודרים עם כיוון השעון עד f, ו-g באמצע.', 'Wire each segment to its pin from the table, through a 330 Ω resistor. Segment a is the top bar, and they go clockwise to f, with g in the middle.'),
        B('חברו את הרגל המשותפת לאדמה.', 'Connect the common leg to ground.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'segments = [Pin(n, Pin.OUT) for n in (2, 3, 4, 5, 6, 7, 8)]   # a, b, c, d, e, f, g',
        'DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F]', '',
        'def show(digit):', '    bits = DIGITS[digit]', '    for i in range(7):', '        segments[i].value((bits >> i) & 1)', '',
        'while True:', '    for d in range(10):', '        show(d)', '        sleep(0.5)'],
      explain: [
        E([4], 'רשימה של שבעה פינים, אחד לכל מקטע, לפי הסדר a עד g.', 'A list of seven pins, one per segment, in the order a to g.'),
        E([5], 'טבלת הספרות: לכל ספרה מספר שהביטים שלו אומרים אילו מקטעים דולקים. למשל 0x06 הוא רק b ו-c, כלומר הספרה 1.', 'The digit table: for each digit a number whose bits say which segments are lit. For example 0x06 is only b and c, that is the digit 1.'),
        E([7, 10], 'מציגים ספרה: לכל מקטע לוקחים את הביט שלו מהמספר, ומדליקים או מכבים.', 'Show a digit: for each segment take its bit from the number, and switch it on or off.')
      ],
      expect: B('הספרות 0 עד 9 מופיעות אחת אחרי השנייה, חצי שנייה כל אחת, ושוב מההתחלה.', 'The digits 0 to 9 appear one after another, half a second each, and again from the start.'),
      mistakes: [
        B('הספרות מוצגות "הפוך": מה שצריך לדלוק כבוי. יש לכם אנודה משותפת. חברו את הרגל המשותפת ל-3.3V, וכתבו `1 - ((bits >> i) & 1)`.', 'The digits appear "inverted": what should be lit is off. You have a common anode. Connect the common leg to 3.3 V, and write `1 - ((bits >> i) & 1)`.'),
        B('ספרה אחת נראית מוזר: שני מקטעים מחוברים בפינים מוחלפים. הדליקו מקטע אחד בכל פעם כדי לבדוק.', 'One digit looks odd: two segments are on swapped pins. Light one segment at a time to check.'),
        B('המקטעים חלשים: נגדים גדולים מדי. 330Ω הוא ערך טוב.', 'The segments are dim: the resistors are too big. 330 Ω is a good value.')
      ],
      ideas: [B('קובייה אלקטרונית: לחיצה על כפתור מציגה מספר אקראי מ-1 עד 6.', 'An electronic die: a button press shows a random number from 1 to 6.'), B('ספירה לאחור מ-9 עם זמזם בסוף.', 'A countdown from 9 with a buzzer at the end.'), B('אותה ספרה על שלושה פינים בלבד, דרך 74HC595.', 'The same digit on only three pins, through a 74HC595.')]
    },
    /* ============================================================ L298N */
    {
      id: 'l298n', name: B('דרייבר מנועים L298N', 'L298N motor driver'), iface: ['pwm', 'gpio'], cat: 'output', volt: '5V',
      summary: B('מודול שמניע שני מנועי DC, במהירות ובכיוון שה-Pico קובע.', 'A module that drives two DC motors, at the speed and direction the Pico sets.'),
      what: [
        B('מנוע צריך הרבה יותר זרם ממה שפין נותן, ובשביל שני כיווני סיבוב צריך להפוך את הקוטביות. ה-L298N עושה את שניהם: הוא מעביר זרם ממקור נפרד, ומחבר את המנוע ישר או הפוך לפי הפינים IN1 ו-IN2.', 'A motor needs far more current than a pin gives, and to turn both ways its polarity must be reversed. The L298N does both: it passes current from a separate source, and connects the motor straight or reversed according to the IN1 and IN2 pins.'),
        B('זה המודול הנפוץ בערכות רובוטים. הוא חזק, אבל לא יעיל: כ-2V הולכים לאיבוד בתוכו כחום. לרובוט על סוללות קטנות עדיף דרייבר כמו DRV8833 או TB6612.', 'It is the common module in robot kits. It is strong, but not efficient: about 2 V are lost inside it as heat. For a robot on small batteries a driver such as the DRV8833 or TB6612 is better.')
      ],
      looks: B('לוח אדום או כחול עם צלעות קירור שחורות גדולות, שני מהדקי בורג בצדדים (למנועים), שלושה מהדקים מלפנים (12V, GND, 5V), ושורה של פינים: ENA, IN1, IN2, IN3, IN4, ENB.', 'A red or blue board with a large black heat sink, two screw terminals on the sides (for the motors), three terminals at the front (12V, GND, 5V), and a row of pins: ENA, IN1, IN2, IN3, IN4, ENB.'),
      pins: [
        { n: 'ENA', d: B('מהירות של מנוע A: אות PWM. מסירים את המגשר שעליו.', 'Speed of motor A: a PWM signal. Remove the jumper that sits on it.') },
        { n: 'IN1, IN2', d: B('הכיוון של מנוע A: 1 ו-0 לכיוון אחד, 0 ו-1 לכיוון השני, 0 ו-0 לעצירה.', 'Direction of motor A: 1 and 0 one way, 0 and 1 the other, 0 and 0 to stop.') },
        { n: 'IN3, IN4, ENB', d: B('אותו דבר למנוע B.', 'The same for motor B.') },
        { n: '12V', d: B('ההזנה של המנועים, 6V עד 12V, ממקור נפרד.', 'The motors\' power, 6 V to 12 V, from a separate source.') },
        GND(),
        { n: '5V', d: B('יציאה של 5V מהמייצב שעל המודול. לא מחברים אותה ל-Pico.', 'A 5 V output from the regulator on the module. Do not connect it to the Pico.') }
      ],
      how: [
        B('בתוך השבב יש שני "גשרי H": ארבעה מתגים לכל מנוע. לפי IN1 ו-IN2, שני מתגים נסגרים והזרם עובר דרך המנוע בכיוון אחד, או שני המתגים האחרים והזרם עובר בכיוון ההפוך.', 'Inside the chip are two "H-bridges": four switches per motor. By IN1 and IN2, two switches close and the current flows through the motor one way, or the other two close and it flows the other way.'),
        B('ENA מפעיל ומכבה את הגשר מהר מאוד. עם PWM, אחוז הזמן שבו הוא פועל קובע את המהירות.', 'ENA switches the bridge on and off very fast. With PWM, the share of the time it is on sets the speed.')
      ],
      needs: [B('מודול L298N', 'An L298N module'), B('מנוע DC אחד או שניים', 'One or two DC motors'), B('סוללות או ספק של 6V עד 12V למנועים', 'Batteries or a supply of 6 V to 12 V for the motors'), B('ארבעה חוטי גישור עם קצה נקבה', 'Four jumper wires with a female end')],
      wiring: [W('ENA', 'GP22', 29, B('PWM, אחרי הסרת המגשר', 'PWM, after removing the jumper')), W('IN1', 'GP20', 26), W('IN2', 'GP21', 27), W('GND', 'GND', 28, B('משותפת עם המינוס של הסוללות', 'shared with the batteries\' minus'))],
      steps: [UNPLUG,
        B('הסירו את המגשר הקטן מהפינים של ENA.', 'Remove the small jumper from the ENA pins.'),
        lead('ENA', 'GP22', 29), lead('IN1', 'GP20', 26), lead('IN2', 'GP21', 27), lead('GND', 'GND', 28),
        B('הבריגו את שני החוטים של המנוע למהדקים של מנוע A (OUT1, OUT2).', 'Screw the motor\'s two wires into the motor A terminals (OUT1, OUT2).'),
        B('הבריגו את הפלוס של הסוללות למהדק 12V, ואת המינוס למהדק GND, יחד עם החוט שהולך ל-Pico. כך האדמה משותפת.', 'Screw the batteries\' plus into the 12V terminal, and the minus into the GND terminal, together with the wire to the Pico. That way the ground is shared.'),
        B('אל תחברו שום דבר למהדק 5V, ואל תזינו את ה-Pico ממנו.', 'Connect nothing to the 5V terminal, and do not power the Pico from it.'),
        CHECK],
      code: ['from machine import Pin, PWM', 'from time import sleep', '', 'ena = PWM(Pin(22), freq=1000)', 'in1 = Pin(20, Pin.OUT)', 'in2 = Pin(21, Pin.OUT)', '',
        'def motor(speed):', '    # speed from -100 (full reverse) to 100 (full forward)', '    in1.value(speed > 0)', '    in2.value(speed < 0)', '    ena.duty_u16(abs(speed) * 65535 // 100)', '',
        'while True:', '    motor(60)', '    sleep(2)', '    motor(0)', '    sleep(1)', '    motor(-60)', '    sleep(2)', '    motor(0)', '    sleep(1)'],
      explain: [
        E([4, 6], 'פין PWM למהירות, ושני פינים רגילים לכיוון.', 'A PWM pin for the speed, and two ordinary pins for the direction.'),
        E([8, 12], 'פונקציה אחת למנוע: הסימן של `speed` קובע את הכיוון, והגודל שלו קובע את המהירות. ב-0 שני פיני הכיוון ב-0, והמנוע נעצר.', 'One function for the motor: the sign of `speed` sets the direction, and its size sets the speed. At 0 both direction pins are 0, and the motor stops.'),
        E([14, 22], 'שתי שניות קדימה ב-60%, עצירה, שתי שניות אחורה, ושוב עצירה.', 'Two seconds forward at 60%, a stop, two seconds back, and another stop.')
      ],
      expect: B('המנוע מסתובב שתי שניות לכיוון אחד, עוצר לשנייה, מסתובב שתי שניות לכיוון השני, ושוב עוצר.', 'The motor turns one way for two seconds, stops for a second, turns the other way for two seconds, and stops again.'),
      mistakes: [
        B('המנוע לא זז: המגשר של ENA עדיין במקום, או שהסוללות חלשות. זכרו שכ-2V הולכים לאיבוד בדרייבר.', 'The motor does not move: the ENA jumper is still on, or the batteries are weak. Remember that about 2 V are lost in the driver.'),
        B('ה-Pico מתאפס כשהמנוע מתחיל: המנוע מוזן מה-USB, או שאין אדמה משותפת. למנועים מקור נפרד, והמינוסים מחוברים יחד.', 'The Pico resets when the motor starts: the motor is fed from USB, or there is no shared ground. The motors get a separate source, with the minuses joined.'),
        B('המנוע מסתובב לכיוון ההפוך מהמצופה: החליפו את שני החוטים שלו במהדקים.', 'The motor turns the opposite way to what you expect: swap its two wires in the terminals.')
      ],
      ideas: [B('רובוט עם שני גלגלים: מנוע A לשמאל, מנוע B לימין, ופנייה על ידי מהירויות שונות.', 'A two-wheeled robot: motor A for the left, motor B for the right, and turning by different speeds.'), B('מאוורר שהמהירות שלו תלויה בטמפרטורה.', 'A fan whose speed depends on the temperature.'), B('מנוע שנשלט מג\'ויסטיק, כמו בשיעור E4.', 'A motor steered by a joystick, as in lesson E4.')]
    },
    /* ============================================================ FS90R */
    {
      id: 'fs90r', name: B('סרוו בסיבוב מלא FS90R', 'FS90R continuous-rotation servo'), iface: ['pwm'], cat: 'output', volt: '5V',
      summary: B('נראה כמו סרוו רגיל, אבל מסתובב בלי הגבלה. הפולס קובע מהירות וכיוון, ולא זווית.', 'Looks like an ordinary servo, but turns without limit. The pulse sets the speed and direction, not an angle.'),
      what: [
        B('סרוו רגיל, כמו SG90, זז לזווית בין 0 ל-180 ונעצר. בסרוו בסיבוב מלא אין מגבלה כזו: הוא מסתובב כמו מנוע, ולכן הוא מתאים לגלגלים של רובוט קטן.', 'An ordinary servo, such as the SG90, moves to an angle between 0 and 180 and stops. A continuous-rotation servo has no such limit: it turns like a motor, so it suits the wheels of a small robot.'),
        B('יש לו דרייבר מובנה, ולכן הוא מתחבר ישר ל-Pico, בלי מודול נוסף. החיבור הוא אותו חיבור של SG90.', 'It has a built-in driver, so it connects straight to the Pico, with no extra module. The wiring is the same as the SG90\'s.')
      ],
      looks: B('קופסה כחולה או שחורה קטנה, בדיוק כמו SG90, עם הכיתוב FS90R או "360°", ושלושה חוטים: חום, אדום וכתום.', 'A small blue or black box, exactly like an SG90, marked FS90R or "360°", with three wires: brown, red and orange.'),
      pins: [GND('GND (חום)'), V5('5V (אדום)'), { n: B('אות (כתום)', 'Signal (orange)'), d: B('הפולס שקובע מהירות וכיוון. מתחבר לפין PWM.', 'The pulse that sets speed and direction. Connects to a PWM pin.') }],
      how: [
        B('כמו בסרוו רגיל, ה-Pico שולח פולס 50 פעמים בשנייה. פולס של 1.5 אלפיות שנייה פירושו עצירה. ככל שהפולס ארוך יותר (עד 2 אלפיות) המנוע מסתובב מהר יותר לכיוון אחד, וככל שהוא קצר יותר (עד 1 אלפית) לכיוון השני.', 'As with an ordinary servo, the Pico sends a pulse 50 times a second. A 1.5-millisecond pulse means stop. The longer the pulse (up to 2 milliseconds) the faster it turns one way, and the shorter (down to 1 millisecond) the faster the other way.'),
        B('נקודת העצירה לא תמיד מדויקת. בחלק מהדגמים יש בורג קטן לכיול, ובאחרים מתקנים אותה בקוד.', 'The stop point is not always exact. Some models have a small screw for calibration, and on others you correct it in code.')
      ],
      needs: [B('סרוו FS90R', 'An FS90R servo'), B('שלושה חוטי גישור', 'Three jumper wires')],
      wiring: [W('SIG', 'GP10', 14, B('החוט הכתום', 'the orange wire')), W('5V', 'VBUS', 40, B('החוט האדום', 'the red wire')), W('GND', 'GND', 38, B('החוט החום', 'the brown wire'))],
      steps: [UNPLUG, B('חברו את שלושת החוטים לפי הטבלה, כמו בסרוו SG90.', 'Connect the three wires from the table, as with the SG90 servo.'), CHECK],
      code: ['from machine import Pin, PWM', 'from time import sleep', '', 'servo = PWM(Pin(10), freq=50)', 'STOP = 1_500_000            # nanoseconds: adjust if it creeps at 0', '',
        'def spin(speed):', '    # speed from -100 to 100; 0 = stop', '    servo.duty_ns(STOP + speed * 5_000)', '',
        'while True:', '    spin(50)', '    sleep(2)', '    spin(0)', '    sleep(1)', '    spin(-50)', '    sleep(2)', '    spin(0)', '    sleep(1)'],
      explain: [
        E([5], 'אורך הפולס של עצירה. אם הסרוו זוחל לאט כשהמהירות 0, שנו את המספר הזה בקצת, למשל 1_480_000.', 'The pulse length for stopping. If the servo creeps slowly at speed 0, change this number a little, for example to 1_480_000.'),
        E([7, 9], 'כל יחידה של מהירות מוסיפה 5,000 ננו-שניות. ב-100 הפולס הוא 2 אלפיות שנייה, וב-100- הוא אלפית אחת.', 'Each unit of speed adds 5,000 nanoseconds. At 100 the pulse is 2 milliseconds, and at −100 it is 1 millisecond.')
      ],
      expect: B('הציר מסתובב שתי שניות לכיוון אחד בחצי מהירות, עוצר, מסתובב שתי שניות לכיוון השני, ושוב עוצר.', 'The shaft turns one way at half speed for two seconds, stops, turns the other way for two seconds, and stops again.'),
      mistakes: [
        B('הוא לא נעצר ב-0 אלא זוחל: שנו את `STOP` בצעדים קטנים, או סובבו את בורג הכיול אם יש.', 'It does not stop at 0 but creeps: change `STOP` in small steps, or turn the calibration screw if there is one.'),
        B('הוא זז לזווית ונעצר: זה סרוו רגיל, לא דגם של סיבוב מלא.', 'It moves to an angle and stops: this is an ordinary servo, not a continuous-rotation model.'),
        B('הלוח מתאפס כשהוא מתחיל לזוז: הוזן מ-3V3 במקום מ-VBUS.', 'The board resets when it starts to move: it was fed from 3V3 instead of VBUS.')
      ],
      ideas: [B('רובוט קטן עם שני גלגלים על שני סרוואים כאלה.', 'A small robot with two wheels on two of these servos.'), B('מסוע קטן שמזיז חפץ כשחיישן מזהה אותו.', 'A small conveyor that moves an object when a sensor detects it.'), B('מנגנון וילון שנפתח בבוקר.', 'A curtain mechanism that opens in the morning.')]
    },
    /* ============================================================ 2N2222 */
    {
      id: 'npn', name: B('טרנזיסטור 2N2222', '2N2222 transistor'), iface: ['gpio', 'pwm'], cat: 'basic', volt: '5V',
      summary: B('מתג אלקטרוני קטן שמאפשר לפין להפעיל עומס של כמה מאות מיליאמפר.', 'A small electronic switch that lets a pin drive a load of a few hundred milliamps.'),
      what: [
        B('[[transistor|טרנזיסטור]] NPN הוא מתג בלי חלקים זזים. זרם קטן מהפין, דרך הבסיס, מאפשר לזרם גדול לעבור מהעומס אל האדמה. העומס מקבל חשמל ממקור משלו, למשל VBUS.', 'An NPN [[transistor|transistor]] is a switch with no moving parts. A small current from the pin, through the base, lets a large current flow from the load to ground. The load gets power from its own source, for example VBUS.'),
        B('הפרק "טרנזיסטור, דיודה וקבל" ביסודות מסביר את החישוב. 2N2222 מעביר עד כמה מאות מיליאמפר. לעומס גדול יותר משתמשים במודול MOSFET.', 'The basics chapter "Transistor, diode and capacitor" explains the calculation. The 2N2222 passes up to a few hundred milliamps. For a bigger load, use a MOSFET module.')
      ],
      looks: B('חצי גליל שחור וקטן עם שלוש רגליים, ועליו הכיתוב 2N2222 או PN2222. כשהצד השטוח פונה אליכם והרגליים למטה, הסדר הוא E, B, C (משמאל לימין) בדגם PN2222 הנפוץ.', 'A small black half-cylinder with three legs, marked 2N2222 or PN2222. With the flat side facing you and the legs down, the order is E, B, C (left to right) on the common PN2222.'),
      pins: [
        { n: 'E', d: B('פולט (emitter): לאדמה.', 'Emitter: to ground.') },
        { n: 'B', d: B('בסיס (base): לפין של ה-Pico, דרך נגד של 1kΩ.', 'Base: to the Pico pin, through a 1 kΩ resistor.') },
        { n: 'C', d: B('קולט (collector): למינוס של העומס.', 'Collector: to the load\'s minus.') }
      ],
      how: [
        B('כשהפין ב-1, זורם לבסיס זרם של כ-2.6 מיליאמפר, והטרנזיסטור נפתח: העומס מקבל חשמל. כשהפין ב-0, הטרנזיסטור נסגר, והעומס כבוי.', 'When the pin is 1, about 2.6 milliamps flow into the base, and the transistor opens: the load gets power. When the pin is 0, the transistor closes, and the load is off.'),
        B('עם PWM הטרנזיסטור נפתח ונסגר מהר, וכך שולטים בעוצמה של עומס, כמו בלד.', 'With PWM the transistor opens and closes fast, which controls the strength of a load, as with an LED.')
      ],
      needs: [B('טרנזיסטור 2N2222 או PN2222', 'A 2N2222 or PN2222 transistor'), B('נגד 1kΩ', 'A 1 kΩ resistor'), B('עומס של 5V: כמה לדים עם נגדים, מאוורר קטן או זמזם פעיל', 'A 5 V load: a few LEDs with resistors, a small fan or an active buzzer'), B('חוטי גישור', 'Jumper wires')],
      wiring: [W(B('B, דרך נגד 1kΩ', 'B, through a 1 kΩ resistor'), 'GP15', 20), W('E', 'GND', 18), W(B('פלוס של העומס', 'The load\'s plus'), 'VBUS', 40, B('5V. המינוס של העומס מתחבר ל-C', '5 V. The load\'s minus goes to C'))],
      steps: [UNPLUG,
        B('הכניסו את הטרנזיסטור כך שכל רגל בטור נפרד, עם הצד השטוח אליכם.', 'Push the transistor in with each leg in its own column, flat side towards you.'),
        B('חברו נגד של 1kΩ מ-GP15 לרגל B, וחוט מרגל E לאדמה.', 'Wire a 1 kΩ resistor from GP15 to leg B, and a wire from leg E to ground.'),
        B('חברו את הפלוס של העומס ל-VBUS, ואת המינוס שלו לרגל C.', 'Connect the load\'s plus to VBUS, and its minus to leg C.'),
        B('אם העומס הוא מנוע או ממסר, הוסיפו דיודה במקביל אליו, הפס לכיוון הפלוס. ראו את העמוד של הדיודה.', 'If the load is a motor or a relay, add a diode across it, stripe towards the plus. See the diode\'s page.'),
        CHECK],
      code: ['from machine import Pin, PWM', 'from time import sleep', '', 'load = PWM(Pin(15), freq=1000)       # through 1 kΩ to the base', '',
        'while True:', '    for level in range(0, 65536, 2048):', '        load.duty_u16(level)', '        sleep(0.05)', '    for level in range(65535, -1, -2048):', '        load.duty_u16(level)', '        sleep(0.05)'],
      explain: [
        E([4], 'פין PWM רגיל. מבחינת הקוד, הטרנזיסטור הוא לד: מה שמשתנה הוא רק כמה זרם עובר בעומס.', 'An ordinary PWM pin. From the code\'s point of view the transistor is an LED: what changes is only how much current passes through the load.'),
        E([7, 12], 'מעלים את העוצמה בהדרגה ואחר כך מורידים, שוב ושוב.', 'Raise the strength step by step and then lower it, again and again.')
      ],
      expect: B('העומס מתחזק ונחלש לאט, שוב ושוב: הלדים מתבהרים ומתעמעמים, או המאוורר מאיץ ומאט.', 'The load slowly grows stronger and weaker, again and again: the LEDs brighten and dim, or the fan speeds up and slows down.'),
      mistakes: [
        B('העומס לא נדלק: הטרנזיסטור מחובר הפוך. בדקו את סדר הרגליים בדף הנתונים של הדגם שבידכם.', 'The load does not come on: the transistor is the wrong way round. Check the leg order in the datasheet of your model.'),
        B('העומס דולק כל הזמן: הקולט והפולט הוחלפו, או שהבסיס מחובר ישר ל-3.3V.', 'The load is on all the time: the collector and emitter are swapped, or the base is wired straight to 3.3 V.'),
        B('הטרנזיסטור מתחמם מאוד: העומס צורך יותר מדי זרם. השתמשו במודול MOSFET.', 'The transistor gets very hot: the load draws too much current. Use a MOSFET module.')
      ],
      ideas: [B('מאוורר קטן שנדלק כשחם, עם מד הטמפרטורה DS18B20.', 'A small fan that switches on when it is hot, with the DS18B20 thermometer.'), B('פס לדים קצר של 5V בעמעום.', 'A short 5 V LED strip with dimming.'), B('זמזם חזק שמופעל מפין.', 'A loud buzzer driven from a pin.')]
    },
    /* ============================================================ 1N4007 */
    {
      id: 'diode', name: B('דיודה 1N4007', '1N4007 diode'), iface: ['gpio'], cat: 'basic', volt: '—',
      summary: B('רכיב שמעביר זרם רק בכיוון אחד. שומר על הטרנזיסטור מקפיצת המתח של מנוע או ממסר.', 'A part that passes current one way only. Protects the transistor from the voltage spike of a motor or relay.'),
      what: [
        B('[[diode|דיודה]] היא שסתום חד-כיווני לזרם. בכיוון אחד היא מעבירה, ובכיוון השני היא חוסמת.', 'A [[diode|diode]] is a one-way valve for current. One way it passes, the other way it blocks.'),
        B('השימוש הנפוץ ליד מיקרו-בקר הוא "דיודת הגנה": סליל של מנוע או ממסר יוצר קפיצת מתח הפוכה ברגע שמנתקים אותו. דיודה במקביל לסליל נותנת לקפיצה מסלול סגור, והטרנזיסטור לא נפגע.', 'The common use next to a microcontroller is a "flyback diode": the coil of a motor or relay makes a reverse voltage spike the moment it is switched off. A diode across the coil gives the spike a closed path, and the transistor is not harmed.')
      ],
      looks: B('גליל שחור קטן עם רגל בכל קצה, ופס כסוף ליד אחד הקצוות. הפס מסמן את הקתודה.', 'A small black cylinder with a leg at each end, and a silver band near one end. The band marks the cathode.'),
      pins: [
        { n: B('אנודה', 'Anode'), d: B('הצד בלי הפס. הזרם נכנס ממנו.', 'The side without the band. Current enters here.') },
        { n: B('קתודה (הפס)', 'Cathode (the band)'), d: B('הצד עם הפס. הזרם יוצא ממנו.', 'The side with the band. Current leaves here.') }
      ],
      how: [
        B('בכיוון ההולכה יורדים על הדיודה כ-0.7V. בכיוון ההפוך היא חוסמת, עד מתח גבוה מאוד (1000V ב-1N4007).', 'In the forward direction about 0.7 V drops across the diode. In reverse it blocks, up to a very high voltage (1000 V for the 1N4007).'),
        B('בזמן שהמנוע פועל, הדיודה מחוברת הפוך ולא מעבירה כלום. רק ברגע הניתוק, כשהסליל הופך את המתח, היא מעבירה ומרסנת את הקפיצה.', 'While the motor runs, the diode is reverse-biased and passes nothing. Only at the moment of switching off, when the coil reverses the voltage, does it conduct and absorb the spike.')
      ],
      needs: [B('דיודה 1N4007', 'A 1N4007 diode'), B('טרנזיסטור 2N2222 ונגד 1kΩ', 'A 2N2222 transistor and a 1 kΩ resistor'), B('מנוע DC קטן של 5V', 'A small 5 V DC motor'), B('חוטי גישור', 'Jumper wires')],
      wiring: [W(B('בסיס הטרנזיסטור, דרך 1kΩ', 'The transistor\'s base, through 1 kΩ'), 'GP15', 20), W(B('פולט הטרנזיסטור', 'The transistor\'s emitter'), 'GND', 18), W(B('פלוס המנוע וקתודת הדיודה (הפס)', 'The motor\'s plus and the diode\'s cathode (band)'), 'VBUS', 40, B('5V', '5 V'))],
      steps: [UNPLUG,
        B('בנו את מעגל הטרנזיסטור מהעמוד של 2N2222, עם מנוע קטן בתור העומס.', 'Build the transistor circuit from the 2N2222\'s page, with a small motor as the load.'),
        B('הכניסו את הדיודה במקביל למנוע: הקתודה (הפס) בטור של הפלוס של המנוע, והאנודה בטור של המינוס שלו, שמחובר לקולט.', 'Put the diode across the motor: the cathode (band) in the column of the motor\'s plus, and the anode in the column of its minus, which goes to the collector.'),
        B('בדקו פעמיים את כיוון הדיודה. הפוכה, היא יוצרת קצר בין VBUS לקולט ברגע שהטרנזיסטור נפתח.', 'Check the diode\'s direction twice. Reversed, it makes a short between VBUS and the collector the moment the transistor opens.'),
        CHECK],
      code: ['from machine import Pin', 'from time import sleep', '', 'motor = Pin(15, Pin.OUT)      # through 1 kΩ to the transistor\'s base', '',
        'while True:', '    motor.on()', '    sleep(2)', '    motor.off()               # here the coil makes a reverse spike: the diode absorbs it', '    sleep(2)'],
      explain: [
        E([7, 8], 'הטרנזיסטור נפתח והמנוע מסתובב. הדיודה מחוברת הפוך ולא מעבירה כלום.', 'The transistor opens and the motor turns. The diode is reverse-biased and passes nothing.'),
        E([9], 'ברגע הניתוק הסליל של המנוע מנסה להמשיך את הזרם, והמתח שלו מתהפך. עכשיו הדיודה מעבירה, והזרם מסתובב דרכה ודרך המנוע עד שהוא נגמר.', 'At the moment of switching off the motor\'s coil tries to keep the current flowing, and its voltage reverses. Now the diode conducts, and the current circles through it and the motor until it dies away.')
      ],
      expect: B('המנוע מסתובב שתי שניות ונעצר לשתי שניות, שוב ושוב, והטרנזיסטור נשאר קר. בלי הדיודה המעגל עלול לעבוד זמן מה, עד שהטרנזיסטור נפגע.', 'The motor turns for two seconds and stops for two, again and again, and the transistor stays cool. Without the diode the circuit may work for a while, until the transistor is damaged.'),
      mistakes: [
        B('ה-Pico מתאפס ברגע שהטרנזיסטור נפתח: הדיודה הפוכה ויוצרת קצר. נתקו מיד והפכו אותה.', 'The Pico resets the moment the transistor opens: the diode is reversed and makes a short. Unplug at once and turn it round.'),
        B('המנוע לא מסתובב, אבל הדיודה מתחממת: אותה בעיה, דיודה הפוכה.', 'The motor does not turn, but the diode gets warm: the same problem, a reversed diode.'),
        B('ממסר על מודול לא צריך דיודה נוספת: היא כבר מורכבת על הלוח.', 'A relay on a module needs no extra diode: it is already fitted on the board.')
      ],
      ideas: [B('הגנה על כל מעגל עם סליל: ממסר בודד, סולנואיד או מנוע.', 'Protection for any circuit with a coil: a bare relay, a solenoid or a motor.'), B('הגנה מחיבור הפוך של סוללה: דיודה בטור עם הפלוס.', 'Protection from a battery wired backwards: a diode in series with the plus.')]
    }
  );

  /* more mistakes and ideas for four thin entries of part 4 */
  function more(id, mistakes, ideas) {
    var comp = P.componentById(id);
    if (!comp) return;
    comp.mistakes = (comp.mistakes || []).concat(mistakes);
    comp.ideas = (comp.ideas || []).concat(ideas);
  }
  more('tilt',
    [B('הקריאה קופצת בין 0 ל-1 כשמזיזים: הכדור שבתוך המתג מקפץ. קבלו החלטה רק אחרי שהערך יציב 100 אלפיות שנייה.', 'The reading jumps between 0 and 1 when moved: the ball inside the switch bounces. Decide only after the value has been steady for 100 milliseconds.'),
      B('המתג מגיב רק בזווית גדולה: כך הוא בנוי. למדידת זווית מדויקת השתמשו ב-MPU6050.', 'The switch responds only at a large angle: that is how it is built. For a precise angle use the MPU6050.')],
    [B('קופסה שמצפצפת כשמזיזים אותה.', 'A box that beeps when moved.')]);
  more('hall',
    [B('אין תגובה לאף מגנט: חלק מהחיישנים מגיבים רק לקוטב אחד. הפכו את המגנט.', 'No response to any magnet: some sensors respond to one pole only. Turn the magnet over.'),
      B('הוא מגיב רק כשהמגנט צמוד: מגנט חלש מדי. מגנט ניאודימיום קטן עובד ממרחק של כמה מילימטרים.', 'It responds only when the magnet touches: the magnet is too weak. A small neodymium magnet works from a few millimetres.')],
    [B('מד סיבובים לגלגל: מגנט על הגלגל, וספירת פסיקות.', 'A wheel revolution counter: a magnet on the wheel, and counting interrupts.')]);
  more('touch',
    [B('הוא נדלק לבד כשמחברים: החיישן מכייל את עצמו בהדלקה. אל תגעו בו בשניות הראשונות.', 'It switches on by itself when plugged in: the sensor calibrates itself at power-up. Do not touch it in the first seconds.'),
      B('הוא עובד דרך פלסטיק דק, אבל לא דרך עבה. בדקו את עובי הקופסה.', 'It works through thin plastic, but not through thick. Check the thickness of the box.')],
    [B('מתג נסתר מתחת למכסה של קופסה.', 'A hidden switch under the lid of a box.')]);
  more('mq2',
    [B('הקריאות לא יציבות בדקות הראשונות: החיישן צריך להתחמם. חכו כמה דקות לפני שמחליטים.', 'The readings are unsteady in the first minutes: the sensor needs to warm up. Wait a few minutes before deciding.'),
      B('החיישן חם מאוד למגע: זה רגיל. יש בו גוף חימום קטן.', 'The sensor is very hot to the touch: that is normal. It contains a small heater.')],
    [B('מד איכות אוויר שמציג את הקריאה על מסך OLED.', 'An air quality meter that shows the reading on an OLED.')]);
})(window.PICO);
