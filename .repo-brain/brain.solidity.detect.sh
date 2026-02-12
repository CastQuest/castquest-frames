#!/usr/bin/env bash
set -e

if [[ -f foundry.toml ]]; then
  echo "foundry" > .repo-brain/solidity.tool
elif [[ -f hardhat.config.js || -f hardhat.config.ts ]]; then
  echo "hardhat" > .repo-brain/solidity.tool
else
  exit 0
fi

echo "🧱 Solidity tool: $(cat .repo-brain/solidity.tool)"
