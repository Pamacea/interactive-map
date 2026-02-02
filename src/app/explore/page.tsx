import { FloatingParticles } from "@/components/ui/particles";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { ExploreClient } from "./explore-client";
import { getAllWorlds } from "@/actions/worlds";
import { Compass } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// ISR: Revalidate page every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Explore Worlds",
  description: "Discover thousands of fantasy maps created by worldbuilders worldwide. Find inspiration for your D&D campaigns and creative writing projects.",
  openGraph: {
    title: "Explore Fantasy Worlds - Genesis",
    description: "Discover thousands of fantasy maps created by worldbuilders worldwide.",
    url: `${siteConfig.url}/explore`,
  },
};

export default async function ExplorePage() {
  const allWorlds = await getAllWorlds({ limit: 24 });

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <FloatingParticles />
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-sm blur-[150px] pointer-events-none" />

      <AppHeader />

      <div className="relative z-10 ml-16 sm:ml-20 min-h-screen flex flex-col">
        {/* Ornate Header */}
        <div className="px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
          <div className="max-w-3/5 mx-auto text-center">
            {/* Compass Icon */}
            <div className="text-4xl sm:text-5xl text-accent-gold/20 mb-4 flex justify-center">
              <Compass className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" strokeWidth={1} />
            </div>

            {/* Decorative Line with Rune */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
              <span className="text-accent-gold-dark opacity-40 text-lg sm:text-xl animate-rune-glow">ᛟ</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
            </div>

            <p className="font-display text-xs tracking-[0.4em] text-bone-dark mb-3">
              DISCOVER NEW REALMS
            </p>
            <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider mb-4">
              Explore Worlds
            </h1>
            <p className="font-fell text-bone-dark text-sm sm:text-base max-w-3/5 mx-auto">
              Journey through lands forged by creators worldwide.
            </p>
          </div>
        </div>

        <ExploreClient initialWorlds={allWorlds} />

        {/* Ornate Divider */}
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          <span className="text-accent-gold-dark opacity-30">ᛟ</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent-gold/30 to-transparent" />
        </div>

        <Footer />
      </div>
    </div>
  );
}
