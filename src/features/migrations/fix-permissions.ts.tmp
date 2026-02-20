"use server";

import { prisma } from "@/shared/lib/prisma";

export interface FixWorldPermissionsResult {
  success: boolean;
  data?: { fixed: number; total: number };
  error?: string;
}

export async function fixWorldPermissions(): Promise<FixWorldPermissionsResult> {
  try {
    // Get all worlds
    const worlds = await prisma.gameWorld.findMany({
      include: {
        members: true,
      },
    });

    let fixedCount = 0;

    for (const world of worlds) {
      // Check if owner has a WorldMember record
      const ownerMember = world.members.find(
        (m) => m.userId === world.userId
      );

      if (!ownerMember) {
        // Create missing WorldMember record for owner
        await prisma.worldMember.create({
          data: {
            worldId: world.id,
            userId: world.userId,
            permission: "OWNER",
          },
        });
        fixedCount++;
      }
    }

    return {
      success: true,
      data: { fixed: fixedCount, total: worlds.length },
    };
  } catch (error) {
    console.error("[Migration] fixWorldPermissions error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
