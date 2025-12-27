#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/port-detect.sh 3000
# Returns first free port >= given port

START_PORT="${1:-3000}"

port="$START_PORT"
while lsof -i ":$port" >/dev/null 2>&1; do
  port=$((port + 1))
done

echo "$port"
