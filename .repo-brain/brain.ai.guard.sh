#!/usr/bin/env bash
set -e

echo "🤖 AI / Agent safety scan"

grep -R "eval(" . && echo "⚠️ eval detected" || true
grep -R "exec(" . && echo "⚠️ exec detected" || true
grep -R "subprocess" . && echo "⚠️ subprocess usage" || true
grep -R "openai.api_key" . && {
  echo "❌ API key hardcoded"
  exit 1
} || true
