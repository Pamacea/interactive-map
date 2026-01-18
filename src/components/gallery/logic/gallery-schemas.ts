import { z } from "zod";
import { MediaType } from "@prisma/client";

/**
 * Zod schemas for Gallery Item validation
 */

// Create gallery item schema
export const CreateGalleryItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(5000, "Description must be less than 5000 characters").optional(),
  imageUrl: z.string().url("Invalid image URL"),
  type: z.nativeEnum(MediaType).default("IMAGE"),
  order: z.number().int().min(0).default(0),
  pinId: z.string().cuid().optional(),
  loreEntryId: z.string().cuid().optional(),
  gameWorldId: z.string().cuid("Invalid world ID"),
});

// Update gallery item schema
export const UpdateGalleryItemSchema = z.object({
  id: z.string().cuid("Invalid gallery item ID"),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional(),
  type: z.nativeEnum(MediaType).optional(),
  order: z.number().int().min(0).optional(),
  pinId: z.string().cuid().optional(),
  loreEntryId: z.string().cuid().optional(),
});

// Image upload validation schema
export const ImageUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional(),
  gameWorldId: z.string().cuid(),
  pinId: z.string().cuid().optional(),
  loreEntryId: z.string().cuid().optional(),
});

// File validation schema (for client-side)
export const ImageFileSchema = z.object({
  file: z.instanceof(File),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
});

// Export types
export type CreateGalleryItemInput = z.infer<typeof CreateGalleryItemSchema>;
export type UpdateGalleryItemInput = z.infer<typeof UpdateGalleryItemSchema>;
export type ImageUploadInput = z.infer<typeof ImageUploadSchema>;
export type ImageFileInput = z.infer<typeof ImageFileSchema>;

// File validation constants
export const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

/**
 * Validate image file
 * @throws Error with validation message
 */
export function validateImageFile(file: File): void {
  // Check file size
  if (file.size > IMAGE_MAX_SIZE) {
    throw new Error(`File size must be less than ${IMAGE_MAX_SIZE / 1024 / 1024}MB`);
  }

  // Check file type
  if (!IMAGE_ALLOWED_TYPES.includes(file.type as any)) {
    throw new Error(
      `Invalid file type. Allowed: ${IMAGE_ALLOWED_TYPES.join(", ")}`
    );
  }
}

/**
 * Generate a safe filename from user input
 */
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.[^/.]+$/, ""); // Remove extension

  return `${timestamp}-${random}-${sanitizedName}.${ext}`;
}
