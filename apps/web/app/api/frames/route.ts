import { NextRequest, NextResponse } from 'next/server';
import { FramesService } from '@castquest/core-services';
<<<<<<< HEAD
import { requireUserId, handleAuthError } from '@/lib/auth';
=======
import { requireAuth } from '../../../lib/auth';
>>>>>>> origin/copilot/add-resolution-doc-and-cleanup

// Lazy initialization to avoid build-time errors
let framesService: FramesService | null = null;

function getFramesService(): FramesService {
  if (!framesService) {
    framesService = new FramesService();
  }
  return framesService;
}

/**
 * GET /api/frames - List frame templates
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const creatorId = searchParams.get('creatorId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const templates = await getFramesService().listTemplates({
      category,
      status,
      featured,
      creatorId,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error: any) {
    console.error('Error listing frames:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to list frames',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/frames - Create a new frame template
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const userId = requireUserId(request);
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category || !body.templateData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, category, or templateData',
        },
        { status: 400 }
      );
    }

    const template = await getFramesService().createTemplate({
      name: body.name,
      description: body.description,
      category: body.category,
      thumbnailUrl: body.thumbnailUrl,
      price: body.price,
      creatorId: userId,
      tenantId: body.tenantId,
      templateData: JSON.stringify(body.templateData),
      version: body.version || '1.0.0',
    });

    return NextResponse.json({
      success: true,
      data: template,
    }, { status: 201 });
  } catch (error: any) {
    // Handle authentication errors consistently
    const authErrorResponse = handleAuthError(error);
    if (authErrorResponse) {
      return authErrorResponse;
    }

    console.error('Error creating frame:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create frame',
      },
      { status: 500 }
    );
  }
}
