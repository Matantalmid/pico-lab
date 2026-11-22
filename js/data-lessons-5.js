/* Lesson tracks, part 5: track R (doing several things at once) and track W (Pico 2 W and Wi-Fi).
   Track R reuses the circuit of lesson A3 (an LED on GP15 and a button on GP14) and solves one problem
   four ways: a loop that sleeps, ticks_ms, an interrupt that sets a flag, and asyncio.
   Track W needs a Pico 2 W (or Pico W) with the W build of MicroPython. It uses only the board itself:
   the LED on the board and the chip's own temperature sensor, so there is nothing to wire.
   The breadboard pictures of track R are aliases of A3's, at the end of data-layouts-2.js. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ, RES = x.RES;

  /* new glossary terms used below */
  var G = function (cat, he, en, dHe, dEn) { return { cat: cat, t: { he: he, en: en }, d: { he: dHe, en: dEn } }; };
  P.glossary.blocking = G('sw', 'קוד חוסם (blocking)', 'Blocking code',
    'שורה שעוצרת את כל התוכנית עד שהיא מסתיימת, למשל `sleep(1)`. בזמן הזה הלוח לא עושה שום דבר אחר, ולא שם לב ללחיצות על כפתורים.',
    'A line that stops the whole program until it finishes, such as `sleep(1)`. Meanwhile the board does nothing else, and does not notice buttons.');
  P.glossary.asyncio = G('sw', 'asyncio', 'asyncio',
    'ספרייה שמריצה כמה משימות "יחד". כל משימה רצה עד שהיא מגיעה ל-`await`, ושם היא מוותרת על התור שלה, ומשימה אחרת ממשיכה.',
    'A library that runs several tasks "together". Each task runs until it reaches `await`, where it gives up its turn and another task carries on.');
  P.glossary.wifi = G('io', 'Wi-Fi', 'Wi-Fi',
    'רשת אלחוטית. ב-Pico 2 W יש שבב Wi-Fi (CYW43439) ליד המעבד, וגם הלד שעל הלוח מחובר אליו.',
    'A wireless network. The Pico 2 W has a Wi-Fi chip (CYW43439) next to the processor, and the board\'s LED sits on it too.');
  P.glossary.ip = G('io', 'כתובת IP', 'IP address',
    'המספר שמזהה מכשיר ברשת, למשל `192.168.1.37`. הנתב נותן אותו ללוח כשהלוח מתחבר.',
    'The number that identifies a device on a network, for example `192.168.1.37`. The router gives it to the board when it connects.');
  P.glossary.webserver = G('io', 'שרת אינטרנט', 'Web server',
    'תוכנית שממתינה לבקשות מדפדפן ושולחת בחזרה דף. על ה-Pico זו לולאה שמקבלת חיבור, קוראת את הבקשה ועונה עליה.',
    'A program that waits for requests from a browser and sends back a page. On the Pico it is a loop that accepts a connection, reads the request and answers.');

  P.tracks.push(
    { id: 'R', color: '--c-adc', title: B('כמה דברים בבת אחת', 'Several things at once'), desc: B('לד שמהבהב וכפתור שמגיב מיד, באותו זמן. אותה בעיה נפתרת בשלוש דרכים: מדידת זמן בלי sleep, פסיקה ו-asyncio.', 'An LED that blinks and a button that responds at once, together. The same problem three ways: timing without sleep, an interrupt, and asyncio.') },
    { id: 'W', color: '--c-spi', title: B('Pico 2 W ו-Wi-Fi', 'Pico 2 W and Wi-Fi'), desc: B('התחברו לרשת, שלטו בלד מהטלפון, והציגו מדידה בדפדפן. נדרש לוח Pico 2 W.', 'Connect to the network, control an LED from a phone, and show a measurement in a browser. Needs a Pico 2 W board.') }
  );

  var LESSON = function (id, whyHe, whyEn) { return { href: '#/lessons/' + id, label: B('שיעור ' + id, 'Lesson ' + id), why: whyHe ? B(whyHe, whyEn) : null }; };
  var BASICS = function (id, he, en, whyHe, whyEn) { return { href: '#/basics/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var A3_PARTS = [{ id: 'led', qty: 1 }, { id: 'button', qty: 1 }, { text: B('נגד של 330Ω', 'A 330 Ω resistor') }];
  var A3_WIRING = [
    W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
    W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
    W(B('לד, רגל קצרה + כפתור, הרגל שבאלכסון', 'LED short leg + button\'s diagonal leg'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
  ];
  var A3_BUILD = B('בנו את המעגל של שיעור A3: לד שמחובר ל-`GP15` דרך נגד, וכפתור בין `GP14` לאדמה. אם המעגל עדיין בנוי, השאירו אותו כמו שהוא.', 'Build the circuit of lesson A3: an LED on `GP15` through a resistor, and a button between `GP14` and ground. If it is still built, keep it.');

  /* Pico 2 W: shared pieces */
  var NEED_W = B('לוח Pico 2 W (או Pico W), עם קושחת MicroPython בגרסה שתומכת ב-Wi-Fi', 'A Pico 2 W (or Pico W) board, with the Wi-Fi build of MicroPython');
  var NET = B('שם של רשת Wi-Fi והסיסמה שלה: רשת ביתית או נקודה חמה של טלפון. רשת של מכללה שדורשת כניסה דרך דף אינטרנט לא תעבוד.', 'A Wi-Fi network name and password. A home network or a phone hotspot. A college network with a sign-in web page will not work.');
  var FW = B('ודאו שעל הלוח מותקנת קושחה של Pico 2 W. בשורת המצב שבתחתית Thonny צריך להופיע Pico 2 W. אם הוא לא מופיע, התקינו את הקובץ מבורר הלוחות שבעמוד "מתחילים".', 'Make sure the board has Pico 2 W firmware. In Thonny\'s status line at the bottom it should say Pico 2 W. If not, install the file from the board picker on the "Get started" page.');
  var CREDS = B('כתבו בשורות `SSID` ו-`PASSWORD` את שם הרשת ואת הסיסמה שלכם, בדיוק כפי שהם, כולל אותיות גדולות וקטנות.', 'Write your network name and password in the `SSID` and `PASSWORD` lines, exactly as they are, including capital and small letters.');
  var BAND = B('השתמשו ברשת של 2.4GHz בלבד, כי השבב לא רואה רשתות של 5GHz. בנקודה חמה של אייפון, הפעילו את "Maximize Compatibility".', 'A 2.4 GHz network only: the chip does not see 5 GHz networks. On an iPhone hotspot, turn on "Maximize Compatibility".');
  var CONNECT = [
    'wlan = network.WLAN(network.STA_IF)',
    'wlan.active(True)',
    'wlan.connect(SSID, PASSWORD)',
    'while not wlan.isconnected() and wlan.status() >= 0:',
    '    sleep(0.5)',
    'ip = wlan.ifconfig()[0]',
    'print("open http://" + ip)'
  ];

  var lessons = [
    /* ------------------------------------------------------------ R1 */
    {
      id: 'R1', track: 'R',
      title: B('לד מהבהב וכפתור שמגיב מיד', 'A blinking LED and a button that responds at once'),
      goal: B('הלד שעל GP15 מהבהב כל חצי שנייה, ובאותו זמן כל לחיצה על הכפתור מדליקה או מכבה את הלד שעל הלוח, מיד ובלי לחכות.', 'The LED on GP15 blinks every half second, and at the same time every button press turns the board\'s LED on or off. At once, without waiting.'),
      learn: [
        B('למה `sleep` הוא [[blocking|קוד חוסם]], ומה זה גורם לכפתור.', 'Why `sleep` is [[blocking|blocking code]], and what that does to a button.'),
        B('איך מודדים זמן עם `ticks_ms` ו-`ticks_diff` במקום לחכות.', 'To measure time with `ticks_ms` and `ticks_diff` instead of waiting.'),
        B('איך כותבים לולאה שבודקת "האם הגיע הזמן?" במקום לישון.', 'To write a loop that checks "is it time?" instead of sleeping.')
      ],
      before: [LESSON('A3', 'בשיעור הזה בונים את אותו מעגל.', 'Build the same circuit.'), LESSON('A4', 'שם למדנו לזהות את רגע הלחיצה.', 'That is where we learned to catch the moment of a press.')],
      parts: A3_PARTS,
      wiring: A3_WIRING,
      steps: [
        A3_BUILD, PLUG,
        B('קודם הריצו את הגרסה ה"תמימה" שבאתגר 1 למטה, ולחצו על הכפתור כמה לחיצות קצרות. שימו לב כמה לחיצות לא נקלטות.', 'First run the "naive" version in challenge 1 below, and press the button a few times briefly. Notice how many presses are not caught.'),
        RUN,
        B('לחצו שוב כמה לחיצות קצרות. עכשיו כל לחיצה נקלטת, והלד החיצוני ממשיך להבהב בקצב קבוע.', 'Press a few short times again. Now every press is caught, and the outside LED keeps blinking at a steady pace.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from time import ticks_ms, ticks_diff, sleep_ms',
        '',
        'led = Pin(15, Pin.OUT)',
        'board_led = Pin("LED", Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'BLINK = 500                 # milliseconds between blinks',
        'last_blink = ticks_ms()',
        'last = 1',
        '',
        'while True:',
        '    now = ticks_ms()',
        '    if ticks_diff(now, last_blink) >= BLINK:',
        '        led.toggle()',
        '        last_blink = now',
        '',
        '    pressed = button.value()',
        '    if last == 1 and pressed == 0:',
        '        board_led.toggle()',
        '    last = pressed',
        '    sleep_ms(10)'
      ],
      explain: [
        E([2], '`ticks_ms` מחזיר את מספר אלפיות השנייה שעברו מאז שהלוח הודלק. `ticks_diff` מחשב נכון את ההפרש בין שני זמנים כאלה, גם כשהמונה מגיע לסופו ומתחיל מחדש.', '`ticks_ms` gives the number of milliseconds since the board was switched on. `ticks_diff` subtracts two such times correctly, even when the counter reaches its end and starts over.'),
        E([8, 9], 'השורות האלה קובעות את קצב ההבהוב, ושומרות את הזמן שבו הלד החליף מצב בפעם האחרונה.', 'The blink rate, and the time the LED last changed.'),
        E([13, 16], 'במקום לישון חצי שנייה, התוכנית שואלת: האם עברה חצי שנייה מאז ההבהוב הקודם? אם כן, היא מחליפה את מצב הלד ורושמת את הזמן. אם לא, היא ממשיכה הלאה מיד.', 'Instead of sleeping half a second, ask: has half a second passed since the last blink? If so, switch the LED and note the time. If not, move on at once.'),
        E([18, 21], 'כאן מזהים את הרגע שבו הכפתור נלחץ, כמו בשיעור A4: לפני רגע הערך היה 1, ועכשיו הוא 0.', 'Catching the moment the button is pressed, as in lesson A4: a moment ago it was 1, and now it is 0.'),
        E([22], 'מנוחה קצרה של 10 אלפיות שנייה. היא גם מסננת את ה[[bounce|ריטוט]] של הכפתור, והלולאה עדיין מסתובבת 100 פעמים בשנייה.', 'A short rest of 10 milliseconds. It also filters the button\'s [[bounce|bounce]], and the loop still goes round 100 times a second.')
      ],
      expect: B('הלד שעל GP15 מהבהב בקצב קבוע של חצי שנייה. כל לחיצה, גם קצרה מאוד, מחליפה מיד את מצב הלד שעל הלוח, וההבהוב לא נעצר כשלוחצים.', 'The LED on GP15 blinks at a steady half-second pace. Every press, even a very short one, switches the board\'s LED at once. The blinking does not stop while you press.'),
      tasks: [
        { t: B('הגרסה התמימה: הריצו את הקוד הזה ולחצו לחיצות קצרות. למה רוב הלחיצות הולכות לאיבוד?', 'The naive version: run this code and press briefly. Why are most presses lost?'),
          hint: B('`sleep(0.5)` עוצר את כל התוכנית, ולכן הכפתור נבדק רק פעם בחצי שנייה. לחיצה שמתחילה ונגמרת בזמן השינה פשוט לא נראית.', '`sleep(0.5)` stops the whole program. The button is checked only once every half second, and a press that starts and ends during the sleep is never seen.'),
          code: ['from machine import Pin', 'from time import sleep', '', 'led = Pin(15, Pin.OUT)', 'board_led = Pin("LED", Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', '', 'while True:', '    led.toggle()', '    sleep(0.5)', '    if button.value() == 0:', '        board_led.toggle()'] },
        { t: B('הוסיפו לד שני (או השתמשו בלד שעל הלוח) שמהבהב בקצב אחר, למשל כל 130 אלפיות שנייה, בלי לפגוע בשום דבר אחר.', 'Add a second LED (or use the board\'s LED) that blinks at another pace, say every 130 milliseconds, without harming anything else.'),
          hint: B('לכל דבר שחוזר על עצמו יש משתנה זמן משלו ובדיקת `ticks_diff` משלו. אפשר להוסיף כמה שרוצים.', 'Each thing that repeats gets its own time variable and its own `ticks_diff` check. You can add as many as you like.') },
        { t: B('מדדו כמה פעמים בשנייה הלולאה מסתובבת. כמה זה יוצא בלי `sleep_ms(10)`?', 'Measure how many times a second the loop goes round. How many is it without `sleep_ms(10)`?'),
          hint: B('ספרו את הסיבובים במשתנה, ופעם בשנייה (שוב בעזרת `ticks_diff`) הדפיסו אותו והתחילו לספור מ-0.', 'Count rounds in a variable, and once a second (with `ticks_diff` again) print it and start from 0.') }
      ],
      quiz: [
        Q(B('למה בגרסה עם `sleep(0.5)` לחיצה קצרה הולכת לאיבוד?', 'Why is a short press lost in the version with `sleep(0.5)`?'), [B('הכפתור מקולקל', 'The button is broken'), B('בזמן השינה התוכנית לא בודקת את הכפתור בכלל', 'While sleeping the program does not check the button at all'), B('הלד מפריע לכפתור', 'The LED interferes with the button')], 1, B('`sleep` חוסם: כל התוכנית עומדת במקום, ולחיצה שמתחילה ונגמרת בזמן הזה לא נראית.', '`sleep` blocks: the whole program stands still. A press that starts and ends during it is never seen.')),
        Q(B('למה כותבים `ticks_diff(now, last_blink)` ולא `now - last_blink`?', 'Why write `ticks_diff(now, last_blink)` and not `now - last_blink`?'), [B('זה מהיר יותר', 'It is faster'), B('המונה מתאפס אחרי זמן מה, ו-`ticks_diff` עדיין נותן את ההפרש הנכון', 'The counter wraps around after a while, and `ticks_diff` still gives the right difference'), B('אין הבדל', 'There is no difference')], 1, B('המונה של `ticks_ms` מגיע לסופו ומתחיל מחדש, ואז חיסור רגיל נותן מספר שגוי.', 'The `ticks_ms` counter reaches its end and starts over. Plain subtraction then gives a wrong number.'))
      ]
    },
    /* ------------------------------------------------------------ R2 */
    {
      id: 'R2', track: 'R',
      title: B('פסיקה: אף לחיצה לא הולכת לאיבוד', 'An interrupt: no press is lost'),
      goal: B('התוכנית עסוקה בעבודה איטית ולא בודקת את הכפתור בכלל, ובכל זאת כל לחיצה נספרת, כי ה[[interrupt|פסיקה]] קולטת אותה ברגע שהיא קורית.', 'The program is busy with slow work and does not check the button at all. And still every press is counted, because the [[interrupt|interrupt]] catches it the moment it happens.'),
      learn: [
        B('איך מחברים פונקציה לפין עם `irq`, כך שהלוח יקרא לה בעצמו.', 'To attach a function to a pin with `irq`, so the board calls it by itself.'),
        B('מה מותר לעשות בתוך פונקציית פסיקה, ולמה היא חייבת להיות קצרה.', 'What may be done inside an interrupt function, and why it must be short.'),
        B('איך מעבירים מידע מהפסיקה ללולאה הראשית דרך משתנה [[global|גלובלי]].', 'To pass information from the interrupt to the main loop through a [[global|global]] variable.')
      ],
      before: [LESSON('R1', 'שם ראינו למה `sleep` מפספס לחיצות.', 'That is where we saw why `sleep` misses presses.')],
      parts: A3_PARTS,
      wiring: A3_WIRING,
      steps: [
        A3_BUILD, PLUG, RUN,
        B('לחצו על הכפתור 5 פעמים מהר, בזמן שהלד דולק או כבוי. אחרי כשנייה יודפס המספר המדויק של הלחיצות.', 'Press the button 5 times quickly, while the LED is on or off. After about a second the exact number of presses is printed.'),
        READ
      ],
      code: [
        'from machine import Pin',
        'from time import sleep, ticks_ms, ticks_diff',
        '',
        'led = Pin(15, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'presses = 0',
        'last_press = 0',
        '',
        'def on_press(pin):',
        '    global presses, last_press',
        '    now = ticks_ms()',
        '    if ticks_diff(now, last_press) > 150:    # ignore the bounce',
        '        presses = presses + 1',
        '        last_press = now',
        '',
        'button.irq(trigger=Pin.IRQ_FALLING, handler=on_press)',
        '',
        'shown = 0',
        'while True:',
        '    led.on()',
        '    sleep(1)                 # slow work: the loop is busy here',
        '    led.off()',
        '    sleep(1)',
        '    if presses != shown:',
        '        print("presses:", presses)',
        '        shown = presses'
      ],
      explain: [
        E([7, 8], 'השורות האלה יוצרות את מונה הלחיצות, ואת המשתנה ששומר את הזמן של הלחיצה האחרונה שנספרה.', 'The press counter, and the time of the last press that was counted.'),
        E([10, 15], 'זו פונקציית הפסיקה. הלוח קורא לה בעצמו, באמצע כל דבר אחר, ברגע שהפין יורד ל-0. היא קצרה מאוד: היא רק סופרת ורושמת את הזמן.', 'The interrupt function. The board calls it by itself, in the middle of anything else, the moment the pin falls to 0. It is very short: it only counts and notes the time.'),
        E([11], '`global` מאפשר לפונקציה לשנות את המשתנים שמחוץ לה. בלי זה, השינוי היה נשאר רק בתוך הפונקציה.', '`global` lets the function change the variables outside it. Without it, the change would stay inside the function.'),
        E([13], 'סינון [[bounce|ריטוט]]: לחיצה אחת יכולה ליצור כמה ירידות מהירות, ולכן כל מה שמגיע פחות מ-150 אלפיות שנייה אחרי הלחיצה הקודמת לא נספר.', '[[bounce|Bounce]] filtering: one press can make several quick falls. Anything that comes less than 150 milliseconds after the previous press is not counted.'),
        E([17], 'השורה הזו מחברת את הפונקציה לפין. `IRQ_FALLING` פירושו: קרא לפונקציה כשהפין יורד מ-1 ל-0, כלומר ברגע הלחיצה.', 'Attaches the function to the pin. `IRQ_FALLING` means: call it when the pin falls from 1 to 0, that is, at the moment of the press.'),
        E([21, 24], 'זו העבודה ה"איטית": שתי שניות שבהן הלולאה לא בודקת שום כפתור.', 'The "slow" work: two seconds in which the loop checks no button.'),
        E([25, 27], 'הלולאה רק מציגה את מה שהפסיקה כבר ספרה. את ההדפסה עושים כאן ולא בתוך הפסיקה, כי הדפסה היא פעולה איטית.', 'The loop only shows what the interrupt has already counted. The printing happens here and not in the interrupt, because printing is slow.')
      ],
      expect: B('הלד דולק שנייה וכבוי שנייה. אחרי כל סדרת לחיצות מודפס מספר הלחיצות המדויק, גם אם לחצתם בדיוק כשהלוח "ישן".', 'The LED is on for a second and off for a second. After each burst of presses the exact number of presses is printed, even if you pressed exactly while the board was "sleeping".'),
      tasks: [
        { t: B('מחקו את שורה 13 (התנאי של 150 אלפיות השנייה) והריצו. האם לחיצה אחת נספרת לפעמים כשתיים או יותר?', 'Delete line 13 (the 150-millisecond condition) and run. Is one press sometimes counted as two or more?'),
          hint: B('כנראה שכן, בעיקר עם כפתורים זולים. זה הריטוט: המגע קופץ כמה פעמים לפני שהוא נרגע.', 'Probably yes, especially with cheap buttons. That is bounce: the contact jumps a few times before it settles.') },
        { t: B('גרמו לפסיקה להרים "דגל", וכתבו לולאה ראשית שמהבהבת 3 פעמים בלד שעל הלוח בכל פעם שהדגל מורם.', 'Make the interrupt raise a "flag", and a main loop that blinks the board\'s LED 3 times each time the flag is up.'),
          hint: B('בפסיקה: `flag = True`. בלולאה: אם `flag`, קודם `flag = False`, ורק אחר כך ההבהובים. את ההבהובים לא עושים בתוך הפסיקה.', 'In the interrupt: `flag = True`. In the loop: if `flag`, first `flag = False`, then the blinks. The blinks are not done inside the interrupt.'),
          code: ['flag = False', '', 'def on_press(pin):', '    global flag', '    flag = True', '', 'button.irq(trigger=Pin.IRQ_FALLING, handler=on_press)', 'board_led = Pin("LED", Pin.OUT)', '', 'while True:', '    if flag:', '        flag = False', '        for i in range(6):', '            board_led.toggle()', '            sleep(0.1)', '    sleep(0.01)'] },
        { t: B('נסו להוסיף `print` בתוך `on_press`. האם זה עובד? ולמה בכל זאת עדיף שלא?', 'Try adding a `print` inside `on_press`. Does it work? Why is it still better not to?'),
          hint: B('ב-MicroPython על ה-Pico זה בדרך כלל עובד, אבל פסיקה צריכה להסתיים מהר. הדפסה, `sleep` או חישוב ארוך מעכבים את כל השאר, ועלולים לגרום לכך שהפסיקה הבאה תפוספס.', 'In MicroPython on the Pico it usually works, but an interrupt should finish quickly. Printing, `sleep` or long calculations delay everything else, and can make the next interrupt be missed.') }
      ],
      quiz: [
        Q(B('מתי הלוח קורא לפונקציה `on_press`?', 'When does the board call the function `on_press`?'), [B('כשהלולאה הראשית מגיעה אליה', 'When the main loop reaches it'), B('ברגע שהפין יורד מ-1 ל-0, באמצע כל דבר אחר', 'The moment the pin falls from 1 to 0, in the middle of anything else'), B('פעם בשנייה', 'Once a second')], 1, B('זו פסיקה: האירוע עצמו מפעיל את הפונקציה, בלי קשר למה שהלולאה עושה באותו רגע.', 'That is an interrupt: the event itself triggers the function, whatever the loop is doing.')),
        Q(B('מה עדיף לשים בתוך פונקציית פסיקה?', 'What is best put inside an interrupt function?'), [B('עדכון קצר של משתנה', 'A short update of a variable'), B('`sleep(1)` והדפסה', '`sleep(1)` and a print'), B('ציור על המסך', 'Drawing on the display')], 0, B('פסיקה חייבת להיות קצרה. היא רק רושמת מה קרה, והלולאה הראשית עושה את העבודה הארוכה.', 'An interrupt must be short. It only notes what happened, and the main loop does the long work.'))
      ]
    },
    /* ------------------------------------------------------------ R3 */
    {
      id: 'R3', track: 'R',
      title: B('asyncio: כמה משימות שרצות יחד', 'asyncio: several tasks running together'),
      goal: B('שלוש משימות רצות "יחד": לד שמהבהב לאט, לד שמהבהב מהר, וכפתור שסופר לחיצות. כל משימה כתובה כאילו היא לבד, עם המתנה פשוטה.', 'Three tasks run "together": an LED that blinks slowly, an LED that blinks fast, and a button that counts presses. Each task is written as if it were alone, with a simple wait.'),
      learn: [
        B('איך כותבים משימה עם `async def`, ואיך ממתינים עם `await`.', 'To write a task with `async def` and wait with `await`.'),
        B('איך מפעילים כמה משימות עם `create_task` ו-`asyncio.run`.', 'To start several tasks with `create_task` and `asyncio.run`.'),
        B('למה `await asyncio.sleep_ms` לא חוסם, ואילו `sleep` רגיל כן חוסם.', 'To understand why `await asyncio.sleep_ms` does not block, and a plain `sleep` does.')
      ],
      before: [LESSON('R1', 'שם נפתרה אותה בעיה בעזרת `ticks_ms`.', 'The same problem, solved with `ticks_ms`.'), LESSON('R2')],
      parts: A3_PARTS,
      wiring: A3_WIRING,
      steps: [
        A3_BUILD, PLUG, RUN,
        B('הסתכלו על שני הלדים, ולחצו על הכפתור כמה פעמים. כל לחיצה מודפסת, ושני הלדים ממשיכים כל אחד בקצב שלו.', 'Watch both LEDs, and press the button a few times. Every press is printed, and both LEDs keep their own pace.'),
        B('כדי לעצור את התוכנית, לחצו על Stop ב-Thonny.', 'To stop, press Stop in Thonny.'),
        READ
      ],
      code: [
        'import asyncio',
        'from machine import Pin',
        '',
        'led = Pin(15, Pin.OUT)',
        'board_led = Pin("LED", Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'async def blink(pin, ms):',
        '    while True:',
        '        pin.toggle()',
        '        await asyncio.sleep_ms(ms)',
        '',
        'async def watch_button():',
        '    count = 0',
        '    last = 1',
        '    while True:',
        '        now = button.value()',
        '        if last == 1 and now == 0:',
        '            count = count + 1',
        '            print("press", count)',
        '        last = now',
        '        await asyncio.sleep_ms(10)',
        '',
        'async def main():',
        '    asyncio.create_task(blink(led, 500))',
        '    asyncio.create_task(blink(board_led, 130))',
        '    await watch_button()',
        '',
        'asyncio.run(main())'
      ],
      explain: [
        E([1], 'השורה הזו טוענת את ספריית [[asyncio|asyncio]]. היא חלק מ-MicroPython, ולכן אין צורך להתקין שום דבר.', 'The [[asyncio|asyncio]] library. It is part of MicroPython, nothing to install.'),
        E([8, 11], 'זו משימה שמהבהבת פין. היא כתובה כמו לולאה רגילה, אבל במקום `sleep` יש `await asyncio.sleep_ms`, שפירושו: "אני ממתינה, ובינתיים משימות אחרות יכולות לרוץ".', 'A task that blinks a pin. It is written like a plain loop, but instead of `sleep` there is `await asyncio.sleep_ms`: "I am waiting, and meanwhile let other tasks run".'),
        E([13, 22], 'זו משימה שמזהה לחיצות, כמו בשיעור R1. גם היא מוותרת על התור שלה כל 10 אלפיות שנייה.', 'A task that catches presses, as in lesson R1. It too gives up its turn every 10 milliseconds.'),
        E([24, 27], 'הפונקציה הראשית מפעילה שתי משימות הבהוב (אותה פונקציה, עם פין וקצב שונים), ואחר כך מריצה את משימת הכפתור.', 'The main function starts two blink tasks (the same function, with a different pin and pace), and then runs the button task.'),
        E([29], 'כאן הכול מתחיל. `asyncio.run` מריץ את `main` ואת כל המשימות שהיא יצרה, עד שעוצרים את התוכנית.', 'Starts it all. `asyncio.run` runs `main` and every task it created, until the program is stopped.')
      ],
      expect: B('הלד שעל GP15 מהבהב כל חצי שנייה, הלד שעל הלוח מהבהב מהר, וכל לחיצה מדפיסה "press" ומספר. אף אחד מהם לא מעכב את האחרים.', 'The LED on GP15 blinks every half second, the board\'s LED blinks fast, and every press prints "press" and a number. None of them holds up the others.'),
      tasks: [
        { t: B('בשורה 11, החליפו את `await asyncio.sleep_ms(ms)` ב-`time.sleep_ms(ms)` (והוסיפו `import time`). מה קורה, ולמה?', 'In line 11, replace `await asyncio.sleep_ms(ms)` with `time.sleep_ms(ms)` (and add `import time`). What happens, and why?'),
          hint: B('המשימה הראשונה אף פעם לא מוותרת על התור, ולכן היא חוסמת את כל השאר: רק הלד הראשון מהבהב, והכפתור לא מגיב.', 'The first task never gives up its turn. It blocks all the others: only the first LED blinks, and the button does not respond.') },
        { t: B('הוסיפו משימה רביעית שמדפיסה כל 5 שניות כמה זמן התוכנית כבר רצה.', 'Add a fourth task that prints every 5 seconds how long the program has been running.'),
          code: ['async def report():', '    seconds = 0', '    while True:', '        await asyncio.sleep(5)', '        seconds = seconds + 5', '        print("running for", seconds, "s")', '', '# in main(): asyncio.create_task(report())'] },
        { t: B('גרמו לכפתור לשנות את קצב ההבהוב של הלד שעל GP15: כל לחיצה מחליפה בין 500 ל-100 אלפיות שנייה.', 'Make the button change the blink pace of the LED on GP15: each press switches between 500 and 100 milliseconds.'),
          hint: B('שמרו את הקצב במשתנה גלובלי, למשל `pace = 500`. משימת ההבהוב קוראת אותו בכל סיבוב (`await asyncio.sleep_ms(pace)`), ומשימת הכפתור משנה אותו.', 'Keep the pace in a global variable, for example `pace = 500`. The blink task reads it on every round (`await asyncio.sleep_ms(pace)`), and the button task changes it.') }
      ],
      quiz: [
        Q(B('מה עושה `await asyncio.sleep_ms(500)`?', 'What does `await asyncio.sleep_ms(500)` do?'), [B('עוצר את כל הלוח לחצי שנייה', 'Stops the whole board for half a second'), B('המשימה הזו ממתינה, ובינתיים המשימות האחרות רצות', 'This task waits, and meanwhile the other tasks run'), B('מאיץ את התוכנית', 'Speeds up the program')], 1, B('`await` מוותר על התור. רק המשימה שבה הוא כתוב ממתינה, ושאר המשימות ממשיכות.', '`await` gives up the turn. Only the task that wrote it waits, and the other tasks carry on.')),
        Q(B('יש שלוש דרכים לעשות כמה דברים יחד: `ticks_ms`, פסיקה ו-asyncio. מה נכון?', 'There are three ways to do several things together: `ticks_ms`, an interrupt and asyncio. What is true?'), [B('רק asyncio עובד באמת', 'Only asyncio really works'), B('כולן עובדות. בוחרים לפי הפרויקט: פסיקה לאירוע שאסור לפספס, ו-asyncio להרבה משימות', 'They all work. Choose by project: an interrupt for an event that must not be missed, asyncio for many tasks'), B('פסיקה תמיד עדיפה', 'An interrupt is always best')], 1, B('לכל דרך יש מקום. בפרויקטים גדולים משלבים ביניהן: פסיקה רושמת אירוע, ומשימות asyncio מטפלות בו.', 'Each way has its place. Big projects combine them: an interrupt notes an event, and asyncio tasks handle it.'))
      ]
    },
    /* ------------------------------------------------------------ W1 */
    {
      id: 'W1', track: 'W',
      title: B('מתחברים ל-Wi-Fi', 'Connecting to Wi-Fi'),
      goal: B('ה-Pico 2 W מתחבר לרשת ה-[[wifi|Wi-Fi]] ומדפיס את [[ip|כתובת ה-IP]] שקיבל. בזמן ההתחברות הלד שעל הלוח מהבהב, וכשהחיבור מצליח הוא נשאר דולק.', 'The Pico 2 W connects to the [[wifi|Wi-Fi]] network and prints the [[ip|IP address]] it got. While connecting the board\'s LED blinks, and once connected it stays on.'),
      learn: [
        B('איך מפעילים את רכיב ה-Wi-Fi עם `network.WLAN`, ואיך מתחברים לרשת.', 'To switch on the Wi-Fi part with `network.WLAN` and connect to a network.'),
        B('איך קוראים את מצב החיבור עם `status()`, ומבינים למה הוא נכשל.', 'To read the connection state with `status()` and understand why it failed.'),
        B('איך קובעים קוד מדינה, כדי שהשבב ישתמש בערוצים שמותרים בארץ.', 'To set a country code, so the chip uses the channels allowed in your country.')
      ],
      before: [
        { href: '#/start', label: B('העמוד "מתחילים", בורר הלוחות', 'The "Get started" page, the board picker'), why: B('שם נמצא הקובץ הנכון ל-Pico 2 W.', 'The right file for the Pico 2 W is there.') },
        BASICS('pico2', 'יסודות: מה שונה ב-Pico 2', 'Basics: What is different on the Pico 2', 'שם מוסבר למה בלוח W הלד הוא `Pin("LED")`.', 'It explains why on a W board the LED is `Pin("LED")`.')
      ],
      parts: [{ text: NEED_W }, { text: NET }],
      steps: [
        FW, B('אין מה לחבר, כי משתמשים רק בלוח עצמו.', 'Nothing to wire. Only the board itself is used.'),
        CREDS, BAND, RUN,
        B('חכו עד 10 שניות. בזמן הזה הלד מהבהב, ומודפס "waiting" עם מספר המצב.', 'Wait up to 10 seconds. Meanwhile the LED blinks and "waiting" is printed with the state number.'),
        B('רשמו את הכתובת שהודפסה, כי תצטרכו אותה בשיעור הבא.', 'Write down the address that was printed. You will need it in the next lesson.'),
        READ
      ],
      code: [
        'import network',
        'from machine import Pin',
        'from time import sleep',
        '',
        'SSID = "your-network"',
        'PASSWORD = "your-password"',
        '',
        'network.country("IL")',
        'led = Pin("LED", Pin.OUT)',
        'wlan = network.WLAN(network.STA_IF)',
        'wlan.active(True)',
        'wlan.connect(SSID, PASSWORD)',
        '',
        'for i in range(20):',
        '    status = wlan.status()',
        '    if status == network.STAT_GOT_IP or status < 0:',
        '        break',
        '    print("waiting...", status)',
        '    led.toggle()',
        '    sleep(0.5)',
        '',
        'if wlan.isconnected():',
        '    led.on()',
        '    print("connected, address:", wlan.ifconfig()[0])',
        'else:',
        '    led.off()',
        '    print("failed, status:", wlan.status())'
      ],
      explain: [
        E([1], 'הספרייה `network` קיימת רק בקושחה של לוח W. על Pico 2 רגיל השורה הזו נכשלת.', 'The `network` library exists only in the W board\'s firmware. On a plain Pico 2 this line fails.'),
        E([5, 6], 'אלה שם הרשת והסיסמה. אל תשמרו קובץ עם סיסמה אמיתית במקום ציבורי, למשל במאגר קוד פתוח.', 'The network name and password. Do not keep a file with a real password somewhere public, such as an open code repository.'),
        E([8], 'זה קוד המדינה: "IL" פירושו ישראל. בלעדיו השבב משתמש בהגדרה כללית, ולפעמים לא רואה חלק מהרשתות.', 'The country code. "IL" for Israel. Without it the chip uses a general setting, and sometimes does not see some networks.'),
        E([10, 12], 'במצב STA ("תחנה") הלוח מתחבר לרשת קיימת, כמו טלפון. השורות האלה מפעילות את הרכיב ומבקשות ממנו להתחבר.', 'STA ("station") mode: the board joins an existing network, like a phone. Switch the part on and ask it to connect.'),
        E([14, 20], 'כאן ממתינים עד 10 שניות. `status()` מחזיר 1 בזמן ההתחברות, 3 כשהתקבלה כתובת, ומספר שלילי כשהחיבור נכשל. בינתיים הלד מהבהב.', 'Wait up to 10 seconds. `status()` returns 1 while connecting, 3 once an address was given, and a negative number when the connection failed. Meanwhile the LED blinks.'),
        E([22, 27], 'כאן בודקים את התוצאה. `ifconfig()[0]` הוא הכתובת שהנתב נתן ללוח.', 'Check the result. `ifconfig()[0]` is the address the router gave the board.')
      ],
      expect: B('אחרי כמה שניות מודפס "connected, address:" ואחריו כתובת כמו 192.168.1.37, והלד שעל הלוח נשאר דולק. אם מודפס "failed", המספר שאחריו מסביר למה (ראו את האתגר הראשון).', 'After a few seconds "connected, address:" is printed followed by an address such as 192.168.1.37, and the board\'s LED stays on. If "failed" is printed, the number after it explains why (see the first challenge).'),
      tasks: [
        { t: B('שנו בכוונה את הסיסמה, ואחר כך את שם הרשת, והריצו. איזה מספר מודפס בכל מקרה?', 'Change the password on purpose, and then the network name, and run. What number is printed in each case?'),
          hint: B('3- פירושו סיסמה שגויה, 2- פירושו שהרשת לא נמצאה, ו-1- הוא כישלון אחר. אם לא מודפס מספר שלילי, אלא החיבור פשוט לא מסתיים תוך 10 שניות, הגדילו את `range(20)`.', '-3 is a wrong password, -2 is a network that was not found, and -1 is another failure. If there is no negative number and the connection simply does not finish in 10 seconds, raise `range(20)`.') },
        { t: B('הדפיסו את עוצמת הקליטה. התרחקו מהנתב, וראו איך המספר משתנה.', 'Print the signal strength. Move away from the router and see how the number changes.'),
          hint: B('`wlan.status("rssi")` מחזיר מספר שלילי בדציבלים. 50- היא קליטה טובה, ו-80- היא קליטה חלשה.', '`wlan.status("rssi")` returns a negative number in decibels. -50 is good reception, -80 weak.'),
          code: ['from time import sleep', '', 'while True:', '    print("signal:", wlan.status("rssi"), "dBm")', '    sleep(1)'] },
        { t: B('כתבו את שם הרשת ואת הסיסמה בקובץ נפרד בשם `secrets.py` על הלוח, וייבאו אותם משם. כך אפשר לשתף את הקוד בלי הסיסמה.', 'Write the network name and password in a separate file named `secrets.py` on the board, and import them from there. That way the code can be shared without the password.'),
          code: ['# secrets.py (saved on the board)', 'SSID = "your-network"', 'PASSWORD = "your-password"', '', '# main program', 'from secrets import SSID, PASSWORD'] }
      ],
      quiz: [
        Q(B('הקוד נכשל בשורה `import network` עם `ImportError`. מה הסיבה הסבירה?', 'The code fails at `import network` with `ImportError`. What is the likely reason?'), [B('על הלוח מותקנת קושחה של Pico 2 רגיל, בלי Wi-Fi', 'The board has plain Pico 2 firmware, without Wi-Fi'), B('הסיסמה שגויה', 'The password is wrong'), B('הנתב כבוי', 'The router is off')], 0, B('הספרייה `network` נמצאת רק בקושחה של W. סיסמה שגויה או נתב כבוי מתגלים רק בהמשך, דרך `status()`.', 'The `network` library is only in the W firmware. A wrong password or a router that is off show up only later, in `status()`.')),
        Q(B('`wlan.status()` מחזיר 3-. מה בודקים?', '`wlan.status()` returns -3. What do you check?'), [B('את הסיסמה', 'The password'), B('את הכבל', 'The cable'), B('את קוד המדינה', 'The country code')], 0, B('3- פירושו סיסמה שגויה. בדקו אותיות גדולות וקטנות, ורווחים.', '-3 means a wrong password. Check capital and small letters and spaces.'))
      ]
    },
    /* ------------------------------------------------------------ W2 */
    {
      id: 'W2', track: 'W',
      title: B('שולטים בלד מהטלפון', 'Controlling an LED from a phone'),
      goal: B('ה-Pico 2 W מריץ [[webserver|שרת אינטרנט]] קטן. פתחו את הכתובת שלו בדפדפן של הטלפון: הקשה על "On" או על "Off" מדליקה או מכבה את הלד שעל הלוח.', 'The Pico 2 W runs a small [[webserver|web server]]. Open its address in the phone\'s browser, and tapping "On" or "Off" turns the board\'s LED on or off.'),
      learn: [
        B('איך פותחים שקע (socket) וממתינים לחיבורים מדפדפן.', 'To open a socket and wait for connections from a browser.'),
        B('איך קוראים את השורה הראשונה של בקשת HTTP, ומבינים איזה דף התבקש.', 'To read the first line of an HTTP request and tell which page was asked for.'),
        B('איך שולחים בחזרה דף HTML קטן.', 'To send a small HTML page back.')
      ],
      before: [LESSON('W1', 'שם מתחברים לרשת ומקבלים את הכתובת.', 'That is where you connect to the network and get the address.')],
      parts: [{ text: NEED_W }, { text: NET }, { text: B('טלפון או מחשב שמחובר לאותה רשת', 'A phone or computer joined to the same network') }],
      steps: [
        B('אין מה לחבר, כי משתמשים רק בלוח עצמו.', 'Nothing to wire. Only the board itself is used.'),
        CREDS, RUN,
        B('חכו להדפסה "open http://" ואחריה כתובת.', 'Wait for the print "open http://" followed by an address.'),
        B('חברו את הטלפון לאותה רשת, ופתחו בדפדפן שלו את הכתובת שהודפסה (כולל `http://`).', 'Join the phone to the same network, and open the printed address in its browser (including `http://`).'),
        B('הקישו על On ועל Off, והסתכלו על הלד שעל הלוח.', 'Tap On and Off, and watch the board\'s LED.'),
        READ
      ],
      code: [
        'import network, socket',
        'from machine import Pin',
        'from time import sleep',
        '',
        'SSID = "your-network"',
        'PASSWORD = "your-password"',
        '',
        'led = Pin("LED", Pin.OUT)',
        'network.country("IL")',
        CONNECT[0], CONNECT[1], CONNECT[2], CONNECT[3], CONNECT[4], CONNECT[5], CONNECT[6],
        '',
        'PAGE = """<!DOCTYPE html><html><head>',
        '<meta name="viewport" content="width=device-width">',
        '<title>Pico</title></head><body style="font-family:sans-serif">',
        '<h1>LED: %s</h1>',
        '<p><a href="/on">On</a> &nbsp; <a href="/off">Off</a></p>',
        '</body></html>"""',
        '',
        'server = socket.socket()',
        'server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)',
        'server.bind(("0.0.0.0", 80))',
        'server.listen(1)',
        '',
        'while True:',
        '    client, addr = server.accept()',
        '    request = client.recv(1024).decode()',
        '    parts = request.split(" ")',
        '    path = parts[1] if len(parts) > 1 else "/"',
        '    if path == "/on":',
        '        led.on()',
        '    elif path == "/off":',
        '        led.off()',
        '    state = "ON" if led.value() else "OFF"',
        '    client.send("HTTP/1.0 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n")',
        '    client.send(PAGE % state)',
        '    client.close()'
      ],
      explain: [
        E([10, 16], 'זה החיבור לרשת, כמו בשיעור W1 אבל בקיצור: ממתינים עד שיש חיבור או שגיאה, ומדפיסים את הכתובת.', 'Connecting to the network, as in lesson W1 but shorter: wait until there is a connection or an error, and print the address.'),
        E([18, 23], 'זה הדף שנשלח לדפדפן. `%s` מסמן את המקום שבו ייכנס מצב הלד (ON או OFF). שני הקישורים מבקשים את הדפים `/on` ו-`/off`.', 'The page sent to the browser. `%s` is a spot where the LED\'s state (ON or OFF) will go. The two links ask for the pages `/on` and `/off`.'),
        E([25, 28], 'השורות האלה פותחות [[webserver|שרת]] על פורט 80, הפורט הרגיל של דפי אינטרנט. `SO_REUSEADDR` מאפשר להריץ את התוכנית שוב מיד אחרי שעוצרים אותה.', 'Opens a [[webserver|server]] on port 80, the usual port for web pages. `SO_REUSEADDR` lets you run again right after stopping.'),
        E([31], '`accept` ממתין עד שדפדפן מתחבר. זו שורה [[blocking|חוסמת]]: כל עוד אף אחד לא מתחבר, התוכנית עומדת כאן.', '`accept` waits until a browser connects. It is a [[blocking|blocking]] line: as long as nobody connects, the program stands here.'),
        E([32, 34], 'כאן קוראים את הבקשה. השורה הראשונה שלה נראית כמו `GET /on HTTP/1.1`, והמילה השנייה בה היא הדף שהתבקש.', 'Reads the request. Its first line looks like `GET /on HTTP/1.1`, and its second word is the page that was asked for.'),
        E([35, 38], 'לפי הדף שהתבקש, מדליקים או מכבים את הלד.', 'Turns the LED on or off according to the page.'),
        E([39, 42], 'כאן שולחים כותרת HTTP קצרה, אחריה את הדף עם המצב הנוכחי, וסוגרים את החיבור.', 'Sends a short HTTP header, then the page with the current state, and closes the connection.')
      ],
      expect: B('בדפדפן מופיע דף עם הכותרת "LED: OFF" ושני קישורים. הקשה על On מדליקה את הלד שעל הלוח, והכותרת משתנה ל-"LED: ON". הקשה על Off מכבה אותו.', 'The browser shows a page headed "LED: OFF" with two links. Tapping On turns the board\'s LED on and the heading changes to "LED: ON". Tapping Off turns it off.'),
      tasks: [
        { t: B('הדף לא נפתח בטלפון. עברו על הרשימה: האם הטלפון מחובר לאותה רשת? האם כתבתם `http://` ולא `https://`? האם התוכנית עדיין רצה?', 'The page does not open on the phone. Go through the list: is the phone on the same network? Did you write `http://` and not `https://`? Is the program still running?'),
          hint: B('דפדפנים רבים מוסיפים `https` מעצמם, אבל השרת הזה מבין רק `http`. ברשת אורחים, לפעמים מכשירים לא יכולים לדבר זה עם זה.', 'Many browsers add `https` by themselves. This server understands only `http`. On a guest network, devices sometimes cannot talk to each other.') },
        { t: B('הדפיסו כל בקשה שמגיעה. למה מגיעה גם בקשה ל-`/favicon.ico`?', 'Print every request that comes in. Why does a request for `/favicon.ico` come too?'),
          hint: B('הדפדפן מבקש מעצמו את הסמל הקטן של האתר. השרת עונה לו עם אותו דף, וזה לא מזיק.', 'The browser asks by itself for the site\'s small icon. The server answers it with the same page, which does no harm.') },
        { t: B('חברו לד חיצוני ל-GP15 דרך נגד, והוסיפו בשבילו את הקישורים `/led2on` ו-`/led2off`.', 'Wire an outside LED to GP15 through a resistor, and add the links `/led2on` and `/led2off` for it.') }
      ],
      quiz: [
        Q(B('השורה הראשונה של הבקשה היא `GET /off HTTP/1.1`. מה התוכנית עושה?', 'The first line of the request is `GET /off HTTP/1.1`. What does the program do?'), [B('מדליקה את הלד', 'Turns the LED on'), B('מכבה את הלד ושולחת דף עם OFF', 'Turns the LED off and sends a page with OFF'), B('לא כלום', 'Nothing')], 1, B('המילה השנייה היא `/off`, ולכן הלד נכבה, והדף מציג את המצב החדש.', 'The second word is `/off`, so the LED goes off, and the page shows the new state.')),
        Q(B('בזמן ש-`server.accept()` ממתין, מה עוד התוכנית יכולה לעשות?', 'While `server.accept()` is waiting, what else can the program do?'), [B('כל דבר, במקביל', 'Anything, in parallel'), B('כלום: השורה חוסמת עד שמישהו מתחבר', 'Nothing: the line blocks until someone connects'), B('רק להבהב', 'Only blink')], 1, B('`accept` חוסם. כדי לעשות דברים נוספים בזמן ההמתנה, משתמשים ב-asyncio, כמו במסלול R.', '`accept` blocks. To do other things while waiting, use asyncio, as in track R.'))
      ]
    },
    /* ------------------------------------------------------------ W3 */
    {
      id: 'W3', track: 'W',
      title: B('מדידה שמתעדכנת בדפדפן', 'A measurement that updates in the browser'),
      goal: B('הלוח מודד את הטמפרטורה בעזרת החיישן שבתוך השבב, ודף בדפדפן מציג אותה ומתעדכן מעצמו כל שתי שניות, בלי לרענן.', 'The board measures the temperature with the sensor inside the chip, and a page in the browser shows it and updates by itself every two seconds, without reloading.'),
      learn: [
        B('איך קוראים את חיישן הטמפרטורה הפנימי דרך `ADC(4)`.', 'To read the internal temperature sensor through `ADC(4)`.'),
        B('איך שולחים נתונים בפורמט JSON, שהדפדפן יודע לקרוא.', 'To send data as JSON, which the browser can read.'),
        B('איך מפרידים בין הדף עצמו (שנשלח פעם אחת) לבין הנתונים (שמתבקשים שוב ושוב).', 'To separate the page itself (sent once) from the data (asked for again and again).')
      ],
      before: [LESSON('W2', 'אותו שרת, עם דף אחר.', 'The same server, with another page.'), LESSON('B1', 'שם למדנו מה `read_u16` מחזיר.', 'That is where we learned what `read_u16` returns.')],
      parts: [{ text: NEED_W }, { text: NET }, { text: B('טלפון או מחשב שמחובר לאותה רשת', 'A phone or computer joined to the same network') }],
      steps: [
        B('אין מה לחבר, כי החיישן נמצא בתוך השבב.', 'Nothing to wire. The sensor is inside the chip.'),
        CREDS, RUN,
        B('פתחו בדפדפן את הכתובת שהודפסה. אחר כך פתחו גם את הכתובת עם `/data` בסופה, וראו מה הלוח שולח.', 'Open the printed address in the browser. Then also open the address with `/data` at the end, and see what the board sends.'),
        B('הניחו אצבע על השבב הגדול שבמרכז הלוח למשך חצי דקה, והסתכלו על הדף.', 'Put a finger on the big chip in the middle of the board for half a minute, and watch the page.'),
        READ
      ],
      code: [
        'import network, socket, json',
        'from machine import Pin, ADC',
        'from time import sleep, ticks_ms',
        '',
        'SSID = "your-network"',
        'PASSWORD = "your-password"',
        '',
        'sensor = ADC(4)                 # the temperature sensor inside the chip',
        '',
        'def temperature():',
        '    volts = sensor.read_u16() * 3.3 / 65535',
        '    return 27 - (volts - 0.706) / 0.001721',
        '',
        'network.country("IL")',
        CONNECT[0], CONNECT[1], CONNECT[2], CONNECT[3], CONNECT[4], CONNECT[5], CONNECT[6],
        '',
        'PAGE = """<!DOCTYPE html><html><head>',
        '<meta name="viewport" content="width=device-width"><title>Pico</title></head>',
        '<body style="font-family:sans-serif"><h1>Pico 2 W</h1>',
        '<p>Temperature: <b id="t">...</b> C</p>',
        '<script>',
        'async function update() {',
        '  const r = await fetch("/data");',
        '  const d = await r.json();',
        '  document.getElementById("t").textContent = d.t.toFixed(1);',
        '}',
        'update();',
        'setInterval(update, 2000);',
        '</script></body></html>"""',
        '',
        'server = socket.socket()',
        'server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)',
        'server.bind(("0.0.0.0", 80))',
        'server.listen(1)',
        '',
        'while True:',
        '    client, addr = server.accept()',
        '    request = client.recv(1024).decode()',
        '    parts = request.split(" ")',
        '    path = parts[1] if len(parts) > 1 else "/"',
        '    if path == "/data":',
        '        body = json.dumps({"t": temperature(), "ms": ticks_ms()})',
        '        kind = "application/json"',
        '    else:',
        '        body = PAGE',
        '        kind = "text/html"',
        '    client.send("HTTP/1.0 200 OK\\r\\nContent-Type: " + kind + "\\r\\n\\r\\n")',
        '    client.send(body)',
        '    client.close()'
      ],
      explain: [
        E([8], 'ערוץ 4 של ה-ADC מחובר בתוך השבב לחיישן טמפרטורה, ולכן אין צורך בשום רכיב.', 'Channel 4 of the ADC is wired inside the chip to a temperature sensor. No part is needed.'),
        E([10, 12], 'הפונקציה הופכת את הקריאה למתח, ואת המתח למעלות, לפי הנוסחה שבמסמכי השבב. החיישן מודד את החום של השבב עצמו, ולכן הוא מראה בדרך כלל כמה מעלות יותר מהטמפרטורה בחדר.', 'Turns the reading into volts, and volts into degrees, by the formula in the chip\'s documents. The sensor measures the heat of the chip itself, so it usually shows a few degrees more than the room.'),
        E([23, 35], 'זה הדף. בתוכו יש תוכנית JavaScript קטנה שרצה בדפדפן: כל 2 שניות היא מבקשת מהלוח את `/data`, ומעדכנת רק את המספר.', 'The page. Inside it is a small JavaScript program that runs in the browser: every 2 seconds it asks the board for `/data` and updates only the number.'),
        E([47, 49], 'בקשה ל-`/data` מקבלת JSON קצר, למשל `{"t": 31.2, "ms": 51230}`. זה הפורמט שהדפדפן קורא בעזרת `r.json()`.', 'A request for `/data` gets a short JSON, for example `{"t": 31.2, "ms": 51230}`. That is the format the browser reads with `r.json()`.'),
        E([50, 52], 'כל בקשה אחרת מקבלת את הדף עצמו.', 'Any other request gets the page itself.'),
        E([53, 55], 'כאן שולחים כותרת עם סוג התוכן הנכון, אחריה את התוכן, וסוגרים את החיבור.', 'Sends a header with the right content type, the content, and closes.')
      ],
      expect: B('בדפדפן מופיעה הטמפרטורה, בדרך כלל בין 25 ל-35 מעלות, והיא מתעדכנת כל שתי שניות בלי לרענן את הדף. כשמחממים את השבב באצבע, המספר עולה לאט. הכתובת עם `/data` מציגה שורת JSON.', 'The browser shows the temperature, usually 25 to 35 degrees, and it updates every two seconds without reloading the page. Warming the chip with a finger makes the number rise slowly. The address with `/data` shows a line of JSON.'),
      tasks: [
        { t: B('הוסיפו ל-JSON את הזמן שעבר מאז ההדלקה בשניות, והציגו אותו בדף בשורה נוספת.', 'Add the time since power-up in seconds to the JSON, and show it on the page in another line.'),
          hint: B('ב-Python: `"up": ticks_ms() // 1000`. בדף: עוד `<b id="up">`, ובפונקציה `update` עוד שורה שמעדכנת אותו.', 'In Python: `"up": ticks_ms() // 1000`. On the page: another `<b id="up">`, and in the `update` function another line that sets it.') },
        { t: B('החליפו את החיישן הפנימי בחיישן אמיתי משיעור קודם, למשל ה-DHT22 משיעור C4, ושלחו גם את הלחות.', 'Replace the internal sensor with a real sensor from an earlier lesson, for example the DHT22 from lesson C4, and send humidity too.') },
        { t: B('המדידה הפנימית קופצת. החליקו אותה: חשבו ממוצע של 20 קריאות לפני כל שליחה.', 'The internal measurement jumps. Smooth it: average 20 readings before each send.'),
          code: ['def temperature():', '    total = 0', '    for i in range(20):', '        total = total + sensor.read_u16()', '    volts = total / 20 * 3.3 / 65535', '    return 27 - (volts - 0.706) / 0.001721'] }
      ],
      quiz: [
        Q(B('למה הדף מבקש את `/data` כל שתי שניות, במקום שהלוח ישלח את כל הדף מחדש?', 'Why does the page ask for `/data` every two seconds, instead of the board sending the whole page again?'), [B('כי כך נשלחים מעט נתונים, והדף לא מהבהב', 'Because that way little data is sent, and the page does not flicker'), B('כי הלוח לא יכול לשלוח HTML פעמיים', 'Because the board cannot send HTML twice'), B('אין סיבה', 'There is no reason')], 0, B('הדף נשלח פעם אחת. אחר כך עוברים רק כמה תווים של JSON, והדפדפן מעדכן רק את המספר.', 'The page is sent once. After that only a few characters of JSON travel, and the browser updates only the number.')),
        Q(B('החיישן הפנימי מראה 33 מעלות בחדר שבו יש 25 מעלות. למה?', 'The internal sensor shows 33 degrees in a 25-degree room. Why?'), [B('החיישן מקולקל', 'The sensor is broken'), B('הוא מודד את החום של השבב עצמו, שמתחמם כשהוא עובד', 'It measures the heat of the chip itself, which warms up while it works'), B('קוד המדינה שגוי', 'The country code is wrong')], 1, B('החיישן נמצא בתוך השבב, ושבב שעובד (במיוחד עם Wi-Fi) חם יותר מהאוויר שסביבו. כדי למדוד את טמפרטורת החדר, משתמשים בחיישן חיצוני.', 'The sensor is inside the chip, and a working chip (especially with Wi-Fi) is warmer than the air around it. To measure a room, use an outside sensor.'))
      ]
    }
  ];

  lessons.forEach(function (l) { P.lessons.push(l); });

  /* links from earlier lessons to the basics chapters 16 to 20 (data-basics-5.js) */
  var CH = {
    semis: [B('יסודות: טרנזיסטור, דיודה וקבל', 'Basics: Transistor, diode and capacitor'), B('שם מוסבר למה העומס מקבל חשמל ממקור משלו, ולמה יש דיודה ליד הסליל.', 'It explains why the load gets power from its own source, and why there is a diode next to the coil.')],
    states: [B('יסודות: מכונת מצבים', 'Basics: State machines'), B('שם מוסבר איך מסדרים תוכנית עם כמה מצבים.', 'It explains how to organise a program with several states.')],
    datasheet: [B('יסודות: איך קוראים דף נתונים', 'Basics: How to read a datasheet'), B('שם מוסבר מאיפה מגיעות הפקודות והנוסחאות שבקוד.', 'It explains where the commands and formulas in the code come from.')],
    module: [B('יסודות: מודול משלכם', 'Basics: Your own module'), B('שם מוסבר מה יש בתוך קובץ ספרייה כמו זה.', 'It explains what is inside a library file like this one.')],
    longrun: [B('יסודות: פרויקט שרץ לבד לאורך זמן', 'Basics: A project that runs by itself for a long time'), B('שם מוסבר מה עושים כשהפרויקט צריך לעבוד ימים בלי מחשב.', 'It explains what to do when the project must run for days without a computer.')]
  };
  var LINK = { E1: 'semis', E2: 'semis', H1: 'semis', H4: 'semis', F4: 'states', D1: 'states', G2: 'datasheet', H3: 'datasheet', G1: 'module', D2: 'longrun' };
  P.lessons.forEach(function (l) {
    var id = LINK[l.id];
    if (id) (l.before = l.before || []).push({ href: '#/basics/' + id, label: CH[id][0], why: CH[id][1] });
  });
})(window.PICO);
