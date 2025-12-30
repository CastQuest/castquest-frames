#!/usr/bin/env bash
set -euo pipefail

# Contracts Build Script - Foundry workflow with Smart Brain Integration

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/packages/contracts"
SCRIPTS_DIR="$ROOT_DIR/scripts"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🧠 CastQuest Smart Contracts Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

cd "$CONTRACTS_DIR"

if ! command -v forge &> /dev/null; then
  error "Foundry not installed"
  warn "Install: curl -L https://foundry.paradigm.xyz | bash && foundryup"
  exit 1
fi

success "Foundry detected: $(forge --version | head -1)"

################################################################################
# Self-Healing: Auto-Repair Dependencies
################################################################################

echo ""
log "🔧 Self-Healing: Dependency Check"

if [ ! -d "lib" ] || [ -z "$(ls -A lib 2>/dev/null)" ]; then
  warn "Dependencies missing - initiating self-healing"
  log "Installing Foundry dependencies..."
  forge install || {
    error "Failed to install dependencies"
    exit 1
  }
  success "Dependencies auto-repaired ✓"
else
  success "Dependencies present ✓"
fi

# Verify critical dependencies
required_deps=("openzeppelin-contracts" "forge-std")
for dep in "${required_deps[@]}"; do
  if [ -d "lib/$dep" ]; then
    success "  ✓ $dep"
  else
    warn "  ⚠ $dep missing - attempting install"
    case "$dep" in
      openzeppelin-contracts)
        forge install OpenZeppelin/openzeppelin-contracts || warn "Could not install $dep"
        ;;
      forge-std)
        forge install foundry-rs/forge-std || warn "Could not install $dep"
        ;;
    esac
  fi
done

################################################################################
# Compilation
################################################################################

echo ""
log "📦 Compiling contracts..."

if forge build --skip test; then
  success "✅ Compilation successful"
else
  error "❌ Compilation failed"
  exit 1
fi

################################################################################
# Testing
################################################################################

echo ""
log "🧪 Running tests..."

if forge test -vv; then
  success "✅ All tests passed"
else
  error "❌ Some tests failed"
  exit 1
fi

################################################################################
# Smart Brain Oracle Audit Integration
################################################################################

echo ""
log "🧠 Triggering Smart Brain Oracle Audit..."

if [ -f "$SCRIPTS_DIR/audit.sh" ]; then
  bash "$SCRIPTS_DIR/audit.sh" || warn "Audit completed with warnings"
  success "Smart Brain audit complete"
else
  warn "audit.sh not found - skipping Smart Brain audit"
  log "Create audit script: $SCRIPTS_DIR/audit.sh"
fi

################################################################################
# Summary
################################################################################

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "✅ Contracts workflow complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log "Next steps:"
log "  • Review audit report: $ROOT_DIR/AUDIT-REPORT.md"
log "  • Check logs: $ROOT_DIR/logs/audit-*.log"
log "  • Deploy: ./scripts/master.sh deploy production"
echo ""
