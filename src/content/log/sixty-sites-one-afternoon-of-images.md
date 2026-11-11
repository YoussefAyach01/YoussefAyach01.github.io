---
title: "A photo for every demo site, and the batch that was a file late"
description: "The CeoJoe showcase needed a distinct photograph for every demo site. Generating them was the easy part. Getting each one attached to the right business was where it went wrong, and a contact sheet is what caught it."
date: 2026-11-10
tags: ["ceojoe", "site-kit", "postmortem"]
---

[CeoJoe](/projects/ceojoe/)'s showcase links to demo sites built with [Site Kit](/projects/site-kit/): a riad, a dental clinic, a plumber, a notary. The first four demos used CSS-only hero art. Fifty-six more of those would have looked like fifty-six copies of one template, which is the opposite of what a showcase is for. Each site needed its own photograph.

## The constraints

Stock photos carry licences I did not want to track across that many sites, and mood boards from image sites are fine for direction but not for shipping. So the photographs are generated. The image API on my account had no free quota for image models, and I already paid for the consumer app, so the pipeline ran through the app in a browser: open a new chat, type the prompt, wait, download, rename, move.

Two rules kept the images looking like one set. Every prompt starts with the same style prefix, and every prompt lists things in the same order: subject, setting, style, lighting, framing. The mood changes by category (warm wood for food, pale and clinical for medical) and stays fixed inside one.

## What went wrong

Downloads from the app do not land the moment you click. I was listing the downloads folder right after each click and taking the newest file. For a stretch of eleven images, the newest file was the previous trade's photograph, because the current one had not finished writing. Every file in that stretch was renamed one business late.

Nothing automated would have flagged it. Each file existed, had the right name, the right dimensions, a plausible size. The site's tests check that every demo has a hero image, and every demo did.

I found it by putting all the images on one contact sheet with their filenames underneath and reading it like a page. A photograph that belongs to the trade next door is hard to miss at that size.

## What changed

- The filename is no longer trusted as evidence of content. Every batch gets a contact sheet before it is processed, and I look at it.
- The download step waits for the file to arrive before anything is renamed.
- The app's rate limit turned out to apply to the whole account, not to one model, so batches are sized to fit inside one window.

The same day's Arabic review of the sites taught the same lesson from the other side, and has [its own entry](/log/site-kit-arabic-review/): a check that confirms something exists says nothing about whether it is the right thing.
