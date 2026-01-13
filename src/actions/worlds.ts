"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}) {
  console.log("🚀 createWorld received data:", {
    title: data.title,
    description: data.description.substring(0, 50) + "...",
    isPublic: data.isPublic,
    hasMap: !!data.map,
    mapName: data.map?.name,
    mapSize: data.map?.size,
    mapType: data.map?.type,
  });

  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("❌ User not found");
    throw new Error("User not found");
  }

  let mapPath: string | undefined;

  // Handle map image upload
  if (data.map) {
    console.log("📤 Processing map file...");

    const bytes = await data.map.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with world ID prefix
    const timestamp = Date.now();
    const fileExtension = data.map.name.split('.').pop();
    const fileName = `${timestamp}-${data.map.name}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    console.log("🔧 File details:", {
      fileName,
      fileExtension,
      uploadsDir,
      fileSize: buffer.length,
    });

    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      console.log("📁 Creating uploads directory...");
      await writeFile(path.join(uploadsDir, ".gitkeep"), "");
    }

    const filePath = path.join(uploadsDir, fileName);

    try {
      console.log("💾 Writing file to:", filePath);
      await writeFile(filePath, buffer);

      // Store the relative path in database
      mapPath = `/uploads/${fileName}`;
      console.log("✅ File saved with path:", mapPath);
    } catch (error) {
      console.error("❌ Failed to save file:", error);
      throw new Error("Failed to save map image");
    }
  }

  const world = await prisma.gameWorld.create({
    data: {
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      userId: user.id,
      isPublished: true,
      map: mapPath,
    },
  });

  console.log("✅ World created:", {
    worldId: world.id,
    mapPath: world.map,
    hasMap: !!world.map,
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

export async function getMyWorlds() {
  const user = await prisma.user.findFirst();

  if (!user) {
    return [];
  }

  const worlds = await prisma.gameWorld.findMany({
    where: {
      OR: [
        { userId: user.id },
        {
          members: {
            some: {
              userId: user.id,
              permission: {
                in: ["EDITOR", "OWNER"],
              },
            },
          },
        },
      ],
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

export async function updateWorldTitle(id: string, title: string) {
  const world = await prisma.gameWorld.update({
    where: { id },
    data: { title },
  });

  revalidatePath("/world/[id]");
  revalidatePath("/worlds");

  return world;
}

/**
 * Update world state (layers, map properties, etc.) for autosave
 * @param worldId - World ID to update
 * @param state - World state object containing layers and other properties
 * @returns Updated world
 * @throws Error if user not authorized or world not found
 */
export async function updateWorldState(
  worldId: string,
  state: {
    layers?: Array<{
      id: string;
      name: string;
      visible: boolean;
      locked: boolean;
      opacity: number;
      zIndex: number;
    }>;
    grid?: boolean;
    snap?: boolean;
    scale?: string;
  }
) {
  console.log("[updateWorldState] Updating world state for:", worldId);

  // Get current user from session
  const user = await prisma.user.findFirst();

  if (!user) {
    throw new Error("User not found");
  }

  // Check if world exists and user has permission
  const world = await prisma.gameWorld.findUnique({
    where: { id: worldId },
  });

  if (!world) {
    throw new Error("World not found");
  }

  // Check ownership or editor permission
  if (world.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: worldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  // Update layers if provided
  if (state.layers) {
    console.log("[updateWorldState] Updating layers:", state.layers.length);

    // Process each layer: create or update
    for (const layer of state.layers) {
      // Check if layer exists
      const existingLayer = await prisma.mapLayer.findUnique({
        where: { id: layer.id },
      });

      if (existingLayer) {
        // Update existing layer
        await prisma.mapLayer.update({
          where: { id: layer.id },
          data: {
            name: layer.name,
            isVisible: layer.visible,
            opacity: layer.opacity,
            zIndex: layer.zIndex,
          },
        });
      } else {
        // Create new layer (shouldn't happen in normal flow, but handle it)
        await prisma.mapLayer.create({
          data: {
            id: layer.id,
            name: layer.name,
            isVisible: layer.visible,
            opacity: layer.opacity,
            zIndex: layer.zIndex,
            gameWorldId: worldId,
          },
        });
      }
    }
  }

  // Note: grid, snap, scale are UI-only state stored in Zustand
  // They don't need to be persisted to the database unless you want to
  // remember them across sessions. If so, add them to GameWorld schema.

  // Revalidate cache
  revalidatePath(`/worlds/${worldId}`);
  revalidatePath("/worlds");

  console.log("[updateWorldState] World state updated successfully");

  // Return updated world with layers
  const updatedWorld = await prisma.gameWorld.findUnique({
    where: { id: worldId },
    include: {
      layers: {
        orderBy: { zIndex: "asc" },
      },
    },
  });

  return updatedWorld;
}
