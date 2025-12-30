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

export function loadQuests() {
  return readJson<any[]>("quests.json");
}

export function saveQuests(quests: any[]) {
  writeJson("quests.json", quests);
}

export function loadSteps() {
  return readJson<any[]>("quest-steps.json");
}

export function saveSteps(steps: any[]) {
  writeJson("quest-steps.json", steps);
}

export function loadRewards() {
  return readJson<any[]>("quest-rewards.json");
}

export function saveRewards(rewards: any[]) {
  writeJson("quest-rewards.json", rewards);
}

export function loadProgress() {
  return readJson<any[]>("quest-progress.json");
}

export function saveProgress(progress: any[]) {
  writeJson("quest-progress.json", progress);
}
