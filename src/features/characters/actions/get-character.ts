"use server";

import { prisma } from "@/shared/lib/prisma";
import type { Character, CharacterPinRelation, CharacterRelationship, Pin } from "@prisma/client";

type CharacterWithRelations = Character & {
  user: { id: string; name: string | null; image: string | null } | null;
  gameWorld: { id: string; title: string } | null;
  gallery: Array<{ id: string; title: string; imageUrl: string }>;
  pinLinks: Array<CharacterPinRelation & { pin: Pin }>;
  relationshipsAsSource: Array<CharacterRelationship & { target: Character }>;
  relationshipsAsTarget: Array<CharacterRelationship & { source: Character }>;
};

/**
 * Get a character by ID with full relations
 */
export async function getCharacterById(id: string): Promise<CharacterWithRelations | null> {
  try {
    const character = await prisma.character.findUnique({
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
        pinLinks: {
          include: {
            pin: {
              include: {
                layer: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        relationshipsAsSource: {
          include: {
            target: {
              select: {
                id: true,
                name: true,
                shortName: true,
                portraitUrl: true,
                characterType: true,
              },
            },
          },
        },
        relationshipsAsTarget: {
          include: {
            source: {
              select: {
                id: true,
                name: true,
                shortName: true,
                portraitUrl: true,
                characterType: true,
              },
            },
          },
        },
      },
    });

    return character;
  } catch {
    return null;
  }
}

/**
 * Get all characters for a world
 */
export async function getCharactersByWorld(gameWorldId: string) {
  try {
    const characters = await prisma.character.findMany({
      where: { gameWorldId },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return characters;
  } catch {
    return [];
  }
}

/**
 * Get characters filtered by criteria
 */
export async function getCharactersFiltered(filters: {
  gameWorldId: string;
  characterTypes?: string[];
  roles?: string[];
  factions?: string[];
  searchTerm?: string;
  showVisibleOnly?: boolean;
}) {
  try {
    const where: Record<string, unknown> = {
      gameWorldId: filters.gameWorldId,
    };

    if (filters.showVisibleOnly) {
      where.isVisible = true;
    }

    if (filters.characterTypes && filters.characterTypes.length > 0) {
      where.characterType = { in: filters.characterTypes };
    }

    if (filters.roles && filters.roles.length > 0) {
      where.role = { in: filters.roles };
    }

    if (filters.factions && filters.factions.length > 0) {
      where.faction = { in: filters.factions };
    }

    if (filters.searchTerm) {
      where.OR = [
        { name: { contains: filters.searchTerm, mode: "insensitive" } },
        { shortName: { contains: filters.searchTerm, mode: "insensitive" } },
        { faction: { contains: filters.searchTerm, mode: "insensitive" } },
      ];
    }

    const characters = await prisma.character.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return characters;
  } catch {
    return [];
  }
}
