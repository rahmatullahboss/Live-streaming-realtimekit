# RealtimeKit Setup Plan

## Direction

Use the existing React Router style frontend from the compositor project. Do not convert the UI to Next.js.

RealtimeKit is used for the meeting/session layer:

- camera participant token
- director participant token
- recorder/custom recording participant
- recording or livestream export with custom layout URL

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
POST /api/events/:eventId/participants
POST /api/events/:eventId/recording/start
```

## Required Environment

```txt
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_REALTIMEKIT_APP_ID=
CLOUDFLARE_API_TOKEN=
REALTIMEKIT_CAMERA_PRESET_NAME=camera
REALTIMEKIT_DIRECTOR_PRESET_NAME=director
REALTIMEKIT_RECORDER_PRESET_NAME=recorder
```

## Implementation Notes

1. Create a meeting for each event.
2. Add camera participants with camera preset and return authToken.
3. Add director participant with director preset and return authToken.
4. Start recording or livestream export with the custom URL:

```txt
https://your-domain.com/compositor/:eventId
```

5. The custom URL must render the selected camera layout plus overlay graphics.
6. Score route updates overlay state used by the compositor route.

## Why custom recording URL is required

Relay alone forwards video but does not render scoreboard, logos, banners, ticker, or external graphics into the final stream. The compositor route is the visual layout that RealtimeKit recording/export should capture.
