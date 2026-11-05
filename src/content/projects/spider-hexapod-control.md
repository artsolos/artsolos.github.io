---
title: Spider hexapod control in C++
summary: I extended a provided C++ control program for a six-legged robot so it could step backward and turn left and right, and I reworked its start-up so the legs stopped jittering and over-extending.
description: "Extending a class-based C++ control stack for the Spider hexapod on a DE10-Nano running Linux: backward stepping, left and right turns, and a smoother start-up."
contribution: Added MoveBackward, LeftTurn, and RightTurn methods, new menu commands, and a revised Init/Standup routine. The robot and its original control stack were provided by the course.
categories: [embedded-software, robotics, sensing-actuation]
setting: coursework
role: Extended the provided control code; tested on the robot; wrote the report
context: EECE 2160 Embedded Design, Northeastern University (Lab 9)
period: Fall 2025
sortDate: 2025-12-07
tools: [C++, Embedded Linux, DE10-Nano SoC, g++ / make, MobaXterm (SSH)]
status: complete
featured: 1
order: 1
diagrams: [hexapod-stack, tripod-gait]
reports:
  - label: Lab 9 report (PDF)
    url: https://drive.google.com/file/d/1nydiOFOrtnyBaTocqAMOntHF7VJQ3c-B/view
    note: Includes the commented source for every method I added.
sources:
  - label: Original portfolio, Computer Systems page
    url: https://sites.google.com/view/arfinportfolio/computer-systems
related: [arm-fpga-servo-control, cpp-memory-mapped-io, motor-control]
series:
  name: EECE 2160
  part: Lab 9
openQuestions:
  - The report's result tables (step distance, turn angle, jitter counts) sit beside placeholder text ("This figure would show…"). Confirm whether these were measured before quoting any numbers.
  - No photo or video of the robot is available. Supply one if you have it.
---

## The problem

The Spider is a hexapod robot with a Terasic DE10-Nano board on its back running Linux. The course provided a working C++ program stack that could stand the robot up and take one forward step. It couldn't walk backward or turn. Its start-up was also rough: legs jittered and sometimes swung toward their mechanical limits, so the robot had to be held off the table while it initialized.

The lab asked for three things: a graceful start-up with no hyperextension, a leg test, and one-step commands for forward, backward, left, and right.

## My role

I didn't design the robot or write the original control stack. My work was reading that code closely enough to change it safely, then adding the new motions and fixing the start-up. I compiled and tested everything on the board itself and wrote up the results.

## How the code is organized

The program is layered. `Main.cpp` reads a one-character command and calls into a `Spider` object. `Spider` coordinates six `SpiderLeg` objects, each turning a desired motion into hip, knee, and ankle targets. `ServoMotor` applies those targets with scaling, clamping, and timing. At the bottom, `MMap` reaches the hardware through the SoC's memory map.

Forward walking uses a tripod gait. Three legs (right front, left middle, right back) lift, swing, and lower while the other three hold the body up. Then the two groups swap.

## Approach

**Backward step.** I reused the forward step's structure and flipped the sign of the hip stride, so the lifted tripod swings back while the supporting tripod pushes forward. I kept track of which tripod moved last, so alternating forward and backward commands still pick the right legs.

**Turning.** A turn is the same lift-swing-lower pattern with opposite stride directions on each side. For a left turn the right-side legs stride forward and the left-side legs stride backward, which gives a net rotation. The tricky part is that each tripod contains legs from both sides. Tripod 1 has right front and right back but left middle, so each leg's sign has to come from its side, not its tripod. The diagram below shows the mapping.

**Menu.** I added `b`, `l`, and `r` commands next to the existing forward command, plus `s` to stop.

## Design decision: a slower, symmetric start-up

The original start-up moved legs one at a time and dropped them into position in large jumps. That's where the jitter and over-extension came from. I changed `Init()` to set the same joint on all six legs before moving to the next joint. I rewrote `Standup()` to raise the knees first, set the hips symmetrically, then lower the knees in 2° steps with a 20 ms pause between them.

The trade-off is time: start-up got a little longer. I accepted that in exchange for a stand-up that no longer drives servos toward their limits.

## Result

The robot accepted forward, backward, left, and right commands and carried out each one as a single step. Left and right turns came out roughly symmetric, which was my check that the per-side signs were right. The revised start-up was visibly smoother; in my trials it no longer pushed any leg toward a mechanical limit, and the jitter was much reduced.

The report includes tables of step distances, turn angles, and start-up counts. I haven't repeated those numbers here while I confirm how they were measured.

## What I'd do next

Each command is one discrete step. The next step would be continuous gaits, variable stride length, and some sensor feedback to correct for slipping.
