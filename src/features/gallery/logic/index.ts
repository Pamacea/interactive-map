// Custom hooks for gallery feature
export { useImageUpload } from "./use-image-upload";
export { useDragAndDrop } from "./use-drag-and-drop";
export type { FileWithPreview } from "./use-image-upload";

// Schemas and validation
export {
  IMAGE_MAX_SIZE,
  IMAGE_ALLOWED_TYPES,
  CreateGalleryItemSchema,
  UpdateGalleryItemSchema,
  ImageUploadSchema,
  ImageFileSchema,
  validateImageFile,
  generateSafeFilename,
  type CreateGalleryItemInput,
  type UpdateGalleryItemInput,
  type ImageUploadInput,
  type ImageFileInput,
} from "./gallery-schemas";
