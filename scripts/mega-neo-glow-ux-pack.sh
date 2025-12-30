#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " SMART MEGA NEO GLOW — Unified UX Pack"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PKG_DIR="$ROOT/packages/neo-ux"
SRC_DIR="$PKG_DIR/src"

echo "[INFO] Creating shared NEO UX package at: $PKG_DIR"

mkdir -p "$SRC_DIR/components"
mkdir -p "$SRC_DIR/navigation"
mkdir -p "$SRC_DIR/data"
mkdir -p "$SRC_DIR/dashboard"
mkdir -p "$SRC_DIR/brain"
mkdir -p "$SRC_DIR/worker"
mkdir -p "$PKG_DIR/config"

# --------------------------------------------------------------------
# package.json
# --------------------------------------------------------------------
cat > "$PKG_DIR/package.json" << 'PKG'
{
  "name": "@castquest/neo-ux",
  "version": "0.1.0",
  "main": "dist/index.mjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": {
    "react": "^18.0.0"
  }
}
PKG

# --------------------------------------------------------------------
# tsconfig.json
# --------------------------------------------------------------------
cat > "$PKG_DIR/tsconfig.json" << 'TSCFG'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Node",
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
TSCFG

# --------------------------------------------------------------------
# index.mts (entry)
# --------------------------------------------------------------------
cat > "$SRC_DIR/index.ts" << 'INDEX'
export * from "./theme";
export * from "./components/GlowCard";
export * from "./components/GlowButton";
export * from "./components/GlowBadge";
export * from "./components/GlowPanel";
export * from "./components/GlowDivider";
export * from "./navigation/NavItem";
export * from "./navigation/NavSection";
export * from "./data/DataSurface";
export * from "./dashboard/DashboardWidgets";
export * from "./brain/BrainActivityGraph";
export * from "./worker/WorkerTimeline";
INDEX

# --------------------------------------------------------------------
# theme.ts
# --------------------------------------------------------------------
cat > "$SRC_DIR/theme.ts" << 'THEME'
export const neo = {
  glow: {
    active: "shadow-[0_0_12px_rgba(16,185,129,0.8)]",
    idle: "shadow-[0_0_6px_rgba(255,255,255,0.15)]",
    error: "shadow-[0_0_12px_rgba(239,68,68,0.8)]"
  },
  colors: {
    primary: "text-emerald-400",
    dim: "text-neutral-500",
    bg: "bg-neutral-950",
    border: "border-neutral-800"
  }
};
THEME

# --------------------------------------------------------------------
# UI COMPONENTS PACK
# --------------------------------------------------------------------
cat > "$SRC_DIR/components/GlowCard.tsx" << 'GLOWCARD'
"use client";
import { neo } from "../theme";

export function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}
GLOWCARD

cat > "$SRC_DIR/components/GlowButton.tsx" << 'GLOWBTN'
"use client";
import { neo } from "../theme";

export function GlowButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 ${neo.glow.active}`}
    >
      {children}
    </button>
  );
}
GLOWBTN

cat > "$SRC_DIR/components/GlowBadge.tsx" << 'GLOWBADGE'
"use client";

export function GlowBadge({
  label,
  color = "text-emerald-400"
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide ${color}`}
    >
      {label}
    </span>
  );
}
GLOWBADGE

cat > "$SRC_DIR/components/GlowPanel.tsx" << 'GLOWPANEL'
"use client";

export function GlowPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl shadow-inner">
      {children}
    </div>
  );
}
GLOWPANEL

cat > "$SRC_DIR/components/GlowDivider.tsx" << 'GLOWDIV'
export function GlowDivider() {
  return <div className="border-b border-neutral-800 my-4" />;
}
GLOWDIV

# --------------------------------------------------------------------
# NAVIGATION ENGINE
# --------------------------------------------------------------------
cat > "$SRC_DIR/navigation/NavItem.tsx" << 'NAVITEM'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon as LucideIcon } from "lucide-react";
import { GlowBadge } from "../components/GlowBadge";
import { neo } from "../theme";

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  moduleBadge?: string;
}

export function NavItem({ href, label, icon: Icon, moduleBadge }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
        ${active ? `bg-neutral-800 ${neo.glow.active}` : "text-neutral-300 hover:bg-neutral-800"}
      `}
    >
      <Icon size={18} className={active ? neo.colors.primary : neo.colors.dim} />
      <span className="font-medium flex items-center gap-2">
        {label}
        {moduleBadge && <GlowBadge label={moduleBadge} />}
      </span>
    </Link>
  );
}
NAVITEM

cat > "$SRC_DIR/navigation/NavSection.tsx" << 'NAVSECTION'
"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function NavSection({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-neutral-400 hover:text-neutral-200"
      >
        <span className="text-xs font-semibold tracking-wide">{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && <div className="pl-3 space-y-1">{children}</div>}
    </div>
  );
}
NAVSECTION

# --------------------------------------------------------------------
# DATA SURFACE VIEWER
# --------------------------------------------------------------------
cat > "$SRC_DIR/data/DataSurface.tsx" << 'DATASURF'
"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

export function DataSurface({ path }: { path: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setData({ error: "Failed to load data surface", path });
      }
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </GlowCard>
  );
}
DATASURF

# --------------------------------------------------------------------
# DASHBOARD WIDGETS
# --------------------------------------------------------------------
cat > "$SRC_DIR/dashboard/DashboardWidgets.tsx" << 'DASHBOARD'
"use client";
import { GlowCard } from "../components/GlowCard";
import { GlowDivider } from "../components/GlowDivider";

export function DashboardStat({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <GlowCard>
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold text-emerald-400 mt-1">{value}</div>
    </GlowCard>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function DashboardSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-neutral-300 mb-2">{title}</h2>
      <GlowDivider />
      {children}
    </section>
  );
}
DASHBOARD

# --------------------------------------------------------------------
# BRAIN ACTIVITY GRAPH (placeholder, timeline-like)
# --------------------------------------------------------------------
cat > "$SRC_DIR/brain/BrainActivityGraph.tsx" << 'BRAIN'
"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

interface BrainEvent {
  timestamp: string;
  type: string;
  detail?: string;
}

export function BrainActivityGraph({ path }: { path: string }) {
  const [events, setEvents] = useState<BrainEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setEvents(json || []);
      } catch (e) {
        setEvents([]);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <h3 className="text-sm font-semibold text-emerald-400 mb-2">Brain Activity</h3>
      <ul className="space-y-1 text-xs text-neutral-300 max-h-64 overflow-y-auto">
        {events.map((e, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="text-neutral-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="font-medium">{e.type}</span>
            {e.detail && <span className="text-neutral-400 truncate">{e.detail}</span>}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
BRAIN

# --------------------------------------------------------------------
# WORKER TIMELINE
# --------------------------------------------------------------------
cat > "$SRC_DIR/worker/WorkerTimeline.tsx" << 'WORKER'
"use client";
import { useEffect, useState } from "react";
import { GlowCard } from "../components/GlowCard";

interface WorkerEvent {
  timestamp: string;
  type: string;
  jobId?: string;
}

export function WorkerTimeline({ path }: { path: string }) {
  const [events, setEvents] = useState<WorkerEvent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(path);
        const json = await res.json();
        setEvents(json || []);
      } catch (e) {
        setEvents([]);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <GlowCard>
      <h3 className="text-sm font-semibold text-purple-400 mb-2">Worker Timeline</h3>
      <ul className="space-y-1 text-xs text-neutral-300 max-h-64 overflow-y-auto">
        {events.map((e, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="text-neutral-500">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="font-medium">{e.type}</span>
            {e.jobId && <span className="text-neutral-400 truncate">{e.jobId}</span>}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
WORKER

# --------------------------------------------------------------------
# CONFIG JSON (simple mapping for panels / surfaces)
# --------------------------------------------------------------------
cat > "$PKG_DIR/config/panels.json" << 'PANELS'
{
  "web": {
    "label": "Web Panel",
    "defaultDashboard": "/"
  },
  "admin": {
    "label": "Admin Operator Panel",
    "defaultDashboard": "/"
  },
  "user": {
    "label": "User Panel",
    "defaultDashboard": "/"
  },
  "dev": {
    "label": "Dev Panel",
    "defaultDashboard": "/"
  }
}
PANELS

echo "====================================================================="
echo " SMART MEGA NEO GLOW UX PACK — CREATED"
echo " Location: packages/neo-ux"
echo " Export:   @castquest/neo-ux"
echo "====================================================================="
