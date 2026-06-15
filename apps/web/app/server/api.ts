import { Hono } from "hono";
import { registerStreamRoutes } from "./stream-api";

export type Env = {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_REALTIMEKIT_APP_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  REALTIMEKIT_CAMERA_PRESET_NAME?: string;
  REALTIMEKIT_DIRECTOR_PRESET_NAME?: string;
  REALTIMEKIT_RECORDER_PRESET_NAME?: string;
  PUBLIC_APP_URL?: string;
};

const apiApp = new Hono<{ Bindings: Env }>();

function cfg(c: { env: Env }) {
  if (!c.env.CLOUDFLARE_ACCOUNT_ID || !c.env.CLOUDFLARE_REALTIMEKIT_APP_ID || !c.env.CLOUDFLARE_API_TOKEN) {
    throw new Error("Missing RealtimeKit config");
  }
  return {
    accountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    appId: c.env.CLOUDFLARE_REALTIMEKIT_APP_ID,
    token: c.env.CLOUDFLARE_API_TOKEN,
  };
}

async function rk<T>(c: { env: Env }, path: string, init?: RequestInit): Promise<T> {
  const conf = cfg(c);
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${conf.accountId}/realtime/kit/${conf.appId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${conf.token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.errors?.[0]?.message ?? json.message ?? `RealtimeKit error ${res.status}`);
  }
  return json.data as T;
}

apiApp.onError((err, c) => c.json({ error: err.message }, 500));
apiApp.get("/api/health", (c) => c.json({ ok: true, provider: "realtimekit" }));

apiApp.post("/api/events", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const meeting = await rk(c, "/meetings", {
    method: "POST",
    body: JSON.stringify({
      title: String(body.title ?? `Live Event ${Date.now()}`),
      persist_chat: false,
      record_on_start: false,
      live_stream_on_start: false,
      session_keep_alive_time_in_secs: Number(body.sessionKeepAliveSeconds ?? 60),
    }),
  });
  return c.json({ event: meeting });
});

apiApp.post("/api/events/:eventId/participants", async (c) => {
  const meetingId = c.req.param("eventId");
  const body = await c.req.json().catch(() => ({}));
  const role = String(body.role ?? "camera");
  const preset = role === "director"
    ? c.env.REALTIMEKIT_DIRECTOR_PRESET_NAME || "director"
    : role === "recorder"
      ? c.env.REALTIMEKIT_RECORDER_PRESET_NAME || "recorder"
      : c.env.REALTIMEKIT_CAMERA_PRESET_NAME || "camera";
  const participant = await rk(c, `/meetings/${meetingId}/participants`, {
    method: "POST",
    body: JSON.stringify({
      custom_participant_id: String(body.customParticipantId ?? `${role}-${crypto.randomUUID()}`),
      preset_name: preset,
      name: String(body.name ?? role),
    }),
  });
  return c.json({ meetingId, participant, token: (participant as any).token });
});

registerStreamRoutes(apiApp);

export default apiApp;
