import { NextResponse } from "next/server";
import { generateMissingSlugs } from "@/actions/migrations";

/**
 * Generate slugs for existing entities
 * POST /api/migrations/generate-slugs
 */
export async function POST() {
  const result = await generateMissingSlugs();

  if (result.success) {
    return NextResponse.json(result.data);
  }

  return NextResponse.json(
    { success: false, error: "Failed to generate slugs" },
    { status: 500 }
  );
}
