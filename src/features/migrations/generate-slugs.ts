"use server";

import { prisma } from "@/shared/lib/prisma";

export interface GenerateMissingSlugsResult {
  success: boolean;
  data?: { pins: number; lore: number; characters: number };
  error?: string;
}

export async function generateMissingSlugs(): Promise<GenerateMissingSlugsResult> {
  try {
    // Generate slugs for pins
    const pinsWithoutSlugs = await prisma.pin.findMany({
      where: { slug: null },
    });

    let pinsUpdated = 0;
    for (const pin of pinsWithoutSlugs) {
      const slug = `${pin.name.toLowerCase().replace(/\s+/g, "-")}-${pin.id.slice(0, 8)}`;
      await prisma.pin.update({
        where: { id: pin.id },
        data: { slug },
      });
      pinsUpdated++;
    }

    // Generate slugs for lore entries
    const loreWithoutSlugs = await prisma.loreEntry.findMany({
      where: { slug: null },
    });

    let loreUpdated = 0;
    for (const lore of loreWithoutSlugs) {
      const slug = `${lore.title.toLowerCase().replace(/\s+/g, "-")}-${lore.id.slice(0, 8)}`;
      await prisma.loreEntry.update({
        where: { id: lore.id },
        data: { slug },
      });
      loreUpdated++;
    }

    // Generate slugs for characters
    const charactersWithoutSlugs = await prisma.character.findMany({
      where: { slug: null },
    });

    let charactersUpdated = 0;
    for (const character of charactersWithoutSlugs) {
      const slug = `${character.name.toLowerCase().replace(/\s+/g, "-")}-${character.id.slice(0, 8)}`;
      await prisma.character.update({
        where: { id: character.id },
        data: { slug },
      });
      charactersUpdated++;
    }

    return {
      success: true,
      data: {
        pins: pinsUpdated,
        lore: loreUpdated,
        characters: charactersUpdated,
      },
    };
  } catch (error) {
    console.error("[Migration] generateMissingSlugs error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
