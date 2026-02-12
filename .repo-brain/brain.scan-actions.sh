#!/usr/bin/env bash
set -e

if [[ ! -d .github/workflows ]]; then
  echo "❌ No GitHub Actions workflows"
  exit 1
fi

grep -R "node-version\|python-version" .github/workflows || true
