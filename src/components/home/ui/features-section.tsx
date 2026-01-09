import { MapPin, BookOpen, Users, Zap, Shield, Globe } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-background-elevated">
      <div className="max-w-7xl mx-auto">
        <FeaturesHeader />
        <FeaturesGrid />
      </div>
    </section>
  );
}

function FeaturesHeader() {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
        Everything You Need to <span className="text-accent-gold">Build</span>
      </h2>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto">
        Powerful tools for world builders, game masters, and fantasy creators.
      </p>
    </div>
  );
}

function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: typeof features[0]) {
  return (
    <div className="group p-6 bg-background-card rounded-lg border border-border-subtle hover:border-accent-gold/30 transition-all duration-300 hover:shadow-glow-subtle">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-accent-gold" />
      </div>
      <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}
