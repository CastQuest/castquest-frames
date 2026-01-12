import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';
import { requireAuth } from '../../../../../lib/auth';

const questsService = new QuestsService();

/**
 * POST /api/quests/[id]/complete - Complete a quest
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

    const result = await questsService.completeQuest(params.id, userId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error completing quest:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to complete quest',
      },
      { status: 500 }
    );
  }
}
