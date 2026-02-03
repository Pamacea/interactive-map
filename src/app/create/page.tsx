import { lazy, Suspense } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { CreateWorldForm } from "@/components/create/ui";
import { Sparkles } from "lucide-react";

// Lazy load particles for better performance
const FloatingParticles = lazy(() =>
  import("@/components/ui/particles").then(m => ({ default: m.FloatingParticles }))
);

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <Suspense fallback={null}>
          <FloatingParticles />
        </Suspense>
      </div>

      {/* Background Glow - optimized: reduced blur from 150px to 80px */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-sm blur-[80px] pointer-events-none" />

      <AppHeader />

      <div className="relative z-10 ml-16 sm:ml-20 min-h-screen flex flex-col">
        <main className="flex-1 px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3/5 mx-auto">
            {/* Ornate Header */}
            <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
              {/* Sparkle Icon */}
              <div className="text-4xl sm:text-5xl text-accent-gold/20 mb-4">
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" strokeWidth={1} />
              </div>

              {/* Decorative Line with Rune */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
                <span className="text-accent-gold-dark opacity-40 text-lg sm:text-xl animate-rune-glow">ᛟ</span>
                <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
              </div>

              <p className="font-display text-xs tracking-[0.4em] text-bone-dark mb-3">
                FORGE YOUR LEGACY
              </p>
              <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider mb-4">
                Create New World
              </h1>
              <p className="font-fell text-bone-dark text-sm sm:text-base max-w-3/5">
                Begin your journey. Shape your realm, define your destiny.
              </p>
            </div>

            <CreateWorldForm />
          </div>
        </main>

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
