#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# MEGA SCRIPT TRACKER
# Automatically detect, validate, and track new shell scripts
# Part of CastQuest Protocol Automation System
###############################################################################

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$ROOT/scripts"

echo "=============================================================="
echo " MEGA SCRIPT TRACKER — Automation System"
echo "=============================================================="
echo "Root: $ROOT"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ ERROR: Not in a git repository"
  exit 1
fi

cd "$ROOT"

# Find all untracked shell scripts
echo "🔍 Scanning for untracked scripts..."
NEW_SCRIPTS=$(git status --porcelain | grep "^??" | grep "scripts/.*\.sh$" | awk '{print $2}' || true)

if [ -z "$NEW_SCRIPTS" ]; then
  echo "✅ No new scripts to track"
  echo ""
  echo "📊 Current tracked scripts:"
  git ls-files scripts/*.sh | wc -l | xargs echo "   Total:"
  exit 0
fi

SCRIPT_COUNT=$(echo "$NEW_SCRIPTS" | wc -l)
echo "📝 Found $SCRIPT_COUNT new script(s):"
echo ""

# Validate and catalog each script
VALID_SCRIPTS=()
INVALID_SCRIPTS=()

while IFS= read -r script; do
  if [ ! -f "$script" ]; then
    continue
  fi
  
  echo "  ▸ $script"
  
  # Check if file is executable
  if [ ! -x "$script" ]; then
    echo "    ⚠️  Not executable - making executable"
    chmod +x "$script"
  fi
  
  # Validate shebang
  SHEBANG=$(head -n 1 "$script")
  if [[ ! "$SHEBANG" =~ ^#!.*bash ]] && [[ ! "$SHEBANG" =~ ^#!.*sh ]]; then
    echo "    ⚠️  Missing or invalid shebang"
    INVALID_SCRIPTS+=("$script")
  else
    VALID_SCRIPTS+=("$script")
  fi
  
  # Check for basic structure
  if grep -q "set -e" "$script" || grep -q "set -euo pipefail" "$script"; then
    echo "    ✓ Has error handling"
  else
    echo "    ⚠️  Missing 'set -e' error handling"
  fi
  
  # Extract description if available
  DESC=$(grep -m 1 "^#.*[Dd]escription\|^#.*MEGA\|^echo.*===" "$script" | sed 's/^#\s*//' | sed 's/echo\s*"//' | sed 's/"$//' | head -1 || echo "")
  if [ -n "$DESC" ]; then
    echo "    📄 $DESC"
  fi
  
  echo ""
done <<< "$NEW_SCRIPTS"

# Report validation results
echo "=============================================================="
echo "📊 Validation Summary:"
echo "   Valid scripts:   ${#VALID_SCRIPTS[@]}"
echo "   Invalid scripts: ${#INVALID_SCRIPTS[@]}"
echo ""

if [ ${#INVALID_SCRIPTS[@]} -gt 0 ]; then
  echo "⚠️  Scripts with issues:"
  for script in "${INVALID_SCRIPTS[@]}"; do
    echo "   - $script"
  done
  echo ""
fi

# Auto-track option
if [ "${1:-}" = "--auto-track" ] || [ "${1:-}" = "-a" ]; then
  echo "🔧 Auto-tracking enabled..."
  
  if [ ${#VALID_SCRIPTS[@]} -gt 0 ]; then
    echo "📦 Adding valid scripts to git:"
    for script in "${VALID_SCRIPTS[@]}"; do
      git add "$script"
      echo "   ✓ $script"
    done
    
    echo ""
    echo "✅ ${#VALID_SCRIPTS[@]} script(s) staged for commit"
    echo ""
    echo "Next steps:"
    echo "  git commit -m 'feat: Add automation scripts'"
    echo "  git push origin master"
  else
    echo "⚠️  No valid scripts to track"
  fi
  
  if [ ${#INVALID_SCRIPTS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Fix invalid scripts before tracking:"
    for script in "${INVALID_SCRIPTS[@]}"; do
      echo "   - Add shebang: #!/usr/bin/env bash"
      echo "   - Add safety: set -euo pipefail"
      echo "   - File: $script"
    done
  fi
else
  echo "�� Run with --auto-track to automatically stage valid scripts"
  echo "   Example: ./scripts/mega-script-tracker.sh --auto-track"
fi

echo ""
echo "=============================================================="
echo "✅ Script tracking analysis complete"
echo "=============================================================="
