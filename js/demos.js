/* Small interactive demos for the interface pages. Each demo is a function
   that fills a container element; none of them needs a real board. */
(function (P) {
  'use strict';
  var T = P.t, esc = P.esc;

  function h(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.firstElementChild;
  }
  function bits(value, n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) out.push((value >> i) & 1);
    return out; // MSB first
  }
  function hex2(v) { return ('0' + v.toString(16)).slice(-2); }

  /* Generic logic-analyser style drawing.
     cfg: { tw, lanes:[{name, levels[], color}], sections:[{from,to,label}], cells:[{from,to,text}], active } */
  function wave(cfg) {
    var tw = cfg.tw, left = 52, laneH = 46, top = 52;
    var ticks = cfg.lanes[0].levels.length;
    var w = left + ticks * tw + 10;
    var ht = top + cfg.lanes.length * laneH + 4;
    var s = '<svg class="wave" width="' + w + '" height="' + ht + '" viewBox="0 0 ' + w + ' ' + ht + '" role="img">';

    (cfg.sections || []).forEach(function (sec, i) {
      var x = left + sec.from * tw, sw = (sec.to - sec.from) * tw;
      var act = cfg.active === i;
      if (act) s += '<rect class="band" x="' + x + '" y="26" width="' + sw + '" height="' + (ht - 28) + '" rx="4"/>';
      s += '<g class="sec' + (act ? ' act' : '') + '"><rect x="' + (x + 1) + '" y="3" width="' + (sw - 2) + '" height="20" rx="4"/>' +
        '<text x="' + (x + sw / 2) + '" y="17" text-anchor="middle">' + esc(sec.label) + '</text></g>';
    });
    (cfg.cells || []).forEach(function (c) {
      var x = left + c.from * tw, cw = (c.to - c.from) * tw;
      s += '<g class="cell"><text x="' + (x + cw / 2) + '" y="42" text-anchor="middle">' + esc(c.text) + '</text></g>';
      s += '<line class="grid-line" x1="' + x + '" y1="48" x2="' + x + '" y2="' + (ht - 4) + '"/>';
    });

    cfg.lanes.forEach(function (lane, li) {
      var y0 = top + li * laneH;
      var yy = function (lv) { return y0 + (lv ? 8 : 34); };
      var d = 'M' + left + ' ' + yy(lane.levels[0]);
      for (var i = 0; i < ticks; i++) {
        var x = left + i * tw;
        if (i > 0 && lane.levels[i] !== lane.levels[i - 1]) d += ' L' + x + ' ' + yy(lane.levels[i]);
        d += ' L' + (x + tw) + ' ' + yy(lane.levels[i]);
      }
      s += '<text class="lane-name" x="4" y="' + (y0 + 26) + '">' + esc(lane.name) + '</text>';
      s += '<path d="' + d + '" fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:var(' + lane.color + ')"/>';
    });
    return s + '</svg>';
  }

  var demos = {};

  /* ---------- GPIO: button with pull-up ---------- */
  demos.gpio = function (root) {
    var L = {
      title: { he: 'כפתור עם נגד המשיכה הפנימי', en: 'A button with the internal pull-up' },
      hold: { he: 'לחצו והחזיקו', en: 'Press and hold' },
      val: { he: 'button.value()', en: 'button.value()' },
      volt: { he: 'המתח על GP14', en: 'Voltage on GP14' },
      led: { he: 'הלד שעל GP15', en: 'The LED on GP15' },
      on: { he: 'דולק', en: 'on' }, off: { he: 'כבוי', en: 'off' },
      up: {
        he: 'הכפתור משוחרר. נגד המשיכה מחבר את הפין ל-3.3V, ולכן הפין קורא 1.',
        en: 'The button is released. The pull-up connects the pin to 3.3 V, so it reads 1.'
      },
      down: {
        he: 'הכפתור לחוץ. הפין מחובר ישירות לאדמה, ולכן הוא קורא 0. הנגד מונע קצר בין 3.3V לאדמה.',
        en: 'The button is pressed. The pin is connected straight to ground, so it reads 0. The resistor prevents a short between 3.3 V and ground.'
      }
    };
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px">' +
      '<svg class="schem ltr" width="250" height="190" viewBox="0 0 250 190">' +
      '<text x="20" y="16">3V3</text><path class="w hot" d="M32 22 V40"/>' +
      '<rect x="24" y="40" width="16" height="36" rx="3" fill="none" class="w"/>' +
      '<text x="48" y="62">pull-up</text>' +
      '<path class="w" d="M32 76 V104"/><path class="w" d="M32 96 H120"/>' +
      '<circle class="node" cx="32" cy="96" r="5"/>' +
      '<rect x="120" y="82" width="74" height="28" rx="6" style="fill:var(--c-gpio)"/><text x="138" y="101" style="fill:#fff;font-weight:700">GP14</text>' +
      '<circle cx="32" cy="108" r="3" style="fill:var(--ink)"/><circle cx="32" cy="142" r="3" style="fill:var(--ink)"/>' +
      '<path class="w sw" d="M32 108 L52 138"/>' +
      '<path class="w" d="M32 142 V164 M18 164 H46 M23 170 H41 M28 176 H36"/>' +
      '<text x="56" y="170">GND</text></svg>' +
      '<div><button type="button" class="press">' + T(L.hold) + '</button></div>' +
      '<div class="led-vis"><i style="opacity:0"></i></div>' +
      '</div>' +
      '<div class="readouts">' +
      '<div class="readout"><span class="ltr">' + T(L.val) + '</span><b data-k="v">1</b></div>' +
      '<div class="readout"><span>' + T(L.volt) + '</span><b data-k="u">3.3 V</b></div>' +
      '<div class="readout"><span>' + T(L.led) + '</span><b data-k="l" style="font-family:inherit">' + T(L.off) + '</b></div>' +
      '</div><p class="muted" data-k="x" style="margin:0"></p></div>'
    );
    var btn = el.querySelector('.press'), sw = el.querySelector('.sw');
    function set(down) {
      btn.classList.toggle('down', down);
      sw.setAttribute('d', down ? 'M32 108 L32 142' : 'M32 108 L52 138');
      el.querySelector('[data-k=v]').textContent = down ? '0' : '1';
      el.querySelector('[data-k=u]').textContent = down ? '0 V' : '3.3 V';
      el.querySelector('[data-k=l]').textContent = T(down ? L.on : L.off);
      el.querySelector('[data-k=x]').textContent = T(down ? L.down : L.up);
      el.querySelector('.led-vis i').style.opacity = down ? 1 : 0;
    }
    btn.addEventListener('pointerdown', function (e) { btn.setPointerCapture(e.pointerId); set(true); });
    btn.addEventListener('pointerup', function () { set(false); });
    btn.addEventListener('pointercancel', function () { set(false); });
    btn.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); set(true); } });
    btn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') set(false); });
    set(false);
    root.appendChild(el);
  };

  /* ---------- ADC ---------- */
  demos.adc = function (root) {
    var L = {
      title: { he: 'ממתח למספר', en: 'From a voltage to a number' },
      volt: { he: 'המתח על GP26', en: 'Voltage on GP26' },
      raw12: { he: 'הערך הגולמי (12 ביט)', en: 'Raw value (12-bit)' },
      pct: { he: 'אחוז מהטווח', en: 'Percent of range' },
      note: {
        he: 'הזיזו את המחוון כאילו אתם מסובבים פוטנציומטר. שימו לב שהערך משתנה בצעדים של 16: זו התוצאה של 12 ביט, שנמתחה ל-16 ביט.',
        en: 'Move the slider as if you were turning a potentiometer. Notice the value moves in steps of 16: that is the 12-bit result stretched to 16 bits.'
      }
    };
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px"><label>' + T(L.volt) +
      ' <input type="range" min="0" max="3.3" step="0.01" value="1.65"> <b class="mono" data-k="v"></b></label></div>' +
      '<div class="meter"><i></i></div>' +
      '<div class="readouts">' +
      '<div class="readout"><span class="ltr">read_u16()</span><b data-k="u16"></b></div>' +
      '<div class="readout"><span>' + T(L.raw12) + '</span><b data-k="r12"></b></div>' +
      '<div class="readout"><span>' + T(L.pct) + '</span><b data-k="pct"></b></div>' +
      '</div><div class="live-code" data-k="code"></div>' +
      '<p class="muted" style="margin:12px 0 0">' + T(L.note) + '</p></div>'
    );
    var inp = el.querySelector('input');
    function upd() {
      var v = parseFloat(inp.value);
      var r12 = Math.min(4095, Math.round(v / 3.3 * 4095));
      var u16 = (r12 << 4) | (r12 >> 8);
      el.querySelector('[data-k=v]').textContent = v.toFixed(2) + ' V';
      el.querySelector('[data-k=u16]').textContent = u16;
      el.querySelector('[data-k=r12]').textContent = r12;
      el.querySelector('[data-k=pct]').textContent = Math.round(v / 3.3 * 100) + '%';
      el.querySelector('.meter i').style.width = (v / 3.3 * 100) + '%';
      el.querySelector('[data-k=code]').textContent = 'raw = sensor.read_u16()     # raw == ' + u16;
    }
    inp.addEventListener('input', upd);
    upd();
    root.appendChild(el);
  };

  /* ---------- PWM ---------- */
  demos.pwm = function (root) {
    var L = {
      title: { he: 'Duty cycle ובהירות', en: 'Duty cycle and brightness' },
      duty: { he: 'Duty cycle', en: 'Duty cycle' },
      freq: { he: 'תדר', en: 'Frequency' },
      period: { he: 'זמן מחזור', en: 'Period' },
      ontime: { he: 'זמן "דולק" בכל מחזור', en: 'On-time per cycle' },
      avg: { he: 'מתח ממוצע', en: 'Average voltage' },
      servo: {
        he: 'ב-50Hz זמן המחזור הוא 20 אלפיות שנייה. הסרוו קורא את זמן ה"דולק": 0.5ms הם 0 מעלות ו-2.5ms הם 180 מעלות, כלומר duty של 2.5% עד 12.5%.',
        en: 'At 50 Hz the period is 20 ms. A servo reads the on-time: 0.5 ms is 0 degrees and 2.5 ms is 180 degrees, i.e. a duty of 2.5% to 12.5%.'
      },
      led: {
        he: 'ב-1kHz העין לא רואה הבהוב, אלא רק בהירות שמשתנה לפי ה-duty.',
        en: 'At 1 kHz the eye sees no flicker, only brightness that follows the duty.'
      }
    };
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px">' +
      '<label>' + T(L.duty) + ' <input type="range" min="0" max="100" step="1" value="50"> <b class="mono" data-k="d"></b></label>' +
      '<label>' + T(L.freq) + ' <select><option value="1000">1 kHz</option><option value="50">50 Hz</option></select></label>' +
      '<div class="led-vis"><i></i></div></div>' +
      '<div class="wave-scroll" data-k="w"></div>' +
      '<div class="readouts">' +
      '<div class="readout"><span class="ltr">duty_u16</span><b data-k="u16"></b></div>' +
      '<div class="readout"><span>' + T(L.period) + '</span><b data-k="per"></b></div>' +
      '<div class="readout"><span>' + T(L.ontime) + '</span><b data-k="on"></b></div>' +
      '<div class="readout"><span>' + T(L.avg) + '</span><b data-k="avg"></b></div>' +
      '</div><div class="live-code" data-k="code"></div>' +
      '<p class="muted" data-k="note" style="margin:12px 0 0"></p></div>'
    );
    var inp = el.querySelector('input'), sel = el.querySelector('select');
    function upd() {
      var duty = parseInt(inp.value, 10) / 100;
      var freq = parseInt(sel.value, 10);
      var periodMs = 1000 / freq;
      var u16 = Math.round(duty * 65535);
      var pw = 112, n = 4, left = 44, hi = 14, lo = 62;
      var d = 'M' + left + ' ' + lo;
      for (var i = 0; i < n; i++) {
        var x = left + i * pw, on = pw * duty;
        if (duty > 0) d += ' L' + x + ' ' + hi + ' L' + (x + on) + ' ' + hi;
        if (duty < 1) d += ' L' + (x + on) + ' ' + lo + ' L' + (x + pw) + ' ' + lo;
      }
      var w = left + n * pw + 10;
      var svg = '<svg class="wave" width="' + w + '" height="92" viewBox="0 0 ' + w + ' 92" style="max-width:100%;height:auto">' +
        '<text class="lane-name" x="2" y="18">3.3V</text><text class="lane-name" x="14" y="66">0V</text>';
      for (var k = 0; k <= n; k++) svg += '<line class="grid-line" x1="' + (left + k * pw) + '" y1="6" x2="' + (left + k * pw) + '" y2="74"/>';
      svg += '<path d="' + d + '" fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:var(--c-pwm)"/>' +
        '<g class="cell"><text x="' + (left + pw / 2) + '" y="88" text-anchor="middle">' + periodMs + ' ms</text></g></svg>';
      el.querySelector('[data-k=w]').innerHTML = svg;
      el.querySelector('[data-k=d]').textContent = Math.round(duty * 100) + '%';
      el.querySelector('[data-k=u16]').textContent = u16;
      el.querySelector('[data-k=per]').textContent = periodMs + ' ms';
      el.querySelector('[data-k=on]').textContent = (periodMs * duty).toFixed(2) + ' ms';
      el.querySelector('[data-k=avg]').textContent = (3.3 * duty).toFixed(2) + ' V';
      el.querySelector('.led-vis i').style.opacity = duty;
      el.querySelector('[data-k=code]').textContent =
        'pwm = PWM(Pin(15), freq=' + freq + ')\npwm.duty_u16(' + u16 + ')';
      el.querySelector('[data-k=note]').textContent = T(freq === 50 ? L.servo : L.led);
    }
    inp.addEventListener('input', upd);
    sel.addEventListener('change', upd);
    upd();
    root.appendChild(el);
  };

  /* ---------- I2C: step through one write ---------- */
  demos.i2c = function (root) {
    var L = {
      title: { he: 'מה עובר על החוטים כשכותבים בית אחד', en: 'What travels on the wires when you write one byte' },
      dev: { he: 'רכיב', en: 'Device' },
      data: { he: 'בית לשליחה (hex)', en: 'Byte to send (hex)' },
      steps: [
        {
          n: { he: 'מנוחה', en: 'Idle' },
          x: { he: 'האפיק פנוי. נגדי המשיכה מחזיקים את שני הקווים במצב גבוה.', en: 'The bus is free. The pull-up resistors hold both lines high.' }
        },
        {
          n: { he: 'START', en: 'START' },
          x: { he: 'SDA יורד בזמן ש-SCL עדיין גבוה. זה הסימן לכל הרכיבים שהודעה מתחילה.', en: 'SDA falls while SCL is still high. This tells every device that a message is starting.' }
        },
        {
          n: { he: 'כתובת', en: 'Address' },
          x: { he: 'שבעה ביטים של כתובת, החל מהביט הגבוה. SDA משתנה רק כש-SCL נמוך, והרכיבים קוראים אותו כש-SCL גבוה. כל רכיב משווה את הכתובת לכתובת שלו.', en: 'Seven address bits, highest first. SDA only changes while SCL is low, and devices read it while SCL is high. Every device compares the address with its own.' }
        },
        {
          n: { he: 'קריאה או כתיבה', en: 'Read or write' },
          x: { he: 'ביט אחד שקובע את הכיוון: 0 אומר שה-Pico כותב לרכיב, ו-1 אומר שהוא קורא ממנו.', en: 'One bit that sets the direction: 0 means the Pico writes to the device, 1 means it reads from it.' }
        },
        {
          n: { he: 'ACK', en: 'ACK' },
          x: { he: 'ה-Pico משחרר את SDA, והרכיב שזו הכתובת שלו מושך אותו ל-0: "אני כאן". אם אף רכיב לא עונה, SDA נשאר גבוה. בדיוק כך i2c.scan() מגלה מי מחובר.', en: 'The Pico lets go of SDA, and the device that owns this address pulls it to 0: "I am here". If nobody answers, SDA stays high. This is exactly how i2c.scan() finds what is connected.' }
        },
        {
          n: { he: 'נתונים', en: 'Data' },
          x: { he: 'שמונה ביטים של נתונים, החל מהביט הגבוה.', en: 'Eight data bits, highest first.' }
        },
        {
          n: { he: 'ACK', en: 'ACK' },
          x: { he: 'הרכיב מאשר שקיבל את הבית.', en: 'The device confirms it received the byte.' }
        },
        {
          n: { he: 'STOP', en: 'STOP' },
          x: { he: 'SDA עולה בזמן ש-SCL גבוה. ההודעה הסתיימה, והאפיק שוב פנוי.', en: 'SDA rises while SCL is high. The message is over and the bus is free again.' }
        }
      ]
    };
    var devs = P.components.filter(function (c) { return c.addr; });
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px">' +
      '<label>' + T(L.dev) + ' <select>' + devs.map(function (c) {
        return '<option value="' + c.addr + '">' + esc(c.addr + '  ' + c.id.toUpperCase()) + '</option>';
      }).join('') + '</select></label>' +
      '<label>' + T(L.data) + ' <input type="text" value="A5" maxlength="2" style="width:64px"></label></div>' +
      '<div class="wave-scroll" data-k="w"></div>' +
      '<div class="step-box"><div class="txt"><b data-k="n"></b><span data-k="x"></span></div>' +
      '<div class="step-btns"><button type="button" class="btn ghost small" data-k="prev">' + P.s('prev') + '</button>' +
      '<button type="button" class="btn small" data-k="next">' + P.s('next') + '</button></div></div>' +
      '<div class="live-code" data-k="code" style="margin-top:12px"></div></div>'
    );
    var sel = el.querySelector('select'), inp = el.querySelector('input[type=text]');
    var step = 0;
    function upd() {
      var addr = parseInt(sel.value, 16);
      var data = parseInt(inp.value, 16);
      if (isNaN(data)) data = 0;
      var scl = [], sda = [], cells = [], sections = [];
      var pos = 0, last = 1;
      function push(c, d) { scl.push(c); sda.push(d); last = d; pos++; }
      function sec(label, fn) { var from = pos; fn(); sections.push({ from: from, to: pos, label: label }); }
      function bit(b, text) {
        var from = pos;
        push(0, last); push(0, b); push(1, b); push(1, b);
        cells.push({ from: from, to: pos, text: text == null ? String(b) : text });
      }
      sec('IDLE', function () { push(1, 1); push(1, 1); push(1, 1); push(1, 1); });
      sec('START', function () { push(1, 1); push(1, 0); push(1, 0); push(1, 0); });
      sec('ADDR 0x' + hex2(addr).toUpperCase(), function () { bits(addr, 7).forEach(function (b) { bit(b); }); });
      sec('W', function () { bit(0); });
      sec('ACK', function () { bit(0); });
      sec('DATA 0x' + hex2(data).toUpperCase(), function () { bits(data, 8).forEach(function (b) { bit(b); }); });
      sec('ACK', function () { bit(0); });
      sec('STOP', function () { push(0, last); push(0, 0); push(1, 0); push(1, 0); push(1, 1); push(1, 1); });
      el.querySelector('[data-k=w]').innerHTML = wave({
        tw: 8, active: step, sections: sections, cells: cells,
        lanes: [{ name: 'SCL', levels: scl, color: '--c-sys' }, { name: 'SDA', levels: sda, color: '--c-i2c' }]
      });
      el.querySelector('[data-k=n]').textContent = (step + 1) + '/' + L.steps.length + '  ' + T(L.steps[step].n);
      el.querySelector('[data-k=x]').textContent = T(L.steps[step].x);
      el.querySelector('[data-k=code]').textContent = 'i2c.writeto(0x' + hex2(addr) + ', b"\\x' + hex2(data) + '")';
      el.querySelector('[data-k=prev]').disabled = step === 0;
      el.querySelector('[data-k=next]').disabled = step === L.steps.length - 1;
    }
    el.querySelector('[data-k=prev]').addEventListener('click', function () { if (step > 0) { step--; upd(); } });
    el.querySelector('[data-k=next]').addEventListener('click', function () { if (step < L.steps.length - 1) { step++; upd(); } });
    sel.addEventListener('change', upd);
    inp.addEventListener('input', upd);
    upd();
    root.appendChild(el);
  };

  /* ---------- SPI: one byte each way ---------- */
  demos.spi = function (root) {
    var L = {
      title: { he: 'בית אחד בכל כיוון, באותו זמן', en: 'One byte each way, at the same time' },
      data: { he: 'בית לשליחה (hex)', en: 'Byte to send (hex)' },
      note: {
        he: 'ה-Pico מוריד את CS כדי לבחור ברכיב. בכל פעימת שעון עובר ביט אחד מה-Pico לרכיב (TX) וביט אחד מהרכיב ל-Pico (RX), החל מהביט הגבוה. בסוף CS עולה, והרכיב משתחרר.',
        en: 'The Pico pulls CS low to select the device. On every clock pulse one bit moves from the Pico to the device (TX) and one bit from the device to the Pico (RX), highest first. At the end CS goes high and the device is released.'
      }
    };
    var REPLY = 0xEF;
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px"><label>' + T(L.data) +
      ' <input type="text" value="9F" maxlength="2" style="width:64px"></label></div>' +
      '<div class="wave-scroll" data-k="w"></div>' +
      '<p class="muted" style="margin:12px 0 0">' + T(L.note) + '</p></div>'
    );
    var inp = el.querySelector('input');
    function upd() {
      var data = parseInt(inp.value, 16);
      if (isNaN(data)) data = 0;
      var cs = [], sck = [], tx = [], rx = [], cells = [], sections = [], pos = 0;
      function push(a, b, c, d) { cs.push(a); sck.push(b); tx.push(c); rx.push(d); pos++; }
      var from = pos;
      for (var i = 0; i < 4; i++) push(1, 0, 0, 1);
      sections.push({ from: from, to: pos, label: 'IDLE' });
      from = pos; push(0, 0, 0, 1); push(0, 0, 0, 1);
      sections.push({ from: from, to: pos, label: 'CS' });
      from = pos;
      var tb = bits(data, 8), rb = bits(REPLY, 8);
      for (var k = 0; k < 8; k++) {
        var f = pos;
        push(0, 0, tb[k], rb[k]); push(0, 0, tb[k], rb[k]); push(0, 1, tb[k], rb[k]); push(0, 1, tb[k], rb[k]);
        cells.push({ from: f, to: pos, text: String(tb[k]) });
      }
      sections.push({ from: from, to: pos, label: 'TX 0x' + hex2(data).toUpperCase() + '   /   RX 0x' + hex2(REPLY).toUpperCase() });
      from = pos; push(0, 0, 0, 1); push(0, 0, 0, 1);
      for (var j = 0; j < 4; j++) push(1, 0, 0, 1);
      sections.push({ from: from, to: pos, label: 'END' });
      el.querySelector('[data-k=w]').innerHTML = wave({
        tw: 9, sections: sections, cells: cells,
        lanes: [
          { name: 'CS', levels: cs, color: '--c-sys' }, { name: 'SCK', levels: sck, color: '--c-sys' },
          { name: 'TX', levels: tx, color: '--c-spi' }, { name: 'RX', levels: rx, color: '--c-adc' }
        ]
      });
    }
    inp.addEventListener('input', upd);
    upd();
    root.appendChild(el);
  };

  /* ---------- UART: one character ---------- */
  demos.uart = function (root) {
    var L = {
      title: { he: 'איך נראה תו אחד על הקו', en: 'What one character looks like on the wire' },
      ch: { he: 'תו לשליחה', en: 'Character to send' },
      baud: { he: 'מהירות (baud)', en: 'Speed (baud)' },
      code: { he: 'קוד התו', en: 'Character code' },
      bit: { he: 'משך ביט אחד', en: 'Time per bit' },
      frame: { he: 'משך התו כולו (10 ביטים)', en: 'Whole character (10 bits)' },
      note: {
        he: 'במנוחה הקו גבוה. ביט ה-START (0) מסמן לצד השני להתחיל למדוד זמן, אחריו באים שמונה ביטי הנתונים מהנמוך לגבוה, ובסוף ביט ה-STOP (1). אין שעון משותף: המקלט פשוט דוגם את הקו פעם בכל "משך ביט", ולכן שני הצדדים חייבים לעבוד באותה מהירות.',
        en: 'At rest the line is high. The START bit (0) tells the other side to start timing, then come the eight data bits from lowest to highest, and finally the STOP bit (1). There is no shared clock: the receiver simply samples the line once every bit time, which is why both sides need the same speed.'
      }
    };
    var el = h(
      '<div class="demo"><h3>' + T(L.title) + '</h3>' +
      '<div class="demo-row" style="margin-top:12px">' +
      '<label>' + T(L.ch) + ' <input type="text" value="A" maxlength="1" style="width:54px"></label>' +
      '<label>' + T(L.baud) + ' <select><option>9600</option><option>115200</option></select></label></div>' +
      '<div class="wave-scroll" data-k="w"></div>' +
      '<div class="readouts">' +
      '<div class="readout"><span>' + T(L.code) + '</span><b data-k="c"></b></div>' +
      '<div class="readout"><span>' + T(L.bit) + '</span><b data-k="b"></b></div>' +
      '<div class="readout"><span>' + T(L.frame) + '</span><b data-k="f"></b></div>' +
      '</div><p class="muted" style="margin:0">' + T(L.note) + '</p></div>'
    );
    var inp = el.querySelector('input'), sel = el.querySelector('select');
    function upd() {
      var code = (inp.value || 'A').charCodeAt(0) & 0xFF;
      var baud = parseInt(sel.value, 10);
      var lsb = bits(code, 8).reverse();
      var lv = [1, 1, 0].concat(lsb, [1, 1, 1]);
      var cells = lsb.map(function (b, i) { return { from: 3 + i, to: 4 + i, text: String(b) }; });
      el.querySelector('[data-k=w]').innerHTML = wave({
        tw: 34, cells: cells,
        sections: [
          { from: 0, to: 2, label: 'IDLE' }, { from: 2, to: 3, label: 'ST' },
          { from: 3, to: 11, label: 'DATA  bit0 → bit7' }, { from: 11, to: 12, label: 'SP' }, { from: 12, to: 14, label: 'IDLE' }
        ],
        lanes: [{ name: 'TX', levels: lv, color: '--c-uart' }]
      });
      var us = 1e6 / baud;
      el.querySelector('[data-k=c]').textContent = code + '  (0x' + hex2(code).toUpperCase() + ')';
      el.querySelector('[data-k=b]').textContent = us.toFixed(us < 20 ? 2 : 0) + ' µs';
      el.querySelector('[data-k=f]').textContent = (us * 10 / 1000).toFixed(3) + ' ms';
    }
    inp.addEventListener('input', upd);
    sel.addEventListener('change', upd);
    upd();
    root.appendChild(el);
  };

  /* ---------- breadboard: which holes are connected ---------- */
  demos.breadboard = function (root) {
    var L = {
      idle: { he: 'בחרו חור כדי לראות למה הוא מחובר.', en: 'Pick a hole to see what it is connected to.' },
      col: { he: 'חמישה חורים באותו טור, שמחוברים זה לזה. הם לא מחוברים לטורים השכנים, וגם לא לחמישה החורים שמעבר לתעלה.', en: 'Five holes in the same column, connected to each other. They are not connected to neighbouring columns, nor to the five across the channel.' },
      railP: { he: 'פס מתח: כל החורים לאורך הקו האדום מחוברים זה לזה. בדרך כלל מחברים אותו ל-3.3V.', en: 'A power rail. All the holes along the red line are connected. It is usually connected to 3.3 V.' },
      railN: { he: 'פס אדמה: כל החורים לאורך הקו הכחול מחוברים זה לזה. חברו אותו ל-GND.', en: 'A ground rail. All the holes along the blue line are connected. Connect it to GND.' }
    };
    var el = h('<div class="demo"><div class="wave-scroll bb-host">' + P.bbSvg({}) + '</div>' +
      '<p class="bb-cap" aria-live="polite" style="margin:12px 0 0"></p></div>');
    var cap = el.querySelector('.bb-cap');
    cap.textContent = T(L.idle);
    function pick(hole) {
      var g = hole.getAttribute('data-g');
      el.querySelectorAll('.bb-hole').forEach(function (x) { x.classList.toggle('lit', x.getAttribute('data-g') === g); });
      cap.textContent = T(g === 'tp' || g === 'bp' ? L.railP : g === 'tn' || g === 'bn' ? L.railN : L.col);
    }
    el.addEventListener('pointerover', function (e) { if (e.target.classList && e.target.classList.contains('bb-hole')) pick(e.target); });
    el.addEventListener('click', function (e) { if (e.target.classList && e.target.classList.contains('bb-hole')) pick(e.target); });
    root.appendChild(el);
  };

  P.demos = demos;
})(window.PICO);
