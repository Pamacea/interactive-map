/**
 * Migration: Layers as Groups
 *
 * This script handles the migration from the old layer system to the new
 * "layers as groups" architecture where:
 * - Layers contain pins, images, and regions
 * - A "Base Map" layer is created for each world
 * - Orphaned pins are assigned to a default layer
 *
 * Run this after applying the Prisma schema changes.
 */

import { prisma } from "@/lib/prisma";

interface MigrationResult {
  success: boolean;
  worldsProcessed: number;
  baseMapLayersCreated: number;
  defaultLayersCreated: number;
  pinsAssigned: number;
  errors: string[];
}

/**
 * Run the migration
 */
export async function runLayersAsGroupsMigration(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    worldsProcessed: 0,
    baseMapLayersCreated: 0,
    defaultLayersCreated: 0,
    pinsAssigned: 0,
    errors: [],
  };

  try {
    console.log("[Migration] Starting Layers as Groups migration...");

    // Get all worlds
    const worlds = await prisma.gameWorld.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    console.log(`[Migration] Found ${worlds.length} worlds to process`);

    for (const world of worlds) {
      try {
        await migrateWorld(world.id);
        result.worldsProcessed++;
      } catch (error) {
        const errorMsg = `Failed to migrate world ${world.id}: ${error}`;
        result.errors.push(errorMsg);
        console.error(`[Migration] ${errorMsg}`);
      }
    }

    console.log("[Migration] Migration completed:", result);
    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
    console.error("[Migration] Fatal error:", error);
    return result;
  }
}

/**
 * Migrate a single world
 */
async function migrateWorld(worldId: string) {
  console.log(`[Migration] Processing world ${worldId}...`);

  // Check if world already has a Base Map layer
  const existingBaseMap = await prisma.mapLayer.findFirst({
    where: {
      gameWorldId: worldId,
      type: "BASE_MAP",
    },
  });

  let baseMapLayerId: string;

  if (existingBaseMap) {
    console.log(`[Migration] World ${worldId} already has a Base Map layer`);
    baseMapLayerId = existingBaseMap.id;
  } else {
    // Get the lowest zIndex to place Base Map at the bottom
    const lowestZIndex = await prisma.mapLayer.findFirst({
      where: { gameWorldId: worldId },
      orderBy: { zIndex: "asc" },
      select: { zIndex: true },
    });

    const baseZIndex = (lowestZIndex?.zIndex ?? 0) - 1;

    // Create Base Map layer
    const baseMapLayer = await prisma.mapLayer.create({
      data: {
        name: "Base Map",
        type: "BASE_MAP",
        description: "The main map background",
        isVisible: true,
        locked: true,
        opacity: 1.0,
        zIndex: baseZIndex,
        offsetX: 0,
        offsetY: 0,
        scale: 1.0,
        minZoom: 0,
        maxZoom: 200,
        gameWorldId: worldId,
      },
    });

    baseMapLayerId = baseMapLayer.id;
    console.log(`[Migration] Created Base Map layer ${baseMapLayerId} for world ${worldId}`);
  }

  // Check for existing custom layers that should be typed
  const existingLayers = await prisma.mapLayer.findMany({
    where: {
      gameWorldId: worldId,
      type: "CUSTOM", // Old layers without type will default to CUSTOM
    },
    include: {
      _count: {
        select: { pins: true },
      },
    },
  });

  // Type layers based on their content
  for (const layer of existingLayers) {
    if (layer._count.pins > 0) {
      await prisma.mapLayer.update({
        where: { id: layer.id },
        data: { type: "MARKERS" },
      });
      console.log(`[Migration] Typed layer ${layer.id} as MARKERS (${layer._count.pins} pins)`);
    }
  }

  // Find orphaned pins (pins without layerId)
  const orphanedPins = await prisma.pin.findMany({
    where: {
      gameWorldId: worldId,
      layerId: null,
    },
    take: 100, // Process in batches
  });

  if (orphanedPins.length > 0) {
    // Create or find a default layer for orphaned pins
    let defaultLayer = await prisma.mapLayer.findFirst({
      where: {
        gameWorldId: worldId,
        name: "Default Markers",
      },
    });

    if (!defaultLayer) {
      // Get highest zIndex
      const highestZIndex = await prisma.mapLayer.findFirst({
        where: { gameWorldId: worldId },
        orderBy: { zIndex: "desc" },
        select: { zIndex: true },
      });

      defaultLayer = await prisma.mapLayer.create({
        data: {
          name: "Default Markers",
          type: "MARKERS",
          description: "Default layer for pins",
          isVisible: true,
          locked: false,
          opacity: 1.0,
          zIndex: (highestZIndex?.zIndex ?? 0) + 1,
          offsetX: 0,
          offsetY: 0,
          scale: 1.0,
          minZoom: 0,
          maxZoom: 200,
          gameWorldId: worldId,
        },
      });
      console.log(`[Migration] Created Default Markers layer ${defaultLayer.id}`);
    }

    // Assign orphaned pins to default layer
    await prisma.pin.updateMany({
      where: {
        id: { in: orphanedPins.map((p) => p.id) },
      },
      data: {
        layerId: defaultLayer.id,
      },
    });

    console.log(`[Migration] Assigned ${orphanedPins.length} orphaned pins to default layer`);
  }

  console.log(`[Migration] Successfully migrated world ${worldId}`);
}

/**
 * API route handler for running the migration
 * This can be called via /api/migrations/layers-as-groups
 */
export async function POST() {
  try {
    const _result = await runLayersAsGroupsMigration();

    return Response.json({
      success: result.success,
      data: result,
      message: result.success
        ? "Migration completed successfully"
        : "Migration completed with errors",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
