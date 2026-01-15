"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  CreatePinSchema,
  UpdatePinSchema,
  PinFiltersSchema,
} from "@/components/pins/logic/pin-schemas";
import type { Pin, PinCreateInput, PinUpdateInput } from "@/types/pin.type";

/**
 * Create a new pin in a world
 * @param data - Pin creation data (validated with Zod)
 * @returns Created pin with ID
 * @throws Error if user not found or validation fails
 */
export async function createPin(data: PinCreateInput) {
  // Validate input with Zod
  let validated;
  try {
    validated = CreatePinSchema.parse(data);
  } catch (error) {
    console.error("[createPin] Validation failed:", error);
    throw error;
  }

  // Get current user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[createPin] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[createPin] User not found in database");
    throw new Error("User not found");
  }

  // Verify user has access to the world
  const world = await prisma.gameWorld.findUnique({
    where: { id: validated.gameWorldId },
  });

  if (!world) {
    console.error("[createPin] World not found");
    throw new Error("World not found");
  }

  if (world.userId !== user.id) {
    // Check if user is a member with editor permissions
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: validated.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      console.error("[createPin] Unauthorized - no editor permissions");
      throw new Error("Unauthorized: You don't have permission to add pins to this world");
    }
  }

  // If layerId provided, verify layer belongs to the world
  if (validated.layerId) {
    const layer = await prisma.mapLayer.findUnique({
      where: { id: validated.layerId },
    });

    if (!layer || layer.gameWorldId !== validated.gameWorldId) {
      console.error("[createPin] Invalid layer - does not belong to this world");
      throw new Error("Invalid layer: Layer does not belong to this world");
    }
  }

  // Create pin
  let pin;
  try {
    pin = await prisma.pin.create({
      data: {
        title: validated.title,
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
  } catch (error) {
    console.error("[createPin] Database write failed:", error);
    throw error;
  }

  // Note: No revalidatePath needed - TanStack Query manages client cache via optimistic updates
  // The cache is already updated by onSuccess in use-pins.ts

  return { pinId: pin.id, pin };
}

/**
 * Get a pin by ID
 * @param id - Pin ID
 * @returns Pin with full details or null
 */
export async function getPinById(id: string) {
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
}

/**
 * Update an existing pin
 * @param data - Pin update data (validated with Zod)
 * @returns Updated pin
 * @throws Error if user not authorized or pin not found
 */
export async function updatePin(data: PinUpdateInput) {
  // Validate input with Zod
  const validated = UpdatePinSchema.parse(data);

  // Get authenticated user from session
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

  // Check if pin exists and user has permission
  const existingPin = await prisma.pin.findUnique({
    where: { id: validated.id },
    include: {
      gameWorld: true,
    },
  });

  if (!existingPin) {
    throw new Error("Pin not found");
  }

  // Check ownership or editor permission
  if (existingPin.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: existingPin.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to edit this pin");
    }
  }

  // If layerId is being updated, verify it belongs to the world
  if (validated.layerId !== undefined) {
    if (validated.layerId === null) {
      // Allow removing layer assignment
    } else {
      const layer = await prisma.mapLayer.findUnique({
        where: { id: validated.layerId },
      });

      if (!layer || layer.gameWorldId !== existingPin.gameWorldId) {
        throw new Error("Invalid layer: Layer does not belong to this world");
      }
    }
  }

  // Build update data (only include fields that are provided)
  const updateData: any = {};
  if (validated.title !== undefined) updateData.title = validated.title;
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

  // Note: No revalidatePath needed - TanStack Query manages client cache via optimistic updates

  return pin;
}

/**
 * Delete a pin
 * @param id - Pin ID
 * @returns Deleted pin ID
 * @throws Error if user not authorized or pin not found
 */
export async function deletePin(id: string) {
  // Get authenticated user from session
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

  // Check if pin exists and user has permission
  const pin = await prisma.pin.findUnique({
    where: { id },
  });

  if (!pin) {
    throw new Error("Pin not found");
  }

  // Check ownership or editor permission
  if (pin.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: pin.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to delete this pin");
    }
  }

  // Delete pin
  await prisma.pin.delete({
    where: { id },
  });

  // Note: No revalidatePath needed - TanStack Query manages client cache via optimistic updates

  return { pinId: id };
}

/**
 * Toggle pin visibility
 * Convenience action for showing/hiding pins
 * @param id - Pin ID
 * @returns Updated pin
 */
export async function togglePinVisibility(id: string) {
  // Get authenticated user from session
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

  const pin = await prisma.pin.findUnique({
    where: { id },
  });

  if (!pin) {
    throw new Error("Pin not found");
  }

  // Check permission
  if (pin.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: pin.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to modify this pin");
    }
  }

  // Toggle visibility
  const updated = await prisma.pin.update({
    where: { id },
    data: { isVisible: !pin.isVisible },
  });

  // Note: If this action is used directly (not through updatePin), consider cache invalidation
  revalidatePath(`/worlds/${pin.gameWorldId}`);

  return updated;
}

/**
 * Update pin position (for drag-and-drop)
 * Updates only latitude and longitude of a pin
 * @param pinId - Pin ID to update
 * @param latitude - New latitude (0-1 range)
 * @param longitude - New longitude (0-1 range)
 * @returns Updated pin
 */
export async function updatePinPosition(pinId: string, latitude: number, longitude: number) {
  // Validate coordinates are in valid range
  if (latitude < 0 || latitude > 1 || longitude < 0 || longitude > 1) {
    throw new Error("Invalid coordinates: must be between 0 and 1");
  }

  // Get current user
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Check if pin exists and user has permission
  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    include: {
      gameWorld: true,
    },
  });

  if (!pin) {
    throw new Error("Pin not found");
  }

  // Check ownership or editor permission
  if (pin.userId !== session.user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: pin.gameWorldId,
        userId: session.user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error("Unauthorized: You don't have permission to move this pin");
    }
  }

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
  // where stale data overwrites the new position before the UI updates

  return updated;
}

/**
 * Upload a custom icon for a pin
 * @param pinId - Pin ID to update
 * @param formData - FormData containing the icon file
 * @returns Updated pin with new icon path
 */
export async function uploadPinIcon(pinId: string, formData: FormData) {
  // Get authenticated user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[uploadPinIcon] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[uploadPinIcon] User not found in database");
    throw new Error("User not found");
  }

  // Check if pin exists and user has permission
  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    include: {
      gameWorld: true,
    },
  });

  if (!pin) {
    console.error("[uploadPinIcon] Pin not found");
    throw new Error("Pin not found");
  }

  // Check ownership or editor permission
  if (pin.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: pin.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      console.error("[uploadPinIcon] Unauthorized - no editor permissions");
      throw new Error(
        "Unauthorized: You don't have permission to edit this pin"
      );
    }
  }

  // Get file from formData
  const file = formData.get("file") as File;

  if (!file) {
    console.error("[uploadPinIcon] No file provided in formData");
    throw new Error("No file provided");
  }

  // Validate file type
  const validTypes = ["image/svg+xml", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload an SVG, PNG, or WEBP image.");
  }

  // Validate file size (max 500KB)
  const maxSize = 500 * 1024; // 500KB
  if (file.size > maxSize) {
    throw new Error("File size must be less than 500KB");
  }

  // Create pins/icons directory if it doesn't exist
  const { writeFile, mkdir } = require("fs/promises");
  const path = require("path");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "pins", "icons");

  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }

  // Generate unique filename with UUID
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(file.name);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}-${randomId}-${sanitizedName}`;
  const filePath = path.join(uploadsDir, fileName);

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const iconPath = `/uploads/pins/icons/${fileName}`;

    // Update pin with new icon path
    const updatedPin = await prisma.pin.update({
      where: { id: pinId },
      data: { icon: iconPath },
    });

    // Revalidate the world page
    revalidatePath(`/world/${pin.gameWorldId}`);

    return {
      success: true,
      iconUrl: iconPath,
      pin: updatedPin,
    };
  } catch (error) {
    console.error("[uploadPinIcon] Failed to save file:", error);
    throw new Error("Failed to save icon image");
  }
}

/**
 * Batch update pin positions
 * For dragging multiple pins at once
 * @param updates - Array of { id, latitude, longitude }
 * @returns Updated pins
 */
export async function batchUpdatePinPositions(updates: Array<{
  id: string;
  latitude: number;
  longitude: number;
}>) {
  // Get authenticated user from session
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

  // Verify all pins exist and user has permission
  const pins = await prisma.pin.findMany({
    where: {
      id: { in: updates.map((u) => u.id) },
    },
  });

  if (pins.length !== updates.length) {
    throw new Error("One or more pins not found");
  }

  // Check permissions for all pins
  const worldIds = [...new Set(pins.map((p) => p.gameWorldId))];

  for (const worldId of worldIds) {
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
        throw new Error("Unauthorized: You don't have permission to modify pins in this world");
      }
    }
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

  // Revalidate only the affected world paths
  for (const worldId of worldIds) {
    revalidatePath(`/worlds/${worldId}`);
  }

  return updatedPins;
}
