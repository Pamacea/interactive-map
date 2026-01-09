import { NavigationBar } from "@/components/ui/navigation-bar";
import { HeroSection } from "@/components/home/ui/hero-section";
import { FeaturesSection } from "@/components/home/ui/features-section";
import { FeaturedWorldsSection } from "@/components/home/ui/featured-worlds-section";
import { CTASection } from "@/components/home/ui/cta-section";
import { Footer } from "@/components/home/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-base">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <FeaturedWorldsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
