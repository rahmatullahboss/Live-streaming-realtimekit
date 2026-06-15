import { Hono } from "hono";

export type Env = {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_REALTIMEKIT_APP_ID: string;
  CLOUDFLARE_API_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/events/:eventId/participants", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json().catch(() => ({}));

  return c.json({
    eventId,
    role: body.role ?? "camera",
    note: "Wire this handler to RealtimeKit Add Participant API and return authToken.",
  });
});

app.post("/api/events/:eventId/recording/start", async (c) => {
  const eventId = c.req.param("eventId");
  const customUrl = `${new URL(c.req.url).origin}/compositor/${eventId}`;

  return c.json({
    eventId,
    customUrl,
    note: "Use this URL when starting RealtimeKit recording or livestream export.",
  });
});

export default app;
