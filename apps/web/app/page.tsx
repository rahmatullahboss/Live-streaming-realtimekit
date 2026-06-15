export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Live Streaming RealtimeKit</h1>
      <p>Mobile camera, mobile director, custom graphics, and RTMP export MVP.</p>
      <ul>
        <li>/camera/[eventId]/[cameraId]</li>
        <li>/director/[eventId]</li>
        <li>/compositor/[eventId]</li>
      </ul>
    </main>
  );
}
