---
title: Mastermind feedback and game loop
summary: A two-part C++ team assignment that separates code matching from an interactive Mastermind game. The matching logic counts exact and misplaced digits without reusing a match.
description: EECE 2560 Mastermind coursework, grouping Parts A and B into one case study with reviewed C++ source, a labeled algorithm illustration, and source downloads.
contribution: Shared implementation and testing with a four-person team across both parts of the assignment.
categories: [algorithms]
setting: team
role: Collaborative C++ implementation and testing
context: EECE 2560 Fundamentals of Engineering Algorithms, Northeastern University (Project 1, Parts A/B)
team: Four-person team
tools: [C++, Standard Library vectors, Stream input/output, Operator overloading]
status: complete
placement: coursework
order: 30
cover: ../../assets/projects/mastermind-feedback/source-diagram.svg
coverAlt: Worked illustration of Mastermind feedback, marking exact positions first and matching unused digits second, with an example response of two exact and two misplaced digits.
figures:
  - src: ../../assets/projects/mastermind-feedback/source-diagram.svg
    alt: Illustrated secret and guess showing why exact matches must be excluded before counting misplaced digits.
    caption: Portfolio illustration drawn from code.cpp. The example values explain the algorithm; this is not a screenshot or result from executing the submitted C++.
downloads:
  - label: Download Mastermind source and review notes (ZIP)
    path: downloads/eece2560/mastermind-source.zip
    note: Parts A/B, original team credits, and a README with build commands and review limitations. C++ reviewed only during this update.
related: [linked-list-flip, word-search-sorting, sudoku-backtracking]
series:
  name: EECE 2560
  part: Project 1 · Parts A/B
openQuestions:
  - Academic term/date was not established by the supplied source. No period is displayed.
---

## Goal and our contribution

The assignment builds a Mastermind game in two stages. Part A models a secret code and compares guesses; Part B adds responses, input handling, and a turn-limited game. I worked with a four-person team on implementation and testing across both parts. We worked together, rather than dividing the portfolio description into unsupported individual file ownership.

## Part A: Match each digit once

The `code` class stores its digits in a vector, together with the permitted length and digit range. `setCode` checks the guess shape and range. `checkCorrect` counts equal values at equal positions.

The important detail is in `checkIncorrect`: it first marks exact matches in two Boolean vectors, then searches only unused secret and guess positions. That prevents repeated digits from inflating the misplaced count.

```cpp
// Excerpt from code::checkIncorrect, Part A/B
vector<bool> usedInSecret(n, false);
vector<bool> usedInGuess(n, false);

for (int i = 0; i < n; i++)
{
    if (nums[i] == guess.nums[i])
    {
        usedInSecret[i] = true;
        usedInGuess[i] = true;
    }
}
```

## Part B: Separate feedback from the game

A `response` object stores the exact/misplaced counts and provides formatted output and equality comparison. The `mastermind` class handles guesses, creates a response, and checks whether all positions are correct. The game loop allows up to ten valid guesses and checks positive settings and digit ranges. It prints the secret as part of the submission's debugging workflow.

## Validation status

**Source reviewed; C++ not compiled or executed during this portfolio update.** The source establishes the matching strategy and game structure. Our shared testing is user-confirmed, but the archive includes no saved test log from which to claim a passing test count or gameplay result.

The illustration is a worked explanation, not runtime evidence. Duplicate-heavy guesses, mismatched code sizes, and end-of-input behavior remain useful targets for a future executable test suite. The download retains both submissions and their original credits, with the review status stated in its README.
