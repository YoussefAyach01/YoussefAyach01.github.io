---
title: "Building a CI/CD + IaC pipeline from nothing: deploy-pipeline"
description: "A minimal link-shortener is the vehicle; the real project is the pipeline around it — GitHub Actions, Ansible-provisioned VPS, and nginx, wired end to end."
date: 2026-09-13
tags: ["CI/CD", "Ansible", "Docker", "GitHub Actions", "ship-sprint"]
---

The first project in a 10-project sprint to build out real backend/DevOps signal, `deploy-pipeline` is deliberately small on the app side — a link-shortener API — so all the effort goes into the part that's usually invisible on a portfolio: how code actually gets from a push to a running server.

## What "the pipeline" means, concretely

Push to `main` and a GitHub Actions workflow typechecks and builds the app, then copies it to a VPS over SSH and runs `docker compose up -d --build`. The VPS itself isn't clicked together — an Ansible playbook provisions Docker, nginx, and a UFW firewall (22/80/443 only) from a bare Ubuntu 24.04 droplet. nginx reverse-proxies to the app container, and once a domain is pointed at the box, `certbot --nginx` gets it a real TLS cert.

That's the whole shape: **Ansible builds the box, GitHub Actions ships the code, nginx fronts it.** Two different automation tools doing two different jobs, not one tool stretched to cover both.

## The decision that mattered: keep the app boring

It would have been easy to let the link-shortener grow features and let the pipeline stay an afterthought. I inverted that on purpose — the API is Express + Postgres and nothing else, so every hour spent went into the deploy path: secrets management via GitHub Actions secrets (not committed anywhere), a documented one-time infra setup, and an honest "what this doesn't do" section (no blue-green deploy, no automated backups, no secrets manager beyond repo secrets).

Writing down what you _didn't_ build is as useful as writing down what you did — it's the difference between "small scope" and "didn't think about it."

## What's still open

Code-complete, containerized, and smoke-tested locally via `docker compose up`. Not yet applied to a real droplet — that's a real DigitalOcean account and billing decision, not something to fake. The README documents the exact one-time setup (`ansible-playbook ... -e domain_name=...`, then `certbot`) so provisioning is a "when," not a "how."

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [deploy-pipeline](https://github.com/YoussefAyach01/deploy-pipeline)._
