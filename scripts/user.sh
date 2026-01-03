#!/usr/bin/env bash
set -euo pipefail

# user.sh - Scaffold user features (Auth flows, Dashboard, Realtime sync)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest User Features Scaffold Script"
echo " Scaffold Auth flows, Dashboard, and Realtime sync"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would create auth pages"
  echo "[DRY RUN] Would create dashboard pages"
  echo "[DRY RUN] Would setup realtime subscriptions"
  echo "[DRY RUN] Would create user profile components"
else
  echo "Creating auth pages..."
  
  if [ -d "apps/web" ]; then
    # Create auth pages
    mkdir -p apps/web/app/auth/login
    mkdir -p apps/web/app/auth/signup
    mkdir -p apps/web/app/auth/reset-password
    
    # Create login page
    if [ ! -f "apps/web/app/auth/login/page.tsx" ]; then
      cat > apps/web/app/auth/login/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
EOF
      echo "✓ Created login page"
    fi
    
    # Create dashboard page
    mkdir -p apps/web/app/dashboard
    if [ ! -f "apps/web/app/dashboard/page.tsx" ]; then
      cat > apps/web/app/dashboard/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {user?.email}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
EOF
      echo "✓ Created dashboard page"
    fi
    
    # Create realtime hook
    mkdir -p apps/web/hooks
    if [ ! -f "apps/web/hooks/useRealtime.ts" ]; then
      cat > apps/web/hooks/useRealtime.ts << 'EOF'
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useRealtime(table: string, callback: (payload: any) => void) {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, supabase]);
}
EOF
      echo "✓ Created realtime hook"
    fi
  fi
  
  echo
  echo "User features structure:"
  echo "  apps/web/app/"
  echo "    ├── auth/"
  echo "    │   ├── login/         (Login page)"
  echo "    │   ├── signup/        (Signup page)"
  echo "    │   └── reset-password/"
  echo "    └── dashboard/         (User dashboard)"
  echo "  apps/web/hooks/"
  echo "    └── useRealtime.ts     (Realtime subscriptions)"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ User features scaffold complete!"
echo
echo "Next steps:"
echo "  1. Customize auth pages with your UI components"
echo "  2. Add user profile management"
echo "  3. Configure Supabase Auth providers"
echo "  4. Run './scripts/admin.sh' to scaffold the admin panel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
