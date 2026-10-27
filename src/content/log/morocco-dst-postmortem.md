---
title: "A government changed a timezone and broke my tests"
description: "A failing test in a booking app's CI looked like an environment bug. Three machines gave three different answers before I found the actual cause: Morocco abolished its seasonal clock change three weeks earlier, and nobody told my test fixtures."
date: 2026-10-27
tags: ["debugging", "testing", "CI/CD", "postmortem"]
---

A CI run for `booking-page` — a salon booking app — failed on a test that had never failed before: `nowInSalon()`, a function that converts a UTC timestamp into Casablanca local date/time, returned an hour off from what the test expected. Nothing in the booking logic had changed. The only thing that had changed was pushing the repo to GitHub for the first time, so GitHub Actions was running this test suite for the first time too.

## The wrong hypothesis, chased for 20 minutes

My first assumption: Node's bundled ICU timezone data is stale on the GitHub-hosted runner. Plausible — Node ships its own copy of the IANA timezone database, and different builds can disagree. I bumped the CI workflow from Node 22 to Node 24. Same failure. I added a throwaway debug step printing the resolved UTC offset directly. Confirmed: the runner said Casablanca was `GMT+00:00` for a September date it should have been `GMT+01:00`, on both Node versions.

So I tried fixing it the "robust" way — swapping the `Intl.DateTimeFormat` call for `moment-timezone`, a library that bundles its own timezone data instead of trusting the host's ICU. Installed it, ran the test locally to confirm the fix... and got the exact same "wrong" answer my own machine had never produced before. `moment-timezone`'s own data, freshly published days earlier, agreed with GitHub Actions. My laptop was the outlier, not the runner.

## Checking the actual source instead of a third runtime

Three environments now disagreed with each other — my machine, the CI runner, and a library specifically chosen to sidestep this exact problem — and two of the three agreed with each other. That's a strong signal to stop trusting any runtime's output as ground truth and go find out what's actually true. A quick search answered it in one result: Morocco's government announced on June 25, 2026 that the country would drop its seasonal Ramadan clock change entirely and switch to permanent GMT, effective September 20, 2026. The IANA timezone database had already been updated to reflect it. My laptop's Node install just hadn't picked up that update yet; GitHub's runner had.

The code was never wrong. `nowInSalon()` correctly reads whatever the timezone database says — it was the **tests** that hardcoded an assumption about a rule that stopped being true three weeks before I wrote them. I reverted the Node version bump and the `moment-timezone` swap — neither was the fix, both were just me treating a symptom — and updated the two test fixtures (one in `slots.test.ts`, one in `repo.test.ts`) to the post-September-20th offset instead. A quick grep across the rest of my portfolio turned up the same stale assumption baked into a cron-scheduling test in another, not-yet-published project, with the same fix.

## What I'd actually apply next time

Don't resolve a cross-environment disagreement by picking the machine you trust most — pick the one with the most recently updated data, or better, check an external source. And when a test encodes "fact" about something outside your control that changes on its own schedule — a timezone rule, a currency rate, a public holiday list — the fixture is a liability the moment that external fact changes, and it will change without your code changing at all. The honest fix isn't a more sophisticated runtime trick; it's noticing the test's assumption went stale and updating the assumption.

_Code: [booking-page](https://github.com/YoussefAyach01/booking-page)._
