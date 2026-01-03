#!/usr/bin/env bash
set -euo pipefail

# config.sh - Set up environment variables, Supabase CLI, and Drizzle config

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest Config Script"
echo " Set up environment variables, Supabase CLI, and Drizzle"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would create .env.local files"
  echo "[DRY RUN] Would install Supabase CLI"
  echo "[DRY RUN] Would configure Drizzle ORM"
else
  echo "Setting up environment variables..."
  
  # Create .env.example for web app
  if [ ! -f "apps/web/.env.example" ]; then
    cat > apps/web/.env.example << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✓ Created apps/web/.env.example"
  fi
  
  # Create .env.local if it doesn't exist
  if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✓ Created apps/web/.env.local (please update with your values)"
  else
    echo "✓ apps/web/.env.local already exists"
  fi
  
  # Create .env.example for mobile app
  if [ ! -f "apps/mobile/.env.example" ]; then
    cat > apps/mobile/.env.example << 'EOF'
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
EXPO_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✓ Created apps/mobile/.env.example"
  fi
  
  echo
  echo "Checking Supabase CLI installation..."
  if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    if command -v brew &> /dev/null; then
      brew install supabase/tap/supabase
    else
      echo "⚠️  Homebrew not found. Please install Supabase CLI manually:"
      echo "   https://supabase.com/docs/guides/cli/getting-started"
    fi
  else
    supabase_version=$(supabase -v)
    echo "✓ Supabase CLI version: $supabase_version"
  fi
  
  echo
  echo "Setting up Drizzle ORM configuration..."
  
  # Create drizzle.config.ts in packages/sdk or core-services
  if [ -d "packages/sdk" ] && [ ! -f "packages/sdk/drizzle.config.ts" ]; then
    cat > packages/sdk/drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
} satisfies Config;
EOF
    echo "✓ Created packages/sdk/drizzle.config.ts"
  fi
  
  echo
  echo "Installing Drizzle dependencies..."
  pnpm add -D -w drizzle-kit
  
  if [ -d "packages/sdk" ]; then
    cd packages/sdk
    pnpm add drizzle-orm postgres
    cd "$ROOT_DIR"
  fi
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Configuration complete!"
echo
echo "Next steps:"
echo "  1. Update .env.local files with your Supabase credentials"
echo "  2. Run 'supabase init' to initialize Supabase locally"
echo "  3. Run 'supabase start' to start local Supabase"
echo "  4. Run './scripts/ui.sh' to scaffold the UI library"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
