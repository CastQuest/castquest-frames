#!/usr/bin/env bash
set -e

echo "🩹 Applying safe fixes"

if git diff --quiet; then
  echo "No fixes needed"
else
  git add .
fi
