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

This is a Go-specific trap in a way it isn't in some other languages: Go strings are byte slices, not rune slices, and `len(s)` counts bytes. The type checker has no opinion about whether that's what you meant. A real test — not a manual check — caught it, which is the actual point: new-language mistakes are exactly where a test suite earns its keep, because your intuition for "obviously correct" hasn't calibrated yet.

## What's still open

`go vet`, `gofmt`, and a full test suite (mocked HTTP server) all pass, and it's smoke-tested against this portfolio's own repo. Ships as GitHub Release binaries via a tag-triggered Actions workflow, not a hosted service — a CLI doesn't need a server. Next: JSON output mode for scripting, and filtering to a specific workflow file instead of "most recent run overall."

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [ci-status](https://github.com/YoussefAyach01/ci-status)._
