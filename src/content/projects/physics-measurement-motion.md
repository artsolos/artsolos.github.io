---
title: Measurement uncertainty and tracked motion
summary: Shared Physics 1 experiments combining cylinder measurements, repeated radiation counts, and video-tracked puck motion to examine uncertainty and extract motion from position data.
contribution: Followed the lab procedures and collected measurements together with my partner. Calculations and figures are presented as shared report evidence.
categories: [experimental-physics]
setting: team
role: Shared experimental procedure and data collection
context: Physics 1 Labs · Measurement; Motion in One and Two Dimensions
team: Two-person lab partnerships
period: Spring 2025
tools: [Geiger counter, Mass and dimension measurements, Video tracking, Hover puck, Glass air table, Spreadsheet analysis]
placement: coursework
order: 60
cover: ../../assets/projects/physics-measurement-motion/background-count-histogram.png
coverAlt: Original four-bin histogram of background radiation counts per sixty-second interval.
coverFit: contain
figures:
  - src: ../../assets/projects/physics-measurement-motion/background-count-histogram.png
    alt: Four-bin histogram of sixty-second background count readings, with most readings in the fifteen-to-twenty-one bin.
    caption: Measurement report, page 5. Original vector histogram rendered from the PDF without redrawing data. Four bins illustrate spread; they do not establish a normal-distribution fit or validate the report's FWHM estimate.
    group: Repeated measurements
  - src: ../../assets/projects/physics-measurement-motion/tracked-velocity-components.png
    alt: Original motion plot showing one approximately level velocity series and another decreasing series after launch, with fitted lines and incomplete axis labeling.
    caption: Motion report, page 4. Original component plot reproduced unchanged. The chart title says Vx, lacks a complete legend and axis units, and includes inconsistent scratch equations below it. It supports a qualitative comparison, not a verified numerical gravity estimate.
    group: Motion from position data
downloads:
  - label: Download measurement and uncertainty report (PDF)
    path: downloads/physics-1/lab-1-measurement.pdf
    note: 6 pages. Partner/TA lines and metadata removed. Original tables, chart-label issues, and uncertainty terminology retained.
  - label: Download tracked motion report (PDF)
    path: downloads/physics-1/lab-2-motion.pdf
    note: 6 pages. Privacy-reviewed copy; original graph labeling and missing final numerical comparison remain visible.
related: [physics-circular-rotation, physics-energy-momentum]
series:
  name: Physics 1 Labs
  part: Measurement and motion
openQuestions:
  - Course code was not supplied.
  - Measurement report reverses mass/volume axis labels and does not justify its density standard-error label or histogram uncertainty estimate.
  - Motion report has incomplete plot labels, inconsistent scratch equations, and no clearly stated final gravity value with uncertainty.
---

## Goal and my contribution

These partner experiments connect basic measurement practice with motion analysis. My partner and I followed the procedures and collected data together. The portfolio groups the reports around calibration, repeated readings, and uncertainty; their analysis is shared evidence rather than a claim of sole authorship.

## Dimensions, density, and counting statistics

The measurement lab recorded mass, length, and diameter for **four metal cylinders**. Volume and density were calculated from those readings, with propagated uncertainties recorded alongside the results. The tabulated densities are roughly **8.44–8.50 g/cm³**; they are calculated values, not direct density-instrument readings.

A second investigation used a Geiger counter for **sixty 60-second trials** of background counts. The report gives a mean of approximately **18.17 counts per interval** and plots the spread as a histogram. The mean summarizes the supplied observations; the histogram is not a theoretical prediction of the next count.

The density chart reverses its mass/volume labels relative to the plotted values, and the report's “standard error” terminology is not supported by a stated calculation. The four-bin histogram also cannot establish the claimed distribution fit by itself. Those precision claims are not featured as validated results.

## Tracking one- and two-dimensional motion

The motion experiment used a hover puck on a glass air table and video-tracking software. The procedure calibrated the table's four corners, adjusted color filtering, and recorded **10 seconds of stationary position data** before moving-puck trials. This provided a way to examine tracking noise before differentiating position into velocity.

Later runs followed a puck released along an incline and launched across it. Successive position differences supplied velocity components; selected velocity-time regions supplied fitted slopes. The original component plot shows contrasting trends after launch, consistent with the intended comparison of motion along and across the incline. Its incomplete labels and inconsistent scratch equations prevent a quantitative accuracy claim.

## Practical limits

Motion blur, table leveling, release variation, and numerical differentiation all affect the interpretation. The report discusses the incline model `a = g sin(θ)`, which is a theoretical relationship rather than a measured value of `g`. No clear final gravity result with uncertainty is supplied, so none is invented here. This update reviewed the original reports and figures; it did not repeat the experiments or refit source data.
