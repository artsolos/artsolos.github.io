---
title: Sonar distance measurement on an FPGA
summary: An ultrasonic rangefinder built from counters. The FPGA fires the HC-SR04, times the echo with its 50 MHz clock, converts the count to centimeters, and shows the distance on the seven-segment displays.
description: "FPGA sonar with an HC-SR04: 10 µs trigger generation, 50 MHz echo timing, cycles-to-centimeters conversion, and oscilloscope checks of trigger and echo."
contribution: Built the trigger, echo-timing, and conversion logic; derived the conversion constant; tested against a ruler and on the oscilloscope.
categories: [digital-design, sensing-actuation]
setting: coursework
role: Circuit design, timing math, testing, report
context: EECE 2160 Embedded Design, Northeastern University (Lab 4)
period: Fall 2025
sortDate: 2025-10-18
tools: [Quartus Prime, HC-SR04, ADALM2000 / Scopy, Breadboard]
status: complete
order: 5
cover: ../../assets/projects/sonar-distance-measurement/sonar-test-setup.jpg
coverAlt: DE1-SoC board wired on a breadboard to an HC-SR04 ultrasonic sensor that faces along a ruler, with the ADALM2000 attached.
figures:
  - src: ../../assets/projects/sonar-distance-measurement/sonar-schematic.png
    alt: Quartus schematic with trigger and echo counter blocks, a divider, and display outputs.
    caption: The sonar circuit. Trigger generator, echo counter, divide-by-2915, and the display module from Lab 3.
  - src: ../../assets/projects/sonar-distance-measurement/trigger-echo-capture.jpg
    alt: Scopy oscilloscope window showing a short trigger pulse and a longer echo pulse on two channels.
    caption: Trigger (orange) and echo (purple) in Scopy. The echo width grows with distance.
  - src: ../../assets/projects/sonar-distance-measurement/sonar-test-setup.jpg
    alt: Test setup with the sensor facing along a ruler.
    caption: Test setup with the sensor aimed along a ruler.
reports:
  - label: Lab 4 report (PDF)
    url: https://drive.google.com/file/d/1wETK9ZcaoFU2BfbT7recCfHOt0-Zvm3O/view
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [motor-control, fpga-digital-logic]
series:
  name: EECE 2160
  part: Lab 4
openQuestions:
  - The report's equipment list names a "DE1 (Cyclone II)" board, but the photos show a DE1-SoC. Confirm which board was used.
  - The results table matches theoretical values exactly (e.g. 116 µs at 2 cm). Confirm these were measured readings before quoting any accuracy figure.
---

## The problem

The HC-SR04 reports distance as time. Pulse its trigger pin for 10 µs, and it sends a 40 kHz burst, then holds its echo pin high for as long as the sound takes to come back. The job was to turn that pulse into a number in centimeters using only digital logic.

## My role

I designed the three parts of the circuit, worked out the conversion constant, wired the sensor, and verified the signals on the ADALM2000.

## Approach

1. **Trigger.** A counter produces a 10 µs high pulse at a fixed interval.
2. **Echo timing.** A second counter runs on the 50 MHz clock while echo is high, so the count is the round-trip time in 20 ns ticks.
3. **Conversion and display.** The count is divided by a constant and sent to the 8-bit display module from Lab 3.

## Design decision: one constant instead of runtime math

Rather than compute time and then distance, I folded everything into one divisor. Sound travels about 0.0343 cm/µs, so 1 cm out and back takes about 58.3 µs. At 20 ns per clock, that's 58.3 / 0.02 ≈ **2915 cycles per centimeter**. Dividing the echo count by 2915 gives centimeters directly, which kept the logic to one divider block.

## Result

The oscilloscope showed a steady 10 µs trigger and an echo whose width grew with distance. The displayed distances followed the ruler at the short ranges I tested. Readings were steady up close, with more variation farther out from reflection angles and sensor noise.
