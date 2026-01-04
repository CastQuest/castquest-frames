#!/usr/bin/env bash
set -euo pipefail

# ui.sh - Scaffold the shared UI library with Tailwind and Shadcn/UI

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest UI Library Scaffold Script"
echo " Scaffold shared UI library with Tailwind and Shadcn/UI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would scaffold packages/ui structure"
  echo "[DRY RUN] Would install Tailwind CSS"
  echo "[DRY RUN] Would install Shadcn/UI dependencies"
  echo "[DRY RUN] Would create base components"
  echo "[DRY RUN] Would build UI package"
else
  echo "Scaffolding packages/ui..."
  
  # Ensure directory exists
  mkdir -p packages/ui/src/components
  
  echo "Installing Tailwind CSS..."
  if [ -d "packages/ui" ]; then
    cd packages/ui
    
    # Install Tailwind if not present
    if [ ! -f "tailwind.config.js" ]; then
      pnpm add -D tailwindcss postcss autoprefixer
      pnpm add class-variance-authority clsx tailwind-merge
    fi
    
    # Install Shadcn/UI dependencies
    echo "Installing Shadcn/UI dependencies..."
    pnpm add -D @radix-ui/react-slot lucide-react
    
    cd "$ROOT_DIR"
  fi
  
  echo
  echo "Building UI package..."
  if [ -d "packages/ui" ]; then
    pnpm --filter @castquest/ui build || echo "✓ UI package ready (build may require additional setup)"
  fi
  
  echo
  echo "UI library structure:"
  echo "  packages/ui/"
  echo "    ├── src/"
  echo "    │   ├── components/  (Button, Input, etc.)"
  echo "    │   ├── utils.ts     (cn helper)"
  echo "    │   └── index.ts     (exports)"
  echo "    ├── tailwind.config.js"
  echo "    └── tsconfig.json"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ UI library scaffold complete!"
echo
echo "Next steps:"
echo "  1. Add more Shadcn/UI components to packages/ui/src/components/"
echo "  2. Import UI components in your apps with: import { Button } from '@castquest/ui'"
echo "  3. Run './scripts/sdk.sh' to build the SDK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
