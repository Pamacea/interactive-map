"use client";

import { lazy, Suspense } from "react";
import { HeroSection } from "@/features/home/ui/hero-section";
import { FeaturesSection } from "@/features/home/ui/features-section";
import { AuthButton } from "@/features/home/ui/auth-button";
import { useCursorTrail } from "@/shared/hooks/use-cursor-trail";
import { useScrollIndicator } from "@/shared/hooks/use-scroll-indicator";

// Lazy load non-critical sections for better initial load performance
const CTASection = lazy(() =>
  import("@/features/home/ui/cta-section").then(m => ({ default: m.CTASection }))
);

const NAV_ITEMS = [
  { id: "throne", label: "HOME", glyph: "I" },
  { id: "oath", label: "FEATURES", glyph: "II" },
  { id: "blood", label: "CREATE", glyph: "III" },
];

export default function Home() {
  useCursorTrail(3);
  const { activeSection, scrollPercent } = useScrollIndicator();
  const thumbPosition = (scrollPercent / 100) * 80;

  return (
    <div className="min-h-screen bg-void text-bone font-fell overflow-x-hidden cursor-crosshair">
      {/* Grain Overlay */}
      <div className="fixed inset-0 bg-grain opacity-[0.04] pointer-events-none z-[9999]" aria-hidden="true" />

      {/* Navigation Latérale Gauche */}
      <nav className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 z-40 bg-gradient-to-b from-obsidian to-transparent border-r border-iron flex flex-col items-center justify-between py-8">
        <div className="text-2xl text-accent-gold-dark opacity-50 animate-rune-glow">ᛟ</div>

        <div className="flex flex-col gap-12">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`w-10 h-10 flex items-center justify-center font-display-ornate text-base border relative transition-all duration-400 group ${
                activeSection === item.id
                  ? "text-accent-gold border-accent-gold bg-accent-gold/10"
                  : "text-bone-dark border-iron hover:text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10"
              }`}
            >
              {item.glyph}
              <span className="absolute left-16 font-display text-[0.6rem] tracking-[0.3em] text-bone-dark opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden sm:inline-block">
                {item.label}
              </span>
            </a>
          ))}
        </div>

        <div className="text-2xl text-accent-gold-dark opacity-50 animate-rune-glow">ᛞ</div>
      </nav>

      {/* Navigation Horizontale Top */}
      <header className="fixed top-0 left-16 sm:left-20 right-0 h-16 z-40 flex items-center justify-between border-b border-iron bg-gradient-to-b from-obsidian to-transparent px-4">
        <div className="w-12 h-full flex items-center justify-center border-x border-iron">
          <span className="text-accent-gold-dark text-lg opacity-60">⚔</span>
        </div>

        <div className="flex items-baseline gap-2 sm:gap-4">
          <span className="font-display text-[0.6rem] tracking-[0.3em] text-bone-dark hidden sm:inline">THE</span>
          <span className="font-display-ornate text-sm tracking-[0.2em] text-accent-gold">GENESIS</span>
          <span className="font-display text-[0.6rem] tracking-[0.3em] text-bone-dark hidden sm:inline">AWAITS</span>
        </div>

        <div className="flex items-center justify-center border-x border-iron px-4">
          <AuthButton />
        </div>
      </header>

      {/* Navigation Latérale Droite - Scroll Indicator */}
      <nav className="fixed right-0 top-0 bottom-0 w-14 sm:w-16 z-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-0.5 h-[100px] bg-iron relative">
            <div
              className="w-1.5 h-5 bg-accent-gold absolute -left-0.5 transition-all duration-300"
              style={{ top: `${thumbPosition}px` }}
            />
          </div>
          <span className="font-display text-[0.5rem] tracking-[0.4em] text-bone-dark [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 hidden sm:block">
            SCROLL
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-16">
        <HeroSection />
        <FeaturesSection />
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <CTASection />
        </Suspense>

        {/* Community Section */}
        <section className="min-h-screen flex items-center justify-center p-6 bg-void">
          <div className="max-w-3/5 mx-auto text-center">
            <p className="font-display text-sm tracking-[0.3em] text-bone-dark mb-4">
              Join thousands of creators
            </p>
            <p className="font-display text-sm tracking-[0.3em] text-bone-dark mb-4">
              Share your fantasy worlds
            </p>
            <p className="font-display text-sm tracking-[0.3em] text-bone-dark mb-8">
              Inspire and be inspired
            </p>
            <p className="font-display text-xs tracking-[0.5em] text-bone-dark mb-4">
              YOUR ADVENTURE BEGINS TODAY
            </p>
            <h2 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold">
              BEGIN NOW
            </h2>
          </div>
        </section>
      </main>
    </div>
  );
}
