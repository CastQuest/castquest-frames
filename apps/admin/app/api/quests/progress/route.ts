import { NextResponse } from "next/server";
import { loadProgress, saveProgress } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const progress = loadProgress();

  const existing = progress.find(
    (p: any) => p.questId === body.questId && p.userId === body.userId
  );

  if (!existing) {
    const entry = {
      id: "progress_" + Date.now().toString(),
      questId: body.questId,
      userId: body.userId,
      completedSteps: body.completedSteps || [],
      completedAt: null
    };
    progress.push(entry);
  } else {
    existing.completedSteps = Array.from(
      new Set([...(existing.completedSteps || []), ...(body.completedSteps || [])])
    );
  }

  saveProgress(progress);
  return NextResponse.json({ ok: true });
}
