#!/usr/bin/env bash
set -euo pipefail

################################################################################
# CASTQUEST FULL STACK STOPPER
# Gracefully stop all CastQuest platform components
################################################################################

# Colors
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly RED="\033[0;31m"
readonly CYAN="\033[0;36m"
readonly RESET="\033[0m"

# Root directory
readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  echo -e "${CYAN}[$(date +%T)]${RESET} $*"
}

success() {
  echo -e "${GREEN}✅${RESET} $*"
}

warn() {
  echo -e "${YELLOW}⚠️${RESET} $*"
}

banner() {
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${YELLOW} $*${RESET}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

################################################################################
# Main Stopper
################################################################################

main() {
  cd "$ROOT_DIR"
  
  banner "🛑 STOPPING CASTQUEST PLATFORM"
  
  echo ""
  
  # Stop Core Services
  log "Stopping Core Services API..."
  if [ -f "$ROOT_DIR/.services.pid" ]; then
    local pid=$(cat "$ROOT_DIR/.services.pid")
    kill $pid 2>/dev/null && success "Core Services stopped (PID: $pid)" || warn "Process not found"
    rm "$ROOT_DIR/.services.pid"
  else
    pkill -f "tsx.*packages/core-services" && success "Core Services stopped" || warn "Not running"
  fi
  
  # Stop Frames Server
  log "Stopping Frames server..."
  if [ -f "$ROOT_DIR/.frames.pid" ]; then
    local pid=$(cat "$ROOT_DIR/.frames.pid")
    kill $pid 2>/dev/null && success "Frames server stopped (PID: $pid)" || warn "Process not found"
    rm "$ROOT_DIR/.frames.pid"
  else
    pkill -f "next dev.*3002" && success "Frames server stopped" || warn "Not running"
  fi
  
  # Stop any orphaned processes
  log "Checking for orphaned processes..."
  pkill -f "tsx.*core-services" 2>/dev/null && warn "Stopped orphaned Core Services process" || true
  pkill -f "next dev.*3002" 2>/dev/null && warn "Stopped orphaned Frames process" || true
  
  echo ""
  banner "✅ ALL SERVICES STOPPED"
  echo ""
  
  success "Platform shutdown complete"
  log "To restart: ./scripts/full-stack-start.sh"
  echo ""
}

main "$@"
