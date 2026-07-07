---
title: "MCP servers in production: giving an AI agent hands, safely"
description: "OneBotAds' chatbot launches real ad campaigns through Model Context Protocol servers spawned per request. Here's the architecture, why we spawn instead of keeping processes alive, and what I'd tell anyone wiring an LLM to real APIs."
date: 2026-07-07
tags: ["MCP", "LLM agents", "Node.js", "OneBotAds"]
---

OneBotAds has a chatbot that creates real advertising campaigns — real budgets, real targeting, launched against the real APIs of Meta, TikTok and Google. An LLM that talks is easy; an LLM that _does things with your money_ needs a much more careful design. This is how we built that layer with the Model Context Protocol, and what I learned running it in a production SaaS.

## The problem

The agent needs to perform actions: list campaigns, create ad sets, fetch statistics. Each action means calling a platform API with the **current user's OAuth credentials**. The naive approach — letting the LLM's orchestration code call your services directly — mixes three things that should never be mixed: the model's reasoning, the platform logic, and other people's access tokens.

## The shape of the solution

MCP (Model Context Protocol) is an open protocol where a server exposes _tools_ — JSON-schema-described functions — that any MCP client can call over JSON-RPC 2.0. In OneBotAds, the Express backend acts as the MCP client, and each ad platform gets its own MCP server: a small Node.js program with its own tools, its own credentials, its own failure domain.

```
Express backend (MCP client)
  ├── spawns → meta-mcp-server    (6 tools) → Meta Graph API
  ├── spawns → tiktok-mcp-server  (6 tools) → TikTok Ads API
  └── spawns → google-mcp-server  (6 tools) → Google Ads API
```

Every server follows the same pattern: an `index.js` that declares a `TOOLS` array and a `dispatchTool` switch, and a `tools/` folder with the actual API logic. Adding a capability is one entry in the array and one case in the switch. When the chatbot decides to act, Express spawns the right server as a child process, talks JSON-RPC over stdio, gets the result, and the process exits.

## The decision that mattered: spawn per request

The obvious design is a long-lived MCP server per platform. We deliberately spawn a **fresh process for every call** instead, and it's the decision I'd defend hardest:

- **Credentials are always current.** OAuth tokens get refreshed between calls. A fresh process receives the newest token from the database via environment variables — there is no stale in-memory token to chase.
- **Tokens never touch the code.** The MCP server source contains zero credentials; they're injected into the child process environment at spawn time, scoped to one user, and die with the process.
- **Isolation is free.** A crashed or hung tool call kills a child process, not the API serving every other user.

The cost is about 200&nbsp;ms of process startup per call. For actions triggered by a human chatting, nobody notices.

## The details that bit us

**stdout is sacred.** stdio transport means stdout _is_ the protocol channel. One stray `console.log` in a tool corrupts the JSON-RPC stream. All debug logging goes to stderr — a rule you learn exactly once.

**Credential lookup needs a fallback path.** Tokens live in a `cli_tokens` table keyed by `(user_id, platform)`; if a user connected before that table existed, we fall back to the older `ad_auth_configs` row and upsert it forward. Migrations of _behavior_, not just schema, are part of shipping into an existing product.

**Tool descriptions are prompts.** The `description` on each tool is what the LLM reads to decide what to call. Vague descriptions produced wrong tool choices; precise, boring ones fixed them. Write them like documentation for a very literal junior developer.

## What I'd tell you if you're building this

Give the model a narrow, typed, auditable surface — named tools with JSON schemas — and keep every secret on your side of the process boundary. The agent feels magical to users precisely because the layer underneath is boring, isolated, and predictable.

_OneBotAds shipped to production in June 2026; the full case study is [here](/projects/onebotads/)._
