import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { BookOpen, Map, Users, Sparkles } from "lucide-react";

const features = [
  { icon: Map, title: "Interactive Maps", description: "Place cities, dungeons, and landmarks with custom markers" },
  { icon: BookOpen, title: "Rich Lore System", description: "Document your world's history, characters, and factions" },
  { icon: Users, title: "Share & Collaborate", description: "Publish your worlds or co-create with friends" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <GridBackground />
        <FloatingParticles />
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <AppHeader />
      <main className="min-h-screen ml-16 sm:ml-20 relative z-10">
        {/* Hero Header */}
        <div className="border-b border-iron pt-16">
          <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20 text-center">
            {/* Sparkle Icon */}
            <div className="text-4xl sm:text-5xl text-accent-gold/20 mb-6 flex justify-center">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" strokeWidth={1} />
            </div>

            {/* Decorative Lines */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
              <span className="text-accent-gold-dark opacity-50 text-2xl animate-rune-glow">ᛟ</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
            </div>

            <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-4">
              ABOUT THE PLATFORM
            </p>
            <h1 className="font-display-ornate text-5xl sm:text-6xl text-accent-gold tracking-wider mb-6">
              About Genesis
            </h1>
            <p className="font-fell text-xl text-bone-dark mt-6 leading-relaxed max-w-3/5 mx-auto">
              The definitive platform for crafting immersive fantasy maps, designed for RPG campaigns,
              novels, and game worlds.
            </p>
          </div>
        </div>

        <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-obsidian/40 border border-iron rounded-lg p-6 hover:border-accent-gold/50 transition-all text-center"
              >
                <div className="w-12 h-12 rounded bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-accent-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-bone mb-2">{feature.title}</h3>
                <p className="font-fell text-sm text-bone-dark">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {[
              { numeral: "I", title: "Our Mission", content: "Genesis empowers storytellers, game masters, and world-builders to create stunning, interactive fantasy maps. We believe that every great story begins with a great world, and we're here to help you build yours." },
              { numeral: "II", title: "What We Offer", items: [
                { rune: "ᚠ", text: "Intuitive map creation tools designed for fantasy worlds" },
                { rune: "ᚢ", text: "Rich location system with pins, lore, and custom markers" },
                { rune: "ᚦ", text: "Collaborative features for co-creation sessions" },
                { rune: "ᚨ", text: "Beautiful export options for integration into your projects" },
              ]},
              { numeral: "III", title: "Our Community", content: "Join thousands of creators who have already built over 10,000 worlds and placed more than 1 million locations. From intimate novels to epic RPG campaigns, Genesis is the canvas for your imagination." },
              { numeral: "IV", title: "Contact Us", content: "Have questions, feedback, or ideas? We'd love to hear from you. Reach out to us at" },
            ].map((section, idx) => (
              <section key={idx} className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-accent-gold-dark opacity-40 text-xl w-8">{section.numeral}</span>
                  <h2 className="font-display text-3xl text-bone">{section.title}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/30 to-transparent" />
                </div>

                {section.content ? (
                  <p className="font-fell text-bone-dark leading-relaxed pl-12">
                    {section.content}
                    {section.title === "Contact Us" && (
                      <a href="mailto:hello@genesis.com" className="text-accent-gold hover:underline ml-2">
                        hello@genesis.com
                      </a>
                    )}
                  </p>
                ) : section.items && (
                  <ul className="space-y-3 font-fell text-bone-dark pl-12">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-accent-gold">{item.rune}</span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Seal */}
          <div className="flex justify-center mt-20">
            <div className="w-20 h-20 border-2 border-accent-gold-dark rounded-full flex items-center justify-center animate-seal-pulse">
              <span className="font-display text-[0.5rem] tracking-widest text-accent-gold-dark text-center">
                GENESIS
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Ornate Divider */}
      <div className="ml-16 sm:ml-20 relative z-10">
        <div className="flex items-center gap-4 py-8 border-t border-iron">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          <span className="text-accent-gold-dark opacity-30">ᛟ</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent-gold/30 to-transparent" />
        </div>
        <Footer />
      </div>
    </div>
  );
}
