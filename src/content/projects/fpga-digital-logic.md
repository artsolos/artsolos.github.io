---
title: Digital logic foundations on the DE1-SoC
summary: The first three labs of the course, each building on the last. A hierarchical 4-bit adder with overflow detection, a minimized BCD-to-seven-segment decoder, and a pushbutton-driven circuit that stores and compares two 8-bit numbers.
description: "EECE 2160 Labs 1–3 on the DE1-SoC FPGA: hierarchical adders and overflow, Karnaugh-map minimized seven-segment decoding, and a register-based sequential comparator."
contribution: Designed, simulated, and hardware-tested each circuit in Quartus. Lab 1 was a two-person lab; Labs 2 and 3 were individual reports.
categories: [digital-design]
setting: coursework
role: Schematic design, simulation, board testing, reports
context: EECE 2160 Embedded Design, Northeastern University (Labs 1–3)
period: Fall 2025
sortDate: 2025-10-06
tools: [Quartus Prime Lite, Waveform Editor / ModelSim, DE1-SoC (Cyclone V), LPM IP cores]
status: complete
order: 7
cover: ../../assets/projects/fpga-digital-logic/display-decimal-42.jpg
coverAlt: DE1-SoC seven-segment displays showing the decimal number 42, with slide switches below.
figures:
  - src: ../../assets/projects/fpga-digital-logic/four-bit-adder-schematic.png
    alt: Quartus schematic of four chained full-adder symbols with an XOR gate on the last two carries.
    caption: Lab 1. A 4-bit adder built from full-adder symbols, which are built from half adders. The XOR of the last two carries flags signed overflow.
    group: Lab 1 · Adders and overflow
  - src: ../../assets/projects/fpga-digital-logic/adder-overflow-board.jpg
    alt: DE1-SoC with several red LEDs lit, including the overflow LED.
    caption: Overflow on the board. The fifth LED lights when the signed result doesn't fit in four bits.
    group: Lab 1 · Adders and overflow
  - src: ../../assets/projects/fpga-digital-logic/seven-segment-truth-table.png
    alt: Truth table mapping decimal digits 0 to 9 to four input bits and seven active-low segment outputs.
    caption: Lab 2. Active-low truth table for digits 0–9 (0 turns a segment on).
    group: Lab 2 · Seven-segment decoder
  - src: ../../assets/projects/fpga-digital-logic/kmap-segment-e.png
    alt: Karnaugh map for segment e with don't-care entries for invalid BCD codes.
    caption: Karnaugh map for segment e. Codes 10–15 are don't-cares, which simplifies it to e = i0 + i2·¬i1.
    group: Lab 2 · Seven-segment decoder
  - src: ../../assets/projects/fpga-digital-logic/bcd-decoder-schematic.png
    alt: Quartus schematic of the gate-level decoder with four inputs and seven outputs.
    caption: The minimized equations as a gate-level schematic.
    group: Lab 2 · Seven-segment decoder
  - src: ../../assets/projects/fpga-digital-logic/display-digit-5.jpg
    alt: DE1-SoC seven-segment display showing the digit 5.
    caption: SW[3:0] = 0101 shows 5 on HEX0.
    group: Lab 2 · Seven-segment decoder
  - src: ../../assets/projects/fpga-digital-logic/comparator-block-diagram.png
    alt: Block diagram with switch and key inputs feeding two enabled registers, display modules, and comparator outputs to LEDs.
    caption: Lab 3. The pre-lab block diagram, with two registers loaded from the same switches, decimal display modules, and a comparator.
    group: Lab 3 · Sequential comparator
  - src: ../../assets/projects/fpga-digital-logic/sequential-comparator-schematic.png
    alt: Quartus schematic connecting registers, display modules, and an LPM_COMPARE block.
    caption: The sequential comparator schematic.
    group: Lab 3 · Sequential comparator
  - src: ../../assets/projects/fpga-digital-logic/compare-0-vs-15.jpg
    alt: DE1-SoC displays showing 0 and 15 with an LED lit to indicate A is less than B.
    caption: A = 0 and B = 15 stored at different times. The LED shows A < B.
    group: Lab 3 · Sequential comparator
reports:
  - label: Lab 1 report (PDF)
    url: https://drive.google.com/file/d/1S9ouK6QOSHie5yTVorXS0lyp54w-u1Mj/view
  - label: Lab 2 report (PDF)
    url: https://drive.google.com/file/d/1MjX3sA0b9UvYP0XX02-WyCdDV_fAZHTL/view
  - label: Lab 3 report (PDF)
    url: https://drive.google.com/file/d/1yogR1yQcet2ZZS8IJQrZ4lIIXxqZJTdW/view
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [systemverilog-teaching-processor, sonar-distance-measurement, motor-control]
series:
  name: EECE 2160
  part: Labs 1–3
---

## Why these three are together

These labs are a staircase. Lab 1's adder is built from blocks I made first. Lab 2's decoder becomes a reusable module. Lab 3 reuses that module to display stored values. Showing them as one project is more honest than counting them as three separate accomplishments.

## Lab 1: Binary adders and the FPGA workflow

This was a two-person lab, and it was my introduction to Quartus. We built a half adder, used two of them as a symbol inside a full adder, then chained four full adders into a 4-bit adder. Each design was checked in waveform simulation, then pinned to the board's switches and LEDs. A fifth LED reports **signed overflow**: the XOR of the carries into and out of the top bit, which is set when two numbers of the same sign produce a result of the other sign.

## Lab 2: BCD to seven-segment decoder

The board's displays are active-low, so a 0 turns a segment on. I wrote the truth table for digits 0–9, treated the unused codes 10–15 as don't-cares, and minimized each segment with a Karnaugh map. Segment e, for example, reduces to `e = i0 + i2·¬i1`. I built the equations from gates, simulated all ten digits, then added an enable input that blanks the display. That enable is what made the module reusable later.

## Lab 3: Pushbutton-controlled sequential computation

The board has only one set of switches, so comparing two numbers means entering them at different times. Two 8-bit registers hold A and B. SW9 picks which register to load, and KEY0 stores the current switch value into it. Each register drives its own decimal display, built from LPM divide blocks that split a value into hundreds, tens, and ones, then feed the Lab 2 decoder. An `LPM_COMPARE` block lights one LED for A < B and another for A > B.

## Design decision and what I learned

The main lesson across the three labs was **hierarchy**. Every new design was easier because the previous one was a tested, labeled block. The one rough edge was switch bounce in Lab 3, where very fast presses occasionally skipped a store. The next step would be a debounce circuit or a synchronized input.

## Result

The adder, decoder, and comparator worked in simulation and on the board for every case I tested: decimal output across 0–255, correct digits 0–9 with the enable, and correct comparisons from the stored values.

## From schematics to SystemVerilog

My later EECE 2323 work moves from these gate-level Quartus designs to a SystemVerilog processor datapath in Vivado on a PYNQ board. It is a separate course and implementation, covered in the teaching-processor case study under Related projects. Its seven labs build one processor rather than repeat this project's DE1-SoC exercises.
