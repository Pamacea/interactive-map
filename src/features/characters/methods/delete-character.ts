/**
"use server";
 * Character Methods - Delete Character
 *
 * Server Action wrapper for character deletion
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const DeleteCharacterSchema = z.object({
  id: z.string().min(1, "Character ID is required"),
});

export type DeleteCharacterInput = z.infer<typeof DeleteCharacterSchema>;

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Delete a character
 * @param id - Character ID
 * @returns Result with deleted character ID or error
 */
export async function deleteCharacter(id: string): Promise<Result<{ characterId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission
    const character = await verifyCharacterPermission(id, user.id);

    // Delete character
    await prisma.character.delete({
      where: { id },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return { characterId: id };
  }, "deleteCharacter");
}
