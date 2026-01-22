import { NextRequest, NextResponse } from 'next/server';
import { QuestsService } from '@castquest/core-services';

// Lazy initialization to avoid build-time errors
let questsService: QuestsService | null = null;

function getQuestsService(): QuestsService {
  if (!questsService) {
    questsService = new QuestsService();
  }
  return questsService;
}

/**
 * GET /api/quests/[id] - Get quest details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate quest ID
    if (!params.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quest ID is required',
        },
        { status: 400 }
      );
    }

    const quest = await getQuestsService().getQuestById(params.id);

    if (!quest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quest not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quest,
    });
  } catch (error: any) {
    console.error('Error getting quest:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get quest',
      },
      { status: 500 }
    );
  }
}
