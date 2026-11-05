---
title: Goldberg machine
summary: A team chain-reaction machine built from office supplies. It took four attempts to get every step to fire in sequence, ending with an Arduino, a limit switch, and two motors.
description: Team Goldberg machine with a tennis ball, a swinging mouse, a scissor gate, a zig-zag ball track, and an Arduino limit switch that starts two motors. Documented through three failed attempts and a working fourth.
contribution: Team member, credited as "Action Architect" on the team site. My detailed personal contribution is being confirmed before I describe it here.
categories: [prototyping]
setting: team
role: Team member (details pending confirmation)
context: Team engineering design project
team: Four-person team
period: December 2024
sortDate: 2024-12-04
tools: [Arduino (SparkFun Inventor's Kit), Motor driver, Limit switch, Cardboard and wood fabrication]
status: complete
order: 9
cover: ../../assets/projects/goldberg-machine/machine-final.png
coverAlt: Cardboard Goldberg machine on a classroom table, with ramps and a tennis ball at the top and a laptop beside it.
figures:
  - src: ../../assets/projects/goldberg-machine/layout-drawing.png
    alt: D-size layout drawing showing a tennis ball, ramp, office mouse on a string, cup with weight, office scissors, small steel ball, zig-zag ramps, a funnel, a box with a switch, and a curved track to wheels.
    caption: The team's D-size layout drawing, dated 12/04/2024, showing the planned sequence from tennis ball to the final rolling ball.
videos:
  - src: media/goldberg-machine/effort-1.mp4
    poster: media/goldberg-machine/effort-1-poster.jpg
    width: 640
    height: 360
    title: Attempt 1
    caption: Attempt 1. The tennis ball was too heavy for the slingshot to push it down the ramp.
  - src: media/goldberg-machine/effort-2.mp4
    poster: media/goldberg-machine/effort-2-poster.jpg
    width: 640
    height: 360
    title: Attempt 2
    caption: Attempt 2. An unstable balance point caused an unplanned step.
  - src: media/goldberg-machine/effort-3.mp4
    poster: media/goldberg-machine/effort-3-poster.jpg
    width: 640
    height: 360
    title: Attempt 3
    caption: Attempt 3. Same imbalance, same result.
  - src: media/goldberg-machine/effort-4.mp4
    poster: media/goldberg-machine/effort-4-poster.jpg
    width: 640
    height: 360
    title: Attempt 4
    caption: Attempt 4. Every step of the machine worked in sequence.
demos:
  - label: Team project website (Google Sites)
    url: https://sites.google.com/view/24goldbergmachine/home
sources:
  - label: Goldberg machine project site
    url: https://sites.google.com/view/24goldbergmachine/home
  - label: Original portfolio, Engineering page
    url: https://sites.google.com/view/arfinportfolio/engineering
related: [forge-of-hephaestus, arduino-joystick-lcd]
openQuestions:
  - What was your exact contribution (mechanism design, Arduino code, build, documentation)? The role stays general until you confirm.
  - Course name for this project.
---

## The problem

A Goldberg machine does something simple in a deliberately complicated way. The challenge is reliability. Every step has to hand off cleanly to the next, so one weak link stops the whole chain. Our team's machine also had to pass its motion on to the next team's machine.

## My role

This was a four-person team project. I'm credited on the team site, and I'm confirming exactly which parts I owned before writing about them in detail. The description below covers the team's work.

## The sequence

1. A ball is pushed onto a ramp and knocks a computer mouse off a ledge.
2. The mouse swings back through the box it sat on and out through a small hole.
3. That pulls a cup tied by string to a pair of scissors. As the cup drops, the scissors open like a gate.
4. A small steel ball rolls through a zig-zag track and lands on a popsicle stick over a limit switch.
5. The switch tells an Arduino to start two motors, which send a rubber-band ball down a ramp to the next team.

## Iteration

The team site records four filmed attempts, and the failures are the useful part:

- **Attempt 1:** the tennis ball was too heavy for the slingshot to move it.
- **Attempts 2 and 3:** an unstable balance point triggered an unplanned step.
- **Attempt 4:** every step worked in order.

The team's write-up credits a mix of levers and pulleys for finally giving the chain enough stability and control.

## The electronic step

The last stage uses a SparkFun Inventor's Kit motor example, modified so the limit switch toggles both motors. It only acts on the switch's press transition (with a short debounce delay), so the steel ball landing turns the motors on once instead of flickering them.

## Result

On the fourth attempt the whole chain ran, from the first ball to the motors handing off to the next team.
