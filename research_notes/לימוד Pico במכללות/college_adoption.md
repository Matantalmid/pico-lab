# What drives college / technician-school / university adoption of microcontroller teaching resources (with Israel focus)

Research date: 2026-11-20. Note on method: about 18 search/fetch calls. Several key Israeli PDFs (meyda.education.gov.il) returned as compressed binary that could not be text-extracted in this environment, so some Israeli details rest on search-result summaries of those PDFs and are flagged "(snippet-level, not read in full)". Verify them before quoting.

## 1. Which features drive adoption of OER and online labs in engineering/technician education?

### Takeaway
The best evidence says adoption is limited less by price than by **finding and vetting good, subject-specific content**, and by **instructor time**. A resource gets adopted when it is easy to discover, already aligned to a course, high quality, clearly licensed, and cheap to integrate. For labs, the deciding factors are cost, space, curriculum integration and trained technicians.

### Cited Findings
- **Engineering mechanics OER study (2020).** U.S. mechanics instructors were surveyed and college websites analyzed. The study found that a lack of quality OER content for these courses is the primary barrier to wider adoption — [ISTL 2020, Penn State](https://journals.library.ualberta.ca/istl/index.php/istl/article/view/65); [PDF](https://mechanicsmap.psu.edu/bio/pubs/ISTL_2020.pdf)
- The same paper's background reports that 59% of engineering faculty interviewed had little or no familiarity with OER. The figure appears to come from an earlier study cited inside the paper, so it is secondary — [ISTL 2020 PDF](https://mechanicsmap.psu.edu/bio/pubs/ISTL_2020.pdf)
- **Babson Survey Research Group (U.S. faculty, all disciplines, 2014).** The top deterrents were the lack of a comprehensive catalog, difficulty finding resources, and licensing concerns. The lead researcher said the time and effort to find, evaluate and adopt materials is the critical factor. This source is older than the 2020 cutoff — [Campus Technology, 2014](https://campustechnology.com/articles/2014/10/29/two-thirds-of-faculty-unaware-of-open-education-resources.aspx)
- A later Babson report found that 49% said there are "not enough resources for my subject" and 48% said resources are too hard to find. The report date and URL were not confirmed beyond a search snippet — [Chronicle of Higher Ed](https://www.chronicle.com/article/more-professors-know-about-free-textbook-options-but-adoption-remains-low/)
- **Diffusion-of-innovation analysis of OER adoption in higher education (2022).** It applies Rogers' attributes: relative advantage, compatibility, complexity, trialability and observability. It was not read in full — [PMC9304708](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9304708/)
- **STEM faculty survey, Mississippi State dissertation (2025, n=48).** Older faculty (over 48) and more experienced faculty (over 7 years teaching) were less likely to incorporate OER. It was not read in full — [MSState](https://scholarsjunction.msstate.edu/td/6557)
- **Remote automatic-control lab (2022).** The paper names cost and space as adoption factors, along with curriculum integration and trained technicians, and reports positive effects on learning — [Ballatore et al., Education in the Knowledge Society 23 (2022)](https://revistas.usal.es/index.php/eks/article/view/28495)
- **Open-source remote controls labs (2022).** Low-cost open-source setups have driven modest adoption of hardware exercises. The time, space and equipment that even cheap setups need are still obstacles, and interface design affects students' sense of autonomy and usability ratings (snippet-level) — [Reid et al. 2022, via core.ac.uk](https://core.ac.uk/download/491173144.pdf)
- **Remote STM32 microcontroller IoT lab (2022).** The teacher can monitor and interact with a student's board during the lesson. It was motivated by COVID — [Jacko et al., Sensors Feb 2022](https://doaj.org/article/ca30b3afeba942b6b1ab30539f999c52)

### Inferences
- For a Pico teaching site, the most important adoption features are likely: (1) **course-shaped packaging** (a semester or module sequence that maps onto a syllabus, not loose tutorials); (2) **discoverability and a clear catalog**; (3) **explicit open license** (e.g., CC BY); (4) **low integration effort** (ready-made worksheets, answer keys, timings); (5) **quality signals** (institutional users, reviewed content).
- Younger or newer instructors may be the early adopters. Department-level adoption (a lab coordinator) is the lever for older staff.

### Gaps
- I found no study specific to embedded/microcontroller OER adoption, and no Israeli survey of technician-college instructors on OER.

## 2. How do successful programs structure microcontroller labs?

### Takeaway
Strong university courses (Cornell ECE 4760, now on RP2040/RP2350) run multi-week labs with **checkpoints/check-offs**, a **demo**, a **written report graded against a published rubric**, and a final open project. Lab design follows explicit criteria such as being teachable in 2-3 weeks and scalable to 30-50 stations. Israeli high-school and technician tracks put more weight on a **lab exam** and a **microcontroller project with external examiners**.

### Cited Findings
- **Cornell ECE 4760/5730 moved from PIC32 to RP2040 around Fall 2022/2023.** It teaches RP2040/RP2350 in C with the Pico C-SDK — [Raspberry Pi news](https://www.raspberrypi.com/news/cornell-universitys-digital-systems-design-course-is-taught-on-rp2040/); [Hackaday 2023](https://hackaday.com/2023/03/10/cornell-updates-their-mcu-course-for-the-rp2040); [Cornell Pico projects page](https://people.ece.cornell.edu/land/courses/projects/index_pico.html)
- **Course hub.** The ECE 4760 site gives the lecture and lab schedule, lecture recordings, course policy, grading and lab report expectations. Student final projects are published publicly every year — [ece4760.github.io](https://ece4760.github.io); [Hackaday 2025 project roundup](https://hackaday.com/2025/08/30/the-latest-projects-from-cornells-ece-4760-5730)
- **Cornell general lab write-up rubric.** It includes sections on issues faced and further improvements. If students missed the check-off, they must describe how it could have been reached and ideally finish the lab anyway. A lab handout notes that finishing a checkpoint does not mean leaving early (snippet-level) — [General Lab writeup Rubric PDF](https://people.ece.cornell.edu/land/courses/ece4760/General_Lab_writeup_Rubric.pdf)
- **V. Hunter Adams (Cornell) lists nine criteria for a good microcontroller lab:**
  - self-motivating, building an interesting device
  - extensible beyond the spec
  - adds new peripherals or algorithms only where natural
  - broad appeal (audio, graphics, control, robotics)
  - changes how students see the world
  - interesting to the instructor
  - right abstraction level, saying clearly what the SDK hides
  - teachable in 2-3 weeks
  - scalable and maintainable: affordable for 30-50 copies, fits on a tabletop, stores compactly, easy to repair
  - Source: [Lab Criteria, vanhunteradams.com](https://vanhunteradams.com/Pico/CourseMaterials/Lab_Criteria.html)
- The course materials include a step-by-step setup guide (SDK download plus building the demo code), so setup friction is handled before lab 1 — [Building Demos](https://vha3.github.io/Pico/CourseMaterials/Building_Demos.html)
- **RPI ENGR-2350** (embedded control) uses a printed **check-off sheet** listing per-lab checkpoints, an example of the same checkpoint model — [ENGR-2350 checkoff sheet](https://sites.ecse.rpi.edu/courses/static/ENGR-2350/_downloads/e896799ab105dfffec9f94247401219b/engr2350_checkoff_sheet.pdf)
- **Vocational example (Indonesia).** A Digital Control Systems course first taught theory using a Wokwi simulation with Arduino, then moved to project-based learning — [UNNES VEIC proceeding](https://proceeding.unnes.ac.id/veic/article/download/2862/2323/7181)
- **Israel, Ministry of Education grade-13 lab exam (2016 circular).** The lab exam covers lab experiments, and the school chooses at least one project based on a microcontroller. This is old, so check the current circular (snippet-level) — [711925.pdf](https://meyda.education.gov.il/files/MadaTech/Megama_Technologit/elecomp/mafmar-news/2017/maabdot/711925.pdf)

### Inferences
- A college-ready Pico lab sheet should contain:
  - objectives and the learning outcome code
  - a pre-lab (datasheet reading and calculations)
  - a parts list per station
  - numbered checkpoints, each with an **expected observable result** that a TA can sign off
  - extension ("stretch") tasks
  - report questions
  - a grading rubric
  - a time estimate
- Making each lab a "device" (synth, oscilloscope, balancing controller) rather than an isolated peripheral drill matches Cornell's approach.

### Gaps
- I did not retrieve exact grade weights or per-lab check-off lists for Cornell, and found no MIT or Imperial RP2040 course pages within the call budget.

## 3. Role of simulators (Wokwi, Tinkercad Circuits, Proteus) and remote/hybrid labs

### Takeaway
Simulators are used mainly for **onboarding, pre-labs, remote/hybrid periods and low-resource settings**, usually followed by real hardware. Tinkercad dominates intro and school level (Arduino and micro:bit, with free class management). Wokwi covers Pico, ESP32 and Arduino, and sells a paid "Classroom" tier. Limits are timing fidelity, the component library, and the lack of real-world debugging experience.

### Cited Findings
- **Wokwi Classroom** targets universities, colleges and technical institutions. It offers a fast premium build server, custom library uploads, a private IoT gateway, Wokwi for VS Code, and offline (VS Code) support on request.
  - Price: €30 per student per semester (4 months), minimum 5 students.
  - The page did not mention LMS/LTI integration or autograding.
  - A search snippet showed "$30" and "offline support free until 31 Oct 2025", so currency and terms have changed.
  - Source: [wokwi.com/classroom](https://wokwi.com/classroom) (fetched 2026-11-20)
- Indonesian vocational studies found Wokwi a practical alternative for microcontroller learning when hardware is limited — [UNNES](https://proceeding.unnes.ac.id/veic/article/download/2862/2323/7181); [Unpam SINTAK](https://openjournal.unpam.ac.id/index.php/sintak/article/download/54769/28587/148959)
- Tecnológico de Monterrey ran virtual IoT courses with Wokwi circuits (snippet-level) — [Bohrium listing](https://www.bohrium.com/paper-details/experimental-survey-with-iot-students-and-virtual-classes-with-wokwi-circuits/1129085035975016448-2000000)
- **Tinkercad Circuits.**
  - Teachers can manage classes and hand out assignments, and educational accounts with class management are free — [DigiKey Maker.io 2022](https://www.digikey.com/es/maker/blogs/2022/arduino-simulators-for-hobbyists-makers-and-classroom-environments)
  - Students join with a class code — [All3DP](https://all3dp.com/2/what-is-tinkercad-simply-explained/)
  - ASEE papers describe its use in intro ECE courses, its live simulation mode, and its built-in Arduino and micro:bit interface as a key differentiator — [ASEE "Tinkercad: not just for kids"](https://peer.asee.org/tinkercad-not-just-for-kids); [ASEE implementation techniques](https://peer.asee.org/implementation-techniques-for-tinkercad-s-circuit-simulator-in-introductory-electrical-and-computer-engineering-courses.pdf)
- **Tinkercad limits.** It has no ESP32 or Raspberry Pi boards, has limited sensors, and timing-sensitive simulations differ from hardware. This is a blog source, so lower authority — [zbotic](https://zbotic.in/tinkercad-arduino-simulation-teach-electronics-online-free/)
- Maker.io describes Wokwi as aimed at more advanced makers and not breadboard-based, unlike Tinkercad — [Maker.io 2022](https://www.digikey.com/es/maker/blogs/2022/arduino-simulators-for-hobbyists-makers-and-classroom-environments)
- **Israel.** The Ministry of Education's Arduino student handbook (Technion for the Ministry's pedagogical secretariat, dated 22/11/2020) covers the Tinkercad simulator alongside Arduino programming in Scratch (snippet-level) — [Arduino Student Handbook](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/Arduino%20-%20Student%20Handbook.pdf); [Arduino Scratch course plan](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/ArduinomicrocontrollerprogrammingScratch.pdf)
- **Remote embedded teaching (2022).** A paper compares four options for moving an embedded hardware programming course online during the pandemic. The PDF could not be extracted, so its conclusions were not read — [arXiv 2207.11603](https://arxiv.org/pdf/2207.11603)
- **Take-home kits as the alternative to simulators:**
  - A UMBC remote lab used an Arduino kit of about $40 with 30+ parts, using Discord for support — [ASEE](https://strategy.asee.org/using-arduino-kits-and-discord-to-implement-a-fully-remote-laboratory-course-during-the-covid-19-pandemic.pdf)
  - Another paper reports a "virtual environment" approach to embedded education — [ASEE 2025 "Transforming Embedded Systems Education"](https://peer.asee.org/transforming-embedded-systems-education-a-novel-approach-to-hands-on-learning-in-a-virtual-environment)

### Inferences
- A Pico curriculum should ship **a Wokwi link per lab** for pre-lab and home practice, and state clearly what the simulator cannot show (analog noise, PIO timing edge cases, real wiring faults), with the hardware step following.
- Because Wokwi's institutional tier is paid, free public Wokwi project links plus offline instructions are the zero-cost path. Tinkercad cannot simulate Pico, which matters because Israeli schools already know Tinkercad from the Arduino handbook.

### Gaps
- I found no controlled study comparing learning outcomes (simulator vs hardware) for RP2040 specifically. Proteus use in Israeli colleges is likely, given the PIC/8051 legacy, but I found no source confirming it.

## 4. Assessment: auto-grading, practical exams, LMS (Moodle), SCORM/LTI, privacy

### Takeaway
In Israel, **Moodle is the dominant LMS** in universities and in the Ministry of Education's own school environment. Content that exports to Moodle (quiz banks as GIFT/Moodle XML, SCORM/H5P packages, LTI) lowers adoption friction. Formal technician assessment is a lab exam plus a project defense before external examiners, not online quizzes.

### Cited Findings
- **Technion:** Moodle is the central LMS for teaching. A course site opens automatically for every course before the year starts, with identity from Technion's authentication system — [Technion promoteach](https://promoteach.technion.ac.il/en/moodleen/)
- **Bar-Ilan:** Moodle is one of the university's three core systems, and most teaching and learning runs through it — [BIU Moodle Department](https://learning-and-teaching.biu.ac.il/node/131)
- **Ministry of Education:** it operates a Moodle environment for schools, with training videos, and runs Moodle courses for grades 10-12 — [סביבת מודל במשרד החינוך](https://pop.education.gov.il/sherutey-tiksuv-bachinuch/moodle-environment/); [קורסים במודל לכיתות י-יב](https://pop.education.gov.il/sherutey-tiksuv-bachinuch/students-online-courses/courses-for-10-12-graders); [סביבה דיגיטלית מודל](https://pop.education.gov.il/sherutey-tiksuv-bachinuch/academya-bareshet/kol-hashidurim/sviva-digitalit-moodle/)
- **MEITAL (Israeli inter-university e-learning center)** conference proceedings (2023, 2024) include papers on combining Moodle with tools such as Teams — [MEITAL 2024 proceedings](https://meitalconf.iucc.ac.il/wp-content/uploads/2024/08/proceeding-2024_1.pdf); [MEITAL 2023](https://meitalconf23.iucc.ac.il/wp-content/uploads/2023/07/conf-book-2023.pdf)
- **Ministry electronics track.** The grade-13 exam structure (2026) lists a microcontroller specialization exam and a separate lab exam (code 711915). An August 2026 start-of-year circular covers booking external examiners for lab and project-defense exams. Both are snippet-level, since the PDF was not extractable — [mafmar_elec_2027.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/mafmar_elec_2027.pdf)
- **Channels.** The circular PDF links to WhatsApp groups and a Google Drive file, so teacher communication runs through informal channels rather than an LMS — [mafmar_elec_2027.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/mafmar_elec_2027.pdf)

### Inferences
- High-value features include:
  - Moodle-importable quiz banks (Moodle XML/GIFT) per lab
  - printable/PDF lab sheets
  - an optional SCORM or H5P package
  - "no-account" progress tracking stored locally in the browser, with export, to avoid collecting minors' data
  - teacher-side rubrics that match the lab-exam format (experiment plus microcontroller project plus oral defense)
- Wokwi's own pages did not mention LTI/LMS integration, so a resource offering it would add value.

### Gaps
- I found no source confirming which LMS individual מה"ט technological colleges use (e.g., Ort Braude, Ort Singalovski, Tel Aviv technological colleges). It is likely Moodle, but unverified.
- I found no evidence on auto-graded embedded code checks in Israel.

## 5. Teacher-side needs: guides, answer keys, timing, kit lists, cost, safety, reuse

### Takeaway
Instructors need **ready-to-run packages**: setup guides, answer keys, per-lab timing, per-station kit lists with costs, and hardware that survives many semesters. Published kit costs cluster around **$23-$40 per student**. Course-specific kits cause redundancy, and multi-course kits are a reported fix.

### Cited Findings
- **Fall 2020 embedded take-home kits.** Materials cost $22.99 per unit. The university paid for components, PCBs and shipping, and students bought dev boards at the bookstore. Students assembled the kits themselves, which the authors say raised engagement (snippet-level) — [ASEE paper 46481](https://nemo.asee.org/public/conferences/365/papers/46481/view)
- **Other kit costs:**
  - UMBC remote course: about $40 kit with 30+ components — [ASEE](https://strategy.asee.org/using-arduino-kits-and-discord-to-implement-a-fully-remote-laboratory-course-during-the-covid-19-pandemic.pdf)
  - Middle Tennessee State mechatronics: about $40 Amazon kit supplied by the department — [ASEE](https://peer.asee.org/introducing-arduino-to-mechatronics-engineering-students-via-lab-activities-and-a-hands-on-signature-thinking-course-project)
  - Penn State: $35 kit paid by lab fees and owned by students. Course-specific kits caused logistical problems and redundant purchases, so they built a condensed multi-course kit — [ASEE Penn State multi-course kit](https://peer.asee.org/developing-an-affordable-multi-course-electronics-kit-for-increased-software-and-mechatronic-literacy-in-mechanical-engineering)
- **Cornell:** labs must be affordable for 30-50 copies, compact to store, and easy to repair, and must be teachable within 2-3 weeks — [Lab Criteria](https://vanhunteradams.com/Pico/CourseMaterials/Lab_Criteria.html)
- **CMU** publishes a per-course "Course Kit Guide", an example of the kit-list documentation instructors expect — [CMU 16-223 kit](https://courses.ideate.cmu.edu/16-223/f2019/text/resources/kit.html)

### Inferences
- A Pico curriculum should publish:
  - a BOM per lab and per station, with ILS/USD prices and Israeli suppliers
  - a reuse plan (which parts are consumables)
  - spare ratios
  - safety notes (power supplies, Li-ion, mains-isolated only)
  - a teacher guide with answer keys kept behind a separate link or download
  - timing in 45-minute school periods ("שיעורים") as well as 3-hour college lab blocks

### Gaps
- I found no Israeli data on lab budgets or kit cost per student in מה"ט colleges.
- I found no specific safety-guideline documents for school electronics labs within the budget.

## 6. Israel specifics: מה"ט / Ministry of Education curricula, platforms, Hebrew materials

### Takeaway
Israel has two relevant systems:
1. **Ministry of Education** high-school electronics and computer engineering track (מגמת הנדסת אלקטרוניקה ומחשבים), which continues into grades 13-14 for technicians (טכנאים) and practical engineers (הנדסאים).
2. **מה"ט** (Government Institute for Technological Training, under the Ministry of Labor), which supervises הנדסאי certification at technological colleges.

Microcontroller curricula exist at several levels, and a **new "מיקרו בקרים" syllabus v2.01 is dated July 2026**. Older official syllabi emphasize assembly + C on 8051-type parts, and some exam materials reportedly name the Silicon Labs family. Arduino appears as an official Ministry handbook (2020, Technion-produced, with Tinkercad). I found no official Pico/RP2040 adoption.

### Cited Findings
- **New syllabus "מיקרו בקרים",** electronics and computer engineering track, electronic systems specialization (התמחות מערכות אלקטרוניות), version 2.01, July 2026. It is described as a direct continuation of "מבוא למערכות משובצות" and includes Embedded C and microcontroller hardware.
  - The file is 11 pages, Hebrew, created 2026-08-06 per metadata.
  - The content was not text-extracted, so the platform is unconfirmed.
  - Source: [micro_controler_2026.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/micro_controler_2026.pdf)
- **Companion syllabus:** introduction to embedded systems (מבוא למערכות משובצות) — [maar_mshubazot.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/maar_mshubazot.pdf)
- **Older (2007) technician syllabus "מיקרובקרים ושפה עילית":** 120 theory hours. Topics: single-chip microcontroller, assembly, C, interrupts, timers/counters, serial communication, hardware interfacing (search summary) — [mikrobakarim.pdf](https://meyda.education.gov.il/files/MadaTech/Megama_Technologit/elecomp/hitmahut_mihshuv_bakara/mikrobakarim.pdf); [11_9101.pdf (technicians)](https://meyda.education.gov.il/files/MadaTech/Megama_Technologit/elecomp/tehnaim/11_9101.pdf)
- **Grade-12 "מיקרובקרים ויישומיהם" (subject code 99.209),** in the computing and control systems option. It builds on grade 11 "מבוא למיקרו מחשבים ומיקרו מעבדים" and aims at microcontroller-controlled projects — [mikro_mahsh.pdf](https://meyda.education.gov.il/files/MadaTech/Megama_Technologit/elecomp/hitmahut_maar_mahsh/mikro_mahsh.pdf)
- **Control and robotics syllabi:** [bakara_robotika.pdf (2017 program)](https://meyda.education.gov.il/files/MadaTech/Megama_Technologit/elecomp/new_prog_03_2017/bakara_robotika.pdf); [marehetbakararobotika.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/marehetbakararobotika.pdf)
- **Ministry engineer-technician (הנדסאי) page.** The track has two specializations: electronic systems, and computing and control systems. Subjects include programming, VHDL, embedded systems built around microprocessors, and communications. A final project is the "entry ticket" to the job market, and graduates can continue to an engineering degree with credit. It lists technician and engineer-technician curricula (pre-reform and reform) but names no platform — [pop.education.gov.il engineer-technician](https://pop.education.gov.il/tchumey_daat/electronics-computer-engineering/high-school/pedagogy/engineer-technician/)
- **Platform.** The grade-13 microcontroller exam reportedly refers to microcontrollers of the "Silicon" family, likely Silicon Labs C8051. This is snippet-level and unconfirmed — [mafmar_elec_2027.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/mafmar_elec_2027.pdf)
- **Official Arduino materials in Hebrew:** a student handbook and a Scratch-based Arduino course plan, produced by the Technion for the Ministry (2020) — [Arduino Student Handbook](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/Arduino%20-%20Student%20Handbook.pdf); [Arduino Scratch plan](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/ArduinomicrocontrollerprogrammingScratch.pdf)
- **Applied engineering module on sensors, motors and control** (Technion module) — [modula5.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/AppliedEngineering/modula5.pdf)
- **מה"ט:** it is the supervising body for הנדסאי training and certification. Control/instrumentation specializations include sensors and transducers, control systems, PLCs and automation. The source is commercial (study.co.il), not official — [study.co.il הנדסאי מכשור ובקרה](https://www.study.co.il/%D7%94%D7%A0%D7%93%D7%A1%D7%90%D7%99-%D7%9E%D7%9B%D7%A9%D7%95%D7%A8-%D7%95%D7%91%D7%A7%D7%A8%D7%94/)
- **מה"ט curricula format.** מה"ט publishes curricula on gov.il, e.g. electric vehicle (מגמה 1069) and industrial design 2023, but I did not locate the electronics, control or mechatronics microcontroller syllabus there — [EV curriculum](https://www.gov.il/BlobFolder/guide/vehicle-engineering/he/mahat_curriculum_electric-vehicle-curriculum.pdf); [industrial design 2023](https://www.gov.il/BlobFolder/generalpage/megamaid-4610/he/mahat_megamot_ogdanim_2023_industrial-design-curriculum.pdf)
- **Reform news:** a news item on a new curriculum at the technological colleges (date not verified) — [Maariv](https://www.maariv.co.il/news/education/article-710527)
- **Teaching languages.** Ministry electronics resources also include Python and VHDL (file names in the circular) — [mafmar_elec_2027.pdf](https://meyda.education.gov.il/files/Pop/0files/Electronics-and-computer-engineering/mafmar_elec_2027.pdf)

### Inferences
- **Opening for Pico.** A July 2026 microcontroller syllabus that is generic ("Embedded C + microcontroller hardware") plus Python already present in the track suggests Pico (C-SDK and MicroPython) could map onto official topic lists. A **topic-to-syllabus mapping table** (Hebrew syllabus section to Pico lab) would be a strong adoption feature.
- Hebrew materials exist mainly for Arduino and older 8051 content. **Hebrew RP2040 lab material appears scarce** (no Hebrew Pico curriculum found), which is a gap a Hebrew/RTL resource could fill.
- **RTL needs:** Hebrew prose with LTR code blocks, register names and pin labels (bidi isolation); printable PDF in A4 RTL; Hebrew terms with English equivalents, since exams and datasheets mix both.

### Gaps
- **Not confirmed:**
  - the exact platform in the 2026 syllabus
  - the מה"ט syllabus for הנדסאי אלקטרוניקה, בקרה or מכטרוניקה microcontroller courses (not found online)
  - whether PIC or ARM (STM32) is used at specific colleges
- Recommended: open micro_controler_2026.pdf and mafmar_elec_2027.pdf manually, and contact מה"ט for the current מגמה syllabus.

## 7. Accessibility/legal: Israeli web accessibility rules relevant to educational sites

### Takeaway
Public-facing websites in Israel, including educational institutions', must meet **IS (ת"י) 5568 at level AA**. The standard is the Hebrew adoption of **WCAG 2.0**, and Part 2 covers digital documents (PDFs). Regulation 35 requires this and an accessibility statement is customary. Statutory damages without proof of harm make compliance a real adoption criterion for institutions.

### Cited Findings
- **Regulation 35 (accessibility of services) under the Equal Rights for Persons with Disabilities law** requires internet services to be accessible per the Israeli standard at level AA. The regulations took effect in 2013 (Open University presentation) — [Kol Zchut](https://www.kolzchut.org.il/he/הנגשת_אתרי_אינטרנט_ואפליקציות_לאנשים_עם_מוגבלות); [Open University slides](https://www.openu.ac.il/Lists/MediaServer_Documents/מייטלגרייבר.pdf)
- **IS 5568 is based on WCAG 2.0.** Part 1 covers websites and **Part 2 covers digital documents** (September 2023 edition) — [SII standard page](https://www.sii.org.il/he/lobby/standardization/standard-page?id=6753); [IS 5568-2 Sept 2023 on gov.il](https://www.gov.il/BlobFolder/legalinfo/israeli_accessibility_standards_pdf/he/sitedocs_si-5568-2-september-2023.pdf)
- **BOIA (2022) on the law:**
  - IS 5568 took effect in October 2017 and requires WCAG 2.0 AA, with a possible future move to 2.1
  - fines of up to 50,000 NIS
  - private suits without proof of damage
  - small businesses covered from October 2020
  - BOIA is a U.S. vendor blog
  - Source: [BOIA](https://www.boia.org/blog/israels-digital-accessibility-laws-an-overview)
- **Ministry of Education template.** It published a sample accessibility statement for schools, committing to WCAG 2.0 AA per regulation 35 — [hazarat_iazran_benose_negishut.pdf](https://meyda.education.gov.il/files/anan_chinuchi/meda_lspakim/tfasim/hazarat_iazran_benose_negishut.pdf)
- **Exemptions** exist for sites with few participants, heavy economic burden, or technical infeasibility — [Kol Zchut](https://www.kolzchut.org.il/he/הנגשת_אתרי_אינטרנט_ואפליקציות_לאנשים_עם_מוגבלות)

### Inferences
- An educational Pico site aimed at Israeli institutions should:
  - target WCAG 2.1/2.2 AA, which is a superset of IS 5568
  - publish a Hebrew accessibility statement (הצהרת נגישות)
  - make downloadable PDFs (lab sheets) tagged and accessible per IS 5568-2
  - provide alt text for circuit diagrams and text descriptions of wiring
  - support keyboard navigation for any simulator embeds
- Downloadable lab sheets are documents covered by Part 2, so tagged PDFs or accessible DOCX/HTML are preferable to scanned PDFs.

### Gaps
- I did not confirm whether IS 5568 has been formally updated to WCAG 2.1/2.2 as of 2026.
- I found no guidance specific to higher-education or technician-college sites beyond the general regulation.
