---
title: Python exercises and numerical methods
summary: Individual Computing Fundamentals work covering interactive programs, numerical series, reusable functions, scoring rules, prime generation, and randomized simulation. The source record distinguishes original screenshots from newly executed notebook checks.
description: Grouped Python Computing Fundamentals exercises with original Homework 1 screenshot evidence, runnable Homework 2 notebook exports, new verification results, and documented boundary limitations.
contribution: Implemented the individual homework exercises. The original notebook and screenshots are retained separately from the portfolio's later verification harness and results.
categories: [programming]
setting: homework
role: Individual Python implementation
context: Computing Fundamentals, Homework 1 and Homework 2 Questions 1–5
tools: [Python 3, Notebook, Standard-library random, Numerical series, Function arguments]
status: complete
placement: coursework
order: 40
cover: ../../assets/projects/python-exercises-numerical-methods/verification-diagram.svg
coverAlt: Labeled new verification results for Python functions, the prime sieve, and a seeded race batch, with a note that Homework 1's six referenced scripts are missing.
figures:
  - src: ../../assets/projects/python-exercises-numerical-methods/pi-series-original.png
    alt: Original Homework 1 code and console screenshot showing twenty partial sums of a pi approximation, ending near 3.091624 and no matching requested decimal prefixes.
    caption: Original submitted evidence, Homework 1 PDF page 2. The twenty-term run ends near 3.091624; the screenshot does not establish high-precision convergence. This program was not rerun because its .py file is absent.
    group: Original submission evidence · reviewed only
  - src: ../../assets/projects/python-exercises-numerical-methods/log-series-original.png
    alt: Original Maclaurin approximation code and console table comparing finite series sums for ln of one plus x with the math.log result.
    caption: Original submitted evidence, Homework 1 PDF page 3. A finite-series table compares approximations of ln(1+x) with a library value. The underlying .py source was not included.
    group: Original submission evidence · reviewed only
  - src: ../../assets/projects/python-exercises-numerical-methods/palindrome-original.png
    alt: Original palindrome checker code and sample console classifications of integers, including 12321 and 4444 as palindromes.
    caption: Original submitted screenshot, Homework 1 PDF page 1. This is historical console evidence, not a new execution during the portfolio update.
    group: Original submission evidence · reviewed only
  - src: ../../assets/projects/python-exercises-numerical-methods/verification-diagram.svg
    alt: New verification summary showing supplied GPA output 3.13, 2762 primes below 25000, a seed-zero fifty-race batch, and three reproduced boundary errors.
    caption: New portfolio verification on 2026-10-25, using Python 3.12.14. These results were produced during this update; the supplied notebook had no saved outputs. Scope and harness controls are in the downloadable verification record.
    group: New verification · original Python executed
downloads:
  - label: Download Homework 1 submitted screenshots (PDF)
    path: downloads/computing-fundamentals/homework-1-submitted-evidence.pdf
    note: Original technical pages with document metadata removed. Six .py files referenced by the project metadata are missing.
  - label: Download Homework 2 source and verification (ZIP)
    path: downloads/computing-fundamentals/homework-2-source-and-verification.zip
    note: Metadata-normalized notebook, unchanged complete code export, six runnable section exports, README, and separately labeled new verification results. Shared with the inventory case study.
  - label: Download submitted Homework 2 code printout (PDF)
    path: downloads/computing-fundamentals/homework-2-submitted-evidence.pdf
    note: Original submitted code printout, not the later verification output.
  - label: Download new verification results (JSON)
    path: downloads/computing-fundamentals/verification-results.json
related: [python-file-inventory, word-search-sorting, sudoku-backtracking]
series:
  name: Computing Fundamentals
  part: Grouped Python exercises
openQuestions:
  - Course code and academic term were not supplied; neither is inferred.
  - Homework 1's six .pyproj files reference absent .py files. Those programs have screenshot evidence only and were not reconstructed or executed.
---

## Goal and my contribution

These individual assignments build up Python control flow, functions, and numerical reasoning. I implemented the exercises; the portfolio groups the smaller tasks rather than presenting every homework question as a separate project. The file-backed inventory exercise has its own related case study because it adds a larger persistent-data workflow.

## Homework 1: Original screenshot evidence

The submitted PDF shows six exercises: a shopping-cart calculation, an integer palindrome checker, a number-guessing game, binary-to-decimal conversion, a π series, and a Maclaurin approximation of `ln(1+x)`.

The numerical screenshots make the limits of a finite series visible. The π example prints twenty partial sums and ends near 3.091624, without reaching the requested decimal prefixes. The logarithm example compares several term counts with a library value. These are original submitted examples, not newly reproduced results.

The archive contains Visual Studio `.pyproj` metadata for all six tasks, but none of the referenced `.py` files. I have kept the screenshots as reviewed evidence and have not reconstructed missing programs or claimed new runs of them.

## Homework 2: Functions, rules, and simulation

The executable notebook contains variable-argument aggregation, weighted GPA, a tortoise/hare simulation, a prime sieve, tennis scoring, and the inventory program. The smaller exercises share one entry:

- `sum_product` selects minimum/sum or maximum/product behavior and handles an empty argument list.
- `find_gpa` processes credit/grade pairs and rejects an odd number of arguments.
- `tennis_score` maps point counts to ordinary scores, deuce, advantage, and a game winner.
- `sieve_primes` marks composite integers; the race functions model random movement, slips, and finish conditions.

```python
# Excerpt from the submitted sieve_primes function
p = 2
while p * p < limit:
    if primes[p]:
        for i in range(p * 2, limit, p):
            primes[i] = False
    p += 1
```

## New verification, 2026-10-25

The unchanged notebook code ran under Python 3.12.14 in an isolated directory. All six separately exported question scripts also exited normally. The function examples and product records came from the submission; seed `0` and the inventory menu's exit answer were verification controls.

Across the notebook, fifteen selected functional checks passed, including the supplied GPA example returning **3.13** and all five supplied tennis examples. The prime sieve produced **2,762 primes below 25,000**, with largest prime 24,989, matching an independent trial-division check for that range. The seed-zero batch completed fifty races: 42 tortoise wins, eight hare wins, and no ties. This is one reproducible run, not a win-rate estimate.

These are later portfolio checks. The supplied notebook had no saved outputs or execution count, so they are not presented as original submission results.

## Known boundaries

Three additional checks reproduced exceptions in the original code: GPA input with zero total credits raises `ZeroDivisionError`; a sieve limit below two raises `IndexError`; and a race collision at equal positions beyond the finish, such as `(61, 61)`, raises `IndexError` in the display function. The source is preserved with those limitations. The passing examples do not imply every input or random seed is handled.
