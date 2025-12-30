#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " MEGA WORKER CONSOLE — NEO SETUP"
echo "=============================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADMIN="$ROOT/apps/admin/app"

mkdir -p "$ADMIN/worker"
mkdir -p "$ADMIN/neo"

# Worker console placeholder
cat > "$ADMIN/worker/page.tsx" << 'EOF'
"use client";

export default function WorkerConsoleNEO() {
  return (
    <div className="p-6 text-neutral-200">
      <h1 className="text-xl font-bold text-purple-400">Worker Console NEO</h1>
      <p className="text-neutral-400 mt-2">
        Strategy Worker logs, events, and automation status will appear here.
      </p>
    </div>
  );
}
EOF

echo "[OK] Worker Console NEO scaffolded."
echo "=============================================================="