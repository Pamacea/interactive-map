import type { World } from "./get-all-worlds";

interface FilterWorldsParams {
  worlds: World[];
  query: string;
}

export function filterWorlds({ worlds, query }: FilterWorldsParams): World[] {
  if (!query) return worlds;

  const searchLower = query.toLowerCase();

  return worlds.filter((world) => {
    return (
      world.title.toLowerCase().includes(searchLower) ||
      (world.description?.toLowerCase().includes(searchLower) ?? false) ||
      (world.author.name?.toLowerCase().includes(searchLower) ?? false)
    );
  });
}
