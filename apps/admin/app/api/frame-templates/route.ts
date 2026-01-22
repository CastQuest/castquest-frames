import { NextResponse, NextRequest } from "next/server";
import { FramesService } from '@castquest/core-services';
import { requireAdmin } from '../../../lib/auth';

const framesService = new FramesService();

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const adminAuth = requireAdmin(request);
    if (!adminAuth.authorized) {
      return NextResponse.json(adminAuth.error, { status: 401 });
    }

    const templates = await framesService.listTemplates({
      limit: 100,
      offset: 0,
    });
    
    return NextResponse.json({ 
      success: true, 
      data: templates 
    });
  } catch (error) {
    console.error('Failed to load frame templates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load frame templates';
    return NextResponse.json({ 
      success: false, 
      data: [],
      error: errorMessage
    }, { status: 500 });
  }
}
