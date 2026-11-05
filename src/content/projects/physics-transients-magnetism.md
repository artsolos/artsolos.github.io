---
title: RC transients and magnetic force
summary: Two instrument-based studies of circuit response and force balance, using timed voltage/current readings and repeated rider positions to examine exponential and linear models.
contribution: Followed both experimental procedures with my lab partner and collected the timed circuit readings and balance measurements together.
categories: [experimental-physics]
setting: team
role: Shared experimental procedure and data collection
context: Physics 2 Labs · Experiments 18 and 19
team: Two-person lab partnership
period: Fall 2025
tools: [Digital multimeter, Stopwatch, DC supply, Capacitors, Current balance, Excel]
placement: coursework
order: 52
cover: ../../assets/projects/physics-transients-magnetism/charging-fit.png
coverAlt: Measured resistor voltage during capacitor charging, with error bars and the original exponential fit.
figures:
  - src: ../../assets/projects/physics-transients-magnetism/charging-fit.png
    alt: Resistor voltage decaying from about six volts over 300 seconds during capacitor charging, with an exponential trendline.
    caption: Experiment 18, page 4. Original resistor-voltage readings during capacitor charging, not capacitor voltage. The fitted exponent gives a time constant near 143 s; the nominal RC model gives about 116 s.
    group: Timed transient measurements
  - src: ../../assets/projects/physics-transients-magnetism/current-displacement-fit.png
    alt: Average current in amperes versus rider displacement in metres, with measured points, error bars, and a fitted slope of 49.778 amperes per metre.
    caption: Experiment 19, page 5. The actual axes are current versus displacement. The report prose reverses these axes and quotes a different slope; its magnetic-field estimate is therefore not presented as verified. The nonzero intercept also matters.
    group: Force-balance measurements
downloads:
  - label: Download RC circuits report (PDF)
    path: downloads/physics-2/lab-4-experiment-18.pdf
    note: 13 pages. Partner/TA names and metadata removed. Original fit, tolerance, and summary inconsistencies are retained.
  - label: Download magnetic force report (PDF)
    path: downloads/physics-2/lab-5-experiment-19.pdf
    note: 9 pages. Privacy-reviewed copy. The field calculation and claims of zero-intercept proportionality need reconciliation.
related: [physics-fields-circuits, physics-oscillations-waves]
series:
  name: Physics 2 Labs
  part: Time response and force balance
openQuestions:
  - Course code was not supplied.
  - RC parallel-fit summary differs from the plotted exponent; discharge uses a different assumed resistance and tolerance calculations need checking.
  - Magnetic-force prose slope and field calculation disagree with the graph and listed constants; zero-field rider position is nonzero.
---

## Goal and my contribution

These two partner experiments examine how instruments capture changing electrical behavior and how an electrical current produces a mechanical balance response. We followed the procedures step by step and collected data together. Analysis and figures are attributed to the shared reports, without claiming that I alone designed or analyzed either setup.

## RC charging and discharge

The charging circuit used a measured **1054.1 Ω resistor**, a nominal **0.11 F capacitor**, and a supply set to **6.007 V**. The team recorded resistor voltage every **10 s over 300 s**, then compared the readings with an exponential trendline. Measuring across the resistor tracks the declining charging current; it is not a measurement of the capacitor's rising voltage.

The source's charging fit gives a time constant of approximately **143 s**. A logarithmic fit of discharge-current readings gives approximately **133 s**. Both are estimates derived from experimental readings. The nominal charging prediction, `RC ≈ 116 s`, is calculated from measured resistance and rated capacitance. Component tolerance and timing limitations are discussed in the report, but its uncertainty bounds have not been independently reproduced.

Adding a nominal **0.50 μF capacitor in series** gives a predicted time constant of about **0.00053 s** using the stated component values. The manual 10 s recording interval could not resolve this response. The near-flat sampled trace is a measurement limitation, not a measured sub-millisecond time constant. The parallel-configuration fit summary also conflicts with its plotted exponent, so it is not used as a precision result.

## Magnetic force and equilibrium

A current balance used a wire in a magnet gap and a sliding rider to restore equilibrium. The team recorded current and rider position on increasing and decreasing runs, then averaged the current readings. A second investigation varied magnet count at approximately **1.809 A**.

The original graph shows current increasing approximately linearly with rider displacement. Its axes are **current versus displacement**, despite the reversed description in the prose. The graph's slope, the text's alternative slope, and the stated constants do not reproduce the quoted magnetic-field value. That value is not featured here as a verified result.

## Practical limits and review scope

Switch timing and multimeter response limit transient capture. Balance-arm alignment, mechanical vibration, rider-position judgment, and magnet spacing limit force measurements. A nonzero rider position with zero magnets also prevents treating the readings as proof of a line through the origin.

These are documented lab observations and source fits, not new measurements made during the portfolio update. The public reports preserve the original technical record with private details removed; unresolved numerical claims remain clearly scoped.
