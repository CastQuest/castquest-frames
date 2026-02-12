#!/usr/bin/env bash
set -e

FRAMEWORK="$(cat .repo-brain/framework.detected 2>/dev/null || true)"

[[ -z "$FRAMEWORK" ]] && exit 0

echo "⚙️ Applying CI normalization for $FRAMEWORK"

# Ensure build output exists for CI
if [[ "$FRAMEWORK" == "next" ]]; then
  jq '.scripts.build //= "next build"' package.json > tmp && mv tmp package.json
fi

if [[ "$FRAMEWORK" == "nuxt" ]]; then
  jq '.scripts.build //= "nuxt build"' package.json > tmp && mv tmp package.json
fi

if [[ "$FRAMEWORK" == "sveltekit" ]]; then
  jq '.scripts.build //= "vite build"' package.json > tmp && mv tmp package.json
fi
