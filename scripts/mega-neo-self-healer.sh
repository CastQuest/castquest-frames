#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO SELF-HEALER"
echo " - Validator"
echo " - Fixer"
echo " - Package Rebuilder"
echo " - Dev Launcher v2"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[INFO] Repo root: $ROOT"

PKG_DIR="$ROOT/packages/neo-ux-core"
PKG_JSON="$PKG_DIR/package.json"
ADMIN_APP="$ROOT/apps/admin/app"
WEB_APP="$ROOT/apps/web/app"

# ---------------------------------------------------------
# STEP 1: Kill zombie Next.js / ports (auto-port killer)
# ---------------------------------------------------------
echo
echo "[STEP 1] Killing zombie Next.js processes and freeing ports..."

pkill -f next || true
pkill -f "node .*next" || true

for p in 3000 3001 3002 3003 3010 3011 3012; do
  if lsof -i ":$p" >/dev/null 2>&1; then
    pid=$(lsof -t -i ":$p")
    echo "[KILL] Port $p (PID $pid)"
    kill -9 "$pid" || true
  else
    echo "[FREE] Port $p"
  fi
done

# ---------------------------------------------------------
# STEP 2: Validate + auto-rebuild neo-ux-core package
# ---------------------------------------------------------
echo
echo "[STEP 2] Validating neo-ux-core package..."

if [ ! -d "$PKG_DIR" ] || [ ! -f "$PKG_JSON" ]; then
  echo "[WARN] neo-ux-core package missing or incomplete. Rebuilding via mega-neo-glow-core-pack.sh..."
  if [ -x "$ROOT/scripts/mega-neo-glow-core-pack.sh" ]; then
    "$ROOT/scripts/mega-neo-glow-core-pack.sh"
  else
    echo "[ERROR] scripts/mega-neo-glow-core-pack.sh not found or not executable."
    exit 1
  fi
else
  echo "[OK] neo-ux-core package directory exists."
fi

# Ensure package.json name is correct
if grep -q '"name": "@castquest/neo-ux-core"' "$PKG_JSON" 2>/dev/null; then
  echo "[OK] package.json name already correct."
else
  echo "[FIX] Correcting package.json name to @castquest/neo-ux-core..."
  sed -i 's/"name":.*/"name": "@castquest\/neo-ux-core",/' "$PKG_JSON"
fi

# Ensure tsconfig exists
if [ -f "$PKG_DIR/tsconfig.json" ]; then
  echo "[OK] tsconfig.json found."
else
  echo "[ERROR] tsconfig.json missing in neo-ux-core. Re-run core pack script manually."
  exit 1
fi

# Ensure src/index.ts exists
if [ -f "$PKG_DIR/src/index.ts" ]; then
  echo "[OK] src/index.ts found."
else
  echo "[ERROR] src/index.ts missing in neo-ux-core. Re-run core pack script manually."
  exit 1
fi

# ---------------------------------------------------------
# STEP 3: Ensure workspace linking (pnpm install)
# ---------------------------------------------------------
echo
echo "[STEP 3] Ensuring pnpm workspace linking..."

if pnpm list -w | grep -q "@castquest/neo-ux-core"; then
  echo "[OK] neo-ux-core already linked in workspace."
else
  echo "[FIX] neo-ux-core not linked. Running pnpm install..."
  pnpm install
fi

# Final import resolvability check
echo
echo "[CHECK] Import resolvability for @castquest/neo-ux-core..."

if node -e "require.resolve('@castquest/neo-ux-core')" >/dev/null 2>&1; then
  echo "[OK] Import '@castquest/neo-ux-core' resolves correctly."
else
  echo "[ERROR] Import '@castquest/neo-ux-core' still does NOT resolve after pnpm install."
  echo "       Check package.json and workspace config."
  exit 1
fi

# ---------------------------------------------------------
# STEP 4: Validate wiring for admin & web
# ---------------------------------------------------------
echo
echo "[STEP 4] Validating admin/web wiring to neo-ux-core..."

ADMIN_LAYOUT="$ADMIN_APP/layout.tsx"
WEB_LAYOUT="$WEB_APP/layout.tsx"

if [ -f "$ADMIN_LAYOUT" ] && grep -q '@castquest/neo-ux-core' "$ADMIN_LAYOUT"; then
  echo "[OK] Admin layout imports neo-ux-core."
else
  echo "[WARN] Admin layout NOT wired to neo-ux-core or file missing."
fi

if [ -f "$WEB_LAYOUT" ] && grep -q '@castquest/neo-ux-core' "$WEB_LAYOUT"; then
  echo "[OK] Web layout imports neo-ux-core."
else
  echo "[WARN] Web layout NOT wired to neo-ux-core or file missing."
fi

# ---------------------------------------------------------
# STEP 5: Relaunch dev servers (SMART MEGA NEO DEV LAUNCHER v2)
# ---------------------------------------------------------
echo
echo "[STEP 5] Launching admin + web dev servers on clean ports..."

# Launch admin on 3010
echo "[LAUNCH] Admin dev on port 3010..."
( cd "$ROOT/apps/admin" && pnpm dev -- -p 3010 ) &

# Launch web on 3000
echo "[LAUNCH] Web dev on port 3000..."
( cd "$ROOT/apps/web" && pnpm dev -- -p 3000 ) &

sleep 4

echo
echo "====================================================================="
echo " SMART MEGA NEO SELF-HEALER COMPLETE"
echo " - Package:  @castquest/neo-ux-core"
echo " - Admin:    http://localhost:3010"
echo " - Web:      http://localhost:3000"
echo "====================================================================="
