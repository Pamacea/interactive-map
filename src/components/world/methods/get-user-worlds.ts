import { prisma } from "@/lib/prisma";

export async function getUserWorlds(userId: string) {
  const worlds = await prisma.gameWorld.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          pins: true,
          loreEntries: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return worlds.map((world) => ({
    ...world,
    pinCount: world._count.pins,
    loreCount: world._count.loreEntries,
  }));
}
