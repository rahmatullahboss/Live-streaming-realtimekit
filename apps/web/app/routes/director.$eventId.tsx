import { useSearchParams } from "react-router";
import { RealtimeKitJoin } from "../components/RealtimeKitJoin";

export default function DirectorRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  if (!token) {
    return (
      <main className="page">
        <section className="card">
          <h1>Director</h1>
          <p>Generate a director participant token from the backend and open this route with ?token=TOKEN.</p>
          <p>Next step: add scene switch, score controls, graphics controls, and stream start actions.</p>
        </section>
      </main>
    );
  }

  return <RealtimeKitJoin authToken={token} audio={false} video={false} />;
}
