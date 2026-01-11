import { prisma } from "@/lib/prisma";

export interface World {
  id: string;
  title: string;
  description: string | null;
  pinCount: number;
  loreCount: number;
  author: { name: string | null; image: string | null };
  map: string | null;
  isPublic: boolean;
}

export async function getAllWorlds(): Promise<World[]> {
  const worlds = await prisma.gameWorld.findMany({
    where: {
      isPublished: true,
      isPublic: true,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          pins: true,
          loreEntries: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return worlds.map((world) => ({
    id: world.id,
    title: world.title,
    description: world.description,
    pinCount: world._count.pins,
    loreCount: world._count.loreEntries,
    author: {
      name: world.user.name,
      image: world.user.image,
    },
    map: world.map,
    isPublic: world.isPublic,
  }));
}
