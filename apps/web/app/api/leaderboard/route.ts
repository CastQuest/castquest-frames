import { NextRequest, NextResponse } from 'next/server';
import { LeaderboardService } from '@castquest/core-services';

// Lazy initialization to avoid build-time errors
let leaderboardService: LeaderboardService | null = null;

function getLeaderboardService(): LeaderboardService {
  if (!leaderboardService) {
    leaderboardService = new LeaderboardService();
  }
  return leaderboardService;
}

/**
 * GET /api/leaderboard - Get leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'global';
    const period = searchParams.get('period') || 'all-time';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const leaderboard = await getLeaderboardService().getLeaderboard(
      type,
      period,
      limit,
      offset
    );

    return NextResponse.json({
      success: true,
      data: leaderboard,
      count: leaderboard.length,
    });
  } catch (error: any) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get leaderboard',
      },
      { status: 500 }
    );
  }
}
