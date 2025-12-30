#!/usr/bin/env bash
set -euo pipefail

################################################################################
# CASTQUEST FULL STACK LAUNCHER
# Quick-start script to run the complete CastQuest platform
################################################################################

# Colors
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly RED="\033[0;31m"
readonly CYAN="\033[0;36m"
readonly BLUE="\033[0;34m"
readonly MAGENTA="\033[0;35m"
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

error() {
  echo -e "${RED}❌${RESET} $*"
}

banner() {
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${MAGENTA} $*${RESET}"
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

################################################################################
# Main Launcher
################################################################################

main() {
  cd "$ROOT_DIR"
  
  banner "🚀 CASTQUEST FULL STACK LAUNCHER"
  
  echo ""
  log "Starting CastQuest platform components..."
  echo ""
  
  # Step 1: Check prerequisites
  banner "1️⃣  CHECKING PREREQUISITES"
  
  if ! command -v pnpm &> /dev/null; then
    error "pnpm not found"
    log "Installing pnpm..."
    npm install -g pnpm
  fi
  success "pnpm installed"
  
  if ! command -v node &> /dev/null; then
    error "Node.js not found - please install Node.js 20+"
    exit 1
  fi
  success "Node.js: $(node -v)"
  
  if ! command -v forge &> /dev/null; then
    warn "Foundry not found - contracts will be unavailable"
  else
    success "Foundry: $(forge --version | head -1)"
  fi
  
  # Step 2: Install dependencies
  banner "2️⃣  INSTALLING DEPENDENCIES"
  
  log "Installing workspace dependencies..."
  pnpm install --frozen-lockfile 2>&1 | grep -E "(Progress|✓|✗)" || true
  success "Dependencies installed"
  
  # Step 3: Start Core Services
  banner "3️⃣  STARTING CORE SERVICES API (Port 4000)"
  
  cd "$ROOT_DIR/packages/core-services"
  
  if pgrep -f "tsx.*src/index.ts" > /dev/null; then
    warn "Core Services already running"
  else
    log "Starting Core Services API..."
    nohup pnpm dev > "$ROOT_DIR/logs/services-$(date +%Y%m%d-%H%M%S).log" 2>&1 &
    echo $! > "$ROOT_DIR/.services.pid"
    
    # Wait for startup
    log "Waiting for Core Services to initialize..."
    for i in {1..30}; do
      if curl -s http://localhost:4000/api/v1/health > /dev/null 2>&1; then
        success "Core Services API running on port 4000"
        break
      fi
      sleep 1
    done
  fi
  
  # Step 4: Start Frames Server
  banner "4️⃣  STARTING FRAMES SERVER (Port 3002)"
  
  cd "$ROOT_DIR/packages/frames"
  
  if pgrep -f "next dev.*3002" > /dev/null; then
    warn "Frames server already running"
  else
    log "Starting Frames server..."
    nohup pnpm dev > "$ROOT_DIR/logs/frames-$(date +%Y%m%d-%H%M%S).log" 2>&1 &
    echo $! > "$ROOT_DIR/.frames.pid"
    
    # Wait for startup
    log "Waiting for Frames server to initialize..."
    for i in {1..30}; do
      if curl -s http://localhost:3002 > /dev/null 2>&1; then
        success "Frames server running on port 3002"
        break
      fi
      sleep 1
    done
  fi
  
  # Step 5: Display status
  banner "✅ CASTQUEST PLATFORM READY"
  
  echo ""
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${GREEN} 🎯 SERVICES RUNNING${RESET}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
  
  echo -e "${CYAN}Core Services API:${RESET}"
  echo -e "  URL:    ${BLUE}http://localhost:4000${RESET}"
  echo -e "  Health: ${BLUE}http://localhost:4000/api/v1/health${RESET}"
  echo -e "  PID:    $(cat "$ROOT_DIR/.services.pid" 2>/dev/null || echo "N/A")"
  echo ""
  
  echo -e "${CYAN}Frames Server:${RESET}"
  echo -e "  Demo:   ${BLUE}http://localhost:3002${RESET}"
  echo -e "  Tiny:   ${BLUE}http://localhost:3002/api/frames/tiny-signal?token=0x1111...${RESET}"
  echo -e "  Detail: ${BLUE}http://localhost:3002/api/frames/token-detail?token=0x1111...${RESET}"
  echo -e "  CAST:   ${BLUE}http://localhost:3002/api/frames/cast-overview${RESET}"
  echo -e "  PID:    $(cat "$ROOT_DIR/.frames.pid" 2>/dev/null || echo "N/A")"
  echo ""
  
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${GREEN} 📚 USEFUL COMMANDS${RESET}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
  echo -e "  ${YELLOW}Check status:${RESET}       ./scripts/master.sh health"
  echo -e "  ${YELLOW}View logs:${RESET}          ./scripts/master.sh logs"
  echo -e "  ${YELLOW}Stop all:${RESET}           ./scripts/full-stack-stop.sh"
  echo -e "  ${YELLOW}Services health:${RESET}    ./scripts/master.sh services health"
  echo -e "  ${YELLOW}Frames health:${RESET}      ./scripts/master.sh frames health"
  echo ""
  
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""
  
  success "Platform is ready for development! 🎉"
  echo ""
  log "Press Ctrl+C to stop monitoring (services will continue running)"
  echo ""
  
  # Monitor logs
  tail -f "$ROOT_DIR/logs/"*.log 2>/dev/null || log "No logs to tail"
}

# Trap Ctrl+C
trap 'echo ""; log "Stopping log monitoring..."; exit 0' INT

main "$@"
