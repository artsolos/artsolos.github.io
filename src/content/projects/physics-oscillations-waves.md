---
title: Oscillations and standing waves
summary: Partner experiments using an air-track oscillator, a driven string, and an air column to connect measured motion and resonance positions with fitted physical models.
contribution: Followed the experimental procedures and collected measurements together with my lab partner. Analysis is presented as shared report evidence.
categories: [experimental-physics]
setting: team
role: Shared experimental procedure and data collection
context: Physics 2 Labs · Experiments 13 and 14
team: Two-person lab partnership
period: Fall 2025
tools: [PASCO motion sensor, Capstone, Excel, Air track, 120 Hz vibrator, Function generator]
placement: coursework
order: 50
cover: ../../assets/projects/physics-oscillations-waves/sound-speed-fit.png
coverAlt: Original wavelength versus inverse-frequency plot with three measured points and a fitted slope of 341.19 metres per second.
figures:
  - src: ../../assets/projects/physics-oscillations-waves/air-track-setup.png
    alt: Air track with glider, springs, and motion sensor.
    caption: Experiment 13, page 3. Apparatus photograph reproduced in the report; photographer and apparatus design are not claimed as my work.
    group: Setup and measured motion
  - src: ../../assets/projects/physics-oscillations-waves/peak-time-fit.png
    alt: Six measured peak times against peak number, with fitted slope 1.4043 seconds per cycle.
    caption: Experiment 13, page 4. The slope of peak time versus peak number gives the reported baseline period of approximately 1.404 s. Original report fit, not a new experiment or refit.
    group: Setup and measured motion
  - src: ../../assets/projects/physics-oscillations-waves/air-column-diagram.png
    alt: Report diagram illustrating successive quarter-wave resonant lengths in an air column.
    caption: Experiment 14, page 6. Conceptual resonance diagram reproduced from the report, not a photograph of the team's apparatus or a measured waveform.
    group: Resonance and analysis
  - src: ../../assets/projects/physics-oscillations-waves/sound-speed-fit.png
    alt: Measured wavelengths at three inverse frequencies and the original linear fit with slope 341.19 metres per second.
    caption: Experiment 14, page 9. Wavelengths derived from measured resonance positions; the original fitted slope estimates sound speed. The report quotes 341 ± 12 m/s, but the supplied material does not include a regression workbook to reproduce that uncertainty.
    group: Resonance and analysis
downloads:
  - label: Download oscillations report (PDF)
    path: downloads/physics-2/lab-1-experiment-13.pdf
    note: 9 pages. Partner/TA names and metadata removed; original technical content, including unresolved calculation issues, retained.
  - label: Download standing waves report (PDF)
    path: downloads/physics-2/lab-6-experiment-14.pdf
    note: 11 pages. Privacy-reviewed copy. The string-density units and fit equation need reconciliation; see the evidence limits below.
related: [physics-fields-circuits, physics-transients-magnetism]
series:
  name: Physics 2 Labs
  part: Oscillation and resonance
openQuestions:
  - Course code was not supplied.
  - Oscillation report has unfinished damping placeholders and a two-magnet mass inconsistent with its baseline mass.
  - Standing-wave string graph and prose disagree about slope units and intercept; regression workbooks are absent.
---

## Goal and my contribution

These two experiments explore periodic motion at different scales: a glider oscillating between springs, and standing waves on a string and in an air column. My partner and I followed the procedures step by step and collected data together. The calculations and plots below are evidence from our reports; I do not claim sole analysis or original apparatus design.

## Air-track motion and damping

The setup used a **138.1 g glider**, two springs, and a PASCO motion sensor sampled at **20 Hz** in Capstone. The procedure included leveling the track, checking equilibrium, and adjusting sensor alignment when the readings jumped. Position data were centered around the measured equilibrium before identifying successive peaks.

The report's peak-time fit gives a baseline period of approximately **1.404 s**. Frequency, angular frequency, and the spring estimate were then calculated from this measured period and mass; they are derived quantities rather than separate instrument readings.

Adding ring magnets produced visibly decaying oscillations. The report compares peak envelopes with exponential fits. Its two-magnet mass entry is inconsistent with the baseline mass, and its abstract contains unfinished damping placeholders. I therefore retain the qualitative damping observation without presenting the damping table as a validated quantitative trend.

## String and air-column resonance

A **120 Hz vibrator** drove a fishing line while hanging washers varied tension. Node spacings supplied wavelengths; frequency and wavelength supplied wave speed. The report plots tension against squared speed to estimate linear mass density. Its graph and prose use inconsistent slope units and intercepts, so the numerical density agreement is not featured here.

For the air column, the team located successive sound maxima at **400, 800, and 1104 Hz** and repeated position readings. Calculating wavelength from the difference between the first two resonance positions reduces sensitivity to a fixed end-position offset. The original wavelength-versus-inverse-frequency fit has slope **341.19 m/s**: an experimental estimate from position measurements. The report compares this with a **343 m/s room-temperature model value**, rather than a second measurement of the room's sound speed.

## Measurement limits

Sensor alignment, the vibrator's contact with the string, ambiguous resonance maxima, and manual position readings all affect the observations. The report quotes an uncertainty of ±12 m/s for sound speed; this is retained as a reported estimate, not independently established by this update. No new laboratory measurements or raw-data refits were performed. The downloadable reports preserve the technical record and its unresolved inconsistencies.
