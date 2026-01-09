import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";

export default function TermsPage() {
  return (
    <>
      <NavigationBar />
      <main className="min-h-screen bg-background-base">
        <div className=" mx-auto px-6 py-24">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-display font-semibold text-text-primary mb-6">
              Terms of Service
            </h1>
            <p className="text-text-secondary">
              Last updated: January 2026
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing or using Genesis, you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Account Responsibilities
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>You are responsible for:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Maintaining the confidentiality of your account credentials</li>
                  <li>• All activities that occur under your account</li>
                  <li>• Notifying us immediately of unauthorized access</li>
                  <li>• Complying with these terms at all times</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Content and Conduct
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>You retain ownership of content you create on Genesis. By using our service, you grant us
                a license to store, display, and process your content solely to provide the service.</p>
                <p>You agree not to:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Post harmful, illegal, or offensive content</li>
                  <li>• Impersonate others or misrepresent yourself</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Interfere with or disrupt the service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Intellectual Property
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Genesis and its original content, features, and functionality are owned by us and are
                protected by international copyright, trademark, and other intellectual property laws.
                You may not reproduce, modify, or distribute our content without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Termination
              </h2>
              <p className="text-text-secondary leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these
                terms or for any other reason at our sole discretion. Upon termination, your right to use
                the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Disclaimers
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Genesis is provided on an "as is" and "as available" basis. We make no warranties, expressed
                or implied, and hereby disclaim all warranties regarding the service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Limitation of Liability
              </h2>
              <p className="text-text-secondary leading-relaxed">
                To the fullest extent permitted by law, Genesis shall not be liable for any indirect,
                incidental, special, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Changes to Terms
              </h2>
              <p className="text-text-secondary leading-relaxed">
                We may update these terms at any time. We will notify users of significant changes via email
                or through the service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
                Contact Us
              </h2>
              <p className="text-text-secondary leading-relaxed">
                For questions about these terms, please contact us at{' '}
                <a href="mailto:legal@genesis.com" className="text-accent-gold hover:underline">
                  legal@genesis.com
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
