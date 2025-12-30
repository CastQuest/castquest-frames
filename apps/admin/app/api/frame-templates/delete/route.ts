import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body;

  const templates = loadFrameTemplates();
  const filtered = templates.filter((t: any) => t.id !== id);

  if (filtered.length === templates.length) {
    return NextResponse.json({ ok: false, error: "Template not found" }, { status: 404 });
  }

  saveFrameTemplates(filtered);
  return NextResponse.json({ ok: true });
}
