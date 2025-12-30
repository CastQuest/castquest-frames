#!/usr/bin/env bash
set -euo pipefail

TYPE="$1"
NAME="$2"

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
  echo "Usage: ./new-visualization.sh brain|worker Name"
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="$ROOT/packages/neo-ux-core/src/$TYPE"
FILE="$DIR/$NAME.tsx"

cat > "$FILE" <<EOT
import { ReactNode } from "react";
import { neo } from "../theme";

interface ${NAME}Props {
  children: ReactNode;
}

export function ${NAME}({ children }: ${NAME}Props) {
  return (
    <div className={\`p-4 rounded-lg bg-neutral-900 border border-neutral-800 \${neo.glow.active}\`}>
      {children}
    </div>
  );
}
EOT

echo "export * from \"./$TYPE/$NAME\";" >> "$ROOT/packages/neo-ux-core/src/index.ts"

cd "$ROOT/packages/neo-ux-core"
pnpm build

echo "Visualization '$NAME' created in $TYPE and built."
