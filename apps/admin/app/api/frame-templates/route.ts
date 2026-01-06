import { NextResponse } from "next/server";
import { loadFrameTemplates } from "./utils/fs-frame-templates";

export async function GET() {
  try {
    const templates = loadFrameTemplates();
    return NextResponse.json({ 
      success: true, 
      data: templates 
    });
  } catch (error) {
    console.error('Failed to load frame templates:', error);
    return NextResponse.json({ 
      success: false, 
      data: [],
      error: 'Failed to load frame templates'
    }, { status: 500 });
  }
}
