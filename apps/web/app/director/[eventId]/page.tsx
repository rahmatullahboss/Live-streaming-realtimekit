import { RealtimeKitJoin } from "../../../components/RealtimeKitJoin";

export default function DirectorPage({ params, searchParams }: { params: { eventId: string }; searchParams: { token?: string } }) {
  const token = searchParams.token ?? "";

  if (!token) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Director Dashboard</h1>
        <p>Event: {params.eventId}</p>
        <p>Missing director token. Generate it from the backend participant flow.</p>
      </main>
    );
  }

  return <RealtimeKitJoin authToken={token} audio={false} video={false} />;
}
