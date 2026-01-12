"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Plus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MetallicButton } from "@/components/ui/metallic-button";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";
import { WorldCard } from "@/components/ui/world-card";
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background-base">
      <NavigationBar />
      <div className="flex-1 max-w-2/3 mx-auto px-4 py-40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">My Worlds</h1>
            <p className="text-text-secondary">Create and manage your fantasy worlds</p>
          </div>
          <Link href="/create">
            <MetallicButton>
              <Plus className="w-4 h-4" />
              Create World
            </MetallicButton>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Error loading worlds</h3>
            <p className="text-text-muted">{error}</p>
          </div>
        ) : worlds.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background-card rounded-xl border border-border-subtle p-8 flex flex-col items-center justify-center text-center min-h-[280px] hover:border-accent-gold transition-colors">
              <Sparkles className="w-16 h-16 text-accent-gold mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No worlds yet</h3>
              <p className="text-text-muted mb-6">Start your journey by creating your first world</p>
              <Link href="/create">
                <MetallicButton>
                  <Plus className="w-4 h-4" />
                  Create World
                </MetallicButton>
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
      <Footer />
    </div>
  );
}
