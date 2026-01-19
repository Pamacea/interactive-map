"use client";

import { useMemo } from "react";

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

// Generate deterministic particle data using seed-based approach
function generateParticleData(count: number) {
  return Array.from({ length: count }, (_, i) => {
    // Use a simple seed based on index for deterministic "random" values
    const seed = i * 9301 + 49297;
    const random = ((seed % 233280) / 233280);

    return {
      id: i,
      color: particleColors[i % particleColors.length],
      size: 1 + ((i * 17) % 20) / 10, // Deterministic size between 1-3
      left: ((i * 37) % 140) - 20, // Deterministic position -20 to 120
      top: ((i * 53) % 140) - 20,
      opacity: 0.2 + ((i * 7) % 50) / 100, // Deterministic opacity 0.2-0.7
      animationDuration: 2 + ((i * 11) % 30) / 10, // 2-5 seconds
      animationDelay: ((i * 13) % 30) / 10 // 0-3 seconds
    };
  });
}

export function WordParticles() {
  const particles = useMemo(() => generateParticleData(500), []);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            animation: `float ${particle.animationDuration}s ease-in-out infinite`,
            animationDelay: `${particle.animationDelay}s`
          }}
        />
      ))}

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
