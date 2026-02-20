import type { GameWorld } from "@/types/world.type";

interface FilterWorldsParams {
  worlds: GameWorld[];
  query: string;
}

export function filterWorlds({ worlds, query }: FilterWorldsParams): GameWorld[] {
  if (!query) return worlds;

  const searchLower = query.toLowerCase();

  return worlds.filter((world) => {
    return (
      world.title.toLowerCase().includes(searchLower) ||
      (world.description?.toLowerCase().includes(searchLower) ?? false) ||
      (world.user.name?.toLowerCase().includes(searchLower) ?? false)
    );
  });
}

