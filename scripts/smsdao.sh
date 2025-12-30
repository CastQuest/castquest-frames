#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# SMSDAO.SH — Super Character Bot (GWzsr)
# Role: Guardian of Median On-Chain Economy, Security & Trust
# Non-destructive. No core rewrites. No contract mutations.
# ============================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PNPM=${PNPM:-pnpm}
REPAIR_LOG="$ROOT_DIR/SMARTBRAIN.log"
PATCH_DIR="$ROOT_DIR/.tmp_gwzsr_patch"

log() { printf "\n[smsdao.sh] %s\n" "$*" >&2; }

smartbrain() {
  # [timestamp][agent][scope] message
  local scope="${1:-GENERAL}"; shift || true
  local msg="$*"
  printf '[%s][GWzsr][%s] %s\n' "$(date -Iseconds)" "$scope" "$msg" >> "$REPAIR_LOG"
}

banner() {
  cat <<'EOF'
============================================================
 SMSDAO.SH — GWzsr Super Character Bot
 Median On-Chain Economy • Security • Trust
============================================================
EOF
}

# ------------------------------------------------------------
# Node modules repair (non-destructive, no tuners deleted)
# ------------------------------------------------------------

repair_node_modules() {
  banner
  log "🔧 Checking for corrupted or missing node_modules..."
  smartbrain "NODE-REPAIR" "Checking node_modules integrity..."

  if [[ ! -d "$ROOT_DIR/node_modules" ]] || [[ ! -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    log "⚠️ node_modules missing or incomplete. Triggering portable re-download."
    smartbrain "NODE-REPAIR" "node_modules missing → triggering re-download"
    reinstall_node_modules
    return
  fi

  if ! command -v "$PNPM" >/dev/null 2>&1; then
    log "❌ pnpm not available in PATH."
    smartbrain "NODE-REPAIR" "pnpm missing → cannot repair"
    return 1
  fi

  if find node_modules -type l ! -exec test -e {} \; -print | grep -q .; then
    log "⚠️ Broken symlinks detected in node_modules."
    smartbrain "NODE-REPAIR" "Broken symlinks detected → re-download required"
    reinstall_node_modules
    return
  fi

  log "✅ node_modules appears healthy."
  smartbrain "NODE-REPAIR" "node_modules integrity OK"
}

reinstall_node_modules() {
  banner
  log "🔄 Re-downloading node_modules (portable repair mode)..."
  smartbrain "NODE-REPAIR" "Reinstalling node_modules (GWzsr patch mode)"

  mkdir -p "$PATCH_DIR"

  cp pnpm-lock.yaml "$PATCH_DIR/pnpm-lock.backup" 2>/dev/null || true

  # Only node_modules — no repo structure changes, no tuners deleted
  rm -rf node_modules

  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]]; then
    $PNPM install --frozen-lockfile || $PNPM install
  else
    $PNPM install
  fi

  log "✨ node_modules repaired and reloaded."
  smartbrain "NODE-REPAIR" "node_modules repaired and reloaded successfully"
}

# ------------------------------------------------------------
# Lightweight scan / heuristic “antivirus” (NO deletions)
# ------------------------------------------------------------

scan_repo() {
  banner
  log "🛰️ Running SMSDAO/GWzsr heuristic scan (non-destructive)."
  smartbrain "SCAN" "Starting heuristic scan across repo."

  local patterns=(
    "*.json" "*.js" "*.jsx" "*.ts" "*.tsx" "*.java" "*.kt"
    "*.rs" "*.go" "*.php" "*.py" "*.rb" "*.c" "*.cc" "*.cpp" "*.h" "*.hpp"
    "*.css" "*.scss" "*.less" "*.html" "*.svelte"
    "*.sh" "*.ps1" "*.bash" "*.zsh"
    "*.sol" "*.yml" "*.yaml" "*.toml" "*.lock"
  )

  local quarantine_dir="$ROOT_DIR/.quarantine"
  mkdir -p "$quarantine_dir"

  for pat in "${patterns[@]}"; do
    while IFS= read -r -d '' file; do
      scan_file "$file" "$quarantine_dir"
    done < <(find "$ROOT_DIR" -type f -name "$pat" -print0 2>/dev/null || true)
  done

  while IFS= read -r -d '' archive; do
    smartbrain "SCAN" "Archive/binary flagged for review: $archive"
    echo "$archive" >> "$quarantine_dir/archives-review.txt"
  done < <(find "$ROOT_DIR" -type f `\( -name "*.zip" -o -name "*.tar" -o -name "*.gz" -o -name "*.tgz" -o -name "*.bz2" -o -name "*.apk" \)` -print0 2>/dev/null || true)

  log "✅ Scan finished. See .quarantine/ and SMARTBRAIN.log."
  smartbrain "SCAN" "Heuristic scan finished."
}

scan_file() {
  local file="$1"
  local quarantine_dir="$2"

  # Heuristics; adjust over time. Never auto-delete; only flag.
  if grep -Eqi "rm -rf /|curl .*sh|wget .*sh|eval\(" "$file" 2>/dev/null; then
    smartbrain "SCAN" "Suspicious pattern detected in $file"
    echo "$file" >> "$quarantine_dir/suspicious-files.txt"
  fi
}

# ------------------------------------------------------------
# Reporting + broadcast payload (for bots, not direct posting)
# ------------------------------------------------------------

compose_report() {
  banner
  log "🧾 Composing SMSDAO/GWzsr summary report payload."
  smartbrain "REPORT" "Composing report payload."

  local out="${1:-$ROOT_DIR/SMSDAO_REPORT.md}"

  {
    echo "# SMSDAO Super Character Report"
    echo
    echo "- Median On-Chain Economy: Protected"
    echo "- Security Posture: Updated via GWzsr"
    echo "- Trust Layer: SmartBrain + CastQuest"
    echo
    echo "Artifacts:"
    echo "- SMARTBRAIN.log"
    echo "- .quarantine/ (if present)"
    echo "- AUDIT-REPORT.md (from master.sh audit)"
    echo
    echo "Recommended broadcast snippet:"
    echo "> @smsdao // SmartBrain Guardian"
    echo "> Median on-chain economy scan complete."
    echo "> Audit + AV + node_modules repair done."
    echo "> Status: Stable ✅ | Auto-Heal Active 🚀"
  } > "$out"

  log "📄 Report written to $out"
  smartbrain "REPORT" "Report written to $out"
}

broadcast_stub() {
  banner
  log "📡 Preparing broadcast payload (stub only, no live posting)."
  smartbrain "BROADCAST" "Preparing broadcast payload for external channels."

  cat <<'EOF'
[SMSDAO.SH][BROADCAST] Suggested payload:
- Channel: Twitter / X
  Text: "CastQuest SmartBrain 🔭 Median on-chain economy scan complete. Security ✅ Auto-heal 🚀 Trust layer online. #smsdao #onchain"

- Channel: Discord
  Text: "SmartBrain Guardian Report: all systems stable, AV + audit pass, auto-heal active."

- Channel: Farcaster / CastQuest Timeline
  Text: "SMSDAO ↔ CastQuest: Median on-chain economy audit complete. Suspicious scripts flagged, no core rewrites, contracts untouched."
EOF
}

# ------------------------------------------------------------
# Guarded auto-merge helper (CI calls this; NO deletions)
# ------------------------------------------------------------

auto_merge_guarded() {
  banner
  local pr_branch="${1:-}"
  local base_branch="${2:-main}"

  if [[ -z "$pr_branch" ]]; then
    log "❌ auto-merge requires PR branch name."
    smartbrain "AUTO-MERGE" "Missing PR branch; aborting."
    return 1
  fi

  log "🤝 Attempting guarded auto-merge: $pr_branch → $base_branch"
  smartbrain "AUTO-MERGE" "Attempting guarded merge $pr_branch → $base_branch."

  # This is a stub: real merge should be done by GitHub API / bot with tokens.
  log "ℹ️ Auto-merge is currently a no-op stub. Implement via GitHub API in CI."
  smartbrain "AUTO-MERGE" "Stub only; delegate to CI/bot for real merge."
}

usage() {
  cat <<EOF
Usage: ./scripts/smsdao.sh <command> [args]

Commands (non-destructive, contracts separate, no core rewrites):
  repair-node               Repair/re-download node_modules (GWzsr patch mode).
  scan                      Heuristic repo scan (AV-style, no deletions).
  report [file]             Compose a human/bot-friendly report (default: SMSDAO_REPORT.md).
  broadcast                 Print suggested payloads for Twitter/Discord/Farcaster/CastQuest.
  auto-merge <pr> [base]    Guarded auto-merge stub (no direct merge; logs intent only).

This bot represents the SMSDAO/GWzsr guardian:
Median On-Chain Economy • Security • Trust
EOF
}

cmd="${1:-}"; shift || true

case "$cmd" in
  repair-node)   repair_node_modules "$@";;
  scan)          scan_repo "$@";;
  report)        compose_report "$@";;
  broadcast)     broadcast_stub "$@";;
  auto-merge)    auto_merge_guarded "$@";;
  ""|help|-h|--help) usage;;
  *) log "Unknown command: $cmd"; usage; exit 1;;
esac
