#!/usr/bin/env bash
set -euo pipefail

echo "Starting Admin (3010) and Web (3000)..."

pnpm --filter ./apps/admin dev -- -p 3010 &
ADMIN_PID=$!

pnpm --filter ./apps/web dev -- -p 3000 &
WEB_PID=$!

echo "Admin PID: $ADMIN_PID"
echo "Web PID:   $WEB_PID"

wait
