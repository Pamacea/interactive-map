"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateGalleryItemSchema,
  validateImageFile,
  generateSafeFilename,
} from "@/features/gallery/logic/gallery-schemas";
import type { GalleryItemCreateInput } from "@/types/gallery.type";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { GalleryItem } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";
import { generateSlug, generateUniqueSlug } from "@/shared/lib/slug";

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
 * Upload an image and create a gallery item
 */
export async function uploadGalleryImage(formData: FormData): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const gameWorldId = formData.get("gameWorldId") as string;
    const pinId = formData.get("pinId") as string | null;
    const loreEntryId = formData.get("loreEntryId") as string | null;

    if (!file) {
      throw new ValidationError("No file provided");
    }
    if (!title) {
      throw new ValidationError("Title is required");
    }
    if (!gameWorldId) {
      throw new ValidationError("World ID is required");
    }

    validateImageFile(file);
    await verifyWorldPermission(gameWorldId, user.id);

    if (pinId) {
      const pin = await prisma.pin.findUnique({
        where: { id: pinId },
      });

      if (!pin || pin.gameWorldId !== gameWorldId) {
        throw new ValidationError("Invalid pin: Pin does not belong to this world");
      }
    }

    if (loreEntryId) {
      const lore = await prisma.loreEntry.findUnique({
        where: { id: loreEntryId },
      });

      if (!lore || lore.gameWorldId !== gameWorldId) {
        throw new ValidationError("Invalid lore entry: Lore entry does not belong to this world");
      }
    }

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

    const baseSlug = generateSlug(title);
    const uniqueSlug = await generateUniqueSlug(
      baseSlug,
      async (slug) => {
        const existing = await prisma.galleryItem.findFirst({
          where: { worldId: gameWorldId, slug },
        });
        return !!existing;
      }
    );

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        slug: uniqueSlug,
        description: description || null,
        imageUrl,
        type: "IMAGE",
        order: 0,
        worldId: gameWorldId,
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
 */
export async function createGalleryItem(data: GalleryItemCreateInput): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
  return safeAsync(async () => {
    const validated = CreateGalleryItemSchema.parse(data);
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(validated.gameWorldId, user.id);

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title: validated.title,
        description: validated.description,
        imageUrl: validated.imageUrl,
        type: validated.type,
        order: validated.order,
        worldId: validated.gameWorldId,
        pinId: validated.pinId,
        loreEntryId: validated.loreEntryId,
      },
    });

    revalidatePath(`/world/${validated.gameWorldId}`);

    return { itemId: galleryItem.id, galleryItem };
  }, "createGalleryItem");
}

/**
 * Upload multiple gallery items at once
 */
export async function uploadGalleryImagesBulk(
  gameWorldId: string,
  items: BulkUploadItem[]
): Promise<Result<{ results: BulkUploadResult[] }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

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

    for (const item of items) {
      try {
        validateImageFile(item.file);

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

        const fileName = generateSafeFilename(item.file.name);
        const filePath = path.default.join(uploadsDir, fileName);
        const imageUrl = `/uploads/gallery/${fileName}`;

        const bytes = await item.file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

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
