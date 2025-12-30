#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " CastQuest MEGA SELFHEAL — Full Protocol Spine Regenerator (Option B)"
echo "====================================================================="
echo

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Root directory: $ROOT_DIR"
echo

########################################
# 0. Helper: ensure executable & safe run
########################################

ensure_executable() {
  local file="$1"
  if [ -f "$file" ]; then
    chmod +x "$file" || true
    echo "  [OK] chmod +x $file"
  else
    echo "  [MISS] $file (not found)"
  fi
}

########################################
# 1. Verify repo structure
########################################

echo "==> Verifying repo structure..."

REQUIRED_DIRS=(
  "apps"
  "apps/admin"
  "apps/admin/app"
  "apps/web"
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
  echo "!! Some required directories are missing — continuing, but repo may be incomplete."
else
  echo "==> Repo structure looks consistent."
fi
echo

########################################
# 2. Re-run MEGA module scripts (4, 5B, 7, 8) if present
########################################

echo "==> Self-healing module MEGAs (4, 5B, 7, 8)..."

MODULE_SCRIPTS=(
  "scripts/module-4-mega.sh"
  "scripts/module-5-quests-mega.sh"
  "scripts/module-7-mega-engine.sh"
  "scripts/module-8-brain-mega.sh"
)

for f in "${MODULE_SCRIPTS[@]}"; do
  if [ -f "$f" ]; then
    ensure_executable "$f"
    echo "[RUN] $f"
    ./"$f" || echo "[WARN] $f exited with non-zero status."
  else
    echo "[SKIP] $f not found — module script missing."
  fi
done

echo "==> Module MEGAs pass complete."
echo

########################################
# 3. Overwrite ShellLayout.tsx (operator-grade)
########################################

echo "==> Overwriting apps/admin/app/ShellLayout.tsx (operator-grade layout)..."

mkdir -p "apps/admin/app"

cat > "apps/admin/app/ShellLayout.tsx" << 'EOF'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  ImageIcon,
  Layers,
  Boxes,
  Workflow,
  ChevronDown,
  ChevronRight,
  FileJson,
  Settings,
} from "lucide-react";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [openModules, setOpenModules] = useState(true);
  const [openData, setOpenData] = useState(false);

  const NavItem = ({
    href,
    label,
    icon: Icon,
    description,
  }: {
    href: string;
    label: string;
    icon: any;
    description?: string;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
          ${active ? "bg-emerald-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}
        `}
      >
        <Icon size={18} />
        <div className="flex flex-col leading-tight">
          <span className="font-medium">{label}</span>
          {description && (
            <span className="text-xs text-neutral-400">{description}</span>
          )}
        </div>
      </Link>
    );
  };

  const SectionHeader = ({
    title,
    open,
    setOpen,
  }: {
    title: string;
    open: boolean;
    setOpen: (v: boolean) => void;
  }) => (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-neutral-200"
    >
      <span className="text-xs font-semibold tracking-wide">{title}</span>
      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );

  const Badge = ({ label, color }: { label: string; color: string }) => (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide ${color}`}
    >
      {label}
    </span>
  );

  return (
    <div className="flex h-screen bg-black text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <LayoutDashboard size={20} />
            CastQuest Admin
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Sovereign Operator Console
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-2">

          {/* Core Navigation */}
          <div className="px-3">
            <NavItem
              href="/"
              label="Dashboard"
              icon={LayoutDashboard}
              description="Overview & system status"
            />
          </div>

          {/* Module Section */}
          <div>
            <SectionHeader
              title="MODULES"
              open={openModules}
              setOpen={setOpenModules}
            />
            {openModules && (
              <div className="space-y-1 pl-3">
                <NavItem
                  href="/media"
                  label="Media"
                  icon={ImageIcon}
                  description="Uploads & assets"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M6" color="bg-blue-700 text-white" />
                </div>

                <NavItem
                  href="/templates"
                  label="Templates"
                  icon={Layers}
                  description="Frame templates"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M6" color="bg-blue-700 text-white" />
                </div>

                <NavItem
                  href="/frames"
                  label="Frames"
                  icon={Boxes}
                  description="Generated frames"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7B" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/mints"
                  label="Mints"
                  icon={Workflow}
                  description="Mint actions & logs"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7A" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/quests"
                  label="Quests"
                  icon={FileJson}
                  description="Quest engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M5B" color="bg-amber-700 text-white" />
                </div>

                <NavItem
                  href="/worker"
                  label="Strategy Worker"
                  icon={Settings}
                  description="Automation engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M7C" color="bg-purple-700 text-white" />
                </div>

                <NavItem
                  href="/brain"
                  label="Brain"
                  icon={Brain}
                  description="Smart Brain runtime engine"
                />
                <div className="flex items-center gap-2 pl-3">
                  <Badge label="M8" color="bg-emerald-700 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Data Section */}
          <div>
            <SectionHeader
              title="DATA SURFACES"
              open={openData}
              setOpen={setOpenData}
            />
            {openData && (
              <div className="space-y-1 pl-3">
                <NavItem
                  href="/data/media"
                  label="media.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/frames"
                  label="frames.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/mints"
                  label="mints.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/quests"
                  label="quests.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/worker-events"
                  label="worker-events.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/brain-events"
                  label="brain-events.json"
                  icon={FileJson}
                />
                <NavItem
                  href="/data/brain-suggestions"
                  label="brain-suggestions.json"
                  icon={FileJson}
                />
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-500">
          CastQuest Protocol • Operator Mode
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
EOF

echo "  [OK] apps/admin/app/ShellLayout.tsx overwritten."
echo

########################################
# 4. Overwrite Dashboard page
########################################

echo "==> Overwriting apps/admin/app/page.tsx (Dashboard with health, worker, brain)..."

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
          subtitle="Dashboard is a high-level view only"
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

echo "  [OK] apps/admin/app/page.tsx overwritten."
echo

########################################
# 5. Overwrite docs/index.md
########################################

echo "==> Overwriting docs/index.md..."

mkdir -p "docs"

cat > "docs/index.md" << 'EOF'
# CastQuest Documentation

Welcome to the CastQuest protocol docs. This space describes how media, frames, mints, quests, the Strategy Worker, and the Smart Brain Runtime Engine work together.

## Navigation

- [Architecture](./architecture.md)
- [Smart Brain](./sdk/smart-brain.md)
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

echo "  [OK] docs/index.md overwritten."
echo

########################################
# 6. Overwrite docs/README.md
########################################

echo "==> Overwriting docs/README.md..."

cat > "docs/README.md" << 'EOF'
# CastQuest Docs Overview

This folder contains the core documentation for the CastQuest Protocol.

## Key Files

- **architecture.md** — High-level protocol flow, module pipeline, interaction graph.
- **sdk/smart-brain.md** — Smart Brain Runtime Engine, frame schema, SDK usage.
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

echo "  [OK] docs/README.md overwritten."
echo

########################################
# 7. Overwrite docs/CONTRIBUTING.md
########################################

echo "==> Overwriting docs/CONTRIBUTING.md..."

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
   - [Smart Brain](./sdk/smart-brain.md)

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
   - Document new endpoints, files, or behaviors in `sdk/smart-brain.md` or `modules.md`.
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

echo "  [OK] docs/CONTRIBUTING.md overwritten."
echo

########################################
# 8. Summary
########################################

echo "====================================================================="
echo " MEGA SELFHEAL COMPLETE"
echo "====================================================================="
echo "Overwritten / regenerated:"
echo "  - apps/admin/app/ShellLayout.tsx"
echo "  - apps/admin/app/page.tsx"
echo "  - docs/index.md"
echo "  - docs/README.md"
echo "  - docs/CONTRIBUTING.md"
echo
echo "Re-ran (if present):"
echo "  - scripts/module-4-mega.sh"
echo "  - scripts/module-5-quests-mega.sh"
echo "  - scripts/module-7-mega-engine.sh"
echo "  - scripts/module-8-brain-mega.sh"
echo
echo "Next steps:"
echo "  git status"
echo "  git add apps/admin/app/ShellLayout.tsx apps/admin/app/page.tsx docs/index.md docs/README.md docs/CONTRIBUTING.md"
echo "  git commit -m \"CastQuest MEGA Selfheal — layout, dashboard, docs, modules\""
echo "  git push origin master"
echo
EOF