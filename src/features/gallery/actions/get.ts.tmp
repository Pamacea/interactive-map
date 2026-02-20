"use server";

import { prisma } from "@/shared/lib/prisma";

/**
 * Get a gallery item by ID
 */
export async function getGalleryItemById(id: string) {
  try {
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id },
      include: {
        pin: {
          select: {
            id: true,
            title: true,
          },
        },
        loreEntry: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return galleryItem;
  } catch {
    return null;
  }
}

/**
 * Get all gallery items for a world (for tag autosuggest)
 */
export async function getGalleryItemsByWorld(gameWorldId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: {
        OR: [
          { pin: { gameWorldId } },
          { loreEntry: { gameWorldId } },
          { worldId: gameWorldId },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return galleryItems;
  } catch {
    return [];
  }
}

/**
 * Get gallery items by pin ID
 */
export async function getGalleryItemsByPin(pinId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { pinId },
      orderBy: { order: "asc" },
    });

    return galleryItems;
  } catch {
    return [];
  }
}

/**
 * Get gallery items by lore entry ID
 */
export async function getGalleryItemsByLore(loreEntryId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { loreEntryId },
      orderBy: { order: "asc" },
    });

    return galleryItems;
  } catch {
    return [];
  }
}

/**
 * Get all gallery items for a world (with worldId support)
 */
export async function getGalleryItemsByWorldWithDirect(gameWorldId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: {
        OR: [
          { pin: { gameWorldId } },
          { loreEntry: { gameWorldId } },
          { worldId: gameWorldId },
        ],
      },
      orderBy: {
        order: "asc",
      },
      include: {
        pin: {
          select: {
            id: true,
            title: true,
          },
        },
        loreEntry: {
          select: {
            id: true,
            title: true,
          },
        },
        collections: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return galleryItems;
  } catch {
    return [];
  }
}

/**
 * Get all collections for a world
 */
export async function getCollectionsByWorld(worldId: string) {
  try {
    const collections = await prisma.galleryCollection.findMany({
      where: { worldId },
      include: {
        items: {
          include: {
            galleryItem: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                type: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return collections.map((collection) => ({
      ...collection,
      itemCount: collection.items.length,
    }));
  } catch {
    return [];
  }
}

/**
 * Search gallery items by tags
 */
export async function searchGalleryByTags(worldId: string, tags: string[]) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: {
        worldId,
        tags: { hasSome: tags },
      },
      include: {
        pin: {
          select: {
            id: true,
            title: true,
          },
        },
        loreEntry: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return items;
  } catch {
    return [];
  }
}
