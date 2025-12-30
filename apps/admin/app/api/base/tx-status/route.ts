import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get("txHash");

  return NextResponse.json({
    ok: true,
    txHash,
    status: "confirmed",
    confirmations: 5,
    confirmedAt: new Date().toISOString()
  });
}
