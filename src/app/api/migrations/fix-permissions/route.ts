import { fixWorldPermissions } from "@/features/migrations";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/shared/lib/server-helpers";
import { Role } from "@prisma/client";

/**
 * API Route: Trigger World Permissions Fix (ADMIN ONLY)
 *
 * POST /api/migrations/fix-permissions
 *
 * This endpoint fixes world permissions by ensuring all world owners
 * have corresponding WorldMember records with OWNER permission.
 *
 * SECURITY: Requires ADMIN role to execute.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/migrations/fix-permissions \
 *     -H "Authorization: Bearer <token>"
 */
export async function POST() {
  try {
    // SECURITY: Verify user is authenticated and has ADMIN role
    const user = await getAuthenticatedUser();

    if (user.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const _result = await fixWorldPermissions();

    if (!result.success) {
      // Log error server-side but don't expose details to client
      console.error("[Migration] Failed:", result.error);
      return NextResponse.json(
        { error: "Migration failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "World permissions fixed successfully",
      data: result.data,
    });
  } catch (error: unknown) {
    // Log error server-side but don't expose details to client
    console.error("[Migration] Unexpected error:", error);

    // Check for authentication error
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
