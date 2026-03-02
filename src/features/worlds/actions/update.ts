"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import {
  safeAsync,
  FileUploadError,
  type Result,
} from "@/shared/lib/errors";
import type { GameWorld } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";

/**
 * Update world title
 */
export async function updateWorldTitle(id: string, title: string): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(id, user.id);

    const updated = await prisma.gameWorld.update({
      where: { id },
      data: { title },
    });

    revalidatePath(`/world/${id}`);

    return updated;
  }, "updateWorldTitle");
}

/**
 * Update world description
 */
export async function updateWorldDescription(id: string, description: string | null): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(id, user.id);

    const updated = await prisma.gameWorld.update({
      where: { id },
      data: { description: description ?? null },
    });

    revalidatePath(`/world/${id}`);

    return updated;
  }, "updateWorldDescription");
}

/**
 * Update world background color
 */
export async function updateWorldBackgroundColor(id: string, backgroundColor: string): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(id, user.id);

    const updated = await prisma.gameWorld.update({
      where: { id },
      data: { backgroundColor },
    });

    revalidatePath(`/world/${id}`);

    return updated;
  }, "updateWorldBackgroundColor");
}

/**
 * Update world state (layers, map properties, etc.) for autosave
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
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id);

    if (state.layers) {
      for (const layer of state.layers) {
        if (layer.id === "base-map") {
          continue;
        }

        const existingLayer = await prisma.mapLayer.findUnique({
          where: { id: layer.id },
        });

        if (existingLayer) {
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

    const updatedWorld = await prisma.gameWorld.findUnique({
      where: { id: worldId },
      include: {
        layers: {
          orderBy: { zIndex: "asc" },
        },
      },
    });

    return updatedWorld;
  }, "updateWorldState");
}

/**
 * Upload a new map image for a world
 */
export async function uploadWorldMap(
  worldId: string,
  formData: FormData
): Promise<Result<{ mapUrl: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id);

    const file = formData.get("file") as File;

    if (!file) {
      throw new FileUploadError("No file provided");
    }

    const validTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      throw new FileUploadError("Invalid file type. Please upload a WebP, PNG, or JPEG image.");
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new FileUploadError("File size must be less than 10MB");
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadsDir)) {
      await writeFile(path.join(uploadsDir, ".gitkeep"), "");
    }

    const filePath = path.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const mapPath = `/uploads/${fileName}`;

    await prisma.gameWorld.update({
      where: { id: worldId },
      data: { map: mapPath },
    });

    revalidatePath(`/world/${worldId}`);

    return {
      mapUrl: mapPath,
    };
  }, "uploadWorldMap");
}
