---
title: A file-backed inventory manager in Python
summary: A menu-driven Python exercise that stores products in a text file and supports quantity updates, stock queries, sorting, and valuation. New verification checks use the notebook's demo data and clearly identified test inputs.
description: Individual Computing Fundamentals inventory exercise using text-file persistence, dictionaries and lists, with executed Python verification, source downloads, and documented format limitations.
contribution: Implemented the individual inventory exercise, including file parsing, menu operations, queries, and saving edited records.
categories: [programming]
setting: homework
role: Individual Python implementation
context: Computing Fundamentals, Homework 2 Question 6
tools: [Python 3, Standard-library os, Text-file I/O, Dictionaries and lists]
status: complete
placement: coursework
order: 41
cover: ../../assets/projects/python-file-inventory/verification-diagram.svg
coverAlt: Labeled new verification of the inventory program, loading four supplied demo records, calculating their value, updating a test record, and preserving five sorted records through a file round trip.
figures:
  - src: ../../assets/projects/python-file-inventory/verification-diagram.svg
    alt: Diagram of load, query, append, update, sort, save, and reload operations with new verification values.
    caption: New portfolio verification on 2026-10-25. The four demo products come from the submitted notebook; the added record and input responses are verification fixtures. Values describe this sample dataset, not current product prices.
downloads:
  - label: Download Homework 2 source and verification (ZIP)
    path: downloads/computing-fundamentals/homework-2-source-and-verification.zip
    note: Shared original notebook code and six section exports, including exercises/inventory.py. README separates original source, test controls, verification results, and limitations.
  - label: Download new verification results (JSON)
    path: downloads/computing-fundamentals/verification-results.json
  - label: Download submitted Homework 2 code printout (PDF)
    path: downloads/computing-fundamentals/homework-2-submitted-evidence.pdf
    note: Submitted code printout; no saved verification output was included in the original notebook.
related: [python-exercises-numerical-methods, linked-list-flip, mastermind-feedback]
series:
  name: Computing Fundamentals
  part: Homework 2 · File processing
openQuestions:
  - Course code and academic term are unconfirmed and omitted.
---

## Goal and my contribution

This individual exercise makes a small inventory application persist between runs. I implemented the menu, record loading and saving, quantity edits, and queries. It is kept separate from the smaller Python exercises while sharing the same original notebook and source bundle.

## From text records to operations

Each line stores a product identifier, name, price, and quantity. `load_products` parses the file into dictionaries; `save_products` serializes an edited list. The menu supports adding products, updating a quantity, totaling stock value, finding the highest price or lowest quantity, filtering low stock, and sorting records by price.

The submitted code creates a four-product demo file when `data.txt` does not exist, so the program is runnable without an additional supplied data file. It uses Python's standard library and needs no external package.

```python
# Excerpt from the submitted save_products function
with open("data.txt", "w") as f:
    for p in stuff:
        f.write(f"{p['upc']}: {p['name']}, ${p['price']:.2f}, {p['qty']}\n")
```

## New verification, 2026-10-25

The unchanged complete notebook and the standalone inventory export both ran under Python 3.12.14. The exit option was supplied by the verification harness. Separate checks exercised the original functions against isolated copies of the demo file, leaving the submissions untouched.

The four supplied demo records loaded and their value totaled **$8,762.29**. Maximum-price, minimum-quantity, and a stock threshold query returned the expected demo product. A verification-only record was appended, loaded back, and updated from quantity four to seven. Sorting and saving retained all five records in ascending price order after reload. A deliberately malformed test line was skipped while valid records were retained.

These are new checks on the exercise's sample data. The submitted notebook had no recorded outputs, and no result is being claimed for a real inventory or production deployment.

## Limits of the format

The parser uses simple colon/comma separators and broad exception handlers. Quoted delimiters inside product names, stricter numeric validation, and concurrent editing were not established. This is a coursework file-processing application; the download preserves its original behavior and documents the verification scope.
