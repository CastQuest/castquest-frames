#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> CastQuest Admin + Docs MEGA"
echo "Root: $ROOT_DIR"
echo

########################################
# 1. Verify repo structure
########################################

echo "==> Verifying repo structure..."

REQUIRED_DIRS=(
  "apps"
  "apps/admin"
  "apps/web"
  "apps/admin/app"
  "packages"
  "data"
  "docs"
  "scripts"
)

MISSING=0
for d in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$d" ]; then
    echo "  [OK]   $d"
  else
    echo "  [MISS] $d"
    MISSING=1
  fi
done

if [ "$MISSING" -ne 0 ]; then
  echo "!! Some required directories are missing. Check structure before continuing."
else
  echo "==> Repo structure looks good."
fi

echo

########################################
# 2. Verify admin UI scaffolding
########################################

echo "==> Verifying admin UI scaffolding..."

ADMIN_FILES=(
  "apps/admin/app/ShellLayout.tsx"
  "apps/admin/app/brain/page.tsx"
  "apps/admin/app/api/brain/generate-frame/route.ts"
  "apps/admin/app/api/brain/validate-frame/route.ts"
  "apps/admin/app/api/brain/strategy-insights/route.ts"
)

ADMIN_MISS=0
for f in "${ADMIN_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "  [OK]   $f"
  else
    echo "  [MISS] $f"
    ADMIN_MISS=1
  fi
done

if [ "$ADMIN_MISS" -ne 0 ]; then
  echo "!! Some admin / brain files are missing. This script will still continue, but UI may not load cleanly."
else
  echo "==> Admin UI base files detected."
fi

echo

########################################
# 3. Generate Dashboard page (with panels)
########################################

echo "==> Generating admin Dashboard page (/, with System Health, Worker Monitor, Brain Activity feed)..."

mkdir -p "apps/admin/app"

cat > "apps/admin/app/page.tsx" << 'EOF'
"use client";

import Link from "next/link";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border border-neutral-800 rounded-lg p-4 bg-black/40 space-y-2">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
      </header>
      {children && <div className="pt-1">{children}</div>}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Operator Dashboard</h1>
        <p className="text-sm text-neutral-500">
          High-level view of CastQuest protocol health, worker status, and Smart Brain activity.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {/* System Health Panel */}
        <Card
          title="System Health"
          subtitle="Core surfaces & modules"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Admin: <span className="text-emerald-400">reachable</span> (UI loaded)</li>
            <li>• Strategy Worker: <span className="text-amber-400">manual trigger</span></li>
            <li>• Smart Brain: <span className="text-sky-400">API available</span></li>
            <li>• Data JSON: <span className="text-emerald-400">file-based</span></li>
          </ul>
        </Card>

        {/* Worker Monitor */}
        <Card
          title="Worker Monitor"
          subtitle="Strategy runs & automation"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Last run: <span className="text-neutral-400">n/a (mock)</span></li>
            <li>• Suggested action: trigger <code>/api/strategy/worker/run</code></li>
          </ul>
          <div className="pt-2">
            <Link
              href="/worker"
              className="inline-flex items-center px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
            >
              Open Worker Console
            </Link>
          </div>
        </Card>

        {/* Brain Activity Feed */}
        <Card
          title="Brain Activity"
          subtitle="Smart Brain decisions"
        >
          <ul className="text-xs space-y-1 text-neutral-300">
            <li>• Recent events: check <code>brain-events.json</code></li>
            <li>• Suggestions: check <code>brain-suggestions.json</code></li>
          </ul>
          <div className="pt-2">
            <Link
              href="/brain"
              className="inline-flex items-center px-2 py-1 text-xs rounded bg-purple-600 hover:bg-purple-500"
            >
              Open Brain Console
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Quick Links"
          subtitle="Jump to protocol surfaces"
        >
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/media"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Media
            </Link>
            <Link
              href="/templates"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Templates
            </Link>
            <Link
              href="/frames"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Frames
            </Link>
            <Link
              href="/mints"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Mints
            </Link>
            <Link
              href="/quests"
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            >
              Quests
            </Link>
          </div>
        </Card>

        <Card
          title="Operator Notes"
          subtitle="This dashboard is a high-level view only"
        >
          <p className="text-xs text-neutral-400">
            System health, worker status, and Brain activity are read from file-based state and
            mock endpoints. For real-time behavior, wire Strategy Worker and Brain APIs into
            your automation scripts and onchain surfaces.
          </p>
        </Card>
      </div>
    </div>
  );
}
EOF

echo "  [OK] apps/admin/app/page.tsx created/updated."
echo

########################################
# 4. Generate docs/index.md
########################################

echo "==> Generating docs/index.md (docs homepage)..."

mkdir -p "docs"

cat > "docs/index.md" << 'EOF'
# CastQuest Documentation

Welcome to the CastQuest protocol docs. This space describes how media, frames, mints, quests, the Strategy Worker, and the Smart Brain Runtime Engine work together.

## Navigation

- [Architecture](./architecture.md)
- [Smart Brain](./smart-brain.md)
- [Modules](./modules.md)
- [Flows](./flows.md)
- [Contributor Cards](./contributor-cards.md)
- [Contributing](./CONTRIBUTING.md)

## What is CastQuest?

CastQuest is a sovereign, media-first protocol that turns:

**Media → Templates → Frames → Render → Mints → Quests → Strategy → Onchain**

into an operator-controlled automation spine.

Use these docs to understand the pipeline, extend the protocol, and build new automation and onchain behaviors.
EOF

echo "  [OK] docs/index.md created/updated."
echo

########################################
# 5. Generate docs/README.md
########################################

echo "==> Generating docs/README.md (docs navigation overview)..."

cat > "docs/README.md" << 'EOF'
# CastQuest Docs Overview

This folder contains the core documentation for the CastQuest Protocol.

## Key Files

- **architecture.md** — High-level protocol flow, module pipeline, interaction graph.
- **smart-brain.md** — Smart Brain Runtime Engine, frame schema, SDK usage.
- **modules.md** — Per-module breakdown (M4, M5B, M6, M7, M8).
- **flows.md** — End-to-end flows through the protocol.
- **contributor-cards.md** — Recognition and context for contributors.
- **index.md** — Docs homepage and navigation.
- **CONTRIBUTING.md** — How to contribute to CastQuest.

## Audience

These docs are written for:

- Operators running the protocol
- Developers extending modules and flows
- Designers shaping templates and frames
- Strategy authors building automation

Treat this folder as a protocol artifact, not an afterthought.
EOF

echo "  [OK] docs/README.md created/updated."
echo

########################################
# 6. Generate docs/CONTRIBUTING.md
########################################

echo "==> Generating docs/CONTRIBUTING.md..."

cat > "docs/CONTRIBUTING.md" << 'EOF'
# Contributing to CastQuest

Thank you for your interest in contributing to the CastQuest Protocol.

## Principles

- **Sovereignty first** — Operators must be able to run and inspect everything locally.
- **Transparency** — JSON data surfaces, clear logs, explicit flows.
- **Modularity** — Each module (M4, M5B, M6, M7, M8) should be self-contained and script-installable.
- **Expressiveness** — Media, frames, and quests should remain visually and conceptually rich.

## How to Contribute

1. **Explore the architecture**

   Start with:

   - [Architecture](./architecture.md)
   - [Modules](./modules.md)
   - [Smart Brain](./smart-brain.md)

2. **Pick a surface**

   Common areas to work on:

   - New frame templates
   - Quest definitions and flows
   - Strategy Worker behaviors
   - Smart Brain suggestions and validation

3. **Make your changes**

   - Keep logic small and composable.
   - Log meaningful events to JSON files (e.g. `worker-events.json`, `brain-events.json`).
   - Avoid hidden magic; favor explicit flows and files.

4. **Add or update docs**

   - Update or create diagrams in `architecture.md` or `flows.md` as needed.
   - Document new endpoints, files, or behaviors in `smart-brain.md` or `modules.md`.
   - If you add an operator surface, mention it in `docs/index.md`.

5. **Open a pull request**

   - Describe what you changed and why.
   - Include screenshots or snippets where helpful.
   - Call out any new JSON files, endpoints, or CLI scripts.

## Code Style

- Prefer explicit over clever.
- Keep API handlers small and testable.
- Use consistent naming for data files and endpoints.

## Recognition

CastQuest treats documentation, strategy, and design as first-class contributions.  
If you add something meaningful, add yourself to `contributor-cards.md` with a short, clear description of your impact.
EOF

echo "  [OK] docs/CONTRIBUTING.md created/updated."
echo

########################################
# 7. Summary
########################################

echo "==> MEGA script completed."
echo "Generated / updated:"
echo "  - apps/admin/app/page.tsx (Dashboard + System Health + Worker Monitor + Brain Activity)"
echo "  - docs/index.md"
echo "  - docs/README.md"
echo "  - docs/CONTRIBUTING.md"
echo
echo "Next:"
echo "  git add apps/admin/app/page.tsx docs/index.md docs/README.md docs/CONTRIBUTING.md"
echo "  git commit -m \"Admin Dashboard + docs MEGA (dashboard, health, worker, brain, docs index/README/CONTRIBUTING)\""
echo "  git push origin master"
