export function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(212, 175, 55, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}
