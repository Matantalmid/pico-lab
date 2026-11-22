# Inventory of the local "Pico 2 Lab" teaching site (מעבדת Pico 2)

Scope: read-only inventory of `C:\Users\Shmuel\Desktop\RP Pico` as of 2026-11-20. Sources are local files; references are `file:line`. Paths are relative to the site root. Size: about 17,140 lines across `js/*.js`, `css/style.css`, `index.html`. Static site, no build step, no server, no Node; opened from `index.html` or any static host ([README.md:7-9](README.md)).

## 1. Sections / routes and what each does

### Takeaway
Ten hash routes: home, basics, start, lessons, pinout, interfaces, components, planner, robot, glossary. Basics, start and lessons are the learning path. Pinout, interfaces, components and glossary are reference material. Planner is for final projects, and robot is a 3D mechanical design workshop for an agricultural carrier robot.

### Cited Findings
- Router: `route()` dispatches on `#/` to `viewHome`, `viewBasics`, `viewStart`, `P.viewLessons`, `viewPinout`, `viewInterface(s)`, `viewComponent(s)`, `P.viewPlanner`, `P.viewRobot`, `viewGlossary`, and anything else to a 404 page — [js/app.js:688-710](js/app.js); nav list — [js/app.js:664-667](js/app.js)
- Home `#/`: overview, recommended learning order, and safety rules with an explanation for each rule — [README.md:15](README.md); home cards link to the other sections — [js/app.js:94-100](js/app.js)
- Basics `#/basics`: 13 chapters (8 core plus 5 advanced for tracks E-H) — [README.md:16](README.md)
- Start `#/start`: installing MicroPython and Thonny, first program, troubleshooting — [README.md:17](README.md); content at [js/app.js:215-290](js/app.js)
- Lessons `#/lessons`: 35 hands-on lessons in 8 tracks, with checkable steps, challenges, check questions and progress tracking — [README.md:18](README.md)
- Pinout `#/pinout`: 40 header pins, filter by interface, per-pin detail, legend; URL forms `#/pinout/pin/N` and `#/pinout/<filter>` — [README.md:19](README.md), [js/app.js:415-427](js/app.js)
- Interfaces `#/interfaces`: GPIO, ADC, PWM, I2C, SPI, UART, PIO, Power. Each has an analogy, a live demo (not for PIO and Power), explained code and check questions — [README.md:20](README.md), [js/data-interfaces.js:14-470](js/data-interfaces.js)
- Components `#/components`: 46 parts, filterable by interface and type, searchable by name. Each has an illustration, explanation, build steps, line-by-line explained code and troubleshooting — [README.md:21](README.md)
- Planner `#/planner`: pick parts per Pico board, add up to 4 boards (A-D) and links between them (uart, i2c, wire, radio). Output: conflict-free pin allocation, breadboard drawing (one or more breadboards), wiring table, current estimate, starter code per board, shopping list. Plans are encoded in the URL so they can be shared — [README.md:22,28](README.md), [js/planner-view.js:42](js/planner-view.js)
- Robot `#/robot`: 3D model of an agricultural carrier robot. "Free build" lets you place parts from a box, allows only physically real connections, computes the transmission, and checks 6 missions. "Sample robot" sets 5 dimensions and assembles in 13 steps — [README.md:23,173-203](README.md), [js/robot-design.js:600-640](js/robot-design.js)
- Glossary `#/glossary`: all technical terms, searchable. 71 terms in `data-glossary.js` and 15 in `data-glossary-2.js` (86 total by `G(` count). Terms are linked inline from text with the `[[id|text]]` markup — [README.md:24,70](README.md)
- Deep links exist for lessons (`#/lessons/B3`), basics chapters (`#/basics/python`), glossary terms (`#/glossary/voltage`) and planner plans — [README.md:28](README.md)

### Inferences
- The robot section is a mechanical/CAD-style tool about chassis, chains and bearings. It does not connect to the Pico content: no Pico code or wiring was found in it.

### Gaps
- I did not render the site in a browser, so visual quality and UX were not assessed.

## 2. Lessons: titles, hardware, code, exercises, results, quizzes

### Takeaway
35 lessons in 8 tracks (A-H). Every lesson has the same fields: goal, what you learn, prerequisites, parts, wiring, checkable steps, explained code, expected result, challenges (`tasks`) and a check quiz. Field counts match the lesson count in every file.

### Cited Findings
- Fixed lesson structure: goal, learn, needs, wiring, checkable steps, line-by-line code, expected result, challenges with a hint and sometimes a solution, check question — [README.md:45,105](README.md)
- Field counts per file (lessons / code / expect / tasks / quiz / before): data-lessons.js 9/9/9/9/9/9, data-lessons-2.js 7/7/7/7/7/7, data-lessons-3.js 12/12/12/12/12/12, data-lessons-4.js 7/7/7/7/7/7. About 108 challenge items in total (27+24+36+21) and about 37 quiz questions (10+8+12+7). Counted by grep over `js/data-lessons*.js`. Six challenges in tracks C-D link to the planner (`plan:`).
- Track A, on/off ([js/data-lessons.js](js/data-lessons.js)):
  - A1 The first LED: LED, 330 Ω resistor (:33-45)
  - A2 Traffic light: 3 LEDs, 3 resistors (:115-124)
  - A3 Button lights an LED: LED, button (:202-211)
  - A4 Press flips a state: LED, button (:261-270)
- Track B, beyond on/off:
  - B1 A knob: potentiometer (:325)
  - B2 A dimmer: pot, LED (:383)
  - B3 Night light: LDR, LED, 10k and 330 Ω resistors (:437)
  - B4 Doorbell: passive buzzer, button (:502)
  - B5 Arm steered by a knob: SG90 servo, pot (:593)
- Track C, sensors and display ([js/data-lessons-2.js](js/data-lessons-2.js)):
  - C1 Parking sensor: HC-SR04, buzzer, 1k/2k divider (:10-22)
  - C2 Motion alarm: PIR, LED, buzzer (:98)
  - C3 First display: SSD1306 OLED (:174)
  - C4 Weather station: DHT22, OLED (:239)
- Track D, your project:
  - D1 Planning a project: paper, A3 circuit (:332)
  - D2 Project runs by itself (main.py, USB charger or power bank) (:405)
  - D3 Two boards talk: two Picos, including a separate program for board B (:477-538)
- Track E, motion and power ([js/data-lessons-3.js](js/data-lessons-3.js)):
  - E1 Relay: relay, button, battery and bulb or motor (:25)
  - E2 Motor speed and direction: DC motor with DRV8833, pot (:106)
  - E3 Stepper a quarter turn: 28BYJ-48, 2 buttons (:185)
  - E4 Joystick aims two servos (:280)
- Track F, light, colour, input:
  - F1 RGB LED with pot (:370)
  - F2 NeoPixel strip of 8 with animations and a button (:454)
  - F3 Code lock: 4×4 keypad, LED, buzzer (:545)
  - F4 Menu on OLED with rotary encoder (:662)
- Track G, time, data, communication:
  - G1 Clock that remembers: DS3231 and TM1637, plus a separate set-time program (:784-852)
  - G2 Data logger to a file: AHT20, plus a read-back program (:873-954)
  - G3 RFID card opens a lock: RC522, servo (:980)
  - G4 Control from a phone: HC-05 Bluetooth, RGB LED, Android Serial Bluetooth Terminal app (:1084-1097)
- Track H, precise measurement and control ([js/data-lessons-4.js](js/data-lessons-4.js)):
  - H1 12 V LED strip dimmer: MOSFET module, pot, 12 V supply (:24)
  - H2 Running light on PCF8574 expander: 4 LEDs, button (:102)
  - H3 Precise battery tester: ADS1115, OLED (:190)
  - H4 Motor with overload protection: INA219, MOSFET, DC motor, batteries (:289)
  - H5 Kitchen scale with tare: HX711 load cell, OLED, button, calibration weight (:387)
  - H6 Arm repeating a move sequence: PCA9685, 3 servos, 5 V 2 A supply (:498)
  - H7 Thermostat: MAX6675, relay, bulb as heater (:603)
- E-H are follow-on tracks that depend on basics chapters 9-13. Each lesson links its prerequisites at the top — [README.md:43](README.md)

### Inferences
- Coverage is project-driven: each lesson builds one device. There are no graded assignments. "Quiz" means one or two multiple-choice check questions per lesson, with an explanation shown after answering.

### Gaps
- I counted quiz items with a regex (`Q(B(` / `{ q:`), so totals are approximate (±2).

## 3. Basics topics, interfaces covered, component pages

### Takeaway
There are 13 basics chapters and 8 interface pages. PIO gets one short "advanced" page. Interrupts and timers appear only as a basics chapter. Wi-Fi, dual-core, sleep/low-power, USB device, watchdog and asyncio are absent. The catalog has 46 components in 5 parts.

### Cited Findings
- Basics 1-8 ([js/data-basics.js](js/data-basics.js)):
  - What a microcontroller is (:9)
  - Electricity in five minutes (:51)
  - Digital and analog (:107)
  - The breadboard (:148)
  - The basic parts (:189)
  - Bits, bytes and 0x numbers (:239)
  - Python from zero (:287)
  - Your first circuit (:403)
- Basics 9-13 ([js/data-basics-2.js](js/data-basics-2.js)):
  - More Python: lists, dicts, functions, `return`, `try` (:14)
  - Interrupts and timers, with `Pin.irq` and `machine.Timer` examples (:79, :97, :121)
  - Choosing I2C/SPI/UART and connecting several parts (:148)
  - Power: what a pin can and cannot drive (:213)
  - Finding a fault / debugging (:277)
- Basics block types: paragraph, heading, list, tip, figure, demo, code with explanation, table. Grep count across both files: 20 code blocks, 4 live demos, 8 figures, 13 tables, 18 tips — [README.md:106](README.md)
- Basics check questions: about 18 in chapters 1-8 and about 10 in chapters 9-13 (`{ q, a, ok, why }` / `Q(` counts) — [README.md:104](README.md)
- Interface pages: gpio (:14), adc (:79), pwm (:145), i2c (:211), spi (:274), uart (:340), pio (:401, demo null), power (:469, demo null). 19 check questions in total — [js/data-interfaces.js](js/data-interfaces.js)
- PIO page: labelled "an advanced topic". It gives a `rp2` PIO blink example on the onboard LED (pin 25) and a NeoPixel rationale, and says to come to it after GPIO/PWM — [js/data-interfaces.js:401-468](js/data-interfaces.js)
- Keyword scan with zero hits anywhere in `index.html`, `js/`, `css/`, `README.md`:
  - "network"
  - "WLAN"
  - "Wi-Fi/WiFi"
  - "Pico 2 W/Pico W"
  - "_thread" / dual core
  - "lightsleep/deepsleep"
  - "WDT/watchdog"
  - "HID/usb.device"
  - "asyncio"
  - "RISC-V/Hazard3"
  - "BLE"
  - "Arduino/C SDK/CircuitPython"
  - "mpremote/rshell/ampy"
  - "VS Code/MicroPico"
- Pin data targets the Pico 2 (RP2350A) header. Internal pins documented: GP23 (regulator power-save), GP24 (USB detect), GP25 (LED), GP29/ADC3 (VSYS measure), plus RUN, ADC_VREF, 3V3_EN, VSYS, VBUS — [js/data-pins.js:1-131](js/data-pins.js)
- Components, 46 in total:
  - Part 1 ([js/data-components.js](js/data-components.js)): LED, push button, potentiometer, LDR, passive buzzer, SG90 servo, HC-SR04, PIR
  - Part 2 ([js/data-components-2.js](js/data-components-2.js)): DHT22, DS18B20, SSD1306 OLED, BH1750, MPU6050, NeoPixel WS2812 (PIO), microSD (SPI), NEO-6M GPS (UART)
  - Part 3 ([js/data-components-3.js](js/data-components-3.js)): relay module, DC motor + DRV8833, 28BYJ-48 stepper, RGB LED, joystick, rotary encoder, 4×4 keypad, TTP223 touch, IR receiver + remote, BME280, soil moisture
  - Part 4 ([js/data-components-4.js](js/data-components-4.js)): sound sensor, MQ-2 gas, tilt, Hall, LCD1602 with I2C backpack, TM1637, MAX7219 8×8 matrix, DS3231 RTC, RC522 RFID, HC-05 Bluetooth, nRF24L01
  - Part 5 ([js/data-components-5.js](js/data-components-5.js)), no external libraries: MOSFET module, PCF8574, ADS1115, INA219, AHT20, HX711, PCA9685, MAX6675
- Component page fields: what, looks, pins, how, needs, wiring table, build steps, code and explanation, expect, mistakes, ideas, and an optional on-board driver file — [README.md:78-92](README.md)
- Libraries referenced: `ssd1306`, `sdcard`, `bme280`, `mfrc522`, `nrf24l01`, plus three site-written drivers (`pico_lcd.py`, `pico_tm1637.py`, `pico_max7219.py`) for LCD, TM1637 and MAX7219 — [js/data-components-4.js:140,184,228](js/data-components-4.js); grep of `lib:` fields

### Inferences
- Pico 2-specific features (RP2350 security, RISC-V cores, PSRAM, the Pico 2 W wireless variant) are not taught. Wireless is limited to external modules: HC-05 Bluetooth Classic and nRF24L01.

### Gaps
- I did not check whether the PIO page covers StateMachine FIFOs or DMA. It is short, so likely not.

## 4. Interactive tools, code execution, progress, assessment, teacher material, printables, BOM, offline

### Takeaway
The interactive tools are a clickable pinout, animated signal demos, auto-generated breadboard wiring diagrams, a multi-board project planner, a 3D robot builder, and Web Serial "Run on board" with a console. There is no code simulator. Progress is per browser only, and there are no accounts, grading, teacher dashboard or dedicated teacher guide.

### Cited Findings
- Live demos in `js/demos.js` cover GPIO, ADC, PWM, I2C (bit-level SCL/SDA waveform with labelled sections), SPI (CS/SCK/MOSI/MISO), UART and breadboard (hole picking) — [js/demos.js:21-441](js/demos.js); demo ids used in data are adc, breadboard, gpio, i2c, pwm, spi, uart
- Breadboard wiring diagrams: hand-written layouts plus an auto-layout engine for an 830-hole breadboard, auto-checked against each wiring table (`PICO.checkLayout`). There is also a step-by-step wiring view — [README.md:94-101,138-140,162](README.md)
- Run code: every code block has "Run on board" and a bottom console with print output and a REPL input. It uses Web Serial (Chrome/Edge desktop only) with the raw-REPL protocol (Ctrl-C, Ctrl-A, Ctrl-D soft reset, execute), filtered to Raspberry Pi USB VID 0x2E8A at 115200 baud. The code is not saved to the board — [README.md:51-62](README.md), [js/board.js:3,150-213](js/board.js)
- No simulator: no Wokwi or code-simulation mentions (the only "simulat" hit is in robot.js, saying the robot is not a physics simulation) — keyword scan; [README.md:175](README.md)
- Progress tracking: `localStorage` key `pico.lessons` stores checked steps and done flags. There is an overall progress bar, per-track counters and a reset button. No accounts, and the instructor cannot see progress — [js/lessons.js:4,53-99](js/lessons.js), [README.md:47](README.md)
- Other localStorage keys: `pico.theme`, `pico.lang`, `pico.plan`, `pico.robot` — [js/app.js:723](js/app.js), [js/i18n.js:11](js/i18n.js), [js/planner-view.js:99](js/planner-view.js), [js/robot.js:52](js/robot.js)
- Assessment: only multiple-choice check questions (lessons, basics, interfaces) and robot "missions" with automatic pass/fail checks (6 missions, e.g. clearing a 30×30 cm crop bed, 2-4 km/h speed, stability, emergency stop). No rubric, grading or score export (zero hits for rubric/grade/ציון) — [js/robot-design.js:600-640](js/robot-design.js)
- Submission: the robot design can be exported/imported as `robot-design.json`, which the README describes as how a student submits a design. Planner plans are shared as URLs — [README.md:201,28](README.md)
- Teacher material: no teacher guide, slides, lesson plans or answer keys. The README has a "Before teaching" checklist aimed at the instructor ("לפני שמלמדים"). The only "teacher" hits in content are classroom analogies for I2C/SPI — [README.md:158-171](README.md), [js/data-interfaces.js:217,280](js/data-interfaces.js)
- Printables: the only print stylesheet is for the robot free-build "sheet" (parts list with a snapshot). There are no printable lesson worksheets — [css/style.css:795-799](css/style.css), [js/robot-free.js:394-410](js/robot-free.js)
- BOM / kit lists: each lesson has a parts list. The planner produces a shopping list for all boards, without prices. The robot lists only quantities, with no cost table or prices — [js/planner-view.js:42,371](js/planner-view.js), [README.md:177,192](README.md). There is no single course-wide kit list (none found).
- Offline: the site is static and works from disk. Only the robot 3D view loads three.js r128 from cdnjs, with a fallback to `js/vendor/three.min.js`, which does not currently exist (no `js/vendor` folder). Web Serial may need `tools/serve.ps1` or https when opened from disk. No service worker or manifest (zero hits) — [js/robot.js:3-9](js/robot.js), [README.md:60,176](README.md)
- Accessibility: `aria-`/`role=` attributes appear in index.html and most view scripts, and a theme toggle (dark/light) exists — keyword scan; [js/app.js:676,717-726](js/app.js)

### Inferences
- The site serves self-paced individual learners and in-lab use well. It lacks LMS-style class management: rosters, progress visibility, grading.

### Gaps
- The Web Serial path was tested against a simulated board only (see §6).

## 5. Setup coverage: UF2 flashing, Thonny, drivers, troubleshooting

### Takeaway
The Start page covers what you need, the BOOTSEL/UF2 flash, the Thonny install and interpreter selection, the REPL, a first blink, saving `main.py`, and a 4-item troubleshooting list. It does not cover drivers, alternative IDEs, nuking flash, or OS-specific issues.

### Cited Findings
- Steps:
  - Needs Pico 2, computer and micro-USB data cable, with a warning about charge-only cables — [js/app.js:215-216](js/app.js)
  - Download MicroPython UF2 from micropython.org/download/RPI_PICO2 — [js/app.js:220-225](js/app.js)
  - Flash: hold BOOTSEL, plug in, RP2350 drive appears, drag the UF2 — [js/app.js:228-237](js/app.js)
  - Install Thonny (thonny.org), choose "MicroPython (Raspberry Pi Pico)", REPL `>>>` — [js/app.js:240-247](js/app.js)
  - First program: onboard LED blink with line explanations, plus a "Run on board" option — [js/app.js:250-272](js/app.js)
  - Save as `main.py` — [js/app.js:275-279](js/app.js)
- Troubleshooting:
  - RP2350 drive missing (cable or BOOTSEL)
  - no `>>>` in Thonny (interpreter choice / Stop / site console holding the port)
  - reading error messages (IndentationError, NameError)
  - LED not blinking (`"LED"` spelling)
  — [js/app.js:282-288](js/app.js)
- Basics chapter 13 "When it does not work: finding a fault" adds general debugging — [js/data-basics-2.js:277](js/data-basics-2.js)
- Each component page has a "mistakes" troubleshooting section (92 `mistakes:`/`ideas:` field hits across component files) — grep of `js/data-components*.js`
- Nothing found on USB drivers (the "driver" hits are motor drivers or device-driver files), flash_nuke, Linux permissions, or Mac/ChromeOS specifics — keyword scan

### Inferences
- Setup is adequate for Windows lab machines running Thonny, which is the assumed environment.

### Gaps
- None.

## 6. What README says was NOT tested and stated limitations

### Takeaway
The README states plainly that no code example was run on real hardware, no circuit was built physically, and external library usage was written from memory. Web Serial was tested only against a simulated board.

### Cited Findings
- Code examples were written from the MicroPython documentation and not run on a real board — [README.md:160](README.md)
- Pin order in modules varies by manufacturer, so the instructor should compare against the lab's kit — [README.md:161](README.md)
- Wiring drawings are auto-checked against their tables, but the circuits were not built physically. Split power rails on some breadboards need a bridge — [README.md:162](README.md)
- Assumes Pico 2 with soldered headers (H version) — [README.md:163](README.md)
- Inter-board I2C uses `I2CTarget` (new MicroPython only) and is untested. UART is the recommended default — [README.md:165](README.md)
- External libraries (`bme280`, `mfrc522`, `nrf24l01`, IR decoding): names, install method and commands were written from memory and not tested — [README.md:166](README.md)
- Part-5 parts are driven directly from datasheets and were not run on hardware. INA219 and PCA9685 share address 0x40, and the planner warns about this — [README.md:167](README.md)
- Tracks E-H were not built physically. G3 needs `mfrc522`. G4 needs an Android Bluetooth terminal (HC-05 does not work with iPhone) — [README.md:169](README.md)
- The three site-written drivers were not run on hardware — [README.md:170](README.md)
- LCD I2C backpack and MAX7219 are 5 V parts; the pages explain level shifting — [README.md:171](README.md)
- Run-on-board was tested only against a simulated board — [README.md:62](README.md)
- Robot: illustrative, not a physics simulation. No strength or stability check. Right angles only. Weights and centre of gravity are estimates. Dimensions are assumed. Touch drag was not tested on real touchscreens. 2,500 random-operation fuzz test passed — [README.md:175-179,202-203](README.md)
- Planner layout is one suggestion among many. If the auto-check fails, a message is shown instead of a drawing — [README.md:164](README.md)

### Inferences
- The content is unverified on hardware. That is a material risk to flag before classroom use or any market comparison.

### Gaps
- None.

## 7. Language and RTL

### Takeaway
All content is authored bilingually (Hebrew/English) at the data level. The page direction switches between `rtl` and `ltr` with the language.

### Cited Findings
- Authoring rule: every text is written twice, `{ he, en }` or `B('עברית','English')` — [README.md:66](README.md)
- The language toggle sets `document.documentElement.lang` and `dir` to `rtl` for Hebrew, `ltr` otherwise. The choice is persisted in `pico.lang`. `?lang=en|he` URL parameter — [js/app.js:669-672](js/app.js), [js/i18n.js:11-20](js/i18n.js), [README.md:49](README.md)
- RTL-aware CSS and code: `dir`/`rtl` handling found in index.html, app.js, board.js, planner-view.js, wiring.js and style.css. Logical properties such as `padding-inline-start` are used — keyword scan; [css/style.css:800](css/style.css)
- Code itself and code comments are in English only (e.g. `# the LED on the board itself`) — [js/app.js:259](js/app.js)
- The README is Hebrew only — [README.md](README.md)

### Inferences
- English and Hebrew coverage is symmetric by construction. No third language (e.g. Arabic) is present.

### Gaps
- I did not verify that every string has a non-empty English counterpart. The authoring helpers suggest so, but there was no exhaustive check.
