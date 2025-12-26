import { NextResponse } from "next/server";
import { loadFrameTemplates, saveFrameTemplates } from "../utils/fs-frame-templates";

export async function POST(req: Request) {
  const body = await req.json();
  const templates = loadFrameTemplates();

  const id = "tmpl_" + Date.now().toString();

  const template = {
    id,
    name: body.name,
    description: body.description || "",
    baseMediaId: body.baseMediaId || null,
    layout: body.layout || {},
    createdAt: new Date().toISOString()
  };

  templates.push(template);
  saveFrameTemplates(templates);

  return NextResponse.json({ ok: true, template });
}
