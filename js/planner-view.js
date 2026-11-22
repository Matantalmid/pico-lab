/* The planner page. A project is a list of stations (one Pico on its own
   breadboard each) and a list of links between them. For every station the
   planner assigns pins, draws the circuit on a breadboard (adding breadboards
   when one fills up), checks it, and writes a starter program. */
(function (P) {
  'use strict';
  var T = P.t, S = P.s, esc = P.esc, PL = P.planner, PLAN = PL.PLAN;
  var B = function (he, en) { return { he: he, en: en }; };

  var LINK_TYPES = ['uart', 'i2c', 'wire', 'radio'];
  var LINK_NAME = {
    uart: B('UART (שני חוטי נתונים)', 'UART (two data wires)'),
    i2c: B('I2C בין לוחות', 'I2C between boards'),
    wire: B('חוט דיגיטלי אחד', 'One digital wire'),
    radio: B('אלחוטי (nRF24L01)', 'Wireless (nRF24L01)')
  };
  var UART_PINS = [[8, 9, 1], [4, 5, 1], [20, 21, 1], [0, 1, 0], [12, 13, 0], [16, 17, 0]];   /* tx, rx, uart id */
  var I2C1_PINS = [[2, 3], [6, 7], [10, 11], [14, 15], [18, 19], [26, 27]];                    /* sda, scl on I2C1 */

  var L = {
    h: B('מתכנן פרויקט', 'Project planner'),
    lead: B('בחרו את הרכיבים של הפרויקט שלכם, והמתכנן יחליט איזה רכיב מתחבר לאיזה פין, יצייר את המעגל על מטריצה ויכתוב קוד התחלתי. אפשר להוסיף לוחות Pico נוספים ולחבר ביניהם. כשמטריצה מתמלאת, המתכנן פותח מטריצה נוספת.',
      'Pick your project\'s parts, and the planner decides which part goes on which pin, draws the circuit on a breadboard and writes starter code. You can add more Pico boards and link them. When a breadboard fills up, the planner opens another one.'),
    boards: B('הלוחות בפרויקט', 'The boards in this project'),
    addBoard: B('+ הוסף לוח Pico', '+ Add a Pico board'),
    removeBoard: B('הסר את הלוח הזה', 'Remove this board'),
    pick: B('בחרו רכיבים ל-', 'Pick parts for '),
    search: B('חיפוש רכיב', 'Search for a part'),
    links: B('חיבורים בין הלוחות', 'Links between the boards'),
    linksLead: B('כדי ששני לוחות יעבדו יחד, הם צריכים דרך לתקשר זה עם זה. אם זו הפעם הראשונה שלכם, בחרו UART, כי הוא הפשוט ביותר להבנה ולבדיקה.', 'For two boards to work together they need a way to talk. If this is your first time, choose UART: it is the simplest to understand and test.'),
    addLink: B('הוסיפו חיבור', 'Add link'),
    noLinks: B('אין עדיין חיבורים בין הלוחות.', 'No links between the boards yet.'),
    remove: B('הסירו', 'Remove'),
    overview: B('מבט כללי', 'Overview'),
    clear: B('נקו הכול', 'Clear all'),
    link: B('העתיקו קישור לתוכנית', 'Copy link to this plan'),
    linkDone: B('הקישור הועתק', 'Link copied'),
    empty: B('עדיין לא נבחרו רכיבים ללוח הזה. לחצו על + שליד רכיב כדי להתחיל.', 'No parts picked for this board yet. Press + next to a part to begin.'),
    s2: B('האיור על המטריצה', 'The breadboard drawing'),
    s2b: B('טבלת החיווט', 'The wiring table'),
    s3: B('בדקו', 'Check it'),
    s4: B('רשימת קניות לכל הפרויקט', 'Shopping list for the whole project'),
    s5: B('קוד התחלתי', 'Starter code'),
    boardsUsed: B('מטריצות', 'breadboards'),
    moreBoards: B('המעגל לא נכנס על מטריצה אחת, ולכן המתכנן פתח מטריצה נוספת. חוטי המתח והאדמה מחברים בין פסי המתח של המטריצות.', 'The circuit does not fit on one breadboard, so the planner opened another. The power and ground wires run between the breadboards\' power rails.'),
    layoutBad: B('המתכנן לא הצליח לצייר את המעגל הזה בצורה שעוברת את הבדיקה שלו, ולכן האיור לא מוצג. טבלת החיווט שלמטה נכונה.', 'The planner could not draw this circuit in a way that passes its check, so the drawing is not shown. The wiring table below is correct.'),
    noPin: B('אין פין פנוי', 'no free pin'),
    rail33: B('פס ה-3.3V', '3.3 V rail'),
    usb: B('סך הכול מה-USB', 'Total from USB'),
    estimate: B('כל רכיב צורך [[current|זרם]], שנמדד ב-[[ma|mA]]. הלוח יכול לספק בערך 300mA מהפין `3V3(OUT)`, ובערך 500mA בסך הכול מיציאת ה-USB של מחשב. זו הערכה גסה, שמבוססת על צריכה טיפוסית וכוללת כ-40mA ללוח עצמו.',
      'Every part draws [[current|current]], measured in [[ma|mA]]. The board can supply about 300 mA from the `3V3(OUT)` pin, and about 500 mA in total from a computer\'s USB port. This is a rough estimate from typical draw, including about 40 mA for the board itself.'),
    cPins: B('פיני GP בשימוש', 'GP pins in use'), cOf: B('מתוך', 'of'),
    cNoAdc: B('אין מספיק כניסות ADC, כי ב-Pico 2 יש שלוש בלבד. העבירו רכיב אנלוגי ללוח אחר.', 'Not enough ADC inputs. The Pico 2 has only three. Move an analog part to another board.'),
    cNoPin: B('לא נשאר פין מתאים בשביל', 'No suitable pin is left for'),
    cNoLink: B('לא נשארו פינים פנויים בשביל החיבור אל', 'No free pins are left for the link to'),
    c5v: B('מקבלים מתח מ-VBUS (5V), ולכן הלוח הזה חייב להיות מחובר ל-USB או לספק של 5V.', 'run from VBUS (5 V), so this board must be connected to USB or a 5 V supply.'),
    c33ok: B('העומס על פס ה-3.3V נמצא בטווח הבטוח.', 'The load on the 3.3 V rail is within the safe range.'),
    c33bad: B('העומס על פס ה-3.3V גבוה מדי.', 'The load on the 3.3 V rail is too high.'),
    cUsbOk: B('הצריכה הטיפוסית מתאימה ליציאת USB רגילה.', 'Typical draw suits a standard USB port.'),
    cUsbBad: B('הצריכה הכוללת גבוהה מ-500mA, ולכן צריך ספק 5V חיצוני.', 'Total draw is above 500 mA. An external 5 V supply is needed.'),
    cPeak: B('צורכים בשיא הרבה יותר זרם מאשר בממוצע. אם הלוח מתאתחל כשהם פועלים, הזינו אותם מספק 5V נפרד, עם אדמה משותפת.', 'draw far more at peak than on average. If the board resets when they run, power them from a separate 5 V supply with a shared ground.'),
    cLibs: B('ספריות וקבצים שצריך להתקין על הלוח (הפרטים בעמוד של כל רכיב):', 'Libraries and files to install on the board (see each part\'s page):'),
    cAddr: B('שני רכיבים שעל אותו אפיק I2C משתמשים באותה כתובת, ולכן הם לא יעבדו יחד:', 'Two parts on the same I2C bus use the same address and will not work together:'),
    cGnd: B('חיבור חוטי בין שני לוחות חייב לכלול גם חוט אדמה ביניהם, והאיור כולל אותו.', 'A wired link between two boards must include a ground wire between them. The drawing includes it.'),
    c3v3: B('לעולם אל תחברו את הפין `3V3` של לוח אחד לפין `3V3` של לוח אחר. חברו רק את האדמה ואת חוטי האות.', 'Never connect the `3V3` pin of one board to the `3V3` pin of another. Connect only ground and signal wires.'),
    cI2cT: B('חיבור I2C בין לוחות דורש גרסה עדכנית של MicroPython בלוח שעונה, והקוד שלו עדיין לא נבדק. אם הוא לא עובד, עברו ל-UART.', 'I2C between boards needs a recent MicroPython on the answering board, and its code is untested. If it does not work, switch to UART.'),
    cRadio: B('בשביל החיבור האלחוטי נוסף מודול nRF24L01 לכל אחד משני הלוחות.', 'For the wireless link an nRF24L01 module was added to each of the two boards.'),
    base: B('לכל לוח: מטריצה, חוטי גישור וכבל micro-USB.', 'For each board: a breadboard, jumper wires and a micro-USB cable.'),
    codeNote: B('זו נקודת התחלה, ולא פרויקט גמור. הריצו את הקוד, ודאו שכל רכיב עובד, ואז שנו את מה שבתוך הלולאה. לכל לוח יש תוכנית משלו.', 'This is a starting point and not a finished project. Run the code, confirm each part works, then change what is inside the loop. Each board has its own program.'),
    saveAs: B('שמרו את הקוד על הלוח הזה בשם', 'Save on this board as'),
    toB: B('אל', 'to'), ofB: B('של', 'of'),
    autoAdded: B('נוסף אוטומטית בשביל החיבור האלחוטי', 'added automatically for the wireless link')
  };

  /* ---------- project state <-> text ---------- */
  function parseProject(str) {
    var proj = { stations: [], links: [] };
    str = String(str || '');
    if (str.indexOf('=') < 0) { proj.stations.push({ id: 'A', sel: PL.parseSel(str) }); return proj; }
    str.split(';').forEach(function (tok) {
      var m;
      if ((m = /^([A-H])=(.*)$/.exec(tok))) {
        if (!proj.stations.some(function (s) { return s.id === m[1]; })) proj.stations.push({ id: m[1], sel: PL.parseSel(m[2]) });
      } else if ((m = /^([A-H])-([A-H])=([a-z0-9]+)$/.exec(tok)) && LINK_TYPES.indexOf(m[3]) >= 0 && m[1] !== m[2]) {
        proj.links.push({ a: m[1], b: m[2], type: m[3] });
      }
    });
    if (!proj.stations.length) proj.stations.push({ id: 'A', sel: [] });
    proj.links = proj.links.filter(function (l) {
      return proj.stations.some(function (s) { return s.id === l.a; }) && proj.stations.some(function (s) { return s.id === l.b; });
    });
    return proj;
  }
  function projectString(proj) {
    if (proj.stations.length === 1 && !proj.links.length) return PL.selString(proj.stations[0].sel);
    return proj.stations.map(function (s) { return s.id + '=' + PL.selString(s.sel); })
      .concat(proj.links.map(function (l) { return l.a + '-' + l.b + '=' + l.type; })).join(';');
  }
  function loadSaved() { try { return parseProject(localStorage.getItem('pico.plan')); } catch (e) { return parseProject(''); } }
  function saveProject(proj) { try { localStorage.setItem('pico.plan', projectString(proj)); } catch (e) { /* ignore */ } }

  /* ---------- the plan for a whole project ---------- */
  function planProject(proj) {
    var out = {};
    /* a wireless link needs a radio module on both boards */
    proj.stations.forEach(function (s) {
      var sel = s.sel.map(function (x) { return { id: x.id, qty: x.qty }; });
      var radio = proj.links.some(function (l) { return l.type === 'radio' && (l.a === s.id || l.b === s.id); });
      var auto = radio && !sel.some(function (x) { return x.id === 'nrf24'; });
      if (auto) sel.push({ id: 'nrf24', qty: 1 });
      var res = PL.allocate(sel);
      res.instances.forEach(function (inst) { if (auto && inst.comp.id === 'nrf24') inst.auto = true; });
      out[s.id] = { id: s.id, sel: sel, res: res, linkInst: [], extras: [], linkErrors: [], notes: {} };
    });

    function pick(st, list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i], gps = c.slice(0, 2);
        if (gps.every(function (g) { return st.res.isFree(g); })) { gps.forEach(function (g) { st.res.take(g); }); return c; }
      }
      return null;
    }
    function pickOne(st) {
      for (var i = 0; i < st.res.pool.length; i++) if (st.res.isFree(st.res.pool[i])) { st.res.take(st.res.pool[i]); return st.res.pool[i]; }
      return null;
    }
    function pinRow(label, gp) { return { part: label, pin: P.pinByName('GP' + gp) }; }
    function gndRow() { return { part: 'GND', pin: P.pinByNum(38), power: true }; }

    proj.links.forEach(function (l, n) {
      var A = out[l.a], Bs = out[l.b];
      if (!A || !Bs) return;
      var nameA = 'Pico ' + l.a, nameB = 'Pico ' + l.b, idA = 'link' + n + 'a', idB = 'link' + n + 'b';
      function fail() { A.linkErrors.push(nameB); Bs.linkErrors.push(nameA); }
      function side(st, id, label, pinNames, pins, rows) {
        var con = {};
        pinNames.forEach(function (nm, i) { con[nm] = i < pins.length ? i : 'gnd'; });
        st.linkInst.push({ kind: 'link', id: id, label: label, pins: pins, tpl: { off: 'top', pins: pinNames, con: con }, rows: rows.concat([gndRow()]), name: T(L.toB) + ' ' + label });
      }
      if (l.type === 'uart') {
        var ua = pick(A, UART_PINS), ub = pick(Bs, UART_PINS);
        if (!ua || !ub) return fail();
        side(A, idA, nameB, ['GP' + ub[1], 'GP' + ub[0], 'GND'], [ua[0], ua[1]],
          [pinRow('TX → ' + nameB + ' GP' + ub[1] + ' (RX)', ua[0]), pinRow('RX ← ' + nameB + ' GP' + ub[0] + ' (TX)', ua[1])]);
        side(Bs, idB, nameA, ['GP' + ua[1], 'GP' + ua[0], 'GND'], [ub[0], ub[1]],
          [pinRow('TX → ' + nameA + ' GP' + ua[1] + ' (RX)', ub[0]), pinRow('RX ← ' + nameA + ' GP' + ua[0] + ' (TX)', ub[1])]);
        var uartCode = function (me, other, u) {
          var v = 'link_' + other.toLowerCase();
          return {
            title: 'Link to Pico ' + other + ' (UART)', from: { machine: ['Pin', 'UART'] },
            setup: [v + ' = UART(' + u[2] + ', baudrate=9600, tx=Pin(' + u[0] + '), rx=Pin(' + u[1] + '))'],
            loop: [v + '.write("hello from ' + me + '\\n")', 'if ' + v + '.any():', '    print("from ' + other + ':", ' + v + '.readline())']
          };
        };
        A.extras.push(uartCode(l.a, l.b, ua)); Bs.extras.push(uartCode(l.b, l.a, ub));
        A.notes.wired = Bs.notes.wired = true;
      } else if (l.type === 'i2c') {
        var ia = pick(A, I2C1_PINS), ib = pick(Bs, I2C1_PINS);
        if (!ia || !ib) return fail();
        var addr = '0x' + (0x41 + n).toString(16);
        side(A, idA, nameB, ['GP' + ib[0], 'GP' + ib[1], 'GND'], [ia[0], ia[1]],
          [pinRow('SDA ↔ ' + nameB + ' GP' + ib[0], ia[0]), pinRow('SCL → ' + nameB + ' GP' + ib[1], ia[1])]);
        side(Bs, idB, nameA, ['GP' + ia[0], 'GP' + ia[1], 'GND'], [ib[0], ib[1]],
          [pinRow('SDA ↔ ' + nameA + ' GP' + ia[0], ib[0]), pinRow('SCL ← ' + nameA + ' GP' + ia[1], ib[1])]);
        var bus = 'bus_' + l.b.toLowerCase();
        A.extras.push({
          title: 'Link to Pico ' + l.b + ' (I2C, this board is in charge)', from: { machine: ['Pin', 'I2C'] },
          setup: [bus + ' = I2C(1, sda=Pin(' + ia[0] + '), scl=Pin(' + ia[1] + '), freq=100_000)'],
          loop: ['try:', '    ' + bus + '.writeto_mem(' + addr + ', 0, b"hi")', '    print("from ' + l.b + ':", ' + bus + '.readfrom_mem(' + addr + ', 0, 4))', 'except OSError:', '    print("Pico ' + l.b + ' did not answer")']
        });
        Bs.extras.push({
          title: 'Link to Pico ' + l.a + ' (I2C, this board answers at ' + addr + '). Untested: needs a recent MicroPython.', from: { machine: ['Pin', 'I2CTarget'] },
          setup: ['shared = bytearray(8)', 'target = I2CTarget(1, addr=' + addr + ', mem=shared, scl=Pin(' + ib[1] + '), sda=Pin(' + ib[0] + '))'],
          loop: ['print("shared memory:", bytes(shared))']
        });
        A.notes.wired = Bs.notes.wired = true; A.notes.i2c = Bs.notes.i2c = true;
      } else if (l.type === 'wire') {
        var wa = pickOne(A), wb = pickOne(Bs);
        if (wa == null || wb == null) return fail();
        side(A, idA, nameB, ['GP' + wb, 'GND'], [wa], [pinRow(T(B('יציאה', 'Output')) + ' → ' + nameB + ' GP' + wb, wa)]);
        side(Bs, idB, nameA, ['GP' + wa, 'GND'], [wb], [pinRow(T(B('כניסה', 'Input')) + ' ← ' + nameA + ' GP' + wa, wb)]);
        A.extras.push({ title: 'Signal to Pico ' + l.b, from: { machine: ['Pin'] }, setup: ['to_' + l.b.toLowerCase() + ' = Pin(' + wa + ', Pin.OUT)'], loop: ['to_' + l.b.toLowerCase() + '.toggle()'] });
        Bs.extras.push({ title: 'Signal from Pico ' + l.a, from: { machine: ['Pin'] }, setup: ['from_' + l.a.toLowerCase() + ' = Pin(' + wb + ', Pin.IN)'], loop: ['print("from ' + l.a + ':", from_' + l.a.toLowerCase() + '.value())'] });
        A.notes.wired = Bs.notes.wired = true;
      } else if (l.type === 'radio') {
        var ra = A.res.instances.filter(function (i) { return i.comp.id === 'nrf24'; })[0];
        var rb = Bs.res.instances.filter(function (i) { return i.comp.id === 'nrf24'; })[0];
        if (ra && !ra.role) ra.role = 'tx';
        if (rb && !rb.role) rb.role = 'rx';
        A.notes.radio = Bs.notes.radio = true;
      }
    });

    /* layout and code for each station */
    proj.stations.forEach(function (s) {
      var st = out[s.id];
      var inst = st.res.instances.filter(function (i) { return !i.failed; }).map(function (i) {
        return { kind: i.comp.id, id: i.comp.id + (i.k + 1), pins: i.pins };
      }).concat(st.linkInst);
      st.auto = inst.length ? P.autoLayout(inst) : null;
      st.code = PL.generate(st.res, st.extras, '# Program for Pico ' + s.id + '. A starting point: run it, then make it yours.');
    });
    return out;
  }

  /* ---------- overview: the boards and what links them ---------- */
  function overviewSvg(proj) {
    var n = proj.stations.length, bw = 150, gap = 110, w = n * bw + (n - 1) * gap + 40, s = '';
    var x = {};
    proj.stations.forEach(function (st, i) {
      x[st.id] = 20 + i * (bw + gap);
      var parts = st.sel.reduce(function (a, q) { return a + q.qty; }, 0);
      s += '<rect x="' + x[st.id] + '" y="46" width="' + bw + '" height="64" rx="10" class="bb-pico"/>' +
        '<text x="' + (x[st.id] + bw / 2) + '" y="74" text-anchor="middle" class="bb-pico-t" style="font-size:15px">Pico ' + st.id + '</text>' +
        '<text x="' + (x[st.id] + bw / 2) + '" y="94" text-anchor="middle" class="bb-pico-t">' + parts + ' ' + esc(T(B('רכיבים', 'parts'))) + '</text>';
    });
    var slot = {};
    proj.links.forEach(function (l) {
      var xa = x[l.a] + bw / 2, xb = x[l.b] + bw / 2, key = [l.a, l.b].sort().join(''), k = slot[key] = (slot[key] || 0) + 1;
      var above = k % 2 === 1, lift = 26 + Math.floor((k - 1) / 2) * 22, y0 = above ? 46 : 110, y1 = above ? 46 - lift : 110 + lift;
      var dash = l.type === 'radio' ? ' stroke-dasharray="6 5"' : '';
      s += '<path d="M' + xa + ' ' + y0 + ' C' + xa + ' ' + y1 + ' ' + xb + ' ' + y1 + ' ' + xb + ' ' + y0 + '" fill="none" style="stroke:var(--accent);stroke-width:3"' + dash + '/>' +
        '<text x="' + ((xa + xb) / 2) + '" y="' + (above ? y1 + 12 : y1 - 4) + '" text-anchor="middle" style="font:700 11px var(--mono)">' + l.type.toUpperCase() + '</text>';
    });
    return '<svg class="art cd" viewBox="0 0 ' + w + ' 160" width="' + w + '" height="160" role="img" aria-label="project overview">' + s + '</svg>';
  }

  /* ---------- the page ---------- */
  P.viewPlanner = function (app, arg1, arg2) {
    var H = P.h, proj, current;
    if (arg1 === 'add' && PLAN[arg2]) {
      proj = loadSaved();
      var st0 = proj.stations[0], hit = st0.sel.filter(function (s) { return s.id === arg2; })[0];
      if (hit) hit.qty = Math.min(PLAN[arg2].max, hit.qty + 1); else st0.sel.push({ id: arg2, qty: 1 });
    } else if (arg1) proj = parseProject(decodeURIComponent(arg1));
    else proj = loadSaved();
    current = proj.stations[0].id;

    function station(id) { return proj.stations.filter(function (s) { return s.id === id; })[0]; }
    function qtyOf(id) { var s = station(current).sel.filter(function (x) { return x.id === id; })[0]; return s ? s.qty : 0; }
    function setQty(id, q) {
      var st = station(current);
      q = Math.max(0, Math.min(PLAN[id].max, q));
      st.sel = st.sel.filter(function (x) { return x.id !== id; });
      if (q > 0) st.sel.push({ id: id, qty: q });
      st.sel.sort(function (a, b) { return P.components.indexOf(P.componentById(a.id)) - P.components.indexOf(P.componentById(b.id)); });
    }
    function sync() {
      saveProject(proj);
      var str = projectString(proj);
      history.replaceState(null, '', '#/planner' + (str ? '/' + str : ''));
    }

    app.className = 'page';
    app.innerHTML = '<h1>' + T(L.h) + '</h1><p class="lead" style="margin-top:10px">' + T(L.lead) + '</p>' +
      '<h2>' + T(L.boards) + '</h2><div class="plan-tabs" id="plan-tabs"></div>' +
      '<div id="plan-links"></div>' +
      '<h2 id="pick-h"></h2>' +
      '<input type="search" class="gl-search" id="pick-search" placeholder="' + T(L.search) + '" aria-label="' + T(L.search) + '" style="margin-bottom:10px">' +
      '<div class="picker">' + P.components.filter(function (c) { return PLAN[c.id]; }).map(function (c) {
        return '<div class="pick" data-id="' + c.id + '" data-text="' + esc((c.name.he + ' ' + c.name.en + ' ' + c.id).toLowerCase()) + '">' +
          '<div class="pick-txt"><b>' + esc(T(c.name)) + '</b><span>' + c.iface.map(H.ifaceTag).join(' ') + '</span></div>' +
          '<div class="stepper"><button type="button" data-d="-1" aria-label="−">−</button>' +
          '<output>0</output><button type="button" data-d="1" aria-label="+">+</button></div></div>';
      }).join('') + '</div>' +
      '<div class="plan-actions"><button type="button" class="btn ghost small" id="plan-clear">' + T(L.clear) + '</button>' +
      '<button type="button" class="btn ghost small" id="plan-link">' + T(L.link) + '</button></div>' +
      '<div id="plan-out"></div>';

    var out = document.getElementById('plan-out');

    function renderTabs() {
      var tabs = document.getElementById('plan-tabs');
      tabs.innerHTML = proj.stations.map(function (s) {
        var n = s.sel.reduce(function (a, q) { return a + q.qty; }, 0);
        return '<button type="button" class="chip' + (s.id === current ? ' on' : '') + '" data-st="' + s.id + '">Pico ' + s.id + ' <span class="mono">(' + n + ')</span></button>';
      }).join('') +
        (proj.stations.length < 4 ? '<button type="button" class="chip" data-st="+">' + T(L.addBoard) + '</button>' : '') +
        (proj.stations.length > 1 ? '<button type="button" class="btn ghost small" data-st="-">' + T(L.removeBoard) + '</button>' : '');
      document.getElementById('pick-h').textContent = T(L.pick) + 'Pico ' + current;
    }

    function renderLinks() {
      var host = document.getElementById('plan-links');
      if (proj.stations.length < 2) { host.innerHTML = ''; return; }
      var opts = proj.stations.map(function (s) { return '<option value="' + s.id + '">Pico ' + s.id + '</option>'; }).join('');
      host.innerHTML = '<h2>' + T(L.links) + '</h2><p class="muted" style="font-size:.93rem">' + T(L.linksLead) + '</p>' +
        '<div class="card" style="box-shadow:none">' +
        (proj.links.length ? '<ul class="link-list">' + proj.links.map(function (l, i) {
          return '<li><b>Pico ' + l.a + '</b> ↔ <b>Pico ' + l.b + '</b> · ' + esc(T(LINK_NAME[l.type])) +
            ' <button type="button" class="btn ghost small" data-rm="' + i + '">' + T(L.remove) + '</button></li>';
        }).join('') + '</ul>' : '<p class="muted">' + T(L.noLinks) + '</p>') +
        '<div class="demo-row" style="margin:10px 0 0"><select id="lk-a">' + opts + '</select><span>↔</span><select id="lk-b">' + opts + '</select>' +
        '<select id="lk-t">' + LINK_TYPES.map(function (t) { return '<option value="' + t + '">' + esc(T(LINK_NAME[t])) + '</option>'; }).join('') + '</select>' +
        '<button type="button" class="btn small" id="lk-add">' + T(L.addLink) + '</button></div></div>';
      host.querySelector('#lk-b').selectedIndex = 1;
    }

    function renderPicker() {
      app.querySelectorAll('.pick').forEach(function (el) {
        var id = el.dataset.id, q = qtyOf(id);
        el.classList.toggle('on', q > 0);
        el.querySelector('output').textContent = q;
        el.querySelector('[data-d="-1"]').disabled = q === 0;
        el.querySelector('[data-d="1"]').disabled = q >= PLAN[id].max;
      });
    }

    function renderOut() {
      var plan = planProject(proj), st = plan[current], res = st.res;
      var html = '';
      if (proj.stations.length > 1) {
        html += '<h2>' + T(L.overview) + '</h2><div class="card wv" style="padding:12px"><div class="wv-scroll" dir="ltr">' + overviewSvg(proj) + '</div></div>';
      }
      html += '<h2>Pico ' + current + '</h2>';
      if (!res.instances.length && !st.linkInst.length) {
        out.innerHTML = html + '<div class="card empty-panel"><p><b>' + T(L.empty) + '</b></p></div>';
        return;
      }

      /* wiring table */
      var rows = '';
      res.instances.forEach(function (inst) {
        rows += '<tr class="grp"><td colspan="3"><a href="#/components/' + inst.comp.id + '">' + esc(inst.name) + '</a>' +
          (inst.auto ? ' <span class="muted" style="font-weight:400">(' + T(L.autoAdded) + ')</span>' : '') + '</td></tr>';
        inst.rows.forEach(function (r) { rows += rowHtml(r); });
      });
      st.linkInst.forEach(function (li) {
        rows += '<tr class="grp"><td colspan="3">' + esc(li.name) + '</td></tr>';
        li.rows.forEach(function (r) { rows += rowHtml(r); });
      });
      function rowHtml(r) {
        var pinCell = !r.pin ? '<span class="tag t-power big">' + T(L.noPin) + '</span>'
          : '<a class="pico-pin" href="#/pinout/pin/' + r.pin.num + '">' + H.tag(r.pin.kind === 'gpio' ? 'gpio' : r.pin.kind, r.pin.label, true) + '<small>' + S('pin') + ' ' + r.pin.num + '</small></a>';
        return '<tr><td><b>' + esc(T(r.part)) + '</b></td><td>' + pinCell + '</td><td class="muted">' + (r.note ? P.rich(T(r.note)) : '') + '</td></tr>';
      }

      /* power, checks */
      var ma33 = 0, ma5 = 0, fiveV = [], peaky = [], libs = [], addrs = {}, clash = [];
      res.instances.forEach(function (inst) {
        var nm = T(inst.comp.name);
        if (inst.comp.volt === '5V' || inst.plan.five) { ma5 += inst.plan.mA; if (fiveV.indexOf(nm) < 0) fiveV.push(nm); } else ma33 += inst.plan.mA;
        if (inst.plan.peak && peaky.indexOf(nm) < 0) peaky.push(nm);
        if (inst.comp.lib && libs.indexOf(inst.comp.lib.name) < 0) libs.push(inst.comp.lib.name);
        if (inst.comp.addr) { if (addrs[inst.comp.addr]) clash.push(addrs[inst.comp.addr] + ' / ' + nm + ' (' + inst.comp.addr + ')'); addrs[inst.comp.addr] = nm; }
      });
      var total = PL.PICO_MA + ma33 + ma5;
      var bar = function (label, val, max) {
        return '<div class="bar-row"><span>' + label + '</span><div class="meter"><i class="' + (val > max ? 'over' : '') + '" style="width:' + Math.min(100, val / max * 100) + '%"></i></div>' +
          '<b class="mono">' + val + ' / ' + max + ' mA</b></div>';
      };
      var checks = [];
      var ck = function (lvl, text) { checks.push('<li class="ck ' + lvl + '"><span class="ck-dot"></span><span>' + text + '</span></li>'); };
      if (res.errors.some(function (e) { return e.need === 'adc'; })) ck('err', T(L.cNoAdc));
      res.errors.filter(function (e) { return e.need !== 'adc'; }).forEach(function (e) { ck('err', T(L.cNoPin) + ' ' + esc(e.inst.name) + '.'); });
      st.linkErrors.forEach(function (n) { ck('err', T(L.cNoLink) + ' ' + esc(n) + '.'); });
      clash.forEach(function (c) { ck('err', T(L.cAddr) + ' <b>' + esc(c) + '</b>'); });
      ck('ok', T(L.cPins) + ': <b>' + res.count() + '</b> ' + T(L.cOf) + ' 26.');
      ck(ma33 > PL.RAIL_3V3_MA ? 'err' : 'ok', T(ma33 > PL.RAIL_3V3_MA ? L.c33bad : L.c33ok));
      ck(total > PL.USB_MA ? 'err' : 'ok', T(total > PL.USB_MA ? L.cUsbBad : L.cUsbOk));
      if (fiveV.length) ck('warn', '<b>' + esc(fiveV.join(', ')) + '</b> ' + T(L.c5v));
      if (peaky.length) ck('warn', '<b>' + esc(peaky.join(', ')) + '</b> ' + T(L.cPeak));
      if (libs.length) ck('warn', T(L.cLibs) + ' <b class="mono">' + esc(libs.join(', ')) + '</b>');
      if (st.notes.wired) { ck('ok', T(L.cGnd)); ck('warn', P.rich(T(L.c3v3))); }
      if (st.notes.i2c) ck('warn', T(L.cI2cT));
      if (st.notes.radio) ck('ok', T(L.cRadio));

      var bad = !st.auto || st.auto.errors.length;
      var nBoards = st.auto ? st.auto.layout.boards : 1;

      /* shopping list for all boards */
      var bom = proj.stations.map(function (s) {
        var items = plan[s.id].sel.map(function (q) {
          var c = P.componentById(q.id);
          return '<li>' + (q.qty > 1 ? '<b class="mono">' + q.qty + ' ×</b> ' : '') + c.needs.map(function (n) { return esc(P.plain(T(n))); }).join(', ') + '</li>';
        }).join('');
        return items ? '<p style="margin:8px 0 4px"><b>Pico ' + s.id + '</b></p><ul>' + items + '</ul>' : '';
      }).join('');

      out.innerHTML = html +
        '<h3 class="plan-sub"><span class="num">1</span>' + T(L.s2) + (nBoards > 1 ? ' <span class="muted">(' + nBoards + ' ' + T(L.boardsUsed) + ')</span>' : '') + '</h3>' +
        (bad ? '<div class="callout">' + T(L.layoutBad) + '</div>' : '<div id="plan-wv"></div>' + (nBoards > 1 ? '<div class="callout">' + T(L.moreBoards) + '</div>' : '')) +
        '<h3 class="plan-sub"><span class="num">2</span>' + T(L.s2b) + '</h3>' +
        '<div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl plan-tbl"><thead><tr><th>' + S('wiringPart') + '</th><th>' + S('wiringPico') + '</th><th>' + S('wiringNote') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<h3 class="plan-sub"><span class="num">3</span>' + T(L.s3) + '</h3>' +
        '<div class="two-col"><div class="card">' + bar(T(L.rail33), ma33, PL.RAIL_3V3_MA) + bar(T(L.usb), total, PL.USB_MA) +
        '<p class="muted" style="margin:10px 0 0;font-size:.88rem">' + P.rich(T(L.estimate)) + '</p></div>' +
        '<div class="card"><ul class="checks">' + checks.join('') + '</ul></div></div>' +
        '<h3 class="plan-sub"><span class="num">4</span>' + T(L.s5) + '</h3><p>' + T(L.codeNote) + ' ' + T(L.saveAs) + ' <code>main.py</code>.</p>' + H.codeBlock(st.code) +
        '<h2>' + T(L.s4) + '</h2><div class="card">' + bom + '<p class="muted" style="margin:10px 0 0;font-size:.92rem">' + T(L.base) + '</p></div>';

      if (!bad) P.wiringView(document.getElementById('plan-wv'), st.auto.layout);
    }

    function all() { sync(); renderTabs(); renderLinks(); renderPicker(); renderOut(); }

    document.getElementById('plan-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-st]');
      if (!b) return;
      var v = b.dataset.st;
      if (v === '+') {
        var id = 'ABCD'.split('').filter(function (c) { return !station(c); })[0];
        proj.stations.push({ id: id, sel: [] }); current = id;
      } else if (v === '-') {
        proj.stations = proj.stations.filter(function (s) { return s.id !== current; });
        proj.links = proj.links.filter(function (l) { return l.a !== current && l.b !== current; });
        current = proj.stations[0].id;
      } else current = v;
      all();
    });
    document.getElementById('plan-links').addEventListener('click', function (e) {
      var rm = e.target.closest('[data-rm]');
      if (rm) { proj.links.splice(parseInt(rm.dataset.rm, 10), 1); all(); return; }
      if (e.target.closest('#lk-add')) {
        var a = document.getElementById('lk-a').value, b = document.getElementById('lk-b').value, t = document.getElementById('lk-t').value;
        if (a === b) return;
        proj.links.push({ a: a, b: b, type: t }); all();
      }
    });
    app.querySelector('.picker').addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]');
      if (!b) return;
      var id = b.closest('.pick').dataset.id;
      setQty(id, qtyOf(id) + parseInt(b.dataset.d, 10));
      sync(); renderTabs(); renderPicker(); renderOut();
    });
    document.getElementById('pick-search').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      app.querySelectorAll('.pick').forEach(function (el) { el.hidden = !!q && el.dataset.text.indexOf(q) < 0; });
    });
    document.getElementById('plan-clear').addEventListener('click', function () {
      proj = { stations: [{ id: 'A', sel: [] }], links: [] }; current = 'A'; all();
    });
    document.getElementById('plan-link').addEventListener('click', function () {
      var b = this;
      H.copyText(location.href, function () { b.textContent = T(L.linkDone); setTimeout(function () { b.textContent = T(L.link); }, 1400); });
    });

    all();
  };

  P.planProject = planProject;
  P.parseProject = parseProject;
})(window.PICO);
