import { NextResponse, NextRequest } from "next/server";
import { QuestsService } from '@castquest/core-services';
import { requireAdmin } from '../../../../lib/auth';

const questsService = new QuestsService();

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    const adminAuth = requireAdmin(req);
    if (!adminAuth.authorized) {
      return NextResponse.json(adminAuth.error, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields per core-services schema with precise checks
    if (
      !body.title ||
      !body.difficulty ||
      !body.category ||
      !body.rewardType ||
      !body.requirementType ||
      body.requirementData === undefined ||
      body.requirementData === null
    ) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Missing required fields: title, difficulty, category, rewardType, requirementType, and requirementData are required' 
        },
        { status: 400 }
      );
    }

    const quest = await questsService.createQuest({
      title: body.title,
      description: body.description || '',
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

    return NextResponse.json({ ok: true, quest });
  } catch (error: unknown) {
    console.error('Failed to create quest:', error);

    const errorDetails =
      error instanceof Error
        ? error.message
        : error
        ? String(error)
        : 'Unknown error';

    return NextResponse.json(
      { 
        ok: false, 
        error: `Failed to create quest: ${errorDetails}` 
      },
      { status: 500 }
    );
  }
}
