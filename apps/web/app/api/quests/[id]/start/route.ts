import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';
<<<<<<< HEAD
import { requireUserId, handleAuthError } from '@/lib/auth';
=======
import { requireAuth } from '../../../../../lib/auth';
>>>>>>> origin/copilot/add-resolution-doc-and-cleanup

// Lazy initialization to avoid build-time errors
let questsService: QuestsService | null = null;

function getQuestsService(): QuestsService {
  if (!questsService) {
    questsService = new QuestsService();
  }
  return questsService;
}

/**
 * POST /api/quests/[id]/start - Start a quest
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate quest ID
    if (!params.id || typeof params.id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid quest ID',
        },
        { status: 400 }
      );
    }

    // Require authentication
    const userId = requireUserId(request);

    const progress = await getQuestsService().startQuest(params.id, userId);

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    // Handle authentication errors consistently
    const authErrorResponse = handleAuthError(error);
    if (authErrorResponse) {
      return authErrorResponse;
    }

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
