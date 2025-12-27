#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " Smart MEGA Brain — ShellLayout Fixer"
echo "====================================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ADMIN_APP="apps/admin/app"

echo "[INFO] Admin app path: $ADMIN_APP"

# 1) Ensure canonical ShellLayout exists
CANONICAL="$ADMIN_APP/ShellLayout.tsx"
if [ -f "$CANONICAL" ]; then
  echo "[OK] Canonical ShellLayout found at $CANONICAL"
else
  echo "[WARN] Canonical ShellLayout not found at $CANONICAL"
  echo "       You must recreate it or restore from git."
fi

# 2) Remove old components/ShellLayout duplicate if present
OLD_COMPONENTS="$ADMIN_APP/components/ShellLayout.tsx"
if [ -f "$OLD_COMPONENTS" ]; then
  echo "[FIX] Removing duplicate ShellLayout at $OLD_COMPONENTS"
  rm "$OLD_COMPONENTS"
else
  echo "[OK] No duplicate components/ShellLayout.tsx found."
fi

# 3) Fix layout.tsx import
LAYOUT="$ADMIN_APP/layout.tsx"
if [ -f "$LAYOUT" ]; then
  echo "[INFO] Patching layout.tsx import if needed..."
  # Replace any import from "./components/ShellLayout" with "./ShellLayout"
  sed -i 's|import { ShellLayout } from "./components/ShellLayout";|import ShellLayout from "./ShellLayout";|g' "$LAYOUT"
  sed -i 's|import ShellLayout from "./components/ShellLayout";|import ShellLayout from "./ShellLayout";|g' "$LAYOUT"
  echo "[OK] layout.tsx import normalized to ./ShellLayout"
else
  echo "[WARN] layout.tsx not found at $LAYOUT"
fi

echo
echo "====================================================================="
echo " Smart MEGA Brain ShellLayout Fix complete."
echo " Verify: apps/admin/app/layout.tsx and apps/admin/app/ShellLayout.tsx"
echo "====================================================================="
