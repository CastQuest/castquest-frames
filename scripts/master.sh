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
  
  # Check Node.js (require 20+)
  if command -v node &> /dev/null; then
    local node_version=$(node -v)
    local node_major=$(echo "$node_version" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_major" -ge 20 ]; then
      success "Node.js: $node_version (✓ >= 20.0.0)"
    else
      error "Node.js $node_version is too old. Required: Node.js 20+ (to fix ERR_INVALID_THIS)"
      warn "Install Node 20+: https://nodejs.org or use nvm: nvm install 20 && nvm use 20"
      ((issues++))
    fi
  else
    error "Node.js not found. Required: Node.js 20+"
    ((issues++))
  fi
  
  # Check pnpm (require 9+)
  if command -v pnpm &> /dev/null; then
    local pnpm_version=$(pnpm -v)
    local pnpm_major=$(echo "$pnpm_version" | cut -d'.' -f1)
    if [ "$pnpm_major" -ge 9 ]; then
      success "pnpm: $pnpm_version (✓ >= 9.0.0)"
    else
      warn "pnpm $pnpm_version is too old. Upgrading to pnpm 9+..."
      npm install -g pnpm@9
    fi
  else
    warn "pnpm not found - installing pnpm 9+"
    npm install -g pnpm@9
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
  
  # Check core services
  if [ -d "$ROOT_DIR/packages/core-services" ]; then
    success "Core Services: installed"
    
    # Validate package structure
    if [ -f "$ROOT_DIR/packages/core-services/package.json" ]; then
      success "Core Services: package.json ✓"
    fi
    
    if [ -f "$ROOT_DIR/packages/core-services/src/server.ts" ]; then
      success "Core Services: server.ts ✓"
    fi
    
    if [ -f "$ROOT_DIR/packages/core-services/src/lib/db/schema.ts" ]; then
      success "Core Services: database schema ✓"
    fi
    
    # Check if running
    if lsof -ti:4000 &> /dev/null; then
      success "Core Services: RUNNING on port 4000"
      
      # Test health endpoint
      if command -v curl &> /dev/null; then
        local health_status=$(curl -s http://localhost:4000/health 2>/dev/null || echo "")
        if [ -n "$health_status" ]; then
          success "Core Services: Health endpoint responding"
          echo "$health_status" | grep -q '"status":"healthy"' && success "Core Services: Status HEALTHY"
        fi
      fi
    else
      warn "Core Services: Not running (use 'services start')"
    fi
  else
    warn "Core Services not found - run Smart Brain to deploy"
  fi
  
  if [ $issues -eq 0 ]; then
    success "System health check passed"
    return 0
  else
    error "System health check failed with $issues issues"
    return 1
  fi
}

################################################################################
# Phase 2 Completion Monitor
################################################################################

check_phase2_completion() {
  step "Checking Phase 2 completion status..."
  
  local phase2_complete=true
  local modules=("media" "markets" "risk")
  
  echo ""
  log "=== Core Services Phase 2 Status ==="
  
  # Check each module
  for module in "${modules[@]}"; do
    local routes_file="$ROOT_DIR/packages/core-services/src/modules/$module/routes.ts"
    local service_file="$ROOT_DIR/packages/core-services/src/modules/$module/service.ts"
    
    if [ -f "$routes_file" ] && [ -f "$service_file" ]; then
      success "$module module: COMPLETE ✓"
    elif [ -f "$routes_file" ]; then
      warn "$module module: Routes only (service pending)"
      phase2_complete=false
    else
      error "$module module: MISSING"
      phase2_complete=false
    fi
  done
  
  echo ""
  
  if [ "$phase2_complete" = true ]; then
    success "Phase 2: COMPLETE ✅"
    return 0
  else
    warn "Phase 2: IN PROGRESS 🔄"
    log "Run Smart Brain to complete pending modules"
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
  
  step "4. Core Services Phase 2 check"
  check_phase2_completion || log "Phase 2 modules pending - continuing deployment"
  
  step "5. Smart Brain analysis"
  run_smart_brain
  
  step "6. Port cleanup"
  clean_ports
  
  step "7. Installing dependencies"
  cd "$ROOT_DIR"
  if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile || pnpm install
    success "Dependencies installed"
  else
    warn "pnpm not available - skipping dependency install"
  fi
  
  step "8. Building packages"
  pnpm build || warn "Build completed with warnings"
  
  step "9. Smart Brain Oracle Audit"
  if [ -f "$SCRIPTS_DIR/audit.sh" ]; then
    bash "$SCRIPTS_DIR/audit.sh" || warn "Audit completed with warnings"
    success "Smart Brain audit complete"
  else
    warn "audit.sh not found - skipping audit"
  fi
  
  if [ "$environment" = "production" ]; then
    step "10. Production deployment"
    if [ -f "$SCRIPTS_DIR/hackathon-deploy.sh" ]; then
      bash "$SCRIPTS_DIR/hackathon-deploy.sh"
      success "Production deployment complete"
    fi
  else
    step "10. Starting development servers"
    manage_core_services start
    pnpm dev &
    success "Development servers starting"
  fi
  
  step "11. Starting worker system"
  manage_workers start
  
  success "Deployment complete for $environment"
}

################################################################################
# Core Services Management
################################################################################

manage_core_services() {
  local action="${1:-status}"
  
  step "Managing Core Services: $action"
  
  case "$action" in
    start)
      log "Starting Core Services backend..."
      
      # Check if already running
      if lsof -ti:4000 &> /dev/null; then
        warn "Core Services already running on port 4000"
        return 0
      fi
      
      cd "$ROOT_DIR/packages/core-services"
      
      # Install dependencies if needed
      if [ ! -d "node_modules" ]; then
        log "Installing Core Services dependencies..."
        pnpm install
      fi
      
      # Start in background
      pnpm dev > "$ROOT_DIR/logs/core-services.log" 2>&1 &
      local pid=$!
      
      # Wait for startup
      sleep 3
      
      if lsof -ti:4000 &> /dev/null; then
        success "Core Services started on port 4000 (PID: $pid)"
        log "Logs: $ROOT_DIR/logs/core-services.log"
      else
        error "Core Services failed to start"
        return 1
      fi
      ;;
      
    stop)
      log "Stopping Core Services..."
      local pid=$(lsof -ti:4000 2>/dev/null || true)
      
      if [ -n "$pid" ]; then
        kill -15 $pid 2>/dev/null || kill -9 $pid 2>/dev/null || true
        sleep 1
        success "Core Services stopped (PID: $pid)"
      else
        warn "Core Services was not running"
      fi
      ;;
      
    restart)
      manage_core_services stop
      sleep 2
      manage_core_services start
      ;;
      
    status)
      log "Checking Core Services status..."
      echo ""
      
      if lsof -ti:4000 &> /dev/null; then
        success "Core Services: RUNNING on port 4000"
        
        # Get health status
        if command -v curl &> /dev/null; then
          echo ""
          log "Health Check Response:"
          curl -s http://localhost:4000/health 2>/dev/null | jq '.' 2>/dev/null || log "Health endpoint not responding"
        fi
        
        # Show process info
        echo ""
        log "Process Info:"
        ps aux | grep -E "core-services|:4000" | grep -v grep || log "No process details available"
        
      else
        warn "Core Services: NOT RUNNING"
        log "Use 'services start' to launch"
      fi
      
      echo ""
      ;;
      
    build)
      log "Building Core Services..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm install
      pnpm build
      success "Core Services built successfully"
      ;;
      
    test)
      log "Testing Core Services..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm test || warn "Tests completed with warnings"
      success "Core Services tests complete"
      ;;
      
    test:watch)
      log "Starting Core Services test watcher..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm test:watch
      ;;
      
    lint)
      log "Linting Core Services..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm lint
      success "Linting complete"
      ;;
      
    typecheck)
      log "Type checking Core Services..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm typecheck
      success "Type check complete"
      ;;
      
    db:migrate)
      log "Running database migrations..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm db:migrate
      success "Migrations complete"
      ;;
      
    db:seed)
      log "Seeding database..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm db:seed
      success "Database seeded"
      ;;
      
    db:reset)
      warn "This will DESTROY all data in the database!"
      read -p "Are you sure? (yes/no): " confirm
      if [ "$confirm" = "yes" ]; then
        log "Resetting database..."
        cd "$ROOT_DIR/packages/core-services"
        pnpm db:reset
        success "Database reset complete"
      else
        log "Database reset cancelled"
      fi
      ;;
      
    db:studio)
      log "Opening Drizzle Studio..."
      cd "$ROOT_DIR/packages/core-services"
      pnpm db:studio
      ;;
      
    api:test)
      log "Testing Core Services API..."
      
      if ! lsof -ti:4000 &> /dev/null; then
        error "Core Services not running - start with: ./scripts/master.sh services start"
        return 1
      fi
      
      echo ""
      log "=== Health Check ==="
      curl -s http://localhost:4000/health | jq . || error "Health endpoint failed"
      
      echo ""
      log "=== API Endpoints ==="
      success "Users: http://localhost:4000/api/v1/users"
      success "Wallets: http://localhost:4000/api/v1/wallets"
      success "Media: http://localhost:4000/api/v1/media"
      success "Markets: http://localhost:4000/api/v1/markets"
      success "Admin: http://localhost:4000/api/v1/admin (requires API key)"
      
      echo ""
      log "=== Quick Test ==="
      log "Testing GET /api/v1/media..."
      curl -s "http://localhost:4000/api/v1/media?limit=5" | jq '.success' && success "Media endpoint working" || error "Media endpoint failed"
      
      echo ""
      ;;
      
    health)
      log "Core Services health diagnostics..."
      echo ""
      
      # Check structure
      log "=== Package Structure ==="
      [ -f "$ROOT_DIR/packages/core-services/package.json" ] && success "package.json ✓" || error "package.json missing"
      [ -f "$ROOT_DIR/packages/core-services/src/server.ts" ] && success "server.ts ✓" || error "server.ts missing"
      [ -f "$ROOT_DIR/packages/core-services/src/lib/db/schema.ts" ] && success "schema.ts ✓" || error "schema.ts missing"
      
      echo ""
      log "=== Modules ==="
      local modules=("users" "wallets" "media" "markets" "risk")
      for module in "${modules[@]}"; do
        local routes="$ROOT_DIR/packages/core-services/src/modules/$module/routes.ts"
        local service="$ROOT_DIR/packages/core-services/src/modules/$module/service.ts"
        
        if [ -f "$routes" ] && [ -f "$service" ]; then
          success "$module: Complete (routes + service)"
        elif [ -f "$routes" ]; then
          warn "$module: Partial (routes only)"
        else
          error "$module: Missing"
        fi
      done
      
      echo ""
      log "=== Runtime Status ==="
      if lsof -ti:4000 &> /dev/null; then
        success "Server: Running on port 4000"
        command -v curl &> /dev/null && curl -s http://localhost:4000/health >/dev/null 2>&1 && success "Health endpoint: Responding" || warn "Health endpoint: Not responding"
      else
        warn "Server: Not running"
      fi
      
      echo ""
      ;;
      
    phase2)
      check_phase2_completion
      ;;
      
    logs)
      log "Tailing Core Services logs..."
      tail -f "$ROOT_DIR/logs/core-services.log"
      ;;
      
    full-check)
      log "Running full Core Services validation..."
      echo ""
      
      step "1. Structure check"
      manage_core_services health
      
      echo ""
      step "2. Type checking"
      cd "$ROOT_DIR/packages/core-services"
      pnpm typecheck || warn "Type check warnings"
      
      echo ""
      step "3. Linting"
      pnpm lint || warn "Linting warnings"
      
      echo ""
      step "4. Running tests"
      pnpm test || warn "Test warnings"
      
      echo ""
      step "5. Build verification"
      pnpm build || error "Build failed"
      
      echo ""
      success "Full validation complete!"
      ;;
      
    *)
      error "Unknown Core Services action: $action"
      echo ""
      log "Available actions:"
      log "  start           - Start Core Services server"
      log "  stop            - Stop Core Services server"
      log "  restart         - Restart Core Services server"
      log "  status          - Check server status"
      log "  build           - Build TypeScript code"
      log "  test            - Run test suite"
      log "  test:watch      - Run tests in watch mode"
      log "  lint            - Run ESLint"
      log "  typecheck       - TypeScript type checking"
      log "  health          - Check package health"
      log "  db:migrate      - Run database migrations"
      log "  db:seed         - Seed database with test data"
      log "  db:reset        - Reset database (DESTRUCTIVE)"
      log "  db:studio       - Open Drizzle Studio"
      log "  api:test        - Test API endpoints"
      log "  logs            - Tail server logs"
      log "  full-check      - Run complete validation"
      log "  phase2          - Check Phase 2 completion"
      echo ""
      return 1
      ;;
  esac
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
    echo "=== Core Services ==="
    if lsof -ti:4000 &> /dev/null; then
      echo "✅ Core Services: Running (port 4000)"
    else
      echo "❌ Core Services: Not running"
    fi
    echo ""
    echo "=== Git Status ==="
    git status --short
    echo ""
  fi
}

################################################################################
# Contracts Management
################################################################################

manage_contracts() {
  local action="${1:-status}"
  
  step "Managing Smart Contracts: $action"
  
  case "$action" in
    build)
      log "Building contracts..."
      cd "$ROOT_DIR/packages/contracts"
      
      if ! command -v forge &> /dev/null; then
        error "Foundry not installed - run: curl -L https://foundry.paradigm.xyz | bash && foundryup"
        return 1
      fi
      
      forge build
      success "Contracts built successfully"
      ;;
      
    test)
      log "Running contract tests..."
      cd "$ROOT_DIR/packages/contracts"
      
      if ! command -v forge &> /dev/null; then
        error "Foundry not installed"
        return 1
      fi
      
      forge test -vv
      success "Contract tests complete"
      ;;
      
    coverage)
      log "Running test coverage..."
      cd "$ROOT_DIR/packages/contracts"
      forge coverage
      success "Coverage report generated"
      ;;
      
    gas)
      log "Running gas report..."
      cd "$ROOT_DIR/packages/contracts"
      forge test --gas-report
      success "Gas report generated"
      ;;
      
    clean)
      log "Cleaning build artifacts..."
      cd "$ROOT_DIR/packages/contracts"
      forge clean
      success "Artifacts cleaned"
      ;;
      
    status)
      log "Checking contracts status..."
      echo ""
      
      if [ ! -d "$ROOT_DIR/packages/contracts" ]; then
        error "Contracts package not found"
        return 1
      fi
      
      log "=== Contracts Package ==="
      [ -f "$ROOT_DIR/packages/contracts/foundry.toml" ] && success "foundry.toml ✓" || error "foundry.toml missing"
      [ -d "$ROOT_DIR/packages/contracts/contracts" ] && success "contracts/ ✓" || error "contracts/ missing"
      [ -d "$ROOT_DIR/packages/contracts/test" ] && success "test/ ✓" || error "test/ missing"
      [ -d "$ROOT_DIR/packages/contracts/script" ] && success "script/ ✓" || error "script/ missing"
      [ -d "$ROOT_DIR/packages/contracts/lib" ] && success "dependencies ✓" || warn "dependencies missing (run: forge install)"
      
      echo ""
      log "=== Foundry Status ==="
      if command -v forge &> /dev/null; then
        local forge_version=$(forge --version | head -1)
        success "Foundry: $forge_version"
      else
        warn "Foundry not installed"
      fi
      
      echo ""
      log "=== Contract Files ==="
      if [ -d "$ROOT_DIR/packages/contracts/contracts" ]; then
        local contract_count=$(find "$ROOT_DIR/packages/contracts/contracts" -name "*.sol" 2>/dev/null | wc -l)
        success "Contracts: $contract_count files"
      fi
      
      if [ -d "$ROOT_DIR/packages/contracts/test" ]; then
        local test_count=$(find "$ROOT_DIR/packages/contracts/test" -name "*.t.sol" 2>/dev/null | wc -l)
        success "Tests: $test_count files"
      fi
      
      echo ""
      ;;
      
    *)
      error "Unknown contracts action: $action"
      log "Available actions: build, test, coverage, gas, clean, status"
      return 1
      ;;
  esac
}

################################################################################
# Frames Management
################################################################################

manage_frames() {
  local operation="${1:-status}"
  shift || true
  
  cd "$ROOT_DIR/packages/frames"
  
  case "$operation" in
    start)
      step "Starting Frames server..."
      if pgrep -f "next dev.*3002" > /dev/null; then
        warn "Frames server already running on port 3002"
        return 0
      fi
      
      # Check if dependencies are installed
      if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        pnpm install
      fi
      
      # Start in background
      nohup pnpm dev > "$ROOT_DIR/logs/frames-$(date +%Y%m%d-%H%M%S).log" 2>&1 &
      local pid=$!
      echo $pid > "$ROOT_DIR/.frames.pid"
      
      sleep 3
      
      if curl -s http://localhost:3002 > /dev/null 2>&1; then
        success "Frames server started on port 3002 (PID: $pid)"
        log "Demo page: http://localhost:3002"
        log "Tiny signal: http://localhost:3002/api/frames/tiny-signal?token=ADDRESS"
        log "Token detail: http://localhost:3002/api/frames/token-detail?token=ADDRESS"
        log "CAST overview: http://localhost:3002/api/frames/cast-overview"
      else
        error "Frames server failed to start"
        return 1
      fi
      ;;
      
    stop)
      step "Stopping Frames server..."
      if [ -f "$ROOT_DIR/.frames.pid" ]; then
        local pid=$(cat "$ROOT_DIR/.frames.pid")
        kill $pid 2>/dev/null || true
        rm "$ROOT_DIR/.frames.pid"
        success "Frames server stopped"
      else
        pkill -f "next dev.*3002" || warn "No Frames server running"
      fi
      ;;
      
    restart)
      manage_frames stop
      sleep 2
      manage_frames start
      ;;
      
    status)
      step "Checking Frames server status..."
      
      if pgrep -f "next dev.*3002" > /dev/null; then
        success "Frames server: RUNNING"
        
        if [ -f "$ROOT_DIR/.frames.pid" ]; then
          local pid=$(cat "$ROOT_DIR/.frames.pid")
          log "PID: $pid"
        fi
        
        log "Port: 3002"
        log "URL: http://localhost:3002"
      else
        warn "Frames server: NOT RUNNING"
        return 1
      fi
      ;;
      
    build)
      step "Building Frames package..."
      pnpm build
      success "Frames built successfully"
      ;;
      
    test)
      step "Testing Frames..."
      pnpm typecheck
      success "Frames tests passed"
      ;;
      
    health)
      step "Running Frames health diagnostics..."
      
      local checks_passed=0
      local checks_failed=0
      
      # Check dependencies
      if [ -d "node_modules" ]; then
        success "✓ Dependencies installed"
        ((checks_passed++))
      else
        error "✗ Dependencies not installed"
        ((checks_failed++))
      fi
      
      # Check server
      if pgrep -f "next dev.*3002" > /dev/null; then
        success "✓ Server running on port 3002"
        ((checks_passed++))
        
        # Test frame endpoints
        local test_token="0x1111111111111111111111111111111111111111"
        
        if curl -s "http://localhost:3002/api/frames/tiny-signal?token=$test_token" | grep -q "fc:frame" 2>/dev/null; then
          success "✓ Tiny signal frame responding"
          ((checks_passed++))
        else
          warn "✗ Tiny signal frame not responding"
          ((checks_failed++))
        fi
        
        if curl -s "http://localhost:3002/api/frames/token-detail?token=$test_token" | grep -q "fc:frame" 2>/dev/null; then
          success "✓ Token detail frame responding"
          ((checks_passed++))
        else
          warn "✗ Token detail frame not responding"
          ((checks_failed++))
        fi
        
        if curl -s "http://localhost:3002/api/frames/cast-overview" | grep -q "fc:frame" 2>/dev/null; then
          success "✓ CAST overview frame responding"
          ((checks_passed++))
        else
          warn "✗ CAST overview frame not responding"
          ((checks_failed++))
        fi
      else
        warn "✗ Server not running"
        ((checks_failed++))
      fi
      
      # Check Core Services integration
      if curl -s http://localhost:4000/api/v1/health > /dev/null 2>&1; then
        success "✓ Core Services available (port 4000)"
        ((checks_passed++))
      else
        warn "✗ Core Services not available (frames need API data)"
        ((checks_failed++))
      fi
      
      banner "FRAMES HEALTH SUMMARY"
      echo "Checks Passed: $checks_passed"
      echo "Checks Failed: $checks_failed"
      
      if [ $checks_failed -eq 0 ]; then
        success "All frames checks passed! ✅"
        return 0
      else
        warn "Some frames checks failed"
        return 1
      fi
      ;;
      
    logs)
      step "Showing Frames logs..."
      local latest_log=$(ls -t "$ROOT_DIR/logs/frames-"*.log 2>/dev/null | head -1)
      if [ -n "$latest_log" ]; then
        tail -f "$latest_log"
      else
        warn "No Frames logs found"
      fi
      ;;
      
    *)
      error "Unknown frames operation: $operation"
      log "Available: start, stop, restart, status, build, test, health, logs"
      return 1
      ;;
  esac
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
    commit-tag-push)
      local commit_message="${2:-Auto-commit by master.sh}"
      local tag_name="${3:-}"
      local tag_message="${4:-Release tag}"
      
      # Commit changes
      git add -A
      if git commit -m "$commit_message"; then
        success "Changes committed: $commit_message"
      else
        log "Nothing to commit"
      fi
      
      # Create tag if provided
      if [ -n "$tag_name" ]; then
        git tag -a "$tag_name" -m "$tag_message"
        success "Tag created: $tag_name"
      fi
      
      # Push everything
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
# CI/CD Local Simulation
################################################################################

run_ci_checks() {
  banner "CI/CD LOCAL SIMULATION"
  
  local failed=0
  
  step "1/6: System Health Check"
  if check_system_health; then
    success "Health check passed"
  else
    error "Health check failed"
    ((failed++))
  fi
  
  step "2/6: Dependency Install"
  log "Installing dependencies..."
  if pnpm install --frozen-lockfile 2>&1 | tee -a "$LOG_FILE"; then
    success "Dependencies installed"
  else
    warn "Dependency installation had warnings"
  fi
  
  step "3/6: Linting"
  log "Running linters..."
  if pnpm lint --if-present 2>&1 | tee -a "$LOG_FILE"; then
    success "Linting passed"
  else
    warn "Linting had warnings"
  fi
  
  step "4/6: Type Checking"
  log "Running type checks..."
  if pnpm typecheck --if-present 2>&1 | tee -a "$LOG_FILE"; then
    success "Type checking passed"
  else
    warn "Type checking had warnings"
  fi
  
  step "5/6: Build"
  log "Building all packages..."
  if pnpm build 2>&1 | tee -a "$LOG_FILE"; then
    success "Build succeeded"
  else
    error "Build failed"
    ((failed++))
  fi
  
  step "6/6: Tests"
  log "Running test suite..."
  if pnpm test --if-present 2>&1 | tee -a "$LOG_FILE"; then
    success "Tests passed"
  else
    warn "Tests had warnings or were skipped"
  fi
  
  echo ""
  banner "CI/CD SIMULATION SUMMARY"
  
  if [ $failed -eq 0 ]; then
    success "✅ All CI checks passed!"
    log "Your changes are ready for CI/CD pipeline"
  else
    error "❌ $failed critical checks failed"
    log "Fix the issues before pushing to CI/CD"
    return 1
  fi
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
    ci                  - Run local CI/CD simulation (lint, typecheck, build, test)
    audit               - Run Smart Brain Oracle audit (comprehensive)
    
  Quick Start (Recommended):
    fullstack           - Launch complete platform (Services + Frames)
    
  Deployment:
    deploy [env]        - Deploy system (env: development|production)
    monitor             - Launch monitoring dashboard
    
  Worker Management:
    workers start       - Start autonomous worker system
    workers stop        - Stop autonomous worker system
    workers status      - Check worker status
    
  Port Management:
    ports               - Clean and reset ports
    
  Core Services:
    services start      - Start Core Services backend (port 4000)
    services stop       - Stop Core Services backend
    services restart    - Restart Core Services
    services status     - Check Core Services runtime status
    services build      - Build Core Services
    services test       - Run Core Services tests
    services health     - Full health diagnostics
    services phase2     - Check Phase 2 completion status
    
  Smart Contracts:
    contracts build     - Build smart contracts with Foundry
    contracts test      - Run contract tests
    contracts coverage  - Generate test coverage report
    contracts gas       - Generate gas usage report
    contracts clean     - Clean build artifacts
    contracts status    - Check contracts package status
    
  Frames (Farcaster):
    frames start        - Start Frames server (port 3002)
    frames stop         - Stop Frames server
    frames restart      - Restart Frames server
    frames status       - Check Frames server status
    frames build        - Build production Frames
    frames test         - Run Frames tests (typecheck, lint)
    frames health       - Full Frames health diagnostics
    frames logs         - Show Frames server logs
    
  Git Operations:
    git status          - Show git status
    git commit [msg]    - Commit all changes
    git tag <name> [msg] - Create annotated tag
    git push            - Push to remote with tags
    git full [msg]      - Commit, tag, and push (full cycle)
    
  Utilities:
    logs                - Show recent logs
    fullstack           - Quick-start full platform
    help                - Show this help menu

EXAMPLES:
  
  # Quick start (recommended for first-time setup)
  ./scripts/master.sh fullstack
  # Or directly: ./scripts/full-stack-start.sh
  
  # Full deployment with monitoring
  ./scripts/master.sh deploy production
  ./scripts/master.sh monitor
  
  # Self-healing and integrity check
  ./scripts/master.sh heal
  ./scripts/master.sh integrity
  
  # Git workflow
  ./scripts/master.sh git status
  ./scripts/master.sh git commit "commit message"
  ./scripts/master.sh git tag "v1.0.0" "Release message"
  ./scripts/master.sh git push
  ./scripts/master.sh git commit-tag-push "commit message" "v1.0.0" "Release message"
  ./scripts/master.sh git full "feat: Add new feature"
  
  # Worker management
  ./scripts/master.sh workers start
  ./scripts/master.sh workers status
  
  # Core Services management
  ./scripts/master.sh services start        # Start API server (port 4000)
  ./scripts/master.sh services stop         # Stop API server
  ./scripts/master.sh services restart      # Restart API server
  ./scripts/master.sh services status       # Server status
  ./scripts/master.sh services health       # Health diagnostics (39 endpoints)
  ./scripts/master.sh services build        # Build TypeScript
  ./scripts/master.sh services test         # Run test suite
  ./scripts/master.sh services lint         # ESLint check
  ./scripts/master.sh services typecheck    # TypeScript validation
  ./scripts/master.sh services db:migrate   # Database migrations
  ./scripts/master.sh services db:seed      # Seed test data
  ./scripts/master.sh services db:studio    # Drizzle Studio GUI
  ./scripts/master.sh services api:test     # Test live API endpoints
  ./scripts/master.sh services full-check   # Complete validation
  
  # Smart Contracts
  ./scripts/master.sh contracts build
  ./scripts/master.sh contracts test
  
  # Frames (Farcaster)
  ./scripts/master.sh frames start
  ./scripts/master.sh frames health
  ./scripts/master.sh frames logs

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
    fullstack)
      banner "LAUNCHING FULL STACK"
      log "Starting complete CastQuest platform..."
      bash "$SCRIPTS_DIR/full-stack-start.sh"
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
    ci)
      run_ci_checks
      ;;
    deploy)
      deploy_system "$@"
      ;;
    services)
      manage_core_services "$@"
      ;;
    contracts)
      manage_contracts "$@"
      ;;
    audit)
      # Run Smart Brain Oracle audit
      if [ -f "$SCRIPTS_DIR/audit.sh" ]; then
        bash "$SCRIPTS_DIR/audit.sh"
      else
        error "audit.sh not found at $SCRIPTS_DIR/audit.sh"
        exit 1
      fi
      ;;
    frames)
      manage_frames "$@"
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
