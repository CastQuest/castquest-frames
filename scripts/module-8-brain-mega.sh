#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> CastQuest Module 8 MEGA — Smart Brain Runtime Engine"
echo "Root: $ROOT_DIR"

cd "$ROOT_DIR"

mkdir -p \
  "apps/admin/app/brain" \
  "apps/admin/app/api/brain/generate-frame" \
  "apps/admin/app/api/brain/validate-frame" \
  "apps/admin/app/api/brain/strategy-insights" \
  "data"

if [ ! -f "data/brain-events.json" ]; then
  echo "[]" > "data/brain-events.json"
  echo "Created data/brain-events.json"
fi

if [ ! -f "data/brain-suggestions.json" ]; then
  echo "[]" > "data/brain-suggestions.json"
  echo "Created data/brain-suggestions.json"
fi

echo "==> Module 8 MEGA scaffolded."
echo "Remember to add Smart Brain links in apps/admin ShellLayout if needed."