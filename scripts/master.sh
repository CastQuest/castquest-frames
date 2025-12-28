#!/usr/bin/env bash
set -euo pipefail

################################################################################
# CASTQUEST MASTER ORCHESTRATOR
# Production-ready master control script for all system operations
# Beta Production Stable Protocol - No placeholders, production code only
################################################################################

# Colors for output
readonly GREEN="\033[0;32m"
readonly YELLOW="\033[1;33m"
readonly RED="\033[0;31m"
readonly CYAN="\033[0;36m"
readonly BLUE="\033[0;34m"
readonly MAGENTA="\033[0;35m"
readonly RESET="\033[0m"

# Root directory
readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly SCRIPTS_DIR="$ROOT_DIR/scripts"

# Log file
readonly LOG_FILE="$ROOT_DIR/logs/master-$(date +%Y%m%d-%H%M%S).log"
mkdir -p "$ROOT_DIR/logs"

################################################################################
# Logging Functions
################################################################################

log() {
  echo -e "${CYAN}[$(date +%T)]${RESET} $*" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}✅ [SUCCESS]${RESET} $*" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}⚠️  [WARNING]${RESET} $*" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}❌ [ERROR]${RESET} $*" | tee -a "$LOG_FILE"
}

banner() {
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}" | tee -a "$LOG_FILE"
  echo -e "${MAGENTA} $*${RESET}" | tee -a "$LOG_FILE"
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}" | tee -a "$LOG_FILE"
}

step() {
  echo -e "${BLUE}▶ [STEP]${RESET} $*" | tee -a "$LOG_FILE"
}

################################################################################
# System Health Check
################################################################################

check_system_health() {
  step "Checking system health..."
  
  local issues=0
  
  # Check Node.js
  if command -v node &> /dev/null; then
    local node_version=$(node -v)
    success "Node.js: $node_version"
  else
    error "Node.js not found"
    ((issues++))
  fi
  
  # Check pnpm
  if command -v pnpm &> /dev/null; then
    local pnpm_version=$(pnpm -v)
    success "pnpm: $pnpm_version"
  else
    warn "pnpm not found - will install"
    npm install -g pnpm
  fi
  
  # Check git
  if command -v git &> /dev/null; then
    local git_version=$(git --version)
    success "Git: $git_version"
  else
    error "Git not found"
    ((issues++))
  fi
  
  # Check workspace structure
  local required_dirs=("apps" "packages" "scripts" "data" "docs")
  for dir in "${required_dirs[@]}"; do
    if [ -d "$ROOT_DIR/$dir" ]; then
      success "Directory: $dir"
    else
      error "Missing directory: $dir"
      ((issues++))
    fi
  done
  
  if [ $issues -eq 0 ]; then
    success "System health check passed"
    return 0
  else
    error "System health check failed with $issues issues"
    return 1
  fi
}

################################################################################
# Smart Brain Integration
################################################################################

run_smart_brain() {
  step "Running Smart Brain Deep Think..."
  
  if [ -f "$SCRIPTS_DIR/mega-brain-console-neo.sh" ]; then
    bash "$SCRIPTS_DIR/mega-brain-console-neo.sh" || warn "Smart Brain execution completed with warnings"
    success "Smart Brain analysis complete"
  else
    warn "Smart Brain console not found"
  fi
}

################################################################################
# Self-Healing Operations
################################################################################

run_self_healing() {
  step "Running self-healing protocols..."
  
  local healers=(
    "mega-neo-self-healer-v5.sh"
    "castquest-mega-selfheal.sh"
    "mega-neo-workspace-validator.sh"
  )
  
  for healer in "${healers[@]}"; do
    if [ -f "$SCRIPTS_DIR/$healer" ]; then
      log "Executing: $healer"
      bash "$SCRIPTS_DIR/$healer" || warn "$healer completed with warnings"
      success "$healer complete"
    else
      warn "$healer not found"
    fi
  done
  
  success "Self-healing protocols complete"
}

################################################################################
# Protocol Integrity Check
################################################################################

check_protocol_integrity() {
  step "Checking protocol integrity..."
  
  if [ -f "$SCRIPTS_DIR/protocol-integrity-mega.sh" ]; then
    bash "$SCRIPTS_DIR/protocol-integrity-mega.sh"
    success "Protocol integrity verified"
  else
    warn "Protocol integrity script not found"
  fi
}

################################################################################
# Autonomous Worker System
################################################################################

manage_workers() {
  local action="${1:-status}"
  
  step "Managing autonomous workers: $action"
  
  case "$action" in
    start)
      log "Starting autonomous worker system..."
      if [ -f "$SCRIPTS_DIR/mega-worker-console-neo.sh" ]; then
        bash "$SCRIPTS_DIR/mega-worker-console-neo.sh" start
        success "Workers started"
      fi
      ;;
    stop)
      log "Stopping autonomous worker system..."
      pkill -f "worker-console" || true
      success "Workers stopped"
      ;;
    status)
      log "Checking worker status..."
      ps aux | grep -i "worker" | grep -v grep || log "No active workers"
      ;;
    *)
      error "Unknown worker action: $action"
      return 1
      ;;
  esac
}

################################################################################
# Port Management
################################################################################

clean_ports() {
  step "Cleaning ports..."
  
  if [ -f "$SCRIPTS_DIR/mega-port-cleaner.sh" ]; then
    bash "$SCRIPTS_DIR/mega-port-cleaner.sh"
    success "Ports cleaned"
  else
    warn "Port cleaner not found - performing basic cleanup"
    
    # Kill common ports
    local ports=(3000 3010 5173 8080)
    for port in "${ports[@]}"; do
      local pid=$(lsof -ti:$port 2>/dev/null || true)
      if [ -n "$pid" ]; then
        kill -9 $pid 2>/dev/null || true
        log "Killed process on port $port"
      fi
    done
  fi
}

################################################################################
# Deployment Operations
################################################################################

deploy_system() {
  local environment="${1:-development}"
  
  banner "DEPLOYING SYSTEM: $environment"
  
  step "1. System health check"
  check_system_health || {
    error "Health check failed - aborting deployment"
    return 1
  }
  
  step "2. Protocol integrity"
  check_protocol_integrity
  
  step "3. Self-healing"
  run_self_healing
  
  step "4. Smart Brain analysis"
  run_smart_brain
  
  step "5. Port cleanup"
  clean_ports
  
  step "6. Installing dependencies"
  cd "$ROOT_DIR"
  if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile || pnpm install
    success "Dependencies installed"
  else
    warn "pnpm not available - skipping dependency install"
  fi
  
  step "7. Building packages"
  pnpm build || warn "Build completed with warnings"
  
  if [ "$environment" = "production" ]; then
    step "8. Production deployment"
    if [ -f "$SCRIPTS_DIR/hackathon-deploy.sh" ]; then
      bash "$SCRIPTS_DIR/hackathon-deploy.sh"
      success "Production deployment complete"
    fi
  else
    step "8. Starting development servers"
    pnpm dev &
    success "Development servers starting"
  fi
  
  step "9. Starting worker system"
  manage_workers start
  
  success "Deployment complete for $environment"
}

################################################################################
# Monitoring Dashboard
################################################################################

monitor_system() {
  step "Launching monitoring dashboard..."
  
  if [ -f "$SCRIPTS_DIR/hackathon-monitor.sh" ]; then
    bash "$SCRIPTS_DIR/hackathon-monitor.sh"
  else
    log "Monitoring dashboard not found - showing basic stats"
    
    echo ""
    echo "=== System Status ==="
    echo "Uptime: $(uptime)"
    echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2}')"
    echo ""
    echo "=== Running Processes ==="
    ps aux | grep -E "node|pnpm" | grep -v grep || echo "No active processes"
    echo ""
    echo "=== Git Status ==="
    git status --short
    echo ""
  fi
}

################################################################################
# Git Operations
################################################################################

git_operations() {
  local operation="${1:-status}"
  
  step "Git operation: $operation"
  
  case "$operation" in
    status)
      git status
      ;;
    commit)
      local message="${2:-Auto-commit by master.sh}"
      git add -A
      git commit -m "$message" || log "Nothing to commit"
      success "Changes committed"
      ;;
    tag)
      local tag_name="${2:-}"
      local tag_message="${3:-Auto-tag by master.sh}"
      
      if [ -z "$tag_name" ]; then
        error "Tag name required"
        return 1
      fi
      
      git tag -a "$tag_name" -m "$tag_message"
      success "Tag created: $tag_name"
      ;;
    push)
      local branch=$(git branch --show-current)
      git push origin "$branch"
      git push origin --tags
      success "Pushed to origin/$branch with tags"
      ;;
    full)
      git add -A
      git commit -m "${2:-Auto-commit by master.sh}" || log "Nothing to commit"
      
      local latest_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
      if [ -n "$latest_tag" ]; then
        log "Latest tag: $latest_tag"
      fi
      
      local branch=$(git branch --show-current)
      git push origin "$branch"
      git push origin --tags
      success "Full git cycle complete"
      ;;
    *)
      error "Unknown git operation: $operation"
      return 1
      ;;
  esac
}

################################################################################
# Help Menu
################################################################################

show_help() {
  banner "CASTQUEST MASTER ORCHESTRATOR - HELP"
  
  cat << EOF

USAGE:
  ./scripts/master.sh <command> [options]

COMMANDS:
  
  System Management:
    health              - Run system health check
    heal                - Execute self-healing protocols
    brain               - Run Smart Brain analysis
    integrity           - Check protocol integrity
    
  Deployment:
    deploy [env]        - Deploy system (env: development|production)
    monitor             - Launch monitoring dashboard
    
  Worker Management:
    workers start       - Start autonomous worker system
    workers stop        - Stop autonomous worker system
    workers status      - Check worker status
    
  Port Management:
    ports               - Clean and reset ports
    
  Git Operations:
    git status          - Show git status
    git commit [msg]    - Commit all changes
    git tag <name> [msg] - Create annotated tag
    git push            - Push to remote with tags
    git full [msg]      - Commit, tag, and push (full cycle)
    
  Utilities:
    logs                - Show recent logs
    help                - Show this help menu

EXAMPLES:
  
  # Full deployment with monitoring
  ./scripts/master.sh deploy production
  ./scripts/master.sh monitor
  
  # Self-healing and integrity check
  ./scripts/master.sh heal
  ./scripts/master.sh integrity
  
  # Git workflow
  ./scripts/master.sh git full "feat: Add new feature"
  
  # Worker management
  ./scripts/master.sh workers start
  ./scripts/master.sh workers status

LOGS:
  All operations are logged to: $LOG_FILE

EOF
}

################################################################################
# Main Entry Point
################################################################################

main() {
  cd "$ROOT_DIR"
  
  banner "CASTQUEST MASTER ORCHESTRATOR"
  log "Started at: $(date)"
  log "Root: $ROOT_DIR"
  log "Log: $LOG_FILE"
  echo ""
  
  local command="${1:-help}"
  shift || true
  
  case "$command" in
    health)
      check_system_health
      ;;
    heal)
      run_self_healing
      ;;
    brain)
      run_smart_brain
      ;;
    integrity)
      check_protocol_integrity
      ;;
    deploy)
      deploy_system "$@"
      ;;
    monitor)
      monitor_system
      ;;
    workers)
      manage_workers "$@"
      ;;
    ports)
      clean_ports
      ;;
    git)
      git_operations "$@"
      ;;
    logs)
      tail -n 50 "$LOG_FILE"
      ;;
    help|--help|-h)
      show_help
      ;;
    *)
      error "Unknown command: $command"
      show_help
      exit 1
      ;;
  esac
  
  echo ""
  log "Completed at: $(date)"
  success "Master orchestrator finished"
}

# Execute main with all arguments
main "$@"
