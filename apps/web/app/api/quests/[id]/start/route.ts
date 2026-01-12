import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';
import { requireAuth } from '../../../../../lib/auth';

const questsService = new QuestsService();

/**
 * POST /api/quests/[id]/start - Start a quest
 */
export async function POST(
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

    const progress = await questsService.startQuest(params.id, userId);

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Error starting quest:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to start quest',
      },
      { status: 500 }
    );
  }
}
