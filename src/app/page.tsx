import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, BookOpen, Users, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorldCard } from "@/components/ui/world-card";
import { NavigationBar } from "@/components/ui/navigation-bar";

// Featured worlds data (will come from API later)
const featuredWorlds = [
  {
    id: "1",
    slug: "eldoria-chronicles",
    title: "Eldoria Chronicles",
    description: "A vast high fantasy realm with ancient dragons, magical kingdoms, and epic wars that shaped the continent.",
    pinCount: 247,
    loreCount: 58,
    author: { name: "MythWeaver" },
    isPublic: true,
  },
  {
    id: "2",
    slug: "shadow-veil",
    title: "Shadow Veil",
    description: "Dark fantasy world torn between light and darkness, where demons walk among mortals.",
    pinCount: 189,
    loreCount: 42,
    author: { name: "DarkLord99" },
    isPublic: true,
  },
  {
    id: "3",
    slug: "azure-coast",
    title: "The Azure Coast",
    description: "Tropical archipelago of trading cities, pirates, and ancient sea temples.",
    pinCount: 156,
    loreCount: 35,
    author: { name: "SeaCaptain" },
    isPublic: true,
  },
];

const features = [
  {
    icon: MapPin,
    title: "Interactive Pins",
    description: "Place cities, villages, dungeons, characters, and quest markers with custom icons and colors.",
  },
  {
    icon: BookOpen,
    title: "Rich Lore System",
    description: "Document your world's history, geography, characters, and factions with organized lore entries.",
  },
  {
    icon: Users,
    title: "Share & Collaborate",
    description: "Publish your worlds for others to explore or collaborate with fellow creators.",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description: "Built with modern tech for lightning-fast performance on any device.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Control who sees your worlds with public/private visibility settings.",
  },
  {
    icon: Globe,
    title: "Fantasy Map Styles",
    description: "Beautiful dark theme inspired by your favorite fantasy RPG games.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background-base">
      {/* Navigation */}
      <NavigationBar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-card border border-accent-gold/30">
              <Sparkles className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-display text-accent-gold">World Building Evolved</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-wide">
              <span className="text-text-primary">Craft Epic </span>
              <span className="text-gradient">Fantasy Worlds</span>
            </h1>

            {/* Hero Description */}
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Build immersive interactive maps for your RPG campaigns, fantasy novels, and game worlds.
              Inspired by the greatest fantasy realms.
            </p>

            {/* CTA Buttons */}
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

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-accent-gold">10K+</div>
                <div className="text-sm text-text-muted">Worlds Created</div>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-accent-gold">50K+</div>
                <div className="text-sm text-text-muted">Active Users</div>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-accent-gold">1M+</div>
                <div className="text-sm text-text-muted">Map Pins</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background-elevated">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
              Everything You Need to <span className="text-accent-gold">Build</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Powerful tools for world builders, game masters, and fantasy creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-background-card rounded-lg border border-border-subtle hover:border-accent-gold/30 transition-all duration-300 hover:shadow-glow-subtle"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-accent-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Worlds Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2">
                Featured <span className="text-accent-gold">Worlds</span>
              </h2>
              <p className="text-text-secondary">
                Discover incredible worlds created by our community
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-2 text-accent-gold hover:text-accent-gold-light transition-colors font-display font-medium"
            >
              View All Worlds
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorlds.map((world) => (
              <WorldCard key={world.id} {...world} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                View All Worlds
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background-elevated to-background-base">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Ready to Build Your <span className="text-gradient">Realm?</span>
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of creators bringing their fantasy worlds to life.
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="primary" className="text-lg px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-background-base" />
              </div>
              <span className="text-xl font-display font-bold text-gradient tracking-wider">
                REALM FORGE
              </span>
            </div>

            <div className="flex items-center gap-8 text-sm text-text-secondary">
              <Link href="/about" className="hover:text-accent-gold transition-colors">
                About
              </Link>
              <Link href="/docs" className="hover:text-accent-gold transition-colors">
                Documentation
              </Link>
              <Link href="/privacy" className="hover:text-accent-gold transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent-gold transition-colors">
                Terms
              </Link>
            </div>

            <p className="text-sm text-text-muted">
              © 2026 Realm Forge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
