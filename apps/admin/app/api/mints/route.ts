import { NextRequest, NextResponse } from 'next/server';

// Mock data for mints
const mockMints = Array.from({ length: 50 }, (_, i) => ({
  id: `mint-${i + 1}`,
  questId: i % 2 === 0 ? `quest-${i + 1}` : undefined,
  frameId: i % 3 === 0 ? `frame-${i + 1}` : undefined,
  userId: `user-${Math.floor(Math.random() * 20) + 1}`,
  amount: 100 + Math.floor(Math.random() * 900),
  status: ['pending', 'completed', 'claimed', 'failed'][i % 4],
  claimStatus: i % 3 === 0 ? ['pending', 'approved', 'rejected'][i % 3] : undefined,
  txHash: i % 2 === 0 ? `0x${Math.random().toString(16).slice(2, 66)}` : undefined,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  claimedAt: i % 4 === 2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
}));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const status = searchParams.get('status');

    let filtered = [...mockMints];
    
    if (status) {
      filtered = filtered.filter(m => m.status === status);
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
      { success: false, error: error.message || 'Failed to fetch mints' },
      { status: 500 }
    );
  }
}
