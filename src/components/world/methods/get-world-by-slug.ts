import { prisma } from "@/lib/prisma";

export async function getWorldById(id: string) {
  const world = await prisma.gameWorld.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      layers: {
        orderBy: { zIndex: "asc" },
      },
      pins: {
        where: { isVisible: true },
      },
      loreEntries: {
        where: { isVisible: true },
      },
    },
  });

  if (!world) return null;

  return {
    ...world,
    pinCount: world.pins.length,
    loreCount: world.loreEntries.length,
  };
}
