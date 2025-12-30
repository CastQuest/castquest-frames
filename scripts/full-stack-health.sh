#!/usr/bin/env bash
set -euo pipefail

################################################################################
# CASTQUEST HEALTH CHECK
# Comprehensive system health diagnostics
################################################################################

# Colors
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly RED="\033[0;31m"
readonly CYAN="\033[0;36m"
readonly MAGENTA="\033[0;35m"
readonly RESET="\033[0m"

# Root directory
readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

success() {
  echo -e "${GREEN}✅${RESET} $*"
}

warn() {
  echo -e "${YELLOW}⚠️${RESET} $*"
}

error() {
  echo -e "${RED}❌${RESET} $*"
}

banner() {
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${MAGENTA} $*${RESET}"
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

################################################################################
# Health Checks
################################################################################

checks_passed=0
checks_failed=0

check_prerequisites() {
  banner "🔧 PREREQUISITES"
  
  if command -v node &> /dev/null; then
    success "Node.js: $(node -v)"
    ((checks_passed++))
  else
    error "Node.js not found"
    ((checks_failed++))
  fi
  
  if command -v pnpm &> /dev/null; then
    success "pnpm: $(pnpm -v)"
    ((checks_passed++))
  else
    warn "pnpm not found"
    ((checks_failed++))
  fi
  
  if command -v forge &> /dev/null; then
    success "Foundry: $(forge --version | head -1)"
    ((checks_passed++))
  else
    warn "Foundry not found (optional)"
  fi
  
  if command -v git &> /dev/null; then
    success "Git: $(git --version)"
    ((checks_passed++))
  else
    error "Git not found"
    ((checks_failed++))
  fi
}

check_core_services() {
  banner "🔌 CORE SERVICES API (Port 4000)"
  
  if pgrep -f "tsx.*packages/core-services" > /dev/null; then
    success "Process running"
    ((checks_passed++))
    
    if curl -s http://localhost:4000/api/v1/health > /dev/null 2>&1; then
      success "Health endpoint responding"
      ((checks_passed++))
      
      # Test a few key endpoints
      if curl -s http://localhost:4000/api/v1/users | grep -q "success" 2>/dev/null; then
        success "Users endpoint responding"
        ((checks_passed++))
      else
        warn "Users endpoint not responding"
        ((checks_failed++))
      fi
    else
      error "Health endpoint not responding"
      ((checks_failed++))
    fi
  else
    error "Core Services not running"
    ((checks_failed++))
  fi
}

check_frames() {
  banner "🖼️  FRAMES SERVER (Port 3002)"
  
  if pgrep -f "next dev.*3002" > /dev/null; then
    success "Process running"
    ((checks_passed++))
    
    if curl -s http://localhost:3002 > /dev/null 2>&1; then
      success "Demo page responding"
      ((checks_passed++))
      
      # Test frame endpoints
      local test_token="0x1111111111111111111111111111111111111111"
      
      if curl -s "http://localhost:3002/api/frames/tiny-signal?token=$test_token" | grep -q "fc:frame" 2>/dev/null; then
        success "Tiny signal frame responding"
        ((checks_passed++))
      else
        warn "Tiny signal frame not responding"
        ((checks_failed++))
      fi
      
      if curl -s "http://localhost:3002/api/frames/cast-overview" | grep -q "fc:frame" 2>/dev/null; then
        success "CAST overview frame responding"
        ((checks_passed++))
      else
        warn "CAST overview frame not responding"
        ((checks_failed++))
      fi
    else
      error "Demo page not responding"
      ((checks_failed++))
    fi
  else
    error "Frames server not running"
    ((checks_failed++))
  fi
}

check_contracts() {
  banner "📜 SMART CONTRACTS"
  
  cd "$ROOT_DIR/packages/contracts"
  
  if [ -f "foundry.toml" ]; then
    success "Foundry configuration present"
    ((checks_passed++))
  else
    error "Foundry configuration missing"
    ((checks_failed++))
  fi
  
  if [ -d "lib" ] && [ -d "lib/openzeppelin-contracts" ]; then
    success "Dependencies installed"
    ((checks_passed++))
  else
    warn "Dependencies not installed (run: forge install)"
    ((checks_failed++))
  fi
  
  if [ -d "out" ]; then
    success "Build artifacts present"
    ((checks_passed++))
  else
    warn "Not built (run: forge build)"
  fi
}

check_documentation() {
  banner "📚 DOCUMENTATION"
  
  local docs=(
    "docs/SYSTEM-OVERVIEW.md"
    "packages/frames/docs/FRAMES-ORACLE.md"
    "packages/frames/README.md"
    "packages/core-services/docs/API.md"
    "packages/core-services/docs/ARCHITECTURE.md"
    "packages/contracts/README.md"
  )
  
  for doc in "${docs[@]}"; do
    if [ -f "$ROOT_DIR/$doc" ]; then
      success "$(basename $doc)"
      ((checks_passed++))
    else
      warn "Missing: $doc"
      ((checks_failed++))
    fi
  done
}

check_git_status() {
  banner "🔀 GIT STATUS"
  
  cd "$ROOT_DIR"
  
  if [ -d ".git" ]; then
    success "Git repository initialized"
    ((checks_passed++))
    
    local branch=$(git branch --show-current)
    success "Branch: $branch"
    
    local latest_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "none")
    success "Latest tag: $latest_tag"
    
    local uncommitted=$(git status --porcelain | wc -l)
    if [ "$uncommitted" -eq 0 ]; then
      success "Working tree clean"
      ((checks_passed++))
    else
      warn "Uncommitted changes: $uncommitted files"
      ((checks_failed++))
    fi
  else
    error "Not a git repository"
    ((checks_failed++))
  fi
}

################################################################################
# Main
################################################################################

main() {
  cd "$ROOT_DIR"
  
  banner "🏥 CASTQUEST HEALTH CHECK"
  echo ""
  
  check_prerequisites
  echo ""
  
  check_core_services
  echo ""
  
  check_frames
  echo ""
  
  check_contracts
  echo ""
  
  check_documentation
  echo ""
  
  check_git_status
  echo ""
  
  # Summary
  banner "📊 HEALTH SUMMARY"
  echo ""
  echo -e "${GREEN}Checks Passed:${RESET} $checks_passed"
  echo -e "${YELLOW}Checks Failed:${RESET} $checks_failed"
  echo ""
  
  if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${GREEN} ✅ ALL SYSTEMS OPERATIONAL${RESET}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    exit 0
  else
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    echo -e "${YELLOW} ⚠️  SOME CHECKS FAILED${RESET}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
    exit 1
  fi
}

main "$@"
