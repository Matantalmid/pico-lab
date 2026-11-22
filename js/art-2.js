/* The drawing of every catalog part. Each one was drawn after looking at
   photos of the common version of the real part: the board colour, the
   shape of what sits on it, and the order of the pins.
   Uses the small helpers of art.js and fills its ART table. */
(function (P) {
  'use strict';
  var A = P._art, ART = A.ART, svg = A.svg, tx = A.tx, leg = A.leg, T = P.t;

  /* board colours as sold */
  var BLUE = '#1d5aa6', RED = '#b8302a', BLACK = '#16191c', PURPLE = '#5c2a86', GREEN = '#1f7a4d';
  var METAL = 'fill:#cfd6da;stroke:#7b858c;stroke-width:2', DARK = 'fill:#1b1f22', WHITE = 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:2',
    GOLD = '#d9b44a', POT = 'fill:#2f7fd1;stroke:#1d5c9e;stroke-width:2';

  /* the board colour of each part, also used by the breadboard pictures */
  P.pcbColor = {
    hcsr04: BLUE, pir: GREEN, dht22: BLACK, oled: BLUE, bh1750: BLUE, mpu6050: BLUE, neopixel: BLACK, sdcard: BLUE, gps: BLUE,
    relay: BLUE, motor: BLACK, stepper: GREEN, joystick: BLACK, encoder: BLACK, touch: RED, irrecv: BLACK, bme280: PURPLE, soil: BLACK,
    sound: RED, mq2: BLUE, tilt: BLACK, hall: BLACK, lcd1602: GREEN, tm1637: BLUE, max7219: BLUE, ds3231: BLUE, rc522: BLUE, hc05: BLUE, nrf24: BLACK
  };

  function rect(x, y, w, h, style, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 3 : rx) + '" style="' + style + '"/>';
  }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  /* text printed on a light surface (metal, white plastic) */
  function dk(x, y, s, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 9) + 'px var(--mono);fill:#23282c">' + P.esc(s) + '</text>'; }
  function hole(cx, cy) { return circ(cx, cy, 5, 'fill:var(--surface-2);stroke:#c9ced3;stroke-width:2'); }
  /* small surface-mount bits that make a board look populated */
  function smd(x, y, c) { return rect(x, y, 9, 5, 'fill:' + (c || '#c8b08a'), 1); }
  function chip(x, y, w, h, label) {
    var s = rect(x, y, w, h, 'fill:#23282c;stroke:#596168;stroke-width:1', 2);
    for (var i = 0; i < Math.floor(w / 6); i++) s += rect(x + 3 + i * 6, y - 3, 3, 3, 'fill:#aab2b8', 0) + rect(x + 3 + i * 6, y + h, 3, 3, 'fill:#aab2b8', 0);
    return s + (label ? tx(x + w / 2, y + h / 2 + 3, label, 'onbody') : '');
  }
  /* the blue adjusting screw found on many sensor boards */
  function trim(x, y) { return rect(x, y, 22, 22, POT) + circ(x + 11, y + 11, 6, 'fill:#e9e6dc') + path('M' + (x + 6) + ' ' + (y + 11) + ' h10', 'stroke:#7b858c;stroke-width:2'); }
  function zigzag(x, y, n, step) {
    var d = 'M' + x + ' ' + y, st = step || 10;
    for (var i = 0; i < n; i++) d += ' v14 h' + st + ' v-14 h' + st;
    return path(d, 'fill:none;stroke:' + GOLD + ';stroke-width:2.5');
  }

  /* A module: a board with a pin header along one edge.
     o: w, h, pins, pitch, color, holes [[x, y]...] (inside the board), top (pins on the top edge),
        extraW (free room to the right of the board), body(x, y, w, h), label */
  function M(o) {
    var pitch = o.pitch || 30, n = o.pins.length;
    var w = Math.max(o.w, (n - 1) * pitch + 36), h = o.h, x0 = 16, y0 = o.top ? 46 : 10;
    var s = rect(x0, y0, w, h, 'fill:' + (o.color || BLUE) + ';stroke:rgba(0,0,0,.35);stroke-width:1.5', 6);
    (o.holes || []).forEach(function (q) { s += hole(x0 + (q[0] < 0 ? w + q[0] : q[0]), y0 + (q[1] < 0 ? h + q[1] : q[1])); });
    s += o.body(x0, y0, w, h);
    var px = x0 + (w - (n - 1) * pitch) / 2, hy = o.top ? y0 + 4 : y0 + h - 16;
    s += rect(px - 9, hy, (n - 1) * pitch + 18, 12, 'fill:#0c0e10', 2);
    o.pins.forEach(function (p, i) {
      var x = px + i * pitch;
      s += rect(x - 4, hy + 2, 8, 8, 'fill:' + GOLD, 1) +
        (o.top ? path('M' + x + ' ' + y0 + ' V' + (y0 - 18), 'stroke:' + GOLD + ';stroke-width:3.5;stroke-linecap:round') + tx(x, y0 - 26, p, 'mono')
          : path('M' + x + ' ' + (y0 + h) + ' V' + (y0 + h + 20), 'stroke:' + GOLD + ';stroke-width:3.5;stroke-linecap:round') + tx(x, y0 + h + 35, p, 'mono'));
    });
    return svg(w + 32 + (o.extraW || 0), h + 62, s, o.label);
  }

  /* ================= loose parts ================= */
  ART.led = function () {
    return svg(200, 160,
      path('M70 74 V46 a30 30 0 0 1 60 0 V74 Z', 'fill:#e5484d') +
      path('M78 70 V48 a22 22 0 0 1 14 -20', 'fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;opacity:.35') +
      path('M92 74 V52 h-8 v-8 h14 v30 Z M108 74 V46 h10 l4 10 h-8 v18 Z', 'fill:#8f1d22;opacity:.75') +
      path('M62 72 H134 V82 H62 Z', 'fill:#c93a3f') +
      leg(92, 82, 150) + leg(112, 82, 128) +
      tx(50, 140, T({ he: 'רגל ארוכה', en: 'long leg' })) + tx(50, 154, '+', 'mono') +
      tx(156, 118, T({ he: 'רגל קצרה', en: 'short leg' })) + tx(156, 132, '−', 'mono') +
      path('M136 72 v10', 'stroke:currentColor;stroke-width:1.5') + tx(168, 80, T({ he: 'צד שטוח', en: 'flat side' })), 'LED');
  };
  ART.button = function () {
    var legs = '';
    [76, 124].forEach(function (x) {
      legs += path('M' + x + ' 36 V20 q0 -6 -6 -6 M' + x + ' 108 V124 q0 6 -6 6', 'fill:none;stroke:#9aa3a8;stroke-width:4;stroke-linecap:round');
    });
    return svg(200, 150, legs +
      rect(62, 34, 76, 76, 'fill:#23282c', 6) + rect(68, 40, 64, 64, METAL, 4) +
      [[74, 46], [126, 46], [74, 98], [126, 98]].map(function (q) { return circ(q[0], q[1], 3.5, 'fill:#23282c'); }).join('') +
      circ(100, 72, 21, 'fill:#16191c') + circ(100, 72, 15, 'fill:#2f363b') +
      path('M76 22 V122 M124 22 V122', 'stroke:var(--accent);stroke-width:2;stroke-dasharray:4 3;fill:none') +
      tx(36, 76, T({ he: 'זוג מחובר', en: 'joined pair' })) + tx(164, 76, T({ he: 'זוג מחובר', en: 'joined pair' })) +
      tx(100, 146, T({ he: 'לחיצה מחברת בין הזוגות', en: 'pressing joins the two pairs' })), 'Push button');
  };
  ART.pot = function () {
    var ribs = '';
    for (var i = 0; i < 16; i++) {
      var a = i * Math.PI / 8;
      ribs += '<line x1="' + (100 + 26 * Math.cos(a)).toFixed(1) + '" y1="' + (46 + 26 * Math.sin(a)).toFixed(1) + '" x2="' + (100 + 33 * Math.cos(a)).toFixed(1) + '" y2="' + (46 + 33 * Math.sin(a)).toFixed(1) + '" style="stroke:#174a9c;stroke-width:3"/>';
    }
    return svg(200, 150,
      leg(78, 96, 124) + leg(100, 96, 124) + leg(122, 96, 124) +
      rect(64, 62, 72, 36, 'fill:#2463c9;stroke:#174a9c;stroke-width:2', 4) +
      circ(100, 46, 33, 'fill:#2f7fe0;stroke:#174a9c;stroke-width:2') + ribs + circ(100, 46, 22, 'fill:#3d8cf0') +
      path('M84 46 H116 M100 30 V62', 'stroke:#174a9c;stroke-width:4;stroke-linecap:round') +
      tx(66, 142, T({ he: 'קצה', en: 'end' })) + tx(100, 142, T({ he: 'אמצע', en: 'middle' })) + tx(136, 142, T({ he: 'קצה', en: 'end' })), 'Potentiometer');
  };
  ART.ldr = function () {
    return svg(200, 150,
      leg(88, 84, 124) + leg(112, 84, 124) +
      circ(100, 52, 36, 'fill:#e8e2d2;stroke:#b9b29c;stroke-width:2') + circ(100, 52, 31, 'fill:#d9925a') +
      path('M76 36 H124 V44 H76 V52 H124 V60 H76 V68 H124', 'fill:none;stroke:#8f2a1f;stroke-width:3') +
      circ(80, 76, 3, METAL) + circ(120, 28, 3, METAL) +
      tx(100, 144, T({ he: 'אין כיוון', en: 'no direction' })), 'LDR');
  };
  ART.buzzer = function () {
    return svg(200, 150,
      leg(84, 96, 134) + leg(116, 96, 124) +
      circ(100, 58, 41, 'fill:#16191c') + circ(100, 58, 34, 'fill:#23282c;stroke:#3a4247;stroke-width:2') +
      circ(100, 58, 7, 'fill:#0c0e10;stroke:#3a4247;stroke-width:2') +
      tx(76, 40, '+', 'onbody') +
      tx(60, 140, '+', 'mono', 'end') + tx(140, 130, '−', 'mono', 'start') +
      tx(46, 126, T({ he: 'רגל ארוכה', en: 'long leg' })), 'Buzzer');
  };
  ART.servo = function () {
    return svg(250, 160,
      path('M118 84 H186 M118 92 H186 M118 100 H186', 'fill:none') +
      path('M118 84 H186', 'stroke:#8b5a2b;stroke-width:4;fill:none') + path('M118 92 H186', 'stroke:#e5484d;stroke-width:4;fill:none') + path('M118 100 H186', 'stroke:#f08c2e;stroke-width:4;fill:none') +
      rect(186, 78, 18, 28, DARK, 2) +
      rect(10, 58, 124, 12, 'fill:#2468ac', 3) + circ(18, 64, 3.5, 'fill:var(--surface-2)') + circ(126, 64, 3.5, 'fill:var(--surface-2)') +
      rect(26, 44, 92, 70, 'fill:#2f7fd1;stroke:#1d5c9e;stroke-width:2', 5) +
      rect(34, 78, 50, 28, 'fill:#f4f4f4', 2) + dk(59, 96, 'SG90', 11) +
      rect(34, 30, 44, 16, 'fill:#3d8cf0;stroke:#1d5c9e;stroke-width:2', 4) +
      circ(52, 30, 11, 'fill:#f4f4f4;stroke:#9aa3a8;stroke-width:2') +
      rect(47, 4, 10, 62, 'fill:#f4f4f4;stroke:#9aa3a8;stroke-width:2', 5) + circ(52, 30, 3, 'fill:#9aa3a8') +
      tx(214, 70, T({ he: 'חום', en: 'brown' }) + ': GND') + tx(214, 124, T({ he: 'אדום', en: 'red' }) + ': 5V') +
      tx(214, 140, T({ he: 'כתום', en: 'orange' }) + ': ' + T({ he: 'אות', en: 'signal' })), 'SG90 servo');
  };
  ART.ds18b20 = function () {
    return svg(200, 150,
      leg(80, 70, 114) + leg(100, 70, 114) + leg(120, 70, 114) +
      path('M68 26 H132 V72 H68 Z', 'fill:#1b1f22') + path('M68 26 a32 10 0 0 1 64 0', 'fill:#2a3136') +
      tx(100, 46, 'DALLAS', 'onbody') + tx(100, 60, '18B20', 'onbody') +
      tx(74, 130, 'GND', 'mono') + tx(100, 130, 'DQ', 'mono') + tx(128, 130, 'VDD', 'mono') +
      tx(100, 146, T({ he: 'הצד השטוח פונה אליכם', en: 'flat side facing you' })), 'DS18B20');
  };
  ART.rgb = function () {
    return svg(200, 150,
      leg(82, 76, 114) + leg(94, 76, 128) + leg(106, 76, 114) + leg(118, 76, 110) +
      path('M70 70 V44 a30 30 0 0 1 60 0 V70 Z', 'fill:#f4f6f7;stroke:#b9c0c5;stroke-width:2') +
      circ(89, 48, 9, 'fill:#e5484d;opacity:.75') + circ(111, 48, 9, 'fill:#3fb950;opacity:.75') + circ(100, 60, 9, 'fill:#2f7fd1;opacity:.75') +
      rect(63, 68, 74, 9, 'fill:#dfe4e7;stroke:#b9c0c5;stroke-width:1.5', 2) +
      tx(74, 128, 'R', 'mono') + tx(94, 142, '−', 'mono') + tx(108, 128, 'G', 'mono') + tx(124, 124, 'B', 'mono') +
      tx(162, 100, T({ he: 'הרגל הארוכה', en: 'the long leg' })) + tx(162, 114, T({ he: 'משותפת', en: 'is shared' })), 'RGB LED');
  };

  /* ================= sensors on a board ================= */
  ART.hcsr04 = function () {
    return M({
      w: 200, h: 84, pins: ['VCC', 'Trig', 'Echo', 'GND'], label: 'HC-SR04', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var eye = function (cx) {
          var s = circ(cx, y + 34, 27, METAL) + circ(cx, y + 34, 20, 'fill:#2a3136');
          for (var i = -2; i <= 2; i++) s += path('M' + (cx - 17) + ' ' + (y + 34 + i * 7) + ' h34 M' + (cx + i * 7) + ' ' + (y + 17) + ' v34', 'stroke:#596168;stroke-width:1');
          return s;
        };
        return eye(x + 44) + eye(x + w - 44) + rect(x + w / 2 - 15, y + 8, 30, 12, METAL, 6) +
          tx(x + 14, y + 76, 'T', 'onpcb') + tx(x + w - 14, y + 76, 'R', 'onpcb') + tx(x + w / 2, y + 40, 'HC-SR04', 'onpcb');
      }
    });
  };
  ART.pir = function () {
    return M({
      w: 140, h: 104, color: GREEN, pins: ['VCC', 'OUT', 'GND'], label: 'PIR motion sensor', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var cx = x + w / 2, cy = y + 44, s = rect(cx - 36, cy - 36, 72, 72, WHITE, 6) + circ(cx, cy, 31, 'fill:#fbfbfb;stroke:#c9ced3;stroke-width:2');
        for (var i = 0; i < 6; i++) {
          var a = i * Math.PI / 3;
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 31 * Math.cos(a)).toFixed(1) + '" y2="' + (cy + 31 * Math.sin(a)).toFixed(1) + '" style="stroke:#d5dade;stroke-width:1.5"/>';
        }
        return s + circ(cx, cy, 20, 'fill:none;stroke:#d5dade;stroke-width:1.5') + circ(cx, cy, 9, 'fill:none;stroke:#d5dade;stroke-width:1.5') +
          rect(x + 6, y + 60, 12, 12, 'fill:#f08c2e', 2) + rect(x + w - 18, y + 60, 12, 12, 'fill:#f08c2e', 2);
      }
    });
  };
  ART.dht22 = function () {
    return M({
      w: 110, h: 122, color: BLACK, pins: ['+', 'OUT', '−'], label: 'DHT22',
      body: function (x, y, w) {
        var bx = x + 20, s = rect(bx, y + 6, w - 40, 92, WHITE, 4) + circ(x + w / 2, y + 16, 4.5, 'fill:var(--surface-2);stroke:#b9c0c5;stroke-width:1.5');
        for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) s += rect(bx + 9 + c * 14, y + 30 + r * 13, 9, 6, 'fill:#8d969c', 3);
        return s;
      }
    });
  };
  ART.oled = function () {
    return M({
      w: 150, h: 112, top: true, pins: ['GND', 'VCC', 'SCL', 'SDA'], label: 'OLED display', holes: [[9, 9], [-9, 9], [9, -9], [-9, -9]],
      body: function (x, y, w, h) {
        return rect(x + 8, y + 22, w - 16, 66, 'fill:#0b0f12;stroke:#2a3136;stroke-width:2', 3) +
          '<text x="' + (x + w / 2) + '" y="' + (y + 44) + '" text-anchor="middle" style="font:700 12px var(--mono);fill:#ffd84d">Hello</text>' +
          tx(x + w / 2, y + 62, 'Pico 2', 'screen') + tx(x + w / 2, y + 78, '23.5 C', 'screen') +
          rect(x + w / 2 - 22, y + h - 14, 44, 8, 'fill:#c98a3a', 1);
      }
    });
  };
  ART.bh1750 = function () {
    return M({
      w: 160, h: 78, pins: ['VCC', 'GND', 'SCL', 'SDA', 'ADDR'], label: 'BH1750', holes: [[10, 10], [-10, 10]],
      body: function (x, y, w) {
        return rect(x + w / 2 - 9, y + 10, 18, 13, 'fill:#e9eef2;stroke:#7b858c;stroke-width:1.5', 2) + circ(x + w / 2, y + 16, 3, 'fill:#3a4247') +
          tx(x + w / 2, y + 40, 'GY-302', 'onpcb') + smd(x + 34, y + 30) + smd(x + w - 44, y + 30) + rect(x + 36, y + 44, 14, 9, DARK, 1);
      }
    });
  };
  ART.mpu6050 = function () {
    return M({
      w: 226, h: 84, pitch: 26, pins: ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'], label: 'MPU6050', holes: [[11, 11], [-11, 11]],
      body: function (x, y, w) {
        return rect(x + w / 2 - 15, y + 14, 30, 30, DARK, 3) + circ(x + w / 2 - 9, y + 20, 2, 'fill:#8d969c') +
          tx(x + 58, y + 50, 'GY-521', 'onpcb') + smd(x + 46, y + 20) + smd(x + 46, y + 30) + smd(x + w - 60, y + 20) + rect(x + w - 62, y + 34, 16, 10, DARK, 1) +
          circ(x + w - 34, y + 48, 3, 'fill:#3fb950');
      }
    });
  };
  ART.bme280 = function () {
    return M({
      w: 140, h: 78, color: PURPLE, pins: ['VIN', 'GND', 'SCL', 'SDA'], label: 'BME280', holes: [[11, 11], [-11, 11]],
      body: function (x, y, w) {
        return rect(x + w / 2 - 10, y + 10, 20, 18, METAL, 2) + circ(x + w / 2 - 4, y + 15, 1.8, 'fill:#3a4247') +
          tx(x + w / 2, y + 46, 'BME/BMP280', 'onpcb') + smd(x + 30, y + 28) + smd(x + w - 40, y + 28);
      }
    });
  };
  ART.sound = function () {
    return M({
      w: 190, h: 84, color: RED, pins: ['AO', 'G', '+', 'DO'], label: 'Sound sensor', holes: [[-12, 12]],
      body: function (x, y, w) {
        return circ(x + 32, y + 32, 22, METAL) + circ(x + 32, y + 32, 15, 'fill:#16191c') + circ(x + 32, y + 32, 4, 'fill:#3a4247') +
          trim(x + 70, y + 14) + chip(x + 104, y + 20, 26, 16) +
          circ(x + w - 42, y + 50, 4, 'fill:#ff6b6b') + circ(x + w - 28, y + 50, 4, 'fill:#7dff9e') + smd(x + 72, y + 46, '#2a3136') + smd(x + 88, y + 46, '#2a3136');
      }
    });
  };
  ART.mq2 = function () {
    return M({
      w: 160, h: 104, pins: ['VCC', 'GND', 'DO', 'AO'], label: 'MQ-2 gas sensor', holes: [[-10, 10], [10, -30]],
      body: function (x, y, w) {
        var cx = x + 58, cy = y + 42, s = circ(cx, cy, 36, 'fill:#c9a36a;stroke:#8a6a3a;stroke-width:2') + circ(cx, cy, 29, METAL);
        for (var i = -3; i <= 3; i++) s += path('M' + (cx - 24) + ' ' + (cy + i * 7) + ' h48 M' + (cx + i * 7) + ' ' + (cy - 24) + ' v48', 'stroke:#8d969c;stroke-width:1');
        return s + trim(x + w - 40, y + 26) + tx(x + w - 29, y + 64, 'MQ-2', 'onpcb') + circ(x + w - 29, y + 76, 3.5, 'fill:#ff6b6b');
      }
    });
  };
  ART.tilt = function () {
    return M({
      w: 120, h: 86, color: BLACK, pins: ['S', '+', '−'], label: 'Tilt sensor', holes: [[10, 10], [-10, 10]],
      body: function (x, y, w) {
        return path('M' + (x + 30) + ' ' + (y + 60) + ' V46 M' + (x + w - 30) + ' ' + (y + 60) + ' V46', 'stroke:#9aa3a8;stroke-width:3') +
          rect(x + w / 2 - 30, y + 24, 60, 22, 'fill:#3fa7d6;stroke:#2478a3;stroke-width:2', 6) + rect(x + w / 2 + 18, y + 24, 12, 22, METAL, 3) +
          circ(x + w / 2 - 12, y + 35, 7, 'fill:#cfd6da;opacity:.85') + smd(x + w / 2 - 5, y + 56, '#2a3136');
      }
    });
  };
  ART.hall = function () {
    return M({
      w: 120, h: 86, color: BLACK, extraW: 78, pins: ['−', '+', 'S'], label: 'Hall sensor', holes: [[10, 10], [-10, 10]],
      body: function (x, y, w) {
        var cx = x + w / 2;
        return path('M' + (cx - 8) + ' ' + (y + 38) + ' v18 M' + cx + ' ' + (y + 38) + ' v18 M' + (cx + 8) + ' ' + (y + 38) + ' v18', 'stroke:#9aa3a8;stroke-width:2.5') +
          path('M' + (cx - 16) + ' ' + (y + 38) + ' V' + (y + 20) + ' l5 -5 h22 l5 5 V' + (y + 38) + ' Z', 'fill:#2a3136;stroke:#596168;stroke-width:1.5') +
          tx(cx, y + 32, '3144', 'onbody') + circ(x + w - 22, y + 54, 3.5, 'fill:#ff6b6b') + smd(x + 16, y + 52, '#2a3136') +
          path('M' + (x + w + 8) + ' ' + (y + 22) + ' q10 12 0 24 M' + (x + w + 18) + ' ' + (y + 16) + ' q16 18 0 36', 'stroke:currentColor;stroke-width:1.5;fill:none') +
          rect(x + w + 36, y + 20, 18, 28, 'fill:#e5484d', 2) + rect(x + w + 54, y + 20, 18, 28, 'fill:#2f7fd1', 2) +
          tx(x + w + 45, y + 38, 'N', 'onbody') + tx(x + w + 63, y + 38, 'S', 'onbody') + tx(x + w + 54, y + 66, T({ he: 'מגנט', en: 'magnet' }));
      }
    });
  };
  ART.touch = function () {
    return M({
      w: 110, h: 100, color: RED, pins: ['SIG', 'VCC', 'GND'], label: 'Touch sensor',
      body: function (x, y, w) {
        var cx = x + w / 2, cy = y + 36, s = '';
        [28, 21, 14, 7].forEach(function (r) { s += circ(cx, cy, r, 'fill:none;stroke:#f4f4f4;stroke-width:2.5'); });
        return s + tx(cx, y + 78, 'TTP223', 'onpcb');
      }
    });
  };
  ART.irrecv = function () {
    return M({
      w: 110, h: 92, color: BLACK, extraW: 96, pins: ['S', '+', '−'], label: 'IR receiver and remote', holes: [[10, 10], [-10, 10]],
      body: function (x, y, w) {
        var cx = x + w / 2, s = path('M' + (cx - 9) + ' ' + (y + 46) + ' v14 M' + cx + ' ' + (y + 46) + ' v14 M' + (cx + 9) + ' ' + (y + 46) + ' v14', 'stroke:#9aa3a8;stroke-width:2.5') +
          rect(cx - 17, y + 16, 34, 32, 'fill:#23282c;stroke:#596168;stroke-width:1.5', 3) + circ(cx, y + 30, 10, 'fill:#0c0e10;stroke:#3a4247;stroke-width:2') +
          circ(x + 18, y + 58, 3.5, 'fill:#ff6b6b');
        var rx = x + w + 40;
        s += path('M' + (rx - 4) + ' ' + (y + 26) + ' l-26 6 M' + (rx - 4) + ' ' + (y + 38) + ' h-28 M' + (rx - 4) + ' ' + (y + 50) + ' l-26 -6', 'stroke:#e5484d;stroke-width:2;stroke-dasharray:5 4;fill:none') +
          rect(rx, y - 2, 50, 104, 'fill:#23282c;stroke:#596168;stroke-width:2', 7);
        var cols = ['#e5484d', '#f4f4f4', '#f4f4f4'];
        for (var i = 0; i < 18; i++) s += circ(rx + 12 + (i % 3) * 13, y + 10 + Math.floor(i / 3) * 15, 4.5, 'fill:' + (i < 3 ? cols[i] : i < 9 ? '#3fa7d6' : '#f4f4f4'));
        return s;
      }
    });
  };
  ART.soil = function () {
    return svg(210, 190,
      path('M82 30 V8 M100 30 V8 M118 30 V8', 'fill:none') +
      path('M88 34 V8', 'stroke:#e9c46a;stroke-width:4') + path('M100 34 V8', 'stroke:#e5484d;stroke-width:4') + path('M112 34 V8', 'stroke:#596168;stroke-width:4') +
      path('M72 30 H128 V148 L100 184 L72 148 Z', 'fill:#16191c;stroke:#3a4247;stroke-width:1.5') +
      rect(80, 24, 40, 16, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1.5', 2) +
      chip(88, 50, 24, 12) + smd(80, 70, '#c8b08a') + smd(110, 70, '#c8b08a') +
      path('M72 88 H128', 'stroke:#f4f4f4;stroke-width:2') +
      '<text transform="translate(96 140) rotate(-90)" text-anchor="middle" style="font:700 8px var(--mono);fill:#f4f4f4">Capacitive Soil</text>' +
      '<text transform="translate(108 140) rotate(-90)" text-anchor="middle" style="font:700 8px var(--mono);fill:#f4f4f4">Sensor v1.2</text>' +
      path('M134 88 H150', 'stroke:currentColor;stroke-width:1.5') + tx(176, 86, T({ he: 'נעצו באדמה', en: 'bury up to' })) + tx(176, 100, T({ he: 'עד הקו', en: 'the line' })) +
      tx(40, 12, 'AOUT', 'mono') + tx(40, 26, 'VCC', 'mono') + tx(40, 40, 'GND', 'mono'), 'Capacitive soil moisture sensor');
  };

  /* ================= movement and switching ================= */
  ART.relay = function () {
    return M({
      w: 190, h: 96, pins: ['VCC', 'GND', 'IN'], label: 'Relay module', holes: [[9, 9], [9, -30]],
      body: function (x, y, w) {
        var s = rect(x + 34, y + 10, 78, 60, 'fill:#2f7fe0;stroke:#174a9c;stroke-width:2', 4) +
          tx(x + 73, y + 34, 'SONGLE', 'onpcb') + tx(x + 73, y + 48, 'SRD-05VDC', 'onpcb') +
          rect(x + w - 60, y + 14, 50, 50, 'fill:#3d8cf0;stroke:#174a9c;stroke-width:2', 3);
        [0, 1, 2].forEach(function (i) {
          var cy = y + 24 + i * 15;
          s += circ(x + w - 42, cy, 5.5, METAL) + path('M' + (x + w - 46) + ' ' + cy + ' h8', 'stroke:#7b858c;stroke-width:1.5') + rect(x + w - 26, cy - 4, 12, 8, 'fill:#174a9c', 1);
        });
        return s + tx(x + w - 35, y + 78, 'NO COM NC', 'onpcb') + circ(x + 18, y + 40, 3.5, 'fill:#ff6b6b');
      }
    });
  };
  ART.motor = function () {
    return M({
      w: 110, h: 92, color: BLACK, extraW: 118, pins: ['IN1', 'IN2', 'VCC', 'GND'], pitch: 24, label: 'Motor driver and DC motor', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var mx = x + w + 30;
        return chip(x + w / 2 - 16, y + 22, 32, 20) + tx(x + w / 2, y + 60, 'DRV8833', 'onpcb') + smd(x + 14, y + 46) + smd(x + w - 24, y + 46) +
          path('M' + (x + w) + ' ' + (y + 28) + ' H' + (mx + 4), 'stroke:#e5484d;stroke-width:3;fill:none') + path('M' + (x + w) + ' ' + (y + 40) + ' H' + (mx + 4), 'stroke:#596168;stroke-width:3;fill:none') +
          rect(mx, y + 14, 12, 40, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1.5', 3) +
          rect(mx + 10, y + 8, 58, 52, METAL, 8) + path('M' + (mx + 22) + ' ' + (y + 8) + ' v52 M' + (mx + 56) + ' ' + (y + 8) + ' v52', 'stroke:#9aa3a8;stroke-width:1.5') +
          rect(mx + 68, y + 30, 18, 8, 'fill:#9aa3a8', 2) + tx(mx + 39, y + 78, T({ he: 'מנוע', en: 'motor' }));
      }
    });
  };
  ART.stepper = function () {
    return M({
      w: 130, h: 104, color: GREEN, extraW: 116, pitch: 20, pins: ['IN1', 'IN2', 'IN3', 'IN4', '+', '−'], label: 'Stepper motor and driver', holes: [[8, 8], [-8, 8]],
      body: function (x, y, w) {
        var s = chip(x + 22, y + 24, 60, 18, 'ULN2003') + rect(x + w - 34, y + 16, 22, 46, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1.5', 2);
        ['A', 'B', 'C', 'D'].forEach(function (c, i) { s += circ(x + 28 + i * 14, y + 62, 4, 'fill:#ff6b6b') + tx(x + 28 + i * 14, y + 78, c, 'onpcb'); });
        var cx = x + w + 62, cy = y + 44;
        s += path('M' + (x + w - 12) + ' ' + (y + 40) + ' C' + (x + w + 14) + ' ' + (y + 40) + ' ' + (cx - 40) + ' ' + (cy + 62) + ' ' + cx + ' ' + (cy + 44), 'stroke:#e9c46a;stroke-width:5;fill:none') +
          rect(cx - 52, cy - 7, 104, 14, METAL, 7) + circ(cx - 44, cy, 3.5, 'fill:var(--surface-2)') + circ(cx + 44, cy, 3.5, 'fill:var(--surface-2)') +
          rect(cx - 15, cy + 28, 30, 20, 'fill:#2f7fd1;stroke:#1d5c9e;stroke-width:2', 3) +
          circ(cx, cy, 37, METAL) + circ(cx, cy - 14, 9, 'fill:#e9eef2;stroke:#7b858c;stroke-width:1.5') + rect(cx - 3, cy - 20, 6, 12, 'fill:' + GOLD, 1) +
          dk(cx, cy + 18, '28BYJ-48');
        return s;
      }
    });
  };

  /* ================= user input ================= */
  ART.joystick = function () {
    return M({
      w: 170, h: 122, color: BLACK, pins: ['GND', '+5V', 'VRx', 'VRy', 'SW'], label: 'Joystick', holes: [[10, 10], [-10, 10], [10, -30], [-10, -30]],
      body: function (x, y, w) {
        var cx = x + w / 2, cy = y + 50;
        return rect(cx - 34, cy - 34, 68, 68, METAL, 6) + rect(cx - 44, cy - 12, 12, 24, 'fill:#3a4247', 2) + rect(cx - 12, cy + 32, 24, 12, 'fill:#3a4247', 2) +
          circ(cx, cy, 39, 'fill:#16191c;stroke:#3a4247;stroke-width:2') + circ(cx, cy, 30, 'fill:#23282c') + circ(cx, cy, 21, 'fill:#1b1f22;stroke:#3a4247;stroke-width:1.5') +
          path('M' + (cx - 18) + ' ' + (cy - 26) + ' a32 32 0 0 1 22 -10', 'fill:none;stroke:#596168;stroke-width:3;stroke-linecap:round');
      }
    });
  };
  ART.encoder = function () {
    return M({
      w: 170, h: 100, color: BLACK, pins: ['CLK', 'DT', 'SW', '+', 'GND'], label: 'Rotary encoder', holes: [[10, 10], [-10, 10]],
      body: function (x, y, w) {
        var cx = x + w / 2, cy = y + 40;
        return rect(cx - 29, cy - 27, 58, 54, METAL, 4) + circ(cx, cy, 22, 'fill:#aab2b8;stroke:#7b858c;stroke-width:2') +
          circ(cx, cy, 15, 'fill:#e9eef2;stroke:#7b858c;stroke-width:2') + path('M' + (cx - 11) + ' ' + (cy + 9) + ' h22', 'stroke:#7b858c;stroke-width:2.5') +
          path('M' + (cx + 38) + ' ' + (cy - 16) + ' a40 40 0 0 1 0 32 m0 0 l-7 -3 m7 3 l3 -8', 'stroke:#f4f4f4;stroke-width:2;fill:none') +
          smd(x + 22, y + 30) + smd(x + 22, y + 44);
      }
    });
  };
  ART.keypad = function () {
    var keys = ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'], names = ['R1', 'R2', 'R3', 'R4', 'C1', 'C2', 'C3', 'C4'];
    var s = rect(36, 6, 148, 132, 'fill:#16191c;stroke:#f4f4f4;stroke-width:3', 8);
    keys.forEach(function (k, i) {
      var kx = 46 + (i % 4) * 33, ky = 15 + Math.floor(i / 4) * 30, red = i % 4 === 3 || k === '*' || k === '#';
      s += rect(kx, ky, 28, 24, 'fill:' + (red ? '#d93a3f' : '#2f6fd6') + ';stroke:#f4f4f4;stroke-width:1.5', 4) +
        '<text x="' + (kx + 14) + '" y="' + (ky + 17) + '" text-anchor="middle" style="font:700 13px var(--font);fill:#fff">' + k + '</text>';
    });
    s += path('M70 138 H150 L196 172 H24 Z', 'fill:#e9e6dc;stroke:#b9b29c;stroke-width:1.5') + rect(20, 172, 180, 13, 'fill:#0c0e10', 2);
    names.forEach(function (nm, i) {
      var px = 33 + i * 22;
      s += path('M' + (80 + i * 8.6) + ' 138 L' + px + ' 172', 'stroke:#b9b29c;stroke-width:1') + rect(px - 4, 174.5, 8, 8, 'fill:' + GOLD, 1) + tx(px, 200, nm, 'mono');
    });
    return svg(220, 206, s, '4x4 membrane keypad');
  };

  /* ================= light and display ================= */
  ART.neopixel = function () {
    return M({
      w: 236, h: 62, color: BLACK, pins: ['5V', 'DIN', 'GND'], label: 'NeoPixel stick',
      body: function (x, y, w) {
        var s = '', cols = ['#e5484d', '#f08c2e', '#e9c46a', '#3fb950', '#3fd6c0', '#2f7fd1', '#8a5cf0', '#e25ac0'];
        for (var i = 0; i < 8; i++) {
          var cx = x + 20 + i * 28;
          s += rect(cx - 10, y + 8, 20, 20, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1.5', 3) + circ(cx, y + 18, 6.5, 'fill:' + cols[i]) + rect(cx + 11, y + 30, 5, 4, 'fill:#c8b08a', 1);
        }
        return s + tx(x + w - 38, y + 44, 'DIN → DOUT', 'onpcb');
      }
    });
  };
  ART.lcd1602 = function () {
    return M({
      w: 270, h: 124, color: GREEN, pins: ['GND', 'VCC', 'SDA', 'SCL'], label: '16x2 LCD', holes: [[9, 9], [-9, 9], [9, -9], [-9, -9]],
      body: function (x, y, w) {
        var s = '';
        for (var i = 0; i < 16; i++) s += circ(x + 28 + i * 9, y + 9, 3, 'fill:' + GOLD);
        return s + rect(x + 16, y + 20, w - 32, 78, 'fill:#16191c', 3) + rect(x + 28, y + 30, w - 56, 58, 'fill:#1f4fd1;stroke:#0b2a7a;stroke-width:2', 2) +
          '<text x="' + (x + w / 2) + '" y="' + (y + 55) + '" text-anchor="middle" style="font:700 15px var(--mono);fill:#fff;letter-spacing:2px">Hello Pico 2</text>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + 78) + '" text-anchor="middle" style="font:700 15px var(--mono);fill:#fff;letter-spacing:2px">Line two    </text>';
      }
    });
  };
  ART.tm1637 = function () {
    return M({
      w: 200, h: 96, pins: ['CLK', 'DIO', 'VCC', 'GND'], label: 'TM1637 digit display', holes: [[8, 8], [-8, 8], [8, -8], [-8, -8]],
      body: function (x, y, w) {
        return rect(x + 20, y + 10, w - 40, 60, 'fill:#16191c;stroke:#3a4247;stroke-width:1.5', 4) +
          '<text x="' + (x + w / 2) + '" y="' + (y + 56) + '" text-anchor="middle" style="font:700 44px var(--mono);fill:#4a1d20;letter-spacing:3px">88:88</text>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + 56) + '" text-anchor="middle" style="font:700 44px var(--mono);fill:#ff4d4d;letter-spacing:3px">12:34</text>';
      }
    });
  };
  ART.max7219 = function () {
    return M({
      w: 190, h: 146, pins: ['VCC', 'GND', 'DIN', 'CS', 'CLK'], label: 'LED matrix', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var s = rect(x + w / 2 - 57, y + 6, 114, 114, 'fill:#16191c;stroke:#3a4247;stroke-width:1.5', 4);
        var face = ['00111100', '01000010', '10100101', '10000001', '10100101', '10011001', '01000010', '00111100'];
        for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
          var on = face[r].charAt(c) === '1';
          s += circ(x + w / 2 - 47.25 + c * 13.5, y + 15.75 + r * 13.5, 5, on ? 'fill:#ff4d4d' : 'fill:#e9eef2;opacity:.28');
        }
        return s;
      }
    });
  };

  /* ================= storage, time, position, identity ================= */
  ART.sdcard = function () {
    return M({
      w: 196, h: 104, pins: ['GND', 'VCC', 'MISO', 'MOSI', 'SCK', 'CS'], label: 'microSD module', holes: [[9, -30], [-9, -30]],
      body: function (x, y, w) {
        var cx = x + w / 2;
        return rect(cx - 36, y + 6, 72, 52, METAL, 3) + path('M' + (cx - 22) + ' ' + (y + 2) + ' h44 v42 h-36 l-8 -8 z', 'fill:#16191c') +
          tx(cx, y + 24, 'micro', 'onbody') + tx(cx, y + 38, 'SD', 'onbody') +
          chip(x + 18, y + 50, 22, 12) + rect(x + w - 44, y + 46, 22, 16, DARK, 2) + smd(x + 22, y + 26) + smd(x + w - 36, y + 26);
      }
    });
  };
  ART.gps = function () {
    return M({
      w: 120, h: 110, extraW: 96, pins: ['VCC', 'RX', 'TX', 'GND'], pitch: 26, label: 'GPS module', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var ax = x + w + 26;
        return rect(x + w / 2 - 32, y + 20, 64, 46, METAL, 3) + dk(x + w / 2, y + 40, 'u-blox') + dk(x + w / 2, y + 54, 'NEO-6M') +
          circ(x + 18, y + 78, 7, METAL) + rect(x + w - 34, y + 72, 18, 10, DARK, 1) +
          path('M' + (x + w - 10) + ' ' + (y + 12) + ' C' + (x + w + 16) + ' ' + (y - 6) + ' ' + (ax - 10) + ' ' + (y + 70) + ' ' + (ax + 10) + ' ' + (y + 62), 'stroke:#596168;stroke-width:3;fill:none') +
          rect(ax, y + 14, 62, 62, 'fill:#e9dcc0;stroke:#b8a77e;stroke-width:2', 4) + rect(ax + 10, y + 24, 42, 42, 'fill:#dfe4e7;stroke:#b9c0c5;stroke-width:1.5', 2) + circ(ax + 24, y + 38, 3, 'fill:#8d969c') +
          tx(ax + 31, y + 92, T({ he: 'אנטנה', en: 'antenna' }));
      }
    });
  };
  ART.ds3231 = function () {
    return M({
      w: 196, h: 100, pitch: 26, pins: ['32K', 'SQW', 'SCL', 'SDA', 'VCC', 'GND'], label: 'DS3231 clock', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        return circ(x + w - 50, y + 40, 30, 'fill:#16191c') + circ(x + w - 50, y + 40, 25, METAL) + dk(x + w - 50, y + 38, 'CR2032') + dk(x + w - 50, y + 50, '+ 3V') +
          chip(x + 26, y + 20, 44, 20, 'DS3231') + chip(x + 34, y + 52, 24, 12) + smd(x + 78, y + 24) + smd(x + 78, y + 36) + circ(x + 20, y + 62, 3.5, 'fill:#ff6b6b');
      }
    });
  };
  ART.rc522 = function () {
    return M({
      w: 236, h: 124, extraW: 92, pitch: 26, pins: ['SDA', 'SCK', 'MOSI', 'MISO', 'IRQ', 'GND', 'RST', '3.3V'], label: 'RC522 card reader', holes: [[9, 9], [-9, 9]],
      body: function (x, y, w) {
        var s = '';
        for (var i = 0; i < 4; i++) s += rect(x + 22 + i * 6, y + 10 + i * 6, 124 - i * 12, 78 - i * 12, 'fill:none;stroke:#7fb2ee;stroke-width:2', 8);
        s += tx(x + 84, y + 52, 'RFID-RC522', 'onpcb') + chip(x + w - 66, y + 30, 28, 28) + rect(x + w - 30, y + 30, 14, 26, METAL, 6) + smd(x + w - 62, y + 70) + smd(x + w - 46, y + 70);
        var cx = x + w + 14;
        return s + rect(cx, y + 2, 70, 46, WHITE, 5) + '<text x="' + (cx + 35) + '" y="' + (y + 30) + '" text-anchor="middle" style="font:700 11px var(--font);fill:#23282c">' + T({ he: 'כרטיס', en: 'card' }) + '</text>' +
          path('M' + (cx + 35) + ' ' + (y + 58) + ' c22 0 30 22 18 38 c-8 12 -28 12 -36 0 c-12 -16 -4 -38 18 -38 z', 'fill:#2f7fe0;stroke:#174a9c;stroke-width:2') +
          circ(cx + 35, y + 66, 4.5, 'fill:var(--surface-2);stroke:#174a9c;stroke-width:1.5') + tx(cx + 35, y + 122, T({ he: 'מחזיק מפתחות', en: 'key fob' }));
      }
    });
  };

  /* ================= communication ================= */
  ART.hc05 = function () {
    return M({
      w: 200, h: 110, pitch: 28, pins: ['STATE', 'RXD', 'TXD', 'GND', 'VCC', 'EN'], label: 'HC-05 Bluetooth module',
      body: function (x, y, w) {
        return rect(x + 22, y + 6, w - 44, 76, 'fill:' + GREEN + ';stroke:#0f5132;stroke-width:1.5', 3) +
          zigzag(x + 30, y + 14, 3, 8) + path('M' + (x + 78) + ' ' + (y + 28) + ' h-48', 'stroke:' + GOLD + ';stroke-width:2.5') +
          rect(x + 88, y + 14, w - 122, 58, METAL, 3) + dk(x + 88 + (w - 122) / 2, y + 48, 'HC-05', 11) +
          circ(x + 34, y + 58, 6, 'fill:#16191c;stroke:#9aa3a8;stroke-width:1.5') + circ(x + 56, y + 58, 3.5, 'fill:#ff6b6b');
      }
    });
  };
  ART.nrf24 = function () {
    var x0 = 60, y0 = 8, w = 108, h = 142, s = rect(x0, y0, w, h, 'fill:' + BLACK + ';stroke:#3a4247;stroke-width:1.5', 5) +
      zigzag(x0 + 12, y0 + 10, 4) + path('M' + (x0 + 12) + ' ' + (y0 + 10) + ' v30 M' + (x0 + 92) + ' ' + (y0 + 10) + ' v30', 'stroke:' + GOLD + ';stroke-width:2.5') +
      chip(x0 + 22, y0 + 54, 30, 26) + rect(x0 + 64, y0 + 56, 30, 14, METAL, 7) + tx(x0 + 79, y0 + 84, '16.000', 'onpcb') +
      tx(x0 + w / 2, y0 + 100, 'nRF24L01+', 'onpcb') + rect(x0 + 14, y0 + 108, 80, 28, 'fill:#0c0e10', 2);
    for (var i = 0; i < 4; i++) for (var r = 0; r < 2; r++) s += rect(x0 + 20 + i * 19, y0 + 112 + r * 12, 8, 8, 'fill:' + GOLD, 1);
    s += tx(114, y0 + 160, '↑  IRQ  MOSI  CSN  VCC', 'mono') +
      tx(114, y0 + 174, '↓  MISO  SCK  CE  GND', 'mono');
    return svg(228, 192, s, 'nRF24L01');
  };
})(window.PICO);
