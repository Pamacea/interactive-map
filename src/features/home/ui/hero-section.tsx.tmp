"use client";

// import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { CrownButton } from "@/shared/ui/crown-button";
import { useState } from "react";

// Unused import for potential future animation
// import { useEffect } from "react";

const stats = [
  { value: "10K+", label: "Worlds" },
  { value: "50K+", label: "Creators" },
  { value: "1M+", label: "Locations" }
];

const rotatingWords = [
  "worth exploring",
  "that inspire",
  "full of wonder",
  "to remember"
];

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="throne" className="flex flex-col items-center justify-center px-4 py-16 sm:py-20">
      {/* Background glow - optimized: reduced blur from 100px to 60px */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-accent-gold/5 rounded-sm blur-[60px]" />
      </div>

      {/* Crown Symbol */}
      <div className="text-6xl sm:text-8xl text-accent-gold/20 mb-4">
        ♔
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display-ornate font-semibold text-bone text-center leading-tight mb-4 sm:mb-6">
        <span className="block">Build worlds</span>
        <span className="block text-accent-gold">
          <span
            className={`inline-block transition-opacity duration-500 ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
          >
            {rotatingWords[currentWordIndex]}
          </span>
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-bone-dark leading-relaxed font-fell italic text-center mb-6 sm:mb-8">
        The definitive platform for crafting immersive fantasy maps.
        <br />Designed for RPG campaigns, novels, and game worlds.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
        <CrownButton variant="gold" size="lg" href="/create">
          Start Creating <ArrowRight className="w-4 h-4" />
        </CrownButton>
        <CrownButton variant="iron" size="lg" href="/explore">
          <Map className="w-4 h-4" /> Browse Maps
        </CrownButton>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 sm:gap-12 pt-6 border-t border-iron">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl sm:text-2xl font-display-ornate font-semibold text-accent-gold">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-bone-dark mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
