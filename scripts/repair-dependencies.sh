#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# CastQuest Frames - Dependency Repair Script
# ============================================================================
# Comprehensive dependency repair and harmonization tool for the monorepo
# 
# Features:
# - Clean dependency installation
# - Version harmonization across workspace
# - Build order validation
# - Workspace link verification
# - Documentation file checks
# - Broken symlink detection
# - Package.json validation
# - Missing dependency scanning
# - Comprehensive health check
# ============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PNPM=${PNPM:-pnpm}
DRY_RUN=${DRY_RUN:-false}
VERBOSE=${VERBOSE:-false}

# Build order (dependencies first)
BUILD_ORDER=(
  "packages/neo-ux-core"
  "packages/sdk"
  "packages/core-services"
  "apps/admin"
  "apps/web"
)

# Expected dependency versions
EXPECTED_TYPESCRIPT="5.3.3"
EXPECTED_NODE_TYPES="20.10.6"
EXPECTED_NEXTJS="14.2.18"

# ============================================================================
# Logging Functions
# ============================================================================

log() {
  echo -e "${BLUE}[repair-dependencies]${NC} $*"
}

success() {
  echo -e "${GREEN}✓${NC} $*"
}

error() {
  echo -e "${RED}✗${NC} $*" >&2
}

warn() {
  echo -e "${YELLOW}⚠${NC} $*"
}

info() {
  echo -e "${CYAN}ℹ${NC} $*"
}

debug() {
  if [[ "$VERBOSE" == "true" ]]; then
    echo -e "${MAGENTA}[DEBUG]${NC} $*"
  fi
}

section() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $*${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ============================================================================
# Utility Functions
# ============================================================================

check_command() {
  if ! command -v "$1" &> /dev/null; then
    error "Required command not found: $1"
    return 1
  fi
  return 0
}

run_command() {
  debug "Running: $*"

  if [[ "$DRY_RUN" == "true" ]]; then
    info "[DRY RUN] Would run: $*"
    return 0
  fi

  "$@"
}
# ============================================================================
# Validation Functions
# ============================================================================

validate_package_json() {
  local file="$1"
  debug "Validating JSON: $file"
  
  if [[ ! -f "$file" ]]; then
    error "File not found: $file"
    return 1
  fi
  
  if ! jq empty "$file" 2>/dev/null; then
    error "Invalid JSON in: $file"
    return 1
  fi
  
  success "Valid JSON: $file"
  return 0
}

check_dependency_version() {
  local package_json="$1"
  local dep_name="$2"
  local expected_version="$3"
  
  if [[ ! -f "$package_json" ]]; then
    return 0
  fi
  
  local actual_version
  actual_version=$(jq -r ".devDependencies[\"$dep_name\"] // .dependencies[\"$dep_name\"] // \"not-found\"" "$package_json")
  
  if [[ "$actual_version" == "not-found" ]]; then
    return 0
  fi
  
  # Remove ^ and ~ prefixes for comparison
  actual_version="${actual_version#^}"
  actual_version="${actual_version#~}"
  
  if [[ "$actual_version" != "$expected_version" ]]; then
    warn "Version mismatch in $(basename $(dirname "$package_json")): $dep_name"
    info "  Expected: $expected_version"
    info "  Actual: $actual_version"
    return 1
  fi
  
  return 0
}

# ============================================================================
# Main Repair Functions
# ============================================================================

clean_dependencies() {
  section "Cleaning Dependencies"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    info "[DRY RUN] Would remove node_modules directories"
    info "[DRY RUN] Would remove pnpm-lock.yaml"
    return 0
  fi
  
  log "Removing node_modules directories..."
  find "$ROOT_DIR" -name "node_modules" -type d -prune -exec rm -rf {} + || true
  success "Removed node_modules directories"
  
  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    log "Backing up pnpm-lock.yaml..."
    cp "$ROOT_DIR/pnpm-lock.yaml" "$ROOT_DIR/pnpm-lock.yaml.backup"
    success "Created backup: pnpm-lock.yaml.backup"
  fi
  
  success "Dependency cleanup complete"
}

validate_all_package_json() {
  section "Validating package.json Files"
  
  local files_checked=0
  local files_valid=0
  local files_invalid=0
  
  while IFS= read -r -d '' file; do
    ((files_checked++))
    if validate_package_json "$file"; then
      ((files_valid++))
    else
      ((files_invalid++))
    fi
  done < <(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -print0)
  
  info "Checked: $files_checked files"
  success "Valid: $files_valid files"
  
  if [[ $files_invalid -gt 0 ]]; then
    error "Invalid: $files_invalid files"
    return 1
  fi
  
  success "All package.json files are valid"
  return 0
}

harmonize_dependency_versions() {
  section "Harmonizing Dependency Versions"
  
  local mismatches=0
  
  # Check TypeScript versions
  log "Checking TypeScript versions..."
  for pkg in apps/web apps/admin packages/neo-ux-core packages/sdk packages/core-services; do
    local pkg_json="$ROOT_DIR/$pkg/package.json"
    if ! check_dependency_version "$pkg_json" "typescript" "$EXPECTED_TYPESCRIPT"; then
      ((mismatches++))
    fi
  done
  
  # Check @types/node versions
  log "Checking @types/node versions..."
  for pkg in apps/web apps/admin packages/sdk packages/core-services; do
    local pkg_json="$ROOT_DIR/$pkg/package.json"
    if ! check_dependency_version "$pkg_json" "@types/node" "$EXPECTED_NODE_TYPES"; then
      ((mismatches++))
    fi
  done
  
  # Check Next.js versions
  log "Checking Next.js versions..."
  for pkg in apps/web apps/admin; do
    local pkg_json="$ROOT_DIR/$pkg/package.json"
    if ! check_dependency_version "$pkg_json" "next" "$EXPECTED_NEXTJS"; then
      ((mismatches++))
    fi
  done
  
  if [[ $mismatches -gt 0 ]]; then
    warn "Found $mismatches version mismatches"
    info "Please update package.json files to use consistent versions:"
    info "  TypeScript: $EXPECTED_TYPESCRIPT"
    info "  @types/node: $EXPECTED_NODE_TYPES"
    info "  Next.js: $EXPECTED_NEXTJS"
    return 1
  fi
  
  success "All dependency versions are consistent"
  return 0
}

install_dependencies() {
  section "Installing Dependencies"
  
  if ! check_command "$PNPM"; then
    error "pnpm is not installed. Please install pnpm first."
    return 1
  fi
  
  log "Installing dependencies with pnpm..."
  run_command "$PNPM install --no-frozen-lockfile"
  
  success "Dependencies installed successfully"
  return 0
}

verify_workspace_links() {
  section "Verifying Workspace Links"
  
  log "Checking workspace dependencies..."
  
  # Check if packages are properly linked
  local packages=(
    "apps/web:@castquest/neo-ux-core"
    "apps/admin:@castquest/neo-ux-core"
    "apps/admin:@castquest/sdk"
    "apps/admin:@castquest/core-services"
  )
  
  local broken_links=0
  
  for pkg_dep in "${packages[@]}"; do
    IFS=':' read -r pkg dep <<< "$pkg_dep"
    local node_modules_path="$ROOT_DIR/$pkg/node_modules/$dep"
    
    if [[ ! -L "$node_modules_path" ]] && [[ ! -d "$node_modules_path" ]]; then
      error "Missing workspace link: $pkg -> $dep"
      ((broken_links++))
    else
      debug "Verified: $pkg -> $dep"
    fi
  done
  
  if [[ $broken_links -gt 0 ]]; then
    error "Found $broken_links broken workspace links"
    return 1
  fi
  
  success "All workspace links are valid"
  return 0
}

build_packages_in_order() {
  section "Building Packages in Dependency Order"
  
  local build_failures=0
  
  for pkg in "${BUILD_ORDER[@]}"; do
    local pkg_dir="$ROOT_DIR/$pkg"
    local pkg_json="$pkg_dir/package.json"
    
    if [[ ! -f "$pkg_json" ]]; then
      warn "Skipping $pkg (package.json not found)"
      continue
    fi
    
    # Check if package has a build script
    if ! jq -e '.scripts.build' "$pkg_json" > /dev/null 2>&1; then
      info "Skipping $pkg (no build script)"
      continue
    fi
    
    log "Building $pkg..."
    
    if run_command "cd '$pkg_dir' && $PNPM build"; then
      success "Built $pkg"
    else
      error "Failed to build $pkg"
      ((build_failures++))
    fi
  done
  
  if [[ $build_failures -gt 0 ]]; then
    error "Failed to build $build_failures packages"
    return 1
  fi
  
  success "All packages built successfully"
  return 0
}

check_build_artifacts() {
  section "Checking Build Artifacts"
  
  local missing_artifacts=0
  
  for pkg in "${BUILD_ORDER[@]}"; do
    local dist_dir="$ROOT_DIR/$pkg/dist"
    local pkg_json="$ROOT_DIR/$pkg/package.json"
    
    if [[ ! -f "$pkg_json" ]]; then
      continue
    fi
    
    # Check if package has a build script
    if ! jq -e '.scripts.build' "$pkg_json" > /dev/null 2>&1; then
      continue
    fi
    
    if [[ ! -d "$dist_dir" ]]; then
      warn "Missing dist directory: $pkg"
      ((missing_artifacts++))
    else
      local file_count
      file_count=$(find "$dist_dir" -type f | wc -l)
      if [[ $file_count -eq 0 ]]; then
        warn "Empty dist directory: $pkg"
        ((missing_artifacts++))
      else
        success "Build artifacts exist: $pkg ($file_count files)"
      fi
    fi
  done
  
  if [[ $missing_artifacts -gt 0 ]]; then
    warn "Found $missing_artifacts packages with missing/empty dist directories"
    return 1
  fi
  
  success "All build artifacts are present"
  return 0
}

check_documentation_files() {
  section "Checking Documentation Files"
  
  local required_docs=(
    "README.md"
    "CONTRIBUTING.md"
    "docs/DASHBOARDS.md"
    "docs/README.md"
  )
  
  local missing_docs=0
  
  for doc in "${required_docs[@]}"; do
    if [[ ! -f "$ROOT_DIR/$doc" ]]; then
      error "Missing documentation: $doc"
      ((missing_docs++))
    else
      success "Found: $doc"
    fi
  done
  
  if [[ $missing_docs -gt 0 ]]; then
    error "Found $missing_docs missing documentation files"
    return 1
  fi
  
  success "All required documentation files exist"
  return 0
}

check_broken_symlinks() {
  section "Checking for Broken Symlinks"
  
  local broken_symlinks=0
  
  while IFS= read -r -d '' link; do
    if [[ ! -e "$link" ]]; then
      error "Broken symlink: $link"
      ((broken_symlinks++))
    fi
  done < <(find "$ROOT_DIR" -type l -not -path "*/node_modules/*" -not -path "*/.git/*" -print0 2>/dev/null)
  
  if [[ $broken_symlinks -gt 0 ]]; then
    error "Found $broken_symlinks broken symlinks"
    return 1
  fi
  
  success "No broken symlinks found"
  return 0
}

check_port_conflicts() {
  section "Checking Port Conflicts"
  
  local ports=(3000 3001 3010 4000)
  local conflicts=0
  
  for port in "${ports[@]}"; do
    if command -v lsof &> /dev/null; then
      if lsof -i:"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "Port $port is in use"
        ((conflicts++))
      else
        success "Port $port is available"
      fi
    else
      info "lsof not available, skipping port check for $port"
    fi
  done
  
  if [[ $conflicts -gt 0 ]]; then
    warn "Found $conflicts port conflicts"
    info "Run 'lsof -ti:<port> | xargs kill -9' to free ports"
    return 1
  fi
  
  success "No port conflicts detected"
  return 0
}

comprehensive_health_check() {
  section "Comprehensive Health Check"
  
  local checks_passed=0
  local checks_failed=0
  
  # Run all validation checks
  local checks=(
    "validate_all_package_json"
    "harmonize_dependency_versions"
    "verify_workspace_links"
    "check_build_artifacts"
    "check_documentation_files"
    "check_broken_symlinks"
    "check_port_conflicts"
  )
  
  for check in "${checks[@]}"; do
    if $check; then
      ((checks_passed++))
    else
      ((checks_failed++))
    fi
  done
  
  echo ""
  section "Health Check Summary"
  
  success "Passed: $checks_passed checks"
  
  if [[ $checks_failed -gt 0 ]]; then
    error "Failed: $checks_failed checks"
    return 1
  fi
  
  success "Repository health: ✅ GOOD"
  return 0
}

# ============================================================================
# Main Execution
# ============================================================================

show_usage() {
  cat <<EOF
${BLUE}CastQuest Frames - Dependency Repair Script${NC}

${CYAN}USAGE:${NC}
  ./scripts/repair-dependencies.sh [command] [options]

${CYAN}COMMANDS:${NC}
  clean              Clean all node_modules and pnpm-lock.yaml
  validate           Validate all package.json files
  harmonize          Check dependency version consistency
  install            Install dependencies with pnpm
  verify-links       Verify workspace dependency links
  build              Build all packages in dependency order
  check-artifacts    Check for build artifacts
  check-docs         Check for required documentation files
  check-symlinks     Check for broken symlinks
  check-ports        Check for port conflicts
  health             Run comprehensive health check (default)
  repair             Full repair: clean + install + build + health

${CYAN}OPTIONS:${NC}
  --dry-run          Show what would be done without executing
  --verbose          Show detailed debug output
  --help             Show this help message

${CYAN}ENVIRONMENT VARIABLES:${NC}
  DRY_RUN=true       Enable dry-run mode
  VERBOSE=true       Enable verbose logging
  PNPM=<path>        Path to pnpm binary (default: pnpm)

${CYAN}EXAMPLES:${NC}
  # Run full health check
  ./scripts/repair-dependencies.sh health

  # Full repair workflow
  ./scripts/repair-dependencies.sh repair

  # Dry run of full repair
  DRY_RUN=true ./scripts/repair-dependencies.sh repair

  # Clean and reinstall dependencies
  ./scripts/repair-dependencies.sh clean
  ./scripts/repair-dependencies.sh install

  # Build packages in order
  ./scripts/repair-dependencies.sh build

EOF
}

main() {
  local command="${1:-health}"
  
  # Parse options
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run)
        DRY_RUN=true
        shift
        ;;
      --verbose)
        VERBOSE=true
        shift
        ;;
      --help|-h)
        show_usage
        exit 0
        ;;
      *)
        command="$1"
        shift
        ;;
    esac
  done
  
  # Check prerequisites
  if ! check_command jq; then
    error "jq is required but not installed"
    exit 1
  fi
  
  log "CastQuest Frames - Dependency Repair Script"
  log "Root directory: $ROOT_DIR"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY RUN MODE - No changes will be made"
  fi
  
  # Execute command
  case "$command" in
    clean)
      clean_dependencies
      ;;
    validate)
      validate_all_package_json
      ;;
    harmonize)
      harmonize_dependency_versions
      ;;
    install)
      install_dependencies
      ;;
    verify-links)
      verify_workspace_links
      ;;
    build)
      build_packages_in_order
      ;;
    check-artifacts)
      check_build_artifacts
      ;;
    check-docs)
      check_documentation_files
      ;;
    check-symlinks)
      check_broken_symlinks
      ;;
    check-ports)
      check_port_conflicts
      ;;
    health)
      comprehensive_health_check
      ;;
    repair)
      clean_dependencies &&
      install_dependencies &&
      build_packages_in_order &&
      comprehensive_health_check
      ;;
    *)
      error "Unknown command: $command"
      show_usage
      exit 1
      ;;
  esac
  
  local exit_code=$?
  
  if [[ $exit_code -eq 0 ]]; then
    echo ""
    success "Command completed successfully: $command"
  else
    echo ""
    error "Command failed: $command"
  fi
  
  exit $exit_code
}

# Run main function
main "$@"
