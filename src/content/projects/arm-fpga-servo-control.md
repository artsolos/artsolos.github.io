---
title: ARM-to-FPGA servo control
summary: A C++ program on the DE1-SoC's ARM processor writes an angle into a memory-mapped register, and FPGA logic turns that value into the PWM signal that positions an RC servo.
description: "Hardware–software co-design on the DE1-SoC: Platform Designer, a PIO register on the lightweight AXI bridge, a C++ /dev/mem driver, and FPGA-generated servo PWM checked on an oscilloscope."
contribution: Documented the hardware-to-software path and servo tests in Lab 8. The report uses “we”; the individual task split is awaiting confirmation.
categories: [embedded-software, digital-design, sensing-actuation]
setting: coursework
role: Lab participant and report author; task split awaiting confirmation
context: EECE 2160 Embedded Design, Northeastern University (Lab 8)
period: Fall 2025
sortDate: 2025-12-04
tools: [C++, Quartus Prime, Platform Designer, Verilog, DE1-SoC, Lightweight HPS-to-FPGA bridge, Oscilloscope]
status: complete
featured: 2
order: 2
cover: ../../assets/projects/arm-fpga-servo-control/servo-180deg.jpg
coverAlt: DE1-SoC board with an RC servo mounted beside it; the seven-segment display reads 180 and the servo horn is turned to its far position.
diagrams: [hps-fpga-path]
figures:
  - src: ../../assets/projects/arm-fpga-servo-control/servo-0deg.jpg
    alt: DE1-SoC with the seven-segment display reading 0 and the servo horn at its starting position.
    caption: Commanded 0°. The board's display shows the value the program wrote.
    group: Servo responding to commanded angles
  - src: ../../assets/projects/arm-fpga-servo-control/servo-30deg.jpg
    alt: DE1-SoC with the display reading 30 and the servo horn rotated slightly.
    caption: Commanded 30°.
    group: Servo responding to commanded angles
  - src: ../../assets/projects/arm-fpga-servo-control/servo-80deg.jpg
    alt: DE1-SoC with the display reading 80 and the servo horn rotated further.
    caption: Commanded 80°.
    group: Servo responding to commanded angles
  - src: ../../assets/projects/arm-fpga-servo-control/servo-180deg.jpg
    alt: DE1-SoC with the display reading 180 and the servo horn at the far end of its travel.
    caption: Commanded 180°, the end of the range.
    group: Servo responding to commanded angles
  - src: ../../assets/projects/arm-fpga-servo-control/pwm-lowest-angle.png
    alt: Oscilloscope capture of a single narrow PWM high pulse on a dark grid.
    caption: PWM at the lowest commanded angle. Short high time.
    group: PWM output on the oscilloscope
  - src: ../../assets/projects/arm-fpga-servo-control/pwm-midpoint-angle.png
    alt: Oscilloscope capture of a wider PWM high pulse.
    caption: PWM at the midpoint angle. The high time grows with the commanded angle.
    group: PWM output on the oscilloscope
  - src: ../../assets/projects/arm-fpga-servo-control/pwm-highest-angle.png
    alt: Oscilloscope capture of the widest PWM high pulse of the three.
    caption: PWM at the highest angle tested.
    group: PWM output on the oscilloscope
reports:
  - label: Lab 8 report (PDF)
    url: https://drive.google.com/file/d/1u53dg5oLu4Ba3o6fJL53yss9AW12zfN9/view
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [cpp-memory-mapped-io, motor-control, spider-hexapod-control]
series:
  name: EECE 2160
  part: Lab 8
openQuestions:
  - The report text says angles 0°, 45°, 90°, and 135° were measured, but the photos show 0, 30, 80, and 180, and the referenced "Table 1" of pulse widths isn't in the PDF. Which set is right?
  - The report is written as "we". Was this a partner lab? If so, who did what?
---

## The problem

Earlier labs drove a servo entirely from FPGA logic, with the angle set by switches. This lab moved the decision into software. A program on the board's ARM processor (the HPS) chooses the angle, and the FPGA still generates the precise timing. Making that work means building a path from a C++ variable to a hardware register the FPGA can see.

## My role

My report documents the hardware system, C++ program, and tests from keyboard input to servo motion. It uses “we”; I am confirming the task split before claiming individual ownership of each step.

## Approach

**Hardware side.** The Platform Designer system connects the HPS, the lightweight HPS-to-FPGA AXI bridge, and an Avalon-MM PIO output. Assigning the PIO a base address and regenerating the system connects it to the FPGA top level. The PIO's output feeds the PWM logic that drives the servo. The generated `hps_0.h` supplies the address map.

**Software side.** The C++ program opens `/dev/mem` and uses `mmap()` to map the bridge's physical window (base `0xFF200000`) into its own address space. It then points at the PIO register at offset `0x20`. From there, setting the servo is one line: write the angle through a `volatile` pointer.

```cpp
servo_addr = (uint32_t *)((char *)virtual_base + OUT_BASE);
// ...
*servo_addr = (uint32_t)input_angle;
```

## Design decision: validate before writing to hardware

The program writes an angle into a register that moves a motor, so it validates input first. Non-numeric input is rejected and the stream is cleared. Values outside 0–180 are refused with a message. `-1` exits and unmaps the process's view of the bridge; unmapping does not reset the hardware register or stop the PWM.

## Result

The servo moved to each commanded angle and held it. On the oscilloscope the PWM period stayed steady while the high time grew with the angle, which is what an RC servo expects. That confirmed the whole chain worked, from software through the bridge and PIO to the FPGA's PWM output.

## Why it matters to me

This lab is where the earlier pieces connected. Lab 6 taught me register access from C++. Lab 5 taught me servo PWM in logic. Here the two met. The Spider robot code in Lab 9 rests on the same kind of memory-mapped access.
