#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " MEGA BRAIN CONSOLE — NEO SETUP"
echo "=============================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADMIN="$ROOT/apps/admin/app"

mkdir -p "$ADMIN/brain"
mkdir -p "$ADMIN/neo"

# Brain console placeholder
cat > "$ADMIN/brain/page.tsx" << 'EOF'
"use client";

export default function BrainConsoleNEO() {
  return (
    <div className="p-6 text-neutral-200">
      <h1 className="text-xl font-bold text-emerald-400">Brain Console NEO</h1>
      <p className="text-neutral-400 mt-2">
        Smart Brain runtime activity, suggestions, and event streams will appear here.
      </p>
    </div>
  );
}
EOF

echo "[OK] Brain Console NEO scaffolded."
echo "=============================================================="