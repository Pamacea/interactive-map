import { ArrowRight, Sparkles, Globe, Map } from "lucide-react";
import { MetallicButton } from "@/components/ui/metallic-button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-4 overflow-hidden">
      {/* Max-width container - OBLIGATORY */}
      <div className="w-full max-w-[1440px] mx-auto">
        {/* 60/40 asymmetric grid layout - OBLIGATORY */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-x-8 gap-y-12 items-center">

          {/* LEFT COLUMN (60%) - Information - LEFT ALIGNED */}
          <div className="flex flex-col items-start text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background-card/80 backdrop-blur-md border border-accent-gold/30 shadow-lg mb-8">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-display font-semibold text-accent-gold tracking-wide">
                World Building Evolved
              </span>
            </div>

            {/* H1 - text-7xl - Maximum size */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-wide leading-tight text-text-primary mb-6">
              Craft Epic
              <br />
              <span className="bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold bg-clip-text text-transparent">
                Fantasy Worlds
              </span>
            </h1>

            {/* Body - text-base - Second size */}
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mb-8">
              Build immersive interactive maps for your RPG campaigns, fantasy novels, and game worlds.
              <span className="block mt-2 text-accent-gold/80">Inspired by the greatest fantasy realms.</span>
            </p>

            {/* CTA Buttons - Left aligned with text */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <MetallicButton variant="gold" size="lg" className="rounded-lg">
                <Sparkles className="w-5 h-5" />
                Create Your World
                <ArrowRight className="w-5 h-5" />
              </MetallicButton>
              <MetallicButton variant="silver" size="lg" className="rounded-lg">
                <Globe className="w-5 h-5" />
                Explore Worlds
                <ArrowRight className="w-5 h-5" />
              </MetallicButton>
            </div>

            {/* Stats - Left aligned, horizontal layout */}
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              <div>
                <div className="text-2xl font-display font-semibold text-gradient">10K+</div>
                <div className="text-sm text-text-muted mt-1">Worlds Created</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border-subtle" />
              <div>
                <div className="text-2xl font-display font-semibold text-gradient">50K+</div>
                <div className="text-sm text-text-muted mt-1">Active Users</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border-subtle" />
              <div>
                <div className="text-2xl font-display font-semibold text-gradient">1M+</div>
                <div className="text-sm text-text-muted mt-1">Map Pins</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (40%) - Visual signal */}
          <div className="relative flex items-center justify-center">
            {/* Placeholder for visual element */}
            <div className="relative w-full aspect-square max-w-sm rounded-2xl bg-gradient-to-br from-background-card to-background-elevated border border-border-subtle overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

              {/* Centered map icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-gold/20 blur-3xl rounded-full" />
                  <Map className="relative w-32 h-32 text-accent-gold" strokeWidth={1} />
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-12 right-12 w-16 h-16 rounded-lg bg-accent-gold/10 border border-accent-gold/30" />
              <div className="absolute bottom-12 left-12 w-12 h-12 rounded-md bg-accent-gold/10 border border-accent-gold/30" />
              <div className="absolute top-1/2 right-8 w-8 h-8 rounded-md bg-accent-gold/10 border border-accent-gold/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
