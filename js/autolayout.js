/* Automatic breadboard layout.
   Given a list of part instances and the Pico pins the planner assigned to
   them, place everything on a breadboard (opening more breadboards when the
   first fills up) and return a layout for P.wiringView, plus the list of
   connections it is supposed to make so P.checkLayout can prove it.

   Each part has a placement template in P.TPL:
     mod:  pin names of a module pushed into row j
     off:  'top' | 'bottom' for a part that stays off the breadboard
     pins: the pin names (for off-board parts)
     con:  what each pin connects to: '3v3', '5v', 'gnd', a number (index into
           the instance's assigned GP pins), { div: index } for a 5 V output
           that goes through a voltage divider, or nothing.
   A few simple discrete parts (LED, button, ...) have a custom function. */
(function (P) {
  'use strict';

  var SIG_COLORS = ['yellow', 'green', 'blue', 'orange', 'purple', 'white'];
  function w(a, b, c) { return { t: 'wire', a: a, b: b, c: c }; }

  var TPL = {
    /* ---- discrete parts: custom placement ---- */
    led: {
      width: 7,
      place: function (c) {
        var x = c.x;
        c.sig(0, c.R('d', x));
        c.add({ t: 'res', a: c.R('e', x), b: c.R('e', x + 4), val: '330' });
        c.add({ t: 'led', a: c.R('c', x + 4), k: c.R('c', x + 5), color: ['red', 'yellow', 'green', 'blue'][c.n % 4], id: c.id });
        c.pwr('gnd', c.R('a', x + 5), 'bottom');
        c.expect(c.id + '.a~', 0); c.expect(c.id + '.k', 'GND');
      }
    },
    button: {
      width: 4,
      place: function (c) {
        c.add({ t: 'button', col: c.x, board: c.b, id: c.id });
        c.sig(0, c.R('a', c.x));
        c.pwr('gnd', c.R('a', c.x + 2), 'bottom');
        c.expect(c.id + '.1', 0); c.expect(c.id + '.2', 'GND');
      }
    },
    pot: {
      width: 4,
      place: function (c) {
        c.add({ t: 'pot', at: c.R('f', c.x), id: c.id });
        c.pwr('3v3', c.R('j', c.x)); c.sig(0, c.R('j', c.x + 1)); c.pwr('gnd', c.R('j', c.x + 2), 'top');
        c.expect(c.id + '.1', '3V3'); c.expect(c.id + '.2', 0); c.expect(c.id + '.3', 'GND');
      }
    },
    ldr: {
      width: 7,
      place: function (c) {
        var x = c.x, rid = c.id + 'r';
        c.add({ t: 'ldr', a: c.R('g', x), b: c.R('g', x + 1), id: c.id });
        c.add({ t: 'res', a: c.R('f', x + 1), b: c.R('f', x + 5), val: '10k', id: rid });
        c.pwr('3v3', c.R('j', x)); c.sig(0, c.R('j', x + 1)); c.pwr('gnd', c.R('j', x + 5), 'top');
        c.expect(c.id + '.a', '3V3'); c.expect(c.id + '.b', 0); c.expect(rid + '.b', 'GND');
      }
    },
    buzzer: {
      width: 6,
      place: function (c) {
        c.add({ t: 'buzzer', p: c.R('d', c.x + 1), n: c.R('d', c.x + 4), id: c.id });
        c.sig(0, c.R('a', c.x + 1)); c.pwr('gnd', c.R('a', c.x + 4), 'bottom');
        c.expect(c.id + '.p', 0); c.expect(c.id + '.n', 'GND');
      }
    },
    ds18b20: {
      width: 8,
      place: function (c) {
        var x = c.x;
        c.add({ t: 'ds', at: c.R('f', x), id: c.id });
        c.pwr('gnd', c.R('j', x), 'top'); c.sig(0, c.R('j', x + 1)); c.pwr('3v3', c.R('j', x + 2));
        c.add({ t: 'res', a: c.R('i', x + 2), b: c.R('i', x + 6), val: '4.7k' });
        c.add(w(c.R('h', x + 6), c.R('h', x + 1), 'yellow'));
        c.expect(c.id + '.VDD', '3V3'); c.expect(c.id + '.DQ', 0); c.expect(c.id + '.GND', 'GND');
      }
    },

    /* ---- the parts of data-components-6.js that sit on the breadboard ---- */
    /* the 74HC595 across the channel; its outputs are left free for the student's LEDs */
    hc595: {
      width: 11,
      place: function (c) {
        var C = c.x + 1;
        c.add({ t: 'chip', id: c.id, col: C, board: c.b, label: '74HC595', pins: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'Q7S', 'MR', 'SHCP', 'STCP', 'OE', 'DS', 'Q0', 'VCC'] });
        c.sig(0, c.R('j', C + 2)); c.sig(1, c.R('j', C + 5)); c.sig(2, c.R('j', C + 4));
        c.pwr('3v3', c.R('j', C)); c.pwr('3v3', c.R('j', C + 6)); c.pwr('gnd', c.R('j', C + 3), 'top'); c.pwr('gnd', c.R('a', C + 7), 'bottom');
        c.expect(c.id + '.DS', 0); c.expect(c.id + '.SHCP', 1); c.expect(c.id + '.STCP', 2);
        c.expect([c.id + '.VCC', c.id + '.MR'], '3V3'); c.expect([c.id + '.GND', c.id + '.OE'], 'GND');
      }
    },
    /* a common-cathode digit across the channel. Legs 1-5 along the bottom: e d COM c dp; legs 6-10 back along the top: b a COM f g.
       Each segment's resistor steps out to the right, one row each, so they do not overlap. */
    sevenseg: {
      width: 12,
      place: function (c) {
        var D = c.x + 1, id = c.id;
        c.add({ t: 'chip', look: 'seg7', id: id, col: D, board: c.b, label: '7-SEG', pins: ['e', 'd', 'COM', 'c', 'dp', 'b', 'a', 'COM', 'f', 'g'] });
        /* [segment, column of its leg, resistor row, column the resistor reaches, row the Pico wire starts from, pin index] */
        [['g', D, 'j', D + 6, 'f', 6], ['f', D + 1, 'i', D + 7, 'f', 5], ['a', D + 3, 'h', D + 8, 'f', 0], ['b', D + 4, 'g', D + 9, 'f', 1],
          ['e', D, 'c', D + 6, 'e', 4], ['d', D + 1, 'b', D + 7, 'e', 3], ['c', D + 3, 'a', D + 8, 'e', 2]].forEach(function (s) {
          c.add({ t: 'res', a: c.R(s[2], s[1]), b: c.R(s[2], s[3]), val: '330' });
          c.sig(s[5], c.R(s[4], s[3]));
        });
        c.pwr('gnd', c.R('a', D + 2), 'bottom');
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(function (nm, k) { c.expect(id + '.' + nm + '~', k); });
        c.expect(id + '.COM', 'GND');
      }
    },
    /* a transistor switching a 5 V load (npn) or a motor with its protection diode (diode).
       E B C in columns x+5..x+7; the base resistor runs left to the Pico wire; the load sits above the board. */
    /* ---- the parts of data-components-7.js ---- */
    ntc: { mod: ['GND', 'VCC', 'OUT'], con: { GND: 'gnd', VCC: '3v3', OUT: 0 } },
    bmp180: { mod: ['VIN', 'GND', 'SCL', 'SDA'], con: { VIN: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    lcd2004: { off: 'top', pins: ['GND', 'VCC', 'SDA', 'SCL'], con: { GND: 'gnd', VCC: '5v', SDA: 0, SCL: 1 } },
    ili9341: { off: 'top', pins: ['VCC', 'GND', 'CS', 'RST', 'DC', 'MOSI', 'SCK', 'LED'], con: { VCC: '3v3', GND: 'gnd', SCK: 0, MOSI: 1, CS: 2, DC: 3, RST: 4, LED: '3v3' } },
    /* the 74HC165 beside an 8-way DIP switch: each switch from the plus rail to one input, a 10k from each input to ground */
    hc165: {
      width: 20,
      place: function (c) {
        var D = c.x + 1, C = c.x + 11, id = c.id, sw = id + 'sw';
        var dip = [], k;
        for (k = 1; k <= 8; k++) dip.push(k + 'b');
        for (k = 8; k >= 1; k--) dip.push(k + 'a');
        c.add({ t: 'chip', look: 'dip', id: sw, col: D, board: c.b, label: 'DIP', pins: dip });
        c.add({ t: 'chip', id: id, col: C, board: c.b, label: '74HC165', pins: ['PL', 'CP', 'D4', 'D5', 'D6', 'D7', 'Q7N', 'GND', 'Q7', 'DS', 'D0', 'D1', 'D2', 'D3', 'CE', 'VCC'] });
        for (k = 0; k < 8; k++) {
          c.pwr('3v3', c.R('j', D + k));
          c.add(w(c.R('d', D + k), k < 4 ? c.R('h', C + 5 - k) : c.R('d', C + 2 + (k - 4)), 'orange'));
          c.add({ t: 'res', a: c.R('a', D + k), b: (c.b > 1 ? c.b + ':' : '') + 'bn', val: '10k' });
        }
        c.pwr('3v3', c.R('j', C)); c.pwr('gnd', c.R('j', C + 1), 'top'); c.pwr('gnd', c.R('j', C + 6), 'top'); c.pwr('gnd', c.R('a', C + 7), 'bottom');
        c.sig(0, c.R('a', C)); c.sig(1, c.R('a', C + 1)); c.sig(2, c.R('j', C + 7));
        c.expect(id + '.PL', 0); c.expect(id + '.CP', 1); c.expect(id + '.Q7', 2);
        c.expect(id + '.VCC', '3V3'); c.expect([id + '.GND', id + '.CE', id + '.DS'], 'GND');
      }
    },
    /* a 10-segment LED bar: anodes straight to the pins, a 330 from each cathode up into the ground rail; and the potentiometer */
    ledbar: {
      width: 17,
      place: function (c) {
        var D = c.x + 1, id = c.id, pid = id + 'p', Pc = D + 12, pins = [], i;
        for (i = 1; i <= 10; i++) pins.push('A' + i);
        for (i = 10; i >= 1; i--) pins.push('C' + i);
        c.add({ t: 'chip', look: 'bar', id: id, col: D, board: c.b, label: 'BAR', pins: pins });
        for (i = 0; i < 10; i++) {
          c.add({ t: 'res', a: c.R('j', D + i), b: (c.b > 1 ? c.b + ':' : '') + 'tn', val: '330' });
          c.sig(i, c.R('a', D + i));
        }
        c.add({ t: 'pot', at: c.R('f', Pc), id: pid });
        c.pwr('3v3', c.R('j', Pc)); c.sig(10, c.R('j', Pc + 1)); c.pwr('gnd', c.R('j', Pc + 2), 'top');
        for (i = 0; i < 10; i++) c.expect(id + '.A' + (i + 1), i);
        var cs = []; for (i = 1; i <= 10; i++) cs.push(id + '.C' + i + '~');
        c.expect(cs, 'GND');
        c.expect(pid + '.2', 10); c.expect(pid + '.1', '3V3'); c.expect(pid + '.3', 'GND');
      }
    },
    /* the A4988 across the channel, the stepper motor and its 12 V supply above the board */
    a4988: {
      width: 19,
      place: function (c) {
        var D = c.x + 1, id = c.id, mot = id + 'M', sup = id + 'S';
        c.add({ t: 'chip', look: 'board', id: id, col: D, board: c.b, label: 'A4988', pins: ['EN', 'MS1', 'MS2', 'MS3', 'RST', 'SLP', 'STEP', 'DIR', 'VMOT', 'GND', '2B', '2A', '1A', '1B', 'VDD', 'GND'] });
        c.add(w(c.R('b', D + 4), c.R('b', D + 5), 'white'));
        c.sig(0, c.R('a', D + 6)); c.sig(1, c.R('a', D + 7));
        c.pwr('3v3', c.R('j', D + 1)); c.pwr('gnd', c.R('j', D), 'top');
        c.add({ t: 'off', kind: 'ext-stepmotor', id: mot, x: D + 4, pins: ['1B', '1A', '2A', '2B'], board: c.b, label: L('מנוע צעדים', 'Stepper motor') });
        c.add({ t: 'off', kind: 'ext-supply', id: sup, x: D + 13, pins: ['+', '−'], board: c.b, label: L('ספק 12V', '12 V supply') });
        c.add(w(c.R('j', D + 2), mot + '.1B', 'blue')); c.add(w(c.R('j', D + 3), mot + '.1A', 'blue'));
        c.add(w(c.R('j', D + 4), mot + '.2A', 'purple')); c.add(w(c.R('j', D + 5), mot + '.2B', 'purple'));
        c.add(w(sup + '.+', c.R('j', D + 7), 'red')); c.add(w(sup + '.−', (c.b > 1 ? c.b + ':' : '') + 'tn' + (D + 15), 'black'));
        c.expect(id + '.STEP', 0); c.expect(id + '.DIR', 1); c.expect(id + '.VDD', '3V3'); c.expect(id + '.GND', 'GND');
      }
    },

    npn: { width: 13, place: function (c) { transistor(c, false); } },
    diode: { width: 14, place: function (c) { transistor(c, true); } },

    /* ---- the original modules ---- */
    servo: { off: 'bottom', pins: ['GND', '5V', 'SIG'], con: { GND: 'gnd', '5V': '5v', SIG: 0 } },
    fs90r: { off: 'bottom', pins: ['GND', '5V', 'SIG'], con: { GND: 'gnd', '5V': '5v', SIG: 0 } },
    l298n: { off: 'top', pins: ['ENA', 'IN1', 'IN2', 'GND'], con: { ENA: 0, IN1: 1, IN2: 2, GND: 'gnd' } },
    hcsr04: { mod: ['VCC', 'Trig', 'Echo', 'GND'], con: { VCC: '5v', Trig: 0, Echo: { div: 1 }, GND: 'gnd' } },
    pir: { off: 'top', pins: ['VCC', 'OUT', 'GND'], con: { VCC: '5v', OUT: 0, GND: 'gnd' } },
    dht22: { mod: ['+', 'OUT', '−'], con: { '+': '3v3', OUT: 0, '−': 'gnd' } },
    oled: { mod: ['GND', 'VCC', 'SCL', 'SDA'], con: { GND: 'gnd', VCC: '3v3', SCL: 1, SDA: 0 } },
    bh1750: { mod: ['VCC', 'GND', 'SCL', 'SDA', 'ADDR'], con: { VCC: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    mpu6050: { mod: ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'], con: { VCC: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    neopixel: { off: 'bottom', pins: ['GND', 'DIN', '5V'], con: { GND: 'gnd', DIN: 0, '5V': '5v' } },
    sdcard: { mod: ['GND', 'VCC', 'MISO', 'MOSI', 'SCK', 'CS'], con: { GND: 'gnd', VCC: '3v3', SCK: 0, MOSI: 1, MISO: 2, CS: 3 } },
    gps: { mod: ['VCC', 'RX', 'TX', 'GND'], con: { VCC: '3v3', GND: 'gnd', TX: 0, RX: 1 } },

    /* ---- movement and switching ---- */
    relay: { mod: ['VCC', 'GND', 'IN'], con: { VCC: '5v', GND: 'gnd', IN: 0 } },
    motor: { mod: ['IN1', 'IN2', 'VCC', 'GND'], con: { IN1: 0, IN2: 1, VCC: '5v', GND: 'gnd' } },
    stepper: { off: 'top', pins: ['IN1', 'IN2', 'IN3', 'IN4', '+', '−'], con: { IN1: 0, IN2: 1, IN3: 2, IN4: 3, '+': '5v', '−': 'gnd' } },
    rgb: { mod: ['R', 'G', 'B', '−'], con: { R: 0, G: 1, B: 2, '−': 'gnd' } },

    /* ---- input from the user ---- */
    joystick: { off: 'bottom', pins: ['GND', '+5V', 'VRx', 'VRy', 'SW'], con: { GND: 'gnd', '+5V': '3v3', VRx: 0, VRy: 1, SW: 2 } },
    encoder: { mod: ['CLK', 'DT', 'SW', '+', 'GND'], con: { CLK: 0, DT: 1, SW: 2, '+': '3v3', GND: 'gnd' } },
    keypad: { off: 'top', pins: ['R1', 'R2', 'R3', 'R4', 'C1', 'C2', 'C3', 'C4'], con: { R1: 0, R2: 1, R3: 2, R4: 3, C1: 4, C2: 5, C3: 6, C4: 7 } },
    touch: { mod: ['SIG', 'VCC', 'GND'], con: { SIG: 0, VCC: '3v3', GND: 'gnd' } },
    irrecv: { mod: ['S', '+', '−'], con: { S: 0, '+': '3v3', '−': 'gnd' } },

    /* ---- more sensors ---- */
    bme280: { mod: ['VIN', 'GND', 'SCL', 'SDA'], con: { VIN: '3v3', GND: 'gnd', SCL: 1, SDA: 0 } },
    soil: { off: 'bottom', pins: ['GND', 'VCC', 'AOUT'], con: { GND: 'gnd', VCC: '3v3', AOUT: 0 } },
    sound: { mod: ['AO', 'G', '+', 'DO'], con: { G: 'gnd', '+': '3v3', DO: 0 } },
    mq2: { mod: ['VCC', 'GND', 'DO', 'AO'], con: { VCC: '5v', GND: 'gnd', DO: { div: 0 } } },
    tilt: { mod: ['S', '+', '−'], con: { S: 0, '+': '3v3', '−': 'gnd' } },
    hall: { mod: ['−', '+', 'S'], con: { '−': 'gnd', '+': '3v3', S: 0 } },

    /* ---- display, time and identity ---- */
    lcd1602: { off: 'top', pins: ['GND', 'VCC', 'SDA', 'SCL'], con: { GND: 'gnd', VCC: '5v', SDA: 0, SCL: 1 } },
    tm1637: { mod: ['CLK', 'DIO', 'VCC', 'GND'], con: { CLK: 0, DIO: 1, VCC: '3v3', GND: 'gnd' } },
    max7219: { off: 'top', pins: ['VCC', 'GND', 'DIN', 'CS', 'CLK'], con: { VCC: '5v', GND: 'gnd', CLK: 0, DIN: 1, CS: 2 } },
    ds3231: { mod: ['GND', 'VCC', 'SDA', 'SCL'], con: { GND: 'gnd', VCC: '3v3', SDA: 0, SCL: 1 } },
    rc522: { off: 'top', pins: ['SDA', 'SCK', 'MOSI', 'MISO', 'GND', 'RST', '3.3V'], con: { SCK: 0, MOSI: 1, MISO: 2, SDA: 3, RST: 4, GND: 'gnd', '3.3V': '3v3' } },
    hc05: { mod: ['VCC', 'GND', 'TXD', 'RXD'], con: { VCC: '5v', GND: 'gnd', TXD: 0, RXD: 1 } },
    nrf24: { off: 'top', pins: ['GND', 'VCC', 'CE', 'CSN', 'SCK', 'MOSI', 'MISO'], con: { GND: 'gnd', VCC: '3v3', SCK: 0, MOSI: 1, MISO: 2, CSN: 3, CE: 4 } }
  };

  /* a label that follows the site language */
  function L(he, en) { return { toString: function () { return P.t({ he: he, en: en }); } }; }
  function transistor(c, motor) {
    var x = c.x, id = c.id, tr = motor ? id + 'Q' : id, ld = id + (motor ? 'M' : 'L');
    c.add({ t: 'ds', at: c.R('f', x + 5), id: tr, names: ['E', 'B', 'C'], label: '2N2222' });
    c.add({ t: 'res', a: c.R('i', x + 6), b: c.R('i', x + 2), val: '1k' });
    c.sig(0, c.R('j', x + 2));
    c.pwr('gnd', c.R('j', x + 5), 'top');
    c.add({ t: 'off', kind: motor ? 'ext-motor' : 'ext-load', id: ld, x: x + 10, pins: ['−', '+'], board: c.b,
      label: motor ? L('מנוע 5V', '5 V motor') : L('עומס 5V', '5 V load') });
    c.add(w(ld + '.−', c.R('j', x + 7), 'black'));
    if (motor) {
      /* the diode: anode on the collector, cathode (band) on the motor's plus */
      c.add({ t: 'diode', a: c.R('i', x + 7), k: c.R('i', x + 11), id: id });
      c.add(w(ld + '.+', c.R('j', x + 11), 'red'));
      c.pwr('5v', c.R('h', x + 11));
    } else {
      c.add(w(ld + '.+', c.R('j', x + 10), 'red'));
      c.pwr('5v', c.R('h', x + 10));
    }
    c.expect(tr + '.B~', 0); c.expect(tr + '.E', 'GND');
    c.expect(motor ? [ld + '.+', id + '.k'] : ld + '.+', 'VBUS');
  }

  function widthOf(tpl) {
    if (tpl.width) return tpl.width;
    var n = (tpl.mod || tpl.pins).length, divs = 0;
    Object.keys(tpl.con).forEach(function (k) { if (tpl.con[k] && tpl.con[k].div != null) divs++; });
    if (tpl.mod) return Math.max(n, 6) + 1 + divs * 7;
    return Math.max(Math.ceil((n * 26 + 16) / 14) + 1, 8);
  }

  /* instances: [{ kind, id, pins: [GP numbers], label?, tpl? }]
     returns { layout, rows, errors } */
  P.autoLayout = function (instances, opts) {
    opts = opts || {};
    var parts = [], feeds = [], rows = [], map = [];
    var board = 1, cursor = 23, maxBoards = opts.maxBoards || 4;
    var fed = {};          /* which rails already have a feed wire: '1:tp' ... */
    var pinState = {};     /* per GP number: how the net is reached */
    var colorN = 0, errors = [];

    function pre(b) { return b > 1 ? b + ':' : ''; }
    function physical(gp) { var p = P.pinByName('GP' + gp); return p ? p.num : null; }

    function feed(rail, b) {
      var key = b + ':' + rail;
      if (fed[key]) return;
      fed[key] = true;
      var color = rail === 'tp' || rail === 'bp' ? 'red' : 'black';
      if (b === 1) {
        /* tp = 3.3 V from pin 36, bp = 5 V from pin 40 (VBUS), tn and bn = ground */
        var from = { tp: 'P36', bp: 'P40', tn: 'P38', bn: 'P3' }[rail];
        feeds.push(w(from, rail, color));
      } else {
        feed(rail, b - 1);
        feeds.push(w(pre(b - 1) + rail + (60 - b), pre(b) + rail + (60 - b), color));
      }
    }

    function reserve(width) {
      if (cursor + width - 1 > 62) {
        board++; cursor = 2;
        if (board > maxBoards) errors.push('out of breadboards');
      }
      var x = cursor; cursor += width;
      return x;
    }

    /* Reach the net of a GP pin. The first wire goes to the pin's own column.
       After that a spare column becomes a small bus with four more taps. */
    function attach(gp) {
      var st = pinState[gp] || (pinState[gp] = { n: 0, taps: [] });
      var num = physical(gp);
      if (st.n === 0) { st.n = 1; return 'P' + num; }
      if (st.taps.length <= 1) {
        var x = reserve(2), b = board, src = st.taps.length ? st.taps.shift() : 'P' + num;
        parts.push(w(src, pre(b) + 'e' + x, st.color || 'yellow'));
        st.taps = ['d', 'c', 'b', 'a'].map(function (r) { return pre(b) + r + x; });
      }
      return st.taps.shift();
    }

    instances.forEach(function (inst, n) {
      var tpl = inst.tpl || TPL[inst.kind];
      if (!tpl) { errors.push('no template for ' + inst.kind); return; }
      var x = reserve(widthOf(tpl)), b = board, id = inst.id;
      var c = {
        x: x, b: b, id: id, n: n,
        R: function (row, col) { return pre(b) + row + col; },
        add: function (p) { parts.push(p); },
        sig: function (idx, from) {
          var gp = inst.pins[idx];
          if (gp == null) return;
          var st = pinState[gp] || (pinState[gp] = { n: 0, taps: [] });
          if (!st.color) st.color = SIG_COLORS[colorN++ % SIG_COLORS.length];
          parts.push(w(from, attach(gp), st.color));
        },
        pwr: function (kind, from, half) {
          var rail = kind === '3v3' ? 'tp' : kind === '5v' ? 'bp' : (half === 'bottom' ? 'bn' : 'tn');
          feed(rail, b);
          parts.push(w(from, pre(b) + rail, kind === 'gnd' ? 'black' : 'red'));
        },
        expect: function (ref, target) {
          rows.push({ to: typeof target === 'number' ? 'GP' + inst.pins[target] : target });
          map.push(ref);
        }
      };
      if (tpl.place) { tpl.place(c); return; }

      var names = tpl.mod || tpl.pins, isMod = !!tpl.mod, side = tpl.off, extra = x + Math.max(names.length, 6) + 1;
      if (isMod) parts.push({ t: 'mod', kind: inst.kind, id: id, at: c.R('j', x), pins: names, label: inst.label });
      else parts.push({ t: 'off', kind: inst.kind, id: id, x: x + Math.floor(widthOf(tpl) / 2), pins: names, side: side, board: b, label: inst.label });
      names.forEach(function (nm, k) {
        var con = tpl.con[nm];
        if (con == null) return;
        var from = isMod ? c.R('i', x + k) : id + '.' + nm, ref = id + '.' + nm;
        if (con === '3v3' || con === '5v' || con === 'gnd') {
          c.pwr(con, from, side === 'bottom' ? 'bottom' : 'top');
          c.expect(ref, con === '3v3' ? '3V3' : con === '5v' ? 'VBUS' : 'GND');
        } else if (typeof con === 'number') {
          c.sig(con, from); c.expect(ref, con);
        } else if (con.div != null) {
          /* a 5 V output: 1 kΩ to a middle column, 2 kΩ from there to ground, the Pico reads the middle */
          parts.push({ t: 'res', a: c.R('h', x + k), b: c.R('h', extra), val: '1k' });
          parts.push({ t: 'res', a: c.R('g', extra), b: c.R('g', extra + 4), val: '2k' });
          c.pwr('gnd', c.R('j', extra + 4), 'top');
          c.sig(con.div, c.R('j', extra));
          c.expect(ref + '~', con.div);
          extra += 7;
        }
      });
    });

    var layout = { parts: feeds.concat(parts), boards: board, map: map };
    return { layout: layout, rows: rows, errors: errors.concat(P.checkLayout(layout, rows)) };
  };

  P.TPL = TPL;

  /* Catalog parts that have no hand-drawn layout get one from their template,
     using the pins of their own wiring table. */
  P.components.forEach(function (comp) {
    if (P.layouts[comp.id] || !TPL[comp.id]) return;
    var tpl = TPL[comp.id], names = tpl.mod || tpl.pins;
    var gps = comp.wiring.filter(function (r) { return /^GP\d+$/.test(r.to); });
    /* order the assigned pins the way the template indexes them */
    var pins = [];
    /* a hand-placed template takes the pins in the order of the table's rows, and already expects those rows, in order */
    if (tpl.place) {
      P.layouts[comp.id] = P.autoLayout([{ kind: comp.id, id: comp.id, pins: gps.map(function (r) { return +r.to.slice(2); }) }]).layout;
      return;
    }
    comp.wiring.forEach(function (r) {
      var nm = typeof r.part === 'string' ? r.part : null, con = nm != null ? tpl.con[nm] : null;
      var idx = typeof con === 'number' ? con : (con && con.div != null ? con.div : null);
      if (idx != null && /^GP\d+$/.test(r.to)) pins[idx] = +r.to.slice(2);
    });
    if (!pins.length) pins = gps.map(function (r) { return +r.to.slice(2); });
    var out = P.autoLayout([{ kind: comp.id, id: comp.id, pins: pins }]);
    /* line the map up with the rows of the part's own wiring table */
    out.layout.map = comp.wiring.map(function (r) {
      var nm = typeof r.part === 'string' ? r.part : null;
      if (nm == null || names.indexOf(nm) < 0) return [];
      return comp.id + '.' + nm + (tpl.con[nm] && tpl.con[nm].div != null ? '~' : '');
    });
    P.layouts[comp.id] = out.layout;
  });
})(window.PICO);
