import { NextRequest, NextResponse } from 'next/server';

// Mock data for quests
const mockQuests = Array.from({ length: 30 }, (_, i) => ({
  id: `quest-${i + 1}`,
  name: `Quest ${i + 1}`,
  status: ['active', 'completed', 'failed', 'pending'][i % 4],
  frameId: i % 3 === 0 ? `frame-${i + 1}` : undefined,
  progress: Math.floor(Math.random() * 100),
  totalSteps: 5 + Math.floor(Math.random() * 10),
  reward: {
    type: ['token', 'nft', 'points'][i % 3],
    amount: 10 + Math.floor(Math.random() * 90),
  },
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  completedAt: i % 4 === 1 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
}));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const status = searchParams.get('status');

    let filtered = [...mockQuests];
    
    if (status) {
      filtered = filtered.filter(q => q.status === status);
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = filtered.slice(start, end);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        perPage,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / perPage),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const newQuest = {
      id: `quest-${Date.now()}`,
      name: body.name,
      status: 'pending',
      frameId: body.frameId,
      progress: 0,
      totalSteps: body.totalSteps || 5,
      reward: body.reward,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newQuest,
      message: 'Quest created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create quest' },
      { status: 500 }
    );
  }
}
