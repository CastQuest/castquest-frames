import fs from "node:fs";
import path from "node:path";

function readJson<T>(file: string): T {
  const p = path.join(process.cwd(), "data", file);
  if (!fs.existsSync(p)) return JSON.parse("[]");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function writeJson(file: string, data: any) {
  const p = path.join(process.cwd(), "data", file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export function loadMints() {
  return readJson<any[]>("mints.json");
}

export function saveMints(mints: any[]) {
  writeJson("mints.json", mints);
}

export function loadMintEvents() {
  return readJson<any[]>("mint-events.json");
}

export function saveMintEvents(events: any[]) {
  writeJson("mint-events.json", events);
}

export function loadFrames() {
  return readJson<any[]>("frames.json");
}

export function saveFrames(frames: any[]) {
  writeJson("frames.json", frames);
}

export function loadWorkerEvents() {
  return readJson<any[]>("worker-events.json");
}

export function saveWorkerEvents(events: any[]) {
  writeJson("worker-events.json", events);
}
