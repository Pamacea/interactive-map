"use client";

const particleColors = [
  "bg-accent-gold",
  "bg-particle-purple",
  "bg-particle-blue",
  "bg-particle-emerald",
  "bg-particle-amber",
  "bg-particle-rose",
  "bg-particle-cyan",
  "bg-particle-violet"
];

export function WordParticles() {
  return (
    <>
      {Array.from({ length: 500 }).map((_, i) => {
        const color = particleColors[i % particleColors.length];
        const size = 1 + Math.random() * 2;

        return (
          <div
            key={i}
            className={`absolute rounded-full ${color}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 140 - 20}%`,
              top: `${Math.random() * 140 - 20}%`,
              opacity: 0.2 + Math.random() * 0.5,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        );
      })}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(5px, -5px) scale(1.3);
            opacity: 0.6;
          }
          50% {
            transform: translate(-3px, 3px) scale(0.7);
            opacity: 0.4;
          }
          75% {
            transform: translate(4px, -4px) scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  );
}
