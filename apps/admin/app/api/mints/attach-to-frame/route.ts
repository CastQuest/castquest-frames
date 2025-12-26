import { NextResponse } from "next/server";
import { loadMints, saveMints, loadMintEvents, saveMintEvents } from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { mintId, frameId } = body;

  const mints = loadMints();
  const events = loadMintEvents();

  const mint = mints.find((m: any) => m.id === mintId);
  if (!mint) {
    return NextResponse.json({ ok: false, error: "Mint not found" }, { status: 404 });
  }

  mint.frameId = frameId;
  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId,
    type: "attach_frame",
    message: `Attached to frame ${frameId}.`,
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({ ok: true, mint });
}
