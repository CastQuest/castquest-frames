#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
BRAIN="$ROOT/.repo-brain"

log() { echo "🧠 [BRAIN] $1"; }

require() {
  [[ -x "$BRAIN/$1" ]] || {
    log "Missing $1 — brain incomplete"
    exit 1
  }
}

log "Booting repo brain"

require brain.detect.sh
require brain.scan-actions.sh
require brain.frameworks.sh
require brain.frameworks.ci.sh
require brain.solidity.detect.sh
require brain.solidity.ci.sh
require brain.rust.sh
require brain.normalize.sh
require brain.diagnose.sh
require brain.fix.safe.sh
require brain.verify.sh
require brain.ai.guard.sh
require brain.greenlock.sh
require brain.guard.sh


"$BRAIN/brain.detect.sh"
"$BRAIN/brain.scan-actions.sh"
"$BRAIN/brain.frameworks.sh"
"$BRAIN/brain.frameworks.ci.sh"
"$BRAIN/brain.solidity.detect.sh"
"$BRAIN/brain.solidity.ci.sh"
"$BRAIN/brain.rust.sh"
"$BRAIN/brain.normalize.sh"
"$BRAIN/brain.diagnose.sh"
"$BRAIN/brain.fix.safe.sh"
"$BRAIN/brain.verify.sh"
"$BRAIN/brain.ai.guard.sh"
"$BRAIN/brain.greenlock.sh"
"$BRAIN/brain.guard.sh"

log "Repo brain run completed"
