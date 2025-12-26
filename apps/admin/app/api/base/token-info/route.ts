import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker") || "CAST";

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    ticker,
    address: "0x0000000000000000000000000000000000cA57",
    decimals: 18,
    totalSupply: "1000000",
    holders: 42
  });
}
