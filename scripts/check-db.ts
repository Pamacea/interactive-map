import { prisma } from "../src/lib/prisma";

async function checkDatabase() {
  const worlds = await prisma.gameWorld.findMany({
    select: {
      id: true,
      title: true,
      map: true,
    },
  });

  console.log("\n=== DATABASE WORLD RECORDS ===");
  worlds.forEach((world) => {
    console.log(`\nWorld: ${world.title}`);
    console.log(`  ID: ${world.id}`);
    console.log(`  Map field: ${world.map}`);
    console.log(`  Map type: ${typeof world.map}`);
    console.log(`  Is null: ${world.map === null}`);
    console.log(`  Is undefined: ${world.map === undefined}`);
    if (world.map) {
      console.log(`  Map length: ${world.map.length}`);
      console.log(`  Map preview: ${world.map.substring(0, 100)}...`);
    }
  });

  await prisma.$disconnect();
}

checkDatabase().catch(console.error);
