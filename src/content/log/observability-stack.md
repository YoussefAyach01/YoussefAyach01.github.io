---
title: "Provisioning-as-code for monitoring: observability-stack"
description: "Prometheus and Grafana monitoring task-api-hardened, with the dashboard itself checked into git instead of clicked together — plus the honest story of adapting scope when a VPS wasn't there yet."
date: 2026-09-13
tags: ["Prometheus", "Grafana", "observability", "Docker", "ship-sprint"]
---

`observability-stack` scrapes [`task-api-hardened`](/log/task-api-hardened/)'s `/metrics` endpoint with Prometheus and ships a Grafana dashboard — request rate by status code, p95 latency by route, memory, event-loop lag — with zero manual clicking.

## Provisioning as code, actually

It's easy to say "infrastructure as code" and mean "I wrote a script once." Here it means something narrower and more useful: the Grafana datasource and the dashboard JSON both live as files in this repo (`grafana/provisioning/`), not settings someone clicked into a UI. Tear the whole stack down and bring it back up, and you get the exact same dashboard — no "oh right, I also configured that one thing by hand" gap between what's documented and what's real.

## Scoping honestly when the plan changes

This was originally scoped to monitor a VPS — the one `deploy-pipeline` provisions. That VPS doesn't exist yet (real account, real billing, not something to fake), so I adapted the target: Prometheus scrapes the containerized app stack directly instead. The monitoring _approach_ — scrape config + provisioned dashboard — is identical either way; only the target line in `prometheus.yml` changes. When the VPS exists, pointing this at it is a one-line edit, not a rebuild.

That's the actual lesson: decouple the skill you're practicing from the specific infrastructure it happens to be pointed at, and a blocked dependency stops being a blocker.

## What's still open

Verified locally: both Prometheus targets report `up`, Grafana reports healthy, and the dashboard renders real traffic when you generate some load against the API. No alerting (Alertmanager) yet, and no long-term metrics retention — Prometheus's local TSDB is fine for a portfolio demo, not for production retention needs.

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [observability-stack](https://github.com/YoussefAyach01/observability-stack)._
