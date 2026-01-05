import { NextRequest, NextResponse } from 'next/server';

// Mock data for frames
const mockFrames = Array.from({ length: 45 }, (_, i) => ({
  id: `frame-${i + 1}`,
  name: `Frame ${i + 1}`,
  template: ['Basic', 'Premium', 'Custom', 'Quest'][i % 4],
  status: ['active', 'draft', 'paused', 'archived'][i % 4],
  metadata: {
    description: `Description for frame ${i + 1}`,
    tags: ['crypto', 'nft', 'social'],
  },
  imageUrl: i % 3 === 0 ? `https://picsum.photos/400/300?random=${i}` : undefined,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}));

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const status = searchParams.get('status');
    const template = searchParams.get('template');
    const search = searchParams.get('search');

    // Filter frames
    let filtered = [...mockFrames];
    
    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }
    
    if (template) {
      filtered = filtered.filter(f => f.template === template);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchLower) ||
        f.metadata.description.toLowerCase().includes(searchLower)
      );
    }

    // Paginate
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedFrames = filtered.slice(start, end);

    return NextResponse.json({
      success: true,
      data: paginatedFrames,
      pagination: {
        page,
        perPage,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / perPage),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch frames',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.template) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and template are required',
        },
        { status: 400 }
      );
    }

    // Create new frame
    const newFrame = {
      id: `frame-${Date.now()}`,
      name: body.name,
      template: body.template,
      status: body.status || 'draft',
      metadata: body.metadata || {},
      imageUrl: body.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production, save to database here
    mockFrames.unshift(newFrame);

    return NextResponse.json({
      success: true,
      data: newFrame,
      message: 'Frame created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create frame',
      },
      { status: 500 }
    );
  }
}
