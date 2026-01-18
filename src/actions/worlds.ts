"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import type { OptimizedWorld } from "@/types/world.type";
import {
  safeAsync,
  ValidationError,
  FileUploadError,
  type Result,
} from "@/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/lib/server-helpers";

/**
 * Create a new world
 * @param data - World creation data
 * @returns Result with created world ID or error
 */
export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}): Promise<Result<{ worldId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    let mapPath: string | undefined;

    // Handle map image upload
    if (data.map) {
      const bytes = await data.map.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with world ID prefix
      const timestamp = Date.now();
      const fileExtension = data.map.name.split(".").pop();
      const fileName = `${timestamp}-${data.map.name}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      // Ensure uploads directory exists
      if (!existsSync(uploadsDir)) {
        await writeFile(path.join(uploadsDir, ".gitkeep"), "");
      }

      const filePath = path.join(uploadsDir, fileName);

      try {
        await writeFile(filePath, buffer);
        mapPath = `/uploads/${fileName}`;
      } catch (error) {
        throw new FileUploadError("Failed to save map image");
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
        // Automatically create OWNER member record for the creator
        members: {
          create: {
            userId: user.id,
            permission: "OWNER",
          },
        },
      },
    });

    revalidatePath("/explore");
    revalidatePath("/worlds");

    return { worldId: world.id };
  }, "createWorld");
}

/**
 * Get world by ID
 * @param id - World ID
 * @returns World or null
 */
export async function getWorldById(id: string): Promise<OptimizedWorld | null> {
  try {
    const world = await prisma.gameWorld.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        map: true,
        isPublished: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        layers: {
          select: {
            id: true,
            name: true,
            description: true,
            isVisible: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
          },
          orderBy: { zIndex: "asc" },
        },
      },
    });

    if (!world) {
      return null;
    }

    return world as OptimizedWorld;
  } catch (error) {
    console.error("[getWorldById] Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get world with all related data in a single query (pins included)
 * Optimized to fetch world + layers + pins in ONE database call
 * @param id - World ID
 * @returns World with pins, or null if not found
 */
export async function getWorldWithData(id: string) {
  try {
    const world = await prisma.gameWorld.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        map: true,
        isPublished: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        layers: {
          select: {
            id: true,
            name: true,
            description: true,
            isVisible: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
          },
          orderBy: { zIndex: "asc" },
        },
        pins: {
          where: { isVisible: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!world) {
      return null;
    }

    return world;
  } catch (error) {
    console.error("[getWorldWithData] Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get all public worlds
 * @returns Array of public worlds
 */
export async function getAllWorlds() {
  try {
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
  } catch (error) {
    console.error("[getAllWorlds] Failed to fetch worlds:", error);
    return [];
  }
}

/**
 * Get worlds for authenticated user
 * @returns Array of user's worlds
 */
export async function getMyWorlds() {
  try {
    // CRITICAL FIX: Use authenticated user, not random first user!
    const user = await getAuthenticatedUser();

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
  } catch (error) {
    console.error("[getMyWorlds] Failed to fetch user worlds:", error);
    return [];
  }
}

/**
 * Update world title
 * @param id - World ID
 * @param title - New title
 * @returns Result with updated world or error
 */
export async function updateWorldTitle(id: string, title: string): Promise<Result<any>> {
  return safeAsync(async () => {
    const world = await prisma.gameWorld.update({
      where: { id },
      data: { title },
    });

    // Note: Only revalidate if needed for SSR. Client-side cache handles updates.
    revalidatePath("/world/[id]");

    return world;
  }, "updateWorldTitle");
}

/**
 * Update world state (layers, map properties, etc.) for autosave
 * @param worldId - World ID to update
 * @param state - World state object containing layers and other properties
 * @returns Result with updated world or error
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
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }>;
    grid?: boolean;
    snap?: boolean;
    scale?: string;
    pinCount?: number;
  }
): Promise<Result<any>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world exists and user has permission
    await verifyWorldPermission(worldId, user.id);

    // Update layers if provided
    if (state.layers) {
      // Process each layer: create or update
      for (const layer of state.layers) {
        // Skip base map layer - it's a virtual layer that doesn't exist in DB
        if (layer.id === "base-map") {
          continue;
        }

        // Check if layer exists
        const existingLayer = await prisma.mapLayer.findUnique({
          where: { id: layer.id },
        });

        if (existingLayer) {
          // Update existing layer with all fields including position and scale
          await prisma.mapLayer.update({
            where: { id: layer.id },
            data: {
              name: layer.name,
              isVisible: layer.visible,
              opacity: layer.opacity,
              zIndex: layer.zIndex,
              offsetX: layer.offsetX ?? 0,
              offsetY: layer.offsetY ?? 0,
              scale: layer.scale ?? 1.0,
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
              offsetX: layer.offsetX ?? 0,
              offsetY: layer.offsetY ?? 0,
              scale: layer.scale ?? 1.0,
              gameWorldId: worldId,
            },
          });
        }
      }
    }

    // Note: grid, snap, scale are UI-only state stored in Zustand
    // Note: pinCount is used to trigger autosave but not saved to DB

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

    return updatedWorld;
  }, "updateWorldState");
}

/**
 * Upload a new map image for a world
 * @param worldId - World ID to update
 * @param formData - FormData containing the file upload
 * @returns Result with success status and new map URL or error
 */
export async function uploadWorldMap(
  worldId: string,
  formData: FormData
): Promise<Result<{ mapUrl: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world exists and user has permission
    await verifyWorldPermission(worldId, user.id);

    // Get file from formData
    const file = formData.get("file") as File;

    if (!file) {
      throw new FileUploadError("No file provided");
    }

    // Validate file type
    const validTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      throw new FileUploadError("Invalid file type. Please upload a WebP, PNG, or JPEG image.");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new FileUploadError("File size must be less than 10MB");
    }

    // Save file
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      await writeFile(path.join(uploadsDir, ".gitkeep"), "");
    }

    const filePath = path.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const mapPath = `/uploads/${fileName}`;

    // Update database with new map path
    await prisma.gameWorld.update({
      where: { id: worldId },
      data: { map: mapPath },
    });

    // Revalidate the world page to refresh server component
    revalidatePath(`/world/${worldId}`);

    return {
      mapUrl: mapPath,
    };
  }, "uploadWorldMap");
}
