"use client";

import { ArrowRight, Map } from "lucide-react";
import { MetallicButton } from "@/components/ui/metallic-button";
import { FloatingCards } from "./floating-cards";

const stats = [
  { value: "10K+", label: "Worlds" },
  { value: "50K+", label: "Creators" },
  { value: "1M+", label: "Locations" }
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center  px-6 bg-background-base ">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-accent-gold/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-4/5 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-16 items-center px-4">

          <div className="flex flex-col gap-12">

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-semibold tracking-tight text-text-primary leading-[1.05]">
              Build worlds
              <br />
              <span className="text-accent-gold">worth exploring</span>
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              The definitive platform for crafting immersive fantasy maps. Designed for RPG campaigns, novels, and game worlds.
            </p>

            <div className="flex items-center gap-4">
              <MetallicButton variant="gold" size="lg">
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </MetallicButton>
              <MetallicButton variant="silver" size="lg">
                <Map className="w-5 h-5" />
                Browse Maps
              </MetallicButton>
            </div>

            <div className="flex items-center gap-16 pt-8 border-t-2 border-t-accent-gold-dark">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-display font-semibold text-text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>

          <div className="relative flex items-center justify-center">
            <FloatingCards />
          </div>

        </div>
      </div>
    </section>
  );
}
