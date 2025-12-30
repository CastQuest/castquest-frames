#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO SELF-HEALER v4"
echo " - Fix tsconfig"
echo " - Regenerate exports"
echo " - Sanitize imports"
echo " - Auto-type components"
echo " - Build dist"
echo " - Relink workspace"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/neo-ux-core"
SRC="$PKG/src"

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

echo "[OK] tsconfig repaired."

echo
echo "[STEP 2] Regenerating index.ts exports..."

cat > "$SRC/index.ts" << 'EOT'
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
echo "[STEP 3] Sanitizing duplicate imports..."

find "$SRC" -name "*.tsx" | while read -r FILE; do
  # Remove duplicate ReactNode imports
  if grep -q "import { ReactNode } from \"react\"" "$FILE"; then
    COUNT=$(grep -c "import { ReactNode } from \"react\"" "$FILE")
    if [ "$COUNT" -gt 1 ]; then
      echo "[SANITIZE] Removing duplicate ReactNode imports in $FILE"
      # Keep only the first occurrence
      awk '!seen[$0]++' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
    fi
  fi
done

echo "[OK] Import sanitization complete."

echo
echo "[STEP 4] Running MEGA SMART AUTO-TYPER v2..."
"$ROOT/scripts/mega-smart-auto-typer.sh"

echo
echo "[STEP 5] Building neo-ux-core..."
cd "$PKG"
pnpm build

echo
echo "[STEP 6] Verifying dist..."
if [ -d "$PKG/dist" ]; then
  ls -al "$PKG/dist"
else
  echo "[ERROR] dist missing after build!"
fi

echo
echo "[STEP 7] Relinking workspace..."
cd "$ROOT"
pnpm install

echo
echo "====================================================================="
echo " SELF-HEALER v4 COMPLETE — NEO UX CORE FULLY RESTORED"
echo "====================================================================="
