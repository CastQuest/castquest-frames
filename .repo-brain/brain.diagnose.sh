#!/usr/bin/env bash
set -e

echo "🧪 Diagnosing repo health"

STATUS="green"
REASON="ok"

if [[ -f package.json ]]; then
  npm install --ignore-scripts >/dev/null 2>&1 || {
    STATUS="red"
    REASON="npm-install-failed"
  }
fi

if [[ -f pyproject.toml || -f requirements.txt ]]; then
  pytest --collect-only >/dev/null 2>&1 || {
    STATUS="red"
    REASON="pytest-collection-failed"
  }
fi

mkdir -p .repo-brain
cat <<EOF > .repo-brain/diagnosis.json
{
  "status": "$STATUS",
  "reason": "$REASON"
}
EOF

echo "Diagnosis: $STATUS ($REASON)"
