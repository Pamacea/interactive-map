interface World {
  id: string;
  slug: string;
  title: string;
  description: string;
  pinCount: number;
  loreCount: number;
  author: { name: string };
  isPublic: boolean;
}

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
      world.description.toLowerCase().includes(searchLower) ||
      world.author.name.toLowerCase().includes(searchLower)
    );
  });
}
