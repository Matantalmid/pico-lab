/* Extra explanatory figures: the install steps on the Get started page,
   a "what connects to what" sketch for each interface, and a few drawings
   for ideas beginners find hard (same column, voltage divider). */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;
  var B = function (he, en) { return { he: he, en: en }; };

  function svg(w, h, body, label) {
    return '<svg class="art" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label || '') + '">' + body + '</svg>';
  }
  function tx(x, y, s, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(s) + '</text>';
  }
  function badge(x, y, n) {
    return '<circle cx="' + x + '" cy="' + y + '" r="11" style="fill:var(--accent)"/>' +
      '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" style="fill:var(--on-accent);font:700 12px var(--mono)">' + n + '</text>';
  }
  var RED = '#e5484d', GND = '#55606a', SIG = ['#e6b422', '#2fa84f', '#2f7fd1', '#f08c2e', '#8e5bd6'];

  /* A small Pico, USB to the left, used in the install drawings. */
  function pico(x, y) {
    var s = '<rect x="' + x + '" y="' + y + '" width="210" height="74" rx="8" class="bb-pico"/>' +
      '<rect x="' + (x - 12) + '" y="' + (y + 24) + '" width="26" height="26" rx="3" style="fill:#c9ced3;stroke:#8d9399"/>' +
      '<rect x="' + (x + 150) + '" y="' + (y + 22) + '" width="30" height="30" rx="4" transform="rotate(45 ' + (x + 165) + ' ' + (y + 37) + ')" style="fill:#1b1f22"/>';
    for (var i = 0; i < 20; i++) s += '<circle class="bb-pin" cx="' + (x + 12 + i * 9.8) + '" cy="' + (y + 7) + '" r="2.4"/><circle class="bb-pin" cx="' + (x + 12 + i * 9.8) + '" cy="' + (y + 67) + '" r="2.4"/>';
    return s;
  }

  /* Pico on the left, parts on the right, one labelled line per connection. */
  function link(devs, label) {
    var pins = [];
    devs.forEach(function (d) { d.rows.forEach(function (r) { if (pins.indexOf(r[1]) < 0) pins.push(r[1]); }); });
    var pinY = {}, s = '';
    pins.forEach(function (p, i) { pinY[p] = 46 + i * 30; });
    var picoH = Math.max(pins.length * 30 + 30, 90), y = 20, maxY = 20 + picoH, sigN = 0, colOf = {};
    pins.forEach(function (p) {
      colOf[p] = /^(3V3|VBUS|VSYS)/.test(p) ? RED : /GND/.test(p) ? GND : SIG[sigN++ % SIG.length];
    });
    var lines = '', boxes = '';
    devs.forEach(function (d) {
      var h = 30 + d.rows.length * 24 + 6;
      boxes += '<rect x="380" y="' + y + '" width="150" height="' + h + '" rx="8" class="box"/>' + tx(455, y + 20, T(d.name), 'cd-name');
      d.rows.forEach(function (r, j) {
        var ry = y + 40 + j * 24, p = r[1], trunk = 196 + pins.indexOf(p) * 16, py = pinY[p];
        boxes += tx(390, ry + 4, T(r[0]), 'cd-pin', 'start');
        lines += '<path d="M150 ' + py + ' H' + trunk + ' V' + ry + ' H380" class="wv-wire" style="stroke:' + colOf[p] + ';stroke-width:2.6;stroke-linejoin:round"/>' +
          '<circle cx="' + trunk + '" cy="' + py + '" r="3" style="fill:' + colOf[p] + '"/>';
      });
      y += h + 14;
    });
    maxY = Math.max(maxY, y);
    s += '<rect x="20" y="20" width="130" height="' + picoH + '" rx="8" class="bb-pico"/>' + tx(62, 20 + picoH / 2 + 4, 'Pico 2', 'bb-pico-t');
    pins.forEach(function (p) {
      s += '<circle class="bb-pin used" cx="142" cy="' + pinY[p] + '" r="4"/>' + tx(134, pinY[p] + 3, p, 'cd-plab', 'end');
    });
    return svg(550, maxY + 6, s + lines + boxes, label);
  }

  var F = {
    bootsel: function () {
      return svg(520, 150,
        pico(210, 40) +
        '<rect x="262" y="62" width="30" height="30" rx="6" style="fill:#f4f4f4;stroke:var(--accent);stroke-width:3"/>' +
        '<circle cx="277" cy="77" r="7" style="fill:#c9ced3"/>' + tx(277, 108, 'BOOTSEL', 'bb-pico-t') +
        '<path d="M277 22 v30 m-7 -9 l7 9 l7 -9" class="s arrow" style="stroke:var(--accent)"/>' + badge(277, 14, 1) +
        '<path d="M20 77 H150" style="stroke:#55606a;stroke-width:7;stroke-linecap:round"/>' +
        '<rect x="150" y="66" width="34" height="22" rx="3" style="fill:#c9ced3;stroke:#8d9399"/>' +
        '<path d="M100 54 h54 m-9 -8 l9 8 l-9 8" class="s arrow" style="stroke:var(--accent)"/>' + badge(86, 54, 2) +
        tx(86, 108, T(B('כבל USB', 'USB cable'))) +
        tx(260, 142, T(B('1. החזיקו את הכפתור לחוץ   2. חברו את הכבל   3. שחררו', '1. Hold the button down   2. Plug in the cable   3. Release'))), 'BOOTSEL');
    },
    drive: function () {
      return svg(520, 150,
        '<rect x="20" y="16" width="480" height="110" rx="10" class="box"/>' +
        '<rect x="20" y="16" width="480" height="24" rx="10" style="fill:var(--line)"/>' +
        tx(40, 33, T(B('המחשב', 'This computer')), '', 'start') +
        '<rect x="70" y="58" width="74" height="50" rx="6" style="fill:#f4f4f4;stroke:#9aa3a8;stroke-width:2"/>' +
        '<path d="M70 58 h52 l22 18 v32 h-74 z" style="fill:#fff;stroke:#9aa3a8;stroke-width:2"/>' + tx(107, 92, '.uf2', 'mono') +
        tx(107, 122, T(B('קובץ הקושחה', 'the firmware file'))) +
        '<path d="M170 82 h130 m-11 -9 l11 9 l-11 9" class="s arrow" style="stroke:var(--accent)"/>' +
        tx(236, 70, T(B('גררו', 'drag'))) +
        '<rect x="330" y="60" width="110" height="44" rx="6" style="fill:#3a4247"/>' +
        '<rect x="338" y="92" width="94" height="5" rx="2" style="fill:#6fe3ff"/>' + tx(385, 84, 'RP2350', 'onbody') +
        tx(385, 122, T(B('הכונן של הלוח', 'the board\'s drive'))), 'drag the file');
    },
    thonny: function () {
      return svg(520, 250,
        '<rect x="20" y="10" width="480" height="226" rx="10" class="box"/>' +
        '<rect x="20" y="10" width="480" height="24" rx="10" style="fill:var(--line)"/>' + tx(40, 27, 'Thonny', '', 'start') +
        '<rect x="20" y="34" width="480" height="30" style="fill:var(--surface-2)"/>' +
        '<circle cx="50" cy="49" r="10" style="fill:#3fb950"/><path d="M46 43 l10 6 l-10 6 z" style="fill:#fff"/>' +
        '<rect x="74" y="40" width="18" height="18" rx="3" style="fill:#e5484d"/>' +
        badge(50, 76, 1) + tx(70, 80, T(B('Run: מריץ את התוכנית', 'Run: runs the program')), '', 'start') +
        tx(250, 80, T(B('Stop: עוצר אותה', 'Stop: stops it')), '', 'start') +
        '<rect x="32" y="92" width="456" height="62" rx="4" style="fill:var(--code-bg)"/>' +
        '<text x="42" y="112" style="fill:#ff8fab;font:12px var(--mono)" text-anchor="start">from machine import Pin</text>' +
        '<text x="42" y="130" style="fill:var(--code-ink);font:12px var(--mono)" text-anchor="start">led = Pin("LED", Pin.OUT)</text>' +
        badge(470, 108, 2) + tx(455, 146, T(B('כתבו כאן את הקוד', 'write your code here')), 'onbody', 'end') +
        '<rect x="32" y="162" width="456" height="46" rx="4" style="fill:var(--code-bg)"/>' +
        '<text x="42" y="182" style="fill:var(--code-ink);font:12px var(--mono)" text-anchor="start">&gt;&gt;&gt; print("hello")</text>' +
        '<text x="42" y="198" style="fill:#8fd3ff;font:12px var(--mono)" text-anchor="start">hello</text>' +
        badge(470, 178, 3) + tx(455, 200, T(B('Shell: כאן הלוח עונה', 'Shell: the board answers here')), 'onbody', 'end') +
        '<rect x="300" y="214" width="190" height="18" rx="4" style="fill:var(--accent-soft);stroke:var(--accent)"/>' +
        tx(395, 227, 'MicroPython (Raspberry Pi Pico)', 'mono') + badge(286, 223, 4), 'Thonny window');
    },
    samecol: function () {
      function holes(x0) {
        var s = '';
        for (var c = 0; c < 5; c++) for (var r = 0; r < 5; r++) s += '<rect class="bb-hole" x="' + (x0 + c * 22) + '" y="' + (40 + r * 18) + '" width="6" height="6" rx="1.5"/>';
        return '<rect class="bb-base" x="' + (x0 - 16) + '" y="26" width="126" height="106" rx="8"/>' + s;
      }
      var l1 = 60, l2 = 300;
      return svg(520, 180,
        holes(l1) + '<rect x="' + (l1 + 41) + '" y="34" width="12" height="90" rx="5" style="fill:var(--accent);opacity:.18"/>' +
        '<line class="wv-leg" x1="' + (l1 + 47) + '" y1="61" x2="' + (l1 + 47) + '" y2="97"/>' +
        '<circle cx="' + (l1 + 47) + '" cy="79" r="11" style="fill:#e5484d;stroke:#b3262b;stroke-width:1.5"/>' +
        '<text x="' + (l1 + 47) + '" y="160" text-anchor="middle" style="fill:#e5484d;font:700 14px var(--font)">✗ ' + esc(T(B('שתי הרגליים באותו טור', 'both legs in one column'))) + '</text>' +
        holes(l2) +
        '<line class="wv-leg" x1="' + (l2 + 47) + '" y1="79" x2="' + (l2 + 69) + '" y2="79"/>' +
        '<circle cx="' + (l2 + 58) + '" cy="68" r="11" style="fill:#e5484d;stroke:#b3262b;stroke-width:1.5"/>' +
        '<circle cx="' + (l2 + 47) + '" cy="79" r="3" class="wv-end"/><circle cx="' + (l2 + 69) + '" cy="79" r="3" class="wv-end"/>' +
        '<text x="' + (l2 + 47) + '" y="160" text-anchor="middle" style="fill:#2a8f52;font:700 14px var(--font)">✓ ' + esc(T(B('כל רגל בטור משלה', 'each leg in its own column'))) + '</text>',
        'same column or not');
    },
    divider: function () {
      return svg(520, 200,
        '<rect x="30" y="20" width="110" height="34" rx="8" class="box hi"/>' + tx(85, 42, T(B('מתח גבוה', 'higher voltage'))) +
        '<path d="M140 37 H180" class="s"/>' +
        '<rect x="180" y="24" width="70" height="26" rx="8" class="wv-res"/>' + tx(215, 16, T(B('נגד עליון', 'upper resistor'))) +
        '<path d="M250 37 H300 V110" class="s"/>' +
        '<circle cx="300" cy="74" r="6" style="fill:var(--accent)"/>' +
        '<path d="M300 74 H400" class="s" style="stroke:var(--accent);stroke-width:3"/>' +
        '<rect x="400" y="56" width="100" height="36" rx="8" class="bb-pico"/>' + tx(450, 79, T(B('פין של ה-Pico', 'Pico pin')), 'bb-pico-t') +
        tx(350, 64, T(B('נקודת האמצע', 'the midpoint'))) +
        '<rect x="287" y="110" width="26" height="50" rx="8" class="wv-res"/>' + tx(360, 140, T(B('נגד תחתון', 'lower resistor'))) +
        '<path d="M300 160 V180 M282 180 H318 M288 187 H312 M294 194 H306" class="s"/>' + tx(240, 190, T(B('אדמה', 'ground'))) +
        tx(130, 110, T(B('בנקודת האמצע יש רק', 'the midpoint carries only'))) + tx(130, 128, T(B('חלק מהמתח המלא', 'part of the full voltage'))), 'voltage divider');
    },
    'if-gpio': function () {
      return link([
        { name: B('לד, עם נגד', 'LED, with resistor'), rows: [[B('רגל ארוכה', 'long leg'), 'GP15'], [B('רגל קצרה', 'short leg'), 'GND']] },
        { name: B('כפתור', 'Button'), rows: [[B('רגל אחת', 'one leg'), 'GP14'], [B('רגל שנייה', 'other leg'), 'GND']] }
      ], 'GPIO');
    },
    'if-adc': function () {
      return link([{ name: B('פוטנציומטר', 'Potentiometer'), rows: [[B('קצה', 'end'), '3V3'], [B('אמצע', 'middle'), 'GP26'], [B('קצה שני', 'other end'), 'AGND']] }], 'ADC');
    },
    'if-pwm': function () {
      return link([
        { name: B('לד, עם נגד', 'LED, with resistor'), rows: [[B('רגל ארוכה', 'long leg'), 'GP15'], [B('רגל קצרה', 'short leg'), 'GND']] },
        { name: B('סרבו', 'Servo'), rows: [[B('אות', 'signal'), 'GP10'], [B('הזנה', 'power'), 'VBUS'], [B('אדמה', 'ground'), 'GND']] }
      ], 'PWM');
    },
    'if-i2c': function () {
      var rows = function () { return [['VCC', '3V3'], ['GND', 'GND'], ['SDA', 'GP4'], ['SCL', 'GP5']]; };
      return link([{ name: B('מסך', 'Display'), rows: rows() }, { name: B('חיישן', 'Sensor'), rows: rows() }], 'I2C');
    },
    'if-spi': function () {
      return link([{ name: B('כרטיס זיכרון', 'Memory card'), rows: [['VCC', '3V3'], ['GND', 'GND'], ['SCK', 'GP18'], ['MOSI', 'GP19'], ['MISO', 'GP16'], ['CS', 'GP17']] }], 'SPI');
    },
    'if-uart': function () {
      return link([{ name: B('מקלט GPS', 'GPS receiver'), rows: [['VCC', '3V3'], ['GND', 'GND'], ['RX', 'GP8'], ['TX', 'GP9']] }], 'UART');
    },
    'if-pio': function () {
      return link([{ name: B('פס לדים', 'LED strip'), rows: [['5V', 'VBUS'], ['GND', 'GND'], ['DIN', 'GP0']] }], 'PIO');
    },
    'if-power': function () {
      return link([
        { name: B('רכיב של 5V', 'A 5 V part'), rows: [['VCC', 'VBUS'], ['GND', 'GND']] },
        { name: B('רכיב של 3.3V', 'A 3.3 V part'), rows: [['VCC', '3V3'], ['GND', 'GND']] }
      ], 'power');
    }
  };

  var old = P.fig;
  P.fig = function (name) { return F[name] ? F[name]() : old(name); };
  P.hasFig = function (name) { return !!F[name] || !!old(name); };
})(window.PICO);
