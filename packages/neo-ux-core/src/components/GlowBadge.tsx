import { ReactNode } from "react";
import { neo } from "../theme";

interface GlowBadgeProps {
  children: ReactNode;
}

export function GlowBadge({ children }: GlowBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold uppercase tracking-wide ${neo.glow.idle}`}
    >
      {children}
    </span>
  );
}
