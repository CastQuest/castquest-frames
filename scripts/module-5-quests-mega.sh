#!/usr/bin/env bash
set -euo pipefail

echo "[MODULE 5B — QUEST ENGINE MEGA] Starting…"

ADMIN_APP_DIR="apps/admin/app"
WEB_APP_DIR="apps/web/app"

mkdir -p data

# ----------------------------------------
# 1. Quest data model JSON files
# ----------------------------------------
echo "[QUEST] Ensuring JSON DB files…"

if [ ! -f data/quests.json ]; then
  echo "[QUEST] Creating data/quests.json"
  cat > data/quests.json << 'JSON'
[]
JSON
else
  echo "[QUEST][SKIP] data/quests.json exists"
fi

if [ ! -f data/quest-progress.json ]; then
  echo "[QUEST] Creating data/quest-progress.json"
  cat > data/quest-progress.json << 'JSON'
[]
JSON
else
  echo "[QUEST][SKIP] data/quest-progress.json exists"
fi

if [ ! -f data/quest-rewards.json ]; then
  echo "[QUEST] Creating data/quest-rewards.json"
  cat > data/quest-rewards.json << 'JSON'
[]
JSON
else
  echo "[QUEST][SKIP] data/quest-rewards.json exists"
fi

# ----------------------------------------
# 2. ADMIN CONSOLE — QUEST PAGES
# ----------------------------------------
echo "[ADMIN] Creating quest admin pages…"

mkdir -p "$ADMIN_APP_DIR/quests"
mkdir -p "$ADMIN_APP_DIR/quests/[id]"

# /admin/quests (list)
if [ ! -f "$ADMIN_APP_DIR/quests/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/quests/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Quest = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

export default function QuestsAdminPage() {
  const questsPath = path.join(process.cwd(), "data", "quests.json");
  const raw = fs.readFileSync(questsPath, "utf8");
  const quests: Quest[] = JSON.parse(raw);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quests</h1>
        <Link
          href="/quests/create"
          className="px-3 py-1.5 text-sm rounded bg-emerald-600 text-white"
        >
          New Quest
        </Link>
      </div>

      {quests.length === 0 && (
        <p className="text-zinc-500 text-sm">No quests yet. Create one.</p>
      )}

      <div className="flex flex-col gap-2">
        {quests.map((q) => (
          <Link
            key={q.id}
            href={`/quests/${q.id}`}
            className="border border-zinc-700 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="font-semibold text-sm">{q.name}</div>
            {q.description && (
              <div className="text-xs text-zinc-500">{q.description}</div>
            )}
            <div className="text-[10px] text-zinc-600 mt-1">{q.id}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/quests/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/quests/page.tsx"
fi

# /admin/quests/create
mkdir -p "$ADMIN_APP_DIR/quests/create"
if [ ! -f "$ADMIN_APP_DIR/quests/create/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/quests/create/page.tsx" << 'EOF_TSX'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuestCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/quests/create", {
      method: "POST",
      body: JSON.stringify({ name, description }),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (json.ok) {
      router.push(`/quests/${json.quest.id}`);
    } else {
      alert("Failed to create quest");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Create Quest</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Name</label>
          <input
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Quest name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quest about?"
          />
        </div>
        <button
          type="submit"
          className="self-start px-3 py-1.5 bg-emerald-600 text-sm rounded text-white"
        >
          Create
        </button>
      </form>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/quests/create/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/quests/create/page.tsx"
fi

# /admin/quests/[id] — overview + steps + rewards + progress
if [ ! -f "$ADMIN_APP_DIR/quests/[id]/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/quests/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Quest = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

type Step = {
  id: string;
  questId: string;
  title: string;
  description?: string;
  type: string;
  rewardId?: string;
};

type Reward = {
  id: string;
  questId: string;
  type: string;
  amount?: number;
  metadata?: any;
};

type Progress = {
  id: string;
  questId: string;
  userId: string;
  completedSteps: string[];
  completedAt?: string;
};

function loadJson(file: string) {
  const p = path.join(process.cwd(), "data", file);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function QuestDetailAdminPage({ params }: { params: { id: string } }) {
  const quests: Quest[] = loadJson("quests.json");
  const steps: Step[] = loadJson("quest-steps.json");
  const rewards: Reward[] = loadJson("quest-rewards.json");
  const progress: Progress[] = loadJson("quest-progress.json");

  const quest = quests.find((q) => q.id === params.id);

  if (!quest) {
    return <div className="text-sm text-red-400">Quest not found.</div>;
  }

  const questSteps = steps.filter((s) => s.questId === quest.id);
  const questRewards = rewards.filter((r) => r.questId === quest.id);
  const questProgress = progress.filter((p) => p.questId === quest.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xs text-zinc-500 mb-1">
          <Link href="/quests" className="hover:underline">
            ← Back to quests
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">{quest.name}</h1>
        {quest.description && (
          <p className="text-sm text-zinc-400 mt-1">{quest.description}</p>
        )}
        {quest.createdAt && (
          <p className="text-xs text-zinc-500 mt-1">
            Created at: {quest.createdAt}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Steps</div>
          <div className="text-lg font-semibold">{questSteps.length}</div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Rewards</div>
          <div className="text-lg font-semibold">{questRewards.length}</div>
        </div>
        <div className="p-3 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Progress entries</div>
          <div className="text-lg font-semibold">{questProgress.length}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 border border-zinc-700 rounded">
          <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
            Steps
          </div>
          <div className="p-3 text-sm flex flex-col gap-2">
            {questSteps.length === 0 && (
              <div className="text-zinc-500 text-xs">
                No steps yet. Use API /api/quests/add-step (mock).
              </div>
            )}
            {questSteps.map((s) => (
              <div key={s.id} className="border border-zinc-700 rounded px-2 py-1.5">
                <div className="font-semibold text-xs">{s.title}</div>
                {s.description && (
                  <div className="text-[11px] text-zinc-500">
                    {s.description}
                  </div>
                )}
                <div className="text-[10px] text-zinc-600 mt-1">
                  type: {s.type} {s.rewardId ? `(reward: ${s.rewardId})` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1 border border-zinc-700 rounded">
          <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
            Rewards
          </div>
          <div className="p-3 text-sm flex flex-col gap-2">
            {questRewards.length === 0 && (
              <div className="text-zinc-500 text-xs">
                No rewards yet. Use API /api/quests/add-reward (mock).
              </div>
            )}
            {questRewards.map((r) => (
              <div key={r.id} className="border border-zinc-700 rounded px-2 py-1.5">
                <div className="font-semibold text-xs">{r.type}</div>
                {r.amount && (
                  <div className="text-[11px] text-zinc-500">
                    amount: {r.amount}
                  </div>
                )}
                {r.metadata && (
                  <div className="text-[11px] text-zinc-600">
                    {JSON.stringify(r.metadata)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1 border border-zinc-700 rounded">
          <div className="px-3 py-2 border-b border-zinc-700 text-sm font-semibold">
            Progress (mock)
          </div>
          <div className="p-3 text-sm flex flex-col gap-2">
            {questProgress.length === 0 && (
              <div className="text-zinc-500 text-xs">
                No progress yet. Strategy worker or clients can call
                /api/quests/progress and /api/quests/complete.
              </div>
            )}
            {questProgress.map((p) => (
              <div key={p.id} className="border border-zinc-700 rounded px-2 py-1.5">
                <div className="text-[11px] text-zinc-400">
                  user: {p.userId}
                </div>
                <div className="text-[11px] text-zinc-500">
                  steps: {p.completedSteps.join(", ")}
                </div>
                {p.completedAt && (
                  <div className="text-[10px] text-zinc-600 mt-1">
                    completed: {p.completedAt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
EOF_TSX
  echo "[ADMIN] Created: $ADMIN_APP_DIR/quests/[id]/page.tsx"
else
  echo "[ADMIN][SKIP] $ADMIN_APP_DIR/quests/[id]/page.tsx"
fi

# ----------------------------------------
# 3. Quest steps JSON file (separate)
# ----------------------------------------
if [ ! -f data/quest-steps.json ]; then
  echo "[QUEST] Creating data/quest-steps.json"
  cat > data/quest-steps.json << 'JSON'
[]
JSON
else
  echo "[QUEST][SKIP] data/quest-steps.json exists"
fi

# ----------------------------------------
# 4. API LAYER — CRUD + ENGINE
# ----------------------------------------
echo "[API] Creating quest API routes…"
mkdir -p "$ADMIN_APP_DIR/api/quests"

# helper TS module for file ops (if not exists)
mkdir -p "$ADMIN_APP_DIR/api/quests/utils"
if [ ! -f "$ADMIN_APP_DIR/api/quests/utils/fs-quests.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/utils/fs-quests.ts" << 'EOF_TS'
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
EOF_TS
  echo "[API] Created: fs-quests.ts"
else
  echo "[API][SKIP] fs-quests.ts"
fi

# /api/quests/create
mkdir -p "$ADMIN_APP_DIR/api/quests/create"
if [ ! -f "$ADMIN_APP_DIR/api/quests/create/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/create/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadQuests, saveQuests } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const quests = loadQuests();

  const id = "quest_" + Date.now().toString();
  const quest = {
    id,
    name: body.name,
    description: body.description || "",
    createdAt: new Date().toISOString()
  };

  quests.push(quest);
  saveQuests(quests);

  return NextResponse.json({ ok: true, quest });
}
EOF_TS
  echo "[API] Created: /api/quests/create"
else
  echo "[API][SKIP] /api/quests/create"
fi

# /api/quests/add-step
mkdir -p "$ADMIN_APP_DIR/api/quests/add-step"
if [ ! -f "$ADMIN_APP_DIR/api/quests/add-step/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/add-step/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadSteps, saveSteps } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const steps = loadSteps();

  const id = "step_" + Date.now().toString();

  const step = {
    id,
    questId: body.questId,
    title: body.title,
    description: body.description || "",
    type: body.type || "custom",
    rewardId: body.rewardId || null
  };

  steps.push(step);
  saveSteps(steps);

  return NextResponse.json({ ok: true, step });
}
EOF_TS
  echo "[API] Created: /api/quests/add-step"
else
  echo "[API][SKIP] /api/quests/add-step"
fi

# /api/quests/add-reward
mkdir -p "$ADMIN_APP_DIR/api/quests/add-reward"
if [ ! -f "$ADMIN_APP_DIR/api/quests/add-reward/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/add-reward/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadRewards, saveRewards } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const rewards = loadRewards();

  const id = "reward_" + Date.now().toString();

  const reward = {
    id,
    questId: body.questId,
    type: body.type || "xp",
    amount: body.amount || 0,
    metadata: body.metadata || null
  };

  rewards.push(reward);
  saveRewards(rewards);

  return NextResponse.json({ ok: true, reward });
}
EOF_TS
  echo "[API] Created: /api/quests/add-reward"
else
  echo "[API][SKIP] /api/quests/add-reward"
fi

# /api/quests/progress
mkdir -p "$ADMIN_APP_DIR/api/quests/progress"
if [ ! -f "$ADMIN_APP_DIR/api/quests/progress/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/progress/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadProgress, saveProgress } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const progress = loadProgress();

  const existing = progress.find(
    (p: any) => p.questId === body.questId && p.userId === body.userId
  );

  if (!existing) {
    const entry = {
      id: "progress_" + Date.now().toString(),
      questId: body.questId,
      userId: body.userId,
      completedSteps: body.completedSteps || [],
      completedAt: null
    };
    progress.push(entry);
  } else {
    existing.completedSteps = Array.from(
      new Set([...(existing.completedSteps || []), ...(body.completedSteps || [])])
    );
  }

  saveProgress(progress);
  return NextResponse.json({ ok: true });
}
EOF_TS
  echo "[API] Created: /api/quests/progress"
else
  echo "[API][SKIP] /api/quests/progress"
fi

# /api/quests/complete
mkdir -p "$ADMIN_APP_DIR/api/quests/complete"
if [ ! -f "$ADMIN_APP_DIR/api/quests/complete/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/complete/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadProgress, saveProgress } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const progress = loadProgress();

  const existing = progress.find(
    (p: any) => p.questId === body.questId && p.userId === body.userId
  );

  if (!existing) {
    return NextResponse.json({ ok: false, error: "No progress entry" }, { status: 400 });
  }

  existing.completedAt = new Date().toISOString();
  saveProgress(progress);

  return NextResponse.json({ ok: true, progress: existing });
}
EOF_TS
  echo "[API] Created: /api/quests/complete"
else
  echo "[API][SKIP] /api/quests/complete"
fi

# /api/quests/trigger — strategy/engine entrypoint
mkdir -p "$ADMIN_APP_DIR/api/quests/trigger"
if [ ! -f "$ADMIN_APP_DIR/api/quests/trigger/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/quests/trigger/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";
import { loadSteps, loadRewards } from "../utils/fs-quests";

export async function POST(req: Request) {
  const body = await req.json();
  const { questId, eventType, metadata } = body;

  const steps = loadSteps();
  const rewards = loadRewards();

  const matchingSteps = steps.filter(
    (s: any) => s.questId === questId && s.type === eventType
  );

  const triggeredRewards = matchingSteps
    .map((s: any) => rewards.find((r: any) => r.id === s.rewardId))
    .filter(Boolean);

  return NextResponse.json({
    ok: true,
    questId,
    eventType,
    stepsTriggered: matchingSteps.map((s: any) => s.id),
    rewards: triggeredRewards
  });
}
EOF_TS
  echo "[API] Created: /api/quests/trigger"
else
  echo "[API][SKIP] /api/quests/trigger"
fi

# ----------------------------------------
# 5. WEB QUEST VIEWER (mobile-friendly)
# ----------------------------------------
echo "[WEB] Creating public quest viewer pages…"

mkdir -p "$WEB_APP_DIR/quests"
mkdir -p "$WEB_APP_DIR/quests/[id]"

# /quests
if [ ! -f "$WEB_APP_DIR/quests/page.tsx" ]; then
  cat > "$WEB_APP_DIR/quests/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

type Quest = {
  id: string;
  name: string;
  description?: string;
};

export default function QuestsPage() {
  const questsPath = path.join(process.cwd(), "data", "quests.json");
  const raw = fs.readFileSync(questsPath, "utf8");
  const quests: Quest[] = JSON.parse(raw);

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">Quests</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Discover quests powered by CastQuest. (Mock viewer)
      </p>

      {quests.length === 0 && (
        <p className="text-sm text-zinc-500">No quests yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {quests.map((q) => (
          <Link
            key={q.id}
            href={`/quests/${q.id}`}
            className="border border-zinc-800 rounded px-3 py-2 hover:bg-zinc-900"
          >
            <div className="font-semibold text-sm">{q.name}</div>
            {q.description && (
              <div className="text-xs text-zinc-500 mt-1">
                {q.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
EOF_TSX
  echo "[WEB] Created: $WEB_APP_DIR/quests/page.tsx"
else
  echo "[WEB][SKIP] $WEB_APP_DIR/quests/page.tsx"
fi

# /quests/[id]
if [ ! -f "$WEB_APP_DIR/quests/[id]/page.tsx" ]; then
  cat > "$WEB_APP_DIR/quests/[id]/page.tsx" << 'EOF_TSX'
import fs from "node:fs";
import path from "node:path";

type Quest = {
  id: string;
  name: string;
  description?: string;
};

type Step = {
  id: string;
  questId: string;
  title: string;
  description?: string;
  type: string;
};

function loadJson(file: string) {
  const p = path.join(process.cwd(), "data", file);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  const quests: Quest[] = loadJson("quests.json");
  const steps: Step[] = loadJson("quest-steps.json");

  const quest = quests.find((q) => q.id === params.id);
  const questSteps = steps.filter((s) => s.questId === params.id);

  if (!quest) {
    return (
      <div className="px-4 py-4 max-w-xl mx-auto text-sm text-red-400">
        Quest not found.
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{quest.name}</h1>
      {quest.description && (
        <p className="text-sm text-zinc-400 mb-3">{quest.description}</p>
      )}
      <p className="text-xs text-zinc-500 mb-4">
        This is a mock quest viewer. Real user progress would connect to auth.
      </p>

      <div className="flex flex-col gap-2">
        {questSteps.length === 0 && (
          <div className="text-sm text-zinc-500">No steps yet.</div>
        )}
        {questSteps.map((s) => (
          <div
            key={s.id}
            className="border border-zinc-800 rounded px-3 py-2 text-sm flex flex-col gap-1"
          >
            <div className="font-semibold text-xs">{s.title}</div>
            {s.description && (
              <div className="text-[11px] text-zinc-500">
                {s.description}
              </div>
            )}
            <div className="text-[10px] text-zinc-600">
              type: {s.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF_TSX
  echo "[WEB] Created: $WEB_APP_DIR/quests/[id]/page.tsx"
else
  echo "[WEB][SKIP] $WEB_APP_DIR/quests/[id]/page.tsx"
fi

echo "[MODULE 5B — QUEST ENGINE MEGA] Complete."
