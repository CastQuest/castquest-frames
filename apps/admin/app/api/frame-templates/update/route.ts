import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, patch } = body;

  const templates = loadFrameTemplates();
  const idx = templates.findIndex((t: any) => t.id === id);

  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  templates[idx] = {
    ...templates[idx],
    ...patch,
    layout: {
      ...(templates[idx].layout || {}),
      ...(patch.layout || {})
    }
  };

  saveFrameTemplates(templates);

  return NextResponse.json({ ok: true, template: templates[idx] });
}
