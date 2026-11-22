/* Planner data for the newer catalog parts: how many may be used, typical
   current, what each pin needs (in the order of the GP rows of the part's
   wiring table) and the MicroPython lines for the combined program. */
(function (P) {
  'use strict';
  var PLAN = P.planner.PLAN;
  var B = function (he, en) { return { he: he, en: en }; };

  /* SPI parts share one bus on the fixed SPI0 pins. */
  var SPI_PRE = { spi: ['spi = SPI(0, baudrate=1_000_000, sck=Pin(18), mosi=Pin(19), miso=Pin(16))'] };
  var I2C_PRE = function () { return P.planner.i2cPre([4, 5]); };

  PLAN.sdcard.gen = function (c) {
    return {
      mods: ['os', 'sdcard'], from: { machine: ['Pin', 'SPI'] }, pre: SPI_PRE,
      setup: ['sd = sdcard.SDCard(spi, Pin(' + c.p[3] + ', Pin.OUT))', 'os.mount(sd, "/sd")'],
      loop: ['with open("/sd/log.txt", "a") as f:', '    f.write("tick\\n")']
    };
  };

  var X = {
    /* ---------------- movement and switching ---------------- */
    relay: {
      max: 2, mA: 70, v: 'relay', short: B('ממסר', 'Relay'), needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.OUT)'],
          loop: ['# ' + c.v + '.on()                      # switch the relay when you need it']
        };
      }
    },
    motor: {
      max: 1, mA: 200, peak: 1000, v: 'motor', short: B('מנוע DC', 'DC motor'), needs: ['pwm', 'pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: ['in1 = PWM(Pin(' + c.p[0] + '), freq=1000)', 'in2 = PWM(Pin(' + c.p[1] + '), freq=1000)'],
          helpers: {
            motor: [
              'def motor(speed):',
              '    # speed from -100 (full reverse) to 100 (full forward), 0 stops',
              '    duty = int(abs(speed) * 65535 / 100)',
              '    in1.duty_u16(duty if speed > 0 else 0)',
              '    in2.duty_u16(duty if speed < 0 else 0)'
            ]
          },
          loop: ['# motor(60)                         # call this to run the motor']
        };
      }
    },
    stepper: {
      max: 1, mA: 240, v: 'stepper', short: B('מנוע צעד', 'Stepper'), needs: ['gpio', 'gpio', 'gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'], time: ['sleep_ms'] },
          setup: ['coils = [Pin(' + c.p[0] + ', Pin.OUT), Pin(' + c.p[1] + ', Pin.OUT), Pin(' + c.p[2] + ', Pin.OUT), Pin(' + c.p[3] + ', Pin.OUT)]'],
          helpers: {
            step: [
              'SEQ = [(1, 0, 0, 0), (1, 1, 0, 0), (0, 1, 0, 0), (0, 1, 1, 0), (0, 0, 1, 0), (0, 0, 1, 1), (0, 0, 0, 1), (1, 0, 0, 1)]',
              '',
              'def step(count):',
              '    # 512 = one full turn of the output shaft',
              '    for i in range(count):',
              '        for pattern in SEQ:',
              '            for pin, value in zip(coils, pattern):',
              '                pin.value(value)',
              '            sleep_ms(2)'
            ]
          },
          loop: ['# step(64)                          # call this to turn the motor']
        };
      }
    },
    rgb: {
      max: 1, mA: 20, v: 'rgb', short: B('לד RGB', 'RGB LED'), needs: ['pwm', 'pwm', 'pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: ['red = PWM(Pin(' + c.p[0] + '), freq=1000)', 'green = PWM(Pin(' + c.p[1] + '), freq=1000)', 'blue = PWM(Pin(' + c.p[2] + '), freq=1000)'],
          helpers: {
            color: ['def color(r, g, b):', '    # each value from 0 to 255', '    red.duty_u16(r * 257)', '    green.duty_u16(g * 257)', '    blue.duty_u16(b * 257)']
          },
          loop: ['color(0, 40, 80)']
        };
      }
    },

    /* ---------------- input from the user ---------------- */
    joystick: {
      max: 1, mA: 1, v: 'joy', short: B('ג\'ויסטיק', 'Joystick'), needs: ['adc', 'adc', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'ADC'] },
          setup: ['joy_x = ADC(' + c.p[0] + ')', 'joy_y = ADC(' + c.p[1] + ')', 'joy_sw = Pin(' + c.p[2] + ', Pin.IN, Pin.PULL_UP)'],
          loop: ['print("joystick:", joy_x.read_u16(), joy_y.read_u16(), joy_sw.value())']
        };
      }
    },
    encoder: {
      max: 1, mA: 1, v: 'enc', short: B('מקודד', 'Encoder'), needs: ['gpio', 'gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] },
          setup: ['enc_clk = Pin(' + c.p[0] + ', Pin.IN, Pin.PULL_UP)', 'enc_dt = Pin(' + c.p[1] + ', Pin.IN, Pin.PULL_UP)', 'enc_sw = Pin(' + c.p[2] + ', Pin.IN, Pin.PULL_UP)', 'position = 0'],
          helpers: {
            on_turn: ['def on_turn(pin):', '    global position', '    position += 1 if enc_dt.value() else -1', '', 'enc_clk.irq(trigger=Pin.IRQ_FALLING, handler=on_turn)']
          },
          loop: ['print("position:", position)']
        };
      }
    },
    keypad: {
      max: 1, mA: 0, v: 'keypad', short: B('לוח מקשים', 'Keypad'), needs: ['gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio', 'gpio'],
      gen: function (c) {
        var p = c.p;
        return {
          from: { machine: ['Pin'] },
          setup: [
            'key_rows = [Pin(n, Pin.OUT, value=1) for n in (' + p.slice(0, 4).join(', ') + ')]',
            'key_cols = [Pin(n, Pin.IN, Pin.PULL_UP) for n in (' + p.slice(4, 8).join(', ') + ')]',
            'KEYS = ["123A", "456B", "789C", "*0#D"]'
          ],
          helpers: {
            read_key: [
              'def read_key():',
              '    for r, row in enumerate(key_rows):',
              '        row.low()',
              '        for col_n, col in enumerate(key_cols):',
              '            if col.value() == 0:',
              '                row.high()',
              '                return KEYS[r][col_n]',
              '        row.high()',
              '    return None'
            ]
          },
          loop: ['key = read_key()', 'if key:', '    print("key:", key)']
        };
      }
    },
    touch: {
      max: 2, mA: 2, v: 'touch', short: B('מגע', 'Touch'), needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.IN)'], loop: ['if ' + c.v + '.value():', '    print("' + c.v + ': touched")'] };
      }
    },
    irrecv: {
      max: 1, mA: 1, v: 'ir', short: B('מקלט IR', 'IR receiver'), needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'time_pulse_us'] },
          setup: ['ir = Pin(' + c.p[0] + ', Pin.IN)'],
          helpers: {
            read_ir: [
              'def read_ir():',
              '    # returns the code of the remote button, or None',
              '    if time_pulse_us(ir, 0, 100000) < 8000:    # the 9 ms start burst',
              '        return None',
              '    if time_pulse_us(ir, 1, 10000) < 4000:     # the 4.5 ms gap',
              '        return None',
              '    code = 0',
              '    for i in range(32):',
              '        t = time_pulse_us(ir, 1, 5000)',
              '        if t < 0:',
              '            return None',
              '        code = (code << 1) | (1 if t > 1000 else 0)',
              '    return code'
            ]
          },
          loop: ['code = read_ir()', 'if code:', '    print("remote:", hex(code))']
        };
      }
    },

    /* ---------------- more sensors ---------------- */
    bme280: {
      max: 1, mA: 1, v: 'bme', short: B('BME280', 'BME280'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          mods: ['bme280'], from: { machine: ['Pin', 'I2C'] }, pre: I2C_PRE(),
          setup: ['bme = bme280.BME280(i2c=i2c)             # third-party library, see the part page'],
          loop: ['print("bme280:", bme.values)']
        };
      }
    },
    soil: {
      max: 1, mA: 5, v: 'soil', short: B('לחות קרקע', 'Soil'), needs: ['adc'],
      gen: function (c) {
        return { from: { machine: ['ADC'] }, setup: ['soil = ADC(' + c.p[0] + ')'], loop: ['print("soil:", 100 - soil.read_u16() * 100 // 65535, "%")'] };
      }
    },
    sound: {
      max: 1, mA: 5, v: 'sound', short: B('חיישן קול', 'Sound'), needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: ['sound = Pin(' + c.p[0] + ', Pin.IN)'], loop: ['if sound.value():', '    print("sound!")'] };
      }
    },
    mq2: {
      max: 1, mA: 150, v: 'gas', short: B('חיישן גז', 'Gas sensor'), needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: ['gas = Pin(' + c.p[0] + ', Pin.IN)'], loop: ['if gas.value() == 0:            # this module pulls the line low on gas', '    print("gas detected")'] };
      }
    },
    tilt: {
      max: 2, mA: 1, v: 'tilt', short: B('הטיה', 'Tilt'), needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.IN)'], loop: ['print("' + c.v + ':", ' + c.v + '.value())'] };
      }
    },
    hall: {
      max: 2, mA: 5, v: 'hall', short: B('חיישן הול', 'Hall'), needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.IN, Pin.PULL_UP)'], loop: ['if ' + c.v + '.value() == 0:', '    print("' + c.v + ': magnet")'] };
      }
    },

    /* ---------------- display, time and identity ---------------- */
    lcd1602: {
      max: 1, mA: 25, v: 'lcd', short: B('LCD', 'LCD'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'], pico_lcd: ['LCD'] }, pre: I2C_PRE(),
          setup: ['lcd = LCD(i2c)                           # pico_lcd.py is on the part page'],
          loop: ['lcd.move(0, 0)', 'lcd.write("Hello Pico 2")']
        };
      }
    },
    tm1637: {
      max: 1, mA: 30, v: 'digits', short: B('ספרות', 'Digits'), needs: ['gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'], pico_tm1637: ['TM1637'] },
          setup: ['digits = TM1637(Pin(' + c.p[0] + '), Pin(' + c.p[1] + '))    # pico_tm1637.py is on the part page'],
          loop: ['digits.number(1234)']
        };
      }
    },
    max7219: {
      max: 1, mA: 150, peak: 320, v: 'matrix', short: B('מטריצת לדים', 'LED matrix'), needs: ['spi', 'spi', 'gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'SPI'], pico_max7219: ['Matrix'] }, pre: SPI_PRE,
          setup: ['matrix = Matrix(spi, Pin(' + c.p[2] + ', Pin.OUT))     # pico_max7219.py is on the part page'],
          loop: ['matrix.fill(0)', 'matrix.pixel(3, 3, 1)', 'matrix.show()']
        };
      }
    },
    ds3231: {
      max: 1, mA: 1, v: 'rtc', short: B('שעון', 'Clock'), needs: ['i2c', 'i2c'],
      gen: function () {
        return {
          from: { machine: ['Pin', 'I2C'] }, pre: I2C_PRE(), setup: [],
          helpers: {
            read_time: [
              'def read_time():',
              '    d = i2c.readfrom_mem(0x68, 0, 3)          # seconds, minutes, hours',
              '    bcd = lambda v: (v >> 4) * 10 + (v & 0x0F)',
              '    return bcd(d[2] & 0x3F), bcd(d[1]), bcd(d[0])'
            ]
          },
          loop: ['print("time: %02d:%02d:%02d" % read_time())']
        };
      }
    },
    rc522: {
      max: 1, mA: 30, v: 'reader', short: B('RFID', 'RFID'), needs: ['spi', 'spi', 'spi', 'gpio', 'gpio'],
      gen: function (c) {
        return {
          from: { mfrc522: ['MFRC522'] },
          setup: ['reader = MFRC522(spi_id=0, sck=' + c.p[0] + ', mosi=' + c.p[1] + ', miso=' + c.p[2] + ', cs=' + c.p[3] + ', rst=' + c.p[4] + ')   # third-party library'],
          loop: [
            'reader.init()',
            'stat, tag_type = reader.request(reader.REQIDL)',
            'if stat == reader.OK:',
            '    stat, uid = reader.SelectTagSN()',
            '    if stat == reader.OK:',
            '        print("card:", uid)'
          ]
        };
      }
    },
    hc05: {
      max: 1, mA: 30, v: 'bt', short: B('Bluetooth', 'Bluetooth'), needs: ['fixed', 'fixed'],
      gen: function (c) {
        /* wiring rows: module TXD -> Pico RX first, then module RXD <- Pico TX */
        return {
          from: { machine: ['Pin', 'UART'] },
          setup: ['bt = UART(1, baudrate=9600, tx=Pin(' + c.p[1] + '), rx=Pin(' + c.p[0] + '))'],
          loop: ['if bt.any():', '    print("bluetooth:", bt.readline())']
        };
      }
    },
    nrf24: {
      max: 1, mA: 15, v: 'nrf', short: B('רדיו', 'Radio'), needs: ['spi', 'spi', 'spi', 'gpio', 'gpio'],
      gen: function (c) {
        var base = {
          from: { machine: ['Pin', 'SPI'], nrf24l01: ['NRF24L01'] }, pre: SPI_PRE,
          setup: [
            'nrf = NRF24L01(spi, Pin(' + c.p[3] + ', Pin.OUT), Pin(' + c.p[4] + ', Pin.OUT), payload_size=8)',
            'ADDRESS = b"pico1"'
          ]
        };
        if (c.role === 'tx') {
          base.setup.push('nrf.open_tx_pipe(ADDRESS)', 'nrf.stop_listening()');
          base.loop = ['try:', '    nrf.send(b"hello")', 'except OSError:', '    print("radio: nobody answered")'];
        } else {
          base.setup.push('nrf.open_rx_pipe(1, ADDRESS)', 'nrf.start_listening()');
          base.loop = ['if nrf.any():', '    print("radio got:", nrf.recv())'];
        }
        return base;
      }
    }
  };
  Object.keys(X).forEach(function (k) { PLAN[k] = X[k]; });
})(window.PICO);
