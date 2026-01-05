import { NextRequest, NextResponse } from 'next/server';

const mockUsers = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@castquest.io`,
  role: ['admin', 'manager', 'operator', 'viewer'][i % 4],
  permissions: [],
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = mockUsers.slice(start, end);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        perPage,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / perPage),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
