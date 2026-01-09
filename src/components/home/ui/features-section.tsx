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
    <section className="relative py-20 sm:py-32 px-4 bg-gradient-to-b from-background-base to-background-elevated">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[length:100px_100px]" />
      <div className="relative flex flex-col items-center">
        <FeaturesHeader />
        <FeaturesGrid />
      </div>
    </section>
  );
}

function FeaturesHeader() {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
        Everything You Need to{" "}
        <span className="bg-gradient-to-r from-accent-gold to-accent-gold-light bg-clip-text text-transparent">
          Build
        </span>
      </h2>
      <p className="text-base sm:text-lg text-text-secondary mx-auto">
        Powerful tools for world builders, game masters, and fantasy creators.
      </p>
    </div>
  );
}

function FeaturesGrid() {
  return (
    <div className="w-full">
      <div className="flex flex-col divide-y divide-border-subtle">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, description }: typeof features[0]) {
  return (
    <div className="flex items-start gap-6 py-8 hover:bg-muted/50 transition-colors duration-200 -mx-4 px-4 rounded-sm">
      <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-accent-gold" />
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-lg sm:text-xl font-display font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
