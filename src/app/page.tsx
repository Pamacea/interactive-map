import { NavigationBar } from "@/components/ui/navigation-bar";
import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { HeroSection } from "@/components/home/ui/hero-section";
import { FeaturesSection } from "@/components/home/ui/features-section";
import { FeaturedWorldsSection } from "@/components/home/ui/featured-worlds-section";
import { CTASection } from "@/components/home/ui/cta-section";
import { Footer } from "@/components/home/ui/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background-base">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground />
        <FloatingParticles />
      </div>

      <div className="relative z-10 flex flex-col">
        <NavigationBar />
        <main className="flex flex-col">
          <HeroSection />
          <FeaturesSection />
          <FeaturedWorldsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
