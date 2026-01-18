/**
 * Server action helper utilities
 * Reduces code duplication in server actions
 */

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthenticationError, AuthorizationError, NotFoundError } from "@/lib/errors";

/**
 * Get authenticated user from session
 * @throws AuthenticationError if not authenticated or user not found
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new AuthenticationError("User not found");
  }

  return user;
}

/**
 * Verify user has permission to access a world
 * @param worldId - World ID to check
 * @param userId - User ID to verify
 * @throws NotFoundError if world not found
 * @throws AuthorizationError if user lacks permission
 */
export async function verifyWorldPermission(worldId: string, userId: string) {
  const world = await prisma.gameWorld.findUnique({
    where: { id: worldId },
  });

  if (!world) {
    throw new NotFoundError("World");
  }

  // World owner always has full permissions
  if (world.userId === userId) {
    return world;
  }

  // Check if user is a member with EDITOR or OWNER permissions
  const member = await prisma.worldMember.findFirst({
    where: {
      gameWorldId: worldId,
      userId: userId,
      permission: { in: ["EDITOR", "OWNER"] },
    },
  });

  if (!member) {
    throw new AuthorizationError("You don't have permission to access this world");
  }

  return world;
}

/**
 * Verify user has permission to access a pin
 * @param pinId - Pin ID to check
 * @param userId - User ID to verify
 * @throws NotFoundError if pin not found
 * @throws AuthorizationError if user lacks permission
 */
export async function verifyPinPermission(pinId: string, userId: string) {
  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    include: {
      gameWorld: true,
    },
  });

  if (!pin) {
    throw new NotFoundError("Pin");
  }

  if (pin.userId !== userId) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: pin.gameWorldId,
        userId: userId,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new AuthorizationError("You don't have permission to access this pin");
    }
  }

  return pin;
}

/**
 * Verify user has permission to access a layer
 * @param layerId - Layer ID to check
 * @param userId - User ID to verify
 * @throws NotFoundError if layer not found
 * @throws AuthorizationError if user lacks permission
 */
export async function verifyLayerPermission(layerId: string, userId: string) {
  const layer = await prisma.mapLayer.findUnique({
    where: { id: layerId },
    include: { gameWorld: true },
  });

  if (!layer) {
    throw new NotFoundError("Layer");
  }

  if (layer.gameWorld.userId !== userId) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: layer.gameWorldId,
        userId: userId,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new AuthorizationError("You don't have permission to access this world");
    }
  }

  return layer;
}

/**
 * Verify user has permission to access a lore entry
 * @param loreId - Lore entry ID to check
 * @param userId - User ID to verify
 * @throws NotFoundError if lore entry not found
 * @throws AuthorizationError if user lacks permission
 */
export async function verifyLorePermission(loreId: string, userId: string) {
  const lore = await prisma.loreEntry.findUnique({
    where: { id: loreId },
  });

  if (!lore) {
    throw new NotFoundError("Lore entry");
  }

  if (lore.userId !== userId) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: lore.gameWorldId,
        userId: userId,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new AuthorizationError("You don't have permission to access this lore entry");
    }
  }

  return lore;
}

/**
 * Verify user has permission to access a gallery item
 * @param itemId - Gallery item ID to check
 * @param userId - User ID to verify
 * @throws NotFoundError if gallery item not found
 * @throws AuthorizationError if user lacks permission
 */
export async function verifyGalleryPermission(itemId: string, userId: string) {
  const item = await prisma.galleryItem.findUnique({
    where: { id: itemId },
    include: {
      pin: true,
      loreEntry: true,
    },
  });

  if (!item) {
    throw new NotFoundError("Gallery item");
  }

  const worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId;

  if (worldId) {
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (world?.userId !== userId) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: worldId,
          userId: userId,
          permission: { in: ["EDITOR", "OWNER"] },
        },
      });

      if (!member) {
        throw new AuthorizationError("You don't have permission to access this gallery item");
      }
    }
  }

  return item;
}
