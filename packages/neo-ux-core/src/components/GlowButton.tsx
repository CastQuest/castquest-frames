"use client";
import { neo } from "../theme";

export function GlowButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={\`px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 \${neo.glow.active}\`}
    >
      {children}
    </button>
  );
}
