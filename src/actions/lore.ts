"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  CreateLoreEntrySchema,
  UpdateLoreEntrySchema,
} from "@/components/lore/logic/lore-schemas";
import type { LoreEntryCreateInput, LoreEntryUpdateInput } from "@/types/lore.type";

/**
 * Create a new lore entry in a world
 * @param data - Lore entry creation data (validated with Zod)
 * @returns Created lore entry with ID
 * @throws Error if user not found or validation fails
 */
export async function createLoreEntry(data: LoreEntryCreateInput) {
  // Validate input with Zod
  let validated;
  try {
    validated = CreateLoreEntrySchema.parse(data);
  } catch (error) {
    console.error("[createLoreEntry] Validation failed:", error);
    throw error;
  }

  // Get current user from session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("[createLoreEntry] No authenticated user session");
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    console.error("[createLoreEntry] User not found in database");
    throw new Error("User not found");
  }

  // Verify user has access to the world
  const world = await prisma.gameWorld.findUnique({
    where: { id: validated.gameWorldId },
  });

  if (!world) {
    console.error("[createLoreEntry] World not found");
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
      console.error("[createLoreEntry] Unauthorized - no editor permissions");
      throw new Error(
        "Unauthorized: You don't have permission to add lore to this world"
      );
    }
  }

  // Check if slug already exists in this world
  const existingLore = await prisma.loreEntry.findUnique({
    where: {
      gameWorldId_slug: {
        gameWorldId: validated.gameWorldId,
        slug: validated.slug,
      },
    },
  });

  if (existingLore) {
    // If slug exists, append a random suffix
    const uniqueSlug = `${validated.slug}-${Math.random().toString(36).substring(2, 8)}`;
    validated.slug = uniqueSlug;
  }

  // Create lore entry
  let loreEntry;
  try {
    loreEntry = await prisma.loreEntry.create({
      data: {
        title: validated.title,
        content: validated.content,
        slug: validated.slug,
        category: validated.category,
        isVisible: validated.isVisible ?? false,
        isPublic: validated.isPublic ?? true,
        userId: user.id,
        gameWorldId: validated.gameWorldId,
      },
    });
  } catch (error) {
    console.error("[createLoreEntry] Database write failed:", error);
    throw error;
  }

  return { loreId: loreEntry.id, loreEntry };
}

/**
 * Get a lore entry by ID
 * @param id - Lore entry ID
 * @returns Lore entry with full details or null
 */
export async function getLoreEntryById(id: string) {
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
}

/**
 * Get all lore entries for a world
 * @param gameWorldId - World ID
 * @returns Array of lore entries
 */
export async function getLoreEntriesByWorld(gameWorldId: string) {
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
}

/**
 * Update an existing lore entry
 * @param data - Lore entry update data (validated with Zod)
 * @returns Updated lore entry
 * @throws Error if user not authorized or lore entry not found
 */
export async function updateLoreEntry(data: LoreEntryUpdateInput) {
  // Validate input with Zod
  const validated = UpdateLoreEntrySchema.parse(data);

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

  // Check if lore entry exists and user has permission
  const existingLore = await prisma.loreEntry.findUnique({
    where: { id: validated.id },
    include: {
      gameWorld: true,
    },
  });

  if (!existingLore) {
    throw new Error("Lore entry not found");
  }

  // Check ownership or editor permission
  if (existingLore.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: existingLore.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error(
        "Unauthorized: You don't have permission to edit this lore entry"
      );
    }
  }

  // If slug is being updated, check for uniqueness
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
      validated.slug = `${validated.slug}-${Math.random().toString(36).substring(2, 8)}`;
    }
  }

  // Build update data (only include fields that are provided)
  const updateData: any = {};
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.content !== undefined) updateData.content = validated.content;
  if (validated.slug !== undefined) updateData.slug = validated.slug;
  if (validated.category !== undefined) updateData.category = validated.category;
  if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;
  if (validated.isPublic !== undefined) updateData.isPublic = validated.isPublic;

  // Update lore entry
  const loreEntry = await prisma.loreEntry.update({
    where: { id: validated.id },
    data: updateData,
  });

  return loreEntry;
}

/**
 * Delete a lore entry
 * @param id - Lore entry ID
 * @returns Deleted lore entry ID
 * @throws Error if user not authorized or lore entry not found
 */
export async function deleteLoreEntry(id: string) {
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

  // Check if lore entry exists and user has permission
  const loreEntry = await prisma.loreEntry.findUnique({
    where: { id },
  });

  if (!loreEntry) {
    throw new Error("Lore entry not found");
  }

  // Check ownership or editor permission
  if (loreEntry.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: loreEntry.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error(
        "Unauthorized: You don't have permission to delete this lore entry"
      );
    }
  }

  // Delete lore entry
  await prisma.loreEntry.delete({
    where: { id },
  });

  return { loreId: id };
}

/**
 * Toggle lore entry visibility
 * Convenience action for showing/hiding lore entries
 * @param id - Lore entry ID
 * @returns Updated lore entry
 */
export async function toggleLoreVisibility(id: string) {
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

  const loreEntry = await prisma.loreEntry.findUnique({
    where: { id },
  });

  if (!loreEntry) {
    throw new Error("Lore entry not found");
  }

  // Check permission
  if (loreEntry.userId !== user.id) {
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: loreEntry.gameWorldId,
        userId: user.id,
        permission: { in: ["EDITOR", "OWNER"] },
      },
    });

    if (!member) {
      throw new Error(
        "Unauthorized: You don't have permission to modify this lore entry"
      );
    }
  }

  // Toggle visibility
  const updated = await prisma.loreEntry.update({
    where: { id },
    data: { isVisible: !loreEntry.isVisible },
  });

  return updated;
}
