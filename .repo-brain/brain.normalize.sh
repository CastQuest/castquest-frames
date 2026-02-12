#!/usr/bin/env bash
set -e

echo "🔧 Normalizing structure"

# Node patch for package.json (safe on Windows)
if [[ -f package.json ]]; then
  node -e '
    const fs = require("fs");
    const p = "package.json";
    const pkg = JSON.parse(fs.readFileSync(p));
    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.test) pkg.scripts.test = "echo \"No tests defined\"";
    fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
  '
fi
