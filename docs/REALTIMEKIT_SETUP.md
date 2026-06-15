# RealtimeKit Only Setup

## Direction

This repo uses RealtimeKit for the complete live production path. No relay VPS, no ffmpeg VPS, and no separate compositor VPS are part of the primary architecture.

## Flow

```txt
Camera browser -> RealtimeKit meeting
Director browser -> RealtimeKit meeting + control UI
Custom layout URL -> /compositor/:eventId?token=RECORDER_TOKEN
RealtimeKit recording/export -> YouTube or Facebook RTMP
```

## Frontend Routes

```txt
/camera
/director/:eventId
/compositor/:eventId
/score/:eventId
```

## Backend Routes

```txt
GET  /api/health
POST /api/events
POST /api/events/:eventId/participants
POST /api/events/:eventId/recording/start
POST /api/recordings/:recordingId/stop
```

## Required Environment

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_REALTIMEKIT_APP_ID=
CLOUDFLARE_API_TOKEN=
PUBLIC_APP_URL=https://your-domain.com
REALTIMEKIT_CAMERA_PRESET_NAME=camera
REALTIMEKIT_DIRECTOR_PRESET_NAME=director
REALTIMEKIT_RECORDER_PRESET_NAME=recorder
```

## API Mapping

- Create event -> RealtimeKit Create Meeting API
- Create camera/director/recorder token -> RealtimeKit Add Participant API
- Start RTMP stream -> RealtimeKit Start Recording API with `meeting_id`, `url`, and `rtmp_out_config.rtmp_url`
- Stop stream -> RealtimeKit Stop Recording API

## Custom Layout URL

When streaming starts, the backend creates a recorder participant token and generates this URL:

```txt
https://your-domain.com/compositor/:eventId?token=RECORDER_TOKEN
```

RealtimeKit records this URL and sends the result to the RTMP destination. The route renders the meeting view plus scoreboard, sponsor, ticker, logos, and external graphics layer.
