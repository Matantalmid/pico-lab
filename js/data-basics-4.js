/* Basics, chapter 15: the second core (_thread) and saving power (lightsleep, deepsleep, freq).
   A short advanced chapter. Track R (data-lessons-5.js) is the usual way to do several things at once;
   this chapter shows the other two tools and when they are worth it.
   Same block types as data-basics.js. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };

  P.basics.push({
    id: 'cores',
    title: B('שתי ליבות, ושינה לחיסכון בחשמל', 'Two cores, and sleep to save power'),
    lead: B('פרק מתקדם וקצר. ל-Pico 2 יש שתי ליבות מעבד, ואפשר להריץ קוד על הליבה השנייה. אפשר גם להרדים את הלוח כדי שהסוללה תחזיק זמן רב יותר. לרוב הפרויקטים מספיק מסלול R ("כמה דברים בבת אחת"), אבל כדאי לדעת שהכלים האלה קיימים.', 'A short advanced chapter. The Pico 2 has two processor cores, and code can run on the second one. The board can also be put to sleep so a battery lasts longer. For most projects track R ("Several things at once") is enough, but it is worth knowing these tools exist.'),
    blocks: [
      { h: B('הליבה השנייה: `_thread`', 'The second core: `_thread`') },
      { p: B('בדרך כלל כל התוכנית רצה על ליבה אחת. `_thread.start_new_thread` מריץ פונקציה על הליבה השנייה, במקביל של ממש. ב-Pico אפשר להפעיל כך רק פונקציה נוספת אחת.', 'Normally the whole program runs on one core. `_thread.start_new_thread` runs a function on the second core, truly in parallel. On the Pico only one extra function can be started this way.') },
      { code: [
        'import _thread',
        'from machine import Pin',
        'from time import sleep',
        '',
        'led = Pin(15, Pin.OUT)',
        'button = Pin(14, Pin.IN, Pin.PULL_UP)',
        'presses = 0',
        'lock = _thread.allocate_lock()',
        '',
        'def second_core():',
        '    while True:                  # runs on core 1',
        '        led.toggle()',
        '        sleep(0.5)',
        '',
        '_thread.start_new_thread(second_core, ())',
        '',
        'last = 1',
        'while True:                      # runs on core 0',
        '    now = button.value()',
        '    if last == 1 and now == 0:',
        '        with lock:',
        '            presses = presses + 1',
        '        print("presses:", presses)',
        '    last = now',
        '    sleep(0.01)'
      ] },
      { ul: [
        B('`lock` מונע משתי הליבות לשנות את אותו משתנה באותו רגע. כל משתנה ששתי הליבות כותבות אליו עוטפים ב-`with lock:`.', '`lock` stops the two cores changing the same variable at the same moment. Any variable both cores write to is wrapped in `with lock:`.'),
        B('Stop ב-Thonny עוצר רק את הליבה הראשונה. לפעמים הליבה השנייה ממשיכה לרוץ וה-Pico לא מגיב, ואז צריך לנתק את הכבל ולחבר אותו מחדש.', 'Stop in Thonny halts only the first core. Sometimes the second core keeps running and the Pico does not respond, and then you unplug and replug the cable.'),
        B('Wokwi מדמה רק ליבה אחת של Pico 2, ולכן `_thread` לא עובד שם. בדקו את הקוד על לוח אמיתי.', 'Wokwi simulates only one core of the Pico 2, so `_thread` does not work there. Test on a real board.')
      ] },
      { tip: B('מתי באמת צריך ליבה שנייה? כאשר יש עבודה כבדה שאינה יכולה לחכות, למשל חישוב ארוך בזמן שדוגמים אות במהירות. בשביל לד, כפתור ומסך, asyncio (שיעור R3) פשוט ובטוח יותר.', 'When is a second core really needed? When there is heavy work that cannot wait, such as a long calculation while sampling a signal fast. For an LED, a button and a display, asyncio (lesson R3) is simpler and safer.') },

      { h: B('שינה: הלוח צורך פחות חשמל', 'Sleep: the board uses less power') },
      { p: B('`sleep(10)` רגיל לא חוסך חשמל: המעבד ממשיך לעבוד במלוא המהירות ורק סופר זמן. כשהפרויקט פועל על סוללה, משתמשים בשינה אמיתית.', 'A plain `sleep(10)` saves no power: the processor keeps running at full speed and only counts time. When the project runs on a battery, use real sleep.') },
      { table: {
        head: [B('פקודה', 'Command'), B('מה קורה', 'What happens'), B('אחרי ההתעוררות', 'After waking')],
        rows: [
          [B('`time.sleep(s)`', '`time.sleep(s)`'), B('המעבד עובד וממתין, ואין חיסכון.', 'The processor runs and waits. No saving.'), B('התוכנית ממשיכה מהשורה הבאה', 'Carries on from the next line')],
          [B('`machine.lightsleep(ms)`', '`machine.lightsleep(ms)`'), B('רוב השעונים בשבב נעצרים, והצריכה יורדת מאוד. חיבור ה-USB מתנתק.', 'Most clocks in the chip stop. Power use drops a lot. The USB connection drops.'), B('התוכנית ממשיכה מהשורה הבאה, עם כל המשתנים', 'Carries on from the next line, with every variable')],
          [B('`machine.deepsleep(ms)`', '`machine.deepsleep(ms)`'), B('החיסכון הגדול ביותר.', 'The most saving.'), B('הלוח מתחיל מחדש, כמו בהדלקה, והמשתנים נמחקים.', 'The board starts over, as at power-up. The variables are lost.')]
        ]
      } },
      { code: [
        'import machine',
        'from machine import Pin, ADC',
        'from time import sleep',
        '',
        'sleep(5)          # 5 seconds to press Stop in Thonny before the first sleep',
        '',
        'led = Pin("LED", Pin.OUT)',
        'sensor = ADC(4)',
        '',
        'while True:',
        '    led.on()',
        '    value = sensor.read_u16()       # measure, save or send the reading here',
        '    led.off()',
        '    machine.lightsleep(10000)       # sleep 10 seconds, using little power'
      ] },
      { ul: [
        B('השורה `sleep(5)` שבהתחלה חשובה: בזמן `lightsleep` ה-USB מתנתק, ו-Thonny לא מצליח לעצור את התוכנית. חמש השניות הראשונות אחרי החיבור הן ההזדמנות ללחוץ על Stop.', 'The `sleep(5)` line at the start matters: during `lightsleep` the USB drops, and Thonny cannot stop the program. The first five seconds after plugging in are the chance to press Stop.'),
        B('אם שמרתם תוכנית כ-`main.py` עם שינה ארוכה וקשה לעצור אותה, לחצו על Stop שוב ושוב מיד אחרי שאתם מחברים את הכבל.', 'A program saved as `main.py` with a long sleep, and hard to stop: press Stop again and again right after plugging in the cable.'),
        B('עדיין לא בדקנו את `lightsleep` ו-`deepsleep` על Pico 2 במסגרת האתר. לפני שסומכים על המספרים, מדדו את הצריכה בעזרת מד זרם (למשל INA219 משיעור H4).', 'We have not yet checked `lightsleep` and `deepsleep` on the Pico 2 as part of the site. Measure the current draw with a current meter (for example the INA219 from lesson H4) before relying on the numbers.')
      ] },

      { h: B('האטת השעון', 'Slowing the clock') },
      { p: B('`machine.freq()` מחזיר את מהירות המעבד בהרץ (150000000 ב-Pico 2). אפשר להוריד אותה, למשל עם `machine.freq(64_000_000)`, ואז הלוח צורך פחות חשמל. `sleep` ו-`ticks_ms` ממשיכים למדוד זמן נכון.', '`machine.freq()` returns the processor speed in hertz (150000000 on the Pico 2). It can be lowered, for example `machine.freq(64_000_000)`, and the board uses less power. `sleep` and `ticks_ms` keep counting time correctly.') }
    ],
    quiz: [
      Q(B('הפרויקט פועל על סוללה ומודד פעם בדקה. מה יחסוך הכי הרבה חשמל בין המדידות?', 'The project runs on a battery and measures once a minute. What saves the most power between measurements?'),
        [B('`time.sleep(60)`', '`time.sleep(60)`'), B('`machine.lightsleep(60000)`', '`machine.lightsleep(60000)`'), B('לולאה ריקה', 'An empty loop')], 1,
        B('`time.sleep` משאיר את המעבד פועל. `lightsleep` עוצר את רוב השעונים, וכשהלוח מתעורר הוא ממשיך מאותה שורה.', '`time.sleep` keeps the processor running. `lightsleep` stops most clocks, and carries on from the same line when it wakes.')),
      Q(B('שתי הליבות מוסיפות 1 לאותו מונה. מה מונע טעות כשהן עושות זאת באותו רגע?', 'Both cores add 1 to the same counter. What prevents a mistake when they do it at the same moment?'),
        [B('`sleep` קצר', 'A short `sleep`'), B('`with lock:` סביב השינוי', '`with lock:` around the change'), B('שום דבר, כי זה לא יכול לקרות', 'Nothing, it cannot happen')], 1,
        B('המנעול מאפשר רק לליבה אחת לשנות את המשתנה בכל רגע, והשנייה ממתינה עד שהמנעול משתחרר.', 'The lock lets only one core change the variable at a time. The other waits until the lock is released.')),
      Q(B('אחרי `machine.deepsleep(5000)` הלוח מתעורר. מאיפה התוכנית ממשיכה?', 'After `machine.deepsleep(5000)` the board wakes up. Where does the program carry on from?'),
        [B('מהשורה שאחרי deepsleep', 'From the line after deepsleep'), B('מההתחלה של main.py, כמו בהדלקה', 'From the start of main.py, as at power-up'), B('היא לא ממשיכה', 'It does not carry on')], 1,
        B('שינה עמוקה מאפסת את הלוח, ולכן את מה שצריך לזכור בין שינה לשינה שומרים בקובץ.', 'Deep sleep resets the board. Anything to keep between sleeps is saved in a file.'))
    ]
  });
})(window.PICO);
