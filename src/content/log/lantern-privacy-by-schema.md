---
title: "Privacy by schema: when the column does not exist"
description: "Lantern Analytics promises no cookies, no stored IPs and no fingerprints. The way to make that promise checkable is to give the database nowhere to put them, test that, and then find out what the tests still cannot see: a chart blanked by its own security policy."
date: 2026-11-11
tags: ["privacy", "testing", "postmortem"]
---

[Lantern Analytics](/projects/lantern-analytics/) is a small cookieless analytics service. The interesting problem is not counting pageviews. It is counting _visits_, which means recognising that the second pageview came from the same person as the first, without keeping anything that identifies that person.

## The usual answer, and why I did not want it

Most lightweight tools solve this by storing a hash of the IP and user agent, often with a daily salt. The hash is not the IP, the argument goes, so it is not personal data. That argument is about as strong as the salt and the retention policy, and both live in a config file somewhere. If a reader wants to verify the claim they have to read the code, the deployment, and the operator's habits.

I wanted a claim a reader could verify by reading one `CREATE TABLE`.

## What the schema says

The `events` table has six columns: an id, the site, the path, the referrer's hostname, a device class, and a timestamp. Plus one flag, `is_new_visit`, which is a 0 or a 1. There is no column for an IP address, a cookie, a session id, or a hash. Not "we hash it before storing", not "we truncate the last octet". Nowhere to put it.

The flag is the _result_ of the dedup check, computed in memory and then forgotten. The dedup keeps a `Set` of SHA-256 hashes of a random salt, the site id, the IP and the user agent, for the current UTC day only. At midnight the salt is replaced and the set is cleared. Nothing in that structure is ever written to disk, to a log, or to a response.

## What the tests prove

Three tests do the work the README used to do.

- The **privacy test** inserts a real event through the real collect code path with a known IP and a user agent containing a marker string, reads the row back, serialises it to JSON, and asserts that neither the IP nor the marker appears anywhere in it.
- The **rotation tests** drive the dedup with an injectable clock. The same visitor is a new visit on day one, a repeat visit an hour later, and a new visit again one second after midnight. Twenty-three hourly checks inside one day never rotate. Two independently constructed dedup instances get different salts, so there is no accidental determinism.
- The **idempotency test** runs the daily rollup a random one to five times for the same day and asserts the totals are identical each time, then adds new same-day events and checks they are counted exactly once.

With those in place, the README can say "no cookies, no IP storage, no persistent fingerprint" and point at the test file instead of asking to be believed.

## What the tests could not see

The first time I seeded two weeks of plausible traffic and opened the dashboard in a real browser, the totals were right, the top-pages table was right, and the 14-day chart was an empty white box.

The bars were `<li>` elements with an inline `style="height:72%"`. The page also sends a strict content-security policy, `default-src 'self'` with no `unsafe-inline`, which tells the browser to drop inline style attributes. Both decisions were correct on their own. Together they produced a chart that rendered as nothing, in every browser that enforces the policy, which is all of them.

The test suite had checked the dashboard HTML contained the site name and at least one number. It had not loaded the page. The code was written by AI coding agents under my direction, and this is the kind of bug that pattern produces: each piece correct in isolation, the interaction never observed.

The fix was small. Bar heights are now twenty classes, `h5` through `h100`, in the stylesheet. A new test asserts the dashboard HTML contains no `style=` attribute at all, so the policy and the markup cannot drift apart again without a red build.

## The rule I took from it

A test that reads the HTML is not a test that saw the page. For anything with a security policy, a layout, or a chart, the suite needs at least one check that runs in a browser, or a person has to open it before calling it done. I opened it. That is the only reason the chart exists.
