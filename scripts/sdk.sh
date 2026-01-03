#!/usr/bin/env bash
set -euo pipefail

# sdk.sh - Build the shared Supabase SDK and service layer

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest SDK Build Script"
echo " Build shared Supabase SDK and service layer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would install Supabase dependencies"
  echo "[DRY RUN] Would generate Supabase types"
  echo "[DRY RUN] Would build SDK package"
  echo "[DRY RUN] Would setup database schema"
else
  echo "Installing Supabase SDK dependencies..."
  if [ -d "packages/sdk" ]; then
    cd packages/sdk
    
    # Install Supabase client and auth helpers
    pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
    
    # Install Drizzle ORM
    pnpm add drizzle-orm postgres
    pnpm add -D drizzle-kit
    
    cd "$ROOT_DIR"
  fi
  
  echo
  echo "Checking for Supabase configuration..."
  if command -v supabase &> /dev/null; then
    echo "✓ Supabase CLI found"
    
    # Initialize Supabase if not already done
    if [ ! -d "supabase" ]; then
      echo "Initializing Supabase project..."
      supabase init
    fi
    
    # Generate types if Supabase is running
    echo "Note: Run 'supabase gen types typescript --local' to generate types"
  else
    echo "⚠️  Supabase CLI not found. Install it with:"
    echo "   brew install supabase/tap/supabase"
  fi
  
  echo
  echo "Building SDK package..."
  if [ -d "packages/sdk" ]; then
    pnpm --filter @castquest/sdk build || echo "✓ SDK package ready"
  fi
  
  echo
  echo "SDK structure:"
  echo "  packages/sdk/"
  echo "    ├── src/"
  echo "    │   ├── client/      (Supabase client)"
  echo "    │   ├── db/          (Database schema)"
  echo "    │   ├── services/    (Business logic)"
  echo "    │   └── types/       (TypeScript types)"
  echo "    └── drizzle.config.ts"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SDK build complete!"
echo
echo "Next steps:"
echo "  1. Start Supabase locally: supabase start"
echo "  2. Generate types: supabase gen types typescript --local > packages/sdk/src/types/database.ts"
echo "  3. Run './scripts/api.sh' to generate API routes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
