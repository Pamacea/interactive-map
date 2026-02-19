"use server";

/**
 * Migration Server Actions
 *
 * These actions can be called from the UI or API routes to fix data inconsistencies.
 * They run in the application context with proper database access.
 */

import { prisma } from "@/lib/prisma";
import { safeAsync, type Result } from "@/lib/errors";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";

/**
 * Fix world permissions - ensure all world owners have WorldMember records
 *
 * This can be called from a settings page or admin panel
 */
export async function fixWorldPermissions(): Promise<
  Result<{
    fixed: number;
    skipped: number;
    total: number;
    details: Array<{ worldId: string; worldTitle: string; action: string }>;
  }>
> {
  return safeAsync(async () => {
    // Find all worlds
    const worlds = await prisma.gameWorld.findMany();

    let fixedCount = 0;
    const details: Array<{ worldId: string; worldTitle: string; action: string }> = [];

    for (const world of worlds) {
      // Check if owner has a member record
      const existingMember = await prisma.worldMember.findUnique({
        where: {
          userId_gameWorldId: {
            userId: world.userId,
            gameWorldId: world.id,
          },
        },
      });

      if (!existingMember) {
        // Create missing member record
        await prisma.worldMember.create({
          data: {
            userId: world.userId,
            gameWorldId: world.id,
            permission: "OWNER",
          },
        });
        fixedCount++;
        details.push({
          worldId: world.id,
          worldTitle: world.title,
          action: "Created OWNER member record",
        });
      } else if (existingMember.permission !== "OWNER") {
        // Update incorrect permission
        await prisma.worldMember.update({
          where: {
            id: existingMember.id,
          },
          data: {
            permission: "OWNER",
          },
        });
        fixedCount++;
        details.push({
          worldId: world.id,
          worldTitle: world.title,
          action: `Updated permission from ${existingMember.permission} to OWNER`,
        });
      }
    }

    return {
      fixed: fixedCount,
      skipped: worlds.length - fixedCount,
      total: worlds.length,
      details,
    };
  }, "fixWorldPermissions");
}

/**
 * Generate slugs for all entities that don't have them
 * Call this to migrate existing data to use the new slug system
 */
export async function generateMissingSlugs(): Promise<
  Result<{
    pins: number;
    characters: number;
    lore: number;
    gallery: number;
  }>
> {
  return safeAsync(async () => {
    const results = {
      pins: 0,
      characters: 0,
      lore: 0,
      gallery: 0,
    };

    // Pins
    const pins = await prisma.pin.findMany({
      where: { slug: null },
      select: { id: true, title: true, gameWorldId: true },
    });

    for (const pin of pins) {
      const baseSlug = generateSlug(pin.title);
      const uniqueSlug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await prisma.pin.findFirst({
            where: { gameWorldId: pin.gameWorldId, slug, id: { not: pin.id } },
          });
          return !!existing;
        },
        pin.id
      );
      await prisma.pin.update({
        where: { id: pin.id },
        data: { slug: uniqueSlug },
      });
      results.pins++;
    }

    // Characters
    const characters = await prisma.character.findMany({
      where: { slug: null },
      select: { id: true, name: true, gameWorldId: true },
    });

    for (const char of characters) {
      const baseSlug = generateSlug(char.name);
      const uniqueSlug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await prisma.character.findFirst({
            where: { gameWorldId: char.gameWorldId, slug, id: { not: char.id } },
          });
          return !!existing;
        },
        char.id
      );
      await prisma.character.update({
        where: { id: char.id },
        data: { slug: uniqueSlug },
      });
      results.characters++;
    }

    // Lore
    const loreEntries = await prisma.loreEntry.findMany({
      where: { slug: null },
      select: { id: true, title: true, gameWorldId: true },
    });

    for (const lore of loreEntries) {
      const baseSlug = generateSlug(lore.title);
      const uniqueSlug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await prisma.loreEntry.findFirst({
            where: { gameWorldId: lore.gameWorldId, slug, id: { not: lore.id } },
          });
          return !!existing;
        },
        lore.id
      );
      await prisma.loreEntry.update({
        where: { id: lore.id },
        data: { slug: uniqueSlug },
      });
      results.lore++;
    }

    // Gallery - get items that need slugs
    const galleryItems = await prisma.galleryItem.findMany({
      where: { slug: null },
      select: {
        id: true,
        title: true,
        worldId: true,
        pinId: true,
        loreEntryId: true,
      },
    });

    for (const item of galleryItems) {
      // Determine worldId - items must have either direct worldId or be linked to pin/lore
      let effectiveWorldId = item.worldId;

      // If no direct worldId, try to get it from pin or loreEntry
      if (!effectiveWorldId) {
        if (item.pinId) {
          const pin = await prisma.pin.findUnique({
            where: { id: item.pinId },
            select: { gameWorldId: true },
          });
          effectiveWorldId = pin?.gameWorldId;
        } else if (item.loreEntryId) {
          const lore = await prisma.loreEntry.findUnique({
            where: { id: item.loreEntryId },
            select: { gameWorldId: true },
          });
          effectiveWorldId = lore?.gameWorldId;
        }
      }

      // Skip items without a world context
      if (!effectiveWorldId) {
        console.warn(`[generateMissingSlugs] Skipping gallery item ${item.id} - no world context`);
        continue;
      }

      // Generate slug from title only (no file extension)
      const baseSlug = generateSlug(item.title);
      const uniqueSlug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await prisma.galleryItem.findFirst({
            where: { worldId: effectiveWorldId, slug, id: { not: item.id } },
          });
          return !!existing;
        },
        item.id
      );
      await prisma.galleryItem.update({
        where: { id: item.id },
        data: { slug: uniqueSlug },
      });
      results.gallery++;
    }

    return { success: true, results };
  }, "generateMissingSlugs");
}
