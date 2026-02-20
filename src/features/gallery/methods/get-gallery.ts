/**
 * Gallery Methods - Get Gallery Items
 *
 * Server Action wrappers for fetching gallery items
 */

import { prisma } from "@/shared/lib/prisma";

// Unused imports kept for potential future use
// import { safeAsync, type Result } from "@/shared/lib/errors";

// ============================================
// TYPES
// ============================================

export type GalleryItemWithRelations = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  type: string;
  order: number;
  worldId: string;
  pinId: string | null;
  loreEntryId: string | null;
  caption: string | null;
  tags: string[];
  pin: {
    id: string;
    title: string;
  } | null;
  loreEntry: {
    id: string;
    title: string;
  } | null;
};

export type GalleryCollectionWithItems = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  order: number;
  worldId: string;
  itemCount: number;
  items: Array<{
    id: string;
    order: number;
    galleryItem: {
      id: string;
      title: string;
      imageUrl: string;
      type: string;
    };
  }>;
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Get a gallery item by ID
 * @param id - Gallery item ID
 * @returns Gallery item with relations or null
 */
export async function getGalleryItemById(id: string): Promise<GalleryItemWithRelations | null> {
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

    return galleryItem as GalleryItemWithRelations | null;
  } catch (error) {
    console.error("[getGalleryItemById] Failed to fetch gallery item:", error);
    return null;
  }
}

/**
 * Get all gallery items for a world
 * @param gameWorldId - World ID
 * @returns Array of gallery items
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
  } catch (error) {
    console.error("[getGalleryItemsByWorld] Failed to fetch gallery items:", error);
    return [];
  }
}

/**
 * Get gallery items by pin ID
 * @param pinId - Pin ID
 * @returns Array of gallery items
 */
export async function getGalleryItemsByPin(pinId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { pinId },
      orderBy: { order: "asc" },
    });

    return galleryItems;
  } catch (error) {
    console.error("[getGalleryItemsByPin] Failed to fetch gallery items:", error);
    return [];
  }
}

/**
 * Get gallery items by lore entry ID
 * @param loreEntryId - Lore entry ID
 * @returns Array of gallery items
 */
export async function getGalleryItemsByLore(loreEntryId: string) {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      where: { loreEntryId },
      orderBy: { order: "asc" },
    });

    return galleryItems;
  } catch (error) {
    console.error("[getGalleryItemsByLore] Failed to fetch gallery items:", error);
    return [];
  }
}

/**
 * Get all gallery items for a world with full details
 * @param gameWorldId - World ID
 * @returns Array of gallery items with relations
 */
export async function getGalleryItemsByWorldWithDetails(gameWorldId: string) {
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
  } catch (error) {
    console.error("[getGalleryItemsByWorldWithDetails] Failed to fetch gallery items:", error);
    return [];
  }
}

/**
 * Get all collections for a world
 * @param worldId - World ID
 * @returns Array of collections with item counts
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
  } catch (error) {
    console.error("[getCollectionsByWorld] Failed to fetch collections:", error);
    return [];
  }
}

/**
 * Search gallery items by tags
 * @param worldId - World ID
 * @param tags - Array of tags to search for
 * @returns Array of matching gallery items
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
  } catch (error) {
    console.error("[searchGalleryByTags] Failed to search items:", error);
    return [];
  }
}
