import { ScoreboardOverlay } from "overlay-engine";
import { defaultOverlayConfig } from "shared";

export default function CompositorRoute() {
  const overlay = {
    ...defaultOverlayConfig,
    tickerActive: true,
    tickerText: "RealtimeKit recording layout preview",
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#02070c", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,.55)" }}>
        Waiting for live camera track
      </div>
      <ScoreboardOverlay overlay={overlay} />
    </main>
  );
}
