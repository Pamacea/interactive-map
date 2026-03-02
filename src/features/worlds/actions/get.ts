"use server";

import { prisma } from "@/shared/lib/prisma";
import { unstable_cache } from "next/cache";
import type { OptimizedWorld } from "@/types/world.type";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("worlds:get");

const CACHE_TAGS = {
  WORLDS: "worlds",
  PUBLIC_WORLDS: "public-worlds",
};

/**
 * Get world by ID
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
            type: true,
            isVisible: true,
            locked: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
            minZoom: true,
            maxZoom: true,
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
    logger.error("Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get world with all related data in a single query (pins included)
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
            type: true,
            isVisible: true,
            locked: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
            minZoom: true,
            maxZoom: true,
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
    logger.error("Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get all public worlds with optimized query and caching
 */
export async function getAllWorlds(options?: {
  limit?: number;
  offset?: number;
  orderBy?: "createdAt" | "updatedAt";
}) {
  const limit = Math.min(Math.max(options?.limit ?? 24, 1), 100);
  const offset = Math.max(options?.offset ?? 0, 0);
  const orderBy = options?.orderBy ?? "createdAt";

  const getCachedWorlds = unstable_cache(
    async () => {
      const worlds = await prisma.gameWorld.findMany({
        where: {
          isPublic: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          map: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
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
          [orderBy]: "desc",
        },
        take: limit,
        skip: offset,
      });

      return worlds;
    },
    [CACHE_TAGS.PUBLIC_WORLDS, `${limit}-${offset}-${orderBy}`],
    {
      revalidate: 300,
      tags: [CACHE_TAGS.PUBLIC_WORLDS],
    }
  );

  try {
    return await getCachedWorlds();
  } catch (error) {
    logger.error("Failed to fetch worlds:", error);
    return [];
  }
}

/**
 * Get worlds for authenticated user
 */
export async function getMyWorlds() {
  try {
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
    logger.error("Failed to fetch worlds:", error);
    return [];
  }
}

/**
 * Get all members of a world
 */
export async function getWorldMembers(worldId: string) {
  try {
    const members = await prisma.worldMember.findMany({
      where: { gameWorldId: worldId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return members;
  } catch (error) {
    logger.error("Failed to fetch worlds:", error);
    return [];
  }
}

/**
 * Get pending invites for a world
 */
export async function getPendingInvites(
  worldId: string
): Promise<Result<Array<{ id: string; email: string | null; permission: string; token: string; expiresAt: Date }>>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id, "OWNER");

    const invites = await prisma.worldInvite.findMany({
      where: {
        worldId: worldId,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      permission: invite.permission,
      token: invite.token,
      expiresAt: invite.expiresAt,
    }));
  }, "getPendingInvites");
}
