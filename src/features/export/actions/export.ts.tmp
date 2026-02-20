"use server";

import { prisma } from "@/shared/lib/prisma";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";
import type { Pin, MapLayer, LoreEntry } from "@prisma/client";

/**
 * Export format types
 */
export type ExportFormat = "png" | "pdf" | "json";

/**
 * World export data structure
 */
export interface WorldExportData {
  world: {
    id: string;
    title: string;
    description: string | null;
    map: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  };
  layers: MapLayer[];
  pins: Pin[];
  loreEntries: LoreEntry[];
  exportDate: string;
  version: string;
}

/**
 * Get complete world data for export
 * @param worldId - World ID to export
 * @returns Result with world data or error
 */
export async function getWorldExportData(worldId: string): Promise<Result<WorldExportData>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify world exists and user has permission
    await verifyWorldPermission(worldId, user.id);

    // Fetch complete world data
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
      include: {
        layers: {
          orderBy: { zIndex: "asc" },
        },
        pins: {
          orderBy: { createdAt: "desc" },
        },
        loreEntries: {
          orderBy: { title: "asc" },
        },
      },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    // Transform data for export
    const exportData: WorldExportData = {
      world: {
        id: world.id,
        title: world.title,
        description: world.description,
        map: world.map,
        isPublic: world.isPublic,
        createdAt: world.createdAt.toISOString(),
        updatedAt: world.updatedAt.toISOString(),
      },
      layers: world.layers,
      pins: world.pins,
      loreEntries: world.loreEntries,
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    };

    return exportData;
  }, "getWorldExportData");
}
