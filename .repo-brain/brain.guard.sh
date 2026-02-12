#!/usr/bin/env bash
set -e

echo "🛡 Installing guardrails"

mkdir -p .github

cat <<EOF > .github/copilot-instructions.md
- CI workflows are authoritative
- Tests define behavior
- Do not upgrade dependencies
- Do not refactor architecture
- Minimal diffs only
EOF
