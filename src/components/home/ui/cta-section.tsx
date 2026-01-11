import { MetallicButton } from "@/components/ui/metallic-button";

export function CTASection() {
  return (
    <section className="py-20 px-4 border-t-2 border-t-accent-gold">
      <div className="max-w-2/3 mx-auto flex flex-col text-center px-4 gap-8 items-center">
        <CTATitle />
        <CTADescription />
        <CTAButtons />
      </div>
    </section>
  );
}

function CTATitle() {
  return (
    <h2 className="text-4xl font-display font-bold text-text-primary">
      Ready to Build Your <span className="text-gradient">Realm?</span>
    </h2>
  );
}

function CTADescription() {
  return (
    <p className="text-lg text-text-secondary">
      Join thousands of creators bringing their fantasy worlds to life.
      Start your journey today.
    </p>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <MetallicButton size="lg" variant="gold" >
        Get Started Free
      </MetallicButton>
      <MetallicButton size="lg" variant="silver">
        View Documentation
      </MetallicButton>
    </div>
  );
}