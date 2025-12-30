#!/usr/bin/env bash
set -euo pipefail

echo "[MEGA MODULE 4 — BASE API + MOBILE ADMIN + STRATEGY DASHBOARD] Starting…"

# ----------------------------------------
# 0. Basic paths
# ----------------------------------------
ADMIN_APP_DIR="apps/admin/app"
WEB_APP_DIR="apps/web/app"

# ----------------------------------------
# 1. BASE MOCK ONCHAIN API (admin side)
# ----------------------------------------
echo "[BASE] Creating mock onchain API routes…"

mkdir -p "$ADMIN_APP_DIR/api/base/mint"
mkdir -p "$ADMIN_APP_DIR/api/base/frame"
mkdir -p "$ADMIN_APP_DIR/api/base/token-info"
mkdir -p "$ADMIN_APP_DIR/api/base/tx-status"

# /api/base/mint
if [ ! -f "$ADMIN_APP_DIR/api/base/mint/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/base/mint/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[BASE MOCK] Mint request:", body);

  const fakeTxHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    txHash: fakeTxHash,
    status: "submitted",
    mintedAt: new Date().toISOString()
  });
}
EOF_TS
  echo "[BASE] Created: $ADMIN_APP_DIR/api/base/mint/route.ts"
else
  echo "[BASE][SKIP] $ADMIN_APP_DIR/api/base/mint/route.ts already exists"
fi

# /api/base/frame
if [ ! -f "$ADMIN_APP_DIR/api/base/frame/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/base/frame/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[BASE MOCK] Frame publish request:", body);

  const frameId = "frame_" + Date.now().toString();

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    frameId,
    url: `https://mock.castquest.xyz/frame/${frameId}`,
    publishedAt: new Date().toISOString()
  });
}
EOF_TS
  echo "[BASE] Created: $ADMIN_APP_DIR/api/base/frame/route.ts"
else
  echo "[BASE][SKIP] $ADMIN_APP_DIR/api/base/frame/route.ts already exists"
fi

# /api/base/token-info
if [ ! -f "$ADMIN_APP_DIR/api/base/token-info/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/base/token-info/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker") || "CAST";

  return NextResponse.json({
    ok: true,
    network: "base-sepolia-mock",
    ticker,
    address: "0x0000000000000000000000000000000000cA57",
    decimals: 18,
    totalSupply: "1000000",
    holders: 42
  });
}
EOF_TS
  echo "[BASE] Created: $ADMIN_APP_DIR/api/base/token-info/route.ts"
else
  echo "[BASE][SKIP] $ADMIN_APP_DIR/api/base/token-info/route.ts already exists"
fi

# /api/base/tx-status
if [ ! -f "$ADMIN_APP_DIR/api/base/tx-status/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/base/tx-status/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get("txHash");

  return NextResponse.json({
    ok: true,
    txHash,
    status: "confirmed",
    confirmations: 5,
    confirmedAt: new Date().toISOString()
  });
}
EOF_TS
  echo "[BASE] Created: $ADMIN_APP_DIR/api/base/tx-status/route.ts"
else
  echo "[BASE][SKIP] $ADMIN_APP_DIR/api/base/tx-status/route.ts already exists"
fi

# ----------------------------------------
# 2. STRATEGY DASHBOARD (admin)
# ----------------------------------------
echo "[STRATEGY] Creating strategy dashboard page…"

mkdir -p "$ADMIN_APP_DIR/strategy"

if [ ! -f "$ADMIN_APP_DIR/strategy/page.tsx" ]; then
  cat > "$ADMIN_APP_DIR/strategy/page.tsx" << 'EOF_TSX'
"use client";

import { useEffect, useState } from "react";

type LogEntry = {
  id: string;
  level: string;
  message: string;
  time: string;
};

export default function StrategyDashboardPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/strategy/logs");
        const json = await res.json();
        setLogs(json.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Strategy Dashboard</h1>
        <span className="text-xs text-zinc-500">
          Auto-refreshing every 5s
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Worker</div>
          <div className="text-lg font-semibold text-green-400">Online (mock)</div>
        </div>

        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Last Run</div>
          <div className="text-lg font-semibold">
            {logs[0]?.time || "—"}
          </div>
        </div>

        <div className="p-4 border border-zinc-700 rounded">
          <div className="text-xs uppercase text-zinc-500">Total Events</div>
          <div className="text-lg font-semibold">{logs.length}</div>
        </div>
      </div>

      <div className="border border-zinc-700 rounded overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900/50">
          <div className="text-sm font-semibold">Recent Events</div>
        </div>

        <div className="max-h-[400px] overflow-auto text-sm">
          {loading && (
            <div className="p-4 text-zinc-500">Loading logs…</div>
          )}
          {!loading && logs.length === 0 && (
            <div className="p-4 text-zinc-500">No logs yet.</div>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className="px-4 py-2 border-b border-zinc-800 flex items-start gap-3"
            >
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                  log.level === "error"
                    ? "bg-red-900/40 text-red-300"
                    : log.level === "warn"
                    ? "bg-yellow-900/40 text-yellow-200"
                    : "bg-emerald-900/40 text-emerald-200"
                }`}
              >
                {log.level}
              </span>
              <div className="flex-1">
                <div className="text-xs text-zinc-500">{log.time}</div>
                <div>{log.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF_TSX
  echo "[STRATEGY] Created: $ADMIN_APP_DIR/strategy/page.tsx"
else
  echo "[STRATEGY][SKIP] $ADMIN_APP_DIR/strategy/page.tsx already exists"
fi

# strategy logs API
echo "[STRATEGY] Creating logs API…"
mkdir -p "$ADMIN_APP_DIR/api/strategy/logs"

if [ ! -f "$ADMIN_APP_DIR/api/strategy/logs/route.ts" ]; then
  cat > "$ADMIN_APP_DIR/api/strategy/logs/route.ts" << 'EOF_TS'
import { NextResponse } from "next/server";

const mockLogs = [
  {
    id: "1",
    level: "info",
    message: "Strategy worker started (mock).",
    time: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: "2",
    level: "info",
    message: "Scanned 12 media items for opportunities.",
    time: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: "3",
    level: "warn",
    message: "No onchain price data (mock) — using defaults.",
    time: new Date(Date.now() - 10000).toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    ok: true,
    logs: mockLogs
  });
}
EOF_TS
  echo "[STRATEGY] Created: $ADMIN_APP_DIR/api/strategy/logs/route.ts"
else
  echo "[STRATEGY][SKIP] $ADMIN_APP_DIR/api/strategy/logs/route.ts already exists"
fi

# ----------------------------------------
# 3. MOBILE-FRIENDLY ADMIN LAYOUT (non-destructive helpers)
# ----------------------------------------
echo "[MOBILE] Adding optional ShellLayout and nav…"

mkdir -p "$ADMIN_APP_DIR/components"

# ShellLayout for admin (responsive sidebar)
if [ ! -f "$ADMIN_APP_DIR/components/ShellLayout.tsx" ]; then
  cat > "$ADMIN_APP_DIR/components/ShellLayout.tsx" << 'EOF_TSX'
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/media", label: "Media" },
  { href: "/frames", label: "Frames" },
  { href: "/mints", label: "Mints" },
  { href: "/quests", label: "Quests" },
  { href: "/strategy", label: "Strategy" }
];

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      <aside className="hidden md:flex md:flex-col w-56 border-r border-zinc-800 bg-zinc-950">
        <div className="px-4 py-3 border-b border-zinc-800 font-semibold text-sm">
          CastQuest Admin
        </div>
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1 text-sm">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1.5 rounded ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <div className="font-semibold text-sm">CastQuest Admin</div>
          <button
            onClick={() => setOpen((x) => !x)}
            className="px-2 py-1 text-xs border border-zinc-600 rounded"
          >
            {open ? "Close" : "Menu"}
          </button>
        </header>

        {open && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-2 py-2 space-y-1 text-sm">
            {links.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-2 py-1 rounded ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 px-4 py-4 md:px-8 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
EOF_TSX
  echo "[MOBILE] Created: $ADMIN_APP_DIR/components/ShellLayout.tsx"
else
  echo "[MOBILE][SKIP] $ADMIN_APP_DIR/components/ShellLayout.tsx already exists"
fi

# Optional admin root layout hint (non-destructive)
if [ -f "$ADMIN_APP_DIR/layout.tsx" ]; then
  if ! grep -q "ShellLayout" "$ADMIN_APP_DIR/layout.tsx"; then
    echo "[MOBILE] NOTE: You can wrap your admin app with ShellLayout from apps/admin/app/components/ShellLayout.tsx"
    echo "[MOBILE]       Example:"
    echo "         import { ShellLayout } from \"./components/ShellLayout\";"
    echo "         export default function RootLayout({ children }) {"
    echo "           return (<html><body><ShellLayout>{children}</ShellLayout></body></html>);"
  else
    echo "[MOBILE][SKIP] layout.tsx already references ShellLayout"
  fi
else
  echo "[MOBILE][INFO] No $ADMIN_APP_DIR/layout.tsx found — skipping layout hint."
fi

# ----------------------------------------
# 4. TAILWIND CONFIG PATCH (safe, non-destructive)
# ----------------------------------------
echo "[TAILWIND] Attempting safe Tailwind patch…"

TAILWIND_CONFIG_TS="tailwind.config.ts"
TAILWIND_CONFIG_JS="tailwind.config.js"

if [ -f "$TAILWIND_CONFIG_TS" ] || [ -f "$TAILWIND_CONFIG_JS" ]; then
  TARGET_CONFIG="$TAILWIND_CONFIG_TS"
  if [ ! -f "$TARGET_CONFIG" ]; then
    TARGET_CONFIG="$TAILWIND_CONFIG_JS"
  fi

  if ! grep -qi "CastQuest Mega Module 4" "$TARGET_CONFIG"; then
    cat >> "$TARGET_CONFIG" << 'EOF_TW'

// CastQuest Mega Module 4 — mobile/admin tweaks (non-breaking hint)
// Ensure your content globs include apps/admin and apps/web, e.g.:
// content: [
//   "./apps/**/*.{js,ts,jsx,tsx}",
//   "./packages/**/*.{js,ts,jsx,tsx}"
// ]
EOF_TW
    echo "[TAILWIND] Appended non-breaking hint to $TARGET_CONFIG"
  else
    echo "[TAILWIND][SKIP] Tailwind config already contains Mega Module 4 hint."
  fi
else
  echo "[TAILWIND][INFO] No tailwind.config.(ts|js) found — skipping."
fi

echo "[MEGA MODULE 4 — BASE API + MOBILE ADMIN + STRATEGY DASHBOARD] Complete."
