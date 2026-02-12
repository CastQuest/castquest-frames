#!/usr/bin/env bash
set -e

if [[ ! -f .repo-brain/diagnosis.json ]]; then
  exit 0
fi

STATUS=$(jq -r .status .repo-brain/diagnosis.json)

[[ "$STATUS" != "green" ]] && exit 0

echo "🔒 Locking green repo"

cat <<EOF > .repo-brain/GREEN.lock
This repository is GREEN.
Do not modify:
- CI workflows
- Tests
- Lockfiles
EOF
