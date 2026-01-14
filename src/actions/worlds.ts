"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

  // Get authenticated user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.log("❌ No authenticated user session!");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.log("❌ User not found in database!");
    throw new Error("User not found");
  }

  console.log("✅ Authenticated user:", { id: user.id, name: user.name, email: user.email });

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
  // Get authenticated user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

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

  // Note: Only revalidate if needed for SSR. Client-side cache handles updates.
  revalidatePath("/world/[id]");

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
    pinCount?: number; // Track pin count to trigger autosave on pin changes
  }
) {
  console.log("[updateWorldState] Updating world state for:", worldId, {
    hasLayers: !!state.layers,
    layerCount: state.layers?.length,
    pinCount: state.pinCount,
  });

  // Get authenticated user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[updateWorldState] No authenticated user session!");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[updateWorldState] User not found in database!");
    throw new Error("User not found");
  }

  console.log("[updateWorldState] Authenticated user:", { id: user.id, name: user.name, email: user.email });

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

  // Note: pinCount is used to trigger autosave when pins are added/edited/deleted
  // The pins themselves are managed independently via their own Server Actions
  // (createPin, updatePin, deletePin in actions/pins.ts)
  // We don't save pinCount to the database - it's just for change detection

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

  // Note: No revalidatePath needed - Zustand store manages client-side layer state
  // The autosave hook updates the local state directly

  return updatedWorld;
}

/**
 * Upload a new map image for a world
 * @param worldId - World ID to update
 * @param formData - FormData containing the file upload
 * @returns Success status and new map URL
 * @throws Error if user not authorized, file invalid, or upload fails
 */
export async function uploadWorldMap(worldId: string, formData: FormData) {
  console.log("[uploadWorldMap] Starting map upload for world:", worldId);

  // Get authenticated user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[uploadWorldMap] No authenticated user session!");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[uploadWorldMap] User not found in database!");
    throw new Error("User not found");
  }

  console.log("[uploadWorldMap] Authenticated user:", { id: user.id, name: user.name, email: user.email });

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

  // Get file from formData
  const file = formData.get("file") as File;

  if (!file) {
    console.error("[uploadWorldMap] No file provided in formData");
    throw new Error("No file provided");
  }

  console.log("[uploadWorldMap] File received:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  // Validate file type
  const validTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a WebP, PNG, or JPEG image.");
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  // Save file
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}-${sanitizedFileName}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  console.log("[uploadWorldMap] Saving file:", {
    fileName,
    uploadsDir,
  });

  // Ensure uploads directory exists
  if (!existsSync(uploadsDir)) {
    console.log("[uploadWorldMap] Creating uploads directory...");
    await writeFile(path.join(uploadsDir, ".gitkeep"), "");
  }

  const filePath = path.join(uploadsDir, fileName);

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const mapPath = `/uploads/${fileName}`;
    console.log("[uploadWorldMap] File saved successfully:", mapPath);

    // Update database with new map path
    const updatedWorld = await prisma.gameWorld.update({
      where: { id: worldId },
      data: { map: mapPath },
    });

    console.log("[uploadWorldMap] Database updated:", {
      worldId: updatedWorld.id,
      newMapPath: updatedWorld.map,
    });

    // Revalidate the world page to refresh server component
    revalidatePath(`/world/${worldId}`);

    return {
      success: true,
      mapUrl: mapPath,
    };
  } catch (error) {
    console.error("[uploadWorldMap] Failed to save file:", error);
    throw new Error("Failed to save map image");
  }
}
