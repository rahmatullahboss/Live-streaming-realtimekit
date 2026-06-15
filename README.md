# Live Streaming RealtimeKit

A browser/mobile-first live production system inspired by StreamYard, designed for field sports and live shows.

## Core Goal

Mobile camera operators join from browser/mobile. A mobile director controls scenes, scoreboards, overlays, and final output. A cloud-side compositor renders the final program feed and exports it to YouTube/Facebook via RTMP.

```txt
Mobile Camera 1 ┐
Mobile Camera 2 ├── WebRTC → RealtimeKit / SFU
Mobile Camera 3 ┘
                        ↓
Director Mobile Dashboard
controls scene/layout/score/overlay
                        ↓
Cloud Compositor / Custom Recording App
HTML/CSS overlay + selected camera layout
                        ↓
RTMP Export
                        ↓
YouTube / Facebook
```

## MVP Scope

1. Create event
2. Generate camera join links
3. Generate director link
4. Camera operators publish mobile video/audio
5. Director sees previews and switches active camera/layout
6. Scoreboard and overlay updates in real time
7. Compositor page renders the final 16:9 output
8. Export final stream to RTMP destination

## Suggested Stack

- Frontend: Next.js / React
- Realtime video: Cloudflare RealtimeKit
- Backend: Node.js / Express or Next.js API routes
- State sync: WebSocket or Server-Sent Events
- Overlay: HTML/CSS/Canvas-based compositor UI
- Storage: PostgreSQL or SQLite for MVP

## Apps

```txt
apps/web
  camera page
  director dashboard
  compositor page

apps/api
  event API
  participant token API
  overlay/layout state API
```

## Key Concept

Do not use only relay/restream. Relay cannot burn overlays into the video. The final stream must be created by a cloud-side compositor page that renders camera tracks and overlay elements together.

## First POC Target

- 2 mobile cameras
- 1 mobile director
- switch between camera 1 and camera 2
- show scoreboard overlay
- verify compositor/recording output includes overlay
