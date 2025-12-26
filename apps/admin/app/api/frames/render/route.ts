import { NextResponse } from "next/server";
import { loadFrames, saveFrames } from "../../mints/utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { frameId } = body;

  const frames = loadFrames();
  const idx = frames.findIndex((f: any) => f.id === frameId);

  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Frame not found" }, { status: 404 });
  }

  const fakePath = `/rendered-frames/${frameId}.png`;

  frames[idx] = {
    ...frames[idx],
    renderedImagePath: fakePath,
    renderedAt: new Date().toISOString()
  };

  saveFrames(frames);

  return NextResponse.json({
    ok: true,
    frame: frames[idx],
    imageUrl: fakePath,
    note: "Mock renderer — no real image generated."
  });
}
