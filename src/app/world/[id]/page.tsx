import { WorldClient } from "@/components/world/ui/world-client";
import { getWorldById } from "@/actions/worlds";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const world = await getWorldById(id);
  const session = await auth();

  if (!world) {
    notFound();
  }

  // DEBUG: Log world data from database
  console.log("[DEBUG Page] World fetched from DB:", {
    worldId: world.id,
    worldTitle: world.title,
    mapValue: world.map,
    mapType: typeof world.map,
    isMapNull: world.map === null,
    isMapUndefined: world.map === undefined,
    mapLength: world.map?.length
  });

  return <WorldClient world={world} isAuthenticated={!!session?.user} />;
}
