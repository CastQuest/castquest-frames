import { NextResponse } from "next/server";

// Mock Oracle stats - will be replaced with real Oracle integration
export async function GET() {
  const stats = {
    frames: {
      total: 128,
      active: 95,
    },
    quests: {
      total: 45,
      active: 19,
      pending: 12,
    },
    mints: {
      total: 250,
      pending: 42,
      completed: 208,
    },
    workers: {
      total: 5,
      active: 3,
      idle: 2,
    },
    brain: {
      events: 1523,
      suggestions: 87,
      patterns: 34,
    },
    oracle: {
      connected: true,
      lastSync: new Date().toISOString(),
      syncStatus: "success" as const,
    },
  };

  return NextResponse.json(stats);
}
