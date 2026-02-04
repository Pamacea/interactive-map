"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateGalleryItemSchema,
  UpdateGalleryItemSchema,
  validateImageFile,
  generateSafeFilename,
} from "@/components/gallery/logic/gallery-schemas";
import type { GalleryItemCreateInput, GalleryItemUpdateInput } from "@/types/gallery.type";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/lib/errors";
import type { GalleryItem, GalleryCollection, CollectionItem } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyPinPermission,
  verifyLorePermission,
  verifyGalleryPermission,
} from "@/lib/server-helpers";

/**
 * Upload an image and create a gallery item
 * @param formData - FormData with file and metadata
 * @returns Result with created gallery item ID and data, or error
 */
export async function uploadGalleryImage(formData: FormData): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Extract data from formData
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const gameWorldId = formData.get("gameWorldId") as string;
    const pinId = formData.get("pinId") as string | null;
    const loreEntryId = formData.get("loreEntryId") as string | null;

    // Validate required fields
    if (!file) {
      throw new ValidationError("No file provided");
    }
    if (!title) {
      throw new ValidationError("Title is required");
    }
    if (!gameWorldId) {
      throw new ValidationError("World ID is required");
    }

    // Validate file
    validateImageFile(file);

    // Verify user has access to the world
    await verifyWorldPermission(gameWorldId, user.id);

    // Verify pinId belongs to this world (if provided)
    if (pinId) {
      const pin = await prisma.pin.findUnique({
        where: { id: pinId },
      });

      if (!pin || pin.gameWorldId !== gameWorldId) {
        throw new ValidationError("Invalid pin: Pin does not belong to this world");
      }
    }

    // Verify loreEntryId belongs to this world (if provided)
    if (loreEntryId) {
      const lore = await prisma.loreEntry.findUnique({
        where: { id: loreEntryId },
      });

      if (!lore || lore.gameWorldId !== gameWorldId) {
        throw new ValidationError("Invalid lore entry: Lore entry does not belong to this world");
      }
    }

    // Save file to disk
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.default.join(process.cwd(), "public", "uploads", "gallery");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const fileName = generateSafeFilename(file.name);
    const filePath = path.default.join(uploadsDir, fileName);
    const imageUrl = `/uploads/gallery/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create gallery item in database
    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        type: "IMAGE",
        order: 0,
        pinId,
        loreEntryId,
      },
    });

    revalidatePath(`/world/${gameWorldId}`);

    return { itemId: galleryItem.id, galleryItem };
  }, "uploadGalleryImage");
}

/**
 * Create a gallery item (without file upload)
 * @param data - Gallery item creation data
 * @returns Result with created gallery item ID and data, or error
 */
export async function createGalleryItem(data: GalleryItemCreateInput): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = CreateGalleryItemSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world access
    await verifyWorldPermission(validated.gameWorldId, user.id);

    // Create gallery item
    const galleryItem = await prisma.galleryItem.create({
      data: {
        title: validated.title,
        description: validated.description,
        imageUrl: validated.imageUrl,
        type: validated.type,
        order: validated.order,
        pinId: validated.pinId,
        loreEntryId: validated.loreEntryId,
      },
    });

    revalidatePath(`/world/${validated.gameWorldId}`);

    return { itemId: galleryItem.id, galleryItem };
  }, "createGalleryItem");
}

/**
 * Get a gallery item by ID
 * @param id - Gallery item ID
 * @returns Gallery item with full details or null
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
          // Also get items not linked to anything but should be in world
          // This requires a worldId field, which we'll need to add to schema
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
 * Update a gallery item
 * @param data - Gallery item update data
 * @returns Result with updated gallery item or error
 */
export async function updateGalleryItem(data: GalleryItemUpdateInput): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    // Validate input
    const validated = UpdateGalleryItemSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Check if gallery item exists and verify permission
    const existingItem = await verifyGalleryPermission(validated.id, user.id);

    // Get worldId for revalidation
    const worldId = existingItem.pin?.gameWorldId || existingItem.loreEntry?.gameWorldId;

    // Build update data
    const updateData: Partial<GalleryItem> = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.imageUrl !== undefined) updateData.imageUrl = validated.imageUrl;
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.order !== undefined) updateData.order = validated.order;
    if (validated.pinId !== undefined) updateData.pinId = validated.pinId;
    if (validated.loreEntryId !== undefined) updateData.loreEntryId = validated.loreEntryId;

    // Update gallery item
    const galleryItem = await prisma.galleryItem.update({
      where: { id: validated.id },
      data: updateData,
    });

    if (worldId) {
      revalidatePath(`/world/${worldId}`);
    }

    return galleryItem;
  }, "updateGalleryItem");
}

/**
 * Delete a gallery item
 * @param id - Gallery item ID
 * @returns Result with deleted gallery item ID or error
 */
export async function deleteGalleryItem(id: string): Promise<Result<{ itemId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Check if gallery item exists and verify permission
    const item = await verifyGalleryPermission(id, user.id);

    // Get worldId for revalidation
    const worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId;

    // Delete file from disk
    const { unlink } = await import("fs/promises");
    const path = await import("path");

    try {
      const filePath = path.default.join(process.cwd(), "public", item.imageUrl);
      await unlink(filePath);
    } catch (error) {
      console.warn("[deleteGalleryItem] Failed to delete file:", error);
      // Continue even if file deletion fails
    }

    // Delete gallery item from database
    await prisma.galleryItem.delete({
      where: { id },
    });

    if (worldId) {
      revalidatePath(`/world/${worldId}`);
    }

    return { itemId: id };
  }, "deleteGalleryItem");
}

/**
 * Link a gallery item to a pin
 * @param itemId - Gallery item ID
 * @param pinId - Pin ID
 * @returns Result with updated gallery item or error
 */
export async function linkGalleryItemToPin(itemId: string, pinId: string): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permissions for both gallery item and pin
    await verifyGalleryPermission(itemId, user.id);
    await verifyPinPermission(pinId, user.id);

    // Verify pin and gallery item belong to same world
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: itemId },
      include: { pin: true, loreEntry: true },
    });

    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    const galleryItemWorldId = galleryItem?.pin?.gameWorldId || galleryItem?.loreEntry?.gameWorldId;

    if (galleryItemWorldId && pin?.gameWorldId !== galleryItemWorldId) {
      throw new ValidationError("Pin and gallery item must belong to the same world");
    }

    // Update gallery item
    const updated = await prisma.galleryItem.update({
      where: { id: itemId },
      data: { pinId },
    });

    if (galleryItemWorldId) {
      revalidatePath(`/world/${galleryItemWorldId}`);
    }

    return updated;
  }, "linkGalleryItemToPin");
}

/**
 * Link a gallery item to a lore entry
 * @param itemId - Gallery item ID
 * @param loreEntryId - Lore entry ID
 * @returns Result with updated gallery item or error
 */
export async function linkGalleryItemToLore(itemId: string, loreEntryId: string): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permissions for both gallery item and lore entry
    await verifyGalleryPermission(itemId, user.id);
    await verifyLorePermission(loreEntryId, user.id);

    // Verify lore entry and gallery item belong to same world
    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id: itemId },
      include: { pin: true, loreEntry: true },
    });

    const lore = await prisma.loreEntry.findUnique({
      where: { id: loreEntryId },
    });

    const galleryItemWorldId = galleryItem?.pin?.gameWorldId || galleryItem?.loreEntry?.gameWorldId;

    if (galleryItemWorldId && lore?.gameWorldId !== galleryItemWorldId) {
      throw new ValidationError("Lore entry and gallery item must belong to the same world");
    }

    // Update gallery item
    const updated = await prisma.galleryItem.update({
      where: { id: itemId },
      data: { loreEntryId },
    });

    if (galleryItemWorldId) {
      revalidatePath(`/world/${galleryItemWorldId}`);
    }

    return updated;
  }, "linkGalleryItemToLore");
}

/**
 * Reorder gallery items
 * @param updates - Array of { id, order } pairs
 * @returns Result with updated gallery items or error
 */
export async function reorderGalleryItems(updates: Array<{ id: string; order: number }>): Promise<Result<GalleryItem[]>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission for first item (assumes all items belong to same world)
    if (updates.length > 0) {
      await verifyGalleryPermission(updates[0].id, user.id);
    }

    // Update all items
    const updatedItems = await Promise.all(
      updates.map((update) =>
        prisma.galleryItem.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );

    return updatedItems;
  }, "reorderGalleryItems");
}

// ============================================
// BULK UPLOAD
// ============================================

export interface BulkUploadItem {
  file: File;
  title: string;
  description?: string;
  pinId?: string;
  loreEntryId?: string;
}

export interface BulkUploadResult {
  success: boolean;
  itemId?: string;
  error?: string;
  fileName?: string;
}

/**
 * Upload multiple gallery items at once
 * @param gameWorldId - World ID
 * @param items - Array of items to upload
 * @returns Result with upload results or error
 */
export async function uploadGalleryImagesBulk(
  gameWorldId: string,
  items: BulkUploadItem[]
): Promise<Result<{ results: BulkUploadResult[] }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify world access
    await verifyWorldPermission(gameWorldId, user.id);

    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.default.join(process.cwd(), "public", "uploads", "gallery");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const results: BulkUploadResult[] = [];
    let currentOrder = 0;

    // Get current max order
    const maxOrderItem = await prisma.galleryItem.findFirst({
      where: {
        OR: [
          { pin: { gameWorldId } },
          { loreEntry: { gameWorldId } },
          { worldId: gameWorldId },
        ],
      },
      orderBy: { order: "desc" },
    });

    if (maxOrderItem) {
      currentOrder = maxOrderItem.order + 1;
    }

    // Process each file
    for (const item of items) {
      try {
        // Validate file
        validateImageFile(item.file);

        // Verify pinId belongs to this world (if provided)
        if (item.pinId) {
          const pin = await prisma.pin.findUnique({
            where: { id: item.pinId },
          });

          if (!pin || pin.gameWorldId !== gameWorldId) {
            results.push({
              success: false,
              error: "Invalid pin: Pin does not belong to this world",
              fileName: item.file.name,
            });
            continue;
          }
        }

        // Verify loreEntryId belongs to this world (if provided)
        if (item.loreEntryId) {
          const lore = await prisma.loreEntry.findUnique({
            where: { id: item.loreEntryId },
          });

          if (!lore || lore.gameWorldId !== gameWorldId) {
            results.push({
              success: false,
              error: "Invalid lore entry: Lore entry does not belong to this world",
              fileName: item.file.name,
            });
            continue;
          }
        }

        // Save file to disk
        const fileName = generateSafeFilename(item.file.name);
        const filePath = path.default.join(uploadsDir, fileName);
        const imageUrl = `/uploads/gallery/${fileName}`;

        const bytes = await item.file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Create gallery item in database
        const galleryItem = await prisma.galleryItem.create({
          data: {
            title: item.title,
            description: item.description || null,
            imageUrl,
            type: "IMAGE",
            order: currentOrder++,
            pinId: item.pinId,
            loreEntryId: item.loreEntryId,
            worldId: gameWorldId,
          },
        });

        results.push({
          success: true,
          itemId: galleryItem.id,
          fileName: item.file.name,
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          fileName: item.file.name,
        });
      }
    }

    revalidatePath(`/world/${gameWorldId}`);

    return { results };
  }, "uploadGalleryImagesBulk");
}

// ============================================
// COLLECTIONS MANAGEMENT
// ============================================

/**
 * Create a new gallery collection
 * @param worldId - World ID
 * @param name - Collection name
 * @param description - Optional description
 * @param color - Optional accent color
 * @param icon - Optional icon identifier
 * @returns Result with created collection or error
 */
export async function createCollection(
  worldId: string,
  name: string,
  description?: string,
  color?: string,
  icon?: string
): Promise<Result<GalleryCollection>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify world access
    await verifyWorldPermission(worldId, user.id);

    // Get max order for collections in this world
    const maxOrderCollection = await prisma.galleryCollection.findFirst({
      where: { worldId },
      orderBy: { order: "desc" },
    });

    const order = (maxOrderCollection?.order ?? -1) + 1;

    const collection = await prisma.galleryCollection.create({
      data: {
        name,
        description,
        color: color || "#3b82f6",
        icon,
        order,
        worldId,
      },
    });

    revalidatePath(`/world/${worldId}`);

    return collection;
  }, "createCollection");
}

/**
 * Update a collection
 * @param collectionId - Collection ID
 * @param data - Update data
 * @returns Result with updated collection or error
 */
export async function updateCollection(
  collectionId: string,
  data: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
): Promise<Result<GalleryCollection>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const collection = await prisma.galleryCollection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new ValidationError("Collection not found");
    }

    // Verify world access
    await verifyWorldPermission(collection.worldId, user.id);

    const updated = await prisma.galleryCollection.update({
      where: { id: collectionId },
      data,
    });

    revalidatePath(`/world/${collection.worldId}`);

    return updated;
  }, "updateCollection");
}

/**
 * Delete a collection
 * @param collectionId - Collection ID
 * @returns Result with deleted collection ID or error
 */
export async function deleteCollection(collectionId: string): Promise<Result<{ collectionId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const collection = await prisma.galleryCollection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new ValidationError("Collection not found");
    }

    // Verify world access
    await verifyWorldPermission(collection.worldId, user.id);

    await prisma.galleryCollection.delete({
      where: { id: collectionId },
    });

    revalidatePath(`/world/${collection.worldId}`);

    return { collectionId };
  }, "deleteCollection");
}

/**
 * Add items to a collection
 * @param itemIds - Array of gallery item IDs
 * @param collectionId - Collection ID
 * @returns Result with added items or error
 */
export async function addItemsToCollection(
  itemIds: string[],
  collectionId: string
): Promise<Result<CollectionItem[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const collection = await prisma.galleryCollection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new ValidationError("Collection not found");
    }

    // Verify world access
    await verifyWorldPermission(collection.worldId, user.id);

    // Get current max order in collection
    const maxOrderItem = await prisma.collectionItem.findFirst({
      where: { collectionId },
      orderBy: { order: "desc" },
    });

    let currentOrder = (maxOrderItem?.order ?? -1) + 1;

    // Create collection items
    const results = await Promise.all(
      itemIds.map((itemId) =>
        prisma.collectionItem.create({
          data: {
            galleryItemId: itemId,
            collectionId,
            order: currentOrder++,
          },
          include: {
            galleryItem: true,
          },
        })
      )
    );

    revalidatePath(`/world/${collection.worldId}`);

    return results;
  }, "addItemsToCollection");
}

/**
 * Remove items from a collection
 * @param itemIds - Array of gallery item IDs
 * @param collectionId - Collection ID
 * @returns Result with removed count or error
 */
export async function removeItemsFromCollection(
  itemIds: string[],
  collectionId: string
): Promise<Result<{ count: number }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const collection = await prisma.galleryCollection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new ValidationError("Collection not found");
    }

    // Verify world access
    await verifyWorldPermission(collection.worldId, user.id);

    const result = await prisma.collectionItem.deleteMany({
      where: {
        collectionId,
        galleryItemId: { in: itemIds },
      },
    });

    revalidatePath(`/world/${collection.worldId}`);

    return { count: result.count };
  }, "removeItemsFromCollection");
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
 * Update tags on a gallery item
 * @param itemId - Gallery item ID
 * @param tags - Array of tags
 * @returns Result with updated item or error
 */
export async function updateItemTags(
  itemId: string,
  tags: string[]
): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const item = await verifyGalleryPermission(itemId, user.id);

    const updated = await prisma.galleryItem.update({
      where: { id: itemId },
      data: { tags },
    });

    const worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId || item.worldId;
    if (worldId) {
      revalidatePath(`/world/${worldId}`);
    }

    return updated;
  }, "updateItemTags");
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

/**
 * Get all gallery items for a world (with worldId support)
 * @param gameWorldId - World ID
 * @returns Array of gallery items
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
  } catch (error) {
    console.error("[getGalleryItemsByWorldWithDirect] Failed to fetch gallery items:", error);
    return [];
  }
}
