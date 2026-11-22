/* Basics: eight short chapters for a reader with no background at all.
   Block types: p, h, ul, ol, tip, fig (+cap), demo, code (+explain), table. */
(function (P) {
  'use strict';

  P.basics = [
    /* ------------------------------------------------------------ 1 */
    {
      id: 'microcontroller',
      title: { he: 'מה זה מיקרו-בקר', en: 'What a microcontroller is' },
      lead: { he: 'ה-Pico 2 הוא מחשב, אבל לא כמו המחשב שעל השולחן שלכם.', en: 'The Pico 2 is a computer, but not like the one on your desk.' },
      blocks: [
        { p: { he: '[[mcu|מיקרו-בקר]] הוא מחשב זעיר. אין לו מסך, מקלדת או עכבר, ובמקומם יש לו [[pin|פינים]]: רגלי מתכת שאליהן מחברים נוריות, כפתורים, חיישנים ומנועים.', en: 'A [[mcu|microcontroller]] is a tiny computer. It has no screen, keyboard or mouse. Instead it has [[pin|pins]]: metal legs to which you connect lights, buttons, sensors and motors.' } },
        { p: { he: 'הוא עושה דבר אחד: מריץ [[program|תוכנית]] אחת שכתבתם, שוב ושוב, כל עוד הוא מחובר לחשמל. מיקרו-בקרים נמצאים כמעט בכל מכשיר בבית: במכונת הכביסה, בשלט של הטלוויזיה, במיקרוגל ובצעצועים.', en: 'It does one thing: it runs a single [[program|program]] that you wrote, over and over, for as long as it has power. Microcontrollers are inside almost every device at home: the washing machine, the TV remote, the microwave and toys.' } },
        { h: { he: 'כל פרויקט בנוי משלושה חלקים', en: 'Every project is made of three parts' } },
        { fig: 'ipo' },
        { ul: [
          { he: 'קלט: רכיבים שמדווחים ל-Pico מה קורה בעולם. כפתור אומר "נלחצתי", ו[[sensor|חיישן]] אור אומר "חשוך כאן".', en: 'Input: parts that tell the Pico what is happening in the world. A button says "I was pressed", and a light [[sensor|sensor]] says "it is dark here".' },
          { he: 'עיבוד: התוכנית שלכם. היא קוראת את הקלט ומחליטה מה לעשות.', en: 'Processing: your program. It reads the input and decides what to do.' },
          { he: 'פלט: רכיבים שמבצעים פעולה: לד נדלק, באזר מצפצף, מנוע מסתובב ומסך מציג טקסט.', en: 'Output: parts that do something. An LED lights up, a buzzer beeps, a motor turns, a display shows text.' }
        ] },
        { p: { he: 'לדוגמה, מנורת לילה אוטומטית: חיישן האור הוא הקלט, והתוכנית בודקת "האם חשוך?". אם כן, היא מדליקה לד, שהוא הפלט. כל פרויקט שתבנו, פשוט או מורכב, משלב את שלושת החלקים האלה.', en: 'An example: an automatic night light. The light sensor is the input. The program checks "is it dark?". If so, it switches on an LED, which is the output. Every project you build, simple or complex, is a combination of these three parts.' } },
        { h: { he: 'מה יש על הלוח', en: 'What is on the board' } },
        { ul: [
          { he: 'השבב השחור שבמרכז, RP2350. זה המיקרו-בקר עצמו, ה"מוח".', en: 'The black chip in the middle, the RP2350. This is the microcontroller itself, the "brain".' },
          { he: 'שקע [[usb|USB]] בקצה הלוח. דרכו הלוח מקבל חשמל ומתקשר עם המחשב.', en: 'A [[usb|USB]] socket at the end. Through it the board gets power and talks to the computer.' },
          { he: 'כפתור לבן קטן בשם [[bootsel|BOOTSEL]]. משתמשים בו רק פעם אחת, כאשר מתקינים את התוכנה הבסיסית.', en: 'A small white button named [[bootsel|BOOTSEL]]. You use it once, when installing the basic software.' },
          { he: '[[led|לד]] ירוק קטן. התוכנית יכולה להדליק אותו בלי שתחברו שום דבר.', en: 'A small green [[led|LED]]. Your program can light it without connecting anything.' },
          { he: '40 פינים לאורך שני הצדדים, שאליהם מחברים את כל השאר.', en: '40 pins along the two sides. Everything else connects to these.' }
        ] },
        { tip: { he: 'אל תתבלבלו: יש גם מחשב בשם Raspberry Pi (בלי המילה Pico), שהוא מחשב מלא עם מערכת הפעלה, מסך ומקלדת. ה-Pico הוא משהו אחר: קטן, זול ופשוט ממנו בהרבה.', en: 'Do not confuse the two: there is also a computer called Raspberry Pi (without the word Pico). That is a full computer with an operating system, screen and keyboard. The Pico is something else: much smaller, cheaper and simpler.' } }
      ],
      quiz: [
        {
          q: { he: 'במנורת לילה אוטומטית, מהו הקלט?', en: 'In an automatic night light, what is the input?' },
          a: [{ he: 'הלד', en: 'The LED' }, { he: 'חיישן האור', en: 'The light sensor' }, { he: 'כבל ה-USB', en: 'The USB cable' }],
          ok: 1,
          why: { he: 'חיישן האור הוא הרכיב שמספר ל-Pico מה קורה בעולם, והלד הוא הפלט.', en: 'The light sensor is what tells the Pico what is happening in the world. The LED is the output.' }
        },
        {
          q: { he: 'מה מיקרו-בקר עושה כל הזמן שיש לו חשמל?', en: 'What does a microcontroller do the whole time it has power?' },
          a: [{ he: 'מחכה לפקודות מהמקלדת', en: 'Waits for keyboard commands' }, { he: 'מריץ את התוכנית שלו שוב ושוב', en: 'Runs its program over and over' }, { he: 'מתחבר לאינטרנט', en: 'Connects to the internet' }],
          ok: 1,
          why: { he: 'אין לו מקלדת ואין לו מערכת הפעלה. יש לו תוכנית אחת, והיא רצה בלולאה.', en: 'It has no keyboard and no operating system. It has one program, and that runs in a loop.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 2 */
    {
      id: 'electricity',
      title: { he: 'חשמל בחמש דקות', en: 'Electricity in five minutes' },
      lead: { he: 'שלושה מושגים ודימוי אחד של מים: זה כל מה שצריך כדי לחבר רכיבים בביטחון.', en: 'Three ideas, one picture of water, and that is all you need to connect parts with confidence.' },
      blocks: [
        { p: { he: 'חשמל בחוט מתנהג בערך כמו מים בצינור. הדימוי הזה לא מושלם, אבל הוא מספיק טוב לכל מה שנעשה כאן.', en: 'Electricity in a wire behaves roughly like water in a pipe. The picture is not perfect, but it is good enough for everything we do here.' } },
        { fig: 'water' },
        { ul: [
          { he: '[[voltage|מתח]] הוא הלחץ שדוחף את המים: ככל שהמכל גבוה יותר, הוא דוחף חזק יותר. המתח נמדד בוולט (V), וה-Pico עובד ב-3.3V.', en: '[[voltage|Voltage]] is the pressure pushing the water. A higher tank pushes harder. Measured in volts (V). The Pico works at 3.3 V.' },
          { he: '[[current|זרם]] הוא כמות המים שזורמת בצינור. הזרם נמדד באמפר (A), ואצלנו כמעט תמיד באלפיות אמפר, [[ma|mA]].', en: '[[current|Current]] is how much water flows through the pipe. Measured in amps (A), and here almost always in thousandths of an amp, [[ma|mA]].' },
          { he: '[[resistance|התנגדות]] היא קטע צר בצינור שמאט את הזרימה. היא נמדדת באוהם, [[ohm|Ω]]. ככל שההתנגדות גדולה יותר, הזרם קטן יותר.', en: '[[resistance|Resistance]] is a narrow section of pipe that slows the flow. Measured in ohms, [[ohm|Ω]]. More resistance, less current.' }
        ] },
        { h: { he: 'מעגל חייב להיות סגור', en: 'A circuit must be closed' } },
        { p: { he: 'מים זורמים רק אם יש להם לאן ללכת, וכך גם חשמל: הוא זורם רק במסלול סגור, שנקרא [[circuit|מעגל]]. הוא יוצא מנקודה שיש בה מתח, עובר דרך הרכיב וחוזר ל[[ground|אדמה]], שהיא נקודת האפס.', en: 'Water only flows if it has somewhere to go. So does electricity: it only flows round a closed path, called a [[circuit|circuit]]. It leaves a point that has voltage, passes through the part, and returns to [[ground|ground]], which is the zero point.' } },
        { fig: 'circuit' },
        { p: { he: 'לכן לכל רכיב יש לפחות שני חיבורים: אחד שדרכו הזרם נכנס, ואחד שדרכו הוא חוזר לאדמה. אם אחד מהם חסר או רופף, המעגל פתוח ושום דבר לא קורה. זו הסיבה הנפוצה ביותר לכך שמשהו "לא עובד".', en: 'That is why every part has at least two connections: one where current enters, and one where it returns to ground. If either is missing or loose, the circuit is open and nothing happens. This is the most common reason something "does not work".' } },
        { h: { he: 'המספרים שתפגשו', en: 'The numbers you will meet' } },
        { table: {
          head: [{ he: 'מה', en: 'What' }, { he: 'מה זה אומר', en: 'What it means' }],
          rows: [
            [{ he: '`3.3V`', en: '`3.3V`' }, { he: 'המתח שבפינים של ה-Pico. כאשר פין "דולק", יש עליו 3.3V.', en: 'The voltage of the Pico\'s pins. When a pin is "on", it carries 3.3 V.' }],
            [{ he: '`5V`', en: '`5V`' }, { he: 'המתח שמגיע דרך כבל ה-USB. חלק מהרכיבים זקוקים לו.', en: 'The voltage that arrives over the USB cable. Some parts need it.' }],
            [{ he: '`GND`', en: '`GND`' }, { he: 'אדמה, 0V. לשם חוזר כל הזרם.', en: 'Ground, 0 V. All current returns there.' }],
            [{ he: '`20mA`', en: '`20mA`' }, { he: 'זרם קטן, בערך מה שלד צורך.', en: 'A small current. About what an LED uses.' }],
            [{ he: '`330Ω`', en: '`330Ω`' }, { he: 'ערך של נגד קטן, כזה ששמים ליד לד.', en: 'The value of a small resistor, the kind placed next to an LED.' }]
          ]
        } },
        { h: { he: 'למה לד צריך נגד', en: 'Why an LED needs a resistor' } },
        { p: { he: '[[led|לד]] כמעט לא מתנגד לזרם. אם מחברים אותו ישירות בין 3.3V לאדמה, עובר בו יותר זרם ממה שהוא או הפין יכולים לשאת, ואחד מהם נשרף. [[resistor|נגד]] הוא הקטע הצר בצינור: הוא מגביל את הזרם לכמות בטוחה. לכן לד תמיד בא יחד עם נגד.', en: 'An [[led|LED]] barely resists current. Connected straight between 3.3 V and ground, more current flows than it or the pin can bear, and one of them burns out. A [[resistor|resistor]] is the narrow section of pipe: it limits the current to a safe amount. That is why an LED always comes with a resistor.' } },
        { h: { he: 'קצר', en: 'A short circuit' } },
        { p: { he: '[[short|קצר]] הוא חיבור ישיר בין מתח לאדמה, בלי שום רכיב באמצע. זה כמו לפתוח את תחתית המכל: כל המים נשפכים בבת אחת. עובר זרם גדול מאוד, משהו מתחמם, והלוח עלול להינזק. לכן מחווטים רק כאשר כבל ה-USB מנותק, ובודקים את החיבורים לפני שמחברים אותו.', en: 'A [[short|short circuit]] is a direct connection between power and ground, with no part in between. It is like opening the bottom of the tank: all the water pours out at once. A very large current flows, something heats up, and the board can be damaged. That is why you wire only with the USB cable unplugged, and check the connections before plugging it in.' } },
        { tip: { he: 'המתחים כאן, 3.3V ו-5V, נמוכים מאוד ואינם מסוכנים לאדם. טעות יכולה לפגוע בלוח וברכיבים, לא בכם.', en: 'The voltages here, 3.3 V and 5 V, are very low and not dangerous to a person. What a mistake can hurt is the board and the parts, not you.' } }
      ],
      quiz: [
        {
          q: { he: 'חיברתם לד והוא לא נדלק. מה הדבר הראשון שבודקים?', en: 'You connected an LED and it does not light. What do you check first?' },
          a: [{ he: 'שהמעגל סגור: יש חיבור גם לפין וגם לאדמה', en: 'That the circuit is closed: connected to both the pin and ground' }, { he: 'שהמחשב מחובר לאינטרנט', en: 'That the computer is online' }, { he: 'שהלד בצבע הנכון', en: 'That the LED is the right colour' }],
          ok: 0,
          why: { he: 'זרם זורם רק במסלול סגור, וחיבור חסר או רופף לאדמה הוא הסיבה הנפוצה ביותר לתקלה.', en: 'Current only flows round a closed path. A missing or loose ground connection is the most common cause.' }
        },
        {
          q: { he: 'מה נגד עושה?', en: 'What does a resistor do?' },
          a: [{ he: 'מגביר את המתח', en: 'Raises the voltage' }, { he: 'מגביל את הזרם', en: 'Limits the current' }, { he: 'אוגר חשמל לשימוש מאוחר יותר', en: 'Stores electricity for later' }],
          ok: 1,
          why: { he: 'נגד הוא "הקטע הצר בצינור": הוא מקטין את הזרם לכמות שהרכיבים יכולים לשאת.', en: 'A resistor is "the narrow section of pipe". It reduces the current to an amount the parts can bear.' }
        },
        {
          q: { he: 'מהו קצר?', en: 'What is a short circuit?' },
          a: [{ he: 'חוט קצר במיוחד', en: 'An especially short wire' }, { he: 'חיבור ישיר בין מתח לאדמה בלי רכיב באמצע', en: 'A direct link between power and ground with no part in between' }, { he: 'תוכנית עם מעט שורות', en: 'A program with few lines' }],
          ok: 1,
          why: { he: 'כשאין רכיב שמגביל את הזרם, עובר זרם גדול מאוד שעלול להרוס את הלוח.', en: 'With nothing to limit it, a very large current flows that can destroy the board.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 3 */
    {
      id: 'digital-analog',
      title: { he: 'דיגיטלי ואנלוגי', en: 'Digital and analog' },
      lead: { he: 'שני סוגים של אותות, וכל רכיב שתחברו שייך לאחד מהם.', en: 'Two kinds of signal. Every part you connect belongs to one of them.' },
      blocks: [
        { fig: 'da' },
        { p: { he: '[[signal|אות]] [[digital|דיגיטלי]] מכיר רק שני מצבים: 0 או 1. על החוט זה נראה כך: 0V הוא 0, ו-3.3V הוא 1, ואין שום דבר באמצע. זה כמו מתג אור: דולק או כבוי.', en: 'A [[digital|digital]] [[signal|signal]] knows only two states: 0 or 1. On the wire it looks like this: 0 V is 0, and 3.3 V is 1. There is nothing in between. Like a light switch: on or off.' } },
        { p: { he: 'אות [[analog|אנלוגי]] יכול לקבל כל ערך בטווח: 0.4V, 1.27V, 3.1V. זה כמו עמעם אור שאפשר לסובב לכל מצב.', en: 'An [[analog|analog]] signal can be any value in a range: 0.4 V, 1.27 V, 3.1 V. Like a dimmer that can be turned to any position.' } },
        { table: {
          head: [{ he: 'דיגיטלי: כן או לא', en: 'Digital: yes or no' }, { he: 'אנלוגי: כמה', en: 'Analog: how much' }],
          rows: [
            [{ he: 'כפתור: לחוץ או לא', en: 'A button: pressed or not' }, { he: 'כפתור סיבוב: כמה סובבו אותו', en: 'A knob: how far it was turned' }],
            [{ he: 'חיישן תנועה: יש תנועה או אין', en: 'A motion sensor: motion or none' }, { he: 'חיישן אור: כמה אור יש', en: 'A light sensor: how much light there is' }],
            [{ he: 'לד: דולק או כבוי', en: 'An LED: on or off' }, { he: 'לד מעומעם: כמה חזק הוא מאיר', en: 'A dimmed LED: how brightly it shines' }]
          ]
        } },
        { h: { he: 'מה ה-Pico יודע לעשות עם כל סוג', en: 'What the Pico can do with each kind' } },
        { ul: [
          { he: 'לקרוא ולהוציא אות דיגיטלי: זה מה שכל פין רגיל עושה, וזה נקרא [[gpio|GPIO]].', en: 'Read and send digital: this is what every ordinary pin does. It is called [[gpio|GPIO]].' },
          { he: 'לקרוא אות אנלוגי: שלושה פינים מיוחדים יודעים למדוד כמה מתח יש עליהם. זה נקרא [[adc|ADC]].', en: 'Read analog: three special pins can measure how much voltage is on them. This is called [[adc|ADC]].' },
          { he: 'להוציא אות "כמעט אנלוגי": ה-Pico לא יכול להוציא 1.5V, אבל הוא יכול להדליק ולכבות פין כל כך מהר שזה נראה כמו עוצמה חלקית. זה נקרא [[pwm|PWM]].', en: 'Send "almost analog": the Pico cannot output 1.5 V, but it can switch a pin on and off so fast that it looks like a partial level. This is called [[pwm|PWM]].' }
        ] },
        { tip: { he: 'לפני שמחברים רכיב חדש, שאלו: האם הוא עונה "כן או לא", או "כמה"? התשובה תגיד לכם לאיזה סוג של פין לחבר אותו.', en: 'Before connecting a new part, ask: does it answer "yes or no", or "how much"? The answer tells you which kind of pin to connect it to.' } }
      ],
      quiz: [
        {
          q: { he: 'חיישן מודד טמפרטורה ומוציא מתח שמשתנה בהתאם לה. איזה סוג אות זה?', en: 'A sensor measures temperature and outputs a voltage that changes with it. What kind of signal is that?' },
          a: [{ he: 'דיגיטלי', en: 'Digital' }, { he: 'אנלוגי', en: 'Analog' }],
          ok: 1,
          why: { he: 'המתח יכול לקבל כל ערך בטווח, לא רק 0 או 1, ולכן צריך פין ADC כדי לקרוא אותו.', en: 'The voltage can be any value in a range, not just 0 or 1. An ADC pin is needed to read it.' }
        },
        {
          q: { he: 'כמה מתח יש על פין דיגיטלי שערכו 1?', en: 'How much voltage is on a digital pin whose value is 1?' },
          a: [{ he: '1V', en: '1 V' }, { he: '3.3V', en: '3.3 V' }, { he: '5V', en: '5 V' }],
          ok: 1,
          why: { he: 'ב-Pico, הערך 1 הוא 3.3V והערך 0 הוא 0V.', en: 'On the Pico, the value 1 is 3.3 V and the value 0 is 0 V.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 4 */
    {
      id: 'breadboard',
      title: { he: 'המטריצה', en: 'The breadboard' },
      lead: { he: 'הלוח שעליו בונים הכול. ברגע שמבינים אילו חורים מחוברים זה לזה, כל השאר קל.', en: 'The board everything is built on. Once you know which holes are connected, the rest is easy.' },
      blocks: [
        { p: { he: '[[breadboard|מטריצה]] (באנגלית breadboard) היא לוח פלסטיק מלא חורים. בתוך הלוח יש פסי מתכת שמחברים קבוצות של חורים. כאשר מכניסים רגל של רכיב לחור, היא מתחברת לכל מה שנמצא בחורים האחרים של אותה קבוצה. כך בונים מעגל בלי הלחמה, ואפשר לשלוף רכיבים ולנסות שוב.', en: 'A [[breadboard|breadboard]] is a plastic board full of holes. Inside it are metal strips that join groups of holes. Push a part\'s leg into a hole and it is connected to whatever sits in the other holes of that group. This is how you build a circuit with no soldering, and you can pull things out and try again.' } },
        { p: { he: 'העבירו את העכבר מעל חור, או הקישו עליו, כדי לראות אילו חורים מחוברים אליו.', en: 'Move the mouse over a hole, or tap it, to see which holes are connected to it.' } },
        { demo: 'breadboard' },
        { h: { he: 'שלושת הכללים', en: 'The three rules' } },
        { ul: [
          { he: 'באזור המרכזי, כל חמשת החורים שבאותו טור מחוברים ביניהם. טור הוא הכיוון הקצר, מלמעלה למטה.', en: 'In the central area, every five holes in the same column are connected. A column is the short direction, top to bottom.' },
          { he: 'התעלה שבאמצע מפרידה: חמשת החורים שמעליה אינם מחוברים לחמשת החורים שמתחתיה.', en: 'The channel down the middle separates. The five holes above it are not connected to the five holes below it.' },
          { he: 'בשוליים יש פסי מתח, ובהם החורים מחוברים לאורך כל הלוח. חברו פס אחד ל-3.3V ופס אחד לאדמה, וקחו משם מתח לכל רכיב.', en: 'Along the edges are power rails. There the holes are connected along the whole length of the board. Connect one rail to 3.3 V and one to ground, and take power from there for every part.' }
        ] },
        { h: { he: 'איך משתמשים בזה', en: 'How to use it' } },
        { ul: [
          { he: 'רוצים לחבר שתי רגליים? הכניסו אותן לאותו טור.', en: 'Want two legs connected? Push them into the same column.' },
          { he: 'לא רוצים שהן יהיו מחוברות? הכניסו אותן לטורים שונים.', en: 'Do not want them connected? Push them into different columns.' },
          { he: 'צריכים לחבר שני טורים רחוקים? השתמשו ב[[jumper|חוט גישור]].', en: 'Need to join two distant columns? Use a [[jumper|jumper wire]].' }
        ] },
        { tip: { he: 'הטעות הנפוצה ביותר היא להכניס את שתי הרגליים של אותו רכיב לאותו טור. אז שתי הרגליים מחוברות זו לזו דרך המטריצה, והזרם "מדלג" על הרכיב. לכל רגל של רכיב צריך טור משלה.', en: 'The most common mistake: pushing both legs of the same part into the same column. Then the two legs are joined through the breadboard and the current "skips" the part. Each leg of a part needs a column of its own.' } },
        { fig: 'samecol' },
        { p: { he: 'ה-Pico עצמו יושב מעל התעלה, עם שורת פינים אחת בכל צד שלה. כך לכל פין יש טור משלו עם חורים פנויים לידו, ואליהם מחברים את החוטים.', en: 'The Pico itself sits across the channel, with one row of pins on each side of it. That way every pin has its own column with free holes beside it, and wires connect to those.' } }
      ],
      quiz: [
        {
          q: { he: 'הכנסתם את שתי הרגליים של לד לאותו טור. מה יקרה?', en: 'You pushed both legs of an LED into the same column. What happens?' },
          a: [{ he: 'הוא יאיר חזק במיוחד', en: 'It shines extra brightly' }, { he: 'הוא לא יאיר, כי שתי הרגליים מחוברות זו לזו', en: 'It does not light, because the two legs are joined together' }, { he: 'הוא יהבהב', en: 'It blinks' }],
          ok: 1,
          why: { he: 'חמשת החורים שבטור מחוברים זה לזה, ולכן הזרם עובר דרך המטריצה ולא דרך הלד.', en: 'The five holes in a column are connected. The current goes through the breadboard instead of through the LED.' }
        },
        {
          q: { he: 'האם חור בצד העליון של התעלה מחובר לחור שמולו בצד התחתון?', en: 'Is a hole above the channel connected to the hole opposite it below the channel?' },
          a: [{ he: 'כן', en: 'Yes' }, { he: 'לא', en: 'No' }],
          ok: 1,
          why: { he: 'התעלה מפרידה בין שני החצאים, וזה מה שמאפשר ל-Pico לשבת מעליה בלי ששני הצדדים שלו יתחברו זה לזה.', en: 'The channel separates the two halves. That is what lets the Pico sit across it without its two sides being joined.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 5 */
    {
      id: 'parts',
      title: { he: 'החלקים הבסיסיים', en: 'The basic parts' },
      lead: { he: 'חוט, נגד, לד ומודול: את אלה תפגשו בכל פרויקט.', en: 'Wire, resistor, LED and module. You will meet these in every project.' },
      blocks: [
        { h: { he: 'חוט גישור', en: 'Jumper wire' } },
        { p: { he: '[[jumper|חוט גישור]] הוא חוט קצר עם פין קשיח בכל קצה. מכניסים קצה אחד לחור אחד ואת הקצה השני לחור אחר, והם מחוברים. לצבע החוט אין משמעות חשמלית, אבל כדאי להתרגל לשיטה: אדום למתח, שחור לאדמה, ושאר הצבעים לאותות. זה חוסך הרבה טעויות.', en: 'A [[jumper|jumper wire]] is a short wire with a stiff pin at each end. Push one end into a hole and the other into another hole, and they are connected. The wire\'s colour makes no electrical difference, but it is a good habit: red for power, black for ground, other colours for signals. It prevents a lot of mistakes.' } },
        { h: { he: 'נגד', en: 'Resistor' } },
        { fig: 'resistor' },
        { p: { he: '[[resistor|נגד]] מגביל את ה[[current|זרם]]. יש לו שתי רגליים ואין לו כיוון, כך שאפשר לחבר אותו בשני הכיוונים. הערך שלו מסומן בפסי צבע. לא צריך לשנן את הקוד בעל פה, מספיק לזהות את הנגדים שמשתמשים בהם כאן:', en: 'A [[resistor|resistor]] limits [[current|current]]. It has two legs and no direction: it can be connected either way round. Its value is written in coloured bands. You need not memorise the code, just recognise the resistors used here:' } },
        { table: {
          head: [{ he: 'ערך', en: 'Value' }, { he: 'שלושת הפסים הראשונים', en: 'First three bands' }, { he: 'איפה משתמשים בו', en: 'Where it is used' }],
          rows: [
            [{ he: '`330Ω`', en: '`330Ω`' }, { he: 'כתום, כתום, חום', en: 'orange, orange, brown' }, { he: 'ליד לד', en: 'next to an LED' }],
            [{ he: '`1kΩ`', en: '`1kΩ`' }, { he: 'חום, שחור, אדום', en: 'brown, black, red' }, { he: 'מחלק מתח', en: 'voltage divider' }],
            [{ he: '`2kΩ`', en: '`2kΩ`' }, { he: 'אדום, שחור, אדום', en: 'red, black, red' }, { he: 'מחלק מתח', en: 'voltage divider' }],
            [{ he: '`4.7kΩ`', en: '`4.7kΩ`' }, { he: 'צהוב, סגול, אדום', en: 'yellow, violet, red' }, { he: 'חיישן הטמפרטורה DS18B20', en: 'the DS18B20 thermometer' }],
            [{ he: '`10kΩ`', en: '`10kΩ`' }, { he: 'חום, שחור, כתום', en: 'brown, black, orange' }, { he: 'חיישן אור', en: 'light sensor' }]
          ]
        } },
        { tip: { he: 'האות k פירושה אלף, כלומר 10kΩ הם 10,000 אוהם. אם אינכם בטוחים בצבעים, קראו את הכיתוב על האריזה שבה הגיע הנגד.', en: 'The letter k means a thousand. 10 kΩ is 10,000 ohms. If you are unsure of the colours, read the label on the packet the resistor came from.' } },
        { h: { he: 'לד', en: 'LED' } },
        { fig: 'led' },
        { p: { he: '[[led|לד]] הוא נורית קטנה. בניגוד לנגד, יש לו [[polarity|כיוון]]: הזרם עובר בו רק בכיוון אחד. הרגל הארוכה, ה[[anode|אנודה]], מתחברת לצד החיובי, והרגל הקצרה, הקתודה, מתחברת לאדמה. אם הלד לא נדלק, הפכו אותו. את הלד תמיד מחברים בטור עם נגד של 330Ω.', en: 'An [[led|LED]] is a small light. Unlike a resistor, it has a [[polarity|direction]]: current passes through it one way only. The long leg, the [[anode|anode]], goes to the positive side. The short leg, the cathode, goes to ground. If it does not light, turn it round. An LED is always connected with a 330 Ω resistor in line.' } },
        { h: { he: 'מודול', en: 'Module' } },
        { p: { he: 'רוב החיישנים והמסכים מגיעים כ[[module|מודול]]: לוח קטן שעליו נמצאים הרכיב עצמו וכל מה שהוא צריך, עם שורת פינים. ליד כל פין מודפס השם שלו. כמעט בכל מודול תמצאו את שלושת הפינים האלה:', en: 'Most sensors and displays come as a [[module|module]]: a small board carrying the part itself and everything it needs, with a row of pins. Next to each pin its name is printed. On almost every module you will find these three:' } },
        { ul: [
          { he: '[[vcc|VCC]]: כניסת המתח של המודול. חברו אותו ל-3.3V או ל-5V, לפי מה שהמודול דורש. לפעמים הוא מסומן VIN, VDD או +.', en: '[[vcc|VCC]]: the module\'s power input. Connect to 3.3 V or 5 V, whichever the module requires. Sometimes written VIN, VDD or +.' },
          { he: 'GND: [[ground|אדמה]]. תמיד מחברים אותו לפין GND של ה-Pico.', en: 'GND: [[ground|ground]]. Always connect to a GND pin on the Pico.' },
          { he: 'פין אות אחד או יותר: דרכם המודול מעביר מידע. לאן מחברים אותם תלוי בסוג המודול, וזה מה שמוסבר בעמוד של כל רכיב.', en: 'One or more signal pins: through these the module passes information. Where they connect depends on the kind of module, and that is what each part\'s page tells you.' }
        ] },
        { tip: { he: 'תמיד קראו את הכיתוב שעל המודול שבידכם. יצרנים שונים מסדרים את הפינים בסדר שונה, והאיור באתר מראה רק את הסדר הנפוץ.', en: 'Always read the printing on the module in your hand. Different makers arrange the pins in a different order, and the drawing on this site shows only the common one.' } }
      ],
      quiz: [
        {
          q: { he: 'איזו רגל של הלד מחברים לאדמה?', en: 'Which leg of the LED goes to ground?' },
          a: [{ he: 'הארוכה', en: 'The long one' }, { he: 'הקצרה', en: 'The short one' }, { he: 'לא משנה', en: 'It does not matter' }],
          ok: 1,
          why: { he: 'הרגל הקצרה היא הקתודה, והיא מתחברת לאדמה. הרגל הארוכה מתחברת לצד החיובי.', en: 'The short leg is the cathode and goes to ground. The long one goes to the positive side.' }
        },
        {
          q: { he: 'האם לנגד יש כיוון?', en: 'Does a resistor have a direction?' },
          a: [{ he: 'כן, כמו לד', en: 'Yes, like an LED' }, { he: 'לא, אפשר לחבר אותו בשני הכיוונים', en: 'No, it can be connected either way round' }],
          ok: 1,
          why: { he: 'נגד עובד אותו דבר בשני הכיוונים.', en: 'A resistor works the same in both directions.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 6 */
    {
      id: 'bits',
      title: { he: 'ביטים, בתים ומספרים שמתחילים ב-0x', en: 'Bits, bytes and numbers that start with 0x' },
      lead: { he: 'בהמשך תפגשו מספרים מוזרים כמו 0x3C ו-65535. כאן נסביר מאיפה הם מגיעים.', en: 'Later you will meet odd numbers such as 0x3C and 65535. Here is where they come from.' },
      blocks: [
        { p: { he: 'מחשב שומר הכול כאפסים ואחדות. ספרה אחת כזו נקראת [[bit|ביט]]. ביט אחד יכול לייצג רק שתי אפשרויות, ולכן כדי לייצג יותר מצרפים כמה ביטים יחד.', en: 'A computer stores everything as zeros and ones. One such digit is called a [[bit|bit]]. A single bit can represent only two possibilities. To represent more, several bits are joined.' } },
        { p: { he: 'שמונה ביטים יחד נקראים [[byte|בית]]. לכל ביט בבית יש "משקל": 128, 64, 32, 16, 8, 4, 2, 1. הערך של הבית הוא סכום המשקלים של הביטים שערכם 1.', en: 'Eight bits together are called a [[byte|byte]]. Each bit in a byte has a "weight": 128, 64, 32, 16, 8, 4, 2, 1. The value of the byte is the sum of the weights of the bits whose value is 1.' } },
        { fig: 'bits' },
        { p: { he: 'בית אחד יכול לייצג מספר בין 0 (כל הביטים 0) ל-255 (כל הביטים 1).', en: 'One byte can represent a number from 0 (all bits 0) to 255 (all bits 1).' } },
        { h: { he: 'למה 65535', en: 'Why 65535' } },
        { p: { he: 'עם 16 ביטים, המספר הגדול ביותר הוא 65535. לכן כאשר קוראים מתח או קובעים עוצמה ב-Pico, הערכים נעים בין 0 ל-65535: 0 הוא "כלום", 65535 הוא "הכול", ו-32768 הוא בערך חצי.', en: 'With 16 bits the largest number is 65535. That is why, when you read a voltage or set a level on the Pico, values run from 0 to 65535: 0 is "nothing", 65535 is "everything", and 32768 is about half.' } },
        { h: { he: 'מספרים שמתחילים ב-0x', en: 'Numbers that start with 0x' } },
        { p: { he: 'לכתוב 00111100 זה ארוך ומבלבל, ולכן משתמשים בכתיב מקוצר שנקרא [[hex|הקסדצימלי]], או hex. יש בו 16 ספרות: 0 עד 9, ואחריהן A, B, C, D, E, F, שערכן 10 עד 15. מספר hex תמיד מתחיל ב-`0x`, כדי שלא יתבלבלו בינו לבין מספר רגיל.', en: 'Writing 00111100 is long and confusing. So a short notation called [[hex|hexadecimal]], or hex, is used. It has 16 digits: 0 to 9, followed by A, B, C, D, E, F whose values are 10 to 15. A hex number always starts with `0x`, so it is not mistaken for an ordinary number.' } },
        { table: {
          head: [{ he: 'hex', en: 'hex' }, { he: 'מספר רגיל', en: 'Ordinary number' }],
          rows: [
            [{ he: '`0x0A`', en: '`0x0A`' }, { he: '10', en: '10' }],
            [{ he: '`0x10`', en: '`0x10`' }, { he: '16', en: '16' }],
            [{ he: '`0x3C`', en: '`0x3C`' }, { he: '60', en: '60' }],
            [{ he: '`0xFF`', en: '`0xFF`' }, { he: '255', en: '255' }]
          ]
        } },
        { p: { he: 'איפה תפגשו את זה? כל רכיב [[i2c|I2C]] מזוהה לפי [[address|כתובת]] שנכתבת ב-hex. למשל, הכתובת של מסך OLED היא `0x3C`. אין צורך לחשב כלום: פשוט מעתיקים את המספר כמו שהוא.', en: 'Where you will meet it: every [[i2c|I2C]] part is identified by an [[address|address]] written in hex. For example, an OLED display\'s address is `0x3C`. There is nothing to calculate. Just copy the number as it is.' } },
        { tip: { he: 'Python מבין את שני הכתיבים וממיר ביניהם בשבילכם. נסו את הדוגמה:', en: 'Python understands both notations and converts between them for you. Try the example:' } },
        { code: ['print(0x3C)', 'print(hex(60))', 'print(bin(60))'],
          explain: [
            { l: [1], t: { he: 'השורה מדפיסה 60, כי Python קורא את `0x3C` כמספר רגיל.', en: 'Prints 60. Python reads `0x3C` as an ordinary number.' } },
            { l: [2], t: { he: 'השורה מדפיסה `0x3c`: המספר 60 בכתיב hex.', en: 'Prints `0x3c`: the number 60 in hex notation.' } },
            { l: [3], t: { he: 'השורה מדפיסה `0b111100`: אותו מספר בביטים. הקידומת `0b` מסמנת כתיב של אפסים ואחדות.', en: 'Prints `0b111100`: the same number in bits. `0b` marks a notation of zeros and ones.' } }
          ] }
      ],
      quiz: [
        {
          q: { he: 'כמה ביטים יש בבית אחד?', en: 'How many bits are in one byte?' },
          a: [{ he: '2', en: '2' }, { he: '8', en: '8' }, { he: '16', en: '16' }],
          ok: 1,
          why: { he: 'בית הוא שמונה ביטים, והוא מייצג מספר בין 0 ל-255.', en: 'A byte is eight bits and represents a number from 0 to 255.' }
        },
        {
          q: { he: 'מה פירוש הקידומת 0x לפני מספר?', en: 'What does the 0x prefix before a number mean?' },
          a: [{ he: 'שהמספר שלילי', en: 'That the number is negative' }, { he: 'שהמספר כתוב ב-hex', en: 'That the number is written in hex' }, { he: 'שזו שגיאה', en: 'That it is an error' }],
          ok: 1,
          why: { he: '0x מסמן כתיב הקסדצימלי, ולכן 0x3C הוא המספר 60.', en: '0x marks hexadecimal notation. 0x3C is the number 60.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 7 */
    {
      id: 'python',
      title: { he: 'Python מאפס', en: 'Python from zero' },
      lead: { he: 'שמונה רעיונות שמספיקים כדי לקרוא ולשנות כל דוגמת קוד באתר.', en: 'Eight ideas that are enough to read and change every code example on the site.' },
      blocks: [
        { p: { he: '[[program|תוכנית]] היא רשימת הוראות. המחשב מבצע אותן לפי הסדר, שורה אחרי שורה, מלמעלה למטה. הוא עושה בדיוק מה שכתוב, ולא מה שהתכוונתם. אחרי שתעברו על העמוד "מתחילים", תוכלו להריץ את הדוגמאות כאן ב-[[thonny|Thonny]] או בכפתור "הריצו על הלוח".', en: 'A [[program|program]] is a list of instructions. The computer carries them out in order, line after line, from top to bottom. It does exactly what is written, not what you meant. You can run the examples here in [[thonny|Thonny]] or with the "Run on board" button, once you have been through the "Get started" page.' } },

        { h: { he: '1. print: להציג משהו', en: '1. print: show something' } },
        { p: { he: '[[print|print]] מציג על המסך את מה שבתוך הסוגריים. טקסט כותבים בין מירכאות, ומספרים וחישובים כותבים בלי מירכאות.', en: '[[print|print]] shows on the screen whatever is inside the brackets. Text is written between quotation marks. Numbers and sums are written without.' } },
        { code: ['print("hello")', 'print(2 + 3)', 'print("the answer is", 2 + 3)'],
          explain: [
            { l: [1], t: { he: 'השורה מדפיסה את המילה hello.', en: 'Prints the word hello.' } },
            { l: [2], t: { he: 'השורה מחשבת את התרגיל ומדפיסה 5.', en: 'Works out the sum and prints 5.' } },
            { l: [3], t: { he: 'אפשר להדפיס כמה דברים יחד, כשהם מופרדים בפסיקים.', en: 'You can print several things together, separated by commas.' } }
          ] },

        { h: { he: '2. משתנה: לתת שם לערך', en: '2. Variable: give a value a name' } },
        { p: { he: '[[variable|משתנה]] הוא שם שנותנים לערך. הסימן `=` אינו אומר "שווה", אלא "שימו את הערך שמימין בתוך השם שמשמאל".', en: 'A [[variable|variable]] is a name given to a value. The `=` sign does not mean "equals". It means "put the value on the right into the name on the left".' } },
        { code: ['delay = 0.5', 'name = "Pico"', 'print(name, delay)', 'delay = delay * 2', 'print(delay)'],
          explain: [
            { l: [1, 2], t: { he: 'השורות האלה יוצרות שני משתנים: אחד שומר מספר, והשני שומר טקסט.', en: 'Creates two variables. One holds a number and one holds text.' } },
            { l: [3], t: { he: 'השורה מדפיסה את הערכים שלהם: Pico 0.5.', en: 'Prints their values: Pico 0.5.' } },
            { l: [4], t: { he: 'השורה לוקחת את הערך הנוכחי של delay, מכפילה אותו ב-2, ושומרת את התוצאה בחזרה באותו שם.', en: 'Takes the current value of delay, doubles it, and puts the result back into the same name.' } },
            { l: [5], t: { he: 'השורה מדפיסה 1.0.', en: 'Prints 1.0.' } }
          ] },

        { h: { he: '3. import: לטעון כלים', en: '3. import: bring in tools' } },
        { p: { he: 'Python מגיע עם הרבה כלים מוכנים, אבל הם אינם זמינים עד שמבקשים אותם. הפקודה [[imp|import]] טוענת כלי לתוכנית. את שורות ה-import כותבים בראש התוכנית.', en: 'Python comes with many ready-made tools, but they are not available until you ask for them. [[imp|import]] brings a tool into the program. Import lines are written at the top of the program.' } },
        { code: ['from time import sleep', '', 'print("one")', 'sleep(1)', 'print("two")'],
          explain: [
            { l: [1], t: { he: 'השורה טוענת את הכלי `sleep` מתוך האוסף שנקרא `time`.', en: 'From the collection called `time`, brings in the tool `sleep`.' } },
            { l: [4], t: { he: 'השורה ממתינה שנייה אחת. המספר שבסוגריים הוא מספר השניות.', en: 'Waits one second. The number in brackets is how many seconds.' } }
          ] },

        { h: { he: '4. לולאה: לחזור שוב ושוב', en: '4. Loop: repeat again and again' } },
        { p: { he: '[[loop|לולאה]] מריצה קטע קוד שוב ושוב. `while True:` פירושו "לנצח". כמעט כל תוכנית למיקרו-בקר בנויה כך: קודם מכינים הכול, ואחר כך מגיעה לולאה אינסופית שבודקת ומגיבה.', en: 'A [[loop|loop]] runs a piece of code again and again. `while True:` means "forever". Almost every microcontroller program is built this way: first set everything up, then an endless loop that checks and reacts.' } },
        { p: { he: 'איך Python יודע אילו שורות שייכות ללולאה? לפי ה[[indent|הזחה]]: ארבעה רווחים בתחילת השורה. שורה מוזחת שייכת ללולאה שמעליה. ההזחה היא חלק מהשפה, ולא קישוט.', en: 'How does Python know which lines belong to the loop? By the [[indent|indentation]]: four spaces at the start of the line. An indented line belongs to the loop above it. This is part of the language, not decoration.' } },
        { code: ['from time import sleep', '', 'count = 0', 'while True:', '    count = count + 1', '    print(count)', '    sleep(1)'],
          explain: [
            { l: [3], t: { he: 'השורה הזו מתחילה את הספירה מאפס, והיא רצה פעם אחת בלבד.', en: 'Starts counting from zero. This line runs only once.' } },
            { l: [4], t: { he: 'כאן מתחילה הלולאה. הנקודתיים בסוף השורה הן חובה.', en: 'The start of the loop. The colon at the end is required.' } },
            { l: [5, 7], t: { he: 'שלוש השורות המוזחות חוזרות לנצח: הן מוסיפות 1, מדפיסות וממתינות שנייה.', en: 'The three indented lines repeat forever: add 1, print, wait a second.' } }
          ] },
        { tip: { he: 'תוכנית עם לולאה אינסופית לא מסתיימת מעצמה. עצרו אותה בכפתור Stop ב-Thonny, או בכפתור "עצור" במסוף שבתחתית האתר.', en: 'A program with an endless loop never finishes by itself. Stop it with the Stop button in Thonny, or the "Stop" button in the console at the bottom of this site.' } },

        { h: { he: '5. תנאי: להחליט', en: '5. Condition: decide' } },
        { p: { he: '[[cond|תנאי]] מריץ קטע קוד רק אם משהו נכון. `if` פירושו "אם", ו-`else` פירושו "אחרת". שימו לב: להשוואה משתמשים ב-`==` (שני סימני שווה). סימן אחד שמור למשתנים.', en: 'A [[cond|condition]] runs a piece of code only if something is true. `if` means "if", and `else` means "otherwise". Note: comparing uses `==` (two equals signs). A single one is reserved for variables.' } },
        { code: ['from time import sleep', '', 'count = 0', 'while True:', '    count = count + 1', '    if count > 3:', '        print(count, "is big")', '    else:', '        print(count, "is small")', '    sleep(1)'],
          explain: [
            { l: [6], t: { he: 'השורה בודקת אם count גדול מ-3.', en: 'Checks whether count is greater than 3.' } },
            { l: [7], t: { he: 'השורה הזו רצה רק כאשר התנאי נכון. שימו לב שהיא מוזחת פעמיים: פעם אחת בגלל הלולאה ופעם נוספת בגלל התנאי.', en: 'Runs only when the condition is true. Note the line is indented twice: once for the loop and once for the condition.' } },
            { l: [8, 9], t: { he: 'השורות האלה רצות בכל שאר המקרים.', en: 'Runs in every other case.' } },
            { l: [10], t: { he: 'השורה מוזחת פעם אחת בלבד, ולכן היא שייכת ללולאה ולא לתנאי. היא רצה בכל סיבוב.', en: 'Indented once, so it belongs to the loop and not the condition. It runs every time round.' } }
          ] },
        { table: {
          head: [{ he: 'סימן', en: 'Sign' }, { he: 'פירוש', en: 'Meaning' }],
          rows: [
            [{ he: '`==`', en: '`==`' }, { he: 'שווה ל', en: 'equal to' }],
            [{ he: '`!=`', en: '`!=`' }, { he: 'שונה מ', en: 'not equal to' }],
            [{ he: '`>` `<`', en: '`>` `<`' }, { he: 'גדול מ, קטן מ', en: 'greater than, less than' }],
            [{ he: '`and` `or` `not`', en: '`and` `or` `not`' }, { he: 'וגם, או, לא', en: 'and, or, not' }]
          ]
        } },

        { h: { he: '6. לולאת for: מספר קבוע של פעמים', en: '6. A for loop: a fixed number of times' } },
        { code: ['for i in range(3):', '    print("round", i)', 'print("done")'],
          explain: [
            { l: [1], t: { he: 'הלולאה חוזרת שלוש פעמים. בכל סיבוב `i` מקבל את הערך הבא: 0, אחר כך 1 ואחר כך 2. הספירה מתחילה מאפס.', en: 'Repeats three times. Each time round `i` gets the next value: 0, then 1, then 2. Counting starts from zero.' } },
            { l: [3], t: { he: 'השורה אינה מוזחת, ולכן היא רצה פעם אחת, אחרי שהלולאה הסתיימה.', en: 'Not indented, so it runs once, after the loop has finished.' } }
          ] },

        { h: { he: '7. פונקציה: לתת שם לקבוצת פקודות', en: '7. Function: name a group of commands' } },
        { p: { he: '[[func|פונקציה]] היא קטע קוד שיש לו שם. מגדירים אותה פעם אחת עם `def`, ואחר כך מפעילים אותה בכל מקום על ידי כתיבת השם שלה וסוגריים. `print` ו-`sleep` הן פונקציות שמישהו כבר כתב בשבילכם.', en: 'A [[func|function]] is a piece of code with a name. You define it once with `def`, and afterwards run it anywhere by writing its name and brackets. `print` and `sleep` are functions someone already wrote for you.' } },
        { code: ['def double(x):', '    return x * 2', '', 'print(double(4))', 'print(double(10))'],
          explain: [
            { l: [1], t: { he: 'השורה מגדירה פונקציה בשם double, שמקבלת ערך אחד וקוראת לו x.', en: 'Defines a function named double that receives one value and calls it x.' } },
            { l: [2], t: { he: '`return` מחזיר תשובה למי שהפעיל את הפונקציה.', en: '`return` gives an answer back to whoever ran the function.' } },
            { l: [4, 5], t: { he: 'השורות מפעילות את הפונקציה פעמיים עם ערכים שונים, ומודפס 8 ואחר כך 20.', en: 'Runs it twice with different values. Prints 8, then 20.' } }
          ] },

        { h: { he: '8. הערות והודעות שגיאה', en: '8. Comments and error messages' } },
        { p: { he: 'כל מה שכתוב אחרי הסימן `#` הוא [[comment|הערה]], והמחשב מתעלם ממנו. ההערה נועדה למי שקורא את הקוד, כולל אתם בעוד שבוע.', en: 'Everything written after the `#` sign is a [[comment|comment]]. The computer ignores it. It is there for whoever reads the code, including you a week from now.' } },
        { p: { he: 'כאשר משהו לא בסדר, מופיעה [[error|הודעת שגיאה]] אדומה. זו לא האשמה אלא עזרה. קראו את השורה האחרונה שלה:', en: 'When something is wrong, a red [[error|error message]] appears. It is not blame, it is help. Read its last line:' } },
        { table: {
          head: [{ he: 'ההודעה', en: 'The message' }, { he: 'מה כנראה קרה', en: 'What probably happened' }],
          rows: [
            [{ he: '`NameError`', en: '`NameError`' }, { he: 'שם שנכתב עם שגיאת כתיב, או ששכחתם שורת import.', en: 'A misspelled name, or a forgotten import line.' }],
            [{ he: '`IndentationError`', en: '`IndentationError`' }, { he: 'מספר הרווחים בתחילת השורה שגוי.', en: 'The number of spaces at the start of a line is wrong.' }],
            [{ he: '`SyntaxError`', en: '`SyntaxError`' }, { he: 'חסר משהו: נקודתיים, סוגריים או מירכאות.', en: 'Something is missing: a colon, a bracket or a quotation mark.' }],
            [{ he: '`OSError`', en: '`OSError`' }, { he: 'הלוח לא מצליח לתקשר עם רכיב. בדרך כלל זו בעיית חיווט.', en: 'The board cannot talk to a part. Usually a wiring problem.' }]
          ]
        } }
      ],
      quiz: [
        {
          q: { he: 'מה קובע אילו שורות שייכות ללולאה?', en: 'What decides which lines belong to a loop?' },
          a: [{ he: 'סוגריים מסולסלים', en: 'Curly brackets' }, { he: 'ההזחה: הרווחים בתחילת השורה', en: 'The indentation: the spaces at the start of the line' }, { he: 'שורה ריקה', en: 'A blank line' }],
          ok: 1,
          why: { he: 'ב-Python, שורות מוזחות שייכות ללולאה או לתנאי שמעליהן.', en: 'In Python, indented lines belong to the loop or condition above them.' }
        },
        {
          q: { he: 'מה ההבדל בין `=` ל-`==`?', en: 'What is the difference between `=` and `==`?' },
          a: [{ he: 'אין הבדל', en: 'There is none' }, { he: '`=` שם ערך במשתנה, ו-`==` בודק אם שני ערכים שווים', en: '`=` puts a value into a variable, and `==` tests whether two values are equal' }, { he: '`==` מהיר יותר', en: '`==` is faster' }],
          ok: 1,
          why: { he: 'סימן אחד הוא השמה, ושני סימנים הם השוואה, שמשתמשים בה בתוך if.', en: 'One sign is assignment. Two signs are comparison, used inside an if.' }
        },
        {
          q: { he: 'מה עושה `while True:`?', en: 'What does `while True:` do?' },
          a: [{ he: 'מריץ את השורות שמתחתיו פעם אחת', en: 'Runs the lines beneath it once' }, { he: 'מריץ אותן שוב ושוב, לנצח', en: 'Runs them again and again, forever' }, { he: 'בודק אם משהו נכון', en: 'Tests whether something is true' }],
          ok: 1,
          why: { he: 'זו לולאה אינסופית, ורק הכפתור Stop עוצר אותה.', en: 'It is an endless loop. Only the Stop button ends it.' }
        }
      ]
    },

    /* ------------------------------------------------------------ 8 */
    {
      id: 'first-circuit',
      title: { he: 'המעגל הראשון שלכם', en: 'Your first circuit' },
      lead: { he: 'חברו לד אמיתי על המטריצה והדליקו אותו מהקוד: כל מה שלמדתם, ביחד.', en: 'Connect a real LED on the breadboard and light it from code. Everything you learned, together.' },
      blocks: [
        { h: { he: 'איך קוראים טבלת חיווט', en: 'How to read a wiring table' } },
        { p: { he: 'בכל עמוד רכיב באתר יש טבלת חיווט. כל שורה בטבלה היא חיבור אחד: בצד אחד רגל של הרכיב, ובצד השני הפין ב-Pico שאליו היא מתחברת. כך נראית הטבלה של לד:', en: 'Every part page on the site has a wiring table. Each row is one connection: on one side a leg of the part, and on the other the Pico pin it reaches. This is the table for an LED:' } },
        { table: {
          head: [{ he: 'ברכיב', en: 'On the part' }, { he: 'ב-Pico 2', en: 'On the Pico 2' }, { he: 'הערה', en: 'Note' }],
          rows: [
            [{ he: 'רגל ארוכה', en: 'Long leg' }, { he: '`GP15`, פין 20', en: '`GP15`, pin 20' }, { he: 'דרך נגד 330Ω', en: 'through a 330 Ω resistor' }],
            [{ he: 'רגל קצרה', en: 'Short leg' }, { he: '`GND`, פין 18', en: '`GND`, pin 18' }, { he: '', en: '' }]
          ]
        } },
        { p: { he: '"דרך נגד" פירושו שהנגד נמצא באמצע הדרך: הזרם יוצא מ-GP15, עובר בנגד, ורק אז מגיע לרגל הארוכה של הלד. מספר הפין (20, 18) הוא המיקום שלו על הלוח, וסופרים אותו מהפינה שליד שקע ה-USB.', en: '"Through a resistor" means the resistor sits in the middle of the path: current leaves GP15, passes through the resistor, and only then reaches the LED\'s long leg. The pin number (20, 18) is the position on the board. Count from the corner next to the USB socket.' } },
        { h: { he: 'מה צריך', en: 'What you need' } },
        { ul: [
          { he: 'Pico 2 עם פינים מולחמים (הגרסה שנקראת Pico 2 H), אחרי שעברתם על העמוד "מתחילים".', en: 'A Pico 2 with soldered pins (the version called Pico 2 H), after going through the "Get started" page.' },
          { he: '[[breadboard|מטריצה]].', en: 'A [[breadboard|breadboard]].' },
          { he: '[[led|לד]] אחד, בכל צבע.', en: 'One [[led|LED]], any colour.' },
          { he: '[[resistor|נגד]] של 330Ω (כתום, כתום, חום).', en: 'A 330 Ω [[resistor|resistor]] (orange, orange, brown).' },
          { he: '[[jumper|חוט גישור]] אחד.', en: 'One [[jumper|jumper wire]].' }
        ] },
        { h: { he: 'בונים', en: 'Build it' } },
        { p: { he: 'כך זה נראה מלמעלה, כששקע ה-USB של ה-Pico פונה שמאלה. לחצו על "בנו צעד אחר צעד" כדי לראות כל חלק נכנס למקומו, עם השם המדויק של החור.', en: 'This is how it looks from above, with the Pico\'s USB socket pointing left. Press "Build it step by step" to watch each piece go into place, with the exact hole name.' } },
        { wiring: 'led' },
        { ol: [
          { he: 'נתקו את כבל ה-USB. מחווטים רק כשהחשמל מנותק.', en: 'Unplug the USB cable. Wire only with the power off.' },
          { he: 'הכניסו את ה-Pico למטריצה כך שהוא יושב מעל התעלה שבאמצע, ושקע ה-USB נמצא בקצה המטריצה ופונה החוצה. לחצו בעדינות עד שהוא נכנס עד הסוף.', en: 'Push the Pico into the breadboard so it sits across the channel in the middle, with the USB socket at the end of the breadboard facing outwards. Press gently until it is fully seated.' },
          { he: 'מצאו את פין 20, שהוא GP15. זה הפין האחרון בשורה, הרחוק ביותר מה-USB. הכניסו רגל אחת של הנגד לחור פנוי באותו טור.', en: 'Find pin 20, which is GP15. It is the last pin in its row, the furthest from USB. Push one leg of the resistor into a free hole in the same column.' },
          { he: 'הכניסו את הרגל השנייה של הנגד לטור פנוי, כמה טורים הלאה, מעבר לקצה של ה-Pico.', en: 'Push the resistor\'s other leg into a free column, a few columns further along, beyond the end of the Pico.' },
          { he: 'הכניסו את הרגל הארוכה של הלד לטור שבו נמצאת הרגל השנייה של הנגד, ואת הרגל הקצרה לטור שלידו.', en: 'Push the LED\'s long leg into the same column where the resistor ends, and its short leg into the next column.' },
          { he: 'חברו חוט גישור מהטור של הרגל הקצרה אל הטור של פין 18, שהוא GND. פין 18 נמצא שני פינים לפני פין 20.', en: 'Connect a jumper wire from the short leg\'s column to the column of pin 18, which is GND. Pin 18 is two pins before pin 20.' },
          { he: 'עברו שוב על כל החיבורים והשוו אותם לאיור. רק אחרי זה חברו את ה-USB.', en: 'Go over every connection against the drawing once more. Only then plug in the USB.' }
        ] },
        { h: { he: 'הקוד', en: 'The code' } },
        { code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', '', 'while True:', '    led.on()', '    sleep(0.5)', '    led.off()', '    sleep(0.5)'],
          explain: [
            { l: [1, 2], t: { he: 'השורות האלה טוענות את הכלי ששולט בפינים ואת הפקודה שממתינה.', en: 'Brings in the tool for controlling pins and the command that waits.' } },
            { l: [4], t: { he: 'השורה אומרת ל-Pico שפין GP15 הוא יציאה, ונותנת לו את השם led. המספר 15 הוא המספר שבשם GP15, ולא המיקום של הפין.', en: 'Tells the Pico that pin GP15 is an output, and names it led. The number 15 is the number in the name GP15, not the pin\'s position.' } },
            { l: [6], t: { he: 'מכאן והלאה, הקוד חוזר לנצח.', en: 'From here on, forever.' } },
            { l: [7], t: { he: 'השורה מוציאה 3.3V על הפין. הזרם עובר בנגד ובלד וחוזר לאדמה, והלד נדלק.', en: 'Puts 3.3 V on the pin. Current passes through the resistor and LED and returns to ground, and the LED lights.' } },
            { l: [8], t: { he: 'השורה ממתינה חצי שנייה, והלד נשאר דולק.', en: 'Waits half a second, with the LED staying on.' } },
            { l: [9, 10], t: { he: 'השורות מורידות את הפין ל-0V. אין מתח ואין זרם, ולכן הלד כבוי במשך חצי שנייה.', en: 'Drops the pin to 0 V. No voltage, no current, and the LED is off for half a second.' } }
          ] },
        { h: { he: 'מה אמור לקרות', en: 'What should happen' } },
        { p: { he: 'הלד מהבהב: חצי שנייה דולק וחצי שנייה כבוי. נסו לשנות את המספרים בשורות 8 ו-10, והריצו שוב.', en: 'The LED blinks: half a second on, half a second off. Try changing the numbers on lines 8 and 10 and running again.' } },
        { h: { he: 'לא עובד?', en: 'Not working?' } },
        { ul: [
          { he: 'הפכו את הלד. זו הסיבה הנפוצה ביותר.', en: 'Turn the LED round. This is the most common cause.' },
          { he: 'בדקו שהרגל הארוכה של הלד והקצה של הנגד באמת נמצאים באותו טור.', en: 'Check that the LED\'s long leg and the end of the resistor really are in the same column.' },
          { he: 'בדקו שספרתם את הפינים נכון. פין 18 הוא GND, ופין 20 הוא GP15.', en: 'Check that you counted the pins correctly. Pin 18 is GND, and pin 20 is GP15.' },
          { he: 'ודאו שהתוכנית באמת רצה, ושלא הופיעה הודעת שגיאה אדומה.', en: 'Make sure the program is actually running and no red error message appeared.' }
        ] },
        { tip: { he: 'זהו. בניתם מעגל, כתבתם תוכנית, והם עובדים יחד. מכאן והלאה, כל רכיב חדש הוא אותו תהליך: קוראים מה הוא, מחברים לפי הטבלה ומריצים את הקוד.', en: 'That is it. You built a circuit, wrote a program, and they work together. From here every new part is the same process: read what it is, connect it by the table, and run the code.' } }
      ],
      quiz: [
        {
          q: { he: 'בשורה `led = Pin(15, Pin.OUT)`, מה פירוש המספר 15?', en: 'In the line `led = Pin(15, Pin.OUT)`, what does 15 mean?' },
          a: [{ he: 'מיקום הפין על הלוח', en: 'The pin\'s position on the board' }, { he: 'המספר שבשם GP15', en: 'The number in the name GP15' }, { he: 'מספר השניות', en: 'The number of seconds' }],
          ok: 1,
          why: { he: 'בקוד תמיד משתמשים במספר ה-GP. GP15 נמצא במיקום 20 על הלוח.', en: 'Code always uses the GP number. GP15 sits at position 20 on the board.' }
        },
        {
          q: { he: 'למה הנגד נמצא בין הפין לבין הלד?', en: 'Why is the resistor between the pin and the LED?' },
          a: [{ he: 'כדי שהלד יאיר חזק יותר', en: 'To make the LED brighter' }, { he: 'כדי להגביל את הזרם שעובר בלד', en: 'To limit the current through the LED' }, { he: 'כדי להחזיק את הלד במקום', en: 'To hold the LED in place' }],
          ok: 1,
          why: { he: 'בלי נגד עובר זרם גדול מדי, והלד או הפין נשרפים.', en: 'Without a resistor too much current flows, and the LED or the pin burns out.' }
        }
      ]
    }
  ];
})(window.PICO);
