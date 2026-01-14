import { WorldClient } from "@/components/world/ui/world-client";
import { getWorldWithData } from "@/actions/worlds";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Pin } from "@/types/pin.type";

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch everything server-side in ONE query
  const [world, session] = await Promise.all([
    getWorldWithData(id),
    auth(),
  ]);

  if (!world) {
    notFound();
  }

  return (
    <WorldClient
      world={world}
      pins={world.pins as unknown as Pin[]}
      isAuthenticated={!!session?.user}
    />
  );
}
