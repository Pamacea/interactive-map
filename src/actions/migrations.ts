"use server";

/**
 * Migration Server Actions
 *
 * These actions can be called from the UI or API routes to fix data inconsistencies.
 * They run in the application context with proper database access.
 */

import { prisma } from "@/lib/prisma";
import { safeAsync, type Result } from "@/lib/errors";

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
