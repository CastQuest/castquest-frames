import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';
import { requireUserId, handleAuthError } from '@/lib/auth';

// Lazy initialization to avoid build-time errors
let questsService: QuestsService | null = null;

function getQuestsService(): QuestsService {
  if (!questsService) {
    questsService = new QuestsService();
  }
  return questsService;
}

/**
 * GET /api/quests/[id]/progress - Get quest progress
 */
export async function GET(
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

    const progress = await getQuestsService().getUserProgress(userId, params.id);

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

    console.error('Error getting quest progress:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get quest progress',
      },
      { status: 500 }
    );
  }
}
