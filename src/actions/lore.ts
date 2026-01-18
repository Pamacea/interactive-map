"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateLoreEntrySchema,
  UpdateLoreEntrySchema,
} from "@/components/lore/logic/lore-schemas";
import type { LoreEntryCreateInput, LoreEntryUpdateInput } from "@/types/lore.type";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyLorePermission,
} from "@/lib/server-helpers";

/**
 * Create a new lore entry in a world
 * @param data - Lore entry creation data (validated with Zod)
 * @returns Result with created lore entry ID and data, or error
 */
export async function createLoreEntry(data: LoreEntryCreateInput): Promise<Result<{ loreId: string; loreEntry: any }>> {
  return safeAsync(async () => {
    // Validate input with Zod
    const validated = CreateLoreEntrySchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify user has access to the world
    await verifyWorldPermission(validated.gameWorldId, user.id);

    // Check if slug already exists in this world
    const existingLore = await prisma.loreEntry.findUnique({
      where: {
        gameWorldId_slug: {
          gameWorldId: validated.gameWorldId,
          slug: validated.slug,
        },
      },
    });

    let finalSlug = validated.slug;
    if (existingLore) {
      // If slug exists, append a random suffix
      finalSlug = `${validated.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    // Create lore entry
    const loreEntry = await prisma.loreEntry.create({
      data: {
        title: validated.title,
        content: validated.content,
        slug: finalSlug,
        category: validated.category,
        isVisible: validated.isVisible ?? false,
        isPublic: validated.isPublic ?? true,
        userId: user.id,
        gameWorldId: validated.gameWorldId,
      },
    });

    revalidatePath(`/world/${validated.gameWorldId}`);

    return { loreId: loreEntry.id, loreEntry };
  }, "createLoreEntry");
}

/**
 * Get a lore entry by ID
 * @param id - Lore entry ID
 * @returns Lore entry with full details or null
 */
export async function getLoreEntryById(id: string) {
  try {
    const loreEntry = await prisma.loreEntry.findUnique({
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
        gallery: {
          orderBy: { order: "asc" },
        },
      },
    });

    return loreEntry;
  } catch (error) {
    console.error("[getLoreEntryById] Failed to fetch lore entry:", error);
    return null;
  }
}

/**
 * Get all lore entries for a world
 * @param gameWorldId - World ID
 * @returns Array of lore entries
 */
export async function getLoreEntriesByWorld(gameWorldId: string) {
  try {
    const loreEntries = await prisma.loreEntry.findMany({
      where: {
        gameWorldId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return loreEntries;
  } catch (error) {
    console.error("[getLoreEntriesByWorld] Failed to fetch lore entries:", error);
    return [];
  }
}

/**
 * Update an existing lore entry
 * @param data - Lore entry update data (validated with Zod)
 * @returns Result with updated lore entry or error
 */
export async function updateLoreEntry(data: LoreEntryUpdateInput): Promise<Result<any>> {
  return safeAsync(async () => {
    // Validate input with Zod
    const validated = UpdateLoreEntrySchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Check if lore entry exists and user has permission
    const existingLore = await verifyLorePermission(validated.id, user.id);

    // If slug is being updated, check for uniqueness
    let finalSlug = validated.slug;
    if (validated.slug) {
      const existingWithSlug = await prisma.loreEntry.findUnique({
        where: {
          gameWorldId_slug: {
            gameWorldId: existingLore.gameWorldId,
            slug: validated.slug,
          },
        },
      });

      if (existingWithSlug && existingWithSlug.id !== validated.id) {
        // Slug already exists, append random suffix
        finalSlug = `${validated.slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (finalSlug !== undefined) updateData.slug = finalSlug;
    if (validated.category !== undefined) updateData.category = validated.category;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;
    if (validated.isPublic !== undefined) updateData.isPublic = validated.isPublic;

    // Update lore entry
    const loreEntry = await prisma.loreEntry.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath(`/world/${existingLore.gameWorldId}`);

    return loreEntry;
  }, "updateLoreEntry");
}

/**
 * Delete a lore entry
 * @param id - Lore entry ID
 * @returns Result with deleted lore entry ID or error
 */
export async function deleteLoreEntry(id: string): Promise<Result<{ loreId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Check if lore entry exists and user has permission
    const loreEntry = await verifyLorePermission(id, user.id);

    // Delete lore entry
    await prisma.loreEntry.delete({
      where: { id },
    });

    revalidatePath(`/world/${loreEntry.gameWorldId}`);

    return { loreId: id };
  }, "deleteLoreEntry");
}

/**
 * Toggle lore entry visibility
 * Convenience action for showing/hiding lore entries
 * @param id - Lore entry ID
 * @returns Result with updated lore entry or error
 */
export async function toggleLoreVisibility(id: string): Promise<Result<any>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission
    const loreEntry = await verifyLorePermission(id, user.id);

    // Toggle visibility
    const updated = await prisma.loreEntry.update({
      where: { id },
      data: { isVisible: !loreEntry.isVisible },
    });

    revalidatePath(`/world/${loreEntry.gameWorldId}`);

    return updated;
  }, "toggleLoreVisibility");
}
