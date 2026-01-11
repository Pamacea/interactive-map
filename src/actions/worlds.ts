"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
}) {
  const user = await prisma.user.findFirst();

  if (!user) {
    throw new Error("User not found");
  }

  const world = await prisma.gameWorld.create({
    data: {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      userId: user.id,
      isPublished: true,
    },
  });

  revalidatePath("/explore");
  revalidatePath("/worlds");

  return { worldId: world.id };
}

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

  return world;
}

export async function getAllWorlds() {
  const worlds = await prisma.gameWorld.findMany({
    where: {
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
      createdAt: "desc",
    },
  });

  return worlds;
}
