#!/usr/bin/env bash
set -e

TOOL="$(cat .repo-brain/solidity.tool 2>/dev/null || true)"
[[ -z "$TOOL" ]] && exit 0

echo "🔐 Normalizing Solidity CI for $TOOL"

if [[ "$TOOL" == "foundry" ]]; then
  command -v forge >/dev/null || {
    echo "⚠️ forge missing (CI must install foundry)"
    exit 0
  }
  forge test
fi

if [[ "$TOOL" == "hardhat" ]]; then
  npx hardhat compile
fi
