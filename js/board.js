/* Run code on a real Pico 2 straight from the browser.
   Uses the Web Serial API (Chrome / Edge on a computer) and MicroPython's
   raw REPL: interrupt, enter raw mode, soft-reset, send the program, execute,
   stream its output, then return to the normal REPL. */
(function (P) {
  'use strict';
  var T = P.t;

  var L = {
    pillOff: { he: 'חיבור ללוח', en: 'Connect a board' },
    off: { he: 'לא מחובר', en: 'Not connected' },
    on: { he: 'מחובר', en: 'Connected' },
    running: { he: 'התוכנית רצה', en: 'Program running' },
    connect: { he: 'התחברו ללוח', en: 'Connect board' },
    disconnect: { he: 'נתקו', en: 'Disconnect' },
    stop: { he: 'עצרו', en: 'Stop' },
    clear: { he: 'נקו', en: 'Clear' },
    close: { he: 'סגרו', en: 'Close' },
    run: { he: 'הריצו על הלוח', en: 'Run on board' },
    placeholder: { he: 'פקודת Python, ואז Enter', en: 'A Python command, then Enter' },
    hint: {
      he: 'חברו את ה-Pico 2 למחשב בכבל USB, לחצו על "התחברו ללוח" ובחרו את הלוח מהרשימה. מעכשיו כל כפתור "הריצו על הלוח" באתר מריץ את הקוד שלו ישירות על הלוח, והפלט של print יופיע כאן.',
      en: 'Plug the Pico 2 into the computer with a USB cable, press "Connect board" and choose the board from the list. After that every "Run on board" button on the site runs its code directly on the board, and print output appears here.'
    },
    unsupported: {
      he: 'הדפדפן הזה לא יכול להתחבר ללוח. פתחו את האתר ב-Chrome או ב-Edge במחשב. תמיד אפשר גם להעתיק את הקוד ל-Thonny.',
      en: 'This browser cannot connect to a board. Open the site in Chrome or Edge on a computer. You can always copy the code into Thonny.'
    },
    connected: { he: 'הלוח מחובר.', en: 'Board connected.' },
    disconnected: { he: 'הלוח נותק.', en: 'Board disconnected.' },
    openFail: {
      he: 'לא ניתן היה לפתוח את החיבור. סגרו את Thonny או כל תוכנה אחרת שמחוברת ללוח, ונסו שוב.',
      en: 'Could not open the connection. Close Thonny or any other program connected to the board, then try again.'
    },
    noReply: {
      he: 'הלוח לא עונה. בדקו ש-MicroPython מותקן עליו (בעמוד "מתחילים"), ונסו לנתק את הכבל ולחבר אותו מחדש.',
      en: 'The board is not answering. Check that MicroPython is installed on it (the "Get started" page), and try unplugging and reconnecting the cable.'
    },
    sending: { he: 'התוכנית נשלחת ללוח...', en: 'Sending the program to the board...' },
    finished: { he: 'התוכנית הסתיימה.', en: 'Program finished.' },
    stopped: { he: 'התוכנית נעצרה.', en: 'Program stopped.' }
  };

  var supported = 'serial' in navigator;
  var enc = new TextEncoder(), dec = new TextDecoder();
  var port = null, reader = null, writer = null;
  var connected = false, running = false;

  /* How incoming bytes are treated:
     term = show as-is, hold = buffer silently, wait = buffer until a pattern,
     run = program output, split by the two end-of-transmission markers. */
  var mode = 'term', buffered = '', waiter = null;
  var eot = 0, stderrBuf = '', runDone = null, capture = null;   // capture: program output kept for the caller

  var el = {};

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- terminal ---------- */
  function print(text, cls) {
    if (!text) return;
    if (el.hint) { el.hint.remove(); el.hint = null; }
    text = text.replace(/\r/g, '').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
    var node;
    if (cls === 'sys' || cls === 'err-sys') {
      node = document.createElement('div');
      node.className = cls === 'sys' ? 'sys' : 'sys err';
      node.dir = 'auto';
    } else {
      node = document.createElement('span');
      if (cls) node.className = cls;
    }
    node.textContent = text;
    el.term.appendChild(node);
    while (el.term.childNodes.length > 600) el.term.removeChild(el.term.firstChild);
    el.term.scrollTop = el.term.scrollHeight;
  }

  /* ---------- incoming data ---------- */
  function onData(text) {
    while (text.length) {
      if (mode === 'wait') {
        buffered += text; text = '';
        var i = buffered.indexOf(waiter.pat);
        if (i >= 0) {
          text = buffered.slice(i + waiter.pat.length);
          buffered = '';
          var w = waiter; waiter = null;
          clearTimeout(w.timer);
          mode = w.next;
          w.resolve();
        }
      } else if (mode === 'run') {
        var j = text.indexOf('\x04');
        var part = j < 0 ? text : text.slice(0, j);
        if (eot === 0) { print(part); if (capture !== null) capture += part; } else stderrBuf += part;
        if (j < 0) text = '';
        else {
          text = text.slice(j + 1);
          if (++eot === 2) { mode = 'hold'; buffered = ''; if (runDone) runDone(); }
        }
      } else if (mode === 'hold') { buffered += text; text = ''; }
      else { print(text); text = ''; }
    }
  }

  /* Resolve once `pat` has arrived; whatever follows it is handled as `next`. */
  function waitFor(pat, next, ms) {
    return new Promise(function (resolve, reject) {
      waiter = {
        pat: pat, next: next, resolve: resolve,
        timer: setTimeout(function () { waiter = null; mode = 'term'; buffered = ''; reject(new Error('timeout')); }, ms)
      };
      mode = 'wait';
      var pending = buffered; buffered = '';
      if (pending) onData(pending);
    });
  }

  function write(s) { return writer.write(enc.encode(s)); }

  async function readLoop() {
    try {
      for (;;) {
        var r = await reader.read();
        if (r.done) break;
        onData(dec.decode(r.value, { stream: true }));
      }
    } catch (e) { /* cable pulled or port closed */ }
    cleanup(true);
  }

  /* ---------- connection ---------- */
  function attach(p) {
    port = p;
    writer = port.writable.getWriter();
    reader = port.readable.getReader();
    connected = true; mode = 'term'; buffered = '';
    readLoop();
    print(T(L.connected), 'sys');
    refresh();
    write('\r');                       // ask for a fresh >>> prompt
  }

  async function connect() {
    open();
    if (!supported) { print(T(L.unsupported), 'err-sys'); return false; }
    var p;
    try {
      p = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x2E8A }] });   // Raspberry Pi
    } catch (e) { return false; }      // the user closed the chooser
    try {
      await p.open({ baudRate: 115200 });
    } catch (e) { print(T(L.openFail), 'err-sys'); return false; }
    attach(p);
    return true;
  }

  function cleanup(announce) {
    if (!connected) return;
    connected = false;
    if (waiter) { clearTimeout(waiter.timer); waiter = null; }
    if (runDone) runDone();
    running = false; mode = 'term';
    try { writer.releaseLock(); } catch (e) { /* ignore */ }
    try { reader.releaseLock(); } catch (e) { /* ignore */ }
    var p = port; port = null;
    if (p && p.close) p.close().catch(function () { /* already gone */ });
    if (announce) print(T(L.disconnected), 'sys');
    refresh();
  }

  async function disconnect() {
    if (!connected) return;
    try { await reader.cancel(); } catch (e) { cleanup(true); }
  }

  /* ---------- running a program ---------- */
  /* Runs `code`; resolves with what the program printed (or null if it could not run). */
  async function run(code) {
    open();
    var out = null;
    if (!connected && !(await connect())) return null;
    if (running) {                                       // replace the program that is running now
      await stop();
      for (var n = 0; n < 40 && running; n++) await sleep(100);
    }
    if (!connected || running) return null;

    running = true; refresh();
    print(T(L.sending), 'sys');
    try {
      mode = 'hold'; buffered = '';
      await write('\r\x03\x03');                         // interrupt whatever is running
      await sleep(150);
      buffered = '';

      var ready = waitFor('raw REPL; CTRL-B to exit\r\n>', 'hold', 2500);
      await write('\r\x01');                             // enter raw REPL
      await ready;

      ready = waitFor('raw REPL; CTRL-B to exit\r\n>', 'hold', 5000);
      await write('\x04');                               // soft reset: start from a clean state
      await ready;

      var data = enc.encode(code.replace(/\r\n/g, '\n'));
      for (var i = 0; i < data.length; i += 256) {       // small chunks so the board keeps up
        await writer.write(data.slice(i, i + 256));
        await sleep(12);
      }

      eot = 0; stderrBuf = ''; capture = '';
      var done = new Promise(function (res) { runDone = res; });
      var started = waitFor('OK', 'run', 3000);
      await write('\x04');                               // execute
      await started;
      await done;                                        // ends when the program ends or is stopped
      runDone = null;

      if (connected) {
        var back = waitFor('>>> ', 'term', 2500);
        await write('\x02');                             // back to the normal REPL
        await back.catch(function () { /* prompt will show up on the next key press */ });
        var err = stderrBuf.trim();
        if (/KeyboardInterrupt/.test(err)) print(T(L.stopped), 'sys');
        else if (err) print(err + '\n', 'err');
        else print(T(L.finished), 'sys');
        print('>>> ');
        if (!err) out = capture;
      }
    } catch (e) {
      mode = 'term';
      if (connected) print(T(L.noReply), 'err-sys');
    }
    capture = null;
    running = false; refresh();
    return out;
  }

  async function stop() {
    if (connected) await write('\x03');
  }

  /* ---------- dock UI ---------- */
  function open() { el.dock.dataset.open = '1'; document.body.classList.add('dock-open'); }
  function close() { el.dock.dataset.open = '0'; document.body.classList.remove('dock-open'); }

  function refresh() {
    if (!el.dock) return;
    var state = running ? 'run' : connected ? 'on' : 'off';
    el.dock.dataset.state = state;
    var label = T(running ? L.running : connected ? L.on : L.off);
    el.status.textContent = label;
    el.pillTxt.textContent = connected ? label : T(L.pillOff);
    el.connect.textContent = T(connected ? L.disconnect : L.connect);
    el.connect.className = 'btn small' + (connected ? ' ghost' : '');
    el.stop.textContent = T(L.stop);
    el.stop.disabled = !running;
    el.clear.textContent = T(L.clear);
    el.close.setAttribute('aria-label', T(L.close));
    el.input.placeholder = T(L.placeholder);
    el.input.disabled = !connected;
    if (el.hint) el.hint.textContent = T(supported ? L.hint : L.unsupported);
    document.querySelectorAll('.code .run').forEach(function (b) { b.lastChild.textContent = ' ' + T(L.run); });
  }

  function build() {
    var d = document.createElement('div');
    d.className = 'dock'; d.dataset.open = '0'; d.dataset.state = 'off';
    d.innerHTML =
      '<button type="button" class="dock-pill"><span class="st-dot"></span><span class="dock-pill-txt"></span></button>' +
      '<div class="dock-panel"><div class="dock-bar">' +
      '<span class="st-dot"></span><b class="dock-status"></b><span class="dock-sp"></span>' +
      '<button type="button" data-a="connect" class="btn small"></button>' +
      '<button type="button" data-a="stop" class="btn ghost small"></button>' +
      '<button type="button" data-a="clear" class="btn ghost small"></button>' +
      '<button type="button" data-a="close" class="tool-btn icon">✕</button></div>' +
      '<div class="dock-term" dir="ltr"><div class="sys dock-hint" dir="auto"></div></div>' +
      '<form class="dock-in" dir="ltr"><span>&gt;&gt;&gt;</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false"></form></div>';
    document.body.appendChild(d);

    el = {
      dock: d, pillTxt: d.querySelector('.dock-pill-txt'), status: d.querySelector('.dock-status'),
      connect: d.querySelector('[data-a=connect]'), stop: d.querySelector('[data-a=stop]'),
      clear: d.querySelector('[data-a=clear]'), close: d.querySelector('[data-a=close]'),
      term: d.querySelector('.dock-term'), hint: d.querySelector('.dock-hint'), input: d.querySelector('input')
    };

    d.querySelector('.dock-pill').addEventListener('click', open);
    el.close.addEventListener('click', close);
    el.connect.addEventListener('click', function () { if (connected) disconnect(); else connect(); });
    el.stop.addEventListener('click', stop);
    el.clear.addEventListener('click', function () { el.term.textContent = ''; el.hint = null; });
    d.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!connected) return;
      write(el.input.value + '\r');
      el.input.value = '';
    });

    /* every code block on the site carries a Run button */
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.code .run');
      if (b) run(b.closest('.code').dataset.code);
    });

    if (supported) navigator.serial.addEventListener('disconnect', function (e) { if (e.target === port) cleanup(true); });
    else document.documentElement.classList.add('no-serial');
    refresh();
  }

  build();
  P.board = { run: run, stop: stop, connect: connect, disconnect: disconnect, refresh: refresh, runLabel: function () { return T(L.run); }, _attach: attach };
})(window.PICO);
