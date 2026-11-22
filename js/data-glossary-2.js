/* Glossary, part 2: the words introduced by the follow-on chapters, the
   tracks E to G and the parts of data-components-5.js. Same form as
   data-glossary.js: P.glossary[id] = { cat, t, d }. */
(function (P) {
  'use strict';
  var G = function (cat, he, en, dHe, dEn) { return { cat: cat, t: { he: he, en: en }, d: { he: dHe, en: dEn } }; };
  var add = {
    /* ---------- electricity ---------- */
    commonground: G('elec', 'אדמה משותפת', 'Common ground',
      'כאשר שני מעגלים שיש להם ספקי כוח נפרדים צריכים לתקשר זה עם זה, מחברים את האדמות שלהם יחד. בלי החיבור הזה אין להם נקודת אפס משותפת, ולכן האות של מעגל אחד חסר משמעות עבור המעגל השני.',
      'When two circuits with separate power supplies need to talk to each other, their grounds are joined. Without that they share no zero point, and one\'s signal means nothing to the other.'),
    shunt: G('elec', 'נגד מדידה', 'Shunt resistor',
      'נגד קטן מאוד שמעבירים דרכו זרם כדי למדוד את הזרם הזה. המתח הזעיר שנופל על הנגד גדל ככל שהזרם גדל.',
      'A very small resistor that current is passed through in order to measure it. The tiny voltage across it grows with the current.'),
    brownout: G('elec', 'נפילת מתח', 'Brown-out',
      'ירידה רגעית במתח ההזנה, שקורית בדרך כלל כאשר מנוע מתחיל לזוז וצורך הרבה זרם בבת אחת. כשזה קורה, ה-Pico מתאפס או מתנתק מהמחשב.',
      'A momentary dip in the supply voltage, usually when a motor starts moving and draws a lot of current at once. The Pico resets or disconnects from the computer.'),

    /* ---------- hardware ---------- */
    mosfet: G('hw', 'MOSFET', 'MOSFET',
      'מתג אלקטרוני שאין בו חלקים זזים. מתח קטן על אחת הרגליים שלו פותח מעבר לזרם גדול בין שתי הרגליים האחרות. הוא מהיר מספיק כדי לעבוד עם PWM.',
      'An electronic switch with no moving parts. A small voltage on one of its legs opens a path for a large current between the other two. Fast enough for PWM.'),
    thermocouple: G('hw', 'צמד תרמי', 'Thermocouple',
      'חיישן טמפרטורה שעשוי משני חוטים ממתכות שונות, המחוברים זה לזה בקצה. הוא עומד בטמפרטורות של מאות מעלות.',
      'A temperature sensor made of two wires of different metals, joined at the tip. It withstands temperatures of hundreds of degrees.'),
    stepmotor: G('hw', 'מנוע צעד', 'Stepper motor',
      'מנוע שמסתובב בצעדים קטנים וקבועים. התוכנית סופרת את הצעדים, ולכן היא יודעת בדיוק כמה המנוע הסתובב.',
      'A motor that turns in small fixed steps. The program counts steps, so it knows exactly how far it has turned.'),

    /* ---------- signals ---------- */
    bounce: G('sig', 'ריטוט מגעים', 'Contact bounce',
      'כאשר לוחצים על כפתור, המגעים שלו קופצים ונוגעים זה בזה כמה פעמים באלפיות השנייה הראשונות. לכן התוכנית רואה כמה לחיצות במקום לחיצה אחת. הטיפול בבעיה הזו נקרא debounce.',
      'When a button is pressed, its contacts bounce and touch several times in the first few milliseconds. The program sees several presses instead of one. Dealing with this is called debouncing.'),
    deadzone: G('sig', 'אזור מת', 'Dead zone',
      'טווח קטן סביב האמצע שבו מתעלמים מהקלט. כך ג\'ויסטיק שלא חוזר בדיוק למרכז לא גורם לתזוזה.',
      'A small range around the middle in which input is ignored. This stops a joystick that does not return exactly to centre from causing movement.'),
    bcd: G('sig', 'BCD', 'BCD',
      'שיטה לשמירת מספר, שבה כל ספרה עשרונית מקבלת ארבעה ביטים משלה. שעונים משתמשים בשיטה הזו: 0x59 פירושו 59.',
      'A way of storing a number in which each decimal digit gets four bits of its own. Clocks use it: 0x59 is 59.'),

    /* ---------- software ---------- */
    list: G('sw', 'רשימה', 'List',
      'כמה ערכים ברצף, תחת שם אחד, בתוך סוגריים מרובעים. ניגשים לכל ערך לפי המקום שלו ברשימה, והספירה מתחילה מ-0.',
      'Several values in a row, under one name, in square brackets. Each value is reached by its position, which starts at 0.'),
    dict: G('sw', 'מילון', 'Dictionary',
      'אוסף של זוגות, שבכל אחד מהם יש מפתח וערך. ניגשים לערך לפי המפתח שלו, למשל שם של צבע, ולא לפי המקום שלו.',
      'A collection of pairs: a key and a value. A value is reached by its key, for example a colour name, and not by position.'),
    file: G('sw', 'קובץ', 'File',
      'מידע שנשמר בזיכרון של הלוח ונשאר שם גם אחרי שמנתקים את החשמל. התוכנית יכולה לכתוב לקובץ ולקרוא ממנו.',
      'Information saved in the board\'s memory that stays there after the power is removed. A program can write to a file and read from it.'),
    timer: G('sw', 'טיימר', 'Timer',
      'שעון פנימי שמפעיל פונקציה בכל פרק זמן קבוע, בלי שהתוכנית הראשית תצטרך לחכות.',
      'An internal clock that runs a function at a fixed interval, without the main program having to wait.'),
    exception: G('sw', 'חריגה', 'Exception',
      'שגיאה שקורית בזמן שהתוכנית רצה. אפשר לתפוס אותה בעזרת `try` ו-`except`, כדי שהתוכנית תמשיך לרוץ במקום להיעצר.',
      'An error that happens while the program is running. It can be caught with `try` and `except`, so the program carries on instead of stopping.'),
    global: G('sw', 'משתנה גלובלי', 'Global variable',
      'משתנה שהוגדר מחוץ לכל הפונקציות. כדי שפונקציה תוכל לשנות אותו, כותבים בתחילת הפונקציה את המילה `global` ואחריה את שם המשתנה.',
      'A variable defined outside every function. For a function to change it, you write `global` and its name at the start of the function.')
  };
  Object.keys(add).forEach(function (k) { if (!P.glossary[k]) P.glossary[k] = add[k]; });
})(window.PICO);
