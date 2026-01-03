#!/usr/bin/env bash
set -euo pipefail

# api.sh - Generate API routes and Supabase Edge Functions

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest API Generation Script"
echo " Generate API routes and Supabase Edge Functions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would create Next.js API routes"
  echo "[DRY RUN] Would scaffold Supabase Edge Functions"
  echo "[DRY RUN] Would create API middleware"
else
  echo "Creating Next.js API routes structure..."
  
  # Create API routes in apps/web
  if [ -d "apps/web" ]; then
    mkdir -p apps/web/app/api/auth
    mkdir -p apps/web/app/api/users
    mkdir -p apps/web/app/api/posts
    
    # Create auth callback route
    if [ ! -f "apps/web/app/api/auth/callback/route.ts" ]; then
      cat > apps/web/app/api/auth/callback/route.ts << 'EOF'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
EOF
      echo "✓ Created API auth callback route"
    fi
    
    # Create users API route example
    if [ ! -f "apps/web/app/api/users/route.ts" ]; then
      cat > apps/web/app/api/users/route.ts << 'EOF'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ user });
}
EOF
      echo "✓ Created API users route"
    fi
  fi
  
  echo
  echo "Setting up Supabase Edge Functions..."
  
  # Create Edge Functions directory structure
  if [ -d "supabase" ]; then
    mkdir -p supabase/functions
    echo "✓ Supabase functions directory ready"
  else
    echo "⚠️  Run 'supabase init' first to create Supabase project structure"
  fi
  
  echo
  echo "API structure:"
  echo "  apps/web/app/api/"
  echo "    ├── auth/callback/   (Auth callback)"
  echo "    ├── users/           (User management)"
  echo "    └── posts/           (Content API)"
  echo "  supabase/functions/    (Edge Functions)"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ API generation complete!"
echo
echo "Next steps:"
echo "  1. Add more API routes in apps/web/app/api/"
echo "  2. Create Edge Functions: supabase functions new <function-name>"
echo "  3. Deploy Edge Functions: supabase functions deploy <function-name>"
echo "  4. Run './scripts/user.sh' to scaffold user features"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
