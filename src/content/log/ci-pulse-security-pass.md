---
title: "A security checklist on a finished app: three real fixes"
description: "ci-pulse was feature-complete and already hardened when I ran a full security checklist over it. It still found a critical dependency advisory, a config bug that failed mid-request, and a cron check that would have accepted 'Bearer undefined'."
date: 2026-10-12
tags: ["security", "nextjs", "postmortem"]
---

[ci-pulse](/projects/ci-pulse/) was done. Sign-in, repo picker, poller, alerts, team invites, Stripe checkout, all built and driven end to end against a real database. I had already encrypted the GitHub tokens, scoped every query by team, and restricted webhook URLs to Slack and Discord. Three weeks later I ran a written security checklist over it anyway, section by section, and wrote down what I found.

## What held

Most of it. Every mutation is a server action that re-checks the caller's membership and role in the team that owns the row, so there is no route where guessing another team's id gets you their data. The inputs go through Zod. Secrets are encrypted or hashed, never stored raw. The Stripe webhook verifies its signature before trusting the payload. Headers were already set. I am listing this because a security pass that finds nothing in these places is also a result worth recording.

## What did not hold

**A critical advisory in the framework.** `npm audit` reported a remote-code-execution issue in Next.js's Open Graph image helper and a server-side request forgery in its image optimisation, both fixed in a newer minor. I was one minor behind. The fix was an upgrade and a re-run of the test suite; the lesson is that "audit clean at scaffold time" has a shelf life of weeks.

**Configuration that failed in the wrong place.** Each module read its own environment variables when it needed them. A missing `ENCRYPTION_KEY` surfaced as a decrypt error in the middle of a poll, which is the worst time to learn that a deploy is misconfigured. Now a single schema validates every variable the app reads, once, at boot. Required ones must be present and well-formed (the key must decode to exactly 32 bytes; the secrets must be long enough). Optional groups such as Stripe and mail may be absent, but if present they must be valid. A bad deploy fails before it serves a request.

**`Bearer undefined`.** The poller endpoint is guarded by a secret in an `Authorization` header. The first version compared the header against a template string built from the environment. If the secret was unset, the template produced the literal text `Bearer undefined`, and a request carrying exactly that header would have been authorised. The replacement compares byte lengths and then uses a constant-time comparison, and it refuses everything when the secret is unset or shorter than sixteen characters. A test now sends `Bearer undefined` on purpose.

## What I left alone

The remaining audit findings were in developer tooling: a glob library pulled in by the linter config, a bundler pulled in by the migration tool. Neither ships. The only available fixes were major downgrades of the tools themselves, which would have been a real regression to remove a theoretical one. I wrote that reasoning into the findings report instead of forcing the fix.

## What changed in how I work

The checklist is now a step with a date on it, not a feeling that the code is probably fine. The three fixes above took an evening. Any one of them, found by someone else in production, would have taken much longer than that.
