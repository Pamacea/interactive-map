export function LayoutBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-linear-to-br from-background-base via-background-elevated to-background-base" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1),transparent_50%)]" />
      <div className="absolute top-2/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-3/4 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl animate-pulse delay-1000" />
    </>
  );
}