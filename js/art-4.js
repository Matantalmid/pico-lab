/* Drawings of the parts in data-components-6.js (74HC595, seven-segment digit, L298N, FS90R,
   2N2222, 1N4007), and their small versions for the breadboard pictures (P.partGlyph).
   Same idea as art-2.js and art-3.js. Fills the ART table of art.js. */
(function (P) {
  'use strict';
  var A = P._art, ART = A.ART, svg = A.svg, tx = A.tx, T = P.t;
  var GOLD = '#d9b44a', DARK = 'fill:#1b1f22', METAL = 'fill:#cfd6da;stroke:#7b858c;stroke-width:2';

  function rect(x, y, w, h, style, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 3 : rx) + '" style="' + style + '"/>'; }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  function lt(x, y, s, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 9) + 'px var(--mono);fill:#e8edf0">' + P.esc(s) + '</text>'; }
  function legV(x, y1, y2) { return path('M' + x + ' ' + y1 + ' V' + y2, 'stroke:#9aa3a8;stroke-width:3;stroke-linecap:round'); }

  /* a DIP-16 chip seen from above, legs 1-8 along the bottom, 16-9 along the top */
  ART.hc595 = function () {
    var s = rect(40, 50, 240, 60, DARK, 4) + path('M40 72 a8 8 0 0 1 0 16', 'fill:#596168') + lt(160, 85, '74HC595', 12);
    var bottom = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND'], top = ['VCC', 'Q0', 'DS', 'OE', 'STCP', 'SHCP', 'MR', 'Q7S'];
    for (var i = 0; i < 8; i++) {
      var x = 58 + i * 29;
      s += legV(x, 110, 126) + tx(x, 140, bottom[i], 'mono') + legV(x, 34, 50) + tx(x, 26, top[i], 'mono');
    }
    return svg(320, 170, s + tx(160, 162, T({ he: 'החריץ משמאל מסמן את רגל 1 (Q1, למטה משמאל)', en: 'The notch on the left marks leg 1 (Q1, bottom left)' })), '74HC595');
  };

  /* a seven-segment digit with its segments named */
  ART.sevenseg = function () {
    var on = 'fill:#ff5a4f', seg = function (d) { return path(d, on); };
    var s = rect(60, 14, 100, 140, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:2', 6) +
      seg('M84 30 h46 l-5 7 h-36 z') +                 /* a */
      seg('M133 33 l5 6 v36 l-5 5 l-5 -5 v-36 z') +     /* b */
      seg('M133 88 l5 5 v36 l-5 6 l-5 -6 v-36 z') +     /* c */
      seg('M84 140 h46 l-5 -7 h-36 z') +                /* d */
      seg('M81 88 l5 5 v36 l-5 6 l-5 -6 v-36 z') +      /* e */
      seg('M81 33 l5 6 v36 l-5 5 l-5 -5 v-36 z') +      /* f */
      seg('M86 84 h42 l5 -4 l-5 -4 h-42 l-5 4 z') +     /* g */
      circ(148, 140, 4, on);
    var labels = [['a', 107, 26], ['b', 148, 58], ['c', 148, 112], ['d', 107, 156], ['e', 66, 112], ['f', 66, 58], ['g', 107, 74], ['dp', 148, 128]];
    labels.forEach(function (l) { s += '<text x="' + l[1] + '" y="' + l[2] + '" text-anchor="middle" style="font:700 10px var(--mono);fill:#23282c">' + l[0] + '</text>'; });
    return svg(220, 176, s + tx(110, 172, T({ he: 'כל מקטע הוא לד, ולכל אחד נגד משלו', en: 'Each segment is an LED, each with its own resistor' })), 'Seven-segment digit');
  };

  /* the L298N module: heat sink, screw terminals, the control header */
  ART.l298n = function () {
    var s = rect(20, 10, 220, 150, 'fill:#b8302a;stroke:rgba(0,0,0,.35);stroke-width:1.5', 6);
    for (var i = 0; i < 7; i++) s += rect(88 + i * 12, 20, 8, 60, 'fill:#16191c', 1);
    s += rect(84, 74, 92, 14, 'fill:#23282c', 2) + lt(130, 84, 'L298N', 8);
    var term = function (x, y, n) {
      var t = rect(x, y, n * 20 + 4, 26, 'fill:#2f7fe0;stroke:rgba(0,0,0,.4);stroke-width:1.5', 3);
      for (var k = 0; k < n; k++) t += circ(x + 12 + k * 20, y + 13, 6, METAL);
      return t;
    };
    s += term(24, 28, 2) + lt(46, 66, 'OUT1 2', 7) + term(192, 28, 2) + lt(214, 66, 'OUT3 4', 7) + term(28, 118, 3) + lt(60, 112, '12V GND 5V', 7);
    var pins = ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB'];
    s += rect(110, 126, 120, 12, 'fill:#0c0e10', 2);
    pins.forEach(function (p, k) {
      var x = 120 + k * 20;
      s += rect(x - 4, 128, 8, 8, 'fill:' + GOLD, 1) + path('M' + x + ' 160 V176', 'stroke:' + GOLD + ';stroke-width:3.5;stroke-linecap:round') + tx(x, 190, p, 'mono');
    });
    return svg(260, 200, s, 'L298N');
  };

  /* the FS90R looks like the SG90: reuse its drawing with another label */
  ART.fs90r = function () {
    var base = ART.servo ? ART.servo() : '';
    return base.replace('>SG90<', '>FS90R<').replace('aria-label="SG90 servo"', 'aria-label="FS90R servo"');
  };

  /* a TO-92 transistor, flat side facing the reader */
  ART.npn = function () {
    var s = legV(82, 78, 118) + legV(100, 78, 118) + legV(118, 78, 118) +
      path('M66 30 H134 V80 H66 Z', 'fill:#1b1f22') + path('M66 30 a34 12 0 0 1 68 0', 'fill:#2a3136') +
      lt(100, 52, 'PN2222', 9) + lt(100, 66, 'A', 8) +
      tx(82, 134, 'E', 'mono') + tx(100, 134, 'B', 'mono') + tx(118, 134, 'C', 'mono');
    return svg(200, 160, s + tx(100, 152, T({ he: 'הצד השטוח פונה אליכם', en: 'flat side facing you' })), '2N2222 transistor');
  };

  /* an axial diode with its cathode band */
  ART.diode = function () {
    var s = path('M20 60 H70 M150 60 H200', 'stroke:#9aa3a8;stroke-width:3;stroke-linecap:round') +
      rect(70, 46, 80, 28, 'fill:#1b1f22', 6) + rect(130, 46, 10, 28, 'fill:#cfd6da', 0) + lt(102, 64, '1N4007', 8) +
      tx(34, 96, T({ he: 'אנודה', en: 'anode' })) + tx(180, 96, T({ he: 'קתודה (הפס)', en: 'cathode (band)' })) +
      path('M92 30 H126 M118 24 L126 30 L118 36', 'stroke:var(--muted);stroke-width:2;fill:none') + tx(108, 20, T({ he: 'כיוון הזרם', en: 'current flow' }));
    return svg(220, 110, s, '1N4007 diode');
  };

  /* small versions for the breadboard pictures */
  if (P.partGlyph) {
    P.partGlyph.l298n = function (cx, cy) {
      var s = rect(cx - 26, cy - 20, 52, 40, 'fill:#b8302a;stroke:rgba(0,0,0,.4);stroke-width:1', 3);
      for (var i = 0; i < 5; i++) s += rect(cx - 13 + i * 6, cy - 16, 3.5, 20, 'fill:#16191c', 0.5);
      return s + rect(cx - 23, cy - 12, 8, 8, 'fill:#2f7fe0', 1) + rect(cx + 15, cy - 12, 8, 8, 'fill:#2f7fe0', 1) +
        rect(cx - 15, cy + 6, 30, 10, 'fill:#23282c', 1.5) + '<text x="' + cx + '" y="' + (cy + 13.5) + '" text-anchor="middle" style="font:700 7px var(--mono);fill:#e8edf0">L298N</text>';
    };
    /* the FS90R looks like the SG90, with its own name on the label */
    var servoGlyph = P.partGlyph.servo;
    if (servoGlyph) P.partGlyph.fs90r = function (cx, cy, w) { return servoGlyph(cx, cy, w).replace('>SG90<', '>FS90R<'); };
  }
})(window.PICO);
