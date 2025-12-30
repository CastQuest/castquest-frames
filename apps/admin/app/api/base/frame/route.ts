import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[BASE MOCK] Frame publish request:", body);

  const frameId = "frame_" + Date.now().toString();

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    frameId,
    url: `https://mock.castquest.xyz/frame/${frameId}`,
    publishedAt: new Date().toISOString()
  });
}
