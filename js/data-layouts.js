/* Breadboard layouts: where every part and wire sits, by hole name.
   One layout per catalog part (keyed by the part id) and one per lesson
   (keyed 'L:' + lesson id). A string value is an alias for another layout.

   Hole names: a row letter and a column, e.g. 'b20'. Rails: tp/tn (top + / −)
   and bp/bn (bottom + / −), optionally with a column. 'P20' means "a free hole
   in the column of Pico pin 20". 'servo.SIG' is a pin of an off-board part.

   `map` lists, for each row of the wiring table, which part pin(s) that row
   talks about. A trailing ~ means "through a resistor". P.checkLayout uses it
   to prove the drawing matches the table. */
(function (P) {
  'use strict';

  function w(a, b, c) { return { t: 'wire', a: a, b: b, c: c }; }
  function res(a, b, val, id) { return { t: 'res', a: a, b: b, val: val, id: id }; }
  function led(a, k, color, id) { return { t: 'led', a: a, k: k, color: color, id: id }; }
  function mod(kind, id, at, pins) { return { t: 'mod', kind: kind, id: id, at: at, pins: pins }; }
  function off(kind, x, pins, side) { return { t: 'off', kind: kind, id: kind, x: x, pins: pins, side: side }; }

  /* An LED with its resistor, to the right of the Pico:
     Pico pin -> wire -> resistor -> LED long leg; LED short leg -> ground rail. */
  function ledGroup(x, pin, color, id, wireColor) {
    return [
      w('P' + pin, 'd' + x, wireColor || 'orange'),
      res('e' + x, 'e' + (x + 4), '330'),
      led('c' + (x + 4), 'c' + (x + 5), color, id),
      w('a' + (x + 5), 'bn', 'black')
    ];
  }
  var GND_RAIL = w('P18', 'bn', 'black');
  var POT = [{ t: 'pot', at: 'f24' }, w('j24', 'P36', 'red'), w('j25', 'P31', 'yellow'), w('j26', 'P33', 'black')];
  var LDR = [{ t: 'ldr', a: 'g24', b: 'g25' }, res('f25', 'f29', '10k', 'rd'), w('j24', 'P36', 'red'), w('j25', 'P32', 'yellow'), w('j29', 'P33', 'black')];
  var SONAR = [
    mod('hcsr04', 'us', 'j24', ['VCC', 'Trig', 'Echo', 'GND']),
    w('i24', 'P40', 'red'), w('i27', 'P3', 'black'), w('i25', 'P5', 'yellow'),
    res('h26', 'h30', '1k'), res('g30', 'g34', '2k'), w('f34', 'f27', 'black'), w('j30', 'P4', 'green')
  ];
  var OLED = [
    mod('oled', 'oled', 'j24', ['GND', 'VCC', 'SCL', 'SDA']),
    w('i25', 'P36', 'red'), w('i24', 'P8', 'black'), w('i27', 'P6', 'blue'), w('i26', 'P7', 'yellow')
  ];
  var SERVO = [off('servo', 34, ['GND', '5V', 'SIG'], 'bottom'), w('servo.SIG', 'P14', 'orange'), w('servo.5V', 'P40', 'red'), w('servo.GND', 'P13', 'black')];
  var PIR = function (x) { return [off('pir', x, ['VCC', 'OUT', 'GND']), w('pir.VCC', 'P40', 'red'), w('pir.OUT', 'P29', 'yellow'), w('pir.GND', 'P28', 'black')]; };

  P.layouts = {
    /* ---------------- catalog parts ---------------- */
    led: { parts: [res('b20', 'b24', '330'), led('d24', 'd25', 'red'), w('a25', 'P18', 'black')], map: ['led.a~', 'led.k'] },
    button: { parts: [{ t: 'button', col: 24 }, w('a24', 'P19', 'yellow'), w('a26', 'P18', 'black')], map: ['btn.1', 'btn.2'] },
    pot: { parts: POT, map: ['pot.1', 'pot.2', 'pot.3'] },
    ldr: { parts: LDR, map: ['ldr.a', 'ldr.b', 'rd.b'] },
    buzzer: { parts: [{ t: 'buzzer', p: 'd24', n: 'd27' }, w('a24', 'P17', 'yellow'), w('a27', 'P18', 'black')], map: ['bz.p', 'bz.n'] },
    servo: { parts: SERVO, map: ['servo.SIG', 'servo.5V', 'servo.GND'] },
    hcsr04: { parts: SONAR, map: ['us.VCC', 'us.Trig', 'us.Echo~', 'us.GND'] },
    pir: { parts: PIR(34), map: ['pir.VCC', 'pir.OUT', 'pir.GND'] },
    dht22: {
      parts: [mod('dht22', 'dht', 'j24', ['+', 'OUT', '−']), w('i24', 'P36', 'red'), w('i25', 'P9', 'yellow'), w('i26', 'P8', 'black')],
      map: ['dht.+', 'dht.OUT', 'dht.−']
    },
    ds18b20: {
      parts: [{ t: 'ds', at: 'f24' }, w('j26', 'P36', 'red'), w('j24', 'P8', 'black'), w('j25', 'P10', 'yellow'), res('i26', 'i30', '4.7k'), w('h30', 'h25', 'yellow')],
      map: ['ds.VDD', 'ds.DQ', 'ds.GND']
    },
    oled: { parts: OLED, map: ['oled.VCC', 'oled.GND', 'oled.SDA', 'oled.SCL'] },
    bh1750: {
      parts: [mod('bh1750', 'bh', 'j24', ['VCC', 'GND', 'SCL', 'SDA', 'ADDR']), w('i24', 'P36', 'red'), w('i25', 'P8', 'black'), w('i27', 'P6', 'blue'), w('i26', 'P7', 'yellow')],
      map: ['bh.VCC', 'bh.GND', 'bh.SDA', 'bh.SCL']
    },
    mpu6050: {
      parts: [mod('mpu6050', 'mpu', 'j24', ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT']), w('i24', 'P36', 'red'), w('i25', 'P8', 'black'), w('i27', 'P6', 'blue'), w('i26', 'P7', 'yellow')],
      map: ['mpu.VCC', 'mpu.GND', 'mpu.SDA', 'mpu.SCL']
    },
    neopixel: {
      parts: [off('neopixel', 30, ['GND', 'DIN', '5V'], 'bottom'), w('neopixel.5V', 'P40', 'red'), w('neopixel.DIN', 'P1', 'green'), w('neopixel.GND', 'P3', 'black')],
      map: ['neopixel.5V', 'neopixel.DIN', 'neopixel.GND']
    },
    sdcard: {
      parts: [mod('sdcard', 'sd', 'j24', ['GND', 'VCC', 'MISO', 'MOSI', 'SCK', 'CS']),
        w('i25', 'P36', 'red'), w('i24', 'P23', 'black'), w('i28', 'P24', 'yellow'), w('i27', 'P25', 'blue'), w('i26', 'P21', 'green'), w('i29', 'P22', 'orange')],
      map: ['sd.VCC', 'sd.GND', 'sd.SCK', 'sd.MOSI', 'sd.MISO', 'sd.CS']
    },
    gps: {
      parts: [mod('gps', 'gps', 'j24', ['VCC', 'RX', 'TX', 'GND']), w('i24', 'P36', 'red'), w('i27', 'P13', 'black'), w('i26', 'P12', 'yellow'), w('i25', 'P11', 'green')],
      map: ['gps.VCC', 'gps.GND', 'gps.TX', 'gps.RX']
    },

    /* ---------------- lessons ---------------- */
    'L:A1': 'led',
    'L:A2': {
      parts: [GND_RAIL].concat(ledGroup(26, 20, 'red', 'led1', 'orange'), ledGroup(34, 19, 'yellow', 'led2', 'yellow'), ledGroup(42, 17, 'green', 'led3', 'green')),
      map: ['led1.a~', 'led2.a~', 'led3.a~', ['led1.k', 'led2.k', 'led3.k']]
    },
    'L:A3': {
      parts: [GND_RAIL].concat(ledGroup(26, 20, 'red', 'led'), [{ t: 'button', col: 36 }, w('a36', 'P19', 'yellow'), w('a38', 'bn', 'black')]),
      map: ['led.a~', 'btn.1', ['led.k', 'btn.2']]
    },
    'L:A4': 'L:A3',
    'L:B1': 'pot',
    'L:B2': { parts: POT.concat([GND_RAIL], ledGroup(26, 20, 'red', 'led')), map: ['pot.2', 'pot.1', 'led.a~', 'led.k'] },
    'L:B3': { parts: LDR.concat([GND_RAIL], ledGroup(26, 20, 'red', 'led')), map: ['ldr.a', 'ldr.b', 'rd.b', 'led.a~', 'led.k'] },
    'L:B4': {
      parts: [GND_RAIL, { t: 'buzzer', p: 'd24', n: 'd27' }, w('a24', 'P17', 'yellow'), w('a27', 'bn', 'black'),
        { t: 'button', col: 34 }, w('a34', 'P19', 'green'), w('a36', 'bn', 'black')],
      map: ['bz.p', 'btn.1', ['bz.n', 'btn.2']]
    },
    'L:B5': { parts: SERVO.concat(POT), map: ['servo.SIG', 'servo.5V', 'servo.GND', 'pot.2', 'pot.1', 'pot.3'] },
    'L:C1': {
      parts: SONAR.concat([{ t: 'buzzer', p: 'd24', n: 'd27' }, w('a24', 'P17', 'orange'), w('a27', 'P18', 'black')]),
      map: ['us.VCC', 'us.Trig', 'us.Echo~', 'us.GND', 'bz.p', 'bz.n']
    },
    'L:C2': {
      parts: PIR(46).concat([GND_RAIL], ledGroup(26, 20, 'red', 'led'), [{ t: 'buzzer', p: 'd36', n: 'd39' }, w('a36', 'P17', 'green'), w('a39', 'bn', 'black')]),
      map: ['pir.VCC', 'pir.OUT', 'pir.GND', 'led.a~', 'bz.p', ['led.k', 'bz.n']]
    },
    'L:C3': 'oled',
    'L:C4': {
      parts: [
        w('P36', 'tp', 'red'), w('P8', 'bn', 'black'),
        mod('oled', 'oled', 'j24', ['GND', 'VCC', 'SCL', 'SDA']),
        w('i25', 'tp22', 'red'), w('i24', 'bn', 'black'), w('i27', 'P6', 'blue'), w('i26', 'P7', 'yellow'),
        mod('dht22', 'dht', 'j32', ['+', 'OUT', '−']),
        w('i32', 'tp36', 'red'), w('i33', 'P9', 'green'), w('i34', 'bn', 'black')
      ],
      map: ['dht.+', 'dht.OUT', ['dht.−', 'oled.GND'], 'oled.SDA', 'oled.SCL']
    }
  };
})(window.PICO);
