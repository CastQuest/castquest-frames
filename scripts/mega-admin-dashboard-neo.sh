#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " MEGA ADMIN DASHBOARD — NEO SETUP"
echo "=============================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADMIN="$ROOT/apps/admin/app"

echo "[INFO] Admin app path: $ADMIN"

mkdir -p "$ADMIN/dashboard"
mkdir -p "$ADMIN/neo"

# Create NEO dashboard placeholder
cat > "$ADMIN/dashboard/page.tsx" << 'EOF'
"use client";

export default function DashboardNEO() {
  return (
    <div className="p-6 text-neutral-200">
      <h1 className="text-xl font-bold text-emerald-400">Admin Dashboard NEO</h1>
      <p className="text-neutral-400 mt-2">
        Real-time operator insights will appear here.
      </p>
    </div>
  );
}
EOF

echo "[OK] Admin Dashboard NEO scaffolded."
echo "=============================================================="