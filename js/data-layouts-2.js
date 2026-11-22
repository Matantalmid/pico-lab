/* Breadboard layouts, part 2. Loaded after autolayout.js.
   1. Placement templates for the parts of data-components-5.js, and the
      breadboard picture of each of those parts.
   2. The pictures of lessons E1 to G4. Each is built by P.autoLayout from
      the parts of the lesson and the pins its wiring table uses; `map` says
      which part pin(s) each row of that table talks about, so that
      P.checkLayout can prove the picture matches the table. */
(function (P) {
  'use strict';
  var TPL = P.TPL;

  /* ---------------- templates for the new parts ---------------- */
  var NEW = {
    mosfet: { mod: ['SIG', 'VCC', 'GND'], con: { SIG: 0, GND: 'gnd' } },
    pcf8574: { mod: ['VCC', 'GND', 'SDA', 'SCL'], con: { VCC: '3v3', GND: 'gnd', SDA: 0, SCL: 1 } },
    ads1115: { mod: ['VDD', 'GND', 'SCL', 'SDA', 'ADDR', 'ALRT', 'A0', 'A1', 'A2', 'A3'], con: { VDD: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    ina219: { mod: ['VCC', 'GND', 'SCL', 'SDA'], con: { VCC: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    aht20: { mod: ['VIN', 'GND', 'SCL', 'SDA'], con: { VIN: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    hx711: { mod: ['GND', 'DT', 'SCK', 'VCC'], con: { GND: 'gnd', DT: 0, SCK: 1, VCC: '3v3' } },
    pca9685: { off: 'top', pins: ['GND', 'OE', 'SCL', 'SDA', 'VCC', 'V+'], con: { GND: 'gnd', SCL: 1, SDA: 0, VCC: '3v3', 'V+': '5v' } },
    max6675: { mod: ['GND', 'VCC', 'SCK', 'CS', 'SO'], con: { GND: 'gnd', VCC: '3v3', SCK: 0, CS: 1, SO: 2 } }
  };
  Object.keys(NEW).forEach(function (k) { if (!TPL[k]) TPL[k] = NEW[k]; });

  /* the same step autolayout.js does for the parts that were loaded before it */
  P.components.forEach(function (comp) {
    if (P.layouts[comp.id] || !NEW[comp.id]) return;
    var tpl = TPL[comp.id], names = tpl.mod || tpl.pins, pins = [];
    comp.wiring.forEach(function (r) {
      var con = typeof r.part === 'string' ? tpl.con[r.part] : null;
      if (typeof con === 'number' && /^GP\d+$/.test(r.to)) pins[con] = +r.to.slice(2);
    });
    var out = P.autoLayout([{ kind: comp.id, id: comp.id, pins: pins }]);
    out.layout.map = comp.wiring.map(function (r) {
      return typeof r.part === 'string' && names.indexOf(r.part) >= 0 ? comp.id + '.' + r.part : [];
    });
    P.layouts[comp.id] = out.layout;
  });

  /* ---------------- lessons ---------------- */
  function lesson(id, instances, map) {
    var out = P.autoLayout(instances);
    out.layout.map = map;
    P.layouts['L:' + id] = out.layout;
  }
  function I(kind, id, pins) { return { kind: kind, id: id, pins: pins }; }

  /* E1 is drawn by hand further down, next to the relay's own page: it shows
     the separate circuit on the relay's screw terminals. */

  /* E2 and E3 are drawn by hand further down, with their motors. */

  lesson('E4', [I('joystick', 'joy', [26, 27, 22]), I('servo', 's1', [10]), I('servo', 's2', [11])],
    ['joy.GND', 'joy.+5V', 'joy.VRx', 'joy.VRy', 'joy.SW', 's1.SIG', 's2.SIG', ['s1.5V', 's2.5V'], ['s1.GND', 's2.GND']]);

  lesson('F1', [I('rgb', 'rgb', [11, 12, 13]), I('pot', 'pot', [26])],
    ['rgb.R', 'rgb.G', 'rgb.B', 'rgb.−', 'pot.1', 'pot.2', 'pot.3']);

  lesson('F2', [I('neopixel', 'strip', [0]), I('button', 'btn', [14])],
    ['strip.5V', 'strip.DIN', 'strip.GND', 'btn.1', 'btn.2']);

  lesson('F3', [I('keypad', 'keys', [2, 3, 4, 5, 6, 7, 8, 9]), I('led', 'led', [15]), I('buzzer', 'bz', [13])],
    ['keys.R1', 'keys.R2', 'keys.R3', 'keys.R4', 'keys.C1', 'keys.C2', 'keys.C3', 'keys.C4', 'led.a~', 'bz.p', ['led.k', 'bz.n']]);

  lesson('F4', [I('encoder', 'enc', [10, 11, 12]), I('oled', 'oled', [4, 5])],
    ['enc.CLK', 'enc.DT', 'enc.SW', ['enc.+', 'oled.VCC'], ['enc.GND', 'oled.GND'], 'oled.SDA', 'oled.SCL']);

  lesson('G1', [I('ds3231', 'rtc', [4, 5]), I('tm1637', 'disp', [20, 21])],
    [['rtc.VCC', 'disp.VCC'], ['rtc.GND', 'disp.GND'], 'rtc.SDA', 'rtc.SCL', 'disp.CLK', 'disp.DIO']);

  P.layouts['L:G2'] = 'aht20';

  lesson('G3', [I('rc522', 'rfid', [18, 19, 16, 17, 22]), I('servo', 'servo', [10])],
    ['rfid.3.3V', 'rfid.GND', 'rfid.SCK', 'rfid.MOSI', 'rfid.MISO', 'rfid.SDA', 'rfid.RST', 'servo.SIG', 'servo.5V', 'servo.GND']);

  lesson('G4', [I('hc05', 'bt', [21, 20]), I('rgb', 'rgb', [11, 12, 13])],
    [['bt.VCC'], ['bt.GND', 'rgb.−'], 'bt.TXD', 'bt.RXD', 'rgb.R', 'rgb.G', 'rgb.B']);

  /* ---------------- track H (js/data-lessons-4.js) ----------------
     Drawn by hand, because these circuits have parts that connect to a module
     and not to the Pico: supplies, batteries, loads, a load cell, a probe.
     A module with screw terminals is drawn off the breadboard, with its
     terminals as extra pins. `map` covers only the rows of the wiring table. */
  function w(a, b, c) { return { t: 'wire', a: a, b: b, c: c }; }
  /* a label that follows the site language */
  function L(he, en) { return { toString: function () { return P.t({ he: he, en: en }); } }; }
  /* an outside part (not in the catalog): a plain box with named pins */
  function ext(id, x, pins, label) { return { t: 'off', kind: 'ext-' + id, id: id, x: x, pins: pins, side: 'bottom', label: label }; }
  function top(kind, id, x, pins) { return { t: 'off', kind: kind, id: id, x: x, pins: pins }; }
  function rails() { return [w('P36', 'tp', 'red'), w('P38', 'tn', 'black')]; }
  var TGND = 'GND ';   /* the ground screw terminal: a second GND on the same module */
  P.pcbColor = P.pcbColor || {};
  /* (the planner's boxes take these colours too: their kinds are ext-supply, ext-load, ...) */
  ['battery', 'supply', 'motor', 'cell', 'probe', 'load'].forEach(function (k) { P.pcbColor['ext-' + k] = '#4a545c'; });
  P.pcbColor['ext-strip'] = '#7a6a2e';
  P.pcbColor['ext-bulb'] = '#a8761a';

  /* H1: the 12 V supply and the LED strip on the MOSFET's screw terminals */
  P.layouts['L:H1'] = {
    parts: rails().concat([
      top('mosfet', 'sw', 40, ['SIG', 'VCC', 'GND', 'VIN', TGND, 'V+', 'V−']),
      w('sw.SIG', 'P27', 'orange'), w('sw.GND', 'tn38', 'black'),
      { t: 'pot', at: 'f24' }, w('j24', 'tp', 'red'), w('j25', 'P31', 'yellow'), w('j26', 'tn', 'black'),
      ext('supply', 39, ['+', '−'], L('ספק 12V', '12 V supply')),
      w('supply.+', 'sw.VIN', 'red'), w('supply.−', 'sw.' + TGND, 'black'),
      ext('strip', 47, ['+', '−'], L('פס לדים', 'LED strip')),
      w('sw.V+', 'strip.+', 'red'), w('sw.V−', 'strip.−', 'black')
    ]),
    map: ['sw.SIG', 'sw.GND', 'pot.1', 'pot.2', 'pot.3']
  };

  /* H2: four LEDs and a button on the expander */
  (function () {
    var PINS = ['VCC', 'GND', 'SDA', 'SCL', 'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];   /* row j, columns 27 to 38 */
    var parts = [
      { t: 'mod', kind: 'pcf8574', id: 'pcf', at: 'j27', pins: PINS },
      w('P36', 'tp', 'red'), w('P38', 'tn', 'black'),
      w('i27', 'tp', 'red'), w('i28', 'tn', 'black'), w('i29', 'P6', 'blue'), w('i30', 'P7', 'yellow'),
      w('tp52', 'bp52', 'red')
    ];
    /* each LED: + rail -> long leg, short leg -> resistor -> expander pin P0..P3 */
    ['red', 'yellow', 'green', 'blue'].forEach(function (color, k) {
      var x = 26 + k * 6;
      parts.push(
        { t: 'led', a: 'c' + x, k: 'c' + (x + 1), color: color, id: 'led' + (k + 1) },
        w('a' + x, 'bp', 'red'),
        { t: 'res', a: 'd' + (x + 1), b: 'd' + (x + 5), val: '330' },
        w('e' + (x + 5), 'i' + (31 + k), 'green'));
    });
    /* the button: P7 on one leg, ground on the other */
    parts.push({ t: 'button', col: 22 }, w('g22', 'h38', 'purple'), w('j24', 'tn', 'black'));
    P.layouts['L:H2'] = { parts: parts, map: ['pcf.VCC', 'pcf.GND', 'pcf.SDA', 'pcf.SCL'] };
  })();

  /* H3: the battery under test, between input A0 and ground */
  lesson('H3', [I('ads1115', 'ads', [4, 5]), I('oled', 'oled', [4, 5])],
    [['ads.VDD', 'oled.VCC'], ['ads.GND', 'oled.GND'], ['ads.SDA', 'oled.SDA'], ['ads.SCL', 'oled.SCL']]);
  (function () {
    var parts = P.layouts['L:H3'].parts;
    var ads = parts.filter(function (p) { return p.id === 'ads'; })[0];
    var col = +ads.at.slice(1) + ads.pins.indexOf('A0');
    parts.push(ext('battery', col, ['+', '−'], L('סוללה לבדיקה', 'Battery under test')),
      w('h' + col, 'battery.+', 'red'), w('battery.−', 'tn' + (col + 3), 'black'));
  })();

  /* H4: batteries -> current meter -> MOSFET -> motor */
  P.layouts['L:H4'] = {
    parts: rails().concat([
      top('ina219', 'ina', 30, ['VCC', 'GND', 'SCL', 'SDA', 'Vin+', 'Vin−']),
      w('ina.VCC', 'tp25', 'red'), w('ina.GND', 'tn27', 'black'), w('ina.SCL', 'P7', 'yellow'), w('ina.SDA', 'P6', 'blue'),
      top('mosfet', 'sw', 44, ['VIN', TGND, 'V+', 'V−', 'SIG', 'GND']),
      w('sw.SIG', 'P27', 'orange'), w('sw.GND', 'tn49', 'black'),
      ext('battery', 35, ['+', '−'], L('בית סוללות', 'Battery holder')),
      w('battery.+', 'ina.Vin+', 'red'), w('ina.Vin−', 'sw.VIN', 'red'), w('battery.−', 'sw.' + TGND, 'black'),
      ext('motor', 44, ['1', '2'], L('מנוע', 'Motor')),
      w('sw.V+', 'motor.1', 'purple'), w('sw.V−', 'motor.2', 'purple')
    ]),
    map: ['ina.VCC', ['ina.GND', 'sw.GND'], 'ina.SCL', 'ina.SDA', 'sw.SIG']
  };

  /* H5: the four wires of the load cell on the HX711 */
  P.layouts['L:H5'] = {
    parts: rails().concat([
      top('hx711', 'hx', 30, ['GND', 'DT', 'SCK', 'VCC', 'E+', 'E−', 'A−', 'A+']),
      w('hx.GND', 'tn24', 'black'), w('hx.DT', 'P26', 'green'), w('hx.SCK', 'P27', 'yellow'), w('hx.VCC', 'tp29', 'red'),
      { t: 'mod', kind: 'oled', id: 'oled', at: 'j42', pins: ['GND', 'VCC', 'SCL', 'SDA'] },
      w('i42', 'tn', 'black'), w('i43', 'tp', 'red'), w('i44', 'P7', 'yellow'), w('i45', 'P6', 'blue'),
      { t: 'button', col: 50 }, w('a50', 'P19', 'purple'), w('a52', 'bn', 'black'), w('P3', 'bn', 'black'),
      ext('cell', 34, ['E+', 'E−', 'A−', 'A+'], L('תא עומס', 'Load cell')),
      w('cell.E+', 'hx.E+', 'red'), w('cell.E−', 'hx.E−', 'black'), w('cell.A−', 'hx.A−', 'white'), w('cell.A+', 'hx.A+', 'green')
    ]),
    map: [['hx.GND', 'oled.GND'], 'hx.DT', 'hx.SCK', ['hx.VCC', 'oled.VCC'], 'oled.SDA', 'oled.SCL', 'btn.1', 'btn.2']
  };

  /* H6: three servos on the servo board */
  (function () {
    /* the outputs 0, 1 and 2 of the board, and one cable to each servo's plug */
    var parts = [
      { t: 'off', kind: 'pca9685', id: 'pca', x: 36, pins: ['GND', 'OE', 'SCL', 'SDA', 'VCC', 'V+', '0', '1', '2'] },
      w('P36', 'tp', 'red'), w('P38', 'tn', 'black'),
      w('pca.GND', 'tn', 'black'), w('pca.SCL', 'P7', 'yellow'), w('pca.SDA', 'P6', 'blue'), w('pca.VCC', 'tp', 'red'), w('pca.V+', 'P40', 'red')
    ];
    [0, 1, 2].forEach(function (n) {
      parts.push({ t: 'off', kind: 'servo', id: 'servo' + n, x: 33 + n * 8, pins: [String(n)], side: 'bottom' },
        w('pca.' + n, 'servo' + n + '.' + n, 'orange'));
    });
    P.layouts['L:H6'] = { parts: parts, map: ['pca.GND', 'pca.SCL', 'pca.SDA', 'pca.VCC', 'pca.V+'] };
  })();

  /* H7: the probe on the thermometer, and the battery and bulb on the relay */
  P.layouts['L:H7'] = {
    parts: rails().concat([
      top('max6675', 'tc', 30, ['GND', 'VCC', 'SCK', 'CS', 'SO', 'T+', 'T−']),
      w('tc.GND', 'tn24', 'black'), w('tc.VCC', 'tp26', 'red'), w('tc.SCK', 'P24', 'yellow'), w('tc.CS', 'P22', 'orange'), w('tc.SO', 'P21', 'green'),
      top('relay', 'relay', 46, ['VCC', 'GND', 'IN', 'COM', 'NO']),
      w('relay.VCC', 'P40', 'red'), w('relay.GND', 'tn44', 'black'), w('relay.IN', 'P27', 'blue'),
      ext('probe', 35, ['+', '−'], L('חיישן החום', 'Heat probe')),
      w('tc.T+', 'probe.+', 'red'), w('tc.T−', 'probe.−', 'white'),
      ext('battery', 43, ['+', '−'], L('בית סוללות', 'Battery holder')),
      ext('bulb', 51, ['2', '1'], L('נורה', 'Bulb')),
      w('battery.+', 'relay.COM', 'red'), w('relay.NO', 'bulb.1', 'purple'), w('bulb.2', 'battery.−', 'black')
    ]),
    map: [['tc.GND', 'relay.GND'], 'tc.VCC', 'tc.SCK', 'tc.CS', 'tc.SO', 'relay.VCC', 'relay.IN']
  };

  /* ---------------- lessons H9 to H12 (js/data-lessons-7.js) ---------------- */

  /* H9: the humidity sensor on the breadboard, and batteries and a fan on the MOSFET */
  P.layouts['L:H9'] = {
    parts: rails().concat([
      { t: 'mod', kind: 'aht20', id: 'aht', at: 'j24', pins: ['VIN', 'GND', 'SCL', 'SDA'] },
      w('i24', 'tp', 'red'), w('i25', 'tn', 'black'), w('i26', 'P7', 'yellow'), w('i27', 'P6', 'blue'),
      top('mosfet', 'sw', 44, ['SIG', 'VCC', 'GND', 'VIN', TGND, 'V+', 'V−']),
      w('sw.SIG', 'P27', 'orange'), w('sw.GND', 'tn40', 'black'),
      ext('battery', 41, ['+', '−'], L('בית סוללות', 'Battery holder')),
      w('battery.+', 'sw.VIN', 'red'), w('battery.−', 'sw.' + TGND, 'black'),
      ext('motor', 50, ['+', '−'], L('מאוורר', 'Fan')),
      w('sw.V+', 'motor.+', 'red'), w('sw.V−', 'motor.−', 'black')
    ]),
    map: ['aht.VIN', ['aht.GND', 'sw.GND'], 'aht.SCL', 'aht.SDA', 'sw.SIG']
  };

  /* H10: four buttons on P0 to P3 of the expander, and its INT pin to the Pico */
  (function () {
    var PINS = ['VCC', 'GND', 'SDA', 'SCL', 'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'INT'];   /* row j, columns 27 to 39 */
    var parts = [
      { t: 'mod', kind: 'pcf8574', id: 'pcf', at: 'j27', pins: PINS },
      w('P36', 'tp', 'red'), w('P38', 'tn', 'black'), w('P3', 'bn', 'black'),
      w('i27', 'tp', 'red'), w('i28', 'tn', 'black'), w('i29', 'P6', 'blue'), w('i30', 'P7', 'yellow'),
      w('i39', 'P20', 'orange')
    ];
    [0, 1, 2, 3].forEach(function (k) {
      var col = 42 + k * 4;
      parts.push({ t: 'button', col: col, id: 'b' + (k + 1) },
        w('h' + (31 + k), 'a' + col, 'green'), w('a' + (col + 2), 'bn', 'black'));
    });
    P.layouts['L:H10'] = { parts: parts, map: ['pcf.VCC', 'pcf.GND', 'pcf.SDA', 'pcf.SCL', 'pcf.INT'] };
  })();

  /* H11: two knobs on A0 and A1 of the converter, two servos and their batteries on the servo board */
  (function () {
    var parts = rails().concat([
      { t: 'mod', kind: 'ads1115', id: 'ads', at: 'j22', pins: ['VDD', 'GND', 'SCL', 'SDA', 'ADDR', 'ALRT', 'A0', 'A1', 'A2', 'A3'] },
      w('i22', 'tp', 'red'), w('i23', 'tn', 'black'), w('i24', 'P7', 'yellow'), w('i25', 'P6', 'blue'),
      { t: 'pot', at: 'f34', id: 'pot1' }, w('j34', 'tp', 'red'), w('j35', 'h28', 'green'), w('j36', 'tn', 'black'),
      { t: 'pot', at: 'f39', id: 'pot2' }, w('j39', 'tp', 'red'), w('j40', 'g29', 'green'), w('j41', 'tn', 'black'),
      { t: 'off', kind: 'pca9685', id: 'pca', x: 51, pins: ['GND', 'SCL', 'SDA', 'VCC', 'V+', TGND, '0', '1'] },
      w('pca.GND', 'tn45', 'black'), w('pca.SCL', 'h24', 'yellow'), w('pca.SDA', 'h25', 'blue'), w('pca.VCC', 'tp47', 'red'),
      ext('battery', 43, ['+', '−'], L('בית סוללות', 'Battery holder')),
      w('battery.+', 'pca.V+', 'red'), w('battery.−', 'pca.' + TGND, 'black')
    ]);
    [0, 1].forEach(function (n) {
      parts.push({ t: 'off', kind: 'servo', id: 'servo' + n, x: 51 + n * 8, pins: [String(n)], side: 'bottom' },
        w('pca.' + n, 'servo' + n + '.' + n, 'orange'));
    });
    P.layouts['L:H11'] = { parts: parts, map: [['ads.VDD', 'pca.VCC'], ['ads.GND', 'pca.GND'], ['ads.SDA', 'pca.SDA'], ['ads.SCL', 'pca.SCL']] };
  })();

  /* H12: batteries -> current meter -> load, and the batteries' minus to ground */
  P.layouts['L:H12'] = {
    parts: rails().concat([
      w('P3', 'bn', 'black'),
      top('ina219', 'ina', 30, ['VCC', 'GND', 'SCL', 'SDA', 'Vin+', 'Vin−']),
      { t: 'mod', kind: 'oled', id: 'oled', at: 'j42', pins: ['GND', 'VCC', 'SCL', 'SDA'] },
      w('i42', 'tn', 'black'), w('i43', 'tp', 'red'), w('i44', 'P7', 'yellow'), w('i45', 'P6', 'blue'),
      w('ina.VCC', 'tp25', 'red'), w('ina.GND', 'tn27', 'black'), w('ina.SCL', 'h44', 'yellow'), w('ina.SDA', 'h45', 'blue'),
      ext('battery', 30, ['+', '−'], L('בית סוללות', 'Battery holder')),
      ext('load', 39, ['+', '−'], L('עומס', 'Load')),
      w('battery.+', 'ina.Vin+', 'red'), w('ina.Vin−', 'load.+', 'red'), w('load.−', 'battery.−', 'black'), w('battery.−', 'bn33', 'black')
    ]),
    map: [['ina.VCC', 'oled.VCC'], ['ina.GND', 'oled.GND'], ['ina.SDA', 'oled.SDA'], ['ina.SCL', 'oled.SCL']]
  };

  /* ---------------- catalog pages of the same parts ----------------
     These replace the automatic pictures made at the top of this file, so
     that each page also shows what its build steps connect to the module.
     Wires go straight to the Pico pins named in the part's wiring table.
     The planner still places these parts from their templates. */
  var LOAD = L('עומס', 'Load');

  P.layouts.mosfet = {
    parts: [
      top('mosfet', 'mosfet', 36, ['SIG', 'VCC', 'GND', 'VIN', TGND, 'V+', 'V−']),
      w('mosfet.SIG', 'P27', 'orange'), w('mosfet.GND', 'P28', 'black'),
      ext('supply', 36, ['+', '−'], L('ספק כוח', 'Power supply')),
      w('supply.+', 'mosfet.VIN', 'red'), w('supply.−', 'mosfet.' + TGND, 'black'),
      ext('load', 44, ['+', '−'], LOAD),
      w('mosfet.V+', 'load.+', 'red'), w('mosfet.V−', 'load.−', 'black')
    ],
    map: ['mosfet.SIG', 'mosfet.GND']
  };

  /* the LED on P0 and the button on P7, as in the steps of the page */
  P.layouts.pcf8574 = {
    parts: [
      { t: 'mod', kind: 'pcf8574', id: 'pcf8574', at: 'j27', pins: ['VCC', 'GND', 'SDA', 'SCL', 'P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'] },
      w('i27', 'P36', 'red'), w('i28', 'P8', 'black'), w('i29', 'P6', 'blue'), w('i30', 'P7', 'yellow'),
      w('P36', 'j41', 'red'), { t: 'led', a: 'g41', k: 'g42', color: 'red' }, { t: 'res', a: 'h42', b: 'h46', val: '330' }, w('i46', 'h31', 'green'),
      { t: 'button', col: 22 }, w('g22', 'h38', 'purple'), w('j24', 'P28', 'black')
    ],
    map: ['pcf8574.VCC', 'pcf8574.GND', 'pcf8574.SDA', 'pcf8574.SCL']
  };

  /* the potentiometer whose middle leg is measured on A0 */
  P.layouts.ads1115 = {
    parts: [
      { t: 'mod', kind: 'ads1115', id: 'ads1115', at: 'j24', pins: ['VDD', 'GND', 'SCL', 'SDA', 'ADDR', 'ALRT', 'A0', 'A1', 'A2', 'A3'] },
      w('i24', 'P36', 'red'), w('i25', 'P8', 'black'), w('i26', 'P7', 'yellow'), w('i27', 'P6', 'blue'),
      { t: 'pot', at: 'f38' }, w('j38', 'P36', 'red'), w('j39', 'h30', 'green'), w('j40', 'P33', 'black')
    ],
    map: ['ads1115.VDD', 'ads1115.GND', 'ads1115.SCL', 'ads1115.SDA']
  };

  /* in series with the measured circuit, and sharing its ground */
  P.layouts.ina219 = {
    parts: [
      top('ina219', 'ina219', 30, ['VCC', 'GND', 'SCL', 'SDA', 'Vin+', 'Vin−']),
      w('ina219.VCC', 'P36', 'red'), w('ina219.GND', 'P8', 'black'), w('ina219.SCL', 'P7', 'yellow'), w('ina219.SDA', 'P6', 'blue'),
      ext('supply', 30, ['+', '−'], L('ספק או סוללות', 'Supply or batteries')),
      ext('load', 38, ['−', '+'], LOAD),
      w('supply.+', 'ina219.Vin+', 'red'), w('ina219.Vin−', 'load.+', 'red'), w('load.−', 'supply.−', 'black'),
      w('supply.−', 'P13', 'black')
    ],
    map: ['ina219.VCC', 'ina219.GND', 'ina219.SCL', 'ina219.SDA']
  };

  P.layouts.hx711 = {
    parts: [
      top('hx711', 'hx711', 32, ['GND', 'DT', 'SCK', 'VCC', 'E+', 'E−', 'A−', 'A+']),
      w('hx711.GND', 'P28', 'black'), w('hx711.DT', 'P26', 'green'), w('hx711.SCK', 'P27', 'yellow'), w('hx711.VCC', 'P36', 'red'),
      ext('cell', 36, ['E+', 'E−', 'A−', 'A+'], L('תא עומס', 'Load cell')),
      w('cell.E+', 'hx711.E+', 'red'), w('cell.E−', 'hx711.E−', 'black'), w('cell.A−', 'hx711.A−', 'white'), w('cell.A+', 'hx711.A+', 'green')
    ],
    map: ['hx711.GND', 'hx711.DT', 'hx711.SCK', 'hx711.VCC']
  };

  /* one servo on output 0 */
  P.layouts.pca9685 = {
    parts: [
      top('pca9685', 'pca9685', 34, ['GND', 'OE', 'SCL', 'SDA', 'VCC', 'V+', '0']),
      w('pca9685.GND', 'P8', 'black'), w('pca9685.SCL', 'P7', 'yellow'), w('pca9685.SDA', 'P6', 'blue'), w('pca9685.VCC', 'P36', 'red'), w('pca9685.V+', 'P40', 'red'),
      { t: 'off', kind: 'servo', id: 'servo', x: 40, pins: ['0'], side: 'bottom' },
      w('pca9685.0', 'servo.0', 'orange')
    ],
    map: ['pca9685.GND', 'pca9685.SCL', 'pca9685.SDA', 'pca9685.VCC', 'pca9685.V+']
  };

  P.layouts.max6675 = {
    parts: [
      top('max6675', 'max6675', 30, ['GND', 'VCC', 'SCK', 'CS', 'SO', 'T+', 'T−']),
      w('max6675.GND', 'P23', 'black'), w('max6675.VCC', 'P36', 'red'), w('max6675.SCK', 'P24', 'yellow'), w('max6675.CS', 'P22', 'orange'), w('max6675.SO', 'P21', 'green'),
      ext('probe', 35, ['+', '−'], L('חיישן החום', 'Heat probe')),
      w('max6675.T+', 'probe.+', 'red'), w('max6675.T−', 'probe.−', 'white')
    ],
    map: ['max6675.GND', 'max6675.VCC', 'max6675.SCK', 'max6675.CS', 'max6675.SO']
  };

  /* the relay with a separate circuit on its screw terminals */
  var SUPPLY = L('סוללות או ספק', 'Batteries or supply');
  P.layouts.relay = {
    parts: [
      top('relay', 'relay', 34, ['VCC', 'GND', 'IN', 'COM', 'NO', 'NC']),
      w('relay.VCC', 'P40', 'red'), w('relay.GND', 'P28', 'black'), w('relay.IN', 'P27', 'yellow'),
      ext('supply', 34, ['+', '−'], SUPPLY),
      ext('load', 42, ['−', '+'], LOAD),
      w('supply.+', 'relay.COM', 'red'), w('relay.NO', 'load.+', 'purple'), w('load.−', 'supply.−', 'black')
    ],
    map: ['relay.VCC', 'relay.GND', 'relay.IN']
  };

  /* lesson E1: the same relay, a button, and the battery circuit it switches */
  P.layouts['L:E1'] = {
    parts: [
      w('P38', 'tn', 'black'), w('P3', 'bn', 'black'),
      top('relay', 'relay', 36, ['VCC', 'GND', 'IN', 'COM', 'NO', 'NC']),
      w('relay.VCC', 'P40', 'red'), w('relay.GND', 'tn33', 'black'), w('relay.IN', 'P27', 'yellow'),
      { t: 'button', col: 24, id: 'btn' }, w('a24', 'P19', 'green'), w('a26', 'bn', 'black'),
      ext('battery', 36, ['+', '−'], L('בית סוללות', 'Battery holder')),
      ext('bulb', 44, ['2', '1'], L('נורה או מנוע', 'Bulb or motor')),
      w('battery.+', 'relay.COM', 'red'), w('relay.NO', 'bulb.1', 'purple'), w('bulb.2', 'battery.−', 'black')
    ],
    map: ['relay.VCC', 'relay.GND', 'relay.IN', 'btn.1', 'btn.2']
  };

  /* lesson E2: the driver in the breadboard, the motor on its two outputs */
  P.layouts['L:E2'] = {
    parts: rails().concat([
      { t: 'mod', kind: 'motor', id: 'drv', at: 'j24', pins: ['IN1', 'IN2', 'VCC', 'GND', 'OUT1', 'OUT2'], label: L('דרייבר', 'Driver') },
      w('i24', 'P26', 'yellow'), w('i25', 'P27', 'green'), w('i26', 'P40', 'red'), w('i27', 'tn', 'black'),
      { t: 'pot', at: 'f33' }, w('j33', 'tp', 'red'), w('j34', 'P31', 'orange'), w('j35', 'tn', 'black'),
      ext('motor', 29, ['1', '2'], L('מנוע', 'Motor')),
      w('h28', 'motor.1', 'purple'), w('h29', 'motor.2', 'purple')
    ]),
    map: ['drv.IN1', 'drv.IN2', 'drv.VCC', 'drv.GND', 'pot.1', 'pot.2', 'pot.3']
  };

  /* lesson E3: the motor's own cable into the driver board, as one line */
  P.pcbColor['ext-stepmotor'] = '#4a545c';
  P.layouts['L:E3'] = {
    parts: [
      w('P38', 'tn', 'black'), w('P3', 'bn', 'black'),
      { t: 'off', kind: 'stepper', id: 'step', x: 34, pins: ['IN1', 'IN2', 'IN3', 'IN4', '+', '−', 'OUT'], label: L('לוח הדרייבר', 'Driver board') },
      w('step.IN1', 'P14', 'yellow'), w('step.IN2', 'P15', 'green'), w('step.IN3', 'P16', 'blue'), w('step.IN4', 'P17', 'orange'),
      w('step.+', 'P40', 'red'), w('step.−', 'tn37', 'black'),
      { t: 'button', col: 22, id: 'b1' }, w('a22', 'P19', 'purple'), w('a24', 'bn', 'black'),
      { t: 'button', col: 26, id: 'b2' }, w('a26', 'P20', 'purple'), w('a28', 'bn', 'black'),
      ext('stepmotor', 40, ['IN'], L('מנוע הצעד', 'Stepper motor')),
      w('step.OUT', 'stepmotor.IN', 'white')
    ],
    map: ['step.IN1', 'step.IN2', 'step.IN3', 'step.IN4', 'step.+', 'step.−', 'b1.1', 'b2.1', ['b1.2', 'b2.2']]
  };

  /* ---------------- the planner ----------------
     From here on (every layout above is already built) the modules with
     screw terminals are placed off the breadboard, with their terminals as
     extra pins, and P.autoLayout adds what hangs on those terminals: a
     supply and a load, a load cell, a probe. Only the planner calls
     P.autoLayout after this point. */
  TPL.mosfet = { off: 'top', pins: ['SIG', 'VCC', 'GND', 'VIN', TGND, 'V+', 'V−'], con: { SIG: 0, GND: 'gnd' } };
  TPL.relay = { off: 'top', pins: ['VCC', 'GND', 'IN', 'COM', 'NO', 'NC'], con: { VCC: '5v', GND: 'gnd', IN: 0 } };
  TPL.ina219 = { off: 'top', pins: ['VCC', 'GND', 'SCL', 'SDA', 'Vin+', 'Vin−'], con: { VCC: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } };
  TPL.hx711 = { off: 'top', pins: ['GND', 'DT', 'SCK', 'VCC', 'E+', 'E−', 'A−', 'A+'], con: { GND: 'gnd', DT: 0, SCK: 1, VCC: '3v3' } };
  TPL.max6675 = { off: 'top', pins: ['GND', 'VCC', 'SCK', 'CS', 'SO', 'T+', 'T−'], con: { GND: 'gnd', VCC: '3v3', SCK: 0, CS: 1, SO: 2 } };

  /* per module kind: the outside boxes [name, pins, label] and the wires.
     In a wire, 'M.x' is pin x of the module and 'tn' is the ground rail. */
  var SERIES = [['supply', ['+', '−'], SUPPLY], ['load', ['−', '+'], LOAD]];
  var OUTSIDE = {
    mosfet: { ext: [['supply', ['+', '−'], SUPPLY], ['load', ['+', '−'], LOAD]],
      wires: [['supply.+', 'M.VIN', 'red'], ['supply.−', 'M.' + TGND, 'black'], ['M.V+', 'load.+', 'red'], ['M.V−', 'load.−', 'black']] },
    relay: { ext: SERIES, wires: [['supply.+', 'M.COM', 'red'], ['M.NO', 'load.+', 'purple'], ['load.−', 'supply.−', 'black']] },
    ina219: { ext: SERIES, wires: [['supply.+', 'M.Vin+', 'red'], ['M.Vin−', 'load.+', 'red'], ['load.−', 'supply.−', 'black'], ['supply.−', 'tn', 'black']] },
    hx711: { ext: [['cell', ['E+', 'E−', 'A−', 'A+'], L('תא עומס', 'Load cell')]],
      wires: [['cell.E+', 'M.E+', 'red'], ['cell.E−', 'M.E−', 'black'], ['cell.A−', 'M.A−', 'white'], ['cell.A+', 'M.A+', 'green']] },
    max6675: { ext: [['probe', ['+', '−'], L('חיישן החום', 'Heat probe')]], wires: [['M.T+', 'probe.+', 'red'], ['M.T−', 'probe.−', 'white']] }
  };
  function halfWidth(n) { return Math.max(n * 26 + 16, 96) / 28 + 0.5; }   /* of an off-board box, in columns */

  /* The boards above a breadboard are drawn wider than the columns kept for
     them, so a wide off-board box can cover the edge of its neighbour. Boxes
     off the board are free to move: push each one clear of what is next to
     it. A module that sits in the holes stays where it is. */
  function spread(parts) {
    var GAP = 0.5, rows = {};
    parts.forEach(function (p) {
      var it = null, m;
      if (p.t === 'off' && p.side !== 'bottom') it = { p: p, b: p.board || 1, x: p.x, hw: Math.max(p.pins.length * 26 + 16, 96) / 28, free: true };
      else if (p.t === 'mod' && (m = /^(?:(\d+):)?[a-j](\d+)$/.exec(p.at))) {
        it = { p: p, b: +(m[1] || 1), x: +m[2] + (p.pins.length - 1) / 2, hw: Math.max((p.pins.length - 1) * 14 + 22, 78) / 28 };
      }
      if (it) (rows[it.b] || (rows[it.b] = [])).push(it);
    });
    Object.keys(rows).forEach(function (b) {
      var row = rows[b].sort(function (a, c) { return a.x - c.x; }), i, lim;
      for (i = row.length - 1; i >= 0; i--) {      /* away from the right neighbour */
        if (!row[i].free) continue;
        lim = (i < row.length - 1 ? row[i + 1].x - row[i + 1].hw - GAP : 64) - row[i].hw;
        if (row[i].x > lim) row[i].x = Math.max(lim, row[i].hw);
      }
      for (i = 0; i < row.length; i++) {           /* and then away from the left one */
        if (!row[i].free) continue;
        lim = (i ? row[i - 1].x + row[i - 1].hw + GAP : 0) + row[i].hw;
        if (row[i].x < lim) row[i].x = lim;
      }
      row.forEach(function (it) { if (it.free) it.p.x = it.x; });
    });
  }

  var baseAuto = P.autoLayout;
  P.autoLayout = function (instances, opts) {
    var out = baseAuto(instances, opts), parts = out.layout.parts, added = [];
    spread(parts);
    var taken = {};   /* board -> [[from, to]] of the boxes below the breadboard */
    function room(b) { return taken[b] || (taken[b] = []); }
    parts.forEach(function (p) { if (p.t === 'off' && p.side === 'bottom') room(p.board || 1).push([p.x - halfWidth(p.pins.length), p.x + halfWidth(p.pins.length)]); });
    parts.forEach(function (m) {
      var spec = m.t === 'off' && OUTSIDE[m.kind];
      if (!spec) return;
      var b = m.board || 1, q = b > 1 ? b + ':' : '';
      function pinX(name) { return m.x + (m.pins.indexOf(name) - (m.pins.length - 1) / 2) * 26 / 14; }
      function ref(r) { return r === 'tn' ? q + 'tn' + Math.round(m.x) : r.indexOf('M.') === 0 ? m.id + '.' + r.slice(2) : m.id + '-' + r; }
      spec.ext.forEach(function (e) {
        /* under the module pins it connects to, moved right until it is clear */
        var xs = [];
        spec.wires.forEach(function (wr) {
          var mine = wr[0].indexOf(e[0] + '.') === 0 ? wr[1] : wr[1].indexOf(e[0] + '.') === 0 ? wr[0] : null;
          if (mine && mine.indexOf('M.') === 0) xs.push(pinX(mine.slice(2)));
        });
        var x = Math.round(xs.length ? xs.reduce(function (s, v) { return s + v; }, 0) / xs.length : m.x), hw = halfWidth(e[1].length);
        var want = x, lo = Math.ceil(hw), hi = Math.floor(63 - hw);
        var fits = function (v) { return v >= lo && v <= hi && !room(b).some(function (t) { return v - hw < t[1] && v + hw > t[0]; }); };
        /* the nearest free place, right first, that stays on the drawing */
        for (var d = 0; d < 63; d++) {
          if (fits(want + d)) { x = want + d; break; }
          if (fits(want - d)) { x = want - d; break; }
        }
        room(b).push([x - hw, x + hw]);
        added.push({ t: 'off', kind: 'ext-' + e[0], id: m.id + '-' + e[0], x: x, pins: e[1], side: 'bottom', board: b, label: e[2] });
      });
      spec.wires.forEach(function (wr) { added.push(w(ref(wr[0]), ref(wr[1]), wr[2])); });
    });
    if (added.length) {
      out.layout.parts = parts.concat(added);
      P.checkLayout(out.layout, out.rows).forEach(function (e) { if (out.errors.indexOf(e) < 0) out.errors.push(e); });
    }
    return out;
  };
})(window.PICO);

/* Track R (data-lessons-5.js) uses the circuit of lesson A3. Track W has nothing to wire. */
(function (P) {
  ['R1', 'R2', 'R3'].forEach(function (id) { P.layouts['L:' + id] = 'L:A3'; });
})(window.PICO);

/* S4: the 74HC595 across the channel in columns 22 to 29, notch to the left, and eight LEDs to its right.
   Q1..Q7 come out on the bottom row (columns 22..28), so their LEDs sit on the bottom half, from Q7 on the
   left to Q1 on the right: the order a binary number is read in. Q0 comes out on the top row; its LED sits
   on the top half, after Q1. Each LED: output -> wire -> 330 Ω -> long leg, short leg -> ground rail.
   The output wires nest one inside the other (Q7's is the shortest), so none of them cross. */
(function (P) {
  function w(a, b, c, sag) { var o = { t: 'wire', a: a, b: b, c: c }; if (sag != null) o.sag = sag; return o; }
  var PINS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'Q7S', 'MR', 'SHCP', 'STCP', 'OE', 'DS', 'Q0', 'VCC'];
  var parts = [{ t: 'chip', id: 'sr', col: 22, pins: PINS, label: '74HC595' }], i;
  for (i = 0; i < 7; i++) {   /* Q7..Q1: an LED unit in columns x..x+3 on the bottom half */
    var q = 7 - i, x = 31 + i * 4;
    parts.push({ t: 'res', a: 'b' + x, b: 'b' + (x + 3), val: '330' },
      { t: 'led', a: 'a' + (x + 3), k: 'bn' + (x + 4), color: 'red', id: 'q' + q });
  }
  parts.push({ t: 'res', a: 'i59', b: 'i62', val: '330' }, { t: 'led', a: 'j62', k: 'tn63', color: 'red', id: 'q0' });   /* Q0 */
  parts.push(
    w('P36', 'tp', 'red'), w('P38', 'tn', 'black'), w('P3', 'bn', 'black'),   /* the Pico feeds the rails */
    w('j22', 'tp', 'red'), w('j28', 'tp', 'red'),                            /* VCC and MR to plus */
    w('j25', 'tn', 'black'), w('a29', 'bn', 'black'),                        /* OE and GND to ground */
    /* DS, SHCP, STCP: these wires arch up and cross the channel beside the Pico, not over the chip */
    w('h24', 'P14', 'blue', -52), w('h27', 'P15', 'yellow', -48), w('h26', 'P16', 'orange', -44));
  for (i = 0; i < 7; i++) parts.push(w('d' + (28 - i), 'd' + (31 + i * 4), 'green', 3 + 2.5 * i));   /* Q7..Q1 */
  parts.push(w('g23', 'g59', 'green', -3));   /* Q0 */
  P.layouts['L:S4'] = { parts: parts, map: ['sr.DS', 'sr.SHCP', 'sr.STCP', ['sr.VCC', 'sr.MR'], ['sr.GND', 'sr.OE']] };
  P.layouts.hc595 = 'L:S4';   /* the component page has the same five wiring rows, in the same order */
})(window.PICO);

/* Stage 12 lessons (data-lessons-6.js). */
(function (P) {
  function lesson(id, inst, map) { var out = P.autoLayout(inst); out.layout.map = map; P.layouts['L:' + id] = out.layout; }
  function I(kind, id, pins) { return { kind: kind, id: id, pins: pins }; }
  lesson('S1', [I('led', 'red', [15]), I('led', 'yel', [14]), I('led', 'grn', [13]), I('led', 'walk', [12]), I('button', 'btn', [16])],
    ['red.a~', 'yel.a~', 'grn.a~', 'walk.a~', 'btn.1', ['red.k', 'yel.k', 'grn.k', 'walk.k', 'btn.2']]);
  P.layouts['L:S2'] = 'L:B2';
  P.layouts['L:S3'] = 'L:B2';
  lesson('S5', [I('ds18b20', 'ds', [7]), I('led', 'led', [15])], ['ds.VDD', 'ds.DQ', 'ds.GND', 'led.a~', 'led.k']);
  lesson('S6', [I('gps', 'gps', [9, 8])], ['gps.VCC', 'gps.GND', 'gps.TX', 'gps.RX']);
  lesson('E5', [I('soil', 'soil', [28]), I('relay', 'relay', [21])], ['soil.VCC', 'soil.GND', 'soil.AOUT', 'relay.VCC', 'relay.GND', 'relay.IN']);
  lesson('F5', [I('irrecv', 'ir', [21]), I('rgb', 'rgb', [11, 12, 13])], ['ir.S', 'ir.+', ['ir.−', 'rgb.−'], 'rgb.R', 'rgb.G', 'rgb.B']);
  lesson('F6', [I('lcd1602', 'lcd', [4, 5]), I('button', 'btn', [14])], ['lcd.GND', 'lcd.VCC', 'lcd.SDA', 'lcd.SCL', 'btn.1', 'btn.2']);
  lesson('G5', [I('sdcard', 'sd', [18, 19, 16, 17])], ['sd.VCC', 'sd.GND', 'sd.SCK', 'sd.MOSI', 'sd.MISO', 'sd.CS']);
  lesson('H8', [I('mpu6050', 'mpu', [4, 5]), I('oled', 'oled', [4, 5])], [['mpu.VCC', 'oled.VCC'], ['mpu.GND', 'oled.GND'], ['mpu.SDA', 'oled.SDA'], ['mpu.SCL', 'oled.SCL']]);
})(window.PICO);
