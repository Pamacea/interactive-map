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

const PARTICLE_COUNT = 15;
const FRAME_THROTTLE = 4;
const ANIMATION_DELAY = 500;

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const frameRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInViewRef = useRef(isInView);

  // Keep ref in sync with state
  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Intersection Observer to pause animation when not visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observerRef.current.observe(canvas);

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
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 5 + 3,
        opacity: Math.random() * 0.4 + 0.2,
        rune: RUNES[Math.floor(Math.random() * RUNES.length)],
      });
    }

    particlesRef.current = particles;

    // Pre-set font to avoid repeated changes
    const fontSize = 14;

    const startTimer = setTimeout(() => {
      setIsVisible(true);
      const animate = () => {
        // Skip animation when not in view (performance optimization)
        if (!isInViewRef.current) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        frameRef.current++;

        if (frameRef.current % FRAME_THROTTLE === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.font = `${fontSize}px "Cinzel", serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
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
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: isVisible ? 0.5 : 0, transition: "opacity 0.5s ease-in", zIndex: 1 }}
    />
  );
}
