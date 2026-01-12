import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';
import { requireAuth } from '../../../../../lib/auth';

const questsService = new QuestsService();

/**
 * GET /api/quests/[id]/progress - Get quest progress
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    if ('error' in authResult) {
      return NextResponse.json(authResult.error, { status: 401 });
    }
    
    const { userId } = authResult;

    const progress = await questsService.getUserProgress(userId, params.id);

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Error getting quest progress:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get quest progress',
      },
      { status: 500 }
    );
  }
}
