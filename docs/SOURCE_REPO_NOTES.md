# Source Repo Notes

Source repo reviewed: `rahmatullahboss/Live-streaming-compositor`.

## Reused from source frontend

- React Router route shape
- Camera route idea
- Director route idea
- Compositor route idea
- Score control route idea
- Overlay data model
- External graphics URL support
- Scoreboard, logo, sponsor, ticker concepts
- Cloudflare Worker style backend

## Removed from source architecture

The old source repo had raw SFU pull logic and a relay path. This repo does not use that path.

## Current architecture

RealtimeKit handles the live meeting, participant tokens, custom layout URL, and RTMP export.

The custom layout route is:

```txt
/compositor/:eventId?token=RECORDER_TOKEN
```

The backend starts export with:

```txt
POST /api/events/:eventId/recording/start
```
