import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[BASE MOCK] Mint request:", body);

  const fakeTxHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    txHash: fakeTxHash,
    status: "submitted",
    mintedAt: new Date().toISOString()
  });
}
