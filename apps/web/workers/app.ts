import { Hono } from "hono";

export type Env = {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_REALTIMEKIT_APP_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  REALTIMEKIT_CAMERA_PRESET_NAME?: string;
  REALTIMEKIT_DIRECTOR_PRESET_NAME?: string;
  REALTIMEKIT_RECORDER_PRESET_NAME?: string;
  PUBLIC_APP_URL?: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  errors?: Array<{ message?: string }>;
  message?: string;
};

type Meeting = {
  id: string;
  title?: string;
  status?: string;
};

type Participant = {
  id: string;
  token: string;
  custom_participant_id: string;
  preset_name: string;
  name?: string;
};

type Recording = {
  id: string;
  status?: string;
  download_url?: string;
  session_id?: string;
};

const app = new Hono<{ Bindings: Env }>();

function requireEnv(c: { env: Env }) {
  const accountId = c.env.CLOUDFLARE_ACCOUNT_ID;
  const appId = c.env.CLOUDFLARE_REALTIMEKIT_APP_ID;
  const apiToken = c.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !appId || !apiToken) {
    throw new Error("Missing Cloudflare RealtimeKit environment variables.");
  }

  return { accountId, appId, apiToken };
}

function baseUrl(c: { env: Env }) {
  const { accountId, appId } = requireEnv(c);
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/realtime/kit/${appId}`;
}

async function realtimeKitFetch<T>(c: { env: Env }, path: string, init?: RequestInit): Promise<T> {
  const { apiToken } = requireEnv(c);
  const response = await fetch(`${baseUrl(c)}${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok || payload.success === false) {
    const message = payload.errors?.[0]?.message ?? payload.message ?? `RealtimeKit request failed: ${response.status}`;
    throw new Error(message);
  }

  return payload.data as T;
}

function publicOrigin(request: Request, env: Env) {
  return env.PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(request.url).origin;
}

app.get("/api/health", (c) => c.json({ ok: true, provider: "realtimekit" }));

app.post("/api/events", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const title = String(body.title ?? `Live Event ${Date.now()}`);
  const rtmpUrl = String(body.rtmpUrl ?? "").trim();

  const meeting = await realtimeKitFetch<Meeting>(c, "/meetings", {
    method: "POST",
    body: JSON.stringify({
      title,
      persist_chat: false,
      record_on_start: false,
      live_stream_on_start: false,
      recording_config: rtmpUrl
        ? {
            live_streaming_config: { rtmp_url: rtmpUrl },
            video_config: { codec: "H264", width: 1280, height: 720, export_file: true },
            max_seconds: Number(body.maxSeconds ?? 10800),
          }
        : undefined,
    }),
  });

  return c.json({ event: { id: meeting.id, title, meeting } });
});

app.post("/api/events/:eventId/participants", async (c) => {
  const meetingId = c.req.param("eventId");
  const body = await c.req.json().catch(() => ({}));
  const role = String(body.role ?? "camera");
  const presetName =
    role === "director"
      ? c.env.REALTIMEKIT_DIRECTOR_PRESET_NAME || "director"
      : role === "recorder"
        ? c.env.REALTIMEKIT_RECORDER_PRESET_NAME || "recorder"
        : c.env.REALTIMEKIT_CAMERA_PRESET_NAME || "camera";

  const customParticipantId = String(body.customParticipantId ?? `${role}-${crypto.randomUUID()}`);
  const participant = await realtimeKitFetch<Participant>(c, `/meetings/${meetingId}/participants`, {
    method: "POST",
    body: JSON.stringify({
      custom_participant_id: customParticipantId,
      preset_name: presetName,
      name: String(body.name ?? role),
      picture: body.picture ? String(body.picture) : undefined,
    }),
  });

  return c.json({ meetingId, participant, token: participant.token });
});

app.post("/api/events/:eventId/recording/start", async (c) => {
  const meetingId = c.req.param("eventId");
  const body = await c.req.json().catch(() => ({}));
  const rtmpUrl = String(body.rtmpUrl ?? "").trim();

  if (!rtmpUrl) {
    return c.json({ error: "rtmpUrl is required." }, 400);
  }

  const recorder = await realtimeKitFetch<Participant>(c, `/meetings/${meetingId}/participants`, {
    method: "POST",
    body: JSON.stringify({
      custom_participant_id: String(body.recorderId ?? `recorder-${crypto.randomUUID()}`),
      preset_name: c.env.REALTIMEKIT_RECORDER_PRESET_NAME || "recorder",
      name: "Cloud Recorder",
    }),
  });

  const customUrl = `${publicOrigin(c.req.raw, c.env)}/compositor/${meetingId}?token=${encodeURIComponent(recorder.token)}`;

  const recording = await realtimeKitFetch<Recording>(c, "/recordings", {
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

  return c.json({ customUrl, meetingId, recorder, recording });
});

app.post("/api/recordings/:recordingId/stop", async (c) => {
  const recordingId = c.req.param("recordingId");
  const recording = await realtimeKitFetch<Recording>(c, `/recordings/${recordingId}`, {
    method: "PUT",
    body: JSON.stringify({ action: "stop" }),
  });

  return c.json({ recording });
});

export default app;
