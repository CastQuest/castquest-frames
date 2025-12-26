#!/usr/bin/env bash
set -e

echo "=== CastQuest Sovereign Dev Setup ==="

# Update system
sudo apt-get update -y
sudo apt-get install -y curl build-essential pkg-config libssl-dev git unzip

echo "=== Installing Solana CLI ==="
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

echo "=== Installing Foundry (forge + cast) ==="
curl -L https://foundry.paradigm.xyz | bash
~/.foundry/bin/foundryup

echo "=== Installing Turborepo ==="
npm install -g turbo

echo "=== Installing Zora SDK ==="
npm install -g @zoralabs/zdk

echo "=== Installing workspace dependencies ==="
pnpm install --recursive

echo "=== Setup complete ==="