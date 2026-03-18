import { ReactNode } from "react";
import { neo } from "../theme";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <div
      className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle} ${className}`}
    >
      {children}
    </div>
  );
}
