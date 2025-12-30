#!/usr/bin/env bash
set -euo pipefail

echo "====================================================================="
echo " CastQuest Protocol Integrity Scanner MEGA"
echo "====================================================================="
echo

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Root directory: $ROOT_DIR"
echo

ISSUES=0

mark_issue() {
  local msg="$1"
  echo "  [ISSUE] $msg"
  ISSUES=$((ISSUES + 1))
}

mark_ok() {
  local msg="$1"
  echo "  [OK]    $msg"
}

# ----------------------------------------
# 1. Repo structure
# ----------------------------------------
echo "==> Checking repo structure..."

REQ_DIRS=(
  "apps"
  "apps/admin"
  "apps/admin/app"
  "apps/web"
  "packages"
  "data"
  "docs"
  "scripts"
)

for d in "${REQ_DIRS[@]}"; do
  if [ -d "$d" ]; then
    mark_ok "Directory present: $d"
  else
    mark_issue "Missing directory: $d"
  fi
done

echo

# ----------------------------------------
# 2. Core JSON data surfaces
# ----------------------------------------
echo "==> Checking core JSON data surfaces..."

REQ_JSON=(
  "data/frames.json"
  "data/mints.json"
  "data/mint-events.json"
  "data/worker-events.json"
  "data/quests.json"
  "data/quest-progress.json"
  "data/quest-rewards.json"
  "data/quest-steps.json"
  "data/brain-events.json"
  "data/brain-suggestions.json"
)

for f in "${REQ_JSON[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "JSON present: $f"
  else
    mark_issue "Missing JSON file: $f"
  fi
done

echo

# ----------------------------------------
# 3. Admin UI surfaces
# ----------------------------------------
echo "==> Checking admin UI surfaces..."

REQ_ADMIN_PAGES=(
  "apps/admin/app/page.tsx"
  "apps/admin/app/ShellLayout.tsx"
  "apps/admin/app/brain/page.tsx"
  "apps/admin/app/quests/page.tsx"
  "apps/admin/app/mints/page.tsx"
  "apps/admin/app/frames/[id]/page.tsx"
  "apps/admin/app/mints/[id]/page.tsx"
  "apps/admin/app/strategy/page.tsx"
  "apps/admin/app/quests/[id]/page.tsx"
)

for f in "${REQ_ADMIN_PAGES[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "Admin surface present: $f"
  else
    mark_issue "Missing admin surface: $f"
  fi
done

echo

# ----------------------------------------
# 4. Brain & Worker APIs
# ----------------------------------------
echo "==> Checking Brain & Worker API routes..."

REQ_API=(
  "apps/admin/app/api/brain/generate-frame/route.ts"
  "apps/admin/app/api/brain/validate-frame/route.ts"
  "apps/admin/app/api/brain/strategy-insights/route.ts"
  "apps/admin/app/api/strategy/worker/run/route.ts"
  "apps/admin/app/api/strategy/worker/scan/route.ts"
  "apps/admin/app/api/strategy/logs/route.ts"
)

for f in "${REQ_API[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "API present: $f"
  else
    mark_issue "Missing API route: $f"
  fi
done

echo

# ----------------------------------------
# 5. BASE mock APIs
# ----------------------------------------
echo "==> Checking BASE mock onchain APIs..."

REQ_BASE_API=(
  "apps/admin/app/api/base/mint/route.ts"
  "apps/admin/app/api/base/frame/route.ts"
  "apps/admin/app/api/base/token-info/route.ts"
  "apps/admin/app/api/base/tx-status/route.ts"
)

for f in "${REQ_BASE_API[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "BASE API present: $f"
  else
    mark_issue "Missing BASE API route: $f"
  fi
done

echo

# ----------------------------------------
# 6. Quest APIs
# ----------------------------------------
echo "==> Checking Quest Engine APIs..."

REQ_QUEST_API=(
  "apps/admin/app/api/quests/create/route.ts"
  "apps/admin/app/api/quests/add-step/route.ts"
  "apps/admin/app/api/quests/add-reward/route.ts"
  "apps/admin/app/api/quests/progress/route.ts"
  "apps/admin/app/api/quests/complete/route.ts"
  "apps/admin/app/api/quests/trigger/route.ts"
)

for f in "${REQ_QUEST_API[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "Quest API present: $f"
  else
    mark_issue "Missing Quest API route: $f"
  fi
done

echo

# ----------------------------------------
# 7. Mint / Frames APIs & FS utils
# ----------------------------------------
echo "==> Checking Mint / Frames APIs..."

REQ_MINT_API=(
  "apps/admin/app/api/mints/create/route.ts"
  "apps/admin/app/api/mints/simulate/route.ts"
  "apps/admin/app/api/mints/claim/route.ts"
  "apps/admin/app/api/mints/attach-to-frame/route.ts"
  "apps/admin/app/api/mints/attach-to-quest/route.ts"
  "apps/admin/app/api/frames/render/route.ts"
)

for f in "${REQ_MINT_API[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "Mint/Frame API present: $f"
  else
    mark_issue "Missing Mint/Frame API route: $f"
  fi
done

if [ -f "apps/admin/app/api/mints/fs-mints.ts" ] || [ -f "apps/admin/app/api/fs-mints.ts" ] || [ -f "fs-mints.ts" ]; then
  mark_ok "fs-mints helper present (somewhere)"
else
  mark_issue "fs-mints helper not found (expected for mint APIs)"
fi

echo

# ----------------------------------------
# 8. Docs integrity
# ----------------------------------------
echo "==> Checking docs integrity..."

REQ_DOCS=(
  "docs/architecture.md"
  "docs/index.md"
  "docs/README.md"
  "docs/CONTRIBUTING.md"
  "docs/modules.md"
  "docs/flows.md"
  "docs/contributor-cards.md"
  "docs/sdk/smart-brain.md"
)

for f in "${REQ_DOCS[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "Doc present: $f"
  else
    mark_issue "Missing doc: $f"
  fi
done

echo

# ----------------------------------------
# 9. MEGA scripts presence
# ----------------------------------------
echo "==> Checking MEGA scripts presence..."

REQ_MEGA=(
  "scripts/module-4-mega.sh"
  "scripts/module-5-quests-mega.sh"
  "scripts/module-7-mega-engine.sh"
  "scripts/module-8-brain-mega.sh"
  "scripts/module-admin-mega.sh"
  "scripts/castquest-mega-selfheal.sh"
  "scripts/protocol-integrity-mega.sh"
)

for f in "${REQ_MEGA[@]}"; do
  if [ -f "$f" ]; then
    mark_ok "MEGA script present: $f"
  else
    mark_issue "Missing MEGA script: $f"
  fi
done

echo

# ----------------------------------------
# 10. Quick git cleanliness check
# ----------------------------------------
echo "==> Checking git working directory..."

if git diff --quiet && git diff --cached --quiet; then
  mark_ok "Git workspace clean (no unstaged or staged changes)."
else
  mark_issue "Git workspace has changes (run: git status)."
fi

echo

# ----------------------------------------
# Summary
# ----------------------------------------
echo "====================================================================="
echo " Protocol Integrity Summary"
echo "====================================================================="
echo "Issues found: $ISSUES"
echo

if [ "$ISSUES" -eq 0 ]; then
  echo "[PASS] Protocol spine looks consistent. No blocking issues detected."
  exit 0
else
  echo "[WARN] Protocol integrity has issues. Review [ISSUE] lines above."
  echo "       This script is non-destructive — nothing was modified."
  exit 1
fi
