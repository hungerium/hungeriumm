export default function ChineseeGame() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/chinesee/index.html"
        style={{ width: '100vw', height: '100vh', border: 'none', margin: 0, padding: 0 }}
        title="Coffee Checkers - Multiplayer"
        allowFullScreen
      />
    </div>
  );
}


