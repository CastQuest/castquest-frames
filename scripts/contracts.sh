#!/usr/bin/env bash
set -euo pipefail

# Contracts Build Script - Foundry workflow

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/packages/contracts"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest Contracts Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

cd "$CONTRACTS_DIR"

if command -v forge &> /dev/null; then
  echo "Installing Foundry dependencies..."
  forge install || echo "⚠️ Forge install skipped"
  
  echo "Compiling contracts..."
  forge build
  
  echo "Running tests..."
  forge test -vv
  
  echo "✅ Contracts workflow complete"
else
  echo "⚠️ Foundry not installed - skipping contract operations"
  echo "Install Foundry: curl -L https://foundry.paradigm.xyz | bash"
fi
