#!/usr/bin/env bash
set -euo pipefail

# install.sh - Install dependencies for apps/web (Next.js), apps/mobile (Expo), and packages (ui, sdk)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest Install Script"
echo " Install dependencies for all apps and packages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would install root dependencies"
  echo "[DRY RUN] Would install apps/web dependencies"
  echo "[DRY RUN] Would install apps/mobile dependencies"
  echo "[DRY RUN] Would install packages/ui dependencies"
  echo "[DRY RUN] Would install packages/sdk dependencies"
else
  echo "Installing root dependencies..."
  pnpm install --frozen-lockfile || pnpm install
  
  echo
  echo "Installing Turborepo if not present..."
  pnpm add -D -w turbo
  
  echo
  echo "Installing Tailwind CSS and dependencies..."
  if [ -d "packages/ui" ]; then
    cd packages/ui
    pnpm add -D tailwindcss postcss autoprefixer
    pnpm add class-variance-authority clsx tailwind-merge
    cd "$ROOT_DIR"
  fi
  
  echo
  echo "Installing Shadcn/UI dependencies..."
  if [ -d "packages/ui" ]; then
    cd packages/ui
    pnpm add -D @radix-ui/react-slot
    cd "$ROOT_DIR"
  fi
  
  echo
  echo "Verifying installations..."
  echo "Apps:"
  [ -d "apps/web/node_modules" ] && echo "  ✓ apps/web" || echo "  ⚠️  apps/web (not installed)"
  [ -d "apps/mobile/node_modules" ] && echo "  ✓ apps/mobile" || echo "  ⚠️  apps/mobile (not installed)"
  [ -d "apps/admin/node_modules" ] && echo "  ✓ apps/admin" || echo "  ⚠️  apps/admin (not installed)"
  
  echo "Packages:"
  [ -d "packages/ui/node_modules" ] && echo "  ✓ packages/ui" || echo "  ⚠️  packages/ui (not installed)"
  [ -d "packages/sdk/node_modules" ] && echo "  ✓ packages/sdk" || echo "  ⚠️  packages/sdk (not installed)"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Installation complete!"
echo
echo "Next steps:"
echo "  1. Run './scripts/config.sh' to set up environment variables"
echo "  2. Run './scripts/ui.sh' to scaffold the UI library"
echo "  3. Run 'pnpm dev:web' to start the web app"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
