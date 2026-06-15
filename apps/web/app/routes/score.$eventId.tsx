export default function ScoreRoute() {
  return (
    <main className="page">
      <section className="card">
        <h1>Score Control</h1>
        <p>This route will update overlay state for the compositor route.</p>
        <button type="button">Team A +1</button>
        <button type="button" style={{ marginLeft: 8 }}>Team B +1</button>
      </section>
    </main>
  );
}
