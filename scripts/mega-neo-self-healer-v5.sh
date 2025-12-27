#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
RESET="\033[0m"

banner() {
  echo -e "${CYAN}=====================================================================${RESET}"
  echo -e "${CYAN} $1${RESET}"
  echo -e "${CYAN}=====================================================================${RESET}"
}

step() {
  echo
  echo -e "${YELLOW}[STEP]${RESET} $1"
}

ok() {
  echo -e "${GREEN}[OK]${RESET} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${RESET} $1"
}

err() {
  echo -e "${RED}[ERROR]${RESET} $1"
}

banner "SMART MEGA NEO SELF-HEALER v5
 - Glow-reactive CLI
 - Integrity scanner
 - Tsconfig repair
 - Export regeneration
 - Auto-typing
 - Dist rebuild
 - Workspace relink"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/neo-ux-core"
SRC="$PKG/src"

echo "[INFO] Root:   $ROOT"
echo "[INFO] Package:$PKG"

if [ ! -d "$PKG" ]; then
  err "neo-ux-core package directory not found at $PKG"
  exit 1
fi

step "Repairing tsconfig.json for neo-ux-core..."

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

ok "tsconfig.json repaired."

step "Regenerating index.ts exports..."

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

ok "index.ts regenerated."

step "Sanitizing duplicate React imports..."

find "$SRC" -name "*.tsx" | while read -r FILE; do
  if grep -q 'import { ReactNode } from "react"' "$FILE"; then
    COUNT=$(grep -c 'import { ReactNode } from "react"' "$FILE")
    if [ "$COUNT" -gt 1 ]; then
      warn "Removing duplicate ReactNode imports in $FILE"
      awk '!seen[$0]++' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
    fi
  fi
done

ok "Import sanitization complete."

step "Running MEGA SMART AUTO-TYPER v2 (strict props)..."

if [ ! -x "$ROOT/scripts/mega-smart-auto-typer.sh" ]; then
  warn "AUTO-TYPER v2 not found or not executable. Installing minimal v2..."

  cat > "$ROOT/scripts/mega-smart-auto-typer.sh" << 'EOT'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/neo-ux-core/src"

TARGET_DIRS=(
  "$PKG/components"
  "$PKG/dashboard"
  "$PKG/brain"
  "$PKG/worker"
)

for DIR in "${TARGET_DIRS[@]}"; do
  [ -d "$DIR" ] || continue

  for FILE in "$DIR"/*.tsx; do
    [ -f "$FILE" ] || continue

    if grep -q "interface .*Props" "$FILE"; then
      continue
    fi

    if ! grep -q "{ children" "$FILE"; then
      continue
    fi

    echo "[PATCH] $FILE"

    if ! grep -q "ReactNode" "$FILE"; then
      sed -i '1i import { ReactNode } from "react";' "$FILE"
    fi

    sed -i 's/export function \([A-Za-z0-9_]*\)({ children })/interface \1Props { children: ReactNode; }\nexport function \1({ children }: \1Props)/' "$FILE"

    sed -i 's/export function \([A-Za-z0-9_]*\)({ children, \.\.\.props })/import { ButtonHTMLAttributes } from "react";\ninterface \1Props extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; }\nexport function \1({ children, ...props }: \1Props)/' "$FILE"
  done
done
EOT

  chmod +x "$ROOT/scripts/mega-smart-auto-typer.sh"
fi

"$ROOT/scripts/mega-smart-auto-typer.sh"

ok "AUTO-TYPER v2 completed."

step "Integrity scan: theme + exports + structure..."

MISSING=0

if [ ! -f "$SRC/theme.ts" ]; then
  err "theme.ts missing in src/"
  MISSING=1
fi

for COMPONENT in GlowBadge GlowButton GlowCard GlowDivider GlowPanel; do
  if [ ! -f "$SRC/components/$COMPONENT.tsx" ]; then
    warn "Component missing: src/components/$COMPONENT.tsx"
    MISSING=1
  fi
done

for MOD in DashboardWidgets BrainActivityGraph WorkerTimeline; do
  if ! grep -q "$MOD" "$SRC/index.ts"; then
    warn "Export missing in index.ts for: $MOD"
    MISSING=1
  fi
done

if [ "$MISSING" -eq 0 ]; then
  ok "Integrity scan passed."
else
  warn "Integrity scan found issues. Core still healable, but review warnings above."
fi

step "Building neo-ux-core..."

cd "$PKG"
if ! pnpm build; then
  err "Build failed. Check TypeScript errors above."
  exit 1
fi

ok "Build succeeded."

step "Verifying dist structure..."

if [ -d "$PKG/dist" ]; then
  ls -al "$PKG/dist"
  ok "dist directory present."
else
  err "dist missing after build!"
  exit 1
fi

step "Relinking workspace (pnpm install)..."

cd "$ROOT"
pnpm install

ok "Workspace relinked."

banner "SELF-HEALER v5 COMPLETE — NEO UX CORE LOCKED, GLOWING, AND SOVEREIGN"
