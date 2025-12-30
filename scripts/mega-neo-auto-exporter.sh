#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO AUTO-EXPORTER + BUILDER"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG_DIR="$ROOT/packages/neo-ux-core"
INDEX_FILE="$PKG_DIR/src/index.ts"

echo "[INFO] Repo root: $ROOT"
echo "[INFO] Package dir: $PKG_DIR"
echo "[INFO] Index file: $INDEX_FILE"

if [ ! -d "$PKG_DIR" ]; then
  echo "[ERROR] neo-ux-core package directory not found at $PKG_DIR"
  exit 1
fi

echo
echo "[STEP 1] Regenerating src/index.ts exports..."

cat > "$INDEX_FILE" << 'EOT'
export * from "./theme";

// Core glow components
export * from "./components/GlowBadge";
export * from "./components/GlowButton";
export * from "./components/GlowCard";
export * from "./components/GlowDivider";
export * from "./components/GlowPanel";

// Dashboard
export * from "./dashboard/DashboardWidgets";

// Brain
export * from "./brain/BrainActivityGraph";

// Worker
export * from "./worker/WorkerTimeline";
EOT

echo "[OK] src/index.ts regenerated."

echo
echo "[STEP 2] Building neo-ux-core package..."

cd "$PKG_DIR"
pnpm build

echo
echo "[STEP 3] neo-ux-core build complete. Dist contents:"
ls -al "$PKG_DIR/dist" || echo "[WARN] dist directory missing after build."

echo
echo "====================================================================="
echo " SMART MEGA NEO AUTO-EXPORTER + BUILDER COMPLETE"
echo "====================================================================="
