# POC Checklist

## Phase 1: Basic Event

- [ ] Create event model
- [ ] Create camera participant token
- [ ] Create director participant token
- [ ] Create compositor URL
- [ ] Store event layout state

## Phase 2: Camera Page

- [ ] Join RealtimeKit meeting from mobile browser
- [ ] Request camera and microphone permission
- [ ] Publish camera stream
- [ ] Show connection status
- [ ] Show camera name and role

## Phase 3: Director Dashboard

- [ ] Show camera list
- [ ] Show previews
- [ ] Select active camera
- [ ] Switch layout
- [ ] Update team names
- [ ] Update scores
- [ ] Toggle sponsor banner
- [ ] Toggle watermark

## Phase 4: Compositor Page

- [ ] Render 16:9 output
- [ ] Subscribe to selected camera tracks
- [ ] Render active layout
- [ ] Render scoreboard
- [ ] Render lower banner
- [ ] Render watermark
- [ ] Listen to layout state changes in real time

## Phase 5: Export Test

- [ ] Start recording or livestream export
- [ ] Use custom compositor URL
- [ ] Verify final output contains overlay
- [ ] Test RTMP output to YouTube
- [ ] Test RTMP output to Facebook

## Phase 6: Field Test

- [ ] Test over 4G/5G mobile network
- [ ] Test camera reconnect
- [ ] Test director switching latency
- [ ] Test 720p fallback
- [ ] Test 2 hour event stability
