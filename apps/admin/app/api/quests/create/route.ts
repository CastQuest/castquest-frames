import { NextResponse } from "next/server";
import { loadQuests, saveQuests } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const quests = loadQuests();

  const id = "quest_" + Date.now().toString();
  const quest = {
    id,
    name: body.name,
    description: body.description || "",
    createdAt: new Date().toISOString()
  };

  quests.push(quest);
  saveQuests(quests);

  return NextResponse.json({ ok: true, quest });
}
