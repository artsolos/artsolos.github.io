---
title: Flip, a linked-list card game
summary: A C++ team assignment that starts with card and deck classes, then builds a scoring game by moving nodes between a shuffled deck and a 24-card hand.
description: EECE 2560 Flip Parts A/B, with linked-list deck ownership, deep-copy operations, node transfer, a source-derived diagram, and reviewed source downloads.
contribution: Shared implementation and testing with a four-person team, from the deck model through the Flip game.
categories: [algorithms]
setting: team
role: Collaborative C++ implementation and testing
context: EECE 2560 Fundamentals of Engineering Algorithms, Northeastern University (Project 2, Parts A/B)
team: Four-person team
tools: [C++, Singly linked lists, Standard Library vectors, Random number facilities, Dynamic memory]
status: complete
placement: coursework
order: 31
cover: ../../assets/projects/linked-list-flip/source-diagram.svg
coverAlt: Source-derived diagram showing a 52-node deck, deal and replace operations, transfer of 24 nodes into a hand, and score updates as cards are flipped.
figures:
  - src: ../../assets/projects/linked-list-flip/source-diagram.svg
    alt: Diagram of deck node ownership, card transfers, and the Flip scoring loop.
    caption: Structural illustration based on Deck.cpp and Flip.cpp. The counts are initialization constants in the source, not measured runtime results.
downloads:
  - label: Download Flip source and review notes (ZIP)
    path: downloads/eece2560/flip-source.zip
    note: Both submission stages, with original source credits and a README. C++ reviewed only; randomized gameplay and memory behavior were not exercised here.
related: [mastermind-feedback, sudoku-backtracking, word-search-sorting]
series:
  name: EECE 2560
  part: Project 2 · Parts A/B
openQuestions:
  - Academic term/date is not confirmed; no date is displayed.
---

## Goal and our contribution

The goal was to turn a card/deck model into a small interactive game while managing dynamically allocated list nodes. My four-person team worked together on the implementation and testing. Parts A and B are stages of the same project, so they share one case study.

## Part A: Model and shuffle a deck

`Card` stores a value and suit and formats face-card names for output. `Deck` builds a 52-card singly linked list. Its copy constructor and assignment operator allocate a separate node chain; its destructor clears the chain.

To shuffle, the implementation copies card values into a vector, applies `std::shuffle` using a Mersenne Twister seeded from `random_device`, then writes the values back into the existing nodes. This combines list-based ownership with the Standard Library's sequence shuffle.

## Part B: Transfer nodes into the hand

The game creates an empty hand deck and transfers 24 nodes using `deal()` and `replace()`. `deal()` detaches the front node; `replace()` appends the supplied node to a deck. The transferred node has one owner at a time.

```cpp
// Excerpt from Deck::deal, Part B (after its empty-deck check)
Node* temp = front;
front = front->next;
temp->next = NULL;
return temp;
```

The player can flip a card or end the game. The source assigns points to aces and face cards, halves the score for a seven, resets it for lower cards, and adds a bonus for hearts. A flipped node is deleted after scoring. Diagnostic output prints the shuffled deck, hand, and remainder.

## Validation status

**Source reviewed; C++ not compiled or executed during this portfolio update.** The source shows the list operations, copy behavior, shuffle path, and scoring rules. It does not provide saved gameplay results, memory-check output, or a shuffle-quality test.

Our collaborative testing is user-confirmed. Copy independence, empty-deck handling, score transitions, and input termination were not independently exercised here. The diagram explains the source structure; it is not a capture of a tested game session.
