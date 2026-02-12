#!/usr/bin/env bash
set -e

echo "✅ Verifying build & tests"

if [[ -f package.json ]]; then
  if jq -e '.scripts.build' package.json >/dev/null; then
    npm run build
  fi
  if jq -e '.scripts.test' package.json >/dev/null; then
    npm test
  fi
elif [[ -f pyproject.toml || -f requirements.txt ]]; then
  pytest
elif [[ -f Cargo.toml ]]; then
  cargo test
fi
