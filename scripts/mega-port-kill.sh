#!/usr/bin/env bash
set -euo pipefail

echo "=============================================================="
echo " MEGA PORT KILLER — Destroying all zombie Next.js processes"
echo "=============================================================="

pkill -f next || true
pkill -f "node .*next" || true

for p in 3000 3001 3002 3003 3010 3011 3012; do
  if lsof -i ":$p" >/dev/null 2>&1; then
    pid=$(lsof -t -i ":$p")
    echo "[KILL] Port $p (PID $pid)"
    kill -9 "$pid" || true
  else
    echo "[FREE] Port $p"
  fi
done

echo "=============================================================="
echo " Ports cleaned. Ready for fresh dev launch."
echo "=============================================================="
