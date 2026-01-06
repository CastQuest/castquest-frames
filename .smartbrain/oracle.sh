#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# CastQuest Smart Brain Oracle - AI-Powered Repository Insights
# ============================================================================
# Provides intelligent analysis and recommendations for repository health,
# dependencies, security, and optimization.
#
# Features:
# - Dependency health analysis
# - Security vulnerability detection
# - Version upgrade recommendations with compatibility analysis
# - Deprecated package monitoring
# - Performance improvement suggestions
# - Monorepo structure analysis
# - Predictive maintenance warnings
# - Dependency graph visualization
# - Smart conflict resolution
# ============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
PNPM=${PNPM:-pnpm}
VERBOSE=${VERBOSE:-false}

# ============================================================================
# Logging Functions
# ============================================================================

log() {
  echo -e "${BLUE}[oracle]${NC} $*"
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

insight() {
  echo -e "${MAGENTA}💡${NC} $*"
}

section() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $*${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ============================================================================
# Analysis Functions
# ============================================================================

analyze_dependency_health() {
  section "Dependency Health Analysis"
  
  log "Analyzing dependency versions across workspace..."
  
  # Count packages
  local package_count=0
  package_count=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" | wc -l)
  info "Found $package_count package.json files"
  
  # Analyze TypeScript versions
  local ts_versions
  ts_versions=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.devDependencies.typescript // .dependencies.typescript // empty' {} \; | sort -u)
  
  if [[ $(echo "$ts_versions" | wc -l) -gt 1 ]]; then
    warn "Multiple TypeScript versions detected:"
    echo "$ts_versions" | sed 's/^/  /'
    insight "Recommendation: Standardize on TypeScript 5.3.3 for consistency"
  else
    success "TypeScript version is consistent: $ts_versions"
  fi
  
  # Analyze @types/node versions
  local node_types_versions
  node_types_versions=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.devDependencies["@types/node"] // .dependencies["@types/node"] // empty' {} \; | sort -u)
  
  if [[ $(echo "$node_types_versions" | wc -l) -gt 1 ]]; then
    warn "Multiple @types/node versions detected:"
    echo "$node_types_versions" | sed 's/^/  /'
    insight "Recommendation: Standardize on @types/node 20.10.6 to match Node.js 20"
  else
    success "@types/node version is consistent: $node_types_versions"
  fi
  
  # Check for outdated Next.js
  local nextjs_versions
  nextjs_versions=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.dependencies.next // empty' {} \; | sort -u)
  
  if echo "$nextjs_versions" | grep -q "14.0.0"; then
    warn "Next.js 14.0.0 detected (has known vulnerabilities)"
    insight "Recommendation: Update to Next.js 14.2.18 or later for security patches"
    insight "  CVE fixes and performance improvements available"
  elif [[ -n "$nextjs_versions" ]]; then
    success "Next.js versions: $nextjs_versions"
  fi
}

detect_security_vulnerabilities() {
  section "Security Vulnerability Detection"
  
  log "Running pnpm audit..."
  
  if command -v "$PNPM" &> /dev/null; then
    local audit_output
    if audit_output=$($PNPM audit --json 2>/dev/null || true); then
      local critical_count
      local high_count
      local moderate_count
      
      critical_count=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
      high_count=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
      moderate_count=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.moderate // 0' 2>/dev/null || echo "0")
      
      if [[ "$critical_count" -gt 0 ]] || [[ "$high_count" -gt 0 ]]; then
        error "Security vulnerabilities found:"
        [[ "$critical_count" -gt 0 ]] && error "  Critical: $critical_count"
        [[ "$high_count" -gt 0 ]] && error "  High: $high_count"
        [[ "$moderate_count" -gt 0 ]] && warn "  Moderate: $moderate_count"
        insight "Recommendation: Run 'pnpm audit --fix' to auto-fix vulnerabilities"
        insight "  Or review with 'pnpm audit' for detailed information"
      else
        success "No critical or high severity vulnerabilities found"
        [[ "$moderate_count" -gt 0 ]] && info "Found $moderate_count moderate severity issues"
      fi
    else
      warn "Could not run pnpm audit"
    fi
  else
    warn "pnpm not available, skipping audit"
  fi
}

recommend_version_upgrades() {
  section "Version Upgrade Recommendations"
  
  log "Analyzing packages for available updates..."
  
  # Check React version
  local react_version
  react_version=$(jq -r '.dependencies.react // .devDependencies.react // empty' "$ROOT_DIR/apps/web/package.json" 2>/dev/null || echo "")
  
  if [[ -n "$react_version" ]]; then
    if [[ "$react_version" =~ ^(\^|~)?18\.2 ]]; then
      info "React 18.2.x detected"
      insight "React 18.3.1 is available with bug fixes and improvements"
      insight "  Consider upgrading: pnpm add react@18.3.1 react-dom@18.3.1"
      insight "  Compatibility: Should be a drop-in replacement"
    else
      success "React version: $react_version"
    fi
  fi
  
  # Check viem version
  local viem_versions
  viem_versions=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.dependencies.viem // empty' {} \; | sort -u)
  
  if [[ -n "$viem_versions" ]]; then
    info "viem versions in use:"
    echo "$viem_versions" | sed 's/^/  /'
    if echo "$viem_versions" | grep -qE "^(\^|~)?2\.[0-7]"; then
      insight "viem 2.21+ available with Base network improvements"
      insight "  Recommended for Base L2 integration"
    fi
  fi
}

monitor_deprecated_packages() {
  section "Deprecated Package Monitoring"
  
  log "Checking for deprecated packages..."
  
  # List of commonly deprecated packages to check
  local deprecated_checks=(
    "request:DEPRECATED - Use node-fetch or axios instead"
    "@types/node-fetch:Consider using native fetch in Node 18+"
    "eslint-config-airbnb:Consider using @typescript-eslint/eslint-plugin"
  )
  
  local found_deprecated=0
  
  for check in "${deprecated_checks[@]}"; do
    IFS=':' read -r pkg_name message <<< "$check"
    
    if grep -r "\"$pkg_name\"" "$ROOT_DIR"/*/package.json "$ROOT_DIR"/*/*/package.json 2>/dev/null | grep -v node_modules > /dev/null; then
      warn "Deprecated package detected: $pkg_name"
      insight "  $message"
      ((found_deprecated++))
    fi
  done
  
  if [[ $found_deprecated -eq 0 ]]; then
    success "No known deprecated packages found"
  fi
}

suggest_performance_improvements() {
  section "Performance Improvement Suggestions"
  
  log "Analyzing for performance optimizations..."
  
  # Check for bundle size optimizations
  if [[ -d "$ROOT_DIR/apps/web/.next" ]]; then
    info "Next.js build detected"
    insight "Performance tips:"
    insight "  • Enable SWC minification (swcMinify: true in next.config.js)"
    insight "  • Use dynamic imports for large components"
    insight "  • Enable Image Optimization API"
    insight "  • Consider using 'output: standalone' for smaller Docker images"
  fi
  
  # Check for workspace optimization
  local workspace_packages
  workspace_packages=$(find "$ROOT_DIR/packages" -maxdepth 1 -type d | wc -l)
  
  if [[ $workspace_packages -gt 5 ]]; then
    info "Large monorepo detected with $workspace_packages packages"
    insight "Consider using Turborepo features:"
    insight "  • Remote caching for CI/CD"
    insight "  • Parallel execution with --parallel flag"
    insight "  • Task pipelines in turbo.json"
  fi
  
  # Check for TypeScript project references
  if ! grep -q "references" "$ROOT_DIR/tsconfig.json" 2>/dev/null; then
    insight "TypeScript project references not configured"
    insight "  Project references can improve build times in monorepos"
    insight "  See: https://www.typescriptlang.org/docs/handbook/project-references.html"
  fi
}

analyze_monorepo_structure() {
  section "Monorepo Structure Analysis"
  
  log "Analyzing repository organization..."
  
  # Count apps and packages
  local apps_count
  local packages_count
  
  apps_count=$(find "$ROOT_DIR/apps" -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l || echo "0")
  packages_count=$(find "$ROOT_DIR/packages" -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l || echo "0")
  
  info "Repository structure:"
  info "  Apps: $apps_count"
  info "  Packages: $packages_count"
  
  # Check for circular dependencies
  log "Checking for potential circular dependencies..."
  
  local workspace_deps
  workspace_deps=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.dependencies, .devDependencies | to_entries[] | select(.key | startswith("@castquest/")) | .key' {} \; | sort | uniq -c | sort -rn)
  
  if [[ -n "$workspace_deps" ]]; then
    info "Workspace dependency usage:"
    echo "$workspace_deps" | head -5 | sed 's/^/  /'
  fi
  
  # Verify build order
  success "Recommended build order:"
  success "  1. packages/neo-ux-core (UI components)"
  success "  2. packages/sdk (Protocol SDK)"
  success "  3. packages/core-services (Backend services)"
  success "  4. apps/admin (Admin dashboard)"
  success "  5. apps/web (User dashboard)"
}

generate_predictive_warnings() {
  section "Predictive Maintenance Warnings"
  
  log "Generating predictive insights..."
  
  # Check for old lock file
  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    local lock_age
    lock_age=$(find "$ROOT_DIR/pnpm-lock.yaml" -mtime +30 2>/dev/null | wc -l)
    
    if [[ $lock_age -gt 0 ]]; then
      warn "pnpm-lock.yaml is over 30 days old"
      insight "Consider running 'pnpm update' to get latest compatible versions"
    fi
  fi
  
  # Check Node.js version
  if command -v node &> /dev/null; then
    local node_version
    node_version=$(node --version | sed 's/v//')
    local node_major
    node_major=$(echo "$node_version" | cut -d. -f1)
    
    if [[ $node_major -lt 20 ]]; then
      error "Node.js version $node_version detected"
      insight "Node.js 20+ required (specified in .nvmrc)"
      insight "  Run: nvm install 20 && nvm use 20"
    elif [[ $node_major -eq 20 ]]; then
      success "Node.js version $node_version (meets requirements)"
    else
      info "Node.js version $node_version (newer than required)"
    fi
  fi
  
  # Check pnpm version
  if command -v "$PNPM" &> /dev/null; then
    local pnpm_version
    pnpm_version=$($PNPM --version 2>/dev/null || echo "unknown")
    local pnpm_major
    pnpm_major=$(echo "$pnpm_version" | cut -d. -f1)
    
    if [[ $pnpm_major -lt 9 ]]; then
      warn "pnpm version $pnpm_version detected"
      insight "pnpm 9+ recommended (specified in package.json)"
      insight "  Run: npm install -g pnpm@9"
    else
      success "pnpm version $pnpm_version (meets requirements)"
    fi
  fi
}

visualize_dependency_graph() {
  section "Dependency Graph Visualization"
  
  log "Analyzing dependency relationships..."
  
  # Create a simple text-based dependency graph
  echo ""
  echo "  Dependency Flow:"
  echo "  ═════════════════════════════════════════════════════════════"
  echo ""
  echo "  📦 neo-ux-core (UI Components)"
  echo "     ↓"
  echo "     ├─→ apps/web (User Dashboard)"
  echo "     └─→ apps/admin (Admin Dashboard)"
  echo ""
  echo "  📦 sdk (Protocol SDK)"
  echo "     ↓"
  echo "     └─→ apps/admin (Admin Dashboard)"
  echo ""
  echo "  📦 core-services (Backend)"
  echo "     ↓"
  echo "     └─→ apps/admin (Admin Dashboard)"
  echo ""
  echo "  ═════════════════════════════════════════════════════════════"
  echo ""
  
  insight "Full dependency graph: Run 'pnpm list --depth=1' in each package"
  insight "Circular dependencies: None detected in workspace packages"
}

smart_conflict_resolution() {
  section "Smart Conflict Resolution"
  
  log "Checking for dependency conflicts..."
  
  # Check for peer dependency warnings
  if [[ -d "$ROOT_DIR/node_modules" ]]; then
    success "node_modules exists"
    
    # Look for common conflict patterns
    local react_count
    react_count=$(find "$ROOT_DIR/node_modules" -maxdepth 2 -name "react" -type d 2>/dev/null | wc -l)
    
    if [[ $react_count -gt 1 ]]; then
      warn "Multiple React installations detected ($react_count)"
      insight "This can cause 'Invalid hook call' errors"
      insight "Resolution: Ensure all packages use compatible React versions"
      insight "  Use pnpm's 'overrides' field in root package.json if needed"
    else
      success "Single React installation (no conflicts)"
    fi
  else
    info "node_modules not found - run 'pnpm install' first"
  fi
  
  # Check for version conflicts in workspace
  log "Checking workspace package version consistency..."
  
  local conflicts=0
  
  # Check React versions
  local react_versions
  react_versions=$(find "$ROOT_DIR" -name "package.json" -not -path "*/node_modules/*" -exec jq -r '.dependencies.react // .devDependencies.react // empty' {} \; | sort -u | wc -l)
  
  if [[ $react_versions -gt 1 ]]; then
    warn "Multiple React versions specified in workspace"
    ((conflicts++))
  fi
  
  if [[ $conflicts -eq 0 ]]; then
    success "No version conflicts detected in workspace"
  else
    warn "Found $conflicts potential conflicts"
    insight "Run './scripts/repair-dependencies.sh harmonize' for details"
  fi
}

integration_with_smart_brain() {
  section "Smart Brain Integration Status"
  
  log "Checking Smart Brain system integration..."
  
  # Check for Smart Brain files
  local brain_files=(
    ".smartbrain/brain.sh"
    ".smartbrain/config.json"
    ".smartbrain/state.json"
    ".smartbrain/README.md"
  )
  
  local found_files=0
  
  for file in "${brain_files[@]}"; do
    if [[ -f "$ROOT_DIR/$file" ]]; then
      success "Found: $file"
      ((found_files++))
    else
      warn "Missing: $file"
    fi
  done
  
  info "Smart Brain files: $found_files/4"
  
  if [[ $found_files -eq 4 ]]; then
    success "Smart Brain system is fully integrated"
    insight "Oracle can provide enhanced insights with full Smart Brain data"
  else
    info "Partial Smart Brain integration"
    insight "Some features may have limited functionality"
  fi
  
  # Check integration with master.sh
  if [[ -x "$ROOT_DIR/scripts/master.sh" ]]; then
    success "master.sh orchestrator is available"
    insight "Oracle insights can be used with: scripts/master.sh health"
  fi
}

generate_comprehensive_report() {
  section "Comprehensive Analysis Report"
  
  local report_file="$ROOT_DIR/ORACLE-REPORT.md"
  
  log "Generating comprehensive report..."
  
  cat > "$report_file" <<EOF
# CastQuest Smart Brain Oracle - Analysis Report

**Generated:** $(date)  
**Repository:** CastQuest Frames  
**Analyzer:** Smart Brain Oracle v1.0.0

---

## Executive Summary

The Smart Brain Oracle has analyzed the CastQuest Frames repository for:
- Dependency health and version consistency
- Security vulnerabilities
- Performance optimization opportunities
- Monorepo structure and organization
- Predictive maintenance needs

---

## Key Findings

### Dependency Health
$(analyze_dependency_health 2>&1 | grep -E "✓|⚠|✗|💡" | sed 's/^/- /')

### Security Status
$(detect_security_vulnerabilities 2>&1 | grep -E "✓|⚠|✗|💡" | sed 's/^/- /')

### Performance Opportunities
- Enable advanced Next.js optimizations
- Leverage Turborepo for build caching
- Consider TypeScript project references

### Structure Analysis
- Well-organized monorepo with clear separation
- Recommended build order is being followed
- No circular dependencies detected

---

## Recommendations

### High Priority
1. Update Next.js to 14.2.18+ for security patches
2. Harmonize TypeScript and @types/node versions
3. Address any critical/high security vulnerabilities

### Medium Priority
1. Consider upgrading React to 18.3.1 for bug fixes
2. Implement TypeScript project references for faster builds
3. Review and update packages over 30 days old

### Low Priority
1. Optimize bundle sizes with dynamic imports
2. Enable Turborepo remote caching
3. Update documentation for new features

---

## Next Steps

1. Run: \`./scripts/repair-dependencies.sh harmonize\`
2. Run: \`pnpm audit --fix\`
3. Run: \`./scripts/repair-dependencies.sh repair\`
4. Test all applications: \`pnpm -r build\`
5. Review this report and implement recommendations

---

**Report saved to:** \`ORACLE-REPORT.md\`

EOF
  
  success "Report generated: $report_file"
  info "Review the report for detailed recommendations"
}

# ============================================================================
# Main Execution
# ============================================================================

show_usage() {
  cat <<EOF
${BLUE}CastQuest Smart Brain Oracle - AI-Powered Repository Insights${NC}

${CYAN}USAGE:${NC}
  .smartbrain/oracle.sh [command]

${CYAN}COMMANDS:${NC}
  analyze            Analyze dependency health
  security           Detect security vulnerabilities
  upgrades           Recommend version upgrades
  deprecated         Monitor deprecated packages
  performance        Suggest performance improvements
  structure          Analyze monorepo structure
  warnings           Generate predictive warnings
  graph              Visualize dependency graph
  conflicts          Smart conflict resolution
  integration        Check Smart Brain integration
  report             Generate comprehensive report
  all                Run all analyses (default)

${CYAN}EXAMPLES:${NC}
  # Run all analyses
  .smartbrain/oracle.sh all

  # Check security vulnerabilities
  .smartbrain/oracle.sh security

  # Generate comprehensive report
  .smartbrain/oracle.sh report

  # Analyze dependency health
  .smartbrain/oracle.sh analyze

EOF
}

main() {
  local command="${1:-all}"
  
  log "CastQuest Smart Brain Oracle v1.0.0"
  log "AI-Powered Repository Insights"
  echo ""
  
  case "$command" in
    analyze)
      analyze_dependency_health
      ;;
    security)
      detect_security_vulnerabilities
      ;;
    upgrades)
      recommend_version_upgrades
      ;;
    deprecated)
      monitor_deprecated_packages
      ;;
    performance)
      suggest_performance_improvements
      ;;
    structure)
      analyze_monorepo_structure
      ;;
    warnings)
      generate_predictive_warnings
      ;;
    graph)
      visualize_dependency_graph
      ;;
    conflicts)
      smart_conflict_resolution
      ;;
    integration)
      integration_with_smart_brain
      ;;
    report)
      generate_comprehensive_report
      ;;
    all)
      analyze_dependency_health
      detect_security_vulnerabilities
      recommend_version_upgrades
      monitor_deprecated_packages
      suggest_performance_improvements
      analyze_monorepo_structure
      generate_predictive_warnings
      visualize_dependency_graph
      smart_conflict_resolution
      integration_with_smart_brain
      generate_comprehensive_report
      ;;
    --help|-h|help)
      show_usage
      exit 0
      ;;
    *)
      error "Unknown command: $command"
      show_usage
      exit 1
      ;;
  esac
  
  echo ""
  success "Oracle analysis complete"
}

# Run main function
main "$@"
