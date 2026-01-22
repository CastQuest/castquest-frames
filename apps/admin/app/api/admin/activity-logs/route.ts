import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@castquest/core-services';
import { desc } from 'drizzle-orm';

/**
 * GET /api/admin/activity-logs - Get activity audit logs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const logs = await db.query.auditLogs.findMany({
      orderBy: [desc(schema.auditLogs.timestamp)],
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error: any) {
    console.error('Error getting activity logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get activity logs',
      },
      { status: 500 }
    );
  }
}
