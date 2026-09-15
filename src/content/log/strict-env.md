---
title: "Extracting a library from my own repetition: strict-env"
description: "Every backend service this sprint hand-rolled the same env-var validation block. strict-env factors it out — zero dependencies, dual ESM/CJS, and reports every config problem at once instead of one restart at a time."
date: 2026-09-13
tags: ["TypeScript", "npm", "developer tools", "ship-sprint"]
---

By the third backend service in this sprint, I noticed the same fifteen lines showing up in every `config.ts`: read `process.env`, apply a default, throw if missing, repeat per variable. `strict-env` is that block, extracted and published as an actual library instead of copy-pasted a fourth time.

## The detail that makes it worth extracting

The naive version of env validation throws on the _first_ missing variable. Fix it, restart, hit the next missing one, fix it, restart again — a slow, annoying loop, usually happening right when you're trying to get a deploy unstuck. `strict-env` collects every missing or invalid variable into one error report, so a misconfigured deploy tells you everything wrong in one shot:

```
EnvValidationError: Invalid environment variables:
  - DATABASE_URL: missing
  - API_KEY: missing
```

That's a small change in behavior and a real change in how it feels to use, especially under deploy-time pressure.

## A library answers to someone else's toolchain

Every other project in this sprint is a service — I control both ends, so sloppiness in the module format never bites me. A published package doesn't have that luxury: someone downstream is `require`-ing it from CommonJS or `import`-ing it from ESM, and it has to work for both without them caring which build ran. `tsup` builds both outputs plus `.d.ts` types from one TypeScript source, and `prepublishOnly` runs typecheck, lint, test, and build before anything ships — "it compiled" isn't the bar here, all four passing is.

## The one step left

Zero dependencies, full test suite green, both module builds verified against each other. Not on npm yet — that's an `NPM_TOKEN` secret in the CI workflow away, which needs my own npm account and login, the one manual step standing between `git push --follow-tags` and an actual published version.

_Repo: [strict-env](https://github.com/YoussefAyach01/strict-env) — project #8 of a 10-project sprint building out real backend/DevOps signal._
