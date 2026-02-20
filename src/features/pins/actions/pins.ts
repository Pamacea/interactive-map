"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreatePinSchema,
  UpdatePinSchema,
} from "@/features/pins/logic/pin-schemas";
import type { PinCreateInput, PinUpdateInput } from "@/types/pin.type";
import {
  safeAsync,
  ValidationError,
  FileUploadError,
  type Result,
} from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyPinPermission,
} from "@/shared/lib/server-helpers";
import type { Pin } from "@prisma/client";
import { safeLogCollaborationEvent } from "@/features/presence";
import { CollaborationEventType } from "@/shared/lib/presence";
import { generateSlug, generateUniqueSlug } from "@/shared/lib/slug";

/**
 * Create a new pin in a world
 * @param data - Pin creation data (validated with Zod)
 * @returns Result with created pin or error
 */
export async function createPin(data: PinCreateInput): Promise<Result<{ pinId: string; pin: Pin }>> {
  return safeAsync(async () => {
    // Validate input with Zod
    const validated = CreatePinSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify user has access to the world
    await verifyWorldPermission(validated.gameWorldId, user.id);

    // If layerId provided, verify layer belongs to the world
    if (validated.layerId) {
      const layer = await prisma.mapLayer.findUnique({
        where: { id: validated.layerId },
      });

      if (!layer || layer.gameWorldId !== validated.gameWorldId) {
        throw new ValidationError("Layer does not belong to this world");
      }
    }

    // Generate unique slug from title
    const baseSlug = generateSlug(validated.title);
    const uniqueSlug = await generateUniqueSlug(
      baseSlug,
      async (slug) => {
        const existing = await prisma.pin.findFirst({
          where: { gameWorldId: validated.gameWorldId, slug },
        });
        return !!existing;
      }
    );

    // Create pin
    const pin = await prisma.pin.create({
      data: {
        title: validated.title,
        slug: uniqueSlug,
        description: validated.description,
        pinType: validated.pinType,
        latitude: validated.latitude,
        longitude: validated.longitude,
        icon: validated.icon,
        color: validated.color,
        size: validated.size,
        opacity: validated.opacity ?? 1.0,
        isVisible: validated.isVisible ?? true,
        properties: validated.properties,
        userId: user.id,
        gameWorldId: validated.gameWorldId,
        layerId: validated.layerId,
      },
    });

    // CRITICAL: Revalidate the world page to refresh server component data
    // This ensures the new pin appears when the page reloads or data is refreshed
    revalidatePath(`/world/${pin.gameWorldId}`);

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_CREATED,
      targetId: pin.id,
      targetType: "pin",
    });

    return { pinId: pin.id, pin };
  }, "createPin");
}

/**
 * Get a pin by ID
 * @param id - Pin ID
 * @returns Pin with full details or null
 */
export async function getPinById(id: string) {
  try {
    const pin = await prisma.pin.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        gameWorld: {
          select: {
            id: true,
            title: true,
          },
        },
        layer: {
          select: {
            id: true,
            name: true,
            isVisible: true,
            zIndex: true,
          },
        },
        gallery: {
          orderBy: { order: "asc" },
        },
      },
    });

    return pin;
  } catch (error) {
    console.error("[getPinById] Failed to fetch pin:", error);
    return null;
  }
}

/**
 * Get all pins for a world (for tag autosuggest)
 * @param gameWorldId - World ID
 * @returns Array of pins with id, title, and slug
 */
export async function getPinsByWorld(gameWorldId: string) {
  try {
    const pins = await prisma.pin.findMany({
      where: { gameWorldId },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: { title: "asc" },
    });

    return pins;
  } catch (error) {
    console.error("[getPinsByWorld] Failed to fetch pins:", error);
    return [];
  }
}

/**
 * Update an existing pin
 * @param data - Pin update data (validated with Zod)
 * @returns Result with updated pin or error
 */
export async function updatePin(data: PinUpdateInput): Promise<Result<Pin>> {
  return safeAsync(async () => {
    // Validate input with Zod
    const validated = UpdatePinSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Check if pin exists and user has permission
    const existingPin = await verifyPinPermission(validated.id, user.id);

    // If layerId is being updated, verify it belongs to the world
    if (validated.layerId !== undefined && validated.layerId !== null) {
      const layer = await prisma.mapLayer.findUnique({
        where: { id: validated.layerId },
      });

      if (!layer || layer.gameWorldId !== existingPin.gameWorldId) {
        throw new ValidationError("Layer does not belong to this world");
      }
    }

    // Build update data (only include fields that are provided)
    const updateData: Partial<Pin> = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.slug !== undefined) updateData.slug = validated.slug;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.pinType !== undefined) updateData.pinType = validated.pinType;
    if (validated.latitude !== undefined) updateData.latitude = validated.latitude;
    if (validated.longitude !== undefined) updateData.longitude = validated.longitude;
    if (validated.icon !== undefined) updateData.icon = validated.icon;
    if (validated.color !== undefined) updateData.color = validated.color;
    if (validated.size !== undefined) updateData.size = validated.size;
    if (validated.opacity !== undefined) updateData.opacity = validated.opacity;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;
    if (validated.properties !== undefined) updateData.properties = validated.properties;
    if (validated.layerId !== undefined) updateData.layerId = validated.layerId;

    // Update pin
    const pin = await prisma.pin.update({
      where: { id: validated.id },
      data: updateData,
    });

    // Check if this is a position-only update (PIN_MOVED) or general update (PIN_UPDATED)
    const isPositionOnly =
      Object.keys(updateData).length === 2 &&
      "latitude" in updateData &&
      "longitude" in updateData;

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: isPositionOnly
        ? CollaborationEventType.PIN_MOVED
        : CollaborationEventType.PIN_UPDATED,
      targetId: pin.id,
      targetType: "pin",
    });

    // Note: No revalidatePath needed - TanStack Query manages client cache via optimistic updates

    return pin;
  }, "updatePin");
}

/**
 * Delete a pin
 * @param id - Pin ID
 * @returns Result with deleted pin ID or error
 */
export async function deletePin(id: string): Promise<Result<{ pinId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    await verifyPinPermission(id, user.id);

    // Delete pin
    const deletedPin = await prisma.pin.delete({
      where: { id },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: deletedPin.gameWorldId,
      eventType: CollaborationEventType.PIN_DELETED,
      targetId: id,
      targetType: "pin",
    });

    // Note: No revalidatePath needed - TanStack Query manages client cache via optimistic updates

    return { pinId: id };
  }, "deletePin");
}

/**
 * Toggle pin visibility
 * Convenience action for showing/hiding pins
 * @param id - Pin ID
 * @returns Result with updated pin or error
 */
export async function togglePinVisibility(id: string): Promise<Result<Pin>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    const pin = await verifyPinPermission(id, user.id);

    // Toggle visibility
    const updated = await prisma.pin.update({
      where: { id },
      data: { isVisible: !pin.isVisible },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: id,
      targetType: "pin",
      eventData: { field: "isVisible", value: !pin.isVisible },
    });

    // Note: If this action is used directly (not through updatePin), consider cache invalidation
    revalidatePath(`/worlds/${pin.gameWorldId}`);

    return updated;
  }, "togglePinVisibility");
}

/**
 * Update pin position (for drag-and-drop)
 * Updates only latitude and longitude of a pin
 * @param pinId - Pin ID to update
 * @param latitude - New latitude (0-1 range)
 * @param longitude - New longitude (0-1 range)
 * @returns Result with updated pin or error
 */
export async function updatePinPosition(
  pinId: string,
  latitude: number,
  longitude: number
): Promise<Result<Pin>> {
  return safeAsync(async () => {
    // Validate coordinates are in valid range
    if (latitude < 0 || latitude > 1 || longitude < 0 || longitude > 1) {
      throw new ValidationError("Invalid coordinates: must be between 0 and 1");
    }

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    await verifyPinPermission(pinId, user.id);

    // Update pin position
    const updated = await prisma.pin.update({
      where: { id: pinId },
      data: {
        latitude,
        longitude,
      },
    });

    // CRITICAL FIX: No revalidatePath here!
    // The Zustand store is updated optimistically in pin-marker.tsx BEFORE this server call
    // Calling revalidatePath would cause TanStack Query to refetch, creating a race condition

    // Log collaboration event (fire and forget)
    await safeLogCollaborationEvent({
      worldId: updated.gameWorldId,
      eventType: CollaborationEventType.PIN_MOVED,
      targetId: pinId,
      targetType: "pin",
    });

    return updated;
  }, "updatePinPosition");
}

/**
 * Upload a custom icon for a pin
 * @param pinId - Pin ID to update
 * @param formData - FormData containing the icon file
 * @returns Result with updated pin and icon URL or error
 */
export async function uploadPinIcon(
  pinId: string,
  formData: FormData
): Promise<Result<{ iconUrl: string; pin: Pin }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    const pin = await verifyPinPermission(pinId, user.id);

    // Get file from formData
    const file = formData.get("file") as File;

    if (!file) {
      throw new FileUploadError("No file provided");
    }

    // Validate file type
    const validTypes = ["image/svg+xml", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new FileUploadError("Invalid file type. Please upload an SVG, PNG, or WEBP image.");
    }

    // Validate file size (max 500KB)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
      throw new FileUploadError("File size must be less than 500KB");
    }

    // Create pins/icons directory if it doesn't exist
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.default.join(process.cwd(), "public", "uploads", "pins", "icons");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Generate unique filename with UUID
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const _ext = path.default.extname(file.name);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${randomId}-${sanitizedName}`;
    const filePath = path.default.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const iconPath = `/uploads/pins/icons/${fileName}`;

    // Update pin with new icon path
    const updatedPin = await prisma.pin.update({
      where: { id: pinId },
      data: { icon: iconPath },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: pinId,
      targetType: "pin",
      eventData: { field: "icon" },
    });

    // Revalidate the world page
    revalidatePath(`/world/${pin.gameWorldId}`);

    return {
      iconUrl: iconPath,
      pin: updatedPin,
    };
  }, "uploadPinIcon");
}

/**
 * Batch update pin positions
 * For dragging multiple pins at once
 * @param updates - Array of { id, latitude, longitude }
 * @returns Result with updated pins or error
 */
export async function batchUpdatePinPositions(
  updates: Array<{
    id: string;
    latitude: number;
    longitude: number;
  }>
): Promise<Result<Pin[]>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify all pins exist and user has permission
    const pins = await prisma.pin.findMany({
      where: {
        id: { in: updates.map((u) => u.id) },
      },
    });

    if (pins.length !== updates.length) {
      throw new ValidationError("One or more pins not found");
    }

    // Check permissions for all pins
    const worldIds = [...new Set(pins.map((p) => p.gameWorldId))];

    for (const worldId of worldIds) {
      await verifyWorldPermission(worldId, user.id);
    }

    // Update all pins
    const updatedPins = await Promise.all(
      updates.map((update) =>
        prisma.pin.update({
          where: { id: update.id },
          data: {
            latitude: update.latitude,
            longitude: update.longitude,
          },
        })
      )
    );

    // Log collaboration event for batch move (fire and forget, one log per world)
    for (const worldId of worldIds) {
      await safeLogCollaborationEvent({
        worldId,
        eventType: CollaborationEventType.PIN_MOVED,
        targetType: "pin",
        eventData: { count: updates.length },
      });
    }

    // Revalidate only the affected world paths
    for (const worldId of worldIds) {
      revalidatePath(`/worlds/${worldId}`);
    }

    return updatedPins;
  }, "batchUpdatePinPositions");
}

/**
 * Update pin icon customization (shape, color, custom icon URL, size)
 * @param pinId - Pin ID to update
 * @param data - Icon customization data
 * @returns Result with updated pin or error
 */
export async function updatePinIconCustomization(
  pinId: string,
  data: {
    iconShape?: "CIRCLE" | "SQUARE" | "TRIANGLE" | "STAR" | "HEXAGON" | "DIAMOND" | "CUSTOM";
    color?: string;
    iconSize?: number;
    customIcon?: string | null; // URL to custom icon or null to clear
    iconBackground?: string | null; // URL to custom background or null to clear
  }
): Promise<Result<Pin>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    await verifyPinPermission(pinId, user.id);

    // Validate icon size if provided
    if (data.iconSize !== undefined) {
      if (data.iconSize < 12 || data.iconSize > 64) {
        throw new ValidationError("Icon size must be between 12 and 64 pixels");
      }
    }

    // Validate color if provided (hex format)
    if (data.color !== undefined) {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      if (!hexColorRegex.test(data.color)) {
        throw new ValidationError("Color must be a valid hex color (e.g., #3b82f6)");
      }
    }

    // Build update data
    const updateData: Partial<Pin> = {};
    if (data.iconShape !== undefined) updateData.iconShape = data.iconShape;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.iconSize !== undefined) updateData.iconSize = data.iconSize;
    if (data.customIcon !== undefined) updateData.customIcon = data.customIcon;
    if (data.iconBackground !== undefined) updateData.iconBackground = data.iconBackground;

    // Update pin
    const pin = await prisma.pin.update({
      where: { id: pinId },
      data: updateData,
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: pinId,
      targetType: "pin",
      eventData: { field: "iconCustomization" },
    });

    return pin;
  }, "updatePinIconCustomization");
}

/**
 * Upload a custom pin icon with optimized size
 * @param pinId - Pin ID to update
 * @param formData - FormData containing the icon file
 * @returns Result with icon URL and updated pin or error
 */
export async function uploadCustomPinIcon(
  pinId: string,
  formData: FormData
): Promise<Result<{ iconUrl: string; pin: Pin }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify pin exists and user has permission
    const pin = await verifyPinPermission(pinId, user.id);

    // Get file from formData
    const file = formData.get("file") as File;

    if (!file) {
      throw new FileUploadError("No file provided");
    }

    // Validate file type
    const validTypes = ["image/svg+xml", "image/png", "image/webp", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      throw new FileUploadError("Invalid file type. Please upload SVG, PNG, WEBP, or JPEG.");
    }

    // Validate file size (max 2MB for custom icons)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new FileUploadError("File size must be less than 2MB");
    }

    // Create pins/custom-icons directory
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.default.join(process.cwd(), "public", "uploads", "pins", "custom-icons");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const ext = path.default.extname(file.name);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${randomId}${ext}`;
    const filePath = path.default.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const iconPath = `/uploads/pins/custom-icons/${fileName}`;

    // Update pin with custom icon
    const updatedPin = await prisma.pin.update({
      where: { id: pinId },
      data: {
        customIcon: iconPath,
        iconShape: "CUSTOM",
      },
    });

    // Log collaboration event
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: pinId,
      targetType: "pin",
      eventData: { field: "customIcon" },
    });

    return {
      iconUrl: iconPath,
      pin: updatedPin,
    };
  }, "uploadCustomPinIcon");
}
