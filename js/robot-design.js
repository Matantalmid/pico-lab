/* The free-build workshop: the rules, with no drawing in this file.
   A design is { v, seq, parts: [...] }. There are two kinds of part:
   - free parts (profile, deck) carry their own position;
   - every other part hangs on another part through `on` (or `a`/`b`) and
     gets its position from it, so moving a parent carries its children.
   analyse(design) resolves every position and returns what is wrong:
   `blocks` (cannot exist in reality: the edit is refused) and `issues`
   (allowed while building, but the robot is not finished).
   Everything is axis-aligned and in centimetres. x = forward, y = up, z = across. */
(function (P) {
  'use strict';
  var RB = P.robot, B = function (he, en) { return { he: he, en: en }; };
  var R = RB.R, PITCH = RB.PITCH, BEAR_H = RB.BEAR_H, pd = RB.pd;
  var AXI = { x: 0, y: 1, z: 2 }, AXN = ['x', 'y', 'z'], EPS = 0.06, LEG = 3.6;
  var BOXES = { battery: [25, 17, 20], control: [24, 15, 12] };     // along the profile, out from the face, across
  var MARGIN = { bearing: 6.35, motor: 5, battery: 2, control: 2, estop: 2.4 };
  var SLOT = { bearing: 1, motor: 1, battery: 1, control: 1, estop: 1 };
  var MOTOR_NM = 250 / (RB.MOTOR_RPM * 2 * Math.PI / 60);            // rated torque, from 250 W at 75 rpm
  var KG = { profile: 0.016, bracket: 0.06, bearing: 0.7, shaft: 0.0247, wheel: 3.6, motor: 2.3, battery: 6.5, control: 1.5, estop: 0.1, coupling: 0.3, chain: 0.007, idler: 0.2, deck: 0.0006 };

  var NAMES = {
    profile: B('פרופיל', 'profile'), bracket: B('זווית', 'bracket'), bearing: B('מיסב', 'bearing'), shaft: B('ציר', 'shaft'),
    sprocket: B('גלגל שיניים', 'sprocket'), wheel: B('גלגל', 'wheel'), motor: B('מנוע', 'motor'), chain: B('שרשרת', 'chain'),
    idler: B('גלגל מתיחה', 'idler'), battery: B('מצבר', 'battery'), control: B('קופסת בקרה', 'control box'), estop: B('לחצן חירום', 'emergency stop'), deck: B('משטח', 'deck'), coupling: B('מצמד', 'coupling')
  };
  var MSG = {
    noParent: B('החלק שאליו היה מחובר החלק הזה כבר לא קיים.', 'The part this was attached to no longer exists.'),
    endFace: B('החלק הזה מתחבר רק לפאה עם חריץ, ולא לקצה של הפרופיל.', 'This mounts on a slotted face, not on the end of the profile.'),
    offProfile: B('החלק חורג מקצה הפרופיל.', 'The part runs past the end of the profile.'),
    shaftOut: B('הציר יצא מהמיסב שאמור להחזיק אותו.', 'The shaft has left the bearing that holds it.'),
    sprOut: B('גלגל השיניים חורג מקצה הציר.', 'The sprocket runs past the end of the shaft.'),
    teeth: B('מספר השיניים חייב להיות בין 9 ל-45.', 'The tooth count must be between 9 and 45.'),
    noJoint: B('זווית מתחברת רק בפינה שבין שני פרופילים שנוגעים זה בזה.', 'A bracket only fits in the corner between two touching profiles.'),
    plane: B('שני גלגלי השיניים אינם באותו מישור, ושרשרת לא יכולה להתעקם הצידה.', 'The two sprockets are not in the same plane. A chain does not bend sideways.'),
    sameShaft: B('שני גלגלי השיניים יושבים על אותו ציר.', 'Both sprockets sit on the same shaft.'),
    tooClose: B('גלגלי השיניים קרובים מדי, והשיניים שלהם נוגעות זו בזו.', 'The sprockets are too close: their teeth touch.'),
    sprBusy: B('על כל גלגל שיניים יכולה לשבת רק שרשרת אחת.', 'One sprocket carries only one chain.'),
    ground: B('החלק יורד אל מתחת לקרקע.', 'The part goes below the ground.'),
    size: B('המידה הזו אינה מותרת.', 'That size is not allowed.'),
    needProfile: B('החלק הזה מתחבר לפאה של פרופיל.', 'This part mounts on the face of a profile.'),
    needBearing: B('ציר צריך להיות מושחל דרך מיסב.', 'A shaft slides through a bearing.'),
    bearingFull: B('במיסב הזה כבר יש ציר.', 'This bearing already has a shaft.'),
    needShaft: B('גלגל שיניים חייב לשבת על ציר, או על ציר של מנוע.', 'A sprocket must sit on a shaft, or on a motor shaft.'),
    wheelShaft: B('גלגל מורכב על הקצה של ציר.', 'A wheel mounts on the end of a shaft.'),
    profFree: B('הניחו את הפרופיל על הקרקע או על פרופיל אחר.', 'Put a profile on the ground or on another profile.'),
    deckTop: B('משטח מניחים על הפאה העליונה של פרופיל.', 'A deck goes on the top face of a profile.'),
    needChain: B('גלגל מתיחה מתחבר לשרשרת.', 'An idler goes on a chain.'),
    needSprocket: B('שרשרת מחברת שני גלגלי שיניים.', 'A chain joins two sprockets.'),
    hasChildren: B('יש חלקים שמחוברים לפרופיל הזה. הסירו אותם לפני שאתם מסובבים אותו.', 'Parts are attached to this profile. Remove them before turning it.'),
    rotTied: B('אי אפשר לסובב את החלק, כי הוא קשור לחלק שנשאר במקומו (שרשרת, זווית או ציר).', 'Cannot turn this: a part that turns is tied to a part that stays (a chain, a bracket or a shaft).'),
    needCoupling: B('מצמד מחבר ציר של מנוע לציר אחר. לחצו על מנוע ועל ציר.', 'A coupling joins a motor shaft to another shaft: click a motor and a shaft.'),
    coupAxis: B('הציר והמנוע אינם פונים לאותו כיוון, ומצמד מחבר רק צירים שנמצאים על אותו קו.', 'The shaft and the motor do not point the same way. A coupling only joins shafts on one line.'),
    coupSide: B('הציר נמצא מאחורי המנוע. הפכו את כיוון המנוע ("הפוך כיוון"), או העבירו אותו לצד השני.', 'The shaft is behind the motor. Flip the motor ("Flip direction"), or move it to the other side.'),
    coupFar: B('הציר רחוק מדי מהמנוע, כי המנוע יכול לזוז לכל היותר 15 ס"מ לאורך הציר שלו. קרבו אותם זה לזה.', 'The shaft is too far from the motor: the motor moves at most 15 cm along its shaft. Bring them closer.'),
    coupAlign: B('הציר של המנוע והציר השני כבר אינם על אותו קו, ולכן המצמד לא מחזיק.', 'The motor shaft and the shaft are no longer on one line, so the coupling does not hold.'),
    coupGap: B('קצה הציר יצא מהמצמד.', 'The end of the shaft has left the coupling.'),
    motorBusy: B('על הציר של המנוע כבר יש גלגל שיניים או מצמד.', 'The motor shaft already carries a sprocket or a coupling.'),
    coupFull: B('במצמד הזה כבר יש ציר.', 'This coupling already holds a shaft.'),
    coupNoMotor: B('אין מנוע שאפשר ליישר מול הציר הזה. גררו את המצמד אל אחד המנועים.', 'No motor can be lined up with this shaft. Drag the coupling onto a motor.'),
    shaftBusy: B('הקצה הזה של הציר כבר מחובר למצמד.', 'This end of the shaft is already coupled.'),
    rotDeck: B('המשטח תמיד נשאר אופקי, ולכן אפשר לסובב אותו רק סביב הציר האנכי.', 'A deck stays level. It only turns about the upright axis.')
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function snap(v, g) { g = g || 0.5; return Math.round(v / g) * g; }
  function face(f) { return { k: AXI[f.charAt(1)], sg: f.charAt(0) === '-' ? -1 : 1 }; }
  function faceStr(k, sg) { return (sg < 0 ? '-' : '+') + AXN[k]; }
  function boxOf(c, h) { return { min: [c[0] - h[0], c[1] - h[1], c[2] - h[2]], max: [c[0] + h[0], c[1] + h[1], c[2] + h[2]] }; }
  function centre(b) { return [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2]; }
  function overlap(a, b, e) { for (var k = 0; k < 3; k++) if (Math.min(a.max[k], b.max[k]) - Math.max(a.min[k], b.min[k]) <= e) return false; return true; }
  /* do two solid parts share space? Round parts (shaft, sprocket, wheel) are tested as circles, not as their boxes */
  /* a corner bracket is a triangle, not a box: test the other part against the real wedge */
  function wedge(br, o, e) {
    var c = br.c, d1 = br.d1, d2 = br.d2, t = 3 - d1.k - d2.k;
    function lo(dd) { return Math.max(0, dd.sg > 0 ? o.box.min[dd.k] - c[dd.k] : c[dd.k] - o.box.max[dd.k]); }
    if (!o.rad) return lo(d1) + lo(d2) < LEG - e;
    var cyls = o.type === 'sprocket' ? [[o.rad, 0.36], [1.9, 1]] : [[o.rad, (o.box.max[o.axis] - o.box.min[o.axis]) / 2]], i = (o.axis + 1) % 3, j = (o.axis + 2) % 3, p = [0, 0, 0];
    for (var n = 0; n < cyls.length; n++) for (var iz = -2; iz <= 2; iz++) for (var ir = 1; ir <= 4; ir++) for (var ia = 0; ia < 32; ia++) {
      var rr = cyls[n][0] * ir / 4, an = ia * Math.PI / 16;
      p[o.axis] = o.c[o.axis] + cyls[n][1] * iz / 2; p[i] = o.c[i] + rr * Math.cos(an); p[j] = o.c[j] + rr * Math.sin(an);
      var u = (p[d1.k] - c[d1.k]) * d1.sg, v = (p[d2.k] - c[d2.k]) * d2.sg;
      if (u > e && v > e && u + v < LEG - e && Math.abs(p[t] - c[t]) < 1.7 - e) return true;
    }
    return false;
  }
  function hits(a, b, e) {
    if (!overlap(a.box, b.box, e)) return false;
    var k, dd = 0, q;
    if ((a.type === 'bracket') !== (b.type === 'bracket')) return a.type === 'bracket' ? wedge(a, b, e) : wedge(b, a, e);
    if (a.rad && b.rad && a.axis === b.axis) {
      for (k = 0; k < 3; k++) if (k !== a.axis) dd += (a.c[k] - b.c[k]) * (a.c[k] - b.c[k]);
      return Math.sqrt(dd) < a.rad + b.rad - e;
    }
    var r = a.rad ? a : b.rad ? b : null, o = r === a ? b : a;
    if (!r) return true;
    for (k = 0; k < 3; k++) if (k !== r.axis) { q = Math.max(o.box.min[k], Math.min(r.c[k], o.box.max[k])) - r.c[k]; dd += q * q; }
    return Math.sqrt(dd) < r.rad - e;
  }
  function parents(p) { return p.on ? [p.on.id] : (p.a ? [p.a, p.b] : []); }
  function newDesign() { return { v: 1, seq: 0, parts: [] }; }
  function push(d, part) { part.id = (part.type === 'chain' ? 'c' : 'p') + (++d.seq); d.parts.push(part); return part.id; }
  function find(d, id) { for (var i = 0; i < d.parts.length; i++) if (d.parts[i].id === id) return d.parts[i]; return null; }

  /* which face of a box a point lies on */
  function faceAt(g, pt) {
    var c = centre(g.box), best = 0, bv = -1;
    for (var k = 0; k < 3; k++) { var v = Math.abs(pt[k] - c[k]) / ((g.box.max[k] - g.box.min[k]) / 2 || 1); if (v > bv) { bv = v; best = k; } }
    return { k: best, sg: pt[best] >= c[best] ? 1 : -1 };
  }

  /* ---------- how two touching profiles meet, and where a bracket fits ---------- */
  function joint(A, Bp) {
    var J = null;
    for (var k = 0; k < 3 && !J; k++) {
      var sg = Math.abs(A.box.max[k] - Bp.box.min[k]) < 0.05 ? 1 : Math.abs(A.box.min[k] - Bp.box.max[k]) < 0.05 ? -1 : 0, ok = true;
      if (!sg) continue;
      for (var m = 0; m < 3; m++) if (m !== k && Math.min(A.box.max[m], Bp.box.max[m]) - Math.max(A.box.min[m], Bp.box.min[m]) < 0.5) ok = false;
      if (!ok) continue;
      var aEnd = A.ax === k, bEnd = Bp.ax === k;
      if (aEnd && bEnd) return { type: 'butt', spots: [] };
      if (A.ax === Bp.ax) return { type: 'par', spots: [] };
      J = aEnd ? endSide(A, Bp, k, sg) : bEnd ? endSide(Bp, A, k, -sg) : cross(A, Bp, k, sg);
    }
    if (!J) {                                       // profiles at right angles that touch only along an edge still make an inside corner
      if (A.ax === Bp.ax) return null;
      for (var q = 0; q < 3; q++) if (Math.min(A.box.max[q], Bp.box.max[q]) - Math.max(A.box.min[q], Bp.box.min[q]) < -0.05) return null;
      J = { type: 'edge', spots: [] };
    }
    moreSpots(J, A, Bp);
    return J.spots.some(Boolean) || J.type !== 'edge' ? J : null;
  }
  /* every other inside corner between two profiles at right angles where a bracket fits.
     A bracket has one leg flat on a face of P and one flat on a face of Q; each leg needs LEG cm of that face.
     The first spots (from endSide / cross) keep their order, so brackets saved earlier keep their place. */
  function moreSpots(J, A, Bp) {
    var seen = {}, e = 0.05;
    function key(c, d1, d2) { return c.map(function (v) { return Math.round(v * 20); }).join(',') + '|' + [d1.k + ':' + d1.sg, d2.k + ':' + d2.sg].sort().join(','); }
    J.spots.forEach(function (sp) { if (sp) seen[key(sp.c, sp.d1, sp.d2)] = 1; });
    [[A, Bp], [Bp, A]].forEach(function (pq) {
      var Pp = pq[0], Q = pq[1];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        if (i === j) continue;
        [1, -1].forEach(function (si) {
          [1, -1].forEach(function (sj) {
            var c = [0, 0, 0], t = 3 - i - j, lo, hi, a, b;
            c[j] = sj > 0 ? Pp.box.max[j] : Pp.box.min[j];       // leg 1 lies on P's face, along i
            c[i] = si > 0 ? Q.box.max[i] : Q.box.min[i];          // leg 2 lies on Q's face, along j
            lo = Math.max(Pp.box.min[t], Q.box.min[t]); hi = Math.min(Pp.box.max[t], Q.box.max[t]);
            if (hi - lo < 3.4 - e) return;
            c[t] = (lo + hi) / 2;
            a = [c[i], c[i] + si * LEG]; b = [c[j], c[j] + sj * LEG];
            if (Math.min(a[0], a[1]) < Pp.box.min[i] - e || Math.max(a[0], a[1]) > Pp.box.max[i] + e) return;
            if (Math.min(b[0], b[1]) < Q.box.min[j] - e || Math.max(b[0], b[1]) > Q.box.max[j] + e) return;
            var d1 = { k: i, sg: si }, d2 = { k: j, sg: sj }, kk = key(c, d1, d2);
            if (seen[kk]) return;
            seen[kk] = 1;
            J.spots.push({ c: c, d1: d1, d2: d2 });
          });
        });
      }
    });
  }
  function room(S, m, at, dir) { return (dir > 0 ? S.box.max[m] - at : at - S.box.min[m]) >= 2 + LEG - 0.05; }
  function endSide(E, S, k, sg) {          // the end of E sits on a side face of S, which lies on the sg side
    var e = E.c.slice(), spots = [], m = S.ax;
    e[k] += sg * E.len / 2;
    [1, -1].forEach(function (dir) {
      if (!room(S, m, E.c[m], dir)) return spots.push(null);
      var c = e.slice(); c[m] += dir * 2;
      spots.push({ c: c, d1: { k: m, sg: dir }, d2: { k: k, sg: -sg } });
    });
    return { type: 'tee', spots: spots };
  }
  function cross(A, Bp, k, sg) {           // two side faces, profiles at right angles; Bp lies on the sg side of A
    var m = [0, 0, 0], spots = [];
    m[A.ax] = Bp.c[A.ax]; m[Bp.ax] = A.c[Bp.ax]; m[k] = sg > 0 ? A.box.max[k] : A.box.min[k];
    [[Bp, -sg], [A, sg]].forEach(function (q) {
      [1, -1].forEach(function (dir) {
        var S = q[0];
        if (!room(S, S.ax, m[S.ax], dir)) return spots.push(null);
        var c = m.slice(); c[S.ax] += dir * 2;
        spots.push({ c: c, d1: { k: S.ax, sg: dir }, d2: { k: k, sg: q[1] } });
      });
    });
    return { type: 'cross', spots: spots };
  }

  /* ---------- where every part is ---------- */
  function resolve(d) {
    var byId = {}, G = {};
    d.parts.forEach(function (p) { byId[p.id] = p; });
    function get(id) {
      if (G[id]) return G[id];
      var p = byId[id];
      if (!p) return null;
      G[id] = { id: id, type: p.type, part: p, bad: 'noParent' };       // stands in while resolving, so a loop cannot hang
      var g = geo(p) || { bad: 'noParent' };
      g.id = id; g.type = p.type; g.part = p;
      return (G[id] = g);
    }
    function good(id, type) { var g = get(id); return g && !g.bad && (!type || type.indexOf(g.type) >= 0) ? g : null; }
    function slot(p) {
      var pg = good(p.on.id, ['profile']);
      if (!pg) return null;
      var f = face(p.on.f);
      if (f.k === pg.ax) return { bad: 'endFace' };
      if (Math.abs(p.on.s) > pg.len / 2 - MARGIN[p.type] + 1e-6) return { bad: 'offProfile' };
      var b = pg.c.slice(); b[pg.ax] += p.on.s; b[f.k] += f.sg * 2;
      return { a: pg.ax, k: f.k, sg: f.sg, t: 3 - pg.ax - f.k, b: b, pg: pg };
    }
    function geo(p) {
      var h, c, s, pg, mn, mx, t;
      if (p.type === 'profile') {
        if (!(p.len >= 4 && p.len <= 300)) return { bad: 'size' };
        h = [2, 2, 2]; h[AXI[p.ax]] = p.len / 2;
        return { c: p.p.slice(), ax: AXI[p.ax], len: p.len, box: boxOf(p.p, h) };
      }
      if (p.type === 'deck') {
        if (!(p.lx >= 10 && p.lx <= 200 && p.lz >= 10 && p.lz <= 200)) return { bad: 'size' };
        c = [p.p[0], p.p[1] + 0.4, p.p[2]];
        return { c: c, box: boxOf(c, [p.lx / 2, 0.4, p.lz / 2]) };
      }
      if (p.type === 'bracket') {
        var ga = good(p.a, ['profile']), gb = good(p.b, ['profile']), j = ga && gb && joint(ga, gb), sp = j && j.spots[p.k];
        if (!ga || !gb) return null;
        if (!sp) return { bad: 'noJoint' };
        t = 3 - sp.d1.k - sp.d2.k; mn = sp.c.slice(); mx = sp.c.slice();
        [sp.d1, sp.d2].forEach(function (dd) { if (dd.sg > 0) mx[dd.k] += LEG; else mn[dd.k] -= LEG; });
        mn[t] -= 1.7; mx[t] += 1.7;
        return { c: sp.c, d1: sp.d1, d2: sp.d2, box: { min: mn, max: mx } };
      }
      if (SLOT[p.type]) {
        s = slot(p);
        if (!s || s.bad) return s;
        c = s.b.slice(); mn = c.slice(); mx = c.slice();
        if (p.type === 'bearing') {
          if (!((p.lift || 0) >= 0 && (p.lift || 0) <= 8)) return { bad: 'size' };
          c[s.k] += s.sg * (BEAR_H + (p.lift || 0));
          mn = c.slice(); mx = c.slice();
          mn[s.a] -= 6.35; mx[s.a] += 6.35; mn[s.t] -= 1.9; mx[s.t] += 1.9;
          mn[s.k] = Math.min(s.b[s.k], c[s.k] + s.sg * 3.3); mx[s.k] = Math.max(s.b[s.k], c[s.k] + s.sg * 3.3);
          return { c: c, axis: s.t, a: s.a, k: s.k, sg: s.sg, box: { min: mn, max: mx } };
        }
        if (p.type === 'motor') {
          var u = p.u || 0, out = p.out < 0 ? -1 : 1, lift = p.lift || 0;
          if (Math.abs(u) > 15) return { bad: 'offProfile' };
          if (!(lift >= 0 && lift <= 8)) return { bad: 'size' };
          c[s.k] += s.sg * (5.5 + lift); c[s.t] += u;
          mn = c.slice(); mx = c.slice();
          mn[s.a] -= 5; mx[s.a] += 5; mn[s.k] -= 4.9; mx[s.k] += 4.9;
          if (lift > 0) { if (s.sg > 0) mn[s.k] -= lift; else mx[s.k] += lift; }     // the spacer plates under the motor
          mn[s.t] = Math.min(c[s.t] - out * 19, c[s.t] - out * 2); mx[s.t] = Math.max(c[s.t] - out * 19, c[s.t] - out * 2);
          return { c: c, axis: s.t, a: s.a, k: s.k, sg: s.sg, out: out, pz: s.pg.c[s.t], box: { min: mn, max: mx } };
        }
        if (p.type === 'estop') {
          c[s.k] += s.sg * 1.6; h = [0, 0, 0]; h[s.a] = 2.4; h[s.t] = 2.4; h[s.k] = 1.6;
          return { c: c, a: s.a, k: s.k, sg: s.sg, box: boxOf(c, h) };
        }
        var dm = BOXES[p.type], A = p.turn ? dm[2] : dm[0], T = p.turn ? dm[0] : dm[2], v = p.v || 0;
        if (Math.abs(v) > T / 2 + 2 + 1e-6) return { bad: 'offProfile' };
        c[s.k] += s.sg * dm[1] / 2; c[s.t] += v; h = [0, 0, 0]; h[s.a] = A / 2; h[s.k] = dm[1] / 2; h[s.t] = T / 2;
        return { c: c, a: s.a, k: s.k, sg: s.sg, t: s.t, dims: [A, dm[1], T], box: boxOf(c, h) };
      }
      if (p.type === 'shaft') {
        pg = good(p.on.id, ['bearing', 'coupling']);
        if (!pg) return null;
        if (!(p.len >= 6 && p.len <= 100)) return { bad: 'size' };
        if (pg.type === 'coupling') {               // pushed into the free side of a coupling on a motor
          if (pg.shaft && pg.shaft !== p.id) return { bad: 'coupFull' };
          pg.shaft = p.id;
          c = pg.c.slice(); c[pg.axis] += pg.out * (1.6 + p.len / 2); h = [1, 1, 1]; h[pg.axis] = p.len / 2;
          return { c: c, axis: pg.axis, len: p.len, rad: 1, coup: pg.id, box: boxOf(c, h) };
        }
        if (Math.abs(p.on.s) > p.len / 2 - 1.9 + 1e-6) return { bad: 'shaftOut' };
        c = pg.c.slice(); c[pg.axis] += p.on.s; h = [1, 1, 1]; h[pg.axis] = p.len / 2;
        return { c: c, axis: pg.axis, len: p.len, rad: 1, box: boxOf(c, h) };
      }
      if (p.type === 'sprocket') {
        pg = good(p.on.id, ['shaft', 'motor']);
        if (!pg) return null;
        if (!(p.n >= 9 && p.n <= 45 && p.n === Math.round(p.n))) return { bad: 'teeth' };
        if (Math.abs(p.on.s) > (pg.type === 'shaft' ? pg.len / 2 - 1 : 1) + 1e-6) return { bad: 'sprOut' };
        c = pg.c.slice(); c[pg.axis] += p.on.s;
        var rp = pd(p.n) / 2; h = [rp + 0.32, rp + 0.32, rp + 0.32]; h[pg.axis] = 1;
        return { c: c, axis: pg.axis, n: p.n, rp: rp, rad: rp + 0.32, body: pg.id, box: boxOf(c, h) };
      }
      if (p.type === 'wheel') {
        pg = good(p.on.id, ['shaft']);
        if (!pg) return null;
        var end = p.end < 0 ? -1 : 1;
        c = pg.c.slice(); c[pg.axis] += end * (pg.len / 2 - 2); h = [R, R, R]; h[pg.axis] = 7.25;
        return { c: c, axis: pg.axis, end: end, rad: R, body: pg.id, box: boxOf(c, h) };
      }
      if (p.type === 'chain') {
        var a = good(p.a, ['sprocket']), b = good(p.b, ['sprocket']);
        if (!a || !b) return null;
        if (a.axis !== b.axis || Math.abs(a.c[a.axis] - b.c[a.axis]) > 0.1) return { bad: 'plane' };
        if (a.body === b.body) return { bad: 'sameShaft' };
        var i = (a.axis + 1) % 3, jx = (a.axis + 2) % 3, c1 = [a.c[i], a.c[jx]], c2 = [b.c[i], b.c[jx]];
        if (Math.hypot(c1[0] - c2[0], c1[1] - c2[1]) < a.rp + b.rp + 0.95) return { bad: 'tooClose' };
        var belt = RB.belt(c1, a.rp, c2, b.rp), n = RB.links(belt.len), plane = a.c[a.axis], ax = a.axis;
        return {
          axis: ax, i: i, j: jx, plane: plane, belt: belt, n: n, slack: n * PITCH - belt.len, A: a, B: b, c: [0, 0, 0].map(function (z, q) { return (a.c[q] + b.c[q]) / 2; }),
          pt: function (sv) { var q = belt.at(sv), o = [0, 0, 0]; o[i] = q[0]; o[jx] = q[1]; o[ax] = plane; return { p: o, ang: q[2] }; }
        };
      }
      if (p.type === 'coupling') {                 // a jaw coupling over the motor pin, holding the end of a shaft
        var gm = good(p.a, ['motor']), gs = p.b ? good(p.b, ['shaft']) : null;
        if (!gm || (p.b && !gs)) return null;
        var cx = gm.axis, co = gm.out;
        if (!gs) { c = gm.c.slice(); c[cx] += co * 0.9; h = [2, 2, 2]; h[cx] = 2.5; return { c: c, axis: cx, out: co, rad: 2, motor: gm.id, shaft: null, body: gm.id, box: boxOf(c, h) }; }
        if (gs.axis !== cx) return { bad: 'coupAlign' };
        for (t = 0; t < 3; t++) if (t !== cx && Math.abs(gm.c[t] - gs.c[t]) > 0.15) return { bad: 'coupAlign' };
        var gap = (gs.c[cx] - co * gs.len / 2 - gm.c[cx]) * co;
        if (gap < 1.4 || gap > 3.6) return { bad: 'coupGap' };
        c = gm.c.slice(); c[cx] += co * 0.9; h = [2, 2, 2]; h[cx] = 2.5;
        return { c: c, axis: cx, out: co, rad: 2, motor: gm.id, shaft: gs.id, body: gm.id, box: boxOf(c, h) };
      }
      if (p.type === 'idler') {
        pg = good(p.on.id, ['chain']);
        if (!pg) return null;
        var bt = pg.belt, mid = pg.pt(p.span === 0 ? bt.straight / 2 : bt.straight + bt.arc2 + bt.straight / 2).p, rr = pd(12) / 2, len = 0, nv = [0, 0, 0];
        for (var q = 0; q < 3; q++) { nv[q] = mid[q] - pg.c[q]; len += nv[q] * nv[q]; }
        len = Math.sqrt(len) || 1;
        c = mid.map(function (z, q2) { return z + nv[q2] / len * (0.45 + rr); });
        return { c: c, axis: pg.axis, n: 12, rp: rr, chain: pg.id, nv: nv.map(function (z) { return z / len; }) };
      }
      return null;
    }
    d.parts.forEach(function (p) { get(p.id); });
    return G;
  }

  /* ---------- the drive train: who turns, and how fast ---------- */
  function solveDrive(d, G) {
    var bodies = {}, edges = [], conflicts = [], queue = [];
    d.parts.forEach(function (p) { if ((p.type === 'shaft' || p.type === 'motor') && !G[p.id].bad) bodies[p.id] = { id: p.id, type: p.type, rpm: null, motor: null, sprockets: [], wheels: [], coups: [] }; });
    d.parts.forEach(function (p) {
      var g = G[p.id];
      if (g.bad) return;
      if (p.type === 'sprocket' && bodies[g.body]) bodies[g.body].sprockets.push(p.id);
      if (p.type === 'wheel' && bodies[g.body]) bodies[g.body].wheels.push(p.id);
      if (p.type === 'chain') edges.push({ id: p.id, a: g.A, b: g.B });
      if (p.type === 'coupling' && g.shaft && bodies[g.shaft]) {     // a coupling ties two bodies at 1 : 1
        edges.push({ id: p.id, a: { id: p.id, body: g.motor, n: 1 }, b: { id: p.id, body: g.shaft, n: 1 } });
        bodies[g.motor].coups.push({ id: p.id, to: g.shaft }); bodies[g.shaft].coups.push({ id: p.id, to: g.motor });
      }
    });
    Object.keys(bodies).forEach(function (id) { if (bodies[id].type === 'motor') { bodies[id].rpm = RB.MOTOR_RPM; bodies[id].motor = id; queue.push(id); } });
    while (queue.length) {
      var x = queue.shift();
      edges.forEach(function (e) {
        var from = e.a.body === x ? e.a : e.b.body === x ? e.b : null;
        if (!from) return;
        var to = from === e.a ? e.b : e.a, Y = bodies[to.body], w = bodies[x].rpm * from.n / to.n;
        if (Y.rpm === null) { Y.rpm = w; Y.motor = bodies[x].motor; Y.via = e.id; queue.push(Y.id); }
        else if (Math.abs(Y.rpm - w) > 1e-6 * Math.max(1, w) && !conflicts.some(function (c) { return c.chain === e.id; })) conflicts.push({ chain: e.id, two: Y.type === 'motor' });
      });
    }
    var wheels = [], motors = {};
    Object.keys(bodies).forEach(function (id) {
      var b = bodies[id];
      b.wheels.forEach(function (w) {
        var kmh = b.rpm === null ? null : b.rpm / 60 * 2 * Math.PI * R / 100 * 3.6;
        wheels.push({ id: w, shaft: id, rpm: b.rpm, kmh: kmh, motor: b.motor, side: G[w].c[2] >= 0 ? 1 : -1 });
        if (b.motor && kmh) { var m = motors[b.motor] || (motors[b.motor] = { id: b.motor, wheels: 0, kmh: kmh, ratio: b.rpm / RB.MOTOR_RPM }); m.wheels++; }
      });
    });
    Object.keys(motors).forEach(function (id) { var m = motors[id]; m.newton = 250 / (m.kmh / 3.6); m.kgf = m.newton / 9.81; m.torque = MOTOR_NM / m.ratio; });
    function tree(id, seen) {                       // the train as a tree, for the diagram
      var b = bodies[id];
      seen[id] = 1;
      return {
        id: id, type: b.type, rpm: b.rpm, wheels: b.wheels.length,
        coups: b.coups.map(function (c) { return seen[c.to] ? null : { id: c.id, to: tree(c.to, seen) }; }).filter(Boolean),
        sprockets: b.sprockets.map(function (sid) {
          var e = edges.filter(function (x2) { return x2.a.id === sid || x2.b.id === sid; })[0], other = e && (e.a.id === sid ? e.b : e.a);
          return { id: sid, n: G[sid].n, chain: e && e.id, links: e && G[e.id].n, toN: other && other.n, to: other && !seen[other.body] ? tree(other.body, seen) : null, loop: !!(other && seen[other.body] && bodies[id].via !== (e && e.id) && bodies[other.body].via !== (e && e.id)) };
        })
      };
    }
    var seen = {}, trains = Object.keys(bodies).filter(function (id) { return bodies[id].type === 'motor'; }).map(function (id) { return seen[id] ? null : tree(id, seen); }).filter(Boolean);
    return { bodies: bodies, conflicts: conflicts, wheels: wheels, motors: motors, trains: trains };
  }

  function hull(pts) {                              // convex hull in 2D
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
    lo.pop(); up.pop();
    return lo.concat(up);
  }
  function inside(poly, p) {
    if (poly.length < 3) return false;
    for (var i = 0; i < poly.length; i++) { var a = poly[i], b = poly[(i + 1) % poly.length]; if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) < -1e-6) return false; }
    return true;
  }
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }

  /* ---------- everything that is wrong, or not finished ---------- */
  function analyse(d) {
    var G = resolve(d), blocks = [], issues = [], solids = [], joints = [], profiles = [], chains = [];
    function block(key, ids, t) { blocks.push({ key: key, ids: ids, t: t || MSG[key], sig: key + ':' + ids.slice().sort().join(',') }); }
    function issue(lvl, key, ids, he, en) { issues.push({ lvl: lvl, key: key, ids: ids, t: B(he, en) }); }
    d.parts.forEach(function (p) {
      var g = G[p.id];
      if (g.bad) return block(g.bad, [p.id]);
      if (g.box) { solids.push(g); if (g.box.min[1] < -EPS) block('ground', [p.id]); }
      if (p.type === 'profile') profiles.push(g);
      if (p.type === 'chain') chains.push(g);
    });

    /* shafts and the bearings they pass through */
    solids.forEach(function (s) {
      if (s.type !== 'shaft') return;
      s.supports = solids.filter(function (b) {
        if (b.type !== 'bearing' || b.axis !== s.axis) return false;
        for (var k = 0; k < 3; k++) if (k !== s.axis && Math.abs(b.c[k] - s.c[k]) > 0.05) return false;
        return Math.abs(b.c[s.axis] - s.c[s.axis]) <= s.len / 2 + 1.9;
      });
      s.supports.forEach(function (b) { (b.shafts = b.shafts || []).push(s.id); });
    });
    function exempt(a, b) {
      var pa = parents(a.part), pb = parents(b.part);
      if (pa.indexOf(b.id) >= 0 || pb.indexOf(a.id) >= 0) return true;
      if (a.type === 'shaft' && b.type === 'bearing') return a.supports.indexOf(b) >= 0;
      if (b.type === 'shaft' && a.type === 'bearing') return b.supports.indexOf(a) >= 0;
      return false;
    }
    for (var i = 0; i < solids.length; i++) for (var j = i + 1; j < solids.length; j++) {
      var a = solids[i], b = solids[j];
      if (hits(a, b, EPS) && !exempt(a, b)) block('hit', [a.id, b.id], B('אין מקום: ' + NAMES[a.type].he + ' ו' + NAMES[b.type].he + ' נמצאים באותו מקום.', 'No room: a ' + NAMES[a.type].en + ' and a ' + NAMES[b.type].en + ' in the same place.'));
    }

    /* chains: one per sprocket, and a clear path */
    var onSpr = {};
    chains.forEach(function (c) {
      [c.A.id, c.B.id].forEach(function (sid) { if (onSpr[sid]) block('sprBusy', [c.id, sid]); onSpr[sid] = c.id; });
      var hitIds = {}, skip = {};
      [c.A.id, c.B.id, c.A.body, c.B.body].forEach(function (id) { skip[id] = 1; });
      for (var s = 0; s < c.belt.len; s += 1) {
        var p = c.pt(s).p, h = [0.25, 0.25, 0.25]; h[c.axis] = 0.45;
        var bx = { box: boxOf(p, h) };
        solids.forEach(function (o) { if (!skip[o.id] && !hitIds[o.id] && hits(bx, o, 0.02)) hitIds[o.id] = 1; });
      }
      Object.keys(hitIds).forEach(function (id) { block('chainHit', [c.id, id], B('השרשרת עוברת דרך ' + NAMES[G[id].type].he + '.', 'The chain passes through a ' + NAMES[G[id].type].en + '.')); });
    });

    /* profile joints, brackets, and whether the frame is one piece */
    var secured = {}, comp = {};
    d.parts.forEach(function (p) { if (p.type === 'bracket' && !G[p.id].bad) { var k = p.a + '|' + p.b; (secured[k] = secured[k] || {})[p.k] = p.id; } });
    profiles.forEach(function (g) { comp[g.id] = g.id; });
    function root(id) { while (comp[id] !== id) id = comp[id]; return id; }
    for (i = 0; i < profiles.length; i++) for (j = i + 1; j < profiles.length; j++) {
      var jt = joint(profiles[i], profiles[j]);
      if (!jt) continue;
      jt.a = profiles[i].id; jt.b = profiles[j].id; jt.used = secured[jt.a + '|' + jt.b] || {};
      jt.secured = jt.type === 'par' || jt.type === 'edge' || Object.keys(jt.used).length > 0;
      joints.push(jt);
      comp[root(jt.a)] = root(jt.b);
      if (jt.type === 'butt') issue('warn', 'butt', [jt.a, jt.b], 'שני פרופילים נפגשים קצה מול קצה. זה חיבור חלש, ועדיף להשתמש בפרופיל אחד ארוך.', 'Two profiles meet end to end. That is a weak joint: one long profile is better.');
      else if (!jt.secured) issue('warn', 'loose', [jt.a, jt.b], 'שני פרופילים נפגשים בלי זווית, ולכן החיבור אינו מאובטח.', 'Two profiles meet with no bracket: the joint is not secured.');
    }
    if (profiles.length > 1) {
      var sizes = {}, bestRoot = null;
      profiles.forEach(function (g) { var r = root(g.id); sizes[r] = (sizes[r] || 0) + 1; });
      Object.keys(sizes).forEach(function (r) { if (bestRoot === null || sizes[r] > sizes[bestRoot]) bestRoot = r; });
      profiles.forEach(function (g) { if (root(g.id) !== bestRoot) issue('warn', 'apart', [g.id], 'יש פרופיל שאינו נוגע בשאר השלדה.', 'A profile that does not touch the rest of the frame.'); });
    }

    /* the drive train */
    var drive = solveDrive(d, G);
    drive.conflicts.forEach(function (c) {
      if (c.two) issue('err', 'twoMotors', [c.chain], 'שני מנועים מחוברים לאותה תמסורת במהירויות שונות, והם ייאבקו זה בזה.', 'Two motors are tied into one train at different speeds. They will fight each other.');
      else issue('err', 'locked', [c.chain], 'התמסורת נעולה: שני מסלולים מביאים לאותו ציר מהירויות שונות, ולכן היא לא תסתובב.', 'The train is locked: two paths bring different speeds to one shaft, so it cannot turn.');
    });
    d.parts.forEach(function (p) {
      var g = G[p.id];
      if (g.bad) return;
      if (p.type === 'bearing' && !g.shafts) issue('warn', 'emptyBearing', [p.id], 'יש מיסב בלי ציר.', 'A bearing with no shaft.');
      if (p.type === 'shaft') {
        if (g.supports.length < 2) issue('warn', 'oneBearing', [p.id], 'ציר שיושב על מיסב אחד בלבד יתנדנד. כל ציר צריך שני מיסבים.', 'A shaft on one bearing only: it will wobble. A shaft needs two bearings.');
        else {
          var lo = Infinity, hi = -Infinity;
          g.supports.forEach(function (s) { lo = Math.min(lo, s.c[g.axis]); hi = Math.max(hi, s.c[g.axis]); });
          var over = Math.max(lo - g.box.min[g.axis], g.box.max[g.axis] - hi);
          if (over > 16) issue('warn', 'overhang', [p.id], 'הציר בולט ' + f1(over) + ' ס"מ מעבר למיסב האחרון, ותחת עומס הוא יתכופף.', 'The shaft sticks out ' + f1(over) + ' cm past the last bearing. Under load it will bend.');
        }
      }
      if (p.type === 'sprocket' && !onSpr[p.id]) issue('warn', 'noChain', [p.id], 'יש גלגל שיניים בלי שרשרת.', 'A sprocket with no chain.');
      if (p.type === 'motor') {
        var mb = drive.bodies[p.id], cps = d.parts.filter(function (q) { return q.type === 'coupling' && q.a === p.id && !G[q.id].bad; }).map(function (q) { return q.id; }), onPin = mb.sprockets.length + cps.length;
        if (!onPin) issue('warn', 'motorBare', [p.id], 'יש מנוע שלא מניע דבר, כי על הציר שלו אין גלגל שיניים או מצמד.', 'A motor driving nothing: no sprocket or coupling on its shaft.');
        else if (onPin > 1) block('motorBusy', [p.id].concat(mb.sprockets, cps));
      }
      if (p.type === 'coupling' && !g.shaft) issue('warn', 'coupFree', [p.id], 'יש מצמד בלי ציר. גררו ציר אל המצמד, או גררו את המצמד אל ציר שנמצא מול המנוע.', 'A coupling with no shaft: drag a shaft onto the coupling, or the coupling onto a shaft in front of the motor.');
      if (p.type === 'shaft') {
        var ends = {};
        drive.bodies[p.id].coups.forEach(function (c) { var e = (G[c.id].c[g.axis] - g.c[g.axis]) > 0 ? 1 : -1; if (ends[e]) block('shaftBusy', [p.id, c.id]); ends[e] = 1; });
      }
      if (p.type === 'wheel' && drive.bodies[g.body].rpm === null) issue('warn', 'wheelFree', [p.id], 'הגלגל הזה אינו מקבל הנעה מאף מנוע.', 'This wheel is not driven by any motor.');
      if (p.type === 'chain' && g.slack > 0.6 && !d.parts.some(function (q) { return q.type === 'idler' && q.on.id === p.id; }))
        issue('warn', 'slack', [p.id], 'שרשרת של ' + g.n + ' חוליות, עם רפיון של ' + f1(g.slack * 10) + ' מ"מ. הרחיקו את הצירים ב-' + f1(g.slack * 5) + ' מ"מ, או הוסיפו גלגל מתיחה.', 'A chain of ' + g.n + ' links, with ' + f1(g.slack * 10) + ' mm of slack. Move the shafts ' + f1(g.slack * 5) + ' mm apart, or add an idler.');
    });
    var speeds = drive.wheels.filter(function (w) { return w.kmh; }).map(function (w) { return w.kmh; });
    if (speeds.length > 1 && Math.max.apply(null, speeds) / Math.min.apply(null, speeds) > 1.02)
      issue('warn', 'speeds', drive.wheels.map(function (w) { return w.id; }), 'הגלגלים המונעים אינם מסתובבים באותה מהירות, ולכן על הקרקע הם ייגררו זה כנגד זה.', 'The driven wheels do not turn at the same speed. On the ground they will drag against each other.');

    /* weight, and standing on the ground */
    var kg = 0, com = [0, 0, 0], lowest = Infinity, lowestG = null, top = 0;
    d.parts.forEach(function (p) {
      var g = G[p.id], m = 0;
      if (g.bad) return;
      if (p.type === 'profile') m = KG.profile * p.len; else if (p.type === 'shaft') m = KG.shaft * p.len;
      else if (p.type === 'sprocket') m = 0.02 * p.n; else if (p.type === 'chain') m = KG.chain * g.n * PITCH;
      else if (p.type === 'deck') m = KG.deck * p.lx * p.lz; else m = KG[p.type] || 0;
      var c = g.box ? centre(g.box) : g.c;
      kg += m; for (var k = 0; k < 3; k++) com[k] += m * c[k];
      if (g.box) { if (g.box.min[1] < lowest) { lowest = g.box.min[1]; lowestG = g; } top = Math.max(top, g.box.max[1]); }
    });
    if (kg) com = com.map(function (v) { return v / kg; });
    var wheelsG = solids.filter(function (g) { return g.type === 'wheel' && g.axis !== 1; }), contact = wheelsG.filter(function (g) { return g.box.min[1] < 0.15; });
    var stand = { kg: kg, com: com, lowest: lowest === Infinity ? 0 : lowest, top: top, wheels: wheelsG.length, contact: contact.length, stable: false };
    if (wheelsG.length) {
      if (lowestG && lowestG.type !== 'wheel' && lowest < Math.min.apply(null, wheelsG.map(function (g) { return g.box.min[1]; })) - 0.1)
        issue('warn', 'belly', [lowestG.id], 'החלק הנמוך ביותר הוא ' + NAMES[lowestG.type].he + ', ולא גלגל, ולכן הרובוט יישען עליו.', 'The lowest part is a ' + NAMES[lowestG.type].en + ' and not a wheel: the robot will rest on it.');
      else if (!contact.length) issue('warn', 'floating', [], 'הגלגלים אינם נוגעים בקרקע. לחצו על "הנמך לקרקע".', 'The wheels do not touch the ground. Press "Drop to ground".');
      else {
        if (contact.length < wheelsG.length) issue('warn', 'airWheel', wheelsG.filter(function (g) { return contact.indexOf(g) < 0; }).map(function (g) { return g.id; }), 'יש גלגל שנשאר באוויר, כי הגלגלים אינם באותו גובה.', 'A wheel is left in the air: the wheels are not at the same height.');
        var poly = hull(contact.map(function (g) { return [g.c[0], g.c[2]]; }));
        stand.stable = contact.length >= 3 && inside(poly, [com[0], com[2]]);
        if (contact.length < 3) issue('warn', 'fewWheels', [], 'פחות משלושה גלגלים נוגעים בקרקע, ולכן הרובוט לא יעמוד.', 'Fewer than three wheels on the ground: the robot will not stand.');
        else if (!stand.stable) issue('warn', 'tip', [], 'מרכז הכובד המשוער נמצא מחוץ לשטח שבין הגלגלים, ולכן הרובוט יתהפך.', 'The estimated centre of gravity lies outside the area between the wheels: the robot will tip over.');
        var zs = contact.map(function (g) { return g.c[2]; }), track = Math.max.apply(null, zs) - Math.min.apply(null, zs);
        stand.track = track;
        if (stand.stable && track > 1 && top / track > 0.95) issue('warn', 'tall', [], 'הרובוט גבוה וצר, ולכן כשהוא טעון הוא עלול להתהפך בשיפוע או בפנייה חדה.', 'The robot is tall and narrow: loaded, it may tip over on a slope or in a sharp turn.');
      }
    }
    d.parts.forEach(function (p) {
      if (p.type !== 'deck' || G[p.id].bad) return;
      var n = profiles.filter(function (g) { return Math.abs(g.box.max[1] - p.p[1]) < 0.05 && overlap({ min: [g.box.min[0], 0, g.box.min[2]], max: [g.box.max[0], 1, g.box.max[2]] }, { min: [G[p.id].box.min[0], 0, G[p.id].box.min[2]], max: [G[p.id].box.max[0], 1, G[p.id].box.max[2]] }, 0.5); }).length;
      if (n < 2) issue('warn', 'deckAir', [p.id], 'המשטח נשען על פחות משני פרופילים.', 'The deck rests on fewer than two profiles.');
    });

    var A = { G: G, blocks: blocks, issues: issues, joints: joints, drive: drive, stand: stand };
    A.bom = bom(d, A);
    A.missions = MISSIONS.map(function (m) { return { t: m.t, ok: !!m.test(d, A) }; });
    return A;
  }

  /* ---------- the parts list: how many of each part the design uses ---------- */
  function bom(d, A) {
    var G = A.G, n = { profile: 0, bracket: 0, bearing: 0, shaft: 0, wheel: 0, motor: 0, battery: 0, estop: 0, control: 0, idler: 0, coupling: 0, chain: 0, chains: 0, bolts: 0, spr: {} }, cuts = {}, longShaft = 0;
    d.parts.forEach(function (p) {
      if (G[p.id].bad) return;
      if (p.type === 'profile') { n.profile += p.len; var key = f1(p.len); cuts[key] = (cuts[key] || 0) + 1; }
      else if (p.type === 'chain') { n.chain += G[p.id].n * PITCH; n.chains++; }
      else if (p.type === 'sprocket') n.spr[p.n] = (n.spr[p.n] || 0) + 1;
      else if (n[p.type] !== undefined) n[p.type]++;
      if (p.type === 'shaft' && p.len > 30.001) longShaft++;
      n.bolts += { bracket: 2, bearing: 2, motor: 4, battery: 4, control: 4, estop: 1, idler: 1 }[p.type] || 0;
    });
    var PT = RB.PARTS, rows = [], extra = 0, unknown = false;
    function row(id, used, have, unit, packOf, packPrice, name, note) {
      var over = Math.max(0, used - have), cost = over ? (packPrice === null ? null : Math.ceil(over / packOf - 1e-9) * packPrice) : 0;
      if (cost === null) unknown = true; else extra += cost;
      rows.push({ id: id, name: name || PT[id].name, used: used, have: have, unit: unit, over: over, cost: cost, note: note });
    }
    row('profile', n.profile / 100, 8, 'm', 1, 100);
    row('bracket', n.bracket, 25, '', 5, 18.59);
    row('tnut', n.bolts, 80, '', 10, 13.9);
    row('bearing', n.bearing, 8, '', 2, 65.39);
    row('shaft', n.shaft, 4, '', 1, 69.69, B('ציר פלדה 20 מ"מ', '20 mm steel shaft'));
    row('wheel', n.wheel, 4, '', 1, 215.39);
    row('hub', n.wheel, 4, '', 2, 81.39);
    var table = { 12: ['sp12', 2, 19.19], 15: ['sp15', 4, 27.9], 18: ['sp18', 2, 38.39] }, teeth = Object.keys(n.spr).map(Number);
    [12, 15, 18].forEach(function (t) { if (teeth.indexOf(t) < 0) teeth.push(t); });
    teeth.sort(function (a, b) { return a - b; }).forEach(function (t) {
      if (table[t]) row(table[t][0], n.spr[t] || 0, table[t][1], '', 1, table[t][2], B('גלגל שיניים ' + t + ' שיניים', t + '-tooth sprocket'));
      else row('spr' + t, n.spr[t], 0, '', 1, null, B('גלגל שיניים ' + t + ' שיניים', t + '-tooth sprocket'));
    });
    row('chain', n.chain / 100, 4.572, 'm', 1.524, 80.39);
    row('masterlink', n.chains, 5, '', 1, 4.19);
    row('idler', n.idler, 2, '', 1, 33.39);
    if (n.coupling) row('coupling', n.coupling, 0, '', 1, null, B('מצמד לסתות (ציר המנוע ל-20 מ"מ)', 'Jaw coupling (motor shaft to 20 mm)'), B('בחרו אותו לפי הקוטר של ציר המנוע.', 'Chosen to fit the motor shaft diameter.'));
    row('motor', n.motor, 2, '', 1, 282.9);
    row('battery', n.battery, 1, '', 1, 1199);
    row('estop', n.estop, 1, '', 1, 12.09);
    row('control', n.control, 1, '', 1, null, B('קופסת בקרה (כל האלקטרוניקה)', 'Control box (all the electronics)'));
    var tableTotal = Object.keys(PT).reduce(function (a, k) { return a + PT[k].qty * PT[k].unit; }, 0);
    return {
      rows: rows, extra: extra, unknown: unknown, tableTotal: tableTotal, over: [],
      cuts: Object.keys(cuts).map(function (k) { return { len: +k, n: cuts[k] }; }).sort(function (a, b) { return b.len - a.len; }), profile: n.profile, chain: n.chain, count: n
    };
  }

  /* ---------- goals for the students, checked automatically ---------- */
  var BED = { w: 30, h: 30 };
  var MISSIONS = [
    { t: B('הרובוט עובר מעל ערוגה ברוחב ' + BED.w + ' ס"מ ובגובה ' + BED.h + ' ס"מ', 'The robot clears a crop bed ' + BED.w + ' cm wide and ' + BED.h + ' cm high'), test: function (d, A) {
      var tunnel = { min: [-1e4, 0, -BED.w / 2], max: [1e4, BED.h, BED.w / 2] }, any = false, hit = false;
      d.parts.forEach(function (p) { var g = A.G[p.id]; if (g.bad || !g.box) return; any = true; if (overlap(g.box, tunnel, 0.05)) hit = true; });
      return any && !hit && A.stand.contact >= 3;
    } },
    { t: B('ארבעה גלגלים נוגעים בקרקע, וכולם מונעים', 'Four wheels on the ground, all of them driven'), test: function (d, A) { return A.stand.contact >= 4 && A.drive.wheels.length >= 4 && A.drive.wheels.every(function (w) { return w.kmh; }); } },
    { t: B('מהירות נסיעה בין 2 ל-4 קמ"ש', 'A driving speed between 2 and 4 km/h'), test: function (d, A) { var w = A.drive.wheels.filter(function (x) { return x.kmh; }); return w.length > 0 && w.every(function (x) { return x.kmh >= 2 && x.kmh <= 4; }); } },
    { t: B('הרובוט יציב: מרכז הכובד נמצא בין הגלגלים', 'The robot is stable: the centre of gravity is between the wheels'), test: function (d, A) { return A.stand.stable; } },
    { t: B('יש מצבר, קופסת בקרה ולחצן חירום', 'There is a battery, a control box and an emergency stop'), test: function (d, A) { var c = A.bom.count; return c.battery > 0 && c.control > 0 && c.estop > 0; } },
    { t: B('לא נשארה אף בעיה ברשימת "מה חסר"', 'Nothing is left in the "What is missing" list'), test: function (d, A) { return d.parts.length > 0 && !A.blocks.length && !A.issues.length; } }
  ];

  /* ---------- editing ---------- */
  /* try a change on a copy; refuse it if it creates something impossible */
  function attempt(d, A0, fn) {
    var n = clone(d), stop = fn(n);
    if (stop && stop.he) return { ok: false, t: stop, design: n, A: A0 };
    var A = analyse(n), old = {};
    (A0 ? A0.blocks : []).forEach(function (b) { old[b.sig] = 1; });
    var nb = A.blocks.filter(function (b) { return !old[b.sig]; })[0];
    return nb ? { ok: false, t: nb.t, ids: nb.ids, design: n, A: A } : { ok: true, design: n, A: A };
  }
  function dependents(d, id) {                      // everything that hangs on this part, directly or not
    var out = {}, grew = true;
    out[id] = 1;
    while (grew) {
      grew = false;
      d.parts.forEach(function (p) { if (!out[p.id] && parents(p).some(function (q) { return out[q]; })) { out[p.id] = 1; grew = true; } });
    }
    delete out[id];
    return Object.keys(out);
  }
  function remove(d, id) { var gone = {}; gone[id] = 1; dependents(d, id).forEach(function (q) { gone[q] = 1; }); d.parts = d.parts.filter(function (p) { return !gone[p.id]; }); }
  function component(d, id) {                       // profiles bolted together through brackets move as one
    var set = {}, grew = true;
    set[id] = 1;
    while (grew) {
      grew = false;
      d.parts.forEach(function (p) { if (p.type === 'bracket' && set[p.a] !== set[p.b]) { set[p.a] = set[p.b] = 1; grew = true; } });
    }
    return Object.keys(set);
  }
  /* pull a move onto the 0.5 cm grid, or onto contact / flush with a nearby profile */
  function snapDelta(A, movingIds, delta) {
    var moving = {}, out = delta.slice();
    movingIds.forEach(function (id) { moving[id] = 1; });
    var others = [], mine = [];
    Object.keys(A.G).forEach(function (id) { var g = A.G[id]; if (g.type === 'profile' && !g.bad) (moving[id] ? mine : others).push(g); });
    for (var k = 0; k < 3; k++) {
      if (Math.abs(delta[k]) < 1e-9) continue;
      var best = snap(delta[k]), bd = 1.5;
      mine.forEach(function (m) {
        others.forEach(function (o) {
          [o.box.max[k] - m.box.min[k], o.box.min[k] - m.box.max[k], o.box.min[k] - m.box.min[k], o.box.max[k] - m.box.max[k], o.c[k] - m.c[k]].forEach(function (cand) {
            var dist = Math.abs(cand - delta[k]);
            if (dist < bd) { bd = dist; best = cand; }
          });
        });
      });
      out[k] = best;
    }
    return out;
  }
  function moveProfiles(d, ids, delta) { ids.forEach(function (id) { var p = find(d, id); if (p && p.p) p.p = [p.p[0] + delta[0], p.p[1] + delta[1], p.p[2] + delta[2]]; }); }
  /* lengthen a profile at one end; the other end, and everything mounted on it, stays where it is */
  function stretch(d, id, end, by) {
    var p = find(d, id), k = AXI[p.ax];
    p.len = Math.round((p.len + by) * 1000) / 1000; p.p[k] += end * by / 2;
    d.parts.forEach(function (q) { if (q.on && q.on.id === id && SLOT[q.type]) q.on.s -= end * by / 2; });
  }
  function dropToGround(d, A) {
    var lo = A.stand.lowest;
    d.parts.forEach(function (p) { if (p.p) p.p[1] -= lo; });
  }
  /* slide a motor along its profile until its chain has no slack */
  function tension(d, chainId) {
    var ch = find(d, chainId), best = null;
    [ch.a, ch.b].forEach(function (sid) {
      var sp = find(d, sid), m = sp && find(d, sp.on.id);
      if (!m || m.type !== 'motor' || best) return;
      var s0 = m.on.s;
      for (var i = 0; i <= 300; i++) {
        var ds = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.01;
        m.on.s = s0 + ds;
        var g = resolve(d)[chainId];
        if (!g.bad && g.slack < 0.02) { best = m.on.s; break; }
      }
      m.on.s = best === null ? s0 : Math.round(best * 100) / 100;
    });
    return best !== null;
  }

  /* pull a sprocket into the plane of a nearby sprocket on another shaft, so a chain can join them */
  function alignPlane(A, body, w) {
    var best = w, bd = 2.5;
    Object.keys(A.G).forEach(function (id) {
      var o = A.G[id];
      if (o.type !== 'sprocket' || o.bad || o.axis !== body.axis || o.body === body.id) return;
      var dd = Math.abs(o.c[o.axis] - w);
      if (dd < bd) { bd = dd; best = o.c[o.axis]; }
    });
    return best;
  }

  /* ---------- snaps that help put parts across from each other ---------- */
  /* a new profile: line its sides or middle up with a nearby profile, or touch it (not along axis `skip`) */
  function flushSnap(A, c, h, skip) {
    var others = Object.keys(A.G).map(function (id) { return A.G[id]; }).filter(function (o) { return o.type === 'profile' && !o.bad; });
    for (var k = 0; k < 3; k++) {
      if (k === skip) continue;
      var mn = c[k] - h[k], mx = c[k] + h[k], best = 0, bd = 2;
      others.forEach(function (o) {
        [o.box.max[k] - mn, o.box.min[k] - mx, o.box.min[k] - mn, o.box.max[k] - mx, o.c[k] - c[k]].forEach(function (cand) { if (Math.abs(cand) < bd) { bd = Math.abs(cand); best = cand; } });
      });
      c[k] += best;
      if (k === 1 && c[1] < h[1]) c[1] = h[1];
    }
  }
  /* the bearing or shaft nearest to a line: `axis` is the bore direction, `k` the coordinate compared.
     With `mate`, look for another bearing already on the very same line (for centring a shaft). */
  function lineSnap(A, self, axis, k, v, thr, mate) {
    var best = null, bd = mate ? Infinity : thr, sg = self && A.G[self];
    Object.keys(A.G).forEach(function (id) {
      var o = A.G[id];
      if (id === self || o.bad || o.axis !== axis || !(o.type === 'bearing' || (!mate && o.type === 'shaft'))) return;
      if (mate) {
        for (var q = 0; q < 3; q++) if (q !== axis && Math.abs(o.c[q] - sg.c[q]) > 0.05) return;
        var dm = Math.abs(o.c[axis] - sg.c[axis]);
        if (dm > 0.1 && dm < bd) { bd = dm; best = o; }
        return;
      }
      var dd = Math.abs(o.c[k] - v);
      if (dd < bd) { bd = dd; best = o; }
    });
    return best;
  }
  /* while a part slides (s), pull it onto a line that suits it: a bearing onto another bearing or shaft,
     a shaft to the middle between its bearings. Returns the snapped s. */
  function slideSnap(A, id, s) {
    var g = A.G[id], p = g.part, ln, pg;
    if (p.type === 'bearing') {
      pg = A.G[p.on.id];
      ln = lineSnap(A, id, g.axis, pg.ax, pg.c[pg.ax] + s, 1.5);
      return ln ? Math.round((ln.c[pg.ax] - pg.c[pg.ax]) * 1000) / 1000 : s;
    }
    if (p.type === 'shaft' && g.supports && g.supports.length >= 2) {
      var lo = Infinity, hi = -Infinity, pb = A.G[p.on.id];
      g.supports.forEach(function (b) { lo = Math.min(lo, b.c[g.axis]); hi = Math.max(hi, b.c[g.axis]); });
      var mid = (lo + hi) / 2 - pb.c[g.axis];
      return Math.abs(mid - s) < 1.5 ? Math.round(mid * 1000) / 1000 : s;
    }
    return s;
  }

  /* ---------- where a new part would go, from what the pointer is on ---------- */
  function propose(d, A, type, hit, o) {
    o = o || {};
    var g = hit.id ? A.G[hit.id] : null, pt = hit.pt, f, s, part, k;
    function fail(key) { return { err: MSG[key] }; }
    if (g && g.bad) g = null;
    if (type === 'profile') {
      k = AXI[o.ax || 'x'];
      var len = o.len || 40, h = [2, 2, 2], c = [snap(pt[0]), 0, snap(pt[2])];
      h[k] = len / 2;
      if (!g) c[1] = h[1];
      else if (g.type === 'profile' || g.type === 'deck') {
        var gc = centre(g.box);
        f = faceAt(g, pt);
        c = [gc[0] + snap(pt[0] - gc[0]), gc[1] + snap(pt[1] - gc[1]), gc[2] + snap(pt[2] - gc[2])];
        c[f.k] = (f.sg > 0 ? g.box.max[f.k] : g.box.min[f.k]) + f.sg * h[f.k];
        if (c[1] < h[1]) c[1] = h[1];
      } else return fail('profFree');
      flushSnap(A, c, h, g ? faceAt(g, pt).k : 1);
      return { part: { type: 'profile', p: c, ax: AXN[k], len: len } };
    }
    if (type === 'deck') {
      if (!g || g.type !== 'profile') return fail('deckTop');
      f = faceAt(g, pt);
      if (f.k !== 1 || f.sg < 0) return fail('deckTop');
      return { part: { type: 'deck', p: [g.c[0] + snap(pt[0] - g.c[0]), g.box.max[1], g.c[2] + snap(pt[2] - g.c[2])], lx: o.lx || 60, lz: o.lz || 80, crates: o.crates === undefined ? 2 : o.crates } };
    }
    if (SLOT[type]) {
      if (!g || g.type !== 'profile') return fail('needProfile');
      f = faceAt(g, pt);
      if (f.k === g.ax) return fail('endFace');
      var lim = g.len / 2 - MARGIN[type];
      if (lim < 0) return fail('offProfile');
      s = Math.max(-lim, Math.min(lim, snap(pt[g.ax] - g.c[g.ax])));
      part = { type: type, on: { id: g.id, f: faceStr(f.k, f.sg), s: s } };
      if (type === 'bearing') {                     // line it up with a bearing or shaft across from it
        var ln = lineSnap(A, null, 3 - g.ax - f.k, g.ax, g.c[g.ax] + s, 3);
        if (ln) {
          part.on.s = Math.round(Math.max(-lim, Math.min(lim, ln.c[g.ax] - g.c[g.ax])) * 1000) / 1000;
          var lift = (ln.c[f.k] - (g.c[f.k] + f.sg * 2)) * f.sg - BEAR_H;
          if (lift > 0.01 && lift <= 3) part.lift = Math.round(lift * 1000) / 1000;
        }
      }
      if (type === 'motor') { var t = 3 - g.ax - f.k; part.out = g.c[t] < 0 ? -1 : 1; part.u = 0; }
      if (type === 'battery' || type === 'control') { part.v = 0; part.turn = 0; }
      return { part: part };
    }
    if (type === 'shaft') {
      if (g && g.type === 'motor') g = A.G[(d.parts.filter(function (q) { return q.type === 'coupling' && q.a === g.id; })[0] || {}).id] || g;
      if (g && g.type === 'coupling') return g.shaft ? fail('coupFull') : { part: { type: 'shaft', on: { id: g.id, s: 0 }, len: o.len || 30 } };
      if (g && g.type === 'shaft') return fail('bearingFull');
      if (!g || g.type !== 'bearing') return fail('needBearing');
      if (g.shafts) return fail('bearingFull');
      var sl = o.len || 30, ss = 0, mate = lineSnap(A, g.id, g.axis, g.axis, null, 0, true);
      if (mate) ss = Math.max(-(sl / 2 - 1.9), Math.min(sl / 2 - 1.9, (mate.c[g.axis] - g.c[g.axis]) / 2));   // centred between the two bearings
      return { part: { type: 'shaft', on: { id: g.id, s: Math.round(ss * 1000) / 1000 }, len: sl } };
    }
    if (type === 'coupling') {
      if (g && g.type === 'sprocket' && A.G[g.body] && A.G[g.body].type === 'motor') g = A.G[g.body];
      if (g && g.type === 'motor') {
        if (d.parts.some(function (q) { return (q.type === 'coupling' && q.a === g.id) || (q.type === 'sprocket' && q.on.id === g.id); })) return fail('motorBusy');
        return { part: { type: 'coupling', a: g.id } };
      }
      if (g && (g.type === 'sprocket' || g.type === 'wheel')) g = A.G[g.body];
      if (g && g.type === 'bearing' && g.shafts) g = A.G[g.shafts[0]];
      if (!g || g.type !== 'shaft') return fail('needCoupling');
      var gs = g, cands = [];                       // a shaft: find a motor that can be lined up in front of it
      Object.keys(A.G).forEach(function (id) { var m = A.G[id]; if (m.type === 'motor' && !m.bad && m.axis === gs.axis) cands.push(m); });
      cands.sort(function (a, b) { return Math.hypot(a.c[0] - gs.c[0], a.c[1] - gs.c[1], a.c[2] - gs.c[2]) - Math.hypot(b.c[0] - gs.c[0], b.c[1] - gs.c[1], b.c[2] - gs.c[2]); });
      for (var ci = 0; ci < cands.length; ci++) {
        var trial = clone(d), r = couple(trial, A, cands[ci].id, gs.id);
        if (!r && !analyse(trial).blocks.length) return { apply: (function (mid) { return function (n) { return couple(n, A, mid, gs.id); }; })(cands[ci].id) };
      }
      return fail('coupNoMotor');
    }
    if (type === 'sprocket' || type === 'wheel') {
      if (g && (g.type === 'sprocket' || g.type === 'wheel')) g = A.G[g.body];
      if (g && g.type === 'bearing' && g.shafts) g = A.G[g.shafts[0]];
      if (type === 'wheel') {
        if (!g || g.type !== 'shaft') return fail('wheelShaft');
        return { part: { type: 'wheel', on: { id: g.id }, end: pt[g.axis] >= g.c[g.axis] ? 1 : -1 } };
      }
      if (!g || (g.type !== 'shaft' && g.type !== 'motor')) return fail('needShaft');
      if (g.type === 'motor' && d.parts.some(function (q) { return (q.type === 'coupling' && q.a === g.id) || (q.type === 'sprocket' && q.on.id === g.id); })) return fail('motorBusy');
      var lm = g.type === 'shaft' ? g.len / 2 - 1 : 1;
      s = alignPlane(A, g, g.c[g.axis] + (g.type === 'shaft' ? snap(pt[g.axis] - g.c[g.axis]) : 0)) - g.c[g.axis];
      return { part: { type: 'sprocket', on: { id: g.id, s: Math.round(Math.max(-lm, Math.min(lm, s)) * 1000) / 1000 }, n: o.n || 15 } };
    }
    if (type === 'bracket') {
      if (!g || g.type !== 'profile') return fail('noJoint');
      var spots = [];
      A.joints.forEach(function (j) {
        if (j.a !== g.id && j.b !== g.id) return;
        j.spots.forEach(function (sp, i) {
          if (!sp || j.used[i]) return;
          var mid = sp.c.slice(); mid[sp.d1.k] += sp.d1.sg * 1.2; mid[sp.d2.k] += sp.d2.sg * 1.2;      // the middle of the bracket, not its corner
          spots.push({ dist: Math.hypot(mid[0] - pt[0], mid[1] - pt[1], mid[2] - pt[2]), part: { type: 'bracket', a: j.a, b: j.b, k: i } });
        });
      });
      if (!spots.length) return fail('noJoint');
      spots.sort(function (a, b) { return a.dist - b.dist; });
      for (var si = 0; si < Math.min(4, spots.length); si++) {        // the nearest corner that really has room
        if (spots[si].dist > spots[0].dist + 8) break;
        if (attempt(d, A, function (n) { push(n, clone(spots[si].part)); }).ok) return { part: spots[si].part };
      }
      return { part: spots[0].part };
    }
    if (type === 'idler') {
      if (!g || g.type !== 'chain') return fail('needChain');
      return { part: { type: 'idler', on: { id: g.id }, span: 1 } };
    }
    return fail('noParent');
  }

  /* ---------- a quarter turn about a world axis ----------
     `ids` are free parts (profiles, decks) or parts on a slot; everything mounted on them turns too.
     Free parts turn about the middle of their common box; a slot part turns about its profile (k must be the profile's axis).
     Returns a message when the turn cannot be done; collisions are left to attempt(). */
  function rotate(n, A0, ids, k, dir) {
    var G = A0.G, i = (k + 1) % 3, j = (k + 2) % 3, set = {}, lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity], free = [], piv, stop = null;
    function mp(a) { return a === k ? { k: k, sg: 1 } : a === i ? { k: j, sg: dir } : { k: i, sg: -dir }; }
    function rv(v) { var o = [0, 0, 0]; for (var a = 0; a < 3; a++) { var m = mp(a); o[m.k] = (v[a] - piv[a]) * m.sg; } return [o[0] + piv[0], o[1] + piv[1], o[2] + piv[2]]; }
    function near(a, b) { return Math.abs(a[0] - b[0]) < 0.05 && Math.abs(a[1] - b[1]) < 0.05 && Math.abs(a[2] - b[2]) < 0.05; }
    function md(dd) { var m = mp(dd.k); return m.k + ':' + dd.sg * m.sg; }
    ids.forEach(function (id) { set[id] = 1; dependents(n, id).forEach(function (q) { set[q] = 1; }); });
    ids.forEach(function (id) { var g = G[id]; if (g && !g.bad && g.part.p) { free.push(id); for (var a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], g.box.min[a]); hi[a] = Math.max(hi[a], g.box.max[a]); } } });
    piv = free.length ? [snap((lo[0] + hi[0]) / 2), snap((lo[1] + hi[1]) / 2), snap((lo[2] + hi[2]) / 2)] : [0, 0, 0];
    n.parts.forEach(function (p) {
      var g = G[p.id], pg, f, m, t;
      if (!set[p.id] || !g || g.bad) return;
      if (p.type === 'profile') { p.p = rv(p.p); p.ax = AXN[mp(AXI[p.ax]).k]; }
      else if (p.type === 'deck') {
        if (k !== 1) { stop = MSG.rotDeck; return; }
        p.p = rv(p.p); t = p.lx; p.lx = p.lz; p.lz = t;
      } else if (SLOT[p.type]) {
        pg = G[p.on.id]; f = face(p.on.f); t = 3 - pg.ax - f.k; m = mp(f.k);
        p.on.f = faceStr(m.k, f.sg * m.sg);
        if (p.on.s) p.on.s *= mp(pg.ax).sg;
        m = mp(t);
        if (p.u) p.u *= m.sg;
        if (p.v) p.v *= m.sg;
        if (p.type === 'motor') p.out = (p.out < 0 ? -1 : 1) * m.sg;
      } else if (p.type === 'shaft' || p.type === 'sprocket' || p.type === 'wheel') {
        m = mp(G[p.on.id].axis);
        if (p.on.s) p.on.s *= m.sg;
        if (p.type === 'wheel') p.end = (p.end < 0 ? -1 : 1) * m.sg;
      }
    });
    if (stop) return stop;
    var G2 = resolve(n);
    n.parts.forEach(function (p) {
      var g = G[p.id];
      if (!set[p.id] || !g || g.bad) return;
      if (p.type === 'bracket') {
        var jn = G2[p.a] && G2[p.b] && !G2[p.a].bad && !G2[p.b].bad && joint(G2[p.a], G2[p.b]), want = free.length ? rv(g.c) : g.c, keys = [md(g.d1), md(g.d2)].sort().join('|'), hit = -1;
        if (jn) jn.spots.forEach(function (sp, q) { if (sp && hit < 0 && near(sp.c, want) && [sp.d1.k + ':' + sp.d1.sg, sp.d2.k + ':' + sp.d2.sg].sort().join('|') === keys) hit = q; });
        if (hit < 0) stop = MSG.rotTied; else p.k = hit;
      } else if (p.type === 'idler' && free.length) {
        var target = rv(g.c), best = null, bd = Infinity;
        [0, 1].forEach(function (sp) {
          p.span = sp;
          var gi = resolve(n)[p.id];
          if (gi && !gi.bad) { var dd = Math.hypot(gi.c[0] - target[0], gi.c[1] - target[1], gi.c[2] - target[2]); if (dd < bd) { bd = dd; best = sp; } }
        });
        if (best === null) stop = MSG.rotTied; else p.span = best;
      }
    });
    if (stop) return stop;
    var G3 = resolve(n), low = 0;
    Object.keys(G).forEach(function (id) { if (!G[id].bad && G3[id] && G3[id].bad && (set[id] || parents(G[id].part).some(function (q) { return set[q]; }))) stop = MSG.rotTied; });
    if (stop) return stop;
    Object.keys(set).forEach(function (id) { var g = G3[id]; if (g && !g.bad && g.box) low = Math.min(low, g.box.min[1]); });
    if (low < 0 && free.length) moveProfiles(n, free, [0, -low, 0]);
  }

  /* ---------- join a motor to a shaft with a coupling ----------
     The motor slides along its profile and along its own axis, and is raised on spacer plates
     (or the shaft's bearings are), so that the two shafts meet on one line. */
  function couple(n, A, x, y) {
    var gx = A.G[x], gy = A.G[y], gm = gx.type === 'motor' ? gx : gy, gs = gm === gx ? gy : gx, sup = [];
    if (gm.type !== 'motor' || gs.type !== 'shaft') return MSG.needCoupling;
    if (n.parts.some(function (q) { return (q.type === 'sprocket' && q.on.id === gm.id) || (q.type === 'coupling' && q.a === gm.id); })) return MSG.motorBusy;
    if (gs.axis !== gm.axis) return MSG.coupAxis;
    var ax = gm.axis, o = gm.out, m = find(n, gm.id), k = gm.k, dk = gs.c[k] - gm.c[k];
    if ((gs.c[ax] - gm.c[ax]) * o < 2) return MSG.coupSide;
    if (dk * gm.sg > -1e-6) m.lift = Math.round(((m.lift || 0) + dk * gm.sg) * 1000) / 1000;          // raise the motor on spacers
    else {                                                                                           // or raise the bearings that hold the shaft
      var ok = true;
      sup = (gs.supports || []).map(function (b) { return find(n, b.id); });
      if (!sup.length) ok = false;
      sup.forEach(function (b) { var gb = A.G[b.id]; if (gb.k !== k) ok = false; else b.lift = Math.round(((b.lift || 0) - dk * gb.sg) * 1000) / 1000; if (b.lift < -1e-6) ok = false; });
      if (!ok) return B('הציר של המנוע רחוק ' + f1(Math.abs(dk)) + ' ס"מ מהקו של הציר, והגבהת המנוע או המיסבים לא תספיק כדי ליישר אותם. הזיזו את הפרופיל של המנוע.', 'The motor shaft is ' + f1(Math.abs(dk)) + ' cm off the line of the shaft, and raising the motor or the bearings cannot fix it. Move the motor\'s profile.');
    }
    if ((m.lift || 0) > 8 || sup.some(function (b) { return b.lift > 8; })) return B('כדי ליישר, צריך להגביה ביותר מ-8 ס"מ. הזיזו את הפרופיל של המנוע כך שיהיה קרוב יותר לגובה של הציר.', 'It would need more than 8 cm of spacers to line up: move the motor\'s profile closer to the height of the shaft.');
    m.on.s = Math.round((m.on.s + gs.c[gm.a] - gm.c[gm.a]) * 1000) / 1000;
    var near = gs.c[ax] - o * gs.len / 2;
    m.u = Math.round(((m.u || 0) + near - o * 2.5 - gm.c[ax]) * 1000) / 1000;
    if (Math.abs(m.u) > 15) return MSG.coupFar;
    push(n, { type: 'coupling', a: gm.id, b: gs.id });
  }

  /* ---------- copy one side of the robot to the other (across z = 0) ---------- */
  function mirror(d, A0, side) {
    return attempt(d, A0, function (n) {
      var G = A0.G, map = {}, later = [];
      function mbox(b) { return { min: [b.min[0], b.min[1], -b.max[2]], max: [b.max[0], b.max[1], -b.min[2]] }; }
      function same(a, b) { for (var k = 0; k < 3; k++) if (Math.abs(a.min[k] - b.min[k]) > 0.05 || Math.abs(a.max[k] - b.max[k]) > 0.05) return false; return true; }
      function onSide(g) { return g.box && (side > 0 ? g.box.min[2] > 0.01 : g.box.max[2] < -0.01); }
      function mapped(id) { return map[id] || id; }
      d.parts.forEach(function (p) {
        var g = G[p.id];
        if (g.bad) return;
        if (p.type === 'chain' || p.type === 'idler' || p.type === 'bracket' || (p.type === 'coupling' && p.b)) return later.push(p);
        if (!onSide(g)) return;
        var twin = d.parts.filter(function (q) { return q.type === p.type && G[q.id].box && same(G[q.id].box, mbox(g.box)); })[0];
        if (twin) { map[p.id] = twin.id; return; }
        var q = clone(p), pk;
        if (q.p) q.p[2] = -q.p[2];
        if (q.type === 'coupling') q.a = mapped(p.a);
        if (q.on) {
          q.on.id = mapped(p.on.id);
          pk = G[p.on.id];
          if (q.on.f) { var f = face(q.on.f); if (f.k === 2) q.on.f = faceStr(2, -f.sg); if (pk.ax === 2) q.on.s = -q.on.s; if (3 - pk.ax - f.k === 2) { if (q.out) q.out = -q.out; if (q.u) q.u = -q.u; if (q.v) q.v = -q.v; } }
          else if (pk.axis === 2) { if (q.on.s) q.on.s = -q.on.s; if (q.end) q.end = -q.end; }
        }
        map[p.id] = push(n, q);
      });
      var G2 = resolve(n);
      later.forEach(function (p) {
        var g = G[p.id];
        if (p.type === 'bracket') {
          if (!onSide(g) || (!map[p.a] && !map[p.b])) return;
          var a = mapped(p.a), b = mapped(p.b), ga = G2[a], gb = G2[b], j = joint(ga, gb), flip = false;
          if (!j) return;
          if (n.parts.some(function (q) { return q.type === 'bracket' && G2[q.id] && G2[q.id].box && same(G2[q.id].box, mbox(g.box)); })) return;
          j.spots.forEach(function (sp, i) { if (sp && !flip && Math.abs(sp.c[0] - g.c[0]) < 0.05 && Math.abs(sp.c[1] - g.c[1]) < 0.05 && Math.abs(sp.c[2] + g.c[2]) < 0.05 && sp.d1.k === g.d1.k && sp.d1.sg === (g.d1.k === 2 ? -g.d1.sg : g.d1.sg)) { flip = true; push(n, { type: 'bracket', a: a, b: b, k: i }); } });
        } else if (p.type === 'coupling') {
          if (map[p.a] && map[p.b] && !n.parts.some(function (q) { return q.type === 'coupling' && q.a === map[p.a]; })) push(n, { type: 'coupling', a: map[p.a], b: map[p.b] });
        } else if (p.type === 'chain') {
          if (!map[p.a] || !map[p.b]) return;
          var ex = n.parts.filter(function (q) { return q.type === 'chain' && ((q.a === map[p.a] && q.b === map[p.b]) || (q.a === map[p.b] && q.b === map[p.a])); })[0];
          map[p.id] = ex ? ex.id : push(n, { type: 'chain', a: map[p.a], b: map[p.b] });
        }
      });
      later.forEach(function (p) {
        if (p.type !== 'idler' || !map[p.on.id] || map[p.on.id] === p.on.id) return;
        if (n.parts.some(function (q) { return q.type === 'idler' && q.on.id === map[p.on.id]; })) return;
        push(n, { type: 'idler', on: { id: map[p.on.id] }, span: p.span });
      });
    });
  }

  /* ---------- the example robot, as a design ---------- */
  function template(dims, frameOnly) {
    var o = RB.compute(dims), d = newDesign(), dm = dims, xEnd = dm.L / 2 - 2, id = {};
    function prof(key, ax, len, x, y, z) { id[key] = push(d, { type: 'profile', p: [x, y, z], ax: ax, len: len }); }
    [1, -1].forEach(function (s) {
      prof('out' + s, 'x', dm.L, 0, o.yRail, s * o.zOut); prof('in' + s, 'x', dm.L, 0, o.yRail, s * o.zIn);
      [1, -1].forEach(function (e) {
        prof('sp' + s + e, 'z', o.spacer, e * xEnd, o.yRail, s * (o.zOut + o.zIn) / 2);
        prof('leg' + s + e, 'y', o.legLen, e * xEnd, o.yRail + 2 + o.legLen / 2, s * o.zOut);
      });
      prof('top' + s, 'x', dm.L, 0, dm.H - 2, s * o.zOut);
    });
    [1, -1].forEach(function (e) { prof('cross' + e, 'z', o.cross, e * xEnd, dm.H - 2, 0); });
    var A = analyse(d);
    A.joints.forEach(function (j) {                    // one bracket in every corner where two profiles press on each other
      if (j.type === 'edge') return;
      for (var k = 0; k < j.spots.length; k++) {
        if (!j.spots[k]) continue;
        var r = attempt(d, A, function (n) { push(n, { type: 'bracket', a: j.a, b: j.b, k: k }); });
        if (r.ok) { d = r.design; A = r.A; break; }
      }
    });
    if (frameOnly) return d;
    [1, -1].forEach(function (s) {
      var spr = {};
      [['r', o.xr], ['f', o.xf]].forEach(function (q) {
        var b = push(d, { type: 'bearing', on: { id: id['out' + s], f: '-y', s: q[1] } });
        push(d, { type: 'bearing', on: { id: id['in' + s], f: '-y', s: q[1] } });
        var sh = push(d, { type: 'shaft', on: { id: b, s: s * ((o.zIn - 2.5) + o.shaft / 2 - o.zOut) }, len: Math.round(o.shaft * 100) / 100 });
        spr[q[0] + 15] = push(d, { type: 'sprocket', on: { id: sh, s: s * (o.z15 - ((o.zIn - 2.5) + o.shaft / 2)) }, n: 15 });
        if (q[0] === 'r') spr.r18 = push(d, { type: 'sprocket', on: { id: sh, s: s * (o.z18 - ((o.zIn - 2.5) + o.shaft / 2)) }, n: 18 });
        push(d, { type: 'wheel', on: { id: sh }, end: s });
      });
      var m = push(d, { type: 'motor', on: { id: id['out' + s], f: '+y', s: o.xm }, out: s, u: s * (o.z18 - o.zOut) });
      spr.m = push(d, { type: 'sprocket', on: { id: m, s: 0 }, n: 12 });
      var cs = push(d, { type: 'chain', a: spr.m, b: spr.r18 }), cl = push(d, { type: 'chain', a: spr.r15, b: spr.f15 });
      tension(d, cs);
      push(d, { type: 'idler', on: { id: cl }, span: 1 });
    });
    push(d, { type: 'battery', on: { id: id.cross1, f: '-x', s: 0 }, v: -12, turn: 0 });
    push(d, { type: 'control', on: { id: id['cross-1'], f: '+x', s: 0 }, v: -8, turn: 0 });
    push(d, { type: 'estop', on: { id: id.cross1, f: '+x', s: 0 } });
    push(d, { type: 'deck', p: [0, dm.H, 0], lx: dm.L, lz: dm.W, crates: 2 });
    return d;
  }

  P.robotDesign = {
    NAMES: NAMES, MSG: MSG, BOXES: BOXES, MARGIN: MARGIN, SLOT: SLOT, BED: BED, AXN: AXN, AXI: AXI, MISSIONS: MISSIONS,
    newDesign: newDesign, clone: clone, push: push, find: find, parents: parents, face: face, faceStr: faceStr, snap: snap,
    resolve: resolve, analyse: analyse, attempt: attempt, dependents: dependents, remove: remove, component: component,
    snapDelta: snapDelta, moveProfiles: moveProfiles, stretch: stretch, dropToGround: dropToGround, tension: tension,
    propose: propose, alignPlane: alignPlane, mirror: mirror, rotate: rotate, couple: couple, slideSnap: slideSnap, template: template, joint: joint
  };
})(window.PICO);
