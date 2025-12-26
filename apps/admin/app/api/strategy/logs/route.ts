import { NextResponse } from "next/server";

const mockLogs = [
  {
    id: "1",
    level: "info",
    message: "Strategy worker started (mock).",
    time: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: "2",
    level: "info",
    message: "Scanned 12 media items for opportunities.",
    time: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: "3",
    level: "warn",
    message: "No onchain price data (mock) — using defaults.",
    time: new Date(Date.now() - 10000).toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    logs: mockLogs
  });
}
