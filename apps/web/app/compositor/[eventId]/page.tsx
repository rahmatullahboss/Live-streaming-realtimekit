import { ScoreboardOverlay } from "overlay-engine";
import { defaultOverlayConfig } from "shared";

export default function CompositorPage({ params }: { params: { eventId: string } }) {
  const overlay = {
    ...defaultOverlayConfig,
    tournamentName: `Event ${params.eventId}`,
    tickerActive: true,
    tickerText: "Graphics layer ready",
  };

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#02070c" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.55)" }}>
        Waiting for selected camera
      </div>
      <ScoreboardOverlay overlay={overlay} />
    </main>
  );
}
