import { NextRequest, NextResponse } from 'next/server';
import { getActiveUsers } from '@/features/presence/actions';
import { getAuthenticatedUser } from '@/shared/lib/server-helpers';
import { verifyWorldPermission } from '@/shared/lib/server-helpers';

/**
 * GET /api/presence/[worldId]
 *
 * Returns active users for a world.
 * Requires authentication and world access permission.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ worldId: string }> },
) {
  try {
    // SECURITY: Verify user is authenticated
    const user = await getAuthenticatedUser();

    const { worldId } = await params;

    // SECURITY: Verify user has access to this world
    await verifyWorldPermission(worldId, user.id);

    const result = await getActiveUsers({ worldId });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch presence' },
        { status: 500 },
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    // Check for authentication error
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      error.message === 'Unauthorized'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for permission error
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.includes('do not have permission')
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
