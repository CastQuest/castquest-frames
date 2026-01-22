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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const quests = await getQuestsService().listQuests({
      difficulty,
      category,
      status,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: quests,
      count: quests.length,
    });
  } catch (error: any) {
    console.error('Error listing quests:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.difficulty || !body.category || !body.rewardType || !body.requirementType || !body.requirementData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, difficulty, category, rewardType, requirementType, or requirementData',
        },
        { status: 400 }
      );
    }

    const quest = await getQuestsService().createQuest({
      title: body.title,
      description: body.description,
      difficulty: body.difficulty,
      category: body.category,
      rewardType: body.rewardType,
      rewardAmount: body.rewardAmount,
      rewardData: body.rewardData ? JSON.stringify(body.rewardData) : undefined,
      requirementType: body.requirementType,
      requirementData: JSON.stringify(body.requirementData),
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: quest,
      message: 'Quest created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create quest' },
      { status: 500 }
    );
  }
}
