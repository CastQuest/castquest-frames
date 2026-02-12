#!/usr/bin/env bash
set -e

echo "🔍 Detecting stack"

STACK=()

[[ -f package.json ]] && STACK+=("node")
[[ -f pyproject.toml || -f requirements.txt ]] && STACK+=("python")
[[ -f composer.json ]] && STACK+=("php")
[[ -f Cargo.toml ]] && STACK+=("rust")
[[ -d contracts || -f foundry.toml ]] && STACK+=("solidity")

printf "%s\n" "${STACK[@]}" > .repo-brain/stack.detected

echo "Detected: ${STACK[*]}"
