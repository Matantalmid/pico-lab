/* Planner data for the parts of catalog part 5 (js/data-components-5.js).
   Same shape as js/plan-extra.js: `needs` follows the GP rows of each part's
   wiring table, in order. Helper names are unique per part, because the
   combined program keeps only the first helper of each name, and helpers are
   printed after the setup lines, so setup never calls a helper. */
(function (P) {
  'use strict';
  var PLAN = P.planner.PLAN;
  var B = function (he, en) { return { he: he, en: en }; };

  var SPI_PRE = { spi: ['spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))'] };
  var I2C_PRE = function () { return P.planner.i2cPre([4, 5]); };

  var X = {
    mosfet: {
      /* the load runs from its own supply; the gate draws next to nothing */
      max: 2, mA: 0, v: 'load', short: B('MOSFET', 'MOSFET'), needs: ['pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: [c.v + ' = PWM(Pin(' + c.p[0] + '), freq=1000)', c.v + '.duty_u16(0)'],
          loop: ['# ' + c.v + '.duty_u16(32768)           # 0 = off, 65535 = full power']
        };
      }
    },
    pcf8574: {
      max: 1, mA: 1, v: 'pcf', short: B('מרחיב פינים', 'Pin expander'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'] }, pre: I2C_PRE(),
          setup: ['i2c.writeto(0x20, b"\\xFF")              # PCF8574: all eight pins at 1, ready to be read'],
          loop: ['print("expander pins:", bin(i2c.readfrom(0x20, 1)[0]))']
        };
      }
    },
    ads1115: {
      max: 1, mA: 1, v: 'ads', short: B('ADS1115', 'ADS1115'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'], time: ['sleep_ms'] }, pre: I2C_PRE(), setup: [],
          helpers: {
            read_volts: [
              'def read_volts(channel):',
              '    # ADS1115 input 0 to 3, over the 4.096 V range',
              '    config = 0xC383 | (channel << 12)',
              '    i2c.writeto_mem(0x48, 1, bytes([config >> 8, config & 0xFF]))',
              '    sleep_ms(10)',
              '    data = i2c.readfrom_mem(0x48, 0, 2)',
              '    raw = (data[0] << 8) | data[1]',
              '    if raw > 32767:',
              '        raw = raw - 65536',
              '    return raw * 4.096 / 32768'
            ]
          },
          loop: ['print("A0: %.4f V" % read_volts(0))']
        };
      }
    },
    ina219: {
      max: 1, mA: 1, v: 'ina', short: B('מד זרם', 'Current meter'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'] }, pre: I2C_PRE(), setup: [],
          helpers: {
            read_power: [
              'def read_power():',
              '    # INA219: returns volts and milliamps of the measured circuit',
              '    d = i2c.readfrom_mem(0x40, 2, 2)',
              '    volts = (((d[0] << 8) | d[1]) >> 3) * 0.004',
              '    d = i2c.readfrom_mem(0x40, 1, 2)',
              '    shunt = (d[0] << 8) | d[1]',
              '    if shunt > 32767:',
              '        shunt = shunt - 65536',
              '    return volts, shunt * 0.1'
            ]
          },
          loop: ['volts, milliamps = read_power()', 'print("%.2f V   %.1f mA" % (volts, milliamps))']
        };
      }
    },
    aht20: {
      max: 1, mA: 1, v: 'aht', short: B('AHT20', 'AHT20'), needs: ['i2c', 'i2c'], delay: 2,
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'], time: ['sleep_ms'] }, pre: I2C_PRE(),
          setup: ['sleep_ms(40)', 'i2c.writeto(0x38, b"\\xBE\\x08\\x00")      # AHT20: switch on calibration', 'sleep_ms(10)'],
          helpers: {
            read_aht: [
              'def read_aht():',
              '    # returns temperature in C and humidity in %',
              '    i2c.writeto(0x38, b"\\xAC\\x33\\x00")',
              '    sleep_ms(80)',
              '    d = i2c.readfrom(0x38, 6)',
              '    raw_h = (d[1] << 12) | (d[2] << 4) | (d[3] >> 4)',
              '    raw_t = ((d[3] & 0x0F) << 16) | (d[4] << 8) | d[5]',
              '    return raw_t * 200 / 1048576 - 50, raw_h * 100 / 1048576'
            ]
          },
          loop: ['temp, hum = read_aht()', 'print("%.1f C   %.1f %%" % (temp, hum))']
        };
      }
    },
    hx711: {
      max: 1, mA: 2, v: 'scale', short: B('משקל', 'Scale'), needs: ['gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] },
          setup: ['hx_dt = Pin(' + c.p[0] + ', Pin.IN)', 'hx_sck = Pin(' + c.p[1] + ', Pin.OUT, value=0)'],
          helpers: {
            read_scale: [
              'def read_scale():',
              '    while hx_dt.value() == 1:        # wait for a measurement',
              '        pass',
              '    value = 0',
              '    for i in range(24):',
              '        hx_sck.on()',
              '        hx_sck.off()',
              '        value = (value << 1) | hx_dt.value()',
              '    hx_sck.on()',
              '    hx_sck.off()',
              '    if value & 0x800000:',
              '        value = value - 0x1000000',
              '    return value',
              '',
              'SCALE = 400                # raw steps per gram: set this by calibrating',
              'scale_zero = read_scale()  # keep the scale empty at start-up'
            ]
          },
          loop: ['print("%.0f g" % ((read_scale() - scale_zero) / SCALE))']
        };
      }
    },
    pca9685: {
      /* the servos it drives take their own 5 V feed */
      max: 1, mA: 10, v: 'pca', short: B('בקר סרוואים', 'Servo board'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'], time: ['sleep_ms'] }, pre: I2C_PRE(),
          setup: [
            'i2c.writeto_mem(0x40, 0x00, b"\\x10")     # PCA9685: sleep, so the speed can be changed',
            'i2c.writeto_mem(0x40, 0xFE, bytes([121]))  # 50 cycles a second',
            'i2c.writeto_mem(0x40, 0x00, b"\\x20")     # wake up',
            'sleep_ms(5)'
          ],
          helpers: {
            board_angle: [
              'def board_angle(channel, deg):',
              '    # channel 0 to 15 on the servo board, deg 0 to 180',
              '    us = 500 + deg * 2000 // 180',
              '    ticks = us * 4096 // 20000',
              '    i2c.writeto_mem(0x40, 0x06 + 4 * channel, bytes([0, 0, ticks & 0xFF, ticks >> 8]))'
            ]
          },
          loop: ['board_angle(0, 90)']
        };
      }
    },
    max6675: {
      /* GP rows: SCK (bus), CS (any pin), SO (bus) */
      max: 1, mA: 2, v: 'probe', short: B('מד חום גבוה', 'Thermocouple'), needs: ['spi', 'gpio', 'spi'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'SPI'] }, pre: SPI_PRE,
          setup: ['probe_cs = Pin(' + c.p[1] + ', Pin.OUT, value=1)'],
          helpers: {
            read_probe: [
              'def read_probe():',
              '    # returns degrees C, or None when the probe is not connected',
              '    probe_cs.low()',
              '    data = spi.read(2)',
              '    probe_cs.high()',
              '    value = (data[0] << 8) | data[1]',
              '    if value & 0x04:',
              '        return None',
              '    return (value >> 3) * 0.25'
            ]
          },
          loop: ['print("probe:", read_probe(), "C")']
        };
      }
    }
  };
  Object.keys(X).forEach(function (k) { PLAN[k] = X[k]; });
})(window.PICO);
