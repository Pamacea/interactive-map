import { ArrowRight, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
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
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-card border border-accent-gold/30">
      <Sparkles className="w-4 h-4 text-accent-gold" />
      <span className="text-sm font-display text-accent-gold">World Building Evolved</span>
    </div>
  );
}

function HeroTitle() {
  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-wide">
      <span className="text-text-primary">Craft Epic </span>
      <span className="text-gradient">Fantasy Worlds</span>
    </h1>
  );
}

function HeroDescription() {
  return (
    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
      Build immersive interactive maps for your RPG campaigns, fantasy novels, and game worlds.
      Inspired by the greatest fantasy realms.
    </p>
  );
}

function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
      <Button size="lg" variant="primary" className="group">
        <Sparkles className="w-5 h-5" />
        Create Your World
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
      <Button size="lg" variant="secondary" className="group">
        <Globe className="w-5 h-5" />
        Explore Worlds
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}

function HeroStats() {
  return (
    <div className="flex items-center justify-center gap-8 pt-8">
      <StatItem value="10K+" label="Worlds Created" />
      <div className="w-px h-12 bg-border-subtle" />
      <StatItem value="50K+" label="Active Users" />
      <div className="w-px h-12 bg-border-subtle" />
      <StatItem value="1M+" label="Map Pins" />
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-display font-bold text-accent-gold">{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
    </div>
  );
}
