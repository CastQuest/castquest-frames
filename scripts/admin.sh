#!/usr/bin/env bash
set -euo pipefail

# admin.sh - Scaffold the Admin Panel (User directory, Protected routes)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN="${DRY_RUN:-false}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest Admin Panel Scaffold Script"
echo " Scaffold User directory and Protected routes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DRY_RUN: $DRY_RUN"
echo

cd "$ROOT_DIR"

if [ "$DRY_RUN" = "true" ]; then
  echo "[DRY RUN] Would create admin pages"
  echo "[DRY RUN] Would create user management"
  echo "[DRY RUN] Would setup admin middleware"
  echo "[DRY RUN] Would create admin dashboard"
else
  echo "Creating admin panel structure..."
  
  if [ -d "apps/admin" ]; then
    # Create admin pages
    mkdir -p apps/admin/app/admin/users
    mkdir -p apps/admin/app/admin/settings
    mkdir -p apps/admin/middleware
    
    # Create admin users page
    if [ ! -f "apps/admin/app/admin/users/page.tsx" ]; then
      cat > apps/admin/app/admin/users/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUsers = async () => {
      // This would typically use a server-side API route with service role
      const { data, error } = await supabase.from('profiles').select('*');
      
      if (data) {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [supabase]);

  if (loading) {
    return <div className="p-8">Loading users...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
EOF
      echo "✓ Created admin users page"
    fi
    
    # Create admin layout
    if [ ! -f "apps/admin/app/admin/layout.tsx" ]; then
      cat > apps/admin/app/admin/layout.tsx << 'EOF'
'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <a
                  href="/admin/users"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Users
                </a>
                <a
                  href="/admin/settings"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
EOF
      echo "✓ Created admin layout"
    fi
    
    # Create middleware for protected routes
    if [ ! -f "apps/admin/middleware.ts" ]; then
      cat > apps/admin/middleware.ts << 'EOF'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if accessing admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
EOF
      echo "✓ Created admin middleware"
    fi
  fi
  
  echo
  echo "Admin panel structure:"
  echo "  apps/admin/app/admin/"
  echo "    ├── users/           (User management)"
  echo "    ├── settings/        (Admin settings)"
  echo "    └── layout.tsx       (Admin layout)"
  echo "  apps/admin/middleware.ts (Protected routes)"
fi

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Admin panel scaffold complete!"
echo
echo "Next steps:"
echo "  1. Add more admin features (analytics, moderation, etc.)"
echo "  2. Create proper role-based access control"
echo "  3. Add audit logging"
echo "  4. Start the development server: pnpm dev:admin"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
