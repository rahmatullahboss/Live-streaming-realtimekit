# Source Repo Notes

Source repo reviewed: `rahmatullahboss/Live-streaming-compositor`.

## What was reused

- React Router route shape
- Camera route idea
- Director route idea
- Compositor route idea
- Score control route idea
- Overlay data model
- External graphics URL support
- Scoreboard, logo, sponsor, ticker concepts
- Cloudflare Worker style backend

## What changed

The old repo used raw Cloudflare Realtime SFU plus browser-side mixing and a VPS relay with ffmpeg.

This repo should move the backend flow to RealtimeKit:

- RealtimeKit meeting creation
- RealtimeKit participant tokens
- RealtimeKit custom recording or livestream export
- Custom compositor route as the recording layout URL

## Keep as fallback

If RealtimeKit custom recording/export cannot support the production layout well enough, keep the old raw SFU plus relay design as fallback.
