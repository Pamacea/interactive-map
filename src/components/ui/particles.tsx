"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rune: string;
}

// Runes nordiques pour l'effet fantasy
const RUNES = ["ᛟ", "ᛞ", "ᛃ", "ᛊ", "ᛇ", "ᛒ", "ᛘ", "ᛏ", "ᛖ", "ᛜ", "ᛣ"];

const PARTICLE_COUNT = 30;
const FRAME_THROTTLE = 3;
const ANIMATION_DELAY = 500;

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const frameRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 6 + 4,
        opacity: Math.random() * 0.5 + 0.3,
        rune: RUNES[Math.floor(Math.random() * RUNES.length)],
      });
    }

    particlesRef.current = particles;

    const startTimer = setTimeout(() => {
      setIsVisible(true);
      const animate = () => {
        frameRef.current++;

        if (frameRef.current % FRAME_THROTTLE === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.font = `${particle.size}px "Cinzel", serif`;
            ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(particle.rune, particle.x, particle.y);
          });
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    }, ANIMATION_DELAY);

    return () => {
      clearTimeout(startTimer);
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: isVisible ? 0.6 : 0, transition: "opacity 0.5s ease-in", zIndex: 1 }}
    />
  );
}
