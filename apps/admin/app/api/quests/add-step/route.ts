import { NextResponse } from "next/server";
import { loadSteps, saveSteps } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const steps = loadSteps();

  const id = "step_" + Date.now().toString();

  const step = {
    id,
    questId: body.questId,
    title: body.title,
    description: body.description || "",
    type: body.type || "custom",
    rewardId: body.rewardId || null
  };

  steps.push(step);
  saveSteps(steps);

  return NextResponse.json({ ok: true, step });
}
