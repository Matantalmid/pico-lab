/* The catalog parts drawn small, for the breadboard pictures. They follow
   the large drawings in art-2.js. Each one draws inside a box about 66 wide
   and 44 high centred on (cx, cy); w is the width of the board it sits on. */
(function (P) {
  'use strict';
  var GOLD = '#d9b44a', GREEN = '#1f7a4d', SM = 'stroke-width:1.2';
  var METAL = 'fill:#cfd6da;stroke:#7b858c;' + SM;

  function rect(x, y, w, h, style, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 2 : rx) + '" style="' + style + '"/>';
  }
  function circ(cx, cy, r, style) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="' + style + '"/>'; }
  function path(d, style) { return '<path d="' + d + '" style="' + style + '"/>'; }
  function st(x, y, s, fill, size) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font:700 ' + (size || 7) + 'px var(--mono);fill:' + (fill || '#fff') + '">' + P.esc(s) + '</text>';
  }
  function chip(x, y, w, h) { return rect(x, y, w, h, 'fill:#23282c;stroke:#596168;stroke-width:1', 1.5); }
  function smd(x, y) { return rect(x, y, 7, 4, 'fill:#c8b08a', 1); }
  function led(x, y, c) { return circ(x, y, 2.4, 'fill:' + (c || '#ff6b6b')); }
  function trim(x, y) { return rect(x, y, 13, 13, 'fill:#2f7fd1;stroke:#1d5c9e;stroke-width:1', 2) + circ(x + 6.5, y + 6.5, 3.5, 'fill:#e9e6dc'); }
  function mesh(cx, cy, r) {
    var s = circ(cx, cy, r, METAL), k = r * 0.68;
    for (var i = -1; i <= 1; i++) s += path('M' + (cx - k) + ' ' + (cy + i * k * 0.6) + ' h' + (2 * k) + ' M' + (cx + i * k * 0.6) + ' ' + (cy - k) + ' v' + (2 * k), 'stroke:#8d969c;stroke-width:.8');
    return s;
  }
  function legs3(cx, y, gap, len) {
    return path('M' + (cx - gap) + ' ' + y + ' v' + len + ' M' + cx + ' ' + y + ' v' + len + ' M' + (cx + gap) + ' ' + y + ' v' + len, 'stroke:#9aa3a8;stroke-width:1.6');
  }

  P.partGlyph = {
    hcsr04: function (cx, cy) {
      var eye = function (x) { return mesh(x, cy + 2, 14) + circ(x, cy + 2, 6, 'fill:#2a3136;opacity:.55'); };
      return eye(cx - 19) + eye(cx + 19) + rect(cx - 7, cy - 21, 14, 6, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 3);
    },
    pir: function (cx, cy) {
      var s = rect(cx - 21, cy - 21, 42, 42, 'fill:#f4f4f4;stroke:#b9c0c5;' + SM, 4) + circ(cx, cy, 18, 'fill:#fbfbfb;stroke:#c9ced3;' + SM);
      for (var i = 0; i < 6; i++) {
        var a = i * Math.PI / 3;
        s += path('M' + cx + ' ' + cy + ' L' + (cx + 18 * Math.cos(a)).toFixed(1) + ' ' + (cy + 18 * Math.sin(a)).toFixed(1), 'stroke:#d5dade;stroke-width:1');
      }
      return s + circ(cx, cy, 10, 'fill:none;stroke:#d5dade;stroke-width:1');
    },
    dht22: function (cx, cy) {
      var s = rect(cx - 19, cy - 22, 38, 46, 'fill:#f4f4f4;stroke:#b9c0c5;' + SM, 3) + circ(cx, cy - 16, 2.5, 'fill:#8d969c');
      for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) s += rect(cx - 14 + c * 10, cy - 9 + r * 8, 7, 4, 'fill:#8d969c', 2);
      return s;
    },
    oled: function (cx, cy, w) {
      return rect(cx - w / 2 + 7, cy - 21, w - 14, 40, 'fill:#0b0f12;stroke:#2a3136;' + SM, 2) + st(cx, cy - 6, 'Hello', '#ffd84d', 9) + st(cx, cy + 8, 'Pico 2', '#6fe3ff', 9);
    },
    bh1750: function (cx, cy) {
      return rect(cx - 6, cy - 18, 12, 9, 'fill:#e9eef2;stroke:#7b858c;stroke-width:1', 1.5) + circ(cx, cy - 13.5, 2, 'fill:#3a4247') + st(cx, cy + 6, 'GY-302') +
        smd(cx - 26, cy - 6) + smd(cx + 19, cy - 6);
    },
    mpu6050: function (cx, cy) {
      return chip(cx - 10, cy - 20, 20, 20) + circ(cx - 6, cy - 16, 1.3, 'fill:#8d969c') + st(cx, cy + 12, 'GY-521') +
        smd(cx - 34, cy - 14) + smd(cx + 27, cy - 14) + led(cx + 34, cy + 2, '#3fb950');
    },
    bme280: function (cx, cy) {
      return rect(cx - 8, cy - 18, 16, 14, METAL, 1.5) + circ(cx - 4, cy - 14, 1.3, 'fill:#3a4247') + st(cx, cy + 10, 'BME280');
    },
    neopixel: function (cx, cy, w) {
      var n = Math.max(3, Math.min(8, Math.floor((w - 12) / 19))), s = '', cols = ['#e5484d', '#f08c2e', '#e9c46a', '#3fb950', '#3fd6c0', '#2f7fd1', '#8a5cf0', '#e25ac0'];
      for (var i = 0; i < n; i++) {
        var x = cx - (n - 1) * 9.5 + i * 19;
        s += rect(x - 7.5, cy - 8, 15, 15, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1', 2) + circ(x, cy - 0.5, 4.5, 'fill:' + cols[i]);
      }
      return s;
    },
    sdcard: function (cx, cy) {
      return rect(cx - 22, cy - 20, 44, 32, METAL, 2) + path('M' + (cx - 13) + ' ' + (cy - 22) + ' h26 v26 h-21 l-5 -5 z', 'fill:#16191c') + st(cx, cy - 5, 'SD', '#cfd6da', 8);
    },
    gps: function (cx, cy) {
      return rect(cx - 22, cy - 18, 44, 30, METAL, 2) + st(cx, cy - 5, 'u-blox', '#23282c') + st(cx, cy + 5, 'NEO-6M', '#23282c');
    },
    relay: function (cx, cy) {
      var s = rect(cx - 33, cy - 21, 40, 38, 'fill:#2f7fe0;stroke:#174a9c;' + SM, 3) + st(cx - 13, cy - 4, 'SONGLE', '#fff', 6) + st(cx - 13, cy + 6, '5VDC', '#fff', 6) +
        rect(cx + 12, cy - 20, 20, 36, 'fill:#3d8cf0;stroke:#174a9c;' + SM, 2);
      [0, 1, 2].forEach(function (i) { s += circ(cx + 22, cy - 13 + i * 11, 3.6, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1'); });
      return s;
    },
    motor: function (cx, cy) {
      return chip(cx - 12, cy - 18, 24, 16) + st(cx, cy + 10, 'DRV8833') + smd(cx - 30, cy - 8) + smd(cx + 23, cy - 8);
    },
    stepper: function (cx, cy, w) {
      var s = chip(cx - w / 2 + 12, cy - 14, 44, 13) + st(cx - w / 2 + 34, cy - 4.5, 'ULN2003', '#cfd6da', 6), mx = cx + w / 2 - 34;
      for (var i = 0; i < 4; i++) s += led(cx - w / 2 + 17 + i * 11, cy + 10);
      return s + rect(mx - 30, cy - 4, 60, 8, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 4) + circ(mx, cy, 20, METAL) +
        circ(mx, cy - 8, 5, 'fill:#e9eef2;stroke:#7b858c;stroke-width:1') + rect(mx - 1.5, cy - 11, 3, 6, 'fill:' + GOLD, 0.5);
    },
    joystick: function (cx, cy) {
      return rect(cx - 21, cy - 21, 42, 42, METAL, 4) + circ(cx, cy, 23, 'fill:#16191c;stroke:#3a4247;' + SM) + circ(cx, cy, 17, 'fill:#23282c') +
        circ(cx, cy, 11, 'fill:#1b1f22;stroke:#3a4247;stroke-width:1');
    },
    encoder: function (cx, cy) {
      return rect(cx - 17, cy - 19, 34, 34, METAL, 3) + circ(cx, cy - 2, 13, 'fill:#aab2b8;stroke:#7b858c;' + SM) +
        circ(cx, cy - 2, 8.5, 'fill:#e9eef2;stroke:#7b858c;' + SM) + path('M' + (cx - 6) + ' ' + (cy + 3) + ' h12', 'stroke:#7b858c;stroke-width:1.6');
    },
    touch: function (cx, cy) {
      var s = '';
      [19, 14, 9, 4].forEach(function (r) { s += circ(cx, cy - 1, r, 'fill:none;stroke:#f4f4f4;stroke-width:2'); });
      return s;
    },
    irrecv: function (cx, cy) {
      return legs3(cx, cy + 6, 6, 8) + rect(cx - 13, cy - 20, 26, 26, 'fill:#23282c;stroke:#596168;' + SM, 2.5) + circ(cx, cy - 9, 7.5, 'fill:#0c0e10;stroke:#3a4247;' + SM) + led(cx - 26, cy + 12);
    },
    soil: function (cx, cy, w) {
      return rect(cx - 12, cy - 20, 24, 9, 'fill:#f4f4f4;stroke:#b9c0c5;stroke-width:1', 1.5) + chip(cx - 8, cy - 6, 16, 8) +
        path('M' + (cx - w / 2 + 8) + ' ' + (cy + 8) + ' h' + (w - 16), 'stroke:#f4f4f4;stroke-width:1.5') + st(cx, cy + 19, 'Soil v1.2');
    },
    sound: function (cx, cy) {
      return circ(cx - 20, cy - 4, 13, METAL) + circ(cx - 20, cy - 4, 8.5, 'fill:#16191c') + trim(cx + 2, cy - 18) + chip(cx + 18, cy - 2, 13, 9) +
        led(cx + 4, cy + 12) + led(cx + 12, cy + 12, '#7dff9e');
    },
    mq2: function (cx, cy) {
      return circ(cx - 9, cy - 1, 21, 'fill:#c9a36a;stroke:#8a6a3a;' + SM) + mesh(cx - 9, cy - 1, 16.5) + trim(cx + 17, cy - 10);
    },
    tilt: function (cx, cy) {
      return path('M' + (cx - 18) + ' ' + (cy + 4) + ' v9 M' + (cx + 18) + ' ' + (cy + 4) + ' v9', 'stroke:#9aa3a8;stroke-width:1.6') +
        rect(cx - 22, cy - 12, 44, 16, 'fill:#3fa7d6;stroke:#2478a3;' + SM, 5) + rect(cx + 13, cy - 12, 9, 16, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 2) +
        circ(cx - 9, cy - 4, 5, 'fill:#cfd6da;opacity:.85');
    },
    hall: function (cx, cy) {
      return legs3(cx, cy + 2, 5, 10) + path('M' + (cx - 10) + ' ' + (cy + 2) + ' V' + (cy - 12) + ' l3 -3 h14 l3 3 V' + (cy + 2) + ' Z', 'fill:#2a3136;stroke:#596168;stroke-width:1') +
        st(cx, cy - 3, '3144', '#cfd6da', 6) + led(cx + 24, cy + 10);
    },
    lcd1602: function (cx, cy, w) {
      return rect(cx - w / 2 + 7, cy - 22, w - 14, 42, 'fill:#16191c', 2) + rect(cx - w / 2 + 13, cy - 17, w - 26, 32, 'fill:#1f4fd1;stroke:#0b2a7a;stroke-width:1', 1.5) +
        st(cx, cy - 4, 'Hello Pico 2', '#fff', 8) + st(cx, cy + 9, 'Line two', '#fff', 8);
    },
    tm1637: function (cx, cy, w) {
      return rect(cx - w / 2 + 7, cy - 20, w - 14, 34, 'fill:#16191c;stroke:#3a4247;stroke-width:1', 2.5) + st(cx, cy + 6, '12:34', '#ff4d4d', 20);
    },
    max7219: function (cx, cy) {
      var s = rect(cx - 23, cy - 23, 46, 46, 'fill:#16191c;stroke:#3a4247;stroke-width:1', 2.5), face = ['00111100', '01000010', '10100101', '10000001', '10100101', '10011001', '01000010', '00111100'];
      for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) s += circ(cx - 19.25 + c * 5.5, cy - 19.25 + r * 5.5, 2, face[r].charAt(c) === '1' ? 'fill:#ff4d4d' : 'fill:#e9eef2;opacity:.28');
      return s;
    },
    ds3231: function (cx, cy) {
      return circ(cx + 12, cy - 2, 19, 'fill:#16191c') + circ(cx + 12, cy - 2, 16, METAL) + st(cx + 12, cy + 1, 'CR2032', '#23282c', 6) + chip(cx - 32, cy - 12, 18, 11) + chip(cx - 29, cy + 5, 12, 7);
    },
    rc522: function (cx, cy, w) {
      var s = '', x0 = cx - w / 2 + 10;
      for (var i = 0; i < 3; i++) s += rect(x0 + i * 4, cy - 21 + i * 4, 96 - i * 8, 42 - i * 8, 'fill:none;stroke:#7fb2ee;stroke-width:1.5', 5);
      return s + st(x0 + 48, cy + 3, 'RFID-RC522') + chip(cx + w / 2 - 50, cy - 12, 18, 18) + rect(cx + w / 2 - 26, cy - 12, 9, 18, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 4);
    },
    hc05: function (cx, cy) {
      return rect(cx - 34, cy - 22, 68, 40, 'fill:' + GREEN + ';stroke:#0f5132;stroke-width:1', 2) +
        path('M' + (cx - 30) + ' ' + (cy - 8) + ' v-9 h5 v9 h5 v-9 h5 v9 h5 v-9', 'fill:none;stroke:' + GOLD + ';stroke-width:1.6') +
        rect(cx - 6, cy - 18, 36, 32, METAL, 2) + st(cx + 12, cy + 1, 'HC-05', '#23282c') + led(cx - 24, cy + 8);
    },
    nrf24: function (cx, cy, w) {
      var x0 = cx - w / 2 + 12, d = 'M' + x0 + ' ' + (cy - 18);
      for (var i = 0; i < 4; i++) d += ' v12 h7 v-12 h7';
      return path(d + ' v30', 'fill:none;stroke:' + GOLD + ';stroke-width:1.8') + chip(cx - 8, cy - 14, 20, 18) + rect(cx + 24, cy - 12, 22, 10, 'fill:#cfd6da;stroke:#7b858c;stroke-width:1', 5) +
        st(cx + 30, cy + 12, 'nRF24L01+');
    },
    keypad: function (cx, cy) {
      var keys = '123A456B789C*0#D', s = rect(cx - 27, cy - 24, 54, 48, 'fill:#16191c;stroke:#f4f4f4;' + SM, 3);
      for (var i = 0; i < 16; i++) {
        var k = keys.charAt(i), kx = cx - 24 + (i % 4) * 12.3, ky = cy - 21.5 + Math.floor(i / 4) * 11;
        s += rect(kx, ky, 10.5, 9, 'fill:' + (i % 4 === 3 || k === '*' || k === '#' ? '#d93a3f' : '#2f6fd6'), 1.5) + st(kx + 5.25, ky + 7, k, '#fff', 6.5);
      }
      return s;
    },
    servo: function (cx, cy) {
      return rect(cx - 30, cy - 9, 34, 20, 'fill:#f4f4f4', 2) + st(cx - 13, cy + 5, 'SG90', '#23282c', 8) +
        circ(cx + 22, cy, 10, 'fill:#f4f4f4;stroke:#9aa3a8;' + SM) + rect(cx + 18.5, cy - 24, 7, 34, 'fill:#f4f4f4;stroke:#9aa3a8;' + SM, 3.5) + circ(cx + 22, cy, 2.4, 'fill:#9aa3a8');
    }
  };
  if (P.pcbColor) P.pcbColor.keypad = '#2a3136';
})(window.PICO);
