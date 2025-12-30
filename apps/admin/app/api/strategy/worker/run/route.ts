import { NextResponse } from "next/server";
import { loadWorkerEvents, saveWorkerEvents } from "../../../mints/utils/fs-mints";

export async function POST() {
  const events = loadWorkerEvents();

  const id = "worker_evt_" + Date.now().toString();
  const entry = {
    id,
    type: "run",
    message: "Strategy worker run executed (mock).",
    time: new Date().toISOString()
  };

  events.push(entry);
  saveWorkerEvents(events);

  return NextResponse.json({
    ok: true,
    event: entry
  });
}
