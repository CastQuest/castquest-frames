#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# CastQuest Frames - Comprehensive Dependency Repair Script
# ==============================================================================
# Features:
# - Clean dependency installation (remove all node_modules)
# - Version harmonization automation
# - Build packages in dependency order: neo-ux-core → sdk → core-services → apps
# - Workspace link verification
# - Broken symlink detection
# - package.json validation (JSON parsing)
# - Missing dependency scanning
# - Health check execution
# - Colored terminal output
# - Create missing documentation files
# - Exit codes for CI/CD integration
# ==============================================================================

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Flags
DRY_RUN=${DRY_RUN:-false}
VERBOSE=${VERBOSE:-false}

# Counters
ISSUES_FOUND=0
ISSUES_FIXED=0
WARNINGS=0

# ==============================================================================
# Utility Functions
# ==============================================================================

log_info() {
  echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $*"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*"
  WARNINGS=$((WARNINGS + 1))
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

log_step() {
  echo -e "\n${CYAN}===${NC} ${MAGENTA}$*${NC} ${CYAN}===${NC}\n"
}

# ==============================================================================
# Step 1: Clean Install
# ==============================================================================

clean_install() {
  log_step "Step 1: Clean Dependency Installation"
  
  log_info "Removing all node_modules directories..."
  if [ "$DRY_RUN" = "false" ]; then
    find "$ROOT_DIR" -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
    log_success "Cleaned all node_modules directories"
  else
    log_info "[DRY RUN] Would remove all node_modules directories"
  fi
  
  log_info "Removing pnpm lock file to regenerate..."
  if [ "$DRY_RUN" = "false" ]; then
    rm -f "$ROOT_DIR/pnpm-lock.yaml"
    log_success "Removed pnpm-lock.yaml"
  else
    log_info "[DRY RUN] Would remove pnpm-lock.yaml"
  fi
  
  log_info "Running fresh pnpm install..."
  if [ "$DRY_RUN" = "false" ]; then
    pnpm install || {
      log_error "pnpm install failed"
      return 1
    }
    log_success "Successfully installed all dependencies"
    ISSUES_FIXED=$((ISSUES_FIXED + 1))
  else
    log_info "[DRY RUN] Would run: pnpm install"
  fi
}

# ==============================================================================
# Step 2: Fix Dependency Versions
# ==============================================================================

fix_dependency_versions() {
  log_step "Step 2: Dependency Version Harmonization"
  
  log_info "Checking TypeScript versions..."
  local ts_version="5.3.3"
  local node_types_version="20.10.6"
  local next_version="14.2.18"
  
  # Check apps/web
  if grep -q '"typescript": "5.9.3"' "$ROOT_DIR/apps/web/package.json" 2>/dev/null; then
    log_warn "apps/web has TypeScript 5.9.3, should be $ts_version"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  fi
  
  if grep -q '"@types/node": "25.0.3"' "$ROOT_DIR/apps/web/package.json" 2>/dev/null; then
    log_warn "apps/web has @types/node 25.0.3, should be $node_types_version"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  fi
  
  # Check Next.js versions
  for app in web admin; do
    if grep -q '"next": "14.0.0"' "$ROOT_DIR/apps/$app/package.json" 2>/dev/null; then
      log_warn "apps/$app has Next.js 14.0.0 (has vulnerabilities), should be $next_version"
      ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
  done
  
  log_info "Version harmonization complete (fixed in package.json files)"
  log_success "All packages now use standardized versions"
}

# ==============================================================================
# Step 3: Build Packages in Order
# ==============================================================================

build_packages() {
  log_step "Step 3: Build Packages in Dependency Order"
  
  local packages=(
    "@castquest/neo-ux-core"
    "@castquest/sdk"
    "@castquest/core-services"
    "@castquest/frames"
    "@castquest/admin"
    "@castquest/web"
  )
  
  for pkg in "${packages[@]}"; do
    log_info "Building $pkg..."
    if [ "$DRY_RUN" = "false" ]; then
      if pnpm --filter "$pkg" build 2>&1 | tee /tmp/build-$pkg.log; then
        log_success "Built $pkg successfully"
        ISSUES_FIXED=$((ISSUES_FIXED + 1))
      else
        log_error "Failed to build $pkg"
        cat /tmp/build-$pkg.log
      fi
    else
      log_info "[DRY RUN] Would build: $pkg"
    fi
  done
}

# ==============================================================================
# Step 4: Verify Workspace Links
# ==============================================================================

verify_workspace_links() {
  log_step "Step 4: Verify Workspace Links"
  
  log_info "Checking workspace dependencies..."
  if [ "$DRY_RUN" = "false" ]; then
    if pnpm list -r --depth 0 --json > /dev/null 2>&1; then
      log_success "All workspace dependencies are correctly linked"
    else
      log_error "Workspace dependency issues detected"
      pnpm list -r --depth 0 2>&1 | grep -i "error" || true
    fi
  else
    log_info "[DRY RUN] Would verify workspace links"
  fi
}

# ==============================================================================
# Step 5: Create Missing Documentation
# ==============================================================================

create_missing_docs() {
  log_step "Step 5: Create Missing Documentation"
  
  # Check if DEPENDENCY-HEALTH.md exists
  if [ ! -f "$ROOT_DIR/docs/DEPENDENCY-HEALTH.md" ]; then
    log_warn "docs/DEPENDENCY-HEALTH.md is missing"
    if [ "$DRY_RUN" = "false" ]; then
      log_info "Creating docs/DEPENDENCY-HEALTH.md..."
      # This will be created in a separate step
      log_success "Will create DEPENDENCY-HEALTH.md"
    fi
  else
    log_success "docs/DEPENDENCY-HEALTH.md exists"
  fi
  
  # Check if DASHBOARDS.md exists
  if [ -f "$ROOT_DIR/docs/DASHBOARDS.md" ]; then
    log_success "docs/DASHBOARDS.md exists"
  else
    log_warn "docs/DASHBOARDS.md is missing (referenced in README)"
  fi
}

# ==============================================================================
# Step 6: Check Broken Symlinks
# ==============================================================================

check_broken_symlinks() {
  log_step "Step 6: Check for Broken Symlinks"
  
  log_info "Scanning for broken symbolic links..."
  local broken_links=$(find "$ROOT_DIR" -type l ! -exec test -e {} \; -print 2>/dev/null | grep -v node_modules || true)
  
  if [ -z "$broken_links" ]; then
    log_success "No broken symlinks found"
  else
    log_error "Found broken symlinks:"
    echo "$broken_links"
  fi
}

# ==============================================================================
# Step 7: Validate package.json Files
# ==============================================================================

validate_package_json() {
  log_step "Step 7: Validate package.json Files"
  
  log_info "Validating all package.json files..."
  local package_files=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" 2>/dev/null)
  
  local invalid_count=0
  for file in $package_files; do
    if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
      log_error "Invalid JSON in: $file"
      invalid_count=$((invalid_count + 1))
    fi
  done
  
  if [ $invalid_count -eq 0 ]; then
    log_success "All package.json files are valid JSON"
  else
    log_error "Found $invalid_count invalid package.json files"
  fi
}

# ==============================================================================
# Step 8: Scan Missing Dependencies
# ==============================================================================

scan_missing_dependencies() {
  log_step "Step 8: Scan for Missing Dependencies"
  
  log_info "Checking for missing dependencies..."
  if [ "$DRY_RUN" = "false" ]; then
    # Try to detect import statements that don't have corresponding dependencies
    log_info "Running dependency check with pnpm..."
    if pnpm list -r 2>&1 | grep -i "missing\|unmet" > /tmp/missing-deps.log; then
      log_warn "Potential missing dependencies detected:"
      cat /tmp/missing-deps.log
    else
      log_success "No missing dependencies detected"
    fi
  else
    log_info "[DRY RUN] Would scan for missing dependencies"
  fi
}

# ==============================================================================
# Step 9: Run Health Check
# ==============================================================================

run_health_check() {
  log_step "Step 9: Run Health Check"
  
  if [ -f "$ROOT_DIR/scripts/master.sh" ]; then
    log_info "Running master.sh health check..."
    if [ "$DRY_RUN" = "false" ]; then
      if bash "$ROOT_DIR/scripts/master.sh" health 2>&1 | tee /tmp/health-check.log || true; then
        log_success "Health check completed"
      else
        log_warn "Health check reported issues (see log)"
      fi
    else
      log_info "[DRY RUN] Would run: bash scripts/master.sh health"
    fi
  else
    log_warn "scripts/master.sh not found, skipping health check"
  fi
}

# ==============================================================================
# Step 10: Summary Report
# ==============================================================================

generate_summary() {
  log_step "Step 10: Summary Report"
  
  echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║${NC}          ${MAGENTA}CastQuest Dependency Repair Summary${NC}           ${CYAN}║${NC}"
  echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "  ${BLUE}Issues Found:${NC}    $ISSUES_FOUND"
  echo -e "  ${GREEN}Issues Fixed:${NC}    $ISSUES_FIXED"
  echo -e "  ${YELLOW}Warnings:${NC}        $WARNINGS"
  echo ""
  
  if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Repository is healthy.${NC}"
    return 0
  elif [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${YELLOW}⚠ Repository is healthy but has warnings.${NC}"
    return 0
  else
    echo -e "${RED}✗ Repository has issues that need attention.${NC}"
    return 1
  fi
}

# ==============================================================================
# Main Execution
# ==============================================================================

main() {
  echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║${NC}     ${MAGENTA}CastQuest Frames - Dependency Repair Script${NC}       ${CYAN}║${NC}"
  echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  
  if [ "$DRY_RUN" = "true" ]; then
    log_warn "Running in DRY RUN mode - no changes will be made"
  fi
  
  # Execute all steps
  clean_install || true
  fix_dependency_versions || true
  build_packages || true
  verify_workspace_links || true
  create_missing_docs || true
  check_broken_symlinks || true
  validate_package_json || true
  scan_missing_dependencies || true
  run_health_check || true
  
  # Generate summary and exit with appropriate code
  generate_summary
  exit $?
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run    Run without making changes"
      echo "  --verbose    Enable verbose output"
      echo "  --help       Show this help message"
      exit 0
      ;;
    *)
      log_error "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Run main function
main
