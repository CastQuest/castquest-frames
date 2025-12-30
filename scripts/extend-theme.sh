#!/usr/bin/env bash
set -euo pipefail

KEY="$1"
VALUE="$2"

if [ -z "$KEY" ] || [ -z "$VALUE" ]; then
  echo "Usage: ./extend-theme.sh key \"value\""
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEME="$ROOT/packages/neo-ux-core/src/theme.ts"

sed -i "/glow: {/a \ \ \ \ $KEY: \"$VALUE\"," "$THEME"

cd "$ROOT/packages/neo-ux-core"
pnpm build

echo "Theme extended: $KEY = $VALUE"
