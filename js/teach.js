/* The lecturer's side.
   - P.viewLabSheet(app, lesson): a printable A4 lab sheet for one lesson (#/lessons/<id>/sheet),
     built from the lesson data, with blank lines for answers and checkpoints to sign. No solutions.
   - P.viewTeach(app): the lecturer page (#/teach): how to use the site in a course, a suggested semester,
     the lessons at a glance, answers and solutions, a rubric and a check-off sheet. Each part prints on its own. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc, R = function (v) { return P.rich(T(v)); };
  var B = function (he, en) { return { he: he, en: en }; };

  var L = {
    print: B('הדפיסו', 'Print'), printPart: B('הדפיסו את החלק הזה', 'Print this part'), back: B('חזרה לשיעור', 'Back to the lesson'),
    name: B('שם', 'Name'), date: B('תאריך', 'Date'), station: B('עמדה', 'Station'), partner: B('שותף/ה', 'Partner'),
    lab: B('מעבדה', 'Lab'), parts: B('מה צריך', 'What you need'), wiring: B('חיווט', 'Wiring'), part: B('חלק', 'Part'), codePin: B('בקוד', 'In code'), phys: B('פין פיזי', 'Physical pin'), note: B('הערה', 'Note'),
    steps: B('שלבים', 'Steps'), code: B('הקוד', 'The code'), expect: B('מה אמור לקרות', 'What should happen'), tasks: B('משימות', 'Tasks'),
    checks: B('נקודות ביקורת', 'Checkpoints'), sign: B('חתימת מרצה', 'Lecturer\'s signature'), time: B('שעה', 'Time'),
    est: B('זמן משוער', 'Estimated time'), minutes: B('דקות', 'minutes'), plusTasks: B('ועוד', 'plus'), forTasks: B('למשימות', 'for the tasks'),
    defaultCp: [B('החיווט תואם לטבלה.', 'The wiring matches the table.'), B('התוכנית רצה, והתוצאה הצפויה הודגמה.', 'The program runs and the expected result was shown.'), B('משימה אחת לפחות נפתרה.', 'At least one task was solved.')],
    sheetBtn: B('דף מעבדה להדפסה', 'Printable lab sheet'),

    h: B('למרצה', 'For lecturers'),
    lead: B('כל מה שצריך כדי להשתמש באתר בקורס: איפה הוא משתלב, סדר מומלץ לסמסטר, דף מעבדה לכל שיעור, תשובות ופתרונות, מחוון ודף אישור. הזמנים והסדר הם הצעה בלבד, ועדיין לא נוסו בכיתה אמיתית.', 'Everything needed to use the site in a course: where it fits, a suggested semester order, a lab sheet for every lesson, answers and solutions, a rubric and a check-off sheet. The times and the order are a suggestion, not yet tried in a real class.'),
    toc: B('בעמוד הזה', 'On this page'),
    useH: B('איך האתר משתלב בקורס', 'How the site fits a course'),
    use: [
      B('מבוא לפני קורס Embedded C: האתר מלמד את הרעיונות (פינים, ADC, PWM, I2C, פסיקות) ב-MicroPython, שבה כל ניסוי לוקח דקות ספורות. אחר כך עוברים ל-C כשכבר מבינים את החומרה.', 'An introduction before an Embedded C course: the site teaches the ideas (pins, ADC, PWM, I2C, interrupts) in MicroPython, where each experiment takes minutes. Then the move to C happens with an understanding of the hardware.'),
      B('הכנה למעבדה: הסטודנטים קוראים את השיעור ועונים על שאלות הבדיקה בבית, ובמעבדה הם בונים, מריצים ומקבלים חתימה על נקודות הביקורת.', 'Lab preparation: students read the lesson and answer its check questions at home, and in the lab they build, run and get checkpoints signed.'),
      B('תרגול עצמי: כל שיעור עומד בפני עצמו, עם חיווט, קוד מוסבר, תוצאה צפויה ומשימות. זה מתאים לסטודנטים שהחסירו שיעור.', 'Self-study: each lesson stands on its own, with wiring, explained code, an expected result and tasks. Suits a student who missed a session.'),
      B('בוחן מעשי: המעבדות "מצאו את הבאג" (מסלול T) יכולות לשמש תבנית למבחן: מעגל מוכר, תקלה שתולה בו, והסבר בעל-פה.', 'A practical exam: the "Find the bug" labs (track T) are a template for a test: a familiar circuit, a planted fault, and an explanation aloud.')
    ],
    useNote: B('לפני שאתם מלמדים, עברו על המסלול הבסיסי עם לוח אמיתי בדף הבדיקה. אף קוד באתר עדיין לא הורץ על Pico 2.', 'Before teaching: go through the core path with a real board on the test page. No code on the site has yet been run on a Pico 2.'),
    verifyBtn: B('פתחו את דף הבדיקה על לוח', 'To the board test page'), debugBtn: B('דף העזר לתקלות', 'The fault-finding cheat sheet'),
    planH: B('סמסטר מומלץ: 13 שבועות, מעבדה אחת של 3 שעות', 'A suggested semester: 13 weeks, one 3-hour lab'),
    week: B('שבוע', 'Week'), read: B('קריאה מקדימה', 'Read before'), doLab: B('במעבדה', 'In the lab'), notes: B('הערות', 'Notes'),
    startPage: B('מתחילים', 'Get started'),
    overH: B('השיעורים במבט אחד', 'The lessons at a glance'), track: B('מסלול', 'Track'), lesson: B('שיעור', 'Lesson'), sheet: B('דף מעבדה', 'Lab sheet'), answers: B('תשובות', 'Answers'),
    noTime: B('—', '—'),
    ansH: B('תשובות ופתרונות', 'Answers and solutions'),
    ansLead: B('לכל שיעור: התשובות לשאלות הבדיקה, הרמזים והפתרונות למשימות, ומה בדרך כלל משתבש. החלק הזה אינו מופיע בדפי המעבדה.', 'For each lesson: the answers to its check questions, the hints and solutions to its tasks, and what usually goes wrong. This part does not appear on the lab sheets.'),
    pit: B('מה בדרך כלל משתבש', 'What usually goes wrong'), quiz: B('שאלות בדיקה', 'Check questions'), right: B('תשובה נכונה', 'Correct answer'),
    task: B('משימה', 'Task'), hint: B('רמז', 'Hint'), noSol: B('אין פתרון כתוב, כי זו משימה פתוחה.', 'No written solution: an open task.'),
    basicsAns: B('השאלות בפרקי היסודות', 'Questions in the basics chapters'), chapter: B('פרק', 'Chapter'),
    rubricH: B('מחוון למעבדה', 'A lab rubric'),
    rubricLead: B('מחוון כללי שמתאים לכל מעבדה, בן 20 נקודות. התאימו את המשקלים לקורס שלכם.', 'A general rubric for any lab, 20 points. Adjust the weights to the course.'),
    crit: B('קריטריון', 'Criterion'), lv: [B('מצוין', 'Excellent'), B('טוב', 'Good'), B('בסיסי', 'Basic'), B('לא עומד', 'Not met')],
    rubric: [
      [B('חיווט (4)', 'Wiring (4)'), B('תואם לטבלה, מסודר, ונבדק לפני חיבור החשמל', 'Matches the table, tidy, checked before power'), B('תואם, אחרי תיקון קטן', 'Matches, with a small fix'), B('עובד אחרי עזרה', 'Works after help'), B('לא עובד, או שחובר כשהלוח פועל', 'Does not work, or wired while powered')],
      [B('תוכנית עובדת (4)', 'Working program (4)'), B('בדיוק התוצאה הצפויה', 'Exactly the expected result'), B('כמעט, עם סטייה קטנה', 'Nearly, a small difference'), B('חלקית', 'Partly'), B('אינה רצה', 'Does not run')],
      [B('הבנה (4)', 'Understanding (4)'), B('הסבר של כל שורה, ושל מה שישתנה אם משנים אותה', 'Explains every line and what changes if it is changed'), B('הסבר של רוב השורות', 'Explains most lines'), B('הסבר רק בעזרת המרצה', 'Explains only with help'), B('אין הסבר', 'Cannot explain')],
      [B('מציאת תקלות (4)', 'Fault finding (4)'), B('התקלה נמצאה בלי עזרה, בשיטה מסודרת, ותועדה', 'Finds it alone, by the method, and records it'), B('התקלה נמצאה אחרי רמז אחד', 'Finds it with one hint'), B('התקלה נמצאה בעזרה צמודה', 'Finds it with close help'), B('התקלה לא נמצאה', 'Does not find it')],
      [B('משימות הרחבה (2)', 'Extension tasks (2)'), B('שתיים או יותר', 'Two or more'), B('אחת', 'One'), B('ניסיון חלקי', 'A partial attempt'), B('אין', 'None')],
      [B('בטיחות וסדר (2)', 'Safety and order (2)'), B('הלוח מנותק לפני כל שינוי, והעמדה מסודרת', 'Unplugs before changes, a tidy bench'), B('הערה אחת', 'One remark'), B('כמה הערות', 'Several remarks'), B('סיכון ללוח', 'Puts the board at risk')]
    ],
    checkH: B('דף אישור (check-off) לכיתה', 'A class check-off sheet'),
    checkLead: B('בחרו מסלול ומספר סטודנטים, והדפיסו. המרצה חותם בכל משבצת אחרי שהשיעור הודגם.', 'Choose a track and the number of students, and print. In each box the lecturer signs when the lesson was shown.'),
    students: B('סטודנטים', 'Students'), student: B('שם הסטודנט/ית', 'Student name'),
    expH: B('ייצוא שאלות ל-Moodle', 'Exporting the questions to Moodle'),
    expLead: B('כל שאלות הבדיקה שבאתר, בקובץ שאפשר לייבא למאגר השאלות של Moodle (ניהול הקורס, מאגר שאלות, ייבוא). כל שאלה היא שאלה אמריקאית עם תשובה נכונה אחת, והסבר שמוצג אחרי שעונים. השאלות מסודרות בקטגוריות לפי מסלול או לפי סוג העמוד.', 'Every check question on the site, as a file to import into Moodle\'s question bank (course administration, question bank, import). Each is a multiple-choice question with one right answer, and an explanation shown after answering. The questions are sorted into categories by track or by kind of page.'),
    expWhich: B('אילו שאלות', 'Which questions'), expAll: B('הכול', 'Everything'), expLessons: B('כל השיעורים', 'All lessons'), expBasics: B('פרקי היסודות', 'Basics chapters'), expIfaces: B('עמודי הממשקים', 'Interface pages'),
    expLang: B('שפה', 'Language'), expFmt: B('פורמט', 'Format'), expCount: B('שאלות', 'questions'), expDl: B('הורידו את הקובץ', 'Download the file'),
    expNote: B('Moodle XML שומר על העברית ועל כיוון הטקסט, ולכן הוא מומלץ. GIFT הוא קובץ טקסט פשוט שקל לערוך. הייבוא עצמו לא נבדק ב-Moodle של מכללה, ולכן נסו אותו קודם בקורס ניסיון.', 'Moodle XML keeps the Hebrew and the text direction, and is recommended. GIFT is a plain text file that is easy to edit. The import itself has not been tested in a college Moodle: try it in a test course first.'),
    synH: B('מיפוי לנושאי קורס מיקרו-בקרים', 'Mapping to the topics of a microcontrollers course'),
    synLead: B('הנושאים הנפוצים בקורס מיקרו-בקרים, ואיפה כל אחד מהם מופיע באתר. הרשימה נבנתה מנושאים כלליים ולא הועתקה מסילבוס רשמי, ולכן השוו אותה לסילבוס של הקורס שלכם, למשל "מיקרו בקרים" של משרד החינוך (גרסה 2.01, 2026).', 'The usual topics of a microcontrollers course, and where each appears on the site. The list was built from general topics, not copied from an official syllabus: compare it with your course\'s syllabus, for example the Ministry of Education\'s "Microcontrollers" (version 2.01, 2026).'),
    synPdf: B('הסילבוס באתר משרד החינוך (PDF)', 'The syllabus on the Ministry of Education site (PDF)'),
    topic: B('נושא', 'Topic'), onSite: B('באתר', 'On the site'), gap: B('מה לא מכוסה', 'Not covered'),
    synNote: B('האתר מלמד ב-MicroPython. נושאים שייחודיים ל-C (רגיסטרים, מצביעים, קומפילציה, Assembly) אינם מכוסים, והם נשארים לקורס Embedded C.', 'The site teaches in MicroPython. Topics that belong to C (registers, pointers, compiling, assembly) are not covered, and stay with the Embedded C course.')
  };
  var SYL = [
    [B('מבנה מיקרו-בקר: מעבד, זיכרון, פינים, שעון', 'Microcontroller structure: CPU, memory, pins, clock'), ['b:microcontroller', 'b:pico2', 'p'], B('מפת זיכרון ורגיסטרים', 'Memory map and registers')],
    [B('חשמל בסיסי: מתח, זרם, נגד, חוק אוהם', 'Basic electricity: voltage, current, resistance, Ohm\'s law'), ['b:electricity', 'b:parts', 'b:semis'], null],
    [B('ייצוג מספרים: בינארי והקסדצימלי', 'Number representation: binary and hexadecimal'), ['b:bits'], null],
    [B('קלט ופלט דיגיטלי', 'Digital input and output'), ['i:gpio', 'l:A1', 'l:A2', 'l:A3', 'l:S4'], null],
    [B('נגדי משיכה, כפתורים וריטוט', 'Pull resistors, buttons and bounce'), ['l:A3', 'l:A4', 'l:T2', 'l:T3'], null],
    [B('המרה אנלוגית-דיגיטלית (ADC)', 'Analog-to-digital conversion (ADC)'), ['i:adc', 'b:digital-analog', 'l:B1', 'l:B3', 'l:T4', 'l:S3', 'l:E5'], null],
    [B('אפנון רוחב פולס (PWM): עמעום, צליל, סרוו', 'Pulse width modulation (PWM): dimming, sound, servo'), ['i:pwm', 'l:B2', 'l:B4', 'l:B5', 'l:T5'], null],
    [B('פסיקות וטיימרים', 'Interrupts and timers'), ['b:interrupts', 'l:A4', 'l:R1', 'l:R2', 'l:R3', 'l:S2'], B('הגדרת טיימר ברמת רגיסטר', 'Setting up a timer at register level')],
    [B('תקשורת טורית UART', 'UART serial communication'), ['i:uart', 'l:D3', 'l:S6'], null],
    [B('I2C: כתובות, סריקה, חיישנים ומסכים', 'I2C: addresses, scanning, sensors and displays'), ['i:i2c', 'b:buses', 'b:datasheet', 'l:C3', 'l:C4', 'l:T6', 'l:F6', 'l:H8'], null],
    [B('SPI', 'SPI'), ['i:spi', 'c:max7219', 'c:sdcard', 'l:G5'], null],
    [B('חיישנים ומפעילים: מרחק, תנועה, טמפרטורה, ממסר, מנוע', 'Sensors and actuators: distance, motion, temperature, relay, motor'), ['l:C1', 'l:C2', 'l:C4', 'l:S5', 'l:E5', 'l:F5', 'c:relay', 'c:motor'], null],
    [B('הזנה ותכנון חשמלי', 'Power and electrical design'), ['b:power', 'i:power', 'l:D2', 'b:cores'], null],
    [B('תכנון מערכת ופרויקט', 'System and project design'), ['l:D1', 'l:D2', 'b:states', 'b:module', 'b:longrun', 'l:S1', 'pl'], null],
    [B('ניפוי תקלות', 'Debugging'), ['b:debug', 'dbg', 'l:T1'], null],
    [B('PIO ותכנות מקבילי', 'PIO and parallel programming'), ['i:pio', 'b:cores', 'l:R3'], B('PIO: יש רק עמוד היכרות קצר', 'PIO: only a short introduction page')],
    [B('תקשורת אלחוטית ו-IoT', 'Wireless communication and IoT'), ['l:W1', 'l:W2', 'l:W3'], B('דורש לוח Pico 2 W', 'Needs a Pico 2 W board')]
  ];
  /* ---------- the course kit: what one station needs, and the class total ---------- */
  var LK = {
    h: B('רשימת ציוד לקורס', 'Equipment list for the course'),
    lead: B('הרשימה נאספת מהחלקים של כל השיעורים שתבחרו. לכל עמדה נספרת הכמות הגדולה ביותר ששיעור אחד צריך, כי השיעורים נעשים בזה אחר זה, והחלקים חוזרים לקופסה. לכך מתווספים הלוח, המטריצה, הכבל והחוטים שכל עמדה צריכה תמיד.', 'The list is gathered from the parts of every lesson you choose. For each station it counts the largest quantity a single lesson needs, because lessons happen one after another and the parts go back in the box. Added to that are the board, breadboard, cable and wires every station always needs.'),
    tracks: B('מסלולים', 'Tracks'), stations: B('עמדות', 'Stations'), spare: B('תוספת חלקי חילוף (%)', 'Spares (%)'),
    item: B('פריט', 'Item'), perSt: B('לעמדה', 'Per station'), forClass: B('לכיתה', 'For the class'),
    lessonsUse: B('בשיעורים', 'In lessons'), csv: B('הורידו כ-CSV', 'Download as CSV'),
    packNote: B('נגדים וחוטים נספרים כערכה אחת לעמדה.', 'Resistors and wires are counted as one kit per station.'),
    base: B('בכל עמדה', 'At every station'), d3: B('את שיעור D3 עושים בזוגות, עם שני לוחות.', 'Lesson D3 is done in pairs with two boards.')
  };
  /* the items every station has, whatever the lessons */
  var KIT_BASE = [
    { id: 'pico2', name: B('Raspberry Pi Pico 2 עם פינים מולחמים (Pico 2 H)', 'Raspberry Pi Pico 2 with soldered headers (Pico 2 H)'), qty: 1 },
    { id: 'usb', name: B('כבל micro-USB שמעביר נתונים', 'A micro-USB data cable'), qty: 1 },
    { id: 'breadboard', name: B('מטריצה (breadboard) של 830 נקודות', 'A breadboard, 830 points'), qty: 1 },
    { id: 'jumpers', name: B('ערכת חוטי גישור זכר-זכר', 'A set of male-male jumper wires'), qty: 1, pack: true },
    { id: 'resistors', name: B('ערכת נגדים (330Ω, 1k, 2k, 4.7k, 10k)', 'A resistor kit (330 Ω, 1k, 2k, 4.7k, 10k)'), qty: 1, pack: true }
  ];
  function kitRows(trackIds) {
    var need = {}, used = {};
    P.lessons.forEach(function (l) {
      if (trackIds.indexOf(l.track) < 0) return;
      (l.parts || []).forEach(function (p) {
        if (!p.id) return;
        var q = p.qty || 1;
        need[p.id] = Math.max(need[p.id] || 0, q);
        (used[p.id] = used[p.id] || []).push(l.id);
      });
    });
    var rows = KIT_BASE.map(function (b) { return { id: b.id, name: b.name, qty: b.qty, base: true, pack: b.pack }; });
    Object.keys(need).forEach(function (id) { var c = P.componentById(id); rows.push({ id: id, name: c ? c.name : id, qty: need[id], lessons: used[id] }); });
    return rows;
  }

  function synLink(ref) {
    var k = ref.split(':')[0], id = ref.split(':')[1];
    if (k === 'b') { var i = -1; P.basics.forEach(function (c, n) { if (c.id === id) i = n; }); return i < 0 ? '' : '<a href="#/basics/' + id + '">' + T({ he: 'פרק', en: 'Ch.' }) + ' ' + (i + 1) + '</a>'; }
    if (k === 'l') return '<a href="#/lessons/' + id + '">' + id + '</a>';
    if (k === 'i') { var it = P.interfaceById(id); return it ? '<a href="#/interfaces/' + id + '">' + esc(T(it.name)) + '</a>' : ''; }
    if (k === 'c') { var c = P.componentById(id); return c ? '<a href="#/components/' + id + '">' + esc(T(c.name)) + '</a>' : ''; }
    if (k === 'p') return '<a href="#/pinout">' + T({ he: 'מפת הפינים', en: 'Pinout' }) + '</a>';
    if (k === 'pl') return '<a href="#/planner">' + T({ he: 'המתכנן', en: 'Planner' }) + '</a>';
    if (k === 'dbg') return '<a href="#/debug">' + T({ he: 'דף העזר', en: 'Cheat sheet' }) + '</a>';
    return '';
  }

  /* ---------- exporting the check questions for Moodle ---------- */
  /* site markup ([[term|shown]], `code`) to plain HTML for Moodle */
  function qHTML(v, lang) {
    var s = typeof v === 'string' ? v : (v[lang] || v.he);
    return P.esc(s).replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function qPlain(v, lang) { var s = typeof v === 'string' ? v : (v[lang] || v.he); return s.replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1'); }
  /* every check question, grouped: [{ cat: 'Lessons/A', name: 'A1', items: [...] }] */
  function questionSets(scope) {
    var sets = [];
    if (scope === 'all' || scope === 'lessons' || scope.length === 1) {
      P.lessons.forEach(function (l) { if (l.quiz && l.quiz.length && (scope.length !== 1 || l.track === scope)) sets.push({ cat: 'Lessons/' + l.track, name: l.id, title: l.title, items: l.quiz }); });
    }
    if (scope === 'all' || scope === 'basics') P.basics.forEach(function (c, i) { if (c.quiz && c.quiz.length) sets.push({ cat: 'Basics', name: 'B' + (i + 1), title: c.title, items: c.quiz }); });
    if (scope === 'all' || scope === 'ifaces') P.interfaces.forEach(function (it) { if (it.quiz && it.quiz.length) sets.push({ cat: 'Interfaces', name: it.id.toUpperCase(), title: it.name, items: it.quiz }); });
    return sets;
  }
  function cdata(s) { return '<![CDATA[' + String(s).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>'; }
  function moodleXML(sets, lang) {
    var rtl = lang === 'he', wrap = function (h) { return rtl ? '<div dir="rtl">' + h + '</div>' : h; };
    var out = ['<?xml version="1.0" encoding="UTF-8"?>', '<quiz>'], lastCat = null;
    sets.forEach(function (set) {
      if (set.cat !== lastCat) {
        out.push('  <question type="category"><category><text>$course$/Pico 2/' + set.cat + '</text></category></question>');
        lastCat = set.cat;
      }
      set.items.forEach(function (q, n) {
        var k = P.quiz.kind(q);
        /* Moodle has no core question type for putting lines in order, so those are left out */
        if (k === 'order') { out.push('  <!-- ' + P.esc(set.name + ' · ' + (n + 1)) + ': an "order the lines" question, not exported -->'); return; }
        var text = qHTML(q.q, lang) + (q.code ? '<pre dir="ltr">' + P.esc(q.code.join('\n')) + '</pre>' : '');
        out.push('  <question type="' + (k === 'output' ? 'shortanswer' : 'multichoice') + '">',
          '    <name><text>' + P.esc(set.name + ' · ' + (n + 1) + ' · ' + qPlain(set.title, lang)) + '</text></name>',
          '    <questiontext format="html"><text>' + cdata(wrap(text)) + '</text></questiontext>',
          '    <generalfeedback format="html"><text>' + cdata(q.why ? wrap(qHTML(q.why, lang)) : '') + '</text></generalfeedback>',
          '    <defaultgrade>1</defaultgrade><penalty>0.3333333</penalty><hidden>0</hidden>');
        if (k === 'output') {
          out.push('    <usecase>0</usecase>');
          P.quiz.answers(q).forEach(function (a) { out.push('    <answer fraction="100" format="moodle_auto_format"><text>' + cdata(a) + '</text><feedback format="html"><text></text></feedback></answer>'); });
        } else {
          out.push('    <single>true</single><shuffleanswers>true</shuffleanswers><answernumbering>abc</answernumbering>');
          q.a.forEach(function (a, i) {
            out.push('    <answer fraction="' + (i === q.ok ? 100 : 0) + '" format="html"><text>' + cdata(wrap(qHTML(a, lang))) + '</text><feedback format="html"><text></text></feedback></answer>');
          });
        }
        out.push('  </question>');
      });
    });
    out.push('</quiz>', '');
    return out.join('\n');
  }
  function gift(sets, lang) {
    var esc = function (s) { return s.replace(/([~=#{}:\\])/g, '\\$1'); };
    var out = [], lastCat = null;
    sets.forEach(function (set) {
      if (set.cat !== lastCat) { out.push('$CATEGORY: $course$/Pico 2/' + set.cat, ''); lastCat = set.cat; }
      set.items.forEach(function (q, n) {
        var k = P.quiz.kind(q);
        if (k === 'order') { out.push('// ' + set.name + ' · ' + (n + 1) + ': an "order the lines" question, not exported', ''); return; }
        var text = qHTML(q.q, lang) + (q.code ? '<pre dir="ltr">' + P.esc(q.code.join('\n')) + '</pre>' : '');
        out.push('::' + esc(set.name + ' · ' + (n + 1)) + '::[html]' + esc(text) + ' {',
          k === 'output' ? P.quiz.answers(q).map(function (a) { return '  =' + esc(a); }).join('\n')
            : q.a.map(function (a, i) { return '  ' + (i === q.ok ? '=' : '~') + esc(qHTML(a, lang)); }).join('\n'),
          (q.why ? '  ####' + esc(qHTML(q.why, lang)) : ''), '}', '');
      });
    });
    return out.filter(function (x, i, arr) { return x !== '' || arr[i - 1] !== ''; }).join('\n');
  }
  P.quizExport = { sets: questionSets, xml: moodleXML, gift: gift };

  /* ---------- printing one part of a page ---------- */
  function printOnly(el) {
    document.body.classList.add('print-one'); el.classList.add('print-target');
    var done = function () { document.body.classList.remove('print-one'); el.classList.remove('print-target'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1500);
  }

  /* ---------- the lab sheet ---------- */
  function lessonTime(id) {
    var t = P.teach && P.teach[id];
    return t ? T(L.est) + ': ' + t.min + ' ' + T(L.minutes) + (t.ext ? ', ' + T(L.plusTasks) + ' ' + t.ext + ' ' + T(L.forTasks) : '') : '';
  }
  P.viewLabSheet = function (app, l) {
    var tch = P.teach && P.teach[l.id], cps = tch ? tch.cp : L.defaultCp;
    var parts = (l.parts || []).map(function (p) {
      if (p.text) return '<li>' + R(p.text) + '</li>';
      var c = P.componentById(p.id);
      return '<li>' + (p.qty > 1 ? p.qty + ' × ' : '') + esc(T(c.name)) + (p.note ? ' <span class="muted">' + R(p.note) + '</span>' : '') + '</li>';
    }).join('');
    var wires = (l.wiring || []).map(function (w) {
      return '<tr><td>' + esc(T(w.who)) + '</td><td class="ltr"><b>' + esc(w.to) + '</b></td><td class="ltr">' + w.num + '</td><td>' + (w.note ? R(w.note) : '') + '</td></tr>';
    }).join('');
    var blank = '<span class="ls-blank"></span>';
    app.className = 'page narrow';
    app.innerHTML = '<div class="sheet labsheet">' +
      '<div class="sheet-bar no-print"><a class="btn ghost" href="#/lessons/' + l.id + '">' + T(L.back) + '</a><button type="button" class="btn" id="ls-print">' + T(L.print) + '</button></div>' +
      '<div class="ls-head"><span>' + T(L.name) + ': ' + blank + '</span><span>' + T(L.partner) + ': ' + blank + '</span><span>' + T(L.date) + ': ' + blank + '</span><span>' + T(L.station) + ': ' + blank + '</span></div>' +
      '<h1>' + T(L.lab) + ' ' + l.id + ': ' + esc(T(l.title)) + '</h1><p>' + R(l.goal) + '</p>' + (lessonTime(l.id) ? '<p class="muted ls-time">' + lessonTime(l.id) + '</p>' : '') +
      (parts ? '<h2>' + T(L.parts) + '</h2><ul class="ls-cols">' + parts + '</ul>' : '') +
      (wires ? '<h2>' + T(L.wiring) + '</h2><table class="tbl sheet-tbl"><thead><tr><th>' + T(L.part) + '</th><th>' + T(L.codePin) + '</th><th>' + T(L.phys) + '</th><th>' + T(L.note) + '</th></tr></thead><tbody>' + wires + '</tbody></table>' : '') +
      '<h2>' + T(L.steps) + '</h2><ol class="ls-steps">' + l.steps.map(function (s, i) { return '<li><span class="ls-box" aria-hidden="true"></span><span class="ls-n">' + (i + 1) + '.</span><span>' + R(s) + '</span></li>'; }).join('') + '</ol>' +
      '<h2>' + T(L.code) + '</h2><pre class="ls-code" dir="ltr">' + esc(l.code.join('\n')) + '</pre>' +
      '<h2>' + T(l.expectTitle || L.expect) + '</h2><p>' + R(l.expect) + '</p>' +
      (l.tasks && l.tasks.length ? '<h2>' + T(l.tasksTitle || L.tasks) + '</h2><ol class="ls-tasks">' + l.tasks.map(function (k) { return '<li>' + R(k.t) + '<span class="ls-lines"></span></li>'; }).join('') + '</ol>' : '') +
      '<h2>' + T(L.checks) + '</h2><table class="tbl sheet-tbl ls-sign"><thead><tr><th></th><th>' + T(L.time) + '</th><th>' + T(L.sign) + '</th></tr></thead><tbody>' +
      cps.map(function (c) { return '<tr><td>' + R(c) + '</td><td></td><td></td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="muted sheet-foot">' + esc(T({ he: 'מעבדת Pico 2', en: 'Pico 2 Lab' })) + ' · #/lessons/' + l.id + '</p></div>';
    document.getElementById('ls-print').addEventListener('click', function () { window.print(); });
  };
  P.labSheetButton = function (l) { return '<a class="btn ghost small no-print" href="#/lessons/' + l.id + '/sheet">' + T(L.sheetBtn) + '</a>'; };

  /* ---------- the lecturer page ---------- */
  P.viewTeach = function (app) {
    var H = P.h, tracks = P.tracks, byId = {};
    P.lessons.forEach(function (l) { byId[l.id] = l; });
    var chapters = {};
    P.basics.forEach(function (c, i) { chapters[c.id] = { c: c, n: i + 1 }; });
    var lessonLink = function (id) { return '<a href="#/lessons/' + id + '">' + id + '</a>'; };
    var sections = [['use', L.useH], ['plan', L.planH], ['syl', L.synH], ['over', L.overH], ['answers', L.ansH], ['export', L.expH], ['kit', LK.h], ['rubric', L.rubricH], ['check', L.checkH]];
    var kit = '<p>' + T(LK.lead) + '</p><div class="card tc-exp no-print"><div class="vf-f"><span>' + T(LK.tracks) + '</span><span class="chips" style="margin:0" id="kit-tracks">' +
      tracks.map(function (t) { return '<button type="button" class="chip' + ('ABCDT'.indexOf(t.id) >= 0 ? ' on' : '') + '" data-kt="' + t.id + '" aria-pressed="' + ('ABCDT'.indexOf(t.id) >= 0) + '">' + t.id + '</button>'; }).join('') + '</span></div>' +
      '<label class="vf-f"><span>' + T(LK.stations) + '</span><input type="number" id="kit-st" min="1" max="100" value="15"></label>' +
      '<label class="vf-f"><span>' + T(LK.spare) + '</span><input type="number" id="kit-sp" min="0" max="100" value="10"></label>' +
      '<div class="vf-acts"><button type="button" class="btn ghost small" id="kit-csv">' + T(LK.csv) + '</button></div></div><div id="kit-out"></div>' +
      '<p class="muted" style="font-size:.88rem">' + T(LK.packNote) + '</p>';
    var syl = '<p>' + T(L.synLead) + ' <a class="no-print" href="https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/micro_controler_2026.pdf" target="_blank" rel="noopener">' + T(L.synPdf) + ' ↗</a></p>' +
      '<div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl sheet-tbl"><thead><tr><th>' + T(L.topic) + '</th><th>' + T(L.onSite) + '</th><th>' + T(L.gap) + '</th></tr></thead><tbody>' +
      SYL.map(function (r) { return '<tr><td>' + T(r[0]) + '</td><td>' + r[1].map(synLink).filter(Boolean).join(', ') + '</td><td class="muted">' + (r[2] ? T(r[2]) : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted" style="font-size:.88rem">' + T(L.synNote) + '</p>';
    var exp = '<p>' + T(L.expLead) + '</p><div class="card tc-exp"><label class="vf-f"><span>' + T(L.expWhich) + '</span><select id="ex-scope">' +
      [['all', L.expAll], ['lessons', L.expLessons]].concat(tracks.map(function (t) { return [t.id, { he: 'מסלול ' + t.id + ': ' + t.title.he, en: 'Track ' + t.id + ': ' + t.title.en }]; })).concat([['basics', L.expBasics], ['ifaces', L.expIfaces]])
        .map(function (o) { return '<option value="' + o[0] + '">' + esc(T(o[1])) + '</option>'; }).join('') + '</select></label>' +
      '<label class="vf-f"><span>' + T(L.expLang) + '</span><select id="ex-lang"><option value="he">עברית</option><option value="en">English</option></select></label>' +
      '<label class="vf-f"><span>' + T(L.expFmt) + '</span><select id="ex-fmt"><option value="xml">Moodle XML</option><option value="gift">GIFT</option></select></label>' +
      '<div class="vf-acts"><button type="button" class="btn" id="ex-dl">' + T(L.expDl) + '</button><span class="muted" id="ex-count"></span></div></div><p class="muted" style="font-size:.88rem">' + T(L.expNote) + '</p>';
    var pbtn = '<button type="button" class="btn ghost small no-print" data-print>' + T(L.printPart) + '</button>';
    function sec(id, title, body) { return '<section class="tc-sec" id="tc-' + id + '"><div class="tc-h"><h2>' + T(title) + '</h2>' + pbtn + '</div>' + body + '</section>'; }

    var plan = '<div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.week) + '</th><th>' + T(L.read) + '</th><th>' + T(L.doLab) + '</th><th>' + T(L.notes) + '</th></tr></thead><tbody>' +
      P.teachPlan.map(function (w) {
        var reads = (w.start ? ['<a href="#/start">' + T(L.startPage) + '</a>'] : []).concat(w.read.map(function (id) { var x = chapters[id]; return x ? '<a href="#/basics/' + id + '">' + T(L.chapter) + ' ' + x.n + '</a>' : ''; }));
        return '<tr><td class="ltr"><b>' + w.w + '</b></td><td>' + reads.join(', ') + '</td><td>' + w.lessons.map(function (id) {
          return lessonLink(id) + ' <a class="muted no-print" href="#/lessons/' + id + '/sheet" title="' + esc(T(L.sheet)) + '">⎙</a>';
        }).join(', ') + '</td><td>' + (w.note ? R(w.note) : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var over = tracks.map(function (t) {
      var ls = P.lessons.filter(function (l) { return l.track === t.id; });
      return '<h3>' + T(L.track) + ' ' + t.id + ': ' + esc(T(t.title)) + '</h3><div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.lesson) + '</th><th>' + T(L.est) + '</th><th>' + T(L.checks) + '</th><th class="no-print"></th></tr></thead><tbody>' +
        ls.map(function (l) {
          var tc = P.teach && P.teach[l.id];
          return '<tr><td>' + lessonLink(l.id) + ' ' + esc(T(l.title)) + '</td><td class="ltr">' + (tc ? tc.min + (tc.ext ? '+' + tc.ext : '') + "'" : T(L.noTime)) + '</td><td class="ltr">' + (tc ? tc.cp.length : 3) + '</td>' +
            '<td class="no-print"><a href="#/lessons/' + l.id + '/sheet">' + T(L.sheet) + '</a> · <a href="#tc-ans-' + l.id + '" data-ans="' + l.id + '">' + T(L.answers) + '</a></td></tr>';
        }).join('') + '</tbody></table></div>';
    }).join('');

    function quizAns(q) {
      var k = P.quiz.kind(q), ans = k === 'output' ? '<code dir="ltr">' + esc(P.quiz.answers(q)[0]) + '</code>'
        : k === 'order' ? '<code dir="ltr">' + q.lines.map(esc).join(' ⏎ ') + '</code>'
        : k === 'fill' ? '<code dir="ltr">' + esc(T(q.a[q.ok])) + '</code>' : R(q.a[q.ok]);
      return '<li>' + R(q.q) + '<br><b>' + T(L.right) + ':</b> ' + ans + (q.why ? ' <span class="muted">' + R(q.why) + '</span>' : '') + '</li>';
    }
    var answers = '<p>' + T(L.ansLead) + '</p>' + P.lessons.map(function (l) {
      var tc = P.teach && P.teach[l.id];
      return '<details class="card tc-ans" id="tc-ans-' + l.id + '"><summary><b>' + l.id + '</b> ' + esc(T(l.title)) + '</summary>' +
        (tc && tc.pit.length ? '<h4>' + T(L.pit) + '</h4><ul>' + tc.pit.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ul>' : '') +
        (l.quiz && l.quiz.length ? '<h4>' + T(L.quiz) + '</h4><ol>' + l.quiz.map(quizAns).join('') + '</ol>' : '') +
        (l.tasks || []).map(function (k, i) {
          return '<h4>' + T(L.task) + ' ' + (i + 1) + '</h4><p>' + R(k.t) + '</p>' + (k.hint ? '<p class="muted"><b>' + T(L.hint) + ':</b> ' + R(k.hint) + '</p>' : '') +
            (k.code ? H.codeBlock(k.code, null, true) : (k.hint ? '' : '<p class="muted">' + T(L.noSol) + '</p>'));
        }).join('') + '</details>';
    }).join('') +
      '<details class="card tc-ans"><summary><b>' + T(L.basicsAns) + '</b></summary>' + P.basics.map(function (c, i) {
        return c.quiz && c.quiz.length ? '<h4>' + T(L.chapter) + ' ' + (i + 1) + ': ' + esc(T(c.title)) + '</h4><ol>' + c.quiz.map(quizAns).join('') + '</ol>' : '';
      }).join('') + '</details>';

    var rubric = '<p>' + T(L.rubricLead) + '</p><div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl sheet-tbl tc-rubric"><thead><tr><th>' + T(L.crit) + '</th>' + L.lv.map(function (x) { return '<th>' + T(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      L.rubric.map(function (r) { return '<tr>' + r.map(function (c, i) { return i ? '<td>' + R(c) + '</td>' : '<td><b>' + R(c) + '</b></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';

    var check = '<p class="no-print">' + T(L.checkLead) + '</p><div class="vf-acts no-print"><span class="chips" style="margin:0" id="tc-tracks">' + tracks.map(function (t, i) {
      return '<button type="button" class="chip' + (i === 0 ? ' on' : '') + '" data-tr="' + t.id + '">' + t.id + '</button>';
    }).join('') + '</span><label>' + T(L.students) + ' <input type="number" id="tc-n" min="1" max="60" value="20" style="width:70px"></label></div><div id="tc-grid"></div>';

    app.className = 'page';
    app.innerHTML = '<div id="teach-root"><h1>' + T(L.h) + '</h1><p class="lead" style="margin-block:8px 14px">' + T(L.lead) + '</p>' +
      '<nav class="chips no-print" aria-label="' + esc(T(L.toc)) + '">' + sections.map(function (s) { return '<a class="chip" href="#tc-' + s[0] + '" data-jump="' + s[0] + '">' + T(s[1]) + '</a>'; }).join('') + '</nav>' +
      sec('use', L.useH, '<div class="card">' + H.list(L.use) + '</div><div class="callout" style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap">' + T(L.useNote) +
        '<span style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn small" href="#/verify">' + T(L.verifyBtn) + '</a><a class="btn ghost small" href="#/debug">' + T(L.debugBtn) + '</a></span></div>') +
      sec('plan', L.planH, plan) + sec('syl', L.synH, syl) + sec('over', L.overH, over) + sec('answers', L.ansH, answers) + sec('export', L.expH, exp) + sec('kit', LK.h, kit) + sec('rubric', L.rubricH, rubric) + sec('check', L.checkH, check) + '</div>';

    var root = document.getElementById('teach-root'), curTrack = tracks[0].id;
    function grid() {
      var n = Math.max(1, Math.min(60, parseInt(document.getElementById('tc-n').value, 10) || 20));
      var ls = P.lessons.filter(function (l) { return l.track === curTrack; });
      var t = tracks.filter(function (x) { return x.id === curTrack; })[0];
      var rows = '';
      for (var i = 1; i <= n; i++) rows += '<tr><td class="ltr">' + i + '</td><td></td>' + ls.map(function () { return '<td></td>'; }).join('') + '</tr>';
      document.getElementById('tc-grid').innerHTML = '<h3>' + T(L.track) + ' ' + t.id + ': ' + esc(T(t.title)) + '</h3><div class="tbl-wrap"><table class="tbl tc-check"><thead><tr><th>#</th><th>' + T(L.student) + '</th>' +
        ls.map(function (l) { return '<th>' + l.id + '<br><small>' + esc(T(l.title)) + '</small></th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
    }
    grid();
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button, a');
      if (!b) return;
      if (b.hasAttribute('data-print')) printOnly(b.closest('section'));
      else if (b.hasAttribute('data-tr')) { curTrack = b.getAttribute('data-tr'); root.querySelectorAll('[data-tr]').forEach(function (x) { x.classList.toggle('on', x === b); }); grid(); }
      else if (b.hasAttribute('data-jump') || b.hasAttribute('data-ans')) {
        e.preventDefault();
        var target = b.hasAttribute('data-ans') ? document.getElementById('tc-ans-' + b.getAttribute('data-ans')) : document.getElementById('tc-' + b.getAttribute('data-jump'));
        if (target) { if (target.tagName === 'DETAILS') target.open = true; target.scrollIntoView({ block: 'start' }); }
      }
    });
    document.getElementById('tc-n').addEventListener('change', grid);
    var kitTracks = tracks.map(function (t) { return t.id; }).filter(function (id) { return 'ABCDT'.indexOf(id) >= 0; });
    function kitData() {
      var st = Math.max(1, Math.min(100, parseInt(document.getElementById('kit-st').value, 10) || 15));
      var sp = Math.max(0, Math.min(100, parseInt(document.getElementById('kit-sp').value, 10) || 0));
      var rows = kitRows(kitTracks).map(function (r) { return { r: r, cls: Math.ceil(r.qty * st * (1 + sp / 100)) }; });
      return { rows: rows, st: st };
    }
    function kitDraw() {
      var k = kitData();
      document.getElementById('kit-out').innerHTML = '<div class="tbl-wrap card" style="padding:8px 12px"><table class="tbl sheet-tbl tc-kit"><thead><tr><th>' + T(LK.item) + '</th><th>' + T(LK.perSt) + '</th><th>' + T(LK.forClass) + ' (' + k.st + ' ' + T(LK.stations) + ')</th></tr></thead><tbody>' +
        k.rows.map(function (x) {
          var r = x.r;
          return '<tr><td>' + esc(T(r.name)) + (r.base ? ' <small class="muted">(' + T(LK.base) + ')</small>' : '<br><small class="muted">' + T(LK.lessonsUse) + ': ' + r.lessons.join(', ') + '</small>') + '</td>' +
            '<td class="ltr">' + r.qty + '</td><td class="ltr"><b>' + x.cls + '</b></td></tr>';
        }).join('') + '</tbody></table></div>' +
        (kitTracks.indexOf('D') >= 0 ? '<p class="muted" style="font-size:.88rem">' + T(LK.d3) + '</p>' : '');
      return k;
    }
    kitDraw();
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kt]');
      if (b) {
        var id = b.getAttribute('data-kt'), on = kitTracks.indexOf(id) < 0;
        if (on) kitTracks.push(id); else kitTracks.splice(kitTracks.indexOf(id), 1);
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); kitDraw();
      } else if (e.target.id === 'kit-csv') {
        var k = kitDraw(), q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
        var lines = [[T(LK.item), T(LK.perSt), T(LK.forClass)].map(q).join(',')].concat(k.rows.map(function (x) {
          return [q(T(x.r.name)), x.r.qty, x.cls].join(',');
        }));
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv' }));
        a.download = 'pico2-kit-' + k.st + '-stations.csv'; document.body.appendChild(a); a.click(); a.remove();
      }
    });
    ['kit-st', 'kit-sp'].forEach(function (id) { document.getElementById(id).addEventListener('change', kitDraw); });
    function exCount() {
      var sets = questionSets(document.getElementById('ex-scope').value), n = 0;
      sets.forEach(function (s) { n += s.items.length; });
      document.getElementById('ex-count').textContent = n + ' ' + T(L.expCount);
      return sets;
    }
    exCount();
    document.getElementById('ex-scope').addEventListener('change', exCount);
    document.getElementById('ex-dl').addEventListener('click', function () {
      var sets = exCount(), lang = document.getElementById('ex-lang').value, fmt = document.getElementById('ex-fmt').value, scope = document.getElementById('ex-scope').value;
      var text = fmt === 'xml' ? moodleXML(sets, lang) : gift(sets, lang);
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: fmt === 'xml' ? 'application/xml' : 'text/plain' }));
      a.download = 'pico2-questions-' + scope + '-' + lang + (fmt === 'xml' ? '.xml' : '.gift.txt');
      document.body.appendChild(a); a.click(); a.remove();
    });
  };
})(window.PICO);
