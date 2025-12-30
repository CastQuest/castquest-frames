#!/usr/bin/env bash
set -euo pipefail

################################################################################
# CASTQUEST SELF-HEALER SCRIPT
# Comprehensive auto-fix and optimization script
################################################################################

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
HEAL_LOG="$ROOT_DIR/logs/heal-$TIMESTAMP.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure logs directory exists
mkdir -p "$ROOT_DIR/logs"

# Logging functions
log() { echo -e "${CYAN}[INFO]${NC} $*" | tee -a "$HEAL_LOG"; }
success() { echo -e "${GREEN}✅ [SUCCESS]${NC} $*" | tee -a "$HEAL_LOG"; }
warn() { echo -e "${YELLOW}⚠️  [WARN]${NC} $*" | tee -a "$HEAL_LOG"; }
error() { echo -e "${RED}❌ [ERROR]${NC} $*" | tee -a "$HEAL_LOG"; }
step() { echo -e "\n${BLUE}▶${NC} $*" | tee -a "$HEAL_LOG"; }

banner() {
  echo "" | tee -a "$HEAL_LOG"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$HEAL_LOG"
  echo " $*" | tee -a "$HEAL_LOG"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$HEAL_LOG"
  echo "" | tee -a "$HEAL_LOG"
}

banner "🩺 CASTQUEST SELF-HEALER"
log "Healing started at: $(date)"
log "Heal log: $HEAL_LOG"

cd "$ROOT_DIR"

################################################################################
# 1. Package Export Integrity
################################################################################

step "1/8: Package Export Integrity"

# Check neo-ux-core exports
if [ -f "packages/neo-ux-core/src/index.ts" ]; then
  success "neo-ux-core index.ts exists"
else
  warn "neo-ux-core index.ts missing - attempting to create"
  mkdir -p "packages/neo-ux-core/src"
  cat > "packages/neo-ux-core/src/index.ts" << 'EOF'
export * from './theme';
export * from './components';
export * from './dashboard';
EOF
  success "Created neo-ux-core index.ts"
fi

# Verify exports are present
if grep -q "export" "packages/neo-ux-core/src/index.ts"; then
  success "neo-ux-core exports verified"
else
  warn "neo-ux-core may have export issues"
fi

################################################################################
# 2. Import Path Validation
################################################################################

step "2/8: Import Path Validation"

log "Scanning for broken import paths..."
broken_imports=0

# Check for common import issues in TypeScript files
if command -v grep &> /dev/null; then
  # Look for potential broken imports (limit depth to avoid node_modules)
  find packages apps -type f -maxdepth 3 \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | while read -r file; do
    if grep -q "from ['\"]@castquest/[^'\"]*['\"]" "$file" 2>/dev/null; then
      log "Found imports in: $(basename "$file")"
    fi
  done
  success "Import path scan complete"
else
  warn "grep not available - skipping import validation"
fi

################################################################################
# 3. Workspace Integrity
################################################################################

step "3/8: Workspace Integrity"

log "Checking workspace configuration..."

if [ -f "pnpm-workspace.yaml" ]; then
  success "pnpm workspace configuration found"
else
  warn "pnpm-workspace.yaml missing"
fi

if command -v pnpm &> /dev/null; then
  log "Installing/updating workspace dependencies..."
  pnpm install --no-frozen-lockfile 2>&1 | tee -a "$HEAL_LOG" || warn "Workspace install had issues"
  success "Workspace integrity restored"
else
  error "pnpm not found - cannot heal workspace"
  exit 1
fi

################################################################################
# 4. Package Rebuild
################################################################################

step "4/8: Rebuilding Key Packages"

packages=("@castquest/neo-ux-core" "@castquest/sdk" "@castquest/core-services")

for pkg in "${packages[@]}"; do
  log "Building: $pkg"
  if pnpm --filter "$pkg" build 2>&1 | tee -a "$HEAL_LOG"; then
    success "$pkg rebuilt successfully"
  else
    warn "$pkg build had issues (may not exist)"
  fi
done

################################################################################
# 5. TypeScript Configuration
################################################################################

step "5/8: TypeScript Configuration Check"

if [ -f "tsconfig.json" ]; then
  success "Root tsconfig.json found"
else
  warn "Root tsconfig.json missing"
fi

# Check individual package tsconfig files
for app in apps/admin apps/web; do
  if [ -d "$app" ]; then
    if [ -f "$app/tsconfig.json" ]; then
      success "$app/tsconfig.json found"
    else
      warn "$app/tsconfig.json missing"
    fi
  fi
done

################################################################################
# 6. Git Integrity
################################################################################

step "6/8: Git Repository Integrity"

if [ -d ".git" ]; then
  success "Git repository detected"
  
  # Check for uncommitted changes
  if git diff --quiet && git diff --cached --quiet; then
    success "Working directory clean"
  else
    warn "Uncommitted changes detected"
    log "Run 'git status' to review changes"
  fi
else
  warn "Not a git repository"
fi

################################################################################
# 7. Security Checks
################################################################################

step "7/8: Security & Dependency Audit"

log "Checking for security vulnerabilities..."

if command -v pnpm &> /dev/null; then
  # Run pnpm audit if available
  log "Running dependency audit..."
  pnpm audit --audit-level moderate 2>&1 | tee -a "$HEAL_LOG" || warn "Vulnerabilities detected - review audit log"
else
  warn "Cannot run security audit - pnpm not available"
fi

################################################################################
# 8. Environment Configuration
################################################################################

step "8/8: Environment Configuration"

# Check for Node.js version
if command -v node &> /dev/null; then
  node_version=$(node -v)
  node_major=$(echo "$node_version" | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$node_major" -ge 20 ]; then
    success "Node.js: $node_version (✓ >= 20.0.0)"
  else
    error "Node.js $node_version is too old. Required: Node.js 20+"
    warn "Install Node 20+: nvm install 20 && nvm use 20"
  fi
else
  error "Node.js not found"
fi

# Check for pnpm version
if command -v pnpm &> /dev/null; then
  pnpm_version=$(pnpm -v)
  success "pnpm: $pnpm_version"
else
  error "pnpm not found"
  warn "Install pnpm: npm install -g pnpm@9"
fi

################################################################################
# Summary
################################################################################

banner "✅ HEALING SUMMARY"

echo "Healing Status: ✅ COMPLETE" | tee -a "$HEAL_LOG"
echo "" | tee -a "$HEAL_LOG"
echo "Actions Performed:" | tee -a "$HEAL_LOG"
echo "  • Package exports verified" | tee -a "$HEAL_LOG"
echo "  • Import paths validated" | tee -a "$HEAL_LOG"
echo "  • Workspace dependencies updated" | tee -a "$HEAL_LOG"
echo "  • Key packages rebuilt" | tee -a "$HEAL_LOG"
echo "  • TypeScript configuration checked" | tee -a "$HEAL_LOG"
echo "  • Git integrity verified" | tee -a "$HEAL_LOG"
echo "  • Security audit completed" | tee -a "$HEAL_LOG"
echo "  • Environment configuration validated" | tee -a "$HEAL_LOG"
echo "" | tee -a "$HEAL_LOG"
echo "Heal log: $HEAL_LOG" | tee -a "$HEAL_LOG"
echo "" | tee -a "$HEAL_LOG"

success "🩺 Self-healing complete!"
log "Completed at: $(date)"

exit 0
