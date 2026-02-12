#!/usr/bin/env bash
set -e

echo "🧩 Detecting frontend framework"

FRAMEWORK=""

# Next.js
if [[ -f next.config.js || -f next.config.mjs ]]; then
  FRAMEWORK="next"
fi

# Nuxt
if [[ -f nuxt.config.js || -f nuxt.config.ts ]]; then
  FRAMEWORK="nuxt"
fi

# SvelteKit
if [[ -f svelte.config.js ]]; then
  FRAMEWORK="sveltekit"
fi

echo "$FRAMEWORK" > .repo-brain/framework.detected
echo "Framework: ${FRAMEWORK:-none}"
