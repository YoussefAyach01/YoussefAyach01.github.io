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

This was originally scoped to monitor a VPS — the one `deploy-pipeline` provisions. That VPS doesn't exist yet, since standing one up needs a real DigitalOcean account and a billing decision, so I pointed Prometheus at the containerized app stack directly instead. Nothing about the monitoring approach changes — scrape config plus a provisioned dashboard is the same either way — only the target line in `prometheus.yml` differs. Once the VPS exists, repointing this is a one-line edit.

Useful thing to notice for the rest of this sprint: the skill I was practicing (scrape + provision a dashboard as code) never actually depended on the specific box being monitored. Separating those two let a missing VPS stop being a blocker at all.

## What I actually checked

Checked locally: both Prometheus targets report `up`, Grafana reports healthy, and the dashboard shows real numbers once you throw some load at the API. No alerting via Alertmanager yet — dashboards only — and no long-term retention backend, so Prometheus's local TSDB is what's holding the history, which is fine for a demo and would need swapping out for anything production-scale.

_Repo: [observability-stack](https://github.com/YoussefAyach01/observability-stack) — project #3 of a 10-project sprint building out real backend/DevOps signal._
