# Landscape of learning resources and tools for Raspberry Pi Pico / Pico 2 with MicroPython (as of Nov 2026)

Research note: about 15 searches and fetches. Many vendor prices and component lists could not be checked one by one, and they are listed under Gaps. Every claim below has a source link. Where a source is old, that is flagged.

## 1. Official resources (Raspberry Pi Ltd / Raspberry Pi Foundation / MicroPython)

### Takeaway
The official stack is free and current for all four boards (Pico, Pico W, Pico 2, Pico 2 W). It has a docs page with UF2 downloads, a Python SDK PDF and a book with a 2nd edition updated for Pico 2. The Foundation runs a free project path and some teacher courses. All of it is English-only and aimed at hobbyists or school pupils, not at college courses with assessment.

### Cited Findings
- The Raspberry Pi documentation MicroPython page provides "latest" UF2 files for Pico, Pico W, Pico 2 and Pico 2 W, hosted on micropython.org. It gives BOOTSEL drag-and-drop install steps and REPL access over USB serial. It links the Python SDK PDF (RP-008355-DS: command line + Thonny), a Pico W-series connectivity PDF (RP-008257-DS), the MicroPython rp2 Quick Reference and library docs, and the pico-micropython-examples repo. Its sample output still shows MicroPython (1,19,1), so parts of the text are stale — [Raspberry Pi docs](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)
- Book: "Get Started with MicroPython on Raspberry Pi Pico", 2nd ed. (Gareth Halfacree & Ben Everard, Raspberry Pi Press), marketed as "fully updated for Raspberry Pi Pico 2 and 2 W". It covers MicroPython, electronic components, and Pico 2 W IoT/BLE projects. First printing is June 2024; a second printing (January 2025) incorporates Pico 2 changes, and errata exist for the first printing — [Raspberry Pi Press](https://magazine.raspberrypi.com/books/get-started-micropython-pico-2ed); [RPi news](https://raspberrypi.com/news/get-started-micropython-pico-new-book); retail at [The Pi Hut](https://thepihut.com/products/get-started-with-micropython-on-raspberry-pi-pico). The PDF has historically been free from Raspberry Pi Press, but I did not re-verify that for the 2nd ed.
- Raspberry Pi Foundation free "Introduction to Raspberry Pi Pico" path: 3 Explore + 2 Design + 1 Invent project (Digital Making Framework), using MicroPython in Thonny. It targets young learners/clubs — [RPF blog](https://www.raspberrypi.org/blog/kids-coding-electronics-raspberry-pi-pico-free-learning-resource/)
- Teacher training: Raspberry Pi Foundation "Teach Computing: Introducing physical computing" course on its training hub — [training-hub](https://training-hub.raspberrypi.org/en/courses/teach-computing-introducing-physical-computing). There is also an NCCE (England) "Physical computing kit – KS4 Raspberry Pi Pico" short course — [teachcomputing.org CP254](https://teachcomputing.org/courses/CP254/physical-computing-kit-ks4-raspberry-pi-pico). A US program funded by Infosys Foundation USA gave free courseware plus a free kit including a Pico to eligible US educators — [RPF blog](https://www.raspberrypi.org/blog/free-computer-science-courseware-hardware-for-american-educators/)
- Raspberry Pi Certified Educator: an older Foundation post cites ">700 Certified Educators". I found no 2025–2026 Pico-specific certification — [RPF Picademy post (older)](https://www.raspberrypi.org/blog/picademy-questions-answered/)
- Quick-start article from Raspberry Pi magazine — [MagPi/RPi magazine](https://magazine.raspberrypi.com/articles/raspberry-pi-pico-with-micropython-a-quick-start-guide)

### Inferences
- The official material covers "how to" well, but it is UK/US school-oriented (KS4, kids' paths) or hobby-oriented (the book). Nothing official is a semester-length college syllabus with labs, rubrics, or exams for MicroPython on Pico.
- None of the official material is offered in Hebrew.

### Gaps
- Current (2026) status and content of the Raspberry Pi Certified Educator program, and whether it includes Pico. I did not find this.
- Whether the 2nd-edition book PDF is a free download today. Not verified.
- Current MicroPython release number for rp2. The docs page does not show it; check micropython.org/download/RPI_PICO2/.

## 2. Simulators and development tools (browser vs install)

### Takeaway
Wokwi is the only mature simulator for Pico/Pico 2 with MicroPython, and it runs in the browser. Its free tier is good enough to teach with, but projects on it are public. Paid plans and a quote-based classroom license add private projects and VS Code/offline use. For real hardware, the options split into installed IDEs (Thonny, VS Code + MicroPico, Arduino Lab desktop, mpremote CLI) and browser IDEs over Web Serial (ViperIDE, Arduino Lab web, BIPES). The browser IDEs work only in Chromium-based browsers.

### Cited Findings
**Wokwi (browser; optional VS Code plugin)**
- Supports "Raspberry Pi Pico 2" (RP2350) with MicroPython. main.py runs automatically when the simulation starts — [Wokwi docs board-pi-pico-2](https://docs.wokwi.com/parts/board-pi-pico-2); original Pico part — [docs](https://docs.wokwi.com/parts/wokwi-pi-pico). The RP2040 emulation is open source (rp2040js) — [GitHub](https://github.com/wokwi/rp2040js)
- Pricing (fetched Nov 2026, EUR, annual billing):
  - Community: €0. Unlimited simulations, unlimited public projects, virtual WiFi.
  - Hobby: €7/mo. Unlisted projects, custom libraries, 100 fast-build minutes.
  - Hobby+: €12/mo. Adds Wokwi for VS Code.
  - Pro: €25/seat/mo. Offline VS Code plugin, CI minutes.
  - The free plan forces public projects and has no custom library or SD uploads — [wokwi.com/pricing](https://wokwi.com/pricing)
- Classroom: "Wokwi Classroom" is designed for universities, colleges and technical institutions. The classroom page shows an example price of $30 per student per semester (4 months), and pricing is by quotation. Prices conflict between pages (€ vs $, Hobby €5.6 vs $7 on /club), so get a live quote — [wokwi.com/classroom](https://wokwi.com/classroom); [wokwi.com/club](https://wokwi.com/club)
- Tutorial on using Wokwi as a Pico simulator for MicroPython, Arduino and C SDK — [DeepBlueEmbedded](https://deepbluembedded.com/raspberry-pi-pico-simulator-wokwi-guide/)

**Thonny (install, free)**
- Thonny is the IDE the Raspberry Pi docs and Foundation projects use — [RPi docs](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html); [RPF blog](https://www.raspberrypi.org/blog/kids-coding-electronics-raspberry-pi-pico-free-learning-resource/). Waveshare's tutorial series is also based on Thonny — [Waveshare docs](https://docs.waveshare.com/Raspberry-Pi-Pico-MicroPython-Tutorial)

**ViperIDE (browser, free, MIT)**
- Browser IDE for MicroPython/CircuitPython by Volodymyr Shymanskyy. It connects over WebSerial/WebUSB with no install, and there is a self-hosted option. It supports Pico, ESP32 and other boards — [Tom's Hardware how-to](https://www.tomshardware.com/raspberry-pi/raspberry-pi-pico/how-to-write-code-for-your-raspberry-pi-pico-in-your-web-browser-with-viperide); [MicroPython discussion #15219](https://github-users.yhajoa.workers.dev/orgs/micropython/discussions/15219); [ecosyste.ms listing](https://awesome.ecosyste.ms/projects/github.com%2Fvshymanskyy%2Fviperide)
- Web Serial is not available in Firefox or Safari — [AlternativeTo / ViperIDE](https://alternativeto.net/software/viperide/about)

**Arduino Lab for MicroPython (install + web)**
- The web version launched 28 Oct 2024 at lab-micropython.arduino.cc, with Chromebook support. It does not work in Firefox (no WebSerial) — [Arduino blog](https://blog.arduino.cc/2024/10/28/the-web-based-arduino-lab-for-micropython-editor-is-out-with-chromebook-support-to-code-alvik-and-more/); [Hackster](https://www.hackster.io/news/arduino-brings-its-micropython-editor-to-the-cloud-with-a-browser-based-web-app-release-310179492abc)
- Desktop release 0.20.0 came out in May 2025 — [GitHub releases](https://github.com/arduino/lab-micropython-editor/releases); [Arduino Labs page](https://labs.arduino.cc/en/labs/micropython)

**VS Code (install)**
- MicroPico (formerly Pico-W-Go) is a community extension by paulober. It adds autocomplete, snippets and project management for Pico boards. It requires Python ≥3.10 and VS Code ≥1.92.1 — [GitHub MicroPico](https://github.com/paulober/MicroPico); tutorial — [Random Nerd Tutorials](https://randomnerdtutorials.com/raspberry-pi-pico-vs-code-micropython/)
- The official Raspberry Pi Pico VS Code extension is mainly for C/C++ SDK. Its MicroPython support is delegated to MicroPico — [RPi news](https://www.raspberrypi.com/news/pico-vscode-extension/); [pico-vscode](https://awesome.ecosyste.ms/projects/github.com%2Fraspberrypi%2Fpico-vscode)

**Block-based**
- BIPES: block-based MicroPython in the browser over Web Serial, supporting RP2040 — [Hackster](https://www.hackster.io/news/bipes-brings-block-based-visual-micropython-programming-to-the-raspberry-pi-pico-rp2040-59754e9c9d82)

### Inferences
- Running fully in the browser: Wokwi (simulation), ViperIDE, Arduino Lab web, and BIPES (the last three need real hardware plus Chrome or Edge). Needing an install: Thonny, VS Code + MicroPico, Arduino Lab desktop, and mpremote (a pip CLI).
- A new site could embed Wokwi links or use its free public projects, so students can work with no hardware and no install. Public-only projects are a privacy and plagiarism concern for graded work, so a classroom license may be needed.

### Gaps
- mpremote: I did not fetch its docs. It is the official MicroPython CLI, installed with pip install mpremote (docs.micropython.org/en/latest/reference/mpremote.html), but this was not verified in this session.
- Whether Arduino Lab explicitly lists Pico 2 support. Not confirmed.
- Exact Wokwi Classroom quote for an Israeli college. Pricing is quote-based.

## 3. Commercial kits and their tutorials

### Takeaway
Vendor kits come with free online docs, usually Sphinx/ReadTheDocs sites with 20–100+ projects. These are project cookbooks with no assessment or teacher layer. Some older Pico kits have been retired, for example the Kitronik Inventor's Kit. The SunFounder Pico 2 W kit is a current, well-documented option at about $76.

### Cited Findings
- Kitronik Inventor's Kit for Pico: 10 experiments. Parts include a 7-segment display and a servo; the Pico is not included. Price was about £30 inc VAT (RS: £25.75 ex / £30.90 inc VAT; SparkFun retail $35.95). SparkFun marks it retired, Little Bird marks it discontinued, and The Pi Hut shows it sold out — [RS](https://uk.rs-online.com/web/p/raspberry-pi-hats-add-ons/0310920); [SparkFun](https://www.sparkfun.com/kitronik-inventor-s-kit-for-the-raspberry-pi-pico.html); [The Pi Hut](https://thepihut.com/collections/raspberry-pi-kits-and-bundles/products/inventors-kit-for-the-raspberry-pi-pico); [Little Bird](https://www.littlebirdelectronics.com.au/collections/kitronik/products/kitronik-inventor-s-kit-for-the-raspberry-pi-pico)
- SunFounder Pico 2 W Ultimate Starter Kit: listed at $75.99. Online docs cover "Getting to know Pico 2 W", MicroPython projects, Arduino projects and a parts list — [SunFounder docs](https://docs.sunfounder.com/projects/pico-2w-kit/en/latest/). The older Kepler kit (Pico W) has free online docs with a video course — [Kepler video course](https://docs.sunfounder.com/projects/kepler-kit/en/latest/video_course/video_course.html). A third-party claim describes the Kepler kit as having "450+ components / 117 projects" (not verified) — [microcontrollerslab 2026 kits](https://microcontrollerslab.com/best-raspberry-pi-pico-kits-and-bundles-in-2026/)
- Euler kit (SunFounder Pico ultimate kit) — [SunFounder store](https://sunfounder.com/collections/pico-w-pico/products/raspberry-pi-pico-ultimate-starter-kit-euler-copy)
- Waveshare: free MicroPython tutorial series (Thonny). Chapters cover basics, GPIO, PWM, ADC, UART, I2C, SPI and PIO — [Waveshare docs](https://docs.waveshare.com/Raspberry-Pi-Pico-MicroPython-Tutorial); Pico 2 wiki — [Waveshare wiki](https://waveshare.com/wiki/Raspberry_Pi_Pico_2)
- Pimoroni: short beginner "Getting started with Pico" guide — [learn.pimoroni.com](https://learn.pimoroni.com/getting-started-with-pico)
- Elecrow: Pico 2 all-in-one starter kit blog/tutorial — [Elecrow](https://www.elecrow.com/blog/getting-started-with-raspberry-pi-pico-2-on-all-in-one-starter-kit.html)
- 2026 roundup of Pico kits and bundles (aggregator; use with care) — [microcontrollerslab](https://microcontrollerslab.com/best-raspberry-pi-pico-kits-and-bundles-in-2026/)

### Inferences
- Kit docs are tied to that vendor's parts and pin numbers, so a lecturer who mixes vendors has to rewrite the labs. A vendor-neutral site with component-level labs that map to several kits would fill a real need.

### Gaps
- I did not verify current prices or component lists for: Freenove (Ultimate/Super Starter Kit for Pico), Elegoo, Cytron Maker Pi Pico / Maker Pi RP2040, Pimoroni (Pico Explorer/Explorer Base), Adafruit Learn guides (mostly CircuitPython), SparkFun, or Keyestudio. A follow-up pass is needed.
- Kitronik Discovery kit details and Pico 2 compatibility. Not found.

## 4. Courses: MOOCs, YouTube, universities, PIO

### Takeaway
Video and free web courses are plentiful in English. Highlights:
- Paul McWhorter's 90+ lesson Pico W series (including PIO).
- The Core Electronics beginner workshop.
- Kevin McAleer, DroneBot Workshop and Random Nerd Tutorials (paid eBook).

Udemy has small, cheap courses with roughly 1k students each. I found nothing Pico-specific on Coursera or edX. At university level, Cornell ECE 4760 is the flagship RP2040 course, but it uses the C SDK, not MicroPython, and was still on RP2040 with an RP2350 transition pending.

### Cited Findings
- Paul McWhorter (free YouTube): Pico W series for absolute beginners, covering coding and circuits. It runs past Lesson 90 (PIO state-machine timing, looping, shifting), with timers (L80) and interrupts in MicroPython (L83) — [YouTube channel](https://m.youtube.com/@paulmcwhorter); [lesson list (third-party)](https://ikostan.github.io/pico/lessons.readme.html); [Class Central L90](https://classcentral.com/course/youtube-raspberry-pi-pico-w-lesson-90-pio-state-machine-timing-looping-and-shifting-350253)
- Core Electronics "Raspberry Pi Pico Workshop for Beginners": free video course with structured chapters and written explanations plus code for each video — [Core Electronics course](https://core-electronics.com.au/courses/raspberry-pi-pico-workshop); [guide](https://core-electronics.com.au/guides/raspberry-pi-pico-workshop/). I did not confirm whether it has been updated for Pico 2.
- Kevin McAleer: "18 Raspberry Pi Pico projects for beginners" (YouTube) — [Class Central](https://classcentral.com/course/youtube-18-raspberry-pi-pico-projects-to-get-you-started-310102). ExplainingComputers has a 16-minute intro — [Class Central](https://classcentral.com/course/youtube-raspberry-pi-pico-154270)
- DroneBot Workshop long-form Pico guide — [dronebotworkshop.com/pi-pico](https://dronebotworkshop.com/pi-pico/)
- Tom's Hardware has a free setup guide covering Pico 2 / Pico W / Pico — [Tom's Hardware](https://tomshardware.com/how-to/raspberry-pi-pico-setup)
- Random Nerd Tutorials: paid eBook "Learn Raspberry Pi Pico/Pico W with MicroPython" — [RNT eBook](https://randomnerdtutorials.com/raspberry-pi-pico-w-micropython-ebook/); free Pico 2/2 W getting-started guide — [RNT](https://randomnerdtutorials.com/getting-started-raspberry-pi-pico-2-w/)
- Udemy examples:
  - Harish Kondoor, Pico/Pico W MicroPython: 4.3★, 110 ratings, 783 students — [Udemy](https://www.udemy.com/course/raspberry_pi_pico_micropython/)
  - Amit Rana, IoT with MicroPython + Pico W (MQTT, ThingSpeak, Adafruit IO): 4.4★, 1,029 students, updated 2/2026 — [Udemy](https://www.udemy.com/course/learn-iot-using-micropython-and-raspberry-pi-pico/)
  - Node-RED + Pico W: 4.6★, 1,284 students — [Udemy](https://www.udemy.com/course/node-red-and-raspberry-pi-pico-w-getting-started/)
  - MicroPython & CircuitPython projects — [Udemy](https://www.udemy.com/course/micropython-circuitpython-projects-with-raspberry-pi-pico/)
- Other paid platforms: Elektor Academy Pro "Programming the Raspberry Pi Pico in MicroPython" — [Elektor](https://academypro.elektor.com/courses/programming-the-raspberr-pi-pico-in-micropython); Tutorialspoint "Raspberry Pi PICO an introduction with MicroPython" — [Tutorialspoint](https://www.tutorialspoint.com/raspberry-pi-pico-an-introduction-with-micropython/index.asp)
- Open curriculum: Dan McCreary's "Learning MicroPython" (MkDocs, GitHub Pages), which has a course description — [dmccreary.github.io](https://dmccreary.github.io/learning-micropython/course-description/)
- Cornell ECE 4760/5730 (Hunter Adams, Bruce Land): "currently taught using the RP2040 on the Pico". Uses the C SDK, with extensive PIO material (e.g., a PIO VGA driver). The RP2350 pages say links "drop back to the existing 2040 pages until the course switches to the 2350" — [ece4760.github.io](https://ece4760.github.io); [Cornell RP2040 intro](https://people.ece.cornell.edu/land/courses/ece4760/RP2040/index_rp2040_intro.html); [RP2350 page](https://people.ece.cornell.edu/land/courses/projects/index_rp2350.html); [Hackaday 2023](https://hackaday.com/2023/03/10/cornell-updates-their-mcu-course-for-the-rp2040); [Hackaday Aug 2025 projects](https://hackaday.com/2025/08/30/the-latest-projects-from-cornells-ece-4760-5730); [RPi news](https://www.raspberrypi.com/news/cornell-universitys-digital-systems-design-course-is-taught-on-rp2040/)
- Other universities using Pico 2 W:
  - CMU 16-375 (F2025) uses Pico 2 W with CircuitPython — [CMU](https://courses.ideate.cmu.edu/16-375/f2025/text/circuitpython/pico-2w-hardware.html)
  - Linnaeus Univ. IoT course notes (HackMD, Wokwi + VS Code/MicroPico) — [hackmd lnu-iot](https://hackmd.io/@lnu-iot/By2r1rlrC)
  - Óbuda University (Hungary) Embedded Systems getting-started — [uni-obuda](https://www.aut.uni-obuda.hu/es/Embedded%20Systems/Reference/01-getting-started/getting-started)
  - CTU Prague be2m37mam lectures — [cw.fel.cvut.cz](https://cw.fel.cvut.cz/b251/_export/xhtml/courses/be2m37mam/lectures/start)
  - Fab Academy 2026 students use Wokwi + Pico — [Fab Academy](https://fabacademy.org/2026/labs/puebla/students/gerardo-mora/assignments/week04.html)

### Inferences
- University-grade RP2040/RP2350 material is mostly C SDK (Cornell). MicroPython material is mostly hobbyist, video-first, and has no assessment. A college course in MicroPython that goes from GPIO to PIO, with labs, rubrics and exams, is the gap.
- Paul McWhorter's PIO lessons and Waveshare's PIO chapter are among the few MicroPython-PIO teaching resources.

### Gaps
- Coursera and edX: I found no Pico-specific MicroPython course (the search returned none). Absence is not confirmed.
- Whether Core Electronics has a Pico 2-specific workshop. Not found.

## 5. Hebrew-language resources (Israel)

### Takeaway
Hebrew material for Pico + MicroPython is nearly absent. Searches turned up the following:
- one kids' MicroPython course (ages 12–15)
- a few Hebrew MicroPython/ESP32 blog pages and a PDF intro
- free general-Python MOOCs on campus.gov.il

I found no Hebrew Pico tutorial series, no Hebrew Pico YouTube course, and no ministry or college Pico curriculum. This is the clearest gap a bilingual site could fill.

### Cited Findings
- Tickchak listing: "MicroPython course winter 2025–2026" for ages 12–15. Eight 1.5-hour meetings, subsidized price 300 NIS, built around an electronic kit — [tickchak.co.il/92738](https://tickchak.co.il/92738)
- Arik Porat: Hebrew "MicroPython – introduction" PDF (Jan 2023, older) — [arikporat.com PDF](https://www.arikporat.com/wp-content/uploads/2023/01/Micropython-introduction.pdf)
- python-course.co.il: Hebrew MicroPython explainer page, ESP8266/ESP32-focused — [python-course.co.il](https://python-course.co.il/%D7%A1%D7%95%D7%92%D7%99-%D7%A4%D7%99%D7%99%D7%AA%D7%95%D7%9F/micropython/)
- internet-israel.com: Hebrew guide on connecting an ESP32 and using MicroPython with Thonny — [internet-israel](https://internet-israel.com/%D7%9E%D7%93%D7%A8%D7%99%D7%9B%D7%99%D7%9D/%D7%9E%D7%99%D7%A7%D7%A8%D7%95-%D7%91%D7%A7%D7%A8%D7%99%D7%9D/%D7%97%D7%99%D7%91%D7%95%D7%A8-%D7%A8%D7%90%D7%A9%D7%95%D7%A0%D7%99-%D7%A9%D7%9C-esp32-%D7%95%D7%A2%D7%91%D7%95%D7%93%D7%94-%D7%A2%D7%9D-%D7%9E%D7%99%D7%A7%D7%A8%D7%95%D7%A4%D7%99%D7%99%D7%AA%D7%95/)
- Free Hebrew general Python on the national MOOC platform: Self.Py (10 weeks, about 5 h/week) and Next.py — [campus.gov.il Self.Py](https://campus.gov.il/course/cs-gov-pythonselfpy101-he/); [Next.py](https://campus.gov.il/course/cs-gov-cs-nextpy102/)
- Other Hebrew Python tutorial sites — [reshetech](https://reshetech.co.il/python-tutorials/all-the-tutorials); [ToCode](https://www.tocode.co.il/bundles/python2)
- Hebrew and English searches for "ראספברי פיי פיקו מיקרופייתון" and "Raspberry Pi Pico עברית יוטיוב" returned only English resources, for example [Core Electronics](https://core-electronics.com.au/guides/raspberry-pi-pico-workshop/) and [Waveshare](https://docs.waveshare.com/Raspberry-Pi-Pico-MicroPython-Tutorial)

### Inferences
- Israeli learners can get Hebrew general-Python teaching (Self.Py), but they must switch to English for anything Pico- or hardware-specific. A bilingual site that bridges Self.Py-level Python to Pico hardware labs would have little direct competition.
- RTL layout with mixed LTR code blocks is a real technical and design need that no existing resource handles.

### Gaps
- I did not search YouTube directly. Hebrew Arduino channels may exist but did not show up in web search.
- Israeli Ministry of Education electronics/robotics curricula (e.g., "מגמת אלקטרוניקה", Arduino in high schools) were not checked. Nor were Technion, Afeka, Braude, Ort Braude, Shenkar or HIT course pages, Hebrew maker communities (e.g., Facebook groups, makers.co.il), or Israeli vendors' Hebrew tutorials (e.g., Arduino.co.il, Robotics.org.il). A follow-up is needed.

## 6. What existing resources commonly lack

### Takeaway
Across official, vendor, video and MOOC resources, the common missing pieces are:
- assessment and teacher-facing material for college level
- Hebrew/RTL localisation
- a structured progression that covers Pico 2-specific features
- integrated no-hardware simulation
- vendor-neutral labs
- explicit electrical-safety guidance

### Cited Findings
- Vendor docs are kit-specific project lists (SunFounder: About kit, Getting to know Pico 2 W, MicroPython projects, Arduino projects, parts list). They have no assessment or teacher guides — [SunFounder Pico 2 W docs](https://docs.sunfounder.com/projects/pico-2w-kit/en/latest/)
- Official Foundation material targets kids and clubs (Explore/Design/Invent projects) and UK KS4 teachers — [RPF blog](https://www.raspberrypi.org/blog/kids-coding-electronics-raspberry-pi-pico-free-learning-resource/); [teachcomputing CP254](https://teachcomputing.org/courses/CP254/physical-computing-kit-ks4-raspberry-pi-pico)
- Official docs still show stale version output (MicroPython 1.19.1) — [RPi docs](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)
- Wokwi's free tier makes all projects public, which matters for graded work; private projects and offline use cost extra — [Wokwi pricing](https://wokwi.com/pricing)
- Browser IDEs need Chromium (no Firefox/Safari Web Serial) — [AlternativeTo](https://alternativeto.net/software/viperide/about); [Hackster on Arduino Lab web](https://www.hackster.io/news/arduino-brings-its-micropython-editor-to-the-cloud-with-a-browser-based-web-app-release-310179492abc)
- Retired kits break curricula built on them (Kitronik Inventor's Kit) — [SparkFun](https://www.sparkfun.com/kitronik-inventor-s-kit-for-the-raspberry-pi-pico.html)
- Book errata for Pico 2 show that print material goes stale quickly — [Raspberry Pi Press](https://magazine.raspberrypi.com/books/get-started-micropython-pico-2ed)
- No Hebrew Pico resources were found (see section 5).

### Inferences
These are suggestions for a new bilingual site, inferred from the gaps above:
1. Hebrew/English parallel content with proper RTL plus LTR code.
2. A semester-structured progression (Python basics → GPIO → PWM/ADC → I2C/SPI/UART → interrupts/timers → PIO → Wi-Fi/BLE on Pico 2 W → project). Each unit would have objectives, quizzes, lab rubrics and an instructor guide.
3. An embedded Wokwi simulation for every lab, so students can work without hardware.
4. Kit-agnostic wiring with mappings to common kits.
5. A browser-first toolchain (ViperIDE / Arduino Lab web) with a Thonny fallback.
6. An offline/PDF export.
7. An explicit safety unit (3.3 V logic, current limits, motor/relay isolation, LiPo handling).
8. Pico 2 (RP2350) notes such as version-checked UF2 links.

Items 7 and 8 are inferences. I found no source that audits safety coverage across the existing resources.

### Gaps
- I found no published survey or study of lecturers' needs for Pico/MicroPython teaching. The "lacks" list is inferred from reviewing the resources, not from user research.
- I did not check whether any existing resource offers auto-graded MicroPython exercises (e.g., a Wokwi CI-based grader).
