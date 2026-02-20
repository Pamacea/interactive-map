/**
"use server";
 * Character Methods - Get Character
 *
 * Typed wrappers for character fetch operations
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";

// ============================================
// TYPES
// ============================================

export type CharacterWithRelations = {
  id: string;
  name: string;
  shortName: string | null;
  characterType: string;
  role: string;
  portraitUrl: string | null;
  age: number | null;
  gender: string | null;
  species: string | null;
  height: string | null;
  build: string | null;
  level: number | null;
  class: string | null;
  faction: string | null;
  personality: string | null;
  background: string | null;
  goals: string | null;
  fears: string | null;
  isVisible: boolean;
  isPublic: boolean;
  order: number;
  userId: string;
  gameWorldId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  gameWorld: {
    id: string;
    title: string;
  } | null;
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Get a character by ID with full relations
 * @param id - Character ID
 * @returns Character with full details or null
 */
export async function getCharacterById(id: string): Promise<CharacterWithRelations | null> {
  try {
    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
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
      },
    });

    return character;
  } catch (error) {
    console.error("[getCharacterById] Failed to fetch character:", error);
    return null;
  }
}

/**
 * Get all characters for a world
 * @param gameWorldId - World ID
 * @returns Array of characters with user info
 */
export async function getCharactersByWorld(gameWorldId: string) {
  try {
    const characters = await prisma.character.findMany({
      where: { gameWorldId },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return characters;
  } catch (error) {
    console.error("[getCharactersByWorld] Failed to fetch characters:", error);
    return [];
  }
}

/**
 * Get characters filtered by criteria
 * @param filters - Filter criteria
 * @returns Filtered array of characters
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
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return characters;
  } catch (error) {
    console.error("[getCharactersFiltered] Failed to fetch characters:", error);
    return [];
  }
}
