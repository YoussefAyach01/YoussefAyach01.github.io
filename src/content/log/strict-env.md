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

## Publishing forces different discipline than shipping an app

This is the only project in the sprint that ships as a _library_ rather than a running service, and that changes what "correct" means. An app can be a little sloppy about its module format because you control both ends. A published package doesn't get that luxury — someone downstream is `require`-ing it from CommonJS or `import`-ing it from ESM, and it has to work either way without them knowing or caring which build ran. `tsup` builds both outputs plus `.d.ts` types from one TypeScript source, and `prepublishOnly` gates a real publish behind typecheck + lint + test + build passing, all four, not just "it compiled."

## What's still open

Zero dependencies, full test suite green, dual-module build verified. Not yet published to npm — that needs an `NPM_TOKEN` secret wired into the CI workflow, which needs my own npm account and login, the one manual step left before `git push --follow-tags` actually ships a version.

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [strict-env](https://github.com/YoussefAyach01/strict-env)._
