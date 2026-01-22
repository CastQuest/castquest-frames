import { NextRequest, NextResponse } from 'next/server';
import { FramesService } from '@castquest/core-services';

// Lazy initialization to avoid build-time errors
let framesService: FramesService | null = null;

function getFramesService(): FramesService {
  if (!framesService) {
    framesService = new FramesService();
  }
  return framesService;
}

/**
 * GET /api/market - Get marketplace listings
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const sort = searchParams.get('sort') || 'popular';
    const limit = parseInt(searchParams.get('limit') || '20');

    let templates;

    if (sort === 'popular') {
      templates = await getFramesService().getPopularTemplates(limit);
    } else if (sort === 'featured' || featured) {
      templates = await getFramesService().getFeaturedTemplates(limit);
    } else {
      templates = await getFramesService().listTemplates({
        category,
        status: 'published',
        featured,
        limit,
      });
    }

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error: any) {
    console.error('Error getting marketplace listings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get marketplace listings',
      },
      { status: 500 }
    );
  }
}
