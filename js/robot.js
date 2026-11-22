/* The robot page: students choose the dimensions, see what follows from
   them, and then put the robot together step by step in 3D.
   The 3D library (three.js) is loaded only when this page is opened:
   from the web, or from js/vendor/three.min.js when there is no connection. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc, RB = P.robot;
  var B = function (he, en) { return { he: he, en: en }; };
  var THREE_URLS = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'js/vendor/three.min.js'];

  var L = {
    h: B('בונים את הרובוט', 'Building the robot'),
    modes: { free: B('בנייה חופשית', 'Free build'), guided: B('רובוט לדוגמה, שלב אחר שלב', 'Example robot, step by step') },
    lead: B('רובוט סבל חקלאי, שנוסע מעל הערוגה ונושא ארגזים. כאן קובעים את המידות שלו, בודקים שהחלקים נכנסים, ומרכיבים אותו חלק אחר חלק. זה מודל להמחשה ולא סימולציה פיזיקלית: הוא מראה איך החלקים מתחברים ומה המידות, אבל לא בודק חוזק או אחיזה בחול.',
      'A farm carrier robot: it drives over the crop bed and carries crates. Here you set its dimensions, check that the parts fit, and assemble it part by part. This is a concept model, not a physics simulation: it shows how the parts fit and what the sizes are, and does not test strength or grip in sand.'),
    tabDims: B('1. מידות', '1. Dimensions'), tabBuild: B('2. הרכבה', '2. Assembly'), tabParts: B('3. חלקים', '3. Parts'),
    dimsH: B('קבעו את המידות', 'Set the dimensions'),
    dimsLead: B('הזיזו את המחוונים, וראו איך הרובוט משתנה. המטרה היא רובוט שעובר מעל הערוגה, וכל הבדיקות שלמטה ירוקות.', 'Move the sliders and watch the robot change. The goal: a robot that clears the crop bed, with every check below green.'),
    d: {
      L: [B('אורך הרובוט', 'Robot length'), B('אורך המסילות והמסגרת העליונה.', 'The length of the rails and the top frame.')],
      W: [B('רוחב המסגרת', 'Frame width'), B('מקצה אחד של המסגרת לקצה השני, בלי הגלגלים.', 'Edge to edge of the frame, without the wheels.')],
      H: [B('גובה המשטח', 'Deck height'), B('מהקרקע ועד ראש המסגרת העליונה.', 'From the ground to the top of the upper frame.')],
      B: [B('מרחק בין הצירים', 'Distance between shafts'), B('מהציר האחורי לציר הקדמי.', 'From the rear shaft to the front shaft.')],
      G: [B('מרווח בין המסילות', 'Gap between the rails'), B('המרחק בין שתי המסילות שבכל צד. השרשרת עוברת ביניהן.', 'The distance between the two rails on each side. The chain runs between them.')]
    },
    cm: B('ס"מ', 'cm'), reset: B('חזרה למידות ההתחלה', 'Back to the starting dimensions'),
    resH: B('מה נובע מהמידות', 'What follows from the dimensions'), cutsH: B('רשימת חיתוך לפרופיל', 'Cutting list for the profile'),
    pieces: B('יח\'', 'pcs'), total: B('סה"כ', 'Total'),
    r: {
      clearRails: B('רוחב המעבר בין המסילות', 'Free width between the rails'), clearMotors: B('רוחב המעבר בין המנועים', 'Free width between the motors'),
      clearH: B('גובה המעבר מתחת למצבר', 'Free height under the battery'), overall: B('מידות חיצוניות (אורך × רוחב)', 'Outside size (length × width)'),
      chainS: B('שרשרת קצרה (כל אחת)', 'Short chain (each)'), chainL: B('שרשרת ארוכה (כל אחת)', 'Long chain (each)'), links: B('חוליות', 'links'),
      shaft: B('אורך ציר נדרש', 'Shaft length needed'), speed: B('מהירות נסיעה מרבית', 'Top driving speed'), kmh: B('קמ"ש', 'km/h')
    },
    checksH: B('בדיקות', 'Checks'),
    toBuild: B('המידות מוכנות, עברו להרכבה', 'Dimensions are set, go to assembly'), fixFirst: B('אחת הבדיקות אדומה. אפשר להמשיך, אבל לרובוט במידות האלה יש בעיה.', 'A check is red. You can continue, but a robot of these dimensions has a problem.'),
    step: B('שלב', 'Step'), of: B('מתוך', 'of'), next: B('הרכיבו את השלב הזה', 'Assemble this step'), back: B('פרקו שלב אחד', 'Take one step apart'),
    all: B('הרכיבו הכול', 'Assemble everything'), restart: B('התחילו מחדש', 'Start again'), done: B('הרובוט מורכב!', 'The robot is assembled!'),
    doneText: B('סובבו אותו, הפעילו את המנועים, ולחצו על כל חלק כדי לראות מה תפקידו.', 'Turn it round, run the motors, and click any part to see what it does.'),
    uses: B('החלקים בשלב הזה', 'Parts in this step'), stepsH: B('כל השלבים', 'All the steps'),
    explode: B('פירוק', 'Explode'), run: B('הפעלת מנועים', 'Run the motors'), bed: B('ערוגה', 'Crop bed'), labels: B('מידות', 'Dimensions'), view: B('איפוס מבט', 'Reset view'),
    hint: B('החזיקו את המקש הימני כדי לסובב את המבט, החזיקו את הגלגלת כדי להזיז אותו, וגללו כדי לקרב ולהרחיק. לחצו על חלק כדי לראות פרטים.', 'Hold the right button to turn the view, hold the wheel to move it, scroll to zoom. Click a part for details.'),
    role: B('מה הוא עושה', 'What it does'), to: B('לאן הוא מתחבר', 'Where it connects'), qty: B('כמות', 'Quantity'),
    inBox: B('מה יש בקופסת הבקרה', 'What is inside the control box'),
    partsLead: B('החלקים שדרושים לרובוט במידות שבחרתם. לחצו על שורה כדי לראות את הפרטים.', 'The parts a robot of the chosen dimensions needs. Click a row for details.'),
    part: B('חלק', 'Part'), inBoxList: B('ובתוך קופסת הבקרה', 'And inside the control box'),
    loading: B('טוען את התצוגה התלת-ממדית...', 'Loading the 3D view...'),
    noThree: B('התצוגה התלת-ממדית לא נטענה. בפעם הראשונה היא צריכה חיבור לאינטרנט, או את הקובץ three.min.js שבתיקייה js/vendor. המידות, הבדיקות ורשימת החלקים עובדות גם בלי התצוגה.',
      'The 3D view did not load. It needs an internet connection the first time, or the file three.min.js in the folder js/vendor. The dimensions, checks and parts list work without the view.')
  };

  function load() { try { return JSON.parse(localStorage.getItem('pico.robot')) || {}; } catch (e) { return {}; } }
  function save(st) { try { localStorage.setItem('pico.robot', JSON.stringify({ dims: st.dims, step: st.step, mode: 'guided' })); } catch (e) { /* ignore */ } }
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }

  var threeWaiters = null;
  function loadThree(cb) {
    if (window.THREE) return cb(true);
    if (threeWaiters) return threeWaiters.push(cb);
    threeWaiters = [cb];
    var i = 0;
    (function attempt() {
      if (i >= THREE_URLS.length) { var w = threeWaiters; threeWaiters = null; return w.forEach(function (f) { f(false); }); }
      var s = document.createElement('script');
      s.src = THREE_URLS[i++];
      s.onload = function () { var w = threeWaiters; threeWaiters = null; w.forEach(function (f) { f(!!window.THREE); }); };
      s.onerror = function () { s.remove(); attempt(); };
      document.head.appendChild(s);
    })();
  }

  P.viewRobot = function (app) {
    var saved = load(), st = { dims: {}, step: 0, tab: 'dims', explode: 0, run: false, bed: true, labels: true };
    Object.keys(RB.DEFAULTS).forEach(function (k) {
      var v = saved.dims && +saved.dims[k], lim = RB.LIMITS[k];
      st.dims[k] = v >= lim[0] && v <= lim[1] ? v : RB.DEFAULTS[k];
    });
    st.step = Math.max(0, Math.min(RB.STEPS.length, saved.step | 0));
    if (st.step > 0) st.tab = 'build';

    app.className = 'page';
    var mode = saved.mode === 'guided' ? 'guided' : 'free';
    document.body.classList.toggle('rf-full', mode === 'free');     // free build takes the whole screen, with no page scrolling
    if (mode === 'free') {
      app.innerHTML = '<div id="rb-root" class="rf-root"></div>';
      return P.viewRobotFree(document.getElementById('rb-root'), loadThree, function () {
        var cur = load(); cur.mode = 'guided';
        try { localStorage.setItem('pico.robot', JSON.stringify(cur)); } catch (err) { /* ignore */ }
        P.viewRobot(app);
      });
    }
    app.innerHTML = '<h1>' + T(L.h) + '</h1><div class="chips rb-modes" id="rb-modes">' + ['free', 'guided'].map(function (m) {
      return '<button type="button" class="chip' + (m === mode ? ' on' : '') + '" data-mode="' + m + '">' + T(L.modes[m]) + '</button>';
    }).join('') + '</div><div id="rb-root"></div>';
    document.getElementById('rb-modes').addEventListener('click', function (e) {
      var b = e.target.closest('[data-mode]'), cur = load();
      if (!b || b.getAttribute('data-mode') === mode) return;
      cur.mode = b.getAttribute('data-mode');
      try { localStorage.setItem('pico.robot', JSON.stringify(cur)); } catch (err) { /* ignore */ }
      P.viewRobot(app);
    });
    var root = document.getElementById('rb-root');
    if (mode === 'free') return P.viewRobotFree(root, loadThree);
    root.innerHTML = '<p class="lead" style="margin-top:6px">' + T(L.lead) + '</p>' +
      '<div class="rb"><div class="rb-view card"><div class="rb-canvas" id="rb-canvas"><p class="muted rb-msg">' + T(L.loading) + '</p></div>' +
      '<div class="rb-tools"><label>' + T(L.explode) + ' <input type="range" id="rb-explode" min="0" max="100" value="0"></label>' +
      '<button type="button" class="chip" id="rb-run">▶ ' + T(L.run) + '</button><button type="button" class="chip on" id="rb-bed">' + T(L.bed) + '</button>' +
      '<button type="button" class="chip on" id="rb-labels">' + T(L.labels) + '</button><button type="button" class="chip" id="rb-reset">' + T(L.view) + '</button></div>' +
      '<p class="muted rb-hint">' + T(L.hint) + '</p><div id="rb-info"></div></div>' +
      '<div class="rb-side"><div class="chips rb-tabs" id="rb-tabs">' + ['dims', 'build', 'parts'].map(function (t) {
        return '<button type="button" class="chip" data-tab="' + t + '">' + T(L['tab' + t.charAt(0).toUpperCase() + t.slice(1)]) + '</button>';
      }).join('') + '</div><div id="rb-panel"></div></div></div>';

    var panel = document.getElementById('rb-panel'), info = document.getElementById('rb-info'), host = document.getElementById('rb-canvas');
    var view = null;       // the 3D side, once three.js is in

    /* ---------- panels ---------- */
    function checksHtml(o) {
      return '<ul class="checks">' + o.checks.map(function (c) { return '<li class="ck ' + c.lvl + '"><span class="ck-dot"></span><span>' + esc(T(c.t)) + '</span></li>'; }).join('') + '</ul>';
    }
    function resultsHtml(o) {
      var rows = [
        [L.r.clearRails, f1(o.clearRails) + ' ' + T(L.cm)], [L.r.clearMotors, f1(o.clearMotors) + ' ' + T(L.cm)], [L.r.clearH, f1(o.clearH) + ' ' + T(L.cm)],
        [L.r.overall, f1(o.overallL) + ' × ' + f1(o.overallW) + ' ' + T(L.cm)],
        [L.r.chainS, f1(o.linksS * 1.27) + ' ' + T(L.cm) + ' (' + o.linksS + ' ' + T(L.r.links) + ')'], [L.r.chainL, f1(o.linksL * 1.27) + ' ' + T(L.cm) + ' (' + o.linksL + ' ' + T(L.r.links) + ')'],
        [L.r.shaft, f1(o.shaft) + ' ' + T(L.cm)], [L.r.speed, f1(o.kmh) + ' ' + T(L.r.kmh)]
      ];
      return '<table class="tbl rb-res"><tbody>' + rows.map(function (r) { return '<tr><td>' + T(r[0]) + '</td><td><b class="ltr">' + esc(r[1]) + '</b></td></tr>'; }).join('') + '</tbody></table>' +
        '<h3>' + T(L.cutsH) + '</h3><table class="tbl rb-res"><tbody>' + o.cuts.map(function (c) {
          return '<tr><td>' + T(c.what) + '</td><td><b class="ltr">' + c.n + ' × ' + f1(c.len) + '</b> ' + T(L.cm) + '</td></tr>';
        }).join('') + '<tr><td><b>' + T(L.total) + '</b></td><td><b class="ltr">' + f1(o.profile / 100) + ' m</b></td></tr></tbody></table>';
    }
    function dimsPanel() {
      var o = RB.compute(st.dims);
      panel.innerHTML = '<h2>' + T(L.dimsH) + '</h2><p>' + T(L.dimsLead) + '</p><div class="card rb-dims">' + Object.keys(RB.DEFAULTS).map(function (k) {
        var lim = RB.LIMITS[k];
        return '<div class="rb-dim"><label for="rb-d-' + k + '"><b>' + T(L.d[k][0]) + '</b><small class="muted">' + T(L.d[k][1]) + '</small></label>' +
          '<div class="rb-dim-in"><input type="range" id="rb-d-' + k + '" data-k="' + k + '" min="' + lim[0] + '" max="' + lim[1] + '" step="0.5" value="' + st.dims[k] + '">' +
          '<input type="number" data-k="' + k + '" min="' + lim[0] + '" max="' + lim[1] + '" step="0.5" value="' + st.dims[k] + '" aria-label="' + esc(T(L.d[k][0])) + '"><span class="muted">' + T(L.cm) + '</span></div></div>';
      }).join('') + '<button type="button" class="btn ghost small" id="rb-defaults">' + T(L.reset) + '</button></div>' +
        '<h3>' + T(L.checksH) + '</h3><div class="card" id="rb-checks">' + checksHtml(o) + '</div>' +
        '<h3>' + T(L.resH) + '</h3><div class="card tbl-wrap" id="rb-results" style="padding:8px 12px">' + resultsHtml(o) + '</div>' +
        '<p class="muted" id="rb-fix"' + (o.ok ? ' hidden' : '') + '>' + T(L.fixFirst) + '</p>' +
        '<button type="button" class="btn" id="rb-go" style="margin-top:12px">' + T(L.toBuild) + '</button>';
    }
    function partChip(id) { return '<button type="button" class="chip rb-part" data-part="' + id + '">' + esc(T(RB.PARTS[id].name)) + '</button>'; }
    function buildPanel() {
      var n = RB.STEPS.length, cur = RB.STEPS[st.step], html = '<h2>' + T(L.tabBuild).replace(/^\d\.\s*/, '') + '</h2>';
      if (cur) {
        html += '<div class="card rb-step"><div class="eyebrow">' + T(L.step) + ' ' + (st.step + 1) + ' ' + T(L.of) + ' ' + n + '</div><h3>' + esc(T(cur.title)) + '</h3><p>' + esc(T(cur.text)) + '</p>' +
          '<p class="muted" style="margin-bottom:6px">' + T(L.uses) + ':</p><div class="chips" style="margin:0 0 12px">' + cur.parts.map(partChip).join('') + '</div>' +
          '<button type="button" class="btn" id="rb-next">' + T(L.next) + '</button></div>';
      } else {
        html += '<div class="card rb-step expect"><h3>' + T(L.done) + '</h3><p>' + T(L.doneText) + '</p></div>';
      }
      html += '<div class="rb-acts">' + (st.step > 0 ? '<button type="button" class="btn ghost small" id="rb-back">' + T(L.back) + '</button><button type="button" class="btn ghost small" id="rb-restart">' + T(L.restart) + '</button>' : '') +
        (cur ? '<button type="button" class="btn ghost small" id="rb-all">' + T(L.all) + '</button>' : '') + '</div>' +
        '<h3>' + T(L.stepsH) + '</h3><ol class="rb-steps">' + RB.STEPS.map(function (s, i) {
          return '<li class="' + (i < st.step ? 'done' : i === st.step ? 'cur' : '') + '">' + esc(T(s.title)) + '</li>';
        }).join('') + '</ol>';
      panel.innerHTML = html;
    }
    function partsPanel() {
      /* the same count the free build makes, for the example robot at these dimensions */
      var D = P.robotDesign, bm = D.analyse(D.template(st.dims)).bom;
      var rows = bm.rows.filter(function (r) { return r.used > 0; }).map(function (r) {
        var q = r.unit ? (Math.round(r.used * 100) / 100) + ' ' + r.unit : String(r.used);
        return '<tr' + (RB.PARTS[r.id] ? ' class="rb-row" data-part="' + r.id + '" tabindex="0"' : '') + '><td><b>' + esc(T(r.name)) + '</b></td><td class="ltr">' + q + '</td></tr>';
      }).join('');
      panel.innerHTML = '<h2>' + T(L.tabParts).replace(/^\d\.\s*/, '') + '</h2><p>' + T(L.partsLead) + '</p><div class="card tbl-wrap" style="padding:8px 12px"><table class="tbl"><thead><tr><th>' + T(L.part) + '</th><th>' + T(L.qty) + '</th></tr></thead><tbody>' +
        rows + '</tbody></table></div><h3>' + T(L.inBoxList) + '</h3><div class="chips" style="margin:0">' + RB.ELECTRONICS.map(partChip).join('') + '</div>';
    }
    function showPart(id) {
      if (id === 'control') {
        info.innerHTML = '<div class="card rb-card"><h3>' + T(L.inBox) + '</h3><div class="chips" style="margin:0">' + RB.ELECTRONICS.map(partChip).join('') + '</div></div>';
        return;
      }
      var p = RB.PARTS[id];
      if (!p) { info.innerHTML = ''; return; }
      info.innerHTML = '<div class="card rb-card"><h3>' + esc(T(p.name)) + '</h3><p><b>' + T(L.role) + ':</b> ' + esc(T(p.role)) + '</p><p><b>' + T(L.to) + ':</b> ' + esc(T(p.to)) + '</p></div>';
    }
    function renderPanel() {
      Array.prototype.forEach.call(document.getElementById('rb-tabs').children, function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === st.tab); });
      if (st.tab === 'dims') dimsPanel(); else if (st.tab === 'build') buildPanel(); else partsPanel();
      if (view) view.sync(false);
    }

    /* ---------- events ---------- */
    document.getElementById('rb-tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]');
      if (b) { st.tab = b.getAttribute('data-tab'); renderPanel(); }
    });
    function setDim(k, v) {
      var lim = RB.LIMITS[k];
      if (isNaN(v)) return;
      st.dims[k] = Math.max(lim[0], Math.min(lim[1], v));
      Array.prototype.forEach.call(panel.querySelectorAll('[data-k="' + k + '"]'), function (el) { if (document.activeElement !== el || el.type === 'range') el.value = st.dims[k]; });
      var o = RB.compute(st.dims);
      document.getElementById('rb-checks').innerHTML = checksHtml(o);
      document.getElementById('rb-results').innerHTML = resultsHtml(o);
      document.getElementById('rb-fix').hidden = o.ok;
      save(st);
      if (view) view.rebuild();
    }
    panel.addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (k) setDim(k, parseFloat(e.target.value)); });
    panel.addEventListener('click', function (e) {
      var t = e.target.closest('button, .rb-row');
      if (!t) return;
      if (t.id === 'rb-defaults') { Object.keys(RB.DEFAULTS).forEach(function (k) { st.dims[k] = RB.DEFAULTS[k]; }); save(st); renderPanel(); if (view) view.rebuild(); }
      else if (t.id === 'rb-go') { st.tab = 'build'; renderPanel(); }
      else if (t.id === 'rb-next') { st.step++; save(st); buildPanel(); if (view) view.sync(true); }
      else if (t.id === 'rb-back') { st.step--; save(st); buildPanel(); if (view) view.sync(false); }
      else if (t.id === 'rb-restart') { st.step = 0; save(st); buildPanel(); if (view) view.sync(false); }
      else if (t.id === 'rb-all') { st.step = RB.STEPS.length; save(st); buildPanel(); if (view) view.sync(false); }
      else if (t.getAttribute('data-part')) showPart(t.getAttribute('data-part'));
    });
    info.addEventListener('click', function (e) { var t = e.target.closest('[data-part]'); if (t) showPart(t.getAttribute('data-part')); });
    document.getElementById('rb-explode').addEventListener('input', function () { st.explode = this.value / 100; if (view) view.sync(false); });
    function toggle(id, key) {
      document.getElementById(id).addEventListener('click', function () { st[key] = !st[key]; this.classList.toggle('on', st[key]); if (view) view.sync(false); });
    }
    toggle('rb-run', 'run'); toggle('rb-bed', 'bed'); toggle('rb-labels', 'labels');
    document.getElementById('rb-reset').addEventListener('click', function () { if (view) view.resetCam(); });

    renderPanel();
    loadThree(function (ok) {
      if (!host.isConnected) return;
      if (!ok) { host.innerHTML = '<p class="callout rb-msg">' + T(L.noThree) + '</p>'; return; }
      view = P._robotView = makeView(window.THREE, host, st, showPart);
    });
  };

  /* ---------- the 3D view ---------- */
  function makeView(THREE, host, st, onPick) {
    host.innerHTML = '';
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 1, 4000);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a5a, 0.55));
    var sun = new THREE.DirectionalLight(0xffffff, 0.62); sun.position.set(120, 220, 160); scene.add(sun);
    var fill = new THREE.DirectionalLight(0xffffff, 0.2); fill.position.set(-160, 80, -120); scene.add(fill);

    /* ground, crop bed */
    var ground = new THREE.Mesh(new THREE.CircleGeometry(260, 48), new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; scene.add(ground);
    var bed = new THREE.Group(), soil = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 1 }), leaf = new THREE.MeshStandardMaterial({ color: 0x2f7d3a, roughness: 0.9 });
    var mound = new THREE.Mesh(new THREE.BoxGeometry(360, 7, 26), soil); mound.position.y = 3.5; bed.add(mound);
    for (var i = -8; i <= 8; i++) { var pl = new THREE.Mesh(new THREE.ConeGeometry(5, 13, 7), leaf); pl.position.set(i * 21, 13.5, (i % 2) * 3); bed.add(pl); }
    scene.add(bed);

    var model = null, labels = new THREE.Group(), anim = {}, theta = 0, dirty = true, rebuildQueued = false;
    scene.add(labels);

    function label(text) {
      var c = document.createElement('canvas'), g = c.getContext('2d');
      c.width = 256; c.height = 80;
      g.fillStyle = 'rgba(20,24,27,.88)'; g.beginPath();
      if (g.roundRect) g.roundRect(4, 8, 248, 64, 16); else g.rect(4, 8, 248, 64);
      g.fill();
      g.fillStyle = '#fff'; g.font = '700 40px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 42);
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
      s.scale.set(22, 6.9, 1); s.renderOrder = 10;
      return s;
    }
    function dimLine(a, b, text) {
      var mat = new THREE.LineBasicMaterial({ color: 0xff4d6d, depthTest: false });
      var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], a[1], a[2]), new THREE.Vector3(b[0], b[1], b[2])]), mat);
      line.renderOrder = 9; labels.add(line);
      var s = label(text); s.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); labels.add(s);
    }
    function makeLabels(o) {
      while (labels.children.length) { var ch = labels.children.pop(); if (ch.material.map) ch.material.map.dispose(); ch.material.dispose(); if (ch.geometry) ch.geometry.dispose(); }
      var d = o.d, zs = d.W / 2 + 34, f = function (v) { return (Math.round(v * 10) / 10) + ''; };
      dimLine([-d.L / 2, d.H + 6, zs - 30], [d.L / 2, d.H + 6, zs - 30], f(d.L));
      dimLine([d.L / 2 + 10, d.H + 6, -d.W / 2], [d.L / 2 + 10, d.H + 6, d.W / 2], f(d.W));
      dimLine([d.L / 2 + 10, 0, d.W / 2 + 4], [d.L / 2 + 10, d.H, d.W / 2 + 4], f(d.H));
      dimLine([o.xr, 2, zs], [o.xf, 2, zs], f(d.B));
    }

    function rebuildNow() {
      rebuildQueued = false;
      if (model) { Object.keys(model.groups).forEach(function (id) { scene.remove(model.groups[id]); }); model.dispose(); }
      model = RB.build(THREE, st.dims);
      Object.keys(model.groups).forEach(function (id) { scene.add(model.groups[id]); });
      makeLabels(model.o);
      target.set(0, st.dims.H * 0.48, 0);
      sync(false);
    }
    function rebuild() { if (!rebuildQueued) { rebuildQueued = true; requestAnimationFrame(rebuildNow); } }

    /* which groups show, and where; `drop` animates the newest step in */
    function sync(drop) {
      if (!model) return;
      model.setExplode(st.explode);
      var full = st.tab !== 'build';
      RB.STEPS.forEach(function (s, i) {
        var g = model.groups[s.id], vis = full ? true : i < st.step, h = g.userData.home;
        if (vis && !g.visible && drop && i === st.step - 1) anim[s.id] = 1;
        g.visible = vis;
        if (!anim[s.id]) g.position.set(h[0], h[1], h[2]);
      });
      bed.visible = st.bed; labels.visible = st.labels && st.tab === 'dims';
      dirty = true;
    }

    /* ---------- camera ---------- */
    var target = new THREE.Vector3(0, 36, 0), orb = { th: 0.9, ph: 1.18, r: 290 };
    function placeCam() {
      cam.position.set(target.x + orb.r * Math.sin(orb.ph) * Math.sin(orb.th), target.y + orb.r * Math.cos(orb.ph), target.z + orb.r * Math.sin(orb.ph) * Math.cos(orb.th));
      cam.lookAt(target); dirty = true;
    }
    function resetCam() { target.set(0, 36, 0); orb.th = 0.9; orb.ph = 1.18; orb.r = 290; placeCam(); }
    /* the same buttons as the free build: right button turns the view, the pressed wheel (or Shift) moves it,
       the left button picks a part. One finger on a touch screen turns the view */
    var el = renderer.domElement, ptrs = {}, moved = 0, pinch = 0, mode = 'none', downAt = [0, 0];
    el.style.touchAction = 'none';
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('mousedown', function (e) { if (e.button === 1) e.preventDefault(); });
    el.addEventListener('auxclick', function (e) { if (e.button === 1) e.preventDefault(); });
    el.addEventListener('pointerdown', function (e) {
      ptrs[e.pointerId] = [e.clientX, e.clientY]; moved = 0; downAt = [e.clientX, e.clientY];
      mode = e.button === 2 ? 'orbit' : e.button === 1 || e.shiftKey ? 'pan' : e.pointerType === 'touch' ? 'orbit' : 'none';
      if (e.button === 1) e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    function pan(dx, dy) {
      var k = orb.r * 0.0012, right = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 0), upv = new THREE.Vector3().setFromMatrixColumn(cam.matrix, 1);
      target.addScaledVector(right, -dx * k).addScaledVector(upv, dy * k);
      target.y = Math.max(0, target.y);
    }
    el.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId];
      if (!p) return;
      var ids = Object.keys(ptrs);
      if (ids.length === 1) {
        var dx = e.clientX - p[0], dy = e.clientY - p[1];
        moved = Math.max(moved, Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]));
        if (mode === 'orbit') { orb.th -= dx * 0.008; orb.ph = Math.max(0.15, Math.min(1.52, orb.ph - dy * 0.006)); }
        else if (mode === 'pan') pan(dx, dy);
      }
      ptrs[e.pointerId] = [e.clientX, e.clientY];
      if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (pinch) orb.r = Math.max(90, Math.min(700, orb.r * pinch / dist));
        pinch = dist; moved = 99;
      }
      placeCam();
    });
    function up(e) {
      if (ptrs[e.pointerId] && moved < 8 && e.button === 0 && Object.keys(ptrs).length === 1) pick(e);
      delete ptrs[e.pointerId]; pinch = 0;
    }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', function (e) { delete ptrs[e.pointerId]; pinch = 0; });
    el.addEventListener('wheel', function (e) { e.preventDefault(); orb.r = Math.max(90, Math.min(700, orb.r * (e.deltaY > 0 ? 1.1 : 0.9))); placeCam(); }, { passive: false });

    var ray = new THREE.Raycaster();
    function pick(e) {
      var r = el.getBoundingClientRect(), m = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(m, cam);
      var objs = Object.keys(model.groups).filter(function (id) { return model.groups[id].visible; }).map(function (id) { return model.groups[id]; });
      var hit = ray.intersectObjects(objs, true)[0];
      if (hit && hit.object.userData.part) onPick(hit.object.userData.part);
    }

    function size() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); dirty = true;
    }
    if (window.ResizeObserver) new ResizeObserver(size).observe(host); else window.addEventListener('resize', size);

    var last = performance.now();
    function frame(now) {
      if (!host.isConnected) { if (model) model.dispose(); renderer.dispose(); return; }     // the page was left
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (model) {
        Object.keys(anim).forEach(function (id) {
          anim[id] = Math.max(0, anim[id] - dt * 2.2);
          var g = model.groups[id], h = g.userData.home, k = anim[id] * anim[id];
          g.position.set(h[0], h[1] + k * 60, h[2]);
          if (!anim[id]) delete anim[id];
          dirty = true;
        });
        if (st.run) { theta += dt * 3.2; model.spin(theta); dirty = true; }
      }
      if (dirty) { renderer.render(scene, cam); dirty = false; }
      requestAnimationFrame(frame);
    }
    size(); placeCam(); rebuildNow(); requestAnimationFrame(frame);
    return { rebuild: rebuild, sync: sync, resetCam: resetCam, _dbg: { scene: scene, cam: cam, orb: orb, place: placeCam, model: function () { return model; } } };
  }
})(window.PICO);
