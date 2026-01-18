"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Create a new layer for a world
 * @param worldId - World ID to add layer to
 * @param data - Layer data (name, description, zIndex, etc.)
 * @returns Created layer
 * @throws Error if user not authorized or creation fails
 */
export async function createLayer(
  worldId: string,
  data: {
    name: string;
    description?: string;
    isVisible?: boolean;
    opacity?: number;
    zIndex?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[createLayer] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[createLayer] User not found in database");
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
      isVisible: data.isVisible ?? true,
      opacity: data.opacity ?? 1.0,
      zIndex: data.zIndex ?? (highestZIndex?.zIndex ?? -1) + 1,
      offsetX: data.offsetX ?? 0,
      offsetY: data.offsetY ?? 0,
      scale: data.scale ?? 1.0,
      gameWorldId: worldId,
    },
  });

  revalidatePath(`/world/${worldId}`);

  return layer;
}

/**
 * Update a layer's properties
 * @param layerId - Layer ID to update
 * @param data - Partial layer data to update
 * @returns Updated layer
 * @throws Error if user not authorized or update fails
 */
export async function updateLayer(
  layerId: string,
  data: {
    name?: string;
    description?: string;
    isVisible?: boolean;
    opacity?: number;
    zIndex?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[updateLayer] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[updateLayer] User not found in database");
    throw new Error("User not found");
  }

  // Check if layer exists
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new Error("Layer not found");
  }

  // Check ownership or editor permission
  if (layer.gameWorld.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  const updatedLayer = await prisma.mapLayer.update({
    where: { id: layerId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      ...(data.opacity !== undefined && { opacity: data.opacity }),
      ...(data.zIndex !== undefined && { zIndex: data.zIndex }),
      ...(data.offsetX !== undefined && { offsetX: data.offsetX }),
      ...(data.offsetY !== undefined && { offsetY: data.offsetY }),
      ...(data.scale !== undefined && { scale: data.scale }),
    },
  });

  revalidatePath(`/world/${layer.gameWorldId}`);

  return updatedLayer;
}

/**
 * Update layer position (offsetX and offsetY)
 * Optimized for drag operations - updates only position fields
 * @param layerId - Layer ID to update
 * @param offsetX - X offset in pixels
 * @param offsetY - Y offset in pixels
 * @returns Updated layer
 * @throws Error if user not authorized or update fails
 */
export async function updateLayerPosition(
  layerId: string,
  offsetX: number,
  offsetY: number
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[updateLayerPosition] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[updateLayerPosition] User not found in database");
    throw new Error("User not found");
  }

  // Check if layer exists
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new Error("Layer not found");
  }

  // Check ownership or editor permission
  if (layer.gameWorld.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  const updatedLayer = await prisma.mapLayer.update({
    where: { id: layerId },
    data: { offsetX, offsetY },
  });

  // No revalidatePath needed - Zustand store manages client-side state
  // This optimization prevents unnecessary page refreshes during drag operations

  return updatedLayer;
}

/**
 * Update layer scale
 * @param layerId - Layer ID to update
 * @param scale - Scale factor (0.5 - 2.0)
 * @returns Updated layer
 * @throws Error if user not authorized or update fails
 */
export async function updateLayerScale(layerId: string, scale: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[updateLayerScale] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[updateLayerScale] User not found in database");
    throw new Error("User not found");
  }

  // Check if layer exists
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new Error("Layer not found");
  }

  // Check ownership or editor permission
  if (layer.gameWorld.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  const updatedLayer = await prisma.mapLayer.update({
    where: { id: layerId },
    data: { scale },
  });

  // No revalidatePath needed - Zustand store manages client-side state

  return updatedLayer;
}

/**
 * Update layer z-index (for reordering layers)
 * @param layerId - Layer ID to update
 * @param zIndex - New z-index value
 * @returns Updated layer
 * @throws Error if user not authorized or update fails
 */
export async function updateLayerZIndex(layerId: string, zIndex: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[updateLayerZIndex] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[updateLayerZIndex] User not found in database");
    throw new Error("User not found");
  }

  // Check if layer exists
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new Error("Layer not found");
  }

  // Check ownership or editor permission
  if (layer.gameWorld.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  const updatedLayer = await prisma.mapLayer.update({
    where: { id: layerId },
    data: { zIndex },
  });

  // No revalidatePath needed - Zustand store manages client-side state

  return updatedLayer;
}

/**
 * Delete a layer
 * @param layerId - Layer ID to delete
 * @returns Deleted layer
 * @throws Error if user not authorized or deletion fails
 */
export async function deleteLayer(layerId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[deleteLayer] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[deleteLayer] User not found in database");
    throw new Error("User not found");
  }

  // Check if layer exists
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new Error("Layer not found");
  }

  // Check ownership or editor permission
  if (layer.gameWorld.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this world");
    }
  }

  const deletedLayer = await prisma.mapLayer.delete({
    where: { id: layerId },
  });

  revalidatePath(`/world/${layer.gameWorldId}`);

  return deletedLayer;
}

/**
 * Batch update multiple layers (for z-index reordering)
 * @param updates - Array of layer updates
 * @returns Updated layers
 * @throws Error if user not authorized or update fails
 */
export async function batchUpdateLayers(
  updates: Array<{
    id: string;
    zIndex: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  }>
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[batchUpdateLayers] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[batchUpdateLayers] User not found in database");
    throw new Error("User not found");
  }

  // Verify permission for first layer (assumes all layers belong to same world)
  if (updates.length > 0) {
    const firstLayer = await prisma.mapLayer.findUnique({
      where: { id: updates[0].id },
      include: { gameWorld: true },
    });

    if (!firstLayer) {
      throw new Error("Layer not found");
    }

    if (firstLayer.gameWorld.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: firstLayer.gameWorldId,
          userId: user.id,
          permission: { in: ["EDITOR", "OWNER"] },
        },
      });

      if (!member) {
        throw new Error("Unauthorized: You don't have permission to edit this world");
      }
    }
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

  return updatedLayers;
}
