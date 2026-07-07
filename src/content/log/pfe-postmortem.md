---
title: "From mockup to production in three months: a PFE postmortem"
description: "My final-year internship brief was a React mockup with nothing behind it. Three months later it was a live SaaS with six ad-platform integrations. What went right, what bit me, and what I'd do differently."
date: 2026-07-07
tags: ["postmortem", "internship", "OneBotAds", "PostgreSQL"]
---

In April 2026 I started my final-year internship (PFE) at Jobistart with a deceptively simple brief: OneBotAds, an ad-automation platform, existed as a React interface you could click through — and nothing else. No database. No API. No connected platform. By June it was live at [onebotads.net](https://onebotads.net) with six ad-platform integrations, an AI campaign agent, payments, and a 17-table PostgreSQL schema. This is the honest version of how that went.

## Start by finding out what's actually real

The most useful thing I did in week one was an audit, not code. Every screen in the mockup implied endpoints; almost none existed. The Create Ad page alone called **nine API endpoints that led nowhere**. I catalogued every implied promise and turned it into the real backlog — which is how "build the backend" became a concrete list instead of a fog.

Lesson: when you inherit a UI-first project, the interface is a requirements document written by someone who never had to implement it. Read it that way.

## The bug that taught me to respect migrations

For development speed, Sequelize was set to auto-sync the schema on every server start, with `ALTER` enabled. Convenient — until I found the `tiktok_ad_history` table had accumulated **45 duplicate UNIQUE constraints**, one added silently on every restart. The database was one restart away from serious trouble, and nothing in the app code was wrong.

We dropped the 44 duplicates and turned alter-sync off. The general lesson stuck with me harder than the fix: auto-magic schema tools optimize for day one and charge interest every day after. Production wants migrations — boring, explicit, versioned.

## Security bugs don't announce themselves

Two finds from code review, not from any error message:

- A service that listed connected platforms **without filtering by `user_id`** — every user could see every user's connections. One missing `WHERE` clause.
- The TikTok OAuth flow used a **hardcoded CSRF `state` parameter**, which defeats the entire point of `state`. Fixed with `crypto.randomBytes` and a 10-minute TTL store.

Neither ever threw an exception. Both would have been real incidents. The habit I built: reread security-sensitive code as an attacker on a schedule, because nothing else will surface these.

## Constraints you don't choose still teach you

The server was CommonJS-only — mixing in one ES module import crashed the Babel setup, so every new file followed the old convention. Not the choice I'd make on a greenfield project, but fighting a codebase's conventions mid-internship costs more than it pays. Consistency beat preference, and shipping beat both.

## Shipping means someone else can run it without you

The last week wasn't features — it was the handoff: a documented schema, environment references, deployment procedure, API reference with Postman collections, and per-topic guides for the next engineer. Management also chose to launch a reduced edition and hold back the advanced attribution features; watching that product decision get made taught me that "done" is defined by the business, not by the code.

## What I'd do differently

Migrations from day one, even solo. The user-scoping and CSRF reviews in week one, not month three. And I'd write this kind of note _during_ the internship instead of after — half the value of a lesson is having it written down while it still hurts.

_The full OneBotAds case study — architecture diagram included — is [here](/projects/onebotads/)._
