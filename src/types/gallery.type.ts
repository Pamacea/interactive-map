import type { GalleryItem, MediaType } from "@prisma/client";

/**
 * Gallery item types
 */

// Re-export MediaType for convenience
export type { MediaType };

// Full gallery item with relations
export type GalleryItemWithRelations = GalleryItem & {
  pin?: {
    id: string;
    title: string;
  } | null;
  loreEntry?: {
    id: string;
    title: string;
  } | null;
  caption?: string | null; // Display caption/legend
};

// Create input
export type GalleryItemCreateInput = {
  title: string;
  description?: string | null;
  imageUrl: string;
  type?: MediaType;
  order?: number;
  pinId?: string | null;
  loreEntryId?: string | null;
  gameWorldId: string;
};

// Update input
export type GalleryItemUpdateInput = {
  id: string;
  title?: string;
  description?: string | null;
  imageUrl?: string;
  type?: MediaType;
  order?: number;
  pinId?: string | null;
  loreEntryId?: string | null;
};

// Upload input (with FormData)
export type GalleryImageUploadInput = {
  file: File;
  title: string;
  description?: string | null;
  gameWorldId: string;
  pinId?: string | null;
  loreEntryId?: string | null;
};

// Filter state
export interface GalleryFilters {
  searchTerm: string;
  type: MediaType | "ALL";
  linkedTo: "ALL" | "PINS" | "LORE" | "UNLINKED";
}

// Upload progress state
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: "pending" | "uploading" | "processing" | "success" | "error";
  error?: string;
}

// Lightbox state
export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  images: GalleryItemWithRelations[];
}
