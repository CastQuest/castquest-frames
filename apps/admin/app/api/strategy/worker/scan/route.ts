import { NextResponse } from "next/server";
import {
  loadFrames,
  loadMints,
  loadWorkerEvents,
  saveWorkerEvents
} from "../../../mints/utils/fs-mints";

export async function POST() {
  const frames = loadFrames();
  const mints = loadMints();
  const events = loadWorkerEvents();

  const id = "worker_evt_" + Date.now().toString();
  const entry = {
    id,
    type: "scan",
    message: `Scanned ${frames.length} frames and ${mints.length} mints (mock).`,
    time: new Date().toISOString()
  };

  events.push(entry);
  saveWorkerEvents(events);

  return NextResponse.json({
    ok: true,
    event: entry
  });
}
