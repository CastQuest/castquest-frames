import { NextResponse, NextRequest } from "next/server";
import { FramesService } from '@castquest/core-services';
import { requireAdmin } from '../../../../lib/auth';

const framesService = new FramesService();

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    const adminAuth = requireAdmin(req);
    if (!adminAuth.authorized) {
      return NextResponse.json(adminAuth.error, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields per core-services schema
    if (!body.name || !body.category) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Missing required fields: name and category are required' 
        },
        { status: 400 }
      );
    }

    // Create template data matching the core-services schema
    const templateData = {
      primaryText: body.layout?.primaryText || '',
      secondaryText: body.layout?.secondaryText || '',
      cta: body.layout?.cta || { label: 'Mint', action: 'mint' },
      baseMediaId: body.baseMediaId || null,
    };

    const template = await framesService.createTemplate({
      name: body.name,
      description: body.description || '',
      category: body.category || 'custom',
      thumbnailUrl: body.thumbnailUrl,
      price: body.price,
      // Use authenticated admin user ID from auth context
      // Falls back to request body creatorId if provided for API flexibility
      creatorId: adminAuth.userId || body.creatorId || 'system-admin',
      tenantId: body.tenantId,
      templateData: JSON.stringify(templateData),
      version: body.version || '1.0.0',
    });

    return NextResponse.json({ ok: true, template });
  } catch (error: unknown) {
    console.error('Failed to create frame template:', error);
    
    const errorDetails =
      error instanceof Error
        ? error.message
        : error
        ? String(error)
        : 'Unknown error';
    
    return NextResponse.json(
      { 
        ok: false, 
        error: `Failed to create frame template: ${errorDetails}` 
      },
      { status: 500 }
    );
  }
}
