/* Drawings of the parts in data-components-7.js (NTC, 74HC165 with a DIP switch, LED bar, LCD 20x4,
   ILI9341, A4988 with a stepper, BMP180), and the small versions the breadboard pictures need
   (P.partGlyph) for the parts that sit on a module or off the board. Same idea as art-4.js. */
(function (P) {
  'use strict';
  var A = P._art, ART = A.ART, svg = A.svg, tx = A.tx, T = P.t;
  var GOLD = '#d9b44a', DARK = 'fill:#1b1f22', METAL = 'fill:#cfd6da;stroke:#7b858c;stroke-width:2';

  function rect(x, y, w, h, style, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 3 : rx) + '" style="' + style + '"/>'; }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  function lt(x, y, s, size, fill) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 9) + 'px var(--mono);fill:' + (fill || '#e8edf0') + '">' + P.esc(s) + '</text>'; }
  function pcb(x, y, w, h, color) { return rect(x, y, w, h, 'fill:' + color + ';stroke:rgba(0,0,0,.35);stroke-width:1.5', 6); }
  function header(x0, y, names, gap) {
    var s = '';
    names.forEach(function (n, k) {
      var x = x0 + k * (gap || 26);
      s += rect(x - 5, y, 10, 10, 'fill:' + GOLD, 1.5) + path('M' + x + ' ' + (y + 10) + ' V' + (y + 26), 'stroke:' + GOLD + ';stroke-width:3.5;stroke-linecap:round') + tx(x, y + 40, n, 'mono');
    });
    return s;
  }
  function legsDip(x0, n, gap, yTop, yBot) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var x = x0 + i * gap;
      s += path('M' + x + ' ' + yTop + ' v-14 M' + x + ' ' + yBot + ' v14', 'stroke:#9aa3a8;stroke-width:3;stroke-linecap:round');
    }
    return s;
  }

  /* the NTC module: a small board, the black bead on two legs, three pins */
  ART.ntc = function () {
    var s = pcb(60, 20, 140, 70, '#2463c9') + rect(80, 34, 26, 20, 'fill:#f4f4f4', 2) + lt(93, 48, '103', 8, '#23282c') +
      path('M150 55 V36 M160 55 V36', 'stroke:#9aa3a8;stroke-width:2') + circ(155, 30, 8, 'fill:#1b1f22') +
      header(104, 90, ['GND', 'VCC', 'OUT']);
    return svg(260, 150, s + tx(130, 146, T({ he: 'הטיפה השחורה היא התרמיסטור', en: 'The black bead is the thermistor' })), 'NTC module');
  };

  /* the 74HC165 and an 8-way DIP switch */
  ART.hc165 = function () {
    var s = rect(30, 60, 200, 50, DARK, 4) + path('M30 77 a8 8 0 0 1 0 16', 'fill:#596168') + lt(130, 90, '74HC165', 12) + legsDip(45, 8, 24.5, 60, 110) +
      rect(260, 40, 200, 90, 'fill:#c8322f;stroke:rgba(0,0,0,.4);stroke-width:1.5', 4) + lt(276, 56, 'ON', 9, '#fff');
    var on = [1, 0, 1, 0, 0, 0, 0, 1];
    for (var i = 0; i < 8; i++) {
      var x = 272 + i * 24;
      s += rect(x, 62, 14, 50, 'fill:#f4f4f4', 2) + rect(x + 2, on[i] ? 64 : 88, 10, 22, 'fill:#596168', 1.5) + lt(x + 7, 126, String(i + 1), 9, '#fff');
    }
    s += legsDip(279, 8, 24, 40, 130);
    return svg(490, 175, s + tx(130, 140, T({ he: 'שבב הקלט', en: 'The input chip' })) + tx(360, 165, T({ he: 'מתגים 1, 3 ו-8 ב-ON', en: 'Switches 1, 3 and 8 ON' })), '74HC165 and DIP switch');
  };

  /* a 10-segment LED bar, some segments lit */
  ART.ledbar = function () {
    var s = rect(50, 40, 260, 70, 'fill:#2b3034;stroke:#0c0e10;stroke-width:1.5', 4);
    for (var i = 0; i < 10; i++) {
      var x = 62 + i * 24.5;
      s += rect(x, 52, 16, 46, 'fill:' + (i < 6 ? '#3fb950' : '#1d3a26'), 2);
    }
    s += legsDip(70, 10, 24.5, 40, 110);
    return svg(360, 165, s + tx(180, 140, T({ he: 'למטה: האנודות A1 עד A10', en: 'Bottom: the anodes A1 to A10' })) + tx(180, 22, T({ he: 'למעלה: הקתודות', en: 'Top: the cathodes' })), 'LED bar');
  };

  /* the 20x4 LCD, with text on all four rows */
  ART.lcd2004 = function () {
    var s = pcb(14, 10, 332, 130, '#1f7a4d') + rect(30, 24, 300, 96, 'fill:#0e2a4f;stroke:#071a33;stroke-width:2', 3) + rect(38, 32, 284, 80, 'fill:#2d6fd6', 2);
    ['Pico 2 Lab', 'A 20x4 display', 'Uptime: 42 s', 'Row 4 is down here'].forEach(function (t, k) {
      s += '<text x="46" y="' + (50 + k * 18) + '" style="font:700 13px var(--mono);fill:#e8f1ff">' + P.esc(t) + '</text>';
    });
    s += header(141, 150, ['GND', 'VCC', 'SDA', 'SCL']);
    return svg(360, 200, s, 'LCD 20x4');
  };

  /* the ILI9341: a colour screen on a red board, a row of nine pins */
  ART.ili9341 = function () {
    var s = pcb(20, 10, 300, 210, '#b8302a') + rect(40, 24, 240, 170, 'fill:#000a2e;stroke:#0c0e10;stroke-width:2', 2) +
      lt(160, 60, 'Pico 2 Lab', 22, '#ffe34d') + rect(60, 90, 200, 18, 'fill:#ff3b30', 1) + rect(60, 118, 140, 18, 'fill:#34c759', 1) + rect(60, 146, 80, 18, 'fill:#0a84ff', 1) +
      header(54, 230, ['VCC', 'GND', 'CS', 'RST', 'DC', 'MOSI', 'SCK', 'LED', 'MISO'], 29);
    return svg(340, 285, s, 'ILI9341 colour display');
  };

  /* the A4988 board and a NEMA 17 stepper */
  ART.a4988 = function () {
    var s = pcb(30, 40, 120, 90, '#4b2d83') + rect(70, 70, 34, 34, DARK, 2) + lt(87, 91, 'A4988', 7) + circ(128, 64, 9, 'fill:' + GOLD + ';stroke:#8a6d1d;stroke-width:1.5') +
      legsDip(42, 8, 13.5, 40, 130);
    s += rect(200, 30, 110, 110, METAL, 8) + circ(255, 85, 26, 'fill:#9aa3a8;stroke:#6b747a;stroke-width:2') + circ(255, 85, 6, 'fill:#e8edf0;stroke:#6b747a') +
      path('M200 115 C180 120 170 112 152 112 M200 120 C182 128 168 120 152 118 M200 125 C184 136 166 128 152 124 M200 130 C186 142 164 134 152 130', 'fill:none;stroke-width:3;stroke:#e5484d') +
      lt(255, 150, 'NEMA 17', 9, 'var(--muted)');
    return svg(340, 190, s + tx(90, 165, T({ he: 'הפוטנציומטר מגביל את הזרם', en: 'The trimmer limits the current' })), 'A4988 and stepper');
  };

  /* the BMP180 module (GY-68) */
  ART.bmp180 = function () {
    var s = pcb(60, 20, 150, 74, '#6b2fa3') + rect(118, 34, 30, 26, METAL, 3) + circ(133, 47, 2.5, 'fill:#3a4247') + lt(135, 82, 'GY-68', 9) +
      header(96, 94, ['VIN', 'GND', 'SCL', 'SDA']);
    return svg(270, 158, s + tx(135, 154, T({ he: 'החור הקטן מכניס אוויר לחיישן', en: 'The small hole lets air into the sensor' })), 'BMP180 module');
  };

  /* small versions for the breadboard pictures */
  var G = P.partGlyph || (P.partGlyph = {});
  G.ntc = function (cx, cy) {
    return rect(cx - 10, cy - 12, 14, 10, 'fill:#f4f4f4', 1) + path('M' + (cx + 10) + ' ' + cy + ' v-8 M' + (cx + 15) + ' ' + cy + ' v-8', 'stroke:#9aa3a8;stroke-width:1.2') + circ(cx + 12.5, cy - 11, 4.5, 'fill:#1b1f22');
  };
  G.bmp180 = function (cx, cy) {
    return rect(cx - 9, cy - 11, 18, 16, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 2) + circ(cx, cy - 3, 1.6, 'fill:#3a4247') + lt(cx, cy + 16, 'GY-68', 6);
  };
  G.lcd2004 = function (cx, cy, w) {
    var ww = Math.min(w - 16, 110);
    return rect(cx - ww / 2, cy - 18, ww, 34, 'fill:#2d6fd6;stroke:#0e2a4f;stroke-width:2', 2) +
      '<text x="' + (cx - ww / 2 + 4) + '" y="' + (cy - 8) + '" style="font:700 6px var(--mono);fill:#e8f1ff">Pico 2 Lab</text>' +
      '<text x="' + (cx - ww / 2 + 4) + '" y="' + (cy) + '" style="font:700 6px var(--mono);fill:#e8f1ff">20x4</text>';
  };
  G.ili9341 = function (cx, cy, w) {
    var ww = Math.min(w - 16, 120);
    return rect(cx - ww / 2, cy - 22, ww, 40, 'fill:#000a2e;stroke:#0c0e10;stroke-width:1.5', 2) + lt(cx, cy - 10, 'Pico 2 Lab', 7, '#ffe34d') +
      rect(cx - ww / 2 + 8, cy - 4, ww - 30, 4, 'fill:#ff3b30', 0.5) + rect(cx - ww / 2 + 8, cy + 3, ww - 50, 4, 'fill:#34c759', 0.5) + rect(cx - ww / 2 + 8, cy + 10, ww - 70, 4, 'fill:#0a84ff', 0.5);
  };
  P.pcbColor = P.pcbColor || {};
  P.pcbColor.ntc = '#2463c9'; P.pcbColor.bmp180 = '#6b2fa3'; P.pcbColor.lcd2004 = '#1f7a4d'; P.pcbColor.ili9341 = '#b8302a';
})(window.PICO);
