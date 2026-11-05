---
title: The Forge of Hephaestus
summary: A team-built physical game for kids. Inserting a 3D-printed sword into a glowing forge starts a random light-and-button sequence that players have to repeat. It runs on Arduino and Processing.
description: "First-year engineering team project: an interactive sword-forging game built with Arduino, Processing, laser-cut and 3D-printed parts, presented at the Boston Children's Museum."
contribution: Helped lead the coding and game logic (Arduino and Processing), and built the project presentation website.
categories: [prototyping, embedded-software, cad]
setting: team
role: Co-led coding and game logic; built the project website
context: First-year engineering final project, Northeastern University
team: Four-person team
tools: [Arduino, Processing, SolidWorks, AutoCAD, Laser cutter, 3D printer]
status: complete
featured: 3
order: 3
cover: ../../assets/projects/forge-of-hephaestus/forge-complete.jpg
coverAlt: The finished forge, a black wooden box with three colored buttons on top, a red LED strip along the front, and a teal 3D-printed sword in its slot, with a laptop showing the game screen behind it.
figures:
  - src: ../../assets/projects/forge-of-hephaestus/arduino-flowchart.png
    alt: Flowchart. Start, wait for start signal, send random button sequence, check button presses; correct runs an LED color sequence, wrong flashes a red LED; both return to start.
    caption: Arduino logic. A wrong press flashes red and restarts; a full correct sequence runs the win animation.
    group: Game logic
  - src: ../../assets/projects/forge-of-hephaestus/processing-flowchart.png
    alt: Flowchart. Start, connect to Arduino via serial port, wait for button sequence, win or lose branch showing a win or lose effect, end.
    caption: Processing side. It receives the sequence over serial, draws it, and shows the result.
    group: Game logic
  - src: ../../assets/projects/forge-of-hephaestus/processing-sequence-screen.jpg
    alt: Laptop screen showing a Processing window titled "Repeat this pattern" with a row of white and green squares.
    caption: The screen players see. Each square maps to one of the physical buttons.
    group: Game logic
  - src: ../../assets/projects/forge-of-hephaestus/prototype-cardboard.jpg
    alt: Open cardboard box with a hole cut in the top, a red Arduino board and wiring beside it.
    caption: First prototype. A cardboard box with a slot for the sword, used to prove the activation worked.
    group: Iterations
  - src: ../../assets/projects/forge-of-hephaestus/prototype-taped-buttons.jpg
    alt: Cardboard box wrapped in silver tape with three colored buttons on top and an opening on the front.
    caption: Second prototype. More LEDs, a sturdier box, and the three-button sequence mechanic.
    group: Iterations
  - src: ../../assets/projects/forge-of-hephaestus/enclosure-lit-interior.jpg
    alt: Black-painted wooden enclosure lit red from inside.
    caption: Wooden enclosure painted black, with the LED strip lighting the inside.
    group: Iterations
  - src: ../../assets/projects/forge-of-hephaestus/arduino-button-wiring.jpg
    alt: Breadboard, red Arduino board, and jumper wires connected to three arcade-style buttons and an LED strip on a desk.
    caption: Button and LED wiring on the bench before it went into the enclosure.
    group: Hardware
  - src: ../../assets/projects/forge-of-hephaestus/wiring-bench-test.jpg
    alt: Hands testing buttons wired to a breadboard and Arduino on a green cutting mat.
    caption: Testing the button inputs.
    group: Hardware
  - src: ../../assets/projects/forge-of-hephaestus/printed-sword.jpg
    alt: Hand holding a teal 3D-printed sword.
    caption: The 3D-printed sword players insert to start a round.
    group: Hardware
  - src: ../../assets/projects/forge-of-hephaestus/sword-slot.jpg
    alt: Close-up of the teal sword inserted into a slot on the front of the black forge.
    caption: The sword slot on the front of the forge.
    group: Hardware
  - src: ../../assets/projects/forge-of-hephaestus/hammer-drawing.png
    alt: SolidWorks technical drawing of a small hammer with orthographic views, an isometric view, and a title block reading Team Hephaestus.
    caption: Technical drawing of the 3D-printed hammer the team gave out as a prize.
    group: Hardware
demos:
  - label: Project website (Google Sites)
    url: https://sites.google.com/view/forgeofhephaestus/home
    note: The team's presentation site, which I built. It has the full Arduino and Processing code.
sources:
  - label: Forge of Hephaestus project site
    url: https://sites.google.com/view/forgeofhephaestus/home
  - label: Original portfolio, Engineering page
    url: https://sites.google.com/view/arfinportfolio/engineering
related: [goldberg-machine, arduino-joystick-lcd, architectural-chess-set]
openQuestions:
  - Exact project date (term/year) isn't stated on either site.
  - Two gallery photos show museum visitors, including children. They are left out of this site; confirm you have permission before adding any.
  - Teammates are credited as a four-person team. Add names here if they agree.
---

## The problem

Our first-year engineering final project was to make something interactive and educational for kids. Our team built it around Hephaestus, the Greek god of fire and forges. The goal was a box that felt like a real forge, glowing and responsive, where "forging a sword" turned into a memory game with lights and buttons.

## My role

This was a four-person team. I helped lead the coding and the game logic: the Arduino program that runs the round and the Processing program that shows the sequence. I also built the website we used to present the project. The enclosure, fabrication, and CAD were shared across the team.

## Approach

**Two programs talking over serial.** The Arduino owns the physical side: three buttons and an RGB LED strip. The laptop runs a Processing sketch that draws the sequence. When a round starts, the Arduino picks five random buttons, sends them one per line over serial, and lights the strip red. Processing reads them and shows "Forge this sequence". The Arduino then watches the buttons:

- A correct press advances to the next step. After five, it sends `W` and runs a random-color win animation.
- A wrong press sends `L`, flashes red four times, and starts a new round.

**Debouncing.** Each button's reading has to stay stable for 50 ms before it counts, and a press only registers on the transition. Holding a button down can't score twice.

**Iterating the box.** We went from a cardboard box with a slot, to a taped box with more LEDs and the three buttons, to a laser-cut wooden enclosure painted black, to the final integrated version.

## Design decision: drop the motion sensor

We first tried a motion sensor to detect the sword automatically. Several sensors burned out, and the setup was unreliable. We switched to a manual start triggered by inserting the sword, and every round got a fresh random sequence. It started reliably every time, which mattered more for something kids would use than clever sensing.

## Result

The final version worked as a complete game: sword in, sequence on screen, buttons to repeat it, and light feedback for winning or losing. Our team presented this version at the Boston Children's Museum, where kids played it.

## Evidence

The flowcharts and screen capture below show the game logic. The build photos follow the prototypes from cardboard to the finished forge. The full Arduino and Processing code is on the project website.
