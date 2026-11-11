---
title: "Why the poller is not on Vercel Cron"
description: "ci-pulse needs to check GitHub every five to fifteen minutes. Vercel's free tier runs cron once a day. The fix is a secret-guarded endpoint that any scheduler can call, and a few rules about how it behaves when it is called."
date: 2026-09-19
tags: ["ci-pulse", "infra", "decisions"]
---

[ci-pulse](/projects/ci-pulse/) is a status board, so its whole value is in how often it looks. The free plan checks every fifteen minutes, the paid plan every five. The app deploys to Vercel, and Vercel has a cron feature, so the obvious design was a cron entry in `vercel.json`.

The obvious design does not work on the plan I am on. Vercel's Hobby tier caps scheduled functions at one run per day. A once-a-day status board is a newsletter.

## The shape that works anywhere

Polling is a plain `POST /api/cron/poll`, guarded by a secret in the `Authorization` header. Anything that can make an HTTP request on a schedule can drive it: a GitHub Actions workflow with a `schedule` trigger, a free cron-as-a-service, a queue with delayed delivery, or Vercel's own cron on a paid plan later. The app does not know or care which. The default caller is a GitHub Actions workflow in the same repository that fires every five minutes, which is the shortest interval GitHub allows and which can lag a few minutes under load.

Detaching the scheduler from the host also made the endpoint better, because it now has to assume it might be called late, early, twice, or by the wrong person.

- **Late or early:** each repo stores when it was last checked; the endpoint only polls repos whose plan interval has elapsed. Calling it every minute would not poll anything more often than its plan allows.
- **Too long:** the handler has a time budget. If a batch runs past it, the remaining repos wait for the next call rather than the whole invocation timing out and losing its work.
- **By the wrong person:** the secret is compared in constant time, and an unset secret authorises nobody. [The security-pass entry](/log/ci-pulse-security-pass/) tells the story of the first version of that check.
- **Against GitHub's limits:** every check sends the last ETag, so an unchanged repo costs a 304 that GitHub does not count. A 403 or 429 stops the batch and records when to try again.

## What is still open

The workflow needs two repository secrets, the app's URL and the shared cron secret, and they must match the values in the deployment. That is a deploy-time step I have not done yet, because the app is not deployed yet. When it is, the first thing I will check is the gap between scheduled and actual run times in the Actions log, because "every five minutes" on GitHub's scheduler is a floor, not a promise.
