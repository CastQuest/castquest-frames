#!/usr/bin/env bash
set -euo pipefail

# UI Build Script - Build all UI applications

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest UI Build Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would build neo-ux-core"
  echo "[DRY RUN] Would build web app"
  echo "[DRY RUN] Would build admin app"
else
  echo "Building neo-ux-core..."
  pnpm --filter @castquest/neo-ux-core build
  
  echo "Building web app..."
  pnpm --filter @castquest/web build
  
  echo "Building admin app..."
  pnpm --filter @castquest/admin build
fi

echo "✅ UI build complete"
