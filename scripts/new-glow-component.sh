#!/usr/bin/env bash
set -euo pipefail

NAME="$1"
if [ -z "$NAME" ]; then
  echo "Usage: ./new-glow-component.sh ComponentName"
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMP="$ROOT/packages/neo-ux-core/src/components/$NAME.tsx"

cat > "$COMP" <<EOT
import { ReactNode } from "react";
import { neo } from "../theme";

interface ${NAME}Props {
  children: ReactNode;
}

export function ${NAME}({ children }: ${NAME}Props) {
  return (
    <div className={\`p-4 rounded-md bg-neutral-900 border border-neutral-800 \${neo.glow.idle}\`}>
      {children}
    </div>
  );
}
EOT

echo "export * from \"./components/$NAME\";" >> "$ROOT/packages/neo-ux-core/src/index.ts"

cd "$ROOT/packages/neo-ux-core"
pnpm build

echo "Glow component '$NAME' created and built."
