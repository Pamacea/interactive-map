/**
"use server";
 * Character Methods - Update Character
 *
 * Server Action wrappers for character updates
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result, ValidationError } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission, verifyWorldPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const UpdateCharacterSchema = z.object({
  id: z.string().min(1, "Character ID is required"),
  name: z.string().min(1, "Name is required").max(200).optional(),
  shortName: z.string().max(100).optional(),
  characterType: z.enum(["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "COMPANION", "BOSS", "CUSTOM"]).optional(),
  role: z.enum(["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "BACKGROUND", "MENTOR", "ALLY", "NEUTRAL", "HOSTILE", "CUSTOM"]).optional(),
  portraitUrl: z.string().url().or(z.literal("")).optional(),
  age: z.number().int().min(0).max(10000).optional(),
  gender: z.string().max(50).optional(),
  species: z.string().max(100).optional(),
  height: z.string().max(50).optional(),
  build: z.string().max(50).optional(),
  level: z.number().int().min(1).max(1000).optional(),
  class: z.string().max(50).optional(),
  faction: z.string().max(100).optional(),
  personality: z.string().max(1000).optional(),
  background: z.string().max(5000).optional(),
  goals: z.string().max(2000).optional(),
  fears: z.string().max(2000).optional(),
  isVisible: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  order: z.number().int().optional(),
});

export type UpdateCharacterInput = z.infer<typeof UpdateCharacterSchema>;

// ============================================
// TYPES
// ============================================

export type Character = {
  id: string;
  name: string;
  gameWorldId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Update an existing character
 * @param data - Validated update data
 * @returns Result with updated character or error
 */
export async function updateCharacter(
  data: UpdateCharacterInput,
): Promise<Result<Character>> {
  return safeAsync(async () => {
    // Validate input
    const validated = UpdateCharacterSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission
    const existingCharacter = await verifyCharacterPermission(validated.id, user.id);

    // Build update data (only include provided fields)
    const updateData: Partial<Character> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.shortName !== undefined) updateData.shortName = validated.shortName;
    if (validated.characterType !== undefined) updateData.characterType = validated.characterType;
    if (validated.role !== undefined) updateData.role = validated.role;
    if (validated.portraitUrl !== undefined) updateData.portraitUrl = validated.portraitUrl;
    if (validated.age !== undefined) updateData.age = validated.age;
    if (validated.gender !== undefined) updateData.gender = validated.gender;
    if (validated.species !== undefined) updateData.species = validated.species;
    if (validated.height !== undefined) updateData.height = validated.height;
    if (validated.build !== undefined) updateData.build = validated.build;
    if (validated.level !== undefined) updateData.level = validated.level;
    if (validated.class !== undefined) updateData.class = validated.class;
    if (validated.faction !== undefined) updateData.faction = validated.faction;
    if (validated.personality !== undefined) updateData.personality = validated.personality;
    if (validated.background !== undefined) updateData.background = validated.background;
    if (validated.goals !== undefined) updateData.goals = validated.goals;
    if (validated.fears !== undefined) updateData.fears = validated.fears;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;
    if (validated.isPublic !== undefined) updateData.isPublic = validated.isPublic;
    if (validated.order !== undefined) updateData.order = validated.order;

    // Update character
    const character = await prisma.character.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath(`/world/${existingCharacter.gameWorldId}`);

    return character;
  }, "updateCharacter");
}

/**
 * Toggle character visibility
 * @param id - Character ID
 * @returns Result with updated character or error
 */
export async function toggleCharacterVisibility(id: string): Promise<Result<Character>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission
    const character = await verifyCharacterPermission(id, user.id);

    // Toggle visibility
    const updated = await prisma.character.update({
      where: { id },
      data: { isVisible: !character.isVisible },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return updated;
  }, "toggleCharacterVisibility");
}

/**
 * Batch update character orders
 * SECURITY: Requires world permission to prevent unauthorized reordering
 * @param gameWorldId - World ID for permission check
 * @param updates - Array of {id, order} pairs
 * @returns Result with updated characters or error
 */
export async function reorderCharacters(
  gameWorldId: string,
  updates: Array<{ id: string; order: number }>,
): Promise<Result<Character[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // SECURITY: Verify user has permission to edit this world's characters
    await verifyWorldPermission(gameWorldId, user.id);

    // Verify all characters belong to the same world
    const characters = await Promise.all(
      updates.map(({ id }) =>
        prisma.character.findUnique({
          where: { id },
          select: { id: true, gameWorldId: true },
        })
      )
    );

    // Check all characters exist and belong to the correct world
    for (const character of characters) {
      if (!character) {
        throw new ValidationError("One or more characters not found");
      }
      if (character.gameWorldId !== gameWorldId) {
        throw new ValidationError("All characters must belong to the same world");
      }
    }

    // Update all characters
    const updatedCharacters = await Promise.all(
      updates.map(({ id, order }) =>
        prisma.character.update({
          where: { id },
          data: { order },
        })
      )
    );

    return updatedCharacters;
  }, "reorderCharacters");
}
