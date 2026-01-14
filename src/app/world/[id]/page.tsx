"use client";

import { useWorldWithData } from "@/components/world/logic/use-world-initialization";
import { WorldClient } from "@/components/world/ui/world-client";
import { WorldSkeleton } from "@/components/world/ui/world-skeleton";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import type { Pin } from "@/types/pin.type";

export default function WorldDetailPage() {
  const params = useParams();
  const worldId = params.id as string;

  const { data: world, isLoading, error } = useWorldWithData(worldId);
  const { data: session } = useSession();

  if (error) {
    return (
      <div className="h-screen bg-background-base flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Error loading world
          </h2>
          <p className="text-text-secondary">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !world) {
    return <WorldSkeleton />;
  }

  return (
    <WorldClient
      world={world}
      pins={world.pins as unknown as Pin[]}
      isAuthenticated={!!session?.user}
    />
  );
}
