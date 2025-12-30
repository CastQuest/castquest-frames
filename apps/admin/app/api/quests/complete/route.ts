import { NextResponse } from "next/server";
import { loadProgress, saveProgress } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const progress = loadProgress();

  const existing = progress.find(
    (p: any) => p.questId === body.questId && p.userId === body.userId
  );

  if (!existing) {
    return NextResponse.json({ ok: false, error: "No progress entry" }, { status: 400 });
  }

  existing.completedAt = new Date().toISOString();
  saveProgress(progress);

  return NextResponse.json({ ok: true, progress: existing });
}
