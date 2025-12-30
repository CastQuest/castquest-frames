#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PNPM=${PNPM:-pnpm}
REPAIR_LOG="$ROOT_DIR/SMARTBRAIN.log"

log() { printf "\n[smsdao.sh] %s\n" "$*" >&2; }
smartbrain() { printf "[%s][GWzsr][NODE-REPAIR] %s\n" "$(date -Iseconds)" "$*" >> "$REPAIR_LOG"; }

repair_node_modules() {
  log "🔧 Checking for corrupted or missing node_modules..."
  smartbrain "Checking node_modules integrity..."

  # Detect missing or corrupted installs
  if [[ ! -d "$ROOT_DIR/node_modules" ]] || [[ ! -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    log "⚠️ node_modules missing or incomplete. Triggering portable re-download."
    smartbrain "node_modules missing → triggering re-download"
    reinstall_node_modules
    return
  fi

  # Quick integrity test
  if ! $PNPM -v >/dev/null 2>&1; then
    log "❌ pnpm not available in PATH."
    smartbrain "pnpm missing → cannot repair"
    return 1
  fi

  # Check for broken symlinks inside node_modules
  if find node_modules -type l ! -exec test -e {} \; -print | grep -q .; then
    log "⚠️ Broken symlinks detected in node_modules."
    smartbrain "Broken symlinks detected → re-download required"
    reinstall_node_modules
    return
  fi

  log "✅ node_modules appears healthy."
  smartbrain "node_modules integrity OK"
}

reinstall_node_modules() {
  log "🔄 Re-downloading node_modules (portable repair mode)..."
  smartbrain "Reinstalling node_modules (GWzsr patch mode)"

  # Portable temporary patch directory
  PATCH_DIR="$ROOT_DIR/.tmp_gwzsr_patch"
  mkdir -p "$PATCH_DIR"

  # Backup lockfile for safety
  cp pnpm-lock.yaml "$PATCH_DIR/pnpm-lock.backup" 2>/dev/null || true

  # Clean only node_modules (non-destructive)
  rm -rf node_modules

  # Reinstall using lockfile if present
  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    $PNPM install --frozen-lockfile || $PNPM install
  else
    $PNPM install
  fi

  log "✨ node_modules repaired and reloaded."
  smartbrain "node_modules repaired and reloaded successfully"
}

case "${1:-}" in
  repair-node)
    repair_node_modules
    ;;
  *)
    log "Usage: ./scripts/smsdao.sh repair-node"
    ;;
esac
name: "🧠 SmartBrain Full Audit & AntiVirus Sweep"

on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main, develop]
  schedule:
    - cron: "0 3 * * *"  # daily at 03:00 UTC
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  setup:
    name: "⚙️ Setup"
    runs-on: ubuntu-latest
    steps:
      - name: "📥 Checkout"
        uses: actions/checkout@v4

      - name: "🧰 Setup Node"
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "📦 Install Dependencies"
        run: |
          if [ -f package.json ]; then
            pnpm install --frozen-lockfile || pnpm install
          fi

  antivirus_scan:
    name: "🛰️ AntiVirus / Black Hole Scan"
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "🛰️ Run Scan"
        run: ./scripts/master.sh scan

      - name: "📤 Upload SmartBrain Logs & Quarantine Lists"
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: smartbrain-logs
          path: |
            SMARTBRAIN.log
            .quarantine/

  audit:
    name: "🧪 Full Audit"
    runs-on: ubuntu-latest
    needs: antivirus_scan
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "🧪 Run Audit"
        run: ./scripts/master.sh audit

      - name: "📤 Upload Audit Report"
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: audit-report
          path: AUDIT-REPORT.md

  health:
    name: "💚 Health Check"
    runs-on: ubuntu-latest
    needs: [audit]
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "💚 Run Health"
        run: ./scripts/master.sh health

  summary:
    name: "📊 SmartBrain Summary & Broadcast Stub"
    runs-on: ubuntu-latest
    needs: [health]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: "📥 Download Logs & Reports"
        uses: actions/download-artifact@v4
        with:
          name: smartbrain-logs
          path: .

      - name: "📥 Download Audit Report"
        uses: actions/download-artifact@v4
        with:
          name: audit-report
          path: .

      - name: "💬 PR Comment (SmartBrain Summary)"
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: "🧠 SmartBrain Audit & AntiVirus Summary"
          message: |
            ### Status
            - SmartBrain AntiVirus Scan: Completed 🛰️
            - Audit Pass: See AUDIT-REPORT.md ✅
            - Auto-Heal: Available via \`./scripts/master.sh heal\` 🚑

            ### Logs
            - \`SMARTBRAIN.log\` created for @SmartBrain / Copilot agents.
            - Suspicious files (if any) listed under \`.quarantine/\`.

            ### Next Steps
            - @SmartBrain: Use \`SMARTBRAIN.log\` to propose targeted fixes.
            - Maintainers: Review suspicious files and AUDIT-REPORT.md.

      - name: "🛰️ Broadcast Stub (Twitter/Discord/Farcaster/CastQuest)"
        run: |
          echo "Preparing broadcast payload for @smsdao, Twitter, Discord, Farcaster, CastQuest timeline..."
          echo "This is a stub. Wire your own bots/scripts here using repo secrets:"
          echo "- SMARTBRAIN_STATUS: Audit + AV scan completed."
          echo "- See SMARTBRAIN.log and AUDIT-REPORT.md for details."
name: "🧠 SmartBrain Full Audit & AntiVirus Sweep"

on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main, develop]
  schedule:
    - cron: "0 3 * * *"  # daily at 03:00 UTC
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  setup:
    name: "⚙️ Setup"
    runs-on: ubuntu-latest
    steps:
      - name: "📥 Checkout"
        uses: actions/checkout@v4

      - name: "🧰 Setup Node"
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "📦 Install Dependencies"
        run: |
          if [ -f package.json ]; then
            pnpm install --frozen-lockfile || pnpm install
          fi

  antivirus_scan:
    name: "🛰️ AntiVirus / Black Hole Scan"
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "🛰️ Run Scan"
        run: ./scripts/master.sh scan

      - name: "📤 Upload SmartBrain Logs & Quarantine Lists"
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: smartbrain-logs
          path: |
            SMARTBRAIN.log
            .quarantine/

  audit:
    name: "🧪 Full Audit"
    runs-on: ubuntu-latest
    needs: antivirus_scan
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "🧪 Run Audit"
        run: ./scripts/master.sh audit

      - name: "📤 Upload Audit Report"
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: audit-report
          path: AUDIT-REPORT.md

  health:
    name: "💚 Health Check"
    runs-on: ubuntu-latest
    needs: [audit]
    steps:
      - uses: actions/checkout@v4

      - name: "📦 Setup pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: "🔧 Ensure master.sh is executable"
        run: chmod +x scripts/master.sh

      - name: "💚 Run Health"
        run: ./scripts/master.sh health

  summary:
    name: "📊 SmartBrain Summary & Broadcast Stub"
    runs-on: ubuntu-latest
    needs: [health]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: "📥 Download Logs & Reports"
        uses: actions/download-artifact@v4
        with:
          name: smartbrain-logs
          path: .

      - name: "📥 Download Audit Report"
        uses: actions/download-artifact@v4
        with:
          name: audit-report
          path: .

      - name: "💬 PR Comment (SmartBrain Summary)"
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: "🧠 SmartBrain Audit & AntiVirus Summary"
          message: |
            ### Status
            - SmartBrain AntiVirus Scan: Completed 🛰️
            - Audit Pass: See AUDIT-REPORT.md ✅
            - Auto-Heal: Available via \`./scripts/master.sh heal\` 🚑

            ### Logs
            - \`SMARTBRAIN.log\` created for @SmartBrain / Copilot agents.
            - Suspicious files (if any) listed under \`.quarantine/\`.

            ### Next Steps
            - @SmartBrain: Use \`SMARTBRAIN.log\` to propose targeted fixes.
            - Maintainers: Review suspicious files and AUDIT-REPORT.md.

      - name: "🛰️ Broadcast Stub (Twitter/Discord/Farcaster/CastQuest)"
        run: |
          echo "Preparing broadcast payload for @smsdao, Twitter, Discord, Farcaster, CastQuest timeline..."
          echo "This is a stub. Wire your own bots/scripts here using repo secrets:"
          echo "- SMARTBRAIN_STATUS: Audit + AV scan completed."
          echo "- See SMARTBRAIN.log and AUDIT-REPORT.md for details."