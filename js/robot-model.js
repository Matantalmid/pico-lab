/* The farm-carrier robot as a parametric model.
   - PARTS: the bill of materials, taken from the project's cost table.
   - compute(dims): everything that follows from the five dimensions the
     students choose (lengths to cut, chain length, clearances, checks).
   - build(THREE, dims, opts): the 3D model, one group per assembly step.
   This is a concept model: sizes and positions are right, small details
   (every bolt, every groove) are not. All lengths are in centimetres.
   Axes: x = forward, y = up, z = across. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };

  var R = 15.25;          // wheel radius: a 12 inch tyre
  var TIRE_W = 14.5;      // tyre width (145/70-6)
  var PITCH = 1.27;       // 08B chain pitch
  var BEAR_H = 3.33;      // UCP204: shaft centre to mounting face
  var MOTOR_RPM = 75;
  function pd(n) { return PITCH / Math.sin(Math.PI / n); }      // sprocket pitch diameter

  var DEFAULTS = { L: 66, W: 84, H: 75, B: 48, G: 13 };
  var LIMITS = { L: [50, 120], W: [50, 120], H: [50, 120], B: [34, 100], G: [10, 20] };

  /* ---------- the parts: names and what each one does ---------- */
  var PARTS = {
    profile: { name: B('פרופיל אלומיניום 4040', '4040 aluminium profile'), role: B('השלדה: היא נושאת את הרובוט ואת הארגזים, עד 85 ק"ג.', 'The frame: carries the robot and the crates, up to 85 kg.'), to: B('כל שאר החלקים מוברגים אליו.', 'Every other part bolts onto it.'), qty: 8, unit: 100, note: B('8 מטרים, שנחתכים לפי המידות שתבחרו.', '8 metres, cut to the dimensions you choose.') },
    bracket: { name: B('זווית 90 מעלות ל-4040', '4040 corner bracket'), role: B('שומרת על הפינות ישרות, כדי שהשלדה לא תקרוס הצידה.', 'Keeps the corners square, so the frame does not fold sideways.'), to: B('בכל נקודה שבה נפגשות שתי קורות.', 'At every joint between two beams.'), qty: 5, unit: 18.59, note: B('5 אריזות של 5.', '5 packs of 5.') },
    tnut: { name: B('אומי פטיש M8', 'M8 T-nuts'), role: B('הם מחליקים לתוך החריץ של הפרופיל, ואליהם מבריגים את הברגים. כך מחברים חלקים בלי לקדוח.', 'They slide into the profile slot and take the bolts. This joins parts without drilling.'), to: B('בתוך חריצי הפרופיל.', 'Inside the profile slots.'), qty: 8, unit: 13.9, note: B('8 אריזות של 10.', '8 packs of 10.') },
    bolt: { name: B('ברגי אלן M8', 'M8 socket bolts'), role: B('מחברים את הזוויות, המיסבים והמנועים לאומי הפטיש.', 'Join brackets, bearings and motors to the T-nuts.'), to: B('לתוך אומי הפטיש.', 'Into the T-nuts.'), qty: 2, unit: 20 },
    wheel: { name: B('גלגל שטח 12 אינץ\' (145/70-6)', '12 inch off-road wheel (145/70-6)'), role: B('אוחז בחול בלי לשקוע.', 'Grip in sand without sinking.'), to: B('על קצה הציר, דרך הרכזת.', 'On the end of the shaft, through the hub.'), qty: 4, unit: 215.39 },
    hub: { name: B('רכזת (מתאם ציר לגלגל)', 'Hub (shaft to wheel adapter)'), role: B('מחברת את חישוק הגלגל לציר הפלדה.', 'Joins the wheel rim to the steel shaft.'), to: B('ננעלת על הציר, ומוברגת לחישוק בשלושה ברגים.', 'Locks on the shaft and bolts to the rim with three bolts.'), qty: 2, unit: 81.39, note: B('נמכרות בזוגות, וצריך להרחיב את החור שלהן ל-20 מ"מ בסדנה.', 'Sold in pairs. They need boring to 20 mm in a workshop.') },
    shaft: { name: B('ציר פלדה 20 מ"מ, אורך 30 ס"מ', '20 mm steel shaft, 30 cm long'), role: B('נושא את המשקל ומעביר את הסיבוב לגלגל.', 'Carries the weight and passes the rotation to the wheel.'), to: B('עובר דרך שני מיסבים, ועליו יושבים גלגלי השיניים והגלגל.', 'Passes through two bearings. The sprockets and the wheel sit on it.'), qty: 4, unit: 69.69 },
    bearing: { name: B('מיסב בלוק UCP204', 'UCP204 pillow block bearing'), role: B('מחזיק את הציר במקומו, ומאפשר לו להסתובב בחלקות.', 'Holds the shaft in place and lets it turn smoothly.'), to: B('מוברג לתחתית המסילה, שניים לכל ציר.', 'Bolted under the rail. Two per shaft.'), qty: 4, unit: 65.39, note: B('4 אריזות של 2.', '4 packs of 2.') },
    key: { name: B('שגמים (6×6 ו-5×5 מ"מ)', 'Keys (6×6 and 5×5 mm)'), role: B('קוביית פלדה קטנה שנועלת את גלגל השיניים לציר, כדי שלא יחליק.', 'A small steel block that locks a sprocket to its shaft, so it cannot slip.'), to: B('במגרעת שבין הציר לגלגל השיניים.', 'In the groove between the shaft and the sprocket.'), qty: 1, unit: 41.79 },
    sp12: { name: B('גלגל שיניים 12 שיניים (מנוע)', '12-tooth sprocket (motor)'), role: B('מעביר את הכוח מציר המנוע לשרשרת.', 'Passes power from the motor shaft to the chain.'), to: B('על ציר המנוע.', 'On the motor shaft.'), qty: 2, unit: 19.19 },
    sp18: { name: B('גלגל שיניים 18 שיניים (מונע)', '18-tooth sprocket (driven)'), role: B('מקבל את הכוח מהמנוע. היחס 12:18 מאט את הגלגל ומגדיל את הכוח שלו.', 'Takes the power from the motor. The 12:18 ratio slows the wheel and strengthens it.'), to: B('על הציר האחורי.', 'On the rear shaft.'), qty: 2, unit: 38.39 },
    sp15: { name: B('גלגל שיניים 15 שיניים (גישור)', '15-tooth sprocket (link)'), role: B('מסנכרן בין הגלגל האחורי לקדמי באותו צד, כך שכל ארבעת הגלגלים מניעים.', 'Synchronises the rear and front wheel on one side, so all four wheels drive.'), to: B('אחד על הציר האחורי ואחד על הקדמי, בכל צד.', 'One on the rear shaft and one on the front, on each side.'), qty: 4, unit: 27.9 },
    chain: { name: B('שרשרת 08B', '08B roller chain'), role: B('מעבירה כוח מהמנוע לציר האחורי, ומהציר האחורי לקדמי.', 'Passes power: from the motor to the rear shaft, and from rear to front.'), to: B('נחתכת לשתי שרשראות קצרות ולשתיים ארוכות.', 'Cut into two short chains and two long ones.'), qty: 3, unit: 80.39, note: B('3 חתיכות באורך 1.524 מ\'.', '3 lengths of 1.524 m.') },
    masterlink: { name: B('חוליות חיבור 08B', '08B master links'), role: B('סוגרות כל שרשרת ללולאה סגורה.', 'Close each chain into a loop.'), to: B('בקצות כל שרשרת.', 'At the ends of each chain.'), qty: 5, unit: 4.19 },
    idler: { name: B('גלגל מתיחה לשרשרת', 'Chain idler sprocket'), role: B('לוחץ על השרשרת הארוכה ושומר עליה מתוחה.', 'Presses on the long chain and keeps it tight.'), to: B('על תושבת במסילה, באמצע השרשרת הארוכה.', 'On a bracket on the rail, at the middle of the long chain.'), qty: 2, unit: 33.39 },
    motor: { name: B('מנוע MY1016Z, 24V, 250W, 75 סל"ד', 'MY1016Z motor, 24 V, 250 W, 75 rpm'), role: B('מניע את הרובוט. יש מנוע בכל צד, וכשהמהירות בשני הצדדים שונה, הרובוט מסתובב.', 'Pushes the robot. One motor per side: different speeds on the two sides turn the robot.'), to: B('מוברג למסילות ומניע שרשרת.', 'Bolted to the rails, driving a chain.'), qty: 2, unit: 282.9 },
    battery: { name: B('מצבר LiFePO4 24V 30Ah', 'LiFePO4 battery, 24 V 30 Ah'), role: B('מקור הכוח של כל הרובוט.', 'The power source for the whole robot.'), to: B('יושב על מדף בשלדה, וממנו יוצא הכבל למפסק.', 'On a shelf in the frame. The cable to the breaker leaves from it.'), qty: 1, unit: 1199 },
    estop: { name: B('לחצן חירום (פטרייה)', 'Emergency stop button'), role: B('לחיצה אחת מנתקת מיד את המנועים.', 'One press cuts the motors at once.'), to: B('מפעיל את הממסר, וזה מנתק את קו הפלוס.', 'Works the contactor, which cuts the positive line.'), qty: 1, unit: 12.09 },
    breaker: { name: B('מפסק זרם DC 63A', 'DC circuit breaker, 63 A'), role: B('מנתק את המעגל מעצמו כשיש קצר או זרם חריג.', 'Trips by itself on a short or excess current.'), to: B('על קו הפלוס, מיד אחרי המצבר.', 'On the positive line, straight after the battery.'), qty: 1, unit: 68.02 },
    contactor: { name: B('ממסר הספק 100A, סליל 24V', 'Power contactor 100 A, 24 V coil'), role: B('מתג לזרם חזק, שלחצן החירום שולט בו.', 'A heavy switch controlled by the emergency button.'), to: B('על קו הפלוס, אחרי המפסק.', 'On the positive line, after the breaker.'), qty: 1, unit: 49.19 },
    driver: { name: B('בקר מנוע BTS7960', 'BTS7960 motor driver'), role: B('מעביר למנוע את הזרם החזק, לפי אותות ה-PWM שמגיעים מה-Pico.', 'Passes the heavy current to the motor, following PWM signals from the Pico.'), to: B('בין המצבר למנוע, ופיני הבקרה שלו מחוברים ל-Pico.', 'Between the battery and the motor. Control pins to the Pico.'), qty: 2, unit: 10.9 },
    buck: { name: B('ממיר מתח 24V ל-5V', 'Buck converter, 24 V to 5 V'), role: B('מוריד את מתח המצבר ל-5V בשביל ה-Pico.', 'Lowers the battery voltage to 5 V for the Pico.'), to: B('מהמצבר אל ה-Pico.', 'From the battery to the Pico.'), qty: 1, unit: 10.29 },
    pico: { name: B('Raspberry Pi Pico', 'Raspberry Pi Pico'), role: B('המוח: קורא את השלט, ומחליט באיזו מהירות יסתובב כל מנוע.', 'The brain: reads the remote and decides how fast each motor turns.'), to: B('מחובר למקלט הרדיו ולשני בקרי המנוע.', 'To the radio receiver and both motor drivers.'), qty: 0, unit: 8.29, note: B('כבר נמצא בכיתה, ולכן לא נכלל בעלות.', 'Already in the classroom, so not counted in the cost.') },
    radio: { name: B('שלט FlySky FS-i6 ומקלט', 'FlySky FS-i6 remote and receiver'), role: B('שולט ברובוט מרחוק.', 'Controls the robot from a distance.'), to: B('המקלט מתחבר ל-Pico דרך פין אחד.', 'The receiver connects to the Pico with one pin.'), qty: 1, unit: 194.69 },
    wire: { name: B('כבל סיליקון 10AWG', '10 AWG silicone cable'), role: B('מוליך את הזרם החזק בלי להתחמם יותר מדי.', 'Carries the heavy current without overheating.'), to: B('בין המצבר, המפסקים, הבקרים והמנועים.', 'Between the battery, breakers, drivers and motors.'), qty: 1, unit: 91.9 },
    xt90: { name: B('מחברי XT90', 'XT90 connectors'), role: B('מאפשרים לנתק את המצבר ולהחליף אותו בלי כלים.', 'Let you unplug and swap the battery without tools.'), to: B('בין המצבר לחיווט.', 'Between the battery and the wiring.'), qty: 1, unit: 22.9 },
    ringterm: { name: B('נעלי כבל', 'Ring terminals'), role: B('חיבור חשמלי הדוק שלא משתחרר מרעידות.', 'A tight electrical joint that does not shake loose.'), to: B('על קצות הכבלים.', 'On the cable ends.'), qty: 1, unit: 12.5 },
    charger: { name: B('מטען LiFePO4 29.2V 5A', 'LiFePO4 charger, 29.2 V 5 A'), role: B('טוען את המצבר.', 'Charges the battery.'), to: B('מתחבר לשקע של המצבר.', 'To the battery socket.'), qty: 1, unit: 82.39 },
    deck: { name: B('משטח וארגזים', 'Deck and crates'), role: B('המטען שהרובוט נושא.', 'The load the robot carries.'), to: B('על המסגרת העליונה.', 'On the top frame.'), qty: 0, unit: 0 }
  };
  var ELECTRONICS = ['breaker', 'contactor', 'driver', 'buck', 'pico', 'radio', 'wire', 'xt90', 'ringterm'];

  /* ---------- the assembly, in order ---------- */
  var STEPS = [
    { id: 'rails', parts: ['profile', 'bracket', 'tnut', 'bolt'], title: B('מסילות תחתונות', 'Lower rails'), text: B('ארבע קורות לאורך הרובוט, שתיים בכל צד, עם מרווחים קצרים שמחזיקים כל זוג במרחק קבוע. על המסילות האלה יושבים המיסבים והמנועים.', 'Four beams along the robot, two on each side, with short spacers holding each pair at a fixed distance. The bearings and motors sit on these rails.') },
    { id: 'legs', parts: ['profile', 'bracket'], title: B('ארבע רגליים', 'Four legs'), text: B('קורה אנכית בכל פינה. הרגליים קובעות את גובה הרובוט, כלומר כמה מקום יש לצמחים מתחתיו.', 'A vertical beam at each corner. The legs set the robot\'s height, which is how much room the plants have underneath.') },
    { id: 'top', parts: ['profile', 'bracket'], title: B('מסגרת עליונה', 'Top frame'), text: B('מלבן שמחבר את הרגליים מלמעלה ויוצר את ה"גשר", ועליו יונחו הארגזים.', 'A rectangle that ties the legs together at the top and forms the "bridge". The crates will sit on it.') },
    { id: 'bearings', parts: ['bearing', 'tnut', 'bolt'], title: B('שמונה מיסבים', 'Eight bearings'), text: B('שני מיסבים לכל גלגל, מוברגים לתחתית המסילות. כששני המיסבים מרוחקים זה מזה, הם מחזיקים את הציר ישר גם תחת עומס.', 'Two bearings per wheel, bolted under the rails. Two bearings set apart hold the shaft straight even under load.') },
    { id: 'shafts', parts: ['shaft'], title: B('ארבעה צירים', 'Four shafts'), text: B('השחילו ציר דרך כל זוג מיסבים. הקצה החיצוני בולט החוצה, ועליו יורכב הגלגל.', 'Slide a shaft through each pair of bearings. The outer end sticks out, and the wheel will mount on it.') },
    { id: 'sprockets', parts: ['sp15', 'sp18', 'key'], title: B('גלגלי שיניים על הצירים', 'Sprockets on the shafts'), text: B('על כל ציר, בין שתי המסילות, יושב גלגל של 15 שיניים. על הצירים האחוריים מוסיפים גם גלגל של 18 שיניים. כל גלגל שיניים ננעל בשגם.', 'On each shaft, between the two rails: a 15-tooth sprocket. The rear shafts also get an 18-tooth sprocket. Each one is locked with a key.') },
    { id: 'wheels', parts: ['hub', 'wheel'], title: B('רכזות וגלגלים', 'Hubs and wheels'), text: B('הרכזת ננעלת על קצה הציר, והגלגל מוברג אליה בשלושה ברגים.', 'The hub locks on the end of the shaft, and the wheel bolts to it with three bolts.') },
    { id: 'motors', parts: ['motor', 'sp12', 'key'], title: B('שני מנועים', 'Two motors'), text: B('בכל צד יש מנוע שמוברג על המסילות, ליד הציר האחורי. על ציר המנוע יושב גלגל של 12 שיניים.', 'A motor on each side, bolted on the rails near the rear shaft. On the motor shaft: a 12-tooth sprocket.') },
    { id: 'chainS', parts: ['chain', 'masterlink'], title: B('שרשראות קצרות', 'Short chains'), text: B('מהמנוע (12 שיניים) אל הציר האחורי (18 שיניים). כל סיבוב וחצי של המנוע מסובבים את הגלגל פעם אחת.', 'From the motor (12 teeth) to the rear shaft (18 teeth). Every turn and a half of the motor turns the wheel once.') },
    { id: 'chainL', parts: ['chain', 'masterlink', 'idler'], title: B('שרשראות ארוכות וגלגלי מתיחה', 'Long chains and idlers'), text: B('מהציר האחורי אל הקדמי, עם 15 שיניים בשני הקצוות, כך ששני הגלגלים מסתובבים באותה מהירות. גלגל המתיחה מונע מהשרשרת להתרופף.', 'From the rear shaft to the front, 15 teeth at both ends, so both wheels turn at the same speed. The idler stops the chain going slack.') },
    { id: 'battery', parts: ['battery', 'estop', 'xt90'], title: B('מצבר ולחצן חירום', 'Battery and emergency stop'), text: B('המצבר יושב על מדף מתחת למסגרת העליונה, ולחצן החירום ממוקם במקום שקל להגיע אליו.', 'The battery sits on a shelf under the top frame. The emergency button is placed where it is easy to reach.') },
    { id: 'control', parts: ELECTRONICS, title: B('קופסת הבקרה', 'The control box'), text: B('כאן נמצאת כל האלקטרוניקה: המפסק, הממסר, ממיר המתח, ה-Pico, שני בקרי המנוע ומקלט השלט.', 'All the electronics live here: breaker, contactor, voltage converter, the Pico, both motor drivers and the remote receiver.') },
    { id: 'deck', parts: ['deck'], title: B('משטח וארגזים', 'Deck and crates'), text: B('המשטח והמטען. כך נראה הרובוט בזמן עבודה.', 'The deck and the load. This shows the robot at work.') }
  ];

  /* ---------- an open chain round two sprockets, in the x-y plane ---------- */
  function belt(c1, r1, c2, r2) {
    var dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
    var th = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / d)));
    var straight = Math.sqrt(Math.max(0, d * d - (r1 - r2) * (r1 - r2))), arc2 = r2 * 2 * th, arc1 = r1 * (2 * Math.PI - 2 * th);
    var len = 2 * straight + arc1 + arc2;
    var p1a = [c1[0] + r1 * Math.cos(a + th), c1[1] + r1 * Math.sin(a + th)], p2a = [c2[0] + r2 * Math.cos(a + th), c2[1] + r2 * Math.sin(a + th)];
    var p2b = [c2[0] + r2 * Math.cos(a - th), c2[1] + r2 * Math.sin(a - th)], p1b = [c1[0] + r1 * Math.cos(a - th), c1[1] + r1 * Math.sin(a - th)];
    function at(s) {
      s = ((s % len) + len) % len;
      var t, ang;
      if (s < straight) { t = s / straight; return [p1a[0] + (p2a[0] - p1a[0]) * t, p1a[1] + (p2a[1] - p1a[1]) * t, Math.atan2(p2a[1] - p1a[1], p2a[0] - p1a[0])]; }
      s -= straight;
      if (s < arc2) { ang = a + th - s / r2; return [c2[0] + r2 * Math.cos(ang), c2[1] + r2 * Math.sin(ang), ang - Math.PI / 2]; }
      s -= arc2;
      if (s < straight) { t = s / straight; return [p2b[0] + (p1b[0] - p2b[0]) * t, p2b[1] + (p1b[1] - p2b[1]) * t, Math.atan2(p1b[1] - p2b[1], p1b[0] - p2b[0])]; }
      s -= straight;
      ang = a - th - s / r1;
      return [c1[0] + r1 * Math.cos(ang), c1[1] + r1 * Math.sin(ang), ang - Math.PI / 2];
    }
    return { len: len, at: at, straight: straight, arc1: arc1, arc2: arc2 };
  }
  function links(len) { var n = Math.ceil(len / PITCH - 1e-6); return n % 2 ? n + 1 : n; }   // a chain closes on an even number of links

  /* ---------- everything that follows from the dimensions ---------- */
  function compute(d) {
    var o = { d: d, R: R };
    o.yRail = R + BEAR_H + 2;                 // centre of the lower rails
    o.zOut = d.W / 2 - 2; o.zIn = o.zOut - d.G;
    o.zWheel = d.W / 2 + 1.5 + TIRE_W / 2;
    o.z18 = o.zOut - 3.4; o.z15 = o.z18 - 3;  // sprocket planes, inside the rail gap
    o.legLen = d.H - 4 - (o.yRail + 2);
    o.spacer = d.G - 4; o.cross = d.W - 8;
    o.cuts = [
      { n: 6, len: d.L, what: B('קורות אורך: 4 מסילות ו-2 קורות עליונות', 'Long beams: 4 rails and 2 top') },
      { n: 4, len: o.legLen, what: B('רגליים', 'Legs') },
      { n: 2, len: o.cross, what: B('קורות רוחב עליונות', 'Top cross beams') },
      { n: 4, len: o.spacer, what: B('מרווחים בין המסילות', 'Rail spacers') }
    ];
    o.profile = o.cuts.reduce(function (a, c) { return a + c.n * c.len; }, 0);
    o.shaft = (o.zWheel + 2) - (o.zIn - 2.5);
    o.xr = -d.B / 2; o.xf = d.B / 2;
    o.xm = o.xr + 16; o.ym = o.yRail + 2 + 5.5;      // motor shaft
    o.r12 = pd(12) / 2; o.r15 = pd(15) / 2; o.r18 = pd(18) / 2;
    o.beltS = belt([o.xm, o.ym], o.r12, [o.xr, R], o.r18);
    o.beltL = belt([o.xr, R], o.r15, [o.xf, R], o.r15);
    o.linksS = links(o.beltS.len); o.linksL = links(o.beltL.len);
    o.chain = 2 * (o.linksS + o.linksL) * PITCH;
    o.wheelRpm = MOTOR_RPM * 12 / 18;
    o.kmh = o.wheelRpm / 60 * Math.PI * 2 * R / 100 * 3.6;
    o.clearRails = 2 * (o.zIn - 2);                    // free width between the inner rails
    o.clearMotors = 2 * (o.z18 - 19);                  // free width between the two motors
    o.clearH = d.H - 4 - 22;                           // free height under the battery
    o.track = 2 * o.zWheel;
    o.overallW = o.track + TIRE_W; o.overallL = Math.max(d.L, d.B + 2 * R);
    o.wheelGap = d.B - 2 * R;

    var ck = [], f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };
    function add(lvl, he, en) { ck.push({ lvl: lvl, t: B(he, en) }); }
    if (o.wheelGap < 3) add('err', 'הגלגל הקדמי והגלגל האחורי נוגעים זה בזה. הגדילו את המרחק בין הצירים.', 'The front and rear wheels touch. Increase the distance between the shafts.');
    if (d.B > d.L - 16) add('err', 'הצירים רחוקים מדי זה מזה ביחס לאורך המסילות, ולכן גלגלי השיניים פוגעים במרווחים שבקצוות. הקטינו את המרחק בין הצירים, או האריכו את הרובוט.', 'The shafts are too far apart for the rail length: the sprockets hit the spacers at the ends. Reduce the shaft distance or lengthen the robot.');
    if (o.legLen < 12) add('err', 'הרגליים קצרות מדי, ואין מקום למנועים ולמצבר. הגביהו את הרובוט.', 'The legs are too short: no room for the motors and battery. Raise the robot.');
    if (o.clearMotors < 30) add('warn', 'בין שני המנועים נשארים רק ' + f1(o.clearMotors) + ' ס"מ, וצמחים רחבים ייפגעו. הרחיבו את הרובוט.', 'Only ' + f1(o.clearMotors) + ' cm is left between the two motors. Wide plants will be hit. Widen the robot.');
    if (d.H / o.track > 0.95) add('warn', 'הרובוט גבוה וצר, ולכן כשהארגזים מלאים הוא עלול להתהפך בשיפוע או בפנייה חדה.', 'The robot is tall and narrow: with full crates it may tip over on a slope or in a sharp turn.');
    if (!ck.length) add('ok', 'המידות מתאימות: הגלגלים, גלגלי השיניים, המנועים והמצבר נכנסים בלי להתנגש זה בזה.', 'The dimensions work: the wheels, sprockets, motors and battery fit without hitting each other.');
    o.checks = ck;
    o.ok = !ck.some(function (c) { return c.lvl === 'err'; });
    return o;
  }

  /* ---------- the 3D model ---------- */
  function build(THREE, dims, opts) {
    var o = compute(dims), d = dims, groups = {}, spinners = [], chains = [];
    opts = opts || {};
    function M(color, metal, rough, extra) {
      var m = new THREE.MeshStandardMaterial({ color: color, metalness: metal, roughness: rough, side: THREE.DoubleSide });
      if (extra) for (var k in extra) m[k] = extra[k];
      return m;
    }
    var mat = {
      alu: M(0xc9ced3, 0.55, 0.42), slot: M(0x3a4247, 0.3, 0.7), steel: M(0xaab2b8, 0.8, 0.3), dark: M(0x2a3136, 0.5, 0.5),
      cast: M(0x2c4a5e, 0.35, 0.6), rubber: M(0x17191b, 0.0, 0.95), rim: M(0xbfc5ca, 0.7, 0.35), chain: M(0x6f777d, 0.8, 0.35),
      motor: M(0x1d2023, 0.4, 0.5), black: M(0x15171a, 0.1, 0.7), red: M(0xd9262c, 0.1, 0.5), yellow: M(0xf2c230, 0.1, 0.6),
      grey: M(0x7d868c, 0.2, 0.7), wood: M(0x9a7748, 0.0, 0.9), woodD: M(0x6e5332, 0.0, 0.9), green: M(0x3fb950, 0.0, 0.6), gold: M(0xd9b44a, 0.7, 0.4)
    };
    function grp(id) { var g = new THREE.Group(); g.userData.step = id; groups[id] = g; return g; }
    function mesh(geo, m, part, x, y, z) {
      var me = new THREE.Mesh(geo, m);
      me.position.set(x || 0, y || 0, z || 0);
      me.userData.part = part;
      return me;
    }
    function box(w, h, dp, m, part, x, y, z) { return mesh(new THREE.BoxGeometry(w, h, dp), m, part, x, y, z); }
    function cylZ(r, len, m, part, x, y, z, seg) { var c = mesh(new THREE.CylinderGeometry(r, r, len, seg || 24), m, part, x, y, z); c.rotation.x = Math.PI / 2; return c; }
    function cylX(r, len, m, part, x, y, z) { var c = mesh(new THREE.CylinderGeometry(r, r, len, 20), m, part, x, y, z); c.rotation.z = Math.PI / 2; return c; }

    /* a 4040 beam along x, y or z, with its four slots */
    function beam(len, axis, x, y, z) {
      var g = new THREE.Group();
      g.add(box(len, 4, 4, mat.alu, 'profile'));
      [[0, 2.01, 0, 0.9, 0.03], [0, -2.01, 0, 0.9, 0.03]].forEach(function (q) { g.add(box(len - 0.1, 0.03, 0.9, mat.slot, 'profile', 0, q[1], 0)); });
      g.add(box(len - 0.1, 0.9, 0.03, mat.slot, 'profile', 0, 0, 2.01));
      g.add(box(len - 0.1, 0.9, 0.03, mat.slot, 'profile', 0, 0, -2.01));
      if (axis === 'y') g.rotation.z = Math.PI / 2;
      if (axis === 'z') g.rotation.y = Math.PI / 2;
      g.position.set(x, y, z);
      return g;
    }
    var triShape = new THREE.Shape(); triShape.moveTo(0, 0); triShape.lineTo(3.6, 0); triShape.lineTo(0, 3.6); triShape.lineTo(0, 0);
    var triGeo = new THREE.ExtrudeGeometry(triShape, { depth: 3.4, bevelEnabled: false }); triGeo.translate(0, 0, -1.7);
    function bracket(x, y, z, sx, sy) { var b = mesh(triGeo, mat.grey, 'bracket', x, y, z); b.scale.set(sx, sy, 1); return b; }

    var sprGeo = {};
    function sprocketGeo(n) {
      if (sprGeo[n]) return sprGeo[n];
      var rp = pd(n) / 2, tip = rp + 0.32, root = rp - 0.42, s = new THREE.Shape(), step = 2 * Math.PI / n;
      for (var i = 0; i < n; i++) {
        var a = i * step, pts = [[root, a - step * 0.30], [tip, a - step * 0.12], [tip, a + step * 0.12], [root, a + step * 0.30]];
        pts.forEach(function (p, k) { var X = p[0] * Math.cos(p[1]), Y = p[0] * Math.sin(p[1]); if (i === 0 && k === 0) s.moveTo(X, Y); else s.lineTo(X, Y); });
      }
      s.closePath();
      var hole = new THREE.Path(); hole.absarc(0, 0, 1.0, 0, Math.PI * 2, true); s.holes.push(hole);
      var g = new THREE.ExtrudeGeometry(s, { depth: 0.72, bevelEnabled: false, curveSegments: 12 }); g.translate(0, 0, -0.36);
      return (sprGeo[n] = g);
    }
    function sprocket(n, part, x, y, z, ratio) {
      var g = new THREE.Group();
      g.add(mesh(sprocketGeo(n), mat.dark, part));
      g.add(cylZ(1.9, 2.0, mat.dark, part, 0, 0, 0));
      g.position.set(x, y, z);
      spinners.push({ obj: g, ratio: ratio });
      return g;
    }
    function chain(b, z, rDrive, n) {
      var im = new THREE.InstancedMesh(new THREE.BoxGeometry(1.05, 0.5, 0.9), mat.chain, n), dummy = new THREE.Object3D();
      im.userData.part = 'chain';
      function place(off) {
        for (var i = 0; i < n; i++) {
          var p = b.at(off + i * b.len / n);
          dummy.position.set(p[0], p[1], z); dummy.rotation.set(0, 0, p[2]); dummy.scale.set(1, 1, i % 2 ? 1 : 0.62); dummy.updateMatrix();
          im.setMatrixAt(i, dummy.matrix);
        }
        im.instanceMatrix.needsUpdate = true;
      }
      place(0);
      chains.push({ place: place, r: rDrive });
      return im;
    }

    var sides = [1, -1], ends = [1, -1], xEnd = d.L / 2 - 2;

    /* 1. lower rails */
    var g = grp('rails');
    sides.forEach(function (s) {
      g.add(beam(d.L, 'x', 0, o.yRail, s * o.zOut)); g.add(beam(d.L, 'x', 0, o.yRail, s * o.zIn));
      ends.forEach(function (e) { g.add(beam(o.spacer, 'z', e * xEnd, o.yRail, s * (o.zOut + o.zIn) / 2)); });
    });

    /* 2. legs */
    g = grp('legs');
    sides.forEach(function (s) {
      ends.forEach(function (e) {
        g.add(beam(o.legLen, 'y', e * xEnd, o.yRail + 2 + o.legLen / 2, s * o.zOut));
        g.add(bracket(e * (xEnd - 2), o.yRail + 2, s * o.zOut, -e, 1));
      });
    });

    /* 3. top frame */
    g = grp('top');
    sides.forEach(function (s) {
      g.add(beam(d.L, 'x', 0, d.H - 2, s * o.zOut));
      ends.forEach(function (e) { g.add(bracket(e * (xEnd - 2), d.H - 4, s * o.zOut, -e, -1)); });
    });
    ends.forEach(function (e) { g.add(beam(o.cross, 'z', e * xEnd, d.H - 2, 0)); });

    /* 4. bearings */
    g = grp('bearings');
    var axles = [o.xr, o.xf];
    sides.forEach(function (s) {
      axles.forEach(function (xa) {
        [o.zOut, o.zIn].forEach(function (zr) {
          var bz = s * zr;
          g.add(box(12.7, 1.4, 3.8, mat.cast, 'bearing', xa, R + BEAR_H - 0.7, bz));
          g.add(box(6.4, BEAR_H, 3.4, mat.cast, 'bearing', xa, R + BEAR_H / 2, bz));
          g.add(cylZ(3.3, 3.2, mat.cast, 'bearing', xa, R, bz));
          g.add(cylZ(2.0, 3.5, mat.steel, 'bearing', xa, R, bz));
          [-4.8, 4.8].forEach(function (bx) { g.add(mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 6), mat.steel, 'bolt', xa + bx, R + BEAR_H - 1.7, bz)); });
        });
      });
    });

    /* 5. shafts */
    g = grp('shafts');
    sides.forEach(function (s) {
      axles.forEach(function (xa) {
        var sh = cylZ(1.0, o.shaft, mat.steel, 'shaft', xa, R, s * ((o.zIn - 2.5) + o.shaft / 2), 20);
        spinners.push({ obj: sh, ratio: 1, axis: 'y', sign: -1 }); g.add(sh);
      });
    });

    /* 6. sprockets on the shafts */
    g = grp('sprockets');
    sides.forEach(function (s) {
      g.add(sprocket(15, 'sp15', o.xr, R, s * o.z15, 1)); g.add(sprocket(15, 'sp15', o.xf, R, s * o.z15, 1));
      g.add(sprocket(18, 'sp18', o.xr, R, s * o.z18, 1));
    });

    /* 7. hubs and wheels */
    g = grp('wheels');
    var tirePts = [[8.6, -6.2], [10.5, -6.9], [R - 2.2, -7.25], [R - 0.5, -6], [R, -3.5], [R, 3.5], [R - 0.5, 6], [R - 2.2, 7.25], [10.5, 6.9], [8.6, 6.2]]
      .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var tireGeo = new THREE.LatheGeometry(tirePts, 40); tireGeo.rotateX(Math.PI / 2);
    var knobGeo = new THREE.BoxGeometry(2.4, 1.3, 3.4);
    sides.forEach(function (s) {
      axles.forEach(function (xa) {
        var w = new THREE.Group();
        w.add(mesh(tireGeo, mat.rubber, 'wheel'));
        w.add(cylZ(8.8, 11.5, mat.rim, 'wheel', 0, 0, 0, 32));
        w.add(cylZ(6.2, 11.9, mat.dark, 'wheel', 0, 0, 0, 32));
        w.add(cylZ(4.6, 1.6, mat.steel, 'hub', 0, 0, s * 6.4));
        w.add(cylZ(2.2, 5, mat.steel, 'hub', 0, 0, -s * 3.6));
        for (var b3 = 0; b3 < 3; b3++) w.add(cylZ(0.55, 0.8, mat.dark, 'hub', 3.1 * Math.cos(b3 * 2.094), 3.1 * Math.sin(b3 * 2.094), s * 7.3, 6));
        var kn = new THREE.InstancedMesh(knobGeo, mat.rubber, 44), dm = new THREE.Object3D();
        for (var i = 0; i < 44; i++) {
          var a = i / 22 * Math.PI * 2 + (i >= 22 ? 0.143 : 0);
          dm.position.set((R + 0.35) * Math.cos(a), (R + 0.35) * Math.sin(a), i >= 22 ? 3.1 : -3.1); dm.rotation.set(0, 0, a + Math.PI / 2 + (i >= 22 ? 0.35 : -0.35)); dm.updateMatrix();
          kn.setMatrixAt(i, dm.matrix);
        }
        kn.userData.part = 'wheel'; w.add(kn);
        w.position.set(xa, R, s * o.zWheel);
        spinners.push({ obj: w, ratio: 1 });
        g.add(w);
      });
    });

    /* 8. motors */
    g = grp('motors');
    sides.forEach(function (s) {
      var zp = s * o.z18;
      g.add(box(13, 0.6, d.G + 4, mat.grey, 'motor', o.xm, o.yRail + 2.3, s * (o.zOut + o.zIn) / 2));
      g.add(box(9.5, 9.5, 5, mat.motor, 'motor', o.xm, o.ym, zp - s * 4.5));
      g.add(cylZ(4.9, 11, mat.motor, 'motor', o.xm, o.ym, zp - s * 12.5, 28));
      g.add(cylZ(5.05, 1.2, mat.steel, 'motor', o.xm, o.ym, zp - s * 18.4, 28));
      g.add(cylZ(0.85, 4, mat.steel, 'motor', o.xm, o.ym, zp - s * 0.5));
      g.add(sprocket(12, 'sp12', o.xm, o.ym, zp, 1.5));
    });

    /* 9 and 10. chains, idlers */
    g = grp('chainS');
    sides.forEach(function (s) { g.add(chain(o.beltS, s * o.z18, o.r18, o.linksS)); });
    g = grp('chainL');
    sides.forEach(function (s) {
      g.add(chain(o.beltL, s * o.z15, o.r15, o.linksL));
      var yi = R - o.r15 - 0.45 - pd(12) / 2;
      g.add(sprocket(12, 'idler', 0, yi, s * o.z15, -o.r15 / (pd(12) / 2)));
      g.add(box(1.2, o.yRail - 2 - yi + 1, 0.6, mat.grey, 'idler', 0, (o.yRail - 2 + yi) / 2, s * (o.z15 - 1.4)));
    });

    /* 11. battery, emergency stop */
    g = grp('battery');
    var bx = xEnd - 2 - 9.5, by = d.H - 4 - 11;
    g.add(box(17, 20, 25, mat.black, 'battery', bx, by, 0));
    g.add(box(18, 2.4, 26, mat.motor, 'battery', bx, by + 9.4, 0));
    g.add(box(4, 1.4, 12, mat.motor, 'battery', bx, by + 11, 0));
    g.add(box(19, 0.5, 27, mat.grey, 'battery', bx, by - 10.3, 0));
    [-11, 11].forEach(function (z) { g.add(box(0.5, 21, 3, mat.grey, 'battery', bx + 9.3, by + 0.2, z)); });
    g.add(cylX(2.4, 1.0, mat.yellow, 'estop', bx - 9, by + 2, 0));
    g.add(cylX(1.9, 1.8, mat.red, 'estop', bx - 10.2, by + 2, 0));
    g.add(box(2, 1.2, 3, mat.yellow, 'xt90', bx - 3, by + 11.2, 9));

    /* 12. control box */
    g = grp('control');
    var cx = -(xEnd - 2 - 8), cy = d.H - 4 - 7;
    g.add(box(15, 12, 24, mat.grey, 'control', cx, cy, 0));
    g.add(box(15.6, 1, 24.6, mat.dark, 'control', cx, cy + 6, 0));
    [-10, 10].forEach(function (z) { g.add(box(0.5, 13, 3, mat.grey, 'control', cx - 7.8, cy + 0.4, z)); });
    g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 9, 6), mat.black, 'radio', cx + 4, cy + 11, 8));
    g.add(mesh(new THREE.SphereGeometry(0.6, 10, 8), mat.green, 'pico', cx + 7.7, cy + 2, -6));
    g.add(box(0.4, 3.5, 5, mat.black, 'breaker', cx + 7.7, cy, 4));

    /* 13. deck and crates */
    g = grp('deck');
    var slats = Math.max(3, Math.floor(d.L / 9));
    for (var i = 0; i < slats; i++) g.add(box(6.5, 0.8, d.W, mat.alu, 'deck', -d.L / 2 + 3.25 + i * (d.L - 6.5) / (slats - 1), d.H + 0.4, 0));
    var cw = Math.min(36, d.W / 2 - 3), cl = Math.min(46, d.L - 6);
    [-1, 1].forEach(function (s) {
      var c = new THREE.Group();
      for (var k = 0; k < 3; k++) {
        c.add(box(cl, 5.4, 1, mat.wood, 'deck', 0, 3 + k * 6.6, cw / 2)); c.add(box(cl, 5.4, 1, mat.wood, 'deck', 0, 3 + k * 6.6, -cw / 2));
        c.add(box(1, 5.4, cw, mat.wood, 'deck', cl / 2, 3 + k * 6.6, 0)); c.add(box(1, 5.4, cw, mat.wood, 'deck', -cl / 2, 3 + k * 6.6, 0));
      }
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { c.add(box(2.2, 20, 2.2, mat.woodD, 'deck', q[0] * (cl / 2 - 1.4), 10, q[1] * (cw / 2 - 1.4))); });
      c.add(box(cl, 0.8, cw, mat.woodD, 'deck', 0, 0.4, 0));
      c.position.set(0, d.H + 0.8, s * (cw / 2 + 1.5));
      g.add(c);
    });

    /* which way each group moves in the exploded view */
    var explode = { rails: [0, 22, 0], legs: [0, 58, 0], top: [0, 92, 0], bearings: [0, 11, 0], shafts: [0, 0, 0], sprockets: [0, 0, 0], wheels: [0, 0, 0],
      motors: [0, 44, 0], chainS: [0, 33, 0], chainL: [0, 0, 0], battery: [40, 74, 0], control: [-40, 74, 0], deck: [0, 124, 0] };
        function setExplode(f) {
      Object.keys(groups).forEach(function (id) { var e = explode[id] || [0, 0, 0]; groups[id].userData.home = [e[0] * f, e[1] * f, e[2] * f]; });
    }
    setExplode(0);

    function spin(theta) {
      spinners.forEach(function (sp) {
        if (sp.axis === 'y') sp.obj.rotation.y = -theta * sp.ratio * (sp.sign || 1);   // a cylinder laid along z turns about its own y
        else sp.obj.rotation.z = -theta * sp.ratio;
      });
      chains.forEach(function (c) { c.place(theta * c.r); });
    }
    function dispose() {
      Object.keys(groups).forEach(function (id) {
        groups[id].traverse(function (n) { if (n.geometry && n.geometry !== triGeo) n.geometry.dispose(); });
      });
      Object.keys(mat).forEach(function (k) { mat[k].dispose(); });
    }
    return { o: o, groups: groups, spin: spin, setExplode: setExplode, dispose: dispose };
  }

  P.robot = { PARTS: PARTS, STEPS: STEPS, ELECTRONICS: ELECTRONICS, DEFAULTS: DEFAULTS, LIMITS: LIMITS, compute: compute, build: build, R: R,
    PITCH: PITCH, BEAR_H: BEAR_H, TIRE_W: TIRE_W, MOTOR_RPM: MOTOR_RPM, pd: pd, belt: belt, links: links };
})(window.PICO);
