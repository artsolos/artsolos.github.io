---
title: C++ and memory-mapped I/O on embedded Linux
summary: C++ programs on the DE1-SoC's ARM processor that read switches and drive LEDs by reading and writing FPGA registers directly, plus a push-button counter with edge detection.
description: "Memory-mapped I/O from C++ on the DE1-SoC's Linux HPS: bit masking and shifting for switches and LEDs, and a push-button counter that increments, decrements, shifts, and resets."
contribution: Wrote the switch, LED, and push-button functions and the counter program, then compiled and tested them on the board over SSH.
categories: [embedded-software]
setting: coursework
role: Program design, testing on hardware, report
context: EECE 2160 Embedded Design, Northeastern University (Lab 6)
period: Fall 2025
sortDate: 2025-11-22
tools: [C++, ARM Cortex-A9 HPS, Embedded Linux, g++, SSH, /dev/mem]
status: complete
order: 6
cover: ../../assets/projects/cpp-memory-mapped-io/leds-all-switches.jpg
coverAlt: Close-up of the DE1-SoC with all ten red LEDs lit above the slide switches.
figures:
  - src: ../../assets/projects/cpp-memory-mapped-io/terminal-1023.png
    alt: Terminal output showing a switch read, an LED write, and "Combined switch value = 1023".
    caption: The program reading all ten switches as one value (1023 with every switch on) and writing it to the LEDs.
  - src: ../../assets/projects/cpp-memory-mapped-io/leds-value-7.jpg
    alt: DE1-SoC with the three rightmost LEDs lit.
    caption: Switches 0–2 on, so the LEDs show binary 7.
  - src: ../../assets/projects/cpp-memory-mapped-io/counter-shift-test.jpg
    alt: Finger pressing a push button on the DE1-SoC with a pattern of LEDs lit.
    caption: Push-button counter. Each button increments, decrements, or shifts the 10-bit value.
reports:
  - label: Lab 6 report (PDF)
    url: https://drive.google.com/file/d/1wyEn00o7qLdfn8WjpwfGqueS0PK5h6-z/view
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [arm-fpga-servo-control, spider-hexapod-control]
series:
  name: EECE 2160
  part: Lab 6
---

## The problem

Up to this point the board's switches and LEDs were wired to FPGA logic. Here software running on the ARM processor under Linux had to control them. The registers are mapped into the processor's address space through the lightweight HPS-to-FPGA bridge, so controlling hardware means reading and writing the right bits at the right addresses.

## My role

I wrote the C++ functions and test programs, compiled them on the board over SSH, and confirmed each behavior on the LEDs and in the terminal.

## Approach

- **One switch, one LED.** Read the switch register and extract one bit with `(allSwitches >> n) & 0x1`. Set or clear a single LED bit without disturbing the others.
- **All switches at once.** Mask the register with `0x3FF` to get a 10-bit value, then write it straight to the LED register.
- **Push-button counter.** KEY0 increments, KEY1 decrements, KEY2 shifts right, KEY3 shifts left, and pressing more than one button resets the count to the switch value. The LEDs always show the current count, and shifts stay inside 10 bits.

## Design decision: act on button changes, not button state

If the program acted whenever a button read as pressed, one press would count many times while the loop ran. I stored the previous button state and only acted on the transition into "pressed". That made one press equal one step, without a hardware debounce circuit.

## Result

Every tested switch combination showed the matching pattern on the LEDs (7, 168, and 1023 among them). The counter responded once per press for all four operations. This register-level approach became the software half of the Lab 8 servo controller.
