---
title: "Building a CI/CD + IaC pipeline from nothing: deploy-pipeline"
description: "A minimal link-shortener is the vehicle; the real project is the pipeline around it — GitHub Actions, Ansible-provisioned VPS, and nginx, wired end to end."
date: 2026-09-13
tags: ["CI/CD", "Ansible", "Docker", "GitHub Actions", "ship-sprint"]
---

First project in a ten-project sprint to build out real backend/DevOps signal, and I picked the smallest possible app on purpose: a link-shortener API. The point was never the shortener — it's how code actually gets from a push to a running server, the part that's usually invisible on a portfolio.

## What "the pipeline" means, concretely

Push to `main` and a GitHub Actions workflow typechecks and builds the app, then copies it to a VPS over SSH and runs `docker compose up -d --build`. The VPS itself isn't clicked together — an Ansible playbook provisions Docker, nginx, and a UFW firewall (22/80/443 only) from a bare Ubuntu 24.04 droplet. nginx reverse-proxies to the app container, and once a domain is pointed at the box, `certbot --nginx` gets it a real TLS cert.

That's the whole shape: **Ansible builds the box, GitHub Actions ships the code, nginx fronts it.** Two different automation tools doing two different jobs, not one tool stretched to cover both.

## Keeping the app boring so the pipeline gets the hours

It would've been easy to let the link-shortener grow features and let the pipeline stay an afterthought — that's how most side projects end up. I capped it instead: Express and Postgres, nothing else, so the actual hours went into the deploy path — secrets in GitHub Actions secrets rather than anywhere committed, a one-time infra setup written down step by step, and a README section that lists what this doesn't do (no blue-green deploy, no automated backups, no secrets manager beyond repo secrets) instead of pretending those gaps aren't there.

Writing the missing pieces down turned out to matter more than I expected — it's the only way "small scope" reads differently from "didn't think about it."

## What's left before this is actually deployed

Code-complete, containerized, smoke-tested locally with `docker compose up`. Not applied to a real droplet yet — that needs an actual DigitalOcean account and a billing decision I'm not going to fake my way around. The one-time setup is spelled out in the README (`ansible-playbook ... -e domain_name=...`, then `certbot`), so provisioning is a matter of when I get to it, not a mystery.

_Code and the one-time infra setup: [deploy-pipeline](https://github.com/YoussefAyach01/deploy-pipeline)._
