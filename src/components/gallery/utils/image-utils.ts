import {
  validateImageFile,
  IMAGE_MAX_SIZE,
  IMAGE_ALLOWED_TYPES,
} from "../logic/gallery-schemas";

/**
 * Image utility functions for gallery
 */

/**
 * Read a file as data URL
 * @param file - File to read
 * @returns Promise resolving to data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from a file
 * @param file - Image file
 * @returns Promise resolving to { width, height }
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Validate and prepare image for upload
 * @param file - File to validate
 * @returns Object with file info or error
 */
export async function validateAndPrepareImage(file: File) {
  try {
    // Validate file
    validateImageFile(file);

    // Get dimensions
    const dimensions = await getImageDimensions(file);

    return {
      valid: true,
      file,
      dimensions,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Validation failed",
    };
  }
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Generate a thumbnail from an image file
 * @param file - Original image file
 * @param maxWidth - Maximum thumbnail width
 * @param maxHeight - Maximum thumbnail height
 * @returns Promise resolving to thumbnail blob
 */
export async function generateThumbnail(
  file: File,
  maxWidth: number = 300,
  maxHeight: number = 300
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate thumbnail dimensions
      let { width, height } = { width: img.width, height: img.height };
      const ratio = Math.min(maxWidth / width, maxHeight / height);

      if (ratio < 1) {
        width *= ratio;
        height *= ratio;
      }

      // Create canvas and draw thumbnail
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create thumbnail"));
          }
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Check if a file is an image
 * @param file - File to check
 * @returns True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension (e.g., "jpg")
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Create a preview URL for a file
 * @param file - File to preview
 * @returns Object URL (should be revoked when done)
 */
export function createPreviewURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL
 * @param url - URL to revoke
 */
export function revokePreviewURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Download an image from a URL
 * @param url - Image URL
 * @param filename - Download filename
 */
export function downloadImage(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get image aspect ratio
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio (width / height)
 */
export function getAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Calculate image dimensions to fit within constraints
 * @param originalWidth - Original width
 * @param originalHeight - Original height
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Object with fitted dimensions
 */
export function fitImageToConstraints(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(
    maxWidth / originalWidth,
    maxHeight / originalHeight,
    1
  );

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
}
