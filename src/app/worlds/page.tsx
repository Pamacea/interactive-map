"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Plus, AlertCircle, Crown } from "lucide-react";
import Link from "next/link";
import { CrownButton } from "@/components/ui/crown-button";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { WorldCard } from "@/components/ui/world-card";
import { SkeletonGrid } from "@/components/ui/skeleton";
import { FloatingParticles } from "@/components/ui/particles";
import { useMyWorlds } from "@/components/worlds/logic/use-my-worlds";

export default function MyWorldsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { worlds, loading, error } = useMyWorlds();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-void ml-16 sm:ml-20 relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-4xl text-accent-gold/30 animate-rune-glow">ᛟ</div>
          <div className="text-bone font-fell">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full flex flex-col bg-void overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <FloatingParticles />
      </div>

      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <AppHeader />

      <div className="flex flex-col justify-center items-center ml-16 sm:ml-20 px-4 pt-24 pb-16 sm:pt-28 sm:pb-20 z-10">
        {/* Ornate Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          {/* Crown Symbol */}
          <div className="text-5xl sm:text-6xl text-accent-gold/20 mb-4">
            <Crown className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" strokeWidth={1} />
          </div>

          {/* Decorative Line with Rune */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
            <span className="text-accent-gold-dark opacity-40 text-lg sm:text-xl animate-rune-glow">ᛟ</span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
          </div>

          {/* Subtitle */}
          <p className="font-display text-xs tracking-[0.4em] text-bone-dark mb-3">
            YOUR CREATIONS
          </p>

          {/* Main Title */}
          <h1 className="font-display-ornate text-4xl sm:text-5xl md:text-6xl text-accent-gold tracking-wider mb-4">
            My Worlds
          </h1>

          {/* Description */}
          <p className="font-fell text-bone-dark text-sm sm:text-base max-w-3/5 mb-8">
            Forge your destiny. Create and manage your fantasy realms.
          </p>
          
          
          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-16 py-4 px-8">
          {/* Create Button */}
          <Link href="/create">
            <CrownButton variant="gold" size="md">
              <Plus className="w-4 h-4" />
              Forge New World
            </CrownButton>
          </Link>
          <div className="flex items-center justify-center gap-8 sm:gap-16 py-4 px-4  ">
            
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display-ornate text-accent-gold">{worlds.length}</div>
              <div className="text-xs text-bone-dark uppercase tracking-wider">Worlds</div>
            </div>
            <div className="w-px h-8 bg-iron" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display-ornate text-accent-gold">
                {worlds.reduce((sum, w) => sum + (w._count?.pins || 0), 0)}
              </div>
              <div className="text-xs text-bone-dark uppercase tracking-wider">Locations</div>
            </div>
          </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid items={6} columns={{ sm: 1, md: 2, lg: 3 }} />
        ) : error ? (
          <div className="flex flex-col w-full items-center justify-center py-20 text-center">
            {/* Error State */}
            <div className="relative">
              <div className="absolute -top-8 -left-8 text-blood/20 text-4xl animate-rune-glow">ᛞ</div>
              <div className="bg-blood/10 border border-blood/30 rounded-lg p-8 max-w-3/5">
                <AlertCircle className="w-16 h-16 text-blood mx-auto mb-4" />
                <h3 className="font-display text-xl text-bone mb-2">Error loading worlds</h3>
                <p className="font-fell text-bone-dark">{error}</p>
              </div>
            </div>
          </div>
        ) : worlds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            {/* Ornate Empty State */}
            <div className="relative">
              {/* Decorative runes */}
              <div className="absolute -top-16 -left-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow">ᛟ</div>
              <div className="absolute -top-16 -right-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow" style={{ animationDelay: "1s" }}>ᛞ</div>
              <div className="absolute -bottom-16 -left-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow" style={{ animationDelay: "2s" }}>ᛃ</div>
              <div className="absolute -bottom-16 -right-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow" style={{ animationDelay: "3s" }}>ᛊ</div>

              <div className="bg-obsidian/60 backdrop-blur-sm border border-iron rounded-lg p-12 text-center max-w-3/5 hover:border-accent-gold/50 transition-all duration-300">
                {/* Floating Sparkles */}
                <Sparkles className="w-20 h-20 text-accent-gold mx-auto mb-6 animate-crown-float" />

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
                  <span className="text-accent-gold-dark opacity-50 text-xl">ᛟ</span>
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
                </div>

                <h3 className="font-display-ornate text-2xl text-bone mb-3">No Worlds Yet</h3>
                <p className="font-fell text-bone-dark mb-8">Your journey begins now. Forge your first realm and let your legend unfold.</p>

                <Link href="/create">
                  <CrownButton variant="gold" size="md">
                    <Plus className="w-4 h-4" />
                    Begin Your Journey
                  </CrownButton>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>

            {/* Worlds Grid */}
            <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worlds.map((world) => (
                <WorldCard
                  key={world.id}
                  id={world.id}
                  title={world.title}
                  description={world.description}
                  map={world.map}
                  isPublic={world.isPublic}
                  user={world.user}
                  _count={world._count}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Ornate Divider Before Footer */}
      <div className="ml-16 sm:ml-20 relative z-10">
        <div className="flex items-center gap-4 py-8 border-t border-iron">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          <span className="text-accent-gold-dark opacity-30">ᛟ</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent-gold/30 to-transparent" />
        </div>
        <Footer />
      </div>
    </div>
  );
}
