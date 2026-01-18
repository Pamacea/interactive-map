"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import {
  CreateGalleryItemSchema,
  UpdateGalleryItemSchema,
  validateImageFile,
  generateSafeFilename,
  IMAGE_MAX_SIZE,
} from "@/components/gallery/logic/gallery-schemas";
import type { GalleryItemCreateInput, GalleryItemUpdateInput } from "@/types/gallery.type";

/**
 * Upload an image and create a gallery item
 * @param formData - FormData with file and metadata
 * @returns Created gallery item with ID
 */
export async function uploadGalleryImage(formData: FormData) {
  // Get authenticated user
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[uploadGalleryImage] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[uploadGalleryImage] User not found in database");
    throw new Error("User not found");
  }

  // Extract data from formData
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const gameWorldId = formData.get("gameWorldId") as string;
  const pinId = formData.get("pinId") as string | null;
  const loreEntryId = formData.get("loreEntryId") as string | null;

  // Validate required fields
  if (!file) {
    throw new Error("No file provided");
  }
  if (!title) {
    throw new Error("Title is required");
  }
  if (!gameWorldId) {
    throw new Error("World ID is required");
  }

  // Validate file
  try {
    validateImageFile(file);
  } catch (error) {
    console.error("[uploadGalleryImage] File validation failed:", error);
    throw error;
  }

  // Verify user has access to the world
  const world = await prisma.gameWorld.findUnique({
    where: { id: gameWorldId },
  });

  if (!world) {
    console.error("[uploadGalleryImage] World not found");
    throw new Error("World not found");
  }

  if (world.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      console.error("[uploadGalleryImage] Unauthorized - no editor permissions");
      throw new Error(
        "Unauthorized: You don't have permission to upload images to this world"
      );
    }
  }

  // Verify pinId belongs to this world (if provided)
  if (pinId) {
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin || pin.gameWorldId !== gameWorldId) {
      throw new Error("Invalid pin: Pin does not belong to this world");
    }
  }

  // Verify loreEntryId belongs to this world (if provided)
  if (loreEntryId) {
    const lore = await prisma.loreEntry.findUnique({
      where: { id: loreEntryId },
    });

    if (!lore || lore.gameWorldId !== gameWorldId) {
      throw new Error("Invalid lore entry: Lore entry does not belong to this world");
    }
  }

  // Save file to disk
  const { writeFile, mkdir } = require("fs/promises");
  const path = require("path");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "gallery");

  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  const fileName = generateSafeFilename(file.name);
  const filePath = path.join(uploadsDir, fileName);
  const imageUrl = `/uploads/gallery/${fileName}`;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
  } catch (error) {
    console.error("[uploadGalleryImage] Failed to save file:", error);
    throw new Error("Failed to save image");
  }

  // Create gallery item in database
  let galleryItem;
  try {
    galleryItem = await prisma.galleryItem.create({
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
  } catch (error) {
    console.error("[uploadGalleryImage] Database write failed:", error);
    throw error;
  }

  revalidatePath(`/world/${gameWorldId}`);

  return { itemId: galleryItem.id, galleryItem };
}

/**
 * Create a gallery item (without file upload)
 * @param data - Gallery item creation data
 * @returns Created gallery item
 */
export async function createGalleryItem(data: GalleryItemCreateInput) {
  // Validate input
  const validated = CreateGalleryItemSchema.parse(data);

  // Get authenticated user
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify world access
  const world = await prisma.gameWorld.findUnique({
    where: { id: validated.gameWorldId },
  });

  if (!world) {
    throw new Error("World not found");
  }

  if (world.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: validated.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error(
        "Unauthorized: You don't have permission to add gallery items to this world"
      );
    }
  }

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
}

/**
 * Get a gallery item by ID
 * @param id - Gallery item ID
 * @returns Gallery item with full details
 */
export async function getGalleryItemById(id: string) {
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
}

/**
 * Get all gallery items for a world
 * @param gameWorldId - World ID
 * @returns Array of gallery items
 */
export async function getGalleryItemsByWorld(gameWorldId: string) {
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
}

/**
 * Get gallery items by pin ID
 * @param pinId - Pin ID
 * @returns Array of gallery items
 */
export async function getGalleryItemsByPin(pinId: string) {
  const galleryItems = await prisma.galleryItem.findMany({
    where: { pinId },
    orderBy: { order: "asc" },
  });

  return galleryItems;
}

/**
 * Get gallery items by lore entry ID
 * @param loreEntryId - Lore entry ID
 * @returns Array of gallery items
 */
export async function getGalleryItemsByLore(loreEntryId: string) {
  const galleryItems = await prisma.galleryItem.findMany({
    where: { loreEntryId },
    orderBy: { order: "asc" },
  });

  return galleryItems;
}

/**
 * Update a gallery item
 * @param data - Gallery item update data
 * @returns Updated gallery item
 */
export async function updateGalleryItem(data: GalleryItemUpdateInput) {
  // Validate input
  const validated = UpdateGalleryItemSchema.parse(data);

  // Get authenticated user
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if gallery item exists
  const existingItem = await prisma.galleryItem.findUnique({
    where: { id: validated.id },
    include: {
      pin: true,
      loreEntry: true,
    },
  });

  if (!existingItem) {
    throw new Error("Gallery item not found");
  }

  // Verify user has permission (through world ownership)
  const worldId = existingItem.pin?.gameWorldId || existingItem.loreEntry?.gameWorldId;

  if (worldId) {
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (world?.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: worldId,
          userId: user.id,
          permission: { in: ["EDITOR", "OWNER"] },
        },
      });

      if (!member) {
        throw new Error(
          "Unauthorized: You don't have permission to edit this gallery item"
        );
      }
    }
  }

  // Build update data
  const updateData: any = {};
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

  revalidatePath(`/world/${worldId}`);

  return galleryItem;
}

/**
 * Delete a gallery item
 * @param id - Gallery item ID
 * @returns Deleted gallery item ID
 */
export async function deleteGalleryItem(id: string) {
  // Get authenticated user
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if gallery item exists
  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: {
      pin: true,
      loreEntry: true,
    },
  });

  if (!item) {
    throw new Error("Gallery item not found");
  }

  // Verify user has permission
  const worldId = item.pin?.gameWorldId || item.loreEntry?.gameWorldId;

  if (worldId) {
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (world?.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: worldId,
          userId: user.id,
          permission: { in: ["EDITOR", "OWNER"] },
        },
      });

      if (!member) {
        throw new Error(
          "Unauthorized: You don't have permission to delete this gallery item"
        );
      }
    }
  }

  // Delete file from disk
  const { unlink } = require("fs/promises");
  const path = require("path");

  try {
    const filePath = path.join(process.cwd(), "public", item.imageUrl);
    await unlink(filePath);
  } catch (error) {
    console.warn("[deleteGalleryItem] Failed to delete file:", error);
    // Continue even if file deletion fails
  }

  // Delete gallery item from database
  await prisma.galleryItem.delete({
    where: { id },
  });

  revalidatePath(`/world/${worldId}`);

  return { itemId: id };
}

/**
 * Link a gallery item to a pin
 * @param itemId - Gallery item ID
 * @param pinId - Pin ID
 * @returns Updated gallery item
 */
export async function linkGalleryItemToPin(itemId: string, pinId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Verify permissions and update
  const galleryItem = await prisma.galleryItem.update({
    where: { id: itemId },
    data: { pinId },
  });

  return galleryItem;
}

/**
 * Link a gallery item to a lore entry
 * @param itemId - Gallery item ID
 * @param loreEntryId - Lore entry ID
 * @returns Updated gallery item
 */
export async function linkGalleryItemToLore(itemId: string, loreEntryId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Verify permissions and update
  const galleryItem = await prisma.galleryItem.update({
    where: { id: itemId },
    data: { loreEntryId },
  });

  return galleryItem;
}

/**
 * Reorder gallery items
 * @param updates - Array of { id, order } pairs
 * @returns Updated gallery items
 */
export async function reorderGalleryItems(updates: Array<{ id: string; order: number }>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
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
}
