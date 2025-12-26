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

export function loadFrameTemplates() {
  return readJson<any[]>("frame-templates.json");
}

export function saveFrameTemplates(templates: any[]) {
  writeJson("frame-templates.json", templates);
}

export function loadFrames() {
  return readJson<any[]>("frames.json");
}

export function saveFrames(frames: any[]) {
  writeJson("frames.json", frames);
}
