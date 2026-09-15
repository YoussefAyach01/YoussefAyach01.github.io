---
title: "Hardening a toy CRUD API into something production-shaped"
description: "task-api-hardened takes a five-endpoint task list and wraps it in Redis-backed rate limiting, cache invalidation, and structured logging — the unglamorous layer that separates a demo from a service."
date: 2026-09-13
tags: ["Fastify", "Redis", "rate limiting", "observability", "ship-sprint"]
---

`task-api-hardened` is a small task-list API — create, list, update, delete. Nobody would call that impressive on its own. The point of this project is everything wrapped around it: the layer that turns a CRUD toy into something you'd actually trust in front of real traffic.

## Rate limiting that survives more than one instance

`@fastify/rate-limit` defaults to an in-memory counter, which quietly breaks the moment you run more than one instance behind a load balancer — each instance enforces its own limit, so the _effective_ limit multiplies by instance count without anyone noticing. Backing it with Redis instead means the counter is shared, so the limit means what it says regardless of how many processes are serving traffic.

## Caching that never lies

`GET /tasks` is cached in Redis for a short TTL and returns an `x-cache: hit|miss` header, so the behavior is directly observable rather than a black box. The detail I care about more: every write (`POST`/`PATCH`/`DELETE`) invalidates the cache immediately instead of waiting out the TTL. A cache that can serve stale data right after you changed something is worse than no cache — it's a bug that looks like a feature.

## Structured logs, not printf debugging

Fastify's built-in pino logger emits one JSON line per request — method, path, status, response time — in production, with `pino-pretty` for readability in dev. That's the smallest possible version of "logs a machine can query," and it's the difference between grepping and actually answering "which routes got slow at 3am."

## Metrics as a foundation, not an afterthought

`GET /metrics` exposes Prometheus-format metrics — default Node.js process stats plus a request-duration histogram labeled by method/route/status. It's not wired to a dashboard in this project on purpose: that's [`observability-stack`](/log/observability-stack/), a separate concern with a separate repo, scraping this endpoint.

## What's still open

Smoke-tested locally with a real docker-compose run — the test suite asserts the cache actually hits on a repeat `GET` and clears on a write, not just that the server boots. Deploying live needs a Fly.io account and managed Postgres/Redis, which is the next real step, not an automation gap.

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [task-api-hardened](https://github.com/YoussefAyach01/task-api-hardened)._
