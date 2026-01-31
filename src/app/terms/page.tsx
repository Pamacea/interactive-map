import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";

export default function TermsPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-void ml-16 sm:ml-20">
        {/* Decorative header */}
        <div className="border-b border-iron pt-16">
          <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-accent-gold-dark opacity-50 text-2xl">ᛗ</span>
              <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/50 to-transparent" />
            </div>
            <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-4">
              LEGAL AGREEMENT
            </p>
            <h1 className="font-display-ornate text-5xl sm:text-6xl text-accent-gold tracking-wider">
              Terms of Service
            </h1>
            <p className="font-fell text-bone-dark mt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>

        <div className="max-w-3/5 mx-auto px-6 py-16 sm:py-20">
          <div className="space-y-16">
            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Acceptance of Terms</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                By accessing or using Genesis, you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Account Responsibilities</h2>
              <div className="space-y-4 font-fell text-bone-dark">
                <p>You are responsible for:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚠ</span>
                    <span>Maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚢ</span>
                    <span>All activities that occur under your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚦ</span>
                    <span>Notifying us immediately of unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚨ</span>
                    <span>Complying with these terms at all times</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Content and Conduct</h2>
              <div className="space-y-4 font-fell text-bone-dark">
                <p>You retain ownership of content you create on Genesis. By using our service, you grant us
                a license to store, display, and process your content solely to provide the service.</p>
                <p>You agree not to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚱ</span>
                    <span>Post harmful, illegal, or offensive content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚲ</span>
                    <span>Impersonate others or misrepresent yourself</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚷ</span>
                    <span>Attempt to gain unauthorized access to our systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-gold">ᚹ</span>
                    <span>Interfere with or disrupt the service</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Intellectual Property</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                Genesis and its original content, features, and functionality are owned by us and are
                protected by international copyright, trademark, and other intellectual property laws.
                You may not reproduce, modify, or distribute our content without prior written consent.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Termination</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these
                terms or for any other reason at our sole discretion. Upon termination, your right to use
                the service will immediately cease.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Disclaimers</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                Genesis is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, expressed
                or implied, and hereby disclaim all warranties regarding the service.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Limitation of Liability</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                To the fullest extent permitted by law, Genesis shall not be liable for any indirect,
                incidental, special, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section className="border-l-2 border-iron pl-6 hover:border-accent-gold/50 transition-colors">
              <h2 className="font-display text-2xl text-bone mb-4">Changes to Terms</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                We may update these terms at any time. We will notify users of significant changes via email
                or through the service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="border-l-2 border-accent-gold pl-6">
              <h2 className="font-display text-2xl text-accent-gold mb-4">Contact Us</h2>
              <p className="font-fell text-bone-dark leading-relaxed">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:legal@genesis.com" className="text-accent-gold hover:underline">
                  legal@genesis.com
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
