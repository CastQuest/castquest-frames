#!/usr/bin/env bash
set -euo pipefail

# setup.sh - Initialize the workspace, pnpm, and directory structure

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest Setup Script"
echo " Initialize workspace, pnpm, and directory structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would check Node.js version"
  echo "[DRY RUN] Would check pnpm installation"
  echo "[DRY RUN] Would verify directory structure"
  echo "[DRY RUN] Would initialize git hooks"
else
  echo "Checking Node.js version..."
  node_version=$(node -v)
  echo "✓ Node.js version: $node_version"
  
  echo
  echo "Checking pnpm installation..."
  if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm@9
  else
    pnpm_version=$(pnpm -v)
    echo "✓ pnpm version: $pnpm_version"
  fi
  
  echo
  echo "Verifying directory structure..."
  
  # Ensure required directories exist
  mkdir -p apps/web
  mkdir -p apps/mobile
  mkdir -p apps/admin
  mkdir -p packages/ui
  mkdir -p packages/sdk
  mkdir -p packages/core-services
  mkdir -p scripts
  
  echo "✓ Directory structure verified"
  
  echo
  echo "Checking workspace configuration..."
  if [ -f "pnpm-workspace.yaml" ]; then
    echo "✓ pnpm-workspace.yaml exists"
  else
    echo "⚠️  pnpm-workspace.yaml not found"
  fi
  
  if [ -f "turbo.json" ]; then
    echo "✓ turbo.json exists"
  else
    echo "⚠️  turbo.json not found"
  fi
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo
echo "Next steps:"
echo "  1. Run './scripts/install.sh' to install dependencies"
echo "  2. Run './scripts/config.sh' to set up environment variables"
echo "  3. Run './scripts/ui.sh' to scaffold the UI library"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
