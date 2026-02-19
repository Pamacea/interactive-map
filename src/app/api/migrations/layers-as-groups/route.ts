/**
 * API Route: Run Layers as Groups Migration
 *
 * POST /api/migrations/layers-as-groups
 *
 * This endpoint runs the migration to convert the old layer system
 * to the new "layers as groups" architecture.
 */

import { POST } from "@/actions/migrations/migrate-layers-as-groups";
import { getAuthenticatedUser } from "@/lib/server-helpers";

export { POST };

// Restrict to admin users only
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    // Check if user is admin
    // @ts-ignore - role exists on User
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
