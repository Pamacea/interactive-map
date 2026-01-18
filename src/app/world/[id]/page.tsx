import { WorldClient } from "@/components/world/ui/world-client";
import { getWorldWithData } from "@/actions/worlds";
import { getLoreEntriesByWorld } from "@/actions/lore";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Pin } from "@/types/pin.type";
import type { LoreEntry } from "@/types/lore.type";

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch everything server-side in parallel
  const [world, loreEntries, session] = await Promise.all([
    getWorldWithData(id),
    getLoreEntriesByWorld(id),
    auth(),
  ]);

  if (!world) {
    notFound();
  }

  return (
    <WorldClient
      world={world}
      pins={world.pins as unknown as Pin[]}
      loreEntries={loreEntries as unknown as LoreEntry[]}
      isAuthenticated={!!session?.user}
    />
  );
}
