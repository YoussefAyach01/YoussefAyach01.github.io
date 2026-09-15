---
title: "The fun slot: termdle"
description: "A Wordle clone that runs entirely in the terminal — this sprint's unserious project, and the one classic edge case (duplicate letters) it still had to get right."
date: 2026-09-13
tags: ["CLI", "testing", "ship-sprint"]
---

Not every project in a skill-building sprint has to be infrastructure. `termdle` is the "for fun" slot — Wordle, in the terminal, 5-letter word, 6 tries, colored feedback. A portfolio that's ten shades of infra reads a little joyless; one genuinely playful build earns its place.

## The one place "fun" still needed to be correct

Wordle's classic edge case: guess a letter twice when the answer only contains it once. Naive scoring double-credits the guess — marking both occurrences as "present" when only one letter actually exists to match against. Getting this right (crediting exactly as many occurrences as the answer actually contains) is a small algorithm with a surprisingly easy way to get subtly wrong, and it's covered by an explicit test rather than left to "looks right when I tried it."

## Testable by construction

`play()` takes injectable input/output streams instead of hard-coding `stdin`/`stdout`, specifically so the entire game loop — not just the scoring function — can run end to end against fake streams in a test, no real terminal required. That's a small design choice with an outsized payoff: a winning game and a full 6-guess loss (revealing the answer) are both covered by tests that actually drive the CLI, not just unit tests around scoring in isolation.

## What it doesn't do

Full test suite green, scoring algorithm and CLI loop both covered end to end. No real dictionary check on guesses (any 5 letters go through) and no stats persisted between runs — this was meant to stay small and fun, not turn into a real word game with a backlog of its own.

_Repo: [termdle](https://github.com/YoussefAyach01/termdle) — project #10 of a 10-project sprint building out real backend/DevOps signal._
