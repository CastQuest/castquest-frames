import { NextResponse } from "next/server";
import { loadMints, saveMints, loadMintEvents, saveMintEvents } from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const mints = loadMints();
  const events = loadMintEvents();

  const id = "mint_" + Date.now().toString();

  const mint = {
    id,
    name: body.name || "Unnamed mint",
    status: "pending",
    frameId: body.frameId || null,
    questId: body.questId || null,
    createdAt: new Date().toISOString(),
    txHash: null
  };

  mints.push(mint);
  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId: id,
    type: "created",
    message: "Mint created (mock).",
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({ ok: true, mint });
}
