import { fixWorldPermissions } from "@/actions/migrations";
import { NextResponse } from "next/server";

/**
 * API Route: Trigger World Permissions Fix
 *
 * POST /api/migrations/fix-permissions
 *
 * This endpoint fixes world permissions by ensuring all world owners
 * have corresponding WorldMember records with OWNER permission.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/migrations/fix-permissions
 */
export async function POST() {
  try {
    const result = await fixWorldPermissions();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "World permissions fixed successfully",
      data: result.data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
