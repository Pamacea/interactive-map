import { NextRequest, NextResponse } from 'next/server';
import { getActiveUsers } from '@/actions/presence';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ worldId: string }> },
) {
  const { worldId } = await params;

  const result = await getActiveUsers({ worldId });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error?.message || 'Failed to fetch presence' },
      { status: 500 },
    );
  }

  return NextResponse.json(result.data);
}
