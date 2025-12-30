#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " MEGA SMART AUTO-TYPER v2"
echo " - Idempotent"
echo " - No duplicate imports"
echo " - No double Props interfaces"
echo "====================================================================="

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

    # Skip if already typed
    if grep -q "interface .*Props" "$FILE"; then
      continue
    fi

    # Skip if no children prop
    if ! grep -q "{ children" "$FILE"; then
      continue
    fi

    echo "[PATCH] $FILE"

    # Ensure ReactNode import exists
    if ! grep -q "ReactNode" "$FILE"; then
      sed -i '1i import { ReactNode } from "react";' "$FILE"
    fi

    # Inject Props interface
    sed -i 's/export function \([A-Za-z0-9_]*\)({ children })/interface \1Props { children: ReactNode; }\nexport function \1({ children }: \1Props)/' "$FILE"

    sed -i 's/export function \([A-Za-z0-9_]*\)({ children, \.\.\.props })/import { ButtonHTMLAttributes } from "react";\ninterface \1Props extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; }\nexport function \1({ children, ...props }: \1Props)/' "$FILE"
  done
done

echo "====================================================================="
echo " AUTO-TYPER v2 COMPLETE"
echo "====================================================================="
