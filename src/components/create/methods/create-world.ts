"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorld(data: { title: string; description: string; isPublic: boolean }) {
  const { title, description, isPublic } = data;

  if (!title) {
    return { error: "Title is required" };
  }

  const user = await prisma.user.findFirst();

  if (!user) {
    return { error: "User not found" };
  }

  const world = await prisma.gameWorld.create({
    data: {
      title,
      description,
      isPublic,
      userId: user.id,
      isPublished: true,
    },
  });

  revalidatePath("/explore");
  revalidatePath("/worlds");

  return { success: true, worldId: world.id };
}
