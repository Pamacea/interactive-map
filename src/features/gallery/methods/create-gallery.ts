/**
 * Gallery Methods - Create Gallery Item
 *
 * Server Action wrappers for creating gallery items and collections
 */

"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";
import { generateSlug, generateUniqueSlug } from "@/shared/lib/slug";
import {
  CreateGalleryItemSchema,
  validateImageFile,
  generateSafeFilename,
} from "../logic/gallery-schemas";
import type { GalleryItemCreateInput } from "@/types/gallery.type";

// ============================================
// SCHEMAS
// ============================================

export const UploadGalleryImageSchema = z.object({
  file: z.instanceof(File),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000).optional(),
  gameWorldId: z.string().min(1, "World ID is required"),
  pinId: z.string().optional(),
  loreEntryId: z.string().optional(),
});

export type UploadGalleryImageInput = z.infer<typeof UploadGalleryImageSchema>;

export const CreateCollectionSchema = z.object({
  worldId: z.string().min(1, "World ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").optional(),
  icon: z.string().optional(),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

// ============================================
// TYPES
// ============================================

export type GalleryItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  worldId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryCollection = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  order: number;
  worldId: string;
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Upload an image and create a gallery item
 * @param formData - FormData with file and metadata
 * @returns Result with created gallery item or error
 */
export async function uploadGalleryImage(
  formData: FormData,
): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
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

    // Generate unique slug from title
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

    // Create gallery item in database
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
 * @param data - Gallery item creation data
 * @returns Result with created gallery item or error
 */
export async function createGalleryItem(
  data: GalleryItemCreateInput,
): Promise<Result<{ itemId: string; galleryItem: GalleryItem }>> {
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
 * Create a new gallery collection
 * @param input - Validated collection data
 * @returns Result with created collection or error
 */
export async function createCollection(
  input: CreateCollectionInput,
): Promise<Result<GalleryCollection>> {
  return safeAsync(async () => {
    // Validate input
    const validated = CreateCollectionSchema.parse(input);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world access
    await verifyWorldPermission(validated.worldId, user.id);

    // Get max order for collections in this world
    const maxOrderCollection = await prisma.galleryCollection.findFirst({
      where: { worldId: validated.worldId },
      orderBy: { order: "desc" },
    });

    const order = (maxOrderCollection?.order ?? -1) + 1;

    // Create collection
    const collection = await prisma.galleryCollection.create({
      data: {
        name: validated.name,
        description: validated.description,
        color: validated.color || "#3b82f6",
        icon: validated.icon,
        order,
        worldId: validated.worldId,
      },
    });

    revalidatePath(`/world/${validated.worldId}`);

    return collection;
  }, "createCollection");
}
