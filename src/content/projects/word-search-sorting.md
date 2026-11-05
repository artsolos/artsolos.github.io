---
title: Word search with selectable sorting
summary: A two-part C++ team assignment that sorts a dictionary, scans a wrapping letter grid in eight directions, and uses binary search to identify candidate words. Part B adds quicksort and heapsort alongside selection sort.
description: EECE 2560 Word Search Parts A/B with dictionary sorting, a max-heap implementation, binary lookup, source/input downloads, and an explicit review of a grid-format mismatch.
contribution: Shared implementation and testing with a four-person team across dictionary, grid-search, and sorting work.
categories: [algorithms]
setting: team
role: Collaborative C++ implementation and testing
context: EECE 2560 Fundamentals of Engineering Algorithms, Northeastern University (Project 3, Parts A/B)
team: Four-person team
tools: [C++, File I/O, Standard Library vectors and sets, Binary search, Selection sort, Quicksort, Heapsort]
status: complete
placement: coursework
order: 32
cover: ../../assets/projects/word-search-sorting/source-diagram.svg
coverAlt: Supplied 15-by-15 word-search input beside a pipeline for dictionary sorting, eight-direction scanning, and binary lookup, with a note about the loader's dimension mismatch.
figures:
  - src: ../../assets/projects/word-search-sorting/source-diagram.svg
    alt: Letter grid reproduced from input15.txt, with the reviewed sorting and lookup pipeline and loader limitation.
    caption: The supplied input15.txt visualized alongside the source's algorithm. This is input data and a structural explanation, not output from a successful C++ word-search run.
downloads:
  - label: Download Word Search source, inputs, and review notes (ZIP)
    path: downloads/eece2560/word-search-source.zip
    note: Original Parts A/B, dictionary and 15×15/30×30 inputs. README flags the dimension-reading mismatch. No benchmark or passing match result is claimed.
related: [sudoku-backtracking, mastermind-feedback, linked-list-flip]
series:
  name: EECE 2560
  part: Project 3 · Parts A/B
openQuestions:
  - The source grid reader consumes one dimension but supplied grids contain two. No corrected original submission was provided.
  - A comment says quicksort was fastest, but there is no accompanying timing log. No speed comparison is asserted.
  - Academic term/date was not established; no date is displayed.
---

## Goal and our contribution

The assignment combines dictionary sorting with word lookup in a letter grid. I collaborated with a four-person team on implementation and testing across both parts. The archive provides source and inputs, rather than a report or saved output log.

## Part A: Sort before searching

The dictionary class reads words into a vector, sorts them with selection sort, and provides binary search. The grid accessor wraps row and column indices around the board edges. The search visits each starting cell, follows eight directions, and builds candidates from length five up to the grid size.

A set suppresses repeated words in the intended `foundwords.txt` output, which records each word's starting position and dictionary index. These are implemented output fields, not verified matches from this update.

## Part B: Exchange the sorting strategy

Part B retains the search pipeline and adds a menu selecting selection sort, quicksort, or heapsort. Quicksort partitions around the last element. Heapsort uses a vector-backed max-heap with parent/child indexing, heap construction, and heap restoration after removing a maximum.

```cpp
// Excerpt from search(int type), Part B
if (type == 1)
    d.selectionSort();
else if (type == 2)
    d.quickSort();
else if (type == 3)
    d.heapSort();
```

Keeping dictionary ordering separate from grid scanning makes the three methods easy to compare in a future controlled run. No timing result is claimed: a source comment describes quicksort as fastest, but the ZIP contains no benchmark record.

## Validation status and a format mismatch

**Source reviewed; C++ not compiled or executed during this portfolio update.** Separate input checks confirmed the supplied files contain 15×15 and 30×30 letter grids after their two-number headers. Those checks validate input shape, not the submitted search code.

The review found an integration problem: the files start with `15 15` or `30 30`, but `grid::readFile` reads only one dimension before reading characters. The second dimension would therefore be read as letters and shift the grid contents. The original source is preserved in the download and the README flags this mismatch. A corrected loader and an executable comparison against expected matches are needed before claiming successful search results.
