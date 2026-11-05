---
title: DC, servo, and stepper motor control in FPGA logic
summary: Three motor drivers built from counters, comparators, and a state machine on the DE1-SoC. Each one uses a different control method, and I checked every one against its waveform.
description: "FPGA motor control on the DE1-SoC: PWM speed and direction for a brushed DC motor through an H-bridge and level shifter, a clamped 50 Hz servo driver, and a four-state stepper FSM."
contribution: Designed and tested all three control circuits in Quartus, wired the level shifter and H-bridge, and verified timing with the ADALM2000.
categories: [digital-design, sensing-actuation]
setting: coursework
role: Circuit design, wiring, waveform verification, report
context: EECE 2160 Embedded Design, Northeastern University (Lab 5)
period: Fall 2025
sortDate: 2025-11-14
tools: [Quartus Prime, DE1-SoC, H-bridge driver, 3.3 V–5 V level shifter, ADALM2000 / Scopy]
status: complete
order: 4
cover: ../../assets/projects/motor-control/servo-pulse-48deg.png
coverAlt: Oscilloscope capture of a single servo PWM pulse with a cursor reading 1.089 ms.
figures:
  - src: ../../assets/projects/motor-control/dc-motor-pwm-schematic.png
    alt: Quartus schematic with a counter, comparator, and output pins feeding a motor driver.
    caption: Brushed DC motor PWM circuit. A counter sets the 5 kHz period, and a comparator sets the duty cycle.
    group: Brushed DC motor
  - src: ../../assets/projects/motor-control/pwm-5khz-50pct.jpg
    alt: Scopy capture of a square wave with equal high and low times.
    caption: 5 kHz PWM at 50% duty cycle.
    group: Brushed DC motor
  - src: ../../assets/projects/motor-control/pwm-30pct.jpg
    alt: Scopy capture of a square wave with short high pulses.
    caption: Low duty cycle, low speed (about 30%).
    group: Brushed DC motor
  - src: ../../assets/projects/motor-control/pwm-80pct.jpg
    alt: Scopy capture of a square wave with long high pulses.
    caption: High duty cycle, high speed (about 80%).
    group: Brushed DC motor
  - src: ../../assets/projects/motor-control/servo-pwm-schematic.png
    alt: Quartus schematic with switch inputs, a clamp block, a multiplier, a comparator, and seven-segment outputs.
    caption: RC servo circuit with the 0–180 clamp and the angle shown on the seven-segment displays.
    group: RC servo
  - src: ../../assets/projects/motor-control/servo-pulse-48deg.png
    alt: Oscilloscope capture of a narrow pulse with a cursor at 1.089 ms.
    caption: About 1.09 ms high time, roughly 48°.
    group: RC servo
  - src: ../../assets/projects/motor-control/servo-pulse-180deg.png
    alt: Oscilloscope capture of a wider pulse with a cursor at 2.430 ms.
    caption: About 2.43 ms high time at the 180° end of the range.
    group: RC servo
  - src: ../../assets/projects/motor-control/stepper-fsm-schematic.png
    alt: Quartus schematic with two clock dividers, a multiplexer, a state machine block, and coil outputs.
    caption: Stepper circuit. Two clock dividers (10 Hz and 1 Hz), a speed multiplexer, and the coil-sequence state machine.
    group: Stepper motor
  - src: ../../assets/projects/motor-control/stepper-coil-sequence.png
    alt: Logic analyzer view with four channels showing overlapping square waves offset in sequence.
    caption: Logic analyzer view of the four coil outputs. Two coils are on at each step.
    group: Stepper motor
reports:
  - label: Lab 5 report (PDF)
    url: https://drive.google.com/file/d/14O0hg5aGzogVj1v17dWL3C8ai6oLsD1C/view
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [arm-fpga-servo-control, sonar-distance-measurement, spider-hexapod-control]
series:
  name: EECE 2160
  part: Lab 5
openQuestions:
  - The report names the driver an "L298D"; the common part is the L298N. Confirm the part number.
---

## The problem

Brushed DC motors, RC servos, and steppers all need precise timing, but each wants something different. A DC motor's speed follows its average power. A servo's position follows the width of a pulse repeated every 20 ms. A stepper needs its coils energized in a fixed order. The lab was to drive all three from digital logic on the DE1-SoC's 50 MHz clock.

## My role

I designed each circuit in Quartus, did the timing math, wired the external parts, and checked the outputs on the ADALM2000 in oscilloscope and logic-analyzer modes.

## Approach

**Brushed DC motor.** A counter divides the clock into a 5 kHz PWM period (10,000 cycles). A comparator sets the high time, so duty cycle = switch value × 100 cycles. Seven switches give 0–100%. A level shifter raises the 3.3 V FPGA output to the 5 V the H-bridge expects. A direction switch drives a multiplexer that swaps the two H-bridge inputs, which reverses the motor without touching the speed logic.

**RC servo.** The period is 1,000,000 cycles (20 ms). From the 0.6–2.4 ms pulse range I derived the mapping `pulse = 30,000 + 500·θ` cycles.

**Stepper.** A four-state Moore machine steps through the coil pattern A/B → B/A′ → A′/B′ → B′/A. A direction input reverses the next-state logic, and a second switch picks a 10 Hz or 1 Hz step clock.

## Design decision: clamp the servo input in hardware

Eight switches can encode 0–255, but the servo only travels 0–180°. Anything larger would ask for a pulse past its limit. I added a clamp block ahead of the multiplier, so every input above 180 becomes 180. The seven-segment display shows the clamped value, so what you see is what the servo receives.

## Result

All three motors behaved as designed. The DC motor's speed tracked the duty cycle in both directions. The servo pulse widths on the scope matched the mapping: about 1.09 ms near 48° and about 2.43 ms at 180°. The logic analyzer showed the stepper coils firing in order, two at a time, and reversing on command.
