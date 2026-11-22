/* Planner data for the parts of catalog part 7 (js/data-components-7.js).
   Same shape as js/plan-extra-3.js: `needs` follows the GP rows of each part's
   wiring table, in order. Helper and variable names are unique per part. */
(function (P) {
  'use strict';
  var PLAN = P.planner.PLAN;
  var B = function (he, en) { return { he: he, en: en }; };
  var I2C_PRE = function (p) { return P.planner.i2cPre(p); };

  var X = {
    ntc: {
      max: 3, mA: 1, v: 'ntc', short: B('NTC', 'NTC'), needs: ['adc'],
      gen: function (c) {
        return {
          mods: ['math'], from: { machine: ['ADC'] },
          setup: [c.v + ' = ADC(' + c.p[0] + ')'],
          helpers: {
            ntc_celsius: [
              'def ntc_celsius(adc, beta=3950):',
              '    ratio = 65535 / adc.read_u16() - 1',
              '    return 1 / (math.log(1 / ratio) / beta + 1 / 298.15) - 273.15'
            ]
          },
          loop: ['print("' + c.v + ':", round(ntc_celsius(' + c.v + '), 1), "C")']
        };
      }
    },
    hc165: {
      max: 2, mA: 1, v: 'sw', short: B('74HC165', '74HC165'), needs: ['gpio', 'gpio', 'gpio'],
      gen: function (c) {
        var l = 'in_load' + c.sfx, k = 'in_clock' + c.sfx, d = 'in_data' + c.sfx;
        return {
          from: { machine: ['Pin'] },
          setup: [l + ' = Pin(' + c.p[0] + ', Pin.OUT, value=1)', k + ' = Pin(' + c.p[1] + ', Pin.OUT, value=0)', d + ' = Pin(' + c.p[2] + ', Pin.IN)'],
          helpers: {
            read_165: [
              'def read_165(load, clock, data):',
              '    load.off()',
              '    load.on()',
              '    byte = 0',
              '    for i in range(8):',
              '        byte = (byte << 1) | data.value()',
              '        clock.on()',
              '        clock.off()',
              '    return byte'
            ]
          },
          loop: ['print("switches' + c.sfx + ':", "{:08b}".format(read_165(' + l + ', ' + k + ', ' + d + ')))']
        };
      }
    },
    ledbar: {
      /* up to ten segments at about 5 mA each */
      max: 1, mA: 50, v: 'bar', short: B('פס לדים', 'LED bar'), needs: ['gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'adc'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'ADC'] },
          setup: ['bars = [Pin(n, Pin.OUT) for n in (' + c.p.slice(0, 10).join(', ') + ')]', 'bar_pot = ADC(' + c.p[10] + ')'],
          loop: ['level = bar_pot.read_u16() * 11 // 65536', 'for i, b in enumerate(bars):', '    b.value(i < level)']
        };
      }
    },
    lcd2004: {
      max: 1, mA: 25, v: 'lcd4', short: B('LCD 20×4', 'LCD 20×4'), needs: ['i2c', 'i2c'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'I2C'], pico_lcd: ['LCD'] }, pre: I2C_PRE(c.p),
          setup: ['lcd4 = LCD(i2c, 0x27)          # pico_lcd.py must be on the board', 'lcd4.clear()', 'lcd4.write("Pico 2 Lab")'],
          loop: ['lcd4.move(0, 3)', 'lcd4.write("Row 4")']
        };
      }
    },
    ili9341: {
      max: 1, mA: 80, v: 'tft', short: B('ILI9341', 'ILI9341'), needs: ['spi', 'spi', 'gpio', 'gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'SPI'], pico_ili9341: ['ILI9341', 'rgb'] },
          pre: { spi: ['spi = SPI(0, baudrate=20_000_000, sck=Pin(' + c.p[0] + '), mosi=Pin(' + c.p[1] + '))'] },
          setup: ['tft = ILI9341(spi, cs=Pin(' + c.p[2] + '), dc=Pin(' + c.p[3] + '), rst=Pin(' + c.p[4] + '))   # pico_ili9341.py must be on the board', 'tft.fill(rgb(0, 0, 60))'],
          loop: ['tft.text("Pico 2 Lab", 0, 20, rgb(255, 255, 0), rgb(0, 0, 60), scale=3)']
        };
      }
    },
    a4988: {
      /* the motor runs from its own supply on VMOT */
      max: 2, mA: 2, v: 'stepper', short: B('A4988', 'A4988'), needs: ['gpio', 'gpio'],
      gen: function (c) {
        var s = 'a4988_step' + c.sfx, d = 'a4988_dir' + c.sfx;
        return {
          from: { machine: ['Pin'], time: ['sleep_us'] },
          setup: [s + ' = Pin(' + c.p[0] + ', Pin.OUT)', d + ' = Pin(' + c.p[1] + ', Pin.OUT)'],
          helpers: {
            a4988_turn: [
              'def a4988_turn(step, direction, steps, forward=True, delay_us=2000):',
              '    direction.value(1 if forward else 0)',
              '    for _ in range(steps):',
              '        step.on()',
              '        sleep_us(5)',
              '        step.off()',
              '        sleep_us(delay_us)'
            ]
          },
          loop: ['a4988_turn(' + s + ', ' + d + ', 200)     # one full turn']
        };
      }
    },
    bmp180: {
      max: 1, mA: 1, v: 'bmp', short: B('BMP180', 'BMP180'), needs: ['i2c', 'i2c'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'I2C'], pico_bmp180: ['BMP180'] }, pre: I2C_PRE(c.p),
          setup: ['bmp = BMP180(i2c)               # pico_bmp180.py must be on the board'],
          loop: ['t, p = bmp.read()', 'print("BMP180:", t, "C", p / 100, "hPa")']
        };
      }
    }
  };
  Object.keys(X).forEach(function (k) { PLAN[k] = X[k]; });
})(window.PICO);
