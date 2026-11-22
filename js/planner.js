/* Project planner: the student picks parts, and this assigns pins without
   collisions, then produces a wiring table, a rough power budget, a parts
   list and a combined MicroPython skeleton.

   The first copy of every part keeps the pins from its catalog page (those
   were chosen not to collide). Extra copies take pins from the free pool. */
(function (P) {
  'use strict';
  var T = P.t, S = P.s, esc = P.esc;

  var PICO_MA = 40;        // rough draw of the board itself
  var RAIL_3V3_MA = 300;   // sensible ceiling for 3V3(OUT)
  var USB_MA = 500;        // a standard computer USB port

  /* Per-part planning data. `needs` lists, in order, what each GPx row of the
     catalog wiring requires: gpio | adc | pwm | i2c (shared bus) | fixed. */
  var PLAN = {
    led: {
      max: 6, mA: 5, v: 'led', short: { he: 'לד', en: 'LED' }, needs: ['gpio'],
      gen: function (c) {
        return { from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.OUT)'], loop: [c.v + '.toggle()'] };
      }
    },
    button: {
      max: 6, mA: 0, v: 'button', short: { he: 'כפתור', en: 'Button' }, needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] },
          setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.IN, Pin.PULL_UP)'],
          loop: ['if ' + c.v + '.value() == 0:          # 0 = pressed', '    print("' + c.v + ' pressed")']
        };
      }
    },
    pot: {
      max: 3, mA: 1, v: 'pot', short: { he: 'פוטנציומטר', en: 'Pot' }, needs: ['adc'],
      gen: function (c) {
        return { from: { machine: ['ADC'] }, setup: [c.v + ' = ADC(' + c.p[0] + ')'], loop: ['print("' + c.v + ':", ' + c.v + '.read_u16())'] };
      }
    },
    ldr: {
      max: 3, mA: 1, v: 'ldr', short: { he: 'חיישן אור', en: 'LDR' }, needs: ['adc'],
      gen: function (c) {
        return {
          from: { machine: ['ADC'] }, setup: [c.v + ' = ADC(' + c.p[0] + ')'],
          loop: ['print("' + c.v + ':", ' + c.v + '.read_u16() * 100 // 65535, "%")']
        };
      }
    },
    buzzer: {
      max: 1, mA: 15, v: 'buzzer', short: { he: 'באזר', en: 'Buzzer' }, needs: ['pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'], time: ['sleep_ms'] },
          setup: [c.v + ' = PWM(Pin(' + c.p[0] + '))', c.v + '.duty_u16(0)'],
          helpers: {
            beep: [
              'def beep(freq=440, ms=100):',
              '    ' + c.v + '.freq(freq)',
              '    ' + c.v + '.duty_u16(32768)',
              '    sleep_ms(ms)',
              '    ' + c.v + '.duty_u16(0)'
            ]
          },
          loop: ['# beep(880)                      # call this when you want a sound']
        };
      }
    },
    servo: {
      max: 4, mA: 150, peak: 650, v: 'servo', short: { he: 'סרבו', en: 'Servo' }, needs: ['pwm'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'PWM'] },
          setup: [c.v + ' = PWM(Pin(' + c.p[0] + '), freq=50)'],
          helpers: {
            set_angle: [
              'def set_angle(servo, deg):',
              '    # 0.5 ms pulse = 0 deg, 2.5 ms pulse = 180 deg',
              '    servo.duty_ns(500_000 + int(deg / 180 * 2_000_000))'
            ]
          },
          loop: ['set_angle(' + c.v + ', 90)']
        };
      }
    },
    hcsr04: {
      max: 2, mA: 15, v: 'sonar', short: { he: 'HC-SR04', en: 'HC-SR04' }, needs: ['gpio', 'gpio'],
      gen: function (c) {
        var trig = 'trig' + c.sfx, echo = 'echo' + c.sfx;
        return {
          from: { machine: ['Pin', 'time_pulse_us'], time: ['sleep_us'] },
          setup: [trig + ' = Pin(' + c.p[0] + ', Pin.OUT)', echo + ' = Pin(' + c.p[1] + ', Pin.IN)'],
          helpers: {
            distance_cm: [
              'def distance_cm(trig, echo):',
              '    trig.low()',
              '    sleep_us(2)',
              '    trig.high()',
              '    sleep_us(10)',
              '    trig.low()',
              '    t = time_pulse_us(echo, 1, 30000)',
              '    return None if t < 0 else t * 0.0343 / 2'
            ]
          },
          loop: ['print("distance' + c.sfx + ':", distance_cm(' + trig + ', ' + echo + '), "cm")']
        };
      }
    },
    pir: {
      max: 2, mA: 1, v: 'pir', short: { he: 'PIR', en: 'PIR' }, needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'] }, setup: [c.v + ' = Pin(' + c.p[0] + ', Pin.IN)'],
          loop: ['if ' + c.v + '.value():', '    print("' + c.v + ': motion")']
        };
      }
    },
    dht22: {
      max: 2, mA: 2, v: 'dht_sensor', short: { he: 'DHT22', en: 'DHT22' }, needs: ['gpio'], delay: 2,
      gen: function (c) {
        return {
          mods: ['dht'], from: { machine: ['Pin'] },
          setup: [c.v + ' = dht.DHT22(Pin(' + c.p[0] + '))'],
          loop: [c.v + '.measure()', 'print("temp:", ' + c.v + '.temperature(), "C  humidity:", ' + c.v + '.humidity(), "%")']
        };
      }
    },
    ds18b20: {
      max: 1, mA: 2, v: 'ds', short: { he: 'DS18B20', en: 'DS18B20' }, needs: ['gpio'],
      gen: function (c) {
        return {
          mods: ['onewire', 'ds18x20'], from: { machine: ['Pin'], time: ['sleep_ms'] },
          setup: ['ds = ds18x20.DS18X20(onewire.OneWire(Pin(' + c.p[0] + ')))', 'roms = ds.scan()'],
          loop: ['ds.convert_temp()', 'sleep_ms(750)', 'for rom in roms:', '    print("temp:", ds.read_temp(rom), "C")']
        };
      }
    },
    oled: {
      max: 1, mA: 20, v: 'oled', short: { he: 'OLED', en: 'OLED' }, needs: ['i2c', 'i2c'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'I2C'], ssd1306: ['SSD1306_I2C'] }, pre: i2cPre(c.p),
          setup: ['oled = SSD1306_I2C(128, 64, i2c)'],
          loop: ['oled.fill(0)', 'oled.text("Hello Pico 2", 0, 0)', 'oled.show()']
        };
      }
    },
    bh1750: {
      max: 1, mA: 1, v: 'bh1750', short: { he: 'BH1750', en: 'BH1750' }, needs: ['i2c', 'i2c'],
      gen: function (c) {
        return {
          from: { machine: ['Pin', 'I2C'], time: ['sleep_ms'] }, pre: i2cPre(c.p), setup: [],
          helpers: {
            read_lux: [
              'def read_lux():',
              '    i2c.writeto(0x23, b"\\x20")',
              '    sleep_ms(180)',
              '    data = i2c.readfrom(0x23, 2)',
              '    return (data[0] << 8 | data[1]) / 1.2'
            ]
          },
          loop: ['print("lux:", round(read_lux()))']
        };
      }
    },
    mpu6050: {
      max: 1, mA: 4, v: 'mpu', short: { he: 'MPU6050', en: 'MPU6050' }, needs: ['i2c', 'i2c'],
      gen: function (c) {
        return {
          mods: ['struct'], from: { machine: ['Pin', 'I2C'] }, pre: i2cPre(c.p),
          setup: ['i2c.writeto_mem(0x68, 0x6B, b"\\x00")   # wake the MPU6050'],
          loop: [
            'ax, ay, az = struct.unpack(">hhh", i2c.readfrom_mem(0x68, 0x3B, 6))',
            'print("accel:", ax / 16384, ay / 16384, az / 16384)'
          ]
        };
      }
    },
    neopixel: {
      max: 2, mA: 60, peak: 480, v: 'strip', short: { he: 'NeoPixel', en: 'NeoPixel' }, needs: ['gpio'],
      gen: function (c) {
        return {
          from: { machine: ['Pin'], neopixel: ['NeoPixel'] },
          setup: [c.v + ' = NeoPixel(Pin(' + c.p[0] + '), 8)'],
          loop: [c.v + '.fill((0, 20, 40))           # keep it dim', c.v + '.write()']
        };
      }
    },
    sdcard: {
      max: 1, mA: 30, v: 'sd', short: { he: 'microSD', en: 'microSD' }, needs: ['spi', 'spi', 'spi', 'gpio'],
      gen: function (c) {
        return {
          mods: ['os', 'sdcard'], from: { machine: ['Pin', 'SPI'] },
          setup: [
            'spi = SPI(0, baudrate=1_000_000, sck=Pin(' + c.p[0] + '), mosi=Pin(' + c.p[1] + '), miso=Pin(' + c.p[2] + '))',
            'sd = sdcard.SDCard(spi, Pin(' + c.p[3] + ', Pin.OUT))',
            'os.mount(sd, "/sd")'
          ],
          loop: ['with open("/sd/log.txt", "a") as f:', '    f.write("tick\\n")']
        };
      }
    },
    gps: {
      max: 1, mA: 45, v: 'gps', short: { he: 'GPS', en: 'GPS' }, needs: ['fixed', 'fixed'],
      gen: function (c) {
        /* catalog rows are GPS-TX -> Pico RX first, then GPS-RX -> Pico TX */
        return {
          from: { machine: ['Pin', 'UART'] },
          setup: ['gps = UART(1, baudrate=9600, tx=Pin(' + c.p[1] + '), rx=Pin(' + c.p[0] + '))'],
          loop: ['line = gps.readline()', 'if line and b"GGA" in line:', '    print(line)']
        };
      }
    }
  };

  function i2cPre(p) {
    return {
      i2c: [
        'i2c = I2C(0, sda=Pin(' + p[0] + '), scl=Pin(' + p[1] + '), freq=400_000)',
        'print("I2C devices:", [hex(a) for a in i2c.scan()])'
      ]
    };
  }

  function gpOf(name) { var m = /^GP(\d+)$/.exec(name); return m ? parseInt(m[1], 10) : null; }

  /* Every GP pin that some catalog part uses by default. Extra copies avoid
     these first, so adding another part later does not reshuffle the plan. */
  var catalogPins = {};
  P.components.forEach(function (c) {
    c.wiring.forEach(function (w) { var g = gpOf(w.to); if (g != null) catalogPins[g] = true; });
  });
  var headerGps = P.pins.filter(function (p) { return p.kind === 'gpio'; }).map(function (p) { return p.gp; });

  /* sel: [{id, qty}] -> { instances, errors, usedCount } */
  function allocate(sel) {
    var used = {};      // gp -> { share }
    var slices = {};    // pwm slice -> { group, chans }
    var errors = [];
    var instances = [];

    sel.forEach(function (s) {
      var comp = P.componentById(s.id), plan = PLAN[s.id];
      if (!comp || !plan) return;
      for (var k = 0; k < s.qty; k++) {
        var sfx = s.qty > 1 ? String(k + 1) : '';
        instances.push({
          comp: comp, plan: plan, k: k, sfx: sfx,
          name: T(comp.name) + (sfx ? ' ' + sfx : ''),
          short: T(plan.short) + (sfx ? ' ' + sfx : ''),
          gpRows: comp.wiring.filter(function (w) { return gpOf(w.to) != null; }),
          pins: []
        });
      }
    });

    function can(gp, need, group) {
      if (used[gp]) return (need === 'i2c' || need === 'spi') && used[gp].share === need;   /* bus pins are shared */
      if (need === 'adc') return gp >= 26 && gp <= 28;
      if (need === 'pwm') {
        var s = slices[(gp >> 1) & 7];
        return !s || (s.group === group && !s.chans[gp & 1]);
      }
      return true;
    }
    function claim(gp, need, group) {
      used[gp] = { share: need === 'i2c' || need === 'spi' ? need : null };
      if (need === 'pwm') {
        var i = (gp >> 1) & 7;
        slices[i] = slices[i] || { group: group, chans: {} };
        slices[i].chans[gp & 1] = true;
      }
    }

    /* Pass 1: the first copy of each part keeps its catalog pins. */
    /* Needs that only one pin can serve (a bus, a fixed pin) are served
       first, so a part that could sit anywhere does not block them. */
    [true, false].forEach(function (rigidRound) {
      instances.forEach(function (inst) {
        if (inst.k !== 0) return;
        inst.gpRows.forEach(function (row, j) {
          var gp = gpOf(row.to), need = inst.plan.needs[j];
          var rigid = need === 'fixed' || need === 'i2c' || need === 'spi';
          if (rigid !== rigidRound || inst.pins[j] != null) return;
          if (can(gp, need, inst.comp.id)) { claim(gp, need, inst.comp.id); inst.pins[j] = gp; }
        });
      });
    });

    /* Pass 2: everything still unassigned takes a pin from the free pool. */
    var pool = headerGps.slice().sort(function (a, b) {
      var ka = (a >= 26 ? 2 : catalogPins[a] ? 1 : 0), kb = (b >= 26 ? 2 : catalogPins[b] ? 1 : 0);
      return ka - kb || a - b;
    });
    /* Analog needs go first: only three pins can serve them, so digital
       parts must not take those while an analog part is still waiting. */
    [true, false].forEach(function (adcRound) {
      instances.forEach(function (inst) {
        inst.gpRows.forEach(function (row, j) {
          var need = inst.plan.needs[j];
          if (inst.pins[j] != null || (need === 'adc') !== adcRound) return;
          var candidates = need === 'adc' ? [26, 27, 28] : need === 'fixed' || need === 'i2c' || need === 'spi' ? [] : pool;
          for (var i = 0; i < candidates.length; i++) {
            if (can(candidates[i], need, inst.comp.id)) {
              claim(candidates[i], need, inst.comp.id); inst.pins[j] = candidates[i]; return;
            }
          }
          if (!inst.failed) errors.push({ inst: inst, need: need });
          inst.failed = true;
        });
      });
    });

    /* Wiring rows with the assigned pins filled in. */
    instances.forEach(function (inst) {
      var j = 0;
      inst.rows = inst.comp.wiring.map(function (w) {
        var gp = gpOf(w.to);
        if (gp == null) return { part: w.part, pin: P.pinByNum(w.num), note: w.note, power: true };
        var got = inst.pins[j++];
        if (got == null) return { part: w.part, pin: null, note: null };
        var pin = P.pinByName('GP' + got), note = w.note;
        if (note && got !== gp) {
          var fix = function (s) {
            return s.replace(new RegExp('GP' + gp + '\\b', 'g'), 'GP' + got).replace(/ADC\d/g, 'ADC' + (got - 26));
          };
          note = { he: fix(note.he), en: fix(note.en) };
        }
        return { part: w.part, pin: pin, note: note };
      });
    });

    return {
      instances: instances, errors: errors, usedCount: Object.keys(used).length,
      /* used by links between boards, which reserve pins after the parts have theirs */
      isFree: function (gp) { return !used[gp]; },
      take: function (gp) { used[gp] = { share: null }; },
      pool: pool,
      count: function () { return Object.keys(used).length; }
    };
  }

  /* Combined MicroPython skeleton for the whole plan. */
  /* extras: ready-made snippets ({ title, from, mods, pre, helpers, setup, loop }) for links between boards */
  function generate(result, extras, header) {
    var mods = [], from = { machine: [], time: ['sleep'] }, pre = {}, helpers = {};
    var setup = [], loop = [], delay = 0.5;
    var add = function (arr, v) { if (arr.indexOf(v) < 0) arr.push(v); };
    function merge(g, title) {
      (g.mods || []).forEach(function (m) { add(mods, m); });
      Object.keys(g.from || {}).forEach(function (m) {
        from[m] = from[m] || [];
        g.from[m].forEach(function (n) { add(from[m], n); });
      });
      Object.keys(g.pre || {}).forEach(function (k) { pre[k] = pre[k] || g.pre[k]; });
      Object.keys(g.helpers || {}).forEach(function (k) { helpers[k] = helpers[k] || g.helpers[k]; });
      if (g.setup && g.setup.length) {
        setup.push('# ' + title);
        setup = setup.concat(g.setup);
      }
      loop = loop.concat((g.loop || []).map(function (l) { return '    ' + l; }));
    }

    result.instances.forEach(function (inst) {
      if (inst.failed || !inst.plan) return;
      merge(inst.plan.gen({ v: inst.plan.v + inst.sfx, sfx: inst.sfx, p: inst.pins, role: inst.role }), inst.comp.name.en + (inst.sfx ? ' ' + inst.sfx : ''));
      if (inst.plan.delay) delay = Math.max(delay, inst.plan.delay);
    });
    (extras || []).forEach(function (g) { merge(g, g.title); });

    var out = [header || '# Project skeleton from Pico 2 Lab. A starting point: run it, then make it yours.'];
    if (mods.length) out.push('import ' + mods.join(', '));
    ['machine', 'time'].concat(Object.keys(from).filter(function (m) { return m !== 'machine' && m !== 'time'; }))
      .forEach(function (m) { if (from[m].length) out.push('from ' + m + ' import ' + from[m].join(', ')); });
    out.push('');
    Object.keys(pre).forEach(function (k) { out = out.concat(pre[k]); out.push(''); });
    out = out.concat(setup);
    Object.keys(helpers).forEach(function (k) { out.push(''); out = out.concat(helpers[k]); });
    out.push('', 'while True:');
    out = out.concat(loop);
    out.push('    sleep(' + delay + ')');
    return out;
  }

  /* ---------- selection state: URL first, then the last saved plan ---------- */
  function parseSel(str) {
    var sel = [];
    (str || '').split(',').forEach(function (tok) {
      var m = /^([a-z0-9]+)(?::(\d+))?$/.exec(tok.trim());
      if (!m || !PLAN[m[1]]) return;
      var qty = Math.max(1, Math.min(PLAN[m[1]].max, parseInt(m[2] || '1', 10)));
      if (!sel.some(function (s) { return s.id === m[1]; })) sel.push({ id: m[1], qty: qty });
    });
    return sel;
  }
  function selString(sel) {
    return sel.map(function (s) { return s.id + (s.qty > 1 ? ':' + s.qty : ''); }).join(',');
  }
  function loadSaved() {
    try { return parseSel(localStorage.getItem('pico.plan')); } catch (e) { return []; }
  }
  function save(sel) {
    try { localStorage.setItem('pico.plan', selString(sel)); } catch (e) { /* ignore */ }
  }

  P.planner = { PLAN: PLAN, allocate: allocate, generate: generate, parseSel: parseSel, selString: selString, i2cPre: i2cPre, gpOf: gpOf, PICO_MA: PICO_MA, RAIL_3V3_MA: RAIL_3V3_MA, USB_MA: USB_MA };
})(window.PICO);
