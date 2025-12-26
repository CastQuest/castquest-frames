import { NextResponse } from "next/server";
import {
  loadMints,
  saveMints,
  loadMintEvents,
  saveMintEvents
} from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { mintId } = body;

  const mints = loadMints();
  const events = loadMintEvents();

  const mint = mints.find((m: any) => m.id === mintId);
  if (!mint) {
    return NextResponse.json({ ok: false, error: "Mint not found" }, { status: 404 });
  }

  const fakeTxHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");

  mint.status = "confirmed";
  mint.txHash = fakeTxHash;

  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId,
    type: "claimed",
    message: "Mint claimed (mock, BASE).",
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({
    ok: true,
    mint,
    txHash: fakeTxHash,
    network: "base-sepolia-mock"
  });
}
