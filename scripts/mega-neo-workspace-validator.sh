#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO WORKSPACE VALIDATOR"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[INFO] Repo root: $ROOT"

# ---------------------------------------------------------
# 1. Validate package folder exists
# ---------------------------------------------------------
PKG_DIR="$ROOT/packages/neo-ux-core"
echo
echo "[CHECK] Package directory: $PKG_DIR"

if [ -d "$PKG_DIR" ]; then
  echo "[OK] neo-ux-core package directory exists."
else
  echo "[ERROR] neo-ux-core package directory is missing!"
  echo "        Run: ./scripts/mega-neo-glow-core-pack.sh"
  exit 1
fi

# ---------------------------------------------------------
# 2. Validate package.json exists and name is correct
# ---------------------------------------------------------
PKG_JSON="$PKG_DIR/package.json"
echo
echo "[CHECK] package.json exists and has correct name"

if [ ! -f "$PKG_JSON" ]; then
  echo "[ERROR] package.json missing in neo-ux-core!"
  exit 1
fi

if grep -q '"name": "@castquest/neo-ux-core"' "$PKG_JSON"; then
  echo "[OK] package.json name is correct."
else
  echo "[ERROR] package.json name is incorrect!"
  echo "Fixing automatically..."
  sed -i 's/"name":.*/"name": "@castquest\/neo-ux-core",/' "$PKG_JSON"
  echo "[FIXED] package.json name corrected."
fi

# ---------------------------------------------------------
# 3. Validate tsconfig.json exists
# ---------------------------------------------------------
echo
echo "[CHECK] tsconfig.json exists"

if [ -f "$PKG_DIR/tsconfig.json" ]; then
  echo "[OK] tsconfig.json found."
else
  echo "[ERROR] tsconfig.json missing!"
  exit 1
fi

# ---------------------------------------------------------
# 4. Validate src folder exists
# ---------------------------------------------------------
echo
echo "[CHECK] src folder exists"

if [ -d "$PKG_DIR/src" ]; then
  echo "[OK] src folder exists."
else
  echo "[ERROR] src folder missing!"
  exit 1
fi

# ---------------------------------------------------------
# 5. Validate index.ts exists
# ---------------------------------------------------------
echo
echo "[CHECK] index.ts exists"

if [ -f "$PKG_DIR/src/index.ts" ]; then
  echo "[OK] index.ts found."
else
  echo "[ERROR] index.ts missing!"
  exit 1
fi

# ---------------------------------------------------------
# 6. Validate pnpm workspace linking
# ---------------------------------------------------------
echo
echo "[CHECK] pnpm workspace linking"

if pnpm list -w | grep -q "@castquest/neo-ux-core"; then
  echo "[OK] neo-ux-core is linked in workspace."
else
  echo "[ERROR] neo-ux-core NOT linked!"
  echo "Running pnpm install to link..."
  pnpm install
  echo "[FIXED] Workspace linked."
fi

# ---------------------------------------------------------
# 7. Validate import resolvability
# ---------------------------------------------------------
echo
echo "[CHECK] Import resolvability"

if node -e "require.resolve('@castquest/neo-ux-core')" >/dev/null 2>&1; then
  echo "[OK] Import '@castquest/neo-ux-core' resolves correctly."
else
  echo "[ERROR] Import '@castquest/neo-ux-core' does NOT resolve!"
  echo "Try running: pnpm install"
  exit 1
fi

# ---------------------------------------------------------
# 8. Validate admin layout wiring
# ---------------------------------------------------------
echo
echo "[CHECK] Admin layout wiring"

ADMIN_LAYOUT="$ROOT/apps/admin/app/layout.tsx"

if grep -q '@castquest/neo-ux-core' "$ADMIN_LAYOUT"; then
  echo "[OK] Admin layout imports neo-ux-core."
else
  echo "[WARN] Admin layout NOT wired to neo-ux-core."
fi

# ---------------------------------------------------------
# 9. Validate web layout wiring
# ---------------------------------------------------------
echo
echo "[CHECK] Web layout wiring"

WEB_LAYOUT="$ROOT/apps/web/app/layout.tsx"

if grep -q '@castquest/neo-ux-core' "$WEB_LAYOUT"; then
  echo "[OK] Web layout imports neo-ux-core."
else
  echo "[WARN] Web layout NOT wired to neo-ux-core."
fi

# ---------------------------------------------------------
# 10. Validate zombie Next.js processes
# ---------------------------------------------------------
echo
echo "[CHECK] Zombie Next.js processes"

if pgrep -f next >/dev/null 2>&1; then
  echo "[WARN] Zombie Next.js processes detected:"
  pgrep -fl next
else
  echo "[OK] No zombie Next.js processes."
fi

# ---------------------------------------------------------
# 11. Validate port conflicts
# ---------------------------------------------------------
echo
echo "[CHECK] Port conflicts"

for p in 3000 3001 3002 3003 3010 3011 3012; do
  if lsof -i ":$p" >/dev/null 2>&1; then
    echo "[WARN] Port $p is in use."
  else
    echo "[OK] Port $p is free."
  fi
done

echo
echo "====================================================================="
echo " SMART MEGA NEO WORKSPACE VALIDATION COMPLETE"
echo "====================================================================="
