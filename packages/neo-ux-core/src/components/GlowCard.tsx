import { ReactNode } from "react";
import { neo } from "../theme";

interface GlowCardProps {
  children: ReactNode;
}

export function GlowCard({ children }: GlowCardProps) {
  return (
    <div
      className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}
    >
      {children}
    </div>
  );
}
