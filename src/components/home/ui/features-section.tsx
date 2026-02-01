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
    <section id="oath" className="py-16 sm:py-20 px-4 bg-obsidian border-t border-b border-iron">
      <div className="max-w-3/5 mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display-ornate text-accent-gold tracking-wide mb-4">
            Everything You Need
          </h2>
          <p className="text-sm sm:text-base text-bone-dark font-fell italic">
            Powerful tools for world builders, game masters, and fantasy creators
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 sm:p-6 border border-iron rounded-sm hover:border-accent-gold/50 transition-colors bg-void/30"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-accent-gold/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-display-ornate font-semibold text-bone mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-bone-dark leading-relaxed font-fell">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seal */}
        <div className="flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-accent-gold-dark rounded-sm flex items-center justify-center">
            <span className="font-display text-[0.4rem] sm:text-[0.45rem] tracking-widest text-accent-gold-dark text-center">
              GENESIS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
