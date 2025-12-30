#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " MEGA WEB LAYOUT — NEO GLOW SETUP"
echo "=============================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB="$ROOT/apps/web/app"

echo "[INFO] Web app path: $WEB"

mkdir -p "$WEB/neo"
mkdir -p "$WEB/components"

# Create NEO Glow theme
cat > "$WEB/neo/theme.ts" << 'EOF'
export const neo = {
  glow: {
    active: "shadow-[0_0_12px_rgba(16,185,129,0.8)]",
    idle: "shadow-[0_0_6px_rgba(255,255,255,0.15)]",
    error: "shadow-[0_0_12px_rgba(239,68,68,0.8)]"
  },
  colors: {
    primary: "text-emerald-400",
    dim: "text-neutral-500",
    bg: "bg-neutral-950",
    border: "border-neutral-800"
  }
};
EOF

# Create placeholder NEO Glow layout
cat > "$WEB/components/WebLayoutNEO.tsx" << 'EOF'
"use client";
import { neo } from "../neo/theme";

export default function WebLayoutNEO({ children }) {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <header className="p-4 border-b border-neutral-800">
        <h1 className="text-lg font-semibold text-emerald-400">
          CastQuest Web • NEO GLOW
        </h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
EOF

echo "[OK] Web NEO GLOW layout scaffolded."
echo "=============================================================="