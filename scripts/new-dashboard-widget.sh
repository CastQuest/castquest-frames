#!/usr/bin/env bash
set -euo pipefail

NAME="$1"
if [ -z "$NAME" ]; then
  echo "Usage: ./new-dashboard-widget.sh WidgetName"
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE="$ROOT/packages/neo-ux-core/src/dashboard/$NAME.tsx"

cat > "$FILE" <<EOT
import { ReactNode } from "react";
import { neo } from "../theme";

interface ${NAME}Props {
  children: ReactNode;
}

export function ${NAME}({ children }: ${NAME}Props) {
  return (
    <div className={\`p-4 rounded-lg bg-neutral-900 border border-neutral-800 \${neo.glow.idle}\`}>
      {children}
    </div>
  );
}
EOT

echo "export * from \"./dashboard/$NAME\";" >> "$ROOT/packages/neo-ux-core/src/index.ts"

cd "$ROOT/packages/neo-ux-core"
pnpm build

echo "Dashboard widget '$NAME' created and built."
