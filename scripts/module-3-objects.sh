
#!/usr/bin/env bash
set -euo pipefail

echo "[MODULE 3 — FRAMES/MINTS/QUESTS DB + ADMIN PAGES] Starting…"

# ----------------------------------------
# 1. Create JSON DB files
# ----------------------------------------
mkdir -p data

if [ ! -f data/frames.json ]; then
  echo "[SAFE] Creating data/frames.json"
  cat > data/frames.json << 'JSON'
[]
JSON
else
  echo "[SAFE] data/frames.json exists — skipping"
fi

if [ ! -f data/mints.json ]; then
  echo "[SAFE] Creating data/mints.json"
  cat > data/mints.json << 'JSON'
[]
JSON
else
  echo "[SAFE] data/mints.json exists — skipping"
fi

if [ ! -f data/quests.json ]; then
  echo "[SAFE] Creating data/quests.json"
  cat > data/quests.json << 'JSON'
[]
JSON
else
  echo "[SAFE] data/quests.json exists — skipping"
fi

# ----------------------------------------
# 2. Create admin pages for Frames/Mints/Quests
# ----------------------------------------
mkdir -p apps/admin/app/frames
mkdir -p apps/admin/app/mints
mkdir -p apps/admin/app/quests

# FRAMES LIST PAGE
if [ ! -f apps/admin/app/frames/page.tsx ]; then
  echo "[SAFE] Creating apps/admin/app/frames/page.tsx"
  cat > apps/admin/app/frames/page.tsx << 'TSX'
import fs from "node:fs";
import path from "node:path";

export default function FramesPage() {
  const dbPath = path.join(process.cwd(), "data", "frames.json");
  const raw = fs.readFileSync(dbPath, "utf8");
  const frames = JSON.parse(raw);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Frames</h1>

      {frames.length === 0 && (
        <p className="text-zinc-400">No frames created yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {frames.map((f: any) => (
          <div key={f.id} className="p-4 border border-zinc-700 rounded">
            <div className="font-semibold">{f.name}</div>
            <div className="text-sm text-zinc-400">{f.description}</div>
            <div className="text-xs text-zinc-500 mt-1">{f.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX
fi

# MINTS LIST PAGE
if [ ! -f apps/admin/app/mints/page.tsx ]; then
  echo "[SAFE] Creating apps/admin/app/mints/page.tsx"
  cat > apps/admin/app/mints/page.tsx << 'TSX'
import fs from "node:fs";
import path from "node:path";

export default function MintsPage() {
  const dbPath = path.join(process.cwd(), "data", "mints.json");
  const raw = fs.readFileSync(dbPath, "utf8");
  const mints = JSON.parse(raw);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Mints</h1>

      {mints.length === 0 && (
        <p className="text-zinc-400">No mints created yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {mints.map((m: any) => (
          <div key={m.id} className="p-4 border border-zinc-700 rounded">
            <div className="font-semibold">{m.name}</div>
            <div className="text-sm text-zinc-400">{m.description}</div>
            <div className="text-xs text-zinc-500 mt-1">{m.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX
fi

# QUESTS LIST PAGE
if [ ! -f apps/admin/app/quests/page.tsx ]; then
  echo "[SAFE] Creating apps/admin/app/quests/page.tsx"
  cat > apps/admin/app/quests/page.tsx << 'TSX'
import fs from "node:fs";
import path from "node:path";

export default function QuestsPage() {
  const dbPath = path.join(process.cwd(), "data", "quests.json");
  const raw = fs.readFileSync(dbPath, "utf8");
  const quests = JSON.parse(raw);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Quests</h1>

      {quests.length === 0 && (
        <p className="text-zinc-400">No quests created yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {quests.map((q: any) => (
          <div key={q.id} className="p-4 border border-zinc-700 rounded">
            <div className="font-semibold">{q.name}</div>
            <div className="text-sm text-zinc-400">{q.description}</div>
            <div className="text-xs text-zinc-500 mt-1">{q.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
TSX
fi

# ----------------------------------------
# 3. Conversion Logic — Write to DB
# ----------------------------------------
mkdir -p apps/admin/app/api/admin/convert/frame
mkdir -p apps/admin/app/api/admin/convert/mint
mkdir -p apps/admin/app/api/admin/convert/quest

# FRAME CONVERSION
if [ ! -f apps/admin/app/api/admin/convert/frame/route.ts ]; then
  echo "[SAFE] Creating convert/frame route"
  cat > apps/admin/app/api/admin/convert/frame/route.ts << 'TS'
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id");

  const mediaPath = path.join(process.cwd(), "data", "media.json");
  const framesPath = path.join(process.cwd(), "data", "frames.json");

  const media = JSON.parse(fs.readFileSync(mediaPath, "utf8"));
  const frames = JSON.parse(fs.readFileSync(framesPath, "utf8"));

  const item = media.find((m: any) => m.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  frames.push(item);
  fs.writeFileSync(framesPath, JSON.stringify(frames, null, 2));

  return NextResponse.redirect(`/frames`);
}
TS
fi

# MINT CONVERSION
if [ ! -f apps/admin/app/api/admin/convert/mint/route.ts ]; then
  echo "[SAFE] Creating convert/mint route"
  cat > apps/admin/app/api/admin/convert/mint/route.ts << 'TS'
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id");

  const mediaPath = path.join(process.cwd(), "data", "media.json");
  const mintsPath = path.join(process.cwd(), "data", "mints.json");

  const media = JSON.parse(fs.readFileSync(mediaPath, "utf8"));
  const mints = JSON.parse(fs.readFileSync(mintsPath, "utf8"));

  const item = media.find((m: any) => m.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  mints.push(item);
  fs.writeFileSync(mintsPath, JSON.stringify(mints, null, 2));

  return NextResponse.redirect(`/mints`);
}
TS
fi

# QUEST CONVERSION
if [ ! -f apps/admin/app/api/admin/convert/quest/route.ts ]; then
  echo "[SAFE] Creating convert/quest route"
  cat > apps/admin/app/api/admin/convert/quest/route.ts << 'TS'
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id");

  const mediaPath = path.join(process.cwd(), "data", "media.json");
  const questsPath = path.join(process.cwd(), "data", "quests.json");

  const media = JSON.parse(fs.readFileSync(mediaPath, "utf8"));
  const quests = JSON.parse(fs.readFileSync(questsPath, "utf8"));

  const item = media.find((m: any) => m.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  quests.push(item);
  fs.writeFileSync(questsPath, JSON.stringify(quests, null, 2));

  return NextResponse.redirect(`/quests`);
}
TS
fi

echo "[MODULE 3 — FRAMES/MINTS/QUESTS DB + ADMIN PAGES] Complete."
