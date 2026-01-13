/**
 * Test script to check database connection and pins table
 * Run with: npx tsx scripts/check-pins-db.ts
 */

import { prisma } from "../src/lib/prisma";

async function checkPinsInDb() {
  console.log("🔍 Checking pins in database...");

  try {
    // Check all pins in database
    const allPins = await prisma.pin.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        gameWorld: {
          select: {
            title: true,
          },
        },
      },
    });

    console.log(`\n📊 Total pins in database: ${allPins.length}`);

    if (allPins.length === 0) {
      console.log("⚠️  No pins found in database!");
    } else {
      console.log("\n📌 Pins found:");
      allPins.forEach((pin, index) => {
        console.log(`\n${index + 1}. ${pin.title}`);
        console.log(`   ID: ${pin.id}`);
        console.log(`   World: ${pin.gameWorld.title}`);
        console.log(`   Created by: ${pin.user.name || pin.user.email || 'Unknown'}`);
        console.log(`   Type: ${pin.pinType}`);
        console.log(`   Location: [${pin.latitude}, ${pin.longitude}]`);
        console.log(`   Visible: ${pin.isVisible}`);
        console.log(`   Layer: ${pin.layerId || 'None'}`);
        console.log(`   Created at: ${pin.createdAt.toISOString()}`);
      });
    }

    // Check worlds
    const worlds = await prisma.gameWorld.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            pins: true,
          },
        },
      },
    });

    console.log(`\n🌍 Total worlds: ${worlds.length}`);
    worlds.forEach((world) => {
      console.log(`- ${world.title} (${world._count.pins} pins)`);
    });

    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            pins: true,
          },
        },
      },
    });

    console.log(`\n👥 Total users: ${users.length}`);
    users.forEach((user) => {
      console.log(`- ${user.name || user.email} (${user._count.pins} pins)`);
    });

  } catch (error) {
    console.error("❌ Error checking database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkPinsInDb()
  .then(() => {
    console.log("\n✅ Database check complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Database check failed:", error);
    process.exit(1);
  });
