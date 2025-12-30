#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " MEGA COMMIT & PUSH AUTOPILOT — Sovereign Git Ritual"
echo "====================================================================="

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[INFO] Repo root: $ROOT"

# ---------------------------------------------------------
# Detect current branch
# ---------------------------------------------------------
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "[INFO] Current branch: $BRANCH"

# ---------------------------------------------------------
# Stage everything
# ---------------------------------------------------------
echo "[STEP 1] Staging all changes..."
git add -A

# ---------------------------------------------------------
# Check if anything changed
# ---------------------------------------------------------
if git diff --cached --quiet; then
  echo "[OK] No changes to commit. Working tree is clean."
  exit 0
fi

# ---------------------------------------------------------
# Create commit message with timestamp
# ---------------------------------------------------------
TS="$(date +"%Y-%m-%d %H:%M:%S")"
COMMIT_MSG="MEGA NEO GLOW Autopilot Commit — $TS"

echo "[STEP 2] Committing changes..."
git commit -m "$COMMIT_MSG"

# ---------------------------------------------------------
# Push to branch
# ---------------------------------------------------------
echo "[STEP 3] Pushing to $BRANCH..."
git push origin "$BRANCH"

# ---------------------------------------------------------
# Optional auto-tag
# ---------------------------------------------------------
TAG="neo-$(date +"%Y%m%d-%H%M%S")"

echo "[STEP 4] Creating optional tag: $TAG"
git tag -a "$TAG" -m "MEGA NEO GLOW Autopilot Tag"
git push origin "$TAG"

echo "====================================================================="
echo " MEGA COMMIT & PUSH AUTOPILOT COMPLETE"
echo " Branch: $BRANCH"
echo " Tag:    $TAG"
echo "====================================================================="
