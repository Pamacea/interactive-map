import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";

export default function AboutPage() {
  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-background-base">
        <div className="mx-auto px-6 py-24">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-display font-semibold text-text-primary mb-6">
              About Genesis
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              The definitive platform for crafting immersive fantasy maps, designed for RPG campaigns, novels, and game worlds.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Our Mission
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Genesis empowers storytellers, game masters, and world-builders to create stunning, interactive fantasy maps.
                We believe that every great story begins with a great world, and we&apos;re here to help you build yours.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                What We Offer
              </h2>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>Intuitive map creation tools designed for fantasy worlds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>Rich location system with pins, lore, and custom markers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>Collaborative features for co-creation sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>Beautiful export options for integration into your projects</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Our Community
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Join thousands of creators who have already built over 10,000 worlds and placed more than 1 million locations.
                From intimate novels to epic RPG campaigns, Genesis is the canvas for your imagination.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Contact Us
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Have questions, feedback, or ideas? We&apos;d love to hear from you. Reach out to us at{' '}
                <a href="mailto:hello@genesis.com" className="text-accent-gold hover:underline">
                  hello@genesis.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
