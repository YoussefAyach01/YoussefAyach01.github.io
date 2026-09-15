---
title: "A collector, not a CRUD app: weather-pulse"
description: "A cron-scheduled service that snapshots real weather data into Postgres every 15 minutes, rendered through a dashboard with zero client-side JavaScript."
date: 2026-09-13
tags: ["cron", "PostgreSQL", "server-rendered", "ship-sprint"]
---

Most of this sprint's backend projects react to requests. `weather-pulse` is a different pattern entirely: it _acts on a schedule_, pulling real weather data for a handful of cities from the Open-Meteo API every 15 minutes and appending it to Postgres, whether or not anyone's looking at the dashboard right now.

## Append-only as a design choice, not a limitation

Readings are never updated or deleted — every collection run inserts new rows. That means the dashboard is always reconstructable from raw history; there's no "current state" to get out of sync with reality, because there is no mutable current state, only an ever-growing log of what was actually observed. The sparkline on the dashboard is just the last 20 readings per city, read straight off that log.

## Zero client-side JavaScript, on purpose

The dashboard is fully server-rendered HTML, with the trend line drawn as inline SVG computed server-side and a `<meta http-equiv="refresh">` tag doing the auto-updating instead of a JavaScript polling loop. That's not a limitation I hit and worked around — it's a constraint I chose, specifically to see how far "plain HTML, no framework, no bundler, no client dependency footprint" actually gets you for a genuinely useful dashboard. Answer: further than expected. A sparkline doesn't need React.

## Failure isolation in the collector itself

`collectOnce()` fetches all cities in a run, and if one city's request fails, the others still get collected and stored — one bad response doesn't abort the whole run. This is the kind of thing that's invisible until the one time a single upstream API call times out at 3am and either takes down every other city's data with it or doesn't, depending on whether anyone thought about it in advance.

## What's still open

The smoke test triggers a real collection run against the live Open-Meteo API — not a mock — and confirms the dashboard renders the resulting readings; `/collect-now` gave five real cities' data on first manual trigger. Scheduling is in-process (`node-cron` inside the same server), which is simpler to deploy but means a scheduled run is lost if the process happens to be down — an acceptable trade for a single-instance portfolio project, and the README says so rather than hiding it. Deploying live needs the same VPS `deploy-pipeline` provisions, since cron/collection wants a long-running process rather than a serverless function.

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [weather-pulse](https://github.com/YoussefAyach01/weather-pulse)._
