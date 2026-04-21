#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# CastQuest — Environment Setup Script
# ═══════════════════════════════════════════════════════════
# Usage: bash scripts/setup-env.sh
#
# Copies .env.example → .env.local for each workspace
# that has an .env.example but no .env.local yet.
# ═══════════════════════════════════════════════════════════

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

copy_env() {
  local dir="$1"
  local src="$dir/.env.example"
  local dst="$dir/.env.local"

  if [ ! -f "$src" ]; then
    return
  fi

  if [ -f "$dst" ]; then
    echo "  ⏭  $dst already exists — skipping"
  else
    cp "$src" "$dst"
    echo "  ✅ Created $dst"
  fi
}

echo ""
echo "══════════════════════════════════════════════"
echo " CastQuest — Environment Setup"
echo "══════════════════════════════════════════════"
echo ""
echo "Copying .env.example → .env.local where needed..."
echo ""

copy_env "$REPO_ROOT"
copy_env "$REPO_ROOT/apps/web"
copy_env "$REPO_ROOT/apps/admin"

echo ""
echo "✅ Done! Update the .env.local files with your real credentials."
echo ""
echo "Key files to edit:"
echo "  .env.local             — root / shared config"
echo "  apps/web/.env.local    — web app config"
echo "  apps/admin/.env.local  — admin app config"
echo ""
echo "See .env.example for documentation on each variable."
echo ""
