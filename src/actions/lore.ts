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
  verifyPinPermission,
} from "@/lib/server-helpers";
import type { LoreEntry, Pin, LorePinRelation, LoreReference, RelationType } from "@prisma/client";

type _LoreEntryWithRelations = LoreEntry & {
  pins?: Pin[];
};

type _LoreEntryWithUser = LoreEntry & {
  user: { id: string; name: string | null; image: string | null } | null;
};

type LorePinRelationWithInclude = LorePinRelation & {
  pin: Pin;
  loreEntry: LoreEntry;
};

/**
 * Create a new lore entry in a world
 * @param data - Lore entry creation data (validated with Zod)
 * @returns Result with created lore entry ID and data, or error
 */
export async function createLoreEntry(data: LoreEntryCreateInput): Promise<Result<{ loreId: string; loreEntry: LoreEntry }>> {
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
export async function updateLoreEntry(data: LoreEntryUpdateInput): Promise<Result<LoreEntry>> {
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
    const updateData: Partial<LoreEntry> = {};
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
export async function toggleLoreVisibility(id: string): Promise<Result<LoreEntry>> {
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

// ============================================
// LORE-PIN LINKING
// ============================================

/**
 * Link a lore entry to a pin
 * @param loreId - Lore entry ID
 * @param pinId - Pin ID
 * @param relationType - Type of relationship (default: REFERENCES)
 * @param notes - Optional notes about the relationship
 * @returns Result with created link or error
 */
export async function linkLoreToPin(
  loreId: string,
  pinId: string,
  relationType: RelationType = "REFERENCES",
  notes?: string
): Promise<Result<LorePinRelationWithInclude>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify permissions for both lore and pin
    const lore = await verifyLorePermission(loreId, user.id);
    await verifyPinPermission(pinId, user.id);

    // Check if link already exists
    const existing = await prisma.lorePinRelation.findUnique({
      where: {
        loreEntryId_pinId: {
          loreEntryId: loreId,
          pinId,
        },
      },
    });

    if (existing) {
      throw new ValidationError("Lore entry is already linked to this pin");
    }

    // Create the link
    const link = await prisma.lorePinRelation.create({
      data: {
        loreEntryId: loreId,
        pinId,
        relationType,
        notes,
      },
      include: {
        pin: true,
        loreEntry: true,
      },
    });

    revalidatePath(`/world/${lore.gameWorldId}`);

    return link;
  }, "linkLoreToPin");
}

/**
 * Unlink a lore entry from a pin
 * @param loreId - Lore entry ID
 * @param pinId - Pin ID
 * @returns Result with deleted link ID or error
 */
export async function unlinkLoreFromPin(
  loreId: string,
  pinId: string
): Promise<Result<{ linkId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify permissions for BOTH lore and pin
    const lore = await verifyLorePermission(loreId, user.id);
    await verifyPinPermission(pinId, user.id);

    // Delete the link
    const link = await prisma.lorePinRelation.findUnique({
      where: {
        loreEntryId_pinId: {
          loreEntryId: loreId,
          pinId,
        },
      },
    });

    if (!link) {
      throw new ValidationError("Link does not exist");
    }

    await prisma.lorePinRelation.delete({
      where: {
        loreEntryId_pinId: {
          loreEntryId: loreId,
          pinId,
        },
      },
    });

    revalidatePath(`/world/${lore.gameWorldId}`);

    return { linkId: link.id };
  }, "unlinkLoreFromPin");
}

/**
 * Get all pins linked to a lore entry
 * @param loreId - Lore entry ID
 * @returns Array of pins with link metadata
 */
export async function getPinsForLore(loreId: string) {
  try {
    const links = await prisma.lorePinRelation.findMany({
      where: { loreEntryId: loreId },
      include: {
        pin: {
          include: {
            layer: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return links.map((link) => ({
      ...link.pin,
      relationType: link.relationType,
      notes: link.notes,
      linkId: link.id,
    }));
  } catch (error) {
    console.error("[getPinsForLore] Failed to fetch pins:", error);
    return [];
  }
}

/**
 * Get all lore entries linked to a pin
 * @param pinId - Pin ID
 * @returns Array of lore entries with link metadata
 */
export async function getLoreForPin(pinId: string) {
  try {
    const links = await prisma.lorePinRelation.findMany({
      where: { pinId },
      include: {
        loreEntry: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return links.map((link) => ({
      ...link.loreEntry,
      relationType: link.relationType,
      notes: link.notes,
      linkId: link.id,
    }));
  } catch (error) {
    console.error("[getLoreForPin] Failed to fetch lore entries:", error);
    return [];
  }
}

/**
 * Update the order of lore-pin links
 * @param links - Array of {linkId, order} objects
 * @returns Result with updated links or error
 */
export async function reorderLorePinLinks(
  links: Array<{ linkId: string; order: number }>
): Promise<Result<LorePinRelation[]>> {
  return safeAsync(async () => {
    await getAuthenticatedUser();

    // Update each link
    const updates = await Promise.all(
      links.map(({ linkId, order }) =>
        prisma.lorePinRelation.update({
          where: { id: linkId },
          data: { order },
        })
      )
    );

    return updates;
  }, "reorderLorePinLinks");
}

// ============================================
// LORE-TO-LORE CROSS-REFERENCES
// ============================================

/**
 * Create a cross-reference between two lore entries
 * @param sourceLoreId - The lore entry containing the link
 * @param targetLoreId - The lore entry being linked to
 * @param linkText - Display text for the link
 * @param linkType - Type of link (MENTION, SEE_ALSO, RELATED, CONTRADICTS)
 * @param context - Optional context around the reference
 * @returns Result with created reference or error
 */
export async function createLoreReference(
  sourceLoreId: string,
  targetLoreId: string,
  linkText: string,
  linkType: string = "MENTION",
  context?: string
): Promise<Result<LoreReference>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify permissions for both entries
    const sourceLore = await verifyLorePermission(sourceLoreId, user.id);
    await verifyLorePermission(targetLoreId, user.id);

    // Check if reference already exists
    const existing = await prisma.loreReference.findUnique({
      where: {
        sourceLoreId_targetLoreId: {
          sourceLoreId,
          targetLoreId,
        },
      },
    });

    if (existing) {
      // Update existing reference
      const updated = await prisma.loreReference.update({
        where: { id: existing.id },
        data: { linkText, linkType, context },
      });

      revalidatePath(`/world/${sourceLore.gameWorldId}`);

      return updated;
    }

    // Create new reference
    const reference = await prisma.loreReference.create({
      data: {
        sourceLoreId,
        targetLoreId,
        linkText,
        linkType,
        context,
      },
      include: {
        targetLoreEntry: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
          },
        },
      },
    });

    revalidatePath(`/world/${sourceLore.gameWorldId}`);

    return reference;
  }, "createLoreReference");
}

/**
 * Delete a cross-reference between lore entries
 * @param sourceLoreId - Source lore entry ID
 * @param targetLoreId - Target lore entry ID
 * @returns Result with deleted reference ID or error
 */
export async function deleteLoreReference(
  sourceLoreId: string,
  targetLoreId: string
): Promise<Result<{ referenceId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify permission
    const lore = await verifyLorePermission(sourceLoreId, user.id);

    await prisma.loreReference.delete({
      where: {
        sourceLoreId_targetLoreId: {
          sourceLoreId,
          targetLoreId,
        },
      },
    });

    revalidatePath(`/world/${lore.gameWorldId}`);

    return { referenceId: `${sourceLoreId}-${targetLoreId}` };
  }, "deleteLoreReference");
}

/**
 * Get all references made by a lore entry (outgoing links)
 * @param loreId - Lore entry ID
 * @returns Array of target lore entries with reference metadata
 */
export async function getLoreReferences(loreId: string) {
  try {
    const references = await prisma.loreReference.findMany({
      where: { sourceLoreId: loreId },
      include: {
        targetLoreEntry: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            isVisible: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return references.map((ref) => ({
      ...ref.targetLoreEntry,
      linkText: ref.linkText,
      linkType: ref.linkType,
      context: ref.context,
      referenceId: ref.id,
    }));
  } catch (error) {
    console.error("[getLoreReferences] Failed to fetch references:", error);
    return [];
  }
}

/**
 * Get all references to a lore entry (incoming links/back-references)
 * @param loreId - Lore entry ID
 * @returns Array of source lore entries that reference this entry
 */
export async function getLoreReferencedBy(loreId: string) {
  try {
    const references = await prisma.loreReference.findMany({
      where: { targetLoreId: loreId },
      include: {
        sourceLoreEntry: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            isVisible: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return references.map((ref) => ({
      ...ref.sourceLoreEntry,
      linkText: ref.linkText,
      linkType: ref.linkType,
      context: ref.context,
      referenceId: ref.id,
    }));
  } catch (error) {
    console.error("[getLoreReferencedBy] Failed to fetch back-references:", error);
    return [];
  }
}

/**
 * Get a lore entry by slug with full references
 * @param gameWorldId - World ID
 * @param slug - Lore entry slug
 * @returns Lore entry with references and back-references
 */
export async function getLoreEntryBySlug(gameWorldId: string, slug: string) {
  try {
    const loreEntry = await prisma.loreEntry.findUnique({
      where: {
        gameWorldId_slug: {
          gameWorldId,
          slug,
        },
      },
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

    if (!loreEntry) {
      return null;
    }

    // Get references and back-references
    const [references, referencedBy, linkedPins] = await Promise.all([
      getLoreReferences(loreEntry.id),
      getLoreReferencedBy(loreEntry.id),
      getPinsForLore(loreEntry.id),
    ]);

    return {
      ...loreEntry,
      references,
      referencedBy,
      linkedPins,
    };
  } catch (error) {
    console.error("[getLoreEntryBySlug] Failed to fetch lore entry:", error);
    return null;
  }
}
