---
title: Sudoku constraints and backtracking
summary: A C++ team assignment that grows from a Sudoku board model into a recursive solver. Row, column, and box presence tables guide legal moves, while a fewest-candidates heuristic chooses a blank cell to try next.
description: EECE 2560 Sudoku Parts A/B, with constraint tracking, recursive backtracking, MRV-style cell selection, supplied puzzle inputs, and reviewed source downloads.
contribution: Shared implementation and testing with a four-person team, covering the board representation and recursive solving work.
categories: [algorithms]
setting: team
role: Collaborative C++ implementation and testing
context: EECE 2560 Fundamentals of Engineering Algorithms, Northeastern University (Project 4, Parts A/B)
team: Four-person team
tools: [C++, Matrix support header, File I/O, Constraint tracking, Recursion and backtracking]
status: complete
placement: coursework
order: 33
cover: ../../assets/projects/sudoku-backtracking/source-diagram.svg
coverAlt: Supplied unsolved sudoku1.txt grid alongside the source's choose, try, recurse, and backtrack steps. No solved output is shown.
figures:
  - src: ../../assets/projects/sudoku-backtracking/source-diagram.svg
    alt: Nine-by-nine Sudoku givens from sudoku1.txt and a diagram of the candidate-selection and backtracking process.
    caption: Input visualization from sudoku1.txt with an explanation drawn from board.cpp. This is the supplied puzzle, not an independently verified solved board.
downloads:
  - label: Download Sudoku source, puzzles, and review notes (ZIP)
    path: downloads/eece2560/sudoku-source.zip
    note: Original Parts A/B and supplied puzzle files, plus review notes. C++ reviewed only; no solve-rate, recursive-call, or timing benchmark is asserted.
related: [word-search-sorting, linked-list-flip, mastermind-feedback]
series:
  name: EECE 2560
  part: Project 4 · Parts A/B
openQuestions:
  - No saved solver output or recursion statistics were supplied. Runtime results remain unverified in this portfolio update.
  - Input/EOF handling and validation of conflicting givens need executable tests; solveRecursive's base case checks for no blanks, not isSolved.
  - Academic term/date was not established; no date is displayed.
---

## Goal and our contribution

The project builds a Sudoku representation before adding automated search. My four-person team collaborated on implementation and testing across the A/B submissions. The portfolio groups those stages and distinguishes the implementation from results that have not been independently reproduced.

## Part A: Represent the constraints

The board stores a 9×9 puzzle using the supplied matrix support interface. Boolean presence tables track digits in each row, column, and 3×3 square. Part A provides initialization, cell access, editing, a board display, and a solved-state check. Its edits rebuild the presence tables from the board.

## Part B: Try, recurse, and undo

Part B updates those presence tables as trial values are placed or removed. `findBlank` counts legal values for blank cells and prefers a constrained one, returning early when it finds a cell with one candidate. The recursive step tries legal values and undoes a choice if that branch fails.

```cpp
// Excerpt from board::solveRecursive, Part B
setCell(row, col, val);

if (solveRecursive())
    return true;

// Backtrack
clearCell(row, col);
```

The implementation also counts recursive calls, and the main program is set up to print per-board and aggregate counts. That instrumentation is present in the code; no count or speedup is claimed without a recorded run.

## Validation status

**Source reviewed; C++ not compiled or executed during this portfolio update.** An independent input-format check confirmed that the illustrated `sudoku1.txt` fixture contains 81 cell symbols. It was not solved as part of that check. The diagram shows only its givens.

Our shared testing is user-confirmed, but no saved solved boards or test statistics were included. Runtime checks should verify that solutions preserve the givens and satisfy every row, column, and box. Conflicting inputs and file termination also need attention: `solveRecursive` returns success when there are no blank cells, without calling the separate `isSolved` validator. The source/input download preserves that behavior and documents the limitation.
