/**
 * Gallery Actions
 *
 * Server actions for gallery items and collections.
 * Split into multiple files for better organization:
 * - upload.ts: Image upload and gallery item creation
 * - delete.ts: Deletion operations
 * - update.ts: Update operations
 * - get.ts: Query operations
 * - collections.ts: Collection management
 */

export {
  uploadGalleryImage,
  createGalleryItem,
  uploadGalleryImagesBulk,
  type BulkUploadItem,
  type BulkUploadResult,
} from "./upload";

export {
  deleteGalleryItem,
  deleteCollection,
  removeItemsFromCollection,
} from "./delete";

export {
  updateGalleryItem,
  updateCollection,
  linkGalleryItemToPin,
  linkGalleryItemToLore,
  reorderGalleryItems,
  updateItemTags,
  updateGalleryItemCaption,
} from "./update";

export {
  getGalleryItemById,
  getGalleryItemsByWorld,
  getGalleryItemsByPin,
  getGalleryItemsByLore,
  getGalleryItemsByWorldWithDirect,
  getCollectionsByWorld,
  searchGalleryByTags,
} from "./get";

export {
  createCollection,
  addItemsToCollection,
} from "./collections";
