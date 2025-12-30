#!/usr/bin/env bash
set -e

echo "=== CastQuest Sovereign Dev Setup ==="

sudo apt-get update -y
sudo apt-get install -y curl build-essential pkg-config libssl-dev git unzip

echo "=== Installing PNPM ==="
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PATH="/home/vscode/.local/share/pnpm:$PATH"

echo "=== Installing Solana CLI ==="
curl -sSfL https://release.solana.com/stable/install | sh -s - v1.18.0 || true
export PATH="/home/vscode/.local/share/solana/install/active_release/bin:$PATH"

echo "=== Installing Foundry ==="
curl -L https://foundry.paradigm.xyz | bash || true
/home/vscode/.foundry/bin/foundryup || true

echo "=== Installing Turborepo ==="
npm install -g turbo

echo "=== Installing Zora SDK ==="
npm install -g @zoralabs/zdk

echo "=== Installing workspace dependencies ==="
pnpm install --recursive

echo "=== Setup complete ==="