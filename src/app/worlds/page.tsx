"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { CrownButton } from "@/components/ui/crown-button";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { WorldCard } from "@/components/ui/world-card";
import { SkeletonGrid } from "@/components/ui/skeleton";
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
      <div className="h-screen flex items-center justify-center bg-void ml-16 sm:ml-20">
        <div className="text-bone font-fell">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <AppHeader />

      <div className="ml-16 sm:ml-20 flex-1 max-w-3/5 px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-2">
              YOUR CREATIONS
            </p>
            <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider">
              My Worlds
            </h1>
            <p className="font-fell text-bone-dark mt-2">Create and manage your fantasy realms</p>
          </div>
          <Link href="/create">
            <CrownButton variant="gold" size="md">
              <Plus className="w-4 h-4" />
              Create World
            </CrownButton>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid items={6} columns={{ sm: 1, md: 2, lg: 3 }} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-16 h-16 text-blood mb-4" />
            <h3 className="font-display text-xl text-bone mb-2">Error loading worlds</h3>
            <p className="font-fell text-bone-dark">{error}</p>
          </div>
        ) : worlds.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-obsidian border border-iron rounded-sm p-8 flex flex-col items-center justify-center text-center min-h-[280px] hover:border-accent-gold/50 transition-colors">
              <Sparkles className="w-16 h-16 text-accent-gold mb-4" />
              <h3 className="font-display text-xl text-bone mb-2">No worlds yet</h3>
              <p className="font-fell text-bone-dark mb-6">Start your journey by creating your first realm</p>
              <Link href="/create">
                <CrownButton variant="gold" size="md">
                  <Plus className="w-4 h-4" />
                  Create World
                </CrownButton>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </div>

      <div className="ml-16 sm:ml-20">
        <Footer />
      </div>
    </div>
  );
}
