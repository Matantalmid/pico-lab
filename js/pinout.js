/* Draws the Pico 2 board with its 40 header pins.
   Used full-size on the pinout page and compact (with highlighted pins)
   on component pages. */
(function (P) {
  'use strict';

  var TAG_ORDER = ['adc', 'i2c', 'spi', 'uart', 'pwm'];

  function tagsFor(pin) {
    if (pin.kind !== 'gpio') return [];
    var out = [];
    TAG_ORDER.forEach(function (type) {
      pin.funcs.forEach(function (f) {
        if (f.type === type && !f.minor) out.push(f);
      });
    });
    return out;
  }

  /* opts: { filter, selected, highlight: {num: label}, onSelect(pin) } */
  P.renderBoard = function (container, opts) {
    opts = opts || {};
    var compact = !!opts.highlight;
    var board = document.createElement('div');
    board.className = 'board' + (compact ? ' compact' : '');

    var pcb = document.createElement('div');
    pcb.className = 'pcb';
    pcb.innerHTML =
      '<div class="usb"></div>' +
      '<div class="led-dot"></div><div class="led-txt">LED</div>' +
      '<div class="bootsel"></div><div class="bootsel-txt">BOOTSEL</div>' +
      '<div class="chip-ic"></div><div class="chip-txt">RP2350</div>' +
      '<div class="silk">Raspberry Pi<br>Pico 2<small>3.3V LOGIC</small></div>';
    board.appendChild(pcb);

    var labEls = {}, padEls = {};

    function makePin(pin, side, row) {
      var lab = document.createElement('button');
      lab.type = 'button';
      lab.className = 'pin-lab ' + side;
      lab.style.gridRow = String(row);
      lab.dataset.num = pin.num;
      lab.setAttribute('aria-label', P.s('pin') + ' ' + pin.num + ': ' + pin.label);

      var name = '<span class="pin-name k-' + pin.kind + '">' + P.esc(pin.label) + '</span>';
      var extras = '';
      if (compact) {
        var hl = opts.highlight[pin.num];
        if (hl) extras = '<span class="hl-label">' + P.esc(hl) + '</span>';
      } else {
        var tags = tagsFor(pin);
        if (side === 'left') tags = tags.slice().reverse();
        extras = tags.map(function (f) {
          return '<span class="tag t-' + f.type + '" data-type="' + f.type + '">' + P.esc(f.label) + '</span>';
        }).join('');
      }
      lab.innerHTML = side === 'left' ? extras + name : name + extras;

      var pad = document.createElement('button');
      pad.type = 'button';
      pad.tabIndex = -1;
      pad.className = 'pad' + (pin.num === 1 ? ' sq' : '');
      pad.style.gridRow = String(row);
      pad.style.gridColumn = side === 'left' ? '2' : '4';
      pad.textContent = pin.num;
      pad.dataset.num = pin.num;

      if (compact) {
        var on = !!opts.highlight[pin.num];
        lab.classList.toggle('hl', on); pad.classList.toggle('hl', on);
        lab.classList.toggle('dim', !on); pad.classList.toggle('dim', !on);
      }

      board.appendChild(lab);
      board.appendChild(pad);
      labEls[pin.num] = lab;
      padEls[pin.num] = pad;
    }

    for (var i = 0; i < 20; i++) {
      makePin(P.pinByNum(i + 1), 'left', i + 2);
      makePin(P.pinByNum(40 - i), 'right', i + 2);
    }

    board.addEventListener('click', function (e) {
      var el = e.target.closest('[data-num]');
      if (!el) return;
      var pin = P.pinByNum(parseInt(el.dataset.num, 10));
      api.select(pin.num);
      if (opts.onSelect) opts.onSelect(pin);
    });

    var api = {
      el: board,
      setFilter: function (filter) {
        if (compact) return;
        var active = filter && filter !== 'all';
        board.classList.toggle('filtered', !!active);
        P.pins.forEach(function (pin) {
          var match = P.pinMatches(pin, filter);
          labEls[pin.num].classList.toggle('dim', !match);
          padEls[pin.num].classList.toggle('dim', !match);
          labEls[pin.num].querySelectorAll('.tag').forEach(function (t) {
            var keep = !active || filter === 'gpio' || filter === 'power' || t.dataset.type === filter;
            t.classList.toggle('off', !keep);
          });
        });
      },
      select: function (num) {
        Object.keys(labEls).forEach(function (k) {
          var on = String(num) === k;
          labEls[k].classList.toggle('sel', on);
          padEls[k].classList.toggle('sel', on);
        });
      }
    };

    var scroll = document.createElement('div');
    scroll.className = 'board-scroll';
    scroll.appendChild(board);
    container.appendChild(scroll);

    api.setFilter(opts.filter || 'all');
    if (opts.selected) api.select(opts.selected);
    return api;
  };

  /* Nearest header GP pin offering a given function (e.g. the SCL partner of an SDA pin). */
  P.findPartner = function (fromGp, type, bus, role) {
    var best = null, bestDist = 999;
    P.pins.forEach(function (pin) {
      if (pin.kind !== 'gpio' || pin.gp === fromGp) return;
      var ok = pin.funcs.some(function (f) { return f.type === type && f.bus === bus && f.role === role; });
      if (!ok) return;
      var d = Math.abs(pin.gp - fromGp);
      if (d < bestDist) { best = pin; bestDist = d; }
    });
    return best;
  };
})(window.PICO);
