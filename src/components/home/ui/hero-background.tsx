export function HeroBackground() {
  return (
    <>
      {/* Base linear background */}
      <div className="absolute inset-0 bg-linear-to-br from-background-base via-background-elevated to-background-base" />

      {/* Animated linear overlays */}
      <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-linear-stops))] from-accent-gold/5 via-background-base/0 to-background-base/0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-linear(ellipse_at_bottom_right,var(--tw-linear-stops))] from-accent-gold/3 via-background-base/0 to-background-base/0 opacity-40" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-accent-gold/3 rounded-full blur-[150px] animate-pulse delay-1000" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-linear(to right, currentColor 1px, transparent 1px),
            linear-linear(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-linear-to-b from-background-base/0 via-background-base/0 to-background-base/80" />
    </>
  );
}
