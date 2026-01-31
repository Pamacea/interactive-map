import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";

export default function PrivacyPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-void ml-16 sm:ml-20">
        {/* Decorative header */}
        <div className="border-b border-iron pt-16">
          <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent-gold-dark opacity-50 text-2xl">ᛉ</span>
              <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/50 to-transparent" />
            </div>
            <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-4">
              PRIVACY COMMITMENT
            </p>
            <h1 className="font-display-ornate text-5xl sm:text-6xl text-accent-gold tracking-wider">
              Privacy Policy
            </h1>
            <p className="font-fell text-bone-dark mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>

        <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
          <div className="space-y-16">
            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Information We Collect</h2>
              <div className="space-y-4 font-fell text-bone-dark">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛃ</span>
                    <span>Account information (name, email address, password)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛇ</span>
                    <span>Profile information (display name, avatar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛈ</span>
                    <span>Content you create (maps, locations, lore)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛁ</span>
                    <span>Usage data and preferences</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">How We Use Your Information</h2>
              <div className="space-y-4 font-fell text-bone-dark">
                <p>We use the information we collect to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛗ</span>
                    <span>Provide, maintain, and improve our services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛚ</span>
                    <span>Process transactions and send related information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛜ</span>
                    <span>Send technical notices and support messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛞ</span>
                    <span>Respond to comments and questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᛒ</span>
                    <span>Monitor and analyze trends and usage</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Data Security</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data
                against unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Your Rights</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                You have the right to access, correct, or delete your personal data. You may also opt out of
                marketing communications or request data portability. To exercise these rights, please
                contact us at{' '}
                <a href="mailto:privacy@genesis.com" className="text-accent-gold hover:underline">
                  privacy@genesis.com
                </a>
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Cookies</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and
                assist in marketing efforts. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="border-l-2 border-accent-gold pl-6">
              <h2 className="font-display text-2xl text-accent-gold mb-4">Contact Us</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                For any privacy-related questions or concerns, please contact us at{' '}
                <a href="mailto:privacy@genesis.com" className="text-accent-gold hover:underline">
                  privacy@genesis.com
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
