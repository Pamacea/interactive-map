"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  type Result,
} from "@/shared/lib/errors";
import { ValidationError } from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyGalleryPermission,
} from "@/shared/lib/server-helpers";

/**
 * Delete a gallery item
 */
export async function deleteGalleryItem(id: string): Promise<Result<{ itemId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    const item = await verifyGalleryPermission(id, user.id);

    const _worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId;

    const { unlink } = await import("fs/promises");
    const path = await import("path");

    try {
      const filePath = path.default.join(process.cwd(), "public", item.imageUrl);
      await unlink(filePath);
    } catch {
      // Continue even if file deletion fails
    }

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
 * Delete a collection
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

    await verifyWorldPermission(collection.worldId, user.id);

    await prisma.galleryCollection.delete({
      where: { id: collectionId },
    });

    revalidatePath(`/world/${collection.worldId}`);

    return { collectionId };
  }, "deleteCollection");
}

/**
 * Remove items from a collection
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

    await verifyWorldPermission(collection.worldId, user.id);

    const _result = await prisma.collectionItem.deleteMany({
      where: {
        collectionId,
        galleryItemId: { in: itemIds },
      },
    });

    revalidatePath(`/world/${collection.worldId}`);

    return { count: result.count };
  }, "removeItemsFromCollection");
}
