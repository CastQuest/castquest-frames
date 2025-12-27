#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " MEGA NEO AUTOPILOT — Full System Bootstrap"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[INFO] Running from: $ROOT"
echo

# ---------------------------------------------------------
# 1. Clean ports
# ---------------------------------------------------------
if [ -f scripts/mega-port-cleaner.sh ]; then
  echo "[STEP 1] Cleaning ports..."
  chmod +x scripts/mega-port-cleaner.sh
  ./scripts/mega-port-cleaner.sh
else
  echo "[WARN] mega-port-cleaner.sh not found."
fi

# ---------------------------------------------------------
# 2. Web Layout NEO GLOW
# ---------------------------------------------------------
if [ -f scripts/mega-web-layout-neo-glow.sh ]; then
  echo "[STEP 2] Setting up Web Layout NEO GLOW..."
  chmod +x scripts/mega-web-layout-neo-glow.sh
  ./scripts/mega-web-layout-neo-glow.sh
else
  echo "[WARN] mega-web-layout-neo-glow.sh not found."
fi

# ---------------------------------------------------------
# 3. Admin Dashboard NEO
# ---------------------------------------------------------
if [ -f scripts/mega-admin-dashboard-neo.sh ]; then
  echo "[STEP 3] Setting up Admin Dashboard NEO..."
  chmod +x scripts/mega-admin-dashboard-neo.sh
  ./scripts/mega-admin-dashboard-neo.sh
else
  echo "[WARN] mega-admin-dashboard-neo.sh not found."
fi

# ---------------------------------------------------------
# 4. Worker Console NEO
# ---------------------------------------------------------
if [ -f scripts/mega-worker-console-neo.sh ]; then
  echo "[STEP 4] Setting up Worker Console NEO..."
  chmod +x scripts/mega-worker-console-neo.sh
  ./scripts/mega-worker-console-neo.sh
else
  echo "[WARN] mega-worker-console-neo.sh not found."
fi

# ---------------------------------------------------------
# 5. Brain Console NEO
# ---------------------------------------------------------
if [ -f scripts/mega-brain-console-neo.sh ]; then
  echo "[STEP 5] Setting up Brain Console NEO..."
  chmod +x scripts/mega-brain-console-neo.sh
  ./scripts/mega-brain-console-neo.sh
else
  echo "[WARN] mega-brain-console-neo.sh not found."
fi

# ---------------------------------------------------------
# 6. Smart MEGA Brain ShellLayout Fixer
# ---------------------------------------------------------
if [ -f scripts/smart-mega-brain-shelllayout-fixer.sh ]; then
  echo "[STEP 6] Running ShellLayout Fixer..."
  chmod +x scripts/smart-mega-brain-shelllayout-fixer.sh
  ./scripts/smart-mega-brain-shelllayout-fixer.sh
else
  echo "[WARN] smart-mega-brain-shelllayout-fixer.sh not found."
fi

# ---------------------------------------------------------
# 7. Launch Admin + Web with dynamic ports
# ---------------------------------------------------------
if [ -f scripts/mega-dev-launcher.sh ]; then
  echo "[STEP 7] Launching Admin + Web..."
  chmod +x scripts/mega-dev-launcher.sh
  ./scripts/mega-dev-launcher.sh
else
  echo "[WARN] mega-dev-launcher.sh not found."
fi

echo
echo "====================================================================="
echo " MEGA NEO AUTOPILOT COMPLETE — System is glowing."
echo "====================================================================="
