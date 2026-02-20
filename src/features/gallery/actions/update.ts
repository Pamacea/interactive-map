"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateGalleryItemSchema } from "@/features/gallery/logic/gallery-schemas";
import type { GalleryItemUpdateInput } from "@/types/gallery.type";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { GalleryItem, GalleryCollection } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyGalleryPermission,
} from "@/shared/lib/server-helpers";

/**
 * Update a gallery item
 */
export async function updateGalleryItem(data: GalleryItemUpdateInput): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    const validated = UpdateGalleryItemSchema.parse(data);
    const user = await getAuthenticatedUser();

    const existingItem = await verifyGalleryPermission(validated.id, user.id);

    const worldId = existingItem.pin?.gameWorldId || existingItem.loreEntry?.gameWorldId;

    const updateData: Partial<GalleryItem> = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.imageUrl !== undefined) updateData.imageUrl = validated.imageUrl;
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.order !== undefined) updateData.order = validated.order;
    if (validated.pinId !== undefined) updateData.pinId = validated.pinId;
    if (validated.loreEntryId !== undefined) updateData.loreEntryId = validated.loreEntryId;

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
 * Update a collection
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
 * Link a gallery item to a pin
 */
export async function linkGalleryItemToPin(itemId: string, pinId: string): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyGalleryPermission(itemId, user.id);
    await prisma.pin.findUniqueOrThrow({
      where: { id: pinId },
    });

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
 */
export async function linkGalleryItemToLore(itemId: string, loreEntryId: string): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyGalleryPermission(itemId, user.id);
    await prisma.loreEntry.findUniqueOrThrow({
      where: { id: loreEntryId },
    });

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
 */
export async function reorderGalleryItems(updates: Array<{ id: string; order: number }>): Promise<Result<GalleryItem[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    if (updates.length > 0) {
      await verifyGalleryPermission(updates[0].id, user.id);
    }

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

/**
 * Update tags on a gallery item
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
 * Update gallery item caption/legend
 */
export async function updateGalleryItemCaption(
  itemId: string,
  caption: string | null
): Promise<Result<GalleryItem>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const item = await verifyGalleryPermission(itemId, user.id);

    const updated = await prisma.galleryItem.update({
      where: { id: itemId },
      data: { caption },
    });

    const worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId || item.worldId;
    if (worldId) {
      revalidatePath(`/world/${worldId}`);
    }

    return updated;
  }, "updateGalleryItemCaption");
}
