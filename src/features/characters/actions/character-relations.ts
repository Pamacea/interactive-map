"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission, verifyPinPermission } from "@/shared/lib/server-helpers";
import type { CharacterPinRelation, Character, Pin } from "@prisma/client";

type CharacterPinRelationWithInclude = CharacterPinRelation & {
  pin: Pin;
  character: Character;
};

/**
 * Link a character to a pin
 */
export async function linkCharacterToPin(
  characterId: string,
  pinId: string,
  relationType: string = "LOCATION",
  notes?: string
): Promise<Result<CharacterPinRelationWithInclude>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const character = await verifyCharacterPermission(characterId, user.id);
    await verifyPinPermission(pinId, user.id);

    if (character.gameWorldId) {
      const pin = await prisma.pin.findUnique({ where: { id: pinId } });
      if (pin?.gameWorldId !== character.gameWorldId) {
        throw new ValidationError("Character and pin must belong to the same world");
      }
    }

    const existing = await prisma.characterPinRelation.findUnique({
      where: {
        characterId_pinId: { characterId, pinId },
      },
    });

    if (existing) {
      throw new ValidationError("Character is already linked to this pin");
    }

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
 */
export async function unlinkCharacterFromPin(
  characterId: string,
  pinId: string
): Promise<Result<{ linkId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const character = await verifyCharacterPermission(characterId, user.id);
    await verifyPinPermission(pinId, user.id);

    const link = await prisma.characterPinRelation.findUnique({
      where: {
        characterId_pinId: { characterId, pinId },
      },
    });

    if (!link) {
      throw new ValidationError("Link does not exist");
    }

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
  } catch {
    return [];
  }
}

/**
 * Get all characters linked to a pin
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
  } catch {
    return [];
  }
}

/**
 * Update character-pin link order
 */
export async function reorderCharacterPinLinks(
  characterId: string,
  links: Array<{ linkId: string; order: number }>
): Promise<Result<CharacterPinRelation[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const character = await verifyCharacterPermission(characterId, user.id);

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

    const updates = await Promise.all(
      links.map(({ linkId, order }) =>
        prisma.characterPinRelation.update({
          where: { id: linkId },
          data: { order },
        })
      )
    );

    revalidatePath(`/world/${character.gameWorldId}`);

    return updates;
  }, "reorderCharacterPinLinks");
}
