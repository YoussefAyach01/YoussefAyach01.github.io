---
title: "Real-time without a framework: live-room"
description: "A live poll room over WebSockets — vote counts and presence updating instantly for everyone in the room, with no page refresh and no polling."
date: 2026-09-13
tags: ["WebSockets", "Socket.io", "real-time", "ship-sprint"]
---

Every other backend project this sprint is request/response: a client asks, the server answers. `live-room` is the deliberate exception — join a URL, vote, and watch the results and participant count update instantly for everyone else in the room, pushed from the server the moment something changes.

## Rooms as a URL, not a database row

There's no room-creation flow. A room is just whatever string sits in `?room=demo` — anyone who opens the same URL joins the same room. No auth, no signup. That's not a shortcut I took because I ran out of time; it's the actual design, because the point of this project is demonstrating real-time architecture, not building a product with user accounts. Adding auth would have diluted what the project is for.

## Presence is a connection, not a person

Presence is tracked per Socket.io connection — `connect`/`disconnect` — not per browser or per person. Open two tabs to the same room and the count goes up by two. That's an honest trade-off worth stating plainly rather than letting someone assume it's smarter than it is: "presence" here means "open sockets," which is the right primitive for a demo and the wrong one if you ever needed to know unique humans.

## Testing a WebSocket flow end to end

The smoke test spins the server up in-process and connects two real Socket.io clients against it — not mocks — then asserts that a vote from one client shows up as a broadcast on the other, and that presence count changes on connect/disconnect. Testing real-time behavior means testing the _interaction_ between two clients, not just that one request returns the right JSON; a unit test on the vote-counting function alone wouldn't have caught a broadcast that never reaches the second client.

## What's still open

State is entirely in-memory, which means it resets on restart and doesn't survive multiple server instances — fine for a single-instance demo, and a real multi-instance deployment would need `@socket.io/redis-adapter` to share state across processes, which is documented rather than silently missing. Deploying needs a Fly.io or Render account (WebSockets need a host that keeps a persistent connection open, which rules out some serverless platforms without extra config).

_Part of a 10-project sprint to build genuine backend/DevOps breadth. Repo: [live-room](https://github.com/YoussefAyach01/live-room)._
