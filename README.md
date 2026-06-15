# Live Streaming RealtimeKit

Browser and mobile first live production system for field sports and live shows.

## Core Goal

Mobile cameras join from browser. A mobile director controls scenes, score, graphics, and stream state. RealtimeKit handles the meeting, participant tokens, custom layout URL, and export.

```txt
Mobile cameras -> RealtimeKit meeting
Director route -> controls camera, score, graphics
/compositor/:eventId?token=RECORDER_TOKEN -> custom layout
RealtimeKit export -> YouTube or Facebook
```

## Stack

This repo follows the source compositor project style, not Next.js.

- Frontend: React Router + Vite
- Backend: Cloudflare Worker + Hono
- Realtime layer: Cloudflare RealtimeKit REST API + Web SDK
- Graphics: reusable overlay engine package
- Shared state types: shared package

## Routes

```txt
/camera
/director/:eventId
/compositor/:eventId
/score/:eventId
```

## Backend API

```txt
GET  /api/health
POST /api/events
POST /api/events/:eventId/participants
POST /api/events/:eventId/recording/start
POST /api/recordings/:recordingId/stop
```

## Setup

```bash
cd apps/web
cp .dev.vars.example .dev.vars
pnpm install
pnpm dev
```

Set the Cloudflare values in `.dev.vars` before calling the API.

## Workspace

```txt
apps/web
  React Router frontend
  Cloudflare Worker backend

packages/shared
  Event, camera, program, and overlay types

packages/overlay-engine
  Scoreboard, ticker, logo, sponsor, and external graphics layer
```
