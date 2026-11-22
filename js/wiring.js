/* Breadboard wiring diagrams.
   - resolve(layout): turns a layout (parts placed by hole name) into concrete
     coordinates and an electrical netlist.
   - P.checkLayout(layout, wiringRows): verifies the drawing against a wiring
     table, so a picture can never disagree with the table next to it.
   - P.wiringView(host, layoutId, opts): the interactive, step-by-step picture.
   - P.connDiagram(rows): the simpler "what goes where" diagram for the planner.

   The board is a full-size breadboard: 63 columns, rows a-e and f-j, power
   rails top and bottom. The Pico sits in columns 1-20 with its pins in rows
   c and h, USB to the left. Change G.cols to draw another size. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;

  var G = { cols: 63, p: 14, L: 34, H: 256, sky: 122 };
  var RY = { tp: 16, tn: 30, j: 58, i: 72, h: 86, g: 100, f: 114, e: 142, d: 156, c: 170, b: 184, a: 198, bp: 226, bn: 240 };
  function X(col) { return G.L + (col - 1) * G.p; }

  var COLORS = {
    red: ['#e5484d', { he: 'אדום', en: 'red' }], black: ['#22292e', { he: 'שחור', en: 'black' }],
    yellow: ['#e6b422', { he: 'צהוב', en: 'yellow' }], green: ['#2fa84f', { he: 'ירוק', en: 'green' }],
    blue: ['#2f7fd1', { he: 'כחול', en: 'blue' }], orange: ['#f08c2e', { he: 'כתום', en: 'orange' }],
    purple: ['#8e5bd6', { he: 'סגול', en: 'purple' }], white: ['#f2f2f2', { he: 'לבן', en: 'white' }]
  };
  var BANDS = {
    '330': ['#f08c2e', '#f08c2e', '#8b5a2b'], '1k': ['#8b5a2b', '#22292e', '#e5484d'], '2k': ['#e5484d', '#22292e', '#e5484d'],
    '4.7k': ['#e6b422', '#8e5bd6', '#e5484d'], '10k': ['#8b5a2b', '#22292e', '#f08c2e']
  };
  var LED_FILL = { red: '#e5484d', yellow: '#f2c230', green: '#3fb950', blue: '#3b82f6', white: '#f4f4f4' };

  var W = {
    wire: { he: 'חוט', en: 'wire' }, from: { he: 'מ-', en: 'from ' }, to: { he: ' אל ', en: ' to ' },
    res: { he: 'נגד', en: 'resistor' }, between: { he: ' בין ', en: ' between ' }, and: { he: ' ל-', en: ' and ' },
    led: { he: 'לד', en: 'LED' }, long: { he: 'רגל ארוכה ב-', en: 'long leg in ' }, short: { he: 'רגל קצרה ב-', en: 'short leg in ' },
    button: { he: 'כפתור: נעצו אותו מעל התעלה, בטורים', en: 'Button: push it in across the channel, in columns' },
    pot: { he: 'פוטנציומטר: שלוש הרגליים ב-', en: 'Potentiometer: its three legs in ' },
    ldr: { he: 'חיישן אור: רגל אחת ב-', en: 'Light sensor: one leg in ' }, other: { he: ', והשנייה ב-', en: ', the other in ' },
    buzzer: { he: 'באזר: ', en: 'Buzzer: ' },
    ds: { he: 'DS18B20, הצד השטוח פונה אליכם: ', en: 'DS18B20, flat side facing you: ' },
    mod: { he: ': נעצו את הפינים בשורה j, בטורים', en: ': push the pins into row j, columns' }, upto: { he: 'עד', en: 'to' },
    chip: { he: ': נעצו את השבב מעל התעלה, כשהחריץ פונה שמאלה. הרגליים נכנסות לטורים', en: ': push the chip in across the channel, notch to the left, legs in columns' },
    chipLeg1: { he: 'רגל 1 נמצאת ב-', en: 'Leg 1 goes in ' },
    seg7: { he: ': נעצו את הספרה מעל התעלה, כשהנקודה למטה. הרגליים נכנסות לטורים', en: ': push the digit in across the channel, dot at the bottom, legs in columns' },
    shortRail: { he: 'רגל קצרה ישר ל', en: 'short leg straight into ' },
    flat: { he: ', הצד השטוח פונה אליכם: ', en: ', flat side facing you: ' },
    diode: { he: 'דיודה: האנודה ב-', en: 'Diode: the anode in ' }, diodeK: { he: ', והקתודה (הצד עם הפס) ב-', en: ', the cathode (the banded end) in ' },
    off: { he: ' נשאר מחוץ למטריצה, והחוטים מתחברים אליו.', en: ' stays off the breadboard. Wires connect to it.' },
    railP: { he: 'פס המתח האדום (+)', en: 'the red power rail (+)' }, railN: { he: 'פס האדמה הכחול (−)', en: 'the blue ground rail (−)' },
    colOf: { he: 'הטור של', en: 'the column of' }, pin: { he: 'פין', en: 'pin' },
    pinOf: { he: 'הפין', en: 'pin' }, of: { he: 'של', en: 'of' },
    step: { he: 'צעד', en: 'Step' }, prev: { he: 'הקודם', en: 'Back' }, next: { he: 'הבא', en: 'Next' },
    all: { he: 'הצגת הכול', en: 'Show all' }, stepwise: { he: 'בנו צעד אחר צעד', en: 'Build it step by step' },
    title: { he: 'כך זה נראה על המטריצה', en: 'How it looks on the breadboard' },
    whole: { he: 'המעגל השלם. לחצו על "בנו צעד אחר צעד" כדי לראות איך מרכיבים אותו.', en: 'The finished circuit. Press "Build it step by step" to see how it goes together.' },
    lgPwr: { he: 'מתח', en: 'power' }, lgGnd: { he: 'אדמה', en: 'ground' }, lgSig: { he: 'אות', en: 'signal' },
    note: { he: 'זו פריסה אפשרית אחת. המיקום המדויק של הרכיבים לא משנה, כל עוד כל רגל מחוברת לאותן נקודות.', en: 'This is one possible layout. Exactly where the parts sit does not matter, as long as each leg is connected to the same places.' },
    usb: { he: 'USB', en: 'USB' },
    board: { he: 'מטריצה', en: 'Breadboard' }, linkOff: { he: ' הוא הלוח השני. החוטים האלה עוברים אליו.', en: ' is the other board. These wires run across to it.' }, onBoard: { he: 'במטריצה', en: 'on breadboard' }
  };

  function compName(kind) { var c = P.componentById(kind); return c ? T(c.name) : kind; }

  /* ---------- resolve: layout -> coordinates + netlist ---------- */
  function resolve(layout) {
    var errs = [], occ = {}, uf = {}, pinNode = {}, offPin = {}, resistors = [], items = [];
    var nb = layout.boards || 1, sky = [], ground = [], tops = [];
    /* A reference may carry a board number: '2:a10' is hole a10 on the second breadboard. */
    function bOf(ref) { var m = /^(\d+):/.exec(String(ref || '')); return m ? +m[1] : 1; }
    function strip(ref) { return String(ref).replace(/^\d+:/, ''); }
    function pre(b) { return b > 1 ? b + ':' : ''; }
    layout.parts.forEach(function (p) {
      var b = p.board || bOf(p.at || p.a);
      if (p.t === 'mod' || (p.t === 'off' && p.side !== 'bottom')) sky[b] = true;
      if (p.t === 'off' && p.side === 'bottom') ground[b] = true;
    });
    var cursor = 0;
    for (var bi = 1; bi <= nb; bi++) {
      tops[bi] = cursor + (sky[bi] ? G.sky : 6);
      cursor = tops[bi] + G.H + (ground[bi] ? 128 : 8) + (bi < nb ? 12 : 0);
    }
    function Y(row, b) { return tops[b || 1] + RY[row]; }
    function find(a) { while (uf[a] && uf[a] !== a) a = uf[a]; return a; }
    function union(a, b) { a = find(a); b = find(b); if (a !== b) uf[a] = b; }

    /* the Pico's own pins (always on the first board) */
    function picoAt(n) { return n <= 20 ? { col: n, top: false } : { col: 41 - n, top: true }; }
    for (var n = 1; n <= 40; n++) {
      var pin = P.pinByNum(n), at = picoAt(n);
      union((at.top ? 't' : 'b') + at.col, 'PIN:' + (pin.kind === 'gnd' ? 'GND' : pin.name));
    }
    function picoPinInCol(col, isTop, b) { return b === 1 && !layout.noPico && col <= 20 ? P.pinByNum(isTop ? 41 - col : col) : null; }

    function hole(row, col, who, b) {
      b = b || 1;
      var ref = row + col, key = pre(b) + ref;
      if (col < 1 || col > G.cols) errs.push(who + ': column out of range ' + key);
      if (b === 1 && !layout.noPico && col <= 20 && 'cdefgh'.indexOf(row) >= 0) errs.push(who + ': hole ' + ref + ' is under the Pico');
      if (occ[key]) errs.push(who + ': hole ' + key + ' already used by ' + occ[key]);
      occ[key] = who;
      var isTop = 'fghij'.indexOf(row) >= 0;
      return { kind: 'hole', ref: ref, row: row, col: col, b: b, top: tops[b], x: X(col), y: Y(row, b), node: pre(b) + (isTop ? 't' : 'b') + col, pico: picoPinInCol(col, isTop, b) };
    }
    function H(ref, who) { var s = strip(ref); return hole(s[0], +s.slice(1), who, bOf(ref)); }
    function rail(name, col, who, b) {
      b = b || 1; col = col || 22;
      while (occ[pre(b) + name + col] && col < G.cols) col++;
      occ[pre(b) + name + col] = who;
      return { kind: 'rail', ref: name + col, rail: name, col: col, b: b, top: tops[b], x: X(col), y: Y(name, b), node: pre(b) + name };
    }
    /* an endpoint written as a hole (a20), a rail (bn, bn25), a Pico pin (P20) or an off-board pin (servo.SIG) */
    function endpoint(ref, who, hintCol) {
      var m, b = bOf(ref), s = strip(ref);
      if ((m = /^([a-j])(\d+)$/.exec(s))) return hole(m[1], +m[2], who, b);
      if ((m = /^(tp|tn|bp|bn)(\d+)?$/.exec(s))) return rail(m[1], m[2] ? +m[2] : hintCol, who, b);
      if ((m = /^P(\d+)$/.exec(s))) {
        var at = picoAt(+m[1]), rows = at.top ? ['j', 'i'] : ['a', 'b'];
        var row = !occ[rows[0] + at.col] ? rows[0] : rows[1];
        return hole(row, at.col, who, 1);
      }
      if (offPin[ref]) return offPin[ref];
      errs.push(who + ': unknown endpoint ' + ref);
      return { kind: 'bad', x: 0, y: 0, node: 'BAD:' + ref };
    }
    function colOf(ref) { var m = /^(?:\d+:)?[a-j](\d+)$/.exec(ref); return m ? +m[1] : null; }

    var counts = {};
    function autoId(p) {
      var base = p.id || { led: 'led', res: 'r', button: 'btn', pot: 'pot', ldr: 'ldr', buzzer: 'bz', ds: 'ds', wire: 'w' }[p.t] || p.kind;
      if (p.id) return p.id;
      counts[base] = (counts[base] || 0) + 1;
      return (p.t === 'res' || p.t === 'wire') ? base + counts[base] : (counts[base] > 1 ? base + counts[base] : base);
    }

    /* pass 1: everything except wires, so wires can avoid occupied holes */
    layout.parts.forEach(function (p, idx) {
      if (p.t === 'wire') return;
      var id = autoId(p), it = { idx: idx, t: p.t, id: id, p: p, s: idx + 1 };
      if (p.t === 'led') {
        /* the short leg may go straight into a rail (k: 'bn40') */
        it.a = H(p.a, id); it.k = /^(?:\d+:)?(tp|tn|bp|bn)\d*$/.test(p.k) ? endpoint(p.k, id) : H(p.k, id);
        pinNode[id + '.a'] = it.a.node; pinNode[id + '.k'] = it.k.node;
      } else if (p.t === 'res' || p.t === 'ldr') {
        it.a = H(p.a, id); it.b = H(p.b, id);
        pinNode[id + '.a'] = it.a.node; pinNode[id + '.b'] = it.b.node;
        if (p.t === 'res') resistors.push([it.a.node, it.b.node, id]);
      } else if (p.t === 'diode') {
        it.a = H(p.a, id); it.k = H(p.k, id);
        pinNode[id + '.a'] = it.a.node; pinNode[id + '.k'] = it.k.node;
      } else if (p.t === 'buzzer') {
        it.a = H(p.p, id); it.b = H(p.n, id);
        pinNode[id + '.p'] = it.a.node; pinNode[id + '.n'] = it.b.node;
      } else if (p.t === 'button') {
        var bb = p.board || 1, q = pre(bb);
        it.legs = [hole('e', p.col, id, bb), hole('e', p.col + 2, id, bb), hole('f', p.col, id, bb), hole('f', p.col + 2, id, bb)];
        union(q + 'b' + p.col, q + 't' + p.col); union(q + 'b' + (p.col + 2), q + 't' + (p.col + 2));   /* legs joined through the body */
        pinNode[id + '.1'] = q + 'b' + p.col; pinNode[id + '.2'] = q + 'b' + (p.col + 2);
      } else if (p.t === 'pot' || p.t === 'ds') {
        var st = strip(p.at), row = st[0], c0 = +st.slice(1), pb = bOf(p.at), names = p.t === 'pot' ? ['1', '2', '3'] : (p.names || ['GND', 'DQ', 'VDD']);
        it.legs = names.map(function (nm, k) { var h = hole(row, c0 + k, id, pb); pinNode[id + '.' + nm] = h.node; return h; });
        it.names = names;
      } else if (p.t === 'chip') {
        /* a DIP chip across the channel, notch on the left: legs 1..n/2 along row e from left to right,
           then the rest back along row f from right to left (so the last leg sits above leg 1) */
        var cb = p.board || 1, half = p.pins.length / 2;
        it.legs = p.pins.map(function (nm, k) {
          var h = k < half ? hole('e', p.col + k, id, cb) : hole('f', p.col + (p.pins.length - 1 - k), id, cb);
          if (pinNode[id + '.' + nm]) union(pinNode[id + '.' + nm], h.node);   /* two legs with one name are joined inside (a digit's two COM legs) */
          pinNode[id + '.' + nm] = h.node; return h;
        });
      } else if (p.t === 'mod') {
        var mc = +strip(p.at).slice(1), mb = bOf(p.at);
        it.legs = p.pins.map(function (nm, k) { var h = hole('j', mc + k, id, mb); pinNode[id + '.' + nm] = h.node; return h; });
      } else if (p.t === 'off') {
        var bottom = p.side === 'bottom', np = p.pins.length, cx = X(p.x), ob = p.board || 1;
        it.bottom = bottom; it.cx = cx;
        it.py = bottom ? tops[ob] + G.H + 20 : tops[ob] - 12;
        it.legs = p.pins.map(function (nm, k) {
          var e = { kind: 'off', x: cx + (k - (np - 1) / 2) * 26, y: it.py, node: 'N:' + id + '.' + nm, part: id, pin: nm, b: ob, top: tops[ob], label: p.label || null, pkind: p.kind };
          offPin[id + '.' + nm] = e; pinNode[id + '.' + nm] = e.node; return e;
        });
      }
      items.push(it);
    });

    /* pass 2: wires */
    layout.parts.forEach(function (p, idx) {
      if (p.t !== 'wire') return;
      var id = autoId(p);
      var a = endpoint(p.a, id, colOf(p.b)), b = endpoint(p.b, id, a.col || colOf(p.a));
      union(a.node, b.node);
      items.push({ idx: idx, t: 'wire', id: id, p: p, s: idx + 1, a: a, b: b });
    });
    items.sort(function (u, v) { return u.idx - v.idx; });

    /* Draw only as much of the board as the circuit uses, so the picture is large.
       A torn right edge shows that the real board continues. */
    var maxCol = 20;
    Object.keys(occ).forEach(function (k) { var m = /(\d+)$/.exec(k); if (m) maxCol = Math.max(maxCol, +m[1]); });
    items.forEach(function (it) { if (it.t === 'off') maxCol = Math.max(maxCol, it.p.x + 4); });
    var cols = layout.full ? G.cols : Math.min(G.cols, Math.max(36, maxCol + 4));

    return {
      items: items, errs: errs, find: find, pinNode: pinNode, resistors: resistors, occ: occ, cols: cols,
      tops: tops, top: tops[1], boards: nb, height: cursor, width: X(cols) + 22, Y: Y
    };
  }

  /* ---------- check a layout against a wiring table ---------- */
  P.checkLayout = function (layout, rows) {
    var r = resolve(layout), errs = r.errs.slice(), find = r.find;
    function target(w) { return 'PIN:' + (w.to === 'GND' || w.to === 'AGND' ? 'GND' : w.to); }
    function viaRes(a, b) {
      return r.resistors.some(function (e) {
        return (find(e[0]) === find(a) && find(e[1]) === find(b)) || (find(e[1]) === find(a) && find(e[0]) === find(b));
      });
    }
    if (rows) {
      if (!layout.map || layout.map.length !== rows.length) errs.push('map has ' + (layout.map || []).length + ' entries, table has ' + rows.length + ' rows');
      (layout.map || []).forEach(function (entry, i) {
        if (!rows[i]) return;
        [].concat(entry).forEach(function (ref) {
          var through = /~$/.test(ref), key = ref.replace(/~$/, ''), node = r.pinNode[key], tgt = target(rows[i]);
          if (!node) { errs.push('row ' + (i + 1) + ': no such part pin ' + key); return; }
          if (through) {
            if (find(node) === find(tgt)) errs.push('row ' + (i + 1) + ': ' + key + ' is wired straight to ' + rows[i].to + ', the resistor is bypassed');
            else if (!viaRes(node, tgt)) errs.push('row ' + (i + 1) + ': ' + key + ' does not reach ' + rows[i].to + ' through a resistor');
          } else if (find(node) !== find(tgt)) errs.push('row ' + (i + 1) + ': ' + key + ' is not connected to ' + rows[i].to);
        });
      });
    }
    /* no two different Pico pins may end up joined (that would be a short) */
    var seen = {};
    for (var n = 1; n <= 40; n++) {
      var pin = P.pinByNum(n), nm = pin.kind === 'gnd' ? 'GND' : pin.name, root = find('PIN:' + nm);
      if (seen[root] && seen[root] !== nm) errs.push('short: ' + seen[root] + ' is joined to ' + nm);
      seen[root] = nm;
    }
    /* the legs of one part must not share a column */
    r.items.forEach(function (it) {
      var nodes = [];
      if (it.a && it.b && it.t !== 'wire') nodes = [it.a.node, it.b.node];
      else if (it.a && it.k) nodes = [it.a.node, it.k.node];
      else if (it.t === 'button') nodes = [r.pinNode[it.id + '.1'], r.pinNode[it.id + '.2']];
      else if (it.legs && it.t !== 'off' && it.t !== 'chip') nodes = it.legs.map(function (l) { return l.node; });
      var roots = nodes.map(find);
      roots.forEach(function (x, i) { if (roots.indexOf(x) !== i) errs.push(it.id + ': two legs are connected to each other'); });
    });
    return errs;
  };

  /* ---------- drawing ---------- */
  function txt(x, y, s, cls, anchor, extra) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '>' + esc(s) + '</text>';
  }
  function legLine(x1, y1, x2, y2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="wv-leg"/>';
  }

  function boardSvg(r, bnum) {
    var top = r.tops[bnum || 1], w = r.width, N = r.cols, cut = N < G.cols, s = '';
    if (bnum > 1) s += txt(w / 2, top + 128, T(W.board) + ' ' + bnum, 'bb-boardname');
    s += '<rect class="bb-base" x="6" y="' + (top + 2) + '" width="' + (w - 12 + (cut ? 30 : 0)) + '" height="' + (G.H - 4) + '" rx="8"/>' +
      '<rect class="bb-gap" x="' + (G.L - 8) + '" y="' + (top + 122) + '" width="' + (X(N) - G.L + 16 + (cut ? 30 : 0)) + '" height="12" rx="3"/>';
    [['tp', '+'], ['tn', '−'], ['bp', '+'], ['bn', '−']].forEach(function (q) {
      var y = top + RY[q[0]], plus = q[1] === '+';
      s += '<line class="bb-rail ' + (plus ? 'p' : 'n') + '" x1="' + (G.L - 6) + '" y1="' + (y + (plus ? -7 : 7)) + '" x2="' + (X(N) + (cut ? 30 : 6)) + '" y2="' + (y + (plus ? -7 : 7)) + '"/>' +
        txt(16, y + 4, q[1], 'bb-lab');
      for (var c = 1; c <= N; c++) s += '<rect class="bb-hole" data-g="' + q[0] + '" x="' + (X(c) - 2.5) + '" y="' + (y - 2.5) + '" width="5" height="5" rx="1.2"/>';
    });
    'jihgfedcba'.split('').forEach(function (row) {
      var y = top + RY[row], isTop = 'fghij'.indexOf(row) >= 0;
      s += txt(16, y + 3.5, row, 'bb-lab');
      for (var c = 1; c <= N; c++) s += '<rect class="bb-hole" data-g="' + (isTop ? 't' : 'b') + c + '" x="' + (X(c) - 2.5) + '" y="' + (y - 2.5) + '" width="5" height="5" rx="1.2"/>';
    });
    for (var c = 5; c <= N; c += 5) s += txt(X(c), top + 47, String(c), 'bb-lab') + txt(X(c), top + 212, String(c), 'bb-lab');
    if (cut) {   /* torn edge: the real board carries on to column 63 */
      var ex = w - 1, d = 'M' + ex + ' ' + top;
      for (var y2 = 0; y2 <= G.H; y2 += 16) d += ' L' + (ex + (y2 / 16 % 2 ? -7 : 0)) + ' ' + (top + y2);
      s += '<path d="' + d + ' L' + (ex + 40) + ' ' + (top + G.H) + ' L' + (ex + 40) + ' ' + top + ' Z" class="bb-tear"/>';
    }
    return s;
  }

  function picoSvg(r) {
    var top = r.top, x1 = X(1) - 9, x2 = X(20) + 9, yh = top + RY.h, yc = top + RY.c, s = '';
    s += '<rect class="bb-pico" x="' + x1 + '" y="' + (yh - 8) + '" width="' + (x2 - x1) + '" height="' + (yc - yh + 16) + '" rx="6"/>' +
      '<rect x="' + (x1 - 9) + '" y="' + (top + 116) + '" width="18" height="24" rx="3" style="fill:#c9ced3;stroke:#8d9399"/>' +
      txt((x1 + x2) / 2, top + 132, 'Raspberry Pi Pico 2', 'bb-pico-t');
    for (var n = 1; n <= 40; n++) {
      var isTop = n > 20, col = isTop ? 41 - n : n, x = X(col), y = isTop ? yh : yc;
      var used = r.occ['a' + col] && !isTop || r.occ['b' + col] && !isTop || r.occ['i' + col] && isTop || r.occ['j' + col] && isTop;
      s += '<circle class="bb-pin' + (used ? ' used' : '') + '" cx="' + x + '" cy="' + y + '" r="' + (used ? 4.2 : 3.2) + '"/>';
      if (used) {
        var label = P.pinByNum(n).label;
        s += isTop
          ? '<text class="bb-ptag" x="' + x + '" y="' + (y + 9) + '" text-anchor="end" transform="rotate(-90 ' + x + ' ' + (y + 9) + ')" dy="3">' + esc(label) + '</text>'
          : '<text class="bb-ptag" x="' + x + '" y="' + (y - 9) + '" text-anchor="start" transform="rotate(-90 ' + x + ' ' + (y - 9) + ')" dy="3">' + esc(label) + '</text>';
      }
    }
    return s;
  }

  function partSvg(it, r) {
    var p = it.p, s = '';
    var top = it.a && it.a.top != null ? it.a.top : (it.legs && it.legs[0] && it.legs[0].top != null ? it.legs[0].top : r.top);
    if (it.t === 'wire') {
      var a = it.a, b = it.b, col = (COLORS[p.c] || COLORS.blue)[0];
      var dx = b.x - a.x, dy = b.y - a.y, d;
      if (a.b !== b.b) {
        /* a wire between two breadboards: a clean S-curve */
        d = 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + (a.y + dy * 0.5) + ' ' + b.x + ' ' + (b.y - dy * 0.5) + ' ' + b.x + ' ' + b.y;
      } else if (Math.abs(dx) < 2 || Math.abs(dy) > Math.abs(dx) * 3) {
        var bend = Math.min(16, Math.abs(dy) * 0.12) * (a.x > X(32) ? -1 : 1);
        d = 'M' + a.x + ' ' + a.y + ' Q' + ((a.x + b.x) / 2 + bend) + ' ' + ((a.y + b.y) / 2) + ' ' + b.x + ' ' + b.y;
      } else {
        var midY = (a.y + b.y) / 2, sag = Math.min(30, 8 + Math.abs(dx) * 0.14) * (midY > top + 128 ? 1 : -1);
        if (a.kind === 'off' || b.kind === 'off') sag = 0;
        if (p.sag != null) sag = p.sag;   /* a layout can set the dip itself, so parallel wires nest instead of crossing */
        d = 'M' + a.x + ' ' + a.y + ' C' + (a.x + dx * 0.15) + ' ' + (a.y + dy * 0.5 + sag) + ' ' + (b.x - dx * 0.15) + ' ' + (b.y - dy * 0.5 + sag) + ' ' + b.x + ' ' + b.y;
      }
      s = '<path d="' + d + '" class="wv-wire-o"/><path d="' + d + '" class="wv-wire" style="stroke:' + col + '"/>' +
        '<circle cx="' + a.x + '" cy="' + a.y + '" r="3.2" class="wv-end"/><circle cx="' + b.x + '" cy="' + b.y + '" r="3.2" class="wv-end"/>';
    } else if (it.t === 'res') {
      var mx = (it.a.x + it.b.x) / 2, y = it.a.y, bands = BANDS[p.val] || BANDS['330'];
      s = legLine(it.a.x, y, it.b.x, y) + '<rect x="' + (mx - 15) + '" y="' + (y - 5) + '" width="30" height="10" rx="4" class="wv-res"/>' +
        bands.map(function (c, i) { return '<rect x="' + (mx - 10 + i * 6) + '" y="' + (y - 5) + '" width="3.2" height="10" style="fill:' + c + '"/>'; }).join('') +
        txt(mx, y - 8, p.val + 'Ω', 'wv-tag');
    } else if (it.t === 'led') {
      var cx = (it.a.x + it.k.x) / 2, cy = it.a.y - 15, fill = LED_FILL[p.color] || LED_FILL.red;
      s = legLine(it.a.x, it.a.y, cx - 4, cy + 6) + legLine(it.k.x, it.k.y, cx + 4 * Math.sign(it.k.x - it.a.x || 1), cy + 6) +
        '<circle cx="' + cx + '" cy="' + cy + '" r="10" style="fill:' + fill + ';stroke:rgba(0,0,0,.35);stroke-width:1.5"/>' +
        '<circle cx="' + (cx - 3) + '" cy="' + (cy - 3) + '" r="3" style="fill:rgba(255,255,255,.55)"/>' +
        txt(it.a.x, it.a.y + 12, '+', 'wv-tag');
    } else if (it.t === 'ldr') {
      var lx = (it.a.x + it.b.x) / 2, ly = it.a.y - 15;
      s = legLine(it.a.x, it.a.y, lx - 4, ly + 6) + legLine(it.b.x, it.b.y, lx + 4, ly + 6) +
        '<circle cx="' + lx + '" cy="' + ly + '" r="10.5" style="fill:#e8e2d2;stroke:#b9b29c;stroke-width:1.2"/><circle cx="' + lx + '" cy="' + ly + '" r="8.5" style="fill:#d9925a"/>' +
        '<path d="M' + (lx - 6) + ' ' + (ly - 4) + ' h12 v2.7 h-12 v2.7 h12 v2.7 h-12" style="fill:none;stroke:#8f2a1f;stroke-width:1.3"/>';
    } else if (it.t === 'buzzer') {
      var bx = (it.a.x + it.b.x) / 2, by = it.a.y;
      s = '<circle cx="' + bx + '" cy="' + by + '" r="24" style="fill:#16191c;stroke:#0c0e10"/><circle cx="' + bx + '" cy="' + by + '" r="19.5" style="fill:#23282c;stroke:#3a4247;stroke-width:1.5"/>' +
        '<circle cx="' + bx + '" cy="' + by + '" r="4" style="fill:#0c0e10;stroke:#3a4247;stroke-width:1.5"/>' +
        txt(it.a.x, by - 9, '+', 'wv-onbody');
    } else if (it.t === 'button') {
      var x1 = it.legs[0].x, x2 = it.legs[1].x, y1 = it.legs[0].y, y2 = it.legs[2].y;
      s = '<rect x="' + (x1 - 5) + '" y="' + (y2 - 4) + '" width="' + (x2 - x1 + 10) + '" height="' + (y1 - y2 + 8) + '" rx="4" class="wv-body"/>' +
        '<rect x="' + (x1 - 2) + '" y="' + (y2 - 1) + '" width="' + (x2 - x1 + 4) + '" height="' + (y1 - y2 + 2) + '" rx="3" style="fill:#cfd6da;stroke:#7b858c"/>' +
        '<circle cx="' + ((x1 + x2) / 2) + '" cy="' + ((y1 + y2) / 2) + '" r="9.5" style="fill:#16191c"/><circle cx="' + ((x1 + x2) / 2) + '" cy="' + ((y1 + y2) / 2) + '" r="6.5" style="fill:#2f363b"/>' +
        it.legs.map(function (l) { return '<circle cx="' + l.x + '" cy="' + l.y + '" r="2.6" class="wv-pinpad"/>'; }).join('');
    } else if (it.t === 'pot') {
      var px = it.legs[1].x, py = it.legs[1].y;
      s = '<rect x="' + (it.legs[0].x - 9) + '" y="' + (py - 34) + '" width="' + (it.legs[2].x - it.legs[0].x + 18) + '" height="30" rx="5" style="fill:#2463c9;stroke:#174a9c;stroke-width:1.5"/>' +
        '<circle cx="' + px + '" cy="' + (py - 19) + '" r="12.5" style="fill:#2f7fe0;stroke:#174a9c;stroke-width:1.5;stroke-dasharray:2.4 2.4"/><circle cx="' + px + '" cy="' + (py - 19) + '" r="9" style="fill:#3d8cf0"/>' +
        '<path d="M' + (px - 6) + ' ' + (py - 19) + ' h12 M' + px + ' ' + (py - 25) + ' v12" style="stroke:#174a9c;stroke-width:2.2;stroke-linecap:round"/>' +
        it.legs.map(function (l) { return legLine(l.x, l.y, l.x, py - 5); }).join('');
    } else if (it.t === 'ds') {
      var dx0 = it.legs[0].x, dy0 = it.legs[0].y;
      s = '<path d="M' + (dx0 - 8) + ' ' + (dy0 - 6) + ' h' + (it.legs[2].x - dx0 + 16) + ' v-14 a' + ((it.legs[2].x - dx0 + 16) / 2) + ' 9 0 0 0 -' + (it.legs[2].x - dx0 + 16) + ' 0 z" class="wv-body"/>' +
        it.legs.map(function (l) { return legLine(l.x, l.y, l.x, dy0 - 6); }).join('') +
        it.legs.map(function (l, k) { return '<text class="wv-plab" x="' + l.x + '" y="' + (dy0 - 30) + '" text-anchor="start" transform="rotate(-90 ' + l.x + ' ' + (dy0 - 30) + ')" dy="3">' + esc(it.names[k]) + '</text>'; }).join('') +
        (p.label ? '<text x="' + it.legs[1].x + '" y="' + (dy0 - 11) + '" text-anchor="middle" style="font:700 6px var(--mono);fill:#e8edf0">' + esc(p.label) + '</text>' : '');
    } else if (it.t === 'diode') {
      var dmx = (it.a.x + it.k.x) / 2, dyy = it.a.y, dir = Math.sign(it.k.x - it.a.x) || 1;
      s = legLine(it.a.x, dyy, it.k.x, dyy) + '<rect x="' + (dmx - 12) + '" y="' + (dyy - 4.5) + '" width="24" height="9" rx="3" style="fill:#1b1f22"/>' +
        '<rect x="' + (dmx + dir * 7 - 2) + '" y="' + (dyy - 4.5) + '" width="4" height="9" style="fill:#cfd6da"/>' + txt(dmx, dyy - 8, '1N4007', 'wv-tag');
    } else if (it.t === 'chip' && p.look === 'seg7') {
      /* a seven-segment digit across the channel: a white block with a red "8" and its dot */
      var sh = it.legs.length / 2, sx1 = it.legs[0].x, sx2 = it.legs[sh - 1].x, sye = it.legs[0].y, syf = it.legs[sh].y;
      var scx = (sx1 + sx2) / 2, scy = (sye + syf) / 2, RED = 'fill:#e5484d', sw = 12, shh = 10, tk = 2.6;
      var bar = function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1" style="' + RED + '"/>'; };
      s = '<rect x="' + (sx1 - 8) + '" y="' + (syf - 10) + '" width="' + (sx2 - sx1 + 16) + '" height="' + (sye - syf + 20) + '" rx="3" style="fill:#f4f4f4;stroke:#9aa3a8;stroke-width:1.2"/>' +
        bar(scx - sw / 2 + 1, scy - shh - tk / 2, sw - 2, tk) + bar(scx - sw / 2 + 1, scy - tk / 2, sw - 2, tk) + bar(scx - sw / 2 + 1, scy + shh - tk / 2, sw - 2, tk) +
        bar(scx - sw / 2 - tk / 2, scy - shh + 1, tk, shh - 2) + bar(scx + sw / 2 - tk / 2, scy - shh + 1, tk, shh - 2) +
        bar(scx - sw / 2 - tk / 2, scy + 1, tk, shh - 2) + bar(scx + sw / 2 - tk / 2, scy + 1, tk, shh - 2) +
        '<circle cx="' + (scx + sw / 2 + 5) + '" cy="' + (scy + shh) + '" r="1.7" style="' + RED + '"/>' +
        it.legs.map(function (l, k) {
          return '<text x="' + l.x + '" y="' + (k < sh ? sye + 7.5 : syf - 3.5) + '" text-anchor="middle" style="font:700 5.3px var(--mono);fill:#2f3a40">' + esc(p.pins[k]) + '</text>';
        }).join('');
    } else if (it.t === 'chip') {
      /* silver legs from the holes to the body, the body over the channel, pin names beside the legs */
      var hf = it.legs.length / 2, lx = it.legs[0].x, rx2 = it.legs[hf - 1].x, ye = it.legs[0].y, yf = it.legs[hf].y;
      var cyc = (ye + yf) / 2, lab = 'font:700 5.3px var(--mono);fill:#2f3a40';
      s = it.legs.map(function (l) {
        return '<rect x="' + (l.x - 2.2) + '" y="' + (l.y < cyc ? l.y - 2 : ye - 9.5) + '" width="4.4" height="' + (ye - yf - 5) / 2 + '" rx="1" style="fill:#c4cbd0;stroke:#7b858c;stroke-width:.6"/>';
      }).join('') +
        '<rect x="' + (lx - 8) + '" y="' + (yf + 5) + '" width="' + (rx2 - lx + 16) + '" height="' + (ye - yf - 10) + '" rx="2.5" style="fill:#1b1f22;stroke:#0c0e10"/>' +
        '<path d="M' + (lx - 8) + ' ' + (cyc - 5) + ' a5 5 0 0 1 0 10" style="fill:#596168"/>' +
        '<circle cx="' + (lx - 1) + '" cy="' + (ye - 9) + '" r="1.6" style="fill:#596168"/>' +
        '<text x="' + ((lx + rx2) / 2) + '" y="' + (cyc + 3.5) + '" text-anchor="middle" style="font:700 10px var(--mono);fill:#e8edf0">' + esc(p.label || 'IC') + '</text>' +
        it.legs.map(function (l, k) {
          return '<text x="' + l.x + '" y="' + (k < hf ? ye + 10.5 : yf - 6) + '" text-anchor="middle" style="' + lab + '">' + esc(p.pins[k]) + '</text>';
        }).join('');
    } else if (it.t === 'mod' && p.kind === 'rgb') {
      /* a bare LED with four legs, not a board */
      var rx = (it.legs[0].x + it.legs[3].x) / 2, ry = top - 40;
      s = it.legs.map(function (l, k) { return legLine(l.x, l.y, rx - 9 + k * 6, ry + 14); }).join('') +
        '<path d="M' + (rx - 15) + ' ' + (ry + 12) + ' V' + (ry - 6) + ' a15 15 0 0 1 30 0 V' + (ry + 12) + ' Z" style="fill:#f4f6f7;stroke:#b9c0c5;stroke-width:1.5"/>' +
        '<circle cx="' + (rx - 5) + '" cy="' + (ry - 3) + '" r="4.5" style="fill:#e5484d;opacity:.8"/><circle cx="' + (rx + 5) + '" cy="' + (ry - 3) + '" r="4.5" style="fill:#3fb950;opacity:.8"/>' +
        '<circle cx="' + rx + '" cy="' + (ry + 4) + '" r="4.5" style="fill:#2f7fd1;opacity:.8"/>' +
        '<rect x="' + (rx - 18) + '" y="' + (ry + 11) + '" width="36" height="5" rx="1.5" style="fill:#dfe4e7;stroke:#b9c0c5"/>' +
        it.legs.map(function (l, k) { return txt(l.x + (k - 1.5) * 3, top - 5, p.pins[k], 'wv-name'); }).join('') +
        txt(rx, ry - 26, p.label || compShort(p.kind), 'wv-name');
    } else if (it.t === 'mod') {
      var first = it.legs[0].x, last = it.legs[it.legs.length - 1].x, mw = Math.max(last - first + 22, 78), mcx = (first + last) / 2;
      var by2 = top - 12, bh = 88;
      s = it.legs.map(function (l) { return legLine(l.x, l.y, l.x, by2); }).join('') +
        '<rect x="' + (mcx - mw / 2) + '" y="' + (by2 - bh) + '" width="' + mw + '" height="' + bh + '" rx="6" class="wv-pcb"' + pcbStyle(p.kind) + '/>' +
        modGlyph(p.kind, mcx, by2 - bh + 28, mw) +
        it.legs.map(function (l, k) { return '<text class="wv-plab on" x="' + l.x + '" y="' + (by2 - 5) + '" text-anchor="start" transform="rotate(-90 ' + l.x + ' ' + (by2 - 5) + ')" dy="3">' + esc(p.pins[k]) + '</text>'; }).join('') +
        txt(mcx, by2 - bh - 5, p.label || compShort(p.kind), 'wv-name');
    } else if (it.t === 'off') {
      var ow = Math.max(it.legs.length * 26 + 16, 96), oy = it.bottom ? it.py + 8 : it.py - 8 - 74;
      s = '<rect x="' + (it.cx - ow / 2) + '" y="' + oy + '" width="' + ow + '" height="74" rx="8" class="' + (p.kind === 'servo' ? 'wv-servo' : p.kind === 'link' ? 'bb-pico' : 'wv-pcb') + '"' + pcbStyle(p.kind) + '/>' +
        offGlyph(p.kind, it.cx, oy + (it.bottom ? 44 : 30), ow) +
        it.legs.map(function (l, k) {
          return '<rect x="' + (l.x - 4) + '" y="' + (it.bottom ? oy - 4 : oy + 70) + '" width="8" height="8" rx="2" class="wv-pinpad"/>' +
            txt(l.x, it.bottom ? oy + 16 : oy + 64, p.pins[k], 'wv-plab on');
        }).join('') +
        txt(it.cx, it.bottom ? oy + 90 : oy - 6, p.label || compShort(p.kind), 'wv-name');
    }
    return s;
  }
  function compShort(kind) {
    var pl = P.planner && P.planner.PLAN[kind];
    return pl ? T(pl.short) : compName(kind);
  }
  function pcbStyle(kind) { var c = P.pcbColor && P.pcbColor[kind]; return c ? ' style="fill:' + c + '"' : ''; }
  function modGlyph(kind, cx, cy, w) {
    if (P.partGlyph && P.partGlyph[kind]) return P.partGlyph[kind](cx, cy, w);
    if (kind === 'hcsr04') return '<circle cx="' + (cx - 18) + '" cy="' + cy + '" r="13" style="fill:#cfd6da;stroke:#7b858c"/><circle cx="' + (cx - 18) + '" cy="' + cy + '" r="7" style="fill:#3a4247"/>' +
      '<circle cx="' + (cx + 18) + '" cy="' + cy + '" r="13" style="fill:#cfd6da;stroke:#7b858c"/><circle cx="' + (cx + 18) + '" cy="' + cy + '" r="7" style="fill:#3a4247"/>';
    if (kind === 'oled') return '<rect x="' + (cx - w / 2 + 8) + '" y="' + (cy - 20) + '" width="' + (w - 16) + '" height="34" rx="3" style="fill:#0b0f12"/>' + txt(cx, cy + 1, 'Hello', 'wv-screen');
    if (kind === 'dht22') return '<rect x="' + (cx - 20) + '" y="' + (cy - 20) + '" width="40" height="38" rx="3" style="fill:#f4f4f4;stroke:#b9c0c5"/>' +
      '<path d="M' + (cx - 12) + ' ' + (cy - 10) + ' h24 m-24 8 h24 m-24 8 h24" style="stroke:#8d969c;stroke-width:3;stroke-dasharray:5 3"/>';
    if (kind === 'sdcard') return '<rect x="' + (cx - 20) + '" y="' + (cy - 20) + '" width="40" height="34" rx="3" style="fill:#cfd6da;stroke:#7b858c"/>' + txt(cx, cy + 2, 'SD', 'wv-tag');
    if (kind === 'gps') return '<rect x="' + (cx - 18) + '" y="' + (cy - 20) + '" width="36" height="36" rx="3" style="fill:#e9dcc0;stroke:#b8a77e"/><circle cx="' + cx + '" cy="' + (cy - 2) + '" r="4" style="fill:#b8a77e"/>';
    return '<rect x="' + (cx - 10) + '" y="' + (cy - 14) + '" width="20" height="20" rx="3" style="fill:#1b1f22"/>';
  }
  function offGlyph(kind, cx, cy, w) {
    if (P.partGlyph && P.partGlyph[kind]) return P.partGlyph[kind](cx, cy, w);
    if (kind === 'servo') return '<circle cx="' + (cx - 14) + '" cy="' + cy + '" r="11" style="fill:#f4f4f4;stroke:#9aa3a8;stroke-width:1.5"/><rect x="' + (cx - 17) + '" y="' + (cy - 3) + '" width="44" height="6" rx="3" style="fill:#f4f4f4;stroke:#9aa3a8"/>';
    if (kind === 'pir') return '<circle cx="' + cx + '" cy="' + cy + '" r="17" style="fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1.5"/><path d="M' + (cx - 17) + ' ' + cy + ' h34 M' + cx + ' ' + (cy - 17) + ' v34" style="stroke:#c9ced3"/>';
    if (kind === 'neopixel') {
      var s = '', cols = ['#e5484d', '#3fb950', '#2f7fd1', '#e9c46a'];
      for (var i = 0; i < 4; i++) s += '<rect x="' + (cx - 40 + i * 21) + '" y="' + (cy - 9) + '" width="17" height="17" rx="2" style="fill:#f4f4f4"/><circle cx="' + (cx - 31.5 + i * 21) + '" cy="' + (cy - 0.5) + '" r="5" style="fill:' + cols[i] + '"/>';
      return s;
    }
    if (kind === 'link') return '';
    return '';
  }

  /* ---------- captions for the step-by-step mode ---------- */
  function code(s) { return '<code>' + esc(s) + '</code>'; }
  function where(e) {
    if (e.kind === 'rail') return T(e.rail === 'tp' || e.rail === 'bp' ? W.railP : W.railN);
    if (e.kind === 'off') return T(W.pinOf) + ' ' + code(e.pin) + ' ' + T(W.of) + ' ' + esc(e.label || compShort(e.pkind));
    var s = (e.b > 1 ? T(W.onBoard) + ' ' + e.b + ', ' : '') + code(e.ref);
    if (e.pico) s += ' (' + T(W.colOf) + ' ' + code(e.pico.label) + ', ' + T(W.pin) + ' ' + e.pico.num + ')';
    return s;
  }
  function caption(it) {
    var p = it.p;
    if (it.t === 'wire') return T(W.wire) + ' ' + T((COLORS[p.c] || COLORS.blue)[1]) + ': ' + T(W.from) + where(it.a) + T(W.to) + where(it.b) + '.';
    if (it.t === 'res') return T(W.res) + ' ' + p.val + 'Ω' + T(W.between) + code(it.a.ref) + T(W.and) + code(it.b.ref) + '.';
    if (it.t === 'led') return T(W.led) + ': ' + T(W.long) + code(it.a.ref) + ', ' + (it.k.kind === 'rail' ? T(W.shortRail) + where(it.k) : T(W.short) + code(it.k.ref)) + '.';
    if (it.t === 'ldr') return T(W.ldr) + code(it.a.ref) + T(W.other) + code(it.b.ref) + '.';
    if (it.t === 'diode') return T(W.diode) + code(it.a.ref) + T(W.diodeK) + code(it.k.ref) + '.';
    if (it.t === 'buzzer') return T(W.buzzer) + code('+') + ' ' + code(it.a.ref) + ', ' + code('−') + ' ' + code(it.b.ref) + '.';
    if (it.t === 'button') return T(W.button) + ' ' + p.col + ' / ' + (p.col + 2) + '.';
    if (it.t === 'pot') return T(W.pot) + it.legs.map(function (l) { return code(l.ref); }).join(', ') + '.';
    if (it.t === 'ds') return (p.label ? esc(p.label) + T(W.flat) : T(W.ds)) + it.legs.map(function (l, k) { return code(it.names[k]) + ' ' + code(l.ref); }).join(', ') + '.';
    if (it.t === 'chip') return esc(p.label || 'IC') + T(p.look === 'seg7' ? W.seg7 : W.chip) + ' ' + it.legs[0].col + ' ' + T(W.upto) + ' ' + it.legs[it.legs.length / 2 - 1].col + '. ' + T(W.chipLeg1) + code(it.legs[0].ref) + '.';
    if (it.t === 'mod') return esc(p.label || compName(p.kind)) + T(W.mod) + ' ' + it.legs[0].col + ' ' + T(W.upto) + ' ' + it.legs[it.legs.length - 1].col + ' (' + p.pins.map(code).join(', ') + ').';
    if (it.t === 'off') return esc(p.label || compName(p.kind)) + T(p.kind === 'link' ? W.linkOff : W.off);
    return '';
  }

  function render(layout, opts) {
    opts = opts || {};
    var r = resolve(layout);
    var body = '';
    for (var bn = 1; bn <= r.boards; bn++) body += boardSvg(r, bn);
    if (!layout.noPico) body += picoSvg(r);
    /* parts first, wires on top */
    var order = r.items.filter(function (i) { return i.t !== 'wire'; }).concat(r.items.filter(function (i) { return i.t === 'wire'; }));
    order.forEach(function (it) {
      body += '<g class="wp" data-s="' + it.s + '" data-id="' + esc(it.id) + '">' + partSvg(it, r) + '</g>';
    });
    return {
      r: r,
      svg: '<svg class="art bb wv-svg" viewBox="0 0 ' + r.width + ' ' + r.height + '" width="' + r.width + '" height="' + r.height + '" role="img" aria-label="breadboard wiring">' + body + '</svg>'
    };
  }

  /* An empty board, used by the "which holes are connected" demo in Basics. */
  P.bbSvg = function () { return render({ parts: [], noPico: true, full: true }).svg; };

  P.layoutFor = function (id) {
    var l = P.layouts && P.layouts[id];
    return typeof l === 'string' ? P.layouts[l] : l || null;
  };

  /* ---------- interactive view ---------- */
  /* opts: { rows: NodeList of the wiring table's <tr>, wiring: the table's data rows } */
  P.wiringView = function (host, layoutId, opts) {
    opts = opts || {};
    var layout = typeof layoutId === 'string' ? P.layoutFor(layoutId) : layoutId;
    if (!layout) return null;
    var out = render(layout), r = out.r, items = r.items, total = items.length;
    var used = {};
    items.forEach(function (it) { if (it.t === 'wire') used[it.p.c === 'red' ? 'red' : it.p.c === 'black' ? 'black' : 'sig'] = true; });

    var el = document.createElement('div');
    el.className = 'wv card';
    el.innerHTML =
      '<div class="wv-bar"><b>' + T(W.title) + '</b><span class="wv-sp"></span>' +
      '<button type="button" class="btn small" data-a="start">' + T(W.stepwise) + '</button>' +
      '<span class="wv-nav" hidden><button type="button" class="btn ghost small" data-a="prev">' + T(W.prev) + '</button>' +
      '<b class="mono wv-count"></b>' +
      '<button type="button" class="btn small" data-a="next">' + T(W.next) + '</button>' +
      '<button type="button" class="btn ghost small" data-a="all">' + T(W.all) + '</button></span></div>' +
      '<div class="wv-scroll" dir="ltr">' + out.svg + '</div>' +
      '<p class="wv-cap" aria-live="polite"></p>' +
      '<div class="wv-legend">' +
      (used.red ? '<span><i style="background:' + COLORS.red[0] + '"></i>' + T(W.lgPwr) + '</span>' : '') +
      (used.black ? '<span><i style="background:' + COLORS.black[0] + '"></i>' + T(W.lgGnd) + '</span>' : '') +
      (used.sig ? '<span><i class="sig"></i>' + T(W.lgSig) + '</span>' : '') +
      '<span class="muted">' + T(W.note) + '</span></div>';
    host.appendChild(el);

    var svg = el.querySelector('svg'), cap = el.querySelector('.wv-cap');
    var groups = Array.prototype.slice.call(svg.querySelectorAll('.wp'));
    var step = 0;   /* 0 = everything shown */

    function show() {
      groups.forEach(function (g) {
        var s = +g.dataset.s;
        g.style.display = step && s > step ? 'none' : '';
        g.classList.toggle('cur', !!step && s === step);
      });
      el.querySelector('.wv-nav').hidden = !step;
      el.querySelector('[data-a=start]').hidden = !!step;
      if (!step) { cap.innerHTML = T(W.whole); return; }
      el.querySelector('.wv-count').textContent = step + ' / ' + total;
      el.querySelector('[data-a=prev]').disabled = step === 1;
      el.querySelector('[data-a=next]').disabled = step === total;
      var it = items.filter(function (x) { return x.s === step; })[0];
      cap.innerHTML = '<b>' + T(W.step) + ' ' + step + '.</b> ' + caption(it);
      var g = groups.filter(function (x) { return +x.dataset.s === step; })[0];
      if (g && g.getBBox) {
        var box = g.getBBox(), sc = el.querySelector('.wv-scroll');
        if (box.x < sc.scrollLeft || box.x + box.width > sc.scrollLeft + sc.clientWidth) sc.scrollLeft = Math.max(0, box.x - 40);
      }
    }
    el.querySelector('.wv-bar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      var a = b.dataset.a;
      if (a === 'start') step = 1;
      else if (a === 'prev') step = Math.max(1, step - 1);
      else if (a === 'next') step = Math.min(total, step + 1);
      else step = 0;
      show();
    });
    show();

    /* cross-highlight between the wiring table and the picture */
    if (opts.rows && layout.map) {
      var rowIds = layout.map.map(function (entry, i) {
        var ids = {}, roots = {};
        [].concat(entry).forEach(function (ref) {
          var key = ref.replace(/~$/, '');
          ids[key.split('.')[0]] = true;
          if (r.pinNode[key]) roots[r.find(r.pinNode[key])] = true;
          if (/~$/.test(ref)) r.resistors.forEach(function (e) {
            if (roots[r.find(e[0])] || roots[r.find(e[1])]) { ids[e[2]] = true; roots[r.find(e[0])] = true; roots[r.find(e[1])] = true; }
          });
        });
        items.forEach(function (it) { if (it.t === 'wire' && roots[r.find(it.a.node)]) ids[it.id] = true; });
        return ids;
      });
      var trs = Array.prototype.slice.call(opts.rows);
      var focus = function (ids) {
        svg.classList.toggle('focus', !!ids);
        groups.forEach(function (g) { g.classList.toggle('hot', !!ids && !!ids[g.dataset.id]); });
      };
      trs.forEach(function (tr, i) {
        tr.addEventListener('mouseenter', function () { focus(rowIds[i]); tr.classList.add('hot'); });
        tr.addEventListener('mouseleave', function () { focus(null); tr.classList.remove('hot'); });
      });
      groups.forEach(function (g) {
        g.addEventListener('mouseenter', function () {
          trs.forEach(function (tr, i) { tr.classList.toggle('hot', !!(rowIds[i] && rowIds[i][g.dataset.id])); });
        });
        g.addEventListener('mouseleave', function () { trs.forEach(function (tr) { tr.classList.remove('hot'); }); });
      });
    }
    return el;
  };

  /* ---------- planner: what connects to what ---------- */
  /* groups: [{ name, rows: [{ label, pin (a P.pins entry) }] }] */
  P.connDiagram = function (groups) {
    var ph = 17, picoW = 96, boxW = 150, gap = 150, pad = 14;
    var cx = boxW + gap + picoW / 2 + pad, picoTop = 34, picoH = 20 * ph + 16;
    function pinY(n) { return picoTop + 16 + ((n <= 20 ? n : 41 - n) - 1) * ph; }
    var sides = { L: [], R: [] }, load = { L: 0, R: 0 };
    function isSig(r) { return r.pin.kind === 'gpio'; }
    groups.forEach(function (g) {
      /* a part goes on the side where its signal pins are; power and ground are shown as labels, not wires */
      var sig = g.rows.filter(isSig), left = sig.filter(function (r) { return r.pin.num <= 20; }).length;
      var side = left * 2 > sig.length ? 'L' : left * 2 < sig.length ? 'R' : (load.L <= load.R ? 'L' : 'R');
      sides[side].push(g); load[side] += g.rows.length + 2;
    });
    var palette = ['yellow', 'green', 'blue', 'orange', 'purple'], pi = 0;
    var s = '', maxY = picoTop + picoH, usedPins = {};
    ['L', 'R'].forEach(function (side) {
      var y = picoTop;
      sides[side].forEach(function (g) {
        var h = 26 + g.rows.length * 18 + 8, x = side === 'L' ? pad : cx + picoW / 2 + gap;
        s += '<rect x="' + x + '" y="' + y + '" width="' + boxW + '" height="' + h + '" rx="8" class="box"/>' +
          txt(x + boxW / 2, y + 18, g.name, 'cd-name');
        g.rows.forEach(function (row, k) {
          var ry = y + 36 + k * 18, n = row.pin.num, onLeft = n <= 20;
          var x1 = side === 'L' ? x + boxW : x, x2 = cx + (onLeft ? -picoW / 2 : picoW / 2), y2 = pinY(n);
          s += txt(side === 'L' ? x + boxW - 8 : x + 8, ry + 4, row.label, 'cd-pin', side === 'L' ? 'end' : 'start');
          usedPins[n] = true;
          if (!isSig(row)) {
            var pc = row.pin.kind === 'gnd' ? '#55606a' : COLORS.red[0], tx0 = side === 'L' ? x1 + 6 : x1 - 6 - 98;
            s += '<rect x="' + tx0 + '" y="' + (ry - 7) + '" width="98" height="14" rx="7" style="fill:' + pc + '"/>' +
              txt(tx0 + 49, ry + 3.5, row.pin.label + ' · ' + n, 'cd-chip');
            return;
          }
          var col = COLORS[palette[pi++ % palette.length]][0];
          var c1 = x1 + (side === 'L' ? 60 : -60), c2 = x2 + (onLeft ? -60 : 60);
          s += '<path d="M' + x1 + ' ' + ry + ' C' + c1 + ' ' + ry + ' ' + c2 + ' ' + y2 + ' ' + x2 + ' ' + y2 + '" class="wv-wire" style="stroke:' + col + ';stroke-width:2.6"/>';
        });
        y += h + 12;
      });
      maxY = Math.max(maxY, y);
    });
    var pico = '<rect x="' + (cx - picoW / 2) + '" y="' + picoTop + '" width="' + picoW + '" height="' + picoH + '" rx="8" class="bb-pico"/>' +
      '<rect x="' + (cx - 14) + '" y="' + (picoTop - 10) + '" width="28" height="18" rx="3" style="fill:#c9ced3;stroke:#8d9399"/>' +
      txt(cx, picoTop + picoH / 2, 'Pico 2', 'bb-pico-t');
    for (var n = 1; n <= 40; n++) {
      var left = n <= 20, y = pinY(n), x = cx + (left ? -picoW / 2 + 7 : picoW / 2 - 7);
      pico += '<circle class="bb-pin' + (usedPins[n] ? ' used' : '') + '" cx="' + x + '" cy="' + y + '" r="' + (usedPins[n] ? 4 : 2.6) + '"/>';
      if (usedPins[n]) pico += txt(x + (left ? 8 : -8), y + 3, P.pinByNum(n).label, 'cd-plab', left ? 'start' : 'end');
    }
    var w = cx + picoW / 2 + (sides.R.length ? gap + boxW : 0) + pad;
    return '<svg class="art cd" viewBox="0 0 ' + w + ' ' + (maxY + 8) + '" width="' + w + '" height="' + (maxY + 8) + '" role="img" aria-label="connections">' + pico + s + '</svg>';
  };

  P.wiring = { resolve: resolve, render: render };
})(window.PICO);
