/**
"use server";
 * Character Methods - Character-Pin Relations
 *
 * Server Action wrappers for linking characters to pins
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission, verifyPinPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const LinkCharacterToPinSchema = z.object({
  characterId: z.string().min(1, "Character ID is required"),
  pinId: z.string().min(1, "Pin ID is required"),
  relationType: z.string().default("LOCATION"),
  notes: z.string().max(500).optional(),
});

export type LinkCharacterToPinInput = z.infer<typeof LinkCharacterToPinSchema>;

// ============================================
// TYPES
// ============================================

export type CharacterPinRelationWithInclude = {
  id: string;
  characterId: string;
  pinId: string;
  relationType: string;
  notes: string | null;
  order: number;
  pin: {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    pinType: string;
  };
  character: {
    id: string;
    name: string;
    portraitUrl: string | null;
  };
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Link a character to a pin
 * @param characterId - Character ID
 * @param pinId - Pin ID
 * @param relationType - Type of relationship
 * @param notes - Optional notes
 * @returns Result with created link or error
 */
export async function linkCharacterToPin(
  characterId: string,
  pinId: string,
  relationType: string = "LOCATION",
  notes?: string,
): Promise<Result<CharacterPinRelationWithInclude>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permissions
    const character = await verifyCharacterPermission(characterId, user.id);
    await verifyPinPermission(pinId, user.id);

    // Verify same world
    if (character.gameWorldId) {
      const pin = await prisma.pin.findUnique({ where: { id: pinId } });
      if (pin?.gameWorldId !== character.gameWorldId) {
        throw new ValidationError("Character and pin must belong to the same world");
      }
    }

    // Check if link already exists
    const existing = await prisma.characterPinRelation.findUnique({
      where: {
        characterId_pinId: { characterId, pinId },
      },
    });

    if (existing) {
      throw new ValidationError("Character is already linked to this pin");
    }

    // Create link
    const link = await prisma.characterPinRelation.create({
      data: {
        characterId,
        pinId,
        relationType,
        notes,
      },
      include: {
        pin: true,
        character: true,
      },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return link;
  }, "linkCharacterToPin");
}

/**
 * Unlink a character from a pin
 * @param characterId - Character ID
 * @param pinId - Pin ID
 * @returns Result with deleted link ID or error
 */
export async function unlinkCharacterFromPin(
  characterId: string,
  pinId: string,
): Promise<Result<{ linkId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permissions
    const character = await verifyCharacterPermission(characterId, user.id);
    await verifyPinPermission(pinId, user.id);

    // Find link
    const link = await prisma.characterPinRelation.findUnique({
      where: {
        characterId_pinId: { characterId, pinId },
      },
    });

    if (!link) {
      throw new ValidationError("Link does not exist");
    }

    // Delete link
    await prisma.characterPinRelation.delete({
      where: {
        characterId_pinId: { characterId, pinId },
      },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return { linkId: link.id };
  }, "unlinkCharacterFromPin");
}

/**
 * Get all pins linked to a character
 * @param characterId - Character ID
 * @returns Array of pins with link metadata
 */
export async function getPinsForCharacter(characterId: string) {
  try {
    const links = await prisma.characterPinRelation.findMany({
      where: { characterId },
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
    console.error("[getPinsForCharacter] Failed to fetch pins:", error);
    return [];
  }
}

/**
 * Get all characters linked to a pin
 * @param pinId - Pin ID
 * @returns Array of characters with link metadata
 */
export async function getCharactersForPin(pinId: string) {
  try {
    const links = await prisma.characterPinRelation.findMany({
      where: { pinId },
      include: {
        character: {
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
      ...link.character,
      relationType: link.relationType,
      notes: link.notes,
      linkId: link.id,
    }));
  } catch (error) {
    console.error("[getCharactersForPin] Failed to fetch characters:", error);
    return [];
  }
}

/**
 * Update character-pin link order
 * SECURITY: Requires character permission to prevent unauthorized reordering
 * @param characterId - Character ID for permission check
 * @param links - Array of {linkId, order} pairs
 * @returns Result with updated links or error
 */
export async function reorderCharacterPinLinks(
  characterId: string,
  links: Array<{ linkId: string; order: number }>,
): Promise<Result<CharacterPinRelationWithInclude[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // SECURITY: Verify user has permission to edit this character
    const character = await verifyCharacterPermission(characterId, user.id);

    // Verify all links belong to this character
    const existingLinks = await Promise.all(
      links.map(({ linkId }) =>
        prisma.characterPinRelation.findUnique({
          where: { id: linkId },
          select: { id: true, characterId: true },
        })
      )
    );

    for (const link of existingLinks) {
      if (!link) {
        throw new ValidationError("One or more links not found");
      }
      if (link.characterId !== characterId) {
        throw new ValidationError("All links must belong to the specified character");
      }
    }

    // Update all links
    const updates = await Promise.all(
      links.map(({ linkId, order }) =>
        prisma.characterPinRelation.update({
          where: { id: linkId },
          data: { order },
        })
      )
    );

    revalidatePath(`/world/${character.gameWorldId}`);

    return updates as CharacterPinRelationWithInclude[];
  }, "reorderCharacterPinLinks");
}
