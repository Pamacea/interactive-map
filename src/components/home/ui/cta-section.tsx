import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background-elevated to-background-base">
      <div className="max-w-4xl mx-auto text-center">
        <CTATitle />
        <CTADescription />
        <CTAButtons />
      </div>
    </section>
  );
}

function CTATitle() {
  return (
    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
      Ready to Build Your <span className="text-gradient">Realm?</span>
    </h2>
  );
}

function CTADescription() {
  return (
    <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
      Join thousands of creators bringing their fantasy worlds to life.
      Start your journey today.
    </p>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button size="lg" variant="primary" className="text-lg px-8">
        Get Started Free
      </Button>
      <Button size="lg" variant="secondary" className="text-lg px-8">
        View Documentation
      </Button>
    </div>
  );
}
