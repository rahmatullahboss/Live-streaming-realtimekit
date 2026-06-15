import { RealtimeKitJoin } from "../../../../components/RealtimeKitJoin";

export default function CameraPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token ?? "";

  if (!token) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Camera Join</h1>
        <p>Missing participant token. Generate it from your backend Add Participant API first.</p>
      </main>
    );
  }

  return <RealtimeKitJoin authToken={token} audio video />;
}
