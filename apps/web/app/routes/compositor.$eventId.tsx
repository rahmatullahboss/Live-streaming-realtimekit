import { useSearchParams } from "react-router";
import { ScoreboardOverlay } from "overlay-engine";
import { defaultOverlayConfig } from "shared";
import { RealtimeKitJoin } from "../components/RealtimeKitJoin";

export default function CompositorRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const overlay = {
    ...defaultOverlayConfig,
    tickerActive: true,
    tickerText: "RealtimeKit custom recording layout",
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#02070c", overflow: "hidden" }}>
      {token ? (
        <RealtimeKitJoin authToken={token} audio={false} video={false} showSetupScreen={false} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,.55)" }}>
          Missing recorder token
        </div>
      )}
      <ScoreboardOverlay overlay={overlay} />
    </main>
  );
}
