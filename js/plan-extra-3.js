/* Planner data for the parts of catalog part 6 (js/data-components-6.js).
   Same shape as js/plan-extra-2.js: `needs` follows the GP rows of each part's
   wiring table, in order. Helper names are unique per part, because the
   combined program keeps only the first helper of each name. */
(function (P) {
  'use strict';
  var PLAN = P.planner.PLAN;
  var B = function (he, en) { return { he: he, en: en }; };

  var X = {
    hc595: {
      /* the chip itself draws little; up to eight LEDs on its outputs at about 5 mA each */
      max: 2, mA: 40, v: 'sr', short: B('74HC595', '74HC595'), needs: ['gpio', 'gpio', 'gpio'],
      gen: function (c) {
        var d = 'sr_data' + c.sfx, k = 'sr_clock' + c.sfx, l = 'sr_latch' + c.sfx;
        return {
          from: { machine: ['Pin'] },
          setup: [d + ' = Pin(' + c.p[0] + ', Pin.OUT)', k + ' = Pin(' + c.p[1] + ', Pin.OUT)', l + ' = Pin(' + c.p[2] + ', Pin.OUT)'],
          helpers: {
            shift_byte: [
              'def shift_byte(data, clock, latch, byte):',
              '    latch.off()',
              '    for i in range(8):',
              '        data.value((byte >> (7 - i)) & 1)   # the highest bit first',
              '        clock.on()',
              '        clock.off()',
              '    latch.on()                            # all eight outputs change together'
            ]
          },
          loop: ['shift_byte(' + d + ', ' + k + ', ' + l + ', 0b10101010)']
        };
      }
    },
    sevenseg: {
      /* up to seven segments at about 5 mA each */
      max: 1, mA: 35, v: 'digit', short: B('ספרה', 'Digit'), needs: ['gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] },
          setup: [
            'segments = [Pin(n, Pin.OUT) for n in (' + c.p.join(', ') + ')]   # a, b, c, d, e, f, g',
            'DIGITS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F]'
          ],
          helpers: {
            show_digit: [
              'def show_digit(d):',
              '    for i in range(7):',
              '        segments[i].value((DIGITS[d] >> i) & 1)'
            ]
          },
          loop: ['show_digit(8)']
        };
      }
    },
    l298n: {
      /* the motor runs from its own batteries; the control pins draw next to nothing */
      max: 1, mA: 0, v: 'l298', short: B('L298N', 'L298N'), needs: ['pwm', 'gpio', 'gpio'],
      gen: function (c) {
        var en = 'l298_ena' + c.sfx, a = 'l298_in1' + c.sfx, b = 'l298_in2' + c.sfx;
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: [en + ' = PWM(Pin(' + c.p[0] + '), freq=1000)', a + ' = Pin(' + c.p[1] + ', Pin.OUT)', b + ' = Pin(' + c.p[2] + ', Pin.OUT)'],
          helpers: {
            l298_drive: [
              'def l298_drive(en, in1, in2, speed):',
              '    # speed from -100 (full back) to 100 (full forward), 0 = stop',
              '    in1.value(speed > 0)',
              '    in2.value(speed < 0)',
              '    en.duty_u16(abs(speed) * 65535 // 100)'
            ]
          },
          loop: ['l298_drive(' + en + ', ' + a + ', ' + b + ', 50)']
        };
      }
    },
    fs90r: {
      max: 4, mA: 150, peak: 650, v: 'wheel', short: B('FS90R', 'FS90R'), needs: ['pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: [c.v + ' = PWM(Pin(' + c.p[0] + '), freq=50)'],
          helpers: {
            spin: [
              'def spin(servo, speed):',
              '    # speed from -100 to 100. 1.5 ms = stop; shorter one way, longer the other',
              '    servo.duty_ns(1_500_000 + speed * 5_000)'
            ]
          },
          loop: ['spin(' + c.v + ', 50)']
        };
      }
    },
    npn: {
      /* the load runs from 5 V through the transistor; a small load of about 100 mA */
      max: 3, mA: 100, v: 'npn_load', short: B('טרנזיסטור', 'Transistor'), needs: ['pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: [c.v + ' = PWM(Pin(' + c.p[0] + '), freq=1000)   # through 1 kΩ to the base', c.v + '.duty_u16(0)'],
          loop: ['# ' + c.v + '.duty_u16(32768)           # 0 = off, 65535 = full power']
        };
      }
    },
    diode: {
      /* the motor from 5 V through the transistor, with the diode across it */
      max: 2, mA: 150, peak: 400, five: true, v: 'motor_sw', short: B('מנוע עם דיודה', 'Motor with diode'), needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] },
          setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.OUT)   # through 1 kΩ to the transistor\'s base'],
          loop: [c.v + '.toggle()                 # the diode takes the coil\'s spike when it stops']
        };
      }
    }
  };
  Object.keys(X).forEach(function (k) { PLAN[k] = X[k]; });
})(window.PICO);
