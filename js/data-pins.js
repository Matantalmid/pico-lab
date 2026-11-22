/* Raspberry Pi Pico 2 (RP2350A) header pins.
   Alternate functions are generated from the RP2350 function-select rules, so
   the pinout explorer, interface pages and component wiring all share one source. */
(function (P) {
  'use strict';
  var B = function (he, en) { return { he: he, en: en }; };

  /* Physical pins 1..40. 1-20 run down the left edge (USB at the top),
     21-40 run up the right edge, so pin 40 sits opposite pin 1. */
  var HEADER = [
    'GP0', 'GP1', 'GND', 'GP2', 'GP3', 'GP4', 'GP5', 'GND', 'GP6', 'GP7',
    'GP8', 'GP9', 'GND', 'GP10', 'GP11', 'GP12', 'GP13', 'GND', 'GP14', 'GP15',
    'GP16', 'GP17', 'GND', 'GP18', 'GP19', 'GP20', 'GP21', 'GND', 'GP22', 'RUN',
    'GP26', 'GP27', 'AGND', 'GP28', 'ADC_VREF', '3V3', '3V3_EN', 'GND', 'VSYS', 'VBUS'
  ];

  var SPECIAL = {
    GND: {
      kind: 'gnd',
      desc: B('[[ground|אדמה]], 0V. זו נקודת האפס של המעגל, שאליה חוזר כל הזרם. את ה-GND של כל רכיב שמחברים חייבים לחבר לאחד מהפינים האלה. כל פיני ה-GND מחוברים זה לזה, ולכן אפשר לבחור את הקרוב ביותר.',
        '[[ground|Ground]], 0 V. This is the zero point of the circuit, where all current returns. The GND of every part you connect must go to one of these pins. All the GND pins are connected to each other, so use the closest one.')
    },
    AGND: {
      kind: 'gnd',
      desc: B('אדמה למדידות. היא מחוברת ל-GND הרגיל, אבל "שקטה" יותר. חברו אליה את האדמה של רכיבים שקוראים דרך ה-[[adc|ADC]], כמו כפתור סיבוב או חיישן אור, כדי לקבל מדידה יציבה יותר.',
        'Ground for measurements. It is connected to ordinary GND but is "quieter". Connect the ground of parts read through the [[adc|ADC]] here, such as a knob or a light sensor, for a steadier reading.')
    },
    RUN: {
      kind: 'sys',
      desc: B('איפוס. אם מחברים את הפין הזה לרגע ל-GND, ה-Pico מתחיל את התוכנית שלו מחדש, כאילו ניתקתם את הכבל וחיברתם אותו שוב. אפשר לחבר אליו כפתור. ברוב הפרויקטים משאירים אותו לא מחובר.',
        'Reset. Briefly connecting this pin to GND makes the Pico start its program again, like unplugging and replugging the cable. You can wire a button to it. In most projects it is left unconnected.')
    },
    ADC_VREF: {
      kind: 'power',
      desc: B('המתח שלפיו ה-[[adc|ADC]] מודד. זה פין למשתמשים מתקדמים, ולכן השאירו אותו לא מחובר.',
        'The voltage the [[adc|ADC]] measures against. A pin for advanced users. Leave it unconnected.')
    },
    '3V3': {
      kind: 'power',
      label: '3V3(OUT)',
      desc: B('יציאה של 3.3V. מכאן מזינים חיישנים ומסכים קטנים: חברו אליה את הפין [[vcc|VCC]] שלהם. אל תזינו מכאן מנוע, סרבו או פס לדים, כי הם צורכים יותר [[current|זרם]] ממה שהפין הזה יכול לספק.',
        'A 3.3 V output. Sensors and small displays are powered from here: connect their [[vcc|VCC]] pin to it. Do not power a motor, servo or LED strip from here. They draw more [[current|current]] than this pin can supply.')
    },
    '3V3_EN': {
      kind: 'sys',
      desc: B('מתג כיבוי. אם מחברים את הפין הזה ל-GND, כל הלוח נכבה. השאירו אותו לא מחובר.',
        'An off switch. Connecting this pin to GND turns the whole board off. Leave it unconnected.')
    },
    VSYS: {
      kind: 'power',
      desc: B('כניסת מתח לסוללות. משתמשים בה כשרוצים שהפרויקט יעבוד בלי מחשב: מחברים לכאן סוללות שמספקות בין 1.8V ל-5.5V. כל עוד אתם עובדים עם כבל USB, אל תיגעו בפין הזה.',
        'A power input for batteries. Used when a project should run with no computer: connect batteries giving between 1.8 V and 5.5 V here. While you work over a USB cable, leave this pin alone.')
    },
    VBUS: {
      kind: 'power',
      desc: B('5V ישירות מכבל ה-USB. מכאן מזינים רכיבים שצריכים 5V, כמו סרבו, פס לדים או חיישן המרחק HC-SR04. המתח קיים רק כאשר הכבל מחובר. שימו לב: 5V הוא מתח גבוה מדי לפיני ה-GP, ולכן לעולם אל תחברו את הפין הזה ישירות לפין GP.',
        '5 V straight from the USB cable. Parts that need 5 V are powered from here, such as a servo, an LED strip or the HC-SR04 distance sensor. The voltage is only present while the cable is connected. Note: 5 V is too high for the GP pins, so never connect this pin straight to a GP pin.')
    }
  };

  function gpioFuncs(n) {
    var f = [{ type: 'gpio', label: 'GP' + n }];
    if (n >= 26 && n <= 28) f.push({ type: 'adc', ch: n - 26, label: 'ADC' + (n - 26) });
    var i2cBus = (n >> 1) & 1;
    var i2cRole = n % 2 === 0 ? 'SDA' : 'SCL';
    f.push({ type: 'i2c', bus: i2cBus, role: i2cRole, label: 'I2C' + i2cBus + ' ' + i2cRole });
    var spiBus = (n >> 3) & 1;
    var spiRole = ['RX', 'CSn', 'SCK', 'TX'][n & 3];
    f.push({ type: 'spi', bus: spiBus, role: spiRole, label: 'SPI' + spiBus + ' ' + spiRole });
    var uartBus = (((n >> 2) + 1) >> 1) & 1;
    var uartRole = ['TX', 'RX', 'CTS', 'RTS'][n & 3];
    f.push({
      type: 'uart', bus: uartBus, role: uartRole, label: 'UART' + uartBus + ' ' + uartRole,
      minor: uartRole === 'CTS' || uartRole === 'RTS'
    });
    var slice = (n >> 1) & 7;
    var chan = n % 2 === 0 ? 'A' : 'B';
    f.push({ type: 'pwm', slice: slice, chan: chan, label: 'PWM' + slice + chan });
    return f;
  }

  var pins = HEADER.map(function (name, i) {
    var num = i + 1;
    var m = /^GP(\d+)$/.exec(name);
    if (m) {
      var n = parseInt(m[1], 10);
      return { num: num, name: name, label: name, kind: 'gpio', gp: n, funcs: gpioFuncs(n) };
    }
    var s = SPECIAL[name];
    return {
      num: num, name: name, label: s.label || name, kind: s.kind, desc: s.desc,
      funcs: [{ type: s.kind, label: s.label || name }]
    };
  });

  /* Short explanation of each function type, shown in the pin detail panel. */
  var FUNC_INFO = {
    gpio: B('פין רגיל. אפשר להשתמש בו כיציאה, כדי להדליק ולכבות משהו, או ככניסה, כדי לבדוק אם כפתור לחוץ.',
      'An ordinary pin. Use it as an output, to switch something on and off, or as an input, to check whether a button is pressed.'),
    adc: B('הפין הזה יודע גם למדוד כמה [[voltage|מתח]] יש עליו, בין 0V ל-3.3V. הוא מתאים לכפתור סיבוב ולחיישן אור.',
      'This pin can also measure how much [[voltage|voltage]] is on it, between 0 V and 3.3 V. Good for a knob or a light sensor.'),
    pwm: B('הבהוב מהיר, שמשמש לעמעום לד, להפקת צליל ולהפעלת סרבו. המספר והאות הם שם היחידה: שני פינים עם אותו מספר, כמו 0A ו-0B, חייבים לעבוד באותו [[frequency|תדר]].',
      'Fast switching, for dimming an LED, for sound and for a servo. The number and letter name the unit: two pins with the same number, such as 0A and 0B, must run at the same [[frequency|frequency]].'),
    i2c: B('חיבור בשני חוטים לחיישנים ולמסכים. צריך פין [[sdascl|SDA]] ופין SCL מאותו אפיק: שניהם I2C0, או שניהם I2C1.',
      'A two-wire connection for sensors and displays. You need an [[sdascl|SDA]] pin and an SCL pin from the same bus: both I2C0, or both I2C1.'),
    spi: B('חיבור מהיר לכרטיס זיכרון ולמסכים. SCK הוא השעון, TX הוא הקו שבו הנתונים יוצאים מה-Pico (MOSI), ו-RX הוא הקו שבו הם חוזרים אליו (MISO).',
      'A fast connection, for a memory card and displays. SCK is the clock, TX is the line where data leaves the Pico (MOSI), and RX is the line where it returns (MISO).'),
    uart: B('שיחה בין שני מכשירים: [[txrx|TX]] משדר ו-RX קולט. ה-TX של ה-Pico מתחבר ל-RX של הרכיב, וה-RX שלו מתחבר ל-TX של הרכיב.',
      'A conversation between two devices. [[txrx|TX]] transmits and RX receives. The Pico\'s TX connects to the part\'s RX, and the other way round.')
  };

  /* Pins that exist on the chip but are wired to things on the board itself. */
  var ONBOARD = [
    {
      name: 'GP25', what: B('הלד שעל הלוח', 'The LED on the board'),
      desc: B('הלד הירוק הקטן. בקוד פונים אליו עם `Pin("LED")`, ואין צורך לחבר שום דבר.', 'The small green LED. In code you reach it with `Pin("LED")`, with nothing to connect.')
    },
    {
      name: 'GP24', what: B('זיהוי USB', 'USB detect'),
      desc: B('הפין קורא 1 כאשר כבל ה-USB מחובר, וכך התוכנית יכולה לדעת אם היא רצה על סוללה.', 'Reads 1 while the USB cable is connected. This lets a program know whether it is running on battery.')
    },
    {
      name: 'GP29 / ADC3', what: B('מדידת מתח ההזנה', 'Supply voltage measurement'),
      desc: B('הפין מודד שליש ממתח ההזנה של הלוח, וזה שימושי לבדיקת מצב הסוללה.', 'Measures one third of the board\'s supply voltage. Useful for checking battery level.')
    },
    {
      name: 'ADC4', what: B('חיישן טמפרטורה פנימי', 'Internal temperature sensor'),
      desc: B('בתוך השבב יש חיישן טמפרטורה, וקוראים אותו עם `ADC(4)`. הוא מודד את החום של השבב, ולא את הטמפרטורה בחדר.', 'There is a temperature sensor inside the chip, read with `ADC(4)`. It measures the chip\'s warmth, not the room temperature.')
    },
    {
      name: 'GP23', what: B('מצב חיסכון של המייצב', 'Regulator power-save'),
      desc: B('פין למשתמשים מתקדמים, שקובע איך [[regulator|מייצב המתח]] עובד.', 'A pin for advanced users. Sets how the [[regulator|voltage regulator]] works.')
    }
  ];

  P.pins = pins;
  P.funcInfo = FUNC_INFO;
  P.onboard = ONBOARD;

  P.pinByName = function (name) {
    for (var i = 0; i < pins.length; i++) if (pins[i].name === name) return pins[i];
    return null;
  };
  P.pinByNum = function (num) { return pins[num - 1] || null; };

  /* Does this pin match a pinout filter id? */
  P.pinMatches = function (pin, filter) {
    if (!filter || filter === 'all') return true;
    if (filter === 'power') return pin.kind === 'power' || pin.kind === 'gnd' || pin.kind === 'sys';
    if (pin.kind !== 'gpio') return false;
    if (filter === 'gpio') return true;
    return pin.funcs.some(function (f) { return f.type === filter && !f.minor; });
  };
})(window.PICO);
