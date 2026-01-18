/**
 * Migration Script: Fix World Permissions
 *
 * This script ensures that all world owners have a corresponding WorldMember record
 * with OWNER permission. This fixes data inconsistency where worlds were created
 * without member records for their creators.
 *
 * Run: npx tsx scripts/fix-world-permissions.ts
 */

import { config } from "dotenv";
// Load environment variables from .env.local
config({ path: ".env.local" });

import { prisma } from "../src/lib/prisma";

async function fixWorldPermissions() {
  console.log("🔧 Starting world permissions fix...\n");

  try {
    // Find all worlds
    const worlds = await prisma.gameWorld.findMany({
      include: {
        members: {
          where: {
            userId: {
              // We'll filter in memory
            },
          },
        },
      },
    });

    console.log(`📊 Found ${worlds.length} worlds in database\n`);

    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const world of worlds) {
      // Check if owner has a member record
      const ownerMember = world.members.find(
        (member) => member.userId === world.userId
      );

      if (!ownerMember) {
        // Create missing member record
        try {
          await prisma.worldMember.create({
            data: {
              userId: world.userId,
              gameWorldId: world.id,
              permission: "OWNER",
            },
          });

          console.log(`✅ Fixed: Created OWNER member for world "${world.title}" (${world.id})`);
          fixedCount++;
        } catch (error) {
          console.error(
            `❌ Error: Failed to create member for world "${world.title}" (${world.id}):`,
            error
          );
          errorCount++;
        }
      } else {
        // Check if owner has correct permission
        if (ownerMember.permission !== "OWNER") {
          try {
            await prisma.worldMember.update({
              where: {
                id: ownerMember.id,
              },
              data: {
                permission: "OWNER",
              },
            });

            console.log(
              `✅ Fixed: Updated permission to OWNER for world "${world.title}" (${world.id})`
            );
            fixedCount++;
          } catch (error) {
            console.error(
              `❌ Error: Failed to update member for world "${world.title}" (${world.id}):`,
              error
            );
            errorCount++;
          }
        } else {
          console.log(`⏭️  Skipped: World "${world.title}" (${world.id}) already has correct permissions`);
          skippedCount++;
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📈 Summary:");
    console.log(`  ✅ Fixed: ${fixedCount} worlds`);
    console.log(`  ⏭️  Skipped: ${skippedCount} worlds`);
    console.log(`  ❌ Errors: ${errorCount} worlds`);
    console.log("=".repeat(60) + "\n");

    if (fixedCount > 0) {
      console.log("✨ World permissions have been successfully fixed!");
    } else if (errorCount === 0) {
      console.log("✨ All worlds already have correct permissions. No fixes needed.");
    }
  } catch (error) {
    console.error("❌ Fatal error during migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
fixWorldPermissions()
  .then(() => {
    console.log("✅ Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
