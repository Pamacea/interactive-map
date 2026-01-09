"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyWorldsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-base">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">My Worlds</h1>
            <p className="text-text-secondary">Create and manage your fantasy worlds</p>
          </div>
          <Link href="/worlds/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create World
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-background-card rounded-xl border border-border-subtle p-8 flex flex-col items-center justify-center text-center min-h-[300px] hover:border-accent-gold transition-colors">
            <Sparkles className="w-12 h-12 text-accent-gold mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No worlds yet</h3>
            <p className="text-text-muted mb-4">Start your journey by creating your first world</p>
            <Link href="/worlds/new">
              <Button variant="secondary">Create World</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
