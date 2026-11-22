/* Basics, follow-on chapters 9 to 13. The first eight chapters get a reader
   to the first circuit. These five are read later, before lesson tracks
   E to G: more Python, interrupts and timers, choosing a bus, power, and
   finding faults. Same block types as data-basics.js. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var E = function (lines, he, en) { return { l: lines, t: B(he, en) }; };
  var Q = function (q, a, ok, why) { return { q: q, a: a, ok: ok, why: why }; };

  P.basics.push(
    /* ------------------------------------------------------------ 9 */
    {
      id: 'python2',
      title: B('עוד פייתון: רשימות, מילונים ופונקציות', 'More Python: lists, dictionaries and functions'),
      lead: B('פרק המשך: ארבעה כלים שהופכים תוכנית ארוכה ומבולגנת לתוכנית קצרה וברורה.', 'A follow-on chapter. Four tools that turn a long, messy program into a short, clear one.'),
      blocks: [
        { tip: B('הפרק הזה וארבעת הפרקים שאחריו הם פרקי המשך. אם עדיין לא עברתם על "מתחילים" ועל מסלולי השיעורים A עד D, עשו זאת קודם, וחזרו לכאן לפני מסלול E.', 'This chapter and the four after it are follow-on chapters. If you have not yet been through Get started and lesson tracks A to D, do that first, and come back here before track E.') },
        { p: B('בפרק "פייתון בעשר דקות" למדתם על [[variable|משתנים]], [[cond|תנאים]], [[loop|לולאות]] ו[[func|פונקציות]]. זה מספיק ללד ולכפתור. כשהפרויקט גדל, שלושה לדים הופכים לשמונה ומקש אחד הופך ל-16, ואז צריך דרך לטפל בהרבה דברים דומים בבת אחת.', 'In the chapter "Python in ten minutes" you learned [[variable|variables]], [[cond|conditions]], [[loop|loops]] and [[func|functions]]. That is enough for an LED and a button. As a project grows, three LEDs become eight and one key becomes 16, and you need a way to handle many similar things at once.') },
        { h: B('רשימה: הרבה ערכים תחת שם אחד', 'A list: many values under one name') },
        { p: B('[[list|רשימה]] היא כמה ערכים ברצף, בתוך סוגריים מרובעים. במקום שלושה משתנים, `led1`, `led2` ו-`led3`, כותבים רשימה אחת.', 'A [[list|list]] is several values in a row, inside square brackets. Instead of three variables `led1`, `led2`, `led3` you write one list.') },
        { code: ['from machine import Pin', 'from time import sleep', '', 'leds = [Pin(13, Pin.OUT), Pin(14, Pin.OUT), Pin(15, Pin.OUT)]', '', 'leds[0].on()', 'print(len(leds))', '', 'while True:', '    for led in leds:', '        led.on()', '        sleep(0.2)', '        led.off()'],
          explain: [
            E([4], 'השורה הזו יוצרת רשימה של שלושה פינים. הפסיקים מפרידים בין הערכים.', 'A list of three pins. The commas separate the values.'),
            E([6], 'ניגשים לערך לפי המקום שלו, בתוך סוגריים מרובעים. הספירה מתחילה מ-0, ולכן `leds[0]` הוא הערך הראשון ו-`leds[2]` הוא האחרון.', 'A value is reached by its position in square brackets. Counting starts at 0, so `leds[0]` is the first and `leds[2]` is the last.'),
            E([7], '`len` מחזיר את מספר הערכים שברשימה, וכאן הוא 3.', '`len` returns how many values the list holds. Here, 3.'),
            E([10], 'לולאת `for` עוברת על הרשימה, ובכל סיבוב `led` הוא הערך הבא בתור.', 'A `for` loop walks through the list. On each turn `led` is the next value in line.'),
            E([11, 13], 'השורות האלה קובעות מה קורה לכל לד בתורו. כדי להוסיף לד רביעי, צריך לשנות רק את שורה 4.', 'What happens to each LED in turn. To add a fourth LED you change only line 4.')
          ] },
        { ul: [
          B('`leds.append(x)` מוסיף ערך לסוף הרשימה.', '`leds.append(x)` adds a value to the end of the list.'),
          B('`x in leds` בודק אם ערך נמצא ברשימה, ומחזיר `True` או `False`.', '`x in leds` checks whether a value is in the list, and gives `True` or `False`.'),
          B('`range(4)` מתנהג כמו הרשימה 0, 1, 2, 3, ולכן `for i in range(4)` חוזר ארבע פעמים.', '`range(4)` behaves like the list 0, 1, 2, 3. So `for i in range(4)` repeats four times.'),
          B('גם טקסט מתנהג כמו רשימה של תווים: `"PICO"[0]` הוא `"P"`.', 'Text also behaves like a list of characters: `"PICO"[0]` is `"P"`.')
        ] },
        { tip: B('הטעות הנפוצה ביותר היא לבקש מקום שלא קיים. ברשימה של שלושה ערכים, `leds[3]` גורם לשגיאה `IndexError`, כי המקומות הם 0, 1 ו-2.', 'The most common mistake: asking for a position that does not exist. In a list of three values, `leds[3]` causes an `IndexError`, because the positions are 0, 1 and 2.') },
        { h: B('מילון: ערכים לפי שם', 'A dictionary: values by name') },
        { p: B('ב[[dict|מילון]] ניגשים לערך לפי מפתח, ולא לפי מקום. המפתח הוא בדרך כלל טקסט. זה שימושי כשרוצים לתרגם מילה למספרים, למשל שם של צבע לשלושה ערכים.', 'In a [[dict|dictionary]] a value is reached by a key and not by position. The key is usually text. This is useful when you want to translate a word into numbers, for example a colour name into three values.') },
        { code: ['COLORS = {', '    "red": (255, 0, 0),', '    "green": (0, 255, 0),', '    "blue": (0, 0, 255),', '}', '', 'name = "green"', 'if name in COLORS:', '    r, g, b = COLORS[name]', '    print(r, g, b)'],
          explain: [
            E([1, 5], 'מילון נכתב בסוגריים מסולסלים. בכל שורה יש מפתח, נקודתיים וערך.', 'A dictionary is written in curly brackets. On each line: a key, a colon, a value.'),
            E([2], 'הערך כאן הוא שלושה מספרים בסוגריים עגולים. זו רשימה שאי אפשר לשנות, שנקראת tuple.', 'The value here is three numbers in round brackets. That is a list that cannot be changed, called a tuple.'),
            E([8], 'השורה הזו בודקת שהמפתח קיים. בקשה של מפתח שלא קיים גורמת לשגיאה `KeyError`.', 'Checks that the key exists. Asking for a key that does not exist is a `KeyError`.'),
            E([9], 'השורה הזו מוציאה את הערך, ומפרקת אותו מיד לשלושה משתנים.', 'Takes the value out, and unpacks it straight into three variables.')
          ] },
        { h: B('פונקציה שמחזירה תשובה', 'A function that returns an answer') },
        { p: B('עד עכשיו פונקציות עשו משהו: הדליקו לד או צפצפו. אבל פונקציה יכולה גם לחשב משהו ולהחזיר תוצאה, בעזרת המילה `return`. כך אפשר להסתיר חישוב מסובך מאחורי שם ברור.', 'So far functions did something: lit up, beeped. A function can also work something out and hand back a result, with the word `return`. This hides a complicated calculation behind a clear name.') },
        { code: ['def to_percent(raw, low=0, high=65535):', '    value = (raw - low) * 100 // (high - low)', '    return max(0, min(100, value))', '', 'print(to_percent(32768))', 'print(to_percent(900, 300, 1500))'],
          explain: [
            E([1], 'זו פונקציה עם שלושה פרמטרים. לשניים האחרונים יש ערך ברירת מחדל: אם לא מוסרים אותם, הם 0 ו-65535.', 'A function with three parameters. The last two have a default value: if they are not given, they are 0 and 65535.'),
            E([2], 'זה החישוב עצמו. `//` הוא חילוק שמחזיר מספר שלם.', 'The calculation. `//` is division that gives a whole number.'),
            E([3], '`return` מחזיר את התוצאה למי שקרא לפונקציה. `min` ו-`max` דואגים שהיא תישאר בין 0 ל-100.', '`return` hands the result back to whoever called the function. `min` and `max` keep it between 0 and 100.'),
            E([5], 'קריאה לפונקציה עם ערך אחד. מודפס 50.', 'A call with one value. 50 is printed.'),
            E([6], 'קריאה עם שלושה ערכים: 900, בטווח שבין 300 ל-1500. מודפס 50.', 'A call with three values: 900 in the range between 300 and 1500. 50 is printed.')
          ] },
        { p: B('משתנה שנוצר בתוך פונקציה קיים רק בתוכה, ולכן `value` לא קיים מחוץ ל-`to_percent`. אם פונקציה צריכה לשנות משתנה שהוגדר מחוץ לה, כותבים בתחילתה `global` ואת שם המשתנה. זה [[global|משתנה גלובלי]], ותפגשו אותו בפרק הבא.', 'A variable created inside a function lives only inside it. `value` does not exist outside `to_percent`. If a function needs to change a variable defined outside, you write `global` and its name at its start. That is a [[global|global variable]], and you will meet it in the next chapter.') },
        { h: B('try ו-except: כשמשהו עלול להיכשל', 'try and except: when something may fail') },
        { p: B('חיישן שהתנתק או טקסט משובש גורמים ל[[exception|חריגה]], והתוכנית נעצרת. בפרויקט שעובד לבד זה לא רצוי, ולכן עוטפים את השורות המסוכנות ב-`try`, וכותבים ב-`except` מה לעשות אם הן נכשלו.', 'A sensor that came loose or garbled text causes an [[exception|exception]], and the program stops. In a project that runs by itself this is unwelcome. You wrap the risky lines in `try`, and say in `except` what to do if they failed.') },
        { code: ['text = "12a"', 'try:', '    number = int(text)', '    print("the number is", number)', 'except ValueError:', '    print("not a number:", text)', 'print("still running")'],
          explain: [
            E([2, 4], 'כאן מנסים. `int` הופך טקסט למספר, ונכשל אם יש בטקסט אות.', 'Tries. `int` turns text into a number, and fails if there is a letter in it.'),
            E([5, 6], 'אם הייתה שגיאה מסוג `ValueError`, התוכנית קופצת לכאן במקום לעצור.', 'If there was an error of the `ValueError` kind, the program jumps here instead of stopping.'),
            E([7], 'השורה הזו רצה בכל מקרה.', 'This line runs either way.')
          ] },
        { tip: B('תפסו רק את השגיאה שאתם מצפים לה. `except:` לבד, בלי שם, בולע גם את שגיאות הכתיב שלכם, ואז קשה מאוד למצוא אותן.', 'Catch only the error you expect. A bare `except:` with no name also swallows your own typing mistakes, which then become very hard to find.') }
      ],
      quiz: [
        Q(B('ברשימה `names = ["a", "b", "c"]`, מה מחזיר `names[1]`?', 'In the list `names = ["a", "b", "c"]`, what does `names[1]` give?'),
          [B('`"a"`', '`"a"`'), B('`"b"`', '`"b"`'), B('שגיאה', 'An error')], 1,
          B('הספירה מתחילה מ-0, ולכן מקום 1 הוא הערך השני.', 'Counting starts at 0, so position 1 is the second value.')),
        Q(B('מה עושה `return` בפונקציה?', 'What does `return` do in a function?'),
          [B('מדפיס את התוצאה', 'Prints the result'), B('מחזיר את התוצאה למי שקרא לפונקציה, ומסיים אותה', 'Hands the result back to the caller, and ends the function'), B('מתחיל את הפונקציה מחדש', 'Starts the function again')], 1,
          B('`return` לא מדפיס דבר. הוא מוסר ערך, ומי שקרא לפונקציה מחליט מה לעשות איתו.', '`return` prints nothing. It hands over a value, and the caller decides what to do with it.'))
      ]
    },

    /* ------------------------------------------------------------ 10 */
    {
      id: 'interrupts',
      title: B('פסיקות וטיימרים: איך לא מפספסים שום דבר', 'Interrupts and timers: missing nothing'),
      lead: B('מה עושים כשהתוכנית עסוקה בדיוק ברגע שבו קורה משהו חשוב.', 'What to do when the program is busy at the very moment something important happens.'),
      blocks: [
        { p: B('תוכנית שמהבהבת לד משתמשת ב-`sleep(1)`. במשך השנייה הזו ה-Pico לא עושה כלום, וגם לא בודק כפתורים. אם לוחצים ומשחררים כפתור בזמן ההמתנה, הלחיצה הולכת לאיבוד. ככל שהתוכנית עושה יותר, הבעיה מחמירה.', 'A program that blinks an LED writes `sleep(1)`. For that second the Pico does nothing, and checks no buttons either. Press and release during the wait, and the press is lost. The more a program does, the worse this gets.') },
        { p: B('יש שלושה פתרונות, וכל אחד מהם מתאים למצב אחר.', 'There are three solutions. Each suits a different situation.') },
        { h: B('פתרון 1: לא לישון, אלא לבדוק את השעון', 'Solution 1: do not sleep, check the clock') },
        { p: B('במקום לחכות שנייה שלמה, שואלים שוב ושוב "עברה כבר שנייה?". בין שאלה לשאלה אפשר לבדוק כפתורים וחיישנים. `ticks_ms()` מחזיר את מספר אלפיות השנייה שעברו מאז שהלוח נדלק.', 'Instead of waiting a whole second, you keep asking "has a second passed yet?". Between one question and the next, buttons and sensors can be checked. `ticks_ms()` gives the number of milliseconds since the board was switched on.') },
        { code: ['from machine import Pin', 'from time import ticks_ms, ticks_diff', '', 'led = Pin("LED", Pin.OUT)', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', 'last = ticks_ms()', '', 'while True:', '    if ticks_diff(ticks_ms(), last) >= 1000:', '        led.toggle()', '        last = ticks_ms()', '    if button.value() == 0:', '        print("pressed")'],
          explain: [
            E([6], 'השורה הזו זוכרת מתי הלד התחלף בפעם האחרונה.', 'Remembers when the LED last flipped.'),
            E([9], '`ticks_diff` מחשב כמה זמן עבר בין שני רגעים. אם עברו 1000 אלפיות שנייה, הגיע הזמן.', '`ticks_diff` works out how much time passed between two moments. If 1000 milliseconds have passed, it is time.'),
            E([10, 11], 'השורות האלה הופכות את מצב הלד, וזוכרות את הרגע החדש.', 'Flips the LED, and remembers the new moment.'),
            E([12, 13], 'הכפתור נבדק אלפי פעמים בשנייה, כי הלולאה אף פעם לא ישנה.', 'The button is checked thousands of times a second, because the loop never sleeps.')
          ] },
        { tip: B('חשבו הפרש זמנים תמיד עם `ticks_diff`, ולעולם לא בחיסור רגיל. המונה מתאפס מדי פעם, ו-`ticks_diff` יודע לטפל בזה.', 'Always work out a time difference with `ticks_diff`, never with plain subtraction. The counter wraps round now and then, and `ticks_diff` knows how to handle that.') },
        { h: B('פתרון 2: פסיקה', 'Solution 2: an interrupt') },
        { p: B('[[interrupt|פסיקה]] דומה לפעמון בדלת. לא צריך לגשת לדלת כל דקה כדי לבדוק אם מישהו שם: כשמצלצלים, עוזבים הכול, פותחים, וחוזרים למה שעשיתם. באותו אופן אומרים ל-Pico: "כשהפין הזה משתנה, עצור הכול והרץ את הפונקציה הזו".', 'An [[interrupt|interrupt]] is like a doorbell. You need not walk to the door every minute to see whether someone is there: when it rings, you drop everything, open it, and go back to what you were doing. You tell the Pico: "when this pin changes, stop everything and run this function".') },
        { code: ['from machine import Pin', 'from time import sleep', '', 'button = Pin(14, Pin.IN, Pin.PULL_UP)', 'presses = 0', '', 'def on_press(pin):', '    global presses', '    presses = presses + 1', '', 'button.irq(trigger=Pin.IRQ_FALLING, handler=on_press)', '', 'while True:', '    print("presses so far:", presses)', '    sleep(2)'],
          explain: [
            E([5], 'משתנה שסופר לחיצות. הוא מוגדר מחוץ לכל פונקציה.', 'A variable that counts presses. It is defined outside every function.'),
            E([7], 'זו הפונקציה שהפסיקה מפעילה. היא מקבלת את הפין שגרם לפסיקה.', 'The function the interrupt runs. It receives the pin that caused the interrupt.'),
            E([8], '`global` אומר ש-`presses` הוא המשתנה שמחוץ לפונקציה, ולא משתנה חדש שבתוכה.', '`global` says: `presses` is the variable outside, not a new one inside the function.'),
            E([11], 'השורה הזו מחברת את הפונקציה לפין. `IRQ_FALLING` פירושו "כשהפין יורד מ-1 ל-0", כלומר ברגע הלחיצה. `IRQ_RISING` הוא הרגע ההפוך.', 'Attaches the function to the pin. `IRQ_FALLING` means "when the pin falls from 1 to 0", which is the moment of the press. `IRQ_RISING` is the opposite moment.'),
            E([13, 15], 'הלולאה הראשית ישנה שתי שניות בכל פעם, ובכל זאת אף לחיצה לא הולכת לאיבוד.', 'The main loop sleeps two seconds at a time, and still no press is lost.')
          ] },
        { h: B('שלושה כללים לפונקציה של פסיקה', 'Three rules for an interrupt function') },
        { ul: [
          B('קצרה. היא עוצרת את כל השאר, ולכן היא רק משנה משתנה או מרימה דגל. את העבודה עצמה עושה הלולאה הראשית.', 'Short. It stops everything else, so it only changes a variable or raises a flag. The main loop does the actual work.'),
          B('בלי `print`, בלי `sleep`, ובלי ליצור בתוכה רשימות או טקסטים חדשים. אלה פעולות איטיות, וחלקן אסורות בזמן פסיקה.', 'No `print`, no `sleep`, and no creating new lists or text inside it. Those are slow operations, and during an interrupt some are forbidden.'),
          B('כל משתנה שהיא משנה מוכרז כ-`global`.', 'Every variable it changes is declared `global`.')
        ] },
        { h: B('ריטוט: לחיצה אחת שנספרת חמש פעמים', 'Bounce: one press counted five times') },
        { p: B('כפתור בנוי משתי פיסות מתכת. כשהן נפגשות, הן קופצות ונוגעות זו בזו כמה פעמים, במשך כמה אלפיות שנייה. זה [[bounce|ריטוט מגעים]]. לולאה עם `sleep` לא שמה לב לזה, אבל פסיקה מהירה מספיק כדי לספור כל קפיצה. הפתרון: להתעלם מפסיקה שמגיעה פחות מ-200 אלפיות שנייה אחרי הקודמת.', 'A button is two pieces of metal. When they meet they bounce and touch several times, over a few milliseconds. That is [[bounce|contact bounce]]. A loop with `sleep` never notices. An interrupt is fast enough to count every bounce. The fix: ignore an interrupt that arrives less than 200 milliseconds after the previous one.') },
        { code: ['from time import ticks_ms, ticks_diff', '', 'last_time = 0', '', 'def on_press(pin):', '    global presses, last_time', '    now = ticks_ms()', '    if ticks_diff(now, last_time) < 200:', '        return', '    last_time = now', '    presses = presses + 1'],
          explain: [
            E([3], 'המשתנה הזה זוכר מתי הייתה הלחיצה האחרונה שנספרה.', 'When the last counted press happened.'),
            E([8, 9], 'אם עברו פחות מ-200 אלפיות שנייה, זו קפיצה ולא לחיצה חדשה. `return` לבד יוצא מהפונקציה.', 'If less than 200 milliseconds have passed, this is a bounce and not a new press. A bare `return` leaves the function.'),
            E([10, 11], 'זו לחיצה אמיתית: זוכרים את הזמן וסופרים אותה.', 'A real press: remembers the time and counts.')
          ] },
        { h: B('פתרון 3: טיימר', 'Solution 3: a timer') },
        { p: B('[[timer|טיימר]] הוא פסיקה שהשעון מפעיל, ולא פין. אומרים לו "כל שנייה, הרץ את הפונקציה הזו". הוא מתאים לדברים שקורים בקצב קבוע: הבהוב, מדידה כל עשר שניות או רישום לקובץ.', 'A [[timer|timer]] is an interrupt set off by the clock, not by a pin. You tell it "every second, run this function". It suits things that happen at a fixed pace: blinking, a measurement every ten seconds, writing to a file.') },
        { code: ['from machine import Pin, Timer', '', 'led = Pin("LED", Pin.OUT)', '', 'def tick(timer):', '    led.toggle()', '', 'blinker = Timer(period=500, mode=Timer.PERIODIC, callback=tick)', '', '# the main program is free to do anything else', '# to stop the timer: blinker.deinit()'],
          explain: [
            E([5, 6], 'זו הפונקציה שהטיימר מפעיל. היא מקבלת את הטיימר עצמו, אבל לא משתמשת בו.', 'The function the timer runs. It receives the timer itself, and does not use it.'),
            E([8], 'השורה הזו יוצרת טיימר שחוזר (`PERIODIC`) כל 500 אלפיות שנייה. `ONE_SHOT` היה מפעיל אותו פעם אחת בלבד.', 'A repeating (`PERIODIC`) timer, every 500 milliseconds. `ONE_SHOT` would run it once only.'),
            E([11], 'טיימר ממשיך לרוץ גם אחרי שהתוכנית נגמרה, וכך עוצרים אותו.', 'A timer keeps running even after the program has ended. This is how to stop it.')
          ] },
        { table: {
          head: [B('השיטה', 'Method'), B('מתי משתמשים', 'When'), B('החיסרון', 'The drawback')],
          rows: [
            [B('`ticks_ms` בלולאה', '`ticks_ms` in a loop'), B('ברוב המקרים. פשוט וצפוי.', 'Most cases. Simple and predictable.'), B('אם שלב אחד בלולאה איטי, הכול מתעכב.', 'If one stage of the loop is slow, everything is held up.')],
            [B('פסיקה של פין', 'A pin interrupt'), B('אירוע קצר שאסור לפספס: לחיצה, פולס של חיישן או מקודד סיבובי.', 'A short event that must not be missed: a press, a sensor pulse, a rotary encoder.'), B('הפונקציה חייבת להיות קצרה, וצריך לטפל בריטוט.', 'The function must be short, and bounce must be handled.')],
            [B('טיימר', 'A timer'), B('פעולה בקצב קבוע.', 'An action at a fixed pace.'), B('אותם כללים כמו בפסיקה.', 'The same rules as an interrupt.')]
          ]
        } }
      ],
      quiz: [
        Q(B('למה לא כותבים `print` בתוך פונקציה של פסיקה?', 'Why is `print` not written inside an interrupt function?'),
          [B('כי הוא איטי, והפונקציה עוצרת את כל שאר התוכנית', 'Because it is slow, and the function halts the rest of the program'), B('כי אסור להדפיס כשכפתור לחוץ', 'Because printing is forbidden while a button is pressed'), B('אין סיבה', 'No reason')], 0,
          B('פונקציה של פסיקה רק מסמנת שמשהו קרה, ואת ההדפסה עושה הלולאה הראשית.', 'An interrupt function only marks that something happened. The main loop does the printing.')),
        Q(B('לחיצה אחת נספרת ארבע פעמים. מה הסיבה?', 'One press is counted four times. What is the cause?'),
          [B('הכפתור מקולקל', 'The button is broken'), B('ריטוט מגעים: המתכת קופצת כמה פעמים', 'Contact bounce: the metal bounces several times'), B('ה-Pico מהיר מדי, וצריך להחליף אותו', 'The Pico is too fast and must be replaced')], 1,
          B('זה קורה בכל כפתור. הפתרון הוא להתעלם מפסיקות שמגיעות מיד אחרי הקודמת.', 'This happens with every button. Interrupts arriving right after the previous one are ignored.'))
      ]
    },

    /* ------------------------------------------------------------ 11 */
    {
      id: 'buses',
      title: B('I2C, SPI ו-UART: איך בוחרים ואיך מחברים כמה רכיבים', 'I2C, SPI and UART: choosing one and connecting several parts'),
      lead: B('שלוש שפות שבהן רכיבים מדברים: מה ההבדל ביניהן, ומה עושים כשרוצים לחבר שניים או שלושה רכיבים יחד.', 'Three languages that parts speak. How they differ, and what to do when you want two or three connected together.'),
      blocks: [
        { p: B('לד צריך פין אחד, והמידע שהוא מקבל הוא 0 או 1. מסך, לעומת זאת, צריך לקבל אלפי נקודות, וחיישן מחזיר מספרים מדויקים. בשביל זה יש [[protocol|פרוטוקולים]]: כללים מוסכמים להעברת [[byte|בתים]] על גבי חוטים בודדים. רוב המודולים מדברים באחד משלושה פרוטוקולים.', 'An LED needs one pin, and the information is 0 or 1. A display must receive thousands of dots, and a sensor returns precise numbers. For this there are [[protocol|protocols]]: agreed rules for passing [[byte|bytes]] down a few wires. Most modules speak one of three.') },
        { table: {
          head: [B('', ''), B('[[i2c|I2C]]', '[[i2c|I2C]]'), B('[[spi|SPI]]', '[[spi|SPI]]'), B('[[uart|UART]]', '[[uart|UART]]')],
          rows: [
            [B('חוטים', 'Wires'), B('2: SDA, SCL', '2: SDA, SCL'), B('3 משותפים, ועוד חוט אחד לכל רכיב', '3 shared, plus one per part'), B('2: TX, RX', '2: TX, RX')],
            [B('כמה רכיבים', 'How many parts'), B('הרבה רכיבים, על אותם שני חוטים', 'Many, on the same two wires'), B('כמה רכיבים, כל אחד עם קו בחירה משלו', 'Several, each with its own select line'), B('אחד מול אחד', 'One to one')],
            [B('איך פונים לרכיב', 'How a part is addressed'), B('לפי [[address|כתובת]]', 'By [[address|address]]'), B('מורידים את קו הבחירה שלו', 'Its select line is pulled low'), B('אין צורך, כי יש רק רכיב אחד', 'No need, there is only one')],
            [B('מהירות', 'Speed'), B('בינונית', 'Medium'), B('גבוהה', 'High'), B('נמוכה', 'Low')],
            [B('רכיבים אופייניים', 'Typical parts'), B('חיישנים, מסכים קטנים, שעון', 'Sensors, small displays, a clock'), B('כרטיס זיכרון, קורא RFID, מטריצת לדים', 'A memory card, an RFID reader, an LED matrix'), B('GPS, Bluetooth, Pico אחר', 'GPS, Bluetooth, another Pico')]
          ]
        } },
        { p: B('את הפרוטוקול לא אתם בוחרים, אלא הרכיב. בעמוד של כל רכיב בקטלוג כתוב באיזה ממשק הוא מדבר.', 'You do not choose the protocol. The part decides. Each part\'s page in the catalog says which interface it speaks.') },
        { h: B('I2C: כולם על אותם שני חוטים', 'I2C: everyone on the same two wires') },
        { p: B('ב-I2C כל הרכיבים מחוברים במקביל לאותם שני חוטים: כל ה-SDA יחד, וכל ה-SCL יחד. זה [[bus|אפיק]]. לכל רכיב יש [[address|כתובת]], מספר שנקבע במפעל. ה-Pico קורא לכתובת מסוימת, ורק הרכיב שהכתובת שייכת לו עונה.', 'On I2C all parts are connected in parallel to the same two wires: every SDA together, and every SCL together. That is a [[bus|bus]]. Each part has an [[address|address]], a number fixed at the factory. The Pico calls out an address, and only the part that owns it answers.') },
        { demo: 'i2c' },
        { code: ['from machine import Pin, I2C', '', 'i2c = I2C(0, sda=Pin(4), scl=Pin(5))', 'for address in i2c.scan():', '    print(hex(address))'],
          explain: [
            E([3], 'השורה הזו יוצרת את אפיק מספר 0, על הפינים GP4 ו-GP5.', 'Bus number 0, on pins GP4 and GP5.'),
            E([4], '`scan` פונה לכל הכתובות האפשריות, ומחזיר רשימה של הכתובות שענו.', '`scan` calls every possible address and returns a list of those that answered.'),
            E([5], '`hex` מציג מספר בכתיב [[hex|הקסדצימלי]], כמו שהכתובות כתובות בעמודי הרכיבים.', '`hex` shows a number in [[hex|hexadecimal]], the way addresses are written on the part pages.')
          ] },
        { p: B('זו הבדיקה הראשונה בכל פרויקט I2C. אם מסך OLED ושעון מחוברים לאותו אפיק, יודפסו `0x3c` ו-`0x68`. רשימה ריקה פירושה חיווט שגוי, ולא קוד שגוי.', 'This is the first check in every I2C project. An OLED display and a clock on the same bus will print `0x3c` and `0x68`. An empty list means wrong wiring, not wrong code.') },
        { ul: [
          B('שני רכיבים עם אותה כתובת לא יכולים לשבת על אותו אפיק. לדוגמה, לשעון DS3231 ולחיישן התנועה MPU6050 יש אותה כתובת, `0x68`.', 'Two parts with the same address cannot share a bus. For example, the DS3231 clock and the MPU6050 motion sensor are both `0x68`.'),
          B('פתרון ראשון: בהרבה מודולים יש פין או מגשר שמשנים את הכתובת.', 'First fix: many modules have a pin or a jumper that changes the address.'),
          B('פתרון שני: ל-Pico יש שני אפיקים, ואת הרכיב השני מחברים ל-`I2C(1, sda=Pin(6), scl=Pin(7))`.', 'Second fix: the Pico has two buses. The second part goes on `I2C(1, sda=Pin(6), scl=Pin(7))`.'),
          B('חוטים ארוכים מדי, מעל חצי מטר בערך, גורמים לשגיאות.', 'Wires that are too long, over about half a metre, cause errors.')
        ] },
        { h: B('SPI: מהיר, עם קו בחירה לכל רכיב', 'SPI: fast, with a select line per part') },
        { p: B('ב-SPI יש שלושה חוטים משותפים: שעון (SCK), נתונים מה-Pico לרכיב (MOSI, או TX), ונתונים מהרכיב ל-Pico (MISO, או RX). בנוסף, לכל רכיב יש קו בחירה משלו (CS). ה-Pico מוריד את קו הבחירה של הרכיב שאיתו הוא רוצה לדבר, וכל השאר מתעלמים.', 'SPI has three shared wires: a clock (SCK), data from the Pico to the part (MOSI, or TX), and data from the part to the Pico (MISO, or RX). On top of that each part has its own select line (CS). The Pico pulls low the select line of the part it wants to talk to, and the rest ignore everything.') },
        { demo: 'spi' },
        { ul: [
          B('שני רכיבי SPI חולקים את SCK, MOSI ו-MISO, וכל אחד מקבל פין CS אחר.', 'Two SPI parts share SCK, MOSI and MISO, and each gets a different CS pin.'),
          B('השמות מבלבלים: על חלק מהמודולים כתוב SDA או SS במקום CS, DIN או SDI במקום MOSI, ו-DO או SO במקום MISO.', 'The names are confusing. Some modules say SDA or SS instead of CS, DIN or SDI instead of MOSI, and DO or SO instead of MISO.'),
          B('רכיב שרק מקבל נתונים, כמו מטריצת לדים, לא צריך MISO. רכיב שרק שולח נתונים, כמו מד החום MAX6675, לא צריך MOSI.', 'A part that only receives, such as an LED matrix, needs no MISO. A part that only sends, such as the MAX6675 thermometer, needs no MOSI.')
        ] },
        { h: B('UART: שיחה בין שניים', 'UART: a conversation between two') },
        { p: B('ב-UART אין שעון ואין כתובות. יש שני צדדים ושני חוטים: מה שצד אחד משדר (TX) הצד השני קולט (RX), ולכן החוטים [[txrx|מוצלבים]]. שני הצדדים חייבים להסכים מראש על המהירות, שנקראת [[baud|baud]]. רוב המודולים עובדים ב-9600.', 'UART has no clock and no addresses. Two sides, two wires: what one transmits (TX) the other receives (RX), so the wires are [[txrx|crossed]]. Both sides must agree on the speed beforehand, the [[baud|baud]] rate. Most modules work at 9600.') },
        { demo: 'uart' },
        { tip: B('מודפס ג\'יבריש? המהירויות לא תואמות. לא מגיע כלום? TX ו-RX לא מוצלבים, או שאין [[commonground|אדמה משותפת]].', 'Gibberish printed? The speeds do not match. Nothing arriving? TX and RX are not crossed, or there is no [[commonground|common ground]].') },
        { h: B('כמה רכיבים בפרויקט אחד', 'Several parts in one project') },
        { ol: [
          B('רשמו לכל רכיב את הממשק שלו ואת הפינים שהעמוד שלו מציע.', 'Write down each part\'s interface and the pins its page suggests.'),
          B('רכיבי I2C: כולם על אותם שני פינים. בדקו שאין שני רכיבים עם אותה כתובת.', 'I2C parts: all on the same two pins. Check that no two addresses are the same.'),
          B('רכיבי SPI: שלושה פינים משותפים, ופין CS נפרד לכל רכיב.', 'SPI parts: three shared pins, and a separate CS pin for each.'),
          B('רכיב UART: זוג פינים משלו. ל-Pico יש שני UART, ולכן אפשר לחבר עד שני רכיבים כאלה.', 'A UART part: a pair of pins of its own. The Pico has two UARTs, so up to two such parts.'),
          B('בדקו שאף פין לא נבחר פעמיים. מתכנן הפרויקטים שבאתר עושה את זה בשבילכם.', 'Check that no pin was chosen twice. The project planner on this site does this for you.')
        ] }
      ],
      quiz: [
        Q(B('מסך OLED וחיישן AHT20 עובדים שניהם ב-I2C. כמה פינים של ה-Pico הם תופסים יחד, לא כולל הזנה ואדמה?', 'An OLED display and an AHT20 sensor are both I2C. How many Pico pins do they take together, besides power and ground?'),
          [B('ארבעה', 'Four'), B('שניים', 'Two'), B('אחד', 'One')], 1,
          B('שניהם יושבים על אותם SDA ו-SCL, והכתובות השונות מבדילות ביניהם.', 'Both sit on the same SDA and SCL. Their different addresses tell them apart.')),
        Q(B('`i2c.scan()` מחזיר רשימה ריקה. מה כדאי לבדוק קודם?', '`i2c.scan()` returns an empty list. What is checked first?'),
          [B('את הקוד', 'The code'), B('את החיווט: הזנה, אדמה, ושה-SDA וה-SCL לא התחלפו', 'The wiring: power, ground, and that SDA and SCL are not swapped'), B('להחליף את ה-Pico', 'Replace the Pico')], 1,
          B('רשימה ריקה אומרת שאף רכיב לא ענה, וזו כמעט תמיד בעיית חיווט.', 'An empty list says no part answered. It is almost always a wiring problem.'))
      ]
    },

    /* ------------------------------------------------------------ 12 */
    {
      id: 'power',
      title: B('כוח: מה פין יכול להפעיל ומה לא', 'Power: what a pin can and cannot drive'),
      lead: B('למה מנוע לא מתחבר ישירות לפין, מאיפה מביאים חשמל לרכיבים גדולים, ואיך נמנעים משריפת הלוח.', 'Why a motor does not connect straight to a pin, where power for big things comes from, and how not to burn the board.'),
      blocks: [
        { p: B('פין של ה-Pico הוא אות, ולא ספק כוח. הוא נותן 3.3V וזרם קטן. זה מספיק כדי לומר לרכיב אחר "עכשיו", אבל לא כדי להזיז משהו. כל מה שזז, מחמם או מאיר חזק צריך מקור חשמל משלו, ורכיב שעומד באמצע.', 'A Pico pin is a signal, not a power supply. It gives 3.3 V and a small current. That is enough to tell another part "now", and not enough to move anything. Whatever moves, heats or shines brightly needs a power source of its own, and a part standing in between.') },
        { h: B('שלושה מקורות חשמל על הלוח', 'Three power sources on the board') },
        { table: {
          head: [B('פין', 'Pin'), B('מתח', 'Voltage'), B('כמה זרם', 'How much current'), B('בשביל מה', 'What for')],
          rows: [
            [B('פין GP', 'A GP pin'), B('3.3V', '3.3 V'), B('כמה [[ma|mA]] בודדים. באתר הזה: לד אחד עם נגד.', 'A few [[ma|mA]]. On this site: one LED with a resistor.'), B('אותות בלבד', 'Signals only')],
            [B('`3V3(OUT)`, פין 36', '`3V3(OUT)`, pin 36'), B('3.3V', '3.3 V'), B('עד 300mA בערך, לכל הרכיבים יחד', 'Up to about 300 mA, for all parts together'), B('חיישנים ומסכים קטנים', 'Sensors and small displays')],
            [B('`VBUS`, פין 40', '`VBUS`, pin 40'), B('5V', '5 V'), B('מה שה-USB מספק, בדרך כלל עד 500mA', 'What USB gives, usually up to 500 mA'), B('סרבו קטן אחד, ממסר, פס לדים קצר', 'One small servo, a relay, a short LED strip')]
          ]
        } },
        { tip: B('המספרים האלה הם הנחיה זהירה, ולא הבטחה. מחשב נייד ישן או כבל USB דק מספקים פחות.', 'These numbers are cautious guidance, not a promise. An old laptop or a thin USB cable gives less.') },
        { h: B('כמה זרם צורך כל רכיב', 'How much each thing draws') },
        { table: {
          head: [B('רכיב', 'Part'), B('זרם אופייני', 'Typical current'), B('אפשר להפעיל מפין?', 'From a pin?')],
          rows: [
            [B('לד עם נגד 330Ω', 'An LED with a 330 Ω resistor'), B('כ-5mA', 'About 5 mA'), B('כן', 'Yes')],
            [B('באזר קטן', 'A small buzzer'), B('כ-10mA', 'About 10 mA'), B('כן, בקושי', 'Yes, just')],
            [B('מודול ממסר', 'A relay module'), B('כ-70mA', 'About 70 mA'), B('לא. ההזנה מגיעה מ-`VBUS`, והפין רק נותן אות.', 'No. Power from `VBUS`, and the pin only gives a signal.')],
            [B('סרבו SG90 בתנועה', 'An SG90 servo moving'), B('100 עד 500mA', '100 to 500 mA'), B('לא', 'No')],
            [B('מנוע DC קטן', 'A small DC motor'), B('200mA, ופי כמה מזה בהתנעה', '200 mA, and several times that when starting'), B('לא', 'No')],
            [B('פיקסל אחד של NeoPixel בלבן מלא', 'One NeoPixel at full white'), B('עד 60mA', 'Up to 60 mA'), B('לא', 'No')]
          ]
        } },
        { p: B('מה קורה כשמבקשים יותר מדי זרם? במקרה הטוב המתח צונח לרגע, וה-Pico מתאפס או מתנתק מהמחשב. זו [[brownout|נפילת מתח]]. במקרה הרע הפין נשרף, ולפעמים גם הלוח כולו.', 'What happens when too much is asked for? At best the voltage dips for a moment, and the Pico resets or disconnects from the computer. That is a [[brownout|brown-out]]. At worst the pin burns out, and sometimes the whole board.') },
        { h: B('מי עומד באמצע', 'Who stands in between') },
        { ul: [
          B('[[relay|ממסר]]: מתג מכני. הוא מדליק ומכבה, לאט, עם "קליק". המעגל שהוא מפעיל מופרד לגמרי מה-Pico.', 'A [[relay|relay]]: a mechanical switch. It turns things on and off, slowly, with a "click". The circuit it switches is fully separate from the Pico.'),
          B('[[mosfet|MOSFET]]: מתג אלקטרוני. הוא שקט ומהיר, ולכן מתאים גם לעמעום ב-[[pwm|PWM]]. מתאים לזרם ישר בלבד.', 'A [[mosfet|MOSFET]]: an electronic switch. Silent and fast, so it also suits dimming with [[pwm|PWM]]. Direct current only.'),
          B('[[motordriver|דרייבר מנוע]]: ארבעה מתגים בשבב אחד. הוא יודע גם להפוך את כיוון הסיבוב.', 'A [[motordriver|motor driver]]: four switches in one chip. It can also reverse direction.')
        ] },
        { h: B('אדמה משותפת', 'A common ground') },
        { p: B('כשיש ספק כוח נפרד, כמו סוללות או מטען, מחברים את המינוס שלו ל-`GND` של ה-Pico, אבל את הפלוס שלו לא מחברים ל-Pico. בלי [[commonground|אדמה משותפת]], לשני המעגלים אין נקודת אפס משותפת, והדרייבר לא מבין את האות. זו הסיבה הנפוצה ביותר לכך ש"הכול מחובר ושום דבר לא זז".', 'When there is a separate power supply, batteries or a charger, its minus is joined to the Pico\'s `GND`. Its plus is not connected to the Pico. Without a [[commonground|common ground]] the two circuits share no zero point, and the driver cannot make sense of the signal. This is the most common reason for "everything is connected and nothing moves".') },
        { h: B('5V מול 3.3V', '5 V versus 3.3 V') },
        { ul: [
          B('הזנה של רכיב ב-5V מ-`VBUS`: בסדר.', 'Powering a part at 5 V from `VBUS`: fine.'),
          B('שליחת אות של 3.3V לרכיב של 5V: כמעט תמיד עובדת.', 'Sending a 3.3 V signal to a 5 V part: almost always works.'),
          B('קבלת אות של 5V מרכיב אל פין של ה-Pico: לא. מורידים את האות ל-3.3V בעזרת [[divider|מחלק מתח]] של שני נגדים, כמו בחיישן המרחק.', 'Receiving a 5 V signal from a part into a Pico pin: no. It is brought down to 3.3 V with a [[divider|voltage divider]] of two resistors, as with the distance sensor.')
        ] },
        { h: B('פרויקט בלי מחשב', 'A project with no computer') },
        { p: B('כדי שהפרויקט יעבוד בלי מחשב, שומרים את התוכנית בשם `main.py` (שיעור D2), ומזינים את הלוח באחת משתי דרכים: מטען USB או סוללת גיבוי של טלפון דרך שקע ה-USB, או סוללות דרך הפין `VSYS` (פין 39), במתח של 1.8V עד 5.5V. שלוש סוללות AA מתאימות לכך.', 'For a project to run with no computer, the program is saved as `main.py` (lesson D2), and the board is powered in one of two ways: a USB charger or a phone power bank through the USB socket, or batteries through the `VSYS` pin (pin 39), at between 1.8 V and 5.5 V. Three AA batteries suit.') },
        { tip: B('אל תחברו סוללות ל-`VSYS` וכבל USB למחשב באותו זמן, אלא אם הוספתם רכיב הגנה. ולעולם אל תחברו סוללות ל-`3V3`.', 'Do not connect batteries to `VSYS` and a USB cable to a computer at the same time, unless you have added a protection part. And never connect batteries to `3V3`.') },
        { h: B('שלושה כללי בטיחות', 'Three safety rules') },
        { ul: [
          B('רק מתח נמוך: עד 12V, ורק זרם ישר. חשמל מהשקע שבקיר הוא עבודה לחשמלאי.', 'Low voltage only: up to 12 V, and direct current only. Mains electricity is a job for an electrician.'),
          B('חווטו כשהכול מנותק, ובדקו מול הטבלה. רק אחר כך חברו חשמל.', 'Wire with everything disconnected. Check against the table. Only then connect power.'),
          B('משהו מתחמם או מריח? נתקו מיד, ורק אחר כך חפשו את הסיבה.', 'Something is getting hot or smells? Disconnect at once, and only then look for the reason.')
        ] }
      ],
      quiz: [
        Q(B('מנוע מחובר לדרייבר עם סוללות נפרדות, אבל לא זז. הקוד נכון. מה הדבר הראשון שצריך לבדוק?', 'A motor is connected to a driver with separate batteries, and does not move. The code is right. What is checked first?'),
          [B('שהמינוס של הסוללות מחובר ל-GND של ה-Pico', 'That the batteries\' minus is joined to the Pico\'s GND'), B('שהפלוס של הסוללות מחובר ל-3V3', 'That the batteries\' plus is joined to 3V3'), B('שכבל ה-USB ארוך מספיק', 'That the USB cable is long enough')], 0,
          B('בלי אדמה משותפת, הדרייבר לא מבין את האות. את הפלוס של הסוללות לעולם לא מחברים ל-Pico.', 'Without a common ground the driver cannot read the signal. The batteries\' plus is never connected to the Pico.')),
        Q(B('ה-Pico מתנתק מהמחשב בכל פעם שהסרבו מתחיל לזוז. למה?', 'The Pico disconnects from the computer every time the servo starts to move. Why?'),
          [B('הקוד שגוי', 'The code is wrong'), B('הסרבו צורך לרגע יותר זרם ממה שה-USB נותן, והמתח צונח', 'The servo briefly draws more than USB gives, and the voltage dips'), B('הסרבו מחובר לפין הלא נכון', 'The servo is on the wrong pin')], 1,
          B('זו נפילת מתח. הפתרון הוא הזנה נפרדת לסרבו, עם אדמה משותפת.', 'That is a brown-out. The fix: a separate supply for the servo, with a common ground.'))
      ]
    },

    /* ------------------------------------------------------------ 13 */
    {
      id: 'debug',
      title: B('כשזה לא עובד: איך מוצאים תקלה', 'When it does not work: finding a fault'),
      lead: B('זה יקרה בכל פרויקט. מי שיש לו שיטה מוצא את הבעיה תוך חמש דקות, ומי שאין לו מחליף חוטים במשך שעה.', 'It will happen in every project. Someone with a method finds the problem in five minutes, and someone without one swaps wires for an hour.'),
      blocks: [
        { p: B('תקלה היא לא סימן שעשיתם משהו לא בסדר. היא חלק רגיל מהעבודה, גם אצל מהנדסים מנוסים. ההבדל הוא שהם לא מנחשים: הם שואלים שאלה אחת בכל פעם, ובודקים את התשובה.', 'A fault is not a sign that you did something wrong. It is an ordinary part of the work, for experienced engineers too. The difference is that they do not guess. They ask one question at a time, and check the answer.') },
        { h: B('השאלה הראשונה: חומרה או תוכנה?', 'The first question: hardware or software?') },
        { ol: [
          B('יש הודעת שגיאה אדומה ב-Thonny? זו בעיית תוכנה. קראו את ההודעה, כי היא אומרת איפה הבעיה.', 'Is there a red error message in Thonny? It is software. Read the message, it says where.'),
          B('אין שגיאה, והתוכנית רצה, אבל שום דבר לא קורה? כנראה זו בעיית חומרה: חיווט או הזנה.', 'No error, the program runs, but nothing happens? Probably hardware: wiring or power.'),
          B('משהו קורה, אבל לא מה שרציתם? כנראה יש בתוכנית היגיון שגוי.', 'Something happens, but not what you wanted? Probably faulty logic in the program.')
        ] },
        { h: B('איך קוראים הודעת שגיאה', 'How to read an error message') },
        { code: ['Traceback (most recent call last):', '  File "<stdin>", line 12, in <module>', '  File "<stdin>", line 7, in measure', 'OSError: [Errno 5] EIO'],
          explain: [
            E([2], 'השורה הזו אומרת איפה התוכנית הייתה: בשורה 12, בחלק הראשי.', 'Where the program was: line 12, in the main part.'),
            E([3], 'שורה 12 קראה לפונקציה `measure`, והשגיאה קרתה בשורה 7 שבתוכה. השורה האחרונה ברשימה היא המקום המדויק.', 'Line 12 called the function `measure`, and the error happened on line 7 inside it. The last line in the list is the exact place.'),
            E([4], 'זה סוג השגיאה, עם הסבר קצר. זו השורה החשובה ביותר.', 'The kind of error, and a short explanation. This is the most important line.')
          ] },
        { table: {
          head: [B('השגיאה', 'The error'), B('מה היא אומרת', 'What it says'), B('מה בודקים', 'What to check')],
          rows: [
            [B('`SyntaxError`', '`SyntaxError`'), B('השורה לא כתובה נכון.', 'The line is not written correctly.'), B('חסרות נקודתיים בסוף שורת `if`, `for` או `def`, או שיש סוגריים שלא נסגרו, לפעמים בשורה שלפני.', 'A missing colon after `if`, `for` or `def`. Brackets left open, sometimes on the line before.')],
            [B('`IndentationError`', '`IndentationError`'), B('ה[[indent|הזחה]] לא עקבית.', 'The [[indent|indentation]] is inconsistent.'), B('ארבעה רווחים לכל רמה, בלי לערבב רווחים וטאבים.', 'Four spaces per level. Do not mix spaces and tabs.')],
            [B('`NameError`', '`NameError`'), B('שם שהתוכנית לא מכירה.', 'A name that is not known.'), B('שגיאת כתיב בשם משתנה, או שורת `import` חסרה.', 'A typo in a variable name, or a missing `import` line.')],
            [B('`ImportError`', '`ImportError`'), B('ה[[library|ספרייה]] לא נמצאה.', 'The [[library|library]] was not found.'), B('הספרייה לא הותקנה, או שהקובץ נשמר במחשב ולא על הלוח.', 'The library was not installed, or the file was saved on the computer and not on the board.')],
            [B('`OSError: [Errno 5] EIO`', '`OSError: [Errno 5] EIO`'), B('רכיב I2C לא עונה.', 'An I2C part does not answer.'), B('בדקו חיווט, הזנה וכתובת, והריצו `i2c.scan()`.', 'Wiring, power, address. Run `i2c.scan()`.')],
            [B('`OSError: [Errno 110] ETIMEDOUT`', '`OSError: [Errno 110] ETIMEDOUT`'), B('הרכיב לא ענה בזמן.', 'The part did not answer in time.'), B('חוט רופף, או שהרכיב לא מקבל חשמל.', 'A loose wire, or the part is getting no power.')],
            [B('`TypeError`', '`TypeError`'), B('פעולה על סוג ערך לא מתאים.', 'An operation on the wrong kind of value.'), B('חיבור של טקסט למספר, או השוואה של `None` למספר.', 'Adding text to a number, or comparing `None` with a number.')],
            [B('`IndexError`', '`IndexError`'), B('מקום שלא קיים ב[[list|רשימה]].', 'A position that does not exist in a [[list|list]].'), B('הספירה מתחילה מ-0, ולכן ברשימה של 4 ערכים, האחרון נמצא במקום 3.', 'Counting starts at 0. In a list of 4, the last is position 3.')],
            [B('`MemoryError`', '`MemoryError`'), B('נגמר הזיכרון.', 'Memory has run out.'), B('רשימה שגדלה בלי סוף בתוך לולאה.', 'A list that grows without end inside a loop.')]
          ]
        } },
        { h: B('print הוא מכשיר המדידה הראשון', 'print is the first instrument') },
        { p: B('כשאין שגיאה אבל התוצאה לא נכונה, התוכנית עושה בדיוק מה שכתבתם, ולא מה שהתכוונתם. כדי לראות את ההבדל, הדפיסו את הערך של כל חיישן ואת הנקודות שהתוכנית עוברת בהן.', 'When there is no error but the result is wrong, the program is doing exactly what you wrote, not what you meant. To see the difference you print: the value of every sensor, and the points the program passes through.') },
        { code: ['while True:', '    light = ldr.read_u16()', '    print("light:", light)', '    if light < 20000:', '        print("-> dark, switching on")', '        led.on()'],
          explain: [
            E([3], 'השורה הזו מדפיסה את הערך הגולמי. לעיתים קרובות מגלים שהוא רחוק מאוד מהטווח שחשבתם.', 'Prints the raw value. Often you discover it is nowhere near the range you assumed.'),
            E([5], 'השורה הזו מודפסת כשהתוכנית נכנסת לענף. אם היא אף פעם לא מודפסת, הבעיה היא בתנאי ולא בלד.', 'Prints on entering the branch. If this line is never printed, the condition is the problem and not the LED.')
          ] },
        { tip: B('ב-Thonny אפשר לבדוק רכיב בלי לכתוב תוכנית. עצרו את התוכנית, והקלידו שורה אחת ב[[repl|חלון ה-Shell]], למשל `from machine import Pin` ואחריה `Pin(15, Pin.OUT).on()`. הלד נדלק? אז החיווט תקין, והבעיה בתוכנית.', 'In Thonny a part can be tested with no program. Stop the program, and type a single line in the [[repl|Shell window]], for example `from machine import Pin` followed by `Pin(15, Pin.OUT).on()`. The LED lights? The wiring is sound, and the problem is in the program.') },
        { h: B('רשימת בדיקות לחומרה', 'A hardware checklist') },
        { ol: [
          B('הזנה: האם הרכיב מחובר ל-`3V3` או ל-`VBUS`, לפי מה שכתוב בעמוד שלו? האם יש עליו נורית, והיא דולקת?', 'Power: is the part connected to `3V3` or `VBUS`, as its page says? Does it have a light, and is it on?'),
          B('אדמה: האם יש חוט מה-GND של הרכיב ל-GND של ה-Pico?', 'Ground: is there a wire from the part\'s GND to the Pico\'s GND?'),
          B('ספרו את הפינים מחדש: טעות של טור אחד במטריצה היא התקלה הנפוצה ביותר.', 'Count the pins again. Being one column out on the breadboard is the most common fault of all.'),
          B('המספר בקוד הוא מספר ה-GP, ולא מספר הפין הפיזי. `Pin(15)` הוא `GP15`, שנמצא בפין 20.', 'The number in the code is the GP number, not the physical pin number. `Pin(15)` is `GP15`, which sits at pin 20.'),
          B('חוט גישור יכול להיות שבור מבפנים, ולכן החליפו אותו בחוט אחר.', 'A jumper wire can be broken inside. Swap it for another.'),
          B('האם הרכיב נעוץ עד הסוף? רגל שלא נוגעת במגע של המטריצה היא חיבור שלא קיים.', 'Is the part pushed all the way in? A leg not touching the breadboard\'s contact is a connection that does not exist.'),
          B('כיוון: לד, באזר ורוב המודולים עובדים רק כשהם מחוברים בכיוון הנכון.', 'Direction: an LED, a buzzer and most modules work one way round only.')
        ] },
        { h: B('חצי-חצי', 'Half and half') },
        { p: B('פרויקט של חמישה רכיבים לא עובד? אל תבדקו את הכול יחד. נתקו הכול חוץ מרכיב אחד, והריצו את הדוגמה מהעמוד שלו בקטלוג. עובד? הוסיפו את הרכיב השני. הרכיב שאחרי הוספתו הכול נשבר מראה לכם את הכיוון: הבעיה היא או ברכיב עצמו, או בהתנגשות שלו עם רכיב אחר על פין, על כתובת או על זרם.', 'A project of five parts that does not work? Do not test it all together. Disconnect everything but one part, and run the example from its catalog page. Works? Add the second. The part whose addition breaks everything is the lead: either the part itself, or a clash with another over a pin, an address, or current.') },
        { tip: B('בנו כך כבר מההתחלה: רכיב אחד, בדיקה, ורק אז הרכיב הבא. זה נראה איטי, אבל זה חוסך את רוב התקלות.', 'Build this way from the start: one part, a test, and only then the next. It looks slow, and it saves most of the faults.') },
        { h: B('תקלות שחוזרות על עצמן', 'Faults that keep coming back') },
        { table: {
          head: [B('מה רואים', 'What you see'), B('הסיבה הנפוצה', 'The usual cause')],
          rows: [
            [B('הלוח מתנתק כשהמנוע מתחיל לפעול', 'The board disconnects when a motor starts'), B('[[brownout|נפילת מתח]]. המנוע צריך הזנה נפרדת.', 'A [[brownout|brown-out]]. The motor needs a separate supply.')],
            [B('חיישן נותן מספרים שקופצים', 'A sensor gives jumping numbers'), B('כניסה שלא מחוברת לשום דבר, או אדמה רופפת.', 'An input connected to nothing, or a loose ground.')],
            [B('כפתור "נלחץ" מעצמו', 'A button "presses" itself'), B('חסר [[pullup|נגד משיכה]]: `Pin.PULL_UP`.', 'A missing [[pullup|pull-up]]: `Pin.PULL_UP`.')],
            [B('עובד מהמחשב, אבל לא מסוללה', 'Works from the computer, not from a battery'), B('התוכנית לא נשמרה בשם `main.py`, או שהיא מחכה למחשב.', 'The program was not saved as `main.py`, or it is waiting for the computer.')],
            [B('עבד אתמול, אבל היום לא', 'Worked yesterday, not today'), B('חוט זז ממקומו. עברו שוב על הטבלה.', 'A wire that moved. Go over the table again.')],
            [B('Thonny לא מוצא את הלוח', 'Thonny cannot find the board'), B('כבל USB שמעביר רק טעינה, ולא נתונים.', 'A USB cable that carries charge only, with no data.')]
          ]
        } }
      ],
      quiz: [
        Q(B('התוכנית רצה בלי שגיאה, אבל הלד לא נדלק כשחשוך. מה הצעד הראשון?', 'The program runs with no error, but the LED does not light when it is dark. What is the first step?'),
          [B('להחליף את הלד', 'Replace the LED'), B('להדפיס את הערך של החיישן, ולראות מה הוא באמת', 'Print the sensor value and see what it really is'), B('לכתוב את התוכנית מחדש', 'Rewrite the program')], 1,
          B('קודם אוספים מידע. לעיתים קרובות הערך פשוט אף פעם לא עובר את הסף שקבעתם.', 'First gather information. Often the value simply never crosses the threshold you set.')),
        Q(B('מודפס `OSError: [Errno 5] EIO` בשורה שקוראת מחיישן I2C. מה זה אומר?', '`OSError: [Errno 5] EIO` is printed on a line that reads an I2C sensor. What does it mean?'),
          [B('שגיאת כתיב בקוד', 'A typo in the code'), B('החיישן לא עונה: חיווט, הזנה או כתובת', 'The sensor does not answer: wiring, power or address'), B('הזיכרון מלא', 'Memory is full')], 1,
          B('מבחינת פייתון הקוד תקין. הרכיב שבצד השני של החוט פשוט שותק.', 'The code is fine as far as Python goes. The part at the other end of the wire is silent.'))
      ]
    }
  );
})(window.PICO);
