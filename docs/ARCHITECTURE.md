# Architecture

## Product Type

Browser and mobile first cloud live production platform.

## Roles

### Camera Operator
- Joins from mobile browser.
- Publishes camera and microphone.
- Cannot control scenes or overlays.

### Director
- Joins from mobile browser.
- Sees camera previews.
- Controls active camera, layout, scoreboard, sponsor overlays, and stream status.

### Compositor
- Cloud rendered page used for recording or livestream export.
- Renders the final 16:9 output.
- Includes camera video, scoreboard, logo, banner, timer, and other overlay elements.

## Media Flow

```txt
Camera browser -> WebRTC publish -> RealtimeKit / SFU
Director browser <- preview streams
Compositor page <- selected tracks + overlay state
Compositor output -> RTMP export -> YouTube / Facebook
```

## Control Flow

```txt
Director action
  -> Backend API or WebSocket
  -> Event layout state update
  -> Compositor receives state
  -> Final output changes live
```

## Overlay Rule

Overlay must be rendered inside the compositor page. If overlay is only shown in the director UI, it will not appear in the final RTMP output.

## MVP Layouts

1. Full camera
2. Split screen
3. Picture in picture
4. Scoreboard overlay
5. Sponsor banner
6. Starting soon screen

## Reliability Requirements

- Camera auto reconnect
- Camera drop warning
- Stream health monitor
- Low bandwidth mode
- 720p fallback
- Mobile friendly UI
