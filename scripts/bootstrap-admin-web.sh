#!/usr/bin/env bash
set -euo pipefail

echo "[BOOTSTRAP] Ensuring core structure..."

# root tsconfig.json
cat > tsconfig.json << 'JSON'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": false,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["apps", "packages"]
}
JSON

# ensure admin app structure
mkdir -p apps/admin/app
mkdir -p apps/admin/app/quests apps/admin/app/quests/new apps/admin/app/quests/[id]
mkdir -p apps/admin/app/frames apps/admin/app/frames/new apps/admin/app/frames/[id]
mkdir -p apps/admin/app/mints apps/admin/app/mints/new apps/admin/app/mints/[id]
mkdir -p apps/admin/app/brain apps/admin/app/brain/settings apps/admin/app/brain/routes
mkdir -p apps/admin/app/systems apps/admin/app/systems/health apps/admin/app/systems/logs apps/admin/app/systems/queues

# admin package.json (only write if missing)
if [ ! -f apps/admin/package.json ]; then
  cat > apps/admin/package.json << 'JSON'
{
  "name": "@castquest/admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
JSON
fi

# admin tsconfig (only write if missing)
if [ ! -f apps/admin/tsconfig.json ]; then
  cat > apps/admin/tsconfig.json << 'JSON'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["app"]
}
JSON
fi

# admin next.config.mjs (only write if missing)
if [ ! -f apps/admin/next.config.mjs ]; then
  cat > apps/admin/next.config.mjs << 'JS'
/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
};

export default nextConfig;
JS
fi

# admin globals.css (only write if missing)
if [ ! -f apps/admin/app/globals.css ]; then
  mkdir -p apps/admin/app
  cat > apps/admin/app/globals.css << 'CSS'
html, body {
  margin: 0;
  padding: 0;
  background: #020617;
  color: #e5e7eb;
  font-family: system-ui, sans-serif;
}

.cq-admin-body {
  min-height: 100vh;
  display: flex;
}

.cq-admin-shell {
  display: flex;
  width: 100%;
}

.cq-admin-sidebar {
  width: 220px;
  background: #0f172a;
  border-right: 1px solid #1e293b;
  padding: 20px;
}

.cq-admin-logo {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  color: #22c55e;
}

.cq-admin-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cq-admin-nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
}

.cq-admin-nav-item:hover {
  color: #f1f5f9;
}

.cq-admin-main {
  flex: 1;
  padding: 30px;
}
CSS
fi

# admin layout.tsx (only write if missing)
if [ ! -f apps/admin/app/layout.tsx ]; then
  cat > apps/admin/app/layout.tsx << 'TSX'
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CastQuest Operator Console",
  description: "Admin control surface for CastQuest protocol."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="cq-admin-body">
        <div className="cq-admin-shell">
          <aside className="cq-admin-sidebar">
            <div className="cq-admin-logo">OPERATOR</div>
            <nav className="cq-admin-nav">
              <a href="/" className="cq-admin-nav-item">Overview</a>
              <a href="/quests" className="cq-admin-nav-item">Quests</a>
              <a href="/frames" className="cq-admin-nav-item">Frames</a>
              <a href="/mints" className="cq-admin-nav-item">Mints</a>
              <a href="/brain" className="cq-admin-nav-item">Smart Brain</a>
              <a href="/systems" className="cq-admin-nav-item">Systems</a>
            </nav>
          </aside>
          <main className="cq-admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
TSX
fi

# admin overview page (only write if missing)
if [ ! -f apps/admin/app/page.tsx ]; then
  cat > apps/admin/app/page.tsx << 'TSX'
export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">CastQuest Operator Console</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Manage quests, frames, mints, Smart Brain behavior, and system health.
      </p>
    </div>
  );
}
TSX
fi

# ensure basic web app exists (simple landing)
mkdir -p apps/web/app

if [ ! -f apps/web/package.json ]; then
  cat > apps/web/package.json << 'JSON'
{
  "name": "@castquest/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
JSON
fi

if [ ! -f apps/web/tsconfig.json ]; then
  cat > apps/web/tsconfig.json << 'JSON'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["app"]
}
JSON
fi

if [ ! -f apps/web/next.config.mjs ]; then
  cat > apps/web/next.config.mjs << 'JS'
/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
};

export default nextConfig;
JS
fi

if [ ! -f apps/web/app/globals.css ]; then
  cat > apps/web/app/globals.css << 'CSS'
html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
}
CSS
fi

if [ ! -f apps/web/app/layout.tsx ]; then
  cat > apps/web/app/layout.tsx << 'TSX'
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CastQuest",
  description: "CastQuest media and onchain experiences."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
TSX
fi

if [ ! -f apps/web/app/page.tsx ]; then
  cat > apps/web/app/page.tsx << 'TSX'
export default function WebHomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>CastQuest</h1>
      <p>
        Media-first, onchain-aware quests, frames, and mints.
      </p>
    </main>
  );
}
TSX
fi

echo "[BOOTSTRAP] Done."
