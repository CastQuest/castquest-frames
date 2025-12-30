import { ReactNode } from "react";
import { neo } from "../theme";

interface GlowPanelProps {
  children: ReactNode;
}

export function GlowPanel({ children }: GlowPanelProps) {
  return (
    <div className={`p-4 rounded-md bg-neutral-900 border border-neutral-800 ${neo.glow.idle}`}>
      {children}
    </div>
  );
}
