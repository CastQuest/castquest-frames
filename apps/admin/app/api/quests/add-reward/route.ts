import { NextResponse } from "next/server";
import { loadRewards, saveRewards } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const rewards = loadRewards();

  const id = "reward_" + Date.now().toString();

  const reward = {
    id,
    questId: body.questId,
    type: body.type || "xp",
    amount: body.amount || 0,
    metadata: body.metadata || null
  };

  rewards.push(reward);
  saveRewards(rewards);

  return NextResponse.json({ ok: true, reward });
}
