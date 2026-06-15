# Live Streaming RealtimeKit

Browser/mobile-first live production system inspired by StreamYard, designed for field sports and live shows.

## Core Goal

Mobile cameras join from browser. A mobile director controls scenes, score, graphics, and stream state. A custom recording layout renders the final stream with graphics and sends it to YouTube/Facebook through RealtimeKit export.

```txt
Mobile Camera 1 ┐
Mobile Camera 2 ├── WebRTC → RealtimeKit meeting
Mobile Camera 3 ┘
                        ↓
Director route
controls camera/layout/score/graphics
                        ↓
/compositor/:eventId
custom recording layout with scoreboard and graphics
                        ↓
RealtimeKit export
                        ↓
YouTube / Facebook RTMP
```

## Stack

This repo follows the source compositor project style, not Next.js.

- Frontend: React Router + Vite
- Backend: Cloudflare Worker + Hono
- Realtime layer: Cloudflare RealtimeKit
- Graphics: reusable overlay engine package
- Shared state types: shared package

## Routes

```txt
/camera
/director/:eventId
/compositor/:eventId
/score/:eventId
```

## Backend API Skeleton

```txt
GET  /api/health
POST /api/events/:eventId/participants
POST /api/events/:eventId/recording/start
```

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

## POC Target

- 2 mobile cameras
- 1 mobile director
- camera join token flow
- director token flow
- scoreboard and external graphics support
- custom RealtimeKit recording layout URL
- RTMP export test
