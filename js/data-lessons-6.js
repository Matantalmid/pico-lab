/* Lesson tracks, part 6.
   Track S ("Engineering skills"): S1 a state machine, S2 machine.Timer, S3 filtering and hysteresis,
   S4 a 74HC595 shift register, S5 a DS18B20 on one-wire, S6 parsing GPS sentences. It comes after track R.
   Plus one lesson for five catalog parts that had none, placed at the end of their tracks:
   E5 soil moisture and a relay, F5 an IR remote and an RGB LED, F6 an LCD1602 message board,
   G5 a microSD data logger, H8 an MPU6050 spirit level on the OLED.
   Same structure as data-lessons-3.js. Breadboard pictures: data-layouts-2.js; Wokwi circuits: wokwi.js. */
(function (P) {
  'use strict';
  var x = P._l, B = x.B, E = x.E, Q = x.Q, W = x.W, UNPLUG = x.UNPLUG, PLUG = x.PLUG, RUN = x.RUN, READ = x.READ, RES = x.RES;
  var OUT = function (q, code, answer, why) { return { type: 'output', q: q, code: code, answer: answer, why: why }; };
  var ORD = function (q, lines, why) { return { type: 'order', q: q, lines: lines, why: why }; };
  var FILL = function (q, code, a, ok, why) { return { type: 'fill', q: q, code: code, a: a, ok: ok, why: why }; };
  var LESSON = function (id, whyHe, whyEn) { return { href: '#/lessons/' + id, label: B('שיעור ' + id, 'Lesson ' + id), why: whyHe ? B(whyHe, whyEn) : null }; };
  var BASICS = function (id, he, en, whyHe, whyEn) { return { href: '#/basics/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var PART = function (id, he, en, whyHe, whyEn) { return { href: '#/components/' + id, label: B(he, en), why: whyHe ? B(whyHe, whyEn) : null }; };
  var CLEAR = B('פנו את המטריצה מהשיעור הקודם.', 'Clear the breadboard of the previous lesson.');
  var RAILS = B('הזנה ואדמה עוברות דרך הפסים שלאורך המטריצה, כמו בציור. לחצו על "בנו צעד אחר צעד" מעל הציור כדי לראות כל חוט בתורו.', 'Power and ground run through the rails along the breadboard, as in the picture. Click "Build it step by step" above the picture to see each wire in turn.');

  P.glossary.onewire = { cat: 'io', t: B('One-Wire (חוט אחד)', 'One-Wire'), d: B('ממשק שבו כל התקשורת עוברת על חוט נתונים אחד, ועוד אדמה. לכל רכיב יש מספר זיהוי ייחודי, ולכן אפשר לחבר כמה רכיבים לאותו חוט.', 'An interface where all the communication goes over a single data wire, plus ground. Each part has a unique ID number, so several parts can share the same wire.') };
  P.glossary.hysteresis = { cat: 'sw', t: B('היסטרזיס (hysteresis)', 'Hysteresis'), d: B('שימוש בשני ספים במקום סף אחד: מדליקים מתחת לסף הנמוך, ומכבים רק מעל הסף הגבוה. כך רעש קטן במדידה לא מחליף מצב שוב ושוב.', 'Using two thresholds instead of one: switch on below the low one, and off only above the high one. That way a little noise in the reading does not switch back and forth.') };
  P.glossary.shiftreg = { cat: 'hw', t: B('אוגר הזזה (shift register)', 'Shift register'), d: B('שבב שמקבל ביטים אחד אחרי השני על חוט אחד, ומוציא אותם יחד על כמה פינים. 74HC595 הופך 3 פינים של ה-Pico ל-8 יציאות.', 'A chip that takes bits one after another on one wire, and puts them out together on several pins. The 74HC595 turns 3 Pico pins into 8 outputs.') };

  /* track S comes right after track R */
  var at = 0;
  P.tracks.forEach(function (t, i) { if (t.id === 'R') at = i + 1; });
  P.tracks.splice(at, 0, { id: 'S', color: '--c-sys', title: B('מיומנויות של מהנדס', 'Engineering skills'),
    desc: B('מכונת מצבים, טיימר, סינון של מדידות, אוגר הזזה, חיישן על חוט אחד ופענוח של נתוני GPS. הכלים שמבדילים פרויקט שעובד מפרויקט שעובד היטב.', 'A state machine, a timer, filtering readings, a shift register, a one-wire sensor and parsing GPS data. The tools that tell a project that works from one that works well.') });

  var POT_ROWS = [
    W(B('פוטנציומטר, רגל אמצעית', 'Potentiometer, middle leg'), 'GP26', 31, null, B('כפתור סיבוב', 'Knob')),
    W(B('פוטנציומטר, רגליים קיצוניות', 'Potentiometer, outer legs'), '3V3', 36, B('והשנייה לפין 33, AGND', 'and the other to pin 33, AGND'), '3.3V'),
    W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
    W(B('לד, רגל קצרה', 'LED, short leg'), 'GND', 18, null, 'GND')
  ];
  var B2_BUILD = B('בנו את המעגל של שיעור B2: פוטנציומטר על GP26, ולד על GP15 דרך נגד. אם הוא עוד בנוי, השאירו אותו.', 'Build the circuit of lesson B2: a potentiometer on GP26, and an LED on GP15 through a resistor. If it is still built, keep it.');

  var trackS = [
    /* ------------------------------------------------------------ S1 */
    {
      id: 'S1', track: 'S',
      title: B('רמזור להולכי רגל', 'A pedestrian crossing'),
      goal: B('רמזור לרכבים עם כפתור להולכי רגל. לחיצה לא עוצרת את התנועה מיד: הירוק לרכבים נשאר לפחות 5 שניות, ואז צהוב, אדום עם אור להולכי הרגל, ואור מהבהב לפני שהרכבים חוזרים לנסוע. כל זה כתוב כמכונת מצבים.', 'A traffic light for cars with a button for pedestrians. A press does not stop the traffic at once: the cars\' green stays on for at least 5 seconds, then yellow, red with a light for pedestrians, and a blinking light before the cars move again. It is all written as a state machine.'),
      learn: [
        B('איך מתכננים מכונת מצבים בטבלה, ואחר כך כותבים אותה בקוד.', 'How to plan a state machine in a table, and then write it in code.'),
        B('איך מודדים כמה זמן עבר מאז שנכנסו למצב, בלי `sleep` ארוך.', 'How to measure how long it has been since a state began, without a long `sleep`.'),
        B('איך זוכרים אירוע (לחיצה) עד שמגיע הזמן לטפל בו.', 'How to remember an event (a press) until the time comes to handle it.')
      ],
      before: [
        BASICS('states', 'יסודות: מכונת מצבים', 'Basics: State machines', 'כאן מוסבר הרעיון, והשיעור הוא התרגול שלו.', 'The idea is explained there, and this lesson is the practice.'),
        LESSON('A2', 'שלושת הלדים של הרמזור נשארים על אותם פינים.', 'The three traffic-light LEDs stay on the same pins.'), LESSON('R1')
      ],
      parts: [{ id: 'led', qty: 4, note: B('אדום, צהוב, ירוק, ולד רביעי להולכי הרגל', 'red, yellow, green, and a fourth LED for pedestrians') }, { id: 'button', qty: 1 }, { text: B('ארבעה נגדים של 330Ω', 'Four 330 Ω resistors') }],
      wiring: [
        W(B('לד אדום, רגל ארוכה', 'Red LED, long leg'), 'GP15', 20, RES, B('אדום', 'Red')),
        W(B('לד צהוב, רגל ארוכה', 'Yellow LED, long leg'), 'GP14', 19, RES, B('צהוב', 'Yellow')),
        W(B('לד ירוק, רגל ארוכה', 'Green LED, long leg'), 'GP13', 17, RES, B('ירוק', 'Green')),
        W(B('לד הולכי הרגל, רגל ארוכה', 'Pedestrian LED, long leg'), 'GP12', 16, RES, B('הולכי רגל', 'Walk')),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP16', 21, null, B('כפתור', 'Button')),
        W(B('כל הרגליים הקצרות + הרגל השנייה של הכפתור', 'All the short legs + the button\'s other leg'), 'GND', 18, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [UNPLUG, B('בנו את הרמזור של שיעור A2, אם הוא לא בנוי.', 'Build the traffic light of lesson A2, if it is not built.'),
        B('הוסיפו לד רביעי על GP12 דרך נגד, וכפתור בין GP16 לפס האדמה.', 'Add a fourth LED on GP12 through a resistor, and a button between GP16 and the ground rail.'),
        RAILS, PLUG, RUN,
        B('חכו כמה שניות, ולחצו על הכפתור. עקבו אחרי הסדר: ירוק, צהוב, אדום עם האור להולכי הרגל, ואור מהבהב.', 'Wait a few seconds, and press the button. Follow the order: green, yellow, red with the pedestrian light, and the blinking light.'),
        READ],
      code: [
        'from machine import Pin',
        'from time import ticks_ms, ticks_diff, sleep_ms',
        '',
        'red = Pin(15, Pin.OUT)',
        'yellow = Pin(14, Pin.OUT)',
        'green = Pin(13, Pin.OUT)',
        'walk = Pin(12, Pin.OUT)',
        'button = Pin(16, Pin.IN, Pin.PULL_UP)',
        '',
        'GO, SLOW, WALK, HURRY = 0, 1, 2, 3',
        'state = GO',
        'since = ticks_ms()       # when the current state began',
        'asked = False            # a pedestrian pressed the button',
        '',
        'def lights(r, y, g, w):',
        '    red.value(r)',
        '    yellow.value(y)',
        '    green.value(g)',
        '    walk.value(w)',
        '',
        'def go_to(new):',
        '    global state, since',
        '    state = new',
        '    since = ticks_ms()',
        '',
        'while True:',
        '    if button.value() == 0:',
        '        asked = True',
        '    t = ticks_diff(ticks_ms(), since)',
        '',
        '    if state == GO:',
        '        lights(0, 0, 1, 0)',
        '        if asked and t > 5000:',
        '            go_to(SLOW)',
        '    elif state == SLOW:',
        '        lights(0, 1, 0, 0)',
        '        if t > 2000:',
        '            go_to(WALK)',
        '    elif state == WALK:',
        '        lights(1, 0, 0, 1)',
        '        if t > 5000:',
        '            go_to(HURRY)',
        '    elif state == HURRY:',
        '        lights(1, 0, 0, (t // 250) % 2)',
        '        if t > 2000:',
        '            asked = False',
        '            go_to(GO)',
        '    sleep_ms(20)'
      ],
      explain: [
        E([10, 13], 'ארבעה מצבים, והמשתנים שהמכונה זוכרת: באיזה מצב היא, מתי נכנסה אליו, והאם מישהו לחץ.', 'Four states, and what the machine remembers: which state it is in, when it entered it, and whether someone pressed.'),
        E([15, 19], 'פונקציה שמדליקה את ארבעת הלדים בבת אחת, כדי שכל מצב יקבע אותם בשורה אחת.', 'A function that sets all four LEDs at once, so each state sets them in one line.'),
        E([21, 24], 'מעבר למצב חדש: שומרים את המצב ואת הרגע שבו התחיל. `global` נחוץ, כי הפונקציה משנה משתנים שמחוץ לה.', 'Moving to a new state: keep the state and the moment it began. `global` is needed, because the function changes variables outside it.'),
        E([27, 29], 'לחיצה נרשמת ב-`asked` בכל מצב, ולא הולכת לאיבוד. `t` הוא הזמן שעבר מאז תחילת המצב הנוכחי.', 'A press is recorded in `asked` in any state, and is never lost. `t` is the time since the current state began.'),
        E([31, 34], 'ירוק לרכבים. עוברים לצהוב רק אם מישהו ביקש, וגם עברו 5 שניות לפחות.', 'Green for the cars. Move to yellow only if someone asked, and at least 5 seconds have passed.'),
        E([43, 47], 'האור להולכי הרגל מהבהב: `(t // 250) % 2` מתחלף בין 0 ל-1 כל רבע שנייה. בסוף מוחקים את הבקשה וחוזרים לירוק.', 'The pedestrian light blinks: `(t // 250) % 2` switches between 0 and 1 every quarter second. At the end the request is cleared and it goes back to green.')
      ],
      expect: B('הירוק דולק עד שלוחצים. אחרי הלחיצה (ואחרי 5 שניות של ירוק לפחות): צהוב 2 שניות, אדום עם האור להולכי הרגל 5 שניות, האור להולכי הרגל מהבהב 2 שניות, ושוב ירוק. לחיצה בזמן שהולכי הרגל עוברים לא משנה כלום.', 'Green stays on until a press. After the press (and at least 5 seconds of green): yellow for 2 seconds, red with the pedestrian light for 5 seconds, the pedestrian light blinking for 2 seconds, and green again. A press while pedestrians are crossing changes nothing.'),
      tasks: [
        { t: B('כתבו בטבלה את ארבעת המצבים: מה דולק בכל אחד, ואיזה אירוע מעביר למצב הבא. השוו לקוד.', 'Write the four states in a table: what is lit in each, and which event moves to the next. Compare with the code.') },
        { t: B('הוסיפו זמזם שמצפצף בקצב מהיר כל זמן שהולכי הרגל יכולים לעבור, כמו ברמזורים אמיתיים.', 'Add a buzzer that beeps fast for as long as pedestrians may cross, as at real crossings.'),
          hint: B('במצב `WALK` הפעילו ונתקו את הזמזם לפי `(t // 100) % 2`, ובשאר המצבים כבו אותו.', 'In the `WALK` state switch the buzzer on and off by `(t // 100) % 2`, and switch it off in the other states.') },
        { t: B('מצב לילה: לחיצה ארוכה, יותר משתי שניות, מעבירה למצב שבו הצהוב מהבהב בלבד. לחיצה ארוכה נוספת מחזירה למצב הרגיל.', 'Night mode: a long press, over two seconds, moves to a state where only yellow blinks. Another long press returns to normal.'),
          hint: B('צריך מצב חמישי, `NIGHT`, ומשתנה שזוכר מתי הכפתור נלחץ. בכל סיבוב בודקים כמה זמן הוא כבר לחוץ.', 'You need a fifth state, `NIGHT`, and a variable that remembers when the button went down. On each round check how long it has been held.') }
      ],
      quiz: [
        Q(B('מישהו לוחץ כשהירוק דולק כבר דקה. מתי יופיע הצהוב?', 'Someone presses when green has been on for a minute. When does yellow appear?'),
          [B('כמעט מיד, כי כבר עברו יותר מ-5 שניות', 'Almost at once, since more than 5 seconds have passed'), B('אחרי 5 שניות מרגע הלחיצה', '5 seconds after the press'), B('רק אחרי לחיצה שנייה', 'Only after a second press')], 0,
          B('התנאי הוא `asked and t > 5000`, ו-`t` נמדד מתחילת המצב, לא מהלחיצה.', 'The condition is `asked and t > 5000`, and `t` is measured from the start of the state, not from the press.')),
        OUT(B('מה מדפיס החישוב של ההבהוב, אחרי 600 אלפיות שנייה במצב HURRY?', 'What does the blink calculation print, 600 milliseconds into the HURRY state?'),
          ['t = 600', 'print((t // 250) % 2)'], '0',
          B('600 // 250 הוא 2, ו-2 % 2 הוא 0, ולכן האור כבוי ברגע הזה.', '600 // 250 is 2, and 2 % 2 is 0, so the light is off at this moment.')),
        FILL(B('השלימו את השורה שחסרה בפונקציה שמעבירה למצב חדש.', 'Complete the missing line in the function that moves to a new state.'),
          ['def go_to(new):', '    global state, since', '    state = new', '    ___'],
          ['since = ticks_ms()', 'sleep_ms(20)', 'asked = False', 'state = GO'], 0,
          B('כל מצב סופר זמן מהרגע שבו התחיל, ולכן במעבר שומרים את הזמן הנוכחי.', 'Each state counts time from the moment it began, so the current time is stored on every move.'))
      ]
    },
    /* ------------------------------------------------------------ S2 */
    {
      id: 'S2', track: 'S',
      title: B('טיימר: עבודה בקצב קבוע', 'A timer: work at a steady pace'),
      goal: B('שני טיימרים עובדים ברקע: אחד מהבהב את הלד פעמיים בשנייה, והשני דוגם את הפוטנציומטר עשר פעמים בשנייה. הלולאה הראשית רק מדפיסה פעם בשנייה את הממוצע.', 'Two timers work in the background: one blinks the LED twice a second, and the other samples the potentiometer ten times a second. The main loop only prints the average once a second.'),
      learn: [
        B('איך מפעילים פונקציה בקצב קבוע עם `machine.Timer`.', 'How to run a function at a steady pace with `machine.Timer`.'),
        B('למה דגימה בקצב קבוע חשובה כשמחשבים ממוצע.', 'Why sampling at a steady pace matters when you compute an average.'),
        B('איך עוצרים טיימר עם `deinit`.', 'How to stop a timer with `deinit`.')
      ],
      before: [LESSON('B2', 'בונים את אותו מעגל.', 'Build the same circuit.'), BASICS('interrupts', 'יסודות: פסיקות וטיימרים', 'Basics: Interrupts and timers', 'שם מוצג הטיימר לראשונה.', 'The timer is first shown there.')],
      parts: [{ id: 'pot', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      wiring: POT_ROWS,
      steps: [B2_BUILD, PLUG, RUN,
        B('סובבו את הפוטנציומטר לאט, והסתכלו על הממוצע שמודפס. שימו לב שהלד ממשיך להבהב בקצב קבוע, למרות שבלולאה אין שום שורה שמהבהבת.', 'Turn the potentiometer slowly, and watch the printed average. Notice that the LED keeps blinking at a steady pace, though no line in the loop blinks it.'),
        B('כדי לעצור, לחצו Stop ב-Thonny. אם הלד ממשיך להבהב, נתקו וחברו את הכבל.', 'To stop, press Stop in Thonny. If the LED keeps blinking, unplug and replug the cable.'),
        READ],
      code: [
        'from machine import Pin, ADC, Timer',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        'pot = ADC(26)',
        'samples = []',
        '',
        'def blink(t):',
        '    led.toggle()',
        '',
        'def sample(t):',
        '    samples.append(pot.read_u16())',
        '',
        'blinker = Timer(period=500, mode=Timer.PERIODIC, callback=blink)',
        'sampler = Timer(period=100, mode=Timer.PERIODIC, callback=sample)',
        '',
        'while True:',
        '    sleep(1)',
        '    n = len(samples)',
        '    average = sum(samples) // n if n else 0',
        '    samples.clear()',
        '    print(n, "samples, average", average)'
      ],
      explain: [
        E([8, 12], 'שתי פונקציות שהטיימרים יקראו להן. הפרמטר `t` הוא הטיימר עצמו, והן לא צריכות אותו.', 'Two functions the timers will call. The parameter `t` is the timer itself, and they do not need it.'),
        E([14], 'טיימר שקורא ל-`blink` כל 500 אלפיות שנייה, שוב ושוב (`PERIODIC`).', 'A timer that calls `blink` every 500 milliseconds, again and again (`PERIODIC`).'),
        E([15], 'טיימר שני, שקורא ל-`sample` כל 100 אלפיות שנייה, כלומר עשר פעמים בשנייה.', 'A second timer, calling `sample` every 100 milliseconds, that is ten times a second.'),
        E([17, 22], 'הלולאה הראשית עושה מעט מאוד: פעם בשנייה היא מחשבת את הממוצע של מה שנאסף, מנקה את הרשימה ומדפיסה.', 'The main loop does very little: once a second it averages what was collected, clears the list and prints.')
      ],
      expect: B('הלד מתחלף פעמיים בשנייה, בקצב קבוע. פעם בשנייה מודפסת שורה כמו "10 samples, average 32780", והממוצע עוקב אחרי הפוטנציומטר.', 'The LED switches twice a second, at a steady pace. Once a second a line such as "10 samples, average 32780" is printed, and the average follows the potentiometer.'),
      tasks: [
        { t: B('הוסיפו ללולאה `sleep(3)` במקום `sleep(1)`. כמה דגימות מודפסות? האם ההבהוב השתנה?', 'Put `sleep(3)` in the loop instead of `sleep(1)`. How many samples are printed? Did the blinking change?'),
          hint: B('בערך 30 דגימות, וההבהוב לא השתנה: הטיימרים לא תלויים בלולאה.', 'About 30 samples, and the blinking did not change: the timers do not depend on the loop.') },
        { t: B('הוסיפו טיימר חד-פעמי (`Timer.ONE_SHOT`) שמכבה את טיימר ההבהוב אחרי 10 שניות.', 'Add a one-time timer (`Timer.ONE_SHOT`) that stops the blink timer after 10 seconds.'),
          code: ['def stop(t):', '    blinker.deinit()', '    led.off()', '', 'stopper = Timer(period=10000, mode=Timer.ONE_SHOT, callback=stop)'] }
      ],
      quiz: [
        Q(B('מה עושה `Timer(period=100, mode=Timer.PERIODIC, callback=sample)`?', 'What does `Timer(period=100, mode=Timer.PERIODIC, callback=sample)` do?'),
          [B('קורא ל-`sample` כל 100 אלפיות שנייה, בלי קשר ללולאה', 'Calls `sample` every 100 milliseconds, whatever the loop is doing'), B('מחכה 100 שניות', 'Waits 100 seconds'), B('קורא ל-`sample` פעם אחת', 'Calls `sample` once')], 0,
          B('`PERIODIC` פירושו שוב ושוב. `ONE_SHOT` פירושו פעם אחת.', '`PERIODIC` means again and again. `ONE_SHOT` means once.')),
        OUT(B('כמה פעמים בשנייה יקרא טיימר עם `period=250`?', 'How many times a second does a timer with `period=250` fire?'),
          ['period = 250', 'print(1000 // period)'], '4',
          B('בשנייה יש 1000 אלפיות שנייה, ו-1000 חלקי 250 הם 4.', 'A second is 1000 milliseconds, and 1000 divided by 250 is 4.')),
        Q(B('למה עדיף לדגום בטיימר ולא ב-`sleep` בתוך הלולאה?', 'Why sample with a timer rather than with a `sleep` in the loop?'),
          [B('הקצב נשאר קבוע, גם כשהלולאה עושה עבודה שלוקחת זמן', 'The pace stays steady, even when the loop does work that takes time'), B('הטיימר מדויק יותר ב-ADC', 'The timer makes the ADC more precise'), B('אין הבדל', 'There is no difference')], 0,
          B('עם `sleep`, כל עבודה נוספת בלולאה מאטה את הדגימה. הטיימר לא מושפע מזה.', 'With `sleep`, any extra work in the loop slows the sampling. The timer is not affected by it.'))
      ]
    },
    /* ------------------------------------------------------------ S3 */
    {
      id: 'S3', track: 'S',
      title: B('סינון רעש ותרמוסטט שלא מקפץ', 'Filtering noise, and a thermostat that does not flicker'),
      goal: B('הפוטנציומטר משחק תפקיד של מד טמפרטורה, והלד הוא "תנור". מסננים את הרעש עם חציון של 5 מדידות, ומשתמשים בשני ספים, כך שהתנור לא נדלק ונכבה שוב ושוב ליד הסף.', 'The potentiometer plays a thermometer, and the LED is a "heater". The noise is filtered with a median of 5 readings, and two thresholds are used, so the heater does not switch on and off again and again near the threshold.'),
      learn: [
        B('איך חציון מסנן קפיצה בודדת במדידה.', 'How a median filters out a single jump in a reading.'),
        B('מה זה [[hysteresis|hysteresis]], ולמה תרמוסטט אמיתי משתמש בו.', 'What [[hysteresis|hysteresis]] is, and why a real thermostat uses it.'),
        B('איך שומרים חלון של המדידות האחרונות ברשימה.', 'How to keep a window of the latest readings in a list.')
      ],
      before: [LESSON('B3', 'שם ראינו את הבעיה: הלד מהבהב ליד הסף.', 'That is where we saw the problem: the LED flickers near the threshold.'), LESSON('B2', 'בונים את אותו מעגל.', 'Build the same circuit.')],
      parts: [{ id: 'pot', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 330Ω', 'A 330 Ω resistor') }],
      wiring: POT_ROWS,
      steps: [B2_BUILD, PLUG, RUN,
        B('סובבו לאט מתחת ל-40%: הלד נדלק. סובבו לאט למעלה: הלד נשאר דולק עד שעוברים את 50%.', 'Turn slowly below 40%: the LED lights. Turn slowly upwards: the LED stays on until you pass 50%.'),
        B('נסו לעצור את הפוטנציומטר בדיוק על 45%. הלד לא מהבהב, ונשאר במצב שבו היה.', 'Try to stop the potentiometer at exactly 45%. The LED does not flicker, and stays as it was.'),
        READ],
      code: [
        'from machine import Pin, ADC',
        'from time import sleep_ms',
        '',
        'pot = ADC(26)',
        'heater = Pin(15, Pin.OUT)',
        '',
        'window = []',
        'ON_BELOW = 40       # percent: switch the heater on below this',
        'OFF_ABOVE = 50      # percent: switch it off only above this',
        '',
        'def median(values):',
        '    s = sorted(values)',
        '    return s[len(s) // 2]',
        '',
        'while True:',
        '    raw = pot.read_u16() * 100 // 65535',
        '    window.append(raw)',
        '    if len(window) > 5:',
        '        window.pop(0)',
        '    level = median(window)',
        '',
        '    if level < ON_BELOW:',
        '        heater.on()',
        '    elif level > OFF_ABOVE:',
        '        heater.off()',
        '    print(raw, level, heater.value())',
        '    sleep_ms(100)'
      ],
      explain: [
        E([8, 9], 'שני ספים במקום אחד. בין 40 ל-50 התוכנית לא משנה כלום, והתנור נשאר במצב שבו היה.', 'Two thresholds instead of one. Between 40 and 50 the program changes nothing, and the heater stays as it was.'),
        E([11, 13], 'החציון: ממיינים את המדידות ולוקחים את האמצעית. מדידה אחת שקפצה רחוק נשארת בקצה הרשימה הממוינת, ולא משפיעה.', 'The median: sort the readings and take the middle one. One reading that jumped far stays at the end of the sorted list, and has no effect.'),
        E([17, 20], 'החלון: מוסיפים את המדידה החדשה, ואם יש יותר מ-5, מוחקים את הישנה ביותר.', 'The window: add the new reading, and if there are more than 5, delete the oldest.'),
        E([22, 25], 'ההחלטה. אין `else`: בין שני הספים לא עושים כלום, וזה כל הסוד.', 'The decision. There is no `else`: between the two thresholds nothing is done, and that is the whole trick.')
      ],
      expect: B('מודפסות שלוש עמודות: המדידה, הערך המסונן ומצב התנור. ליד 45% המדידה רועדת קצת, אבל התנור לא מהבהב. הוא נדלק מתחת ל-40, ונכבה רק מעל 50.', 'Three columns are printed: the reading, the filtered value and the heater\'s state. Near 45% the reading shakes a little, but the heater does not flicker. It switches on below 40, and off only above 50.'),
      tasks: [
        { t: B('החליפו את שני הספים בסף אחד, 45, עם `else`. עצרו על 45% ותראו מה קורה ללד.', 'Replace the two thresholds with a single one, 45, with an `else`. Stop at 45% and see what happens to the LED.'),
          hint: B('הלד יתחיל להבהב: כל רעד קטן במדידה עובר את הסף לכיוון אחר.', 'The LED will start flickering: each little shake in the reading crosses the threshold the other way.') },
        { t: B('החליפו את החציון בממוצע נע של 5 מדידות. מה ההבדל כשמסובבים את הפוטנציומטר מהר?', 'Replace the median with a moving average of 5 readings. What is the difference when the potentiometer is turned fast?'),
          code: ['def average(values):', '    return sum(values) // len(values)'],
          hint: B('ממוצע מגיב בהדרגה, ומושפע מכל מדידה. חציון מתעלם מקפיצה בודדת, אבל מגיב לשינוי אמיתי אחרי שלוש מדידות.', 'An average responds gradually, and every reading affects it. A median ignores a single jump, but follows a real change after three readings.') }
      ],
      quiz: [
        OUT(B('מה החציון של חמש המדידות האלה? אחת מהן קפצה.', 'What is the median of these five readings? One of them jumped.'),
          ['def median(values):', '    s = sorted(values)', '    return s[len(s) // 2]', '', 'print(median([44, 46, 99, 45, 44]))'], '45',
          B('ממוינות: 44, 44, 45, 46, 99. האמצעית היא 45, והקפיצה ל-99 לא השפיעה.', 'Sorted: 44, 44, 45, 46, 99. The middle one is 45, and the jump to 99 had no effect.')),
        Q(B('התנור כבוי, והמדידה המסוננת היא 45. מה קורה?', 'The heater is off, and the filtered reading is 45. What happens?'),
          [B('התנור נשאר כבוי', 'The heater stays off'), B('התנור נדלק', 'The heater switches on'), B('התנור מהבהב', 'The heater flickers')], 0,
          B('45 נמצא בין שני הספים, ולכן התוכנית לא משנה את המצב.', '45 lies between the two thresholds, so the program does not change the state.')),
        ORD(B('סדרו את השורות ששומרות חלון של 5 המדידות האחרונות.', 'Put in order the lines that keep a window of the last 5 readings.'),
          ['raw = pot.read_u16() * 100 // 65535', 'window.append(raw)', 'if len(window) > 5:', '    window.pop(0)', 'level = median(window)'],
          B('קודם מודדים ומוסיפים, אחר כך מוחקים את הישנה אם החלון התמלא, ורק אז מחשבים.', 'First measure and add, then delete the oldest if the window is full, and only then compute.'))
      ]
    },
    /* ------------------------------------------------------------ S4 */
    {
      id: 'S4', track: 'S',
      title: B('שמונה לדים על שלושה פינים', 'Eight LEDs on three pins'),
      goal: B('[[shiftreg|אוגר הזזה]] 74HC595 מקבל ביטים מה-Pico על שלושה חוטים, ומדליק לפיהם שמונה לדים. אור רץ עובר מלד ללד, וכל תבנית היא מספר אחד בין 0 ל-255.', 'A 74HC595 [[shiftreg|shift register]] takes bits from the Pico on three wires, and lights eight LEDs by them. A running light moves from LED to LED, and each pattern is a single number from 0 to 255.'),
      learn: [
        B('איך שולחים ביטים אחד אחרי השני עם שעון.', 'How to send bits one after another with a clock.'),
        B('איך מספר אחד מתאר שמונה לדים, וגלגול ביטים עם `<<`.', 'How one number describes eight LEDs, and moving bits with `<<`.'),
        B('למה יש פין "תפס" (latch) שמחליף את כל היציאות יחד.', 'Why there is a "latch" pin that changes all the outputs together.')
      ],
      before: [BASICS('bits', 'יסודות: ביטים, בתים ומספרים', 'Basics: Bits, bytes and numbers', 'כאן נדרש הכי הרבה ממה שנלמד שם.', 'This lesson uses most of what is taught there.'), LESSON('A2')],
      parts: [{ id: 'hc595', qty: 1 }, { id: 'led', qty: 8 }, { text: B('שמונה נגדים של 330Ω, וכ-20 חוטי גישור', 'Eight 330 Ω resistors, and about 20 jumper wires') }],
      wiring: [
        W(B('74HC595, רגל 14 (DS, נתונים)', '74HC595, leg 14 (DS, data)'), 'GP10', 14, null, 'DS'),
        W(B('74HC595, רגל 11 (SHCP, שעון)', '74HC595, leg 11 (SHCP, clock)'), 'GP11', 15, null, B('שעון', 'Clock')),
        W(B('74HC595, רגל 12 (STCP, תפס)', '74HC595, leg 12 (STCP, latch)'), 'GP12', 16, null, B('תפס', 'Latch')),
        W(B('74HC595, רגל 16 (VCC) ורגל 10 (MR)', '74HC595, leg 16 (VCC) and leg 10 (MR)'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('74HC595, רגל 8 (GND) ורגל 13 (OE)', '74HC595, leg 8 (GND) and leg 13 (OE)'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND')
      ],
      steps: [UNPLUG, CLEAR,
        B('הכניסו את השבב מעל התעלה שבאמצע המטריצה. החריץ הקטן בקצה מסמן את הצד של רגל 1. הרגליים ממוספרות נגד כיוון השעון: 1 עד 8 בצד אחד, ו-9 עד 16 חוזרות בצד השני.', 'Push the chip in across the channel in the middle of the breadboard. The small notch at one end marks the side of leg 1. The legs are numbered anticlockwise: 1 to 8 down one side, and 9 to 16 back up the other.'),
        B('חברו לפי הטבלה את חמשת החיבורים ל-Pico. רגל 10 (MR) מחוברת לפלוס, כדי שהשבב לא יתאפס, ורגל 13 (OE) לאדמה, כדי שהיציאות יפעלו.', 'Make the five connections to the Pico from the table. Leg 10 (MR) goes to plus, so the chip does not reset, and leg 13 (OE) to ground, so the outputs are enabled.'),
        B('היציאות הן רגל 15 (Q0) ורגליים 1 עד 7 (Q1 עד Q7). מכל יציאה חברו נגד ללד, ואת הרגל הקצרה של כל לד לפס האדמה.', 'The outputs are leg 15 (Q0) and legs 1 to 7 (Q1 to Q7). From each output wire a resistor to an LED, and each LED\'s short leg to the ground rail.'),
        B('בציור המטריצה, הלדים של Q7 עד Q1 נמצאים בחצי התחתון, משמאל לימין, באותו סדר שבו קוראים מספר בינארי. הלד של Q0 נמצא בחצי העליון, בצד ימין. יש כאן הרבה חוטים, ולכן כדאי לבנות לפי הציור צעד אחר צעד.', 'In the breadboard picture the LEDs for Q7 to Q1 sit on the bottom half, left to right, in the order a binary number is read. The LED for Q0 sits on the top half, on the right. There are many wires here, so it helps to build from the picture step by step.'),
        PLUG, RUN, READ],
      code: [
        'from machine import Pin',
        'from time import sleep',
        '',
        'data = Pin(10, Pin.OUT)',
        'clock = Pin(11, Pin.OUT)',
        'latch = Pin(12, Pin.OUT)',
        '',
        'def write(byte):',
        '    latch.off()',
        '    for i in range(8):',
        '        data.value((byte >> (7 - i)) & 1)     # the highest bit first',
        '        clock.on()',
        '        clock.off()',
        '    latch.on()                                # all 8 outputs change together',
        '',
        'pattern = 0b00000001',
        'while True:',
        '    write(pattern)',
        '    pattern = pattern << 1',
        '    if pattern > 0b10000000:',
        '        pattern = 0b00000001',
        '    sleep(0.1)'
      ],
      explain: [
        E([8, 14], 'שליחה של בית אחד. כל סיבוב שם ביט אחד על קו הנתונים, ופולס בשעון מכניס אותו לשבב. בסוף, התפס מעביר את שמונת הביטים ליציאות בבת אחת.', 'Sending one byte. Each round puts one bit on the data line, and a pulse on the clock pushes it into the chip. At the end, the latch passes all eight bits to the outputs at once.'),
        E([11], '`(byte >> (7 - i)) & 1` מוציא ביט אחד מהמספר: קודם ביט 7, ובסוף ביט 0.', '`(byte >> (7 - i)) & 1` takes one bit out of the number: bit 7 first, bit 0 last.'),
        E([16], 'התבנית ההתחלתית: רק הביט הנמוך דולק, כלומר הלד הראשון.', 'The starting pattern: only the lowest bit is on, that is the first LED.'),
        E([19, 21], 'מזיזים את הביט מקום אחד שמאלה, ללד הבא. אחרי הלד השמיני חוזרים להתחלה.', 'Shift the bit one place left, to the next LED. After the eighth LED go back to the start.')
      ],
      expect: B('לד אחד דולק בכל רגע, והאור רץ מהלד הראשון לשמיני וחוזר להתחלה, עשר פעמים בשנייה.', 'One LED is lit at a time, and the light runs from the first LED to the eighth and back to the start, ten times a second.'),
      tasks: [
        { t: B('הדליקו כל לד שני: 0b10101010. אחר כך החליפו כל חצי שנייה בין התבנית הזו לתבנית ההפוכה.', 'Light every other LED: 0b10101010. Then switch every half second between this pattern and its opposite.'),
          hint: B('את התבנית ההפוכה מקבלים עם `pattern ^ 0xFF`, שהופך כל ביט.', 'Get the opposite pattern with `pattern ^ 0xFF`, which flips every bit.') },
        { t: B('מד עוצמה: חברו פוטנציומטר ל-GP26, והדליקו מספר לדים שמתאים למיקום שלו (0 עד 8).', 'A level meter: wire a potentiometer to GP26, and light a number of LEDs that matches its position (0 to 8).'),
          code: ['from machine import ADC', 'pot = ADC(26)', '', 'while True:', '    n = pot.read_u16() * 9 // 65536      # 0 to 8', '    write((1 << n) - 1)                   # n ones from the bottom', '    sleep(0.05)'] }
      ],
      quiz: [
        OUT(B('אילו לדים דולקים? כתבו את התבנית בבסיס 2.', 'Which LEDs are lit? Write the pattern in base 2.'),
          ['pattern = 0b00000100', 'pattern = pattern << 2', 'print(bin(pattern))'], '0b10000',
          B('ההזזה שמאלה בשני מקומות מעבירה את הביט ממקום 2 למקום 4. `bin` לא מדפיס אפסים מובילים.', 'Shifting left by two places moves the bit from place 2 to place 4. `bin` does not print leading zeros.')),
        Q(B('למה צריך את פין התפס (STCP)?', 'Why is the latch pin (STCP) needed?'),
          [B('כדי שכל שמונת הלדים יתחלפו יחד, ולא יהבהבו בזמן שהביטים נכנסים', 'So all eight LEDs change together, instead of flickering while the bits go in'), B('כדי לספק חשמל ללדים', 'To power the LEDs'), B('כדי לאפס את השבב', 'To reset the chip')], 0,
          B('בזמן שהביטים נכנסים הם עוברים מקום אחרי מקום. התפס מציג רק את התוצאה הסופית.', 'While the bits go in they move place after place. The latch shows only the final result.')),
        FILL(B('השלימו את השורה שמכניסה את הביט שעל קו הנתונים לתוך השבב.', 'Complete the line that pushes the bit on the data line into the chip.'),
          ['for i in range(8):', '    data.value((byte >> (7 - i)) & 1)', '    ___', '    clock.off()'],
          ['clock.on()', 'latch.on()', 'data.on()', 'sleep(1)'], 0,
          B('השבב קורא את קו הנתונים כשהשעון עולה מ-0 ל-1.', 'The chip reads the data line when the clock rises from 0 to 1.'))
      ]
    },
    /* ------------------------------------------------------------ S5 */
    {
      id: 'S5', track: 'S',
      title: B('מדחום על חוט אחד', 'A thermometer on one wire'),
      goal: B('החיישן DS18B20 מודד טמפרטורה ומדבר עם ה-Pico על חוט נתונים אחד. התוכנית מציגה את הטמפרטורה, זוכרת את הנמוכה והגבוהה ביותר, ומדליקה לד כשחם מדי.', 'The DS18B20 sensor measures temperature and talks to the Pico on a single data wire. The program shows the temperature, remembers the lowest and highest, and lights an LED when it is too hot.'),
      learn: [
        B('איך עובד הממשק [[onewire|One-Wire]], ולמה צריך נגד משיכה.', 'How the [[onewire|One-Wire]] interface works, and why it needs a pull-up resistor.'),
        B('איך מוצאים את החיישנים שעל החוט עם `scan`.', 'How to find the sensors on the wire with `scan`.'),
        B('איך שומרים מינימום ומקסימום תוך כדי מדידה.', 'How to keep a minimum and a maximum while measuring.')
      ],
      before: [PART('ds18b20', 'העמוד של DS18B20', 'The DS18B20\'s page', 'שם מוסבר החיווט, כולל הנגד.', 'The wiring is explained there, including the resistor.'), { href: '#/interfaces/onewire', label: B('הממשק One-Wire', 'The One-Wire interface') }],
      parts: [{ id: 'ds18b20', qty: 1 }, { id: 'led', qty: 1 }, { text: B('נגד 4.7kΩ ונגד 330Ω', 'A 4.7 kΩ resistor and a 330 Ω resistor') }],
      wiring: [
        W(B('DS18B20, VDD (אדום)', 'DS18B20, VDD (red)'), '3V3', 36, null, '3.3V'),
        W(B('DS18B20, DQ (צהוב)', 'DS18B20, DQ (yellow)'), 'GP7', 10, B('ועוד נגד 4.7kΩ מ-DQ ל-VDD', 'plus a 4.7 kΩ resistor from DQ to VDD'), 'DQ'),
        W(B('DS18B20, GND (שחור)', 'DS18B20, GND (black)'), 'GND', 8, null, 'GND'),
        W(B('לד, רגל ארוכה', 'LED, long leg'), 'GP15', 20, RES, B('לד', 'LED')),
        W(B('לד, רגל קצרה', 'LED, short leg'), 'GND', 18, null, 'GND')
      ],
      steps: [UNPLUG, CLEAR,
        B('חברו את החיישן כמו בעמוד שלו בקטלוג, כולל נגד 4.7kΩ בין DQ ל-VDD. בלי הנגד, הסריקה לא תמצא שום חיישן.', 'Wire the sensor as on its catalog page, including a 4.7 kΩ resistor between DQ and VDD. Without the resistor, the scan finds no sensor.'),
        B('הוסיפו לד על GP15 דרך נגד 330Ω.', 'Add an LED on GP15 through a 330 Ω resistor.'),
        PLUG, RUN,
        B('החזיקו את החיישן בין האצבעות חצי דקה, והסתכלו על המספרים. כשהטמפרטורה עוברת 28 מעלות, הלד נדלק.', 'Hold the sensor between your fingers for half a minute, and watch the numbers. When the temperature passes 28 degrees, the LED lights.'),
        READ],
      code: [
        'import onewire, ds18x20',
        'from machine import Pin',
        'from time import sleep_ms',
        '',
        'ds = ds18x20.DS18X20(onewire.OneWire(Pin(7)))',
        'alarm = Pin(15, Pin.OUT)',
        'roms = ds.scan()',
        'print("sensors found:", len(roms))',
        '',
        'ALARM = 28',
        'low, high = 200, -200',
        '',
        'while True:',
        '    ds.convert_temp()',
        '    sleep_ms(750)',
        '    t = ds.read_temp(roms[0])',
        '    low = min(low, t)',
        '    high = max(high, t)',
        '    alarm.value(t > ALARM)',
        '    print("%.2f C   min %.2f   max %.2f" % (t, low, high))'
      ],
      explain: [
        E([1], 'שתי ספריות שכבר נמצאות ב-MicroPython: אחת לממשק One-Wire, ואחת לחיישן עצמו.', 'Two libraries already inside MicroPython: one for the One-Wire interface, and one for the sensor itself.'),
        E([5], 'השורה מגדירה את GP7 כחוט ה-One-Wire, ומחברת אליו את הספרייה של החיישן.', 'This line makes GP7 the One-Wire line, and attaches the sensor library to it.'),
        E([7, 8], '`scan` מחזיר את מספר הזיהוי של כל חיישן שעל החוט. אם מודפס 0, בדקו את הנגד ואת החיווט.', '`scan` returns the ID number of each sensor on the wire. If 0 is printed, check the resistor and the wiring.'),
        E([11], 'ערכי התחלה שבטוח יוחלפו: כל מדידה אמיתית נמוכה מ-200 וגבוהה מ-200-.', 'Starting values that are sure to be replaced: every real reading is below 200 and above −200.'),
        E([14, 16], 'מבקשים מדידה, מחכים 750 אלפיות שנייה כמו שכתוב בדף הנתונים, וקוראים את התוצאה מהחיישן הראשון.', 'Ask for a measurement, wait 750 milliseconds as the datasheet says, and read the result from the first sensor.'),
        E([17, 19], 'מעדכנים מינימום ומקסימום, ומדליקים את הלד אם חם מדי.', 'Update the minimum and maximum, and light the LED if it is too hot.')
      ],
      expect: B('מודפס "sensors found: 1", ואחריו כל שנייה בערך שורה עם הטמפרטורה, המינימום והמקסימום. כשמחממים את החיישן ביד, המספר עולה, ומעל 28 מעלות הלד נדלק.', '"sensors found: 1" is printed, and then about every second a line with the temperature, the minimum and the maximum. When the sensor is warmed by hand the number rises, and above 28 degrees the LED lights.'),
      tasks: [
        { t: B('חברו חיישן DS18B20 שני לאותו חוט, והדפיסו את שתי הטמפרטורות.', 'Connect a second DS18B20 to the same wire, and print both temperatures.'),
          hint: B('`scan` יחזיר שני מספרי זיהוי. עברו עליהם בלולאה `for rom in roms:`. נגד 4.7kΩ אחד מספיק לכל החוט.', '`scan` will return two ID numbers. Go over them with a `for rom in roms:` loop. One 4.7 kΩ resistor is enough for the whole wire.') },
        { t: B('הוסיפו [[hysteresis|hysteresis]] להתראה, כמו בשיעור S3: הלד נדלק מעל 28 ונכבה רק מתחת ל-27.', 'Add [[hysteresis|hysteresis]] to the alarm, as in lesson S3: the LED lights above 28 and goes off only below 27.') }
      ],
      quiz: [
        Q(B('`scan` מחזיר רשימה ריקה. מה בודקים קודם?', '`scan` returns an empty list. What do you check first?'),
          [B('את נגד ה-4.7kΩ בין DQ ל-VDD, ואת החיווט', 'The 4.7 kΩ resistor between DQ and VDD, and the wiring'), B('את מספר החיישנים בקוד', 'The number of sensors in the code'), B('את ערך ה-ALARM', 'The ALARM value')], 0,
          B('בלי נגד המשיכה, החוט לא עולה ל-1, והחיישן לא יכול לענות.', 'Without the pull-up the line never rises to 1, and the sensor cannot answer.')),
        OUT(B('שלוש מדידות. מה המקסימום?', 'Three readings. What is the maximum?'),
          ['high = -200', 'for t in [21.5, 23.0, 22.25]:', '    high = max(high, t)', 'print(high)'], '23.0',
          B('`max` שומר את הגדול מבין השניים בכל סיבוב, ובסוף נשאר 23.0.', '`max` keeps the larger of the two on each round, and 23.0 is left at the end.')),
        Q(B('למה אפשר לחבר כמה חיישני DS18B20 לאותו חוט?', 'Why can several DS18B20 sensors share one wire?'),
          [B('לכל חיישן יש מספר זיהוי ייחודי, וה-Pico פונה לכל אחד לפי המספר שלו', 'Each sensor has a unique ID number, and the Pico addresses each one by its number'), B('כי הם מודדים את אותה טמפרטורה', 'Because they measure the same temperature'), B('אי אפשר', 'They cannot')], 0,
          B('בדומה לכתובות של I2C, אבל כאן המספר צרוב בכל חיישן במפעל.', 'Like I2C addresses, but here the number is burned into each sensor at the factory.'))
      ]
    },
    /* ------------------------------------------------------------ S6 */
    {
      id: 'S6', track: 'S',
      title: B('פענוח של נתוני GPS', 'Reading GPS data'),
      goal: B('מקלט GPS שולח כל שנייה שורות טקסט בפורמט NMEA. התוכנית קוראת אותן מ-UART, בודקת שהשורה הגיעה שלמה (checksum), מפרקת אותה לשדות, ומדפיסה מיקום ומספר לוויינים.', 'A GPS receiver sends lines of text in the NMEA format every second. The program reads them from the UART, checks the line arrived whole (a checksum), splits it into fields, and prints a position and the number of satellites.'),
      learn: [
        B('איך קוראים שורות מ-UART ומפרקים אותן לשדות עם `split`.', 'How to read lines from the UART and split them into fields with `split`.'),
        B('איך checksum מגלה שורה שהשתבשה בדרך.', 'How a checksum finds a line that got garbled on the way.'),
        B('איך ממירים מעלות ודקות למעלות עשרוניות.', 'How to turn degrees and minutes into decimal degrees.')
      ],
      before: [PART('gps', 'העמוד של מקלט ה-GPS', 'The GPS receiver\'s page', 'שם מוסבר החיווט.', 'The wiring is explained there.'), LESSON('D3', 'שם הכרנו את UART.', 'That is where we met the UART.'), BASICS('python2', 'יסודות: עוד Python', 'Basics: More Python', 'רשימות ו-`try`.', 'Lists and `try`.')],
      parts: [{ id: 'gps', qty: 1 }, { text: B('ארבעה חוטי גישור, ומקום ליד חלון או בחוץ', 'Four jumper wires, and a spot by a window or outdoors') }],
      wiring: [
        W(B('GPS, VCC', 'GPS, VCC'), '3V3', 36, null, '3.3V'),
        W(B('GPS, GND', 'GPS, GND'), 'GND', 13, null, 'GND'),
        W(B('GPS, TX', 'GPS, TX'), 'GP9', 12, B('אל ה-RX של ה-Pico (UART1)', 'to the Pico\'s RX (UART1)'), 'RX'),
        W(B('GPS, RX', 'GPS, RX'), 'GP8', 11, B('אל ה-TX של ה-Pico', 'to the Pico\'s TX'), 'TX')
      ],
      steps: [UNPLUG, CLEAR, B('חברו את המקלט לפי הטבלה. שימו לב שה-TX של המקלט מתחבר ל-RX של ה-Pico.', 'Wire the receiver from the table. Note that the receiver\'s TX goes to the Pico\'s RX.'),
        PLUG, RUN,
        B('שימו את המקלט ליד חלון. בהתחלה יודפס "no fix yet". הלד הקטן על המקלט מתחיל להבהב כשנמצא מיקום, ולפעמים זה לוקח כמה דקות.', 'Put the receiver near a window. At first "no fix yet" is printed. The small LED on the receiver starts blinking once a position is found, which sometimes takes a few minutes.'),
        READ],
      code: [
        'from machine import Pin, UART',
        '',
        'gps = UART(1, baudrate=9600, tx=Pin(8), rx=Pin(9))',
        '',
        'def checksum_ok(line):',
        '    if not line.startswith("$") or "*" not in line:',
        '        return False',
        '    body, given = line[1:].split("*", 1)',
        '    total = 0',
        '    for ch in body:',
        '        total ^= ord(ch)',
        '    return "%02X" % total == given[:2].upper()',
        '',
        'def degrees(value, hemi):',
        '    if not value:',
        '        return None',
        '    dot = value.index(".")',
        '    deg = float(value[:dot - 2]) + float(value[dot - 2:]) / 60',
        '    return -deg if hemi in ("S", "W") else deg',
        '',
        'while True:',
        '    raw = gps.readline()',
        '    if not raw:',
        '        continue',
        '    try:',
        '        line = raw.decode().strip()',
        '    except UnicodeError:',
        '        continue',
        '    if not checksum_ok(line):',
        '        continue',
        '    f = line.split(",")',
        '    if f[0].endswith("GGA"):',
        '        if f[6] == "0":',
        '            print("no fix yet, satellites:", f[7])',
        '        else:',
        '            print("lat", degrees(f[2], f[3]), "lon", degrees(f[4], f[5]), "satellites", f[7])'
      ],
      explain: [
        E([5, 12], 'ה-checksum: מחברים ב-XOR (`^`) את כל התווים שבין `$` ל-`*`, ומשווים לשתי הספרות שאחרי הכוכבית. אם תו אחד השתבש, התוצאה כמעט בטוח שונה.', 'The checksum: XOR (`^`) all the characters between `$` and `*`, and compare with the two digits after the star. If one character got garbled, the result is almost certainly different.'),
        E([14, 19], 'NMEA כותב מיקום כמעלות ודקות צמודות, למשל 4807.038 הם 48 מעלות ו-7.038 דקות. מחלקים את הדקות ב-60, ובחצי הכדור הדרומי או המערבי הופכים לשלילי.', 'NMEA writes a position as degrees and minutes run together, for example 4807.038 is 48 degrees and 7.038 minutes. The minutes are divided by 60, and in the southern or western hemisphere the value becomes negative.'),
        E([22, 28], 'קוראים שורה. אם לא הגיע כלום, או שהגיעו בתים שאינם טקסט, מדלגים עליה.', 'Read a line. If nothing arrived, or bytes arrived that are not text, skip it.'),
        E([31, 36], 'מפרקים לשדות לפי פסיקים. בשורת GGA, שדה 6 הוא איכות המיקום (0 = עוד אין), ושדה 7 הוא מספר הלוויינים.', 'Split into fields by commas. In a GGA line, field 6 is the fix quality (0 = none yet), and field 7 is the number of satellites.')
      ],
      expect: B('בהתחלה מודפס "no fix yet" עם מספר הלוויינים. אחרי שנמצא מיקום מודפסות שורות כמו "lat 32.08 lon 34.78 satellites 07". שורה ששובשה בדרך פשוט לא מודפסת.', 'At first "no fix yet" is printed with the number of satellites. Once a position is found, lines such as "lat 32.08 lon 34.78 satellites 07" are printed. A line garbled on the way is simply not printed.'),
      tasks: [
        { t: B('בדקו את הפונקציות בלי מקלט: הריצו רק את `checksum_ok` ואת `degrees` על השורה הזו, והשוו לתוצאה הצפויה.', 'Test the functions without a receiver: run only `checksum_ok` and `degrees` on this line, and compare with the expected result.'),
          code: ['line = "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47"', 'print(checksum_ok(line))                 # True', 'f = line.split(",")', 'print(degrees(f[2], f[3]), degrees(f[4], f[5]))   # about 48.1173 11.5167'] },
        { t: B('שנו תו אחד באמצע השורה מהאתגר הקודם. מה מחזירה `checksum_ok` עכשיו?', 'Change one character in the middle of the line from the previous challenge. What does `checksum_ok` return now?'),
          hint: B('`False`: ה-XOR של התווים השתנה, והוא כבר לא שווה ל-47.', '`False`: the XOR of the characters changed, and it no longer equals 47.') }
      ],
      quiz: [
        OUT(B('כמה מעלות עשרוניות הם 3205.400 (32 מעלות ו-5.4 דקות)?', 'How many decimal degrees is 3205.400 (32 degrees and 5.4 minutes)?'),
          ['value = "3205.400"', 'dot = value.index(".")', 'deg = float(value[:dot - 2]) + float(value[dot - 2:]) / 60', 'print(deg)'], '32.09',
          B('5.4 דקות חלקי 60 הם 0.09 מעלות, ולכן התוצאה היא 32.09.', '5.4 minutes divided by 60 is 0.09 degrees, so the result is 32.09.')),
        Q(B('למה בודקים checksum לפני שמשתמשים בשורה?', 'Why check the checksum before using a line?'),
          [B('כדי לא להשתמש בשורה שהשתבשה בדרך', 'So as not to use a line that got garbled on the way'), B('כדי להאיץ את הקריאה', 'To speed up reading'), B('כי בלי זה ה-UART לא עובד', 'Because the UART does not work without it')], 0,
          B('רעש על החוט יכול לשנות תו. בלי הבדיקה, מיקום שגוי היה נראה כמו מיקום אמיתי.', 'Noise on the wire can change a character. Without the check, a wrong position would look like a real one.')),
        OUT(B('מה מדפיסה השורה?', 'What does this line print?'),
          ['f = "$GPGGA,1,2,N,3,E,0,05".split(",")', 'print(f[6], f[7])'], '0 05',
          B('הספירה מתחילה מ-0: שדה 6 הוא "0" ושדה 7 הוא "05". שניהם נשארים טקסט.', 'Counting starts at 0: field 6 is "0" and field 7 is "05". Both stay as text.'))
      ]
    }
  ];

  /* ---------------- one lesson for each of five parts that had none ---------------- */
  var parts = {
    E5: {
      id: 'E5', track: 'E',
      title: B('השקיה אוטומטית', 'Automatic watering'),
      goal: B('חיישן לחות קרקע מודד כמה רטובה האדמה, וממסר מפעיל משאבה קטנה כשהיא יבשה מדי. בעזרת שני ספים המשאבה לא נדלקת ונכבית כל רגע.', 'A soil moisture sensor measures how wet the soil is, and a relay runs a small pump when it is too dry. With two thresholds, the pump does not switch on and off every moment.'),
      learn: [
        B('איך מכיילים חיישן: מודדים "יבש" ו"רטוב" והופכים לאחוזים.', 'How to calibrate a sensor: measure "dry" and "wet" and turn the reading into a percentage.'),
        B('איך שני ספים שומרים על המשאבה מלהידלק ולהיכבות בלי הפסקה.', 'How two thresholds keep the pump from switching on and off non-stop.'),
        B('איך מחברים חיישן וממסר באותו פרויקט.', 'How to combine a sensor and a relay in one project.')
      ],
      before: [LESSON('E1', 'שם הכרנו את הממסר.', 'That is where we met the relay.'), PART('soil', 'העמוד של חיישן הלחות', 'The moisture sensor\'s page', 'שם מוסבר הכיול.', 'The calibration is explained there.'), LESSON('S3', 'שני ספים, כמו כאן.', 'Two thresholds, as here.')],
      parts: [{ id: 'soil', qty: 1 }, { id: 'relay', qty: 1 }, { text: B('משאבת מים קטנה של 5V עם ספק משלה, או נורה וסוללות כמו בשיעור E1', 'A small 5 V water pump with its own supply, or a bulb and batteries as in lesson E1') }],
      wiring: [
        W(B('חיישן לחות, VCC', 'Moisture sensor, VCC'), '3V3', 36, null, '3.3V'),
        W(B('חיישן לחות, GND', 'Moisture sensor, GND'), 'GND', 38, null, 'GND'),
        W(B('חיישן לחות, AOUT', 'Moisture sensor, AOUT'), 'GP28', 34, B('ADC2', 'ADC2'), B('לחות', 'Moisture')),
        W(B('ממסר, VCC', 'Relay, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('ממסר, GND', 'Relay, GND'), 'GND', 38, null, 'GND'),
        W(B('ממסר, IN', 'Relay, IN'), 'GP21', 27, null, B('ממסר', 'Relay'))
      ],
      steps: [UNPLUG, CLEAR,
        B('חברו את החיישן ואת הממסר לפי הטבלה. את המשאבה או הנורה חברו למגעים של הממסר, כמו בשיעור E1. המים והמשאבה רחוקים מה-Pico ומהמטריצה.', 'Wire the sensor and the relay from the table. Connect the pump or the bulb to the relay\'s contacts, as in lesson E1. Keep water and the pump away from the Pico and the breadboard.'),
        RAILS, PLUG,
        B('כיול: הריצו את הקוד של עמוד החיישן, ורשמו את הקריאה כשהחיישן באוויר ("יבש") וכשהוא בכוס מים ("רטוב"). כתבו את המספרים ב-`DRY` וב-`WET`.', 'Calibration: run the code from the sensor\'s page, and write down the reading with the sensor in the air ("dry") and in a glass of water ("wet"). Put the numbers in `DRY` and `WET`.'),
        RUN,
        B('הכניסו את החיישן לעציץ יבש: המשאבה נדלקת. השקו: היא נכבית רק כשהלחות עוברת 60%.', 'Put the sensor in a dry pot: the pump switches on. Water it: it switches off only when the moisture passes 60%.'),
        READ],
      code: [
        'from machine import Pin, ADC',
        'from time import sleep',
        '',
        'soil = ADC(28)',
        'pump = Pin(21, Pin.OUT)',
        '',
        'DRY = 52000          # the reading in dry air: measure yours',
        'WET = 24000          # the reading in a glass of water: measure yours',
        'START = 30           # percent: start watering below this',
        'STOP = 60            # percent: stop watering above this',
        '',
        'def moisture():',
        '    raw = soil.read_u16()',
        '    p = (DRY - raw) * 100 // (DRY - WET)',
        '    return max(0, min(100, p))',
        '',
        'while True:',
        '    m = moisture()',
        '    if m < START:',
        '        pump.on()',
        '    elif m > STOP:',
        '        pump.off()',
        '    print(m, "%  pump:", pump.value())',
        '    sleep(1)'
      ],
      explain: [
        E([7, 8], 'מספרי הכיול. החיישן נותן מספר גבוה כשהוא יבש ונמוך כשהוא רטוב, ולכל חיישן המספרים קצת שונים.', 'The calibration numbers. The sensor gives a high number when dry and a low one when wet, and each sensor\'s numbers differ a little.'),
        E([9, 10], 'שני ספים: מתחילים להשקות מתחת ל-30%, ומפסיקים רק מעל 60%.', 'Two thresholds: start watering below 30%, and stop only above 60%.'),
        E([12, 15], 'הופכים את הקריאה לאחוזים: 0 ביבש, 100 ברטוב. `max` ו-`min` מונעים ערכים מחוץ לטווח.', 'Turns the reading into a percentage: 0 when dry, 100 when wet. `max` and `min` keep the value in range.'),
        E([19, 22], 'ההחלטה, עם שני הספים. בין 30 ל-60 המשאבה נשארת במצב שבו הייתה.', 'The decision, with the two thresholds. Between 30 and 60 the pump stays as it was.')
      ],
      expect: B('באדמה יבשה מודפס מספר נמוך מ-30, והממסר נשמע ומפעיל את המשאבה. כשהאדמה מתרטבת המספר עולה, והמשאבה נכבית רק מעל 60%.', 'In dry soil a number below 30 is printed, and the relay clicks and runs the pump. As the soil gets wet the number rises, and the pump stops only above 60%.'),
      tasks: [
        { t: B('הגנה: המשאבה לא תפעל יותר מ-20 שניות ברצף, גם אם האדמה עדיין יבשה. אחר כך היא מחכה דקה.', 'Protection: the pump never runs for more than 20 seconds in a row, even if the soil is still dry. After that it waits a minute.'),
          hint: B('שמרו את הרגע שבו המשאבה נדלקה, עם `ticks_ms`, כמו בשיעור E1.', 'Keep the moment the pump switched on, with `ticks_ms`, as in lesson E1.') },
        { t: B('הוסיפו לד שמהבהב כשהלחות מתחת ל-10%: אולי המיכל ריק.', 'Add an LED that blinks when the moisture is below 10%: maybe the tank is empty.') }
      ],
      quiz: [
        OUT(B('הקריאה היא 38000. כמה אחוזי לחות זה?', 'The reading is 38000. How many percent moisture is that?'),
          ['DRY = 52000', 'WET = 24000', 'raw = 38000', 'print((DRY - raw) * 100 // (DRY - WET))'], '50',
          B('38000 נמצא בדיוק באמצע בין 52000 ל-24000, ולכן יוצא 50%.', '38000 is exactly halfway between 52000 and 24000, so the result is 50%.')),
        Q(B('המשאבה פועלת, והלחות עכשיו 45%. מה קורה?', 'The pump is running, and the moisture is now 45%. What happens?'),
          [B('המשאבה ממשיכה לפעול, עד שהלחות עוברת 60%', 'The pump keeps running, until the moisture passes 60%'), B('המשאבה נכבית', 'The pump stops'), B('המשאבה מהבהבת', 'The pump flickers')], 0,
          B('45 נמצא בין 30 ל-60, ולכן המצב לא משתנה.', '45 lies between 30 and 60, so the state does not change.')),
        Q(B('למה צריך לכייל את החיישן?', 'Why does the sensor need calibrating?'),
          [B('כי כל חיישן ואדמה נותנים מספרים קצת שונים ל"יבש" ול"רטוב"', 'Because every sensor and soil give slightly different numbers for "dry" and "wet"'), B('כי החיישן מגיע כבוי', 'Because the sensor arrives switched off'), B('כדי לחסוך בחשמל', 'To save power')], 0,
          B('בלי כיול, האחוזים היו שגויים, והמשאבה הייתה נדלקת מוקדם או מאוחר מדי.', 'Without calibration the percentages would be wrong, and the pump would start too early or too late.'))
      ]
    },
    F5: {
      id: 'F5', track: 'F',
      title: B('שלט רחוק שמחליף צבעים', 'A remote control that changes colours'),
      goal: B('מקלט IR קולט את הלחיצות של שלט רחוק, ולד RGB מחליף צבע לפי הכפתור שנלחץ. בשלב הראשון מגלים את הקוד של כל כפתור בשלט שלכם.', 'An IR receiver picks up the presses of a remote control, and an RGB LED changes colour by the button pressed. In the first stage you find out the code of each button on your remote.'),
      learn: [
        B('איך שלט רחוק שולח מספר על ידי הבהובים של אור אינפרא-אדום.', 'How a remote sends a number by blinking infrared light.'),
        B('איך משתמשים במילון כדי לקשר בין קוד של כפתור לפעולה.', 'How to use a dictionary to link a button code to an action.'),
        B('איך מגלים ערכים לא ידועים: קודם מדפיסים, ואחר כך כותבים בקוד.', 'How to discover unknown values: print them first, then write them into the code.')
      ],
      before: [PART('irrecv', 'העמוד של מקלט ה-IR', 'The IR receiver\'s page', 'שם מוסבר איך הקוד מפענח את ההבהובים.', 'It explains how the code decodes the blinks.'), LESSON('F1', 'הלד ה-RGB נשאר על אותם פינים.', 'The RGB LED stays on the same pins.'), BASICS('python2', 'יסודות: עוד Python', 'Basics: More Python', 'מילונים.', 'Dictionaries.')],
      parts: [{ id: 'irrecv', qty: 1, note: B('עם השלט שמגיע איתו', 'with the remote that comes with it') }, { id: 'rgb', qty: 1 }, { text: B('שמונה חוטי גישור', 'Eight jumper wires') }],
      wiring: [
        W(B('מקלט IR, S', 'IR receiver, S'), 'GP21', 27, null, 'IR'),
        W(B('מקלט IR, +', 'IR receiver, +'), '3V3', 36, null, '3.3V'),
        W(B('מקלט IR, − ולד RGB, −', 'IR receiver − and RGB LED −'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('לד RGB, R', 'RGB LED, R'), 'GP11', 15, null, B('אדום', 'Red')),
        W(B('לד RGB, G', 'RGB LED, G'), 'GP12', 16, null, B('ירוק', 'Green')),
        W(B('לד RGB, B', 'RGB LED, B'), 'GP13', 17, null, B('כחול', 'Blue'))
      ],
      steps: [UNPLUG, CLEAR, B('חברו את המקלט ואת הלד לפי הטבלה.', 'Wire the receiver and the LED from the table.'), RAILS, PLUG, RUN,
        B('כוונו את השלט למקלט ולחצו על 1, 2, 3 ו-0. רשמו את הקוד שמודפס לכל כפתור.', 'Point the remote at the receiver and press 1, 2, 3 and 0. Write down the code printed for each button.'),
        B('כתבו את הקודים שלכם במילון `COLORS`, והריצו שוב. עכשיו כל כפתור מחליף צבע.', 'Put your codes in the `COLORS` dictionary, and run again. Now each button changes the colour.'),
        READ],
      code: [
        'from machine import Pin, PWM, time_pulse_us',
        '',
        'ir = Pin(21, Pin.IN)',
        'red = PWM(Pin(11), freq=1000)',
        'green = PWM(Pin(12), freq=1000)',
        'blue = PWM(Pin(13), freq=1000)',
        '',
        'COLORS = {                      # button code: (red, green, blue), 0 to 255',
        '    0xFF30CF: (255, 0, 0),      # button 1: put your remote\'s codes here',
        '    0xFF18E7: (0, 255, 0),      # button 2',
        '    0xFF7A85: (0, 0, 255),      # button 3',
        '    0xFF6897: (0, 0, 0),        # button 0: off',
        '}',
        '',
        'def read_ir():',
        '    if time_pulse_us(ir, 0, 100000) < 8000:    # the 9 ms start burst',
        '        return None',
        '    if time_pulse_us(ir, 1, 10000) < 4000:     # the 4.5 ms gap',
        '        return None',
        '    code = 0',
        '    for i in range(32):',
        '        t = time_pulse_us(ir, 1, 5000)',
        '        if t < 0:',
        '            return None',
        '        code = (code << 1) | (1 if t > 1000 else 0)',
        '    return code',
        '',
        'def show(r, g, b):',
        '    red.duty_u16(r * 257)',
        '    green.duty_u16(g * 257)',
        '    blue.duty_u16(b * 257)',
        '',
        'show(0, 0, 0)',
        'while True:',
        '    code = read_ir()',
        '    if code is None:',
        '        continue',
        '    print("button code:", hex(code))',
        '    if code in COLORS:',
        '        show(*COLORS[code])'
      ],
      explain: [
        E([8, 13], 'מילון: לכל קוד של כפתור יש צבע. הקודים כאן מתאימים לשלט נפוץ, אבל בשלט שלכם הם יכולים להיות שונים.', 'A dictionary: each button code has a colour. The codes here suit a common remote, but on yours they may differ.'),
        E([15, 26], 'פענוח הלחיצה, כמו בעמוד של המקלט: התחלה ארוכה, ואחריה 32 ביטים. רווח ארוך הוא 1 ורווח קצר הוא 0.', 'Decoding the press, as on the receiver\'s page: a long start, then 32 bits. A long gap is 1 and a short gap is 0.'),
        E([38], 'מדפיסים כל קוד, גם קוד שעוד לא במילון. כך מגלים את הקודים של השלט שלכם.', 'Print every code, even one not yet in the dictionary. That is how you find your remote\'s codes.'),
        E([39, 40], 'אם הקוד במילון, מציגים את הצבע שלו. הכוכבית ב-`show(*...)` פותחת את שלושת הערכים לשלושה פרמטרים.', 'If the code is in the dictionary, show its colour. The star in `show(*...)` unpacks the three values into three parameters.')
      ],
      expect: B('כל לחיצה מדפיסה "button code:" ואחריו מספר. אחרי שהקודים שלכם במילון, 1 צובע באדום, 2 בירוק, 3 בכחול, ו-0 מכבה.', 'Each press prints "button code:" and a number. Once your codes are in the dictionary, 1 makes red, 2 green, 3 blue, and 0 switches off.'),
      tasks: [
        { t: B('הוסיפו כפתורים לעוצמה: "+" מגביר ו-"−" מחליש את הצבע הנוכחי.', 'Add buttons for brightness: "+" makes the current colour brighter and "−" dimmer.'),
          hint: B('שמרו את הצבע הנוכחי ואת העוצמה במשתנים, והציגו `r * level // 10` וכן הלאה.', 'Keep the current colour and the level in variables, and show `r * level // 10` and so on.') },
        { t: B('לחיצה ארוכה על כפתור שולחת קוד חזרה מיוחד, ולא את הקוד של הכפתור. מה מודפס כשמחזיקים כפתור?', 'Holding a button sends a special repeat code, not the button\'s code. What is printed when a button is held?'),
          hint: B('קוד החזרה קצר יותר, ולכן `read_ir` מחזיר `None` ולא מדפיס כלום.', 'The repeat code is shorter, so `read_ir` returns `None` and prints nothing.') }
      ],
      quiz: [
        OUT(B('מה מדפיס הקוד?', 'What does this code print?'),
          ['COLORS = {1: "red", 2: "green"}', 'code = 3', 'print(code in COLORS)'], 'False',
          B('`in` בודק אם הקוד הוא מפתח במילון. 3 לא נמצא בו.', '`in` checks whether the code is a key in the dictionary. 3 is not in it.')),
        Q(B('למה התוכנית מדפיסה כל קוד, גם קוד שלא במילון?', 'Why does the program print every code, even one not in the dictionary?'),
          [B('כדי לגלות את הקודים של השלט שבידכם', 'To discover the codes of the remote in your hand'), B('כדי לבדוק את הלד', 'To test the LED'), B('כי `print` מאיץ את הקריאה', 'Because `print` speeds up reading')], 0,
          B('לשלטים שונים יש קודים שונים. מדפיסים, רושמים, ואז מכניסים למילון.', 'Different remotes have different codes. Print, note them down, then put them in the dictionary.')),
        Q(B('המקלט לא מגיב בכלל. מה סביר לבדוק?', 'The receiver does not respond at all. What is sensible to check?'),
          [B('שהשלט מכוון אל המקלט, ושיש בשלט סוללה', 'That the remote points at the receiver, and has a battery'), B('את הצבעים במילון', 'The colours in the dictionary'), B('את התדר של ה-PWM', 'The PWM frequency')], 0,
          B('בלי קליטה, `read_ir` לא מחזיר שום קוד. מצלמה של טלפון יכולה להראות אם הנורית שבשלט מהבהבת.', 'With no reception, `read_ir` returns no code. A phone camera can show whether the remote\'s light blinks.'))
      ]
    },
    F6: {
      id: 'F6', track: 'F',
      title: B('שלט הודעות על מסך LCD', 'A message board on an LCD'),
      goal: B('מסך LCD של שתי שורות מציג הודעה, ולחיצה על כפתור עוברת להודעה הבאה. השורה השנייה מראה את מספר ההודעה.', 'A two-line LCD shows a message, and a button press moves to the next one. The second line shows the message\'s number.'),
      learn: [
        B('איך כותבים על מסך LCD עם הספרייה של האתר.', 'How to write on an LCD with the site\'s library.'),
        B('איך עוברים על רשימה במעגל עם `%`.', 'How to go round a list in a circle with `%`.'),
        B('למה מצמצמים טקסט ל-16 תווים.', 'Why text is cut to 16 characters.')
      ],
      before: [PART('lcd1602', 'העמוד של מסך ה-LCD', 'The LCD\'s page', 'משם שומרים על הלוח את הקובץ `pico_lcd.py`.', 'From there you save the file `pico_lcd.py` onto the board.'), LESSON('A4', 'זיהוי רגע הלחיצה.', 'Catching the moment of the press.')],
      parts: [{ id: 'lcd1602', qty: 1 }, { id: 'button', qty: 1 }, { text: B('שישה חוטי גישור עם קצה נקבה, ושניים רגילים', 'Six jumper wires with a female end, and two ordinary ones') }],
      wiring: [
        W(B('LCD, GND', 'LCD, GND'), 'GND', 8, null, 'GND'),
        W(B('LCD, VCC', 'LCD, VCC'), 'VBUS', 40, B('5V', '5 V'), '5V'),
        W(B('LCD, SDA', 'LCD, SDA'), 'GP4', 6, null, 'SDA'),
        W(B('LCD, SCL', 'LCD, SCL'), 'GP5', 7, null, 'SCL'),
        W(B('כפתור, רגל אחת', 'Button, one leg'), 'GP14', 19, null, B('כפתור', 'Button')),
        W(B('כפתור, הרגל שבאלכסון', 'Button, the diagonal leg'), 'GND', 18, null, 'GND')
      ],
      steps: [UNPLUG, CLEAR,
        B('שמרו על הלוח את הקובץ `pico_lcd.py` מהעמוד של המסך, אם עוד לא עשיתם זאת.', 'Save the file `pico_lcd.py` from the display\'s page onto the board, if you have not done so yet.'),
        B('חברו את המסך ואת הכפתור לפי הטבלה.', 'Wire the display and the button from the table.'),
        PLUG, RUN,
        B('אם המסך מואר אבל ריק, סובבו בעדינות את הבורג הכחול שבגב המסך עד שהאותיות מופיעות.', 'If the display is lit but blank, gently turn the blue screw on the back until the letters appear.'),
        B('לחצו על הכפתור כמה פעמים, ועברו על כל ההודעות.', 'Press the button a few times, and go through all the messages.'),
        READ],
      code: [
        'from machine import Pin, I2C',
        'from pico_lcd import LCD',
        'from time import sleep',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=100_000)',
        'lcd = LCD(i2c, 0x27)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        '',
        'MESSAGES = ["Lab open", "Back in 5 min", "Quiet please", "Pico 2 Lab"]',
        'index = 0',
        'last = 1',
        '',
        'def show():',
        '    lcd.clear()',
        '    lcd.write(MESSAGES[index][:16])',
        '    lcd.move(0, 1)',
        '    lcd.write("%d/%d" % (index + 1, len(MESSAGES)))',
        '',
        'show()',
        'while True:',
        '    now = button.value()',
        '    if last == 1 and now == 0:',
        '        index = (index + 1) % len(MESSAGES)',
        '        show()',
        '    last = now',
        '    sleep(0.02)'
      ],
      explain: [
        E([5, 6], 'אפיק I2C במהירות 100kHz, ומסך בכתובת 0x27. אם הסריקה בעמוד של המסך החזירה 0x3f, כתבו את הכתובת הזו.', 'An I2C bus at 100 kHz, and a display at address 0x27. If the scan on the display\'s page returned 0x3f, write that address.'),
        E([9], 'רשימת ההודעות. באנגלית בלבד: המסך לא יודע להציג אותיות בעברית.', 'The list of messages. In English only: the display cannot show Hebrew letters.'),
        E([13, 17], 'מציגים הודעה: מנקים, כותבים בשורה הראשונה (16 תווים לכל היותר), עוברים לתחילת השורה השנייה, וכותבים את המספר.', 'Show a message: clear, write on the first line (16 characters at most), move to the start of the second line, and write the number.'),
        E([23], '`%` מחזיר את השארית, ולכן אחרי ההודעה האחרונה חוזרים ל-0.', '`%` gives the remainder, so after the last message it goes back to 0.')
      ],
      expect: B('על המסך מופיע "Lab open" ובשורה השנייה "1/4". כל לחיצה עוברת להודעה הבאה, ואחרי הרביעית חוזרים לראשונה.', '"Lab open" appears on the display, with "1/4" on the second line. Each press moves to the next message, and after the fourth it goes back to the first.'),
      tasks: [
        { t: B('הודעה ארוכה מ-16 תווים: גללו אותה לאורך השורה, אות אחת כל שלוש עשיריות שנייה.', 'A message longer than 16 characters: scroll it along the line, one letter every three tenths of a second.'),
          code: ['text = "Welcome to the Pico 2 lab   "', 'for i in range(len(text)):', '    lcd.move(0, 0)', '    lcd.write((text[i:] + text[:i])[:16])', '    sleep(0.3)'] },
        { t: B('הוסיפו כפתור שני שחוזר להודעה הקודמת.', 'Add a second button that goes back to the previous message.'),
          hint: B('`(index - 1) % len(MESSAGES)` עובד גם כש-`index` הוא 0, ונותן את ההודעה האחרונה.', '`(index - 1) % len(MESSAGES)` works even when `index` is 0, and gives the last message.') }
      ],
      quiz: [
        OUT(B('יש 4 הודעות, ועכשיו מוצגת האחרונה. מה האינדקס אחרי לחיצה?', 'There are 4 messages, and the last one is showing. What is the index after a press?'),
          ['index = 3', 'index = (index + 1) % 4', 'print(index)'], '0',
          B('3 + 1 הם 4, והשארית של 4 חלקי 4 היא 0: חוזרים להודעה הראשונה.', '3 + 1 is 4, and the remainder of 4 divided by 4 is 0: back to the first message.')),
        OUT(B('מה יופיע בשורה, אחרי החיתוך ל-16 תווים?', 'What appears on the line, after cutting to 16 characters?'),
          ['text = "The lab closes at four"', 'print(text[:16])'], 'The lab closes a',
          B('`[:16]` לוקח את 16 התווים הראשונים, כולל רווחים.', '`[:16]` takes the first 16 characters, spaces included.')),
        Q(B('המסך מואר, אבל אין עליו אותיות. מה עושים קודם?', 'The display is lit, but shows no letters. What do you do first?'),
          [B('מסובבים את הבורג הכחול שבגב המסך (ניגודיות)', 'Turn the blue screw on the back (contrast)'), B('מחליפים את הכתובת ל-0x3c', 'Change the address to 0x3c'), B('מוסיפים `sleep`', 'Add a `sleep`')], 0,
          B('הבורג קובע את הניגודיות. במצב לא נכון האותיות קיימות, אבל לא רואים אותן.', 'The screw sets the contrast. Set wrong, the letters are there but cannot be seen.'))
      ]
    },
    G5: {
      id: 'G5', track: 'G',
      title: B('רושם נתונים על כרטיס microSD', 'A data logger on a microSD card'),
      goal: B('ה-Pico מודד טמפרטורה כל שתי שניות, וכותב כל מדידה כשורה בקובץ CSV על כרטיס microSD. בסוף מוציאים את הכרטיס, ופותחים את הקובץ בגיליון אלקטרוני במחשב.', 'The Pico measures the temperature every two seconds, and writes each reading as a line in a CSV file on a microSD card. At the end the card is taken out, and the file is opened in a spreadsheet on the computer.'),
      learn: [
        B('איך מחברים כרטיס microSD ב-SPI ומחברים אותו למערכת הקבצים (`mount`).', 'How to wire a microSD card on SPI and attach it to the file system (`mount`).'),
        B('מה זה קובץ CSV, ולמה גיליון אלקטרוני פותח אותו.', 'What a CSV file is, and why a spreadsheet opens it.'),
        B('למה פותחים וסוגרים את הקובץ בכל כתיבה.', 'Why the file is opened and closed on every write.')
      ],
      before: [PART('sdcard', 'העמוד של קורא כרטיס ה-microSD', 'The microSD reader\'s page', 'משם מתקינים את הספרייה `sdcard`.', 'That is where you install the `sdcard` library.'), LESSON('G2', 'אותו רעיון, על הזיכרון של הלוח.', 'The same idea, on the board\'s own memory.'), LESSON('W3', 'החיישן שבתוך השבב.', 'The sensor inside the chip.')],
      parts: [{ id: 'sdcard', qty: 1 }, { text: B('כרטיס microSD מפורמט ב-FAT32, עד 32GB', 'A microSD card formatted as FAT32, up to 32 GB') }, { text: B('שישה חוטי גישור', 'Six jumper wires') }],
      wiring: [
        W(B('קורא כרטיסים, VCC', 'Card reader, VCC'), '3V3', 36, B('דגם של 3.3V', 'a 3.3 V model'), '3.3V'),
        W(B('קורא כרטיסים, GND', 'Card reader, GND'), 'GND', 23, null, 'GND'),
        W(B('קורא כרטיסים, SCK', 'Card reader, SCK'), 'GP18', 24, B('SPI0 SCK', 'SPI0 SCK'), 'SCK'),
        W(B('קורא כרטיסים, MOSI', 'Card reader, MOSI'), 'GP19', 25, B('SPI0 TX', 'SPI0 TX'), 'MOSI'),
        W(B('קורא כרטיסים, MISO', 'Card reader, MISO'), 'GP16', 21, B('SPI0 RX', 'SPI0 RX'), 'MISO'),
        W(B('קורא כרטיסים, CS', 'Card reader, CS'), 'GP17', 22, null, 'CS')
      ],
      steps: [UNPLUG, CLEAR,
        B('התקינו את הספרייה `sdcard`, כמו שמוסבר בעמוד של הקורא.', 'Install the `sdcard` library, as explained on the reader\'s page.'),
        B('חברו את הקורא לפי הטבלה, והכניסו את הכרטיס.', 'Wire the reader from the table, and insert the card.'),
        PLUG, RUN,
        B('תנו לתוכנית לרוץ דקה, ועצרו אותה עם Stop. נתקו את הכבל, הוציאו את הכרטיס, ופתחו את `log.csv` במחשב.', 'Let the program run for a minute, and stop it with Stop. Unplug the cable, take out the card, and open `log.csv` on the computer.'),
        READ],
      code: [
        'import os, sdcard',
        'from machine import Pin, SPI, ADC',
        'from time import sleep, ticks_ms',
        '',
        'spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))',
        'sd = sdcard.SDCard(spi, Pin(17, Pin.OUT))',
        'os.mount(sd, "/sd")',
        '',
        'sensor = ADC(4)                     # the temperature sensor inside the chip',
        'led = Pin("LED", Pin.OUT)',
        '',
        'def temperature():',
        '    volts = sensor.read_u16() * 3.3 / 65535',
        '    return 27 - (volts - 0.706) / 0.001721',
        '',
        'with open("/sd/log.csv", "a") as f:',
        '    f.write("seconds,temperature\\n")',
        '',
        'while True:',
        '    line = "%d,%.1f\\n" % (ticks_ms() // 1000, temperature())',
        '    with open("/sd/log.csv", "a") as f:',
        '        f.write(line)',
        '    led.toggle()',
        '    print(line, end="")',
        '    sleep(2)'
      ],
      explain: [
        E([5, 7], 'מגדירים את SPI0, יוצרים את הכרטיס עם פין CS, ומחברים אותו למערכת הקבצים בשם `/sd`. מכאן כל קובץ שמתחיל ב-`/sd/` נמצא על הכרטיס.', 'Set up SPI0, create the card with its CS pin, and attach it to the file system as `/sd`. From here every file starting with `/sd/` is on the card.'),
        E([16, 17], 'שורת כותרת לקובץ. `"a"` פירושו להוסיף בסוף הקובץ, בלי למחוק את מה שכבר בו.', 'A header line for the file. `"a"` means append at the end of the file, without erasing what is already there.'),
        E([20], 'שורת CSV: מספר השניות מאז ההדלקה, פסיק, והטמפרטורה עם ספרה אחת אחרי הנקודה.', 'A CSV line: the seconds since power-up, a comma, and the temperature with one digit after the point.'),
        E([21, 22], 'פותחים, כותבים וסוגרים בכל פעם (`with` סוגר לבד). אם החשמל נופל, כל מה שכבר נכתב נשמר על הכרטיס.', 'Open, write and close every time (`with` closes by itself). If the power fails, everything written so far is safe on the card.')
      ],
      expect: B('כל שתי שניות מודפסת שורה כמו "14,31.2", והלד שעל הלוח מתחלף. במחשב, הקובץ `log.csv` נפתח בגיליון אלקטרוני בשתי עמודות: שניות וטמפרטורה.', 'Every two seconds a line such as "14,31.2" is printed, and the board\'s LED switches. On the computer, the file `log.csv` opens in a spreadsheet as two columns: seconds and temperature.'),
      tasks: [
        { t: B('הוסיפו עמודה שלישית: הקריאה של פוטנציומטר על GP26.', 'Add a third column: the reading of a potentiometer on GP26.') },
        { t: B('בפתיחת התוכנית, הדפיסו את כל הקבצים שעל הכרטיס ואת הגודל של `log.csv`.', 'When the program starts, print all the files on the card and the size of `log.csv`.'),
          code: ['print(os.listdir("/sd"))', 'print(os.stat("/sd/log.csv")[6], "bytes")'] },
        { t: B('צרו גרף של הטמפרטורה בגיליון האלקטרוני. אחר כך חממו את השבב באצבע ומדדו שוב.', 'Make a chart of the temperature in the spreadsheet. Then warm the chip with a finger and measure again.') }
      ],
      quiz: [
        OUT(B('מה תהיה השורה בקובץ?', 'What will the line in the file be?'),
          ['line = "%d,%.1f" % (14, 31.27)', 'print(line)'], '14,31.3',
          B('`%d` כותב מספר שלם, ו-`%.1f` מעגל לספרה אחת אחרי הנקודה.', '`%d` writes a whole number, and `%.1f` rounds to one digit after the point.')),
        Q(B('למה פותחים וסוגרים את הקובץ בכל כתיבה, במקום לפתוח אותו פעם אחת?', 'Why open and close the file on every write, instead of opening it once?'),
          [B('כדי שכל שורה תישמר באמת בכרטיס, גם אם החשמל נופל', 'So each line is really saved on the card, even if the power fails'), B('כי אי אפשר לכתוב פעמיים לאותו קובץ', 'Because you cannot write twice to the same file'), B('כדי לחסוך בחשמל', 'To save power')], 0,
          B('סגירה מוודאת שהנתונים יצאו מהזיכרון הזמני אל הכרטיס.', 'Closing makes sure the data leaves the temporary memory and reaches the card.')),
        Q(B('מה עושה `os.mount(sd, "/sd")`?', 'What does `os.mount(sd, "/sd")` do?'),
          [B('מחבר את הכרטיס למערכת הקבצים, כך שאפשר לפתוח בו קבצים בנתיב `/sd/`', 'Attaches the card to the file system, so files on it can be opened under `/sd/`'), B('מפרמט את הכרטיס', 'Formats the card'), B('מוחק את הכרטיס', 'Erases the card')], 0,
          B('אחרי ה-mount, `open("/sd/log.csv")` כותב לכרטיס ולא לזיכרון של הלוח.', 'After the mount, `open("/sd/log.csv")` writes to the card and not to the board\'s memory.'))
      ]
    },
    H8: {
      id: 'H8', track: 'H',
      title: B('פלס דיגיטלי על מסך', 'A digital spirit level on a display'),
      goal: B('חיישן התאוצה MPU6050 יודע לאיזה כיוון הלוח נוטה. המסך מציג "בועה" שזזה לפי ההטיה, כמו פלס של בנאים, ואת זוויות ההטיה במעלות.', 'The MPU6050 accelerometer knows which way the board is tilted. The display shows a "bubble" that moves with the tilt, like a builder\'s spirit level, and the tilt angles in degrees.'),
      learn: [
        B('איך חיישן תאוצה מודד הטיה בעזרת כוח המשיכה.', 'How an accelerometer measures tilt using gravity.'),
        B('איך מחשבים זווית עם `atan2`.', 'How to work out an angle with `atan2`.'),
        B('איך מציירים צורות על המסך: מלבן, קווים ונקודה.', 'How to draw shapes on the display: a rectangle, lines and a dot.')
      ],
      before: [PART('mpu6050', 'העמוד של MPU6050', 'The MPU6050\'s page', 'שם מוסבר איך קוראים את שלושת הצירים.', 'It explains how the three axes are read.'), LESSON('C3', 'המסך נשאר מחובר.', 'The display stays connected.')],
      parts: [{ id: 'mpu6050', qty: 1 }, { id: 'oled', qty: 1 }, { text: B('שמונה חוטי גישור', 'Eight jumper wires') }],
      wiring: [
        W(B('MPU6050, VCC ומסך, VCC', 'MPU6050 VCC and display VCC'), '3V3', 36, B('דרך פס ההזנה', 'through the power rail'), '3.3V'),
        W(B('MPU6050, GND ומסך, GND', 'MPU6050 GND and display GND'), 'GND', 38, B('דרך פס האדמה', 'through the ground rail'), 'GND'),
        W(B('MPU6050, SDA ומסך, SDA', 'MPU6050 SDA and display SDA'), 'GP4', 6, B('שני הרכיבים על אותו קו', 'both parts on the same line'), 'SDA'),
        W(B('MPU6050, SCL ומסך, SCL', 'MPU6050 SCL and display SCL'), 'GP5', 7, B('שני הרכיבים על אותו קו', 'both parts on the same line'), 'SCL')
      ],
      steps: [UNPLUG, CLEAR,
        B('הכניסו את החיישן ואת המסך למטריצה, וחברו את שניהם לאותם ארבעה קווים. לכל אחד כתובת משלו: המסך 0x3C והחיישן 0x68.', 'Push the sensor and the display into the breadboard, and connect both to the same four lines. Each has its own address: the display 0x3C and the sensor 0x68.'),
        RAILS, PLUG, RUN,
        B('הניחו את המטריצה על שולחן ישר: הבועה באמצע. הטו אותה לאט לכל צד.', 'Put the breadboard on a level table: the bubble is in the middle. Tilt it slowly to each side.'),
        READ],
      code: [
        'from machine import Pin, I2C',
        'from ssd1306 import SSD1306_I2C',
        'from time import sleep',
        'import struct, math',
        '',
        'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
        'oled = SSD1306_I2C(128, 64, i2c)',
        'MPU = 0x68',
        'i2c.writeto_mem(MPU, 0x6B, b"\\x00")          # wake the sensor up',
        '',
        'def tilt():',
        '    ax, ay, az = struct.unpack(">hhh", i2c.readfrom_mem(MPU, 0x3B, 6))',
        '    pitch = math.degrees(math.atan2(ax, math.sqrt(ay * ay + az * az)))',
        '    roll = math.degrees(math.atan2(ay, az))',
        '    return pitch, roll',
        '',
        'while True:',
        '    pitch, roll = tilt()',
        '    x = 64 + int(max(-30, min(30, roll)) * 2)     # 30 degrees = 60 pixels',
        '    y = 32 + int(max(-30, min(30, pitch)))',
        '    oled.fill(0)',
        '    oled.rect(0, 0, 128, 64, 1)',
        '    oled.hline(54, 32, 20, 1)',
        '    oled.vline(64, 22, 20, 1)',
        '    oled.fill_rect(x - 3, y - 3, 7, 7, 1)',
        '    oled.text("%+d %+d" % (int(pitch), int(roll)), 4, 4)',
        '    oled.show()',
        '    sleep(0.1)'
      ],
      explain: [
        E([9], 'החיישן מתחיל במצב שינה. כתיבת 0 לאוגר 0x6B מעירה אותו, כמו בעמוד שלו.', 'The sensor starts asleep. Writing 0 to register 0x6B wakes it, as on its page.'),
        E([12], 'קוראים 6 בתים, שלושה מספרים של 16 ביט עם סימן: התאוצה בצירים X, Y ו-Z.', 'Read 6 bytes, three signed 16-bit numbers: the acceleration on the X, Y and Z axes.'),
        E([13, 14], 'כשהלוח עומד, כוח המשיכה מושך רק בציר Z. כשמטים אותו, חלק מהמשיכה עובר לצירים האחרים. `atan2` הופך את היחס בין הצירים לזווית.', 'With the board still, gravity pulls only on the Z axis. Tilted, part of the pull moves to the other axes. `atan2` turns the ratio between the axes into an angle.'),
        E([19, 20], 'ממירים זווית למיקום על המסך. `max` ו-`min` מגבילים ל-30 מעלות, כדי שהבועה לא תצא מהמסך.', 'Turn the angle into a position on the display. `max` and `min` limit it to 30 degrees, so the bubble does not leave the display.'),
        E([21, 27], 'מציירים מחדש: מסגרת, צלב במרכז, ריבוע קטן במקום הבועה, ואת שתי הזוויות בפינה.', 'Redraw: a frame, a cross in the centre, a small square where the bubble is, and the two angles in the corner.')
      ],
      expect: B('על שולחן ישר הבועה במרכז הצלב, והזוויות קרובות ל-0. כשמטים את הלוח, הבועה זזה לכיוון ההטיה, והמספרים עולים עד 30 מעלות בערך לכל צד.', 'On a level table the bubble sits at the centre of the cross, and the angles are close to 0. When the board is tilted the bubble moves with the tilt, and the numbers rise to about 30 degrees each way.'),
      tasks: [
        { t: B('הבועה רועדת. החליקו את הזוויות: כל מדידה חדשה משנה רק רבע מהמרחק.', 'The bubble shakes. Smooth the angles: each new reading changes only a quarter of the distance.'),
          hint: B('שמרו `sp` ו-`sr` מחוץ ללולאה, ובכל סיבוב `sp = sp + (pitch - sp) / 4`, כמו בשיעור H1.', 'Keep `sp` and `sr` outside the loop, and on each round `sp = sp + (pitch - sp) / 4`, as in lesson H1.') },
        { t: B('הוסיפו זמזם שמצפצף כשהלוח ישר (שתי הזוויות פחות ממעלה אחת).', 'Add a buzzer that beeps when the board is level (both angles under one degree).') }
      ],
      quiz: [
        OUT(B('איזו זווית מחזירה `atan2` כשהצירים שווים?', 'What angle does `atan2` give when the axes are equal?'),
          ['import math', 'print(round(math.degrees(math.atan2(1, 1))))'], '45',
          B('כשהתאוצה מתחלקת שווה בשווה בין שני הצירים, הלוח נוטה ב-45 מעלות.', 'When the acceleration splits equally between the two axes, the board is tilted by 45 degrees.')),
        Q(B('למה מגבילים את הזווית ל-30 מעלות לפני שמחשבים את מיקום הבועה?', 'Why is the angle limited to 30 degrees before working out the bubble\'s position?'),
          [B('כדי שהבועה לא תצא מגבולות המסך', 'So the bubble does not leave the display'), B('כי החיישן לא מודד יותר מ-30', 'Because the sensor measures no more than 30'), B('כדי לחסוך בזיכרון', 'To save memory')], 0,
          B('30 מעלות הם 60 פיקסלים, בדיוק עד קצה המסך. זווית גדולה יותר הייתה מציירת מחוץ לו.', '30 degrees is 60 pixels, right up to the edge. A bigger angle would draw outside it.')),
        Q(B('החיישן והמסך מחוברים לאותם SDA ו-SCL. איך ה-Pico יודע למי הוא פונה?', 'The sensor and the display share SDA and SCL. How does the Pico know which one it is talking to?'),
          [B('לכל אחד כתובת משלו: 0x68 ו-0x3C', 'Each has its own address: 0x68 and 0x3C'), B('לפי הצבע של החוטים', 'By the colour of the wires'), B('הוא לא יודע, וזו שגיאה', 'It does not know, and it is a mistake')], 0,
          B('זה היתרון של I2C: הרבה רכיבים על שני חוטים, כל עוד הכתובות שונות.', 'That is the strength of I2C: many parts on two wires, as long as the addresses differ.'))
      ]
    }
  };

  /* place the lessons: track S after R3, and each part lesson after the last lesson of its track */
  function after(id, list) {
    var i = -1;
    P.lessons.forEach(function (l, k) { if (l.id === id) i = k; });
    P.lessons.splice.apply(P.lessons, [i + 1, 0].concat(list));
  }
  after('R3', trackS);
  after('E4', [parts.E5]);
  after('F4', [parts.F5, parts.F6]);
  after('G4', [parts.G5]);
  after('H7', [parts.H8]);

  /* the One-Wire interface page */
  P.interfaces.push({
    id: 'onewire', type: 'onewire', filter: 'gpio', demo: null,
    name: B('One-Wire, חוט אחד', 'One-Wire'),
    short: B('חוט נתונים אחד לכמה רכיבים, ולכל אחד מספר זיהוי משלו', 'One data wire for several parts, each with its own ID number'),
    plain: B('[[onewire|One-Wire]] הוא ממשק שבו כל התקשורת עוברת על חוט נתונים אחד, ועוד אדמה. הוא איטי, אבל חוסך חוטים, ועובד גם על כבל ארוך. הרכיב המוכר ביותר שמשתמש בו הוא מד הטמפרטורה DS18B20.', '[[onewire|One-Wire]] is an interface where all the communication goes over a single data wire, plus ground. It is slow, but saves wires, and works over a long cable too. The best-known part that uses it is the DS18B20 thermometer.'),
    analogy: B('קבוצה שמדברת בקשר עם ערוץ אחד: רק אחד מדבר בכל פעם, וכל אחד פותח במספר הזיהוי של מי שהוא פונה אליו.', 'A group on a radio with one channel: only one speaks at a time, and each starts with the ID of the one being addressed.'),
    what: [
      B('בזמן מנוחה, נגד משיכה (בדרך כלל 4.7kΩ) מחזיק את החוט על 1. כל צד מדבר על ידי משיכה קצרה של החוט ל-0, והאורך של כל משיכה קובע אם נשלח 0 או 1.', 'At rest, a pull-up resistor (usually 4.7 kΩ) holds the line at 1. Each side talks by briefly pulling the line to 0, and the length of each pull decides whether a 0 or a 1 was sent.'),
      B('לכל רכיב יש מספר זיהוי ייחודי של 64 ביט, שנצרב במפעל. `scan()` מוצא את כל המספרים שעל החוט.', 'Each part has a unique 64-bit ID number, burned in at the factory. `scan()` finds every number on the wire.'),
      B('אין קו שעון: הזמנים מוגדרים בדיוק במיקרו-שניות, ו-MicroPython מטפל בהם בשבילכם.', 'There is no clock line: the timings are set exactly in microseconds, and MicroPython handles them for you.')
    ],
    when: [
      B('כשרוצים כמה מדי טמפרטורה על חוט אחד, למשל בכמה חדרים או לאורך צינור.', 'When you want several thermometers on one wire, for example in several rooms or along a pipe.'),
      B('כשהחיישן רחוק מהלוח, על כבל של כמה מטרים.', 'When the sensor is far from the board, on a cable several metres long.'),
      B('הוא לא מתאים לכמויות גדולות של נתונים או למדידות מהירות. לשם כך יש I2C ו-SPI.', 'It does not suit large amounts of data or fast measurements. For that there are I2C and SPI.')
    ],
    wires: [
      { name: 'DQ', desc: B('קו הנתונים, עם נגד משיכה ל-3.3V.', 'The data line, with a pull-up resistor to 3.3 V.') },
      { name: 'VDD', desc: B('הזנה של 3.3V.', '3.3 V power.') },
      { name: 'GND', desc: B('[[ground|אדמה]] משותפת.', 'A shared [[ground|ground]].') }
    ],
    pinsNote: B('כל פין GP מתאים. באתר הזה משתמשים ב-GP7.', 'Any GP pin will do. This site uses GP7.'),
    code: [
      'import onewire, ds18x20',
      'from machine import Pin',
      'from time import sleep_ms',
      '',
      'ow = onewire.OneWire(Pin(7))',
      'print([hex(b) for b in ow.scan()[0]] if ow.scan() else "nothing found")',
      '',
      'ds = ds18x20.DS18X20(ow)',
      'ds.convert_temp()',
      'sleep_ms(750)',
      'for rom in ds.scan():',
      '    print(ds.read_temp(rom), "C")'
    ],
    explain: [
      E([5], 'השורה הופכת את GP7 לחוט One-Wire.', 'This line turns GP7 into a One-Wire line.'),
      E([6], 'סריקה: מדפיסה את 8 הבתים של מספר הזיהוי של הרכיב הראשון, או הודעה שלא נמצא כלום.', 'A scan: prints the 8 bytes of the first part\'s ID number, or a message that nothing was found.'),
      E([8, 12], 'הספרייה של DS18B20 משתמשת באותו חוט, מבקשת מדידה מכל החיישנים יחד, וקוראת כל אחד לפי המספר שלו.', 'The DS18B20 library uses the same line, asks all the sensors to measure together, and reads each one by its number.')
    ],
    tips: [
      B('בלי נגד המשיכה, הסריקה לא מוצאת כלום. נגד אחד מספיק לכל החוט.', 'Without the pull-up resistor the scan finds nothing. One resistor is enough for the whole wire.'),
      B('בכבל ארוך, נגד קטן יותר (2.2kΩ) עוזר לקו לעלות ל-1 מהר יותר.', 'On a long cable, a smaller resistor (2.2 kΩ) helps the line rise to 1 faster.')
    ],
    more: B('מד טמפרטורה DS18B20 אטום למים, מזהי iButton.', 'A waterproof DS18B20 thermometer, iButton keys.'),
    quiz: [
      Q(B('כמה חוטי נתונים צריך כדי לחבר שלושה חיישני DS18B20?', 'How many data wires do you need for three DS18B20 sensors?'),
        [B('אחד', 'One'), B('שלושה', 'Three'), B('שניים: נתונים ושעון', 'Two: data and clock')], 0,
        B('כולם על אותו חוט, וכל אחד מזוהה לפי המספר שלו.', 'They all share one wire, and each is identified by its number.')),
      Q(B('מה תפקיד הנגד בין DQ ל-3.3V?', 'What is the job of the resistor between DQ and 3.3 V?'),
        [B('הוא מחזיק את הקו על 1 כשאף אחד לא מדבר', 'It holds the line at 1 when nobody is talking'), B('הוא מגן על החיישן מחום', 'It protects the sensor from heat'), B('הוא מאט את התקשורת', 'It slows the communication')], 0,
        B('הרכיבים רק מושכים את הקו ל-0. את ה-1 נותן הנגד.', 'The parts only pull the line to 0. The resistor provides the 1.'))
    ]
  });
})(window.PICO);
