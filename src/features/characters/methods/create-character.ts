/**
"use server";
 * Character Methods - Create Character
 *
 * Server Action wrapper with Zod validation
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const CreateCharacterSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  shortName: z.string().max(100, "Short name too long").optional(),
  characterType: z.enum(["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "COMPANION", "BOSS", "CUSTOM"]),
  role: z.enum(["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "BACKGROUND", "MENTOR", "ALLY", "NEUTRAL", "HOSTILE", "CUSTOM"]),
  portraitUrl: z.string().url().optional().or(z.literal("")),
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
  gameWorldId: z.string().min(1, "World ID is required"),
});

export type CreateCharacterInput = z.infer<typeof CreateCharacterSchema>;

// Update Character Schema (partial - all fields optional)
export const UpdateCharacterSchema = z.object({
  id: z.string().min(1, "Character ID is required"),
  name: z.string().min(1, "Name is required").max(200, "Name too long").optional(),
  shortName: z.string().max(100, "Short name too long").optional(),
  characterType: z.enum(["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "COMPANION", "BOSS", "CUSTOM"]).optional(),
  role: z.enum(["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "BACKGROUND", "MENTOR", "ALLY", "NEUTRAL", "HOSTILE", "CUSTOM"]).optional(),
  portraitUrl: z.string().url().optional().or(z.literal("")),
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

// Delete Character Schema
export const DeleteCharacterSchema = z.object({
  id: z.string().min(1, "Character ID is required"),
});

export type DeleteCharacterInput = z.infer<typeof DeleteCharacterSchema>;

// ============================================
// TYPES
// ============================================

export type Character = {
  id: string;
  name: string;
  shortName: string | null;
  characterType: string;
  role: string;
  portraitUrl: string | null;
  gameWorldId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Create a new character in a world
 * @param data - Validated character data
 * @returns Result with created character ID and data
 */
export async function createCharacter(
  data: CreateCharacterInput,
): Promise<Result<{ characterId: string; character: Character }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = CreateCharacterSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world permission
    await verifyWorldPermission(validated.gameWorldId, user.id);

    // Get the highest order value for existing characters in this world
    const maxOrder = await prisma.character.findFirst({
      where: { gameWorldId: validated.gameWorldId },
      select: { order: true },
      orderBy: { order: "desc" },
    });

    // Create character
    const character = await prisma.character.create({
      data: {
        name: validated.name,
        shortName: validated.shortName,
        characterType: validated.characterType,
        role: validated.role,
        portraitUrl: validated.portraitUrl || null,
        age: validated.age,
        gender: validated.gender,
        species: validated.species,
        height: validated.height,
        build: validated.build,
        level: validated.level,
        class: validated.class,
        faction: validated.faction,
        personality: validated.personality,
        background: validated.background,
        goals: validated.goals,
        fears: validated.fears,
        isVisible: validated.isVisible ?? true,
        isPublic: validated.isPublic ?? true,
        order: (maxOrder?.order ?? -1) + 1,
        userId: user.id,
        gameWorldId: validated.gameWorldId,
      },
    });

    revalidatePath(`/world/${validated.gameWorldId}`);

    return { characterId: character.id, character };
  }, "createCharacter");
}
