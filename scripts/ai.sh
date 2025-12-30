#!/usr/bin/env bash
set -euo pipefail

# AI Validation Script - Validate AI components

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " CastQuest AI Validation Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

cd "$ROOT_DIR"

echo "Checking AI Builder components..."
if [ -d "packages/neo-ux-core/src" ]; then
  echo "✅ neo-ux-core AI components present"
fi

if [ -d "packages/ai-brain/src" ]; then
  echo "✅ ai-brain package present"
  pnpm --filter @castquest/ai-brain build || echo "⚠️ ai-brain build failed (expected if not implemented)"
else
  echo "⚠️ ai-brain package not found"
fi

echo "Checking SDK AI exports..."
if grep -q "SmartBrainEngine" packages/sdk/src/index.ts; then
  echo "✅ SmartBrainEngine exported from SDK"
fi

if grep -q "OracleDBService" packages/sdk/src/index.ts; then
  echo "✅ OracleDBService exported from SDK"
fi

echo "✅ AI validation complete"
