import { NextResponse } from "next/server";
import { loadSteps, loadRewards } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const { questId, eventType } = body;

  const steps = loadSteps();
  const rewards = loadRewards();

  const matchingSteps = steps.filter(
    (s: any) => s.questId === questId && s.type === eventType
  );

  const triggeredRewards = matchingSteps
    .map((s: any) => rewards.find((r: any) => r.id === s.rewardId))
    .filter(Boolean);

  return NextResponse.json({
    ok: true,
    questId,
    eventType,
    stepsTriggered: matchingSteps.map((s: any) => s.id),
    rewards: triggeredRewards
  });
}
