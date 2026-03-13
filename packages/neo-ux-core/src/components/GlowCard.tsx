import { HTMLAttributes, ReactNode } from "react";
import { neo } from "../theme";

export interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlowCard({ children, className = "", ...props }: GlowCardProps) {
  return (
    <div
      {...props}
      className={`p-4 rounded-lg bg-neutral-900 border border-neutral-800 ${neo.glow.idle} ${className}`}
    >
      {children}
    </div>
  );
}
