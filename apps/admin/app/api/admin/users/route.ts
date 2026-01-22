import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';

/**
 * GET /api/admin/users - List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const authCheck = requireAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(authCheck.error, { status: 403 });
    }
    
    // For now, return mock data as we don't have a list method in UserService
    // In production, add pagination to UserService
    
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        status: 'active',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'user2@example.com',
        status: 'active',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length,
    });
  } catch (error: any) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list users',
      },
      { status: 500 }
    );
  }
}
