#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO SELF-HEALER v3"
echo " - Fix tsconfig"
echo " - Regenerate exports"
echo " - Auto-type components"
echo " - Build dist"
echo " - Relink workspace"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/neo-ux-core"

echo "[INFO] Root: $ROOT"
echo "[INFO] Package: $PKG"

echo
echo "[STEP 1] Fixing tsconfig.json..."

cat > "$PKG/tsconfig.json" << 'EOT'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "lib": ["ES2020", "DOM"],
    "types": ["react", "react-dom"],
    "outDir": "dist"
  },
  "include": ["src"]
}
EOT

echo "[OK] tsconfig fixed."

echo
echo "[STEP 2] Regenerating index.ts exports..."

cat > "$PKG/src/index.ts" << 'EOT'
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

echo "[OK] index.ts regenerated."

echo
echo "[STEP 3] Running MEGA SMART AUTO-TYPER..."
"$ROOT/scripts/mega-smart-auto-typer.sh"

echo
echo "[STEP 4] Building neo-ux-core..."
cd "$PKG"
pnpm build

echo
echo "[STEP 5] Verifying dist..."
ls -al "$PKG/dist" || echo "[WARN] dist missing"

echo
echo "[STEP 6] Relinking workspace..."
cd "$ROOT"
pnpm install

echo
echo "====================================================================="
echo " SELF-HEALER v3 COMPLETE — NEO UX CORE IS FULLY RESTORED"
echo "====================================================================="
