import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";

export default function PrivacyPage() {
  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-background-base">
        <div className="mx-auto px-6 py-24">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-display font-semibold text-text-primary mb-6">
              Privacy Policy
            </h1>
            <p className="text-text-secondary">
              Last updated: January 2026
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  We collect information you provide directly to us, including:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Account information (name, email address, password)</li>
                  <li>• Profile information (display name, avatar)</li>
                  <li>• Content you create (maps, locations, lore)</li>
                  <li>• Usage data and preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>We use the information we collect to:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Provide, maintain, and improve our services</li>
                  <li>• Process transactions and send related information</li>
                  <li>• Send technical notices and support messages</li>
                  <li>• Respond to comments and questions</li>
                  <li>• Monitor and analyze trends and usage</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Data Security
              </h2>
              <p className="text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data
                against unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Your Rights
              </h2>
              <p className="text-text-secondary leading-relaxed">
                You have the right to access, correct, or delete your personal data. You may also opt out of
                marketing communications or request data portability. To exercise these rights, please
                contact us at{' '}
                <a href="mailto:privacy@genesis.com" className="text-accent-gold hover:underline">
                  privacy@genesis.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Cookies
              </h2>
              <p className="text-text-secondary leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and
                assist in marketing efforts. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Contact Us
              </h2>
              <p className="text-text-secondary leading-relaxed">
                For any privacy-related questions or concerns, please contact us at{' '}
                <a href="mailto:privacy@genesis.com" className="text-accent-gold hover:underline">
                  privacy@genesis.com
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
