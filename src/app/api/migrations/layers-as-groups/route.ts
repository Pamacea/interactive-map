/**
 * API Route: Run Layers as Groups Migration
 *
 * POST /api/migrations/layers-as-groups
 *
 * This endpoint runs the migration to convert the old layer system
 * to the new "layers as groups" architecture.
 */

import { migrateLayersAsGroups } from "@/features/migrations";
import { getAuthenticatedUser } from "@/shared/lib/server-helpers";

// Restrict to admin users only
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    // Check if user is admin
    // @ts-expect-error - role property exists on User but is not in the type definition
    if (user.role !== "ADMIN") {
      return Response.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      message: "Migration endpoint ready. Use POST to run the migration.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 }
    );
  }
}

export async function POST() {
  try {
    const user = await getAuthenticatedUser();

    // Check if user is admin
    // @ts-expect-error - role property exists on User but is not in the type definition
    if (user.role !== "ADMIN") {
      return Response.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const _result = await migrateLayersAsGroups();

    if (!result.success) {
      console.error("[Migration] Failed:", result.error);
      return Response.json(
        { success: false, error: "Migration failed" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Layers as groups migration completed successfully",
      data: result.data,
    });
  } catch (error: unknown) {
    console.error("[Migration] Unexpected error:", error);

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      error.message === "Unauthorized"
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
