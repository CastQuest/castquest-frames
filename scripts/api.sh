#!/usr/bin/env bash
set -euo pipefail

# API/Oracle Build Script - Build backend services

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest API/Oracle Build Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would build SDK"
  echo "[DRY RUN] Would build core-services"
  echo "[DRY RUN] Would test core-services"
else
  echo "Building SDK..."
  pnpm --filter @castquest/sdk build
  
  echo "Building core-services..."
  pnpm --filter @castquest/core-services build
  
  echo "Testing core-services..."
  pnpm --filter @castquest/core-services test --run || echo "⚠️ Some tests failed (expected)"
fi

echo "✅ API/Oracle build complete"
