---
title: "Building something that acts without being asked: weather-pulse"
description: "A cron-scheduled service that snapshots real weather data into Postgres every 15 minutes, rendered through a dashboard with zero client-side JavaScript."
date: 2026-09-13
tags: ["cron", "PostgreSQL", "server-rendered", "ship-sprint"]
---

Most of this sprint's backend projects react to requests. `weather-pulse` acts on its own schedule instead — pulling real weather data for a handful of cities from the Open-Meteo API every 15 minutes and appending it to Postgres, whether anyone's looking at the dashboard or not.

## Never updating a row, only adding one

Readings never get updated or deleted; every run just inserts new rows. The upside took me a bit to appreciate: the dashboard is always reconstructable from raw history, because there's no mutable "current state" that could ever drift out of sync with what actually happened — just a growing log. The sparkline is nothing more than the last 20 readings per city, read straight off that log.

## How far plain HTML actually gets you

The dashboard is server-rendered HTML with the trend line as inline SVG computed on the server, and a `<meta http-equiv="refresh">` tag handling the auto-update instead of any JS polling loop. I picked that constraint on purpose, curious how far "no framework, no bundler, zero client dependencies" would carry a dashboard that still needed to look decent. Further than I expected — a sparkline really doesn't need React.

## One bad city shouldn't sink the rest

`collectOnce()` loops over every configured city, and if one request fails, the rest still get collected and stored. Easy to skip this when you're building the happy path first, and it's exactly the kind of gap that only becomes visible the one time a single upstream call times out and quietly takes the whole run down with it.

## Running, but not deployed

The smoke test triggers a real collection run against the live Open-Meteo API, not a mock, and checks the dashboard renders what came back — `/collect-now` returned real data for all five configured cities on the first manual trigger. Scheduling runs in-process via `node-cron` inside the same server, simpler to deploy but meaning a scheduled run is skipped if the process happens to be down; an acceptable trade at this scale, and the README states it rather than leaving it as a surprise. Not deployed live — needs the same VPS `deploy-pipeline` provisions, since cron work wants a long-running process rather than a serverless one.

_Code: [weather-pulse](https://github.com/YoussefAyach01/weather-pulse)._
