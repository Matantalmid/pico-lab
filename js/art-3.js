/* Drawings of the parts in data-components-5.js. Same idea as art-2.js:
   a board in its usual colour, what sits on it, and the pins in order.
   Fills the ART table of art.js. */
(function (P) {
  'use strict';
  var A = P._art, ART = A.ART, svg = A.svg, tx = A.tx;

  var BLUE = '#1d5aa6', BLACK = '#16191c', PURPLE = '#5c2a86', GREEN = '#1f7a4d', RED = '#b8302a', GOLD = '#d9b44a';
  var METAL = 'fill:#cfd6da;stroke:#7b858c;stroke-width:2';

  function rect(x, y, w, h, style, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 3 : rx) + '" style="' + style + '"/>';
  }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  function lt(x, y, s, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 9) + 'px var(--mono);fill:#e8edf0">' + P.esc(s) + '</text>'; }
  function dk(x, y, s, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 9) + 'px var(--mono);fill:#23282c">' + P.esc(s) + '</text>'; }
  function smd(x, y, c) { return rect(x, y, 9, 5, 'fill:' + (c || '#c8b08a'), 1); }
  function chip(x, y, w, h, label) {
    var s = rect(x, y, w, h, 'fill:#23282c;stroke:#596168;stroke-width:1', 2);
    for (var i = 0; i < Math.floor(w / 6); i++) s += rect(x + 3 + i * 6, y - 3, 3, 3, 'fill:#aab2b8', 0) + rect(x + 3 + i * 6, y + h, 3, 3, 'fill:#aab2b8', 0);
    return s + (label ? lt(x + w / 2, y + h / 2 + 3, label, 8) : '');
  }
  /* a screw terminal block with n screws */
  function term(x, y, n, color) {
    var s = rect(x, y, n * 20 + 4, 26, 'fill:' + (color || '#2f7fe0') + ';stroke:rgba(0,0,0,.4);stroke-width:1.5', 3);
    for (var i = 0; i < n; i++) s += circ(x + 12 + i * 20, y + 13, 6, METAL) + path('M' + (x + 8 + i * 20) + ' ' + (y + 13) + ' h8', 'stroke:#596168;stroke-width:1.5');
    return s;
  }

  /* A module: a board with a pin header along the bottom edge. */
  function M(o) {
    var pitch = o.pitch || 30, n = o.pins.length;
    var w = Math.max(o.w, (n - 1) * pitch + 36), h = o.h, x0 = 16, y0 = 10;
    var s = rect(x0, y0, w, h, 'fill:' + (o.color || BLUE) + ';stroke:rgba(0,0,0,.35);stroke-width:1.5', 6) + o.body(x0, y0, w, h);
    var px = x0 + (w - (n - 1) * pitch) / 2, hy = y0 + h - 16;
    s += rect(px - 9, hy, (n - 1) * pitch + 18, 12, 'fill:#0c0e10', 2);
    o.pins.forEach(function (p, i) {
      var x = px + i * pitch;
      s += rect(x - 4, hy + 2, 8, 8, 'fill:' + GOLD, 1) +
        path('M' + x + ' ' + (y0 + h) + ' V' + (y0 + h + 20), 'stroke:' + GOLD + ';stroke-width:3.5;stroke-linecap:round') + tx(x, y0 + h + 35, p, 'mono');
    });
    return svg(w + 32, h + 62, s, o.label);
  }

  if (P.pcbColor) {
    P.pcbColor.mosfet = RED; P.pcbColor.pcf8574 = BLUE; P.pcbColor.ads1115 = BLUE; P.pcbColor.ina219 = PURPLE;
    P.pcbColor.aht20 = BLACK; P.pcbColor.hx711 = GREEN; P.pcbColor.pca9685 = BLUE; P.pcbColor.max6675 = BLUE;
  }

  ART.mosfet = function () {
    return M({
      w: 190, h: 100, color: RED, pins: ['SIG', 'VCC', 'GND'], label: 'MOSFET module',
      body: function (x, y, w) {
        return term(x + 10, y + 8, 2) + term(x + w - 54, y + 8, 2) +
          rect(x + 78, y + 14, 34, 30, METAL, 2) + rect(x + 81, y + 30, 28, 26, 'fill:#23282c', 2) +
          lt(x + 32, y + 48, 'VIN GND', 7) + lt(x + w - 32, y + 48, 'V+  V-', 7) +
          smd(x + 60, y + 62) + smd(x + 122, y + 62) + circ(x + 144, y + 64, 3.5, 'fill:#ff6b6b');
      }
    });
  };
  ART.pcf8574 = function () {
    return M({
      w: 210, h: 96, pins: ['VCC', 'GND', 'SDA', 'SCL'], label: 'PCF8574 pin expander',
      body: function (x, y, w) {
        var s = chip(x + 70, y + 34, 60, 22, 'PCF8574');
        for (var i = 0; i < 8; i++) s += rect(x + 22 + i * 22, y + 6, 8, 8, 'fill:' + GOLD, 1) + lt(x + 26 + i * 22, y + 26, 'P' + i, 7);
        for (var k = 0; k < 3; k++) s += rect(x + w - 50 + k * 13, y + 40, 9, 18, 'fill:#e9c46a;stroke:#8a6d1c;stroke-width:1', 1);
        return s + lt(x + w - 33, y + 68, 'A0 A1 A2', 6);
      }
    });
  };
  ART.ads1115 = function () {
    return M({
      w: 280, h: 86, pitch: 26, pins: ['VDD', 'GND', 'SCL', 'SDA', 'ADDR', 'ALRT', 'A0', 'A1', 'A2', 'A3'], label: 'ADS1115 converter',
      body: function (x, y, w) {
        return chip(x + w / 2 - 20, y + 20, 40, 24, 'ADS') + smd(x + 40, y + 24) + smd(x + 40, y + 36) + smd(x + w - 60, y + 24) + smd(x + w - 60, y + 36) +
          lt(x + w / 2, y + 60, '16 bit ADC', 8);
      }
    });
  };
  ART.ina219 = function () {
    return M({
      w: 190, h: 104, color: PURPLE, pins: ['VCC', 'GND', 'SCL', 'SDA'], label: 'INA219 current meter',
      body: function (x, y, w) {
        return term(x + w / 2 - 22, y + 6, 2) + lt(x + w / 2, y + 44, 'Vin+ Vin-', 7) +
          rect(x + 22, y + 52, 46, 20, 'fill:#16191c;stroke:#596168;stroke-width:1', 2) + lt(x + 45, y + 66, 'R100', 9) +
          chip(x + w - 70, y + 54, 34, 16, 'INA');
      }
    });
  };
  ART.aht20 = function () {
    return M({
      w: 150, h: 86, color: BLACK, pins: ['VIN', 'GND', 'SCL', 'SDA'], label: 'AHT20 sensor',
      body: function (x, y, w) {
        return rect(x + w / 2 - 17, y + 16, 34, 34, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:2', 3) +
          rect(x + w / 2 - 9, y + 30, 18, 5, 'fill:#23282c', 2) + dk(x + w / 2, y + 26, 'AHT20', 7) + smd(x + 22, y + 28) + smd(x + w - 31, y + 28);
      }
    });
  };
  ART.hx711 = function () {
    return M({
      w: 210, h: 92, color: GREEN, pins: ['GND', 'DT', 'SCK', 'VCC'], label: 'HX711 with a load cell',
      body: function (x, y, w) {
        var s = chip(x + w / 2 - 28, y + 28, 56, 22, 'HX711');
        ['#e5484d', '#16191c', '#f4f4f4', '#3fb950'].forEach(function (c, i) {
          s += rect(x + 30 + i * 22, y + 4, 8, 8, 'fill:' + GOLD, 1) + path('M' + (x + 34 + i * 22) + ' ' + (y + 4) + ' v-10', 'stroke:' + c + ';stroke-width:3;stroke-linecap:round');
        });
        return s + lt(x + 64, y + 22, 'E+ E- A- A+', 6) + smd(x + w - 48, y + 14) + smd(x + w - 48, y + 26);
      }
    });
  };
  ART.pca9685 = function () {
    return M({
      w: 290, h: 110, pitch: 28, pins: ['GND', 'OE', 'SCL', 'SDA', 'VCC', 'V+'], label: 'PCA9685 servo controller',
      body: function (x, y, w) {
        var s = term(x + w / 2 - 22, y + 46, 2) + chip(x + w - 84, y + 50, 52, 20, 'PCA9685');
        for (var i = 0; i < 16; i++) {
          var cx = x + 20 + i * 16.5;
          s += rect(cx - 4, y + 6, 8, 7, 'fill:#e9c46a', 1) + rect(cx - 4, y + 15, 8, 7, 'fill:#e5484d', 1) + rect(cx - 4, y + 24, 8, 7, 'fill:#16191c;stroke:#596168;stroke-width:.6', 1);
        }
        return s + lt(x + 20, y + 42, '0', 7) + lt(x + 20 + 15 * 16.5, y + 42, '15', 7);
      }
    });
  };
  ART.max6675 = function () {
    return M({
      w: 200, h: 96, pins: ['GND', 'VCC', 'SCK', 'CS', 'SO'], label: 'MAX6675 thermocouple module',
      body: function (x, y, w) {
        return term(x + 12, y + 10, 2) + lt(x + 34, y + 50, '+   -', 8) +
          path('M' + (x + 22) + ' ' + (y + 10) + ' C' + (x + 10) + ' ' + (y - 14) + ' ' + (x + 90) + ' ' + (y - 2) + ' ' + (x + 120) + ' ' + (y + 2), 'fill:none;stroke:#9aa3a8;stroke-width:4;stroke-linecap:round;stroke-dasharray:3 2') +
          chip(x + w - 86, y + 22, 50, 22, 'MAX6675') + smd(x + w - 28, y + 22) + smd(x + w - 28, y + 34);
      }
    });
  };
})(window.PICO);
