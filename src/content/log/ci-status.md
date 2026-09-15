---
title: "Learning Go by scratching a real itch: ci-status"
description: "A tiny Go CLI that checks GitHub Actions status across several repos at once — my first project in a new language, and the byte-vs-rune bug it taught me on day one."
date: 2026-09-14
tags: ["Go", "CLI", "GitHub Actions", "ship-sprint"]
---

`ci-status` prints the latest GitHub Actions run for one or more repos in a single command — `ci-status owner/repo1 owner/repo2` — instead of opening each repo's Actions tab by hand to check "did the deploy pass?" It's the "learn a new language" slot in a 10-project sprint, and I picked Go specifically because none of the other nine projects touch it.

## A real problem, not a toy one

I'd already pushed several repos this sprint, each with its own CI, and checking them one browser tab at a time was exactly the kind of friction worth automating. `--watch` polls every 10 seconds until a run finishes — useful right after a deploy push, when you want to know pass/fail without babysitting a tab. Non-zero exit code on any failed/errored run means it doubles as a CI gate, not just a status printer.

## The bug Go's type system didn't save me from

Truncating a commit message for display, I sliced the string by byte length. That's fine for ASCII and silently wrong for anything with multi-byte UTF-8 characters — a commit message with an emoji or accented character gets cut mid-character, corrupting the output. The fix is truncating by _rune_ count, not byte count, using Go's `[]rune` conversion.

Go strings are byte slices under the hood, so `len(s)` counts bytes, and the compiler has no opinion about whether that's what you actually wanted. A test caught it — I hadn't tried a non-ASCII commit message by hand, and probably wouldn't have thought to. That's more or less the shape of every new-language mistake I expect from here: things my instinct for "obviously fine" hasn't calibrated to yet, which a test suite catches and a glance at the code doesn't.

## What's shipped and what I'd add next

`go vet`, `gofmt`, and a full test suite against a mocked HTTP server all pass, and I smoke-tested it against this portfolio repo's own Actions runs. It ships as GitHub Release binaries through a tag-triggered workflow rather than a hosted service — no server needed for a CLI. Next on the list: a JSON output mode for scripting, and filtering to one specific workflow file instead of just the most recent run overall.

_Code and releases: [ci-status](https://github.com/YoussefAyach01/ci-status)._
