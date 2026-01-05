import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    systems: [
      { id: "1", name: "Database", status: "ok", subtitle: "Connected • 15ms latency" },
      { id: "2", name: "API Server", status: "ok", subtitle: "Running • 200 req/min" },
      { id: "3", name: "Workers", status: "ok", subtitle: "3 active • 2 idle" },
      { id: "4", name: "Brain Engine", status: "ok", subtitle: "Processing • 4 threads" },
      { id: "5", name: "Cache", status: "ok", subtitle: "Redis • 5ms latency" },
      { id: "6", name: "Oracle DB", status: "ok", subtitle: "Synced • Last: 5s ago" },
      { id: "7", name: "WebSocket", status: "ok", subtitle: "Connected • 12 clients" },
      { id: "8", name: "Storage", status: "ok", subtitle: "S3 • 85% available" },
      { id: "9", name: "Auth", status: "ok", subtitle: "JWT • Active sessions: 23" },
      { id: "10", name: "Queue", status: "ok", subtitle: "42 pending jobs" },
      { id: "11", name: "Monitoring", status: "ok", subtitle: "All metrics green" },
    ],
    worker: {
      lastRun: new Date(Date.now() - 120000).toISOString(),
      status: "idle",
    },
    brain: {
      eventCount: 1523,
      suggestionCount: 87,
      patternsDiscovered: 34,
      deepThinkingActive: false,
    },
  });
}
