"use client";

export function WordParticles() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-accent-gold rounded-full"
          style={{
            left: `${Math.random() * 120 - 10}%`,
            top: `${Math.random() * 120 - 10}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) scale(1.2);
          }
          50% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) scale(0.8);
          }
          75% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) scale(1.1);
          }
        }
      `}</style>
    </>
  );
}
