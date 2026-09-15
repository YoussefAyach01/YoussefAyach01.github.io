---
title: "The fun slot: termdle"
description: "A Wordle clone that runs entirely in the terminal — this sprint's deliberately unserious project, and the one classic edge case (duplicate letters) it had to get right anyway."
date: 2026-09-13
tags: ["CLI", "testing", "ship-sprint"]
---

Not every project in a skill-building sprint needs to be infrastructure. `termdle` is the sprint's explicit "for fun" slot — Wordle, entirely in the terminal, 5-letter word, 6 tries, colored feedback. The point of including a slot like this on purpose is that a portfolio built entirely of infra projects reads as joyless; one genuinely playful build is worth keeping.

## The one place "fun" still needed to be correct

Wordle's classic edge case: guess a letter twice when the answer only contains it once. Naive scoring double-credits the guess — marking both occurrences as "present" when only one letter actually exists to match against. Getting this right (crediting exactly as many occurrences as the answer actually contains) is a small algorithm with a surprisingly easy way to get subtly wrong, and it's covered by an explicit test rather than left to "looks right when I tried it."

## Testable by construction

`play()` takes injectable input/output streams instead of hard-coding `stdin`/`stdout`, specifically so the entire game loop — not just the scoring function — can run end to end against fake streams in a test, no real terminal required. That's a small design choice with an outsized payoff: a winning game and a full 6-guess loss (revealing the answer) are both covered by tests that actually drive the CLI, not just unit tests around scoring in isolation.

## What's still open

Full test suite green, including the scoring algorithm and the CLI loop end to end. No real dictionary validation of guesses (any 5 letters are accepted) and no persistent stats across runs — both left out on purpose, since the point of this slot was "something fun and genuinely small," not a production word game.

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [termdle](https://github.com/YoussefAyach01/termdle)._
