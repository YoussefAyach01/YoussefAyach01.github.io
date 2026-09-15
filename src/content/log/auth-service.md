---
title: "Building auth from scratch instead of installing it: auth-service"
description: "A standalone JWT auth microservice built against an explicit OWASP checklist — refresh-token rotation with reuse detection, argon2id, and timing-safe login failures, all decisions I can defend one by one."
date: 2026-09-13
tags: ["security", "JWT", "OWASP", "Fastify", "ship-sprint"]
---

Most projects need auth and nobody builds it from scratch — you install a library, or copy whatever worked last time, and move on. I wanted the opposite for this one: a standalone microservice where I could point at every security decision and explain why, in the README, rather than trusting a template I don't fully understand underneath my own code.

## Reuse detection, not just rotation

Refresh-token rotation alone — issue a new refresh token on every use — is table stakes. The part that actually matters is what happens when a _revoked_ token gets presented again: that's the signal a stolen refresh token would produce, since the legitimate owner and the attacker would both eventually try to use the same now-invalid token. `/refresh` treats a reused, already-rotated token as a compromise signal, not just an error. It's the difference between "we rotate tokens" (a checkbox) and "we can detect theft" (an actual security property).

## Small decisions that don't announce themselves

A few things that don't show up as endpoints but matter every time someone reads this code later:

- **Refresh tokens are stored hashed** (SHA-256), never in plaintext — a database leak doesn't hand out working credentials.
- **Login failures are indistinguishable**: wrong-password and no-such-user both return the same `401`, and the password-verify call runs even for a nonexistent user (against a dummy hash) so the two cases take about the same time. Otherwise the response itself — fast 401 vs slow 401 — leaks which emails are registered.
- **argon2id over bcrypt**, because it's the current OWASP-recommended default and resists GPU-parallelized cracking better.

None of these show up from hitting the API with curl. They're the kind of thing that only surfaces in a code review, or worse, in an incident — so I wrote each one down in the README instead of leaving it implicit and hoping whoever reads the code later notices.

## What's covered, what isn't

The full flow — register, login, protected route, refresh rotation, rejection of a reused refresh token, logout revocation — is smoke-tested against a real Postgres instance through docker-compose, nothing mocked. Missing: email verification and password reset (registration is immediate right now), and any OAuth/social login — I kept it to email and password so the auth mechanics stayed the focus instead of spreading across three different sign-in paths.

_Repo: [auth-service](https://github.com/YoussefAyach01/auth-service) — project #7 of a 10-project sprint building out real backend/DevOps signal._
