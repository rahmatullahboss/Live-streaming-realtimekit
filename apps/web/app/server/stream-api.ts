import type { Hono } from "hono";
import type { Env } from "./api";

async function callKit<T>(env: Env, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/realtime/kit/${env.CLOUDFLARE_REALTIMEKIT_APP_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.errors?.[0]?.message ?? json.message ?? `RealtimeKit error ${res.status}`);
  }
  return json.data as T;
}

function origin(req: Request, env: Env) {
  return env.PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
}

export function registerStreamRoutes(app: Hono<{ Bindings: Env }>) {
  app.post("/api/events/:eventId/recording/start", async (c) => {
    const meetingId = c.req.param("eventId");
    const body = await c.req.json().catch(() => ({}));
    const rtmpUrl = String(body.rtmpUrl ?? "").trim();
    if (!rtmpUrl) return c.json({ error: "rtmpUrl is required" }, 400);

    const recorder = await callKit<any>(c.env, `/meetings/${meetingId}/participants`, {
      method: "POST",
      body: JSON.stringify({
        custom_participant_id: String(body.recorderId ?? `recorder-${crypto.randomUUID()}`),
        preset_name: c.env.REALTIMEKIT_RECORDER_PRESET_NAME || "recorder",
        name: "Cloud Recorder",
      }),
    });

    const customUrl = `${origin(c.req.raw, c.env)}/compositor/${meetingId}?token=${encodeURIComponent(recorder.token)}`;

    const item = await callKit<any>(c.env, "/recordings", {
      method: "POST",
      body: JSON.stringify({
        meeting_id: meetingId,
        url: customUrl,
        rtmp_out_config: { rtmp_url: rtmpUrl },
        file_name_prefix: String(body.fileNamePrefix ?? `event-${meetingId}`),
        max_seconds: Number(body.maxSeconds ?? 10800),
        realtimekit_bucket_config: { enabled: body.storeRecording !== false },
        video_config: {
          codec: "H264",
          width: Number(body.width ?? 1280),
          height: Number(body.height ?? 720),
          export_file: body.exportFile !== false,
        },
      }),
    });

    return c.json({ customUrl, meetingId, recorder, recording: item });
  });

  app.post("/api/recordings/:recordingId/stop", async (c) => {
    const item = await callKit<any>(c.env, `/recordings/${c.req.param("recordingId")}`, {
      method: "PUT",
      body: JSON.stringify({ action: "stop" }),
    });
    return c.json({ recording: item });
  });
}
