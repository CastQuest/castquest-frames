#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " CastQuest Module 9 MEGA — Installer / Bootstrap"
echo "====================================================================="
echo

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Root directory: $ROOT_DIR"
echo

###############################################################################
# 0. Basic sanity checks
###############################################################################
echo "==> Checking basic tooling..."

command -v node >/dev/null 2>&1 || { echo "[ERROR] node not found in PATH"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "[ERROR] pnpm not found in PATH"; exit 1; }

echo "[OK] node found: $(node -v)"
echo "[OK] pnpm found: $(pnpm -v)"
echo

###############################################################################
# 1. Ensure core directories exist
###############################################################################
echo "==> Ensuring core directories exist..."

REQ_DIRS=(
  "apps/admin"
  "apps/web"
  "packages/ai-brain"
  "packages/contracts"
  "packages/sdk"
  "packages/strategy-worker"
  "data"
  "docs"
  "scripts"
)

for d in "${REQ_DIRS[@]}"; do
  if [ ! -d "$d" ]; then
    echo "  [MKDIR] $d"
    mkdir -p "$d"
  else
    echo "  [OK]    $d"
  fi
done

echo

###############################################################################
# 2. Root install (pnpm workspace)
###############################################################################
echo "==> Running root pnpm install (workspace)..."

pnpm install

echo "[OK] Root workspace dependencies installed."
echo

###############################################################################
# 3. App-level checks (admin + web)
###############################################################################
echo "==> Checking app packages..."

ADMIN_PKG="apps/admin/package.json"
WEB_PKG="apps/web/package.json"

if [ -f "$ADMIN_PKG" ]; then
  echo "[OK]   Found $ADMIN_PKG"
else
  echo "[WARN] Missing $ADMIN_PKG (admin app package). You may need to reconstruct it if broken."
fi

if [ -f "$WEB_PKG" ]; then
  echo "[OK]   Found $WEB_PKG"
else
  echo "[WARN] Missing $WEB_PKG (web app package). You may need to reconstruct it if broken."
fi

echo

###############################################################################
# 4. Package-level checks
###############################################################################
echo "==> Checking key packages..."

PKGS=(
  "packages/ai-brain/package.json"
  "packages/contracts/package.json"
  "packages/sdk/package.json"
  "packages/strategy-worker/package.json"
)

for p in "${PKGS[@]}"; do
  if [ -f "$p" ]; then
    echo "[OK]   Found $p"
  else
    echo "[WARN] Missing $p"
  fi
done

echo

###############################################################################
# 5. Optional: run existing bootstrap scripts
###############################################################################
echo "==> Running optional bootstrap scripts if present..."

BOOTSTRAP_SCRIPTS=(
  "scripts/bootstrap.sh"
  "scripts/bootstrap-admin-web.sh"
  "scripts/module-3-objects.sh"
  "scripts/module-upload.sh"
)

for s in "${BOOTSTRAP_SCRIPTS[@]}"; do
  if [ -f "$s" ]; then
    echo "[RUN] $s"
    chmod +x "$s" || true
    ./"$s" || echo "[WARN] $s exited with non-zero status."
  else
    echo "[SKIP] $s (not found)"
  fi
done

echo

###############################################################################
# 6. Emit operator instructions
###############################################################################
echo "====================================================================="
echo " Module 9 MEGA — Installer / Bootstrap Complete"
echo "====================================================================="
echo
echo "You can now run:"
echo "  pnpm dev --filter admin   # start admin app"
echo "  pnpm dev --filter web     # start web app"
echo
echo "Recommended next steps:"
echo "  1) ./scripts/protocol-integrity-mega.sh"
echo "  2) ./scripts/castquest-mega-selfheal.sh (if needed)"
echo
echo "All changes from this script are additive and non-destructive."
echo "====================================================================="
