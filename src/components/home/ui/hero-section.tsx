import { ArrowRight, Sparkles, Globe } from "lucide-react";
import { MetallicButton } from "@/components/ui/metallic-button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-center space-y-8 sm:space-y-12">
          <HeroBadge />
          <HeroTitle />
          <HeroDescription />
          <HeroCTA />
          <HeroStats />
        </div>
      </div>
    </section>
  );
}

function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-background-card/80 backdrop-blur-md border border-accent-gold/30 shadow-lg">
      <Sparkles className="w-4 h-4 text-accent-gold" />
      <span className="text-sm font-display font-semibold text-accent-gold tracking-wide">
        World Building Evolved
      </span>
    </div>
  );
}

function HeroTitle() {
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-wide leading-tight">
      <span className="block text-text-primary mb-2">Craft Epic</span>
      <span className="block bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold bg-clip-text text-transparent">
        Fantasy Worlds
      </span>
    </h1>
  );
}

function HeroDescription() {
  return (
    <p className="text-base sm:text-lg md:text-xl text-text-secondary mx-auto leading-relaxed px-4">
      Build immersive interactive maps for your RPG campaigns, fantasy novels,
      and game worlds.
      <span className="block mt-2 text-accent-gold/80">
        Inspired by the greatest fantasy realms.
      </span>
    </p>
  );
}

function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4 px-4">
      <MetallicButton
        variant="gold"
        size="lg"
        className="group w-full sm:w-auto"
      >
        <Sparkles className="w-5 h-5" />
        Create Your World
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </MetallicButton>
      <MetallicButton
        variant="silver"
        size="lg"
        className="group w-full sm:w-auto"
      >
        <Globe className="w-5 h-5" />
        Explore Worlds
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </MetallicButton>
    </div>
  );
}

function HeroStats() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-8 sm:pt-12 px-4">
      <StatItem value="10K+" label="Worlds Created" />
      <div className="hidden sm:block w-px h-12 bg-border-subtle" />
      <StatItem value="50K+" label="Active Users" />
      <div className="hidden sm:block w-px h-12 bg-border-subtle" />
      <StatItem value="1M+" label="Map Pins" />
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-accent-gold to-accent-gold-light bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}
