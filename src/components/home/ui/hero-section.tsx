"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { MetallicButton } from "@/components/ui/metallic-button";
import { FloatingCards } from "./floating-cards";
import { WordParticles } from "./word-particle";
import { useState, useEffect } from "react";

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
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const interval = setInterval(() => {
      setIsAnimating(true);
      timeoutId = setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId); // ✅ Clean up nested timeout
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center  px-6 bg-background-base ">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-accent-gold/3 rounded-full blur-[150px]" />
        <WordParticles />
      </div>

      <div className="relative w-full max-w-4/5 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-16 items-center px-4">

          <div className="flex flex-col gap-12">

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-semibold tracking-tight text-text-primary leading-[1.05]">
              Build worlds
              <br />
              <span className="relative inline-block min-h-[2.3em]">
                <span
                  className={`absolute left-0 top-0 text-accent-gold transition-all duration-500 ${
                    isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
                <span className="invisible block">{rotatingWords[currentWordIndex]}</span>
              </span>
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              The definitive platform for crafting immersive fantasy maps. Designed for RPG campaigns, novels, and game worlds.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/create">
                <MetallicButton variant="gold" size="lg">
                  Start Creating
                  <ArrowRight className="w-5 h-5" />
                </MetallicButton>
              </Link>
              <Link href="/explore">
                <MetallicButton variant="silver" size="lg">
                  <Map className="w-5 h-5" />
                  Browse Maps
                </MetallicButton>
              </Link>
            </div>

            <div className="flex items-center gap-16 pt-8 border-t-2 border-t-accent-gold-dark">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                  }}
                  onMouseEnter={() => setHoveredStat(stat.label)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div
                    className={`text-3xl font-display font-semibold transition-all duration-300 ${
                      hoveredStat === stat.label
                        ? "text-accent-gold scale-110"
                        : "text-text-primary"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <style jsx>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes fall {
                to {
                  transform: translateY(150px);
                }
              }
            `}</style>

          </div>

          <div className="relative flex items-center justify-center">
            <FloatingCards />
          </div>

        </div>
      </div>
    </section>
  );
}
