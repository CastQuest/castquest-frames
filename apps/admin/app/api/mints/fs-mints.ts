import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const MINTS_FILE = path.join(DATA_DIR, "mints.json");
const EVENTS_FILE = path.join(DATA_DIR, "mint-events.json");

// Ensure data directory + files exist
function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MINTS_FILE)) {
    fs.writeFileSync(MINTS_FILE, "[]", "utf-8");
  }
  if (!fs.existsSync(EVENTS_FILE)) {
    fs.writeFileSync(EVENTS_FILE, "[]", "utf-8");
  }
}

export function readMints() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(MINTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[fs-mints] Failed to read mints.json:", err);
    return [];
  }
}

export function writeMints(mints: any[]) {
  ensureFiles();
  fs.writeFileSync(MINTS_FILE, JSON.stringify(mints, null, 2), "utf-8");
}

export function appendMintEvent(event: any) {
  ensureFiles();
  let events: any[] = [];
  try {
    events = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8"));
  } catch {
    events = [];
  }

  events.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  });

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export function createMint(payload: any) {
  const mints = readMints();

  const mint = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  mints.push(mint);
  writeMints(mints);

  appendMintEvent({
    type: "create",
    mintId: mint.id,
    payload,
  });

  return mint;
}

export function updateMint(id: string, updates: any) {
  const mints = readMints();
  const idx = mints.findIndex((m: any) => m.id === id);

  if (idx === -1) {
    throw new Error(`Mint not found: ${id}`);
  }

  mints[idx] = {
    ...mints[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeMints(mints);

  appendMintEvent({
    type: "update",
    mintId: id,
    updates,
  });

  return mints[idx];
}

export function getMint(id: string) {
  const mints = readMints();
  return mints.find((m: any) => m.id === id) || null;
}