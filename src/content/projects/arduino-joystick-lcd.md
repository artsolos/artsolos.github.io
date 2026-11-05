---
title: Arduino joystick and LCD interface
summary: An Arduino reads an analog joystick and shows its direction on a 16×2 LCD. A limit switch turns on an LED and updates the second line of the display.
description: Arduino build that reads joystick X/Y on analog inputs, classifies direction with thresholds, prints it on a 16x2 LCD, and reports a limit switch with an LED.
contribution: Wired the circuit, wrote the Arduino program, and tuned the joystick thresholds and LCD contrast.
categories: [prototyping, embedded-software]
setting: individual
role: Wiring, programming, testing
context: Hands-on Arduino build documented on my original portfolio
tools: [Arduino, Analog joystick, 16x2 LCD (LiquidCrystal), Limit switch]
status: complete
order: 8
cover: ../../assets/projects/arduino-joystick-lcd/joystick-lcd-setup.jpg
coverAlt: SparkFun Arduino board and breadboard wired to a joystick module and a 16x2 LCD, with a hand on the joystick.
figures:
  - src: ../../assets/projects/arduino-joystick-lcd/joystick-lcd-direction.jpg
    alt: Close-up of the LCD showing a direction reading, with a hand holding the joystick.
    caption: The LCD updating as the joystick moves.
    group: The build
  - src: ../../assets/projects/arduino-joystick-lcd/joystick-wiring.png
    alt: Wiring diagram of an Arduino Uno connected to a joystick module.
    caption: Joystick wiring. The X and Y axes go to analog inputs A0 and A1.
    group: Wiring
  - src: ../../assets/projects/arduino-joystick-lcd/lcd-wiring.png
    alt: Wiring diagram of an Arduino Uno connected to a 16x2 LCD and a potentiometer.
    caption: 16×2 LCD wiring in 4-bit mode.
    group: Wiring
  - src: ../../assets/projects/arduino-joystick-lcd/limit-switch-wiring.png
    alt: Wiring diagram of a limit switch connected to an Arduino Uno.
    caption: Limit switch on pin 7 with the internal pull-up.
    group: Wiring
videos:
  - src: media/arduino-joystick-lcd/joystick-lcd-demo.mp4
    poster: media/arduino-joystick-lcd/joystick-lcd-demo-poster.jpg
    width: 720
    height: 1230
    title: Joystick and LCD demonstration
    caption: Short demo of the joystick direction and limit switch readout (8 seconds, with sound).
sources:
  - label: Original portfolio, Engineering page
    url: https://sites.google.com/view/arfinportfolio/engineering
related: [forge-of-hephaestus, goldberg-machine]
openQuestions:
  - Was this a class assignment or a personal project? It's labeled "Individual build" until confirmed.
---

## The problem

I wanted more hands-on practice with sensor inputs and outputs: read a physical control, interpret it, and give clear feedback on a display. Adding a second, different input (a limit switch) made the program handle more than one thing at once.

## Approach

**Direction from two analog axes.** The joystick gives X and Y on `A0` and `A1` as values from 0 to 1023, with the center near the middle. Below 400 or above 600 on an axis counts as a push in that direction. The two axes combine, so diagonals read as "Up/Left" and so on.

**LCD output.** The LiquidCrystal library drives the 16×2 display in 4-bit mode. The first row shows the direction. The second row shows `Limit: Yes` or `Limit: No`.

**Limit switch.** The switch uses the Arduino's internal pull-up, so pressed reads `LOW`. When pressed, the built-in LED turns on, the LCD updates, and a message goes to the serial monitor.

## Design decision: a dead zone around center

My first thresholds were too tight. Tiny movements near center made the direction flicker. Moving to a 400–600 band gave the joystick a dead zone where it reads as no direction. I also tuned the LCD contrast and added a 500 ms pause between updates so the text is easy to read. That pause makes the display update about twice a second; it's for readability, not responsiveness.

## Result

The display followed the joystick reliably in all four directions and the diagonals, and the limit switch toggled the LED and the second row as expected. The video below shows it running.
