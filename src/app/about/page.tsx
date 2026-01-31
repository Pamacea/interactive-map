import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";

export default function AboutPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-void ml-16 sm:ml-20">
        {/* Decorative header */}
        <div className="border-b border-iron pt-16">
          <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent-gold-dark opacity-50 text-2xl">ᛟ</span>
              <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/50 to-transparent" />
            </div>
            <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-4">
              ABOUT THE PLATFORM
            </p>
            <h1 className="font-display-ornate text-5xl sm:text-6xl text-accent-gold tracking-wider">
              About Genesis
            </h1>
            <p className="font-fell text-xl text-bone-dark mt-6 leading-relaxed max-w-3/5">
              The definitive platform for crafting immersive fantasy maps, designed for RPG campaigns,
              novels, and game worlds.
            </p>
          </div>
        </div>

        <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent-gold-dark opacity-50 text-xl">I</span>
                <h2 className="font-display text-3xl text-bone">Our Mission</h2>
              </div>
              <p className="font-fell text-bone-dark leading-relaxed">
                Genesis empowers storytellers, game masters, and world-builders to create stunning,
                interactive fantasy maps. We believe that every great story begins with a great world,
                and we&apos;re here to help you build yours.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent-gold-dark opacity-50 text-xl">II</span>
                <h2 className="font-display text-3xl text-bone">What We Offer</h2>
              </div>
              <ul className="space-y-4 font-fell text-bone-dark">
                <li className="flex items-start gap-4">
                  <span className="text-accent-gold mt-1">ᚠ</span>
                  <span>Intuitive map creation tools designed for fantasy worlds</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent-gold mt-1">ᚢ</span>
                  <span>Rich location system with pins, lore, and custom markers</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent-gold mt-1">ᚦ</span>
                  <span>Collaborative features for co-creation sessions</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-accent-gold mt-1">ᚨ</span>
                  <span>Beautiful export options for integration into your projects</span>
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent-gold-dark opacity-50 text-xl">III</span>
                <h2 className="font-display text-3xl text-bone">Our Community</h2>
              </div>
              <p className="font-fell text-bone-dark leading-relaxed">
                Join thousands of creators who have already built over 10,000 worlds and placed more than
                1 million locations. From intimate novels to epic RPG campaigns, Genesis is the canvas
                for your imagination.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-accent-gold-dark opacity-50 text-xl">IV</span>
                <h2 className="font-display text-3xl text-bone">Contact Us</h2>
              </div>
              <p className="font-fell text-bone-dark leading-relaxed">
                Have questions, feedback, or ideas? We&apos;d love to hear from you. Reach out to us at{' '}
                <a href="mailto:hello@genesis.com" className="text-accent-gold hover:underline">
                  hello@genesis.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <div className="ml-16 sm:ml-20">
        <Footer />
      </div>
    </>
  );
}
