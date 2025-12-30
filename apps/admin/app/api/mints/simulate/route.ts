import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    ok: true,
    input: body,
    gasEstimate: "120000",
    network: "base-sepolia-mock",
    notes: "Simulation only. No real chain calls performed."
  });
}
