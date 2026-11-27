/* The free-build workshop: the page around the 3D editor.
   `store` holds the design, the selection and the active tool; every edit
   passes through robotDesign.attempt, which refuses what cannot exist.
   Panels: parts (palette + the selected part), what is missing, drive train,
   lists (parts, cutting, weight), saving. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };
  var L = {
    lead: B('קחו חלקים מהארגז, הניחו אותם על המודל וחברו אותם. כל חלק מתחבר רק למקום שבו הוא באמת מתאים: מיסב לחריץ של פרופיל, ציר למיסב, גלגל שיניים לציר. זה מודל להמחשה: הוא בודק שהחלקים מתחברים ונכנסים למקומם, אבל לא שהם חזקים מספיק.',
      'Take parts from the box, put them on the model and join them. Each part only goes where it really fits: a bearing on a profile slot, a shaft in a bearing, a sprocket on a shaft. This is a concept model: it checks that parts fit and connect, not that they are strong enough.'),
    tabs: { checks: B('מה חסר', 'What is missing'), drive: B('תמסורת', 'Drive train'), lists: B('רשימות', 'Lists'), save: B('תכנונים', 'Designs') },
    box: B('ארגז חלקים', 'Parts box'), boxTip: B('גררו חלק אל המודל', 'Drag a part onto the model'), guided: B('מדריך שלב אחר שלב', 'Step-by-step guide'),
    home: B('מבט כללי', 'Overview'), zin: B('קירוב', 'Zoom in'), zout: B('הרחקה', 'Zoom out'),
    cube: { px: B('חזית', 'Front'), nx: B('גב', 'Back'), pz: B('צד', 'Side'), nz: B('צד', 'Side'), py: B('מעל', 'Top'), ny: B('מתחת', 'Under') },
    rot: B('סיבוב ב-90°', 'Turn 90°'), rotAx: [B('סביב X', 'about X'), B('סביב Y (אנכי)', 'about Y (upright)'), B('סביב Z', 'about Z')], rotProf: B('סביב הפרופיל', 'around the profile'),
    mirrorS: B('שיקוף', 'Mirror'), dropS: B('לקרקע', 'To ground'), runS: B('מנועים', 'Motors'),
    dragTip: B('שחררו את החלק על נקודה ירוקה.', 'Let go of the part on a green spot.'),
    groups: { frame: B('שלדה', 'Frame'), drive: B('הנעה', 'Drive'), power: B('כוח ובקרה', 'Power and control'), load: B('מטען', 'Load') },
    undo: B('בטלו', 'Undo'), redo: B('בצעו שוב', 'Redo'), run: B('הפעלת מנועים', 'Run the motors'), bed: B('ערוגה', 'Crop bed'), measure: B('מדידה', 'Measure'),
    drop: B('הנמיכו לקרקע', 'Drop to ground'), mirror: B('שיקוף לצד השני', 'Mirror to the other side'),
    views: { iso: B('מבט כללי', 'Overview'), front: B('חזית', 'Front'), side: B('צד', 'Side'), top: B('מעל', 'Top') },
    idle: B('גררו חלק מהארגז אל המודל, או לחצו על חלק כדי לבחור אותו. החזיקו את המקש הימני כדי לסובב את המבט, החזיקו את הגלגלת כדי להזיז אותו, וגללו כדי לקרב ולהרחיק.', 'Drag a part from the box onto the model, or click a part to select it. Hold the right button to turn the view, hold the wheel to move it, scroll to zoom.'),
    selTip: B('החצים הישרים מזיזים את החלק, והחצים המעוגלים מסובבים אותו ב-90°. אפשר גם להקליד ערך מדויק בלוח.', 'Straight arrows move the part, curved arrows turn it 90°. You can also type an exact value in the panel.'),
    tool: {
      profile: B('לחצו על הקרקע, או על פאה של פרופיל אחר. המקש R מחליף את הכיוון.', 'Click the ground, or a face of another profile. The R key changes direction.'),
      bracket: B('לחצו על פרופיל, ליד פינה שבה הוא נוגע בפרופיל אחר.', 'Click a profile near a corner where it touches another profile.'),
      bearing: B('לחצו על פאה של פרופיל. הקדח של המיסב יהיה ניצב לפרופיל.', 'Click a face of a profile. The bearing bore lies across the profile.'),
      shaft: B('לחצו על מיסב, והציר יושחל דרכו. אפשר ללחוץ גם על מצמד שמותקן על מנוע.', 'Click a bearing, and the shaft slides through it. A coupling on a motor works too.'),
      sprocket: B('לחצו על ציר, או על מנוע.', 'Click a shaft, or a motor.'),
      wheel: B('לחצו על ציר, ליד הקצה שעליו יורכב הגלגל.', 'Click a shaft, near the end where the wheel goes.'),
      motor: B('לחצו על פאה של פרופיל.', 'Click a face of a profile.'),
      chain: B('לחצו על גלגל שיניים אחד, ואז על השני.', 'Click one sprocket, then the other.'),
      coupling: B('שחררו אותו על מנוע, והמצמד יתלבש על הציר שלו, ואז אפשר לגרור אליו ציר. אפשר גם לשחרר אותו על ציר, ואז המנוע הקרוב ביותר יוזז ויוגבה כדי להתיישר מולו.', 'Drop it on a motor: the coupling goes on its shaft, and a shaft can then be dragged onto it. Or drop it on a shaft: the nearest motor is moved and raised to line up with it.'),
      coupling2: B('עכשיו לחצו על החלק השני, ציר או מנוע. הציר חייב לשבת על מיסבים משלו.', 'Now click the other part: a shaft or a motor. The shaft must sit on bearings of its own.'),
      chain2: B('עכשיו לחצו על גלגל השיניים השני. הוא חייב להיות באותו מישור כמו הראשון.', 'Now click the second sprocket. It must be in the same plane.'),
      idler: B('לחצו על שרשרת.', 'Click a chain.'),
      battery: B('לחצו על פאה של פרופיל.', 'Click a face of a profile.'), control: B('לחצו על פאה של פרופיל.', 'Click a face of a profile.'), estop: B('לחצו על פאה של פרופיל, במקום שקל להגיע אליו.', 'Click a face of a profile, somewhere easy to reach.'),
      deck: B('לחצו על הפאה העליונה של פרופיל.', 'Click the top face of a profile.'),
      cube: B('לחצו על הקרקע, או על פאה של פרופיל. לקובייה יש פאה לכל כיוון, ואליה מתחברים קצוות של פרופילים.', 'Click the ground, or a face of a profile. The cube has a face in every direction, for the ends of profiles.'),
      plate: B('לחצו על פאה של פרופיל. אחר כך אפשר להרכיב על הפלטה מנוע, מיסבים, מצבר או גלגל מסתובב.', 'Click a face of a profile. Then a motor, bearings, a battery or a caster can mount on the plate.'),
      caster: B('לחצו על הפאה התחתונה של פרופיל או של פלטה.', 'Click the bottom face of a profile or a plate.'),
      measure: B('לחצו על שתי נקודות כדי למדוד את המרחק ביניהן.', 'Click two points to measure the distance between them.')
    },
    coupInfo: B('המצמד מחבר את ציר המנוע לציר אחר, וכך הציר מסתובב בדיוק במהירות של המנוע (1:1). הציר חייב לשבת על שני מיסבים משלו, כדי שהמשקל והמשיכה של השרשראות לא יעמיסו על המנוע.', 'The coupling joins the motor shaft to the shaft: the shaft turns at exactly the motor speed (1:1). The shaft must sit on two bearings of its own, so the weight and the chain pull do not fall on the motor.'),
    coupW: B('מצמד', 'coupling'),
    stop: B('סיימו להניח (Esc)', 'Stop placing (Esc)'),
    opt: { sec: B('חתך', 'Section'), wide: B('הצד הרחב', 'Wide side'), wheelD: B('קוטר הגלגל', 'Wheel size'), model: B('דגם', 'Model'), casterD: B('גודל הגלגל', 'Wheel size'), la: B('אורך לאורך הפרופיל', 'Length along the profile'), lt: B('רוחב', 'Width'), len: B('אורך', 'Length'), dir: B('כיוון', 'Direction'), teeth: B('שיניים', 'Teeth'), lx: B('אורך', 'Length'), lz: B('רוחב', 'Width'), crates: B('ארגזים', 'Crates') },
    dirs: { x: B('לאורך', 'Along'), z: B('לרוחב', 'Across'), y: B('אנכי', 'Upright') },
    wides: { x: B('קדימה', 'Forward'), y: B('למעלה', 'Up'), z: B('הצידה', 'Sideways') }, inch: B('אינץ\x27', 'in'),
    used: B('בשימוש', 'used'), ofTable: B('בטבלה', 'in the table'),
    startH: B('נקודת התחלה', 'Where to start'), startEmpty: B('במה ריקה', 'Empty stage'), startFrame: B('שלדה בסיסית', 'Basic frame'), startRobot: B('הרובוט לדוגמה', 'The example robot'),
    tipsH: B('איך מתחילים', 'How to start'),
    tips: [B('גררו "פרופיל אלומיניום" מהארגז אל הקרקע, ובחרו את החתך שלו. אחרי שהוא מונח, אפשר לשנות בלוח את האורך ואת הכיוון שלו.', 'Drag an "Aluminium profile" from the box onto the ground, and choose its section. Its length and direction are changed in the panel once it is down.'),
      B('לחצו על הפרופיל, והרימו אותו בעזרת החץ הירוק. הגלגלים צריכים מקום מתחתיו.', 'Click the profile and lift it with the green arrow. The wheels need room under it.'),
      B('הוסיפו מיסבים, צירים, גלגלי שיניים, גלגלים ומנוע. כדי להגיע לצד התחתון של פרופיל, סובבו את המבט אל מתחת לרצפה.', 'Add bearings, shafts, sprockets, wheels and a motor. To reach the underside of a profile, turn the view to below the floor.'),
      B('בנו צד אחד של הרובוט, ואז לחצו על "שיקוף לצד השני". בסוף, לחצו על "הנמך לקרקע".', 'Build one side of the robot, then press "Mirror to the other side". At the end press "Drop to ground".')],
    startNote: B('טעינה של נקודת התחלה מחליפה את כל מה שנמצא על הבמה. הכפתור "בטלו" מחזיר את המצב הקודם.', 'Loading a starting point replaces what is on the stage. "Undo" brings it back.'),
    selH: B('החלק שנבחר', 'The selected part'), none: B('לא נבחר חלק.', 'No part is selected.'),
    f: { len: B('אורך', 'Length'), x: B('מיקום X (קדימה)', 'Position X (forward)'), y: B('מיקום Y (גובה)', 'Position Y (height)'), z: B('מיקום Z (הצידה)', 'Position Z (across)'),
      s: B('מיקום לאורך הפרופיל', 'Position along the profile'), sShaft: B('החלקה דרך המיסב', 'Slide through the bearing'), sSpr: B('מיקום על הציר', 'Position on the shaft'),
      n: B('מספר שיניים', 'Tooth count'), lift: B('הגבהה בפלטות', 'Raised on plates'), u: B('הזזה הצידה', 'Sideways shift'), v: B('הזזה לרוחב הפאה', 'Shift across the face'), lx: B('אורך', 'Length'), lz: B('רוחב', 'Width'), crates: B('ארגזים', 'Crates') },
    face: B('על איזו פאה', 'Which face'), faces: { '+y': B('למעלה', 'Top'), '-y': B('למטה', 'Bottom'), '+x': B('קדימה', 'Front'), '-x': B('אחורה', 'Back'), '+z': B('צד Z+', 'Side Z+'), '-z': B('צד Z−', 'Side Z−') },
    flip: B('הפכו כיוון', 'Flip direction'), turn: B('סובב ב-90°', 'Turn 90°'), otherEnd: B('העבר לקצה השני', 'Move to the other end'), otherSpan: B('העבר לצד השני של השרשרת', 'Move to the other run of the chain'),
    del: B('מחקו', 'Delete'), dup: B('הנח עוד אחד כזה', 'Place another like it'), tension: B('מתח את השרשרת', 'Tension the chain'),
    delAsk: B('חלקים נוספים תלויים בחלק הזה, והם יימחקו יחד איתו', 'more parts hang on this one and will be deleted with it'), delAll: B('מחקו הכול', 'Delete them all'), cancel: B('ביטול', 'Cancel'),
    pitch: B('קוטר חלוקה', 'Pitch diameter'), links: B('חוליות', 'links'), slack: B('רפיון', 'Slack'), ratio: B('יחס', 'Ratio'), chainLen: B('אורך', 'Length'),
    tensionNo: B('אין מנוע בשרשרת הזאת. הזיזו את אחד הצירים, או הוסיפו גלגל מתיחה.', 'There is no motor on this chain. Move one of the shafts, or add an idler.'),
    cm: B('ס"מ', 'cm'), mm: B('מ"מ', 'mm'),
    missionsH: B('משימות', 'Missions'), problemsH: B('בעיות בתכנון', 'Problems in the design'), allGood: B('אין בעיות. כל מה שנמצא על הבמה מחובר כמו שצריך.', 'No problems. Everything on the stage is joined properly.'),
    emptyStage: B('הבמה ריקה. התחילו בהנחת פרופיל ראשון מארגז החלקים.', 'The stage is empty. Start with a first profile from the parts box.'),
    show: B('הציגו', 'Show'),
    driveH: B('מה מסובב את מה', 'What turns what'), driveLead: B('התוכנה עוקבת אחרי השרשראות מכל מנוע, ומחשבת באיזו מהירות מסתובב כל ציר. שרשרת שעוברת מגלגל של N1 שיניים לגלגל של N2 שיניים מכפילה את המהירות ב-N1/N2, ואת המומנט ב-N2/N1.', 'The program walks from each motor through the chains and works out how fast each shaft turns. A chain from an N1-tooth sprocket to an N2-tooth one multiplies the speed by N1/N2, and the torque by N2/N1.'),
    noMotor: B('עדיין אין מנוע. הניחו מנוע על פרופיל, הרכיבו גלגל שיניים על הציר שלו, וחברו אותו בשרשרת לציר.', 'There is no motor yet. Put a motor on a profile, a sprocket on its shaft, and chain it to a shaft.'),
    motor: B('מנוע', 'Motor'), shaft: B('ציר', 'Shaft'), rpm: B('סל"ד', 'rpm'), torque: B('מומנט', 'torque'), wheelsN: B('גלגלים', 'wheels'), kmh: B('קמ"ש', 'km/h'),
    chainW: B('שרשרת', 'chain'), noChain: B('בלי שרשרת', 'no chain'), undriven: B('צירים שאינם מקבלים הנעה', 'Shafts that are not driven'),
    resH: B('תוצאה', 'Result'), perMotor: B('לכל מנוע', 'Per motor'), speed: B('מהירות נסיעה', 'Driving speed'), push: B('כוח דחיפה אידאלי', 'Ideal pushing force'), wheelTq: B('מומנט בגלגלים', 'Torque at the wheels'),
    pushNote: B('כוח הדחיפה מחושב כהספק של המנוע חלקי המהירות, בלי הפסדים ובלי החלקה. במציאות הוא נמוך יותר.', 'The pushing force is the motor power divided by the speed, with no losses and no slipping. In reality it is lower.'),
    bomH: B('רשימת חלקים', 'Parts list'), part: B('חלק', 'Part'), usedC: B('כמות', 'Quantity'),
    cutsH: B('רשימת חיתוך לפרופיל', 'Cutting list for the profile'), pieces: B('יח\'', 'pcs'), total: B('סה"כ', 'Total'),
    chainsH: B('שרשראות', 'Chains'), weightH: B('משקל משוער', 'Estimated weight'), kg: B('ק"ג', 'kg'), weightNote: B('החישוב מבוסס על משקל טיפוסי של כל חלק, בלי המטען. זו הערכה בלבד.', 'From a typical weight for each part, without the load. This is an estimate.'),
    comH: B('גובה מרכז הכובד', 'Height of the centre of gravity'),
    sheet: B('דף בנייה להדפסה', 'Build sheet for printing'), print: B('הדפיסו', 'Print'), close: B('סגרו', 'Close'), sheetH: B('דף בנייה: רובוט סבל חקלאי', 'Build sheet: farm carrier robot'),
    sheetNote: B('זה מודל להמחשה. המידות של החלקים הקנויים הן הנחות, ולכן אמתו אותן מול החלקים עצמם לפני שאתם חותכים.', 'A concept model. The sizes of bought parts are assumptions: check them against the real parts before cutting.'),
    saveH: B('התכנונים שלי', 'My designs'), saveLead: B('התכנון נשמר מעצמו בדפדפן הזה. כאן אפשר לשמור כמה תכנונים, כל אחד בשם משלו, ולהעביר תכנון למחשב אחר כקובץ.', 'The design saves itself in this browser. Here you can keep several designs by name, and move a design to another computer as a file.'),
    name: B('שם התכנון', 'Design name'), saveAs: B('שמרו', 'Save'), load: B('פתחו', 'Open'), noSaved: B('עדיין לא נשמרו תכנונים.', 'No designs saved yet.'),
    exp: B('ייצוא לקובץ', 'Export to a file'), imp: B('ייבוא מקובץ', 'Import from a file'), badFile: B('הקובץ הזה אינו תכנון של רובוט.', 'That file is not a robot design.'),
    saved: B('נשמר.', 'Saved.'), measured: B('מרחק לפי צירים', 'Distance by axis'),
    mirrorNone: B('אין מה לשקף. בנו חלקים בצד אחד של הקו האדום שבאמצע.', 'Nothing to mirror: build parts on one side of the red centre line.'),
    loading: B('טוען את התצוגה התלת-ממדית...', 'Loading the 3D view...'),
    noThree: B('התצוגה התלת-ממדית לא נטענה. בפעם הראשונה היא צריכה חיבור לאינטרנט, או את הקובץ three.min.js שבתיקייה js/vendor.', 'The 3D view did not load. It needs an internet connection the first time, or the file three.min.js in the folder js/vendor.')
  };
  var PALETTE = [
    ['frame', 'profile', B('פרופיל אלומיניום', 'Aluminium profile')], ['frame', 'bracket', B('זווית 90°', 'Corner bracket')], ['frame', 'cube', B('קוביית פינה', 'Corner cube')], ['frame', 'plate', B('פלטה', 'Plate')],
    ['drive', 'bearing', B('מיסב UCP204', 'UCP204 bearing')], ['drive', 'shaft', B('ציר 20 מ"מ', '20 mm shaft')], ['drive', 'sprocket', B('גלגל שיניים', 'Sprocket')],
    ['drive', 'wheel', B('רכזת וגלגל', 'Hub and wheel')], ['drive', 'caster', B('גלגל מסתובב', 'Caster')], ['drive', 'motor', B('מנוע', 'Motor')], ['drive', 'coupling', B('מצמד', 'Coupling')],['drive', 'chain', B('שרשרת', 'Chain')], ['drive', 'idler', B('גלגל מתיחה', 'Idler')],
    ['power', 'battery', B('מצבר', 'Battery')], ['power', 'control', B('קופסת בקרה', 'Control box')], ['power', 'estop', B('לחצן חירום', 'Emergency stop')],
    ['load', 'deck', B('משטח וארגזים', 'Deck and crates')]
  ];
  var INFO = { profile: 'profile', bracket: 'bracket', bearing: 'bearing', shaft: 'shaft', wheel: 'wheel', motor: 'motor', chain: 'chain', idler: 'idler', battery: 'battery', estop: 'estop', deck: 'deck' };
  var XINFO = {
    cube: { role: B('מחברת עד שישה קצוות של פרופילים בפינה אחת, בלי זוויות.', 'Joins up to six profile ends at one corner, with no brackets.'), to: B('קצה של פרופיל נלחץ על כל פאה שלה, וברג אחד נכנס דרך המרכז.', 'A profile end presses on each face, with one bolt through the middle.') },
    plate: { role: B('משטח שטוח שאפשר להבריג אליו כל חלק, גם במקום שאין בו פרופיל.', 'A flat surface any part can bolt onto, even where there is no profile.'), to: B('מוברגת לפאה של פרופיל באומי פטיש, וחלקים מוברגים לצד החיצוני שלה.', 'Bolts to a profile face with T-nuts, and parts bolt to its outer face.') },
    caster: { role: B('גלגל חופשי שמסתובב לכל כיוון. כך אפשר לבנות רובוט עם שני גלגלים מונעים ותמיכה שלישית.', 'A free wheel that turns any way. With it a robot can have two driven wheels and a third support.'), to: B('מוברג לפאה התחתונה של פרופיל או של פלטה. הגובה שלו חייב להתאים לגובה של שאר הגלגלים.', 'Bolts to the bottom face of a profile or a plate. Its height must match the other wheels.') }
  };

  /* a small picture of every part for the parts box, drawn once with the same models the editor uses */
  var THUMBS = null;
  function makeThumbs(THREE) {
    if (THUMBS) return;
    THUMBS = {};
    try {
      var D = P.robotDesign, S = 160, r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }), kit = P.robotKit(THREE);
      r.setSize(S, S, false);
      if (THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
      var d = D.template(P.robot.DEFAULTS), A = D.analyse(d), pick = {}, small = D.newDesign();
      D.push(small, { type: 'profile', p: [0, 2, 0], ax: 'x', len: 26 });
      D.push(small, { type: 'deck', p: [0, 4, 0], lx: 50, lz: 44, crates: 1 });
      var As = D.analyse(small);
      d.parts.forEach(function (p) { var g = A.G[p.id]; if (!g.bad && !pick[p.type]) pick[p.type] = g; });
      pick.profile = As.G[small.parts[0].id]; pick.deck = As.G[small.parts[1].id];
      pick.coupling = { id: 'thumb', type: 'coupling', part: {}, c: [0, 0, 0], axis: 2, out: 1, motor: null };
      var more = D.newDesign(), mp = D.push(more, { type: 'profile', p: [0, 30, 0], ax: 'x', len: 30 });
      var mPlate = D.push(more, { type: 'plate', on: { id: mp, f: '+y', s: 0 }, la: 20, lt: 16, v: 0 }), mCaster = D.push(more, { type: 'caster', on: { id: mp, f: '-y', s: 0 }, d: 100 });
      var mCube = D.push(more, { type: 'profile', p: [80, 2, 0], ax: 'x', len: 4, cube: true }), Am = D.analyse(more);
      pick.plate = Am.G[mPlate]; pick.caster = Am.G[mCaster]; pick.cube = Am.G[mCube];
      PALETTE.forEach(function (q) {
        var g = pick[q[1]];
        if (!g) return;
        var sc = new THREE.Scene(), grp = new THREE.Group(), sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sc.add(new THREE.HemisphereLight(0xffffff, 0x9a8f7a, 0.75)); sun.position.set(2, 4, 3); sc.add(sun);
        grp.add(kit.mesh(g));
        if (g.type === 'chain') { grp.add(kit.mesh(g.A)); grp.add(kit.mesh(g.B)); }
        sc.add(grp);
        var box = new THREE.Box3().setFromObject(grp), c = box.getCenter(new THREE.Vector3()), rad = box.getSize(new THREE.Vector3()).length() / 2;
        var cam = new THREE.PerspectiveCamera(26, 1, 0.1, 5000), dir = new THREE.Vector3(0.9, 0.62, 1.15).normalize();
        cam.position.copy(c).addScaledVector(dir, rad / Math.sin(13 * Math.PI / 180) * 0.92); cam.lookAt(c);
        r.render(sc, cam);
        THUMBS[q[1]] = r.domElement.toDataURL('image/png');
      });
      kit.dispose(); r.dispose();
      if (r.forceContextLoss) r.forceContextLoss();
    } catch (e) { /* the box falls back to names only */ }
  }

  P.viewRobotFree = function (root, loadThree, toGuided) {
    var T = P.t, esc = P.esc, D = P.robotDesign, RB = P.robot;
    function f1(v) { return (Math.round(v * 10) / 10).toString(); }
    function f2(v) { return (Math.round(v * 100) / 100).toString(); }
    function shekel(v) { return '₪' + Math.round(v).toLocaleString('en-US'); }
    function ls(key, val) {
      try { if (val === undefined) return JSON.parse(localStorage.getItem(key)); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
      return null;
    }
    function valid(d) { return d && Array.isArray(d.parts) && d.parts.every(function (p) { return p && typeof p.id === 'string' && typeof p.type === 'string' && D.NAMES[p.type]; }); }

    var saved = ls('pico.robot.free'), d0 = valid(saved) ? saved : D.newDesign();
    var store = { d: d0, A: D.analyse(d0), sel: null, tool: null, run: false, bed: true };
    var dragT = null;
    var st = { tab: null, hist: [], fut: [], opts: { profile: { ax: 'x', len: 40, sec: '4040', wide: null }, cube: { sec: '4040' }, plate: { la: 20, lt: 20 }, shaft: { len: 30 }, sprocket: { n: 15 }, wheel: { d: 12 }, caster: { d: 100 }, motor: { model: 'my1016' }, deck: { lx: 60, lz: 80, crates: 2 } }, confirmDel: false, hint: null, measured: null, base: null, changed: false }, view = null;

    /* the model fills the screen; the toolbar, the parts box and the panels float over it */
    root.innerHTML = '<div class="rf-stage" id="rf-stage"><div class="rf-canvas" id="rf-canvas"><p class="muted rb-msg">' + T(L.loading) + '</p></div>' +
      '<div class="rf-top" id="rf-bar"></div>' +
      '<div class="rf-left"><div class="rf-cubebox"><div class="rf-cube" id="rf-cube">' + ['px', 'nx', 'pz', 'nz', 'py', 'ny'].map(function (f) { return '<button type="button" class="f-' + f + '" data-look="' + f + '">' + T(L.cube[f]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="rf-zoom"><button type="button" data-cam="home" title="' + T(L.home) + '" aria-label="' + T(L.home) + '">⌂</button><button type="button" data-cam="in" title="' + T(L.zin) + '" aria-label="' + T(L.zin) + '">+</button><button type="button" data-cam="out" title="' + T(L.zout) + '" aria-label="' + T(L.zout) + '">−</button></div></div>' +
      '<div class="rf-float rf-inspbox" id="rf-inspbox" hidden></div>' +
      '<div class="rf-float rf-drawer" id="rf-drawer" hidden><div class="rf-drawer-head"><b id="rf-drawer-title"></b><button type="button" class="rf-x" id="rf-drawer-close" aria-label="' + T(L.close) + '">✕</button></div><div class="rf-drawer-body" id="rf-panel"></div></div>' +
      '<aside class="rf-float rf-parts" id="rf-parts"></aside>' +
      '<div class="rf-hint" id="rf-hint"></div><img class="rf-dragimg" id="rf-dragimg" alt="" hidden></div><input type="file" id="rf-file" accept=".json,application/json" hidden>';
    var stage = document.getElementById('rf-stage'), panel = document.getElementById('rf-panel'), host = document.getElementById('rf-canvas'), hintEl = document.getElementById('rf-hint'), bar = document.getElementById('rf-bar'),
      partsEl = document.getElementById('rf-parts'), inspBox = document.getElementById('rf-inspbox'), drawer = document.getElementById('rf-drawer'), cubeEl = document.getElementById('rf-cube'), dragImg = document.getElementById('rf-dragimg');

    /* ---------- the store: every change to the design comes through here ---------- */
    function persist() { ls('pico.robot.free', store.d); }
    function remember(d) { st.hist.push(JSON.stringify(d)); if (st.hist.length > 80) st.hist.shift(); st.fut = []; }
    function setDesign(d, A, sel) {
      store.d = d; store.A = A || D.analyse(d);
      if (sel !== undefined) store.sel = sel;
      if (store.sel && !D.find(d, store.sel)) store.sel = null;
      st.confirmDel = false; st.hint = null; persist(); render();
    }
    store.apply = function (res, sel) { remember(store.d); setDesign(res.design, res.A, sel); };
    store.tryAdd = function (type, hit, opts) {
      var pr = D.propose(store.d, store.A, type, hit, opts);
      if (pr.err) return { ok: false, t: pr.err };
      var id, res = D.attempt(store.d, store.A, function (n) {
        if (pr.apply) { var stop = pr.apply(n); if (stop) return stop; id = n.parts[n.parts.length - 1].id; return; }
        id = D.push(n, pr.part);
      });
      res.newId = id;
      return res;
    };
    store.addCoupling = function (a, b) {
      var res = D.attempt(store.d, store.A, function (n) { return D.couple(n, store.A, a, b); });
      if (res.ok) store.apply(res, res.design.parts[res.design.parts.length - 1].id); else { store.hint(res.t, false); if (view) view.refresh(); }
    };
    store.addChain = function (a, b) {
      var id, res = D.attempt(store.d, store.A, function (n) { id = D.push(n, { type: 'chain', a: a, b: b }); });
      if (res.ok) store.apply(res, id); else { store.hint(res.t, false); if (view) view.refresh(); }
      return res;
    };
    store.toolDone = function (msg) { setTool(null); if (msg) store.hint(msg, false); };
    store.edit = function (fn, sel) {
      var res = D.attempt(store.d, store.A, fn);
      if (res.ok) store.apply(res, sel); else { store.hint(res.t, false); renderInspector(); }
      return res.ok;
    };
    store.dragStart = function () { st.base = { d: store.d, A: store.A }; st.changed = false; };
    store.dragTo = function (fn) {
      var res = D.attempt(st.base.d, st.base.A, function (n) { return fn(n, st.base.A); });
      if (res.ok) { store.d = res.design; store.A = res.A; st.changed = true; if (view) view.refresh(); renderInspector(); }
      return res;
    };
    store.dragEnd = function () { if (st.changed) { remember(st.base.d); persist(); render(); } st.base = null; };
    store.select = function (id) { store.sel = id; st.confirmDel = false; st.hint = null; if (id) st.tab = null; render(); };
    store.rotate = function (k, dir) {
      var id = store.sel, p = id && D.find(store.d, id), g = p && store.A.G[id];
      if (!g || g.bad || !(p.type === 'profile' || (p.type === 'deck' && k === 1) || (D.SLOT[p.type] && k === g.a))) return;
      store.edit(function (n) {
        var ids = [id];
        if (p.type === 'profile') {
          ids = D.component(n, id);
          n.parts.forEach(function (q) {                 // a deck lying on these profiles turns with them
            var gq = store.A.G[q.id];
            if (q.type === 'deck' && !gq.bad && ids.some(function (pid) { var b = store.A.G[pid].box; return Math.abs(gq.box.min[1] - b.max[1]) < 0.1 && gq.box.min[0] < b.max[0] && gq.box.max[0] > b.min[0] && gq.box.min[2] < b.max[2] && gq.box.max[2] > b.min[2]; })) ids.push(q.id);
          });
        }
        return D.rotate(n, store.A, ids, k, dir || 1);
      });
    };
    store.camMoved = function (th, ph) { cubeEl.style.transform = 'rotateX(' + (ph - Math.PI / 2) + 'rad) rotateY(' + (-th) + 'rad)'; };
    store.hint = function (t, ok) { st.hint = t ? { t: t, ok: ok } : null; renderHint(); };
    store.measured = function (v) { st.measured = v; renderHint(); };
    function setTool(type) {
      store.tool = type ? { type: type, opts: st.opts[type] } : null;
      st.hint = null; st.measured = null;
      if (type) store.sel = null;
      if (view) view.toolChanged();
      render();
    }
    function undo() { if (!st.hist.length) return; st.fut.push(JSON.stringify(store.d)); setDesign(JSON.parse(st.hist.pop())); }
    function redo() { if (!st.fut.length) return; st.hist.push(JSON.stringify(store.d)); setDesign(JSON.parse(st.fut.pop())); }
    function replace(d) { remember(store.d); store.sel = null; setDesign(d); if (view) view.fit(); }

    /* ---------- toolbar, hint line ---------- */
    function renderBar() {
      var chip = function (id, label, on, dis) { return '<button type="button" class="chip' + (on ? ' on' : '') + '" id="' + id + '"' + (dis ? ' disabled' : '') + '>' + label + '</button>'; };
      var n = store.A.blocks.length + store.A.issues.length;
      bar.innerHTML = '<div class="rf-grp">' + chip('rf-guided', '☰ ' + T(L.guided)) + '</div><div class="rf-grp">' +
        chip('rf-undo', '↶ ' + T(L.undo), false, !st.hist.length) + chip('rf-redo', '↷ ' + T(L.redo), false, !st.fut.length) + '<span class="rf-sep"></span>' +
        chip('rf-mirror', '⇋ ' + T(L.mirrorS)) + chip('rf-drop', '⤓ ' + T(L.dropS)) + chip('rf-measure', T(L.measure), store.tool && store.tool.type === 'measure') + '<span class="rf-sep"></span>' +
        chip('rf-run', '▶ ' + T(L.runS), store.run) + chip('rf-bed', T(L.bed), store.bed) + '</div><div class="rf-grp">' +
        Object.keys(L.tabs).map(function (t) { return '<button type="button" class="chip' + (st.tab === t ? ' on' : '') + '" data-tab="' + t + '">' + T(L.tabs[t]) + (t === 'checks' && n ? ' <span class="rf-count">' + n + '</span>' : '') + '</button>'; }).join('') + '</div>';
      [['rf-mirror', L.mirror], ['rf-drop', L.drop], ['rf-run', L.run]].forEach(function (q) { var b = document.getElementById(q[0]); if (b) b.title = T(q[1]); });
    }
    function renderHint() {
      var h = st.hint, t = store.tool, text, cls = '';
      if (h && h.t) { text = T(h.t); cls = h.ok ? ' ok' : ' bad'; }
      else if (t) text = T(dragT && dragT.live ? L.dragTip : L.tool[(t.type === 'chain' || t.type === 'coupling') && view && view.chainPicked() ? t.type + '2' : t.type]);
      else text = T(store.sel ? L.selTip : L.idle);
      if (st.measured && t && t.type === 'measure') text += ' ' + T(L.measured) + ': X ' + f1(st.measured[0]) + ' · Y ' + f1(st.measured[1]) + ' · Z ' + f1(st.measured[2]) + ' ' + T(L.cm);
      hintEl.className = 'rf-hint' + cls;
      hintEl.innerHTML = esc(text) + (t ? ' <button type="button" class="btn ghost small" id="rf-stop">' + T(L.stop) + '</button>' : '');
    }

    /* ---------- parts panel: palette, tool options, selected part ---------- */
    function usedOf(type) {                          // how many of this part are on the stage (nothing when none)
      var n = store.d.parts.filter(function (p) { return (type === 'cube' ? p.type === 'profile' && p.cube : p.type === type && !p.cube) && !store.A.G[p.id].bad; }).length;
      return n ? String(n) : '';
    }
    function num(label, path, val, step, min, max, unit) {
      return '<label class="rf-f"><span>' + T(label) + '</span><span class="rf-in"><input type="number" data-f="' + path + '" value="' + (Math.round(val * 100) / 100) + '" step="' + step + '"' + (min !== undefined ? ' min="' + min + '"' : '') + (max !== undefined ? ' max="' + max + '"' : '') + '>' + (unit ? '<i>' + T(unit) + '</i>' : '') + '</span></label>';
    }
    /* a row of choice buttons. `where` is 'opt' for the part about to be placed, 'part' for the selected one */
    function chips(label, where, key, list, cur) {
      return '<div class="rf-f"><span>' + T(label) + '</span><span class="chips" style="margin:0">' + list.map(function (q) {
        return '<button type="button" class="chip' + (String(cur) === String(q[0]) ? ' on' : '') + '" data-pick="' + where + '|' + key + '|' + q[0] + '">' + esc(typeof q[1] === 'string' ? q[1] : T(q[1])) + '</button>';
      }).join('') + '</span></div>';
    }
    var SEC_LIST = ['2020', '2040', '4040', '4080'].map(function (s) { return [s, s]; });
    function wideList(ax) { return ['y', 'x', 'z'].filter(function (a) { return a !== ax; }).map(function (a) { return [a, L.wides[a]]; }); }
    function secIsRect(sec) { var h = D.SECS[sec] && D.SECS[sec].h; return h && h[0] !== h[1]; }
    function defWide(ax) { return ax === 'y' ? 'x' : 'y'; }
    function wheelList() { return D.WHEELS.map(function (w) { return [w, w + '″']; }); }
    function casterList() { return Object.keys(D.CASTERS).map(function (k) { return [k, k + ' mm']; }); }
    function motorList() { return Object.keys(D.MOTORS).map(function (k) { return [k, D.MOTORS[k].name]; }); }
    function toolOptions() {
      var t = store.tool, o, html = '';
      if (!t || !st.opts[t.type]) return '';
      o = st.opts[t.type];
      if (t.type === 'profile') {
        html = chips(L.opt.sec, 'opt', 'sec', SEC_LIST, o.sec) + num(L.opt.len, 'opt.len', o.len, 0.5, 4, 300, L.cm) + '<div class="rf-f"><span>' + T(L.opt.dir) + '</span><span class="chips" style="margin:0">' + ['x', 'z', 'y'].map(function (a) { return '<button type="button" class="chip' + (o.ax === a ? ' on' : '') + '" data-ax="' + a + '">' + T(L.dirs[a]) + '</button>'; }).join('') + '</span></div>';
        if (secIsRect(o.sec)) html += chips(L.opt.wide, 'opt', 'wide', wideList(o.ax), o.wide && o.wide !== o.ax ? o.wide : defWide(o.ax));
      }
      if (t.type === 'cube') html = chips(L.opt.sec, 'opt', 'sec', [['2020', '2020'], ['4040', '4040']], o.sec);
      if (t.type === 'plate') html = num(L.opt.la, 'opt.la', o.la, 1, 4, 150, L.cm) + num(L.opt.lt, 'opt.lt', o.lt, 1, 4, 150, L.cm);
      if (t.type === 'wheel') html = chips(L.opt.wheelD, 'opt', 'd', wheelList(), o.d);
      if (t.type === 'caster') html = chips(L.opt.casterD, 'opt', 'd', casterList(), o.d);
      if (t.type === 'motor') html = chips(L.opt.model, 'opt', 'model', motorList(), o.model);
      if (t.type === 'shaft') html = num(L.opt.len, 'opt.len', o.len, 0.5, 6, 100, L.cm);
      if (t.type === 'sprocket') html = num(L.opt.teeth, 'opt.n', o.n, 1, 9, 45);
      if (t.type === 'deck') html = num(L.opt.lx, 'opt.lx', o.lx, 1, 10, 200, L.cm) + num(L.opt.lz, 'opt.lz', o.lz, 1, 10, 200, L.cm) + num(L.opt.crates, 'opt.crates', o.crates, 1, 0, 4);
      return '<div class="card rf-opts">' + html + '</div>';
    }
    function faceButtons(g, p) {
      var pg = store.A.G[p.on.id];
      return '<div class="rf-f"><span>' + T(L.face) + '</span><span class="chips" style="margin:0">' + ['+y', '-y', '+x', '-x', '+z', '-z'].filter(function (f) { return D.face(f).k !== pg.ax; }).map(function (f) {
        return '<button type="button" class="chip' + (p.on.f === f ? ' on' : '') + '" data-face="' + f + '">' + T(L.faces[f]) + '</button>';
      }).join('') + '</span></div>';
    }
    function inspectorHtml() {
      var id = store.sel, p = id && D.find(store.d, id), g = p && store.A.G[id], html, acts = '';
      if (!p || !g) return '<p class="muted">' + T(L.none) + '</p>';
      var kind = p.cube ? 'cube' : p.type, name = PALETTE.filter(function (q) { return q[1] === kind; })[0][2], info = XINFO[kind] || RB.PARTS[INFO[p.type]];
      html = '<h3>' + esc(T(name)) + (p.type === 'profile' ? ' <span class="ltr">' + D.secOf(p) + '</span>' : '') + '</h3>';
      if (g.bad) return html + '<p class="callout">' + esc(T(D.MSG[g.bad])) + '</p><div class="rf-acts"><button type="button" class="btn ghost small" data-act="del">' + T(L.del) + '</button></div>';
      var rotB = function (axes, label) { return '<div class="rf-f"><span>' + T(L.rot) + '</span><span class="chips" style="margin:0">' + axes.map(function (k) { return '<button type="button" class="chip" data-rot="' + k + '">↻ ' + T(label || L.rotAx[k]) + '</button>'; }).join('') + '</span></div>'; };
      if (p.type === 'profile' && p.cube) html += chips(L.opt.sec, 'part', 'sec', [['2020', '2020'], ['4040', '4040']], D.secOf(p)) + num(L.f.x, 'p.0', p.p[0], 0.5) + num(L.f.y, 'p.1', p.p[1], 0.5, 0) + num(L.f.z, 'p.2', p.p[2], 0.5);
      else if (p.type === 'profile') {
        html += chips(L.opt.sec, 'part', 'sec', SEC_LIST, D.secOf(p));
        if (secIsRect(D.secOf(p))) html += chips(L.opt.wide, 'part', 'wide', wideList(p.ax), p.wide && p.wide !== p.ax ? p.wide : defWide(p.ax));
        html += num(L.f.len, 'len', p.len, 0.5, 4, 300, L.cm) + num(L.f.x, 'p.0', p.p[0], 0.5) + num(L.f.y, 'p.1', p.p[1], 0.5, 0) + num(L.f.z, 'p.2', p.p[2], 0.5) + rotB([0, 1, 2]);
      }
      else if (p.type === 'deck') html += num(L.f.lx, 'lx', p.lx, 1, 10, 200, L.cm) + num(L.f.lz, 'lz', p.lz, 1, 10, 200, L.cm) + num(L.f.crates, 'crates', p.crates, 1, 0, 4) + num(L.f.x, 'p.0', p.p[0], 0.5) + num(L.f.z, 'p.2', p.p[2], 0.5) + rotB([1]);
      else if (D.SLOT[p.type]) {
        html += num(L.f.s, 'on.s', p.on.s, 0.5, undefined, undefined, L.cm) + rotB([g.a], L.rotProf);
        if (p.type === 'motor' || p.type === 'bearing' || p.type === 'caster') html += num(L.f.lift, 'lift', p.lift || 0, 0.1, 0, 8, L.cm);
        if (p.type === 'motor') { html += chips(L.opt.model, 'part', 'model', motorList(), p.model || 'my1016') + num(L.f.u, 'u', p.u || 0, 0.1, -15, 15, L.cm); acts += '<button type="button" class="btn ghost small" data-act="flipOut">' + T(L.flip) + '</button>'; }
        if (p.type === 'caster') html += chips(L.opt.casterD, 'part', 'd', casterList(), p.d || 100);
        if (p.type === 'plate') html += num(L.opt.la, 'la', p.la, 1, 4, 150, L.cm) + num(L.opt.lt, 'lt', p.lt, 1, 4, 150, L.cm) + num(L.f.v, 'v', p.v || 0, 0.5, undefined, undefined, L.cm);
        if (p.type === 'battery' || p.type === 'control') { html += num(L.f.v, 'v', p.v || 0, 0.5, undefined, undefined, L.cm); acts += '<button type="button" class="btn ghost small" data-act="turn">' + T(L.turn) + '</button>'; }
        html += faceButtons(g, p);
      } else if (p.type === 'shaft') html += num(L.f.len, 'len', p.len, 0.5, 6, 100, L.cm) + (g.coup ? '' : num(L.f.sShaft, 'on.s', p.on.s, 0.5, undefined, undefined, L.cm));
      else if (p.type === 'sprocket') {
        html += num(L.f.n, 'n', p.n, 1, 9, 45) + (store.A.G[p.on.id].type === 'shaft' ? num(L.f.sSpr, 'on.s', p.on.s, 0.1, undefined, undefined, L.cm) : '') +
          '<p class="muted">' + T(L.pitch) + ': <b class="ltr">' + f1(RB.pd(p.n) * 10) + '</b> ' + T(L.mm) + '</p>';
      } else if (p.type === 'wheel') { html += chips(L.opt.wheelD, 'part', 'd', wheelList(), p.d || 12); acts += '<button type="button" class="btn ghost small" data-act="flipEnd">' + T(L.otherEnd) + '</button>'; }
      else if (p.type === 'coupling') html += '<p>' + T(L.coupInfo) + '</p>';
      else if (p.type === 'idler') acts += '<button type="button" class="btn ghost small" data-act="flipSpan">' + T(L.otherSpan) + '</button>';
      else if (p.type === 'chain') {
        html += '<p><b class="ltr">' + g.n + '</b> ' + T(L.links) + ' · ' + T(L.chainLen) + ' <b class="ltr">' + f1(g.n * RB.PITCH) + '</b> ' + T(L.cm) + ' · ' + T(L.slack) + ' <b class="ltr">' + f1(g.slack * 10) + '</b> ' + T(L.mm) + '</p>' +
          '<p>' + T(L.ratio) + ': <b class="ltr">' + g.A.n + ' : ' + g.B.n + '</b></p>';
        acts += '<button type="button" class="btn ghost small" data-act="tension">' + T(L.tension) + '</button>';
      }
      if (info) html += '<p class="muted rf-role">' + esc(T(info.role)) + ' ' + esc(T(info.to)) + '</p>';
      var deps = D.dependents(store.d, id).length;
      if (st.confirmDel) acts = '<span class="rf-ask">' + deps + ' ' + T(L.delAsk) + '.</span><button type="button" class="btn small" data-act="delAll">' + T(L.delAll) + '</button><button type="button" class="btn ghost small" data-act="delNo">' + T(L.cancel) + '</button>';
      else acts += (st.opts[p.type] || D.SLOT[p.type] || p.type === 'wheel' || p.type === 'bracket' ? '<button type="button" class="btn ghost small" data-act="dup">' + T(L.dup) + '</button>' : '') + '<button type="button" class="btn ghost small" data-act="del">' + T(L.del) + '</button>';
      return html + '<div class="rf-acts">' + acts + '</div>';
    }
    function startButtons() { return '<div class="rf-acts"><button type="button" class="btn ghost small" data-start="empty">' + T(L.startEmpty) + '</button><button type="button" class="btn ghost small" data-start="frame">' + T(L.startFrame) + '</button><button type="button" class="btn ghost small" data-start="robot">' + T(L.startRobot) + '</button></div>'; }
    /* the small panel beside the model: the selected part, the options of the part being placed, or the first steps */
    function renderInspector() {
      var cur = store.tool && store.tool.type, html = '';
      if (!st.tab) {
        if (cur && st.opts[cur]) html = toolOptions();
        else if (store.sel) html = '<div class="rf-insp" id="rf-insp">' + inspectorHtml() + '</div>';
        else if (!store.d.parts.length && !cur) html = '<b>' + T(L.tipsH) + '</b><ol class="rf-tips">' + L.tips.map(function (t) { return '<li>' + esc(T(t)) + '</li>'; }).join('') + '</ol>' + startButtons();
      }
      inspBox.hidden = !html; inspBox.innerHTML = html;
    }
    /* the parts box: a picture of each part, to drag onto the model */
    function renderParts() {
      var cur = store.tool && store.tool.type, html = '<div class="rf-parts-head"><b>' + T(L.box) + '</b><small>' + T(L.boxTip) + '</small></div><div class="rf-parts-body">';
      Object.keys(L.groups).forEach(function (gk) {
        html += '<div class="rf-group"><div class="eyebrow">' + T(L.groups[gk]) + '</div><div class="rf-pal">' + PALETTE.filter(function (q) { return q[0] === gk; }).map(function (q) {
          var u = usedOf(q[1]), img = THUMBS && THUMBS[q[1]];
          return '<button type="button" class="rf-tile' + (cur === q[1] ? ' on' : '') + '" data-tool="' + q[1] + '" title="' + esc(T(q[2])) + '">' + (img ? '<img src="' + img + '" alt="" draggable="false">' : '<span class="rf-noimg"></span>') +
            '<b>' + esc(T(q[2])) + '</b>' + (u ? '<small class="ltr">' + u + '</small>' : '') + '</button>';
        }).join('') + '</div></div>';
      });
      partsEl.innerHTML = html + '</div>';
    }

    /* ---------- what is missing ---------- */
    function checksPanel() {
      var A = store.A, list = A.blocks.map(function (b) { return { lvl: 'err', t: b.t, ids: b.ids }; }).concat(A.issues);
      list.sort(function (a, b) { return (a.lvl === 'err' ? 0 : 1) - (b.lvl === 'err' ? 0 : 1); });
      panel.innerHTML = '<h3>' + T(L.missionsH) + '</h3><div class="card"><ul class="checks">' + A.missions.map(function (m) {
        return '<li class="ck ' + (m.ok ? 'ok' : 'todo') + '"><span class="ck-dot"></span><span>' + esc(T(m.t)) + '</span></li>';
      }).join('') + '</ul></div><h3>' + T(L.problemsH) + (list.length ? ' (' + list.length + ')' : '') + '</h3><div class="card">' +
        (!store.d.parts.length ? '<p class="muted">' + T(L.emptyStage) + '</p>' : !list.length ? '<p class="expect" style="margin:0">' + T(L.allGood) + '</p>' :
          '<ul class="checks">' + list.map(function (c, i) {
            return '<li class="ck ' + c.lvl + '"><span class="ck-dot"></span><span>' + esc(T(c.t)) + (c.ids.length ? ' <button type="button" class="btn ghost small rf-show" data-issue="' + i + '">' + T(L.show) + '</button>' : '') + '</span></li>';
          }).join('') + '</ul>') + '</div>';
      panel._list = list;
    }

    /* ---------- the drive train ---------- */
    function drivePanel() {
      var A = store.A, dr = A.drive, html = '<h3>' + T(L.driveH) + '</h3><p>' + T(L.driveLead) + '</p>';
      function node(n) {
        var kmh = n.kmh || 0;
        var h = '<div class="rf-node ' + n.type + '" data-sel="' + n.id + '"><b>' + T(n.type === 'motor' ? L.motor : L.shaft) + '</b> <span class="ltr">' + f1(n.rpm) + '</span> ' + T(L.rpm) +
          (n.type === 'shaft' ? ' · ' + T(L.torque) + ' <span class="ltr">×' + f2((n.mrpm || RB.MOTOR_RPM) / n.rpm) + '</span>' : '') +
          (n.wheels ? ' · ' + n.wheels + ' ' + T(L.wheelsN) + ' · <b class="ltr">' + f1(kmh) + '</b> ' + T(L.kmh) : '') + '</div>';
        n.sprockets.forEach(function (s) {
          if (s.to) h += '<div class="rf-link"><span class="rf-gear" data-sel="' + s.id + '">⚙ ' + s.n + '</span><span class="rf-ch" data-sel="' + s.chain + '">' + T(L.chainW) + ' · ' + s.links + ' ' + T(L.links) + '</span><span class="rf-gear">⚙ ' + s.toN + '</span><small class="ltr">' + s.n + ':' + s.toN + ' = ×' + f2(s.n / s.toN) + '</small></div><div class="rf-sub">' + node(s.to) + '</div>';
          else if (!s.chain) h += '<div class="rf-link"><span class="rf-gear" data-sel="' + s.id + '">⚙ ' + s.n + '</span><small>' + T(L.noChain) + '</small></div>';
        });
        (n.coups || []).forEach(function (c) { h += '<div class="rf-link"><span class="rf-ch" data-sel="' + c.id + '">⊕ ' + T(L.coupW) + '</span><small class="ltr">1:1</small></div><div class="rf-sub">' + node(c.to) + '</div>'; });
        return h;
      }
      if (!dr.trains.length) html += '<p class="callout">' + T(L.noMotor) + '</p>';
      dr.trains.forEach(function (t) { html += '<div class="card rf-train">' + node(t) + '</div>'; });
      var idle = Object.keys(dr.bodies).filter(function (id) { return dr.bodies[id].type === 'shaft' && dr.bodies[id].rpm === null; });
      if (idle.length) html += '<p class="muted">' + T(L.undriven) + ': <b>' + idle.length + '</b></p>';
      var ms = Object.keys(dr.motors);
      if (ms.length) {
        html += '<h3>' + T(L.resH) + '</h3><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.perMotor) + '</th><th>' + T(L.speed) + '</th><th>' + T(L.wheelTq) + '</th><th>' + T(L.push) + '</th></tr></thead><tbody>' +
          ms.map(function (id, i) { var m = dr.motors[id]; return '<tr data-sel="' + id + '"><td>' + T(L.motor) + ' ' + (i + 1) + '</td><td class="ltr"><b>' + f1(m.kmh) + '</b> km/h</td><td class="ltr">' + f1(m.torque) + ' N·m</td><td class="ltr">' + Math.round(m.newton) + ' N ≈ ' + Math.round(m.kgf) + ' kg</td></tr>'; }).join('') +
          '</tbody></table></div><p class="muted" style="font-size:.85rem">' + T(L.pushNote) + '</p>';
      }
      panel.innerHTML = html;
    }

    /* ---------- lists ---------- */
    function listsHtml() {
      var A = store.A, bm = A.bom, chains = store.d.parts.filter(function (p) { return p.type === 'chain' && !A.G[p.id].bad; });
      var html = '<h3>' + T(L.bomH) + '</h3><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl rf-bom"><thead><tr><th>' + T(L.part) + '</th><th>' + T(L.usedC) + '</th></tr></thead><tbody>' +
        bm.rows.filter(function (r) { return r.used > 0; }).map(function (r) {
          var u = r.unit ? ' ' + r.unit : '', q = function (v) { return r.unit ? f2(v) : String(v); };
          return '<tr><td>' + esc(T(r.name)) + (r.note ? '<br><small class="muted">' + esc(T(r.note)) + '</small>' : '') + '</td><td class="ltr">' + q(r.used) + u + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      html += '<h3>' + T(L.cutsH) + '</h3><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><tbody>' + bm.cuts.map(function (c) { return '<tr><td class="ltr"><b>' + c.n + ' × ' + f1(c.len) + '</b> ' + T(L.cm) + ' <span class="muted">(' + c.sec + ')</span></td></tr>'; }).join('') +
        '<tr><td><b>' + T(L.total) + ': <span class="ltr">' + f2(bm.profile / 100) + ' m</span></b></td></tr></tbody></table></div>';
      if (chains.length) html += '<h3>' + T(L.chainsH) + '</h3><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><tbody>' + chains.map(function (p) {
        var g = A.G[p.id];
        return '<tr><td class="ltr">⚙ ' + g.A.n + ' → ⚙ ' + g.B.n + '</td><td><b class="ltr">' + g.n + '</b> ' + T(L.links) + '</td><td class="ltr">' + f1(g.n * RB.PITCH) + ' cm</td></tr>';
      }).join('') + '</tbody></table></div>';
      html += '<h3>' + T(L.weightH) + '</h3><p><b class="ltr">' + f1(A.stand.kg) + '</b> ' + T(L.kg) + ' · ' + T(L.comH) + ': <b class="ltr">' + f1(A.stand.com[1]) + '</b> ' + T(L.cm) + '</p><p class="muted" style="font-size:.85rem">' + T(L.weightNote) + '</p>';
      return html;
    }
    function listsPanel() { panel.innerHTML = '<button type="button" class="btn" id="rf-sheet-open">' + T(L.sheet) + '</button>' + listsHtml(); }
    function driveTableHtml() {
      var dr = store.A.drive, ms = Object.keys(dr.motors);
      return ms.length ? '<h3>' + T(L.tabs.drive) + '</h3><table class="tbl"><tbody>' + ms.map(function (id, i) { var m = dr.motors[id]; return '<tr><td>' + T(L.motor) + ' ' + (i + 1) + '</td><td class="ltr">' + f1(m.kmh) + ' km/h</td><td class="ltr">×' + f2(1 / m.ratio) + ' ' + T(L.torque) + '</td><td>' + m.wheels + ' ' + T(L.wheelsN) + '</td></tr>'; }).join('') + '</tbody></table>' : '';
    }
    function openSheet() {
      var old = document.getElementById('rf-sheet'), img = view ? view.snapshot() : '';
      if (old) old.remove();
      var sh = document.createElement('div');
      sh.id = 'rf-sheet'; sh.className = 'rf-sheet';
      sh.innerHTML = '<div class="rf-sheet-in"><div class="rf-sheet-bar"><button type="button" class="btn" id="rf-print">' + T(L.print) + '</button><button type="button" class="btn ghost" id="rf-sheet-close">' + T(L.close) + '</button></div>' +
        '<h1>' + T(L.sheetH) + '</h1><p class="muted">' + new Date().toLocaleDateString() + ' · ' + T(L.sheetNote) + '</p>' + (img ? '<img src="' + img + '" alt="">' : '') +
        '<h3>' + T(L.missionsH) + '</h3><ul>' + store.A.missions.map(function (m) { return '<li>' + (m.ok ? '✔ ' : '✘ ') + esc(T(m.t)) + '</li>'; }).join('') + '</ul>' + driveTableHtml() + listsHtml() + '</div>';
      document.body.appendChild(sh); document.body.classList.add('rf-print');
      sh.addEventListener('click', function (e) {
        if (e.target.id === 'rf-print') window.print();
        if (e.target.id === 'rf-sheet-close') { sh.remove(); document.body.classList.remove('rf-print'); }
      });
    }

    /* ---------- saving ---------- */
    function savePanel() {
      var all = ls('pico.robot.designs') || {}, names = Object.keys(all);
      panel.innerHTML = '<h3>' + T(L.saveH) + '</h3><p>' + T(L.saveLead) + '</p><div class="card"><label class="rf-f"><span>' + T(L.name) + '</span><span class="rf-in"><input type="text" id="rf-name" maxlength="40"></span></label><div class="rf-acts"><button type="button" class="btn small" id="rf-save-as">' + T(L.saveAs) + '</button></div></div>' +
        (names.length ? '<ul class="rf-saved">' + names.map(function (n) { return '<li><b>' + esc(n) + '</b><span><button type="button" class="btn ghost small" data-load="' + esc(n) + '">' + T(L.load) + '</button><button type="button" class="btn ghost small" data-forget="' + esc(n) + '">' + T(L.del) + '</button></span></li>'; }).join('') + '</ul>' : '<p class="muted">' + T(L.noSaved) + '</p>') +
        '<div class="rf-acts"><button type="button" class="btn ghost small" id="rf-export">' + T(L.exp) + '</button><button type="button" class="btn ghost small" id="rf-import">' + T(L.imp) + '</button></div>' +
        '<h3>' + T(L.startH) + '</h3>' + startButtons() + '<p class="muted" style="font-size:.85rem">' + T(L.startNote) + '</p>';
    }

    function renderPanel() {
      drawer.hidden = !st.tab;
      if (st.tab) {
        document.getElementById('rf-drawer-title').textContent = T(L.tabs[st.tab]);
        ({ checks: checksPanel, drive: drivePanel, lists: listsPanel, save: savePanel })[st.tab]();
      }
      renderInspector();
    }
    function render() { renderBar(); renderHint(); renderParts(); renderPanel(); if (view) view.refresh(); }

    /* ---------- events ---------- */
    function setField(path, v) {
      var id = store.sel;
      if (isNaN(v)) return renderPanel();
      if (path.indexOf('opt.') === 0) { st.opts[store.tool.type][path.slice(4)] = v; return; }
      store.edit(function (n) {
        var p = D.find(n, id), ks = path.split('.');
        if (p.type === 'profile' && path === 'len') { if (!(v >= 4 && v <= 300)) return D.MSG.size; return D.stretch(n, id, 1, v - p.len); }
        if (ks[0] === 'p') { var dl = [0, 0, 0]; dl[+ks[1]] = v - p.p[+ks[1]]; return D.moveProfiles(n, p.type === 'profile' ? D.component(n, id) : [id], dl); }
        if (ks.length === 2) p[ks[0]][ks[1]] = v; else p[path] = v;
      });
    }
    /* a choice button: "opt|key|value" sets an option of the part about to be placed, "part|key|value" changes the selected part */
    function pick(spec) {
      var q = spec.split('|'), key = q[1], val = key === 'd' ? +q[2] : q[2];
      if (q[0] === 'opt') {
        var o = store.tool && st.opts[store.tool.type];
        if (!o) return;
        o[key] = val;
        if (key === 'sec' && !secIsRect(val)) o.wide = null;
        return renderPanel();
      }
      var id = store.sel;
      store.edit(function (n) {
        var x = D.find(n, id);
        if (key === 'sec') { if (val === '4040') delete x.sec; else x.sec = val; if (!secIsRect(val)) delete x.wide; if (x.cube) x.len = D.SECS[val].h[0] * 2; }
        else if ((key === 'd' && x.type === 'wheel' && val === 12) || (key === 'model' && val === 'my1016')) delete x[key];
        else x[key] = val;
      });
    }
    function act(a) {
      var id = store.sel, p = D.find(store.d, id);
      if (!p) return;
      if (a === 'del') { if (D.dependents(store.d, id).length) { st.confirmDel = true; return renderInspector(); } a = 'delAll'; }
      if (a === 'delNo') { st.confirmDel = false; return renderInspector(); }
      if (a === 'delAll') { remember(store.d); var n = D.clone(store.d); D.remove(n, id); return setDesign(n, null, null); }
      if (a === 'dup') {
        if (p.type === 'profile' && p.cube) { st.opts.cube = { sec: D.secOf(p) }; return setTool('cube'); }
        if (p.type === 'profile') st.opts.profile = { ax: p.ax, len: p.len, sec: D.secOf(p), wide: p.wide || null };
        if (p.type === 'wheel') st.opts.wheel = { d: p.d || 12 };
        if (p.type === 'motor') st.opts.motor = { model: p.model || 'my1016' };
        if (p.type === 'caster') st.opts.caster = { d: p.d || 100 };
        if (p.type === 'plate') st.opts.plate = { la: p.la, lt: p.lt };
        if (p.type === 'shaft') st.opts.shaft = { len: p.len };
        if (p.type === 'sprocket') st.opts.sprocket = { n: p.n };
        if (p.type === 'deck') st.opts.deck = { lx: p.lx, lz: p.lz, crates: p.crates };
        return setTool(p.type);
      }
      if (a === 'tension') {
        var n2 = D.clone(store.d);
        if (!D.tension(n2, id)) return store.hint(L.tensionNo, false);
        return store.edit(function (q) { q.parts = n2.parts; });
      }
      store.edit(function (q) {
        var x = D.find(q, id);
        if (a === 'flipOut') x.out = -(x.out || 1);
        if (a === 'turn') x.turn = x.turn ? 0 : 1;
        if (a === 'flipEnd') x.end = -(x.end || 1);
        if (a === 'flipSpan') x.span = x.span === 0 ? 1 : 0;
      });
    }
    function mirror() {
      var pos = 0, neg = 0;
      store.d.parts.forEach(function (p) { var g = store.A.G[p.id]; if (g.box) { if (g.box.min[2] > 0.01) pos++; else if (g.box.max[2] < -0.01) neg++; } });
      if (!pos && !neg) return store.hint(L.mirrorNone, false);
      var res = D.mirror(store.d, store.A, pos >= neg ? 1 : -1);
      if (res.ok) store.apply(res); else store.hint(res.t, false);
    }
    function start(kind) {
      var guided = ls('pico.robot') || {}, dims = {};
      Object.keys(RB.DEFAULTS).forEach(function (k) { var v = guided.dims && +guided.dims[k], lim = RB.LIMITS[k]; dims[k] = v >= lim[0] && v <= lim[1] ? v : RB.DEFAULTS[k]; });
      replace(kind === 'empty' ? D.newDesign() : D.template(dims, kind === 'frame'));
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.id === 'rf-undo') undo(); else if (b.id === 'rf-redo') redo();
      else if (b.id === 'rf-guided') { if (toGuided) toGuided(); }
      else if (b.getAttribute('data-tab')) { var tb = b.getAttribute('data-tab'); st.tab = st.tab === tb ? null : tb; renderBar(); renderPanel(); }
      else if (b.id === 'rf-run') { store.run = !store.run; render(); }
      else if (b.id === 'rf-bed') { store.bed = !store.bed; render(); }
      else if (b.id === 'rf-measure') setTool(store.tool && store.tool.type === 'measure' ? null : 'measure');
      else if (b.id === 'rf-drop') store.edit(function (n) { D.dropToGround(n, store.A); });
      else if (b.id === 'rf-mirror') mirror();
    });
    hintEl.addEventListener('click', function (e) { if (e.target.id === 'rf-stop') setTool(null); });
    stage.addEventListener('change', function (e) { var f = e.target.getAttribute('data-f'); if (f) setField(f, parseFloat(e.target.value)); });
    stage.addEventListener('click', function (e) {
      var b = e.target.closest('button, [data-sel]'), v;
      if (!b || bar.contains(b) || partsEl.contains(b)) return;
      if ((v = b.getAttribute('data-look'))) { if (view) view.look(v); }
      else if ((v = b.getAttribute('data-cam'))) { if (view) { if (v === 'home') view.setView('iso'); else view.zoom(v === 'in' ? 0.8 : 1.25); } }
      else if (b.id === 'rf-drawer-close') { st.tab = null; renderBar(); renderPanel(); }
      else if ((v = b.getAttribute('data-ax'))) { st.opts.profile.ax = v; renderPanel(); }
      else if ((v = b.getAttribute('data-pick'))) pick(v);
      else if ((v = b.getAttribute('data-rot'))) store.rotate(+v, e.shiftKey ? -1 : 1);
      else if ((v = b.getAttribute('data-face'))) store.edit(function (n) { D.find(n, store.sel).on.f = v; });
      else if ((v = b.getAttribute('data-act'))) act(v);
      else if ((v = b.getAttribute('data-start'))) start(v);
      else if ((v = b.getAttribute('data-issue'))) { if (view) view.focus(panel._list[+v].ids); }
      else if ((v = b.getAttribute('data-sel'))) { if (D.find(store.d, v)) { store.sel = v; if (view) view.focus([v]); renderHint(); } }
      else if (b.id === 'rf-sheet-open') openSheet();
      else if (b.id === 'rf-save-as') { var nm = document.getElementById('rf-name').value.trim(); if (nm) { var all = ls('pico.robot.designs') || {}; all[nm] = store.d; ls('pico.robot.designs', all); savePanel(); store.hint(L.saved, true); } }
      else if ((v = b.getAttribute('data-load'))) { var d = (ls('pico.robot.designs') || {})[v]; if (valid(d)) replace(D.clone(d)); }
      else if ((v = b.getAttribute('data-forget'))) { var a2 = ls('pico.robot.designs') || {}; delete a2[v]; ls('pico.robot.designs', a2); savePanel(); }
      else if (b.id === 'rf-export') { var link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(store.d)], { type: 'application/json' })); link.download = 'robot-design.json'; link.click(); }
      else if (b.id === 'rf-import') document.getElementById('rf-file').click();
    });
    document.getElementById('rf-file').addEventListener('change', function () {
      var file = this.files[0], rd = new FileReader();
      if (!file) return;
      rd.onload = function () { var d = null; try { d = JSON.parse(rd.result); } catch (e) { /* not json */ } if (valid(d)) replace(d); else store.hint(L.badFile, false); };
      rd.readAsText(file); this.value = '';
    });
    /* taking a part out of the box: press it and drag onto the model (a plain click keeps the part "in hand" for several placements) */
    function dragShow(e) {
      var over = view && view.over(e.clientX, e.clientY), img = THUMBS && THUMBS[dragT.type];
      dragImg.hidden = over || !img;
      if (img) { dragImg.src = img; dragImg.style.left = e.clientX + 'px'; dragImg.style.top = e.clientY + 'px'; }
      if (view) { if (over) view.ghostAt(e); else view.clearGhost(); }
    }
    partsEl.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-tool]');
      if (!b || e.button) return;
      dragT = { type: b.getAttribute('data-tool'), x: e.clientX, y: e.clientY, live: false, id: e.pointerId };
      try { partsEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    partsEl.addEventListener('pointermove', function (e) {
      if (!dragT || e.pointerId !== dragT.id) return;
      if (!dragT.live) {
        if (Math.hypot(e.clientX - dragT.x, e.clientY - dragT.y) < 7 || dragT.type === 'chain') return;
        dragT.live = true;
        if (!store.tool || store.tool.type !== dragT.type) setTool(dragT.type); else renderHint();
      }
      e.preventDefault(); dragShow(e);
    });
    function dragStop(e, cancel) {
      var t = dragT;
      if (!t || e.pointerId !== t.id) return;
      dragT = null; dragImg.hidden = true;
      try { partsEl.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      if (!t.live) { if (!cancel) setTool(store.tool && store.tool.type === t.type ? null : t.type); return; }
      if (!cancel && view && view.over(e.clientX, e.clientY)) return view.dropAt(e);      // places it, or says why not; either way the hand is empty after
      setTool(null);
    }
    partsEl.addEventListener('pointerup', function (e) { dragStop(e, false); });
    partsEl.addEventListener('pointercancel', function (e) { dragStop(e, true); });

    function onKey(e) {
      if (!root.isConnected) return document.removeEventListener('keydown', onKey);
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); }
      else if (k === 'escape') { if (store.tool) setTool(null); else if (store.sel) store.select(null); }
      else if ((k === 'delete' || k === 'backspace') && store.sel) { e.preventDefault(); act(st.confirmDel ? 'delAll' : 'del'); }
      else if ((k === 'r' || k === 'ר') && store.tool && store.tool.type === 'profile') { var o = st.opts.profile; o.ax = { x: 'z', z: 'y', y: 'x' }[o.ax]; renderPanel(); }
      else if ((k === 'r' || k === 'ר') && !store.tool && store.sel) { var sg = store.A.G[store.sel]; if (sg && !sg.bad) store.rotate(D.SLOT[sg.type] ? sg.a : 1, e.shiftKey ? -1 : 1); }
    }
    document.addEventListener('keydown', onKey);

    function barHeight() { stage.style.setProperty('--rf-bar', (bar.offsetHeight || 40) + 'px'); }      // the panels start below the toolbar, however many rows it takes
    if (window.ResizeObserver) new ResizeObserver(barHeight).observe(bar);
    render(); barHeight();
    loadThree(function (ok) {
      if (!host.isConnected) return;
      if (!ok) { host.innerHTML = '<p class="callout rb-msg">' + T(L.noThree) + '</p>'; return; }
      makeThumbs(window.THREE); renderParts();
      view = P._robotFree = P.robotBuilder(window.THREE, host, store);
      P._robotFree.store = store;
    });
  };
})(window.PICO);
