"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyLayerPermission,
} from "@/shared/lib/server-helpers";
import type { MapLayer } from "@prisma/client";
import { safeLogCollaborationEvent } from "@/features/presence";
import { CollaborationEventType } from "@/shared/lib/presence";

/**
 * Create a new layer for a world
 * @param worldId - World ID to add layer to
 * @param data - Layer data (name, description, zIndex, etc.)
 * @returns Result with created layer or error
 */
export async function createLayer(
  worldId: string,
  data: {
    name: string;
    description?: string;
    type?: "BASE_MAP" | "MARKERS" | "IMAGES" | "REGIONS" | "GROUP" | "CUSTOM";
    isVisible?: boolean;
    locked?: boolean;
    opacity?: number;
    zIndex?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    minZoom?: number;
    maxZoom?: number;
  }
): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify user has permission to edit the world
    await verifyWorldPermission(worldId, user.id);

    // Get the highest zIndex to place new layer on top
    const highestZIndex = await prisma.mapLayer.findFirst({
      where: { gameWorldId: worldId },
      orderBy: { zIndex: "desc" },
      select: { zIndex: true },
    });

    const layer = await prisma.mapLayer.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type ?? "CUSTOM",
        isVisible: data.isVisible ?? true,
        locked: data.locked ?? false,
        opacity: data.opacity ?? 1.0,
        zIndex: data.zIndex ?? (highestZIndex?.zIndex ?? -1) + 1,
        offsetX: data.offsetX ?? 0,
        offsetY: data.offsetY ?? 0,
        scale: data.scale ?? 1.0,
        minZoom: data.minZoom ?? 0,
        maxZoom: data.maxZoom ?? 200,
        gameWorldId: worldId,
      },
    });

    revalidatePath(`/world/${worldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId,
      eventType: CollaborationEventType.LAYER_CREATED,
      targetId: layer.id,
      targetType: "layer",
    });

    return layer;
  }, "createLayer");
}

/**
 * Update a layer's properties
 * @param layerId - Layer ID to update
 * @param data - Partial layer data to update
 * @returns Result with updated layer or error
 */
export async function updateLayer(
  layerId: string,
  data: {
    name?: string;
    description?: string;
    type?: "BASE_MAP" | "MARKERS" | "IMAGES" | "REGIONS" | "GROUP" | "CUSTOM";
    isVisible?: boolean;
    locked?: boolean;
    opacity?: number;
    zIndex?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    minZoom?: number;
    maxZoom?: number;
  }
): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify layer exists and user has permission
    const layer = await verifyLayerPermission(layerId, user.id);

    const updatedLayer = await prisma.mapLayer.update({
      where: { id: layerId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
        ...(data.locked !== undefined && { locked: data.locked }),
        ...(data.opacity !== undefined && { opacity: data.opacity }),
        ...(data.zIndex !== undefined && { zIndex: data.zIndex }),
        ...(data.offsetX !== undefined && { offsetX: data.offsetX }),
        ...(data.offsetY !== undefined && { offsetY: data.offsetY }),
        ...(data.scale !== undefined && { scale: data.scale }),
        ...(data.minZoom !== undefined && { minZoom: data.minZoom }),
        ...(data.maxZoom !== undefined && { maxZoom: data.maxZoom }),
      },
    });

    revalidatePath(`/world/${layer.gameWorldId}`);

    // Log collaboration event - use LAYER_VISIBILITY_CHANGED if only visibility changed
    const eventType = data.isVisible !== undefined && Object.keys(data).length === 1
      ? CollaborationEventType.LAYER_VISIBILITY_CHANGED
      : CollaborationEventType.LAYER_UPDATED;

    await safeLogCollaborationEvent({
      worldId: layer.gameWorldId,
      eventType,
      targetId: layerId,
      targetType: "layer",
    });

    return updatedLayer;
  }, "updateLayer");
}

/**
 * Update layer position (offsetX and offsetY)
 * Optimized for drag operations - updates only position fields
 * @param layerId - Layer ID to update
 * @param offsetX - X offset in pixels
 * @param offsetY - Y offset in pixels
 * @returns Result with updated layer or error
 */
export async function updateLayerPosition(
  layerId: string,
  offsetX: number,
  offsetY: number
): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify layer exists and user has permission
    await verifyLayerPermission(layerId, user.id);

    const updatedLayer = await prisma.mapLayer.update({
      where: { id: layerId },
      data: { offsetX, offsetY },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: updatedLayer.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: layerId,
      targetType: "layer",
      eventData: { field: "position" },
    });

    // No revalidatePath needed - Zustand store manages client-side state
    // This optimization prevents unnecessary page refreshes during drag operations

    return updatedLayer;
  }, "updateLayerPosition");
}

/**
 * Update layer scale
 * @param layerId - Layer ID to update
 * @param scale - Scale factor (0.5 - 2.0)
 * @returns Result with updated layer or error
 */
export async function updateLayerScale(layerId: string, scale: number): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify layer exists and user has permission
    await verifyLayerPermission(layerId, user.id);

    const updatedLayer = await prisma.mapLayer.update({
      where: { id: layerId },
      data: { scale },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: updatedLayer.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: layerId,
      targetType: "layer",
      eventData: { field: "scale" },
    });

    // No revalidatePath needed - Zustand store manages client-side state

    return updatedLayer;
  }, "updateLayerScale");
}

/**
 * Update layer z-index (for reordering layers)
 * @param layerId - Layer ID to update
 * @param zIndex - New z-index value
 * @returns Result with updated layer or error
 */
export async function updateLayerZIndex(layerId: string, zIndex: number): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify layer exists and user has permission
    await verifyLayerPermission(layerId, user.id);

    const updatedLayer = await prisma.mapLayer.update({
      where: { id: layerId },
      data: { zIndex },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: updatedLayer.gameWorldId,
      eventType: CollaborationEventType.LAYER_UPDATED,
      targetId: layerId,
      targetType: "layer",
      eventData: { field: "zIndex" },
    });

    // No revalidatePath needed - Zustand store manages client-side state

    return updatedLayer;
  }, "updateLayerZIndex");
}

/**
 * Delete a layer
 * @param layerId - Layer ID to delete
 * @returns Result with deleted layer or error
 */
export async function deleteLayer(layerId: string): Promise<Result<MapLayer>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify layer exists and user has permission
    const layer = await verifyLayerPermission(layerId, user.id);

    const deletedLayer = await prisma.mapLayer.delete({
      where: { id: layerId },
    });

    revalidatePath(`/world/${layer.gameWorldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: layer.gameWorldId,
      eventType: CollaborationEventType.LAYER_DELETED,
      targetId: layerId,
      targetType: "layer",
    });

    return deletedLayer;
  }, "deleteLayer");
}

/**
 * Batch update multiple layers (for z-index reordering)
 * @param updates - Array of layer updates
 * @returns Result with updated layers or error
 */
export async function batchUpdateLayers(
  updates: Array<{
    id: string;
    zIndex: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }>
): Promise<Result<MapLayer[]>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission for first layer (assumes all layers belong to same world)
    let worldId: string | null = null;
    if (updates.length > 0) {
      const firstLayer = await verifyLayerPermission(updates[0].id, user.id);
      worldId = firstLayer.gameWorldId;
    }

    // Update all layers in a transaction
    const updatedLayers = await prisma.$transaction(
      updates.map((update) =>
        prisma.mapLayer.update({
          where: { id: update.id },
          data: {
            zIndex: update.zIndex,
            ...(update.offsetX !== undefined && { offsetX: update.offsetX }),
            ...(update.offsetY !== undefined && { offsetY: update.offsetY }),
            ...(update.scale !== undefined && { scale: update.scale }),
          },
        })
      )
    );

    // Log collaboration event for batch reorder
    if (worldId) {
      await safeLogCollaborationEvent({
        worldId,
        eventType: CollaborationEventType.LAYER_UPDATED,
        targetType: "layer",
        eventData: { count: updates.length, field: "reorder" },
      });
    }

    return updatedLayers;
  }, "batchUpdateLayers");
}
