---
title: "497 green tests, and a hospital perpendicular to its insurers"
description: "Site Kit builds 60 business websites in French and Arabic, with a test suite that covers every one of them. A full read of the Arabic still found 65 errors, including one that changed what a hospital was telling its patients. What tests can't see, and what I changed."
date: 2026-11-10
tags: ["i18n", "testing", "postmortem"]
---

[Site Kit](/projects/site-kit/) builds 60 small-business websites from one engine, each in French and in Arabic. It has 497 tests, and they all passed on the day one of its pages told Arabic readers that a private hospital was _perpendicular to insurance companies_.

The French said "conventionné avec les assurances" — the hospital has agreements with insurers. The Arabic was meant to say متعاقد, "contracted". It said متعامد, "perpendicular". One letter apart, same shape at a glance, and a line a real patient would read before deciding where to go.

## What the tests were checking

The suite is thorough about the things a machine can verify. For every site, in both languages, it checks that no field is empty, that text has enough contrast against its background, that prices are shown, and that hostile input is escaped. Adding a business adds its tests automatically, which is how the count got to 497.

None of that looks at meaning. A wrong word is a non-empty string with good contrast.

Before the read, one more automated pass went over the copy looking for the cheap mistakes: Arabic fields with French left in them, fields identical in both languages, Latin punctuation, lists of different lengths. Across all 60 sites it flagged three things, and all three were fine (a pipe labelled "PVC", a box labelled "FRAGILE", a decimal comma). By every measure that could be automated, the Arabic was clean.

## What a side-by-side read found

Then every French string was read next to its Arabic one, all 60 sites. That found 65 things worth fixing. A few of them:

- A driving school advertising cars "with two steering wheels". The French was _double commande_, dual controls, which are pedals.
- A garage where six technicians worked "on our two bridges". _Ponts_, in a garage, are lifts.
- A gardener trimming a hedge of wormwood. The French hedge was boxwood.
- A sports shop analysing a runner's stride "on the track". It was a treadmill.
- A bookshop whose booksellers had become librarians.

There was a second kind of error that no dictionary would call wrong. The physiotherapy site used علاج طبيعي, which is correct Arabic and what you would read in Cairo or Riyadh. In Morocco the clinic down the street says الترويض الطبي. Two addresses had turned _rue_ into شارع, which is an avenue; a Moroccan street sign says زنقة. Text can be right and still tell the reader it was not written for them.

## The bug the read found in the layout

Reading the copy also exposed something that was not a translation problem. Nine services ended their description with "À partir de." — "Starting from." — and then stopped. The price was there, but in the heading row above, so the sentence pointed at nothing. It had been that way in both languages and nobody had noticed, because each half looked fine alone.

The fix was a small one in the engine: a `priceFrom` flag on a service, so the price itself renders as "À partir de 1 800 MAD" and the description no longer has to finish the thought.

## How this was done, and what I'd change

The Arabic was written by the same AI coding agents that built the engine, and the review was done with an AI assistant reading the two languages side by side. I went through what it found and made the calls it could not make for me: whether "SUV" should stay as the everyday دفع رباعي, which term a Moroccan physiotherapist would use, what two of the shops should be called.

That is better than no review, and it is not the same as a native Moroccan proofreader. The case study says so, and a real client's site would get one before launch.

What I'd apply next time: a passing suite tells you the things you thought to check are still true. For anything a person will read, somebody has to actually read it, in the language it is written in, next to what it was supposed to say.

_Code: [site-kit](https://github.com/YoussefAyach01/site-kit). Live: [ayach.is-a.dev/site-kit](https://ayach.is-a.dev/site-kit/)._
