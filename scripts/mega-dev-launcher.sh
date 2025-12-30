#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=============================================================="
echo " MEGA DEV LAUNCHER — Admin + Web with Dynamic Ports"
echo "=============================================================="

# 1. Clean ports
./scripts/mega-port-cleaner.sh

# 2. Detect ports
ADMIN_PORT=$(./scripts/port-detect.sh 3001)
WEB_PORT=$(./scripts/port-detect.sh 3000)

echo "[INFO] Admin will run on port $ADMIN_PORT"
echo "[INFO] Web will run on port $WEB_PORT"

# 3. Launch admin
echo "[START] Admin Console"
pnpm --filter ./apps/admin dev -- -p "$ADMIN_PORT" &
ADMIN_PID=$!

# 4. Launch web
echo "[START] Web Console"
pnpm --filter ./apps/web dev -- -p "$WEB_PORT" &
WEB_PID=$!

echo "=============================================================="
echo " MEGA DEV LAUNCHER — READY"
echo "--------------------------------------------------------------"
echo " Admin: https://$(hostname)-$ADMIN_PORT.app.github.dev"
echo " Web:   https://$(hostname)-$WEB_PORT.app.github.dev"
echo "--------------------------------------------------------------"
echo " PIDs: admin=$ADMIN_PID  web=$WEB_PID"
echo "=============================================================="

wait
