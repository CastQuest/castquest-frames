#!/usr/bin/env bash
set -euo pipefail

echo "[MODULE 7 MEGA — MINT + RENDER + AUTOMATION] Starting…"

ADMIN_APP_DIR="apps/admin/app"
WEB_APP_DIR="apps/web/app"

mkdir -p data

# ----------------------------------------
# 1. JSON DB FILES
# ----------------------------------------
echo "[DB] Ensuring JSON DB files…"

if [ ! -f data/mints.json ]; then
  echo "[DB] Creating data/mints.json"
  cat > data/mints.json << 'JSON'
[]
JSON
else
  echo "[DB][SKIP] data/mints.json exists"
fi

if [ ! -f data/mint-events.json ]; then
  echo "[DB] Creating data/mint-events.json"
  cat > data/mint-events.json << 'JSON'
[]
JSON
else
  echo "[DB][SKIP] data/mint-events.json exists"
fi

if [ ! -f data/worker-events.json ]; then
  echo "[DB] Creating data/worker-events.json"
  cat > data/worker-events.json << 'JSON'
[]
JSON
else
  echo "[DB][SKIP] data/worker-events.json exists"
fi

if [ ! -f data/frames.json ]; then
  echo "[DB] Creating data/frames.json"
  cat > data/frames.json << 'JSON'
[]
JSON
else
  echo "[DB][SKIP] data/frames.json exists"
fi

# ----------------------------------------
# 2. SHARED FS UTILS FOR MINTS / FRAMES / WORKER
# ----------------------------------------
echo "[API] Creating shared fs utils…"

mkdir -p "$ADMIN_APP_DIR/api/mints/utils"
if [ ! -f "$ADMIN_APP_DIR/api/mints/utils/fs-mints.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/utils/fs-mints.ts" << 'EOF_TS'
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
EOF_TS
  echo "[API] Created: fs-mints.ts"
else
  echo "[API][SKIP] fs-mints.ts"
fi

# ----------------------------------------
# 3. ADMIN PAGES — MINTS
# ----------------------------------------
echo "[ADMIN] Creating mint admin pages…"

mkdir -p "$ADMIN_APP_DIR/mints"
mkdir -p "$ADMIN_APP_DIR/mints/[id]"

# /mints (list)
if [ ! -f "$ADMIN_APP_DIR/mints/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/mints/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Mint = {
  id: string;
  name: string;
  status: string;
  txHash?: string;
  createdAt?: string;
};

function loadMints(): Mint[] {
  const p = path.join(process.cwd(), "data", "mints.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function MintsAdminPage() {
  const mints = loadMints();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mints</h1>
      </div>

      {mints.length === 0 && (
        <p className="text-sm text-zinc-500">
          No mints yet. Use API /api/mints/create or UI flows to create them.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {mints.map((m) => (
          <Link
            key={m.id}
            href={`/mints/${m.id}`}
            className="border border-zinc-700 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold text-sm">{m.name}</div>
                <div className="text-[10px] text-zinc-600 mt-1">{m.id}</div>
              </div>
              <div className="text-xs">
                <span
                  className={`px-2 py-0.5 rounded ${
                    m.status === "confirmed"
                      ? "bg-emerald-900/40 text-emerald-200"
                      : m.status === "pending"
                      ? "bg-yellow-900/40 text-yellow-200"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/mints/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/mints/page.tsx"
fi

# /mints/[id]
if [ ! -f "$ADMIN_APP_DIR/mints/[id]/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/mints/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Mint = {
  id: string;
  name: string;
  status: string;
  txHash?: string;
  createdAt?: string;
  frameId?: string;
  questId?: string;
};

type MintEvent = {
  id: string;
  mintId: string;
  type: string;
  message: string;
  time: string;
};

function loadJson(file: string) {
  const p = path.join(process.cwd(), "data", file);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function MintDetailAdminPage({ params }: { params: { id: string } }) {
  const mints: Mint[] = loadJson("mints.json");
  const events: MintEvent[] = loadJson("mint-events.json");

  const mint = mints.find((m) => m.id === params.id);
  if (!mint) {
    return <div className="text-sm text-red-400">Mint not found.</div>;
  }

  const mintEvents = events.filter((e) => e.mintId === mint.id);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-xs text-zinc-500 mb-1">
          <Link href="/mints" className="hover:underline">
            ← Back to mints
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">{mint.name}</h1>
        <div className="text-xs text-zinc-500 mt-1">
          ID: {mint.id}
        </div>
        {mint.createdAt && (
          <div className="text-xs text-zinc-500">
            Created: {mint.createdAt}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Status</div>
          <div className="text-sm mt-1">{mint.status}</div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Tx Hash</div>
          <div className="text-[11px] mt-1 break-all">
            {mint.txHash || "—"}
          </div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Links</div>
          <div className="text-[11px] mt-1 flex flex-col gap-1">
            <div>Frame: {mint.frameId || "—"}</div>
            <div>Quest: {mint.questId || "—"}</div>
          </div>
        </div>
      </div>

      <div className="border border-zinc-700 rounded overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
          Events
        </div>
        <div className="max-h-[300px] overflow-auto text-sm">
          {mintEvents.length === 0 && (
            <div className="p-3 text-xs text-zinc-500">
              No events yet. Strategy worker and mint APIs will log here.
            </div>
          )}
          {mintEvents.map((e) => (
            <div
              key={e.id}
              className="px-3 py-2 border-b border-zinc-800 flex flex-col gap-1"
            >
              <div className="text-[11px] text-zinc-500">
                {e.time} — {e.type}
              </div>
              <div className="text-xs">{e.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/mints/[id]/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/mints/[id]/page.tsx"
fi

# ----------------------------------------
# 4. FRAME PREVIEW PAGE (ADMIN) USING FRAMES JSON
# ----------------------------------------
echo "[ADMIN] Creating frame preview page…"

mkdir -p "$ADMIN_APP_DIR/frames"
mkdir -p "$ADMIN_APP_DIR/frames/[id]"

if [ ! -f "$ADMIN_APP_DIR/frames/[id]/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/frames/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type CTA = {
  label?: string;
  action?: string;
};

type Layout = {
  primaryText?: string;
  secondaryText?: string;
  cta?: CTA;
};

type Frame = {
  id: string;
  templateId?: string;
  mediaId?: string;
  layout?: Layout;
  renderedImagePath?: string;
  createdAt?: string;
};

function loadFrames(): Frame[] {
  const p = path.join(process.cwd(), "data", "frames.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function FrameDetailAdminPage({ params }: { params: { id: string } }) {
  const frames = loadFrames();
  const frame = frames.find((f) => f.id === params.id);

  if (!frame) {
    return <div className="text-sm text-red-400">Frame not found.</div>;
  }

  const layout = frame.layout || {};
  const cta = layout.cta || {};

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-xs text-zinc-500 mb-1">
          <Link href="/frames" className="hover:underline">
            ← Back to frames
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">Frame {frame.id}</h1>
        {frame.createdAt && (
          <p className="text-xs text-zinc-500">
            Created: {frame.createdAt}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Template</div>
          <div className="text-xs mt-1">
            {frame.templateId || "—"}
          </div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Media</div>
          <div className="text-xs mt-1">
            {frame.mediaId || "—"}
          </div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Rendered</div>
          <div className="text-xs mt-1">
            {frame.renderedImagePath || "Not rendered"}
          </div>
        </div>
      </div>

      <div className="border border-zinc-700 rounded overflow-hidden">
        <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
          Mock Preview
        </div>
        <div className="p-4 bg-zinc-950 flex flex-col gap-3 text-sm">
          <div className="aspect-video w-full max-w-sm border border-zinc-800 rounded bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">
            {frame.mediaId ? `Media: ${frame.mediaId}` : "No media linked"}
          </div>
          <div>
            <div className="text-sm font-semibold">
              {layout.primaryText || "Primary text"}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {layout.secondaryText || "Secondary supporting text"}
            </div>
          </div>
          <div className="mt-2">
            <button className="px-3 py-1.5 rounded bg-emerald-600 text-xs font-semibold">
              {cta.label || "CTA"}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Use /api/frames/render to attach a rendered image to this frame (mock).
      </p>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/frames/[id]/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/frames/[id]/page.tsx"
fi

# ----------------------------------------
# 5. MINT ACTION APIs (7A)
# ----------------------------------------
echo "[API] Creating mint action APIs…"

mkdir -p "$ADMIN_APP_DIR/api/mints"
mkdir -p "$ADMIN_APP_DIR/api/mints/create"
mkdir -p "$ADMIN_APP_DIR/api/mints/simulate"
mkdir -p "$ADMIN_APP_DIR/api/mints/claim"
mkdir -p "$ADMIN_APP_DIR/api/mints/attach-to-frame"
mkdir -p "$ADMIN_APP_DIR/api/mints/attach-to-quest"

# /api/mints/create
if [ ! -f "$ADMIN_APP_DIR/api/mints/create/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/create/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadMints, saveMints, loadMintEvents, saveMintEvents } from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const mints = loadMints();
  const events = loadMintEvents();

  const id = "mint_" + Date.now().toString();

  const mint = {
    id,
    name: body.name || "Unnamed mint",
    status: "pending",
    frameId: body.frameId || null,
    questId: body.questId || null,
    createdAt: new Date().toISOString(),
    txHash: null
  };

  mints.push(mint);
  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId: id,
    type: "created",
    message: "Mint created (mock).",
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({ ok: true, mint });
}
EOF_TS
  echo "[API] Created: /api/mints/create"
else
  echo "[API][SKIP] /api/mints/create"
fi

# /api/mints/simulate
if [ ! -f "$ADMIN_APP_DIR/api/mints/simulate/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/simulate/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    ok: true,
    input: body,
    gasEstimate: "120000",
    network: "base-sepolia-mock",
    notes: "Simulation only. No real chain calls performed."
  });
}
EOF_TS
  echo "[API] Created: /api/mints/simulate"
else
  echo "[API][SKIP] /api/mints/simulate"
fi

# /api/mints/claim
if [ ! -f "$ADMIN_APP_DIR/api/mints/claim/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/claim/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import {
  loadMints,
  saveMints,
  loadMintEvents,
  saveMintEvents
} from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { mintId } = body;

  const mints = loadMints();
  const events = loadMintEvents();

  const mint = mints.find((m: any) => m.id === mintId);
  if (!mint) {
    return NextResponse.json({ ok: false, error: "Mint not found" }, { status: 404 });
  }

  const fakeTxHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");

  mint.status = "confirmed";
  mint.txHash = fakeTxHash;

  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId,
    type: "claimed",
    message: "Mint claimed (mock, BASE).",
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({
    ok: true,
    mint,
    txHash: fakeTxHash,
    network: "base-sepolia-mock"
  });
}
EOF_TS
  echo "[API] Created: /api/mints/claim"
else
  echo "[API][SKIP] /api/mints/claim"
fi

# /api/mints/attach-to-frame
if [ ! -f "$ADMIN_APP_DIR/api/mints/attach-to-frame/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/attach-to-frame/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadMints, saveMints, loadMintEvents, saveMintEvents } from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { mintId, frameId } = body;

  const mints = loadMints();
  const events = loadMintEvents();

  const mint = mints.find((m: any) => m.id === mintId);
  if (!mint) {
    return NextResponse.json({ ok: false, error: "Mint not found" }, { status: 404 });
  }

  mint.frameId = frameId;
  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId,
    type: "attach_frame",
    message: `Attached to frame ${frameId}.`,
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({ ok: true, mint });
}
EOF_TS
  echo "[API] Created: /api/mints/attach-to-frame"
else
  echo "[API][SKIP] /api/mints/attach-to-frame"
fi

# /api/mints/attach-to-quest
if [ ! -f "$ADMIN_APP_DIR/api/mints/attach-to-quest/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/mints/attach-to-quest/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadMints, saveMints, loadMintEvents, saveMintEvents } from "../utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { mintId, questId } = body;

  const mints = loadMints();
  const events = loadMintEvents();

  const mint = mints.find((m: any) => m.id === mintId);
  if (!mint) {
    return NextResponse.json({ ok: false, error: "Mint not found" }, { status: 404 });
  }

  mint.questId = questId;
  saveMints(mints);

  events.push({
    id: "mevt_" + Date.now().toString(),
    mintId,
    type: "attach_quest",
    message: `Attached to quest ${questId}.`,
    time: new Date().toISOString()
  });

  saveMintEvents(events);

  return NextResponse.json({ ok: true, mint });
}
EOF_TS
  echo "[API] Created: /api/mints/attach-to-quest"
else
  echo "[API][SKIP] /api/mints/attach-to-quest"
fi

# ----------------------------------------
# 6. FRAME RENDERER APIs (7B, MOCK)
# ----------------------------------------
echo "[API] Creating frame renderer APIs…"

mkdir -p "$ADMIN_APP_DIR/api/frames"
mkdir -p "$ADMIN_APP_DIR/api/frames/render"

# /api/frames/render
if [ ! -f "$ADMIN_APP_DIR/api/frames/render/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/frames/render/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadFrames, saveFrames } from "../../mints/utils/fs-mints";

export async function POST(req: Request) {
  const body = await req.json();
  const { frameId } = body;

  const frames = loadFrames();
  const idx = frames.findIndex((f: any) => f.id === frameId);

  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Frame not found" }, { status: 404 });
  }

  const fakePath = `/rendered-frames/${frameId}.png`;

  frames[idx] = {
    ...frames[idx],
    renderedImagePath: fakePath,
    renderedAt: new Date().toISOString()
  };

  saveFrames(frames);

  return NextResponse.json({
    ok: true,
    frame: frames[idx],
    imageUrl: fakePath,
    note: "Mock renderer — no real image generated."
  });
}
EOF_TS
  echo "[API] Created: /api/frames/render"
else
  echo "[API][SKIP] /api/frames/render"
fi

# ----------------------------------------
# 7. QUEST AUTOMATION / WORKER APIs (7C)
# ----------------------------------------
echo "[API] Creating worker automation APIs…"

mkdir -p "$ADMIN_APP_DIR/api/strategy/worker"
mkdir -p "$ADMIN_APP_DIR/api/strategy/worker/run"
mkdir -p "$ADMIN_APP_DIR/api/strategy/worker/scan"

# /api/strategy/worker/run
if [ ! -f "$ADMIN_APP_DIR/api/strategy/worker/run/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/strategy/worker/run/route.ts" << 'EOF_TS'
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
EOF_TS
  echo "[API] Created: /api/strategy/worker/run"
else
  echo "[API][SKIP] /api/strategy/worker/run"
fi

# /api/strategy/worker/scan
if [ ! -f "$ADMIN_APP_DIR/api/strategy/worker/scan/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/strategy/worker/scan/route.ts" << 'EOF_TS'
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
EOF_TS
  echo "[API] Created: /api/strategy/worker/scan"
else
  echo "[API][SKIP] /api/strategy/worker/scan"
fi

echo "[MODULE 7 MEGA — MINT + RENDER + AUTOMATION] Complete."
