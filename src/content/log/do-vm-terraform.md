---
title: "Terraform without a cloud account: do-vm-terraform"
description: "A DigitalOcean droplet+firewall+DNS module, fully validated and tested against a mocked provider — and the Terraform `set` block bug that cost me an hour."
date: 2026-09-14
tags: ["Terraform", "IaC", "DigitalOcean", "ship-sprint"]
---

`do-vm-terraform` is the declarative counterpart to [`deploy-pipeline`](/log/deploy-pipeline/)'s Ansible playbook: Ansible configures software on an existing box, this provisions the box itself — a droplet, a firewall, and an optional DNS record, all from one `terraform apply`.

## Testing infrastructure code without infrastructure

The obvious way to validate a Terraform module is `terraform apply` against a real account, then `terraform destroy` and hope you remembered every resource. I didn't have a DigitalOcean account in this sprint slot, so I used `terraform test` with `mock_provider "digitalocean" {}` instead — three checks (droplet and firewall get planned, the DNS record only appears when a domain is actually given, and the SSH rule always carries the caller's specific CIDR rather than a wildcard) that run with no API token and no billing, and now run in CI on every push.

That last check matters more than it sounds: the firewall variable has no default for allowed SSH CIDRs, on purpose, so an empty/missing value can't silently produce an open-to-the-world SSH rule. The test asserts that invariant directly instead of trusting the variable definition to hold forever.

## The bug: Terraform `set` blocks have no addressable keys

Writing the firewall resource, I tried to index into a `set`-typed block the way you'd index a list — and Terraform doesn't allow it, because a `set` is unordered and has no stable index. The fix was restructuring the firewall rule as the provider actually expects: a block that Terraform manages by content, not position. It's a small thing, but it's the kind of error that only shows up once you've actually tried to reference a real attribute of a real resource type, which is exactly what writing a genuine (if mock-provider-tested) module forces you to do that reading docs doesn't.

## What I still need to do

`terraform validate` and `terraform fmt -check` are clean, and the test suite is green — the same bar it'd need to clear if it had actually been applied. The real gap: no droplet has actually been spun up and torn down, because that takes a DigitalOcean account, billing, and an API token, and that's a spending decision I'm making myself, not something to skip past. `terraform apply` / `terraform destroy` are one command away once the account exists.

_Code: [do-vm-terraform](https://github.com/YoussefAyach01/do-vm-terraform), including the mock-provider test suite._
