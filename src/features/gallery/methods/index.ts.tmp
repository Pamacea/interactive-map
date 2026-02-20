/**
 * Gallery Methods - Barrel Export
 *
 * Centralized exports for all gallery Server Action wrappers
 */

// Get operations
export {
  getGalleryItemById,
  getGalleryItemsByWorld,
  getGalleryItemsByPin,
  getGalleryItemsByLore,
  getGalleryItemsByWorldWithDetails,
  getCollectionsByWorld,
  searchGalleryByTags,
  type GalleryItemWithRelations,
  type GalleryCollectionWithItems,
} from "./get-gallery";

// Create operations
export {
  uploadGalleryImage,
  createGalleryItem,
  createCollection,
  type UploadGalleryImageInput,
  type CreateCollectionInput,
  type GalleryItem,
  type GalleryCollection,
} from "./create-gallery";

// Re-export remaining from actions/gallery.ts
export {
  updateGalleryItem,
  deleteGalleryItem,
  linkGalleryItemToPin,
  linkGalleryItemToLore,
  reorderGalleryItems,
  uploadGalleryImagesBulk,
  updateCollection,
  deleteCollection,
  addItemsToCollection,
  removeItemsFromCollection,
  updateItemTags,
  updateGalleryItemCaption,
} from "@/features/gallery";

export type { GalleryItemUpdateInput } from "@/types/gallery.type";
export type { BulkUploadItem, BulkUploadResult } from "@/features/gallery";
