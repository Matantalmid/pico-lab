# Beginner and Student Pain Points: Raspberry Pi Pico / Pico 2 with MicroPython

Research date: 2026-11-20. Sources are mostly community forums (MicroPython forum, Pimoroni, Core Electronics, element14, Digi-Key, Arduino forum), vendor and official Raspberry Pi pages, and a few education papers. Dates are given where known; "n.d." means no date was visible on the page.

**Caveat on frequency.** No source gives hard counts of how often each problem occurs. The ranking below is inferred from (a) how many independent threads turned up for each symptom in searches, (b) whether vendors and instructors chose to warn about it in their FAQs, and (c) how badly it blocks a learner. Treat the ranking as informed judgment, not measured data.

### Working ranked list (by frequency x impact, inferred)
1. Board not detected or can't connect (charge-only cable, BOOTSEL, wrong port, Thonny "device busy" because main.py is running). Blocks everything at the first step.
2. Wrong firmware for the board (Pico vs Pico W vs Pico 2 vs Pico 2 W, vendor builds, ARM vs RISC-V). Symptoms: `network` missing, LED not blinking, odd behaviour.
3. Pin numbering: GP number vs physical pin; on W boards the onboard LED is `Pin("LED")`, not `Pin(25)`.
4. I2C sensor not found: SDA/SCL swapped, wrong bus/pin pair, missing pull-ups, driver file not copied to the board.
5. LED, resistor and breadboard basics: polarity, no current-limiting resistor, floating inputs with no pull resistor.
6. Power: servos and motors powered from 3V3 or from GPIO, causing resets and brownouts; no common ground.
7. Buttons and interrupts: bounce causes multiple triggers; sleeping or allocating memory inside an IRQ.
8. ADC confusion: `read_u16` gives 0-65535 but only 12 real bits; noise from the switching regulator.
9. Pico 2 specific: erratum E9 on pull-downs (A2 silicon); 5V tolerance only on the A4 stepping and with conditions.
10. Program-level errors: ImportError (driver not on the board), IndentationError, MemoryError.

---

## Setup: flashing, Thonny, ports, cables, main.py

### Takeaway
Most "first hour" failures are connection failures. The usual causes are a charge-only USB cable, a botched BOOTSEL sequence, the wrong COM port or another program holding it, and a `main.py` that auto-runs and makes Thonny report the board as busy. These are cheap to prevent with a single troubleshooting flowchart.

### Cited Findings
- Adafruit says that many people end up using charge-only USB cables, that this is "very frustrating", and that you need a cable known to be good for data. Microsoft Q&A gives the same advice for Pico COM-port problems on Windows 11 (2025). — [Adafruit Learn](https://learn.adafruit.com/elements/3205830/assets/139175/exhibit); [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2156610/how-to-resolve-com-port-issues-for-raspberry-pi-pi)
- Digi-Key forum, "Pico not detected as USB drive in BOOTSEL mode": the advice was to try a different cable and port and to close Thonny before re-entering BOOTSEL. Another forum user found that about half of their micro-USB cables were charge-only (n.d.). — [Digi-Key forum](https://forum.digikey.com/t/raspberry-pi-pico-not-detected-as-usb-drive-in-bootsel-mode/72009)
- RP2040 boards show up as the drive "RPI-RP2". RP2350 (Pico 2 family) boards show up as "RP2350", so learners following older guides may look for the wrong drive name. — [Vilros troubleshooting](https://vilros.com/a/learn/resources/troubleshooting/raspberry-pi-pico-connection-problems)
- On macOS Ventura, Finder's metadata writes could break UF2 copies to RPI-RP2. Raspberry Pi's documented workaround was `cp -X` from Terminal (2022-23). — [Raspberry Pi news: The Ventura problem](https://www.raspberrypi.com/news/the-ventura-problem/)
- "Device is busy or does not respond" in Thonny usually means a `main.py` is auto-running. The fixes are clicking Stop or Ctrl+C. Windows can also reassign the COM port, and another serial program (or a virtual COM port tool) can hold it, giving "Access is denied" (MicroPython forum, 2021-22, older but recurring). — [MicroPython forum p=59661](https://forum.micropython.org/viewtopic.php?p=59661); [MicroPython forum p=65563](https://forum.micropython.org/viewtopic.php?p=65563); [MicroPython forum p=63139](https://forum.micropython.org/viewtopic.php?p=63139)
- A `uasyncio` program running from main.py can make the REPL unreachable. — [MicroPython forum: uasyncio and inaccessible REPL](https://forum.micropython.org/viewtopic.php?p=62422)
- When the board is wedged, flashing `flash_nuke.uf2` and then reinstalling MicroPython is the commonly reported recovery. — [zenn.dev write-up (Japanese)](https://zenn.dev/shimazu_aon/articles/d5f282129a694e)
- On a Pico W, `machine.reset()` drops the serial device and Thonny reports `/dev/ttyACM0` missing. Learners read this as a crash. — [Thonny Google Group](https://groups.google.com/g/thonny/c/Dw6myx5_TGU)
- On an M1 Mac with a Pico W, Thonny could not access the usbmodem port; one user saw "port in use" even though `lsof` showed nothing holding it. — [Thonny group (M1 Mac)](https://groups.google.com/g/thonny/c/2xy0LI66CEU)
- Instructor FAQ (Dan McCreary, "Learning MicroPython", ©2025). For "Pico won't connect": try a different cable (some are charge-only), try another port, reflash the UF2 in BOOTSEL mode, restart Thonny. Install flow: hold BOOTSEL while plugging in, then select the "MicroPython (Raspberry Pi Pico)" interpreter. — [Learning MicroPython FAQ](https://dmccreary.github.io/learning-micropython/faq/)
- Beginner guides list "forgetting to hold BOOTSEL while plugging in" and "not installing MicroPython firmware at all before programming" as common mistakes. Learners also mix up MicroPython and CircuitPython tutorials. — [leyaa.ai Q&A](https://leyaa.ai/core-engineering/learn/iot-protocols/qna/how-to-program-pico-with-micropython); [BIT-101 blog (2021)](https://www.bit-101.com/2017/2021/02/raspberry-pi-pico-what-ive-learned/)

### Inferences
- A "Board not connecting?" flowchart should cover: cable, BOOTSEL, drive name (RPI-RP2 vs RP2350), Thonny interpreter and port, Stop/Ctrl+C for a running main.py, close other serial apps, then flash_nuke. That one page probably prevents the largest share of week-1 support requests.
- Teach main.py vs boot.py together with the "busy" symptom, and with how to escape it (Ctrl+C, or flash_nuke as the last resort).
- Labs should list a "known data cable" in the kit and tell students to label the cables.

### Gaps
- I found no source with numeric frequency, such as the share of support posts caused by cables.
- I found no Chromebook-specific sources in this pass. Chromebooks cannot run Thonny natively without Linux; browser tools such as Web Serial or the Pico web IDEs would need separate checking.
- The boot.py vs main.py confusion was not specifically sourced, beyond the main.py auto-run causing "busy".

---

## Firmware mix-ups: Pico / Pico W / Pico 2 / Pico 2 W, ARM vs RISC-V

### Takeaway
Since the Pico 2 family arrived (Aug 2024), there are at least four official UF2 targets plus vendor builds (Pimoroni) and a RISC-V preview. Flashing the wrong one gives confusing symptoms: `ImportError: no module named 'network'`, an LED that won't blink, or features that are missing.

### Cited Findings
- Pimoroni forum threads (2024-25): users flashed a Pico Plus 2 or PicoGraphics build onto a Pico 2 W and had no `network` module. The fix was the `pico2_w` / `rpi_pico2_w` build. Thonny labelling the board "RP2040" was reported as cosmetic. — [Pimoroni: Pico 2w Network Module](https://forums.pimoroni.com/t/pico-2w-network-module/26899); [Pimoroni: Pico Plus 2 W setup](https://forums.pimoroni.com/t/pico-plus-2-w-setup-for-micropython-not-working/27860); [Pimoroni: Pico2W uf2 file problem](https://forums.pimoroni.com/t/pico2w-uf2-file-problem/28095)
- A corrupt UF2 download is another reported cause, so re-downloading is a reasonable step. — [Pimoroni: Pico 2 W problem with Pimoroni .uf2](https://forums.pimoroni.com/t/pico-2-w-problem-with-pimoroni-uf2/26638)
- The RP2350 has two Cortex-M33 cores and two Hazard3 RISC-V cores. MicroPython's RPI_PICO2 download page offers a separate RISC-V build labelled preview. Tom's Hardware warns "things are liable to break" on the RISC-V firmware (2024). — [micropython.org RPI_PICO2](https://www.micropython.org/download/RPI_PICO2); [Tom's Hardware RISC-V MicroPython guide](https://www.tomshardware.com/raspberry-pi/raspberry-pi-pico/how-to-install-micropython-for-risc-v-on-the-raspberry-pi-pico-2)
- MicroPython v1.24 (Nov 2024) was the first official release with RP2350 support. — [CNX Software, 2024-11-01](https://www.cnx-software.com/2024/11/01/micropython-v1-24-release-rp2350-esp32-c6-microcontrollers-risc-v-improvements/)
- Older forum question: "How to distinguish Pico from Pico W?" This confusion predates the Pico 2. — [MicroPython forum p=68641](https://forum.micropython.org/viewtopic.php?p=68641)

### Inferences
- The website needs a "Which board do I have? Which UF2?" picker with photos: wireless module or not, and the chip marking RP2040 vs RP2350. It should recommend ARM, not RISC-V, for students.
- Teach students to run `import sys; print(sys.implementation)` / `os.uname()` to check which firmware is installed.

### Gaps
- No data on how often students accidentally flash the RISC-V build.

---

## Pin numbering and onboard LED

### Takeaway
GP numbers vs physical pin numbers is a top wiring and code mismatch. On W boards the onboard LED is wired to the wireless chip, so `Pin(25)` silently does nothing. This breaks the very first "blink" lab.

### Cited Findings
- On the Pico W and Pico 2 W the LED is not on GPIO 25. The code must use `Pin("LED", Pin.OUT)`, with the quotes, which works on all Picos with recent MicroPython. Users report the code "runs with no error" while the LED stays off. — [PiShop.ca: Pico LED pin definition change](https://support.pishop.ca/article/150-pico-led-pin-definition-change); [MicroPython forum p=69807](https://forum.micropython.org/viewtopic.php?p=69807); [MicroPython forum: Pin as string doesn't work](https://forum.micropython.org/viewtopic.php?p=68977); [Pimoroni: Pico Plus 2 W LED (2024-25)](https://forums.pimoroni.com/t/new-pico-plus-2-w-led/25923)
- The same problem appeared even in official tooling: the VS Code Pico extension blinked the wrong LED on a Pico 2 W (element14, 2024-25). — [element14 thread](https://community.element14.com/products/raspberry-pi/f/forum/55990/solved-visual-studio-pico-extension-release-today-fails-to-blink-the-right-led-for-a-pico2_w)
- MicroPython `Pin(n)` takes GPIO numbers, not physical pin numbers; for example GP4 is physical pin 6. — [MicroPython forum p=70524](https://forum.micropython.org/viewtopic.php?p=70524)
- The instructor FAQ lists "use the GP number not the physical pin number" as a standard fix for "LED won't light". — [Learning MicroPython FAQ](https://dmccreary.github.io/learning-micropython/faq/)

### Inferences
- Provide a printable pinout with GP numbers in large type and physical numbers small, plus an interactive "click a pin, get the code" tool.
- The first blink lab should use `Pin("LED")`, explain why, and then move to an external LED on a GP pin.

### Gaps
- No quantitative frequency data.

---

## Hardware and wiring: LEDs, resistors, breadboards, pull-ups, I2C, 3.3 V vs 5 V, power

### Takeaway
The recurring wiring faults are LED polarity, a missing current-limiting resistor, floating inputs, swapped SDA/SCL or the wrong I2C bus pins, and powering servos or motors from the Pico. Raspberry Pi's own book had to issue an erratum about pull resistors. Pico 2 brings new 5 V-tolerance and E9 details that differ by silicon stepping.

### Cited Findings
- Raspberry Pi's errata for *Get Started with MicroPython on Raspberry Pi Pico* (2021) corrected examples because GPIO inputs are not pulled down by default; inputs need explicit pull resistors. — [HackSpace errata PDF](https://hackspace.raspberrypi.com/downloads/eyJfcmFpbHMiOnsiZGF0YSI6NDUyMiwicHVyIjoiYmxvYl9pZCJ9fQ==--03a43d4a0f88328024b3ed9feb29e0c95e33c0a6/210226%20Get%20Started%20with%20Micropython%20Errata.pdf)
- Instructor FAQ for "LED won't light": check polarity (long leg to GPIO), use about a 330 Ω resistor, use the GP number. For "sensor wrong readings": swapped SDA/SCL, I2C pins not matching the code, driver file missing from the Pico. For "display blank": find the address with a scanner (often 0x3C/0x3D) and call `show()`. For "program stops after a few seconds": excessive current draw (power motors separately), MemoryError, or a loose wire. — [Learning MicroPython FAQ](https://dmccreary.github.io/learning-micropython/faq/)
- I2C `scan()` returning `[]` means no device acknowledged, so the cause is wiring or power. Swapped SDA/SCL is a frequent cause. Default I2C pins have differed between MicroPython builds (Pico vs Pico W), so pass `sda=`/`scl=` explicitly. Boards have fixed I2C pins with pull-ups (Pimoroni Lipo GP4/5; Explorer base GP20/21). — [MicroPython forum p=61203](https://forum.micropython.org/viewtopic.php?p=61203); [Core Electronics: MPU6050 + Pico (2024)](https://forum.core-electronics.com.au/t/i2c-failure-when-communicating-with-imu-mpu6050-and-rpi-pico/20832); [Core Electronics: I2C issues on Pico W](https://forum.core-electronics.com.au/t/i2c-issues-on-pico-w/17570?page=2); [Pimoroni: STEMMA port pull-ups](https://forums.pimoroni.com/t/cant-find-i2c-devices-on-pico-lipo-on-stemma-port/22858); [Pimoroni: Breakout Garden BME688 (2025)](https://forums.pimoroni.com/t/pico-breakout-garden-base-and-bme688-not-reading-in-thonny/27821)
- The opposite symptom, a scan returning every address 0x08-0x77, points to a floating or shorted bus. — [All About Circuits forum (INA219 on Pico)](https://forum.allaboutcircuits.com/threads/ina219-not-connecting-i2c-scan-returns-all-addresses-0x08-0x77-on-pi-pico.210670/)
- `OSError: [Errno 5] EIO` on I2C is a common learner error thread. — [MicroPython forum p=70524](https://forum.micropython.org/viewtopic.php?p=70524)
- Servos: a sudden current draw when a servo moves dips the voltage until the CPU resets. Power servos from a separate 5 V supply with a common ground (forum consensus, 2024). Kitronik's Simply Servos datasheet lists the 3V3 output limit as 50 mA. — [Arduino forum: servos and ESP32 constantly resetting](https://forum.arduino.cc/t/servos-and-esp32-constantly-resetting/1249421); [Particle community](https://community.particle.io/t/servo-writes-causing-boron-to-reboot-now/67643); [Kitronik Simply Servos datasheet](https://cdn.sparkfun.com/assets/c/6/2/3/2/5339-kitronik-simply-servos-raspberry-pi-pico-datashseet.pdf)
- RP2350 5 V tolerance: the A4 stepping (announced 29 Jul 2025) is "now officially 5V tolerant", but only while IOVDD is powered, or the pad is damaged. "Eventually all Pico 2 products will use the A4 stepping", and about 30,000 A3 units go into Pico 2 / 2 W builds. Community discussion says ADC-capable GPIOs are not 5 V tolerant. — [Raspberry Pi news: RP2350 A4 (2025-07-29)](https://www.raspberrypi.com/news/rp2350-a4-rp2354-and-a-new-hacking-challenge/); [cctalk mailing list discussion](https://classiccmp.org/mailman3/hyperkitty/list/cctalk@classiccmp.org/message/KQSLPKCY7ZRZ2JKE26ZVVPDONBWQNQRM)
- The RP2040 (original Pico) is not officially 5 V tolerant, though hobbyists do it. — [Hackaday 2023-04-05](https://hackaday.com/2023/04/05/rp2040-and-5v-logic-best-friends-this-fx9000p-confirms/)

### Inferences
- Teach students to treat all Picos as 3.3 V-only. That is a safe, simple rule, and the RP2350 A4 nuance is too conditional for beginners.
- Provide wiring "spot the mistake" exercises (polarity, resistor, ground, SDA/SCL swap) and an I2C scanner script with a decision tree for `[]`, all-addresses, and `EIO`.
- Provide a power page: VBUS (USB 5 V), VSYS (input 1.8-5.5 V), 3V3(OUT) (low current). Rule: never power motors or servos from the Pico; use a common ground.

### Gaps
- I found no direct sources here on ground loops, the GPIO current limit per pin, or breadboard rail splits (a half-rail break on long breadboards). These should be verified separately from the Pico datasheet.
- I did not open the Pico datasheet itself for exact VSYS/3V3 current figures.

---

## Programming concepts: blocking loops, debouncing, IRQs, PWM, ADC, memory, libraries

### Takeaway
After setup, the main conceptual hurdles are bounce and IRQ discipline, the 16-bit API scaling (`read_u16` / `duty_u16`), and "where do I get the driver and how do I get it onto the board" (ImportError). MemoryError and IndentationError show up as frequent runtime errors.

### Cited Findings
- Contact bounce "almost certainly will" cause an interrupt to fire multiple times, and you should not put delays inside the handler (Peter Hinch, MicroPython forum). — [MicroPython forum: IRQ debounce](https://forum.micropython.org/viewtopic.php?p=58433)
- A one-shot timer restarted on every edge (about 200 ms) is a widely cited debounce pattern. — [kaspars.net MicroPython button debounce](https://kaspars.net/blog/micropython-button-debounce/md)
- Random Nerd Tutorials Pico interrupt guide (2024): one press can produce many rapid HIGH/LOW transitions; it covers external and timer interrupts. — [Random Nerd Tutorials](https://randomnerdtutorials.com/raspberry-pi-pico-interrupts-micropython/)
- Hard IRQs on rp2 cannot allocate memory, and examples call `micropython.alloc_emergency_exception_buf(100)` to get tracebacks from handlers. Search results did not explain the allocation rule authoritatively; check MicroPython docs, "Writing interrupt handlers". — [McCreary: interrupt handlers lab](https://dmccreary.github.io/micropython/advanced-labs/02-interrupt-handlers)
- `ADC.read_u16()` always returns a value scaled to 16 bits (0-65535), but the RP2040 ADC is 12-bit, so the low bits carry no extra resolution. — [MicroPython forum: Pico ADC misbehavior](https://forum.micropython.org/viewtopic.php?p=64755); [MicroPython forum p=64954](https://forum.micropython.org/viewtopic.php?p=64954)
- ADC noise comes from the onboard switching regulator. Driving GP23 high forces PWM mode and reduces ripple. Remedies include averaging and using a grounded channel to estimate offset. The Pico ADC was characterised as having nonlinearity issues (Hackaday 2021). — [Hackaday: Pico ADC characterized](https://hackaday.com/2021/03/15/raspberry-pi-pico-adc-characterized); [Pimoroni: Automation 2040W ADC jitter](https://forums.pimoroni.com/t/automation-2040w-adc-jitter/28351); [Core Electronics: Reading analog values on PicoW](https://forum.core-electronics.com.au/t/reading-analog-values-on-picow/17502); [Stack Overflow mirror: Pico ADC reading](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/71949863/raspberry-pi-pico-adc-reading)
- Instructor FAQ items: ADC on GP26-28 reads 0-3.3 V as 0-65535. ImportError means a misspelled module or the driver not copied to the Pico; copy it with Thonny "Upload to /" or `mpremote`. IndentationError comes from mixing tabs and spaces. MemoryError appears on the 264 KB RAM of the RP2040. — [Learning MicroPython FAQ](https://dmccreary.github.io/learning-micropython/faq/)
- An instructor poster catalogues the common MicroPython errors: MemoryError, OSError, ImportError, AttributeError, SyntaxError, TypeError, ValueError. — [McCreary: MicroPython errors poster](https://dmccreary.github.io/learning-micropython/posters/micropython-errors/)

### Inferences
- Labs should move in stages: polling with `sleep`, then polling with a `ticks_ms` debounce, then IRQ setting a flag, then asyncio. Each stage should show the failure of the previous one (missed presses, bounce, a frozen loop).
- The site needs a dedicated "16-bit API" explainer: `duty_u16(32768)` = 50%; `read_u16` → volts = `x*3.3/65535`; why the 16-bit scale exists (portability across boards).
- Need a "how to install a library" page covering Thonny upload, `mpremote mip install`, and `mip` on W boards over WiFi, with an ImportError checklist.

### Gaps
- I found no sourced student-difficulty evidence specifically on PWM frequency vs duty, `_thread` dual-core pitfalls, PIO, or uasyncio misconceptions in this pass. These remain topics experts call hard, but this research did not document their frequency.
- `mip` usage pitfalls were not sourced.

---

## RP2350 / Pico 2 specific issues and Pico W networking

### Takeaway
Erratum E9 (A2 silicon) makes inputs with the internal pull-down latch at about 2.1 V after being driven high. That breaks the classic "button to 3V3 with PULL_DOWN" lab on early Pico 2 boards. It is fixed in the A4 stepping (Jul 2025), but A2 and A3 boards remain in classrooms.

### Cited Findings
- RP2350-E9: an input with the internal pull-down behaves like bus-hold and sticks at about 2.1-2.15 V after being driven high. The scope was later expanded to cases without pull-downs. The mitigation is to use internal pull-ups, or external pull-downs of 8.2 kΩ or less (Hackaday 2024-08-28 and 2024-09-04; Tom's Hardware 2024). — [Hackaday 2024-08-28](https://hackaday.com/2024/08/28/hardware-bug-in-raspberry-pis-rp2350-causes-faulty-pull-down-behavior); [Hackaday 2024-09-04](https://hackaday.com/2024/09/04/the-worsening-raspberry-pi-rp2350-e9-erratum-situation/); [Hackster.io](https://hackster.io/news/problems-with-the-raspberry-pi-pico-2-raspberry-pi-rp2350-deepen-as-projects-hit-by-erratum-e9-e2ed0c2f0810); [Tom's Hardware](https://www.tomshardware.com/raspberry-pi/raspberry-pi-rp2350-microcontroller-has-a-bug-that-causes-faulty-pull-down-behavior-on-resistors)
- The pico-feedback issue #401 reports pins stuck near 2 V even without pull-downs. — [GitHub raspberrypi/pico-feedback #401](https://github.com/raspberrypi/pico-feedback/issues/401)
- A Pimoroni forum user (2024) said the mitigation couldn't be applied from MicroPython or CircuitPython at the time and suggested pull-ups instead. This is a user's claim and may be outdated. — [Pimoroni: RP2350 internal pull down issue](https://forums.pimoroni.com/t/rp2350-internal-pull-down-issue/25360)
- The A4 stepping fixed Erratum 9 (29 Jul 2025): "External pull-down resistors are no longer required." — [Raspberry Pi news: RP2350 A4](https://www.raspberrypi.com/news/rp2350-a4-rp2354-and-a-new-hacking-challenge/)
- Pico W / 2 W networking: a missing `network` module traces to the wrong firmware, and the onboard LED moved to the wireless chip, as covered above. — [Pimoroni: Pico 2w Network Module](https://forums.pimoroni.com/t/pico-2w-network-module/26899); [PiShop.ca](https://support.pishop.ca/article/150-pico-led-pin-definition-change)

### Inferences
- Teach buttons wired to GND with `Pin.PULL_UP` (active-low) as the default. This pattern works on every Pico and silicon stepping and sidesteps E9 completely. Explain why `value()==0` means "pressed".
- Add a "Pico 2: what's different" page covering the drive name, the UF2 file, E9 and the stepping (chip marking), ARM vs RISC-V, and the 5 V-tolerance caveats.

### Gaps
- I did not research Pico W WiFi connection pitfalls such as country code, 2.4 GHz only, `wlan.status()` codes, or blocking connect loops. These need a separate pass.
- I could not confirm how to read the RP2350 stepping from MicroPython.

---

## What instructors report as hardest, and which teaching approaches work

### Takeaway
Education research says hardware debugging is the hardest skill and is usually learned "unguided". Students struggle most with forming a testable hypothesis. Structured debugging aids (cheat sheets, systematic processes, guided debugging tasks) and simulators help, but simulators hide real-hardware faults.

### Cited Findings
- Ash & Hu (arXiv 2506.11339, Jun 2025, IEEE FIE 2025 WIP): students are expected to learn circuit debugging through "unguided debugging in labs and projects". Students said generating a testable hypothesis was hard. A mini-lecture plus debugging cheat sheet gave a 67% vs 60% success rate and solved problems 1:43 faster, but the result was not statistically significant (n=13 vs 37). Students asked for the cheat sheet earlier, plus guided debugging tasks and a systematic process. — [arXiv 2506.11339](https://arxiv.org/html/2506.11339v1)
- In the same paper, the hardest planted faults were reversed op-amp supply rails (54-60% success) and a probe left on 10x (57% in control). Both show "check the setup and specs before the logic" faults. — [arXiv 2506.11339](https://arxiv.org/html/2506.11339v1)
- An ASEE course paper lists the common hardware faults as missing power, missing ground, loose wires, and wrong signal connections. Its method: check connections and expected waveforms first, then narrow the source. — [ASEE PEER: Teaching an embedded system course to EE and technology students](https://peer.asee.org/teaching-an-embedded-system-course-to-electrical-engineering-and-technology-students.pdf)
- A TU Hamburg paper says most students are unfamiliar with programming embedded hardware, so the learning curve for development and debugging is steep. A KICSS 2025 paper argues that research has neglected the "psychological and cognitive barriers specific to beginners" and that simulators lower cost and access barriers. — [ASEE PEER 50049](https://peer.asee.org/50049.pdf); [arXiv 2512.20628 (KICSS 2025)](https://arxiv.org/pdf/2512.20628)
- Simulated hardware is "more orderly" than real hardware, so real-board issues may never appear (remote-teaching experience paper, 2022). — [arXiv 2207.11603](https://arxiv.org/pdf/2207.11603)
- Wokwi supports MicroPython on the Pico in the browser. A university IoT course (LNU) uses it so students can practise before their hardware arrives. Linux Format (Sep 2024) warns to choose the MicroPython template, not the "Pi Pico" template (which runs Arduino code). — [Wokwi docs: MicroPython](https://docs.wokwi.com/guides/micropython); [LNU IoT HackMD](https://hackmd.io/@lnu-iot/By2r1rlrC); [Linux Format Sep 2024](https://pocketmags.com/linux-format-magazine/september-2024/articles/simulate-your-pi-pico-projects-with-wokwi); [CNX Software 2023](https://www.cnx-software.com/2023/04/10/wokwi-arduino-raspberry-pi-pico-esp32-board-simulator/)
- An Óbuda University (Hungary) embedded systems course keeps a "typical errors" page for Pico getting-started. It returned 404 when fetched, so its content could not be verified. — [Óbuda typical errors (404)](https://www.aut.uni-obuda.hu/es/Embedded%20Systems/Reference/01-getting-started/typical-errors)
- Raspberry Pi Foundation teacher training ("Teach Computing: Introducing Physical Computing") helps teachers choose between micro:bit and Pico. — [Raspberry Pi training hub](https://training-hub.raspberrypi.org/en/courses/teach-computing-introducing-physical-computing)

### Inferences
- The site should include: (1) symptom-based troubleshooting flowcharts (connection, LED, I2C, reset/brownout, button); (2) a printable debugging cheat sheet introduced in week 1, not at the exam; (3) "planted bug" labs where students find a known fault; (4) Wokwi starter projects for pre-hardware practice, explicitly paired with "what the simulator won't show you" (cables, bounce, power dips, E9); (5) print-debugging and REPL-probing habits (e.g. `pin.value()` in the REPL, I2C scan); (6) multimeter-first and, later, logic-analyzer labs for I2C and PWM.

### Gaps
- I found no Pico-specific peer-reviewed study of student errors with counts.
- No sourced instructor ranking of the "hardest topics" (PIO, interrupts, asyncio). This is likely, but unverified here.
- No evidence was gathered on logic-analyzer use in intro courses.
- I did not mine Reddit (r/raspberrypipico, r/micropython) or Stack Overflow for frequency counts. A tag or keyword count there would strengthen the ranking.
