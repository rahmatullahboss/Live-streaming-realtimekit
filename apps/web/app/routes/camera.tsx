import { RealtimeKitJoin } from "../components/RealtimeKitJoin";

export default function CameraRoute() {
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";

  if (!token) {
    return (
      <main className="page">
        <section className="card">
          <h1>Camera Join</h1>
          <p>Generate a camera participant token from the backend and open /camera?token=TOKEN.</p>
        </section>
      </main>
    );
  }

  return <RealtimeKitJoin authToken={token} audio video />;
}
