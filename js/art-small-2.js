/* Small drawings, part 2: the parts of data-components-5.js, following their
   large drawings in art-3.js, and the outside boxes of the breadboard
   pictures (batteries, a supply, a load, a motor, a load cell, a probe).
   Same contract as art-small.js: each one draws around (cx, cy), about 44
   high, on a board w wide. A part can sit on a narrow board (a module with
   four pins) or a wide one (with its screw terminals as extra pins), so the
   wide extras are drawn only when there is room. */
(function (P) {
  'use strict';
  var G = P.partGlyph || (P.partGlyph = {});
  var GOLD = '#d9b44a', SM = 'stroke-width:1.2';
  var METAL = 'fill:#cfd6da;stroke:#7b858c;' + SM;

  function rect(x, y, w, h, style, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 2 : rx) + '" style="' + style + '"/>';
  }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  function st(x, y, s, fill, size) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 7) + 'px var(--mono);fill:' + (fill || '#fff') + '">' + P.esc(s) + '</text>';
  }
  function chip(x, y, w, h, label) {
    return rect(x, y, w, h, 'fill:#23282c;stroke:#596168;stroke-width:1', 1.5) + (label ? st(x + w / 2, y + h / 2 + 2.3, label, '#cfd6da', 6) : '');
  }
  function smd(x, y) { return rect(x, y, 7, 4, 'fill:#c8b08a', 1); }
  function led(x, y, c) { return circ(x, y, 2.4, 'fill:' + (c || '#ff6b6b')); }
  /* a screw terminal block with n screws, 12 wide each */
  function term(x, y, n) {
    var s = rect(x, y, n * 12 + 4, 16, 'fill:#2f7fe0;stroke:#174a9c;stroke-width:1', 2);
    for (var i = 0; i < n; i++) s += circ(x + 8 + i * 12, y + 8, 3.8, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1') + path('M' + (x + 5.5 + i * 12) + ' ' + (y + 8) + ' h5', 'stroke:#596168;stroke-width:1');
    return s;
  }

  /* ---------------- the parts of catalog part 5 ---------------- */
  G.mosfet = function (cx, cy, w) {
    var s = rect(cx - 10, cy - 21, 20, 13, METAL, 1.5) + circ(cx, cy - 15, 2.6, 'fill:#8d969c') + rect(cx - 8, cy - 9, 16, 17, 'fill:#23282c;stroke:#596168;stroke-width:1', 1.5) +
      smd(cx - 22, cy + 10) + led(cx + 20, cy + 12);
    if (w >= 150) s += term(cx - w / 2 + 10, cy - 18, 2) + term(cx + w / 2 - 38, cy - 18, 2);
    return s;
  };
  G.pcf8574 = function (cx, cy, w) {
    var s = chip(cx - 22, cy - 6, 44, 14, 'PCF8574');
    if (w >= 120) {
      for (var i = 0; i < 8; i++) s += rect(cx - 36 + i * 9, cy - 21, 5, 5, 'fill:' + GOLD, 1);
      for (var k = 0; k < 3; k++) s += rect(cx + w / 2 - 34 + k * 8, cy - 8, 5, 12, 'fill:#e9c46a;stroke:#8a6d1c;stroke-width:.8', 1);
    } else {
      for (var j = 0; j < 3; j++) s += rect(cx - 11 + j * 8, cy - 21, 5, 10, 'fill:#e9c46a;stroke:#8a6d1c;stroke-width:.8', 1);
    }
    return s;
  };
  G.ads1115 = function (cx, cy) {
    return chip(cx - 12, cy - 19, 24, 15, 'ADS') + st(cx, cy + 9, '16 bit ADC', '#e8edf0', 6) + smd(cx - 32, cy - 17) + smd(cx - 32, cy - 9) + smd(cx + 25, cy - 17) + smd(cx + 25, cy - 9);
  };
  G.ina219 = function (cx, cy) {
    return term(cx - 14, cy - 23, 2) + rect(cx - 36, cy - 1, 28, 13, 'fill:#16191c;stroke:#596168;stroke-width:1', 1.5) + st(cx - 22, cy + 8.5, 'R100', '#e8edf0', 7) +
      chip(cx + 8, cy, 22, 11, 'INA');
  };
  G.aht20 = function (cx, cy) {
    return rect(cx - 11, cy - 21, 22, 22, 'fill:#f4f4f4;stroke:#b9c0c5;' + SM, 2) + rect(cx - 6, cy - 9, 12, 3.5, 'fill:#23282c', 1.5) +
      st(cx, cy - 12, 'AHT20', '#23282c', 5.5) + smd(cx - 27, cy - 12) + smd(cx + 20, cy - 12);
  };
  G.hx711 = function (cx, cy, w) {
    var s = chip(cx - 20, cy - 8, 40, 14, 'HX711') + smd(cx + 28, cy - 6) + smd(cx + 28, cy + 2);
    if (w >= 150) {
      ['#e5484d', '#16191c', '#f4f4f4', '#3fb950'].forEach(function (c, i) {
        var x = cx - w / 2 + 16 + i * 10;
        s += rect(x - 2.5, cy - 20, 5, 5, 'fill:' + GOLD, 1) + path('M' + x + ' ' + (cy - 20) + ' v-6', 'stroke:' + c + ';stroke-width:2.2;stroke-linecap:round');
      });
    }
    return s;
  };
  G.pca9685 = function (cx, cy, w) {
    var n = Math.max(6, Math.min(16, Math.floor((w - 20) / 9))), s = '', x0 = cx - (n - 1) * 4.5;
    for (var i = 0; i < n; i++) {
      s += rect(x0 + i * 9 - 3, cy - 23, 6, 4.5, 'fill:#e9c46a', 1) + rect(x0 + i * 9 - 3, cy - 17.5, 6, 4.5, 'fill:#e5484d', 1) +
        rect(x0 + i * 9 - 3, cy - 12, 6, 4.5, 'fill:#16191c;stroke:#596168;stroke-width:.5', 1);
    }
    return s + term(cx - 44, cy, 2) + chip(cx - 6, cy + 1, 48, 13, 'PCA9685');
  };
  G.max6675 = function (cx, cy, w) {
    var wide = w >= 150, tx = wide ? cx - w / 2 + 10 : cx - 36;
    return term(tx, cy - 14, 2) + st(tx + 14, cy + 11, '+  -', '#e8edf0', 6) + chip(wide ? cx - 6 : cx - 4, cy - 12, wide ? 48 : 36, 14, wide ? 'MAX6675' : 'MAX') +
      (wide ? smd(cx + 52, cy - 12) + smd(cx + 52, cy - 4) : '');
  };

  /* ---------------- the outside boxes ---------------- */
  function cell(x, y) {
    return rect(x, y, 46, 13, 'fill:#2b2f33;stroke:#0c0e10;stroke-width:1', 3) + rect(x, y, 13, 13, 'fill:#d9a23a', 3) + rect(x + 46, y + 4, 4, 5, METAL, 1) + st(x + 28, y + 9.5, 'AA', '#e8edf0', 6.5);
  }
  function bulb(cx, cy) {
    return rect(cx - 5, cy + 8, 10, 9, METAL, 1.5) + path('M' + (cx - 5) + ' ' + (cy + 11) + ' h10 M' + (cx - 5) + ' ' + (cy + 14) + ' h10', 'stroke:#7b858c;stroke-width:.8') +
      circ(cx, cy - 3, 12, 'fill:#ffe58a;stroke:#c9a227;' + SM) + path('M' + (cx - 4) + ' ' + (cy + 6) + ' l2 -8 l2 5 l2 -5 l2 8', 'fill:none;stroke:#c9741a;stroke-width:1.1');
  }
  function canMotor(cx, cy) {
    return rect(cx + 14, cy - 2, 16, 4, 'fill:#9aa3a8', 1) + rect(cx - 26, cy - 13, 40, 26, METAL, 5) + rect(cx - 26, cy - 13, 9, 26, 'fill:#23282c', 3) +
      path('M' + (cx - 10) + ' ' + (cy - 13) + ' v26 M' + cx + ' ' + (cy - 13) + ' v26', 'stroke:#aab2b8;stroke-width:1');
  }
  G['ext-battery'] = function (cx, cy) { return cell(cx - 25, cy - 15) + cell(cx - 25, cy + 2); };
  G['ext-supply'] = function (cx, cy) {
    return rect(cx - 28, cy - 14, 44, 28, 'fill:#23282c;stroke:#0c0e10;stroke-width:1', 3) + st(cx - 6, cy + 4, 'DC', '#e8edf0', 11) +
      path('M' + (cx + 16) + ' ' + cy + ' h9', 'stroke:#16191c;stroke-width:3.5;stroke-linecap:round') + rect(cx + 24, cy - 4, 9, 8, METAL, 2);
  };
  /* "a load" is anything: shown as a bulb and a small motor */
  G['ext-load'] = function (cx, cy) {
    var mx = cx + 16;
    return bulb(cx - 20, cy - 2) + rect(mx + 10, cy - 1.5, 10, 3, 'fill:#9aa3a8', 1) + rect(mx - 14, cy - 9, 24, 18, METAL, 4) + rect(mx - 14, cy - 9, 6, 18, 'fill:#23282c', 2);
  };
  G['ext-bulb'] = function (cx, cy) { return bulb(cx, cy - 2); };
  G['ext-motor'] = function (cx, cy) { return canMotor(cx - 2, cy); };
  G['ext-stepmotor'] = function (cx, cy) {
    return rect(cx - 30, cy - 4, 60, 8, METAL, 4) + circ(cx, cy, 20, METAL) + circ(cx, cy - 8, 5, 'fill:#e9eef2;stroke:#7b858c;stroke-width:1') + rect(cx - 1.5, cy - 11, 3, 6, 'fill:' + GOLD, 0.5);
  };
  G['ext-strip'] = function (cx, cy, w) {
    var n = Math.max(3, Math.floor((w - 16) / 18)), s = rect(cx - w / 2 + 7, cy - 7, w - 14, 14, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1', 2);
    for (var i = 0; i < n; i++) s += rect(cx - (n - 1) * 9 + i * 18 - 4, cy - 4, 8, 8, 'fill:#ffe58a;stroke:#c9a227;stroke-width:.8', 1.5);
    return s;
  };
  G['ext-cell'] = function (cx, cy, w) {
    var half = w / 2 - 10;
    return rect(cx - half, cy - 9, half * 2, 18, METAL, 2) + rect(cx - 14, cy - 5, 28, 10, 'fill:#8d969c', 5) +
      circ(cx - half + 8, cy, 2.6, 'fill:#596168') + circ(cx + half - 8, cy, 2.6, 'fill:#596168') +
      path('M' + (cx + half - 20) + ' ' + (cy - 15) + ' v5 m-3 -3 l3 3 l3 -3', 'fill:none;stroke:#e8edf0;stroke-width:1.3');
  };
  G['ext-probe'] = function (cx, cy) {
    return path('M' + (cx - 30) + ' ' + (cy - 8) + ' C' + (cx - 10) + ' ' + (cy - 22) + ' ' + (cx - 8) + ' ' + (cy + 20) + ' ' + (cx + 8) + ' ' + (cy + 6), 'fill:none;stroke:#9aa3a8;stroke-width:4;stroke-linecap:round;stroke-dasharray:3 2') +
      rect(cx + 6, cy + 2, 26, 7, METAL, 3.5);
  };
})(window.PICO);
