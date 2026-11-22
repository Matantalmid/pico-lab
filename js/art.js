/* Drawings: one simple picture per catalog part (with its legs labelled),
   the explanatory figures for the Basics chapters, and the breadboard.
   Everything is inline SVG that follows the page's colour tokens. */
(function (P) {
  'use strict';
  var T = P.t;

  var W = {
    long: { he: 'רגל ארוכה', en: 'long leg' }, short: { he: 'רגל קצרה', en: 'short leg' },
    plus: { he: 'חיובי', en: 'positive' }, gnd: { he: 'אדמה', en: 'ground' },
    pair: { he: 'זוג מחובר', en: 'joined pair' }, press: { he: 'לחיצה מחברת בין הזוגות', en: 'pressing joins the two pairs' },
    end: { he: 'קצה', en: 'end' }, mid: { he: 'אמצע', en: 'middle' },
    noDir: { he: 'אין כיוון', en: 'no direction' },
    flat: { he: 'הצד השטוח פונה אליכם', en: 'flat side facing you' },
    sig: { he: 'אות', en: 'signal' }, brown: { he: 'חום', en: 'brown' }, red: { he: 'אדום', en: 'red' }, orange: { he: 'כתום', en: 'orange' },
    dataDir: { he: 'כיוון הנתונים', en: 'data direction' },
    input: { he: 'קלט', en: 'Input' }, output: { he: 'פלט', en: 'Output' }, process: { he: 'עיבוד', en: 'Processing' },
    inEx: { he: 'כפתור, חיישן', en: 'button, sensor' }, outEx: { he: 'לד, מנוע, מסך', en: 'LED, motor, display' },
    prog: { he: 'התוכנית שלכם', en: 'your program' },
    vLabel: { he: 'מתח = גובה המים (הלחץ)', en: 'Voltage = water height (pressure)' },
    iLabel: { he: 'זרם = כמות המים שזורמת', en: 'Current = how much water flows' },
    rLabel: { he: 'התנגדות = קטע צר', en: 'Resistance = a narrow section' },
    gLabel: { he: 'אדמה = הבריכה למטה', en: 'Ground = the pool below' },
    loop: { he: 'הזרם זורם רק במסלול סגור', en: 'Current only flows round a closed path' },
    pinOut: { he: 'פין של ה-Pico', en: 'a Pico pin' }, res: { he: 'נגד', en: 'resistor' }, led: { he: 'לד', en: 'LED' },
    dig: { he: 'דיגיטלי: רק 0 או 1', en: 'Digital: only 0 or 1' }, ana: { he: 'אנלוגי: כל ערך', en: 'Analog: any value' },
    bands: { he: 'הפסים מציינים את הערך', en: 'the bands show the value' },
    sum: { he: 'סכום הביטים הדולקים', en: 'sum of the bits that are on' },
    usbSide: { he: 'USB', en: 'USB' }, wire: { he: 'חוט גישור', en: 'jumper wire' },
    res330: { he: 'נגד 330Ω', en: '330 Ω resistor' }
  };

  function svg(w, h, body, label) {
    return '<svg class="art" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + P.esc(label || '') + '">' + body + '</svg>';
  }
  function tx(x, y, s, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + P.esc(s) + '</text>';
  }
  function leg(x, y1, y2) { return '<line class="leg" x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '"/>'; }

  /* A module: a small board with a row of labelled header pins along the bottom. */
  function mod(o) {
    var pitch = o.pitch || 30, n = o.pins.length;
    var w = Math.max(o.w, (n - 1) * pitch + 36), h = o.h, x0 = 16, y0 = 10;
    var s = '<rect class="pcb" x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="6"/>' + o.body(x0, y0, w, h);
    var px = x0 + (w - (n - 1) * pitch) / 2;
    o.pins.forEach(function (p, i) {
      var x = px + i * pitch;
      s += '<rect class="pad" x="' + (x - 5) + '" y="' + (y0 + h - 15) + '" width="10" height="10" rx="2"/>' +
        leg(x, y0 + h, y0 + h + 20) + tx(x, y0 + h + 35, p, 'mono');
    });
    return svg(w + 32, h + 62, s, o.label);
  }

  /* The part drawings themselves live in art-2.js. */
  var ART = {};

  P.art = function (id) { return ART[id] ? ART[id]() : ''; };
  P._art = { ART: ART, svg: svg, tx: tx, leg: leg, mod: mod };   // extended by art-2.js

  /* ---------- breadboard ---------- */
  var BB = { cols: 30, pitch: 16, left: 30 };
  var ROW_Y = { j: 62, i: 78, h: 94, g: 110, f: 126, e: 158, d: 174, c: 190, b: 206, a: 222 };
  var RAIL_Y = { tp: 18, tn: 34, bp: 250, bn: 266 };
  function bx(col) { return BB.left + (col - 1) * BB.pitch; }
  function bxy(ref) { var m = /^([a-j])(\d+)$/.exec(ref); return [bx(parseInt(m[2], 10)), ROW_Y[m[1]]]; }

  /* opts: { pico: bool, parts: [...], labels: [...] } */
  P.bbSvg = function (opts) {
    opts = opts || {};
    var w = BB.left + BB.cols * BB.pitch + 4, h = 284;
    var s = '<rect class="bb-base" x="4" y="4" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="8"/>' +
      '<rect class="bb-gap" x="' + (BB.left - 10) + '" y="136" width="' + (BB.cols * BB.pitch + 4) + '" height="12" rx="3"/>';
    [['tp', '+'], ['tn', '−'], ['bp', '+'], ['bn', '−']].forEach(function (r) {
      var y = RAIL_Y[r[0]], plus = r[1] === '+';
      s += '<line class="bb-rail ' + (plus ? 'p' : 'n') + '" x1="' + (BB.left - 8) + '" y1="' + (y - 8) + '" x2="' + (bx(BB.cols) + 8) + '" y2="' + (y - 8) + '"/>' +
        tx(14, y + 4, r[1], 'bb-lab');
      for (var c = 1; c <= BB.cols; c++) {
        if (c % 6 === 0) continue;
        s += '<rect class="bb-hole" data-g="' + r[0] + '" x="' + (bx(c) - 3) + '" y="' + (y - 3) + '" width="6" height="6" rx="1.5"/>';
      }
    });
    Object.keys(ROW_Y).forEach(function (row) {
      var y = ROW_Y[row], top = 'fghij'.indexOf(row) >= 0;
      s += tx(14, y + 4, row, 'bb-lab');
      for (var c = 1; c <= BB.cols; c++) {
        s += '<rect class="bb-hole" data-g="' + (top ? 't' : 'b') + c + '" x="' + (bx(c) - 3) + '" y="' + (y - 3) + '" width="6" height="6" rx="1.5"/>';
      }
    });
    for (var c = 5; c <= BB.cols; c += 5) s += tx(bx(c), 50, String(c), 'bb-lab');

    if (opts.pico) {
      var x1 = bx(1) - 10, x2 = bx(20) + 10;
      s += '<rect class="bb-pico" x="' + x1 + '" y="' + (ROW_Y.h - 9) + '" width="' + (x2 - x1) + '" height="' + (ROW_Y.c - ROW_Y.h + 18) + '" rx="6"/>' +
        '<rect x="' + (x1 - 10) + '" y="' + (ROW_Y.f + 4) + '" width="20" height="26" rx="3" style="fill:#c9ced3;stroke:#8d9399"/>' +
        tx((x1 + x2) / 2, 146, 'Raspberry Pi Pico 2', 'bb-pico-t');
      for (var k = 1; k <= 20; k++) {
        s += '<circle class="bb-pin" cx="' + bx(k) + '" cy="' + ROW_Y.h + '" r="3.5"/><circle class="bb-pin" cx="' + bx(k) + '" cy="' + ROW_Y.c + '" r="3.5"/>';
      }
    }
    (opts.parts || []).forEach(function (p) {
      var a = bxy(p.from), b = bxy(p.to);
      if (p.type === 'wire') {
        var my = Math.max(a[1], b[1]) + 22;
        s += '<path d="M' + a[0] + ' ' + a[1] + ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1] + '" style="stroke:' + p.color + ';stroke-width:3.5;fill:none;stroke-linecap:round"/>';
      } else if (p.type === 'res') {
        var mx = (a[0] + b[0]) / 2;
        s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" style="stroke:#9aa3a8;stroke-width:2.5"/>' +
          '<rect x="' + (mx - 15) + '" y="' + (a[1] - 5) + '" width="30" height="10" rx="4" style="fill:#e3c08a;stroke:#a67c3d"/>' +
          '<path d="M' + (mx - 8) + ' ' + (a[1] - 5) + ' v10 M' + (mx - 2) + ' ' + (a[1] - 5) + ' v10 M' + (mx + 5) + ' ' + (a[1] - 5) + ' v10" style="stroke:#c2571a;stroke-width:2.5"/>';
      } else if (p.type === 'led') {
        var cx = (a[0] + b[0]) / 2;
        s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + (cx - 4) + '" y2="' + (a[1] - 12) + '" style="stroke:#9aa3a8;stroke-width:2.5"/>' +
          '<line x1="' + b[0] + '" y1="' + b[1] + '" x2="' + (cx + 4) + '" y2="' + (b[1] - 12) + '" style="stroke:#9aa3a8;stroke-width:2.5"/>' +
          '<circle cx="' + cx + '" cy="' + (a[1] - 18) + '" r="10" style="fill:#e5484d;stroke:#b3262b;stroke-width:2"/>';
      }
      s += '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="3" style="fill:#3a4247"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="3" style="fill:#3a4247"/>';
    });
    (opts.labels || []).forEach(function (l) {
      var p = bxy(l.at);
      s += '<line class="bb-lead" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + (p[0] + (l.dx || 0)) + '" y2="' + (p[1] + l.dy) + '"/>' +
        '<rect class="bb-tagbg" x="' + (p[0] + (l.dx || 0) - l.w / 2) + '" y="' + (p[1] + l.dy - (l.dy < 0 ? 16 : 0)) + '" width="' + l.w + '" height="16" rx="4"/>' +
        tx(p[0] + (l.dx || 0), p[1] + l.dy + (l.dy < 0 ? -4 : 12), l.text, 'bb-tag');
    });
    return '<svg class="art bb" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="breadboard">' + s + '</svg>';
  };

  /* ---------- figures for the Basics chapters ---------- */
  var FIG = {
    ipo: function () {
      var box = function (x, title, sub, cls) {
        return '<rect x="' + x + '" y="20" width="130" height="80" rx="10" class="' + cls + '"/>' +
          tx(x + 65, 54, title, 'big') + tx(x + 65, 78, sub);
      };
      var arrow = function (x) { return '<path class="s arrow" d="M' + x + ' 60 h36 m-9 -8 l9 8 l-9 8"/>'; };
      return svg(500, 120, box(10, T(W.input), T(W.inEx), 'box') + arrow(146) +
        box(186, 'Pico 2', T(W.prog), 'box hi') + arrow(322) + box(362, T(W.output), T(W.outEx), 'box'), 'input, processing, output');
    },
    water: function () {
      return svg(500, 210,
        '<rect x="20" y="16" width="90" height="110" rx="6" class="box"/>' +
        '<rect x="24" y="46" width="82" height="76" rx="3" style="fill:#5aa9e6"/>' +
        '<rect x="110" y="98" width="130" height="24" style="fill:#5aa9e6"/>' +
        '<path d="M240 98 L270 105 H330 L360 98 V122 L330 115 H270 L240 122 Z" style="fill:#5aa9e6"/>' +
        '<rect x="360" y="98" width="60" height="24" style="fill:#5aa9e6"/>' +
        '<path d="M420 98 q22 0 22 40 v20" style="fill:none;stroke:#5aa9e6;stroke-width:22"/>' +
        '<rect x="380" y="158" width="110" height="34" rx="6" style="fill:#5aa9e6"/>' +
        '<path class="s arrow" d="M130 110 h60 m-9 -6 l9 6 l-9 6" style="stroke:#fff"/>' +
        tx(65, 144, T(W.vLabel)) + tx(176, 88, T(W.iLabel)) + tx(300, 142, T(W.rLabel)) + tx(432, 206, T(W.gLabel)), 'water analogy');
    },
    circuit: function () {
      return svg(500, 190,
        '<path class="s" d="M70 50 H190 M250 50 H330 M390 50 H440 V150 H70 V50" style="stroke-width:2.5"/>' +
        '<rect x="190" y="38" width="60" height="24" rx="6" style="fill:#e3c08a;stroke:#a67c3d;stroke-width:2"/>' +
        '<circle cx="360" cy="50" r="22" style="fill:#e5484d;stroke:#b3262b;stroke-width:2"/>' +
        '<rect x="34" y="34" width="72" height="32" rx="6" class="box hi"/>' + tx(70, 55, '3.3V', 'mono') +
        '<rect x="34" y="134" width="72" height="32" rx="6" class="box"/>' + tx(70, 155, 'GND', 'mono') +
        '<path class="s arrow" d="M130 34 h34 m-8 -6 l8 6 l-8 6 M290 34 h20 m-8 -6 l8 6 l-8 6 M300 166 h-40 m8 -6 l-8 6 l8 6"/>' +
        tx(220, 82, T(W.res)) + tx(360, 92, T(W.led)) + tx(250, 126, T(W.loop)), 'closed circuit');
    },
    da: function () {
      return svg(500, 190,
        tx(250, 18, T(W.dig)) +
        '<path d="M30 76 H90 V36 H170 V76 H230 V36 H290 V76 H370 V36 H430 V76 H470" style="fill:none;stroke:var(--c-gpio);stroke-width:3"/>' +
        tx(18, 40, '1', 'mono') + tx(18, 80, '0', 'mono') +
        tx(250, 112, T(W.ana)) +
        '<path d="M30 168 C80 100 120 100 170 150 S260 190 310 140 S400 110 470 160" style="fill:none;stroke:var(--c-adc);stroke-width:3"/>', 'digital and analog');
    },
    resistor: function () {
      return svg(300, 110,
        '<line class="leg" x1="20" y1="50" x2="280" y2="50"/>' +
        '<rect x="90" y="30" width="120" height="40" rx="14" style="fill:#e3c08a;stroke:#a67c3d;stroke-width:2"/>' +
        '<rect x="108" y="30" width="10" height="40" style="fill:#f08c2e"/><rect x="128" y="30" width="10" height="40" style="fill:#f08c2e"/>' +
        '<rect x="148" y="30" width="10" height="40" style="fill:#8b5a2b"/><rect x="184" y="30" width="10" height="40" style="fill:#d4af37"/>' +
        tx(150, 96, '330Ω: ' + T(W.bands)), 'resistor');
    },
    bits: function () {
      var vals = [0, 0, 1, 1, 1, 1, 0, 0], wts = [128, 64, 32, 16, 8, 4, 2, 1], s = '';
      vals.forEach(function (v, i) {
        var x = 30 + i * 54;
        s += '<rect x="' + x + '" y="34" width="44" height="44" rx="6" class="box' + (v ? ' hi' : '') + '"/>' +
          tx(x + 22, 64, String(v), 'big mono') + tx(x + 22, 24, String(wts[i]), 'mono');
      });
      return svg(480, 130, s + tx(240, 112, '32 + 16 + 8 + 4 = 60 = 0x3C   (' + T(W.sum) + ')'), 'bits');
    },
    firstcircuit: function () {
      return P.bbSvg({
        pico: true,
        parts: [
          { type: 'res', from: 'b20', to: 'b24' },
          { type: 'led', from: 'd24', to: 'd25' },
          { type: 'wire', from: 'a25', to: 'a18', color: '#2f3a40' }
        ],
        labels: [
          { at: 'c20', dy: -62, dx: 26, w: 46, text: 'GP15' },
          { at: 'c18', dy: -62, dx: -22, w: 40, text: 'GND' },
          { at: 'b22', dy: 40, dx: 0, w: 78, text: T(W.res330) },
          { at: 'd24', dy: -52, dx: 34, w: 74, text: T(W.long) }
        ]
      });
    },
    led: function () { return ART.led(); }
  };
  P.fig = function (name) { return FIG[name] ? FIG[name]() : ''; };
})(window.PICO);
