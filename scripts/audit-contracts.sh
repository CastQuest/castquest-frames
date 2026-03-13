#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# CastQuest — Smart Contract Audit Script
# ═══════════════════════════════════════════════════════════
# Usage: bash scripts/audit-contracts.sh
#
# Runs available static analysis tools on the Solidity contracts.
# Prerequisites:
#   - Foundry (forge): https://getfoundry.sh
#   - Slither (optional): pip install slither-analyzer
# ═══════════════════════════════════════════════════════════

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$REPO_ROOT/packages/contracts"
AUDIT_DIR="$REPO_ROOT/docs/audits"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p "$AUDIT_DIR"

echo ""
echo "══════════════════════════════════════════════"
echo " CastQuest — Smart Contract Audit"
echo "══════════════════════════════════════════════"
echo " Contracts: $CONTRACTS_DIR"
echo " Timestamp: $TIMESTAMP"
echo "══════════════════════════════════════════════"
echo ""

cd "$CONTRACTS_DIR"

# ─────────────────────────────────────────────
# 1. Forge Build
# ─────────────────────────────────────────────
echo "▶  Step 1: Building contracts with Forge..."
if command -v forge >/dev/null 2>&1; then
  forge build --sizes 2>&1 | tee "$AUDIT_DIR/build_$TIMESTAMP.log"
  echo "  ✅ Build complete"
else
  echo "  ⚠️  forge not found — skipping build (install: https://getfoundry.sh)"
fi
echo ""

# ─────────────────────────────────────────────
# 2. Forge Tests
# ─────────────────────────────────────────────
echo "▶  Step 2: Running Forge tests..."
if command -v forge >/dev/null 2>&1; then
  forge test -vv 2>&1 | tee "$AUDIT_DIR/tests_$TIMESTAMP.log"
  echo "  ✅ Tests complete"
else
  echo "  ⚠️  forge not found — skipping tests"
fi
echo ""

# ─────────────────────────────────────────────
# 3. Forge Coverage
# ─────────────────────────────────────────────
echo "▶  Step 3: Generating test coverage report..."
if command -v forge >/dev/null 2>&1; then
  if forge coverage --report lcov 2>&1 | tee "$AUDIT_DIR/coverage_$TIMESTAMP.log"; then
    echo "  ✅ Coverage report generated"
  else
    echo "  ⚠️  Coverage generation encountered issues — see $AUDIT_DIR/coverage_$TIMESTAMP.log"
  fi
else
  echo "  ⚠️  forge not found — skipping coverage"
fi
echo ""

# ─────────────────────────────────────────────
# 4. Slither Static Analysis
# ─────────────────────────────────────────────
echo "▶  Step 4: Running Slither static analysis..."
if command -v slither >/dev/null 2>&1; then
  slither . --config-file slither.config.json \
    --json "$AUDIT_DIR/slither_$TIMESTAMP.json" \
    2>&1 | tee "$AUDIT_DIR/slither_$TIMESTAMP.log" || true
  echo "  ✅ Slither analysis complete — see $AUDIT_DIR/slither_$TIMESTAMP.json"
else
  echo "  ⚠️  slither not found — install with: pip install slither-analyzer"
  echo "      Then re-run this script for full static analysis."
fi
echo ""

# ─────────────────────────────────────────────
# 5. Forge Gas Report
# ─────────────────────────────────────────────
echo "▶  Step 5: Generating gas usage report..."
if command -v forge >/dev/null 2>&1; then
  forge test --gas-report 2>&1 | tee "$AUDIT_DIR/gas_$TIMESTAMP.log" || true
  echo "  ✅ Gas report generated"
else
  echo "  ⚠️  forge not found — skipping gas report"
fi
echo ""

echo "══════════════════════════════════════════════"
echo " Audit complete. Reports saved to: $AUDIT_DIR"
echo "══════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo "  1. Review Slither findings in $AUDIT_DIR/slither_$TIMESTAMP.json"
echo "  2. Fill in docs/AUDIT-REPORT-TEMPLATE.md with findings"
echo "  3. Fix any HIGH or CRITICAL findings before deployment"
echo ""
