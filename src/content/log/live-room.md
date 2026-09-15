---
title: "Real-time without a framework: live-room"
description: "A live poll room over WebSockets — vote counts and presence updating instantly for everyone in the room, with no page refresh and no polling."
date: 2026-09-13
tags: ["WebSockets", "Socket.io", "real-time", "ship-sprint"]
---

Every other backend project this sprint is request/response: a client asks, the server answers. `live-room` is the deliberate exception — join a URL, vote, and watch the results and participant count update instantly for everyone else in the room, pushed from the server the moment something changes.

## A room is just whatever's in the URL

There's no room-creation flow. Open `?room=demo` and you're in room "demo," same as anyone else who opens that link — no auth, no signup, no database row representing the room. I left it that way because the thing I wanted to demonstrate was the WebSocket architecture, and a signup flow would have eaten the time budget without teaching me anything new.

## What "presence" actually counts

Presence is tracked per Socket.io connection, not per person — open two tabs to the same room and the count goes up by two. Worth being upfront about: "presence" here means open sockets, not unique humans. Fine for a demo, wrong number if you ever needed to know how many people were actually in the room.

## Testing two clients, not one request

The smoke test spins the server up in-process and connects two real Socket.io clients — not mocks — then checks that a vote cast from one shows up as a broadcast on the other, and that the presence count moves on connect/disconnect. A unit test on the vote-counting function in isolation wouldn't have caught a broadcast that silently never reaches the second client, which is the actual failure mode real-time code has that request/response code doesn't.

## The honest limits

State lives entirely in memory — resets on restart, doesn't survive more than one server instance. Fine for a single-instance demo; a real multi-instance deployment would need `@socket.io/redis-adapter` to share state across processes, and the README says so rather than leaving it as a surprise. Not deployed yet — needs a Fly.io or Render account, and WebSockets specifically need a host that holds a persistent connection open, which rules out some serverless platforms without extra config.

_Code: [live-room](https://github.com/YoussefAyach01/live-room)._
