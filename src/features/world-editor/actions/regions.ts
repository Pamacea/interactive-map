"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyLayerPermission,
} from "@/shared/lib/server-helpers";
import { safeLogCollaborationEvent } from "@/features/presence/actions";
import { CollaborationEventType } from "@/shared/lib/presence";

/**
 * Create a new region in a layer
 * @param layerId - Layer ID to add region to
 * @param data - Region data
 * @returns Result with created region or error
 */
export async function createRegion(
  layerId: string,
  data: {
    name: string;
    type: "RECTANGLE" | "CIRCLE" | "POLYGON";
    coordinates: any;
    description?: string;
    color?: string;
    opacity?: number;
    borderWidth?: number;
  }
): Promise<Result<any>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify layer exists and belongs to user's world
    const layer = await prisma.mapLayer.findUnique({
      where: { id: layerId },
      include: { gameWorld: true },
    });

    if (!layer) {
      throw new Error("Layer not found");
    }

    await verifyWorldPermission(layer.gameWorldId, user.id);

    // Verify layer type accepts regions
    if (layer.type !== "REGIONS" && layer.type !== "CUSTOM" && layer.type !== "BASE_MAP") {
      // Allow regions on BASE_MAP, REGIONS, and CUSTOM layers
    }

    const region = await prisma.region.create({
      data: {
        name: data.name,
        type: data.type,
        coordinates: data.coordinates,
        description: data.description,
        color: data.color || "#3b82f6",
        opacity: data.opacity ?? 0.3,
        borderWidth: data.borderWidth ?? 2,
        layerId,
        gameWorldId: layer.gameWorldId,
      },
    });

    revalidatePath(`/world/${layer.gameWorldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: layer.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: region.id,
      targetType: "region",
    });

    return region;
  }, "createRegion");
}

/**
 * Update a region
 * @param regionId - Region ID to update
 * @param data - Partial region data to update
 * @returns Result with updated region or error
 */
export async function updateRegion(
  regionId: string,
  data: {
    name?: string;
    coordinates?: any;
    description?: string;
    visible?: boolean;
    locked?: boolean;
    color?: string;
    opacity?: number;
    borderWidth?: number;
  }
): Promise<Result<any>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify region exists and get its layer
    const region = await prisma.region.findUnique({
      where: { id: regionId },
      include: { layer: true },
    });

    if (!region) {
      throw new Error("Region not found");
    }

    // Verify user has permission to edit the world
    await verifyWorldPermission(region.gameWorldId, user.id);

    const updatedRegion = await prisma.region.update({
      where: { id: regionId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.coordinates !== undefined && { coordinates: data.coordinates }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.visible !== undefined && { visible: data.visible }),
        ...(data.locked !== undefined && { locked: data.locked }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.opacity !== undefined && { opacity: data.opacity }),
        ...(data.borderWidth !== undefined && { borderWidth: data.borderWidth }),
      },
    });

    revalidatePath(`/world/${region.gameWorldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: region.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: regionId,
      targetType: "region",
    });

    return updatedRegion;
  }, "updateRegion");
}

/**
 * Update region position/coordinates (for drag operations)
 * @param regionId - Region ID to update
 * @param coordinates - New coordinates
 * @returns Result with updated region or error
 */
export async function updateRegionPosition(
  regionId: string,
  coordinates: any
): Promise<Result<any>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      throw new Error("Region not found");
    }

    await verifyWorldPermission(region.gameWorldId, user.id);

    const updatedRegion = await prisma.region.update({
      where: { id: regionId },
      data: { coordinates },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: region.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: regionId,
      targetType: "region",
      eventData: { field: "position" },
    });

    return updatedRegion;
  }, "updateRegionPosition");
}

/**
 * Delete a region
 * @param regionId - Region ID to delete
 * @returns Result with deleted region or error
 */
export async function deleteRegion(regionId: string): Promise<Result<{ regionId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      throw new Error("Region not found");
    }

    await verifyWorldPermission(region.gameWorldId, user.id);

    await prisma.region.delete({
      where: { id: regionId },
    });

    revalidatePath(`/world/${region.gameWorldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: region.gameWorldId,
      eventType: CollaborationEventType.LAYER_DELETED,
      targetId: regionId,
      targetType: "region",
    });

    return { regionId };
  }, "deleteRegion");
}

/**
 * Toggle region visibility
 * @param regionId - Region ID
 * @returns Result with updated region or error
 */
export async function toggleRegionVisibility(regionId: string): Promise<Result<any>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      throw new Error("Region not found");
    }

    await verifyWorldPermission(region.gameWorldId, user.id);

    const updated = await prisma.region.update({
      where: { id: regionId },
      data: { visible: !region.visible },
    });

    revalidatePath(`/world/${region.gameWorldId}`);

    return updated;
  }, "toggleRegionVisibility");
}

/**
 * Get regions for a layer
 * @param layerId - Layer ID
 * @returns Array of regions
 */
export async function getRegionsByLayer(layerId: string) {
  try {
    const regions = await prisma.region.findMany({
      where: { layerId },
      orderBy: { createdAt: "asc" },
    });
    return regions;
  } catch (error) {
    console.error("[getRegionsByLayer] Failed to fetch regions:", error);
    return [];
  }
}

/**
 * Get regions for a world
 * @param gameWorldId - World ID
 * @returns Array of regions with layer info
 */
export async function getRegionsByWorld(gameWorldId: string) {
  try {
    const regions = await prisma.region.findMany({
      where: { gameWorldId },
      include: {
        layer: {
          select: {
            id: true,
            name: true,
            isVisible: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return regions;
  } catch (error) {
    console.error("[getRegionsByWorld] Failed to fetch regions:", error);
    return [];
  }
}

/**
 * Move an item (pin/image/region) to a different layer
 * @param itemId - Item ID
 * @param itemType - Type of item ('pin' | 'image' | 'region')
 * @param targetLayerId - Target layer ID
 * @returns Result with updated item or error
 */
export async function moveItemToLayer(
  itemId: string,
  itemType: "pin" | "image" | "region",
  targetLayerId: string
): Promise<Result<any>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify target layer exists
    const targetLayer = await prisma.mapLayer.findUnique({
      where: { id: targetLayerId },
    });

    if (!targetLayer) {
      throw new Error("Target layer not found");
    }

    let result;

    switch (itemType) {
      case "pin": {
        const pin = await prisma.pin.findUnique({
          where: { id: itemId },
        });

        if (!pin) {
          throw new Error("Pin not found");
        }

        await verifyWorldPermission(pin.gameWorldId, user.id);

        // Verify target layer belongs to the same world
        if (targetLayer.gameWorldId !== pin.gameWorldId) {
          throw new Error("Target layer must belong to the same world");
        }

        result = await prisma.pin.update({
          where: { id: itemId },
          data: { layerId: targetLayerId },
        });

        revalidatePath(`/world/${pin.gameWorldId}`);
        break;
      }

      case "image": {
        const image = await prisma.galleryItem.findUnique({
          where: { id: itemId },
        });

        if (!image) {
          throw new Error("Image not found");
        }

        // Verify target layer belongs to the same world (check via worldId)
        if (image.worldId && targetLayer.gameWorldId !== image.worldId) {
          throw new Error("Target layer must belong to the same world");
        }

        result = await prisma.galleryItem.update({
          where: { id: itemId },
          data: { layerId: targetLayerId },
        });

        if (image.worldId) {
          revalidatePath(`/world/${image.worldId}`);
        }
        break;
      }

      case "region": {
        const region = await prisma.region.findUnique({
          where: { id: itemId },
        });

        if (!region) {
          throw new Error("Region not found");
        }

        await verifyWorldPermission(region.gameWorldId, user.id);

        // Verify target layer belongs to the same world
        if (targetLayer.gameWorldId !== region.gameWorldId) {
          throw new Error("Target layer must belong to the same world");
        }

        result = await prisma.region.update({
          where: { id: itemId },
          data: { layerId: targetLayerId },
        });

        revalidatePath(`/world/${region.gameWorldId}`);
        break;
      }

      default:
        throw new Error("Invalid item type");
    }

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: targetLayer.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: itemId,
      targetType: itemType,
      eventData: { action: "movedToLayer", targetLayerId },
    });

    return result;
  }, "moveItemToLayer");
}

/**
 * Get layer content counts (pins, images, regions)
 * @param layerId - Layer ID
 * @returns Object with counts
 */
export async function getLayerContentCounts(layerId: string) {
  try {
    const [pinsCount, imagesCount, regionsCount] = await Promise.all([
      prisma.pin.count({ where: { layerId } }),
      prisma.galleryItem.count({ where: { layerId } }),
      prisma.region.count({ where: { layerId } }),
    ]);

    return {
      pins: pinsCount,
      images: imagesCount,
      regions: regionsCount,
      total: pinsCount + imagesCount + regionsCount,
    };
  } catch (error) {
    console.error("[getLayerContentCounts] Failed to get counts:", error);
    return { pins: 0, images: 0, regions: 0, total: 0 };
  }
}

/**
 * Get all layer content (pins, images, regions)
 * @param layerId - Layer ID
 * @returns Object with arrays of content
 */
export async function getLayerContent(layerId: string) {
  try {
    const [pins, images, regions] = await Promise.all([
      prisma.pin.findMany({
        where: { layerId },
        select: {
          id: true,
          title: true,
          pinType: true,
          latitude: true,
          longitude: true,
          isVisible: true,
        },
      }),
      prisma.galleryItem.findMany({
        where: { layerId },
        select: {
          id: true,
          title: true,
          type: true,
          imageUrl: true,
        },
      }),
      prisma.region.findMany({
        where: { layerId },
        select: {
          id: true,
          name: true,
          type: true,
          visible: true,
          color: true,
        },
      }),
    ]);

    return { pins, images, regions };
  } catch (error) {
    console.error("[getLayerContent] Failed to get content:", error);
    return { pins: [], images: [], regions: [] };
  }
}
