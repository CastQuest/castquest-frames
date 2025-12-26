import { NextResponse } from "next/server";
import {
  loadFrameTemplates,
  loadFrames,
  saveFrames
} from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { templateId, mediaId, overrides } = body;

  const templates = loadFrameTemplates();
  const frames = loadFrames();

  const template = templates.find((t: any) => t.id === templateId);

  if (!template) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  const id = "frame_" + Date.now().toString();

  const frame = {
    id,
    templateId: template.id,
    mediaId: mediaId || template.baseMediaId || null,
    layout: {
      ...(template.layout || {}),
      ...(overrides || {}),
      cta: {
        ...(template.layout?.cta || {}),
        ...(overrides?.cta || {})
      }
    },
    createdAt: new Date().toISOString()
  };

  frames.push(frame);
  saveFrames(frames);

  return NextResponse.json({ ok: true, frame });
}
