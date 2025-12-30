#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO — Admin + Web Wiring + Advanced Dashboard"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ADMIN_APP="$ROOT/apps/admin/app"
WEB_APP="$ROOT/apps/web/app"

echo "[INFO] Admin app: $ADMIN_APP"
echo "[INFO] Web app:   $WEB_APP"

mkdir -p "$ADMIN_APP"
mkdir -p "$WEB_APP"
mkdir -p "$ADMIN_APP/dashboard"
mkdir -p "$WEB_APP/dashboard"

# --------------------------------------------------------------------
# Admin Root Layout (TSX) wired to neo-ux-core
# --------------------------------------------------------------------
cat > "$ADMIN_APP/layout.tsx" << 'ADMIN_LAYOUT'
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { GlowPanel } from "@castquest/neo-ux-core";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-200">
        <GlowPanel>
          {children}
        </GlowPanel>
      </body>
    </html>
  );
}
ADMIN_LAYOUT

# --------------------------------------------------------------------
# Web Root Layout (TSX) wired to neo-ux-core
# --------------------------------------------------------------------
cat > "$WEB_APP/layout.tsx" << 'WEB_LAYOUT'
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { GlowPanel } from "@castquest/neo-ux-core";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-neutral-200">
        <GlowPanel>
          {children}
        </GlowPanel>
      </body>
    </html>
  );
}
WEB_LAYOUT

# --------------------------------------------------------------------
# Advanced Admin Dashboard Page using all four in one screen
# --------------------------------------------------------------------
cat > "$ADMIN_APP/dashboard/page.tsx" << 'ADMIN_DASH'
"use client";

import {
  GlowCard,
  GlowButton,
  DashboardGrid,
  DashboardStat,
  DashboardSection,
  BrainActivityGraph,
  WorkerTimeline
} from "@castquest/neo-ux-core";

export default function AdminDashboardMega() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Operator Dashboard • MEGA NEO GLOW</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Unified view of frames, quests, brain activity, and worker timeline.
          </p>
        </div>
        <GlowButton>Run Full Protocol Scan</GlowButton>
      </header>

      <DashboardSection title="Protocol Stats">
        <DashboardGrid>
          <DashboardStat label="Total Frames" value="128" />
          <DashboardStat label="Active Quests" value="19" />
          <DashboardStat label="Pending Mints" value="42" />
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection title="Live Activity">
        <div className="grid gap-4 md:grid-cols-2">
          <BrainActivityGraph path="/data/brain-events.json" />
          <WorkerTimeline path="/data/worker-events.json" />
        </div>
      </DashboardSection>
    </div>
  );
}
ADMIN_DASH

# --------------------------------------------------------------------
# Web Front Page using same core components (simpler view)
# --------------------------------------------------------------------
cat > "$WEB_APP/page.tsx" << 'WEB_PAGE'
"use client";

import {
  GlowCard,
  GlowButton,
  DashboardGrid,
  DashboardStat
} from "@castquest/neo-ux-core";

export default function WebFrontMega() {
  return (
    <div className="space-y-6">
      <GlowCard>
        <h1 className="text-xl font-bold text-emerald-400">CastQuest Web • NEO GLOW</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Public-facing view powered by the same sovereign NEO GLOW core.
        </p>
        <div className="mt-4">
          <GlowButton>Start a New Quest</GlowButton>
        </div>
      </GlowCard>

      <DashboardGrid>
        <DashboardStat label="Featured Frames" value="12" />
        <DashboardStat label="Live Quests" value="4" />
        <DashboardStat label="Total Participants" value="327" />
      </DashboardGrid>
    </div>
  );
}
WEB_PAGE

echo "====================================================================="
echo " SMART MEGA NEO WIRING COMPLETE"
echo " Admin layout:    apps/admin/app/layout.tsx"
echo " Admin dashboard: apps/admin/app/dashboard/page.tsx"
echo " Web layout:      apps/web/app/layout.tsx"
echo " Web front:       apps/web/app/page.tsx"
echo "====================================================================="
