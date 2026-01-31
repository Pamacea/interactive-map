"use client";

import { Map } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingCard {
  id: number;
  size: number;
  x: number;
  y: number;
  rotation: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
}

const cards: FloatingCard[] = [
  { id: 1, size: 280, x: 0, y: 0, rotation: 6, speedX: 0.3, speedY: 0.2, rotationSpeed: 0.5 },
  { id: 2, size: 240, x: 0, y: 0, rotation: -4, speedX: -0.25, speedY: 0.35, rotationSpeed: -0.3 },
  { id: 3, size: 200, x: 0, y: 0, rotation: 8, speedX: 0.2, speedY: -0.3, rotationSpeed: 0.4 },
  { id: 4, size: 180, x: 0, y: 0, rotation: -6, speedX: -0.35, speedY: -0.25, rotationSpeed: -0.6 },
  { id: 5, size: 160, x: 0, y: 0, rotation: 5, speedX: 0.15, speedY: 0.4, rotationSpeed: 0.35 },
];

interface CardPosition {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export function FloatingCards() {
  const [positions, setPositions] = useState<CardPosition[]>(() =>
    cards.map((card) => ({
      id: card.id,
      x: 0,
      y: 0,
      rotation: card.rotation,
    }))
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPositions(
      cards.map((card) => ({
        id: card.id,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        rotation: card.rotation,
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const card = cards.find((c) => c.id === pos.id)!;
          const newX = pos.x + card.speedX;
          const newY = pos.y + card.speedY;
          const newRotation = pos.rotation + card.rotationSpeed;

          const boundedX = Math.max(-80, Math.min(80, newX));
          const boundedY = Math.max(-80, Math.min(80, newY));

          const shouldReverseX = boundedX !== newX;
          const shouldReverseY = boundedY !== newY;

          return {
            id: pos.id,
            x: shouldReverseX ? pos.x - card.speedX : boundedX,
            y: shouldReverseY ? pos.y - card.speedY : boundedY,
            rotation: newRotation,
          };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square  mx-auto">
      <div className="absolute inset-0 bg-accent-gold/10 rounded-xl blur-3xl" />

      {cards.map((card, index) => {
        const pos = positions.find((p) => p.id === card.id)!;
        const isMain = index === 0;

        return (
          <div
            key={card.id}
            className={`absolute rounded-lg bg-gradient-to-br from-background-card via-background-elevated to-background-card border border-border-subtle overflow-hidden transition-all duration-75 ease-linear will-change-transform ${isMain ? "shadow-2xl" : "shadow-xl"}`}
            style={{
              width: `${card.size}px`,
              height: `${card.size}px`,
              left: `calc(50% - ${card.size / 2}px + ${pos.x}px)`,
              top: `calc(50% - ${card.size / 2}px + ${pos.y}px)`,
              transform: `rotate(${pos.rotation}deg)`,
              zIndex: cards.length - index,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent" />

            <div className="absolute inset-3 rounded-lg bg-gradient-to-br from-background-base to-background-card border border-border-subtle/50 flex items-center justify-center">
              <div className="text-center">
                <Map
                  className="w-12 h-12 text-accent-gold/60 mx-auto mb-3"
                  strokeWidth={0.75}
                  style={{ width: `${card.size * 0.1}px`, height: `${card.size * 0.1}px` }}
                />
                <div className="space-y-1.5">
                  <div
                    className="bg-accent-gold/20 rounded-full mx-auto"
                    style={{ width: `${card.size * 0.3}px`, height: `${card.size * 0.015}px` }}
                  />
                  <div
                    className="bg-border-subtle rounded-full mx-auto"
                    style={{ width: `${card.size * 0.25}px`, height: `${card.size * 0.015}px` }}
                  />
                  <div
                    className="bg-border-subtle rounded-full mx-auto"
                    style={{ width: `${card.size * 0.28}px`, height: `${card.size * 0.015}px` }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background-card via-background-card/80 to-transparent" />

            <div
              className="absolute pointer-events-none"
              style={{
                width: `${card.size * 0.4}px`,
                height: "2px",
                background: `linear-gradient(to left, transparent, rgba(212, 175, 55, 0.6), transparent)`,
                left: `-${card.size * 0.4}px`,
                top: "50%",
                transform: "rotate(-15deg)",
                filter: "blur(1px)",
              }}
            />

            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                width: "4px",
                height: "4px",
                background: "rgba(212, 175, 55, 0.8)",
                left: `-${card.size * 0.15}px`,
                top: "45%",
                filter: "blur(0.5px)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
