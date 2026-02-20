"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { GalleryCollection, CollectionItem } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";

/**
 * Create a new gallery collection
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

    await verifyWorldPermission(worldId, user.id);

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
 * Add items to a collection
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

    await verifyWorldPermission(collection.worldId, user.id);

    const maxOrderItem = await prisma.collectionItem.findFirst({
      where: { collectionId },
      orderBy: { order: "desc" },
    });

    let currentOrder = (maxOrderItem?.order ?? -1) + 1;

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
